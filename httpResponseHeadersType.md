# HttpResponseHeaders

HttpResponseHeaders 是一个代表 [HTTP 响应头](httpHeaderGlossary#响应标头) 信息的接口.

HTTP 标头字段是大小写 **不敏感** 的 (根据 [RFC 2616](http://www.ietf.org/rfc/rfc2616.txt)), 本章节采用 **全部小写** 的形式表示标头字段 (如 content-type).

> 注: 本章节仅列出部分响应头字段信息, 更多信息可参阅 [HTTP 标头](httpHeaderGlossary#响应标头) 术语章节.

---

<p style="font: bold 2em sans-serif; color: #FF7043">HttpResponseHeaders</p>

---

## [I] HttpResponseHeaders

HttpResponseHeaders 接口类型的变量, 实际是将 [okhttp3.Headers](https://square.github.io/okhttp/3.x/okhttp/index.html?okhttp3/Headers.html) 进行 JavaScript 对象化得到的.

大致过程如下:

```js
function getHeaders() {
    let result = {};

    /** @type {okhttp3.Headers} */
    let headers = res.headers();

    for (let i = 0; i < headers.size(); i += 1) {
        let name = headers.name(i).toLowerCase();
        let value = headers.value(i);
        if (!(name in result)) {
            result[name] = value;
            continue;
        }

        /* 同名的响应头字段, 将新旧数据共同存入数组中. */

        let origin = result[name];
        if (!Array.isArray(origin)) {
            result[name] = [ origin ];
        }
        result[name].push(value);
    }
    return result;
}
```

## [p?] cache-control

- { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) }

标头字段 cache-control 被用于在 HTTP 请求和响应中, 通过指定指令来实现缓存机制.

```text
# 语法
cache-control: must-revalidate
cache-control: no-cache
cache-control: no-store
cache-control: no-transform
cache-control: public
cache-control: private
cache-control: proxy-revalidate
cache-control: max-age=<seconds>
cache-control: s-maxage=<seconds>
... ...
```

| 指令                       | 含义                                                 |
|--------------------------|----------------------------------------------------|
| must-revalidate          | 一旦资源过期, 在成功向原始服务器验证之前, 缓存不能用该资源响应后续请求              |
| no-cache                 | 发布缓存副本前, 强制要求原始服务器进行验证缓存中的请求                       |
| no-store                 | 不使用任何缓存                                            |
| no-transform             | 不得对资源进行转换或转变                                       |
| public                   | 表明响应可以被任何对象 (客户端及代理服务器等) 缓存, 即使是通常不可缓存的内容          |
| private                  | 表明响应只能被单个用户缓存, 不能作为共享缓存                            |
| proxy-revalidate         | 与 must-revalidate 作用相同, 但它仅适用于共享缓存 (如代理), 并被私有缓存忽略 |
| max-age=&lt;seconds&gt;  | 设置缓存存储最大周期, 单位为秒, 超过这个时间缓存被认为过期                    |
| s-maxage=&lt;seconds&gt; | 覆盖 max-age 或 expires 头, 但仅适用于共享缓存, 私有缓存会忽略         |
| ... ...                  | ... ...                                            |

> 参阅: [MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Cache-Control)

## [p?] content-type

- { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) }

标头字段 Content-Type 告诉客户端实际返回内容的内容类型 (如 [MIME 类型](mimeTypeGlossary)).

```text
# 示例
content-type: text/html; charset=utf-8
content-type: multipart/form-data; boundary=something
```

| 指令         | 含义                                 |
|------------|------------------------------------|
| media-type | 资源或数据的 [MIME 类型](mimeTypeGlossary) |
| charset    | 字符编码                               |
| ... ...    | ... ...                            |

> 参阅: [MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Type)

## [p?] content-encoding

- { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) }

标头字段 content-encoding 列出了对当前实体消息 (消息荷载) 应用的编码类型以及编码顺序.

它告知接收者需要以何种顺序解码该实体消息才能获得原始荷载格式.

content-encoding 主要用于在不丢失原媒体类型内容的情况下压缩消息数据.

注意原始媒体内容的类型通过 [content-type](#p-content-type) 首部给出, 而 content-encoding 应用于数据的表示或编码形式. 如果原始媒体以某种方式编码 (如 zip 文件), 则该信息不应该被包含在 content-encoding 首部内.

```text
# 示例
content-encoding: gzip
content-encoding: compress
content-encoding: deflate
content-encoding: br
content-encoding: deflate, gzip
```

| 指令       | 含义                                                    |
|----------|-------------------------------------------------------|
| gzip     | 采用 Lempel-Ziv Coding (LZ77) 压缩算法, 以及 32 位 CRC 校验的编码方式 |
| compress | 采用 Lempel-Ziv-Welch (LZW) 压缩算法                        |
| deflate  | 采用 zlib 结构 (RFC 1950) 和 deflate 压缩算法 (RFC 1951)       |
| br       | 采用 Brotli 算法的编码方式                                     |

> 参阅: [MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Encoding)

## [p?] date

- { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) }

date 是一个通用首部, 其中包含了报文创建的日期和时间.

```text
# 语法
date: <day-name>, <day> <month> <year> <hour>:<minute>:<second> GMT

# 示例
date: Wed, 21 Oct 2015 07:28:00 GMT
```

| 指令               | 含义                                                                                            |
|------------------|-----------------------------------------------------------------------------------------------|
| &lt;day-name&gt; | "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" 之一 (区分大小写)                                    |
| &lt;day&gt;      | 2 位数字表示天数, 例如 "04" 或 "23"                                                                     |
| &lt;month&gt;    | "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" 之一 (区分大小写) |
| &lt;year&gt;     | 4 位数字表示年份, 例如 "1990" 或 "2016"                                                                 |
| &lt;hour&gt;     | 2 位数字表示小时数, 例如 "09" 或 "23"                                                                    |
| &lt;minute&gt;   | 2 位数字表示分钟数, 例如 "04" 或 "59"                                                                    |
| &lt;second&gt;   | 2 位数字表示秒数, 例如 "04" 或 "59"                                                                     |
| GMT              | 格林尼治标准时间. 在 HTTP 协议中, 时间都是用格林尼治标准时间表示, 而非本地时间                                                 |

> 参阅: [MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Date)

## [p?] server

- { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) }

server 首部包含了处理请求的源头服务器所用到的软件相关信息.

```text
# 语法
server: <product>

# 示例
server: Apache/2.4.1 (Unix)
server: nginx/1.16.1
```

| 指令              | 含义             |
|-----------------|----------------|
| &lt;product&gt; | 处理请求的软件或者产品的名称 |

> 参阅: [MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Server)

## [p?] transfer-encoding

- { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) }

transfer-encoding 首部指明实体传递采用的编码形式.

transfer-encoding 仅应用于两个节点之间的消息传递, 而非资源本身. 一个多节点连接的每一段都可应用不同的transfer-encoding 值. 如需将压缩后的数据应用于整个连接, 可使用端到端传输首部 content-encoding.

```text
# 示例
transfer-encoding: chunked
transfer-encoding: compress
transfer-encoding: deflate
transfer-encoding: gzip
transfer-encoding: identity
transfer-encoding: gzip, chunked
```

| 指令               | 含义                                                    |
|------------------|-------------------------------------------------------|
| &lt;chunked&gt;  | 数据以一系列分块的形式进行发送                                       |
| &lt;compress&gt; | 采用 Lempel-Ziv-Welch (LZW) 压缩算法                        |
| &lt;deflate&gt;  | 采用 zlib 结构 (RFC 1950) 和 deflate 压缩算法 (RFC 1951)       |
| &lt;gzip&gt;     | 采用 Lempel-Ziv coding (LZ77) 压缩算法, 以及 32 位 CRC 校验的编码方式 |
| &lt;identity&gt; | 用于指代自身 (如: 未经过压缩和修改). 除非特别指明, 这个标记始终可被接受              |

> 参阅: [MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Transfer-Encoding)

## [p?] expires

- { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) }

expires 响应头包含日期及时间. 指在此时间之后, 响应过期.

若 cache-control 响应头设置了 "max-age" 或 "s-max-age" 指令, 则 expires 头将被忽略.

```text
# 语法
expires: <http-date>

# 示例
expires: Wed, 21 Oct 2015 07:28:00 GMT
```

> 参阅: [MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Expires)

## [p?] last-modified

- { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) }

last-modified 首部包含源头服务器认定的资源做出修改的日期及时间.

它通常被用作一个验证器来判断接收到的或者存储的资源是否彼此一致.

由于精确度比 etag 低, 因此常作为备用, 含 if-modified-since 或 if-unmodified-since 首部的条件请求会使用这个字段.

```text
# 语法
last-modified: <http-date>

# 示例
last-modified: Wed, 21 Oct 2015 07:28:00 GMT
```

> 参阅: [MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Last-Modified)

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

## [p?] etag

- { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) }

etag 响应头是资源特定版本的标识符.

若给定 URL 中的资源更改, 则一定要生成新的 etag 值, 通过比较这些 etag 能快速确定此资源是否变化.

```text
# 语法
etag: W/"<etag_value>"
etag: "<etag_value>"

# 示例
etag: "737060cd8c284d8af7ad3082f209582d"
etag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
etag: W/"0815"
```

| 指令                 | 含义              |
|--------------------|-----------------|
| W/ (可选)            | 表示使用弱验证器        |
| &lt;etag_value&gt; | 实体标签唯一地表示所请求的资源 |

> 参阅: [MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/ETag)

## [p?] refresh

- { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) }

refresh 标头字段指示浏览器重新加载页面或重定向到另一个页面.

```text
# 语法
refresh: <seconds>
refresh: <seconds>;url=<url>

# 示例
refresh: 3
refresh: 3;url=https://www.mozilla.org
```

| 指令              | 含义                   |
|-----------------|----------------------|
| &lt;seconds&gt; | 重载或重定向页面前的等待时间, 单位为秒 |
| &lt;url&gt;     | 重定向页面的 URL           |

> 参阅: [MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/meta#attr-http-equiv)

## [p?] access-control-allow-origin

- { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) }

access-control-allow-origin 响应标头指定了该响应的资源是否被允许与给定的来源 (origin) 共享.

```text
# 语法
access-control-allow-origin: *
access-control-allow-origin: <origin>
access-control-allow-origin: null

# 示例
access-control-allow-origin: *
access-control-allow-origin: https://developer.mozilla.org
```

| 指令             | 含义                                                    |
|----------------|-------------------------------------------------------|
| *              | 对于不包含凭据的请求, 服务器会以 "*" 作为通配符, 从而允许任意来源的请求代码都具有访问资源的权限  |
| &lt;origin&gt; | 指定一个来源 (仅能指定一个). 若服务器支持多个来源的客户端, 其必须以与指定客户端匹配的来源来响应请求 |
| null           | 指定来源为 "null", 不建议被使用                                  |

> 参阅: [MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Allow-Origin)

## [p?] access-control-allow-methods

- { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) }

响应首部 access-control-allow-methods 在对 "预检请求 (Preflight Request)" 的应答中明确了客户端所要访问的资源允许使用的方法或方法列表.

```text
# 语法
access-control-allow-methods: <method>, <method>, ...

# 示例
access-control-allow-methods: POST, GET, OPTIONS
```

| 指令             | 含义                                                                            |
|----------------|-------------------------------------------------------------------------------|
| &lt;method&gt; | 用逗号隔开的允许使用的 [HTTP 请求方法 (HTTP Request Methods)](httpRequestMethodsGlossary) 列表 |

> 参阅: [MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Allow-Methods)

## [p?] access-control-allow-credentials

- { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) }

access-control-allow-credentials 响应头用于在请求要求包含 credentials (Request.credentials 的值为 include) 时, 告知浏览器是否可以将对请求的响应暴露给前端 JavaScript 代码.

```text
# 语法
access-control-allow-credentials: true
```

| 指令   | 含义                                                          |
|------|-------------------------------------------------------------|
| true | 这个头的唯一有效值 (区分大小写). 若不需要 credentials, 可直接忽视这个头, 而不必设置为 false |

> 参阅: [MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials)

## [p?] content-range

- { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) }

content-range 表示一个数据片段在整个文件中的位置.

```text
# 语法
content-range: <unit> <range-start>-<range-end>/<size>
content-range: <unit> <range-start>-<range-end>/*
content-range: <unit> */<size>

# 示例
content-range: bytes 0-5/7877
content-range: bytes 200-1000/67589
content-range: bytes 1000-2000/*
```

| 指令                  | 含义                        |
|---------------------|---------------------------|
| &lt;unit&gt;        | 数据区间所采用的单位, 通常是字节 (bytes) |
| &lt;range-start&gt; | 一个整数, 表示在给定单位下, 区间的起始值    |
| &lt;range-end&gt;   | 一个整数, 表示在给定单位下, 区间的结束值    |
| &lt;size&gt;        | 整个文件的大小 (大小未知可用 "*" 表示)   |

> 参阅: [MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Range)