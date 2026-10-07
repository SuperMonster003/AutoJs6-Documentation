# TerminalOpenOptions

`terminal.open()` 和 `terminal.openAsync()` 接受的选项. 传给插件的值按 JSON 规则处理, 函数和 `undefined` 值不作为选项传递. 未知选项键会得到 `INVALID_ARGUMENT`.

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| cwd | [string](dataTypes#string) | 脚本工作目录, 没有时为插件 HOME | 初始目录, 相对路径以脚本工作目录为基准; 不接受 `content://` 等 URI |
| env | [Object](dataTypes#object) | 空对象 | 字符串环境变量覆盖, 最多 64 项, 每项的键和值合计含等号不超过 4096 UTF-8 字节 |
| show | [boolean](dataTypes#boolean) | true | 创建后打开终端界面 |
| title | [string](dataTypes#string) | 命令或目录名 | 会话标题, 不能是空白字符串 |

`env` 的键不能包含等号或 NUL, 值必须是字符串且不能包含 NUL. 不允许覆盖由插件管理的 `HOME`, `PREFIX`, `PATH`. 目录最多 4096 UTF-8 字节, 完整请求最多 64 KiB. 共享存储权限需要授予终端插件本身.

```js
let session = terminal.open({
    cwd: terminal.env().home,
    env: { LANG: 'en_US.UTF-8', TASK_NAME: 'example' },
    show: false,
    title: 'Example',
});
```

## TerminalExecOptions

`terminal.exec()` / `execAsync()` 和 `terminal.npm.run()` / `runAsync()` 另外接受以下字段, 并包含上表的全部字段.

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| keepOpen | [boolean](dataTypes#boolean) | true | 命令结束后保留交互式 shell |
| wait | [boolean](dataTypes#boolean) | false | 等待整个会话退出 |
| timeout | [number](dataTypes#number) | 600000 | `wait: true` 的超时, 单位 ms, 非负整数, 0 表示不限时 |
| stripAnsi | [boolean](dataTypes#boolean) | true | 交付输出和匹配等待时移除 ANSI 控制序列 |

`wait: true` 与默认的 `keepOpen: true` 组合会继续等待保留的 shell. 获取命令退出码时, 使用 `keepOpen: false`. 超时不会自动关闭会话.

```js
terminal.execAsync('echo ready', {
    cwd: terminal.env().home,
    show: false,
    keepOpen: false,
    wait: true,
    timeout: 30000,
}).then(session => console.log(session.exitCode));
```
