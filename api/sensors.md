# 传感器 (Sensors)

`sensors` 模块用于查询和监听 Android 设备的硬件及软件传感器. `sensors` 与 `$sensors` 指向同一个对象.

脚本只能读取系统分发的传感器数据, 不能模拟或伪造传感器事件. 每次成功注册都会创建一个 [SensorEventEmitter](#c-sensoreventemitter). 未注销的监听器会使脚本保持运行. 脚本运行时被回收时, AutoJs6 会自动注销当前模块中的全部传感器监听器.

`sensors` 继承 [EventEmitter](eventEmitterType), 因此可以使用 `on`, `once`, `removeListener` 等事件方法.

## 传感器名称

`sensorName` 不区分大小写. AutoJs6 直接支持下列名称:

| 名称 | Android 类型 | `change` 事件中 `event` 之后的常见值 |
| --- | --- | --- |
| `accelerometer` | `TYPE_ACCELEROMETER` | `ax, ay, az`, 单位为 `m/s^2` |
| `ambient_temperature` | `TYPE_AMBIENT_TEMPERATURE` | `temperature`, 单位为摄氏度 |
| `temperature` | `TYPE_AMBIENT_TEMPERATURE` | `temperature`, `ambient_temperature` 的别名 |
| `gravity` | `TYPE_GRAVITY` | `gx, gy, gz`, 单位为 `m/s^2` |
| `gyroscope` | `TYPE_GYROSCOPE` | `wx, wy, wz`, 单位为 `rad/s` |
| `light` | `TYPE_LIGHT` | `illuminance`, 单位为 `lx` |
| `linear_acceleration` | `TYPE_LINEAR_ACCELERATION` | `ax, ay, az`, 单位为 `m/s^2` |
| `magnetic_field` | `TYPE_MAGNETIC_FIELD` | `bx, by, bz`, 单位为 `uT` |
| `orientation` | `TYPE_ORIENTATION` | `azimuth, pitch, roll`, 单位为度 |
| `pressure` | `TYPE_PRESSURE` | `pressure`, 单位为 `hPa` |
| `proximity` | `TYPE_PROXIMITY` | `distance`, 通常以 `cm` 表示 |
| `relative_humidity` | `TYPE_RELATIVE_HUMIDITY` | `humidity`, 范围通常为 `0 - 100` |

`orientation` 对应 Android 已弃用的方向传感器类型. 新代码通常应结合旋转矢量等传感器计算设备方向.

除上表外, AutoJs6 还会通过反射查找 `android.hardware.Sensor.TYPE_<NAME>` 字段. 例如, `"step_counter"` 会尝试使用 `Sensor.TYPE_STEP_COUNTER`. 传入名称时不要包含 `TYPE_` 前缀. 字段是否存在取决于当前 Android 版本, 默认传感器是否存在取决于设备.

不同设备可以为同一种传感器提供不同长度的 `SensorEvent.values`. 监听器应以实际收到的 `values` 为准, 不应假定上表中的常见值数量始终固定.

---

<p style="font: bold 2em sans-serif; color: #FF7043">sensors</p>

---

## [p+] delay

**`READONLY`**

- { org.autojs.autojs.runtime.api.Sensors.Delay } - 预设采样周期常量对象

### [p] delay.normal

**`CONSTANT`**

- [[ 3 ]] { [number](dataTypes#number) } - Android `SENSOR_DELAY_NORMAL`

### [p] delay.ui

**`CONSTANT`**

- [[ 2 ]] { [number](dataTypes#number) } - Android `SENSOR_DELAY_UI`

### [p] delay.game

**`CONSTANT`**

- [[ 1 ]] { [number](dataTypes#number) } - Android `SENSOR_DELAY_GAME`

### [p] delay.fastest

**`CONSTANT`**

- [[ 0 ]] { [number](dataTypes#number) } - Android `SENSOR_DELAY_FASTEST`

这些值是 Android 定义的采样周期预设, 不是固定的事件间隔. [register(sensorName, delay)](#registersensorname-delay) 也接受以微秒表示的采样周期整数. 传感器实际分发频率由系统和硬件决定.

## [p] ignoresUnsupportedSensor

**`Getter/Setter`**

- [ `false` ] { [boolean](dataTypes#boolean) } - 是否忽略不支持的传感器

值为 `false` 时, 注册未知类型或设备没有默认实例的传感器会返回 `null`.

值为 `true` 时, [register](#m-register) 会触发 `unsupported_sensor` 事件, 并返回一个不会产生传感器事件的共享空发射器. 此模式便于省略空值判断, 但不会使设备获得原本不存在的传感器.

```js
sensors.ignoresUnsupportedSensor = true;

sensors.on('unsupported_sensor', (sensorName) => {
    console.warn(`Unsupported sensor: ${sensorName}`);
});

let emitter = sensors.register('not_a_sensor');
console.log(emitter === null); // false
```

## [m] getSensor

### getSensor(sensorName)

- **sensorName** { [string](dataTypes#string) } - 传感器名称
- <ins>**returns**</ins> { [android.hardware.Sensor](https://developer.android.com/reference/android/hardware/Sensor) | [null](dataTypes#null) } - 默认传感器, 不存在时为 `null`

查询名称对应的系统默认传感器, 但不注册监听器.

## [m] register

### register(sensorName)

**`Overload 1/2`**

- **sensorName** { [string](dataTypes#string) } - 传感器名称
- <ins>**returns**</ins> { [SensorEventEmitter](#c-sensoreventemitter) | [null](dataTypes#null) } - 传感器事件发射器, 不支持时可能为 `null`

使用 [delay.normal](#p-delaynormal) 注册传感器监听器.

### register(sensorName, delay)

**`Overload 2/2`**

- **sensorName** { [string](dataTypes#string) } - 传感器名称
- **delay** { [number](dataTypes#number) } - 采样周期预设或以微秒表示的采样周期
- <ins>**returns**</ins> { [SensorEventEmitter](#c-sensoreventemitter) | [null](dataTypes#null) } - 传感器事件发射器, 不支持时可能为 `null`

注册指定传感器, 并返回用于接收事件和注销监听的发射器.

```js
let gravity = sensors.register('gravity', sensors.delay.game);

if (gravity === null) {
    console.warn('Gravity sensor is unavailable');
} else {
    gravity.on('change', (event, gx, gy, gz) => {
        console.log(`gravity: ${gx}, ${gy}, ${gz}`);
    });
}
```

传感器名称无法解析或设备没有该类型的默认传感器时, 返回行为由 [ignoresUnsupportedSensor](#p-ignoresunsupportedsensor) 决定.

返回非 `null` 发射器表示 AutoJs6 已向系统提交注册, 不保证设备一定会分发数据. 硬件状态, 系统策略或传感器所需权限仍可能阻止事件产生.

## [m] unregister

### unregister(emitter)

- **emitter** { [SensorEventEmitter](#c-sensoreventemitter) | [null](dataTypes#null) } - 要注销的传感器事件发射器
- <ins>**returns**</ins> { [void](dataTypes#void) }

注销一个传感器监听器. `emitter` 为 `null` 时不执行操作.

也可以调用发射器自身的 [unregister](#m-sensoreventemitterunregister).

## [m] unregisterAll

### unregisterAll()

- <ins>**returns**</ins> { [void](dataTypes#void) }

注销当前 `sensors` 模块创建的全部传感器监听器.

当前实现还会移除 `sensors` 的脚本循环退出处理器, 且后续 [register](#m-register) 不会重新添加该处理器. 因此在调用 `unregisterAll()` 后再次注册传感器时, 如果脚本主体即将结束, 应使用 [timers.keepAlive](timers#m-keepalive) 等方式显式保持脚本运行.

## unsupported_sensor

- **sensorName** { [string](dataTypes#string) } - 无法注册的原始传感器名称

仅当 [ignoresUnsupportedSensor](#p-ignoresunsupportedsensor) 为 `true` 时, 每次注册不支持的传感器都会在 `sensors` 上触发此事件.

---

## [C] SensorEventEmitter

- <ins>**extends**</ins> { [EventEmitter](eventEmitterType) }

`SensorEventEmitter` 是 [register](#m-register) 返回的单个传感器监听对象. 它继承 EventEmitter 的全部实例方法.

### [m#] SensorEventEmitter#unregister

#### unregister()

- <ins>**returns**</ins> { [void](dataTypes#void) }

从创建此对象的 `sensors` 模块注销当前监听器.

```js
let light = sensors.register('light');

if (light !== null) {
    light.once('change', (event, illuminance) => {
        console.log(illuminance);
        light.unregister();
    });
}
```

### change

- **event** { [android.hardware.SensorEvent](https://developer.android.com/reference/android/hardware/SensorEvent) } - Android 原始传感器事件
- **...values** { [...](documentation#可变参数)[number](dataTypes#number)[[]](documentation#可变参数) } - `event.values` 中按原顺序展开的全部数值

系统报告传感器数据变化时触发. AutoJs6 始终先传入原始 `SensorEvent`, 再逐项传入 `event.values`.

```js
let light = sensors.register('light', sensors.delay.ui);

if (light !== null) {
    light.on('change', (event, illuminance) => {
        console.log(`light: ${illuminance} lx`);
    });
}
```

### accuracy_change

- **accuracy** { [number](dataTypes#number) } - Android 报告的精度状态

系统报告传感器精度变化时触发. 此事件只传入 `accuracy`, 不传入 `Sensor` 对象.

- `-1`: 传感器无接触.
- `0`: 精度不可靠.
- `1`: 低精度.
- `2`: 中等精度.
- `3`: 高精度.

## 参阅

- [Android 传感器概览](https://developer.android.com/develop/sensors-and-location/sensors/sensors_overview)
- [Android SensorEvent](https://developer.android.com/reference/android/hardware/SensorEvent)
- [事件发射器](eventEmitterType)
