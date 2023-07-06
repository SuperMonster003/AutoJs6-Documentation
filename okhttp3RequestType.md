# Okhttp3Request

---

<p style="font: italic 1em sans-serif; color: #78909C">此章节待补充或完善...</p>
<p style="font: italic 1em sans-serif; color: #78909C">Marked by SuperMonster003 on Mar 2, 2023.</p>

---

[okhttp3.Request](https://square.github.io/okhttp/3.x/okhttp/okhttp3/Request.html) 别名.

Okhttp3Request 表示一个 HTTP 请求.

```js
let request = new okhttp3.Request.Builder()
    .url('https://www.msn.com')
    .method('GET', null)
    .build();

// Request{method=GET, url=https://www.msn.com/}
console.log(request);
```

常见相关方法或属性:

- [httpResponseType#request](httpResponseType#p-request)
- [okhttp3.Request.Builder#build](https://square.github.io/okhttp/3.x/okhttp/okhttp3/Request.Builder.html#build--)

> 注: 本章节仅列出部分属性或方法.

---

<p style="font: bold 2em sans-serif; color: #FF7043">okhttp3.Request</p>

---

## [m] body

### body()

- <ins>**returns**</ins> { [okhttp3.RequestBody](https://square.github.io/okhttp/3.x/okhttp/okhttp3/RequestBody.html) | [null](dataTypes#null) }

获取 HTTP 请求的 "请求体 (Request Body)".

## [m] cacheControl

### cacheControl()

- <ins>**returns**</ins> { [okhttp3.CacheControl](https://square.github.io/okhttp/3.x/okhttp/okhttp3/CacheControl.html) }

获取 HTTP 请求标头字段 [cache-control](httpRequestHeadersType#p-cache-control) 的信息.

```js
let cacheControl = http.get('https://www.msn.com', {
    headers: {
        'cache-control': 'no-transform, no-store, no-cache',
    },
    contentType: 'text/plain',
}).request.cacheControl();

console.log(cacheControl); // no-transform, no-store, no-cache
console.log(cacheControl.noTransform()); // true
console.log(cacheControl.noStore()); // true
console.log(cacheControl.mustRevalidate()); // false
```