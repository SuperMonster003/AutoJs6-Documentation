# HttpRequestHeaders

HttpRequestHeaders 是一个代表 [HTTP 请求头](httpHeaderGlossary#请求标头) 信息的接口.

HTTP 标头字段是大小写 **不敏感** 的 (根据 [RFC 2616](http://www.ietf.org/rfc/rfc2616.txt)), 本章节采用 **全部小写** 的形式表示标头字段 (如 content-type).

> 注: 本章节仅列出部分请求头字段信息, 更多信息可参阅 [HTTP 标头](httpHeaderGlossary#请求标头) 术语章节.

---

<p style="font: bold 2em sans-serif; color: #FF7043">HttpRequestHeaders</p>

---

## [I] HttpRequestHeaders

HttpRequestHeaders 接口类型的变量, 实际是将 JavaScript 对象 (通常作为 `options.headers` 的值) 进行遍历, 将每一个 header 依次传入 [okhttp3.Request.Builder](https://square.github.io/okhttp/3.x/okhttp/okhttp3/Request.Builder.html) 实例.

大致过程如下:

```js
/**
 * @param {okhttp3.Request.Builder} request
 */
function setHeaders(request) {
    Object.entries(this.options.headers || {}).forEach((entries) => {
        let [ key, value ] = entries;
        if (Array.isArray(value)) {
            value.forEach(v => request.header(key, v));
        } else {
            request.header(key, value);
        }
    });
}
```

## [p?] accept

- { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) }

accept 请求头用来表明客户端可处理的内容类型.

```text
# 语法 (合并)
accept: (<MIME_type>/<MIME_subtype>|<MIME_type>/*|*/*)[;q=<quality-value>]

# 语法 (展开)
accept: <MIME_type>/<MIME_subtype>
accept: <MIME_type>/<MIME_subtype>;q=<quality-value>
accept: <MIME_type>/*
accept: <MIME_type>/*;q=<quality-value>
accept: */*
accept: */*;q=<quality-value>

# 示例
accept: text/html
accept: image/*
accept: text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8
```

| 指令                                     | 含义                                                                        |
|----------------------------------------|---------------------------------------------------------------------------|
| &lt;MIME_type&gt;/&lt;MIME_subtype&gt; | 单一精确的 [MIME 类型](mimeTypeGlossary), 如text/html                             |
| &lt;MIME_type&gt;/*                    | 未指明子类的一类 MIME 类型. 如 image/* 可用于指代 image/png, image/svg, image/gif 等任何图片类型 |
| */*                                    | 任意类型的 MIME 类型                                                             |
| &lt;quality-value&gt;                  | 相对质量价值, 又称作权重, 表示优先顺序, 范围 [0..1], 默认为 1                                   |

> 参阅: [MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Accept)

## [p?] accept-encoding

- { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) }

请求头 accept-encoding 将客户端能够理解的内容编码方式 (通常为压缩算法) 通知给服务端.

```text
# 语法 (合并)
accept-encoding: (gzip|compress|deflate|br|identity|*)[;q=<quality-value>]

# 语法 (展开)
accept-encoding: gzip
accept-encoding: gzip;q=<quality-value>
accept-encoding: compress
accept-encoding: compress;q=<quality-value>
accept-encoding: deflate
accept-encoding: deflate;q=<quality-value>
accept-encoding: br
accept-encoding: br;q=<quality-value>
accept-encoding: identity
accept-encoding: identity;q=<quality-value>
accept-encoding: *
accept-encoding: *;q=<quality-value>

# 示例
accept-encoding: gzip
accept-encoding: gzip, compress, br
accept-encoding: br;q=1.0, gzip;q=0.8, *;q=0.1
```

| 指令                    | 含义                                                    |
|-----------------------|-------------------------------------------------------|
| gzip                  | 采用 Lempel-Ziv coding (LZ77) 压缩算法, 以及 32 位 CRC 校验的编码方式 |
| compress              | 采用 Lempel-Ziv-Welch (LZW) 压缩算法                        |
| deflate               | 采用 zlib 结构 (RFC 1950) 和 deflate 压缩算法 (RFC 1951)       |
| br                    | 采用 Brotli 算法的编码方式                                     |
| identity              | 用于指代自身 (如: 未经过压缩和修改). 除非特别指明, 这个标记始终可被接受              |
| &lt;quality-value&gt; | 相对质量价值, 又称作权重, 表示优先顺序, 范围 [0..1], 默认为 1               |

> 参阅: [MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Accept-Encoding)

## [p?] accept-language

- { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) }

accept-language 请求头允许客户端声明它可以理解的自然语言, 及优先选择的区域方言.

```text
# 语法 (合并)
accept-language: (<language>|*)[;q=<quality-value>]

# 语法 (展开)
accept-language: <language>
accept-language: <language>;q=<quality-value>
accept-language: *
accept-language: *;q=<quality-value>

# 示例
accept-language: de
accept-language: de-CH
accept-language: en-US,en;q=0.5
accept-language: zh-CN, zh;q=0.8, zh-TW;q=0.7, zh-HK;q=0.5, en-US;q=0.3, en;q=0.2
```

| 指令                    | 含义                                      |
|-----------------------|-----------------------------------------|
| &lt;language&gt;      | 语言代码或语言区域代码                             |
| *                     | 任意语言                                    |
| &lt;quality-value&gt; | 相对质量价值, 又称作权重, 表示优先顺序, 范围 [0..1], 默认为 1 |

> 参阅: [MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Accept-Language)

## [p?] connection

- { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) }

connection 通用标头控制网络连接在当前会话完成后是否仍然保持打开状态.

```text
# 示例
connection: keep-alive
connection: close
```

| 指令         | 含义                                       |
|------------|------------------------------------------|
| close      | 表明客户端或服务器想要关闭该网络连接. 这是 HTTP/1.0 请求的默认值   |
| keep-alive | 表明客户端想要保持该网络连接打开. HTTP/1.1 的请求默认使用一个持久连接 |
| ... ...    | ... ...                                  |

> 参阅: [MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Connection)

## [p?] host

- { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) }

host 头表示请求发送的目标服务器主机名和端口号.

如无端口号, 将使用服务默认端口 (如 HTTPS: 443, HTTP: 80 等)

所有 HTTP/1.1 请求报文中 **必须包含** 一个 host 头字段, 缺少或超过一个 host 头的 HTTP/1.1 请求可能会收到 400 (Bad Request) 状态码.

```text
# 语法
host: <host>
host: <host>:<port>

# 示例
host: developer.mozilla.org
```

| 指令           | 含义             |
|--------------|----------------|
| &lt;host&gt; | 服务器域名          |
| &lt;port&gt; | 服务器监听的 TCP 端口号 |

> 参阅: [MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Host)

## [p?] referer

- { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) }

referer 请求头包含了当前请求来源页面的地址. 

服务端一般使用 referer 头识别访问来源, 以此进行统计分析, 日志记录及缓存优化等.

```text
# 语法
referer: <url>

# 示例
referer: https://developer.mozilla.org/en-US/docs/Web/JavaScript
```

| 指令          | 含义                        |
|-------------|---------------------------|
| &lt;url&gt; | 当前页面被链接而至的前一页面的绝对路径或者相对路径 |

> 参阅: [MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Referer)

## [p?] user-agent

- { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) }

user-agent 首部包含了一个特征字符串, 用于让网络协议的对端识别发起请求的用户代理软件的应用类型, 操作系统, 软件开发商以及版本号. 

```text
# 语法
User-Agent: <product> / <product-version> <comment>

# 浏览器常用格式
User-Agent: Mozilla/<version> (<system-information>) <platform> (<platform-details>) <extensions>

# 示例
Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0
Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:42.0) Gecko/20100101 Firefox/42.0
Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36
Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36 OPR/38.0.2220.41
Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1
Googlebot/2.1 (+http://www.google.com/bot.html)
```

| 指令                      | 含义               |
|-------------------------|------------------|
| &lt;product&gt;         | 产品识别码            |
| &lt;product-version&gt; | 产品版本号            |
| &lt;comment&gt;         | 零个或多个关于组成产品信息的注释 |

> 参阅: [MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/User-Agent)

## [p?] cache-control

- { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) }

标头字段 cache-control 被用于在 HTTP 请求和响应中, 通过指定指令来实现缓存机制.

```text
# 语法
cache-control: max-age=<seconds>
cache-control: max-stale[=<seconds>]
cache-control: min-fresh=<seconds>
cache-control: no-cache
cache-control: no-store
cache-control: no-transform
cache-control: only-if-cached
... ...
```

| 指令                          | 含义                                          |
|-----------------------------|---------------------------------------------|
| max-age=&lt;seconds&gt;     | 设置缓存存储最大周期, 单位为秒, 超过这个时间缓存被认为过期             |
| max-state[=&lt;seconds&gt;] | 表明客户端愿意接收一个已经过期的资源. 秒数可选, 表示响应过时后不能超过该给定的时间 |
| min-fresh=&lt;seconds&gt;   | 表示客户端希望获取一个能在指定的秒数内保持其最新状态的响应               |
| no-cache                    | 发布缓存副本前, 强制要求原始服务器进行验证缓存中的请求                |
| no-store                    | 不使用任何缓存                                     |
| no-transform                | 不得对资源进行转换或转变                                |
| only-if-cached              | 表明客户端只接受已缓存的响应, 且不要向原始服务器检查是否有更新的拷贝         |
| ... ...                     | ... ...                                     |

> 参阅: [MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Cache-Control)

## [p?] cookie

- { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) }

cookie 请求标头包含先前由服务器通过 set-cookie 标头投放或通过 JavaScript 的 `Document.cookie` 方法设置, 然后存储到客户端的 HTTP cookie.

这个标头是可选的, 且可能会被忽略, 例如在浏览器隐私设置里禁用了 cookie 等.

```text
# 语法
cookie: <cookie-list>
cookie: name=value
cookie: name=value; name2=value2; name3=value3 ...

# 示例
cookie: PHPSESSID=298zf09hf012fh2; csrftoken=u32t4o3tb3gg43; _gat=1
```

| 指令                  | 含义                                                  |
|---------------------|-----------------------------------------------------|
| &lt;cookie-list&gt; | 一系列的名值对, 形式为 <cookie-name>=<cookie-value>, 以分号和空格分隔 |

> 参阅: [MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Cookie)

## [p?] range

- { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) }

Range 请求首部告知服务器返回文件的哪一部分.

在一个 Range 首部中可以一次性请求多个部分, 服务器会以 multipart 文件的形式将其返回.

```text
# 语法
range: <unit>=<range-start>-
range: <unit>=<range-start>-<range-end>
range: <unit>=<range-start>-<range-end>, <range-start>-<range-end>
range: <unit>=<range-start>-<range-end>, <range-start>-<range-end>, <range-start>-<range-end>

# 示例
range: bytes=200-1000, 2000-6576, 19000-
```

| 指令                  | 含义                                      |
|---------------------|-----------------------------------------|
| &lt;unit&gt;        | 数据区间所采用的单位, 通常是字节 (bytes)               |
| &lt;range-start&gt; | 一个整数, 表示在特定单位下范围的起始值                    |
| &lt;range-end&gt;   | 一个整数, 表示在特定单位下范围的结束值. 可选, 默认表示范围一直到文档结束 |

> 参阅: [MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Range)