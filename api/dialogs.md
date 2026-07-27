# 对话框 (Dialogs)

---

<aside class="doc-status doc-status--incomplete" data-marked-by="SuperMonster003" data-marked-on="2022-10-22">
<p><strong>文档状态:</strong> 此章节仍在补充或完善中.</p>
</aside>

dialogs 模块提供了简单的对话框支持, 可以通过对话框和用户进行交互. 最简单的例子如下:

```js
alert('您好');
```

这段代码会弹出一个消息提示框显示 "您好", 并在用户点击 "确定" 后继续运行. 稍微复杂一点的例子如下:

```js
let clear = confirm('要清除所有缓存吗?');
if (clear) {
    alert('清除成功!');
}
```

`confirm()` 会弹出一个对话框并让用户选择 "是" 或 "否", 如果选择 "是" 则返回 true.

需要特别注意的是, 对话框在 ui 模式下不能像通常那样使用, 应该使用回调函数或者 [Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/) 的形式. 理解这一点可能稍有困难. 举个例子:

```js
'ui';

/* 回调形式. */
confirm('要清除所有缓存吗?', (confirmed) => {
    if (confirmed) {
        alert('清除成功!');
    }
});

/* Promise 形式. */
confirm('要清除所有缓存吗?')
    .then(clear => {
        if (clear) {
            alert('清除成功!');
        }
    });
```

## [m] alert

### alert(title, content?, callback?)

**`Global`**

- **title** { [string](dataTypes#string) } - 对话框标题
- **[ content = "" ]** { [string](dataTypes#string) } - 对话框正文
- **[ callback ]** { [Function](dataTypes#function) } - 关闭回调
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [null](dataTypes#null) } - UI 线程中的结果 Promise 或 `null`

显示只有确定按钮的提示对话框.

- 非 UI 线程调用时, 阻塞到对话框关闭并返回 `null`. 指定回调时也会调用回调.
- UI 线程且未指定回调时, 返回在对话框关闭后兑现的 Promise.
- UI 线程指定回调时, 立即返回 `null`, 并在关闭后调用回调. `content` 位置也可直接传入回调.

```js
alert('出现错误', '出现未知错误, 请联系脚本作者');
```

## [m] confirm

### confirm(title, content?, callback?)

**`Global`**

- **title** { [string](dataTypes#string) } - 对话框标题
- **[ content = "" ]** { [string](dataTypes#string) } - 对话框正文
- **[ callback ]** { [Function](dataTypes#function) } - 结果回调, 接收是否确认
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) | [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [null](dataTypes#null) } - 确认结果, 结果 Promise 或 `null`

显示带确定和取消按钮的对话框.

- 非 UI 线程调用时, 阻塞并返回布尔结果. 指定回调时也会将结果传给回调.
- UI 线程且未指定回调时, 返回兑现值为布尔结果的 Promise.
- UI 线程指定回调时, 立即返回 `null`, 并将布尔结果传给回调. `content` 位置也可直接传入回调.

```js
if (confirm('清除缓存', '确定要清除全部缓存吗?')) {
    console.log('confirmed');
}
```

## [m] rawInput

### rawInput(title, prefill?, callback?)

**`Global`**

- **title** { [string](dataTypes#string) } - 对话框标题
- **[ prefill = "" ]** { [string](dataTypes#string) } - 输入框初始内容
- **[ callback ]** { [Function](dataTypes#function) } - 结果回调, 接收输入字符串或 `null`
- <ins>**returns**</ins> { [string](dataTypes#string) | [null](dataTypes#null) | [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 输入结果或结果 Promise

显示输入对话框.

- 非 UI 线程调用时, 阻塞并返回输入结果. 指定回调时也会将结果传给回调.
- UI 线程且未指定回调时, 返回兑现值为输入结果的 Promise.
- UI 线程指定回调时, 立即返回 `null`, 并将输入结果传给回调. `prefill` 位置也可直接传入回调.

```js
let name = rawInput('请输入您的名字', '小明');
alert(`您的名字是 ${name}`);
```

## [m] input

### input(title, prefill?, callback?)

- **title** { [string](dataTypes#string) } - 对话框标题
- **[ prefill = "" ]** { [string](dataTypes#string) } - 输入框初始内容
- **[ callback ]** { [Function](dataTypes#function) } - 结果回调, 接收求值结果
- <ins>**returns**</ins> { [any](dataTypes#any) | [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [null](dataTypes#null) } - 求值结果, 结果 Promise 或 `null`

与 [rawInput](#m-rawinput) 的交互方式相同, 但会在当前顶层作用域中对输入字符串执行 `eval` 并返回求值结果.

指定回调时, 回调参数是求值结果. 在非 UI 线程中指定回调时, 方法本身仍会阻塞, 且直接返回底层输入字符串; 应优先使用回调参数.

```js
let age = dialogs.input('请输入您的年龄', '18');
console.log(typeof age); // "number"
```

## [m] prompt

### prompt(title, prefill?, callback?)

**`Global`**

- **title** { [string](dataTypes#string) } - 对话框标题
- **[ prefill = "" ]** { [string](dataTypes#string) } - 输入框初始内容
- **[ callback ]** { [Function](dataTypes#function) } - 结果回调
- <ins>**returns**</ins> { [string](dataTypes#string) | [null](dataTypes#null) | [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) }

[rawInput](#m-rawinput) 的别名.

## [m] select

### select(title, items, callback?)

**`Overload 1/2`**

- **title** { [string](dataTypes#string) } - 对话框标题
- **items** { [string](dataTypes#string)[[]](dataTypes#array) } - 选项文本
- **[ callback ]** { [Function](dataTypes#function) } - 结果回调, 接收选中索引
- <ins>**returns**</ins> { [number](dataTypes#number) | [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [null](dataTypes#null) } - 选中索引, 结果 Promise 或 `null`

### select(title, ...items)

**`Overload 2/2`**

- **title** { [string](dataTypes#string) } - 对话框标题
- **...items** { [...](documentation#可变参数)[string](dataTypes#string)[[]](documentation#可变参数) } - 选项文本
- <ins>**returns**</ins> { [number](dataTypes#number) | [null](dataTypes#null) } - 选中索引或 `null`

显示列表选择对话框. 取消时返回 `-1`.

可变参数形式不支持回调或 Promise. 在 UI 线程调用时立即返回 `null`, 因此 UI 模式应使用数组形式.

数组形式支持以下执行方式:

- 非 UI 线程调用时, 阻塞并返回索引. 指定回调时也会将索引传给回调.
- UI 线程且未指定回调时, 返回兑现值为索引的 Promise.
- UI 线程指定回调时, 立即返回 `null`, 并将索引传给回调.

```js
let options = [ '选项 A', '选项 B', '选项 C' ];
let index = dialogs.select('请选择', options);
console.log(index >= 0 ? options[index] : '已取消');
```

## [m] singleChoice

### singleChoice(title, items, index?, callback?)

- **title** { [string](dataTypes#string) } - 对话框标题
- **items** { [string](dataTypes#string)[[]](dataTypes#array) } - 选项文本
- **[ index = 0 ]** { [number](dataTypes#number) } - 初始选中索引
- **[ callback ]** { [Function](dataTypes#function) } - 结果回调, 接收选中索引
- <ins>**returns**</ins> { [number](dataTypes#number) | [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [null](dataTypes#null) } - 选中索引, 结果 Promise 或 `null`

显示单选列表对话框. 取消时返回 `-1`. 同步, Promise 和回调模式与 [select](#m-select) 相同.

指定回调但省略 `index` 时, 需要在 `index` 位置传入 `null` 或 `undefined`.

## [m] multiChoice

### multiChoice(title, items, indices?, callback?)

**`[6.8.0]`**

- **title** { [string](dataTypes#string) } - 对话框标题
- **items** { [string](dataTypes#string)[[]](dataTypes#array) } - 选项文本数组
- **[ indices = [] ]** { [number](dataTypes#number)[[]](dataTypes#array) } - 初始选中的选项索引
- **[ callback ]** { [Function](dataTypes#function) } - 结果回调函数, 接收选中的索引数组
- <ins>**returns**</ins> { [number](dataTypes#number)[[]](dataTypes#array) | [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [null](dataTypes#null) } - 选中的索引数组, 结果 Promise 或 `null`

显示多选列表对话框.

- 非 UI 线程调用时, 阻塞并返回选中的索引数组. 指定回调时也会将数组传给回调.
- UI 线程且未指定回调函数时, 返回兑现值为索引数组的 Promise.
- UI 线程指定回调函数时, 立即返回 `null`, 回调函数接收索引数组.

自 AutoJs6 6.8.0 起, 同步结果, Promise 兑现值和回调参数均正确转换为 JavaScript 数组.

指定回调但省略 `indices` 时, 需要在 `indices` 位置传入 `null` 或 `undefined`.

## [m] build

### build(properties?)

**`[6.7.0]`**

- **[ properties ]** { [object](dataTypes#object) } - 对话框属性
- <ins>**returns**</ins> { org.autojs.autojs.core.ui.dialog.JsDialog } - 对话框对象

创建一个可自定义的对话框, 例如:

```js
dialogs.build({
    title: '发现新版本',
    content: '更新日志: 修复问题并改进体验',
    positive: '下载',
    negative: '取消',
    neutral: '在浏览器中查看',
    checkBoxPrompt: '不再提示',
}).on('positive', () => {
    toast('开始下载');
}).on('neutral', () => {
    app.openUrl('https://github.com/SuperMonster003/AutoJs6');
}).on('check', (checked) => {
    log(checked);
}).show();
```

常用属性:

- **title** { [string](dataTypes#string) } - 标题
- **titleColor** { [OmniColor](omniTypes#omnicolor) } - 标题颜色
- **content** { [string](dataTypes#string) } - 正文
- **contentColor** { [OmniColor](omniTypes#omnicolor) } - 正文颜色
- **contentLineSpacing** { [number](dataTypes#number) } - 正文行距倍数
- **icon** { [any](dataTypes#any) } - 图标
- **iconRes** { [number](dataTypes#number) } - 图标资源 ID
- **items** { [string](dataTypes#string)[[]](dataTypes#array) } - 列表项目
- **itemsColor** { [OmniColor](omniTypes#omnicolor) } - 列表文字颜色
- **[ itemsSelectMode = "select" ]** { [string](dataTypes#string) } - `select`, `single` 或 `multi`
- **[ itemsSelectedIndex = -1 ]** { [number](dataTypes#number) | [number](dataTypes#number)[[]](dataTypes#array) } - 预选索引
- **itemsSelectedIndices** { [number](dataTypes#number) | [number](dataTypes#number)[[]](dataTypes#array) } - 多选模式预选索引
- **positive** { [string](dataTypes#string) } - 确定按钮文字
- **negative** { [string](dataTypes#string) } - 否定按钮文字
- **neutral** { [string](dataTypes#string) } - 中立按钮文字
- **positiveColor** { [OmniColor](omniTypes#omnicolor) } - 确定按钮文字颜色
- **negativeColor** { [OmniColor](omniTypes#omnicolor) } - 否定按钮文字颜色
- **neutralColor** { [OmniColor](omniTypes#omnicolor) } - 中立按钮文字颜色
- **buttonRippleColor** { [OmniColor](omniTypes#omnicolor) } - 按钮波纹颜色
- **[ textAllCaps ]** { [boolean](dataTypes#boolean) } - 是否将全部按钮文字显示为大写. 省略时使用主题默认值
- **positiveTextAllCaps** { [boolean](dataTypes#boolean) } - 是否将确定按钮文字显示为大写
- **negativeTextAllCaps** { [boolean](dataTypes#boolean) } - 是否将否定按钮文字显示为大写
- **neutralTextAllCaps** { [boolean](dataTypes#boolean) } - 是否将中立按钮文字显示为大写
- **inputHint** { [string](dataTypes#string) } - 输入提示
- **inputPrefill** { [string](dataTypes#string) } - 输入框初始内容
- **inputSingleLine** { [boolean](dataTypes#boolean) } - 输入框是否限制为单行
- **checkBoxPrompt** { [string](dataTypes#string) } - 复选框文字
- **[ checkBoxChecked = false ]** { [boolean](dataTypes#boolean) } - 复选框是否选中
- **progress** {{ max?: [number](dataTypes#number); horizontal?: [boolean](dataTypes#boolean); showMinMax?: [boolean](dataTypes#boolean) }} - 进度条配置. `max: -1` 表示不确定进度
- **[ cancelable = true ]** { [boolean](dataTypes#boolean) } - 是否可取消
- **[ canceledOnTouchOutside = true ]** { [boolean](dataTypes#boolean) } - 点击外部区域时是否取消
- **[ autoDismiss = true ]** { [boolean](dataTypes#boolean) } - 点击操作按钮后是否自动关闭
- **[ stubborn = false ]** { [boolean](dataTypes#boolean) } - 同时将 `autoDismiss` 和 `canceledOnTouchOutside` 设为 `false`
- **[ theme ]** { [string](dataTypes#string) | com.afollestad.materialdialogs.Theme } - `light`, `dark` 或主题对象. 省略时使用系统主题
- **customView** { [string](dataTypes#string) | [android.view.View](https://developer.android.com/reference/android/view/View) } - XML 字符串, E4X XML 或视图
- **[ wrapInScrollView = true ]** { [boolean](dataTypes#boolean) } - 是否用滚动视图包装 `customView`
- **[ linkify = false ]** { [boolean](dataTypes#boolean) | [string](dataTypes#string) } - 正文链接识别. 字符串支持 `webUrls`, `emailAddresses`, `phoneNumbers`, `mapAddresses`, `all` 及其兼容别名
- **[ animation = false ]** { [boolean](dataTypes#boolean) | [string](dataTypes#string) } - 窗口动画. 字符串支持 `default`, `activity`, `dialog`, `inputMethod`, `toast` 和 `translucent`
- **dimAmount** { [number](dataTypes#number) } - 窗口外区域的遮罩强度. 大于 `1` 的值按百分数连续缩放
- **[ keepScreenOn = false ]** { [boolean](dataTypes#boolean) } - 显示期间是否保持屏幕常亮
- **onBackKey** { [boolean](dataTypes#boolean) | [string](dataTypes#string) | [Function](dataTypes#function) } - 返回键处理
- **onBackPressed** { [boolean](dataTypes#boolean) | [string](dataTypes#string) | [Function](dataTypes#function) } - `onBackKey` 的别名
- **[ preset = false ]** { [boolean](dataTypes#boolean) } - 补齐预设标题, 正文和三个操作按钮

省略 `properties` 时等同于 `{ preset: true }`. 显式传入 `{}` 时不应用预设.

除上述属性外, 属性名还可直接对应 `JsDialogBuilder` 或其父类 `MaterialDialog.Builder` 的公开单参数方法. 例如 `titleGravity`, `buttonsGravity`, `backgroundColorRes`, `positiveColorRes`, `negativeColorRes` 和 `neutralColorRes`. 方法名或参数类型无效时抛出异常.

通过这些选项可以自定义一个对话框, 并通过监听返回的 Dialog 对象的按键, 输入事件来实现交互. 下面是一些例子.

模拟 alert 对话框:

```js
dialogs.build({
    title: "你好",
    content: "今天也要元气满满哦",
    positive: "好的"
}).show();
```

模拟 confirm 对话框:

```js
dialogs.build({
    title: "你好",
    content: "请问你是笨蛋吗?",
    positive: "是的",
    negative: "我是大笨蛋"
}).on("positive", ()=>{
    alert("哈哈哈笨蛋");
}).on("negative", ()=>{
    alert("哈哈哈大笨蛋");
}).show();
```

模拟单选框:

```js
dialogs.build({
    title: "单选",
    items: ["选项 1", "选项 2", "选项 3", "选项 4"],
    itemsSelectMode: "single",
    itemsSelectedIndex: 3
}).on("single_choice", (index, item)=>{
    toast("您选择的是" + item);
}).show();
```

"处理中" 对话框:

```js
let d = dialogs.build({
    title: "下载中...",
    progress: {
        max: -1
    },
    cancelable: false
}).show();

setTimeout(()=>{
    d.dismiss();
}, 3000);
```

输入对话框:

```js
dialogs.build({
    title: "请输入您的年龄",
    inputPrefill: "18"
}).on("input", (input)=>{
    let age = parseInt(input);
    toastLog(age);
}).show();
```

使用这个函数来构造对话框, 一个明显的不同是需要使用回调函数而不能像 dialogs 其他函数一样同步地返回结果; 但也可以通过 threads 模块的方法来实现. 例如显示一个输入框并获取输入结果为:

```js
let input = threads.disposable();
dialogs.build({
    title: "请输入您的年龄",
    inputPrefill: "18"
}).on("input", text => {
    input.setAndNotify(text);
}).show();
let age = parseInt(input.blockedGet());
toastLog(age);
```

## [m] selectFile

### selectFile(title, prefill, callback)

- **title** { [string](dataTypes#string) } - 对话框标题
- **prefill** { [string](dataTypes#string) | [null](dataTypes#null) } - 输入框初始内容
- **callback** { [Function](dataTypes#function) | [null](dataTypes#null) } - 结果回调, 接收输入字符串或 `null`
- <ins>**returns**</ins> { [string](dataTypes#string) | [null](dataTypes#null) } - 非 UI 线程的输入结果, 或 `null`

显示文本输入对话框. 当前实现不会打开文件选择器, 行为与底层 `dialogs.rawInput` 相同, 但不提供 UI 线程 Promise 适配.

- 非 UI 线程调用时阻塞并返回输入结果.
- UI 线程调用时立即返回 `null`.
- 指定回调时, 用户提交或取消对话框后调用回调.

## [m] newBuilder

### newBuilder()

- <ins>**returns**</ins> { org.autojs.autojs.core.ui.dialog.JsDialogBuilder } - 原生对话框构建器

创建使用浅色主题的底层 `JsDialogBuilder`. 此方法不应用 [dialogs.build](#m-build) 的属性名称转换, 默认预设或 UI 线程包装. 常规脚本应优先使用 `dialogs.build(properties?)`.

# Dialog

`dialogs.build()` 返回的对话框对象, 内置一些事件用于响应用户的交互, 也可以获取对话框的状态和信息.

## 事件: `show`

- **dialog** {Dialog} 对话框

对话框显示时会触发的事件. 例如:

```
dialogs.build({
    title: "标题"
}).on("show", (dialog)=>{
    toast("对话框显示了");
}).show();
```

## 事件: `cancel`

- **dialog** {Dialog} 对话框

对话框被取消时会触发的事件. 一个对话框可能按取消按钮, 返回键取消或者点击对话框以外区域取消. 例如:

```
dialogs.build({
    title: "标题",
    positive: "确定",
    negative: "取消"
}).on("cancel", (dialog)=>{
    toast("对话框取消了");
}).show();
```

## 事件: `dismiss`

- **dialog** {Dialog} 对话框

对话框消失时会触发的事件. 对话框被取消或者手动调用 `dialog.dismiss()` 函数都会触发该事件. 例如:

```
let d = dialogs.build({
    title: "标题",
    positive: "确定",
    negative: "取消"
}).on("dismiss", (dialog)=>{
    toast("对话框消失了");
}).show();

setTimeout(()=>{
    d.dismiss();
}, 5000);
```

## 事件: `positive`

- **dialog** {Dialog} 对话框

确定按钮按下时触发的事件. 例如:

```
let d = dialogs.build({
    title: "标题",
    positive: "确定",
    negative: "取消"
}).on("positive", (dialog)=>{
    toast("你点击了确定");
}).show();
```

## 事件: `negative`

- **dialog** {Dialog} 对话框

取消按钮按下时触发的事件. 例如:

```
let d = dialogs.build({
    title: "标题",
    positive: "确定",
    negative: "取消"
}).on("negative", (dialog)=>{
    toast("你点击了取消");
}).show();
```

## 事件: `neutral`

- **dialog** {Dialog} 对话框

中性按钮按下时触发的事件. 例如:

```
let d = dialogs.build({
    title: "标题",
    positive: "确定",
    negative: "取消",
    neutral: "稍后提示"
}).on("positive", (dialog)=>{
    toast("你点击了稍后提示");
}).show();
```

## 事件: `any`

- **dialog** {Dialog} 对话框
- **action** { [string](dataTypes#string) } 被点击的按钮, 可能的值为:
    * `positive` 确定按钮
    * `negative` 取消按钮
    * `neutral` 中性按钮

任意按钮按下时触发的事件. 例如:

```
let d = dialogs.build({
    title: "标题",
    positive: "确定",
    negative: "取消",
    neutral: "稍后提示"
}).on("any", (action, dialog)=>{
    if(action == "positive"){
        toast("你点击了确定");
    }else if(action == "negative"){
        toast("你点击了取消");
    }
}).show();
```

## 事件: `item_select`

- **index** { [number](dataTypes#number) } - 选中索引
- **item** { [string](dataTypes#string) } - 选项文本
- **dialog** { org.autojs.autojs.core.ui.dialog.JsDialog } - 对话框

`itemsSelectMode` 为 `"select"` 或省略时, 点击项目后触发.

```js
dialogs.build({
    title: '请选择',
    items: [ 'A', 'B', 'C', 'D' ],
    itemsSelectMode: 'select',
}).on('item_select', (index, item) => {
    toast(`第 ${index + 1} 项: ${item}`);
}).show();
```

## 事件: `single_choice`

- **index** { [number](dataTypes#number) } - 选中索引
- **item** { [string](dataTypes#string) } - 选项文本
- **dialog** { org.autojs.autojs.core.ui.dialog.JsDialog } - 对话框

`itemsSelectMode` 为 `"single"` 时, 选中项目后触发.

```js
dialogs.build({
    title: '请选择',
    positive: '确定',
    items: [ 'A', 'B', 'C', 'D' ],
    itemsSelectMode: 'single',
}).on('single_choice', (index, item) => {
    toast(`第 ${index + 1} 项: ${item}`);
}).show();
```

## 事件: `multi_choice`

- **indices** { [number](dataTypes#number)[[]](dataTypes#array) } - 选中索引
- **items** { [string](dataTypes#string)[[]](dataTypes#array) } - 选项文本
- **dialog** { org.autojs.autojs.core.ui.dialog.JsDialog } - 对话框

`itemsSelectMode` 为 `"multi"` 时, 选择状态变化后触发.

```js
dialogs.build({
    title: '请选择',
    positive: '确定',
    items: [ 'A', 'B', 'C', 'D' ],
    itemsSelectMode: 'multi',
}).on('multi_choice', (indices, items) => {
    console.log(indices, items);
}).show();
```

## 事件: `input`

- **text** { [string](dataTypes#string) } - 输入框内容

带有输入框的对话框点击确定按钮时触发.

```js
dialogs.build({
    title: '请输入',
    positive: '确定',
    negative: '取消',
    inputPrefill: '',
}).on('input', (text) => {
    toast(`你输入的是 ${text}`);
}).show();
```

## 事件: `input_change`

- **dialog** { org.autojs.autojs.core.ui.dialog.JsDialog } - 对话框
- **text** { [string](dataTypes#string) } - 输入框内容

输入框内容变化时触发.

```js
dialogs.build({
    title: '请输入',
    positive: '确定',
    negative: '取消',
    inputPrefill: '',
}).on('input_change', (dialog, text) => {
    console.log(text);
}).show();
```

## 事件: `check`

- **checked** { [boolean](dataTypes#boolean) } - 复选框是否选中
- **dialog** { org.autojs.autojs.core.ui.dialog.JsDialog } - 对话框

设置 `checkBoxPrompt` 或 `checkBoxChecked` 后, 复选框状态变化时触发.

## dialog.getProgress()

- <ins>**returns**</ins> { [number](dataTypes#number) }

获取当前进度条的进度值, 是一个整数

## dialog.getMaxProgress()

- <ins>**returns**</ins> { [number](dataTypes#number) }

获取当前进度条的最大进度值, 是一个整数

## dialog.getActionButton(action)

- **action** { [string](dataTypes#string) } 动作, 包括:
    * `positive`
    * `negative`
    * `neutral`
