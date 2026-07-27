# HttpResponseBody

HttpResponseBody 表示 [HttpResponse](httpResponseType) 的响应体.

响应体底层是一次性数据流:

- [string](#m-string), [bytes](#m-bytes) 和 [json](#m-json) 会完整读取并自动关闭响应体.
- [saveToFile](#m-savetofile) 会流式写入文件并自动关闭响应体.
- [stream](#m-stream) 不会自动关闭响应体, 调用方必须负责关闭.
- 默认不缓存完整响应体. 启用 [cacheBody](httpRequestBuilderOptionsType#p-cachebody) 后, 只有符合缓存条件的同类完整读取结果可以再次取得. 例如 `string()` 与 `json()` 共用字符串缓存, 但 `string()` 后再调用 `bytes()` 仍会失败.

响应体关闭后, 未命中缓存的读取方法会抛出异常.

---

<p style="font: bold 2em sans-serif; color: #FF7043">HttpResponseBody</p>

---

## [p#] contentType

**`READONLY`**

- { [okhttp3.MediaType](https://square.github.io/okhttp/4.x/okhttp/okhttp3/-media-type/) | [null](dataTypes#null) }

响应体的媒体类型. 响应未声明媒体类型时为 `null`.

需要字符串时可调用 `String(response.body.contentType)` 或底层对象的 `toString()`.

## [m#] string

### string()

**`[6.7.0]`** **`READONLY`**

- <ins>**returns**</ins> { [string](dataTypes#string) } - 完整响应文本

完整读取响应体并自动关闭它.

当请求选项 `cacheBody` 为 `true`, 且服务端声明的内容长度不大于 `bodyCacheThresholdBytes` 时, 结果会缓存. 内容长度未知时也会缓存. 命中字符串缓存后可重复调用此方法, [json](#m-json) 也会复用同一缓存.

## [m#] bytes

### bytes()

**`[6.7.0]`** **`READONLY`**

- <ins>**returns**</ins> { [ByteArray](dataTypes#bytearray) } - 完整响应字节数组

完整读取响应体并自动关闭它.

当请求选项 `cacheBody` 为 `true`, 且响应符合缓存条件时, 结果会缓存并可由后续 `bytes()` 调用再次取得. 字节缓存与字符串缓存相互独立.

## [m#] json

### json()

**`[6.7.0]`** **`READONLY`**

- <ins>**returns**</ins> { [any](dataTypes#any) } - JSON 解析结果

通过 [string](#m-string) 完整读取响应体, 再使用 `JSON.parse` 解析. 响应文本不是有效 JSON 时抛出异常.

## [m#] stream

### stream()

**`6.7.0`** **`READONLY`**

- <ins>**returns**</ins> { [java.io.InputStream](https://developer.android.com/reference/java/io/InputStream) } - 响应体输入流

获取响应体输入流, 用于逐块处理大型响应. 此方法不会自动关闭输入流或响应体.

处理完成后应关闭流并调用 [close](#m-close). `close()` 可安全地重复调用.

```js
let response = http.get("https://example.com/file.bin");
let input = response.body.stream();
try {
    // 在此处逐块读取 input.
} finally {
    input.close();
    response.body.close();
}
```

## [m#] saveToFile

### saveToFile(path, bufferSize?)

**`6.7.0`** **`READONLY`**

- **path** { [string](dataTypes#string) } - 目标文件路径
- **[ bufferSize = 8192 ]** { [number](dataTypes#number) } - 复制缓冲区大小, 单位为字节
- <ins>**returns**</ins> { [HttpSaveResult](#c-httpsaveresult) } - 保存结果

将响应体流式写入文件, 避免把完整响应载入内存. `bufferSize` 不大于 `0` 时也使用 `8192`.

目标路径会按当前脚本运行时路径规则解析. 路径指向目录时抛出异常. 文件复制期间的异常不会直接抛出, 而是记录在返回结果中.

通过路径校验并开始文件复制后, 无论返回结果成功或失败, 此方法都会关闭输入流, 输出流和响应体. 调用后不能再从当前响应体读取未缓存的数据.

```js
let response = http.get("https://example.com/file.bin");
let result = response.body.saveToFile("./file.bin");
if (!result.success) {
    console.error(result.error);
}
```

## [m#] close

### close()

**`6.7.0`** **`READONLY`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

关闭响应体及其底层资源. 此方法是幂等的, 可安全地重复调用.

---

<p style="font: bold 2em sans-serif; color: #FF7043">HttpSaveResult</p>

---

## [C] HttpSaveResult

**`6.7.0`**

HttpSaveResult 是 [saveToFile](#m-savetofile) 返回的保存结果对象, 不能由脚本直接构造.

## [p#] code

**`READONLY`**

- { [number](dataTypes#number) }

结果码. `0` 表示成功, `-1` 表示文件复制失败.

## [p#] path

**`READONLY`**

- { [string](dataTypes#string) | [null](dataTypes#null) }

解析后的目标文件路径.

## [p#] bytesCopied

**`READONLY`**

- { [number](dataTypes#number) }

已经写入的字节数. 失败时可能大于 `0`.

## [p#] success

**`READONLY`**

- { [boolean](dataTypes#boolean) }

是否保存成功, 等价于 `code === 0`.

## [p#] error

**`READONLY`**

- { [java.lang.Throwable](https://developer.android.com/reference/java/lang/Throwable) | [null](dataTypes#null) }

保存失败时捕获的异常, 成功时为 `null`.

## [m#] isSuccess

### isSuccess()

**`READONLY`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否保存成功

返回值与 [success](#p-success) 相同.
