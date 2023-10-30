# HTTP

---

<p style="font: italic 1em sans-serif; color: #78909C">此章节待补充或完善...</p>
<p style="font: italic 1em sans-serif; color: #78909C">Marked by SuperMonster003 on Mar 21, 2023.</p>

---

http 模块主要用于发送 HTTP 请求, 获取并解析 HTTP 响应.

> 注: 与 [web](web) 模块不同, web 模块主要用于 WebView 网页的注入及客户端构建.

---

<p style="font: bold 2em sans-serif; color: #FF7043">http</p>

---

## [m] get

### get(url)

**`Overload 1/3`**

- **url** { [string](dataTypes#string) } - 请求的 URL 地址 (默认使用 HTTP 协议)
- <ins>**returns**</ins> { [HttpResponse](httpResponseType) } - 请求的响应实例

```js
let response = http.get('www.github.com');
if (response.statusCode === 200) {
    console.log('请求成功');
} else {
    console.log('请求失败');
}
```

### get(url, options)

**`Overload 2/3`**

- **url** { [string](dataTypes#string) } - 请求的 URL 地址 (默认使用 HTTP 协议)
- **options** { [HttpRequestBuilderOptions](httpRequestBuilderOptionsType) } - 请求的构建选项
- <ins>**returns**</ins> { [HttpResponse](httpResponseType) } - 请求的响应实例

### get(url, options, callback)

**`Overload 3/3`** **`Async`**

- **url** { [string](dataTypes#string) } - 请求的 URL 地址 (默认使用 HTTP 协议)
- **options** { [HttpRequestBuilderOptions](httpRequestBuilderOptionsType) } - 请求的构建选项
- **callback** { [HttpRequestBuilderOptions](httpRequestBuilderOptionsType) } - 请求的响应回调
- <ins>**returns**</ins> { [HttpResponse](httpResponseType) } - 请求的响应实例


- **url** { [string](dataTypes#string) } - 请求的 URL 地址
* `options` {Object} 请求选项. 参见[http.request()][].
* `callback` {Function} 回调函数, 可选, 其参数是一个[Response][]对象. 如果不加回调函数, 则该请求将阻塞、同步地执行.


对地址url进行一次HTTP GET 请求. 如果没有回调函数, 则在请求完成或失败时返回此次请求的响应(参见[Response][]).

最简单GET请求如下:

```
console.show();
var r = http.get("www.baidu.com");
log("code = " + r.statusCode);
log("html = " + r.body.string());
```

采用回调形式的GET请求如下：

```
console.show();
http.get("www.baidu.com", {}, function(res, err){
	if(err){
		console.error(err);
		return;
	}
	log("code = " + res.statusCode);
	log("html = " + res.body.string());
});
```

如果要增加HTTP头部信息, 则在options参数中添加, 例如：

```
console.show();
var r = http.get("www.baidu.com", {
	headers: {
		'Accept-Language': 'zh-cn,zh;q=0.5',
		'User-Agent': 'Mozilla/5.0(Macintosh;IntelMacOSX10_7_0)AppleWebKit/535.11(KHTML,likeGecko)Chrome/17.0.963.56Safari/535.11'
	}
});
log("code = " + r.statusCode);
log("html = " + r.body.string());
```

一个请求天气并解析返回的天气JSON结果的例子如下：

```
var city = "广州";
var res = http.get("http://www.sojson.com/open/api/weather/json.shtml?city=" + city);
if(res.statusCode != 200){
	toast("请求失败: " + res.statusCode + " " + res.statusMessage);
}else{
	var weather = res.body.json();
	log(weather);
	toast(util.format("温度: %s 湿度: %s 空气质量: %s", weather.data.wendu,
		weather.data.shidu, weather.quality));
}
```

## [m] post

### post(url, data, options?, callback?)

* `url` {string} 请求的URL地址, 需要以"http://"或"https://"开头. 如果url没有以"http://"开头, 则默认为"http://".
* `data` {string} | {Object} POST数据.
* `options` {Object} 请求选项.
* `callback` {Function} 回调, 其参数是一个[Response][]对象. 如果不加回调参数, 则该请求将阻塞、同步地执行.

对地址url进行一次HTTP POST 请求. 如果没有回调函数, 则在请求完成或失败时返回此次请求的响应(参见[Response][]).

其中POST数据可以是字符串或键值对. 具体含义取决于options.contentType的值. 默认为"application/x-www-form-urlencoded"(表单提交), 这种方式是JQuery的ajax函数的默认方式.

一个模拟表单提交登录淘宝的例子如下:

```
var url = "https://login.taobao.com/member/login.jhtml";
var username = "你的用户名";
var password = "你的密码";
var res = http.post(url, {
	"TPL_username": username,
	"TPL_password": password
});
var html = res.body.string();
if(html.contains("页面跳转中")){
	toast("登录成功");
}else{
	toast("登录失败");
}
```

## [m] postJson

### postJson(url, data?, options?, callback?)

* `url` {string} 请求的URL地址, 需要以"http://"或"https://"开头. 如果url没有以"http://"开头, 则默认为"http://".
* `data` {Object} POST数据.
* `options` {Object} 请求选项.
* `callback` {Function} 回调, 其参数是一个[Response][]对象. 如果不加回调参数, 则该请求将阻塞、同步地执行.

以JSON格式向目标Url发起POST请求. 如果没有回调函数, 则在请求完成或失败时返回此次请求的响应(参见[Response][]).

JSON格式指的是, 将会调用`JSON.stringify()`把data对象转换为JSON字符串, 并在HTTP头部信息中把"Content-Type"属性置为"application/json". 这种方式是AngularJS的ajax函数的默认方式.

一个调用图灵机器人接口的例子如下：

```
var url = "http://www.tuling123.com/openapi/api";
r = http.postJson(url, {
    key: "65458a5df537443b89b31f1c03202a80",
    info: "你好啊",
    userid: "1",
});
toastLog(r.body.string());
```

## [m] postMultipart

### postMultipart(url, files, options?, callback?)

* `url` {string} 请求的URL地址, 需要以"http://"或"https://"开头. 如果url没有以"http://"开头, 则默认为"http://".
* `files` {Object} POST数据.
* `options` {Object} 请求选项.
* `callback` {Function} 回调, 其参数是一个`Response`对象. 如果不加回调参数, 则该请求将阻塞、同步地执行.

向目标地址发起类型为multipart/form-data的请求（通常用于文件上传等), 其中files参数是{name1: value1, name2: value2, ...}的键值对, value的格式可以是以下几种情况：

1. `string`
2. 文件类型, 即open()返回的类型
3. [fileName, filePath]
4. [fileName, mimeType, filePath]

其中1属于非文件参数, 2、3、4为文件参数. 举个例子, 最简单的文件上传的请求为：

```
var res = http.postMultipart(url, {
	file: open("/sdcard/1.txt")
});
log(res.body.string());
```

如果使用格式2, 则代码为

```
var res = http.postMultipart(url, {
	file: ["1.txt", "/sdcard/1.txt"]
});
log(res.body.string());
```

如果使用格式3, 则代码为

```
var res = http.postMultipart(url, {
	file: ["1.txt", "text/plain", "/sdcard/1.txt"]
});
log(res.body.string());
```

如果使用格式2的同时要附带非文件参数"appId=abcdefghijk", 则为:

```
var res = http.postMultipart(url, {
	appId: "adcdefghijk",
	file: open("/sdcard/1.txt")
});
log(res.body.string());
```

## [m] request

### request(url, options?, callback?)

* `url` {string} 请求的URL地址, 需要以"http://"或"https://"开头. 如果url没有以"http://"开头, 则默认为"http://".
* `options` {Object} 请求选项. 参见[http.buildRequest()][].
* `callback` {Function} 回调, 其参数是一个[Response][]对象. 如果不加回调参数, 则该请求将阻塞、同步地执行.

对目标地址url发起一次HTTP请求. 如果没有回调函数, 则在请求完成或失败时返回此次请求的响应(参见[Response][]).

选项options可以包含以下属性：

* `headers` {Object} 键值对形式的HTTP头部信息. 有关HTTP头部信息, 参见[菜鸟教程：HTTP响应头信息](http://www.runoob.com/http/http-header-fields.html).
* `method` {string} HTTP请求方法. 包括"GET", "POST", "PUT", "DELETE", "PATCH".
* `contentType` {string} HTTP头部信息中的"Content-Type", 表示HTTP请求的内容类型. 例如"text/plain", "application/json". 更多信息参见[菜鸟教程：HTTP contentType](http://www.runoob.com/http/http-content-type.html).
* `body` {string} | {Array} | {Function} HTTP请求的内容. 可以是一个字符串, 也可以是一个字节数组；或者是一个以[BufferedSink](https://github.com/square/okio/blob/master/okio/src/main/java/okio/BufferedSink.java/)为参数的函数.

该函数是get, post, postJson等函数的基础函数. 因此除非是PUT, DELETE等请求, 或者需要更高定制的HTTP请求, 否则直接使用get, post, postJson等函数会更加方便.

## [m] buildRequest

### buildRequest(url, options)

... ...