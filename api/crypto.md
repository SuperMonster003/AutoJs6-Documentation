# Crypto

** [[Pro 8.0.0新增](https://pro.autojs.org/)] **

$crypto模块提供了对称加密(例如AES)、非对称加密(例如RSA)、消息摘要(例如MD5, SHA)等支持。

## $crypto.digest(message, algorithm[, options])
* `message` {any}
* `algorithm` {string} 消息摘要算法，包括：
    * MD5
    * SHA-1
    * SHA-256
    * SHA-384
    * SHA-512
* `options` {any}

对信息message使用消息摘要算法`algorithm`进行摘要并返回结果，默认的输出格式为hex。

参数message的类型默认为字符串，返回值默认为hex；可以通过options来指定参数message的类型和返回值的类型、格式，比如文件、base64、字节数组、hex等。参见《输入和输出的类型和格式》。

```javascript
// 计算字符串abc的md5
toastLog($crypto.digest("abc", "MD5"));
// 计算字符串abc的sha-256
toastLog($crypto.digest("abc", "SHA-256"));
// 计算文件/sdcard/1.txt的md5
toastLog($crypto.digest("/sdcard/1.txt", "MD5", {
    input: "file"
}));
```

## $crypto.encrypt(data, key, algorithm, options)
* `data` {any} 明文消息
* `key` {Key} 密钥
* `algorithm` {string} 加密算法，包括：
    * AES
    * AES/ECB/NoPadding
    * AES/ECB/PKCS5Padding
    * AES/CBC/NoPadding
    * AES/CBC/PKCS5Padding
    * AES/CFB/NoPadding
    * AES/CFB/PKCS5Padding
    * AES/CTR/NoPadding
    * AES/CTR/PKCS5Padding
    * AES/OFB/PKCS5Padding
    * AES/OFB/PKCS5Padding
    * RSA/ECB/PKCS1Padding
    * RSA/ECB/NoPadding
    * ...
    具体可参阅 [javax.crypto.Cipher](https://developer.android.com/reference/javax/crypto/Cipher)

* `options` {Object} 加密选项

## 输入和输出的类型和格式

