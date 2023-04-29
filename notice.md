# 消息通知 (Notice)

notice 模块用于创建并显示消息通知.

位于通知栏的消息, 可用于 [ 消息提醒 / 信息通信 / 执行操作 ] 等.

> 注: 不同安卓系统的通知表现可能存在较大差异, 与文档描述也可能存在出入.

## 简单操作

显示一条通知:

```js
/* 内容为 hello (标题为空). */
notice('hello');

/* 标题为 new message, 内容为 hello. */
notice('new message', 'hello');

/* 标题为 new message, 内容为 hello. */
notice({ title: 'new message', content: 'hello' });

/* 标题为 new message, 内容为 hello. */
notice(notice.getBuilder()
    .setContentTitle('new message')
    .setContentText('hello'));
```

显示两条独立的通知:

```js
notice('hello');
notice('world');
```

显示两条可覆盖的通知:

```js
/* 方法 A: 通过指定相同的通知 ID 实现通知覆盖. */

let id = 5; /* 任意 ID 均可, 用于区分不同的通知. */

notice('hello', { notificationId: id }); /* 指定一个通知 ID. */
sleep(1e3); /* 阻塞 1 秒. */
notice('world', { notificationId: id }); /* 通知 ID 相同, 因此 1 秒后上一条通知被替代 (覆盖). */

/* 方法 B: 通过 notice.config 配置 notice 的默认选项. */

notice.config({ useDynamicDefaultNotificationId: false }); /* 禁用动态通知 ID 选项. */
notice('hello');
sleep(1e3); /* 阻塞 1 秒. */
notice('world'); /* 1 秒后上一条通知被替代 (覆盖). */
```

显示一条定制通知:

```js
notice('hello', {
    bigContent: 'This is a message which says "hello"\n-- from AutoJs6', /* 设置长内容. */
    isSilent: true, /* 静音模式. */
    appendScriptName: 'content', /* 附加脚本名称到内容结尾. */
    intent: 'docs', /* 点击通知后跳转到 AutoJs6 的文档页面. */
    autoCancel: true, /* 点击通知后自动移除通知. */
});

/* 更多配置选项, 可参阅本章节后续内容. */
```

如果需要发送多条上述定制通知, 可将上述定制选项提取出来:

```js
/* 定义一个定制通知选项变量. */
let options = {
    bigContent: 'This is a message which says "hello"\n-- from AutoJs6', /* 设置长内容. */
    isSilent: true, /* 静音模式. */
    appendScriptName: 'content', /* 附加脚本名称到内容结尾. */
    intent: 'docs', /* 点击通知后跳转到 AutoJs6 的文档页面. */
    autoCancel: true, /* 点击通知后自动移除通知. */
};

/* 以上述定制选项发送三条通知. */

notice('hello', options);
notice('world', options);
notice('tour', options);
```

上述示例指定通知 ID 可实现通知覆盖:

```js
/* 指定一个通知 ID 为固定值. */
options.notificationId = 20;

/* 以上述定制选项发送三条可覆盖的通知. */

notice('hello', options);
sleep(1e3);
notice('world', options); /* 1 秒后覆盖 'hello'. */
sleep(1e3);
notice('tour', options); /* 1 秒后覆盖 'world'. */

/* options 可随时进行定制修改. */

delete options.bigContent; /* 删除长内容. */
sleep(1e3);
notice('movie', options); /* 1 秒后覆盖 'tour' */

options.intent = 'home'; /* 修改 intent 属性. */
sleep(1e3);
notice('here', options); /* 1 秒后覆盖 'movie' */
```

## 通知渠道

`通知渠道 (Notification Channel)` 用于分类管理通知.

例如设置两个渠道, 水果和天气. 水果渠道用于发送与水果销量变化相关的通知, 天气渠道用于发送气象数据变化相关的通知.

不同渠道的通知可分别定制, 如是否弹出通知, 是否振动, 通知指示灯开关及颜色, 是否静音等. 渠道之间的设置是互相独立的.

> 更多通知渠道的内容, 参阅 [通知渠道](notificationChannelGlossary) 术语章节.

> notice 模块的渠道相关方法, 参阅 [notice.channel](#p-channel) 小节.

### 创建渠道

通知渠道使用 `渠道 ID (Channel ID)` 作为唯一标识.

以渠道 ID 名称 `'my_channel_id'` 为例, 当 ID 为 `'my_channel_id'` 的渠道从未创建时, `channel.create('my_channel_id', options)` 将创建一个新的渠道, 其 ID 为 `'my_channel_id'`.

```js
notice.channel.create('my_channel_id', {
    name: 'New message',
    description: 'Messages from David',
    importance: 3,
    enableLights: true,
    lightColor: 'blue',
    enableVibration: true,
});
```

上述示例代码创建了一个新渠道, 并进行了渠道配置, 包括 [ 名称 (name) / 描述 (description) / 优先级 (importance) / 启动指示灯且设置为蓝色 / 启用振动 ].

创建渠道后, 使用渠道 ID 可以在渠道内显示通知:

```js
/* 简单通知. */
notice('hello', { channelId: 'my_channel_id' });

/* 设置一些选项. */
notice('hello', {
    channelId: 'my_channel_id',
    isSilent: true, /* 静音模式. */
    intent: 'homepage', /* 点击通知后跳转到 AutoJs6 的主页页面. */
    autoCancel: true, /* 点击通知后自动移除通知. */
});
```

### 修改渠道

以渠道 ID 名称 `'my_channel_id'` 为例, 当 ID 为 `'my_channel_id'` 的渠道已存在 (且未经删除) 时, `channel.create('my_channel_id', options)` 将修改这个渠道的相关配置.

```js
notice.channel.create('my_channel_id', {
    name: 'New message',
    description: 'There is a new message from David',
    importance: 3,
});
```

上述示例代码修改了渠道配置, 包括 [ 名称 (name) / 描述 (description) / 优先级 (importance) ].

需额外留意, 渠道的修改并非总是生效的, 需满足以下规则:

- 名称 (name) 允许修改
- 描述 (description) 允许修改
- 优先级 (importance) 需同时满足以下两个条件方可修改
    - 优先级降级修改
    - 用户从未修改当前渠道的优先级
- 除上述 [ 名称 / 描述 / 优先级 ] 外, 其他所有属性均无法修改

### 恢复渠道

以渠道 ID 名称 `'my_channel_id'` 为例, 当 ID 为 `'my_channel_id'` 的渠道通过 `channel.remove()` 被删除时, `channel.create('my_channel_id', options)` 将重新恢复之前被删除的渠道 (反删除), 且附带之前渠道的所有配置.

这样的设计是防止应用通过代码的方式恶意篡改用户对通知渠道的配置.

### 渠道放权

使用代码创建渠道时, 可自定义渠道的默认通知行为, 如指示灯颜色及是否振动等.

但渠道创建后, 将无法通过代码更改这些设置 (除上面提到的名称, 描述, 和受条件限制的优先级之外).

对于渠道的设置, 用户拥有最终控制权.

---

<p style="font: bold 2em sans-serif; color: #FF7043">notice</p>

---

## [@] notice

notice 可作为全局对象使用:

```js
typeof notice; // "function"
typeof notice.channel; // "object"
typeof notice.getBuilder; // "function"
```

### notice(content)

**`6.3.0`** **`Global`** **`Overload 1/8`**

- **content** { [string](dataTypes#string) } - 通知消息的内容
- <ins>**returns**</ins> { [number](dataTypes#number) } - 通知 ID

发送通知, 包含内容.

```js
notice('hello');
```

### notice(title, content)

**`6.3.0`** **`Global`** **`Overload 2/8`**

- **title** { [string](dataTypes#string) } - 通知消息的标题
- **content** { [string](dataTypes#string) } - 通知消息的内容
- <ins>**returns**</ins> { [number](dataTypes#number) } - 通知 ID

发送通知, 包含标题及内容.

```js
notice('message', 'hello');
```

> 注: 第 1 个 (索引 0) 参数代表标题, 第 2 个 (索引 1) 参数代表内容.

### notice()

**`6.3.0`** **`Global`** **`Overload 3/8`**

- <ins>**returns**</ins> { [number](dataTypes#number) } - 通知 ID

发送通知, 主要用于测试.

该测试通知包含标题及内容.

```js
// 以 AutoJs6 语言为 English 为例, 
// 标题为 Script notification, 
// 内容为 Notification from script.
notice();
```

### notice(options)

**`6.3.0`** **`Global`** **`Overload 4/8`**

- **options** { [NoticeOptions](noticeOptionsType) } - 通知选项配置
- <ins>**returns**</ins> { [number](dataTypes#number) } - 通知 ID

发送通知, 并进行选项配置.

```js
notice({
    bigContent: 'This is a message which says "hello"\n-- from AutoJs6', /* 设置长内容. */
    isSilent: true, /* 静音模式. */
    appendScriptName: 'content', /* 附加脚本名称到内容结尾. */
    intent: 'settings', /* 点击通知后跳转到 AutoJs6 的设置页面. */
    autoCancel: true, /* 点击通知后自动移除通知. */
});
```

更多配置选项, 可参阅 [NoticeOptions](noticeOptionsType) 类型章节.

### notice(content, options)

**`6.3.0`** **`Global`** **`Overload 5/8`**

- **content** { [string](dataTypes#string) } - 通知消息的内容
- **options** { [NoticeOptions](noticeOptionsType) } - 通知选项配置
- <ins>**returns**</ins> { [number](dataTypes#number) } - 通知 ID

发送通知, 包含内容, 并进行选项配置.

与 `notice(options)` 类似, 但增加 `content` 参数.

```js
notice('hello', { isSilent: true });
```

> 注: 内容参数可能重复指定.  
> 出现重复指定时, 按以下优先级处理:  
> options.content > content

### notice(title, content, options)

**`6.3.0`** **`Global`** **`Overload 6/8`**

- **title** { [string](dataTypes#string) } - 通知消息的标题
- **content** { [string](dataTypes#string) } - 通知消息的内容
- **options** { [NoticeOptions](noticeOptionsType) } - 通知选项配置
- <ins>**returns**</ins> { [number](dataTypes#number) } - 通知 ID

发送通知, 包含标题及内容, 并进行选项配置.

与 `notice(options)` 类似, 但增加 `title` 和 `content` 参数.

```js
notice('message', 'hello', { isSilent: true });
```

> 注: 标题参数与内容参数可能重复指定.  
> 出现重复指定时, 按以下优先级处理:  
> options.title > title
> options.content > content

### notice(builder)

**`6.3.0`** **`Global`** **`Overload 7/8`**

- **builder** { [NoticeBuilder](noticeBuilderType) } - 通知构建器
- <ins>**returns**</ins> { [number](dataTypes#number) } - 通知 ID

使用 `通知构建器 (Notice Builder)` 发送通知.

参阅 [getBuilder](#m-getbuilder) 小节.

### notice(builder, options)

**`6.3.0`** **`Global`** **`Overload 8/8`**

- **builder** { [NoticeBuilder](noticeBuilderType) } - 通知构建器
- **options** { [NoticeOptions](noticeOptionsType) } - 通知选项配置
- <ins>**returns**</ins> { [number](dataTypes#number) } - 通知 ID

使用 `通知构建器 (Notice Builder)` 发送通知, 并进行选项配置.

```js
let notificationId = 12;
let progress = 0;
let progressMax = 100;

let builder = notice.getBuilder()
    .setSilent(true)
    .setContentTitle('正在下载应用');

while (progress < progressMax) {
    builder
        .setProgress(progressMax, progress, false)
        .setContentText(`已完成 ${progress}%`);
    notice(builder, { notificationId });
    sleep(50);
    progress += Mathx.randInt(1, 4);
}
builder
    .setContentText(`已完成 ${progressMax}%`)
    .setContentTitle('下载完成')
notice(builder, { notificationId });
```

参阅 [getBuilder](#m-getbuilder) 小节.

## [m] isEnabled

### isEnabled()

**`6.3.0`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

检测 AutoJs6 的通知是否未被阻止 (not blocked).

通常的阻止 (block) 情况:

- 通知全局开关默认未开启或被用户关闭
- 通知权限 `Manifest.permission.POST_NOTIFICATIONS` 未授予或被撤回

```js
console.log(notice.isEnabled()); /* e.g. true */
```

部分机型的 toast 功能依赖通知权限, 如需在使用 toast 时检查通知权限是否被阻止, 可使用 `isEnabled` 或 `ensureEnabled` 方法:

```js
if (!notice.isEnabled()) {
    console.warn('通知被阻止, toast 可能无法正常显示');
}
toast('hello');

notice.ensureEnabled();
toast('hello');
```

结合 [notice.launchSettings](#m-launchsettings) 可辅助用户跳转至通知设置页面:

```js
if (!notice.isEnabled()) {
    notice.launchSettings();
}
```

## [m] ensureEnabled

### ensureEnabled()

**`6.3.0`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

确保 AutoJs6 的通知未被阻止 (not blocked).

当通知被阻止时将抛出 `Exception` 异常.

## [m] launchSettings

### launchSettings()

**`6.3.0`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

跳转至 AutoJs6 的通知设置页面.

```js
notice.launchSettings();
```

## [m] cancel

### cancel(id)

**`6.3.0`**

- **id** { [number](dataTypes#number) } - 通知 ID
- <ins>**returns**</ins> { [void](dataTypes#void) }

消除通知.

```js
let id = notice({ title: 'New message' });
/* 2 秒后自动消除通知. */
setTimeout(() => notice.cancel(id), 2e3);
```

## [m] getBuilder

### getBuilder()

**`6.3.0`**

- <ins>**returns**</ins> { [NoticeBuilder](noticeBuilderType) }

获取一个简单通知构建器.

简单通知构建器包含以下默认设置:

- `setSmallIcon(R.drawable.autojs6_material)` # AutoJs6 应用图标作为 smallIcon
- `setPriority(NotificationCompat.PRIORITY_HIGH)` # 高优先级 (仅针对 Android 7.1 及以下)

构建器通常配合 `notice` 方法作为 第 1 个 (索引 0) 参数使用, 即 `notice(notice.getBuilder())`:

```js
let builder = notice.getBuilder();
builder.setContentTitle('Weather condition');
builder.setContentText('The sky is getting dark');
notice(builder);

/* 链式调用使代码更简洁. */

notice(notice.getBuilder()
    .setContentTitle('Weather condition')
    .setContentText('The sky is getting dark'));
```

构建器可用于设置更多通知行为, 如 [setStyle](noticeBuilderType#m-setstyle), [setTimeoutAfter](noticeBuilderType#m-settimeoutafter), [setProgress](noticeBuilderType#m-setprogress) 等.

但需要注意参数类型需严格符合要求, AutoJs6 内置的 [全能类型](omniTypes) 是不可用的.

关于通知构建器的更多用法, 参阅 [NoticeBuilder](noticeBuilderType) 类型章节.

## [m] config

config 方法用于修改默认配置, 即用于配置通知渠道与通知发送的默认行为.

例如 `notice('hello')` 会发送一个内容为 "hello" 的通知, 但其中隐含了许多默认的通知行为.

> 注: 初次使用 notice 模块时, 建议先跳过此小节内容, 待了解包括 [channel](#p-channel) 等在内的相关内容后再继续阅读当前小节.

例如, `isSilent` 默认为 `false`, 表示不进行强制静音.  
通过 `notice.config` 可配置所有通知发送时, 默认启用强制静音:

```js
notice.config({ defaultIsSilent: true }); /* 通知发送时, 默认强制静音. */
```

执行上述示例代码后, `notice('hello')` 将会静音发送通知.

如果不执行上述代码, 则需要在每一个 notice 方法中加入 `isSilent` 选项设置:

```js
notice('hello', { isSilent: true });
notice('message', { isSilent: true });
notice('finished', { isSilent: true });
/* ... ... */
```

因此, `notice.config` 适用于在同一个脚本或项目中, 有多次使用 `notice` 需求的场景.

> 注: notice.config 配置的是默认行为, 当通过参数明确指定了某个行为时, 默认行为将不会生效.

### config(preset)

**`6.3.0`**

- **preset** { [NoticePresetConfiguration](noticePresetConfigurationType) } - 通知预设配置对象
- <ins>**returns**</ins> { [void](dataTypes#void) }

配置通知渠道与通知发送的默认行为.

```js
notice.config({
    useDynamicDefaultNotificationId: false, /* 禁用动态通知 ID. */
    useScriptNameAsDefaultChannelId: false, /* 禁用以脚本名称作为渠道 ID. */
    enableChannelInvalidModificationWarnings: false, /* 禁用渠道修改无效的警告消息. */
    defaultTitle: 'NEW MESSAGE', /* 修改默认通知标题. */
    /* ... ... */
});
```

更多可用的默认行为配置, 参阅 [NoticePresetConfiguration](noticePresetConfigurationType) 类型章节.

## [p+] channel

### [m] create

`channel.create` 可用于 [ [创建](#创建渠道) / [修改](#修改渠道) / [恢复](#恢复渠道) ] 某个特定 `渠道 ID (Channel ID)` 的通知渠道.

详见 [通知渠道](#通知渠道) 小节.

#### create(channelId)

**`6.3.0`** **`Overload 1/3`**

- **channelId** { [string](dataTypes#string) | [number](dataTypes#number) } - 渠道 ID
- <ins>**returns**</ins> { [string](dataTypes#string) } - 渠道 ID

创建通知渠道, 并指定渠道 ID.

```js
let id = 'my_channel_id';
notice.channel.create(id); /* 创建渠道. */
notice('hello', { channelId: id }); /* 发送通知. */
```

#### create(channelId, options)

**`6.3.0`** **`Overload 2/3`**

- **channelId** { [string](dataTypes#string) | [number](dataTypes#number) } - 渠道 ID
- **options** { [NoticeChannelOptions](noticeChannelOptionsType) } - 渠道创建选项
- <ins>**returns**</ins> { [string](dataTypes#string) } - 渠道 ID

创建通知渠道, 指定渠道 ID 并进行渠道配置.

```js
notice.channel.create('my_channel_id', {
    name: 'New message', /* 渠道名称. */
    description: 'Messages from David', /* 渠道描述. */
    importance: 3, /* 渠道优先级. */
    enableLights: true, /* 启用指示灯. */
    lightColor: 'blue', /* 设置指示灯颜色. */
    enableVibration: true, /* 启用振动. */
});
```

更多渠道配置相关信息, 参阅 [NoticeChannelOptions](noticeChannelOptionsType) 类型章节.

> 注: 渠道 ID 可能重复指定.  
> 出现重复指定时, 按以下优先级处理:  
> options.id > channelId

#### create(options)

**`6.3.0`** **`Overload 3/3`**

- **options** { [NoticeChannelOptions](noticeChannelOptionsType) } - 渠道创建选项
- <ins>**returns**</ins> { [string](dataTypes#string) } - 渠道 ID

创建通知渠道, 与 `create(channelId, options)` 方法类似, 但省略 `channelId` 参数.

如需指定渠道 ID, 可在 `options` 参数中使用 `id` 属性:

```js
notice.channel.create({ id: 'my_channel_id' });
```

当不指定 `id` 时, 渠道 ID 将使用当前运行脚本的脚本名称.

更多渠道配置相关信息, 参阅 [NoticeChannelOptions](noticeChannelOptionsType) 类型章节.

### [m] contains

#### contains(channelId)

**`6.3.0`**

- **channelId** { [string](dataTypes#string) | [number](dataTypes#number) } - 渠道 ID
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 当前渠道 ID 是否已被创建

返回指定 `渠道 ID (Channel ID)` 的 AutoJs6 渠道是否存在.

```js
notice.channel.contains('my_channel_id'); /* e.g. false */
```

### [m] remove

#### remove(channelId)

**`6.3.0`**

- **channelId** { [string](dataTypes#string) | [number](dataTypes#number) } - 渠道 ID
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 删除前, 当前渠道 ID 是否已被创建

根据 `渠道 ID (Channel ID)` 删除 AutoJs6 的渠道实例.

删除前, 若渠道已被创建且未被删除, 则返回 `true`, 否则返回 `false`.

```js
let id = 'my_channel_id';
if (notice.channel.contains(id)) {
    notice.channel.remove(id); // true
}
```

### [m] get

#### get(channelId)

**`6.3.0`**

- <ins>**returns**</ins> { [android.app.NotificationChannel](https://developer.android.com/reference/android/app/NotificationChannel) | [null](dataTypes#null) } - 渠道实例

根据 `渠道 ID (Channel ID)` 获取 AutoJs6 的渠道实例, 不存在时返回 `null`.

```js
let id = 'my_channel_id';
if (notice.channel.contains(id)) {
    console.log(notice.channel.get(id)); /* 打印通知渠道信息. */
} else {
    console.log(`ID "${id}" 对应的通知渠道不存在`);
}

/* 不使用 contains 也可以判断 Channel ID 的存在性. */

let channel = notice.channel.get(id);
if (channel !== null) {
    /* ... */
}
```

### [m] getAll

#### getAll()

**`6.3.0`**

- <ins>**returns**</ins> { [android.app.NotificationChannel](https://developer.android.com/reference/android/app/NotificationChannel)[[]](dataTypes#array) } - 渠道实例数组

获取 AutoJs6 的所有通知渠道实例 (不包含已被删除的).

```js
console.log(`当前共计渠道 ${notice.channel.getAll().length} 个`);
notice.channel.getAll().map(ch => ch.getId()); /* 获取所有渠道的 ID. */
```