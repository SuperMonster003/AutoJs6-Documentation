# AgentResult - Agent 任务结果

[AgentRun.result](agentRunType) 与 join 返回的任务终态记录. Promise 兑现也可能表示 partial, failed, blocked 或 cancelled.

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | [string](dataTypes#string) | 任务 UUID |
| status | [string](dataTypes#string) | completed / partial / failed / blocked / cancelled |
| summary | [string](dataTypes#string) | 结果说明 |
| evidence | [string](dataTypes#string)[[]](dataTypes#array) | 模型引用的观察证据 |
| unfinished | [string](dataTypes#string)[[]](dataTypes#array) | 未完成事项 |
| steps | [number](dataTypes#number) | 已计入步骤 |
| toolCalls | [number](dataTypes#number) | 工具调用次数 |
| usage | [object](dataTypes#object) | modelCalls, inputTokens?, outputTokens?, totalTokens?, estimated |
| durationMs | [number](dataTypes#number) | 任务耗时 |
| script | [object](dataTypes#object) | 可选单脚本结果, 含 id/path/executionId/result? |
| orderStatus | [string](dataTypes#string) | 可选 none/cart/pending_payment/submitted/paid |
| error | [object](dataTypes#object) | 可选任务错误, 含 code/message |
| truncated | [boolean](dataTypes#boolean) | 可选裁剪标记 |

completed 要求非空 evidence, partial 保留 unfinished. 证据文字来自模型对观察的引用, 调用方仍应核对关键事实; 单有 completed 不构成订单已付款或外部服务已完成的独立证明.

恰好执行一个登记脚本且没有其他操作工具时, script 可保留脚本上报的 JSON. 显式 null 是有效结果. 大结果可变为带 truncated/preview 的摘要, 同时 script.resultTruncated 为 true; 不应把摘要当作完整业务数据.

较早版本在进程恢复后留下的 blocked 历史可能只有 status/error. 宿主补齐 id 和错误对象形状, 不伪造缺失的计数, 耗时或证据. 新任务的失败属于结果本身; 插件不可用和链路丢失等句柄错误则使 Promise 拒绝.
