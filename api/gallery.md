# 相册 (Gallery)

`gallery` 模块用于在脚本中使用 3-Maple Image 插件的选图界面, 查看器, 编辑器与转换器: 让用户选择图片并取得图片的文件信息, 打开查看器浏览指定图片, 让用户编辑一张图片并保存结果, 以及不显示界面地转换图片的格式与尺寸.

从 AutoJs6 6.8.0 起, 本模块由外置 3-Maple Image 插件 (AutoJs6-Plugin-Three-Maple-Image) 3.4.0 及以上版本提供. 调用前需在插件中心安装并启用与当前 AutoJs6 兼容的插件. 插件缺失, 被禁用或版本不兼容时, 方法会抛出 (或以 Promise 拒绝) `code` 为 `PLUGIN_UNAVAILABLE`, `PLUGIN_DISABLED` 或 `PLUGIN_INCOMPATIBLE` 的 [GalleryError](#c-galleryerror), 其消息以插件中心的本地化提示开头. [gallery.isAvailable](#m-isavailable) 可预先探测.

图片以文件路径指定, 相对路径按脚本工作目录解析 (与 [files.path](files#m-path) 相同), 不接受 `content://` 等 URI. 源文件由 AutoJs6 以只读方式打开后交给插件, 输出文件由 AutoJs6 写入: 先写入目标文件夹中的隐藏暂存文件, 回读确认是插件报告的图片后再改名为最终文件, 失败, 取消或超时时删除暂存文件. 插件不会得到任何路径, 因此脚本不能借助插件读写自身无权访问的文件; 选图结果也只保留脚本可读的图片.

每个方法都有同步形态 `x(...)` 与异步形态 `xAsync(...)`, 二者参数与结果完全一致. 同步形态阻塞当前脚本线程直至得到结果或调用失败, 停止脚本会取消尚未完成的调用并关闭插件界面; 异步形态立即返回 [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise), 回调在脚本线程执行. [pick](#m-pick), [edit](#m-edit) 与 [convert](#m-convert) 的同步形态可能等待较长时间, 不能在 UI 线程调用 (抛出 `INVALID_ARGUMENT`), UI 模式中请使用对应的异步形态. 传给插件的参数会像 `JSON.stringify` 一样序列化, 函数与 `undefined` 值被忽略, 未知的选项键在此处以 `INVALID_ARGUMENT` 拒绝.

选图界面, 查看器与编辑器由 AutoJs6 启动插件的 Activity, 受系统对后台应用启动 Activity 的限制; 在 AutoJs6 界面可见时运行脚本可确保启动成功. 界面 60 秒内未能显示时调用失败于 `TIMEOUT`. 插件同一时间只有一个界面会话, 新的选图, 查看或编辑会结束之前的会话 (之前的调用失败于 `SESSION_REPLACED`, 查看器会话以 `replaced` 关闭).

本模块注册为全局名称 `gallery`, 并提供 `$gallery` 别名.

```js
let images = gallery.pick({ multiple: true, maxCount: 5 });
if (images) {
    images.forEach((image) => {
        let output = gallery.convert(image.path, { format: 'webp', longEdge: 1080 });
        console.log(image.name, '->', output.name, output.width + 'x' + output.height);
    });
}
```

---

<p style="font: bold 2em sans-serif; color: #FF7043">gallery</p>

---

## [m] pick

### gallery.pick(options?)

**`6.8.0`**

- **[ options ]** {{
    - multiple?: [boolean](dataTypes#boolean);
    - maxCount?: [number](dataTypes#number);
    - mimeTypes?: [string](dataTypes#string) | [string](dataTypes#string)[];
    - title?: [string](dataTypes#string);
- }} - 选图选项
- <ins>**returns**</ins> { [Object](dataTypes#object)[] | [null](dataTypes#null) } - 选中的图片, 用户取消时为 `null`

打开插件的选图界面, 等待用户选择图片后返回图片对象数组 (单选时也是数组). 用户未选择就离开时返回 `null`.

- `multiple` 默认 `false`: 单选时点按一张图片即返回; 多选时点按切换选中状态, 用底部按钮确认.
- `maxCount` 只用于多选, 取值 1 到 200 (默认 200), 达到上限后不能再选中更多图片.
- `mimeTypes` 限定可选的图片类型, 如 `'image/png'` 或 `['image/jpeg', 'image/webp']`, 最多 16 项; 包含 `'image/*'` 时不限定.
- `title` 是选图界面的标题, 最长 200 个字符, 默认为 "选择一张图片" 或 "选择图片".

选图界面列出 "所有图片", 收藏与媒体库中的相册. 插件尚无照片访问权限时, 界面会先请求权限 (Android 14 及以上可授予部分照片访问权限, 此时只列出用户允许的图片); 用户拒绝, 或权限已无法再次请求而用户未在设置中授予就离开时, 调用失败于 `PERMISSION_REQUIRED`.

返回数组中的每个对象包含:

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| path | string | 图片文件的绝对路径 |
| name | string | 文件名 |
| mimeType | string | 媒体类型, 如 `'image/jpeg'` |
| width | number | 宽度 (像素), 未知时为 `0` |
| height | number | 高度 (像素), 未知时为 `0` |
| size | number | 文件大小 (字节) |
| dateTaken | number | 拍摄时间 (毫秒时间戳), 没有拍摄时间时为文件修改时间 |

AutoJs6 只保留路径存在, 是常规文件且脚本可读的图片, 并去除重复项; 选中的图片全部不可读时失败于 `ACCESS_DENIED`.

```js
let images = gallery.pick({ multiple: true, maxCount: 3, mimeTypes: 'image/jpeg' });
if (images === null) {
    toastLog('已取消');
} else {
    images.forEach(image => console.log(image.path, image.width + 'x' + image.height));
}
```

## [m] pickAsync

### gallery.pickAsync(options?)

**`6.8.0`** **`Async`**

- **[ options ]** {{ multiple?: [boolean](dataTypes#boolean); maxCount?: [number](dataTypes#number); mimeTypes?: [string](dataTypes#string) | [string](dataTypes#string)[]; title?: [string](dataTypes#string) }} - 选图选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](dataTypes#object)[] | [null](dataTypes#null)&gt; }

```js
gallery.pickAsync().then((images) => {
    if (images) console.log(images[0].path);
}).catch(e => console.error(e.toString()));
```

## [m] view

### gallery.view(paths, options?)

**`6.8.0`**

- **paths** { [string](dataTypes#string) | [string](dataTypes#string)[] } - 图片路径或路径数组, 1 到 128 张
- **[ options ]** {{ index?: [number](dataTypes#number) }} - `index` 为起始页, 默认 `0`
- <ins>**returns**</ins> { [GalleryViewSession](galleryViewSessionType) } - 查看器会话

用插件的查看器按顺序浏览指定图片, 启动查看器后立即返回 [GalleryViewSession](galleryViewSessionType). 查看器可见后触发 `open` 事件, 之后翻页以 `page` 事件在脚本线程到达 (起始页也会报告); 会话打开期间脚本保持运行, 直到 `close` 事件 (用户离开查看器, 脚本调用 [close](galleryViewSessionType#m-close), 会话被替换或超时). 脚本退出时会话结束但查看器保留, 用户可继续浏览.

图片数量超过 128 张时失败于 `LIMIT_EXCEEDED`, 路径不存在或不是文件时失败于 `FILE_NOT_FOUND`.

```js
let session = gallery.view(['./out/a.jpg', './out/b.png'], { index: 1 });
session.on('page', page => console.log('第', page.index + 1, '张:', page.path));
session.on('close', e => console.log('closed:', e.reason));
```

## [m] viewAsync

### gallery.viewAsync(paths, options?)

**`6.8.0`** **`Async`**

- **paths** { [string](dataTypes#string) | [string](dataTypes#string)[] } - 图片路径或路径数组, 1 到 128 张
- **[ options ]** {{ index?: [number](dataTypes#number) }} - `index` 为起始页, 默认 `0`
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[GalleryViewSession](galleryViewSessionType)&gt; }

与 [view](#m-view) 不同, Promise 在查看器显示 (`open` 事件) 之后才兑现; 查看器在显示前关闭时以对应的错误拒绝 (如 `TIMEOUT`).

```js
gallery.viewAsync('./out/a.jpg').then((session) => {
    console.log(session.state); // open
    setTimeout(() => session.close(), 5000);
});
```

## [m] edit

### gallery.edit(path, options?)

**`6.8.0`**

- **path** { [string](dataTypes#string) } - 图片路径
- **[ options ]** {{
    - output?: [string](dataTypes#string);
    - overwrite?: [boolean](dataTypes#boolean);
    - format?: `'jpeg'` | `'jpg'` | `'png'` | `'webp'`;
    - quality?: [number](dataTypes#number);
    - keepExif?: [boolean](dataTypes#boolean);
    - keepLocation?: [boolean](dataTypes#boolean);
- }} - 输出与编码选项
- <ins>**returns**</ins> { [string](dataTypes#string) | [null](dataTypes#null) } - 保存的文件路径, 用户未保存就离开时为 `null`

用插件的编辑器打开图片 (裁剪, 旋转, 调整, 滤镜, 画笔, 文字与形状等), 等待用户保存或离开. 用户保存后 AutoJs6 写出结果并返回其绝对路径.

- 默认保存在原图旁, 文件名为 `名称_edited.扩展名`, 扩展名随写出的格式而定; 同名文件已存在时加序号, 如 `photo_edited (1).jpg`.
- `output` 指定输出路径 (相对路径按工作目录解析, 缺少的父文件夹会被创建); 该文件已存在时失败于 `OUTPUT_EXISTS`, 除非 `overwrite` 为 `true`.
- 只有 `overwrite: true` 而没有 `output` 时, 结果替换原图.
- `format`, `quality` (1 到 100), `keepExif` 与 `keepLocation` 是编辑器保存对话框的初始值, 用户在对话框中仍可更改. `keepLocation` 只在同时保留 EXIF 且插件设置中开启了 "显示位置" 时可用.

```js
let output = gallery.edit('./photos/cat.jpg', { format: 'jpeg', quality: 90, keepExif: true });
console.log(output === null ? '未保存' : '已保存到 ' + output);
```

## [m] editAsync

### gallery.editAsync(path, options?)

**`6.8.0`** **`Async`**

- **path** { [string](dataTypes#string) } - 图片路径
- **[ options ]** {{ output?: [string](dataTypes#string); overwrite?: [boolean](dataTypes#boolean); format?: [string](dataTypes#string); quality?: [number](dataTypes#number); keepExif?: [boolean](dataTypes#boolean); keepLocation?: [boolean](dataTypes#boolean) }} - 输出与编码选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[string](dataTypes#string) | [null](dataTypes#null)&gt; }

## [m] convert

### gallery.convert(path, options?)

**`6.8.0`**

- **path** { [string](dataTypes#string) } - 图片路径
- **[ options ]** {{
    - output?: [string](dataTypes#string);
    - overwrite?: [boolean](dataTypes#boolean);
    - format?: `'jpeg'` | `'jpg'` | `'png'` | `'webp'`;
    - quality?: [number](dataTypes#number);
    - lossless?: [boolean](dataTypes#boolean);
    - targetBytes?: [number](dataTypes#number);
    - sizeMode?: `'original'` | `'percent'` | `'longEdge'` | `'custom'`;
    - percent?: [number](dataTypes#number);
    - longEdge?: [number](dataTypes#number);
    - width?: [number](dataTypes#number);
    - height?: [number](dataTypes#number);
    - keepAspectRatio?: [boolean](dataTypes#boolean);
    - background?: [number](dataTypes#number) | [string](dataTypes#string);
    - keepExif?: [boolean](dataTypes#boolean);
    - keepLocation?: [boolean](dataTypes#boolean);
- }} - 转换选项
- <ins>**returns**</ins> {{ path: [string](dataTypes#string); name: [string](dataTypes#string); mimeType: [string](dataTypes#string); width: [number](dataTypes#number); height: [number](dataTypes#number); size: [number](dataTypes#number) }} - 写出的图片

不显示界面, 用插件的转换器转换图片并返回写出的图片信息. 输出位置与 [edit](#m-edit) 相同: 默认在原图旁写为 `名称_converted.扩展名`, `output` 与 `overwrite` 的规则一致.

- `format` 省略时保留原图格式 (原图为 JPEG, PNG 或 WebP 时), 否则写为 JPEG.
- `quality` 为 1 到 100, 默认 `92`; PNG 与无损 WebP 忽略此项.
- `lossless` 只用于 WebP 输出, Android 11 以下不支持时写为有损 WebP.
- `targetBytes` 让转换器搜索使文件不超过该字节数的质量, 只用于 JPEG 与有损 WebP, 不能与 `quality` 同时指定.
- 尺寸: `sizeMode` 为 `'original'` (默认), `'percent'` (`percent` 为 1 到 1000), `'longEdge'` (`longEdge` 为 1 到 16384, 长边已不超过它的图片不放大) 或 `'custom'` (`width` 和/或 `height`, 各为 1 到 16384). 省略 `sizeMode` 时由给出的 `percent`, `longEdge` 或 `width` / `height` 推断. 自定义尺寸默认保持宽高比 (只给一边时另一边按比例, 两边都给时缩放到两者之内); `keepAspectRatio: false` 需要同时给出两边并拉伸到该尺寸. 输出不能超过 16384 像素边长与 4000 万像素.
- `background` 是写为 JPEG 时透明像素的填充色, 可为 ARGB 数字或 `'#RGB'`, `'#RRGGBB'`, `'#AARRGGBB'` 字符串, 默认白色.
- `keepExif` 保留拍摄信息 (相机, 曝光, 拍摄时间等), `keepLocation` 在保留 EXIF 时同时保留位置信息; 默认都不保留, 输出不含位置信息.

转换在插件进程中进行, 最长 180 秒, 超时失败于 `TIMEOUT`. 原图无法解码时失败于 `DECODE_FAILED`, 尺寸或内存超出上限时失败于 `LIMIT_EXCEEDED`.

```js
let written = gallery.convert('./photos/cat.png', { format: 'jpeg', quality: 80, percent: 50, background: '#ffffff' });
console.log(written.path, written.width + 'x' + written.height, written.size + ' bytes');

gallery.convert('./photos/cat.png', { output: './out/cat.webp', overwrite: true, format: 'webp', targetBytes: 200 * 1024 });
```

## [m] convertAsync

### gallery.convertAsync(path, options?)

**`6.8.0`** **`Async`**

- **path** { [string](dataTypes#string) } - 图片路径
- **[ options ]** { [Object](dataTypes#object) } - 转换选项, 同 [convert](#m-convert)
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;{{ path: [string](dataTypes#string); name: [string](dataTypes#string); mimeType: [string](dataTypes#string); width: [number](dataTypes#number); height: [number](dataTypes#number); size: [number](dataTypes#number) }}&gt; }

## [m] isAvailable

### gallery.isAvailable()

**`6.8.0`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否有兼容且已启用的相册插件

探测插件. 插件缺失, 被禁用或不兼容时返回 `false`, 不抛出异常.

```js
if (!gallery.isAvailable()) {
    toastLog('请在插件中心安装并启用 3-Maple Image');
    exit();
}
```

## [m] isAvailableAsync

### gallery.isAvailableAsync()

**`6.8.0`** **`Async`**

- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[boolean](dataTypes#boolean)&gt; }

## [C] GalleryError

### new gallery.GalleryError(message, code?)

**`6.8.0`**

- **message** { [string](dataTypes#string) } - 错误消息
- **[ code = `'INTERNAL'` ]** { [string](dataTypes#string) } - 错误代码
- <ins>**returns**</ins> { [GalleryError](#c-galleryerror) }

相册模块抛出的所有错误 (含 [GalleryViewSession](galleryViewSessionType) 的 `error` 事件参数) 都是 `name` 为 `'GalleryError'` 的 JavaScript [Error](exceptions#error-对象), 可用 `instanceof gallery.GalleryError` 判断. `message` 不可枚举, `JSON.stringify` 只输出 `code`. 脚本也可自行构造.

```js
try {
    gallery.convert('./photos/missing.png');
} catch (e) {
    if (e instanceof gallery.GalleryError) {
        console.log(e.code); // FILE_NOT_FOUND
        console.log(e.toString()); // GalleryError [FILE_NOT_FOUND]: ...
    }
}
```

## [p#] name

**`6.8.0`**

- { `'GalleryError'` }

## [p#] code

**`6.8.0`**

- { [string](dataTypes#string) }

错误代码:

| code | 含义 |
| --- | --- |
| PLUGIN_UNAVAILABLE | 插件缺失或绑定失败, 或插件进程在打开界面会话期间退出 |
| PLUGIN_DISABLED | 插件已安装但在插件中心被禁用 |
| PLUGIN_INCOMPATIBLE | 插件身份, 契约版本或要求的宿主版本不匹配, 或插件不提供所需功能 |
| FILE_NOT_FOUND | 路径不存在或不是文件 |
| FILE_UNREADABLE | 文件无法读取, 或选中的图片没有文件路径 |
| UNSUPPORTED_FORMAT | 插件无法打开该图片, 或无法写出所需格式 |
| DECODE_FAILED | 图片类型受支持但无法解码 |
| LIMIT_EXCEEDED | 超出数量, 尺寸, 像素或内存上限, 或脚本未及时消费查看器事件 |
| INVALID_ARGUMENT | 参数形态或取值不合法, 未知的选项键, 或在 UI 线程调用了会阻塞的同步形态 |
| PERMISSION_REQUIRED | 用户未授予插件照片访问权限 |
| ACCESS_DENIED | 路径位于脚本无权读写的位置, 或选中的图片全部不可读 |
| OUTPUT_EXISTS | 指定的输出文件已存在且未指定 `overwrite` |
| SESSION_CLOSED | 会话已关闭, 脚本正在退出, 插件进程已退出, 或插件结束了会话 |
| SESSION_REPLACED | 新的选图, 查看或编辑替换了当前会话 |
| CANCELLED | 调用被脚本停止或宿主取消 |
| TIMEOUT | 界面 60 秒内未显示, 转换超过 180 秒, 或其它调用超过 30 秒 |
| IO | 文件写入, 回读或改名失败 |
| INTERNAL | 其他未归类错误 |

## [m#] toString

### galleryError.toString()

**`6.8.0`**

- <ins>**returns**</ins> { [string](dataTypes#string) } - 形如 `GalleryError [CODE]: message`

## 示例 (Examples)

### 选图并转换

```js
let images = gallery.pick({ multiple: true, maxCount: 5, title: '选择要转换的图片' });
if (images) {
    let outputs = images.map(image => gallery.convert(image.path, { format: 'webp', quality: 85, longEdge: 1080 }).path);
    gallery.view(outputs).on('close', e => console.log('查看器已关闭:', e.reason));
}
```

### 编辑后查看

```js
gallery.pickAsync()
    .then(images => images && gallery.editAsync(images[0].path, { format: 'png' }))
    .then(output => output && gallery.viewAsync(output))
    .catch(e => console.error(e.toString()));
```

### 处理缺少权限

```js
try {
    let images = gallery.pick();
    if (images) console.log(images[0].name);
} catch (e) {
    if (e.code === 'PERMISSION_REQUIRED') {
        toastLog('需要在 3-Maple Image 中授予照片访问权限');
    } else {
        throw e;
    }
}
```
