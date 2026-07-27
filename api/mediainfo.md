# 媒体信息 (MediaInfo)

mediainfo 模块用于读取媒体文件的容器, 视频, 音频, 字幕和其他流信息.

此模块自 AutoJs6 6.7.0 起提供. `mediainfo` 与 `$mediainfo` 指向同一个可调用模块对象.

自 AutoJs6 6.8.0 起, 媒体信息读取由外置 MediaInfo 插件提供. 调用前, 必须安装并启用与当前 AutoJs6 版本兼容的 MediaInfo 插件. 未发现可用插件引擎时, 调用将抛出异常.

目标路径必须指向一个已存在的文件. 相对路径按当前脚本工作目录解析.

---

<p style="font: bold 2em sans-serif; color: #FF7043">mediainfo</p>

---

## [@] mediainfo

### mediainfo(path)

**`6.7.0`** **`[6.8.0]`**

- **path** { [string](dataTypes#string) } - 媒体文件路径
- <ins>**returns**</ins> { [MediainfoResult](#mediainforesult) } - 媒体信息对象

读取媒体文件信息.

此调用与 [mediainfo.read(path)](#m-read) 等价.

```js
let info = mediainfo('./media/sample.mp4');

console.log(info.path);
console.log(info.general('Format'));
console.log(info.video('Width'));
```

## [m] read

### read(path)

**`6.7.0`** **`[6.8.0]`**

- **path** { [string](dataTypes#string) } - 媒体文件路径
- <ins>**returns**</ins> { [MediainfoResult](#mediainforesult) } - 媒体信息对象

读取媒体文件信息.

此方法会立即向 MediaInfo 插件请求完整报告, 将报告解析为对象属性, 并返回可继续查询各流类型的结果对象.

---

## MediainfoResult

媒体信息结果对象.

对象包含固定的 `path` 和 `inform` 属性, 以及 `general`, `video`, `audio`, `text`, `other`, `image`, `menu`, `max` 等可调用流查询对象.

完整报告中的章节名称会转换为小写属性名. 章节内的字段名称会转换为 camelCase, 字段值均为字符串. 这些字段由目标文件和 MediaInfo 插件的报告内容动态决定.

例如, 报告中的 `File size` 字段会转换为 `fileSize`:

```js
let info = mediainfo.read('./media/sample.mp4');

console.log(info.general.fileSize);
console.log(info.video.format);
```

动态字段同时挂载在对应的可调用流查询对象上. 因此 `info.video` 既可作为函数调用, 也可读取其解析后的字段.

## [p#] MediainfoResult#path

**`6.7.0`** **`READONLY`**

- { [string](dataTypes#string) }

目标媒体文件的绝对路径.

## [p#] MediainfoResult#inform

**`6.7.0`** **`[6.8.0]`** **`READONLY`**

- { [string](dataTypes#string) }

MediaInfo 插件返回的完整文本报告.

## [m#] MediainfoResult#general

### MediainfoResult#general(parameter?)

**`6.7.0`** **`[6.8.0]`**

- **[ parameter = `''` ]** { [string](dataTypes#string) } - MediaInfo 参数名称
- <ins>**returns**</ins> { [string](dataTypes#string) } - General 流第 `0` 项的参数值

查询 General 流信息.

## [m#] MediainfoResult#video

### MediainfoResult#video(parameter?)

**`6.7.0`** **`[6.8.0]`**

- **[ parameter = `''` ]** { [string](dataTypes#string) } - MediaInfo 参数名称
- <ins>**returns**</ins> { [string](dataTypes#string) } - Video 流第 `0` 项的参数值

查询 Video 流信息.

## [m#] MediainfoResult#audio

### MediainfoResult#audio(parameter?)

**`6.7.0`** **`[6.8.0]`**

- **[ parameter = `''` ]** { [string](dataTypes#string) } - MediaInfo 参数名称
- <ins>**returns**</ins> { [string](dataTypes#string) } - Audio 流第 `0` 项的参数值

查询 Audio 流信息.

## [m#] MediainfoResult#text

### MediainfoResult#text(parameter?)

**`6.7.0`** **`[6.8.0]`**

- **[ parameter = `''` ]** { [string](dataTypes#string) } - MediaInfo 参数名称
- <ins>**returns**</ins> { [string](dataTypes#string) } - Text 流第 `0` 项的参数值

查询字幕或其他 Text 流信息.

## [m#] MediainfoResult#other

### MediainfoResult#other(parameter?)

**`6.7.0`** **`[6.8.0]`**

- **[ parameter = `''` ]** { [string](dataTypes#string) } - MediaInfo 参数名称
- <ins>**returns**</ins> { [string](dataTypes#string) } - Other 流第 `0` 项的参数值

查询 Other 流信息.

## [m#] MediainfoResult#image

### MediainfoResult#image(parameter?)

**`6.7.0`** **`[6.8.0]`**

- **[ parameter = `''` ]** { [string](dataTypes#string) } - MediaInfo 参数名称
- <ins>**returns**</ins> { [string](dataTypes#string) } - Image 流第 `0` 项的参数值

查询 Image 流信息.

## [m#] MediainfoResult#menu

### MediainfoResult#menu(parameter?)

**`6.7.0`** **`[6.8.0]`**

- **[ parameter = `''` ]** { [string](dataTypes#string) } - MediaInfo 参数名称
- <ins>**returns**</ins> { [string](dataTypes#string) } - Menu 流第 `0` 项的参数值

查询 Menu 流信息.

## [m#] MediainfoResult#max

### MediainfoResult#max(parameter?)

**`6.7.0`** **`[6.8.0]`**

- **[ parameter = `''` ]** { [string](dataTypes#string) } - MediaInfo 参数名称
- <ins>**returns**</ins> { [string](dataTypes#string) } - Max 流类型第 `0` 项的参数值

使用 MediaInfo 的 `MAX` 流类型执行查询.

## [m#] MediainfoResult#toString

### MediainfoResult#toString()

**`6.7.0`**

- <ins>**returns**</ins> { [string](dataTypes#string) } - 结果对象的可读字符串

返回由已解析章节和字段组成的对象描述.
