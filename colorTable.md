# 颜色列表 (Color Table)

颜色列表列出了颜色名称对应的颜色信息 (Hex 代码, RGB 分量, HSV 分量等).

颜色名称也称为颜色关键字, 如 `black` 表示黑色, `blue` 表示蓝色等.  
在 [CSS](https://zh.wikipedia.org/wiki/%E5%B1%82%E5%8F%A0%E6%A0%B7%E5%BC%8F%E8%A1%A8) 的颜色定义中, 共有 148 种颜色关键字, 其名称取自 [X Window 系统](https://zh.wikipedia.org/wiki/X%E8%A6%96%E7%AA%97%E7%B3%BB%E7%B5%B1) (也称为 `X11`), 因此这些颜色名称也称为 [X11 颜色](https://en.wikipedia.org/wiki/X11_color_names). 详情参阅 [CSS 颜色列表](#CSS-颜色列表) 小节.

> 注: 列表中的 HSV 分量均为取整近似值, 仅供参考.  
> 当作为参数转换为对应颜色后, 可能与原始颜色有偏差.

## Android 颜色列表

Android 的 `android.graphics.Color` 类提供了部分颜色名称与颜色整数值的映射, 保存在私有变量 `sColorNameMap` 中.

下述颜色列表将其颜色名称转换为变量名, 可通过 `colors` 全局对象直接访问.

使用方式:

```js
colors.android.BLACK;
colors.BLACK; /* 同上. */
colors.toInt('black'); /* 同上, 不区分大小写. */

colors.android.DARK_GRAY;
colors.DARK_GRAY; /* 同上. */
colors.toInt('darkgray'); /* 同上, 不区分大小写. */
```

|                       颜色                       | 变量名                              | 颜色译名     | Hex 代码    | RGB            | HSV            |
|:----------------------------------------------:|----------------------------------|----------|-----------|----------------|----------------|
|  <p style="background-color: #000000">　　　</p>  | BLACK                            | 黑        | #000000   | 0,0,0          | 0,0,0          |
|  <p style="background-color: #0000FF">　　　</p>  | BLUE                             | 蓝        | #0000FF   | 0,0,255        | 240,100,100    |
|  <p style="background-color: #00FFFF">　　　</p>  | CYAN / AQUA                      | 青        | #00FFFF   | 0,255,255      | 180,100,100    |
|  <p style="background-color: #444444">　　　</p>  | DARK_GRAY / DARK_GREY / DKGRAY   | 暗灰       | #444444   | 68,68,68       | 0,0,27         |
|  <p style="background-color: #888888">　　　</p>  | GRAY / GREY                      | 灰        | #888888   | 136,136,136    | 0,0,53         |
|  <p style="background-color: #00FF00">　　　</p>  | GREEN / LIME                     | 绿        | #00FF00   | 0,255,0        | 120,100,100    |
|  <p style="background-color: #CCCCCC">　　　</p>  | LIGHT_GRAY / LIGHT_GREY / LTGRAY | 亮灰       | #CCCCCC   | 204,204,204    | 0,0,80         |
|  <p style="background-color: #FF00FF">　　　</p>  | MAGENTA / FUCHSIA                | 品红 / 洋红  | #FF00FF   | 255,0,255      | 300,100,100    |
|  <p style="background-color: #800000">　　　</p>  | MAROON                           | 栗        | #800000   | 128,0,0        | 0,100,50       |
|  <p style="background-color: #000080">　　　</p>  | NAVY                             | 海军蓝 / 藏青 | #000080   | 0,0,128        | 240,100,50     |
|  <p style="background-color: #808000">　　　</p>  | OLIVE                            | 橄榄       | #808000   | 128,128,0      | 60,100,50      |
|  <p style="background-color: #800080">　　　</p>  | PURPLE                           | 紫        | #800080   | 128,0,128      | 300,100,50     |
|  <p style="background-color: #FF0000">　　　</p>  | RED                              | 红        | #FF0000   | 255,0,0        | 0,100,100      |
|  <p style="background-color: #C0C0C0">　　　</p>  | SILVER                           | 银        | #C0C0C0   | 192,192,192    | 0,0,75         |
|  <p style="background-color: #008080">　　　</p>  | TEAL                             | 鸭绿 / 凫绿  | #008080   | 0,128,128      | 180,100,50     |
|  <p style="background-color: #FFFFFF">　　　</p>  | WHITE                            | 白        | #FFFFFF   | 255,255,255    | 0,0,100        |
|  <p style="background-color: #FFFF00">　　　</p>  | YELLOW                           | 黄        | #FFFF00   | 255,255,0      | 60,100,100     |
| <p style="background-color: #00000000">　　　</p> | TRANSPARENT                      | 透明       | #00000000 | 0,0,0,0 (RGBA) | 0,0,0,0 (HSVA) |

## CSS 颜色列表

CSS 颜色名称也称为 CSS 颜色关键字, 它表示一个具体的颜色值.  
如 CSS 语法 `color:red` 的 `red` 即是一个颜色关键字.

在 CSS3 之前共包含 17 个颜色关键字, CSS3 扩充到了 147 个, CSS4 继续扩充了 1 个, 共计 148 个.

使用方式:

```js
colors.css.ORANGE_RED;
```

|                      颜色                      | 变量名                                 | 颜色译名     | Hex 代码  | RGB         | HSV         |
|:--------------------------------------------:|-------------------------------------|----------|---------|-------------|-------------|
| <p style="background-color: #F0F8FF">　　　</p> | ALICE_BLUE                          | 爱丽丝蓝     | #F0F8FF | 240,248,255 | 208,6,100   |
| <p style="background-color: #FAEBD7">　　　</p> | ANTIQUE_WHITE                       | 古董白      | #FAEBD7 | 250,235,215 | 34,14,98    |
| <p style="background-color: #7FFFD4">　　　</p> | AQUAMARINE                          | 蓝绿 / 碧蓝  | #7FFFD4 | 127,255,212 | 160,50,100  |
| <p style="background-color: #F0FFFF">　　　</p> | AZURE                               | 湛蓝       | #F0FFFF | 240,255,255 | 210,100,100 |
| <p style="background-color: #F5F5DC">　　　</p> | BEIGE                               | 米黄       | #F5F5DC | 245,245,220 | 60,10,96    |
| <p style="background-color: #FFE4C4">　　　</p> | BISQUE                              | 陶坯黄      | #FFE4C4 | 255,228,196 | 33,23,100   |
| <p style="background-color: #000000">　　　</p> | BLACK                               | 黑        | #000000 | 0,0,0       | 0,0,0       |
| <p style="background-color: #FFEBCD">　　　</p> | BLANCHED_ALMOND                     | 杏仁白      | #FFEBCD | 255,235,205 | 36,20,100   |
| <p style="background-color: #0000FF">　　　</p> | BLUE                                | 蓝        | #0000FF | 0,0,255     | 240,100,100 |
| <p style="background-color: #8A2BE2">　　　</p> | BLUE_VIOLET                         | 蓝紫       | #8A2BE2 | 138,43,226  | 271,81,89   |
| <p style="background-color: #A52A2A">　　　</p> | BROWN                               | 褐        | #A52A2A | 165,42,42   | 0,75,65     |
| <p style="background-color: #DEB887">　　　</p> | BURLY_WOOD                          | 硬木       | #DEB887 | 222,184,135 | 34,39,87    |
| <p style="background-color: #5F9EA0">　　　</p> | CADET_BLUE                          | 军服蓝      | #5F9EA0 | 95,158,160  | 182,41,63   |
| <p style="background-color: #7FFF00">　　　</p> | CHARTREUSE                          | 查特酒绿     | #7FFF00 | 127,255,0   | 90,100,100  |
| <p style="background-color: #D2691E">　　　</p> | CHOCOLATE                           | 巧克力      | #D2691E | 210,105,30  | 25,86,82    |
| <p style="background-color: #FF7F50">　　　</p> | CORAL                               | 珊瑚红      | #FF7F50 | 255,127,80  | 16,69,100   |
| <p style="background-color: #6495ED">　　　</p> | CORNFLOWER_BLUE                     | 矢车菊蓝     | #6495ED | 100,149,237 | 219,58,93   |
| <p style="background-color: #FFF8DC">　　　</p> | CORN_SILK                           | 玉米丝      | #FFF8DC | 255,248,220 | 48,14,100   |
| <p style="background-color: #DC143C">　　　</p> | CRIMSON                             | 绯红       | #DC143C | 220,20,60   | 348,91,86   |
| <p style="background-color: #00FFFF">　　　</p> | CYAN / AQUA                         | 青        | #00FFFF | 0,255,255   | 180,100,100 |
| <p style="background-color: #00008B">　　　</p> | DARK_BLUE                           | 暗蓝       | #00008B | 0,0,139     | 240,100,55  |
| <p style="background-color: #008B8B">　　　</p> | DARK_CYAN                           | 暗青       | #008B8B | 0,139,139   | 180,100,55  |
| <p style="background-color: #B8860B">　　　</p> | DARK_GOLDENROD                      | 暗金菊      | #B8860B | 184,134,11  | 43,94,72    |
| <p style="background-color: #A9A9A9">　　　</p> | DARK_GRAY / DARK_GREY               | 暗灰       | #A9A9A9 | 169,169,169 | 0,0,66      |
| <p style="background-color: #006400">　　　</p> | DARK_GREEN                          | 暗绿       | #006400 | 0,100,0     | 120,100,39  |
| <p style="background-color: #BDB76B">　　　</p> | DARK_KHAKI                          | 暗卡其      | #BDB76B | 189,183,107 | 56,43,74    |
| <p style="background-color: #8B008B">　　　</p> | DARK_MAGENTA                        | 暗洋红      | #8B008B | 139,0,139   | 300,100,55  |
| <p style="background-color: #556B2F">　　　</p> | DARK_OLIVE_GREEN                    | 暗橄榄绿     | #556B2F | 85,107,47   | 82,56,42    |
| <p style="background-color: #FF8C00">　　　</p> | DARK_ORANGE                         | 暗橙       | #FF8C00 | 255,140,0   | 33,100,100  |
| <p style="background-color: #9932CC">　　　</p> | DARK_ORCHID                         | 暗兰紫      | #9932CC | 153,50,204  | 280,75,80   |
| <p style="background-color: #8B0000">　　　</p> | DARK_RED                            | 暗红       | #8B0000 | 139,0,0     | 0,100,55    |
| <p style="background-color: #E9967A">　　　</p> | DARK_SALMON                         | 暗鲑红      | #E9967A | 233,150,122 | 15,48,91    |
| <p style="background-color: #8FBC8F">　　　</p> | DARK_SEA_GREEN                      | 暗海绿      | #8FBC8F | 143,188,143 | 120,24,74   |
| <p style="background-color: #483D8B">　　　</p> | DARK_SLATE_BLUE                     | 暗岩蓝      | #483D8B | 72,61,139   | 248,56,55   |
| <p style="background-color: #2F4F4F">　　　</p> | DARK_SLATE_GRAY / DARK_SLATE_GREY   | 暗岩灰      | #2F4F4F | 47,79,79    | 180,41,31   |
| <p style="background-color: #00CED1">　　　</p> | DARK_TURQUOISE                      | 暗绿松石     | #00CED1 | 0,206,209   | 181,100,82  |
| <p style="background-color: #9400D3">　　　</p> | DARK_VIOLET                         | 暗紫       | #9400D3 | 148,0,211   | 282,100,83  |
| <p style="background-color: #FF1493">　　　</p> | DEEP_PINK                           | 深粉红      | #FF1493 | 255,20,147  | 328,92,100  |
| <p style="background-color: #00BFFF">　　　</p> | DEEP_SKY_BLUE                       | 深天蓝      | #00BFFF | 0,191,255   | 195,100,100 |
| <p style="background-color: #696969">　　　</p> | DIM_GRAY / DIM_GREY                 | 昏灰       | #696969 | 105,105,105 | 0,0,41      |
| <p style="background-color: #1E90FF">　　　</p> | DODGER_BLUE                         | 道奇蓝      | #1E90FF | 30,144,255  | 210,88,100  |
| <p style="background-color: #B22222">　　　</p> | FIRE_BRICK                          | 砖红       | #B22222 | 178,34,34   | 0,81,70     |
| <p style="background-color: #FFFAF0">　　　</p> | FLORAL_WHITE                        | 花卉白      | #FFFAF0 | 255,250,240 | 40,6,100    |
| <p style="background-color: #228B22">　　　</p> | FOREST_GREEN                        | 森林绿      | #228B22 | 34,139,34   | 120,76,55   |
| <p style="background-color: #DCDCDC">　　　</p> | GAINSBORO                           | 庚斯博罗灰    | #DCDCDC | 220,220,220 | 0,0,86      |
| <p style="background-color: #F8F8FF">　　　</p> | GHOST_WHITE                         | 幽灵白      | #F8F8FF | 248,248,255 | 240,3,100   |
| <p style="background-color: #FFD700">　　　</p> | GOLD                                | 金        | #FFD700 | 255,215,0   | 51,100,100  |
| <p style="background-color: #DAA520">　　　</p> | GOLDENROD                           | 金菊       | #DAA520 | 218,165,32  | 43,85,85    |
| <p style="background-color: #808080">　　　</p> | GRAY / GREY                         | 灰        | #808080 | 128,128,128 | 0,0,50      |
| <p style="background-color: #008000">　　　</p> | GREEN                               | 绿        | #008000 | 0,128,0     | 120,100,50  |
| <p style="background-color: #ADFF2F">　　　</p> | GREEN_YELLOW                        | 绿黄       | #ADFF2F | 173,255,47  | 84,82,100   |
| <p style="background-color: #F0FFF0">　　　</p> | HONEYDEW                            | 蜜瓜绿      | #F0FFF0 | 240,255,240 | 120,6,100   |
| <p style="background-color: #FF69B4">　　　</p> | HOT_PINK                            | 暖粉红      | #FF69B4 | 255,105,180 | 330,59,100  |
| <p style="background-color: #CD5C5C">　　　</p> | INDIAN_RED                          | 印度红      | #CD5C5C | 205,92,92   | 0,55,80     |
| <p style="background-color: #4B0082">　　　</p> | INDIGO                              | 靛        | #4B0082 | 75,0,130    | 	275,100,51 |
| <p style="background-color: #FFFFF0">　　　</p> | IVORY                               | 象牙       | #FFFFF0 | 255,255,240 | 60,6,100    |
| <p style="background-color: #F0E68C">　　　</p> | KHAKI                               | 卡其       | #F0E68C | 240,230,140 | 54,42,94    |
| <p style="background-color: #E6E6FA">　　　</p> | LAVENDER                            | 薰衣草      | #E6E6FA | 230,230,250 | 240,8,98    |
| <p style="background-color: #FFF0F5">　　　</p> | LAVENDER_BLUSH                      | 薰衣草紫红    | #FFF0F5 | 255,240,245 | 340,6,100   |
| <p style="background-color: #7CFC00">　　　</p> | LAWN_GREEN                          | 草坪绿      | #7CFC00 | 124,252,0   | 90,100,99   |
| <p style="background-color: #FFFACD">　　　</p> | LEMON_CHIFFON                       | 柠檬绸      | #FFFACD | 255,250,205 | 54,20,100   |
| <p style="background-color: #ADD8E6">　　　</p> | LIGHT_BLUE                          | 亮蓝       | #ADD8E6 | 173,216,230 | 195,25,90   |
| <p style="background-color: #F08080">　　　</p> | LIGHT_CORAL                         | 亮珊瑚      | #F08080 | 240,128,128 | 0,47,94     |
| <p style="background-color: #E0FFFF">　　　</p> | LIGHT_CYAN                          | 亮青       | #E0FFFF | 224,255,255 | 180,12,100  |
| <p style="background-color: #FAFAD2">　　　</p> | LIGHT_GOLDENROD_YELLOW              | 亮金菊黄     | #FAFAD2 | 250,250,210 | 60,16,98    |
| <p style="background-color: #D3D3D3">　　　</p> | LIGHT_GRAY / LIGHT_GREY             | 亮灰       | #D3D3D3 | 211,211,211 | 0,0,83      |
| <p style="background-color: #90EE90">　　　</p> | LIGHT_GREEN                         | 亮绿       | #90EE90 | 144,238,144 | 120,39,93   |
| <p style="background-color: #FFB6C1">　　　</p> | LIGHT_PINK                          | 亮粉红      | #FFB6C1 | 255,182,193 | 351,29,100  |
| <p style="background-color: #FFA07A">　　　</p> | LIGHT_SALMON                        | 亮鲑红      | #FFA07A | 255,160,122 | 17,52,100   |
| <p style="background-color: #20B2AA">　　　</p> | LIGHT_SEA_GREEN                     | 亮海绿      | #20B2AA | 32,178,170  | 177,82,70   |
| <p style="background-color: #87CEFA">　　　</p> | LIGHT_SKY_BLUE                      | 浅天蓝      | #87CEFA | 135,206,250 | 203,46,98   |
| <p style="background-color: #778899">　　　</p> | LIGHT_SLATE_GRAY / LIGHT_SLATE_GREY | 亮岩灰      | #778899 | 119,136,153 | 210,22,60   |
| <p style="background-color: #B0C4DE">　　　</p> | LIGHT_STEEL_BLUE                    | 亮钢蓝      | #B0C4DE | 176,196,222 | 214,21,87   |
| <p style="background-color: #FFFFE0">　　　</p> | LIGHT_YELLOW                        | 亮黄       | #FFFFE0 | 255,255,224 | 60,12,100   |
| <p style="background-color: #00FF00">　　　</p> | LIME                                | 鲜绿 / 莱姆  | #00FF00 | 0,255,0     | 120,100,100 |
| <p style="background-color: #32CD32">　　　</p> | LIME_GREEN                          | 柠檬绿      | #32CD32 | 50,205,50   | 120,76,80   |
| <p style="background-color: #FAF0E6">　　　</p> | LINEN                               | 亚麻       | #FAF0E6 | 250,240,230 | 30,8,98     |
| <p style="background-color: #FF00FF">　　　</p> | MAGENTA / FUCHSIA                   | 洋红 / 品红  | #FF00FF | 255,0,255   | 300,100,100 |
| <p style="background-color: #800000">　　　</p> | MAROON                              | 栗        | #800000 | 128,0,0     | 0,100,50    |
| <p style="background-color: #66CDAA">　　　</p> | MEDIUM_AQUAMARINE                   | 中碧蓝      | #66CDAA | 102,205,170 | 160,50,80   |
| <p style="background-color: #0000CD">　　　</p> | MEDIUM_BLUE                         | 中蓝       | #0000CD | 0,0,205     | 240,100,80  |
| <p style="background-color: #DDA0DD">　　　</p> | MEDIUM_LAVENDER_MAGENTA             | 梅红       | #DDA0DD | 221,160,221 | 300,28,87   |
| <p style="background-color: #BA55D3">　　　</p> | MEDIUM_ORCHID                       | 中兰紫      | #BA55D3 | 186,85,211  | 288,60,83   |
| <p style="background-color: #9370DB">　　　</p> | MEDIUM_PURPLE                       | 中紫       | #9370DB | 147,112,219 | 260,49,86   |
| <p style="background-color: #3CB371">　　　</p> | MEDIUM_SEA_GREEN                    | 中海绿      | #3CB371 | 60,179,113  | 147,66,70   |
| <p style="background-color: #7B68EE">　　　</p> | MEDIUM_SLATE_BLUE                   | 中岩蓝      | #7B68EE | 123,104,238 | 249,56,93   |
| <p style="background-color: #00FA9A">　　　</p> | MEDIUM_SPRING_GREEN                 | 中春绿      | #00FA9A | 0,250,154   | 157,100,98  |
| <p style="background-color: #48D1CC">　　　</p> | MEDIUM_TURQUOISE                    | 中绿松石     | #48D1CC | 72,209,204  | 178,66,82   |
| <p style="background-color: #C71585">　　　</p> | MEDIUM_VIOLET_RED                   | 中青紫红     | #C71585 | 199,21,133  | 322,89,78   |
| <p style="background-color: #191970">　　　</p> | MIDNIGHT_BLUE                       | 午夜蓝      | #191970 | 25,25,112   | 240,78,44   |
| <p style="background-color: #F5FFFA">　　　</p> | MINT_CREAM                          | 薄荷奶油     | #F5FFFA | 245,255,250 | 150,4,100   |
| <p style="background-color: #FFE4E1">　　　</p> | MISTY_ROSE                          | 雾玫瑰      | #FFE4E1 | 255,228,225 | 6,12,100    |
| <p style="background-color: #FFE4B5">　　　</p> | MOCCASIN                            | 鹿皮鞋      | #FFE4B5 | 255,228,181 | 38,29,100   |
| <p style="background-color: #FFDEAD">　　　</p> | NAVAJO_WHITE                        | 那瓦霍白     | #FFDEAD | 255,222,173 | 36,32,100   |
| <p style="background-color: #000080">　　　</p> | NAVY                                | 海军蓝 / 深蓝 | #000080 | 0,0,128     | 240,100,50  |
| <p style="background-color: #FDF5E6">　　　</p> | OLD_LACE                            | 旧蕾丝      | #FDF5E6 | 253,245,230 | 39,9,99     |
| <p style="background-color: #808000">　　　</p> | OLIVE                               | 橄榄       | #808000 | 128,128,0   | 60,100,50   |
| <p style="background-color: #6B8E23">　　　</p> | OLIVE_DRAB                          | 橄榄军服绿    | #6B8E23 | 107,142,35  | 80,75,56    |
| <p style="background-color: #FFA500">　　　</p> | ORANGE                              | 橙        | #FFA500 | 255,165,0   | 39,100,100  |
| <p style="background-color: #FF4500">　　　</p> | ORANGE_RED                          | 橙红       | #FF4500 | 255,69,0    | 16,100,100  |
| <p style="background-color: #DA70D6">　　　</p> | ORCHID                              | 兰花 / 兰紫  | #DA70D6 | 218,112,214 | 302,49,85   |
| <p style="background-color: #EEE8AA">　　　</p> | PALE_GOLDENROD                      | 灰金菊      | #EEE8AA | 238,232,170 | 55,29,93    |
| <p style="background-color: #98FB98">　　　</p> | PALE_GREEN                          | 灰绿       | #98FB98 | 152,251,152 | 120,39,98   |
| <p style="background-color: #AFEEEE">　　　</p> | PALE_TURQUOISE                      | 灰绿松石     | #AFEEEE | 175,238,238 | 180,26,93   |
| <p style="background-color: #DB7093">　　　</p> | PALE_VIOLET_RED                     | 灰紫红      | #DB7093 | 219,112,147 | 340,49,86   |
| <p style="background-color: #FFEFD5">　　　</p> | PAPAYA_WHIP                         | 蕃木瓜      | #FFEFD5 | 255,239,213 | 37,16,100   |
| <p style="background-color: #800080">　　　</p> | PATRIARCH                           | 宗主教      | #800080 | 128,0,128   | 300,100,50  |
| <p style="background-color: #FFDAB9">　　　</p> | PEACH_PUFF                          | 粉扑桃      | #FFDAB9 | 255,218,185 | 28,27,100   |
| <p style="background-color: #CD853F">　　　</p> | PERU                                | 秘鲁       | #CD853F | 205,133,63  | 30,69,80    |
| <p style="background-color: #FFC0CB">　　　</p> | PINK                                | 粉红       | #FFC0CB | 255,192,203 | 350,25,100  |
| <p style="background-color: #B0E0E6">　　　</p> | POWDER_BLUE                         | 粉蓝       | #B0E0E6 | 176,224,230 | 187,23,90   |
| <p style="background-color: #663399">　　　</p> | REBECCA_PURPLE                      | 丽贝卡紫     | #663399 | 102,51,153  | 270,67,60   |
| <p style="background-color: #FF0000">　　　</p> | RED                                 | 红        | #FF0000 | 255,0,0     | 0,100,100   |
| <p style="background-color: #BC8F8F">　　　</p> | ROSY_BROWN                          | 玫瑰褐      | #BC8F8F | 188,143,143 | 0,24,74     |
| <p style="background-color: #4169E1">　　　</p> | ROYAL_BLUE                          | 品蓝 / 皇室蓝 | #4169E1 | 65,105,225  | 225,71,88   |
| <p style="background-color: #8B4513">　　　</p> | SADDLE_BROWN                        | 鞍褐       | #8B4513 | 139,69,19   | 25,86,55    |
| <p style="background-color: #FA8072">　　　</p> | SALMON                              | 鲑红       | #FA8072 | 250,128,114 | 6,54,98     |
| <p style="background-color: #F4A460">　　　</p> | SAND_BROWN                          | 沙褐       | #F4A460 | 244,164,96  | 28,61,96    |
| <p style="background-color: #FFF5EE">　　　</p> | SEASHELL                            | 海贝       | #FFF5EE | 255,245,238 | 25,7,100    |
| <p style="background-color: #2E8B57">　　　</p> | SEA_GREEN                           | 海绿       | #2E8B57 | 46,139,87   | 146,67,55   |
| <p style="background-color: #A0522D">　　　</p> | SIENNA                              | 赭黄       | #A0522D | 160,82,45   | 19,72,63    |
| <p style="background-color: #C0C0C0">　　　</p> | SILVER                              | 银        | #C0C0C0 | 192,192,192 | 0,0,75      |
| <p style="background-color: #87CEEB">　　　</p> | SKY_BLUE                            | 天空蓝      | #87CEEB | 135,206,235 | 197,43,92   |
| <p style="background-color: #6A5ACD">　　　</p> | SLATE_BLUE                          | 岩蓝       | #6A5ACD | 106,90,205  | 248,56,80   |
| <p style="background-color: #708090">　　　</p> | SLATE_GRAY / SLATE_GREY             | 岩灰       | #708090 | 112,128,144 | 210,22,56   |
| <p style="background-color: #FFFAFA">　　　</p> | SNOW                                | 雪        | #FFFAFA | 255,250,250 | 0,2,100     |
| <p style="background-color: #00FF7F">　　　</p> | SPRING_GREEN                        | 春绿       | #00FF7F | 0,255,127   | 150,100,100 |
| <p style="background-color: #4682B4">　　　</p> | STEEL_BLUE                          | 钢青       | #4682B4 | 70,130,180  | 207,61,71   |
| <p style="background-color: #D2B48C">　　　</p> | TAN                                 | 日晒       | #D2B48C | 210,180,140 | 34,33,82    |
| <p style="background-color: #008080">　　　</p> | TEAL                                | 鸭绿 / 凫绿  | #008080 | 0,128,128   | 180,100,50  |
| <p style="background-color: #D8BFD8">　　　</p> | THISTLE                             | 蓟紫       | #D8BFD8 | 216,191,216 | 300,12,85   |
| <p style="background-color: #FF6347">　　　</p> | TOMATO                              | 蕃茄红      | #FF6347 | 255,99,71   | 9,72,100    |
| <p style="background-color: #40E0D0">　　　</p> | TURQUOISE                           | 绿松       | #40E0D0 | 64,224,208  | 174,71,88   |
| <p style="background-color: #EE82EE">　　　</p> | VIOLET                              | 紫罗兰      | #EE82EE | 238,130,238 | 300,45,93   |
| <p style="background-color: #F5DEB3">　　　</p> | WHEAT                               | 小麦       | #F5DEB3 | 245,222,179 | 39,27,96    |
| <p style="background-color: #FFFFFF">　　　</p> | WHITE                               | 白        | #FFFFFF | 255,255,255 | 0,0,100     |
| <p style="background-color: #F5F5F5">　　　</p> | WHITE_SMOKE                         | 白烟       | #F5F5F5 | 245,245,245 | 0,0,96      |
| <p style="background-color: #FFFF00">　　　</p> | YELLOW                              | 黄        | #FFFF00 | 255,255,0   | 60,100,100  |
| <p style="background-color: #9ACD32">　　　</p> | YELLOW_GREEN                        | 黄绿       | #9ACD32 | 154,205,50  | 80,76,80    |

## WEB 颜色列表

此小节的 WEB 颜色列表综合了 [ X11 颜色名称 / CSS3 标准名称 / HTML4 标准名称 / SVG 颜色名称 ] 等.  

此列表是一个相对较大的颜色列表集合, 但可能并未完全包含上述所有颜色名称条目, 也可能会不定期增加新条目.

使用方式:

```js
colors.web.BURNT_ORANGE;
```

> 参阅: [Wikipedia (中)](https://zh.wikipedia.org/zh-cn/%E9%A2%9C%E8%89%B2%E5%88%97%E8%A1%A8)

|                      颜色                      | 变量名                        | 颜色译名        | Hex 代码  | RGB         | HSV         |
|:--------------------------------------------:|----------------------------|-------------|---------|-------------|-------------|
| <p style="background-color: #F0F8FF">　　　</p> | ALICE_BLUE                 | 爱丽丝蓝        | #F0F8FF | 240,248,255 | 208,6,100   |
| <p style="background-color: #E32636">　　　</p> | ALIZARIN_CRIMSON           | 茜红 / 深茜红    | #E32636 | 227,38,54   | 355,83,89   |
| <p style="background-color: #FFBF00">　　　</p> | AMBER                      | 琥珀          | #FFBF00 | 255,191,0   | 45,100,100  |
| <p style="background-color: #9966CC">　　　</p> | AMETHYST                   | 紫水晶         | #9966CC | 153,102,204 | 270,50,80   |
| <p style="background-color: #FAEBD7">　　　</p> | ANTIQUE_WHITE              | 古董白         | #FAEBD7 | 250,235,215 | 34,14,98    |
| <p style="background-color: #8CE600">　　　</p> | APPLE_GREEN                | 苹果绿         | #8CE600 | 140,230,0   | 83,100,90   |
| <p style="background-color: #E69966">　　　</p> | APRICOT                    | 杏黄          | #E69966 | 230,153,102 | 24,56,90    |
| <p style="background-color: #AFDFE4">　　　</p> | AQUA                       | 水           | #AFDFE4 | 175,223,228 | 186,23,89   |
| <p style="background-color: #7FFFD4">　　　</p> | AQUAMARINE                 | 蓝绿 / 碧蓝     | #7FFFD4 | 127,255,212 | 160,50,100  |
| <p style="background-color: #66FFE6">　　　</p> | AQUA_BLUE                  | 水蓝          | #66FFE6 | 102,255,230 | 170,60,100  |
| <p style="background-color: #007FFF">　　　</p> | AZURE                      | 蔚蓝 / 湛蓝     | #007FFF | 0,127,255   | 210,100,100 |
| <p style="background-color: #89CFF0">　　　</p> | BABY_BLUE                  | 浅蓝          | #89CFF0 | 137,207,240 | 199,43,94   |
| <p style="background-color: #FFD9E6">　　　</p> | BABY_PINK                  | 浅粉红         | #FFD9E6 | 255,217,230 | 339,15,100  |
| <p style="background-color: #F5F5DC">　　　</p> | BEIGE                      | 米黄          | #F5F5DC | 245,245,220 | 60,10,96    |
| <p style="background-color: #FFE4C4">　　　</p> | BISQUE                     | 陶坯黄         | #FFE4C4 | 255,228,196 | 33,23,100   |
| <p style="background-color: #000000">　　　</p> | BLACK                      | 黑           | #000000 | 0,0,0       | 0,0,0       |
| <p style="background-color: #FFEBCD">　　　</p> | BLANCHED_ALMOND            | 杏仁白         | #FFEBCD | 255,235,205 | 36,20,100   |
| <p style="background-color: #0000FF">　　　</p> | BLUE                       | 蓝           | #0000FF | 0,0,255     | 240,100,100 |
| <p style="background-color: #8A2BE2">　　　</p> | BLUE_VIOLET                | 蓝紫          | #8A2BE2 | 138,43,226  | 271,81,89   |
| <p style="background-color: #66FF00">　　　</p> | BRIGHT_GREEN               | 黄绿 / 明绿     | #66FF00 | 102,255,0   | 96,100,100  |
| <p style="background-color: #CD7F32">　　　</p> | BRONZE                     | 铜           | #CD7F32 | 184,115,51  | 29,72,72    |
| <p style="background-color: #A52A2A">　　　</p> | BROWN                      | 褐           | #A52A2A | 165,42,42   | 0,75,65     |
| <p style="background-color: #800020">　　　</p> | BURGUNDY                   | 勃艮第酒红       | #800020 | 128,0,32    | 345,100,50  |
| <p style="background-color: #DEB887">　　　</p> | BURLY_WOOD                 | 硬木          | #DEB887 | 222,184,135 | 34,39,87    |
| <p style="background-color: #CC5500">　　　</p> | BURNT_ORANGE               | 燃橙          | #CC5500 | 204,85,0    | 25,100,80   |
| <p style="background-color: #5F9EA0">　　　</p> | CADET_BLUE                 | 军服蓝         | #5F9EA0 | 95,158,160  | 182,41,63   |
| <p style="background-color: #A16B47">　　　</p> | CAMEL                      | 驼           | #A16B47 | 161,107,71  | 24,56,63    |
| <p style="background-color: #E63995">　　　</p> | CAMELLIA                   | 山茶红         | #E63995 | 230,57,149  | 328,75,90   |
| <p style="background-color: #FFEF00">　　　</p> | CANARY_YELLOW              | 鲜黄          | #FFEF00 | 255,239,0   | 56,100,100  |
| <p style="background-color: #990036">　　　</p> | CARDINAL_RED               | 枢机红         | #990036 | 153,0,54    | 339,100,60  |
| <p style="background-color: #E6005C">　　　</p> | CARMINE                    | 胭脂红         | #E6005C | 230,0,92    | 336,100,90  |
| <p style="background-color: #ACE1AF">　　　</p> | CELADON                    | 青瓷绿         | #ACE1AF | 172,225,175 | 123,24,88   |
| <p style="background-color: #DE3163">　　　</p> | CERISE                     | 樱桃红 / 樱桃    | #DE3163 | 222,49,99   | 343,78,87   |
| <p style="background-color: #2A52BE">　　　</p> | CERULEAN_BLUE              | 蔚蓝 / 天青蓝    | #2A52BE | 42,82,190   | 224,78,75   |
| <p style="background-color: #FFFF99">　　　</p> | CHAMPAGNE_YELLOW           | 香槟黄         | #FFFF99 | 255,255,153 | 60,40,100   |
| <p style="background-color: #7FFF00">　　　</p> | CHARTREUSE                 | 查特酒绿        | #7FFF00 | 127,255,0   | 90,100,100  |
| <p style="background-color: #D2691E">　　　</p> | CHOCOLATE                  | 巧克力         | #D2691E | 210,105,30  | 25,86,82    |
| <p style="background-color: #E6B800">　　　</p> | CHROME_YELLOW              | 铬黄          | #E6B800 | 230,184,0   | 48,100,90   |
| <p style="background-color: #CCA3CC">　　　</p> | CLEMATIS                   | 铁线莲紫        | #CCA3CC | 204,163,204 | 300,20,80   |
| <p style="background-color: #0047AB">　　　</p> | COBALT_BLUE                | 钴蓝          | #0047AB | 0,71,171    | 215,100,67  |
| <p style="background-color: #66FF59">　　　</p> | COBALT_GREEN               | 钴绿          | #66FF59 | 102,255,89  | 115,65,100  |
| <p style="background-color: #4D1F00">　　　</p> | COCONUT_BROWN              | 椰褐          | #4D1F00 | 77,31,0     | 24,100,30   |
| <p style="background-color: #4D3900">　　　</p> | COFFEE                     | 咖啡          | #4D3900 | 77,57,0     | 44,100,30   |
| <p style="background-color: #FF7F50">　　　</p> | CORAL                      | 珊瑚红         | #FF7F50 | 255,127,80  | 16,69,100   |
| <p style="background-color: #FF80BF">　　　</p> | CORAL_PINK                 | 浅珊瑚红        | #FF80BF | 255,128,191 | 330,50,100  |
| <p style="background-color: #6495ED">　　　</p> | CORNFLOWER_BLUE            | 矢车菊蓝        | #6495ED | 100,149,237 | 219,58,93   |
| <p style="background-color: #FFF8DC">　　　</p> | CORN_SILK                  | 玉米丝         | #FFF8DC | 255,248,220 | 48,14,100   |
| <p style="background-color: #FFFDD0">　　　</p> | CREAM                      | 奶油          | #FFFDD0 | 255,253,208 | 57,18,100   |
| <p style="background-color: #DC143C">　　　</p> | CRIMSON                    | 绯红          | #DC143C | 220,20,60   | 348,91,86   |
| <p style="background-color: #00FFFF">　　　</p> | CYAN                       | 青           | #00FFFF | 0,255,255   | 180,100,100 |
| <p style="background-color: #0DBF8C">　　　</p> | CYAN_BLUE                  | 青蓝          | #0DBF8C | 13,191,140  | 163,93,75   |
| <p style="background-color: #00008B">　　　</p> | DARK_BLUE                  | 暗蓝          | #00008B | 0,0,139     | 240,100,55  |
| <p style="background-color: #008B8B">　　　</p> | DARK_CYAN                  | 暗青          | #008B8B | 0,139,139   | 180,100,55  |
| <p style="background-color: #B8860B">　　　</p> | DARK_GOLDENROD             | 暗金菊         | #B8860B | 184,134,11  | 43,94,72    |
| <p style="background-color: #A9A9A9">　　　</p> | DARK_GRAY                  | 暗灰          | #A9A9A9 | 169,169,169 | 0,0,66      |
| <p style="background-color: #006400">　　　</p> | DARK_GREEN                 | 暗绿          | #006400 | 0,100,0     | 120,100,39  |
| <p style="background-color: #BDB76B">　　　</p> | DARK_KHAKI                 | 暗卡其         | #BDB76B | 189,183,107 | 56,43,74    |
| <p style="background-color: #8B008B">　　　</p> | DARK_MAGENTA               | 暗洋红         | #8B008B | 139,0,139   | 300,100,55  |
| <p style="background-color: #24367D">　　　</p> | DARK_MINERAL_BLUE          | 暗矿蓝         | #24367D | 36,54,125   | 228,71,49   |
| <p style="background-color: #556B2F">　　　</p> | DARK_OLIVE_GREEN           | 暗橄榄绿        | #556B2F | 85,107,47   | 82,56,42    |
| <p style="background-color: #FF8C00">　　　</p> | DARK_ORANGE                | 暗橙          | #FF8C00 | 255,140,0   | 33,100,100  |
| <p style="background-color: #9932CC">　　　</p> | DARK_ORCHID                | 暗兰紫         | #9932CC | 153,50,204  | 280,75,80   |
| <p style="background-color: #003399">　　　</p> | DARK_POWDER_BLUE           | 暗粉蓝         | #003399 | 0,51,153    | 220,100,60  |
| <p style="background-color: #8B0000">　　　</p> | DARK_RED                   | 暗红          | #8B0000 | 139,0,0     | 0,100,55    |
| <p style="background-color: #E9967A">　　　</p> | DARK_SALMON                | 暗鲑红         | #E9967A | 233,150,122 | 15,48,91    |
| <p style="background-color: #8FBC8F">　　　</p> | DARK_SEA_GREEN             | 暗海绿         | #8FBC8F | 143,188,143 | 120,24,74   |
| <p style="background-color: #483D8B">　　　</p> | DARK_SLATE_BLUE            | 暗岩蓝         | #483D8B | 72,61,139   | 248,56,55   |
| <p style="background-color: #2F4F4F">　　　</p> | DARK_SLATE_GRAY            | 暗岩灰         | #2F4F4F | 47,79,79    | 180,41,31   |
| <p style="background-color: #00CED1">　　　</p> | DARK_TURQUOISE             | 暗绿松石        | #00CED1 | 0,206,209   | 181,100,82  |
| <p style="background-color: #9400D3">　　　</p> | DARK_VIOLET                | 暗紫          | #9400D3 | 148,0,211   | 282,100,83  |
| <p style="background-color: #FF1493">　　　</p> | DEEP_PINK                  | 深粉红         | #FF1493 | 255,20,147  | 328,92,100  |
| <p style="background-color: #00BFFF">　　　</p> | DEEP_SKY_BLUE              | 深天蓝         | #00BFFF | 0,191,255   | 195,100,100 |
| <p style="background-color: #696969">　　　</p> | DIM_GRAY                   | 昏灰          | #696969 | 105,105,105 | 0,0,41      |
| <p style="background-color: #1E90FF">　　　</p> | DODGER_BLUE                | 道奇蓝         | #1E90FF | 30,144,255  | 210,88,100  |
| <p style="background-color: #50C878">　　　</p> | EMERALD                    | 碧绿          | #50C878 | 80,200,120  | 140,60,78   |
| <p style="background-color: #B22222">　　　</p> | FIRE_BRICK                 | 砖红          | #B22222 | 178,34,34   | 0,81,70     |
| <p style="background-color: #E68AB8">　　　</p> | FLAMINGO                   | 火鹤红         | #E68AB8 | 230,138,184 | 330,40,90   |
| <p style="background-color: #FFFAF0">　　　</p> | FLORAL_WHITE               | 花卉白         | #FFFAF0 | 255,250,240 | 40,6,100    |
| <p style="background-color: #73B839">　　　</p> | FOLIAGE_GREEN              | 叶绿          | #73B839 | 115,184,57  | 93,69,72    |
| <p style="background-color: #228B22">　　　</p> | FOREST_GREEN               | 森林绿         | #228B22 | 34,139,34   | 120,76,55   |
| <p style="background-color: #99FF4D">　　　</p> | FRESH_LEAVES               | 嫩绿          | #99FF4D | 153,255,77  | 94,70,100   |
| <p style="background-color: #F400A1">　　　</p> | FUCHSIA                    | 紫红          | #F400A1 | 244,0,161   | 320,100,96  |
| <p style="background-color: #DCDCDC">　　　</p> | GAINSBORO                  | 庚斯博罗灰       | #DCDCDC | 220,220,220 | 0,0,86      |
| <p style="background-color: #F8F8FF">　　　</p> | GHOST_WHITE                | 幽灵白         | #F8F8FF | 248,248,255 | 240,3,100   |
| <p style="background-color: #FFD700">　　　</p> | GOLDEN / GOLD              | 金           | #FFD700 | 255,215,0   | 51,100,100  |
| <p style="background-color: #DAA520">　　　</p> | GOLDENROD                  | 金菊          | #DAA520 | 218,165,32  | 43,85,85    |
| <p style="background-color: #99E64D">　　　</p> | GRASS_GREEN                | 草绿          | #99E64D | 153,230,77  | 90,67,90    |
| <p style="background-color: #808080">　　　</p> | GRAY                       | 灰           | #808080 | 128,128,128 | 0,0,50      |
| <p style="background-color: #8674A1">　　　</p> | GRAYISH_PURPLE             | 浅灰紫         | #8674A1 | 134,116,161 | 264,28,63   |
| <p style="background-color: #008000">　　　</p> | GREEN                      | 绿           | #008000 | 0,128,0     | 120,100,50  |
| <p style="background-color: #ADFF2F">　　　</p> | GREEN_YELLOW               | 绿黄          | #ADFF2F | 173,255,47  | 84,82,100   |
| <p style="background-color: #DF73FF">　　　</p> | HELIOTROPE                 | 缬草紫         | #DF73FF | 223,115,255 | 286,55,100  |
| <p style="background-color: #F0FFF0">　　　</p> | HONEYDEW                   | 蜜瓜绿         | #F0FFF0 | 240,255,240 | 120,6,100   |
| <p style="background-color: #FFB366">　　　</p> | HONEY_ORANGE               | 蜜橙          | #FFB366 | 255,179,102 | 30,60,100   |
| <p style="background-color: #B8DDC8">　　　</p> | HORIZON_BLUE               | 苍           | #B8DDC8 | 184,221,200 | 146,35,100  |
| <p style="background-color: #FF69B4">　　　</p> | HOT_PINK                   | 暖粉红         | #FF69B4 | 255,105,180 | 330,59,100  |
| <p style="background-color: #CD5C5C">　　　</p> | INDIAN_RED                 | 印度红         | #CD5C5C | 205,92,92   | 0,55,80     |
| <p style="background-color: #4B0080">　　　</p> | INDIGO                     | 靛           | #4B0080 | 75,0,128    | 275,100,50  |
| <p style="background-color: #002FA7">　　　</p> | INTERNATIONAL_KLEIN_BLUE   | 国际奇连蓝       | #002FA7 | 0,47,167    | 223,100,65  |
| <p style="background-color: #625B57">　　　</p> | IRON_GRAY                  | 铁灰          | #625B57 | 98,91,87    | 21,12,39    |
| <p style="background-color: #FFFFF0">　　　</p> | IVORY                      | 象牙          | #FFFFF0 | 255,255,240 | 60,6,100    |
| <p style="background-color: #36BF36">　　　</p> | IVY_GREEN                  | 常春藤绿        | #36BF36 | 54,191,54   | 120,72,75   |
| <p style="background-color: #E6C35C">　　　</p> | JASMINE                    | 茉莉黄         | #E6C35C | 230,195,92  | 45,60,90    |
| <p style="background-color: #996B1F">　　　</p> | KHAKI                      | 卡其          | #996B1F | 153,107,31  | 37,80,60    |
| <p style="background-color: #26619C">　　　</p> | LAPIS_LAZULI               | 天青石蓝        | #26619C | 38,97,156   | 210,76,61   |
| <p style="background-color: #B57EDC">　　　</p> | LAVENDER                   | 薰衣草紫        | #B57EDC | 181,126,220 | 275,43,86   |
| <p style="background-color: #CCCCFF">　　　</p> | LAVENDER_BLUE / PERIWINKLE | 薰衣草蓝 / 长春花  | #CCCCFF | 204,204,255 | 240,20,100  |
| <p style="background-color: #FFF0F5">　　　</p> | LAVENDER_BLUSH             | 薰衣草紫红       | #FFF0F5 | 255,240,245 | 340,6,100   |
| <p style="background-color: #EE82EE">　　　</p> | LAVENDER_MAGENTA           | 亮紫          | #EE82EE | 238,130,238 | 300,45,93   |
| <p style="background-color: #E6E6FA">　　　</p> | LAVENDER_MIST              | 薰衣草雾        | #E6E6FA | 230,230,250 | 240,8,98    |
| <p style="background-color: #7CFC00">　　　</p> | LAWN_GREEN                 | 草坪绿         | #7CFC00 | 124,252,0   | 90,100,99   |
| <p style="background-color: #FFFACD">　　　</p> | LEMON_CHIFFON              | 柠檬绸         | #FFFACD | 255,250,205 | 54,20,100   |
| <p style="background-color: #ADD8E6">　　　</p> | LIGHT_BLUE                 | 亮蓝          | #ADD8E6 | 173,216,230 | 195,25,90   |
| <p style="background-color: #F08080">　　　</p> | LIGHT_CORAL                | 亮珊瑚         | #F08080 | 240,128,128 | 0,47,94     |
| <p style="background-color: #E0FFFF">　　　</p> | LIGHT_CYAN                 | 亮青          | #E0FFFF | 224,255,255 | 180,12,100  |
| <p style="background-color: #FAFAD2">　　　</p> | LIGHT_GOLDENROD_YELLOW     | 亮金菊黄        | #FAFAD2 | 250,250,210 | 60,16,98    |
| <p style="background-color: #D3D3D3">　　　</p> | LIGHT_GRAY                 | 亮灰          | #D3D3D3 | 211,211,211 | 0,0,83      |
| <p style="background-color: #90EE90">　　　</p> | LIGHT_GREEN                | 亮绿          | #90EE90 | 144,238,144 | 120,39,93   |
| <p style="background-color: #F0E68C">　　　</p> | LIGHT_KHAKI                | 亮卡其         | #F0E68C | 240,230,140 | 54,42,94    |
| <p style="background-color: #FFB6C1">　　　</p> | LIGHT_PINK                 | 亮粉红         | #FFB6C1 | 255,182,193 | 351,29,100  |
| <p style="background-color: #FFA07A">　　　</p> | LIGHT_SALMON               | 亮鲑红         | #FFA07A | 255,160,122 | 17,52,100   |
| <p style="background-color: #20B2AA">　　　</p> | LIGHT_SEA_GREEN            | 亮海绿         | #20B2AA | 32,178,170  | 177,82,70   |
| <p style="background-color: #87CEFA">　　　</p> | LIGHT_SKY_BLUE             | 浅天蓝         | #87CEFA | 135,206,250 | 203,46,98   |
| <p style="background-color: #778899">　　　</p> | LIGHT_SLATE_GRAY           | 亮岩灰         | #778899 | 119,136,153 | 210,22,60   |
| <p style="background-color: #B0C4DE">　　　</p> | LIGHT_STEEL_BLUE           | 亮钢蓝         | #B0C4DE | 176,196,222 | 214,21,87   |
| <p style="background-color: #B09DB9">　　　</p> | LIGHT_VIOLET               | 亮紫          | #B09DB9 | 176,157,185 | 281,15,73   |
| <p style="background-color: #FFFFE0">　　　</p> | LIGHT_YELLOW               | 亮黄          | #FFFFE0 | 255,255,224 | 60,12,100   |
| <p style="background-color: #C8A2C8">　　　</p> | LILAC                      | 紫丁香         | #C8A2C8 | 200,162,200 | 300,19,78   |
| <p style="background-color: #CCFF00">　　　</p> | LIME / LIGHT_LIME          | 柠檬绿 / 亮柠檬绿  | #CCFF00 | 204,255,0   | 72,100,100  |
| <p style="background-color: #32CD32">　　　</p> | LIME_GREEN                 | 柠檬绿         | #32CD32 | 50,205,50   | 120,76,80   |
| <p style="background-color: #FAF0E6">　　　</p> | LINEN                      | 亚麻          | #FAF0E6 | 250,240,230 | 30,8,98     |
| <p style="background-color: #FF00FF">　　　</p> | MAGENTA                    | 洋红 / 品红     | #FF00FF | 255,0,255   | 300,100,100 |
| <p style="background-color: #FF0DA6">　　　</p> | MAGENTA_ROSE               | 洋玫瑰红        | #FF0DA6 | 255,13,166  | 322,95,100  |
| <p style="background-color: #22C32E">　　　</p> | MALACHITE                  | 孔雀石绿        | #22C32E | 34,195,46   | 124,83,76   |
| <p style="background-color: #D94DFF">　　　</p> | MALLOW                     | 锦葵紫         | #D94DFF | 217,77,255  | 287,70,100  |
| <p style="background-color: #FF9900">　　　</p> | MARIGOLD                   | 万寿菊黄        | #FF9900 | 255,153,0   | 36,100,100  |
| <p style="background-color: #00477D">　　　</p> | MARINE_BLUE                | 水手蓝         | #00477D | 0,71,125    | 206,100,49  |
| <p style="background-color: #800000">　　　</p> | MAROON                     | 栗           | #800000 | 128,0,0     | 0,100,50    |
| <p style="background-color: #E0B0FF">　　　</p> | MAUVE                      | 木槿紫         | #E0B0FF | 224,176,255 | 276,31,100  |
| <p style="background-color: #66CDAA">　　　</p> | MEDIUM_AQUAMARINE          | 中碧蓝         | #66CDAA | 102,205,170 | 160,50,80   |
| <p style="background-color: #0000CD">　　　</p> | MEDIUM_BLUE                | 中蓝          | #0000CD | 0,0,205     | 240,100,80  |
| <p style="background-color: #DDA0DD">　　　</p> | MEDIUM_LAVENDER_MAGENTA    | 梅红          | #DDA0DD | 221,160,221 | 300,28,87   |
| <p style="background-color: #BA55D3">　　　</p> | MEDIUM_ORCHID              | 中兰紫         | #BA55D3 | 186,85,211  | 288,60,83   |
| <p style="background-color: #9370DB">　　　</p> | MEDIUM_PURPLE              | 中紫          | #9370DB | 147,112,219 | 260,49,86   |
| <p style="background-color: #3CB371">　　　</p> | MEDIUM_SEA_GREEN           | 中海绿         | #3CB371 | 60,179,113  | 147,66,70   |
| <p style="background-color: #7B68EE">　　　</p> | MEDIUM_SLATE_BLUE          | 中岩蓝         | #7B68EE | 123,104,238 | 249,56,93   |
| <p style="background-color: #00FA9A">　　　</p> | MEDIUM_SPRING_GREEN        | 中春绿         | #00FA9A | 0,250,154   | 157,100,98  |
| <p style="background-color: #48D1CC">　　　</p> | MEDIUM_TURQUOISE           | 中绿松石        | #48D1CC | 72,209,204  | 178,66,82   |
| <p style="background-color: #C71585">　　　</p> | MEDIUM_VIOLET_RED          | 中青紫红        | #C71585 | 199,21,133  | 322,89,78   |
| <p style="background-color: #191970">　　　</p> | MIDNIGHT_BLUE              | 午夜蓝         | #191970 | 25,25,112   | 240,78,44   |
| <p style="background-color: #E6D933">　　　</p> | MIMOSA                     | 含羞草黄        | #E6D933 | 230,217,51  | 56,78,90    |
| <p style="background-color: #004D99">　　　</p> | MINERAL_BLUE               | 矿蓝          | #004D99 | 0,77,153    | 210,100,60  |
| <p style="background-color: #A39DAE">　　　</p> | MINERAL_VIOLET             | 矿紫          | #A39DAE | 163,157,174 | 261,10,68   |
| <p style="background-color: #16982B">　　　</p> | MINT                       | 薄荷绿         | #16982B | 22,152,43   | 130,86,60   |
| <p style="background-color: #F5FFFA">　　　</p> | MINT_CREAM                 | 薄荷奶油        | #F5FFFA | 245,255,250 | 150,4,100   |
| <p style="background-color: #FFE4E1">　　　</p> | MISTY_ROSE                 | 雾玫瑰         | #FFE4E1 | 255,228,225 | 6,12,100    |
| <p style="background-color: #FFE4B5">　　　</p> | MOCCASIN                   | 鹿皮鞋         | #FFE4B5 | 255,228,181 | 38,29,100   |
| <p style="background-color: #FFFF4D">　　　</p> | MOON_YELLOW                | 月黄          | #FFFF4D | 255,255,77  | 60,70,100   |
| <p style="background-color: #697723">　　　</p> | MOSS_GREEN                 | 苔藓绿         | #697723 | 105,119,35  | 70,71,47    |
| <p style="background-color: #CCCC4D">　　　</p> | MUSTARD                    | 芥末黄         | #CCCC4D | 204,204,77  | 60,62,80    |
| <p style="background-color: #FFDEAD">　　　</p> | NAVAJO_WHITE               | 那瓦霍白        | #FFDEAD | 255,222,173 | 36,32,100   |
| <p style="background-color: #000080">　　　</p> | NAVY / NAVY_BLUE           | 海军蓝 / 藏青    | #000080 | 0,0,128     | 240,100,50  |
| <p style="background-color: #CC7722">　　　</p> | OCHER                      | 赭           | #CC7722 | 204,119,34  | 30,83,80    |
| <p style="background-color: #FDF5E6">　　　</p> | OLD_LACE                   | 旧蕾丝         | #FDF5E6 | 253,245,230 | 39,9,99     |
| <p style="background-color: #C08081">　　　</p> | OLD_ROSE                   | 陈玫红         | #C08081 | 192,128,129 | 359,33,75   |
| <p style="background-color: #808000">　　　</p> | OLIVE                      | 橄榄          | #808000 | 128,128,0   | 60,100,50   |
| <p style="background-color: #6B8E23">　　　</p> | OLIVE_DRAB                 | 橄榄军服绿       | #6B8E23 | 107,142,35  | 80,75,56    |
| <p style="background-color: #B784A7">　　　</p> | OPERA_MAUVE                | 优品紫红        | #B784A7 | 183,132,167 | 319,28,72   |
| <p style="background-color: #FFA500">　　　</p> | ORANGE                     | 橙           | #FFA500 | 255,165,0   | 39,100,100  |
| <p style="background-color: #FF4500">　　　</p> | ORANGE_RED                 | 橙红          | #FF4500 | 255,69,0    | 16,100,100  |
| <p style="background-color: #DA70D6">　　　</p> | ORCHID                     | 兰花 / 兰紫     | #DA70D6 | 218,112,214 | 302,49,85   |
| <p style="background-color: #E6CFE6">　　　</p> | PAIL_LILAC                 | 淡紫丁香        | #E6CFE6 | 230,207,230 | 300,10,90   |
| <p style="background-color: #D1EDF2">　　　</p> | PALE_BLUE                  | 灰蓝          | #D1EDF2 | 209,237,242 | 189,14,95   |
| <p style="background-color: #5E86C1">　　　</p> | PALE_DENIM                 | 灰丁宁蓝 / 白牛仔布 | #5E86C1 | 94,134,193  | 216,51,76   |
| <p style="background-color: #EEE8AA">　　　</p> | PALE_GOLDENROD             | 灰金菊         | #EEE8AA | 238,232,170 | 55,29,93    |
| <p style="background-color: #98FB98">　　　</p> | PALE_GREEN                 | 灰绿          | #98FB98 | 152,251,152 | 120,39,98   |
| <p style="background-color: #CCB38C">　　　</p> | PALE_OCHRE                 | 灰土          | #CCB38C | 204,179,140 | 37,31,80    |
| <p style="background-color: #AFEEEE">　　　</p> | PALE_TURQUOISE             | 灰绿松石        | #AFEEEE | 175,238,238 | 180,26,93   |
| <p style="background-color: #DB7093">　　　</p> | PALE_VIOLET_RED            | 灰紫红         | #DB7093 | 219,112,147 | 340,49,86   |
| <p style="background-color: #7400A1">　　　</p> | PANSY                      | 三色堇紫        | #7400A1 | 116,0,161   | 283,100,63  |
| <p style="background-color: #FFEFD5">　　　</p> | PAPAYA_WHIP                | 蕃木瓜         | #FFEFD5 | 255,239,213 | 37,16,100   |
| <p style="background-color: #800080">　　　</p> | PATRIARCH                  | 宗主教         | #800080 | 128,0,128   | 300,100,50  |
| <p style="background-color: #FFE5B4">　　　</p> | PEACH                      | 桃           | #FFE5B4 | 255,229,180 | 39,29,100   |
| <p style="background-color: #FBBEA1">　　　</p> | PEACH_PEARL                | 珍珠桃         | #FBBEA1 | 251,190,161 | 40,29,100   |
| <p style="background-color: #FFDAB9">　　　</p> | PEACH_PUFF                 | 粉扑桃         | #FFDAB9 | 255,218,185 | 28,27,100   |
| <p style="background-color: #00808C">　　　</p> | PEACOCK_BLUE               | 孔雀蓝         | #00808C | 0,128,140   | 185,100,55  |
| <p style="background-color: #00A15C">　　　</p> | PEACOCK_GREEN              | 孔雀绿         | #00A15C | 0,161,92    | 154,100,63  |
| <p style="background-color: #FFB3E6">　　　</p> | PEARL_PINK                 | 浅珍珠红        | #FFB3E6 | 255,179,230 | 320,30,100  |
| <p style="background-color: #FF4D40">　　　</p> | PERSIMMON                  | 柿子橙         | #FF4D40 | 255,77,64   | 4,75,100    |
| <p style="background-color: #CD853F">　　　</p> | PERU                       | 秘鲁          | #CD853F | 205,133,63  | 30,69,80    |
| <p style="background-color: #FFC0CB">　　　</p> | PINK                       | 粉红          | #FFC0CB | 255,192,203 | 350,25,100  |
| <p style="background-color: #8E4585">　　　</p> | PLUM                       | 梅红          | #8E4585 | 142,69,133  | 307,51,56   |
| <p style="background-color: #B0E0E6">　　　</p> | POWDER_BLUE                | 粉蓝          | #B0E0E6 | 176,224,230 | 187,23,90   |
| <p style="background-color: #003153">　　　</p> | PRUSSIAN_BLUE              | 普鲁士蓝        | #003153 | 0,49,83     | 205,100,43  |
| <p style="background-color: #6A0DAD">　　　</p> | PURPLE                     | 紫           | #6A0DAD | 106,13,173  | 275,92,68   |
| <p style="background-color: #FF0000">　　　</p> | RED                        | 红           | #FF0000 | 255,0,0     | 0,100,100   |
| <p style="background-color: #FF007F">　　　</p> | ROSE                       | 玫瑰红         | #FF007F | 255,0,127   | 330,100,100 |
| <p style="background-color: #FF66CC">　　　</p> | ROSE_PINK                  | 浅玫瑰红        | #FF66CC | 255,102,204 | 320,60,100  |
| <p style="background-color: #BC8F8F">　　　</p> | ROSY_BROWN                 | 玫瑰褐         | #BC8F8F | 188,143,143 | 0,24,74     |
| <p style="background-color: #4169E1">　　　</p> | ROYAL_BLUE                 | 品蓝 / 皇室蓝    | #4169E1 | 65,105,225  | 225,71,88   |
| <p style="background-color: #CC0080">　　　</p> | RUBY                       | 红宝石         | #CC0080 | 204,0,128   | 322,100,80  |
| <p style="background-color: #8B4513">　　　</p> | SADDLE_BROWN               | 鞍褐          | #8B4513 | 139,69,19   | 25,86,55    |
| <p style="background-color: #FA8072">　　　</p> | SALMON                     | 鲑红          | #FA8072 | 250,128,114 | 6,54,98     |
| <p style="background-color: #FF8099">　　　</p> | SALMON_PINK                | 浅鲑红         | #FF8099 | 255,128,153 | 348,50,100  |
| <p style="background-color: #4D80E6">　　　</p> | SALVIA_BLUE                | 鼠尾草蓝        | #4D80E6 | 77,128,230  | 220,67,90   |
| <p style="background-color: #E6C3C3">　　　</p> | SAND_BEIGE                 | 沙棕          | #E6C3C3 | 230,195,195 | 0,15,90     |
| <p style="background-color: #F4A460">　　　</p> | SAND_BROWN                 | 沙褐          | #F4A460 | 244,164,96  | 28,61,96    |
| <p style="background-color: #082567">　　　</p> | SAPPHIRE                   | 蓝宝石 / 青玉    | #082567 | 8,37,103    | 222,92,40   |
| <p style="background-color: #4798B3">　　　</p> | SAXE_BLUE                  | 萨克斯蓝        | #4798B3 | 71,152,179  | 195,60,70   |
| <p style="background-color: #FF2400">　　　</p> | SCARLET                    | 猩红 / 腥红     | #FF2400 | 255,36,0    | 8,100,100   |
| <p style="background-color: #FFF5EE">　　　</p> | SEASHELL                   | 海贝          | #FFF5EE | 255,245,238 | 25,7,100    |
| <p style="background-color: #2E8B57">　　　</p> | SEA_GREEN                  | 海绿          | #2E8B57 | 46,139,87   | 146,67,55   |
| <p style="background-color: #704214">　　　</p> | SEPIA                      | 深褐 / 乌贼墨    | #704214 | 112,66,20   | 30,82,44    |
| <p style="background-color: #FFB3BF">　　　</p> | SHELL_PINK                 | 壳黄红         | #FFB3BF | 255,179,191 | 351,30,100  |
| <p style="background-color: #A0522D">　　　</p> | SIENNA                     | 赭黄          | #A0522D | 160,82,45   | 19,72,63    |
| <p style="background-color: #C0C0C0">　　　</p> | SILVER                     | 银           | #C0C0C0 | 192,192,192 | 0,0,75      |
| <p style="background-color: #87CEEB">　　　</p> | SKY_BLUE                   | 天空蓝         | #87CEEB | 135,206,235 | 197,43,92   |
| <p style="background-color: #6A5ACD">　　　</p> | SLATE_BLUE                 | 岩蓝          | #6A5ACD | 106,90,205  | 248,56,80   |
| <p style="background-color: #708090">　　　</p> | SLATE_GRAY                 | 岩灰          | #708090 | 112,128,144 | 210,22,56   |
| <p style="background-color: #FFFAFA">　　　</p> | SNOW                       | 雪           | #FFFAFA | 255,250,250 | 0,2,100     |
| <p style="background-color: #FF73B3">　　　</p> | SPINEL_RED                 | 尖晶石红        | #FF73B3 | 255,115,179 | 333,55,100  |
| <p style="background-color: #00FF80">　　　</p> | SPRING_GREEN               | 春绿          | #00FF80 | 0,255,128   | 150,100,100 |
| <p style="background-color: #4682B4">　　　</p> | STEEL_BLUE                 | 钢青          | #4682B4 | 70,130,180  | 207,61,71   |
| <p style="background-color: #006374">　　　</p> | STRONG_BLUE                | 浓蓝          | #006374 | 0,99,116    | 189,100,45  |
| <p style="background-color: #E60000">　　　</p> | STRONG_RED                 | 鲜红          | #E60000 | 230,0,0     | 0,100,90    |
| <p style="background-color: #FF7300">　　　</p> | SUN_ORANGE                 | 阳橙          | #FF7300 | 255,115,0   | 27,100,100  |
| <p style="background-color: #D2B48C">　　　</p> | TAN                        | 日晒          | #D2B48C | 210,180,140 | 34,33,82    |
| <p style="background-color: #F28500">　　　</p> | TANGERINE                  | 橘           | #F28500 | 242,133,0   | 33,100,95   |
| <p style="background-color: #FFCC00">　　　</p> | TANGERINE_YELLOW           | 橙黄          | #FFCC00 | 255,204,0   | 48,100,100  |
| <p style="background-color: #008080">　　　</p> | TEAL                       | 鸭绿 / 凫绿     | #008080 | 0,128,128   | 180,100,50  |
| <p style="background-color: #D8BFD8">　　　</p> | THISTLE                    | 蓟紫          | #D8BFD8 | 216,191,216 | 300,12,85   |
| <p style="background-color: #FF6347">　　　</p> | TOMATO                     | 蕃茄红         | #FF6347 | 255,99,71   | 9,72,100    |
| <p style="background-color: #FF8033">　　　</p> | TROPICAL_ORANGE            | 热带橙         | #FF8033 | 255,128,51  | 23,80,100   |
| <p style="background-color: #30D5C8">　　　</p> | TURQUOISE                  | 绿松 / 绿松石    | #30D5C8 | 48,213,200  | 210,100,100 |
| <p style="background-color: #00FFEF">　　　</p> | TURQUOISE_BLUE             | 土耳其蓝        | #00FFEF | 0,255,239   | 176,100,100 |
| <p style="background-color: #4DE680">　　　</p> | TURQUOISE_GREEN            | 绿松石绿        | #4DE680 | 77,230,128  | 140,67,90   |
| <p style="background-color: #0033FF">　　　</p> | ULTRAMARINE                | 极浓海蓝        | #0033FF | 0,51,255    | 228,100,100 |
| <p style="background-color: #E34234">　　　</p> | VERMILION                  | 朱红          | #E34234 | 227,66,52   | 5,77,89     |
| <p style="background-color: #73E68C">　　　</p> | VERY_LIGHT_MALACHITE_GREEN | 孔雀石绿        | #73E68C | 115,230,140 | 133,50,90   |
| <p style="background-color: #8000FF">　　　</p> | VIOLET                     | 堇紫          | #8000FF | 128,0,255   | 270,100,100 |
| <p style="background-color: #127436">　　　</p> | VIRIDIAN                   | 铬绿          | #127436 | 18,116,54   | 142,84,45   |
| <p style="background-color: #5686BF">　　　</p> | WEDGWOOD_BLUE              | 韦奇伍德瓷蓝      | #5686BF | 86,134,191  | 213,55,75   |
| <p style="background-color: #F5DEB3">　　　</p> | WHEAT                      | 小麦          | #F5DEB3 | 245,222,179 | 39,27,96    |
| <p style="background-color: #FFFFFF">　　　</p> | WHITE                      | 白           | #FFFFFF | 255,255,255 | 0,0,100     |
| <p style="background-color: #F5F5F5">　　　</p> | WHITE_SMOKE                | 白烟          | #F5F5F5 | 245,245,245 | 0,0,96      |
| <p style="background-color: #C9A0DC">　　　</p> | WISTERIA                   | 紫藤          | #C9A0DC | 201,160,220 | 281,27,86   |
| <p style="background-color: #FFFF00">　　　</p> | YELLOW                     | 黄           | #FFFF00 | 255,255,0   | 60,100,100  |
| <p style="background-color: #9ACD32">　　　</p> | YELLOW_GREEN               | 黄绿          | #9ACD32 | 154,205,50  | 80,76,80    |

## Material 颜色列表

Material Color (材料颜色) 是 Material Design (材料设计) 中的色彩方案.

Material Design 是谷歌开发的一种视觉语言和设计系统, 拥有近乎扁平化的风格和充满活力的色彩方案.

下述颜色列表列出了所有 Material Color, 带有下划线和数字的变量名表示颜色色号, 每个颜色将 500 色号作为默认代表颜色, 即 `colors.material.RED` 与 `colors.material.RED_500` 等价 (黑白两种颜色除外), 带有 `A` 的变量, 如 `RED_A400` 代表强调色, 对应英文 `Accent`.

使用方式:

```js
colors.material.ORANGE;
```

> 参阅: [materialui.co](https://materialui.co/colors/)

|                      颜色                      | 变量名                           | 颜色译名      | Hex 代码  | RGB         | HSV         |
|:--------------------------------------------:|-------------------------------|-----------|---------|-------------|-------------|
| <p style="background-color: #FFEBEE">　　　</p> | RED_50                        | 红 (50)    | #FFEBEE | 255,235,238 | 351,8,100   |           
| <p style="background-color: #FFCDD2">　　　</p> | RED_100                       | 红 (100)   | #FFCDD2 | 255,205,210 | 354,20,100  |
| <p style="background-color: #EF9A9A">　　　</p> | RED_200                       | 红 (200)   | #EF9A9A | 239,154,154 | 0,36,94     |
| <p style="background-color: #E57373">　　　</p> | RED_300                       | 红 (300)   | #E57373 | 229,115,115 | 0,50,90     |
| <p style="background-color: #EF5350">　　　</p> | RED_400                       | 红 (400)   | #EF5350 | 239,83,80   | 1,67,94     |
| <p style="background-color: #F44336">　　　</p> | RED_500 / RED                 | 红 (500)   | #F44336 | 244,67,54   | 4,78,96     |
| <p style="background-color: #E53935">　　　</p> | RED_600                       | 红 (600)   | #E53935 | 229,57,53   | 1,77,90     |
| <p style="background-color: #D32F2F">　　　</p> | RED_700                       | 红 (700)   | #D32F2F | 211,47,47   | 0,78,83     |
| <p style="background-color: #C62828">　　　</p> | RED_800                       | 红 (800)   | #C62828 | 198,40,40   | 0,80,78     |
| <p style="background-color: #B71C1C">　　　</p> | RED_900                       | 红 (900)   | #B71C1C | 183,28,28   | 0,85,72     |
| <p style="background-color: #FF8A80">　　　</p> | RED_A100                      | 红 (A100)  | #FF8A80 | 255,138,128 | 5,50,100    |
| <p style="background-color: #FF5252">　　　</p> | RED_A200                      | 红 (A200)  | #FF5252 | 255,82,82   | 0,68,100    |
| <p style="background-color: #FF1744">　　　</p> | RED_A400                      | 红 (A400)  | #FF1744 | 255,23,68   | 348,91,100  |
| <p style="background-color: #D50000">　　　</p> | RED_A700                      | 红 (A700)  | #D50000 | 213,0,0     | 0,100,84    |
| <p style="background-color: #FCE4EC">　　　</p> | PINK_50                       | 粉红 (50)   | #FCE4EC | 252,228,236 | 340,10,99   |
| <p style="background-color: #F8BBD0">　　　</p> | PINK_100                      | 粉红 (100)  | #F8BBD0 | 248,187,208 | 339,25,97   |
| <p style="background-color: #F48FB1">　　　</p> | PINK_200                      | 粉红 (200)  | #F48FB1 | 244,143,177 | 340,41,96   |
| <p style="background-color: #F06292">　　　</p> | PINK_300                      | 粉红 (300)  | #F06292 | 240,98,146  | 340,59,94   |
| <p style="background-color: #EC407A">　　　</p> | PINK_400                      | 粉红 (400)  | #EC407A | 236,64,122  | 340,73,93   |
| <p style="background-color: #E91E63">　　　</p> | PINK_500 / PINK               | 粉红 (500)  | #E91E63 | 233,30,99   | 340,87,91   |
| <p style="background-color: #D81B60">　　　</p> | PINK_600                      | 粉红 (600)  | #D81B60 | 216,27,96   | 338,88,85   |
| <p style="background-color: #C2185B">　　　</p> | PINK_700                      | 粉红 (700)  | #C2185B | 194,24,91   | 336,88,76   |
| <p style="background-color: #AD1457">　　　</p> | PINK_800                      | 粉红 (800)  | #AD1457 | 173,20,87   | 334,88,68   |
| <p style="background-color: #880E4F">　　　</p> | PINK_900                      | 粉红 (900)  | #880E4F | 136,14,79   | 328,90,53   |
| <p style="background-color: #FF80AB">　　　</p> | PINK_A100                     | 粉红 (A100) | #FF80AB | 255,128,171 | 340,50,100  |
| <p style="background-color: #FF4081">　　　</p> | PINK_A200                     | 粉红 (A200) | #FF4081 | 255,64,129  | 340,75,100  |
| <p style="background-color: #F50057">　　　</p> | PINK_A400                     | 粉红 (A400) | #F50057 | 245,0,87    | 339,100,96  |
| <p style="background-color: #C51162">　　　</p> | PINK_A700                     | 粉红 (A700) | #C51162 | 197,17,98   | 333,91,77   |
| <p style="background-color: #F3E5F5">　　　</p> | PURPLE_50                     | 紫 (50)    | #F3E5F5 | 243,229,245 | 293,7,96    |
| <p style="background-color: #E1BEE7">　　　</p> | PURPLE_100                    | 紫 (100)   | #E1BEE7 | 225,190,231 | 291,18,91   |
| <p style="background-color: #CE93D8">　　　</p> | PURPLE_200                    | 紫 (200)   | #CE93D8 | 206,147,216 | 291,32,85   |
| <p style="background-color: #BA68C8">　　　</p> | PURPLE_300                    | 紫 (300)   | #BA68C8 | 186,104,200 | 291,48,78   |
| <p style="background-color: #AB47BC">　　　</p> | PURPLE_400                    | 紫 (400)   | #AB47BC | 171,71,188  | 291,62,74   |
| <p style="background-color: #9C27B0">　　　</p> | PURPLE_500 / PURPLE           | 紫 (500)   | #9C27B0 | 156,39,176  | 291,78,69   |
| <p style="background-color: #8E24AA">　　　</p> | PURPLE_600                    | 紫 (600)   | #8E24AA | 142,36,170  | 287,79,67   |
| <p style="background-color: #7B1FA2">　　　</p> | PURPLE_700                    | 紫 (700)   | #7B1FA2 | 123,31,162  | 282,81,64   |
| <p style="background-color: #6A1B9A">　　　</p> | PURPLE_800                    | 紫 (800)   | #6A1B9A | 106,27,154  | 277,82,60   |
| <p style="background-color: #4A148C">　　　</p> | PURPLE_900                    | 紫 (900)   | #4A148C | 74,20,140   | 267,86,55   |
| <p style="background-color: #EA80FC">　　　</p> | PURPLE_A100                   | 紫 (A100)  | #EA80FC | 234,128,252 | 291,49,99   |
| <p style="background-color: #E040FB">　　　</p> | PURPLE_A200                   | 紫 (A200)  | #E040FB | 224,64,251  | 291,75,98   |
| <p style="background-color: #D500F9">　　　</p> | PURPLE_A400                   | 紫 (A400)  | #D500F9 | 213,0,249   | 291,100,98  |
| <p style="background-color: #AA00FF">　　　</p> | PURPLE_A700                   | 紫 (A700)  | #AA00FF | 170,0,255   | 280,100,100 |
| <p style="background-color: #EDE7F6">　　　</p> | DEEP_PURPLE_50                | 深紫 (50)   | #EDE7F6 | 237,231,246 | 264,6,96    |
| <p style="background-color: #D1C4E9">　　　</p> | DEEP_PURPLE_100               | 深紫 (100)  | #D1C4E9 | 209,196,233 | 261,16,91   |
| <p style="background-color: #B39DDB">　　　</p> | DEEP_PURPLE_200               | 深紫 (200)  | #B39DDB | 179,157,219 | 261,28,86   |
| <p style="background-color: #9575CD">　　　</p> | DEEP_PURPLE_300               | 深紫 (300)  | #9575CD | 149,117,205 | 262,43,80   |
| <p style="background-color: #7E57C2">　　　</p> | DEEP_PURPLE_400               | 深紫 (400)  | #7E57C2 | 126,87,194  | 262,55,76   |
| <p style="background-color: #673AB7">　　　</p> | DEEP_PURPLE_500 / DEEP_PURPLE | 深紫 (500)  | #673AB7 | 103,58,183  | 262,68,72   |
| <p style="background-color: #5E35B1">　　　</p> | DEEP_PURPLE_600               | 深紫 (600)  | #5E35B1 | 94,53,177   | 260,70,69   |
| <p style="background-color: #512DA8">　　　</p> | DEEP_PURPLE_700               | 深紫 (700)  | #512DA8 | 81,45,168   | 258,73,66   |
| <p style="background-color: #4527A0">　　　</p> | DEEP_PURPLE_800               | 深紫 (800)  | #4527A0 | 69,39,160   | 255,76,63   |
| <p style="background-color: #311B92">　　　</p> | DEEP_PURPLE_900               | 深紫 (900)  | #311B92 | 49,27,146   | 251,82,57   |
| <p style="background-color: #B388FF">　　　</p> | DEEP_PURPLE_A100              | 深紫 (A100) | #B388FF | 179,136,255 | 262,47,100  |
| <p style="background-color: #7C4DFF">　　　</p> | DEEP_PURPLE_A200              | 深紫 (A200) | #7C4DFF | 124,77,255  | 256,70,100  |
| <p style="background-color: #651FFF">　　　</p> | DEEP_PURPLE_A400              | 深紫 (A400) | #651FFF | 101,31,255  | 259,88,100  |
| <p style="background-color: #6200EA">　　　</p> | DEEP_PURPLE_A700              | 深紫 (A700) | #6200EA | 98,0,234    | 265,100,92  |
| <p style="background-color: #E8EAF6">　　　</p> | INDIGO_50                     | 靛蓝 (50)   | #E8EAF6 | 232,234,246 | 231,6,96    |
| <p style="background-color: #C5CAE9">　　　</p> | INDIGO_100                    | 靛蓝 (100)  | #C5CAE9 | 197,202,233 | 232,15,91   |
| <p style="background-color: #9FA8DA">　　　</p> | INDIGO_200                    | 靛蓝 (200)  | #9FA8DA | 159,168,218 | 231,27,85   |
| <p style="background-color: #7986CB">　　　</p> | INDIGO_300                    | 靛蓝 (300)  | #7986CB | 121,134,203 | 230,40,80   |
| <p style="background-color: #5C6BC0">　　　</p> | INDIGO_400                    | 靛蓝 (400)  | #5C6BC0 | 92,107,192  | 231,52,75   |
| <p style="background-color: #3F51B5">　　　</p> | INDIGO_500 / INDIGO           | 靛蓝 (500)  | #3F51B5 | 63,81,181   | 231,65,71   |
| <p style="background-color: #3949AB">　　　</p> | INDIGO_600                    | 靛蓝 (600)  | #3949AB | 57,73,171   | 232,67,67   |
| <p style="background-color: #303F9F">　　　</p> | INDIGO_700                    | 靛蓝 (700)  | #303F9F | 48,63,159   | 232,70,62   |
| <p style="background-color: #283593">　　　</p> | INDIGO_800                    | 靛蓝 (800)  | #283593 | 40,53,147   | 233,73,58   |
| <p style="background-color: #1A237E">　　　</p> | INDIGO_900                    | 靛蓝 (900)  | #1A237E | 26,35,126   | 235,79,49   |
| <p style="background-color: #8C9EFF">　　　</p> | INDIGO_A100                   | 靛蓝 (A100) | #8C9EFF | 140,158,255 | 231,45,100  |
| <p style="background-color: #536DFE">　　　</p> | INDIGO_A200                   | 靛蓝 (A200) | #536DFE | 83,109,254  | 231,67,100  |
| <p style="background-color: #3D5AFE">　　　</p> | INDIGO_A400                   | 靛蓝 (A400) | #3D5AFE | 61,90,254   | 231,76,100  |
| <p style="background-color: #304FFE">　　　</p> | INDIGO_A700                   | 靛蓝 (A700) | #304FFE | 48,79,254   | 231,81,100  |
| <p style="background-color: #E3F2FD">　　　</p> | BLUE_50                       | 蓝 (50)    | #E3F2FD | 227,242,253 | 205,10,99   |
| <p style="background-color: #BBDEFB">　　　</p> | BLUE_100                      | 蓝 (100)   | #BBDEFB | 187,222,251 | 207,25,98   |
| <p style="background-color: #90CAF9">　　　</p> | BLUE_200                      | 蓝 (200)   | #90CAF9 | 144,202,249 | 207,42,98   |
| <p style="background-color: #64B5F6">　　　</p> | BLUE_300                      | 蓝 (300)   | #64B5F6 | 100,181,246 | 207,59,96   |
| <p style="background-color: #42A5F5">　　　</p> | BLUE_400                      | 蓝 (400)   | #42A5F5 | 66,165,245  | 207,73,96   |
| <p style="background-color: #2196F3">　　　</p> | BLUE_500 / BLUE               | 蓝 (500)   | #2196F3 | 33,150,243  | 207,86,95   |
| <p style="background-color: #1E88E5">　　　</p> | BLUE_600                      | 蓝 (600)   | #1E88E5 | 30,136,229  | 208,87,90   |
| <p style="background-color: #1976D2">　　　</p> | BLUE_700                      | 蓝 (700)   | #1976D2 | 25,118,210  | 210,88,82   |
| <p style="background-color: #1565C0">　　　</p> | BLUE_800                      | 蓝 (800)   | #1565C0 | 21,101,192  | 212,89,75   |
| <p style="background-color: #0D47A1">　　　</p> | BLUE_900                      | 蓝 (900)   | #0D47A1 | 13,71,161   | 216,92,63   |
| <p style="background-color: #82B1FF">　　　</p> | BLUE_A100                     | 蓝 (A100)  | #82B1FF | 130,177,255 | 217,49,100  |
| <p style="background-color: #448AFF">　　　</p> | BLUE_A200                     | 蓝 (A200)  | #448AFF | 68,138,255  | 218,73,100  |
| <p style="background-color: #2979FF">　　　</p> | BLUE_A400                     | 蓝 (A400)  | #2979FF | 41,121,255  | 218,84,100  |
| <p style="background-color: #2962FF">　　　</p> | BLUE_A700                     | 蓝 (A700)  | #2962FF | 41,98,255   | 224,84,100  |
| <p style="background-color: #E1F5FE">　　　</p> | LIGHT_BLUE_50                 | 浅蓝 (50)   | #E1F5FE | 225,245,254 | 199,11,100  |
| <p style="background-color: #B3E5FC">　　　</p> | LIGHT_BLUE_100                | 浅蓝 (100)  | #B3E5FC | 179,229,252 | 199,29,99   |
| <p style="background-color: #81D4FA">　　　</p> | LIGHT_BLUE_200                | 浅蓝 (200)  | #81D4FA | 129,212,250 | 199,48,98   |
| <p style="background-color: #4FC3F7">　　　</p> | LIGHT_BLUE_300                | 浅蓝 (300)  | #4FC3F7 | 79,195,247  | 199,68,97   |
| <p style="background-color: #29B6FC">　　　</p> | LIGHT_BLUE_400                | 浅蓝 (400)  | #29B6FC | 41,182,252  | 200,84,99   |
| <p style="background-color: #03A9F4">　　　</p> | LIGHT_BLUE_500 / LIGHT_BLUE   | 浅蓝 (500)  | #03A9F4 | 3,169,244   | 199,99,96   |
| <p style="background-color: #039BE5">　　　</p> | LIGHT_BLUE_600                | 浅蓝 (600)  | #039BE5 | 3,155,229   | 200,99,90   |
| <p style="background-color: #0288D1">　　　</p> | LIGHT_BLUE_700                | 浅蓝 (700)  | #0288D1 | 2,136,209   | 201,99,82   |
| <p style="background-color: #0277BD">　　　</p> | LIGHT_BLUE_800                | 浅蓝 (800)  | #0277BD | 2,119,189   | 202,99,74   |
| <p style="background-color: #01579B">　　　</p> | LIGHT_BLUE_900                | 浅蓝 (900)  | #01579B | 1,87,155    | 206,99,61   |
| <p style="background-color: #80D8FF">　　　</p> | LIGHT_BLUE_A100               | 浅蓝 (A100) | #80D8FF | 128,216,255 | 198,50,100  |
| <p style="background-color: #40C4FF">　　　</p> | LIGHT_BLUE_A200               | 浅蓝 (A200) | #40C4FF | 64,196,255  | 199,75,100  |
| <p style="background-color: #00B0FF">　　　</p> | LIGHT_BLUE_A400               | 浅蓝 (A400) | #00B0FF | 0,176,255   | 199,100,100 |
| <p style="background-color: #0091EA">　　　</p> | LIGHT_BLUE_A700               | 浅蓝 (A700) | #0091EA | 0,145,234   | 203,100,92  |
| <p style="background-color: #E0F7FA">　　　</p> | CYAN_50                       | 青 (50)    | #E0F7FA | 224,247,250 | 187,10,98   |
| <p style="background-color: #B2EBF2">　　　</p> | CYAN_100                      | 青 (100)   | #B2EBF2 | 178,235,242 | 187,26,95   |
| <p style="background-color: #80DEEA">　　　</p> | CYAN_200                      | 青 (200)   | #80DEEA | 128,222,234 | 187,45,92   |
| <p style="background-color: #4DD0E1">　　　</p> | CYAN_300                      | 青 (300)   | #4DD0E1 | 77,208,225  | 187,66,88   |
| <p style="background-color: #26C6DA">　　　</p> | CYAN_400                      | 青 (400)   | #26C6DA | 38,198,218  | 187,83,85   |
| <p style="background-color: #00BCD4">　　　</p> | CYAN_500 / CYAN               | 青 (500)   | #00BCD4 | 0,188,212   | 187,100,83  |
| <p style="background-color: #00ACC1">　　　</p> | CYAN_600                      | 青 (600)   | #00ACC1 | 0,172,193   | 187,100,76  |
| <p style="background-color: #0097A7">　　　</p> | CYAN_700                      | 青 (700)   | #0097A7 | 0,151,167   | 186,100,65  |
| <p style="background-color: #00838F">　　　</p> | CYAN_800                      | 青 (800)   | #00838F | 0,131,143   | 185,100,56  |
| <p style="background-color: #006064">　　　</p> | CYAN_900                      | 青 (900)   | #006064 | 0,96,100    | 182,100,39  |
| <p style="background-color: #84FFFF">　　　</p> | CYAN_A100                     | 青 (A100)  | #84FFFF | 132,255,255 | 180,48,100  |
| <p style="background-color: #18FFFF">　　　</p> | CYAN_A200                     | 青 (A200)  | #18FFFF | 24,255,255  | 180,91,100  |
| <p style="background-color: #00E5FF">　　　</p> | CYAN_A400                     | 青 (A400)  | #00E5FF | 0,229,255   | 186,100,100 |
| <p style="background-color: #00B8D4">　　　</p> | CYAN_A700                     | 青 (A700)  | #00B8D4 | 0,184,212   | 188,100,83  |
| <p style="background-color: #E0F2F1">　　　</p> | TEAL_50                       | 蓝绿 (50)   | #E0F2F1 | 224,242,241 | 177,7,95    |
| <p style="background-color: #B2DFDB">　　　</p> | TEAL_100                      | 蓝绿 (100)  | #B2DFDB | 178,223,219 | 175,20,87   |
| <p style="background-color: #80CBC4">　　　</p> | TEAL_200                      | 蓝绿 (200)  | #80CBC4 | 128,203,196 | 174,37,80   |
| <p style="background-color: #4DB6AC">　　　</p> | TEAL_300                      | 蓝绿 (300)  | #4DB6AC | 77,182,172  | 174,58,71   |
| <p style="background-color: #26A69A">　　　</p> | TEAL_400                      | 蓝绿 (400)  | #26A69A | 38,166,154  | 174,77,65   |
| <p style="background-color: #009688">　　　</p> | TEAL_500 / TEAL               | 蓝绿 (500)  | #009688 | 0,150,136   | 174,100,59  |
| <p style="background-color: #00897B">　　　</p> | TEAL_600                      | 蓝绿 (600)  | #00897B | 0,137,123   | 174,100,54  |
| <p style="background-color: #00796B">　　　</p> | TEAL_700                      | 蓝绿 (700)  | #00796B | 0,121,107   | 173,100,47  |
| <p style="background-color: #00695C">　　　</p> | TEAL_800                      | 蓝绿 (800)  | #00695C | 0,105,92    | 173,100,41  |
| <p style="background-color: #004D40">　　　</p> | TEAL_900                      | 蓝绿 (900)  | #004D40 | 0,77,64     | 170,100,30  |
| <p style="background-color: #A7FFEB">　　　</p> | TEAL_A100                     | 蓝绿 (A100) | #A7FFEB | 167,255,235 | 166,35,100  |
| <p style="background-color: #64FFDA">　　　</p> | TEAL_A200                     | 蓝绿 (A200) | #64FFDA | 100,255,218 | 166,61,100  |
| <p style="background-color: #1DE9B6">　　　</p> | TEAL_A400                     | 蓝绿 (A400) | #1DE9B6 | 29,233,182  | 165,88,91   |
| <p style="background-color: #00BFA5">　　　</p> | TEAL_A700                     | 蓝绿 (A700) | #00BFA5 | 0,191,165   | 172,100,75  |
| <p style="background-color: #E8F5E9">　　　</p> | GREEN_50                      | 绿 (50)    | #E8F5E9 | 232,245,233 | 125,5,96    |
| <p style="background-color: #C8E6C9">　　　</p> | GREEN_100                     | 绿 (100)   | #C8E6C9 | 200,230,201 | 122,13,90   |
| <p style="background-color: #A5D6A7">　　　</p> | GREEN_200                     | 绿 (200)   | #A5D6A7 | 165,214,167 | 122,23,84   |
| <p style="background-color: #81C784">　　　</p> | GREEN_300                     | 绿 (300)   | #81C784 | 129,199,132 | 123,35,78   |
| <p style="background-color: #66BB6A">　　　</p> | GREEN_400                     | 绿 (400)   | #66BB6A | 102,187,106 | 123,45,73   |
| <p style="background-color: #4CAF50">　　　</p> | GREEN_500 / GREEN             | 绿 (500)   | #4CAF50 | 76,175,80   | 122,57,69   |
| <p style="background-color: #43A047">　　　</p> | GREEN_600                     | 绿 (600)   | #43A047 | 67,160,71   | 123,58,63   |
| <p style="background-color: #388E3C">　　　</p> | GREEN_700                     | 绿 (700)   | #388E3C | 56,142,60   | 123,61,56   |
| <p style="background-color: #2E7D32">　　　</p> | GREEN_800                     | 绿 (800)   | #2E7D32 | 46,125,50   | 123,63,49   |
| <p style="background-color: #1B5E20">　　　</p> | GREEN_900                     | 绿 (900)   | #1B5E20 | 27,94,32    | 124,71,37   |
| <p style="background-color: #B9F6CA">　　　</p> | GREEN_A100                    | 绿 (A100)  | #B9F6CA | 185,246,202 | 137,25,96   |
| <p style="background-color: #69F0AE">　　　</p> | GREEN_A200                    | 绿 (A200)  | #69F0AE | 105,240,174 | 151,56,94   |
| <p style="background-color: #00E676">　　　</p> | GREEN_A400                    | 绿 (A400)  | #00E676 | 0,230,118   | 151,100,90  |
| <p style="background-color: #00C853">　　　</p> | GREEN_A700                    | 绿 (A700)  | #00C853 | 0,200,83    | 145,100,78  |
| <p style="background-color: #F1F8E9">　　　</p> | LIGHT_GREEN_50                | 浅绿 (50)   | #F1F8E9 | 241,248,233 | 88,6,97     |
| <p style="background-color: #DCEDC8">　　　</p> | LIGHT_GREEN_100               | 浅绿 (100)  | #DCEDC8 | 220,237,200 | 88,16,93    |
| <p style="background-color: #C5E1A5">　　　</p> | LIGHT_GREEN_200               | 浅绿 (200)  | #C5E1A5 | 197,225,165 | 88,27,88    |
| <p style="background-color: #AED581">　　　</p> | LIGHT_GREEN_300               | 浅绿 (300)  | #AED581 | 174,213,129 | 88,39,84    |
| <p style="background-color: #9CCC65">　　　</p> | LIGHT_GREEN_400               | 浅绿 (400)  | #9CCC65 | 156,204,101 | 88,50,80    |
| <p style="background-color: #8BC34A">　　　</p> | LIGHT_GREEN_500 / LIGHT_GREEN | 浅绿 (500)  | #8BC34A | 139,195,74  | 88,62,76    |
| <p style="background-color: #7CB342">　　　</p> | LIGHT_GREEN_600               | 浅绿 (600)  | #7CB342 | 124,179,66  | 89,63,70    |
| <p style="background-color: #689F38">　　　</p> | LIGHT_GREEN_700               | 浅绿 (700)  | #689F38 | 104,159,56  | 92,65,62    |
| <p style="background-color: #558B2F">　　　</p> | LIGHT_GREEN_800               | 浅绿 (800)  | #558B2F | 85,139,47   | 95,66,55    |
| <p style="background-color: #33691E">　　　</p> | LIGHT_GREEN_900               | 浅绿 (900)  | #33691E | 51,105,30   | 103,71,41   |
| <p style="background-color: #CCFF90">　　　</p> | LIGHT_GREEN_A100              | 浅绿 (A100) | #CCFF90 | 204,255,144 | 88,44,100   |
| <p style="background-color: #B2FF59">　　　</p> | LIGHT_GREEN_A200              | 浅绿 (A200) | #B2FF59 | 178,255,89  | 88,65,100   |
| <p style="background-color: #76FF03">　　　</p> | LIGHT_GREEN_A400              | 浅绿 (A400) | #76FF03 | 118,255,3   | 93,99,100   |
| <p style="background-color: #64DD17">　　　</p> | LIGHT_GREEN_A700              | 浅绿 (A700) | #64DD17 | 100,221,23  | 97,90,87    |
| <p style="background-color: #F9FBE7">　　　</p> | LIME_50                       | 绿黄 (50)   | #F9FBE7 | 249,251,231 | 66,8,98     |
| <p style="background-color: #F0F4C3">　　　</p> | LIME_100                      | 绿黄 (100)  | #F0F4C3 | 240,244,195 | 65,20,96    |
| <p style="background-color: #E6EE9C">　　　</p> | LIME_200                      | 绿黄 (200)  | #E6EE9C | 230,238,156 | 66,34,93    |
| <p style="background-color: #DCE775">　　　</p> | LIME_300                      | 绿黄 (300)  | #DCE775 | 220,231,117 | 66,49,91    |
| <p style="background-color: #D4E157">　　　</p> | LIME_400                      | 绿黄 (400)  | #D4E157 | 212,225,87  | 66,61,88    |
| <p style="background-color: #CDDC39">　　　</p> | LIME_500 / LIME               | 绿黄 (500)  | #CDDC39 | 205,220,57  | 66,74,86    |
| <p style="background-color: #C0CA33">　　　</p> | LIME_600                      | 绿黄 (600)  | #C0CA33 | 192,202,51  | 64,75,79    |
| <p style="background-color: #A4B42B">　　　</p> | LIME_700                      | 绿黄 (700)  | #A4B42B | 164,180,43  | 67,76,71    |
| <p style="background-color: #9E9D24">　　　</p> | LIME_800                      | 绿黄 (800)  | #9E9D24 | 158,157,36  | 60,77,62    |
| <p style="background-color: #827717">　　　</p> | LIME_900                      | 绿黄 (900)  | #827717 | 130,119,23  | 54,82,51    |
| <p style="background-color: #F4FF81">　　　</p> | LIME_A100                     | 绿黄 (A100) | #F4FF81 | 244,255,129 | 65,49,100   |
| <p style="background-color: #EEFF41">　　　</p> | LIME_A200                     | 绿黄 (A200) | #EEFF41 | 238,255,65  | 65,75,100   |
| <p style="background-color: #C6FF00">　　　</p> | LIME_A400                     | 绿黄 (A400) | #C6FF00 | 198,255,0   | 73,100,100  |
| <p style="background-color: #AEEA00">　　　</p> | LIME_A700                     | 绿黄 (A700) | #AEEA00 | 174,234,0   | 75,100,92   |
| <p style="background-color: #FFFDE7">　　　</p> | YELLOW_50                     | 黄 (50)    | #FFFDE7 | 255,253,231 | 55,9,100    |
| <p style="background-color: #FFF9C4">　　　</p> | YELLOW_100                    | 黄 (100)   | #FFF9C4 | 255,249,196 | 54,23,100   |
| <p style="background-color: #FFF590">　　　</p> | YELLOW_200                    | 黄 (200)   | #FFF590 | 255,245,144 | 55,44,100   |
| <p style="background-color: #FFF176">　　　</p> | YELLOW_300                    | 黄 (300)   | #FFF176 | 255,241,118 | 54,54,100   |
| <p style="background-color: #FFEE58">　　　</p> | YELLOW_400                    | 黄 (400)   | #FFEE58 | 255,238,88  | 54,65,100   |
| <p style="background-color: #FFEB3B">　　　</p> | YELLOW_500 / YELLOW           | 黄 (500)   | #FFEB3B | 255,235,59  | 54,77,100   |
| <p style="background-color: #FDD835">　　　</p> | YELLOW_600                    | 黄 (600)   | #FDD835 | 253,216,53  | 49,79,99    |
| <p style="background-color: #FBC02D">　　　</p> | YELLOW_700                    | 黄 (700)   | #FBC02D | 251,192,45  | 43,82,98    |
| <p style="background-color: #F9A825">　　　</p> | YELLOW_800                    | 黄 (800)   | #F9A825 | 249,168,37  | 37,85,98    |
| <p style="background-color: #F57F17">　　　</p> | YELLOW_900                    | 黄 (900)   | #F57F17 | 245,127,23  | 28,91,96    |
| <p style="background-color: #FFFF82">　　　</p> | YELLOW_A100                   | 黄 (A100)  | #FFFF82 | 255,255,130 | 60,49,100   |
| <p style="background-color: #FFFF00">　　　</p> | YELLOW_A200                   | 黄 (A200)  | #FFFF00 | 255,255,0   | 60,100,100  |
| <p style="background-color: #FFEA00">　　　</p> | YELLOW_A400                   | 黄 (A400)  | #FFEA00 | 255,234,0   | 55,100,100  |
| <p style="background-color: #FFD600">　　　</p> | YELLOW_A700                   | 黄 (A700)  | #FFD600 | 255,214,0   | 50,100,100  |
| <p style="background-color: #FFF8E1">　　　</p> | AMBER_50                      | 琥珀 (50)   | #FFF8E1 | 255,248,225 | 46,12,100   |
| <p style="background-color: #FFECB3">　　　</p> | AMBER_100                     | 琥珀 (100)  | #FFECB3 | 255,236,179 | 45,30,100   |
| <p style="background-color: #FFE082">　　　</p> | AMBER_200                     | 琥珀 (200)  | #FFE082 | 255,224,130 | 45,49,100   |
| <p style="background-color: #FFD54F">　　　</p> | AMBER_300                     | 琥珀 (300)  | #FFD54F | 255,213,79  | 46,69,100   |
| <p style="background-color: #FFCA28">　　　</p> | AMBER_400                     | 琥珀 (400)  | #FFCA28 | 255,202,40  | 45,84,100   |
| <p style="background-color: #FFC107">　　　</p> | AMBER_500 / AMBER             | 琥珀 (500)  | #FFC107 | 255,193,7   | 45,97,100   |
| <p style="background-color: #FFB300">　　　</p> | AMBER_600                     | 琥珀 (600)  | #FFB300 | 255,179,0   | 42,100,100  |
| <p style="background-color: #FFA000">　　　</p> | AMBER_700                     | 琥珀 (700)  | #FFA000 | 255,160,0   | 38,100,100  |
| <p style="background-color: #FF8F00">　　　</p> | AMBER_800                     | 琥珀 (800)  | #FF8F00 | 255,143,0   | 34,100,100  |
| <p style="background-color: #FF6F00">　　　</p> | AMBER_900                     | 琥珀 (900)  | #FF6F00 | 255,111,0   | 26,100,100  |
| <p style="background-color: #FFE57F">　　　</p> | AMBER_A100                    | 琥珀 (A100) | #FFE57F | 255,229,127 | 48,50,100   |
| <p style="background-color: #FFD740">　　　</p> | AMBER_A200                    | 琥珀 (A200) | #FFD740 | 255,215,64  | 47,75,100   |
| <p style="background-color: #FFC400">　　　</p> | AMBER_A400                    | 琥珀 (A400) | #FFC400 | 255,196,0   | 46,100,100  |
| <p style="background-color: #FFAB00">　　　</p> | AMBER_A700                    | 琥珀 (A700) | #FFAB00 | 255,171,0   | 40,100,100  |
| <p style="background-color: #FFF3E0">　　　</p> | ORANGE_50                     | 橙 (50)    | #FFF3E0 | 255,243,224 | 37,12,100   |
| <p style="background-color: #FFE0B2">　　　</p> | ORANGE_100                    | 橙 (100)   | #FFE0B2 | 255,224,178 | 36,30,100   |
| <p style="background-color: #FFCC80">　　　</p> | ORANGE_200                    | 橙 (200)   | #FFCC80 | 255,204,128 | 36,50,100   |
| <p style="background-color: #FFB74D">　　　</p> | ORANGE_300                    | 橙 (300)   | #FFB74D | 255,183,77  | 36,70,100   |
| <p style="background-color: #FFA726">　　　</p> | ORANGE_400                    | 橙 (400)   | #FFA726 | 255,167,38  | 36,85,100   |
| <p style="background-color: #FF9800">　　　</p> | ORANGE_500 / ORANGE           | 橙 (500)   | #FF9800 | 255,152,0   | 36,100,100  |
| <p style="background-color: #FB8C00">　　　</p> | ORANGE_600                    | 橙 (600)   | #FB8C00 | 251,140,0   | 33,100,98   |
| <p style="background-color: #F57C00">　　　</p> | ORANGE_700                    | 橙 (700)   | #F57C00 | 245,124,0   | 30,100,96   |
| <p style="background-color: #EF6C00">　　　</p> | ORANGE_800                    | 橙 (800)   | #EF6C00 | 239,108,0   | 27,100,94   |
| <p style="background-color: #E65100">　　　</p> | ORANGE_900                    | 橙 (900)   | #E65100 | 230,81,0    | 21,100,90   |
| <p style="background-color: #FFD180">　　　</p> | ORANGE_A100                   | 橙 (A100)  | #FFD180 | 255,209,128 | 38,50,100   |
| <p style="background-color: #FFAB40">　　　</p> | ORANGE_A200                   | 橙 (A200)  | #FFAB40 | 255,171,64  | 34,75,100   |
| <p style="background-color: #FF9100">　　　</p> | ORANGE_A400                   | 橙 (A400)  | #FF9100 | 255,145,0   | 34,100,100  |
| <p style="background-color: #FF6D00">　　　</p> | ORANGE_A700                   | 橙 (A700)  | #FF6D00 | 255,109,0   | 26,100,100  |
| <p style="background-color: #FBE9A7">　　　</p> | DEEP_ORANGE_50                | 深橙 (50)   | #FBE9A7 | 251,233,167 | 47,33,98    |
| <p style="background-color: #FFCCBC">　　　</p> | DEEP_ORANGE_100               | 深橙 (100)  | #FFCCBC | 255,204,188 | 14,26,100   |
| <p style="background-color: #FFAB91">　　　</p> | DEEP_ORANGE_200               | 深橙 (200)  | #FFAB91 | 255,171,145 | 14,43,100   |
| <p style="background-color: #FF8A65">　　　</p> | DEEP_ORANGE_300               | 深橙 (300)  | #FF8A65 | 255,138,101 | 14,60,100   |
| <p style="background-color: #FF7043">　　　</p> | DEEP_ORANGE_400               | 深橙 (400)  | #FF7043 | 255,112,67  | 14,74,100   |
| <p style="background-color: #FF5722">　　　</p> | DEEP_ORANGE_500 / DEEP_ORANGE | 深橙 (500)  | #FF5722 | 255,87,34   | 14,87,100   |
| <p style="background-color: #F4511E">　　　</p> | DEEP_ORANGE_600               | 深橙 (600)  | #F4511E | 244,81,30   | 14,88,96    |
| <p style="background-color: #E64A19">　　　</p> | DEEP_ORANGE_700               | 深橙 (700)  | #E64A19 | 230,74,25   | 14,89,90    |
| <p style="background-color: #D84315">　　　</p> | DEEP_ORANGE_800               | 深橙 (800)  | #D84315 | 216,67,21   | 14,90,85    |
| <p style="background-color: #BF360C">　　　</p> | DEEP_ORANGE_900               | 深橙 (900)  | #BF360C | 191,54,12   | 14,94,75    |
| <p style="background-color: #FF9E80">　　　</p> | DEEP_ORANGE_A100              | 深橙 (A100) | #FF9E80 | 255,158,128 | 14,50,100   |
| <p style="background-color: #FF6E40">　　　</p> | DEEP_ORANGE_A200              | 深橙 (A200) | #FF6E40 | 255,110,64  | 14,75,100   |
| <p style="background-color: #FF3D00">　　　</p> | DEEP_ORANGE_A400              | 深橙 (A400) | #FF3D00 | 255,61,0    | 14,100,100  |
| <p style="background-color: #DD2600">　　　</p> | DEEP_ORANGE_A700              | 深橙 (A700) | #DD2600 | 221,38,0    | 10,100,87   |
| <p style="background-color: #EFEBE9">　　　</p> | BROWN_50                      | 棕 (50)    | #EFEBE9 | 239,235,233 | 20,3,94     |
| <p style="background-color: #D7CCC8">　　　</p> | BROWN_100                     | 棕 (100)   | #D7CCC8 | 215,204,200 | 16,7,84     |
| <p style="background-color: #BCAAA4">　　　</p> | BROWN_200                     | 棕 (200)   | #BCAAA4 | 188,170,164 | 15,13,74    |
| <p style="background-color: #A1887F">　　　</p> | BROWN_300                     | 棕 (300)   | #A1887F | 161,136,127 | 16,21,63    |
| <p style="background-color: #8D6E63">　　　</p> | BROWN_400                     | 棕 (400)   | #8D6E63 | 141,110,99  | 16,30,55    |
| <p style="background-color: #795548">　　　</p> | BROWN_500 / BROWN             | 棕 (500)   | #795548 | 121,85,72   | 16,40,47    |
| <p style="background-color: #6D4C41">　　　</p> | BROWN_600                     | 棕 (600)   | #6D4C41 | 109,76,65   | 15,40,43    |
| <p style="background-color: #5D4037">　　　</p> | BROWN_700                     | 棕 (700)   | #5D4037 | 93,64,55    | 14,41,36    |
| <p style="background-color: #4E342E">　　　</p> | BROWN_800                     | 棕 (800)   | #4E342E | 78,52,46    | 11,41,31    |
| <p style="background-color: #3E2723">　　　</p> | BROWN_900                     | 棕 (900)   | #3E2723 | 62,39,35    | 9,44,24     |
| <p style="background-color: #FAFAFA">　　　</p> | GREY_50                       | 灰 (50)    | #FAFAFA | 250,250,250 | 0,0,98      |
| <p style="background-color: #F5F5F5">　　　</p> | GREY_100                      | 灰 (100)   | #F5F5F5 | 245,245,245 | 0,0,96      |
| <p style="background-color: #EEEEEE">　　　</p> | GREY_200                      | 灰 (200)   | #EEEEEE | 238,238,238 | 0,0,93      |
| <p style="background-color: #E0E0E0">　　　</p> | GREY_300                      | 灰 (300)   | #E0E0E0 | 224,224,224 | 0,0,88      |
| <p style="background-color: #BDBDBD">　　　</p> | GREY_400                      | 灰 (400)   | #BDBDBD | 189,189,189 | 0,0,74      |
| <p style="background-color: #9E9E9E">　　　</p> | GREY_500 / GREY               | 灰 (500)   | #9E9E9E | 158,158,158 | 0,0,62      |
| <p style="background-color: #757575">　　　</p> | GREY_600                      | 灰 (600)   | #757575 | 117,117,117 | 0,0,46      |
| <p style="background-color: #616161">　　　</p> | GREY_700                      | 灰 (700)   | #616161 | 97,97,97    | 0,0,38      |
| <p style="background-color: #424242">　　　</p> | GREY_800                      | 灰 (800)   | #424242 | 66,66,66    | 0,0,26      |
| <p style="background-color: #212121">　　　</p> | GREY_900                      | 灰 (900)   | #212121 | 33,33,33    | 0,0,13      |
| <p style="background-color: #000000">　　　</p> | BLACK_1000 / BLACK            | 黑         | #000000 | 0,0,0       | 0,0,0       |
| <p style="background-color: #FFFFFF">　　　</p> | WHITE_1000 / WHITE            | 白         | #FFFFFF | 255,255,255 | 0,0,100     |
| <p style="background-color: #ECEFF1">　　　</p> | BLUE_GREY_50                  | 蓝灰 (50)   | #ECEFF1 | 236,239,241 | 204,2,95    |
| <p style="background-color: #CFD8DC">　　　</p> | BLUE_GREY_100                 | 蓝灰 (100)  | #CFD8DC | 207,216,220 | 198,6,86    |
| <p style="background-color: #B0BBC5">　　　</p> | BLUE_GREY_200                 | 蓝灰 (200)  | #B0BBC5 | 176,187,197 | 209,11,77   |
| <p style="background-color: #90A4AE">　　　</p> | BLUE_GREY_300                 | 蓝灰 (300)  | #90A4AE | 144,164,174 | 200,17,68   |
| <p style="background-color: #78909C">　　　</p> | BLUE_GREY_400                 | 蓝灰 (400)  | #78909C | 120,144,156 | 200,23,61   |
| <p style="background-color: #607D8B">　　　</p> | BLUE_GREY_500 / BLUE_GREY     | 蓝灰 (500)  | #607D8B | 96,125,139  | 200,31,55   |
| <p style="background-color: #546E7A">　　　</p> | BLUE_GREY_600                 | 蓝灰 (600)  | #546E7A | 84,110,122  | 199,31,48   |
| <p style="background-color: #455A64">　　　</p> | BLUE_GREY_700                 | 蓝灰 (700)  | #455A64 | 69,90,100   | 199,31,39   |
| <p style="background-color: #37474F">　　　</p> | BLUE_GREY_800                 | 蓝灰 (800)  | #37474F | 55,71,79    | 200,30,31   |
| <p style="background-color: #263238">　　　</p> | BLUE_GREY_900                 | 蓝灰 (900)  | #263238 | 38,50,56    | 200,32,22   |

## 支持简写的颜色列表

支持三位数简写的颜色 Hex 代码格式需满足 R / G / B 的每个分量符合叠字模式, 如 `#663399`, `#CCFF00`, `#888888` 等.

使用 [colors.toHex(color, 3)](color.md#tohexcolor-length) 可实现由 `#RRGGBB` 到 `#RGB` 的转换:

```js
colors.toHex(colors.GRAY, 3); // #888
colors.toHex(colors.css.REBECCA_PURPLE, 3); // #639
colors.toHex(colors.web.BURNT_ORANGE, 3); // #C50

/* PURPLE (紫色) 无法简化, 因为 #800080 的 R 和 B 分量都不是叠字模式. */
colors.toHex(colors.PURPLE, 3); /* 抛出异常. */
```

下表将上述几个颜色列表中支持上述转换的颜色汇总在一起:

| 命名空间     |                      颜色                      | 变量名                                 | 颜色译名       | Hex 代码  | RGB         | HSV         |
|----------|:--------------------------------------------:|-------------------------------------|------------|---------|-------------|-------------|
| android  | <p style="background-color: #000000">　　　</p> | BLACK                               | 黑          | #000000 | 0,0,0       | 0,0,0       |
| android  | <p style="background-color: #0000FF">　　　</p> | BLUE                                | 蓝          | #0000FF | 0,0,255     | 240,100,100 |
| android  | <p style="background-color: #00FFFF">　　　</p> | CYAN / AQUA                         | 青          | #00FFFF | 0,255,255   | 180,100,100 |
| android  | <p style="background-color: #444444">　　　</p> | DARK_GRAY / DARK_GREY / DKGRAY      | 暗灰         | #444444 | 68,68,68    | 0,0,27      |
| android  | <p style="background-color: #888888">　　　</p> | GRAY / GREY                         | 灰          | #888888 | 136,136,136 | 0,0,53      |
| android  | <p style="background-color: #00FF00">　　　</p> | GREEN / LIME                        | 绿          | #00FF00 | 0,255,0     | 120,100,100 |
| android  | <p style="background-color: #CCCCCC">　　　</p> | LIGHT_GRAY / LIGHT_GREY / LTGRAY    | 亮灰         | #CCCCCC | 204,204,204 | 0,0,80      |
| android  | <p style="background-color: #FF00FF">　　　</p> | MAGENTA / FUCHSIA                   | 品红 / 洋红    | #FF00FF | 255,0,255   | 300,100,100 |
| android  | <p style="background-color: #FF0000">　　　</p> | RED                                 | 红          | #FF0000 | 255,0,0     | 0,100,100   |
| android  | <p style="background-color: #FFFFFF">　　　</p> | WHITE                               | 白          | #FFFFFF | 255,255,255 | 0,0,100     |
| android  | <p style="background-color: #FFFF00">　　　</p> | YELLOW                              | 黄          | #FFFF00 | 255,255,0   | 60,100,100  |
| css      | <p style="background-color: #778899">　　　</p> | LIGHT_SLATE_GRAY / LIGHT_SLATE_GREY | 亮岩灰        | #778899 | 119,136,153 | 210,22,60   |
| css      | <p style="background-color: #663399">　　　</p> | REBECCA_PURPLE                      | 丽贝卡紫       | #663399 | 102,51,153  | 270,67,60   |
| web      | <p style="background-color: #9966CC">　　　</p> | AMETHYST                            | 紫水晶        | #9966CC | 153,102,204 | 270,50,80   |
| web      | <p style="background-color: #66FF00">　　　</p> | BRIGHT_GREEN                        | 黄绿 / 明绿    | #66FF00 | 102,255,0   | 96,100,100  |
| web      | <p style="background-color: #CC5500">　　　</p> | BURNT_ORANGE                        | 燃橙         | #CC5500 | 204,85,0    | 25,100,80   |
| web      | <p style="background-color: #FFFF99">　　　</p> | CHAMPAGNE_YELLOW                    | 香槟黄        | #FFFF99 | 255,255,153 | 60,40,100   |
| web      | <p style="background-color: #003399">　　　</p> | DARK_POWDER_BLUE                    | 暗粉蓝        | #003399 | 0,51,153    | 220,100,60  |
| web      | <p style="background-color: #CCCCFF">　　　</p> | LAVENDER_BLUE / PERIWINKLE          | 薰衣草蓝 / 长春花 | #CCCCFF | 204,204,255 | 240,20,100  |
| web      | <p style="background-color: #CCFF00">　　　</p> | LIME / LIGHT_LIME                   | 柠檬绿 / 亮柠檬绿 | #CCFF00 | 204,255,0   | 72,100,100  |
| web      | <p style="background-color: #FF9900">　　　</p> | MARIGOLD                            | 万寿菊黄       | #FF9900 | 255,153,0   | 36,100,100  |
| web      | <p style="background-color: #CC7722">　　　</p> | OCHER                               | 赭          | #CC7722 | 204,119,34  | 30,83,80    |
| web      | <p style="background-color: #FF66CC">　　　</p> | ROSE_PINK                           | 浅玫瑰红       | #FF66CC | 255,102,204 | 320,60,100  |
| web      | <p style="background-color: #FFCC00">　　　</p> | TANGERINE_YELLOW                    | 橙黄         | #FFCC00 | 255,204,0   | 48,100,100  |
| web      | <p style="background-color: #0033FF">　　　</p> | ULTRAMARINE                         | 极浓海蓝       | #0033FF | 0,51,255    | 228,100,100 |
| material | <p style="background-color: #AA00FF">　　　</p> | PURPLE_A700                         | 紫 (A700)   | #AA00FF | 170,0,255   | 280,100,100 |
| material | <p style="background-color: #EEEEEE">　　　</p> | GREY_200                            | 灰 (200)    | #EEEEEE | 238,238,238 | 0,0,93      |

## 颜色名称冲突

当使用 [颜色名称 (ColorName)](dataTypes#colorname) 作为参数时, 同一个名称可能同时出现在不同的颜色列表中, 如 `CYAN` 在所有列表中均有出现, 且 [Material 颜色列表](#material-颜色列表) 中的 `CYAN` 与其它列表中的 `CYAN` 颜色不同.

为避免上述冲突, 按如下命名空间优先级查找并使用颜色名称对应的颜色:

```text
android > css > web > material
```

因此颜色名称 `CYAN` 相当于 `colors.android.CYAN` (而非 `colors.web.CYAN`);  
颜色名称 `ORANGE` 相当于 `colors.css.ORANGE` (而非 `colors.material.ORANGE`).

下表列出了所有存在冲突的颜色, 其中 "决定性" `列 (Column)` 表明存在冲突时, 将最终采用对应 `行 (Row)` 表示的颜色:

| 决定性 | 命名空间     |                      颜色                      | 变量名          | 颜色译名       | Hex 代码  | RGB         | HSV         |
|:---:|----------|:--------------------------------------------:|--------------|------------|---------|-------------|-------------|
|  √  | android  | <p style="background-color: #0000FF">　　　</p> | BLUE         | 蓝          | #0000FF | 0,0,255     | 240,100,100 |
|     | material | <p style="background-color: #2196F3">　　　</p> |              | 蓝 (500)    | #2196F3 | 33,150,243  | 207,86,95   |
|  √  | android  | <p style="background-color: #00FFFF">　　　</p> | CYAN         | 青          | #00FFFF | 0,255,255   | 180,100,100 |
|     | css      | <p style="background-color: #00FFFF">　　　</p> |              | 青          | #00FFFF | 0,255,255   | 180,100,100 |
|     | web      | <p style="background-color: #00FFFF">　　　</p> |              | 青          | #00FFFF | 0,255,255   | 180,100,100 |
|     | material | <p style="background-color: #00BCD4">　　　</p> |              | 青 (500)    | #00BCD4 | 0,188,212   | 187,100,83  |
|  √  | android  | <p style="background-color: #00FFFF">　　　</p> | AQUA         | 青          | #00FFFF | 0,255,255   | 180,100,100 |
|     | css      | <p style="background-color: #00FFFF">　　　</p> |              | 青          | #00FFFF | 0,255,255   | 180,100,100 |
|     | web      | <p style="background-color: #AFDFE4">　　　</p> |              | 水          | #AFDFE4 | 175,223,228 | 186,23,89   |
|  √  | android  | <p style="background-color: #444444">　　　</p> | DARK_GRAY    | 暗灰         | #444444 | 68,68,68    | 0,0,27      |
|     | css      | <p style="background-color: #A9A9A9">　　　</p> |              | 暗灰         | #A9A9A9 | 169,169,169 | 0,0,66      |
|     | web      | <p style="background-color: #A9A9A9">　　　</p> |              | 暗灰         | #A9A9A9 | 169,169,169 | 0,0,66      |
|  √  | android  | <p style="background-color: #444444">　　　</p> | DARK_GREY    | 暗灰         | #444444 | 68,68,68    | 0,0,27      |
|     | css      | <p style="background-color: #A9A9A9">　　　</p> |              | 暗灰         | #A9A9A9 | 169,169,169 | 0,0,66      |
|  √  | android  | <p style="background-color: #888888">　　　</p> | GRAY         | 灰          | #888888 | 136,136,136 | 0,0,53      |
|     | css      | <p style="background-color: #808080">　　　</p> |              | 灰          | #808080 | 128,128,128 | 0,0,50      |
|     | web      | <p style="background-color: #808080">　　　</p> |              | 灰          | #808080 | 128,128,128 | 0,0,50      |
|  √  | android  | <p style="background-color: #888888">　　　</p> | GREY         | 灰          | #888888 | 136,136,136 | 0,0,53      |
|     | css      | <p style="background-color: #808080">　　　</p> |              | 灰          | #808080 | 128,128,128 | 0,0,50      |
|     | material | <p style="background-color: #9E9E9E">　　　</p> |              | 灰 (500)    | #9E9E9E | 158,158,158 | 0,0,62      |
|  √  | android  | <p style="background-color: #00FF00">　　　</p> | GREEN        | 绿          | #00FF00 | 0,255,0     | 120,100,100 |
|     | css      | <p style="background-color: #008000">　　　</p> |              | 绿          | #008000 | 0,128,0     | 120,100,50  |
|     | web      | <p style="background-color: #008000">　　　</p> |              | 绿          | #008000 | 0,128,0     | 120,100,50  |
|     | material | <p style="background-color: #4CAF50">　　　</p> |              | 绿 (500)    | #4CAF50 | 76,175,80   | 122,57,69   |
|  √  | android  | <p style="background-color: #00FF00">　　　</p> | LIME         | 绿          | #00FF00 | 0,255,0     | 120,100,100 |
|     | css      | <p style="background-color: #00FF00">　　　</p> |              | 鲜绿 / 莱姆    | #00FF00 | 0,255,0     | 120,100,100 |
|     | web      | <p style="background-color: #CCFF00">　　　</p> |              | 柠檬绿 / 亮柠檬绿 | #CCFF00 | 204,255,0   | 72,100,100  |
|     | material | <p style="background-color: #CDDC39">　　　</p> |              | 绿黄 (500)   | #CDDC39 | 205,220,57  | 66,74,86    |
|  √  | android  | <p style="background-color: #CCCCCC">　　　</p> | LIGHT_GRAY   | 亮灰         | #CCCCCC | 204,204,204 | 0,0,80      |
|     | css      | <p style="background-color: #D3D3D3">　　　</p> |              | 亮灰         | #D3D3D3 | 211,211,211 | 0,0,83      |
|     | web      | <p style="background-color: #D3D3D3">　　　</p> |              | 亮灰         | #D3D3D3 | 211,211,211 | 0,0,83      |
|  √  | android  | <p style="background-color: #CCCCCC">　　　</p> | LIGHT_GREY   | 亮灰         | #CCCCCC | 204,204,204 | 0,0,80      |
|     | css      | <p style="background-color: #D3D3D3">　　　</p> |              | 亮灰         | #D3D3D3 | 211,211,211 | 0,0,83      |
|  √  | android  | <p style="background-color: #FF00FF">　　　</p> | FUCHSIA      | 品红 / 洋红    | #FF00FF | 255,0,255   | 300,100,100 |
|     | css      | <p style="background-color: #FF00FF">　　　</p> |              | 洋红 / 品红    | #FF00FF | 255,0,255   | 300,100,100 |
|     | web      | <p style="background-color: #F400A1">　　　</p> |              | 紫红         | #F400A1 | 244,0,161   | 320,100,96  |
|  √  | android  | <p style="background-color: #800080">　　　</p> | PURPLE       | 紫          | #800080 | 128,0,128   | 300,100,50  |
|     | css      | <p style="background-color: #9C27B0">　　　</p> |              | 紫 (500)    | #9C27B0 | 156,39,176  | 291,78,69   |
|     | web      | <p style="background-color: #6A0DAD">　　　</p> |              | 紫          | #6A0DAD | 106,13,173  | 275,92,68   |
|  √  | android  | <p style="background-color: #FF0000">　　　</p> | RED          | 红          | #FF0000 | 255,0,0     | 0,100,100   |
|     | css      | <p style="background-color: #FF0000">　　　</p> |              | 红          | #FF0000 | 255,0,0     | 0,100,100   |
|     | web      | <p style="background-color: #FF0000">　　　</p> |              | 红          | #FF0000 | 255,0,0     | 0,100,100   |
|     | material | <p style="background-color: #F44336">　　　</p> |              | 红 (500)    | #F44336 | 244,67,54   | 4,78,96     |
|  √  | android  | <p style="background-color: #008080">　　　</p> | TEAL         | 鸭绿 / 凫绿    | #008080 | 0,128,128   | 180,100,50  |
|     | css      | <p style="background-color: #008080">　　　</p> |              | 鸭绿 / 凫绿    | #008080 | 0,128,128   | 180,100,50  |
|     | web      | <p style="background-color: #008080">　　　</p> |              | 鸭绿 / 凫绿    | #008080 | 0,128,128   | 180,100,50  |
|     | material | <p style="background-color: #009688">　　　</p> |              | 蓝绿 (500)   | #009688 | 0,150,136   | 174,100,59  |
|  √  | android  | <p style="background-color: #FFFF00">　　　</p> | YELLOW       | 黄          | #FFFF00 | 255,255,0   | 60,100,100  |
|     | css      | <p style="background-color: #FFFF00">　　　</p> |              | 黄          | #FFFF00 | 255,255,0   | 60,100,100  |
|     | web      | <p style="background-color: #FFFF00">　　　</p> |              | 黄          | #FFFF00 | 255,255,0   | 60,100,100  |
|     | material | <p style="background-color: #FFEB3B">　　　</p> |              | 黄 (500)    | #FFEB3B | 255,235,59  | 54,77,100   |
|  √  | css      | <p style="background-color: #FFC0CB">　　　</p> | PINK         | 粉红         | #FFC0CB | 255,192,203 | 350,25,100  |
|     | web      | <p style="background-color: #FFC0CB">　　　</p> |              | 粉红         | #FFC0CB | 255,192,203 | 350,25,100  |
|     | material | <p style="background-color: #E91E63">　　　</p> |              | 粉红 (500)   | #E91E63 | 233,30,99   | 340,87,91   |
|  √  | css      | <p style="background-color: #4B0082">　　　</p> | INDIGO       | 靛          | #4B0082 | 75,0,130    | 	275,100,51 |
|     | web      | <p style="background-color: #4B0080">　　　</p> |              | 靛          | #4B0080 | 75,0,128    | 275,100,50  |
|     | material | <p style="background-color: #3F51B5">　　　</p> |              | 靛蓝 (500)   | #3F51B5 | 63,81,181   | 231,65,71   |
|  √  | css      | <p style="background-color: #ADD8E6">　　　</p> | LIGHT_BLUE   | 亮蓝         | #ADD8E6 | 173,216,230 | 195,25,90   |
|     | web      | <p style="background-color: #ADD8E6">　　　</p> |              | 亮蓝         | #ADD8E6 | 173,216,230 | 195,25,90   |
|     | material | <p style="background-color: #03A9F4">　　　</p> |              | 浅蓝 (500)   | #03A9F4 | 3,169,244   | 199,99,96   |
|  √  | css      | <p style="background-color: #90EE90">　　　</p> | LIGHT_GREEN  | 亮绿         | #90EE90 | 144,238,144 | 120,39,93   |
|     | web      | <p style="background-color: #90EE90">　　　</p> |              | 亮绿         | #90EE90 | 144,238,144 | 120,39,93   |
|     | material | <p style="background-color: #8BC34A">　　　</p> |              | 浅绿 (500)   | #8BC34A | 139,195,74  | 88,62,76    |
|  √  | web      | <p style="background-color: #FFBF00">　　　</p> | AMBER        | 琥珀         | #FFBF00 | 255,191,0   | 45,100,100  |
|     | material | <p style="background-color: #FFC107">　　　</p> |              | 琥珀 (500)   | #FFC107 | 255,193,7   | 45,97,100   |
|  √  | css      | <p style="background-color: #FFA500">　　　</p> | ORANGE       | 橙          | #FFA500 | 255,165,0   | 39,100,100  |
|     | web      | <p style="background-color: #FFA500">　　　</p> |              | 橙          | #FFA500 | 255,165,0   | 39,100,100  |
|     | material | <p style="background-color: #FF9800">　　　</p> |              | 橙 (500)    | #FF9800 | 255,152,0   | 36,100,100  |
|  √  | css      | <p style="background-color: #A52A2A">　　　</p> | BROWN        | 褐          | #A52A2A | 165,42,42   | 0,75,65     |
|     | web      | <p style="background-color: #A52A2A">　　　</p> |              | 褐          | #A52A2A | 165,42,42   | 0,75,65     |
|     | material | <p style="background-color: #795548">　　　</p> |              | 棕 (500)    | #795548 | 121,85,72   | 16,40,47    |
|  √  | css      | <p style="background-color: #F0FFFF">　　　</p> | AZURE        | 湛蓝         | #F0FFFF | 240,255,255 | 210,100,100 |
|     | web      | <p style="background-color: #007FFF">　　　</p> |              | 蔚蓝 / 湛蓝    | #007FFF | 0,127,255   | 210,100,100 |
|  √  | css      | <p style="background-color: #F0E68C">　　　</p> | KHAKI        | 卡其         | #F0E68C | 240,230,140 | 54,42,94    |
|     | web      | <p style="background-color: #996B1F">　　　</p> |              | 卡其         | #996B1F | 153,107,31  | 37,80,60    |
|  √  | css      | <p style="background-color: #E6E6FA">　　　</p> | LAVENDER     | 薰衣草        | #E6E6FA | 230,230,250 | 240,8,98    |
|     | web      | <p style="background-color: #B57EDC">　　　</p> |              | 薰衣草紫       | #B57EDC | 181,126,220 | 275,43,86   |
|  √  | css      | <p style="background-color: #00FF7F">　　　</p> | SPRING_GREEN | 春绿         | #00FF7F | 0,255,127   | 150,100,100 |
|     | web      | <p style="background-color: #00FF80">　　　</p> |              | 春绿         | #00FF80 | 0,255,128   | 150,100,100 |
|  √  | css      | <p style="background-color: #40E0D0">　　　</p> | TURQUOISE    | 绿松         | #40E0D0 | 64,224,208  | 174,71,88   |
|     | web      | <p style="background-color: #30D5C8">　　　</p> |              | 绿松 / 绿松石   | #30D5C8 | 48,213,200  | 210,100,100 |
|  √  | css      | <p style="background-color: #EE82EE">　　　</p> | VIOLET       | 紫罗兰        | #EE82EE | 238,130,238 | 300,45,93   |
|     | web      | <p style="background-color: #8000FF">　　　</p> |              | 堇紫         | #8000FF | 128,0,255   | 270,100,100 |

## 融合颜色列表

若访问一个颜色常量时, 不关心这个颜色名称属于哪个颜色列表, 可直接使用颜色名称访问颜色.

以 `橙色 (Orange)` 为例, 访问方式如下:

```js
/* 颜色列表访问方式. */
colors.css.ORANGE;

/* 颜色名称访问方式 (作为 colors 对象的属性). */
colors.ORANGE;

/* 颜色名称访问方式 (作为字符串参数). */
colors.toInt('orange');
```

实际上, 在 [Material 颜色列表](#material-颜色列表) 中也存在 `ORANGE` 颜色:

```js
colors.material.ORANGE;
```

对于 `ORANGE` 这样存在映射冲突的颜色, 遵循如下命名空间优先级:

```text
android > css > web > material
```

可知 `css` 命名空间的优先级高于 `material`, 因此 `colors.ORANGE` 等效于 `colors.css.ORANGE`. 详情参阅 [颜色名称冲突](#颜色名称冲突) 小节.

将所有颜色列表按照上述命名空间优先级进行拼合, 并去除所有冲突项, 得到新的融合列表:

| 命名空间     | 颜色                                             | 变量名                        | 颜色译名        | Hex 代码    | RGB            | HSV            |
|----------|------------------------------------------------|----------------------------|-------------|-----------|----------------|----------------|
| css      | <p style="background-color: #F0F8FF">　　　</p>   | ALICE_BLUE                 | 爱丽丝蓝        | #F0F8FF   | 240,248,255    | 208,6,100      |
| web      | <p style="background-color: #E32636">　　　</p>   | ALIZARIN_CRIMSON           | 茜红 / 深茜红    | #E32636   | 227,38,54      | 355,83,89      |
| web      | <p style="background-color: #FFBF00">　　　</p>   | AMBER                      | 琥珀          | #FFBF00   | 255,191,0      | 45,100,100     |
| material | <p style="background-color: #FFF8E1">　　　</p>   | AMBER_50                   | 琥珀 (50)     | #FFF8E1   | 255,248,225    | 46,12,100      |
| material | <p style="background-color: #FFECB3">　　　</p>   | AMBER_100                  | 琥珀 (100)    | #FFECB3   | 255,236,179    | 45,30,100      |
| material | <p style="background-color: #FFE082">　　　</p>   | AMBER_200                  | 琥珀 (200)    | #FFE082   | 255,224,130    | 45,49,100      |
| material | <p style="background-color: #FFD54F">　　　</p>   | AMBER_300                  | 琥珀 (300)    | #FFD54F   | 255,213,79     | 46,69,100      |
| material | <p style="background-color: #FFCA28">　　　</p>   | AMBER_400                  | 琥珀 (400)    | #FFCA28   | 255,202,40     | 45,84,100      |
| material | <p style="background-color: #FFC107">　　　</p>   | AMBER_500                  | 琥珀 (500)    | #FFC107   | 255,193,7      | 45,97,100      |
| material | <p style="background-color: #FFB300">　　　</p>   | AMBER_600                  | 琥珀 (600)    | #FFB300   | 255,179,0      | 42,100,100     |
| material | <p style="background-color: #FFA000">　　　</p>   | AMBER_700                  | 琥珀 (700)    | #FFA000   | 255,160,0      | 38,100,100     |
| material | <p style="background-color: #FF8F00">　　　</p>   | AMBER_800                  | 琥珀 (800)    | #FF8F00   | 255,143,0      | 34,100,100     |
| material | <p style="background-color: #FF6F00">　　　</p>   | AMBER_900                  | 琥珀 (900)    | #FF6F00   | 255,111,0      | 26,100,100     |
| material | <p style="background-color: #FFE57F">　　　</p>   | AMBER_A100                 | 琥珀 (A100)   | #FFE57F   | 255,229,127    | 48,50,100      |
| material | <p style="background-color: #FFD740">　　　</p>   | AMBER_A200                 | 琥珀 (A200)   | #FFD740   | 255,215,64     | 47,75,100      |
| material | <p style="background-color: #FFC400">　　　</p>   | AMBER_A400                 | 琥珀 (A400)   | #FFC400   | 255,196,0      | 46,100,100     |
| material | <p style="background-color: #FFAB00">　　　</p>   | AMBER_A700                 | 琥珀 (A700)   | #FFAB00   | 255,171,0      | 40,100,100     |
| web      | <p style="background-color: #9966CC">　　　</p>   | AMETHYST                   | 紫水晶         | #9966CC   | 153,102,204    | 270,50,80      |
| css      | <p style="background-color: #FAEBD7">　　　</p>   | ANTIQUE_WHITE              | 古董白         | #FAEBD7   | 250,235,215    | 34,14,98       |
| web      | <p style="background-color: #8CE600">　　　</p>   | APPLE_GREEN                | 苹果绿         | #8CE600   | 140,230,0      | 83,100,90      |
| web      | <p style="background-color: #E69966">　　　</p>   | APRICOT                    | 杏黄          | #E69966   | 230,153,102    | 24,56,90       |
| android  | <p style="background-color: #00FFFF">　　　</p>   | AQUA                       | 青           | #00FFFF   | 0,255,255      | 180,100,100    |
| css      | <p style="background-color: #7FFFD4">　　　</p>   | AQUAMARINE                 | 蓝绿 / 碧蓝     | #7FFFD4   | 127,255,212    | 160,50,100     |
| web      | <p style="background-color: #66FFE6">　　　</p>   | AQUA_BLUE                  | 水蓝          | #66FFE6   | 102,255,230    | 170,60,100     |
| css      | <p style="background-color: #F0FFFF">　　　</p>   | AZURE                      | 湛蓝          | #F0FFFF   | 240,255,255    | 210,100,100    |
| web      | <p style="background-color: #89CFF0">　　　</p>   | BABY_BLUE                  | 浅蓝          | #89CFF0   | 137,207,240    | 199,43,94      |
| web      | <p style="background-color: #FFD9E6">　　　</p>   | BABY_PINK                  | 浅粉红         | #FFD9E6   | 255,217,230    | 339,15,100     |
| css      | <p style="background-color: #F5F5DC">　　　</p>   | BEIGE                      | 米黄          | #F5F5DC   | 245,245,220    | 60,10,96       |
| css      | <p style="background-color: #FFE4C4">　　　</p>   | BISQUE                     | 陶坯黄         | #FFE4C4   | 255,228,196    | 33,23,100      |
| android  | <p style="background-color: #000000">　　　</p>   | BLACK                      | 黑           | #000000   | 0,0,0          | 0,0,0          |
| material | <p style="background-color: #000000">　　　</p>   | BLACK_1000                 | 黑           | #000000   | 0,0,0          | 0,0,0          |
| css      | <p style="background-color: #FFEBCD">　　　</p>   | BLANCHED_ALMOND            | 杏仁白         | #FFEBCD   | 255,235,205    | 36,20,100      |
| android  | <p style="background-color: #0000FF">　　　</p>   | BLUE                       | 蓝           | #0000FF   | 0,0,255        | 240,100,100    |
| material | <p style="background-color: #E3F2FD">　　　</p>   | BLUE_50                    | 蓝 (50)      | #E3F2FD   | 227,242,253    | 205,10,99      |
| material | <p style="background-color: #BBDEFB">　　　</p>   | BLUE_100                   | 蓝 (100)     | #BBDEFB   | 187,222,251    | 207,25,98      |
| material | <p style="background-color: #90CAF9">　　　</p>   | BLUE_200                   | 蓝 (200)     | #90CAF9   | 144,202,249    | 207,42,98      |
| material | <p style="background-color: #64B5F6">　　　</p>   | BLUE_300                   | 蓝 (300)     | #64B5F6   | 100,181,246    | 207,59,96      |
| material | <p style="background-color: #42A5F5">　　　</p>   | BLUE_400                   | 蓝 (400)     | #42A5F5   | 66,165,245     | 207,73,96      |
| material | <p style="background-color: #2196F3">　　　</p>   | BLUE_500                   | 蓝 (500)     | #2196F3   | 33,150,243     | 207,86,95      |
| material | <p style="background-color: #1E88E5">　　　</p>   | BLUE_600                   | 蓝 (600)     | #1E88E5   | 30,136,229     | 208,87,90      |
| material | <p style="background-color: #1976D2">　　　</p>   | BLUE_700                   | 蓝 (700)     | #1976D2   | 25,118,210     | 210,88,82      |
| material | <p style="background-color: #1565C0">　　　</p>   | BLUE_800                   | 蓝 (800)     | #1565C0   | 21,101,192     | 212,89,75      |
| material | <p style="background-color: #0D47A1">　　　</p>   | BLUE_900                   | 蓝 (900)     | #0D47A1   | 13,71,161      | 216,92,63      |
| material | <p style="background-color: #82B1FF">　　　</p>   | BLUE_A100                  | 蓝 (A100)    | #82B1FF   | 130,177,255    | 217,49,100     |
| material | <p style="background-color: #448AFF">　　　</p>   | BLUE_A200                  | 蓝 (A200)    | #448AFF   | 68,138,255     | 218,73,100     |
| material | <p style="background-color: #2979FF">　　　</p>   | BLUE_A400                  | 蓝 (A400)    | #2979FF   | 41,121,255     | 218,84,100     |
| material | <p style="background-color: #2962FF">　　　</p>   | BLUE_A700                  | 蓝 (A700)    | #2962FF   | 41,98,255      | 224,84,100     |
| material | <p style="background-color: #607D8B">　　　</p>   | BLUE_GREY                  | 蓝灰 (500)    | #607D8B   | 96,125,139     | 200,31,55      |
| material | <p style="background-color: #ECEFF1">　　　</p>   | BLUE_GREY_50               | 蓝灰 (50)     | #ECEFF1   | 236,239,241    | 204,2,95       |
| material | <p style="background-color: #CFD8DC">　　　</p>   | BLUE_GREY_100              | 蓝灰 (100)    | #CFD8DC   | 207,216,220    | 198,6,86       |
| material | <p style="background-color: #B0BBC5">　　　</p>   | BLUE_GREY_200              | 蓝灰 (200)    | #B0BBC5   | 176,187,197    | 209,11,77      |
| material | <p style="background-color: #90A4AE">　　　</p>   | BLUE_GREY_300              | 蓝灰 (300)    | #90A4AE   | 144,164,174    | 200,17,68      |
| material | <p style="background-color: #78909C">　　　</p>   | BLUE_GREY_400              | 蓝灰 (400)    | #78909C   | 120,144,156    | 200,23,61      |
| material | <p style="background-color: #607D8B">　　　</p>   | BLUE_GREY_500              | 蓝灰 (500)    | #607D8B   | 96,125,139     | 200,31,55      |
| material | <p style="background-color: #546E7A">　　　</p>   | BLUE_GREY_600              | 蓝灰 (600)    | #546E7A   | 84,110,122     | 199,31,48      |
| material | <p style="background-color: #455A64">　　　</p>   | BLUE_GREY_700              | 蓝灰 (700)    | #455A64   | 69,90,100      | 199,31,39      |
| material | <p style="background-color: #37474F">　　　</p>   | BLUE_GREY_800              | 蓝灰 (800)    | #37474F   | 55,71,79       | 200,30,31      |
| material | <p style="background-color: #263238">　　　</p>   | BLUE_GREY_900              | 蓝灰 (900)    | #263238   | 38,50,56       | 200,32,22      |
| css      | <p style="background-color: #8A2BE2">　　　</p>   | BLUE_VIOLET                | 蓝紫          | #8A2BE2   | 138,43,226     | 271,81,89      |
| web      | <p style="background-color: #66FF00">　　　</p>   | BRIGHT_GREEN               | 黄绿 / 明绿     | #66FF00   | 102,255,0      | 96,100,100     |
| web      | <p style="background-color: #CD7F32">　　　</p>   | BRONZE                     | 铜           | #CD7F32   | 184,115,51     | 29,72,72       |
| css      | <p style="background-color: #A52A2A">　　　</p>   | BROWN                      | 褐           | #A52A2A   | 165,42,42      | 0,75,65        |
| material | <p style="background-color: #EFEBE9">　　　</p>   | BROWN_50                   | 棕 (50)      | #EFEBE9   | 239,235,233    | 20,3,94        |
| material | <p style="background-color: #D7CCC8">　　　</p>   | BROWN_100                  | 棕 (100)     | #D7CCC8   | 215,204,200    | 16,7,84        |
| material | <p style="background-color: #BCAAA4">　　　</p>   | BROWN_200                  | 棕 (200)     | #BCAAA4   | 188,170,164    | 15,13,74       |
| material | <p style="background-color: #A1887F">　　　</p>   | BROWN_300                  | 棕 (300)     | #A1887F   | 161,136,127    | 16,21,63       |
| material | <p style="background-color: #8D6E63">　　　</p>   | BROWN_400                  | 棕 (400)     | #8D6E63   | 141,110,99     | 16,30,55       |
| material | <p style="background-color: #795548">　　　</p>   | BROWN_500                  | 棕 (500)     | #795548   | 121,85,72      | 16,40,47       |
| material | <p style="background-color: #6D4C41">　　　</p>   | BROWN_600                  | 棕 (600)     | #6D4C41   | 109,76,65      | 15,40,43       |
| material | <p style="background-color: #5D4037">　　　</p>   | BROWN_700                  | 棕 (700)     | #5D4037   | 93,64,55       | 14,41,36       |
| material | <p style="background-color: #4E342E">　　　</p>   | BROWN_800                  | 棕 (800)     | #4E342E   | 78,52,46       | 11,41,31       |
| material | <p style="background-color: #3E2723">　　　</p>   | BROWN_900                  | 棕 (900)     | #3E2723   | 62,39,35       | 9,44,24        |
| web      | <p style="background-color: #800020">　　　</p>   | BURGUNDY                   | 勃艮第酒红       | #800020   | 128,0,32       | 345,100,50     |
| css      | <p style="background-color: #DEB887">　　　</p>   | BURLY_WOOD                 | 硬木          | #DEB887   | 222,184,135    | 34,39,87       |
| web      | <p style="background-color: #CC5500">　　　</p>   | BURNT_ORANGE               | 燃橙          | #CC5500   | 204,85,0       | 25,100,80      |
| css      | <p style="background-color: #5F9EA0">　　　</p>   | CADET_BLUE                 | 军服蓝         | #5F9EA0   | 95,158,160     | 182,41,63      |
| web      | <p style="background-color: #A16B47">　　　</p>   | CAMEL                      | 驼           | #A16B47   | 161,107,71     | 24,56,63       |
| web      | <p style="background-color: #E63995">　　　</p>   | CAMELLIA                   | 山茶红         | #E63995   | 230,57,149     | 328,75,90      |
| web      | <p style="background-color: #FFEF00">　　　</p>   | CANARY_YELLOW              | 鲜黄          | #FFEF00   | 255,239,0      | 56,100,100     |
| web      | <p style="background-color: #990036">　　　</p>   | CARDINAL_RED               | 枢机红         | #990036   | 153,0,54       | 339,100,60     |
| web      | <p style="background-color: #E6005C">　　　</p>   | CARMINE                    | 胭脂红         | #E6005C   | 230,0,92       | 336,100,90     |
| web      | <p style="background-color: #ACE1AF">　　　</p>   | CELADON                    | 青瓷绿         | #ACE1AF   | 172,225,175    | 123,24,88      |
| web      | <p style="background-color: #DE3163">　　　</p>   | CERISE                     | 樱桃红 / 樱桃    | #DE3163   | 222,49,99      | 343,78,87      |
| web      | <p style="background-color: #2A52BE">　　　</p>   | CERULEAN_BLUE              | 蔚蓝 / 天青蓝    | #2A52BE   | 42,82,190      | 224,78,75      |
| web      | <p style="background-color: #FFFF99">　　　</p>   | CHAMPAGNE_YELLOW           | 香槟黄         | #FFFF99   | 255,255,153    | 60,40,100      |
| css      | <p style="background-color: #7FFF00">　　　</p>   | CHARTREUSE                 | 查特酒绿        | #7FFF00   | 127,255,0      | 90,100,100     |
| css      | <p style="background-color: #D2691E">　　　</p>   | CHOCOLATE                  | 巧克力         | #D2691E   | 210,105,30     | 25,86,82       |
| web      | <p style="background-color: #E6B800">　　　</p>   | CHROME_YELLOW              | 铬黄          | #E6B800   | 230,184,0      | 48,100,90      |
| web      | <p style="background-color: #CCA3CC">　　　</p>   | CLEMATIS                   | 铁线莲紫        | #CCA3CC   | 204,163,204    | 300,20,80      |
| web      | <p style="background-color: #0047AB">　　　</p>   | COBALT_BLUE                | 钴蓝          | #0047AB   | 0,71,171       | 215,100,67     |
| web      | <p style="background-color: #66FF59">　　　</p>   | COBALT_GREEN               | 钴绿          | #66FF59   | 102,255,89     | 115,65,100     |
| web      | <p style="background-color: #4D1F00">　　　</p>   | COCONUT_BROWN              | 椰褐          | #4D1F00   | 77,31,0        | 24,100,30      |
| web      | <p style="background-color: #4D3900">　　　</p>   | COFFEE                     | 咖啡          | #4D3900   | 77,57,0        | 44,100,30      |
| css      | <p style="background-color: #FF7F50">　　　</p>   | CORAL                      | 珊瑚红         | #FF7F50   | 255,127,80     | 16,69,100      |
| web      | <p style="background-color: #FF80BF">　　　</p>   | CORAL_PINK                 | 浅珊瑚红        | #FF80BF   | 255,128,191    | 330,50,100     |
| css      | <p style="background-color: #6495ED">　　　</p>   | CORNFLOWER_BLUE            | 矢车菊蓝        | #6495ED   | 100,149,237    | 219,58,93      |
| css      | <p style="background-color: #FFF8DC">　　　</p>   | CORN_SILK                  | 玉米丝         | #FFF8DC   | 255,248,220    | 48,14,100      |
| web      | <p style="background-color: #FFFDD0">　　　</p>   | CREAM                      | 奶油          | #FFFDD0   | 255,253,208    | 57,18,100      |
| css      | <p style="background-color: #DC143C">　　　</p>   | CRIMSON                    | 绯红          | #DC143C   | 220,20,60      | 348,91,86      |
| android  | <p style="background-color: #00FFFF">　　　</p>   | CYAN                       | 青           | #00FFFF   | 0,255,255      | 180,100,100    |
| material | <p style="background-color: #E0F7FA">　　　</p>   | CYAN_50                    | 青 (50)      | #E0F7FA   | 224,247,250    | 187,10,98      |
| material | <p style="background-color: #B2EBF2">　　　</p>   | CYAN_100                   | 青 (100)     | #B2EBF2   | 178,235,242    | 187,26,95      |
| material | <p style="background-color: #80DEEA">　　　</p>   | CYAN_200                   | 青 (200)     | #80DEEA   | 128,222,234    | 187,45,92      |
| material | <p style="background-color: #4DD0E1">　　　</p>   | CYAN_300                   | 青 (300)     | #4DD0E1   | 77,208,225     | 187,66,88      |
| material | <p style="background-color: #26C6DA">　　　</p>   | CYAN_400                   | 青 (400)     | #26C6DA   | 38,198,218     | 187,83,85      |
| material | <p style="background-color: #00BCD4">　　　</p>   | CYAN_500                   | 青 (500)     | #00BCD4   | 0,188,212      | 187,100,83     |
| material | <p style="background-color: #00ACC1">　　　</p>   | CYAN_600                   | 青 (600)     | #00ACC1   | 0,172,193      | 187,100,76     |
| material | <p style="background-color: #0097A7">　　　</p>   | CYAN_700                   | 青 (700)     | #0097A7   | 0,151,167      | 186,100,65     |
| material | <p style="background-color: #00838F">　　　</p>   | CYAN_800                   | 青 (800)     | #00838F   | 0,131,143      | 185,100,56     |
| material | <p style="background-color: #006064">　　　</p>   | CYAN_900                   | 青 (900)     | #006064   | 0,96,100       | 182,100,39     |
| material | <p style="background-color: #84FFFF">　　　</p>   | CYAN_A100                  | 青 (A100)    | #84FFFF   | 132,255,255    | 180,48,100     |
| material | <p style="background-color: #18FFFF">　　　</p>   | CYAN_A200                  | 青 (A200)    | #18FFFF   | 24,255,255     | 180,91,100     |
| material | <p style="background-color: #00E5FF">　　　</p>   | CYAN_A400                  | 青 (A400)    | #00E5FF   | 0,229,255      | 186,100,100    |
| material | <p style="background-color: #00B8D4">　　　</p>   | CYAN_A700                  | 青 (A700)    | #00B8D4   | 0,184,212      | 188,100,83     |
| web      | <p style="background-color: #0DBF8C">　　　</p>   | CYAN_BLUE                  | 青蓝          | #0DBF8C   | 13,191,140     | 163,93,75      |
| css      | <p style="background-color: #00008B">　　　</p>   | DARK_BLUE                  | 暗蓝          | #00008B   | 0,0,139        | 240,100,55     |
| css      | <p style="background-color: #008B8B">　　　</p>   | DARK_CYAN                  | 暗青          | #008B8B   | 0,139,139      | 180,100,55     |
| css      | <p style="background-color: #B8860B">　　　</p>   | DARK_GOLDENROD             | 暗金菊         | #B8860B   | 184,134,11     | 43,94,72       |
| android  | <p style="background-color: #444444">　　　</p>   | DARK_GRAY                  | 暗灰          | #444444   | 68,68,68       | 0,0,27         |
| css      | <p style="background-color: #006400">　　　</p>   | DARK_GREEN                 | 暗绿          | #006400   | 0,100,0        | 120,100,39     |
| android  | <p style="background-color: #444444">　　　</p>   | DARK_GREY                  | 暗灰          | #444444   | 68,68,68       | 0,0,27         |
| css      | <p style="background-color: #BDB76B">　　　</p>   | DARK_KHAKI                 | 暗卡其         | #BDB76B   | 189,183,107    | 56,43,74       |
| css      | <p style="background-color: #8B008B">　　　</p>   | DARK_MAGENTA               | 暗洋红         | #8B008B   | 139,0,139      | 300,100,55     |
| web      | <p style="background-color: #24367D">　　　</p>   | DARK_MINERAL_BLUE          | 暗矿蓝         | #24367D   | 36,54,125      | 228,71,49      |
| css      | <p style="background-color: #556B2F">　　　</p>   | DARK_OLIVE_GREEN           | 暗橄榄绿        | #556B2F   | 85,107,47      | 82,56,42       |
| css      | <p style="background-color: #FF8C00">　　　</p>   | DARK_ORANGE                | 暗橙          | #FF8C00   | 255,140,0      | 33,100,100     |
| css      | <p style="background-color: #9932CC">　　　</p>   | DARK_ORCHID                | 暗兰紫         | #9932CC   | 153,50,204     | 280,75,80      |
| web      | <p style="background-color: #003399">　　　</p>   | DARK_POWDER_BLUE           | 暗粉蓝         | #003399   | 0,51,153       | 220,100,60     |
| css      | <p style="background-color: #8B0000">　　　</p>   | DARK_RED                   | 暗红          | #8B0000   | 139,0,0        | 0,100,55       |
| css      | <p style="background-color: #E9967A">　　　</p>   | DARK_SALMON                | 暗鲑红         | #E9967A   | 233,150,122    | 15,48,91       |
| css      | <p style="background-color: #8FBC8F">　　　</p>   | DARK_SEA_GREEN             | 暗海绿         | #8FBC8F   | 143,188,143    | 120,24,74      |
| css      | <p style="background-color: #483D8B">　　　</p>   | DARK_SLATE_BLUE            | 暗岩蓝         | #483D8B   | 72,61,139      | 248,56,55      |
| css      | <p style="background-color: #2F4F4F">　　　</p>   | DARK_SLATE_GRAY            | 暗岩灰         | #2F4F4F   | 47,79,79       | 180,41,31      |
| css      | <p style="background-color: #2F4F4F">　　　</p>   | DARK_SLATE_GREY            | 暗岩灰         | #2F4F4F   | 47,79,79       | 180,41,31      |
| css      | <p style="background-color: #00CED1">　　　</p>   | DARK_TURQUOISE             | 暗绿松石        | #00CED1   | 0,206,209      | 181,100,82     |
| css      | <p style="background-color: #9400D3">　　　</p>   | DARK_VIOLET                | 暗紫          | #9400D3   | 148,0,211      | 282,100,83     |
| material | <p style="background-color: #FF5722">　　　</p>   | DEEP_ORANGE                | 深橙 (500)    | #FF5722   | 255,87,34      | 14,87,100      |
| material | <p style="background-color: #FBE9A7">　　　</p>   | DEEP_ORANGE_50             | 深橙 (50)     | #FBE9A7   | 251,233,167    | 47,33,98       |
| material | <p style="background-color: #FFCCBC">　　　</p>   | DEEP_ORANGE_100            | 深橙 (100)    | #FFCCBC   | 255,204,188    | 14,26,100      |
| material | <p style="background-color: #FFAB91">　　　</p>   | DEEP_ORANGE_200            | 深橙 (200)    | #FFAB91   | 255,171,145    | 14,43,100      |
| material | <p style="background-color: #FF8A65">　　　</p>   | DEEP_ORANGE_300            | 深橙 (300)    | #FF8A65   | 255,138,101    | 14,60,100      |
| material | <p style="background-color: #FF7043">　　　</p>   | DEEP_ORANGE_400            | 深橙 (400)    | #FF7043   | 255,112,67     | 14,74,100      |
| material | <p style="background-color: #FF5722">　　　</p>   | DEEP_ORANGE_500            | 深橙 (500)    | #FF5722   | 255,87,34      | 14,87,100      |
| material | <p style="background-color: #F4511E">　　　</p>   | DEEP_ORANGE_600            | 深橙 (600)    | #F4511E   | 244,81,30      | 14,88,96       |
| material | <p style="background-color: #E64A19">　　　</p>   | DEEP_ORANGE_700            | 深橙 (700)    | #E64A19   | 230,74,25      | 14,89,90       |
| material | <p style="background-color: #D84315">　　　</p>   | DEEP_ORANGE_800            | 深橙 (800)    | #D84315   | 216,67,21      | 14,90,85       |
| material | <p style="background-color: #BF360C">　　　</p>   | DEEP_ORANGE_900            | 深橙 (900)    | #BF360C   | 191,54,12      | 14,94,75       |
| material | <p style="background-color: #FF9E80">　　　</p>   | DEEP_ORANGE_A100           | 深橙 (A100)   | #FF9E80   | 255,158,128    | 14,50,100      |
| material | <p style="background-color: #FF6E40">　　　</p>   | DEEP_ORANGE_A200           | 深橙 (A200)   | #FF6E40   | 255,110,64     | 14,75,100      |
| material | <p style="background-color: #FF3D00">　　　</p>   | DEEP_ORANGE_A400           | 深橙 (A400)   | #FF3D00   | 255,61,0       | 14,100,100     |
| material | <p style="background-color: #DD2600">　　　</p>   | DEEP_ORANGE_A700           | 深橙 (A700)   | #DD2600   | 221,38,0       | 10,100,87      |
| css      | <p style="background-color: #FF1493">　　　</p>   | DEEP_PINK                  | 深粉红         | #FF1493   | 255,20,147     | 328,92,100     |
| material | <p style="background-color: #673AB7">　　　</p>   | DEEP_PURPLE                | 深紫 (500)    | #673AB7   | 103,58,183     | 262,68,72      |
| material | <p style="background-color: #EDE7F6">　　　</p>   | DEEP_PURPLE_50             | 深紫 (50)     | #EDE7F6   | 237,231,246    | 264,6,96       |
| material | <p style="background-color: #D1C4E9">　　　</p>   | DEEP_PURPLE_100            | 深紫 (100)    | #D1C4E9   | 209,196,233    | 261,16,91      |
| material | <p style="background-color: #B39DDB">　　　</p>   | DEEP_PURPLE_200            | 深紫 (200)    | #B39DDB   | 179,157,219    | 261,28,86      |
| material | <p style="background-color: #9575CD">　　　</p>   | DEEP_PURPLE_300            | 深紫 (300)    | #9575CD   | 149,117,205    | 262,43,80      |
| material | <p style="background-color: #7E57C2">　　　</p>   | DEEP_PURPLE_400            | 深紫 (400)    | #7E57C2   | 126,87,194     | 262,55,76      |
| material | <p style="background-color: #673AB7">　　　</p>   | DEEP_PURPLE_500            | 深紫 (500)    | #673AB7   | 103,58,183     | 262,68,72      |
| material | <p style="background-color: #5E35B1">　　　</p>   | DEEP_PURPLE_600            | 深紫 (600)    | #5E35B1   | 94,53,177      | 260,70,69      |
| material | <p style="background-color: #512DA8">　　　</p>   | DEEP_PURPLE_700            | 深紫 (700)    | #512DA8   | 81,45,168      | 258,73,66      |
| material | <p style="background-color: #4527A0">　　　</p>   | DEEP_PURPLE_800            | 深紫 (800)    | #4527A0   | 69,39,160      | 255,76,63      |
| material | <p style="background-color: #311B92">　　　</p>   | DEEP_PURPLE_900            | 深紫 (900)    | #311B92   | 49,27,146      | 251,82,57      |
| material | <p style="background-color: #B388FF">　　　</p>   | DEEP_PURPLE_A100           | 深紫 (A100)   | #B388FF   | 179,136,255    | 262,47,100     |
| material | <p style="background-color: #7C4DFF">　　　</p>   | DEEP_PURPLE_A200           | 深紫 (A200)   | #7C4DFF   | 124,77,255     | 256,70,100     |
| material | <p style="background-color: #651FFF">　　　</p>   | DEEP_PURPLE_A400           | 深紫 (A400)   | #651FFF   | 101,31,255     | 259,88,100     |
| material | <p style="background-color: #6200EA">　　　</p>   | DEEP_PURPLE_A700           | 深紫 (A700)   | #6200EA   | 98,0,234       | 265,100,92     |
| css      | <p style="background-color: #00BFFF">　　　</p>   | DEEP_SKY_BLUE              | 深天蓝         | #00BFFF   | 0,191,255      | 195,100,100    |
| css      | <p style="background-color: #696969">　　　</p>   | DIM_GRAY                   | 昏灰          | #696969   | 105,105,105    | 0,0,41         |
| css      | <p style="background-color: #696969">　　　</p>   | DIM_GREY                   | 昏灰          | #696969   | 105,105,105    | 0,0,41         |
| android  | <p style="background-color: #444444">　　　</p>   | DKGRAY                     | 暗灰          | #444444   | 68,68,68       | 0,0,27         |
| css      | <p style="background-color: #1E90FF">　　　</p>   | DODGER_BLUE                | 道奇蓝         | #1E90FF   | 30,144,255     | 210,88,100     |
| web      | <p style="background-color: #50C878">　　　</p>   | EMERALD                    | 碧绿          | #50C878   | 80,200,120     | 140,60,78      |
| css      | <p style="background-color: #B22222">　　　</p>   | FIRE_BRICK                 | 砖红          | #B22222   | 178,34,34      | 0,81,70        |
| web      | <p style="background-color: #E68AB8">　　　</p>   | FLAMINGO                   | 火鹤红         | #E68AB8   | 230,138,184    | 330,40,90      |
| css      | <p style="background-color: #FFFAF0">　　　</p>   | FLORAL_WHITE               | 花卉白         | #FFFAF0   | 255,250,240    | 40,6,100       |
| web      | <p style="background-color: #73B839">　　　</p>   | FOLIAGE_GREEN              | 叶绿          | #73B839   | 115,184,57     | 93,69,72       |
| css      | <p style="background-color: #228B22">　　　</p>   | FOREST_GREEN               | 森林绿         | #228B22   | 34,139,34      | 120,76,55      |
| web      | <p style="background-color: #99FF4D">　　　</p>   | FRESH_LEAVES               | 嫩绿          | #99FF4D   | 153,255,77     | 94,70,100      |
| android  | <p style="background-color: #FF00FF">　　　</p>   | FUCHSIA                    | 品红 / 洋红     | #FF00FF   | 255,0,255      | 300,100,100    |
| css      | <p style="background-color: #DCDCDC">　　　</p>   | GAINSBORO                  | 庚斯博罗灰       | #DCDCDC   | 220,220,220    | 0,0,86         |
| css      | <p style="background-color: #F8F8FF">　　　</p>   | GHOST_WHITE                | 幽灵白         | #F8F8FF   | 248,248,255    | 240,3,100      |
| css      | <p style="background-color: #FFD700">　　　</p>   | GOLD                       | 金           | #FFD700   | 255,215,0      | 51,100,100     |
| web      | <p style="background-color: #FFD700">　　　</p>   | GOLDEN                     | 金           | #FFD700   | 255,215,0      | 51,100,100     |
| css      | <p style="background-color: #DAA520">　　　</p>   | GOLDENROD                  | 金菊          | #DAA520   | 218,165,32     | 43,85,85       |
| web      | <p style="background-color: #99E64D">　　　</p>   | GRASS_GREEN                | 草绿          | #99E64D   | 153,230,77     | 90,67,90       |
| android  | <p style="background-color: #888888">　　　</p>   | GRAY                       | 灰           | #888888   | 136,136,136    | 0,0,53         |
| web      | <p style="background-color: #8674A1">　　　</p>   | GRAYISH_PURPLE             | 浅灰紫         | #8674A1   | 134,116,161    | 264,28,63      |
| android  | <p style="background-color: #00FF00">　　　</p>   | GREEN                      | 绿           | #00FF00   | 0,255,0        | 120,100,100    |
| material | <p style="background-color: #E8F5E9">　　　</p>   | GREEN_50                   | 绿 (50)      | #E8F5E9   | 232,245,233    | 125,5,96       |
| material | <p style="background-color: #C8E6C9">　　　</p>   | GREEN_100                  | 绿 (100)     | #C8E6C9   | 200,230,201    | 122,13,90      |
| material | <p style="background-color: #A5D6A7">　　　</p>   | GREEN_200                  | 绿 (200)     | #A5D6A7   | 165,214,167    | 122,23,84      |
| material | <p style="background-color: #81C784">　　　</p>   | GREEN_300                  | 绿 (300)     | #81C784   | 129,199,132    | 123,35,78      |
| material | <p style="background-color: #66BB6A">　　　</p>   | GREEN_400                  | 绿 (400)     | #66BB6A   | 102,187,106    | 123,45,73      |
| material | <p style="background-color: #4CAF50">　　　</p>   | GREEN_500                  | 绿 (500)     | #4CAF50   | 76,175,80      | 122,57,69      |
| material | <p style="background-color: #43A047">　　　</p>   | GREEN_600                  | 绿 (600)     | #43A047   | 67,160,71      | 123,58,63      |
| material | <p style="background-color: #388E3C">　　　</p>   | GREEN_700                  | 绿 (700)     | #388E3C   | 56,142,60      | 123,61,56      |
| material | <p style="background-color: #2E7D32">　　　</p>   | GREEN_800                  | 绿 (800)     | #2E7D32   | 46,125,50      | 123,63,49      |
| material | <p style="background-color: #1B5E20">　　　</p>   | GREEN_900                  | 绿 (900)     | #1B5E20   | 27,94,32       | 124,71,37      |
| material | <p style="background-color: #B9F6CA">　　　</p>   | GREEN_A100                 | 绿 (A100)    | #B9F6CA   | 185,246,202    | 137,25,96      |
| material | <p style="background-color: #69F0AE">　　　</p>   | GREEN_A200                 | 绿 (A200)    | #69F0AE   | 105,240,174    | 151,56,94      |
| material | <p style="background-color: #00E676">　　　</p>   | GREEN_A400                 | 绿 (A400)    | #00E676   | 0,230,118      | 151,100,90     |
| material | <p style="background-color: #00C853">　　　</p>   | GREEN_A700                 | 绿 (A700)    | #00C853   | 0,200,83       | 145,100,78     |
| css      | <p style="background-color: #ADFF2F">　　　</p>   | GREEN_YELLOW               | 绿黄          | #ADFF2F   | 173,255,47     | 84,82,100      |
| android  | <p style="background-color: #888888">　　　</p>   | GREY                       | 灰           | #888888   | 136,136,136    | 0,0,53         |
| material | <p style="background-color: #FAFAFA">　　　</p>   | GREY_50                    | 灰 (50)      | #FAFAFA   | 250,250,250    | 0,0,98         |
| material | <p style="background-color: #F5F5F5">　　　</p>   | GREY_100                   | 灰 (100)     | #F5F5F5   | 245,245,245    | 0,0,96         |
| material | <p style="background-color: #EEEEEE">　　　</p>   | GREY_200                   | 灰 (200)     | #EEEEEE   | 238,238,238    | 0,0,93         |
| material | <p style="background-color: #E0E0E0">　　　</p>   | GREY_300                   | 灰 (300)     | #E0E0E0   | 224,224,224    | 0,0,88         |
| material | <p style="background-color: #BDBDBD">　　　</p>   | GREY_400                   | 灰 (400)     | #BDBDBD   | 189,189,189    | 0,0,74         |
| material | <p style="background-color: #9E9E9E">　　　</p>   | GREY_500                   | 灰 (500)     | #9E9E9E   | 158,158,158    | 0,0,62         |
| material | <p style="background-color: #757575">　　　</p>   | GREY_600                   | 灰 (600)     | #757575   | 117,117,117    | 0,0,46         |
| material | <p style="background-color: #616161">　　　</p>   | GREY_700                   | 灰 (700)     | #616161   | 97,97,97       | 0,0,38         |
| material | <p style="background-color: #424242">　　　</p>   | GREY_800                   | 灰 (800)     | #424242   | 66,66,66       | 0,0,26         |
| material | <p style="background-color: #212121">　　　</p>   | GREY_900                   | 灰 (900)     | #212121   | 33,33,33       | 0,0,13         |
| web      | <p style="background-color: #DF73FF">　　　</p>   | HELIOTROPE                 | 缬草紫         | #DF73FF   | 223,115,255    | 286,55,100     |
| css      | <p style="background-color: #F0FFF0">　　　</p>   | HONEYDEW                   | 蜜瓜绿         | #F0FFF0   | 240,255,240    | 120,6,100      |
| web      | <p style="background-color: #FFB366">　　　</p>   | HONEY_ORANGE               | 蜜橙          | #FFB366   | 255,179,102    | 30,60,100      |
| web      | <p style="background-color: #B8DDC8">　　　</p>   | HORIZON_BLUE               | 苍           | #B8DDC8   | 184,221,200    | 146,35,100     |
| css      | <p style="background-color: #FF69B4">　　　</p>   | HOT_PINK                   | 暖粉红         | #FF69B4   | 255,105,180    | 330,59,100     |
| css      | <p style="background-color: #CD5C5C">　　　</p>   | INDIAN_RED                 | 印度红         | #CD5C5C   | 205,92,92      | 0,55,80        |
| css      | <p style="background-color: #4B0082">　　　</p>   | INDIGO                     | 靛           | #4B0082   | 75,0,130       | 	275,100,51    |
| material | <p style="background-color: #E8EAF6">　　　</p>   | INDIGO_50                  | 靛蓝 (50)     | #E8EAF6   | 232,234,246    | 231,6,96       |
| material | <p style="background-color: #C5CAE9">　　　</p>   | INDIGO_100                 | 靛蓝 (100)    | #C5CAE9   | 197,202,233    | 232,15,91      |
| material | <p style="background-color: #9FA8DA">　　　</p>   | INDIGO_200                 | 靛蓝 (200)    | #9FA8DA   | 159,168,218    | 231,27,85      |
| material | <p style="background-color: #7986CB">　　　</p>   | INDIGO_300                 | 靛蓝 (300)    | #7986CB   | 121,134,203    | 230,40,80      |
| material | <p style="background-color: #5C6BC0">　　　</p>   | INDIGO_400                 | 靛蓝 (400)    | #5C6BC0   | 92,107,192     | 231,52,75      |
| material | <p style="background-color: #3F51B5">　　　</p>   | INDIGO_500                 | 靛蓝 (500)    | #3F51B5   | 63,81,181      | 231,65,71      |
| material | <p style="background-color: #3949AB">　　　</p>   | INDIGO_600                 | 靛蓝 (600)    | #3949AB   | 57,73,171      | 232,67,67      |
| material | <p style="background-color: #303F9F">　　　</p>   | INDIGO_700                 | 靛蓝 (700)    | #303F9F   | 48,63,159      | 232,70,62      |
| material | <p style="background-color: #283593">　　　</p>   | INDIGO_800                 | 靛蓝 (800)    | #283593   | 40,53,147      | 233,73,58      |
| material | <p style="background-color: #1A237E">　　　</p>   | INDIGO_900                 | 靛蓝 (900)    | #1A237E   | 26,35,126      | 235,79,49      |
| material | <p style="background-color: #8C9EFF">　　　</p>   | INDIGO_A100                | 靛蓝 (A100)   | #8C9EFF   | 140,158,255    | 231,45,100     |
| material | <p style="background-color: #536DFE">　　　</p>   | INDIGO_A200                | 靛蓝 (A200)   | #536DFE   | 83,109,254     | 231,67,100     |
| material | <p style="background-color: #3D5AFE">　　　</p>   | INDIGO_A400                | 靛蓝 (A400)   | #3D5AFE   | 61,90,254      | 231,76,100     |
| material | <p style="background-color: #304FFE">　　　</p>   | INDIGO_A700                | 靛蓝 (A700)   | #304FFE   | 48,79,254      | 231,81,100     |
| web      | <p style="background-color: #002FA7">　　　</p>   | INTERNATIONAL_KLEIN_BLUE   | 国际奇连蓝       | #002FA7   | 0,47,167       | 223,100,65     |
| web      | <p style="background-color: #625B57">　　　</p>   | IRON_GRAY                  | 铁灰          | #625B57   | 98,91,87       | 21,12,39       |
| css      | <p style="background-color: #FFFFF0">　　　</p>   | IVORY                      | 象牙          | #FFFFF0   | 255,255,240    | 60,6,100       |
| web      | <p style="background-color: #36BF36">　　　</p>   | IVY_GREEN                  | 常春藤绿        | #36BF36   | 54,191,54      | 120,72,75      |
| web      | <p style="background-color: #E6C35C">　　　</p>   | JASMINE                    | 茉莉黄         | #E6C35C   | 230,195,92     | 45,60,90       |
| css      | <p style="background-color: #F0E68C">　　　</p>   | KHAKI                      | 卡其          | #F0E68C   | 240,230,140    | 54,42,94       |
| web      | <p style="background-color: #26619C">　　　</p>   | LAPIS_LAZULI               | 天青石蓝        | #26619C   | 38,97,156      | 210,76,61      |
| css      | <p style="background-color: #E6E6FA">　　　</p>   | LAVENDER                   | 薰衣草         | #E6E6FA   | 230,230,250    | 240,8,98       |
| web      | <p style="background-color: #CCCCFF">　　　</p>   | LAVENDER_BLUE              | 薰衣草蓝 / 长春花  | #CCCCFF   | 204,204,255    | 240,20,100     |
| css      | <p style="background-color: #FFF0F5">　　　</p>   | LAVENDER_BLUSH             | 薰衣草紫红       | #FFF0F5   | 255,240,245    | 340,6,100      |
| web      | <p style="background-color: #EE82EE">　　　</p>   | LAVENDER_MAGENTA           | 亮紫          | #EE82EE   | 238,130,238    | 300,45,93      |
| web      | <p style="background-color: #E6E6FA">　　　</p>   | LAVENDER_MIST              | 薰衣草雾        | #E6E6FA   | 230,230,250    | 240,8,98       |
| css      | <p style="background-color: #7CFC00">　　　</p>   | LAWN_GREEN                 | 草坪绿         | #7CFC00   | 124,252,0      | 90,100,99      |
| css      | <p style="background-color: #FFFACD">　　　</p>   | LEMON_CHIFFON              | 柠檬绸         | #FFFACD   | 255,250,205    | 54,20,100      |
| css      | <p style="background-color: #ADD8E6">　　　</p>   | LIGHT_BLUE                 | 亮蓝          | #ADD8E6   | 173,216,230    | 195,25,90      |
| material | <p style="background-color: #E1F5FE">　　　</p>   | LIGHT_BLUE_50              | 浅蓝 (50)     | #E1F5FE   | 225,245,254    | 199,11,100     |
| material | <p style="background-color: #B3E5FC">　　　</p>   | LIGHT_BLUE_100             | 浅蓝 (100)    | #B3E5FC   | 179,229,252    | 199,29,99      |
| material | <p style="background-color: #81D4FA">　　　</p>   | LIGHT_BLUE_200             | 浅蓝 (200)    | #81D4FA   | 129,212,250    | 199,48,98      |
| material | <p style="background-color: #4FC3F7">　　　</p>   | LIGHT_BLUE_300             | 浅蓝 (300)    | #4FC3F7   | 79,195,247     | 199,68,97      |
| material | <p style="background-color: #29B6FC">　　　</p>   | LIGHT_BLUE_400             | 浅蓝 (400)    | #29B6FC   | 41,182,252     | 200,84,99      |
| material | <p style="background-color: #03A9F4">　　　</p>   | LIGHT_BLUE_500             | 浅蓝 (500)    | #03A9F4   | 3,169,244      | 199,99,96      |
| material | <p style="background-color: #039BE5">　　　</p>   | LIGHT_BLUE_600             | 浅蓝 (600)    | #039BE5   | 3,155,229      | 200,99,90      |
| material | <p style="background-color: #0288D1">　　　</p>   | LIGHT_BLUE_700             | 浅蓝 (700)    | #0288D1   | 2,136,209      | 201,99,82      |
| material | <p style="background-color: #0277BD">　　　</p>   | LIGHT_BLUE_800             | 浅蓝 (800)    | #0277BD   | 2,119,189      | 202,99,74      |
| material | <p style="background-color: #01579B">　　　</p>   | LIGHT_BLUE_900             | 浅蓝 (900)    | #01579B   | 1,87,155       | 206,99,61      |
| material | <p style="background-color: #80D8FF">　　　</p>   | LIGHT_BLUE_A100            | 浅蓝 (A100)   | #80D8FF   | 128,216,255    | 198,50,100     |
| material | <p style="background-color: #40C4FF">　　　</p>   | LIGHT_BLUE_A200            | 浅蓝 (A200)   | #40C4FF   | 64,196,255     | 199,75,100     |
| material | <p style="background-color: #00B0FF">　　　</p>   | LIGHT_BLUE_A400            | 浅蓝 (A400)   | #00B0FF   | 0,176,255      | 199,100,100    |
| material | <p style="background-color: #0091EA">　　　</p>   | LIGHT_BLUE_A700            | 浅蓝 (A700)   | #0091EA   | 0,145,234      | 203,100,92     |
| css      | <p style="background-color: #F08080">　　　</p>   | LIGHT_CORAL                | 亮珊瑚         | #F08080   | 240,128,128    | 0,47,94        |
| css      | <p style="background-color: #E0FFFF">　　　</p>   | LIGHT_CYAN                 | 亮青          | #E0FFFF   | 224,255,255    | 180,12,100     |
| css      | <p style="background-color: #FAFAD2">　　　</p>   | LIGHT_GOLDENROD_YELLOW     | 亮金菊黄        | #FAFAD2   | 250,250,210    | 60,16,98       |
| android  | <p style="background-color: #CCCCCC">　　　</p>   | LIGHT_GRAY                 | 亮灰          | #CCCCCC   | 204,204,204    | 0,0,80         |
| css      | <p style="background-color: #90EE90">　　　</p>   | LIGHT_GREEN                | 亮绿          | #90EE90   | 144,238,144    | 120,39,93      |
| material | <p style="background-color: #F1F8E9">　　　</p>   | LIGHT_GREEN_50             | 浅绿 (50)     | #F1F8E9   | 241,248,233    | 88,6,97        |
| material | <p style="background-color: #DCEDC8">　　　</p>   | LIGHT_GREEN_100            | 浅绿 (100)    | #DCEDC8   | 220,237,200    | 88,16,93       |
| material | <p style="background-color: #C5E1A5">　　　</p>   | LIGHT_GREEN_200            | 浅绿 (200)    | #C5E1A5   | 197,225,165    | 88,27,88       |
| material | <p style="background-color: #AED581">　　　</p>   | LIGHT_GREEN_300            | 浅绿 (300)    | #AED581   | 174,213,129    | 88,39,84       |
| material | <p style="background-color: #9CCC65">　　　</p>   | LIGHT_GREEN_400            | 浅绿 (400)    | #9CCC65   | 156,204,101    | 88,50,80       |
| material | <p style="background-color: #8BC34A">　　　</p>   | LIGHT_GREEN_500            | 浅绿 (500)    | #8BC34A   | 139,195,74     | 88,62,76       |
| material | <p style="background-color: #7CB342">　　　</p>   | LIGHT_GREEN_600            | 浅绿 (600)    | #7CB342   | 124,179,66     | 89,63,70       |
| material | <p style="background-color: #689F38">　　　</p>   | LIGHT_GREEN_700            | 浅绿 (700)    | #689F38   | 104,159,56     | 92,65,62       |
| material | <p style="background-color: #558B2F">　　　</p>   | LIGHT_GREEN_800            | 浅绿 (800)    | #558B2F   | 85,139,47      | 95,66,55       |
| material | <p style="background-color: #33691E">　　　</p>   | LIGHT_GREEN_900            | 浅绿 (900)    | #33691E   | 51,105,30      | 103,71,41      |
| material | <p style="background-color: #CCFF90">　　　</p>   | LIGHT_GREEN_A100           | 浅绿 (A100)   | #CCFF90   | 204,255,144    | 88,44,100      |
| material | <p style="background-color: #B2FF59">　　　</p>   | LIGHT_GREEN_A200           | 浅绿 (A200)   | #B2FF59   | 178,255,89     | 88,65,100      |
| material | <p style="background-color: #76FF03">　　　</p>   | LIGHT_GREEN_A400           | 浅绿 (A400)   | #76FF03   | 118,255,3      | 93,99,100      |
| material | <p style="background-color: #64DD17">　　　</p>   | LIGHT_GREEN_A700           | 浅绿 (A700)   | #64DD17   | 100,221,23     | 97,90,87       |
| android  | <p style="background-color: #CCCCCC">　　　</p>   | LIGHT_GREY                 | 亮灰          | #CCCCCC   | 204,204,204    | 0,0,80         |
| web      | <p style="background-color: #F0E68C">　　　</p>   | LIGHT_KHAKI                | 亮卡其         | #F0E68C   | 240,230,140    | 54,42,94       |
| web      | <p style="background-color: #CCFF00">　　　</p>   | LIGHT_LIME                 | 柠檬绿 / 亮柠檬绿  | #CCFF00   | 204,255,0      | 72,100,100     |
| css      | <p style="background-color: #FFB6C1">　　　</p>   | LIGHT_PINK                 | 亮粉红         | #FFB6C1   | 255,182,193    | 351,29,100     |
| css      | <p style="background-color: #FFA07A">　　　</p>   | LIGHT_SALMON               | 亮鲑红         | #FFA07A   | 255,160,122    | 17,52,100      |
| css      | <p style="background-color: #20B2AA">　　　</p>   | LIGHT_SEA_GREEN            | 亮海绿         | #20B2AA   | 32,178,170     | 177,82,70      |
| css      | <p style="background-color: #87CEFA">　　　</p>   | LIGHT_SKY_BLUE             | 浅天蓝         | #87CEFA   | 135,206,250    | 203,46,98      |
| css      | <p style="background-color: #778899">　　　</p>   | LIGHT_SLATE_GRAY           | 亮岩灰         | #778899   | 119,136,153    | 210,22,60      |
| css      | <p style="background-color: #778899">　　　</p>   | LIGHT_SLATE_GREY           | 亮岩灰         | #778899   | 119,136,153    | 210,22,60      |
| css      | <p style="background-color: #B0C4DE">　　　</p>   | LIGHT_STEEL_BLUE           | 亮钢蓝         | #B0C4DE   | 176,196,222    | 214,21,87      |
| web      | <p style="background-color: #B09DB9">　　　</p>   | LIGHT_VIOLET               | 亮紫          | #B09DB9   | 176,157,185    | 281,15,73      |
| css      | <p style="background-color: #FFFFE0">　　　</p>   | LIGHT_YELLOW               | 亮黄          | #FFFFE0   | 255,255,224    | 60,12,100      |
| web      | <p style="background-color: #C8A2C8">　　　</p>   | LILAC                      | 紫丁香         | #C8A2C8   | 200,162,200    | 300,19,78      |
| android  | <p style="background-color: #00FF00">　　　</p>   | LIME                       | 绿           | #00FF00   | 0,255,0        | 120,100,100    |
| material | <p style="background-color: #F9FBE7">　　　</p>   | LIME_50                    | 绿黄 (50)     | #F9FBE7   | 249,251,231    | 66,8,98        |
| material | <p style="background-color: #F0F4C3">　　　</p>   | LIME_100                   | 绿黄 (100)    | #F0F4C3   | 240,244,195    | 65,20,96       |
| material | <p style="background-color: #E6EE9C">　　　</p>   | LIME_200                   | 绿黄 (200)    | #E6EE9C   | 230,238,156    | 66,34,93       |
| material | <p style="background-color: #DCE775">　　　</p>   | LIME_300                   | 绿黄 (300)    | #DCE775   | 220,231,117    | 66,49,91       |
| material | <p style="background-color: #D4E157">　　　</p>   | LIME_400                   | 绿黄 (400)    | #D4E157   | 212,225,87     | 66,61,88       |
| material | <p style="background-color: #CDDC39">　　　</p>   | LIME_500                   | 绿黄 (500)    | #CDDC39   | 205,220,57     | 66,74,86       |
| material | <p style="background-color: #C0CA33">　　　</p>   | LIME_600                   | 绿黄 (600)    | #C0CA33   | 192,202,51     | 64,75,79       |
| material | <p style="background-color: #A4B42B">　　　</p>   | LIME_700                   | 绿黄 (700)    | #A4B42B   | 164,180,43     | 67,76,71       |
| material | <p style="background-color: #9E9D24">　　　</p>   | LIME_800                   | 绿黄 (800)    | #9E9D24   | 158,157,36     | 60,77,62       |
| material | <p style="background-color: #827717">　　　</p>   | LIME_900                   | 绿黄 (900)    | #827717   | 130,119,23     | 54,82,51       |
| material | <p style="background-color: #F4FF81">　　　</p>   | LIME_A100                  | 绿黄 (A100)   | #F4FF81   | 244,255,129    | 65,49,100      |
| material | <p style="background-color: #EEFF41">　　　</p>   | LIME_A200                  | 绿黄 (A200)   | #EEFF41   | 238,255,65     | 65,75,100      |
| material | <p style="background-color: #C6FF00">　　　</p>   | LIME_A400                  | 绿黄 (A400)   | #C6FF00   | 198,255,0      | 73,100,100     |
| material | <p style="background-color: #AEEA00">　　　</p>   | LIME_A700                  | 绿黄 (A700)   | #AEEA00   | 174,234,0      | 75,100,92      |
| css      | <p style="background-color: #32CD32">　　　</p>   | LIME_GREEN                 | 柠檬绿         | #32CD32   | 50,205,50      | 120,76,80      |
| css      | <p style="background-color: #FAF0E6">　　　</p>   | LINEN                      | 亚麻          | #FAF0E6   | 250,240,230    | 30,8,98        |
| android  | <p style="background-color: #CCCCCC">　　　</p>   | LTGRAY                     | 亮灰          | #CCCCCC   | 204,204,204    | 0,0,80         |
| android  | <p style="background-color: #FF00FF">　　　</p>   | MAGENTA                    | 品红 / 洋红     | #FF00FF   | 255,0,255      | 300,100,100    |
| web      | <p style="background-color: #FF0DA6">　　　</p>   | MAGENTA_ROSE               | 洋玫瑰红        | #FF0DA6   | 255,13,166     | 322,95,100     |
| web      | <p style="background-color: #22C32E">　　　</p>   | MALACHITE                  | 孔雀石绿        | #22C32E   | 34,195,46      | 124,83,76      |
| web      | <p style="background-color: #D94DFF">　　　</p>   | MALLOW                     | 锦葵紫         | #D94DFF   | 217,77,255     | 287,70,100     |
| web      | <p style="background-color: #FF9900">　　　</p>   | MARIGOLD                   | 万寿菊黄        | #FF9900   | 255,153,0      | 36,100,100     |
| web      | <p style="background-color: #00477D">　　　</p>   | MARINE_BLUE                | 水手蓝         | #00477D   | 0,71,125       | 206,100,49     |
| android  | <p style="background-color: #800000">　　　</p>   | MAROON                     | 栗           | #800000   | 128,0,0        | 0,100,50       |
| web      | <p style="background-color: #E0B0FF">　　　</p>   | MAUVE                      | 木槿紫         | #E0B0FF   | 224,176,255    | 276,31,100     |
| css      | <p style="background-color: #66CDAA">　　　</p>   | MEDIUM_AQUAMARINE          | 中碧蓝         | #66CDAA   | 102,205,170    | 160,50,80      |
| css      | <p style="background-color: #0000CD">　　　</p>   | MEDIUM_BLUE                | 中蓝          | #0000CD   | 0,0,205        | 240,100,80     |
| css      | <p style="background-color: #DDA0DD">　　　</p>   | MEDIUM_LAVENDER_MAGENTA    | 梅红          | #DDA0DD   | 221,160,221    | 300,28,87      |
| css      | <p style="background-color: #BA55D3">　　　</p>   | MEDIUM_ORCHID              | 中兰紫         | #BA55D3   | 186,85,211     | 288,60,83      |
| css      | <p style="background-color: #9370DB">　　　</p>   | MEDIUM_PURPLE              | 中紫          | #9370DB   | 147,112,219    | 260,49,86      |
| css      | <p style="background-color: #3CB371">　　　</p>   | MEDIUM_SEA_GREEN           | 中海绿         | #3CB371   | 60,179,113     | 147,66,70      |
| css      | <p style="background-color: #7B68EE">　　　</p>   | MEDIUM_SLATE_BLUE          | 中岩蓝         | #7B68EE   | 123,104,238    | 249,56,93      |
| css      | <p style="background-color: #00FA9A">　　　</p>   | MEDIUM_SPRING_GREEN        | 中春绿         | #00FA9A   | 0,250,154      | 157,100,98     |
| css      | <p style="background-color: #48D1CC">　　　</p>   | MEDIUM_TURQUOISE           | 中绿松石        | #48D1CC   | 72,209,204     | 178,66,82      |
| css      | <p style="background-color: #C71585">　　　</p>   | MEDIUM_VIOLET_RED          | 中青紫红        | #C71585   | 199,21,133     | 322,89,78      |
| css      | <p style="background-color: #191970">　　　</p>   | MIDNIGHT_BLUE              | 午夜蓝         | #191970   | 25,25,112      | 240,78,44      |
| web      | <p style="background-color: #E6D933">　　　</p>   | MIMOSA                     | 含羞草黄        | #E6D933   | 230,217,51     | 56,78,90       |
| web      | <p style="background-color: #004D99">　　　</p>   | MINERAL_BLUE               | 矿蓝          | #004D99   | 0,77,153       | 210,100,60     |
| web      | <p style="background-color: #A39DAE">　　　</p>   | MINERAL_VIOLET             | 矿紫          | #A39DAE   | 163,157,174    | 261,10,68      |
| web      | <p style="background-color: #16982B">　　　</p>   | MINT                       | 薄荷绿         | #16982B   | 22,152,43      | 130,86,60      |
| css      | <p style="background-color: #F5FFFA">　　　</p>   | MINT_CREAM                 | 薄荷奶油        | #F5FFFA   | 245,255,250    | 150,4,100      |
| css      | <p style="background-color: #FFE4E1">　　　</p>   | MISTY_ROSE                 | 雾玫瑰         | #FFE4E1   | 255,228,225    | 6,12,100       |
| css      | <p style="background-color: #FFE4B5">　　　</p>   | MOCCASIN                   | 鹿皮鞋         | #FFE4B5   | 255,228,181    | 38,29,100      |
| web      | <p style="background-color: #FFFF4D">　　　</p>   | MOON_YELLOW                | 月黄          | #FFFF4D   | 255,255,77     | 60,70,100      |
| web      | <p style="background-color: #697723">　　　</p>   | MOSS_GREEN                 | 苔藓绿         | #697723   | 105,119,35     | 70,71,47       |
| web      | <p style="background-color: #CCCC4D">　　　</p>   | MUSTARD                    | 芥末黄         | #CCCC4D   | 204,204,77     | 60,62,80       |
| css      | <p style="background-color: #FFDEAD">　　　</p>   | NAVAJO_WHITE               | 那瓦霍白        | #FFDEAD   | 255,222,173    | 36,32,100      |
| android  | <p style="background-color: #000080">　　　</p>   | NAVY                       | 海军蓝 / 藏青    | #000080   | 0,0,128        | 240,100,50     |
| web      | <p style="background-color: #000080">　　　</p>   | NAVY_BLUE                  | 海军蓝 / 藏青    | #000080   | 0,0,128        | 240,100,50     |
| web      | <p style="background-color: #CC7722">　　　</p>   | OCHER                      | 赭           | #CC7722   | 204,119,34     | 30,83,80       |
| css      | <p style="background-color: #FDF5E6">　　　</p>   | OLD_LACE                   | 旧蕾丝         | #FDF5E6   | 253,245,230    | 39,9,99        |
| web      | <p style="background-color: #C08081">　　　</p>   | OLD_ROSE                   | 陈玫红         | #C08081   | 192,128,129    | 359,33,75      |
| android  | <p style="background-color: #808000">　　　</p>   | OLIVE                      | 橄榄          | #808000   | 128,128,0      | 60,100,50      |
| css      | <p style="background-color: #6B8E23">　　　</p>   | OLIVE_DRAB                 | 橄榄军服绿       | #6B8E23   | 107,142,35     | 80,75,56       |
| web      | <p style="background-color: #B784A7">　　　</p>   | OPERA_MAUVE                | 优品紫红        | #B784A7   | 183,132,167    | 319,28,72      |
| css      | <p style="background-color: #FFA500">　　　</p>   | ORANGE                     | 橙           | #FFA500   | 255,165,0      | 39,100,100     |
| material | <p style="background-color: #FFF3E0">　　　</p>   | ORANGE_50                  | 橙 (50)      | #FFF3E0   | 255,243,224    | 37,12,100      |
| material | <p style="background-color: #FFE0B2">　　　</p>   | ORANGE_100                 | 橙 (100)     | #FFE0B2   | 255,224,178    | 36,30,100      |
| material | <p style="background-color: #FFCC80">　　　</p>   | ORANGE_200                 | 橙 (200)     | #FFCC80   | 255,204,128    | 36,50,100      |
| material | <p style="background-color: #FFB74D">　　　</p>   | ORANGE_300                 | 橙 (300)     | #FFB74D   | 255,183,77     | 36,70,100      |
| material | <p style="background-color: #FFA726">　　　</p>   | ORANGE_400                 | 橙 (400)     | #FFA726   | 255,167,38     | 36,85,100      |
| material | <p style="background-color: #FF9800">　　　</p>   | ORANGE_500                 | 橙 (500)     | #FF9800   | 255,152,0      | 36,100,100     |
| material | <p style="background-color: #FB8C00">　　　</p>   | ORANGE_600                 | 橙 (600)     | #FB8C00   | 251,140,0      | 33,100,98      |
| material | <p style="background-color: #F57C00">　　　</p>   | ORANGE_700                 | 橙 (700)     | #F57C00   | 245,124,0      | 30,100,96      |
| material | <p style="background-color: #EF6C00">　　　</p>   | ORANGE_800                 | 橙 (800)     | #EF6C00   | 239,108,0      | 27,100,94      |
| material | <p style="background-color: #E65100">　　　</p>   | ORANGE_900                 | 橙 (900)     | #E65100   | 230,81,0       | 21,100,90      |
| material | <p style="background-color: #FFD180">　　　</p>   | ORANGE_A100                | 橙 (A100)    | #FFD180   | 255,209,128    | 38,50,100      |
| material | <p style="background-color: #FFAB40">　　　</p>   | ORANGE_A200                | 橙 (A200)    | #FFAB40   | 255,171,64     | 34,75,100      |
| material | <p style="background-color: #FF9100">　　　</p>   | ORANGE_A400                | 橙 (A400)    | #FF9100   | 255,145,0      | 34,100,100     |
| material | <p style="background-color: #FF6D00">　　　</p>   | ORANGE_A700                | 橙 (A700)    | #FF6D00   | 255,109,0      | 26,100,100     |
| css      | <p style="background-color: #FF4500">　　　</p>   | ORANGE_RED                 | 橙红          | #FF4500   | 255,69,0       | 16,100,100     |
| css      | <p style="background-color: #DA70D6">　　　</p>   | ORCHID                     | 兰花 / 兰紫     | #DA70D6   | 218,112,214    | 302,49,85      |
| web      | <p style="background-color: #E6CFE6">　　　</p>   | PAIL_LILAC                 | 淡紫丁香        | #E6CFE6   | 230,207,230    | 300,10,90      |
| web      | <p style="background-color: #D1EDF2">　　　</p>   | PALE_BLUE                  | 灰蓝          | #D1EDF2   | 209,237,242    | 189,14,95      |
| web      | <p style="background-color: #5E86C1">　　　</p>   | PALE_DENIM                 | 灰丁宁蓝 / 白牛仔布 | #5E86C1   | 94,134,193     | 216,51,76      |
| css      | <p style="background-color: #EEE8AA">　　　</p>   | PALE_GOLDENROD             | 灰金菊         | #EEE8AA   | 238,232,170    | 55,29,93       |
| css      | <p style="background-color: #98FB98">　　　</p>   | PALE_GREEN                 | 灰绿          | #98FB98   | 152,251,152    | 120,39,98      |
| web      | <p style="background-color: #CCB38C">　　　</p>   | PALE_OCHRE                 | 灰土          | #CCB38C   | 204,179,140    | 37,31,80       |
| css      | <p style="background-color: #AFEEEE">　　　</p>   | PALE_TURQUOISE             | 灰绿松石        | #AFEEEE   | 175,238,238    | 180,26,93      |
| css      | <p style="background-color: #DB7093">　　　</p>   | PALE_VIOLET_RED            | 灰紫红         | #DB7093   | 219,112,147    | 340,49,86      |
| web      | <p style="background-color: #7400A1">　　　</p>   | PANSY                      | 三色堇紫        | #7400A1   | 116,0,161      | 283,100,63     |
| css      | <p style="background-color: #FFEFD5">　　　</p>   | PAPAYA_WHIP                | 蕃木瓜         | #FFEFD5   | 255,239,213    | 37,16,100      |
| css      | <p style="background-color: #800080">　　　</p>   | PATRIARCH                  | 宗主教         | #800080   | 128,0,128      | 300,100,50     |
| web      | <p style="background-color: #FFE5B4">　　　</p>   | PEACH                      | 桃           | #FFE5B4   | 255,229,180    | 39,29,100      |
| web      | <p style="background-color: #FBBEA1">　　　</p>   | PEACH_PEARL                | 珍珠桃         | #FBBEA1   | 251,190,161    | 40,29,100      |
| css      | <p style="background-color: #FFDAB9">　　　</p>   | PEACH_PUFF                 | 粉扑桃         | #FFDAB9   | 255,218,185    | 28,27,100      |
| web      | <p style="background-color: #00808C">　　　</p>   | PEACOCK_BLUE               | 孔雀蓝         | #00808C   | 0,128,140      | 185,100,55     |
| web      | <p style="background-color: #00A15C">　　　</p>   | PEACOCK_GREEN              | 孔雀绿         | #00A15C   | 0,161,92       | 154,100,63     |
| web      | <p style="background-color: #FFB3E6">　　　</p>   | PEARL_PINK                 | 浅珍珠红        | #FFB3E6   | 255,179,230    | 320,30,100     |
| web      | <p style="background-color: #CCCCFF">　　　</p>   | PERIWINKLE                 | 薰衣草蓝 / 长春花  | #CCCCFF   | 204,204,255    | 240,20,100     |
| web      | <p style="background-color: #FF4D40">　　　</p>   | PERSIMMON                  | 柿子橙         | #FF4D40   | 255,77,64      | 4,75,100       |
| css      | <p style="background-color: #CD853F">　　　</p>   | PERU                       | 秘鲁          | #CD853F   | 205,133,63     | 30,69,80       |
| css      | <p style="background-color: #FFC0CB">　　　</p>   | PINK                       | 粉红          | #FFC0CB   | 255,192,203    | 350,25,100     |
| material | <p style="background-color: #FCE4EC">　　　</p>   | PINK_50                    | 粉红 (50)     | #FCE4EC   | 252,228,236    | 340,10,99      |
| material | <p style="background-color: #F8BBD0">　　　</p>   | PINK_100                   | 粉红 (100)    | #F8BBD0   | 248,187,208    | 339,25,97      |
| material | <p style="background-color: #F48FB1">　　　</p>   | PINK_200                   | 粉红 (200)    | #F48FB1   | 244,143,177    | 340,41,96      |
| material | <p style="background-color: #F06292">　　　</p>   | PINK_300                   | 粉红 (300)    | #F06292   | 240,98,146     | 340,59,94      |
| material | <p style="background-color: #EC407A">　　　</p>   | PINK_400                   | 粉红 (400)    | #EC407A   | 236,64,122     | 340,73,93      |
| material | <p style="background-color: #E91E63">　　　</p>   | PINK_500                   | 粉红 (500)    | #E91E63   | 233,30,99      | 340,87,91      |
| material | <p style="background-color: #D81B60">　　　</p>   | PINK_600                   | 粉红 (600)    | #D81B60   | 216,27,96      | 338,88,85      |
| material | <p style="background-color: #C2185B">　　　</p>   | PINK_700                   | 粉红 (700)    | #C2185B   | 194,24,91      | 336,88,76      |
| material | <p style="background-color: #AD1457">　　　</p>   | PINK_800                   | 粉红 (800)    | #AD1457   | 173,20,87      | 334,88,68      |
| material | <p style="background-color: #880E4F">　　　</p>   | PINK_900                   | 粉红 (900)    | #880E4F   | 136,14,79      | 328,90,53      |
| material | <p style="background-color: #FF80AB">　　　</p>   | PINK_A100                  | 粉红 (A100)   | #FF80AB   | 255,128,171    | 340,50,100     |
| material | <p style="background-color: #FF4081">　　　</p>   | PINK_A200                  | 粉红 (A200)   | #FF4081   | 255,64,129     | 340,75,100     |
| material | <p style="background-color: #F50057">　　　</p>   | PINK_A400                  | 粉红 (A400)   | #F50057   | 245,0,87       | 339,100,96     |
| material | <p style="background-color: #C51162">　　　</p>   | PINK_A700                  | 粉红 (A700)   | #C51162   | 197,17,98      | 333,91,77      |
| web      | <p style="background-color: #8E4585">　　　</p>   | PLUM                       | 梅红          | #8E4585   | 142,69,133     | 307,51,56      |
| css      | <p style="background-color: #B0E0E6">　　　</p>   | POWDER_BLUE                | 粉蓝          | #B0E0E6   | 176,224,230    | 187,23,90      |
| web      | <p style="background-color: #003153">　　　</p>   | PRUSSIAN_BLUE              | 普鲁士蓝        | #003153   | 0,49,83        | 205,100,43     |
| android  | <p style="background-color: #800080">　　　</p>   | PURPLE                     | 紫           | #800080   | 128,0,128      | 300,100,50     |
| material | <p style="background-color: #F3E5F5">　　　</p>   | PURPLE_50                  | 紫 (50)      | #F3E5F5   | 243,229,245    | 293,7,96       |
| material | <p style="background-color: #E1BEE7">　　　</p>   | PURPLE_100                 | 紫 (100)     | #E1BEE7   | 225,190,231    | 291,18,91      |
| material | <p style="background-color: #CE93D8">　　　</p>   | PURPLE_200                 | 紫 (200)     | #CE93D8   | 206,147,216    | 291,32,85      |
| material | <p style="background-color: #BA68C8">　　　</p>   | PURPLE_300                 | 紫 (300)     | #BA68C8   | 186,104,200    | 291,48,78      |
| material | <p style="background-color: #AB47BC">　　　</p>   | PURPLE_400                 | 紫 (400)     | #AB47BC   | 171,71,188     | 291,62,74      |
| material | <p style="background-color: #9C27B0">　　　</p>   | PURPLE_500                 | 紫 (500)     | #9C27B0   | 156,39,176     | 291,78,69      |
| material | <p style="background-color: #8E24AA">　　　</p>   | PURPLE_600                 | 紫 (600)     | #8E24AA   | 142,36,170     | 287,79,67      |
| material | <p style="background-color: #7B1FA2">　　　</p>   | PURPLE_700                 | 紫 (700)     | #7B1FA2   | 123,31,162     | 282,81,64      |
| material | <p style="background-color: #6A1B9A">　　　</p>   | PURPLE_800                 | 紫 (800)     | #6A1B9A   | 106,27,154     | 277,82,60      |
| material | <p style="background-color: #4A148C">　　　</p>   | PURPLE_900                 | 紫 (900)     | #4A148C   | 74,20,140      | 267,86,55      |
| material | <p style="background-color: #EA80FC">　　　</p>   | PURPLE_A100                | 紫 (A100)    | #EA80FC   | 234,128,252    | 291,49,99      |
| material | <p style="background-color: #E040FB">　　　</p>   | PURPLE_A200                | 紫 (A200)    | #E040FB   | 224,64,251     | 291,75,98      |
| material | <p style="background-color: #D500F9">　　　</p>   | PURPLE_A400                | 紫 (A400)    | #D500F9   | 213,0,249      | 291,100,98     |
| material | <p style="background-color: #AA00FF">　　　</p>   | PURPLE_A700                | 紫 (A700)    | #AA00FF   | 170,0,255      | 280,100,100    |
| css      | <p style="background-color: #663399">　　　</p>   | REBECCA_PURPLE             | 丽贝卡紫        | #663399   | 102,51,153     | 270,67,60      |
| android  | <p style="background-color: #FF0000">　　　</p>   | RED                        | 红           | #FF0000   | 255,0,0        | 0,100,100      |
| material | <p style="background-color: #FFEBEE">　　　</p>   | RED_50                     | 红 (50)      | #FFEBEE   | 255,235,238    | 351,8,100      |
| material | <p style="background-color: #FFCDD2">　　　</p>   | RED_100                    | 红 (100)     | #FFCDD2   | 255,205,210    | 354,20,100     |
| material | <p style="background-color: #EF9A9A">　　　</p>   | RED_200                    | 红 (200)     | #EF9A9A   | 239,154,154    | 0,36,94        |
| material | <p style="background-color: #E57373">　　　</p>   | RED_300                    | 红 (300)     | #E57373   | 229,115,115    | 0,50,90        |
| material | <p style="background-color: #EF5350">　　　</p>   | RED_400                    | 红 (400)     | #EF5350   | 239,83,80      | 1,67,94        |
| material | <p style="background-color: #F44336">　　　</p>   | RED_500                    | 红 (500)     | #F44336   | 244,67,54      | 4,78,96        |
| material | <p style="background-color: #E53935">　　　</p>   | RED_600                    | 红 (600)     | #E53935   | 229,57,53      | 1,77,90        |
| material | <p style="background-color: #D32F2F">　　　</p>   | RED_700                    | 红 (700)     | #D32F2F   | 211,47,47      | 0,78,83        |
| material | <p style="background-color: #C62828">　　　</p>   | RED_800                    | 红 (800)     | #C62828   | 198,40,40      | 0,80,78        |
| material | <p style="background-color: #B71C1C">　　　</p>   | RED_900                    | 红 (900)     | #B71C1C   | 183,28,28      | 0,85,72        |
| material | <p style="background-color: #FF8A80">　　　</p>   | RED_A100                   | 红 (A100)    | #FF8A80   | 255,138,128    | 5,50,100       |
| material | <p style="background-color: #FF5252">　　　</p>   | RED_A200                   | 红 (A200)    | #FF5252   | 255,82,82      | 0,68,100       |
| material | <p style="background-color: #FF1744">　　　</p>   | RED_A400                   | 红 (A400)    | #FF1744   | 255,23,68      | 348,91,100     |
| material | <p style="background-color: #D50000">　　　</p>   | RED_A700                   | 红 (A700)    | #D50000   | 213,0,0        | 0,100,84       |
| web      | <p style="background-color: #FF007F">　　　</p>   | ROSE                       | 玫瑰红         | #FF007F   | 255,0,127      | 330,100,100    |
| web      | <p style="background-color: #FF66CC">　　　</p>   | ROSE_PINK                  | 浅玫瑰红        | #FF66CC   | 255,102,204    | 320,60,100     |
| css      | <p style="background-color: #BC8F8F">　　　</p>   | ROSY_BROWN                 | 玫瑰褐         | #BC8F8F   | 188,143,143    | 0,24,74        |
| css      | <p style="background-color: #4169E1">　　　</p>   | ROYAL_BLUE                 | 品蓝 / 皇室蓝    | #4169E1   | 65,105,225     | 225,71,88      |
| web      | <p style="background-color: #CC0080">　　　</p>   | RUBY                       | 红宝石         | #CC0080   | 204,0,128      | 322,100,80     |
| css      | <p style="background-color: #8B4513">　　　</p>   | SADDLE_BROWN               | 鞍褐          | #8B4513   | 139,69,19      | 25,86,55       |
| css      | <p style="background-color: #FA8072">　　　</p>   | SALMON                     | 鲑红          | #FA8072   | 250,128,114    | 6,54,98        |
| web      | <p style="background-color: #FF8099">　　　</p>   | SALMON_PINK                | 浅鲑红         | #FF8099   | 255,128,153    | 348,50,100     |
| web      | <p style="background-color: #4D80E6">　　　</p>   | SALVIA_BLUE                | 鼠尾草蓝        | #4D80E6   | 77,128,230     | 220,67,90      |
| web      | <p style="background-color: #E6C3C3">　　　</p>   | SAND_BEIGE                 | 沙棕          | #E6C3C3   | 230,195,195    | 0,15,90        |
| css      | <p style="background-color: #F4A460">　　　</p>   | SAND_BROWN                 | 沙褐          | #F4A460   | 244,164,96     | 28,61,96       |
| web      | <p style="background-color: #082567">　　　</p>   | SAPPHIRE                   | 蓝宝石 / 青玉    | #082567   | 8,37,103       | 222,92,40      |
| web      | <p style="background-color: #4798B3">　　　</p>   | SAXE_BLUE                  | 萨克斯蓝        | #4798B3   | 71,152,179     | 195,60,70      |
| web      | <p style="background-color: #FF2400">　　　</p>   | SCARLET                    | 猩红 / 腥红     | #FF2400   | 255,36,0       | 8,100,100      |
| css      | <p style="background-color: #FFF5EE">　　　</p>   | SEASHELL                   | 海贝          | #FFF5EE   | 255,245,238    | 25,7,100       |
| css      | <p style="background-color: #2E8B57">　　　</p>   | SEA_GREEN                  | 海绿          | #2E8B57   | 46,139,87      | 146,67,55      |
| web      | <p style="background-color: #704214">　　　</p>   | SEPIA                      | 深褐 / 乌贼墨    | #704214   | 112,66,20      | 30,82,44       |
| web      | <p style="background-color: #FFB3BF">　　　</p>   | SHELL_PINK                 | 壳黄红         | #FFB3BF   | 255,179,191    | 351,30,100     |
| css      | <p style="background-color: #A0522D">　　　</p>   | SIENNA                     | 赭黄          | #A0522D   | 160,82,45      | 19,72,63       |
| android  | <p style="background-color: #C0C0C0">　　　</p>   | SILVER                     | 银           | #C0C0C0   | 192,192,192    | 0,0,75         |
| css      | <p style="background-color: #87CEEB">　　　</p>   | SKY_BLUE                   | 天空蓝         | #87CEEB   | 135,206,235    | 197,43,92      |
| css      | <p style="background-color: #6A5ACD">　　　</p>   | SLATE_BLUE                 | 岩蓝          | #6A5ACD   | 106,90,205     | 248,56,80      |
| css      | <p style="background-color: #708090">　　　</p>   | SLATE_GRAY                 | 岩灰          | #708090   | 112,128,144    | 210,22,56      |
| css      | <p style="background-color: #708090">　　　</p>   | SLATE_GREY                 | 岩灰          | #708090   | 112,128,144    | 210,22,56      |
| css      | <p style="background-color: #FFFAFA">　　　</p>   | SNOW                       | 雪           | #FFFAFA   | 255,250,250    | 0,2,100        |
| web      | <p style="background-color: #FF73B3">　　　</p>   | SPINEL_RED                 | 尖晶石红        | #FF73B3   | 255,115,179    | 333,55,100     |
| css      | <p style="background-color: #00FF7F">　　　</p>   | SPRING_GREEN               | 春绿          | #00FF7F   | 0,255,127      | 150,100,100    |
| css      | <p style="background-color: #4682B4">　　　</p>   | STEEL_BLUE                 | 钢青          | #4682B4   | 70,130,180     | 207,61,71      |
| web      | <p style="background-color: #006374">　　　</p>   | STRONG_BLUE                | 浓蓝          | #006374   | 0,99,116       | 189,100,45     |
| web      | <p style="background-color: #E60000">　　　</p>   | STRONG_RED                 | 鲜红          | #E60000   | 230,0,0        | 0,100,90       |
| web      | <p style="background-color: #FF7300">　　　</p>   | SUN_ORANGE                 | 阳橙          | #FF7300   | 255,115,0      | 27,100,100     |
| css      | <p style="background-color: #D2B48C">　　　</p>   | TAN                        | 日晒          | #D2B48C   | 210,180,140    | 34,33,82       |
| web      | <p style="background-color: #F28500">　　　</p>   | TANGERINE                  | 橘           | #F28500   | 242,133,0      | 33,100,95      |
| web      | <p style="background-color: #FFCC00">　　　</p>   | TANGERINE_YELLOW           | 橙黄          | #FFCC00   | 255,204,0      | 48,100,100     |
| android  | <p style="background-color: #008080">　　　</p>   | TEAL                       | 鸭绿 / 凫绿     | #008080   | 0,128,128      | 180,100,50     |
| material | <p style="background-color: #E0F2F1">　　　</p>   | TEAL_50                    | 蓝绿 (50)     | #E0F2F1   | 224,242,241    | 177,7,95       |
| material | <p style="background-color: #B2DFDB">　　　</p>   | TEAL_100                   | 蓝绿 (100)    | #B2DFDB   | 178,223,219    | 175,20,87      |
| material | <p style="background-color: #80CBC4">　　　</p>   | TEAL_200                   | 蓝绿 (200)    | #80CBC4   | 128,203,196    | 174,37,80      |
| material | <p style="background-color: #4DB6AC">　　　</p>   | TEAL_300                   | 蓝绿 (300)    | #4DB6AC   | 77,182,172     | 174,58,71      |
| material | <p style="background-color: #26A69A">　　　</p>   | TEAL_400                   | 蓝绿 (400)    | #26A69A   | 38,166,154     | 174,77,65      |
| material | <p style="background-color: #009688">　　　</p>   | TEAL_500                   | 蓝绿 (500)    | #009688   | 0,150,136      | 174,100,59     |
| material | <p style="background-color: #00897B">　　　</p>   | TEAL_600                   | 蓝绿 (600)    | #00897B   | 0,137,123      | 174,100,54     |
| material | <p style="background-color: #00796B">　　　</p>   | TEAL_700                   | 蓝绿 (700)    | #00796B   | 0,121,107      | 173,100,47     |
| material | <p style="background-color: #00695C">　　　</p>   | TEAL_800                   | 蓝绿 (800)    | #00695C   | 0,105,92       | 173,100,41     |
| material | <p style="background-color: #004D40">　　　</p>   | TEAL_900                   | 蓝绿 (900)    | #004D40   | 0,77,64        | 170,100,30     |
| material | <p style="background-color: #A7FFEB">　　　</p>   | TEAL_A100                  | 蓝绿 (A100)   | #A7FFEB   | 167,255,235    | 166,35,100     |
| material | <p style="background-color: #64FFDA">　　　</p>   | TEAL_A200                  | 蓝绿 (A200)   | #64FFDA   | 100,255,218    | 166,61,100     |
| material | <p style="background-color: #1DE9B6">　　　</p>   | TEAL_A400                  | 蓝绿 (A400)   | #1DE9B6   | 29,233,182     | 165,88,91      |
| material | <p style="background-color: #00BFA5">　　　</p>   | TEAL_A700                  | 蓝绿 (A700)   | #00BFA5   | 0,191,165      | 172,100,75     |
| css      | <p style="background-color: #D8BFD8">　　　</p>   | THISTLE                    | 蓟紫          | #D8BFD8   | 216,191,216    | 300,12,85      |
| css      | <p style="background-color: #FF6347">　　　</p>   | TOMATO                     | 蕃茄红         | #FF6347   | 255,99,71      | 9,72,100       |
| android  | <p style="background-color: #00000000">　　　</p> | TRANSPARENT                | 透明          | #00000000 | 0,0,0,0 (RGBA) | 0,0,0,0 (HSVA) |
| web      | <p style="background-color: #FF8033">　　　</p>   | TROPICAL_ORANGE            | 热带橙         | #FF8033   | 255,128,51     | 23,80,100      |
| css      | <p style="background-color: #40E0D0">　　　</p>   | TURQUOISE                  | 绿松          | #40E0D0   | 64,224,208     | 174,71,88      |
| web      | <p style="background-color: #00FFEF">　　　</p>   | TURQUOISE_BLUE             | 土耳其蓝        | #00FFEF   | 0,255,239      | 176,100,100    |
| web      | <p style="background-color: #4DE680">　　　</p>   | TURQUOISE_GREEN            | 绿松石绿        | #4DE680   | 77,230,128     | 140,67,90      |
| web      | <p style="background-color: #0033FF">　　　</p>   | ULTRAMARINE                | 极浓海蓝        | #0033FF   | 0,51,255       | 228,100,100    |
| web      | <p style="background-color: #E34234">　　　</p>   | VERMILION                  | 朱红          | #E34234   | 227,66,52      | 5,77,89        |
| web      | <p style="background-color: #73E68C">　　　</p>   | VERY_LIGHT_MALACHITE_GREEN | 孔雀石绿        | #73E68C   | 115,230,140    | 133,50,90      |
| css      | <p style="background-color: #EE82EE">　　　</p>   | VIOLET                     | 紫罗兰         | #EE82EE   | 238,130,238    | 300,45,93      |
| web      | <p style="background-color: #127436">　　　</p>   | VIRIDIAN                   | 铬绿          | #127436   | 18,116,54      | 142,84,45      |
| web      | <p style="background-color: #5686BF">　　　</p>   | WEDGWOOD_BLUE              | 韦奇伍德瓷蓝      | #5686BF   | 86,134,191     | 213,55,75      |
| css      | <p style="background-color: #F5DEB3">　　　</p>   | WHEAT                      | 小麦          | #F5DEB3   | 245,222,179    | 39,27,96       |
| android  | <p style="background-color: #FFFFFF">　　　</p>   | WHITE                      | 白           | #FFFFFF   | 255,255,255    | 0,0,100        |
| material | <p style="background-color: #FFFFFF">　　　</p>   | WHITE_1000                 | 白           | #FFFFFF   | 255,255,255    | 0,0,100        |
| css      | <p style="background-color: #F5F5F5">　　　</p>   | WHITE_SMOKE                | 白烟          | #F5F5F5   | 245,245,245    | 0,0,96         |
| web      | <p style="background-color: #C9A0DC">　　　</p>   | WISTERIA                   | 紫藤          | #C9A0DC   | 201,160,220    | 281,27,86      |
| android  | <p style="background-color: #FFFF00">　　　</p>   | YELLOW                     | 黄           | #FFFF00   | 255,255,0      | 60,100,100     |
| material | <p style="background-color: #FFFDE7">　　　</p>   | YELLOW_50                  | 黄 (50)      | #FFFDE7   | 255,253,231    | 55,9,100       |
| material | <p style="background-color: #FFF9C4">　　　</p>   | YELLOW_100                 | 黄 (100)     | #FFF9C4   | 255,249,196    | 54,23,100      |
| material | <p style="background-color: #FFF590">　　　</p>   | YELLOW_200                 | 黄 (200)     | #FFF590   | 255,245,144    | 55,44,100      |
| material | <p style="background-color: #FFF176">　　　</p>   | YELLOW_300                 | 黄 (300)     | #FFF176   | 255,241,118    | 54,54,100      |
| material | <p style="background-color: #FFEE58">　　　</p>   | YELLOW_400                 | 黄 (400)     | #FFEE58   | 255,238,88     | 54,65,100      |
| material | <p style="background-color: #FFEB3B">　　　</p>   | YELLOW_500                 | 黄 (500)     | #FFEB3B   | 255,235,59     | 54,77,100      |
| material | <p style="background-color: #FDD835">　　　</p>   | YELLOW_600                 | 黄 (600)     | #FDD835   | 253,216,53     | 49,79,99       |
| material | <p style="background-color: #FBC02D">　　　</p>   | YELLOW_700                 | 黄 (700)     | #FBC02D   | 251,192,45     | 43,82,98       |
| material | <p style="background-color: #F9A825">　　　</p>   | YELLOW_800                 | 黄 (800)     | #F9A825   | 249,168,37     | 37,85,98       |
| material | <p style="background-color: #F57F17">　　　</p>   | YELLOW_900                 | 黄 (900)     | #F57F17   | 245,127,23     | 28,91,96       |
| material | <p style="background-color: #FFFF82">　　　</p>   | YELLOW_A100                | 黄 (A100)    | #FFFF82   | 255,255,130    | 60,49,100      |
| material | <p style="background-color: #FFFF00">　　　</p>   | YELLOW_A200                | 黄 (A200)    | #FFFF00   | 255,255,0      | 60,100,100     |
| material | <p style="background-color: #FFEA00">　　　</p>   | YELLOW_A400                | 黄 (A400)    | #FFEA00   | 255,234,0      | 55,100,100     |
| material | <p style="background-color: #FFD600">　　　</p>   | YELLOW_A700                | 黄 (A700)    | #FFD600   | 255,214,0      | 50,100,100     |
| css      | <p style="background-color: #9ACD32">　　　</p>   | YELLOW_GREEN               | 黄绿          | #9ACD32   | 154,205,50     | 80,76,80       |

融合列表中的所有颜色项, 均支持 `colors.NAME` 或 `'NAME'` 这样的颜色名称访问方式:

```js
/* 红色, 获取其 RGB 分量数组. */
colors.toRgb(colors.RED);
colors.toRgb('RED');

/* 咖啡色, 获取其颜色整数. */
colors.toInt(colors.COFFEE);
colors.toInt('COFFEE');

/* Material 700 号琥铂色, 获取其 Hex 代码. */
colors.toHex(colors.AMBER_700);
colors.toHex('AMBER_700');
```