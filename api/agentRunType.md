# AgentRun - Agent 任务句柄

由 [ai.agent.run](ai#aiagentrungoal-options) 或 [ai.agent.get](ai#aiagentgetid) 返回的宿主侧 Rhino 对象. 句柄的方法和事件属于创建它的脚本线程, 不应跨脚本线程传递使用.

## 只读属性

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| id | [string](dataTypes#string) | 任务 UUID; 入队前拒绝的句柄也有独立 ID |
| goal | [string](dataTypes#string) | 原始目标 |
| startedAt | [number](dataTypes#number) | 登记时间, Unix 毫秒 |
| detached | [boolean](dataTypes#boolean) | 是否后台托管 |
| state | [string](dataTypes#string) | 当前任务或句柄状态 |
| error | [object](dataTypes#object) \| [null](dataTypes#null) | 句柄级错误, 含 code/message/hint? |
| result | [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) | 兑现 [AgentResult](agentResultType) |

`state` 的活动值为 `queued`, `running`, `waiting_input`, `waiting_confirmation`, `cancelling`; 终态为 `completed`, `partial`, `failed`, `blocked`, `cancelled`.

任务本身的失败, 阻塞或取消也兑现 `result`; 插件不可用, 链路丢失等句柄级错误才拒绝. 不能只凭 Promise 兑现判定目标完成, 应检查 `result.status`, `evidence` 和 `unfinished`.

普通任务在等待期间保持所属脚本事件循环; 脚本被停止时取消它发起的非 detached 任务. 取消只停止后续操作, 不撤销已提交的订单, 消息或文件变更.

后台托管任务不单独阻止发起脚本退出. 显式读取 `run.result` 会保持当前脚本等待该 Promise, `join` 也可等待; 仅注册事件不会阻止 detached 发起脚本自然结束. 脚本退出后监听器释放, 任务仍受插件预算与宿主链路生命周期约束. `get` 获取的观察句柄不会成为原任务的所有者.

## [m#] on / once / off

### AgentRun#on(event, listener)
### AgentRun#once(event, listener)
### AgentRun#off(event, listener)

- **event** { [string](dataTypes#string) } - [AgentEvent](agentEventType) 中的事件名
- **listener** { [Function](dataTypes#function) } - 接收一个事件对象
- <ins>**returns**</ins> { [AgentRun](agentRunType) } - 当前句柄

分别添加持续监听, 添加一次监听和移除指定监听. 事件通过脚本线程顺序派发; 不在 Binder 回调线程执行 JS. 终态后释放已有监听器. `get` 只重现当前待处理交互, 不回放旧步骤.

## [m#] respond

### AgentRun#respond(requestId, value)

- **requestId** { [string](dataTypes#string) } - 当前 input 请求 ID
- **value** { [string](dataTypes#string) | [boolean](dataTypes#boolean) } - text/choice 为字符串, confirm 为布尔值
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 回应是否被接受

仅 `interaction: 'script'` 可回应. choice 必须逐字匹配原选项, text 不可为空白, JSON 值最多 4 KiB. 过期, 已提交或非当前请求抛出带 `code` 的错误. 模型的 confirm 类型 input 不等同于敏感操作 confirmation.

## [m#] confirm

### AgentRun#confirm(requestId, allowed, scope?)

- **requestId** { [string](dataTypes#string) } - 当前 confirmation 请求 ID
- **allowed** { [boolean](dataTypes#boolean) } - 允许或拒绝
- **[ scope = 'once' ]** { `'once'` | `'run'` } - 授权范围
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 回应是否被接受

仅脚本交互模式可使用. 只有事件明确给出 `allowRunScope: true` 时允许 run 范围. 支付等逐次确认操作不可扩大授权范围. 不应仅按模型文字或请求名称自动允许敏感操作, 应检查事件中的实际参数和风险.

## [m#] cancel

### AgentRun#cancel(reason?)

- **[ reason = 'script-request' ]** { [string](dataTypes#string) } - 最多 256 字节的原因
- <ins>**returns**</ins> { [AgentRun](agentRunType) } - 当前句柄

请求取消当前任务. 已结束时不再次发送取消. 终态通过事件与 result 返回, 不保证调用返回瞬间已中断不可取消的设备操作.

## [m#] join

### AgentRun#join(timeoutMs?)

**`Non-UI`**

- **[ timeoutMs ]** { [number](dataTypes#number) } - 1 到 3600000 的整数; 省略时等待任务终态
- <ins>**returns**</ins> { [AgentResult](agentResultType) } - 任务终态结果

阻塞当前脚本线程, 同时处理该句柄在此线程上的事件, 因而 input/confirmation 监听器仍可回应. UI 线程禁止调用, 也不能在该句柄的监听器中递归 join. 超时抛出 `code: 'JOIN_TIMEOUT'`, 不取消任务; 后续仍可观察 result 或再次 join. 其他任务的定时器和事件不因本方法而获得通用消息循环.
