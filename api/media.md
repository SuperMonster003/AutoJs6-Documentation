# 多媒体 (Media)

---

`media` 提供音频文件播放和媒体库扫描能力. 音频由脚本运行时持有的 Android `MediaPlayer` 播放, 脚本运行时回收时会断开媒体扫描连接并释放播放器.

播放在后台进行. 如果主脚本没有其他未完成任务, 需要使用定时器, 事件循环或其他方式让脚本保持运行.

```js
media.playMusic('/sdcard/Music/example.mp3');
sleep(media.getMusicDuration());
```

<p style="font: bold 1em sans-serif; color: #FF7043">media</p>

## [m] scanFile

### scanFile(path)

- **path** { [string](dataTypes#string) } - 媒体文件路径
- <ins>**returns**</ins> { [void](dataTypes#void) }

请求 Android 媒体扫描器扫描文件. MIME 类型根据文件名推断, 无法识别时使用通配类型.

文件新增或发生变化时, 扫描可使相册或媒体库更新对应记录. 文件已经删除时, 扫描可使媒体库移除旧记录.

```js
requestScreenCapture(false);

let image = captureScreen();
let path = '/sdcard/Pictures/AutoJs6/screenshot.png';
image.saveTo(path);
media.scanFile(path);
```

## [m] playMusic

### playMusic(path)

**`Overload 1/3`**

- **path** { [string](dataTypes#string) } - 音频文件路径
- <ins>**returns**</ins> { [void](dataTypes#void) }

以音量 `1` 播放一次音频文件.

### playMusic(path, volume)

**`Overload 2/3`**

- **path** { [string](dataTypes#string) } - 音频文件路径
- **volume** { [number](dataTypes#number) } - 左右声道音量
- <ins>**returns**</ins> { [void](dataTypes#void) }

以指定音量播放一次音频文件. Android `MediaPlayer` 的常规音量范围为 `0..1`.

### playMusic(path, volume, looping)

**`Overload 3/3`**

- **path** { [string](dataTypes#string) } - 音频文件路径
- **volume** { [number](dataTypes#number) } - 左右声道音量
- **looping** { [boolean](dataTypes#boolean) } - 是否循环播放
- <ins>**returns**</ins> { [void](dataTypes#void) }

停止并重置此前创建的播放器, 同步准备指定文件后开始播放. 路径不存在, 文件无法读取或音频格式不受支持时抛出异常.

```js
media.playMusic('/sdcard/Music/example.mp3', 0.8, true);

setTimeout(() => {
    media.stopMusic();
}, media.getMusicDuration() * 3);
```

使用系统应用打开媒体文件可改用 [app.viewFile](app#viewfile).

## [m] musicSeekTo

### musicSeekTo(msec)

- **msec** { [number](dataTypes#number) } - 目标播放位置, 单位为 ms
- <ins>**returns**</ins> { [void](dataTypes#void) }

调整当前播放器的播放位置. 播放器尚未创建时不执行操作.

```js
media.playMusic('/sdcard/Music/example.mp3');
media.musicSeekTo(30e3);
```

## [m] pauseMusic

### pauseMusic()

- <ins>**returns**</ins> { [void](dataTypes#void) }

暂停当前播放器. 播放器尚未创建时不执行操作.

## [m] resumeMusic

### resumeMusic()

- <ins>**returns**</ins> { [void](dataTypes#void) }

启动或继续当前播放器. 播放器尚未创建时不执行操作. 播放器处于不允许启动的状态时, Android `MediaPlayer` 会抛出状态异常.

## [m] stopMusic

### stopMusic()

- <ins>**returns**</ins> { [void](dataTypes#void) }

停止当前播放器. 播放器尚未创建时不执行操作. 停止后如需再次播放, 调用 [media.playMusic](#m-playmusic) 重新设置数据源.

## [m] isMusicPlaying

### isMusicPlaying()

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否正在播放

播放器尚未创建时返回 `false`.

## [m] getMusicDuration

### getMusicDuration()

- <ins>**returns**</ins> { [number](dataTypes#number) } - 音频时长, 单位为 ms

播放器尚未创建时返回 `0`.

## [m] getMusicCurrentPosition

### getMusicCurrentPosition()

- <ins>**returns**</ins> { [number](dataTypes#number) } - 当前播放位置, 单位为 ms

播放器尚未创建时返回 `-1`.
