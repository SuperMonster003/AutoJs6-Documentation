# 脚本库 (Bundled Libraries)

<!-- type=misc -->

Bundled Libraries 是一个独立安装的 AutoJs6 官方插件 ([AutoJs6-Plugin-Bundled-Libraries](https://github.com/SuperMonster003/AutoJs6-Plugin-Bundled-Libraries)), 收纳 AutoJs6 过去内置的 13 个脚本库: axios, cheerio, dayjs, i18n, pangu, lodash, 以及 Node.js 兼容垫片 buffer, events, fs, os, path, process 和 nodejs. 自 AutoJs6 6.8.0 起, 这些库不再随 AutoJs6 安装包提供, 改由本插件提供. 本页面自 AutoJs6 6.8.0 (构建 5935) 起适用.

本页面不是脚本 API. 插件没有新增全局对象或模块: 安装并启用后, `require('axios')`, `require('fs')` 等以及全局对象 [axios](global#p-axios), [cheerio](global#p-cheerio), [dayjs](global#p-dayjs), [i18n](i18n) 与 [pangu](pangu) 照常可用, 原有脚本不需要修改.

---

## 收录的库

模块名即 `require` 的参数. 有全局对象的库也可以不写 `require` 直接使用, 全局对象与 `require` 得到的是同一个模块 (`require('axios') === axios`).

| 库 | 模块名 | 全局对象 | 分组 | 许可证 |
| --- | --- | --- | --- | --- |
| axios | `axios` | [axios](global#p-axios) | 库 | MIT |
| cheerio | `cheerio` | [cheerio](global#p-cheerio) | 库 | MIT |
| dayjs | `dayjs` | [dayjs](global#p-dayjs) | 库 | MIT |
| i18n | `i18n`, `banana-i18n` | [i18n](i18n) | 库 | MIT |
| pangu (10.1.0) | `pangu` | [pangu](pangu) | 库 | MIT |
| lodash (4.17.15) | `lodash` | - | 库 | MIT |
| buffer | `buffer` | - | Node 兼容垫片 | MPL-2.0 |
| events | `events` | - | Node 兼容垫片 | MPL-2.0 |
| fs | `fs` | - | Node 兼容垫片 | MPL-2.0 |
| os | `os` | - | Node 兼容垫片 | MPL-2.0 |
| path | `path` | - | Node 兼容垫片 | MPL-2.0 |
| process | `process` | - | Node 兼容垫片 | MPL-2.0 |
| nodejs | `nodejs` | - | Node 兼容垫片 | MPL-2.0 |

库文件与 AutoJs6 6.8.0 之前内置的文件相同. 各库的来源与许可证详见插件仓库的 [THIRD_PARTY_NOTICES.md](https://github.com/SuperMonster003/AutoJs6-Plugin-Bundled-Libraries/blob/master/THIRD_PARTY_NOTICES.md).

---

## 安装与启用

1. 使用 AutoJs6 6.8.0 (构建 5935) 或更高版本. 更早的 AutoJs6 自带这些库, 不需要本插件.
2. 在插件中心的官方插件库安装 Bundled Libraries (也可以从插件仓库的 [Releases](https://github.com/SuperMonster003/AutoJs6-Plugin-Bundled-Libraries/releases) 下载 APK 安装), 并确认其处于启用状态. 插件只有一个通用安装包, 不含原生库, 需要 Android 7.0 (API 24) 或更高版本.
3. 在脚本中照常 `require` 需要的库, 或直接使用全局对象:

```js
let _ = require('lodash');
let path = require('path');

console.log(dayjs(0).valueOf()); // 0
console.log(cheerio.load('<p>AutoJs6</p>')('p').text()); // AutoJs6
console.log(_.map([1, 2], function (x) { return x * 2; }).join()); // 2,4
console.log(path.isAbsolute('/sdcard/Scripts')); // true
```

插件不申请运行时权限, 也没有网络权限. AutoJs6 直接从插件的安装包读取库文件, 脚本运行时不绑定插件服务, 也不启动插件进程; axios 的网络请求由运行脚本的 AutoJs6 发出.

本插件只服务于 AutoJs6 默认的 JavaScript (Rhino) 脚本. Node.js 运行时插件中的脚本使用 Node.js 自带的模块, 不受本插件影响.

---

## 逐库开关

插件页面 (从插件中心的条目或桌面上的 Bundled Libraries 图标打开) 为每个库提供一个开关, 默认全部开启:

- 关闭的库不能再被 `require`, 它的全局对象也不能使用; 重新打开即可恢复.
- 开关对之后的 `require` 生效. 正在运行的脚本已经加载的模块保留到脚本结束.
- `fs` 依赖 `buffer`, `nodejs` 依赖 `process` 与 `buffer`: 关闭 `buffer` 或 `process` 后, 依赖它们的模块也无法加载.
- 页面底部的 "发行历史" 列出插件各版本的更新内容.

---

## 插件不可用时

插件未安装, 未授权, 在插件中心被停用, 与当前 AutoJs6 不兼容, 或某个库被关闭时, `require` 该库的模块名会抛出 `Error`; 读取对应的全局对象 (包括 `typeof axios`) 同样抛出该错误, 之后每次读取都会重新尝试. 错误对象的属性:

- `message` - 说明需要安装插件, 或到哪里开启, 例如 `Cannot find module 'dayjs': it is provided by the official plugin "Bundled Libraries", which is not installed. Install the plugin in AutoJs6 > Plugin center.` (文本随 AutoJs6 的语言变化; `lodash` 与 Node.js 兼容模块在消息中的模块名带 `.js`, 如 `'lodash.js'`).
- `code` - 固定为 `MODULE_NOT_FOUND`, 与找不到普通模块时相同.
- `library` - 库名, 如 `lodash`, `i18n` (模块名为 `banana-i18n` 时同样为 `i18n`).
- `reason` - 原因, 取值见下表.

| reason | 情形 | 处理 |
| --- | --- | --- |
| `not-installed` | 插件未安装 | 在 AutoJs6 > 插件中心安装 Bundled Libraries |
| `unauthorized` | 插件未授权 (自行构建的版本签名不同) | 在插件中心按提示授权 |
| `plugin-disabled` | 插件在插件中心被停用 | 在插件中心启用 |
| `library-disabled` | 该库在插件页面被关闭 | 在插件中心 > Bundled Libraries 中打开该库 |
| `incompatible` | 当前 AutoJs6 无法读取已安装插件的库清单 | 升级 AutoJs6 或插件 |

```js
let _ = null;
try {
    _ = require('lodash');
} catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND' || !e.library) {
        throw e;
    }
    console.warn(e.library + ': ' + e.reason); // 如 lodash: not-installed.
}
```

插件状态的变化不会中断正在运行的脚本, 只影响之后的 `require` 与全局对象读取. AutoJs6 的其他内置模块与脚本自己的模块文件不受影响.

---

## 打包的应用

用 AutoJs6 打包应用时, 打包功能扫描项目中的脚本, 把用到的库从本设备已安装的插件复制进生成的应用. 这样打包的应用在没有安装本插件的设备上也能使用这些库.

- 扫描查找 `require` 与 `import` 中写成字符串的模块名 (如 `require('dayjs')`, `import _ from 'lodash'`), 以及全局对象名 `axios`, `cheerio`, `dayjs`, `i18n` 与 `pangu`. 复制的库所依赖的库 (如 `fs` 依赖的 `buffer` 与 `path`) 一并带上.
- 模块名在运行时才确定 (如 `require(name)`) 时扫描无法发现. 此时在打包页面的 "支持库" 中勾选 "Bundled Libraries", 打包时会带上插件中的全部库 (应用增大约 210 KB). 加密的脚本与超过 4 MB 的文件不扫描, 它们用到的库同样需要勾选此项.
- 本设备的插件未安装, 被停用, 未授权, 与当前 AutoJs6 不兼容, 或某个库已关闭时, 对应的库无法复制. 打包照常完成, 打包成功的对话框列出已打包的库, 以及未打包的库与处理办法, 处理后重新打包即可.

打包的应用运行时先使用自带的库. 某个库没有带上时, 如果所在设备安装了本插件, 则从插件读取; 否则 `require` 该模块名或读取对应的全局对象会抛出上文所述的 `Error`, `message` 提示用 AutoJs6 重新打包 (模块为动态加载时勾选 "Bundled Libraries") 或在该设备安装本插件, 例如 `Cannot find module 'dayjs': this app was packaged without the library "dayjs". Package the app again with AutoJs6 (select "Bundled Libraries" in "Libraries" if the module is loaded dynamically), or install the plugin "Bundled Libraries" on this device.`

---

## 相关链接

- [AutoJs6-Plugin-Bundled-Libraries](https://github.com/SuperMonster003/AutoJs6-Plugin-Bundled-Libraries): 插件仓库, 含 README 与发行历史.
- [模块 (Module)](modules): `require` 的解析规则与内置模块.
- [插件 (Plugins)](plugins): 插件中心与提供脚本模块的插件.
