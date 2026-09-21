# 邮件客户端 (MailClient)

MailClient 是 [mail.connect](mail#m-connect) 返回的会话对象, 持有一个账户到收信服务器 (IMAP 或 POP3) 与 SMTP 服务器的连接, 并提供收发, 搜索, 整理和监听邮件的方法.

每个网络方法都有同步形态与 `Async` 形态, 参数与结果完全一致. 同步形态阻塞当前脚本线程, 停止脚本会取消调用; `Async` 形态返回 [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise), 回调在脚本线程执行. 失败时抛出 (或拒绝为) [MailError](mail#c-mailerror). 客户端关闭后所有方法失败于 `SESSION_CLOSED`.

收信协议为 POP3 时, 只有 `INBOX` 一个文件夹, 且不支持标记, 移动, 复制, 追加, 清除与文件夹管理, 这些方法失败于 `UNSUPPORTED_OPERATION`. 下表中的 "协议" 列标明各方法可用的收信协议.

UID 参数统一接受: IMAP 的正整数 UID, POP3 的 UIDL 字符串, [MailMessage](mailMessageType) 对象 (自带 `uid` 与 `folder`), 以及以上任意项的数组 (需要多个 UID 的方法). 详见 [UID 参数](mailMessageType#uid-参数-uid-argument).

文件夹名为字符串, 默认 `'INBOX'`, 层级分隔符按服务器原样 (如 `'Work/2026'` 或 `'Work.2026'`), 可从 [folders](#m-folders) 返回的 `path` 读取.

```js
let client = mail.connect('work');
console.log(client.toString()); // MailClient { provider=qq, address=user@qq.com }
let list = client.fetch({ limit: 20, unseenOnly: true });
list.forEach(m => console.log(m.uid, m.date, m.subject));
client.close();
```

---

<p style="font: bold 2em sans-serif; color: #FF7043">MailClient</p>

---

## [@] MailClient

**`6.8.0`**

由 [mail.connect](mail#m-connect), [mail.connectAsync](mail#m-connectasync) 或 [mail.setDefault](mail#m-setdefault) 得到, 不能用 `new` 构造.

## [p#] account

**`6.8.0`**

- { [Object](dataTypes#object) }

连接时传入的 [MailAccountOptions](mailAccountOptionsType) 副本, 去掉了 `password`, `accessToken` 与 `tokenProvider`; 使用令牌时补上 `auth: 'xoauth2'`. 只包含脚本写明的字段, 预设补全的服务器地址不在其中. 用别名连接时只有 `{ alias }`. 完整的归一化账户 (含预设补全的端点) 可从 [test](#m-test) 结果的 `account` 读取.

## [p#] isConnected

**`6.8.0`**

- { [boolean](dataTypes#boolean) }

与插件的会话当前是否可用. 插件进程退出或令牌刷新后为 `false`, 下一次调用会自动重新打开会话, 因此此值为 `false` 不代表客户端不可用. 此属性不反映到邮件服务器的套接字状态, 空闲后服务器断开的连接在下一次调用时自动重连.

## [p#] isClosed

**`6.8.0`**

- { [boolean](dataTypes#boolean) }

客户端是否已由 [close](#m-close) 关闭或随脚本退出关闭.

## [m#] test

### client.test()

**`6.8.0`**

- <ins>**returns**</ins> { [MailSessionTestResult](#mailsessiontestresult) } - 各端点的连通性报告

### client.testAsync()

**`6.8.0`** **`Async`**

- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [MailSessionTestResult](#mailsessiontestresult)

依次探测收信端点 (按 `receive` 只探测 IMAP 或 POP3 之一) 与 SMTP 端点, 读取各自的能力列表. 单个端点失败不抛出, 而是记录在对应报告的 `error` 中, 此时 `ok` 为 `false`.

```js
let report = client.test();
console.log(report.ok, report.elapsedMs);
console.log(report.imap.capabilities.includes('IDLE')); // 服务器是否支持推送.
console.log(report.smtp.ok, report.smtp.error);
```

## [m#] send

### client.send(message, options?)

**`6.8.0`**

- **message** { [MailSendMessage](mailMessageType#mailsendmessage) } - 待发送的邮件
- **[ options ]** { [Object](dataTypes#object) } - 发送选项
    - **[ saveToSent ]** { [boolean](dataTypes#boolean) } - 是否在发送后向 "已发送" 文件夹追加副本
- <ins>**returns**</ins> { [MailSendResult](#mailsendresult) } - 发送结果

### client.sendAsync(message, options?)

**`6.8.0`** **`Async`**

- **message** { [MailSendMessage](mailMessageType#mailsendmessage) } - 待发送的邮件
- **[ options ]** { [Object](dataTypes#object) } - 发送选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [MailSendResult](#mailsendresult)

通过 SMTP 发送邮件. 首次调用时建立 SMTP 连接, 之后复用. 发件人默认为账户地址与 `name`. 服务器拒绝邮件或全部收件人时抛出 `SEND_REJECTED`; 部分收件人被拒绝时正常返回, 被拒绝的地址列在结果的 `rejected` 中.

`saveToSent` 省略时, 服务器自动保存已发送邮件的服务商 (预设的 `autoSavesSent` 为 `true`, 如 Gmail, QQ, Outlook.com) 不再追加副本, 其余服务商在收信协议为 IMAP 时追加到预设或服务器标记的 "已发送" 文件夹. 显式传 `true` 或 `false` 分别强制追加或跳过 (服务器自动保存时 `true` 也不追加, 避免重复). 追加失败不影响发送结果, 只记录在 `saveError` 中.

```js
let result = client.send({
    to: ['a@example.com', { name: 'B', address: 'b@example.com' }],
    cc: 'c@example.com',
    subject: '周报',
    text: '纯文本正文',
    html: '<p>HTML 正文</p>',
    attachments: [
        '/sdcard/Download/report.pdf',
        { path: '/sdcard/Download/logo.png', contentId: 'logo', inline: true },
    ],
});
console.log(result.messageId, result.accepted.length, result.sentCopy);
```

## [m#] folders

### client.folders(options?)

**`6.8.0`**

- **[ options ]** { [Object](dataTypes#object) } - 列表选项
    - **[ subscribedOnly = false ]** { [boolean](dataTypes#boolean) } - 只列出已订阅的文件夹
    - **[ status = false ]** { [boolean](dataTypes#boolean) } - 同时读取各文件夹的邮件数与未读数
- <ins>**returns**</ins> { [MailFolder](#mailfolder)[[]](dataTypes#array) } - 文件夹树

### client.foldersAsync(options?)

**`6.8.0`** **`Async`**

- **[ options ]** { [Object](dataTypes#object) } - 列表选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [MailFolder](#mailfolder)[[]](dataTypes#array)

列出文件夹树, 子文件夹在各项的 `children` 中. `status` 为 `true` 时每个文件夹多一次服务器往返, 文件夹很多时耗时明显. POP3 只返回 `INBOX`.

```js
function walk(folders, depth) {
    folders.forEach(f => {
        console.log(' '.repeat(depth * 2) + f.path, f.specialUse || '', f.unseen);
        walk(f.children, depth + 1);
    });
}
walk(client.folders({ status: true }), 0);
```

## [m#] folder

### client.folder(path)

**`6.8.0`**

- **path** { [string](dataTypes#string) } - 文件夹路径
- <ins>**returns**</ins> { [Object](dataTypes#object) } - [文件夹对象](#文件夹对象-folder-object)

返回绑定到 `path` 的轻量对象, 不访问网络. 其方法见 [文件夹对象](#文件夹对象-folder-object).

## [m#] folderStatus

### client.folderStatus(path)

**`6.8.0`**

- **path** { [string](dataTypes#string) } - 文件夹路径
- <ins>**returns**</ins> { [MailFolderStatus](#mailfolderstatus) } - 文件夹状态

### client.folderStatusAsync(path)

**`6.8.0`** **`Async`**

- **path** { [string](dataTypes#string) } - 文件夹路径
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [MailFolderStatus](#mailfolderstatus)

读取文件夹的邮件数, 未读数, 下一个 UID 与 UIDVALIDITY. 文件夹不存在时抛出 `FOLDER_NOT_FOUND`. 仅 IMAP.

```js
let status = client.folderStatus('INBOX');
console.log(status.messages, status.unseen, status.uidNext);
```

## [m#] createFolder

### client.createFolder(path)

**`6.8.0`**

- **path** { [string](dataTypes#string) } - 新文件夹路径, 父级需已存在
- <ins>**returns**</ins> { [MailFolder](#mailfolder) } - 新建的文件夹

### client.createFolderAsync(path)

**`6.8.0`** **`Async`**

- **path** { [string](dataTypes#string) } - 新文件夹路径
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [MailFolder](#mailfolder)

创建并订阅文件夹. 仅 IMAP. 部分服务商 (如 QQ) 对新建文件夹的可见性有几十秒延迟.

## [m#] deleteFolder

### client.deleteFolder(path)

**`6.8.0`**

- **path** { [string](dataTypes#string) } - 文件夹路径
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 恒为 `true`

### client.deleteFolderAsync(path)

**`6.8.0`** **`Async`**

- **path** { [string](dataTypes#string) } - 文件夹路径
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 `true`

删除文件夹及其中的邮件. 文件夹不存在时抛出 `FOLDER_NOT_FOUND`. 仅 IMAP.

## [m#] renameFolder

### client.renameFolder(path, newPath)

**`6.8.0`**

- **path** { [string](dataTypes#string) } - 现有文件夹路径
- **newPath** { [string](dataTypes#string) } - 新路径
- <ins>**returns**</ins> { [MailFolder](#mailfolder) } - 改名后的文件夹

### client.renameFolderAsync(path, newPath)

**`6.8.0`** **`Async`**

- **path** { [string](dataTypes#string) } - 现有文件夹路径
- **newPath** { [string](dataTypes#string) } - 新路径
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [MailFolder](#mailfolder)

重命名或移动文件夹 (新路径含不同父级时). 仅 IMAP.

## [m#] fetch

### client.fetch(options?)

**`6.8.0`**

- **[ options ]** { [Object](dataTypes#object) } - 列表选项
    - **[ folder = `'INBOX'` ]** { [string](dataTypes#string) } - 文件夹路径
    - **[ limit = 50 ]** { [number](dataTypes#number) } - 最多返回的邮件数, 上限 1000
    - **[ before ]** { [number](dataTypes#number) | [string](dataTypes#string) } - 只返回 UID 小于此值的邮件, 用于向更早翻页
    - **[ after ]** { [number](dataTypes#number) | [string](dataTypes#string) } - 只返回 UID 大于此值的邮件, 用于取增量
    - **[ order = `'desc'` ]** { `'desc'` \| `'asc'` } - `'desc'` 最新在前, `'asc'` 最早在前
    - **[ unseenOnly = false ]** { [boolean](dataTypes#boolean) } - 只返回未读邮件 (仅 IMAP)
- <ins>**returns**</ins> { [MailMessage](mailMessageType)[[]](dataTypes#array) } - 邮件摘要列表

### client.fetchAsync(options?)

**`6.8.0`** **`Async`**

- **[ options ]** { [Object](dataTypes#object) } - 列表选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [MailMessage](mailMessageType)[[]](dataTypes#array)

列出文件夹中的邮件摘要 (信封, 标记, 大小与是否含附件, 不含正文). 需要正文时对单条结果调用 [load](mailMessageType#m-load) 或对客户端调用 [get](#m-get).

`before` 与 `after` 都是 UID 游标 (POP3 上为 UIDL 字符串), 不是日期. 按日期筛选请使用 [search](#m-search).

```js
// 翻页读取 INBOX 全部邮件, 每页 100 条.
let cursor = undefined;
while (true) {
    let page = client.fetch({ limit: 100, before: cursor });
    if (page.length === 0) break;
    page.forEach(m => console.log(m.uid, m.subject));
    cursor = page[page.length - 1].uid;
}
```

## [m#] search

### client.search(query, options?)

**`6.8.0`**

- **query** { [MailSearchQuery](mailSearchQueryType) } - 查询条件
- **[ options ]** { [Object](dataTypes#object) } - 搜索选项
    - **[ folder = `'INBOX'` ]** { [string](dataTypes#string) } - 文件夹路径
    - **[ limit = 50 ]** { [number](dataTypes#number) } - 最多返回的邮件数, 上限 1000
    - **[ before ]** { [number](dataTypes#number) | [string](dataTypes#string) } - 只返回 UID 小于此值的邮件
    - **[ fallback = `'client'` ]** { `'client'` \| `'none'` \| `'always'` } - 客户端过滤策略
- <ins>**returns**</ins> { [MailMessage](mailMessageType)[[]](dataTypes#array) } - 命中的邮件摘要, 最新在前; 数组附带不可枚举的 `fallback` 属性 (`'server'` 或 `'client'`) 说明命中来自服务器搜索还是客户端过滤

### client.searchAsync(query, options?)

**`6.8.0`** **`Async`**

- **query** { [MailSearchQuery](mailSearchQueryType) } - 查询条件
- **[ options ]** { [Object](dataTypes#object) } - 搜索选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [MailMessage](mailMessageType)[[]](dataTypes#array)

按条件搜索邮件. IMAP 上优先由服务器执行 SEARCH; 服务器拒绝该查询 (如不支持非 ASCII 关键字) 且 `fallback` 为 `'client'` 时, 改为在客户端拉取最近的信封逐条过滤, 最多扫描 2000 条. `'none'` 禁止客户端过滤, 服务器拒绝时直接抛出; `'always'` 不询问服务器, 适合服务器搜索漏掉刚送达邮件的服务商 (如 163 / 126).

POP3 只能在客户端过滤, 且只有信封字段可用 (最多扫描 200 条), `body` / `text` 等正文条件不可用.

```js
let hits = client.search({
    from: 'boss@example.com',
    subject: '验证码',
    since: '2026-09-01',
    seen: false,
}, { limit: 20 });
console.log(hits.length, hits.fallback);
```

## [m#] get

### client.get(uid, options?)

**`6.8.0`**

- **uid** { [number](dataTypes#number) | [string](dataTypes#string) | [MailMessage](mailMessageType) } - [UID 参数](mailMessageType#uid-参数-uid-argument)
- **[ options ]** { [Object](dataTypes#object) } - 读取选项
    - **[ folder = `'INBOX'` ]** { [string](dataTypes#string) } - 文件夹路径, 传 [MailMessage](mailMessageType) 时默认为其 `folder`
    - **[ peek = true ]** { [boolean](dataTypes#boolean) } - 读取时不将邮件标记为已读
    - **[ includeRaw = false ]** { [boolean](dataTypes#boolean) } - 同时返回原始 MIME 文本 (`raw`)
- <ins>**returns**</ins> { [MailMessage](mailMessageType) } - 含正文, 头与附件列表的完整邮件

### client.getAsync(uid, options?)

**`6.8.0`** **`Async`**

- **uid** { [number](dataTypes#number) | [string](dataTypes#string) | [MailMessage](mailMessageType) } - [UID 参数](mailMessageType#uid-参数-uid-argument)
- **[ options ]** { [Object](dataTypes#object) } - 读取选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [MailMessage](mailMessageType)

读取一封邮件的正文 (`text`, `html`), 全部头 (`headers`) 与附件列表 (`attachments`, 只含元数据, 附件内容需另行 [download](#m-download)). 内联正文总量超过 256 KiB 时被截断, 此时 `bodyTruncated` 为 `true`, 未内联的部分列在 `bodyParts` 中. 邮件不存在时抛出 `MESSAGE_NOT_FOUND`.

```js
let message = client.get(4711, { peek: false }); // 读取并标记为已读.
console.log(message.subject, message.from.toString());
console.log(message.text || message.html);
console.log(message.headers['message-id']);
```

## [m#] fetchBody

### client.fetchBody(uid, options?)

**`6.8.0`**

### client.fetchBodyAsync(uid, options?)

**`6.8.0`** **`Async`**

[get](#m-get) / [getAsync](#m-get) 的别名, 参数与结果完全相同.

## [m#] download

### client.download(attachment, target?, options?)

**`6.8.0`**

- **attachment** { [MailAttachment](mailMessageType#mailattachment) | [Object](dataTypes#object) } - [get](#m-get) 返回的附件对象, 或 `{ uid, partId, folder?, fileName? }`
- **[ target = `files.cwd()` ]** { [string](dataTypes#string) } - 目标目录或文件路径
- **[ options ]** { [Object](dataTypes#object) } - 下载选项
    - **[ folder ]** { [string](dataTypes#string) } - 文件夹路径, 默认取附件对象的 `folder`
    - **[ overwrite = false ]** { [boolean](dataTypes#boolean) } - 目标文件已存在时是否覆盖
- <ins>**returns**</ins> { [string](dataTypes#string) } - 落盘文件的绝对路径

### client.downloadAsync(attachment, target?, options?)

**`6.8.0`** **`Async`**

- **attachment** { [MailAttachment](mailMessageType#mailattachment) | [Object](dataTypes#object) } - 附件对象或 `{ uid, partId }`
- **[ target = `files.cwd()` ]** { [string](dataTypes#string) } - 目标目录或文件路径
- **[ options ]** { [Object](dataTypes#object) } - 下载选项
    - **[ folder ]** { [string](dataTypes#string) } - 文件夹路径
    - **[ overwrite = false ]** { [boolean](dataTypes#boolean) } - 是否覆盖同名文件
    - **[ onProgress ]** { [Function](dataTypes#function) } - 进度回调 `(transferred, total)`, `total` 未知时为 `null`
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为落盘文件的绝对路径

将附件流式写入文件. `target` 为目录 (已存在或以分隔符结尾) 时使用附件的 `fileName` 作为文件名; 为文件路径时按该路径保存. `overwrite` 为 `false` 且目标已存在时自动改用带序号的新文件名, 不会覆盖. 附件不存在时抛出 `ATTACHMENT_NOT_FOUND`, 超过 200 MiB 时抛出 `LIMIT_EXCEEDED`. 进度回调只在 `Async` 形态可用.

```js
let message = client.get(4711);
message.attachments.forEach(a => {
    let path = client.download(a, files.join(files.cwd(), 'attachments'));
    console.log(a.fileName, a.size, path);
});
client.downloadAsync({ uid: 4711, partId: '2' }, '/sdcard/Download/', {
    onProgress: (done, total) => console.log(done, total),
}).then(path => console.log(path));
```

附件对象自身也有 [download](mailMessageType#m-download) 方法, 等价于此方法.

## [m#] raw

### client.raw(uid, target?, options?)

**`6.8.0`**

- **uid** { [number](dataTypes#number) | [string](dataTypes#string) | [MailMessage](mailMessageType) } - [UID 参数](mailMessageType#uid-参数-uid-argument)
- **[ target = `files.cwd()` ]** { [string](dataTypes#string) } - 目标目录或文件路径, 目录时文件名为 `<uid>.eml`
- **[ options ]** { [Object](dataTypes#object) } - 下载选项
    - **[ folder = `'INBOX'` ]** { [string](dataTypes#string) } - 文件夹路径
    - **[ overwrite = false ]** { [boolean](dataTypes#boolean) } - 是否覆盖同名文件
- <ins>**returns**</ins> { [string](dataTypes#string) } - 落盘文件的绝对路径

### client.rawAsync(uid, target?, options?)

**`6.8.0`** **`Async`**

- **uid** { [number](dataTypes#number) | [string](dataTypes#string) | [MailMessage](mailMessageType) } - [UID 参数](mailMessageType#uid-参数-uid-argument)
- **[ target = `files.cwd()` ]** { [string](dataTypes#string) } - 目标目录或文件路径
- **[ options ]** { [Object](dataTypes#object) } - 下载选项, 另支持 `onProgress` 进度回调
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为落盘文件的绝对路径

将整封邮件的原始 MIME 内容 (`.eml`) 写入文件, 大小上限与附件相同. 只需在脚本中读取原文时, 可改用 [get](#m-get) 的 `includeRaw` 选项.

```js
console.log(client.raw(4711, '/sdcard/Download/'));
```

## [m#] setFlags

### client.setFlags(uids, flags, mode?, options?)

**`6.8.0`**

- **uids** { [number](dataTypes#number) | [string](dataTypes#string) | [MailMessage](mailMessageType) | [Array](dataTypes#array) } - 一个或多个 [UID 参数](mailMessageType#uid-参数-uid-argument)
- **flags** { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) } - 标记名, 系统标记 `'seen'`, `'flagged'`, `'answered'`, `'draft'`, `'deleted'` 或自定义关键字
- **[ mode = `'add'` ]** { `'add'` \| `'remove'` \| `'set'` } - 添加, 移除或整体替换
- **[ options ]** { [Object](dataTypes#object) } - 选项
    - **[ folder = `'INBOX'` ]** { [string](dataTypes#string) } - 文件夹路径
- <ins>**returns**</ins> { [Array](dataTypes#array) } - 受影响的 UID 数组

### client.setFlagsAsync(uids, flags, mode?, options?)

**`6.8.0`** **`Async`**

- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为受影响的 UID 数组

修改邮件标记. 自定义关键字 (如 `'$Important'`, `'Project-X'`) 由服务器决定是否持久保存, Gmail, QQ 与 163 均可保存. `'recent'` 是只读标记, 不能设置. 仅 IMAP.

```js
client.setFlags([4711, 4712], ['seen', 'Project-X']);
client.setFlags(4711, 'flagged', 'remove');
client.setFlags(4711, ['seen'], 'set', { folder: 'Archive' }); // 替换为只有已读.
```

## [m#] markRead

### client.markRead(uids, options?)

**`6.8.0`**

### client.markReadAsync(uids, options?)

**`6.8.0`** **`Async`**

相当于 `setFlags(uids, 'seen', 'add', options)`.

## [m#] markUnread

### client.markUnread(uids, options?)

**`6.8.0`**

### client.markUnreadAsync(uids, options?)

**`6.8.0`** **`Async`**

相当于 `setFlags(uids, 'seen', 'remove', options)`.

## [m#] flag

### client.flag(uids, options?)

**`6.8.0`**

### client.flagAsync(uids, options?)

**`6.8.0`** **`Async`**

相当于 `setFlags(uids, 'flagged', 'add', options)`, 即加星标.

## [m#] unflag

### client.unflag(uids, options?)

**`6.8.0`**

### client.unflagAsync(uids, options?)

**`6.8.0`** **`Async`**

相当于 `setFlags(uids, 'flagged', 'remove', options)`.

## [m#] move

### client.move(uids, folder, options?)

**`6.8.0`**

- **uids** { [number](dataTypes#number) | [string](dataTypes#string) | [MailMessage](mailMessageType) | [Array](dataTypes#array) } - 一个或多个 [UID 参数](mailMessageType#uid-参数-uid-argument)
- **folder** { [string](dataTypes#string) } - 目标文件夹路径
- **[ options ]** { [Object](dataTypes#object) } - 选项
    - **[ from = `'INBOX'` ]** { [string](dataTypes#string) } - 来源文件夹路径
- <ins>**returns**</ins> { [Array](dataTypes#array) | [boolean](dataTypes#boolean) } - 服务器支持 UIDPLUS 时为邮件在目标文件夹中的新 UID 数组, 否则为 `true`

### client.moveAsync(uids, folder, options?)

**`6.8.0`** **`Async`**

- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值同上

移动邮件. 服务器支持 MOVE 时原子完成, 否则以复制加删除加清除模拟. 仅 IMAP.

```js
let moved = client.move(client.search({ from: 'newsletter@example.com' }), 'Newsletters');
console.log(moved);
```

## [m#] copy

### client.copy(uids, folder, options?)

**`6.8.0`**

### client.copyAsync(uids, folder, options?)

**`6.8.0`** **`Async`**

参数与返回值同 [move](#m-move), 但保留来源邮件. 仅 IMAP.

## [m#] delete

### client.delete(uids, options?)

**`6.8.0`**

- **uids** { [number](dataTypes#number) | [string](dataTypes#string) | [MailMessage](mailMessageType) | [Array](dataTypes#array) } - 一个或多个 [UID 参数](mailMessageType#uid-参数-uid-argument)
- **[ options ]** { [Object](dataTypes#object) } - 选项
    - **[ folder = `'INBOX'` ]** { [string](dataTypes#string) } - 文件夹路径
    - **[ expunge = false ]** { [boolean](dataTypes#boolean) } - IMAP 上是否随即清除
- <ins>**returns**</ins> { [Array](dataTypes#array) } - 受影响的 UID 数组

### client.deleteAsync(uids, options?)

**`6.8.0`** **`Async`**

- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为受影响的 UID 数组

IMAP 上为邮件添加 `deleted` 标记, `expunge` 为 `true` 时立即清除, 否则邮件保留到下次 [expunge](#m-expunge). 服务商对带 `deleted` 标记邮件的处理各不相同 (隐藏, 移入回收站或保留在列表中), 需要确定结果时使用 `expunge: true`. POP3 上标记 `DELE`, 在本次调用结束时提交, 不可撤销.

## [m#] expunge

### client.expunge(folder?)

**`6.8.0`**

- **[ folder = `'INBOX'` ]** { [string](dataTypes#string) } - 文件夹路径
- <ins>**returns**</ins> { [number](dataTypes#number) } - 清除的邮件数

### client.expungeAsync(folder?)

**`6.8.0`** **`Async`**

- **[ folder = `'INBOX'` ]** { [string](dataTypes#string) } - 文件夹路径
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为清除的邮件数

永久删除文件夹中带 `deleted` 标记的邮件. 仅 IMAP.

## [m#] append

### client.append(folder, message, flags?)

**`6.8.0`**

- **folder** { [string](dataTypes#string) } - 目标文件夹路径
- **message** { [MailSendMessage](mailMessageType#mailsendmessage) } - 邮件内容, 字段与发送相同
- **[ flags ]** { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) } - 初始标记, 如 `['seen']` 或 `['draft']`
- <ins>**returns**</ins> { [number](dataTypes#number) | [null](dataTypes#null) } - 服务器报告 APPENDUID 时为新邮件的 UID, 否则为 `null`

### client.appendAsync(folder, message, flags?)

**`6.8.0`** **`Async`**

- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为新 UID 或 `null`

不经 SMTP 发送, 直接把一封邮件写入文件夹, 常用于保存草稿或归档. 仅 IMAP.

```js
let uid = client.append('Drafts', { to: 'you@example.com', subject: '草稿', text: '稍后补充' }, ['draft']);
console.log(uid);
```

## [m#] watch

### client.watch(folder?, options?)

**`6.8.0`**

- **[ folder = `'INBOX'` ]** { [string](dataTypes#string) } - 监听的文件夹路径
- **[ options ]** { [Object](dataTypes#object) } - 监听选项 (只传一个对象参数时也可把 `folder` 写在其中)
    - **[ mode = `'auto'` ]** { `'auto'` \| `'idle'` \| `'poll'` } - `'auto'` 在服务器支持 IDLE 时推送, 否则轮询; `'idle'` 强制推送 (不支持时以错误关闭); `'poll'` 强制轮询
    - **[ pollIntervalMs = 60000 ]** { [number](dataTypes#number) } - 轮询间隔, 最小 15000
    - **[ fetchBody = false ]** { [boolean](dataTypes#boolean) } - `message` 事件的邮件是否已含正文
    - **[ reconnect = true ]** { [boolean](dataTypes#boolean) } - 连接断开后是否自动重连并继续监听
- <ins>**returns**</ins> { [MailWatch](#mailwatch) } - 监听对象

开始监听文件夹的新邮件, 立即返回, 事件在脚本线程上派发, 因此脚本需保持运行 (如 UI 模式, `setInterval` 或事件循环), 不需要也不应使用 `sleep` 循环等待. 每个客户端最多同时打开 4 个监听, 超出时抛出 `LIMIT_EXCEEDED`.

监听在插件进程中运行. Gmail 的 IDLE 推送约在送达后 30 秒内到达, Outlook.com 约 10 秒; QQ, Sina 接受 IDLE 但不推送, 163 / 126 不支持 IDLE, 这些服务商在 `'auto'` 下自动轮询 (QQ 的新邮件在送达后 15 到 40 秒可见). 服务器周期性断开连接时插件自动重连, 不产生 `error` 事件; 无法保证增量连续时触发 `resync`. 详见 [MailWatch](#mailwatch) 与预设的 `idlePush` 字段.

```js
let watch = client.watch({ folder: 'INBOX', mode: 'auto', fetchBody: true });
watch.on('message', (m, w) => console.log(w.mode, m.uid, m.subject));
watch.on('mode', mode => console.log('mode:', mode));
watch.on('resync', reason => console.log('resync:', reason));
watch.on('error', e => console.warn(e.toString()));
watch.on('close', reason => console.log('closed:', reason));
```

## [m#] close

### client.close()

**`6.8.0`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

停止本客户端的全部监听并关闭连接. 重复调用无副作用. 之后的方法调用失败于 `SESSION_CLOSED`. 若本客户端是默认客户端, 默认设置同时清除.

## [m#] toString

### client.toString()

**`6.8.0`**

- <ins>**returns**</ins> { [string](dataTypes#string) } - 形如 `MailClient { provider=qq, address=user@qq.com }`

## 文件夹对象 (Folder Object)

[client.folder(path)](#m-folder) 返回的对象把文件夹路径绑定到客户端, 方法与 [folderStatus](#m-folderstatus), [createFolder](#m-createfolder), [deleteFolder](#m-deletefolder), [renameFolder](#m-renamefolder) 一一对应, 各自也有 `Async` 形态.

| 成员 | 说明 |
| --- | --- |
| `path` | 文件夹路径 |
| `name` | 路径的最后一段 |
| `status()` / `statusAsync()` | 等价于 `client.folderStatus(path)` |
| `create()` / `createAsync()` | 等价于 `client.createFolder(path)` |
| `delete()` / `deleteAsync()` | 等价于 `client.deleteFolder(path)` |
| `rename(newPath)` / `renameAsync(newPath)` | 等价于 `client.renameFolder(path, newPath)` |
| `toString()` | 返回 `path` |

```js
let archive = client.folder('Archive/2026');
if (!client.folders().some(f => f.path === archive.path)) {
    archive.create();
}
console.log(archive.status().messages);
```

## MailFolder

[folders](#m-folders), [createFolder](#m-createfolder) 与 [renameFolder](#m-renamefolder) 返回的文件夹对象.

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `name` | string | 显示名, 即路径的最后一段 |
| `path` | string | 完整路径, 作为其他方法的 `folder` 参数 |
| `delimiter` | string \| null | 层级分隔符, 如 `'/'` 或 `'.'` |
| `specialUse` | string \| null | 文件夹用途: `'inbox'`, `'sent'`, `'drafts'`, `'trash'`, `'junk'`, `'archive'`, `'all'`, `'flagged'`, `'important'` 或 `null`. 来自服务器的 SPECIAL-USE 属性, 服务器不提供时按常见文件夹名推断 |
| `selectable` | boolean | 能否打开 (纯目录节点为 `false`) |
| `subscribed` | boolean | 是否已订阅 |
| `messages` | number \| null | 邮件数, 仅 `status: true` 时存在 |
| `unseen` | number \| null | 未读数, 仅 `status: true` 时存在 |
| `children` | MailFolder[] | 子文件夹 |

## MailFolderStatus

[folderStatus](#m-folderstatus) 返回的对象.

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `name` | string | 显示名 |
| `path` | string | 完整路径 |
| `messages` | number | 邮件数 |
| `unseen` | number | 未读数 |
| `recent` | number \| null | 自上次打开以来的新邮件数, 服务器不报告时为 `null` |
| `uidNext` | number \| null | 下一封邮件将获得的 UID |
| `uidValidity` | number \| null | UID 有效期标识, 变化时以前保存的 UID 全部失效 |

## MailSendResult

[send](#m-send) 返回的对象.

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `messageId` | string | 邮件的 Message-ID |
| `accepted` | string[] | 服务器接受的收件人地址 |
| `rejected` | string[] | 服务器拒绝的收件人地址 |
| `savedToSent` | boolean | 是否已由插件追加副本到 "已发送" 文件夹 |
| `sentCopy` | string | 副本来源: `'server'` (服务商自动保存), `'appended'` (插件追加), `'failed'` (追加失败) 或 `'none'` (未保存) |
| `sentFolder` | string \| null | 副本所在文件夹 |
| `saveError` | string \| null | 追加失败时的原因 |
| `elapsedMs` | number | 总耗时 (毫秒) |

## MailSessionTestResult

[test](#m-test) 返回的对象.

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `ok` | boolean | 所有探测的端点都成功 |
| `account` | Object | 不含凭据的账户快照, 同 [account](#p-account) |
| `imap` | Object \| null | IMAP 端点报告, 收信协议为 POP3 时为 `null` |
| `pop3` | Object \| null | POP3 端点报告, 收信协议为 IMAP 时为 `null` |
| `smtp` | Object \| null | SMTP 端点报告, 未配置 SMTP 时为 `null` |
| `elapsedMs` | number | 总耗时 (毫秒) |

端点报告包含 `protocol`, `host`, `port`, `tls`, `ok`, `elapsedMs`, `capabilities` (服务器宣告的能力或扩展, 如 `'IDLE'`, `'UIDPLUS'`, `'MOVE'`, `'SIZE'`) 与 `error` (失败时为 `{ code, message, details, retryable }`, 否则为 `null`).

## MailWatch

[watch](#m-watch) 返回的监听对象, 是 [EventEmitter](eventEmitterType) 的实例, `on` / `once` 返回自身以便链式调用.

### 属性 (Properties)

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `folder` | string | 监听的文件夹路径 |
| `mode` | string \| null | 当前推送方式 `'idle'` 或 `'poll'`, 尚未确定时为 `null` |
| `generation` | number | 重连代数, 每次重连后加一 |
| `isActive` | boolean | 是否仍在监听 |
| `isClosed` | boolean | 是否已关闭 |
| `state` | string | `'active'` 或 `'closed'` |
| `reason` | string \| null | 关闭原因, 未关闭时为 `null` |

### 方法 (Methods)

| 方法 | 说明 |
| --- | --- |
| `stop()` | 停止监听, 随后触发 `close` 事件 (原因 `'stopped'`). 重复调用无副作用 |
| `on(event, listener)` / `once(event, listener)` | 注册监听器, 返回自身 |

### 事件 (Events)

| 事件 | 回调参数 | 说明 |
| --- | --- | --- |
| `message` | `(message: MailMessage, watch: MailWatch)` | 新邮件到达. `fetchBody: true` 时已含正文, 否则只有摘要, 可用 `message.load()` 读取 |
| `mode` | `(mode: 'idle' \| 'poll')` | 推送方式确定或切换 |
| `resync` | `(reason: string)` | 插件无法保证增量连续 (如 `'rewatched'` 重连后, `'queue-overflow'` 事件积压超过 256 条), 脚本应自行 [fetch](#m-fetch) 补齐 |
| `error` | `(err: MailError)` | 可恢复错误 (会继续重连) 或不可恢复错误 (随后 `close`) |
| `close` | `(reason: string)` | 监听已结束, 不再有事件. 原因: `'stopped'`, `'error'`, `'closed'` (客户端关闭), `'script-exit'`, `'plugin-died'`, `'overflow'` |

建议始终注册 `error` 与 `close` 监听器, 否则监听因不可恢复错误结束时脚本无从得知.

## 限制 (Limits)

| 项目 | 上限 |
| --- | --- |
| 单次 `fetch` / `search` 返回数 | 1000 (默认 50) |
| 客户端过滤扫描的信封数 | IMAP 2000, POP3 200 |
| 内联正文 (`text` + `html`) | 256 KiB, 超出后 `bodyTruncated` |
| 单个附件或原始邮件 | 200 MiB |
| 每封邮件的附件数 | 64 |
| 收件人总数 (to + cc + bcc) | 500 |
| 自定义头数 / 头值长度 | 32 / 998 字符 |
| 每个客户端的监听数 | 4 |
| 监听事件队列 | 256 |
| 轮询间隔 | 15 秒到 1 小时 |
| 超时设置 | 每项最长 10 分钟 |

超出上限的调用抛出 `LIMIT_EXCEEDED`.
