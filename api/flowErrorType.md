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

细化错误代码的原因, 如 `'chain'` (链截止), `'sync'` (sync 超时), `'timeout'` (repeatUntil 总时限), `'attempts'` (repeatUntil 动作次数上限), `'noTarget'`, `'notClickable'`, `'verify'`, `'maxSteps'`, `'end'`, `'filtered out'`; 无则为 `null`. repeatUntil 自身的超时错误中, `attempts` 表示已调用动作的次数.

## [p#] flowStack

**`6.8.0`**

- { [string](dataTypes#string) | [undefined](dataTypes#undefined) }

异步任务栈. Flow 在创建步骤时保留脚本调用位置, 失败时记录该步骤及上游步骤的方法名, 脚本文件和行号, 跳过失败后未执行的步骤. 没有可用脚本位置时此属性可以不存在.

`flowStack` 为不可枚举属性, 内容也附加在 `error.stack` 的原始异常栈之后. JavaScript Error 和 Java 异常转成的 Error 同样支持此诊断, 不限于 `FlowError`. 原有 `code`, `step`, `reason` 等字段与错误传播规则不变.

使用 `.catch(console.error)` 即可输出完整诊断, 无需启用 `flow.trace(true)`. 自定义处理可读取 `error.stack` 或 `error.flowStack`. 原样抛出的基本类型, 冻结对象或禁止写入属性的对象仍保持原值, 可能无法附加这些属性; 未处理拒绝的日志仍可显示已捕获的任务栈.

```js
function submit() {
    return flow.smartClickBounds('提交', { verify: '提交成功' });
}

waitAsync('表单').then(submit).catch(console.error);
```

任务栈的输出形式如下, 实际文件和行号取决于调用位置:

```text
Flow task stack:
    at Flow.smartClickBounds (example.js:2)
    at submit (example.js:2)
    at Flow.then (example.js:5)
    at Flow.wait (example.js:5)
```

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
