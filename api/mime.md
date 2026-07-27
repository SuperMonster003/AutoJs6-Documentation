# MIME

`mime` 模块用于解析 MIME 类型字符串, 根据文件扩展名查询 MIME 类型, 以及访问预定义 MIME 常量.

MIME 类型的基本格式为 `type/subtype`, 并可在分号后附加参数. 更多概念参阅 [MIME 类型](mimeTypeGlossary).

`mime` 与 `$mime` 引用同一个对象.

```js
let parsed = mime('text/plain; charset=utf-8');

parsed.type; // "text"
parsed.subtype; // "plain"
parsed.mimeTypeRefined; // "text/plain"
parsed.parameters.charset; // "utf-8"
```

---

<p style="font: bold 2em sans-serif; color: #FF7043">mime</p>

---

## [@] mime

### mime(mimeString)

**`6.6.0`**

- **mimeString** { [string](dataTypes#string) } - MIME 类型字符串
- <ins>**returns**</ins> { [JsMime](#jsmime) } - MIME 解析结果

解析 MIME 类型字符串.

```js
let parsed = mime('application/json; charset=utf-8');

console.log(parsed.type); // application
console.log(parsed.subtype); // json
console.log(parsed.mimeType); // application/json; charset=utf-8
console.log(parsed.mimeTypeRefined); // application/json
console.log(parsed.parameters); // { charset: "utf-8" }
console.log(parsed.raw); // application/json; charset=utf-8
```

参数数量必须为 1. MIME 类型字符串无效时抛出异常.

## [m] getMediaType

### mime.getMediaType(mediaType)

**`6.6.0`**

- **mediaType** { [string](dataTypes#string) } - MIME 类型字符串
- <ins>**returns**</ins> { okhttp3.MediaType } - OkHttp 媒体类型对象

将字符串解析为 `okhttp3.MediaType`.

字符串不符合 OkHttp 媒体类型语法时抛出异常.

```js
let mediaType = mime.getMediaType('application/json; charset=utf-8');

console.log(mediaType.toString()); // application/json; charset=utf-8
```

## [m] parseMediaType

### mime.parseMediaType(mediaType)

**`6.6.0`**

- **mediaType** { [string](dataTypes#string) } - MIME 类型字符串
- <ins>**returns**</ins> { okhttp3.MediaType | [null](dataTypes#null) } - OkHttp 媒体类型对象, 解析失败时为 `null`

尝试将字符串解析为 `okhttp3.MediaType`.

与 [mime.getMediaType](#m-getmediatype) 不同, 字符串无效时返回 `null`.

```js
mime.parseMediaType('text/plain') !== null; // true
mime.parseMediaType('not a mime type') === null; // true
```

## [m] fromFile

### mime.fromFile(path)

**`6.6.0`**

- **path** { [string](dataTypes#string) } - 文件路径或文件名
- <ins>**returns**</ins> { [string](dataTypes#string) | [null](dataTypes#null) } - MIME 类型, 未识别扩展名时为 `null`

根据文件扩展名查询 MIME 类型.

此方法只解析路径中的扩展名, 不读取文件内容. 路径没有扩展名时返回 [mime.WILDCARD](#p-wildcard).

```js
mime.fromFile('/sdcard/report.pdf'); // "application/pdf"
mime.fromFile('/sdcard/picture.png'); // "image/png"
mime.fromFile('/sdcard/README'); // "*/*"
```

## [m] fromFileOr

### mime.fromFileOr(path, defaultType)

**`6.6.0`**

- **path** { [string](dataTypes#string) } - 文件路径或文件名
- **defaultType** { [string](dataTypes#string) | [null](dataTypes#null) } - 未识别扩展名时使用的 MIME 类型
- <ins>**returns**</ins> { [string](dataTypes#string) } - MIME 类型

根据文件扩展名查询 MIME 类型. 扩展名无法识别时返回 `defaultType`.

当 `defaultType` 为 `null` 时, 使用 [mime.WILDCARD](#p-wildcard).

```js
mime.fromFileOr('/sdcard/data.unknown_ext', 'application/octet-stream');
// "application/octet-stream"
```

路径没有扩展名时, [mime.fromFile](#m-fromfile) 会直接返回 `*/*`, 因此不会使用 `defaultType`.

## [m] fromFileOrWildcard

### mime.fromFileOrWildcard(path)

**`6.6.0`**

- **path** { [string](dataTypes#string) } - 文件路径或文件名
- <ins>**returns**</ins> { [string](dataTypes#string) } - MIME 类型

根据文件扩展名查询 MIME 类型. 扩展名无法识别时返回 `*/*`.

等价于 `mime.fromFileOr(path, mime.WILDCARD)`.

## MIME 常量

`mime` 包含 2500 余个 MIME 字符串常量. 常量名称通常由 MIME 类型转换为大写下划线形式, 如 `application/json` 对应 `APPLICATION_JSON`.

以下列出常用常量. 更多 MIME 类型参阅 [MIME 类型](mimeTypeGlossary).

## [p] WILDCARD

### mime.WILDCARD

**`6.6.0`** **`CONSTANT`**

- [[ `'*/*'` ]] { [string](dataTypes#string) }

任意 MIME 类型.

## [p] MEDIA_TYPE_WILDCARD

### mime.MEDIA_TYPE_WILDCARD

**`6.6.0`** **`CONSTANT`**

- [[ `'*'` ]] { [string](dataTypes#string) }

任意媒体主类型.

## [p] APPLICATION_JSON

### mime.APPLICATION_JSON

**`6.6.0`** **`CONSTANT`**

- [[ `'application/json'` ]] { [string](dataTypes#string) }

JSON 数据.

## [p] APPLICATION_OCTET_STREAM

### mime.APPLICATION_OCTET_STREAM

**`6.6.0`** **`CONSTANT`**

- [[ `'application/octet-stream'` ]] { [string](dataTypes#string) }

任意二进制数据.

## [p] MULTIPART_FORM_DATA

### mime.MULTIPART_FORM_DATA

**`6.6.0`** **`CONSTANT`**

- [[ `'multipart/form-data'` ]] { [string](dataTypes#string) }

多部分表单数据.

## [p] TEXT_PLAIN

### mime.TEXT_PLAIN

**`6.6.0`** **`CONSTANT`**

- [[ `'text/plain'` ]] { [string](dataTypes#string) }

纯文本.

## [p] TEXT_HTML

### mime.TEXT_HTML

**`6.6.0`** **`CONSTANT`**

- [[ `'text/html'` ]] { [string](dataTypes#string) }

HTML 文档.

## [p] IMAGE_PNG

### mime.IMAGE_PNG

**`6.6.0`** **`CONSTANT`**

- [[ `'image/png'` ]] { [string](dataTypes#string) }

PNG 图像.

## [p] IMAGE_JPEG

### mime.IMAGE_JPEG

**`6.6.0`** **`CONSTANT`**

- [[ `'image/jpeg'` ]] { [string](dataTypes#string) }

JPEG 图像.

## [p] AUDIO_MPEG

### mime.AUDIO_MPEG

**`6.6.0`** **`CONSTANT`**

- [[ `'audio/mpeg'` ]] { [string](dataTypes#string) }

MPEG 音频.

## [p] VIDEO_MP4

### mime.VIDEO_MP4

**`6.6.0`** **`CONSTANT`**

- [[ `'video/mp4'` ]] { [string](dataTypes#string) }

MP4 视频.

---

## JsMime

`JsMime` 是 [mime(mimeString)](#mimemimestring) 返回的 MIME 解析结果.

---

<p style="font: bold 2em sans-serif; color: #FF7043">JsMime</p>

---

## [p#] raw

### JsMime#raw

**`6.6.0`** **`READONLY`**

- { [string](dataTypes#string) }

未经修改的输入字符串.

## [p#] type

### JsMime#type

**`6.6.0`** **`READONLY`**

- { [string](dataTypes#string) }

MIME 主类型, 如 `text`.

## [p#] subtype

### JsMime#subtype

**`6.6.0`** **`READONLY`**

- { [string](dataTypes#string) }

MIME 子类型, 如 `plain`.

## [p#] mimeType

### JsMime#mimeType

**`6.6.0`** **`READONLY`**

- { [string](dataTypes#string) }

由主类型, 子类型和参数组成的 MIME 字符串.

参数分隔符会规范化为 `; `.

## [p#] mimeTypeRefined

### JsMime#mimeTypeRefined

**`6.6.0`** **`READONLY`**

- { [string](dataTypes#string) }

仅由主类型和子类型组成的 MIME 字符串, 不包含参数.

## [p#] parameters

### JsMime#parameters

**`6.6.0`** **`READONLY`**

- { [object](dataTypes#object) }

MIME 参数对象. 属性名称和值均为字符串.

```js
let parsed = mime('text/plain; charset=utf-8; format=flowed');

parsed.parameters.charset; // "utf-8"
parsed.parameters.format; // "flowed"
```

## [m#] toString

### JsMime#toString()

**`6.6.0`**

- <ins>**returns**</ins> { [string](dataTypes#string) } - 可读字符串

返回包含全部解析字段的多行调试字符串.

## [m#] toStringReadable

### JsMime#toStringReadable()

**`6.6.0`**

- <ins>**returns**</ins> { [string](dataTypes#string) } - 可读字符串

返回与 [JsMime#toString()](#jsmimetostring) 相同的字符串.
