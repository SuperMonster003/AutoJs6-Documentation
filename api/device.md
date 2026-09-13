# 设备 (Device)

device 模块提供设备构建信息, 内存页大小, 屏幕状态, 电量, 内存, 音量, 振动, 网络和唤醒锁等查询或操作能力.

`device` 与 `$device` 指向同一个模块对象.

设备对象由 AutoJs6 扩充成员和内部 Java `Device` 实例的 Rhino 原型共同组成. 本页记录面向脚本的稳定成员. Java 实现中的 `doVibrate` 等静态 helper 及继承自 `java.lang.Object` 的反射成员仅供内部实现使用, 不作为稳定 API.

修改屏幕亮度或音量的方法需要系统的 "修改系统设置" 权限. 权限不足时, AutoJs6 会打开对应设置页面并抛出 `SecurityException`. IMEI, 硬件序列号和 MAC 地址还会受到 Android 版本, 应用权限及设备实现限制.

---

<p style="font: bold 2em sans-serif; color: #FF7043">device</p>

---

## [p] width

**`Getter`**

- { [number](dataTypes#number) } - 当前设备屏幕宽度, 单位为像素

返回设备的物理屏幕宽度. 屏幕旋转后, 宽度和高度可能互换.

## [p] height

**`Getter`**

- { [number](dataTypes#number) } - 当前设备屏幕高度, 单位为像素

返回设备的物理屏幕高度. 屏幕旋转后, 宽度和高度可能互换.

## [p] rotation

**`6.4.0`** **`Getter`**

- { [number](dataTypes#number) } - 屏幕旋转状态

返回当前屏幕相对于设备自然方向的旋转状态:

- `0`: `Surface.ROTATION_0`.
- `1`: `Surface.ROTATION_90`.
- `2`: `Surface.ROTATION_180`.
- `3`: `Surface.ROTATION_270`.

## [p] orientation

**`6.4.0`** **`Getter`**

- { [number](dataTypes#number) } - 屏幕方向

返回由当前屏幕旋转状态计算的方向:

- `0`: `Configuration.ORIENTATION_UNDEFINED`.
- `1`: `Configuration.ORIENTATION_PORTRAIT`.
- `2`: `Configuration.ORIENTATION_LANDSCAPE`.

## [p] density

**`Getter`**

- { [number](dataTypes#number) } - 屏幕密度, 单位为 DPI

返回当前设备显示指标中的 `densityDpi`.

## [p] pageSize

**`6.8.0`** **`Getter`**

- { [number](dataTypes#number) } - 当前系统的内存页大小, 单位为字节

返回当前运行系统的实际内存页大小, 例如 `4096` (4 KB) 或 `16384` (16 KB). 该属性只读, 与 `$device.pageSize` 等价, 无需额外权限或插件.

页大小通过 `Os.sysconf(OsConstants._SC_PAGESIZE)` 查询, 并在当前进程内缓存. 查询失败时会抛出异常, 不会回退为固定的 `4096`.

此值用于识别当前设备的运行环境, 不表示某个 APK 或原生库是否兼容该页大小. 判断兼容性仍需检查原生库及 APK 打包对齐, 并进行运行验证.

```js
let pageSize = device.pageSize;
console.log('内存页大小: ' + pageSize + ' 字节');
console.log('当前是否使用 16 KB 页: ' + (pageSize === 16384));
```

## [m] summary

### summary()

**`[6.3.0]`**

- <ins>**returns**</ins> { [string](dataTypes#string) } - 多行设备信息摘要

返回 Android 构建版本, 屏幕分辨率, 品牌, 制造商, 设备名称, 型号, 产品名称, 硬件名称, 序列号, IMEI 和 ABI 等信息.

`summary` 在 AutoJs6 6.3.0 起由取值属性变更为方法.

## [m] digest

### digest()

**`[6.3.0]`**

- <ins>**returns**</ins> { [string](dataTypes#string) } - 单行设备信息简表

返回以下 3 组信息, 并使用 `" / "` 分隔:

- 品牌, 以及与品牌不同时的制造商.
- 设备代号, 以及与设备代号不同时的型号.
- Android 版本和 Android API 级别.

`digest` 在 AutoJs6 6.3.0 起由取值属性变更为方法.

## [p] buildId

**`CONSTANT`**

- { [string](dataTypes#string) } - Android 构建显示 ID

对应 `Build.DISPLAY`.

## [p] buildDisplay

**`CONSTANT`**

- { [string](dataTypes#string) } - Android 构建显示 ID

与 [buildId](#p-buildid) 相同, 对应 `Build.DISPLAY`.

## [p] product

**`CONSTANT`**

- { [string](dataTypes#string) } - 整体产品名称

对应 `Build.PRODUCT`.

## [p] board

**`CONSTANT`**

- { [string](dataTypes#string) } - 主板名称

对应 `Build.BOARD`.

## [p] brand

**`CONSTANT`**

- { [string](dataTypes#string) } - 面向用户的产品品牌

对应 `Build.BRAND`.

## [p] manufacturer

**`CONSTANT`**

- { [string](dataTypes#string) } - 产品或硬件制造商

对应 `Build.MANUFACTURER`.

## [p] device

**`CONSTANT`**

- { [string](dataTypes#string) } - 工业设计中的设备代号

对应 `Build.DEVICE`.

## [p] model

**`CONSTANT`**

- { [string](dataTypes#string) } - 面向用户的产品型号

对应 `Build.MODEL`.

## [p] bootloader

**`CONSTANT`**

- { [string](dataTypes#string) } - 系统引导程序版本

对应 `Build.BOOTLOADER`.

## [p] hardware

**`CONSTANT`**

- { [string](dataTypes#string) } - 硬件名称

对应 `Build.HARDWARE`.

## [p] fingerprint

**`CONSTANT`**

- { [string](dataTypes#string) } - Android 构建指纹

对应 `Build.FINGERPRINT`. 构建指纹的格式由 Android 系统决定, 不应依赖固定的分段格式解析.

## [p] sdkInt

**`CONSTANT`**

- { [number](dataTypes#number) } - Android API 级别

对应 `Build.VERSION.SDK_INT`.

## [p] incremental

**`CONSTANT`**

- { [string](dataTypes#string) } - Android 增量构建版本

对应 `Build.VERSION.INCREMENTAL`.

## [p] release

**`CONSTANT`**

- { [string](dataTypes#string) } - 面向用户的 Android 版本

对应 `Build.VERSION.RELEASE`, 如 `"14"`.

## [p] baseOS

**`CONSTANT`**

- { [string](dataTypes#string) } - 产品所基于的基础系统构建

对应 `Build.VERSION.BASE_OS`. 系统未提供此信息时可能为空字符串.

## [p] securityPatch

**`CONSTANT`**

- { [string](dataTypes#string) } - Android 安全补丁级别

对应 `Build.VERSION.SECURITY_PATCH`. 系统未提供此信息时可能为空字符串.

## [p] codename

**`CONSTANT`**

- { [string](dataTypes#string) } - Android 开发代号

对应 `Build.VERSION.CODENAME`. 正式发行构建通常为 `"REL"`.

## [p] serial

**`READONLY`**

- { [string](dataTypes#string) | [null](dataTypes#null) } - 硬件序列号

脚本运行时创建内部设备实例时读取并缓存硬件序列号. Android 不允许当前应用读取时返回 `null`.

## [p] imei

**`READONLY`**

- { [string](dataTypes#string) | [null](dataTypes#null) } - IMEI

脚本运行时创建内部设备实例时读取并缓存 IMEI. 设备不支持电话功能, 权限不足或 Android 不允许当前应用读取时返回 `null`.

## [m] getMarketName

### getMarketName()

**`6.8.0`**

- <ins>**returns**</ins> { [string](dataTypes#string) } - 设备市场名称

按以下系统属性的顺序返回第一个非空值:

- `ro.product.marketname`.
- `ro.semc.product.name`.
- `ro.config.marketing_name`.
- `ro.product.model`.

上述属性均无可用值时返回 [model](#p-model).

<span id="device-getimei"></span>

## [m] getIMEI

### getIMEI()

- <ins>**returns**</ins> { [string](dataTypes#string) | [null](dataTypes#null) } - 缓存的 IMEI

返回 [imei](#p-imei). 此方法不会申请 `android.permission.READ_PHONE_STATE`.

在较新 Android 版本中, 即使应用已获得 `READ_PHONE_STATE`, 系统仍可能限制普通应用读取不可重置的设备标识, 此时返回 `null`.

## [m] getSerial

### getSerial()

- <ins>**returns**</ins> { [string](dataTypes#string) | [null](dataTypes#null) } - 缓存的硬件序列号

返回 [serial](#p-serial). Android 不允许当前应用读取时返回 `null`.

## [m] getAndroidId

### getAndroidId()

- <ins>**returns**</ins> { [string](dataTypes#string) | [null](dataTypes#null) } - Android ID

返回 `Settings.Secure.ANDROID_ID`. Android 8.0 及以上系统通常按应用签名密钥, 用户和设备确定此值. 系统未提供值时返回 `null`.

## [m] getSharedDeviceId

### getSharedDeviceId()

**`6.7.0`**

- <ins>**returns**</ins> { [string](dataTypes#string) | [null](dataTypes#null) } - AutoJs6 共享设备 ID

从 AutoJs6 的设备 ID 内容提供器读取持久化 UUID. AutoJs6 及获准访问同一提供器的应用可取得相同结果, 且不需要读取 IMEI 或硬件序列号. 查询未返回数据时返回 `null`.

## [m] getMacAddress

### getMacAddress()

- <ins>**returns**</ins> { [string](dataTypes#string) | [null](dataTypes#null) } - WLAN 接口 MAC 地址

依次尝试 Wi-Fi 连接信息, `wlan0` 网络接口和 `/sys/class/net/wlan0/address`. 无可用结果时返回 `null`.

Android 的 MAC 地址隐私限制可能使方法取得占位地址或无法取得地址. 不应使用此方法判断 Wi-Fi 是否已连接, 也不应将结果作为稳定设备标识.

## [m] isManufacturer

### isManufacturer(manufacturer)

**`6.4.0`**

- **manufacturer** { [string](dataTypes#string) } - 待匹配的制造商名称
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否匹配当前制造商

去除参数首尾空白后, 与 `Build.MANUFACTURER` 进行不区分大小写的完整匹配.

## [p+] manufacturers

**`6.4.0`** **`READONLY`**

- { [Object](dataTypes#object) } - 常见制造商识别对象

以下方法均不接收参数并返回 [boolean](dataTypes#boolean):

| 方法 | 匹配条件 |
| --- | --- |
| `manufacturers.isHtc()` | 制造商为 HTC |
| `manufacturers.isLG()` | 制造商为 LG |
| `manufacturers.isOnePlus()` | 制造商为 OnePlus |
| `manufacturers.isSamsung()` | 制造商为 Samsung |
| `manufacturers.isZte()` | 制造商为 ZTE |
| `manufacturers.isLetv()` | 制造商为 Letv |
| `manufacturers.isHuawei()` | 制造商为 Huawei, Nova 或 Honor |
| `manufacturers.isNova()` | 制造商为 Nova |
| `manufacturers.isHonor()` | 制造商为 Honor |
| `manufacturers.isXiaomi()` | 制造商为 Xiaomi, 或 [brands](#p-brands) 识别为 Redmi 或 Mi Mix |
| `manufacturers.isOppo()` | 制造商为 Oppo |
| `manufacturers.isSony()` | 制造商为 Sony, 或 [brands](#p-brands) 识别为 Xperia |
| `manufacturers.isVivo()` | 制造商为 Vivo |
| `manufacturers.isLenovo()` | 制造商为 Lenovo |
| `manufacturers.isCoolpad()` | 制造商为 Yulong |
| `manufacturers.isSmartisan()` | 制造商为 Smartisan |
| `manufacturers.isMeizu()` | 制造商为 Meizu |

制造商名称匹配均忽略大小写.

## [p+] brands

**`6.4.0`** **`READONLY`**

- { [Object](dataTypes#object) } - 常见品牌或产品线识别对象

以下方法均不接收参数并返回 [boolean](dataTypes#boolean):

| 方法 | 匹配条件 |
| --- | --- |
| `brands.isXperia()` | 系统属性 `ro.semc.product.name` 包含 `"xperia"` |
| `brands.isRedmi()` | 系统属性 `ro.product.model` 包含 `"redmi"` |
| `brands.isMiMix()` | `Build.MODEL` 包含 `"mi mix"` |

字符串包含判断不区分大小写.

## [p+] roms

**`6.4.0`** **`READONLY`**

- { [Object](dataTypes#object) } - Android 定制系统识别对象

| 方法 | 返回值 | 说明 |
| --- | --- | --- |
| `roms.isBackgroundStartGranted(context?)` | [boolean](dataTypes#boolean) | 检查 MIUI, Vivo 或 Oppo 的后台启动相关权限. 省略 `context` 时使用当前应用上下文. 其他系统返回 `true` |
| `roms.isMiui()` | [boolean](dataTypes#boolean) | 系统属性 `ro.miui.ui.version.name` 是否非空 |
| `roms.isEmui()` | [boolean](dataTypes#boolean) | 系统属性 `ro.build.version.emui` 是否非空 |
| `roms.isOppo()` | [boolean](dataTypes#boolean) | 系统属性 `ro.build.version.opporom` 是否非空 |
| `roms.isSmartisan()` | [boolean](dataTypes#boolean) | 系统属性 `ro.smartisan.version` 是否非空 |
| `roms.isVivo()` | [boolean](dataTypes#boolean) | 系统属性 `ro.vivo.os.version` 是否非空 |
| `roms.isGionee()` | [boolean](dataTypes#boolean) | 系统属性 `ro.gn.sv.version` 是否非空 |
| `roms.isLenovo()` | [boolean](dataTypes#boolean) | 系统属性 `ro.lenovo.lvp.version` 是否非空 |
| `roms.isFlyme()` | [boolean](dataTypes#boolean) | `Build.DISPLAY` 是否包含 `"flyme"` |
| `roms.isQiku()` | [boolean](dataTypes#boolean) | 兼容库是否将当前系统识别为 Qiku 系统 |

`roms.isBackgroundStartGranted(context?)` 的可选参数类型为 [android.content.Context](https://developer.android.com/reference/android/content/Context). 该方法只实现源码中列出的厂商规则, 不能作为所有 Android 系统后台启动能力的通用保证.

## [m] hasReadPhoneStatePermission

### hasReadPhoneStatePermission()

**`6.4.0`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否已授予读取电话状态权限

检查当前应用的 `android.permission.READ_PHONE_STATE` 是否为已授予状态.

此结果只表示权限授予状态. Android 对 IMEI 和硬件序列号的额外限制仍可能使读取结果为 `null`.

## [m] ensureReadPhoneStatePermission

### ensureReadPhoneStatePermission()

**`6.4.0`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

已授予 `android.permission.READ_PHONE_STATE` 时直接返回, 否则抛出 `SecurityException`.

此方法只检查权限, 不会请求权限或打开权限设置页面.

## [m] getBrightness

### getBrightness()

- <ins>**returns**</ins> { [number](dataTypes#number) } - 当前系统屏幕亮度值

读取 `Settings.System.SCREEN_BRIGHTNESS`. Android 通常使用 `0` 到 `255` 的范围. 设置项不存在时抛出 `Settings.SettingNotFoundException`.

## [m] getBrightnessMode

### getBrightnessMode()

- <ins>**returns**</ins> { [number](dataTypes#number) } - 当前系统亮度模式

- `0`: 手动亮度.
- `1`: 自动亮度.

设置项不存在时抛出 `Settings.SettingNotFoundException`.

## [m] setBrightness

### setBrightness(brightness)

- **brightness** { [number](dataTypes#number) } - 新的系统屏幕亮度值
- <ins>**returns**</ins> { [void](dataTypes#void) }

将参数写入 `Settings.System.SCREEN_BRIGHTNESS`. 源码不对参数范围进行校验. 当前处于自动亮度模式时, 写入值不一定立即成为屏幕的实际亮度.

此方法需要系统的 "修改系统设置" 权限.

## [m] setBrightnessMode

### setBrightnessMode(mode)

- **mode** { [number](dataTypes#number) } - 新的系统亮度模式, `0` 表示手动, `1` 表示自动
- <ins>**returns**</ins> { [void](dataTypes#void) }

将参数写入 `Settings.System.SCREEN_BRIGHTNESS_MODE`. 源码不对参数值进行校验.

此方法需要系统的 "修改系统设置" 权限.

## [m] getMusicVolume

### getMusicVolume()

- <ins>**returns**</ins> { [number](dataTypes#number) } - 当前媒体音量

## [m] getNotificationVolume

### getNotificationVolume()

- <ins>**returns**</ins> { [number](dataTypes#number) } - 当前通知音量

## [m] getAlarmVolume

### getAlarmVolume()

- <ins>**returns**</ins> { [number](dataTypes#number) } - 当前闹钟音量

## [m] getMusicMaxVolume

### getMusicMaxVolume()

- <ins>**returns**</ins> { [number](dataTypes#number) } - 媒体音量上限

## [m] getNotificationMaxVolume

### getNotificationMaxVolume()

- <ins>**returns**</ins> { [number](dataTypes#number) } - 通知音量上限

## [m] getAlarmMaxVolume

### getAlarmMaxVolume()

- <ins>**returns**</ins> { [number](dataTypes#number) } - 闹钟音量上限

## [m] setMusicVolume

### setMusicVolume(volume)

- **volume** { [number](dataTypes#number) } - 新的媒体音量
- <ins>**returns**</ins> { [void](dataTypes#void) }

此方法需要系统的 "修改系统设置" 权限. 可使用 [getMusicMaxVolume()](#getmusicmaxvolume) 查询设备支持的上限.

Android 17 还会检查应用的 [后台音频运行条件](media#android-17-后台音频). 调用正常返回不保证音量已经改变; 需要确认实际结果时, 调用 [getMusicVolume()](#getmusicvolume) 读取当前值.

## [m] setNotificationVolume

### setNotificationVolume(volume)

- **volume** { [number](dataTypes#number) } - 新的通知音量
- <ins>**returns**</ins> { [void](dataTypes#void) }

此方法需要系统的 "修改系统设置" 权限. 可使用 [getNotificationMaxVolume()](#getnotificationmaxvolume) 查询设备支持的上限.

Android 17 还会检查应用的 [后台音频运行条件](media#android-17-后台音频). 调用正常返回不保证音量已经改变; 需要确认实际结果时, 调用 [getNotificationVolume()](#getnotificationvolume) 读取当前值.

## [m] setAlarmVolume

### setAlarmVolume(volume)

- **volume** { [number](dataTypes#number) } - 新的闹钟音量
- <ins>**returns**</ins> { [void](dataTypes#void) }

此方法需要系统的 "修改系统设置" 权限. 可使用 [getAlarmMaxVolume()](#getalarmmaxvolume) 查询设备支持的上限.

Android 17 的闹钟音频例外要求精确闹钟授权与闹钟用途, 仍需满足前台运行条件. 调用正常返回不保证音量已经改变; 需要确认实际结果时, 调用 [getAlarmVolume()](#getalarmvolume) 读取当前值. 参阅 [后台音频运行条件](media#android-17-后台音频).

## [m] getBattery

### getBattery()

- <ins>**returns**</ins> { [number](dataTypes#number) } - 电池电量百分比

根据系统电池广播中的电量和满量程计算百分比, 并保留 1 位小数. 无法取得电池广播时返回 `-1`.

## [m] isCharging

### isCharging()

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 设备是否正在充电或已充满且仍连接电源

电池状态为 `BATTERY_STATUS_CHARGING` 或 `BATTERY_STATUS_FULL` 时返回 `true`.

## [m] isPowerSourceAC

### isPowerSourceAC()

**`6.3.2`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 当前电源是否为交流电源

只有 [isCharging()](#ischarging) 为 `true`, 且系统报告 `BATTERY_PLUGGED_AC` 时返回 `true`.

## [m] isPowerSourceUSB

### isPowerSourceUSB()

**`6.3.2`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 当前电源是否为 USB

只有 [isCharging()](#ischarging) 为 `true`, 且系统报告 `BATTERY_PLUGGED_USB` 时返回 `true`.

## [m] isPowerSourceWireless

### isPowerSourceWireless()

**`6.3.2`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 当前电源是否为无线充电

只有 [isCharging()](#ischarging) 为 `true`, 且系统报告 `BATTERY_PLUGGED_WIRELESS` 时返回 `true`.

## [m] isPowerSourceDock

### isPowerSourceDock()

**`6.3.2`** **`API>=33`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 当前电源是否为 Dock

Android API 33 及以上系统中, 只有 [isCharging()](#ischarging) 为 `true`, 且系统报告 `BATTERY_PLUGGED_DOCK` 时返回 `true`. 更低版本固定返回 `false`.

## [m] getTotalMem

### getTotalMem()

- <ins>**returns**</ins> { [number](dataTypes#number) } - 设备内存总量, 单位为字节

## [m] getAvailMem

### getAvailMem()

- <ins>**returns**</ins> { [number](dataTypes#number) } - 当前可用内存, 单位为字节

## [m] getRotation

### getRotation()

**`6.4.0`**

- <ins>**returns**</ins> { [number](dataTypes#number) } - 屏幕旋转状态

返回值与 [rotation](#p-rotation) 相同.

## [m] getOrientation

### getOrientation()

**`6.4.0`**

- <ins>**returns**</ins> { [number](dataTypes#number) } - 屏幕方向

返回值与 [orientation](#p-orientation) 相同.

## [m] isScreenOn

### isScreenOn()

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 屏幕是否处于点亮状态

仅当默认显示设备状态为 `Display.STATE_ON` 时返回 `true`. 息屏显示等不可交互状态不属于此处的点亮状态.

## [m] isScreenOff

### isScreenOff()

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 屏幕是否处于熄灭状态

返回 `!device.isScreenOn()` 的结果.

## [m] isScreenPortrait

### isScreenPortrait()

**`6.4.0`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 屏幕是否为竖屏

屏幕旋转状态为 `Surface.ROTATION_0` 或 `Surface.ROTATION_180` 时返回 `true`.

## [m] isScreenLandscape

### isScreenLandscape()

**`6.4.0`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 屏幕是否为横屏

屏幕旋转状态为 `Surface.ROTATION_90` 或 `Surface.ROTATION_270` 时返回 `true`.

## [m] wakeUp

### wakeUp()

- <ins>**returns**</ins> { [void](dataTypes#void) }

使用带 `ACQUIRE_CAUSES_WAKEUP` 的亮屏唤醒锁保持屏幕点亮约 `200` 毫秒, 以唤醒设备.

## [m] wakeUpIfNeeded

### wakeUpIfNeeded()

- <ins>**returns**</ins> { [void](dataTypes#void) }

仅当 [isScreenOn()](#isscreenon) 返回 `false` 时调用 [wakeUp()](#wakeup).

## [m] keepAwake

### keepAwake(flags)

**`Overload 1/2`**

- **flags** { [number](dataTypes#number) } - Android `PowerManager` 唤醒锁级别及标志
- <ins>**returns**</ins> { [void](dataTypes#void) }

使用指定标志创建并无限期持有唤醒锁, 直到调用 [cancelKeepingAwake()](#cancelkeepingawake) 或以不同标志再次获取唤醒锁.

### keepAwake(flags, timeout)

**`Overload 2/2`**

- **flags** { [number](dataTypes#number) } - Android `PowerManager` 唤醒锁级别及标志
- **timeout** { [number](dataTypes#number) } - 自动释放前的最长时间, 单位为毫秒
- <ins>**returns**</ins> { [void](dataTypes#void) }

使用指定标志创建并在限定时间内持有唤醒锁.

`flags` 可使用 [android.os.PowerManager](https://developer.android.com/reference/android/os/PowerManager) 的 `*_WAKE_LOCK` 和 `ACQUIRE_CAUSES_WAKEUP` 等常量组合. 应用需要声明 `android.permission.WAKE_LOCK`.

## [m] keepScreenOn

### keepScreenOn(timeout?)

- **[ timeout ]** { [number](dataTypes#number) } - 保持时间, 单位为毫秒
- <ins>**returns**</ins> { [void](dataTypes#void) }

使用 `SCREEN_BRIGHT_WAKE_LOCK | ACQUIRE_CAUSES_WAKEUP` 保持屏幕点亮. 省略 `timeout` 时持续持有, 直到主动取消.

此方法不会阻止用户通过电源键等操作关闭屏幕.

## [m] keepScreenDim

### keepScreenDim(timeout?)

- **[ timeout ]** { [number](dataTypes#number) } - 保持时间, 单位为毫秒
- <ins>**returns**</ins> { [void](dataTypes#void) }

使用 `SCREEN_DIM_WAKE_LOCK | ACQUIRE_CAUSES_WAKEUP` 保持设备唤醒, 同时允许屏幕变暗. 省略 `timeout` 时持续持有, 直到主动取消.

## [m] cancelKeepingAwake

### cancelKeepingAwake()

- <ins>**returns**</ins> { [void](dataTypes#void) }

释放当前由 device 模块持有的唤醒锁. 没有正在持有的唤醒锁时不执行操作.

## [m] vibrate

### vibrate(millis)

**`Overload 1/5`**

- **millis** { [number](dataTypes#number) } - 振动时长, 单位为毫秒
- <ins>**returns**</ins> { [void](dataTypes#void) }

使设备振动一次.

### vibrate(timings)

**`6.1.0`** **`Overload 2/5`**

- **timings** { [number](dataTypes#number)[] } - 交替表示等待和振动时长的模式数组, 单位为毫秒
- <ins>**returns**</ins> { [void](dataTypes#void) }

模式数组从等待时长开始, 后续元素在等待和振动之间交替.

### vibrate(off, millis)

**`6.1.0`** **`Overload 3/5`**

- **off** { [number](dataTypes#number) } - 振动前的等待时长, 单位为毫秒
- **millis** { [number](dataTypes#number) } - 振动时长, 单位为毫秒
- <ins>**returns**</ins> { [void](dataTypes#void) }

### vibrate(timingsWithoutOff, off)

**`6.3.0`** **`Overload 4/5`**

- **timingsWithoutOff** { [number](dataTypes#number)[] } - 不含首个等待时长的模式数组
- **off** { [number](dataTypes#number) } - 添加到模式数组开头的等待时长, 单位为毫秒
- <ins>**returns**</ins> { [void](dataTypes#void) }

相当于 `device.vibrate([ off ].concat(timingsWithoutOff))`.

### vibrate(morseCode, delay?)

**`6.1.0`** **`Overload 5/5`**

- **morseCode** { [string](dataTypes#string) } - 待转换为摩斯电码振动模式的文本
- **[ delay = 0 ]** { [number](dataTypes#number) } - 开始振动前的等待时长, 单位为毫秒
- <ins>**returns**</ins> { [void](dataTypes#void) }

振动调用会立即返回, 振动由 Android 系统继续执行. 应用需要声明 `android.permission.VIBRATE`.

## [m] cancelVibration

### cancelVibration()

- <ins>**returns**</ins> { [void](dataTypes#void) }

取消 device 模块使用的系统振动器当前正在执行的振动.

## [m] getIpAddress

### getIpAddress(useIPv4?)

- **[ useIPv4 = true ]** { [boolean](dataTypes#boolean) } - 是否获取 IPv4 地址
- <ins>**returns**</ins> { [string](dataTypes#string) } - 当前设备的 IP 地址

扫描网络接口并返回第一个非回环地址. `useIPv4` 为 `true`, `null` 或 `undefined` 时返回 IPv4 地址, 为 `false` 时返回 IPv6 地址. IPv6 地址使用大写形式并移除区域标识. 无可用地址时返回 `"0.0.0.0"`.

## [m] getIpv6Address

### getIpv6Address()

- <ins>**returns**</ins> { [string](dataTypes#string) } - 当前设备的 IPv6 地址

相当于 `device.getIpAddress(false)`.

## [m] getGatewayAddress

### getGatewayAddress()

- <ins>**returns**</ins> { [string](dataTypes#string) } - 当前 Wi-Fi 网关的 IPv4 地址

返回当前 Wi-Fi DHCP 配置中的网关地址. 无可用地址时返回 `"0.0.0.0"`.

## [m] isActiveNetworkMetered

### isActiveNetworkMetered()

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 当前活动网络是否按流量计费

## [m] isConnectedOrConnecting

### isConnectedOrConnecting()

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 活动网络是否已连接或正在连接

## [m] isWifiAvailable

### isWifiAvailable()

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 当前活动网络是否为 Wi-Fi

此结果表示正在使用的网络类型, 不表示 Wi-Fi 适配器是否已启用.

## [m] setPointerLocation

### setPointerLocation(enabled)

**`6.7.0`**

- **enabled** { [boolean](dataTypes#boolean) } - 是否启用系统指针位置显示
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 目标状态是否已确认

当前状态已经符合目标时直接返回 `true`. 需要修改时依次尝试 Root 和 Shizuku 命令, 无可用权限或修改后的状态校验失败时返回 `false`.

## [m] setPointerLocationEnabled

### setPointerLocationEnabled()

**`6.7.0`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否已确认启用

相当于 `device.setPointerLocation(true)`.

## [m] setPointerLocationDisabled

### setPointerLocationDisabled()

**`6.7.0`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否已确认禁用

相当于 `device.setPointerLocation(false)`.

## [m] isPointerLocationEnabled

### isPointerLocationEnabled()

**`6.7.0`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 系统指针位置显示是否已启用

依次尝试系统设置接口, Root 命令和 Shizuku 命令读取状态.

## [m] isPointerLocationDisabled

### isPointerLocationDisabled()

**`6.7.0`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 系统指针位置显示是否已禁用

依次尝试系统设置接口, Root 命令和 Shizuku 命令读取状态. 所有读取方式均失败时, 当前实现按禁用状态处理.

## [m] togglePointerLocation

### togglePointerLocation()

**`6.7.0`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 切换后的目标状态是否已确认

读取当前状态并切换系统指针位置显示. 需要修改时依次尝试 Root 和 Shizuku 命令.
