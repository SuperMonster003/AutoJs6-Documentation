# 模块 (Module)

---

AutoJs6 使用 CommonJS 风格的模块加载器. 每个 JavaScript 或 JSON 文件是一个独立模块, JavaScript 模块通过 `module.exports` 导出值, 其他脚本通过 `require()` 加载该值.

模块加载器支持:

- 内置资源模块.
- 本地 `.js`, `.mjs` 和 `.json` 文件.
- 包含 `package.json` 或 `index.js` 的目录.
- 当前目录及上级目录中的 `node_modules`.
- `NODE_PATH` 指定的搜索目录.
- 由原生加载器处理的 `http://` 和 `https://` 地址.

`.mjs` 仅作为可解析的文件扩展名处理, 文件仍在 CommonJS 包装函数中执行, 并不启用原生 ECMAScript 模块语义.

## 模块示例

`circle.js`:

```js
let PI = Math.PI;

module.exports = {
    area(radius) {
        return PI * radius * radius;
    },
    circumference(radius) {
        return 2 * PI * radius;
    },
};
```

同一目录中的 `main.js`:

```js
let circle = require('./circle');

console.log(circle.area(4));
console.log(circle.circumference(4));
```

模块中的局部变量不会自动写入加载方的作用域. 上例中的 `PI` 仅属于 `circle.js`.

## [m] require

### require(id)

**`Global`**

- **id** { [string](dataTypes#string) } - 模块标识或路径
- <ins>**returns**</ins> { [any](dataTypes#any) } - 模块导出值

解析并加载模块.

模块标识按以下顺序处理:

1. 移除可选的 `node:` 前缀.
2. 对内置模块及 HTTP(S) 地址调用原生加载器.
3. 从当前模块目录或 [require.root](#p-root) 开始解析本地文件或目录.
4. 搜索 [require.paths](#m-paths) 返回的目录.
5. 逐级搜索 `node_modules`.

没有已知扩展名时, 解析器依次尝试 `.js`, `.mjs` 和 `.json`. 无法解析且原生加载器也不能提供模块时, 抛出代码为 `MODULE_NOT_FOUND` 的错误.

```js
let path = require('node:path');
let config = require('./config.json');
let helper = require('./lib/helper');
```

### 模块缓存

模块在执行前写入缓存, 因此循环引用可以取得尚未执行完毕的模块对象. JavaScript 模块执行成功后, 后续加载返回同一个 `module.exports`; 执行抛出异常时, 对应缓存条目会被删除.

JSON 模块会被解析后直接写入缓存.

## [m] resolve

### require.resolve(id)

- **id** { [string](dataTypes#string) } - 模块标识或路径
- <ins>**returns**</ins> { [string](dataTypes#string) | {{ path: [string](dataTypes#string); core: [boolean](dataTypes#boolean) }} | [false](dataTypes#boolean) } - 解析结果

解析模块但不执行模块代码.

- 普通文件返回规范化后的文件路径.
- 内置资源模块返回包含 **path** 和 `core: true` 的对象.
- 无法解析时返回 `false`.

## [m] paths

### require.paths()

- <ins>**returns**</ins> { [string](dataTypes#string)[] } - 附加模块搜索目录

返回附加搜索目录. 结果始终包含:

- `<user.home>/.node_modules`
- `<user.home>/.node_libraries`

如果进程环境变量 `NODE_PATH` 已设置, 其中的路径也会追加到结果. Windows 使用 `;` 分隔路径, 其他系统使用 `:`.

## [p] root

**`Getter/Setter`**

- { [string](dataTypes#string) } - 顶层模块解析根目录

读取或设置没有父模块时使用的模块解析根目录. 初始值来自脚本运行时的当前工作目录.

## [p+] cache

- { [Object](dataTypes#object) } - 模块缓存

缓存键通常是解析后的文件路径, 值为模块对象或 JSON 解析结果. 删除某个键可使对应模块在下次 `require()` 时重新加载.

直接修改缓存可能破坏模块间的共享状态或循环引用关系.

## [p+] extensions

- { [Object](dataTypes#object) }

保留的扩展名对象. 当前 AutoJs6 加载器不从此对象读取自定义扩展名处理函数.

## [p] main

**`Getter`**

- { [Module](#c-module) | [null](dataTypes#null) } - 主模块

返回由模块加载器的 `runMain` 流程登记的主模块. 尚未登记时为 `null`.

## [C] Module

模块加载器使用的 CommonJS 模块记录. 普通模块代码可通过局部变量 `module` 访问当前记录.

### [p#] id

- { [string](dataTypes#string) } - 模块标识

### [p#] filename

- { [string](dataTypes#string) } - 模块文件名

### [p#] exports

**`Getter/Setter`**

- { [any](dataTypes#any) } - 模块导出值

读取或替换模块导出值.

```js
module.exports = function (width) {
    return {
        area() {
            return width * width;
        },
    };
};
```

JavaScript 模块的包装函数最初把 `exports` 和 `module.exports` 指向同一个对象. 给 `exports` 增加属性会导出该属性, 但重新赋值局部变量 `exports` 不会替换 `module.exports`:

```js
exports.answer = 42; // 有效.
exports = { answer: 7 }; // 不会替换 module.exports.
```

### [p#] loaded

- { [boolean](dataTypes#boolean) } - 模块是否执行完毕

模块创建时为 `false`, 包装函数成功执行后变为 `true`.

### [p#] parent

- { [Module](#c-module) | [undefined](dataTypes#undefined) } - 父模块

### [p#] children

- { [Module](#c-module)[] } - 直接子模块记录

创建模块时会把模块记录追加到父模块的 **children**.

### [m#] require

#### Module#require(id)

- **id** { [string](dataTypes#string) } - 模块标识或路径
- <ins>**returns**</ins> { [any](dataTypes#any) } - 模块导出值

以当前模块作为父模块加载依赖. 模块代码中的局部变量 `require` 已绑定到此方法, 并提供 `resolve`, `paths`, `cache` 和 `extensions` 属性.

## 模块包装变量

JavaScript 模块代码在以下包装函数参数中执行:

```js
function (exports, require, module, __filename,__dirname) {
    // 模块代码.
}
```

- **exports** - `module.exports` 的初始别名.
- **require** - 绑定到当前模块的加载函数.
- **module** - 当前 [Module](#c-module) 记录.
- **__filename** - 当前模块文件名.
- **__dirname** - 当前模块所在目录. 位于资源根目录的内置模块使用空字符串.

文件以 `#!` 开头时, 加载器会先把该行开头改为 JavaScript 注释再执行.

## 内置模块

模块加载器显式识别以下 Node.js 兼容名称:

- `buffer`
- `events`
- `fs`
- `lodash`
- `nodejs`
- `os`
- `path`
- `process`

AutoJs6 还可通过相同解析机制加载 APK 资源中的其他模块, 例如 `axios`, `banana-i18n`, `cheerio`, `continuation`, `dayjs`, `i18n`, `jvm-npm`, `promise` 和 `result-adapter`. 可用资源随 AutoJs6 版本变化, 脚本不应根据未列入稳定 API 的内部文件名推断长期兼容性.
