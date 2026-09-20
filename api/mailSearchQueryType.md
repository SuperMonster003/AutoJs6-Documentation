# MailSearchQuery

MailSearchQuery 是 [client.search](mailClientType#m-search) 与 [mail.search](mail#转发方法-forwarded-methods) 接受的查询条件对象.

同一对象内的多个条件为 "与" 关系; `and`, `or`, `not` 可任意嵌套 (最深 8 层) 组合子条件. 字符串条件为不区分大小写的子串匹配 (IMAP `SEARCH` 语义), 日期条件按天比较, `uid` 只能出现在最外层. 未知字段抛出 `INVALID_ARGUMENT`.

IMAP 上查询交由服务器执行; 服务器拒绝或不支持时, 按 `fallback` 选项在客户端过滤. POP3 只能在客户端按信封过滤, `body`, `text` 与 `uid` 条件不可用.

```js
let hits = client.search({
    from: 'noreply@example.com',
    subject: '验证码',
    since: '2026-09-01',
    seen: false,
}, { limit: 10 });
```

---

<p style="font: bold 2em sans-serif; color: #FF7043">MailSearchQuery</p>

---

## [p?] from

- { [string](dataTypes#string) }

发件人 (地址或显示名) 包含此子串.

## [p?] to

- { [string](dataTypes#string) }

## [p?] cc

- { [string](dataTypes#string) }

## [p?] bcc

- { [string](dataTypes#string) }

对应收件人字段包含此子串.

## [p?] subject

- { [string](dataTypes#string) }

主题包含此子串. 非 ASCII 关键字由插件以 `CHARSET UTF-8` 发送; 部分服务商对非 ASCII 搜索返回空结果或错误, 见 [服务商预设](mailAccountOptionsType#服务商预设-provider-presets) 的说明与 `fallback` 选项.

## [p?] body

- { [string](dataTypes#string) }

正文包含此子串. 客户端过滤时需下载候选邮件的正文, 代价较高; POP3 不可用.

## [p?] text

- { [string](dataTypes#string) }

主题, 正文, 发件人或收件人任一包含此子串.

## [p?] since

- { [Date](dataTypes#date) | [number](dataTypes#number) | [string](dataTypes#string) }

接收日期不早于此日期 (含当天).

## [p?] before

- { [Date](dataTypes#date) | [number](dataTypes#number) | [string](dataTypes#string) }

接收日期早于此日期 (不含当天).

## [p?] sentSince

- { [Date](dataTypes#date) | [number](dataTypes#number) | [string](dataTypes#string) }

## [p?] sentBefore

- { [Date](dataTypes#date) | [number](dataTypes#number) | [string](dataTypes#string) }

按 `Date` 头 (发送日期) 的对应条件.

日期接受 JavaScript `Date`, UTC 毫秒时间戳, 或 ISO-8601 字符串 (`'2026-09-01'`, `'2026-09-01T08:00:00Z'`). 无论精度如何, 比较都按天进行, 这是 IMAP 协议的规则.

## [p?] seen

- { [boolean](dataTypes#boolean) }

## [p?] flagged

- { [boolean](dataTypes#boolean) }

## [p?] answered

- { [boolean](dataTypes#boolean) }

## [p?] draft

- { [boolean](dataTypes#boolean) }

## [p?] deleted

- { [boolean](dataTypes#boolean) }

对应系统标记是否存在. `false` 表示要求标记不存在 (如 `seen: false` 为未读), 省略表示不限制.

## [p?] larger

- { [number](dataTypes#number) }

邮件大小大于此字节数.

## [p?] smaller

- { [number](dataTypes#number) }

邮件大小小于此字节数.

## [p?] header

- { [Object](dataTypes#object) }

任意邮件头的子串条件, 属性名为头名称, 属性值为子串, 如 `{ 'X-Mailer': 'Foo', 'List-Id': 'news' }`. 多个头之间为 "与" 关系.

## [p?] messageId

- { [string](dataTypes#string) }

`Message-ID` 头包含此子串 (可含尖括号). 163 的服务器搜索对近期邮件返回空结果, 需用 `fallback: 'always'`; QQ 会改写外发邮件的 Message-ID, 因此按发送结果中的 `messageId` 查找不到.

## [p?] uid

- { [number](dataTypes#number) | [string](dataTypes#string) | [Array](dataTypes#array) }

限定候选邮件的 UID 集合, 只能写在最外层, 与其他条件为 "与" 关系. 接受单个 UID (`4711`), 范围字符串 (`'1:50'`, `'100:*'`, `'1,5,9:12'`; `*` 表示当前最大 UID), 或它们的数组. POP3 不可用.

## [p?] and

- { [MailSearchQuery](mailSearchQueryType)[[]](dataTypes#array) }

子条件全部成立.

## [p?] or

- { [MailSearchQuery](mailSearchQueryType)[[]](dataTypes#array) }

子条件至少一个成立.

## [p?] not

- { [MailSearchQuery](mailSearchQueryType) }

子条件不成立.

```js
// (来自 a 或 b) 且 (主题含 "发票" 或 "invoice") 且 非已读
client.search({
    or: [{ from: 'a@example.com' }, { from: 'b@example.com' }],
    and: [{ or: [{ subject: '发票' }, { subject: 'invoice' }] }],
    not: { seen: true },
});

// 最近 7 天内, 大于 1 MiB 且带 X-Priority 头的邮件
client.search({
    since: Date.now() - 7 * 24 * 3600 * 1000,
    larger: 1024 * 1024,
    header: { 'X-Priority': '1' },
});

// 只在 UID 大于 5000 的邮件中查找
client.search({ uid: '5001:*', subject: '报表' });
```

## 客户端过滤 (Client Fallback)

[client.search](mailClientType#m-search) 的 `fallback` 选项决定服务器不执行查询时的处理:

| fallback | 行为 |
| --- | --- |
| `'client'` (默认) | 先请求服务器; 服务器拒绝该查询时, 从最新一封开始拉取信封在客户端逐条过滤, 找满 `limit` 条即停止, 最多扫描 2000 条 (POP3 200 条) |
| `'none'` | 只请求服务器, 被拒绝时把服务器的错误原样抛出 (通常为 `SERVER_ERROR`) |
| `'always'` | 不请求服务器, 直接在客户端过滤. 用于服务器搜索返回空结果而非错误的服务商 (QQ 的中文搜索, 163 对近期邮件的文本搜索) |

结果数组的不可枚举属性 `fallback` 为 `'server'` 或 `'client'`, 说明本次实际采用的方式. 客户端过滤时含 `body` / `text` 条件的查询需要下载候选邮件正文, 耗时随扫描数增加; 有 `debug: true` 时每扫描 25 条输出一次进度.
