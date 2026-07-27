# SQLite

`sqlite` 模块用于在脚本中以较低门槛操作 SQLite 数据库文件, 支持常见的建表 / 增删改查 / 原生 SQL 查询, 以及事务封装与游标结果的便捷转换.

---

<p style="font: bold 2em sans-serif; color: #FF7043">sqlite</p>

---

## [@] sqlite

sqlite 可作为全局对象使用:

```js
log(typeof sqlite); // "function"
log(typeof sqlite.open); // "function"
```

### sqlite(databaseFilePath, options?, callback?)

**`6.6.0`** **`Overload [1-3]/3`**

- **databaseFilePath** { [string](dataTypes#string) } - 数据库文件路径
- **[ options ]** { [SQLiteOpenOptions](#sqliteopenoptions) } - 打开选项
- **[ callback ]** { [DatabaseCallback](#i-databasecallback) } - 生命周期回调
- <ins>**returns**</ins> { [Database](#c-database) } - 数据库对象

打开或创建数据库, 并返回 Database 对象. 相对路径按当前脚本工作目录解析. 空路径会使调用抛出异常.

等价调用:

- `sqlite(databaseFilePath, options?, callback?)`
- [sqlite.open(databaseFilePath, options?, callback?)](#m-open)

## [m] open

### open(databaseFilePath, options?, callback?)

**`6.6.0`** **`Overload [1-3]/3`**

- **databaseFilePath** { [string](dataTypes#string) } - 数据库文件路径
- **[ options ]** { [SQLiteOpenOptions](#sqliteopenoptions) } - 打开选项
- **[ callback ]** { [DatabaseCallback](#i-databasecallback) } - 生命周期回调
- <ins>**returns**</ins> { [Database](#c-database) } - 数据库对象

功能与 [sqlite](#sqlite-databasefilepath-options-callback) 相同.

`options` 和 `callback` 按位置解析. 需要传入回调但不设置选项时, 第二个参数应使用 `null`, `undefined` 或 `{}`.

打开操作是同步的. Database 构造期间会取得可读或可写数据库句柄, 并在此方法返回前触发适用的生命周期回调.

> 提示: Database, Cursor 和 SQLiteStatement 都持有系统资源. 使用完毕后应及时调用各自的 `close()` 方法.

## SQLiteOpenOptions

- **[ version = 1 ]** { [number](dataTypes#number) } - 数据库架构版本, 先转换为 32 位整数, 结果必须不小于 `1`
- **[ readOnly = false ]** { [boolean](dataTypes#boolean) } - 是否使用 Android `getReadableDatabase()` 打开

`version` 高于现有数据库版本时触发 `onUpgrade`. 首次创建数据库时触发 `onCreate`. 版本低于现有数据库版本时, 当前实现没有自定义 `onDowngrade`, Android 默认行为会抛出异常.

`readOnly` 为 `false` 时使用 `getWritableDatabase()`. 为 `true` 时使用 `getReadableDatabase()`. Android 的 `getReadableDatabase()` 在可写句柄可用时仍可能返回可写数据库, 因此此选项不是强制只读保证. 实际状态应通过 [Database#isReadOnly](#m-database-isreadonly) 检查.

## [I] DatabaseCallback

DatabaseCallback 是由 JavaScript 对象适配的生命周期接口. 对象应实现本节列出的 4 个方法.

回调在 `sqlite` 或 `sqlite.open` 返回前同步执行. 此时外部接收返回值的变量尚未赋值, 应使用回调参数中的 Database.

未提供回调时, 新数据库不会自动建表, 升级时也不会自动迁移架构.

## DatabaseCallback 示例

```js
let db = sqlite("./data/app.db", {
    version: 1,
    readOnly: false,
}, {
    onCorruption(rawDatabase) {
        console.error("Database corrupted: " + rawDatabase.getPath());
    },
    onCreate(database) {
        database.execSQL(
            "CREATE TABLE IF NOT EXISTS notes (" +
            "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            "title TEXT NOT NULL, " +
            "done INTEGER NOT NULL DEFAULT 0)"
        );
    },
    onOpen(database) {
        console.log("Opened: " + database.getPath());
    },
    onUpgrade(database, oldVersion, newVersion) {
        console.log("Upgrade: " + oldVersion + " -> " + newVersion);
    },
});

try {
    db.insert("notes", {
        title: "Read SQLite documentation",
        done: false,
    });
    let rows = db.rawQuery(
        "SELECT id, title, done FROM notes ORDER BY id",
        []
    ).all();
    console.log(rows);
} finally {
    db.close();
}
```

## [m!] DatabaseCallback#onCorruption

### onCorruption(database)

- **database** { [android.database.sqlite.SQLiteDatabase](https://developer.android.com/reference/android/database/sqlite/SQLiteDatabase) } - 检测到损坏的底层数据库
- <ins>**returns**</ins> { [void](dataTypes#void) }

Android 检测到数据库损坏时调用.

## [m!] DatabaseCallback#onCreate

### onCreate(database)

- **database** { [Database](#c-database) } - 当前数据库
- <ins>**returns**</ins> { [void](dataTypes#void) }

首次创建数据库时调用. 通常在此创建表, 索引和初始数据.

## [m!] DatabaseCallback#onOpen

### onOpen(database)

- **database** { [Database](#c-database) } - 当前数据库
- <ins>**returns**</ins> { [void](dataTypes#void) }

每次成功打开数据库后调用.

## [m!] DatabaseCallback#onUpgrade

### onUpgrade(database, oldVersion, newVersion)

- **database** { [Database](#c-database) } - 当前数据库
- **oldVersion** { [number](dataTypes#number) } - 旧版本
- **newVersion** { [number](dataTypes#number) } - 新版本
- <ins>**returns**</ins> { [void](dataTypes#void) }

请求版本高于现有数据库版本时调用. 此回调在 Android 管理的事务内执行, 抛出异常会回滚升级.

---

<p style="font: bold 2em sans-serif; color: #FF7043">Database</p>

---

## [C] Database

**`6.6.0`**

- <ins>**extends**</ins> { [android.database.sqlite.SQLiteOpenHelper](https://developer.android.com/reference/android/database/sqlite/SQLiteOpenHelper) }

Database 包装一个已经打开的 Android SQLiteDatabase. 本节列出的 Database 自有公开成员均自 AutoJs6 6.6.0 起可用.

Database 在创建时注册到当前脚本的资源管理器, 脚本运行时回收时会尝试自动关闭. 仍应在业务操作完成后显式调用 [Database#close](#m-database-close), 避免长时间持有文件句柄和锁.

## SQLiteValues

Database 的 `insert`, `replace` 和 `update` 系列方法把 JavaScript 对象转换为 Android ContentValues. 属性值支持:

- `null` 或 `undefined`, 存储为 SQL `NULL`.
- JavaScript 整数, 存储为 64 位整数.
- JavaScript 非整数, 存储为双精度浮点数.
- [boolean](dataTypes#boolean).
- [string](dataTypes#string).
- [ByteArray](dataTypes#bytearray), 存储为 BLOB.

对象属性名会转换为字符串. 数组, 嵌套对象及其他未列出的值类型会使调用抛出异常.

## SQLiteRow

Cursor 便捷方法返回的行是以列名为属性名的 JavaScript 对象. 列值映射:

- SQL `NULL` -> [null](dataTypes#null).
- INTEGER -> [number](dataTypes#number).
- FLOAT -> [number](dataTypes#number).
- TEXT -> [string](dataTypes#string).
- BLOB -> [ByteArray](dataTypes#bytearray).

同名列会写入同一属性, 后出现的列值覆盖先前值.

## 冲突算法

`insertWithOnConflict` 和 `updateWithOnConflict` 的 `conflictAlgorithm` 使用 Android SQLiteDatabase 常量:

| 常量 | 值 |
| --- | --- |
| `SQLiteDatabase.CONFLICT_NONE` | `0` |
| `SQLiteDatabase.CONFLICT_ROLLBACK` | `1` |
| `SQLiteDatabase.CONFLICT_ABORT` | `2` |
| `SQLiteDatabase.CONFLICT_FAIL` | `3` |
| `SQLiteDatabase.CONFLICT_IGNORE` | `4` |
| `SQLiteDatabase.CONFLICT_REPLACE` | `5` |

## [m#] Database#execSQL

### execSQL(sql)

**`Overload 1/2`**

- **sql** { [string](dataTypes#string) } - 待执行 SQL
- <ins>**returns**</ins> { [void](dataTypes#void) }

### execSQL(sql, bindArgs)

**`Overload 2/2`**

- **sql** { [string](dataTypes#string) } - 含 `?` 占位符的 SQL
- **bindArgs** { [any](dataTypes#any)[[]](dataTypes#array) } - 按位置绑定的参数
- <ins>**returns**</ins> { [void](dataTypes#void) }

执行不返回结果集的 SQL, 包括 `CREATE TABLE`, `ALTER TABLE`, `DROP TABLE`, `INSERT`, `UPDATE` 和 `DELETE`.

不要使用此方法执行 `SELECT`. 查询应使用 [rawQuery](#m-database-rawquery) 或 [query](#m-database-query).

## [m#] Database#compileStatement

### compileStatement(sql)

- **sql** { [string](dataTypes#string) } - 待编译 SQL
- <ins>**returns**</ins> { [android.database.sqlite.SQLiteStatement](https://developer.android.com/reference/android/database/sqlite/SQLiteStatement) } - 编译后的语句

编译可重复绑定和执行的 SQL 语句. SQLiteStatement 使用完毕后必须调用 `close()`.

## [m#] Database#insert

### insert(table, values)

**`Overload 1/2`**

- **table** { [string](dataTypes#string) } - 表名
- **values** { [SQLiteValues](#sqlitevalues) } - 待插入列和值
- <ins>**returns**</ins> { [number](dataTypes#number) } - 新行 ID, 失败时为 `-1`

### insert(table, nullColumnHack, values)

**`Overload 2/2`**

- **table** { [string](dataTypes#string) } - 表名
- **nullColumnHack** { [string](dataTypes#string) | [null](dataTypes#null) } - 空 values 时显式插入 `NULL` 的列名
- **values** { [SQLiteValues](#sqlitevalues) } - 待插入列和值
- <ins>**returns**</ins> { [number](dataTypes#number) } - 新行 ID, 失败时为 `-1`

插入一行. 第一个重载把 `nullColumnHack` 设为 `null`.

## [m#] Database#insertOrThrow

### insertOrThrow(table, nullColumnHack, values)

- **table** { [string](dataTypes#string) } - 表名
- **nullColumnHack** { [string](dataTypes#string) | [null](dataTypes#null) } - 空 values 时显式插入 `NULL` 的列名
- **values** { [SQLiteValues](#sqlitevalues) } - 待插入列和值
- <ins>**returns**</ins> { [number](dataTypes#number) } - 新行 ID

插入一行. 与 [insert](#m-database-insert) 不同, 数据库错误会抛出异常.

## [m#] Database#insertWithOnConflict

### insertWithOnConflict(table, nullColumnHack, values, conflictAlgorithm)

- **table** { [string](dataTypes#string) } - 表名
- **nullColumnHack** { [string](dataTypes#string) | [null](dataTypes#null) } - 空 values 时显式插入 `NULL` 的列名
- **values** { [SQLiteValues](#sqlitevalues) } - 待插入列和值
- **conflictAlgorithm** { [number](dataTypes#number) } - 冲突算法常量
- <ins>**returns**</ins> { [number](dataTypes#number) } - 新行 ID, 失败时为 `-1`

使用指定冲突算法插入一行.

## [m#] Database#replace

### replace(table, nullColumnHack, values)

- **table** { [string](dataTypes#string) } - 表名
- **nullColumnHack** { [string](dataTypes#string) | [null](dataTypes#null) } - 空 values 时显式插入 `NULL` 的列名
- **values** { [SQLiteValues](#sqlitevalues) } - 待写入列和值
- <ins>**returns**</ins> { [number](dataTypes#number) } - 新行 ID, 失败时为 `-1`

使用 `CONFLICT_REPLACE` 语义写入一行.

## [m#] Database#replaceOrThrow

### replaceOrThrow(table, nullColumnHack, values)

- **table** { [string](dataTypes#string) } - 表名
- **nullColumnHack** { [string](dataTypes#string) | [null](dataTypes#null) } - 空 values 时显式插入 `NULL` 的列名
- **values** { [SQLiteValues](#sqlitevalues) } - 待写入列和值
- <ins>**returns**</ins> { [number](dataTypes#number) } - 新行 ID

使用 `CONFLICT_REPLACE` 语义写入一行. 数据库错误会抛出异常.

## [m#] Database#update

### update(table, values, whereClause, whereArgs)

- **table** { [string](dataTypes#string) } - 表名
- **values** { [SQLiteValues](#sqlitevalues) } - 待更新列和值
- **whereClause** { [string](dataTypes#string) | [null](dataTypes#null) } - WHERE 条件, 不含 `WHERE`
- **whereArgs** { [string](dataTypes#string)[[]](dataTypes#array) | [null](dataTypes#null) } - 条件占位符参数
- <ins>**returns**</ins> { [number](dataTypes#number) } - 受影响行数

更新符合条件的行. `whereClause` 为 `null` 时更新整张表.

## [m#] Database#updateWithOnConflict

### updateWithOnConflict(table, values, whereClause, whereArgs, conflictAlgorithm)

- **table** { [string](dataTypes#string) } - 表名
- **values** { [SQLiteValues](#sqlitevalues) } - 待更新列和值
- **whereClause** { [string](dataTypes#string) | [null](dataTypes#null) } - WHERE 条件, 不含 `WHERE`
- **whereArgs** { [string](dataTypes#string)[[]](dataTypes#array) | [null](dataTypes#null) } - 条件占位符参数
- **conflictAlgorithm** { [number](dataTypes#number) } - 冲突算法常量
- <ins>**returns**</ins> { [number](dataTypes#number) } - 受影响行数

使用指定冲突算法更新符合条件的行.

## [m#] Database#delete

### delete(table, whereClause, whereArgs)

- **table** { [string](dataTypes#string) } - 表名
- **whereClause** { [string](dataTypes#string) | [null](dataTypes#null) } - WHERE 条件, 不含 `WHERE`
- **whereArgs** { [string](dataTypes#string)[[]](dataTypes#array) | [null](dataTypes#null) } - 条件占位符参数
- <ins>**returns**</ins> { [number](dataTypes#number) } - 删除行数

删除符合条件的行. `whereClause` 为 `null` 时删除整张表中的全部行.

## [m#] Database#query

### query(table, columns, selection, selectionArgs, groupBy, having, orderBy)

**`Overload 1/4`**

- **table** { [string](dataTypes#string) } - 表名
- **columns** { [string](dataTypes#string)[[]](dataTypes#array) | [null](dataTypes#null) } - 返回列名, `null` 表示全部列
- **selection** { [string](dataTypes#string) | [null](dataTypes#null) } - WHERE 条件, 不含 `WHERE`
- **selectionArgs** { [string](dataTypes#string)[[]](dataTypes#array) | [null](dataTypes#null) } - 条件占位符参数
- **groupBy** { [string](dataTypes#string) | [null](dataTypes#null) } - GROUP BY 子句, 不含 `GROUP BY`
- **having** { [string](dataTypes#string) | [null](dataTypes#null) } - HAVING 子句, 不含 `HAVING`
- **orderBy** { [string](dataTypes#string) | [null](dataTypes#null) } - ORDER BY 子句, 不含 `ORDER BY`
- <ins>**returns**</ins> { [Cursor](#c-cursor) } - 位于第一行之前的查询游标

### query(table, columns, selection, selectionArgs, groupBy, having, orderBy, limit)

**`Overload 2/4`**

- **table** { [string](dataTypes#string) } - 表名
- **columns** { [string](dataTypes#string)[[]](dataTypes#array) | [null](dataTypes#null) } - 返回列名, `null` 表示全部列
- **selection** { [string](dataTypes#string) | [null](dataTypes#null) } - WHERE 条件, 不含 `WHERE`
- **selectionArgs** { [string](dataTypes#string)[[]](dataTypes#array) | [null](dataTypes#null) } - 条件占位符参数
- **groupBy** { [string](dataTypes#string) | [null](dataTypes#null) } - GROUP BY 子句, 不含 `GROUP BY`
- **having** { [string](dataTypes#string) | [null](dataTypes#null) } - HAVING 子句, 不含 `HAVING`
- **orderBy** { [string](dataTypes#string) | [null](dataTypes#null) } - ORDER BY 子句, 不含 `ORDER BY`
- **limit** { [string](dataTypes#string) | [null](dataTypes#null) } - LIMIT 子句, 不含 `LIMIT`
- <ins>**returns**</ins> { [Cursor](#c-cursor) } - 位于第一行之前的查询游标

### query(distinct, table, columns, selection, selectionArgs, groupBy, having, orderBy, limit)

**`Overload 3/4`**

- **distinct** { [boolean](dataTypes#boolean) } - 是否去除重复行
- **table** { [string](dataTypes#string) } - 表名
- **columns** { [string](dataTypes#string)[[]](dataTypes#array) | [null](dataTypes#null) } - 返回列名, `null` 表示全部列
- **selection** { [string](dataTypes#string) | [null](dataTypes#null) } - WHERE 条件, 不含 `WHERE`
- **selectionArgs** { [string](dataTypes#string)[[]](dataTypes#array) | [null](dataTypes#null) } - 条件占位符参数
- **groupBy** { [string](dataTypes#string) | [null](dataTypes#null) } - GROUP BY 子句, 不含 `GROUP BY`
- **having** { [string](dataTypes#string) | [null](dataTypes#null) } - HAVING 子句, 不含 `HAVING`
- **orderBy** { [string](dataTypes#string) | [null](dataTypes#null) } - ORDER BY 子句, 不含 `ORDER BY`
- **limit** { [string](dataTypes#string) | [null](dataTypes#null) } - LIMIT 子句, 不含 `LIMIT`
- <ins>**returns**</ins> { [Cursor](#c-cursor) } - 位于第一行之前的查询游标

### query(distinct, table, columns, selection, selectionArgs, groupBy, having, orderBy, limit, cancellationSignal)

**`Overload 4/4`**

- **distinct** { [boolean](dataTypes#boolean) } - 是否去除重复行
- **table** { [string](dataTypes#string) } - 表名
- **columns** { [string](dataTypes#string)[[]](dataTypes#array) | [null](dataTypes#null) } - 返回列名, `null` 表示全部列
- **selection** { [string](dataTypes#string) | [null](dataTypes#null) } - WHERE 条件, 不含 `WHERE`
- **selectionArgs** { [string](dataTypes#string)[[]](dataTypes#array) | [null](dataTypes#null) } - 条件占位符参数
- **groupBy** { [string](dataTypes#string) | [null](dataTypes#null) } - GROUP BY 子句, 不含 `GROUP BY`
- **having** { [string](dataTypes#string) | [null](dataTypes#null) } - HAVING 子句, 不含 `HAVING`
- **orderBy** { [string](dataTypes#string) | [null](dataTypes#null) } - ORDER BY 子句, 不含 `ORDER BY`
- **limit** { [string](dataTypes#string) | [null](dataTypes#null) } - LIMIT 子句, 不含 `LIMIT`
- **cancellationSignal** { [android.os.CancellationSignal](https://developer.android.com/reference/android/os/CancellationSignal) | [null](dataTypes#null) } - 查询取消信号
- <ins>**returns**</ins> { [Cursor](#c-cursor) } - 位于第一行之前的查询游标

构造并执行表查询. `selectionArgs` 依次绑定 `selection` 中的 `?` 占位符. 取消查询时, 带 `cancellationSignal` 的重载会抛出 Android OperationCanceledException.

返回的 Cursor 必须由调用方关闭. 如果需要一次读取全部行并立即释放游标, 可直接调用 [Cursor#all](#m-cursor-all).

```js
let cursor = db.query(
    "notes",
    ["id", "title"],
    "done = ?",
    ["0"],
    null,
    null,
    "id DESC",
    "20"
);

try {
    while (cursor.moveToNext()) {
        console.log(cursor.getByColumn("title"));
    }
} finally {
    cursor.close();
}
```

## [m#] Database#queryWithFactory

### queryWithFactory(cursorFactory, distinct, table, columns, selection, selectionArgs, groupBy, having, orderBy, limit)

**`Overload 1/2`**

- **cursorFactory** { [android.database.sqlite.SQLiteDatabase.CursorFactory](https://developer.android.com/reference/android/database/sqlite/SQLiteDatabase.CursorFactory) | [null](dataTypes#null) } - 游标工厂, `null` 使用默认工厂
- **distinct** { [boolean](dataTypes#boolean) } - 是否去除重复行
- **table** { [string](dataTypes#string) } - 表名
- **columns** { [string](dataTypes#string)[[]](dataTypes#array) | [null](dataTypes#null) } - 返回列名, `null` 表示全部列
- **selection** { [string](dataTypes#string) | [null](dataTypes#null) } - WHERE 条件, 不含 `WHERE`
- **selectionArgs** { [string](dataTypes#string)[[]](dataTypes#array) | [null](dataTypes#null) } - 条件占位符参数
- **groupBy** { [string](dataTypes#string) | [null](dataTypes#null) } - GROUP BY 子句, 不含 `GROUP BY`
- **having** { [string](dataTypes#string) | [null](dataTypes#null) } - HAVING 子句, 不含 `HAVING`
- **orderBy** { [string](dataTypes#string) | [null](dataTypes#null) } - ORDER BY 子句, 不含 `ORDER BY`
- **limit** { [string](dataTypes#string) | [null](dataTypes#null) } - LIMIT 子句, 不含 `LIMIT`
- <ins>**returns**</ins> { [Cursor](#c-cursor) } - 位于第一行之前的查询游标

### queryWithFactory(cursorFactory, distinct, table, columns, selection, selectionArgs, groupBy, having, orderBy, limit, cancellationSignal)

**`Overload 2/2`**

- **cursorFactory** { [android.database.sqlite.SQLiteDatabase.CursorFactory](https://developer.android.com/reference/android/database/sqlite/SQLiteDatabase.CursorFactory) | [null](dataTypes#null) } - 游标工厂, `null` 使用默认工厂
- **distinct** { [boolean](dataTypes#boolean) } - 是否去除重复行
- **table** { [string](dataTypes#string) } - 表名
- **columns** { [string](dataTypes#string)[[]](dataTypes#array) | [null](dataTypes#null) } - 返回列名, `null` 表示全部列
- **selection** { [string](dataTypes#string) | [null](dataTypes#null) } - WHERE 条件, 不含 `WHERE`
- **selectionArgs** { [string](dataTypes#string)[[]](dataTypes#array) | [null](dataTypes#null) } - 条件占位符参数
- **groupBy** { [string](dataTypes#string) | [null](dataTypes#null) } - GROUP BY 子句, 不含 `GROUP BY`
- **having** { [string](dataTypes#string) | [null](dataTypes#null) } - HAVING 子句, 不含 `HAVING`
- **orderBy** { [string](dataTypes#string) | [null](dataTypes#null) } - ORDER BY 子句, 不含 `ORDER BY`
- **limit** { [string](dataTypes#string) | [null](dataTypes#null) } - LIMIT 子句, 不含 `LIMIT`
- **cancellationSignal** { [android.os.CancellationSignal](https://developer.android.com/reference/android/os/CancellationSignal) | [null](dataTypes#null) } - 查询取消信号
- <ins>**returns**</ins> { [Cursor](#c-cursor) } - 位于第一行之前的查询游标

功能与 [Database#query](#m-database-query) 相同, 但允许指定 Android CursorFactory.

## [m#] Database#rawQuery

### rawQuery(sql, selectionArgs)

**`Overload 1/2`**

- **sql** { [string](dataTypes#string) } - SQL 查询, 不含结尾分号
- **selectionArgs** { [string](dataTypes#string)[[]](dataTypes#array) | [null](dataTypes#null) } - SQL 占位符参数
- <ins>**returns**</ins> { [Cursor](#c-cursor) } - 位于第一行之前的查询游标

### rawQuery(sql, selectionArgs, cancellationSignal)

**`Overload 2/2`**

- **sql** { [string](dataTypes#string) } - SQL 查询, 不含结尾分号
- **selectionArgs** { [string](dataTypes#string)[[]](dataTypes#array) | [null](dataTypes#null) } - SQL 占位符参数
- **cancellationSignal** { [android.os.CancellationSignal](https://developer.android.com/reference/android/os/CancellationSignal) | [null](dataTypes#null) } - 查询取消信号
- <ins>**returns**</ins> { [Cursor](#c-cursor) } - 位于第一行之前的查询游标

执行原生查询. `selectionArgs` 按顺序绑定 SQL 中的 `?` 占位符, 并作为字符串传递. 返回的 Cursor 必须由调用方关闭.

## [m#] Database#rawQueryWithFactory

### rawQueryWithFactory(cursorFactory, sql, selectionArgs, editTable)

**`Overload 1/2`**

- **cursorFactory** { [android.database.sqlite.SQLiteDatabase.CursorFactory](https://developer.android.com/reference/android/database/sqlite/SQLiteDatabase.CursorFactory) | [null](dataTypes#null) } - 游标工厂, `null` 使用默认工厂
- **sql** { [string](dataTypes#string) } - SQL 查询, 不含结尾分号
- **selectionArgs** { [string](dataTypes#string)[[]](dataTypes#array) | [null](dataTypes#null) } - SQL 占位符参数
- **editTable** { [string](dataTypes#string) } - 查询中第一个可编辑表的名称
- <ins>**returns**</ins> { [Cursor](#c-cursor) } - 位于第一行之前的查询游标

### rawQueryWithFactory(cursorFactory, sql, selectionArgs, editTable, cancellationSignal)

**`Overload 2/2`**

- **cursorFactory** { [android.database.sqlite.SQLiteDatabase.CursorFactory](https://developer.android.com/reference/android/database/sqlite/SQLiteDatabase.CursorFactory) | [null](dataTypes#null) } - 游标工厂, `null` 使用默认工厂
- **sql** { [string](dataTypes#string) } - SQL 查询, 不含结尾分号
- **selectionArgs** { [string](dataTypes#string)[[]](dataTypes#array) | [null](dataTypes#null) } - SQL 占位符参数
- **editTable** { [string](dataTypes#string) } - 查询中第一个可编辑表的名称
- **cancellationSignal** { [android.os.CancellationSignal](https://developer.android.com/reference/android/os/CancellationSignal) | [null](dataTypes#null) } - 查询取消信号
- <ins>**returns**</ins> { [Cursor](#c-cursor) } - 位于第一行之前的查询游标

功能与 [Database#rawQuery](#m-database-rawquery) 相同, 但允许指定 Android CursorFactory 和可编辑表名.

## [m#] Database#transaction

### transaction(callback)

**`Overload 1/2`**

- **callback** { [Function](dataTypes#function) } - 接收 [Transaction](#c-transaction) 的事务回调
- <ins>**returns**</ins> { [EventEmitter](eventEmitterType) } - 事务事件发射器

### transaction(callback, exclusive)

**`Overload 2/2`**

- **callback** { [Function](dataTypes#function) } - 接收 [Transaction](#c-transaction) 的事务回调
- **exclusive** { [boolean](dataTypes#boolean) } - `true` 使用独占事务, `false` 使用非独占事务
- <ins>**returns**</ins> { [EventEmitter](eventEmitterType) } - 事务事件发射器

同步执行事务. 第一个重载的 `exclusive` 默认为 `true`. 回调正常返回时自动将事务标记为成功并提交. 回调抛出 Exception 时捕获异常并回滚, 异常通过 `error` 事件传递, 不由此方法重新抛出.

返回值支持以下粘性事件:

| 事件 | 参数 | 触发条件 |
| --- | --- | --- |
| `begin` | [Transaction](#c-transaction) | 事务开始 |
| `commit` | [Transaction](#c-transaction) | 事务提交 |
| `rollback` | [Transaction](#c-transaction) | 事务回滚 |
| `error` | [java.lang.Exception](https://developer.android.com/reference/java/lang/Exception) | 回调抛出 Exception |
| `end` | [Transaction](#c-transaction) | 提交或回滚后 |

事务在方法返回前已经结束. 这些事件使用粘性发送, 因此可在取得返回值后注册监听器并接收已经发生的事件.

回调的返回值会被忽略. 包装器会自动调用 [Transaction#succeed](#m-transaction-succeed) 和 [Transaction#end](#m-transaction-end), 回调中通常不应再次调用这两个方法.

```js
let result = db.transaction(function () {
    db.insert("notes", {
        title: "First note",
        done: false,
    });
    db.insert("notes", {
        title: "Second note",
        done: false,
    });
});

result.on("commit", function () {
    console.log("Committed");
});
result.on("error", function (error) {
    console.error(error);
});
```

## [m#] Database#beginTransaction

### beginTransaction()

- <ins>**returns**</ins> { [void](dataTypes#void) }

开始独占事务. 手动事务必须与 [setTransactionSuccessful](#m-database-settransactionsuccessful) 和 [endTransaction](#m-database-endtransaction) 配对. 一般业务代码优先使用 [transaction](#m-database-transaction).

## [m#] Database#beginTransactionNonExclusive

### beginTransactionNonExclusive()

- <ins>**returns**</ins> { [void](dataTypes#void) }

开始非独占事务. 在 WAL 模式下, 读取可与事务中的写入并发.

## [m#] Database#beginTransactionWithListener

### beginTransactionWithListener(listener)

- **listener** { [android.database.sqlite.SQLiteTransactionListener](https://developer.android.com/reference/android/database/sqlite/SQLiteTransactionListener) } - 事务生命周期监听器
- <ins>**returns**</ins> { [void](dataTypes#void) }

使用监听器开始独占事务.

## [m#] Database#beginTransactionWithListenerNonExclusive

### beginTransactionWithListenerNonExclusive(listener)

- **listener** { [android.database.sqlite.SQLiteTransactionListener](https://developer.android.com/reference/android/database/sqlite/SQLiteTransactionListener) } - 事务生命周期监听器
- <ins>**returns**</ins> { [void](dataTypes#void) }

使用监听器开始非独占事务.

## [m#] Database#setTransactionSuccessful

### setTransactionSuccessful()

- <ins>**returns**</ins> { [void](dataTypes#void) }

将当前手动事务标记为成功. 随后调用 [endTransaction](#m-database-endtransaction) 时提交事务. 未标记成功时结束事务会回滚.

## [m#] Database#endTransaction

### endTransaction()

- <ins>**returns**</ins> { [void](dataTypes#void) }

结束当前手动事务, 并根据成功标记提交或回滚.

## [m#] Database#inTransaction

### inTransaction()

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 当前线程是否处于事务中

## [m#] Database#yieldIfContendedSafely

### yieldIfContendedSafely()

**`Overload 1/2`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否让出并重新开始事务

### yieldIfContendedSafely(sleepAfterYieldDelay)

**`Overload 2/2`**

- **sleepAfterYieldDelay** { [number](dataTypes#number) } - 让出事务后休眠的毫秒数
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否让出并重新开始事务

当前事务存在竞争时, 暂时结束并重新开始事务. 仅应在事务内部调用.

## [m#] Database#close

### close()

- <ins>**returns**</ins> { [void](dataTypes#void) }

关闭底层 SQLiteDatabase, 并从脚本资源管理器中移除当前 Database.

关闭 Database 前应先关闭其 Cursor 和 SQLiteStatement. 关闭后不要继续使用该对象. 建议使用 `try...finally` 确保释放资源.

## [m#] Database#enableWriteAheadLogging

### enableWriteAheadLogging()

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否成功启用 WAL

启用 write-ahead logging, 允许多个连接上的读取与写入并发. 只读数据库, 内存数据库或附加了其他数据库时可能无法启用并返回 `false`.

## [m#] Database#disableWriteAheadLogging

### disableWriteAheadLogging()

- <ins>**returns**</ins> { [void](dataTypes#void) }

禁用 write-ahead logging.

## [m#] Database#isWriteAheadLoggingEnabled

### isWriteAheadLoggingEnabled()

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否已启用 WAL

## [m#] Database#getPath

### getPath()

- <ins>**returns**</ins> { [string](dataTypes#string) } - 数据库文件路径

返回底层 SQLiteDatabase 使用的路径. `sqlite` 接受相对路径时, 此处通常返回解析后的路径.

## [m#] Database#isOpen

### isOpen()

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 数据库是否仍处于打开状态

## [m#] Database#isReadOnly

### isReadOnly()

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 底层数据库是否以只读方式打开

此结果反映实际打开状态, 比 SQLiteOpenOptions 的 `readOnly` 请求值更适合判断句柄是否只读.

## [m#] Database#getVersion

### getVersion()

- <ins>**returns**</ins> { [number](dataTypes#number) } - 当前数据库架构版本

读取 SQLite `user_version`.

## [m#] Database#setVersion

### setVersion(version)

- **version** { [number](dataTypes#number) } - 新数据库架构版本
- <ins>**returns**</ins> { [void](dataTypes#void) }

直接设置 SQLite `user_version`. 此方法不会执行 [DatabaseCallback#onUpgrade](#m-databasecallback-onupgrade), 也不会自动迁移表结构. 常规版本迁移应通过重新打开数据库时的 `version` 选项和 `onUpgrade` 回调完成.

## [m#] Database#needUpgrade

### needUpgrade(newVersion)

- **newVersion** { [number](dataTypes#number) } - 待比较版本
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - `newVersion` 是否大于当前版本

## [m#] Database#getMaximumSize

### getMaximumSize()

- <ins>**returns**</ins> { [number](dataTypes#number) } - 数据库最大容量, 单位为字节

## [m#] Database#setMaximumSize

### setMaximumSize(numBytes)

- **numBytes** { [number](dataTypes#number) } - 请求的最大容量, 单位为字节
- <ins>**returns**</ins> { [number](dataTypes#number) } - 实际设置的最大容量, 单位为字节

最大容量不能小于数据库当前大小. 返回值按数据库页大小向上取整, 因此可能大于 `numBytes`.

## [m#] Database#getPageSize

### getPageSize()

- <ins>**returns**</ins> { [number](dataTypes#number) } - 数据库页大小, 单位为字节

## [m#] Database#setPageSize

### setPageSize(numBytes)

- **numBytes** { [number](dataTypes#number) } - 页大小, 单位为字节
- <ins>**returns**</ins> { [void](dataTypes#void) }

设置 SQLite 页大小. 值必须是 2 的幂, 且此设置应在新数据库写入任何数据之前完成.

## [m#] Database#getAttachedDbs

### getAttachedDbs()

- <ins>**returns**</ins> { [java.util.List](https://developer.android.com/reference/java/util/List) | [null](dataTypes#null) } - 已附加数据库信息, 数据库关闭时为 `null`

返回 `android.util.Pair<string, string>` 列表. 每一项的 `first` 是数据库名称, `second` 是完整文件路径, 列表包含主数据库 `main`.

## [m#] Database#isDatabaseIntegrityOk

### isDatabaseIntegrityOk()

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 主数据库及所有附加数据库是否通过完整性检查

运行 SQLite `integrity_check`. 对大型数据库可能耗时较长.

## [m#] Database#isDbLockedByCurrentThread

### isDbLockedByCurrentThread()

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 当前线程是否持有数据库活动连接

名称中的 `Locked` 是历史命名. 当前 Android 实现检查的是当前线程是否持有活动连接, 不表示传统意义上的数据库文件锁.

## [m#] Database#setForeignKeyConstraintsEnabled

### setForeignKeyConstraintsEnabled(enable)

- **enable** { [boolean](dataTypes#boolean) } - 是否启用外键约束
- <ins>**returns**</ins> { [void](dataTypes#void) }

为当前打开会话启用或禁用 SQLite 外键约束. 不得在事务进行中调用. 如需每次打开都启用, 可在 `DatabaseCallback.onOpen` 中调用.

## [m#] Database#setLocale

### setLocale(locale)

- **locale** { [java.util.Locale](https://developer.android.com/reference/java/util/Locale) } - 新区域设置
- <ins>**returns**</ins> { [void](dataTypes#void) }

设置数据库本地化排序使用的区域. 只读数据库或使用 `NO_LOCALIZED_COLLATORS` 标志时不生效.

## [m#] Database#setMaxSqlCacheSize

### setMaxSqlCacheSize(cacheSize)

- **cacheSize** { [number](dataTypes#number) } - 编译 SQL 语句缓存条目上限
- <ins>**returns**</ins> { [void](dataTypes#void) }

调整底层数据库的预编译语句缓存容量. 超出 Android 允许范围或违反底层容量约束时抛出异常.

## [m#] Database#validateSql

### validateSql(sql, cancellationSignal)

- **sql** { [string](dataTypes#string) } - 待验证的 SELECT 语句
- **cancellationSignal** { [android.os.CancellationSignal](https://developer.android.com/reference/android/os/CancellationSignal) | [null](dataTypes#null) } - 验证取消信号
- <ins>**returns**</ins> { [void](dataTypes#void) }

通过编译验证 SELECT 语句. SQL 无效时抛出 SQLiteException, 操作被取消时抛出 OperationCanceledException.

## [m#] Database#acquireReference

### acquireReference()

- <ins>**returns**</ins> { [void](dataTypes#void) }

增加底层 SQLiteDatabase 的引用计数. 这是高级资源管理接口, 每次成功调用都必须与 [releaseReference](#m-database-releasereference) 配对.

## [m#] Database#releaseReference

### releaseReference()

- <ins>**returns**</ins> { [void](dataTypes#void) }

减少底层 SQLiteDatabase 的引用计数. 引用计数归零时会释放底层资源. 不要在未成功调用 [acquireReference](#m-database-acquirereference) 时单独调用.

## [m#] Database#getTypeAdapter

### getTypeAdapter()

- <ins>**returns**</ins> { [Database.TypeAdapter](#i-database-typeadapter) } - 当前数据库使用的类型适配器

返回 AutoJs6 为 SQLite 模块创建的 JavaScript 类型适配器. 常规脚本无需直接调用.

## [m#] Database#onCreate

### onCreate(database)

- **database** { [android.database.sqlite.SQLiteDatabase](https://developer.android.com/reference/android/database/sqlite/SQLiteDatabase) } - 底层数据库
- <ins>**returns**</ins> { [void](dataTypes#void) }

SQLiteOpenHelper 生命周期方法. 它更新 Database 的底层句柄, 然后转发到 `DatabaseCallback.onCreate`. 脚本不应主动调用此方法.

## [m#] Database#onOpen

### onOpen(database)

- **database** { [android.database.sqlite.SQLiteDatabase](https://developer.android.com/reference/android/database/sqlite/SQLiteDatabase) } - 底层数据库
- <ins>**returns**</ins> { [void](dataTypes#void) }

SQLiteOpenHelper 生命周期方法. 它更新 Database 的底层句柄, 然后转发到 `DatabaseCallback.onOpen`. 脚本不应主动调用此方法.

## [m#] Database#onUpgrade

### onUpgrade(database, oldVersion, newVersion)

- **database** { [android.database.sqlite.SQLiteDatabase](https://developer.android.com/reference/android/database/sqlite/SQLiteDatabase) } - 底层数据库
- **oldVersion** { [number](dataTypes#number) } - 旧版本
- **newVersion** { [number](dataTypes#number) } - 新版本
- <ins>**returns**</ins> { [void](dataTypes#void) }

SQLiteOpenHelper 生命周期方法. 它更新 Database 的底层句柄, 然后转发到 `DatabaseCallback.onUpgrade`. 脚本不应主动调用此方法.

## 继承的 SQLiteOpenHelper 成员

Database 还继承以下 Android SQLiteOpenHelper 公开成员. [close](#m-database-close), [onCreate](#m-database-oncreate), [onOpen](#m-database-onopen) 和 [onUpgrade](#m-database-onupgrade) 已由 Database 覆盖并在上文说明.

| 成员 | 返回值 | 说明 |
| --- | --- | --- |
| `getDatabaseName()` | [string](dataTypes#string) | 返回构造 SQLiteOpenHelper 时使用的数据库名称 |
| `getReadableDatabase()` | [android.database.sqlite.SQLiteDatabase](https://developer.android.com/reference/android/database/sqlite/SQLiteDatabase) | 返回可读数据库句柄, 可写句柄可用时仍可能返回可写句柄 |
| `getWritableDatabase()` | [android.database.sqlite.SQLiteDatabase](https://developer.android.com/reference/android/database/sqlite/SQLiteDatabase) | 返回可读写数据库句柄 |
| `setWriteAheadLoggingEnabled(enabled)` | [void](dataTypes#void) | 设置 SQLiteOpenHelper 的 WAL 开关 |
| `onConfigure(database)` | [void](dataTypes#void) | 打开后且创建或升级前调用的配置钩子, Database 没有覆盖此方法 |
| `onDowngrade(database, oldVersion, newVersion)` | [void](dataTypes#void) | 降级钩子, Database 没有覆盖, Android 默认实现抛出 SQLiteException |
| `setLookasideConfig(slotSize, slotCount)` | [void](dataTypes#void) | **`API>=27!`** 设置 lookaside 内存参数 |
| `setIdleConnectionTimeout(idleConnectionTimeoutMs)` | [void](dataTypes#void) | **`API>=27!`** **`DEPRECATED`** 设置空闲连接超时 |
| `setOpenParams(openParams)` | [void](dataTypes#void) | **`API>=28!`** 设置 [SQLiteDatabase.OpenParams](https://developer.android.com/reference/android/database/sqlite/SQLiteDatabase.OpenParams) |

`sqlite` 在返回 Database 之前已经打开数据库. `setLookasideConfig`, `setIdleConnectionTimeout` 和 `setOpenParams` 要求在打开前配置, 因而对 `sqlite` 返回的对象调用时会抛出 IllegalStateException.

`getReadableDatabase()` 和 `getWritableDatabase()` 返回未包装的 Android SQLiteDatabase, 不提供 [Cursor](#c-cursor) 的 JavaScript 便捷方法. 常规脚本应使用 Database 自有查询方法.

---

<p style="font: bold 2em sans-serif; color: #FF7043">Database.TypeAdapter</p>

---

## [I] Database.TypeAdapter

**`6.6.0`**

Database.TypeAdapter 是 Database 在 JavaScript 值与 Android SQLite 类型之间使用的内部接口. SQLite 模块自动提供实现, 常规脚本无需自行实现.

## [m!] Database.TypeAdapter#toContentValues

### toContentValues(value)

- **value** { [SQLiteValues](#sqlitevalues) } - JavaScript 键值对象
- <ins>**returns**</ins> { [android.content.ContentValues](https://developer.android.com/reference/android/content/ContentValues) } - Android ContentValues

## [m!] Database.TypeAdapter#wrapCursor

### wrapCursor(cursor)

- **cursor** { [android.database.Cursor](https://developer.android.com/reference/android/database/Cursor) } - Android 游标
- <ins>**returns**</ins> { [Cursor](#c-cursor) } - AutoJs6 Cursor 包装对象

---

<p style="font: bold 2em sans-serif; color: #FF7043">Transaction</p>

---

## [C] Transaction

**`6.6.0`**

Transaction 是 [Database#transaction](#m-database-transaction) 传给回调和事务事件的对象.

## [p#] Transaction#database

- { [Database](#c-database) }

当前事务所属的 Database.

## [m#] Transaction#succeed

### succeed()

- <ins>**returns**</ins> { [void](dataTypes#void) }

调用 [Database#setTransactionSuccessful](#m-database-settransactionsuccessful). `Database#transaction` 在回调正常返回后自动调用此方法, 回调中通常不应再次调用.

## [m#] Transaction#end

### end()

- <ins>**returns**</ins> { [void](dataTypes#void) }

调用 [Database#endTransaction](#m-database-endtransaction). `Database#transaction` 在回调结束后自动调用此方法, 回调中通常不应再次调用.

---

<p style="font: bold 2em sans-serif; color: #FF7043">Cursor</p>

---

## [C] Cursor

**`6.6.0`**

- <ins>**implements**</ins> { [android.database.Cursor](https://developer.android.com/reference/android/database/Cursor) }

Cursor 是 AutoJs6 对 Android Cursor 的包装对象. 它增加 JavaScript 行对象转换方法, 并将 Android Cursor 的全部公开接口成员委托给底层游标.

查询返回的 Cursor 初始位置为 `-1`, 即第一行之前. Cursor 不由脚本资源管理器自动登记, 必须通过 [close](#m-cursor-close), [all](#m-cursor-all) 或 [single](#m-cursor-single) 及时释放.

Cursor 不是线程安全对象. 多线程共享时应由脚本自行同步.

## [m#] Cursor#get

### get(index)

- **index** { [number](dataTypes#number) } - 从 `0` 开始的列索引
- <ins>**returns**</ins> { [null](dataTypes#null) | [number](dataTypes#number) | [string](dataTypes#string) | [ByteArray](dataTypes#bytearray) } - 当前行的列值

按底层字段类型读取当前行的指定列. 类型映射与 [SQLiteRow](#sqliterow) 相同. 游标不位于有效行, 索引越界或底层字段类型未知时抛出异常.

## [m#] Cursor#getByColumn

### getByColumn(column)

- **column** { [string](dataTypes#string) } - 列名
- <ins>**returns**</ins> { [null](dataTypes#null) | [number](dataTypes#number) | [string](dataTypes#string) | [ByteArray](dataTypes#bytearray) } - 当前行的列值

先通过 `getColumnIndexOrThrow(column)` 查找列索引, 再调用 [get](#m-cursor-get). 列不存在时抛出 IllegalArgumentException.

## [m#] Cursor#all

### all(close = true)

- **[ close = true ]** { [any](dataTypes#any) } - JavaScript 真值表示读取完成后关闭游标
- <ins>**returns**</ins> { [SQLiteRow](#sqliterow)[[]](dataTypes#array) } - 剩余行数组

从当前位置开始反复调用 `moveToNext()`, 将随后到达的每一行转换为 SQLiteRow. 新查询的游标位于第一行之前, 因而直接调用 `all()` 会读取全部行.

如果游标已经位于某一行, 当前行不会再次加入结果, 只读取其后的行. 正常读取完成后, `close` 为 JavaScript 真值时关闭游标, 默认值为 `true`.

行转换期间抛出异常时不保证自动关闭. 需要严格保证释放时, 应由调用方使用 `try...finally`.

## [m#] Cursor#pick

### pick()

- <ins>**returns**</ins> { [SQLiteRow](#sqliterow) } - 当前行对象

将游标当前行转换为 SQLiteRow, 不移动也不关闭游标. 游标必须已位于有效行.

## [m#] Cursor#next

### next()

- <ins>**returns**</ins> { [SQLiteRow](#sqliterow) | [null](dataTypes#null) } - 下一行对象, 没有下一行时为 `null`

先调用 `moveToNext()`. 移动成功时返回该行, 否则返回 `null`. 此方法不关闭游标.

## [m#] Cursor#single

### single()

- <ins>**returns**</ins> { [SQLiteRow](#sqliterow) | [null](dataTypes#null) } - 下一行对象, 没有下一行时为 `null`

调用 [next](#m-cursor-next) 读取一行, 然后关闭游标. 此方法不检查结果集是否只有一行, 其含义是 "读取下一行并关闭".

## [m#] Cursor#close

### close()

- <ins>**returns**</ins> { [void](dataTypes#void) }

关闭游标并释放其资源. 关闭后游标完全失效, `requery()` 也不能使其恢复.

## [m#] Cursor#isClosed

### isClosed()

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 游标是否已关闭

## Cursor 字段类型常量

`Cursor.getType(columnIndex)` 返回以下 Android Cursor 常量:

| 常量 | 值 | 字段类型 |
| --- | --- | --- |
| `Cursor.FIELD_TYPE_NULL` | `0` | SQL `NULL` |
| `Cursor.FIELD_TYPE_INTEGER` | `1` | 整数 |
| `Cursor.FIELD_TYPE_FLOAT` | `2` | 浮点数 |
| `Cursor.FIELD_TYPE_STRING` | `3` | 字符串 |
| `Cursor.FIELD_TYPE_BLOB` | `4` | BLOB |

## Cursor 位置与移动成员

以下成员直接委托给 Android Cursor:

| 成员 | 返回值 | 说明 |
| --- | --- | --- |
| `getCount()` | [number](dataTypes#number) | 结果集总行数 |
| `getPosition()` | [number](dataTypes#number) | 当前从 `0` 开始的位置, 第一行之前为 `-1`, 最后一行之后为 `getCount()` |
| `move(offset)` | [boolean](dataTypes#boolean) | 相对移动 `offset` 行, 返回是否到达请求位置 |
| `moveToPosition(position)` | [boolean](dataTypes#boolean) | 移动到绝对位置, 返回是否到达请求位置 |
| `moveToFirst()` | [boolean](dataTypes#boolean) | 移动到第一行, 空结果集返回 `false` |
| `moveToLast()` | [boolean](dataTypes#boolean) | 移动到最后一行, 空结果集返回 `false` |
| `moveToNext()` | [boolean](dataTypes#boolean) | 移动到下一行 |
| `moveToPrevious()` | [boolean](dataTypes#boolean) | 移动到上一行 |
| `isFirst()` | [boolean](dataTypes#boolean) | 当前是否位于第一行 |
| `isLast()` | [boolean](dataTypes#boolean) | 当前是否位于最后一行 |
| `isBeforeFirst()` | [boolean](dataTypes#boolean) | 当前是否位于第一行之前 |
| `isAfterLast()` | [boolean](dataTypes#boolean) | 当前是否位于最后一行之后 |

## Cursor 列与值成员

| 成员 | 返回值 | 说明 |
| --- | --- | --- |
| `getColumnIndex(columnName)` | [number](dataTypes#number) | 返回从 `0` 开始的列索引, 不存在时为 `-1` |
| `getColumnIndexOrThrow(columnName)` | [number](dataTypes#number) | 返回列索引, 不存在时抛出 IllegalArgumentException |
| `getColumnName(columnIndex)` | [string](dataTypes#string) | 返回列名 |
| `getColumnNames()` | [string](dataTypes#string)[[]](dataTypes#array) | 按查询顺序返回全部列名 |
| `getColumnCount()` | [number](dataTypes#number) | 返回列数 |
| `getBlob(columnIndex)` | [ByteArray](dataTypes#bytearray) \| [null](dataTypes#null) | 以字节数组读取列 |
| `getString(columnIndex)` | [string](dataTypes#string) \| [null](dataTypes#null) | 以字符串读取列 |
| `copyStringToBuffer(columnIndex, buffer)` | [void](dataTypes#void) | 把列文本复制到 [android.database.CharArrayBuffer](https://developer.android.com/reference/android/database/CharArrayBuffer) |
| `getShort(columnIndex)` | [number](dataTypes#number) | 以 Java `short` 读取列 |
| `getInt(columnIndex)` | [number](dataTypes#number) | 以 Java `int` 读取列 |
| `getLong(columnIndex)` | [number](dataTypes#number) | 以 Java `long` 读取列 |
| `getFloat(columnIndex)` | [number](dataTypes#number) | 以 Java `float` 读取列 |
| `getDouble(columnIndex)` | [number](dataTypes#number) | 以 Java `double` 读取列 |
| `getType(columnIndex)` | [number](dataTypes#number) | 返回字段类型常量 |
| `isNull(columnIndex)` | [boolean](dataTypes#boolean) | 列值是否为 SQL `NULL` |

Android Cursor 的类型专用读取方法可能转换值. 对 `NULL`, 类型不匹配或数值越界的具体结果由底层实现决定. 需要保持 SQLite 原始类型映射时, 使用 [Cursor#get](#m-cursor-get).

## Cursor 观察与元数据成员

| 成员 | 返回值 | 说明 |
| --- | --- | --- |
| `deactivate()` | [void](dataTypes#void) | **`DEPRECATED`** 停用游标 |
| `requery()` | [boolean](dataTypes#boolean) | **`DEPRECATED`** 重新执行查询 |
| `registerContentObserver(observer)` | [void](dataTypes#void) | 注册 [android.database.ContentObserver](https://developer.android.com/reference/android/database/ContentObserver) |
| `unregisterContentObserver(observer)` | [void](dataTypes#void) | 注销 ContentObserver |
| `registerDataSetObserver(observer)` | [void](dataTypes#void) | 注册 [android.database.DataSetObserver](https://developer.android.com/reference/android/database/DataSetObserver) |
| `unregisterDataSetObserver(observer)` | [void](dataTypes#void) | 注销 DataSetObserver |
| `setNotificationUri(contentResolver, uri)` | [void](dataTypes#void) | 设置一个内容变更通知 URI |
| `setNotificationUris(contentResolver, uris)` | [void](dataTypes#void) | **`API>=29!`** 设置多个内容变更通知 URI |
| `getNotificationUri()` | [android.net.Uri](https://developer.android.com/reference/android/net/Uri) \| [null](dataTypes#null) | 返回通知 URI |
| `getNotificationUris()` | [java.util.List](https://developer.android.com/reference/java/util/List) \| [null](dataTypes#null) | **`API>=29!`** 返回通知 URI 列表 |
| `getWantsAllOnMoveCalls()` | [boolean](dataTypes#boolean) | 跨进程使用时是否希望每次移动都触发 `onMove()` |
| `setExtras(extras)` | [void](dataTypes#void) | 设置 [android.os.Bundle](https://developer.android.com/reference/android/os/Bundle) 元数据, `null` 表示空 Bundle |
| `getExtras()` | [android.os.Bundle](https://developer.android.com/reference/android/os/Bundle) | 返回游标元数据, 无数据时返回空 Bundle |
| `respond(extras)` | [android.os.Bundle](https://developer.android.com/reference/android/os/Bundle) | 向游标发送由实现定义的附加请求并返回结果 |

这些委托成员的参数约束, 异常和线程语义与 [Android Cursor](https://developer.android.com/reference/android/database/Cursor) 一致.
