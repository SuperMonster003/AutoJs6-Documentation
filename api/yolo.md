# 目标检测 (YOLO)

`yolo` 模块通过独立的 YOLO Provider 插件加载 NCNN 模型并执行目标检测.

`yolo` 与 `$yolo` 指向同一个模块对象. 当前接口属于 AutoJs6 6.8.0 Preview, 仅支持显式指定 Provider 组件的 CPU 检测. 主机不会自动选择其他 Provider, 也不会在失败时回退到 OCR 或其他检测实现.

使用前需要满足以下条件:

- 安装与当前 AutoJs6 版本及设备 ABI 兼容的独立 YOLO Provider APK.
- 在插件中心显式启用并授权该插件. YOLO 插件安装后默认保持关闭.
- Provider APK 与 AutoJs6 APK 使用相同签名, 且 Provider 服务在独立应用进程中运行.
- 模型目录包含可读的 `model.json`, `model.ncnn.param` 和 `model.ncnn.bin` 三个普通文件.

当前主机只接受 `cpu` 设备和 `ultralytics-detect` 默认解码器. 具体模型兼容范围仍由所选 Provider 的能力及模型清单决定.

---

<p style="font: bold 2em sans-serif; color: #FF7043">yolo</p>

---

## [m] load

### load(modelDir, options)

**`6.8.0`**

- **modelDir** { [string](dataTypes#string) } - 模型目录路径
- **options** { [YoloLoadOptions](#yololoadoptions) } - Provider 组件及会话选项
- <ins>**returns**</ins> { [YoloDetector](#yolodetector) } - 独立检测会话

解析模型目录, 校验精确 Provider 组件, 通过只读文件描述符传输模型文件, 并同步打开检测会话.

`modelDir` 按当前脚本路径解析, 并且必须是可读目录. 目录中的三个固定文件名分别代表模型清单, NCNN 参数和 NCNN 权重. 主机不会根据其他文件名推断模型类型.

`options.component` 必须使用 Android 展平组件格式 `package/class`. 可使用以 `.` 开头的相对类名, 例如:

```text
io.github.supermonster003.autojs6.plugin.yolo.ncnn/.provider.YoloProviderService
```

调用会验证精确服务组件, 插件启用及授权状态, APK 签名, Provider 身份, 协议, ABI 和能力. 任何步骤失败时均不会尝试其他 Provider.

```js
let component =
    'io.github.supermonster003.autojs6.plugin.yolo.ncnn/.provider.YoloProviderService';
let detector = null;
let image = null;

try {
    detector = yolo.load('./models/yolo11n', {
        component: component,
        device: 'cpu',
        threads: 4,
        decoderId: 'ultralytics-detect',
        timeoutMillis: 120000,
    });

    image = images.read('./bus.jpg', true);
    let detections = detector.detect(image, {
        confidence: 0.25,
        iouThreshold: 0.45,
        maxDetections: 100,
        timeoutMillis: 30000,
    });

    detections.forEach((detection) => {
        console.log(
            `${detection.label}: ${detection.confidence}, ` +
            `${detection.bounds.toShortString()}`,
        );
    });
} finally {
    if (image !== null) {
        images.recycle(image);
    }
    if (detector !== null) {
        detector.close();
    }
}
```

## 参数对象

### YoloLoadOptions

- **component** { [string](dataTypes#string) } - 精确 Android Provider 服务组件
- **[ device = `'cpu'` ]** { `'cpu'` } - 推理设备
- **[ threads = `4` ]** { [number](dataTypes#number) } - CPU 线程数
- **[ decoderId = `'ultralytics-detect'` ]** { [string](dataTypes#string) } - Provider 解码器 ID
- **[ timeoutMillis = `120000` ]** { [number](dataTypes#number) } - 打开会话的绝对超时, 单位为毫秒

`component` 必需且不能为空. 当前 Preview 只接受 `device: 'cpu'`.

`threads` 必须是 `1..64` 范围内的整数. `decoderId` 必须非空并由 Provider 声明支持. `timeoutMillis` 必须是 `1..600000` 范围内的整数.

### YoloDetectOptions

- **[ confidence = `0.25` ]** { [number](dataTypes#number) } - 最低置信度
- **[ iouThreshold = `0.45` ]** { [number](dataTypes#number) } - 非极大值抑制 IoU 阈值
- **[ maxDetections = `100` ]** { [number](dataTypes#number) } - 最大检测结果数
- **[ timeoutMillis = `30000` ]** { [number](dataTypes#number) } - 单次检测的绝对超时, 单位为毫秒

`confidence` 和 `iouThreshold` 必须是 `0..1` 范围内的有限数值. `maxDetections` 必须是 `1..400` 范围内的整数. `timeoutMillis` 必须是 `1..600000` 范围内的整数.

## 返回对象

### YoloDetector

每个 YoloDetector 持有一个远程 Provider 会话. 不再使用时应调用 [close()](#m-yolodetector-close). 脚本运行时结束时, 尚未关闭的检测器会自动关闭.

#### [m#] YoloDetector#detect

##### detect(image, options?)

**`6.8.0`** **`Overload [1-2]/2`**

- **image** { [ImageWrapper](imageWrapperType) } - 输入图像
- **[ options = `{}` ]** { [YoloDetectOptions](#yolodetectoptions) } - 检测选项
- <ins>**returns**</ins> { [YoloDetection](#yolodetection)[[]](dataTypes#array) } - 检测结果数组

同步执行一次目标检测. 返回数组顺序由 Provider 确定.

输入图像必须仍然有效且未回收. 此方法不会回收输入图像. Provider 返回的图像尺寸必须与输入图像一致, 否则调用失败.

#### [m#] YoloDetector#close

##### close()

**`6.8.0`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

关闭远程检测会话并释放相关资源. 重复调用不会产生额外效果. 关闭后再次调用 `detect` 会抛出 `YOLO_SESSION_CLOSED` 错误.

### YoloDetection

- **classId** { [number](dataTypes#number) } - 模型类别索引
- **label** { [string](dataTypes#string) } - 模型清单中的类别标签
- **confidence** { [number](dataTypes#number) } - 检测置信度
- **bounds** { [android.graphics.RectF](https://developer.android.com/reference/android/graphics/RectF) } - 输入图像坐标系中的浮点边界

`bounds` 提供 `left`, `top`, `right`, `bottom`, `centerX()` 和 `centerY()` 等 Android `RectF` 成员.

## 模型目录

模型目录必须包含以下文件:

```text
model.json
model.ncnn.param
model.ncnn.bin
```

`model.json` 是 Provider 与模型之间的兼容性清单. 当前官方 NCNN Provider 的有限配置为 YOLO11 detect, `640 x 640` RGB NCHW 输入, `ultralytics-detect` 解码器和 `cxcywh` 输出. 标签数量及输出张量形状必须与模型图一致.

模型文件不会随 AutoJs6 或 Provider APK 分发. 模型及训练数据的许可和使用条件由模型提供者负责.

## 错误

YOLO Preview 错误是带 `code` 属性的异常, `message` 以同一个稳定代码开头. 当前代码包括:

| 代码 | 含义 |
| --- | --- |
| `YOLO_COMPONENT_REQUIRED` | 缺少精确 Provider 组件 |
| `YOLO_INVALID_ARGUMENT` | 参数或选项无效 |
| `YOLO_MODEL_INVALID` | 模型目录或固定文件无效 |
| `YOLO_MODEL_REJECTED` | Provider 拒绝模型清单, 模型图, 权重或解码配置 |
| `YOLO_UNSUPPORTED_CAPABILITY` | 设备, 解码器, 协议或资源设置不受支持 |
| `YOLO_PROVIDER_UNAVAILABLE` | 精确 Provider 不可用, 未启用, 未授权或身份校验失败 |
| `YOLO_SESSION_OPEN_FAILED` | 远程会话无法打开 |
| `YOLO_DETECT_FAILED` | 检测调用或结果校验失败 |
| `YOLO_SESSION_CLOSED` | 检测器或远程会话已关闭 |

脚本中可按 `error.code` 处理稳定分类, 但不应依赖完整错误文本.
