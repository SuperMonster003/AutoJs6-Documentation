# 按键 (Keys)

本章包含按键代码属性, 无障碍全局动作和 Shell 按键指令.

- `keys` 与 `$keys` 指向同一个按键代码对象.
- 小写动作同时挂载在 `automator` 对象和全局作用域, 依赖无障碍服务.
- 大写动作以及 `KeyCode`, `Text` 和 `Input` 是全局 Shell 指令.

大写按键动作和 `KeyCode` 从 AutoJs6 6.7.1 起优先通过可用的 Shizuku 服务执行. Shizuku 不可用时回退到 Root Shell. 这些方法不返回命令执行状态.

---

<p style="font: bold 2em sans-serif; color: #FF7043">keys</p>

---

`keys` 中的初始值来自 Android `KeyEvent.KEYCODE_*` 常量, 可用于 [按键事件监听](events#事件-key).

这些属性在当前实现中不可删除, 但没有设置为只读, 因此脚本仍可覆盖属性值. 通常应仅将它们作为按键代码查询表使用.

## [p] home

- [ `3` ] { [number](dataTypes#number) } - 主屏幕键代码

## [p] HOME

- [ `3` ] { [number](dataTypes#number) } - [home](#p-home) 的大写别名

## [p] menu

- [ `82` ] { [number](dataTypes#number) } - 菜单键代码

## [p] MENU

- [ `82` ] { [number](dataTypes#number) } - [menu](#p-menu) 的大写别名

## [p] back

- [ `4` ] { [number](dataTypes#number) } - 返回键代码

## [p] BACK

- [ `4` ] { [number](dataTypes#number) } - [back](#p-back) 的大写别名

## [p] volumeUp

- [ `24` ] { [number](dataTypes#number) } - 音量上键代码

## [p] volume_up

- [ `24` ] { [number](dataTypes#number) } - [volumeUp](#p-volumeup) 的下划线别名

## [p] VOLUME_UP

- [ `24` ] { [number](dataTypes#number) } - [volumeUp](#p-volumeup) 的大写下划线别名

## [p] volumeDown

- [ `25` ] { [number](dataTypes#number) } - 音量下键代码

## [p] volume_down

- [ `25` ] { [number](dataTypes#number) } - [volumeDown](#p-volumedown) 的下划线别名

## [p] VOLUME_DOWN

- [ `25` ] { [number](dataTypes#number) } - [volumeDown](#p-volumedown) 的大写下划线别名

---

<p style="font: bold 2em sans-serif; color: #FF7043">automator</p>

---

以下方法调用 Android 无障碍服务的全局动作. 返回值表示无障碍服务是否接受了对应动作. 无障碍服务不可用, 系统不支持该动作或系统拒绝执行时返回 `false`.

## [m] back

### automator.back()

**`Global`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否执行成功

执行系统返回动作.

```js
if (!back()) {
    console.warn('Back action was not accepted');
}
```

## [m] home

### automator.home()

**`Global`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否执行成功

执行系统主屏幕动作.

## [m] powerDialog

### automator.powerDialog()

**`Global`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否执行成功

打开系统电源菜单.

## [m] notifications

### automator.notifications()

**`Global`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否执行成功

展开系统通知栏.

## [m] quickSettings

### automator.quickSettings()

**`Global`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否执行成功

展开系统快速设置面板.

## [m] recents

### automator.recents()

**`Global`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否执行成功

打开系统最近任务界面.

## [m] splitScreen

### automator.splitScreen()

**`Global`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否执行成功

执行系统切换分屏动作. 实际结果还取决于设备系统和当前界面是否支持分屏.

---

## Shell 按键指令

以下大写方法分别向 Android `input keyevent` 发送固定键码. Shizuku 可用时通过 Shizuku 执行, 否则通过 Root Shell 执行.

## [m] Menu

### Menu()

**`Global`** **`[6.7.1]`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

发送菜单键, 键码为 `82`.

## [m] Home

### Home()

**`Global`** **`[6.7.1]`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

发送主屏幕键, 键码为 `3`.

## [m] Back

### Back()

**`Global`** **`[6.7.1]`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

发送返回键, 键码为 `4`.

## [m] Up

### Up()

**`Global`** **`[6.7.1]`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

发送方向上键, 键码为 `19`.

## [m] Down

### Down()

**`Global`** **`[6.7.1]`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

发送方向下键, 键码为 `20`.

## [m] Left

### Left()

**`Global`** **`[6.7.1]`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

发送方向左键, 键码为 `21`.

## [m] Right

### Right()

**`Global`** **`[6.7.1]`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

发送方向右键, 键码为 `22`.

## [m] OK

### OK()

**`Global`** **`[6.7.1]`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

发送方向中心键, 键码为 `23`.

## [m] VolumeUp

### VolumeUp()

**`Global`** **`[6.7.1]`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

发送音量上键, 键码为 `24`.

## [m] VolumeDown

### VolumeDown()

**`Global`** **`[6.7.1]`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

发送音量下键, 键码为 `25`.

## [m] Power

### Power()

**`Global`** **`[6.7.1]`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

发送电源键, 键码为 `26`.

## [m] Camera

### Camera()

**`Global`** **`[6.7.1]`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

发送相机键, 键码为 `27`.

## [m] KeyCode

### KeyCode(code)

**`Global`** **`[6.7.1]`**

- **code** { [number](dataTypes#number) | [string](dataTypes#string) } - 按键代码或名称
- <ins>**returns**</ins> { [void](dataTypes#void) }

使用 Shizuku 或 Root Shell 发送一个按键事件.

**code** 支持下列形式, 字母不区分大小写:

- 十进制键码, 如 `29` 或 `"29"`.
- 十六进制键码字符串, 如 `"0x1D"`.
- 完整按键名称, 如 `"KEYCODE_A"`.
- 省略 `KEYCODE_` 前缀的按键名称, 如 `"A"`.

无法识别的名称, `KEYCODE_UNKNOWN` 或无法解析的数值会导致异常.

```js
KeyCode(29);
KeyCode('A');
KeyCode('KEYCODE_A');
KeyCode('0x1D');
```

## [m] Text

### Text(text)

**`Global`**

- **text** { [string](dataTypes#string) } - 传给 `input text` 的文本
- <ins>**returns**</ins> { [void](dataTypes#void) }

通过 Root Shell 执行 `input text`. 参数会直接拼接到 Shell 命令, 不会自动进行引号包裹或 Shell 转义.

## [m] Input

### Input(text)

**`Global`**

- **text** { [string](dataTypes#string) } - 传给 `input text` 的文本
- <ins>**returns**</ins> { [void](dataTypes#void) }

[Text](#m-text) 的同义方法.

## 参阅

- [Android KeyEvent 常量](https://developer.android.com/reference/android/view/KeyEvent)
