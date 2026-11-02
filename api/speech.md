# 语音 (Speech)

<!-- runtime-support:begin speech -->
<!-- 本段由 generator/runtime-support.js 根据 AutoJs6 运行时覆盖矩阵生成, 不要手动修改; 数据源 ksp -->

| 运行时支持 | Rhino | Node.js 主线程 | Node.js Worker | Bun |
| --- | --- | --- | --- | --- |
| 入口 | `speech`, `speech.models`, `speech.speaker` | `autojs6:speech`, `$autojs.speech` | `autojs6:speech`, `$autojs.speech` | `host.speech` |
| 状态 | 已支持 33 项 | 已支持 33 项 | 已支持 33 项 | 需授权 33 项 |
| 授权 | - | - | - | `speech.control` 33 项 |

差异项 (16 项): 下表列出入口, 状态或授权与同列多数 API 不同的 API, 未列出的 API 与同列多数一致.

| API | Node.js 主线程 | Node.js Worker | Bun |
| --- | --- | --- | --- |
| `speech.models.getDefault` | <span title="bridged">已支持</span>: `models.getDefault` (`autojs6:speech`) | <span title="bridged">已支持</span>: `models.getDefault` (`autojs6:speech`) | <span title="capability-gated">需授权</span> `speech.control`: `host.speech.models.getDefault` |
| `speech.models.importFile` | <span title="bridged">已支持</span>: `models.importFile` (`autojs6:speech`) | <span title="bridged">已支持</span>: `models.importFile` (`autojs6:speech`) | <span title="capability-gated">需授权</span> `speech.control`: `host.speech.models.importFile` |
| `speech.models.install` | <span title="bridged">已支持</span>: `models.install` (`autojs6:speech`) | <span title="bridged">已支持</span>: `models.install` (`autojs6:speech`) | <span title="capability-gated">需授权</span> `speech.control`: `host.speech.models.install` |
| `speech.models.installAsync` | <span title="bridged">已支持</span>: `models.installAsync` (`autojs6:speech`) | <span title="bridged">已支持</span>: `models.installAsync` (`autojs6:speech`) | <span title="capability-gated">需授权</span> `speech.control`: `host.speech.models.installAsync` |
| `speech.models.list` | <span title="bridged">已支持</span>: `models.list` (`autojs6:speech`) | <span title="bridged">已支持</span>: `models.list` (`autojs6:speech`) | <span title="capability-gated">需授权</span> `speech.control`: `host.speech.models.list` |
| `speech.models.refreshCatalog` | <span title="bridged">已支持</span>: `models.refreshCatalog` (`autojs6:speech`) | <span title="bridged">已支持</span>: `models.refreshCatalog` (`autojs6:speech`) | <span title="capability-gated">需授权</span> `speech.control`: `host.speech.models.refreshCatalog` |
| `speech.models.remove` | <span title="bridged">已支持</span>: `models.remove` (`autojs6:speech`) | <span title="bridged">已支持</span>: `models.remove` (`autojs6:speech`) | <span title="capability-gated">需授权</span> `speech.control`: `host.speech.models.remove` |
| `speech.models.setDefault` | <span title="bridged">已支持</span>: `models.setDefault` (`autojs6:speech`) | <span title="bridged">已支持</span>: `models.setDefault` (`autojs6:speech`) | <span title="capability-gated">需授权</span> `speech.control`: `host.speech.models.setDefault` |
| `speech.speaker.enroll` | <span title="bridged">已支持</span>: `speaker.enroll` (`autojs6:speech`) | <span title="bridged">已支持</span>: `speaker.enroll` (`autojs6:speech`) | <span title="capability-gated">需授权</span> `speech.control`: `host.speech.speaker.enroll` |
| `speech.speaker.enrollAsync` | <span title="bridged">已支持</span>: `speaker.enrollAsync` (`autojs6:speech`) | <span title="bridged">已支持</span>: `speaker.enrollAsync` (`autojs6:speech`) | <span title="capability-gated">需授权</span> `speech.control`: `host.speech.speaker.enrollAsync` |
| `speech.speaker.identify` | <span title="bridged">已支持</span>: `speaker.identify` (`autojs6:speech`) | <span title="bridged">已支持</span>: `speaker.identify` (`autojs6:speech`) | <span title="capability-gated">需授权</span> `speech.control`: `host.speech.speaker.identify` |
| `speech.speaker.identifyAsync` | <span title="bridged">已支持</span>: `speaker.identifyAsync` (`autojs6:speech`) | <span title="bridged">已支持</span>: `speaker.identifyAsync` (`autojs6:speech`) | <span title="capability-gated">需授权</span> `speech.control`: `host.speech.speaker.identifyAsync` |
| `speech.speaker.list` | <span title="bridged">已支持</span>: `speaker.list` (`autojs6:speech`) | <span title="bridged">已支持</span>: `speaker.list` (`autojs6:speech`) | <span title="capability-gated">需授权</span> `speech.control`: `host.speech.speaker.list` |
| `speech.speaker.remove` | <span title="bridged">已支持</span>: `speaker.remove` (`autojs6:speech`) | <span title="bridged">已支持</span>: `speaker.remove` (`autojs6:speech`) | <span title="capability-gated">需授权</span> `speech.control`: `host.speech.speaker.remove` |
| `speech.speaker.verify` | <span title="bridged">已支持</span>: `speaker.verify` (`autojs6:speech`) | <span title="bridged">已支持</span>: `speaker.verify` (`autojs6:speech`) | <span title="capability-gated">需授权</span> `speech.control`: `host.speech.speaker.verify` |
| `speech.speaker.verifyAsync` | <span title="bridged">已支持</span>: `speaker.verifyAsync` (`autojs6:speech`) | <span title="bridged">已支持</span>: `speaker.verifyAsync` (`autojs6:speech`) | <span title="capability-gated">需授权</span> `speech.control`: `host.speech.speaker.verifyAsync` |

Node.js 与 Bun 的导入方式, 异步返回值与授权检查见 [运行时 API](runtimeApis#执行方式).

<!-- runtime-support:end -->

`speech` 模块用于在脚本中使用 3-Macaw Speech 插件的离线语音能力: 麦克风听写, 音频文件或 PCM 数据识别, 语音活动检测, 唤醒词检测, 神经网络语音合成, 说话人识别, 音频文件的说话人分离, 语种识别与音频标签, 以及插件模型的下载与管理. 全部识别, 分析与合成都在设备上完成, 音频不会上传.

从 AutoJs6 6.8.0 起, 本模块由外置 3-Macaw Speech 插件 (AutoJs6-Plugin-Three-Macaw-Speech) 1.0.0 及以上版本提供, 宿主不保留任何识别或合成实现. 调用前需在插件中心安装并启用与当前 AutoJs6 兼容的插件. 插件缺失时方法抛出 (或以 Promise 拒绝) `code` 为 `PLUGIN_UNAVAILABLE` 的 [SpeechError](#c-speecherror), 其消息为插件中心的本地化缺插件提示; 插件被禁用或未授权时为 `PLUGIN_DISABLED`; 插件版本或契约不兼容, 或插件未声明所需功能时为 `PLUGIN_INCOMPATIBLE`. [speech.isAvailable](#m-isavailable) 可预先探测.

本模块在 Rhino 中注册为全局名称 `speech`, 并提供 `$speech` 别名, 二者指向同一对象. 本页的签名与同步返回值描述 Rhino. Node.js, Bun 与 Node.js Worker 提供显式导入的异步接口, 参阅 [Runtime APIs 的语音识别与模型管理](runtimeApis#nodejs--bun--worker-的语音识别与模型管理); 这些运行时不注入 speech/$speech 全局.

音频文件以路径指定, 相对路径按脚本工作目录解析 (与 [files.path](files#m-path) 相同), 也可使用绝对路径; 不接受 `content://`, `file://`, `http://` 等 URI. 输入文件由 AutoJs6 以只读方式打开后交给插件, 合成输出由 AutoJs6 暂存, 检查后再改名为目标文件. 插件不会得到任何路径.

传给插件的选项会像 `JSON.stringify` 一样序列化, 函数与 `undefined` 值被忽略 (`onProgress` 回调除外). 未知的选项键按名称以 `INVALID_OPTIONS` 拒绝, 类型或取值范围错误同样为 `INVALID_OPTIONS`; 会话时长, 热词, 关键词与文本长度等契约上限在调用到达插件前即以 `LIMIT_EXCEEDED` 拒绝. 可能等待较长时间的同步方法 ([recognize](#m-recognize), [detectVoice](#m-detectvoice), [synthesize](#m-synthesize), [diarize](#m-diarize), [detectLanguage](#m-detectlanguage), [tag](#m-tag), [speaker.enroll](#m-speakerenroll), [speaker.verify](#m-speakerverify), [speaker.identify](#m-speakeridentify), [models.install](#m-modelsinstall), [models.importFile](#m-modelsimportfile), [models.refreshCatalog](#m-modelsrefreshcatalog)) 不能在 UI 线程调用 (抛出 `INVALID_OPTIONS`), UI 模式中请使用对应的 `Async` 形态. 停止脚本会取消尚未完成的调用. AutoJs6 不把识别出的文字写入日志.

```js
let session = speech.listen({ maxDurationMillis: 10000 });
session.on('final', e => console.log(e.text));
session.on('end', e => console.log(e.reason, session.result()));
```

## 准备工作

1. 在插件中心安装并启用 3-Macaw Speech. 插件为每种 ABI 提供安装包, 另有适用于全部设备的 `universal` 安装包.
2. 打开插件界面, 在首页状态卡中授予麦克风权限. 录音在插件进程内完成, 因此麦克风权限由插件自己持有, AutoJs6 的麦克风权限不能代替. [speech.capabilities](#m-capabilities) 的 `microphoneGranted` 表示插件当前是否持有该权限.
3. 在插件界面或通过 [speech.models.install](#m-modelsinstall) 下载需要的识别, 唤醒词, 合成或分析 (说话人, 分割, 语种识别, 音频标签) 模型. 语音活动检测模型随插件内置.

插件缺少麦克风权限时, 打开麦克风会话会失败于 `PERMISSION_DENIED`, 其消息给出授权界面 `MicrophonePermissionActivity` 的组件名. 该界面受 AutoJs6 插件权限保护, 只能由 AutoJs6 打开, 脚本可以直接启动它弹出系统授权对话框:

```js
if (speech.capabilities().microphoneGranted === false) {
    app.startActivity({
        packageName: 'io.github.supermonster003.autojs6.plugin.three.macaw.speech',
        className: 'io.github.supermonster003.autojs6.plugin.three.macaw.speech.service.MicrophonePermissionActivity',
    });
}
```

## 模型目录与许可

模型分为八类 (`kind`): `asr` (语音识别), `kws` (唤醒词检测), `tts` (语音合成) 与 `vad` (语音活动检测), 以及 3-Macaw Speech 1.3.0 (目录版本 3) 起的 `speaker` (说话人声纹, 用于 [说话人识别](#p-speaker) 与 [说话人分离](#m-diarize)), `segment` (说话人分割, 用于说话人分离), `langid` (语种识别) 与 `tagger` (音频标签). 语音活动检测模型 `vad.silero.v5` 随插件内置, 始终处于已安装状态且不能删除. 其他模型体积较大, 不随 APK 提供, 由插件从 AutoJs6 共享资源仓库 (AutoJs6-Shared-Assets) 的不可变发布下载, 镜像不可用时回退到 sherpa-onnx 的上游发布地址; 两条路径都要逐个文件校验 SHA-256 后才启用. 模型保存在插件私有存储中, 插件不申请存储权限. 模型目录带签名, 可通过 [speech.models.refreshCatalog](#m-modelsrefreshcatalog) 更新, 目录版本只增不减.

每类模型有一个默认模型, 方法省略 `model` 选项时使用它. 默认模型依次取: 以 [speech.models.setDefault](#m-modelssetdefault) 或插件界面设定且仍完好安装的模型, 目录推荐的已安装模型, 目录顺序中第一个已安装模型, 按 ID 排序的第一个导入模型. 某类没有任何已安装模型时, 使用该类模型的调用失败于 `MODEL_MISSING`.

插件 1.0.0 内置的模型目录 (目录版本 1) 如下. 实际可用的模型以 [speech.models.list](#m-modelslist) 的结果为准.

| 模型 ID | 类型 | 语言 | 安装后约 | 许可 | 可商用 |
| --- | --- | --- | --- | --- | --- |
| `asr.sense-voice.zh-en-ja-ko-yue.2024-07-17.int8` | asr, `sense-voice` (离线, 推荐) | zh, en, ja, ko, yue | 229 MiB | FunASR 模型许可 1.1 | 是 |
| `asr.zipformer-streaming.zh-en.2023-02-20.int8` | asr, `online-transducer` (流式, 推荐) | zh, en | 190 MiB | Apache-2.0 | 是 |
| `asr.zipformer-streaming.en.2023-06-26.int8` | asr, `online-transducer` (流式, 推荐) | en | 67 MiB | Apache-2.0 | 是 |
| `asr.zipformer-streaming.zh.2025-06-30.int8` | asr, `online-transducer` (流式) | zh | 160 MiB | 未声明 | 否 |
| `kws.zipformer.zh-en.2025-12-20` | kws, `kws-transducer` (推荐) | zh, en | 8 MiB | Apache-2.0 | 是 |
| `tts.vits.melo.zh-en` | tts, `vits`, 1 个说话人, 44.1 kHz (推荐) | zh, en | 169 MiB | MIT | 是 |
| `tts.vits.icefall.zh-aishell3` | tts, `vits`, 174 个说话人, 8 kHz (推荐) | zh | 31 MiB | 未声明 | 未知 |
| `tts.kokoro.multi-lang.v1_1` | tts, `kokoro`, 103 个说话人, 24 kHz | zh, en | 387 MiB | Apache-2.0 与 GPL-3.0-or-later | 是 |
| `tts.vits.piper.en-us-lessac-medium` | tts, `vits`, 1 个说话人, 22.05 kHz | en | 77 MiB | MIT 与 GPL-3.0-or-later | 否 |
| `tts.matcha.icefall.zh-baker` | tts, `matcha`, 1 个说话人, 22.05 kHz | zh | 77 MiB | 未声明与 MIT | 否 |
| `vad.silero.v5` | vad, `silero` (内置) | - | 2 MiB | MIT | 是 |

3-Macaw Speech 1.2.0 (目录版本 2) 与 1.3.0 (目录版本 3) 的目录另增以下模型, 最后一栏为最早提供该模型的插件版本. 1.2.0 起目录还有标点模型 (`punct`), 它们只供插件给识别结果补标点, 不出现在 [speech.models.list](#m-modelslist) 中.

| 模型 ID | 类型 | 语言 | 安装后约 | 许可 | 可商用 | 插件版本 |
| --- | --- | --- | --- | --- | --- | --- |
| `asr.zipformer-streaming.fr.2023-04-14.int8` | asr, `online-transducer` (流式, 推荐) | fr | 123 MiB | Apache-2.0 | 是 | 1.2.0 |
| `asr.zipformer-streaming.ru.2025-08-16.int8` | asr, `online-transducer` (流式, 推荐) | ru | 27 MiB | Apache-2.0 | 是 | 1.2.0 |
| `asr.zipformer-streaming.ko.2024-06-16.int8` | asr, `online-transducer` (流式) | ko | 134 MiB | Apache-2.0 | 否 | 1.2.0 |
| `tts.vits.piper.fr-fr-siwis-medium.int8` | tts, `vits`, 1 个说话人, 22.05 kHz | fr | 35 MiB | MIT 与 GPL-3.0-or-later | 否 | 1.2.0 |
| `tts.vits.piper.es-es-davefx-medium.int8` | tts, `vits`, 1 个说话人, 22.05 kHz | es | 35 MiB | MIT 与 GPL-3.0-or-later | 否 | 1.2.0 |
| `tts.vits.piper.de-de-thorsten-medium.int8` | tts, `vits`, 1 个说话人, 22.05 kHz | de | 35 MiB | MIT 与 GPL-3.0-or-later | 否 | 1.2.0 |
| `tts.vits.piper.ru-ru-denis-medium.int8` | tts, `vits`, 1 个说话人, 22.05 kHz | ru | 35 MiB | MIT 与 GPL-3.0-or-later | 否 | 1.2.0 |
| `asr.nemo-transducer.es.2026-05-03.int8` | asr, `offline-transducer` (离线, 推荐) | es | 130 MiB | CC-BY-4.0 | 是 | 1.3.0 |
| `asr.zipformer-streaming.ar-en-id-ja-ru-th-vi-zh.2025-02-10.int8` | asr, `online-transducer` (流式) | ar, en, id, ja, ru, th, vi, zh | 323 MiB | Apache-2.0 | 未知 | 1.3.0 |
| `tts.kokoro.multi-lang.v1_0.int8` | tts, `kokoro`, 49 个说话人, 24 kHz | en, zh, es, fr, hi, it, pt | 161 MiB | Apache-2.0 与 GPL-3.0-or-later | 是 | 1.3.0 |
| `tts.vits.piper.ar-jo-sa-dii-high.int8` | tts, `vits`, 1 个说话人, 22.05 kHz | ar | 35 MiB | CC-BY-NC-SA-4.0 与 GPL-3.0-or-later | 否 | 1.3.0 |
| `tts.vits.piper.ar-jo-sa-miro-v2-high.int8` | tts, `vits`, 1 个说话人, 22.05 kHz | ar | 35 MiB | CC-BY-NC-ND-4.0 与 GPL-3.0-or-later | 否 | 1.3.0 |
| `tts.vits.mimic3.ko-ko-kss-low` | tts, `vits`, 1 个说话人, 22.05 kHz | ko | 77 MiB | CC0-1.0 与 GPL-3.0-or-later | 否 | 1.3.0 |
| `speaker.eres2net.3dspeaker.en-voxceleb` | speaker, `speaker-embedding` (推荐) | en, zh | 25 MiB | Apache-2.0 | 是 | 1.3.0 |
| `segment.pyannote.3-0` | segment, `pyannote-segmentation` (推荐) | - | 6 MiB | MIT | 否 | 1.3.0 |
| `langid.whisper.tiny.int8` | langid, `whisper-langid` (推荐) | Whisper 的 99 种语言 | 98 MiB | MIT | 未知 | 1.3.0 |
| `langid.whisper.base.int8` | langid, `whisper-langid` | Whisper 的 99 种语言 | 152 MiB | MIT | 未知 | 1.3.0 |
| `tagger.ced.mini.int8` | tagger, `ced` (推荐) | - | 10 MiB | CC-BY-4.0 与 CC-BY-SA-4.0 | 是 | 1.3.0 |

- `asr.zipformer-streaming.zh.2025-06-30.int8`, `asr.zipformer-streaming.ko.2024-06-16.int8` 与 `tts.vits.piper.ar-jo-sa-miro-v2-high.int8` 不经镜像分发, 只从 sherpa-onnx 的上游发布安装.
- 流式模型 (`online-transducer`) 逐字给出部分结果; 离线模型 (`sense-voice`, `offline-transducer`) 由语音活动检测切段后逐段识别, 部分结果按段给出. 两类模型在会话上触发同样的事件.
- 热词 (`hotwords`) 只对带 `bpe.vocab` 的流式模型生效 (目录中为 `asr.zipformer-streaming.zh-en.2023-02-20.int8`), 其他模型收到热词时忽略并给出警告.
- `asr.nemo-transducer.es.2026-05-03.int8` 只识别西班牙语, 结果自带标点与大小写. `asr.zipformer-streaming.ar-en-id-ja-ru-th-vi-zh.2025-02-10.int8` 自行判断语种, 不能指定语言, 句首偶尔被识别成其他语言, 结果不带标点; 其权重为 Apache-2.0, 但训练数据未公开, 因此可商用一栏为 "未知".
- 说话人, 分割, 语种识别与音频标签模型只供 [speech.speaker](#p-speaker), [speech.diarize](#m-diarize), [speech.detectLanguage](#m-detectlanguage) 与 [speech.tag](#m-tag) 使用, 见 [离线分析](#离线分析). 说话人分离同时使用一个分割模型和一个说话人模型. `segment.pyannote.3-0` 的权重为 MIT 许可, 但训练数据中的 MSDWild 仅限研究用途, 因此可商用一栏为 "否"; Whisper 的权重为 MIT 许可, 训练数据未公开, 因此为 "未知". 音频标签只有英文标签.
- `tts.kokoro.multi-lang.v1_1` 的 0 - 2 号说话人为英文, 3 号及以后为中文, 默认说话人为 3 号. `tts.kokoro.multi-lang.v1_0.int8` 的说话人按语言划分: 0 - 19 号美式英语, 20 - 27 号英式英语, 28, 29 与 53 号西班牙语, 30 号法语, 31 - 34 号印地语, 35, 36 号意大利语, 42 - 44 号巴西葡萄牙语, 45 - 52 号中文 (也能读英文); 37 - 41 号为日语说话人, 不开放, 指定它们时调用失败于 `INVALID_OPTIONS`; 默认说话人为 3 号. 其他模型的默认说话人为 0 号.

每个模型对象的 `license` 给出许可表达式 (`spdx`) 与是否可商用 (`commercialUse`). 仅限非商业用途或未声明许可的模型 (目录中可商用一栏为 "否" 或 "未知" 的条目, 其 `commercialUse` 为 `false`) 须先接受许可才能安装: 脚本以 `acceptLicense: true` 调用 [speech.models.install](#m-modelsinstall) 或 [speech.models.importFile](#m-modelsimportfile), 或者用户在插件界面的许可提示中确认. 接受记录按模型版本与许可表达式保存在插件中, 之后再次安装同一版本无需重复接受; 否则调用失败于 `MODEL_LICENSE_NOT_ACCEPTED`. `acceptLicense` 只表示接受许可条款, 不改变模型许可本身, 使用者需自行遵守.

插件源码采用 MPL-2.0 许可. 插件内的语音运行时 sherpa-onnx (Apache-2.0) 静态链接了 eSpeak NG 等 GPL-3.0-or-later 组件, 因此插件 APK 整体按 GPL-3.0-or-later 传播. 第三方组件与许可全文见插件的 "关于" 页面.

## 模型更新

3-Macaw Speech 1.4.0 起, 模型对象带 [updateAvailable](speechModelInfoType#p-updateavailable) 与 [latestVersionCode](speechModelInfoType#p-latestversioncode). 目录不会自动刷新: 调用 [speech.models.refreshCatalog](#m-modelsrefreshcatalog) 或在插件首页刷新后, 已安装的模型有更高版本时 `updateAvailable` 为 `true`, 首页的模型卡片也标出 "可更新".

调用 [speech.models.install](#m-modelsinstall) 或在首页点击更新, 模型更新到目录的最新版本:

- 新版下载到独立目录, 校验通过后才切换. 下载失败, 校验失败或取消时旧版不受影响.
- 新版本的许可与首次安装一样处理, 接受记录按版本保存, 见 [模型目录与许可](#模型目录与许可).
- 模型正在使用时也能更新: 运行中的会话, 常驻唤醒与系统语音合成引擎用内存中的旧版做完, 之后开始的任务使用新版, 旧版文件在最后一个使用者结束后删除.

```js
speech.models.refreshCatalog();
speech.models.list({ installed: true })
    .filter(m => m.updateAvailable)
    .forEach(m => speech.models.install(m.id));
```

## 麦克风会话与后台收音

麦克风由插件在其自身进程中采集, 音频不经过 AutoJs6. AutoJs6 绑定插件时传递自身的前台能力, 插件在麦克风会话 ([speech.listen](#m-listen) 与 [speech.wake](#m-wake)) 期间还会启动带录音通知的麦克风前台服务, 会话结束即停止. 因此:

- 在 AutoJs6 界面可见时 (或 AutoJs6 的无障碍服务已绑定时) 打开的会话, 之后 AutoJs6 退到后台或熄屏也能继续收音.
- AutoJs6 已在后台且没有麦克风能力时打开的会话, Android 不允许插件录音或启动麦克风前台服务. 会话仍会打开, 但触发 `code` 为 `PERMISSION_DENIED` 的 `warning` 事件, 并且收到的是静音; 会话不会因此结束, AutoJs6 重新回到前台等插件重新获得麦克风能力后恢复收音, 其间 `timeoutMillis` 可能先结束会话. 需要在后台收音的脚本应在 AutoJs6 可见时打开会话.
- Android 14 及以上, 插件在开始会话时会短暂显示一个透明界面以启动麦克风前台服务.

插件只有一个麦克风. 整个插件同一时刻只运行一个麦克风会话 (听写或唤醒), 不论它由哪个脚本, 哪个应用 (例如 3-Stone AI 或 3-Stove Agent 的常驻监听) 或插件自己的界面打开; 第二个麦克风会话立即失败于 `SESSION_BUSY`, 不会排队等待. 以 `source: 'external'` 打开的 PCM 会话与文件识别不占用麦克风, 外部 PCM 会话每个调用方应用最多同时 4 个.

脚本退出时, 仍打开的会话被静默取消 (不再触发事件), 插件随即停止录音并释放麦克风.

### 唤醒会话的临时接管

插件自己的听写入口, 即 [数字助理](#数字助理), [系统语音输入](#系统语音输入) 弹层, [系统识别服务](#系统识别服务) 与插件界面的 "试听试说" 页, 开始收音时若麦克风正被唤醒会话占用 (脚本的 [speech.wake](#m-wake), 或其他应用经插件打开的唤醒会话), 会临时接管麦克风:

- 唤醒会话保持打开但静默: 接管期间不报告 `wake` 命中 (避免说话内容误触唤醒词), 不结束, 也不触发其他事件; 接管方结束后自动恢复检测.
- 接管对脚本透明, 唤醒会话的状态与属性不变.
- 唤醒命中后已按 `thenListen` 转入听写的轮次, 以及 [speech.listen](#m-listen) 的听写会话, 不会被接管; 此时这些入口显示 "麦克风正被占用" 的说明.
- 接管期间打开新的麦克风会话同样失败于 `SESSION_BUSY`.

## 离线分析

[speech.diarize](#m-diarize) (说话人分离), [speech.detectLanguage](#m-detectlanguage) (语种识别) 与 [speech.tag](#m-tag) (音频标签) 分析一个完整的音频文件, 一次调用得到结果, 不做流式处理. 它们需要插件分别声明 `diarization`, `languageId` 与 `audioTagging` 功能 (3-Macaw Speech 1.3.0 及以上, 契约版本 `2`); 较早的插件以 `PLUGIN_INCOMPATIBLE` 拒绝调用. 所需模型未安装时失败于 `MODEL_MISSING`, 可在插件首页或通过 [speech.models.install](#m-modelsinstall) 下载, 见 [模型目录与许可](#模型目录与许可).

- 只接受音频文件路径, 不接受 PCM 数据. 文件的格式要求与上限同 [speech.recognize](#m-recognize) 的文件路径: WAV 以外的格式需要 `audioDecode` 功能, 文件不超过 200 MiB 且时长不超过 30 分钟.
- `options.onProgress(done, total)` 以音频毫秒报告进度, `total` 为文件的音频时长, 回调在脚本线程上执行; 回调抛出的第一个错误在分析结束后抛出 (`Async` 形态以它拒绝 Promise).
- AutoJs6 为每次进度及最终完成各等待 10 分钟, 不限制总时长; 10 分钟内没有进度时失败于 `TIMEOUT`. 插件同一时刻只运行一个分析, 后到的请求排队等待, 排队期间插件仍会定期报告进度.
- 结果中的时间相对音频开头, 单位为毫秒; `durationMillis` 为解码后的音频时长, `modelId` 为所用的模型 (说话人分离为分割模型). 分数保留四位小数.
- 脚本停止时取消尚未完成的分析 (插件以 `SESSION_CANCELLED` 结束该操作). 说话人分离的计算阶段无法中途停止, 插件在后台算完后丢弃结果, 其间新的分析请求排队等待.
- 同步形态阻塞当前脚本线程, 不能在 UI 线程调用; `Async` 形态返回 Promise, 错误以 [SpeechError](#c-speecherror) 拒绝, 回调在脚本线程执行.

参阅示例代码 "3-Macaw Speech > 说话人分离", "3-Macaw Speech > 语种识别" 与 "3-Macaw Speech > 音频标签".

---

<p style="font: bold 2em sans-serif; color: #FF7043">speech</p>

---

## [m] isAvailable

### speech.isAvailable()

**`6.8.0`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 当前是否有兼容, 已启用且已授权的语音插件应答

探测插件可用性, 不抛出插件错误. 返回 `true` 不表示所需模型已安装或插件已获得麦克风权限.

## [m] capabilities

### speech.capabilities()

**`6.8.0`**

- <ins>**returns**</ins> { [SpeechCapabilities](#speechcapabilities) } - 当前插件的能力快照

返回所选插件声明的能力与实时查询结果的合并. 插件不可用时抛出 `PLUGIN_UNAVAILABLE`, `PLUGIN_DISABLED` 或 `PLUGIN_INCOMPATIBLE`.

```js
let caps = speech.capabilities();
console.log(caps.versionName, caps.features.join(', '));
console.log('麦克风权限:', caps.microphoneGranted);
```

## [m] listen

### speech.listen(options?)

**`6.8.0`**

- **[ options ]** { [SpeechListenOptions](#speechlistenoptions) } - 听写选项
- <ins>**returns**</ins> { [SpeechSession](speechSessionType) } - 听写会话

打开一个听写会话. 插件打开会话后立即返回, 模型在插件中加载, 加载完成后会话触发 `ready` 事件; 识别结果以 `partial`, `final` 等事件在打开会话的脚本线程到达, `end` 是唯一的终结事件. 会话打开期间脚本保持运行, 直至 `end` 事件; 不需要也不应使用 `sleep` 循环等待.

默认 (`source: 'mic'`) 从插件的麦克风收音, 需要插件声明 `asrStreaming` 功能; `source: 'external'` 打开外部 PCM 会话, 由脚本以 [session.feed](speechSessionType#m-feed) 输入音频, 需要 `asr` 功能.

打开失败时同步抛出: `SESSION_BUSY` (麦克风正被另一个会话占用, 或外部 PCM 会话已达上限), `PERMISSION_DENIED` (插件没有麦克风权限), `MODEL_MISSING` (未安装所需模型; 也可能在打开后以 `error` 事件报告), 以及参数错误.

```js
let session = speech.listen({ silenceEndMillis: 1500, timeoutMillis: 10000 });
session.on('partial', e => console.log('...', e.text));
session.on('final', e => files.append('./dictation.txt', e.text + '\n'));
session.on('warning', w => console.warn(w.code, w.message));
session.on('end', e => console.log('结束:', e.reason));
```

## [m] recognize

### speech.recognize(source, options?)

**`6.8.0`** **`Non-UI`**

- **source** { [string](dataTypes#string) | [ArrayBuffer](dataTypes#arraybuffer) | [TypedArray](dataTypes#typedarray) | [ByteArray](dataTypes#bytearray) } - 音频文件路径或 PCM 数据
- **[ options ]** { [SpeechRecognizeOptions](#speechrecognizeoptions) } - 识别选项
- <ins>**returns**</ins> { [SpeechRecognitionResult](speechRecognitionResultType) } - 识别结果

识别一段音频, 阻塞当前脚本线程直至得到结果. 需要插件声明 `asr` 功能.

- 文件路径须指向音频文件. WAV (PCM 8 / 16 / 24 / 32 位整数或浮点采样, 任意采样率与声道数) 由插件直接读取; 插件声明 `audioDecode` 功能时 (3-Macaw Speech 1.2.0 起), 还接受设备系统能解码的其他格式, 如 MP3, AAC (含 M4A), Ogg (Vorbis, Opus), FLAC 与 AMR, 以及视频文件 (MP4, WebM 等) 的第一条音轨. 插件按块解码, 重采样并混为单声道, 不把整段音频读入内存. 文件不超过 200 MiB 且时长不超过 30 分钟.
- AutoJs6 先检查文件存在, 可读与大小. 文件不以 `RIFF` / `WAVE` 头开始而插件未声明 `audioDecode` 时失败于 `UNSUPPORTED_FORMAT`, 消息提示更新插件; 文件没有音轨, 设备缺少该编码的解码器 (例如多数设备没有 AC-3 解码器) 或文件损坏时, 插件同样以 `UNSUPPORTED_FORMAT` 失败, 消息写明原因. 被截断的文件识别其中完整的部分.
- PCM 数据为单声道 PCM16 LE, 采样率由 `options.sampleRate` 指定. 可传入 `ArrayBuffer`, `Int16Array` 等类型化数组视图, 或 Java `byte[]` (例如 `files.readBytes` 的结果); 大端字节序的 `Int16Array` 会被转换为小端. 不接受普通 JavaScript 数字数组. AutoJs6 把 PCM 包装为临时 WAV 文件交给插件, 调用结束后删除.
- 默认使用默认识别模型, 一次调用最多等待 10 分钟.

```js
let result = speech.recognize('./record.wav', { language: 'zh' });
console.log(result.text);
result.segments.forEach(s => console.log(s.startMillis, s.endMillis, s.text));
```

## [m] recognizeAsync

### speech.recognizeAsync(source, options?)

**`6.8.0`** **`Async`**

- **source** { [string](dataTypes#string) | [ArrayBuffer](dataTypes#arraybuffer) | [TypedArray](dataTypes#typedarray) | [ByteArray](dataTypes#bytearray) } - 音频文件路径或 PCM 数据
- **[ options ]** { [SpeechRecognizeOptions](#speechrecognizeoptions) } - 识别选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [SpeechRecognitionResult](speechRecognitionResultType)

[speech.recognize](#m-recognize) 的异步形态, 参数与结果相同, 可在 UI 线程使用. 错误以 [SpeechError](#c-speecherror) 拒绝 Promise, 回调在脚本线程执行.

## [m] detectVoice

### speech.detectVoice(source, options?)

**`6.8.0`** **`Non-UI`**

- **source** { [string](dataTypes#string) | [ArrayBuffer](dataTypes#arraybuffer) | [TypedArray](dataTypes#typedarray) | [ByteArray](dataTypes#bytearray) } - 与 [recognize](#m-recognize) 相同的音频来源
- **[ options ]** { [SpeechVadOptions](#speechvadoptions) } - 语音活动检测选项
- <ins>**returns**</ins> { [SpeechVoiceSegments](#speechvoicesegments) } - 检测到的语音段

检测一段音频中包含语音的时间段, 不做识别. 需要插件声明 `vad` 功能. 本方法同步执行, 没有 `Async` 形态.

```js
let { segments, durationMillis } = speech.detectVoice('./record.wav');
console.log(`${segments.length} 段语音, 共 ${durationMillis} ms`);
```

## [m] wake

### speech.wake(keywords, options?)

**`6.8.0`**

- **keywords** { [string](dataTypes#string) | [SpeechKeyword](#speechkeyword) | ([string](dataTypes#string) | [SpeechKeyword](#speechkeyword))[[]](dataTypes#array) } - 一个关键词, 或关键词数组
- **[ options ]** { [SpeechWakeOptions](#speechwakeoptions) } - 唤醒选项
- <ins>**returns**</ins> { [SpeechWakeSession](speechWakeSessionType) } - 唤醒会话

打开一个唤醒词会话, 从插件的麦克风持续检测关键词, 每次命中触发 `wake` 事件. 需要插件声明 `kws` 功能; 使用 `thenListen` 时还需要 `asrStreaming` 功能. 唤醒会话占用插件唯一的麦克风, 与 [listen](#m-listen) 的打开失败情形相同.

关键词直接写原文, 无需训练模型: 1 - 50 个, 不能重复, 每个不超过 128 个字符. 中文按常用读音转换为拼音 (声母与带调韵母), 英文单词按模型自带的音素词典转换; 空白与标点分隔单词. 数字, 词典中没有的英文单词与无法转换的字符以 `INVALID_OPTIONS` 拒绝. 由空格分隔的模型 token 原样使用, 可借此为多音字指定读音, 例如 `'x iǎo l iù'`.

设置 `thenListen` 后, 每次命中自动转入一轮听写: `wake` 事件的 `listen` 字段是该轮的 [SpeechSession](speechSessionType), 在 `wake` 监听器中为它注册事件; 该轮结束后恢复关键词检测. 唤醒会话被插件自己的听写入口临时接管时保持静默, 见 [唤醒会话的临时接管](#唤醒会话的临时接管).

```js
let wake = speech.wake(['小六小六', { keyword: 'hey macaw', threshold: 0.3 }], {
    thenListen: { silenceEndMillis: 1200 },
});
wake.on('wake', e => {
    console.log('唤醒:', e.keyword);
    e.listen.on('final', r => console.log('指令:', r.text));
});
```

## [m] synthesize

### speech.synthesize(text, path, options?)

**`6.8.0`** **`Non-UI`**

- **text** { [string](dataTypes#string) } - 待合成文本, 非空白, 最多 8000 个字符 (UTF-16 单元)
- **path** { [string](dataTypes#string) } - 输出 WAV 文件路径
- **[ options ]** { [SpeechSynthesizeOptions](#speechsynthesizeoptions) } - 合成选项
- <ins>**returns**</ins> { [SpeechSynthesisResult](#speechsynthesisresult) } - 合成结果

把文本合成为 WAV 文件 (模型采样率的单声道 PCM16), 阻塞当前脚本线程直至完成. 需要插件声明 `tts` 功能.

插件按句切分文本并逐句合成, 每句报告一次进度. AutoJs6 在目标文件夹中创建隐藏的暂存文件 (`.speech-<uuid>.wav.part`) 交给插件写入, 完成后检查大小与 WAV 文件头, 再改名为目标文件 (已存在时被替换); 缺失的父目录会被创建. 合成失败, 取消或超时时删除暂存文件, 目标路径不会留下半成品. 输出文件不超过 100 MiB, 否则失败于 `LIMIT_EXCEEDED`. AutoJs6 为每次进度及最终完成各等待 10 分钟, 不限制总时长; 10 分钟内没有进度时取消合成并失败于 `TIMEOUT`.

单说话人模型收到其他说话人时忽略该选项, 并在结果的 `warnings` 中给出 `INVALID_OPTIONS` 警告.

```js
let r = speech.synthesize('任务已完成', './done.wav', { model: 'tts.vits.icefall.zh-aishell3', speaker: 10 });
console.log(r.path, r.durationMillis, r.sampleRate);
media.playMusic(r.path);
```

## [m] synthesizeAsync

### speech.synthesizeAsync(text, path, options?)

**`6.8.0`** **`Async`**

- **text** { [string](dataTypes#string) } - 待合成文本
- **path** { [string](dataTypes#string) } - 输出 WAV 文件路径
- **[ options ]** { [SpeechSynthesizeOptions](#speechsynthesizeoptions) } - 合成选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [SpeechSynthesisResult](#speechsynthesisresult)

[speech.synthesize](#m-synthesize) 的异步形态, 参数与结果相同, 可在 UI 线程使用.

## [m] speak

### speech.speak(text, options?)

**`6.8.0`** **`Async`**

- **text** { [string](dataTypes#string) } - 待朗读文本, 非空白
- **[ options ]** { [SpeechSpeakOptions](#speechspeakoptions) } - 朗读选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [TtsResult](tts#ttsresult)

使用 3-Macaw Speech 注册的系统 TTS 引擎朗读文本. 本方法等价于 [tts(text, options)](tts) 并把引擎固定为插件包名, 返回值即 `tts()` 返回的 Promise, 不返回 [TtsUtterance](tts#ttsutterance).

- 语音由 `model` 与 `speaker` 决定, 选择规则见 [使用 3-Macaw Speech 引擎](tts#使用-3-macaw-speech-引擎); `speed` 转为 `tts` 的 `rate`.
- 不接受 `engine`, `voice`, `rate` 与 `speechRate`, 也不接受不带 `model` 的 `speaker`; 说话人不能含 `/`. 这些参数错误同步抛出 `INVALID_OPTIONS`.
- 给出 `model` 时, `language` / `locale` / `lang` 只用于在未给 `speaker` 时选择该模型的说话人, 不交给 `tts`. 其余选项 (如 `pitch`, `volume`, `queue`, `usage`) 原样交给 `tts` 并由其校验.
- 插件包中没有 TTS 引擎服务 (插件未安装) 时, Promise 以 `PLUGIN_UNAVAILABLE` 的 [SpeechError](#c-speecherror) 拒绝. 该检查只查询包信息, 插件中心的启用状态不影响系统引擎.
- 其他失败与 `tts()` 相同, 以 [TtsError](tts#ttserror) 拒绝, 例如指定的模型未安装时为 `CONFIGURATION`.

```js
speech.speak('任务已完成').then(r => console.log(r.voice));
speech.speak('Task completed', { model: 'tts.kokoro.multi-lang.v1_1' });
speech.speak('你好', { model: 'tts.vits.icefall.zh-aishell3', speaker: 'SSB0005', speed: 1.2 });
```

## [m] diarize

### speech.diarize(file, options?)

**`6.8.0`** **`Non-UI`**

- **file** { [string](dataTypes#string) } - 音频文件路径
- **[ options ]** { [SpeechDiarizeOptions](#speechdiarizeoptions) } - 说话人分离选项
- <ins>**returns**</ins> { [SpeechDiarization](#speechdiarization) } - 说话人分离结果

说话人分离: 找出音频中 "谁在什么时候说话". 结果按时间顺序列出每段说话的开始与结束时间及说话人编号; 说话人从 `0` 起按首次出现的顺序编号, 只区分不同的声音, 不表示身份. `identify: true` 时另用 [speech.speaker](#p-speaker) 注册的声纹为每位说话人取名.

需要插件声明 `diarization` 功能, 并已安装一个分割模型 (`segment`) 与一个说话人模型 (`speaker`), 缺少任一时失败于 `MODEL_MISSING`. 说话段超过 10000 段时失败于 `LIMIT_EXCEEDED`. 文件, 进度与等待时限等规则见 [离线分析](#离线分析).

已知人数时传入 `speakers` 结果更准; 省略或为 `0` 时由插件按 `threshold` 自动计数.

```js
let result = speech.diarize('./meeting.wav', {
    speakers: 2,
    onProgress: (done, total) => console.log(`${Math.round(done / total * 100)}%`),
});
console.log(`${result.speakers} 位说话人`);
result.segments.forEach(s => console.log(s.speaker, s.startMillis, s.endMillis));
```

## [m] diarizeAsync

### speech.diarizeAsync(file, options?)

**`6.8.0`** **`Async`**

- **file** { [string](dataTypes#string) } - 音频文件路径
- **[ options ]** { [SpeechDiarizeOptions](#speechdiarizeoptions) } - 说话人分离选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [SpeechDiarization](#speechdiarization)

[speech.diarize](#m-diarize) 的异步形态, 参数与结果相同, 可在 UI 线程使用; `onProgress` 同样在脚本线程执行.

```js
speech.diarizeAsync('./meeting.wav', { identify: true }).then((result) => {
    result.names.forEach(n => console.log(n.speaker, n.name === null ? '未认出' : n.name, n.score));
});
```

## [m] detectLanguage

### speech.detectLanguage(file, options?)

**`6.8.0`** **`Non-UI`**

- **file** { [string](dataTypes#string) } - 音频文件路径
- **[ options ]** { [SpeechDetectLanguageOptions](#speechdetectlanguageoptions) } - 语种识别选项
- <ins>**returns**</ins> { [SpeechLanguageDetection](#speechlanguagedetection) } - 语种识别结果

语种识别: 判断音频中说的是哪种语言. 插件先用语音活动检测取出语音, 切成每段至多 30 秒的窗口, 对前 `windows` 个窗口 (默认 3 个) 逐句判断语种, 语音不足 1.25 秒的短句并入相邻的句子. 说话时长最长的语种为结果, 平票时取先出现的. 语言代码为 Whisper 的语言代码, 如 `'zh'`, `'en'`, `'ja'`. `segments` 给出每句的结果, 一段录音里说了几种语言时可以逐句看出来; 一句话中途换语言时只得到其中一种.

3-Macaw Speech 1.3.0 不按句判断: 每个窗口只判一种语言, `segments` 为每个窗口的结果, 结果取窗口数最多的语种, 同一窗口里说了几种语言时只得到其中一种.

需要插件声明 `languageId` 功能, 并已安装语种识别模型 (`langid`). 文件中没有语音时失败于 `AUDIO_TOO_SHORT`. 其他规则见 [离线分析](#离线分析).

```js
let r = speech.detectLanguage('./voice.mp3', { windows: 5 });
console.log(r.language, JSON.stringify(r.candidates));
```

## [m] detectLanguageAsync

### speech.detectLanguageAsync(file, options?)

**`6.8.0`** **`Async`**

- **file** { [string](dataTypes#string) } - 音频文件路径
- **[ options ]** { [SpeechDetectLanguageOptions](#speechdetectlanguageoptions) } - 语种识别选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [SpeechLanguageDetection](#speechlanguagedetection)

[speech.detectLanguage](#m-detectlanguage) 的异步形态, 参数与结果相同, 可在 UI 线程使用.

## [m] tag

### speech.tag(file, options?)

**`6.8.0`** **`Non-UI`**

- **file** { [string](dataTypes#string) } - 音频文件路径
- **[ options ]** { [SpeechTagOptions](#speechtagoptions) } - 音频标签选项
- <ins>**returns**</ins> { [SpeechTagging](#speechtagging) } - 音频标签结果

音频标签: 识别音频中的声音类别, 如人声, 音乐, 动物, 车辆与警报. 插件按 10 秒的窗口打分, 使用 AudioSet 的 527 个英文标签; 每个标签取其得分最高的窗口, 按分数从高到低返回前 `topK` 个 (默认 5 个). `timeline: true` 时另返回每个窗口的前 `topK` 个标签.

需要插件声明 `audioTagging` 功能, 并已安装音频标签模型 (`tagger`). 其他规则见 [离线分析](#离线分析).

```js
let r = speech.tag('./street.wav', { topK: 3, timeline: true });
r.labels.forEach(l => console.log(l.label, l.score, l.startMillis));
r.timeline.forEach(w => console.log(w.startMillis, w.labels.map(l => l.label).join(', ')));
```

## [m] tagAsync

### speech.tagAsync(file, options?)

**`6.8.0`** **`Async`**

- **file** { [string](dataTypes#string) } - 音频文件路径
- **[ options ]** { [SpeechTagOptions](#speechtagoptions) } - 音频标签选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [SpeechTagging](#speechtagging)

[speech.tag](#m-tag) 的异步形态, 参数与结果相同, 可在 UI 线程使用.

## [p+] models

**`6.8.0`**

`speech.models` 管理插件的模型目录与已安装模型. 模型保存在插件中, AutoJs6 只转发调用并为 [importFile](#m-modelsimportfile) 读取脚本指定的归档. 模型对象见 [SpeechModelInfo](speechModelInfoType). 下载, 导入, 删除与设定默认模型需要插件声明 `models` 功能.

## [m] models.list

### speech.models.list(filter?)

**`6.8.0`**

- **[ filter ]** { [SpeechModelFilter](#speechmodelfilter) } - 过滤条件
- <ins>**returns**</ins> { [SpeechModelInfo](speechModelInfoType)[[]](dataTypes#array) } - 模型对象数组, 最多 512 个

列出目录中的模型, 已导入的模型与内置模型. 未给出过滤条件时返回全部.

```js
speech.models.list({ kind: 'asr' }).forEach(m => {
    console.log(m.id, m.installed ? '已安装' : m.sizeBytes, m.license.spdx);
});
```

## [m] models.install

### speech.models.install(id, options?)

**`6.8.0`** **`Non-UI`**

- **id** { [string](dataTypes#string) } - 目录中的模型 ID
- **[ options ]** { [SpeechInstallOptions](#speechinstalloptions) } - 安装选项
- <ins>**returns**</ins> { [SpeechModelInfo](speechModelInfoType) } - 安装后的模型对象

下载并安装目录中的模型, 阻塞当前脚本线程直至完成. 下载不设超时. `onProgress(done, total)` 以字节报告进度, 在脚本线程上执行, `total` 未知时为 `0`; 回调抛出的第一个错误在安装结束后抛出. 模型已安装较旧的版本时, 调用把它更新到目录的最新版本, 失败时旧版不变, 见 [模型更新](#模型更新).

仅限非商业用途或未声明许可的模型需要 `acceptLicense: true`, 见 [模型目录与许可](#模型目录与许可). 失败时的错误代码: `MODEL_MISSING` (目录中没有该 ID), `MODEL_LICENSE_NOT_ACCEPTED`, `MODEL_DOWNLOAD_FAILED`, `MODEL_CHECKSUM_MISMATCH`, `IO_FAILED` (例如空间不足), `SESSION_CANCELLED` (脚本停止或插件界面取消).

```js
speech.models.install('kws.zipformer.zh-en.2025-12-20', {
    onProgress: (done, total) => console.log(done, '/', total),
});
```

## [m] models.installAsync

### speech.models.installAsync(id, options?)

**`6.8.0`** **`Async`**

- **id** { [string](dataTypes#string) } - 目录中的模型 ID
- **[ options ]** { [SpeechInstallOptions](#speechinstalloptions) } - 安装选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [SpeechModelInfo](speechModelInfoType)

[speech.models.install](#m-modelsinstall) 的异步形态, 可在 UI 线程使用; `onProgress` 同样在脚本线程执行.

## [m] models.importFile

### speech.models.importFile(path, options?)

**`6.8.0`** **`Non-UI`**

- **path** { [string](dataTypes#string) } - 脚本可读的模型归档路径
- **[ options ]** { [SpeechImportOptions](#speechimportoptions) } - 导入选项
- <ins>**returns**</ins> { [SpeechModelInfo](speechModelInfoType) } - 导入后的模型对象

从本地归档 (`tar`, `tar.bz2` 或 `zip`) 导入模型, 阻塞当前脚本线程直至完成. `onProgress(done, total)` 以字节报告进度.

- 插件先按大小与 SHA-256 把归档中的文件与目录条目逐一比对. 包含某个目录模型的全部文件时, 以该目录模型的身份登记 (`source` 为 `'catalog'`), 同样受许可规则约束.
- `options.id` 为目录模型 ID 时, 归档必须包含该模型的全部文件, 否则失败于 `MODEL_CHECKSUM_MISMATCH`.
- 与任何目录条目都不一致时, 以 "用户导入" 身份登记 (`source` 为 `'imported'`), 此时 `id`, `kind`, `modelType`, `name` 与 `languages` 都必须给出, 否则失败于 `INVALID_OPTIONS`. 导入模型的 ID 由 2 - 64 个小写字母, 数字, `.`, `_` 或 `-` 组成, 且不能采用目录 ID 的 `<kind>.<名称>` 形式.
- 格式错误, 被截断或不安全的归档失败于 `UNSUPPORTED_FORMAT`; 文件不存在或不可读时失败于 `IO_FAILED`.

## [m] models.remove

### speech.models.remove(id)

**`6.8.0`**

- **id** { [string](dataTypes#string) } - 模型 ID
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否实际删除

删除已安装的模型. 模型正被会话使用时失败于 `SESSION_BUSY`; 内置的 `vad.silero.v5` 不能删除 (`INVALID_OPTIONS`).

## [m] models.setDefault

### speech.models.setDefault(kind, id)

**`6.8.0`**

- **kind** { `'asr'` | `'tts'` | `'kws'` | `'vad'` | `'speaker'` | `'segment'` | `'langid'` | `'tagger'` } - 模型类别, 见 [模型目录与许可](#模型目录与许可)
- **id** { [string](dataTypes#string) } - 已安装的模型 ID
- <ins>**returns**</ins> { [SpeechModelInfo](speechModelInfoType) } - 设定后的模型对象

设定某类的默认模型. 模型须已安装且属于该类别, 否则失败于 `MODEL_MISSING` 或 `INVALID_OPTIONS`. 默认模型对插件界面, 系统 TTS 引擎与系统语音入口同样生效.

## [m] models.getDefault

### speech.models.getDefault(kind)

**`6.8.0`**

- **kind** { `'asr'` | `'tts'` | `'kws'` | `'vad'` | `'speaker'` | `'segment'` | `'langid'` | `'tagger'` } - 模型类别
- <ins>**returns**</ins> { [SpeechModelInfo](speechModelInfoType) | [null](dataTypes#null) } - 该类的默认模型, 没有已安装模型时为 `null`

## [m] models.refreshCatalog

### speech.models.refreshCatalog()

**`6.8.0`** **`Non-UI`**

- <ins>**returns**</ins> {{ version: [number](dataTypes#number); updated: [boolean](dataTypes#boolean) }} - 当前目录版本, 以及本次是否更新了目录

从 AutoJs6-Shared-Assets 下载带签名的模型目录并校验签名, 只接受版本更高的目录. 等待上限为 2 分钟. 下载失败时为 `IO_FAILED`, 签名不符时为 `MODEL_CHECKSUM_MISMATCH`. 没有异步形态.

## [p+] speaker

**`6.8.0`**

`speech.speaker` 管理说话人的声纹: 用录音注册说话人, 判断一段录音是否出自某位说话人 (验证), 以及在全部已注册的说话人中找出最像的一位 (辨认). 需要插件声明 `speaker` 功能 (3-Macaw Speech 1.3.0 及以上, 契约版本 `2`), 并已安装一个说话人模型; 较早的插件以 `PLUGIN_INCOMPATIBLE` 拒绝每个调用, 没有说话人模型时为 `MODEL_MISSING`.

- 声纹只保存在插件的私有存储中, 在插件首页也可以查看与删除. 任何结果都不含声纹向量, 脚本只得到名字, 样本数与分数. 插件最多保存 50 位说话人, 注册第 51 个名字时失败于 `LIMIT_EXCEEDED`.
- 录音的格式要求与 [speech.recognize](#m-recognize) 的文件路径相同; 每段不超过 60 秒 (`LIMIT_EXCEEDED`), 其中的有效语音不足 1 秒时失败于 `AUDIO_TOO_SHORT`. 每段 2 - 10 秒为宜.
- 说话人名字去掉首尾空白后为 1 - 64 个字符 (超出为 `LIMIT_EXCEEDED`), 不能为空或含控制字符 (包括换行, `INVALID_OPTIONS`), 按原样比较.
- `score` 为录音与声纹的余弦相似度, 保留四位小数, 不低于阈值即视为匹配. `threshold` 取 0 - 1; 省略时使用插件按说话人模型给出的默认值 (3-Macaw Speech 1.3.0 的默认说话人模型为 `0.5`).
- 同步形态阻塞当前脚本线程, 不能在 UI 线程调用; `Async` 形态返回 Promise, 错误以 [SpeechError](#c-speecherror) 拒绝, 回调在脚本线程执行.

参阅示例代码 "3-Macaw Speech > 说话人识别".

## [m] speaker.enroll

### speech.speaker.enroll(name, files, options?)

**`6.8.0`** **`Non-UI`**

- **name** { [string](dataTypes#string) } - 说话人名字
- **files** { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) } - 录音文件路径, 或 1 - 10 个路径的数组
- **[ options ]** {{ replace?: [boolean](dataTypes#boolean); model?: [string](dataTypes#string) }} - 注册选项
- <ins>**returns**</ins> {{ name: [string](dataTypes#string); samples: [number](dataTypes#number); durationMillis: [number](dataTypes#number); modelId: [string](dataTypes#string) }} - 说话人名字, 累计样本数, 本次用到的语音时长 (毫秒), 以及声纹所用的说话人模型

用录音注册说话人, 多段录音的声纹取平均. 名字已注册时, 新样本并入原有的声纹; `replace: true` 先丢弃原有的样本. `model` 指定说话人模型, 省略时使用默认的说话人模型; 已注册的名字只能并入同一模型的样本, 换用其他模型时须同时给出 `replace: true`, 否则失败于 `INVALID_OPTIONS`. 文件数超过 10 个时失败于 `LIMIT_EXCEEDED`.

```js
let enrolled = speech.speaker.enroll('小明', ['./own-1.wav', './own-2.wav'], { replace: true });
console.log(enrolled.name, enrolled.samples, enrolled.durationMillis);
```

## [m] speaker.enrollAsync

### speech.speaker.enrollAsync(name, files, options?)

**`6.8.0`** **`Async`**

- **name** { [string](dataTypes#string) } - 说话人名字
- **files** { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) } - 录音文件路径, 或 1 - 10 个路径的数组
- **[ options ]** {{ replace?: [boolean](dataTypes#boolean); model?: [string](dataTypes#string) }} - 注册选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值与 [speech.speaker.enroll](#m-speakerenroll) 的返回值相同

[speech.speaker.enroll](#m-speakerenroll) 的异步形态, 参数与结果相同, 可在 UI 线程使用.

## [m] speaker.verify

### speech.speaker.verify(name, file, options?)

**`6.8.0`** **`Non-UI`**

- **name** { [string](dataTypes#string) } - 已注册的说话人名字
- **file** { [string](dataTypes#string) } - 待验证的录音文件路径
- **[ options ]** {{ threshold?: [number](dataTypes#number) }} - 验证选项
- <ins>**returns**</ins> {{ name: [string](dataTypes#string); score: [number](dataTypes#number); matched: [boolean](dataTypes#boolean); threshold: [number](dataTypes#number) }} - 说话人名字, 相似度分数, 是否匹配, 以及实际使用的阈值

判断录音是否出自该说话人. 名字未注册时失败于 `SPEAKER_NOT_FOUND`.

```js
let r = speech.speaker.verify('小明', './test.wav', { threshold: 0.55 });
console.log(r.matched ? '是本人' : '不是本人', r.score);
```

## [m] speaker.verifyAsync

### speech.speaker.verifyAsync(name, file, options?)

**`6.8.0`** **`Async`**

- **name** { [string](dataTypes#string) } - 已注册的说话人名字
- **file** { [string](dataTypes#string) } - 待验证的录音文件路径
- **[ options ]** {{ threshold?: [number](dataTypes#number) }} - 验证选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值与 [speech.speaker.verify](#m-speakerverify) 的返回值相同

[speech.speaker.verify](#m-speakerverify) 的异步形态, 参数与结果相同, 可在 UI 线程使用.

## [m] speaker.identify

### speech.speaker.identify(file, options?)

**`6.8.0`** **`Non-UI`**

- **file** { [string](dataTypes#string) } - 待辨认的录音文件路径
- **[ options ]** {{ threshold?: [number](dataTypes#number); topK?: [number](dataTypes#number) }} - 辨认选项, `topK` 为 1 - 10 的整数, 默认为 `3`
- <ins>**returns**</ins> {{ name: [string](dataTypes#string) | [null](dataTypes#null); score: [number](dataTypes#number); matched: [boolean](dataTypes#boolean); threshold: [number](dataTypes#number); candidates: {{ name: [string](dataTypes#string); score: [number](dataTypes#number) }}[] }} - 辨认结果

在用当前说话人模型注册的全部说话人中找出与录音最像的一位. `candidates` 按分数从高到低列出至多 `topK` 位说话人; 最高分不低于阈值时 `name` 为该说话人且 `matched` 为 `true`, 否则 `name` 为 `null`.

```js
let who = speech.speaker.identify('./test.wav', { topK: 3 });
console.log(who.name === null ? '不是已注册的人' : who.name, JSON.stringify(who.candidates));
```

## [m] speaker.identifyAsync

### speech.speaker.identifyAsync(file, options?)

**`6.8.0`** **`Async`**

- **file** { [string](dataTypes#string) } - 待辨认的录音文件路径
- **[ options ]** {{ threshold?: [number](dataTypes#number); topK?: [number](dataTypes#number) }} - 辨认选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值与 [speech.speaker.identify](#m-speakeridentify) 的返回值相同

[speech.speaker.identify](#m-speakeridentify) 的异步形态, 参数与结果相同, 可在 UI 线程使用.

## [m] speaker.list

### speech.speaker.list()

**`6.8.0`**

- <ins>**returns**</ins> {{ name: [string](dataTypes#string); samples: [number](dataTypes#number); updatedAt: [number](dataTypes#number); modelId: [string](dataTypes#string) }}[] - 按名字排序的已注册说话人, `updatedAt` 为最后一次注册的时间戳 (毫秒)

列出全部已注册的说话人, 包括在插件首页注册的. 没有异步形态.

## [m] speaker.remove

### speech.speaker.remove(name)

**`6.8.0`**

- **name** { [string](dataTypes#string) } - 说话人名字
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否实际删除了声纹

删除该说话人的声纹. 名字未注册时返回 `false`. 没有异步形态.

## [C] SpeechError

### new speech.SpeechError(message?, code?)

**`6.8.0`**

- **[ message = `''` ]** { [string](dataTypes#string) } - 错误消息
- **[ code = `'INTERNAL'` ]** { [string](dataTypes#string) } - 错误代码
- <ins>**returns**</ins> { [SpeechError](#c-speecherror) }

语音模块抛出的所有错误, Promise 的拒绝值, 以及会话 `error` 事件的参数, 都是 `name` 为 `'SpeechError'` 的 JavaScript [Error](exceptions#error-对象), 可用 `instanceof speech.SpeechError` 判断, 用 `code` 区分原因. `message` 与 `code` 会转换为字符串; `message` 不可枚举, `JSON.stringify` 只输出 `code`. `toString()` 返回形如 `SpeechError [MODEL_MISSING]: ...` 的文本. AutoJs6 抛出的错误可能另带不可枚举的 `javaException` 属性 (原始 Java 异常). 不使用 `new` 调用也会构造新对象.

```js
try {
    speech.recognize('./record.wav', { model: 'asr.zipformer-streaming.en.2023-06-26.int8' });
} catch (e) {
    if (e instanceof speech.SpeechError && e.code === 'MODEL_MISSING') {
        speech.models.install('asr.zipformer-streaming.en.2023-06-26.int8');
    } else {
        throw e;
    }
}
```

## 选项 (Options)

### SpeechListenOptions

[speech.listen](#m-listen) 的选项, 也是 [SpeechWakeOptions](#speechwakeoptions) 中 `thenListen` 对象的形态.

- **[ model ]** { [string](dataTypes#string) } - 识别模型 ID, 默认为默认识别模型
- **[ language ]** { [string](dataTypes#string) } - 语言提示, 如 `'zh'`, `'en'`, `'ja'`, `'ko'`, `'yue'`; 只有 SenseVoice 使用它, 其他模型忽略; SenseVoice 不认识的语言改为自动识别并给出警告
- **[ source = `'mic'` ]** { `'mic'` | `'external'` } - 音频来源, 麦克风或脚本输入的 PCM
- **[ sampleRate = `16000` ]** { [number](dataTypes#number) } - 外部 PCM 的采样率, 只接受 `16000`
- **[ vad = `true` ]** { [boolean](dataTypes#boolean) } - 是否启用语音活动检测; 流式模型只把语音部分送入识别器, 离线模型按语音段切分
- **[ silenceEndMillis = `1200` ]** { [number](dataTypes#number) } - 结束一句话的静音时长, 范围 `1..60000` 毫秒
- **[ maxDurationMillis = `300000` ]** { [number](dataTypes#number) } - 会话时长上限, 正整数, 最大 `1800000` (30 分钟, 超出为 `LIMIT_EXCEEDED`)
- **[ timeoutMillis = `15000` ]** { [number](dataTypes#number) } - 没有语音或新文字时自动结束的时长, 范围 `0..1800000`, `0` 表示不限
- **[ hotwords = `[]` ]** { [string](dataTypes#string)[[]](dataTypes#array) } - 热词, 去重后最多 200 个, 每个不超过 128 个字符
- **[ punctuation = `true` ]** { [boolean](dataTypes#boolean) } - 是否加标点: 模型自带标点 (SenseVoice) 时保留; 流式模型的结果由插件中已安装的标点模型补上标点 (3-Macaw Speech 1.2.0 起, 中文与英文, 英文同时恢复大小写), 没有覆盖该语言的标点模型时保持原样; `false` 去掉所有标点

`timeoutMillis` 与 `maxDurationMillis` 按插件已处理的音频时长计算, 而不是墙钟时间: 麦克风会话按实时计算, 外部 PCM 会话按已输入的音频计算 (暂停输入时不会超时). `timeoutMillis` 从最近一次语音或新文字起算. 到达时会话以 `end` 结束, 原因分别为 `'timeout'` 与 `'maxDuration'`. 插件在静音达到 `silenceEndMillis` 或连续说话满 20 秒时结束一句话.

### SpeechRecognizeOptions

[speech.recognize](#m-recognize) 与 [speech.recognizeAsync](#m-recognizeasync) 的选项.

- **[ model ]** { [string](dataTypes#string) } - 识别模型 ID, 默认为默认识别模型
- **[ language ]** { [string](dataTypes#string) } - 语言提示, 同 [SpeechListenOptions](#speechlistenoptions)
- **[ hotwords = `[]` ]** { [string](dataTypes#string)[[]](dataTypes#array) } - 热词, 最多 200 个
- **[ punctuation = `true` ]** { [boolean](dataTypes#boolean) } - 是否加标点, 同 [SpeechListenOptions](#speechlistenoptions)
- **[ vad = `true` ]** { [boolean](dataTypes#boolean) } - 是否先按语音活动检测切段
- **[ sampleRate = `16000` ]** { [number](dataTypes#number) } - PCM 数据的采样率, 范围 `8000..192000`; 文件识别以文件自身的采样率为准, 忽略此项

### SpeechVadOptions

[speech.detectVoice](#m-detectvoice) 的选项. 省略的阈值与时长使用模型默认值.

- **[ model ]** { [string](dataTypes#string) } - 语音活动检测模型 ID, 默认为 `vad.silero.v5`
- **[ threshold ]** { [number](dataTypes#number) } - 判定为语音的阈值, 范围 `0..1`
- **[ minSpeechMillis ]** { [number](dataTypes#number) } - 最短语音段, 范围 `0..1800000` 毫秒
- **[ minSilenceMillis ]** { [number](dataTypes#number) } - 分隔语音段的最短静音, 范围 `0..1800000` 毫秒
- **[ sampleRate = `16000` ]** { [number](dataTypes#number) } - PCM 数据的采样率, 范围 `8000..192000`

### SpeechKeyword

唤醒关键词的对象形式.

- **keyword** { [string](dataTypes#string) } - 关键词原文或模型 token, 非空白, 最多 128 个字符
- **[ boost ]** { [number](dataTypes#number) } - 关键词增益, 范围 `-100..100`
- **[ threshold ]** { [number](dataTypes#number) } - 触发阈值, 范围 `0..1`, 默认使用模型的阈值; 越低越容易触发

### SpeechWakeOptions

[speech.wake](#m-wake) 的选项.

- **[ model ]** { [string](dataTypes#string) } - 唤醒词模型 ID, 默认为默认唤醒词模型
- **[ minIntervalMillis = `1500` ]** { [number](dataTypes#number) } - 两次命中之间的最小间隔, 范围 `0..600000` 毫秒
- **[ thenListen ]** { [boolean](dataTypes#boolean) | [SpeechListenOptions](#speechlistenoptions) } - 命中后自动转入听写; `true` 使用默认听写选项, 对象形式的 `source` 只能为 `'mic'`

### SpeechSynthesizeOptions

[speech.synthesize](#m-synthesize) 与 [speech.synthesizeAsync](#m-synthesizeasync) 的选项.

- **[ model ]** { [string](dataTypes#string) } - 合成模型 ID, 默认为默认合成模型
- **[ speaker ]** { [number](dataTypes#number) | [string](dataTypes#string) } - 说话人编号, 或模型 `speakers.txt` 中的说话人名称 (如 AISHELL-3 的 `'SSB0005'`); 默认为模型的默认说话人
- **[ speed = `1` ]** { [number](dataTypes#number) } - 语速, 范围 `0.5..2`
- **[ format = `'wav'` ]** { `'wav'` } - 输出格式, 只支持 WAV

### SpeechSpeakOptions

[speech.speak](#m-speak) 的选项: 以下三项, 加上 [TtsOptions](tts#ttsoptions) 中除 `engine`, `voice`, `rate` (及别名 `speechRate`) 以外的选项.

- **[ model ]** { [string](dataTypes#string) } - 合成模型 ID; 省略时由引擎按文本语言选择语音
- **[ speaker ]** { [number](dataTypes#number) | [string](dataTypes#string) } - 说话人编号或名称, 需要同时给出 `model`, 不能含 `/`
- **[ speed ]** { [number](dataTypes#number) } - 语速, 范围 `0.5..2`, 转为 `tts` 的 `rate`

### SpeechModelFilter

[speech.models.list](#m-modelslist) 的过滤条件.

- **[ kind ]** { `'asr'` | `'tts'` | `'kws'` | `'vad'` | `'speaker'` | `'segment'` | `'langid'` | `'tagger'` } - 模型类别
- **[ language ]** { [string](dataTypes#string) } - 模型支持的语言
- **[ installed ]** { [boolean](dataTypes#boolean) } - 只列出已安装 (`true`) 或未安装 (`false`) 的模型

### SpeechInstallOptions

[speech.models.install](#m-modelsinstall) 与 [speech.models.installAsync](#m-modelsinstallasync) 的选项.

- **[ acceptLicense = `false` ]** { [boolean](dataTypes#boolean) } - 接受仅限非商业用途或未声明许可的模型的许可
- **[ onProgress ]** { [Function](dataTypes#function) } - 进度回调 `(done: number, total: number) => void`, 单位为字节, 返回值被忽略

### SpeechImportOptions

[speech.models.importFile](#m-modelsimportfile) 的选项. 与目录条目一致的归档只需 `acceptLicense` 与 `onProgress`.

- **[ id ]** { [string](dataTypes#string) } - 目录模型 ID (要求归档包含该模型), 或导入模型的新 ID
- **[ kind ]** { `'asr'` | `'kws'` | `'tts'` } - 导入模型的类别, 以 "用户导入" 身份登记时只能是这三类, 其他值失败于 `INVALID_OPTIONS`. `vad`, `speaker`, `segment`, `langid` 与 `tagger` 类只有目录模型: 经 [speech.models.install](#m-modelsinstall) 下载, 或导入与目录条目一致的归档
- **[ modelType ]** { [string](dataTypes#string) } - 导入模型的类型, 如 `'online-transducer'`, `'sense-voice'`, `'offline-transducer'`, `'kws-transducer'`, `'vits'`, `'matcha'`, `'kokoro'`
- **[ name ]** { [string](dataTypes#string) } - 显示名称, 最多 128 个字符
- **[ languages ]** { [string](dataTypes#string)[[]](dataTypes#array) } - 支持的语言, 1 - 32 个语言标签
- **[ acceptLicense = `false` ]** { [boolean](dataTypes#boolean) } - 同 [SpeechInstallOptions](#speechinstalloptions)
- **[ onProgress ]** { [Function](dataTypes#function) } - 进度回调, 单位为字节

### SpeechDiarizeOptions

[speech.diarize](#m-diarize) 与 [speech.diarizeAsync](#m-diarizeasync) 的选项.

- **[ model ]** { [string](dataTypes#string) } - 分割模型 ID (`segment` 类), 默认为默认分割模型
- **[ speakerModel ]** { [string](dataTypes#string) } - 说话人模型 ID (`speaker` 类), 默认为默认说话人模型
- **[ speakers = `0` ]** { [number](dataTypes#number) } - 已知的说话人数, `0..20` 的整数; `0` 表示由插件自动计数
- **[ threshold ]** { [number](dataTypes#number) } - 自动计数时的聚类阈值, 范围 `0..2`, 越大越容易把相近的声音归为同一位说话人; 默认使用插件按说话人模型给出的值 (3-Macaw Speech 1.3.0 的默认说话人模型为 `0.85`)
- **[ identify = `false` ]** { [boolean](dataTypes#boolean) } - 是否用 [speech.speaker](#p-speaker) 注册的声纹为每位说话人取名, 结果见 [SpeechDiarization](#speechdiarization) 的 `names`
- **[ onProgress ]** { [Function](dataTypes#function) } - 进度回调 `(done: number, total: number) => void`, 单位为音频毫秒, 返回值被忽略

### SpeechDetectLanguageOptions

[speech.detectLanguage](#m-detectlanguage) 与 [speech.detectLanguageAsync](#m-detectlanguageasync) 的选项.

- **[ model ]** { [string](dataTypes#string) } - 语种识别模型 ID (`langid` 类), 默认为默认语种识别模型
- **[ windows = `3` ]** { [number](dataTypes#number) } - 判断的语音窗口数, `1..60` 的整数; 每个窗口至多 30 秒语音, 60 个窗口可覆盖 30 分钟
- **[ onProgress ]** { [Function](dataTypes#function) } - 进度回调, 单位为音频毫秒

### SpeechTagOptions

[speech.tag](#m-tag) 与 [speech.tagAsync](#m-tagasync) 的选项.

- **[ model ]** { [string](dataTypes#string) } - 音频标签模型 ID (`tagger` 类), 默认为默认音频标签模型
- **[ topK = `5` ]** { [number](dataTypes#number) } - 返回的标签数, `1..20` 的整数; 也是 `timeline` 中每个窗口的标签数
- **[ timeline = `false` ]** { [boolean](dataTypes#boolean) } - 是否另返回每个 10 秒窗口的标签
- **[ onProgress ]** { [Function](dataTypes#function) } - 进度回调, 单位为音频毫秒

## 返回对象

### SpeechCapabilities

[speech.capabilities](#m-capabilities) 的返回值.

- **contractVersion** { [number](dataTypes#number) } - 语音插件契约版本, 3-Macaw Speech 1.2.0 及更早为 `1`, 1.3.0 起为 `2`
- **features** { [string](dataTypes#string)[[]](dataTypes#array) } - 插件实现的功能, 取自 `asr` (文件识别与外部 PCM 会话), `asrStreaming` (麦克风听写与 `thenListen`), `vad` (语音活动检测), `kws` (唤醒词), `tts` (合成到文件), `ttsSystemEngine` (系统 TTS 引擎), `models` (模型管理), `audioDecode` (WAV 以外的音频文件, 3-Macaw Speech 1.2.0 起), `speaker` ([说话人识别](#p-speaker), 3-Macaw Speech 1.3.0 起), `diarization` ([说话人分离](#m-diarize), 1.3.0 起), `languageId` ([语种识别](#m-detectlanguage), 1.3.0 起), `audioTagging` ([音频标签](#m-tag), 1.3.0 起)
- **catalogVersion** { [number](dataTypes#number) } - 插件当前的模型目录版本
- **engineName** { [string](dataTypes#string) | [null](dataTypes#null) } - 语音运行时名称, 如 `'sherpa-onnx'`
- **engineVersion** { [string](dataTypes#string) | [null](dataTypes#null) } - 语音运行时版本
- **ttsEnginePackage** { [string](dataTypes#string) | [null](dataTypes#null) } - 系统 TTS 引擎所在的包名
- **microphoneGranted** { [boolean](dataTypes#boolean) | [null](dataTypes#null) } - 插件当前是否持有麦克风权限, 实时查询失败时为 `null`
- **packageName** { [string](dataTypes#string) } - 插件包名
- **versionName** { [string](dataTypes#string) | [null](dataTypes#null) } - 插件版本名称
- **versionCode** { [number](dataTypes#number) } - 插件版本号

应根据 `features` 的实际内容判断能力, 不要假定所有功能都存在.

### SpeechVoiceSegments

[speech.detectVoice](#m-detectvoice) 的返回值.

- **segments** {{ startMillis: [number](dataTypes#number); endMillis: [number](dataTypes#number) }}[] - 语音段, 时间相对音频开头, 单位为毫秒
- **durationMillis** { [number](dataTypes#number) } - 音频总时长, 单位为毫秒

### SpeechSynthesisResult

[speech.synthesize](#m-synthesize) 与 [speech.synthesizeAsync](#m-synthesizeasync) 的结果.

- **path** { [string](dataTypes#string) } - 输出文件的绝对路径
- **sampleRate** { [number](dataTypes#number) } - 采样率, 与模型一致
- **durationMillis** { [number](dataTypes#number) } - 音频时长, 单位为毫秒
- **modelId** { [string](dataTypes#string) } - 实际使用的模型
- **speakerId** { [number](dataTypes#number) } - 实际使用的说话人编号
- **sizeBytes** { [number](dataTypes#number) } - 输出文件的字节数
- **warnings** {{ code: [string](dataTypes#string); message: [string](dataTypes#string) }}[] - 非致命问题, 没有时为空数组

### SpeechDiarization

[speech.diarize](#m-diarize) 与 [speech.diarizeAsync](#m-diarizeasync) 的结果.

- **segments** {{ startMillis: [number](dataTypes#number); endMillis: [number](dataTypes#number); speaker: [number](dataTypes#number) }}[] - 按时间顺序排列的说话段, `speaker` 为说话人编号 (从 `0` 起, 按首次出现的顺序)
- **speakers** { [number](dataTypes#number) } - 说话人数
- **durationMillis** { [number](dataTypes#number) } - 音频时长, 单位为毫秒
- **modelId** { [string](dataTypes#string) } - 实际使用的分割模型
- **names** {{ speaker: [number](dataTypes#number); name: [string](dataTypes#string) | [null](dataTypes#null); score: [number](dataTypes#number) | [null](dataTypes#null) }}[] | [undefined](dataTypes#undefined) - 只在 `identify: true` 时存在, 每位说话人一项. `name` 为声纹最接近的已注册说话人, 分数低于该说话人模型的阈值时为 `null`; `score` 为与该声纹的余弦相似度, 无法比较时 (例如该说话人的语音不足 1 秒) 为 `null`

### SpeechLanguageDetection

[speech.detectLanguage](#m-detectlanguage) 与 [speech.detectLanguageAsync](#m-detectlanguageasync) 的结果.

- **language** { [string](dataTypes#string) } - 说话时长最长的语种, 平票时取先出现的
- **candidates** {{ language: [string](dataTypes#string); score: [number](dataTypes#number) }}[] - 听到的全部语种, 按时长从多到少排列; `score` 为该语种占说话时长的比例 (`0..1`)
- **segments** {{ startMillis: [number](dataTypes#number); endMillis: [number](dataTypes#number); language: [string](dataTypes#string) }}[] - 每句的时间与语种; 并入短句的句子其时间包含句间的静音. 3-Macaw Speech 1.3.0 为每个窗口一项
- **durationMillis** { [number](dataTypes#number) } - 音频时长, 单位为毫秒
- **modelId** { [string](dataTypes#string) } - 实际使用的模型

### SpeechTagging

[speech.tag](#m-tag) 与 [speech.tagAsync](#m-tagasync) 的结果.

- **labels** {{ label: [string](dataTypes#string); mid: [string](dataTypes#string); score: [number](dataTypes#number); startMillis: [number](dataTypes#number); endMillis: [number](dataTypes#number) }}[] - 得分最高的前 `topK` 个标签, 按分数从高到低排列. `label` 为 AudioSet 的英文标签 (如 `'Speech'`, `'Music'`), `mid` 为 AudioSet 本体 ID (如 `'/m/09x0r'`), `score` 为 `0..1` 的概率, 时间为该标签得分最高的窗口
- **durationMillis** { [number](dataTypes#number) } - 音频时长, 单位为毫秒
- **modelId** { [string](dataTypes#string) } - 实际使用的模型
- **timeline** {{ startMillis: [number](dataTypes#number); endMillis: [number](dataTypes#number); labels: {{ label: [string](dataTypes#string); mid: [string](dataTypes#string); score: [number](dataTypes#number) }}[] }}[] | [undefined](dataTypes#undefined) - 只在 `timeline: true` 时存在, 每个 10 秒窗口一项, 含该窗口得分最高的前 `topK` 个标签

## 错误代码

| 代码 | 含义 |
| --- | --- |
| `PLUGIN_UNAVAILABLE` | 未安装 3-Macaw Speech, 或插件不应答 |
| `PLUGIN_DISABLED` | 插件已在插件中心停用或未授权 |
| `PLUGIN_INCOMPATIBLE` | 插件版本或契约版本不兼容, 或插件未声明该调用所需的功能 |
| `PERMISSION_DENIED` | 插件没有麦克风权限 (打开会话时抛出); 作为会话的 `warning` 时表示收到的是静音或麦克风前台服务被拒绝, 会话继续 |
| `MODEL_MISSING` | 指定的模型未安装或不存在, 或该类没有已安装模型 |
| `MODEL_DOWNLOAD_FAILED` | 模型下载失败 (镜像与上游均失败) |
| `MODEL_CHECKSUM_MISMATCH` | 下载或导入的文件校验失败, 或目录签名不符 |
| `MODEL_LICENSE_NOT_ACCEPTED` | 模型须先接受许可 |
| `INVALID_OPTIONS` | 参数, 选项或模型类别不正确, 或同步形态在 UI 线程调用 |
| `UNSUPPORTED_FORMAT` | 音频格式不受支持 (插件只读 WAV, 文件没有音轨, 设备缺少解码器或文件损坏), 或归档格式不受支持 |
| `LIMIT_EXCEEDED` | 超过契约上限; 也用于脚本未及时消费会话事件 |
| `SESSION_BUSY` | 麦克风正被另一个会话占用, 外部 PCM 会话已达上限, 或模型正被使用而无法删除 |
| `SESSION_CLOSED` | 会话已结束, 插件进程退出, 或脚本正在退出 |
| `SESSION_CANCELLED` | 操作被取消 |
| `ENGINE_FAILED` | 识别或合成引擎失败 |
| `IO_FAILED` | 文件读写失败或下载出错 |
| `TIMEOUT` | 插件未在时限内应答 |
| `SPEAKER_NOT_FOUND` | 说话人名字未注册 (契约版本 `2`) |
| `AUDIO_TOO_SHORT` | 说话人录音中的有效语音不足 1 秒, 或语种识别的文件中没有语音 (契约版本 `2`) |
| `INTERNAL` | 其他内部错误 |

## 限制

| 项目 | 上限 |
| --- | --- |
| 麦克风会话 (听写或唤醒), 整个插件 | 1 |
| 外部 PCM 会话, 每个调用方应用 | 4 |
| 一次 `feed` 的字节数 | 1 MiB |
| 识别, 检测或分析的音频文件 | 200 MiB, 30 分钟 |
| 会话时长 (`maxDurationMillis`) | 30 分钟 |
| 合成文本 | 8000 个字符 (UTF-16 单元) |
| 合成输出文件 | 100 MiB |
| 唤醒会话的关键词 | 50 个 |
| 一次说话人分离的说话段 | 10000 段 |
| 说话人分离的 `speakers` | 20 |
| 语种识别的 `windows` | 60 个窗口 |
| 音频标签的 `topK` | 20 个 |
| 热词 | 200 个 |
| 关键词, 热词, 模型 ID 或说话人的长度 | 128 个字符 |
| 一次列出的模型 | 512 个 |

## 插件的系统入口

以下入口由 3-Macaw Speech 提供给 Android 系统与其他应用, 不是脚本 API, 在此一并说明以便脚本作者与集成方了解它们与脚本会话的关系. 它们与脚本共用插件唯一的麦克风: 脚本的听写会话占用麦克风时, 这些入口显示 "麦克风正被占用" 的说明; 它们收音时, 脚本打开麦克风会话失败于 `SESSION_BUSY`; 唤醒会话则被临时接管 (见 [唤醒会话的临时接管](#唤醒会话的临时接管)).

### 系统 TTS 引擎

插件把已安装的合成模型注册为 Android 系统 TTS 引擎, 可在系统的文字转语音设置中选为首选引擎, 也可以由 AutoJs6 的 [tts](tts) 模块及其他应用指定使用. 语音名称与选择规则见 [使用 3-Macaw Speech 引擎](tts#使用-3-macaw-speech-引擎).

### 系统语音输入

插件导出一个应答 `android.speech.action.RECOGNIZE_SPEECH` 的界面, 其他应用 (例如 3-Stove Agent 的麦克风按钮) 发出语音输入请求时, 在底部弹层中说一句话, 识别出的文字直接交回该应用. 该入口不受插件权限保护, 任何应用都可以调用; 它只返回识别出的文字, 不返回音频, 不修改模型或设置, 也不启动下载.

- 第一句话结束 (静音端点, 或点按 "停止") 即返回 `RESULT_OK`, `RecognizerIntent.EXTRA_RESULTS` 中恰好 1 条文字, 不返回置信度.
- 静音时长取插件设置中的端点灵敏度; 调用方给出 `EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS` 时优先使用 (限制在 300 - 5000 毫秒). 开始收音后 8 秒内没有语音返回 `RESULT_NO_MATCH`, 一句话最长 60 秒.
- `EXTRA_LANGUAGE` 只用于选择识别模型: 默认识别模型覆盖该语言时使用它, 否则使用覆盖该语言的其他已安装识别模型 (目录推荐的优先, 覆盖五种以上语言的模型排在其他模型之后), 都不覆盖时仍用默认识别模型. SenseVoice 与八语流式模型始终自动识别语种.
- `EXTRA_PROMPT` 显示为弹层标题; `EXTRA_BIASING_STRINGS` (Android 13 及以上) 作为热词交给支持热词的模型; `EXTRA_MAX_RESULTS` 被接受但只返回 1 条; 其他 extra 被忽略.
- 返回码: 用户取消为 `RESULT_CANCELED`; 没有语音或结果为空为 `RESULT_NO_MATCH`; 麦克风权限被拒绝, 麦克风被占用或录音失败为 `RESULT_AUDIO_ERROR`; 没有识别模型, 模型加载或引擎失败为 `RESULT_SERVER_ERROR`.
- 插件设置 "识别" 组中的 "作为系统语音输入" 开关可停用该入口. 设备上还有其他语音输入应用时, Android 会让用户选择.

### 数字助理

用户可以把 3-Macaw Speech 选为默认数字助理应用: 打开插件设置, 点按 "识别" 组中的 "数字助理" (该行同时显示插件当前是否为默认助理), 在系统打开的设置页中选择 3-Macaw Speech (各系统的页面名称略有不同). 插件不能代替用户做此选择.

- 之后长按电源键或 Home 键, 或使用助理手势, 即打开底部弹层听写; 部分厂商的电源键或手势可能只能唤起自家助理. 听写的结束, 模型选择与引导规则与 [系统语音输入](#系统语音输入) 相同.
- 听写结束后弹层显示可编辑的识别文字, 以及每个接收语音指令的应用 (见 [语音指令入口](#语音指令入口)) 的按钮, "复制文本", "重说" 与 "关闭". 只有用户点按某个应用按钮时才发送, 没有默认目标, 也不根据说话内容自动选择. 没有任何接收应用时, 助理仍可用于听写并复制.
- 不读取屏幕内容: 系统不会把当前应用的界面结构或截图交给插件, 除识别文字外不向目标附带任何内容.
- 平时不在后台收音: 只在弹层显示时录音, 没有常驻通知与常亮的麦克风指示灯. 插件不保存识别历史.
- 锁屏时可以开始听写; 点按应用按钮或 "复制文本" 时先请求解锁, 解锁成功后才发送或复制, 取消解锁则留在弹层.

### 语音指令入口

希望接收数字助理识别文字的应用, 导出一个应答 `org.autojs.plugin.action.VOICE_COMMAND` 的 Activity:

```xml
<activity
    android:name=".VoiceCommandActivity"
    android:exported="true"
    android:label="@string/voice_command_label">
    <intent-filter>
        <action android:name="org.autojs.plugin.action.VOICE_COMMAND" />
        <category android:name="android.intent.category.DEFAULT" />
    </intent-filter>
</activity>
```

- 插件以 `queryIntentActivities` 发现已安装且已启用的接收方 (不按包名写死), 按钮文字与图标取该 Activity 的 label 与 icon, 按 label 排序. 3-Macaw Speech 自身不应答该 action.
- 发送时使用显式组件 (包名与类名) 与 `FLAG_ACTIVITY_NEW_TASK`. extras 只有两项: `android.intent.extra.TEXT` (`Intent.EXTRA_TEXT`, 识别文字, 必有, 已去除首尾空白, 最多 16384 个字符) 与 `org.autojs.plugin.extra.VOICE_LANGUAGE` (所用识别模型检测到的语言, 或模型唯一支持的语言, BCP 47 标签, 可缺).
- 该 action 不受任何权限保护, 与系统分享入口同级, 任何应用都能发出同样的 Intent. 接收方必须把文字当作不可信输入, 自行决定安全语义. 例如 3-Stove Agent 只把文字放入可审阅的任务草稿, 由用户点按开始后才执行.

```kotlin
val text = intent.getStringExtra(Intent.EXTRA_TEXT)?.trim().orEmpty()
val language = intent.getStringExtra("org.autojs.plugin.extra.VOICE_LANGUAGE")
```

### 系统识别服务

插件还提供系统语音识别服务 (`android.speech.RecognitionService`), 组件名为 `io.github.supermonster003.autojs6.plugin.three.macaw.speech/.recognition.MacawRecognitionService`. 其他应用可以在 `SpeechRecognizer.createSpeechRecognizer(context, component)` 中直接指定它.

不指定组件的 `SpeechRecognizer` 使用系统设置的默认识别服务, 它是否随数字助理切换取决于 Android 版本: Android 11 及以下把 3-Macaw Speech 选为数字助理时, 一般会一并设为默认识别服务; Android 12 起需要在系统的语音输入设置中另行选择 (部分手机没有这项设置).

- 支持 `startListening`, `stopListening` 与 `cancel`. 回调顺序为 `onReadyForSpeech`, `onBeginningOfSpeech`, 调用方要求时的部分结果, `onEndOfSpeech`, 然后恰好一次 `onResults` (1 条结果) 或 `onError`; 取消后不再回调. `onRmsChanged` 按语音活动状态近似.
- 语言与热词的处理同 [系统语音输入](#系统语音输入).
- 错误码: 调用方或插件没有麦克风权限为 `ERROR_INSUFFICIENT_PERMISSIONS`, 麦克风被听写占用为 `ERROR_RECOGNIZER_BUSY`, 录音失败为 `ERROR_AUDIO`, Intent 中的选项无效或调用方自带音频 (`EXTRA_AUDIO_SOURCE`) 为 `ERROR_CLIENT`, 没有模型及其他失败为 `ERROR_SERVER`, 超时前没有语音为 `ERROR_SPEECH_TIMEOUT`, 其他没有文字的结束为 `ERROR_NO_MATCH`.
- 调用方自身须持有麦克风权限; Android 12 及以上录音归属于调用方.
- "作为系统语音输入" 开关不影响识别服务.

## 示例 (Examples)

### 听写到文件

```js
let session = speech.listen({ silenceEndMillis: 1500, maxDurationMillis: 60000 });
session.on('final', e => files.append('./dictation.txt', e.text + '\n'));
session.on('error', e => console.error(e.code, e.message));
session.on('end', e => toast(`听写结束 (${e.reason})`));
```

### 唤醒词后交给 3-Stove Agent

```js
let wake = speech.wake(['小六小六'], { thenListen: { silenceEndMillis: 1200 } });
wake.on('wake', e => {
    e.listen.on('final', r => {
        console.log('指令:', r.text);
        ai.agent.run(r.text);
    });
});
```

### 识别脚本生成的 PCM

```js
// pcm 为 16 kHz 单声道 PCM16 LE 的 Int16Array, 每次 feed 最多 1 MiB.
let session = speech.listen({ source: 'external' });
session.on('ready', () => {
    session.feed(pcm);
    session.stop();
});
session.on('final', e => console.log(e.text));
session.on('end', e => console.log(e.reason, session.result()));
```

### 处理缺少模型或权限

```js
try {
    let session = speech.listen();
    session.on('end', e => console.log(session.result()));
} catch (e) {
    if (!(e instanceof speech.SpeechError)) throw e;
    switch (e.code) {
        case 'MODEL_MISSING':
            speech.models.install('asr.sense-voice.zh-en-ja-ko-yue.2024-07-17.int8');
            break;
        case 'PERMISSION_DENIED':
            console.log('请在 3-Macaw Speech 中授予麦克风权限');
            break;
        default:
            throw e;
    }
}
```
