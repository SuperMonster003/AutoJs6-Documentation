# SpeechModelInfo

SpeechModelInfo 是描述 3-Macaw Speech 插件中一个模型的普通 JavaScript 对象, 由 [speech.models.list](speech#m-modelslist) 列出, 也是 [speech.models.install](speech#m-modelsinstall), [speech.models.importFile](speech#m-modelsimportfile), [speech.models.setDefault](speech#m-modelssetdefault) 与 [speech.models.getDefault](speech#m-modelsgetdefault) 的结果. 对象是调用时的快照, 不会随插件中的变化自动更新. 模型目录, 默认模型与许可规则见 [模型目录与许可](speech#模型目录与许可).

```js
speech.models.list({ kind: 'tts' }).forEach((m) => {
    let state = m.installed ? `已安装 ${m.installedBytes} 字节` : `下载约 ${m.sizeBytes} 字节`;
    console.log(m.id, m.name, m.languages.join('/'), state, m.license.commercialUse ? '可商用' : '须接受许可');
});
```

---

<p style="font: bold 2em sans-serif; color: #FF7043">SpeechModelInfo</p>

---

## [@] SpeechModelInfo

**`6.8.0`**

- {{
    - id: [string](dataTypes#string);
    - kind: `'asr'` | `'tts'` | `'kws'` | `'vad'` | `'speaker'` | `'segment'` | `'langid'` | `'tagger'`;
    - modelType: [string](dataTypes#string);
    - name: [string](dataTypes#string);
    - languages: [string](dataTypes#string)[];
    - sizeBytes: [number](dataTypes#number);
    - installedBytes?: [number](dataTypes#number);
    - installed: [boolean](dataTypes#boolean);
    - isDefault: [boolean](dataTypes#boolean);
    - recommended: [boolean](dataTypes#boolean);
    - version: [number](dataTypes#number);
    - updateAvailable?: [boolean](dataTypes#boolean);
    - latestVersionCode?: [number](dataTypes#number);
    - license: {{ spdx: [string](dataTypes#string); commercialUse: [boolean](dataTypes#boolean); noticeUrl?: [string](dataTypes#string) }};
    - speakers?: [number](dataTypes#number);
    - sampleRate?: [number](dataTypes#number);
    - source: `'catalog'` | `'imported'`;
- }}

## [p] id

**`6.8.0`**

- { [string](dataTypes#string) }

模型 ID. 目录模型的 ID 形如 `<kind>.<名称>`, 例如 `asr.sense-voice.zh-en-ja-ko-yue.2024-07-17.int8`; 导入模型使用导入时给出的 ID.

## [p] kind

**`6.8.0`**

- { `'asr'` | `'tts'` | `'kws'` | `'vad'` | `'speaker'` | `'segment'` | `'langid'` | `'tagger'` }

模型类别: 语音识别, 语音合成, 唤醒词检测, 语音活动检测, 以及 3-Macaw Speech 1.3.0 起的说话人声纹 (`speaker`), 说话人分割 (`segment`), 语种识别 (`langid`) 与音频标签 (`tagger`). 各类模型的用途见 [模型目录与许可](speech#模型目录与许可).

## [p] modelType

**`6.8.0`**

- { [string](dataTypes#string) }

模型的结构类型, 决定插件如何加载它. 目录中的取值为 `'online-transducer'` (流式识别), `'sense-voice'` 与 `'offline-transducer'` (离线识别, 后者自 3-Macaw Speech 1.3.0 起), `'kws-transducer'` (唤醒词), `'vits'`, `'matcha'`, `'kokoro'` (合成), `'silero'` (内置语音活动检测), 以及 3-Macaw Speech 1.3.0 起的 `'speaker-embedding'` (说话人声纹), `'pyannote-segmentation'` (说话人分割), `'whisper-langid'` (语种识别) 与 `'ced'` (音频标签).

## [p] name

**`6.8.0`**

- { [string](dataTypes#string) }

显示名称, 按插件当前的界面语言本地化.

## [p] languages

**`6.8.0`**

- { [string](dataTypes#string)[] }

模型支持的语言标签, 如 `['zh', 'en']`; 语音活动检测模型为空数组. 不对应某种语言的模型使用 ISO 639 的特殊代码: 语种识别模型为 `['mul']` (多种语言), 说话人分割与音频标签模型为 `['zxx']` (无语言内容).

## [p] sizeBytes

**`6.8.0`**

- { [number](dataTypes#number) }

目录模型的下载字节数; 与目录不一致的导入模型 (`source` 为 `'imported'`) 以及内置模型为 `0`.

## [p] installedBytes

**`6.8.0`**

- { [number](dataTypes#number) | [undefined](dataTypes#undefined) }

已安装时占用的字节数, 未安装时不存在.

## [p] installed

**`6.8.0`**

- { [boolean](dataTypes#boolean) }

是否已完好安装. 文件缺失或被破坏的模型视为未安装.

## [p] isDefault

**`6.8.0`**

- { [boolean](dataTypes#boolean) }

是否为所属类别当前生效的默认模型. 默认模型的确定规则见 [模型目录与许可](speech#模型目录与许可).

## [p] recommended

**`6.8.0`**

- { [boolean](dataTypes#boolean) }

是否为目录推荐的模型; 导入模型为 `false`.

## [p] version

**`6.8.0`**

- { [number](dataTypes#number) }

模型版本号. 已安装时为已安装的版本, 否则为可安装的最新版本. 每个模型只保留一个已安装版本; 更新时旧版文件保留到使用它的任务结束.

## [p] updateAvailable

**`6.8.0`**

- { [boolean](dataTypes#boolean) | [undefined](dataTypes#undefined) }

已安装的模型在当前目录中有更高版本时为 `true`, 其他情况为 `false`. 用户导入且与目录不一致的模型, 以及文件被破坏的模型始终为 `false`. 判断以当前目录为准, 目录由 [speech.models.refreshCatalog](speech#m-modelsrefreshcatalog) 刷新, 不会自动联网. 字段自 3-Macaw Speech 1.4.0 起存在, 较早的插件不返回.

调用 [speech.models.install](speech#m-modelsinstall) 即可更新, 见 [模型更新](speech#模型更新).

## [p] latestVersionCode

**`6.8.0`**

- { [number](dataTypes#number) | [undefined](dataTypes#undefined) }

当前目录提供的最新版本号; 目录没有可安装版本时等于 [version](#p-version). 字段自 3-Macaw Speech 1.4.0 起存在, 较早的插件不返回.

## [p] license

**`6.8.0`**

- {{ spdx: [string](dataTypes#string); commercialUse: [boolean](dataTypes#boolean); noticeUrl?: [string](dataTypes#string) }}

模型许可.

- **spdx** - SPDX 许可表达式, 如 `'Apache-2.0'`, `'MIT AND GPL-3.0-or-later'`; 未声明许可的模型为 `'LicenseRef-NoLicenseDeclared'`, 用户导入的模型为 `'LicenseRef-UserImported'`
- **commercialUse** - 是否可商用. 仅限非商业用途与未声明许可的模型都为 `false`, 安装前须接受许可 (`acceptLicense: true` 或插件界面确认)
- **noticeUrl** - 模型来源或许可说明的网址, 只在目录给出时存在

## [p] speakers

**`6.8.0`**

- { [number](dataTypes#number) | [undefined](dataTypes#undefined) }

合成模型的说话人数量, 说话人编号为 `0` 到 `speakers - 1`; 其他模型不存在此字段.

## [p] sampleRate

**`6.8.0`**

- { [number](dataTypes#number) | [undefined](dataTypes#undefined) }

模型的采样率 (Hz), 只在目录给出时存在. 合成输出与系统 TTS 引擎的音频使用此采样率.

## [p] source

**`6.8.0`**

- { `'catalog'` | `'imported'` }

`'catalog'` 表示目录模型 (包括从本地归档导入且与目录条目一致的模型, 以及内置模型), `'imported'` 表示与目录不一致的用户导入模型.
