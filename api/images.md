# Images

> Stability: 2 - Stable

images模块提供了一些手机设备中常见的图片处理函数，包括截图、读写图片、图片剪裁、找色、找图等。

## images.requestScreenCapture([landscape])
* `landscape` {boolean} 布尔值， 表示将要执行的截屏是否为横屏。如果landscape为false, 则表示竖屏截图; true为横屏截图。

向系统申请屏幕截图权限，返回是否请求成功。

第一次使用该函数会弹出截图权限请求，建议选择“总是允许”。

这个函数只是申请截图权限，并不会真正执行截图，真正的截图函数是[captureScreen][]。

该函数在截图脚本中只需执行一次，而无需每次调用[captureScreen][]都调用一次。

**如果不指定landscape值，则截图方向由当前设备屏幕方向决定**，因此务必注意执行该函数时的屏幕方向。

建议在本软件界面运行该函数，在其他软件界面运行时容易出现一闪而过的黑屏现象。  

示例:
```
//请求截图
if(!requestScreenCapture()){
    toast("请求截图失败");
    exit();
}
//连续截图10张图片(间隔1秒)并保存到存储卡目录
for(var i = 0; i < 10; i++){
    captureScreen("/sdcard/screencapture" + i + ".png");
    sleep(1000);
}

```

该函数也可以作为全局函数使用。

## images.captureScreen()

截取当前屏幕并返回一个Image对象。

没有截图权限时执行该函数会抛出SecurityException。

该函数不会返回null，两次调用可能返回相同的Image对象。这是因为设备截图的更新需要一定的时间，短时间内（一般来说是16ms）连续调用则会返回同一张截图。

截图需要转换为Bitmap格式，从而该函数执行需要一定的时间(0~20ms)。

另外在requestScreenCapture()执行成功后需要一定时间后才有截图可用，因此如果立即调用captureScreen()，会等待一定时间后(一般为几百ms)才返回截图。

例子:

```
//请求横屏截图
requestScreenCapture(true);
//截图
var img = captureScreen();
//获取在点(100, 100)的颜色值
var color = images.pixel(img, 100, 100);
//显示该颜色值
toast(colors.toString(color));
```

该函数也可以作为全局函数使用。

## images.captureScreen(path)
* `path` {string} 截图保存路径

截取当前屏幕并以PNG格式保存到path中。如果文件不存在会被创建；文件存在会被覆盖。

该函数不会返回任何值。该函数也可以作为全局函数使用。

## images.pixel(image, x, y)
* `image` {Image} 图片
* `x` {number} 要获取的像素的横坐标。
* `y` {number} 要获取的像素的纵坐标。

返回图片image在点(x, y)处的像素的ARGB值。  

该值的格式为0xAARRGGBB，是一个"32位整数"(虽然JavaScript中并不区分整数类型和其他数值类型)。

坐标系以图片左上角为原点。以图片左侧边为y轴，上侧边为x轴。

## images.save(image, path)

* `image` {image} 图片
* `path` {string} 路劲

把图片image以PNG格式保存到path中。如果文件不存在会被创建；文件存在会被覆盖。

## images.read(path)
* `path` {string} 图片路径

读取在路径path的图片文件并返回一个Image对象。如果文件不存在或者文件无法解码则返回null。

## images.load(url)
* `url` {string} 图片URL地址

加载在地址URL的网络图片并返回一个Image对象。如果地址不存在或者图片无法解码则返回null。

## images.clip(img, x, y, w, h)
* `img` {Image} 图片
* `x` {number} 剪切区域的左上角横坐标
* `y` {number} 剪切区域的左上角纵坐标
* `w` {number} 剪切区域的宽度
* `h` {number} 剪切区域的高度
* 返回 {Image}

从图片img的位置(x, y)处剪切大小为w * h的区域，并返回该剪切区域的新图片。

```
var src = images.read("/sdcard/1.png");
var clip = images.clip(src, 100, 100, 400, 400);
images.save(clip, "/sdcard/clip.png");
```

## images.findColor(image, color, options)
* `image` {Image} 图片
* `color` {number} | {string} 要寻找的颜色的RGB值。如果是一个整数，则以0xRRGGBB的形式代表RGB值（A通道会被忽略）；如果是字符串，则以"#RRGGBB"代表其RGB值。
* `options` {Object} 选项

在图片中寻找颜色color。找到时返回找到的点Point，找不到时返回null。

选项包括：
* `region` {Array} 找色区域。是一个两个或四个元素的数组。(region[0], region[1])表示找色区域的左上角；region[2]*region[3]表示找色区域的宽高。如果只有region只有两个元素，则找色区域为(region[0], region[1])到屏幕右下角。如果不指定region选项，则找色区域为整张图片。
* `threshold` {number} 找色时颜色相似度的临界值，范围为0~255（越小越相似，0为颜色相等，255为任何颜色都能匹配）。默认为16。threshold和浮点数相似度(0.0~1.0)的换算为 similarity = (255 - threshold) / 255.

该函数也可以作为全局函数使用。

一个循环找色的例子如下：
```
requestScreenCapture();

//循环找色，找到红色(#ff0000)时停止并报告坐标
while(true){
    var img = captureScreen();
    var point = findColor(img, "#ff0000");
    if(point){
        toast("找到红色，坐标为(" + point.x + ", " + point.y + ")");
    }
}

```

一个区域找色的例子如下：
```
//读取本地图片/sdcard/1.png
var img = images.read("/sdcard/1.png");
//判断图片是否加载成功
if(!img){
    toast("没有该图片");
    exit();
}
//在该图片中找色，指定找色区域为在位置(400, 500)的宽为300长为200的区域，指定找色临界值为4
var point = findColor(img, "#00ff00", {
     region: [400, 500, 300, 200],
     threshold: 4
 });
if(point){
    toast("找到啦:" + point);
}else{
    toast("没找到");
}
```

## images.findColorInRegion(img, color, x, y[, width, height, threshold])

区域找色的简便方法。

相当于
```
images.findColor(img, color, {
     region: [x, y, width, height],
     threshold: threshold
});
```

该函数也可以作为全局函数使用。

## images.findColorEquals(img, color[, x, y, width, height])

严格找色的简便方法。找色时要求颜色完全相等才匹配。

相当于
```
images.findColor(img, color, {
   region: [x, y, width, height],
   threshold: 0
});
```

该函数也可以作为全局函数使用。

示例：
(通过找QQ红点的颜色来判断是否有未读消息)
```
requestScreenCapture();
launchApp("QQ");
sleep(1200);
var p = findColorEquals(captureScreen(), "#f64d30");
if(p){
    toast("有未读消息");
}else{
    toast("没有未读消息");
}
```

## images.detectsColor(image, color, x, y[, threshold = 16, algorithm = "diff"])
* `image` {Image} 图片
* `color` {number} | {string} 要检测的颜色
* `x` {number} 要检测的位置横坐标
* `y` {number} 要检测的位置纵坐标
* `threshold` {number} 颜色相似度临界值，默认为16。取值范围为0~255。
* `algorithm` {string} 颜色匹配算法，包括:
    * "equal": 相等匹配，只有与给定颜色color完全相等时才匹配。
    * "diff": 差值匹配。与给定颜色的R、G、B差的绝对值之和小于threshold时匹配。
    * "rgb": rgb欧拉距离相似度。与给定颜色color的rgb欧拉距离小于等于threshold时匹配。
    * "rgb+": 加权rgb欧拉距离匹配([LAB Delta E](https://en.wikipedia.org/wiki/Color_difference))。
    * "hs": hs欧拉距离匹配。hs为HSV空间的色调值。

返回图片image在位置(x, y)处是否匹配到颜色color。用于检测图片中某个位置是否是特定颜色。


一个判断微博客户端的某个微博是否被点赞过的例子：
```
requestScreenCapture();
//找到点赞控件
var like = id("ly_feed_like_icon").findOne();
//获取该控件中点坐标
var x = like.bounds().centerX();
var y = like.bounds().centerY();
//截图
var img = captureScreen();
//判断在该坐标的颜色是否为橙红色
if(images.detectsColor(img, "#fed9a8", x, y)){
    //是的话则已经是点赞过的了，不做任何动作
}else{
    //否则点击点赞按钮
    like.click();
}
```

## images.findImage(img, template[, options])
* `img` {Image} 大图片
* `template` {Image} 小图片（模板）
* `options` {Object} 找图选项

找图。在大图片img中查找小图片template的位置（模块匹配），找到时返回位置坐标(Point)，找不到时返回null。

选项包括：
* `threshold` {number} 图片相似度。取值范围为0~1的浮点数。默认值为0.9。
* `region` {Array} 找图区域。参见findColor函数关于region的说明。
* `level` {number} **一般而言不必修改此参数**。不加此参数时该参数会根据图片大小自动调整。找图算法是采用图像金字塔进行的, level参数表示金字塔的层次, level越大可能带来越高的找图效率，但也可能造成找图失败（图片因过度缩小而无法分辨）或返回错误位置。因此，除非您清楚该参数的意义并需要进行性能调优，否则不需要用到该参数。

该函数也可以作为全局函数使用。

一个最简单的找图例子如下：
```
var img = images.read("/sdcard/大图.png");
var templ = images.read("/sdcard/小图.png");
var p = findImage(img, templ);
if(p){
    toast("找到啦:" + p);
}else{
    toast("没找到");
}
```

稍微复杂点的区域找图例子如下：
```
auto();
requestScreenCapture();
var wx = images.read("/sdcard/微信图标.png");
//返回桌面
home();
//截图并找图
var p = findImage(captureScreen(), wx, {
    region: [0, 50],
    threshold: 0.8
});
if(p){
    toast("在桌面找到了微信图标啦: " + p);
}else{
    toast("在桌面没有找到微信图标");
}
```
## images.findImageInRegion(img, template, x, y[, width, height, threshold])

区域找图的简便方法。相当于：
```
images.findImage(img, template, {
    region: [x, y, width, height],
    threshold: threshold
})
```

该函数也可以作为全局函数使用。

# colors

> Stability: 2 - Stable

colors是颜色处理的工具对象。包含一些常用方法，包括android.graphics.Color的所有方法以及toString方法。

## colors.toString(color)
* `color` {number} 整数RGB颜色值

返回颜色值的字符串，格式为 #AARRGGBB。

## colors.red(color)
* `color` {number} 整数RGB颜色值

返回颜色color的R通道的值，范围0~255.

## colors.green(color)
* `color` {number} 整数RGB颜色值

返回颜色color的G通道的值，范围0~255.

## colors.blue(color)
* `color` {number} 整数RGB颜色值

返回颜色color的B通道的值，范围0~255.

## colors.alpha(color)
* `color` {number} 整数RGB颜色值

返回颜色color的Alpha通道的值，范围0~255.

## colors.rgb(red, green, blue)
* red {number} 颜色的R通道的值
* blue {number} 颜色的G通道的值
* green {number} 颜色的B通道的值

返回这些颜色通道构成的整数颜色值。Alpha通道将是255（不透明）。

## colors.argb(alpha, red, green, blue)
* `alpha` {number} 颜色的Alpha通道的值
* `red` {number}  颜色的R通道的值
* `green` {number} 颜色的G通道的值
* `blue` {number} 颜色的B通道的值

返回这些颜色通道构成的整数颜色值。

# Image

表示一张图片，可以是截图的图片，或者本地读取的图片，或者从网络获取的图片。

## Image.getWidth()

返回以像素为单位图片宽度。

## Image.getHeight()

返回以像素为单位的图片高度。

## Image.saveTo(path)
* `path` {string} 路径

把图片保存到路径path。（如果文件存在则覆盖）

## Image.pixel(x, y)
* `x` {number} 横坐标
* `y` {number} 纵坐标

返回图片image在点(x, y)处的像素的ARGB值。  

该值的格式为0xAARRGGBB，是一个"32位整数"(虽然JavaScript中并不区分整数类型和其他数值类型)。

坐标系以图片左上角为原点。以图片左侧边为y轴，上侧边为x轴。

# Point

findColor, findImage返回的对象。表示一个点（坐标）。

## Point.x 

横坐标。

## Point.y

纵坐标。
