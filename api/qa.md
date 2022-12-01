# 疑难解答 (Q & A)

---

## 图像

### 区域截图

AutoJs6 不支持区域截图.  
只能通过 `images.captureScreen` 截取屏幕后使用 `images.clip` 等方式做进一步处理.

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

## 功能扩展

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