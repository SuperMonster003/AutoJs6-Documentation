# 媒体信息 (MediaInfo)

mediainfo 模块用于读取媒体文件的容器, 视频, 音频, 字幕和其他流信息.

此模块自 AutoJs6 6.7.0 起提供. `mediainfo` 与 `$mediainfo` 指向同一个可调用模块对象.

自 AutoJs6 6.8.0 起, 媒体信息读取由外置 MediaInfo 插件提供. 调用前, 必须安装并启用与当前 AutoJs6 版本兼容的 MediaInfo 插件. 未发现可用插件引擎时, 调用将抛出异常.

同版本新增版本化快照接口. 旧的可调用模块与 `read` 方法继续返回兼容对象; `snapshot` 可显式选择插件快照 v1 或 v2, 且默认保持 v1. 宿主只有在插件明确宣告支持 v2 时才会发出 v2 请求.

目标路径必须指向一个已存在的文件. 相对路径按当前脚本工作目录解析.

---

<p style="font: bold 2em sans-serif; color: #FF7043">mediainfo</p>

---

## [@] mediainfo

### mediainfo(path)

**`6.7.0`** **`[6.8.0]`**

- **path** { [string](dataTypes#string) } - 媒体文件路径
- <ins>**returns**</ins> { [MediainfoResult](#mediainforesult) } - 媒体信息对象

读取媒体文件信息.

此调用与 [mediainfo.read(path)](#m-read) 等价.

```js
let info = mediainfo('./media/sample.mp4');

console.log(info.path);
console.log(info.general('Format'));
console.log(info.video('Width'));
```

## [p] SNAPSHOT_SCHEMA_V1

**`6.8.0`** **`CONSTANT`**

- [[ `'autojs6-plugin-mediainfo-snapshot-v1'` ]] { [string](dataTypes#string) }

插件快照 v1 的完整 schema 标识.

## [p] SNAPSHOT_SCHEMA_V2

**`6.8.0`** **`CONSTANT`**

- [[ `'autojs6-plugin-mediainfo-snapshot-v2'` ]] { [string](dataTypes#string) }

插件快照 v2 的完整 schema 标识.

## [m] read

### read(path)

**`6.7.0`** **`[6.8.0]`**

- **path** { [string](dataTypes#string) } - 媒体文件路径
- <ins>**returns**</ins> { [MediainfoResult](#mediainforesult) } - 媒体信息对象

读取媒体文件信息.

此方法会立即向 MediaInfo 插件请求完整报告, 将报告解析为对象属性, 并返回可继续查询各流类型的结果对象.

`read` 属于兼容接口, 不等同于 [snapshot(path, options?)](#m-snapshot). 新代码需要稳定 JSON 快照或 v2 多流结构时, 应使用 `snapshot`.

## [m] get

### get(path, streamKind, parameter, options?)

**`6.8.0`**

- **path** { [string](dataTypes#string) } - 媒体文件路径
- **streamKind** { [string](dataTypes#string) } - `general`, `video`, `audio`, `text`, `other`, `image` 或 `menu`
- **parameter** { [string](dataTypes#string) } - MediaInfo 原生参数名称, 如 `SamplingRate`
- **[ options ]** { [MediainfoQueryOptions](#mediainfoqueryoptions) } - 流序号与信息种类
- <ins>**returns**</ins> { [string](dataTypes#string) } - 参数值, 单位, 说明或名称; 不存在的流或参数返回空字符串

流序号从 `0` 开始, 同类流的第 2 条使用 `streamNumber: 1`. 缺省查询第 0 条流的 `TEXT` 值.

```js
let path = './media/movie.mkv';
let count = mediainfo.countGet(path, 'audio');
for (let index = 0; index < count; index++) {
    let options = { streamNumber: index };
    console.log(mediainfo.get(path, 'audio', 'SamplingRate', options));
    console.log(mediainfo.get(path, 'audio', 'SamplingRate', {
        streamNumber: index,
        infoKind: 'MEASURE',
    }));
}
```

该入口需要升级后的宿主. 非 `TEXT` 的查询要求插件宣告对应 `infoKinds`; 不支持时抛出包含 `MEDIAINFO_QUERY_UNSUPPORTED` 的异常. 参数值格式由 MediaInfoLib 决定.

## [m] countGet

### countGet(path, streamKind)

**`6.8.0`**

- **path** { [string](dataTypes#string) } - 媒体文件路径
- **streamKind** { [string](dataTypes#string) } - 与 `get` 相同的流类型, 不接受 `max`
- <ins>**returns**</ins> { [number](dataTypes#number) } - 同类流数量; 无对应流返回 `0`, 原生文件打开失败返回 `-1`

要求 `mediainfo.capabilities().streamCount` 为 `true`. 旧插件不支持时抛出包含 `MEDIAINFO_QUERY_UNSUPPORTED` 的异常.

## [m] snapshot

### snapshot(path, options?)

**`6.8.0`**

- **path** { [string](dataTypes#string) } - 媒体文件路径
- **[ options ]** { [MediainfoSnapshotOptions](#mediainfosnapshotoptions) } - 快照选项
- <ins>**returns**</ins> { [MediainfoSnapshotV1](#mediainfosnapshotv1) | [MediainfoSnapshotV2](#mediainfosnapshotv2) } - 插件快照

读取版本化的 JSON 快照. 未指定 `options.schema` 时返回 v1; 如需 v2, 应使用 `mediainfo.SNAPSHOT_SCHEMA_V2` 显式选择.

```js
let capabilities = mediainfo.capabilities();

if (capabilities.snapshotSchemas.includes(mediainfo.SNAPSHOT_SCHEMA_V2)) {
    let snapshot = mediainfo.snapshot('./media/movie.mkv', {
        schema: mediainfo.SNAPSHOT_SCHEMA_V2,
        includeInform: false,
    });
    console.log(snapshot.engine.name, snapshot.engine.version);
    console.log(snapshot.tracks.audio?.[0]?.fields.Format);
}
```

schema 只接受完整且精确的标识. 未知标识以及在标识两侧添加空白都会被拒绝. 当旧插件未宣告所请求的 v2 时, 宿主会抛出包含 `MEDIAINFO_SNAPSHOT_SCHEMA_UNSUPPORTED` 的可识别异常, 不会静默降级或猜测版本.

## [m] capabilities

### capabilities()

**`6.8.0`**

- <ins>**returns**</ins> { [MediainfoCapabilities](#mediainfocapabilities) } - 当前插件能力

返回当前 MediaInfo 插件宣告的快照 schema 和缺省 schema. 插件可用时, v1 始终作为兼容能力出现; v2 只有在插件明确宣告后才会出现.

`engineVersion` 是插件提供的简短引擎版本信息, 可能省略. 此能力对象不会携带体积较大的 MediaInfo 参数表.

---

## MediainfoSnapshotOptions

版本化快照选项.

- **[ includeInform = `true` ]** { [boolean](dataTypes#boolean) } - 是否在 `inform` 中携带完整文本报告; 关闭时该属性仍存在且值为空字符串
- **[ includeSections = `true` ]** { [boolean](dataTypes#boolean) } - v1 是否生成 `sections`; v2 是否生成 `tracks`; 关闭时对应对象为空
- **[ schema = `mediainfo.SNAPSHOT_SCHEMA_V1` ]** { [string](dataTypes#string) } - 目标快照 schema

## MediainfoSnapshotV1

兼容快照 v1. 其 `sections` 按 Inform 报告章节的小写名称分组; 每个章节包含按原顺序排列的流数组, 字段名转换为 camelCase, 字段值均为字符串.

- **schema** { [string](dataTypes#string) } - 固定为 `autojs6-plugin-mediainfo-snapshot-v1`
- **fileName** { [string](dataTypes#string) } - 传给插件的显示文件名
- **sizeBytes** { [number](dataTypes#number) } - 数据源字节数
- **inform** { [string](dataTypes#string) } - 完整文本报告或空字符串
- **sections** { [Object](dataTypes#object) } - 动态章节映射; 值为字段对象数组

## MediainfoSnapshotV2

插件拥有的快照 v2 envelope. 外层结构, 流分组与 track 分区是稳定契约; `fields`, `attributes` 和 `extra` 内的具体键和值由 MediaInfoLib 决定, 升级引擎时可以扩展.

- **schema** { [string](dataTypes#string) } - 固定为 `autojs6-plugin-mediainfo-snapshot-v2`
- **file** {{
    - name: [string](dataTypes#string);
    - sizeBytes: [number](dataTypes#number);
- }} - 数据源信息
- **engine** {{
    - name: [string](dataTypes#string);
    - version: [string](dataTypes#string);
    - url?: [string](dataTypes#string);
- }} - MediaInfoLib 引擎信息
- **inform** { [string](dataTypes#string) } - 完整文本报告或空字符串
- **tracks** { [Object](dataTypes#object) } - 以小写流类型分组的动态 track 数组

每个 track 始终包含 `fields`. 除 `@type` 外, 以 `@` 开头的原生键放入可选的 `attributes`; 原生 `extra` 对象放入可选的 `extra`; 其他成员原名放入 `fields`. 值保持原生 JSON 类型, 不转换成 v1 的显示文本.

同类流保持 MediaInfoLib 的原始顺序, 数组下标就是从 `0` 开始的流编号:

```js
let snapshot = mediainfo.snapshot('./media/movie.mkv', {
    schema: mediainfo.SNAPSHOT_SCHEMA_V2,
});

let firstAudio = snapshot.tracks.audio?.[0];
console.log(firstAudio?.fields.Format);
console.log(firstAudio?.attributes?.['@typeorder']);
```

## MediainfoCapabilities

当前插件的轻量能力对象.

- **snapshotSchemas** { [string](dataTypes#string)[] } - 当前可请求的完整 schema 标识
- **defaultSnapshotSchema** { [string](dataTypes#string) } - 缺省 schema, 当前为 v1
- **[ engineVersion ]** { [string](dataTypes#string) } - 插件提供的简短引擎版本
- **streamNumber** { [boolean](dataTypes#boolean) } - 当前宿主是否支持指定查询流序号
- **streamCount** { [boolean](dataTypes#boolean) } - 当前插件是否支持流计数
- **infoKinds** { [string](dataTypes#string)[] } - 可查询的信息种类; 旧插件至少支持 `TEXT`

## MediainfoQueryOptions

- **[ streamNumber = `0` ]** { [number](dataTypes#number) } - 从 0 开始的同类流序号, 必须是 `0..2147483647` 内的整数
- **[ infoKind = `'TEXT'` ]** { [string](dataTypes#string) } - 信息种类, 不区分大小写

信息种类为 `NAME`, `TEXT`, `MEASURE`, `OPTIONS`, `NAME_TEXT`, `MEASURE_TEXT`, `INFO`, `HOWTO` 和 `DOMAIN`. `MEASURE` 返回单位, `INFO` 返回说明, `NAME_TEXT` 返回可读名称. 可用性与具体值由 MediaInfoLib 决定, 不保证非空.

负数, 小数, 非有限值以及字符串形式的序号会被拒绝. `MAX` 和未知信息种类会被拒绝, 不会截断或静默回退.

---

## MediainfoResult

媒体信息结果对象.

对象包含固定的 `path` 和 `inform` 属性, 以及 `general`, `video`, `audio`, `text`, `other`, `image`, `menu`, `max` 等可调用流查询对象.

完整报告中的章节名称会转换为小写属性名. 章节内的字段名称会转换为 camelCase, 字段值均为字符串. 这些字段由目标文件和 MediaInfo 插件的报告内容动态决定.

例如, 报告中的 `File size` 字段会转换为 `fileSize`:

```js
let info = mediainfo.read('./media/sample.mp4');

console.log(info.general.fileSize);
console.log(info.video.format);
```

动态字段同时挂载在对应的可调用流查询对象上. 因此 `info.video` 既可作为函数调用, 也可读取其解析后的字段.

## [p#] MediainfoResult#path

**`6.7.0`** **`READONLY`**

- { [string](dataTypes#string) }

目标媒体文件的绝对路径.

## [p#] MediainfoResult#inform

**`6.7.0`** **`[6.8.0]`** **`READONLY`**

- { [string](dataTypes#string) }

MediaInfo 插件返回的完整文本报告.

`Complete name` 显示宿主所读取文件的原始路径. 插件内部的描述符路径与临时副本路径不作为文件名展示. 快照的 `fileName` 或 `file.name` 仍保留文件显示名.

## [m#] MediainfoResult#general

### MediainfoResult#general(parameter?, options?)

**`6.7.0`** **`[6.8.0]`**

- **[ parameter = `''` ]** { [string](dataTypes#string) } - MediaInfo 参数名称
- **[ options ]** { [MediainfoQueryOptions](#mediainfoqueryoptions) } - 流序号与信息种类
- <ins>**returns**</ins> { [string](dataTypes#string) } - General 流指定项的参数信息, 默认第 `0` 项

查询 General 流信息.

## [m#] MediainfoResult#video

### MediainfoResult#video(parameter?, options?)

**`6.7.0`** **`[6.8.0]`**

- **[ parameter = `''` ]** { [string](dataTypes#string) } - MediaInfo 参数名称
- **[ options ]** { [MediainfoQueryOptions](#mediainfoqueryoptions) } - 流序号与信息种类
- <ins>**returns**</ins> { [string](dataTypes#string) } - Video 流指定项的参数信息, 默认第 `0` 项

查询 Video 流信息.

## [m#] MediainfoResult#audio

### MediainfoResult#audio(parameter?, options?)

**`6.7.0`** **`[6.8.0]`**

- **[ parameter = `''` ]** { [string](dataTypes#string) } - MediaInfo 参数名称
- **[ options ]** { [MediainfoQueryOptions](#mediainfoqueryoptions) } - 流序号与信息种类
- <ins>**returns**</ins> { [string](dataTypes#string) } - Audio 流指定项的参数信息, 默认第 `0` 项

查询 Audio 流信息.

## [m#] MediainfoResult#text

### MediainfoResult#text(parameter?, options?)

**`6.7.0`** **`[6.8.0]`**

- **[ parameter = `''` ]** { [string](dataTypes#string) } - MediaInfo 参数名称
- **[ options ]** { [MediainfoQueryOptions](#mediainfoqueryoptions) } - 流序号与信息种类
- <ins>**returns**</ins> { [string](dataTypes#string) } - Text 流指定项的参数信息, 默认第 `0` 项

查询字幕或其他 Text 流信息.

## [m#] MediainfoResult#other

### MediainfoResult#other(parameter?, options?)

**`6.7.0`** **`[6.8.0]`**

- **[ parameter = `''` ]** { [string](dataTypes#string) } - MediaInfo 参数名称
- **[ options ]** { [MediainfoQueryOptions](#mediainfoqueryoptions) } - 流序号与信息种类
- <ins>**returns**</ins> { [string](dataTypes#string) } - Other 流指定项的参数信息, 默认第 `0` 项

查询 Other 流信息.

## [m#] MediainfoResult#image

### MediainfoResult#image(parameter?, options?)

**`6.7.0`** **`[6.8.0]`**

- **[ parameter = `''` ]** { [string](dataTypes#string) } - MediaInfo 参数名称
- **[ options ]** { [MediainfoQueryOptions](#mediainfoqueryoptions) } - 流序号与信息种类
- <ins>**returns**</ins> { [string](dataTypes#string) } - Image 流指定项的参数信息, 默认第 `0` 项

查询 Image 流信息.

## [m#] MediainfoResult#menu

### MediainfoResult#menu(parameter?, options?)

**`6.7.0`** **`[6.8.0]`**

- **[ parameter = `''` ]** { [string](dataTypes#string) } - MediaInfo 参数名称
- **[ options ]** { [MediainfoQueryOptions](#mediainfoqueryoptions) } - 流序号与信息种类
- <ins>**returns**</ins> { [string](dataTypes#string) } - Menu 流指定项的参数信息, 默认第 `0` 项

查询 Menu 流信息.

## [m#] MediainfoResult#max

### MediainfoResult#max(parameter?, options?)

**`6.7.0`** **`[6.8.0]`**

- **[ parameter = `''` ]** { [string](dataTypes#string) } - MediaInfo 参数名称
- **[ options ]** { [MediainfoQueryOptions](#mediainfoqueryoptions) } - 流序号与信息种类
- <ins>**returns**</ins> { [string](dataTypes#string) } - Max 流类型指定项的参数信息, 默认第 `0` 项

使用 MediaInfo 的 `MAX` 流类型执行查询.

## [m#] MediainfoResult#toString

### MediainfoResult#toString()

**`6.7.0`**

- <ins>**returns**</ins> { [string](dataTypes#string) } - 结果对象的可读字符串

返回由已解析章节和字段组成的对象描述.
