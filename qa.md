# 疑难解答 (Q & A)

---

## AutoJs6

### AutoJs6 如何使用

详见 [AutoJs6 使用手册](manual) 章节.

### AutoJs6 是否免费

AutoJs6 永久免费, 它是基于开源版本 (Auto.js 4.1.1 alpha2) 二次开发的, 将保持开源免费.

### AutoJs6 宗旨

精细.

### AutoJs6 意义

开源版本 (Auto.js 4.1.1 alpha2) 是非常好的学习资料, AutoJs6 之所以存在, 恰恰是因为站在巨人的肩膀上.

AutoJs6 的目标是对开源版本 (Auto.js 4.1.1 alpha2) 进行 [ 打磨 / 完善 / 修整 / 扩展 ], 同时希望成为一个有温度而非一个冰冷的应用.

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

关于 AutoJs6 的更多内容, 可参阅 [项目更新日志](https://github.com/SuperMonster003/AutoJs6/blob/master/app/src/main/assets/doc/CHANGELOG.md).

## 文档

### 文档格式不统一

AutoJs6 文档是在开源版本文档的基础上进行更新和修改的, 目前仅完成部分章节的更新, 未更新的章节依然保留原始文档内容, 因此会存在新旧不同的文档编写格式.  
因文档编写需要耗费巨量的时间及精力, 文档更新速度会相对缓慢.  
当全部章节完成编写及更新后, 文档将实现格式统一.

### 不支持夜间模式

使用 AutoJs6 查看文档时, 若开启夜间模式后文档依然是亮色主题, 需检查WebView (或 Google Chrome 等浏览器) 的版本条件:

- API 级别 29 (安卓 10) [Q] 及以上: 版本不低于 76
- API 级别 28 (安卓 9) [P] 及以下: 版本不低于 105

### 内容难以理解

对于存在阅读障碍的文档内容, 可尝试暂时略过, 继续阅读后续内容.  
当完整阅读一个章节或小节后, 可能对之前略过内容的进一步理解有所帮助.  
也可提交反馈至 GitHub 项目页面, 开发者可能会根据提交的反馈适当调整文档内容.

## 图像

### OCR 特性

AutoJs6 不支持 OCR 特性.

### 区域截图

AutoJs6 不支持区域截图.

可通过 `images.captureScreen` 截取屏幕后使用 `images.clip` 等方法做进一步处理.

## 定时任务

### 定时运行脚本

脚本右侧菜单 -> 定时任务, 即可定时运行脚本.  
需保持 AutoJs6 后台运行, 包括 [ 自启动白名单 / 忽略电池优化 / 忽略后台活动限制 / 系统多任务保留 ] 等.  
在设备关屏情况下, 可使用 `device.wakeUp()` 唤醒屏幕.  
但 AutoJs6 暂未提供解锁功能, 因此可能需要根据设备自行设计解锁代码.

### 定时任务获取外部参数

若脚本由 intent (如网络状态变化等特定事件) 触发启动, 可通过 `engines.myEngine().execArgv.intent` 获取 intent, 进而获取外部参数.

## 打包应用

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

关于 <strong>项目文档</strong> 的反馈:  
https://github.com/SuperMonster003/AutoJs6-Documentation/issues

关于 <strong>AutoJs6</strong> 的反馈:  
https://github.com/SuperMonster003/AutoJs6/issues
