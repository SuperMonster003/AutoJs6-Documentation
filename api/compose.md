# Compose UI (Compose)

`compose` 与 `$compose` 提供由 Compose UI 插件渲染的脚本界面. 本页先说明无障碍节点与宿主选择器的关系; 完整组件和方法参考仍在补充.

<aside class="doc-status doc-status--incomplete">
<p><strong>文档状态:</strong> 无障碍与选择器已核实. 完整组件和方法参考仍在补充.</p>
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
