# AgentRunOptions - Agent 任务选项

用于 [ai.agent.run](ai#aiagentrungoal-options) 和 [ai.agent.create](ai#aiagentcreateoptions). 只接受下表中的键, 显式 null/undefined 不是有效选项值.

| 选项 | 类型 | 默认与含义 |
| --- | --- | --- |
| preset | [string](dataTypes#string) | 预设名称; 省略使用插件当前选定的默认预设 |
| target | [string](dataTypes#string) | 完整模型目标 ID; 省略沿用预设, 预设也未指定时自动选择可用本地目标, 否则选择首个可用目标 |
| tools | [string](dataTypes#string)[[]](dataTypes#array) 或 [object](dataTypes#object) | 省略沿用预设; 工具组数组, 或含 enable/disable 数组的对象, 只能进一步收紧 |
| budget | [object](dataTypes#object) | 任务预算覆盖 |
| confirm | `'default'` \| `'cautious'` | 沿用预设, 初始为 default; cautious 对普通变更也要求确认, 不能放宽预设的 cautious |
| interaction | `'plugin'` \| `'script'` | plugin; 选择询问和操作确认的承接方 |
| detached | [boolean](dataTypes#boolean) | false; true 允许任务继续在插件后台运行 |
| context | [string](dataTypes#string) | 附加上下文, 最多 8 KiB |
| parameters | [object](dataTypes#object) | 给模型的预填参数, 不替代登记 Schema 校验 |
| memory | [boolean](dataTypes#boolean) | true; false 不注入偏好记忆, true 不能重新启用预设已关闭的记忆或跨越预设作用域 |
| scriptRoots | [string](dataTypes#string)[[]](dataTypes#array) | 省略沿用预设; 附加脚本根选择, 最多 32 项, 只能缩小预设与宿主共同批准的范围 |
| locale | [string](dataTypes#string) | 使用链路语言; 最多 64 字节 |

工具组为 observe, act, ocr, gesture, script, files, shell, memory, user. gesture/files/shell 默认关闭, ocr 还要求宿主报告可用的授权 OCR 能力. 选项只能收紧插件的实际可用集合, 不能启用全局关闭的组或扩大宿主 grant. 名称不重复且必须有效.

预设固定上下文与本次 context 以空行拼接, 本次 context 为空不会清除预设文本. 该文本与 parameters 合并注入模型时总计仍不能超过 8 KiB. 预填参数不授权任何文件访问或设备操作. scriptRoots 必须为绝对目录, 不含父目录跳转或隐藏越界路径; 宿主再次进行真实路径校验.

自定义预设要求 AI Agent 1.0.0 / 构建号 56 或以上. 预设模型目标来自宿主代理的模型目录. 预设页显示本地/在线/混合及结构化 JSON 支持, 不支持结构化约束的目标标注 "退化模式". 显式指定的目标失效时任务失败, 不自动更换目标. 记忆范围只可选择全局及当前预设, 仅全局, 仅当前预设或关闭, 不可读取其他预设的记忆.

## memory

AI Agent 1.0.0 / 构建号 57 起支持记忆管理与模型工具 `memory_get(keys?)` / `memory_propose(key, value, scope?)`. 它们由 Agent 决策使用, 不是 `ai.agent` 下新增的 JavaScript 方法.

`memory: false` 仅关闭任务开始时的自动注入. 若同时需要禁止该任务查询或提出记忆, 请在 tools 中禁用 memory 组; 预设的记忆范围设为关闭时也会拒绝这两个工具. 自动注入按更新时间从新到旧保留完整条目, 最多 4 KiB; 当前预设的同名 key 优先于全局值. `memory_get` 可按 key 查询, 始终受当前预设作用域约束.

`memory_propose` 的 scope 默认为 `global`, 也可以是当前预设名称, 但必须在该预设允许的范围内. 每条提议都产生一次 confirmation, 确认后才写入; 不支持通过本次任务内允许来免除后续记忆确认. 拒绝作为 `USER_DENIED` 观察回送模型, 不修改记忆. 确认期间同一条目发生变化时写入失败, 需要重新提议与确认. 新值在后续任务中自动注入, 当前任务可用 `memory_get` 读取.

从插件任务台打开 "记忆" 可查看, 编辑, 删除, 导入和导出偏好. 最多保存 500 条 / 256 KiB, 每条保留作用域, 来源任务 ID 和创建/更新时间. JSON 导入在校验整个文件后逐条审阅, 逐条确认; 跳过或关闭页面不会自动保存剩余条目. 引用不存在预设的条目需要先创建对应预设. 导出是包含真实偏好值和来源信息的备份, 应妥善保管. 不要保存密码, API 密钥或其他凭据; 插件会拒绝可识别的凭据键名和令牌格式, 但不能识别所有被伪装成普通文本的秘密.

## budget

| 字段 | 普通任务默认 | detached 默认 | 说明 |
| --- | --- | --- | --- |
| maxSteps | 40 | 40 | 最大步骤数 |
| maxModelCalls | 60 | 60 | 含格式修复和降级的模型调用数 |
| maxDurationMs | 600000 | 1800000 | 包含等待询问/确认的总时长 |
| maxTotalTokens | 300000 | 300000 | 输入与输出 token 总预算 |

表中是初始上限. 当前插件开发版本只允许在该上限内收紧; 预设的预算覆盖与宿主剩余 token 授权共同约束有效预算, 单次任务覆盖不能再放宽它. 例如预设限制为 5 步时, 任务传入 maxSteps: 6 会被拒绝. 预设的 1800000 毫秒限制用于普通任务时仍按普通任务的 600000 毫秒上限收紧.

宿主同时检查协议硬上限: 200 步, 300 次调用, 普通任务 30 分钟 / detached 60 分钟, 1000000 token. 通过宿主硬上限校验并不表示插件会接受大于当前有效预算的值; 插件拒绝会返回失败句柄. 所有预算值必须为正整数.

确认超时当前为 120 秒, 参数询问最长为 10 分钟, 并服从剩余任务时长. 这两个值不是公开 budget 字段. 到期按拒绝/超时反馈, 不默认允许操作.

## 交互与任务归属

plugin 模式仍向脚本发送 input/confirmation 通知, 但标记 `readOnly: true`, respond/confirm 会拒绝. script 模式由脚本监听器回应. `detached` 不改变交互承接方; detached + script 在发起脚本退出后若需继续回应, 应在超时前由另一个脚本 get 并接管交互, 或改用 plugin 模式.

`create` 保存选项快照. 单次 overrides 中的 budget 按字段合并且不能增加固定预算, tools 和 scriptRoots 只能缩小范围, cautious 不能放宽. 其他字段按单次覆盖值使用.
