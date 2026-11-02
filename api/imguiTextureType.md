# ImGui 纹理 (ImguiTexture)

ImguiTexture 是 GPU 中的图像, 由 [imgui.createTexture](imgui#m-createtexture) 或 [session.createTexture](imguiSessionType#m-createtexture) 返回, 由 [image](imgui#m-image), [imageButton](imgui#m-imagebutton) 和 [绘制列表](imguiDrawListType) 使用. 会话关闭时自动释放. 类型声明中的名称是 `ImGui.Texture`. 内置示例 `texture-refresh` 演示更新纹理.

## TextureOptions

[createTexture](imgui#m-createtexture) 的选项.

| 选项 | 类型 | 说明 |
| --- | --- | --- |
| `flags` | [number](dataTypes#number) | [TextureFlags](imgui#p-textureflags) 的组合. |
| `nearest` | [boolean](dataTypes#boolean) | 等同 `TextureFlags.Nearest`. |
| `repeat` | [boolean](dataTypes#boolean) | 等同 `TextureFlags.Repeat`. |
| `mipmaps` | [boolean](dataTypes#boolean) | 等同 `TextureFlags.Mipmaps`. |

## ImageOptions

[image](imgui#m-image) 与 [imageButton](imgui#m-imagebutton) 的选项.

| 选项 | 类型 | 说明 |
| --- | --- | --- |
| `width` | [number](dataTypes#number) | 宽度, 单位 px, 默认为纹理宽度. |
| `height` | [number](dataTypes#number) | 高度, 单位 px, 默认为纹理高度. |
| `uv0` | [Point](imgui#point) | 左上角的纹理坐标, `0..1`. |
| `uv1` | [Point](imgui#point) | 右下角的纹理坐标, `0..1`. |
| `background` | [Color](imgui#color) | 图像后面的颜色. |
| `bg` | [Color](imgui#color) | `background` 的别名. |
| `tint` | [Color](imgui#color) | 与图像相乘的颜色. |

<p style="font: bold 2em sans-serif; color: #FF7043">ImguiTexture</p>

## [p#] handle

**`READONLY`**

- { [number](dataTypes#number) }

Dear ImGui 的纹理 ID.

## [p#] width

**`READONLY`**

- { [number](dataTypes#number) }

宽度, 单位 px. `update` 加载其他尺寸的图像时改变.

## [p#] height

**`READONLY`**

- { [number](dataTypes#number) }

高度, 单位 px. `update` 加载其他尺寸的图像时改变.

## [m#] update

### texture.update(source)

- **source** { [TextureSource](imgui#texturesource) } - 图像来源, 参阅 [TextureSource](imgui#texturesource).
- <ins>**returns**</ins> { [ImguiTexture](imguiTextureType) }

用新图像替换像素, 来源与 `createTexture` 相同. 尺寸相同时复用 GL 存储 (glTexSubImage2D), 不同时重新分配. 句柄不变.

## [m#] isDisposed

### texture.isDisposed()

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

`dispose` 是否已运行, 或所属会话是否已关闭.

## [m#] dispose

### texture.dispose()

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 已经释放过时为 `false`.

释放 GL 纹理, 在脚本线程上随时可以调用.

## [m#] close

### texture.close()

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 已经释放过时为 `false`.

与 [dispose](#m-dispose) 相同.

## [m#] toString

### texture.toString()

- <ins>**returns**</ins> { [string](dataTypes#string) }

用于日志的简短描述.
