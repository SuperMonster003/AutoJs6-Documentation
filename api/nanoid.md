# Nano ID

`nanoid` 模块用于生成随机字符串 ID.

生成结果只包含 URL 安全字符 `A-Z`, `a-z`, `0-9`, `_` 和 `-`. 随机数据由 `java.security.SecureRandom` 提供.

`nanoid` 与 `$nanoid` 引用同一个对象.

---

<p style="font: bold 2em sans-serif; color: #FF7043">nanoid</p>

---

## [@] nanoid

### nanoid(size?)

**`6.6.0`**

- **[ size = `21` ]** { [number](dataTypes#number) } - ID 长度
- <ins>**returns**</ins> { [string](dataTypes#string) } - 随机 ID

生成长度为 `size` 的随机字符串 ID.

```js
let id = nanoid();

console.log(id.length); // 21
console.log(/^[A-Za-z0-9_-]+$/.test(id)); // true
```

指定长度:

```js
let shortId = nanoid(8);
let longId = nanoid(32);

console.log(shortId.length); // 8
console.log(longId.length); // 32
```

`size` 会转换为 32 位整数, 必须为非负数. `size` 为 `0` 时返回空字符串, 负数会导致异常.

生成结果不保证绝对唯一. 对唯一性要求较高时, 应根据 ID 数量和可接受的冲突概率选择足够的长度.
