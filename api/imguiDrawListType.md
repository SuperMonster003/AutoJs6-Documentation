# ImGui 绘制列表 (ImguiDrawList)

<!-- runtime-support:begin ImguiDrawList# -->
<!-- 本段由 generator/runtime-support.js 根据 AutoJs6 运行时覆盖矩阵生成, 不要手动修改; 数据源 ksp -->

| 运行时支持 | Rhino | Node.js 主线程 | Node.js Worker | Bun |
| --- | --- | --- | --- | --- |
| 入口 | `ImguiDrawList` 对象 | - | - | - |
| 状态 | 已支持 71 项 | 不适用 71 项 (仅限 Rhino 引擎), 等价写法: `engines.execScript of a Rhino script that opens the window, events.broadcast between the scripts` | 不适用 71 项 (仅限 Rhino 引擎), 等价写法: `engines.execScript of a Rhino script that opens the window, events.broadcast between the scripts` | 不适用 71 项 (仅限 Rhino 引擎), 等价写法: `engines.execScript of a Rhino script that opens the window, events.broadcast between the scripts` |

各 API 在同一运行时中的入口, 状态与授权一致, 没有差异项.

Node.js 与 Bun 的导入方式, 异步返回值与授权检查见 [运行时 API](runtimeApis#执行方式).

<!-- runtime-support:end -->

ImguiDrawList 在帧内自由绘制, 由 [getWindowDrawList](imgui#m-getwindowdrawlist), [getForegroundDrawList](imgui#m-getforegrounddrawlist) 与 [getBackgroundDrawList](imgui#m-getbackgrounddrawlist) 返回, 只能在帧内使用. 坐标, 线宽和尺寸的单位是 px, 方法返回绘制列表本身, 可以链式调用. 类型声明中的名称是 `ImGui.DrawList`.

每个绘制方法另有 PascalCase 别名, 例如 `drawList.AddLine` 与 [addLine](#m-addline) 相同.

点的写法见 [Point](imgui#point), 颜色的写法见 [Color](imgui#color). 折线和多边形每次最多 4096 个点, 大的路径分成多次绘制.

```js
imgui.createWindow(function (ui) {
    ui.withWindow('绘制', null, 0, function () {
        let draw = ui.getWindowDrawList();
        let origin = ui.getWindowPos();
        let x = origin[0];
        let y = origin[1];
        draw.addRectFilled([x + 20, y + 60], [x + 180, y + 140], '#335C8A', 8)
            .addCircle([x + 100, y + 100], 30, '#FFFFFF', 0, 2)
            .addText([x + 30, y + 150], '#FFC107', 'DrawList');
        draw.pathClear()
            .pathLineTo([x + 200, y + 60])
            .pathLineTo([x + 260, y + 140])
            .pathLineTo([x + 200, y + 140])
            .pathStroke('#66BB6A', 2, ui.DrawFlags.Closed);
    });
}, { width: 320, height: 240 });
```

## DrawTextOptions

[addText](#m-addtext) 的选项.

| 选项 | 类型 | 说明 |
| --- | --- | --- |
| `font` | [number](dataTypes#number) 或 [string](dataTypes#string) | [Fonts](imgui#p-fonts) 的值, 或 `fonts` 选项里的字体名. |
| `size` | [number](dataTypes#number) | 字体大小, 单位 px, 默认为当前大小. |
| `wrapWidth` | [number](dataTypes#number) | 换行宽度, 单位 px, 默认不换行. |

## DrawPolylineOptions

[addPolyline](#m-addpolyline) 的选项.

| 选项 | 类型 | 说明 |
| --- | --- | --- |
| `thickness` | [number](dataTypes#number) | 线宽, 默认 1. |
| `closed` | [boolean](dataTypes#boolean) 或 [number](dataTypes#number) | 是否连接最后一点和第一点. |
| `flags` | [number](dataTypes#number) | [DrawFlags](imgui#p-drawflags) 的组合. |

## DrawImageOptions

[addImage](#m-addimage) 的选项.

| 选项 | 类型 | 说明 |
| --- | --- | --- |
| `uv0` | [Point](imgui#point) | 左上角的纹理坐标, `0..1`. |
| `uv1` | [Point](imgui#point) | 右下角的纹理坐标, `0..1`. |
| `tint` | [Color](imgui#color) | 与图像相乘的颜色. |

## DrawImageQuadOptions

[addImageQuad](#m-addimagequad) 的选项, 依次是四个角的纹理坐标.

| 选项 | 类型 | 说明 |
| --- | --- | --- |
| `uv1` | [Point](imgui#point) | 第一个角的纹理坐标, `0..1`. |
| `uv2` | [Point](imgui#point) | 第二个角的纹理坐标. |
| `uv3` | [Point](imgui#point) | 第三个角的纹理坐标. |
| `uv4` | [Point](imgui#point) | 第四个角的纹理坐标. |
| `tint` | [Color](imgui#color) | 与图像相乘的颜色. |

## DrawImageRoundedOptions

[addImageRounded](#m-addimagerounded) 的选项, 另外读取 [DrawImageOptions](#drawimageoptions).

| 选项 | 类型 | 说明 |
| --- | --- | --- |
| `flags` | [number](dataTypes#number) | 哪些角是圆角: `DrawFlags.RoundCorners*`, 默认全部. |

<p style="font: bold 2em sans-serif; color: #FF7043">ImguiDrawList</p>

## [p#] layer

**`READONLY`**

- { [number](dataTypes#number) }

[DrawListLayer](imgui#p-drawlistlayer) 的值.

## [m#] addLine

### drawList.addLine(first, second, color, thickness?)

- **first** { [Point](imgui#point) } - 第一个点, 单位 px.
- **second** { [Point](imgui#point) } - 第二个点, 单位 px.
- **color** { [Color](imgui#color) } - 颜色.
- **[ thickness ]** { [number](dataTypes#number) } - 线宽, 单位 px, 默认 1.
- <ins>**returns**</ins> { [ImguiDrawList](imguiDrawListType) }

绘制线段.

## [m#] addRect

### drawList.addRect(minimum, maximum, color, rounding?, thickness?, flags?)

- **minimum** { [Point](imgui#point) } - 左上角, 单位 px.
- **maximum** { [Point](imgui#point) } - 右下角, 单位 px.
- **color** { [Color](imgui#color) } - 颜色.
- **[ rounding ]** { [number](dataTypes#number) } - 圆角半径, 单位 px.
- **[ thickness ]** { [number](dataTypes#number) } - 线宽, 单位 px, 默认 1.
- **[ flags ]** { [number](dataTypes#number) } - [DrawFlags](imgui#p-drawflags) 的组合.
- <ins>**returns**</ins> { [ImguiDrawList](imguiDrawListType) }

绘制矩形边框.

## [m#] addRectFilled

### drawList.addRectFilled(minimum, maximum, color, rounding?, flags?)

- **minimum** { [Point](imgui#point) } - 左上角, 单位 px.
- **maximum** { [Point](imgui#point) } - 右下角, 单位 px.
- **color** { [Color](imgui#color) } - 颜色.
- **[ rounding ]** { [number](dataTypes#number) } - 圆角半径, 单位 px.
- **[ flags ]** { [number](dataTypes#number) } - [DrawFlags](imgui#p-drawflags) 的组合.
- <ins>**returns**</ins> { [ImguiDrawList](imguiDrawListType) }

绘制填充矩形.

## [m#] addCircle

### drawList.addCircle(center, radius, color, segments?, thickness?)

- **center** { [Point](imgui#point) } - 中心, 单位 px.
- **radius** { [number](dataTypes#number) } - 半径, 单位 px.
- **color** { [Color](imgui#color) } - 颜色.
- **[ segments ]** { [number](dataTypes#number) } - 分段数, `0` 时按半径自动选择.
- **[ thickness ]** { [number](dataTypes#number) } - 线宽, 单位 px, 默认 1.
- <ins>**returns**</ins> { [ImguiDrawList](imguiDrawListType) }

绘制圆形边框.

## [m#] addCircleFilled

### drawList.addCircleFilled(center, radius, color, segments?)

- **center** { [Point](imgui#point) } - 中心, 单位 px.
- **radius** { [number](dataTypes#number) } - 半径, 单位 px.
- **color** { [Color](imgui#color) } - 颜色.
- **[ segments ]** { [number](dataTypes#number) } - 分段数, `0` 时按半径自动选择.
- <ins>**returns**</ins> { [ImguiDrawList](imguiDrawListType) }

绘制填充圆.

## [m#] addTriangle

### drawList.addTriangle(first, second, third, color, thickness?)

- **first** { [Point](imgui#point) } - 第一个点, 单位 px.
- **second** { [Point](imgui#point) } - 第二个点, 单位 px.
- **third** { [Point](imgui#point) } - 第三个点, 单位 px.
- **color** { [Color](imgui#color) } - 颜色.
- **[ thickness ]** { [number](dataTypes#number) } - 线宽, 单位 px, 默认 1.
- <ins>**returns**</ins> { [ImguiDrawList](imguiDrawListType) }

绘制三角形边框.

## [m#] addTriangleFilled

### drawList.addTriangleFilled(first, second, third, color)

- **first** { [Point](imgui#point) } - 第一个点, 单位 px.
- **second** { [Point](imgui#point) } - 第二个点, 单位 px.
- **third** { [Point](imgui#point) } - 第三个点, 单位 px.
- **color** { [Color](imgui#color) } - 颜色.
- <ins>**returns**</ins> { [ImguiDrawList](imguiDrawListType) }

绘制填充三角形.

## [m#] addText

### drawList.addText(position, color, text, options?)

- **position** { [Point](imgui#point) } - 位置, 单位 px.
- **color** { [Color](imgui#color) } - 颜色.
- **text** { [any](dataTypes#any) } - 文本, 用 `String()` 转换.
- **[ options ]** { [DrawTextOptions](imguiDrawListType#drawtextoptions) } - 选项, 参阅 [DrawTextOptions](#drawtextoptions).
- <ins>**returns**</ins> { [ImguiDrawList](imguiDrawListType) }

在某个位置绘制文本, 不移动布局光标.

## [m#] addPolyline

### drawList.addPolyline(points, color, thickness?, closed?)

- **points** { [Point](imgui#point)[] } - 点的数组.
- **color** { [Color](imgui#color) } - 颜色.
- **[ thickness ]** { [number](dataTypes#number) | [DrawPolylineOptions](imguiDrawListType#drawpolylineoptions) } - 线宽, 也可以传 [DrawPolylineOptions](#drawpolylineoptions).
- **[ closed ]** { [boolean](dataTypes#boolean) | [number](dataTypes#number) } - 是否连接最后一点和第一点.
- <ins>**returns**</ins> { [ImguiDrawList](imguiDrawListType) }

绘制经过最多 4096 个点的折线.

## [m#] addBezierCubic

### drawList.addBezierCubic(first, second, third, fourth, color, thickness?, segments?)

- **first** { [Point](imgui#point) } - 第一个点, 单位 px.
- **second** { [Point](imgui#point) } - 第二个点, 单位 px.
- **third** { [Point](imgui#point) } - 第三个点, 单位 px.
- **fourth** { [Point](imgui#point) } - 第四个点, 单位 px.
- **color** { [Color](imgui#color) } - 颜色.
- **[ thickness ]** { [number](dataTypes#number) } - 线宽, 单位 px, 默认 1.
- **[ segments ]** { [number](dataTypes#number) } - 分段数, `0` 时按半径自动选择.
- <ins>**returns**</ins> { [ImguiDrawList](imguiDrawListType) }

绘制三次贝塞尔曲线.

## [m#] addBezierQuadratic

### drawList.addBezierQuadratic(first, second, third, color, thickness?, segments?)

- **first** { [Point](imgui#point) } - 第一个点, 单位 px.
- **second** { [Point](imgui#point) } - 第二个点, 单位 px.
- **third** { [Point](imgui#point) } - 第三个点, 单位 px.
- **color** { [Color](imgui#color) } - 颜色.
- **[ thickness ]** { [number](dataTypes#number) } - 线宽, 单位 px, 默认 1.
- **[ segments ]** { [number](dataTypes#number) } - 分段数, `0` 时按半径自动选择.
- <ins>**returns**</ins> { [ImguiDrawList](imguiDrawListType) }

绘制二次贝塞尔曲线.

## [m#] addQuad

### drawList.addQuad(first, second, third, fourth, color, thickness?)

- **first** { [Point](imgui#point) } - 第一个点, 单位 px.
- **second** { [Point](imgui#point) } - 第二个点, 单位 px.
- **third** { [Point](imgui#point) } - 第三个点, 单位 px.
- **fourth** { [Point](imgui#point) } - 第四个点, 单位 px.
- **color** { [Color](imgui#color) } - 颜色.
- **[ thickness ]** { [number](dataTypes#number) } - 线宽, 单位 px, 默认 1.
- <ins>**returns**</ins> { [ImguiDrawList](imguiDrawListType) }

绘制四边形边框.

## [m#] addQuadFilled

### drawList.addQuadFilled(first, second, third, fourth, color)

- **first** { [Point](imgui#point) } - 第一个点, 单位 px.
- **second** { [Point](imgui#point) } - 第二个点, 单位 px.
- **third** { [Point](imgui#point) } - 第三个点, 单位 px.
- **fourth** { [Point](imgui#point) } - 第四个点, 单位 px.
- **color** { [Color](imgui#color) } - 颜色.
- <ins>**returns**</ins> { [ImguiDrawList](imguiDrawListType) }

绘制填充四边形.

## [m#] addNgon

### drawList.addNgon(center, radius, color, segments, thickness?)

- **center** { [Point](imgui#point) } - 中心, 单位 px.
- **radius** { [number](dataTypes#number) } - 半径, 单位 px.
- **color** { [Color](imgui#color) } - 颜色.
- **segments** { [number](dataTypes#number) } - 边数, `3..512`.
- **[ thickness ]** { [number](dataTypes#number) } - 线宽, 单位 px, 默认 1.
- <ins>**returns**</ins> { [ImguiDrawList](imguiDrawListType) }

绘制正多边形边框.

## [m#] addNgonFilled

### drawList.addNgonFilled(center, radius, color, segments)

- **center** { [Point](imgui#point) } - 中心, 单位 px.
- **radius** { [number](dataTypes#number) } - 半径, 单位 px.
- **color** { [Color](imgui#color) } - 颜色.
- **segments** { [number](dataTypes#number) } - 边数, `3..512`.
- <ins>**returns**</ins> { [ImguiDrawList](imguiDrawListType) }

绘制填充正多边形.

## [m#] addEllipse

### drawList.addEllipse(center, radius, color, rotation?, segments?, thickness?)

- **center** { [Point](imgui#point) } - 中心, 单位 px.
- **radius** { [Point](imgui#point) } - 两个轴的半径, 单位 px.
- **color** { [Color](imgui#color) } - 颜色.
- **[ rotation ]** { [number](dataTypes#number) } - 旋转角度, 单位弧度.
- **[ segments ]** { [number](dataTypes#number) } - 分段数, `0..512`, `0` 时按半径自动选择.
- **[ thickness ]** { [number](dataTypes#number) } - 线宽, 单位 px, 默认 1.
- <ins>**returns**</ins> { [ImguiDrawList](imguiDrawListType) }

绘制椭圆边框.

## [m#] addEllipseFilled

### drawList.addEllipseFilled(center, radius, color, rotation?, segments?)

- **center** { [Point](imgui#point) } - 中心, 单位 px.
- **radius** { [Point](imgui#point) } - 两个轴的半径, 单位 px.
- **color** { [Color](imgui#color) } - 颜色.
- **[ rotation ]** { [number](dataTypes#number) } - 旋转角度, 单位弧度.
- **[ segments ]** { [number](dataTypes#number) } - 分段数, `0..512`, `0` 时按半径自动选择.
- <ins>**returns**</ins> { [ImguiDrawList](imguiDrawListType) }

绘制填充椭圆, 参阅 [addEllipse](#m-addellipse).

## [m#] addRectFilledMultiColor

### drawList.addRectFilledMultiColor(minimum, maximum, colorUpperLeft, colorUpperRight, colorBottomRight, colorBottomLeft)

- **minimum** { [Point](imgui#point) } - 左上角, 单位 px.
- **maximum** { [Point](imgui#point) } - 右下角, 单位 px.
- **colorUpperLeft** { [Color](imgui#color) } - 左上角的颜色.
- **colorUpperRight** { [Color](imgui#color) } - 右上角的颜色.
- **colorBottomRight** { [Color](imgui#color) } - 右下角的颜色.
- **colorBottomLeft** { [Color](imgui#color) } - 左下角的颜色.
- <ins>**returns**</ins> { [ImguiDrawList](imguiDrawListType) }

绘制四角各一种颜色的矩形, 颜色在角之间混合.

## [m#] addConvexPolyFilled

### drawList.addConvexPolyFilled(points, color)

- **points** { [Point](imgui#point)[] } - 3 到 4096 个点, 顺时针排列时有抗锯齿.
- **color** { [Color](imgui#color) } - 颜色.
- <ins>**returns**</ins> { [ImguiDrawList](imguiDrawListType) }

绘制填充凸多边形.

## [m#] addConcavePolyFilled

### drawList.addConcavePolyFilled(points, color)

- **points** { [Point](imgui#point)[] } - 3 到 4096 个点.
- **color** { [Color](imgui#color) } - 颜色.
- <ins>**returns**</ins> { [ImguiDrawList](imguiDrawListType) }

绘制填充简单多边形, 比 [addConvexPolyFilled](#m-addconvexpolyfilled) 慢.

## [m#] addImage

### drawList.addImage(texture, minimum, maximum, options?)

- **texture** { [ImguiTexture](imguiTextureType) } - 由 [createTexture](imgui#m-createtexture) 创建的纹理.
- **minimum** { [Point](imgui#point) } - 左上角, 单位 px.
- **maximum** { [Point](imgui#point) } - 右下角, 单位 px.
- **[ options ]** { [DrawImageOptions](imguiDrawListType#drawimageoptions) } - 选项, 参阅 [DrawImageOptions](#drawimageoptions).
- <ins>**returns**</ins> { [ImguiDrawList](imguiDrawListType) }

在矩形内绘制纹理.

## [m#] addImageQuad

### drawList.addImageQuad(texture, first, second, third, fourth, options?)

- **texture** { [ImguiTexture](imguiTextureType) } - 由 [createTexture](imgui#m-createtexture) 创建的纹理.
- **first** { [Point](imgui#point) } - 第一个点, 单位 px.
- **second** { [Point](imgui#point) } - 第二个点, 单位 px.
- **third** { [Point](imgui#point) } - 第三个点, 单位 px.
- **fourth** { [Point](imgui#point) } - 第四个点, 单位 px.
- **[ options ]** { [DrawImageQuadOptions](imguiDrawListType#drawimagequadoptions) } - 选项, 参阅 [DrawImageQuadOptions](#drawimagequadoptions).
- <ins>**returns**</ins> { [ImguiDrawList](imguiDrawListType) }

在四边形内绘制纹理.

## [m#] addImageRounded

### drawList.addImageRounded(texture, minimum, maximum, rounding, options?)

- **texture** { [ImguiTexture](imguiTextureType) } - 由 [createTexture](imgui#m-createtexture) 创建的纹理.
- **minimum** { [Point](imgui#point) } - 左上角, 单位 px.
- **maximum** { [Point](imgui#point) } - 右下角, 单位 px.
- **rounding** { [number](dataTypes#number) } - 圆角半径, 单位 px.
- **[ options ]** { [DrawImageRoundedOptions](imguiDrawListType#drawimageroundedoptions) } - 选项, 参阅 [DrawImageRoundedOptions](#drawimageroundedoptions).
- <ins>**returns**</ins> { [ImguiDrawList](imguiDrawListType) }

在圆角矩形内绘制纹理.

## [m#] pathClear

### drawList.pathClear()

- <ins>**returns**</ins> { [ImguiDrawList](imguiDrawListType) }

开始新路径. 路径的用法: 添加点, 再用 `pathStroke`, `pathFillConvex` 或 `pathFillConcave` 结束, 这些方法会清空路径.

## [m#] pathLineTo

### drawList.pathLineTo(position)

- **position** { [Point](imgui#point) } - 位置, 单位 px.
- <ins>**returns**</ins> { [ImguiDrawList](imguiDrawListType) }

向路径添加一个点.

## [m#] pathArcTo

### drawList.pathArcTo(center, radius, angleMin, angleMax, segments?)

- **center** { [Point](imgui#point) } - 中心, 单位 px.
- **radius** { [number](dataTypes#number) } - 半径, 单位 px.
- **angleMin** { [number](dataTypes#number) } - 起始角度, 单位弧度. `0` 指向右, 角度顺时针增大.
- **angleMax** { [number](dataTypes#number) } - 终止角度, 单位弧度, 与起始角度相差不超过 16 圈.
- **[ segments ]** { [number](dataTypes#number) } - 分段数, `0..512`, `0` 时按半径自动选择.
- <ins>**returns**</ins> { [ImguiDrawList](imguiDrawListType) }

向路径添加圆弧.

## [m#] pathArcToFast

### drawList.pathArcToFast(center, radius, minOf12, maxOf12)

- **center** { [Point](imgui#point) } - 中心, 单位 px.
- **radius** { [number](dataTypes#number) } - 半径, 单位 px.
- **minOf12** { [number](dataTypes#number) } - 起始刻度.
- **maxOf12** { [number](dataTypes#number) } - 终止刻度, 从 `minOf12` 到 `minOf12 + 192`.
- <ins>**returns**</ins> { [ImguiDrawList](imguiDrawListType) }

在时钟的 12 个刻度上添加圆弧, 比 [pathArcTo](#m-patharcto) 快. `0` 指向右, `3` 向下, `6` 向左, `9` 向上.

## [m#] pathBezierCubicCurveTo

### drawList.pathBezierCubicCurveTo(second, third, fourth, segments?)

- **second** { [Point](imgui#point) } - 第二个点, 单位 px.
- **third** { [Point](imgui#point) } - 第三个点, 单位 px.
- **fourth** { [Point](imgui#point) } - 第四个点, 单位 px.
- **[ segments ]** { [number](dataTypes#number) } - 分段数, `0` 时按半径自动选择.
- <ins>**returns**</ins> { [ImguiDrawList](imguiDrawListType) }

从最后一点添加三次贝塞尔曲线.

## [m#] pathBezierQuadraticCurveTo

### drawList.pathBezierQuadraticCurveTo(second, third, segments?)

- **second** { [Point](imgui#point) } - 第二个点, 单位 px.
- **third** { [Point](imgui#point) } - 第三个点, 单位 px.
- **[ segments ]** { [number](dataTypes#number) } - 分段数, `0` 时按半径自动选择.
- <ins>**returns**</ins> { [ImguiDrawList](imguiDrawListType) }

从最后一点添加二次贝塞尔曲线.

## [m#] pathRect

### drawList.pathRect(minimum, maximum, rounding?, flags?)

- **minimum** { [Point](imgui#point) } - 左上角, 单位 px.
- **maximum** { [Point](imgui#point) } - 右下角, 单位 px.
- **[ rounding ]** { [number](dataTypes#number) } - 圆角半径, 单位 px.
- **[ flags ]** { [number](dataTypes#number) } - [DrawFlags](imgui#p-drawflags) 的组合.
- <ins>**returns**</ins> { [ImguiDrawList](imguiDrawListType) }

向路径添加矩形.

## [m#] pathStroke

### drawList.pathStroke(color, thickness?, flags?)

- **color** { [Color](imgui#color) } - 颜色.
- **[ thickness ]** { [number](dataTypes#number) } - 线宽, 单位 px, 默认 1.
- **[ flags ]** { [number](dataTypes#number) } - `DrawFlags.Closed` 连接最后一点和第一点.
- <ins>**returns**</ins> { [ImguiDrawList](imguiDrawListType) }

描边路径并清空它.

## [m#] pathFillConvex

### drawList.pathFillConvex(color)

- **color** { [Color](imgui#color) } - 颜色.
- <ins>**returns**</ins> { [ImguiDrawList](imguiDrawListType) }

把路径作为凸多边形填充并清空它.

## [m#] pathFillConcave

### drawList.pathFillConcave(color)

- **color** { [Color](imgui#color) } - 颜色.
- <ins>**returns**</ins> { [ImguiDrawList](imguiDrawListType) }

把路径作为简单多边形填充并清空它, 比 [pathFillConvex](#m-pathfillconvex) 慢.

## [m#] pushClipRect

### drawList.pushClipRect(minimum, maximum, intersectWithCurrent?)

- **minimum** { [Point](imgui#point) } - 左上角, 单位 px.
- **maximum** { [Point](imgui#point) } - 右下角, 单位 px.
- **[ intersectWithCurrent = false ]** { [boolean](dataTypes#boolean) } - 是否与当前裁剪矩形取交集.
- <ins>**returns**</ins> { [ImguiDrawList](imguiDrawListType) }

裁剪这个绘制列表的绘制, 直到同一帧的 [popClipRect](#m-popcliprect). 不影响控件和命中测试, 要影响它们用 [ui.pushClipRect](imgui#m-pushcliprect).

## [m#] popClipRect

### drawList.popClipRect()

- <ins>**returns**</ins> { [ImguiDrawList](imguiDrawListType) }

撤销 [pushClipRect](#m-pushcliprect). 这一帧没有对应的调用时抛出 Error.

# PascalCase 别名

| 别名 | 目标 |
| --- | --- |
| AddLine | [addLine](#m-addline) |
| AddRect | [addRect](#m-addrect) |
| AddRectFilled | [addRectFilled](#m-addrectfilled) |
| AddCircle | [addCircle](#m-addcircle) |
| AddCircleFilled | [addCircleFilled](#m-addcirclefilled) |
| AddTriangle | [addTriangle](#m-addtriangle) |
| AddTriangleFilled | [addTriangleFilled](#m-addtrianglefilled) |
| AddText | [addText](#m-addtext) |
| AddPolyline | [addPolyline](#m-addpolyline) |
| AddBezierCubic | [addBezierCubic](#m-addbeziercubic) |
| AddImage | [addImage](#m-addimage) |
| AddBezierQuadratic | [addBezierQuadratic](#m-addbezierquadratic) |
| AddQuad | [addQuad](#m-addquad) |
| AddQuadFilled | [addQuadFilled](#m-addquadfilled) |
| AddNgon | [addNgon](#m-addngon) |
| AddNgonFilled | [addNgonFilled](#m-addngonfilled) |
| AddEllipse | [addEllipse](#m-addellipse) |
| AddEllipseFilled | [addEllipseFilled](#m-addellipsefilled) |
| AddRectFilledMultiColor | [addRectFilledMultiColor](#m-addrectfilledmulticolor) |
| AddConvexPolyFilled | [addConvexPolyFilled](#m-addconvexpolyfilled) |
| AddConcavePolyFilled | [addConcavePolyFilled](#m-addconcavepolyfilled) |
| AddImageQuad | [addImageQuad](#m-addimagequad) |
| AddImageRounded | [addImageRounded](#m-addimagerounded) |
| PathClear | [pathClear](#m-pathclear) |
| PathLineTo | [pathLineTo](#m-pathlineto) |
| PathArcTo | [pathArcTo](#m-patharcto) |
| PathArcToFast | [pathArcToFast](#m-patharctofast) |
| PathBezierCubicCurveTo | [pathBezierCubicCurveTo](#m-pathbeziercubiccurveto) |
| PathBezierQuadraticCurveTo | [pathBezierQuadraticCurveTo](#m-pathbezierquadraticcurveto) |
| PathRect | [pathRect](#m-pathrect) |
| PathStroke | [pathStroke](#m-pathstroke) |
| PathFillConvex | [pathFillConvex](#m-pathfillconvex) |
| PathFillConcave | [pathFillConcave](#m-pathfillconcave) |
| PushClipRect | [pushClipRect](#m-pushcliprect) |
| PopClipRect | [popClipRect](#m-popcliprect) |
