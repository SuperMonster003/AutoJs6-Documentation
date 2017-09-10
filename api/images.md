# Images

> Stability: 2 - Stable

images模块提供了一些手机设备中常见的图片处理函数，包括截图、读写图片、图片剪裁、找色、找图等。

## requestScreenCapture([width, height])
* width {number} 截图宽度
* height {number} 截图高度

向系统申请屏幕截图权限，返回是否请求成功。

第一次使用该函数会弹出截图权限请求，建议选择“总是允许”。

这个函数只是申请截图权限，并不会真正执行截图，真正的截图函数是[captureScreen][]都调用一次。

该函数在截图脚本中只需执行一次，而无需每次调用[captureScreen][]都调用一次。

不指定参数时默认为屏幕宽高。指定参数时，并不会严格以width和height为截图宽度和高度，而是以和width, height接近的最适合的宽高为截图宽高。例如在1920\*1080屏幕中requestScreenCapture(600, 1000)请求的截图的高度一般是540\*960。

如果在第一次权限请求时选择"总是允许", 之后的脚本执行该函数通常耗时200毫秒以内(测试机型：小米6)。

建议在本软件界面运行该函数，在其他软件界面运行时容易出现一闪而过的黑屏。  

如果要进行截图、找色的软件界面为横屏，则requestScreenCapture函数需要在**横屏状态**下执行，否则后续截图将会异常，调用findColor等函数时坐标变换会出现错误。

## captureScreen()

截取当前屏幕并返回一个[Image][]对象。

没有截图权限时执行该函数会抛出SecurityException。

该函数不会返回null，两次调用可能返回相同的Image对象。这是因为设备截图的更新需要一定的时间，短时间内（几十ms）连续调用则会返回同一张截图。

## captureScreen(path)
* path {string} 截图保存路径

截取当前屏幕并以PNG格式保存到path中。如果文件不存在会被创建；文件存在会被覆盖。

该函数不会返回任何值。

## images.pixel(image, x, y)
* image {Image} 图片
* x {number} 要获取的像素的横坐标。
* y {y} 要获取的像素的纵坐标。

返回图片image在点(x, y)处的像素的ARGB值。  

该值的格式为0xAARRGGBB，是一个"32位整数"(虽然JavaScript中并不区分整数类型和其他数值类型。

坐标系以图片左上角为原点。以图片左侧边为y轴，上侧边为x轴。


## images.saveImage(image, path)

* image {image} 图片
* path {string} 路劲

把图片image以PNG格式保存到path中。如果文件不存在会被创建；文件存在会被覆盖。

## images.findColor(image, color, options)
* image {image} 图片
* color {number} | {string} 要寻找的颜色的RGB值。如果是一个整数，则以0xRRGGBB的形式代表RGB值（A通道会被忽略）；如果是字符串，则以"#RRGGBB"代表其RGB值。
* options {Object} 选项

在图片中寻找颜色color。找到时返回找到的点[Point][]，找不到时返回null。

选项包括：
* region {Array} 找色区域。是一个两个或四个元素的数组。(region\[0\], region\[1\])表示找色区域的左上角；region\[2\]*region\[3\]表示找色区域的宽高。如果只有region只有两个元素，则找色区域为(region\[0\], region\[1\])到屏幕右下角。如果不指定region选项，则找色区域为整张图片。
* threads {number} 指定找色使用的线程数。不能超过16。最适合的线程数取决于设备。默认线程数为2。
* algorithm {string} 指定颜色匹配算法。包括:
    * "equal": 相等匹配，只有与给定颜色color完全相等时才匹配。 
    * "diff": 差值匹配。与给定颜色的R、G、B差的绝对值之和小于threshold时匹配。
    * "rgb": rgb欧拉距离相似度。与给定颜色color的rgb欧拉距离小于等于threshold时匹配。
    * "rgb+": 加权rgb欧拉距离匹配([LAB Delta E](https://en.wikipedia.org/wiki/Color_difference))。
    * "hs": hs欧拉距离匹配。hs为HSV空间的色调值。
* threshold {number} 找色时颜色相似度的临界值，范围为0~255（越小越相似，0为颜色相等，255为任何颜色都能匹配）。默认为16。threshold和浮点数相似度(0.0~1.0)的换算为 similarity = (255 - threshold) / 255.

该函数也可以作为全局函数使用。


## images.findColorInRegion(img, color, x, y[, width, height, threads, algorithm, threshold\])

相当于
```
images.findColor(img, color, {
     region: [x, y, width, height],
     algorithm: algorithm,
     threshold: threshold,
     threads: threads
});
```

该函数也可以作为全局函数使用。

## images.findColorEquals(img, color, x, y, width, height, threads)

相当于
```
images.findColor(img, color, {
   region: [x, y, width, height],
   algorithm: "equal",
   threads: threads
});
```

该函数也可以作为全局函数使用。

## images.detectsColor(image, color, x, y\[, threshold = 16, algorithm = "rgb"\])
* image {Image} 图片
* color {number} | {string} 要检测的颜色
* x {number} 要检测的位置横坐标
* y {number} 要检测的位置纵坐标
* threshold {number} 颜色相似度临界值，默认为16
* algorithm {string} 颜色匹配算法，默认为rgb欧式距离

返回图片image在位置(x, y)处是否匹配到颜色color。有关threshold和algorithm的信息，参考findColor函数。

# colors

> Stability: 2 - Stable

colors是颜色处理的工具对象。包含一些常用方法，包括android.graphics.Color的所有方法以及toString方法。

## colors.toString(color)
* color {number} 整数RGB颜色值

返回颜色值的字符串，格式为 #AARRGGBB。

## colors.red(color)
* color {number} 整数RGB颜色值

返回颜色color的R通道的值，范围0~255.

## colors.green(color)
* color {number} 整数RGB颜色值

返回颜色color的G通道的值，范围0~255.

## colors.blue(color)
* color {number} 整数RGB颜色值

返回颜色color的B通道的值，范围0~255.

## colors.alpha(color)
* color {number} 整数RGB颜色值

返回颜色color的Alpha通道的值，范围0~255.

## colors.rgb(red, green, blue)
* red {number} 颜色的R通道的值
* blue {number} 颜色的G通道的值
* green {number} 颜色的B通道的值

返回这些颜色通道构成的整数颜色值。Alpha通道将是255（不透明）。

## colors.argb(alpha, red, green, blue)
* alpha {number} 颜色的Alpha通道的值
* red {number}  颜色的R通道的值
* green {number} 颜色的G通道的值
* blue {number} 颜色的B通道的值

返回这些颜色通道构成的整数颜色值。

# Image

[captureScreen][] 返回的对象。

## Image.getWidth()

返回以像素为单位图片宽度。

## Image.getHeight()

返回以像素为单位的图片高度。

# Point

findColor返回的对象。

## Point.x 

横坐标。

## Point.y

纵坐标。
