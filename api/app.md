# 通用应用 (App)

---

<aside class="doc-status doc-status--incomplete" data-marked-by="SuperMonster003" data-marked-on="2022-10-22">
<p><strong>文档状态:</strong> 此章节仍在补充或完善中.</p>
</aside>

app 模块提供一系列函数, 用于使用其他应用, 与其他应用交互. 例如发送意图, 打开文件, 发送邮件等.

同时提供了方便的进阶函数 startActivity 和 sendBroadcast, 用他们可完成 app 模块没有内置的和其他应用的交互.

## app.versionCode

- { [number](dataTypes#number) }

当前软件版本号, 整数值. 例如 160, 256 等.

如果在 AutoJs6 中运行则为 AutoJs6 的版本号; 在打包的软件中则为打包软件的版本号.

```
toastLog(app.versionCode);
```

## app.versionName

- { [string](dataTypes#string) }

当前软件的版本名称, 例如 "3.0.0 Beta".

如果在 AutoJs6 中运行则为 AutoJs6 的版本名称; 在打包的软件中则为打包软件的版本名称.

```
toastLog(app.versionName);
```

## app.autojs.versionCode

- { [number](dataTypes#number) }

AutoJs6 版本号, 整数值. 例如 160, 256 等.

## app.autojs.versionName

- { [string](dataTypes#string) }

AutoJs6 版本名称, 例如 "3.0.0 Beta".

## app.launchApp(appName)

- **appName** { [string](dataTypes#string) } 应用名称

通过应用名称启动应用. 如果该名称对应的应用不存在, 则返回 false; 否则返回 true. 如果该名称对应多个应用, 则只启动其中某一个.

该函数也可以作为全局函数使用.

```
launchApp("AutoJs6");
```

## app.launch(packageName)

- **packageName** { [string](dataTypes#string) } 应用包名

通过应用包名启动应用. 如果该包名对应的应用不存在, 则返回 false; 否则返回 true.

该函数也可以作为全局函数使用.

```
// 启动微信.
launch("com.tencent.mm");
```

## app.launchPackage(packageName)

- **packageName** { [string](dataTypes#string) } 应用包名

相当于 `app.launch(packageName)`.

## [m] launchDual

### launchDual(app)

**`6.6.0`** **`Global`**

- **app** { [string](dataTypes#string) | [App](appType) } - 应用包名, 预设别名或应用枚举
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否已找到启动意图并成功提交

在非当前用户配置文件中启动应用. 此方法等同于 [app.launchDualPackage](#m-launchdualpackage).

双开操作需要可用的 Shizuku 或 Root 权限. 应用不存在, 没有启动 Activity 或命令执行失败时返回 `false`.

## [m] launchDualPackage

### launchDualPackage(app)

**`6.6.0`** **`Global`**

- **app** { [string](dataTypes#string) | [App](appType) } - 应用包名, 预设别名或应用枚举
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否已找到启动意图并成功提交

按包名在非当前用户配置文件中启动应用. 预设别名和应用枚举会先转换为对应包名.

## [m] launchDualApp

### launchDualApp(app)

**`6.6.0`** **`Global`**

- **app** { [string](dataTypes#string) | [App](appType) } - 应用显示名, 预设别名或应用枚举
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否已解析应用并成功提交启动请求

按应用显示名在非当前用户配置文件中启动应用. 预设别名和应用枚举优先使用对应包名启动.

## app.getPackageName(name)

**`[6.8.0]`** **`Global`**

- **name** { [string](dataTypes#string) | [App](appType) } - 应用显示名, 包名, 预设别名或应用枚举
- <ins>**returns**</ins> { [string](dataTypes#string) | [null](dataTypes#null) } - 已安装应用的包名

解析应用标识并返回包名. 输入本身是已安装包名时原样返回; 输入为显示名且匹配多个应用时返回其中一个包名. 找不到匹配应用时返回 `null`.

```js
let packageName = getPackageName("QQ");
console.log(packageName);
```

## app.getAppName(name)

**`[6.8.0]`** **`Global`**

- **name** { [string](dataTypes#string) | [App](appType) } - 应用包名, 显示名, 预设别名或应用枚举
- <ins>**returns**</ins> { [string](dataTypes#string) | [null](dataTypes#null) } - 已安装应用的显示名

解析应用标识并返回显示名. 输入本身是已安装应用的显示名时原样返回. 找不到匹配应用时返回 `null`.

```js
let appName = getAppName("com.tencent.mobileqq");
console.log(appName);
```

## [m] getAppByAlias

### getAppByAlias(alias)

**`6.2.0`**

- **alias** { [string](dataTypes#string) } - 应用预设别名
- <ins>**returns**</ins> { [App](appType) | [null](dataTypes#null) } - 匹配的应用枚举实例

按大小写敏感的完整别名查找内置 [App](appType) 枚举实例. 未找到匹配项时返回 `null`.

## [m] isInstalled

### isInstalled(name)

**`[6.8.0]`**

- **name** { [string](dataTypes#string) | [App](appType) } - 应用显示名, 包名, 预设别名或应用枚举
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 应用是否已安装

解析应用标识并检查对应包是否已安装. 无法解析应用标识时返回 `false`.

```js
console.log(app.isInstalled('com.android.settings'));
console.log(app.isInstalled('设置'));
```

## [m] isDualInstalled

### isDualInstalled(name)

**`6.7.0`** **`Global`**

- **name** { [string](dataTypes#string) | [App](appType) } - 应用显示名, 包名, 预设别名或应用枚举
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 非当前用户配置文件中是否安装了应用

解析应用标识, 并通过 `cmd package list packages --user` 检查双开应用. 此方法需要可用的 Shizuku 或 Root 权限. 无法解析应用标识, 命令执行失败或应用未安装时返回 `false`.

## [m] kill

### kill(name)

**`[6.8.0]`**

- **name** { [string](dataTypes#string) | [App](appType) } - 应用显示名, 包名, 预设别名或应用枚举
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 强制停止命令是否成功

解析应用标识并使用 `am force-stop` 强制停止对应包. 执行时依次选择可用的 Shizuku, Root Shell 或普通 Shell.

无法解析应用标识或命令执行失败时返回 `false`.

## [m] killDual

### killDual(name)

**`6.6.0`** **`Global`**

- **name** { [string](dataTypes#string) | [App](appType) } - 应用显示名, 包名, 预设别名或应用枚举
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否成功提交强制停止命令

解析应用标识, 并在非当前用户配置文件中执行 `am force-stop`. 此方法需要可用的 Shizuku 或 Root 权限.

Android 的强制停止命令按包名生效. 主应用和双开应用使用相同包名时, [app.kill](#m-kill) 和 `app.killDual` 都可能同时停止这些应用, 无法按配置文件分别停止.

## [m] launchAppDetailsSettings

### launchAppDetailsSettings(app)

**`6.7.0`** **`Global`**

- **app** { [string](dataTypes#string) | [App](appType) } - 应用包名, 预设别名或应用枚举
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否成功提交打开请求

打开应用详情设置页. `null` 或 `undefined` 输入返回 `false`.

## [m] launchSettings

### launchSettings(app)

**`Global`**

- **app** { [string](dataTypes#string) | [App](appType) } - 应用包名, 预设别名或应用枚举
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否成功提交打开请求

[app.launchAppDetailsSettings](#m-launchappdetailssettings) 的兼容别名.

## [m] openAppSetting

### openAppSetting(app)

**`Global`**

- **app** { [string](dataTypes#string) | [App](appType) } - 应用包名, 预设别名或应用枚举
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否成功提交打开请求

[app.launchAppDetailsSettings](#m-launchappdetailssettings) 的兼容别名.

## [m] openAppSettings

### openAppSettings(app)

**`6.7.0`** **`Global`**

- **app** { [string](dataTypes#string) | [App](appType) } - 应用包名, 预设别名或应用枚举
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否成功提交打开请求

[app.launchAppDetailsSettings](#m-launchappdetailssettings) 的兼容别名.

## [m] launchDualAppDetailsSettings

### launchDualAppDetailsSettings(app)

**`6.7.0`** **`Global`**

- **app** { [string](dataTypes#string) | [App](appType) } - 应用显示名, 包名, 预设别名或应用枚举
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否成功提交打开请求

在非当前用户配置文件中打开应用详情设置页. 此方法需要可用的 Shizuku 或 Root 权限.

另有 [app.launchDualSettings](#m-launchdualsettings), [app.openDualAppSetting](#m-opendualappsetting) 和 [app.openDualAppSettings](#m-opendualappsettings) 3 个兼容别名.

## [m] launchDualSettings

### launchDualSettings(app)

**`6.6.0`** **`Global`**

- **app** { [string](dataTypes#string) | [App](appType) } - 应用显示名, 包名, 预设别名或应用枚举
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否成功提交打开请求

[app.launchDualAppDetailsSettings](#m-launchdualappdetailssettings) 的别名.

## [m] openDualAppSetting

### openDualAppSetting(app)

**`6.6.0`** **`Global`**

- **app** { [string](dataTypes#string) | [App](appType) } - 应用显示名, 包名, 预设别名或应用枚举
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否成功提交打开请求

[app.launchDualAppDetailsSettings](#m-launchdualappdetailssettings) 的别名.

## [m] openDualAppSettings

### openDualAppSettings(app)

**`6.7.0`** **`Global`**

- **app** { [string](dataTypes#string) | [App](appType) } - 应用显示名, 包名, 预设别名或应用枚举
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否成功提交打开请求

[app.launchDualAppDetailsSettings](#m-launchdualappdetailssettings) 的别名.

## app.viewFile(path)

- **path** { [string](dataTypes#string) } 文件路径

用其他应用查看文件. 文件不存在的情况由查看文件的应用处理.

如果找不出可以查看该文件的应用, 则抛出 `ActivityNotException`.

```
// 查看文本文件.
app.viewFile("/sdcard/1.txt");
```

## app.editFile(path)

- **path** { [string](dataTypes#string) } 文件路径

用其他应用编辑文件. 文件不存在的情况由编辑文件的应用处理.

如果找不出可以编辑该文件的应用, 则抛出 `ActivityNotException`.

```
// 编辑文本文件.
app.editFile("/sdcard/1.txt/);
```

## app.uninstall(packageName)

- **packageName** { [string](dataTypes#string) } 应用包名

卸载应用. 执行后会会弹出卸载应用的提示框. 如果该包名的应用未安装, 由应用卸载程序处理, 可能弹出 "未找到应用" 的提示.

```
// 卸载 QQ.
app.uninstall("com.tencent.mobileqq");
```

## [m] uninstallDual

### uninstallDual(app)

**`6.6.0`** **`Global`**

- **app** { [string](dataTypes#string) | [App](appType) } - 应用显示名, 包名, 预设别名或应用枚举
- <ins>**returns**</ins> { [void](dataTypes#void) }

在非当前用户配置文件中打开指定应用的卸载界面. 此方法需要可用的 Shizuku 或 Root 权限.

## app.openUrl(url)

- **url** { [string](dataTypes#string) } 网站的 Url, 如果不以 "http://" 或 "https://" 开头则默认是 "http://".

用浏览器打开网站 url.

如果没有安装浏览器应用, 则抛出 `ActivityNotException`.

## [m] openDualUrl

### openDualUrl(url)

**`6.6.1`**

- **url** { [string](dataTypes#string) } - URL
- <ins>**returns**</ins> { [void](dataTypes#void) }

在非当前用户配置文件中使用 `ACTION_VIEW` 打开 URL. URL 不包含 `://` 时自动添加 `http://` 前缀.

此方法需要可用的 Shizuku 或 Root 权限, 且不能省略 `app` 对象前缀.

## app.sendEmail(options)

- **options** { [Object](dataTypes#object) } 发送邮件的参数. 包括:
- **email** { [string](dataTypes#string) } | { [Array](dataTypes#array) } 收件人的邮件地址. 如果有多个收件人, 则用字符串数组表示
- **cc** { [string](dataTypes#string) } | { [Array](dataTypes#array) } 抄送收件人的邮件地址. 如果有多个抄送收件人, 则用字符串数组表示
- **bcc** { [string](dataTypes#string) } | { [Array](dataTypes#array) } 密送收件人的邮件地址. 如果有多个密送收件人, 则用字符串数组表示
- **subject** { [string](dataTypes#string) } 邮件主题 (标题)
- **text** { [string](dataTypes#string) } 邮件正文
- **attachment** { [string](dataTypes#string) } 附件的路径.

根据选项 options 调用邮箱应用发送邮件. 这些选项均是可选的.

如果没有安装邮箱应用, 则抛出 `ActivityNotException`.

```
// 发送邮件给 10086@qq.com 和 10001@qq.com.
app.sendEmail({
    email: ["10086@qq.com", "10001@qq.com"],
    subject: "这是一个邮件标题",
    text: "这是邮件正文"
});
```

## [m] startActivity

### startActivity(target, options?)

**`Global`**

- **target** { [IntentShortFormForActivity](dataTypes#intentshortformforactivity) | [IntentUriString](dataTypes#intenturistring) | [Intent](intentType) | [android.net.Uri](https://developer.android.com/reference/android/net/Uri) | [java.net.URI](https://docs.oracle.com/javase/8/docs/api/java/net/URI.html) | [Object](dataTypes#object) } - Activity 简称, URL, URI, Intent 或 Intent 选项
- **[ options ]** { [Object](dataTypes#object) } - Intent 补充选项或覆盖选项
- <ins>**returns**</ins> { [void](dataTypes#void) }

启动 Activity. 字符串包含 `://` 或符合网站格式时作为 URL 打开, 其他字符串作为 [AutoJs6 Activity 简称](dataTypes#intentshortformforactivity) 处理. URI 对象直接按 URL 打开.

`target` 为 Intent 时, `options` 用于补充或覆盖 Intent 配置. `target` 为对象时, 两个对象会合并, 且 `options` 中的同名属性优先. 字符串或 URI 只能作为唯一参数.

Intent 选项除 [app.intent](#app-intent-options) 支持的字段外, 还支持以下启动路由字段:

- **[ dual = false ]** { [boolean](dataTypes#boolean) } - 在非当前用户配置文件中启动, 优先级最高
- **[ shizuku = false ]** { [boolean](dataTypes#boolean) } - Shizuku 可工作时通过 `am start` 启动
- **[ root = false ]** { [boolean](dataTypes#boolean) } - Root 可用时通过 `am start` 启动

路由优先级为 `dual`, `shizuku`, `root`, 普通启动. 请求的 Shizuku 或 Root 路由不可用时继续使用后续可用路由.

```js
app.startActivity('console');

app.startActivity({
    action: 'VIEW',
    data: 'https://docs.autojs6.com',
    shizuku: true,
});
```

> 方法变更记录
> - 6.6.0 - Intent 选项支持 `dual`.
> - 6.6.1 - 支持 Intent, URI 和双对象形式, Intent 选项支持 `shizuku`.

## [m] startDualActivity

### startDualActivity(target, options?)

**`6.6.0`** **`[6.6.1]`** **`Global`**

- **target** { [IntentShortFormForActivity](dataTypes#intentshortformforactivity) | [IntentUriString](dataTypes#intenturistring) | [Intent](intentType) | [android.net.Uri](https://developer.android.com/reference/android/net/Uri) | [java.net.URI](https://docs.oracle.com/javase/8/docs/api/java/net/URI.html) | [Object](dataTypes#object) } - Activity 简称, URL, URI, Intent 或 Intent 选项
- **[ options ]** { [Object](dataTypes#object) } - Intent 补充选项或覆盖选项
- <ins>**returns**</ins> { [void](dataTypes#void) }

在非当前用户配置文件中启动 Activity. 字符串和 URI 的识别规则与 [app.startActivity](#m-startactivity) 相同. `target` 为 Intent 或对象时可传入第二个选项对象; 对象合并时 `options` 中的同名属性优先.

双开操作需要可用的 Shizuku 或 Root 权限. `target` 为 Intent 选项对象时, `shizuku` 和 `root` 可用于指定命令执行优先级; 默认优先使用 Shizuku.

```js
startDualActivity({
    packageName: 'com.android.settings',
    shizuku: true,
});
```

## app.intent(options)

- **options** { [Object](dataTypes#object) } 选项, 包括:
    - **action** { [string](dataTypes#string) } 意图的 Action, 指意图要完成的动作, 是一个字符串常量, 比如 "android.intent.action.SEND". 当 action 以 "android.intent.action" 开头时, 可以省略前缀, 直接用 "SEND" 代替. 参见 [Actions](https://developer.android.com/reference/android/content/Intent.html#standard-activity-actions/).

    - **type** { [string](dataTypes#string) } 意图的 MimeType, 表示和该意图直接相关的数据的类型, 表示比如 "text/plain" 为纯文本类型.

    - **data** { [string](dataTypes#string) } 意图的 Data, 表示和该意图直接相关的数据, 是一个 Uri, 可以是文件路径或者 Url 等. 例如要打开一个文件, action 为 "android.intent.action.VIEW", data 为 "file:///sdcard/1.txt".

    - **category** { [Array](dataTypes#array) } 意图的类别. 比较少用. 参见 [Categories](https://developer.android.com/reference/android/content/Intent.html#standard-categories/).

    - **packageName** { [string](dataTypes#string) } 目标包名

    - **className** { [string](dataTypes#string) } 目标 Activity 或 Service 等组件的名称

    - **extras** { [Object](dataTypes#object) } 以键值对构成的这个 Intent 的 Extras (额外信息). 提供该意图的其他信息, 例如发送邮件时的邮件标题, 邮件正文. 参见 [Extras](https://developer.android.com/reference/android/content/Intent.html#standard-extra-data/).

    - **flags** { [Array](dataTypes#array) } intent 的标识, 字符串数组, 例如 `["activity_new_task", "grant_read_uri_permission"]`. 参见 [Flags](https://developer.android.com/reference/android/content/Intent.html#setFlags%28int%29/).

      **[v4.1.0 新增]**

    - **root** { [boolean](dataTypes#boolean) } 是否以 root 权限启动, 发送该 intent. 使用该参数后, 不能使用 `context.startActivity()` 等方法, 而应该直接使用诸如 `app.startActivity({...})` 的方法.

      **[v4.1.0 新增]**

根据选项, 构造一个意图 Intent 对象.

例如:

```
// 打开应用来查看图片文件.
let i = app.intent({
    action: "VIEW",
    type: "image/png",
    data: "file:///sdcard/1.png"
});
context.startActivity(i);
```

需要注意的是, 除非应用专门暴露 Activity 出来, 否则在没有 root 权限的情况下使用 intent 是无法跳转到特定 Activity, 应用的特定界面的. 例如我们能通过 Intent 跳转到 QQ 的分享界面, 是因为 QQ 对外暴露了分享的 Activity; 而在没有 root 权限的情况下, 我们无法通过 intent 跳转到 QQ 的设置界面, 因为 QQ 并没有暴露这个 Activity.

但如果有 root 权限, 则在 intent 的参数加上 `"root": true` 即可. 例如使用 root 权限跳转到 AutoJs6 的设置界面为:

```
app.startActivity({
    packageName: "org.autojs.autojs6",
    className: "org.autojs.autojs.ui.settings.SettingsActivity_",
    root: true
});
```

另外, 关于 intent 的参数如何获取的问题, 一些 intent 是意外发现并且在网络中传播的 (例如跳转 QQ 聊天窗口是因为 QQ 给网页提供了跳转到客服 QQ 的方法), 如果要自己获取活动的 intent 的参数, 可以通过例如 "intent 记录", "隐式启动" 等应用拦截内部 intent 或者查询暴露的 intent. 其中拦截内部 intent 需要 XPosed 框架, 或者可以通过反编译等手段获取参数. 总之, 没有简单直接的方法.

更多信息, 请百度 [安卓 Intent](https://www.baidu.com/s?wd=android%20Intent) 或参考 [Android 指南: Intent](https://developer.android.com/guide/components/intents-filters.html#Types).

## app.sendBroadcast(options)

- **options** { [Object](dataTypes#object) } 选项

根据选项构造一个 Intent, 并发送该广播.

## app.startService(options)

- **options** { [Object](dataTypes#object) } 选项

根据选项构造一个 Intent, 并启动该服务.

## app.sendBroadcast(name)

**[v4.1.0 新增]**

- **name** { [string](dataTypes#string) } 特定的广播名称, 包括:
    * `inspect_layout_hierarchy` 布局层次分析
    * `inspect_layout_bounds` 布局范围

发送以上特定名称的广播可以触发 AutoJs6 的布局分析, 方便脚本调试. 这些广播在 AutoJs6 发送才有效, 在打包的脚本上运行将没有任何效果.

```
app.sendBroadcast("inspect_layout_bounds");
```

## [m] sendLocalBroadcastSync

### sendLocalBroadcastSync(intent)

**`[6.7.0]`** **`Global`**

- **intent** { [android.content.Intent](https://developer.android.com/reference/android/content/Intent) | [null](dataTypes#null) } - 包含本地任务动作的意图
- <ins>**returns**</ins> { [void](dataTypes#void) }

按 `intent.action` 查找 AutoJs6 本地定时任务, 并将匹配任务调度到主线程执行. 查找在 I/O 线程中完成, 此方法不会等待任务执行结束.

`intent` 或 `intent.action` 为空时不执行操作. 从 AutoJs6 `6.7.0` 起, 此方法不再使用已弃用的 AndroidX `LocalBroadcastManager`.

## app.intentToShell(options)

**[v4.1.0 新增]**

- **options** { [Object](dataTypes#object) } 选项

根据选项构造一个 Intent, 转换为对应的 shell 的 intent 命令的参数.

例如:

```
shell("am start " + app.intentToShell({
    packageName: "org.autojs.autojs6",
    className: "org.autojs.autojs.ui.settings.SettingsActivity_"
}), true);
```

参见 [intent 参数的规范](https://developer.android.com/studio/command-line/adb#IntentSpec/).

## app.parseUri(uri)

**`[6.8.0]`**

- **uri** { [string](dataTypes#string) | [android.net.Uri](https://developer.android.com/reference/android/net/Uri) | [java.net.URI](https://docs.oracle.com/javase/8/docs/api/java/net/URI.html) } - URI 字符串或对象
- <ins>**returns**</ins> { [android.net.Uri](https://developer.android.com/reference/android/net/Uri) | [null](dataTypes#null) }

转换为 Android `Uri`. Android `Uri` 输入原样返回, Java `URI` 先转换为字符串. 其他输入类型返回 `null`.

以 `file://` 开头的字符串通过 [app.getUriForFile](#app-geturiforfile-path) 转换为 FileProvider `content://` URI.

## app.getUriForFile(path)

**`[6.8.0]`**

- **path** { [string](dataTypes#string) } - 文件路径或 `file://` URI
- <ins>**returns**</ins> { [android.net.Uri](https://developer.android.com/reference/android/net/Uri) | [null](dataTypes#null) } - FileProvider URI

解析文件路径并创建 FileProvider `content://` URI. 路径无法解析时返回 `null`.

## app.getInstalledApps(options?)

**`6.8.0`**

- **[ options = { get: [ "meta_data" ] } ]** {{
    - get?: [string](dataTypes#string)[];
    - match?: [string](dataTypes#string)[];
- }}
- <ins>**returns**</ins> { [AppInfo](#c-appinfo)[] } - 已安装应用信息数组

获取当前用户的已安装应用信息.

`options.get` 和 `options.match` 中的名称分别映射到 Android `PackageManager.GET_*` 和 `PackageManager.MATCH_*` 标志. 名称使用省略前缀的小写形式, 如 `permissions`, `activities`, `system_only` 和 `uninstalled_packages`. 默认始终包含 `GET_META_DATA`; 未知名称会抛出异常.

```js
let apps = app.getInstalledApps({
    get: [ "permissions" ],
    match: [ "system_only" ],
});
console.log(apps[0].label);
```

## app.getInstalledPackages(options?)

**`6.8.0`**

- **[ options = { get: [ "meta_data" ] } ]** {{
    - get?: [string](dataTypes#string)[];
    - match?: [string](dataTypes#string)[];
- }}
- <ins>**returns**</ins> { [PackageInfo](https://developer.android.com/reference/android/content/pm/PackageInfo)[] } - 已安装包信息数组

获取当前用户的已安装包信息. 标志解析规则与 [app.getInstalledApps](#app-getinstalledapps-options) 相同. 返回对象的 `applicationInfo` 属性使用 [AppInfo](#c-appinfo) 包装.

## app.getApkInfo(path, options?)

**`6.8.0`**

- **path** { [string](dataTypes#string) } - APK 文件路径
- **[ options = { get: [ "meta_data" ] } ]** {{
    - get?: [string](dataTypes#string)[];
    - match?: [string](dataTypes#string)[];
- }}
- <ins>**returns**</ins> { [PackageInfo](https://developer.android.com/reference/android/content/pm/PackageInfo) | [null](dataTypes#null) } - APK 包信息, 无法解析时返回 `null`

读取尚未安装的 APK 文件包信息. 标志解析规则与 [app.getInstalledApps](#app-getinstalledapps-options) 相同.

---

## [C] AppInfo

**`6.8.0`** **`READONLY`**

- extends [android.content.pm.ApplicationInfo](https://developer.android.com/reference/android/content/pm/ApplicationInfo)

`AppInfo` 是 [app.getInstalledApps](#app-getinstalledapps-options) 返回的应用信息包装类. 它复制 Android `ApplicationInfo` 的全部字段并增加预先加载的应用标签.

### [p#] label

- { [string](dataTypes#string) }

应用显示标签.
