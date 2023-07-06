# CryptoKey

CryptoKey 是 `org.autojs.autojs.core.crypto.Crypto.Key` 的子类, 其实例可代表一个密钥 (确切地说, 是自定义密钥, 而非 Java 密钥), 主要用于 [密文](crypto) 模块.

常见相关方法或属性:

- [CryptoKeyPair#publicKey](cryptoKeyPairType#p-publickey)
- [CryptoKeyPair#privateKey](cryptoKeyPairType#p-privatekey)
- [crypto.Key](crypto#c-key)::new

> 注: 本章节仅列出 CryptoKey 独有的而不包含继承的属性及方法.

---

<p style="font: bold 2em sans-serif; color: #FF7043">CryptoKey</p>

---

## [p] data

**`READONLY`**

- { [ByteArray](dataTypes#bytearray) } - Java 字节数组

以字节数组表示的密钥数据.

```js
console.log(new crypto.Key('Y').data); // [89]
```

## [p] keyPair

**`READONLY`**

- [ `null` ] { `'public'` | `'private'` } - 公私性质

密钥的公私性质, 用于非对称加密.

```js
console.log(new crypto.Key('Y').keyPair); // null
console.log(new crypto.Key('Y', { keyPair: 'public' }).keyPair); // public
```

需特别留意, 与 Auto.js Pro 不同, `keyPair` 默认值为 `null`, 而非 `undefined`. 这是因为 AutoJs6 的 [crypto](crypto) 模块底层实现不是 JavaScript 语言.

## [m] toKeySpec

### toKeySpec(transformation)

- **transformation** { [CryptoCipherTransformation](dataTypes#cryptociphertransformation) } - 密码转换名称
- <ins>**returns**</ins> { [java.security.Key](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/security/class-use/Key.html) } Java 密钥

由密码对生成一个指定算法的 Java 密钥 (Java Key).

`toKeySpec` 中的 "spec" 全称为 "specification", 意为 "规范". 因此, 此方法可理解为将自定义密钥转换为规范的密钥.

```js
/* 生成一个 DES 算法的规范密钥. */

let specKey = new crypto.Key('Y').toKeySpec('DES');
console.log(specKey);

/* 生成一个 RSA 算法的规范密钥对. */

let specPublicKey = new crypto.Key([
    48, 60, 48, 13, 6, 9, 42, -122, 72, -122, -9, 13, 1, 1, 1, 5, 0, 3, 43, 0, 48, 40, 2, 33, 0, -68, -97, -19, 103, 19, 14, 68, 33, -65, 52, 76, 115, 33, 33, 12, 84, -82, -116, 101, 60, 106, 119, -90, -41, 107, -16, 1, 52, 94, 29, -121, 55, 2, 3, 1, 0, 1,
], { keyPair: 'public' });

console.log(specPublicKey.toKeySpec('RSA'));

let specPrivateKey = new crypto.Key([
    48, -127, -62, 2, 1, 0, 48, 13, 6, 9, 42, -122, 72, -122, -9, 13, 1, 1, 1, 5, 0, 4, -127, -83, 48, -127, -86, 2, 1, 0, 2, 33, 0, -32, 71, -69, 124, -32, -63, -67, -61, 9, -54, 91, -81, 127, -102, 62, 102, 124, 19, 65, 49, -14, 40, 52, 23, -101, -64, -14, -34, -44, -88, -70, -15, 2, 3, 1, 0, 1, 2, 32, 0, -86, -9, -99, 52, -95, -121, 15, 20, 43, 111, 61, 40, 100, -10, -42, 25, 40, -111, -44, -102, 107, -8, -83, -56, -77, 89, -109, -83, -97, 77, 53, 2, 17, 0, -2, -37, 9, 64, -54, 67, -75, 73, 87, -118, -35, -8, 103, -9, -101, -3, 2, 17, 0, -31, 73, -116, -122, 27, -20, 59, -10, 60, -13, -85, 0, 1, -117, 27, 5, 2, 17, 0, -10, -47, 78, -66, -50, -92, -112, 55, -67, 110, -95, -42, 103, 106, 40, 73, 2, 16, 48, -127, -28, -106, -17, -90, 50, -42, -9, 18, -60, 43, -15, 41, 33, 125, 2, 16, 8, 74, 76, 65, 77, -95, 96, 94, 81, 44, 46, 51, 69, 62, -6, -24,
], { keyPair: 'private' });

console.log(specPrivateKey.toKeySpec('RSA'));
```

`toKeySpec` 方法在实际应用中几乎不会用到, 它往往用于 `cipher` 对象的初始化.  
为更加深入地了解 `toKeySpec` 的使用方式, 下述示例使用了非常底层的方式展示了一个使用 DES 算法的加密和解密的过程:

```js
/* 原始数据. */
let data = 'ABC..XYZ';

/* 转换名称 (此处可视为算法名称). */
let transformation = 'DES';

/* 获取规范密钥. */

let specKey = new crypto.Key(data).toKeySpec(transformation);

/* 加密过程. */

let cipherA = javax.crypto.Cipher.getInstance(transformation);
cipherA.init(javax.crypto.Cipher.ENCRYPT_MODE, specKey);

let bosA = new java.io.ByteArrayOutputStream();
let cosA = new javax.crypto.CipherOutputStream(bosA, cipherA);
cosA.write(new java.lang.String(data).getBytes(), 0, data.length);
cosA.close();
let resultA = bosA.toByteArray();
bosA.close();

/* 加密后的数据 (字节数组). */
console.log(resultA); // [74, -49, 32, -94, 104, 57, 45, 3, -72, -113, 89, -13, -78, -24, -64, 75]

/* 解密过程, 将加密后的数据 resultA 作为解密的输入数据. */

let cipherB = javax.crypto.Cipher.getInstance(transformation);
cipherB.init(javax.crypto.Cipher.DECRYPT_MODE, specKey);

let bosB = new java.io.ByteArrayOutputStream();
let cosB = new javax.crypto.CipherOutputStream(bosB, cipherB);
cosB.write(resultA, 0, resultA.length);
cosB.close();
let resultB = String(bosB);
bosB.close();

/* 解密后的数据 (字符串). */
console.log(resultB); // ABC..XYZ
console.log(resultB === data); // true
```