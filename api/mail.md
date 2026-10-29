# 邮件 (Mail)

<!-- runtime-support:begin mail -->
<!-- 本段由 generator/runtime-support.js 根据 AutoJs6 运行时覆盖矩阵生成, 不要手动修改; 数据源 ksp -->

| 运行时支持 | Rhino | Node.js 主线程 | Node.js Worker | Bun |
| --- | --- | --- | --- | --- |
| 入口 | `mail` | `autojs6:mail`, `$autojs.mail` | `autojs6:mail`, `$autojs.mail` | `host.mail` |
| 状态 | 已支持 56 项 | 已支持 56 项 | 已支持 56 项 | 需授权 56 项 |
| 授权 | - | - | - | `mail.control` 56 项 |

各 API 在同一运行时中的入口, 状态与授权一致, 没有差异项.

Node.js 与 Bun 的导入方式, 异步返回值与授权检查见 [运行时 API](runtimeApis#执行方式).

<!-- runtime-support:end -->

`mail` 模块用于在脚本中通过 IMAP, POP3 和 SMTP 协议收发, 搜索, 整理和监听邮件.

从 AutoJs6 6.8.0 起, 邮件功能由外置 3-Stamp Mail 插件 (AutoJs6-Plugin-Three-Stamp-Mail) 提供. 调用前需在插件中心安装, 启用并授权与当前 AutoJs6 兼容的插件. 插件缺失, 被禁用, 未授权, 版本不兼容, 服务绑定失败或插件进程退出时, 方法会抛出 (或以 Promise 拒绝) `code` 为 `PLUGIN_UNAVAILABLE` 的 [MailError](#c-mailerror).

网络操作均由 [MailClient](mailClientType) 实例完成. [mail.connect](#m-connect) 建立客户端后, 可直接调用其方法, 也可通过 [mail.setDefault](#m-setdefault) 指定默认客户端, 再以 `mail.fetch()` 这类 [转发方法](#转发方法-forwarded-methods) 省略客户端引用.

每个网络方法都有同步形态 `x(...)` 与异步形态 `xAsync(...)`, 二者参数与结果完全一致. 同步形态阻塞当前脚本线程直至插件返回结果或调用失败, 停止脚本会取消尚未完成的调用; 异步形态立即返回 [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise), 回调在脚本线程执行. 只与本地状态打交道的成员 (`providers`, `accounts`, `setDefault`, `close`, `folder`, `watch`) 没有 `Async` 形态.

账户凭据 (授权码, 应用专用密码或 OAuth 令牌) 可写在 [MailAccountOptions](mailAccountOptionsType) 中, 也可在插件设置页保存为账户别名后以 `mail.connect('别名')` 使用. 后者不需要在脚本中保存任何凭据. 插件日志与 `debug` 输出只记录域名, 端口与耗时, 不记录凭据和邮件正文.

本模块注册为全局名称 `mail`, 并提供 `$mail` 别名. 本页的同步/异步区分适用于 Rhino; Node.js/Bun/Worker 的 Promise 签名, 独立授权和打包应用账户边界见 [Runtime APIs](runtimeApis).

```js
let client = mail.connect({ provider: 'qq', address: 'user@qq.com', password: '授权码' });
client.fetch({ limit: 5 }).forEach(m => console.log(m.subject, m.from.toString()));
client.close();
```

---

<p style="font: bold 2em sans-serif; color: #FF7043">mail</p>

---

## [m] connect

### mail.connect(options)

**`6.8.0`** **`Overload 1/2`**

- **options** { [MailAccountOptions](mailAccountOptionsType) } - 账户选项
- <ins>**returns**</ins> { [MailClient](mailClientType) } - 已建立会话的客户端

按账户选项建立与插件的会话. 选项对象会像 `JSON.stringify` 一样序列化后交给插件, 函数 (`tokenProvider` 除外) 与 `undefined` 值被忽略. 选项形态错误 (如缺少 `address`, 既没有 `provider` 也没有任何服务器地址) 在此处抛出 `INVALID_ARGUMENT`.

此方法不访问邮件服务器. 收信协议 (IMAP 或 POP3) 在首次调用网络方法时连接并登录, SMTP 在首次发信时连接, 之后各自复用. 因此登录失败的 `AUTH_FAILED`, 服务器不提供与凭据类型匹配的认证方式时的 `AUTH_MECHANISM_UNSUPPORTED`, 以及无法建立连接时可重试的 `CONNECT_FAILED`, 都在首次网络方法处抛出. 需要立即验证账户时可调用 [client.test](mailClientType#m-test).

`provider` 省略时不会按地址域名推断预设, 此时必须写明 `imap` (或 `pop3`) 与 `smtp` 的服务器地址. 需要推断时可先调用 [mail.providers.resolve](#p-providers).

```js
let client = mail.connect({
    provider: '163',
    address: 'me@163.com',
    password: '授权码',
});
console.log(client.account.provider); // 163
```

使用 OAuth 令牌时以 `accessToken` 传入当前令牌, 或以 `tokenProvider` 提供一个同步返回令牌字符串的函数, 令牌失效后插件会再次调用它:

```js
let client = mail.connect({
    provider: 'gmail',
    address: 'me@gmail.com',
    tokenProvider: () => http.get('https://example.com/token').body.string(),
});
```

### mail.connect(alias)

**`6.8.0`** **`Overload 2/2`**

- **alias** { [string](dataTypes#string) } - 插件设置页保存的账户别名
- <ins>**returns**</ins> { [MailClient](mailClientType) } - 已建立会话的客户端

按别名使用插件中保存的账户, 凭据由插件持有, 不会经过脚本. 别名不存在时抛出 `ACCOUNT_NOT_FOUND`. 可用别名可通过 [mail.accounts.list](#p-accounts) 查询.

```js
let client = mail.connect('work');
console.log(client.account.address);
```

## [m] connectAsync

### mail.connectAsync(options)

**`6.8.0`** **`Async`** **`Overload 1/2`**

- **options** { [MailAccountOptions](mailAccountOptionsType) } - 账户选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [MailClient](mailClientType)

### mail.connectAsync(alias)

**`6.8.0`** **`Async`** **`Overload 2/2`**

- **alias** { [string](dataTypes#string) } - 插件设置页保存的账户别名
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [MailClient](mailClientType)

[mail.connect](#m-connect) 的异步形态. 参数不合法时 Promise 同样被拒绝, 而不是同步抛出.

```js
mail.connectAsync('work')
    .then(client => client.fetchAsync({ unseenOnly: true, limit: 3 }))
    .then(list => list.forEach(m => console.log(m.subject)))
    .catch(e => console.error(e.toString()));
```

## [m] setDefault

### mail.setDefault(client)

**`6.8.0`** **`Overload 1/3`**

- **client** { [MailClient](mailClientType) } - 已建立会话的客户端
- <ins>**returns**</ins> { [MailClient](mailClientType) } - 参数本身

将客户端设为默认客户端, 之后 [转发方法](#转发方法-forwarded-methods) 与 [mail.close](#m-close) 作用于它. 默认客户端关闭后需再次设置.

### mail.setDefault(options)

**`6.8.0`** **`Overload 2/3`**

- **options** { [MailAccountOptions](mailAccountOptionsType) } - 账户选项
- <ins>**returns**</ins> { [MailClient](mailClientType) } - 新建的客户端

### mail.setDefault(alias)

**`6.8.0`** **`Overload 3/3`**

- **alias** { [string](dataTypes#string) } - 账户别名
- <ins>**returns**</ins> { [MailClient](mailClientType) } - 新建的客户端

相当于 `mail.setDefault(mail.connect(optionsOrAlias))`.

```js
mail.setDefault('work');
console.log(mail.fetch({ limit: 1 })[0].subject);
mail.close();
```

## [p] default

### mail.default

**`6.8.0`** **`Getter`**

- { [MailClient](mailClientType) | [null](dataTypes#null) }

当前默认客户端, 未设置时为 `null`.

## [m] close

### mail.close()

**`6.8.0`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

关闭默认客户端并清除默认设置. 没有默认客户端时不做任何事. 关闭其他客户端请调用其自身的 [close](mailClientType#m-close) 方法.

脚本退出时所有客户端与监听会自动关闭.

## [p+] providers

### mail.providers.list()

**`6.8.0`**

- <ins>**returns**</ins> { [Object](dataTypes#object)[[]](dataTypes#array) } - 全部服务商预设

返回插件内置的服务商预设列表. 每项包含 `id`, `name`, `domains`, `imap`, `pop3`, `smtp`, `auth`, `authHint`, `autoSavesSent`, `sentFolder`, `requiresClientId`, `idlePush`, `pop3Xoauth2TwoLine`, `docsUrl` 与 `notes`, 含义见 [MailAccountOptions](mailAccountOptionsType#服务商预设-provider-presets).

```js
mail.providers.list().forEach(p => console.log(p.id, p.imap.host, p.auth.join('/')));
```

### mail.providers.get(id)

**`6.8.0`**

- **id** { [string](dataTypes#string) } - 预设 ID, 如 `'qq'`, `'163'`, `'gmail'`
- <ins>**returns**</ins> { [Object](dataTypes#object) | [null](dataTypes#null) } - 预设, 不存在时为 `null`

### mail.providers.resolve(address)

**`6.8.0`**

- **address** { [string](dataTypes#string) } - 邮箱地址
- <ins>**returns**</ins> { [Object](dataTypes#object) | [null](dataTypes#null) } - 域名匹配的预设, 无匹配时为 `null`

按地址的域名查找预设. [mail.connect](#m-connect) 不会自动这样推断, 需要时由脚本把结果的 `id` 写入 `provider`.

```js
let preset = mail.providers.resolve('someone@foxmail.com');
console.log(preset.id); // qq
let client = mail.connect({ provider: preset.id, address: 'someone@foxmail.com', password: '授权码' });
```

## [p+] accounts

### mail.accounts.list()

**`6.8.0`**

- <ins>**returns**</ins> { [Object](dataTypes#object)[[]](dataTypes#array) } - 插件设置页保存的账户

每项包含 `alias`, `address`, `user`, `name`, `provider`, `auth`, `receive`, `imap`, `pop3`, `smtp`, `default` 与 `updatedAt`, 不包含任何凭据. 在插件设置页经浏览器以 Google / Microsoft 账号登录的账户 (Angus Mail 1.2.0) 另有 `oauth` 对象 (`provider` 为 `google` 或 `microsoft`, `authorizedAt` 与 `expiresAt` 为 UTC 毫秒, `needsReauth` 为 true 时表示刷新被拒, 需在插件设置页重新登录), 其 `auth` 为 `xoauth2`, 访问令牌由插件自行续期, 令牌本身不会出现在这里. 保存的账户无法解析时只包含 `alias` 与 `error`. 字段含义见 [MailAccountOptions](mailAccountOptionsType#保存的账户-saved-accounts).

### mail.accounts.has(alias)

**`6.8.0`**

- **alias** { [string](dataTypes#string) } - 账户别名
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 别名是否存在

```js
if (mail.accounts.has('work')) {
    mail.setDefault('work');
}
```

## 转发方法 (Forwarded Methods)

[MailClient](mailClientType) 的每个网络方法都在 `mail` 上镜像为同名方法, 并转发到默认客户端. 没有默认客户端时抛出 (异步形态则拒绝为) `NO_DEFAULT_ACCOUNT`.

| mail 方法 | 等价调用 | Async 形态 |
| --- | --- | --- |
| `mail.test()` | [client.test()](mailClientType#m-test) | `mail.testAsync()` |
| `mail.send(message, options?)` | [client.send()](mailClientType#m-send) | `mail.sendAsync()` |
| `mail.folders(options?)` | [client.folders()](mailClientType#m-folders) | `mail.foldersAsync()` |
| `mail.folder(path)` | [client.folder()](mailClientType#m-folder) | 无 |
| `mail.folderStatus(path)` | [client.folderStatus()](mailClientType#m-folderstatus) | `mail.folderStatusAsync()` |
| `mail.createFolder(path)` | [client.createFolder()](mailClientType#m-createfolder) | `mail.createFolderAsync()` |
| `mail.deleteFolder(path)` | [client.deleteFolder()](mailClientType#m-deletefolder) | `mail.deleteFolderAsync()` |
| `mail.renameFolder(path, newPath)` | [client.renameFolder()](mailClientType#m-renamefolder) | `mail.renameFolderAsync()` |
| `mail.fetch(options?)` | [client.fetch()](mailClientType#m-fetch) | `mail.fetchAsync()` |
| `mail.search(query, options?)` | [client.search()](mailClientType#m-search) | `mail.searchAsync()` |
| `mail.get(uid, options?)` | [client.get()](mailClientType#m-get) | `mail.getAsync()` |
| `mail.fetchBody(uid, options?)` | [client.fetchBody()](mailClientType#m-fetchbody) | `mail.fetchBodyAsync()` |
| `mail.download(attachment, target?, options?)` | [client.download()](mailClientType#m-download) | `mail.downloadAsync()` |
| `mail.raw(uid, target?, options?)` | [client.raw()](mailClientType#m-raw) | `mail.rawAsync()` |
| `mail.setFlags(uids, flags, mode?, options?)` | [client.setFlags()](mailClientType#m-setflags) | `mail.setFlagsAsync()` |
| `mail.markRead(uids, options?)` | [client.markRead()](mailClientType#m-markread) | `mail.markReadAsync()` |
| `mail.markUnread(uids, options?)` | [client.markUnread()](mailClientType#m-markunread) | `mail.markUnreadAsync()` |
| `mail.flag(uids, options?)` | [client.flag()](mailClientType#m-flag) | `mail.flagAsync()` |
| `mail.unflag(uids, options?)` | [client.unflag()](mailClientType#m-unflag) | `mail.unflagAsync()` |
| `mail.move(uids, folder, options?)` | [client.move()](mailClientType#m-move) | `mail.moveAsync()` |
| `mail.copy(uids, folder, options?)` | [client.copy()](mailClientType#m-copy) | `mail.copyAsync()` |
| `mail.delete(uids, options?)` | [client.delete()](mailClientType#m-delete) | `mail.deleteAsync()` |
| `mail.expunge(folder?)` | [client.expunge()](mailClientType#m-expunge) | `mail.expungeAsync()` |
| `mail.append(folder, message, flags?)` | [client.append()](mailClientType#m-append) | `mail.appendAsync()` |
| `mail.watch(folder?, options?)` | [client.watch()](mailClientType#m-watch) | 无 |

```js
mail.setDefault('work');
let unread = mail.search({ seen: false, since: '2026-09-01' });
console.log(unread.length, unread.fallback); // 命中数与检索方式 (server 或 client).
mail.markRead(unread);
```

以下各条目的参数, 结果与错误同对应的 [MailClient](mailClientType) 方法, 只列出签名与要点. 示例中的 `'work'` 是插件设置页保存的账户别名.

## [m] test

### mail.test()

**`6.8.0`**

- <ins>**returns**</ins> { [MailSessionTestResult](mailClientType#mailsessiontestresult) } - 各端点的连通性报告

### mail.testAsync()

**`6.8.0`** **`Async`**

- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [MailSessionTestResult](mailClientType#mailsessiontestresult)

以默认客户端调用 [client.test](mailClientType#m-test), 探测收信端点与 SMTP 端点. 单个端点失败记录在报告中, 不抛出.

```js
mail.setDefault('work');
let report = mail.test();
console.log(report.ok, report.elapsedMs);
mail.testAsync().then(r => console.log(r.smtp.ok));
```

## [m] send

### mail.send(message, options?)

**`6.8.0`**

- **message** { [MailSendMessage](mailMessageType#mailsendmessage) } - 待发送的邮件
- **[ options ]** { [Object](dataTypes#object) } - 发送选项, 支持 `saveToSent`
- <ins>**returns**</ins> { [MailSendResult](mailClientType#mailsendresult) } - 发送结果

### mail.sendAsync(message, options?)

**`6.8.0`** **`Async`**

- **message** { [MailSendMessage](mailMessageType#mailsendmessage) } - 待发送的邮件
- **[ options ]** { [Object](dataTypes#object) } - 发送选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [MailSendResult](mailClientType#mailsendresult)

以默认客户端调用 [client.send](mailClientType#m-send) 经 SMTP 发送邮件.

```js
mail.setDefault('work');
let result = mail.send({ to: 'you@example.com', subject: '提醒', text: '会议改到 15:00' });
console.log(result.messageId, result.accepted.length);
mail.sendAsync({ to: 'you@example.com', subject: '提醒', text: '已改期' }).then(r => console.log(r.messageId));
```

## [m] folders

### mail.folders(options?)

**`6.8.0`**

- **[ options ]** { [Object](dataTypes#object) } - 列表选项, 支持 `subscribedOnly` 与 `status`
- <ins>**returns**</ins> { [MailFolder](mailClientType#mailfolder)[[]](dataTypes#array) } - 文件夹树

### mail.foldersAsync(options?)

**`6.8.0`** **`Async`**

- **[ options ]** { [Object](dataTypes#object) } - 列表选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [MailFolder](mailClientType#mailfolder)[[]](dataTypes#array)

以默认客户端调用 [client.folders](mailClientType#m-folders) 列出文件夹树. POP3 只返回 `INBOX`.

```js
mail.setDefault('work');
mail.folders().forEach(f => console.log(f.path, f.specialUse || ''));
mail.foldersAsync({ status: true }).then(list => list.forEach(f => console.log(f.path, f.unseen)));
```

## [m] folder

### mail.folder(path)

**`6.8.0`**

- **path** { [string](dataTypes#string) } - 文件夹路径
- <ins>**returns**</ins> { [Object](dataTypes#object) } - [文件夹对象](mailClientType#文件夹对象-folder-object)

以默认客户端调用 [client.folder](mailClientType#m-folder), 返回绑定到 `path` 的轻量对象, 不访问网络. 此方法没有 `Async` 形态.

```js
mail.setDefault('work');
let archive = mail.folder('Archive');
console.log(archive.status().messages);
```

## [m] folderStatus

### mail.folderStatus(path)

**`6.8.0`**

- **path** { [string](dataTypes#string) } - 文件夹路径
- <ins>**returns**</ins> { [MailFolderStatus](mailClientType#mailfolderstatus) } - 文件夹状态

### mail.folderStatusAsync(path)

**`6.8.0`** **`Async`**

- **path** { [string](dataTypes#string) } - 文件夹路径
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [MailFolderStatus](mailClientType#mailfolderstatus)

以默认客户端调用 [client.folderStatus](mailClientType#m-folderstatus) 读取邮件数, 未读数, 下一个 UID 与 UIDVALIDITY. 仅 IMAP.

```js
mail.setDefault('work');
let status = mail.folderStatus('INBOX');
console.log(status.messages, status.unseen);
mail.folderStatusAsync('INBOX').then(s => console.log(s.uidNext));
```

## [m] createFolder

### mail.createFolder(path)

**`6.8.0`**

- **path** { [string](dataTypes#string) } - 新文件夹路径, 父级需已存在
- <ins>**returns**</ins> { [MailFolder](mailClientType#mailfolder) } - 新建的文件夹

### mail.createFolderAsync(path)

**`6.8.0`** **`Async`**

- **path** { [string](dataTypes#string) } - 新文件夹路径
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [MailFolder](mailClientType#mailfolder)

以默认客户端调用 [client.createFolder](mailClientType#m-createfolder) 创建并订阅文件夹. 仅 IMAP.

```js
mail.setDefault('work');
console.log(mail.createFolder('Reports').path);
mail.createFolderAsync('Reports/2026').then(f => console.log(f.path));
```

## [m] deleteFolder

### mail.deleteFolder(path)

**`6.8.0`**

- **path** { [string](dataTypes#string) } - 文件夹路径
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 恒为 `true`

### mail.deleteFolderAsync(path)

**`6.8.0`** **`Async`**

- **path** { [string](dataTypes#string) } - 文件夹路径
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 `true`

以默认客户端调用 [client.deleteFolder](mailClientType#m-deletefolder) 删除文件夹及其中的邮件. 仅 IMAP.

```js
mail.setDefault('work');
mail.deleteFolder('Reports/2025');
mail.deleteFolderAsync('Reports/2024').then(() => console.log('已删除'));
```

## [m] renameFolder

### mail.renameFolder(path, newPath)

**`6.8.0`**

- **path** { [string](dataTypes#string) } - 现有文件夹路径
- **newPath** { [string](dataTypes#string) } - 新路径
- <ins>**returns**</ins> { [MailFolder](mailClientType#mailfolder) } - 改名后的文件夹

### mail.renameFolderAsync(path, newPath)

**`6.8.0`** **`Async`**

- **path** { [string](dataTypes#string) } - 现有文件夹路径
- **newPath** { [string](dataTypes#string) } - 新路径
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [MailFolder](mailClientType#mailfolder)

以默认客户端调用 [client.renameFolder](mailClientType#m-renamefolder) 重命名或移动文件夹. 仅 IMAP.

```js
mail.setDefault('work');
console.log(mail.renameFolder('Reports', 'Archive/Reports').path);
mail.renameFolderAsync('Drafts-old', 'Archive/Drafts').then(f => console.log(f.path));
```

## [m] fetch

### mail.fetch(options?)

**`6.8.0`**

- **[ options ]** { [Object](dataTypes#object) } - 列表选项, 支持 `folder`, `limit`, `before`, `after`, `order` 与 `unseenOnly`
- <ins>**returns**</ins> { [MailMessage](mailMessageType)[[]](dataTypes#array) } - 邮件摘要列表

### mail.fetchAsync(options?)

**`6.8.0`** **`Async`**

- **[ options ]** { [Object](dataTypes#object) } - 列表选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [MailMessage](mailMessageType)[[]](dataTypes#array)

以默认客户端调用 [client.fetch](mailClientType#m-fetch) 列出邮件摘要 (不含正文).

```js
mail.setDefault('work');
mail.fetch({ limit: 5 }).forEach(m => console.log(m.uid, m.subject));
mail.fetchAsync({ unseenOnly: true, limit: 3 }).then(list => console.log(list.length));
```

## [m] search

### mail.search(query, options?)

**`6.8.0`**

- **query** { [MailSearchQuery](mailSearchQueryType) } - 查询条件
- **[ options ]** { [Object](dataTypes#object) } - 搜索选项, 支持 `folder`, `limit`, `before` 与 `fallback`
- <ins>**returns**</ins> { [MailMessage](mailMessageType)[[]](dataTypes#array) } - 命中的邮件摘要, 附带不可枚举的 `fallback` 属性

### mail.searchAsync(query, options?)

**`6.8.0`** **`Async`**

- **query** { [MailSearchQuery](mailSearchQueryType) } - 查询条件
- **[ options ]** { [Object](dataTypes#object) } - 搜索选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [MailMessage](mailMessageType)[[]](dataTypes#array)

以默认客户端调用 [client.search](mailClientType#m-search) 按条件搜索邮件.

```js
mail.setDefault('work');
let hits = mail.search({ subject: '发票', since: '2026-09-01' }, { limit: 20 });
console.log(hits.length, hits.fallback);
mail.searchAsync({ seen: false }).then(list => console.log(list.length));
```

## [m] get

### mail.get(uid, options?)

**`6.8.0`**

- **uid** { [number](dataTypes#number) | [string](dataTypes#string) | [MailMessage](mailMessageType) } - [UID 参数](mailMessageType#uid-参数-uid-argument)
- **[ options ]** { [Object](dataTypes#object) } - 读取选项, 支持 `folder`, `peek` 与 `includeRaw`
- <ins>**returns**</ins> { [MailMessage](mailMessageType) } - 含正文, 头与附件列表的完整邮件

### mail.getAsync(uid, options?)

**`6.8.0`** **`Async`**

- **uid** { [number](dataTypes#number) | [string](dataTypes#string) | [MailMessage](mailMessageType) } - [UID 参数](mailMessageType#uid-参数-uid-argument)
- **[ options ]** { [Object](dataTypes#object) } - 读取选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [MailMessage](mailMessageType)

以默认客户端调用 [client.get](mailClientType#m-get) 读取一封邮件的正文, 头与附件列表.

```js
mail.setDefault('work');
let latest = mail.fetch({ limit: 1 })[0];
console.log(mail.get(latest).text);
mail.getAsync(latest.uid, { peek: false }).then(m => console.log(m.subject));
```

## [m] fetchBody

### mail.fetchBody(uid, options?)

**`6.8.0`**

- **uid** { [number](dataTypes#number) | [string](dataTypes#string) | [MailMessage](mailMessageType) } - [UID 参数](mailMessageType#uid-参数-uid-argument)
- **[ options ]** { [Object](dataTypes#object) } - 读取选项, 同 [mail.get](#m-get)
- <ins>**returns**</ins> { [MailMessage](mailMessageType) } - 完整邮件

### mail.fetchBodyAsync(uid, options?)

**`6.8.0`** **`Async`**

- **uid** { [number](dataTypes#number) | [string](dataTypes#string) | [MailMessage](mailMessageType) } - [UID 参数](mailMessageType#uid-参数-uid-argument)
- **[ options ]** { [Object](dataTypes#object) } - 读取选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [MailMessage](mailMessageType)

[mail.get](#m-get) / `mail.getAsync` 的别名, 参数与结果完全相同.

```js
mail.setDefault('work');
let latest = mail.fetch({ limit: 1 })[0];
console.log(mail.fetchBody(latest).text);
mail.fetchBodyAsync(latest).then(m => console.log(m.html));
```

## [m] download

### mail.download(attachment, target?, options?)

**`6.8.0`**

- **attachment** { [MailAttachment](mailMessageType#mailattachment) | [Object](dataTypes#object) } - 附件对象, 或 `{ uid, partId, folder?, fileName? }`
- **[ target = `files.cwd()` ]** { [string](dataTypes#string) } - 目标目录或文件路径
- **[ options ]** { [Object](dataTypes#object) } - 下载选项, 支持 `folder` 与 `overwrite`
- <ins>**returns**</ins> { [string](dataTypes#string) } - 落盘文件的绝对路径

### mail.downloadAsync(attachment, target?, options?)

**`6.8.0`** **`Async`**

- **attachment** { [MailAttachment](mailMessageType#mailattachment) | [Object](dataTypes#object) } - 附件对象或 `{ uid, partId }`
- **[ target = `files.cwd()` ]** { [string](dataTypes#string) } - 目标目录或文件路径
- **[ options ]** { [Object](dataTypes#object) } - 下载选项, 另支持 `onProgress` 进度回调
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为落盘文件的绝对路径

以默认客户端调用 [client.download](mailClientType#m-download) 将附件流式写入文件.

```js
mail.setDefault('work');
let message = mail.get(mail.fetch({ limit: 1 })[0]);
message.attachments.forEach(a => console.log(mail.download(a, '/sdcard/Download/')));
mail.downloadAsync({ uid: message.uid, partId: '2' }, '/sdcard/Download/').then(path => console.log(path));
```

## [m] raw

### mail.raw(uid, target?, options?)

**`6.8.0`**

- **uid** { [number](dataTypes#number) | [string](dataTypes#string) | [MailMessage](mailMessageType) } - [UID 参数](mailMessageType#uid-参数-uid-argument)
- **[ target = `files.cwd()` ]** { [string](dataTypes#string) } - 目标目录或文件路径, 目录时文件名为 `<uid>.eml`
- **[ options ]** { [Object](dataTypes#object) } - 下载选项, 支持 `folder` 与 `overwrite`
- <ins>**returns**</ins> { [string](dataTypes#string) } - 落盘文件的绝对路径

### mail.rawAsync(uid, target?, options?)

**`6.8.0`** **`Async`**

- **uid** { [number](dataTypes#number) | [string](dataTypes#string) | [MailMessage](mailMessageType) } - [UID 参数](mailMessageType#uid-参数-uid-argument)
- **[ target = `files.cwd()` ]** { [string](dataTypes#string) } - 目标目录或文件路径
- **[ options ]** { [Object](dataTypes#object) } - 下载选项, 另支持 `onProgress` 进度回调
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为落盘文件的绝对路径

以默认客户端调用 [client.raw](mailClientType#m-raw) 将整封邮件的原始 MIME 内容写入 `.eml` 文件.

```js
mail.setDefault('work');
let latest = mail.fetch({ limit: 1 })[0];
console.log(mail.raw(latest, '/sdcard/Download/'));
mail.rawAsync(latest.uid, '/sdcard/Download/latest.eml', { overwrite: true }).then(path => console.log(path));
```

## [m] setFlags

### mail.setFlags(uids, flags, mode?, options?)

**`6.8.0`**

- **uids** { [number](dataTypes#number) | [string](dataTypes#string) | [MailMessage](mailMessageType) | [Array](dataTypes#array) } - 一个或多个 [UID 参数](mailMessageType#uid-参数-uid-argument)
- **flags** { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) } - 标记名, 系统标记或自定义关键字
- **[ mode = `'add'` ]** { `'add'` | `'remove'` | `'set'` } - 添加, 移除或整体替换
- **[ options ]** { [Object](dataTypes#object) } - 选项, 支持 `folder`
- <ins>**returns**</ins> { [Array](dataTypes#array) } - 受影响的 UID 数组

### mail.setFlagsAsync(uids, flags, mode?, options?)

**`6.8.0`** **`Async`**

- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为受影响的 UID 数组

以默认客户端调用 [client.setFlags](mailClientType#m-setflags) 修改邮件标记. 仅 IMAP.

```js
mail.setDefault('work');
let uids = mail.fetch({ limit: 2 }).map(m => m.uid);
mail.setFlags(uids, ['seen', 'Project-X']);
mail.setFlagsAsync(uids, 'Project-X', 'remove').then(changed => console.log(changed));
```

## [m] markRead

### mail.markRead(uids, options?)

**`6.8.0`**

- **uids** { [number](dataTypes#number) | [string](dataTypes#string) | [MailMessage](mailMessageType) | [Array](dataTypes#array) } - 一个或多个 [UID 参数](mailMessageType#uid-参数-uid-argument)
- **[ options ]** { [Object](dataTypes#object) } - 选项, 支持 `folder`
- <ins>**returns**</ins> { [Array](dataTypes#array) } - 受影响的 UID 数组

### mail.markReadAsync(uids, options?)

**`6.8.0`** **`Async`**

- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为受影响的 UID 数组

相当于 `mail.setFlags(uids, 'seen', 'add', options)`.

```js
mail.setDefault('work');
let unread = mail.fetch({ unseenOnly: true, limit: 10 });
mail.markRead(unread);
mail.markReadAsync(unread[0]).then(changed => console.log(changed));
```

## [m] markUnread

### mail.markUnread(uids, options?)

**`6.8.0`**

- **uids** { [number](dataTypes#number) | [string](dataTypes#string) | [MailMessage](mailMessageType) | [Array](dataTypes#array) } - 一个或多个 [UID 参数](mailMessageType#uid-参数-uid-argument)
- **[ options ]** { [Object](dataTypes#object) } - 选项, 支持 `folder`
- <ins>**returns**</ins> { [Array](dataTypes#array) } - 受影响的 UID 数组

### mail.markUnreadAsync(uids, options?)

**`6.8.0`** **`Async`**

- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为受影响的 UID 数组

相当于 `mail.setFlags(uids, 'seen', 'remove', options)`.

```js
mail.setDefault('work');
let latest = mail.fetch({ limit: 1 })[0];
mail.markUnread(latest);
mail.markUnreadAsync(latest.uid, { folder: 'INBOX' }).then(changed => console.log(changed));
```

## [m] flag

### mail.flag(uids, options?)

**`6.8.0`**

- **uids** { [number](dataTypes#number) | [string](dataTypes#string) | [MailMessage](mailMessageType) | [Array](dataTypes#array) } - 一个或多个 [UID 参数](mailMessageType#uid-参数-uid-argument)
- **[ options ]** { [Object](dataTypes#object) } - 选项, 支持 `folder`
- <ins>**returns**</ins> { [Array](dataTypes#array) } - 受影响的 UID 数组

### mail.flagAsync(uids, options?)

**`6.8.0`** **`Async`**

- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为受影响的 UID 数组

相当于 `mail.setFlags(uids, 'flagged', 'add', options)`, 即加星标.

```js
mail.setDefault('work');
let hits = mail.search({ from: 'boss@example.com' });
mail.flag(hits);
mail.flagAsync(hits[0]).then(changed => console.log(changed));
```

## [m] unflag

### mail.unflag(uids, options?)

**`6.8.0`**

- **uids** { [number](dataTypes#number) | [string](dataTypes#string) | [MailMessage](mailMessageType) | [Array](dataTypes#array) } - 一个或多个 [UID 参数](mailMessageType#uid-参数-uid-argument)
- **[ options ]** { [Object](dataTypes#object) } - 选项, 支持 `folder`
- <ins>**returns**</ins> { [Array](dataTypes#array) } - 受影响的 UID 数组

### mail.unflagAsync(uids, options?)

**`6.8.0`** **`Async`**

- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为受影响的 UID 数组

相当于 `mail.setFlags(uids, 'flagged', 'remove', options)`.

```js
mail.setDefault('work');
let starred = mail.search({ flagged: true });
mail.unflag(starred);
mail.unflagAsync(starred, { folder: 'INBOX' }).then(changed => console.log(changed.length));
```

## [m] move

### mail.move(uids, folder, options?)

**`6.8.0`**

- **uids** { [number](dataTypes#number) | [string](dataTypes#string) | [MailMessage](mailMessageType) | [Array](dataTypes#array) } - 一个或多个 [UID 参数](mailMessageType#uid-参数-uid-argument)
- **folder** { [string](dataTypes#string) } - 目标文件夹路径
- **[ options ]** { [Object](dataTypes#object) } - 选项, 支持 `from` (来源文件夹, 默认 `'INBOX'`)
- <ins>**returns**</ins> { [Array](dataTypes#array) | [boolean](dataTypes#boolean) } - 服务器支持 UIDPLUS 时为新 UID 数组, 否则为 `true`

### mail.moveAsync(uids, folder, options?)

**`6.8.0`** **`Async`**

- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值同上

以默认客户端调用 [client.move](mailClientType#m-move) 移动邮件. 仅 IMAP.

```js
mail.setDefault('work');
console.log(mail.move(mail.search({ from: 'newsletter@example.com' }), 'Newsletters'));
mail.moveAsync(mail.search({ subject: '账单' }), 'Bills').then(r => console.log(r));
```

## [m] copy

### mail.copy(uids, folder, options?)

**`6.8.0`**

- **uids** { [number](dataTypes#number) | [string](dataTypes#string) | [MailMessage](mailMessageType) | [Array](dataTypes#array) } - 一个或多个 [UID 参数](mailMessageType#uid-参数-uid-argument)
- **folder** { [string](dataTypes#string) } - 目标文件夹路径
- **[ options ]** { [Object](dataTypes#object) } - 选项, 支持 `from`
- <ins>**returns**</ins> { [Array](dataTypes#array) | [boolean](dataTypes#boolean) } - 同 [mail.move](#m-move)

### mail.copyAsync(uids, folder, options?)

**`6.8.0`** **`Async`**

- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值同上

以默认客户端调用 [client.copy](mailClientType#m-copy), 参数与返回值同 [mail.move](#m-move), 但保留来源邮件. 仅 IMAP.

```js
mail.setDefault('work');
let latest = mail.fetch({ limit: 1 })[0];
console.log(mail.copy(latest, 'Archive'));
mail.copyAsync(latest, 'Backup').then(r => console.log(r));
```

## [m] delete

### mail.delete(uids, options?)

**`6.8.0`**

- **uids** { [number](dataTypes#number) | [string](dataTypes#string) | [MailMessage](mailMessageType) | [Array](dataTypes#array) } - 一个或多个 [UID 参数](mailMessageType#uid-参数-uid-argument)
- **[ options ]** { [Object](dataTypes#object) } - 选项, 支持 `folder` 与 `expunge`
- <ins>**returns**</ins> { [Array](dataTypes#array) } - 受影响的 UID 数组

### mail.deleteAsync(uids, options?)

**`6.8.0`** **`Async`**

- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为受影响的 UID 数组

以默认客户端调用 [client.delete](mailClientType#m-delete). IMAP 上添加 `deleted` 标记 (`expunge` 为 `true` 时立即清除), POP3 上的删除不可撤销.

```js
mail.setDefault('work');
mail.delete(mail.search({ subject: '退订确认' }), { expunge: true });
mail.deleteAsync(mail.search({ from: 'spam@example.com' })).then(uids => console.log(uids.length));
```

## [m] expunge

### mail.expunge(folder?)

**`6.8.0`**

- **[ folder = `'INBOX'` ]** { [string](dataTypes#string) } - 文件夹路径
- <ins>**returns**</ins> { [number](dataTypes#number) } - 清除的邮件数

### mail.expungeAsync(folder?)

**`6.8.0`** **`Async`**

- **[ folder = `'INBOX'` ]** { [string](dataTypes#string) } - 文件夹路径
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为清除的邮件数

以默认客户端调用 [client.expunge](mailClientType#m-expunge) 永久删除带 `deleted` 标记的邮件. 仅 IMAP.

```js
mail.setDefault('work');
console.log(mail.expunge());
mail.expungeAsync('Trash').then(n => console.log(n));
```

## [m] append

### mail.append(folder, message, flags?)

**`6.8.0`**

- **folder** { [string](dataTypes#string) } - 目标文件夹路径
- **message** { [MailSendMessage](mailMessageType#mailsendmessage) } - 邮件内容, 字段与发送相同
- **[ flags ]** { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) } - 初始标记, 如 `['seen']` 或 `['draft']`
- <ins>**returns**</ins> { [number](dataTypes#number) | [null](dataTypes#null) } - 服务器报告 APPENDUID 时为新邮件的 UID, 否则为 `null`

### mail.appendAsync(folder, message, flags?)

**`6.8.0`** **`Async`**

- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为新 UID 或 `null`

以默认客户端调用 [client.append](mailClientType#m-append), 不经 SMTP 直接把邮件写入文件夹. 仅 IMAP.

```js
mail.setDefault('work');
console.log(mail.append('Drafts', { to: 'you@example.com', subject: '草稿', text: '稍后补充' }, ['draft']));
mail.appendAsync('Archive', { subject: '备忘', text: '已归档' }, 'seen').then(uid => console.log(uid));
```

## [m] watch

### mail.watch(folder?, options?)

**`6.8.0`** **`Overload 1/2`**

- **[ folder = `'INBOX'` ]** { [string](dataTypes#string) } - 监听的文件夹路径
- **[ options ]** { [Object](dataTypes#object) } - 监听选项, 支持 `mode`, `pollIntervalMs`, `fetchBody` 与 `reconnect`
- <ins>**returns**</ins> { [MailWatch](mailClientType#mailwatch) } - 监听对象

### mail.watch(options)

**`6.8.0`** **`Overload 2/2`**

- **options** { [Object](dataTypes#object) } - 监听选项, 可含 `folder`
- <ins>**returns**</ins> { [MailWatch](mailClientType#mailwatch) } - 监听对象

以默认客户端调用 [client.watch](mailClientType#m-watch) 开始监听新邮件, 立即返回, 事件在脚本线程上派发. 此方法没有 `Async` 形态.

```js
mail.setDefault('work');
let watch = mail.watch({ folder: 'INBOX', fetchBody: true });
watch.on('message', m => console.log(m.subject));
setTimeout(() => watch.stop(), 5 * 60 * 1000);
```

## [C] MailError

### new mail.MailError(message, code?, details?, retryable?)

**`6.8.0`**

- **message** { [string](dataTypes#string) } - 错误消息
- **[ code = `'INTERNAL'` ]** { [string](dataTypes#string) } - 错误代码
- **[ details = null ]** { [string](dataTypes#string) | [null](dataTypes#null) } - 补充说明
- **[ retryable = false ]** { [boolean](dataTypes#boolean) } - 是否值得重试
- <ins>**returns**</ins> { [MailError](#c-mailerror) }

邮件模块抛出的所有错误都是 `name` 为 `'MailError'` 的 JavaScript [Error](exceptions#error-对象), 可用 `instanceof mail.MailError` 判断. 脚本也可自行构造, 例如在 `tokenProvider` 中抛出.

```js
try {
    mail.connect({ provider: 'qq', address: 'user@qq.com', password: 'wrong' });
} catch (e) {
    if (e instanceof mail.MailError) {
        console.log(e.code); // AUTH_FAILED
        console.log(e.retryable); // false
        console.log(e.toString()); // MailError [AUTH_FAILED]: ...
    }
}
```

## [p#] name

**`6.8.0`**

- { `'MailError'` }

## [p#] code

**`6.8.0`**

- { [string](dataTypes#string) }

错误代码:

| code | 含义 | retryable |
| --- | --- | --- |
| INVALID_ARGUMENT | 参数形态或取值不合法 | false |
| NO_DEFAULT_ACCOUNT | 调用转发方法时没有默认客户端 | false |
| ACCOUNT_NOT_FOUND | 账户别名不存在 | false |
| PROVIDER_UNKNOWN | `provider` 不是已知预设 | false |
| AUTH_FAILED | 服务器拒绝了凭据或令牌, 或 `tokenProvider` 未返回令牌 | false |
| AUTH_MECHANISM_UNSUPPORTED | 服务器不提供与凭据类型匹配的认证方式 (如只接受 OAuth 令牌) | false |
| CONNECT_FAILED | DNS 或套接字失败 | true |
| TLS_FAILED | TLS 握手或证书校验失败 | false |
| TIMEOUT | 连接, 读取或宿主侧调用超时 | true |
| CANCELLED | 调用被脚本停止或宿主取消 | false |
| FOLDER_NOT_FOUND | 文件夹不存在 | false |
| MESSAGE_NOT_FOUND | UID 对应的邮件不存在 | false |
| ATTACHMENT_NOT_FOUND | `partId` 对应的附件不存在 | false |
| UNSUPPORTED_OPERATION | 当前协议或服务器不支持该操作 (如 POP3 上的文件夹操作) | false |
| LIMIT_EXCEEDED | 超出 [限制](mailClientType#限制-limits) 中的任一上限 | false |
| IO_FAILED | 文件, 管道或描述符失败 | false |
| SESSION_CLOSED | 会话已关闭或插件进程已退出 | true |
| WATCH_CLOSED | 监听已停止 | false |
| SEND_REJECTED | SMTP 拒绝了邮件或全部收件人 | false |
| SERVER_ERROR | 服务器报告的协议级失败 | 视情况 |
| PLUGIN_UNAVAILABLE | 插件缺失, 被禁用, 未授权, 不兼容或拒绝服务 | 仅插件进程退出时 |
| INTERNAL | 其他未归类错误 | false |

## [p#] details

**`6.8.0`**

- { [string](dataTypes#string) | [null](dataTypes#null) }

面向排查的补充说明, 如服务器返回的响应摘要或建议. 没有补充说明时为 `null`.

## [p#] retryable

**`6.8.0`**

- { [boolean](dataTypes#boolean) }

是否值得在稍后原样重试. 为 `true` 时通常是网络波动, 超时或会话被关闭, 重新 [connect](#m-connect) 后重试即可.

## [m#] toString

### mailError.toString()

**`6.8.0`**

- <ins>**returns**</ins> { [string](dataTypes#string) } - 形如 `MailError [CODE]: message`

## 示例 (Examples)

### 发送带附件的邮件

```js
let client = mail.connect({ provider: '163', address: 'me@163.com', password: '授权码' });
let result = client.send({
    to: 'you@example.com',
    subject: '报表',
    text: '见附件',
    attachments: ['/sdcard/Download/report.xlsx'],
});
console.log(result.messageId, result.sentCopy); // 服务器自动保存时 sentCopy 为 server.
client.close();
```

### 读取未读邮件并下载附件

```js
let client = mail.connect('work');
let dir = files.join(files.cwd(), 'mail-attachments');
client.fetch({ unseenOnly: true, limit: 10 }).forEach(m => {
    let full = m.load();
    console.log(full.subject, full.text);
    full.attachments.forEach(a => console.log(a.download(dir)));
    client.markRead(m);
});
client.close();
```

### 监听新邮件

```js
let client = mail.connect('work');
let watch = client.watch('INBOX', { fetchBody: true });
watch.on('message', m => {
    if (/验证码/.test(m.subject)) {
        console.log(m.text);
    }
});
watch.on('error', e => console.warn(e.code, e.message));
watch.on('close', reason => console.log('watch closed:', reason));
setTimeout(() => {
    watch.stop();
    client.close();
}, 10 * 60 * 1000);
```

### 邮件到达时运行脚本 (Run a Script on Mail Arrival)

Angus Mail 插件 1.1.0 起 (需要携带邮件契约版本 2 的 AutoJs6 构建), 插件设置页的 "守望" 页面可以在没有脚本运行时为已保存账户保持 IMAP IDLE 或轮询连接 (前台服务), 并在新邮件到达时唤醒 AutoJs6 的定时任务 "邮件到达时" (长按脚本 > 定时任务 > 广播触发 > 邮件到达时, 选择守望并可选填写发件人 / 主题过滤). 被启动的脚本通过 `engines.myEngine().execArgv.mail` 读取该事件: `triggerId` (守望名), `alias` (已保存账户的别名), `address`, `folder`, `message` (新邮件的信封, `bodyLoaded` 为 false) 与 `receivedAt` (插件看到该邮件的 UTC 毫秒). 同一封邮件只启动一次, 同一任务每 3 秒至多启动一次 (连续到达时以最后一封为准).

```js
let argv = engines.myEngine().execArgv;
if (!argv.mail) {
    console.log('不是由邮件到达任务启动');
    exit();
}
console.log(argv.mail.triggerId, argv.mail.message.subject, argv.mail.message.from.address);
let client = mail.connect(argv.mail.alias); // 以守望所用的别名连接, 秘密留在插件内.
let full = client.get(argv.mail.message); // 按需加载正文.
if (/验证码/.test(full.subject)) {
    console.log(full.text);
}
client.close();
```

### 异步调用

```js
mail.connectAsync('work').then(client => {
    mail.setDefault(client);
    return mail.searchAsync({ subject: '发票', since: '2026-09-01' });
}).then(list => {
    console.log(list.length);
    mail.close();
}).catch(e => console.error(e.toString()));
```
