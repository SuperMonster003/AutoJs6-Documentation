# JavaScript 对象扩展 (Jsox)

<!-- runtime-support:begin jsox -->
<!-- 本段由 generator/runtime-support.js 根据 AutoJs6 运行时覆盖矩阵生成, 不要手动修改; 数据源 ksp -->

| 运行时支持 | Rhino | Node.js 主线程 | Node.js Worker | Bun |
| --- | --- | --- | --- | --- |
| 入口 | `jsox` | `jsox`, `$autojs.jsox` | `jsox`, `$autojs.jsox` | `host.jsox` |
| 状态 | 已支持 2 项 | 已支持 (本地实现) 2 项 | 已支持 (本地实现) 2 项 | 已支持 (本地实现) 2 项 |

各 API 在同一运行时中的入口, 状态与授权一致, 没有差异项.

Node.js 与 Bun 的导入方式, 异步返回值与授权检查见 [运行时 API](runtimeApis#执行方式).

<!-- runtime-support:end -->

`jsox` 模块用于将 AutoJs6 提供的扩展成员挂载到 JavaScript 内置对象.

当前支持以下扩展模块:

| 扩展模块 | 目标对象 | 详细文档 |
|---|---|---|
| `Arrayx` | `Array` 及 `Array.prototype` | [Arrayx](arrayx) |
| `Numberx` | `Number` 及 `Number.prototype` | [Numberx](numberx) |
| `Mathx` | `Math` | [Mathx](mathx) |

`jsox` 与 `$jsox` 引用同一个对象.

扩展仅作用于当前脚本运行环境. 挂载后的成员是永久属性, 无法通过 `delete` 删除.

```js
jsox('Mathx');

Math.sum(1, 2, 3); // 6
```

---

<p style="font: bold 2em sans-serif; color: #FF7043">jsox</p>

---

## [@] jsox

### jsox(...modules)

**`6.6.0`**

- **...modules** { ...( [string](dataTypes#string) | [string](dataTypes#string)[] )[] } - 待挂载的扩展模块名称
- <ins>**returns**</ins> { [void](dataTypes#void) }

将指定扩展模块挂载到对应的 JavaScript 内置对象.

参数可以是模块名称, 数组或嵌套数组. 重复名称会被忽略.

推荐使用规范名称 `Arrayx`, `Numberx` 和 `Mathx`. 也可省略末尾的 `x`, 如 `Array`, `Number` 和 `Math`.

```js
jsox('Arrayx', [ 'Numberx', 'Mathx' ]);

[ 3, 1, 2 ].sorted(); // [ 1, 2, 3 ]
(12).padStart(4, 0); // "0012"
Math.sum(1, 2, 3); // 6
```

不传入模块名称时, 挂载全部支持的扩展模块.

```js
jsox();
```

`jsox(...modules)` 与 [jsox.extend(...modules)](#m-extend) 等价.

## [m] extend

### jsox.extend(...modules)

**`6.6.0`**

- **...modules** { ...( [string](dataTypes#string) | [string](dataTypes#string)[] )[] } - 待挂载的扩展模块名称
- <ins>**returns**</ins> { [void](dataTypes#void) }

将指定扩展模块挂载到对应的 JavaScript 内置对象.

```js
jsox.extend('Mathx');
Math.median(1, 4, 2, 3); // 2.5
```

不传入模块名称时, 相当于 [jsox.extendAll()](#m-extendall).

## [m] extendAll

### jsox.extendAll()

**`6.6.0`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

挂载全部支持的扩展模块.

等价集合:

- `jsox.extendAll()`
- `jsox.extend('Mathx', 'Numberx', 'Arrayx')`
- `jsox()`

```js
jsox.extendAll();

[ 1, 2 ].union([ 2, 3 ]); // [ 1, 2, 3 ]
Number.parseRatio('3:2'); // 1.5
Math.avg(1, 2, 3); // 2
```
