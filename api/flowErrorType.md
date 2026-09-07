# 流程错误 (FlowError)

FlowError 是 [流程 (Flow)](flow) 的步骤失败时产生的错误对象, 也是 [工具集](automator#工具集-toolkit) 与 [事件驱动等待](automator#事件驱动等待) 的同步函数抛出的错误类型.

它是 `name` 为 `'FlowError'` 的 JavaScript [Error](exceptions#error-对象), 在 `message` 之外提供结构化的字段 (`code`, `step`, `selector`, `elapsed`, `attempts`, `reason`), 便于按原因分支处理.

```js
flow.wait('登录', 5e3).click().catch(e => {
    console.log(e.name); /* FlowError */
    console.log(e.code); /* TIMEOUT */
    console.log(e.step); /* wait */
    console.log(e.message); /* Timed out after 5003 ms and 25 attempt(s) in step "wait" waiting for content("登录") */
});
```

---

<p style="font: bold 2em sans-serif; color: #FF7043">FlowError</p>

---

## [@] FlowError

**`6.8.0`**

Flow 步骤失败时的错误对象, 是 `name` 为 `'FlowError'` 的 JavaScript [Error](exceptions#error-对象). 由 [工具集](automator#工具集-toolkit) 与 [事件驱动等待](automator#事件驱动等待) 的同步函数抛出的错误也是此类型.

## [p#] code

**`6.8.0`**

- { `'TIMEOUT'` \| `'ACTION_FAILED'` \| `'CANCELLED'` \| `'A11Y_UNAVAILABLE'` \| `'INVALID_TARGET'` }

错误代码:

| code | 含义 | 典型消息 |
| --- | --- | --- |
| TIMEOUT | 等待超时 | Timed out after 5003 ms and 25 attempt(s) in step "wait" waiting for content("登录") |
| ACTION_FAILED | 动作返回 false 或工具动作失败 | Action "click" failed |
| CANCELLED | 被 [cancel](flowType#m-cancel) / [cancelAll](flow#m-cancelall) 或脚本退出取消 | Cancelled in step "wait" |
| A11Y_UNAVAILABLE | 无障碍服务不可用 | Accessibility service unavailable for step "wait" |
| INVALID_TARGET | 链上的值不是可作用的目标, 或工具的目标无效 | Invalid target for step "click" (null) |

## [p#] step

**`6.8.0`**

- { [string](dataTypes#string) }

失败的步骤名, 如 `'wait'`, `'click'`, `'smartClick'`, `'sync'`.

## [p#] selector

**`6.8.0`**

- { [string](dataTypes#string) \| [null](dataTypes#null) }

等待的目标描述 (如 `content("登录")`), 无目标时为 `null`.

## [p#] elapsed

**`6.8.0`**

- { [number](dataTypes#number) }

失败前已等待的毫秒数 (超时类错误), 其余为 `0`.

## [p#] attempts

**`6.8.0`**

- { [number](dataTypes#number) }

失败前的检测次数 (超时类错误), 其余为 `0`.

## [p#] reason

**`6.8.0`**

- { [string](dataTypes#string) \| [null](dataTypes#null) }

细化错误代码的原因, 如 `'chain'` (链截止), `'sync'` (sync 超时), `'noTarget'`, `'notClickable'`, `'verify'`, `'maxSteps'`, `'end'`, `'filtered out'`; 无则为 `null`.

## 错误处理示例

```js
flow.wait('登录', 5e3).click().then(null, e => {
    switch (e.code) {
        case 'TIMEOUT':
            console.log(`${e.elapsed} 毫秒内未找到 ${e.selector}`);
            break;
        case 'A11Y_UNAVAILABLE':
            auto.launchSettings();
            break;
        default:
            console.error(e);
    }
});

/* 同步形式捕获. */
try {
    smartClick('不存在的按钮');
} catch (e) {
    console.log(e.name === 'FlowError', e.code); /* true TIMEOUT */
}
```
