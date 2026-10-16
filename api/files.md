# 文件 (Files)

---

<aside class="doc-status doc-status--incomplete" data-marked-by="SuperMonster003" data-marked-on="2022-10-22">
<p><strong>文档状态:</strong> 此章节仍在补充或完善中.</p>
</aside>

files 模块提供了一些常见的文件处理, 包括文件读写, 移动, 复制, 删掉等.

一次性的文件读写可以直接使用 `files.read()`, `files.write()`, `files.append()` 等方便的函数, 但如果需要频繁读写或随机读写, 则使用 `open()` 函数打开一个文件对象来操作文件, 并在操作完毕后调用 `close()` 函数关闭文件.

## files.isFile(path)

- **path** { [string](dataTypes#string) } 路径
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

返回路径 path 是否是文件.

```
log(files.isDir("/sdcard/文件夹/")); // 返回 false.
log(files.isDir("/sdcard/文件.txt")); // 返回 true.
```

## files.isDir(path)

- **path** { [string](dataTypes#string) } 路径
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

返回路径 path 是否是文件夹.

```
log(files.isDir("/sdcard/文件夹/")); // 返回 true.
log(files.isDir("/sdcard/文件.txt")); // 返回 false.
```

## files.isEmptyDir(path)

- **path** { [string](dataTypes#string) } 路径
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

返回文件夹 path 是否为空文件夹. 如果该路径并非文件夹, 则直接返回 `false`.

## [m] join

### files.join(parent, ...child)

- **parent** { [string](dataTypes#string) } - 父目录路径
- **...child** { [...](documentation#可变参数)[string](dataTypes#string)[[]](documentation#可变参数) } - 一个或多个子路径
- <ins>**returns**</ins> { [string](dataTypes#string) } - 拼接后的路径

拼接父路径和任意数量的子路径.

```js
files.join('/sdcard', 'Download', '1.txt');
```

## [m] toFile

### files.toFile(path)

**`6.6.0`**

- **path** { [string](dataTypes#string) } - 文件路径
- <ins>**returns**</ins> { [java.io.File](https://docs.oracle.com/javase/8/docs/api/java/io/File.html) } - 解析后的 Java 文件对象

将路径解析为绝对路径并创建对应的 `java.io.File` 对象.

## files.create(path)

- **path** { [string](dataTypes#string) } 路径
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

创建一个文件或文件夹并返回是否创建成功. 如果文件已经存在, 则直接返回 `false`.

```
files.create("/sdcard/新文件夹/");
```

## [m] createIfNotExists

### files.createIfNotExists(path)

- **path** { [string](dataTypes#string) } - 文件路径
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

文件不存在时先创建父目录, 再创建空文件. 新文件创建成功返回 `true`; 路径已经存在或文件创建失败时返回 `false`. 相对路径以当前脚本工作目录解析. 与 `files.createWithDirs(path)` 使用相同实现.

## files.createWithDirs(path)

- **path** { [string](dataTypes#string) } 路径
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

创建一个文件或文件夹并返回是否创建成功. 如果文件所在文件夹不存在, 则先创建他所在的一系列文件夹. 如果文件已经存在, 则直接返回 `false`.

```
files.createWithDirs("/sdcard/新文件夹/新文件夹/新文件夹/1.txt");
```

## files.exists(path)

- **path** { [string](dataTypes#string) } 路径
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

返回在路径 path 处的文件是否存在.

## files.ensureDir(path)

- **path** { [string](dataTypes#string) } 路径

确保路径 path 所在的文件夹存在. 如果该路径所在文件夹不存在, 则创建该文件夹.

例如对于路径 "/sdcard/Download/ABC/1.txt", 如果 /Download/ 文件夹不存在, 则会先创建 Download, 再创建 ABC 文件夹.

## files.read(path[, encoding = "utf-8"])

- **path** { [string](dataTypes#string) } 路径
- **encoding** { [string](dataTypes#string) } 字符编码, 可选, 默认为 utf-8
- <ins>**returns**</ins> { [string](dataTypes#string) }

读取文本文件 path 的所有内容并返回. 如果文件不存在, 则抛出 `FileNotFoundException`.

```
log(files.read("/sdcard/1.txt"));
```

## [m] readAssets

### files.readAssets(fileName, encoding?)

- **fileName** { [string](dataTypes#string) } - 运行应用 assets 内的相对文件名
- **[ encoding = "utf-8" ]** { [string](dataTypes#string) } - 字符编码
- <ins>**returns**</ins> { [string](dataTypes#string) }

读取运行应用 APK 的 assets 文本资源. 这里的路径相对于 assets 根目录, 不使用脚本工作目录或共享存储路径. 资源不存在或读取失败时抛出异常.

## files.readBytes(path)

- **path** { [string](dataTypes#string) } 路径
- <ins>**returns**</ins> {byte[]}

读取文件 path 的所有内容并返回一个字节数组. 如果文件不存在, 则抛出 `FileNotFoundException`.

注意, 该数组是 Java 的数组, 不具有 JavaScript 数组的 forEach, slice 等函数.

一个以 16 进制形式打印文件的例子如下:

```
let data = files.readBytes("/sdcard/1.png");
let sb = new java.lang.StringBuilder();
for(let i = 0; i < data.length; i++){
    sb.append(data[i].toString(16));
}
log(sb.toString());
```

## files.write(path, text[, encoding = "utf-8"])

- **path** { [string](dataTypes#string) } 路径
- **text** { [string](dataTypes#string) } 要写入的文本内容
- **encoding** { [string](dataTypes#string) } 字符编码

把 text 写入到文件 path 中. 如果文件存在则覆盖, 不存在则创建.

```
let text = "文件内容";
// 写入文件.
files.write("/sdcard/1.txt", text);
// 用其他应用查看文件.
app.viewFile("/sdcard/1.txt");
```

## files.writeBytes(path, bytes)

- **path** { [string](dataTypes#string) } 路径
- **bytes** {byte[]} 字节数组, 要写入的二进制数据

把 bytes 写入到文件 path 中. 如果文件存在则覆盖, 不存在则创建.

## files.append(path, text[, encoding = 'utf-8'])

- **path** { [string](dataTypes#string) } 路径
- **text** { [string](dataTypes#string) } 要写入的文本内容
- **encoding** { [string](dataTypes#string) } 字符编码

把 text 追加到文件 path 的末尾. 如果文件不存在则创建.

```
let text = "追加的文件内容";
files.append("/sdcard/1.txt", text);
files.append("/sdcard/1.txt", text);
// 用其他应用查看文件.
app.viewFile("/sdcard/1.txt");
```

## [m] appendBytes

### files.appendBytes(path, bytes)

- **path** { [string](dataTypes#string) } - 目标文件路径
- **bytes** { [JavaArray](dataTypes#javaarray) } - Java `byte[]`, 要追加的二进制数据
- <ins>**returns**</ins> { [void](dataTypes#void) }

将字节数组追加到文件末尾. 文件不存在时尝试创建; 父目录须可访问. 此方法直接写入字节, 没有字符编码参数.

## files.copy(fromPath, toPath)

- **fromPath** { [string](dataTypes#string) } 要复制的原文件路径
- **toPath** { [string](dataTypes#string) } 复制到的文件路径
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

复制文件, 返回是否复制成功. 例如 `files.copy("/sdcard/1.txt", "/sdcard/Download/1.txt")`.

## files.move(fromPath, toPath)

- **fromPath** { [string](dataTypes#string) } 要移动的原文件路径
- **toPath** { [string](dataTypes#string) } 移动到的文件路径
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

移动文件, 返回是否移动成功. 例如 `files.move("/sdcard/1.txt", "/sdcard/Download/1.txt")` 会把 1.txt 文件从 sd 卡根目录移动到 Download 文件夹.

## files.rename(path, newName)

- **path** { [string](dataTypes#string) } 要重命名的原文件路径
- **newName** { [string](dataTypes#string) } 要重命名的新文件名
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

重命名文件, 并返回是否重命名成功. 例如 `files.rename("/sdcard/1.txt", "2.txt")`.

## files.renameWithoutExtension(path, newName)

- **path** { [string](dataTypes#string) } 要重命名的原文件路径
- **newName** { [string](dataTypes#string) } 要重命名的新文件名
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

重命名文件, 不包含拓展名, 并返回是否重命名成功. 例如 `files.rename("/sdcard/1.txt", "2")` 会把 "1.txt" 重命名为 "2.txt".

## [m+] batchRename

批量重命名文件与文件夹. 新名称按查找与替换, 正则表达式, 计数器, 日期时间, 随机值, 照片元数据及汉字转拼音等规则计算, 支持先预览方案, 逐项排除, 冲突处理, 命名预设与撤销.

批量重命名由外置 Batch Rename 插件提供. 调用前, 必须安装并启用与当前 AutoJs6 版本兼容的 Batch Rename 插件. 未发现可用插件时, 调用将抛出 (异步形态以 Promise 拒绝) `code` 为 `PLUGIN_UNAVAILABLE`, `PLUGIN_DISABLED` 或 `PLUGIN_INCOMPATIBLE` 的 [BatchRenameError](#批量重命名错误-batchrenameerror). [files.batchRename.isAvailable](#filesbatchrenameisavailable) 可预先探测. 汉字转拼音 (`pinyin` 系列选项与 `${pinyin}` 变量), 照片元数据 (`metadata`) 及命名预设 (`preset`, [presets](#filesbatchrenamepresets), [importPresets](#filesbatchrenameimportpresetsjson-importoptions)) 需要 Batch Rename 1.1.0 及以上版本, 旧版本插件遇到时抛出 `PLUGIN_INCOMPATIBLE`.

插件只计算新名称; 枚举目标, 改名, 撤销日志及回收站均由 AutoJs6 完成. 文件管理器中的批量重命名 (多选工具栏, 文件夹菜单 "批量重命名其中的项目" 及重命名对话框 "更多" 菜单) 使用同一插件与同一撤销日志. 日志中的批次也可在 AutoJs6 的 "重命名历史" 页面中查看, 搜索, 撤销或删除 (入口: 文件管理器重命名对话框 "更多" 菜单 > "重命名历史").

一次重命名分为两步: [plan](#filesbatchrenameplanpaths-options) 枚举目标并计算 [方案](#批量重命名方案-batchrenameplan), 不修改任何文件; [apply](#filesbatchrenameapplyplan-applyoptions) 执行方案并返回 [结果](#批量重命名结果-batchrenameresult). 直接调用 `files.batchRename(paths, options)` 等价于先 plan 再 apply. [preview](#filesbatchrenamepreviewitem-options) 只按名称试算新名称, 不访问文件.

`paths` 为路径字符串或其数组, 相对路径按脚本工作目录解析 (与 [files.path](#m-path) 相同). 给出的每个路径都是深度为 0 的条目. 给出文件夹且 `includeSubfolders` 为 `true` (默认) 时, 其中的全部条目也会加入, 深度逐层加 1, 按深度优先的顺序排列, 同一文件夹内按名称排序 (不区分大小写). 符号链接不会被跟随或改名: 给出的路径不能是符号链接, 文件夹中的符号链接被跳过.

一个方案至多包含 2000 个条目, 涉及至多 512 个文件夹, 这些文件夹合计至多 20000 个名称, 给出的文件夹之下至多 32 层, 超出时抛出 `LIMIT_EXCEEDED`.

同步形态阻塞当前脚本线程直至完成, 停止脚本会取消等待; 异步形态 (`planAsync`, `previewAsync`, `applyAsync`, `undoAsync`, `presetsAsync`, `importPresetsAsync`) 立即返回 [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise), 进度回调与结果在脚本线程执行. 除 RegExp 形式的 `search` 与 `onProgress` 函数外, 选项会像 `JSON.stringify` 一样序列化.

`$files.batchRename` 与 `files.batchRename` 指向同一对象.

```js
let dir = files.path('./batch-rename-demo');
['IMG_0001.jpg', 'IMG_0002.jpg', 'notes.txt'].forEach(name => files.createWithDirs(files.join(dir, name)));

let plan = files.batchRename.plan(dir, { search: 'IMG_', replace: 'Photo_', includeFolders: false });
plan.items.forEach(it => console.log(it.name + ' -> ' + it.newName + ' (' + it.status + ')'));
// batch-rename-demo -> batch-rename-demo (excluded)
// IMG_0001.jpg -> Photo_0001.jpg (rename)
// IMG_0002.jpg -> Photo_0002.jpg (rename)
// notes.txt -> notes.txt (unchanged)

if (!plan.rejected) {
    let result = files.batchRename.apply(plan);
    console.log(result.counts.renamed); // 2
}
```

### files.batchRename(paths, options)

**`6.8.0`**

- **paths** { [string](dataTypes#string) | [string](dataTypes#string)[] } - 文件或文件夹路径
- **options** { [BatchRenameOptions](#批量重命名选项-batchrenameoptions) } - 重命名选项
- <ins>**returns**</ins> { [BatchRenameResult](#批量重命名结果-batchrenameresult) } - 执行结果

计算方案并立即执行, 相当于 `files.batchRename.apply(files.batchRename.plan(paths, options), { onProgress: options.onProgress })`. 方案被拒绝时抛出 `PLAN_REJECTED`, 不改名任何条目.

```js
/* 把 ./docs 中所有 .txt 文件的扩展名改为 md. */
let result = files.batchRename('./docs', { search: 'txt', replace: 'md', target: 'extension', includeFolders: false });
console.log(result.counts.renamed, result.counts.skipped);
```

### files.batchRename.plan(paths, options)

**`6.8.0`**

- **paths** { [string](dataTypes#string) | [string](dataTypes#string)[] } - 文件或文件夹路径
- **options** { [BatchRenameOptions](#批量重命名选项-batchrenameoptions) } - 重命名选项
- <ins>**returns**</ins> { [BatchRenamePlan](#批量重命名方案-batchrenameplan) } - 重命名方案

计算每个条目的新名称与状态 (`rename`, `unchanged`, `conflict`, `invalid` 或 `excluded`), 不修改任何文件. 计算时刻 (`dateTime: 'now'` 的取值) 在此时确定.

可将方案中条目的 `excluded` 设为 `true` 后再交给 [apply](#filesbatchrenameapplyplan-applyoptions) 执行. 每个脚本保留最近 16 个方案供 apply 使用, 更早的方案执行时抛出 `PLAN_STALE`.

```js
/* 日期前缀 (取文件修改时间) 与三位序号, 如 IMG_1234.jpg -> 2026-10-15_001.jpg. */
let plan = files.batchRename.plan('./camera', {
    search: /^IMG_\d+/,
    replace: '$YYYY-$MM-$DD_${padding=3;start=1}',
    enumerate: true,
    includeFolders: false,
});
plan.items.filter(it => it.status === 'rename').forEach(it => console.log(it.name, '->', it.newName));
```

### files.batchRename.preview(item, options)

**`6.8.0`** **`Overload 1/2`**

- **item** { [string](dataTypes#string) | {{ name: [string](dataTypes#string); isDirectory?: [boolean](dataTypes#boolean); lastModified?: [number](dataTypes#number) | [Date](dataTypes#date) }} } - 名称或试算条目
- **options** { [BatchRenameOptions](#批量重命名选项-batchrenameoptions) } - 重命名选项
- <ins>**returns**</ins> { {{ newName: [string](dataTypes#string); status: [string](dataTypes#string); reason: [string](dataTypes#string) | [null](dataTypes#null) }} } - 试算结果

按 `options` 试算一个名称的新名称, 不访问也不改名任何文件, 适合在没有对应文件时检验替换规则. 结果的 `newName`, `status` 与 `reason` 与 [方案](#批量重命名方案-batchrenameplan) 条目的同名属性相同.

字符串视为文件名, 修改时间为调用时刻. 试算条目可用 `isDirectory` 表示文件夹 (默认 `false`), 用 `lastModified` (毫秒时间戳或 Date) 给出修改时间, 分别供 `includeFiles` / `includeFolders` 与日期时间变量使用. 名称必须是 1 至 1024 个字符的单个文件名, 不能为 `.` 或 `..`, 不能包含 `/`, 否则抛出 `INVALID_OPTIONS`.

试算不读取文件, 因此 `metadata` 为 `true` 时抛出 `INVALID_OPTIONS`. 其他选项 (包括 `preset`) 与 [plan](#filesbatchrenameplanpaths-options) 相同, 文件夹层级相关的选项不起作用.

```js
let result = files.batchRename.preview('IMG_0001.JPG', { search: 'IMG_', replace: 'Photo_', format: 'lower' });
console.log(result.newName, result.status); // photo_0001.jpg rename

let dated = files.batchRename.preview({ name: 'scan.pdf', lastModified: new Date(2026, 9, 15) }, {
    search: /^/, replace: '$YYYY-$MM-$DD_', target: 'name',
});
console.log(dated.newName); // 2026-10-15_scan.pdf
```

### files.batchRename.preview(items, options)

**`6.8.0`** **`Overload 2/2`**

- **items** { ([string](dataTypes#string) | [object](dataTypes#object))[] } - 名称或试算条目 (与 [Overload 1/2](#filesbatchrenamepreviewitem-options) 的 `item` 相同) 的数组, 至多 2000 个
- **options** { [BatchRenameOptions](#批量重命名选项-batchrenameoptions) } - 重命名选项
- <ins>**returns**</ins> { [object](dataTypes#object)[] } - 与 `items` 一一对应的试算结果

试算一组名称. 这些名称视为同一文件夹中仅有的条目: 计数器按数组顺序取值, 冲突只在这些名称之间产生 (`duplicateInBatch`), 不检查已有文件或存储对字符的限制. 超过 2000 个名称时抛出 `LIMIT_EXCEEDED`.

```js
let results = files.batchRename.preview(['a.txt', 'b.txt', 'c.md'], {
    search: /^.+$/, replace: 'note_${start=1}', target: 'name', enumerate: true,
});
console.log(results.map(it => it.newName).join(', ')); // note_1.txt, note_2.txt, note_3.md
```

### files.batchRename.apply(plan, applyOptions?)

**`6.8.0`**

- **plan** { [BatchRenamePlan](#批量重命名方案-batchrenameplan) } - [plan](#filesbatchrenameplanpaths-options) 返回的方案
- **[ applyOptions ]** {{
    - onConflict?: `'fail'` | `'skip'` | `'number'` | `'overwrite'`;
    - onProgress?: (done: [number](dataTypes#number), total: [number](dataTypes#number), item: [BatchRenameResultItem](#批量重命名结果-batchrenameresult)) => [void](dataTypes#void);
- }} - 执行选项
- <ins>**returns**</ins> { [BatchRenameResult](#批量重命名结果-batchrenameresult) } - 执行结果

执行方案, 只改名状态为 `rename` 的条目. 脚本修改了条目的 `excluded`, 或以 `onConflict` 指定了与方案不同的 [冲突策略](#冲突策略-conflict-policies) 时, 插件以同一批目标与同一计算时刻重新计算方案后再执行, 因此计数器等取值可能随排除而变化.

执行前逐项核对: 条目必须仍然存在且类型不变, 文件的修改时间与大小必须与 plan 时相同, 否则该条目状态为 `stale` 且不改名, 其余条目照常执行. 嵌套条目先改深层再改浅层, 互换名称等循环改名经临时名称完成. 至少改名一个条目的批次记入撤销日志, 其 ID 为结果的 `batchId`.

每个方案至多执行一次, 再次执行抛出 `PLAN_STALE`. 方案被拒绝时抛出 `PLAN_REJECTED` 且不改名任何条目, 此时方案不会被消耗, 可改用其他 `onConflict` 再次执行.

`onProgress` 每处理完一个待改名条目调用一次: `done` 为已处理数, `total` 为待改名条目数, `item` 的结构与结果的 `items` 元素相同. `onProgress` 抛出的异常不会中断批次: 批次完成并记入日志后, apply 再抛出该异常.

```js
let plan = files.batchRename.plan('./photos', { search: /\s+/g, replace: '_' });
/* 排除名称以 "keep" 开头的条目. */
plan.items.forEach((it) => {
    if (it.name.startsWith('keep')) it.excluded = true;
});
let result = files.batchRename.apply(plan, {
    onConflict: 'number',
    onProgress: (done, total, item) => console.log(done + '/' + total, item.newPath),
});
console.log(result.batchId, result.undoable);
```

### files.batchRename.undo(target)

**`6.8.0`**

- **target** { [BatchRenameResult](#批量重命名结果-batchrenameresult) | [string](dataTypes#string) } - apply 的结果或批次 ID
- <ins>**returns**</ins> { [BatchRenameUndoResult](#批量重命名撤销结果-batchrenameundoresult) } - 撤销结果

撤销一个批次, 把其中仍持有新名称的条目改回原名, 浅层条目先恢复. 改名之后又被修改, 移动或删除的条目状态为 `stale`, 不会被恢复. 以 `overwrite` 策略替换的既有条目会从回收站恢复.

文件管理器产生的批次也可撤销 (批次 ID 见 [history](#filesbatchrenamehistorylimit)); 也可在 "重命名历史" 页面中撤销. 批次不存在, 已不在日志中, 或已没有可撤销的条目时抛出 `UNDO_UNAVAILABLE`. 恢复失败的条目 (状态 `failed`) 可再次调用 undo 重试.

```js
let result = files.batchRename('./notes', { search: 'draft', replace: 'final' });
let undone = files.batchRename.undo(result);
console.log(undone.state, undone.counts.restored); // restored ...
```

### files.batchRename.history(limit?)

**`6.8.0`**

- **[ limit ]** { [number](dataTypes#number) } - 最多返回的批次数, 为非负整数; 省略时返回全部批次
- <ins>**returns**</ins> { [BatchRenameHistoryEntry](#批量重命名历史-batchrenamehistoryentry)[] } - 批次列表

返回撤销日志中的批次, 最新的在前, 包括脚本与文件管理器产生的批次. 日志为脚本 (所有脚本共用) 与每个插件 (文件管理器的批次计入执行它的插件) 各保留最近若干个批次, 默认 20 个, 可在 "重命名历史" 页面的菜单中改为 50 或 100. 更早的批次被移出日志, 无法再撤销.

```js
/* 撤销最近一个仍可撤销的批次. */
let latest = files.batchRename.history().find(entry => entry.undoable);
if (latest) {
    console.log(latest.source, new Date(latest.createdAt));
    files.batchRename.undo(latest.batchId);
}
```

### files.batchRename.deleteHistory(target)

**`6.8.0`**

- **target** { [BatchRenameResult](#批量重命名结果-batchrenameresult) | [BatchRenameHistoryEntry](#批量重命名历史-batchrenamehistoryentry) | [string](dataTypes#string) } - apply 的结果, history 的元素或批次 ID
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否删除了该批次

从撤销日志中删除一个批次, 包括文件管理器产生的批次. 删除后该批次无法再撤销, 已改名的文件保持不变. 日志中没有该批次时返回 `false`. `target` 不是批次 ID 且不含批次 ID 时抛出 `INVALID_OPTIONS`.

```js
let result = files.batchRename('./notes', { search: 'draft', replace: 'final' });
console.log(files.batchRename.deleteHistory(result)); // true
console.log(files.batchRename.deleteHistory(result.batchId)); // false
```

### files.batchRename.clearHistory(options?)

**`6.8.0`**

- **[ options ]** {{ source?: `'script'` | `'explorer'` }} - 清理范围
- <ins>**returns**</ins> { [number](dataTypes#number) } - 删除的批次数

删除撤销日志中的全部批次, 或某个来源 (`'script'` 脚本, `'explorer'` 文件管理器) 的批次. 删除后这些批次无法再撤销, 已改名的文件保持不变. `source` 为其他值时抛出 `INVALID_OPTIONS`.

```js
/* 只清理脚本产生的批次. */
console.log(files.batchRename.clearHistory({ source: 'script' }));
```

### files.batchRename.presets()

**`6.8.0`**

- <ins>**returns**</ins> { {{ name: [string](dataTypes#string); options: [object](dataTypes#object) }}[] } - 命名预设列表

返回 Batch Rename 插件中保存的命名预设, 顺序与插件中的顺序相同. `options` 为预设的完整选项, 键与 [BatchRenameOptions](#批量重命名选项-batchrenameoptions) 相同, 值为字符串或布尔值 (如 `dateTime` 关闭时为 `'none'`).

命名预设在插件界面中保存, 加载, 重命名, 删除, 导入与导出 (顶栏 "预设" 按钮). 脚本可用 `options.preset` 引用预设, 或用 [importPresets](#filesbatchrenameimportpresetsjson-importoptions) 导入. 插件至多保存 100 个预设, 名称为 1 至 64 个字符.

```js
files.batchRename.presets().forEach(preset => console.log(preset.name, preset.options.replace));
```

### files.batchRename.importPresets(json, importOptions?)

**`6.8.0`**

- **json** { [string](dataTypes#string) | [object](dataTypes#object) } - 预设文档, 为插件导出的 JSON 文本或其解析后的对象
- **[ importOptions ]** {{ onConflict?: `'skip'` | `'overwrite'` | `'rename'` }} - 同名预设的处理方式, 默认 `'skip'`
- <ins>**returns**</ins> {{ imported: [string](dataTypes#string)[]; skipped: [string](dataTypes#string)[]; rejected: [object](dataTypes#object)[] }} - 导入结果

按顺序导入预设文档中的预设. 文档与插件导出的文件格式相同:

```json
{
    "format": "autojs6-batch-rename-presets",
    "version": 1,
    "presets": [
        { "name": "Date prefix", "options": { "search": "^", "regex": true, "replace": "$YYYY$MM$DD_", "includeFolders": false } }
    ]
}
```

`options` 使用 [BatchRenameOptions](#批量重命名选项-batchrenameoptions) 的键, 省略的键取默认值. 名称去除首尾空白后为 1 至 64 个字符. 已有同名预设时, `'skip'` 保留已有预设并在 `skipped` 中列出名称, `'overwrite'` 替换已有预设, `'rename'` 以 `名称 (n)` 形式的第一个可用名称保存.

`imported` 为实际保存的名称. 选项不合法, 或保存后会超过 100 个预设或总大小上限的条目被拒绝, 列入 `rejected` (元素为 `{ index, name, reason }`: `index` 为条目在 `presets` 中的位置, `reason` 为英文原因), 其余条目照常导入. 文档不是预设文档或版本不受支持时抛出 `INVALID_OPTIONS`, 超过 131072 个字符时抛出 `LIMIT_EXCEEDED`.

```js
let result = files.batchRename.importPresets({
    format: 'autojs6-batch-rename-presets',
    version: 1,
    presets: [
        { name: 'Date prefix', options: { search: '^', regex: true, replace: '$YYYY$MM$DD_', includeFolders: false } },
        { name: 'Broken', options: { onConflict: 'later' } },
    ],
});
console.log(result.imported); // ["Date prefix"]
console.log(result.rejected[0].index, result.rejected[0].name); // 1 Broken

/* 以预设计算方案, 显式给出的选项优先. */
let plan = files.batchRename.plan('./camera', { preset: 'Date prefix' });
```

### files.batchRename.isAvailable()

**`6.8.0`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

返回当前是否有已安装, 已启用, 已授权且与当前 AutoJs6 版本兼容的 Batch Rename 插件可用. 此方法不抛出插件相关的异常.

```js
if (!files.batchRename.isAvailable()) {
    toastLog('请先在插件中心安装并启用 Batch Rename 插件');
    exit();
}
```

### files.batchRename.planAsync(paths, options)

**`6.8.0`** **`Async`**

- **paths** { [string](dataTypes#string) | [string](dataTypes#string)[] } - 文件或文件夹路径
- **options** { [BatchRenameOptions](#批量重命名选项-batchrenameoptions) } - 重命名选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[BatchRenamePlan](#批量重命名方案-batchrenameplan)&gt; }

[plan](#filesbatchrenameplanpaths-options) 的异步形态. 参数错误同样以 Promise 拒绝.

### files.batchRename.previewAsync(nameOrItems, options)

**`6.8.0`** **`Async`**

- **nameOrItems** { [string](dataTypes#string) | [object](dataTypes#object) | ([string](dataTypes#string) | [object](dataTypes#object))[] } - 名称, 试算条目或其数组
- **options** { [BatchRenameOptions](#批量重命名选项-batchrenameoptions) } - 重命名选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[object](dataTypes#object) | [object](dataTypes#object)[]&gt; }

[preview](#filesbatchrenamepreviewitem-options) 的异步形态. 给出数组时以结果数组兑现.

### files.batchRename.applyAsync(plan, applyOptions?)

**`6.8.0`** **`Async`**

- **plan** { [BatchRenamePlan](#批量重命名方案-batchrenameplan) } - [plan](#filesbatchrenameplanpaths-options) 或 planAsync 返回的方案
- **[ applyOptions ]** {{ onConflict?: `'fail'` | `'skip'` | `'number'` | `'overwrite'`; onProgress?: [Function](dataTypes#function) }} - 执行选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[BatchRenameResult](#批量重命名结果-batchrenameresult)&gt; }

[apply](#filesbatchrenameapplyplan-applyoptions) 的异步形态. `onProgress` 在脚本线程调用.

```js
files.batchRename.planAsync('./downloads', { search: /[()]/g, replace: '', includeFolders: false })
    .then(plan => files.batchRename.applyAsync(plan, { onConflict: 'skip' }))
    .then(result => console.log(result.counts))
    .catch(e => console.error(e.toString()));
```

### files.batchRename.undoAsync(target)

**`6.8.0`** **`Async`**

- **target** { [BatchRenameResult](#批量重命名结果-batchrenameresult) | [string](dataTypes#string) } - apply 的结果或批次 ID
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[BatchRenameUndoResult](#批量重命名撤销结果-batchrenameundoresult)&gt; }

[undo](#filesbatchrenameundotarget) 的异步形态.

### files.batchRename.presetsAsync()

**`6.8.0`** **`Async`**

- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[object](dataTypes#object)[]&gt; }

[presets](#filesbatchrenamepresets) 的异步形态.

### files.batchRename.importPresetsAsync(json, importOptions?)

**`6.8.0`** **`Async`**

- **json** { [string](dataTypes#string) | [object](dataTypes#object) } - 预设文档
- **[ importOptions ]** {{ onConflict?: `'skip'` | `'overwrite'` | `'rename'` }} - 同名预设的处理方式, 默认 `'skip'`
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[object](dataTypes#object)&gt; }

[importPresets](#filesbatchrenameimportpresetsjson-importoptions) 的异步形态.

## files.getName(path)

- **path** { [string](dataTypes#string) } 路径
- <ins>**returns**</ins> { [string](dataTypes#string) }

返回文件的文件名. 例如 `files.getName("/sdcard/1.txt")` 返回 "1.txt".

## files.getNameWithoutExtension(path)

- **path** { [string](dataTypes#string) } 路径
- <ins>**returns**</ins> { [string](dataTypes#string) }

返回不含拓展名的文件的文件名. 例如 `files.getName("/sdcard/1.txt")` 返回 "1".

## files.getExtension(path)

- **path** { [string](dataTypes#string) } 路径
- <ins>**returns**</ins> { [string](dataTypes#string) }

返回文件的拓展名. 例如 `files.getExtension("/sdcard/1.txt")` 返回 "txt".

## files.remove(path)

- **path** { [string](dataTypes#string) } 路径
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

删除文件或 **空文件夹**, 返回是否删除成功.

## files.removeDir(path)

- **path** { [string](dataTypes#string) } 路径
- **path** { [string](dataTypes#string) } 路径
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

删除文件夹, 如果文件夹不为空, 则删除该文件夹的所有内容再删除该文件夹, 返回是否全部删除成功.

## files.getSdcardPath()

- <ins>**returns**</ins> { [string](dataTypes#string) }

返回 SD 卡路径. 所谓 SD 卡, 即外部存储器.

## [m] cwd

### files.cwd()

- <ins>**returns**</ins> { [string](dataTypes#string) | [null](dataTypes#null) } - 当前工作目录, 无可用目录时返回 `null`

返回脚本引擎的当前工作目录.

例如, 对于脚本文件 "/sdcard/脚本/1.js" 运行 `files.cwd()` 返回 "/sdcard/脚本/".

## [m] path

### files.path(relativePath?)

- **[ relativePath ]** { [string](dataTypes#string) } - 相对路径或绝对路径
- <ins>**returns**</ins> { [string](dataTypes#string) | [null](dataTypes#null) } - 解析后的路径

相对于 [files.cwd](#files_files_cwd) 解析路径. 绝对路径原样返回.

省略 **relativePath**, 当前工作目录不可用, 或路径中的 `..` 越过文件系统根目录时返回 `null`.

```js
files.path('./1.png');
```

## [m] getHumanReadableSize

### files.getHumanReadableSize(bytes, useIecIdentifier?)

- **bytes** { [number](dataTypes#number) } - 非负整数字节数
- **[ useIecIdentifier = false ]** { [boolean](dataTypes#boolean) } - 是否使用 KiB, MiB 等 IEC 单位名称
- <ins>**returns**</ins> { [string](dataTypes#string) }

将字节数转换为便于阅读的大小文本, 自动选择单位, 使用空格分隔数字与单位并保留一位小数. 此兼容方法使用与 `fmt.bytes` 相同的字节换算实现; 需要自定义输出时参阅 [fmt.bytes](fmt#m-bytes).

## [m] formatSizeWithUnit

### files.formatSizeWithUnit(bytes)

- **bytes** { [number](dataTypes#number) } - 非负整数字节数
- <ins>**returns**</ins> { [string](dataTypes#string) }

按系统区域格式输出文件大小. 小于 1000 B 时输出整数 B; 后续按 1024 换算, 依次使用 KiB, MiB, GiB 和 TiB. 每一级的切换阈值是前一级的 1000 倍, KiB 保留一位小数, MiB 及更大单位保留两位小数. 负数抛出异常.

## [m] getSimplifiedPath

### files.getSimplifiedPath(path)

- **path** { [string](dataTypes#string) } - 待简化的路径
- <ins>**returns**</ins> { [string](dataTypes#string) }

移除路径中可识别的存储根目录前缀, 便于显示. 依次匹配外部存储根目录, 运行应用的示例目录, 私有 files, cache 和 data 目录. 子路径保留起始 `/`, 根目录本身变为空字符串; 不匹配时原样返回. 不解析脚本相对路径, 不保证结果可再次作为文件定位路径使用.

## files.listDir(path[, filter])

- **path** { [string](dataTypes#string) } 路径
- **filter** { [Function](dataTypes#function) } 过滤函数, 可选. 接收一个 `string` 参数 (文件名), 返回一个 `boolean` 值.

列出文件夹 path 下的满足条件的文件和文件夹的名称的数组. 如果不加 filter 参数, 则返回所有文件和文件夹.

列出 sdcard 目录下所有文件和文件夹为:

```
let arr = files.listDir("/sdcard/");
log(arr);
```

列出脚本目录下所有 js 脚本文件为:

```
let dir = "/sdcard/脚本/";
let jsFiles = files.listDir(dir, function(name){
    return name.endsWith(".js") && files.isFile(files.join(dir, name));
});
log(jsFiles);
```

## open(path[, mode = "r", encoding = "utf-8", bufferSize = 8192])

- **path** { [string](dataTypes#string) } 文件路径, 例如 "/sdcard/1.txt".
- **mode** { [string](dataTypes#string) } 文件打开模式, 包括:
    * "r": 只读文本模式. 该模式下只能对文件执行 **文本** 读取操作.
    * "w": 只写文本模式. 该模式下只能对文件执行 **文本** 覆盖写入操作.
    * "a": 附加文本模式. 该模式下将会把写入的文本附加到文件末尾.
    * "rw": 随机读写文本模式. 该模式下将会把写入的文本附加到文件末尾.<br>
      目前暂不支持二进制模式, 随机读写模式.
- **encoding** { [string](dataTypes#string) } 字符编码.
- **bufferSize** { [number](dataTypes#number) } 文件读写的缓冲区大小.

打开一个文件. 根据打开模式返回不同的文件对象. 包括:

* "r": 返回一个 ReadableTextFile 对象.
* "w", "a": 返回一个 WritableTextFile 对象.

对于 "w" 模式, 如果文件并不存在, 则会创建一个, 已存在则会清空该文件内容; 其他模式文件不存在会抛出 FileNotFoundException.

# ReadableTextFile

可读文件对象.

## ReadableTextFile.read()

返回该文件剩余的所有内容的字符串.

## ReadableTextFile.read(maxCount)

- **maxCount** {Number} 最大读取的字符数量

读取该文件接下来最长为 maxCount 的字符串并返回. 即使文件剩余内容不足 maxCount 也不会出错.

## ReadableTextFile.readline()

读取一行并返回 (不包含换行符).

## ReadableTextFile.readlines()

读取剩余的所有行, 并返回它们按顺序组成的字符串数组.

## close()

关闭该文件.

**打开一个文件不再使用时务必关闭**

# PWritableTextFile

可写文件对象.

## PWritableTextFile.write(text)

- **text** { [string](dataTypes#string) } 文本

把文本内容 text 写入到文件中.

## PWritableTextFile.writeline(line)

- **text** { [string](dataTypes#string) } 文本

把文本 line 写入到文件中并写入一个换行符.

## PWritableTextFile.writelines(lines)

- **lines** { [Array](dataTypes#array) } 字符串数组

把很多行写入到文件中....

## PWritableTextFile.flush()

把缓冲区内容输出到文件中.

## PWritableTextFile.close()

关闭文件. 同时会被缓冲区内容输出到文件.

**打开一个文件写入后, 不再使用时务必关闭, 否则文件可能会丢失**

# 批量重命名选项 (BatchRenameOptions)

[files.batchRename](#m-batchrename), [files.batchRename.plan](#filesbatchrenameplanpaths-options) 与 [files.batchRename.preview](#filesbatchrenamepreviewitem-options) 的选项对象. 除 `search` 外均可省略 (给出 `preset` 时 `search` 也可省略, 取预设中的值), 值为 `null` 或 `undefined` 时取默认值. 类型不符或取值未知时抛出 `INVALID_OPTIONS`.

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| search | string \| RegExp | (必填) | 查找内容, 见下文 |
| replace | string | `''` | 替换文本, 可含 [替换变量](#替换变量-variables) |
| regex | boolean | `false` | 将字符串形式的 `search` 作为 ECMAScript 正则表达式 |
| matchAll | boolean | `false` | 替换全部匹配, 否则只替换第一个 |
| caseSensitive | boolean | `false` | 查找时区分大小写 |
| target | `'all'` \| `'name'` \| `'extension'` | `'all'` | 查找与替换作用于完整名称, 主文件名或扩展名 |
| includeFiles | boolean | `true` | 改名文件 |
| includeFolders | boolean | `true` | 改名文件夹, 包括 `paths` 中给出的文件夹自身 |
| includeSubfolders | boolean | `true` | 加入给出文件夹中的全部条目 (含各级子文件夹); 为 `false` 时只处理 `paths` 中给出的条目 |
| format | `'none'` \| `'lower'` \| `'upper'` \| `'title'` \| `'capitalize'` | `'none'` | 替换后的文本格式: 不变, 小写, 大写, 首字符大写, 每个以空白分隔的词首字符大写. 大小写转换跟随当前语言 |
| enumerate | boolean | `false` | 展开计数器 `${...}`, 否则作为字面文本 |
| random | boolean | `false` | 展开随机值 `${rstring...=N}` 与 `${ruuidv4}`, 否则作为字面文本 |
| dateTime | `'modified'` \| `'now'` \| `false` | `'modified'` | 日期时间变量取条目的修改时间或调用 plan 的时刻; 为 `false` 时日期时间变量作为字面文本 |
| normalize | `'nfc'` \| `'nfd'` \| `false` | `false` | Unicode 规范化 |
| halfWidth | boolean | `false` | 全角字符 (U+FF01 至 U+FF5E) 及全角空格转为半角 |
| sanitize | boolean | `false` | 把 `\`, `:`, `*`, `?`, `"`, `<`, `>`, `\|` 与控制字符替换为 `sanitizeReplacement`, 并在 Windows 保留设备名 (如 `CON`, `com1.txt`) 之后追加 `sanitizeReplacement` (为空时追加 `_`), 便于复制到 FAT32/exFAT 存储或 Windows |
| sanitizeReplacement | string | `'_'` | `sanitize` 使用的替换文本, 不能包含它所替换的字符或 `/` |
| trim | boolean | `false` | 去除开头的空白以及结尾的空白与点号 |
| continueNumbering | boolean | `false` | 计数器从相关文件夹已有名称中的最大序号之后继续 |
| onConflict | `'fail'` \| `'skip'` \| `'number'` \| `'overwrite'` | `'fail'` | [冲突策略](#冲突策略-conflict-policies) |
| conflictNumberPattern | string | `' ({n})'` | `'number'` 策略追加在主文件名之后的后缀, `{n}` 为序号; 必须包含 `{n}`, 不能包含 `/` |
| pinyin | boolean | `false` | 替换之后把名称中的汉字转为拼音, 见 [替换变量](#替换变量-variables) 中的汉字转拼音 |
| pinyinTone | `'none'` \| `'mark'` \| `'number'` | `'none'` | 拼音声调: 无 (`zhang`), 声调符号 (`zhāng`), 数字 (`zhang1`); 同时作用于 `${pinyin}` |
| pinyinSeparator | `'none'` \| `'space'` \| `'underscore'` \| `'hyphen'` | `'none'` | 相邻音节之间的分隔: 无, 空格, `_`, `-` |
| pinyinCase | `'lower'` \| `'capitalize'` | `'lower'` | 全部小写 (`zhangsan`), 或每个音节首字母大写 (`ZhangSan`) |
| pinyinInitials | boolean | `false` | 只保留每个音节的首字母 (不带声调) |
| metadata | boolean | `false` | 展开照片元数据变量, 见 [替换变量](#替换变量-variables); 不能用于 preview |
| preset | string | - | Batch Rename 插件中保存的命名预设的名称 (见 [presets](#filesbatchrenamepresets)). 以默认值为起点, 先应用预设的选项, 再应用本对象中给出的其他选项; 预设不存在时抛出 `INVALID_OPTIONS` |
| onProgress | function | - | 进度回调, 仅 [files.batchRename(paths, options)](#filesbatchrenamepaths-options) 使用, 与 apply 的 `applyOptions.onProgress` 相同 |

`search`, `replace` 及其他文本选项各自至多 4096 个字符, 超出时抛出 `LIMIT_EXCEEDED`.

`search` 为字符串时, `regex` 决定其为纯文本还是正则表达式源码, `matchAll` 与 `caseSensitive` 分别对应 `g` 与 `i` 标志. `search` 为 RegExp 时总按正则表达式处理, 此时忽略 `regex`, `matchAll` 与 `caseSensitive`: `g` 标志表示替换全部匹配, `i` 标志表示不区分大小写, `m`, `s`, `u`, `y` 标志照常生效. 正则表达式语法为 ECMAScript (与脚本中的 RegExp 一致). 单次匹配超过 1 秒或整个方案的匹配超过 30 秒时抛出 `LIMIT_EXCEEDED`. `search` 为空字符串时匹配全部条目但不替换文本, 可用于只应用文本格式与名称清理.

扩展名为文件名最后一个点号之后的文本. 文件夹, 不含点号的名称, 仅以点号开头的名称 (如 `.nomedia`) 及以点号结尾的名称没有扩展名, `target` 为 `'extension'` 时这些条目保持不变. `archive.tar.gz` 的主文件名为 `archive.tar`, 扩展名为 `gz`.

每个条目按以下顺序处理, 计算出的名称与原名称相同时状态为 `unchanged`:

1. 被排除的条目 (脚本排除或被 `includeFiles`, `includeFolders`, `includeSubfolders` 排除) 保持原名.
2. `target` 指定的部分不匹配 `search` 时保持原名.
3. 展开 `replace` 中的变量, 再执行替换.
4. 依次应用 `pinyin`, `format`, `normalize`, `halfWidth`, `sanitize` 与 `trim`, 最后与未参与替换的部分拼回名称.

## 替换变量 (Variables)

`replace` 中可使用以下变量. 变量对应的选项关闭时, 以及无法解析的写法, 都作为字面文本保留. `$$` 表示一个字面 `$`, 且其后的文本不会被识别为变量 (如 `$$YYYY` 得到 `$YYYY`).

正则表达式模式下, `replace` 还可使用 ECMAScript 替换记号, 如 `$1`, `$<name>` 与 `$&`. 纯文本模式下这些写法作为字面文本.

计数器 (需要 `enumerate: true`):

| 变量 | 说明 |
| --- | --- |
| `${}` | 从 0 开始, 每次加 1 |
| `${start=X}` | 起始值为 X (至多 15 位的整数, 可为负数) |
| `${increment=X}` | 增量为 X (至多 15 位的整数, 可为负数或 0) |
| `${padding=X}` | 至少 X 位 (0 至 255), 不足时在前面补 0 |
| `${start=10;increment=2;padding=4}` | 以 `;` 组合, 键的顺序任意 |

计数器按条目顺序取值, 只对新名称与原名称不同的条目递增. 计数器在冲突处理之前取值, 因此因冲突而未改名的条目同样占用一个序号. 同一 `replace` 中的多个计数器各自按自己的设置取值.

`continueNumbering` 按 `replace` 中第一个计数器两侧的字面文本, 在相关文件夹的已有名称中查找最大序号, 使第一个值大于它. 计数器两侧都没有字面文本, 增量不为正数, 或正则表达式模式下两侧的字面文本含 `$` 时, 计数器照常从起始值开始.

日期时间 (`dateTime` 不为 `false` 时可用, 区分大小写, 较长的名称优先, 如 `$MMM` 先于 `$MM`):

| 变量 | 说明 | 变量 | 说明 |
| --- | --- | --- | --- |
| `$YYYY` | 四位年份 | `$hh` | 两位小时 (24 小时制) |
| `$YY` | 年份后两位 | `$h` | 小时 |
| `$Y` | 年份最后一位 | `$mm` | 两位分钟 |
| `$MMMM` | 月份全称 | `$m` | 分钟 |
| `$MMM` | 月份简称 | `$ss` | 两位秒 |
| `$MM` | 两位月份 | `$s` | 秒 |
| `$M` | 月份 | `$fff` | 三位毫秒 |
| `$DDDD` | 星期全称 | `$ff` | 毫秒的前两位 |
| `$DDD` | 星期简称 | `$f` | 毫秒的第一位 |
| `$DD` | 两位日期 | | |
| `$D` | 日期 | | |

月份与星期的名称使用当前语言, 时间使用当前时区. 由于 `dateTime` 默认为 `'modified'`, `replace` 中 `$` 之后紧跟上述字母时会被识别为日期时间变量 (如 `$file` 得到 `$f` 的值加 `ile`), 需要字面 `$` 时写作 `$$`, 或设置 `dateTime: false`.

随机值 (需要 `random: true`):

| 变量 | 说明 |
| --- | --- |
| `${rstringalnum=N}` | N 个随机字母或数字 |
| `${rstringalpha=N}` | N 个随机字母 |
| `${rstringdigit=N}` | N 个随机数字 |
| `${ruuidv4}` | 随机 UUID (第 4 版, 小写) |

N 为 1 至 256, 超过 256 时抛出 `LIMIT_EXCEEDED`.

汉字转拼音:

| 变量 | 说明 |
| --- | --- |
| `${pinyin}` | `target` 所指部分的原名称的拼音, 无需开启 `pinyin`; 风格由 `pinyinTone`, `pinyinSeparator`, `pinyinCase` 与 `pinyinInitials` 决定 |

`pinyin` 为 `true` 时, 替换之后把名称中的汉字转为拼音, 非汉字原样保留. 拼音按插件内置的单字与词组词典转换, 多音字按词组判断, 繁体字同样转换. 音节分隔符只出现在相邻的两个音节之间 (如 `我的照片 2024` 在 `pinyinSeparator: 'underscore'` 时为 `wo_de_zhao_pian 2024`). 无声调与数字声调时 `ü` 写作 `v` (`绿色` 为 `lvse` 或 `lv4se4`), 名称保持为 ASCII 字符; 轻声不加数字. `pinyinInitials` 只保留每个音节的首字母 (`北京大学` 为 `bjdx`). `$${pinyin}` 得到字面的 `${pinyin}`.

照片元数据 (需要 `metadata: true`, 否则作为字面文本):

| 变量 | 说明 | 示例 |
| --- | --- | --- |
| `$CAMERA_MAKE` | 相机厂商 | `Canon` |
| `$CAMERA_MODEL` | 相机型号 | `EOS R5` |
| `$LENS` | 镜头型号 | `RF50mm F1.8` |
| `$ISO` | 感光度 | `400` |
| `$APERTURE` | 光圈, 保留一位小数 | `f2.8`, `f8` |
| `$SHUTTER` | 快门速度; 1 秒以下写作分数, 斜线改为短横线 | `1-250s`, `2s`, `1.5s` |
| `$FOCAL` | 焦距, 保留一位小数 | `50mm`, `4.2mm` |
| `$FLASH` | 是否闪光 | `On`, `Off` |
| `$WIDTH` | 宽度 (像素) | `4032` |
| `$HEIGHT` | 高度 (像素) | `3024` |
| `$AUTHOR` | 作者 | |
| `$COPYRIGHT` | 版权 | |
| `$LATITUDE` | 纬度, 十进制度, 6 位小数, 南纬为负 | `31.230416` |
| `$LONGITUDE` | 经度, 十进制度, 6 位小数, 西经为负 | `-121.473701` |
| `$ALTITUDE` | 海拔, 取整到米 | `120m` |
| `$DATE_TAKEN_YYYY` | 拍摄时间的四位年份 | `2026` |
| `$DATE_TAKEN_YY` | 年份后两位 | `26` |
| `$DATE_TAKEN_MM` | 两位月份 | `10` |
| `$DATE_TAKEN_DD` | 两位日期 | `15` |
| `$DATE_TAKEN_HH` | 两位小时 (24 小时制) | `08` |
| `$DATE_TAKEN_mm` | 两位分钟 | `30` |
| `$DATE_TAKEN_SS` | 两位秒 | `59` |
| `$EXPOSURE_BIAS` | 曝光补偿, 保留一位小数 | `+0.3EV`, `0EV`, `-1EV` |
| `$ORIENTATION` | 方向: 顺时针旋转角度, 镜像时加 `M` | `0`, `90`, `180M` |
| `$COLOR_SPACE` | 色彩空间 | `sRGB`, `AdobeRGB`, `Uncalibrated` |

元数据变量区分大小写 (`$DATE_TAKEN_MM` 为月, `$DATE_TAKEN_mm` 为分), 先于日期时间变量识别, 较长的名称优先 (`$DATE_TAKEN_YYYY` 不会被识别为 `$D`). 取值与语言无关且可直接用于文件名, 文本值中的 `/` 替换为 `-`.

`metadata` 为 `true` 且 `replace` 含元数据变量时, AutoJs6 读取图片文件 (JPEG, PNG, WebP, HEIF 及 DNG, CR2, NEF, ARW 等 RAW 格式) 的 EXIF, 作者与版权缺失时读取 XMP, 只读不改. 文件中没有的值 (以及文件夹与非图片文件) 展开为空文本, 对应条目的 `metadataMissing` 为 `true`. `$DATE_TAKEN_*` 使用照片记录的当地时间, 不换算时区; 缺失时改用条目的修改时间, 不计为缺失.

```js
/* 用计数器为照片重新编号: a.jpg, b.jpg -> trip_01.jpg, trip_02.jpg. */
files.batchRename('./trip', {
    search: /^.+$/,
    replace: 'trip_${start=1;padding=2}',
    target: 'name',
    enumerate: true,
    includeFolders: false,
});

/* 只转为小写, 不替换文本. */
files.batchRename('./music', { search: '', format: 'lower', includeFolders: false });

/* 汉字转拼音: 张三.txt -> ZhangSan_张三.txt. */
console.log(files.batchRename.preview('张三.txt', { search: /^/, replace: '${pinyin}_', target: 'name', pinyinCase: 'capitalize' }).newName);

/* 拍摄日期与相机型号: DSC_0001.NEF -> 20090210_NIKON D90.NEF. */
let plan = files.batchRename.plan('./photos', {
    search: /^.+$/,
    replace: '$DATE_TAKEN_YYYY$DATE_TAKEN_MM$DATE_TAKEN_DD_$CAMERA_MODEL',
    target: 'name',
    metadata: true,
    includeFolders: false,
});
plan.items.filter(it => it.metadataMissing).forEach(it => console.log('missing metadata: ' + it.name));
```

## 冲突策略 (Conflict Policies)

同一文件夹中, 新名称与本批另一条目的新名称相同 (`duplicateInBatch`), 或与不改名的既有条目相同 (`existingEntry`) 时产生冲突. 在不区分大小写的存储 (如 FAT32/exFAT 格式的 SD 卡) 上按不区分大小写比较.

| 策略 | 行为 |
| --- | --- |
| `'fail'` | 方案被拒绝 (`rejected` 为 `true`), 所有冲突条目的状态为 `conflict` |
| `'skip'` | 冲突条目保留原名 (状态为 `conflict`), 其余条目照常改名 |
| `'number'` | 在主文件名之后追加 `conflictNumberPattern`, 取 1 至 999 中第一个可用的序号 (如 `photo (1).jpg`); 无可用序号时状态为 `conflict` (`numbersExhausted`) |
| `'overwrite'` | 替换同名的既有条目, 被替换的条目先移入 AutoJs6 回收站, 撤销时恢复; 本批内的重名仍为冲突 |

在后三种策略下, 本批内重名的一组条目中, 顺序最前的条目保留该名称. 存在新名称非法的条目 (状态 `invalid`) 时, 方案总会被拒绝.

# 批量重命名方案 (BatchRenamePlan)

[files.batchRename.plan](#filesbatchrenameplanpaths-options) 的返回值.

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| id | string | 方案 ID |
| options | object | 补全默认值后的选项. RegExp 形式的 `search` 记为其 `source`, 并按其标志给出 `regex`, `matchAll`, `caseSensitive` 及 `regexFlags` (`m`, `s`, `u`, `y` 中的标志). 使用 `preset` 时为插件合并后的完整选项 (默认值, 预设, 显式选项依次覆盖), apply 按这份选项执行, 之后修改预设不影响该方案 |
| items | object[] | 条目, 见下文 |
| counts | object | 各状态的条目数: `rename`, `unchanged`, `conflict`, `invalid`, `excluded` |
| rejected | boolean | 存在 `invalid` 条目, 或 `onConflict` 为 `'fail'` 且存在 `conflict` 条目时为 `true`; 执行被拒绝的方案将抛出 `PLAN_REJECTED` |

`items` 的元素 (BatchRenamePlanItem):

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| path | string | 绝对路径 |
| name | string | 当前名称 |
| kind | `'file'` \| `'dir'` | 文件或文件夹 |
| depth | number | `paths` 中给出的条目为 0, 其下每层加 1 |
| newName | string | 新名称. 不改名的条目为当前名称, `conflict` 与 `invalid` 条目为计算出但不能使用的名称 |
| status | string | `'rename'` 将改名, `'unchanged'` 名称不变, `'conflict'` 冲突, `'invalid'` 新名称非法, `'excluded'` 被排除 |
| reason | string \| null | 状态的原因, 见下表 |
| excluded | boolean | 脚本排除标志. 设为 `true` 后执行时该条目不改名 (原因为 `excludedByCaller`). 被 `includeFiles` 等选项排除的条目此值为 `false`, 状态为 `excluded`, 原因为 `notIncluded` |
| overwrites | boolean | 执行时将替换同名的既有条目 (`onConflict` 为 `'overwrite'`) |
| metadataMissing | boolean | 新名称用到的照片元数据变量中有缺失的值 (已展开为空文本); 未开启 `metadata` 时为 `false` |

| reason | status | 含义 |
| --- | --- | --- |
| noMatch | unchanged | 作用部分不匹配 `search`, 或 `target` 为 `'extension'` 而条目没有扩展名 |
| sameName | unchanged | 计算出的名称与当前名称相同 |
| excludedByCaller | excluded | 脚本将 `excluded` 设为 `true` |
| notIncluded | excluded | 被 `includeFiles`, `includeFolders` 或 `includeSubfolders` 排除 |
| duplicateInBatch | conflict | 本批另一条目在同一文件夹中得到相同名称 |
| existingEntry | conflict | 名称已被不改名的既有条目占用 |
| numbersExhausted | conflict | `'number'` 策略在 999 以内没有可用的序号 |
| numbered | rename | `'number'` 策略追加了序号 |
| overwrite | rename | `'overwrite'` 策略将替换既有条目 |
| empty | invalid | 名称为空 |
| dotName | invalid | 名称为 `.` 或 `..` |
| separator | invalid | 名称包含 `/` 或 NUL 字符 |
| tooLong | invalid | 名称超过 255 个 UTF-8 字节 |
| restrictedCharacter | invalid | 所在存储 (如 FAT32/exFAT) 不允许名称中的某个字符, 可开启 `sanitize` |

# 批量重命名结果 (BatchRenameResult)

[files.batchRename(paths, options)](#filesbatchrenamepaths-options) 与 [files.batchRename.apply](#filesbatchrenameapplyplan-applyoptions) 的返回值.

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| batchId | string \| null | 撤销日志中的批次 ID, 没有待改名的条目时为 `null` |
| counts | object | 各状态的条目数: `renamed`, `skipped`, `failed`, `stale`, `excluded` |
| items | object[] | 与方案的 `items` 一一对应, 见下文 |
| undoable | boolean | 是否有可撤销的条目 |

`items` 的元素 (BatchRenameResultItem, 也是 `onProgress` 的 `item` 参数):

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| path | string | 执行前的路径 |
| newPath | string | 执行后的路径, 已计入上层文件夹的改名 |
| status | string | `'renamed'` 已改名, `'skipped'` 方案中不改名 (`unchanged` 或 `conflict`), `'failed'` 改名失败, `'stale'` 方案计算后被修改, `'excluded'` 被排除 |
| reason | string \| null | 原因. `skipped` 与 `excluded` 条目为方案中的原因, 其他见下表 |

| reason | status | 含义 |
| --- | --- | --- |
| missing | stale | 条目已不存在 |
| kindChanged | stale | 条目在文件与文件夹之间发生了变化 |
| changed | stale | 文件的修改时间或大小已变化 |
| occupied | failed | 新名称已被占用 |
| trashFailed | failed | `'overwrite'` 策略无法将既有条目移入回收站 |
| ioFailed | failed | 文件系统拒绝改名 |

# 批量重命名撤销结果 (BatchRenameUndoResult)

[files.batchRename.undo](#filesbatchrenameundotarget) 的返回值.

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| batchId | string | 批次 ID |
| state | string | `'restored'` 本次处理的条目全部恢复, `'recoveryRequired'` 部分条目未能恢复 |
| counts | object | 各状态的条目数: `restored`, `stale`, `failed` |
| items | object[] | 本次处理的条目: `path` (撤销前的路径), `newPath` (撤销后的路径), `status` (`'restored'`, `'stale'` 或 `'failed'`) 与 `reason` |
| undoable | boolean | 是否仍有可撤销的条目 (如恢复失败的条目) |

`stale` 条目的原因与 [结果](#批量重命名结果-batchrenameresult) 相同 (改名之后条目又被删除或修改). `failed` 条目的原因为 `occupied` (原名称已被占用), `ioFailed`, 或 `replacedNotRestored` (条目已恢复原名, 但被 `'overwrite'` 替换的既有条目未能从回收站恢复, 此类条目不能再次撤销).

# 批量重命名历史 (BatchRenameHistoryEntry)

[files.batchRename.history](#filesbatchrenamehistorylimit) 返回的数组元素.

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| batchId | string | 批次 ID |
| source | string | `'script'` 脚本, `'explorer'` 文件管理器 |
| state | string | `'committed'` 全部改名, `'partial'` 部分改名, `'rejected'` 没有条目改名, `'restored'` 已撤销, `'recoveryRequired'` 撤销未全部成功 |
| createdAt | number | 创建时间 (毫秒时间戳) |
| updatedAt | number | 最近一次更新时间 (毫秒时间戳) |
| counts | object | `renamed` 曾改名的条目数, `notRenamed` 未改名的条目数, `restored` 已恢复的条目数 |
| undoable | boolean | 是否有可撤销的条目 |

# 批量重命名错误 (BatchRenameError)

## new files.batchRename.BatchRenameError(message, code?)

**`6.8.0`**

- **message** { [string](dataTypes#string) } - 错误消息
- **[ code = `'INTERNAL'` ]** { [string](dataTypes#string) } - 错误代码
- <ins>**returns**</ins> { [BatchRenameError](#批量重命名错误-batchrenameerror) }

[files.batchRename](#m-batchrename) 抛出的错误 (含异步形态 Promise 拒绝的原因) 都是 `name` 为 `'BatchRenameError'` 的 JavaScript [Error](exceptions#error), 可用 `instanceof files.batchRename.BatchRenameError` 判断. `message` 不可枚举, `toString()` 返回 `BatchRenameError [code]: message`. `onProgress` 回调自身抛出的值保持原样. 脚本也可自行构造.

```js
try {
    files.batchRename('./missing-folder', { search: 'a', replace: 'b' });
} catch (e) {
    if (e instanceof files.batchRename.BatchRenameError) {
        console.log(e.code); // INVALID_PATHS
        console.log(e.toString()); // BatchRenameError [INVALID_PATHS]: path does not exist: ...
    }
}
```

## [p#] name

**`6.8.0`**

- { `'BatchRenameError'` }

## [p#] code

**`6.8.0`**

- { [string](dataTypes#string) }

错误代码:

| code | 含义 |
| --- | --- |
| PLUGIN_UNAVAILABLE | 未安装 Batch Rename 插件, 或无法连接插件 |
| PLUGIN_DISABLED | 插件已安装, 但在插件中心被停用或未授权 |
| PLUGIN_INCOMPATIBLE | 插件与当前 AutoJs6 版本不兼容, 或插件版本过低, 不支持所用的选项或方法 (汉字转拼音, 照片元数据与命名预设需要 Batch Rename 1.1.0 及以上版本) |
| INVALID_OPTIONS | 选项的类型或取值不合法, 正则表达式无法编译, apply 的参数不是 plan 返回的方案, 方案的条目被增删, 预设不存在, preview 的名称不合法或使用了 `metadata`, 预设文档无法识别, 或 deleteHistory / clearHistory 的参数不合法 |
| INVALID_PATHS | `paths` 为空, 路径不存在, 为根目录或为符号链接 |
| LIMIT_EXCEEDED | 超出条目, 文件夹, 名称数量, 层数, 文本长度, 随机值长度或预设文档长度上限, 或正则表达式匹配超时 |
| PLAN_REJECTED | 方案含非法名称, 或 `onConflict` 为 `'fail'` 时存在冲突 |
| PLAN_STALE | 方案已执行过, 不属于当前脚本, 或已不在最近 16 个方案之中 |
| IO_FAILED | 无法列出文件夹或无法写入撤销日志 |
| UNDO_UNAVAILABLE | 批次不存在, 已不在日志中, 已没有可撤销的条目, 或 undo 的参数既不是批次 ID 也不是 apply 的结果 |
| INTERNAL | 其他未归类错误 |
