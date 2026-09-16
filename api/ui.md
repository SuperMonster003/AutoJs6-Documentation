# 用户界面 (UI)

UI 模式用于在独立的 `ScriptExecuteActivity` 中运行脚本并显示 Android 视图. 布局采用声明式 XML, 外观与 JSX 或 React 组件树相似, 但运行时由 Rhino 按 [E4X](e4x) XML 处理, 不是浏览器 DOM, JSX 或 React.

`ui` 模块提供布局渲染, 视图查询, UI 线程调度, 自定义控件和系统栏控制等功能. `$ui` 是 `ui` 的等效别名.

布局标签及属性的完整清单参阅 [UI 布局属性](uiAttributes).

## UI 模式

脚本的第一个有效语句使用字符串指令 `'ui';` 可启用 UI 模式. 注释和空行可以位于指令之前. 指令必须位于其他有效语句之前.

```js
'ui';

ui.layout(
    <vertical padding="16">
        <text id="title" text="AutoJs6" textSize="24sp"/>
        <button id="ok" text="确定"/>
    </vertical>,
);

ui.ok.on('click', function () {
    ui.title.attr('text', '已点击');
});
```

UI 模式脚本的 JavaScript 主线程就是 Android UI 线程. 不应在该线程执行耗时计算, 阻塞 I/O 或 `sleep`. 可在线程中完成耗时任务, 再通过 [ui.post](#m-post) 或 [ui.run](#m-run) 更新视图.

## 布局 XML

布局必须有一个根元素. 属性值最终会转换为字符串并交给对应的视图属性处理器. 标签和属性名称区分大小写.

```js
let xml = (
    <frame w="*" h="*">
        <text id="message"
              w="auto"
              h="auto"
              layout_gravity="center"
              text="Hello"/>
    </frame>
);

ui.layout(xml);
```

在 AutoJs6 简写布局中:

- `w="*"` 和 `h="*"` 分别转换为 `match_parent`.
- `w="auto"` 和 `h="auto"` 分别转换为 `wrap_content`.
- 未写单位的简写尺寸会补充 `dp`.
- `id="name"` 会转换为 `@+id/name`.
- `vertical`, `horizontal`, `frame` 等小写标签会转换为对应的 Android 视图类.
- `text`, `button` 和 `input` 元素的直接文本内容会转换为 `text` 属性. 其他元素的直接文本内容不会成为视图内容.

原生名称形式可使用 `android:layout_width="match_parent"` 等属性. 详细差异参阅 [布局转换模式](#布局转换模式).

### 内置标签

以下表格列出 AutoJs6 简写布局的全部内置标签. 同一行中的标签互为别名.

| 标签 | 实际视图 | 用途 |
| --- | --- | --- |
| `view` | `android.view.View` | 基础视图 |
| `space` | `android.widget.Space` | 空白占位视图 |
| `linear`, `horizontal` | `JsLinearLayout` | 默认水平方向的线性布局 |
| `vertical` | `JsLinearLayout` | 垂直方向的线性布局 |
| `frame` | `JsFrameLayout` | 帧布局 |
| `relative` | `JsRelativeLayout` | 相对布局 |
| `scroll` | `JsScrollView` | 垂直滚动布局 |
| `drawer` | `JsDrawerLayout` | 抽屉布局 |
| `appbar` | `JsAppBarLayout` | Material AppBar 布局 |
| `toolbar` | `JsToolbar` | 工具栏 |
| `actionmenu` | `JsActionMenuView` | 工具栏菜单布局 |
| `card` | `JsCardView` | 卡片布局 |
| `text` | `JsTextView` | 文本视图. Android API 级别低于 `26` 时使用兼容实现 |
| `button`, `btn` | `JsButton` | 按钮 |
| `input`, `edittext` | `JsEditText` | 文本输入框 |
| `checkedtext` | `JsCheckedTextView` | 可勾选文本 |
| `chronometer` | `JsChronometer` | 计时文本 |
| `textclock` | `JsTextClock` | 时钟文本 |
| `textswitcher` | `JsTextSwitcher` | 带切换动画的文本 |
| `checkbox` | `JsCheckBox` | 复选框 |
| `radio`, `radiobutton` | `JsRadioButton` | 单选按钮 |
| `radiogroup`, `radios` | `JsRadioGroup` | 单选按钮组 |
| `switch` | `JsSwitch` | 开关 |
| `togglebutton` | `JsToggleButton` | 切换按钮 |
| `spinner` | `JsSpinner` | 下拉选择器 |
| `numberpicker` | `JsNumberPicker` | 数值选择器 |
| `datepicker` | `JsDatePicker` | 日期选择器 |
| `timepicker` | `JsTimePicker` | 时间选择器 |
| `calendar` | `JsCalendarView` | 日历 |
| `search` | `JsSearchView` | 搜索框 |
| `progressbar` | `JsProgressBar` | 进度条 |
| `seekbar` | `JsSeekBar` | 拖动条 |
| `ratingbar` | `JsRatingBar` | 评分条 |
| `image`, `img` | `JsImageView` | 支持圆角的图片视图 |
| `imagebutton` | `JsImageButton` | 图片按钮 |
| `quickcontactbadge` | `JsQuickContactBadge` | 联系人快捷入口 |
| `fab` | `JsFloatingActionButton` | Material 浮动操作按钮 |
| `video` | `JsVideoView` | 视频视图 |
| `webview`, `web` | `JsWebView` | WebView |
| `canvas` | `JsCanvasView` | 可持续绘制的 Canvas 视图 |
| `console` | `JsConsoleView` | 当前脚本的控制台视图 (`global="true"` 或裸属性 `global` 时显示全局控制台) |
| `globalconsole` | `JsGlobalConsoleView` | 全局控制台视图, 等价于 `<console global>` |
| `list` | `JsListView` | 基于 RecyclerView 的列表 |
| `grid` | `JsGridView` | 基于 RecyclerView 的网格 |
| `viewpager` | `JsViewPager` | 分页视图 |
| `tabs`, `tab` | `JsTabLayout` | Material 标签栏 |
| `viewflipper` | `JsViewFlipper` | 自动或手动切换子视图 |
| `viewswitcher` | `JsViewSwitcher` | 两个子视图之间切换 |

也可将完整类名作为标签, 如 `<android.widget.TextView>`. 常用 AndroidX 和 Material 类还支持短类名, 如 `<ConstraintLayout>`, `<RecyclerView>`, `<NavigationView>` 和 `<TextInputLayout>`. 这些类仍由 AutoJs6 的动态布局器创建, 可用属性取决于 [UI 布局属性](uiAttributes) 中与其最近父类匹配的属性处理器. 未列出的 Android XML 属性不会因此自动获得支持.

`menu`, `item`, `shape`, `paths`, `set`, `selector`, `merge` 和小写 `view` 之外的保留节点不能作为动态类名使用. 其中小写 `view` 由 AutoJs6 显式映射为 `android.view.View`.

### 布局转换模式

默认情况下, `ui.useAndroidLayout(null)` 使用自动模式:

- XML 包含命名空间声明, 或包含 `android:` 或 `app:` 属性时, 保留原 XML.
- 其他 XML 先经过 AutoJs6 简写标签及属性转换.

`ui.useAndroidLayout(true)` 可强制保留原 XML, `ui.useAndroidLayout(false)` 可强制执行 AutoJs6 简写转换.

这里的 "保留原 XML" 只表示跳过 `XmlConverter` 的标签及属性改写. 布局仍由 AutoJs6 `DynamicLayoutInflater` 创建, 不会改用 Android 平台 `LayoutInflater`, 也不会自动支持完整的 Android XML 属性集.

```js
ui.useAndroidLayout(true);

let view = ui.inflate(
    '<android.widget.TextView ' +
    'xmlns:android="http://schemas.android.com/apk/res/android" ' +
    'android:layout_width="match_parent" ' +
    'android:layout_height="wrap_content" ' +
    'android:text="Hello"/>',
);
```

### 动态属性表达式

属性字符串中的 `{{ expression }}` 会在应用属性时执行. 普通布局的求值上下文默认为脚本全局作用域. 一个属性可包含多个表达式.

```js
'ui';

let name = 'AutoJs6';

ui.layout(
    <vertical>
        <text text="Hello, {{name}}"/>
    </vertical>,
);
```

普通布局中的表达式只在布局或属性被应用时求值, 不提供 React 式的自动重渲染. 变量改变后应使用视图方法或 `attr` 主动更新. `<list>` 和 `<grid>` 会在项目绑定时以项目对象为上下文重新应用动态属性.

表达式结果的转换规则:

- 字符串保持原值.
- AutoJs6 颜色对象转换为十六进制颜色字符串.
- `ThemeColor` 转换为主题主色.
- 其他值使用字符串形式拼接到属性值.

表达式会执行 JavaScript 代码. 不应把不可信文本直接拼接为 `{{ ... }}` 表达式.

### 视图 ID 与访问

设置内容视图后, `ui.<id>` 会从 `ui.view` 开始递归查找对应 ID:

```js
ui.layout(
    <vertical id="panel">
        <text id="message" text="Hello"/>
    </vertical>,
);

ui.message.attr('text', 'World');
ui.panel.message.attr('textColor', '#ff5722');
```

包装后的任意父视图也支持以 `parent.<id>` 递归查找后代视图.

若名称与 `ui` 已有成员冲突, 应使用 `ui.findById(id)`. 给 `ui.someName` 赋值会保存自定义属性并遮蔽同名 ID 查询; 赋值为 `null` 或 `undefined` 会移除遮蔽值.

### 列表与网格

`<list>` 和 `<grid>` 的第一个元素子节点是项目模板, 不是普通子视图. 数据源必须是 Rhino JavaScript 数组. `setDataSource(array)` 设置数据源后, 模板中的动态表达式以当前项目对象为求值上下文.

```js
'ui';

ui.layout(
    <list id="people">
        <horizontal padding="8">
            <text id="label"
                  layout_weight="1"
                  text="{{name}}: {{age}}"/>
            <button id="remove" text="删除"/>
        </horizontal>
    </list>,
);

let people = [
    { name: 'Alice', age: 18 },
    { name: 'Bob', age: 20 },
];

ui.people.setDataSource(people);

ui.people.on('item_click', function (item, position) {
    toast(item.name + ', index=' + position);
});

ui.people.on('item_bind', function (itemView, holder) {
    itemView.remove.on('click', function () {
        people.splice(holder.position, 1);
    });
});
```

AutoJs6 使用 `Array.observe` 监听数组本身的 `splice` 和索引更新, 并通知 RecyclerView. 修改 `people[0].name` 这类嵌套对象属性不会触发数组更新; 可替换整个数组元素, 或重新设置数据源.

`item_bind` 在 ViewHolder 创建时触发一次, 此时项目可能尚未写入 holder. `holder.item` 和 `holder.position` 是动态 getter, 应在之后发生的点击等回调中读取, 如上例所示.

列表事件参阅 [NativeView 事件](#nativeview-事件). `<grid>` 另外支持 `spanCount` 和布局方向等属性.

### 分页, 标签栏和抽屉

`<viewpager>` 的直接子视图会成为页面. `titles` 属性提供以分隔符拆分的页面标题. Material `TabLayout` 的原生方法可将标签栏与分页视图关联:

```js
ui.layout(
    <vertical>
        <tabs id="tabs"/>
        <viewpager id="pages" titles="首页|设置" layout_weight="1">
            <frame><text text="首页"/></frame>
            <frame><text text="设置"/></frame>
        </viewpager>
    </vertical>,
);

ui.tabs.setupWithViewPager(ui.pages);
```

`JsToolbar#setupWithDrawer(drawer)` 可安装 `ActionBarDrawerToggle` 并监听抽屉状态:

```js
ui.toolbar.setupWithDrawer(ui.drawer);
```

### Canvas 视图

`<canvas>` 是基于 `TextureView` 的持续绘制视图. `draw` 事件在专用单线程绘制循环中触发, 回调参数为 `(canvas, view)`. `setMaxFps(fps)` 设置最大帧率; `fps <= 0` 表示不主动限制帧间隔.

```js
ui.layout(<canvas id="board" w="*" h="*"/>);

ui.board.setMaxFps(30);
ui.board.on('draw', function (canvas) {
    canvas.drawColor('#ffffff');
});
```

Canvas 绘图 API 参阅 [画布](canvas).

### WebView 视图

`<webview>` 创建 `JsWebView`. 视图创建后, AutoJs6 会附加:

- `webview.events` - WebView 原生事件发射器.
- `webview.jsBridge` - 页面 JavaScript 与脚本之间的消息桥.

`jsBridge` 提供 `send(event, ...args)`, `handle(channel, handler)`, `invoke(channel, ...args)` 和 `eval(code)`. `invoke` 和 `eval` 返回 [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise). WebView 同时保留 Android `WebView` 的原生方法.

### 控制台视图

**`6.8.0`**

`<console>` 显示当前脚本自身的控制台, 内容与 `console.log` 等方法的输出一致 (脚本的输出同时会转发到全局控制台); `<globalconsole>` 显示所有脚本共用的全局控制台 (即应用 "日志" 页面显示的内容), 与 `<console global="true">` 或裸属性写法 `<console global>` 等价. 两者默认不显示标题栏, 不显示时间前缀, 并按日志等级着色.

```js
"ui";

ui.layout(
    <vertical>
        <console id="con" h="0" layout_weight="1" title="控制台" titleBackgroundColor="#3F51B5"/>
        <globalconsole h="0" layout_weight="1" timeVisible="true" timeFormat="HH:mm:ss"/>
    </vertical>
);

console.log("hello");
```

视图属性与 [console](console) 模块的 `setXxx` 方法一一对应, 如 `titleBackgroundColor` 对应 [console.setTitleBackgroundColor](console#m-settitlebackgroundcolor), `timeVisible` 对应 [console.setTimeVisible](console#m-settimevisible). 设置 `title` 后显示标题栏, 其右侧的 "更多" 按钮可显示或隐藏输入栏, 清空或复制日志以及打开设置对话框. 完整属性列表参阅 [UI 布局属性](uiAttributes#consoleview).

脚本调用 [console.rawInput](console#m-rawinput) 或 [console.input](console#m-input) 等待输入时, 视图底部会自动显示输入栏, 提交后自动隐藏; `inputVisible="true"` 可使其常驻显示.

## 控件扩展方法

内置标签返回的对象可调用对应 Android 类的原生方法. 下表列出 AutoJs6 控件类在 Android 父类之外新增的公开方法.

| 控件 | 方法 | 返回值及行为 |
| --- | --- | --- |
| `text`, `button`, `btn`, `input`, `edittext` | `text()` | 返回当前文本的 JavaScript 字符串 |
| `text`, `button`, `btn`, `input`, `edittext` | `text(value)` | 调用 `setText(value)`, 无返回值 |
| `frame`, `linear`, `horizontal`, `vertical`, `relative` | `id(id)` | 从自身递归查找 ID, 返回 Android View 或 `null` |
| `checkbox`, `switch` | `setChecked(checked, notify)` | 设置勾选状态. `notify=false` 时抑制本次 `check` 回调 |
| `checkbox`, `switch` | `toggle(notify)` | 切换勾选状态. `notify=false` 时抑制本次 `check` 回调 |
| `image`, `img` | `setSource(uri)` | 使用该视图的 Drawable 加载器设置 URI 或路径 |
| `image`, `img` | `setSource(image)` | 使用 [ImageWrapper](imageWrapperType) 的位图 |
| `list`, `grid` | `setDataSource(array)` | 设置 Rhino JavaScript 数组数据源 |
| `list`, `grid` | `getDataSource()` | 返回当前数据源 |
| `viewpager` | `setTitles(titles)` | 设置字符串数组标题. 直接调用后可再调用 `getAdapter().notifyDataSetChanged()` |
| `toolbar` | `setupWithDrawer(drawer)` | 安装并同步 `ActionBarDrawerToggle` |
| `canvas` | `setMaxFps(fps)` | 设置绘制循环最大帧率 |
| `video` | `clearMediaController()` | 清除 MediaController |
| `video` | `resetMediaController()` | 恢复视图创建时生成的默认 MediaController |
| `video` | `setCustomMediaController(controller)` | 设置自定义 MediaController 或 `null` |

`list` 和 `grid` 还有供布局器使用的 `setItemTemplate`, `setDataSourceAdapter` 和 `initWithScriptRuntime`. 常规脚本不应替换这些内部协作对象.

## NativeView 包装

由 `ui.inflate`, `ui.findById` 或 ID 属性访问返回的对象是 Android `View` 的 Rhino 包装对象. 它既可调用实际 Java 视图的方法, 也附加属性访问, 后代 ID 查询和事件方法.

### attr(name)

- **name** { [string](dataTypes#string) } - 属性名称
- <ins>**returns**</ins> { [string](dataTypes#string) | [undefined](dataTypes#undefined) } - 最近一次通过布局器设置的原始属性字符串

返回已注册属性保存的最近值. 此值不保证反映之后通过 Android 原生方法修改的实时状态. 未注册的属性返回 `undefined`.

### attr(name, value)

- **name** { [string](dataTypes#string) } - 属性名称
- **value** { [any](dataTypes#any) } - 转换为字符串后应用的属性值
- <ins>**returns**</ins> { [void](dataTypes#void) }

应用一个已注册属性. 未知属性不执行操作. 明确列为不支持的属性会抛出异常.

```js
ui.message.attr('text', 'Ready');
ui.message.attr('visibility', 'gone');
```

### attrReset(name)

- **name** { [string](dataTypes#string) } - 属性名称
- <ins>**returns**</ins> { [void](dataTypes#void) }

重新应用 [attr(name)](#attr-name) 当前保存的属性字符串. 此方法不是恢复 Android 默认值.

### click()

- <ins>**returns**</ins> { [void](dataTypes#void) }

调用 Android `View#performClick()`.

### click(listener)

- **listener** { [Function](dataTypes#function) } - `(view) => void`
- <ins>**returns**</ins> { [void](dataTypes#void) }

注册 `click` 事件监听器, 等效于 `view.on('click', listener)`.

### longClick()

- <ins>**returns**</ins> { [void](dataTypes#void) }

调用 Android `View#performLongClick()`.

### longClick(listener)

- **listener** { [Function](dataTypes#function) } - `(event, view) => void`
- <ins>**returns**</ins> { [void](dataTypes#void) }

注册 `long_click` 事件监听器.

### EventEmitter 方法

NativeView 转发以下 [EventEmitter](events#eventemitter) 方法:

- `once(eventName, listener)`
- `on(eventName, listener)`
- `addListener(eventName, listener)`
- `emit(eventName, ...args)`
- `eventNames()`
- `listenerCount(eventName)`
- `listeners(eventName)`
- `prependListener(eventName, listener)`
- `prependOnceListener(eventName, listener)`
- `removeAllListeners()`
- `removeAllListeners(eventName)`
- `removeListener(eventName, listener)`
- `setMaxListeners(number)`

`maxListeners` 是当前最大监听器数量属性. 包装原型的 `defaultMaxListeners()` 返回全局默认值.

### widget

自定义控件根视图的 `widget` 属性指向该 [ui.Widget](#c-widget) 实例. 普通视图的该属性为 `null`.

### NativeView 事件

| 事件 | 回调参数 | 适用视图及说明 |
| --- | --- | --- |
| `click` | `(view)` | 所有 View |
| `long_click` | `(event, view)` | 所有 View. `event.consumed = true` 可消费长按 |
| `touch` | `(event, view)` | 所有 View. 每个触摸事件触发 |
| `touch_down` | `(event, view)` | 所有 View. `ACTION_DOWN` |
| `touch_up` | `(event, view)` | 所有 View. `ACTION_UP` |
| `touch_move` | `(event, view)` | 所有 View. `ACTION_MOVE` |
| `key` | `(keyCode, event, view)` | 所有 View. 每个按键事件触发 |
| `key_down` | `(keyCode, event, view)` | 所有 View. 按键按下 |
| `key_up` | `(keyCode, event, view)` | 所有 View. 按键抬起 |
| `scroll_change` | `(event, view)` | 所有 View. `event` 含 `scrollX`, `scrollY`, `oldScrollX`, `oldScrollY` |
| `check` | `(isChecked, buttonView)` | `CompoundButton`, 如 checkbox, radio, switch 和 togglebutton |
| `item_click` | `(item, position, itemView, listView)` | list 和 grid |
| `item_long_click` | `(event, item, position, itemView, listView)` | list 和 grid. `event.consumed = true` 可消费长按 |
| `item_bind` | `(itemView, holder)` | list 和 grid. `holder.item` 和 `holder.position` 指向当前项目 |

为 `touch`, `long_click`, `key` 或 `item_long_click` 的 `event.consumed` 赋值为 `true`, 会使对应 Android 监听器返回已消费.

## 自定义控件

自定义控件构造函数继承 `ui.Widget`, `render()` 返回根布局, 再通过 `ui.registerWidget(name, constructor)` 注册为 XML 标签.

```js
'ui';

let LabeledInput = (function () {
    util.extend(LabeledInput, ui.Widget);

    function LabeledInput() {
        ui.Widget.call(this);
        this.defineAttr('label', function (view, name, value) {
            view.caption.attr('text', value);
        });
    }

    LabeledInput.prototype.render = function () {
        return (
            <vertical>
                <text id="caption"/>
                <input id="editor"/>
            </vertical>
        );
    };

    LabeledInput.prototype.getText = function () {
        return String(this.view.editor.getText());
    };

    ui.registerWidget('labeled-input', LabeledInput);
    return LabeledInput;
})();

ui.layout(
    <vertical>
        <labeled-input id="name" label="姓名"/>
        <button id="read" text="读取"/>
    </vertical>,
);

ui.read.on('click', function () {
    toast(ui.name.widget.getText());
});
```

自定义标签的普通属性仍会交给 `render()` 返回的根视图处理. 由 `defineAttr` 声明的同名属性会优先交给自定义控件.

---

<p style="font: bold 2em sans-serif; color: #FF7043">globalThis</p>

---

## [m] globalThis.isUiThread

### globalThis.isUiThread()

**`Global`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 当前线程是否为 Android UI 线程

`ui.isUiThread()` 与全局 `isUiThread()` 等效.

---

<p style="font: bold 2em sans-serif; color: #FF7043">ui</p>

---

## [p] view

**`Getter/Setter`**

- { [View](https://developer.android.com/reference/android/view/View) | [null](dataTypes#null) } - 当前内容视图

[ui.setContentView](#m-setcontentview) 会同步设置此属性. `ui.findById` 和 `ui.<id>` 从此视图开始查找.

直接给 `ui.view` 赋值只改变查找起点, 不会调用 Activity 的 `setContentView`.

## [p] bindingContext

**`Getter/Setter`**

- { [Object](dataTypes#object) | [null](dataTypes#null) } - 动态属性表达式的求值上下文

初始值为脚本全局作用域. 列表绑定项目期间, AutoJs6 会临时替换为当前项目对象, 完成后恢复.

此属性供高级动态布局使用. 修改后只影响之后应用的动态属性, 不会自动刷新现有视图.

## [p] layoutInflater

**`Getter`**

- { [DynamicLayoutInflater](https://github.com/SuperMonster003/AutoJs6) } - 当前运行时的动态布局器

供需要直接使用 `InflateContext` 或布局器标志的高级场景使用. 常规布局应使用 [ui.inflate](#m-inflate) 或 [ui.layout](#m-layout).

## [p+] R

**`Getter`**

- { [Object](dataTypes#object) } - AutoJs6 应用资源对象

[global.R](global#p-r) 的别名. 可通过 `ui.R.string`, `ui.R.drawable` 等下级属性访问资源 ID.

## [p] root

**`6.6.3`** **`UI`** **`Getter`**

- { [ViewGroup](https://developer.android.com/reference/android/view/ViewGroup) | [null](dataTypes#null) } - Activity 中 ID 为 `android.R.id.content` 的窗口根容器

当前 Activity 不是脚本 UI Activity 时返回 `null`. `root` 与 [ui.view](#p-view) 不同, 前者是 Activity 的外层内容容器.

## [p] emitter

**`UI`** **`Getter`**

- { [EventEmitter](events#eventemitter) | [null](dataTypes#null) } - 脚本 UI Activity 的事件发射器

当前 Activity 不是脚本 UI Activity 时返回 `null`.

常用事件:

| 事件 | 参数 |
| --- | --- |
| `create` | `(savedInstanceState)` |
| `pause` | `()` |
| `resume` | `()` |
| `save_instance_state` | `(outState)` |
| `restore_instance_state` | `(savedInstanceState)` |
| `back_pressed` | `(event)` |
| `key_down` | `(keyCode, keyEvent, event)` |
| `generic_motion_event` | `(motionEvent, event)` |
| `activity_result` | `(requestCode, resultCode, data)` |
| `create_options_menu` | `(menu)` |
| `options_item_selected` | `(event, menuItem)` |

`back_pressed`, `key_down` 和 `options_item_selected` 的控制事件支持 `event.consumed = true`.

## [p] statusBarHeight

**`6.6.2`** **`[6.7.0]`** **`Getter`**

- { [number](dataTypes#number) } - 状态栏稳定高度, 单位为 px

等效于使用默认选项调用 [ui.getStatusBarHeight](#m-getstatusbarheight).

## [p] visibleStatusBarHeight

**`6.7.0`** **`Getter`**

- { [number](dataTypes#number) } - 当前可见状态栏高度, 单位为 px

等效于使用默认选项调用 [ui.getVisibleStatusBarHeight](#m-getvisiblestatusbarheight).

## [p] navigationBarHeight

**`6.7.0`** **`Getter`**

- { [number](dataTypes#number) } - 导航栏稳定厚度, 单位为 px

等效于使用默认选项调用 [ui.getNavigationBarHeight](#m-getnavigationbarheight).

## [p] visibleNavigationBarHeight

**`6.7.0`** **`Getter`**

- { [number](dataTypes#number) } - 当前可见导航栏厚度, 单位为 px

等效于使用默认选项调用 [ui.getVisibleNavigationBarHeight](#m-getvisiblenavigationbarheight).

## [m] useAndroidLayout

### useAndroidLayout(enabled?)

- **[ enabled = true ]** { [boolean](dataTypes#boolean) | [null](dataTypes#null) } - 布局转换模式
- <ins>**returns**</ins> { [void](dataTypes#void) }

控制后续 XML 是否经过 AutoJs6 简写转换:

- `true` - 保留原 XML.
- `false` - 强制执行 AutoJs6 简写转换.
- `null` - 根据命名空间和带前缀属性自动判断.

该设置不会改用 Android 平台 `LayoutInflater`. 参阅 [布局转换模式](#布局转换模式).

## [m] layout

### layout(xml)

**`UI`**

- **xml** { [XML](e4x) | [string](dataTypes#string) | [Document](https://developer.android.com/reference/org/w3c/dom/Document) } - 布局
- <ins>**returns**</ins> { [void](dataTypes#void) }

渲染布局并将根视图设置为当前 UI Activity 的内容视图. 非 UI 模式调用时抛出异常.

## [m] layoutFile

### layoutFile(path)

**`UI`**

- **path** { [string](dataTypes#string) } - XML 文件路径
- <ins>**returns**</ins> { [void](dataTypes#void) }

读取文件内容并调用 [ui.layout](#m-layout).

## [m] inflate

### inflate(xml, parent?, isAttachedToParent?)

- **xml** { [XML](e4x) | [string](dataTypes#string) | [Document](https://developer.android.com/reference/org/w3c/dom/Document) } - 布局
- **[ parent = null ]** { [ViewGroup](https://developer.android.com/reference/android/view/ViewGroup) | [null](dataTypes#null) } - 父视图
- **[ isAttachedToParent = false ]** { [boolean](dataTypes#boolean) } - 是否立即附加到父视图
- <ins>**returns**</ins> { [View](https://developer.android.com/reference/android/view/View) } - NativeView 包装后的根视图

动态渲染并返回视图. 在非 UI 模式下, 使用带 `ScriptTheme` 的应用上下文; 在 UI 模式下使用当前脚本 Activity.

传入 `parent` 可使依赖父布局参数的属性在渲染时正确应用. `isAttachedToParent` 为 `true` 时, 布局器会把结果直接附加到 `parent`.

```js
let child = ui.inflate(
    <text text="动态视图"/>,
    ui.container,
    false,
);
ui.container.addView(child);
```

## [m] setContentView

### setContentView(view)

**`UI`**

- **view** { [View](https://developer.android.com/reference/android/view/View) } - 内容视图
- <ins>**returns**</ins> { [void](dataTypes#void) }

在 UI 线程调用 Activity 的 `setContentView`, 并同步更新 [ui.view](#p-view).

## [m] registerWidget

### registerWidget(name, widget)

- **name** { [string](dataTypes#string) } - 非空 XML 标签名称
- **widget** { [Function](dataTypes#function) } - `ui.Widget` 子类构造函数
- <ins>**returns**</ins> { [void](dataTypes#void) }

注册自定义控件. 同名注册会替换当前运行时中的旧构造函数.

## [m] findById

### findById(id)

- **id** { [string](dataTypes#string) | [null](dataTypes#null) } - 视图 ID
- <ins>**returns**</ins> { [View](https://developer.android.com/reference/android/view/View) | [null](dataTypes#null) } - NativeView 包装后的匹配视图

从 [ui.view](#p-view) 开始递归查找. 尚未设置内容视图或没有匹配项时返回 `null`.

ID 可写为普通名称或资源 ID 形式, 如 `title`, `@id/title` 或 `@+id/title`.

## [m] findView

### findView(id)

- **id** { [string](dataTypes#string) | [null](dataTypes#null) } - 视图 ID
- <ins>**returns**</ins> { [View](https://developer.android.com/reference/android/view/View) | [null](dataTypes#null) }

[ui.findById](#m-findbyid) 的等效方法.

## [m] findByStringId

### findByStringId(view, id)

- **view** { [View](https://developer.android.com/reference/android/view/View) } - 查找起点
- **id** { [string](dataTypes#string) | [null](dataTypes#null) } - 视图 ID
- <ins>**returns**</ins> { [View](https://developer.android.com/reference/android/view/View) | [null](dataTypes#null) }

从指定视图开始递归查找并返回 NativeView 包装对象.

## [m] ui.isUiThread

### ui.isUiThread()

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 当前线程是否为 Android UI 线程

全局 [isUiThread](#m-isuithread) 的模块形式.

## [m] post

### post(action, delay?)

**`Async`**

- **action** { [Function](dataTypes#function) } - 无参数回调
- **[ delay ]** { [number](dataTypes#number) } - 延迟时间, 单位为 ms
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - Android Handler 是否成功加入任务

将回调加入 UI 线程消息队列. 省略或传入 `null` 时立即加入, 否则使用 `postDelayed`. 延迟只表示最早调度时间, 不保证精确执行时刻.

```js
threads.start(function () {
    let result = performLongTask();
    ui.post(function () {
        ui.message.attr('text', String(result));
    });
});
```

## [m] run

### run(action)

- **action** { [Function](dataTypes#function) } - 无参数回调
- <ins>**returns**</ins> { [any](dataTypes#any) } - 回调结果

在 UI 线程执行回调. 当前已在 UI 线程时立即执行; 否则加入 UI 线程并阻塞调用线程直到完成. 回调抛出的异常会在调用线程重新抛出.

不要从持有 UI 线程所需锁的线程调用此方法, 以免死锁.

## [m] finish

### finish()

**`UI`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

结束当前脚本 UI Activity. Activity 已结束或已销毁时不重复操作.

## [m] keepScreenOn

### keepScreenOn()

**`6.6.3`** **`UI`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

为窗口添加 `FLAG_KEEP_SCREEN_ON`. 此标志不会阻止用户主动锁定屏幕.

## [m] backgroundColor

### backgroundColor(color)

**`UI`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 窗口背景颜色
- <ins>**returns**</ins> { [void](dataTypes#void) }

将颜色强制转换为完全不透明色, 并设置为当前窗口背景.

## [m] statusBarColor

### statusBarColor(color)

**`UI`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 状态栏背景颜色
- <ins>**returns**</ins> { [void](dataTypes#void) }

设置当前 UI Activity 的状态栏背景颜色.

## [m] statusBarIconLight

### statusBarIconLight(isLight?)

**`6.6.4`** **`UI`**

- **[ isLight = true ]** { [boolean](dataTypes#boolean) } - 是否使用浅色图标
- <ins>**returns**</ins> { [void](dataTypes#void) }

设置状态栏图标明暗.

## [m] statusBarIconLightBy

### statusBarIconLightBy(refColor)

**`6.6.4`** **`UI`**

- **refColor** { [OmniColor](omniTypes#omnicolor) } - 参考背景颜色
- <ins>**returns**</ins> { [void](dataTypes#void) }

根据参考颜色亮度选择状态栏图标. 深色背景使用浅色图标, 浅色背景使用深色图标.

## [m] navigationBarColor

### navigationBarColor(color)

**`6.6.2`** **`UI`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 导航栏背景颜色
- <ins>**returns**</ins> { [void](dataTypes#void) }

设置当前 UI Activity 的导航栏背景颜色.

## [m] navigationBarIconLight

### navigationBarIconLight(isLight?)

**`6.6.4`** **`UI`** **`API>=26!`**

- **[ isLight = true ]** { [boolean](dataTypes#boolean) } - 是否使用浅色图标
- <ins>**returns**</ins> { [void](dataTypes#void) }

设置导航栏图标明暗. Android API 级别低于 `26` 时抛出异常.

## [m] navigationBarIconLightBy

### navigationBarIconLightBy(refColor)

**`6.6.4`** **`UI`** **`API>=26!`**

- **refColor** { [OmniColor](omniTypes#omnicolor) } - 参考背景颜色
- <ins>**returns**</ins> { [void](dataTypes#void) }

根据参考颜色亮度选择导航栏图标. Android API 级别低于 `26` 时抛出异常.

## [m] getStatusBarHeight

### getStatusBarHeight(options?)

**`6.7.0`**

- **[ options = {} ]** {{
    - withComputed?: [boolean](dataTypes#boolean);
    - withDimen?: [boolean](dataTypes#boolean);
    - ignoreVisibility?: [boolean](dataTypes#boolean);
- }}
- <ins>**returns**</ins> { [number](dataTypes#number) } - 状态栏高度, 单位为 px

三个选项均默认为 `true`.

- `withComputed` - 允许使用显示尺寸差值估算.
- `withDimen` - 允许使用 Android 内部尺寸资源回退.
- `ignoreVisibility` - 忽略当前可见性并返回稳定高度. 为 `false` 时, 不可见或无法确定则返回 `0`.

## [m] getVisibleStatusBarHeight

### getVisibleStatusBarHeight(options?)

**`6.7.0`**

- **[ options = {} ]** {{
    - withComputed?: [boolean](dataTypes#boolean);
    - withDimen?: [boolean](dataTypes#boolean);
- }}
- <ins>**returns**</ins> { [number](dataTypes#number) } - 当前可见状态栏高度, 单位为 px

强制使用可见性模式. 状态栏不可见或无法确定时返回 `0`. 当前实现不会在可见性模式中使用估算或内部尺寸资源回退.

## [m] getNavigationBarHeight

### getNavigationBarHeight(options?)

**`6.7.0`**

- **[ options = {} ]** {{
    - withComputed?: [boolean](dataTypes#boolean);
    - withDimen?: [boolean](dataTypes#boolean);
    - ignoreVisibility?: [boolean](dataTypes#boolean);
- }}
- <ins>**returns**</ins> { [number](dataTypes#number) } - 导航栏厚度, 单位为 px

三个选项均默认为 `true`. 横屏导航栏位于侧边时, 返回 bottom, left 和 right 三个方向中的最大值.

## [m] getVisibleNavigationBarHeight

### getVisibleNavigationBarHeight(options?)

**`6.7.0`**

- **[ options = {} ]** {{
    - withComputed?: [boolean](dataTypes#boolean);
    - withDimen?: [boolean](dataTypes#boolean);
- }}
- <ins>**returns**</ins> { [number](dataTypes#number) } - 当前可见导航栏厚度, 单位为 px

强制使用可见性模式. 导航栏不可见或无法确定时返回 `0`. 当前实现不会在可见性模式中使用估算或内部尺寸资源回退.

## [C] Widget

### new Widget()

- <ins>**returns**</ins> { [Object](dataTypes#object) } - 自定义控件基类实例

构造实例并为其创建独立的自定义属性表. 通常通过 `util.extend(CustomWidget, ui.Widget)` 建立继承, 并在子类构造函数中调用 `ui.Widget.call(this)`.

### Widget#render()

- <ins>**returns**</ins> { [XML](e4x) | [string](dataTypes#string) } - 自定义控件根布局

由子类实现. 返回值不能为 `null` 或 `undefined`. 未实现时, 内部 `renderInternal()` 返回空 XML.

### Widget#defineAttr(name)

**`Overload 1/4`**

- **name** { [string](dataTypes#string) } - 自定义属性名称
- <ins>**returns**</ins> { [void](dataTypes#void) }

使用同名实例属性保存值.

### Widget#defineAttr(name, alias, applier?)

**`Overload 2/4`**

- **name** { [string](dataTypes#string) } - 自定义属性名称
- **alias** { [string](dataTypes#string) } - 保存值的实例属性名称
- **[ applier ]** { [Function](dataTypes#function) } - `(view, name, value, defaultSetter) => void`
- <ins>**returns**</ins> { [void](dataTypes#void) }

应用属性时先把值保存到 `this[alias]`, 再调用可选的 `applier`.

### Widget#defineAttr(name, applier)

**`Overload 3/4`**

- **name** { [string](dataTypes#string) } - 自定义属性名称
- **applier** { [Function](dataTypes#function) } - `(view, name, value, defaultSetter) => void`
- <ins>**returns**</ins> { [void](dataTypes#void) }

使用同名实例属性保存值, 再调用 `applier`.

### Widget#defineAttr(name, getter, setter)

**`Overload 4/4`**

- **name** { [string](dataTypes#string) } - 自定义属性名称
- **getter** { [Function](dataTypes#function) } - `(view, name, defaultGetter) => any`
- **setter** { [Function](dataTypes#function) } - `(view, name, value, defaultSetter) => void`
- <ins>**returns**</ins> { [void](dataTypes#void) }

完整定义属性读取和写入逻辑.

### Widget#hasAttr(name)

- **name** { [string](dataTypes#string) } - 属性名称
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

检查自定义属性表中是否存在该名称.

### Widget#setAttr(view, name, value, defaultSetter)

- **view** { [View](https://developer.android.com/reference/android/view/View) } - 根视图
- **name** { [string](dataTypes#string) } - 属性名称
- **value** { [string](dataTypes#string) } - 属性值
- **defaultSetter** { [Function](dataTypes#function) | [undefined](dataTypes#undefined) } - 根视图的默认属性写入函数
- <ins>**returns**</ins> { [void](dataTypes#void) }

调用 `defineAttr` 保存的 setter. 主要由布局器内部调用.

### Widget#getAttr(view, name, defaultGetter)

- **view** { [View](https://developer.android.com/reference/android/view/View) } - 根视图
- **name** { [string](dataTypes#string) } - 属性名称
- **defaultGetter** { [Function](dataTypes#function) | [undefined](dataTypes#undefined) } - 根视图的默认属性读取函数
- <ins>**returns**</ins> { [any](dataTypes#any) }

调用 `defineAttr` 保存的 getter. 主要由 NativeView `attr(name)` 内部调用.

### Widget#onViewCreated(view)

- **view** { [View](https://developer.android.com/reference/android/view/View) } - 已创建的根视图
- <ins>**returns**</ins> { [void](dataTypes#void) }

可选生命周期方法. 根视图创建并安装自定义属性委托后调用. 此时后代布局可能尚未全部完成.

### Widget#onFinishInflation(view)

- **view** { [View](https://developer.android.com/reference/android/view/View) } - 已完成渲染的根视图
- <ins>**returns**</ins> { [void](dataTypes#void) }

可选生命周期方法. 自定义控件作为其他布局的一部分完成渲染后调用.

`notifyViewCreated(view)` 和 `notifyAfterInflation(view)` 是分别触发上述生命周期方法的内部入口.
