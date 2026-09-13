# 文本间距 (Pangu)

`pangu` 是 AutoJs6 内置的文本排版对象, 用于处理中文等 CJK 文本与英文, 数字和符号混排时的空格.

自 AutoJs6 `6.8.0` 起可在 JavaScript (Rhino) 脚本中直接使用, 无需安装插件或调用 `require`:

```js
let text = pangu.spaceText('使用AutoJs6处理文本');
console.log(text); // 使用 AutoJs6 处理文本.
console.log(pangu.hasProperSpacing(text)); // true
```

内置版本为 [pangu.js 10.1.0](https://github.com/vinta/pangu.js/tree/v10.1.0), 采用 MIT 许可证.

AutoJs6 提供上游的纯文本 API. 浏览器 DOM 方法 (如 `spacePage`, `spaceNode`, `autoSpacePage`) 和 Node.js 文件方法 (如 `spaceFile`, `spaceFileSync`) 不属于此对象. 读取文件后可将其文本传给 `spaceText`.

本对象只注册为全局名称 `pangu`, 没有 `$pangu` 别名. 也可通过 `require('pangu')` 获取同一个模块对象.

---

<p style="font: bold 2em sans-serif; color: #FF7043">pangu</p>

---

## [p] version

### pangu.version

**`6.8.0`**

- [ `"10.1.0"` ] { [string](dataTypes#string) }

上游 pangu.js 的版本号, 与 AutoJs6 应用版本号相互独立.

## [m] spaceText

### pangu.spaceText(text)

**`6.8.0`**

- **text** { [string](dataTypes#string) } - 待排版的纯文本
- <ins>**returns**</ins> { [string](dataTypes#string) } - 按 pangu.js 规则处理后的文本

同步处理文本并返回结果, 不修改原字符串. 空字符串返回空字符串.

```js
let original = '今天写了10行JavaScript代码';
let spaced = pangu.spaceText(original);

console.log(spaced); // 今天写了 10 行 JavaScript 代码.
console.log(original); // 今天写了10行JavaScript代码.
console.log(pangu.spaceText('')); // 空字符串.
```

方法名称遵循 pangu.js 10.x 的 `spaceText`, 不提供旧版本的 `spacingText` 名称. 该方法不是 Markdown 格式化器, 不应直接用于 Markdown 文档或程序源码.

参数应为 JavaScript 字符串. 沿用上游行为, 非字符串值会记录警告并原样返回, 不会自动转换为字符串; TypeScript 声明仅接受字符串.

## [m] hasProperSpacing

### pangu.hasProperSpacing(text)

**`6.8.0`**

- **text** { [string](dataTypes#string) } - 待检查的纯文本
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 文本是否已经符合当前排版规则

结果等同于 `pangu.spaceText(text) === text`. 此检查使用与 `spaceText` 相同的规则, 不修改输入.

```js
console.log(pangu.hasProperSpacing('中文JavaScript')); // false
console.log(pangu.hasProperSpacing('中文 JavaScript')); // true
console.log(pangu.hasProperSpacing('')); // true
```

## 文件文本示例

```js
// 前置条件: 当前工作目录中存在 UTF-8 纯文本文件 input.txt.
let text = files.read('input.txt');
files.write('output.txt', pangu.spaceText(text));
```
