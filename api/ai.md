# 人工智能 (AI)

ai 模块用于通过已配置的 AI 提供商发起文本生成, 对话和流式请求. `ai` 和 `ai.ask` 还可通过显式选择器调用兼容的本机文本生成插件.

`ai` 与 `$ai` 指向同一个可调用模块对象.

使用基于配置档案的调用前, 需要先在 AutoJs6 的 AI 提供商设置中创建可用档案. 也可在单次请求中显式提供 `provider`, `model` 和凭据等选项.

---

<p style="font: bold 2em sans-serif; color: #FF7043">ai</p>

---

## [@] ai

### ai(input, options?)

**`6.8.0`** **`Async`** **`Overload [1-2]/2`**

- **input** { [string](dataTypes#string) | [AiMessage](#aimessage) | [AiMessage](#aimessage)[[]](dataTypes#array) | [AiRequest](#airequest) } - 提示词, 消息或完整请求
- **[ options = `{}` ]** { [AiOptions](#aioptions) | [AiPluginAskOptions](#aipluginaskoptions) } - 请求选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为生成文本

发起文本生成请求.

此调用与 [ai.ask(input, options?)](#m-ask) 等价.

```js
ai('Reply with OK').then((text) => {
    console.log(text);
});
```

## [m] ask

### ask(input, options?)

**`6.8.0`** **`Async`** **`Overload [1-2]/2`**

- **input** { [string](dataTypes#string) | [AiMessage](#aimessage) | [AiMessage](#aimessage)[[]](dataTypes#array) | [AiRequest](#airequest) } - 提示词, 消息或完整请求
- **[ options = `{}` ]** { [AiOptions](#aioptions) | [AiPluginAskOptions](#aipluginaskoptions) } - 请求选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [string](dataTypes#string) 类型的生成文本

发起非流式请求, 并仅返回响应中的文本结果.

提供 [AiPluginAskOptions](#aipluginaskoptions) 时, 此方法使用显式选择的本机文本生成插件. 该路由当前仅接受一条 `user` 纯文本消息.

## [m] chat

### chat(input, options?)

**`6.8.0`** **`Async`** **`Overload [1-2]/2`**

- **input** { [string](dataTypes#string) | [AiMessage](#aimessage) | [AiMessage](#aimessage)[[]](dataTypes#array) | [AiRequest](#airequest) } - 提示词, 消息或完整请求
- **[ options = `{}` ]** { [AiOptions](#aioptions) } - 请求选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [AiResponse](#airesponse)

发起非流式请求, 并返回提供商无关的完整响应.

返回对象中的 `message` 可在使用同一提供商时追加到后续消息数组, 以保留工具调用和提供商专用数据.

```js
let messages = [
    { role: 'user', content: 'Return one short greeting' },
];

ai.chat(messages).then((response) => {
    console.log(response.text);
    console.log(response.usage);
});
```

## [m] stream

### stream(input, options?)

**`6.8.0`** **`Async`** **`Overload [1-2]/2`**

- **input** { [string](dataTypes#string) | [AiMessage](#aimessage) | [AiMessage](#aimessage)[[]](dataTypes#array) | [AiRequest](#airequest) } - 提示词, 消息或完整请求
- **[ options = `{}` ]** { [AiOptions](#aioptions) } - 请求选项
- <ins>**returns**</ins> { [AiStream](#aistream) } - 流式请求对象

发起流式请求并立即返回事件对象.

```js
let stream = ai.stream('Count from 1 to 3');

stream
    .on('delta', (text) => {
        console.log(text);
    })
    .on('done', (response) => {
        console.log(response.finishReason);
    })
    .on('error', (error) => {
        console.error(error.message);
    });
```

## [m] profiles

### profiles()

**`6.8.0`**

- <ins>**returns**</ins> { [AiProfile](#aiprofile)[[]](dataTypes#array) } - AI 配置档案检查结果

返回全部 AI 配置档案的可公开信息.

API 密钥不会出现在返回结果中. `hasApiKey` 仅表示档案是否保存了密钥.

## [m] providers

### providers()

**`6.8.0`**

- <ins>**returns**</ins> { [AiProvider](#aiprovider)[[]](dataTypes#array) } - 内置提供商定义

返回 AutoJs6 支持的提供商协议及默认服务地址.

内置提供商 ID:

- `openai`
- `anthropic`
- `gemini`
- `deepseek`
- `openrouter`
- `openai-compatible`

`openai-compatible` 没有默认服务地址.

## [m] defaultProfile

### defaultProfile()

**`6.8.0`**

- <ins>**returns**</ins> { [AiProfile](#aiprofile) | [null](dataTypes#null) } - 默认档案检查结果

返回当前默认 AI 配置档案.

没有默认档案时返回 `null`.

## [m] isConfigured

### isConfigured()

**`6.8.0`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否存在可直接使用的默认档案

检查是否存在模型名称有效且凭据条件满足的默认档案.

此方法不发起网络请求, 也不保证远程服务当前可用.

## 请求输入

### AiMessage

AiMessage 是可进行 JSON 序列化的消息对象.

- **role** { [string](dataTypes#string) } - 消息角色
- **content** { [any](dataTypes#any) } - 消息内容

常用角色为 `system`, `developer`, `user`, `assistant` 和 `tool`. 具体支持范围由所选提供商协议决定.

消息可包含提供商原生字段. 工具结果消息还可使用 `toolCallId`, `tool_call_id`, `toolUseId`, `tool_use_id` 或 `id` 指定对应工具调用.

### AiRequest

- **messages** { [AiMessage](#aimessage)[[]](dataTypes#array) } - 非空消息数组
- **options** { [AiOptions](#aioptions) } - 除 `messages` 外的内联请求选项

AiRequest 是至少包含 `messages` 属性的可进行 JSON 序列化对象. `messages` 之外的属性会作为内联 [AiOptions](#aioptions).

当同时传入第二个 `options` 参数时, 第二个参数中的同名属性覆盖内联选项.

以下输入会被转换为消息数组:

- 字符串转换为一条 `role` 为 `user` 的消息.
- 单个包含 `role` 和 `content` 的对象转换为单元素消息数组.
- 数组直接作为消息数组.
- 包含 `messages` 的对象使用其 `messages` 属性.

输入必须可由 `JSON.stringify` 序列化, 消息数组不能为空.

### AiOptions

以下属性由 ai 模块直接处理:

- **[ profile ]** { [string](dataTypes#string) } - 档案 ID 或名称
- **[ provider ]** { [string](dataTypes#string) } - 提供商 ID
- **[ baseUrl ]** { [string](dataTypes#string) } - 服务基础 URL
- **[ model ]** { [string](dataTypes#string) } - 模型名称
- **[ apiKey ]** { [string](dataTypes#string) } - 仅用于本次请求的 API 密钥
- **[ timeout ]** { [number](dataTypes#number) } - 请求超时, 单位为毫秒

兼容属性名称:

- `profile`: `profileId`, `profile_id`.
- `provider`: `providerId`, `provider_id`.
- `baseUrl`: `baseURL`, `base_url`.
- `apiKey`: `api_key`.
- `timeout`: `timeoutMillis`, `timeoutMs`, `timeout_millis`.

`timeout` 必须是 `1000..600000` 范围内的整数.<br>
[ask](#m-ask) 和 [chat](#m-chat) 的默认超时为 `120000` 毫秒.<br>
[stream](#m-stream) 的默认超时为 `600000` 毫秒.

未指定 `profile` 和 `provider` 时使用默认档案.<br>
指定 `profile` 时按档案 ID 或名称选择档案.<br>
仅指定 `provider` 时按提供商选择档案.

不依赖已保存档案的独立调用至少需要 `provider` 和 `model`. 通常还需要 `apiKey`.<br>
仅当 `openai-compatible` 使用严格的本机回环地址时, 才允许省略 API 密钥.

以下提供商无关的请求属性会映射到对应提供商协议:

- **[ system ]** { [any](dataTypes#any) } - 系统指令
- **[ temperature ]** { [number](dataTypes#number) } - 采样温度
- **[ maxTokens ]** { [number](dataTypes#number) } - 最大输出 token 数
- **[ topP ]** { [number](dataTypes#number) } - top-p 采样参数
- **[ topK ]** { [number](dataTypes#number) } - top-k 采样参数
- **[ stopSequences ]** { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) } - 停止序列
- **[ tools ]** { [any](dataTypes#any)[[]](dataTypes#array) } - 工具定义
- **[ toolChoice ]** { [any](dataTypes#any) } - 工具选择策略

提供商原生请求属性也会保留. 当原生属性与提供商无关别名同时存在时, 原生属性优先.

`headers`, `callbacks`, `signal`, `abortSignal`, `returnRaw`, `raw` 以及 `onText` 等回调属性不会转发到提供商.

### AiPluginAskOptions

AiPluginAskOptions 用于显式选择兼容的本机文本生成插件. 此路由默认关闭, 仅可调用模块对象 `ai` 和 [ask](#m-ask) 支持.

- **plugin** { [AiPluginSelection](#aipluginselection) } - 必需的插件, 提供商和模型固定选择器
- **[ timeout = `120000` ]** { [number](dataTypes#number) } - 整次请求的绝对超时, 单位为毫秒

`timeout` 也接受 `timeoutMillis`, `timeoutMs` 和 `timeout_millis` 兼容名称, 取值必须是 `1000..600000` 范围内的整数.

插件路由当前仅接受一个字符串提示词, 或仅包含 `role: 'user'` 和字符串 `content` 的单条消息或单元素消息数组. 不支持系统消息, 多轮消息, 工具, 推理, 结构化输出, 用量报告或流式输出.

选项中除 `plugin` 和超时兼容属性外不能包含其他属性. `profile`, `provider`, `baseUrl`, `model`, `apiKey` 及其兼容名称不能与 `plugin` 混用. `chat` 和 `stream` 不支持 `plugin`.

选择器不完整, 目标组件或固定 ID 不匹配, 插件不满足本机且无需凭据的能力约束, 模型不可用, 请求超时或插件进程失效时, 请求会失败. 插件路由不会回退到已保存档案, 默认提供商或 HTTP 请求.

```js
ai.ask('Reply with OK', {
    plugin: {
        component: {
            packageName: 'io.github.supermonster003.autojs6.plugin.ondeviceai',
            className: 'io.github.supermonster003.autojs6.plugin.ondeviceai.provider.OnDeviceAiProviderService',
        },
        providerId: 'autojs6.on-device-ai',
        // Replace this value with the exact model ID shown by the plugin.
        modelId: 'litertlm.0123456789abcdef0123456789abcdef',
    },
    timeout: 30000,
}).then((text) => {
    console.log(text);
});
```

### AiPluginSelection

- **component** { [AiPluginComponent](#aiplugincomponent) } - Android 服务组件
- **providerId** { [string](dataTypes#string) } - 插件声明的精确提供商 ID
- **modelId** { [string](dataTypes#string) } - 插件列出的精确模型 ID

`providerId` 和 `modelId` 必须匹配 `^[a-z0-9][a-z0-9._-]{0,127}$`. 主机不会自动选择其他提供商或模型.

### AiPluginComponent

- **packageName** { [string](dataTypes#string) } - 插件 APK 的精确 Android 包名
- **className** { [string](dataTypes#string) } - 插件文本生成服务的精确类名

主机仅绑定此处指定的组件, 不使用隐式服务选择.

## 返回对象

### AiResponse

- **text** { [string](dataTypes#string) } - 生成文本
- **reasoning** { [string](dataTypes#string) } - 推理文本, 不可用时为空字符串
- **toolCalls** { [AiToolCall](#aitoolcall)[[]](dataTypes#array) } - 工具调用
- **usage** { [AiUsage](#aiusage) | [null](dataTypes#null) } - token 用量
- **finishReason** { [string](dataTypes#string) | [null](dataTypes#null) } - 完成原因
- **message** { [Object](dataTypes#object) | [null](dataTypes#null) } - 提供商原生 assistant 消息
- **error** { [AiProviderError](#aiprovidererror) | [null](dataTypes#null) } - 响应内错误
- **raw** { [any](dataTypes#any) } - 提供商原始响应
- **profile** { [AiProfileReference](#aiprofilereference) } - 本次请求使用的档案信息
- **provider** { [string](dataTypes#string) } - 提供商 ID
- **model** { [string](dataTypes#string) } - 模型名称

### AiStreamChunk

- **text** { [string](dataTypes#string) } - 当前增量文本
- **reasoning** { [string](dataTypes#string) } - 当前增量推理文本
- **toolCalls** { [AiToolCall](#aitoolcall)[[]](dataTypes#array) } - 当前增量工具调用
- **usage** { [AiUsage](#aiusage) | [null](dataTypes#null) } - 当前用量信息
- **finishReason** { [string](dataTypes#string) | [null](dataTypes#null) } - 完成原因
- **done** { [boolean](dataTypes#boolean) } - 是否为终止块
- **raw** { [any](dataTypes#any) } - 提供商原始数据

### AiToolCall

- **index** { [number](dataTypes#number) | [null](dataTypes#null) } - 工具调用序号
- **id** { [string](dataTypes#string) | [null](dataTypes#null) } - 工具调用 ID
- **name** { [string](dataTypes#string) | [null](dataTypes#null) } - 工具名称
- **arguments** { [string](dataTypes#string) | [null](dataTypes#null) } - JSON 参数或参数增量
- **argumentsAreDelta** { [boolean](dataTypes#boolean) } - `arguments` 是否为增量片段
- **raw** { [any](dataTypes#any) } - 提供商原始工具调用数据

### AiUsage

- **inputTokens** { [number](dataTypes#number) | [null](dataTypes#null) } - 输入 token 数
- **outputTokens** { [number](dataTypes#number) | [null](dataTypes#null) } - 输出 token 数
- **totalTokens** { [number](dataTypes#number) | [null](dataTypes#null) } - token 总数
- **reasoningTokens** { [number](dataTypes#number) | [null](dataTypes#null) } - 推理 token 数
- **cachedInputTokens** { [number](dataTypes#number) | [null](dataTypes#null) } - 缓存输入 token 数
- **raw** { [Object](dataTypes#object) | [null](dataTypes#null) } - 提供商原始用量数据

### AiProviderError

- **type** { [string](dataTypes#string) | [null](dataTypes#null) } - 提供商错误类型
- **code** { [string](dataTypes#string) | [null](dataTypes#null) } - 提供商错误代码
- **message** { [string](dataTypes#string) | [null](dataTypes#null) } - 提供商错误消息

### AiProfileReference

- **id** { [string](dataTypes#string) | [null](dataTypes#null) } - 档案 ID
- **name** { [string](dataTypes#string) | [null](dataTypes#null) } - 档案名称
- **provider** { [string](dataTypes#string) } - 提供商 ID
- **baseUrl** { [string](dataTypes#string) } - 服务基础 URL
- **model** { [string](dataTypes#string) } - 模型名称

独立调用没有已保存档案, 因此 `id` 和 `name` 为 `null`.

### AiProfile

- **id** { [string](dataTypes#string) } - 档案 ID
- **name** { [string](dataTypes#string) | [null](dataTypes#null) } - 档案名称
- **provider** { [string](dataTypes#string) | [null](dataTypes#null) } - 提供商 ID
- **baseUrl** { [string](dataTypes#string) | [null](dataTypes#null) } - 服务基础 URL
- **model** { [string](dataTypes#string) | [null](dataTypes#null) } - 模型名称
- **hasApiKey** { [boolean](dataTypes#boolean) | [null](dataTypes#null) } - 是否保存了 API 密钥
- **isDefault** { [boolean](dataTypes#boolean) } - 是否为默认档案
- **status** { `'available'` | `'unavailable'` } - 档案是否可用
- **errorCode** { `'missing_entry'` | `'decryption_failed'` | `'invalid_data'` | [null](dataTypes#null) } - 档案不可用原因代码

无法解密或解析的档案仍会出现在列表中, 此时部分字段为 `null`.

### AiProvider

- **id** { [string](dataTypes#string) } - 提供商 ID
- **defaultBaseUrl** { [string](dataTypes#string) | [null](dataTypes#null) } - 默认服务基础 URL

## AiStream

- <ins>**extends**</ins> { [EventEmitter](eventEmitterType) }

AiStream 是单次流式 AI 请求的事件对象.

它继承 [EventEmitter](eventEmitterType) 的 `addListener`, `eventNames`, `listenerCount`, `listeners`, `prependListener`, `prependOnceListener`, `removeAllListeners`, `removeListener` 和 `setMaxListeners` 等方法.

### [p#] AiStream#state

**`6.8.0`** **`READONLY`**

- { `'created'` | `'open'` | `'done'` | `'error'` | `'cancelled'` }

当前流状态.

### [p#] AiStream#isDone

**`6.8.0`** **`READONLY`**

- { [boolean](dataTypes#boolean) }

流是否已经结束.

### [m#] AiStream#on(eventName, listener)

**`6.8.0`**

- **eventName** { [string](dataTypes#string) } - 事件名称
- **listener** { [Function](dataTypes#function) } - 事件监听器
- <ins>**returns**</ins> { [AiStream](#aistream) } - 当前流对象

注册持续事件监听器.

### [m#] AiStream#once(eventName, listener)

**`6.8.0`**

- **eventName** { [string](dataTypes#string) } - 事件名称
- **listener** { [Function](dataTypes#function) } - 单次事件监听器
- <ins>**returns**</ins> { [AiStream](#aistream) } - 当前流对象

注册仅执行一次的事件监听器.

### [m#] AiStream#cancel()

**`6.8.0`**

- <ins>**returns**</ins> { [AiStream](#aistream) } - 当前流对象

取消网络请求并终止流.

重复调用不会再次取消. 成功接受取消操作后触发 `cancelled` 事件.

## AiStream 事件

事件监听器参数:

| 事件 | 监听器参数 | 说明 |
| --- | --- | --- |
| `open` | `profile` { [AiProfileReference](#aiprofilereference) } | 请求已打开 |
| `delta` | `text` { [string](dataTypes#string) }, `chunk` { [AiStreamChunk](#aistreamchunk) } | 收到文本或推理增量 |
| `chunk` | `chunk` { [AiStreamChunk](#aistreamchunk) } | 收到提供商响应块 |
| `toolCall` | `toolCall` { [AiToolCall](#aitoolcall) } | 收到工具调用或工具调用增量 |
| `usage` | `usage` { [AiUsage](#aiusage) } | 收到用量信息 |
| `done` | `response` { [AiResponse](#airesponse) } | 流正常完成 |
| `error` | `error` { [AiStreamError](#aistreamerror) } | 流失败 |
| `cancelled` | 无 | 流被调用方取消 |

`delta` 的 `text` 参数对应 `chunk.text`. 当事件只包含推理增量时, `text` 可能为空字符串, 此时使用 `chunk.reasoning`.

### AiStreamError

- **name** { [string](dataTypes#string) } - 异常类名称
- **message** { [string](dataTypes#string) } - 错误消息
- **[ route ]** { `'plugin'` } - 插件路由错误标识
- **[ provider ]** { [string](dataTypes#string) } - 提供商 ID
- **[ statusCode ]** { [number](dataTypes#number) } - HTTP 状态码
- **[ code ]** { [string](dataTypes#string) | [null](dataTypes#null) } - 提供商错误代码
- **[ type ]** { [string](dataTypes#string) | [null](dataTypes#null) } - 提供商错误类型
- **[ requestId ]** { [string](dataTypes#string) | [null](dataTypes#null) } - 提供商请求 ID

只有 HTTP 提供商错误包含 `provider`, `statusCode`, `type` 和 `requestId`. 插件路由错误包含 `route: 'plugin'` 和 `code`.
