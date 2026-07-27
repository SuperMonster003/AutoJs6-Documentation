# HttpRequestBuilderOptions

HttpRequestBuilderOptions 是 `http` 模块用于构建请求和配置当前脚本 HTTP 运行时的选项对象.

选项分为两类:

- `method`, `headers`, `contentType`, `body` 和 `files` 参与构建 [Okhttp3Request](okhttp3RequestType).
- `timeout`, `maxRetries`, `cacheBody`, `bodyCacheThresholdBytes`, `isInsecure`, `insecure` 和 `client` 在执行请求时生效.

[http.buildRequest](http#m-buildrequest) 只构建请求, 不应用第二类运行时选项.

---

<p style="font: bold 2em sans-serif; color: #FF7043">HttpRequestBuilderOptions</p>

---

## [p?] method

- { [string](dataTypes#string) }

HTTP 请求方法, 如 `"GET"`, `"POST"`, `"PUT"`, `"DELETE"` 或 `"PATCH"`.

直接调用 [http.buildRequest](http#m-buildrequest), [http.request](http#m-request) 或 [http.requestAsync](http#m-requestasync) 时必须提供此属性. `get`, `head`, `post`, `postJson`, `postMultipart`, `put`, `delete`, `del` 及其异步版本会覆盖它.

## [p?] headers

- { [HttpRequestHeaders](httpRequestHeadersType) }

请求头 JavaScript 对象. 属性名为请求头名称, 属性值为字符串或字符串数组.

数组中的值会依次传给 OkHttp `Request.Builder.header` 方法. 该方法替换同名请求头, 因此同一属性最终保留最后一个数组元素.

## [p?] contentType

- { [string](dataTypes#string) }

请求体媒体类型, 如 `"text/plain"` 或 `"application/json"`.

此属性用于字符串或函数形式的 [body](#p-body). `post`, `put` 和 `delete` 默认使用 `"application/x-www-form-urlencoded"`, `postJson` 固定使用 `"application/json"`, `postMultipart` 固定使用 `"multipart/form-data"`.

## [p?] body

**`[6.8.0]`**

- { [okhttp3.RequestBody](https://square.github.io/okhttp/4.x/okhttp/okhttp3/-request-body/) | [string](dataTypes#string) | [Function](dataTypes#function) }

请求体. 支持以下形式:

- OkHttp `RequestBody` 对象.
- 字符串. 使用 [contentType](#p-contenttype) 作为媒体类型.
- 接收一个 [okio.BufferedSink](https://square.github.io/okio/3.x/okio/okio/okio.-buffered-sink/) 参数的可调用函数. 函数负责向 sink 写入请求体.

`body` 与 [files](#p-files) 同时存在时, `body` 优先.

自 AutoJs6 6.8.0 起, 函数形式也接受 Rhino 可调用代理, 并在函数的声明作用域中执行.

## [p?] files

**`[6.7.0]`**

- { [Object](dataTypes#object) }

用于构建 `"multipart/form-data"` 请求体的对象. 每个属性名是表单字段名, 属性值支持:

- 字符串或数字, 作为普通表单字段.
- 文件对象, 使用文件名和按扩展名推断的媒体类型.
- `[ fileName, path ]`, 使用指定文件名和按扩展名推断的媒体类型.
- `[ fileName, mimeType, path ]`, 使用指定文件名和媒体类型.

仅当 [body](#p-body) 不存在时使用此属性.

## [p?] timeout

**`[6.7.0]`**

- [ `30000` ] { [number](dataTypes#number) }

连接, 读取和写入超时时间, 单位为毫秒.

执行请求时, 此值先应用到当前 `OkHttpClient.Builder`. 随后 [client](#p-client) 中的同名 Builder 配置可以覆盖对应超时.

## [p?] maxRetries

- [ `3` ] { [number](dataTypes#number) }

HTTP 非成功响应的最大重试次数. 默认最多执行 `1 + 3` 次请求.

重试条件是已经收到的响应状态码不在 `200` 到 `299` 范围内. 传输阶段直接抛出的 I/O 异常不由此选项重试.

此值在每次请求执行前写入当前脚本的共享 HTTP 运行时. 后续请求未指定时会恢复默认值 `3`.

## [p?] cacheBody

**`6.7.0`**

- [ `false` ] { [boolean](dataTypes#boolean) }

是否缓存通过 [HttpResponseBody.string](httpResponseBodyType#m-string) 或 [HttpResponseBody.bytes](httpResponseBodyType#m-bytes) 完整读取的结果.

默认不缓存, 完整读取后响应体会关闭且不能再次读取. 启用缓存时, 字符串缓存和字节缓存仍相互独立.

## [p?] bodyCacheThresholdBytes

**`6.7.0`**

- [ `8388608` ] { [number](dataTypes#number) }

已知响应体长度允许缓存的最大值, 单位为字节. 默认值为 `8388608`, 即 8 MiB.

仅在 `cacheBody` 为 `true` 时生效. 服务端未声明内容长度或无法取得长度时, 实现会缓存完整读取结果而不使用此阈值预先限制.

## [p?] isInsecure

**`6.7.0`**

- [ `false` ] { [boolean](dataTypes#boolean) }

是否信任所有 TLS 证书并接受所有主机名. [insecure](#p-insecure) 是此属性的别名.

此选项会关闭关键的 HTTPS 身份校验, 仅应在受控测试环境中使用.

启用后生成的客户端会成为当前脚本共享客户端, 后续请求会继承该客户端配置.

不安全 TLS 配置在 [client](#p-client) 配置之后应用, 因此会替换 Builder 中已有的 SSL Socket Factory 和主机名验证器.

## [p?] insecure

**`6.7.0`**

- [ `false` ] { [boolean](dataTypes#boolean) }

[isInsecure](#p-isinsecure) 的别名.

## [p?] client

**`6.7.0`**

- { [Object](dataTypes#object) }

应用到当前 [okhttp3.OkHttpClient.Builder](https://square.github.io/okhttp/4.x/okhttp/okhttp3/-ok-http-client/-builder/) 的配置对象.

每个属性名必须是 Builder 的公共方法名. 属性值按方法形参转换:

- 单参数 Builder 方法直接使用属性值.
- 存在双参数重载且属性值是长度为 `2` 的数组时, 两个数组元素分别作为方法参数.
- `TimeUnit` 参数可使用 `java.util.concurrent.TimeUnit` 对象, 或不区分大小写的字符串, 如 `"SECONDS"`.
- 布尔值, 整数, 长整数, 浮点数和字符串会转换为对应的 Java 类型.
- Java 对象参数必须与 Builder 方法要求的类型兼容.

零参数方法, 未知方法, 不支持的参数数量和无法转换的值会使调用抛出异常.

配置以当前共享客户端的 `newBuilder()` 为基础. 请求执行后, 构建的新客户端替换当前脚本的共享客户端, 因而未被后续请求覆盖的配置会继续生效.

```js
let response = http.get("https://example.com", {
    timeout: 10000,
    client: {
        followRedirects: false,
        readTimeout: [ 5, "SECONDS" ],
    },
});
console.log(response.statusCode);
```
