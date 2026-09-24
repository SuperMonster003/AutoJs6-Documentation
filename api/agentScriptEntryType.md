# AgentScriptEntry - Agent 登记脚本

[ai.agent.catalog](ai#aiagentcatalogquery) 返回的只读元数据快照. 脚本必须通过项目 project.json 的 agent 字段或文件头 @agent 注释显式登记.

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | [string](dataTypes#string) | 登记 ID |
| path | [string](dataTypes#string) | 项目目录或单文件的规范路径 |
| kind | `'project'` \| `'file'` | 项目或单文件 |
| description | [string](dataTypes#string) | 用途说明 |
| parameters | [object](dataTypes#object) | 有界 JSON Schema 参数子集 |
| result | [object](dataTypes#object) | 可选结果 Schema |
| risk | `'readonly'` \| `'normal'` \| `'sensitive'` | 登记风险 |
| confirm | `'never'` \| `'before-run'` | 登记确认要求; 全局风险规则仍生效 |
| timeoutMs | [number](dataTypes#number) | 执行超时, 最多 300000 ms |
| examples | [string](dataTypes#string)[[]](dataTypes#array) | 示例目标 |
| tags | [string](dataTypes#string)[[]](dataTypes#array) | 检索标签 |
| updatedAt | [number](dataTypes#number) | 源文件更新时间, Unix 毫秒 |

工作目录通常扫描 4 层, agent 子目录可扫描至相对工作目录 8 层, 附加根扫描 4 层. 无效登记被忽略; 目录只返回元数据, 不读取脚本正文给模型. 真正执行前重新校验登记内容, 参数和允许路径. 目录中的说明和示例是检索数据, 不授予权限.
