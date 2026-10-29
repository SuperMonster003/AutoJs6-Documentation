# Lua 运行时 (Lua Runtime)

<!-- type=misc -->

Lua 运行时是一个独立安装的 AutoJs6 插件 ([AutoJs6-Plugin-Lua-Runtime](https://github.com/SuperMonster003/AutoJs6-Plugin-Lua-Runtime)). 在 AutoJs6 编辑器中运行 `.lua` 文件时, 源码交给插件, 在插件专用的 `:lua_runtime` 进程中由 PUC Lua 5.4.8 执行. 本页列出插件提供给 Lua 脚本的 `autojs` 模块: 11 个函数与 1 个只读值, 依据插件 0.1.3-rc.2 (最低 AutoJs6 构建 5276).

本页的 API 属于 Lua 语言, 不在 AutoJs6 的运行时覆盖矩阵 (Rhino, Node.js 与 Bun) 中, 因此页面顶部没有运行时支持表. 条目的名称由 AutoJs6 仓库的静态门禁 `tools/api-coverage/language_runtimes.py` 与插件源码 (原生函数 `install_autojs_module` 建立的模块表) 逐项比对.

---

## 使用方式

- 导入: `local autojs = require("autojs")`. 脚本可使用经过审查的 Lua 标准库子集, 不能访问文件系统, 进程, 环境变量或动态原生模块.
- 全局函数: `print(...)` 与 `warn(text)` 改为写入 AutoJs6 控制台 (分别对应标准输出与标准错误); `math.randomseed` 只接受一个或两个显式整数种子.
- 模块: 入口为 `job.lua` 时, `require("helper")` 加载同级目录 `job.modules/` 中的 `helper.lua` (UTF-8 文本, 最多 64 KiB; 模块名为最长 64 个字符的 ASCII 标识符, 不接受路径与点号).
- 结果: 脚本的返回值作为标量结果交给宿主.
- 能力: device, storage 与 ui 的调用需要宿主为本次执行授予对应能力; 未授予时执行以 `HOST_CAPABILITY` 结束, 没有本地回退或重试.

```lua
local autojs = require("autojs")

autojs.console.log("hello from Lua")
local device = autojs.device.info()
autojs.console.info("running on: " .. device.manufacturer .. " " .. device.model)

local runCount = (autojs.storage.get("run_count") or 0) + 1
autojs.storage.put("run_count", runCount)
autojs.ui.toast(("Lua run #%d complete"):format(runCount))
return runCount
```

---

## autojs

### autojs.now()

- <ins>**returns**</ins> { `integer` } - Unix 纪元毫秒数

返回当前时间.

```lua
local autojs = require("autojs")

local started = autojs.now()
-- Work here.
autojs.console.log(("took %d ms"):format(autojs.now() - started))
```

### autojs.arguments

- { `table` }

本次执行参数的只读快照.

```lua
local autojs = require("autojs")

local name = autojs.arguments.name or "guest"
autojs.console.log("hello, " .. name)
```

---

## autojs.console

写入 AutoJs6 控制台. 每个函数只接受一个非空字符串, 最多 32 KiB.

### autojs.console.log(text)

- **text** { `string` } - 一行文本
- <ins>**returns**</ins> { `nil` }

写入标准输出.

```lua
local autojs = require("autojs")

autojs.console.log("step 1")
```

### autojs.console.info(text)

- **text** { `string` } - 一行文本
- <ins>**returns**</ins> { `nil` }

写入标准输出, 与 log 相同.

```lua
local autojs = require("autojs")

autojs.console.info("ready")
```

### autojs.console.warn(text)

- **text** { `string` } - 一行文本
- <ins>**returns**</ins> { `nil` }

写入标准错误, 与全局 `warn` 的输出保持次序.

```lua
local autojs = require("autojs")

autojs.console.warn("retrying")
```

### autojs.console.error(text)

- **text** { `string` } - 一行文本
- <ins>**returns**</ins> { `nil` }

写入标准错误.

```lua
local autojs = require("autojs")

autojs.console.error("failed")
```

---

## autojs.device

### autojs.device.info()

- <ins>**returns**</ins> { `table` } - 含 `brand`, `manufacturer`, `model`, `device`, `product` 与 `sdkInt`

经宿主读取设备信息.

```lua
local autojs = require("autojs")

local info = autojs.device.info()
autojs.console.log(info.brand .. " " .. info.model .. " (API " .. info.sdkInt .. ")")
```

---

## autojs.storage

由宿主持久保存的键值存储, 按脚本划分. 只对有稳定文件身份的脚本 (如已保存的 `.lua` 文件) 提供. 键是 1 到 64 字节的 ASCII 标识符; 每个脚本最多 256 个键, 合计 2 MiB; 每次执行最多 64 次操作, 其中最多 32 次修改.

### autojs.storage.get(key)

- **key** { `string` } - 键
- <ins>**returns**</ins> { `any` } - 保存的值, 键不存在时为 `nil`

读取一个键的值.

```lua
local autojs = require("autojs")

local count = autojs.storage.get("run_count") or 0
```

### autojs.storage.put(key, value)

- **key** { `string` } - 键
- **value** { `any` } - 非 `nil` 的值: 布尔, 整数, 有限小数, UTF-8 字符串, 以及由它们组成的连续数组或字符串键的表; 规范化后最多 252 KiB
- <ins>**returns**</ins> { `boolean` } - 宿主同步提交后为 `true`

原子地写入或替换一个键的值. `put(key, nil)` 不表示删除, 会报错; 删除使用 remove.

```lua
local autojs = require("autojs")

autojs.storage.put("settings", { theme = "dark", retries = 3 })
```

### autojs.storage.remove(key)

- **key** { `string` } - 键
- <ins>**returns**</ins> { `boolean` } - 键原先是否存在

原子地删除一个键.

```lua
local autojs = require("autojs")

print(autojs.storage.remove("settings"))
```

### autojs.storage.clear()

- <ins>**returns**</ins> { `integer` } - 删除的键数

原子地删除当前脚本的全部键.

```lua
local autojs = require("autojs")

print(autojs.storage.clear())
```

---

## autojs.ui

### autojs.ui.toast(text)

- **text** { `string` } - 1 到 1024 字节的严格 UTF-8 文本
- <ins>**returns**</ins> { `nil` }

经宿主显示一条 toast. 每次执行最多 4 次, 只派发一次, 不重试.

```lua
local autojs = require("autojs")

autojs.ui.toast("done")
```

---

## 相关链接

- [AutoJs6-Plugin-Lua-Runtime](https://github.com/SuperMonster003/AutoJs6-Plugin-Lua-Runtime): 插件仓库, README 列出运行限制与可用的标准库, `docs/storage-kv-v1.md` 说明 storage 的值模型.
