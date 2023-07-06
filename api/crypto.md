# 密文 (Crypto)

crypto 模块提供 [ 对称加密 (如 AES) / 非对称加密 (如 RSA) / 消息摘要 (如 MD5, SHA) ] 等支持.

> 注: 本章节参考自 [Auto.js Pro 文档](https://pro.autojs.org/docs/zh/v8/crypto.html).

---

<p style="font: bold 2em sans-serif; color: #FF7043">crypto</p>

---

## [m] digest

### digest(message, algorithm)

**`6.3.2`** **`Overload 1/4`**

- **message** { [string](dataTypes#string) } - 待获取摘要的消息
- **algorithm** { [CryptoDigestAlgorithm](dataTypes#cryptodigestalgorithm) } - 消息摘要算法
- <ins>**returns**</ins> { [string](dataTypes#string) | [JsByteArray](dataTypes#jsbytearray) }

获取 `消息 (message)` 经指定 `算法 (algorithm)` 计算后的 `消息摘要 (message digest)`.

```js
/* 获取字符串 "hello" 的 MD5 摘要. */
console.log(crypto.digest('hello', 'MD5')); // 5d41402abc4b2a76b9719d911017c592

/* 获取字符串 "hello" 的 SHA-1 摘要. */
console.log(crypto.digest('hello', 'SHA-1')); // aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d
```

### digest(message)

**`6.3.2`** **`Overload 2/4`**

- **message** { [string](dataTypes#string) } - 待获取摘要的消息
- <ins>**returns**</ins> { [string](dataTypes#string) }

获取 `消息 (message)` 的 MD5 `消息摘要 (message digest)`.

相当于 `crypto.digest(message, 'MD5')`.

```js
/* 获取字符串 "hello" 的 MD5 摘要. */
console.log(crypto.digest('hello')); // 5d41402abc4b2a76b9719d911017c592
console.log(crypto.digest('hello', 'MD5')); /* 同上. */
```

### digest(message, algorithm, options)

**`6.3.2`** **`Overload 3/4`**

- **message** { [string](dataTypes#string) } - 待获取摘要的消息
- **algorithm** { [CryptoDigestAlgorithm](dataTypes#cryptodigestalgorithm) } - 消息摘要算法
- **options** { [CryptoDigestOptions](dataTypes#cryptodigestoptions) } - 选项参数
- <ins>**returns**</ins> { [string](dataTypes#string) | [JsByteArray](dataTypes#jsbytearray) }

获取 `消息 (message)` 经指定 `算法 (algorithm)` 计算后的 `消息摘要 (message digest)`.

通过 `options` 参数可指定输入消息的类型 (文件, Base64, Hex, 字符串) 及摘要的类型 (字节数组, Base64, Hex, 字符串) 等.

```js
/* 获取字符串 "hello" 的 MD5 摘要, 并输出其字节数组. */
console.log(crypto.digest('hello', 'MD5', { output: 'bytes' })); // [93, 65, 64, 42, -68, 75, 42, 118, -71, 113, -99, -111, 16, 23, -59, -110]

/* 获取字符串 "hello" 的 SHA-1 摘要, 并输出其 Base64 编码. */
console.log(crypto.digest('hello', 'SHA-1', { output: 'base64' })); // qvTGHdzF6KLavt4PO0gs2a6pQ00=

/* 获取 Base64 数据的 MD5 摘要. */
console.log(crypto.digest('qvTGHdzF6KLavt4PO0gs2a6pQ00=', 'MD5', { input: 'base64' })); // 406f65cdc25d6a9db86c06e4bc19a2cf

/* 获取文件的 MD5 摘要. */
let str = 'hello';
let path = files.path(`./tmp-${Date.now()}`);
files.create(path);
files.write(path, str);
console.log(crypto.digest(path, 'MD5', { input: 'file' })); // 5d41402abc4b2a76b9719d911017c592
files.remove(path);
```

### digest(message, options)

**`6.3.2`** **`Overload 4/4`**

- **message** { [string](dataTypes#string) } - 待获取摘要的消息
- **algorithm** { [CryptoDigestAlgorithm](dataTypes#cryptodigestalgorithm) } - 消息摘要算法
- **options** { [CryptoDigestOptions](dataTypes#cryptodigestoptions) } - 选项参数
- <ins>**returns**</ins> { [string](dataTypes#string) | [JsByteArray](dataTypes#jsbytearray) }

获取 `消息 (message)` 的 MD5 `消息摘要 (message digest)`.

通过 `options` 参数可指定输入消息的类型 (文件, Base64, Hex, 字符串) 及摘要的类型 (字节数组, Base64, Hex, 字符串) 等.

相当于 `crypto.digest(message, 'MD5', options)`.

```js
/* 获取字符串 "hello" 的 MD5 摘要, 并输出其字节数组. */
console.log(crypto.digest('hello', { output: 'bytes' })); // [93, 65, 64, 42, -68, 75, 42, 118, -71, 113, -99, -111, 16, 23, -59, -110]

/* 获取 Base64 数据的 MD5 摘要. */
console.log(crypto.digest('qvTGHdzF6KLavt4PO0gs2a6pQ00=', { input: 'base64' })); // 406f65cdc25d6a9db86c06e4bc19a2cf

/* 获取文件的 MD5 摘要. */
let str = 'hello';
let path = files.path(`./tmp-${Date.now()}`);
files.create(path);
files.write(path, str);
console.log(crypto.digest(path, { input: 'file' })); // 5d41402abc4b2a76b9719d911017c592
files.remove(path);
```

## [m] encrypt

### encrypt(data, key, transformation, options?)

**`6.3.2`** **`Overload [1-2]/2`**

- **data** { [string](dataTypes#string) | [JsByteArray](dataTypes#jsbytearray) | [ByteArray](dataTypes#bytearray) } - 待加密数据
- **key** { [crypto.Key](#c-key) | [java.security.Key](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/security/class-use/Key.html) } - 加密密钥
- **transformation** { [CryptoCipherTransformation](dataTypes#cryptociphertransformation) } - 密码转换名称
- **[ options ]** { [CryptoCipherOptions](cryptoCipherOptionsType) } - 选项参数
- <ins>**returns**</ins> { [string](dataTypes#string) | [JsByteArray](dataTypes#jsbytearray) }

数据加密.

#### 输入

`data` 参数的性质可借助 `options.input` 属性进行区分, 详见 [CryptoCipherOptions#input](cryptoCipherOptionsType#p-input).

如果 `data` 参数为字节数组, 则 `options.input` 将被忽略. 因为字节数组可以唯一确定 `data` 的性质, 无需再通过 `options.input` 指定.

#### 输出

`options.output` 指定输出的数据格式, 详见 [CryptoCipherOptions#output](cryptoCipherOptionsType#p-output).

特别地, 当 `options.output` 为 `'file'` 时, 输出格式为十六进制值. 因为加密后写入文件的数据通常是不可读的 (常被视作乱码), 因此最终的返回值类型没有采用 `'string'`, 而是 `'hex'`.

`options.output` 影响的其实仅仅是加密结果的表现形式, 这些形式之前通常可以互相转换. 真正影响加密结果的, 是加密过程.

#### 加密

加密过程受 `key` 和 `transformation` 两个参数的影响. 详见 [crypto.Key](#c-key) 及 [CryptoCipherTransformation](dataTypes#cryptociphertransformation) 小节.

为保证最大兼容性, `key` 参数同时支持原生的 `java.security.Key` 类型, 此时 `key` 将自动按照 `new crypto.Key(key.encoded)` 进行转换.

#### 示例

AES 算法加密示例:

```js
let message = 'hello';

/* 创建密钥实例. */
/* 密钥长度需为 [ 16, 24, 32 ] 之一. */
let key = new crypto.Key('a'.repeat(16));

/* 加密数据, 输出格式保持默认, 即 bytes. */
console.log(crypto.encrypt(message, key, 'AES')); // [-20, 97, -47, 124, 88, 10, 85, -42, -128, -117, 11, 98, -33, -85, 106, 13]

/* 输出格式修改为 Base64. */
console.log(crypto.encrypt(message, key, 'AES', { output: 'base64' })); // 7GHRfFgKVdaAiwti36tqDQ==

/* AES 默认工作模式为 ECB, 默认填充方式为 PKCS5Padding, 结果同上. */
console.log(crypto.encrypt(message, key, 'AES/ECB/PKCS5Padding', { output: 'base64' })); // 7GHRfFgKVdaAiwti36tqDQ==
```

RSA 算法加密示例:

```js
let message = 'hello';

/* 生成 RSA 密钥对. */
let key = crypto.generateKeyPair('RSA', 2048);

/* 使用公钥加密, 转换名称为 RSA/ECB/PKCS1Padding. */
console.log(crypto.encrypt(message, key.publicKey, 'RSA/ECB/PKCS1Padding')); /* 结果随机, 因为生成的密钥是不确定的. */
```

#### 可逆性

加密与解密具有可逆性:

```js
let message = 'hello';
let key = new crypto.Key('a'.repeat(16));
let encrypted = crypto.encrypt(message, key, 'AES');

/* 解密还原为 hello. */
console.log(crypto.decrypt(encrypted, key, 'AES', { output: 'string' }));
```

## [m] decrypt

### decrypt(data, key, transformation, options?)

**`6.3.2`** **`Overload [1-2]/2`**

- **data** { [string](dataTypes#string) | [JsByteArray](dataTypes#jsbytearray) | [ByteArray](dataTypes#bytearray) } - 待解密数据
- **key** { [crypto.Key](#c-key) | [java.security.Key](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/security/class-use/Key.html) } - 解密密钥
- **transformation** { [CryptoCipherTransformation](dataTypes#cryptociphertransformation) } - 密码转换名称
- **[ options ]** { [CryptoCipherOptions](cryptoCipherOptionsType) } - 选项参数
- <ins>**returns**</ins> { [string](dataTypes#string) | [JsByteArray](dataTypes#jsbytearray) }

数据解密.

#### 输入

`data` 参数的性质可借助 `options.input` 属性进行区分, 详见 [CryptoCipherOptions#input](cryptoCipherOptionsType#p-input).

如果 `data` 参数为字节数组, 则 `options.input` 将被忽略. 因为字节数组可以唯一确定 `data` 的性质, 无需再通过 `options.input` 指定.

#### 输出

`options.output` 指定输出的数据格式, 详见 [CryptoCipherOptions#output](cryptoCipherOptionsType#p-output).

特别地, 当 `options.output` 为 `'file'` 时, 输出格式为十六进制值. 因为解密后写入文件的数据通常是不可读的 (常被视作乱码), 因此最终的返回值类型没有采用 `'string'`, 而是 `'hex'`.

`options.output` 影响的其实仅仅是解密结果的表现形式, 这些形式之前通常可以互相转换. 真正影响解密结果的, 是解密过程.

#### 解密

解密过程受 `key` 和 `transformation` 两个参数的影响. 详见 [crypto.Key](#c-key) 及 [CryptoCipherTransformation](dataTypes#cryptociphertransformation) 小节.

为保证最大兼容性, `key` 参数同时支持原生的 `java.security.Key` 类型, 此时 `key` 将自动按照 `new crypto.Key(key.encoded)` 进行转换.

#### 示例

AES 算法解密示例:

```js
let ec = {
    bytes: [
        -20, 97, -47, 124, 88, 10, 85, -42, -128, -117, 11, 98, -33, -85, 106, 13,
    ],
    base64: '7GHRfFgKVdaAiwti36tqDQ==',
    hex: 'ec61d17c580a55d6808b0b62dfab6a0d',
};

/* 创建密钥实例. */
/* 密钥长度需为 [ 16, 24, 32 ] 之一. */
let key = new crypto.Key('a'.repeat(16));

/* 解密数据, 输入为字节数组形式, 输出字符串形式. */
console.log(crypto.decrypt(ec.bytes, key, 'AES', { input: 'bytes', output: 'string' })); // hello

/* 解密数据, 输入为 Base64 形式, 输出字符串形式. */
console.log(crypto.decrypt(ec.base64, key, 'AES', { input: 'base64', output: 'string' })); // hello

/* 解密数据, 输入为十六进制值形式, 输出字符串形式. */
console.log(crypto.decrypt(ec.hex, key, 'AES', { input: 'hex', output: 'string' })); // hello
```

RSA 算法解密示例:

参阅下文 `可逆性` 小节.

#### 可逆性

加密与解密具有可逆性:

```js
let message = 'hello';

/* 生成 RSA 密钥对. */
let key = crypto.generateKeyPair('RSA', 2048);

/* 使用公钥加密, 转换名称为 RSA/ECB/OAEPwithSHA-224andMGF1Padding. */
let ec = crypto.encrypt(message, key.publicKey, 'RSA/ECB/OAEPwithSHA-224andMGF1Padding');

/* 使用私钥解密, 转换名称同样为 RSA/ECB/PKCS1Padding. */
let dc = crypto.decrypt(ec, key.privateKey, 'RSA/ECB/OAEPwithSHA-224andMGF1Padding', { output: 'string' });

/* 解密还原为 message 变量的值, 即 'hello'. */
console.log(dc); // hello
console.log(dc === message); // true
```

## [m] generateKeyPair

### generateKeyPair(algorithm, length?)

**`6.3.2`** **`Overload [1-2]/2`**

- **algorithm** { [CryptoKeyPairGeneratorAlgorithm](dataTypes#cryptokeypairgeneratoralgorithm) } - 密钥对生成器算法
- **[ length = `256` ]** { [number](dataTypes#number) } - 密钥长度
- <ins>**returns**</ins> { [CryptoKeyPair](cryptoKeyPairType) } - 密钥对

生成指定算法及长度的随机密钥对.

> 注: 不同算法对密钥长度有不同的要求.

如需生成固定密钥的密钥对, 可使用 [crypto.KeyPair](#c-keypair) 直接构造.

密钥对通常会参与非对称加密算法的加解密过程:

```js
let message = 'hello';

/* 生成 RSA 密钥对. */
let key = crypto.generateKeyPair('RSA', 2048);

/* 使用公钥加密, 转换名称为 RSA/ECB/OAEPwithSHA-224andMGF1Padding. */
let ec = crypto.encrypt(message, key.publicKey, 'RSA/ECB/OAEPwithSHA-224andMGF1Padding');

/* 使用私钥解密, 转换名称同样为 RSA/ECB/PKCS1Padding. */
let dc = crypto.decrypt(ec, key.privateKey, 'RSA/ECB/OAEPwithSHA-224andMGF1Padding', { output: 'string' });

/* 解密还原为 message 变量的值, 即 'hello'. */
console.log(dc); // hello
console.log(dc === message); // true
```

但需额外注意, 某些算法生成的密钥对, 仅仅用作密钥交换, 密钥交换后将确定一个对称密钥, 最终使用一个对称密钥算法 (如 DES) 进行加解密. 因此密钥对不一定参与非对称加解密过程.

上述情况典型的样例, 当属 Diffie-Hellman（迪菲-赫尔曼) 算法:

```js
let message = 'hello';

/* 生成 Diffie-Hellman（迪菲-赫尔曼) 密钥对. */
let keyPair = crypto.generateKeyPair('DiffieHellman');

/* 借助 Diffie-Hellman 密钥对, 使用 DES 算法生成一个确定的密钥. */
let key = keyPair.toKeySpec('DES');

/* 使用上述密钥加密, 转换名称 (此处可视为算法名称) 也为 DES. */
/* 除 DES 外, 凡是对称加密算法均被支持, 如 AES. */
/* 但需保证与上述 toKeySpec 方法传入的参数一致. */
let ec = crypto.encrypt(message, key, 'DES');

/* 使用上述同一个密钥解密, 转换名称同样为 DES (与加密算法一致). */
let dc = crypto.decrypt(ec, key, 'DES', { output: 'string' });

/* 解密还原为 message 变量的值, 即 'hello'. */
console.log(dc); // hello
console.log(dc === message); // true
```

上述示例再次验证, 密钥对不一定会参与加解密过程. 例如 `DiffieHellman` 密钥对, 仅仅用于确定一个对称密钥.

## [C] Key

### [c] (data, options?)

**`6.3.2`** **`Overload [1-2]/2`**

- **data** { [string](dataTypes#string) | [JsByteArray](dataTypes#jsbytearray) | [ByteArray](dataTypes#bytearray) } - 用于生成密钥的数据
- **[ options ]** { [CryptoCipherOptions](cryptoCipherOptionsType) & {
    - keyPair?: `'public'` | `'private'` - 指定密钥的公私性质, 用于非对称加密
- }} - 选项参数
- <ins>**returns**</ins> { [CryptoKey](cryptoKeyType) }

生成一个自定义密钥.

关于自定义密钥的实例方法属性及相关示例, 参阅 [CryptoKey](cryptoKeyType) 类型章节.

使用 `crypto.Key` 构造函数可以很方便地复制密钥数据:

```js
let key = new crypto.Key('string with length of thrity two');

console.log(key);

let copiedKeyA = new crypto.Key(base64.encode(key.data), { input: "base64" });

console.log(copiedKeyA);

let copiedKeyB = new crypto.Key(key.data, { input: "bytes" });

console.log(copiedKeyB);

let copiedKeyC = new crypto.Key(Crypto.toHex(key.data), { input: "hex" });

console.log(copiedKeyC);
```

## [C] KeyPair

### [c] (publicKeyData, privateKeyData, options?)

**`6.3.2`** **`Overload [1-2]/2`**

- **publicKeyData** { [string](dataTypes#string) | [JsByteArray](dataTypes#jsbytearray) | [ByteArray](dataTypes#bytearray) } - 用于生成公钥的数据
- **privateKeyData** { [string](dataTypes#string) | [JsByteArray](dataTypes#jsbytearray) | [ByteArray](dataTypes#bytearray) } - 用于生成私钥的数据
- **[ options ]** { [CryptoCipherOptions](cryptoCipherOptionsType) } - 选项参数
- <ins>**returns**</ins> { [CryptoKeyPair](cryptoKeyPairType) }

生成一个固定密钥对.

如需生成一个随机密钥对, 可使用 [crypto.generateKeyPair](#m-generatekeypair).

关于密钥对的实例方法属性及相关示例, 参阅 [CryptoKeyPair](cryptoKeyPairType) 类型章节.

使用 `crypto.KeyPair` 构造函数可以很方便地复制密钥对数据:

```js
let keyPair = crypto.generateKeyPair('RSA');

console.log(keyPair);

let copiedKeyPairA = new crypto.KeyPair(
    base64.encode(keyPair.publicKey.data),
    base64.encode(keyPair.privateKey.data),
    { input: 'base64' },
);

console.log(copiedKeyPairA);

let copiedKeyPairB = new crypto.KeyPair(
    keyPair.publicKey.data,
    keyPair.privateKey.data,
    { input: 'bytes' },
);

console.log(copiedKeyPairB);

let copiedKeyPairC = new crypto.KeyPair(
    Crypto.toHex(keyPair.publicKey.data),
    Crypto.toHex(keyPair.privateKey.data),
    { input: "hex" },
);

console.log(copiedKeyPairC);
```