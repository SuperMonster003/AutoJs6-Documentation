# CryptoCipherOptions

CryptoCipherOptions 是一个用于 `密码 (Cipher)` 加解密的选项接口, 主要用于 [密文](crypto) 模块.

常见相关方法或属性:

- [crypto.encrypt](crypto#m-encrypt)(data, key, transformation, **options**)
- [crypto.decrypt](crypto#m-decrypt)(data, key, transformation, **options**)

---

<p style="font: bold 2em sans-serif; color: #FF7043">CryptoCipherOptions</p>

---

## [p?] input

- [ `'string'` ] { `'file'` | `'base64'` | `'hex'` | `'string'` } - 输入数据类型

指定密码的输入数据类型.

```js
let key = new crypto.Key('test'.repeat(4));

/* 输入数据类型为 string, 即字符串. */
/* 此时 input 选项可省略, 因 'string' 为默认值. */
console.log(crypto.encrypt('hello world', key, 'AES', { input: 'string' })); // [-52, 100, 9, -87, 1, 80, 33, -26, -70, -9, 17, 106, 38, 63, -94, -41]

/* 输入数据类型为 base64. */
console.log(crypto.encrypt(base64.encode('hello world'), key, 'AES', { input: 'base64' })); // [-52, 100, 9, -87, 1, 80, 33, -26, -70, -9, 17, 106, 38, 63, -94, -41]

/* 输入数据类型为 hex, 即十六进制值. */
console.log(crypto.encrypt('68656c6c6f20776f726c64', key, 'AES', { input: 'hex' })); // [-52, 100, 9, -87, 1, 80, 33, -26, -70, -9, 17, 106, 38, 63, -94, -41]

/* 输入数据类型为 file, 即文件. */
/* input 参数作为文件名, 支持绝对路径及相对路径. */
console.log(crypto.encrypt('./test.txt', key, 'AES', { input: 'file' })); /* 结果取决于具体文件内容. */

/* 加密并将加密结果 (字符串值) 写入文件. */
crypto.encrypt('68656c6c6f20776f726c64', key, 'AES', { input: 'hex', output: 'file', dest: 'encrypted.txt' });
```

## [p?] output

- [ `'bytes'` ] { `'bytes'` | `'base64'` | `'hex'` | `'string'` | `'file'` } - 输出数据类型

指定密码的输出数据类型.

输出数据类型默认是 `'bytes'`, 即字节数组. 如需输出字符串, 可指定 `'string'` 值.

`output` 属性通常用于 crypto.decrypt 方法的选项参数中.

```js
let key = new crypto.Key('test'.repeat(4));

let encrypted = crypto.encrypt('hello world', key, 'AES');

/* 解密时默认输出 bytes 格式, 即字节数组. */
console.log(crypto.decrypt(encrypted, key, 'AES')); // [104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]

/* 解密输出字符串值. */
console.log(crypto.decrypt(encrypted, key, 'AES', { output: 'string' })); // hello world

/* 解密输出十六进制值. */
console.log(crypto.decrypt(encrypted, key, 'AES', { output: 'hex' })); // 68656c6c6f20776f726c64

/* 解密输出字符串并写入文件. */
crypto.decrypt(encrypted, key, 'AES', { output: 'file', dest: './decrypted.txt' });
```

> 注: 当 `output` 指定为 `'file'` 时, 需同时指定 `dest` 属性, 否则将抛出异常.

## [p?] encoding

- [ `'UTF-8'` ] { `'US-ASCII'` | `'ISO-8859-1'` | `'UTF-8'` | `'UTF-16BE'` | `'UTF-16LE'` | `'UTF-16'` } - 编码

指定输入或输出的字符串编码.

`encoding` 属性仅在 `input` 属性为 `'string'` 或 `output` 属性为 `'string'` 时有效, 其他情况 `encoding` 属性的值将被忽略.

```js
let key = new crypto.Key('test'.repeat(4));

let encrypted = crypto.encrypt('hello world', key, 'AES', { input: 'string', encoding: 'utf-16', output: 'hex' });
console.log(encrypted); // 0005750e34f9827f925780eaabd785c18281d84320ccb380b116c3239846e3b4
let decrypted = crypto.decrypt(encrypted, key, 'AES', { input: 'hex', output: 'string', encoding: 'utf-16' });
console.log(decrypted); // hello world
```

## [p?] dest

- { [string](dataTypes#string) } - 目标路径

指定数据处理结果需要写入的目标路径, 是 "destination" 的简写.

`dest` 属性仅当 `output` 属性为 `'file'` 时有效.

```js
let key = new crypto.Key('test'.repeat(4));

let encrypted = crypto.encrypt('hello world', key, 'AES');

/* 解密输出字符串并写入文件. */
crypto.decrypt(encrypted, key, 'AES', { output: 'file', dest: './decrypted.txt' });
```

## [p?] iv

- { [string](dataTypes#string) | [JsByteArray](dataTypes#jsbytearray) | [ByteArray](dataTypes#bytearray) | [java.security.spec.AlgorithmParameterSpec](https://developer.android.com/reference/java/security/spec/AlgorithmParameterSpec) } - 初始向量

`iv` 属性用于指定初始向量.

IV 称为初始向量, 不同 IV 加密后的数据结果不同, 加密和解密需要相同的 IV. 对于每个块来说, key 是不变的, 但仅第一个块的 IV 由用户提供, 其他块 IV 自动生成. IV 的长度通常被认为是 16 字节 (可能会自动按需补齐或截断).

例如在使用 CBC 有向量模式时, `iv` 属性是必要的, 而如果使用 ECB 无向量模式, 则无需 `iv` 属性.

```js
let key = new crypto.Key('test'.repeat(4));

/* 将抛出异常, 因为缺少 IV. */
/* java.security.InvalidAlgorithmParameterException: IV must be specified in CBC mode */
crypto.encrypt('hello world', key, 'AES/CBC/PKCS5Padding');

/* 传入一个 iv 参数 (长度为 16) 进行加密. */
/* 加密的模式为 CBC. */
let encrypted = crypto.encrypt('hello world', key, 'AES/CBC/PKCS5Padding', { iv: 'a 16-byte string' });
console.log(encrypted); // [-91, 30, -6, 67, -61, -32, -56, 26, 0, -85, -13, 113, -45, -68, -118, -115]

/* 使用与加密时相同的 iv 参数进行解密. */
/* 除 iv 参数外, Key, 工作模式, 填充方式也都需要与加密时相同. */
let decrypted = crypto.decrypt(encrypted, key, 'AES/CBC/PKCS5Padding', { input: 'hex', output: 'string', iv: 'a 16-byte string' });
console.log(decrypted); // hello world
```

`iv` 参数也支持 `AlgorithmParameterSpec` 类型:

```js
let key = new crypto.Key('test'.repeat(4));

let iv = new javax.crypto.spec.IvParameterSpec(new java.lang.String('a 16-byte string').getBytes());

let encrypted = crypto.encrypt('hello world', key, 'AES/CBC/PKCS5Padding', { iv: iv });
console.log(encrypted);
let decrypted = crypto.decrypt(encrypted, key, 'AES/CBC/PKCS5Padding', { input: 'hex', output: 'string', iv: iv });
console.log(decrypted);
```