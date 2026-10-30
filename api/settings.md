# 应用设置 (Settings)

<!-- runtime-support:begin settings -->
<!-- 本段由 generator/runtime-support.js 根据 AutoJs6 运行时覆盖矩阵生成, 不要手动修改; 数据源 ksp -->

| 运行时支持 | Rhino | Node.js 主线程 | Node.js Worker | Bun |
| --- | --- | --- | --- | --- |
| 入口 | `settings` | `autojs6:settings` | `autojs6:settings` | `host.settings` |
| 状态 | 已支持 4 项 | 已支持 4 项 | 已支持 4 项 | 需授权 4 项 |
| 授权 | - | - | - | `settings.control` 4 项 |

各 API 在同一运行时中的入口, 状态与授权一致, 没有差异项.

Node.js 与 Bun 的导入方式, 异步返回值与授权检查见 [运行时 API](runtimeApis#执行方式).

<!-- runtime-support:end -->

settings 模块用于读取和修改 AutoJs6 的布尔型偏好设置, 以及将 AutoJs6 设置导出为设置归档.

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

`foreground_service` 的返回值是保存的开关设置, 不是服务实时存活状态或 Android 17 while-in-use 能力查询.

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

写入 `foreground_service` 本身不直接启动或停止 Android 服务. 需要恢复 [Android 17 后台音频](media#android-17-后台音频) 时, 在应用界面操作前台服务开关, 不要将 `settings.setEnabled('foreground_service', true)` 当作获取后台播放资格的方法.

```js
let previous = settings.isEnabled('stable_mode');
settings.setEnabled('stable_mode', !previous);
```

## [m] export

### export(path?, categories?)

**`6.8.0`** **`Non-UI`**

- **[ path ]** { [string](dataTypes#string) } - 归档文件或文件夹的路径, 相对路径按脚本工作目录解析 (与 [files.path](files#m-path) 相同); 省略时写入 AutoJs6 工作路径下的 `backups/settings/` 文件夹
- **[ categories ]** { [string](dataTypes#string) | [string](dataTypes#string)[] } - 分类 id 或分类 id 数组, 可由 [categories](#m-categories) 获取; 省略时为导出向导默认勾选的分类
- <ins>**returns**</ins> {{
    - path: [string](dataTypes#string) - 写入的归档文件的绝对路径;
    - categories: [string](dataTypes#string)[] - 写入归档的分类 id, 按设置页顺序排列;
    - entries: [number](dataTypes#number) - 写入的条目总数;
    - unexportable: [number](dataTypes#number) - 无法写入归档而被略去的设置值数量;
    - skipped: {{ id: [string](dataTypes#string); reason: `'sensitive'` | `'empty'` }}[] - 请求了但未写入的分类及原因;
- }} - 导出结果

将 AutoJs6 设置导出为设置归档 (zip 文件). 归档格式与 设置 > 配置 > "管理 AutoJs6 设置" > "导出设置" 向导导出的文件相同, 可在同一页面的 "导入设置" 中导入.

`path` 以 `/` 结尾或为已存在的文件夹时, 归档写入该文件夹, 文件名为 `autojs6-settings-<yyyyMMdd-HHmmss>.zip`. 同一秒已有同名文件时依次追加 `-1`, `-2` 等, 不会替换已有文件. 省略 `path` 时同样如此. 其他路径即归档文件本身 (不会自动追加 `.zip`), 文件已存在时被替换. 缺少的父文件夹会被创建. 归档先写入同一文件夹中的临时文件, 写入失败时不会留下不完整的归档.

`categories` 中的分类按设置页顺序写入, 重复的 id 只写入一次. 默认分类为 [categories](#m-categories) 中 `defaultSelected` 为 `true` 的分类, 与导出向导首次打开时的勾选相同, 包含快捷方式与颜色库两个数据分类.

脚本不能导出凭据. 请求 `credentials` 分类时, 该分类不会写入, 并以 `reason: 'sensitive'` 记入 `skipped`. 数据分类没有可导出的内容时 (例如没有快捷方式), 该分类不会写入, 并以 `reason: 'empty'` 记入 `skipped`.

以下情况抛出异常, 且不会写入任何文件:

- `path` 不是字符串, 或为空白字符串
- `categories` 不是字符串或字符串数组, 或为空数组
- `categories` 含未知的分类 id, 或只请求了 `credentials`
- 在 UI 线程中调用

归档超过 16 MB 或写入失败时同样抛出异常.

```js
let result = settings.export();
console.log(result.path);
console.log(`${result.categories.length} 个分类, ${result.entries} 项`);
```

```js
let result = settings.export('./exports/', [ 'appearance', 'general', 'credentials' ]);
result.skipped.forEach(s => console.log(`${s.id}: ${s.reason}`)); // 打印 "credentials: sensitive".
```

## [m] categories

### categories()

**`6.8.0`** **`Non-UI`**

- <ins>**returns**</ins> {{
    - id: [string](dataTypes#string) - 分类 id, 可用于 [export](#m-export) 的 `categories` 参数;
    - title: [string](dataTypes#string) - 分类名称, 随应用语言变化;
    - kind: `'settings'` | `'data'` - 种类, 分别为设置分类与数据分类 (快捷方式, 颜色库);
    - entries: [number](dataTypes#number) - 当前可导出的条目数;
    - defaultSelected: [boolean](dataTypes#boolean) - 是否属于 [export](#m-export) 的默认分类;
    - sensitive: [boolean](dataTypes#boolean) - 是否为敏感分类 (凭据), 敏感分类不能由脚本导出;
- }}[] - 分类信息数组

获取全部设置分类, 按设置页顺序排列, 与导出向导的分类列表相同.

统计条目数需要读取设置与数据, 因此不能在 UI 线程中调用.

```js
settings.categories()
    .filter(c => c.entries > 0 && !c.sensitive)
    .forEach(c => console.log(`${c.id} (${c.kind}): ${c.title}, ${c.entries} 项`));
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
