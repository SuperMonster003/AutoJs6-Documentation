# 插件 (Plugins)

在 AutoJs6 中, 插件分为 [ 应用插件 / 项目插件 / 内置扩展插件 ].

plugins 模块主要用于插件及扩展模块的加载并使其功能生效. [plugins.tools](#插件工具) 用于调用 AutoJs6 插件自描述的工具.

## 应用插件

应用插件通常是一个由开发者编写的可安装的 APK 文件, 安装插件后可由 AutoJs6 通过 [plugins.load](#m-load) 方法加载并使用插件.

应用插件的使用步骤:

- 按需寻找或自行开发插件 (APK 格式)
- 安装到指定设备
- 脚本中将插件包名以字符串形式传入 plugins.load 方法并赋值给一个变量
- 这个变量即指向插件的导出对象 (module.exports)

加载及使用方式:

```js
let { exp } = plugins.load('org.autojs.autojs.plugin.demo');
exp.test('hello');
```

## 项目插件

项目插件是依附于项目的一组 JavaScript 模块, 它们位于项目根目录的 `plugins` 文件夹中, 由 AutoJs6 通过 [plugins.load](#m-load) 方法加载并使用.

例如项目结构 (部分) 如下:

```text
┌ modules ┬ moduleA.js
│         └ moduleB.js
│         ┌ pluginA.js
├ plugins ┼ pluginB.js
│         └ pluginC.js
└ main.js
```

对于此项目, `pluginA.js`, `pluginB.js` 及 `pluginC.js` 均称为项目插件, 加载方式如下:

```js
plugins.load('pluginA');
plugins.load('pluginA.js'); /* 同上. */
```

## 内置扩展插件

内置扩展插件相当于内置的项目插件, 它们是内置于 AutoJs6 软件中的, 可通过调用 [plugins.extend](#m-extend) 等方法选择性地启用部分或全部内置扩展插件, 也称作内置扩展模块.

加载方式:

```js
/* 启用 Array 内置扩展插件. */
plugins.extend('Arrayx');

/* 启用全部内置扩展插件. */
plugins.extendAll();
```

AutoJs6 预置以下 JavaScript 内置对象扩展模块:

- [Arrayx - Array 扩展](arrayx)
- [Numberx - Number 扩展](numberx)
- [Mathx - Math 扩展](mathx)

## 插件工具

部分 AutoJs6 插件会声明自己提供的工具 (名称, 说明, 参数格式与风险等级), 例如中文转换或目标检测. AutoJs6 汇总这些工具, 脚本通过 [plugins.tools.list](#m-toolslist) 查看, 通过 [plugins.tools.call](#m-toolscall) 调用; MCP Server 等插件也经同一途径使用它们.

- 工具名称为 `<插件短名>_<工具名>`, 例如 `opencc_convert`.
- 参数须符合工具声明的参数格式 (JSON Schema 的一个子集). AutoJs6 在调用前校验, 并为缺省的参数填入声明的默认值.
- 图片参数接受 `"screen"` (当前屏幕), 文件路径或 [ImageWrapper](imageWrapperType) 对象; 文件参数接受文件路径. 路径按 [files.path](files#m-path) 解析. 使用 `"screen"` 时, Android 11 及以上且无障碍服务运行中使用无障碍截图, 否则需先调用 [images.requestScreenCapture](image#m-images-requestscreencapture-options).
- 工具产生的文件 (如图片) 写入调用时 `outputs` 选项指定的路径.
- 脚本可调用所有已在插件中心授权并启用的插件的工具, 包括用户授权 (非官方) 的插件.

```js
let tools = plugins.tools.list();
tools.forEach(t => console.log(t.name, '-', t.description));

let answer = plugins.tools.call('opencc_convert', { text: '汉字', config: 's2t' });
console.log(answer.result);
```

---

<p style="font: bold 2em sans-serif; color: #FF7043">plugins</p>

---

## [m] load

### load(appPluginPackageName)

**`[6.2.0]`** **`Overload 1/2`**

- **packageName** { [string](dataTypes#string) } - 应用插件的包名
- <ins>**returns**</ins> { [any](dataTypes#any) }

加载 [应用插件](#应用插件).

```js
/* 一个可能的样例. */
plugins.load('org.autojs.autojs.plugin.demo');
```

### load(projectPluginName)

**`6.2.0`** **`Overload 2/2`**

- **packageName** { [string](dataTypes#string) } - 项目插件名称
- <ins>**returns**</ins> { [any](dataTypes#any) }

加载 [项目插件](#项目插件).

## [m+] extend

### extend(...moduleNames)

**`6.2.0`**

- **moduleNames** { [...](documentation#可变参数)[ExtendModulesNames](dataTypes#extendmodulesnames)[[]](documentation#可变参数) } - 内置扩展插件名称
- <ins>**returns**</ins> { [void](dataTypes#void) }

加载指定的 [内置扩展插件](#内置扩展插件).

```js
/* 启用 Array 内置扩展插件. */
plugins.extend('Arrayx');

/* 启用 Array 和 Number 内置扩展插件. */
plugins.extend('Arrayx', 'Numberx');
```

## [m] extend.exclude

### extend.exclude(...moduleNames)

**`6.8.0`**

- **...moduleNames** { [...](documentation#可变参数)[ExtendModulesNames](dataTypes#extendmodulesnames)[[]](documentation#可变参数) } - 要从批量加载中排除的扩展模块名称
- <ins>**returns**</ins> { [void](dataTypes#void) }

将模块加入排除集合. 排除集合会影响后续 [plugins.extendAll](#m-extendall) 和 [plugins.extendAllBut](#m-extendallbut), 但不阻止通过 [plugins.extend](#m-extend) 显式加载模块.

```js
plugins.extend.exclude("Mathx");
plugins.extendAll();
```

## [m] extend.registerModule

### extend.registerModule(module)

**`6.8.0`**

- **module** { [Object](dataTypes#object) } - 以扩展模块名称为键, 以扩展实现为值的对象
- <ins>**returns**</ins> { [void](dataTypes#void) }

向当前脚本的扩展注册表添加自定义模块. 对象的每个属性值必须提供可调用的 `extendJsBuildInObjects()` 方法. 注册不会立即加载模块, 可在注册后使用 [plugins.extend](#m-extend) 或 [plugins.extendAll](#m-extendall) 加载.

## [m] extendAll

### extendAll()

**`6.2.0`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

加载所有的 [内置扩展插件](#内置扩展插件).

```js
plugins.extendAll();
```

如需在所有脚本均自动加载所有内置扩展插件, 而无需每次使用 `plugins.extendAll()`, 可对 AutoJs6 进行如下设置:

```text
AutoJs6 应用设置 - 扩展性 - JavaScript 内置对象扩展 - [ 启用 ]
```

## [m] extendAllBut

### extendAllBut(...moduleNames)

**`6.2.0`**

- **moduleNames** { [...](documentation#可变参数)[ExtendModulesNames](dataTypes#extendmodulesnames)[[]](documentation#可变参数) } - 内置扩展插件名称
- <ins>**returns**</ins> { [void](dataTypes#void) }

加载所有的 [内置扩展插件](#内置扩展插件), 但排除指定的插件.

```js
plugins.extendAllBut('Mathx'); /* 加载除 Math 外的全部内置扩展插件. */
```


## [m] tools.list

### tools.list()

**`6.8.0`**

- <ins>**returns**</ins> { [Object](dataTypes#object)[[]](dataTypes#array) }

返回当前可用的 [插件工具](#插件工具). 每个元素包含:

- **name** { [string](dataTypes#string) } - 工具名称 (`<插件短名>_<工具名>`)
- **description** { [string](dataTypes#string) } - 工具说明 (英文, 由插件作者撰写)
- **inputSchema** { [Object](dataTypes#object) } - 参数格式
- **outputSchema** { [Object](dataTypes#object) } - 结果格式 (可能不存在)
- **risk** { [string](dataTypes#string) } - 风险等级: `readonly`, `write`, `destructive` 或 `network`
- **timeoutMs** { [number](dataTypes#number) } - 单次调用的时限 (毫秒)
- **outputs** { [Object](dataTypes#object)[[]](dataTypes#array) } - 工具可产生的文件, 每项包含 `name` 与 `mimeType`
- **imageParameters** / **fileParameters** { [string](dataTypes#string)[[]](dataTypes#array) } - 图片参数与文件参数的名称
- **provider** { [string](dataTypes#string) } - 提供工具的插件包名
- **trust** { [string](dataTypes#string) } - 插件的信任级别: `official`, `trusted` 或 `user_granted`

```js
plugins.tools.list().forEach(t => console.log(t.name, t.risk));
```

## [m] tools.providers

### tools.providers()

**`6.8.0`**

- <ins>**returns**</ins> { [Object](dataTypes#object)[[]](dataTypes#array) }

返回所有声明了工具的插件及其状态, 用于查明某个工具为何不可用. 每个元素包含 `packageName`, `trust`, `status` (`available`, `disabled`, `unauthorized`, `incompatible`, `failed` 或 `refused`), `shortName`, `tools` (工具数量), `detail` (不可用的原因) 与 `diagnostics` (被剔除的工具及原因).

## [m] tools.call

### tools.call(name, args?, options?)

**`6.8.0`**

- **name** { [string](dataTypes#string) } - 工具名称
- **[ args = {} ]** { [Object](dataTypes#object) } - 工具参数
- **[ options ]** { [Object](dataTypes#object) } - 调用选项
  - **[ timeoutMs ]** { [number](dataTypes#number) } - 时限 (毫秒), 只能比工具声明的时限更短
  - **[ outputs ]** { [Object](dataTypes#object) } - 以工具声明的文件名称为键, 以写入路径为值
  - **[ overwrite = false ]** { [boolean](dataTypes#boolean) } - 输出路径已存在文件时是否覆盖
- <ins>**returns**</ins> { [Object](dataTypes#object) }

调用一个 [插件工具](#插件工具) 并等待结果. 返回对象包含:

- **result** { [any](dataTypes#any) } - 工具返回的结果
- **text** { [string](dataTypes#string) } - 结果的简短文字说明 (可能不存在)
- **outputs** { [Object](dataTypes#object)[[]](dataTypes#array) } - 已写入的文件, 每项包含 `name`, `path`, `bytes` 与 `mimeType`
- **tool** / **provider** / **invocationId** / **durationMs** - 工具名称, 插件包名, 调用标识与耗时 (毫秒)

参数不符合格式, 工具不存在, 插件报告错误或超过时限时抛出异常, 异常消息包含原因. 同步形态阻塞当前脚本线程直至完成, 停止脚本会取消调用.

```js
/* 调用工具并把产生的图片写入工作目录. */
let answer = plugins.tools.call('imagequant_quantize', { image: 'photo.png', colors: 16 }, {
    outputs: { image: 'out/photo-16.png' },
});
console.log(answer.outputs[0].path);
```

## [m] tools.callAsync

### tools.callAsync(name, args?, options?)

**`6.8.0`**

- **name** { [string](dataTypes#string) } - 工具名称
- **[ args = {} ]** { [Object](dataTypes#object) } - 工具参数
- **[ options ]** { [Object](dataTypes#object) } - 调用选项, 同 [plugins.tools.call](#m-toolscall)
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](dataTypes#object)&gt; }

[plugins.tools.call](#m-toolscall) 的异步形态, 立即返回 Promise, 结果在脚本线程送达; 失败时 Promise 以包含原因的错误拒绝.

```js
plugins.tools.callAsync('opencc_convert', { text: '汉字' })
    .then(answer => console.log(answer.result))
    .catch(e => console.error(e.message));
```
