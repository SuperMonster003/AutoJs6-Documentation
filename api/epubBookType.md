# 电子书对象 (EpubBook)

EpubBook 是 [epub.open](epub#m-open) 返回的书籍对象, 对应插件进程中一本已打开的 EPUB, 提供元数据, 目录, 阅读顺序, 正文提取, 封面与资源导出以及全文搜索.

每个方法都有同步形态与 `Async` 形态, 参数与结果完全一致. 同步形态阻塞当前脚本线程, 停止脚本会取消调用; `Async` 形态返回 [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise), 回调在脚本线程执行. 失败时抛出 (或拒绝为) [EpubError](epub#c-epuberror). 书籍关闭后 (包括插件在 5 分钟无调用后自动关闭) 所有方法失败于 `SESSION_CLOSED`.

`metadata`, `toc`, `readingOrder` 与 `positions` 是只读属性, 首次访问时从插件读取并缓存. 书内资源以出版物相对 href 标识 (如 `OEBPS/chapter2.xhtml`), 目录, 阅读顺序, 搜索结果与 [EpubLocator](epubLocatorType) 中的 `href` 是同一套字符串, 可以互相传递.

```js
let book = epub.open('./books/moby-dick.epub');
console.log(book.toString()); // EpubBook { path: /storage/emulated/0/.../moby-dick.epub }
console.log(book.metadata.title, book.positions);
console.log(book.text(book.readingOrder[1], { maxChars: 300 }));
book.close();
```

---

<p style="font: bold 2em sans-serif; color: #FF7043">EpubBook</p>

---

## [@] EpubBook

**`6.8.0`**

书籍对象. 不能用 `new` 构造, 只由 [epub.open](epub#m-open) 与 [epub.openAsync](epub#m-openasync) 产生.

## [p#] path

**`6.8.0`**

- { [string](dataTypes#string) }

打开时解析得到的文件路径.

## [p#] isClosed

**`6.8.0`**

- { [boolean](dataTypes#boolean) }

是否已由脚本关闭.

## [p#] metadata

**`6.8.0`**

- {{
    - title: [string](dataTypes#string);
    - authors: [string](dataTypes#string)[];
    - language?: [string](dataTypes#string);
    - identifier?: [string](dataTypes#string);
    - publisher?: [string](dataTypes#string);
    - published?: [string](dataTypes#string);
    - modified?: [string](dataTypes#string);
    - description?: [string](dataTypes#string);
    - subjects: [string](dataTypes#string)[];
    - layout: `'reflowable'` \| `'fixed'`;
    - readingProgression: `'ltr'` \| `'rtl'` \| `'auto'`;
    - cover?: [string](dataTypes#string);
    - positions: [number](dataTypes#number);
- }}

出版物元数据. `title`, `authors`, `subjects`, `layout`, `readingProgression` 与 `positions` 总是存在, 其余字段在包文档没有时缺失. 日期为 Readium 从包文档解析出的字符串; `cover` 是封面资源的 href, 可交给 [resource](#m-resource) 导出; `description` 最多 65536 个字符.

```js
let meta = epub.open('./books/moby-dick.epub').metadata;
console.log(meta.title, meta.authors, meta.layout, meta.cover);
```

## [p#] toc

**`6.8.0`**

- {{ title: [string](dataTypes#string); href: [string](dataTypes#string); children: [Object](dataTypes#object)[] }}[]

目录树. 每个节点为 `{ title, href, children }`, `children` 总是数组 (可能为空), 节点顺序与书中一致, 最多 5000 个节点. 节点可直接作为 [text](#m-text) 的 `target`.

## [p#] readingOrder

**`6.8.0`**

- {{ href: [string](dataTypes#string); type: [string](dataTypes#string); title?: [string](dataTypes#string) }}[]

阅读顺序 (spine) 的资源列表, `type` 为媒体类型 (未知时为空字符串), `title` 仅在清单提供时存在; 最多 5000 项. 数组下标即 [text](#m-text) 接受的阅读顺序索引.

## [p#] positions

**`6.8.0`**

- { [number](dataTypes#number) }

Readium 为整本书生成的合成位置数, 可视为近似页数; 阅读器进度条与 [EpubLocator](epubLocatorType) 的 `locations.position` 使用同一计数.

## [m#] text

### book.text(target?, options?)

**`6.8.0`**

- **[ target ]** { [string](dataTypes#string) | [number](dataTypes#number) | {{ href: [string](dataTypes#string) }} } - 资源 href, 阅读顺序索引 (从 0 起), 或带 `href` 的对象 (目录项, 阅读顺序项或 [EpubLocator](epubLocatorType)); 省略时为全书
- **[ options ]** {{
    - offset?: [number](dataTypes#number);
    - maxChars?: [number](dataTypes#number);
    - format?: `'text'` \| `'markdown'`;
- }} - 提取选项
- <ins>**returns**</ins> { [string](dataTypes#string) } - 文本

提取单个资源或全书的文本. `format` 为 `'text'` (默认, 纯文本, 图片被丢弃) 或 `'markdown'` (保留标题, 图片与引用等结构). `offset` 跳过资源开头的若干字符, 只在指定单个资源时可用; `maxChars` 限制返回的字符总数, 默认 4194304 (4 MiB), 返回的字符串不会在代理对中间截断. 全书提取按阅读顺序拼接各资源的文本, 资源之间以空行分隔, 空资源跳过, `maxChars` 作用于合计. 目标对象只使用其 `href` (含 `#fragment` 时忽略片段), 因此目录项与 locator 都能作为目标. 非 HTML 的阅读顺序资源得到空字符串.

未知 href 或超出范围的索引抛出 `RESOURCE_NOT_FOUND`; 单个资源超过 64 MiB 抛出 `LIMIT_EXCEEDED`.

```js
let book = epub.open('./books/moby-dick.epub');
console.log(book.text(0, { maxChars: 1000 }));
console.log(book.text('OPS/chapter_003.xhtml', { format: 'markdown' }));
console.log(book.text(book.toc[0]).length);
console.log(book.text({ href: 'OPS/chapter_003.xhtml' }, { offset: 500, maxChars: 200 }));
book.close();
```

### book.textAsync(target?, options?)

**`6.8.0`** **`Async`**

- **[ target ]** { [string](dataTypes#string) | [number](dataTypes#number) | {{ href: [string](dataTypes#string) }} } - 提取目标
- **[ options ]** {{ offset?: [number](dataTypes#number); maxChars?: [number](dataTypes#number); format?: `'text'` \| `'markdown'` }} - 提取选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[string](dataTypes#string)&gt; }

## [m#] textAll

### book.textAll(options?)

**`6.8.0`**

- **[ options ]** {{ maxChars?: [number](dataTypes#number); format?: `'text'` \| `'markdown'` }} - 提取选项
- <ins>**returns**</ins> { [string](dataTypes#string) } - 全书文本

等价于省略 `target` 的 [text](#m-text): 按阅读顺序拼接全书文本, `maxChars` 默认 4194304. `offset` 在此不可用.

### book.textAllAsync(options?)

**`6.8.0`** **`Async`**

- **[ options ]** {{ maxChars?: [number](dataTypes#number); format?: `'text'` \| `'markdown'` }} - 提取选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[string](dataTypes#string)&gt; }

## [m#] cover

### book.cover()

**`6.8.0`** **`Overload 1/2`**

- <ins>**returns**</ins> { [ImageWrapper](imageWrapperType) } - 封面图像

解码封面资源 (`metadata.cover`) 为图像. 书籍没有封面时抛出 `RESOURCE_NOT_FOUND`, 无法解码时抛出 `PARSE_FAILED`. 使用完毕后应调用图像的 `recycle()`.

### book.cover(outputPath, options?)

**`6.8.0`** **`Overload 2/2`**

- **outputPath** { [string](dataTypes#string) } - 输出文件路径, 或已存在的目录 (以封面资源自身的文件名保存)
- **[ options ]** {{ overwrite?: [boolean](dataTypes#boolean) }} - `overwrite` 默认 `false`
- <ins>**returns**</ins> { [string](dataTypes#string) } - 已保存的文件路径

把封面资源原样写入文件. 输出路径按脚本工作目录解析, 不存在的父目录会被创建; 目标文件已存在而 `overwrite` 为 `false` 时抛出 `INVALID_ARGUMENT`. 写入先落到临时文件, 成功后再替换目标.

```js
let book = epub.open('./books/moby-dick.epub');
let image = book.cover();
console.log(image.getWidth(), image.getHeight());
image.recycle();
console.log(book.cover('./covers/moby-dick.jpg', { overwrite: true }));
book.close();
```

### book.coverAsync()

**`6.8.0`** **`Async`** **`Overload 1/2`**

- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[ImageWrapper](imageWrapperType)&gt; }

### book.coverAsync(outputPath, options?)

**`6.8.0`** **`Async`** **`Overload 2/2`**

- **outputPath** { [string](dataTypes#string) } - 输出文件路径或目录
- **[ options ]** {{ overwrite?: [boolean](dataTypes#boolean) }} - 导出选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[string](dataTypes#string)&gt; }

## [m#] resource

### book.resource(href, outputPath, options?)

**`6.8.0`**

- **href** { [string](dataTypes#string) } - 清单内资源的 href (最长 2048 个字符)
- **outputPath** { [string](dataTypes#string) } - 输出文件路径, 或已存在的目录 (以资源自身的文件名保存)
- **[ options ]** {{ overwrite?: [boolean](dataTypes#boolean) }} - `overwrite` 默认 `false`
- <ins>**returns**</ins> { [string](dataTypes#string) } - 已保存的文件路径

把书内任意清单资源 (图片, 样式, 字体, 章节 XHTML 等) 原样导出到文件, 输出规则同 [cover](#m-cover). 不在清单内的 href 抛出 `RESOURCE_NOT_FOUND`, 资源超过 64 MiB 抛出 `LIMIT_EXCEEDED`.

```js
let book = epub.open('./books/moby-dick.epub');
console.log(book.resource('OPS/images/frontispiece.jpg', './out'));
console.log(book.resource('OPS/chapter_001.xhtml', './out/chapter1.xhtml', { overwrite: true }));
book.close();
```

### book.resourceAsync(href, outputPath, options?)

**`6.8.0`** **`Async`**

- **href** { [string](dataTypes#string) } - 资源 href
- **outputPath** { [string](dataTypes#string) } - 输出文件路径或目录
- **[ options ]** {{ overwrite?: [boolean](dataTypes#boolean) }} - 导出选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[string](dataTypes#string)&gt; }

## [m#] search

### book.search(query, options?)

**`6.8.0`**

- **query** { [string](dataTypes#string) } - 搜索词, 首尾空白去除且内部空白折叠后长度须在 1 到 256 个字符之间
- **[ options ]** {{
    - offset?: [number](dataTypes#number);
    - limit?: [number](dataTypes#number);
- }} - `offset` 默认 0; `limit` 为 1 到 500, 默认 50; `offset + limit` 不得超过 500
- <ins>**returns**</ins> {{ href: [string](dataTypes#string); title?: [string](dataTypes#string); locator: [EpubLocator](epubLocatorType); text: {{ before: [string](dataTypes#string); highlight: [string](dataTypes#string); after: [string](dataTypes#string) }} }}[] - 命中列表

由 Readium 搜索服务执行的全文搜索. 每个命中含所在资源的 `href`, 章节 `title` (已知时), 指向命中处的 `locator` (可交给 [EpubReaderSession#goTo](epubReaderSessionType#m-goto) 或 [epub.read](epub#m-read) 的 `locator`) 与上下文 `text`. 一次查询最多得到 500 个命中, 通过 `offset` 与 `limit` 分页.

```js
let book = epub.open('./books/moby-dick.epub');
let hits = book.search('white whale', { limit: 20 });
hits.forEach(h => console.log(h.title, ':', h.text.before + '[' + h.text.highlight + ']' + h.text.after));
let more = book.search('white whale', { offset: 20, limit: 20 });
book.close();
```

### book.searchAsync(query, options?)

**`6.8.0`** **`Async`**

- **query** { [string](dataTypes#string) } - 搜索词
- **[ options ]** {{ offset?: [number](dataTypes#number); limit?: [number](dataTypes#number) }} - 分页选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](dataTypes#object)[]&gt; }

## [m#] close

### book.close()

**`6.8.0`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

关闭书籍并释放插件侧的资源. 重复调用无副作用, 之后的方法调用失败于 `SESSION_CLOSED`. 脚本退出时未关闭的书籍自动关闭.

## [m#] toString

### book.toString()

**`6.8.0`**

- <ins>**returns**</ins> { [string](dataTypes#string) } - 形如 `EpubBook { path: /sdcard/Books/moby-dick.epub }`, 关闭后附加 `, closed`

## 限制 (Limits)

| 项目 | 上限 |
| --- | --- |
| 每个插件进程同时打开的书籍 | 8 |
| 书籍空闲 (无调用) 时长 | 5 分钟, 超出后由插件关闭 |
| href 长度 | 2048 个字符 |
| 目录节点 / 阅读顺序项 | 各 5000 |
| `text` 单次 `maxChars` 默认值 | 4194304 (4 MiB) |
| 单个资源 (`text` 渲染或 `resource` / `cover` 导出) | 64 MiB |
| 搜索词长度 | 1 到 256 个字符 |
| 单次 `search` 返回数 / 一次查询的全部命中 | 500 (默认 50) / 500 |
| 打开超时 / 其它调用超时 | 30 秒 / 60 秒 |

超出上限的调用抛出 `LIMIT_EXCEEDED`, 超时抛出 `TIMEOUT`.
