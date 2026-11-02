# 运行时 API (Runtime APIs)

<!-- type=misc -->

AutoJs6 的 Rhino, Node.js Runtime 和 Bun Runtime 使用独立的执行环境. 本文说明宿主 API 的导入方式, 异步返回值及编辑器声明边界. 安装运行时插件不会自动把全部 Rhino 全局对象注入 Node.js 或 Bun.

本文对应包含运行时 API 补齐的配套宿主与插件源码. 已安装的旧版本可能没有下列模块或能力; 文档更新不表示这些版本已经公开发布.

## 执行方式

| 环境 | 宿主 API 入口 | 返回值与限制 |
| --- | --- | --- |
| Rhino | 全局模块, 如 `pinyin`, `console`, `cX` | 按各模块页的同步或异步签名使用 |
| Node.js 主线程 | `require('pinyin')`, `require('screen_metrics')` 等公开模块, 或对应 ESM 导入 | 宿主调用通常返回 Promise; 不自动注入 Rhino 全局 |
| Node.js Worker | `opencc` / `autojs6:opencc`, `image` / `images`, `pinyin`, `pinyin4j`, `console`, `screen_metrics`, `media_projection`, `screen_recorder`, `recorder`, `java` 及其 `autojs6:` 入口; 其他能力可经 `autojs6:bridge` 转发 | 支持 CJS, ESM 和嵌套 Worker; 异步操作复用父线程封装, 仍受本次执行授权约束 |
| 原生终端 `node` / `npm` | 原生 Node.js 入口 | 不加载 AutoJs6 脚本执行器的模块与兼容全局 |
| Bun | 从 `process.env.AUTOJS6_HOST_CLIENT_MODULE` 导入客户端, 再调用 `createHostClient()` | 显式客户端, 异步调用, 按当前执行协商能力; 需要 Android 13 (API 33) 或更高版本 |

独立脚本可以在首条字符串语句中使用 `"nodejs";` 或 `"bun";`. Node 也支持 `node` 标记. Node 的 `.node.js`, `.cjs`, `.mjs`, `.mts`, `.cts` 后缀和 Bun 的 `.bun.js`, `.bun.ts`, `.bun.tsx` 后缀用于选择对应环境. 普通 `.ts` / `.tsx` 默认仍按 Rhino 的 TypeScript 路径处理; 项目的 `type` / `projectType` 为 `node` 时可选择 Node. 当前 `type: 'bun'` 元数据本身不选择 Bun 引擎, 应使用 Bun 标记或后缀. 标记不能与固定引擎后缀冲突. 作为 Bun 入口的相对依赖导入的 `.mjs` 文件由 Bun 解释, 将该文件单独运行则按其后缀选择 Node.

Node.js 脚本与项目默认不限执行时长, 与 Rhino 脚本相同, 可随时停止. 项目可在 project.json 的 node 配置中设置 `timeoutMs` (毫秒) 作为执行总预算: 从 Node.js Runtime 插件收到请求时开始计时, 包含排队与工作区准备, 耗尽后脚本停止并报告 `ERR_AUTOJS6_SCRIPT_TIMEOUT`; 未设置或为 0 时不限. TypeScript 项目设置的预算不少于 30000 毫秒. 运行期间的输出 (console.log 及 process.stdout / process.stderr) 逐段转发到 AutoJs6 控制台, 不等脚本结束.

### 相对路径

Node.js 与 Bun 的 `process.cwd()` 是运行时插件私有目录里的项目副本, 宿主进程无法读写. 由宿主打开文件的调用 (zip, files.open, files.toFile) 因此按脚本的源目录解析相对路径, 与 Rhino 相同; Node.js 可经 `engines.myEngine().hostCwd` 读取这个目录. 写进 `process.cwd()` 的文件不能直接交给这些调用, 要先放到共享存储 (例如以 `files.sdcardPath` 开头的路径).

Node.js 的其他 files 方法在插件进程内执行, 相对路径按 `process.cwd()` 解析. 插件进程读写共享存储 (如 `/sdcard`) 要在系统设置里给运行时插件授权: Android 10 及更早是 "存储" 权限, Android 11 起是 "所有文件访问权限", 未授权时报 EACCES 或 EPERM (Android 11 起在共享存储根目录新建文件是 EPERM, `Download`, `Documents` 等公共目录里自己创建的文件不需要授权). 首次失败时 AutoJs6 提示一次, 可从提示跳转到系统设置中该插件的页面, 每次执行最多提示一次, 错误本身不变. 提示来自脚本的错误输出, 所以脚本捕获了 `node:fs` 的错误又没有输出时不提示.

Bun 的 `Bun.file` 与 `node:fs` 同样在插件进程内执行, 授权和提示规则相同; host.files 在宿主进程内执行, 不需要给插件授权.

### 宿主在后台

Android 14 起, 系统约 10 s 后冻结 cached 状态的进程. 宿主进程被结束后只由脚本启动 (例如经 Intent 运行脚本), 没有自己的界面, 也没有绑定中的无障碍服务或通知监听服务时, 若未开启前台服务, 就处于这种状态: 脚本约 12 s 后停住. Rhino 与 Node.js 脚本在宿主回到前台后继续运行; Bun 脚本的宿主会被系统结束, 脚本随之结束. 这类脚本要长时间运行时, 在应用界面打开前台服务开关.

ColorOS 上, 宿主进程崩溃或被系统结束后无障碍服务不会自动恢复绑定, 要在系统设置里重新打开; Android 原生系统在十几秒内自动恢复.

## Node.js 拼音

**`Async`**

```js
"nodejs";

let pinyin = require('pinyin');
let pinyin4j = require('pinyin4j');

(async () => {
    console.log(await pinyin.simple('北京上海'));
    console.log(await pinyin.convert('重庆', { heteronym: true }));
    console.log(await pinyin4j.readings('重庆', { system: 'HANYU' }));
})();
```

公开模块调用宿主选择的外置 Pinyin / Pinyin4j 插件, 不再使用有限字典模拟完整转换. 未安装或不可用时, Promise 拒绝并保留桥接错误, 不把原文返回当作成功回退.

| 模块成员 | 返回值 |
| --- | --- |
| `pinyin(value, options?)`, `pinyin.convert(value, options?)` | `Promise<PinyinResult>` |
| `pinyin.simple(value, enableNumericTone?, enableSegment?)` | `Promise<string>` |
| `pinyin.compare(left, right)` | `Promise<number>` |
| `pinyin.compact(rows)` | `Promise<string[][]>` |
| `pinyin.fromCodePoint(codePoint)` | `Promise<string \| null>` |
| `pinyin.fromPhrase(phrase)` | `Promise<string[][]>` |
| `pinyin4j(value, options?)`, `pinyin4j.of(value, options?)`, `pinyin4j.as(value)` | `Promise<string>` |
| `pinyin4j.readings(value, options?)` | `Promise<string[][]>` |

`PinyinResult` 是二维字符串数组, 附有返回 `Promise<string[][]>` 的 `compact()` 方法. 需要先 `await` 转换, 再 `await result.compact()`. 风格和模式常量仍可同步读取; Node 的常量是数值, 不是 Rhino 的 Java 枚举对象.

原先按同步小字典结果编写的 Node 脚本需要增加 `await`. `Array#sort` 不接受异步比较函数, 因此不能直接把新的 `pinyin.compare` 传入 `sort`.

## Node.js 控制台

**`Async`**

`console.log`, `info`, `warn`, `error` 等日志方法保持原有输出方式. 下列窗口和配置方法实际调用宿主, 返回 `Promise<void>`, 应按顺序等待:

```js
"nodejs";

(async () => {
    await console.show();
    await console.setTitle('Node.js Runtime');
    await console.setSize(600, 400);
    await console.setPosition(20, 80);
    console.log('窗口已就绪');
})();
```

- 窗口: `show`, `hide`, `reset`, `expand`, `collapse`, `launch`, `clear`.
- 尺寸与位置: `setSize`, `setPosition`.
- 标题: `setTitle`, `setTitleTextSize`, `setTitleTextColor`, `setTitleBackgroundColor`, `setTitleBackgroundTint`, `setTitleBackgroundAlpha`, `setTitleIconsTint`.
- 内容: `setContentTextSize`, `setContentTextColor`, `setContentTextColors`, `setContentBackgroundColor`, `setContentBackgroundTint`, `setContentBackgroundAlpha`.
- 通用外观: `setTextSize`, `setTextColor`, `setBackgroundColor`, `setBackgroundTint`, `setBackgroundAlpha`.
- 行为与日志配置: `setExitOnClose`, `setTouchable`, `setGlobalLogConfig`, `resetGlobalLogConfig`.

需要悬浮权限的操作仍依赖宿主权限. 权限不足或参数无效时 Promise 拒绝. 不能再按旧空操作实现链式调用 `console.show().setTitle(...)`; 应分别 `await`. `build`, `input`, `rawInput` 等未实现入口不因窗口控制接通而变为可用.

## Node.js 坐标换算

**`Async`**

`screen_metrics` 模块提供与 Rhino 相同的坐标参数和基数规则, 每次调用读取当前屏幕尺寸, 返回 `Promise<number>`. 不应使用启动时缓存的 `device.width` / `height` 自行替代实时方向信息.

```js
"nodejs";

let screen = require('screen_metrics');

(async () => {
    console.log(await screen.getInfo());
    console.log(await screen.cX(360, 720));
    console.log(await screen.cY(0.5, true));
    console.log(await screen.cXy(0.5, '16:9', true));
    console.log(await screen.cYx(0.5, '16:9', true));
})();
```

| 方法 | 返回值 |
| --- | --- |
| `cX(value?, baseOrMode?, ratioMode?)` | `Promise<number>` |
| `cY(value?, baseOrMode?, ratioMode?)` | `Promise<number>` |
| `cXy(value, baseOrMode?, ratioMode?)` | `Promise<number>` |
| `cYx(value, baseOrMode?, ratioMode?)` | `Promise<number>` |
| `getInfo()` | `Promise<{ width, height, rotation, baseX, baseY }>` |
| `getScaleBases()` | `Promise<{ x, y }>` |
| `getScaleBaseX()`, `getScaleBaseY()` | `Promise<number>` |
| `setScaleBases(x, y)`, `setScaleBaseX(base)`, `setScaleBaseY(base)` | `Promise<void>` |

`cX()` / `cY()` 返回当前宽度 / 高度. `ratioMode` 为 `true`, `false` 或 `'auto'`, 第三个参数表示比例模式. 交叉换算接受 `width:height` 比例字符串; 数值模式, 默认基数, 有限数值与合法基数规则参见 [全局坐标换算](global#m-cx). 每次执行的每个方向只能设置一次自定义基数; `setScaleBases` 必须两个方向都成功才应用.

`require('autojs6:compat')` 也提供上述换算和基数成员, 返回值同样为 Promise. 只有显式安装兼容全局后才能省略该对象; 兼容安装不改变异步语义.

## OpenCC 转换

**`Async`**

Node.js 的 `autojs6:opencc` 提供固定的宿主模块入口. 无前缀的 `opencc` 可被已安装的同名 npm 包遮蔽; 需要本节契约时应使用带前缀的入口:

```js
"nodejs";

let opencc = require('autojs6:opencc');
(async () => {
    console.log(await opencc.s2twi('程序员使用鼠标'));
    console.log(await opencc.convert('程序员使用鼠标', 'S2TWI'));
})();
```

模块自身可调用, `opencc(text, type)` 与 `opencc.convert(text, type)` 等价. `convert` 和以下 32 个转换方法均返回 `Promise<string>`, 不再抛出旧版占位实现的固定不支持错误:

| 分类 | 方法 |
| --- | --- |
| 基础转换 | `hk2s`, `hk2t`, `jp2t`, `s2hk`, `s2t`, `s2tw`, `s2twp`, `t2hk`, `t2s`, `t2tw`, `t2jp`, `tw2s`, `tw2t`, `tw2sp` |
| 惯用词别名 | `s2twi`, `twi2s` |
| 组合转换 | `s2jp`, `t2twi`, `hk2tw`, `hk2twi`, `hk2jp`, `tw2hk`, `tw2twi`, `tw2jp`, `twi2t`, `twi2hk`, `twi2tw`, `twi2jp`, `jp2s`, `jp2hk`, `jp2tw`, `jp2twi` |

转换类型不区分大小写, 使用与 [Rhino OpenCC](opencc) 相同的转换规则和组合链. 文本可以为空字符串, 但 `null` / `undefined` 不作为空字符串处理. 缺少插件, 没有授权或参数不合法时 Promise 拒绝, 不静默返回原文.

Bun 客户端对应 `host.opencc`, 同样可调用且提供 `convert` 和全部 32 个方法. 需要本次执行具有 `text.opencc` 能力, 该能力默认启用, 仍要求可用的 OpenCC 插件. Node/Bun 都不自动注入 Rhino 的 `opencc` 全局对象.

## 图像句柄与处理

Node.js 通过 `require('images')` 或 `require('image')` 使用图像接口; Bun 使用显式客户端的 `host.images`. 图像由宿主持有, 脚本拿到带 `id`, `width`, `height` 的普通对象, 不能当作 Rhino `ImageWrapper` 或 Android `Bitmap` 使用.

每个句柄只属于创建它的执行. `copy`, 缩放, 旋转和滤镜操作返回新句柄, 不替换原图. 不再使用时调用并等待 `recycle(handle)`, 执行结束也会清理该执行持有的图像. 不应复用已回收句柄或把它传给另一次执行.

两端共同提供以下接口. 除 `getSize` 同步读取句柄尺寸外, 表中方法均返回 Promise:

| 方法 | 结果与主要参数 |
| --- | --- |
| `fromBase64(text)`, `fromBytes(bytes)`, `readImage(path)` | 图像句柄; 输入为编码后的图像, Base64 可带 data URL 前缀 |
| `toBase64(image, options?)`, `toBytes(image, options?)` | Base64 字符串或字节; `format` 为 `png`, `jpg`, `jpeg`, `webp`, `quality` 为 0-100 |
| `saveImage(image, path, options?)` | 保存文件, 返回 `void` |
| `pixel(image, x, y)`, `readPixels(image, options?)` | ARGB32 数值或像素数组与尺寸; `readPixels` 支持 `region` |
| `getSize(image)` | 同步返回 `{ width, height }` |
| `copy(image)`, `clip(image, x, y, width, height)` | 独立图像句柄 |
| `resize(image, width, height)`, `scale(image, fx, fyOrOptions?, options?)` | 新尺寸的图像; `scale` 支持 OpenCV `interpolation` 名称或数值 |
| `rotate(image, degrees, options?)` | 旋转并扩展边界; 选项为 `centerX`, `centerY`, `filter` |
| `flip(image, direction)` | `horizontal`, `vertical`, `both`, `none`; 也接受两个布尔参数指定水平和垂直翻转 |
| `grayscale(image)`, `threshold(image, options?)`, `invert(image)` | 灰度, 阈值化, 反色; 反色保留 alpha |
| `blur(image, size)`, `gaussianBlur(image, size, options?)`, `medianBlur(image, size)` | 滤波; 普通和高斯核可为数值或 `[width, height]`, 中值核为正奇数 |
| `findImage(image, template, options?)`, `matchTemplate(image, template, options?)` | 匹配位置或带分数的结果数组 |
| `findColor(image, color, options?)`, `findMultiColors(image, color, points, options?)` | 首个匹配点或 `null` |
| `detectsColor(image, color, x, y, options?)`, `detectColor(...)` | 布尔结果, 支持 `threshold` 与 `algorithm` |
| `findAllPointsForColor(image, color, options?)`, `findPointsByColor(...)` | 匹配点数组, 支持 `threshold` 与 `region` |
| `recycle(image)` | 回收句柄, 返回 `void` |

`readPixels` 返回 `{ data, width, height }`, `data` 是按行排列的有符号 ARGB32 数值数组. 单个像素与编码字节不是同一种数据: 像素整数描述颜色, PNG/JPEG/WebP 字节描述编码后的文件.

Bun 的 `readPixels` 每次最多返回 16,384 个像素, 可使用 `region: [x, y, width, height]` 缩小区域; Node 的公开 `readPixels` 经二进制通道读取, 不受该 JSON 像素上限影响. 两端的 `findAllPointsForColor` 最多返回 4,096 个点, 超限时拒绝而不是截断. 颜色搜索返回图像自身的像素坐标, 不应用屏幕换算基数. `detectsColor` 默认使用 `diff` 算法, 还支持 `rgb`, `rgb+`, `hs`, `h`, `equal`, `oklab`; `findColor` 和 `findAllPointsForColor` 则按 RGB 各通道阈值匹配不透明像素.

编解码, 像素读取, 复制, 裁剪, 旋转, 翻转及 `detectsColor` 不依赖 OpenCV. 缩放, 滤镜, 模板和颜色搜索需要可用的 OpenCV 插件. 两端也提供 `read` / `save`, `findColorEquals`, `findPointByColor` / `findPointByColors`, `getWidth` / `getHeight` 和 `isRecycled` 等便捷入口. `isRecycled` 只跟踪当前线程客户端的回收操作, 不跟踪其他线程或绕过封装的原始桥接调用.

Node 的 `toBytes` 保留原有 PFD 字节传输和 Buffer 生命周期, `format: 'rgba'` 表示紧密排列的直通 alpha sRGB RGBA8, 与 PNG 等编码格式不同. Bun 的 `fromBytes` / `toBytes` 使用 Base64 JSON 通道与 `Uint8Array`, 不提供 PFD 或原始 RGBA 输出. Bun 继续受 64 KiB 请求和 256 KiB 响应上限约束, Base64 膨胀也计入限制. 大图宜使用已授权的宿主文件读取/保存路径, 不能据 Node 的字节能力推断 Bun 的上限.

Bun 将 `image.process` (默认启用), `image.files` (默认关闭) 与 `screen.capture` (默认关闭) 分开授权. 它们分别控制图像处理, 宿主文件读写和请求 Android 录屏授权. 下列高级接口也使用这些授权, 不向运行时直接暴露 Java Bitmap 或 Mat 对象.

## 高级图像 API

**`Async`**

Node.js 的 `image` / `images` 与 Bun 的 `host.images` 已提供宿主 images 注册的 81 个函数入口, 另提供 `readImage` 别名和 `ObjectFrame` 构造器. Node.js Worker 使用相同入口, 支持 CJS/ESM/嵌套执行. 这表示函数入口和下述可传输参数已覆盖, 不表示 Java 对象原型, Java 枚举及所有 Rhino 自动转换重载完全相同.

除 `getSize`, `getWidth`, `getHeight`, `isRecycled`, `buildRegion`, `__buildRegion` 和 `ObjectFrame` 构造器外, 下列宿主操作均返回 Promise. 参数中的区域和坐标使用图像自身的整数像素, 不自动应用屏幕基数或 Rhino 的比例区域重载. OpenCV 枚举参数可使用常量名字符串或数值; 颜色使用 ARGB 数值或颜色字符串.

| 操作 | 接口与返回值 |
| --- | --- |
| 初始化与载入 | `initOpenCvIfNeeded()`; `load(url)` / `loadAsync(url)` 返回图像或 null; HTTP/HTTPS/file URL 均可使用, 无法解码的响应返回 null |
| 矩阵桥接 | `imread(path)` 返回带 id/width/height/channels/depth 的 Mat 句柄; `matToImage(mat)` 创建独立图像. imread 使用 OpenCV 默认的 BGR 文件解码, matToImage 转换为 RGB 图像 |
| 颜色与滤镜 | `isGrayscale(image)`; `inRange(image, lower, upper)`; `interval(image, color, threshold)`; `adaptiveThreshold(image, options)`; `bilateralFilter(image, options)`; `cvtColor(image, code, dstCn?)` |
| 几何 | `findCircles(image, options?)` 返回 `{ x, y, radius }[]`; `concat(a, b, direction?)` 返回新图像; 方向为 left/right/start/end/top/bottom, 默认 right |
| 多点颜色 | `detectMultiColors` / `detectsMultiColors(image, color, points, x, y, options?)` 返回 boolean; `findPointsByColors(image, color, points, options?)` 返回点数组; `countPointsByColor` 返回数量; `getMeanColor` 返回平均 ARGB32 |
| 查找别名 | `findPointByColorExactly`, `findColorInRegion`, `findPointByImage`, `findImageInRegion`; 区域形式接受 x/y/width/height/threshold, 未提供的宽高延伸到图像边缘 |
| 区域辅助 | `buildRegion(image, region?)` 返回 `{ x, y, width, height }`; `__buildRegion(region?, width?, height?)` 在缺少图像尺寸时返回 null; 数组可省略后部字段 |
| 相似度 | `psnr`, `ssim`, `mssim`, `hist`, `mse`, `ncc` 返回 number; `isEqual` 返回 boolean; `getSimilarity(a, b, { metric })` 默认 mssim, 兼容 type 和 pnsr 拼写别名 |
| 压缩 | `compress(image, format?, quality?)` 返回新图像; `compressToBytes(...)` 返回独立编码字节; 默认 PNG/quality 60; PNG quality 非 100 时使用量化插件 |
| 下采样 | `downsample(source, width, height, withAlpha?)` 返回新图像, source 可为图像句柄, 路径/URL 或编码字节; withAlpha 默认 true |
| 截图辅助 | `requestScreenCaptureAsync` 是异步授权入口的别名; `getScreenCaptureOptions()` 返回当前 width/height/orientation, 无会话时返回 null |

`adaptiveThreshold` 可使用 maxValue/adaptiveMethod/type/blockSize/C 选项, 也支持对应的位置参数. 默认值为 255/MEAN_C/BINARY/3/0; 输入先转换为灰度, blockSize 必须为大于 1 的奇数. `bilateralFilter` 支持 d/sigmaColor/sigmaSpace/borderType, 默认 0/40/20/DEFAULT, 同时支持位置参数. RGBA 输入会保留原 alpha. `cvtColor` 的结果保留原生通道信息, 例如 RGBA2RGB -> RGB2HSV -> HSV2RGB -> RGB2RGBA 可以连续调用. `findCircles` 支持 region/dp/minDst/param1/param2/minRadius/maxRadius, 返回原图坐标.

相似度比较使用当前矩阵尺寸和通道, 比较前应统一尺寸及颜色空间. 部分指标可能返回 Infinity 或 NaN; 公开封装恢复这些数值, 不将其误记为 0 或 null. Mat, 特征描述符和普通图像共享已有的执行句柄上限. `recycle` 接受这些句柄, 也支持数组或多个句柄; 执行结束会统一释放.

### 特征提取与匹配

`detectAndComputeFeatures(image, options?)` 返回特征句柄, 含 id/count/method/scale/region. options 支持 `method: 'SIFT' | 'ORB'`, region, scale 和 maxFeatures. 默认 SIFT, 自动缩小大图; 显式 scale 不大于 8, maxFeatures 为非负整数. grayscale 选项用于兼容, 两种算法均在灰度强度上检测特征. 句柄不暴露 Java 对象或原生指针.

`matchFeatures(scene, object, options?)` 可以接收两个特征句柄, 或直接接收图像/路径并临时提取特征. options 支持检测选项, matcher, threshold, ransacThreshold, minInliers 和 drawMatches 文件路径. 默认比例阈值为 SIFT 0.7 / ORB 0.8, RANSAC 阈值 3, 最少内点 4. 找不到有效单应矩阵时返回 null.

非空结果为 `ObjectFrame`, 包含 topLeft/topRight/bottomLeft/bottomRight, center/centerX/centerY, width/height, angle, bounds, matches, inliers, points 和 summary 方法. 坐标已还原到场景原图, 包括检测时的区域偏移和缩放. Worker 会在本地恢复结果的方法与构造器. 可以显式使用 `new images.ObjectFrame(topLeft, topRight, bottomLeft, bottomRight, matches?, inliers?, points?)` 创建几何结果.

```js
"nodejs";
let images = require('autojs6:images');

(async () => {
    let scene = await images.read('/sdcard/Pictures/scene.png');
    let object = await images.read('/sdcard/Pictures/object.png');
    let sceneFeatures;
    let objectFeatures;
    try {
        sceneFeatures = await images.detectAndComputeFeatures(scene, { method: 'ORB', maxFeatures: 700 });
        objectFeatures = await images.detectAndComputeFeatures(object, { method: 'ORB', maxFeatures: 700 });
        let frame = await images.matchFeatures(sceneFeatures, objectFeatures, { minInliers: 6 });
        if (frame) console.log(frame.center, frame.angle, frame.inliers);
    } finally {
        await images.recycle([sceneFeatures, objectFeatures, scene, object].filter(Boolean));
    }
})();
```

### PNG 量化与文件输出

`quantize(image, options?)` 返回 `{ bytes, size, quality, quantizationError, peakWorkingMemoryBytes }`. Node 主线程与 Worker 的 bytes 是独立 Buffer, Bun 为 Uint8Array. 需要可用的 Image Quantization 插件及资源控制/取消 API. options 支持 quality/maxColors/speed/minQuality/maxQuality/ditheringLevel/posterizeBits/preserveAlpha/maxPixels/maxMemoryBytes, 延续宿主量化规则; 默认最多 256 色, speed 8, 最大质量 100, 保留 alpha, 1600 万像素和 256 MiB 额外原生工作内存上限.

`quantizeToFile(image, path, options?)` 使用文件描述符输出 PNG, 返回相同度量和 path, 不返回 bytes. 完成后再替换目标文件; 量化失败时保留原文件并清理临时输出. `compress` / `compressToBytes` 的 PNG quality 也可使用量化选项对象. JPEG/WebP 仍按编码质量参数处理.

Node 的 quantize/compressToBytes 使用 PFD, Worker 恢复 Buffer 类型. Bun 量化字节仍经过 Base64 JSON, 受既有请求/响应体积限制; 大图应使用 quantizeToFile. 质量不足, 资源预算不足, 插件不可用或 Android 拒绝文件访问时明确失败, 不返回未处理图像冒充成功.

Node 的 load 需要 image + network 执行能力. Bun 的文件读取, URL 载入, imread, 保存, quantizeToFile 和 drawMatches 均需要 image.files; quantizeToFile 还需要 image.process. 只开启 image.files 时仍可回收读取的图像/Mat. 原始桥接同样检查这些边界, 内存图像处理授权不能绕过文件授权.

## Bun 截图与录屏授权

**`Async`**

在插件中心启用 Bun 的屏幕截图能力后, 使用显式客户端:

```js
"bun";

/** @type {typeof import('autojs6:bun-host')} */
let sdk = await import(process.env.AUTOJS6_HOST_CLIENT_MODULE);
let host = await sdk.createHostClient();

await host.images.requestScreenCapture({ timeoutMs: 45000 });
try {
    let image = await host.images.captureScreen();
    try {
        console.log(host.images.getSize(image));
        console.log(await host.images.pixel(image, 0, 0));
    } finally {
        await host.images.recycle(image);
    }
} finally {
    await host.images.stopScreenCapture();
}
```

| 方法 | 返回值与行为 |
| --- | --- |
| `requestScreenCapture(options?)` | `Promise<boolean>`, Android 同意后返回 `true`; 拒绝, 超时或未授予 `screen.capture` 时拒绝 Promise |
| `captureScreen()` | `Promise<ImageHandle>`, 从本次执行已授权的屏幕会话取得一帧; 不会静默弹出授权或改用其他截图来源 |
| `stopScreenCapture()` | `Promise<boolean>`, 停止已授权会话或取消待处理授权; 没有持有请求/会话时返回 `false` |

`options` 支持 `orientation: 'auto' | 'portrait' | 'landscape'`, 同时指定的 `width` / `height` (各为 1-8192), `requireExistingPermission` 以及 `timeoutMs` (1-120000 毫秒, 默认 120000). 默认方向为自动. `requireExistingPermission: true` 在本次执行没有有效会话时直接失败, 不显示授权对话框. 同一客户端的并发申请共用一个 Promise, 已生效的会话可复用; 停止或系统撤销后再次申请会重新经过 Android 授权流程.

权限开关只允许请求系统授权, 不代替 Android 的明确同意. 关闭开关影响下一次执行. 运行结束或取消时会释放会话及待处理授权, 已产生的图像句柄仍按执行作用域清理. 视频文件使用下述 `host.screenRecorder` 接口, 另需 `screen.record` 授权.

授权等待使用短状态调用, 不延长普通宿主调用的 10 秒上限. 整体脚本超时仍可提前结束等待; Bun 默认执行限时为 60 秒, 需要更长时间时应在执行配置中调整 `bun.timeoutMillis`. 截图返回句柄, 不把整张图片放入 JSON; 随后的字节和像素读取仍遵循前述传输上限.

## Bun 视频录制与文件输出

`host.screenRecorder` 将已授权的屏幕录制为 H.264/MP4 视频, 默认无声. 需要同时启用 `screen.capture` 和 `screen.record` (均默认关闭), 并先完成 `host.images.requestScreenCapture()`. `screen.record` 允许宿主输出 MP4 文件, 不替代系统授权, 也不依赖图像文件的 `image.files` 开关.

| 方法 | 返回值 | 行为 |
| --- | --- | --- |
| `start(path, options?)` | `Promise<ScreenRecordingActive>` | 开始录制, 路径必须以 `.mp4` 结尾, 已存在的目标文件会被拒绝 |
| `getStatus()` | `Promise<ScreenRecordingStatus>` | `state` 为 idle, recording 或 failed; 活动状态包含 id, path, width, height, frameRate, bitRate, elapsedMs, audio, audioSource 和 error |
| `stop()` | `Promise<ScreenRecordingResult \| null>` | 正常收尾并输出文件; 当前未录制时返回 null |
| `cancel()` | `Promise<boolean>` | 丢弃未完成视频, 保持截图会话; 当前未录制时返回 false |

`options.width` 和 `options.height` 必须同时指定, 为 2..8192 内的偶数; 省略时使用截图会话尺寸. `frameRate` 为 1..120 的整数, 默认 30; `bitRate` 为正整数, 单位 bit/s, 默认 8000000. 尺寸, 帧率和码率还必须受到当前 Android H.264 编码器支持. 不支持的配置拒绝 Promise, 不自动降级. 音频通过 audio 选项单独启用.

`options.audio` 选择音频来源, 默认 `"none"`, 也可用 false 表示不录音:

| audio | 音频 | 额外能力授权 |
| --- | --- | --- |
| `"none"` / false | 无音轨 | 无 |
| `"microphone"` | 麦克风 | screen.record.microphone |
| `"playback"` | 允许捕获的应用播放声音 | screen.record.playback |
| `"mixed"` | 麦克风和应用播放声音, 每路 0.5 增益混合 | 上述两项 |

两个音频开关默认关闭, 修改对下一次执行生效. 所有有声模式都需要宿主的 Android `RECORD_AUDIO` 运行时权限, 包括只捕获应用播放声音的模式. 缺少权限会明确拒绝, 不偷偷降级为无声录制; 可在 Android 的 AutoJs6 应用权限设置中授权. 麦克风模式还使用带停止按钮的麦克风前台服务; Android 14+ 的使用中权限规则要求从允许的前台状态启动, 不能用插件能力开关绕过后台限制. 通知中的停止按钮会取消使用该服务的录制并丢弃未完成视频.

音轨采用 AAC-LC, 48 kHz, 单声道, 128 kbit/s. 播放捕获使用 Android AudioPlaybackCapture, 只包含同一用户配置下允许捕获的 MEDIA/GAME/UNKNOWN 用途音频. 来源应用禁止捕获时, 该来源保持静音; 系统麦克风隐私开关或音频共享规则也可能静音输入. `audio: true` 的结果字段表示文件存在音轨, 不表示一定有可听见的声音. 参阅 [Android 音视频捕获规则](https://developer.android.com/media/platform/av-capture) 与 [麦克风前台服务要求](https://developer.android.com/develop/background-work/services/fgs/service-types#microphone).

输出路径属于宿主, 相对路径按脚本工作目录解析, 仍受 Android 文件访问规则限制. 录制先写临时文件, `stop()` 成功后才生成目标文件. 结果包含 `id`, `path`, `size` (字节), `durationMs`, `width`, `height`, `mimeType: 'video/mp4'`, `videoCodec: 'h264'`, `audio` 和 `audioSource`. 有声录制还返回 `audioCodec: 'aac'`, `audioSampleRate: 48000` 和 `audioChannels: 1`; 无声时这三个字段为 null. 没有编码出有效视频帧时停止会失败, 不生成一个冒充成功的空视频.

每次执行只允许一个活动录制. 录制期间可以继续调用 `host.images.captureScreen()`, 截图和编码从同一投影帧输入取得数据, 不额外申请授权或暂停录制. 截图尺寸遵循 requestScreenCapture 的设置: 自动方向跟随当前屏幕, 固定尺寸保持指定值, 不被视频输出尺寸替换. 停止或取消录制后截图仍然可用, 也可复用同一授权开始下一段录像. 视频输出尺寸在一段录像内保持固定, 横竖屏变化由 Android 等比缩放居中显示, 可能出现留边. 需要交换宽高时应停止当前录像后以新尺寸开始下一段. `stopScreenCapture()`, 执行结束/取消和系统撤销授权会丢弃未完成文件, 因此保留视频需要显式等待 `stop()` 完成.

```js
"bun";
let { createHostClient } = await import(process.env.AUTOJS6_HOST_CLIENT_MODULE);
let host = await createHostClient();
await host.images.requestScreenCapture();
try {
    await host.screenRecorder.start(`/sdcard/Movies/autojs6-${Date.now()}.mp4`, {
        width: 720, height: 1280, frameRate: 30, bitRate: 4000000,
        audio: 'playback', // 需要额外授权和 Android 录音权限.
    });
    let frame = await host.images.captureScreen();
    try { console.log(host.images.getSize(frame)); }
    finally { await host.images.recycle(frame); }
    await Bun.sleep(3000);
    let video = await host.screenRecorder.stop();
    console.log(video.path, video.durationMs, video.size);
} finally {
    await host.screenRecorder.cancel();
    await host.images.stopScreenCapture();
}
```

目标文件名应保持唯一. 较长录制须同时配置足够的 `bun.timeoutMillis`; 编码期间不占用一条长时间宿主调用, 开始和停止仍受普通调用超时约束. 音视频按同一单调时钟写入一个 MP4, 停止时无需重新合并整段文件. frameRate 是目标帧率; 高频大尺寸截图的像素读回会占用图形处理时间.

## Node.js 录屏与音频

**`Async`**

`screen_recorder` / `autojs6:screen_recorder` 在主线程和 CJS/ESM/嵌套 Worker 中提供同一组方法. 先通过 `images.requestScreenCapture()` 或 `media_projection.requestScreenCapture()` 完成 Android 授权. `screen_capture` 是必要的执行能力; 有声录屏另需 `media` 和 `media.recording`, 并要求宿主具有 Android RECORD_AUDIO 权限. 原始 `autojs6:bridge` 调用同样执行这些检查.

| 方法 | 返回值 | 行为 |
| --- | --- | --- |
| `start(path, options?)` | `Promise<ActiveRecording>` | 启动本次执行唯一的录屏, 拒绝覆盖已有文件 |
| `stop(options?)` | `Promise<RecordingResult \| null>` | 完成并保存 MP4, 空闲时返回 null |
| `cancel(options?)` | `Promise<boolean>` | 丢弃未保存文件, 保留截图授权; 空闲时返回 false |
| `getStatus(options?)` | `Promise<Status>` | 返回 idle 或 recording/failed 状态及活动录制信息 |

`start` 的 width/height 是 2..8192 内的偶数, 默认采用授权会话尺寸; frameRate 为 1..120, 默认 30; bitRate 默认 8000000. `audio` 可为 `none`, `microphone`, `playback` 或 `mixed`; 省略或 false 表示无声, 不接受 true. 有声模式输出 AAC-LC 48 kHz 单声道, 目标 128 kbit/s. mixed 对两路音源等比例混合. playback/mixed 要求 Android 10+, 尊重源应用的播放捕获策略; 音轨存在不代表音轨内必有声音. 麦克风模式受 Android 前台服务和使用中权限约束, 并显示可停止录制的通知.

活动结果含 id/path/width/height/frameRate/bitRate/elapsedMs/audio/audioSource/error, state 为 recording 或 failed. `stop` 的非空结果含 id/path/size/durationMs/width/height/mimeType/videoCodec/audio/audioSource/audioCodec/audioSampleRate/audioChannels. 视频为 H.264/MP4; 无声音轨时最后三个音频格式字段为 null.

`stop` / `cancel` 的 options 可含 `id`, 仅操作指定录制; ID 已失效时返回 null/false, 不影响新录制. 所有方法接受 timeoutMs/signal. `start` 在取消与编码器启动同时发生时会等待启动结果并清理该录制. 主线程与 Worker 共享会话, 可以跨线程停止或取消. Worker 退出会丢弃它及其后代启动而尚未保存的录屏; 整次执行结束或系统撤回授权也会清理. 保存文件必须显式等待 stop, 再退出 Worker.

```js
"nodejs";

let images = require('autojs6:images');
let recorder = require('autojs6:screen_recorder');

(async () => {
    await images.requestScreenCapture();
    try {
        let active = await recorder.start(`/sdcard/Movies/node-${Date.now()}.mp4`, {
            width: 720, height: 1280, audio: 'playback',
        });
        let image = await images.captureScreen();
        try { console.log(images.getSize(image)); } finally { await images.recycle(image); }
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log(await recorder.stop({ id: active.id }));
    } finally {
        await recorder.cancel();
        await images.stopScreenCapture();
    }
})();
```

录制期间, 主线程和 Worker 都可调用 images.captureScreen 或 ScreenCapturer.nextImage. 截图尺寸随授权会话和方向变化, 视频保持 start 时的输出尺寸. 二者共用一次 MediaProjection, 不重复弹出授权. Worker 的 media_projection 返回对象保留可调用的 nextImage/stop 方法; 整个对象含方法, 不应直接 postMessage, 可以传递其产生的图像句柄.

原有 `recorder` / `autojs6:recorder` 是单独的音频录制模块, 现在也支持 Worker 的 start/getStatus/stop. 它仍要求 media + media.recording 与 Android RECORD_AUDIO, 按原有 maxDurationMs 和执行生命周期管理, 不使用 screen_recorder 的 Worker 退出丢弃规则. 不承诺设备支持同时启动多个麦克风采集器.

## Node.js Worker 模块

Worker 可直接 `require('autojs6:opencc')` / `require('images')`, 也可使用对应 ESM 导入. OpenCC 的可调用入口和 33 个成员, 以及图像模块的 82 个函数和 ObjectFrame 构造器, 使用与主线程相同的参数和返回契约. 裸名 `opencc` 仍优先解析已安装的同名 npm 包.

异步图像操作由父线程执行, 因而大图上传仍使用既有 PFD 通道. 返回 Worker 的字节经过 Node 结构化克隆, 是该 Worker 独立持有的 Buffer, 不承诺跨线程零复制. `getSize`, `getWidth`, `getHeight` 和 `isRecycled` 同步读取本地信息.

图像, Mat 和特征描述符句柄属于整个脚本执行, 可通过 `postMessage` 交接并在创建它的 Worker 退出后继续使用. 调用方应明确安排回收, 避免一个线程回收另一个线程正在使用的图像. Worker 已退出时才完成创建且无法交付的图像, Mat 和特征描述符会回收, 整次执行结束也会清理剩余句柄. 其他未列出的主线程高级模块仍需单独核查.

Worker 还提供 `pinyin` / `autojs6:pinyin`, `pinyin4j` / `autojs6:pinyin4j`, `screen_metrics` / `autojs6:screen_metrics` 和 `console` / `node:console` / `autojs6:console`, 支持 CJS, ESM 和嵌套 Worker. 拼音常量保持数字值, 可调用入口等价于 convert/of; `await pinyin(...)` 的二维数组保留异步 `compact()` 方法. 文本在进入结构化克隆之前转换, Buffer 和自定义 toString 对象不会被误解释为字节列表或普通对象.

坐标换算每次读取当前屏幕信息, `cX/cY/cXy/cYx` 的重载与主线程一致. 基数属于整个执行, 主线程和所有 Worker 共享同一个状态, 每个轴仍只能设置一次. 原生 Worker stdout/stderr 和自定义 Console 流保持在线程内运行; 窗口控制方法异步作用于父执行的控制台, 全局日志配置方法仍影响宿主全局. Worker 的全局 console 同样提供这些控制方法, 不把普通日志输出转为异步宿主调用. Rhino 的 input/rawInput/build 仍明确报不支持.

## Bun 客户端

**`Async`**

```js
"bun";

/** @type {typeof import('autojs6:bun-host')} */
let sdk = await import(process.env.AUTOJS6_HOST_CLIENT_MODULE);
let host = await sdk.createHostClient();

console.log(await host.pinyin.simple('北京上海'));
console.log(await host.pinyin4j.readings('重庆'));
console.log(await host.coordinates.cX(360, 720));
console.log(await host.coordinates.getInfo());
```

`autojs6:bun-host` 在声明与 Ace 中只作为类型别名使用. 可执行模块必须从环境变量给出的路径加载; 不应编写 `import ... from 'autojs6:bun-host'` 作为值导入.

| 能力 | 客户端成员 | 授权 |
| --- | --- | --- |
| `ui.toast` | `host.toast(text, duration?)` | 既有能力, 每次执行最多 4 条 |
| `device.info` | `host.device.info()` | Build 品牌, 型号, 系统与 ABI 信息 |
| `text.pinyin` | `host.pinyin.convert/simple/compare/compact/fromCodePoint/fromPhrase` | 默认启用, 需要可用 Pinyin 插件 |
| `text.pinyin4j` | `host.pinyin4j.of/as/readings` | 默认启用, 需要可用 Pinyin4j 插件 |
| `ui.layout` | `host.ui` 原生 JSON 布局与窗口事件 | 默认关闭 |
| `ui.compose` | `host.compose` 数据组件, 窗口与状态更新 | 默认关闭, 另需 Compose 插件 |
| `text.opencc` | `host.opencc` 的 `convert` 与 32 个转换方法 | 默认启用, 需要可用 OpenCC 插件 |
| `image.process` | `host.images` 的内存图像操作 | 默认启用, 受 JSON 传输上限约束 |
| `image.files` | `host.images.readImage/saveImage` | 默认关闭, 宿主文件访问独立授权 |
| `screen.capture` | `host.images.requestScreenCapture/captureScreen/stopScreenCapture` | 默认关闭, 另需 Android 录屏授权 |
| `screen.record` | `host.screenRecorder.start/stop/cancel/getStatus` | 默认关闭, 另需 screen.capture 与系统授权, 输出 MP4 文件 |
| `screen.record.microphone` | audio: microphone / mixed | 默认关闭, 另需 Android 录音权限和麦克风前台服务 |
| `screen.record.playback` | audio: playback / mixed | 默认关闭, 另需 Android 录音权限, 遵循来源应用捕获策略 |
| `screen.metrics` | `host.coordinates` 的四个换算及基数成员 | 默认启用, 与 Node 坐标语义相同 |
| `console.control` | `host.console` 的窗口与配置方法 | 默认关闭, 需要明确授权 |

先通过 `host.capabilities` 或 `host.hasCapability(name)` 检查当前执行是否协商到所需能力. Bun 的基数 setter 和控制台命令返回 `Promise<void>`. 普通 `console.log` 等仍由 Bun 原生控制台处理, `host.console` 是显式宿主窗口控制入口.

Bun 不自动获得 Node 的全部模块或 `rhino.run`. Java 对象互操作使用下述显式 `host.java` 接口和独立授权. 无障碍选择器通过下述显式 `host.accessibility` 接口使用. 截图需要独立能力开关及 Android 同意. SDK 的图像句柄也不是 Rhino 图片对象, 不自动注入 `cX`, `pinyin`, `opencc` 或 Rhino 的对象图.

## Bun 无障碍, 应用与剪贴板

配套 Bun Runtime 0.3.0 和宿主 Android build 5572, 显式客户端提供 `host.accessibility`, `host.app`, `host.clipboard`. 参数转换, 选择器描述符, Intent 构造及公开别名与 Node.js 对应模块保持一致; Android 操作复用同一宿主实现. 不注入 Rhino 全局对象.

| 执行能力 | 默认值 | 范围 |
| --- | --- | --- |
| `app.control` | 关闭 | 应用查询, 启动页面/服务, 发送广播, 文件查看/编辑和宿主应用信息 |
| `accessibility.control` | 关闭 | 无障碍状态, 节点查找, 点击/长按, 输入, 滚动和系统导航 |
| `accessibility.gesture` | 关闭 | 在 `accessibility.control` 之外单独允许 `swipe` 和 `gesture` |
| `clipboard.control` | 关闭 | 读取, 判断和替换系统剪贴板文本 |

在插件中心的 Bun 能力桥设置中分别开启. 撤销影响下一次执行. 打包项目需在 `bun.hostCapabilities` 中显式声明相同 ID; 无障碍服务还需要在 Android 设置中启用, 每个打包应用独立授权. 系统剪贴板访问受 Android 前台窗口等条件限制, 不因脚本运行于 Bun 插件进程而改用插件的剪贴板身份.

```js
"bun";
let { createHostClient } = await import(process.env.AUTOJS6_HOST_CLIENT_MODULE);
let host = await createHostClient();
let enabled = await host.accessibility.isEnabled();
if (!enabled) throw Error('请先开启运行此脚本的应用的 Android 无障碍服务.');
let target = host.accessibility.text('示例按钮');
let node = await host.accessibility.findOne(target);
if (node) await host.accessibility.click(target);
```

### host.accessibility

| 方法 | 返回值 | 说明 |
| --- | --- | --- |
| `isEnabled(options?)` / `ensureEnabled(options?)` | `Promise<boolean>` | 查询或等待宿主服务可用. `ensureEnabled` 不替代 Android 授权 |
| `findByText(text, options?)` / `findOne(selector, options?)` | `Promise<UiNodeSnapshot \| null>` | 返回节点数据快照, 不返回 Java 节点对象 |
| `findAll(selector, options?)` | `Promise<readonly UiNodeSnapshot[]>` | 返回匹配节点快照 |
| `click(selector, options?)` / `clickText(text, options?)` / `longClick(selector, options?)` | `Promise<boolean>` | 操作匹配节点 |
| `setText(selector, text, options?)` | `Promise<boolean>` | 设置可编辑节点文本 |
| `scrollForward(selector, options?)` / `scrollBackward(selector, options?)` | `Promise<boolean>` | 对目标执行滚动操作 |
| `back(options?)` / `home(options?)` / `recentApps(options?)` | `Promise<boolean>` | 请求系统导航动作 |
| `swipe(x1, y1, x2, y2, durationMs?, options?)` | `Promise<boolean>` | 坐标滑动, 需独立手势授权 |
| `gesture(durationMs, points, options?)` | `Promise<boolean>` | 按 `[x, y]` 数组执行手势, 需独立手势授权 |

本地选择器构造器包含 `text`, `desc`, `id`, `className`, `textContains`, `descContains`, `textMatches`, `descMatches`, `idMatches`, `classNameMatches`, `clickable`, `enabled`, `scrollable`, `depth`, `boundsInside`, `boundsContains`. 正则参数可用字符串, `RegExp` 或 `{pattern, flags}`. 可通过对象展开组合描述符; 构造器本身不访问 Android, 不需要授权.

当前宿主的 `click` 实际操作支持选择器目标. 坐标点击可使用相同起终点的短 `swipe` 或 `gesture`, 需要 `accessibility.gesture`. 与 Node.js 相同, 此接口不提供 Rhino 的链式 Java 节点对象或任意节点反射. 手势时长最多 10000 ms; 返回值表示完成或取消结果. 查找操作查询当时的节点树, 不把 `timeoutMs` 解释为持续重试直到节点出现.

### host.app

`packageName`, `versionName`, `versionCode` 为当前宿主应用或打包应用的只读信息, 通过 `app.control` 授权获取, 不表示 Bun 插件自身的包信息.

| 方法组 | 说明 |
| --- | --- |
| `getPackageName`, `getAppName`, `isInstalled`, `getInstalledApps`, `getPackageInfo` | 查询 Android 对当前应用可见的包信息. `getInstalledApps({includeSystem:false})` 排除系统应用 |
| `launchPackage`, `launchApp`, `launch` | 启动应用. `launch` 为 `launchPackage` 别名 |
| `openAppSetting`, `openAppSettings`, `launchSettings`, `launchAppDetailsSettings` | 打开应用详情设置, 缺省目标为当前宿主/打包应用 |
| `startActivity`, `openUrl` | 请求页面或 URI. Intent 可指定 action, data/type, packageName/className, categories, flags 和 JSON extras |
| `sendBroadcast`, `startService` | 发送广播或启动普通服务, 仍受 Android 导出规则和后台限制约束 |
| `sendEmail`, `uninstall` | 请求邮件编辑页或系统卸载确认页, 不自动发送邮件或确认卸载 |
| `viewFile`, `editFile` | 使用宿主允许的路径与文件授权请求查看/编辑 |
| `intent`, `parseUri`, `intentToShell` | 同步构造 JSON 描述符, 检查 URI 或生成命令文本. `intentToShell` 不执行命令 |

宿主操作返回 Promise. `getUriForFile`, `kill`, root/Shizuku 和双开相关入口继续明确拒绝, 不返回伪造的成功值. `startService` 不自动升级为前台服务. 包查询遵循 Android 包可见性, 大结果也遵循 Bun 返回体积上限.

### host.clipboard

| 方法 | 返回值 |
| --- | --- |
| `getText(options?)` | `Promise<string>` |
| `setText(text, options?)` | `Promise<void>` |
| `hasText(options?)` | `Promise<boolean>` |

读取与写入均使用宿主/打包应用的 `ClipboardManager`. `hasText` 判断读到的文本是否非空. Android 拒绝后台读取时, 可能读不到文本; 不能用一次空结果证明剪贴板本来为空.

### 等待, 取消与限额

调用选项支持 `timeoutMs` (整数, 1..120000) 和 `signal` (`AbortSignal`). 默认等待时间沿用 Node.js 对应方法, 通常为 5000 或 10000 ms; `ensureEnabled` 为 30000 ms. 长手势和服务等待通过短轮询完成, 不扩大 Bun 的 10 秒单次 RPC 上限. 同时最多四项操作, SDK 会排队后续调用. 取消停止等待和回收任务记录, 无法撤回已经交给 Android 的点击, Intent 或手势. 原有单次执行 1024 次桥调用及 JSON 体积限制仍适用, 轮询也计入调用次数.




## Bun 文件与存储

Bun Runtime 0.4.0 和配套宿主 build 5579 提供 `host.files`, `host.storage`, `host.storages`. 两个独立授权 `files.control` 和 `storage.control` 默认关闭, 在插件中心分别开启; 打包项目在 `bun.hostCapabilities` 中显式声明. 授权不替代 Android 对执行应用的文件权限.

### host.files

对应 Node.js `files` 的 15 个可用方法. `join`, `getName`, `getExtension` 是同步的 POSIX 路径字符串辅助方法, 不需要授权. 其余方法访问宿主或打包应用的文件并返回 Promise, 调用时使用 `await`:

| 方法 | 参数 | Promise 的结果 |
| --- | --- | --- |
| path | path?: string 或 null | 绝对路径, 空值返回 null |
| read | path?: string 或 null, encoding?: string | 文件文本, 空路径返回空字符串 |
| write / append | path: string, text: unknown, encoding?: string | void |
| exists / isFile / isDir | path?: string 或 null | boolean, 空路径返回 false |
| listDir | path?: string 或 null, filter?: (name: string) => boolean | string[], 目录不存在或路径为空时返回空数组 |
| remove | path?: string 或 null | boolean, 路径不存在时返回 false |
| copy / move | source: string, destination: string | boolean |
| ensureDir | path: string | boolean |

默认编码为 utf8, 支持 utf16le, latin1, ascii, hex, base64, base64url 及运行时 Buffer 接受的编码别名. text 为 null/undefined 时写入空字符串, 其他值按 String 转换. listDir 的 filter 在 Bun 中同步执行, 仅返回 true 时保留文件名. 未保证目录列表顺序.

相对路径按宿主的脚本工作目录解析, 缺省为执行应用的 filesDir; 绝对路径和本地 file: URL 仍由 Android 判定访问权限. 这与 Bun 自身 `process.cwd()` 指向的临时工作区不同. 不返回项目归档写回承诺; `Bun.file` 和 `node:fs` 仍在 Bun 插件进程中执行. 保存持久文件时可使用 host.files 或已经授权且可访问的持久路径.

ensureDir 的路径以斜杠结尾时创建该目录, 否则只创建文件的父目录. write/append 不自动创建父目录; copy 会创建目标父目录, move 不会. remove 只移除文件或空目录, 非空目录会拒绝. 文件不存在, 路径无权访问及不支持的跨文件系统移动均保留失败结果, 不伪装成功. `open` 和 `toFile` 与 Node.js 一样不提供 Rhino 文件句柄或原始 Java 对象.

文件字节通过 base64 JSON 传输, 沿用 64 KiB 请求与 256 KiB 结果限制; 封装和编码共同占用额度. 当前单次读取最多 196512 字节, 单次写入的可用原始字节少于 48 KiB, 取决于路径和参数长度. 超限拒绝, 不截断; 过大的写请求在打开目标文件前被拒绝. 大型文件可使用 Bun/Node 原生文件 API 访问插件自身有权访问的路径. 该传输差异不意味着 Node.js files 具有相同大小上限.

```js
let { createHostClient } = await import(process.env.AUTOJS6_HOST_CLIENT_MODULE);
let host = await createHostClient();
await host.files.ensureDir('output/settings.json');
await host.files.write('output/settings.json', JSON.stringify({ enabled: true }));
console.log(await host.files.read('output/settings.json'));
```

### host.storage / host.storages

两个入口采用 Node.js 的公开封装和同一持久化后端. `create(name)` / `open(name)` 同步返回存储对象; 对象的 name 是规范化前去除首尾空白的名称. 下述方法全部返回 Promise:

- get(key, defaultValue?, options?): 返回 JSON 值, 缺失键返回 defaultValue 或 undefined. 已存储的 null 不会被默认值替换.
- put(key, value, options?) / putSync(...): 写入 JSON 值, 返回 void.
- remove(key, options?) / removeSync(...): 删除键, 返回 void.
- clear(options?) / clearSync(...): 清空该存储, 返回 void.
- keys(options?): 返回冻结的, 按键名排序的字符串数组.
- contains(key, options?): 返回 boolean.
- selfRemove(options?) / selfRemoveSync(...): 清空当前存储, 返回 void.
- 模块级 remove(name, options?) / removeSync(...): 清空指定存储, 返回 void.

`Sync` 后缀沿用 Node.js 的历史别名, 仍须 await. names/all 不提供全局命名空间枚举, 调用时抛出 NOT_SUPPORTED. 名称和键去除首尾空白后最多 128 字符, 不得为空或含 NUL; value 不接受 undefined, 函数, Symbol, BigInt 或循环对象. JSON 序列化规则与 Node.js 一致.

存储按执行应用包名和宿主脚本工作目录分组. 同一应用及目录的 Node.js/Bun 脚本可以共享数据; 更换目录或打包包名后属于不同存储. 后端沿用 Node.js 的名称规则: 字母转小写, 非字母数字及 ._- 字符替换为 _, 并取前 64 字符. 因此不同原始名称可能指向同一个存储; 不要依赖大小写或第 65 个字符区分名称. 此 API 不等同于 Rhino 全局 storages.

options 支持 timeoutMs (1..120000 毫秒) 和 AbortSignal. 默认单次存储操作超时为 5000 毫秒. 取消等待不能撤销已经提交的写入. 存储后端单值最多 64 KiB JSON, 每个存储最多 256 KiB; Bun 的单次请求还需包含参数封装, 因此实际可写值小于 64 KiB. 原有 1024 次桥接调用额度及并发限制继续适用.

```js
let store = host.storages.create('settings');
await store.putSync('enabled', true);
console.log(await host.storage.open('settings').get('enabled', false));
```



## Bun 与 Node.js Worker 数据库

配套宿主 build 5580, Node.js Runtime 1.16.0 和 Bun Runtime 0.5.0 提供同一套异步宿主数据库封装. Node.js 主线程及 CJS/ESM/嵌套 Worker 使用 `database` / `sqlite` 或 `autojs6:database` / `autojs6:sqlite`; Bun 显式客户端使用 `host.database` / `host.sqlite`.

这些接口使用执行应用内的 Android SQLite. 它们不替代 Node.js 的原生 `node:sqlite` 或 Bun 原生 SQLite 模块, 也不返回 Java SQLiteDatabase/Cursor 对象. Node.js 保留原生 `node:sqlite` 的同步接口和文件语义. Bun 的 `database.control` 是默认关闭的独立授权, 可在插件中心启用, 打包时在 `bun.hostCapabilities` 中声明. Node.js 项目声明 `database` 权限.

### database.open(name, options?) / database.open(options) / sqlite(name, options?)

**`Async`**

- **name** { [string](dataTypes#string) } - 数据库名称, 1..64 字符, 只接受字母, 数字, 下划线, 短横线和单点, 不接受路径或连续两个点.
- **options.name** { [string](dataTypes#string) } - 对象重载中的名称.
- **[ options.timeoutMs = 10000 ]** { [number](dataTypes#number) } - 调用等待时限, 毫秒. Bun 接受 1..120000 的整数.
- **[ options.signal ]** { [AbortSignal](https://developer.mozilla.org/docs/Web/API/AbortSignal) } - 取消等待的信号.
- <ins>**returns**</ins> { [Promise](dataTypes#promise) } - 数据库句柄, 含只读 id/name 与下述方法.

sqlite 是可调用别名, 同时提供相同的 open 重载. 对象形式中的 timeoutMs/signal 会正确传递, 空对象或缺少名称会拒绝. 名称先去除首尾空白; 后端沿用 Node.js 的小写名称及 .db 后缀规则, 不要以大小写或省略 .db 区分数据库.

数据库按应用包名与宿主脚本工作目录区分. 相同应用/目录的 Node.js 和 Bun 可以共享数据; 打包应用的数据属于自己的包名和私有目录. 数据不随单次 Bun/Node 工作区快照删除.

### 数据库句柄

所有方法返回 Promise, 参数使用有序数组, 只接受有限 number, string, boolean 或 null. 查询与写入使用相同的原生类型绑定; boolean 为 SQLite INTEGER 0/1, null 保持 SQL NULL. 不接收 BigInt, 原始字节数组或命名参数对象.

| 方法 | 签名 | 结果 |
| --- | --- | --- |
| exec | exec(sql, params?, options?) | void |
| run | run(sql, params?, options?) | { rowsAffected: number 或 null, insertId: number 或 null } |
| get | get(sql, params?, options?) | 第一行对象, 无匹配时为 null |
| all | all(sql, params?, options?) | 冻结的行数组 |
| transaction | transaction(operations, options?) | 与操作顺序一致的结果数组 |
| close | close(options?) | 本次关闭为 true, 重复关闭为 false |

直接 INSERT/REPLACE 返回实际影响行数与插入 id; 忽略插入为 0/null. UPDATE/DELETE 返回影响行数和 null 插入 id; 其他命令的计数字段可为 null. SQL 前的注释不会破坏命令识别. 查询行中的 BLOB 表示为 `{ base64: string }`, SQL NULL 表示为 null. 返回值为数据快照, 不持有游标.

transaction 接受 `{ type: 'exec' | 'run' | 'get' | 'all', sql, params? }` 数组, 不接受回调. 任意操作失败会回滚整个事务. 结果中 exec 项为 null, 其他项沿用相应方法的结果. 默认等待时限为 15000 毫秒; exec/run/get/all 默认 10000 毫秒, close 默认 5000 毫秒.

```js
let { createHostClient } = await import(process.env.AUTOJS6_HOST_CLIENT_MODULE);
let host = await createHostClient();
let db = await host.sqlite({ name: 'events', timeoutMs: 10000 });
try {
    await db.exec('CREATE TABLE IF NOT EXISTS events(id INTEGER PRIMARY KEY, value TEXT)');
    let results = await db.transaction([
        { type: 'run', sql: 'INSERT INTO events(value) VALUES(?)', params: ['owned example'] },
        { type: 'get', sql: 'SELECT COUNT(*) AS total FROM events' },
    ]);
    console.log(results[1]);
} finally {
    await db.close();
}
```

Node.js Worker 的对应导入示例:

```js
import database from 'autojs6:database';
import sqlite from 'autojs6:sqlite';
let db = await database.open({ name: 'events' });
try {
    console.log(await db.get('SELECT COUNT(*) AS total FROM events'));
} finally {
    await db.close();
}
```

### 生命周期与边界

- 每次宿主执行最多同时打开 4 个数据库句柄. Worker 与父执行共享该额度; Worker 退出时关闭通过自身桥接打开的句柄, 包括退出后才返回的连接. 关闭不会影响其他 Worker 或父线程自己打开的连接.
- 执行结束时释放其数据库句柄. 手动 BEGIN 后未提交的事务在 SQLite 所属线程回滚后关闭, 避免遗留数据库锁. 普通调用仍应使用 finally/close; transaction 操作数组会自行提交或回滚.
- Bun 通过短轮询等待操作, 不延长单次桥接 RPC 的 10 秒上限. 取消或过期且未交付的 Bun open 结果会释放连接. Abort/timeout 不撤销已经完成的 SQL 写入, 不等于可抢占正在执行的任意 SQL.
- 名称/路径隔离与 SQL 限制沿用 Node.js 宿主桥: 不提供 ATTACH/DETACH/load_extension, 原始 Java 句柄或跨执行句柄操作. database.close 不能释放其他种类的资源.
- 单条 SQL 最多 16 KiB UTF-8, 最多 128 个参数, 一次事务最多 64 项, all 最多 200 行, 结果最多 256 KiB JSON. 超限拒绝而非截断. Bun 还受原有 64 KiB 请求/256 KiB 结果封装与 1024 次调用额度限制.



## Bun 与 Node.js Worker 传感器

宿主 build 5581, Node.js Runtime 1.17.0 和 Bun Runtime 0.6.0 共用传感器封装. Node.js 主线程及 CommonJS/ESM/嵌套 Worker 可使用 `sensors` 或 `autojs6:sensors`; Bun 使用显式客户端 `host.sensors`. Bun 插件中心的独立 `sensors.control` 授权默认关闭, 打包应用在 `bun.hostCapabilities` 中声明; Node.js 项目声明 `sensors` 权限.

| 接口 | 返回值与行为 |
| --- | --- |
| getAvailableSensors(options?) | Promise<readonly SensorInfo[]>, 仅列出设备实际提供的 accelerometer, gyroscope, light |
| once(type, options?) | Promise<SensorEvent>, 取得第一份样本后关闭临时订阅, 超时或取消也会清理 |
| subscribe(type, callback?, options?) | SensorSubscription, 立即返回, await ready 等待原生注册完成 |
| subscription.on/once/off(event, listener) | 订阅或移除 event, accuracy, close, error 监听器, 支持链式调用 |
| subscription.close(options?) | Promise<void>, 可重复调用, 关闭后不再向脚本发送样本 |
| policy | 冻结的采样间隔, 队列和订阅数量限制 |

getAvailableSensors 反映 Android 的传感器清单, 不保证厂商允许应用注册. Redmi 22120RN86C 的 camera_light_Sensor 会出现在清单中, 但厂商服务拒绝第三方应用注册, 此时采样会返回权限拒绝错误.

SensorInfo 包含 type/name, 以及设备提供的 vendor/version/resolution/power/minDelayUs/maxDelayUs. SensorEvent 包含 type/timestamp/accuracy 和冻结的数值数组 values. timestamp 沿用 Android SensorEvent 的纳秒时间基准, 不是 Unix 时间. accelerometer 为三个轴的加速度, 单位 m/s², 含重力; gyroscope 为三个轴的角速度, 单位 rad/s; light 的第一个值为照度, 单位 lx. 不对横竖屏自动旋转原生传感器坐标轴.

可选参数 samplingIntervalMs (别名 intervalMs) 默认 250 毫秒, 限制到 20..60000; maxQueueSize 默认 16, 限制到 1..64; drainIntervalMs 默认 100, 限制到 25..5000 毫秒. 这些采样间隔是给 Android 的请求提示, 硬件和系统可调整实际频率. 光线传感器可能仅在读数改变时继续出事件, 不应要求所有传感器都有固定帧率.

once 的 timeoutMs 默认 5000, 限制到 100..60000 毫秒. signal 可取消一次采样; subscribe 的 signal 在注册完成后仍有效, 触发时关闭订阅. 可读取订阅的 id/type/closed/ready, subscriptionId 仅在协商推送成功时存在. close 始终尝试清理, 不继承已取消的订阅信号. 订阅注册失败会拒绝 ready, 请处理该 Promise; 运行期轮询错误发送到已注册的 error 监听器并停止订阅.

```js
const { createHostClient } = await import(process.env.AUTOJS6_HOST_CLIENT_MODULE);
const host = await createHostClient();
const sensors = host.sensors;
console.log(await sensors.getAvailableSensors());
const sample = await sensors.once('accelerometer', { timeoutMs: 5000 });
console.log(sample.values);
const controller = new AbortController();
const sub = sensors.subscribe('accelerometer', event => console.log(event.values), {
    signal: controller.signal, samplingIntervalMs: 250, drainIntervalMs: 250,
});
sub.on('error', error => console.error(error));
try {
    await sub.ready;
    await new Promise(resolve => setTimeout(resolve, 1000));
} finally {
    await sub.close();
}
```

Worker 可将上述客户端初始化替换为 `import sensors from 'autojs6:sensors'`. 每个宿主执行最多同时有 4 个活动订阅, 包括 once 的临时订阅, 父线程和 Worker 共享额度. Worker 退出或被终止时释放其订阅, 包括退出后才返回的注册结果. 执行结束会释放该执行的所有传感器监听. 不支持的类型与缺失的硬件会明确失败, 不产生模拟样本.

Node.js 主线程保留协商后的事件推送; Worker 和 Bun 使用有界队列轮询. Bun 沿用每次执行最多 1024 次桥接调用, 4 个并行请求, 单次 RPC 10 秒, 64 KiB 请求和 256 KiB 响应限制. 每次轮询包含 start/poll 请求, 长时间或高频轮询会消耗额度; 不应把 Bun 的订阅视为无限时长数据通道. 应及时 close, 按业务需要调大 drainIntervalMs, 并处理额度或宿主退出错误. 本批没有开放任意 Android SensorManager/Java 对象, 也没有补齐 Rhino 的所有传感器类型.



## Bun 与 Node.js Worker 宿主 Shell

宿主 build 5583, Node.js Runtime 1.18.0 和 Bun Runtime 0.7.0 提供共同的异步宿主 Shell 封装. Node.js 主线程及 CommonJS/ESM/嵌套 Worker 使用 `shell` / `autojs6:shell` 与 `shizuku` / `autojs6:shizuku`. Bun 使用 `host.shell` 和 `host.shizuku`. Node 原生 child_process 与 Bun.spawn 仍按各自运行时的 UID 和文件系统工作; 这里的命令在宿主应用中执行.

Bun 插件中心的 shell.control, shell.root, shell.shizuku 为三个默认关闭的独立授权. 打包应用在 bun.hostCapabilities 中声明需要的授权. 普通命令需要 shell.control, Root/Shizuku 还需对应授权及设备许可. Node.js 项目相应声明 shell, shell.root, shell.shizuku. 声明 shell 不会隐式授予 Root/Shizuku. 打包时, shell.shizuku 会自动加入 Shizuku 的 Android API 权限声明; 每个应用仍需分别在 Shizuku 中授权.

### 执行与状态

| 方法 | 返回值 | 说明 |
| --- | --- | --- |
| exec(command, options?) | `Promise<ShellResult>` | 捕获 stdout/stderr, 非零退出码也返回结果 |
| execRoot(command, options?) | `Promise<ShellResult>` | 通过 su 执行, 可与 shizuku 组合 |
| execShizuku(command, options?) | `Promise<ShellResult>` | 通过已运行且已授权的 Shizuku 执行 |
| execFile(path, args?, options?) | `Promise<ShellResult>` | 对文件路径和每个参数分别引用, 支持宿主可访问的绝对路径; 无斜杠的相对文件名按 ./file 执行 |
| checkAccess(options?) | ShellAccessReport | 保留同步行为, 检查当前执行声明的授权, 不查询系统授权 |
| getAccess(options?) | `Promise<ShellAccessState>` | 查询宿主 UID, Root 可用性, Shizuku 运行/授权状态及缺少的声明 |
| requestShizukuPermission(options?) | `Promise<boolean>` | 显式触发当前应用的 Shizuku 授权, 默认等待 60000 毫秒, 不启动 Shizuku 服务 |
| setDefaultTimeout(ms) | number | 设置当前客户端的 exec 默认时限, 初始 30000 毫秒, 必须为正整数 |
| spawn(command, options?) | ShellProcess | 立即返回异步进程对象, await ready 等待创建 |
| open(options?) | ShellProcess | 创建读取 stdin 的持久进程, cmd 默认 sh /proc/self/fd/0 |

ShellResult 包含 code/stdout/stderr/timedOut/truncated. 超时返回 code=124 和 timedOut=true; AbortSignal 取消会拒绝 Promise, 错误名 AbortError, code 为 ABORT_ERR. maxOutputBytes 默认 1048576, 限制捕获的程序原始字节总数, 超出后继续排空输出并设置 truncated, 避免进程被管道堵塞. timeout 的诊断文字可以附加到 stderr. 启动失败或权限不足会拒绝 Promise, 不伪造成功结果.

checkAccess 的 root/shizuku 标志仅在请求检查相应项且声明满足时为 true. getAccess 提供 shell/rootAvailable/shizukuRunning/shizukuGranted/shizuku/uid/missingCapabilities; rootAvailable 表示 su 可用性, 不等于已获得 Root 授权. 这些报告中的能力名称使用 shell/shell.root/shell.shizuku, Bun 普通授权项对应 shell.control.

### 选项与工作目录

exec 接受 root/shizuku/adb/pty/cwd/env/timeoutMs/signal/maxOutputBytes. adb 是 shizuku 的别名. env 的值必须为不含 NUL 的字符串, 键为合法的环境变量名. 未指定 cwd 时, 普通命令使用宿主脚本工作目录, Shizuku 使用 / (Shizuku 身份通常无法进入宿主私有目录). 显式相对路径仍基于宿主脚本工作目录, 绝对路径由 Android 实际访问权限决定. 不再人为要求 cwd 或 execFile 路径留在工作目录内. Root 与 Shizuku 同时为 true 时, 在 Shizuku 进程中运行 su.

spawn/open 的 timeoutMs 默认 0, 表示不设置命令时限; signal 仍可取消, 执行结束时清理进程. drainIntervalMs 默认 25 毫秒; 没有输出时宿主一次轮询最多等待 250 毫秒. open 另接受 cmd 程序行. pty 启用伪终端, stderr 并入 stdout, 不提供 Java TermSession 对象. closeInput 在 PTY 上发送终端 EOF, 保留输出端; 若程序自行关闭规范输入模式, 应按其协议退出或调用 close 结束进程.

### ShellProcess

id/pid 在 ready 完成后有效, 之前分别为空字符串和 -1. command/mode 为命令和 sh/root/adb/adb+root 模式. closed/killed/exitCode/timedOut 反映客户端已接收的状态. exited 是进程退出码 Promise.

stdin/stdout/stderr 是实际的 node:stream 对象. 传输以分块二进制形式进行, 包含 NUL 或跨块 UTF-8 字节也不会被当作文本截断. stdout/stderr 支持 data/end/error 监听, setEncoding 和异步迭代; stdin 支持 write/end 及回压. 声明提供通用流接口, 更完整的 Node/Bun 原生流类型可配合相应运行时的类型库使用.

| 方法或事件 | 行为 |
| --- | --- |
| readLine() / readErrorLine() | `Promise<string 或 null>`, 异步读取一行, EOF 为 null |
| write(data) / writeLine(text) / closeInput() | `Promise<ShellProcess>`, 写入字节/文本或关闭 stdin |
| waitFor() | `Promise<number>`, 等待退出 |
| waitFor(timeoutMs) | `Promise<number 或 null>`, 到时未退出则为 null, 不结束进程 |
| kill() | `Promise<boolean>`, 结束进程树, 返回是否仍在运行; 继续读取输出以接收剩余数据 |
| close() | `Promise<boolean>`, 释放进程并丢弃尚未取出的宿主输出, 可重复调用 |
| on/once('output', listener) | 按行接收 stdout, 包含 EOF 前未换行的尾行 |
| on/once('errorOutput', listener) | 按行接收 stderr |
| on/once('exit' 或 'close', listener) | 接收退出码, 失败时可为 null |
| on/once('error', listener) | 接收桥接或流错误 |

同一输出流选择原始流, readLine 或 output/errorOutput 事件中的一种读取方式. 不混用读取方式. 持续产生输出的进程必须读取两路输出, 或在结束时调用 close; 宿主与客户端均使用回压, 不以无限缓冲换取表面上的持续执行. 不通过桥接返回 Java InputStream/OutputStream.

```js
let { createHostClient } = await import(process.env.AUTOJS6_HOST_CLIENT_MODULE);
let host = await createHostClient();
let proc = host.shell.open({ cmd: 'cat' });
try {
    await proc.ready;
    await proc.writeLine('hello');
    console.log(await proc.readLine());
    await proc.closeInput();
    console.log(await proc.waitFor());
} finally {
    await proc.close();
}
```

Node.js Worker 对应导入示例:

```js
import shell from 'autojs6:shell';
import shizuku from 'autojs6:shizuku';
let access = await shell.getAccess();
if (access.shizukuRunning && !access.shizukuGranted) {
    await shizuku.requestPermission();
}
let result = await shizuku.exec('id -u');
console.log(result.stdout);
```

shizuku 同时可作为函数调用, 并提供 exec/spawn/open/checkAccess/getAccess/requestPermission. 它强制使用 Shizuku, 不会退回普通应用身份执行. Root/Shizuku 授权失败, 服务退出或连接失败应由调用者处理.

### 生命周期与传输边界

每次宿主执行沿用 maxShellCommands 限制 (默认 2, Node 配置可为 0..4), 主线程与 Workers 共享. Worker 退出时清理它创建的进程, 包括退出后才返回的创建结果, 保留父线程自己的进程. 宿主执行结束, 显式取消和关闭会终止进程及当时可见的子进程; 忽略 SIGTERM 的命令也会被结束. 进程可以因 Android 或 Shizuku 的实际权限与生命周期而失败.

写入以 8 KiB 原始字节分块, 给 Base64 与 JSON 转义预留空间. 宿主最多排队 32 个 4 KiB 数据块, 单次 drain 最多取 8 个事件, 队列满时暂停读取而不丢字节. Node/Bun 客户端用可读流的回压暂停轮询. 这些队列大小不等于 Java/JS 对象的实际内存开销.

Bun 继续使用原有每次执行最多 1024 次桥接调用, 4 个并行任务, 64 KiB 请求, 256 KiB 响应及单次 RPC 10 秒的限制. start/poll 均消耗调用额度, Shell 流不能视为无限时长通道. 额度耗尽时宿主释放该执行的 Shell 进程. 长时间或大量数据可按实际场景使用 Node 原生 child_process 或 Bun.spawn, 它们的运行身份与宿主 Shell 不同.

## Bun 与 Node.js Worker 事件和通知

宿主 build 5584, Node.js Runtime 1.19.0 和 Bun Runtime 0.8.0 提供共同的事件与通知封装. Bun 使用 `host.events` 和 `host.notifications`; Node.js 主线程及 CommonJS/ESM/嵌套 Worker 使用 `autojs6:events` 和 `notifications` / `autojs6:notifications`. Node 原生 `events` 和 `node:events` 继续提供 EventEmitter, 不会被宿主事件模块替换.

### 授权与系统条件

| 操作 | Bun 授权 | Node.js 声明 | Android 条件 |
| --- | --- | --- | --- |
| 屏幕/电量监听 | events.observe | events | 系统广播 |
| 通知监听 | events.observe + events.notification | events + events.notification | 当前应用已获得通知使用权, 且通知监听服务已连接 |
| Toast 监听 | events.observe + events.toast | events + events.toast | 当前应用的无障碍服务已连接; 仅观察其他应用的 Toast |
| 按键监听 | events.observe + events.key | events + events.key | 当前应用的无障碍服务已连接; 不拦截按键 |
| 发送/取消通知 | notifications.post | notifications | Android 通知已启用; Android 13+ 需要 POST_NOTIFICATIONS |
| 打开通知设置 | notifications.post + notifications.settings | notifications + notifications.settings | 系统存在通知设置入口 |

六项 Bun 授权默认关闭, 在插件中心独立启用, 打包应用在 bun.hostCapabilities 中声明. Node.js 项目在 node.permissions 中声明. 通知发送权限与通知使用权不同, 任何一项都不隐式授予另一项. 打包配置会根据通知发送能力补入 POST_NOTIFICATIONS, 仍需实际系统授权. getPermissionStatus 查询的是发送通知的状态, 不代表已获通知读取权限.

### 事件模块

observeNotification/observeToast/observeKey/observeBroadcasts 均返回 `Promise<Subscription>`. 同一客户端重复观察同一来源会返回原有订阅. 主线程, 不同 Worker 和不同 Bun 客户端分别持有订阅, 不互相占用或关闭. observeBroadcasts 包含 screen_on, screen_off 和 battery_changed, 不提供任意 Intent 广播注册.

通知监听服务已获得系统授权但尚未连接时, observeNotification 会请求重新绑定并在本次调用时限内等待, 最多 4 秒; 未授权时仍立即拒绝. 屏幕/电量订阅使用 Android 返回的真实粘性电量快照初始化, 不模拟电量数据.

选项继承 timeoutMs/signal, 另有 drainIntervalMs, 默认 100 毫秒, 范围 25..60000. timeoutMs 用于单次桥接调用; signal 的作用覆盖订阅存续期. 注册前已取消会拒绝 Promise; 注册期间取消会回收迟到的注册结果; 已注册订阅取消时释放 Android 监听器.

模块与订阅提供 on/once/off. 可监听 event 通用事件, 或 notification/toast/key/battery_changed/screen_on/screen_off/overflow/close/error. 订阅具有只读 id/source/closed 属性, drainEvents(options?) 返回只读事件数组, close(options?) 返回 `Promise<boolean>`. 模块 close(options?) 关闭本客户端全部订阅并移除模块监听器, 完成后可以再次订阅.

事件是 JSON 快照, 包含 type/time/source. 通知增加 id/key/packageName/tag/title/text/postTime; Toast 增加 packageName/text; 按键增加 key/keyCode/action/repeatCount/eventTime, action 为 down/up; 电量增加 level/scale/percent/isCharging. 不返回 Notification/AccessibilityEvent 等 Java 对象, 不提供通知点击或回复动作.

Node.js 主线程沿用事件推送. Bun 和 Worker 使用有界队列轮询, 每个宿主订阅最多保留 128 个事件, 每次最多取出 32 项; 溢出丢弃最旧项并产生带 dropped 数量的 overflow 事件. 客户端推送缓冲也最多保留 128 项. 有监听器时自动消费, 无监听器时可显式 drainEvents; 同一订阅应选择一种消费方式. 无障碍/通知服务断开会发出带 reason 的 close 事件. 轮询失败会释放订阅, 不持续重复失败请求.

```js
let { createHostClient } = await import(process.env.AUTOJS6_HOST_CLIENT_MODULE);
let host = await createHostClient();
let subscription = await host.events.observeNotification();
subscription.on('notification', event => console.log(event.packageName, event.title));
subscription.on('error', error => console.error(error));
// 在业务结束时执行 await subscription.close().
```

### 通知模块

notify(options, callOptions?) 返回 `Promise<number>`, options 包含 id/title/text/channel/channelName/ongoing/priority. title 或 text 至少提供一个. id 为 1..2147483647 的整数, 省略时分配; priority 支持 min/low/default/high/max 或 -2..2. 通道的重要性由首次创建确定, 之后由 Android 的通道设置控制. 使用独立 low 通道可发送无声音的通知.

cancel(id, options?) 和 cancelAll(options?) 返回 `Promise<void>`, 仅取消当前客户端创建的通知. 不同执行或 Worker 即使使用相同数字 id 也不会互相覆盖. 同一客户端重复 id 会更新通知. Worker 退出, 宿主执行结束或取消期间迟到的发布结果均会清理, 不会删除父线程或其他执行的通知.

getPermissionStatus(options?) 返回 sdkInt/notificationsEnabled/postNotificationsPermissionRequired/postNotificationsPermissionGranted/canOpenSettings 及 schema. openSettings(options?) 与 openNotificationSettings(options?) 等价, 另外返回 opened/dryRun/action/reason; dryRun 为 true 时只检查入口, 不打开系统设置. 打开设置不等于获得授权.

```js
import notifications from 'autojs6:notifications';
let status = await notifications.getPermissionStatus();
if (status.notificationsEnabled && status.postNotificationsPermissionGranted) {
    let id = await notifications.notify({ title: '任务完成', channel: 'task-status-silent', priority: 'low' });
    // 在业务结束时执行 await notifications.cancel(id).
}
```

Bun 仍受每次执行 1024 次桥接调用, 四个并行任务, 64 KiB 请求, 256 KiB 响应和单次 RPC 10 秒的原有限制. start/poll 均计入额度, 不应视为无限时长事件通道. 额度耗尽会释放该执行的事件订阅和通知. 本批不提供任意 Android 广播, Rhino 全部 EventEmitter 扩展或任意原生通知操作.

## 设备控制与对话框

宿主 build 5585, Node.js Runtime 1.20.0 和 Bun Runtime 0.9.0 提供共同的异步设备控制和对话框接口. Node 主线程及 CommonJS/ESM/嵌套 Worker 可导入 `device` / `autojs6:device` 和 `dialogs` / `autojs6:dialogs`; Bun 使用 `host.device` 和 `host.dialogs`.

### 授权与设备信息

| 能力 | Node 声明 | Bun 独立授权 |
|---|---|---|
| 实时信息, 唤醒, 振动 | `device` | `device.control` |
| 亮度, 保持亮屏, 电池优化设置 | `device` + `device.power` | `device.control` + `device.power` |
| 媒体/通知/闹钟音量 | `media` + `media.audio` | `device.audio` |
| 输入/选择/进度对话框 | `dialogs` | `dialogs.control` |

Bun 的上述四项授权默认关闭, `device.info` 保留原有独立授权和格式. 打包项目在 `bun.hostCapabilities` 或 `node.permissions` 中声明能力. 构建器补入 WAKE_LOCK, VIBRATE, WRITE_SETTINGS 和 MODIFY_AUDIO_SETTINGS 对应清单项; 修改系统亮度仍需 Android 单独允许应用修改系统设置, 不会因项目声明自动获准.

`device.getInfo(options?)` 返回完整实时快照, 包含 build, screen, battery, memory, screenOn, locale, timeZone, uptimeMs 和 now. Node 的 `device.info()` 是其别名. Bun 的 `host.device.info()` 继续返回原有 Build 简要信息, 完整快照使用 `host.device.getInfo()`. Node 的同步 width/height/density/densityDpi 和 Build 属性是执行启动快照, Worker 继承它; Bun 使用异步 getter, 不提供这些同步属性.

实时 getter 均返回 Promise:

- 数值: getWidth, getHeight, getDensity, getDensityDpi, getBrightness, getBrightnessMode, getBattery, getSdkInt, getTotalMem, getAvailMem.
- 字符串: getRelease, getModel, getBrand, getProduct, getBoard, getBootloader, getHardware, getFingerprint, getBuildId.
- 布尔: isCharging, isScreenOn, isIgnoringBatteryOptimizations.

缺失的设备信息会拒绝 Promise, 不返回伪造的有效值. 内存单位为字节; 宽高为像素. 屏幕方向应读取实时信息, 不用 Node 的启动快照推断.

### 设备控制方法

| 签名 | 返回值与行为 |
|---|---|
| setBrightness(value, options?) | Promise<void>; 整数 0..255, 写入系统亮度设置 |
| setBrightnessMode(mode, options?) | Promise<void>; 0 为手动, 1 为自动 |
| keepScreenOn(timeoutMs, options?) | Promise<void>; 正整数毫秒, 替换当前客户端的定时亮屏锁 |
| cancelKeepingAwake(options?) | Promise<void>; 释放当前客户端的亮屏锁 |
| wakeUp(options?) | Promise<void>; 请求唤醒屏幕 |
| vibrate(durationMs, options?) | Promise<void>; 非负有限时长, 向下取整并限制为最多 10000 ms |
| getMusicVolume / getNotificationVolume / getAlarmVolume(options?) | Promise<number>; 当前音量 |
| getMusicMaxVolume / getNotificationMaxVolume / getAlarmMaxVolume(options?) | Promise<number>; 最大音量 |
| setMusicVolume / setNotificationVolume / setAlarmVolume(value, options?) | Promise<void>; 非负整数, Android 决定允许范围与勿扰模式限制 |
| openBatteryOptimizationSettings(options?) | Promise<object>; options.dryRun=true 仅检查, 不打开设置页 |

控制方法支持 timeoutMs 和 signal. 一般调用默认超时 5000 ms. 亮屏锁属于创建它的客户端; Worker 退出只释放自己的锁, 执行结束释放该执行的全部锁. Android 的用户设置, 电源策略和权限仍有最终决定权. 音量控制本身不播放测试音.

### 输入与选择对话框

| 签名 | 返回值 | 取消结果 |
|---|---|---|
| alert(title, message?, options?) | Promise<void> | undefined |
| confirm(title, message?, options?) | Promise<boolean> | false |
| input / prompt / rawInput(title, prefill?, options?) | Promise<string \| null> | null |
| select(title, items, options?) | Promise<number> | -1 |
| singleChoice(title, items, selected=-1, options?) | Promise<number> | -1 |
| multiChoice(title, items, selected=[], options?) | Promise<readonly number[]> | [] |

input, prompt 和 rawInput 都返回文本, 不执行输入的 JavaScript. message/prefill 可以省略, 直接传 options. items 接受 string/number/boolean 数组, 索引从 0 开始. multiChoice 成功返回按索引排序的选中项. options 的 positive/negative/neutral 自定义按钮文本; neutral 的结果与取消相同. select 使用列表项直接完成选择.

对话框依附宿主或打包应用的独立 Activity, 不依赖 Rhino UI 线程. 普通交互默认等待 30000 ms, timeoutMs 可调整, Bun 最大为 120000 ms. 用户取消返回上表值; 超时或 AbortSignal 取消拒绝 Promise 并关闭窗口. Worker/执行退出也会清理仍在等待或尚未附着 Activity 的窗口. Android 仍限制后台启动 Activity.

### 进度对话框

`dialogs.progress.show(descriptor?, options?)` 返回 Promise<ProgressHandle>, 默认等待创建完成的预算为 10000 ms. descriptor 支持 title, message, max (默认 100), value (默认 0) 和 indeterminate (默认 false); max 必须大于 0, value 必须在 0..max 范围内.

句柄包含 id, shown, title, message, max, value 和 indeterminate, 并提供 update(patch, options?) 和 dismiss(options?). update 返回新的只读状态, 句柄的属性也随成功更新变化; dismiss 返回是否关闭了仍存在的窗口. 对应模块方法为 progress.update(id, patch, options?) 和 progress.dismiss(id, options?), 默认超时 5000 ms. 同一客户端创建的句柄可由这些方法操作. 创建完成后不会受 show 的超时预算影响, 需要显式关闭或由 Worker/执行退出清理.

```js
"nodejs";
let device = require("autojs6:device");
let dialogs = require("autojs6:dialogs");
async function main() {
    let progress = await dialogs.progress.show({ title: "设备信息", max: 1 });
    try {
        let info = await device.getInfo();
        await progress.update({ value: 1, message: info.build.model });
    } finally {
        await progress.dismiss();
    }
}
main().catch(console.error);
```


## Android 对象辅助接口与日历任务

宿主 build 5586, Node.js Runtime 1.21.0 和 Bun Runtime 0.10.0 提供以下接口. Node 主线程及 CommonJS/ESM/嵌套 Worker 可导入 `android` / `autojs6:android`, `colors` / `autojs6:colors` 和 `tasks` / `autojs6:tasks`. Bun 使用 `host.android`, `host.colors` 和 `host.tasks`.

### 授权与对象生命周期

| 能力 | Node 声明 | Bun 授权 |
|---|---|---|
| Paint, ColorStateList, 主题色, 原生 URI | android.objects | android.objects |
| 持久日历任务与 IntentTask | tasks | tasks.control |
| 将颜色状态用于原生 View | ui | ui.layout |

Bun 的 android.objects 与 tasks.control 默认关闭. colors 的纯数值转换, tasks.daysToTimeFlag 和 tasks.timeFlagToDays 在本地执行, 无需这些授权. Node 和 Bun 的 colors 共享当前 Node 颜色转换实现.

Paint 和 ColorStateList 由宿主持有, 脚本通过异步句柄访问. 句柄属于创建它的执行; Worker 退出释放自己的对象, 执行结束释放剩余对象. 句柄不能跨执行使用. ColorStateList 还提供只读 states/colors 快照, 可直接作为原生 TextView 的 textColor. 快照中的值可以序列化, 操作方法仍需原执行中的有效句柄.

### Paint 与颜色状态

| 签名 | 返回值与行为 |
|---|---|
| android.createPaint(options?, control?) | Promise<PaintHandle>; options 支持 color, antiAlias (默认 true), strokeWidth (默认 0), textSize (默认 16) 和 style |
| paint.getInfo(control?) | Promise<PaintInfo>; 当前颜色, 抗锯齿, 线宽, 文字大小和样式 |
| paint.setColor(color, control?) | Promise<void>; 更新原生 Paint, 也更新句柄颜色快照 |
| paint.measureText(text, control?) | Promise<number>; 使用原生 Paint 测量文字宽度, 单位 px |
| paint.close(control?) | Promise<boolean>; 释放对象, 再次关闭返回 false |
| android.createColorStateList(descriptor, control?) | Promise<ColorStateListHandle>; descriptor.states 与 descriptor.colors 必须非空且长度一致 |
| stateList.getColorForState(states?, fallback?, control?) | Promise<number>; 使用 Android 颜色状态匹配, fallback 默认为 defaultColor |
| stateList.close(control?) | Promise<boolean>; 释放对象 |

Paint 的线宽和文字大小使用 px, 必须有限且非负; style 为 fill, stroke 或 fill_and_stroke. control 支持 timeoutMs 和 signal, 默认超时 5000 ms. 取消尚未确认的创建请求会释放后来返回的对象.

颜色状态支持 Android 属性整数, 或 enabled, pressed, focused, checked, selected, activated, window_focused 名称. 名称前加 `!` 表示不具备该状态; 空数组表示默认分支. Android 按 states 的顺序选择首个匹配分支, 应将默认分支放在最后. 句柄包含 defaultColor 和 stateful.

colors.createPaint, colors.createColorStateList 和 colors.setPaintColor 是对应辅助接口. colors.toColorStateList(color, ...colors) 保留旧接口的默认颜色行为, 使用首个颜色; 多状态颜色使用 createColorStateList 明确提供 states.

```js
"nodejs";
let colors = require("autojs6:colors");
let ui = require("ui");
async function main() {
    let stateList = await colors.createColorStateList({
        states: [["!enabled"], []],
        colors: ["#888888", "#1565C0"]
    });
    let text = await ui.createView("Text", { text: "颜色状态", textColor: stateList });
    let window = await ui.showLayout(text);
    try {
        await text.set({ enabled: false });
    } finally {
        await window.close();
        await text.dispose();
        await stateList.close();
    }
}
main().catch(console.error);
```

### 主题色与 URI

android.getThemeColor(control?) 和 colors.getThemeColor(control?) 返回 Promise<ThemeColor>, 包含 colorPrimary, colorPrimaryDark 和 colorAccent. colors.themeColor 为异步属性, 需使用 await; 持续读取最新主题可调用 getThemeColor. 主题快照可作为颜色输入, colors.toInt/toHex 等方法使用其 colorPrimary.

android.parseUri(value, control?) 返回原生 Android URI 的只读快照, 包含 value, scheme, authority, host, port, path, query 和 fragment; 缺失的字符串字段为 null, 缺失端口为 -1. null/undefined 输入返回 null.

android.getUriForFile(path, control?) 和 app.getUriForFile(path, control?) 返回 Promise<UriSnapshot>, 由当前应用的 FileProvider 为已存在路径生成 content URI. 相对路径以当前宿主执行目录解析. URI 本身不会授予其他应用读取权; 用 Intent 分享时仍需相应 URI 授权标志. app.parseUri 保留原有同步描述符接口.

### 持久日历任务

tasks 使用宿主任务页面相同的数据库和调度器, 创建结果为只读 JSON 快照. 已确认的任务在 Worker/脚本退出后保留, 需使用删除接口移除. 被取消且尚未确认的注册请求会清理其创建结果. 目标脚本在新的执行中运行, 使用目标项目的运行时及权限配置. 同一宿主进程的 Bun 调用在各自预算内排队, 等待可取消; 等待超时不会把尚未派发的调用标记为不确定执行.

| 创建方法 | 主要参数 |
|---|---|
| addTimedTask(options) | path/scriptPath/entry 与 repeatMode |
| addDailyTask(options) | path 与 time |
| addWeeklyTask(options) | path, time 与 daysOfWeek |
| addMonthlyTask(options) | path, time 与 dayOfMonth (1..31) |
| addYearlyTask(options) | path, time, monthOfYear (1..12) 与 dayOfMonth |
| addDisposableTask(options) | path 与 date |
| addCountdownTask(options) | path 与正整数 delayMs |

这些方法返回 Promise<TimedTask>. path 可以是已有脚本文件或声明了 project.json 的项目目录; 相对路径以宿主执行目录解析. repeatMode 支持 disposable/once, daily, weekly, monthly, yearly, countdown, 或对应数值 0..5. addTask(options) 根据 action/kind 选择 IntentTask, 否则创建日历任务.

time 接受本地 HH:mm[:ss[.SSS]], Date 或时间戳. date 接受 Date, 时间戳或日期时间字符串; 带时区偏移的字符串保留其实际时刻, 无偏移字符串按设备本地时间解析. daysOfWeek 中 0/7 表示周日, 1..6 表示周一至周六, 也支持英文星期名称及缩写.

日历重复按本地日期计算. 月末不存在的日期沿用宿主规则取当月末日; 非闰年的 2 月 29 日取 2 月末日. 夏令时缺失时刻向前跨过缺口, 重复时刻采用较早的一次. endMode 支持 forever, count 或 until_date; count 配合正整数 times, until_date 配合 YYYY-MM-DD 格式的 untilDate. delay, interval 和 loopTimes 沿用脚本执行配置, 默认分别为 0, 0, 1.

任务快照包含 id (数字), kind="timed", path, repeatMode, millis, timeFlag, nextTime, scheduled, finishedTimes, sourceKind, projectRoot 和 options. nextTime 是计划时刻, 实际启动受 Android 调度与运行时可用性影响. 构建器为 tasks 能力声明补入 RECEIVE_BOOT_COMPLETED, WAKE_LOCK 和 SCHEDULE_EXACT_ALARM; 特殊闹钟访问仍由 Android 决定. 宿主继续使用已有的 Alarm/WorkManager/JobScheduler 选择与降级规则. [Android 闹钟调度说明](https://developer.android.com/develop/background-work/services/alarms).

### IntentTask 与任务管理

addIntentTask(options) / addBroadcastIntentTask(options) 返回 Promise<IntentTask>. options 包含 path 与 action, 可选 category, dataType (MIME), local/isLocal. 默认接收外部广播; startup 动作默认 local=true. 本地和外部广播分别注册, category 和 MIME 条件参与匹配. 更新或删除后, 相应接收器按剩余任务重新注册.

IntentTask 快照包含 id, kind="intent", path, action, category, dataType, local, options 和 lastIntent. 本批 API 创建的任务在收到广播后保存最近一次 Intent 快照, 包括 action, data, type, categories, flags, extras 和 receivedAt. 更新时 category/dataType 设为 null 可以清除条件. 自定义广播接收依赖应用进程中的动态注册; 应用强停后需重新打开以恢复注册.

| 管理方法 | 返回值 |
|---|---|
| queryTimedTasks(options?) | Promise<readonly TimedTask[]>; 可按 path/scriptPath 和 repeatMode 筛选 |
| queryIntentTasks(options?) | Promise<readonly IntentTask[]>; 可按 path/scriptPath 和 action 筛选 |
| queryTasks(options?) | Promise<readonly Task[]>; 两类任务快照 |
| getTimedTask(id, control?) / getIntentTask(id, control?) | Promise<Task \| null>; 可传对应快照或数字 ID |
| updateTask(task, patch?) | Promise<Task \| null>; 根据快照 kind 更新并重新调度/注册 |
| removeTimedTask(id, control?) / removeIntentTask(id, control?) | Promise<boolean> |
| removeTask(task, control?) | Promise<boolean>; 推荐传含 kind 的快照, 数字或数字字符串按 timed 处理 |
| daysToTimeFlag(days) / timeFlagToDays(flag) | 本地同步转换; days 为 0..6, flag 为 0..127 |

tasks.sendLocalBroadcastSync(actionOrIntent, control?) 返回 Promise<boolean>, 表示本地事件提交结果, 不等待目标脚本运行完成. Intent 描述符可提供 action, category/categories, type, data 和 JSON 基础类型 extras. 本地事件不重播给新注册的接收器, 使用现有 64 项缓冲.

Node 的 autojs6:compat.tasks.addDisposableTask 保留旧 WorkManager 路径与字符串 ID, queryTasks 保留该旧作业查询. 新 tasks 模块返回本地任务数据库的数字 ID. compat 的 get/remove 根据 ID 类型兼容旧字符串作业, 日历和 Intent 方法转入新接口. 同时声明 tasks/work_manager 时, 无筛选的 compat.tasks.queryTimedTasks 包含两类结果. 新代码建议直接导入 autojs6:tasks.


## UI 与 Compose

**`Async`**

以下接口对应当前工作区的开发版本.

Node.js 主线程和 CJS/ESM/嵌套 Worker 可使用 `require('ui')` / `require('compose')`, 也可从 `autojs6:ui` / `autojs6:compose` 导入. 两个模块使用 `ui` 能力声明. Bun 使用 `host.ui` / `host.compose`, 在插件设置中分别开启 `ui.layout` / `ui.compose`, 默认均关闭. Compose 还需要已安装, 启用并授权且契约兼容的 3-Block Compose 插件. Android 悬浮窗权限仍由系统判断.

`ui.showLayout(descriptor)` 返回 Promise, 完成后取得窗口句柄. 描述树支持 Text, Button, Input, Image, Column/Row, ScrollView, List, Switch, Checkbox, Progress 和 Tabs 等现有原生布局组件. `ui.state(initial)` 与 `ui.bind(state, key)` 在运行时本地创建状态和绑定. 窗口提供 `on/once/off`, `update`, `batchUpdate`, `close` 和 `closed`; 更新和关闭返回 Promise. 事件回调在创建窗口的 JavaScript 线程执行. 此入口支持 JSON 描述树, XML 字符串或本次执行的 View 句柄; E4X 语法和 Java View 对象不跨运行时传输.

`compose` 提供 54 个 V1/V2 数据组件构造器及 AndroidView 互操作构造器, 包括 Text, Button, Column, TextField, LazyColumn, Scaffold, DatePicker, TimePicker 和 NavigationBar. 组件, `state`, `ref`, `modifier`, `batch`, `memo`, `theme` 都在本地处理. `isAvailable()` 与 `version()` 返回 Promise; `sessions` 是当前打开会话的快照. `mount`, `dialog`, `floaty` 和直接调用 `compose(root)` 都返回 `Promise<Session>`, 并等待窗口实际接入渲染器. 每个窗口有独立 Activity 或悬浮窗口生命周期.

```js
// Node.js 主线程或 Worker; Bun 改为 let compose = host.compose.
let compose = require('autojs6:compose');
(async () => {
let count = compose.state(0);
let window = await compose.mount(() => compose.Column({ padding: 16 },
    compose.Text({ text: 'Count: ' + count.value }),
    compose.Button({ onClick() { count.value++; } }, compose.Text({ text: 'Add' }))
));
// 完成后: await window.close().
})().catch(error => console.error(error));
```

组件参数遵循宿主组件目录, 颜色使用字符串或 ARGB 数字, 尺寸使用 dp/sp 数字或相应后缀字符串. Image.src 接受本次执行的图像句柄或 `@drawable/name`; 渲染器持有独立像素副本. 悬浮窗口选项 x/y/width/height 使用物理像素, width/height 的 -1/-2 表示 match_parent/wrap_content. `dialog` 的 type 为 alert 或 bottomSheet, cancelable 默认 true.

事件使用一个数据对象, 例如 `onValueChange(event)` 中的 `event.text`, `event.selectionStart`, `event.selectionEnd`, `event.editSeq`, `event.value`, 或 `onCheckedChange(event)` 中的 `event.checked`, 具体字段由组件决定. 回调中的 this 为对应组件. 跨渲染期间仍然有效的节点事件路由到当前已接受树的处理器. 文本框状态更新使用带原生编辑序号的编辑命令, 不直接覆盖原生输入缓冲区.

会话提供 `root`, `isClosed`, `update(callback)`, `post`, `on/off`, `render(root)`, `flush`, `setTheme` 和 `close`. `render`, `flush`, `setTheme`, `close` 返回 Promise; `flush` 等待当前排队的状态更新被宿主接受. `ref.current` 在帧接受后设置, 移除节点或关闭窗口时清空. 组件提供 `get/set`, `append/insert/remove/replace/clear/slot`, `on/off` 和异步 `focus/blur/scrollTo/edit`. 读写 Compose 数据组件属性使用 get/set; 下文另列原生 View 句柄的异步属性代理.

会话 `showSnackbar(message, options?)` 返回 Promise, 要求树中有使用默认 snackbarHost 的 Scaffold. options 支持 actionLabel, duration (short/long/indefinite), onAction 和 onDismiss, 每条消息至多触发一次终态回调. 悬浮会话还提供异步 `setPosition`, `setSize`, `getX/getY/getWidth/getHeight`, `requestFocus`, `disableFocus`, `setTouchable`; `session` 指向同一会话. 窗口旋转重建会保留组件状态, 已输入文本及事件路由.

该覆盖是可传输数据 API. Java View/Context 对象, 任意 Java 类构造器, 任意 Java 属性反射和原生悬浮窗调整框仍未纳入, 不应按同名模块推断这些入口可用. 未定义入口不会被模拟为成功. Node/Bun 仍不注入 Rhino 全局 `ui` / `compose`.

窗口及回调属于创建它们的执行. Worker 终止时关闭该 Worker 创建的窗口, 包括终止后才返回的创建结果, 主线程的其他窗口继续使用. 脚本结束关闭全部所属窗口. Bun 仍遵守 64 KiB 请求, 256 KiB 返回, 4 个并发请求和每次执行 1024 次调用的桥接限制; UI 事件读取也计入调用次数. 长时间界面脚本应观察失败事件并显式关闭, 不能把此次 API 扩展理解为取消现有运行时配额.

### 原生 View 与 XML compose 容器

以下互操作接口需要宿主构建 5562 及配套 Node.js 1.8.0/Bun 0.2.7 客户端. Bun 的 AndroidView 工厂和 XML attach 同时需要 ui.layout 与 ui.compose.

| 方法 | 异步结果与用途 |
| --- | --- |
| ui.context() | Promise<UiContext>, 包含执行标识, density/scaledDensity, packageName, runtimeVersionCode/applicationVersionCode |
| ui.inflate(layout, context?) | Promise<NativeViewHandle>, 从 XML 字符串或 JSON 描述树创建未显示的原生 View |
| ui.createView(type, props?, context?) | Promise<NativeViewHandle>, 创建受支持的原生组件, 可使用 TextView, Button, FrameLayout 和 Compose 等别名 |
| ui.findView(root, id) | Promise<NativeViewHandle \| null>, root 是 View 句柄或窗口 ID |
| ui.view(token) | 当前线程的句柄包装, 用于恢复 Worker structuredClone 传回的纯数据标识 |
| compose.AndroidView({ view }) | 本地组件; view 是句柄或返回句柄/Promise 的工厂函数 |
| compose.attach(container, root, options?) | Promise<Session>, container 必须是本次执行的 XML compose/Compose 容器 |

UiContext 提供异步 inflate/createView. View 句柄提供 get(), get(name), set(patch), findView(id), dispose() 和本地 on/once/off 监听. get 返回快照, 包含 id/type, width/height, enabled/visible/attached, contentDescription, 文本组件的 text 和勾选组件的 checked. set 不替换 type 或 children. XML 接受 vertical/horizontal/frame/compose/text/button/input 等受支持标签; w/h, layout_width/layout_height 和 android: 属性名会规范化. 尺寸默认 dp, px 后缀表示物理像素, `*`/match_parent 表示填满, auto/wrap_content 表示按内容计算. XML 不接受 DTD/实体, 最大 64 KiB, 深度 16, 节点 5000, 每层子节点 128.

AndroidView 工厂在创建组件的 JavaScript 线程执行, 接收数据 context, 通过其异步 inflate/createView 返回原始句柄标识. 可用 ui.view 包装该标识后读写属性. 工厂不是 Android Context 或 Android 主线程回调. 同一个组件节点保留工厂结果; 重新创建节点会重新调用工厂, 需要稳定身份时使用已有 View 句柄或 memo.

```js
// Node.js 主线程或 Worker; Bun 改为 let ui = host.ui, compose = host.compose.
let ui = require('ui'), compose = require('compose');
(async () => {
    let root = await ui.inflate('<vertical><text text="XML"/><compose id="content" h="300"/></vertical>');
    let window = await ui.showLayout(root);
    let native = await ui.createView('Button', { text: 'Native button' });
    let container = await root.findView('content');
    let session = await compose.attach(container, compose.AndroidView({ view: native }));
    native.on('click', event => console.log(event.type));
    // 完成后依次 await session.close(), native.dispose(), window.close(), root.dispose().
})().catch(error => console.error(error));
```

View 属于本次脚本执行, 可在 Node 主线程及 Worker 间传递标识, 配套宿主 build 5569 及客户端支持独立事件订阅, 主线程与 Worker 可分别读取事件. AndroidView 借用 View; 关闭会话后 View 仍可复用. 有父节点或已被其他会话借用的 View 会被拒绝, 不能将包含容器的 View 再借给该容器. 只有 inflate 的根句柄能 dispose, 子句柄是别名. dispose 前须关闭借用会话; 释放容器会关闭其附着会话, 包括尚未显示的容器. attach 在同一容器成功接入新会话后关闭旧会话; 若要复用旧会话借用的同一个 View, 应先关闭旧会话. 旋转后重新连接生命周期, 保留 View 身份和状态.

Worker 退出只关闭它创建的窗口和附着会话; 已传回的 View 属于整个执行, 仍可由主线程使用和释放. 未交付的异步 View 创建结果会在 Worker 退出后释放. ui.showLayout(XML) 创建的根由窗口管理; ui.showLayout(handle) 借用已有根, 关闭窗口后由调用方 dispose. 整次脚本结束释放全部 View.

### 常用 XML 组件与 View 属性代理

本节对应宿主构建 5563, Node.js Runtime 1.9.0/Bun Runtime 0.2.8 及配套客户端. Node.js 主线程与 CJS/ESM/嵌套 Worker 使用同一接口; Bun 通过 host.ui 调用, 仍需 ui.layout 授权. Compose 混合布局另需 ui.compose.

| XML 标签 | 原生组件 | 常用属性 |
| --- | --- | --- |
| hscroll | HorizontalScrollView | width, height, padding |
| space | Space | width, height |
| relative | RelativeLayout | 子项的 below/above, toLeftOf/toRightOf/toStartOf/toEndOf, alignTop/alignBottom/alignStart/alignEnd 和 alignParent/center 规则 |
| card | CardView | cardCornerRadius, cardElevation, backgroundColor |
| spinner | Spinner | entries/items, selectedIndex |
| seekbar | SeekBar | min, max, progress |
| ratingbar | RatingBar | numStars, stepSize, rating, isIndicator |
| radiogroup | RadioGroup | orientation, checkedId/checkedButton |
| radio | RadioButton | text, checked |
| toggle | ToggleButton | checked, textOn, textOff |
| checkedtext | CheckedTextView | text, checked |
| numberpicker | NumberPicker | min, max, value, wrapSelectorWheel, displayedValues |

这些标签及原生类名可用于 ui.inflate 的 XML/JSON 描述和 ui.createView. img 对应 ImageView, linear 对应线性布局. 原有 vertical/horizontal/frame/compose/text/button/input/image/scroll/list/switch/checkbox/progressbar 等标签继续可用. 相对布局规则只引用同一父容器中具有唯一 id 的兄弟组件, 同时接受 layout_below 等 layout_ 前缀. XML id 不可重复. 子项的宽高, 间距与 weight 会保留; weight 要求线性布局父容器, layoutGravity 要求线性/Frame/Drawer/Toolbar 父容器.

View 句柄现在支持直接属性赋值, 读取返回 Promise:

```js
// 位于 async 函数中; Node.js 使用 let ui = require('ui'), Bun 使用 let ui = host.ui.
let root = await ui.inflate('<vertical><spinner id="choice" entries="One|Two"/><seekbar id="level" max="100"/><text id="label" text="Ready"/></vertical>');
let window = await ui.showLayout(root);
let choice = await root.findView('choice');
let label = await root.findView('label');
choice.items = ['Alpha', 'Beta', 'Gamma'];
choice.selectedIndex = 2;
label.text = 'Queued';
label.text = 'Ready';
await choice.flush();
console.log(await choice.selectedIndex); // 2.
console.log(await label.text); // Ready, 等待此前该句柄的赋值完成.
// 完成后依次 await window.close(), root.dispose().
```

属性代理覆盖 46 个可写名称:

| 类别 | 属性 |
| --- | --- |
| 通用状态 | enabled, visible, visibility, alpha, contentDescription, clickable, focusable, backgroundColor |
| 布局 | width, height, padding, margin, gravity, layoutGravity, weight, orientation |
| 文本与输入 | text, hint, textSize, textColor, textStyle, singleLine, maxLines, inputType |
| 选择与数值 | checked, min, max, progress, indeterminate, rating, numStars, stepSize, isIndicator, items, selectedIndex, checkedId, textOn, textOff, value, wrapSelectorWheel, displayedValues |
| 卡片与图像 | cardCornerRadius, cardElevation, src, scaleType, adjustViewBounds |

另外提供 attached, layoutWidth, layoutHeight, drawableWidth, drawableHeight, xmlId 六个只读 Promise 属性. 原有 id/type/context 是同步句柄元数据; id 是执行所属句柄标识, xmlId 是 XML 中声明的 id. 属性是否适用取决于原生组件, 例如 text 属于文本控件, checked 属于 Checkable 控件, selectedIndex 属于 Spinner/ListView. 在不支持的组件上读写会拒绝, 不会模拟成功. get()/get(name)/set(patch) 继续可用, set 拒绝未知属性及身份/子树修改.

赋值依 JavaScript 线程内该句柄的顺序提交. 对象与数组在赋值时复制. `await view.flush()` 或下一次 await 属性读取会等待此前写入, 并抛出待报告的原生赋值错误; 报告后仍可继续修正属性. set(patch) 本身返回 Promise, 直接 await 即可接收错误. 非 JSON 值会同步拒绝. dispose 会先等待已排队写入, 即使某次赋值失败也会尝试释放原生根, 然后报告错误. flush 表示属性已提交, 不等于 Android 已完成下一次布局/绘制. 多个 Worker 同时操作同一个句柄时, 需要由调用方协调顺序和事件读取.

width/height/padding/margin/cardCornerRadius/cardElevation 的数字或 dp 字符串按 dp 写入, px 后缀表示物理像素; width/height 支持 match_parent/-1 和 wrap_content/-2. 几何, 间距及卡片尺寸的读取值是物理像素. textSize 按 sp 写入和读取, 写入也可指定 px. padding/margin 支持 1 项, 2 项 (水平/垂直) 或 4 项 (左/上/右/下). visibility 取 visible/invisible/gone; visible=false 等价于 gone. 颜色写入接受 Android 颜色字符串或 ARGB 数字, 读取返回 ARGB 整数; 非纯色背景可返回 null. textStyle 取 normal/bold/italic/bold|italic. inputType 支持原生整数及 text/textPassword/number/numberDecimal/phone/textEmailAddress. scaleType 接受 fitCenter/centerCrop 等 ImageView 缩放名称或原生大写名称.

entries 字符串使用 `|` 分隔; items 也可使用数组. selectedIndex 从 0 开始, 同时接受表示无选择的 -1, 原生读取也可能为 -1. ProgressBar/SeekBar 的 min 写入要求 Android API 26 及以上. NumberPicker 的 displayedValues 为 null 或长度等于 max-min+1 的字符串数组. 原生 widget 约束仍决定最终显示状态. 数值必须有限, alpha 为 0..1, numStars 为 1..100, stepSize 为 0.01..100, textSize 为 0..1000, maxLines 为 1..10000, 布局尺寸不超过 1000000, items 不超过 1024 项; 仍受桥接字节预算限制. 不合法的属性值在变更前校验.

ImageView.src 支持本次执行的图像句柄, @drawable/name, @android:drawable/name 或 null. 图像句柄使用独立像素副本, 原图释放后 View 仍可显示. 此入口不隐式打开宿主文件或 URL. 资源名称不存在及非图像句柄对象会被拒绝.

Spinner 通过 select 事件报告 selectedIndex/text. SeekBar 的 change 事件包含 progress/value/fromUser, 另有 startTracking/stopTracking. RatingBar 的 change 包含 rating/value/fromUser. RadioGroup 通过 change 报告 checkedId; ToggleButton/CheckedTextView 使用 checked/value; NumberPicker 使用 value/oldValue. Spinner 的初始化及程序设置也可能产生选择事件. ToggleButton 保留脚本提供文字的大小写.

Ace 默认运行时模式下会提示属性的 Promise 读取类型, 以及 ui.inflate 的普通 XML 字符串和无插值模板字符串中的标签/属性名. 其他对象的同名 inflate 方法不启用该提示. 这些扩展仍使用显式组件和属性目录, 任意 Java 反射及完整 Rhino XML 表达式绑定仍需后续实现.

### WebView, Drawer, Toolbar 与 ViewPager

本节需要宿主构建 5564, Node.js Runtime 1.10.0/Bun Runtime 0.2.9 及配套客户端. Node.js 主线程与 CJS/ESM/嵌套 Worker 使用同一 View 句柄方法, Bun 使用 host.ui, 需要 ui.layout. 所有方法返回 Promise, 与同一包装对象的属性赋值按调用顺序提交.

| XML 标签 / JSON 类型 | 属性与操作 |
| --- | --- |
| webview / WebView | url, html, javaScriptEnabled, domStorageEnabled; loadUrl/loadHtml, evaluateJavascript, goBack/goForward, reload/stopLoading |
| drawer / Drawer / DrawerLayout | drawerLockMode; openDrawer/closeDrawer; 子项使用 layout_gravity="start" 或 "end" |
| toolbar / Toolbar | title, subtitle, navigationIcon, navigationContentDescription, menu; showOverflowMenu/hideOverflowMenu |
| viewpager / ViewPager | currentItem, offscreenPageLimit; setCurrentItem |

这批增加 12 个可写属性, 合计 58 个. canGoBack/canGoForward, drawerOpenStart/drawerOpenEnd 和 pageCount 是新增的只读 Promise 属性. title 对 Toolbar 可写, 对 WebView 只读; progress 对 WebView 只读, 不改变原有 ProgressBar/SeekBar 的可写契约. 不支持的组件/操作组合会拒绝 Promise.

#### view.loadUrl(url)

**`Async`**

- **url** { [string](dataTypes#string) } - 交给 Android WebView 加载的地址.
- <ins>**returns**</ins> { [Promise](dataTypes#promise) } - 加载请求已提交.

完成页面加载应监听 pageFinished, 不能把本方法的完成当作页面加载完成. WebView 的网络, 明文 HTTP, 文件和内容访问由当前应用的 Android 权限, 网络安全配置及系统 WebView 决定. 不添加 Java 对象桥, 不自动批准网页摄像头/麦克风权限或绕过证书检查. 下载, 文件选择和自定义同步 WebViewClient/WebChromeClient 回调不属于本批接口.

#### view.loadHtml(html, baseUrl?)

**`Async`**

- **html** { [string](dataTypes#string) } - HTML 文本, MIME 为 text/html, 编码为 UTF-8.
- **[ baseUrl = null ]** { [string](dataTypes#string) | [null](dataTypes#null) } - 相对资源的基准地址.
- <ins>**returns**</ins> { [Promise](dataTypes#promise) } - 加载请求已提交.

html 属性赋值等同于不指定 baseUrl 的加载. url 与 html 不能在同一次 set 中同时出现. html 读取最后提交的 HTML 文本, 不读取当前 DOM; 页面导航后可为 null. url/title 读取当前 WebView 状态, 页面未准备好时可为 null.

#### view.evaluateJavascript(source, options?)

**`Async`**

- **source** { [string](dataTypes#string) } - 在当前页面执行的 JavaScript.
- <ins>**returns**</ins> { [Promise](dataTypes#promise) } - WebView 返回值解码后的 JSON 值.

javaScriptEnabled 默认 false, 需先显式赋值 true. domStorageEnabled 默认 false. 返回对象/数组/字符串等 JSON 值, 不返回包着 JSON 的字符串. 页面异常和不可序列化值遵循系统 WebView 的返回语义, 此接口不把网页 Promise 自动转换为宿主 Promise. 配套 Node 1.11.0/Bun 0.2.10 客户端使用异步原生任务, options.timeoutMs 默认 30000, 可设为 100..120000 毫秒; 超时或 View 销毁时拒绝. 用户等待对话框不会占住 Bun 的单次 RPC. goBack/goForward/reload/stopLoading 无参数, 返回 Promise; 无可用历史时遵循 WebView 行为.

WebView 事件包括 pageStarted/pageFinished (url), titleChanged (title), progressChanged (progress), webError (message, 可含 url/mainFrame/errorCode/didCrash) 和 httpError (url/mainFrame/statusCode). 根 View 释放或执行结束会停止并销毁所有 WebView, 包括 ViewPager 中未显示的页面; 渲染进程退出时报告 webError 并释放该 View.

#### view.evaluateJavascriptAsync(source, options?)

**`Async`**

- **source** { [string](dataTypes#string) } - 在当前页面求值的表达式, 可返回 Promise.
- **[ options ]** { [Object](dataTypes#object) } - timeoutMs 默认 30000 毫秒, 范围 100..2147483647.
- <ins>**returns**</ins> { [Promise](dataTypes#promise) } - 等待表达式及其 Promise 完成后的 JSON 值, undefined 转为 null.

需要 AutoJs6 build 5568, Node.js Runtime 1.14.0 或 Bun Runtime 0.2.13, 并启用 javaScriptEnabled. Node.js 主线程, CJS/ESM/嵌套 Worker 和 Bun 使用相同接口. 页面异常保留错误名称和信息; BigInt/循环引用等 JSON 序列化错误也会拒绝. DOM 对象, MediaStream 和 MediaRecorder 留在网页中, 只传递 JSON 数据或 blob URL.

等待页面结果不会阻塞 UI 命令队列, 因而权限回调, 暂停/停止录制和其他求值可以并行进行. 导航, 销毁 View, Worker 退出或超时会结束对应等待并清理结果槽. 普通 Promise 不具备通用取消能力: 超时不会撤销页面已执行的副作用, 应在 finally 中停止 MediaStreamTrack/MediaRecorder, 或销毁属于当前执行的 WebView. Worker 在借用其他线程的 View 时也应显式管理网页资源的生命周期. 关闭承载已获媒体授权网页的窗口时, WebView 导航到 about:blank 以释放摄像头/麦克风; 句柄仍可复用, 再次显示时需重新加载页面. Worker 退出关闭其窗口时也执行这一清理, 不关闭其他线程的窗口.

```js
let value = await web.evaluateJavascriptAsync('Promise.resolve({ answer: 42 })');
console.log(value.answer);
```

#### view.openDrawer(side?, animate?) / view.closeDrawer(side?, animate?)

**`Async`**

- **[ side = 'start' ]** { [string](dataTypes#string) } - start 或 end, 遵循布局方向.
- **[ animate = true ]** { [boolean](dataTypes#boolean) } - 是否播放开合动画.
- <ins>**returns**</ins> { [Promise](dataTypes#promise) } - 开合请求已提交.

Drawer 要求恰好一个不带侧栏 gravity 的内容子项, 两侧各至多一个侧栏子项. drawerLockMode 为 unlocked/lockedClosed/lockedOpen, 默认 unlocked. drawerOpenStart/drawerOpenEnd 读取原生开合状态. drawerOpened/drawerClosed 事件含 drawerId/side, drawerSlide 另含 offset, drawerStateChanged 含原生 state (0 空闲, 1 拖动, 2 动画中).

#### Toolbar 菜单与导航

navigationIcon 接受 @drawable/name, @android:drawable/name 或 null. menu 是数组, 每项必须有唯一非空 id 与 title; 可含 icon, enabled/visible (默认 true) 和 showAsAction (never/ifRoom/always, 默认 never). 赋值会替换原菜单. navigationClick 表示导航图标点击, menuClick 包含 itemId/title. showOverflowMenu()/hideOverflowMenu() 返回 Promise<boolean>, 由 Android 报告是否接受操作; 菜单需要已附着的可见 Toolbar. Toolbar 也接受普通子 View, layoutGravity 决定位置. 它不会自动成为 Activity 的 ActionBar.

#### view.setCurrentItem(index, smoothScroll?)

**`Async`**

- **index** { [number](dataTypes#number) } - 从 0 开始的页面索引, 必须小于 pageCount.
- **[ smoothScroll = true ]** { [boolean](dataTypes#boolean) } - 是否平滑滚动.
- <ins>**returns**</ins> { [Promise](dataTypes#promise) } - 切换请求已提交.

ViewPager 的直接子项组成固定页面集合, 页面填满容器. currentItem 赋值使用无动画切换, offscreenPageLimit 默认为 1, 可设为 1..128. findView 可查找未显示页面及其后代; set 不动态替换页面集合. pageSelected 包含 position/pageId, pageScrolled 包含 position/offset/offsetPixels, pageScrollStateChanged 包含 state. 通过 ui.showLayout(XML/handle) 显示的受管窗口在旋转时保留页面, WebView DOM 和事件路由.

```js
let ui = require('ui'); // Bun 改为 host.ui.
(async () => {
    let root = await ui.inflate('<vertical><toolbar id="bar" title="Pages"/><viewpager id="pages" h="180"><text text="One"/><webview id="web" javaScriptEnabled="true"/></viewpager></vertical>');
    let window = await ui.showLayout(root);
    let bar = await root.findView('bar'), pages = await root.findView('pages'), web = await root.findView('web');
    bar.menu = [{ id: 'next', title: 'Next', showAsAction: 'always' }];
    bar.on('menuClick', () => pages.setCurrentItem(1).catch(console.error));
    web.on('pageFinished', () => web.evaluateJavascript('document.title').then(console.log).catch(console.error));
    await web.loadHtml('<title>Portable WebView</title><p>Hello</p>');
    // 完成后依次 await window.close(), root.dispose().
})().catch(console.error);
```

Ace 同步提供上述方法, 属性, XML 标签与属性名提示. 这些组件不要求 JSOX 原型扩展.

### WebView 下载, 文件选择与客户端回调

需要宿主构建 5565, Node.js Runtime 1.11.0/Bun Runtime 0.2.10. Node 主线程, CJS/ESM/嵌套 Worker 和 Bun host.ui 使用相同的 NativeViewHandle 方法. 本批提供 19 个 WebViewClient 回调, 20 个 WebChromeClient 回调及 onDownloadStart, 具体字段和答复类型见配套声明.

| 方法 | 返回值与用途 |
| --- | --- |
| setWebViewClient(client, options?) | Promise<void>; 设置页面, 导航, 资源, 认证和安全回调; null 移除 |
| setWebChromeClient(client, options?) | Promise<void>; 设置标题, 对话框, 文件, 权限, 弹窗和全屏回调; null 移除 |
| setDownloadListener(callback) | Promise<void>; 设置下载通知; null 移除, 不自动开始下载 |
| chooseFiles(options?) | Promise<string[] \| null>; 系统文件选择, 取消返回 null |
| cancelFileChooser() | Promise<void>; 取消当前选择 |
| exitFullscreen() | Promise<boolean>; 退出受管 WebView 全屏 |
| download(options) | Promise<{id, url, fileName}>; 显式提交 Android DownloadManager 下载 |
| getDownload(id) | Promise<DownloadState \| null>; 查询当前应用的下载任务 |
| readDownload(id, offset?, length?) | Promise<Uint8Array>; 读取已下载文件, 默认最多 32768 字节 |
| cancelDownload(id) | Promise<boolean>; 移除任务和对应文件 |

回调接收 JSON 数据, this 是本地 View 包装器. 设置客户端会替换同类回调, 取消其尚未答复的请求. 自定义答复支持 Promise; 普通回调超时默认 15 秒, onShowFileChooser 默认 120 秒, callbackTimeoutMs 自宿主 5567 起可设为 100..2147483647 毫秒. 异常, 无效答复, 超时和取消会采用拒绝/取消结果; 异常和超时通过 webCallbackError 报告. 过期答复不会影响后续请求.

WebViewClient 回调如下. 通知回调无需返回值; 请求回调可直接返回表中的答复或相应 Promise.

| 回调 | 主要数据或答复 |
| --- | --- |
| onPageStarted, onPageFinished, onPageCommitVisible, onLoadResource | 通知 url/title |
| doUpdateVisitedHistory | 通知 url/title/reload |
| onScaleChanged | 通知 oldScale/newScale |
| onReceivedError | 通知请求信息, errorCode/message |
| onReceivedHttpError | 通知请求信息, statusCode/reasonPhrase/mimeType/responseHeaders |
| onReceivedLoginRequest | 通知 realm/account/args |
| shouldOverrideUrlLoading, shouldInterceptRequest | 通知请求信息与 blocked/intercepted |
| shouldOverrideKeyEvent, onUnhandledKeyEvent | 通知 keyCode/action, 前者另含 blocked |
| onFormResubmission | 返回 boolean/null, true 重新提交 |
| onReceivedHttpAuthRequest | 接收 host/realm, 返回 {username,password}/null |
| onReceivedSslError | 接收 url/primaryError, 返回 cancel/proceed/null |
| onReceivedClientCertRequest | 接收 host/port/keyTypes/principals, 返回 {alias}/ignore/cancel/null |
| onSafeBrowsingHit | 接收请求信息/threatType, 返回 backToSafety/proceed/showInterstitial/null |
| onRenderProcessGone | 通知 didCrash/rendererPriorityAtExit, 宿主释放该 WebView |

请求信息包含 url, method, mainFrame, hasGesture, redirect 和 headers. 设备未提供请求头时 headers 为空对象. 资源响应的数据流不跨进程传给回调.

| WebChromeClient 回调 | 主要数据或答复 |
| --- | --- |
| onProgressChanged, onReceivedTitle | 通知 progress 或 title |
| onReceivedIcon | 通知最多 64x64 的 PNG 缩略图 pngBase64/width/height |
| onReceivedTouchIconUrl | 通知 url/precomposed |
| onConsoleMessage | 通知 message/sourceId/lineNumber/level |
| onJsAlert, onJsConfirm, onJsBeforeUnload | 接收 url/title/message/defaultValue, 返回 boolean/null |
| onJsPrompt | 接收同上, 返回 string/null |
| onPermissionRequest | 接收 origin/resources, 返回允许的资源数组, `{ resources, requestAndroidPermissions? }` 或 null; 仅对象的显式选项会申请缺少的 Android 媒体权限 |
| onPermissionRequestCanceled | 通知已取消的 origin/resources |
| onGeolocationPermissionsShowPrompt | 接收 origin, 返回 boolean/{allow,retain?}/null |
| onGeolocationPermissionsHidePrompt | 通知定位请求已隐藏 |
| onShowFileChooser | 接收 acceptTypes/multiple/mode/captureEnabled/title/filenameHint/timeoutMs, 返回 URI 数组/null |
| onCreateWindow | 接收 url/dialog/userGesture, 返回空白 WebView 句柄/null |
| onCloseWindow, onRequestFocus | 通知网页请求关闭/聚焦 |
| onShowCustomView, onHideCustomView | 通知全屏开始/结束, 原生 View 由宿主管理 |
| getVisitedHistory | 返回已访问 URL 数组/null |

setDownloadListener 对应 Android 的 onDownloadStart, 仅接收通知数据.

Android 必须同步决定导航, 资源和按键处理. 这些决策通过 setWebViewClient 的 navigationRules, resourceRules 和 blockedKeyCodes 预先提交. 规则按顺序匹配 url/urlPrefix, 可进一步限定 method/mainFrame, 首条命中生效. 导航 action 为 allow/block; 资源 response 可提供 mimeType, encoding, statusCode, reasonPhrase, headers, body 或 bodyBase64. shouldOverrideUrlLoading/shouldInterceptRequest/shouldOverrideKeyEvent 只通知实际决策, 不能通过回调返回值改变它. onConsoleMessage 同样只通知, 使用 consumeConsoleMessages 选项控制原生返回值. 桥接不会为等待 JavaScript 而取消导航再调用 loadUrl.

onJsAlert/onJsConfirm/onJsBeforeUnload 返回 boolean, onJsPrompt 返回 string 或 null. 未配置处理器时, 已显示的 WebView 使用原生对话框. HTTP 认证返回 {username,password} 或 null; SSL 默认取消, 只有显式 'proceed' 才继续. 客户端证书可返回已授权 KeyChain 的 {alias}; Web 权限只允许请求资源的子集, 并仍须拥有 Android 摄像头/麦克风/定位权限. onCreateWindow 可返回新的空白执行内 WebView 或 null; 关闭借用窗口后再 dispose. 全屏可通过 fullscreen:false 禁用.

默认 HTML 文件输入使用系统文档选择器. chooseFiles 的 acceptTypes 是 MIME/扩展名数组, multiple 控制多选, initialUri 是 Android 8+ 的可选初始目录提示. onShowFileChooser 可 await this.chooseFiles(event), 或返回已有读取授权的 content URI 数组/null. 仅接受其他提供器的可读 content URI, 不接受任意路径或本应用任意私有提供器 URI, 下文专门登记的临时媒体捕获结果除外. 新获得的持久读取授权在 View 释放时回收, 已有用户授权保留. 自定义回调提供的临时授权按 Android 生命周期生效. 宿主 5565 支持 open/multiple; 5566 扩展拍照, 保存和目录选择, 详见下一节. captureEnabled 等信息传给自定义回调.

下载通知包括 url, userAgent, contentDisposition, mimeType, contentLength 和 Android 推断的 suggestedFileName. HTTP(S) 默认下载由 DownloadManager 保存到公共 Downloads; fileName 只能是文件名. 可配置 headers, mimeType, title, userAgent, includeCookies (默认 false). 任务在 View 关闭后保留, 通过 getDownload/readDownload/cancelDownload 管理. readDownload 的 offset 默认 0, length 为 1..32768. 宿主 5566 扩展 blob:/data: 及所选文档来源和目标, 详见下一节.

```js
let ui = require('ui'); // Bun 使用 host.ui.
(async () => {
    let web = await ui.createView('WebView', { javaScriptEnabled: true });
    let window = await ui.showLayout(web);
    await web.setWebViewClient({
        onPageFinished(e) { console.log(e.url); },
        shouldOverrideUrlLoading(e) { console.log(e.url, e.blocked); }
    }, { navigationRules: [{ urlPrefix: 'https://example.invalid/blocked', action: 'block' }] });
    await web.setWebChromeClient({
        onJsConfirm(e) { return e.message === 'Continue?'; },
        onShowFileChooser(e) { return this.chooseFiles(e); }
    });
    await web.loadHtml('<title>Files</title><input type="file" multiple>');
    // 完成后 await window.close(); await web.dispose().
})().catch(console.error);
```

窗口/会话关闭会取消待处理的原生 UI 请求, View 释放还会回收文件授权. Worker 退出清理自己注册的客户端和任务, 不覆盖其他线程的新注册; 配套宿主 build 5569 及客户端为共享句柄提供独立事件订阅. 原始 Java View/Bitmap 返回值, 已废弃数据库/配额回调及任意 Java 子类不属于本契约. 原生语义可参阅 Android 的 [WebViewClient](https://developer.android.com/reference/android/webkit/WebViewClient) 和 [WebChromeClient](https://developer.android.com/reference/android/webkit/WebChromeClient).

### WebView 拍照, 保存/目录选择与 blob/data 下载

以下能力需要宿主 5566, Node.js Runtime 1.12.0 或 Bun Runtime 0.2.11, 包括 Node CJS/ESM/嵌套 Worker.

#### view.chooseFiles(options?) 的扩展选项

**`Async`**

- **[ options.mode ]** { [string](dataTypes#string) | [number](dataTypes#number) } - open/0, multiple/1, directory/2, save/3. 未指定时根据 multiple 选择 open 或 multiple.
- **[ options.captureEnabled = false ]** { [boolean](dataTypes#boolean) } - image 接受类型优先调用系统相机拍摄完整图片. 宿主 5567 起扩展 video/audio 捕获, 详见下一节.
- **[ options.fileName ]** { [string](dataTypes#string) } - 保存模式的建议文件名, 其次使用原生 filenameHint, 默认 download.
- **[ options.writable ]** { [boolean](dataTypes#boolean) } - 目录默认请求读写权限, 可显式设为 false; 保存模式始终请求读写权限.
- **[ options.permissionMode ]** { [number](dataTypes#number) } - Android 37+ 原生回调提供的 0 (读取) 或 1 (读写), 未显式指定 writable 时采用此值.
- <ins>**returns**</ins> { [Promise](dataTypes#promise)<[string](dataTypes#string)[] | [null](dataTypes#null)> } - 所选文档/目录树 URI, 拍照 URI, 或取消结果.

save 使用系统创建文档流程, 同名文件由提供器处理为新的文件, 不覆盖原文件. directory 返回一个目录树 URI. initialUri 只是初始位置提示, 系统或提供器可以忽略它; Android 对存储根目录, Download 根目录和 Android/data/obb 的限制仍适用. 网页是否发出原生保存/目录请求取决于 WebView 版本, 显式 chooseFiles 不依赖该网页能力.

拍照使用系统相机和专用临时 JPEG 输出 URI, 不取缩略图. 如果应用已声明 CAMERA 权限却尚未获得授权, 会请求系统授权; 拒绝或取消返回 null. 拍照文件在所属 View 和使用它的下载任务释放后删除, 不自动发布到相册. 除此类登记过的拍照结果, 本应用其他私有提供器 URI 仍不接受. 自定义处理器可继续使用 `onShowFileChooser(e) { return this.chooseFiles(e); }`.

#### view.readDocument(uri, offset?, length?)

**`Async`**

- **uri** { [string](dataTypes#string) } - 有效读取授权的 content URI, 或尚未释放的拍照结果.
- **[ offset = 0 ]** { [number](dataTypes#number) } - 非负字节偏移.
- **[ length = 32768 ]** { [number](dataTypes#number) } - 本次最多读取的字节数, 1..32768.
- <ins>**returns**</ins> { [Promise](dataTypes#promise)<Uint8Array> } - 实际读取的字节. 继续读取时增加实际返回长度, 返回空数组表示文件结尾.

#### view.download(options) 的扩展来源和目标

**`Async`**

- **options.url** { [string](dataTypes#string) } - HTTP(S), data:, 当前页面可读取的 blob:, 或有读取授权的 content: URI.
- **[ options.destinationUri ]** { [string](dataTypes#string) } - 可写的空文档 URI, 通常来自 save 模式.
- **[ options.directoryUri ]** { [string](dataTypes#string) } - 可写目录树 URI, 在其中用 fileName 创建子文档. 与 destinationUri 互斥.
- **[ options.timeoutMs = 120000 ]** { [number](dataTypes#number) } - 页面/本地/SAF 传输的总时限, 100..2147483647 毫秒; 不改变 DownloadManager 的超时策略.
- <ins>**returns**</ins> { [Promise](dataTypes#promise) } - 下载任务 {id, url, fileName}.

任务 id 现在可能是 DownloadManager 的数字或以 web: 开头的不透明字符串. 将收到的 id 原样传给 getDownload/readDownload/cancelDownload, 不自行计算. 本地传输失败时状态额外包含 error, reason 保持数字; managed=false 表示已完成的所选 SAF 输出由用户保留.

blob 由来源页面按最多 32 KiB 分块读取, 有背压, 不注入 Java 接口. 需要启用 JavaScript 并保留来源页面; 导航或关闭来源页面会取消未完成的 blob 读取. data URL 支持百分号编码的二进制内容和 base64, 字面加号不变为空格. 大型内联 data URL 仍受运行时请求大小限制, 大数据应使用页面 blob URL.

传输先写入宿主临时文件, 完成后发布到公共 Downloads 或所选位置. destinationUri 已有内容时拒绝且保持原内容. 取消未完成任务会清理临时/不完整输出; 取消已完成的默认下载会删除其受管文件, 已完成的显式 SAF 文件则保留. 新持久读写授权按 View/传输引用回收, 既有授权保持不变. SAF 文件在 View 释放后的读取仍须拥有有效 Android 授权.

HTTP(S) 默认目标继续使用 DownloadManager; 其他本地/页面/SAF 传输由宿主进程执行, 不支持进程终止后续传. 已完成文件不会因来源 View 关闭而删除. Worker 使用相同的参数, 任务标识和字节结果; Worker 退出会关闭其所属窗口, 从而取消依赖该页面的未完成 blob 读取.

```js
let ui = require('ui'); // Bun 使用 host.ui.
(async () => {
    let web = await ui.createView('WebView', { javaScriptEnabled: true });
    let window = await ui.showLayout(web);
    try {
        let files = await web.chooseFiles({ mode: 'save', fileName: 'report.txt', acceptTypes: ['text/plain'] });
        if (!files) return;
        let job = await web.download({ url: 'data:text/plain;charset=UTF-8,' + encodeURIComponent('Hello'), destinationUri: files[0] });
        while (true) {
            let state = await web.getDownload(job.id);
            if (state.status === 'failed') throw Error(state.error || state.reason);
            if (state.status === 'successful') break;
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        console.log(new TextDecoder().decode(await web.readDocument(files[0])));
        await web.cancelDownload(job.id); // 清理任务记录, 已保存的 SAF 文档保留.
    } finally {
        await window.close();
        await web.dispose();
    }
})().catch(console.error);
```

参阅 Android [存储访问框架](https://developer.android.com/training/data-storage/shared/documents-files) 和 [FileChooserParams](https://developer.android.com/reference/android/webkit/WebChromeClient.FileChooserParams). 视频/音频捕获见下一节. 任意文件系统路径不属于文件选择接口.

### WebView 视频拍摄与录音捕获

宿主 5567 配套 Node.js Runtime 1.13.0/Bun Runtime 0.2.12, Node.js 主线程和 CJS/ESM/嵌套 Worker 使用相同接口.

#### view.chooseFiles(options?) 的媒体选项

**`Async`**

- **[ options.captureEnabled = false ]** { [boolean](dataTypes#boolean) } - 启用媒体捕获. acceptTypes 属于单一 image/video/audio MIME 家族时自动选择对应流程.
- **[ options.captureKind ]** { [string](dataTypes#string) } - image/video/audio, 在 captureEnabled 为 true 时明确选择捕获类型, 可用于混合或通配 acceptTypes. save/directory 模式仍使用 SAF.
- **[ options.videoQuality ]** { [number](dataTypes#number) } - 视频相机提示: 0 为低画质, 1 为高画质. 未指定时采用相机默认值.
- **[ options.durationLimitSeconds ]** { [number](dataTypes#number) } - 正整数秒, 1..2147483. 视频传给系统相机, 录音用于停止录制并等待确认.
- **[ options.sizeLimitBytes ]** { [number](dataTypes#number) } - 正安全整数字节数. 视频传给系统相机, 录音按原生编码器限制停止; 最后编码帧和容器开销可略超出该值.
- **[ options.timeoutMs = 120000 ]** { [number](dataTypes#number) } - 文件选择等待时限, 100..2147483647 毫秒. 到期取消选择并清理未确认的录制.
- <ins>**returns**</ins> { [Promise](dataTypes#promise)<[string](dataTypes#string)[] | [null](dataTypes#null)> } - 已确认的临时媒体 URI 数组, 或取消结果.

视频调用系统相机, 提供应用私有临时输出 URI. 画质/时长/大小均为相机提示, 各厂商处理方式可能不同. 相机若返回单独的可读 content URI, 宿主将内容复制为临时捕获结果; 不删除外部相机保存的原件. 本应用声明 CAMERA 而尚未获授权时, 先请求系统授权.

录音使用宿主前台界面, 提供开始, 停止, 使用录音和取消操作, 输出 AAC/M4A (audio/mp4, 48 kHz 单声道), acceptTypes 不用于选择其他音频编码. 不依赖系统是否安装录音 Intent 处理程序. 点击开始后才打开麦克风, 离开前台即停止录制, 返回后可确认已录内容; 旋转时保留同一录制并重建界面. 打包项目需要在 permissions 中声明 android.permission.RECORD_AUDIO, 并取得 Android 授权. Node 使用 ui 权限, Bun 使用 ui.layout 授权; 这是用户操作的文件捕获流程.

默认 HTML video/audio 文件输入和自定义 onShowFileChooser 均支持此能力. WebChromeClientOptions.callbackTimeoutMs 的范围为 100..2147483647 毫秒, 文件选择默认 120000, 其他异步回调默认 15000. 原生文件请求携带 timeoutMs, 可通过 this.chooseFiles(event) 转发. 调长文件选择等待时, 还应按需调整 Node/Bun 项目的总执行期限.

确认结果后, 可用 readDocument 分段读取, 或用 download 的 content 来源复制到 Downloads/已选 SAF 位置. 临时文件随 View 和正在使用它的传输引用释放. 取消, 页面跳转, 窗口关闭及 Worker 退出会关闭未完成的捕获; 录音不会转为隐藏的后台任务.

```js
let ui = require('ui'); // Bun 使用 host.ui.
(async () => {
    let web = await ui.createView('WebView', { javaScriptEnabled: true });
    let window = await ui.showLayout(web);
    try {
        let video = await web.chooseFiles({
            captureEnabled: true, captureKind: 'video',
            acceptTypes: ['video/*'], videoQuality: 1,
            durationLimitSeconds: 30, timeoutMs: 180000,
        });
        let audio = await web.chooseFiles({
            captureEnabled: true, captureKind: 'audio',
            acceptTypes: ['audio/*'], durationLimitSeconds: 15,
        });
        if (audio) console.log(await web.readDocument(audio[0], 0, 1024));
    } finally {
        await window.close();
        await web.dispose();
    }
})().catch(console.error);
```

参阅 Android [视频捕获 Intent](https://developer.android.com/reference/android/provider/MediaStore#ACTION_VIDEO_CAPTURE) 和 [MediaRecorder](https://developer.android.com/media/platform/mediarecorder). 这组文件捕获接口与网页 getUserMedia/MediaRecorder 流式 API 及屏幕录制接口分别使用各自的契约.

### 打包项目

宿主 5566 起, Bun 项目可在 project.json 设置 bun.timeoutMs, 默认 60000 毫秒, 按现有运行时范围限制为 1..600000 毫秒. 显式执行参数 bun.timeoutMillis 优先于项目设置. 打包应用采用同一设置; 拍照/文件选择和下载的等待时限不会延长整个项目的执行预算.

Node.js/Bun 项目 APK 使用已安装的外部 Runtime 插件和 3-Block Compose 插件, 自己的应用版本号可以从 1 开始. runtimeVersionCode 表示内置宿主运行库版本, applicationVersionCode 表示应用声明版本. APK Builder 需要匹配的 Runtime Kit (本批为 6.8.0+5567).

Node 项目通过 node.permissions 声明 ui. Bun 项目使用 projectType=bun 或 bun 入口标记, 并在 project.json 明确声明 bun.hostCapabilities, 例如:

WebView 网络加载和下载还需要打包项目的 Android INTERNET 权限. 在项目的 permissions 数组中保留 android.permission.INTERNET; Runtime 插件自身的联网权限不能替代打包应用的权限. HTTPS/明文流量仍遵循应用的 Android 网络安全配置.

Node.js/Bun 项目的执行总预算与 WebView 回调超时相互独立. Node.js 项目未设置 timeoutMs 时不限执行时长; 设置了 node.timeoutMs 的 Node.js 项目与 Bun 项目 (bun.timeoutMs 默认 60000 毫秒) 需要等待用户选择文件或操作界面时, 应留出足够的预算, 例如 `"node": {"permissions": ["ui"], "timeoutMs": 120000}`. evaluateJavascript 的 timeoutMs 不会延长整个项目的执行预算.

```json
{
  "projectType": "bun",
  "main": "main.bun.js",
  "permissions": ["android.permission.INTERNET"],
  "bun": { "hostCapabilities": ["ui.layout", "ui.compose"], "timeoutMs": 180000 }
}
```

示例只列出运行时相关字段, 应合并到完整的项目配置. Bun 打包应用不读取 AutoJs6 应用的授权开关, 未列出的能力不提供. 能力名称必须有效且不重复. 本批没有新增打包配置界面; 通过 project.json 配置. SDK 模块应随项目打包, 可从配套插件源码的 app/src/main/assets/autojs6/host-client.mjs 复制并相对导入. 普通宿主仍使用原有受保护服务; 打包应用通过独立的普通权限服务调用外部 Bun, 执行及取消按调用方 UID 隔离. 运行时代码仍是插件 UID 下的可信代码, 不是不受信任脚本沙箱. Android 权限及插件自身的运行条件仍需满足.

## 声明与 Ace 智能提示

`AutoJs6-TypeScript-Declarations` 提供三个独立入口:

- `declarations/autojs6/index.d.ts`: Rhino.
- `declarations/autojs6-node/index.d.ts`: Node 插件的公开宿主模块.
- `declarations/autojs6-bun/index.d.ts`: Bun 显式客户端的类型别名; 原始模块声明为同目录 `host-client.d.mts`.

同一类型检查项目应选择实际执行环境的入口. Node 自身标准库需要对应 Node 类型包; Bun 原生 API 需要对应 Bun 类型包. 这两套宿主声明不表示完整原生运行时类型已被收录.

Ace 在默认设置下根据脚本标记, 文件名和项目类型加载独立声明. Node 的 `require` / ESM 导入以及 Bun 示例中的 JSDoc / TypeScript 类型注解可获得成员提示. Node/Bun 不再混入 Rhino 的 `selector`, `ui.layout` 或 Java 全局; 已启用的 Android 声明选项也不会改变该边界.

Rhino 的 `jsox.extendAll()` 可按既有规则启用原型扩展提示. Node 使用 `require('jsox.mathx')` 等模块成员, 向显式目标安装扩展不等于修改全局 `Math` / `Array` / `Number`. Bun 客户端没有 JSOX 扩展入口.

### WebView getUserMedia / MediaRecorder 流式音视频

这组能力运行在系统 WebView 网页内. Node.js/Bun/Worker 通过 `evaluateJavascriptAsync` 控制网页的原生 `navigator.mediaDevices.getUserMedia` 和 `MediaRecorder`, 并通过已有的 `download` / `readDownload` 接收录制分片或最终文件. Node.js/Bun 全局没有因此增加 DOM 或 MediaRecorder 构造器.

前提是网页处于安全上下文 (可信 HTTPS 或本机 loopback), javaScriptEnabled 已启用, 系统 WebView 支持相应接口/编解码器, 宿主应用或打包应用已声明 CAMERA/RECORD_AUDIO. 打包应用需在项目权限中显式选择这两项. Chromium 麦克风采集还需要 MODIFY_AUDIO_SETTINGS 普通权限; APK Builder 1.2.6 起在选择 RECORD_AUDIO 时自动保留此配套权限, 使用其他打包器时需自行声明. 仅麦克风流不需要 CAMERA. MODIFY_AUDIO_SETTINGS 不替代 RECORD_AUDIO 的系统授权. Web 权限与 Android 权限分别裁决; 不安装信任证书, 不绕过 TLS 错误或安全上下文检查.

`onPermissionRequest` 返回数组时沿用只使用已有 Android 权限的行为. 返回 `{ resources, requestAndroidPermissions: true }` 时, 会为所选音频/视频资源申请缺少的 Android 权限. resources 必须是本次请求的子集; 请先核对 origin, 再明确选择需要的资源. 空数组/null, 未注册回调, 系统拒绝或清单缺少权限均不能取得流. 系统授权默认等待 120000 毫秒, 可通过 Chrome client 的 callbackTimeoutMs 调整; 导航, View 释放和客户端替换会取消尚未完成的授权. 已取得的流需调用 track.stop() 结束, 更换回调不撤回已经授予网页的权限.

下例假设 web 已加载自己的可信网页并收到 pageFinished. Node.js 使用 `require('ui')`, Bun 使用 `host.ui`; Worker 使用同一 ui 接口. `trustedOrigin` 必须来自脚本的可信配置, 不能无条件接受任意网页报告的 origin.

```js
let trustedOrigin = 'https://your-media-site.example';
await web.setWebChromeClient({
    onPermissionRequest(event) {
        if (new URL(event.origin).origin !== trustedOrigin) return null;
        return {
            resources: event.resources.filter(resource =>
                resource === 'android.webkit.resource.AUDIO_CAPTURE' ||
                resource === 'android.webkit.resource.VIDEO_CAPTURE'),
            requestAndroidPermissions: true,
        };
    },
}, { callbackTimeoutMs: 120000 });

try {
    await web.evaluateJavascriptAsync(`(async () => {
        if (!isSecureContext || !navigator.mediaDevices || !window.MediaRecorder) {
            throw new Error('Web media is unavailable');
        }
        window.stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        window.parts = [];
        window.recorder = new MediaRecorder(stream);
        recorder.ondataavailable = event => { if (event.data.size) parts.push(event.data); };
        window.stopped = new Promise((resolve, reject) => {
            recorder.onstop = resolve;
            recorder.onerror = event => reject(event.error);
        });
        recorder.start(1000);
        return true;
    })()`, { timeoutMs: 120000 });

    // 录制过程中取得一个分片, 可循环读取更多分片.
    let part = await web.evaluateJavascriptAsync(`new Promise(resolve => {
        let timer = setInterval(() => {
            if (parts.length) {
                clearInterval(timer);
                resolve({ url: URL.createObjectURL(parts[0]), size: parts[0].size });
            }
        }, 50);
    })`);
    let job = await web.download({ url: part.url, fileName: 'part.webm' });
    try {
        while (true) {
            let status = await web.getDownload(job.id);
            if (status.status === 'successful') break;
            if (status.status === 'failed') throw new Error(status.error || String(status.reason));
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        let bytes = await web.readDownload(job.id, 0, 32768);
        console.log(bytes.length); // Uint8Array; 大分片按 offset 继续读取.
    } finally {
        await web.cancelDownload(job.id);
        await web.evaluateJavascript('URL.revokeObjectURL(' + JSON.stringify(part.url) + ')');
    }

    await web.evaluateJavascriptAsync('new Promise(r => { recorder.onpause = () => r(true); recorder.pause(); })');
    await web.evaluateJavascriptAsync('new Promise(r => { recorder.onresume = () => r(true); recorder.resume(); })');
    let recorded = await web.evaluateJavascriptAsync(`(async () => {
        recorder.requestData();
        recorder.stop();
        await stopped;
        stream.getTracks().forEach(track => track.stop());
        let blob = new Blob(parts, { type: recorder.mimeType });
        return { url: URL.createObjectURL(blob), size: blob.size, mimeType: blob.type };
    })()`);
    // 使用 download({url: recorded.url, destinationUri}) 输出到已获授权的保存位置.
    console.log(recorded);
} finally {
    await web.evaluateJavascript(`
        if (window.stream) stream.getTracks().forEach(track => track.stop());
        if (window.recorder && recorder.state !== 'inactive') recorder.stop();
    `).catch(() => {});
}
```

`timeslice` 是目标分片间隔, 不是精确计时保证. `requestData()` 产生分片, `pause()`/`resume()` 控制录制, 最终 `stop` 事件发生在最后的 dataavailable 之后. 多个分片可能只有合并后才能独立播放, 应按产生顺序拼接并保留实际 mimeType; 扩展名应匹配该类型, 不应假设系统一定输出 MP4. 需要固定格式时先使用 `MediaRecorder.isTypeSupported()` 检查, 再传入 mimeType. 这些行为由 [MediaStream Recording 标准](https://www.w3.org/TR/mediastream-recording/) 和设备 WebView 实现决定.

持续录制应及时读取/上传分片并释放不再需要的 Blob 引用和 object URL. 示例为便于最终合并而保留 parts, 会随录制时长占用内存. 编码后的分片走 blob 下载, 每次 readDownload 最多 32768 字节, 不把整段录音/视频塞入一次 JSON 结果. 下载仍需在源网页有效期间完成. 页面跳转/销毁结束其媒体流及未完成的页面下载; 已完成输出沿用下载接口的保留规则. 具体设备的编解码器和远端 WebRTC 通话兼容性需另行验证. 屏幕共享与后台录制使用下一节的显式适配/原生接口.


### WebView 屏幕共享与后台录制

这组接口需要宿主 build 5569, Node.js Runtime 1.15.0 或 Bun Runtime 0.2.14. Node.js 主线程, CJS/ESM/嵌套 Worker 和 Bun 使用相同的 WebView 句柄方法.

#### view.enableDisplayCapture(options)

**`Async`**

- **options.origin** { [string](dataTypes#string) } - 当前可信网页的 HTTP(S) origin, 不含路径或查询参数.
- **[ options.maxWidth = 1280 ]** { [number](dataTypes#number) } - 编码帧的最大宽度, 1..8192.
- **[ options.maxHeight = 720 ]** { [number](dataTypes#number) } - 编码帧的最大高度, 1..8192. 保持宽高比.
- **[ options.frameRate = 5 ]** { [number](dataTypes#number) } - 最大送帧率, 整数 1..60. 实际帧率取决于设备负载.
- **[ options.timeoutMs = 120000 ]** { [number](dataTypes#number) } - 每次 Android 屏幕授权的等待时限, 100..120000 毫秒.
- <ins>**returns**</ins> { [Promise](dataTypes#promise) } - `{ id, installed: true, source: 'android-media-projection', audio: false }`.

在当前页面没有原生 getDisplayMedia 时, 显式安装兼容适配器到 `navigator.mediaDevices.getDisplayMedia`. 已有原生实现不会被替换. 页面必须处于安全上下文, origin 必须匹配; 每次调用都需要可见页面的用户激活, 并重新显示 Android MediaProjection 授权. 脚本求值或定时器不能代替点击手势, 不缓存或复用上次授权.

适配器将 Android MediaProjection 的实时帧传入页面 canvas, 返回可用于 MediaRecorder 的真实视频 MediaStream. 它不是系统 WebView 原生的屏幕采集实现, 不包含系统音频轨道. `audio: true` 也只返回视频; 如需麦克风, 可另行获得明确授权的 getUserMedia 音频流并组合轨道. 支持 video 的 width/height/frameRate 数字或 ideal/max 提示, 不接受 video:false 或 min/exact 约束. 屏幕输出保持初始 canvas 尺寸, 旋转后的画面按比例放入该尺寸. 当前一次安装只持有一个屏幕会话, 再次申请前先停止全部轨道及其克隆.

```js
let registration = await web.enableDisplayCapture({
    origin: 'https://your-media-site.example',
    maxWidth: 1280, maxHeight: 720, frameRate: 5,
});
// 下列代码属于该网页. button 必须由用户实际点击.
await web.evaluateJavascript(`
    document.getElementById('share').onclick = async () => {
        window.shared = await navigator.mediaDevices.getDisplayMedia({ video: true });
        document.getElementById('preview').srcObject = shared;
        window.recording = new MediaRecorder(shared);
        recording.start(1000);
    };
`);
```

最后一个视频轨道及其克隆停止时释放 Android 采集. Android 撤销授权时结束轨道; 页面导航, 关闭窗口, 销毁 View 或结束执行会取消共享. Worker 退出清理其安装, 并以安装 id 避免删除其他线程后续替换的安装. 兼容层一次只处理一帧, 不累积待传输截图队列. 页面 CSP 的 img-src 需要允许 data: 图像, 以便解码本地传入的 JPEG 帧. 它不保证低延迟远程 WebRTC 通话或高帧率游戏采集.

#### view.disableDisplayCapture(id?)

**`Async`**

- **[ id ]** { [string](dataTypes#string) } - 可选安装 id. 指定旧 id 时不影响新的安装.
- <ins>**returns**</ins> { [Promise](dataTypes#promise) } - `boolean`, 是否移除了匹配的安装.

停止待处理授权和活动共享, 移除当前页面的适配器. 完成 MediaRecorder 的 stop/dataavailable 及输出保存后再调用; 页面资源关闭后不能重新读取尚未保存的 Blob.

#### 后台网页录音

WebChromeClient 的 `onPermissionRequest` 对象回复增加 `backgroundCapture: true`. 在前台取得 CAMERA/RECORD_AUDIO 授权后, 为所选资源启动带停止操作的 Android 前台服务, 然后将资源授予网页. 麦克风流可在应用退到后台后继续录制, 仍需显式停止轨道及释放服务.

```js
await web.setWebChromeClient({
    onPermissionRequest(event) {
        if (new URL(event.origin).origin !== trustedOrigin) return null;
        return {
            resources: event.resources.filter(value => value === 'android.webkit.resource.AUDIO_CAPTURE'),
            requestAndroidPermissions: true,
            backgroundCapture: true,
        };
    },
});
```

前台服务不会覆盖 Chromium 的页面可见性策略. 已验证的 WebView 111/130 在页面隐藏时仍会将 getUserMedia 摄像头轨道置为 muted; 需要后台摄像头录像时使用下述原生文件录制 API. 不修改 document.hidden, 不伪装页面可见. 后台启动相机/麦克风服务仍可能被 Android 拒绝, 应从可见界面发起. 应用退到后台不等于关闭其窗口; 关闭窗口或停止执行会释放其资源.

#### view.startBackgroundRecording(options?)

**`Async`**

- **[ options.facing = 'back' ]** { [string](dataTypes#string) } - 'back' 或 'front'.
- **[ options.cameraId ]** { [string](dataTypes#string) } - 原生 Android 相机 id, 优先于 facing.
- **[ options.width = 1280 ]** / **[ options.height = 720 ]** { [number](dataTypes#number) } - 尺寸提示, 1..8192; 选择设备支持的相近录制尺寸.
- **[ options.frameRate = 30 ]** { [number](dataTypes#number) } - 帧率提示, 1..60; 返回实际支持的帧率.
- **[ options.bitRate = 4000000 ]** { [number](dataTypes#number) } - 正整数视频码率.
- **[ options.audio = false ]** { [boolean](dataTypes#boolean) } - 是否同时录制麦克风 AAC 音频.
- **[ options.durationLimitSeconds ]** / **[ options.sizeLimitBytes ]** { [number](dataTypes#number) } - 沿用媒体捕获的时长/大小限制, 达到限制后保存结果.
- **[ options.timeoutMs = 120000 ]** { [number](dataTypes#number) } - 权限及相机启动时限, 100..120000 毫秒.
- <ins>**returns**</ins> { [Promise](dataTypes#promise) } - `{ id, state: 'recording', cameraId, width, height, frameRate, audio }`.

使用 Camera2/MediaRecorder 输出 H.264/MP4, 可选 AAC 48 kHz 单声道音频. 这条路径独立于网页 getUserMedia/MediaRecorder 对象. 从可见 WebView 发起, 必要时请求应用已声明的 CAMERA/RECORD_AUDIO, 并启动相机/麦克风前台服务. 每个 View 同时持有一个录像, 活动期间可退到后台. 相机被其他应用占用, 权限拒绝或原生编码器失败时拒绝 Promise, 不返回空文件冒充成功.

#### view.getBackgroundRecording() / view.stopBackgroundRecording() / view.cancelBackgroundRecording(id?)

**`Async`**

- getBackgroundRecording 返回 idle/starting/recording/stopped/cancelled/failed 状态.
- stopBackgroundRecording 停止并保存结果, 返回 `{ id, state: 'stopped', reason, uri, mimeType: 'video/mp4', size, durationMs, cameraId, width, height, frameRate, audio }`. 达到限制或点击前台服务的停止操作也会保存可用结果.
- cancelBackgroundRecording 丢弃正在录制的临时文件并释放相机, 返回是否取消了活动录像. 可选 id 用于避免取消后来替换的录像.

完成后的 uri 是当前 View 持有的临时 content URI. 使用 readDocument 分段读取, 或用 download 复制到持久位置, 然后再销毁 View. 页面导航不影响独立的原生录像; 关闭所属窗口, 销毁 View 或结束执行会取消尚未保存的录像. Node Worker 退出时会取消其启动的原生录像, 包括借用父线程 View 的情况, 不取消其他线程后来启动的替代录像.

```js
let active = await web.startBackgroundRecording({ audio: true, facing: 'back' });
try {
    await new Promise(resolve => setTimeout(resolve, 10000));
    let movie = await web.stopBackgroundRecording();
    let job = await web.download({ url: movie.uri, fileName: 'recording.mp4' });
    // 等待 getDownload(job.id) 成功后再释放 View.
    console.log(active.id, movie.durationMs, job.id);
} finally {
    await web.cancelBackgroundRecording(active.id);
}
```

#### view.stopMediaCapture()

**`Async`**

- <ins>**returns**</ins> { [Promise](dataTypes#promise) } - `true`.

取消活动媒体, 原生未保存录像及屏幕共享, 释放前台服务, 并导航到 about:blank. 完成并保存网页 MediaRecorder 的结果或原生 stopBackgroundRecording 结果后再释放; 此方法本身不负责合并网页录制分片.

#### 打包权限与平台边界

屏幕共享项目需声明 FOREGROUND_SERVICE_MEDIA_PROJECTION; APK Builder 1.2.7 会保留其配套 FOREGROUND_SERVICE. 选择 CAMERA/RECORD_AUDIO 时, Builder 同时保留对应 FOREGROUND_SERVICE_CAMERA/FOREGROUND_SERVICE_MICROPHONE; RECORD_AUDIO 仍会保留 MODIFY_AUDIO_SETTINGS. 这些普通权限不会替代 Android 的相机/麦克风授权或每次屏幕共享授权.

本批后台行为指应用退到其他应用之后继续运行的受保护前台服务. 不承诺开机启动, 系统强停后恢复, 绕过屏幕锁定时的撤销, 厂商省电限制或无限时录制. Android 和 WebView 的限制仍然适用. 参阅 [Android 前台服务类型](https://developer.android.com/develop/background-work/services/fgs/service-types) 与 [Screen Capture 标准](https://www.w3.org/TR/screen-capture/).

## Java/Android 对象互操作

**`Async`**

Node.js 主线程和 CJS/ESM/嵌套 Worker 使用 `require('java')` 或 `import java from 'autojs6:java'`. Bun 使用 `host.java`. Node 项目声明 `java_interop`, Bun 使用默认关闭的独立 `java.interop` 开关, 打包项目在 `bun.hostCapabilities` 中声明该能力. `android.objects` 的画笔等辅助接口授权保持独立.

配套宿主提供已加载应用及 Android/Java 类的公开成员访问, 不再使用旧版本的九类白名单. `java.policy.access` 为 `public`; 空的 allowedClasses 不表示所有类被禁用. `describe` 查询当前设备实际可用的类和成员. 调用在宿主应用进程中运行, 不是 Node/Bun 插件进程; 打包后则在生成应用自己的进程中运行. Java 能力允许调用其公开 Android 接口, 不以其他窄接口开关再次过滤, 但系统权限, UID, SELinux 和 Android 隐藏 API 规则仍生效. 显式调用 Java 反射 API 同样遵守平台的反射规则.

| 方法 | 返回值及含义 |
| --- | --- |
| `type(className)` / `findClass(className)` | 本地同步 ClassDescriptor; 使用完整类名, 内部类用 `$` |
| `describe(classOrName, options?)` | `Promise<ClassSpec>`; 方法名, 字段名及构造/方法签名 |
| `new(classOrName, args?, options?)` / `create(...)` | `Promise<ObjectHandle>`; 调用公开构造器 |
| `callStatic(classOrName, method, args?, options?)` | `Promise<unknown>`; 静态方法 |
| `call(target, method, args?, options?)` / `callInstance(...)` | `Promise<unknown>`; 实例方法 |
| `getField(target, field, options?)` / `setField(target, field, value, options?)` | 异步读取/写入公开实例字段; 写入返回 boolean |
| `getStatic(classOrName, field, options?)` / `setStatic(classOrName, field, value, options?)` | 异步读取/写入公开静态字段; final 字段不可直接写入 |
| `getContext(options?)` | `Promise<ObjectHandle>`; 当前执行应用的 application Context, 不是 Activity |
| `getClassName(target, options?)` / `instanceOf(target, classOrName, options?)` | `Promise<string>` / `Promise<boolean>` |
| `newArray(componentType, lengthOrValues, options?)` | `Promise<ObjectHandle>`; 创建可修改的 Java 数组, 支持基础类型, 对象和嵌套数组 |
| `arrayLength(target, options?)` / `getArrayItem(target, index, options?)` | `Promise<number>` / `Promise<unknown>` |
| `setArrayItem(target, index, value, options?)` / `toArray(target, options?)` | `Promise<boolean>` / `Promise<readonly unknown[]>` |
| `cast(type, value)` | 本地同步 TypedValue, 用于选择重载, typed null 或精确数值 |
| `release(target, options?)` / `dispose(target, options?)` | `Promise<boolean>`; 释放该句柄引用, 再次释放返回 false |

ClassDescriptor 带 callStatic/new/create/getStatic/setStatic/describe 方法. ObjectHandle 带 call/callInstance/getField/setField/getClassName/instanceOf/arrayLength/getArrayItem/setArrayItem/toArray/release/dispose 方法, 无需重复传 target. 对象方法不可枚举, `toJSON()` 返回可克隆的句柄描述符. Worker 间传递后使用 `java.call(snapshot, ...)` 等模块方法; 克隆不会转移所有权或延长创建者生命周期.

参数接受 null/undefined, string, boolean, number, bigint, Java 句柄, 数组, TypedArray 和 cast 结果. 普通 JS 对象与函数不自动变为 Java Map 或回调. 可先构造 Bundle/HashMap 再逐项写入. 数组参数按声明的数组类型转换; Java 可变参数使用一个明确的数组参数, 不自动把尾随参数打包. 方法返回的数组是 JS 快照; 使用 newArray 创建并持有 Java 数组可观察原地修改.

默认按实际值匹配重载, 无法唯一确定时拒绝, 不依赖反射返回顺序. `options.parameterTypes` 指定准确的 JVM 参数类型名, 如 `['long', 'java.lang.String', 'byte[]']`; `java.cast('java.lang.String', null)` 区分可空引用重载. 非整数不会截断为 int. JS 不安全整数拒绝, 应传 bigint 或 `java.cast('long', '9223372036854775807')`. 返回的 long 在安全整数范围内是 number, 超出范围是 bigint. NaN/Infinity 使用可传输标记往返后恢复为 JS number. 这些标记由封装处理, 不需用户手写.

`options.thread` 为 `default` 或 `main`; 默认沿用桥接执行线程, Android View 等要求主 Looper 的操作应传 `main`. 每次调用单独指定. `timeoutMs` 默认 5000, `signal` 可取消等待, 但已进入 Java 的操作不承诺回滚或强制中断. Java 异常保留原因类名和消息; Node 使用 Java 桥接错误码, Bun 使用其既有 HostCallError 传输错误码.

```js
"nodejs";
let java = require('autojs6:java');

(async () => {
    let context = await java.getContext();
    let array = await java.newArray('int', [4, 1, 3]);
    let view;
    try {
        console.log(await context.call('getPackageName'));
        await java.callStatic('java.util.Arrays', 'sort', [array]);
        console.log(await array.toArray()); // [1, 3, 4].
        view = await java.new('android.widget.TextView', [context], { thread: 'main' });
        await view.call('setText', ['Hello'], { thread: 'main' });
        console.log(String(await java.getStatic('java.lang.Long', 'MAX_VALUE')));
    } finally {
        if (view) await view.release();
        await array.release();
        await context.release();
    }
})();
```

Bun 中把入口替换为 `const { createHostClient } = await import(process.env.AUTOJS6_HOST_CLIENT_MODULE); const java = (await createHostClient()).java;`. 文档示例只创建未附加的 TextView; 将 View 显示在窗口中仍需对应 UI 操作和系统条件.

对象句柄属于一次执行; Node Worker 创建的句柄在该 Worker 退出时释放, 父线程句柄保持有效. 取消后的迟到对象结果也会释放. release 只释放桥引用, 不自动调用未知 Java 对象的 close/recycle, 文件流等资源应先显式关闭. Context 句柄不能代替运行时权限申请. Java 回调/子类生成和 loadDex/loadJar 入口见下一节; Rhino 式同步包全局仍未实现. Bun 继续受 1024 次调用, 4 个并行请求和 JSON 大小上限约束; 本次没有修改原生 Bun 二进制或其兼容范围.

## Java 回调, 子类与代码加载

**`Async`**

配套宿主 build 5592, Node Runtime 1.23.0 与 Bun Runtime 0.12.0 增加下列接口. Node 主线程和 CJS/ESM/嵌套 Worker 使用 `java` / `autojs6:java`, Bun 使用 `host.java`. 继续使用 Node 的 `java_interop` 与 Bun 默认关闭的 `java.interop` 授权. `$autojs.java` 也提供 proxy/defineClass/loadDex/loadJar/wrap 等入口.

| 方法 | 返回值及用途 |
| --- | --- |
| `proxy(interfaces, implementation, options?)` | `Promise<ObjectHandle>`; 创建实现公开接口的生成代理对象 |
| `wrap(callback, interfaceName?, options?)` | `Promise<ObjectHandle>`; 默认实现 java.lang.Runnable, 也可指定其他单抽象方法接口 |
| `defineClass(definition, options?)` | `Promise<GeneratedClass>`; 生成真实 Java 子类 |
| `loadJar(paths, options?)` | `Promise<ClassLoaderHandle>`; 用宿主现有本地编译器把 JAR 中的 Java class 转成 DEX 并加载 |
| `loadDex(paths, options?)` | `Promise<ClassLoaderHandle>`; 加载标准 DEX 或含 classes.dex 的 ZIP/JAR/APK 代码容器 |
| `retain(handle, options?)` / `handle.retain(options?)` | `Promise<ObjectHandle>`; 为临时回调参数保留独立引用 |
| `closeCallbacks()` | `Promise<void>`; 关闭当前 java 对象建立的回调注册并停止轮询 |

### 接口代理与返回值

interfaces 接受完整类名, ClassDescriptor 或它们的数组. implementation 可为方法名到函数的对象; 单抽象方法接口可直接传函数. 代理通过生成类实现接口, 并非 java.lang.reflect.Proxy 实例. 没有覆盖的接口默认方法由 Java 执行. 默认方法有冲突时应明确提供覆盖.

```js
"nodejs";
let java = require('autojs6:java');

(async () => {
    let runnable = await java.wrap(async function () {
        console.log(await this.java.callStatic('java.lang.Math', 'max', [3, 9]));
    });
    try {
        await runnable.call('run');
    } finally {
        await runnable.release();
    }
})();
```

回调函数可返回普通值或 Promise. Java 等待它完成, 并按 Java 方法的返回类型转换结果. 转换规则包括精确 long/bigint, null 与 Java 对象句柄; 返回值不匹配时报告错误. methods 的键可用简单方法名覆盖同名重载, 或用 `compare(java.lang.Object,java.lang.Object)` 等完整参数签名选择一个重载. 所有抽象方法必须实现, static/final/private 方法不可覆盖.

普通 function 和对象方法中的 this 是 CallbackContext:

| 成员 | 含义 |
| --- | --- |
| `this.java` | 注册该回调的 java 封装 |
| `this.receiver` | 正在执行方法的代理/子类对象的临时句柄 |
| `this.method` / `this.signature` | 当前方法名与参数签名 |
| `this.callSuper(...args)` | 调用当前覆盖方法的具体父类实现, 返回 Promise |

箭头函数保持普通 JavaScript 的词法 this 规则. JavaScript 回调在注册它的 Node/Bun/Worker 中执行. 通过同一个 java 封装或回调对象句柄发起的 Java 调用会自动重入等待中的 Java 线程, 包括 Android 主线程. 有依赖的调用应依次 await; 不等待就返回的异步操作不保证在回调结束前完成. 通过其他客户端或 UI 模块发起的调用不属于这条 Java 重入通道.

对象参数和 receiver 是临时句柄, 回调结束后自动释放. 数组参数也是临时 Java 数组句柄, 可用 toArray 读取副本, 或用 setArrayItem 修改原始数组. 如需在回调结束后继续使用参数, 先 `await java.retain(value)`, 用完再 release. 回调返回 Java 对象时, 完成回传会先保存原生引用, 再释放临时句柄.

### 子类与构造器

definition 支持 name, extends, interfaces 和 methods. name 省略时生成唯一名称; extends 默认 java.lang.Object, 必须是公开且非 final 的类. 可调用父类的 public/protected 构造器, 覆盖 public/protected 实例方法. 参数按普通 Java 重载规则处理; `ClassDescriptor.new(args, options)` 的参数不包含内部回调分发器.

```js
let Generated = await java.defineClass({
    extends: 'java.lang.Object',
    methods: {
        toString: async function () {
            return '[JavaScript] ' + await this.callSuper();
        },
    },
});
let object = await Generated.new();
try {
    console.log(await object.call('toString'));
} finally {
    await object.release();
    await Generated.release();
}
```

父类构造器调用被覆盖的方法时, 回调已经可用. 需要 Android 主线程的构造或方法调用, 使用 `Generated.new(args, { thread: 'main' })` 或对应 call 选项. callSuper 仅适用于有具体父类实现的方法; 抽象方法和接口默认方法不提供这个快捷入口. 生成类可使用 ClassDescriptor 的构造, 静态访问与 describe 方法, 也带 release/dispose 和可克隆的句柄信息.

### JAR/DEX 与类加载范围

paths 接受一个路径或路径数组. 它们是宿主执行应用可读取的文件路径, 相对路径以宿主执行目录为基准, 不是运行时插件私有目录. 相互依赖的文件应在同一次调用中传入. loadJar/loadDex 与代理/子类创建的 timeoutMs 默认 120000; 回调本身的等待预算是另一项 callbackTimeoutMs.

```js
let loader = await java.loadJar(['lib/base.jar', 'lib/helper.jar']);
try {
    let Helper = loader.type('example.Helper');
    let helper = await Helper.new();
    try {
        console.log(await helper.call('toString'));
    } finally {
        await helper.release();
    }
} finally {
    await loader.release();
}
```

ClassLoaderHandle 提供 paths 和 type/findClass. paths 是私有只读代码副本的位置. 未指定加载器的 java.type/describe/new 也能查找本次执行已经加载的类. 加载器采用 parent-first 规则; 已加载同名类不会被后来文件热替换. release 释放加载器句柄, 不承诺 JVM 卸载类. 代码目录在执行退出且在途操作结束后清理, 不修改源文件. 不同执行不共享这些类定义.

加载过程遵循 Android 14 起的动态代码只读要求, 在打开目标文件后, 写入内容前将其设为只读. 参阅 [Android 动态代码加载要求](https://developer.android.com/about/versions/14/behavior-changes-14). JAR 必须与 Android 及宿主现有 D8/dx 编译器兼容; 本批未扩大旧 Android 的 Java 字节码兼容范围. 此入口仅加载代码, 不部署 APK/AAR 资源或 JNI 库.

### 错误与生命周期

CallbackOptions 提供 timeoutMs, signal, callbackTimeoutMs 和 onError. callbackTimeoutMs 默认 5000 ms, 范围 1..120000. 处理函数及完成回传中的错误交给 onError; 缺省写入控制台. 主动 Java 调用会拒绝其 Promise. Android 自行触发的回调在失败时记录日志, 并以基本类型默认值或 null 返回, 避免把 JavaScript 异常直接抛出到 Android 事件线程.

代理 release 会关闭该代理的回调. 生成类 release 会关闭其所有实例共用的回调定义. Worker 退出会关闭属于该 Worker 的回调并解除 Java 等待, 保留父线程的注册. retain 仅保留对象引用, 不转移回调所有权. 已关闭的残留原生监听器不会再执行 JavaScript; 使用后仍应从 Android 对象上解绑监听器. 已经开始执行的 JavaScript 函数或 Java 方法不承诺被强制中断.

回调注册存续期间会保持事件接收, 应及时 release 或 closeCallbacks. Bun 继续使用原有每次执行 1024 次调用和 4 个并发请求等预算; 轮询与每次返回值回传都会消耗预算, 不适用于无限期或高频逐帧回调. 普通并发 Java 调用遵守对象自身的线程安全规则.

对象快照的 value.string 使用对象标识, 避免序列化时隐式执行用户的 toString 并再次触发回调. 需要文字内容时明确 `await object.call('toString')`. 本批仍不注入 Rhino 的同步 Java 包全局, 不自动把任意函数实参转换为 Java 回调.

Bun 打包应用隐藏启动页和日志页时, 与 Node 一样使用现有的 12 秒启动可见性窗口, 避免运行时尚在初始化就关闭启动 Activity. 实际脚本 UI 出现后由其窗口保持前台状态; 该启动窗口不承诺长期后台驻留.

## Node.js / Bun / Worker 的文字转语音

宿主 build 5603, Node Runtime 1.24.0 与 Bun Runtime 0.13.0 提供直接 TTS 接口. Node 使用 `require('tts')` 或 `import tts from 'autojs6:tts'`, 显式兼容对象提供 `$autojs.tts`; Bun 使用 `host.tts`. Node 的 CJS, ESM 和嵌套 Worker 使用同一接口. 不向 Node/Bun 注入 Rhino 的全局 tts/$tts.

Bun 需要在插件中心单独开启 tts.control. 打包应用在 bunConfig.hostCapabilities 中声明 tts.control; Node 项目在 nodeConfig.permissions 中声明 tts. 此能力允许朗读及宿主执行应用可访问位置的音频文件输出, 不请求麦克风权限, 不自动安装引擎或下载音色.

### 方法与返回值

TTS 使用与 [Rhino TTS](tts) 相同的 Android 服务, 队列, 参数校验, 文本分段和文件发布逻辑. SpeechOptions, SynthesisOptions, EngineQuery, VoiceFilter 及查询结果字段沿用该模块定义. 字符串文本和文件路径须明确传入, 不隐式转换任意 Java 对象.

| 方法 | 运行时客户端返回值 |
| --- | --- |
| tts(text, options?, callOptions?), speak, enqueue | Promise<Result>, 等待朗读完成 |
| utterance/speakTask, enqueueUtterance/enqueueTask | Promise<Utterance>, 取得可观察的朗读任务 |
| synthesize/synthesizeToFile | Promise<Result>, 等待音频文件完成 |
| synthesis/synthesizeTask/synthesisTask | Promise<Utterance>, 取得文件合成任务 |
| silence | Promise<Result>, 等待静音时段完成 |
| silenceTask | Promise<Utterance>, 取得静音任务 |
| ready, engines, voices, languages, isLanguageAvailable, languageAvailability | Promise, 返回对应引擎, 音色或语言结果 |
| stop/stopAll, reset, isSpeaking, isBusy, status | Promise, 控制或查询当前客户端 |
| defaults/config, configure | Promise<Defaults>, 读取或修改当前客户端默认值 |
| openSettings, installData | Promise<boolean>, 请求打开系统设置或引擎数据安装页面 |
| close | Promise<boolean>, 关闭当前客户端及其任务; 后续调用可重新创建客户端 |

callOptions 是独立的最后一个参数, 提供桥接 timeoutMs 和 signal. 任务 options 中的 timeout/timeoutMillis/timeoutMs 控制 TTS 任务本身, 与桥接请求超时不同. 创建任务的桥接请求完成后, result 会继续等待任务结果.

maxInputLength 为 3999, maxSynthesisFileSize 为 536870912, QUEUE_FLUSH 为 'flush', QUEUE_ADD 为 'add'. 常量访问和 getMaxInputLength 是本地同步操作. 模块与任务的 on/once/off/removeAllListeners 也同步返回原对象; 其他表内方法需要 await.

engines 查询直接读取系统引擎目录, 不初始化默认引擎. 默认引擎初始化失败时仍可列出其他已安装引擎. engines 的 engine 参数仅标记结果中的 requested 字段; 如需验证引擎能否工作, 使用 ready 或实际合成.

### 文件合成与任务事件

```js
"nodejs";
let tts = require('autojs6:tts');
try {
    let voices = await tts.voices({ offlineOnly: true, installedOnly: true });
    if (!voices.length) throw new Error('No installed offline voice');
    let task = await tts.synthesis('你好', 'hello.wav', {
        voice: voices[0].name,
        audioEvents: true,
    });
    task.on('audio', info => console.log(info.data.byteLength));
    let result = await task.result;
    console.log(result.path);
} finally {
    await tts.close();
}
```

Bun 先通过 AUTOJS6_HOST_CLIENT_MODULE 加载 SDK 并 createHostClient, 再将上例的 tts 替换为 host.tts. 文件合成不会播放声音. 朗读需要静音时使用 `{ volume: 0, usage: 'media' }`; 此选项不修改系统音量. silence/silenceTask 生成静音时间段, 不生成提示音.

相对输出路径以宿主脚本执行目录为基准. 实际访问权限由执行应用的 Android UID 和存储授权决定, 不是运行时插件的私有目录. 文件先写入暂存位置, 完成后发布; overwrite 默认为 true. overwrite: false 保留原文件, 目标存在或文件系统不支持原子不覆盖发布时拒绝. createDirectories/mkdirs 控制目录创建. 文件合成最多接受 3999 个 UTF-16 单元, autoSplit 仅对朗读生效.

Utterance 提供只读 id, operation, text, state, isDone 和 result. `await task.stop()` 与 `await task.cancel()` 请求停止该任务并返回任务本身; result 随后以 ABORTED 错误拒绝. 已完成任务的停止请求没有额外作用.

任务事件为 queued, start, chunk, range, synthesis, audio, done, stop, cancelled 和 error. audio.data 为 Uint8Array; 只有 audioEvents/emitAudio 开启时才接收音频数据. 具体的 range/audio 事件仍取决于 Android 引擎实际提供的回调. 模块事件使用 `{ id, value }` 包装同类任务事件. 处理函数在创建任务的 JS 运行环境中执行.

### 隔离, 取消和运行条件

每个 Node 主线程, Worker 或 Bun SDK 客户端分别持有 TTS 服务与默认配置. stop/reset/close 作用于该客户端; Worker 退出释放自己的服务, 保留父线程的任务. 脚本结束释放本次执行的全部服务. 关闭客户端会使尚未完成的任务拒绝, 应等待结果并在 finally 中清理.

桥接仅取回客户端已经取得句柄的任务事件, 防止并发创建时遗漏完成通知. 进度接收有容量上限, 音频数据消费不及时会以 AUDIO_BACKPRESSURE 失败, 不无限缓存 PCM. Bun 保留原有每次执行 1024 次宿主调用及并发预算; 事件轮询也消耗预算, 不适合无限期音频流.

引擎与音色需要在设备上实际可用. voices 的 installedOnly/offlineOnly 过滤不触发安装或联网下载; installData 仅请求系统或引擎提供的页面, 不保证该页面存在. 系统引擎失败, 不支持的语言或音色, 输出失败和超时通过 Promise 拒绝报告. 任务结果错误使用 ERR_AUTOJS6_TTS_ 前缀的 code, 例如 ERR_AUTOJS6_TTS_ABORTED; 引擎提供时另有 errorCode. Bun 的普通查询请求还可能返回 HostCallError 的桥接错误代码.

此接口不等同于 speech 的语音识别, 唤醒词或模型管理接口. Android 后台执行限制仍然适用; TTS 不自动建立永久前台服务.

## Node.js / Bun / Worker 的语音识别与模型管理

宿主 build 5620, Node Runtime 1.25.0 和 Bun Runtime 0.14.0 的开发版本提供 speech 接口. Node 使用 `require('speech')` 或 `import speech from 'autojs6:speech'`, 显式兼容对象提供 `$autojs.speech`; Bun 使用 `host.speech`. Node 的 CJS, ESM 和嵌套 Worker 使用相同接口. 全局 speech/$speech 仍只属于 Rhino.

此接口复用 [Speech](speech) 的 3-Macaw Speech 插件, 模型目录, 参数校验和文件处理. 需要安装并启用兼容的语音插件, 并准备对应模型. 识别音频不上传; models.install 与 models.refreshCatalog 会访问模型分发源. 安装模型和接受许可均由调用者显式请求.

### 授权和入口

Bun 需要单独开启 speech.control; 打包应用在 bunConfig.hostCapabilities 中声明 speech.control. Node 项目在 nodeConfig.permissions 中声明 speech. 该权限覆盖插件发现, 模型管理, 文件/PCM 识别, 麦克风会话, 唤醒及合成, 不要求同时授权 tts.control.

麦克风由语音插件进程录制. 插件自身必须持有 RECORD_AUDIO, 可通过 capabilities().microphoneGranted 查询. 宿主或打包应用的麦克风权限不能代替插件权限. Android 的后台收音和前台服务要求仍适用.

普通签名的打包应用需要宿主 build 5621 的 Runtime Kit 和提供独立打包入口的 3-Macaw Speech 1.1.0 (build 69 及以上). 构建器按 speech/speech.control 声明保留 org.autojs.plugin.speech.permission.RUNTIME 权限, 原宿主签名接口保持不变. 文件/PCM 识别和模型管理不需要调用应用的麦克风权限; 使用 mic 听写或 wake 时, 项目的 permissions 还需包含 android.permission.RECORD_AUDIO, 并获得该应用自己的 Android 运行时授权. capabilities().microphoneGranted 仍仅表示语音插件的授权.

各应用共用插件中的模型与默认模型配置. 模型管理变更作用于该共享模型库, 独立打包入口仅接受发起应用的长操作取消请求. 当前插件的 detectVoice 使用内置 vad.silero.v5; 此内置条目不能当作下载模型安装, 删除或切换默认值.

```js
"nodejs";
let speech = require('autojs6:speech');
try {
    let models = await speech.models.list({ kind: 'asr', installed: true });
    if (!models.length) throw new Error('No installed recognition model');
    let result = await speech.recognize('voice.wav', { model: models[0].id });
    console.log(result.text);
} finally {
    await speech.close();
}
```

Bun 通过 AUTOJS6_HOST_CLIENT_MODULE 加载 SDK 并 createHostClient, 再使用 host.speech. 输入/输出路径属于宿主执行应用, 按脚本工作目录解析相对路径, 也支持绝对路径. 不接受 content:// 等 URI.

### 方法和返回值

以下方法均返回 Promise; Rhino 的同步方法名在此保留, 调用时需要 await. recognizeAsync, synthesizeAsync 和 models.installAsync 也保留.

| 方法 | Promise 的结果 |
| --- | --- |
| isAvailable(callOptions?) | 是否存在兼容且启用的插件; 未安装时为 false, 桥接授权错误仍会拒绝 |
| capabilities(callOptions?) | 插件版本, 功能, 目录版本, 引擎及 microphoneGranted |
| recognize(source, options?, callOptions?) / recognizeAsync | Recognition, 包含 text, segments, durationMillis, modelId 和 warnings |
| detectVoice(source, options?, callOptions?) | segments 和 durationMillis |
| listen(options?, callOptions?) | pending 状态的 Session |
| wake(keywords, options?, callOptions?) | pending 状态的 WakeSession |
| diarize(file, options?, callOptions?) / diarizeAsync | 说话人分离结果 (segments, speakers, durationMillis, modelId, 以及 identify 时的 names) |
| detectLanguage(file, options?, callOptions?) / detectLanguageAsync | 语种识别结果 (language, candidates, segments, durationMillis, modelId) |
| tag(file, options?, callOptions?) / tagAsync | 音频标签结果 (labels 及 timeline 时的 windows) |
| speaker.enroll(name, files, options?, callOptions?) / speaker.enrollAsync | 录入声纹后的 name, samples, durationMillis, modelId |
| speaker.verify(name, file, options?, callOptions?) / speaker.verifyAsync | 是否为该说话人的 score, matched, threshold |
| speaker.identify(file, options?, callOptions?) / speaker.identifyAsync | 最相近的说话人及 candidates |
| speaker.list(callOptions?) | 已录入的说话人数组 |
| speaker.remove(name, callOptions?) | 是否删除 |
| synthesize(text, path, options?, callOptions?) / synthesizeAsync | 已发布 WAV 文件的路径, 大小, 采样率, 时长与模型信息 |
| speak(text, options?, callOptions?) | 使用插件系统 TTS 引擎完成朗读的结果 |
| models.list(filter?, callOptions?) | ModelInfo 数组, 支持 kind/language/installed 过滤 |
| models.install(id, options?, callOptions?) / models.installAsync | 安装后的 ModelInfo |
| models.importFile(path, options?, callOptions?) | 导入本地 tar.bz2/zip 模型后的 ModelInfo |
| models.remove(id, callOptions?) | 是否删除; 被会话使用的模型拒绝删除 |
| models.setDefault(kind, id, callOptions?) | 该类别的新默认 ModelInfo |
| models.getDefault(kind, callOptions?) | 默认 ModelInfo 或 null |
| models.refreshCatalog(callOptions?) | version 和 updated |
| close() | 是否关闭了一个客户端 |

选项字段, 模型许可和识别结果沿用 [Speech](speech) 的定义. 模型安装与导入的 onProgress(done, total) 在当前 Node/Bun/Worker 的 JS 线程执行, 不作为 JSON 函数传给宿主. 快速进度可合并为最新值, 不保证观察到每个内部下载块.

callOptions 支持 signal 和 timeoutMs (整数, 1..2147483647). signal 取消操作; timeoutMs 是本次操作的整体等待期限. 默认不增加额外的运行时期限, 仍遵守 speech 插件的原有操作超时, 会话时长限制及脚本自身的运行超时. 取消安装时由插件回收任务, 已完成的模型变更不会回滚.

### PCM 与会话事件

source 可以是 WAV 文件路径, ArrayBuffer 或任意 ArrayBufferView, 包括 Buffer 和 Int16Array. 只读取视图的 byteOffset/byteLength 范围, 不接受普通数字数组. PCM 为单声道 PCM16 LE, 字节数必须为偶数; 文件识别的 sampleRate 默认 16000, 允许 8000..192000. 音频文件含容器最多 200 MiB, 最长 30 分钟.

```js
"nodejs";
let speech = require('speech');
let session = await speech.listen({ source: 'external', timeoutMillis: 0 });
let ready = new Promise((resolve, reject) => {
    session.once('ready', resolve);
    session.once('error', reject);
});
let ended = new Promise((resolve, reject) => {
    session.once('end', resolve);
    session.once('error', reject);
});
session.on('final', value => console.log(value.text));
try {
    await ready;
    await session.feed(new Int16Array(16000));
    await session.stop();
    console.log((await ended).reason);
} finally {
    await speech.close();
}
```

listen/wake 返回后应立即注册监听器. ready 之前的 state 为 pending; 插件打开或加载失败通过 error 与 end 事件报告. 普通 Session 事件为 ready, partial, final, endpoint, vad, warning, error 和 end. WakeSession 事件为 ready, wake, warning, error 和 end; thenListen 开启时, wake 事件的 listen 是对应轮次的 Session. 轮次事件等待 wake 回调注册监听器后再投递.

Session 的 id, modelId, startedAt, source, round, state, reason, isEnded, result() 和 isActive() 在当前 JS 线程读取. on/once/off/removeListener/removeAllListeners 同步返回会话. stop(), cancel() 和 feed(pcm) 返回 Promise, resolve 为会话本身; feed 仅适用于 external 会话, 固定 16 kHz, 单次最多 1 MiB. 同一会话的 feed/stop/cancel 按调用顺序执行. stop 等待的是停止请求完成, 最终文本以 end 事件为准.

WakeSession 提供 keywords 和共同状态属性, 支持 stop/isActive 及事件方法. 一个听写轮次的 stop/cancel 只结束该轮次; 旧轮次句柄不会停止后续轮次. WakeSession.stop 结束唤醒及仍活动的轮次.

### 错误, 资源和运行条件

speech.SpeechError 可以带 new 或直接调用, 其 name 为 SpeechError, code 保留 MODEL_MISSING, INVALID_OPTIONS, SESSION_BUSY 等插件代码. 识别, 模型操作等 Promise 拒绝时使用该错误类型; 会话错误经 error 事件送达, 随后 end. 原始桥接拒绝可能保留 NOT_GRANTED 等桥接错误代码.

每个主线程/Worker/SDK 客户端分别拥有会话和操作. close 取消本客户端的操作并释放临时 PCM 文件和插件绑定, 活动会话收到 reason 为 script-exit 的 end. 客户端随后可以再次使用. Worker 退出清理自己的客户端, 父线程的会话保持有效; 脚本结束清理整个执行的客户端.

PCM 和返回数据分段传输, 长识别/下载通过短调用与事件轮询等待. Bun 的 speech.control 不计入普通能力的单次执行 1024 次调用额度, 保留单次 RPC 10 秒, 64 KiB 请求, 256 KiB 响应和四个并发请求限制. 其他能力的额度规则保持原样. 会话事件接收不及时仍可能以 LIMIT_EXCEEDED 和 end(overflow) 结束, 应持续消费并在不用时关闭.

synthesize 生成文件而不播放; speak 可用 `{ volume: 0, usage: 'media' }` 静音, 不修改系统音量. 此接口不会自动下载缺失模型, 接受非商用许可, 申请插件麦克风权限或绕过 Android 后台限制.

## Node.js / Bun / Worker 的 EPUB

Node.js 1.26.0 与 Bun Runtime 0.15.0 的本地开发版本提供 EPUB 书籍与阅读器接口. Node 主线程及 CommonJS/ESM/嵌套 Worker 使用 `epub` 或 `autojs6:epub` 模块, 也可通过显式 `$autojs.epub` 访问; Bun 使用 `host.epub`. 书籍解析和阅读器由 3-Folio EPUB 插件提供.

Node 项目声明 `epub` 能力. Bun 使用独立且默认关闭的 `epub.control` 授权, 打包项目也须声明该能力. 文件由宿主或打包应用的 Android 身份读取, 路径相对执行工作目录解析; 不接受 `content://`, `file://` 或网络 URI. 运行时插件私有目录里的文件应先转存到宿主或打包应用可读的路径.

### EPUB 方法与异步结果

全部远程操作返回 Promise. 带 Async 后缀的名称与不带后缀的名称指向同一函数, 不提供阻塞式 Node/Bun 调用. 下表的 `source` 为路径字符串或 `{ path, displayName? }`, 普通选项与 [EPUB](epub) 中对应参数一致.

| 方法 | 参数 | Promise 结果 |
| --- | --- | --- |
| open / openAsync | source, callOptions? | Book |
| metadata / metadataAsync | source, callOptions? | 元数据对象 |
| toc / tocAsync | source, callOptions? | 目录树数组 |
| readingOrder / readingOrderAsync | source, callOptions? | 阅读顺序数组 |
| text / textAsync | source, target?, options?, callOptions? | 文本字符串 |
| cover / coverAsync | source, outputPath?, options?, callOptions? | 图片字节或输出路径 |
| search / searchAsync | source, query, options?, callOptions? | 搜索结果数组 |
| annotations / annotationsAsync | source, callOptions? | 高亮与笔记数组 |
| read / readAsync | source, options?, callOptions? | ReaderSession |
| isAvailable / isAvailableAsync | callOptions? | 是否有可用插件 |
| close | 无 | void |

`callOptions` 可包含 `signal: AbortSignal` 和 `timeoutMs: number`. 单次操作期限默认 60000 ms, 必须为正有限数; 脚本自身期限与插件原有超时仍然生效. 超时或取消会拒绝 Promise, 并回收延迟返回的书籍或阅读器会话. read 的 signal 在返回会话后仍可取消该会话, 其 timeoutMs 仅限制创建操作.

```js
"nodejs";
let epub = require('autojs6:epub');
let book = await epub.open('/sdcard/Books/example.epub');
try {
    console.log(book.metadata.title, book.positions);
    console.log(await book.text(0, { maxChars: 2000 }));
    console.log(await book.search('chapter', { limit: 10 }));
} finally {
    await book.close();
    await epub.close();
}
```

Bun 中对应入口为:

```js
"bun";
let { createHostClient } = await import(process.env.AUTOJS6_HOST_CLIENT_MODULE);
let host = await createHostClient();
console.log(await host.epub.metadata('/sdcard/Books/example.epub'));
await host.epub.close();
```

### Book 属性与方法

open 完成时, path, metadata, toc, readingOrder, positions 已作为当前 JS 线程中的只读属性提供, metadata 等文档对象可以直接访问. isClosed 是本地生命周期状态; 插件因空闲回收或进程退出关闭书籍时, 后续远程调用仍可能先返回 SESSION_CLOSED.

| 方法 | 参数 | Promise 结果 |
| --- | --- | --- |
| text / textAsync | target?, options?, callOptions? | 单个资源或全书文本 |
| textAll / textAllAsync | options?, callOptions? | 全书文本 |
| cover / coverAsync | outputPath?, options?, callOptions? | 图片字节或输出路径 |
| resource / resourceAsync | href, outputPath, options?, callOptions? | 输出路径 |
| search / searchAsync | query, options?, callOptions? | 搜索结果数组 |
| annotations / annotationsAsync | callOptions? | 高亮与笔记数组 |
| close | callOptions? | void |

text 的 target 可以是从 0 开始的阅读顺序索引, href, 带 href 的对象, 或省略以读取全书. options 支持 offset, maxChars 和 format; offset 仅适用于单个资源, maxChars 默认 4194304, format 为 text 或 markdown. textAll 不接受 offset. 返回文本分片传输并保留 Unicode, 无须调用方自行拼接.

cover 不提供 outputPath 时返回原始编码图片的 Uint8Array, Node 中可表现为 Buffer. 该值不是 Rhino ImageWrapper; 可以交给已获图像权限的 `images.fromBytes()` 解码. 指定 outputPath 时直接导出原始封面资源, 与 resource 一样返回最终路径; 已存在的目标默认拒绝, `{ overwrite: true }` 才允许替换.

search 的 offset 默认 0, limit 默认 50, offset + limit 不超过 500. annotations 每次查询插件中的当前数据, 不使用打开书籍时的缓存. 书籍方法沿用插件的资源大小和每个服务入口 8 本同时打开的限制; 5 分钟空闲回收规则保留. 一次性便捷方法会在成功或失败后关闭自己打开的书籍.

### ReaderSession 状态, 控制与事件

read 使用 href, progression 或 locator 中至多一个作为起始位置, 并可附带 preferences. Promise 完成表示会话已创建并请求打开阅读器, 页面就绪以 open 事件或 isOpen 为准. 页面尚未显示时, 翻页可能失败于 READER_NOT_VISIBLE.

path, state, reason, locator, progress, title, chapterTitle, href, positions, isOpen 和 isClosed 在当前 JS 线程读取. state 为 pending/open/closed; progress 初始为 -1. 属性随事件更新, 不代表每次访问都会远程读取 Android 对象.

| 方法 | 参数 | Promise 结果 |
| --- | --- | --- |
| goTo | href/总进度/locator, callOptions? | 会话本身 |
| next / prev | callOptions? | 会话本身 |
| nextChapter / prevChapter | callOptions? | 会话本身 |
| setPreferences | partial, callOptions? | 会话本身 |
| bookmarks | callOptions? | 书签数组 |
| close | options?, callOptions? | 会话本身 |

close 默认结束脚本会话并保留阅读器页面; `{ finish: true }` 同时关闭阅读器. 重复关闭安全. 页面控制完成表示请求已提交, 最终位置应从 progress 事件或状态属性确认. setPreferences 会更新插件的共享阅读偏好, 书签与批注也属于插件共享数据.

on, once, addListener, off, removeListener, removeAllListeners 和 listenerCount 在 JS 线程同步执行. read 返回后应及时安装监听器. 创建期间到达的 open/error/close 等早期事件会短暂保留, 每个事件名称最多 32 条, 供首次监听器接收; 这不是完整历史事件存储.

| 事件 | 回调数据 |
| --- | --- |
| open | locator, title, href, positions |
| progress | locator, totalProgression, chapterTitle, href |
| bookmark | action, locator, createdAt, title, text |
| highlight | action, id, style, color, note, quote, title, locator, createdAt, updatedAt |
| error | EpubError |
| close | reason |

```js
"nodejs";
let epub = require('epub');
let reader = await epub.read('/sdcard/Books/example.epub');
reader.on('progress', event => console.log(event.totalProgression, event.chapterTitle));
reader.on('error', error => console.error(error.code, error.message));
reader.on('close', event => console.log(event.reason));
```

阅读器仍遵循插件的一次一个可见脚本会话规则: 新 read 会替换旧会话并通知 replaced. 不需要继续接收事件时应关闭会话. 退出 Worker 或脚本会释放自己拥有的书籍和会话; 退出本身保留用户的阅读器页面. epub.close 释放当前 facade 的资源, 后续调用可以创建新客户端. 父线程的独立书籍不会因 Worker 退出而关闭.

### 打包应用与错误

独立签名的应用需要配套 Runtime Kit 和 3-Folio EPUB 2.1.0 或更高版本. Builder 根据声明的 epub/epub.control 能力添加 `org.autojs.plugin.epub.permission.RUNTIME`; 插件通过单独的服务和阅读器入口接受调用, 原宿主签名入口保留. 书籍与阅读器控制句柄只允许创建它们的 UID 调用. 不需要麦克风权限.

epub.EpubError 可以直接调用或带 new 创建. name 为 EpubError, code 保留 NOT_EPUB, FILE_NOT_FOUND, INVALID_ARGUMENT, SESSION_CLOSED, TIMEOUT, CANCELLED 等错误. 未授权的 Bun 调用保留 NOT_GRANTED. isAvailable 对插件缺失/禁用/不兼容返回 false, 但不会掩盖运行时能力授权拒绝.

Bun 的 epub.control 采用短请求等待和分片结果, 不计入普通能力的单次执行 1024 次调用额度. 单次 RPC 期限, 请求/响应大小和四个并发请求限制保留. 宿主待投递的阅读器事件达到 1024 条时以 LIMIT_EXCEEDED 和 close(overflow) 结束会话. 这些运行时封装不改变 Bun 原生二进制或 Android/ABI 兼容范围.


## Node.js / Bun / Worker 的主题色, 相册与批量重命名

Node 主线程, CommonJS / ESM / 嵌套 Worker 与 Bun 提供 Rhino 的 [colors.theme](color#p-theme), [gallery](gallery) 与 [files.batchRename](files#m-batchrename). 参数规则, 错误类型与错误码同 Rhino; 全部成员返回 Promise, 因此 Rhino 的同步形态在这里需要 `await`.

### 授权和入口

| 接口 | Node 能力 | Bun 授权 | 需要 |
| --- | --- | --- | --- |
| colors.theme | theme | theme.control | 无 |
| gallery | gallery | gallery.control | 3-Maple Image 3.4.0 或以上 |
| files.batchRename | batch_rename | batchrename.control | Batch Rename 1.0.0 或以上 (拼音, 元数据与预设需要 1.1.0) |

三个 Bun 授权各自独立, 默认关闭, 在插件中心的 Bun 运行时设置页开启, 打包应用在 bunConfig.hostCapabilities 中声明; Node 项目在 nodeConfig.permissions 中声明. 未授权时调用被拒绝: Bun 的错误码为 `NOT_GRANTED`, 并带有 capability; gallery 与 files.batchRename 的拒绝也是 GalleryError / BatchRenameError.

3-Maple Image 与 Batch Rename 只接受与 AutoJs6 相同签名的调用方, 没有 3-Macaw Speech 那样的打包入口, 所以独立签名的打包应用即使声明了这两项授权, 也无法调用这两个插件 (Rhino 打包应用相同).

### colors.theme

get(), set(color, options?), reset(), libraries(), activate(libraryId, options?), deactivate(), next(), state(name), current(). set 与 reset 相当于在主题色页面上选择颜色, 500 ms 内的修改合并为一条 "脚本: 名称" 记录. 主题色在宿主进程内, 所以 Node 主线程, Worker 与 Bun 读写的是同一个主题色.

### gallery

Node 使用 `require('autojs6:gallery')` 或 `require('gallery')`, 显式兼容对象提供 `$autojs.gallery`; Bun 使用 `host.gallery`. pick, edit, convert, isAvailable 及其 Async 形态的最后一个参数是可选的 callOptions (`signal`, `timeoutMs`), 不提供时没有期限, 选择器与编辑器一直等待用户.

view(paths, options?, callOptions?) 在插件接受查看器后返回 GalleryViewSession, viewAsync 在查看器显示后才返回. 会话是 EventEmitter, 事件为 open, page, error 和终结的 close; `await` 之后才添加的监听器也能收到已发生的事件. 执行保持到 close 事件; 脚本结束时查看器留给用户, 等待中的选择器与编辑器随之结束. `session.close(options?)` 返回 Promise, 其余属性同 Rhino. callOptions.signal 也结束活动的查看器, 这时 close 的 reason 为 `cancelled`.

### files.batchRename

可调用的 files.batchRename(paths, options, callOptions?) 与 plan, preview, apply, undo, history, presets, importPresets, deleteHistory, clearHistory, isAvailable, BatchRenameError, 以及 plan, preview, apply, undo, presets, importPresets 的 Async 形态. 方案属于本次执行, Worker 可以执行主线程的方案. onProgress 在调用方的 JS 线程运行; 抛出错误不会中断批次, 批次完成并记入日志后调用才以该错误拒绝. 脚本来不及处理时进度事件会被丢弃, 批次不受影响.

```js
"nodejs";
let gallery = require('autojs6:gallery');
let { batchRename } = require('files');
let images = await gallery.pick({ multiple: true, maxCount: 3 });
if (images) {
    let plan = await batchRename.plan(images.map(image => image.path), { search: 'IMG_', replace: 'Photo_' });
    if (!plan.rejected) console.log((await batchRename.apply(plan)).counts.renamed);
}
```

## Node.js / Bun / Worker 的 Mail

Node.js Runtime 1.27.0 与 Bun Runtime 0.16.0 提供邮件客户端, 需要本批 AutoJs6 6.8.0 开发版与 3-Stamp Mail 2.1.0. 此处描述开发版本, 不表示已公开发布. 邮件协议与账户选项复用 [mail](mail), [MailAccountOptions](mailAccountOptionsType) 和 [MailClient](mailClientType) 的实现.

Node.js 主线程与 CommonJS/ESM/嵌套 Worker 使用 `require('mail')`, `require('autojs6:mail')` 或对应的 ESM import. 主线程也可使用显式 `$autojs.mail`. Bun 通过 `createHostClient()` 返回的 `host.mail` 使用相同接口, 需要独立且默认关闭的 `mail.control` 授权. 不注入 Rhino 的 mail/$mail 全局变量.

```js
"nodejs";
let mail = require('autojs6:mail');
let client = await mail.connect({
    provider: 'qq', address: 'user@qq.com', password: '应用专用授权码',
});
try {
    let messages = await client.fetch({ limit: 5 });
    messages.forEach(message => console.log(message.subject, message.from.toString()));
} finally {
    await mail.dispose();
}
```

### 根方法与默认账户

| 成员 | 运行时行为 |
|---|---|
| connect / connectAsync | Promise<MailClient>; 接受连接选项或已保存账户别名, 建立插件会话, 首次网络操作才登录服务器 |
| setDefault | Promise<MailClient>; 接受当前 facade 的客户端, 连接选项或别名 |
| default | 当前默认客户端或 null |
| close | Promise<void>; 关闭默认账户并清除 default, 不关闭其他独立客户端 |
| dispose | Promise<void>; 关闭本 facade 的全部账户与监听, 后续调用可重新创建资源 |
| providers.list | Promise<Provider[]>; 插件的公开服务商预设 |
| providers.get | Promise<Provider \| null>; 按预设 ID 查询 |
| providers.resolve | Promise<Provider \| null>; 按地址域名查询预设, connect 本身不自动推断 |
| accounts.list | Promise<SavedAccount[]>; 已保存账户的非秘密信息, 仅原签名宿主入口可用 |
| accounts.has | Promise<boolean>; 查询已保存别名, 同样受入口限制 |

下列网络方法在客户端及 mail 根对象上均可用. 根对象转发到 default; 未设置时以 NO_DEFAULT_ACCOUNT 拒绝. 每个 Async 名称都是对应 Promise 方法的别名, 不提供阻塞 Node/Bun 线程的同步形式:

- test / testAsync
- send / sendAsync
- folders / foldersAsync
- folderStatus / folderStatusAsync
- createFolder / createFolderAsync
- deleteFolder / deleteFolderAsync
- renameFolder / renameFolderAsync
- fetch / fetchAsync
- search / searchAsync
- get / getAsync
- fetchBody / fetchBodyAsync
- download / downloadAsync
- raw / rawAsync
- setFlags / setFlagsAsync
- markRead / markReadAsync
- markUnread / markUnreadAsync
- flag / flagAsync
- unflag / unflagAsync
- move / moveAsync
- copy / copyAsync
- delete / deleteAsync
- expunge / expungeAsync
- append / appendAsync

client.folder(path) 与 mail.folder(path) 是本地同步辅助方法, 返回含 path/name 的对象. 其 status/statusAsync, create/createAsync, delete/deleteAsync, rename/renameAsync 都返回 Promise. rename 后原辅助对象仍保留原路径.

client.watch(folder?, options?, callOptions?) 返回 Promise<MailWatch>, 也支持 client.watch(options, callOptions?). mail.watch 转发到默认账户. 这些 watch 方法没有 watchAsync 别名. client.close 返回 Promise<void>, 关闭自身连接和监听; client.account 是无密码/令牌的快照, isConnected/isClosed 表示当前客户端状态.

### 邮件, 附件与监听结果

fetch 返回邮件数组; search 返回邮件数组并保留不可枚举的 fallback 标记. get/fetchBody 与 message.load/loadAsync 返回完整邮件. date/receivedDate 数值转换为 JavaScript Date, 地址对象保留 toString. 附件及 bodyParts 条目保留 uid/folder 和 download/downloadAsync 方法. 方法不参与 JSON 序列化, 位置和 UID 可继续作为其他方法的参数. 完整邮件对象用于 get/raw/标记/移动等方法时, 仅传输 uid/folder 引用, 不重复传输正文或其他无关字段.

附件按文件路径传入 send/append. download/raw 及附件下载方法把结果写到调用应用的文件目录, 返回最终路径; 未给目标时使用脚本工作目录, 默认不覆盖已有文件. 下载通过描述符和临时文件传输, 成功后提交最终文件. options.onProgress(transferred, total) 在所属 JS 线程回调, total 可为 null.

```js
let client = await mail.connect('已保存账户别名'); // 仅签名宿主内使用别名.
let watcher = await client.watch({ folder: 'INBOX', mode: 'auto', reconnect: true });
watcher.on('message', async (message, watch) => {
    let full = await message.load();
    console.log(full.subject, watch.mode);
});
// 不再监听时: await watcher.stop(); await client.close();
```

MailWatch 暴露 folder, mode, generation, state, reason, isActive 和 isClosed. on/once/addListener/off/removeListener/removeAllListeners/listenerCount 在本地操作订阅. message 回调参数为邮件与当前 watch; mode 为 idle/poll, resync 为原因字符串, error 为 MailError, close 为关闭原因. stop 返回 Promise<MailWatch>, 重复停止有效. 初始事件为 await watch 后添加的监听器短暂保留. 插件进程丢失时沿用原实现的重连, 代次过滤和有界退避.

watch 创建完成表示监听任务已启动, 插件仍需异步连接并建立初始邮件游标. isActive 表示任务尚未关闭, 不保证服务器连接已就绪; 初始游标建立前已有的邮件不作为新邮件回放. 需要处理已有邮件时应显式 fetch/search, 不应把监听句柄的创建当作服务器已经进入 IDLE 的确认.

### 取消, 令牌回调与运行条件

远程方法在原参数之后接受可选 callOptions: `{ signal, timeoutMs }`. 整个操作默认期限为 60000 ms, 包括初始 tokenProvider 等待与传输; timeoutMs 必须为正有限数. 长期限不会溢出 JavaScript 定时器. watch 的 signal 在创建完成后仍可停止监听. 取消或超时释放本次操作产生的资源; Worker 退出和脚本结束关闭自己的账户与监听, 不关闭父线程的独立账户.

tokenProvider 在所属 JS 线程调用, 可以返回字符串或 Promise<string>. 未提供 accessToken 时先调用一次; AUTH_FAILED 时沿用会话的令牌刷新与一次重试. 账户关闭后丢弃晚到的令牌回复. client.account 和 session.test 的账户快照不返回密码或令牌. debug 为 true 时, 通过 console.debug 输出插件已脱敏的诊断摘要.

MailError 可直接调用或通过 new 创建, 提供 name, code, message, details 和 retryable. details 可为 JSON 对象/数组, 字符串或 null. 参数错误, 超时, 取消与关闭分别使用 INVALID_ARGUMENT, TIMEOUT, CANCELLED 和 SESSION_CLOSED; Bun 未授权时为 NOT_GRANTED. 服务商的协议限制保持原样, 例如 POP3 的 UIDL 字符串以及 IMAP 专用整理方法的 UNSUPPORTED_OPERATION.

独立签名应用需要匹配的 Runtime Kit 与 Builder. Builder 根据 mail/mail.control 能力添加 `org.autojs.plugin.mail.permission.RUNTIME`. 插件通过单独入口接受调用者显式提供的连接配置, 返回的会话和监听仅允许创建它们的 UID 调用. 已保存账户别名, accounts.list/accounts.has 和后台守望状态仍只允许原签名宿主访问; 打包应用尝试访问时以 PLUGIN_UNAVAILABLE 拒绝. 本入口不要求麦克风权限, 也不打开账户管理页面.

Bun 的 mail.control 分片和监听调用不计入普通能力的单次执行 1024 次累计额度; 授权, 请求/响应大小, 四个并发请求及单次 RPC 期限仍保留. 大附件按文件流传输, 内联消息参数仍受运行时请求大小限制. mail 的根方法与 providers/accounts 共覆盖 57 个现有方法名, 不表示完整 Rhino 对象或 EventEmitter 原型一致. 本批不改变 Node/Bun 引擎版本或 Android/ABI 兼容范围; Node 的宿主桥接库随封装实现重新构建.

## Flow 异步链与等待核心

Node.js 1.30.0 与 Bun Runtime 0.19.0 提供显式的 flow 模块. Node 主线程与 CJS/ESM/嵌套 Worker 使用 `require('flow')`, `require('autojs6:flow')` 或对应 ESM 导入; `$autojs.flow` 也指向当前线程的 facade. Bun 使用 `host.flow`.

```js
"nodejs";
let flow = require('autojs6:flow');
let result = await flow.of(3)
    .map(async value => value + 2)
    .sleep(100)
    .filter(value => value > 0);
console.log(result); // 5.

let node = await flow.waitForVisible({ text: '登录' }, {
    timeout: 5000,
    interval: 100,
    stableFor: 200,
});
console.log(node.text, node.bounds);
```

### 运行条件与覆盖范围

纯回调, Promise 组合与计时不调用宿主, 无须无障碍授权. 选择器与前台组件等待需要配套宿主的 Flow 查询接口, Node 的 accessibility 能力, 或 Bun 默认关闭的 accessibility.control 授权, 以及调用应用内已绑定的 Android 无障碍服务. 打包应用使用自己的服务与包身份; 在 Android 设置中授权后才能执行界面查询.

Flow 立即返回可被 await/Promise.resolve 接纳的对象. 回调在导入它的 JavaScript 线程执行, 支持异步回调; 纯本地链不创建宿主线程; 原生工具在宿主工作线程执行, workers 记录待定原生操作数. 每个 Worker 有独立的 defaults, pending 和 cancelAll. 主线程停止执行或 Worker 退出时, 所属计时器和未完成查询随运行时结束.

本批覆盖 52 个已注册根方法名称, Flow 构造器, 核心链, 高级工具和四种事件等待. 全局 `$flow`/waitAsync 注入与 Java UiObject 原型仍不在 portable 契约内. 使用 JavaScript 的 `await value`, `value.toPromise()`, `value.await()` 或 `value.sync(timeout?)` 读取结果. 本节限制优先于 [Rhino Flow](flow) 页面中的线程, 选择器和动作说明.

### 根方法与 Flow 对象

| 成员 | 行为 |
| --- | --- |
| flow(cond, ...args), wait, waitAsync, waitUntil | 等到条件满足; waitAsync 是 wait 的别名 |
| waitWhile | 等到条件不满足, 返回 true |
| waitForStable, waitForVisible | 目标持续稳定, 或持续稳定且可见, 返回最后的样本 |
| waitForHidden / waitForGone | 目标持续缺席或不可见, 返回 true |
| waitForActivity, waitForPackage | 通过无障碍记录的前台组件名称匹配, 返回 true; Activity 名称只采纳已声明的 Activity, 同包的弹窗/容器事件不会覆盖它; 未知窗口的其他包非 Activity 事件不会覆盖已建立的前台身份; 不隐式调用 Root/Shizuku |
| of(value), Flow(value), new Flow(value) | 接纳值或 Promise; 传入同一 facade 的 Flow 时复用它 |
| run(fn) | 无参数调用回调, 接纳其返回值 |
| sleep(min, max?), delay(min, max?) | 等待毫秒数, 或 min..max 范围内随机时长; 根调用返回 undefined |
| all, race, any | 接受一个数组或可变参数; Flow/Promise 直接接纳, 其他项作为等待条件 |
| whenPresent(cond, handler, options?) | 可选目标出现时等待 handler 完成, 然后保留原输入值; 仅目标缺席造成的超时可跳过 |
| repeatUntil(action, cond, options?) | 动作前和动作后检查条件; 条件满足时返回样本 |
| defaults(options?), trace(enabled?), cancelAll() | 读取/更新当前 facade 默认值, 开关步骤追踪, 或取消当前所有待定节点 |
| pending, workers | 未结算节点数; 当前 facade 待定原生工具/事件操作数 |

all 返回按输入顺序排列的结果; race 采用首个结算; any 采用首个成功, 全部失败时保留最后到达的错误. all([]) 返回空数组, race([])/any([]) 以 INVALID_TARGET 拒绝. 组合器结束后取消自己创建的条件等待, 不取消调用者提供的独立 Flow/Promise.

Flow 的 state 为 pending/fulfilled/rejected/cancelled, step 为当前步骤名, value/error 为已结算结果. toString 返回步骤和状态. 所有等待方法也可接在已有 Flow 后面. then/catch/else/finally/map/run/filter/peek/sleep/delay/timeout/retry/whenPresent/repeatUntil 返回新节点, 允许从同一父节点分叉. filter 为假时以 INVALID_TARGET 拒绝; peek 等待回调但保留原值; finally 等待回调并保留原结算, 其自身失败则覆盖原结算.

### 条件与稳定性

wait 系列接受 `(cond, timeout?, interval?)` 或 `(cond, options, onOk?, onError?)`. 条件可为同步/异步函数, Flow/Promise, 字符串, RegExp 或下表的选择器描述符. 函数仅返回 null/undefined/false/NaN 时不满足; 0, 空字符串与空数组都算满足. 直接提供的 Promise 兑现即为满足, 包括兑现值 false/undefined; 拒绝会原样传播.

| 选择器字段 | 语义 |
| --- | --- |
| text, desc, id, className | 非空白字符串的精确匹配, 不展开短 ID/类名 |
| textContains, descContains | 子串匹配 |
| textMatches, descMatches, idMatches, classNameMatches | 整值正则匹配 |
| content, contentMatches | text/desc/id 任意一个匹配; 字符串条件转为 content, RegExp 转为 contentMatches |
| clickable, enabled, scrollable, visibleToUser, checkable, checked, editable, focused, selected | 布尔条件 |
| depth | 距当前窗口根节点的非负整数深度 |
| boundsInside, boundsContains | 含 left/top/right/bottom 的屏幕像素矩形 |

不同字段之间为 AND. 正则可用字符串, RegExp 或 `{ pattern, flags }`, flags 仅接受 i/m/s, 使用 Android 正则语义. 核心 wait 不支持选择器数组, Java UiSelector 或未知字段; root/compass/resultType 的范围与投影规则见下文; 错误字段和非法正则会拒绝, 不会退化为无条件查找.

选择器返回 JSON 快照: text, desc, id, className, bounds, clickable, enabled, visibleToUser, scrollable, checked, selected, packageName. 这不是可调用 click 的 UiObject; 查询结束就释放临时 Android 节点. 后续查询返回新的快照. 新版快照与动作重定位见下文高级工具.

等待选项 timeout 默认 10000 ms, interval 默认 200 ms, times 默认 Infinity. timeout 为 Infinity 表示不限等待期限, 0 表示只尝试一次; 异步探测仍可被取消, 且受该等待和后续链的期限约束. times 必须为正整数或 Infinity. stableFor 默认 100 ms, 表示连续稳定时长. compare 可为 fingerprint (结构化快照), bounds, content 或异步比较函数. snapshot 可提供每次采样的无环数据投影, 与 compare 互斥, 用来检测原地修改的对象. missing 默认为 reset; fail 在已经出现的目标再次缺失时以 INVALID_TARGET 拒绝.

recoverService 默认 false. 服务未绑定时以 A11Y_UNAVAILABLE 拒绝, 不把服务中断当作目标消失. 设为 true 时在原期限内静默重试, 不打开设置, 不自动授予权限. Node 能力缺失和 Bun NOT_GRANTED 仍直接拒绝. defaults 接受 timeout/interval/stableFor/recoverService/trace/strictActions/humanize, 整体校验成功后才修改, 后建步骤读取新值. trace 输出步骤开始/结束和耗时.

### 取消, 期限与重试

cancel() 在节点仍待定时返回 true, 否则 false. 它取消该分支; 只有父节点的全部续接都已取消时才向上停止父节点. 其他分支仍可继续. 取消后来的回调结果不再推进该节点, 回调已经产生的外部副作用不能撤销. 普通用户 Promise 不具备强制中断能力, 但等待它的 Flow 可以及时结算取消或超时. 回调中创建的子 Flow 通过异步上下文归该步骤所有, 取消/超时会清理这些子 Flow. 即使在 await 恢复后才创建, 所属步骤已经取消时也会立即取消. 阻塞 JavaScript 线程的同步代码无法被计时器抢占.

timeout(ms) 从该步骤运行时设置后续链的截止时间, 不回溯限制前序步骤. 等待中的异步回调也受期限约束. catch/finally 可观察期限失败. retry(times = 1, delay = 0) 只重跑紧前面的失败步骤, 不重跑整条链, 不重跑取消结果或已接纳的 Promise.

whenPresent 的选项为 timeout/interval/times/recoverService. handler 得到找到的样本, 返回值不会替换链输入. repeatUntil 的选项为有限 timeout, interval, maxAttempts (默认 0, 即不限制动作次数) 和 retryOn(error, attempt). action 收到从 1 开始的次数. 条件一开始已满足时不执行动作; timeout 为 0 时只检查一次. 动作异常仅在 retryOn 返回 true 时重试.

FlowError 提供 code, step, selector, elapsed, attempts, reason. portable 核心使用 TIMEOUT/ACTION_FAILED/CANCELLED/A11Y_UNAVAILABLE/INVALID_TARGET; 回调异常和宿主授权/传输错误保留原错误. 拒绝也可以从 error/state 读取, 不会强制触发未处理 Promise 拒绝.

Bun 选择器轮询沿用普通桥的每次执行 1024 次调用预算, 一次查询至少包含 start/poll 两次请求, 并共享 4 个并发请求与单次期限/大小限制. 长时间等待应设置合理 interval/timeout; 纯本地条件不消耗宿主调用预算. 本批不扩展 Bun 的 Android/ABI 支持范围或原生二进制.

### 高级工具与节点动作

从 Node Runtime 1.29.0 与 Bun Runtime 0.18.0 起, 配套宿主增加下列工具. 工具立即返回 Flow, 可使用 await, then, catch, retry 与 cancel. 根方法共覆盖 Rhino 注册表中的 52 个名称; 这不表示 Rhino 的全部重载, Java 类型和同步行为都已移植.

工具的 target 接受上述选择器, 字符串, RegExp, 新版 NodeSnapshot, 或返回 NodeSnapshot/null 的同步或异步函数. 直接传入 Promise 作为工具参数会拒绝; 可使用返回 Promise 的函数. 快照增加 windowId, depth, indexInParent, checkable, editable, focused. 动作会在当前窗口中重新定位, 核对包名, 类名, ID, 文本, 描述, 路径位置和边界. 窗口变化, 目标缺失或匹配不唯一时拒绝 INVALID_TARGET. 节点没有 Java 原型; 使用 `flow.of(snapshot).click()` 等链方法执行动作. 输入和开关操作返回操作后的新快照.

| 根调用 | 链调用 | 返回值 |
| --- | --- | --- |
| smartClick(target, options?) | .smartClick(options?) | { ok: true, method, target, verified }; method 为 node/ancestor/gesture |
| smartClickBounds(target, options?) | .smartClickBounds(options?) | 同上, 始终点按目标边界 |
| clickIfExists(target, options? 或 timeout?) | 同根调用 | boolean, 缺席返回 false |
| clickBoundsIfExists(target, options? 或 timeout?) | 同根调用 | boolean, 使用边界点按 |
| findAny(targets, options? 或 timeout?) | 同根调用 | { index, target, node } 或 null, 按候选顺序查找 |
| clickAny / clickBoundsAny(targets, options? 或 timeout?) | 同根调用 | { index, target, node, method, verified } 或 null |
| scrollUntil(target, options?) | .scrollUntil(target, options?) | 找到的 NodeSnapshot; 链输入作为缺省 container |
| typeInto(target, text, options?) | .typeInto(text, options?) | 输入后的 NodeSnapshot; target 也可为可编辑节点索引或 null (当前焦点) |
| dismissPopups(targets, options? 或 timeout?) | 同根调用 | 根调用返回一项/null 或数组; 链调用保留输入值 |
| collectList(container, item, options?) | .collectList(item, options?) | 采集结果数组; null container 自动选取可滚动容器 |
| launchAndWait(app, options? 或 timeout?) | 同根调用 | { packageName, launched, elapsed, attempts } |
| backUntil(cond, options? 或 maxTimes?) | 同根调用 | 首个满足的条件值, 先检查条件再按返回 |
| backToApp(app, options? 或 maxTimes?) | 同根调用 | 已到前台的包名 |
| toggle(target, checked, options?) | .toggle(checked, options?) | { node, changed, checked, method }; 原本已符合时 changed 为 false, method 为 null |

工具的公共选项为 timeout, interval, root, humanize. root 限定查询子树; 不等同于 Rhino 的 within/scope. 默认 timeout 来自创建步骤时的 flow.defaults().timeout, 并作为整个 portable 工具的期限, 包括查找, 滚动, 验证和异步回调. Infinity 不限期; timeout: 0 只查找一次, 整体仍使用捕获的默认期限 (默认值也为 0 时使用 10000 ms). 后续链的 timeout(ms) 可进一步缩短期限. launchAndWait 接受 timeout/interval/bringToFront, 不接受 root/humanize.

| 工具选项 | 默认值与行为 |
| --- | --- |
| smartClick 的 climb, maxClimb, gestureFallback | true, 5, true; 先直接点击, 再尝试可点击祖先, 最后手势 |
| verify, verifyTimeout, verifyInterval | 可选条件; 智能点击验证默认 2000/100 ms, 输入与开关验证默认 1000/100 ms |
| offset | 像素数或 [dx, dy], 默认为 0; bounds 工具不接受 climb/maxClimb/gestureFallback |
| scrollUntil 的 container, direction, maxSteps, method, stopAtEnd | 自动容器, down, 20, action, true; method 也可为 gesture |
| settle, gestureDuration | 滚动后等待 300 ms, 手势 400 ms |
| typeInto 的 clear, submit, verify | true, false, true; 密码框不通过明文回读验证 |
| dismissPopups 的 once, maxRounds, settle, click | true, 10, 300 ms, 智能点击选项; Flow 拒绝 watch:true 及 onDismissed/onError |
| collectList 的 resultType, dedupe, until, maxItems | "$", true, 无, 不限制条目数; 仍受总期限与资源上限约束 |
| launchAndWait 的 bringToFront | true; false 且已在前台时不再次启动 |
| backUntil/backToApp 的 maxTimes, delay, interval | 10, 500 ms, 100 ms |
| toggle 的 click | 嵌套智能点击选项, 控件本身或首个可勾选后代用于验证 |

collectList 的 resultType 可为 "$" (优先 text/desc/id), "#" (快照), text/desc/id/className/packageName/bounds/depth/indexInParent/clickable/enabled/scrollable/visibleToUser/checked/checkable/editable/focused/selected, 或接收节点快照的异步函数. until 接收已转换的一项, 按 JavaScript 真值决定是否停止. 不执行任意 Java getter 或方法名. verify 与目标回调仍遵循 Flow 等待真值规则; 回调在所属 JavaScript 线程运行, 可以再调用本模块, 其原始异常会保留.

节点链动作包括 click, longClick, clickBounds(offsetX?, offsetY?), setText(text), appendText(text), clear, paste, copy, cut, select, focus, clearFocus, scrollForward, scrollBackward, scrollUp, scrollDown, scrollLeft, scrollRight, expand, collapse, dismiss, show, contextClick, imeEnter, performAction(action, arguments?). arguments 接受布尔值, 数值和字符串字段. 成功后返回新节点快照. strictActions 默认 true, Android 拒绝动作时产生 ACTION_FAILED; false 时保留节点结果. clickAfter/clickBoundsAfter/longClickAfter(min, max?) 先延迟再动作. 常用全局链动作 back/home/recents/notifications/quickSettings/powerDialog/splitScreen/lockScreen/takeScreenshot/dismissNotificationShade 保留链输入; Android 版本不支持或系统拒绝时仍遵循 strictActions.

等待后点击的根与链方法为 waitThenClick/clickWait, waitThenClickBounds/clickBoundsWait, waitThenLongClick, waitForStableThenClick/clickWhenStable, waitForStableThenClickBounds/clickBoundsWhenStable. 它们接受等待条件与等待选项, 再执行对应节点动作, 最后调用尾随 onOk/onError. strict 可覆盖该动作的 strictActions. clickWhenStableAfter/clickBoundsWhenStableAfter 在稳定后增加延迟, 使用 options.delay (毫秒或 [min, max]), 或 `(cond, timeout, interval, delayMin, delayMax?)`.

defaults 另接受 strictActions 和 humanize. humanize 为 false 或 `{ offset, delay }`; offset 是非负像素数或 [x, y], delay 是非负毫秒数或 [min, max]. 工具中 humanize:true 使用捕获的默认设置. 每个动作前可随机延迟, 边界手势可随机偏移. 配置在步骤创建时复制, 后续修改不影响已创建的步骤.

```js
"nodejs";
let flow = require('flow');
await flow.smartClick({ text: '确认' }, {
    gestureFallback: false,
    verify: async () => (await flow.findAny([{ text: '完成' }])) !== null,
    timeout: 5000,
});
let field = await flow.typeInto({ desc: '用户名' }, 'example');
await flow.of(field).appendText('1');
```

### 系统事件等待

事件等待订阅真实 Android 无障碍与通知观察源, 不轮询 UI 来假装事件. 返回 EventFlow, 除一般 Flow 成员外提供只读 ready Promise. `await task.ready` 确认监听已建立后, 再触发测试点击或发送通知. 取消, 超时, 服务断开, 运行结束或 Worker 退出均移除所属监听; 不影响其他 Worker 或父线程的等待. 忽略 ready 不会强制产生未处理拒绝.

| 调用 | 条件与结果 |
| --- | --- |
| waitForIdle(quietFor? 或 options?) | quietFor 默认 500 ms; options 接受 quietFor/timeout/eventTypes. 默认观察窗口状态, 窗口内容与窗口列表变化. 根调用返回 { quietFor, elapsed, events }, 链调用保留输入 |
| waitForEvent(types?, filter?, timeout?) | types 是事件名, 数值类型, 数组, "*" 或 null. filter 是函数或 packageName/className/text 属性条件. 返回 type/eventType/packageName/className/text/contentDescription/eventTime/windowId/contentChangeTypes 快照 |
| waitForToast(filter?, timeout?) | filter 为文本子串, RegExp, packageName/text 属性条件或函数. 返回 type:"toast", packageName, text |
| waitForNotification(filter?, timeout?) | filter 为 title/text 任一匹配的文本子串或 RegExp, packageName/title/text 属性条件或函数. 返回 type:"notification", packageName, title, text |

Toast/notification 的首个数值参数可单独表示 timeout; waitForEvent 的 filter 位置也可省略而直接传 timeout. 属性条件的 packageName/className 字符串精确匹配, text/title 字符串作子串匹配; 正则使用 i/m/s, 查找匹配片段. 函数可返回 Promise, 按 JavaScript 真值判断 (0 和空字符串为 false), 在等待线程转交所属 JS 回调, 不阻塞 Android 服务回调. 返回的是数据快照, 不提供点击通知等 Java 方法.

Android 的通知投递权限与监听来源仍需满足. 无障碍通知观察器按既有行为忽略本应用自己的 Toast, 可用其他应用产生的 Toast 作为等待目标. 不承诺系统会为每次界面修改或每种通知发送相同事件. 服务在等待中断开时拒绝 A11Y_UNAVAILABLE; 高级工具与事件等待不支持 recoverService 的静默重连选项.

```js
"nodejs";
let flow = require('flow');
let event = flow.waitForEvent('view_clicked', { text: '确认' }, 5000);
await event.ready;
await flow.wait({ text: '确认' }).click();
console.log((await event).packageName);
```

### 工具授权与清理

Node 的原生工具入口需要 accessibility. 边界点击, 智能点击的默认手势后备, 或 method:'gesture' 滚动额外需要 accessibility.gesture, 并在任何动作之前检查. `gestureFallback:false` 可只使用节点/祖先动作. launchAndWait 需要 app.query/app.launch; backToApp 需要 app.query. copy/cut/paste 和对应 performAction 需要 clipboard. 事件等待需要 events, Toast/notification 另外需要 events.toast/events.notification. press/swipe/gesture/gestures 需要 accessibility.gesture; back/home/recents 之外的其余全局链动作需要 keys.

Bun 工具与事件等待使用独立且默认关闭的 flow.control. 宿主仍按操作检查 accessibility.control, accessibility.gesture, app.control, clipboard.control, events.observe, events.toast, events.notification 等既有授权. flow.control 本身不授予这些能力. 打包应用须在项目配置中声明所需能力, 并启用自己的 Android 无障碍服务; 授权不继承宿主或其他安装包.

Bun 的界面事件长轮询为控制与回调调用保留执行机会, 总并发调用上限仍为 4. flow.control 的短轮询不计入 Bun 普通桥每次执行 1024 次累计调用预算; 仍保留请求/结果大小, 并发和单次期限限制. 旧的 accessibility.control 选择器轮询继续消耗普通预算. Node 的无障碍查询沿用每秒 20 次的上限; 连续查询应控制间隔, 这同样适用于带 scope 的查询. 工具结果使用 UTF-8 分片传递, 函数参数和回调答复仍受单次请求大小限制. 每个 facade 最多同时有 64 个原生操作, 宿主执行实例最多 128 个原生工具线程; 每个客户端排队结果限制为 64 MiB, 单个操作最多保留 100000 个私有节点. 此项未改变 Bun 原生载荷或 Android/ABI 兼容矩阵.

workers 现在表示当前 facade 尚未结算的原生工具/事件操作数, 纯本地链不增加它. cancelAll 取消当前待定 Flow 并向宿主传播取消. `await flow.dispose()` 取消待定工作, 关闭本 facade 的宿主客户端; 此后该 facade 的原生工具调用会拒绝. Node 主线程, 每个 Worker 与 Bun 各自拥有客户端; 延迟返回的创建结果也会在运行结束后关闭. Android 已经接受的点击/输入/启动无法通过取消撤销.

Flow 对象的 await() 与 sync(timeout?) 与 Rhino 同名, 但不阻塞脚本线程: 两者都返回 Promise, 要写成 `await value.sync()`. sync 超过 timeout (毫秒) 时以 `TIMEOUT` 的 [FlowError](flowErrorType) 拒绝, 其 step 与 reason 都是 `sync`, 链继续运行. 全局 `$flow` 注入与任意 Java UiObject 方法仍不在此契约内. 下列 within/scope 和手势是 Flow 实例方法, 不增加已注册根方法名称的数量. 52 个根方法名称覆盖不代表完整 Rhino 对象与调度器等价.


### within 与 scope

Node.js Runtime 1.30.0 与 Bun Runtime 0.19.0 增加 Flow 实例的范围设置, 需要配套宿主. `flow.of().within(...)` 和 `flow.of().scope(...)` 用于从空值开始; 根模块不额外导出 within/scope.

#### within(cond, options?, onOk?, onError?)

也接受 `within(cond, timeout?, interval?, onOk?, onError?)`. 等待行为与 wait 相同, 成功结果必须是 NodeSnapshot, 否则拒绝 INVALID_TARGET. 找到的节点成为本分支后续等待和工具查找的 root, 同时作为本步骤的结果. 成功回调可以改变结果值, 查找根节点仍保留.

#### scope(options)

options 接受 root, compass, resultType. 返回新 Flow, 透传当前值. 非 null 字段覆盖继承值; null/undefined 保留原设置, 不表示恢复全屏. 需要全屏查找时另起一条根链. 选项在创建步骤时复制, 分支之间互不覆盖. 作用域在父步骤结算后继承, sleep/map/then/retry 等链式步骤继续保留它.

- root: 从匹配宿主得到的 NodeSnapshot. 每次查询重新定位并验证, 不跨调用保存 Android 节点. 作为只读查找根节点时允许布局坐标变化, 但窗口, 包名, 类名, ID, 文本/描述和树位置仍须匹配且唯一; 窗口变化, 身份变化或有歧义的根快照拒绝 INVALID_TARGET, 不回退到全屏. 作为动作目标的快照仍严格校验坐标.
- compass: 复用宿主罗盘语法, 支持 p/c/s/k 导航与 `%`. 先在 root 内搜索, 再从匹配节点执行罗盘. 罗盘可以导航到 root 外的祖先或兄弟, 因此 scope 是查找范围, 不是访问隔离机制.
- resultType: 下表的结果形式. 返回普通 JavaScript 数据, 不返回 Java UiObject/UiSelector/UiObjectCollection.

单次 wait/稳定性等待/等待点击组合的同名选项优先, 不改变后续作用域. whenPresent 和 repeatUntil 的选择器条件也应用作用域. 函数与 Promise 条件按其返回值判断, 不自动套用 root/compass/resultType. 直接作为条件的节点快照会重新定位; 它不应用选择器投影. 高级工具继承 root, 其自身 root 选项优先; compass/resultType 只用于选择器等待, collectList 保留自己的 resultType.

| resultType | 结果 |
| --- | --- |
| # / w / widget | 单个 NodeSnapshot |
| [] / ws / widgets, {} / wc / collection / list, #[] / ## 等宿主别名 | NodeSnapshot 数组; ["#"] 或空数组也选择此形式 |
| $ / txt / content | 首个节点的 content 字符串, 与宿主一致, 优先 desc, 没有 desc 时使用 text |
| contents / $$ / $[] 等别名, ["$"] | content 字符串数组 |
| . / pt / point | { x, y } 中心坐标 |
| points / pts / .. / .[] 等别名, ["."] | 中心坐标数组 |
| ? / exists | 找到时为 true, 没找到时继续等待 |
| @ / selector / sel | 原选择器描述符, 不接受有效导航罗盘 |
| text/desc/id/className/packageName/bounds/depth/indexInParent 及声明列出的节点状态字段 | 对应快照属性 |
| width/height/centerX/centerY/left/top/right/bottom/childCount | 数值属性 |
| ["child", index], ["parent"], ["compass", expression] | 导航后的节点快照 |
| ["text"] 等单元素属性数组 | 对应属性, 不是属性数组 |

空字符串, false, null 和空集合不满足选择器等待; 数值 0 满足. 这与函数条件允许空字符串/空数组的规则不同. 空 resultType 字符串产生空结果. 只支持声明列出的只读数据与导航投影, 不开放任意 Java 方法调用或带副作用的投影. 节点数组可继续执行节点动作, 对每个节点执行; strictActions=false 时任一失败返回 false, 成功返回刷新后的节点数组.

```js
"nodejs";
let flow = require('flow');
let dialog = flow.of().within({ desc: 'dialog' });
await dialog.wait({ text: '确定' }).click();
let title = await dialog.scope({ resultType: 'text' }).wait({ id: 'example:id/title' });
console.log(title.toUpperCase());
```

TypeScript 使用 `Flow<T, S>` 分别保留当前值与作用域的默认选择器结果类型. 字面量 resultType 会推断字符串, 坐标或节点数组, 单次覆盖不会改变后续 S.

### Flow 手势重载

press/swipe/gesture/gestures 都是 Flow 实例方法, 成功后透传进入该步骤的原值, 支持最后的 onOk/onError 回调, strictActions 和 humanize.delay. 它们需要 Node 的 accessibility/accessibility.gesture 或 Bun 的 flow.control/accessibility.control/accessibility.gesture. humanize.offset 不改写显式给出的手势路径.

| 方法 | 接受的调用形式 |
| --- | --- |
| press | press([x,y], duration?), press(x,y,duration?), press(duration,[x,y]) |
| swipe | swipe(x1,y1,x2,y2,duration), swipe(pointA,pointB,duration), swipe([pointA,pointB],duration), swipe([x1,y1,x2,y2],duration), 以及后三种形式的 duration 前置版本 |
| gesture | gesture(duration,pointA,...points), gesture(duration,[pointA,...points]), gesture(duration,[x1,y1,x2,y2,...]) |
| gestures | gestures(strokeA,...strokes), stroke 为 [duration,pointA,...points] 或 [start,duration,pointA,...points] |

point 为 [x,y], 单位是调用应用屏幕的实际像素; 不隐式继承 Rhino screenMetrics. 时长与 start 为毫秒, 省略的 press 时长使用 Android tap timeout. 坐标必须是有限 32 位数值, 小数向零取整; 时长向零取整后须大于 0, start 须非负. Android 检查路径, 笔画数和总时长, 并按系统规则派发; 同时开始或时间重叠的 strokes 可形成多指手势.

手势在宿主线程等待完成, JS 线程可继续运行. 整体受 Flow 操作预算, 链 timeout 和取消约束; 系统返回失败时, strictActions=true 拒绝 ACTION_FAILED, false 时仍透传原输入. 取消未开始的步骤阻止派发; 已交给 Android 的手势不能通过取消撤销. 手势取消不自动回滚已经产生的界面变化.

```js
"nodejs";
let flow = require('flow');
let result = await flow.of('完成')
    .press([200, 300], 150)
    .swipe(300, [200, 500], [200, 200])
    .gesture(400, [[200, 500], [250, 350], [200, 200]])
    .gestures([300, [100, 500], [100, 200]], [40, 300, [300, 500], [300, 200]]);
console.log(result); // 完成.
```


## AI 生成与持久会话

Node.js 主线程和 CommonJS/ESM/嵌套 Worker 通过 ai / autojs6:ai 模块调用, Bun 使用 host.ai 和独立的 ai.control 授权. 本批提供 ask/chat/stream/session/catalog 五个根方法, 原生会话的 ask/chat/stream/close, 以及 hasAccess/requestAccess/close 访问与生命周期辅助方法. 输入校验, 模型选择和推理使用现有 AI Provider 核心. 流支持 ready/result Promise, 事件, 取消和 Unicode 分片回传.

Node 项目声明 ai 能力. 独立签名应用声明普通入口权限 AI_RUNTIME, 并由用户在 3-Stone AI 确认该应用的访问. 授权绑定应用身份且可在插件设置中撤销, 允许使用已配置的本地模型及在线账户; 在线调用可能消耗付费额度. 原宿主签名入口继续保留, 凭据不会交给脚本. Worker 退出只清理自己的操作与会话.

完整签名和用法见 [AI 的 Node.js, Bun 和 Worker 接口](ai#nodejs-bun-和-worker). Rhino 全局和 Java EventEmitter 原型仍属于其他兼容范围. Bun 的单次 JSON 请求仍受 64 KiB 传输上限约束, AI 轮询不计入普通累计调用额度; 其他大小, 并发和单次期限保持有效.

## Agent 任务控制

Node.js 主线程及 CommonJS/ESM/嵌套 Worker 使用 ai.agent, Bun 使用 host.ai.agent. 九个根方法 run/create/get/list/catalog/presets/status/result/context 和 AgentRun 的 on/once/off/respond/confirm/cancel/join 均有对应封装. run/get 返回 Promise 句柄; respond/confirm/cancel/join 异步完成, join 超时不取消任务. 事件和 JSON 结果保留类型与 Unicode, 注册脚本的上下文和结果槽可由其 Node Worker 访问. 任务循环和设备执行沿用 3-Stove Agent 与原宿主实现.

Node 的 ai.agent 与 Bun 默认关闭的 agent.control 为独立授权. 生成应用还需在已安装的 AutoJs6 build 5850 或以上明确授权, 通过该宿主使用 Agent 的模型, 登记脚本和设备能力. 应用只能查询或控制自己的委托任务, 授权按安装身份保存并可在插件中心设置撤销. Worker 退出只取消其创建的非 detached 任务, get 的观察句柄不取得取消所有权. 详见 [Agent 任务与注册脚本](ai#agent-任务与注册脚本).

## 运行时自有接口

本节列出 Node.js, Bun 与 QuickJS 运行时插件自带, 且没有对应宿主模块的入口: 宿主桥, 生命周期, 包管理, 本地插件, Rhino 迁移, MediaStore 与 Worker 池等. 它们不属于宿主脚本 API, 不计入运行时覆盖矩阵; 宿主模块在 Node.js / Bun 中的形态见各模块页的运行时支持表.

"最低版本" 是首个含该入口的插件版本. 完整类型见 Node.js 插件的 `docs/nodejs/types/autojs6-node`, Bun 插件的 `host-client.d.mts`, 以及 `AutoJs6-TypeScript-Declarations` 的 `declarations/autojs6-node` 与 `declarations/autojs6-bun`; QuickJS 没有类型声明.

### 脚本参数与 scriptArgs

`scriptArgs` 只在 QuickJS 中存在. 各运行时读取当前脚本与参数的方式不同:

| 运行时 | 入口 | 取值 | 说明 |
| --- | --- | --- | --- |
| Rhino | `engines.myEngine().execArgv` | `engines.execScript` 等方法传入的 `arguments` 对象 | 见 [引擎](engines) |
| Node.js | `process.argv` | `[process.execPath, 入口文件的真实路径]` | 没有 `scriptArgs`; 宿主不追加用户参数; `engines.myEngine()` 返回的引擎快照不含 execArgv |
| Bun | `process.argv` / `Bun.argv` | `[bun 可执行文件, 入口文件在执行工作区中的路径]` | 没有 `scriptArgs`; 宿主不追加用户参数 |
| QuickJS | `scriptArgs` | 只有一个元素的数组 `[脚本文件名]` | 文件名不含目录, 如 `demo.quickjs.js`; 来源不是文件时为 `script.quickjs.js`; 没有用户参数, 也没有 `process` |

```js
"quickjs";

console.log(scriptArgs.length); // 1
console.log(scriptArgs[0]); // 例如 demo.quickjs.js
```

### Node.js Runtime

共 12 组 113 条. 除 `autojs6:bridge` 外, 本节入口只在主线程 (根脚本) 中提供; Worker 中的宿主调用经 `autojs6:bridge` 转发. 模块用 `require(名称)` 或同名 ESM 导入取得, `$autojs` 为主线程全局对象.

#### 宿主桥与宿主消息

`autojs6:bridge` 2 条, `autojs6:host` 11 条. `autojs6:host` 是每次执行独立的事件发射器, 只有 `message` 一个事件.

| 名称 | 签名 | 说明 | 运行时 | 最低版本 |
| --- | --- | --- | --- | --- |
| `bridge.callAutoJs` | `callAutoJs(moduleName, methodName, args?, options?): Promise<T>` | 按模块名与方法名直接调用宿主 broker; 参数与结果经结构化克隆, 权限, 超时与取消沿用本次执行 | Node.js 主线程与 Worker | 1.0.0 (Worker 1.6.0) |
| `bridge.permissions` | `permissions(): BridgePermissionsReport` | 返回本次执行的权限声明快照 | Node.js 主线程与 Worker | 1.0.0 (Worker 1.6.0) |
| `host.on` | `on('message', listener): this` | 接收宿主发来的 JSON 消息 | Node.js 主线程 | 1.3.0 |
| `host.once` | `once('message', listener): this` | 只接收下一条消息 | Node.js 主线程 | 1.3.0 |
| `host.addListener` | `addListener('message', listener): this` | 同 `on` | Node.js 主线程 | 1.3.0 |
| `host.prependListener` | `prependListener('message', listener): this` | 把监听器加到最前 | Node.js 主线程 | 1.3.0 |
| `host.prependOnceListener` | `prependOnceListener('message', listener): this` | 把一次性监听器加到最前 | Node.js 主线程 | 1.3.0 |
| `host.off` | `off('message', listener): this` | 移除监听器 | Node.js 主线程 | 1.3.0 |
| `host.removeListener` | `removeListener('message', listener): this` | 同 `off` | Node.js 主线程 | 1.3.0 |
| `host.removeAllListeners` | `removeAllListeners(event?): this` | 移除全部监听器 | Node.js 主线程 | 1.3.0 |
| `host.listenerCount` | `listenerCount('message'): number` | 返回当前监听器数量 | Node.js 主线程 | 1.3.0 |
| `host.ref` | `ref(): this` | 有监听器时保持脚本运行 (默认) | Node.js 主线程 | 1.3.0 |
| `host.unref` | `unref(): this` | 监听器不再阻止脚本结束 | Node.js 主线程 | 1.3.0 |

#### 生命周期与能力快照

`autojs6:lifecycle` 7 条, `autojs6:profile` 1 条, `$autojs` 自有成员 3 条. 检查点只用于脚本主动保存和读取 JSON 进度, 插件不会自动重启脚本.

| 名称 | 签名 | 说明 | 运行时 | 最低版本 |
| --- | --- | --- | --- | --- |
| `lifecycle.policy` | `policy: Policy` | 只读策略: 是否启用检查点, 字节上限, 执行模式与启动面; `automaticRestart` 恒为 false | Node.js 主线程 | 1.0.0 |
| `lifecycle.checkpoint` | `checkpoint(value, options?): Promise<CheckpointRecord>` | 把 JSON 值保存为本项目的检查点, `options.reason` 记录原因 | Node.js 主线程 | 1.0.0 |
| `lifecycle.readCheckpoint` | `readCheckpoint(options?): Promise<CheckpointRecord>` | 读取本项目的检查点, 没有时为 null | Node.js 主线程 | 1.0.0 |
| `lifecycle.clearCheckpoint` | `clearCheckpoint(options?): Promise<{deleted, projectKey}>` | 删除本项目的检查点 | Node.js 主线程 | 1.0.0 |
| `lifecycle.onCheckpoint` | `onCheckpoint(handler): Unsubscribe` | 每次保存成功后以 `(reason, record)` 调用 handler; 返回取消订阅函数 | Node.js 主线程 | 1.0.0 |
| `lifecycle.onRestore` | `onRestore(handler, options?): Promise<CheckpointRecord>` | 有检查点时以 `(checkpoint, record)` 调用 handler 并返回记录, 没有时为 null | Node.js 主线程 | 1.0.0 |
| `lifecycle.onStop` | `onStop(handler): Unsubscribe` | 宿主请求停止时按注册顺序以 `(reason)` 调用 handler | Node.js 主线程 | 1.0.0 |
| `autojs6:profile` | `require('autojs6:profile'): object` | 本次执行的运行时能力快照: Node.js 版本, CJS / ESM, 网络, Worker, Java 互操作, Inspector, 原生扩展, 内建模块清单, 特性开关, 错误码, 编译缓存, 桥接权限与限额等 | Node.js 主线程 | 1.0.0 |
| `$autojs.schema` | `schema: 'autojs6-node-autojs-global-v1'` | `$autojs` 的结构版本 | Node.js 主线程 | 1.0.0 |
| `$autojs.profile` | `profile: object` | 与 `autojs6:profile` 相同的能力快照 | Node.js 主线程 | 1.0.0 |
| `$autojs.androidContext` | `androidContext: object` | Android Context 的描述对象, `available` 恒为 false: Node.js 不持有真实 Context, Java 调用改用 `java` 模块 | Node.js 主线程 | 1.0.0 |

#### npm 与 package_manager

`package_manager` 14 条, `npm` 21 条. `npm` 是 `package_manager` 的别名门面, 另有命令行入口. `install` / `update` / `remove` 收到字符串或数组形式的包规格时, 在工作区调用随包 npm (遵循 npm 与项目 `.npmrc`, 失败时保留 npm 输出与退出码); 收到对象请求时操作宿主本地包库, 保留其权限与完整性要求. 命令行选项为 `cwd`, `registry`, `ignoreScripts`, `offline`, `env`, `npmArgs`, `signal` 与 `timeoutMs`.

| 名称 | 签名 | 说明 | 运行时 | 最低版本 |
| --- | --- | --- | --- | --- |
| `package_manager.status` | `status(): DiagnosticStatus` | 包管理器诊断状态: npm 命令行, 宿主本地库与来源策略 | Node.js 主线程 | 1.0.0 |
| `package_manager.policy` | `policy(): DiagnosticPolicy` | 策略快照: 允许与拒绝的来源, 可用操作, 修改授权要求 | Node.js 主线程 | 1.0.0 |
| `package_manager.sourcePolicy` | `sourcePolicy(): SourcePolicy` | 包来源策略 | Node.js 主线程 | 1.0.0 |
| `package_manager.planInstall` | `planInstall(request): Promise<PackagePlan>` | 生成宿主本地库的安装计划, 不改动文件 | Node.js 主线程 | 1.0.0 |
| `package_manager.planUpdate` | `planUpdate(request): Promise<PackagePlan>` | 生成更新计划 | Node.js 主线程 | 1.0.0 |
| `package_manager.planRemove` | `planRemove(request): Promise<PackagePlan>` | 生成删除计划 | Node.js 主线程 | 1.0.0 |
| `package_manager.planRegistryInstall` | `planRegistryInstall(request): Promise<RemotePackagePlan>` | 解析 registry 包的版本, 完整性与下载地址, 只出计划 | Node.js 主线程 | 1.0.0 |
| `package_manager.planTarballInstall` | `planTarballInstall(request): Promise<RemotePackagePlan>` | 解析 tarball 来源, 只出计划 | Node.js 主线程 | 1.0.0 |
| `package_manager.install` | `install(spec?, options?): Promise<NpmCliResult>` / `install(request): Promise<OperationResult>` | 包规格: 运行 `npm install`; 对象请求: 写入宿主本地库 (需 `package_manager.mutate`) | Node.js 主线程 | 1.0.0 (包规格 1.6.0) |
| `package_manager.update` | `update(spec?, options?): Promise<NpmCliResult>` / `update(request): Promise<OperationResult>` | 包规格: 运行 `npm update`; 对象请求: 更新宿主本地库 | Node.js 主线程 | 1.0.0 (包规格 1.6.0) |
| `package_manager.remove` | `remove(spec?, options?): Promise<NpmCliResult>` / `remove(request): Promise<OperationResult>` | 包规格: 运行 `npm uninstall`; 对象请求: 从宿主本地库删除 | Node.js 主线程 | 1.0.0 (包规格 1.6.0) |
| `package_manager.list` | `list(options?): Promise<PackageRecord[]>` | 列出宿主本地库中的包 | Node.js 主线程 | 1.0.0 |
| `package_manager.verify` | `verify(request): Promise<OperationResult>` | 校验包的完整性 | Node.js 主线程 | 1.0.0 |
| `package_manager.prune` | `prune(options?): Promise<OperationResult>` | 清理多余的包 | Node.js 主线程 | 1.0.0 |
| `npm.status` | `status(): NpmFacadeStatus` | npm 门面状态, 内含 `package_manager` 的诊断状态 | Node.js 主线程 | 1.0.0 |
| `npm.policy` | `policy(): NpmFacadePolicy` | npm 门面策略, 内含 `package_manager` 的策略 | Node.js 主线程 | 1.0.0 |
| `npm.sourcePolicy` | `sourcePolicy(): SourcePolicy` | 同 `package_manager.sourcePolicy` | Node.js 主线程 | 1.0.0 |
| `npm.packageManager` | `packageManager(): PackageManagerModule` | 返回 `package_manager` 模块 | Node.js 主线程 | 1.0.0 |
| `npm.planInstall` | `planInstall(request): Promise<PackagePlan>` | 同 `package_manager.planInstall` | Node.js 主线程 | 1.0.0 |
| `npm.planUpdate` | `planUpdate(request): Promise<PackagePlan>` | 同 `package_manager.planUpdate` | Node.js 主线程 | 1.0.0 |
| `npm.planRemove` | `planRemove(request): Promise<PackagePlan>` | 同 `package_manager.planRemove` | Node.js 主线程 | 1.0.0 |
| `npm.planRegistryInstall` | `planRegistryInstall(request): Promise<RemotePackagePlan>` | 同 `package_manager.planRegistryInstall` | Node.js 主线程 | 1.0.0 |
| `npm.planTarballInstall` | `planTarballInstall(request): Promise<RemotePackagePlan>` | 同 `package_manager.planTarballInstall` | Node.js 主线程 | 1.0.0 |
| `npm.install` | `install(spec?, options?)` / `install(request)` | 同 `package_manager.install` | Node.js 主线程 | 1.0.0 (包规格 1.6.0) |
| `npm.update` | `update(spec?, options?)` / `update(request)` | 同 `package_manager.update` | Node.js 主线程 | 1.0.0 (包规格 1.6.0) |
| `npm.remove` | `remove(spec?, options?)` / `remove(request)` | 同 `package_manager.remove` | Node.js 主线程 | 1.0.0 (包规格 1.6.0) |
| `npm.list` | `list(options?): Promise<PackageRecord[]>` | 同 `package_manager.list` | Node.js 主线程 | 1.0.0 |
| `npm.verify` | `verify(request): Promise<OperationResult>` | 同 `package_manager.verify` | Node.js 主线程 | 1.0.0 |
| `npm.prune` | `prune(options?): Promise<OperationResult>` | 同 `package_manager.prune` | Node.js 主线程 | 1.0.0 |
| `npm.cli` | `cli(args, options?): Promise<NpmCliResult>` | 以任意参数运行随包 npm, 输出流式回传 | Node.js 主线程 | 1.6.0 |
| `npm.exec` | `exec(args?, options?): Promise<NpmCliResult>` | 运行 `npm exec -- args` | Node.js 主线程 | 1.6.0 |
| `npm.runScript` | `runScript(name, args?, options?): Promise<NpmCliResult>` | 运行 `npm run name -- args` | Node.js 主线程 | 1.6.0 |
| `npm.installFromRegistry` | `installFromRegistry(spec, options?): Promise<NpmCliResult>` | 从 registry 安装, 同 `install(spec, options)` | Node.js 主线程 | 1.6.0 |
| `npm.publish` | `publish(spec?, options?): Promise<NpmCliResult>` | 运行 `npm publish` | Node.js 主线程 | 1.6.0 |
| `npm.pack` | `pack(spec?, options?): Promise<NpmCliResult>` | 运行 `npm pack` | Node.js 主线程 | 1.6.0 |

`npm.cli` / `exec` / `runScript` / `installFromRegistry` / `publish` / `pack` 在 1.6.0 之前的版本中只会拒绝调用.

#### 本地插件 (plugins)

`plugins` 19 条, 管理工作区 `plugins` 目录中的本地 JS 插件, 与 Rhino 的 [插件 (Plugins)](plugins) 模块无关.

| 名称 | 签名 | 说明 | 运行时 | 最低版本 |
| --- | --- | --- | --- | --- |
| `plugins.install` | `install(id, options?): PluginStatus` | 安装本地插件, 可指定来源, 是否启用与初始配置 | Node.js 主线程 | 1.0.0 |
| `plugins.enable` | `enable(id): PluginStatus` | 启用插件 | Node.js 主线程 | 1.0.0 |
| `plugins.disable` | `disable(id): PluginStatus` | 停用插件 | Node.js 主线程 | 1.0.0 |
| `plugins.isEnabled` | `isEnabled(id): boolean` | 插件是否已启用 | Node.js 主线程 | 1.0.0 |
| `plugins.configure` | `configure(id, config): object` | 写入插件配置, 返回新配置 | Node.js 主线程 | 1.0.0 |
| `plugins.config` | `config(id): object` | 读取插件配置 | Node.js 主线程 | 1.0.0 |
| `plugins.version` | `version(id): string` | 插件版本 | Node.js 主线程 | 1.0.0 |
| `plugins.dependencies` | `dependencies(id): string[]` | 插件声明的依赖 | Node.js 主线程 | 1.0.0 |
| `plugins.exports` | `exports(id): Record<string, string>` | 插件声明的导出表 | Node.js 主线程 | 1.0.0 |
| `plugins.capabilities` | `capabilities(id): string[]` | 插件声明的能力 | Node.js 主线程 | 1.0.0 |
| `plugins.status` | `status(id): PluginStatus` | 插件状态: 清单, 启用与加载状态, 生命周期阶段, 计数, 资源与配置 | Node.js 主线程 | 1.0.0 |
| `plugins.start` | `start(id, options?): PluginStatus` | 启动插件, 以生命周期上下文调用其 start | Node.js 主线程 | 1.0.0 |
| `plugins.stop` | `stop(id, options?): PluginStatus` | 停止插件并释放它登记的资源 | Node.js 主线程 | 1.0.0 |
| `plugins.reload` | `reload(id, options): PluginStatus` | 重新加载插件, `options.debug` 须为 true | Node.js 主线程 | 1.0.0 |
| `plugins.unload` | `unload(id): boolean` | 卸载已加载的插件 | Node.js 主线程 | 1.0.0 |
| `plugins.list` | `list(): PluginStatus[]` | 列出全部本地插件 | Node.js 主线程 | 1.0.0 |
| `plugins.manifest` | `manifest(id): PluginManifest` | 读取插件清单 | Node.js 主线程 | 1.0.0 |
| `plugins.resolve` | `resolve(id, exportName?): string` | 解析插件入口或指定导出的文件路径 | Node.js 主线程 | 1.0.0 |
| `plugins.load` | `load(id, exportName?): T` | 加载插件入口或指定导出 | Node.js 主线程 | 1.0.0 |

`install`, `disable`, `start`, `stop`, `reload` 与 `unload` 在插件的生命周期函数是异步函数时返回 Promise.

#### Rhino 迁移 (rhino, autojs6:compat)

`rhino` 13 条, `autojs6:compat` 的控制成员 10 条. 两者都不会自动安装 Rhino 全局对象; `autojs6:compat` 的其余成员是宿主 API 的再导出, 见各模块页.

| 名称 | 签名 | 说明 | 运行时 | 最低版本 |
| --- | --- | --- | --- | --- |
| `rhino.name` | `name: 'rhino'` | 模块名 | Node.js 主线程 | 1.0.0 |
| `rhino.version` | `version: 1` | 接口版本 | Node.js 主线程 | 1.0.0 |
| `rhino.schema` | `schema: string` | 状态结构版本 | Node.js 主线程 | 1.0.0 |
| `rhino.mode` | `mode: 'disabled'` | Rhino 全局兼容层不自动启用 | Node.js 主线程 | 1.0.0 |
| `rhino.enabled` | `enabled: false` | 恒为 false | Node.js 主线程 | 1.0.0 |
| `rhino.errorCodes` | `errorCodes: ErrorCodes` | 本模块的错误码表 (`ERR_AUTOJS6_RHINO_*`) | Node.js 主线程 | 1.0.0 |
| `rhino.isEnabled` | `isEnabled(): false` | 同 `enabled` | Node.js 主线程 | 1.0.0 |
| `rhino.status` | `status(): Status` | 兼容层状态快照 | Node.js 主线程 | 1.0.0 |
| `rhino.run` | `run(request): Promise<RunResult>` | 在宿主 Rhino 中执行源码 (`source`) 或文件 (`path`), 只回传 JSON 结果, 控制台摘要与耗时; 请求须带 `explicit: true` 与 `timeoutMs`, 需要 `rhino` 能力 | Node.js 主线程 | 1.0.0 |
| `rhino.install` | `install(options): InstallResult` | 显式 (`explicit: true`) 安装 `Packages` / `java` / `android` 代理, 按宿主 Java 白名单执行; `globals` 为 true 时装到全局 | Node.js 主线程 | 1.0.0 |
| `rhino.importClass` | `importClass(...): never` | 不支持, 总是抛出 `ERR_AUTOJS6_RHINO_IMPORT_UNSUPPORTED` | Node.js 主线程 | 1.0.0 |
| `rhino.importPackage` | `importPackage(...): never` | 不支持, 总是抛出 `ERR_AUTOJS6_RHINO_IMPORT_UNSUPPORTED` | Node.js 主线程 | 1.0.0 |
| `rhino.JavaAdapter` | `JavaAdapter(...): never` | 不支持, 总是抛出 `ERR_AUTOJS6_RHINO_JAVA_ADAPTER_UNSUPPORTED`; Java 回调见 [Java 回调, 子类与代码加载](#java-回调-子类与代码加载) | Node.js 主线程 | 1.0.0 |
| `compat.name` | `name: 'autojs6:compat'` | 模块名 | Node.js 主线程 | 1.0.0 |
| `compat.version` | `version: 1` | 接口版本 | Node.js 主线程 | 1.0.0 |
| `compat.mode` | `mode: 'explicit-opt-in'` | 只在显式 `install` 后安装全局名 | Node.js 主线程 | 1.0.0 |
| `compat.errorCodes` | `errorCodes: ErrorCodes` | 错误码表 (`ERR_AUTOJS6_RHINO_COMPAT_INVALID_OPTION` / `UNSUPPORTED` / `BLOCKED_BY_DESIGN`) | Node.js 主线程 | 1.0.0 |
| `compat.status` | `status(): Status` | 加载器状态: 是否已安装, 可安装的全局名与模块名 | Node.js 主线程 | 1.0.0 |
| `compat.install` | `install(options?): InstallResult` | `globals` (或 `global`) 为 true 时把 Rhino 风格全局名装到 globalThis, 已有同名全局时跳过并给出警告, `overwrite` 为 true 时覆盖 | Node.js 主线程 | 1.0.0 |
| `compat.unsupported` | `unsupported(apiName?, reason?): RhinoCompatError` | 构造 "未实现" 错误, 不抛出 | Node.js 主线程 | 1.0.0 |
| `compat.blockedByDesign` | `blockedByDesign(apiName?, reason?): RhinoCompatError` | 构造 "按设计禁止" 错误, 不抛出 | Node.js 主线程 | 1.0.0 |
| `compat.assertSupported` | `assertSupported(apiName?): never` | 总是抛出 "未实现" 错误, 用于标记尚未移植的调用点 | Node.js 主线程 | 1.0.0 |
| `compat.selector` | `selector: SelectorDslModule` | Rhino 风格选择器入口: `text` / `desc` / `id` 等返回可链式的句柄, `findOne` / `click` 等返回 Promise | Node.js 主线程 | 1.0.0 |

#### MediaStore (media_store)

`media_store` 8 条 (另有 `scanFile`, 与宿主 [多媒体 (Media)](media) 的 scanFile 对应, 不计入). 读需要 `media` 与 `media.library` 能力, 写入, 改名与删除另需 `media.library.mutate`; Android 10 起只能修改 AutoJs6 自己创建的记录.

| 名称 | 签名 | 说明 | 运行时 | 最低版本 |
| --- | --- | --- | --- | --- |
| `media_store.capabilities` | `capabilities(options?): Promise<Capabilities>` | 系统版本, 分区存储, 可用集合与列, 读权限状态与查询 / 修改策略 | Node.js 主线程 | 1.5.5 |
| `media_store.query` | `query(collection, options?): Promise<QueryResult>` | 按结构化 JSON 条件查询 `audio` / `images` / `video` (Android 10 起另有 `downloads`), 支持排序, 分页与列选择 | Node.js 主线程 | 1.5.5 |
| `media_store.get` | `get(collection, id, options?): Promise<Item>` | 按 id 读取一条记录, 不存在时为 null | Node.js 主线程 | 1.5.5 |
| `media_store.insert` | `insert(collection, options): Promise<Item>` | 把宿主可读的文件复制为新的媒体记录 | Node.js 主线程 | 1.5.5 |
| `media_store.update` | `update(collection, id, values, options?): Promise<Item>` | 修改文件名或目录 | Node.js 主线程 | 1.5.5 |
| `media_store.delete` | `delete(collection, id, options?): Promise<DeleteResult>` | 删除记录 | Node.js 主线程 | 1.5.5 |
| `media_store.remove` | `remove(collection, id, options?): Promise<DeleteResult>` | 同 `delete` | Node.js 主线程 | 1.5.5 |
| `media_store.exportFile` | `exportFile(collection, id, destination, options?): Promise<ExportResult>` | 把记录的内容复制到宿主可写的文件路径 | Node.js 主线程 | 1.5.5 |

#### Worker 池 (worker_threads)

`worker_threads` 在主线程返回 Node.js 原生模块对象, 另加 4 条 AutoJs6 扩展. Worker 内的 `worker_threads` 是原生模块, 没有这些扩展.

| 名称 | 签名 | 说明 | 运行时 | 最低版本 |
| --- | --- | --- | --- | --- |
| `worker_threads.WorkerPool` | `new WorkerPool(filename, options?)` | 复用 Worker 的任务池, 见下文 | Node.js 主线程 | 1.0.0 |
| `worker_threads.policy` | `policy: WorkerThreadsPolicy` | Worker 策略快照: 可用内建模块, Worker 内的文件 / 网络 / 宿主桥方式, WorkerPool 默认值与 resourceLimits 默认值 | Node.js 主线程 | 1.0.0 |
| `worker_threads.nativeAvailable` | `nativeAvailable: boolean` | 原生 Worker 是否可用 | Node.js 主线程 | 1.0.0 |
| `worker_threads.diagnostics` | `diagnostics(): WorkerThreadsDiagnostics` | Worker, MessagePort 与 WorkerPool 的计数诊断 | Node.js 主线程 | 1.0.0 |

`new WorkerPool(filename, options?)` 也可以不带 `new` 调用. 选项:

| 选项 | 默认值 | 说明 |
| --- | --- | --- |
| `minWorkers` | 0 | 创建时预先启动的 Worker 数 |
| `maxWorkers` | CPU 并行度 | 同时运行的 Worker 上限 |
| `idleTimeoutMs` | 1000 | 空闲 Worker 的回收时间, 0 - 60000 |
| `taskTimeoutMs` | 0 (不限) | 任务的默认期限 |
| `queueLimit` | 不限 | 排队任务上限, 超出时 `run` 抛出 `ERR_AUTOJS6_WORKER_POOL_QUEUE_FULL` |
| `workerData` / `resourceLimits` | 无 | 传给每个 Worker 的同名选项 |

实例方法:

- `run(value, options?)`: 把 `value` 交给空闲 Worker, 返回 Promise. `options.transferList` 随消息转移, `options.timeoutMs` 覆盖默认期限 (超时拒绝为 `ERR_AUTOJS6_WORKER_POOL_TASK_TIMEOUT` 并终止该 Worker). 返回的 Promise 带 `cancel()`: 排队任务直接移除, 运行中任务终止其 Worker, 两者都以 `ERR_AUTOJS6_WORKER_POOL_TASK_CANCELLED` 拒绝; 任务已结束时返回 false.
- `diagnostics()`: 返回 `closed`, Worker 数 (全部 / 空闲 / 忙碌), 排队数, 已创建 Worker 数与完成 / 取消 / 超时的任务数.
- `close()` / `shutdown()`: 拒绝排队任务 (`ERR_AUTOJS6_WORKER_POOL_CLOSED`) 并终止全部 Worker, 返回 Promise. 之后调用 `run` 抛出同一错误码.

池中的 Worker 脚本从 `parentPort` 接收 `{ __autojs6PoolTaskId, value }`, 处理后回复带同一 `__autojs6PoolTaskId` 的 `{ value }` 或 `{ error }`; 回复 `error` 时任务以 `ERR_AUTOJS6_WORKER_POOL_TASK_FAILED` 拒绝.

```js
"nodejs";

const { WorkerPool } = require('worker_threads');
const pool = new WorkerPool(__dirname + '/square.cjs', { maxWorkers: 2 });

Promise.all([ 1, 2, 3 ].map(n => pool.run(n)))
    .then(results => console.log(results)) // [ 1, 4, 9 ]
    .finally(() => pool.close());
```

```js
/* square.cjs */
const { parentPort } = require('worker_threads');

parentPort.on('message', ({ __autojs6PoolTaskId, value }) => {
    parentPort.postMessage({ __autojs6PoolTaskId, value: value * value });
});
```

### Bun Runtime

共 12 条: 客户端模块的 5 个导出, `HostClient` 的 6 个非宿主成员, 以及 1 个环境变量. 用法见 [Bun 客户端](#bun-客户端).

| 名称 | 签名 | 说明 | 运行时 | 最低版本 |
| --- | --- | --- | --- | --- |
| `AUTOJS6_HOST_CLIENT_MODULE` | `process.env.AUTOJS6_HOST_CLIENT_MODULE: string` | 本次执行的客户端模块文件路径, 只在提供宿主桥时设置; 用 `await import(...)` 加载 | Bun | 0.2.6 |
| `createHostClient` | `createHostClient(options?): Promise<HostClient>` | 连接本次执行的宿主桥并协商能力 | Bun | 0.2.6 |
| `SDK_VERSION` | `SDK_VERSION: 1` | 客户端 SDK 版本 | Bun | 0.2.6 |
| `HOST_API_METHODS` | `HOST_API_METHODS: Record<string, string[]>` | 各能力可调用的宿主方法名 | Bun | 0.2.6 |
| `HostCallError` | `class HostCallError extends Error` | 宿主调用失败时的错误类, 含 `code` / `capability` / `status`; 未授权为 `NOT_GRANTED`, 桥不可达为 `HOST_UNAVAILABLE` | Bun | 0.2.6 |
| `OPENCC_CONVERSION_TYPES` | `OPENCC_CONVERSION_TYPES: readonly string[]` | `host.opencc` 支持的 32 个转换类型名 | Bun | 0.2.6 |
| `HostClient#sdkVersion` | `sdkVersion: 1` | 客户端 SDK 版本 | Bun | 0.2.6 |
| `HostClient#bridgeVersion` | `bridgeVersion: 1` | 宿主桥协议版本 | Bun | 0.2.6 |
| `HostClient#capabilities` | `capabilities: readonly string[]` | 本次执行协商到的能力名 | Bun | 0.2.6 |
| `HostClient#limits` | `limits: object` | 宿主公布的上限: `maxRequestBytes`, `maxResultBytes`, `maxCallsPerExecution`, `maxConcurrentCalls`, `callTimeoutMillis` | Bun | 0.2.6 |
| `HostClient#hasCapability` | `hasCapability(capability): boolean` | 是否协商到某个能力 | Bun | 0.2.6 |
| `HostClient#call` | `call(capability, payload?): Promise<object>` | 以能力名与 JSON 载荷直接调用宿主, 仍受相同的授权与方法校验 | Bun | 0.2.6 |

### QuickJS Runtime

共 7 条. QuickJS 插件只提供输出与入参, 不提供宿主 API, Java, 文件系统, 网络, `std` / `os` 模块与定时器. 标准输出与标准错误合计最多 4 MiB.

| 名称 | 签名 | 说明 | 运行时 | 最低版本 |
| --- | --- | --- | --- | --- |
| `console.log` | `console.log(...values): void` | 把各参数转为字符串, 以空格连接后写入标准输出 | QuickJS | 1.0.0 |
| `console.info` | `console.info(...values): void` | 同 `console.log` | QuickJS | 1.0.0 |
| `console.debug` | `console.debug(...values): void` | 同 `console.log` | QuickJS | 1.0.0 |
| `console.warn` | `console.warn(...values): void` | 同 `console.log`, 写入标准错误 | QuickJS | 1.0.0 |
| `console.error` | `console.error(...values): void` | 同 `console.warn` | QuickJS | 1.0.0 |
| `print` | `print(...values): void` | 同 `console.log` | QuickJS | 1.0.0 |
| `scriptArgs` | `scriptArgs: string[]` | `[脚本文件名]`, 见 [脚本参数与 scriptArgs](#脚本参数与-scriptargs) | QuickJS | 1.0.0 |

`console` 只有以上五个方法, 没有 `table`, `time`, `assert` 等.
