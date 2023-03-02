# 插件 (Plugins)

在 AutoJs6 中, 插件分为 [ 应用插件 / 项目插件 / 内置扩展插件 ].

plugins 模块主要用于插件及扩展模块的加载并使其功能生效.

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

截至 2023 年 2 月, AutoJs6 内置了以下扩展插件:

* [Arrayx - Array 扩展](arrayx)
* [Numberx - Number 扩展](numberx)
* [Mathx - Math 扩展](mathx)

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

## [m] extend

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