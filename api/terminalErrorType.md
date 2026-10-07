# TerminalError

终端同步调用抛出的错误, 以及异步调用拒绝 Promise 时返回的错误对象. 继承 JavaScript [Error](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error), 可通过 `error instanceof terminal.TerminalError` 检查.

## 属性

| 属性 | 类型 | 含义 |
| --- | --- | --- |
| name | [string](dataTypes#string) | `TerminalError` |
| message | [string](dataTypes#string) | 错误说明, 插件可用性错误包含插件中心提示 |
| code | [string](dataTypes#string) | 下表中的代码 |
| sessionId | [string](dataTypes#string) 或 [undefined](dataTypes#undefined) | 与特定会话有关时携带 |

## 错误代码

| 代码 | 含义 |
| --- | --- |
| PLUGIN_UNAVAILABLE | 插件缺失, 禁用, 未授权, 连接失败或进程消失 |
| PLUGIN_INCOMPATIBLE | 契约版本或最低宿主版本不满足 |
| INVALID_ARGUMENT | 参数类型, 选项键, 长度或调用线程不符合要求 |
| SESSION_NOT_FOUND | 会话 ID 不存在 |
| SESSION_LIMIT | 已达到 16 个并发会话 |
| SESSION_CLOSED | 会话或其输出流已结束 |
| DIRECTORY_INACCESSIBLE | 目录不存在, 不是目录或不可访问 |
| STORAGE_PERMISSION_REQUIRED | 终端插件尚未获得共享存储权限 |
| PTY_FAILED | 无法创建 pty 或 shell 子进程 |
| NODE_UNAVAILABLE | 请求的 Node.js 工具链不可用 |
| SUBSCRIPTION_LIMIT | 已达到每会话 4 个订阅 |
| TIMEOUT | 命令退出等待或输出匹配超时 |
| CANCELLED | 脚本停止或操作被取消 |
| INTERNAL | 其他错误或不能识别的插件错误代码 |

`TIMEOUT` 不会自动关闭仍运行的会话. 是否继续观察或关闭应由脚本决定.

```js
try {
    let session = terminal.open('/sdcard/MyProject');
    session.show();
} catch (error) {
    if (error instanceof terminal.TerminalError) {
        console.error(error.code + ': ' + error.message);
    } else {
        throw error;
    }
}
```

## [C] TerminalError

### new terminal.TerminalError(message?, code?, sessionId?)

**`6.8.0`**

- **[ message = '' ]** { [string](dataTypes#string) }
- **[ code = 'INTERNAL' ]** { [string](dataTypes#string) }
- **[ sessionId ]** { [string](dataTypes#string) }
- <ins>**returns**</ins> { [TerminalError](terminalErrorType) }

构造一个终端错误, 省略 `new` 也可调用. 自行构造的代码可以是其他字符串; 插件调用的标准代码见上表.
