# 文本转语音 (TTS)

tts 模块用于通过 Android 文本转语音引擎播放文本, 插入静音, 合成音频文件, 查询引擎和语音, 以及监听单次任务的执行事件.

`tts` 与 `$tts` 指向同一个可调用模块对象.

tts 服务属于当前脚本运行时. 脚本退出时, 未完成的请求会停止, 相关引擎资源会释放.

Android 17 的 [后台音频限制](media#android-17-后台音频) 需要结合实际 TTS 引擎判断. 此模块通过 Android `TextToSpeech` 委托所选引擎合成和播放, 实际音频可能来自引擎进程; 宿主前台服务状态不能单独代表引擎的播放资格. 播放无声时, 检查引擎, 语音数据与系统音量, 并从可见应用界面重试. 合成成功或任务完成事件不等于设备实际发声. `synthesizeToFile` 只合成文件, 不以宿主能否后台播放作为执行条件.

---

<p style="font: bold 2em sans-serif; color: #FF7043">tts</p>

---

## [@] tts

### tts(text, options?)

**`6.8.0`** **`Async`** **`Overload [1-2]/2`**

- **text** { [string](dataTypes#string) } - 待朗读文本
- **[ options = `{}` ]** { [TtsOptions](#ttsoptions) } - 朗读选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [TtsResult](#ttsresult)

朗读文本.

此调用与 [tts.speak(text, options?)](#m-speak) 等价.

```js
tts('Hello from AutoJs6').then((result) => {
    console.log(result.status);
});
```

## [p] maxInputLength

**`6.8.0`**

- { [number](dataTypes#number) }

初始值为 `3999`, 表示单次 Android 文本转语音请求的安全文本长度上限, 单位为 UTF-16 code unit.

[speak](#m-speak) 默认会将更长文本拆分为多个请求, 因此此值不是朗读方法允许的总文本长度上限.

## [p] maxSynthesisFileSize

**`6.8.0`**

- { [number](dataTypes#number) }

初始值为 `536870912`, 表示文件合成结果的最大字节数, 即 `512 MiB`.

## [p] QUEUE_FLUSH

**`6.8.0`**

- { [string](dataTypes#string) }

初始值为 `'flush'`, 表示替换当前队列的队列模式.

## [p] QUEUE_ADD

**`6.8.0`**

- { [string](dataTypes#string) }

初始值为 `'add'`, 表示追加到当前队列的队列模式.

## [m] speak

### speak(text, options?)

**`6.8.0`** **`Async`** **`Overload [1-2]/2`**

- **text** { [string](dataTypes#string) } - 待朗读文本
- **[ options = `{}` ]** { [TtsOptions](#ttsoptions) } - 朗读选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [TtsResult](#ttsresult)

将文本加入文本转语音服务.

默认队列模式为 `flush`, 会替换等待中的任务. 文本默认按最多 `3999` 个 UTF-16 code unit 自动拆分.

输入文本不能为空白, 总长度不能超过 `1000000` 个 UTF-16 code unit.

## [m] enqueue

### enqueue(text, options?)

**`6.8.0`** **`Async`** **`Overload [1-2]/2`**

- **text** { [string](dataTypes#string) } - 待朗读文本
- **[ options = `{}` ]** { [TtsOptions](#ttsoptions) } - 朗读选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [TtsResult](#ttsresult)

将文本追加到文本转语音队列.

此方法强制使用 `add` 队列模式, `options.queue` 不会覆盖该模式.

## [m] utterance

### utterance(text, options?)

**`6.8.0`** **`Async`** **`Overload [1-2]/2`**

- **text** { [string](dataTypes#string) } - 待朗读文本
- **[ options = `{}` ]** { [TtsOptions](#ttsoptions) } - 朗读选项
- <ins>**returns**</ins> { [TtsUtterance](#ttsutterance) } - 可监听的朗读任务

创建可监听事件和主动停止的朗读任务.

`utterance` 也可写作 `speakTask`.

任务的 `result` 属性是与 [speak](#m-speak) 返回值等价的 Promise.

```js
let task = tts.utterance('This task can be observed');

task
    .on('start', (info) => {
        console.log(info.id);
    })
    .on('done', (result) => {
        console.log(result.duration);
    });
```

## [m] enqueueUtterance

### enqueueUtterance(text, options?)

**`6.8.0`** **`Async`** **`Overload [1-2]/2`**

- **text** { [string](dataTypes#string) } - 待朗读文本
- **[ options = `{}` ]** { [TtsOptions](#ttsoptions) } - 朗读选项
- <ins>**returns**</ins> { [TtsUtterance](#ttsutterance) } - 可监听的朗读任务

创建可监听的朗读任务, 并强制追加到当前队列.

`enqueueUtterance` 也可写作 `enqueueTask`.

## [m] synthesize

### synthesize(text, path, options?)

**`6.8.0`** **`Async`** **`Overload [1-2]/2`**

- **text** { [string](dataTypes#string) } - 待合成文本
- **path** { [string](dataTypes#string) } - 输出文件路径
- **[ options = `{}` ]** { [TtsFileOptions](#ttsfileoptions) } - 合成选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [TtsResult](#ttsresult)

将文本合成为音频文件.

`synthesize` 也可写作 `synthesizeToFile`.

文件合成只执行一次平台请求, 文本长度不能超过 `3999` 个 UTF-16 code unit. `autoSplit` 不会拆分文件输出.

默认先写入临时文件, 成功后再原子替换目标文件. `overwrite` 为 `false` 时要求严格的原子不替换发布, 某些共享存储文件系统不支持该操作并会使 Promise 拒绝.

```js
tts.synthesize('Saved speech', './speech.wav').then((result) => {
    console.log(result.path);
});
```

## [m] synthesis

### synthesis(text, path, options?)

**`6.8.0`** **`Async`** **`Overload [1-2]/2`**

- **text** { [string](dataTypes#string) } - 待合成文本
- **path** { [string](dataTypes#string) } - 输出文件路径
- **[ options = `{}` ]** { [TtsFileOptions](#ttsfileoptions) } - 合成选项
- <ins>**returns**</ins> { [TtsUtterance](#ttsutterance) } - 可监听的文件合成任务

创建可监听事件和主动停止的文件合成任务.

`synthesis` 也可写作 `synthesizeTask` 或 `synthesisTask`.

## [m] silence

### silence(duration, options?)

**`6.8.0`** **`Async`** **`Overload [1-2]/2`**

- **duration** { [number](dataTypes#number) } - 静音时长, 单位为毫秒
- **[ options = `{}` ]** { [TtsOptions](#ttsoptions) } - 队列和引擎选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [TtsResult](#ttsresult)

将静音任务加入文本转语音队列.

`duration` 必须是 `0..86400000` 范围内的整数.

## [m] silenceTask

### silenceTask(duration, options?)

**`6.8.0`** **`Async`** **`Overload [1-2]/2`**

- **duration** { [number](dataTypes#number) } - 静音时长, 单位为毫秒
- **[ options = `{}` ]** { [TtsOptions](#ttsoptions) } - 队列和引擎选项
- <ins>**returns**</ins> { [TtsUtterance](#ttsutterance) } - 可监听的静音任务

创建可监听事件和主动停止的静音任务.

## [m] ready

### ready(engineOrOptions?)

**`6.8.0`** **`Async`** **`Overload [1-2]/2`**

- **[ engineOrOptions ]** { [string](dataTypes#string) | [TtsEngineQueryOptions](#ttsenginequeryoptions) | [null](dataTypes#null) } - 引擎名称或查询选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [TtsReadyInfo](#ttsreadyinfo)

初始化或取得指定文本转语音引擎, 并返回其就绪信息.

省略参数时使用 [defaults](#m-defaults) 中的引擎.<br>
传入 `null` 时使用系统默认引擎.

## [m] engines

### engines(engineOrOptions?)

**`6.8.0`** **`Async`** **`Overload [1-2]/2`**

- **[ engineOrOptions ]** { [string](dataTypes#string) | [TtsEngineQueryOptions](#ttsenginequeryoptions) | [null](dataTypes#null) } - 请求使用的引擎名称或查询选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [TtsEngineInfo](#ttsengineinfo) 数组

返回系统可用文本转语音引擎.

## [m] voices

### voices(filter?)

**`6.8.0`** **`Async`** **`Overload [1-2]/2`**

- **[ filter = `{}` ]** { [string](dataTypes#string) | [TtsVoiceFilter](#ttsvoicefilter) | [null](dataTypes#null) } - 引擎名称或语音过滤条件
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [TtsVoiceInfo](#ttsvoiceinfo) 数组

返回指定引擎的语音列表.

字符串参数视为引擎名称.<br>
对象参数可按引擎, 区域, 离线能力和安装状态过滤.

## [m] languages

### languages(engineOrOptions?)

**`6.8.0`** **`Async`** **`Overload [1-2]/2`**

- **[ engineOrOptions ]** { [string](dataTypes#string) | [TtsEngineQueryOptions](#ttsenginequeryoptions) | [null](dataTypes#null) } - 引擎名称或查询选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [string](dataTypes#string) 数组

返回指定引擎报告的 IETF 语言标签.

## [m] isLanguageAvailable

### isLanguageAvailable(locale, engineOrOptions?)

**`6.8.0`** **`Async`** **`Overload [1-2]/2`**

- **locale** { [string](dataTypes#string) } - IETF 语言标签
- **[ engineOrOptions ]** { [string](dataTypes#string) | [TtsEngineQueryOptions](#ttsenginequeryoptions) | [null](dataTypes#null) } - 引擎名称或查询选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [boolean](dataTypes#boolean) 类型的可用状态

检查指定引擎是否支持语言.

区域标签中的 `_` 会转换为 `-`.

## [m] languageAvailability

### languageAvailability(locale, engineOrOptions?)

**`6.8.0`** **`Async`** **`Overload [1-2]/2`**

- **locale** { [string](dataTypes#string) } - IETF 语言标签
- **[ engineOrOptions ]** { [string](dataTypes#string) | [TtsEngineQueryOptions](#ttsenginequeryoptions) | [null](dataTypes#null) } - 引擎名称或查询选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [TtsLanguageAvailability](#ttslanguageavailability)

返回指定引擎对语言的详细支持状态.

## [m] stop

### stop()

**`6.8.0`**

- <ins>**returns**</ins> { [number](dataTypes#number) } - 接受停止请求时尚未结束的任务数

请求停止当前运行时的全部文本转语音任务.

`stop` 也可写作 `stopAll`.

停止命令会异步交给文本转语音调度线程. 返回值是调用时的任务数量.

## [m] reset

### reset()

**`6.8.0`**

- <ins>**returns**</ins> { [number](dataTypes#number) } - 接受重置请求时尚未结束的任务数

恢复初始默认选项, 停止全部任务, 并关闭当前引擎实例.

控制命令异步执行. 返回值是调用时的任务数量.

## [m] isSpeaking

### isSpeaking()

**`6.8.0`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 当前是否正在朗读文本

仅当当前活动任务是已开始的朗读任务时返回 `true`.

静音和文件合成任务不会使此方法返回 `true`.

## [m] isBusy

### isBusy()

**`6.8.0`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 当前是否存在活动任务

活动任务可以是朗读, 静音或文件合成.

## [m] status

### status()

**`6.8.0`**

- <ins>**returns**</ins> { [TtsStatus](#ttsstatus) } - 当前服务状态快照

返回同步状态快照.

## [m] defaults

### defaults()

**`6.8.0`**

- <ins>**returns**</ins> { [TtsDefaults](#ttsdefaults) } - 当前默认选项

返回当前运行时的文本转语音默认选项.

`defaults` 也可写作 `config`.

## [m] configure

### configure(options)

**`6.8.0`**

- **options** { [TtsOptions](#ttsoptions) } - 待合并的默认选项
- <ins>**returns**</ins> { [TtsDefaults](#ttsdefaults) } - 合并后的默认选项

修改当前脚本运行时后续任务使用的默认选项.

未指定的属性保持原值. 文件专用选项 `overwrite` 和 `createDirectories` 不可用于此方法.

```js
let defaults = tts.configure({
    rate: 1.1,
    locale: 'en-US',
});
console.log(defaults.rate);
```

## [m] getMaxInputLength

### getMaxInputLength()

**`6.8.0`**

- <ins>**returns**</ins> { [number](dataTypes#number) } - `3999`

返回单次平台文本转语音请求的安全文本长度上限.

## [m] openSettings

### openSettings()

**`6.8.0`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否成功打开系统文本转语音设置

尝试打开 Android 文本转语音设置页面.

设备没有可处理该 Intent 的界面, 或启动失败时返回 `false`.

## [m] installData

### installData(engineOrOptions?)

**`6.8.0`** **`Overload [1-2]/2`**

- **[ engineOrOptions ]** { [string](dataTypes#string) | [TtsEngineQueryOptions](#ttsenginequeryoptions) | [null](dataTypes#null) } - 引擎名称或查询选项
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否成功打开语音数据安装界面

尝试打开指定引擎的语音数据安装界面.

设备没有可处理该 Intent 的界面, 或启动失败时返回 `false`.

## 选项

### TtsOptions

每次调用中未指定的选项继承 [defaults](#m-defaults) 的当前值. 初始默认值如下:

- **[ engine = `null` ]** { [string](dataTypes#string) | [null](dataTypes#null) } - 引擎包名, `null` 表示系统默认引擎
- **[ locale = `null` ]** { [string](dataTypes#string) | [null](dataTypes#null) } - IETF 语言标签
- **[ voice = `null` ]** { [string](dataTypes#string) | [null](dataTypes#null) } - 语音名称
- **[ rate = `1` ]** { [number](dataTypes#number) } - 语速, 范围为 `0.1..4`
- **[ pitch = `1` ]** { [number](dataTypes#number) } - 音高, 范围为 `0.1..4`
- **[ volume = `1` ]** { [number](dataTypes#number) } - 音量, 范围为 `0..1`
- **[ pan = `0` ]** { [number](dataTypes#number) } - 左右声道位置, 范围为 `-1..1`
- **[ queue = `'flush'` ]** { [string](dataTypes#string) | [number](dataTypes#number) } - 队列模式
- **[ autoSplit = `true` ]** { [boolean](dataTypes#boolean) } - 是否自动拆分长文本
- **[ offlineOnly = `false` ]** { [boolean](dataTypes#boolean) } - 是否仅选择离线语音
- **[ audioEvents = `false` ]** { [boolean](dataTypes#boolean) } - 是否接收音频数据事件
- **[ usage = `'media'` ]** { [string](dataTypes#string) } - Android 音频用途
- **[ timeout = `'auto'` ]** { [number](dataTypes#number) | `'auto'` | [null](dataTypes#null) } - 任务超时, 单位为毫秒
- **[ parameters = `{}` ]** { [Object](dataTypes#object) } - 传给文本转语音引擎的额外参数

兼容属性名称:

- `locale`: `language`, `lang`.
- `rate`: `speechRate`.
- `autoSplit`: `split`.
- `offlineOnly`: `offline`.
- `audioEvents`: `emitAudio`.
- `usage`: `audioUsage`.
- `timeout`: `timeoutMillis`, `timeoutMs`.
- `parameters`: `params`.

`locale` 和 `voice` 不能在同一组选项中同时指定为非 `null`.<br>
队列模式可使用 `flush`, `replace`, `add`, `enqueue`, `append`, `0` 或 `1`.<br>
音频用途支持 `media`, `accessibility`, `assistant`, `navigation`, `alarm`, `notification` 和 `voiceCommunication`.

`timeout` 为 `0` 时禁用任务超时.<br>
`timeout` 为 `null` 或 `auto` 时根据操作类型和文本长度自动计算.<br>
其他超时值必须是 `1000..86400000` 范围内的整数.

`parameters` 最多包含 32 项. 属性值只能是字符串, 布尔值或有限数值. `rate`, `engine`, `pitch`, `volume`, `pan` 和 `utteranceId` 等已有专用选项的名称不能重复用于 `parameters`.

未知选项会使调用抛出异常.

### TtsFileOptions

TtsFileOptions 包含全部 [TtsOptions](#ttsoptions), 并增加:

- **[ overwrite = `true` ]** { [boolean](dataTypes#boolean) } - 是否替换已存在的目标文件
- **[ createDirectories = `true` ]** { [boolean](dataTypes#boolean) } - 是否创建缺失的父目录

`mkdirs` 可作为 `createDirectories` 的别名.

### TtsEngineQueryOptions

- **[ engine ]** { [string](dataTypes#string) | [null](dataTypes#null) } - 引擎包名

### TtsVoiceFilter

- **[ engine ]** { [string](dataTypes#string) | [null](dataTypes#null) } - 引擎包名
- **[ locale ]** { [string](dataTypes#string) | [null](dataTypes#null) } - IETF 语言标签
- **[ offlineOnly = `false` ]** { [boolean](dataTypes#boolean) } - 是否仅返回离线语音
- **[ installedOnly = `false` ]** { [boolean](dataTypes#boolean) } - 是否仅返回已安装语音

兼容属性名称:

- `locale`: `language`, `lang`.
- `offlineOnly`: `offline`.
- `installedOnly`: `installed`.

## 返回对象

### TtsResult

- **id** { [string](dataTypes#string) } - 任务 ID
- **operation** { `'speech'` | `'silence'` | `'file'` } - 操作类型
- **status** { `'done'` } - 完成状态
- **engine** { [string](dataTypes#string) | [null](dataTypes#null) } - 实际使用的引擎包名
- **requestedEngine** { [string](dataTypes#string) | [null](dataTypes#null) } - 请求使用的引擎包名
- **voice** { [string](dataTypes#string) | [null](dataTypes#null) } - 实际使用的语音名称
- **locale** { [string](dataTypes#string) | [null](dataTypes#null) } - 实际使用的语言标签
- **usage** { [string](dataTypes#string) | [null](dataTypes#null) } - 实际音频用途
- **chunks** { [number](dataTypes#number) } - 平台请求块数量
- **characters** { [number](dataTypes#number) } - 输入文本长度
- **duration** { [number](dataTypes#number) } - 从开始到完成的时长, 单位为毫秒
- **path** { [string](dataTypes#string) | [null](dataTypes#null) } - 文件合成目标路径

### TtsReadyInfo

- **state** { `'ready'` } - 就绪状态
- **engine** { [string](dataTypes#string) } - 实际引擎包名
- **requestedEngine** { [string](dataTypes#string) | [null](dataTypes#null) } - 请求使用的引擎包名
- **defaultEngine** { [string](dataTypes#string) | [null](dataTypes#null) } - 系统默认引擎包名
- **voice** { [TtsVoiceInfo](#ttsvoiceinfo) | [null](dataTypes#null) } - 最近选择的语音
- **locale** { [string](dataTypes#string) | [null](dataTypes#null) } - 最近选择的语言标签

### TtsEngineInfo

- **name** { [string](dataTypes#string) } - 引擎包名
- **label** { [string](dataTypes#string) } - 引擎显示名称
- **default** { [boolean](dataTypes#boolean) } - 是否为系统默认引擎
- **requested** { [boolean](dataTypes#boolean) } - 是否为本次请求指定的引擎

### TtsVoiceInfo

- **name** { [string](dataTypes#string) } - 语音名称
- **locale** { [string](dataTypes#string) } - IETF 语言标签
- **quality** { [number](dataTypes#number) } - Android 语音质量值
- **latency** { [number](dataTypes#number) } - Android 语音延迟值
- **networkRequired** { [boolean](dataTypes#boolean) } - 是否需要网络
- **offline** { [boolean](dataTypes#boolean) } - 是否可离线使用
- **notInstalled** { [boolean](dataTypes#boolean) } - 语音数据是否未安装
- **features** { [string](dataTypes#string)[[]](dataTypes#array) } - 引擎报告的语音特性

### TtsLanguageAvailability

- **locale** { [string](dataTypes#string) } - 规范化后的 IETF 语言标签
- **available** { [boolean](dataTypes#boolean) } - 是否可用
- **support** { `'language'` | `'language_and_country'` | `'language_country_and_variant'` | `'missing_data'` | `'not_supported'` | `'unknown'` } - 支持级别
- **statusCode** { [number](dataTypes#number) } - Android 文本转语音状态码

### TtsStatus

- **state** { `'idle'` | `'initializing'` | `'working'` | `'ready'` | `'failed'` | `'closed'` } - 服务状态
- **engine** { [string](dataTypes#string) | [null](dataTypes#null) } - 最近实际使用的引擎
- **requestedEngine** { [string](dataTypes#string) | [null](dataTypes#null) } - 当前请求的引擎
- **activeId** { [string](dataTypes#string) | [null](dataTypes#null) } - 活动任务 ID
- **operation** { `'speech'` | `'silence'` | `'file'` | [null](dataTypes#null) } - 活动操作类型
- **queued** { [number](dataTypes#number) } - 等待任务数量
- **isSpeaking** { [boolean](dataTypes#boolean) } - 是否正在朗读
- **isBusy** { [boolean](dataTypes#boolean) } - 是否存在活动任务

### TtsDefaults

- **engine** { [string](dataTypes#string) | [null](dataTypes#null) } - 默认引擎包名
- **locale** { [string](dataTypes#string) | [null](dataTypes#null) } - 默认语言标签
- **voice** { [string](dataTypes#string) | [null](dataTypes#null) } - 默认语音名称
- **rate** { [number](dataTypes#number) } - 默认语速
- **pitch** { [number](dataTypes#number) } - 默认音高
- **volume** { [number](dataTypes#number) } - 默认音量
- **pan** { [number](dataTypes#number) } - 默认声道位置
- **queue** { `'flush'` | `'add'` } - 默认队列模式
- **autoSplit** { [boolean](dataTypes#boolean) } - 是否自动拆分文本
- **offlineOnly** { [boolean](dataTypes#boolean) } - 是否仅使用离线语音
- **audioEvents** { [boolean](dataTypes#boolean) } - 是否接收音频事件
- **usage** { [string](dataTypes#string) } - 默认音频用途
- **timeout** { [number](dataTypes#number) | `'auto'` } - 默认超时
- **parameters** { [Object](dataTypes#object) } - 默认引擎参数

## TtsUtterance

- <ins>**extends**</ins> { [EventEmitter](eventEmitterType) }

TtsUtterance 表示一个可监听和停止的文本转语音任务. 它不能由脚本直接构造.

它继承 [EventEmitter](eventEmitterType) 的 `addListener`, `eventNames`, `listenerCount`, `listeners`, `prependListener`, `prependOnceListener`, `removeAllListeners`, `removeListener` 和 `setMaxListeners` 等方法.

### [p#] TtsUtterance#id

**`6.8.0`** **`READONLY`**

- { [string](dataTypes#string) }

任务 ID.

### [p#] TtsUtterance#operation

**`6.8.0`** **`READONLY`**

- { `'speech'` | `'silence'` | `'file'` }

任务操作类型.

### [p#] TtsUtterance#text

**`6.8.0`** **`READONLY`**

- { [string](dataTypes#string) | [null](dataTypes#null) }

任务输入文本. 静音任务为 `null`.

### [p#] TtsUtterance#result

**`6.8.0`** **`READONLY`**

- { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) }

任务结果 Promise, 兑现值为 [TtsResult](#ttsresult).

### [p#] TtsUtterance#state

**`6.8.0`** **`READONLY`**

- { `'created'` | `'queued'` | `'running'` | `'done'` | `'stopped'` | `'error'` | `'cancelled'` }

任务当前状态.

### [p#] TtsUtterance#isDone

**`6.8.0`** **`READONLY`**

- { [boolean](dataTypes#boolean) }

任务是否已经进入终止状态.

### [m#] TtsUtterance#on(eventName, listener)

**`6.8.0`**

- **eventName** { [string](dataTypes#string) } - 事件名称
- **listener** { [Function](dataTypes#function) } - 事件监听器
- <ins>**returns**</ins> { [TtsUtterance](#ttsutterance) } - 当前任务

注册持续事件监听器.

### [m#] TtsUtterance#once(eventName, listener)

**`6.8.0`**

- **eventName** { [string](dataTypes#string) } - 事件名称
- **listener** { [Function](dataTypes#function) } - 单次事件监听器
- <ins>**returns**</ins> { [TtsUtterance](#ttsutterance) } - 当前任务

注册仅执行一次的事件监听器.

### [m#] TtsUtterance#stop()

**`6.8.0`**

- <ins>**returns**</ins> { [TtsUtterance](#ttsutterance) } - 当前任务

请求停止此任务.

已结束或已经请求停止时不重复提交停止命令.

### [m#] TtsUtterance#cancel()

**`6.8.0`**

- <ins>**returns**</ins> { [TtsUtterance](#ttsutterance) } - 当前任务

`TtsUtterance#stop()` 的别名.

## TtsUtterance 事件

| 事件 | 监听器参数 | 说明 |
| --- | --- | --- |
| `queued` | `info` { [TtsQueuedEvent](#ttsqueuedevent) } | 任务已进入服务 |
| `start` | `info` { [TtsStartEvent](#ttsstartevent) } | 任务开始执行 |
| `chunk` | `info` { [TtsChunkEvent](#ttschunkevent) } | 开始朗读一个文本块 |
| `range` | `info` { [TtsRangeEvent](#ttsrangeevent) } | 引擎报告当前文本范围 |
| `synthesis` | `info` { [TtsSynthesisEvent](#ttssynthesisevent) } | 引擎报告音频格式 |
| `audio` | `info` { [TtsAudioEvent](#ttsaudioevent) } | 引擎提供音频数据 |
| `done` | `result` { [TtsResult](#ttsresult) } | 任务正常完成 |
| `stop` | `info` { [TtsStopEvent](#ttsstopevent) } | 任务停止 |
| `error` | `error` { [TtsError](#ttserror) } | 任务失败 |
| `cancelled` | `info` { [TtsStopEvent](#ttsstopevent) } | 任务被取消 |

调用任务的 `stop` 或 `cancel` 后, 会依次触发 `stop` 和 `cancelled`.<br>
由队列替换导致的平台停止会触发 `stop`, 但不会触发 `cancelled`.

只有 `audioEvents` 为 `true` 时才接收 `audio` 事件.

### TtsQueuedEvent

- **id** { [string](dataTypes#string) } - 任务 ID
- **operation** { `'speech'` | `'silence'` | `'file'` } - 操作类型
- **queue** { `'flush'` | `'add'` } - 队列模式
- **chunks** { [number](dataTypes#number) } - 请求块数量

### TtsStartEvent

- **id** { [string](dataTypes#string) } - 任务 ID
- **operation** { `'speech'` | `'silence'` | `'file'` } - 操作类型
- **voice** { [string](dataTypes#string) | [null](dataTypes#null) } - 语音名称
- **locale** { [string](dataTypes#string) | [null](dataTypes#null) } - 语言标签
- **chunks** { [number](dataTypes#number) } - 请求块数量

### TtsChunkEvent

- **id** { [string](dataTypes#string) } - 任务 ID
- **index** { [number](dataTypes#number) } - 当前块序号
- **count** { [number](dataTypes#number) } - 块总数
- **start** { [number](dataTypes#number) } - 当前块在原文本中的起始索引
- **end** { [number](dataTypes#number) } - 当前块在原文本中的结束索引

### TtsRangeEvent

- **id** { [string](dataTypes#string) } - 任务 ID
- **start** { [number](dataTypes#number) } - 当前范围在原文本中的起始索引
- **end** { [number](dataTypes#number) } - 当前范围在原文本中的结束索引
- **frame** { [number](dataTypes#number) } - 引擎报告的音频帧位置
- **chunk** { [number](dataTypes#number) } - 当前块序号

### TtsSynthesisEvent

- **id** { [string](dataTypes#string) } - 任务 ID
- **sampleRate** { [number](dataTypes#number) } - 采样率, 单位为 Hz
- **encoding** { `'pcm_8_bit'` | `'pcm_16_bit'` | `'pcm_float'` | `'unknown'` } - 音频编码
- **channels** { [number](dataTypes#number) } - 声道数
- **chunk** { [number](dataTypes#number) } - 当前块序号

### TtsAudioEvent

- **id** { [string](dataTypes#string) } - 任务 ID
- **data** { [ByteArray](dataTypes#bytearray) } - 音频字节数组
- **chunk** { [number](dataTypes#number) } - 当前块序号

### TtsStopEvent

- **id** { [string](dataTypes#string) } - 任务 ID
- **operation** { `'speech'` | `'silence'` | `'file'` } - 操作类型
- **status** { `'stopped'` } - 停止状态
- **reason** { [string](dataTypes#string) } - 停止原因

常见停止原因为 `cancelled`, `flushed`, `interrupted`, `stopped` 或 `reset`.

### TtsError

- **code** { [string](dataTypes#string) } - TTS 错误代码
- **message** { [string](dataTypes#string) } - 错误消息
- **errorCode** { [number](dataTypes#number) | [null](dataTypes#null) } - Android 文本转语音错误码
- **reason** { [string](dataTypes#string) | [undefined](dataTypes#undefined) } - 中断原因

只有中断错误包含 `reason`.
