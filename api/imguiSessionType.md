# ImGui 会话 (ImguiSession)

<!-- runtime-support:begin ImguiSession# -->
<!-- 本段由 generator/runtime-support.js 根据 AutoJs6 运行时覆盖矩阵生成, 不要手动修改; 数据源 ksp -->

| 运行时支持 | Rhino | Node.js 主线程 | Node.js Worker | Bun |
| --- | --- | --- | --- | --- |
| 入口 | `ImguiSession` 对象 | - | - | - |
| 状态 | 已支持 70 项 | 不适用 70 项 (仅限 Rhino 引擎), 等价写法: `engines.execScript of a Rhino script that opens the window, events.broadcast between the scripts` | 不适用 70 项 (仅限 Rhino 引擎), 等价写法: `engines.execScript of a Rhino script that opens the window, events.broadcast between the scripts` | 不适用 70 项 (仅限 Rhino 引擎), 等价写法: `engines.execScript of a Rhino script that opens the window, events.broadcast between the scripts` |

各 API 在同一运行时中的入口, 状态与授权一致, 没有差异项.

Node.js 与 Bun 的导入方式, 异步返回值与授权检查见 [运行时 API](runtimeApis#执行方式).

<!-- runtime-support:end -->

ImguiSession 表示一个运行中的 ImGui 窗口, 由 [imgui.createWindow](imgui#m-createwindow), [launchFloaty](imgui#m-launchfloaty), [launch](imgui#m-launch), [launchPrivileged](imgui#m-launchprivileged) 与 [runExample](imgui#m-runexample) 返回, 也是渲染回调的第二个参数. 不能直接用 `new` 创建. 类型声明中的名称是 `ImGui.Session`.

字段只读 (严格模式下写入抛出 TypeError), 用对应的 setter 修改. 位置和尺寸的单位是 dp, 乘以 [density](#p-density) 得到 px. 同一时间只有一个会话, 参阅 [会话, Surface 与根窗口](imgui#会话-surface-与根窗口).

只能在 Rhino 引擎中使用, Node.js 与 Bun 参阅 [在 Node.js / Bun 中使用](imgui#在-node-js-bun-中使用).

```js
let session = imgui.createWindow(function (ui, current) {
    ui.withWindow('会话', null, 0, function () {
        ui.text('位置 ' + current.x + ', ' + current.y + ' dp');
        if (ui.button('收起')) {
            current.collapse();
        }
    });
}, { width: 280, height: 180 });

session.on('moved', function (event) {
    console.log('移动到 ' + event.x + ', ' + event.y + ' (' + event.source + ')');
});
session.once('closed', function (event) {
    console.log('关闭: ' + event.reason);
});
session.setPosition(24, 120);
```

## 事件

用 [on](#m-on), [once](#m-once), [off](#m-off) 管理监听器, 也可以用 `createWindow` 的 `events` 与 `onXxx` 选项. 监听器在脚本线程上依次运行, 参数为事件对象和会话 (插件 1.18.0 及更早版本中 [once](#m-once) 的监听器只收到事件对象), 不要阻塞. 事件对象都有 `type` (事件名), `session` (会话) 和 `timestamp` (触发时的 `Date.now()`), 下表是各事件另有的字段. 载荷中的位置和尺寸单位是 dp.

| 事件 | 触发时机 | 载荷 |
| --- | --- | --- |
| `ready` | 第一帧可以绘制 | [SessionReadyEvent](#sessionreadyevent) |
| `surfaceRestored` | Surface 丢失后恢复 | [SessionReadyEvent](#sessionreadyevent) |
| `moved` | 悬浮窗移动 | [SessionMovedEvent](#sessionmovedevent) |
| `resized` | 悬浮窗大小改变 | [SessionResizedEvent](#sessionresizedevent) |
| `collapsed` | 收起到悬浮按钮 | [SessionCollapsedEvent](#sessioncollapsedevent) |
| `expanded` | 从悬浮按钮恢复 | [SessionExpandedEvent](#sessionexpandedevent) |
| `closed` | 会话关闭 | [SessionClosedEvent](#sessionclosedevent) |
| `configurationChanged` | 显示配置改变 | [SessionConfigurationEvent](#sessionconfigurationevent) |
| `touchableChanged` | 触摸模式或可触摸区域改变 | [SessionTouchableEvent](#sessiontouchableevent) |
| `moreTouchChanged` | `setMoreTouch` 生效 | [SessionMoreTouchEvent](#sessionmoretouchevent) |
| `alphaChanged` | 窗口不透明度改变 | [SessionAlphaEvent](#sessionalphaevent) |
| `secureChanged` | 安全标志改变 | [SessionSecureEvent](#sessionsecureevent) |
| `idle` | 帧循环进入空闲帧率 | [SessionIdleEvent](#sessionidleevent) |
| `active` | 帧循环回到全速 | [SessionActiveEvent](#sessionactiveevent) |
| `back` | Activity 模式下按返回键 | [SessionBackEvent](#sessionbackevent) |
| `fontScaleChanged` | 会话的字体缩放改变 | [SessionFontScaleEvent](#sessionfontscaleevent) |
| `error` | 回调抛出异常 | [SessionErrorEvent](#sessionerrorevent) |

`ready` 在 `createWindow` 返回之前同步触发. 插件 1.18.0 及更早版本中 `session.on('ready', ...)` 收不到它, 这些版本请用 `createWindow` 的 `onReady` / `events` 选项.

## SessionReadyEvent

Surface 可以绘制: 第一次是 `ready`, 恢复时是 `surfaceRestored`.

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `restored` | [boolean](dataTypes#boolean) | Surface 是否在丢失后恢复. |
| `mode` | [WindowMode](imgui#p-windowmode) | 窗口模式. |
| `backend` | [string](dataTypes#string) 或 [null](dataTypes#null) | 特权会话请求的后端, 其他情况为 `null`. |
| `width` | [number](dataTypes#number) | 窗口宽度. |
| `height` | [number](dataTypes#number) | 窗口高度. |

## SessionMovedEvent

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `x` | [number](dataTypes#number) | 新的左边缘. |
| `y` | [number](dataTypes#number) | 新的上边缘. |
| `oldX` | [number](dataTypes#number) | 之前的左边缘. |
| `oldY` | [number](dataTypes#number) | 之前的上边缘. |
| `source` | [string](dataTypes#string) | 移动来源: `drag`, `api`, `configuration` 等. |

## SessionResizedEvent

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `width` | [number](dataTypes#number) | 新的宽度. |
| `height` | [number](dataTypes#number) | 新的高度. |
| `oldWidth` | [number](dataTypes#number) | 之前的宽度. |
| `oldHeight` | [number](dataTypes#number) | 之前的高度. |
| `source` | [string](dataTypes#string) | 改变来源: `api`, `content`, `configuration` 等. |

## SessionConfigurationEvent

显示配置改变. 密度改变后窗口保持 dp 尺寸和位置, 字体和样式尺寸随之缩放; 系统字体大小改变只缩放字体. `imgui.launch` 的窗口改为以 `closeReason` 为 `configuration-changed` 关闭, 因为 Android 会重建它的 Activity. 帧循环每秒检查 4 次, 在两帧之间应用变化.

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `width` | [number](dataTypes#number) | 屏幕宽度. |
| `height` | [number](dataTypes#number) | 屏幕高度. |
| `oldWidth` | [number](dataTypes#number) | 之前的屏幕宽度. |
| `oldHeight` | [number](dataTypes#number) | 之前的屏幕高度. |
| `orientation` | `'landscape'` 或 `'portrait'` | 屏幕方向. |
| `density` | [number](dataTypes#number) | 显示密度. |
| `oldDensity` | [number](dataTypes#number) | 之前的显示密度. |
| `fontScale` | [number](dataTypes#number) | 系统字体缩放. |
| `oldFontScale` | [number](dataTypes#number) | 之前的系统字体缩放. |

## SessionFontScaleEvent

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `scale` | [number](dataTypes#number) | 新的缩放值, `0.5..3`. |
| `oldScale` | [number](dataTypes#number) | 之前的缩放值. |
| `source` | `'pinch'` 或 `'api'` | 改变来源. |

## SessionCollapsedEvent

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `button` | [ImguiFloatingButton](imguiFloatingButtonType) 或 [null](dataTypes#null) | 显示的悬浮按钮, 没有时为 `null`. |
| `fps` | [number](dataTypes#number) | 收起时的帧率. |

## SessionExpandedEvent

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `x` | [number](dataTypes#number) | 左边缘. |
| `y` | [number](dataTypes#number) | 上边缘. |
| `width` | [number](dataTypes#number) | 宽度. |
| `height` | [number](dataTypes#number) | 高度. |

## SessionClosedEvent

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `reason` | [string](dataTypes#string) | `closeReason` 的值. |

## SessionTouchableEvent

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `mode` | [TouchMode](imgui#p-touchmode) | 触摸模式. |
| `touchable` | [boolean](dataTypes#boolean) | Surface 是否接收触摸. |
| `interactiveRegionCount` | [number](dataTypes#number) | `TouchMode.Auto` 下的可触摸矩形数. |

## SessionMoreTouchEvent

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `enabled` | [boolean](dataTypes#boolean) | 新的状态. |

## SessionAlphaEvent

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `alpha` | [number](dataTypes#number) | 新的不透明度, `0..1`. |

## SessionSecureEvent

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `secure` | [boolean](dataTypes#boolean) | 新的状态. |

## SessionIdleEvent

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `fps` | [number](dataTypes#number) | 空闲帧率. |
| `idleDelay` | [number](dataTypes#number) | 经过的无输入时间, 单位 ms. |

## SessionActiveEvent

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `fps` | [number](dataTypes#number) | 全速帧率. |
| `reason` | `'input'` 或 `'screen'` 或 `'api'` | 结束空闲的原因. |

## SessionBackEvent

Activity 模式 (`imgui.launch`) 的返回键. 监听器运行后, 除非有监听器调用 `preventDefault()`, 否则会话以 `closeReason` 为 `back` 关闭. 显示中的软键盘优先处理返回键. 悬浮窗没有这个事件.

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `defaultPrevented` | [boolean](dataTypes#boolean) | 是否有监听器调用过 `preventDefault()`. |
| `preventDefault` | [Function](dataTypes#function) | 保持会话打开. |

## SessionErrorEvent

渲染回调 (`phase` 为 `render`) 或事件回调 (`phase` 为 `event`) 抛出异常. 错误也用 `console.error` 打印, 连续相同的错误只打印一次. 没有 `error` 监听器时渲染错误关闭会话 (`closeReason` 为 `render-error`); 有监听器时跳过这一帧余下的部分, 会话继续, 在监听器里调用 `session.close()` 可以结束. 高层组件绘制失败只关闭该组件. `error` 监听器自己抛出的异常只打印.

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `error` | [any](dataTypes#any) | 抛出的值. |
| `phase` | `'render'` 或 `'event'` | 抛出的位置. |
| `frame` | [number](dataTypes#number) | 出错前已显示的帧数. |
| `message` | [string](dataTypes#string) | `error.message`, 或转为字符串的错误. |
| `event` | [string](dataTypes#string) | 抛出异常的事件名 (`phase` 为 `event`), 悬浮按钮回调为 `buttonClick`. |
| `component` | [ImguiComponent](imguiComponentType) | 绘制时抛出异常的高层组件 (`phase` 为 `render`). |
| `button` | [ImguiFloatingButton](imguiFloatingButtonType) | 回调抛出异常的悬浮按钮 (事件 `buttonClick`). |

## CaptureOptions

[capture](#m-capture) 的选项.

| 选项 | 类型 | 说明 |
| --- | --- | --- |
| `region` | [Object](dataTypes#object) | 截取的部分, 单位 dp, 相对窗口左上角, 超出窗口的部分被截断. 默认整个窗口, `x` 和 `y` 默认 0, `width` 和 `height` 默认到窗口边缘. |

<p style="font: bold 2em sans-serif; color: #FF7043">ImguiSession</p>

## [p#] mode

**`READONLY`**

- { [WindowMode](imgui#p-windowmode) }

会话绘制的位置.

## [p#] privilegedBackend

**`READONLY`**

- { [string](dataTypes#string) | [null](dataTypes#null) }

特权会话选用的后端 (`'root'` 或 `'shizuku'`), 其他情况为 `null`.

## [p#] surface

**`READONLY`**

- { [any](dataTypes#any) | [null](dataTypes#null) }

特权模式下经 Binder 传递的 Android Surface, 其他情况为 `null`.

## [p#] window

**`READONLY`**

- { [any](dataTypes#any) }

承载 Surface 的悬浮窗或 Activity 窗口.

## [p#] surfaceView

**`READONLY`**

- { [any](dataTypes#any) }

显示帧的 Android 视图.

## [p#] imeView

**`READONLY`**

- { [any](dataTypes#any) | [null](dataTypes#null) }

接收输入法输入的隐藏文本框, `ime` 为 `false` 时为 `null`. 特权窗口中是临时输入框的 EditText, 没有打开时为 `null`.

## [p#] density

**`READONLY`**

- { [number](dataTypes#number) }

显示密度 (每 dp 的 px 数), 随显示配置改变.

## [p#] fontScale

**`READONLY`**

- { [number](dataTypes#number) }

会话的字体缩放, `0.5..3`, 默认 1. 由 [setFontScale](#m-setfontscale) 或捏合 (`pinchZoom` 选项) 设置. 它乘到每个字体的大小上, 不影响样式尺寸.

## [p#] displayWidth

**`READONLY`**

- { [number](dataTypes#number) }

屏幕宽度, 单位 dp.

## [p#] displayHeight

**`READONLY`**

- { [number](dataTypes#number) }

屏幕高度, 单位 dp.

## [p#] width

**`READONLY`**

- { [number](dataTypes#number) }

窗口宽度, 单位 dp.

## [p#] height

**`READONLY`**

- { [number](dataTypes#number) }

窗口高度, 单位 dp.

## [p#] x

**`READONLY`**

- { [number](dataTypes#number) }

窗口左边缘, 单位 dp.

## [p#] y

**`READONLY`**

- { [number](dataTypes#number) }

窗口上边缘, 单位 dp.

## [p#] alpha

**`READONLY`**

- { [number](dataTypes#number) }

窗口不透明度, `0..1`.

## [p#] secure

**`READONLY`**

- { [boolean](dataTypes#boolean) }

`FLAG_SECURE` 是否开启.

## [p#] moreTouch

**`READONLY`**

- { [boolean](dataTypes#boolean) }

窗口上的触摸是否同时到达下层应用.

## [p#] touchMode

**`READONLY`**

- { [TouchMode](imgui#p-touchmode) }

悬浮窗接收哪些触摸.

## [p#] touchable

**`READONLY`**

- { [boolean](dataTypes#boolean) }

Surface 现在是否接收触摸.

## [p#] interactiveRegionCount

**`READONLY`**

- { [number](dataTypes#number) }

`TouchMode.Auto` 下的可触摸矩形数.

## [p#] collapsed

**`READONLY`**

- { [boolean](dataTypes#boolean) }

会话是否收起到悬浮按钮.

## [p#] idle

**`READONLY`**

- { [boolean](dataTypes#boolean) }

会话是否因无输入而以 `idleFps` 渲染.

## [p#] paused

**`READONLY`**

- { [boolean](dataTypes#boolean) }

帧循环是否因熄屏或锁屏暂停.

## [p#] fps

**`READONLY`**

- { [number](dataTypes#number) }

展开且活动时的帧率, 参阅 [setFps](#m-setfps).

## [p#] collapsedFps

**`READONLY`**

- { [number](dataTypes#number) }

收起时的帧率.

## [p#] idleFps

**`READONLY`**

- { [number](dataTypes#number) }

空闲帧率, `0` 表示关闭省电, 参阅 [setIdleFps](#m-setidlefps).

## [p#] idleDelay

**`READONLY`**

- { [number](dataTypes#number) }

进入 `idleFps` 之前的无输入时间, 单位 ms.

## [p#] frameScheduler

**`READONLY`**

- { `"deadline-timer"` }

帧的调度方式, 固定为 `'deadline-timer'`.

## [p#] iniPath

**`READONLY`**

- { [string](dataTypes#string) | [null](dataTypes#null) }

解析后的设置文件路径, 关闭时为 `null`.

## [p#] debug

**`READONLY`**

- { [boolean](dataTypes#boolean) }

会话是否运行在调试模式 (`debug` 选项).

## [p#] ready

**`READONLY`**

- { [boolean](dataTypes#boolean) }

Surface 是否可以绘制.

## [p#] closed

**`READONLY`**

- { [boolean](dataTypes#boolean) }

会话是否已关闭.

## [p#] closeReason

**`READONLY`**

- { [string](dataTypes#string) | [null](dataTypes#null) }

关闭原因, 打开期间为 `null`. 常见的值有 `replaced`, `native-context-replaced`, `render-error`, `back`, `configuration-changed`.

## [p#] theme

**`READONLY`**

- { [ThemeName](imgui#p-themes) }

当前主题, 包括 `imgui.setTheme` 所做的改变.

## [p#] appearance

**`READONLY`**

- { [AppearanceName](imgui#p-appearance) | [null](dataTypes#null) }

外观预设, 没有时为 `null`.

## [p#] fonts

**`READONLY`**

- { [Object](dataTypes#object) }

按名称的字体句柄.

## [p#] textures

**`READONLY`**

- { [ImguiTexture](imguiTextureType)[] }

这个会话的纹理.

## [p#] buttons

**`READONLY`**

- { [ImguiFloatingButton](imguiFloatingButtonType)[] }

这个会话的悬浮按钮.

## [p#] components

**`READONLY`**

- { [ImguiComponent](imguiComponentType)[] }

这个会话的高层组件.

## [m#] createTexture

### session.createTexture(source, options?)

- **source** { [TextureSource](imgui#texturesource) } - 图像来源, 参阅 [TextureSource](imgui#texturesource).
- **[ options ]** { [TextureOptions](imguiTextureType#textureoptions) | [number](dataTypes#number) } - 选项, 参阅 [TextureOptions](imguiTextureType#textureoptions), 或标志的组合.
- <ins>**returns**</ins> { [ImguiTexture](imguiTextureType) }

与 [imgui.createTexture](imgui#m-createtexture) 相同, 会话关闭时释放纹理.

## [m#] destroyTexture

### session.destroyTexture(texture)

- **texture** { [ImguiTexture](imguiTextureType) } - 由 [createTexture](imgui#m-createtexture) 创建的纹理.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 已经释放过时为 `false`.

释放纹理.

## [m#] getBackendInfo

### session.getBackendInfo()

- <ins>**returns**</ins> { [string](dataTypes#string) }

实时的后端, UID, PID, Surface 与 direct input 诊断信息.

## [m#] on

### session.on(eventName, listener)

- **eventName** { [any](dataTypes#any) } - 事件名, 参阅 [事件](#事件).
- **listener** { [SessionEventListener](imguiSessionType#事件) } - 监听器, 在脚本线程上运行.
- <ins>**returns**</ins> { [ImguiSession](imguiSessionType) }

添加监听器.

## [m#] once

### session.once(eventName, listener)

- **eventName** { [any](dataTypes#any) } - 事件名, 参阅 [事件](#事件).
- **listener** { [SessionEventListener](imguiSessionType#事件) } - 监听器, 在脚本线程上运行.
- <ins>**returns**</ins> { [ImguiSession](imguiSessionType) }

添加只运行一次的监听器. 插件 1.18.0 及更早版本只把事件对象传给监听器, 会话用 `event.session` 取; 1.18.1 起与 [on](#m-on) 相同, 传 `(event, session)`.

## [m#] off

### session.off(eventName, listener?)

- **eventName** { [any](dataTypes#any) } - 事件名, 参阅 [事件](#事件).
- **[ listener ]** { [SessionEventListener](imguiSessionType#事件) | [null](dataTypes#null) } - 监听器, 在脚本线程上运行.
- <ins>**returns**</ins> { [ImguiSession](imguiSessionType) }

移除监听器. 没有第二个参数时移除这个事件的全部监听器.

## [m#] setPosition

### session.setPosition(x, y)

- **x** { [number](dataTypes#number) | [null](dataTypes#null) } - 左边缘.
- **y** { [number](dataTypes#number) | [null](dataTypes#null) } - 上边缘.
- <ins>**returns**</ins> { [ImguiSession](imguiSessionType) }

把窗口移到 `(x, y)`, 单位 dp, 限制在屏幕内. `null` 保持这个坐标.

## [m#] setSize

### session.setSize(width, height)

- **width** { [number](dataTypes#number) | [null](dataTypes#null) } - 宽度.
- **height** { [number](dataTypes#number) | [null](dataTypes#null) } - 高度.
- <ins>**returns**</ins> { [ImguiSession](imguiSessionType) }

把窗口大小改为 `width` x `height`, 单位 dp, 不超过屏幕. `null` 保持这一边.

## [m#] setTouchable

### session.setTouchable(mode)

- **mode** { [TouchMode](imgui#p-touchmode) | [boolean](dataTypes#boolean) } - [TouchMode](imgui#p-touchmode) 的值. `true` 相当于 `Touchable`, `false` 相当于 `Passthrough`.
- <ins>**returns**</ins> { [ImguiSession](imguiSessionType) }

改变悬浮窗接收哪些触摸.

## [m#] setMoreTouch

### session.setMoreTouch(enabled)

- **enabled** { [boolean](dataTypes#boolean) } - 是否开启.
- <ins>**returns**</ins> { [ImguiSession](imguiSessionType) }

让窗口上的触摸同时到达下层应用.

## [m#] setAlpha

### session.setAlpha(alpha)

- **alpha** { [number](dataTypes#number) } - 不透明度, `0..1`.
- <ins>**returns**</ins> { [ImguiSession](imguiSessionType) }

设置窗口不透明度.

## [m#] setSecure

### session.setSecure(secure)

- **secure** { [boolean](dataTypes#boolean) } - 是否开启 `FLAG_SECURE`.
- <ins>**returns**</ins> { [ImguiSession](imguiSessionType) }

开关 `FLAG_SECURE`.

## [m#] collapse

### session.collapse()

- <ins>**returns**</ins> { [ImguiSession](imguiSessionType) }

把 Surface (含全部根窗口) 收起到小按钮. 特权窗口抛出 Error.

## [m#] expand

### session.expand()

- <ins>**returns**</ins> { [ImguiSession](imguiSessionType) }

从小按钮恢复.

## [m#] toggleCollapsed

### session.toggleCollapsed()

- <ins>**returns**</ins> { [ImguiSession](imguiSessionType) }

在 `collapse` 与 `expand` 之间切换.

## [m#] setFps

### session.setFps(fps)

- **fps** { [number](dataTypes#number) } - 帧率, `15..120`.
- <ins>**returns**</ins> { [ImguiSession](imguiSessionType) }

设置展开且活动时的帧率.

## [m#] setIdleFps

### session.setIdleFps(idleFps, idleDelay?)

- **idleFps** { [number](dataTypes#number) } - 空闲帧率, `0..120`, `0` 关闭省电.
- **[ idleDelay ]** { [number](dataTypes#number) } - 无输入时间, 单位 ms, `100..3600000`.
- <ins>**returns**</ins> { [ImguiSession](imguiSessionType) }

设置空闲帧率, 可选地设置进入空闲之前的时间.

## [m#] getFps

### session.getFps()

- <ins>**returns**</ins> { [number](dataTypes#number) }

当前的目标帧率: 暂停时为 0, 收起时为 `collapsedFps`, 否则为空闲帧率或全速帧率.

## [m#] setFontScale

### session.setFontScale(scale)

- **scale** { [number](dataTypes#number) } - 缩放, `0.5..3`.
- <ins>**returns**</ins> { [ImguiSession](imguiSessionType) }

设置 [fontScale](#p-fontscale), 下一帧生效.

## [m#] capture

### session.capture(options?)

- **[ options ]** { [CaptureOptions](imguiSessionType#captureoptions) } - 选项, 参阅 [CaptureOptions](#captureoptions).
- <ins>**returns**</ins> { [CapturedImage](imageWrapperType) } - 窗口的图像, 需要 `recycle()`.

返回窗口最后显示的一帧, 是 images 模块的图像, 可以传给 `images.save` 等函数. 尺寸单位 px (窗口尺寸乘密度, 或 `region`), 没有绘制的地方是透明的. 用完调用 `recycle()`, 脚本结束时释放其余的图像.

悬浮窗和 Activity 窗口用 PixelCopy 读取, 最多等 5 秒, 也可以在渲染回调中调用, 得到上一帧. 特权窗口用 glReadPixels 读取, 只能在两帧之间调用, 例如放进 `setTimeout(fn, 0)`, 在渲染回调中调用会抛出 Error. 窗口已收起, 已关闭或还没有显示过帧时抛出 Error.

```js
let session = imgui.createWindow(function (ui) {
    ui.withWindow('截图', null, 0, function () {
        ui.text('Hello');
    });
}, { width: 240, height: 120 });

setTimeout(function () {
    let image = session.capture({ region: { width: 120 } });
    console.log(image.getWidth() + ' x ' + image.getHeight() + ' px');
    image.recycle();
}, 500);
```

## [m#] addButtonEx

### session.addButtonEx(label, callback, options?)

- **label** { [any](dataTypes#any) } - 按钮文字.
- **callback** { [Function](dataTypes#function) } - 点按时在脚本线程上调用.
- **[ options ]** { [FloatingButtonOptions](imguiFloatingButtonType#floatingbuttonoptions) } - 选项, 参阅 [FloatingButtonOptions](imguiFloatingButtonType#floatingbuttonoptions).
- <ins>**returns**</ins> { [ImguiFloatingButton](imguiFloatingButtonType) }

添加独立的 Android 悬浮按钮.

## [m#] logWindow

### session.logWindow(id?, options?)

- **[ id = 'default' ]** { [string](dataTypes#string) } - 组件 ID.
- **[ options ]** { [LogWindowOptions](imguiLogWindowType#logwindowoptions) } - 选项, 参阅 [LogWindowOptions](imguiLogWindowType#logwindowoptions).
- <ins>**returns**</ins> { [ImguiLogWindow](imguiLogWindowType) }

返回这个 ID 的日志窗口, 第一次调用时创建.

## [m#] toast

### session.toast(text, duration?, options?)

- **text** { [any](dataTypes#any) } - 消息文字.
- **[ duration = 2500 ]** { [number](dataTypes#number) | [ToastOptions](imguiToastType#toastoptions) } - 显示时长, 单位 ms, `0` 表示一直显示到关闭. 也可以直接传选项对象.
- **[ options ]** { [ToastOptions](imguiToastType#toastoptions) } - 选项, 参阅 [ToastOptions](imguiToastType#toastoptions).
- <ins>**returns**</ins> { [ImguiToast](imguiToastType) }

显示一条短消息.

## [m#] statsOverlay

### session.statsOverlay(id?, options?)

- **[ id = 'default' ]** { [string](dataTypes#string) | [StatsOverlayOptions](imguiStatsOverlayType#statsoverlayoptions) } - 组件 ID, 也可以直接传选项对象.
- **[ options ]** { [StatsOverlayOptions](imguiStatsOverlayType#statsoverlayoptions) } - 选项, 参阅 [StatsOverlayOptions](imguiStatsOverlayType#statsoverlayoptions).
- <ins>**returns**</ins> { [ImguiStatsOverlay](imguiStatsOverlayType) }

返回这个 ID 的帧率覆盖层, 第一次调用时创建.

## [m#] dataTable

### session.dataTable(id, headers, rows, options?)

- **id** { [string](dataTypes#string) } - 组件 ID.
- **headers** { [DataTableHeaderLike](imguiDataTableType#datatableheader)[] } - 列定义, 参阅 [DataTableHeader](imguiDataTableType#datatableheader).
- **rows** { [any](dataTypes#any)[] } - 初始的行.
- **[ options ]** { [DataTableOptions](imguiDataTableType#datatableoptions) } - 选项, 参阅 [DataTableOptions](imguiDataTableType#datatableoptions).
- <ins>**returns**</ins> { [ImguiDataTable](imguiDataTableType) }

返回这个 ID 的表格窗口, 第一次调用时创建.

## [m#] getComponent

### session.getComponent(type, id)

- **type** { [string](dataTypes#string) } - 组件类型: `logWindow`, `toast`, `dialog`, `statsOverlay` 或 `dataTable`.
- **id** { [string](dataTypes#string) } - 组件 ID.
- <ins>**returns**</ins> { [ImguiComponent](imguiComponentType) | [null](dataTypes#null) } - 没有时为 `null`.

读取高层组件.

## [m#] close

### session.close(reason?)

- **[ reason ]** { [string](dataTypes#string) } - 写入 `closeReason` 的原因.
- <ins>**returns**</ins> { [void](dataTypes#void) }

关闭会话.

## [m#] alert

### session.alert(title, message, options?)

**`Overload 1/2`**

- **title** { [string](dataTypes#string) } - 标题.
- **message** { [string](dataTypes#string) } - 正文.
- **[ options ]** { [DialogOptions](imguiDialogType#dialogoptions) } - 选项, 参阅 [DialogOptions](imguiDialogType#dialogoptions).
- <ins>**returns**</ins> { [ImguiDialogPromise](imguiDialogPromiseType) }

### session.alert(message, options?)

**`Overload 2/2`**

- **message** { [any](dataTypes#any) } - 正文.
- **[ options ]** { [DialogOptions](imguiDialogType#dialogoptions) } - 选项, 参阅 [DialogOptions](imguiDialogType#dialogoptions).
- <ins>**returns**</ins> { [ImguiDialogPromise](imguiDialogPromiseType) }

打开带确定按钮的模态消息, 下一帧显示. 结果: 点确定为 `true`, 对话框被关闭为 `false`.

## [m#] confirm

### session.confirm(title, message, options?)

**`Overload 1/2`**

- **title** { [string](dataTypes#string) } - 标题.
- **message** { [string](dataTypes#string) } - 正文.
- **[ options ]** { [DialogOptions](imguiDialogType#dialogoptions) } - 选项, 参阅 [DialogOptions](imguiDialogType#dialogoptions).
- <ins>**returns**</ins> { [ImguiDialogPromise](imguiDialogPromiseType) }

### session.confirm(message, options?)

**`Overload 2/2`**

- **message** { [any](dataTypes#any) } - 正文.
- **[ options ]** { [DialogOptions](imguiDialogType#dialogoptions) } - 选项, 参阅 [DialogOptions](imguiDialogType#dialogoptions).
- <ins>**returns**</ins> { [ImguiDialogPromise](imguiDialogPromiseType) }

打开带确定和取消按钮的模态询问. 结果: 点确定为 `true`, 点取消或对话框被关闭为 `false`.

## [m#] singleChoice

### session.singleChoice(title, items, selected?, options?)

**`Overload 1/3`**

- **title** { [string](dataTypes#string) } - 标题.
- **items** { [any](dataTypes#any)[] } - 列表项, 每项用 `String()` 显示, 带 `label` 属性时显示该属性.
- **[ selected = -1 ]** { [number](dataTypes#number) | [null](dataTypes#null) } - 初始选中的索引.
- **[ options ]** { [SingleChoiceOptions](imguiDialogType#singlechoiceoptions) } - 选项, 参阅 [SingleChoiceOptions](imguiDialogType#singlechoiceoptions).
- <ins>**returns**</ins> { [ImguiDialogPromise](imguiDialogPromiseType) }

### session.singleChoice(items, selected?, options?)

**`Overload 2/3`**

- **items** { [any](dataTypes#any)[] } - 列表项, 每项用 `String()` 显示, 带 `label` 属性时显示该属性.
- **[ selected = -1 ]** { [number](dataTypes#number) | [null](dataTypes#null) } - 初始选中的索引.
- **[ options ]** { [SingleChoiceOptions](imguiDialogType#singlechoiceoptions) } - 选项, 参阅 [SingleChoiceOptions](imguiDialogType#singlechoiceoptions).
- <ins>**returns**</ins> { [ImguiDialogPromise](imguiDialogPromiseType) }

### session.singleChoice(items, options)

**`Overload 3/3`**

- **items** { [any](dataTypes#any)[] } - 列表项, 每项用 `String()` 显示, 带 `label` 属性时显示该属性.
- **options** { [SingleChoiceOptions](imguiDialogType#singlechoiceoptions) } - 选项, 参阅 [SingleChoiceOptions](imguiDialogType#singlechoiceoptions).
- <ins>**returns**</ins> { [ImguiDialogPromise](imguiDialogPromiseType) }

打开模态列表, 选一行. 结果: 所选行的索引, 取消或对话框被关闭时为 `-1`.

## [m#] multiChoice

### session.multiChoice(title, items, selected?, options?)

**`Overload 1/3`**

- **title** { [string](dataTypes#string) } - 标题.
- **items** { [any](dataTypes#any)[] } - 列表项, 每项用 `String()` 显示, 带 `label` 属性时显示该属性.
- **[ selected ]** { [number](dataTypes#number)[] | [boolean](dataTypes#boolean)[] | [null](dataTypes#null) } - 初始选中的索引, 或每项一个布尔值.
- **[ options ]** { [MultiChoiceOptions](imguiDialogType#multichoiceoptions) } - 选项, 参阅 [MultiChoiceOptions](imguiDialogType#multichoiceoptions).
- <ins>**returns**</ins> { [ImguiDialogPromise](imguiDialogPromiseType) }

### session.multiChoice(items, selected?, options?)

**`Overload 2/3`**

- **items** { [any](dataTypes#any)[] } - 列表项, 每项用 `String()` 显示, 带 `label` 属性时显示该属性.
- **[ selected ]** { [number](dataTypes#number)[] | [boolean](dataTypes#boolean)[] | [null](dataTypes#null) } - 初始选中的索引, 或每项一个布尔值.
- **[ options ]** { [MultiChoiceOptions](imguiDialogType#multichoiceoptions) } - 选项, 参阅 [MultiChoiceOptions](imguiDialogType#multichoiceoptions).
- <ins>**returns**</ins> { [ImguiDialogPromise](imguiDialogPromiseType) }

### session.multiChoice(items, options)

**`Overload 3/3`**

- **items** { [any](dataTypes#any)[] } - 列表项, 每项用 `String()` 显示, 带 `label` 属性时显示该属性.
- **options** { [MultiChoiceOptions](imguiDialogType#multichoiceoptions) } - 选项, 参阅 [MultiChoiceOptions](imguiDialogType#multichoiceoptions).
- <ins>**returns**</ins> { [ImguiDialogPromise](imguiDialogPromiseType) }

打开模态的复选列表. 结果: 勾选行的索引数组, 取消或对话框被关闭时为 `null`.
