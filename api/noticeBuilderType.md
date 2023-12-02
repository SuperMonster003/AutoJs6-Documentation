# NoticeBuilder

[androidx.core.app.NotificationCompat.Builder](https://developer.android.com/reference/android/app/Notification.Builder) 别名.

NoticeBuilder 表示一个通知构建器.

常见相关方法或属性:

- [notice.getBuilder](notice#m-getbuilder)

> 注: 本章节仅列出部分属性或方法.

---

<p style="font: bold 2em sans-serif; color: #FF7043">androidx.core.app.NotificationCompat.Builder</p>

---

## [m] setAutoCancel

### setAutoCancel(autoCancel)

- **autoCancel** { [boolean](dataTypes#boolean) }
- <ins>**returns**</ins> { [NoticeBuilder](noticeBuilderType) }

配置用户点击通知后是否自动移除通知.

## [m] setChannelId

### setChannelId(channelId)

- **channelId** { [string](dataTypes#string) }
- <ins>**returns**</ins> { [NoticeBuilder](noticeBuilderType) }

设定通知渠道 ID.

## [m] setColor

### setColor(argb)

- **argb** { [ColorInt](dataTypes#colorint) }
- <ins>**returns**</ins> { [NoticeBuilder](noticeBuilderType) }

设定通知的 `强调色 (Accent Color)`.

此颜色将应用于通知 `标头图像 (Header Image)` 的着色, 而不会改变通知字体颜色或通知背景颜色等.

```js
notice(notice.getBuilder()
    .setContentText('hello')
    .setColor(Color('dark-orange').toInt()));
```

## [m] setContentTitle

### setContentTitle(title)

- **title** { [string](dataTypes#string) }
- <ins>**returns**</ins> { [NoticeBuilder](noticeBuilderType) }

设定通知的文本标题.

## [m] setContentText

### setContentText(text)

- **text** { [string](dataTypes#string) }
- <ins>**returns**</ins> { [NoticeBuilder](noticeBuilderType) }

设定通知的文本内容.

## [m] setOnGoing

### setOnGoing(ongoing)

- **ongoing** { [boolean](dataTypes#boolean) }
- <ins>**returns**</ins> { [NoticeBuilder](noticeBuilderType) }

设定通知为 "正在进行中" 状态.

正在进行中, 意味着通知关联着一个用户正在参与的后台任务, 如 [ 播放音乐 / 下载任务 / 文件同步操作 / 网络连接激活 ] 等.  
这样的通知不能被用户消除 (如左右滑动), 只能通过 [notice.cancel](notice#m-cancel) 或 [NoticeBuilder#setAutoCancel](noticeBuilderType#m-setautocancel) 等方式消除.

## [m] setProgress

### setProgress(max, progress, indeterminate)

- **max** { [number](dataTypes#number) } - 进度最大值
- **progress** { [number](dataTypes#number) } - 当前进度值
- **indeterminate** { [boolean](dataTypes#boolean) } - 是否为不确定进度条
- <ins>**returns**</ins> { [NoticeBuilder](noticeBuilderType) }

设定通知条目的进度值及样式 (以 ProgressBar 控件呈现).

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

## [m] setSmallIcon

### setSmallIcon(icon)

**`Overload 1/2`**

- **icon** { [number](dataTypes#number) } - Drawable (可绘制) [资源 ID](glossaries#资源-ID)
- <ins>**returns**</ins> { [NoticeBuilder](noticeBuilderType) }

设定通知的小图标.

`icon` 参数需对应内置的 Drawable 资源, 使用 [R.drawable](global#p-drawable) 可获取 AutoJs6 的 Drawable (可绘制) 资源 ID:

```js
/* 设定通知的小图标为闹钟图标. */
notice(notice.getBuilder()
    .setSmallIcon(R.drawable.ic_access_alarm_black_48dp)
    .setContentTitle('小图标测试')
    .setContentText('闹钟图标'));
```

### setSmallIcon(iconCompat)

**`Overload 2/2`**

- **iconCompat** { [IconCompat](https://developer.android.com/reference/androidx/core/graphics/drawable/IconCompat) }
- <ins>**returns**</ins> { [NoticeBuilder](noticeBuilderType) }

设定通知的小图标.

`iconCompat` 参数为 [IconCompat](https://developer.android.com/reference/androidx/core/graphics/drawable/IconCompat) 类型, 是对 [Icon](https://developer.android.com/reference/android/graphics/drawable/Icon.html) 类型的浅层封装, 支持 `createFromIcon` / `createWithBitmap` / `createWithContentUri` 等静态方法直接创建 `IconCompat` 实例.

```js
const IconCompat = androidx.core.graphics.drawable.IconCompat;
let img = images.read('./test.png').oneShot();
notice(notice.getBuilder()
    .setSmallIcon(IconCompat.createWithBitmap(img.bitmap))
    .setContentTitle('小图标测试')
    .setContentText('从本地文件加载图标'));
img.shoot();
```

## [m] setStyle

### setStyle(style)

- **style** { [NotificationCompat.Style](https://developer.android.com/reference/androidx/core/app/NotificationCompat.Style) } - 通知样式类型对象
- <ins>**returns**</ins> { [NoticeBuilder](noticeBuilderType) }

设定通知的风格样式.

部分常用样式模板类:

- [NotificationCompat.BigPictureStyle](#bigpicturestyle)
- [NotificationCompat.BigTextStyle](#bigtextstyle)
- [NotificationCompat.InboxStyle](#inboxstyle)
- [NotificationCompat.MessagingStyle](#messagingstyle)
- ... ...

#### BigTextStyle

大量文本内容通知样式.

```js
let builder = notice.getBuilder();
let text = Array(6).fill('This is a long text for test.').join('\n');
let bigTextStyle = new NotificationCompat.BigTextStyle().bigText(text);
notice(builder.setStyle(bigTextStyle));
```

[NoticeOptions#bigContent](noticeOptionsType#p-bigcontent) 接口属性, 其内部实现就使用了 BigTextStyle 样式模板类.

> 参阅: [Android Docs](https://developer.android.com/reference/androidx/core/app/NotificationCompat.BigTextStyle)

#### MessagingStyle

对话通知样式.

显示任意人数之间依序发送的消息, 类似即时通讯.

```js
let getTimestamp = (/* @IIFE */ () => {
    let ts = Date.now();
    return () => ts += 1e3;
})();
let getPerson = function (name) {
    return new androidx.core.app.Person.Builder().setName(name).build();
};
let person = {
    maxwell: getPerson('Maxwell Adam'),
    john: getPerson('John Smith'),
    willilam: getPerson('William Wallace'),
};

let notificationId = 16;
let builder = notice.getBuilder();
let messagingStyle = new NotificationCompat.MessagingStyle('some_people')
    .setConversationTitle('活动安排')
    .addMessage('周五上午集合吗?', getTimestamp(), person.maxwell)
    .addMessage('应该是周六', getTimestamp(), person.john)
    .addMessage('我查一下备忘录', getTimestamp(), person.john);

notice(builder.setStyle(messagingStyle), { notificationId });

void /* argsList */ [
    [ '没错, 是周六上午', getTimestamp(), person.willilam ],
    [ '好的多谢, 后天见', getTimestamp(), person.maxwell ],
    [ '不客气', getTimestamp(), person.willilam ],
    [ '后天见', getTimestamp(), person.willilam ],
    [ 'OK', getTimestamp(), person.john ],
    [ '别忘了带上单反', getTimestamp(), person.john ],
    [ '没问题', getTimestamp(), person.willilam ],
].forEach((args) => {
    sleep(2e3, '±500');
    messagingStyle.addMessage.apply(messagingStyle, args);
    builder
        .setStyle(messagingStyle)
        .setSilent(true);
    notice(builder, { notificationId });
});
```

> 参阅: [Android Docs](https://developer.android.com/reference/androidx/core/app/NotificationCompat.MessagingStyle)

#### BigPictureStyle

大尺寸图片通知样式.

```js
const FileProvider = androidx.core.content.FileProvider;
const AppFileProvider = org.autojs.autojs.external.fileprovider.AppFileProvider;
const MimeTypesUtils = org.autojs.autojs.util.MimeTypesUtils;

let notificationId = 17;
let builder = notice.getBuilder();
let imagePath = files.path('./test.png');
let albumArtImg = images.read(imagePath).oneShot();

let bigPictureStyle = new NotificationCompat.BigPictureStyle()
    .bigPicture(albumArtImg.bitmap)
    .setBigContentTitle('Title')
    .setSummaryText('This is a big picture for test')
    .showBigPictureWhenCollapsed(true);

let pendingIntent = (/* @IIFE */ () => {
    let fileUri = FileProvider.getUriForFile(context, AppFileProvider.AUTHORITY, new File(imagePath));

    let mimeType = MimeTypesUtils.fromFileOr(imagePath, "*/*");

    let intent = new Intent(Intent.ACTION_VIEW)
        .setDataAndType(fileUri, mimeType)
        .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        .addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION);

    return PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_IMMUTABLE);
})();

builder
    .setContentText('A big picture')
    .setStyle(bigPictureStyle)
    .setContentIntent(pendingIntent)
    .setAutoCancel(true);

notice(builder, { notificationId });

albumArtImg.shoot();
```

> 参阅: [Android Docs](https://developer.android.com/reference/androidx/core/app/NotificationCompat.BigPictureStyle)

#### InboxStyle

收件箱通知样式.

按行显示通知内容, 支持使用 `addMessage` 添加新的消息条目, 每个通知最多容纳 5-7 个 (取决于操作系统及屏幕分辨率), 超过此容量的条目将不会被显示.

```js
let notificationId = 20;
let style = new NotificationCompat.InboxStyle()
    .addLine('消息片段 A')
    .addLine('消息片段 B')
    .addLine('消息片段 C');
let builder = notice.getBuilder()
    .setContentTitle('新消息')
    .setContentText('新的收件箱消息')
    .setStyle(style
        .setBigContentTitle('收件箱消息')
        .setSummaryText('消息数量 3'));
notice(builder, { notificationId });

sleep(2e3);

style.addLine('消息片段 D').setSummaryText('消息数量 4');
notice(builder.setSilent(true), { notificationId });

sleep(2e3);

style.addLine('消息片段 E').setSummaryText('消息数量 5');
notice(builder.setSilent(true), { notificationId });

sleep(2e3);

style.addLine('消息片段 F')
    .addLine('消息片段 G')
    .addLine('消息片段 H')
    .setSummaryText('消息数量 5+');
notice(builder.setSilent(true), { notificationId });
```

> 参阅: [Android Docs](https://developer.android.com/reference/androidx/core/app/NotificationCompat.InboxStyle)

## [m] setTimeoutAfter

### setTimeoutAfter(duration)

- **duration** { [number](dataTypes#number) } - 超时时间 (毫秒)
- <ins>**returns**</ins> { [NoticeBuilder](noticeBuilderType) }

指定通知自动消除的超时时间 (毫秒).

```js
notice(notice.getBuilder()
    .setContentTitle('通知测试')
    .setContentText('通知于 3 秒后自动消除')
    .setTimeoutAfter(3e3));
```

## [m] setUsesChronometer

### setUsesChronometer(b)

- **b** { [boolean](dataTypes#boolean) } - 是否使用通知计时秒表
- <ins>**returns**</ins> { [NoticeBuilder](noticeBuilderType) }

设置是否使用通知计时秒表.

参数 `b` 设为 `true` 时, 通知时间区域将显示为自动刷新的计时秒表, 每秒钟自动刷新时间.

计时秒表通常用于表明通知的持续显示时间, 可应用于通话计时等场景:

```js
notice(notice.getBuilder()
    .setContentTitle('通知测试')
    .setContentText('通知计时测试')
    .setUsesChronometer(true));
```

> 注:  
> chronometer [krəˈnɒmɪtə(r)]  
> _n._ 精密记时表; 高度精确的钟表.

## [m] setChronometerCountDown

### setChronometerCountDown(countDown)

- **countDown** { [boolean](dataTypes#boolean) }
- <ins>**returns**</ins> { [NoticeBuilder](noticeBuilderType) }

设置通知计时区域的时间为倒计时而非正计时.

`setChronometerCountDown` 仅在 [setUsesChronometer](#m-setuseschronometer) 设置为 `true` 时才有效.

```js
/* 在通知的计时区域显示 10 秒钟倒计时. */
notice(notice.getBuilder()
    .setUsesChronometer(true)
    .setChronometerCountDown(true)
    .setShowWhen(true)
    .setWhen(Date.now() + 10e3)
);
```

> 注:  
> chronometer [krəˈnɒmɪtə(r)]  
> _n._ 精密记时表; 高度精确的钟表.

## [m] setWhen

### setWhen(when)

- **when** { [number](dataTypes#number) } - 时间戳 (毫秒)
- <ins>**returns**</ins> { [NoticeBuilder](noticeBuilderType) }

添加一个通知时间戳 (毫秒), 用以表示通知发生 (或即将发生) 的具体时间.

使用 `setWhen` 时, 需要设置 [setShowWhen](#m-setshowwhen) 为 `true`, 否则将无法显示时间消息. 

```js
notice(notice.getBuilder()
    .setContentTitle('通知测试')
    .setContentText('通知时间测试 (过去 5 分钟)')
    .setWhen(Date.now() - 5 * 60e3)
    .setShowWhen(true));
    
notice(notice.getBuilder()
    .setContentTitle('通知测试')
    .setContentText('通知时间测试 (未来 2 分钟)')
    .setWhen(Date.now() + 128e3)
    .setShowWhen(true));
```

## [m] setShowWhen

### setShowWhen(show)

- **show** { [boolean](dataTypes#boolean) } - 是否显示时间戳信息
- <ins>**returns**</ins> { [NoticeBuilder](noticeBuilderType) }

设置通知消息是否显示使用 [setWhen](#m-setwhen) 设置的时间戳信息.

当 `setShowWhen` 设置为 `false` 时, [setWhen](#m-setwhen) 设置的时间戳信息将不再显示在通知消息中.