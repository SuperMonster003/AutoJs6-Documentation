# 多媒体 (Media)

---

`media` 提供音频文件播放和媒体库扫描能力. 从 6.8.0 起, 本地音频文件由应用的 Media3 音乐前台服务播放. 脚本运行时回收时会断开媒体扫描连接, 并释放自己仍持有的音乐播放.

播放是异步的. 如果主脚本没有其他未完成任务, 需要使用定时器, 事件循环或其他方式让脚本保持运行. 脚本保持运行不代表应用具备系统允许的后台音频条件.

```js
media.playMusic('/sdcard/Music/example.mp3');
sleep(media.getMusicDuration());
```

同一应用同时保留一个脚本音乐播放器. 后一个有效的 `playMusic` 请求接管播放; 原脚本不再持有播放器, 其暂停, 恢复, 定位, 停止和退出清理不会影响新脚本. 接管包括同一脚本再次调用 `playMusic`. 宿主与每个独立打包应用分别管理自己的播放器.

播放器通过媒体用途的音频焦点参与系统管理, 响应耳机断开事件, 并提供系统媒体通知的播放, 暂停和定位控制. 脚本结束后不能从系统媒体控制重新启动已经结束的脚本. TTS 和独立媒体插件不由此音乐服务承载; Node 桥的 `media` 当前只提供音量控制.

<p style="font: bold 1em sans-serif; color: #FF7043">media</p>

## Android 17 后台音频

Android 17 对播放, 音频焦点和音量调节增加了运行条件. 应用需要可见 Activity 或非 `shortService` 类型的前台服务; 应用的 `targetSdk` 达到 37 时, 后台前台服务还需要系统授予的 while-in-use 能力. 服务存活或显示通知不代表该能力已具备. 条件不满足时, 系统可能静默阻止播放或音量修改. 参阅 [Android 后台音频限制](https://developer.android.com/about/versions/17/changes/bg-audio).

需要后台音乐播放时, 先打开 AutoJs6 或打包应用, 在界面可见时由脚本工作线程调用 `media.playMusic`. 该方法自动连接专用音乐前台服务, 在请求焦点前启动前台通知. 无需为了这个方法额外开启通用 "前台服务" 开关. 如果 Android 拒绝启动或首次焦点请求失败, 本次播放会清理资源并抛出异常; 回到可见界面后重新调用. 系统后来收回焦点时可能暂停播放, 返回可见界面后可尝试 `resumeMusic` 或重新播放.

定时任务或开机触发不保证能够无人值守播放. 专用媒体服务仍受 Android 的前台服务启动限制和音频资格规则约束, 不会把普通音乐改为闹钟用途来规避限制. 播放状态和进度只能表示播放器状态, 不能证明设备实际输出了声音. 外部媒体插件在独立进程中播放时, 还需要满足该插件自身的运行条件.

其他音频路径仍可参考应用设置中通用 "前台服务" 的可见界面重启指引. TTS 的实际输出由系统语音引擎负责, 文件合成不要求音乐服务运行.

打包项目需要保留 `android.permission.FOREGROUND_SERVICE` 与 `android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK`. 新项目的默认权限包含两者. 已有项目如果指定了自己的权限列表, 请在打包权限配置中加入媒体播放前台服务权限后重新构建. 此权限不是运行时弹窗授权.

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

以指定音量播放一次音频文件. `volume` 必须是 `0..1` 范围内的有限数值, `0` 表示此播放器静音, 不修改系统媒体音量.

### playMusic(path, volume, looping)

**`Overload 3/3`**

- **path** { [string](dataTypes#string) } - 音频文件路径
- **volume** { [number](dataTypes#number) } - 左右声道音量
- **looping** { [boolean](dataTypes#boolean) } - 是否循环播放
- <ins>**returns**</ins> { [void](dataTypes#void) }

从脚本工作线程同步等待服务连接和音频准备, 开始播放后返回. 准备等待上限为 30 秒; 线程被中断, 超时或脚本结束后, 尚未完成的请求会取消, 不会在稍后连接成功时继续播放. 路径不存在, 文件无法读取, 音频格式不受支持或前台播放启动失败时抛出异常. 无法读取的路径和无效音量不会接管另一脚本正在播放的音乐.

UI 线程不能同步等待服务. UI 事件回调中请使用工作线程:

```js
threads.start(() => {
    media.playMusic('/sdcard/Music/example.mp3');
    sleep(media.getMusicDuration());
});
```

后台工作线程并不等同于应用处于后台; 播放开始时仍应让应用界面可见.

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

继续当前脚本仍持有的播放器, 自然播放结束后从头重播. 恢复时再次尝试启动音乐前台服务, 因此仍需满足系统运行条件. 尚未创建, 已停止或已由其他脚本接管时不执行操作.

## [m] stopMusic

### stopMusic()

- <ins>**returns**</ins> { [void](dataTypes#void) }

停止当前播放器. 播放器尚未创建时不执行操作. 停止后如需再次播放, 调用 [media.playMusic](#m-playmusic) 重新设置数据源.

## [m] isMusicPlaying

### isMusicPlaying()

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否正在播放

播放器尚未创建时返回 `false`. 返回 `true` 表示 Media3 报告正在播放, 不保证音频未被系统抑制; 参阅 [Android 17 后台音频](#android-17-后台音频).

## [m] getMusicDuration

### getMusicDuration()

- <ins>**returns**</ins> { [number](dataTypes#number) } - 音频时长, 单位为 ms

播放器尚未创建, 已停止或已由其他脚本接管时返回 `0`. 音频时长未知时也返回 `0`.

## [m] getMusicCurrentPosition

### getMusicCurrentPosition()

- <ins>**returns**</ins> { [number](dataTypes#number) } - 当前播放位置, 单位为 ms

播放器尚未创建, 已停止或已由其他脚本接管时返回 `-1`.
