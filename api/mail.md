# 邮件 (Mail)

`mail` 模块用于在脚本中通过 IMAP, POP3 和 SMTP 协议收发, 搜索, 整理和监听邮件.

从 AutoJs6 6.8.0 起, 邮件功能由外置 Angus Mail 插件 (AutoJs6-Plugin-Angus-Mail) 提供. 调用前需在插件中心安装, 启用并授权与当前 AutoJs6 兼容的插件. 插件缺失, 被禁用, 未授权, 版本不兼容, 服务绑定失败或插件进程退出时, 方法会抛出 (或以 Promise 拒绝) `code` 为 `PLUGIN_UNAVAILABLE` 的 [MailError](#c-mailerror).

网络操作均由 [MailClient](mailClientType) 实例完成. [mail.connect](#m-connect) 建立客户端后, 可直接调用其方法, 也可通过 [mail.setDefault](#m-setdefault) 指定默认客户端, 再以 `mail.fetch()` 这类 [转发方法](#转发方法-forwarded-methods) 省略客户端引用.

每个网络方法都有同步形态 `x(...)` 与异步形态 `xAsync(...)`, 二者参数与结果完全一致. 同步形态阻塞当前脚本线程直至插件返回结果或调用失败, 停止脚本会取消尚未完成的调用; 异步形态立即返回 [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise), 回调在脚本线程执行. 只与本地状态打交道的成员 (`providers`, `accounts`, `setDefault`, `close`, `folder`, `watch`) 没有 `Async` 形态.

账户凭据 (授权码, 应用专用密码或 OAuth 令牌) 可写在 [MailAccountOptions](mailAccountOptionsType) 中, 也可在插件设置页保存为账户别名后以 `mail.connect('别名')` 使用. 后者不需要在脚本中保存任何凭据. 插件日志与 `debug` 输出只记录域名, 端口与耗时, 不记录凭据和邮件正文.

本模块注册为全局名称 `mail`, 并提供 `$mail` 别名.

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

每项包含 `alias`, `address`, `user`, `name`, `provider`, `auth`, `receive`, `imap`, `pop3`, `smtp`, `default` 与 `updatedAt`, 不包含任何凭据. 保存的账户无法解析时只包含 `alias` 与 `error`. 字段含义见 [MailAccountOptions](mailAccountOptionsType#保存的账户-saved-accounts).

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
