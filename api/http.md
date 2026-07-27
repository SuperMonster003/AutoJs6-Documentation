# HTTP

http 模块基于 OkHttp 构建和执行 HTTP 请求.

URL 未以 `"http://"` 或 `"https://"` 开头时, 自动补充 `"http://"`.

相关类型:

- [HttpRequestBuilderOptions](httpRequestBuilderOptionsType)
- [HttpResponse](httpResponseType)
- [HttpResponseBody](httpResponseBodyType)

## 执行方式

传统请求方法 `request`, `get`, `head`, `post`, `postJson`, `postMultipart`, `put`, `delete` 和 `del` 支持两种执行方式:

- 不传 `callback` 时, 调用在请求完成后返回 [HttpResponse](httpResponseType), 传输或响应包装失败时抛出异常.
- 传入 `callback` 时, 调用把请求加入 OkHttp 异步队列并立即返回 `undefined`. 成功时调用 `callback(response, null)`, 失败时调用 `callback(null, error)`.

`callback` 的两个参数分别为 HttpResponse 或 `null`, 以及异常对象或 `null`. 回调返回值会被忽略.

自 AutoJs6 6.8.0 起, UI 线程在启用 continuation 且未传回调时, 会等待异步网络结果后继续执行并返回 HttpResponse. 这保持了无回调调用的同步结果语义, 同时避免直接在 UI 线程执行网络请求.

名称以 `Async` 结尾的方法始终在后台线程执行网络请求并返回 Promise:

- 成功时 Promise 兑现为 HttpResponse.
- 失败时 Promise 拒绝.
- 传入可选 `callback` 时, 仅在成功后调用 `callback(response, null)`. 失败只会拒绝 Promise, 不会调用该回调.
- 响应包装, Promise 的兑现或拒绝及成功回调在 UI 线程完成.

异步方法的成功回调返回值会被忽略. 回调自身抛出异常时, 返回的 Promise 会拒绝.

所有形参均按位置解析. `callback` 不能替代中间的 `options` 参数. 需要省略中间参数时, 应传入 `null`, `undefined` 或适用的空对象.

请求构建阶段发生的参数或 URL 错误会在方法调用时直接抛出. 已收到的非 `2xx` HTTP 状态是正常 HttpResponse, 不属于回调错误或 Promise 拒绝.

---

<p style="font: bold 1em sans-serif; color: #FF7043">http</p>

---

## [m] client

### client()

**`6.8.0`**

- <ins>**returns**</ins> { [okhttp3.OkHttpClient](https://square.github.io/okhttp/4.x/okhttp/okhttp3/-ok-http-client/) } - 当前脚本运行时使用的 OkHttp 客户端

获取当前脚本共享的 OkHttp 客户端. 请求选项中的 `timeout`, `client` 和不安全 TLS 配置会基于并替换该客户端.

## [m] buildRequest

### buildRequest(url, options)

- **url** { [string](dataTypes#string) } - 请求 URL
- **options** { [HttpRequestBuilderOptions](httpRequestBuilderOptionsType) } - 请求构建选项, 必须包含 `method`
- <ins>**returns**</ins> { [Okhttp3Request](okhttp3RequestType) } - 构建的 OkHttp 请求

只构建请求, 不执行网络操作.

此方法使用 `method`, `headers`, `contentType`, `body` 和 `files` 等构建选项, 但不应用 `timeout`, `maxRetries`, `cacheBody`, `bodyCacheThresholdBytes`, `isInsecure`, `insecure` 或 `client` 等运行时选项.

```js
let request = http.buildRequest("https://example.com/api", {
    method: "PATCH",
    contentType: "application/json",
    body: JSON.stringify({ enabled: true }),
});
console.log(request.method()); // PATCH
```

## [m] request

### request(url, options, callback?)

**`[6.8.0]`** **`Async?`**

- **url** { [string](dataTypes#string) } - 请求 URL
- **options** { [HttpRequestBuilderOptions](httpRequestBuilderOptionsType) } - 请求和运行时选项, 必须包含 `method`
- **[ callback ]** { [Function](dataTypes#function) } - 传统异步回调
- <ins>**returns**</ins> { [HttpResponse](httpResponseType) | [undefined](dataTypes#undefined) } - 无回调时返回响应, 有回调时返回 `undefined`

构建并执行自定义 HTTP 请求. 执行方式和回调参数参见本页开头的说明.

```js
let response = http.request("https://example.com/api", {
    method: "PATCH",
    contentType: "application/json",
    body: JSON.stringify({ enabled: true }),
});
console.log(response.statusCode);
```

## [m] requestAsync

### requestAsync(url, options, callback?)

**`6.7.0`** **`Async`**

- **url** { [string](dataTypes#string) } - 请求 URL
- **options** { [HttpRequestBuilderOptions](httpRequestBuilderOptionsType) } - 请求和运行时选项, 必须包含 `method`
- **[ callback ]** { [Function](dataTypes#function) } - 可选成功回调
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [HttpResponse](httpResponseType)

构建自定义 HTTP 请求, 并在后台线程执行网络操作. Promise 和可选回调语义参见本页开头的说明.

## [m] get

### get(url, options?, callback?)

**`[6.8.0]`** **`Async?`**

- **url** { [string](dataTypes#string) } - 请求 URL
- **[ options ]** { [HttpRequestBuilderOptions](httpRequestBuilderOptionsType) } - 请求和运行时选项
- **[ callback ]** { [Function](dataTypes#function) } - 传统异步回调
- <ins>**returns**</ins> { [HttpResponse](httpResponseType) | [undefined](dataTypes#undefined) } - 无回调时返回响应, 有回调时返回 `undefined`

发送 GET 请求. 此方法将 `options.method` 设置为 `"GET"`.

```js
let response = http.get("https://example.com", {
    headers: {
        Accept: "text/html",
    },
});
console.log(response.body.string());
```

## [m] getAsync

### getAsync(url, options?, callback?)

**`6.7.0`** **`Async`**

- **url** { [string](dataTypes#string) } - 请求 URL
- **[ options ]** { [HttpRequestBuilderOptions](httpRequestBuilderOptionsType) } - 请求和运行时选项
- **[ callback ]** { [Function](dataTypes#function) } - 可选成功回调
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [HttpResponse](httpResponseType)

在后台线程发送 GET 请求.

```js
http.getAsync("https://example.com")
    .then((response) => {
        console.log(response.statusCode);
    })
    .catch((error) => {
        console.error(error);
    });
```

## [m] head

### head(url, options?, callback?)

**`6.7.0`** **`[6.8.0]`** **`Async?`**

- **url** { [string](dataTypes#string) } - 请求 URL
- **[ options ]** { [HttpRequestBuilderOptions](httpRequestBuilderOptionsType) } - 请求和运行时选项
- **[ callback ]** { [Function](dataTypes#function) } - 传统异步回调
- <ins>**returns**</ins> { [HttpResponse](httpResponseType) | [undefined](dataTypes#undefined) } - 无回调时返回响应, 有回调时返回 `undefined`

发送 HEAD 请求. 此方法将 `options.method` 设置为 `"HEAD"`.

## [m] headAsync

### headAsync(url, options?, callback?)

**`6.7.0`** **`Async`**

- **url** { [string](dataTypes#string) } - 请求 URL
- **[ options ]** { [HttpRequestBuilderOptions](httpRequestBuilderOptionsType) } - 请求和运行时选项
- **[ callback ]** { [Function](dataTypes#function) } - 可选成功回调
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [HttpResponse](httpResponseType)

在后台线程发送 HEAD 请求.

## [m] post

### post(url, data?, options?, callback?)

**`[6.8.0]`** **`Async?`**

- **url** { [string](dataTypes#string) } - 请求 URL
- **[ data ]** { [any](dataTypes#any) } - 请求数据, 支持的类型取决于 `contentType`
- **[ options ]** { [HttpRequestBuilderOptions](httpRequestBuilderOptionsType) } - 请求和运行时选项
- **[ callback ]** { [Function](dataTypes#function) } - 传统异步回调
- <ins>**returns**</ins> { [HttpResponse](httpResponseType) | [undefined](dataTypes#undefined) } - 无回调时返回响应, 有回调时返回 `undefined`

发送 POST 请求. 此方法将 `options.method` 设置为 `"POST"`.

`contentType` 未指定或为 `"application/x-www-form-urlencoded"` 时, `data` 作为对象转换为表单字段. `contentType` 为 `"application/json"` 时, 使用 `JSON.stringify(data)`. 其他媒体类型下, `data` 必须是字符串, OkHttp `RequestBody` 或接收 `BufferedSink` 的可调用函数.

```js
let response = http.post("https://example.com/login", {
    username: "alice",
    password: "secret",
});
console.log(response.statusCode);
```

## [m] postAsync

### postAsync(url, data?, options?, callback?)

**`6.7.0`** **`Async`**

- **url** { [string](dataTypes#string) } - 请求 URL
- **[ data ]** { [any](dataTypes#any) } - 请求数据, 支持的类型取决于 `contentType`
- **[ options ]** { [HttpRequestBuilderOptions](httpRequestBuilderOptionsType) } - 请求和运行时选项
- **[ callback ]** { [Function](dataTypes#function) } - 可选成功回调
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [HttpResponse](httpResponseType)

在后台线程发送 POST 请求. 请求数据转换规则与 [post](#m-post) 相同.

## [m] postJson

### postJson(url, data, options?, callback?)

**`[6.8.0]`** **`Async?`**

- **url** { [string](dataTypes#string) } - 请求 URL
- **data** { [any](dataTypes#any) } - 可由 `JSON.stringify` 序列化的请求数据
- **[ options ]** { [HttpRequestBuilderOptions](httpRequestBuilderOptionsType) } - 请求和运行时选项
- **[ callback ]** { [Function](dataTypes#function) } - 传统异步回调
- <ins>**returns**</ins> { [HttpResponse](httpResponseType) | [undefined](dataTypes#undefined) } - 无回调时返回响应, 有回调时返回 `undefined`

使用 `JSON.stringify(data)` 构建请求体并发送 POST 请求. 此方法将 `method` 设置为 `"POST"`, 将 `contentType` 设置为 `"application/json"`.

```js
let response = http.postJson("https://example.com/api", {
    enabled: true,
});
console.log(response.statusCode);
```

## [m] postJsonAsync

### postJsonAsync(url, data, options?, callback?)

**`6.7.0`** **`Async`**

- **url** { [string](dataTypes#string) } - 请求 URL
- **data** { [any](dataTypes#any) } - 可由 `JSON.stringify` 序列化的请求数据
- **[ options ]** { [HttpRequestBuilderOptions](httpRequestBuilderOptionsType) } - 请求和运行时选项
- **[ callback ]** { [Function](dataTypes#function) } - 可选成功回调
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [HttpResponse](httpResponseType)

在后台线程发送 JSON POST 请求.

## [m] postMultipart

### postMultipart(url, files, options?, callback?)

**`[6.8.0]`** **`Async?`**

- **url** { [string](dataTypes#string) } - 请求 URL
- **files** { [Object](dataTypes#object) } - 多部分表单字段和文件
- **[ options ]** { [HttpRequestBuilderOptions](httpRequestBuilderOptionsType) } - 请求和运行时选项
- **[ callback ]** { [Function](dataTypes#function) } - 传统异步回调
- <ins>**returns**</ins> { [HttpResponse](httpResponseType) | [undefined](dataTypes#undefined) } - 无回调时返回响应, 有回调时返回 `undefined`

发送 `"multipart/form-data"` POST 请求. `files` 属性值支持:

- 字符串或数字, 作为普通表单字段.
- 文件对象.
- `[ fileName, path ]`.
- `[ fileName, mimeType, path ]`.

数组形式的 `path` 可使用脚本路径或 `java.net.URI`. 未指定媒体类型时按文件扩展名推断, 无法推断时使用 `"application/octet-stream"`.

```js
// 需要当前目录已有 app.log.
let response = http.postMultipart("https://example.com/upload", {
    description: "log file",
    file: [ "app.log", "./app.log" ],
});
console.log(response.statusCode);
```

## [m] postMultipartAsync

### postMultipartAsync(url, files, options?, callback?)

**`6.7.0`** **`Async`**

- **url** { [string](dataTypes#string) } - 请求 URL
- **files** { [Object](dataTypes#object) } - 多部分表单字段和文件
- **[ options ]** { [HttpRequestBuilderOptions](httpRequestBuilderOptionsType) } - 请求和运行时选项
- **[ callback ]** { [Function](dataTypes#function) } - 可选成功回调
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [HttpResponse](httpResponseType)

在后台线程发送 `"multipart/form-data"` POST 请求. `files` 格式与 [postMultipart](#m-postmultipart) 相同.

## [m] put

### put(url, data?, options?, callback?)

**`6.7.0`** **`[6.8.0]`** **`Async?`**

- **url** { [string](dataTypes#string) } - 请求 URL
- **[ data ]** { [any](dataTypes#any) } - 请求数据, 支持的类型取决于 `contentType`
- **[ options ]** { [HttpRequestBuilderOptions](httpRequestBuilderOptionsType) } - 请求和运行时选项
- **[ callback ]** { [Function](dataTypes#function) } - 传统异步回调
- <ins>**returns**</ins> { [HttpResponse](httpResponseType) | [undefined](dataTypes#undefined) } - 无回调时返回响应, 有回调时返回 `undefined`

发送 PUT 请求. 此方法将 `options.method` 设置为 `"PUT"`. 请求数据转换规则与 [post](#m-post) 相同.

## [m] putAsync

### putAsync(url, data?, options?, callback?)

**`6.7.0`** **`Async`**

- **url** { [string](dataTypes#string) } - 请求 URL
- **[ data ]** { [any](dataTypes#any) } - 请求数据, 支持的类型取决于 `contentType`
- **[ options ]** { [HttpRequestBuilderOptions](httpRequestBuilderOptionsType) } - 请求和运行时选项
- **[ callback ]** { [Function](dataTypes#function) } - 可选成功回调
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [HttpResponse](httpResponseType)

在后台线程发送 PUT 请求. 请求数据转换规则与 [post](#m-post) 相同.

## [m] delete

### delete(url, data?, options?, callback?)

**`6.7.0`** **`[6.8.0]`** **`Async?`**

- **url** { [string](dataTypes#string) } - 请求 URL
- **[ data ]** { [any](dataTypes#any) } - 请求数据, 支持的类型取决于 `contentType`
- **[ options ]** { [HttpRequestBuilderOptions](httpRequestBuilderOptionsType) } - 请求和运行时选项
- **[ callback ]** { [Function](dataTypes#function) } - 传统异步回调
- <ins>**returns**</ins> { [HttpResponse](httpResponseType) | [undefined](dataTypes#undefined) } - 无回调时返回响应, 有回调时返回 `undefined`

发送 DELETE 请求. 此方法将 `options.method` 设置为 `"DELETE"`. 请求数据转换规则与 [post](#m-post) 相同.

## [m] del

### del(url, data?, options?, callback?)

**`6.7.0`** **`[6.8.0]`** **`Async?`**

- **url** { [string](dataTypes#string) } - 请求 URL
- **[ data ]** { [any](dataTypes#any) } - 请求数据, 支持的类型取决于 `contentType`
- **[ options ]** { [HttpRequestBuilderOptions](httpRequestBuilderOptionsType) } - 请求和运行时选项
- **[ callback ]** { [Function](dataTypes#function) } - 传统异步回调
- <ins>**returns**</ins> { [HttpResponse](httpResponseType) | [undefined](dataTypes#undefined) } - 无回调时返回响应, 有回调时返回 `undefined`

[delete](#m-delete) 的别名.

## [m] deleteAsync

### deleteAsync(url, data?, options?, callback?)

**`6.7.0`** **`Async`**

- **url** { [string](dataTypes#string) } - 请求 URL
- **[ data ]** { [any](dataTypes#any) } - 请求数据, 支持的类型取决于 `contentType`
- **[ options ]** { [HttpRequestBuilderOptions](httpRequestBuilderOptionsType) } - 请求和运行时选项
- **[ callback ]** { [Function](dataTypes#function) } - 可选成功回调
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [HttpResponse](httpResponseType)

在后台线程发送 DELETE 请求. 请求数据转换规则与 [post](#m-post) 相同.

## [m] delAsync

### delAsync(url, data?, options?, callback?)

**`6.7.0`** **`Async`**

- **url** { [string](dataTypes#string) } - 请求 URL
- **[ data ]** { [any](dataTypes#any) } - 请求数据, 支持的类型取决于 `contentType`
- **[ options ]** { [HttpRequestBuilderOptions](httpRequestBuilderOptionsType) } - 请求和运行时选项
- **[ callback ]** { [Function](dataTypes#function) } - 可选成功回调
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [HttpResponse](httpResponseType)

[deleteAsync](#m-deleteasync) 的别名.
