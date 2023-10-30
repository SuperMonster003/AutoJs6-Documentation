# WebSocket

---

<p style="font: italic 1em sans-serif; color: #78909C">此章节待补充或完善...</p>
<p style="font: italic 1em sans-serif; color: #78909C">Marked by SuperMonster003 on Oct 30, 2023.</p>

---

WebSocket 类主要用于构建一个 [OkHttp3 WebSocket](https://square.github.io/okhttp/4.x/okhttp/okhttp3/-web-socket/) 接口实现类的实例, 以便完成基于 [WebSocket 协议](https://zh.wikipedia.org/wiki/WebSocket) 的网络请求.

> 注: WebSocket 不同于 Socket.  
> WebSocket 是应用层的网络传输协议. 而 Socket 并非协议, 是位于应用层和传输控制层之间的一组接口, 是对 TCP/IP 协议的封装.
 
一个流程相对完备的 WebSocket 示例:

```js
console.setExitOnClose(7e3).show();

let ws = new WebSocket('wss://echo.websocket.events');

ws
    .on(WebSocket.EVENT_OPEN, (res, ws) => {
        console.log('WebSocket 已连接');
    })
    .on(WebSocket.EVENT_MESSAGE, (message, ws) => {
        console.log('接收到消息');
        // if (message instanceof okio.ByteString) {
        //     console.log(`消息类型: ByteString`);
        // } else if (typeof message === 'string') {
        //     console.log(`消息类型: String`);
        // } else {
        //     throw TypeError('Should never happen');
        // }
    })
    .on(WebSocket.EVENT_TEXT, (text, ws) => {
        console.info('接收到文本消息:');
        console.info(`text: ${text}`);
    })
    .on(WebSocket.EVENT_BYTES, (bytes, ws) => {
        console.info('接收到字节数组消息:');
        console.info(`utf8: ${bytes.utf8()}`);
        console.info(`base64: ${bytes.base64()}`);
        console.info(`md5: ${bytes.md5()}`);
        console.info(`hex: ${bytes.hex()}`);
    })
    .on(WebSocket.EVENT_CLOSING, (code, reason, ws) => {
        console.log('WebSocket 关闭中');
    })
    .on(WebSocket.EVENT_CLOSED, (code, reason, ws) => {
        console.log('WebSocket 已关闭');
        console.log(`code: ${code}`);
        if (reason) console.log(`reason: ${reason}`);
    })
    .on(WebSocket.EVENT_FAILURE, (err, res, ws) => {
        console.error('WebSocket 连接失败');
        console.error(err);
    });

/* 发送文本消息. */
ws.send('Hello WebSocket');

/* 发送字节数组消息. */
ws.send(new okio.ByteString(new java.lang.String('Hello WebSocket').getBytes()));

setTimeout(() => {
    console.log('断开 WebSocket');
    ws.close('由用户断开连接');
}, 8e3);
```

---

<p style="font: bold 2em sans-serif; color: #FF7043">WebSocket</p>

---

## [C] WebSocket

- <ins>**extends**</ins> { [EventEmitter](eventEmitterType) }

WebSocket 类继承自 [EventEmitter](eventEmitterType) 类.

因此 WebSocket 实例拥有继承而来的 [on](eventEmitterType#m-on), [once](eventEmitterType#m-once), [emit](eventEmitterType#m-emit), [eventNames](eventEmitterType#m-eventnames), [addListener](eventEmitterType#m-addlistener), [removeListener](eventEmitterType#m-removelistener) 等方法, 详情参阅 [事件发射器 (EventEmitter)](eventEmitterType) 章节.

> 注:   
> 特别地, on 和 once 方法在子类进行了 `覆写 (override)`, 其返回值类型被具体化为 WebSocket, 以便于链式调用.  
> 为节约篇幅, 本章节仅列举了 on 方法的相关文档, once 方法与 on 的用法相同.

### [c] (url)

**`6.3.4`** **`Global`**

- **url** { [string](dataTypes#string) } - 请求的 URL 地址
- <ins>**returns**</ins> { [WebSocket](webSocketType) }

构建一个 [WebSocket](webSocketType) 实例.

> 注: 构建实例时, 已经隐含客户端建立连接的过程.

以下示例建立一个 WebSocket 连接, 并在 5 秒钟后主动断开连接.

```js
let ws = new WebSocket('wss://echo.websocket.events');
setTimeout(() => {
    console.log('断开 WebSocket');
    ws.close(WebSocket.CODE_CLOSE_NORMAL, 'Closed by user');
}, 5e3);
```

## [m] send

### send(text)

**`Overload 1/2`**

Attempts to enqueue text to be UTF-8 encoded and sent as a the data of a text (type 0x1) message.
This method returns true if the message was enqueued. Messages that would overflow the outgoing message buffer will be rejected and trigger a graceful shutdown of this web socket. This method returns false in that case, and in any other case where this web socket is closing, closed, or canceled.
This method returns immediately.

```js
let ws = new WebSocket('wss://echo.websocket.events');
ws.send('Hello WebSocket');
ws.exitOnClose();
```

### send(bytes)

**`Overload 2/2`**

Attempts to enqueue bytes to be sent as a the data of a binary (type 0x2) message.
This method returns true if the message was enqueued. Messages that would overflow the outgoing message buffer (16 MiB) will be rejected and trigger a graceful shutdown of this web socket. This method returns false in that case, and in any other case where this web socket is closing, closed, or canceled.
This method returns immediately.

```js
let ws = new WebSocket('wss://echo.websocket.events');
ws.send(new okio.ByteString(new java.lang.String('Hello WebSocket').getBytes()));
ws.exitOnClose();
```

## [m] close

### close(code?, reason?)

**`Overload [1-3]/4`**

- **[ code = `WebSocket.CODE_CLOSE_NORMAL [1000]` ]** { [number](dataTypes#number) } - 状态码
- **[ reason = `null` ]** { [string](dataTypes#string) } - 连接关闭原因
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 优雅关闭是否已经启动

尝试启动 WebSocket 优雅关闭, 此时已排队的报文将在 WebSocket 断开前被传送.

> 注: 相对应地, [cancel](#m-cancel) 则会立即释放资源, 而丢弃所有排队的报文.

如果调用 `close` 时启动了优雅关闭, 返回 true.  
如果调用 `close` 时, 优雅关闭已经启动, 或 WebSocket 已关闭或取消, 返回 false.

参数 `code` 可选, 代表状态码, 通过状态码可以获取或判断连接关闭的原因. 其范围为 `[1000..5000)`.

参数 `reason` 可选, 代表关闭原因, 方便用户直接通过阅读字符串获取连接关闭的原因.

以下调用方式均被支持 (其中 `ws` 代表一个 WebSocket 实例):

```js
ws.close(); /* 默认状态码, 无具体关闭原因. */
ws.close(WebSocket.CODE_CLOSE_NORMAL); /* 指定状态码, 无具体关闭原因. */
ws.close(WebSocket.CODE_CLOSE_NORMAL, '用户正常关闭'); /* 指定状态码, 指定具体关闭原因. */
```

### close(reason)

**`Overload 4/4`**

- **reason** { [string](dataTypes#string) } - 连接关闭原因
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 优雅关闭是否已经启动

相当于 `close(WebSocket.CODE_CLOSE_NORMAL, reason)`.

## [m] exitOnClose

### exitOnClose()

**`Overload 1/2`**

... ...

### exitOnClose(timeout)

**`Overload 2/2`**

... ...

## [m] cancel

### cancel()

- <ins>**returns**</ins> { [void](dataTypes#void) }

立即强制释放该 WebSocket 所占用的资源, 并丢弃所有排队的报文.

> 注: 相对应地, [close](#m-close) 则会在释放资源之前将排队的报文完成传送.

## [m] queueSize

### queueSize()

- <ins>**returns**</ins> { [number](dataTypes#number) }

Returns the size in bytes of all messages enqueued to be transmitted to the server. This doesn't include framing overhead. If compression is enabled, uncompressed messages size is used to calculate this value. It also doesn't include any bytes buffered by the operating system or network intermediaries. This method returns 0 if no messages are waiting in the queue. If may return a nonzero value after the web socket has been canceled; this indicates that enqueued messages were not transmitted.

## [m] on

### on(eventName, callback)

- **eventName** { [string](dataTypes#string) } - 最大连接重建次数
- **callback** { [(](dataTypes#function)args: [...](documentation#可变参数)[any](dataTypes#any)[[]](documentation#可变参数)[)](dataTypes#function) [=>](dataTypes#function) [any](dataTypes#any) } - 事件监听回调参数
- <ins>**returns**</ins> { [WebSocket](webSocketType) }

注册一个 WebSocket 相关的事件监听器, 当事件名称与 `eventName` 参数一致时, 触发执行回调函数 `callback`.

... ...

不同事件名称, 其对应监听回调函数的参数也不同 (给出具体对应的在 [p] 文档内).

... ...

## [m] rebuild

### rebuild(maxRebuildTimes?)

**`Overload [1-2]/2`**

- **maxRebuildTimes** { [number](dataTypes#number) } - 最大连接重建次数
- <ins>**returns**</ins> { [void](dataTypes#void) }

... ...

## [m] request

### request()

- <ins>**returns**</ins> { [Okhttp3Request](okhttp3RequestType) }

Returns the original request that initiated this web socket.

## [p] EVENT_OPEN

**`6.3.4`** **`CONSTANT`**

- [ `open` ] { [string](dataTypes#string) }

WebSocket 事件名称常量.

- 事件触发: 远程对等端接受网络套接字, 并且可以开始信息传输.
- 事件监听: [WebSocket#on](#m-on)

```js
let ws = new WebSocket('wss://echo.websocket.events');
ws.on(WebSocket.EVENT_OPEN, (res, ws) => console.log('WebSocket 已连接'));
ws.exitOnClose();
```

## [p] EVENT_MESSAGE

**`6.3.4`** **`CONSTANT`**

- [ `message` ] { [string](dataTypes#string) }

WebSocket 事件名称常量, 用于 xxx 事件.

Invoked when a text (type 0x1) message has been received.

## [p] EVENT_TEXT

**`6.3.4`** **`CONSTANT`**

- [ `text` ] { [string](dataTypes#string) }

WebSocket 事件名称常量, 用于 xxx 事件.

Invoked when a text (type 0x1) message has been received.

## [p] EVENT_BYTES

**`6.3.4`** **`CONSTANT`**

- [ `bytes` ] { [string](dataTypes#string) }

WebSocket 事件名称常量, 用于 xxx 事件.

Invoked when a text (type 0x1) message has been received.

## [p] EVENT_CLOSING

**`6.3.4`** **`CONSTANT`**

- [ `closing` ] { [string](dataTypes#string) }

WebSocket 事件名称常量, 用于 xxx 事件.

Invoked when the remote peer has indicated that no more incoming messages will be transmitted.

## [p] EVENT_CLOSED

**`6.3.4`** **`CONSTANT`**

- [ `closed` ] { [string](dataTypes#string) }

WebSocket 事件名称常量, 用于 xxx 事件.

Invoked when both peers have indicated that no more messages will be transmitted and the connection has been successfully released. No further calls to this listener will be made.

## [p] EVENT_FAILURE

**`6.3.4`** **`CONSTANT`**

- [ `failure` ] { [string](dataTypes#string) }

WebSocket 事件名称常量, 用于 xxx 事件.

Invoked when a web socket has been closed due to an error reading from or writing to the network. Both outgoing and incoming messages may have been lost. No further calls to this listener will be made.

## [p] EVENT_MAX_REBUILDS

**`6.3.4`** **`CONSTANT`**

- [ `max_rebuilds` ] { [string](dataTypes#string) }

WebSocket 事件名称常量, 用于 xxx 事件.

## [p] CODE_CLOSE_NORMAL

**`6.3.4`** **`CONSTANT`**

- [ `1000` ] { [number](dataTypes#number) }

WebSocket 状态码, 表示成功操作或常规的 Socket 关闭操作.

## [p] CODE_CLOSE_GOING_AWAY

**`6.3.4`** **`CONSTANT`**

- [ `1001` ] { [number](dataTypes#number) }

WebSocket 状态码, 表示终端正在处于移除状态, 服务端或客户端即将不可用.

## [p] CODE_CLOSE_PROTOCOL_ERROR

**`6.3.4`** **`CONSTANT`**

- [ `1002` ] { [number](dataTypes#number) }

WebSocket 状态码, 表示终端因协议错误或无效帧而即将终止连接.

## [p] CODE_CLOSE_UNSUPPORTED

**`6.3.4`** **`CONSTANT`**

- [ `1003` ] { [number](dataTypes#number) }

WebSocket 状态码, 表示终端因帧数据类型不支持而即将终止连接.

## [p] CODE_CLOSED_NO_STATUS

**`6.3.4`** **`CONSTANT`**

- [ `1005` ] { [number](dataTypes#number) }

WebSocket 状态码, 表示不包含错误原因, 仅代表已经关闭的状态.

## [p] CODE_CLOSE_ABNORMAL

**`6.3.4`** **`CONSTANT`**

- [ `1006` ] { [number](dataTypes#number) }

WebSocket 状态码, 表示异常关闭 (如浏览器关闭).

## [p] CODE_UNSUPPORTED_PAYLOAD

**`6.3.4`** **`CONSTANT`**

- [ `1007` ] { [number](dataTypes#number) }

WebSocket 状态码, 表示终端接收到不一致的报文 (如异常格式的 UTF-8).

## [p] CODE_POLICY_VIOLATION

**`6.3.4`** **`CONSTANT`**

- [ `1008` ] { [number](dataTypes#number) }

WebSocket 状态码, 表示终端因收到了违反其策略的报文而即将终止连接.

## [p] CODE_CLOSE_TOO_LARGE

**`6.3.4`** **`CONSTANT`**

- [ `1009` ] { [number](dataTypes#number) }

WebSocket 状态码, 表示终端因无法处理长度过大的报文而即将终止连接.

## [p] CODE_MANDATORY_EXTENSION

**`6.3.4`** **`CONSTANT`**

- [ `1010` ] { [number](dataTypes#number) }

WebSocket 状态码, 表示终端因期望与服务端进行扩展协商而即将终止连接.

## [p] CODE_SERVER_ERROR

**`6.3.4`** **`CONSTANT`**

- [ `1011` ] { [number](dataTypes#number) }

WebSocket 状态码, 表示服务端因发生内部错误而即将终止连接.

## [p] CODE_SERVICE_RESTART

**`6.3.4`** **`CONSTANT`**

- [ `1012` ] { [number](dataTypes#number) }

WebSocket 状态码, 表示服务端正在重启过程中.

## [p] CODE_TRY_AGAIN_LATER

**`6.3.4`** **`CONSTANT`**

- [ `1013` ] { [number](dataTypes#number) }

WebSocket 状态码, 表示服务端临时拒绝了终端请求.

## [p] CODE_BAD_GATEWAY

**`6.3.4`** **`CONSTANT`**

- [ `1014` ] { [number](dataTypes#number) }

WebSocket 状态码, 表示网关服务器接收到无效的请求.

## [p] CODE_TLS_HANDSHAKE_FAIL

**`6.3.4`** **`CONSTANT`**

- [ `1015` ] { [number](dataTypes#number) }

WebSocket 状态码, 表示 TLS 握手失败 (如服务端证书未通过验证等).
