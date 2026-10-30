# 插件 (Plugins)

<!-- runtime-support:begin plugins -->
<!-- 本段由 generator/runtime-support.js 根据 AutoJs6 运行时覆盖矩阵生成, 不要手动修改; 数据源 ksp -->

| 运行时支持 | Rhino | Node.js 主线程 | Node.js Worker | Bun |
| --- | --- | --- | --- | --- |
| 入口 | `plugins`, `plugins.tools` | `plugins` | `plugins` | `host.plugins` |
| 状态 | 已支持 8 项 | 已支持 (本地实现) 8 项 | 已支持 (本地实现) 7 项, 不适用 1 项 | 已支持 (本地实现) 3 项, 需授权 4 项, 不适用 1 项 |
| 授权 | - | - | - | `plugintools.control` 4 项 |

差异项 (8 项): 下表列出入口, 状态或授权与同列多数 API 不同的 API, 未列出的 API 与同列多数一致.

| API | Node.js 主线程 | Node.js Worker | Bun |
| --- | --- | --- | --- |
| `plugins.extend` | <span title="local-shim">已支持 (本地实现)</span> | <span title="local-shim">已支持 (本地实现)</span> | <span title="local-shim">已支持 (本地实现)</span> |
| `plugins.extendAll` | <span title="local-shim">已支持 (本地实现)</span> | <span title="local-shim">已支持 (本地实现)</span> | <span title="local-shim">已支持 (本地实现)</span> |
| `plugins.extendAllBut` | <span title="local-shim">已支持 (本地实现)</span> | <span title="local-shim">已支持 (本地实现)</span> | <span title="local-shim">已支持 (本地实现)</span> |
| `plugins.load` | <span title="local-shim">已支持 (本地实现)</span> | <span title="not-portable: rhino-only">不适用</span> (仅限 Rhino 引擎) | <span title="not-portable: rhino-only">不适用</span> (仅限 Rhino 引擎) |
| `plugins.tools.call` | <span title="local-shim">已支持 (本地实现)</span>: `tools.call` (`plugins`) | <span title="local-shim">已支持 (本地实现)</span>: `tools.call` (`plugins`) | <span title="capability-gated">需授权</span> `plugintools.control`: `host.plugins.tools.call` |
| `plugins.tools.callAsync` | <span title="local-shim">已支持 (本地实现)</span>: `tools.callAsync` (`plugins`) | <span title="local-shim">已支持 (本地实现)</span>: `tools.callAsync` (`plugins`) | <span title="capability-gated">需授权</span> `plugintools.control`: `host.plugins.tools.callAsync` |
| `plugins.tools.list` | <span title="local-shim">已支持 (本地实现)</span>: `tools.list` (`plugins`) | <span title="local-shim">已支持 (本地实现)</span>: `tools.list` (`plugins`) | <span title="capability-gated">需授权</span> `plugintools.control`: `host.plugins.tools.list` |
| `plugins.tools.providers` | <span title="local-shim">已支持 (本地实现)</span>: `tools.providers` (`plugins`) | <span title="local-shim">已支持 (本地实现)</span>: `tools.providers` (`plugins`) | <span title="capability-gated">需授权</span> `plugintools.control`: `host.plugins.tools.providers` |

Node.js 与 Bun 的导入方式, 异步返回值与授权检查见 [运行时 API](runtimeApis#执行方式).

<!-- runtime-support:end -->

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

### 提供脚本模块的插件

从 AutoJs6 6.8.0 起, 部分脚本模块由外置的官方应用插件提供. 这些插件不通过 plugins.load 加载: 在插件中心安装并启用兼容的插件后, 对应的全局模块即可使用; 插件缺失或不可用时, 模块方法抛出相应的插件错误, 具体条件见各模块文档.

| 模块 | 提供功能的插件 |
| --- | --- |
| [AI - 人工智能](ai) | 3-Stone AI (文本生成与会话), 3-Stove Agent (`ai.agent`) |
| [Barcode - 条码](barcode), [QR Code - 二维码](qrcode) | ML Kit Barcode |
| [3-Block Compose](compose) | 3-Block Compose |
| `require` 加载的 axios, cheerio, dayjs, i18n, pangu, lodash 与 Node.js 兼容模块, 见 [Bundled Libraries - 脚本库](bundledLibraries) | Bundled Libraries |
| [EPUB - 电子书](epub) | Readium EPUB Reader |
| [Files - 文件](files#m-batchrename) 的 files.batchRename | Batch Rename |
| [Gallery - 相册](gallery) | 3-Maple Image |
| [Installer - 安装器](installer) | 3-Setup Installer |
| [Mail - 邮件](mail) | Angus Mail |
| [OCR - 光学字符识别](ocr) | OCR 插件 |
| [OpenCC - 中文转换](opencc) | OpenCC 插件 |
| [Pinyin - 拼音](pinyin) | Pinyin 插件 |
| [Speech - 语音](speech) | 3-Macaw Speech |
| [Terminal - 终端](terminal) | 3-Shell Terminal |
| [YOLO - 目标检测](yolo) | YOLO Provider 插件 |

Bundled Libraries 插件不可用时, `require` 上述名称或读取 axios 等全局对象抛出代码为 `MODULE_NOT_FOUND` 的错误, 错误消息说明如何安装或开启.

[AutoJs4 Runtime](autojs4Runtime) 插件不提供脚本模块, 它为文件管理器增加 "使用 AutoJs4 运行" 入口.

语言运行时插件让 AutoJs6 运行其他语言的脚本文件, 它们给脚本的 API 见各自页面: [Python 运行时](pythonRuntime) (`.py`, `autojs6` 包), [Java 运行时](javaRuntime) (`.java`) 与 [Kotlin 运行时](kotlinRuntime) (`.kt`, JVM Entry API), [Lua 运行时](luaRuntime) (`.lua`, `autojs` 模块).

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
- 图片参数接受 `"screen"` (当前屏幕), 文件路径或 [ImageWrapper](imageWrapperType) 对象; 文件参数接受文件路径; 目录参数接受目录路径, AutoJs6 把目录中的文件交给插件 (例如 YOLO 模型目录中的 model.json, model.ncnn.param 与 model.ncnn.bin). 路径按 [files.path](files#m-path) 解析. 使用 `"screen"` 时, Android 11 及以上且无障碍服务运行中使用无障碍截图, 否则需先调用 [images.requestScreenCapture](image#m-images-requestscreencapture-options).
- 工具产生的文件 (如图片) 写入调用时 `outputs` 选项指定的路径.
- 脚本可调用所有已在插件中心授权并启用的插件的工具, 包括用户授权 (非官方) 的插件.

```js
let tools = plugins.tools.list();
tools.forEach(t => console.log(t.name, '-', t.description));

let answer = plugins.tools.call('opencc_convert', { text: '汉字', config: 's2t' });
console.log(answer.result);
```

### 官方插件工具表

下表列出官方插件提供的工具. 插件会随版本增减工具, 设备上实际可用的工具以 [plugins.tools.list](#m-toolslist) 的返回为准; 参数的取值范围, 长度上限与英文说明见返回对象的 `inputSchema`, 结果字段的类型见 `outputSchema`.

- 最低插件版本: 首个提供该工具的插件版本.
- 参数: 名称 (类型, 必填或默认值). 未标 "必填" 的参数可以省略, 标有默认值的参数省略时由 AutoJs6 填入该值. "图片", "文件" 与 "目录" 参数的写法见上文.
- 输出: 调用结果中 `result` 的字段 (`[]` 表示数组), 以及工具可产生的文件或目录输出; 输出路径用 [plugins.tools.call](#m-toolscall) 的 `outputs` 选项指定.
- 部分工具还需要模型或权限, 例如 YOLO 模型目录, 3-Macaw Speech 的语音模型与麦克风权限; 缺少时调用抛出含原因的异常.

| 工具 | 说明 | 提供插件 | 最低插件版本 | 参数 | 输出 |
| --- | --- | --- | --- | --- | --- |
| `opencc_convert` | 简体, 繁体, 港台标准与日文新字体之间转换汉字字形 (OpenCC), 不翻译 | 3-Hanzi CC | 2.1.0 | `text` (string, 必填); `config` (string, 默认 `"s2t"`) | `{ text, config }` |
| `yolo_detect` | 用 YOLO11 NCNN 模型在图片或屏幕中检测目标, 结果按置信度从高到低 | AutoJs6 YOLO NCNN | 0.2.0 | `image` (图片, 必填); `model` (目录, 必填); `confidence` (number, 默认 `0.25`); `iouThreshold` (number, 默认 `0.45`); `maxDetections` (integer, 默认 `100`); `labels` (string[]) | `{ image, count, detections[], model, inferenceMs }` |
| `imagequant_quantize` | 把图片量化为至多 256 色的调色板 PNG (libimagequant) | Image Quantization | 1.1.0 | `image` (图片, 必填); `quality` (integer, 省略时为 100); `minQuality` (integer); `maxQuality` (integer); `maxColors` (integer, 默认 `256`); `speed` (integer, 默认 `8`); `ditheringLevel` (number, 默认 `0.0`); `posterizeBits` (integer, 默认 `0`); `preserveAlpha` (boolean, 默认 `true`) | `{ width, height, bytes, quality, quantizationError, peakWorkingMemoryBytes }`; 文件输出 `png` (PNG) |
| `archive_list` | 分页列出压缩包的条目 | 3-Stack Archive | 3.1.0 | `archive` (文件, 必填); `directory` (string); `offset` (integer, 默认 `0`); `limit` (integer, 默认 `200`); `password` (string) | `{ format, total, offset, truncated, totalUncompressedBytes, entries[] }` |
| `archive_read` | 不解压读取压缩包内一个文件的文本 (UTF-8, 至多 64 KiB) | 3-Stack Archive | 3.1.0 | `archive` (文件, 必填); `path` (string, 必填); `maxBytes` (integer, 默认 `65536`); `password` (string) | `{ path, size, bytesRead, truncated, binary, text }` |
| `archive_extract` | 把压缩包的全部或指定条目解压到目录 | 3-Stack Archive | 3.1.0 | `archive` (文件, 必填); `paths` (string[]); `password` (string) | `{ format, filesExtracted, directoriesCreated, bytesWritten, kept, keptPaths[], skipped }`; 目录输出 `files` |
| `speech_listen` | 用麦克风听写一句话并离线识别 | 3-Macaw Speech | 1.2.0 | `language` (string); `silenceMillis` (integer, 默认 `1200`); `noSpeechSeconds` (integer, 默认 `8`); `maxSeconds` (integer, 默认 `30`); `hotwords` (string[]); `prompt` (string) | `{ text, language, modelId, durationMillis, endReason, warnings[] }` |
| `speech_speak` | 朗读文本 (插件引擎或系统默认 TTS 引擎) | 3-Macaw Speech | 1.2.0 | `text` (string, 必填); `language` (string); `voice` (string); `speed` (number, 默认 `1.0`); `wait` (boolean, 默认 `true`) | `{ engine, enginePackage, language, voice, completed, durationMillis, warnings[] }` |
| `speech_transcribe` | 离线转写音频文件, 带时间分段 | 3-Macaw Speech | 1.2.0 | `file` (文件, 必填); `language` (string); `model` (string) | `{ text, segments[], language, modelId, durationMillis, warnings[] }` |
| `speech_synthesize` | 把文本离线合成为 WAV 或 M4A 音频文件 | 3-Macaw Speech | 1.2.0 | `text` (string, 必填); `language` (string); `voice` (string); `speed` (number, 默认 `1.0`); `format` (string, `"wav"` 或 `"m4a"`, 默认 `"wav"`) | `{ format, mimeType, modelId, voice, sampleRate, durationMillis, bytes, warnings[] }`; 文件输出 `audio` (WAV 或 M4A) |
| `speech_speaker_verify` | 核对音频中的说话人是否为指定的已登记说话人 | 3-Macaw Speech | 1.3.0 | `file` (文件, 必填); `name` (string, 必填); `threshold` (number) | `{ name, score, matched, threshold, modelId, warnings[] }` |
| `speech_speaker_identify` | 在已登记的说话人中找出与音频最接近的候选 | 3-Macaw Speech | 1.3.0 | `file` (文件, 必填); `threshold` (number); `topK` (integer, 默认 `3`) | `{ name, score, matched, threshold, modelId, candidates[], warnings[] }` |
| `speech_diarize` | 说话人分离: 把音频按说话人切分为轮次 | 3-Macaw Speech | 1.3.0 | `file` (文件, 必填); `speakers` (integer, 默认 `0`); `threshold` (number); `identify` (boolean, 默认 `false`) | `{ segments[], speakers, durationMillis, modelId, speakerModelId, names[], warnings[] }` |
| `speech_detect_language` | 识别音频中所说的语种 (Whisper, 99 种语言) | 3-Macaw Speech | 1.3.0 | `file` (文件, 必填); `windows` (integer, 默认 `3`) | `{ language, candidates[], segments[], durationMillis, modelId, warnings[] }` |
| `speech_tag` | 识别音频中的声音类别 (AudioSet 527 类) | 3-Macaw Speech | 1.3.0 | `file` (文件, 必填); `topK` (integer, 默认 `5`) | `{ labels[], durationMillis, modelId, warnings[] }` |

```js
/* 把繁体字形转为简体. */
let answer = plugins.tools.call('opencc_convert', { text: '漢字轉換', config: 't2s' });
console.log(answer.result.text); // 汉字转换

/* 把压缩包解压到 out/demo 文件夹, 文件夹中已有的文件保留不动. */
let extracted = plugins.tools.call('archive_extract', { archive: 'demo.zip' }, {
    outputs: { files: 'out/demo' },
});
console.log(extracted.result.filesExtracted, extracted.result.kept);
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
- **outputs** { [Object](dataTypes#object)[[]](dataTypes#array) } - 工具可产生的输出, 每项包含 `name`, `kind` (`file` 为文件, `directory` 为目录, 例如解压结果) 与 `mimeType` (目录为 `inode/directory`)
- **imageParameters** / **fileParameters** / **directoryParameters** { [string](dataTypes#string)[[]](dataTypes#array) } - 图片参数, 文件参数与目录参数的名称
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
  - **[ outputs ]** { [Object](dataTypes#object) } - 以工具声明的输出名称为键, 以写入路径为值; 目录输出的值是文件夹路径, 文件夹可以已存在, 其中已有的文件默认保留
  - **[ overwrite = false ]** { [boolean](dataTypes#boolean) } - 输出路径已存在文件时是否覆盖; 对目录输出则决定是否覆盖文件夹中的同名文件
- <ins>**returns**</ins> { [Object](dataTypes#object) }

调用一个 [插件工具](#插件工具) 并等待结果. 返回对象包含:

- **result** { [any](dataTypes#any) } - 工具返回的结果
- **text** { [string](dataTypes#string) } - 结果的简短文字说明 (可能不存在)
- **outputs** { [Object](dataTypes#object)[[]](dataTypes#array) } - 已写入的输出, 每项包含 `name`, `path`, `bytes` 与 `mimeType`; 目录输出另含 `kind` (`directory`), `files` (写入的文件数), 以及有文件保留未动时的 `conflicts` (至多 20 个路径) 与 `conflictCount`
- **tool** / **provider** / **invocationId** / **durationMs** - 工具名称, 插件包名, 调用标识与耗时 (毫秒)

参数不符合格式, 工具不存在, 插件报告错误或超过时限时抛出异常, 异常消息包含原因. 同步形态阻塞当前脚本线程直至完成, 停止脚本会取消调用.

```js
/* 调用工具并把产生的图片写入工作目录. */
let answer = plugins.tools.call('imagequant_quantize', { image: 'photo.png', maxColors: 16 }, {
    outputs: { png: 'out/photo-16.png' },
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
