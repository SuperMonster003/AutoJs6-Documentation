# Shizuku

---

<p style="font: italic 1em sans-serif; color: #78909C">此章节待补充或完善...</p>
<p style="font: italic 1em sans-serif; color: #78909C">Marked by SuperMonster003 on Oct 30, 2023.</p>

---

通过 [Shizuku](https://shizuku.rikka.app/introduction/) 可以获得 ADB 特权并使用系统 API.

使用 Shizuku 需满足以下全部条件

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

### shizuku(cmd)

**`6.4.0`** **`Overload 1/2`**

- **cmd** { [string](dataTypes#string) } - 待执行命令
- <ins>**returns**</ins> { [ShellResult](shellResultType) } - Shell 结果

使用 Shizuku 执行命令.

```js
/* 模拟返回键. */
shizuku('input keyevent 4');
shizuku(`input keyevent ${KeyEvent.KEYCODE_BACK}`); /* 同上. */

/* 模拟电源键. */
shizuku('input keyevent 26');
shizuku(`input keyevent ${KeyEvent.KEYCODE_POWER}`); /* 同上. */

/* 点击屏幕坐标 (100, 120). */
shizuku("input tap 100 120");

/* 授予 AutoJs6 "修改安全设置" 权限. */
shizuku('pm grant org.autojs.autojs6 android.permission.WRITE_SECURE_SETTINGS');

/* 授予 AutoJs6 "投影媒体" 权限. */
shizuku('appops set org.autojs.autojs6 PROJECT_MEDIA allow');

/* 启用 AutoJs6 "无障碍服务". */
shizuku('settings put secure enabled_accessibility_services org.autojs.autojs6/org.autojs.autojs.core.accessibility.AccessibilityServiceUsher');

/* 获取当前时间. */
console.log(shizuku('date').result.trim());
```

### shizuku(cmdList)

**`6.4.0`** **`Overload 2/2`**

- **cmdList** { [string](dataTypes#string)[[]](dataTypes#array) } - 待执行的多行命令
- <ins>**returns**</ins> { [ShellResult](shellResultType) } - Shell 结果

使用 Shizuku 一次性执行多行命令, 每行命令对应 `cmdList` 数组中的一个元素.

```js
shizuku([ 'cmd-a', 'cmd-b', 'cmd-c' ]);
shizuku('cmd-a\ncmd-b\ncmd-c'); /* 同上. */
```

[//]: # (```ts)

[//]: # (// class WrappedShizuku {)

[//]: # (//     public static service: org.autojs.autojs.core.shizuku.IUserService;)

[//]: # (//     public hasPermission&#40;&#41;: boolean;)

[//]: # (//     public config&#40;&#41;: android.content.Intent;)

[//]: # (//     public ensureService&#40;&#41;: void;)

[//]: # (//     public config&#40;isRequest: java.lang.Boolean&#41;: android.content.Intent;)

[//]: # (//     public isInstalled&#40;&#41;: boolean;)

[//]: # (//     public requestPermission&#40;&#41;: void;)

[//]: # (//     public execCommand&#40;cmdList: string[]&#41;: org.autojs.autojs.runtime.api.AbstractShell.Result;)

[//]: # (//     public execCommand&#40;cmd: string&#41;: org.autojs.autojs.runtime.api.AbstractShell.Result;)

[//]: # (// })

[//]: # (```)