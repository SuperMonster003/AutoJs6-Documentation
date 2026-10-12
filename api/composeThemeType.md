# ComposeTheme - Compose 主题

ComposeTheme 是传给 [compose.theme](compose#m-theme), 或作为 [compose.mount](compose#m-mount), [compose.attach](compose#m-attach), [compose.floaty](compose#m-floaty), [compose.dialog](compose#m-dialog) 的 `theme` 选项的普通 JavaScript 对象. 它描述脚本覆盖项, 不直接提供完整的 Material 3 ColorScheme 或 Kotlin Typography 对象.

当前主题支持 seed, 明暗模式, Android 12+ 动态颜色, 指定颜色角色以及字体族和文字缩放. 需要配套 AutoJs6 6.8.0 本地构建和 3-Block Compose 插件.

```js
'ui';

compose.theme({ seed: '#006C4C', dark: false, dynamicColor: false });
compose.mount(compose.Surface({ modifier: compose.modifier().fillMaxSize() },
    compose.Column({ padding: 20, spacing: 12 },
        compose.Text({ text: '主题示例', style: 'headlineMedium' }),
        compose.Button({ onClick: function () {
            compose.theme({ seed: '#006C4C', dark: true });
        } }, '切换到深色'))));
```

## 选项

<p style="font: bold 2em sans-serif; color: #FF7043">ComposeTheme</p>

| 字段 | 输入 | 省略时 |
| --- | --- | --- |
| `seed` | [ComposeColorInput](composeComponents#composecolorinput) 或 null | 使用宿主当前主色 |
| `colors` | 颜色角色名称到 ComposeColorInput 的对象, 或 null | 无本次显式颜色覆盖 |
| `dark` | boolean, `'system'` 或 null | 跟随宿主当前明暗配置 |
| `dynamicColor` | boolean 或 null | false |
| `typography` | 包含 `fontFamily` / `scale` 的对象, 或 null | 使用宿主/系统文字默认值 |
| `typography.fontFamily` | string 或 null | 使用默认字体族 |
| `typography.scale` | 大于 0 的有限数或 null | 使用系统文字缩放 |

`seed: null`, `dark: null`, `dark: 'system'` 表示相应覆盖项为空. `colors` 中每个实际颜色值必须有效, 不能以 `{ primary: null }` 清除单个角色. `dynamicColor: null` 与省略一样为 false. 对象中的未知键会得到 `UNKNOWN_PROP`, 非法值会得到 `INVALID_ARGUMENT`.

`typography.scale` 替换当前组合使用的文字缩放系数, 不是与系统值相乘; 不改变 dp 布局密度. 例如 `scale: 1.2` 使用 1.2 的文字缩放, 省略则保留系统设置.

字体族接受 `default`, `system`, `sans-serif`, `sansserif`, `serif`, `monospace`, `cursive`, 以及 Android `Typeface.create` 可识别的字体族名称. 未识别名称可能由 Android 回退; 不从字体文件路径或 URL 加载字体. 空字符串不是有效字体族.

## 替换与继承

主题的替换规则分为两个层次:

1. 每次 `compose.theme(options)` **整体替换上一份脚本覆盖对象**, 不与上一份脚本对象做深合并. `compose.theme({ dark: true })` 不会保留上次指定的 seed, colors 或字体.
2. 将这次覆盖对象应用到某个会话时, 未指定的 seed, dark 和字体项继续继承宿主当前默认值. `colors` 中本次提供的角色覆盖宿主同名角色; `dynamicColor` 使用本次布尔值, 省略即 false.

`compose.theme` 同时改变未来挂载的默认主题, 并更新当前最后一个尚未关闭的会话. 它不广播修改所有存活会话. 之前建立的其他 UI/floaty 会话保留自己的脚本覆盖项, 仍可跟随宿主未被覆盖的配置变化.

挂载选项中的 `theme` 若省略或为 null, 沿用模块当前默认主题. 显式 `{ theme: {} }` 则提供一份空的会话覆盖对象, 不与模块默认主题合并. `compose.theme({})` 同样会清除先前脚本覆盖, 回到宿主颜色/明暗及系统文字设置, 同时关闭动态颜色.

`compose.theme(null)` / `compose.theme(undefined)` 也按空覆盖对象进行设置, 不是 getter; 读取必须调用无参数的 `compose.theme()`. 挂载的整个 options 为 null/undefined 时按空选项处理, 但显式 `{ theme: undefined }` 会解析为空主题覆盖, 与省略 theme 或 `{ theme: null }` 沿用模块默认的行为不同.

```js
'ui';

compose.theme({ seed: '#984061', dark: false });
compose.mount(compose.Text({ text: '本次使用宿主主题' }), { theme: {} });

// 整体替换为只固定深色模式; 先前的 #984061 不再是脚本覆盖项.
compose.theme({ dark: true });
```

读取 `compose.theme()` 得到的是模块保存的脚本覆盖快照, **不是当前会话最终计算出的完整调色板**. 首次设置前结果为 `{}`. 设置后返回一个新对象, 包含:

| 返回字段 | 值 |
| --- | --- |
| `seed` | 规范化的 ARGB 整数或 null |
| `colors` | 显式角色到 ARGB 整数的对象 |
| `dark` | true / false / null, 其中 `'system'` 被规范化为 null |
| `dynamicColor` | true / false |
| `typography.fontFamily` | 字符串或 null |
| `typography.scale` | 数值或 null |

此返回形态在类型声明中名为 ComposeThemeSnapshot. 修改返回对象不会改变主题; 再次传给 `compose.theme` 才会应用. 显式设置一份新的选项对象时, 应保留确实需要继续覆盖的字段.

## 配色优先级

渲染器按以下顺序确定基础配色, 最后再应用 `colors` 中的显式角色:

1. `dynamicColor: true` 且 Android API >= 31 时, 使用系统动态浅色/深色配色.
2. 未获得动态配色时, 使用当前有效 seed 生成配色.
3. 没有 seed 时, 使用 Material 3 默认浅色/深色配色.

因此 API24 等旧系统可以接受 `dynamicColor: true`, 但实际回退到 seed 配色. Android 12+ 启用动态颜色时, seed 不会覆盖系统动态方案; 要比较 seed 效果, 请把 `dynamicColor` 设为 false. 明暗配置及宿主主色变化会更新未被脚本覆盖的项.

## 颜色角色

`colors` 只接受下表列出的大小写敏感键. 这些键也覆盖 Material 3 的容器和文字角色, 不等于给每个组件逐项设置 `bg` 或 `color`.

| 分组 | 角色 |
| --- | --- |
| 主色 | `primary`, `onPrimary`, `primaryContainer`, `onPrimaryContainer`, `inversePrimary` |
| 次色 | `secondary`, `onSecondary`, `secondaryContainer`, `onSecondaryContainer` |
| 第三色 | `tertiary`, `onTertiary`, `tertiaryContainer`, `onTertiaryContainer` |
| 背景 | `background`, `onBackground` |
| 表面 | `surface`, `onSurface`, `surfaceVariant`, `onSurfaceVariant`, `surfaceTint`, `inverseSurface`, `inverseOnSurface` |
| 错误 | `error`, `onError`, `errorContainer`, `onErrorContainer` |
| 轮廓 | `outline`, `outlineVariant`, `scrim` |
| 表面层级 | `surfaceBright`, `surfaceDim`, `surfaceContainer`, `surfaceContainerHigh`, `surfaceContainerHighest`, `surfaceContainerLow`, `surfaceContainerLowest` |
| 固定主色 | `primaryFixed`, `primaryFixedDim`, `onPrimaryFixed`, `onPrimaryFixedVariant` |
| 固定次色 | `secondaryFixed`, `secondaryFixedDim`, `onSecondaryFixed`, `onSecondaryFixedVariant` |
| 固定第三色 | `tertiaryFixed`, `tertiaryFixedDim`, `onTertiaryFixed`, `onTertiaryFixedVariant` |

```js
// 在创建页面前设置; primary 与 onPrimary 一并指定以保持文字可读.
compose.theme({
    dark: false,
    colors: { primary: '#006C4C', onPrimary: '#FFFFFF' },
    typography: { fontFamily: 'sans-serif', scale: 1.1 }
});
```

单节点的文字 `style` / `fontSize`, 容器 `color` / `contentColor` 等继续按各组件规则覆盖局部外观, 参阅 [组件输入类型](composeComponents#输入类型) 与 [组件目录](composeComponents#组件使用).
