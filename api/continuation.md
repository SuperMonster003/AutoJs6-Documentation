# 续体 (Continuation)

`continuation` 模块用于捕获和恢复 Rhino 脚本执行状态.

此模块仅在脚本项目配置的 `useFeatures` 数组包含 `"continuation"` 时可用:

```json
{
  "scripts": {},
  "useFeatures": [ "continuation" ]
}
```

---

<p style="font: bold 2em sans-serif; color: #FF7043">continuation</p>

---

## [p] enabled

**`Getter`** **`READONLY`**

- { [boolean](dataTypes#boolean) }

当前脚本引擎是否启用了 `continuation` 特性.

---

## [m] create

### create(scope?)

- **[ scope ]** { [Object](dataTypes#object) } - 捕获续体时使用的 Rhino 作用域
- <ins>**returns**</ins> { [ContinuationCreator](#continuationcreator) } - 续体控制对象

创建续体控制对象. 省略 **scope** 时使用当前脚本作用域.

未启用 `continuation` 特性时, 调用返回对象的 [await](#m-await) 将抛出异常.

---

## ContinuationCreator

`continuation.create()` 返回的续体控制对象.

### [m] await

#### await()

- <ins>**returns**</ins> { [any](dataTypes#any) } - 恢复续体时提供的结果

挂起当前执行并等待 [resume](#m-resume) 或 [resumeError](#m-resumeerror) 恢复.

### [m] resume

#### resume(result?)

- **[ result ]** { [any](dataTypes#any) } - 恢复结果, 默认为 `undefined`
- <ins>**returns**</ins> { [void](dataTypes#void) }

成功恢复续体. **result** 将成为 [await](#m-await) 的返回值.

### [m] resumeError

#### resumeError(error)

- **error** { [any](dataTypes#any) } - 非 `null` 且非 `undefined` 的失败结果
- <ins>**returns**</ins> { [void](dataTypes#void) }

以失败结果恢复续体. [await](#m-await) 将按 Rhino 续体错误语义处理 **error**.
