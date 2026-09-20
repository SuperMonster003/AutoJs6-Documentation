# MailAccountOptions

MailAccountOptions 是 [mail.connect](mail#m-connect), [mail.connectAsync](mail#m-connectasync) 与 [mail.setDefault](mail#m-setdefault) 接受的账户选项对象.

最少只需 `provider` (或写明的服务器地址), `address` 与一种凭据 (`password`, `accessToken` 或 `tokenProvider`). 选择 `provider` 后, 服务器地址, 端口, TLS 方式与认证方式来自 [服务商预设](#服务商预设-provider-presets), 显式写出的字段覆盖预设. 没有 `provider` 时必须写明 `imap` (或 `pop3`) 与 `smtp`, 且不会按地址域名推断.

未知字段, 非法取值与互斥组合在 `connect` 处以 `INVALID_ARGUMENT` 拒绝. 对象像 `JSON.stringify` 一样序列化, `undefined` 与函数 (除 `tokenProvider`) 被忽略.

```js
let client = mail.connect({
    provider: 'qq',
    address: 'user@qq.com',
    password: '授权码',
});
```

```js
let client = mail.connect({
    address: 'me@example.com',
    user: 'me',
    name: 'My Name',
    password: 'secret',
    receive: 'imap',
    imap: { host: 'mail.example.com', port: 993, tls: 'ssl' },
    smtp: { host: 'mail.example.com', port: 587, tls: 'starttls' },
    timeout: { connect: 10000, read: 30000 },
});
```

---

<p style="font: bold 2em sans-serif; color: #FF7043">MailAccountOptions</p>

---

## [p?] provider

- { [string](dataTypes#string) }

服务商预设 ID, 见 [服务商预设](#服务商预设-provider-presets). 未知 ID 抛出 `PROVIDER_UNKNOWN`.

## [p?] address

- { [string](dataTypes#string) }

邮箱地址, 必填, 也是默认的登录名与发件人地址.

## [p?] user

- { [string](dataTypes#string) }

登录名, 默认等于 `address`. 只有服务商要求用不含域名的用户名登录时才需要.

## [p?] name

- { [string](dataTypes#string) }

发信时的显示名, 用于 `From` 头.

## [p?] auth

- { `'password'` \| `'xoauth2'` }

认证方式, 默认由凭据类型决定: 给出 `password` 为 `'password'`, 给出 `accessToken` 或 `tokenProvider` 为 `'xoauth2'`. 显式写出时必须与凭据类型一致.

## [p?] password

- { [string](dataTypes#string) }

密码. 多数服务商 (QQ, 163, 126, Sina, Gmail, iCloud, Yahoo) 要求在邮箱设置中生成的授权码或应用专用密码, 而不是登录密码; 各预设的 `authHint` 说明具体要求. 与 `accessToken` 互斥.

## [p?] accessToken

- { [string](dataTypes#string) }

OAuth 2.0 访问令牌 (XOAUTH2), 用于 Gmail, Outlook.com 与 Microsoft 365. 令牌的获取与刷新由脚本负责. 与 `password` 互斥.

## [p?] tokenProvider

- { [Function](dataTypes#function) }

返回访问令牌字符串的函数. 连接时若没有 `accessToken` 则先调用一次取得令牌; 之后服务器以 `AUTH_FAILED` 拒绝令牌时 (通常是过期), 插件在后台线程再次调用它取得新令牌并重试一次. 函数必须同步返回非空字符串, 否则抛出 `AUTH_FAILED`. 不能与 `password` 同用.

```js
let client = mail.connect({
    provider: 'outlook',
    address: 'me@outlook.com',
    tokenProvider: () => refreshMyToken(), // 脚本自行实现的刷新逻辑.
});
```

## [p?] receive

- { `'imap'` \| `'pop3'` }

收信协议, 默认为 `'imap'` (有 IMAP 端点时). POP3 只有 `INBOX`, 没有标记, 文件夹与推送, 搜索只能在客户端按信封过滤, 详见 [MailClient](mailClientType).

## [p?] imap

- { [Object](dataTypes#object) }

IMAP 端点 `{ host, port?, tls? }`. `tls` 为 `'ssl'` (默认, 隐式 TLS), `'starttls'` 或 `'none'`; `port` 省略时按 `tls` 取默认值 (`993` / `143`). 有 `provider` 时可只写需要覆盖的字段.

## [p?] pop3

- { [Object](dataTypes#object) }

POP3 端点 `{ host, port?, tls? }`, 默认端口 `995` / `110`.

## [p?] smtp

- { [Object](dataTypes#object) }

SMTP 端点 `{ host, port?, tls? }`, 默认端口 `465` (ssl), `587` (starttls), `25` (none). 没有 SMTP 端点时不能发信.

## [p?] timeout

- { [Object](dataTypes#object) }

超时 (毫秒) `{ connect?, read?, write? }`. `connect` 默认 15000, `read` 默认 60000, `write` 默认等于 `read`. 每项最长 10 分钟. 读取超时抛出可重试的 `TIMEOUT`.

## [p?] tls

- { [Object](dataTypes#object) }

TLS 选项 `{ trustAll? }`. `trustAll: true` 跳过证书校验, 只应用于自建服务器的调试; 此时账户在插件的状态与摘要中标记为不安全.

## [p?] debug

- { [boolean](dataTypes#boolean) }

为 `true` 时把脱敏的协议摘要 (命令, 响应状态, 耗时, 传输字节数) 输出到 `console.verbose`. 不输出凭据与邮件内容.

## [p?] clientId

- { [Object](dataTypes#object) }

IMAP `ID` 命令的字段 `{ name?, version? }`. 163 / 126 要求每个连接先发送 `ID`, 否则拒绝打开文件夹; 这些预设的 `requiresClientId` 为 `true`, 插件会自动以自己的名称发送, 脚本一般不需要设置.

## 服务商预设 (Provider Presets)

插件内置以下预设 (可用 [mail.providers.list](mail#p-providers) 读取). 每项的字段:

| 字段 | 说明 |
| --- | --- |
| `id` | 预设 ID, 用于 `provider` |
| `name` | 显示名 |
| `domains` | 邮箱地址域名, 用于 [mail.providers.resolve](mail#p-providers) |
| `imap`, `pop3`, `smtp` | 端点 `{ host, port, tls }`, 没有该服务时为 `null` |
| `auth` | 支持的认证方式列表 |
| `authHint` | 凭据要求说明 |
| `autoSavesSent` | 服务器是否自动保存已发送邮件 (影响 [send](mailClientType#m-send) 的副本处理) |
| `sentFolder` | "已发送" 文件夹名, 插件追加副本时使用 |
| `requiresClientId` | 是否要求 IMAP `ID` 命令 |
| `idlePush` | IMAP IDLE 是否真正推送新邮件: `true`, `false` (接受命令但不推送或不支持, 监听改为轮询) 或 `null` (未核实) |
| `docsUrl` | 服务商的帮助页面 |
| `notes` | 已核实的行为差异 (英文) |

| id | 名称 | 域名 | IMAP | POP3 | SMTP | 认证 | 凭据 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `gmail` | Gmail | gmail.com, googlemail.com | imap.gmail.com:993 ssl | pop.gmail.com:995 | smtp.gmail.com:465 ssl | password, xoauth2 | 开启两步验证后的应用专用密码, 或 OAuth 2.0 令牌 |
| `outlook` | Outlook.com | outlook.com, hotmail.com, live.com, msn.com | outlook.office365.com:993 ssl | outlook.office365.com:995 | smtp-mail.outlook.com:587 starttls | xoauth2 | 只接受 OAuth 2.0 令牌, IMAP / POP3 / SMTP 均拒绝密码与应用密码 |
| `office365` | Microsoft 365 | (无) | outlook.office365.com:993 ssl | outlook.office365.com:995 | smtp.office365.com:587 starttls | xoauth2, password | OAuth 2.0 令牌; 租户可能只允许 SMTP 使用密码 |
| `qq` | QQ 邮箱 | qq.com, foxmail.com, vip.qq.com | imap.qq.com:993 ssl | pop.qq.com:995 | smtp.qq.com:465 ssl | password | 邮箱设置中生成的授权码 |
| `163` | 163 邮箱 | 163.com, vip.163.com | imap.163.com:993 ssl | pop.163.com:995 | smtp.163.com:465 ssl | password | 邮箱设置 (POP3/SMTP/IMAP) 中生成的授权码 |
| `126` | 126 邮箱 | 126.com, vip.126.com | imap.126.com:993 ssl | pop.126.com:995 | smtp.126.com:465 ssl | password | 同 163 |
| `icloud` | iCloud Mail | icloud.com, me.com, mac.com | imap.mail.me.com:993 ssl | 无 | smtp.mail.me.com:587 starttls | password | appleid.apple.com 生成的 App 专用密码 |
| `yahoo` | Yahoo Mail | yahoo.com, ymail.com, rocketmail.com | imap.mail.yahoo.com:993 ssl | pop.mail.yahoo.com:995 | smtp.mail.yahoo.com:465 ssl | password | 账户安全设置中生成的应用密码 |
| `sina` | 新浪邮箱 | sina.com, sina.cn | imap.sina.com:993 ssl | pop.sina.com:995 | smtp.sina.com:465 ssl | password | 客户端设置中的授权码 |
| `aliyun` | 阿里云邮箱 (个人版) | aliyun.com | imap.aliyun.com:993 ssl | pop3.aliyun.com:995 | smtp.aliyun.com:465 ssl | password | 账户密码 |

已用真实账户核实的行为差异:

- Gmail: 已发送邮件由服务器保存在 `[Gmail]/Sent Mail`; 自定义关键字可保存; IDLE 约 30 秒内推送; 非 ASCII 搜索由插件以 `CHARSET UTF-8` 发送.
- Outlook.com: 三个账户在 IMAP, POP3 与 SMTP 上均拒绝应用密码, 使用密码连接抛出 `AUTH_MECHANISM_UNSUPPORTED`, 必须使用令牌.
- QQ: 中文搜索服务器返回空结果而非错误, 需用 `fallback: 'always'`; 服务器改写外发邮件的 Message-ID; `createFolder` 可能被拒绝或几秒后消失; 自定义关键字不保存; IDLE 不推送 (监听自动轮询), 新邮件 15 到 40 秒后可见.
- 163: 每个连接需先发送 `ID` (插件自动处理); 服务器自动保存已发送邮件 (延迟可达数分钟); 对近期邮件的文本搜索返回空, 需用 `fallback: 'always'`; 发件人显示名中的空格变为下划线; 不支持 IDLE. yeah.net 使用同一策略.
- 126: 同 163, 但文本搜索 (含中文) 正常; 不支持 IDLE.
- 新浪: 服务器不保存已发送邮件 (插件追加副本); 拒绝 IMAP `CREATE` (`createFolder` 失败于 `SERVER_ERROR`); 只支持 `ALL`, `SINCE` 与标记条件的服务器搜索, 文本搜索总是在客户端执行; 不推送 IDLE 且空闲 60 秒后断开.
- iCloud: 无 POP3 服务.
- Yahoo, 阿里云: 未用真实账户核实, 端点来自公开文档.

## 保存的账户 (Saved Accounts)

在插件设置页保存的账户以别名连接: `mail.connect('别名')`. 凭据由插件持有, 脚本看不到. [mail.accounts.list](mail#p-accounts) 返回的每一项:

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `alias` | string | 别名 |
| `address` | string | 邮箱地址 |
| `user` | string | 登录名 |
| `name` | string \| undefined | 显示名 |
| `provider` | string \| undefined | 预设 ID |
| `auth` | string | `'password'` 或 `'xoauth2'` |
| `receive` | string | `'imap'` 或 `'pop3'` |
| `imap`, `pop3`, `smtp` | Object \| undefined | 端点 `{ host, port, tls }` |
| `default` | boolean | 是否为插件设置页标记的默认账户 |
| `updatedAt` | number | 最近保存时间 (UTC 毫秒) |
| `error` | string \| undefined | 保存的数据无法解析时的原因, 此时其他字段缺失 |

```js
mail.accounts.list().forEach(a => console.log(a.alias, a.address, a.receive, a.default));
```
