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

`project.json.versionName` 与离线插件的 `VERSION_NAME` 均以
`targetAutoJs6Version` 为唯一名称来源.

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
  VERSION_NAME = targetAutoJs6Version
  VERSION_BUILD = VERSION_BUILD + 1
```

插件的 contentVersion 与两份 provenance 版本也会同步对齐. 失败时版本文件
会回滚; `--dry-run` 只显示预期变化. 普通
`python generator/auto-generate.py --sync-offline` 不会自增版本号.
生成器会锁定当前文档仓库, 所有离线同步还会锁定目标插件仓库; 即使不同
文档工作副本指向同一插件, 也不会并发覆盖或丢失构建号自增. 同步使用本次
构建的不可变快照. 完整 Gradle 校验会显式关闭插件内建的可选构建号自增,
避免一次同步增加两次.

文档树同步目标仅为插件的 `app/src/main/assets/docs`; BAT 还会随版本事务更新
插件的 contentVersion, source provenance 和版本号. 插件发版时仍需按其项目
约定审查 CHANGELOG, 提交变更并执行完整 APK 门禁.

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
