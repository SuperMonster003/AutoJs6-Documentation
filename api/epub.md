# 电子书 (EPUB)

`epub` 模块用于在脚本中读取 EPUB 电子书的元数据, 目录, 正文与封面, 导出书内资源, 进行全文搜索, 以及打开阅读器并接收阅读事件.

从 AutoJs6 6.8.0 起, EPUB 功能由外置 Readium EPUB Reader 插件 (AutoJs6-Plugin-Readium-EPUB-Reader) 提供. 调用前需在插件中心安装并启用与当前 AutoJs6 兼容的插件. 插件缺失, 被禁用或版本不兼容时, 方法会抛出 (或以 Promise 拒绝) `code` 为 `PLUGIN_UNAVAILABLE`, `PLUGIN_DISABLED` 或 `PLUGIN_INCOMPATIBLE` 的 [EpubError](#c-epuberror), 其消息以插件中心的本地化提示开头. [epub.isAvailable](#m-isavailable) 可预先探测.

书籍以文件路径指定, 相对路径按脚本工作目录解析 (与 [files.path](files#m-path) 相同), 不接受 `content://` 等 URI. [epub.open](#m-open) 返回 [EpubBook](epubBookType) 对象, 书籍在插件进程中保持打开直到 `close()` 或脚本退出; 便捷层方法 ([metadata](#m-metadata), [toc](#m-toc), [readingOrder](#m-readingorder), [text](#m-text), [cover](#m-cover), [search](#m-search)) 每次调用自行打开并关闭书籍, 适合一次性读取. [epub.read](#m-read) 打开插件的阅读器并返回 [EpubReaderSession](epubReaderSessionType), 阅读事件在脚本线程到达.

每个方法都有同步形态 `x(...)` 与异步形态 `xAsync(...)`, 二者参数与结果完全一致. 同步形态阻塞当前脚本线程直至插件返回结果或调用失败, 停止脚本会取消尚未完成的调用; 异步形态立即返回 [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise), 回调在脚本线程执行. 传给插件的参数会像 `JSON.stringify` 一样序列化, 函数与 `undefined` 值被忽略, 未知的选项键在此处以 `INVALID_ARGUMENT` 拒绝.

本模块注册为全局名称 `epub`, 并提供 `$epub` 别名.

```js
let book = epub.open('/sdcard/Books/moby-dick.epub');
console.log(book.metadata.title, book.metadata.authors.join(', '));
book.toc.forEach(e => console.log(e.title, e.href));
console.log(book.text(0, { maxChars: 500 }));
book.close();
```

---

<p style="font: bold 2em sans-serif; color: #FF7043">epub</p>

---

## [m] open

### epub.open(path)

**`6.8.0`** **`Overload 1/2`**

- **path** { [string](dataTypes#string) } - EPUB 文件路径
- <ins>**returns**</ins> { [EpubBook](epubBookType) } - 已打开的书籍

在插件进程中打开书籍并返回 [EpubBook](epubBookType). 书籍保持打开直到 [close](epubBookType#m-close) 被调用或脚本退出 (脚本退出时自动关闭). 每个插件进程最多同时打开 8 本书, 超出时抛出 `LIMIT_EXCEEDED`; 一本书超过 5 分钟没有任何调用会被插件关闭, 之后的方法调用失败于 `SESSION_CLOSED`.

打开失败的常见代码: `FILE_NOT_FOUND`, `FILE_UNREADABLE`, `NOT_EPUB` (扩展名与 ZIP 签名都不匹配, 或容器内没有 EPUB 包), `PARSE_FAILED`, `ENCRYPTED` (LCP 等 DRM 保护的出版物), `TIMEOUT` (打开超过 30 秒).

```js
let book = epub.open('./books/moby-dick.epub');
console.log(book.metadata.title);
book.close();
```

### epub.open(options)

**`6.8.0`** **`Overload 2/2`**

- **options** {{
    - path: [string](dataTypes#string);
    - displayName?: [string](dataTypes#string);
- }} - 打开选项
- <ins>**returns**</ins> { [EpubBook](epubBookType) } - 已打开的书籍

以选项对象打开书籍. `displayName` 是插件用于显示的书名 (默认为文件名), 例如阅读器标题栏在出版物没有标题时的回退. 便捷层方法与 [read](#m-read) 的 `path` 参数同样接受此对象.

```js
let book = epub.open({ path: './books/moby-dick.epub', displayName: '白鲸' });
```

## [m] openAsync

### epub.openAsync(path)

**`6.8.0`** **`Async`** **`Overload 1/2`**

- **path** { [string](dataTypes#string) } - EPUB 文件路径
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[EpubBook](epubBookType)&gt; }

### epub.openAsync(options)

**`6.8.0`** **`Async`** **`Overload 2/2`**

- **options** {{ path: [string](dataTypes#string); displayName?: [string](dataTypes#string) }} - 打开选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[EpubBook](epubBookType)&gt; }

```js
epub.openAsync('./books/moby-dick.epub').then((book) => {
    console.log(book.positions);
    book.close();
}).catch(e => console.error(e.toString()));
```

## [m] metadata

### epub.metadata(path)

**`6.8.0`**

- **path** { [string](dataTypes#string) | {{ path: [string](dataTypes#string); displayName?: [string](dataTypes#string) }} } - 文件路径或打开选项
- <ins>**returns**</ins> { [Object](dataTypes#object) } - 元数据对象

打开书籍, 读取元数据后关闭. 返回对象的字段见 [EpubBook#metadata](epubBookType#p-metadata).

```js
let meta = epub.metadata('./books/moby-dick.epub');
console.log(meta.title, meta.language, meta.positions);
```

## [m] metadataAsync

### epub.metadataAsync(path)

**`6.8.0`** **`Async`**

- **path** { [string](dataTypes#string) | {{ path: [string](dataTypes#string); displayName?: [string](dataTypes#string) }} } - 文件路径或打开选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](dataTypes#object)&gt; }

## [m] toc

### epub.toc(path)

**`6.8.0`**

- **path** { [string](dataTypes#string) | {{ path: [string](dataTypes#string); displayName?: [string](dataTypes#string) }} } - 文件路径或打开选项
- <ins>**returns**</ins> { [Object](dataTypes#object)[] } - 目录树

打开书籍, 读取目录后关闭. 目录是 `{ title, href, children }` 节点组成的树, 见 [EpubBook#toc](epubBookType#p-toc).

```js
function print(entries, depth) {
    entries.forEach((e) => {
        console.log('  '.repeat(depth) + e.title, e.href);
        print(e.children, depth + 1);
    });
}
print(epub.toc('./books/moby-dick.epub'), 0);
```

## [m] tocAsync

### epub.tocAsync(path)

**`6.8.0`** **`Async`**

- **path** { [string](dataTypes#string) | {{ path: [string](dataTypes#string); displayName?: [string](dataTypes#string) }} } - 文件路径或打开选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](dataTypes#object)[]&gt; }

## [m] readingOrder

### epub.readingOrder(path)

**`6.8.0`**

- **path** { [string](dataTypes#string) | {{ path: [string](dataTypes#string); displayName?: [string](dataTypes#string) }} } - 文件路径或打开选项
- <ins>**returns**</ins> { [Object](dataTypes#object)[] } - 阅读顺序

打开书籍, 读取阅读顺序 (spine) 后关闭. 每项为 `{ href, type, title? }`, 见 [EpubBook#readingOrder](epubBookType#p-readingorder).

## [m] readingOrderAsync

### epub.readingOrderAsync(path)

**`6.8.0`** **`Async`**

- **path** { [string](dataTypes#string) | {{ path: [string](dataTypes#string); displayName?: [string](dataTypes#string) }} } - 文件路径或打开选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](dataTypes#object)[]&gt; }

## [m] text

### epub.text(path, target?, options?)

**`6.8.0`**

- **path** { [string](dataTypes#string) | {{ path: [string](dataTypes#string); displayName?: [string](dataTypes#string) }} } - 文件路径或打开选项
- **[ target ]** { [string](dataTypes#string) | [number](dataTypes#number) | {{ href: [string](dataTypes#string) }} } - 资源 href, 阅读顺序索引, 或带 `href` 的对象 (目录项, 阅读顺序项或 [EpubLocator](epubLocatorType)); 省略时为全书
- **[ options ]** {{
    - offset?: [number](dataTypes#number);
    - maxChars?: [number](dataTypes#number);
    - format?: `'text'` \| `'markdown'`;
- }} - 提取选项
- <ins>**returns**</ins> { [string](dataTypes#string) } - 文本

打开书籍, 提取文本后关闭. 参数与结果同 [EpubBook#text](epubBookType#m-text).

```js
let first = epub.text('./books/moby-dick.epub', 0, { maxChars: 2000 });
let whole = epub.text('./books/moby-dick.epub');
```

## [m] textAsync

### epub.textAsync(path, target?, options?)

**`6.8.0`** **`Async`**

- **path** { [string](dataTypes#string) | {{ path: [string](dataTypes#string); displayName?: [string](dataTypes#string) }} } - 文件路径或打开选项
- **[ target ]** { [string](dataTypes#string) | [number](dataTypes#number) | {{ href: [string](dataTypes#string) }} } - 提取目标
- **[ options ]** {{ offset?: [number](dataTypes#number); maxChars?: [number](dataTypes#number); format?: `'text'` \| `'markdown'` }} - 提取选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[string](dataTypes#string)&gt; }

## [m] cover

### epub.cover(path)

**`6.8.0`** **`Overload 1/2`**

- **path** { [string](dataTypes#string) | {{ path: [string](dataTypes#string); displayName?: [string](dataTypes#string) }} } - 文件路径或打开选项
- <ins>**returns**</ins> { [ImageWrapper](imageWrapperType) } - 封面图像

打开书籍, 解码封面后关闭. 书籍没有封面资源时抛出 `RESOURCE_NOT_FOUND`, 封面无法解码时抛出 `PARSE_FAILED`. 返回的图像使用完毕后应调用其 `recycle()`.

```js
let cover = epub.cover('./books/moby-dick.epub');
console.log(cover.getWidth(), cover.getHeight());
cover.recycle();
```

### epub.cover(path, outputPath, options?)

**`6.8.0`** **`Overload 2/2`**

- **path** { [string](dataTypes#string) | {{ path: [string](dataTypes#string); displayName?: [string](dataTypes#string) }} } - 文件路径或打开选项
- **outputPath** { [string](dataTypes#string) } - 输出文件路径, 或已存在的目录 (以封面资源自身的文件名保存)
- **[ options ]** {{ overwrite?: [boolean](dataTypes#boolean) }} - `overwrite` 默认 `false`, 目标文件已存在时抛出 `INVALID_ARGUMENT`
- <ins>**returns**</ins> { [string](dataTypes#string) } - 已保存的文件路径

打开书籍, 把封面资源原样保存到 `outputPath` 后关闭. 输出路径同样按脚本工作目录解析.

```js
let saved = epub.cover('./books/moby-dick.epub', './covers', { overwrite: true });
console.log(saved); // ./covers/cover.jpg
```

## [m] coverAsync

### epub.coverAsync(path)

**`6.8.0`** **`Async`** **`Overload 1/2`**

- **path** { [string](dataTypes#string) | {{ path: [string](dataTypes#string); displayName?: [string](dataTypes#string) }} } - 文件路径或打开选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[ImageWrapper](imageWrapperType)&gt; }

### epub.coverAsync(path, outputPath, options?)

**`6.8.0`** **`Async`** **`Overload 2/2`**

- **path** { [string](dataTypes#string) | {{ path: [string](dataTypes#string); displayName?: [string](dataTypes#string) }} } - 文件路径或打开选项
- **outputPath** { [string](dataTypes#string) } - 输出文件路径或目录
- **[ options ]** {{ overwrite?: [boolean](dataTypes#boolean) }} - 导出选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[string](dataTypes#string)&gt; }

## [m] search

### epub.search(path, query, options?)

**`6.8.0`**

- **path** { [string](dataTypes#string) | {{ path: [string](dataTypes#string); displayName?: [string](dataTypes#string) }} } - 文件路径或打开选项
- **query** { [string](dataTypes#string) } - 搜索词
- **[ options ]** {{ offset?: [number](dataTypes#number); limit?: [number](dataTypes#number) }} - 分页选项
- <ins>**returns**</ins> { [Object](dataTypes#object)[] } - 命中列表

打开书籍, 全文搜索后关闭. 参数与结果同 [EpubBook#search](epubBookType#m-search).

```js
epub.search('./books/moby-dick.epub', 'whale', { limit: 5 })
    .forEach(hit => console.log(hit.title, hit.text.before + '[' + hit.text.highlight + ']' + hit.text.after));
```

## [m] searchAsync

### epub.searchAsync(path, query, options?)

**`6.8.0`** **`Async`**

- **path** { [string](dataTypes#string) | {{ path: [string](dataTypes#string); displayName?: [string](dataTypes#string) }} } - 文件路径或打开选项
- **query** { [string](dataTypes#string) } - 搜索词
- **[ options ]** {{ offset?: [number](dataTypes#number); limit?: [number](dataTypes#number) }} - 分页选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](dataTypes#object)[]&gt; }

## [m] read

### epub.read(path, options?)

**`6.8.0`**

- **path** { [string](dataTypes#string) | {{ path: [string](dataTypes#string); displayName?: [string](dataTypes#string) }} } - 文件路径或打开选项
- **[ options ]** {{
    - href?: [string](dataTypes#string);
    - progression?: [number](dataTypes#number);
    - locator?: [EpubLocator](epubLocatorType);
    - preferences?: [Object](dataTypes#object);
- }} - 起始位置与阅读偏好
- <ins>**returns**</ins> { [EpubReaderSession](epubReaderSessionType) } - 阅读器会话

在插件进程中建立阅读器会话并启动插件的阅读器 Activity, 立即返回 [EpubReaderSession](epubReaderSessionType). 阅读器可见后触发 `open` 事件, 之后翻页, 跳转与书签变化以事件形式在脚本线程到达; 会话打开期间脚本保持运行, 直到 `close` 事件 (用户关闭阅读器, 脚本调用 `close()`, 会话被替换或超时). 起始位置最多指定一项: `href` (可带 `#fragment`), 总进度 `progression` (0 到 1) 或此前从事件或搜索得到的 `locator`; 省略时从上次阅读位置继续. `preferences` 为 [阅读偏好](epubReaderSessionType#阅读偏好-preferences) 的子集, 应用后成为阅读器的全局默认.

阅读器 Activity 由 AutoJs6 启动, 受系统对后台应用启动 Activity 的限制; 在 AutoJs6 界面可见时运行脚本可确保启动成功. 阅读器 60 秒内未能显示时会话以 `timeout` 关闭. 每个插件进程只有一个阅读器会话, 新的 `read` 会以 `replaced` 关闭之前的会话并结束其阅读器. 脚本退出时会话结束但阅读器保留, 用户可继续普通阅读.

```js
let session = epub.read('./books/moby-dick.epub', { href: 'OPS/chapter_003.xhtml', preferences: { theme: 'sepia' } });
session.on('open', e => console.log('opened at', e.href, 'of', e.positions, 'positions'));
session.on('progress', e => console.log((e.totalProgression * 100).toFixed(1) + '%', e.chapterTitle));
session.on('error', e => console.warn(e.toString()));
session.on('close', e => console.log('closed:', e.reason));
```

## [m] readAsync

### epub.readAsync(path, options?)

**`6.8.0`** **`Async`**

- **path** { [string](dataTypes#string) | {{ path: [string](dataTypes#string); displayName?: [string](dataTypes#string) }} } - 文件路径或打开选项
- **[ options ]** {{ href?: [string](dataTypes#string); progression?: [number](dataTypes#number); locator?: [EpubLocator](epubLocatorType); preferences?: [Object](dataTypes#object) }} - 起始位置与阅读偏好
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[EpubReaderSession](epubReaderSessionType)&gt; }

Promise 在插件会话建立且阅读器启动请求发出后落定, 不等待 `open` 事件.

## [m] isAvailable

### epub.isAvailable()

**`6.8.0`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否有兼容且已启用的 EPUB 插件

探测插件. 插件缺失, 被禁用或不兼容时返回 `false`, 不抛出异常.

```js
if (!epub.isAvailable()) {
    toastLog('请在插件中心安装并启用 Readium EPUB Reader');
    exit();
}
```

## [m] isAvailableAsync

### epub.isAvailableAsync()

**`6.8.0`** **`Async`**

- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[boolean](dataTypes#boolean)&gt; }

## [C] EpubError

### new epub.EpubError(message, code?)

**`6.8.0`**

- **message** { [string](dataTypes#string) } - 错误消息
- **[ code = `'INTERNAL'` ]** { [string](dataTypes#string) } - 错误代码
- <ins>**returns**</ins> { [EpubError](#c-epuberror) }

EPUB 模块抛出的所有错误 (含 [EpubReaderSession](epubReaderSessionType) 的 `error` 事件参数) 都是 `name` 为 `'EpubError'` 的 JavaScript [Error](exceptions#error-对象), 可用 `instanceof epub.EpubError` 判断. `message` 不可枚举, `JSON.stringify` 只输出 `code`. 脚本也可自行构造.

```js
try {
    epub.open('./books/missing.epub');
} catch (e) {
    if (e instanceof epub.EpubError) {
        console.log(e.code); // FILE_NOT_FOUND
        console.log(e.toString()); // EpubError [FILE_NOT_FOUND]: file not found: ...
    }
}
```

## [p#] name

**`6.8.0`**

- { `'EpubError'` }

## [p#] code

**`6.8.0`**

- { [string](dataTypes#string) }

错误代码:

| code | 含义 |
| --- | --- |
| PLUGIN_UNAVAILABLE | 插件缺失, 绑定失败, 阅读器无法启动或插件进程在打开期间退出 |
| PLUGIN_DISABLED | 插件已安装但在插件中心被禁用 |
| PLUGIN_INCOMPATIBLE | 插件身份, 契约版本或要求的宿主版本不匹配 |
| FILE_NOT_FOUND | 文件不存在 |
| FILE_UNREADABLE | 文件不可读或不是常规文件 |
| NOT_EPUB | 既非 `.epub` 扩展名也非 ZIP 容器, 或容器内没有 EPUB 包 |
| PARSE_FAILED | Readium 无法解析出版物, 或封面无法解码 |
| ENCRYPTED | 出版物受 LCP 等 DRM 保护 |
| RESOURCE_NOT_FOUND | 未知的 href, 超出范围的阅读顺序索引, 书外的 locator, 或书籍没有封面 |
| LIMIT_EXCEEDED | 超出 [限制](epubBookType#限制-limits) 中的任一上限, 或脚本未及时消费阅读事件 |
| INVALID_ARGUMENT | 参数形态或取值不合法, 未知的选项键, 输出文件已存在而未指定 `overwrite` |
| SESSION_CLOSED | 书籍或会话已关闭, 脚本正在退出, 或插件进程已退出 |
| SESSION_REPLACED | 预留: 对已被新会话替换的会话调用 (当前插件回答 `SESSION_CLOSED`) |
| READER_NOT_VISIBLE | 阅读器尚未显示时的翻页请求 |
| UNSUPPORTED_PREFERENCE | 未知的偏好键 (只出现在 `error` 事件, 已知的键仍会应用) |
| CANCELLED | 调用被脚本停止或宿主取消 |
| TIMEOUT | 打开超过 30 秒, 其它调用超过 60 秒 |
| IO | 描述符, 管道或文件写入失败 |
| INTERNAL | 其他未归类错误 |

## [m#] toString

### epubError.toString()

**`6.8.0`**

- <ins>**returns**</ins> { [string](dataTypes#string) } - 形如 `EpubError [CODE]: message`

## 示例 (Examples)

### 元数据与目录

```js
let book = epub.open('./books/moby-dick.epub');
let meta = book.metadata;
console.log(meta.title, '/', meta.authors.join(', '), '/', meta.language);
console.log('阅读顺序', book.readingOrder.length, '个资源, 位置数', book.positions);
book.toc.forEach(e => console.log(e.title, e.href, e.children.length));
book.close();
```

### 导出章节文本与封面

```js
let book = epub.open('./books/moby-dick.epub');
let chapter = book.toc[2];
files.write('./out/' + chapter.title + '.txt', book.text(chapter, { format: 'markdown' }));
files.write('./out/whole.txt', book.textAll({ maxChars: 2 * 1024 * 1024 }));
try {
    console.log(book.cover('./out', { overwrite: true }));
} catch (e) {
    if (e.code !== 'RESOURCE_NOT_FOUND') throw e;
}
book.close();
```

### 打开阅读器并监听进度

```js
let session = epub.read('./books/moby-dick.epub', { progression: 0.25 });
session.on('open', () => session.setPreferences({ fontSize: 1.2 }));
session.on('progress', e => console.log((e.totalProgression * 100).toFixed(1) + '%', e.chapterTitle || e.href));
session.on('bookmark', e => console.log(e.action, e.locator.href));
session.on('close', e => console.log('closed:', e.reason));
setTimeout(() => session.nextChapter(), 10000);
setTimeout(() => session.close(), 60000); // 阅读器留给用户继续阅读.
```

### 异步调用

```js
epub.searchAsync('./books/moby-dick.epub', 'whale', { limit: 20 })
    .then(hits => console.log(hits.length, hits.map(h => h.title)))
    .catch(e => console.error(e.toString()));
```
