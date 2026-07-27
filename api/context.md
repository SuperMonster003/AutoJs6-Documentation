# 上下文 (Context)

`context` 是 AutoJs6 向脚本引擎注入的全局 Java 对象, 类型为 [android.content.Context](https://developer.android.com/reference/android/content/Context).

该对象来自当前脚本宿主的应用上下文. 在 AutoJs6 中运行脚本时, 它表示 AutoJs6 应用. 在打包应用中运行脚本时, 它表示对应的打包应用.

AutoJs6 不为 `context` 添加自定义成员. 它的字段, 方法, 重载, 参数类型, Android API 级别及权限要求均由当前设备的 Android 框架决定.

---

<p style="font: bold 2em sans-serif; color: #FF7043">context</p>

---

## [@] context

- { [android.content.Context](https://developer.android.com/reference/android/content/Context) }

返回当前脚本宿主的应用上下文.

`context` 在普通脚本和 UI 模式脚本中均可用. 它的生命周期与宿主应用一致, 不依赖某个 Activity 是否存在.

```js
let packageName = context.getPackageName();
let filesDir = context.getFilesDir();

console.log(packageName);
console.log(filesDir.getAbsolutePath());
```

## Android 成员

`context` 直接通过 Java 互操作公开 [android.content.Context](https://developer.android.com/reference/android/content/Context) 的公共成员. AutoJs6 不改变这些成员的签名和返回值.

常用成员如下. 此表只提供导航, 完整成员及各 Android 版本的行为以 Android 官方参考为准.

| 成员 | 返回类型 | 用途 |
| --- | --- | --- |
| [getApplicationContext()](https://developer.android.com/reference/android/content/Context#getApplicationContext%28%29) | `android.content.Context` | 获取应用上下文 |
| [getPackageName()](https://developer.android.com/reference/android/content/Context#getPackageName%28%29) | `string` | 获取脚本宿主的包名 |
| [getResources()](https://developer.android.com/reference/android/content/Context#getResources%28%29) | `android.content.res.Resources` | 获取宿主应用资源 |
| [getString(int)](https://developer.android.com/reference/android/content/Context#getString%28int%29) | `string` | 按资源 ID 获取字符串 |
| [getSystemService(string)](https://developer.android.com/reference/android/content/Context#getSystemService%28java.lang.String%29) | `java.lang.Object` 或 `null` | 按服务名称获取 Android 系统服务 |
| [getContentResolver()](https://developer.android.com/reference/android/content/Context#getContentResolver%28%29) | `android.content.ContentResolver` | 获取内容解析器 |
| [getPackageManager()](https://developer.android.com/reference/android/content/Context#getPackageManager%28%29) | `android.content.pm.PackageManager` | 获取包管理器 |
| [getFilesDir()](https://developer.android.com/reference/android/content/Context#getFilesDir%28%29) | `java.io.File` | 获取应用内部文件目录 |
| [getCacheDir()](https://developer.android.com/reference/android/content/Context#getCacheDir%28%29) | `java.io.File` | 获取应用内部缓存目录 |
| [getSharedPreferences(string, int)](https://developer.android.com/reference/android/content/Context#getSharedPreferences%28java.lang.String,int%29) | `android.content.SharedPreferences` | 获取应用级键值存储 |
| [startActivity(Intent)](https://developer.android.com/reference/android/content/Context#startActivity%28android.content.Intent%29) | `void` | 启动 Activity |
| [sendBroadcast(Intent)](https://developer.android.com/reference/android/content/Context#sendBroadcast%28android.content.Intent%29) | `void` | 发送广播 |

Java 重载由 Rhino 根据参数数量和运行时类型选择. 参数和返回值中的 Android 类型是原生 Java 对象, 不会自动转换为 AutoJs6 模块对象.

访问静态常量时, 建议写出声明类:

```js
let serviceName = android.content.Context.POWER_SERVICE;
let powerService = context.getSystemService(serviceName);

console.log(powerService.isInteractive());
```

## 应用上下文与 Activity

`context` 是应用上下文, 不是 [activity](activity). 它不携带当前 Activity 的窗口令牌, 可视区域, Activity 主题或生命周期.

需要 Activity 上下文的窗口和对话框 API 应在 UI 模式下使用 `activity`. 即使 UI 模式提供了 `activity`, 全局 `context` 仍然保持为应用上下文.

通过 `context` 注册的广播接收器或绑定的服务与应用级生命周期关联. Android 不会在某个 Activity 销毁时自动解除这些注册, 脚本应按对应 API 的要求调用 `unregisterReceiver` 或 `unbindService`.

```js
'ui';

console.log(util.getClassName(context));
console.log(util.getClassName(activity));
```

从应用上下文直接启动 Activity 时, `Intent` 必须包含 `FLAG_ACTIVITY_NEW_TASK`:

```js
let intent = new android.content.Intent(
    android.provider.Settings.ACTION_SETTINGS
);
intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);

context.startActivity(intent);
```

对于应用启动, 页面跳转和广播等常见操作, 优先使用 [app](app) 模块. 该模块会处理 AutoJs6 支持的简称, 参数转换及部分兼容逻辑.

## 运行条件

- Android 框架成员可能受设备 API 级别限制. 调用较新的成员前应检查 `device.sdkInt`.
- 需要危险权限, 特殊权限或系统授权的成员不会因通过 `context` 调用而自动获得权限.
- 普通脚本不保证运行在 Android 主线程. 只允许主线程调用的框架成员应切换到 UI 线程, 或改用对应的 AutoJs6 模块.
- 文件目录, 资源, SharedPreferences 和包名均属于当前脚本宿主. 在 AutoJs6 与打包应用之间, 这些值可能不同.
- Android 框架方法抛出的 `SecurityException`, `ActivityNotFoundException` 及其他异常会通过 Java 互操作继续向脚本传播.
