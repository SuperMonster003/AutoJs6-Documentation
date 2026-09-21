# EpubLocator

EpubLocator 是 Readium 用于描述 EPUB 中一个位置的普通 JavaScript 对象 (Readium `Locator` 的 JSON 形式). [EpubReaderSession](epubReaderSessionType) 的 `open` / `progress` / `bookmark` / `highlight` 事件, [session.locator](epubReaderSessionType#p-locator), [session.bookmarks](epubReaderSessionType#m-bookmarks), [EpubBook#annotations](epubBookType#m-annotations) 与 [EpubBook#search](epubBookType#m-search) 的命中都携带此对象; 脚本可以把它原样交回 [session.goTo](epubReaderSessionType#m-goto), [epub.read](epub#m-read) 的 `locator` 选项或 [EpubBook#text](epubBookType#m-text) 的 `target`, 也可以保存为 JSON 供下次运行使用.

```js
let session = epub.read('./books/moby-dick.epub');
session.on('progress', (e) => {
    files.write('./moby-dick.locator.json', JSON.stringify(e.locator));
});
// 下次运行:
let saved = JSON.parse(files.read('./moby-dick.locator.json'));
epub.read('./books/moby-dick.epub', { locator: saved });
```

---

<p style="font: bold 2em sans-serif; color: #FF7043">EpubLocator</p>

---

## [@] EpubLocator

**`6.8.0`**

- {{
    - href: [string](dataTypes#string);
    - type: [string](dataTypes#string);
    - title?: [string](dataTypes#string);
    - locations?: {{
        - fragments?: [string](dataTypes#string)[];
        - progression?: [number](dataTypes#number);
        - totalProgression?: [number](dataTypes#number);
        - position?: [number](dataTypes#number);
        - cssSelector?: [string](dataTypes#string);
    - }};
    - text?: {{
        - before?: [string](dataTypes#string);
        - highlight?: [string](dataTypes#string);
        - after?: [string](dataTypes#string);
    - }};
- }}

## 字段 (Fields)

| 字段 | 说明 |
| --- | --- |
| `href` | 位置所在资源的出版物相对 href, 与目录, 阅读顺序和搜索结果中的 `href` 是同一套字符串 |
| `type` | 资源的媒体类型, 如 `application/xhtml+xml` |
| `title` | 资源或章节标题, 已知时存在 |
| `locations.progression` | 在该资源内的进度, 0 到 1 |
| `locations.totalProgression` | 在全书中的进度, 0 到 1 |
| `locations.position` | 合成位置序号 (从 1 起), 与 [EpubBook#positions](epubBookType#p-positions) 同一计数 |
| `locations.cssSelector` | 定位到元素的 CSS 选择器 |
| `locations.fragments` | 资源内的片段标识 |
| `text.before` / `text.highlight` / `text.after` | 位置处的上下文文本, 搜索结果与书签的 locator 携带 |

脚本传回插件的 locator 必须带非空 `href`, 序列化后不超过 16 KiB (否则 `LIMIT_EXCEEDED`), 且 `href` 须指向当前书籍中的资源 (否则 `RESOURCE_NOT_FOUND`); 其余字段按 Readium 的规则解析, 无法解析时 `INVALID_ARGUMENT`. 从插件收到的 locator 可原样传回. 手工构造时至少给出 `href`, 可再加 `locations.progression` 指定资源内的位置:

```js
session.goTo({ href: 'OPS/chapter_003.xhtml', locations: { progression: 0.5 } });
```
