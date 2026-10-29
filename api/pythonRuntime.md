# Python 运行时 (Python Runtime)

<!-- type=misc -->

Python 运行时是一个独立安装的 AutoJs6 插件 ([AutoJs6-Plugin-Python-Runtime](https://github.com/SuperMonster003/AutoJs6-Plugin-Python-Runtime)). 安装并启用后, AutoJs6 把本地 `.py` 文件交给插件, 在插件自己的进程中用 CPython 3.13 执行. 本页列出插件提供给 Python 脚本的 `autojs6` 包: 46 个函数, 54 个常量与 10 个异常类, 依据插件 0.5.5 (配对 AutoJs6 6.8.0, 最低构建 5275).

本页的 API 属于 Python 语言, 不在 AutoJs6 的运行时覆盖矩阵 (Rhino, Node.js 与 Bun) 中, 因此页面顶部没有运行时支持表. 条目的名称, 参数与默认值由 AutoJs6 仓库的静态门禁 `tools/api-coverage/language_runtimes.py` 与插件源码 (包及各子模块的 `__all__`) 逐项比对.

---

## 使用方式

- 运行: 在 AutoJs6 中运行 `.py` 文件, 或使用 [engines.execScriptFile](engines#m-execscriptfile) 启动. 插件未安装或被禁用时, 启动以失败结束, 不会回退到 JavaScript 引擎.
- 导入: `import autojs6` 或 `from autojs6 import app, toast`. 包只在由插件执行的脚本中可用.
- 宿主调用: 除三个快照函数 (app.snapshot, device.snapshot, execution.snapshot) 外, 函数都经插件与宿主之间的能力代理 (capability broker) 调用 AutoJs6, 按本次执行获得的授权与配额检查, 每次执行最多 1024 次宿主调用; 执行结束后全部授权失效.
- 错误: 本次执行未获得某项能力时抛出 CapabilityUnavailableError, 宿主以稳定错误码拒绝时抛出 HostCapabilityError, 参数超出上限时抛出 `ValueError` 或 `TypeError`. 各项上限见对应模块的常量表.

```python
import autojs6
from autojs6 import app, console

console.log("AutoJs6 " + app.snapshot()["versionName"])
autojs6.toast("hello")
```

---

## 异常类

| 异常类 | 基类 | 说明 |
| --- | --- | --- |
| `autojs6.AutoJs6Error` | `RuntimeError` | 本包全部异常的基类 |
| `autojs6.CapabilityUnavailableError` | AutoJs6Error | 宿主未向本次执行授予所需能力, 或能力当前不可用 (如无障碍服务未开启, 没有可用的 OCR 引擎, 非项目执行读取项目文件) |
| `autojs6.HostCapabilityError` | AutoJs6Error | 宿主能力调用以稳定错误码失败; `code` 属性为错误码, 如 `PERMISSION_DENIED`, `STALE_NODE`, `OCR_FAILED` |
| `autojs6.ProjectPathError` | AutoJs6Error, `ValueError` | 项目相对路径不安全, 或不是项目中的普通文件 |
| `autojs6.ProjectReadLimitError` | AutoJs6Error | 项目文件超过单次读取上限 (1 MiB) |
| `autojs6.ResultAlreadySetError` | AutoJs6Error | 本次执行的结构化结果已经设置过 |
| `autojs6.ResultSerializationError` | AutoJs6Error, `TypeError` | 值无法表示为严格的有限 JSON |
| `autojs6.ResultLimitError` | AutoJs6Error | 编码后的结构化结果超过本次执行的字节上限 |
| `autojs6.ArtifactPathError` | AutoJs6Error, `ValueError` | 输出文件 (artifact) 路径不安全或未规范化 |
| `autojs6.ArtifactLimitError` | AutoJs6Error | 输出文件的数量或大小超过本次执行的上限 |

```python
from autojs6 import automator, CapabilityUnavailableError

try:
    automator.back()
except CapabilityUnavailableError as error:
    print("accessibility is not available:", error)
```

---

## autojs6

包的顶层函数.

### autojs6.toast(text)

- **text** { `str` } - 消息文本
- <ins>**returns**</ins> { `None` }

经宿主显示一条短时 toast.

```python
import autojs6

autojs6.toast("done")
```

### autojs6.notice(text)

- **text** { `str` } - 通知文本, 不能为空, 最多 4 KiB (UTF-8)
- <ins>**returns**</ins> { `None` }

经宿主在 `autojs6-python` 通知渠道发出一条标记了本次执行的通知; 缺少通知权限或渠道被关闭时以 HostCapabilityError 失败 (错误码 `PERMISSION_DENIED`), 不会打开权限设置.

```python
import autojs6

autojs6.notice("backup finished")
```

---

## autojs6.app

应用信息与启动操作.

### autojs6.app.snapshot()

- <ins>**returns**</ins> { `dict[str, object]` } - 含 `packageName`, `versionName`, `versionCode` 与 `debuggable` 的副本

返回宿主在执行开始时冻结的 AutoJs6 应用信息, 不产生宿主调用.

```python
from autojs6 import app

info = app.snapshot()
print(info["packageName"], info["versionCode"])
```

### autojs6.app.launch(package_name)

- **package_name** { `str` } - Android 应用包名, 不能为空
- <ins>**returns**</ins> { `bool` } - 宿主是否启动了应用

按包名启动一个已安装的应用.

```python
from autojs6 import app

print(app.launch("com.android.settings"))
```

### autojs6.app.launch_app(name)

- **name** { `str` } - 应用在桌面上显示的名称, 不能为空
- <ins>**returns**</ins> { `bool` } - 宿主是否启动了应用

按应用名称启动一个已安装的应用.

```python
from autojs6 import app

print(app.launch_app("Settings"))
```

### autojs6.app.open_url(url)

- **url** { `str` } - HTTP 或 HTTPS 地址, 不能为空
- <ins>**returns**</ins> { `bool` } - 宿主是否打开了地址

经宿主用系统默认方式打开一个 HTTP 或 HTTPS 地址.

```python
from autojs6 import app

app.open_url("https://docs.autojs6.com")
```

---

## autojs6.artifacts

本次执行的输出文件 (artifact). 输出文件随执行结果交给宿主, 每次执行最多 16 个, 单个最大 4 MiB, 合计最大 8 MiB.

### autojs6.artifacts.path(relative_path)

- **relative_path** { `str` } - 规范化的逻辑相对路径, 最多 1024 字节 (UTF-8)
- <ins>**returns**</ins> { `str` } - 插件私有目录中可写入的文件路径

登记一个输出文件并返回其实际路径; 路径不安全或未规范化时抛出 ArtifactPathError, 超过数量或大小上限时抛出 ArtifactLimitError.

```python
from autojs6 import artifacts

with open(artifacts.path("report/summary.txt"), "w", encoding="utf-8") as file:
    file.write("ok\n")
```

---

## autojs6.automator

经宿主无障碍服务执行的坐标与全局动作. 宿主无障碍服务不可用时抛出 CapabilityUnavailableError, 不会打开设置页.

| 常量 | 值 | 说明 |
| --- | --- | --- |
| `autojs6.automator.MAX_COORDINATE` | `1000000` | 坐标上限 (坐标为 0 到该值的整数) |
| `autojs6.automator.MAX_DURATION_MILLIS` | `4000` | press 与 swipe 持续时间上限 (毫秒) |
| `autojs6.automator.DEFAULT_PRESS_DURATION_MILLIS` | `100` | press 的默认持续时间 (毫秒) |
| `autojs6.automator.DEFAULT_SWIPE_DURATION_MILLIS` | `300` | swipe 的默认持续时间 (毫秒) |

### autojs6.automator.click(x, y)

- **x** { `int` } - 横坐标
- **y** { `int` } - 纵坐标
- <ins>**returns**</ins> { `bool` } - 宿主与系统报告的动作结果

点击一个屏幕坐标.

```python
from autojs6 import automator

automator.click(540, 1200)
```

### autojs6.automator.long_click(x, y)

- **x** { `int` } - 横坐标
- **y** { `int` } - 纵坐标
- <ins>**returns**</ins> { `bool` } - 宿主与系统报告的动作结果

长按一个屏幕坐标.

```python
from autojs6 import automator

automator.long_click(540, 1200)
```

### autojs6.automator.press(x, y, duration_ms=DEFAULT_PRESS_DURATION_MILLIS)

- **x** { `int` } - 横坐标
- **y** { `int` } - 纵坐标
- **[ duration_ms = 100 ]** { `int` } - 按住时长, 1 到 4000 毫秒
- <ins>**returns**</ins> { `bool` } - 宿主与系统报告的动作结果

按住一个屏幕坐标指定时长.

```python
from autojs6 import automator

automator.press(540, 1200, 800)
```

### autojs6.automator.swipe(x1, y1, x2, y2, duration_ms=DEFAULT_SWIPE_DURATION_MILLIS)

- **x1** { `int` } - 起点横坐标
- **y1** { `int` } - 起点纵坐标
- **x2** { `int` } - 终点横坐标
- **y2** { `int` } - 终点纵坐标
- **[ duration_ms = 300 ]** { `int` } - 滑动时长, 1 到 4000 毫秒
- <ins>**returns**</ins> { `bool` } - 宿主与系统报告的动作结果

从一个坐标滑动到另一个坐标.

```python
from autojs6 import automator

automator.swipe(540, 1600, 540, 400, duration_ms=500)
```

### autojs6.automator.back()

- <ins>**returns**</ins> { `bool` } - 宿主与系统报告的动作结果

执行 Android 全局 "返回" 动作.

```python
from autojs6 import automator

automator.back()
```

### autojs6.automator.home()

- <ins>**returns**</ins> { `bool` } - 宿主与系统报告的动作结果

执行 Android 全局 "主屏幕" 动作.

```python
from autojs6 import automator

automator.home()
```

---

## autojs6.clip

宿主剪贴板.

### autojs6.clip.get()

- <ins>**returns**</ins> { `str` } - 剪贴板文本, 没有文本时为空字符串

读取宿主剪贴板的文本.

```python
from autojs6 import clip

print(clip.get())
```

### autojs6.clip.set(text)

- **text** { `str` } - 文本, 最多 32 KiB (UTF-8)
- <ins>**returns**</ins> { `None` }

用给定文本替换宿主剪贴板的内容.

```python
from autojs6 import clip

clip.set("copied from Python")
```

---

## autojs6.console

直接写入 AutoJs6 控制台并带有级别的输出. 普通的 `print` 与标准错误输出同样会回到 AutoJs6 控制台.

### autojs6.console.log(text)

- **text** { `str` } - 一行文本
- <ins>**returns**</ins> { `None` }

以调试级别写入一行.

```python
from autojs6 import console

console.log("step 1")
```

### autojs6.console.warn(text)

- **text** { `str` } - 一行文本
- <ins>**returns**</ins> { `None` }

以警告级别写入一行.

```python
from autojs6 import console

console.warn("retrying")
```

### autojs6.console.error(text)

- **text** { `str` } - 一行文本
- <ins>**returns**</ins> { `None` }

以错误级别写入一行.

```python
from autojs6 import console

console.error("failed")
```

---

## autojs6.device

设备信息.

### autojs6.device.snapshot()

- <ins>**returns**</ins> { `dict[str, object]` } - 含 `sdkInt`, `release`, `manufacturer`, `brand`, `model` 与 `supportedAbis` 的副本

返回宿主在执行开始时冻结的设备信息, 不产生宿主调用.

```python
from autojs6 import device

info = device.snapshot()
print(info["brand"], info["model"], info["sdkInt"])
```

### autojs6.device.info()

- <ins>**returns**</ins> { `dict[str, object]` } - 含 `schema`, `battery` (`percent`, `charging`), `screen` (`on`, `brightness`) 与 `volume` (`music`, `notification`, `alarm`, 各含 `current` 与 `max`)

经宿主读取当前的电量, 屏幕亮度与音量, 不含设备标识.

```python
from autojs6 import device

state = device.info()
print(state["battery"]["percent"], state["volume"]["music"]["current"])
```

---

## autojs6.dialogs

由宿主显示的前台对话框. 调用时 AutoJs6 须有处于前台的界面; 否则不会弹出界面, 而是以 HostCapabilityError 失败 (错误码 `INTERACTIVE_NOT_ALLOWED`). 单次用户响应最多等待 5 分钟.

| 常量 | 值 | 说明 |
| --- | --- | --- |
| `autojs6.dialogs.DEFAULT_TITLE` | `"AutoJs6 Python"` | 默认标题 |
| `autojs6.dialogs.MAX_TITLE_BYTES` | `256` | 标题上限 (UTF-8 字节) |
| `autojs6.dialogs.MAX_TEXT_BYTES` | `4096` | 正文上限 (UTF-8 字节) |
| `autojs6.dialogs.MAX_PROMPT_REPLY_BYTES` | `32768` | prompt 默认值与回复的上限 (UTF-8 字节) |
| `autojs6.dialogs.MAX_ITEMS` | `64` | select 的选项数上限 |
| `autojs6.dialogs.MAX_ITEM_BYTES` | `1024` | select 单个选项的上限 (UTF-8 字节) |
| `autojs6.dialogs.MAX_TOTAL_ITEM_BYTES` | `32768` | select 全部选项合计的上限 (UTF-8 字节) |

### autojs6.dialogs.alert(text, *, title=DEFAULT_TITLE)

- **text** { `str` } - 正文
- **[ title = "AutoJs6 Python" ]** { `str` } - 标题 (仅限关键字参数)
- <ins>**returns**</ins> { `None` }

显示提示对话框, 阻塞到用户确认或关闭.

```python
from autojs6 import dialogs

dialogs.alert("Backup finished", title="Backup")
```

### autojs6.dialogs.confirm(text, *, title=DEFAULT_TITLE)

- **text** { `str` } - 正文
- **[ title = "AutoJs6 Python" ]** { `str` } - 标题 (仅限关键字参数)
- <ins>**returns**</ins> { `bool` } - 只有用户确认时为 `True`

显示确认对话框.

```python
from autojs6 import dialogs

if dialogs.confirm("Delete the cache?"):
    print("confirmed")
```

### autojs6.dialogs.prompt(text, *, default="", title=DEFAULT_TITLE)

- **text** { `str` } - 提示文本
- **[ default = "" ]** { `str` } - 输入框的初始内容 (仅限关键字参数)
- **[ title = "AutoJs6 Python" ]** { `str` } - 标题 (仅限关键字参数)
- <ins>**returns**</ins> { `str` | `None` } - 输入的文本, 取消时为 `None`

显示输入对话框.

```python
from autojs6 import dialogs

name = dialogs.prompt("Your name", default="guest")
print(name)
```

### autojs6.dialogs.select(items, *, title=DEFAULT_TITLE)

- **items** { `Sequence[str]` } - 选项, 最多 64 项
- **[ title = "AutoJs6 Python" ]** { `str` } - 标题 (仅限关键字参数)
- <ins>**returns**</ins> { `int` | `None` } - 所选项的索引 (从 0 开始), 取消时为 `None`

显示单选列表对话框.

```python
from autojs6 import dialogs

index = dialogs.select(["red", "green", "blue"], title="Color")
print(index)
```

---

## autojs6.engines

当前 Python 引擎的信息与受限的子脚本启动.

| 常量 | 值 | 说明 |
| --- | --- | --- |
| `autojs6.engines.INFO_SCHEMA` | `"autojs6-python-engine-info-v1"` | current 返回值的 `schema` |
| `autojs6.engines.LAUNCH_SCHEMA` | `"autojs6-python-engine-launch-v1"` | run 返回值的 `schema` |
| `autojs6.engines.MAX_SCRIPT_LAUNCHES` | `16` | 每次执行成功启动子脚本的次数上限 |
| `autojs6.engines.MAX_ENGINE_NAME_BYTES` | `256` | 返回的引擎名上限 (UTF-8 字节) |
| `autojs6.engines.MAX_SOURCE_NAME_BYTES` | `1024` | 返回的脚本名上限 (UTF-8 字节) |

### autojs6.engines.current()

- <ins>**returns**</ins> { `dict[str, object]` } - 含 `schema`, `id`, `engineName` (固定为 `"python"`), `sourceName`, `entryPoint`, `project` 与 `startedAtMillis`

返回当前 Python 引擎的信息, 不含绝对路径.

```python
from autojs6 import engines

print(engines.current()["sourceName"])
```

### autojs6.engines.run(path)

- **path** { `str` | `os.PathLike[str]` } - 子脚本相对于本次执行目录的路径
- <ins>**returns**</ins> { `dict[str, object]` } - 含 `schema`, `id`, `engineName`, `sourceName` 与 `path`

异步启动一个非 Python 的宿主脚本 (如 `.js`) 并立即返回其信息. 启动 `.py` 文件以 HostCapabilityError 失败 (错误码 `NESTED_PYTHON_NOT_ALLOWED`), 超过 16 次成功启动时错误码为 `ENGINE_LAUNCH_LIMIT_EXCEEDED`.

```python
from autojs6 import engines

child = engines.run("tasks/sync.js")
print(child["id"], child["engineName"])
```

### autojs6.engines.stop_self()

- <ins>**returns**</ins> { `NoReturn` } - 不会正常返回

请求宿主强制停止本引擎; 停止通过重启插件进程完成, 脚本无法捕获.

```python
from autojs6 import console, engines

console.log("stopping")
engines.stop_self()
print("never printed")
```

---

## autojs6.execution

本次执行的信息.

### autojs6.execution.snapshot()

- <ins>**returns**</ins> { `dict[str, object]` } - 含 `id` (UUID 字符串), `entryPoint` 与 `project` 的副本

返回宿主创建本次执行时冻结的执行信息, 不产生宿主调用.

```python
from autojs6 import execution

info = execution.snapshot()
print(info["id"], info["project"])
```

---

## autojs6.files

实时读写当前脚本所在目录 (宿主侧执行根目录) 中的文件. 路径为相对路径, 不能越出该目录.

| 常量 | 值 | 说明 |
| --- | --- | --- |
| `autojs6.files.MAX_PATH_BYTES` | `4096` | 相对路径上限 (UTF-8 字节) |
| `autojs6.files.MAX_TEXT_BYTES` | `32768` | 单次读写的文本上限 (UTF-8 字节) |
| `autojs6.files.MAX_LIST_ENTRIES` | `128` | list 返回的名称数上限 |

### autojs6.files.read_text(path, *, encoding="utf-8")

- **path** { `str` | `os.PathLike[str]` } - 相对路径
- **[ encoding = "utf-8" ]** { `str` } - 只接受 UTF-8 (仅限关键字参数)
- <ins>**returns**</ins> { `str` } - 文件内容

读取一个 UTF-8 文本文件.

```python
from autojs6 import files

print(files.read_text("config.txt"))
```

### autojs6.files.write_text(path, text, *, encoding="utf-8")

- **path** { `str` | `os.PathLike[str]` } - 相对路径
- **text** { `str` } - 文件内容
- **[ encoding = "utf-8" ]** { `str` } - 只接受 UTF-8 (仅限关键字参数)
- <ins>**returns**</ins> { `None` }

覆盖写入一个文件; 不会创建不存在的上级目录.

```python
from autojs6 import files

files.write_text("last-run.txt", "ok")
```

### autojs6.files.exists(path)

- **path** { `str` | `os.PathLike[str]` } - 相对路径
- <ins>**returns**</ins> { `bool` } - 路径当前是否存在

```python
from autojs6 import files

print(files.exists("config.txt"))
```

### autojs6.files.is_file(path)

- **path** { `str` | `os.PathLike[str]` } - 相对路径
- <ins>**returns**</ins> { `bool` } - 路径当前是否为普通文件

```python
from autojs6 import files

print(files.is_file("config.txt"))
```

### autojs6.files.is_dir(path)

- **path** { `str` | `os.PathLike[str]` } - 相对路径
- <ins>**returns**</ins> { `bool` } - 路径当前是否为目录

```python
from autojs6 import files

print(files.is_dir("data"))
```

### autojs6.files.list(path=".")

- **[ path = "." ]** { `str` | `os.PathLike[str]` } - 相对路径, 默认为执行根目录
- <ins>**returns**</ins> { `list[str]` } - 排序后的直接子项名称, 最多 128 个

列出一个目录的直接子项.

```python
from autojs6 import files

for name in files.list("data"):
    print(name)
```

---

## autojs6.images

截图, 找色与找图. 截图需要宿主的无障碍服务, 每次执行最多保留 1 张截图与 1 个模板.

| 常量 | 值 | 说明 |
| --- | --- | --- |
| `autojs6.images.IMAGE_SCHEMA` | `"autojs6-python-screen-image-v1"` | 截图传输的 schema 标识 |
| `autojs6.images.CHUNK_SCHEMA` | `"autojs6-python-screen-image-chunk-v1"` | 截图分块传输的 schema 标识 |
| `autojs6.images.COLOR_MATCH_SCHEMA` | `"autojs6-python-color-match-v1"` | 找色结果的 schema 标识 |
| `autojs6.images.TEMPLATE_SCHEMA` | `"autojs6-python-image-template-v1"` | 模板上传的 schema 标识 |
| `autojs6.images.TEMPLATE_CHUNK_SCHEMA` | `"autojs6-python-image-template-chunk-v1"` | 模板分块上传的 schema 标识 |
| `autojs6.images.IMAGE_MATCH_SCHEMA` | `"autojs6-python-image-match-v1"` | 找图结果的 schema 标识 |
| `autojs6.images.MAX_IMAGE_BYTES` | `4194304` | 截图编码后的上限 (字节) |
| `autojs6.images.MAX_CHUNK_BYTES` | `32768` | 截图分块的大小 (字节) |
| `autojs6.images.MAX_CHUNKS` | `128` | 截图分块数上限 |
| `autojs6.images.MAX_TEMPLATE_BYTES` | `1048576` | 模板图片上限 (字节) |
| `autojs6.images.MAX_TEMPLATE_CHUNK_BYTES` | `24576` | 模板分块的大小 (字节) |
| `autojs6.images.MAX_TEMPLATE_CHUNKS` | `43` | 模板分块数上限 |
| `autojs6.images.MAX_TEMPLATE_DIMENSION` | `2048` | 模板单边像素上限 |
| `autojs6.images.MAX_TEMPLATE_PIXELS` | `1048576` | 模板像素总数上限 |
| `autojs6.images.MAX_DIMENSION` | `8192` | 截图单边像素上限, 也是 region 的坐标范围 |
| `autojs6.images.MAX_PIXELS` | `16777216` | 截图像素总数上限 |
| `autojs6.images.MIN_QUALITY` | `1` | quality 下限 |
| `autojs6.images.MAX_QUALITY` | `100` | quality 上限 |
| `autojs6.images.MAX_COLOR` | `16777215` | 颜色整数上限 (`0xFFFFFF`) |
| `autojs6.images.MAX_COLOR_THRESHOLD` | `255` | 逐通道阈值上限 |

### autojs6.images.capture_screen(*, format="png", quality=100, path=None)

- **[ format = "png" ]** { `str` } - `"png"` 或 `"jpeg"` (仅限关键字参数)
- **[ quality = 100 ]** { `int` } - 编码质量, 1 到 100 (仅限关键字参数)
- **[ path = None ]** { `str` | `None` } - 输出文件的逻辑路径 (仅限关键字参数), 规则同 autojs6.artifacts.path
- <ins>**returns**</ins> { `bytes` | `str` } - 未给出 path 时为图像字节, 否则为写入的文件路径

截取当前屏幕.

```python
from autojs6 import images

data = images.capture_screen(format="jpeg", quality=80)
print(len(data))
```

### autojs6.images.find_color(color, *, region=None, threshold=0)

- **color** { `int` | `str` } - `0xRRGGBB` 整数或 `"#RRGGBB"` 文本
- **[ region = None ]** { `tuple[int, int, int, int]` | `list[int]` | `None` } - 搜索区域 (x, y, 宽, 高), 默认为整个屏幕 (仅限关键字参数)
- **[ threshold = 0 ]** { `int` } - 逐通道阈值, 0 到 255 (仅限关键字参数)
- <ins>**returns**</ins> { `tuple[int, int]` | `None` } - 第一个匹配点的坐标, 未找到时为 `None`

在一张最新截图中按行优先找色, 只返回坐标, 不传输图像.

```python
from autojs6 import images

point = images.find_color("#FF5722", region=(0, 0, 1080, 600), threshold=8)
print(point)
```

### autojs6.images.find_image(template, *, region=None, threshold=0)

- **template** { `bytes` | `bytearray` | `memoryview` } - PNG 或 JPEG 模板图片
- **[ region = None ]** { `tuple[int, int, int, int]` | `list[int]` | `None` } - 搜索区域 (x, y, 宽, 高), 默认为整个屏幕 (仅限关键字参数)
- **[ threshold = 0 ]** { `int` } - 逐通道阈值, 0 到 255 (仅限关键字参数)
- <ins>**returns**</ins> { `tuple[int, int]` | `None` } - 第一个匹配位置的左上角坐标, 未找到时为 `None`

在一张最新截图中按行优先找图; 只有完全不透明的模板像素参与比较.

```python
from autojs6 import images, project

point = images.find_image(project.read_bytes("assets/button.png"))
print(point)
```

---

## autojs6.ocr

使用宿主当前配置的 OCR 引擎识别文字.

| 常量 | 值 | 说明 |
| --- | --- | --- |
| `autojs6.ocr.MAX_LINES` | `256` | 返回的行数上限 |
| `autojs6.ocr.MAX_LINE_BYTES` | `4096` | 单行文本上限 (UTF-8 字节) |
| `autojs6.ocr.MAX_TOTAL_TEXT_BYTES` | `49152` | 全部文本合计上限 (UTF-8 字节) |

### autojs6.ocr.recognize(image)

- **image** { `bytes` | `bytearray` | `memoryview` } - PNG 或 JPEG 图片, 上限同 images 的模板 (1 MiB, 单边 2048 像素)
- <ins>**returns**</ins> { `tuple[str, ...]` } - 逐行识别的文本

识别一张图片中的文字; 宿主没有可用的 OCR 引擎时抛出 CapabilityUnavailableError, 引擎识别失败时以 HostCapabilityError 失败 (错误码 `OCR_FAILED`).

```python
from autojs6 import images, ocr

lines = ocr.recognize(images.capture_screen(format="jpeg", quality=90))
print("\n".join(lines))
```

---

## autojs6.project

只读访问项目执行时冻结的项目文件快照. 只能在以项目方式运行时使用, 否则抛出 CapabilityUnavailableError.

| 常量 | 值 | 说明 |
| --- | --- | --- |
| `autojs6.project.MAX_READ_BYTES` | `1048576` | 单次读取上限 (字节) |

### autojs6.project.read_bytes(path)

- **path** { `str` | `os.PathLike[str]` } - 项目内的相对路径
- <ins>**returns**</ins> { `bytes` } - 文件内容, 最多 1 MiB

读取项目中的一个普通文件; 路径不安全时抛出 ProjectPathError, 超过上限时抛出 ProjectReadLimitError.

```python
from autojs6 import project

icon = project.read_bytes("assets/icon.png")
```

### autojs6.project.read_text(path, *, encoding="utf-8")

- **path** { `str` | `os.PathLike[str]` } - 项目内的相对路径
- **[ encoding = "utf-8" ]** { `str` } - 只接受 UTF-8 (仅限关键字参数)
- <ins>**returns**</ins> { `str` } - 文件内容

以严格 UTF-8 解码读取项目中的一个文件, 上限同 read_bytes.

```python
from autojs6 import project

print(project.read_text("README.md"))
```

### autojs6.project.exists(path)

- **path** { `str` | `os.PathLike[str]` } - 项目内的相对路径
- <ins>**returns**</ins> { `bool` } - 路径是否为项目中的普通文件

```python
from autojs6 import project

print(project.exists("data/input.json"))
```

---

## autojs6.result

本次执行的结构化结果. 结果与标准输出分开传给宿主, 宿主不会从标准输出推断结果.

### autojs6.result.set(value)

- **value** { `Any` } - 可严格编码为有限 JSON 的值, 编码后最多 64 KiB
- <ins>**returns**</ins> { `None` }

设置本次执行唯一的结构化结果; 再次设置抛出 ResultAlreadySetError, 无法编码时抛出 ResultSerializationError, 超过上限时抛出 ResultLimitError.

```python
from autojs6 import result

result.set({"ok": True, "items": [1, 2, 3]})
```

---

## autojs6.selector

经宿主无障碍服务读取控件树并操作控件. 节点为字典, 含 `id`, `parentId`, `depth`, `childCount`, 文本字段 (`text`, `description`, `resourceId`, `className`, `packageName`), `bounds` (`left`, `top`, `right`, `bottom`), 状态字段 (`clickable`, `editable`, `enabled`, `focused`, `selected`, `checkable`, `checked`, `scrollable`, `password`, `visibleToUser`) 与 `truncatedFields`. 扫描不完整时以错误码 `SELECTOR_SCAN_LIMIT_EXCEEDED` 失败, 节点引用过期时以 `STALE_NODE` 失败.

| 常量 | 值 | 说明 |
| --- | --- | --- |
| `autojs6.selector.SNAPSHOT_SCHEMA` | `"autojs6-python-ui-tree-v1"` | snapshot 返回值的 `schema` |
| `autojs6.selector.DEFAULT_SNAPSHOT_NODES` | `64` | snapshot 的默认节点数 |
| `autojs6.selector.MAX_SNAPSHOT_NODES` | `128` | snapshot 的节点数上限 |
| `autojs6.selector.DEFAULT_SNAPSHOT_DEPTH` | `16` | snapshot 的默认深度 |
| `autojs6.selector.DEFAULT_FIND_NODES` | `512` | find 的默认扫描节点数 |
| `autojs6.selector.MAX_FIND_NODES` | `1024` | find 的扫描节点数上限 |
| `autojs6.selector.MAX_DEPTH` | `32` | 深度上限, 也是 find 的默认深度 |
| `autojs6.selector.MAX_QUERY_TEXT_BYTES` | `1024` | find 查询文本上限 (UTF-8 字节) |
| `autojs6.selector.MAX_SET_TEXT_BYTES` | `4096` | set_text 文本上限 (UTF-8 字节) |
| `autojs6.selector.MAX_NODE_TEXT_CODE_POINTS` | `256` | 节点文本字段的长度上限 (Unicode 码位), 超出部分截断并记入 `truncatedFields` |
| `autojs6.selector.MAX_RETAINED_NODES` | `128` | 每次执行保留的节点引用上限 |

### autojs6.selector.snapshot(max_nodes=DEFAULT_SNAPSHOT_NODES, max_depth=DEFAULT_SNAPSHOT_DEPTH)

- **[ max_nodes = 64 ]** { `int` } - 节点数, 1 到 128
- **[ max_depth = 16 ]** { `int` } - 深度, 0 到 32
- <ins>**returns**</ins> { `dict[str, object]` } - 含 `schema`, `generation`, `truncated` 与 `nodes` (节点列表)

按广度优先返回当前活动窗口控件树的有界快照.

```python
from autojs6 import selector

tree = selector.snapshot(max_nodes=32)
for node in tree["nodes"]:
    print(node["depth"], node["className"], node["text"])
```

### autojs6.selector.find(*, text=None, text_contains=None, description=None, description_contains=None, resource_id=None, class_name=None, clickable=None, editable=None, enabled=None, scrollable=None, max_nodes=DEFAULT_FIND_NODES, max_depth=MAX_DEPTH)

- **[ text = None ]** { `str` | `None` } - 文本等于
- **[ text_contains = None ]** { `str` | `None` } - 文本包含
- **[ description = None ]** { `str` | `None` } - 内容描述等于
- **[ description_contains = None ]** { `str` | `None` } - 内容描述包含
- **[ resource_id = None ]** { `str` | `None` } - 资源 ID 等于
- **[ class_name = None ]** { `str` | `None` } - 类名等于
- **[ clickable = None ]** { `bool` | `None` } - 是否可点击
- **[ editable = None ]** { `bool` | `None` } - 是否可编辑
- **[ enabled = None ]** { `bool` | `None` } - 是否启用
- **[ scrollable = None ]** { `bool` | `None` } - 是否可滚动
- **[ max_nodes = 512 ]** { `int` } - 扫描节点数, 1 到 1024
- **[ max_depth = 32 ]** { `int` } - 扫描深度, 0 到 32
- <ins>**returns**</ins> { `dict[str, object]` | `None` } - 第一个满足全部条件的节点, 未找到时为 `None`

按广度优先查找控件. 参数都只能以关键字给出, 至少给出一个条件.

```python
from autojs6 import selector

node = selector.find(text="OK", clickable=True)
if node is not None:
    selector.click(node)
```

### autojs6.selector.click(node)

- **node** { `str` | `dict[str, object]` } - 本次执行中 snapshot 或 find 返回的节点, 或其 `id`
- <ins>**returns**</ins> { `bool` } - 点击动作的结果

点击一个已保留的节点.

```python
from autojs6 import selector

node = selector.find(text_contains="Settings")
print(node and selector.click(node))
```

### autojs6.selector.set_text(node, text)

- **node** { `str` | `dict[str, object]` } - 本次执行中 snapshot 或 find 返回的节点, 或其 `id`
- **text** { `str` } - 文本, 最多 4 KiB (UTF-8)
- <ins>**returns**</ins> { `bool` } - 系统设置文本动作的结果

为一个已保留的可编辑节点设置文本.

```python
from autojs6 import selector

field = selector.find(editable=True)
if field is not None:
    selector.set_text(field, "hello")
```

---

## 相关链接

- [AutoJs6-Plugin-Python-Runtime](https://github.com/SuperMonster003/AutoJs6-Plugin-Python-Runtime): 插件仓库, README 的 "运行限制" 一节列出全部上限, `docs/python/` 是各项宿主能力的协议说明.
- [引擎 (Engines)](engines): AutoJs6 脚本中启动 `.py` 文件.
