# HTTP

> Stability: 2 - Stable

http模块提供一些进行http请求的函数。

## http.get(url[, options, callback])

* `url` {string} 请求的URL地址，需要以"http://"或"https://"开头。如果url没有以"http://"开头，则默认为"http://"。
* `options` {Object} 请求选项。参见[http.buildRequest()][]。
* `callback` {Function} 回调，其参数是一个[Response][]对象。如果不加回调参数，则该请求将阻塞、同步地执行。

对地址url进行一次HTTP GET 请求。

最简单GET请求如下:

```
console.show();
var r = http.get("www.baidu.com");
log("code = " + r.statusCode);
log("body = " + r.body.string());
```

采用回调形式的GET请求如下：

```
console.show();
http.get("www.baidu.com", {}, function(res, ex){
	if(ex){
		console.error(ex);
		return;
	}
	log("code = " + r.statusCode);
	log("body = " + r.body.string());
});
```

如果要增加HTTP头部信息，则在options参数中添加，例如：
```
console.show();
var r = http.get("www.baidu.com", {
	headers: {
		"User-Agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X
10_7_0) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.56
Safari/535.11"
	}
});
log("code = " + r.statusCode);
log("body = " + r.body.string());
```

## http.post(url, data[, options, callback])

* `url` {string} 请求的URL地址，需要以"http://"或"https://"开头。如果url没有以"http://"开头，则默认为"http://"。
* `data` {string} | {Object} POST数据。
* `options` {Object} 请求选项。参见[http.buildRequest()][]。
* `callback` {Function} 回调，其参数是一个[Response][]对象。如果不加回调参数，则该请求将阻塞、同步地执行。

对地址url进行一次HTTP POST 请求。

其中POST数据可以是字符串或键值对。具体含义取决于options.contentType的值:

* `application/json` 
* `application/x-www-form-urlencoded`


