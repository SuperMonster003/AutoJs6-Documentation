# 安装器 (Installer)

`installer` 模块用于安装, 更新, 卸载和检查 Android 应用, 并查询授权方式, 设备用户和默认安装器. 全局对象别名为 `$installer`.

从 AutoJs6 6.8.0 起, 此模块由外置 3-Setup Installer 插件提供. 使用前需在插件中心安装, 启用并授权兼容插件. [isAvailable](#m-isavailable) 和 [status](#p-status) 可用于探测插件; 插件缺失或不可用时, 实际操作抛出或以 Promise 拒绝 `code` 为 `PLUGIN_UNAVAILABLE` 的 [InstallerError](#c-installererror). 脚本 API 不会自动改走系统安装器.

`dhizuku`, 安装交互 `notification` 和默认安装器 `mode: 'persistent'` 需要宿主构建 5306 或更高版本, 以及声明对应能力的 3-Setup Installer 1.1.0 实现. 新宿主仍可连接 V1 插件, 不会向旧插件发送未知选项或新事务. 缺少 Dhizuku 能力时返回 `AUTHORIZER_UNAVAILABLE`; 缺少通知安装或持久默认能力时返回 `INVALID_ARGUMENT`. 插件正式发布与索引准入仍以 [插件路线图](https://github.com/SuperMonster003/AutoJs6-Plugin-Three-Setup-Installer/blob/master/ROADMAP.md) 为准, 本文不代表已完成远端发布或全部设备验收.

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

查询 3-Setup Installer 是否为当前默认安装器. 插件不可用时抛出 `PLUGIN_UNAVAILABLE`, 可用性探测应使用 [isAvailable](#m-isavailable).

## [m] setDefault

### installer.setDefault(enabled?, options?)

**`6.8.0`** **`Non-UI`**

- **[ enabled = true ]** { [boolean](dataTypes#boolean) } - 是否将插件设为默认安装器
- **[ options ]** {{ authorizer?: [string](dataTypes#string); mode?: [string](dataTypes#string) }} - 授权方式默认 `'auto'`, mode 默认 `'preferred'`
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否达到所请求的状态

返回 `true` 表示所请求的启用或取消状态已经达到. 省略 `mode` 或使用 `'preferred'` 时保留原接口语义, 通过 Shizuku 或 Root 管理普通偏好, 不承诺持久锁定. `enabled: false` 只取消本插件设置, 不清除其他应用的默认记录. 某些 Android 版本已有其他默认处理程序时, 仍需先在系统设置中清除原默认项; 无特权时返回 `AUTHORIZER_REQUIRED`.

`mode: 'persistent'` 使用对应设备策略的持久默认功能, 当前插件要求显式选择 `authorizer: 'dhizuku'`. Root/system 身份的持久默认能力未作为当前保证. 启用成功需要插件成为持久处理者; 关闭成功表示本插件的持久项已经移除, 原普通偏好可以保留, 因此此时 `isDefault()` 仍可能是 `true`. 模式不会在不支持时自动切换. 模式只接受 `'preferred'` 和 `'persistent'`, 未知值或 `null` 被拒绝.

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

省略选项或选项字段时采用下表默认值. 显式 `null`, 未知字段, 非布尔标志, 非法枚举, 小数用户 ID 和非有限超时均为 `INVALID_ARGUMENT`. 字段 `splits` 只属于来源对象, 不属于安装选项.

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `authorizer` | string | `'auto'` | `'auto'`, `'none'`, `'shizuku'`, `'root'` 或 `'dhizuku'`; 显式指定时不回退 |
| `interaction` | string | `'auto'` | `'auto'`, `'dialog'`, `'silent'` 或 `'notification'`; 见下文 |
| `allowDowngrade` | boolean | `false` | 请求降级, 需要 Shizuku/Root; 设备策略和应用属性仍可能限制, Dhizuku 拒绝该选项 |
| `allowTestOnly` | boolean | `false` | 请求安装测试包, 需要 Shizuku/Root; Dhizuku 拒绝该选项 |
| `bypassLowTargetSdk` | boolean | `false` | 请求绕过低 targetSdk 限制, 需要 Shizuku/Root 及平台支持; Dhizuku 拒绝该选项 |
| `installer` | string | 按授权身份 | 空字符串同省略, 至多 255 个 UTF-8 字节; Shizuku ADB 默认为 shell, Root/none 为插件, Dhizuku 为 owner 包且不接受其他包 |
| `user` | number 或 string | `'current'` | `'current'`, `'all'` 或 0 至 2147483647 的整数; Dhizuku 仅允许当前 owner/profile 用户, 不允许其他或全部用户 |
| `deleteSource` | boolean | `false` | 成功后尽力删除宿主路径来源, 见下文 |
| `continueOnError` | boolean | `true` | 批量安装遇到失败项后是否继续 |
| `timeout` | number | `1800000` | 整个安装操作的超时, 毫秒, 1 至 7200000 的整数 |

`interaction: 'auto'` 在特权可用时优先静默, 系统仍要求确认时允许显示确认界面, 实际结果的 `interaction` 为 `'dialog'` 并通过 `notes` 说明. 无特权时使用对话框. `'dialog'` 显式请求插件确认界面; `'silent'` 在没有合适特权或系统仍要求确认时失败于 `AUTHORIZER_REQUIRED`, 不回退为对话框.

`'notification'` 需要已协商的通知安装能力. 插件不主动打开确认对话框, 使用通知承载确认, 取消, 进度和结果; `none` 路径需要的 Android 系统确认仍须由通知动作进入. 缺少通知权限, 全局通知关闭或所需通知渠道/通知组不可用时返回 `NOTIFICATION_UNAVAILABLE`, 不悄悄回退为对话框或静默安装. 已确认安装成功后才发生的通知显示失败不会把已安装事实改为失败. 该模式只适用于安装和安装会话.

Dhizuku 要求 API 26+, 已激活的设备/工作资料所有者及插件独立授权. 它只支持当前 owner/profile 用户, 安装归属 owner 包. `allowDowngrade`, `allowTestOnly`, `bypassLowTargetSdk`, 其他安装者包名和其他/全部用户均被明确拒绝, 不会忽略. 新插件配置的自动顺序为 Shizuku, Root, Dhizuku, none; 已有显式启用和排序设置保留.

`deleteSource: true` 仅在该项收到确定的安装成功结果后, 由宿主尽力删除路径, `File` 和 `file://` 对应文件. 宿主不会删除 `content://` 来源, 安装失败的来源保留. 分包项只有全部来源均成功删除时才报告 `sourceDeleted: true`; 删除失败或保留内容 URI 时通过 `sourceDeleted` 与 `notes` 说明, 不把已经成功的安装改成失败. 同一个源文件被多个批量项引用时, 有失败项仍需要保留该来源.

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
| `notes` | string[] | 安装与删除说明, 可选 |
| `error` | [InstallerError](#c-installererror) | 失败项的真正错误实例, 可选 |

批量完成不代表每一项成功, 需逐项检查 `ok`. `error` 支持 `instanceof installer.InstallerError`. 版本号等整数由宿主保留 64 位整数值; JavaScript 数值运算仍受 Number 的安全整数范围限制.

## UninstallResult

返回 `ok`, `packageName`, 实际 `authorizer` 和可选的 [InstallerError](#c-installererror) `error`. 在方法通过异常报告失败时没有返回值.

## InstallSession

会话提供事件监听方法 `on`, `once`, `addListener`, `off`, `removeListener`, `removeAllListeners`, `prependListener`, `prependOnceListener`, `listeners`, `listenerCount`, `eventNames`, `getMaxListeners`, `setMaxListeners` 和 `emit`.

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `id` | string | 会话 ID, 只读 |
| `state` | string | 当前状态, 只读 |
| `result` | InstallResult 或 InstallResult[] | 完成结果, 完成前为 `undefined`, 只读 |

`state` 为 `'pending'`, `'preparing'`, `'confirming'`, `'writing'`, `'committing'`, `'completed'`, `'failed'` 或 `'cancelled'`.

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
