# 人工智能 (AI)

ai 模块用于发起文本生成, 对话和流式请求. 请求既可使用 AutoJs6 中已配置的 HTTP 提供商, 也可通过 AI 插件目标执行. 官方 3-Stone AI 插件会在同一目录中公开本地模型和在线服务目标, 并由 `ai.catalog` 返回统一元数据. `ai.session` 用于复用插件持有的 Conversation.

`ai` 与 `$ai` 指向同一个可调用模块对象.

使用基于配置档案的调用前, 需要先在 AutoJs6 的 AI 提供商设置中创建可用档案. 也可在单次请求中显式提供 `provider`, `model` 和凭据等选项.

---

<p style="font: bold 2em sans-serif; color: #FF7043">ai</p>

---

## [@] ai

### ai(input, options?)

**`6.8.0`** **`Async`** **`Overload [1-2]/2`**

- **input** { [string](dataTypes#string) | [AiMessage](#aimessage) | [AiMessage](#aimessage)[[]](dataTypes#array) | [AiRequest](#airequest) } - 提示词, 消息或完整请求
- **[ options = `{}` ]** { [AiOptions](#aioptions) | [AiPluginOptions](#aipluginoptions) } - 请求选项
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
- **[ options = `{}` ]** { [AiOptions](#aioptions) | [AiPluginOptions](#aipluginoptions) } - 请求选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [string](dataTypes#string) 类型的生成文本

发起非流式请求, 并仅返回响应中的文本结果.

提供 [AiPluginOptions](#aipluginoptions) 时, 此方法使用选定的插件目标. 该路由接受纯文本 `system`, `user` 和 `assistant` 消息历史, 保留消息顺序并要求最后一条消息为 `user`.

## [m] chat

### chat(input, options?)

**`6.8.0`** **`Async`** **`Overload [1-2]/2`**

- **input** { [string](dataTypes#string) | [AiMessage](#aimessage) | [AiMessage](#aimessage)[[]](dataTypes#array) | [AiRequest](#airequest) } - 提示词, 消息或完整请求
- **[ options = `{}` ]** { [AiOptions](#aioptions) | [AiPluginOptions](#aipluginoptions) } - 请求选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [AiResponse](#airesponse) 或 [AiPluginResponse](#aipluginresponse)

发起非流式请求, 并返回提供商无关的完整响应.

云端返回对象中的 `message` 可在使用同一提供商时追加到后续消息数组, 以保留工具调用和提供商专用数据.

插件路由会把插件报告的输入, 输出, 总计, 推理及缓存输入 token 数写入 `response.usage`, 并在 `response.usage.durationMillis` 中提供插件实测生成耗时.

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
- **[ options = `{}` ]** { [AiOptions](#aioptions) | [AiPluginOptions](#aipluginoptions) } - 请求选项
- <ins>**returns**</ins> { [AiStream](#aistream) } - 流式请求对象

发起流式请求并立即返回事件对象.

使用插件路由时, `open`, `delta`, `chunk`, `usage` 和 `done` 事件分别使用插件专用的元数据, 增量, 用量及响应对象.

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

## [m] session

### session(options?)

**`6.8.0`** **`Async`**

- **[ options = `{}` ]** { [AiPluginSessionOptions](#aipluginsessionoptions) | [null](dataTypes#null) } - 持久插件目标会话选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [AiSession](#aisession)

规划并打开一个插件目标的多轮会话. 不传选项或传入 `null` 时选择官方 3-Stone AI 插件声明的默认目标.

会话固定插件, 目标, 提供商, 模型, backend, 采样参数, 输出上限和超时. 后续轮次复用插件持有的 Conversation 上下文; 本地目标还可复用其 KV cache. 每次 [ask](#m-aisessionaskprompt), [chat](#m-aisessionchatprompt) 或 [stream](#m-aisessionstreamprompt) 只接收并发送当前的新用户提示词, 不需要重新传入完整消息历史.

```js
ai.session({
    system: 'Remember facts from earlier turns.',
    maxTokens: 128,
}).then((session) => {
    return session.ask('The project code is Orion.')
        .then((text) => {
            console.log(text);
            return session.chat('What is the project code?');
        })
        .then((response) => {
            console.log(response.text);
            session.close();
        }, (error) => {
            session.close();
            throw error;
        });
});
```

## [m] catalog

### catalog(options?)

**`6.8.0`** **`Async`**

- **[ options = `{}` ]** { [AiPluginCatalogOptions](#aiplugincatalogoptions) | [null](dataTypes#null) } - 插件目录选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [AiTargetCatalog](#aitargetcatalog)

读取一个 AI 插件公开的完整目标目录. 不传选项或传入 `null` 时选择官方 3-Stone AI 插件. 此方法只读取目录, 不创建生成会话, 也不接受 `target` 或生成控制选项.

目录同时描述本地模型和插件管理的在线服务. `defaultTarget` 是插件声明的默认目标 ID; 每个 `targets` 元素都可通过其完整 `id` 传给 [AiPluginOptions](#aipluginoptions) 的 `target`.

```js
ai.catalog().then((catalog) => {
    console.log(catalog.defaultTarget);
    catalog.targets.forEach((target) => {
        console.log(target.id, target.displayName, target.locality);
        console.log(target.configured, target.available);
        console.log(target.backendProfiles);
    });
});
```

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

### AiPluginOptions

AiPluginOptions 用于选择 AI 插件及其目录目标. 模块对象 `ai` 及 [ask](#m-ask), [chat](#m-chat), [stream](#m-stream) 均支持该选项.

- **[ plugin ]** { [AiPluginSelector](#aipluginselector) } - 插件选择器
- **[ target ]** { [string](dataTypes#string) } - [AiTarget](#aitarget) 的完整 `id`
- **[ timeout ]** { [number](dataTypes#number) } - 整次请求的绝对超时, 单位为毫秒
- **[ temperature ]** { [number](dataTypes#number) } - 非负有限采样温度
- **[ topK ]** { [number](dataTypes#number) } - 正整数候选 token 数
- **[ topP ]** { [number](dataTypes#number) } - `0..1` 范围内的有限核采样概率
- **[ maxTokens ]** { [number](dataTypes#number) } - `1..2147483647` 范围内的最大输出 token 数
- **[ backend ]** { `'cpu'` | `'gpu'` | `'npu'` | [null](dataTypes#null) } - 显式 backend profile
- **[ reasoning = `false` ]** { [boolean](dataTypes#boolean) | [null](dataTypes#null) } - 是否请求推理输出
- **[ structuredJson = `false` ]** { [boolean](dataTypes#boolean) | [null](dataTypes#null) } - 是否启用原生 JSON Schema 约束解码
- **[ responseSchema ]** { [Object](dataTypes#object) | [null](dataTypes#null) } - JSON Schema 对象; 提供时会隐式启用结构化输出

[ai](#ai), [ask](#m-ask) 和 [chat](#m-chat) 的默认超时为 `120000` 毫秒, [stream](#m-stream) 的默认超时为 `600000` 毫秒. `timeout` 也接受 `timeoutMillis`, `timeoutMs` 和 `timeout_millis` 兼容名称, 取值必须是 `1000..600000` 范围内的整数.

`plugin` 和 `target` 至少需要提供一个. 只提供 `target` 时选择官方 3-Stone AI 插件; 只提供 `plugin` 时选择该插件声明的默认目标. 同时提供时, `target` 必须存在于该插件的 [AiTargetCatalog](#aitargetcatalog) 中. 目标 ID 是形如 `local:...` 或 `profile:...` 的稳定字符串, 必须完整传递, 不能从显示名称或模型名称推测.

插件路由接受一个字符串提示词, 一条 `user` 纯文本消息, 或由 `system`, `user` 和 `assistant` 纯文本消息组成的非空数组. 消息顺序会原样保留, `content` 必须是非空字符串, 且最后一条消息必须为 `user`. 当前公开路由不接受 `tool` 消息或工具定义; `toolCalls` 因而为空数组.

`reasoning: true` 要求目标目录包含 `reasoning` 能力. 推理文本通过 `response.reasoning` 或流式块的 `reasoning` 属性返回. 不支持该能力的目标会以 `TARGET_CAPABILITY_MISMATCH` 失败, 不会静默忽略选项.

`responseSchema` 必须是 JSON 对象, UTF-8 序列化后不能超过 64 KiB. 单独提供 `responseSchema` 即等价于同时启用 `structuredJson`. 启用 `structuredJson` 但省略 schema 时使用 `{ "type": "object" }`; `structuredJson: false` 不能与非空 `responseSchema` 同时使用. 目标必须同时公开 `structured-json` 能力和 `response-json-schema` 控制. 支持的 JSON Schema 关键字范围由所选目标决定, 不应假设支持完整 JSON Schema 规范.

`backend` 省略或为 `null` 时由目标使用其默认 backend. 显式指定时, 目标必须公开 `backend-profile` 控制, 且 [AiTarget](#aitarget) 的 `backendProfiles` 中必须包含可用的对应项. 不可用的 profile 会以 `BACKEND_UNAVAILABLE` 失败, 不会静默改用其他 backend. 在线目标通常不公开 backend profile.

当前官方插件的 LiteRT-LM 本地目标会公开 CPU, GPU 和 NPU. GPU 只有在 ABI 和 OpenCL 运行时前置条件满足时可用. NPU 当前固定为 `unavailable`, 并以 `npu-runtime-not-packaged` 说明插件未打包所需运行时. 在线目标的 `backendProfiles` 为空数组.

结构化模式使用插件原生约束解码并将完成结果按严格 JSON 验证. [ai](#ai) 和 [ask](#m-ask) 仍兑现 JSON 文本字符串, [chat](#m-chat) 及流式 `done` 事件仍在 `response.text` 中提供完整 JSON 文本. `delta` 和 `chunk` 是尚未完成的文本片段, 只能在完成后解析. 如果输出 token 或字节上限在完整 JSON 生成前终止请求, 请求会失败而不会把无效 JSON 当作成功结果返回.

选项中除 `plugin`, `target`, 超时兼容属性及上述生成控制外不能包含其他属性. `profile`, `provider`, `baseUrl`, `model`, `apiKey` 及其兼容名称不能与插件目标路由混用.

插件报告的 `durationMillis` 只覆盖生成调用, 不包含宿主发现, 绑定, 目录读取或回调分发时间. `ai.stream` 会在完成前发出累计 `usage` 事件, `done` 响应中也包含同一最终用量.

选择器不完整, 目标不存在, 未配置, 不可用, 能力不匹配, backend 不可用, 请求超时或插件进程失效时, 请求会以稳定错误码失败. 插件路由不会改选其他目标, 回退到已保存档案或另行发起宿主 HTTP 请求.

### AiPluginSessionOptions

AiPluginSessionOptions 用于创建 [AiSession](#aisession). 它只支持插件目标路由, 并在省略 `plugin` 和 `target` 时选择官方 3-Stone AI 插件声明的默认目标.

- **[ plugin = `true` ]** { [AiPluginSelector](#aipluginselector) } - 插件选择器
- **[ target ]** { [string](dataTypes#string) } - 会话固定使用的完整目标 ID
- **[ system ]** { [string](dataTypes#string) } - 仅在创建 Conversation 时发送的非空系统指令
- **[ timeout = `120000` ]** { [number](dataTypes#number) } - 会话规划及每轮生成的绝对超时, 单位为毫秒
- **[ temperature ]** { [number](dataTypes#number) } - 非负有限采样温度
- **[ topK ]** { [number](dataTypes#number) } - 正整数候选 token 数
- **[ topP ]** { [number](dataTypes#number) } - `0..1` 范围内的有限核采样概率
- **[ maxTokens ]** { [number](dataTypes#number) } - `1..2147483647` 范围内的每轮最大输出 token 数
- **[ backend ]** { `'cpu'` | `'gpu'` | `'npu'` | [null](dataTypes#null) } - 整个 Conversation 固定使用的 backend profile
- **[ reasoning = `false` ]** { [boolean](dataTypes#boolean) | [null](dataTypes#null) } - 是否在每轮请求推理输出
- **[ structuredJson = `false` ]** { [boolean](dataTypes#boolean) | [null](dataTypes#null) } - 是否为每轮启用原生 JSON Schema 约束解码
- **[ responseSchema ]** { [Object](dataTypes#object) | [null](dataTypes#null) } - 整个会话固定使用的 JSON Schema 对象

`timeout` 接受 `timeoutMillis`, `timeoutMs` 和 `timeout_millis` 兼容名称, 取值必须是 `1000..600000` 范围内的整数. 目标, 采样参数, 输出上限, 超时, `backend`, `reasoning`, `structuredJson` 和 `responseSchema` 在会话创建后不能按轮次修改. backend 和能力核对, 禁止回退语义及结构化输出规则与 [AiPluginOptions](#aipluginoptions) 相同. 目标还必须公开 `persistent-session` 能力.

会话轮次只接受一个非空字符串并将其作为 `user` 消息. `system` 只进入首轮上下文, 后续 Binder 请求不携带系统指令或既有消息. 不支持按轮次传入 `profile`, `provider`, `baseUrl`, `model`, `apiKey`, 工具或其他生成选项.

同一会话一次只允许一个活动轮次. 并发轮次以 `BUSY` 失败, 但不会关闭正在运行的轮次. 正常完成后会话保持可用; 生成失败, 超时, 协议错误, Binder 失效, 输出字节上限终止或流式取消会关闭整个会话. 关闭后需要重新调用 [ai.session](#m-session).

### AiPluginCatalogOptions

- **[ plugin = `true` ]** { [AiPluginSelector](#aipluginselector) } - 插件选择器
- **[ timeout = `120000` ]** { [number](dataTypes#number) } - 目录读取的绝对超时, 单位为毫秒

`timeout` 接受与 [AiPluginOptions](#aipluginoptions) 相同的兼容名称和取值范围. `target`, `temperature`, `topK`, `topP`, `maxTokens`, `backend`, `reasoning`, `structuredJson` 和 `responseSchema` 只用于生成, 不能用于目录读取. 返回目录已经包含目标的配置状态, 可用性, 能力, 控制, 限制, HTTPS origins 和 backend 探测结果.

### AiPluginSelector

AiPluginSelector 接受以下三种形式:

- `true`: 选择官方 3-Stone AI 插件及其固定提供商 ID.
- [AiOfficialPluginSelection](#aiofficialpluginselection): 选择官方插件, 可显式固定 `providerId`.
- [AiPluginSelection](#aipluginselection): 通过精确 Android 服务组件选择插件, 并固定 `providerId`.

`false`, `null`, 字符串及包含未知字段的对象均不是有效选择器.

### AiOfficialPluginSelection

- **[ providerId = `'autojs6.three-stone-ai'` ]** { [string](dataTypes#string) | [null](dataTypes#null) } - 官方插件提供商 ID

此对象不能包含 `component`. 空对象 `{}` 与 `true` 等价. `providerId` 为 `null` 时使用官方默认值. 目标不属于插件选择器; 需要精确目标时使用 [AiPluginOptions](#aipluginoptions) 的 `target`.

### AiPluginSelection

- **component** { [AiPluginComponent](#aiplugincomponent) } - Android 服务组件
- **providerId** { [string](dataTypes#string) } - 插件声明的精确提供商 ID

`providerId` 必须匹配 `^[a-z0-9][a-z0-9._-]{0,127}$`. 主机不会改选其他组件或提供商. 需要精确目标时另行传入完整 `target` ID.

### AiPluginComponent

- **packageName** { [string](dataTypes#string) } - 插件 APK 的精确 Android 包名
- **className** { [string](dataTypes#string) } - 插件文本生成服务的精确类名

主机仅绑定此处指定的组件, 不使用隐式服务选择.

### 插件结构化 JSON 示例

以下示例从官方 3-Stone AI 目录中选择支持结构化输出的可用目标. `responseSchema` 会隐式启用 `structuredJson`, 因此可省略 `structuredJson: true`. 返回值仍是字符串, 需要在 Promise 兑现后调用 `JSON.parse`.

```js
let schema = {
    type: 'object',
    properties: {
        answer: { type: 'string' },
        ok: { type: 'boolean' },
    },
    required: ['answer', 'ok'],
};

ai.catalog().then((catalog) => {
    let target = catalog.targets.find((item) => {
        return item.configured &&
            item.available &&
            item.capabilities.includes('structured-json') &&
            item.supportedControls.includes('response-json-schema');
    });
    if (!target) {
        throw new Error('No structured JSON target is available');
    }
    return ai.ask('Return answer as OK and ok as true.', {
        target: target.id,
        responseSchema: schema,
        maxTokens: 64,
    });
}).then((text) => {
    let value = JSON.parse(text);
    console.log(value.answer, value.ok);
});
```

同一 schema 需要用于多个连续轮次时, 在创建持久会话时固定它:

```js
ai.catalog().then((catalog) => {
    let target = catalog.targets.find((item) => {
        return item.available &&
            item.capabilities.includes('persistent-session') &&
            item.capabilities.includes('structured-json');
    });
    if (!target) {
        throw new Error('No persistent structured JSON target is available');
    }
    return ai.session({
        target: target.id,
        structuredJson: true,
        responseSchema: schema,
        maxTokens: 64,
    });
}).then((session) => {
    return session.ask('Return the first object.')
        .then((text) => {
            console.log(JSON.parse(text));
            return session.chat('Return the second object.');
        })
        .then((response) => {
            console.log(JSON.parse(response.text));
            session.close();
        }, (error) => {
            session.close();
            throw error;
        });
});
```

### 统一目标路由示例

以下示例先读取官方插件目录, 再用完整目标 ID 发起带有消息历史的单次请求. 示例优先选择已配置且可用的在线目标; 没有在线目标时使用插件声明的默认目标. 需要让插件在多个请求之间保留上下文时使用 [ai.session](#m-session).

```js
let messages = [
    { role: 'system', content: 'Answer with one short sentence.' },
    { role: 'assistant', content: 'Understood.' },
    { role: 'user', content: 'Introduce AutoJs6.' },
];

ai.catalog({ timeout: 30000 }).then((catalog) => {
    let selectedTarget = catalog.targets.find((target) => {
        return target.locality === 'remote' && target.configured && target.available;
    }) || catalog.targets.find((target) => {
        return target.id === catalog.defaultTarget;
    });
    if (!selectedTarget) {
        throw new Error('No default or configured online AI target is available');
    }
    let gpu = selectedTarget.backendProfiles.find((profile) => {
        return profile.id === 'gpu' && profile.availability === 'available';
    });
    let options = {
        target: selectedTarget.id,
        timeout: 30000,
        temperature: 0.7,
        topK: 40,
        topP: 0.9,
        maxTokens: 128,
    };
    if (gpu) {
        options.backend = 'gpu';
    }
    return ai.chat(messages, options);
}).then((response) => {
    console.log(response.route, response.target.id, response.provider, response.model);
    console.log(response.text);
    console.log(
        response.usage.inputTokens,
        response.usage.outputTokens,
        response.usage.totalTokens,
    );
    console.log(response.usage.durationMillis, response.finishReason);
}).catch((error) => {
    console.error(error.route, error.code, error.message);
});
```

需要固定精确组件时, 使用完整选择器. 以下组件是 AutoJs6 官方插件的当前服务组件; 第三方兼容插件应替换为自己的包名, 类名和提供商 ID.

```js
let plugin = {
    component: {
        packageName: 'io.github.supermonster003.autojs6.plugin.threestoneai',
        className: 'io.github.supermonster003.autojs6.plugin.threestoneai.provider.ThreeStoneAiProviderService',
    },
    providerId: 'autojs6.three-stone-ai',
};

ai.catalog({ plugin: plugin }).then((catalog) => {
    if (!catalog.defaultTarget) {
        throw new Error('The plugin has no default target');
    }
    return ai.stream(messages, {
        plugin: plugin,
        target: catalog.defaultTarget,
        timeout: 60000,
        maxTokens: 128,
    });
}).then((stream) => stream
    .on('open', (metadata) => {
        console.log(metadata.route, metadata.target.id, metadata.provider, metadata.model);
    })
    .on('delta', (text) => {
        console.log(text);
    })
    .on('usage', (usage) => {
        console.log(usage.inputTokens, usage.outputTokens, usage.totalTokens);
    })
    .on('done', (response) => {
        console.log(response.text, response.usage);
    })
    .on('error', (error) => {
        console.error(error.route, error.code, error.message);
    }));
```

## 返回对象

### AiResponse

AiResponse 是 HTTP 提供商路由的完整响应.

- **text** { [string](dataTypes#string) } - 生成文本; 结构化模式下为完整 JSON 文本
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

### AiPluginResponse

AiPluginResponse 是插件目标 [chat](#m-chat) 和 [stream](#m-stream) 完成时的响应.

- **text** { [string](dataTypes#string) } - 生成文本
- **reasoning** { [string](dataTypes#string) } - 推理文本; 未请求或不可用时为空字符串
- **toolCalls** { [Array](dataTypes#array) } - 空数组; 当前插件公开路由不接受工具调用
- **usage** { [AiPluginUsage](#aipluginusage) } - 插件最终用量
- **finishReason** { `'stop'` | `'length'` | `'tool_calls'` | `'content_filter'` | `'error'` | `'other'` } - 协议完成原因
- **message** { [null](dataTypes#null) } - 固定为 `null`
- **error** { [null](dataTypes#null) } - 固定为 `null`; 失败通过 Promise 拒绝或 `error` 事件报告
- **raw** { [null](dataTypes#null) } - 固定为 `null`
- **profile** { [AiPluginProfileReference](#aipluginprofilereference) | [null](dataTypes#null) } - 在线目标的插件管理档案引用; 本地目标为 `null`
- **target** { [AiTarget](#aitarget) } - 实际解析的完整目标元数据
- **plugin** { [AiPluginIdentity](#aipluginidentity) } - 实际绑定的插件身份
- **route** { `'plugin'` } - 插件路由标识
- **provider** { [string](dataTypes#string) } - 实际提供商 ID
- **model** { [string](dataTypes#string) } - 实际模型 ID

### AiStreamChunk

AiStreamChunk 是 HTTP 提供商路由的增量对象.

- **text** { [string](dataTypes#string) } - 当前增量文本
- **reasoning** { [string](dataTypes#string) } - 当前增量推理文本
- **toolCalls** { [AiToolCall](#aitoolcall)[[]](dataTypes#array) } - 当前增量工具调用
- **usage** { [AiUsage](#aiusage) | [null](dataTypes#null) } - 当前用量信息
- **finishReason** { [string](dataTypes#string) | [null](dataTypes#null) } - 完成原因
- **done** { [boolean](dataTypes#boolean) } - 是否为终止块
- **raw** { [any](dataTypes#any) } - 提供商原始数据

### AiPluginStreamMetadata

- **route** { `'plugin'` } - 插件路由标识
- **provider** { [string](dataTypes#string) } - 提供商 ID
- **model** { [string](dataTypes#string) } - 实际模型 ID
- **target** { [AiTarget](#aitarget) } - 实际解析的完整目标元数据
- **profile** { [AiPluginProfileReference](#aipluginprofilereference) | [null](dataTypes#null) } - 在线目标的插件管理档案引用
- **plugin** { [AiPluginIdentity](#aipluginidentity) } - 实际绑定的插件身份

### AiPluginStreamChunk

- **text** { [string](dataTypes#string) } - 当前文本增量; 结构化模式下可能尚不是完整 JSON
- **reasoning** { [string](dataTypes#string) } - 当前推理增量; 纯推理块中 `text` 为空字符串
- **toolCalls** { [Array](dataTypes#array) } - 空数组
- **usage** { [null](dataTypes#null) } - 固定为 `null`; 用量通过独立 `usage` 事件报告
- **finishReason** { [null](dataTypes#null) } - 固定为 `null`
- **done** { `false` } - 固定为 `false`; 正常完成通过 `done` 事件报告
- **raw** { [null](dataTypes#null) } - 固定为 `null`

### AiTargetCatalog

- **generation** { [string](dataTypes#string) } - 当前目录快照 generation
- **plugin** { [AiPluginIdentity](#aipluginidentity) } - 目录所属插件
- **defaultTarget** { [string](dataTypes#string) | [null](dataTypes#null) } - 插件声明的默认目标 ID
- **targets** { [AiTarget](#aitarget)[[]](dataTypes#array) } - 完整目标列表

`defaultTarget` 与 `targets` 中唯一的 `isDefault: true` 条目一致. generation 会反映目录配置或运行时探测变化, 调用方不应跨 generation 缓存可用性判断.

### AiTarget

- **id** { [string](dataTypes#string) } - `local:...` 或 `profile:...` 形式的稳定目标 ID
- **displayName** { [string](dataTypes#string) } - 面向用户的目标名称
- **provider** { [string](dataTypes#string) } - 目标提供商 ID
- **profile** { [string](dataTypes#string) | [null](dataTypes#null) } - 插件管理的在线档案 ID; 本地目标为 `null`
- **model** { [string](dataTypes#string) } - 模型 ID
- **locality** { `'local'` | `'remote'` | `'hybrid'` } - 数据处理位置
- **credentialMode** { `'none'` | `'plugin-managed'` } - 凭据归属; 凭据内容不会返回宿主或脚本
- **configured** { [boolean](dataTypes#boolean) } - 目标所需配置是否完整
- **available** { [boolean](dataTypes#boolean) } - 当前是否可规划生成
- **availability** { `'available'` | `'unavailable'` } - 协议可用性状态
- **isDefault** { [boolean](dataTypes#boolean) } - 是否为插件声明的默认目标
- **capabilities** { [string](dataTypes#string)[[]](dataTypes#array) } - 目标能力 ID
- **supportedControls** { [string](dataTypes#string)[[]](dataTypes#array) } - 目标接受的生成控制 ID
- **limits** {{ maximumContextBytes: [number](dataTypes#number); maximumOutputBytes: [number](dataTypes#number) }} - 协议字节上限
- **origins** { [string](dataTypes#string)[[]](dataTypes#array) } - 远程或混合目标声明的 HTTPS origins; 本地目标为空数组
- **backendProfiles** { [AiPluginBackendProfile](#aipluginbackendprofile)[[]](dataTypes#array) } - backend profile 及当前设备可用性

能力 ID 当前包括 `streaming`, `reasoning`, `tools`, `structured-json`, `usage` 和 `persistent-session`. 控制 ID 当前包括 `maximum-output-tokens`, `temperature`, `top-k`, `top-p`, `response-json-schema` 和 `backend-profile`. 调用方应按字符串集合判断, 不应假设每个目标都支持全部能力或控制.

目录中的字节上限来自插件协议, 不等同于 token 上限. `configured: false` 的目标必然不可用; 此类目标仍保留在目录中, 便于 UI 和脚本引导用户完成配置.

### AiPluginIdentity

- **provider** { [string](dataTypes#string) } - 插件提供商 ID
- **component** { [AiPluginComponent](#aiplugincomponent) } - 实际绑定的 Android 服务组件

### AiPluginProfileReference

- **id** { [string](dataTypes#string) } - 插件管理的在线档案 ID
- **provider** { [string](dataTypes#string) } - 目标提供商 ID
- **model** { [string](dataTypes#string) } - 模型 ID
- **target** { [string](dataTypes#string) } - 完整目标 ID

### AiPluginBackendProfile

- **id** { `'cpu'` | `'gpu'` | `'npu'` } - 可传给 `backend` 的稳定 profile ID
- **availability** { `'available'` | `'unavailable'` } - 当前插件进程和设备的运行时前置条件状态
- **[ unavailableReason ]** { `'abi-unsupported'` | `'opencl-library-unavailable'` | `'npu-runtime-not-packaged'` } - 仅在 `unavailable` 时存在的稳定原因

`available` 不是特定模型必然能够初始化的保证. 它用于在生成前排除 ABI, 动态链接命名空间和未打包运行时等确定性问题; 最终兼容性仍由目标在对应 backend 上的初始化结果决定. backend 探测结果会参与目录 generation.

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

### AiPluginUsage

- **inputTokens** { [number](dataTypes#number) | [null](dataTypes#null) } - 输入 token 数
- **outputTokens** { [number](dataTypes#number) | [null](dataTypes#null) } - 输出 token 数
- **totalTokens** { [number](dataTypes#number) | [null](dataTypes#null) } - token 总数
- **reasoningTokens** { [number](dataTypes#number) | [null](dataTypes#null) } - 推理 token 数
- **cachedInputTokens** { [number](dataTypes#number) | [null](dataTypes#null) } - 缓存输入 token 数
- **durationMillis** { [number](dataTypes#number) | [null](dataTypes#null) } - 插件实测生成耗时
- **raw** { [null](dataTypes#null) } - 固定为 `null`

协议要求上述五个 token 计数至少有一个非空. 各字段均为插件报告值; 宿主不会根据字符数估算或改写.

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

## AiSession

AiSession 表示一个由 AI 插件持有的持久 Conversation. 在线目标的档案和凭据仍由插件管理; 会话不会在路由失败时改选目标或转入宿主 HTTP 路由. 会话保持打开时会占用插件的会话准入和目标资源, 不再使用时应调用 [close](#m-aisessionclose).

### [p#] AiSession#provider

**`6.8.0`** **`READONLY`**

- { [string](dataTypes#string) }

固定的插件提供商 ID.

### [p#] AiSession#model

**`6.8.0`** **`READONLY`**

- { [string](dataTypes#string) }

会话规划阶段解析并固定的模型 ID.

### [p#] AiSession#target

**`6.8.0`** **`READONLY`**

- { [string](dataTypes#string) }

会话规划阶段解析并固定的完整目标 ID.

### [p#] AiSession#profile

**`6.8.0`** **`READONLY`**

- { [string](dataTypes#string) | [null](dataTypes#null) }

在线目标的插件管理档案 ID; 本地目标为 `null`.

### [p#] AiSession#backend

**`6.8.0`** **`READONLY`**

- { `'cpu'` | `'gpu'` | `'npu'` | [null](dataTypes#null) }

会话固定的显式 backend profile. 未显式指定时为 `null`.

### [p#] AiSession#state

**`6.8.0`** **`READONLY`**

- { `'ready'` | `'closed'` }

当前会话状态. `ready` 表示会话可接受轮次, 但同一时间仍只允许一个活动轮次.

### [p#] AiSession#isClosed

**`6.8.0`** **`READONLY`**

- { [boolean](dataTypes#boolean) }

会话是否已经关闭或因终止错误失效.

### [m#] AiSession#ask(prompt)

**`6.8.0`** **`Async`**

- **prompt** { [string](dataTypes#string) } - 当前轮次的新用户提示词
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [string](dataTypes#string) 类型的生成文本

在保留既有 Conversation 上下文的同时发起一个非流式轮次, 并仅返回文本结果. 结构化会话返回完整 JSON 文本字符串. 此方法不接受消息数组或按轮次生成选项.

### [m#] AiSession#chat(prompt)

**`6.8.0`** **`Async`**

- **prompt** { [string](dataTypes#string) } - 当前轮次的新用户提示词
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [AiPluginResponse](#aipluginresponse)

在保留既有 Conversation 上下文的同时发起一个非流式轮次, 并返回插件完整响应.

### [m#] AiSession#stream(prompt)

**`6.8.0`** **`Async`**

- **prompt** { [string](dataTypes#string) } - 当前轮次的新用户提示词
- <ins>**returns**</ins> { [AiStream](#aistream) } - 当前轮次的流式请求对象

在保留既有 Conversation 上下文的同时发起一个流式轮次. 事件形状与普通插件流式路由相同.

调用返回对象的 `cancel()` 会关闭整个 AiSession, 因为取消后的插件 Conversation 不会继续复用. `error` 事件, 超时或协议错误也会使会话进入 `closed` 状态.

### [m#] AiSession#close()

**`6.8.0`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

关闭会话, 取消活动轮次并释放插件 Conversation, Binder 连接和目标资源. 重复调用不会产生额外效果.

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

取消当前请求并终止流.

重复调用不会再次取消. 成功接受取消操作后触发 `cancelled` 事件.

## AiStream 事件

事件监听器参数:

| 事件 | 监听器参数 | 说明 |
| --- | --- | --- |
| `open` | `metadata` { [AiProfileReference](#aiprofilereference) 或 [AiPluginStreamMetadata](#aipluginstreammetadata) } | 请求已打开 |
| `delta` | `text` { [string](dataTypes#string) }, `chunk` { [AiStreamChunk](#aistreamchunk) 或 [AiPluginStreamChunk](#aipluginstreamchunk) } | 收到文本或推理增量 |
| `chunk` | `chunk` { [AiStreamChunk](#aistreamchunk) 或 [AiPluginStreamChunk](#aipluginstreamchunk) } | 收到提供商响应块 |
| `toolCall` | `toolCall` { [AiToolCall](#aitoolcall) } | HTTP 提供商路由收到工具调用或工具调用增量 |
| `usage` | `usage` { [AiUsage](#aiusage) 或 [AiPluginUsage](#aipluginusage) } | 收到用量信息 |
| `done` | `response` { [AiResponse](#airesponse) 或 [AiPluginResponse](#aipluginresponse) } | 流正常完成 |
| `error` | `error` { [AiStreamError](#aistreamerror) } | 流失败 |
| `cancelled` | 无 | 流被调用方取消 |

`delta` 的 `text` 参数对应 `chunk.text`. 当事件只包含推理增量时, `text` 可能为空字符串, 此时使用 `chunk.reasoning`.

插件路由不会发出 `toolCall` 事件. 插件 `chunk.usage` 固定为 `null`; 最终累计用量通过 `usage` 事件发出, 并再次出现在 `done` 响应中.

### AiStreamError

- **name** { [string](dataTypes#string) } - 异常类名称
- **message** { [string](dataTypes#string) } - 错误消息
- **[ route ]** { `'plugin'` } - 插件路由错误标识
- **[ provider ]** { [string](dataTypes#string) } - 提供商 ID
- **[ statusCode ]** { [number](dataTypes#number) } - HTTP 状态码
- **[ code ]** { [AiPluginErrorCode](#aipluginerrorcode) | [string](dataTypes#string) | [null](dataTypes#null) } - 插件稳定错误码或 HTTP 提供商错误代码
- **[ type ]** { [string](dataTypes#string) | [null](dataTypes#null) } - 提供商错误类型
- **[ requestId ]** { [string](dataTypes#string) | [null](dataTypes#null) } - 提供商请求 ID

只有 HTTP 提供商错误包含 `provider`, `statusCode`, `type` 和 `requestId`. 插件路由错误包含 `route: 'plugin'` 和 `code`.

### AiPluginErrorCode

插件路由 Promise 拒绝和流式 `error` 事件使用以下稳定错误码:

| 错误码 | 含义 |
| --- | --- |
| `INVALID_REQUEST` | 输入, 选择器或选项无效 |
| `AI_PROVIDER_UNAVAILABLE` | 插件服务未安装或不可发现 |
| `AI_PROVIDER_DISABLED` | 插件组件被禁用 |
| `AI_PROVIDER_REJECTED` | 插件身份, 签名, 权限或协议协商被拒绝 |
| `BUSY` | 插件当前不接受新的并发请求 |
| `FUSED` | 插件连接因安全或协议违规被熔断 |
| `CANCELLED` | 请求被取消 |
| `TIMED_OUT` | 请求或会话轮次超时 |
| `BINDER_DIED` | 插件进程或 Binder 连接失效 |
| `TARGET_NOT_FOUND` | 完整目标 ID 不存在; 应重新读取 `ai.catalog()` |
| `TARGET_NOT_CONFIGURED` | 目标存在, 但插件管理配置不完整 |
| `TARGET_UNAVAILABLE` | 目标已配置, 但当前不可用 |
| `TARGET_CAPABILITY_MISMATCH` | 目标不满足流式, 推理, 结构化输出或持久会话等要求 |
| `BACKEND_UNAVAILABLE` | 显式 backend 不存在或当前不可用 |
| `SESSION_CLOSED` | 持久会话已经关闭 |
| `SESSION_REJECTED` | 插件拒绝创建会话或继续轮次 |
| `PROVIDER_FAILED` | 目标提供商执行失败 |
| `INTERNAL_FAILURE` | 宿主内部编排失败 |

错误码不会触发自动目标替换或路由回退. 对 `TARGET_NOT_FOUND`, `TARGET_NOT_CONFIGURED`, `TARGET_UNAVAILABLE`, `TARGET_CAPABILITY_MISMATCH` 和 `BACKEND_UNAVAILABLE`, 应重新检查目录中的目标状态, 能力, 控制和 backend profile 后显式重试.
