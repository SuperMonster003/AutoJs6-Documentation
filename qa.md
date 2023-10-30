# 疑难解答 (Q & A)

---

## AutoJs6

### AutoJs6 功能简介

AutoJs6 是 Android 平台支持无障碍服务的 JavaScript 自动化工具.

可用作 JavaScript IDE, 支持 [ 代码补全 / 变量重命名 / 代码格式化 ] 等.

AutoJs6 封装了丰富的 JavaScript 模块, 提供丰富功能, 内置实用工具:

功能

- 图像处理 / 文字识别
- 自动化操作 / 控件操作 / 应用操作
- UI 交互 / 对话框交互 / 悬浮窗控件 / 画布控件
- 多线程编程 / 协程 / 异步编程 / 事件监听
- 文件处理 / 多媒体处理
- 定时任务 / 消息通知
- HTTP 请求
- Shell 语句
- 国际化
- ... ...

工具

- 设备信息 / 传感器信息 / 控件信息
- Base64 编解码 / 密文生成
- 数学运算 / 颜色转换
- ... ...

### AutoJs6 如何使用

详见 [AutoJs6 使用手册](manual) 章节.

### AutoJs6 是否免费

AutoJs6 永久免费, 它是基于开源版本 (Auto.js 4.1.1 alpha2) 二次开发的, 将保持开源免费.

### AutoJs6 目标

开源版本 (Auto.js 4.1.1 alpha2) 是非常好的学习资料, AutoJs6 之所以存在, 恰恰是因为站在巨人的肩膀上.

AutoJs6 的目标是对开源版本 (Auto.js 4.1.1 alpha2) 进行完善及扩展.

### AutoJs6 特色

AutoJs6 对以下功能进行了十足的打磨:

- 夜间模式
- 多语言

同时对已有模块进行了精心优化及扩展:

- [颜色 (colors)](color)
- [选择器 (UiSelector)](uiSelectorType)
- [控件节点 (UiObject)](uiObjectType)
- ... ...

其中尤其具备 AutoJs6 特色的, 当属 [pickup 选择器](uiSelectorType#m-pickup) 及 [compass 控件罗盘](uiObjectType#m-compass).

关于 AutoJs6 的更多内容, 可参阅 [项目更新日志](http://changelog.autojs6.com).

## 文档

### 文档格式不统一

AutoJs6 文档是在开源版本文档的基础上进行更新和修改的, 目前仅完成部分章节的更新, 未更新的章节依然保留原始文档内容, 因此会存在新旧不同的文档编写格式.  
因文档编写需要耗费巨量的时间及精力, 文档更新速度会相对缓慢.  
当全部章节完成编写及更新后, 文档将实现格式统一.

### 不支持夜间模式

使用 AutoJs6 查看文档时, 若开启夜间模式后文档依然是亮色主题, 需检查 WebView (或 Google Chrome 等浏览器) 的版本条件:

- API 级别 29 (安卓 10) [Q] 及以上: 版本不低于 76
- API 级别 28 (安卓 9) [P] 及以下: 版本不低于 105

### 内容难以理解

对于存在阅读障碍的文档内容, 可尝试暂时略过, 继续阅读后续内容.  
当完整阅读一个章节或小节后, 可能对之前略过内容的进一步理解有所帮助.  
也可提交反馈至 GitHub 项目页面, 开发者可能会根据提交的反馈适当调整文档内容.

## 图像

### OCR 特性

AutoJs6 的 OCR 特性是基于 [Google ML Kit](https://developers.google.com/ml-kit?hl=zh-cn) 的 [文字识别 API](https://developers.google.com/ml-kit/vision/text-recognition/android?hl=zh-cn) 及 [Baidu PaddlePaddle](https://www.paddlepaddle.org.cn/) 的 [Paddle Lite](https://github.com/PaddlePaddle/Paddle-Lite) 实现的.

> 注:   
> AutoJs6 基于 MLKit 引擎的 [OCR 实现源码](http://project.autojs6.com/blob/master/app/src/main/java/org/autojs/autojs/runtime/api/OcrMLKit.kt) 参考自 [TonyJiangWJ](https://github.com/TonyJiangWJ) 的 [Auto.js](https://github.com/TonyJiangWJ/Auto.js) 项目.  
> AutoJs6 基于 Paddle Lite 引擎的 [OCR 实现源码](http://project.autojs6.com/blob/master/app/src/main/java/org/autojs/autojs/runtime/api/OcrPaddle.kt) 源自 [TonyJiangWJ](https://github.com/TonyJiangWJ) 的 [GitHub PR](http://pr.autojs6.com/120).

> 参阅: [光学字符识别 (OCR)](ocr) 模块

### 区域截图

AutoJs6 不支持区域截图.

可通过 [images.captureScreen](image#m-capturescreen) 截取屏幕后使用 [images.clip](image#m-clip) 等方法做进一步处理.

## 定时任务

### 定时运行脚本

脚本右侧菜单 -> 定时任务, 即可定时运行脚本.  
需保持 AutoJs6 后台运行, 包括 [ 自启动白名单 / 忽略电池优化 / 忽略后台活动限制 / 系统多任务保留 ] 等.  
在设备关屏情况下, 可使用 `device.wakeUp()` 唤醒屏幕.  
但 AutoJs6 暂未提供解锁功能, 因此可能需要根据设备自行设计解锁代码.

### 定时任务获取外部参数

若脚本由 intent (如网络状态变化等特定事件) 触发启动, 可通过 `engines.myEngine().execArgv.intent` 获取 intent, 进而获取外部参数.

## 脚本执行差异

同样的脚本, 在不同环境 (如设备或系统等) 可能出现执行结果差异, 甚至出现异常而无法正常运行.

### 不同的系统版本

AutoJs6 可以安装在 `Andoird API 24 (7.0) [N]` 及以上的操作系统.

然而不同操作系统 `API` 是有区别的, 有些 `API` 在某个系统版本之后 (甚至之前) 才能使用.

下面列出几个 AutoJs6 中受系统版本影响的方法或属性:

- [notice](notice) 模块的渠道相关功能只能在 `Android API 26 (8.0) [O]` 及以上起作用
- [device.imei](device#p-imei) 只能在 `Android API 29 (10) [Q]` 及以下获取到设备 IMEI 值
- [UiSelector#imeEnter](uiSelectorType#m-imeenter) 只能在 `Android API 30 (11) [R]` 及以上才能起作用
- [UiSelector#dragStart](uiSelectorType#m-dragstart) 只能在 `Android API 32 (12.1) [S_V2]` 及以上才能起作用
- [UiSelector#showTextSuggestions](uiSelectorType#m-showtextsuggestions) 只能在 `Android API 33 (13) [TIRAMISU]` 及以上才能起作用
- ... ...

### 不同的设备厂商

因不同设备厂商对操作系统进行了不同程度的定制和修改, 一些 `API` 可能发生变更.

下表列出了部分厂商及操作系统的信息 (排序无先后):

| 厂商或品牌                            | 操作系统                    |
|----------------------------------|-------------------------|
| 魅族 (MEIZU)                       | Flyme OS                |
| 欧珀 (OPPO / Realme)               | 	ColorOS                |
| 小米 (XiaoMi / Redmi / BlackShark) | 	MIUI                   |
| 一加 (OnePlus)                     | 氢OS / Oxygen OS         |
| 维沃 (VIVO / IQOO)                 | 	Funtouch OS / OriginOS |
| 华为 (Huawei / Honor) 	            | EMUI / HarmonyOS        |
| 联想 (Lenovo)                      | 	ZUI                    |
| 酷派 (Coolpad)                     | 	CoolOS                 |
| 卓易 (Droi)                        | 	Freeme OS              |
| 锤子科技 (Smartisan)                 | Smartisan OS            |
| 中兴 (ZTE / 天机 / 远航 / Axon)        | MyOS                    |
| 努比亚 (Nubia / 红魔)                 | REDMAGIC OS             |
| Google Pixel                     | 原生                      |
| AVD (安卓虚拟机)                      | 原生                      |
| 索尼 (Sony / XPERIA)               | 类原生                     |
| 三星 (Samsung)                     | 类原生                     |
| 黑莓 (BlackBerry)                  | 类原生                     |
| LG                               | 类原生                     |
| 摩托罗拉 (Motorola)                  | 类原生                     |
| 诺基亚 (Nokia)                      | 类原生 (仅限部分机型)            |
| 华硕 (ASUS / ZenFone / ROG Phone)  | 类原生                     |
| 宏达电 (HTC)                        | 类原生                     |

由此可见, 想要在众多不同的操作系统中实现完全无差别且无异常的脚本执行效果, 难度是巨大的.

往往需要在实际操作系统中进行功能测试并编写额外的兼容代码, 甚至可能需要查询定制操作系统的开放 `API` 文档 (如果有的话).

> 注: 表格中的信息可能与实际存在出入, 仅供参考.

### 不同的 Auto.js 应用

不同的 Auto.js 应用对 [ JavaScript 封装模块 / Java 包名及类名 ] 等进行了不同程度的 [ 增添 / 修改 / 删减 ], 因此同样的脚本很难在不同 Auto.js 应用上达到同样的运行效果, 甚至出现无法运行的情况.

有以下几种可能的解决方案:

- 继续使用之前编写脚本代码的 Auto.js 应用
- 修改脚本代码以适应新 Auto.js 应用
- 在脚本代码中加入不同 Auto.js 应用的检测, 在对应分支编写兼容代码

### 不同的 AutoJs6 版本

随着 AutoJs6 版本的更新, 一些 `API` 可能出现 [ 新增 / 修改 / 废弃 / 移除 ] 等操作.

当升级 AutoJs6 后, 某个或某些 `API` 出现异常时, 可查询应用文档并定位到相关章节, 根据文档的提示排查并解决上述问题.

如问题仍未解决, 可在项目的 GitHub 议题页面提交 [反馈](#反馈).

## 打包应用

AutoJs6 打包功能尚不完善, 打包应用与 AutoJs6 主应用可能有较大的功能和界面差异.

AutoJs6 开发者暂不考虑参与打包功能相关的开发工作, 目前以 [LZX284](https://github.com/LZX284) 为主要贡献者进行打包功能的开发及维护, 后续将继续由其他开发者贡献相关代码. 

### 图片等资源共同打包及多脚本打包

上述需求需使用 "项目" 功能.

点击 AutoJs6 主页面 "+" 图标, 选择项目, 填写信息后可新建一个项目.  
项目支持存放多个 [ 脚本 / 模块 / 资源文件 ].  
项目工具栏的 APK 打包图标, 点击可打包一个项目.

例如:  
脚本读取同目录 `1.png`: `images.read("./1.png")`.  
UI 脚本图片控件引用同目录 `2.png`: `<img src="file://2.png"/>`.  
AutoJs6 内置模块支持相对路径引用, 其他情况可能需借助 `files.path()` 转换为绝对路径.

### 打包应用不显示主界面

需使用 "项目" 功能.  
新建项目后, 在项目目录 `project.json` 文件中增加以下条目:

```json
{
  "launchConfig": {
    "hideLogs": true
  }
}
```

例如:

```json
{
  "name": "First-Project",
  "versionName": "1.0.0",
  "versionCode": 1,
  "packageName": "org.autojs.example.first",
  "main": "main.js",
  "launchConfig": {
    "hideLogs": true
  }
}
```

## 代码转换

AutoJs6 支持直接调用 [ Java / Android / 扩展库 ] 等 API.  
对于 AutoJs6 没有内置的功能, 可进行 Java 脚本化, 即直接参照 Java (或 Kotlin 等) 源码, 转换为 JavaScript 代码.  
例如:

```java
import android.graphics.Bitmap;
import android.graphics.Matrix;

public static Bitmap rotate(Bitmap src, int degrees, float px, float py) {
    if (degrees == 0) return src;
    Matrix matrix = new Matrix();
    matrix.setRotate(degrees, px, py);
    Bitmap ret = Bitmap.createBitmap(src, 0, 0, src.getWidth(), src.getHeight(), matrix, true);
    return ret;
}
```

转换为 JavaScript 代码:

```js
importClass(android.graphics.Bitmap);
importClass(android.graphics.Matrix);

function rotate(src, degrees, px, py) {
    if (degrees == 0) return src;
    let matrix = new Matrix();
    matrix.setRotate(degrees, px, py);
    let ret = Bitmap.createBitmap(src, 0, 0, src.getWidth(), src.getHeight(), matrix, true);
    return ret;
}
```

关于脚本化 Java 的更多信息, 参阅 [Scripting Java - 脚本化 Java](scriptingJava) 章节.

## 反馈

如有任何问题或建议, 可在 GitHub 项目议题页面发起新的反馈.

关于 <strong>应用文档</strong> 的反馈:  
http://docs-issues.autojs6.com

关于 <strong>AutoJs6</strong> 的反馈:  
http://issues.autojs6.com
