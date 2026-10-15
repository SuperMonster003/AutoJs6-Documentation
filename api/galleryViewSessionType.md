# 查看器会话 (GalleryViewSession)

GalleryViewSession 是 [gallery.view](gallery#m-view) 返回的查看器会话对象, 是 [EventEmitter](eventEmitterType) 的实例, 连接脚本与 3-Maple Image 插件中正在显示这些图片的查看器: 查看器的打开与翻页以事件形式在脚本线程到达, 脚本可以读取当前页并结束会话.

会话打开期间脚本保持运行, 不需要也不应使用 `sleep` 循环等待; `close` 是唯一的终结事件, 之后不再有事件, 脚本没有其它工作时随即结束. 脚本退出时未关闭的会话自动结束, 查看器保留给用户继续浏览, 不触发事件. 插件同一时间只有一个界面会话, 新的选图, 查看或编辑会以 `replaced` 关闭当前会话并关闭其查看器.

`on` / `once` 返回自身以便链式调用.

```js
let session = gallery.view(['./out/a.jpg', './out/b.jpg', './out/c.jpg']);
session.on('open', e => console.log('共', e.count, '张'))
    .on('page', e => console.log(e.index, e.path))
    .on('close', e => console.log('closed:', e.reason));
```

---

<p style="font: bold 2em sans-serif; color: #FF7043">GalleryViewSession</p>

---

## [@] GalleryViewSession

**`6.8.0`**

会话对象. 不能用 `new` 构造, 只由 [gallery.view](gallery#m-view) 与 [gallery.viewAsync](gallery#m-viewasync) 产生.

## [p#] paths

**`6.8.0`**

- { [string](dataTypes#string)[] }

按页序排列的图片路径 (已按工作目录解析为绝对路径).

## [p#] count

**`6.8.0`**

- { [number](dataTypes#number) }

图片数量.

## [p#] index

**`6.8.0`**

- { [number](dataTypes#number) }

查看器当前显示的页 (从 `0` 开始), 第一个 `page` 事件之前为 `-1`.

## [p#] path

**`6.8.0`**

- { [string](dataTypes#string) | [null](dataTypes#null) }

当前页的路径, 第一个 `page` 事件之前为 `null`.

## [p#] state

**`6.8.0`**

- { `'pending'` \| `'open'` \| `'closed'` }

`open` 事件之前为 `'pending'`, 之后为 `'open'`, 关闭后为 `'closed'`.

## [p#] isOpen

**`6.8.0`**

- { [boolean](dataTypes#boolean) }

查看器是否已显示且会话尚未关闭.

## [p#] isClosed

**`6.8.0`**

- { [boolean](dataTypes#boolean) }

会话是否已关闭 (含脚本退出时的自动结束).

## [p#] reason

**`6.8.0`**

- { [string](dataTypes#string) | [null](dataTypes#null) }

关闭后为 `close` 事件的原因, 之前为 `null`; 脚本退出时的自动结束为 `'script-exit'`.

## [m#] close

### session.close(options?)

**`6.8.0`**

- **[ options ]** {{ finish?: [boolean](dataTypes#boolean) }} - `finish` 默认 `true`
- <ins>**returns**</ins> { [GalleryViewSession](#galleryviewsession) } - 自身

结束会话并关闭查看器, 随后触发 `close` 事件 (原因 `'host'`). `finish` 为 `false` 时只结束会话, 查看器留给用户继续浏览. 重复调用无副作用.

```js
session.close(); // 关闭查看器.
session.close({ finish: false }); // 查看器留给用户.
```

## [m#] on

### session.on(event, listener)

**`6.8.0`**

- **event** { [string](dataTypes#string) } - 事件名
- **listener** { [Function](dataTypes#function) } - 监听器
- <ins>**returns**</ins> { [GalleryViewSession](#galleryviewsession) } - 自身

注册监听器. `once` 形态相同, 只触发一次. 其余成员见 [EventEmitter](eventEmitterType).

## [m#] toString

### session.toString()

**`6.8.0`**

- <ins>**returns**</ins> { [string](dataTypes#string) } - 形如 `GalleryViewSession { count: 3, state: open, index: 1 }`

## 事件 (Events)

| 事件 | 回调参数 | 说明 |
| --- | --- | --- |
| `open` | `({ count })` | 查看器已显示, 只触发一次 |
| `page` | `({ index, path })` | 查看器显示的页变化, 起始页也会触发一次 |
| `error` | `(err: GalleryError)` | 插件报告的错误; 脚本未及时消费事件时的 `LIMIT_EXCEEDED` (随后 `close`) |
| `close` | `({ reason })` | 会话已结束, 不再有事件. 原因: `'user'` (用户离开查看器), `'host'` (脚本调用 `close`), `'replaced'` (新会话替换), `'timeout'` (查看器 60 秒内未显示), `'error'` (插件侧失败或插件进程退出), `'overflow'` (脚本积压的事件超过 512 条或 8 MiB, 之前的事件被丢弃) |

事件对象都是普通 JavaScript 对象, `error` 事件的参数为 [GalleryError](gallery#c-galleryerror). 建议始终注册 `close` 监听器, 以便得知用户何时离开查看器.
