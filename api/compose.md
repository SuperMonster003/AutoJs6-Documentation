# Compose UI (Compose)

`compose` 与 `$compose` 提供由 Compose UI 插件渲染的脚本界面. 本页说明无障碍节点与宿主选择器的关系, 以及打包应用的运行条件; 完整组件和方法参考仍在补充.

<aside class="doc-status doc-status--incomplete">
<p><strong>文档状态:</strong> 无障碍与选择器及打包应用已核实. 完整组件和方法参考仍在补充.</p>
</aside>

## 无障碍与选择器

### 运行条件

- 安装并启用 Compose UI 插件, 使用包含 `compose` 模块的配套宿主构建. 当前为本地预览能力.
- 界面已挂载, 待查找的节点位于当前可访问窗口并已参与布局.
- 查找与点击依赖宿主无障碍服务. 界面渲染本身不要求启用无障碍.
- 操作 AutoJs6 自身的脚本页面时, 关闭设置中的 "保护模式". 该模式会让选择器跳过宿主包名, 包括宿主承载的 Compose 页面.
- 本节节点层级按默认关闭 "稳定模式" 的内置服务说明. 不同服务或节点过滤设置可能隐藏部分子节点, 优先通过按钮自身的标签定位动作目标.
- 阻塞式选择器等待应在非 UI 脚本或工作线程中运行, 避免阻塞页面线程.

### testTag 与 ID

组件的 `testTag` 快捷属性和 `compose.modifier().testTag(tag)` 都设置 Compose 语义标签. 渲染器已在根节点启用 `testTagsAsResourceId`, 因而 Android 无障碍节点的 `viewIdResourceName` 就是原样标签字符串.

例如 `testTag: 'start_button'` 暴露为 `start_button`, 不会自动变成 `org.autojs.autojs6:id/start_button`. 节点的 `packageName` 仍是承载页面的宿主包名.

对该标签的匹配规则如下:

| 选择器或读取方式 | 结果 |
| --- | --- |
| `id('start_button').findOnce()` | 找到带该标签的节点. |
| `idContains('start_').findOnce()` | 匹配原样 ID 中的子串. |
| `idMatches('start_button').findOnce()` | 匹配整个原样 ID. |
| `idMatches(/^start_button$/).findOnce()` | 使用正则表达式匹配整个原样 ID. |
| `idMatches('start').findOnce()` | 不匹配, 该表达式未覆盖整个 ID. |
| `id('org.autojs.autojs6:id/start_button').findOnce()` | 不匹配, 标签没有这个包名前缀. |
| `node.id()` | 返回 `start_button`. |

宿主 `id(string)` 对传统 View 资源 ID 仍支持只写 `:id/` 后的条目名. 原样 Compose 标签不含 `:id/` 时, 整个标签作为条目名匹配. `idContains` 与 `idMatches` 始终比较节点暴露的完整 ID 字符串.

为自动化目标设置稳定且在页面内唯一的标签, 并将标签直接设在需要执行动作的组件上. `testTag` 不改变 Compose 节点句柄的 `nodeId`, 也不创建 Android `R.id` 资源.

### text 与 contentDescription

独立 `Text` 节点的文本可由 `text('文字')` 查找. `contentDescription` 快捷属性或 `.semantics('说明')` 设置的描述可由 `desc('说明')` 查找.

`Button` 会合并后代语义, 但宿主无障碍选择器看到的树与 Compose 测试框架默认使用的合并树不同. 当前 Compose 1.12.1 会保留按钮中的文本子节点, 并可能为按钮描述和角色增加语义子节点. 因此:

- `id('start_button')` 可直接定位拥有点击动作的按钮节点.
- `text('启动')` 找到按钮内的文本节点时, 该节点本身可能不可点击. 需要找到其可点击祖先, 或改用按钮自身的标签.
- 当按钮同时包含子节点并设置 `contentDescription` 时, `desc()` 可找到独立描述节点. 该节点可能没有 ID 和点击动作, 它的父节点才是按钮.
- 不要假定 `id('start_button').text('启动')` 能同时成立, 也不要假定按钮标签所在节点的类名一定是 `android.widget.Button`.
- 宿主 [UiObject](uiObjectType) 的 `parent()` 和 `child()` 遍历的是无障碍树, 与 Compose 脚本节点句柄的 `parent` 和 `children` 不保证一一对应.

这遵循 Compose 的 [语义树规则](https://developer.android.com/develop/ui/compose/accessibility/semantics) 与 [无障碍测试互操作规则](https://developer.android.com/develop/ui/compose/testing/interoperability). 自动化优先使用动作组件自己的 `testTag`, 减少对子节点结构的依赖.

在 API 24 x86 与 API 35 x86_64 模拟器上, 内置无障碍服务已验证以下包含一个 `Text` 和按钮描述的结构:

| 节点 | `id()` | `text()` | `desc()` | `clickable()` |
| --- | --- | --- | --- | --- |
| Button 自身 | `start_button` | `''` | `null` | `true` |
| 按钮内 Text | `start_label` | `'Compose start'` | `null` | `false` |
| 按钮描述子节点 | `null` | `''` | `'Run Compose action'` | `false` |

这两个子节点的 `parent().id()` 都是 `start_button`. 此按钮在 Android 无障碍中还有一个角色子节点, 自身 `className()` 为 `android.view.View`; 因而通过按钮自身标签查找点击目标更稳定.

上述验证于 2026-10-03 使用配套本地宿主, Compose UI 插件和 Compose 1.12.1 完成. 查找与点击均经过真实内置无障碍服务以及宿主 Rhino 选择器, 包括 `id('start_button').findOnce().click()` 到脚本 `onClick` 回调的完整路径.

### 示例

先运行下面的 UI 脚本, 保持页面显示:

```js
'ui';

let clicks = compose.state(0);
compose.mount(function () {
    return compose.Column({padding: 16},
        compose.Text({text: '点击次数: ' + clicks.value}),
        compose.Button({
            testTag: 'start_button',
            contentDescription: '开始自动化',
            onClick: function () { clicks.value++; },
        }, compose.Text({testTag: 'start_label', text: '启动'})));
});
```

页面显示且无障碍服务已启用后, 在另一个非 UI 脚本中运行:

```js
let button = id('start_button').findOnce();
if (button !== null) {
    console.log(button.id()); // start_button.
    console.log(button.click()); // 动作接受时为 true.
}
```

点击返回 `true` 表示无障碍动作被接受. Compose 事件随后异步回到界面所属脚本线程; 如需确认业务完成, 应另外观察状态变化.

仅知道按钮文字时, 可向上查找可点击节点:

```js
let node = text('启动').findOnce();
while (node !== null && !node.clickable()) {
    node = node.parent();
}
if (node !== null) {
    node.click();
}
```

### 已知边界

- `LazyColumn` 与 `LazyRow` 只为已组合的可见区域及预取区域提供节点. 查找未出现的项之前, 应先滚动使其进入界面.
- 查找会话已经关闭或已经移除的节点不会返回仍有效的控件. 保存的无障碍节点也可能失效, 页面变化后应重新查找.
- 同名标签可能匹配多个节点. `findOnce()` 返回选择器当前遍历顺序下的第一个匹配项, 不表示标签具有全局唯一性.
- 本节的内置无障碍验收不代表已验证所有第三方无障碍服务, 也不等同于 TalkBack 完整可用性评估.

## 打包应用

### 运行时与插件依赖

使用 `compose` 的脚本可通过 AutoJs6 的 "打包应用" 流程生成独立 APK. APK Builder 插件将配套 Runtime Kit 中的 INRT 运行时与项目脚本装入应用, Compose UI 渲染器仍由目标设备上另行安装的 Compose UI 插件提供.

- 构建端需要包含 `compose` 模块的配套宿主和 APK Builder 插件, 其 Runtime Kit 也必须包含该模块及配套共享依赖.
- 运行端需要安装兼容的 Compose UI 插件, 包名为 `io.github.supermonster003.autojs6.plugin.compose.ui`. 打包不会自动把该插件 APK 嵌入应用, 应用启动也不会自动安装或授权插件.
- 使用 `compose.mount` 的项目入口脚本应保留 `'ui';` 模式声明. `compose.floaty` 仍须满足生成应用自身的悬浮窗授权与系统运行条件.
- Compose 渲染本身不依赖无障碍服务. 如果脚本同时使用无障碍选择器或动作, 则仍需满足这些 API 的授权条件.

当前属于配套本地构建的预览能力, 不能仅根据 APK Builder 的产品名称或版本名称判断其模板已经包含 Compose UI 支持.

### 应用版本与运行时版本

应用自己的版本和内嵌运行时的版本分别承担不同作用:

| 版本 | 来源 | 用途 |
| --- | --- | --- |
| 应用 `versionCode` / `versionName` | 项目的打包配置 | 应用自身的安装与升级. `versionCode` 可以从 `1` 开始. |
| INRT 运行时版本 | 配套 Runtime Kit 的宿主构建 | 校验 Compose UI 插件要求的最低宿主版本. |
| Compose UI 插件版本 | 目标设备上安装的插件 | 提供实际渲染器, 并与运行时校验契约和共享依赖兼容性. |

最低宿主版本检查使用 INRT 模板中的编译版本, 不使用生成应用的 `versionCode`. 因而不需要把自己的应用版本改成 AutoJs6 的构建号. 如果模板过旧, 应更新配套 Runtime Kit 并重新打包; 单独提高应用 `versionCode` 不会更新运行时.

同理, 更新设备上的 AutoJs6 主应用或构建端宿主, 不会改写已经生成的 APK 内部运行时. 新的运行时能力需要随重新打包后的应用版本交付.

### 启用状态与授权

生成应用使用自己的插件启用与授权记录. AutoJs6 主应用中保存的启用选择和用户授权不会自动复制到生成应用.

Compose UI 插件沿用既有的签名信任策略. 未保存启用选择时默认启用, 仍须通过签名信任检查; 显式禁用或系统停用会阻止装载. 应用自己的签名不会代替对插件签名的校验, 也不应通过修改权限声明或跳过检查来绕过授权失败.

### 缺失插件与错误处理

`compose.isAvailable()` 可用于探测当前是否可用, 但 `false` 本身不能区分缺失, 禁用, 未授权或不兼容. 需要获知原因时, 可捕获挂载时的类型化错误:

| `error.code` | 含义 |
| --- | --- |
| `PLUGIN_UNAVAILABLE` | 未找到可用插件, 包括目标设备未安装 Compose UI 插件. |
| `PLUGIN_DISABLED` | 插件被系统停用, 或在当前应用的启用记录中关闭. |
| `PLUGIN_UNAUTHORIZED` | 插件签名未通过当前应用的信任与授权检查. |
| `PLUGIN_INCOMPATIBLE` | 内嵌运行时版本, 插件契约或共享依赖不兼容. |

未安装插件时, 错误的 `message` 是包含插件包名的本地化说明. 应用可用已有的 XML 界面显示这一信息, 例如:

```js
'ui';

try {
    compose.mount(compose.Text({text: 'Compose UI 已就绪'}));
} catch (error) {
    if (error.code !== 'PLUGIN_UNAVAILABLE') {
        throw error;
    }
    ui.layout('<vertical padding="16"><text id="composeFailure" /></vertical>');
    ui.composeFailure.setText(error.code + '\n' + String(error.message));
}
```

上例仅处理挂载时插件不可用的情况, 其他错误继续交给脚本原有的错误处理. 安装兼容插件后重新启动应用, 可重新进行装载与兼容性检查.

### 验证范围

已使用配套本地 Runtime Kit 和独立 APK Builder 插件生成 x86_64 应用, 并在 API 37.1 / 16 KB 页模拟器上实际安装运行. 应用使用默认签名和 `versionCode: 1`, UI 脚本仍按模板内的运行时版本完成插件兼容性检查.

安装兼容 Compose UI 插件时, 同一应用可挂载计数器页面并通过按钮更新状态. 真实卸载插件后, 同一应用可在自己的 XML 界面显示 `PLUGIN_UNAVAILABLE` 及包含插件包名的本地化说明. 验收范围为 Rhino UI 入口, 默认应用签名及插件存在/缺失两种条件.

同一产物在上述两种条件下均已完成连续启动验证.
