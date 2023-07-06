# HttpResponse

---

<p style="font: italic 1em sans-serif; color: #78909C">此章节待补充或完善...</p>
<p style="font: italic 1em sans-serif; color: #78909C">Marked by SuperMonster003 on Mar 21, 2023.</p>

---

HTTP 请求回应类 HttpResponse 是一个虚拟类, 实例通常由 [http](http) 全局模块产生:

```js
/* HttpResponse 为虚拟类, 并非真实存在. */
typeof global.HttpResponse; // "undefined"
```

常见相关方法或属性:

- [http.get](http#m-get)
- [http.post](http#m-post)
- [http.postMultipart](http#m-postmultipart)
- [http.request](http#m-request)

---

<p style="font: bold 2em sans-serif; color: #FF7043">HttpResponse</p>

---

## [p#] statusCode

- { [number](dataTypes#number) }

...

## [p#] statusMessage

- { [string](dataTypes#string) }

...

## [p#] body

- { [HttpResponseBody](httpResponseBodyType) }

...

## [p#] method

- { [string](dataTypes#string) }

...

## [p#] url

- { [Okhttp3HttpUrl](okhttp3HttpUrlType) }

...

## [p#] request

- { [Okhttp3Request](okhttp3RequestType) }

当前响应对应的请求, 是一个 [Okhttp3Request](okhttp3RequestType) 实例.

```js
http.get('https://www.msn.com').request.method(); // GET
```

## [p#] headers

- { [HttpResponseHeaders](httpResponseHeadersType) }

当前响应的 [响应标头](httpHeaderGlossary#响应标头) 信息, 是一个 JavaScript 对象.

该对象的 `键 (Key)` 是响应头名称, `值 (Value)` 是对应的响应头数据.

所有响应头名称均为小写形式.

```js
Object.entries(http.get('https://www.msn.com').headers).forEach((entry) => {
    let [ key, value ] = entry;
    console.log(`${key}: ${value}`);
});
```

# ResponseLegacy

HTTP请求的响应.

## Response.statusCode

* {number}

当前响应的HTTP状态码. 例如200(OK), 404(Not Found)等.

有关HTTP状态码的信息, 参见[菜鸟教程：HTTP状态码](http://www.runoob.com/http/http-status-codes.html).

## Response.statusMessage

* {string}

当前响应的HTTP状态信息. 例如"OK", "Bad Request", "Forbidden".

有关HTTP状态码的信息, 参见[菜鸟教程：HTTP状态码](http://www.runoob.com/http/http-status-codes.html).

例子：

```
var res = http.get("www.baidu.com");
if(res.statusCode >= 200 && res.statusCode < 300){
	toast("页面获取成功!");
}else if(res.statusCode == 404){
	toast("页面没找到哦...");
}else{
	toast("错误: " + res.statusCode + " " + res.statusMessage);
}
```

## Response.body

* {Object}

当前响应的内容. 他有以下属性和函数：

* bytes() {Array} 以字节数组形式返回响应内容
* string() {string} 以字符串形式返回响应内容
* json() {Object} 把响应内容作为JSON格式的数据并调用JSON.parse, 返回解析后的对象
* contentType {string} 当前响应的内容类型

## Response.url

* {number}
  当前响应所对应的请求URL.

## Response.method

* {string}
  当前响应所对应的HTTP请求的方法. 例如"GET", "POST", "PUT"等.
