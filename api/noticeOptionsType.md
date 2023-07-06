# NoticeOptions

NoticeOptions 是一个发送 AutoJs6 通知时用于设置通知选项的接口.  
这些选项将影响通知的 [ 文本内容 / 发送方式 / 主题样式 / 视听反馈 ] 等.

常见相关方法或属性:

- [notice](notice#notice)(**options**)
- [notice](notice#notice)(content, **options**)
- [notice](notice#notice)(title, content, **options**)
- [notice](notice#notice)(builder, **options**)

---

<p style="font: bold 2em sans-serif; color: #FF7043">NoticeOptions</p>

---

## [p?] title

- { [string](dataTypes#string) } - 通知标题

指定通知标题.

```js
notice({ title: 'New message' });
notice('New message', ''); /* 效果同上, 但不常用. */
```

此属性值会覆盖 `notice(title, content, options)` 方法的 `title` 参数值:

```js
/* 标题被覆盖为 Overridden title. */
notice('New message', '', { title: 'Overridden title' });
```

<picture>
  <source srcset="images/autojs6-notification-title-sample-dark.png" media="(prefers-color-scheme: dark) and (max-width: 1024px)" width="760px">
    <source srcset="images/autojs6-notification-title-sample-dark.png" media="(prefers-color-scheme: dark) and (min-width: 1024px)" width="411px">
    <source srcset="images/autojs6-notification-title-sample.png" media="(min-width: 1024px)" width="411px">
    <img src="images/autojs6-notification-title-sample.png" alt="autojs6-notification-title-sample" width="760">
</picture>

上述示例图片仅包含通知标题, 而没有通知内容.

当 `title` 不指定时, 其默认值的情况取决于 [config.defaultTitle](noticePresetConfigurationType#p-defaulttitle) 配置值.

## [p?] content

- { [string](dataTypes#string) } - 通知内容

设置通知内容.

```js
notice({ content: 'New message' });
notice('New message'); /* 效果同上, 且相对便捷. */
```

此属性值会覆盖 `notice(title, content, options)` 及 `notice(content, options)` 方法的 `content` 参数值:

```js
/* 内容会被覆盖为 Overridden content. */
notice('Some text', { content: 'Overridden content' });

/* 内容同样会被覆盖为 Overridden content. */
notice('Some text', 'New message', { content: 'Overridden content' });
```

<picture>
  <source srcset="images/autojs6-notification-content-sample-dark.png" media="(prefers-color-scheme: dark) and (max-width: 1024px)" width="760px">
    <source srcset="images/autojs6-notification-content-sample-dark.png" media="(prefers-color-scheme: dark) and (min-width: 1024px)" width="411px">
    <source srcset="images/autojs6-notification-content-sample.png" media="(min-width: 1024px)" width="411px">
    <img src="images/autojs6-notification-content-sample.png" alt="autojs6-notification-content-sample" width="760">
</picture>

上述示例图片同时包含了通知标题及通知内容.

当 `content` 不指定时, 其默认值的情况取决于 [config.defaultContent](noticePresetConfigurationType#p-defaultcontent) 配置值.

## [p?] bigContent

- { [string](dataTypes#string) } - 通知长文本内容

设置通知长文本内容.

当需要在通知消息中显示长度较长的文本内容时, 使用 `content` 往往会导致内容无法完整显示:

```js
let content = 'Note that a specific charset should be specified whenever possible. Relying on the platform default means that the code is Locale-dependent. Only use the default if the files are known to always use the platform default.';
notice({ content: content });
```

<picture>
  <source srcset="images/autojs6-notification-big-text-for-content-dark.png" media="(prefers-color-scheme: dark) and (max-width: 1024px)" width="760px">
    <source srcset="images/autojs6-notification-big-text-for-content-dark.png" media="(prefers-color-scheme: dark) and (min-width: 1024px)" width="411px">
    <source srcset="images/autojs6-notification-big-text-for-content.png" media="(min-width: 1024px)" width="411px">
    <img src="images/autojs6-notification-big-text-for-content.png" alt="autojs6-notification-big-text-for-content" width="760">
</picture>

示例图片中只能显示部分文本内容, 因为通知内容应秉持的简洁原则.

而 `bigContent` 属性则可满足长文本通知内容的需求:

```js
let content = 'Note that a specific charset should be specified whenever possible. Relying on the platform default means that the code is Locale-dependent. Only use the default if the files are known to always use the platform default.';
notice({ bigContent: content });
```

<picture>
  <source srcset="images/autojs6-notification-big-content-sample-dark.png" media="(prefers-color-scheme: dark) and (max-width: 1024px)" width="760px">
    <source srcset="images/autojs6-notification-big-content-sample-dark.png" media="(prefers-color-scheme: dark) and (min-width: 1024px)" width="411px">
    <source srcset="images/autojs6-notification-big-content-sample.png" media="(min-width: 1024px)" width="411px">
    <img src="images/autojs6-notification-big-content-sample.png" alt="autojs6-notification-big-text-for-big-content" width="760">
</picture>

示例图片中完整显示了长文本通知内容.

当 `bigContent` 不指定时, 其默认值的情况取决于 [config.defaultBigContent](noticePresetConfigurationType#p-defaultbigcontent) 配置值.

## [p?] isSilent

- [ `false` ] { [boolean](dataTypes#boolean) } - 通知消息是否为安静模式

设置通知消息是否为安静模式, 即不发出声音或产生振动.

需额外注意, `isSilent` 只能强制通知消息静音免振, 而不会使原本没有声音或振动反馈的通知发出声音或产生振动.

```js
/* 强制通知消息静音免振. */
notice({ isSilent: true });
```

当 `isSilent` 不指定时, 其默认值的情况取决于 [config.defaultIsSilent](noticePresetConfigurationType#p-defaultissilent) 配置值.

## [p?] autoCancel

- [ `false` ] { [boolean](dataTypes#boolean) } - 通知消息是否自动消除

设置通知消息是否在用户点击时自动消除.

```js
notice({ autoCancel: true });
```

当 `autoCancel` 不指定时, 其默认值的情况取决于 [config.defaultAutoCancel](noticePresetConfigurationType#p-defaultautocancel) 配置值.

使用 [notice.cancel](notice#m-cancel) 也可实现通知消除.

如需增加通知消息的点击事件, 如点击后跳转到指定页面, 可使用 [intent](#p-intent) 选项参数.

## [p?] intent

- [ `null` ] { [OmniIntent](omniTypes#omniintent) } - 通知消息点击时的执行动作

设置通知消息点击时的执行动作.

```js
/* 显示一条通知, 点击通知后自动消除并跳转到 AutoJs6 文档页面. */
notice({ intent: 'docs', autoCancel: true });

/* 显示一条通知, 点击通知后自动消除并跳转到浏览器, 导航至 msn 主页. */
notice({ intent: 'msn.com', autoCancel: true });

/* 显示一条通知, 点击通知后自动消除并执行自定义意图行为 (分享消息至 QQ 应用). */
notice({
    intent: {
        action: 'android.intent.action.SEND',
        type: 'text/*',
        extras: { 'android.intent.extra.TEXT': 'HELLO WORLD' },
        packageName: App.QQ.getPackageName(),
        className: '@{packageName}.activity.JumpActivity',
    },
    autoCancel: true,
});
```

## [p?] appendScriptName

- [ `null` ] { [boolean](dataTypes#boolean) | `'auto'` | `'title'` | `'content'` | `'bigContent'` } - 附加脚本文件全名

设置通知消息中是否附加脚本文件全名, 并支持指定附加目标.

- `'title'` - 附加目标为通知标题
- `'content'` - 附加目标为通知内容
- `'bigContent'` - 附加目标为通知长文本内容
- `'auto'` - 根据通知内容自动选择附加目标 (优先级: bigContent > content > title)
- `true` - 相当于 `'auto'` 选项
- `false` - 不做任何附加
- `null` - 取决于 [config.defaultAppendScriptName](noticePresetConfigurationType#p-defaultappendscriptname) 配置值

附加的文本格式为 `%空格%(%脚本文件名%.%脚本扩展名%)`.

以下是附加到通知 `标题 (title)` 上的一个示例:

```js
let title = `\u65b0\u6d88\u606f`;
let sender = `\u7ea6\u7ff0`;
let moment = `\u4e0b\u5348 2 \u70b9`;
let event = `\u5e03\u62c9\u683c\u5e7f\u573a\u65c1\u7684\u96c5\u514b\u5496\u5561\u9986\u89c1`;

notice(title, `${sender}: ${moment}${event}`, {
    appendScriptName: 'title',
});
```

<picture>
  <source srcset="images/autojs6-notification-append-script-name-on-title-dark.png" media="(prefers-color-scheme: dark) and (max-width: 1024px)" width="760px">
    <source srcset="images/autojs6-notification-append-script-name-on-title-dark.png" media="(prefers-color-scheme: dark) and (min-width: 1024px)" width="411px">
    <source srcset="images/autojs6-notification-append-script-name-on-title.png" media="(min-width: 1024px)" width="411px">
    <img src="images/autojs6-notification-append-script-name-on-title.png" alt="autojs6-notification-append-script-name-on-title" width="760">
</picture>

上述示例图片中的脚本文件全名为 `main.js`.

当 `appendScriptName` 不指定时, 其默认值的情况取决于 [config.defaultAppendScriptName](noticePresetConfigurationType#p-defaultappendscriptname) 配置值.

## [p?] priority

- [ `'high'` ] { [number](dataTypes#number) | `'default'` | `'low'` | `'min'` | `'high'` | `'max'` } - 优先级

设置通知消息的优先级 (仅适用于部分系统).

`priority` 参数接收由整形常量转化而来的字符串简化形式:

| 字符串        | 整形常量                                                                            | 简述                                                            |
|------------|---------------------------------------------------------------------------------|---------------------------------------------------------------|
| 'min'      | <span style="white-space:nowrap">NotificationCompat.PRIORITY_MIN = -2</span>    | <span style="white-space:nowrap">通知最低优先级, 适于无需引起注意的条目.</span> |
| 'low'      | <span style="white-space:nowrap">NotificationCompat.PRIORITY_LOW = -1</span>    | <span style="white-space:nowrap">通知低优先级, 适于无关紧要的条目.</span>    |
| 'default'  | <span style="white-space:nowrap">NotificationCompat.PRIORITY_DEFAULT = 0</span> | <span style="white-space:nowrap">通知默认优先级.</span>              |
| **'high'** | <span style="white-space:nowrap">NotificationCompat.PRIORITY_HIGH = 1</span>    | <span style="white-space:nowrap">通知高优先级, 适于重要通知或警示.</span>    |
| 'max'      | <span style="white-space:nowrap">NotificationCompat.PRIORITY_MAX = 2</span>     | <span style="white-space:nowrap">通知最高优先级, 适于紧急条目.</span>      |

`priority` 仅适用于以下操作系统:

- `Android API 24 (7.0) [N]`
- `Android API 25 (7.1-7.1.2) [N_MR1]`

其他版本操作系统将忽略此设置项.

```js
/* 使用最小优先级显示通知. */
notice({ priority: 'min' });
```

自 `Android API 26 (8.0) [O]` 起, 通知消息优先级由通知渠道管理, 因此需使用 [channel.importance](noticeChannelOptionsType#p-importance) 按渠道设置通知消息的优先级.

当 `priority` 不指定时, 其默认值的情况取决于 [config.defaultPriority](noticePresetConfigurationType#p-defaultpriority) 配置值.

## [p?] notificationId

- { [string](dataTypes#string) | [number](dataTypes#number) } - 通知 ID

`notificationId` 属性可指定通知 ID, 即通知消息的唯一识别 ID.

通知 ID 相同时, 后续的通知将覆盖掉之前的通知:

```js
notice('A', { notificationId: 10 });
notice('B', { notificationId: 10 });
notice('C', { notificationId: 10 });
```

上述示例代码运行后, 只会显示最后一个通知, 内容为 'C', 因为它们的通知 ID 相同, 之前的通知被覆盖.

```js
notice('A', { notificationId: 10 });
sleep(1e3);
notice('B', { notificationId: 10 });
sleep(1e3);
notice('C', { notificationId: 10 });
```

加上适当间隔后可以看到覆盖的过程.

一个进度更新的示例:

```js
let notificationId = 20;
let current = 0;
let max = 100;
let step = 1;
while (current <= 100) {
    notice(`Progress: ${current}%`, {
        notificationId: notificationId,
        isSilent: true,
    });
    current += step;
    sleep(50);
}
```

上述示例中, [isSilent](#p-issilent) 用于控制通知消息不发出声音及产生振动, 否则进度更新过程中, 用户将不断收到打扰.  
`notificationId` 设置为统一的值, 如果每个通知使用不同的 ID, 进度更新过程中, 将在通知栏布满上百条通知.

当 `notificationId` 不指定时, 其默认值的情况取决于 [config.useDynamicDefaultNotificationId](noticePresetConfigurationType#p-usedynamicdefaultnotificationid) 配置值.  
配置值为 `true` 时, 将以时间戳为参考量生成不同的通知 ID , 否则以内置的固定值作为通知 ID.

因此, 默认情况下, 通知 ID 是动态的:

```js
notice('hello');
notice('world');
```

上述示例中的两个 `notice` 方法没有指定通知 ID, 因此它们的通知 ID 默认是不同的.  
通知栏会显示两个通知, 'world' 不会覆盖 'hello'.

使用 console.log 方法在控制台打印 `notice` 的结果, 也可以看出通知 ID 的情况:

```js
console.log(notice('hello')); /* 某个数值 A. */
console.log(notice('world')); /* 不同于 A 的数值 B. */
```

使用 `useDynamicDefaultNotificationId` 禁用动态通知 ID 可改变默认行为:

```js
notice.config({ useDynamicDefaultNotificationId: false });
console.log(notice('hello')); /* 某个数值 A. */
console.log(notice('world')); /* 同上. */
```

此时, 通知栏仅显示 'world', 而 'hello' 被覆盖.

> 注: 动态通知 ID 的内部实现代码片段:
> ```kotlin
> (System.currentTimeMillis() % Int.MAX_VALUE).toInt()
> ```

## [p?] channelId

- { [string](dataTypes#string) | [number](dataTypes#number) } - 渠道 ID

[通知渠道](notificationChannelGlossary) 使用 `渠道 ID (Channel ID)` 作为唯一标识, `channelId` 属性可指定当前发送通知的目标渠道.

```js
/* 在 exercise 渠道上发送一条通知, 内容为 "hello". */
notice('hello', { channelId: 'exercise' });

/* 在 12 渠道上发送一条通知, 内容同样为 "hello". */
notice('hello', { channelId: 12 });

/* 虽然上面两个通知内容相同, 但渠道 ID 不同, 通知的行为及样式也会不同. */
/* 例如 exercise 渠道设置了启用振动及声音, 而 12 渠道设置了通知静音. */
```

当 `channelId` 不指定时, 其默认值的情况取决于 [config.useScriptNameAsDefaultChannelId](noticePresetConfigurationType#p-usescriptnameasdefaultchannelid) 配置值.  
配置值为 `true` 时, 将以脚本文件全名作为目标渠道 ID , 否则以内置的固定值作为目标渠道 ID.

```js
/* 1. useScriptNameAsDefaultChannelId 启用 (默认). */
notice.config({ useScriptNameAsDefaultChannelId: true });

/* 不指定渠道 ID, 此时渠道 ID 默认为脚本文件全名. */
notice('hello');

/* 2. useScriptNameAsDefaultChannelId 禁用. */
notice.config({ useScriptNameAsDefaultChannelId: false });

/* 不指定渠道 ID, 此时渠道 ID 默认为一个内置固定值. */
notice('hello');
```