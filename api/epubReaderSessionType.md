# 阅读器会话 (EpubReaderSession)

EpubReaderSession 是 [epub.read](epub#m-read) 返回的阅读器会话对象, 是 [EventEmitter](eventEmitterType) 的实例, 连接脚本与 Readium EPUB Reader 插件中正在显示这本书的阅读器: 阅读器的打开, 翻页, 跳转, 书签与高亮变化以事件形式在脚本线程到达, 脚本可以跳转, 翻页, 设置阅读偏好, 读取书签并结束会话.

会话打开期间脚本保持运行 (与 [MailWatch](mailClientType#mailwatch) 相同), 不需要也不应使用 `sleep` 循环等待; `close` 是唯一的终结事件, 之后不再有事件, 脚本没有其它工作时随即结束. 脚本退出时未关闭的会话自动结束, 阅读器保留为普通阅读, 不触发事件. 每个插件进程只有一个阅读器会话, 新的 `read` 会替换之前的会话.

控制方法同步执行, 失败时抛出 [EpubError](epub#c-epuberror); 会话关闭后 (以及 `open` 事件之前尚未与阅读器连接时) 失败于 `SESSION_CLOSED` 或 `READER_NOT_VISIBLE`. `on` / `once` 返回自身以便链式调用.

```js
let session = epub.read('./books/moby-dick.epub', { href: 'OPS/chapter_003.xhtml' });
session.on('open', e => console.log(e.title, e.href, e.positions))
    .on('progress', e => console.log((e.totalProgression * 100).toFixed(1) + '%', e.chapterTitle))
    .on('close', e => console.log('closed:', e.reason));
```

---

<p style="font: bold 2em sans-serif; color: #FF7043">EpubReaderSession</p>

---

## [@] EpubReaderSession

**`6.8.0`**

会话对象. 不能用 `new` 构造, 只由 [epub.read](epub#m-read) 与 [epub.readAsync](epub#m-readasync) 产生.

## [p#] path

**`6.8.0`**

- { [string](dataTypes#string) }

打开时解析得到的文件路径.

## [p#] state

**`6.8.0`**

- { `'pending'` \| `'open'` \| `'closed'` }

`open` 事件之前为 `'pending'`, 之后为 `'open'`, 关闭后为 `'closed'`.

## [p#] isOpen

**`6.8.0`**

- { [boolean](dataTypes#boolean) }

阅读器是否已打开且会话尚未关闭.

## [p#] isClosed

**`6.8.0`**

- { [boolean](dataTypes#boolean) }

会话是否已关闭 (含脚本退出时的自动结束).

## [p#] locator

**`6.8.0`**

- { [EpubLocator](epubLocatorType) | [null](dataTypes#null) }

阅读器最近报告的位置 (来自 `open` 或 `progress` 事件), 尚无报告时为 `null`. 可保存后交给下次 [epub.read](epub#m-read) 的 `locator` 选项或 [goTo](#m-goto).

## [p#] progress

**`6.8.0`**

- { [number](dataTypes#number) }

最近报告的全书总进度, 0 到 1; 尚无报告时为 `-1` (`open` 事件的 locator 通常还不含总进度, 首个 `progress` 事件后才有效). 会话关闭后保留最后的值.

## [p#] title

**`6.8.0`**

- { [string](dataTypes#string) | [null](dataTypes#null) }

`open` 事件带来的书名.

## [p#] chapterTitle

**`6.8.0`**

- { [string](dataTypes#string) | [null](dataTypes#null) }

最近 `progress` 事件的章节标题, 阅读器不知道时为 `null`.

## [p#] href

**`6.8.0`**

- { [string](dataTypes#string) | [null](dataTypes#null) }

最近报告的资源 href.

## [p#] positions

**`6.8.0`**

- { [number](dataTypes#number) }

`open` 事件带来的合成位置数 (近似页数), 此前为 `0`.

## [p#] reason

**`6.8.0`**

- { [string](dataTypes#string) | [null](dataTypes#null) }

关闭原因, 未关闭时为 `null`. 取值见 [close 事件](#事件-events).

## [m#] goTo

### session.goTo(target)

**`6.8.0`**

- **target** { [string](dataTypes#string) | [number](dataTypes#number) | [EpubLocator](epubLocatorType) } - 资源 href (可带 `#fragment`), 全书总进度 (0 到 1), 或带 `href` 的 locator 对象 (最大 16 KiB)
- <ins>**returns**</ins> { [EpubReaderSession](#epubreadersession) } - 自身

让阅读器跳转到目标位置, 成功后以 `progress` 事件报告新位置. 参数形态错误抛出 `INVALID_ARGUMENT`; 目标不在书内抛出 `RESOURCE_NOT_FOUND`, 校验通过后仍无法到达的目标以 `error` 事件报告.

```js
session.goTo('OPS/chapter_003.xhtml');
session.goTo(0.5);
session.goTo(session.locator);
```

## [m#] next

### session.next()

**`6.8.0`**

- <ins>**returns**</ins> { [EpubReaderSession](#epubreadersession) } - 自身

翻到下一页 (滚动模式下为下一屏).

## [m#] prev

### session.prev()

**`6.8.0`**

- <ins>**returns**</ins> { [EpubReaderSession](#epubreadersession) } - 自身

翻到上一页.

## [m#] nextChapter

### session.nextChapter()

**`6.8.0`**

- <ins>**returns**</ins> { [EpubReaderSession](#epubreadersession) } - 自身

跳到阅读顺序中的下一个资源开头.

## [m#] prevChapter

### session.prevChapter()

**`6.8.0`**

- <ins>**returns**</ins> { [EpubReaderSession](#epubreadersession) } - 自身

跳到阅读顺序中的上一个资源开头.

## [m#] setPreferences

### session.setPreferences(partial)

**`6.8.0`**

- **partial** { [Object](dataTypes#object) } - 要修改的偏好键值, 见 [阅读偏好](#阅读偏好-preferences); 最大 16 KiB
- <ins>**returns**</ins> { [EpubReaderSession](#epubreadersession) } - 自身

应用部分阅读偏好, 未提及的键保持不变, 值为 `null` 的键恢复阅读器默认. 类型或范围不合法抛出 `INVALID_ARGUMENT`, 不做截断; 未知的键不导致失败, 已知的部分照常应用, 未知的键名以一个 `code` 为 `UNSUPPORTED_PREFERENCE` 的 `error` 事件报告. 应用后的偏好成为阅读器的全局默认, 会话结束后仍然有效.

```js
session.setPreferences({ theme: 'dark', fontSize: 1.3, scroll: true });
```

## [m#] bookmarks

### session.bookmarks()

**`6.8.0`**

- <ins>**returns**</ins> {{ locator: [EpubLocator](epubLocatorType); createdAt: [number](dataTypes#number); title?: [string](dataTypes#string); text?: [string](dataTypes#string) }}[] - 书签列表

阅读器为这本书保存的书签 (最多 500 条), `createdAt` 为 UTC 毫秒, `title` (章节) 与 `text` (摘录) 在阅读器未记录时缺失. 书签的增删由 `bookmark` 事件通知.

## [m#] close

### session.close(options?)

**`6.8.0`**

- **[ options ]** {{ finish?: [boolean](dataTypes#boolean) }} - `finish` 默认 `false`
- <ins>**returns**</ins> { [EpubReaderSession](#epubreadersession) } - 自身

结束会话, 随后触发 `close` 事件 (原因 `'host'`). 默认只结束会话, 阅读器 Activity 留给用户继续普通阅读 (进度照常记录); `finish` 为 `true` 时同时关闭阅读器. 重复调用无副作用.

```js
session.close(); // 阅读器留给用户.
session.close({ finish: true }); // 同时关闭阅读器.
```

## [m#] on

### session.on(event, listener)

**`6.8.0`**

- **event** { [string](dataTypes#string) } - 事件名
- **listener** { [Function](dataTypes#function) } - 监听器
- <ins>**returns**</ins> { [EpubReaderSession](#epubreadersession) } - 自身

注册监听器. `once` 形态相同, 只触发一次. 其余成员见 [EventEmitter](eventEmitterType).

## [m#] toString

### session.toString()

**`6.8.0`**

- <ins>**returns**</ins> { [string](dataTypes#string) } - 形如 `EpubReaderSession { path: ..., state: open, href: OPS/chapter_003.xhtml, progress: 0.25 }`

## 事件 (Events)

| 事件 | 回调参数 | 说明 |
| --- | --- | --- |
| `open` | `({ locator, title, href, positions })` | 阅读器可见并显示了起始位置, 只触发一次. `title` 为书名, `positions` 为合成位置数 |
| `progress` | `({ locator, totalProgression, chapterTitle, href })` | 位置变化 (翻页, 跳转, 滚动), 节流 500 毫秒并在停止后补发最后一次. `chapterTitle` 未知时为 `null` |
| `bookmark` | `({ action, locator, createdAt, title, text })` | 用户在阅读器中添加 (`action` 为 `'added'`) 或删除 (`'removed'`) 书签 |
| `highlight` | `({ action, id, style, color, note, quote, title, locator, createdAt, updatedAt })` | 用户在阅读器中添加 (`action` 为 `'added'`), 编辑 (`'updated'`) 或删除 (`'removed'`) 高亮或笔记 (Readium EPUB Reader 插件 1.1.0 起, 需要携带 EPUB 契约版本 2 的 AutoJs6 构建); 字段同 [EpubBook#annotations](epubBookType#m-annotations), 无笔记时 `note` 为 `null` |
| `error` | `(err: EpubError)` | 非致命错误, 会话继续: 未知的偏好键 (`UNSUPPORTED_PREFERENCE`), 校验通过后无法到达的跳转目标 (`RESOURCE_NOT_FOUND`, `INTERNAL`); 脚本未及时消费事件时的 `LIMIT_EXCEEDED` (随后 `close`) |
| `close` | `({ reason })` | 会话已结束, 不再有事件. 原因: `'user'` (用户离开阅读器), `'host'` (脚本调用 `close`), `'replaced'` (新会话替换), `'timeout'` (阅读器 60 秒内未显示), `'error'` (插件侧失败), `'overflow'` (脚本积压的事件超过 512 条或 8 MiB, 之前的事件被丢弃) |

事件对象都是普通 JavaScript 对象, 其中的 `locator` 为 [EpubLocator](epubLocatorType). 建议始终注册 `error` 与 `close` 监听器, 否则会话因错误结束时脚本无从得知.

## 阅读偏好 (Preferences)

[epub.read](epub#m-read) 的 `preferences` 选项与 [setPreferences](#m-setpreferences) 接受以下键, 每个键都可省略:

| 键 | 类型 | 取值 |
| --- | --- | --- |
| `fontSize` | number | 0.5 到 3.0, 相对字号倍数 |
| `fontFamily` | string | 字体名, 最长 120 个字符, 不含控制字符; 阅读器已导入的字体可按名称使用 |
| `lineHeight` | number | 1.0 到 2.0 |
| `pageMargins` | number | 0.0 到 4.0 |
| `theme` | string | `'light'`, `'sepia'` 或 `'dark'` |
| `scroll` | boolean | `true` 为滚动模式, `false` 为分页模式 |
| `columnCount` | string | `'auto'`, `'1'` 或 `'2'` |
| `verticalText` | boolean | 是否强制竖排 |
| `textAlign` | string | `'start'`, `'end'`, `'left'`, `'right'`, `'justify'` 或 `'center'` |
| `hyphens` | boolean | 是否连字符断词 |
| `publisherStyles` | boolean | 是否保留出版商样式; 设置 `lineHeight`, `textAlign` 或 `hyphens` 时若未同时指定, 会被关闭 |

```js
let session = epub.read('./books/moby-dick.epub', {
    preferences: { theme: 'sepia', fontSize: 1.2, lineHeight: 1.5, publisherStyles: false },
});
```
