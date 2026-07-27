# 应用设置 (Settings)

settings 模块用于读取和修改 AutoJs6 的布尔型偏好设置.

`settings` 与 `$settings` 指向同一个模块对象.

此模块不是 `android.provider.Settings` 的别名.

---

<p style="font: bold 2em sans-serif; color: #FF7043">settings</p>

---

## [m] isEnabled

### isEnabled(key)

**`6.8.0`**

- **key** { [string](dataTypes#string) } - 设置键或兼容别名
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 设置是否已启用

读取指定布尔型偏好设置.

当设置不存在时返回 `false`.

```js
console.log(settings.isEnabled('foreground_service'));
```

## [m] setEnabled

### setEnabled(key, enabled)

**`6.8.0`**

- **key** { [string](dataTypes#string) } - 设置键或兼容别名
- **enabled** { [boolean](dataTypes#boolean) } - 是否启用设置
- <ins>**returns**</ins> { [void](dataTypes#void) }

写入指定布尔型偏好设置.

```js
let previous = settings.isEnabled('stable_mode');
settings.setEnabled('stable_mode', !previous);
```

## 设置键兼容别名

下表中的每一组名称指向同一项 AutoJs6 设置.

| 设置 | 可用名称 |
| --- | --- |
| 稳定模式 | `stable_mode`, `key_stable_mode` |
| 使用 Root 启用无障碍服务 | `enable_accessibility_service_by_root`, `key_enable_accessibility_service_by_root`, `key_enable_a11y_service_with_root_access` |
| 按音量上键停止全部脚本 | `stop_all_on_volume_up`, `key_use_volume_control_running` |
| 不显示控制台 | `not_show_console`, `key_dont_show_main_activity`, `key_not_showing_main_activity` |
| 前台服务 | `foreground_service`, `key_foreground_service` |

未在表中列出的名称不会被拒绝. 此类名称会作为原始偏好设置键读取或写入.
