# 压缩文件 (Zip)

zip 模块用于创建, 打开, 修改和解压 ZIP 文件.

此模块自 AutoJs6 6.7.0 起提供, 底层使用 Zip4j. `zip` 与 `$zip` 指向同一个可调用模块对象.

AutoJs6 6.8.0 的 zip 模块仍为内置功能, 不需要安装外置插件.

本页中的文件系统相对路径均按当前脚本工作目录解析.

---

<p style="font: bold 2em sans-serif; color: #FF7043">zip</p>

---

## [@] zip

### zip(zipPath)

**`6.7.0`**

- **zipPath** { [string](dataTypes#string) } - ZIP 文件路径
- <ins>**returns**</ins> { [ZipFileHandle](#zipfilehandle) } - ZIP 操作对象

打开一个 ZIP 文件操作对象.

此调用与 `zip.open(zipPath)` 等价.

```js
let archive = zip('./backup.zip');
console.log(archive.path);
console.log(archive.isValidZipFile());
```

## [m] open

### open(zipPath, options?)

**`6.7.0`** **`Overload [1-2]/2`**

- **zipPath** { [string](dataTypes#string) } - ZIP 文件路径
- **[ options = `{}` ]** { [ZipOpenOptions](#zipopenoptions) } - 压缩和解压选项
- <ins>**returns**</ins> { [ZipFileHandle](#zipfilehandle) } - ZIP 操作对象

打开一个 ZIP 文件操作对象.

此方法只创建操作对象. 可通过返回对象继续添加, 删除或解压成员.

## [m] zipFile

### zipFile(filePath, destZipPath, options?)

**`6.7.0`** **`Overload [1-2]/3`**

- **filePath** { [string](dataTypes#string) } - 待压缩文件路径
- **destZipPath** { [string](dataTypes#string) | [null](dataTypes#null) | [undefined](dataTypes#undefined) } - 目标 ZIP 路径
- **[ options = `{}` ]** { [ZipOptions](#zipoptions) } - 压缩选项
- <ins>**returns**</ins> { [ZipFileHandle](#zipfilehandle) } - 已完成添加操作的 ZIP 对象

将一个文件添加到 ZIP 文件.

`destZipPath` 为 `null` 或 `undefined` 时, 目标文件名为源文件名去除扩展名后添加 `.zip`, 并位于当前脚本工作目录.

### zipFile(filePath, options)

**`6.7.0`** **`Overload 3/3`**

- **filePath** { [string](dataTypes#string) } - 待压缩文件路径
- **options** { [ZipOptions](#zipoptions) } - 压缩选项
- <ins>**returns**</ins> { [ZipFileHandle](#zipfilehandle) } - 已完成添加操作的 ZIP 对象

将一个文件添加到自动命名的 ZIP 文件.

目标文件名为源文件名去除扩展名后添加 `.zip`, 并位于当前脚本工作目录.

```js
let archive = zip.zipFile('./reports/today.txt', {
    compressionLevel: 'MAXIMUM',
});

console.log(archive.path);
```

## [m] zipDir

### zipDir(dirPath, destZipPath, options?)

**`6.7.0`** **`Overload [1-2]/3`**

- **dirPath** { [string](dataTypes#string) } - 待压缩目录路径
- **destZipPath** { [string](dataTypes#string) | [null](dataTypes#null) | [undefined](dataTypes#undefined) } - 目标 ZIP 路径
- **[ options = `{}` ]** { [ZipOptions](#zipoptions) } - 压缩选项
- <ins>**returns**</ins> { [ZipFileHandle](#zipfilehandle) } - 已完成目录压缩操作的 ZIP 对象

将目录压缩为 ZIP 文件.

`destZipPath` 为 `null` 或 `undefined` 时, 目标文件名为源目录名去除扩展名后添加 `.zip`, 并位于当前脚本工作目录.

### zipDir(dirPath, options)

**`6.7.0`** **`Overload 3/3`**

- **dirPath** { [string](dataTypes#string) } - 待压缩目录路径
- **options** { [ZipOptions](#zipoptions) } - 压缩选项
- <ins>**returns**</ins> { [ZipFileHandle](#zipfilehandle) } - 已完成目录压缩操作的 ZIP 对象

将目录压缩为自动命名的 ZIP 文件.

目标文件名为源目录名去除扩展名后添加 `.zip`, 并位于当前脚本工作目录.

## [m] zipFiles

### zipFiles(filePathList, destZipPath, options?)

**`6.7.0`** **`Overload [1-2]/3`**

- **filePathList** { [string](dataTypes#string)[[]](dataTypes#array) | java.lang.Iterable } - 待压缩文件或目录路径
- **destZipPath** { [string](dataTypes#string) | [null](dataTypes#null) | [undefined](dataTypes#undefined) } - 目标 ZIP 路径
- **[ options = `{}` ]** { [ZipOptions](#zipoptions) } - 压缩选项
- <ins>**returns**</ins> { [ZipFileHandle](#zipfilehandle) } - 已完成添加操作的 ZIP 对象

将多个文件或目录添加到 ZIP 文件.

列表中的每个路径必须存在.

### zipFiles(filePathList, options)

**`6.7.0`** **`Overload 3/3`**

- **filePathList** { [string](dataTypes#string)[[]](dataTypes#array) | java.lang.Iterable } - 待压缩文件或目录路径
- **options** { [ZipOptions](#zipoptions) } - 压缩选项
- <ins>**returns**</ins> { [ZipFileHandle](#zipfilehandle) } - 已完成添加操作的 ZIP 对象

将多个文件或目录添加到自动命名的 ZIP 文件.

自动命名规则如下:

- 只有一个源路径时, 使用源名称去除扩展名后添加 `.zip`
- 多个源路径共享同一个基准目录时, 使用该目录名称添加 `.zip`
- 其他情况使用 `yyyyMMdd-HHmmss-XXXX.zip`, 其中 `XXXX` 为 4 个大写随机十六进制字符

自动命名的 ZIP 文件位于当前脚本工作目录.

## [m] unzip

### unzip(zipPath, destPath, options?)

**`6.7.0`** **`Overload [1-2]/3`**

- **zipPath** { [string](dataTypes#string) } - ZIP 文件路径
- **destPath** { [string](dataTypes#string) | [null](dataTypes#null) | [undefined](dataTypes#undefined) } - 解压目标目录
- **[ options = `{}` ]** { [UnzipOptions](#unzipoptions) } - 解压选项
- <ins>**returns**</ins> { [ZipFileHandle](#zipfilehandle) } - 已完成解压操作的 ZIP 对象

将 ZIP 文件的全部成员解压到目标目录.

`destPath` 为 `null` 或 `undefined` 时, 使用当前脚本工作目录.

### unzip(zipPath, options)

**`6.7.0`** **`Overload 3/3`**

- **zipPath** { [string](dataTypes#string) } - ZIP 文件路径
- **options** { [UnzipOptions](#unzipoptions) } - 解压选项
- <ins>**returns**</ins> { [ZipFileHandle](#zipfilehandle) } - 已完成解压操作的 ZIP 对象

将 ZIP 文件的全部成员解压到当前脚本工作目录.

```js
zip.unzip('./backup.zip', './restored', {
    password: 'secret',
});
```

---

## ZipFileHandle

ZIP 操作对象. 模块便捷方法完成对应操作后仍返回此对象, 可继续修改或查询同一个 ZIP 文件.

## [p#] ZipFileHandle#name

**`6.7.0`** **`READONLY`**

- { [string](dataTypes#string) }

创建对象的操作名称.

可能的值为 `open`, `zipFile`, `zipDir`, `zipFiles` 或 `unzip`.

## [p#] ZipFileHandle#path

**`6.7.0`** **`READONLY`**

- { [string](dataTypes#string) }

ZIP 文件的绝对路径.

## [p#] ZipFileHandle#options

**`6.7.0`** **`READONLY`**

- { [Object](dataTypes#object) }

创建此对象时使用的选项对象. 未提供选项时为空对象.

## [p#] ZipFileHandle#zipFile

**`6.7.0`** **`READONLY`**

- { net.lingala.zip4j.ZipFile }

底层 Zip4j `ZipFile` 对象.

## [p#] ZipFileHandle#zipParameters

**`6.7.0`** **`READONLY`**

- { net.lingala.zip4j.model.ZipParameters }

从创建选项构建的 Zip4j 压缩参数.

## [p#] ZipFileHandle#unzipParameters

**`6.7.0`** **`READONLY`**

- { net.lingala.zip4j.model.UnzipParameters }

从创建选项构建的 Zip4j 解压参数.

## [m#] ZipFileHandle#addFile

### ZipFileHandle#addFile(filePath, options?)

**`6.7.0`** **`Overload [1-2]/2`**

- **filePath** { [string](dataTypes#string) } - 待添加文件路径
- **[ options ]** { [ZipOptions](#zipoptions) } - 本次添加操作的压缩选项
- <ins>**returns**</ins> { [void](dataTypes#void) }

向 ZIP 文件添加一个文件.

## [m#] ZipFileHandle#addFiles

### ZipFileHandle#addFiles(filePathList, options?)

**`6.7.0`** **`Overload [1-2]/2`**

- **filePathList** { [string](dataTypes#string)[[]](dataTypes#array) | java.lang.Iterable } - 待添加文件路径
- **[ options ]** { [ZipOptions](#zipoptions) } - 本次添加操作的压缩选项
- <ins>**returns**</ins> { [void](dataTypes#void) }

向 ZIP 文件添加多个文件.

## [m#] ZipFileHandle#addFolder

### ZipFileHandle#addFolder(dirPath, options?)

**`6.7.0`** **`Overload [1-2]/2`**

- **dirPath** { [string](dataTypes#string) } - 待添加目录路径
- **[ options ]** { [ZipOptions](#zipoptions) } - 本次添加操作的压缩选项
- <ins>**returns**</ins> { [void](dataTypes#void) }

向 ZIP 文件添加一个目录.

## [m#] ZipFileHandle#extractAll

### ZipFileHandle#extractAll(destPath, options?)

**`6.7.0`** **`Overload [1-2]/2`**

- **destPath** { [string](dataTypes#string) } - 解压目标目录
- **[ options ]** { [UnzipOptions](#unzipoptions) } - 本次解压操作的选项
- <ins>**returns**</ins> { [void](dataTypes#void) }

将 ZIP 文件的全部成员解压到目标目录.

## [m#] ZipFileHandle#extractFile

### ZipFileHandle#extractFile(fileName, destPath, options?, newFileName?)

**`6.7.0`** **`Overload [1-3]/3`**

- **fileName** { [string](dataTypes#string) } - 待解压成员名称
- **destPath** { [string](dataTypes#string) } - 解压目标目录
- **[ options ]** { [UnzipOptions](#unzipoptions) } - 本次解压操作的选项
- **[ newFileName ]** { [string](dataTypes#string) } - 解压后的新文件名
- <ins>**returns**</ins> { [void](dataTypes#void) }

解压指定 ZIP 成员.

提供 `newFileName` 时, 第 3 个参数必须是选项对象.

AutoJs6 6.8.0 的当前实现会先按脚本工作目录解析 `fileName`, 再将解析后的路径交给 Zip4j 作为成员名称. 因此相对成员名称不会原样传递.

## [m#] ZipFileHandle#setPassword

### ZipFileHandle#setPassword(password)

**`6.7.0`**

- **password** { [string](dataTypes#string) } - ZIP 密码
- <ins>**returns**</ins> { [void](dataTypes#void) }

设置底层 Zip4j 对象用于后续读取或修改操作的密码.

此方法不会单独启用新成员加密. 添加加密成员时, 应在 [ZipOptions](#zipoptions) 中提供 `password` 或同时设置 `encryptFiles` 和所需加密参数.

## [m#] ZipFileHandle#getFileHeader

### ZipFileHandle#getFileHeader(fileName)

**`6.7.0`**

- **fileName** { [string](dataTypes#string) } - ZIP 内的相对成员名称
- <ins>**returns**</ins> { [ZipFileHeader](#zipfileheader) } - Zip4j 文件头对象

按完整成员名称查询文件头.

名称不匹配任何成员时, 当前实现会抛出异常.

```js
let archive = zip('./backup.zip');
let header = archive.getFileHeader('today.txt');

console.log(header.fileName);
console.log(header.crc);
```

## [m#] ZipFileHandle#getFileHeaders

### ZipFileHandle#getFileHeaders()

**`6.7.0`**

- <ins>**returns**</ins> { [ZipFileHeader](#zipfileheader)[[]](dataTypes#array) } - 全部 Zip4j 文件头对象

返回 ZIP 文件的全部文件头.

## [m#] ZipFileHandle#isEncrypted

### ZipFileHandle#isEncrypted()

**`6.7.0`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - ZIP 文件是否包含加密成员

检查 ZIP 文件是否加密.

## [m#] ZipFileHandle#removeFile

### ZipFileHandle#removeFile(fileName)

**`6.7.0`**

- **fileName** { [string](dataTypes#string) } - ZIP 内的相对成员名称
- <ins>**returns**</ins> { [void](dataTypes#void) }

删除指定 ZIP 成员.

## [m#] ZipFileHandle#isValidZipFile

### ZipFileHandle#isValidZipFile()

**`6.7.0`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否为有效 ZIP 文件

检查当前路径是否指向可由 Zip4j 读取的有效 ZIP 文件.

## [m#] ZipFileHandle#getPath

### ZipFileHandle#getPath()

**`6.7.0`**

- <ins>**returns**</ins> { [string](dataTypes#string) } - ZIP 文件绝对路径

返回 [path](#p-zipfilehandle-path) 属性.

## [m#] ZipFileHandle#getZipFile

### ZipFileHandle#getZipFile()

**`6.7.0`**

- <ins>**returns**</ins> { net.lingala.zip4j.ZipFile } - 底层 Zip4j 对象

返回 [zipFile](#p-zipfilehandle-zipfile) 属性.

## [m#] ZipFileHandle#toString

### ZipFileHandle#toString()

**`6.7.0`**

- <ins>**returns**</ins> { [string](dataTypes#string) } - ZIP 对象的可读字符串

返回包含操作名称, ZIP 路径和选项的对象描述.

---

## ZipOpenOptions

- { [ZipOptions](#zipoptions) & [UnzipOptions](#unzipoptions) }

[zip.open](#m-open) 使用的共享选项类型.

## ZipOptions

压缩选项. 所有属性均可选.

模块便捷方法会将未提供的选项规范化为空对象, 因此使用下表中的默认值. `ZipFileHandle#addFile`, `addFiles` 和 `addFolder` 完全省略选项时, 会直接使用 Zip4j 默认压缩参数. 此时 `encryptionMethod` 为 `NONE`, 但两种情况默认都不会启用加密.

| 属性 | 类型 | 默认值 | 描述 |
|---|---|---|---|
| `aesKeyStrength` | [number](dataTypes#number) / [string](dataTypes#string) / Zip4j 枚举 | `256` | AES 密钥强度 |
| `aesVersion` | [number](dataTypes#number) / [string](dataTypes#string) / Zip4j 枚举 | `TWO` | AES 格式版本 |
| `compressionLevel` | [number](dataTypes#number) / [string](dataTypes#string) / Zip4j 枚举 | `NORMAL` | DEFLATE 压缩级别 |
| `compressionMethod` | [number](dataTypes#number) / [string](dataTypes#string) / Zip4j 枚举 | `DEFLATE` | 压缩方法 |
| `encryptionMethod` | [number](dataTypes#number) / [string](dataTypes#string) / Zip4j 枚举 | `AES` | 启用加密时使用的加密方法 |
| `password` | [string](dataTypes#string) | - | 设置密码并强制启用成员加密 |
| `isEncryptFiles` / `encryptFiles` | [boolean](dataTypes#boolean) | `false` | 是否加密新增成员 |
| `defaultFolderPath` | [string](dataTypes#string) | - | 传递给 Zip4j 的默认目录路径 |
| `entryCRC` | [number](dataTypes#number) | `0` | 传递给 Zip4j 的成员 CRC 校验和值 |
| `entrySize` | [number](dataTypes#number) | `-1` | 传递给 Zip4j 的成员大小 |
| `excludeFileFilter` | [Function](dataTypes#function) / net.lingala.zip4j.model.ExcludeFileFilter | - | 排除文件的过滤器 |
| `fileComment` / `comment` | [string](dataTypes#string) | - | ZIP 成员注释 |
| `fileNameInZip` | [string](dataTypes#string) | - | ZIP 内使用的成员名称 |
| `isIncludeRootFolder` / `includeRootFolder` | [boolean](dataTypes#boolean) | `true` | 添加目录时是否包含根目录 |
| `isOverrideExistingFilesInZip` / `overrideExistingFilesInZip` | [boolean](dataTypes#boolean) | `true` | 是否覆盖 ZIP 内的同名成员 |
| `isReadHiddenFiles` / `readHiddenFiles` | [boolean](dataTypes#boolean) | `true` | 添加目录时是否读取隐藏文件 |
| `isReadHiddenFolders` / `readHiddenFolders` | [boolean](dataTypes#boolean) | `true` | 添加目录时是否读取隐藏目录 |
| `isUnixMode` / `unixMode` | [boolean](dataTypes#boolean) | `false` | 是否使用 Unix 文件头模式 |
| `isWriteExtendedLocalFileHeader` / `writeExtendedLocalFileHeader` | [boolean](dataTypes#boolean) | `true` | 是否写入扩展本地文件头 |
| `lastModifiedFileTime` | [number](dataTypes#number) | `0` | 写入成员的修改时间, Unix epoch 毫秒 |
| `rootFolderNameInZip` | [string](dataTypes#string) | - | ZIP 内使用的根目录名称 |
| `symbolicLinkAction` | [string](dataTypes#string) / Zip4j 枚举 | `INCLUDE_LINKED_FILE_ONLY` | 添加符号链接时采取的动作 |

`excludeFileFilter` 为 JavaScript 函数时, 函数接收一个 `java.io.File` 对象. 返回真值表示排除该文件.

`fileNameInZip` 应使用 `/` 作为目录分隔符, 且必须是相对成员名称. 设置非空 `fileNameInZip` 时, Zip4j 会忽略 `rootFolderNameInZip`.

### AES 密钥强度

`aesKeyStrength` 支持以下数值和名称:

- `1`, `128`, `KEY_STRENGTH_128`, `AES_STRENGTH_128`
- `2`, `192`, `KEY_STRENGTH_192`, `AES_STRENGTH_192`
- `3`, `256`, `KEY_STRENGTH_256`, `AES_STRENGTH_256`

### AES 格式版本

`aesVersion` 支持数值 `1`, `2`, 字符串 `1`, `2`, 以及名称 `ONE`, `TWO`.

### 压缩级别

`compressionLevel` 支持数值 `0` 到 `9`, 对应以下名称:

| 数值 | 名称 |
|---:|---|
| `0` | `NO_COMPRESSION` |
| `1` | `FASTEST` |
| `2` | `FASTER` |
| `3` | `FAST` |
| `4` | `MEDIUM_FAST` |
| `5` | `NORMAL` |
| `6` | `HIGHER` |
| `7` | `MAXIMUM` |
| `8` | `PRE_ULTRA` |
| `9` | `ULTRA` |

名称也可添加 `DEFLATE_LEVEL_` 前缀.

### 压缩方法

`compressionMethod` 支持以下数值和名称:

- `0`, `STORE`
- `8`, `DEFLATE`
- `99`, `AES_INTERNAL_ONLY`, `AES_ENC`

名称也可添加 `COMP_` 前缀.

### 加密方法

`encryptionMethod` 支持以下数值和名称:

- `-1`, `NONE`, `NO_ENCRYPTION`, `NO`
- `0`, `ZIP_STANDARD`, `STANDARD`
- `1`, `ZIP_STANDARD_VARIANT_STRONG`, `STRONG`
- `99`, `AES`

名称也可添加 `ENC_` 或 `ENC_METHOD_` 前缀.

只设置 `encryptionMethod` 不会启用加密. `password` 会设置底层密码并将 `encryptFiles` 强制设为 `true`.

### 符号链接动作

`symbolicLinkAction` 支持以下名称:

- `INCLUDE_LINK_ONLY`: 只添加符号链接
- `INCLUDE_LINKED_FILE_ONLY`: 只添加链接目标内容, 并使用符号链接的名称
- `INCLUDE_LINK_AND_LINKED_FILE`: 同时添加符号链接和链接目标

## UnzipOptions

解压选项.

### [p] UnzipOptions#password

- { [string](dataTypes#string) }

设置底层 Zip4j 对象用于本次解压的密码.

### [p] UnzipOptions#isExtractSymbolicLinks

- [ `true` ] { [boolean](dataTypes#boolean) }

AutoJs6 6.8.0 会读取此属性, 但不会将其写入 Zip4j `UnzipParameters`. 因此当前实现中此选项不改变解压行为.

### [p] UnzipOptions#ignoreDateTimeAttributes

别名为 `isIgnoreDateTimeAttributes`.

Zip4j 2.x 不再支持此选项. 传入任一名称都会抛出异常.

## ZipFileHeader

- { net.lingala.zip4j.model.FileHeader }

Zip4j 文件头对象. Rhino 可通过 Java Bean 属性或对应 getter 读取其成员.

常用只读信息如下:

| 属性 | getter | 类型 | 描述 |
|---|---|---|---|
| `fileName` | `getFileName()` | [string](dataTypes#string) | ZIP 内的成员名称 |
| `crc` | `getCrc()` | [number](dataTypes#number) | 成员的 CRC 校验和 |
| `compressedSize` | `getCompressedSize()` | [number](dataTypes#number) | 压缩后字节数 |
| `uncompressedSize` | `getUncompressedSize()` | [number](dataTypes#number) | 解压后字节数 |
| `lastModifiedTimeEpoch` | `getLastModifiedTimeEpoch()` | [number](dataTypes#number) | 修改时间的 Unix epoch 毫秒值 |
| `encrypted` | `isEncrypted()` | [boolean](dataTypes#boolean) | 成员是否加密 |
| `directory` | `isDirectory()` | [boolean](dataTypes#boolean) | 成员是否为目录 |
| `compressionMethod` | `getCompressionMethod()` | Zip4j 枚举 | 压缩方法 |
| `encryptionMethod` | `getEncryptionMethod()` | Zip4j 枚举 | 加密方法 |
| `fileComment` | `getFileComment()` | [string](dataTypes#string) / [null](dataTypes#null) | 成员注释 |
