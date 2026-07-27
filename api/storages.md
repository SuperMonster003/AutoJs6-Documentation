# 存储 (Storages)

storages 模块可用于保存 [ 简单数据 / 配置信息 / 列表清单 ] 等.<br>
保存的数据在脚本间共享, 因此不适于敏感数据的存储.

保存数据时, 需要一个名称, 类似命名空间.<br>
一个名称对应一个独立的本地存储.<br>
但无法像 Web 开发中 LocalStorage 一样提供域名独立的存储, 因为脚本路径可能随时改变.

保存的数据仅在以下情况下会被删除:

- AutoJs6 应用被卸载或清除数据
- 使用 [storages.remove](#m-remove) / [Storage#remove](storageType#m-remove) / [Storage#clear](storageType#m-clear) 等方法删除

支持存入的数据类型:

- [number](dataTypes#number)
- [boolean](dataTypes#boolean)
- [string](dataTypes#string)
- [null](dataTypes#null)
- [Array](dataTypes#array)
- [Object](dataTypes#object)
- ... ...

具体的存入规则详见 [Storage#put](storageType#m-put) 小节.

存入时, 由 [JSON.stringify](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) 序列化数据为 [string](dataTypes#string) 类型后再存入,<br>
读取时, 由 [JSON.parse](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) 还原为原本的数据类型.

---

<p style="font: bold 2em sans-serif; color: #FF7043">storages</p>

---

## [m] create

### create(name)

- **name** { [string](dataTypes#string) } - 存储名称
- <ins>**returns**</ins> { [Storage](storageType) }

以 `name` 参数为名称创建一个本地存储, 并返回 [Storage](storageType) 实例:

```js
/* 创建一个名为 fruit 的本地存储. */
let sto = storages.create('fruit');

/* 存入 "键值对" 数据. */
sto.put('apple', 10);
sto.put('banana', 20);

/* 访问数据. */
sto.get('apple'); // 10
sto.get('banana'); // 20
sto.get('cherry'); // undefined
```

不同的 `name` 参数可以创建不同的本地存储:

```js
let stoFruit = storages.create('fruit');
let stoPhone = storages.create('phone');

/* "键" 名均为 apple, 不同的本地存储之间数据独立. */
stoFruit.put('apple', 7);
stoPhone.put('apple', 3);

/* 访问数据. */
stoFruit.get('apple') // 7
stoPhone.get('apple') // 3
```

如果 `name` 参数对应的本地存储已存在, 则返回一个本地存储副本:

```js
let sto = storages.create('fruit');
sto.put('apple', 10);

/* 名为 fruit 的本地存储已创建, 因此返回的是存储副本. */
let stoCopied = storages.create('fruit');

/* 虽然 stoCopied 没有存入 apple 数据, 但 fruit 本地存储中存在. */
stoCopied.get('apple'); // 10

/* 副本与原始的本地存储并非引用关系. */
sto === stoCopied; // false
```

为保证数据安全及唯一性, `name` 参数应尽量具体:

```js
storages.create('project-publishing-schedule');
```

## [m] remove

### remove(name)

**`[6.6.0]`**

- **name** { [string](dataTypes#string) } - 存储名称
- <ins>**returns**</ins> { [void](dataTypes#void) }

清除名为 `name` 的本地存储包含的全部数据.

此方法使用异步提交, 不等待数据写入存储文件.

```js
let sto = storages.create('fruit');
sto.put('apple', 10);
sto.get('apple'); // 10

/* 相当于执行 storages.create('fruit').clear(). */
storages.remove('fruit');

/* 执行 remove 方法后, sto 对象将不存在任何存储数据. */
sto.get('apple'); // undefined

/* 但 sto 依然可以存放新的数据. */
sto.put('banana', 20);
sto.get('banana'); // 20
```

## [m] removeSync

### removeSync(name)

**`6.6.0`**

- **name** { [string](dataTypes#string) } - 存储名称
- <ins>**returns**</ins> { [void](dataTypes#void) }

同步清除指定本地存储的全部数据, 并等待数据写入存储文件.

## [m] all

### all()

**`6.6.0`**

- <ins>**returns**</ins> { [Storage](storageType)[] } - 所有非空本地存储

返回所有当前包含数据的本地存储.

## [m] names

### names()

**`6.6.0`**

- <ins>**returns**</ins> { [string](dataTypes#string)[] } - 所有非空本地存储名称

返回所有当前包含数据的本地存储名称.
