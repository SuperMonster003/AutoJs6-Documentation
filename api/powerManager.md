# 电源管理 (PowerManager)

powerManager 模块用于查询和请求应用的电池优化豁免状态.

`powerManager`, `$powerManager`, `power_manager` 与 `$power_manager` 指向同一个模块对象.

---

<p style="font: bold 2em sans-serif; color: #FF7043">powerManager</p>

---

## [m] isIgnoringBatteryOptimizations

### isIgnoringBatteryOptimizations(packageName?)

**`6.8.0`**

- **[ packageName = 当前应用包名 ]** { [string](dataTypes#string) } - 待查询应用的包名
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 应用是否已忽略电池优化

查询指定应用是否已被系统加入电池优化豁免列表.

省略 `packageName`, 或传入 `null` 或 `undefined` 时, 查询当前 AutoJs6 或打包应用.

```js
if (!powerManager.isIgnoringBatteryOptimizations()) {
    console.log('当前应用尚未忽略电池优化');
}
```

## [m] requestIgnoreBatteryOptimizations

### requestIgnoreBatteryOptimizations(forceRequest?, packageName?)

**`6.8.0`**

- **[ forceRequest = `false` ]** { [boolean](dataTypes#boolean) } - 是否忽略当前豁免状态并强制发起请求
- **[ packageName = 当前应用包名 ]** { [string](dataTypes#string) } - 待请求豁免的应用包名
- <ins>**returns**</ins> { [void](dataTypes#void) }

打开系统电池优化豁免请求页面.

当 `forceRequest` 为 `false` 且指定应用已经忽略电池优化时, 此方法不打开页面.

省略 `packageName`, 或传入 `null` 或 `undefined` 时, 请求当前 AutoJs6 或打包应用的豁免.

```js
powerManager.requestIgnoreBatteryOptimizations();
```

> 注: 是否授予豁免由 Android 系统和用户决定. 调用此方法不代表豁免已经生效.
