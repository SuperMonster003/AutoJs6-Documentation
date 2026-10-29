# AutoJs6 文档生成与同步

`api/*.md` 是文档的唯一内容源. 在线站点由 Docsify 直接读取这些 Markdown;
本目录中的生成器只负责离线静态 HTML 和结构化 JSON:

```text
api/*.md
  -> docs/*.html
  -> json/*.json
  -> docs/assets/offline-search-index.js

api/images/*
  -> docs/images/*
```

## 环境

- Python 3.10+
- Node.js 16+
- npm

首次运行时如果 `node_modules` 不存在, Python 入口会自动执行 `npm ci`.
也可以提前手动安装:

```powershell
Set-Location generator
npm ci
```

## 配置

将 `local-config.example.json` 复制为不纳入版本控制的
`local-config.json`, 并填写本机项目路径:

```json
{
  "offlineDocsProject": "D:/path/to/AutoJs6-Plugin-Offline-Docs",
  "autoJs6Project": "D:/path/to/AutoJs6"
}
```

离线 HTML 默认使用根目录 `project.json` 中的
`targetAutoJs6Version`. 临时覆盖版本可传入 `--version`, 或设置
`AUTOJS6_DOCS_VERSION`.

`project.json.versionName` 与文档内容版本以 `targetAutoJs6Version` 为来源.
离线插件的 `VERSION_NAME` 是独立发行版本, 同步时保留原值, 避免把插件的
二进制修复版本回退到较低的文档版本. 插件的 contentVersion 与两份 provenance
仍必须对应本次生成的文档版本.

## 常用命令

从项目任意目录均可运行:

```powershell
# 规范 Markdown 源文件.
python generator/normalize-markdown.py

# 检查 Markdown 源文件, 不写入.
python generator/normalize-markdown.py --check

# 全量生成 docs 和 json.
python generator/auto-generate.py

# 增量生成 console.
python generator/auto-generate.py console

# 在临时目录生成并检查已提交产物是否最新.
python generator/auto-generate.py --check

# 全量生成, 校验并同步到插件; 成功后两项目版本号各自 +1.
generator\auto-generate-for-autojs6.bat

# 同步后再执行插件测试与完整 APK 门禁; 失败会回滚 assets/docs.
python generator/auto-generate.py --sync-offline --verify-offline

# 只预览插件目录将发生的变化.
# 不改插件且不消耗版本号; 本项目 docs/json 仍会正常更新.
generator\auto-generate-for-autojs6.bat --dry-run
```

单模块模式用于快速预览. 发布或同步离线插件前应执行一次全量命令,
因为 `toc.md` 和模板会影响全部 HTML. `--sync-offline` 会拒绝模块参数,
从机制上避免把不同版本的局部产物混入插件. 单模块模式仍会读取全部
Markdown 源文件的标题, 以确保跨文档链接与全量生成结果一致.

同步流程不会再写入 AutoJs6 主项目. 正确目标为:

```text
AutoJs6-Plugin-Offline-Docs/app/src/main/assets/docs
```

脚本先检查 `api/*.md` 已符合统一风格, 再在 staging 中复制完整站点,
运行插件的 `.python/normalize_offline_docs.py --check` 并统一文本资源为 LF.
全部成功后才替换插件目录; 替换后的验证失败时会恢复原目录.
同步前还会校验插件的 contentVersion 与两份 provenance 中的文档版本,
避免 `targetAutoJs6Version` 静默漂移. 全量生成会清理已删除 Markdown
对应的过期 HTML/JSON, 已知的历史兼容 JSON 别名除外.

BAT 通过 `--increment-versions` 启用版本事务. 只有生成和插件同步全部成功
时, 才会保留以下修改:

```text
project.json:
  versionName = targetAutoJs6Version
  versionCode = versionCode + 1

AutoJs6-Plugin-Offline-Docs/version.properties:
  VERSION_NAME = 保留原值
  VERSION_BUILD = VERSION_BUILD + 1
```

插件的 contentVersion 与两份 provenance 版本也会同步对齐. 失败时版本文件
会回滚; `--dry-run` 只显示预期变化. 普通
`python generator/auto-generate.py --sync-offline` 不会自增版本号.
提交插件前还应按该仓库的 Git 提交计数规则校验 `VERSION_BUILD`, 不把同步次数
直接等同于提交数.
生成器会锁定当前文档仓库, 所有离线同步还会锁定目标插件仓库; 即使不同
文档工作副本指向同一插件, 也不会并发覆盖或丢失构建号自增. 同步使用本次
构建的不可变快照. 完整 Gradle 校验会显式关闭插件内建的可选构建号自增,
避免一次同步增加两次.

文档树同步目标仅为插件的 `app/src/main/assets/docs`; BAT 还会随版本事务更新
插件的 contentVersion, source provenance 和版本号. 插件发版时仍需按其项目
约定审查 CHANGELOG, 提交变更并执行完整 APK 门禁.

## 运行时支持表

模块页顶部的 "运行时支持" 表 (AutoJs6 `docs/api-coverage/ROADMAP.md` 的 D13)
由 `runtime-support.js` 根据宿主的运行时覆盖矩阵
`build/reports/api-coverage/runtime-matrix.json` 生成 (在宿主运行
`python tools/api-coverage/check.py --matrix` 产出). 页面用标记块声明要展示的
模块, 生成器只改写两个标记之间的内容, 标记块可以随页面结构移动:

```md
<!-- runtime-support:begin images -->
<!-- runtime-support:end -->
```

`begin` 后面是一个或多个模块根名, 与宿主文档门禁按模块查找页面的规则相同:
显式导出取其所在模块的第一段 (`files.batchRename.apply` -> `files`),
全局对象上的成员取其所属模块 (`captureScreen` -> `images`), 其余为 `global`.
以 Java 对象为原型的模块 (如 `files`) 的原型成员 (`files.isFile` 一类) 与显式导出一样计入该模块.

返回对象的成员 (`ImageWrapper#getWidth` 一类) 归入对象的第一个文档页 (宿主
`tools/api-coverage/returned-objects.json` 的 `documentation`). 对象有独立类型页时,
该页的标记块写对象名加 `#` (`<!-- runtime-support:begin ImageWrapper# -->`), 表格与模块页相同;
第一页是模块页时, 该页标记块内另起 "返回对象" 小表, 每个对象一行, 各列给出成员的状态计数.

```powershell
# 按矩阵改写全部标记块.
node generator/runtime-support.js

# 只检查, 标记块与矩阵不一致时退出码为 1.
node generator/runtime-support.js --check

# 在页面 H1 标题后插入标记块并生成内容 (可重复给出).
node generator/runtime-support.js --insert image:images --insert files:files

# 自检.
node generator/test-runtime-support.js
```

矩阵默认取 `local-config.json` 中 `autoJs6Project` 下的
`build/reports/api-coverage/runtime-matrix.json`, 没有配置时取兄弟目录
`../AutoJs6`; `--matrix <file>` 或 `--host <AutoJs6 目录>` 可另行指定.
`--json` 输出机读摘要, `--require-all` 把没有标记块的模块根, 以及没有任何标记块展示的
返回对象 (所在页既没有 `<对象>#` 根, 也没有模块根的标记块) 计为失败.
宿主 `python tools/api-coverage/check.py --docs-support` 调用本脚本的
`--check --require-all` 校验文档与矩阵一致, 且每个模块根与返回对象都有表 (宿主 api-coverage
路线图 P2.5 起; 新增模块或返回对象时, 用 `--insert <页面>:<根>` 在其第一个文档页插入标记块).

表格分两部分: 上方按 Rhino, Node.js 主线程, Node.js Worker 与 Bun 四列给出
入口, 各状态的 API 数与 Bun 所需授权; 下方 "差异项" 列出入口, 状态或授权与同列
多数 API 不同的 API, 同一函数的多个放置位置 (如 `images.captureScreen` 与全局
`captureScreen`) 状态相同时合并为一行. 某列全部 API 状态相同 (例如全部待补, 或因同一
理由不适用) 时只在上方写明状态, 理由与等价写法, 不因该列逐行列出. 状态词与矩阵状态的
对应关系:

| 表中文字 | 矩阵状态 |
| --- | --- |
| 已支持 | `bridged` (Rhino 列为 `native`) |
| 已支持 (本地实现) | `local-shim` |
| 需授权 | `capability-gated`, 后附能力名; 矩阵未给出能力名时写 "能力待定" |
| 不适用 | `not-portable`, 括号内为理由, 有 `equivalent` 时附等价写法 |
| 不提供 | `denied` |
| 待补 | `pending` |

经 Node.js `autojs6:compat` 兼容门面提供的入口标注 "经 compat"; 矩阵按成员别名
(`via` 为 `member-alias`) 对到其他模块成员的入口标注 "经 <模块>", 例如 automator
的 Toolkit 助手标注 "经 flow". 运行时声明只返回 never 的拒绝入口在矩阵中记为
`pending`, 表中写 "待补". 差异项中的
状态词带 `title` 属性, 值为矩阵状态名 (不适用与不提供另附理由分类). 标记块第二行
记录矩阵的数据源 (`ksp` 或 `kotlin`); 与当前矩阵的数据源不同时 `--check`
只报告 `skipped`, 不计为失败. 标记块内的注释不得包含 `=`, 因为 `json.js`
会把 `<!-- key=value -->` 读作页面元数据.

## 离线搜索

全量生成时, `generator/search_index.py` 会从最终 HTML 的 `#apicontent`
提取章节标题, 正文和锚点, 生成
`docs/assets/offline-search-index.js`. 索引排除错误页和站点入口页.

离线页面首次聚焦搜索框时才会加载索引. 搜索不依赖网络, Docsify
或 Android 宿主接口, 支持中文和英文内容, 键盘选择及夜间主题.
模块增量生成不会刷新全站索引; 发布和同步前应执行一次全量生成.

## 文档语法

Here's how the node docs work.

1:1 relationship from `lib/<module>.js` to `doc/api/<module>.md`

Each type of heading has a description block.

```md
## module

<!-- YAML
added: v0.10.0
-->

description and examples.

### module.property

<!-- YAML
added: v0.10.0
-->

* Type

description of the property.

### module.someFunction(x, y, [z=100])

<!-- YAML
added: v0.10.0
-->

* `x` {String} the description of the string
* `y` {Boolean} Should I stay or should I go?
* `z` {Number} How many zebras to bring.

A description of the function.

### module.someNewFunction(x)

<!-- YAML
added: REPLACEME
-->

* `x` {String} the description of the string

This feature is not in a release yet.

### Event: 'blerg'

<!-- YAML
added: v0.10.0
-->

* Argument: SomeClass object.

Modules don't usually raise events on themselves.  `cluster` is the
only exception.

## Class: SomeClass

<!-- YAML
added: v0.10.0
-->

description of the class.

### Class Method: SomeClass.classMethod(anArg)

<!-- YAML
added: v0.10.0
-->

* `anArg` {Object} Just an argument
    * `field` {String} anArg can have this field.
    * `field2` {Boolean} Another field. Default: `false`.
* Return: {Boolean} `true` if it worked.

Description of the method for humans.

### someClass.nextSibling()

<!-- YAML
added: v0.10.0
-->

* Return: {SomeClass object | null} The next someClass in line.

### someClass.someProperty

<!-- YAML
added: v0.10.0
-->

* String

The indication of what someProperty is.

### Event: 'grelb'

<!-- YAML
added: v0.10.0
-->

* `isBlerg` {Boolean}

This event is emitted on instances of SomeClass, not on the module itself.
```

* Classes have (description, Properties, Methods, Events)
* Events have (list of arguments, description)
* Functions have (list of arguments, description)
* Methods have (list of arguments, description)
* Modules have (description, Properties, Functions, Classes, Examples)
* Properties have (type, description)
