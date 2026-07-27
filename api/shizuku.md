# Shizuku

通过 [Shizuku](https://shizuku.rikka.app/introduction/) 可以获得 ADB 特权并使用系统 API.

使用 Shizuku 需满足以下全部条件:

- 设备已安装 [Shizuku 应用](https://github.com/RikkaApps/Shizuku/releases) (版本不低于 `11`)
- Shizuku 服务已启动 (参阅 [Shizuku 用户手册](https://shizuku.rikka.app/guide/setup/#start-shizuku))
- AutoJs6 首页抽屉开启 Shizuku 权限开关

---

<p style="font: bold 2em sans-serif; color: #FF7043">shizuku</p>

---

## [@] shizuku

shizuku 可作为全局对象使用:

```js
typeof shizuku; // "function"
typeof shizuku.execCommand; // "function"
```

### shizuku(command, arguments?, withRoot?)

**`6.4.0`** **`[6.6.0]`** **`Overload 1/2`**

- **command** { [string](dataTypes#string) } - 待执行命令
- **[ arguments ]** { [string](dataTypes#string) | [object](dataTypes#object) | [boolean](dataTypes#boolean) } - 命令参数或兼容 Root 标志
- **[ withRoot = false ]** { [boolean](dataTypes#boolean) } - 兼容 Root 标志
- <ins>**returns**</ins> { [ShellResult](shell#c-shellresult) } - Shell 结果

使用 Shizuku 同步执行命令.

字符串形式的 `arguments` 使用 `|` 分隔参数, 对象形式会转换为命令行选项. 对象的特殊属性 `exit` 可在命令末尾追加退出与清理命令.

`arguments` 中的 `root` 和 `withRoot` 参数为与 [shell](shell) 共用签名的兼容标志. Shizuku 始终使用自身权限执行命令, 这些标志不会切换为 Root.

```js
/* 模拟返回键. */
shizuku('input keyevent 4');
shizuku(`input keyevent ${KeyEvent.KEYCODE_BACK}`); /* 同上. */

/* 模拟电源键. */
shizuku('input keyevent 26');
shizuku(`input keyevent ${KeyEvent.KEYCODE_POWER}`); /* 同上. */

/* 点击屏幕坐标 (100, 120). */
shizuku('input tap 100 120');

/* 授予 AutoJs6 "修改安全设置" 权限. */
shizuku('pm grant org.autojs.autojs6 android.permission.WRITE_SECURE_SETTINGS');

/* 授予 AutoJs6 "投影媒体" 权限. */
shizuku('appops set org.autojs.autojs6 PROJECT_MEDIA allow');

/* 获取当前时间. */
console.log(shizuku('date').result.trim());
```

使用 shizuku 启用 AutoJs6 无障碍服务 (共计 4 步):

```js

/* [ 1. 获取无障碍服务列表, 列表是一个字符串, 不同无障碍服务之间以 ":" 分隔. ] */
let services = shizuku('settings get secure enabled_accessibility_services').result.trim(); /* 结尾 "\n" 可通过 trim() 方法去除. */

/* [ 2. 确保无障碍服务列表中不存在 AutoJs6. ] */
let servicesWithoutAutoJs6 = services
    .split(':') /* 通过 ":" 分割, 获取无障碍服务数组. */
    .filter(it => !it.startsWith(`${autojs.packageName}/`)) /* 过滤可能的 AutoJs6 无障碍服务, 避免重复. */
    .join(':'); /* 重新组合过滤后的无障碍服务, 生成列表. */

/* [ 3. 无障碍服务列表中加入 AutoJs6. ] */
let servicesWithAutoJs6 = (() => {
    /* 无障碍服务格式: "包名/服务类名". */
    let serviceAutoJs6 = `${autojs.packageName}/${org.autojs.autojs.core.accessibility.AccessibilityServiceUsher.class.getName()}`;
    return servicesWithoutAutoJs6.length > 0 ? `${servicesWithoutAutoJs6}:${serviceAutoJs6}` : serviceAutoJs6;
})();

/* [ 4. 通过覆盖系统的无障碍服务列表, 使 AutoJs6 无障碍服务生效. ] */
shizuku(`settings put secure enabled_accessibility_services ${servicesWithAutoJs6}`);

/* 需特别留意, 如果只执行 shizuku(`settings put secure enabled_accessibility_services ${AutoJs6 包名}/${AutoJs6 服务类名}`), 系统将只启用 AutoJs6 无障碍服务, 其他应用的无障碍服务将全部关闭. */

/* 另, 禁用 AutoJs6 无障碍服务, 只需执行上述示例的 [ 1, 2, 4 ] 步骤即可. */
```

### shizuku(commandList, arguments?, withRoot?)

**`6.4.0`** **`[6.6.0]`** **`Overload 2/2`**

- **commandList** { [string](dataTypes#string)[[]](dataTypes#array) } - 待执行的多行命令
- **[ arguments ]** { [string](dataTypes#string) | [object](dataTypes#object) | [boolean](dataTypes#boolean) } - 命令参数或兼容 Root 标志
- **[ withRoot = false ]** { [boolean](dataTypes#boolean) } - 兼容 Root 标志
- <ins>**returns**</ins> { [ShellResult](shell#c-shellresult) } - Shell 结果

使用 Shizuku 一次性执行多行命令. 数组元素以换行符连接后再拼接 `arguments`.

```js
shizuku([ 'cmd-a', 'cmd-b', 'cmd-c' ]);
shizuku('cmd-a\ncmd-b\ncmd-c'); /* 同上. */
```

## [m] execCommand

### execCommand(command, arguments?, withRoot?)

**`6.6.0`**

- **command** { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) } - 命令或命令数组
- **[ arguments ]** { [string](dataTypes#string) | [object](dataTypes#object) | [boolean](dataTypes#boolean) } - 命令参数或兼容 Root 标志
- **[ withRoot = false ]** { [boolean](dataTypes#boolean) } - 兼容 Root 标志
- <ins>**returns**</ins> { [ShellResult](shell#c-shellresult) } - Shell 结果

与直接调用 `shizuku(...)` 等价.

## [m] getCommand

### getCommand(command, arguments?, withRoot?)

**`6.6.0`**

- **command** { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) } - 命令或命令数组
- **[ arguments ]** { [string](dataTypes#string) | [object](dataTypes#object) | [boolean](dataTypes#boolean) } - 命令参数或兼容 Root 标志
- **[ withRoot = false ]** { [boolean](dataTypes#boolean) } - 兼容 Root 标志
- <ins>**returns**</ins> { [string](dataTypes#string) } - 构造后的命令

仅构造 Shizuku 将执行的命令字符串, 不执行命令. `withRoot` 以及 `arguments` 中的 `root` 不改变返回结果.

## [m] kill

### kill(app)

**`6.6.1`**

- **app** { [string](dataTypes#string) } - 应用名称或包名
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否成功停止应用

使用 `am force-stop` 停止应用. Shizuku 不可操作, 无法解析包名或命令退出码非 `0` 时返回 `false`.

## [m] currentPackage

### currentPackage()

**`6.6.1`**

- <ins>**returns**</ins> { [string](dataTypes#string) } - 当前前台应用包名

Shizuku 不可操作或查询失败时返回空字符串.

## [m] currentActivity

### currentActivity()

**`6.6.1`**

- <ins>**returns**</ins> { [string](dataTypes#string) } - 当前前台 Activity 类名

Shizuku 不可操作或查询失败时返回空字符串.

## [m] currentComponent

### currentComponent()

**`6.6.1`**

- <ins>**returns**</ins> { [string](dataTypes#string) } - 当前前台组件

结果通常采用 `package/class` 形式. Shizuku 不可操作或查询失败时返回空字符串.

## [p] state

**`6.7.0`** **`Getter`**

- {{
    - isInstalled: [boolean](dataTypes#boolean);
    - hasService: [boolean](dataTypes#boolean);
    - isRunning: [boolean](dataTypes#boolean);
    - hasPermission: [boolean](dataTypes#boolean);
    - isOperational: [boolean](dataTypes#boolean);
- }}

返回 Shizuku 状态快照. 每次读取都会创建一个新对象:

- `isInstalled` 表示设备上是否存在可启动的 Shizuku 应用
- `hasService` 表示 AutoJs6 是否已取得其 Shizuku 用户服务实例
- `isRunning` 表示 AutoJs6 是否已收到 Shizuku Binder
- `hasPermission` 表示 Shizuku 是否已向 AutoJs6 授权
- `isOperational` 表示 `isRunning` 和 `hasPermission` 是否同时为 `true`

```js
let state = shizuku.state;
console.log(state.isInstalled, state.isOperational);
```
