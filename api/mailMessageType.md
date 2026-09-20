# 邮件消息 (MailMessage)

MailMessage 是 [邮件客户端](mailClientType) 的 [fetch](mailClientType#m-fetch), [search](mailClientType#m-search), [get](mailClientType#m-get) 与 [监听](mailClientType#mailwatch) 的 `message` 事件返回的邮件对象.

`fetch` 与 `search` 返回的是摘要 (信封): 有 UID, 主题, 各方地址, 日期, 大小, 标记与是否含附件, 没有正文与附件列表, 此时 `bodyLoaded` 为 `false`. 对摘要调用 [load](#m-load) 或对客户端调用 [get](mailClientType#m-get) 得到含正文的完整对象.

对象是普通 JavaScript 对象, 可直接 `JSON.stringify`. `date` / `receivedDate` 为 JavaScript `Date`, 各地址为 [MailAddress](#mailaddress), 附件为 [MailAttachment](#mailattachment). 本章同时说明发送与追加邮件时使用的 [MailSendMessage](#mailsendmessage) 以及各方法接受的 [UID 参数](#uid-参数-uid-argument).

```js
let client = mail.connect('work');
let latest = client.fetch({ limit: 1 })[0];
console.log(latest.uid, latest.subject, latest.from.toString(), latest.date);
let full = latest.load();
console.log(full.text || full.html);
full.attachments.forEach(a => console.log(a.fileName, a.mimeType, a.size));
client.close();
```

---

<p style="font: bold 2em sans-serif; color: #FF7043">MailMessage</p>

---

## [@] MailMessage

**`6.8.0`**

邮件对象. 不能用 `new` 构造, 只由客户端方法与监听事件产生.

## [p#] uid

**`6.8.0`**

- { [number](dataTypes#number) | [string](dataTypes#string) }

邮件在其文件夹中的唯一标识. IMAP 为正整数 UID, 同一文件夹内递增, 在 `uidValidity` 不变时稳定; POP3 为服务器分配的 UIDL 字符串.

## [p#] folder

**`6.8.0`**

- { [string](dataTypes#string) }

邮件所在的文件夹路径. 把对象直接作为 [UID 参数](#uid-参数-uid-argument) 传给客户端方法时, 默认使用此文件夹.

## [p#] messageId

**`6.8.0`**

- { [string](dataTypes#string) | [null](dataTypes#null) }

`Message-ID` 头, 含尖括号, 缺失时为 `null`. 部分服务商 (如 QQ) 会改写外发邮件的 Message-ID.

## [p#] inReplyTo

**`6.8.0`**

- { [string](dataTypes#string) | [null](dataTypes#null) }

`In-Reply-To` 头.

## [p#] references

**`6.8.0`**

- { [string](dataTypes#string)[[]](dataTypes#array) }

`References` 头中的 Message-ID 列表, 没有时为空数组.

## [p#] subject

**`6.8.0`**

- { [string](dataTypes#string) }

已解码的主题, 缺失时为空字符串.

## [p#] from

**`6.8.0`**

- { [MailAddress](#mailaddress) | [null](dataTypes#null) }

发件人. 部分服务商 (163 / 126) 返回的显示名中空格会变成下划线.

## [p#] sender

**`6.8.0`**

- { [MailAddress](#mailaddress) | [null](dataTypes#null) }

`Sender` 头, 通常为 `null`.

## [p#] replyTo

**`6.8.0`**

- { [MailAddress](#mailaddress)[[]](dataTypes#array) }

## [p#] to

**`6.8.0`**

- { [MailAddress](#mailaddress)[[]](dataTypes#array) }

## [p#] cc

**`6.8.0`**

- { [MailAddress](#mailaddress)[[]](dataTypes#array) }

## [p#] bcc

**`6.8.0`**

- { [MailAddress](#mailaddress)[[]](dataTypes#array) }

收件人, 抄送与密送列表, 没有时为空数组. 收到的邮件通常没有 `bcc`.

## [p#] date

**`6.8.0`**

- { [Date](dataTypes#date) | [null](dataTypes#null) }

`Date` 头, 即发件方声明的发送时间, 无法解析时为 `null`.

## [p#] receivedDate

**`6.8.0`**

- { [Date](dataTypes#date) | [null](dataTypes#null) }

服务器记录的接收时间 (IMAP INTERNALDATE), POP3 或服务器不提供时为 `null`.

## [p#] size

**`6.8.0`**

- { [number](dataTypes#number) }

邮件在服务器上的字节数.

## [p#] flags

**`6.8.0`**

- { [string](dataTypes#string)[[]](dataTypes#array) }

全部标记名: 系统标记 `'seen'`, `'flagged'`, `'answered'`, `'draft'`, `'deleted'`, 只读的 `'recent'`, 以及服务器保存的自定义关键字. POP3 没有标记, 为空数组.

## [p#] seen

**`6.8.0`**

- { [boolean](dataTypes#boolean) }

## [p#] flagged

**`6.8.0`**

- { [boolean](dataTypes#boolean) }

## [p#] answered

**`6.8.0`**

- { [boolean](dataTypes#boolean) }

## [p#] draft

**`6.8.0`**

- { [boolean](dataTypes#boolean) }

## [p#] deleted

**`6.8.0`**

- { [boolean](dataTypes#boolean) }

对应系统标记是否存在的便捷布尔值.

## [p#] hasAttachments

**`6.8.0`**

- { [boolean](dataTypes#boolean) }

是否含附件. 摘要阶段由服务器报告的结构 (BODYSTRUCTURE) 判断, POP3 上需读取正文后才准确.

## [p#] bodyLoaded

**`6.8.0`**

- { [boolean](dataTypes#boolean) }

正文, 头与附件列表是否已加载. `fetch` / `search` 的结果为 `false`, [load](#m-load) / [get](mailClientType#m-get) 的结果与 `fetchBody: true` 的监听事件为 `true`.

## [p#] text

**`6.8.0`**

- { [string](dataTypes#string) | [null](dataTypes#null) }

纯文本正文, 邮件没有纯文本部分或尚未加载时为 `null`.

## [p#] html

**`6.8.0`**

- { [string](dataTypes#string) | [null](dataTypes#null) }

HTML 正文, 邮件没有 HTML 部分或尚未加载时为 `null`.

## [p#] headers

**`6.8.0`**

- { [Object](dataTypes#object) }

全部邮件头. 属性名为头名称 (大小写按服务器返回的原样, 查找时建议不区分大小写), 属性值为字符串数组 (同名头可能多次出现). 未加载时为空对象.

```js
let full = client.get(uid);
function header(message, name) {
    let key = Object.keys(message.headers).find(k => k.toLowerCase() === name.toLowerCase());
    return key ? message.headers[key] : [];
}
console.log(header(full, 'X-Mailer')); // 如 ['Foo Mailer 1.0'] 或 [].
console.log(header(full, 'List-Unsubscribe'));
```

## [p#] attachments

**`6.8.0`**

- { [MailAttachment](#mailattachment)[[]](dataTypes#array) }

附件列表 (只含元数据). 内联图片等 `inline` 为 `true` 的部分也在其中. 未加载时为空数组.

## [p#] bodyTruncated

**`6.8.0`**

- { [boolean](dataTypes#boolean) }

`text` 与 `html` 的总量超过 256 KiB 时为 `true`, 被省略的正文部分列在 [bodyParts](#p-bodyparts) 中.

## [p#] bodyParts

**`6.8.0`**

- { [MailAttachment](#mailattachment)[[]](dataTypes#array) }

因超出内联预算而未随对象返回的正文部分, 每项与附件同形, 可用其 [download](#m-download) 方法保存为文件.

## [p#] raw

**`6.8.0`**

- { [string](dataTypes#string) | [null](dataTypes#null) }

以 `includeRaw: true` 读取时的原始 RFC 822 文本, 每个字节映射为一个字符 (ISO-8859-1). 未请求时为 `null`. 需要完整原文文件时改用 [raw](mailClientType#m-raw).

## [p#] rawTruncated

**`6.8.0`**

- { [boolean](dataTypes#boolean) }

`raw` 是否因超出内联预算而被截断.

## [m#] load

### message.load(options?)

**`6.8.0`**

- **[ options ]** { [Object](dataTypes#object) } - 同 [client.get](mailClientType#m-get) 的选项 (`peek`, `includeRaw`)
- <ins>**returns**</ins> { [MailMessage](mailMessageType) } - 含正文的新对象

### message.loadAsync(options?)

**`6.8.0`** **`Async`**

- **[ options ]** { [Object](dataTypes#object) } - 同上
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [MailMessage](mailMessageType)

用产生本对象的客户端读取完整邮件, 等价于 `client.get(message, options)`. 返回新对象, 不修改原对象. 这两个方法不可枚举, 不会出现在 `JSON.stringify` 的结果中.

## MailAttachment

[attachments](#p-attachments) 与 [bodyParts](#p-bodyparts) 中的附件对象.

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `partId` | string | MIME 部分编号, 如 `'2'` 或 `'1.2'`, 与 `uid` 一起唯一定位附件 |
| `fileName` | string | 已解码的文件名, 邮件未提供时由插件生成 |
| `mimeType` | string | 媒体类型, 如 `'application/pdf'` |
| `size` | number | 传输编码后的字节数 (Base64 编码的附件约为原文件的 4/3), 未知时为 `-1` |
| `contentId` | string \| null | `Content-ID`, 内联图片在 HTML 中以 `cid:` 引用 |
| `inline` | boolean | 是否为内联部分 |
| `uid` | number \| string | 所属邮件的 UID |
| `folder` | string | 所属邮件的文件夹 |

## [m#] download

### attachment.download(target?, options?)

**`6.8.0`**

- **[ target = `files.cwd()` ]** { [string](dataTypes#string) } - 目标目录或文件路径
- **[ options ]** { [Object](dataTypes#object) } - 下载选项 (`overwrite`)
- <ins>**returns**</ins> { [string](dataTypes#string) } - 落盘文件的绝对路径

### attachment.downloadAsync(target?, options?)

**`6.8.0`** **`Async`**

- **[ target = `files.cwd()` ]** { [string](dataTypes#string) } - 目标目录或文件路径
- **[ options ]** { [Object](dataTypes#object) } - 下载选项 (`overwrite`, `onProgress`)
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为落盘文件的绝对路径

等价于 [client.download](mailClientType#m-download)`(attachment, target, options)`, 用产生本对象的客户端下载. 不可枚举.

```js
let full = client.get(uid);
let pdf = full.attachments.find(a => a.mimeType === 'application/pdf');
if (pdf) {
    console.log(pdf.download('/sdcard/Download/'));
}
```

## MailAddress

`from`, `sender`, `replyTo`, `to`, `cc`, `bcc` 中的地址对象.

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `name` | string \| null | 显示名, 没有时为 `null` |
| `address` | string | 邮箱地址 |
| `toString()` | string | 有显示名时为 `Name <address>`, 否则为 `address` |

## MailSendMessage

[client.send](mailClientType#m-send) 与 [client.append](mailClientType#m-append) 接受的邮件内容对象. 除 `subject` 与至少一个收件人外均可省略.

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `from` | 地址 | 发件人, 单个地址, 默认为账户地址与 `name`. 多数服务商要求与登录账户一致 |
| `to` | 地址 | 收件人 |
| `cc` | 地址 | 抄送 |
| `bcc` | 地址 | 密送. `to`, `cc`, `bcc` 至少一个非空, 合计不超过 500 个 |
| `replyTo` | 地址 | 回复地址 |
| `subject` | string | 主题, 必填 (可为空字符串), 不超过 998 字符 |
| `text` | string | 纯文本正文 |
| `html` | string | HTML 正文. 与 `text` 同时给出时发送 multipart/alternative |
| `attachments` | (string \| Object)[] | 附件, 见下文, 最多 64 个, 每个不超过 200 MiB |
| `headers` | Object | 自定义头, 属性值为字符串或字符串数组, 最多 32 个, 值不超过 998 字符且不含换行 |
| `priority` | string | `'high'`, `'normal'` 或 `'low'` |
| `inReplyTo` | string | 被回复邮件的 Message-ID |
| `references` | string \| string[] | 会话线索中的 Message-ID 列表 |
| `date` | Date \| number \| string | `Date` 头, 默认为当前时间 |

地址字段接受以下形式, 以及以上任意项的数组:

```js
'a@b.c'                               // 纯地址
'Name <a@b.c>'                        // 带显示名
'a@b.c, Name <b@example.com>'         // 逗号分隔的多个地址
({ name: 'Name', address: 'a@b.c' })  // 对象
```

附件项可为文件路径字符串, 或 `{ path, fileName?, mimeType?, contentId?, inline? }` 对象: `fileName` 默认为路径中的文件名, `mimeType` 默认按扩展名推断, `contentId` 与 `inline: true` 用于 HTML 正文中以 `cid:` 引用的内联图片. 相对路径相对于脚本工作目录.

`headers` 不能设置由插件生成的头 (`From`, `To`, `Cc`, `Bcc`, `Reply-To`, `Subject`, `Date`, `Message-ID`, `In-Reply-To`, `References`, `MIME-Version`, `Content-*`, 优先级相关头, `Return-Path`, `Received`, `DKIM-Signature`), 应改用对应字段.

```js
client.send({
    to: [{ name: '张三', address: 'zhangsan@example.com' }, 'lisi@example.com'],
    subject: 'Re: 周报',
    inReplyTo: '<original-id@example.com>',
    references: ['<original-id@example.com>'],
    text: '收到, 谢谢.',
    html: '<p>收到, 谢谢.</p><img src="cid:sig">',
    attachments: [{ path: './signature.png', contentId: 'sig', inline: true }],
    headers: { 'X-Auto-Reply': 'AutoJs6' },
    priority: 'high',
});
```

## UID 参数 (UID Argument)

接受邮件标识的方法 (如 [get](mailClientType#m-get), [setFlags](mailClientType#m-setflags), [move](mailClientType#m-move), [delete](mailClientType#m-delete)) 统一接受以下形式:

- 正整数 - IMAP UID
- 非空字符串 - POP3 UIDL
- `{ uid, folder? }` 对象 - 带文件夹的标识, [MailMessage](mailMessageType) 对象即属此类, 其 `folder` 作为默认文件夹
- 以上任意项的数组 - 只用于接受多个 UID 的方法 (`setFlags`, `markRead` 等, `move`, `copy`, `delete`)

传入对象时, 选项中的 `folder` 优先于对象自带的 `folder`; 传数组时以第一个对象的 `folder` 为准, 因此同一次调用的邮件应来自同一文件夹.

```js
let list = client.fetch({ unseenOnly: true });
client.markRead(list); // 直接传 MailMessage 数组.
client.get({ uid: 4711, folder: 'Archive' });
client.delete('0000012345abcdef'); // POP3 UIDL.
```
