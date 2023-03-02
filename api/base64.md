# Base64

Base64 是一种编码方式, 同时可作为一种数据的存储格式, 并非严格意义上的加密与解密.

base64 模块主要用于对数据进行 Base64 编码及解码.

> 注: 与 [crypto](crypto) 模块不同, crypto 模块主要用于信息的加密与解密.

> 参阅:  
> [Wikipedia (英)](https://en.wikipedia.org/wiki/Base64) / [Wikipedia (中)](https://zh.wikipedia.org/wiki/Base64)  
> [Base64 笔记 (from 阮一峰的网络日志)](http://www.ruanyifeng.com/blog/2008/06/base64.html)  
> [Base64 是加密算法吗 (from 稀土掘金)](https://juejin.cn/post/6887498543494660109)

## 可逆性

Base64 是一种可逆的编码方式:

```js
base64.decode(base64.encode('orange')); // orange
base64.decode(base64.encode('简体中文')); // 简体中文
```

但需注意参数的字符编码方式 (默认为 `UTF-8`), 当存在超出编码表示范围的字符时, 可逆性将遭到破坏:

```js
/* us-ascii 编码无法表示 "出" 和 "口". */
base64.decode(base64.encode('E2 出口', 'us-ascii'), 'us-ascii'); // E2 ??
```

编解码使用了不同的编码方式, 也可能导致可逆性失效:

```js
/* utf-16 与 utf-8 不一致. */
base64.decode(base64.encode('简体中文', 'utf-16'), 'utf-8'); // ��{�OSN-e�
```

---

<p style="font: bold 2em sans-serif; color: #FF7043">base64</p>

---

## [m] encode

### encode(str, encoding?)

- **str** { [string](dataTypes#string) } - 待编码字符串
- **[encoding="UTF_8"]** { [StandardCharset](dataTypes#standardcharset) } - 字符编码
- <ins>**returns**</ins> { [string](dataTypes#string) }

对字符串进行 Base64 编码.

```js
base64.encode('hello', 'iso-8859-1'); // aGVsbG8=
base64.encode('hello', 'us-ascii'); // aGVsbG8=
base64.encode('hello', 'utf-8'); // aGVsbG8=
base64.encode('hello', 'utf-16'); // /v8AaABlAGwAbABv
base64.encode('hello', 'utf-16be'); // AGgAZQBsAGwAbw==
base64.encode('hello', 'utf-16le'); // aABlAGwAbABvAA==
```

## [m] decode

### decode(str, encoding?)

- **str** { [string](dataTypes#string) } - 待解码字符串
- **[encoding="UTF_8"]** { [StandardCharset](dataTypes#standardcharset) } - 字符编码
- <ins>**returns**</ins> { [string](dataTypes#string) }

对字符串进行 Base64 解码.

```js
base64.decode('aGVsbG8=', 'iso-8859-1'); // hello
base64.decode('aGVsbG8=', 'us-ascii'); // hello
base64.decode('aGVsbG8=', 'utf-8'); // hello
base64.decode('/v8AaABlAGwAbABv', 'utf-16'); // hello
base64.decode('AGgAZQBsAGwAbw==', 'utf-16be'); // hello
base64.decode('aABlAGwAbABvAA==', 'utf-16le'); // hello
```