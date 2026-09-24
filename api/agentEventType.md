# AgentEvent - Agent 事件

由 [AgentRun.on/once](agentRunType) 接收. 监听器都在创建句柄的脚本线程上执行. 每次取得独立 JS 对象, 修改事件不改变宿主任务状态.

| 事件 | 主要字段 | 语义 |
| --- | --- | --- |
| state | from, to | 状态变化 |
| progress | step, message, budget | 进度说明与剩余预算 |
| step | index, kind, decision, tool?, arguments?, confirmation?, observation?, elapsedMs, usage?, error? | 已完成步骤的有界记录 |
| input | requestId, kind, question, choices?, memoryKey?, timeoutMs, readOnly | 请求用户信息 |
| confirmation | requestId, tool, description, risk, arguments, allowRunScope, timeoutMs, readOnly | 实际工具操作确认 |
| done | [AgentResult](agentResultType) 的字段 | 任务终态 |
| error | code, message, hint? | 任务或句柄错误 |

input.kind 为 text, choice 或 confirm. text/choice 以字符串回答, confirm 以布尔值回答. timeoutMs 是该次请求提供的剩余等待上限, 收到回调前已过去的时间仍计入截止; 应及时回应, 过期不再有效.

confirmation.risk 为 normal 或 sensitive, 参数来自实际待执行工具, 而非模型在询问文字中的自称. `readOnly: true` 表示由插件界面处理; `allowRunScope: false` 表示只可逐次确认. 敏感支付操作必须单次确认, 没有响应时不会默认执行.

step 中 observation 和参数可被裁剪或脱敏. `confirmation` 为 allowed, denied 或 auto; 模型询问不占用工具确认授权. error 事件之后可能仍有 done, 因为任务失败结果同样会兑现 Promise; 句柄错误只拒绝 Promise, 不伪造任务结果.

```js
let run = ai.agent.run('先询问我的演示称呼, 然后报告它.', {
    interaction: 'script', tools: ['user'],
});
run.on('input', (event) => {
    if (event.kind === 'text') run.respond(event.requestId, '测试用户');
});
run.on('confirmation', (event) => run.confirm(event.requestId, false));
run.result.then((result) => console.log(result.status, result.summary), console.error);
```
