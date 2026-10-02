# 安装器 (Installer)

`installer` 模块用于安装, 更新, 卸载和检查 Android 应用, 并查询授权方式, 设备用户和默认安装器. 全局对象别名为 `$installer`.

从 AutoJs6 6.8.0 起, 此模块由外置 3-Setup Installer 插件提供. 使用前需在插件中心安装, 启用并授权兼容插件. [isAvailable](#m-isavailable) 和 [status](#p-status) 可用于探测插件; 插件缺失或不可用时, 实际操作抛出或以 Promise 拒绝 `code` 为 `PLUGIN_UNAVAILABLE` 的 [InstallerError](#c-installererror). 脚本 API 不会自动改走系统安装器.

`dhizuku`, 安装交互 `notification` 和默认安装器 `mode: 'persistent'` 需要宿主构建 5306 或更高版本, 以及声明对应能力的 3-Setup Installer 1.1.0 实现. 新宿主仍可连接 V1 插件, 不会向旧插件发送未知选项或新事务. 缺少 Dhizuku 能力时返回 `AUTHORIZER_UNAVAILABLE`; 缺少通知安装或持久默认能力时返回 `INVALID_ARGUMENT`. 插件正式发布与索引准入仍以 [插件路线图](https://github.com/SuperMonster003/AutoJs6-Plugin-Three-Setup-Installer/blob/master/ROADMAP.md) 为准, 本文不代表已完成远端发布或全部设备验收.

高级安装选项需要宿主构建 5308+ 及 3-Setup Installer 1.2.0 对应能力, 在实际处理请求的同一插件连接上协商 V3 和 `advanced-install-options`. 未提供的新字段不发送; 显式 `false` 或 `'none'` 仍需要上述支持. 缺少能力时在提交操作前返回 `INVALID_ARGUMENT`.

宿主构建 5312+ 可协商 V3 的 `source-profiles` 能力, 让宿主安装入口和脚本使用插件设置中的 [来源配置文件](#来源配置文件). 旧宿主或未声明该能力的插件保持原请求行为, 不应用远端来源配置. 此扩展不增加脚本方法.

安装支持同步, Async 和会话三种形态. 同步方法阻塞当前脚本线程, Async 方法返回 Promise, [session](#m-session) 返回监听阶段与进度的会话. Promise 回调和会话事件都在创建它们的脚本线程执行. 同步方法不能阻塞 Android UI 线程; `session` 的创建, `status` 和 `authorizer` 的同步查询也需要脚本工作线程. UI 脚本可使用 Async 方法, 或在工作线程中创建和使用会话.

停止脚本会取消宿主等待, 取消未完成的安装会话并释放来源资源. 已完成的安装不会回滚. 卸载, 授权请求和默认安装器设置没有单独的远端取消接口: 退出脚本会停止等待并抑制后续脚本回调, 但不能保证撤回系统已经接收的操作.

```js
console.log(installer.isAvailable());
console.log(installer.status);
```

---

<p style="font: bold 2em sans-serif; color: #FF7043">installer</p>

---

## [m] install

### installer.install(source, options?)

**`6.8.0`** **`Non-UI`** **`Overload 1/2`**

- **source** { [InstallSource](#installsource) } - 一个应用的普通来源或分包集合
- **[ options ]** { [InstallOptions](#installoptions) } - 安装选项
- <ins>**returns**</ins> { [InstallResult](#installresult) } - 单个应用的结果

等待安装完成后返回结果. `{ splits: [...] }` 中的文件属于同一个应用, 在一个安装会话中处理. 单项安装失败时抛出 `InstallerError`.

### installer.install(sources, options?)

**`6.8.0`** **`Non-UI`** **`Overload 2/2`**

- **sources** { [InstallSource](#installsource)[] } - 1 至 32 个独立应用
- **[ options ]** { [InstallOptions](#installoptions) } - 批量安装选项
- <ins>**returns**</ins> { [InstallResult](#installresult)[] } - 与来源顺序对应的结果数组

数组始终表示批量安装, 即使只有一个元素也返回数组. `continueOnError` 默认 `true`, 逐项失败记录在该项的 `error` 中并继续下一项. `continueOnError: false` 遇到首个失败时终止, 通过异常报告失败; 先前成功的项不会回滚.

下面只定义函数. 调用前由脚本选择并核实来源:

```js
let installChosen = source => installer.install(source, {
    authorizer: 'shizuku',
    interaction: 'silent',
    deleteSource: false,
});
```

## [m] installAsync

### installer.installAsync(source, options?)

**`6.8.0`** **`Async`** **`Overload 1/2`**

- **source** { [InstallSource](#installsource) }
- **[ options ]** { [InstallOptions](#installoptions) }
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [InstallResult](#installresult)

### installer.installAsync(sources, options?)

**`6.8.0`** **`Async`** **`Overload 2/2`**

- **sources** { [InstallSource](#installsource)[] }
- **[ options ]** { [InstallOptions](#installoptions) }
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [InstallResult](#installresult)[]

[install](#m-install) 的异步形态. 参数错误也通过 Promise 拒绝报告. 来源和选项在调用线程中立即形成快照, 之后修改原数组或对象不会改变本次请求.

## [m] session

### installer.session(source, options?)

**`6.8.0`** **`Non-UI`**

- **source** { [InstallSource](#installsource) | [InstallSource](#installsource)[] }
- **[ options ]** { [InstallOptions](#installoptions) }
- <ins>**returns**</ins> { [InstallSession](#installsession) } - 已开始执行的安装会话

监听器应在取得会话后立即注册. 会话的 `complete`, `result` 和 `wait` 与 [install](#m-install) 保持相同的单项或数组结果形状. 会话对象只能在创建它的脚本线程上访问.

```js
let startChosen = source => {
    let session = installer.session(source);
    session.on('progress', (progress, detail) => {
        console.log(progress, detail.bytesWritten, detail.totalBytes);
    }).on('complete', result => console.log(result))
        .on('error', error => console.error(error.code, error.systemMessage));
    return session;
};
```

## [m] uninstall

### installer.uninstall(packageName, options?)

**`6.8.0`** **`Non-UI`**

- **packageName** { [string](dataTypes#string) } - 要卸载的应用包名
- **[ options ]** { [UninstallOptions](#uninstalloptions) }
- <ins>**returns**</ins> { [UninstallResult](#uninstallresult) }

通过插件卸载应用. Shizuku 或 Root 可用于静默卸载, `none` 使用系统确认界面. Dhizuku 在已授权的当前所有者/工作资料用户中执行, 不支持 `keepData` 或其他/全部用户. `keepData` 和目标用户选项需要相应特权能力. 系统应用保护, 设备管理员和用户策略仍可阻止卸载. 通知模式仅用于安装, 卸载传入 `interaction: 'notification'` 会返回 `INVALID_ARGUMENT`.

[app.uninstall](app#m-uninstall) 保持原有的系统卸载意图行为, 无需此插件, 也不提供本方法的安装器结果与特权选项.

## [m] uninstallAsync

### installer.uninstallAsync(packageName, options?)

**`6.8.0`** **`Async`**

- **packageName** { [string](dataTypes#string) }
- **[ options ]** { [UninstallOptions](#uninstalloptions) }
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [UninstallResult](#uninstallresult)

[uninstall](#m-uninstall) 的异步形态.

## [m] inspect

### installer.inspect(source)

**`6.8.0`** **`Non-UI`**

- **source** { [string](dataTypes#string) | [java.io.File](https://developer.android.com/reference/java/io/File) | [android.net.Uri](https://developer.android.com/reference/android/net/Uri) } - 一个普通来源
- <ins>**returns**</ins> { [PackageArchiveInfo](#packagearchiveinfo) }

只读检查 APK 或容器的格式与元数据, 不安装应用. 支持路径, `file://` 和可读的 `content://` 来源. 不接受数组或 `{ splits: [...] }`, 包括只有一个文件的这些形态; 包含分包的 `.apks` 等容器仍可作为一个普通来源检查.

AAB 可返回包名, 版本和模块信息, 但 `installable` 为 `false`. 安装 AAB 会失败于 `UNSUPPORTED_FORMAT`, 需要先用 bundletool 生成适用的 `.apks`.

## [m] inspectAsync

### installer.inspectAsync(source)

**`6.8.0`** **`Async`**

- **source** { [string](dataTypes#string) | [java.io.File](https://developer.android.com/reference/java/io/File) | [android.net.Uri](https://developer.android.com/reference/android/net/Uri) }
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [PackageArchiveInfo](#packagearchiveinfo)

[inspect](#m-inspect) 的异步形态.

## [p+] authorizer

### installer.authorizer.available

**`6.8.0`** **`Getter`**

- { [string](dataTypes#string)[] }

返回插件报告为可用的授权方式, 取值来自 `'none'`, `'shizuku'`, `'root'` 和经 V2 协商的 `'dhizuku'`, 不包含 `'auto'`. "可用" 不等于服务已运行或已经授权, 需结合 `state` 查看. 此列表不表示插件设置中的自动选择优先级.

### installer.authorizer.state(name?)

- **[ name = 'auto' ]** { [string](dataTypes#string) } - `'auto'`, `'none'`, `'shizuku'`, `'root'` 或 `'dhizuku'`
- <ins>**returns**</ins> { [AuthorizerState](#authorizerstate) }

查询状态, 不请求新的授权. `auto` 返回聚合状态: 任一路径可用则 `available` 为 `true`; 任一可用路径正在运行则 `running` 为 `true`; 任一可用且正在运行的路径已获授权则 `granted` 为 `true`. 它不暴露插件自定义的选择顺序, 也不承诺下一次安装一定采用某个特权路径.

### installer.authorizer.request(name, timeout?)

**`Non-UI`**

- **name** { [string](dataTypes#string) } - `'auto'`, `'none'`, `'shizuku'`, `'root'` 或 `'dhizuku'`
- **[ timeout = 300000 ]** { [number](dataTypes#number) } - 等待超时, 毫秒, 取值为 1 至 7200000 的整数
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 请求结果

显式选择 `shizuku`, `root` 或 `dhizuku` 时请求对应授权. 拒绝, 不可用和超时可通过相应 `InstallerError` 报告. `auto` 只检查是否已有可用, 运行中且已授权的路径, 不主动发起新的特权授权提示.

Dhizuku 需要 Android 8.0 (API 26) 或以上, 已激活为 device owner 或 profile owner 的 Dhizuku, 以及单独授予 3-Setup Installer 的权限. 向 AutoJs6 授权不等于向插件授权. 设备所有者/工作资料所有者权限不是 Root 或 Shizuku shell 权限, 支持的操作和目标用户见 [InstallOptions](#installoptions).

### installer.authorizer.requestAsync(name, timeout?)

**`Async`**

- **name** { [string](dataTypes#string) }
- **[ timeout = 300000 ]** { [number](dataTypes#number) }
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [boolean](dataTypes#boolean)

`request` 的异步形态.

## [m] isDefault

### installer.isDefault()

**`6.8.0`** **`Non-UI`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

查询 3-Setup Installer 是否为当前 APK intent 的实际处理者. 返回 `true` 不区分普通偏好与持久策略, 也不单独证明系统当前存在持久锁定. 插件不可用时抛出 `PLUGIN_UNAVAILABLE`, 可用性探测应使用 [isAvailable](#m-isavailable).

插件状态中的 `persistentConfigured` 是上次完整配置持久默认项的本地回执, 不代表当前系统策略. 宿主 5307 起可解码此可选协议字段, 缺省为 `false`; 脚本接口仍返回布尔值, 没有公开该状态对象或同名属性. 回执缺失也不能证明没有持久策略.

## [m] setDefault

### installer.setDefault(enabled?, options?)

**`6.8.0`** **`Non-UI`**

- **[ enabled = true ]** { [boolean](dataTypes#boolean) } - 是否将插件设为默认安装器
- **[ options ]** {{ authorizer?: [string](dataTypes#string); mode?: [string](dataTypes#string) }} - 授权方式默认 `'auto'`, mode 默认 `'preferred'`
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否达到所请求的状态

返回 `true` 表示所请求的启用或取消状态已经达到. 省略 `mode` 或使用 `'preferred'` 时保留原接口语义, 通过 Shizuku 或 Root 管理普通偏好, 不承诺持久锁定. `enabled: false` 只取消本插件设置, 不清除其他应用的默认记录. 某些 Android 版本已有其他默认处理程序时, 仍需先在系统设置中清除原默认项; 无特权时返回 `AUTHORIZER_REQUIRED`.

`mode: 'persistent'` 请求持久默认功能. 启用成功表示这次操作已确认本插件的四种 APK intent 持久关联及实际解析; 关闭成功表示本插件的持久项已经移除. 原普通偏好可以保留, 因此关闭后 `isDefault()` 仍可能是 `true`. 模式只接受 `'preferred'` 和 `'persistent'`, 未知值或 `null` 被拒绝.

| 持久模式授权方式 | 当前条件 |
| --- | --- |
| `'dhizuku'` | API 26 至 33, 已激活的 device/profile owner 和插件独立授权, 仅当前 owner/profile 用户. API 34+ 无法通过此通道接收 owner 的最终策略结果, 因而在写入前返回 `INVALID_ARGUMENT`; 该限制不影响普通 Dhizuku 安装/卸载. |
| `'root'` | 仅 user 0, Root 环境必须支持独立 system UID/GID 1000 进程及所需框架操作. 已验证 API 24 / Magisk 25.2 / SELinux Enforcing, 不保证其他 Root 管理器或 ROM. 不能切换身份或被系统策略拒绝时明确失败, 不修改 SELinux 设置. |
| `'auto'` | 按插件已有排序, 启用状态和授权可用性, 只考虑当前用户可用的 Root 或上述 API 范围内的 Dhizuku; 跳过 Shizuku 和 none. 新配置中 Root 先于 Dhizuku. 选定后的执行失败不会改用另一个身份. |

显式指定身份不会回退, `persistent` 失败也不会改成 `preferred`. Root 路径在写入前拒绝竞争 APK 持久策略以及无法识别的本插件既有策略. Dhizuku 的多项写入不是事务; 部分失败可能留下已写策略, 不会为补偿而清除未知旧策略. 取消或进程退出不会重放操作, 也不承诺已经完成的策略修改一定被撤销; 未确认结果按失败处理并保留审计.

下面只定义函数, 调用前需确认设备所有者配置及插件授权:

```js
let setPersistentChosen = enabled => installer.setDefault(enabled, {
    authorizer: 'dhizuku',
    mode: 'persistent',
});
```

## [m] setDefaultAsync

### installer.setDefaultAsync(enabled?, options?)

**`6.8.0`** **`Async`**

- **[ enabled = true ]** { [boolean](dataTypes#boolean) }
- **[ options ]** {{ authorizer?: [string](dataTypes#string); mode?: [string](dataTypes#string) }}
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [boolean](dataTypes#boolean)

[setDefault](#m-setdefault) 的异步形态.

## [m] users

### installer.users()

**`6.8.0`** **`Non-UI`**

- <ins>**returns**</ins> { [DeviceUser](#deviceuser)[] }

查询插件能够访问的 Android 用户列表. 工作资料和其他用户是否可用取决于授权方式及设备策略. 本方法不接受授权方式参数.

## [m] usersAsync

### installer.usersAsync()

**`6.8.0`** **`Async`**

- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [DeviceUser](#deviceuser)[]

[users](#m-users) 的异步形态.

## [m] isAvailable

### installer.isAvailable()

**`6.8.0`** **`Non-UI`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

探测插件是否可用. 插件缺失, 禁用, 未授权或不兼容等情况返回 `false`. 返回 `true` 只说明插件可用, 不代表已经获得 Shizuku, Root 或 Dhizuku 授权, 也不代表可静默安装或支持全部可选能力.

## [p] status

### installer.status

**`6.8.0`** **`Getter`**

- { [Object](dataTypes#object) }

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `available` | boolean | 插件是否可用 |
| `pluginVersion` | string | 实际选中的插件版本, 可选 |
| `contractVersion` | number | 可用时宿主与插件协商出的契约版本; 新宿主可使用 1 或 2 |
| `reason` | string | 不可用时的原因, 可选 |

这是同步查询. 插件不可用的原因以字段返回, 不使用操作方法的 `PLUGIN_UNAVAILABLE` 异常形态.

## InstallSource

普通来源为路径字符串, `java.io.File` 或 `android.net.Uri`. 字符串可使用本地路径, `file://` 或 `content://`; 不支持 HTTP 等其他 URI 协议. 相对路径按脚本工作目录解析, 不会修改文件名中的空格或 Unicode 字符. `content://` 必须具有有效提供方且调用时可读, 脚本负责已有的读取权限.

一个应用的显式分包集合写作 `{ splits: [source1, source2] }`, 至少 1 个, 至多 64 个文件. 顶层数组表示 1 至 32 个独立应用, 其中每项可为普通来源或分包集合. 嵌套数组不表示分包, 会被拒绝.

来源不能为 `null`, 空白路径, 含 NUL 的路径, 空数组, 稀疏数组或未知对象. 分包对象只接受 `splits` 字段, 分包元素必须是普通来源. `file://` URI 必须是没有远端主机, 查询参数或片段的本地文件 URI.

## InstallOptions

下表列出没有配置文件覆盖时的默认值. 支持来源配置的宿主/插件允许省略字段继承匹配配置, 显式字段优先. 只有 `installer`, `installReason` 和 `packageSource` 接受 `null`, 用于清除继承值并恢复相应后端默认. 整个 options 的 `null`, 其他字段的 `null`, 未知字段, 非布尔标志, 非法枚举, 小数用户 ID 和非有限超时均为 `INVALID_ARGUMENT`. 字段 `splits` 只属于来源对象, 不属于安装选项.

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `authorizer` | string | `'auto'` | `'auto'`, `'none'`, `'shizuku'`, `'root'` 或 `'dhizuku'`; 显式指定时不回退 |
| `interaction` | string | `'auto'` | `'auto'`, `'dialog'`, `'silent'` 或 `'notification'`; 见下文 |
| `allowDowngrade` | boolean | `false` | 请求降级, 需要 Shizuku/Root; 设备策略和应用属性仍可能限制, Dhizuku 拒绝该选项 |
| `allowTestOnly` | boolean | `false` | 请求安装测试包, 需要 Shizuku/Root; Dhizuku 拒绝该选项 |
| `bypassLowTargetSdk` | boolean | `false` | 请求绕过低 targetSdk 限制, 需要 Shizuku/Root 及平台支持; Dhizuku 拒绝该选项 |
| `grantAllRequestedPermissions` | boolean | 不请求 | V3; `true` 通过 Shizuku/Root 请求授予系统允许的权限, 不代表全部声明权限一定获准 |
| `requestUpdateOwnership` | boolean | 不请求 | V3; `true` 需要 API 34+, 请求在首次安装时启用更新所有权, 实际状态见 `updateOwner` 与 `notes` |
| `dexopt` | string | `'none'` 的行为 | V3; `'none'`, `'verify'`, `'speed-profile'` 或 `'speed'`; 非 none 需要 Shizuku/Root, verify 需要 API 26+ |
| `installReason` | string 或 null | 保留后端默认 | V3; 非 null 值需要 API 26+: `'unknown'`, `'device-restore'`, `'device-setup'`, `'user'` 或 `'policy'` |
| `packageSource` | string 或 null | 保留后端默认 | V3; 非 null 值需要 API 33+: `'unspecified'`, `'store'`, `'local-file'`, `'downloaded-file'` 或 `'other'`; 后端默认保留 API 33+ 原有 local-file 归属 |
| `installer` | string 或 null | 按授权身份 | `null` 或空字符串清除继承值, 非空包名至多 255 个 UTF-8 字节; Shizuku ADB 默认为 shell, Root/none 为插件, Dhizuku 为 owner 包且不接受其他包 |
| `user` | number 或 string | `'current'` | `'current'`, `'all'` 或 0 至 2147483647 的整数; Dhizuku 仅允许当前 owner/profile 用户, 不允许其他或全部用户 |
| `deleteSource` | boolean | `false` | 成功后尽力删除宿主路径来源, 见下文 |
| `continueOnError` | boolean | `true` | 批量安装遇到失败项后是否继续 |
| `timeout` | number | `1800000` | 整个安装操作的超时, 毫秒, 1 至 7200000 的整数 |

`interaction: 'auto'` 在特权可用时优先静默, 系统仍要求确认时允许显示确认界面, 实际结果的 `interaction` 为 `'dialog'` 并通过 `notes` 说明. 无特权时使用对话框. `'dialog'` 显式请求插件确认界面; `'silent'` 在没有合适特权或系统仍要求确认时失败于 `AUTHORIZER_REQUIRED`, 不回退为对话框.

`'notification'` 需要已协商的通知安装能力. 插件不主动打开确认对话框, 使用通知承载确认, 取消, 进度和结果; `none` 路径需要的 Android 系统确认仍须由通知动作进入. 缺少通知权限, 全局通知关闭或所需通知渠道/通知组不可用时返回 `NOTIFICATION_UNAVAILABLE`, 不悄悄回退为对话框或静默安装. 已确认安装成功后才发生的通知显示失败不会把已安装事实改为失败. 该模式只适用于安装和安装会话.

Dhizuku 要求 API 26+, 已激活的设备/工作资料所有者及插件独立授权. 它只支持当前 owner/profile 用户, 安装归属 owner 包. `allowDowngrade`, `allowTestOnly`, `bypassLowTargetSdk`, 其他安装者包名和其他/全部用户均被明确拒绝, 不会忽略. 新插件配置的自动顺序为 Shizuku, Root, Dhizuku, none; 已有显式启用和排序设置保留.

以上五个高级字段只用于安装. 没有配置文件覆盖时, 省略保持原行为. 显式 `false`, `'none'` 以及 `installReason`/`packageSource` 的 `null` 仍需 V3 和高级选项能力, 不当作未提供. 原始 Android 数字常量不代替字符串枚举. 元数据选项不会改变安装历史的宿主/脚本来源标签. 平台不支持所请求字段时明确拒绝, 不切换授权方式.

`grantAllRequestedPermissions` 请求系统授予可授予的权限; Android 14 也可能包含安装器可改变的 app-op, 如 `USE_FULL_SCREEN_INTENT`. 它不保证所有声明权限获准, 不授予无障碍, 悬浮窗或任意签名权限, 仍受 restricted, system-fixed 和 policy-fixed 约束, 且不会额外设置 restricted 权限 allowlist 标志. `requestUpdateOwnership: true` 仅能在初次安装时启用所有权, 更新或其他用户已有该包时可能被 Android 忽略; `false` 只是不请求, 不撤销既有 owner. 请以结果读回为准, 参阅 [Android SessionParams](https://developer.android.com/reference/android/content/pm/PackageInstaller.SessionParams#setRequestUpdateOwnership(boolean)). `dexopt: 'none'` 只表示不追加手动编译步骤, 不关闭 Android 自身的正常编译.

安装策略由插件本地设置管理, 对宿主, 脚本, 首页和外部来源统一生效. 签名不匹配/无法确认的策略阻止及包名/共享 UID 精确黑名单均以 `BLOCKED_BY_POLICY` 拒绝. 仅真实 `dialog` 确认页可对当前项目一次性允许继续签名检查, Android 自身仍会验证签名; 静默或通知动作不能完成这项放行, 黑名单不可覆盖. 脚本和来源配置均不能绕过这些策略. 权限预览汇总实际选中 APK 分包的声明权限, 不代表已经授予的权限.

### 来源配置文件

在插件设置中管理配置名称, 启用状态, 来源, 包名前缀, 选项及排列顺序. 来源可为宿主, 脚本, 外部入口或任意来源; 任意来源也包含插件首页. 空前缀匹配任意包. 非空前缀按实际解析出的包名进行区分大小写的字符前缀匹配, 不使用来源文件名. 例如 `com.example` 也匹配 `com.example2`; `com.example.` 只匹配此前缀下的包名.

按设置顺序选择首个同时满足来源和包名前缀的已启用配置, 不合并多个配置. 配置只提供 12 个每应用选项的局部默认值, 即上表除 `interaction`, `timeout`, `continueOnError` 外的字段. 优先级为入口默认值, 匹配配置, 显式请求字段; 真实安装确认页中的最终选择还可覆盖这些选项. 明确的 `false`, `'auto'`, `'current'`, `'none'` 和三个可空字段的 `null` 都是覆盖, 不是继承.

插件在任务实际开始处理时固定来源配置和自动授权排序, 此后修改设置不会改变该任务或同批后续项目. 已完成确认的任务重试沿用完整确认选项; 尚未确认的重试重新读取入口默认值和来源配置. 每次重试仍重新检查来源与签名, 不复用一次性签名策略放行. `interaction`, `timeout` 和 `continueOnError` 始终属于整次会话, 配置不能延长批量操作的期限.

以下函数显式保留来源并清除三个可空字段的配置继承, 调用时仍需兼容的宿主和插件:

```js
let installWithResets = source => installer.install(source, {
    deleteSource: false,
    installer: null,
    installReason: null,
    packageSource: null,
});
```

none/Dhizuku 的已安装签名查询仅限当前用户, Shizuku/Root 使用全局查询. SharedUID 黑名单非空时, 如果当前用户查不到该包且无法排除其他用户已有的记录, 插件会拒绝继续; 这类不确定性不能通过一次签名确认覆盖. 此处 SharedUID 指清单的 sharedUserId, 不是目标 Android user ID.

最终有效的 `deleteSource: true` 仅在该项收到确定的安装成功结果后, 由宿主尽力删除路径, `File` 和 `file://` 对应文件. 宿主不会删除 `content://` 来源. 支持来源配置时, 宿主以本次协商和每项布尔 `sourceDeleteRequested` 决定删除; 字段缺失或类型不正确时保留文件并记录说明. 脚本显式 `deleteSource: false` 始终禁止宿主删除.

宿主在完整批量结果到达后再清理, 失败, 未处理或成功但要求保留的项目都会保护共用路径及能确认的文件别名. 插件本地外部入口还会保留同批重复 URI/规范化文件路径, 防止后续项目尚未读取时来源已被前项删除. 分包项只有全部来源均成功删除时才报告 `sourceDeleted: true`; 删除失败, 安全检查不通过或保留内容 URI 时通过 `sourceDeleted` 与 `notes` 说明, 不把已经成功的安装改成失败.

单次请求 JSON 至多 64 KiB. 在设备, 平台或授权方式不支持某项特权能力时, 以错误或结果中的说明为准.

## UninstallOptions

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `authorizer` | string | `'auto'` | `'auto'`, `'none'`, `'shizuku'`, `'root'` 或 `'dhizuku'` |
| `interaction` | string | `'auto'` | 仅 `'auto'`, `'dialog'` 或 `'silent'`; 不接受 `'notification'` |
| `keepData` | boolean | `false` | 请求保留应用数据, 需要 Shizuku/Root; Dhizuku 拒绝该选项 |
| `user` | number 或 string | `'current'` | `'current'`, `'all'` 或非负整数; Dhizuku 仅当前 owner/profile 用户 |
| `timeout` | number | `1800000` | 毫秒, 1 至 7200000 的整数 |

显式 `null` 和未知选项被拒绝. `user: 'all'` 请求卸载所有用户的应用; 实际执行仍受设备权限和策略约束.

## InstallResult

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `ok` | boolean | 该项是否安装成功 |
| `packageName` | string | 包名, 可选 |
| `versionName`, `versionCode` | string, number | 本次版本, 可选 |
| `previousVersionCode` | number | 更新前版本, 可选 |
| `authorizer` | string | 实际授权方式为 `'none'`, `'shizuku'`, `'root'` 或 `'dhizuku'`; 选择前失败时可能缺省 |
| `interaction` | string | 实际交互方式为 `'dialog'`, `'silent'` 或 `'notification'`; 早期失败时可能缺省 |
| `durationMillis` | number | 耗时, 毫秒, 早期失败时可能缺省 |
| `sourceDeleted` | boolean | 来源是否全部成功删除, 可选 |
| `sourceDeleteRequested` | boolean | 来源配置协商后的最终删除请求, 可选; false 表示保留, true 不代表已删除. 新协商的成功结果必须提供布尔值, 缺失或类型错误时宿主保留来源并写入 notes |
| `notes` | string[] | 安装与删除说明, 可选 |
| `updateOwner` | string 或 null | V3 可选; 请求更新所有权后当前调用身份可见的读回包名. null 表示 Android 未向该身份返回 owner, 可能没有 owner 或受可见性限制; 读取失败则省略字段并写入 notes |
| `dexopt` | Object | V3 可选; 非 none 的附加编译观察 `{ filter, status, message? }`, 见下文 |
| `error` | [InstallerError](#c-installererror) | 失败项的真正错误实例, 可选 |

批量完成不代表每一项成功, 需逐项检查 `ok`. `error` 支持 `instanceof installer.InstallerError`. 版本号等整数由宿主保留 64 位整数值; JavaScript 数值运算仍受 Number 的安全整数范围限制.

`dexopt.status` 为 `'accepted'`, `'failed'`, `'cancelled'`, `'timeout'`, `'unavailable'` 或 `'unknown'`. `accepted` 包含系统跳过该次编译的情况, 不保证实际执行了编译. `unknown` 表示无法识别或未获得确定结果. 默认 none 不返回 dexopt 对象. 安装已经确认成功后, 附加步骤失败, 取消或超时不会把该项 `ok` 改成 `false` 或卸载应用, 应结合该对象和 `notes` 判断附加请求的结果.

## UninstallResult

返回 `ok`, `packageName`, 实际 `authorizer` 和可选的 [InstallerError](#c-installererror) `error`. 在方法通过异常报告失败时没有返回值.

## InstallSession

会话提供事件监听方法 `on`, `once`, `addListener`, `off`, `removeListener`, `removeAllListeners`, `prependListener`, `prependOnceListener`, `listeners`, `listenerCount`, `eventNames`, `getMaxListeners`, `setMaxListeners` 和 `emit`.

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `id` | string | 会话 ID, 只读 |
| `state` | string | 当前状态, 只读 |
| `result` | InstallResult 或 InstallResult[] | 完成结果, 完成前为 `undefined`, 只读 |

`state` 为 `'pending'`, `'preparing'`, `'confirming'`, `'writing'`, `'committing'`, `'optimizing'`, `'completed'`, `'failed'` 或 `'cancelled'`. optimizing 仅在 V3 请求非 none 的额外手动编译时出现, 是非终态阶段, 不证明实际完成了编译.

### InstallSession.cancel()

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否接受了新的取消请求

请求取消. `true` 不保证系统尚未完成提交, 也不代表撤销已经安装的应用. 已结束或已经请求取消的会话返回 `false`. 最终状态以会话结果或终态事件为准.

### InstallSession.wait(timeout?)

**`Non-UI`**

- **[ timeout ]** { [number](dataTypes#number) } - 本次等待上限, 毫秒, 1 至 7200000 的整数
- <ins>**returns**</ins> { [InstallResult](#installresult) | [InstallResult](#installresult)[] }

阻塞当前脚本线程直到终态. 省略 `timeout` 时等待会话自身的结束或 `options.timeout`. 显式指定的短超时只使本次 `wait` 抛出 `TIMEOUT`, 会话继续运行, 之后可再次等待. 如果该异常未被捕获并导致脚本退出, 脚本清理仍会取消未完成会话. 不要在同一会话的监听器内递归调用 `wait`.

| 事件 | 监听器参数 | 说明 |
| --- | --- | --- |
| `stage` | `(stage, detail)` | 阶段名与 `{ index?, packageName? }`, `index` 为从 0 开始的批量索引 |
| `progress` | `(progress, detail)` | 0 至 1 的进度与 `{ index?, bytesWritten, totalBytes }` |
| `complete` | `(result)` | 完成结果, 保留单项或批量形状 |
| `error` | `(error)` | [InstallerError](#c-installererror) |
| `cancel` | `()` | 脚本取消请求或用户取消形成的取消终态 |

未监听 `error` 时, 错误记录到控制台, 不作为未处理异常抛到全局. 批量中的普通失败项由 `complete` 结果中该项的 `error` 表示. 监听器自身抛出的异常仍遵循脚本异常处理规则.

## PackageArchiveInfo

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `format` | string | `'apk'`, `'apks'`, `'xapk'`, `'apkm'`, `'apkz'`, `'zip'`, `'aab'` 或 `'unknown'` |
| `installable` | boolean | 是否为可安装格式; `aab` 和 `unknown` 为 `false` |
| `packageName`, `versionName`, `label` | string | 包名, 版本名称与应用名称, 可选 |
| `versionCode`, `minSdk`, `targetSdk` | number | 版本代码与 SDK 信息, 可选 |
| `size` | number | 来源大小, 字节 |
| `icon` | [android.graphics.Bitmap](https://developer.android.com/reference/android/graphics/Bitmap) | 图标, 可选 |
| `splits` | Object[] | 分包项 `{ name, size, selected, reason? }`, 可选 |
| `signatureSchemes` | string[] | 检出的签名方案, 可选 |
| `installed` | Object | 已安装信息 `{ versionName?, versionCode, signerMatch, installer? }`, 可选 |
| `modules` | string[] | AAB 模块名称, 可选 |
| `problems` | string[] | 格式与解析说明, 可选 |

`installed.signerMatch` 为 `'match'`, `'mismatch'` 或 `'unknown'`. 图标或其他可选元数据可能因不可获得或响应大小限制而省略. `installable` 不保证授权, 签名兼容和最终系统安装一定成功.

## AuthorizerState

包含 `name`, `available`, `running`, `granted` 和可选的 `reason`. 前四项分别为授权方式字符串以及三个布尔状态. `name: 'auto'` 的聚合语义见 [authorizer](#p-authorizer).

## DeviceUser

包含数字 `id`, 可选的字符串 `name`, 布尔 `primary` 和 `running`. `primary` 表示主用户, `running` 表示用户当前是否运行.

## [C] InstallerError

### new installer.InstallerError(message?, code?, status?, systemMessage?, packageName?, authorizer?, retryable?)

- **[ message = '' ]** { [string](dataTypes#string) } - 错误消息
- **[ code = 'INTERNAL' ]** { [string](dataTypes#string) } - 错误代码
- **[ status ]** { [number](dataTypes#number) } - 系统安装状态
- **[ systemMessage ]** { [string](dataTypes#string) } - 系统原始消息
- **[ packageName ]** { [string](dataTypes#string) } - 对应包名
- **[ authorizer ]** { [string](dataTypes#string) } - 对应授权方式
- **[ retryable = false ]** { [boolean](dataTypes#boolean) } - 是否建议重试
- <ins>**returns**</ins> { [InstallerError](#c-installererror) }

继承 JavaScript `Error`, `name` 为 `'InstallerError'`. `code` 和 `retryable` 始终存在; `status`, `systemMessage`, `packageName`, `authorizer` 在有对应信息时提供. `toString()` 形如 `InstallerError [CODE]: message`. 不使用 `new` 调用构造器也会创建实例.

| 代码 | 含义 |
| --- | --- |
| `PLUGIN_UNAVAILABLE` | 插件缺失, 禁用, 未授权, 不兼容或连接不可用 |
| `INVALID_ARGUMENT` | 参数类型, 枚举, 形态或上限错误 |
| `SOURCE_NOT_FOUND`, `SOURCE_UNREADABLE` | 来源不存在或无法读取 |
| `UNSUPPORTED_FORMAT` | AAB 或其他不可安装格式 |
| `INVALID_PACKAGE` | 清单, 分包集合或包内容无效 |
| `INCOMPATIBLE_DEVICE` | 设备或 SDK 与安装包不兼容 |
| `AUTHORIZER_UNAVAILABLE`, `AUTHORIZER_DENIED`, `AUTHORIZER_REQUIRED` | 授权方式不可用, 授权被拒绝或操作需要特权 |
| `NOTIFICATION_UNAVAILABLE` | 通知安装所需权限, 全局通知或渠道不可用; 不自动切换模式 |
| `USER_CANCELLED`, `USER_ACTION_TIMEOUT` | 用户取消或确认超时 |
| `SIGNATURE_MISMATCH` | 与已安装版本签名不一致 |
| `INSUFFICIENT_STORAGE` | 存储空间不足 |
| `INSTALL_FAILED`, `UNINSTALL_FAILED` | 其他系统安装或卸载失败 |
| `BLOCKED_BY_POLICY` | 用户限制或设备策略阻止 |
| `TIMEOUT`, `CANCELLED` | 操作或等待超时, 脚本侧取消 |
| `INTERNAL` | 内部错误 |
