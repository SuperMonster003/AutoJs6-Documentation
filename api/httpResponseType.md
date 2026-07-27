# HttpResponse

HttpResponse 是 `http` 模块返回的 HTTP 响应对象. 它是文档类型, 不是可直接构造的全局类.

```js
let response = http.get("https://example.com");
console.log(response.statusCode);
```

常见相关方法:

- [http.request](http#m-request)
- [http.get](http#m-get)
- [http.post](http#m-post)
- [http.requestAsync](http#m-requestasync)

---

<p style="font: bold 2em sans-serif; color: #FF7043">HttpResponse</p>

---

## [p#] statusCode

- { [number](dataTypes#number) }

HTTP 状态码, 如 `200` 或 `404`.

HTTP 非成功状态仍会生成 HttpResponse. 它本身不会使回调进入错误分支或使异步方法返回的 Promise 拒绝.

## [p#] statusMessage

- { [string](dataTypes#string) }

HTTP 状态消息, 如 `"OK"` 或 `"Not Found"`.

## [p#] body

- { [HttpResponseBody](httpResponseBodyType) }

响应体. 完整读取, 流式读取和资源关闭规则参见 [HttpResponseBody](httpResponseBodyType).

## [p#] headers

- { [HttpResponseHeaders](httpResponseHeadersType) }

响应头 JavaScript 对象. 属性名统一转换为小写. 同名响应头只有一个值时, 属性值为字符串; 有多个值时, 属性值为字符串数组.

```js
let response = http.get("https://example.com");
Object.entries(response.headers).forEach((entry) => {
    let [ name, value ] = entry;
    console.log(name + ": " + value);
});
```

## [p#] request

- { [Okhttp3Request](okhttp3RequestType) }

产生当前响应的 OkHttp 请求对象.

```js
let response = http.get("https://example.com");
console.log(response.request.method()); // GET
```

## [p#] url

- { [Okhttp3HttpUrl](okhttp3HttpUrlType) }

产生当前响应的请求 URL.

## [p#] method

- { [string](dataTypes#string) }

产生当前响应的 HTTP 请求方法, 如 `"GET"`, `"POST"` 或 `"DELETE"`.
