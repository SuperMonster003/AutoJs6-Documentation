# 人工智能 (AI)

ai 模块通过 AI Provider 插件目标发起文本生成, 对话, 流式请求和持久会话. 官方 3-Stone AI 插件在同一目录中公开本地模型与用户配置的在线服务, 并负责目标配置, 在线凭据和实际推理. AutoJs6 宿主只负责可信插件发现, 协议协商, 精确目标路由, Binder 生命周期和错误规范化.

`ai` 与 `$ai` 指向同一个可调用模块对象. 省略 `plugin` 和 `target` 时, 所有生成方法均选择官方 3-Stone AI 插件声明的默认目标. 不会根据目标失败情况自动选择其他本地或在线目标.

可在 AutoJs6 开发者选项中打开 "AI 服务设置". 已安装并启用可信插件时会直接打开 3-Stone AI 设置; 其他状态会显示安装, Android 应用启用, 插件中心启用或更新指引. 设置入口是无参数且受插件权限保护的契约, 不传输目标配置或凭据.

---

<p style="font: bold 2em sans-serif; color: #FF7043">ai</p>

---

## [@] ai

### ai(input, options?)

**`6.8.0`** **`Async`**

- **input** { [string](dataTypes#string) | [AiMessage](#aimessage) | [AiMessage](#aimessage)[[]](dataTypes#array) | [AiRequest](#airequest) } - 提示词, 消息或完整请求
- **[ options = `{}` ]** { [AiOptions](#aioptions) } - 目标和生成选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为生成文本

发起文本生成请求. 此调用与 [ai.ask(input, options?)](#m-ask) 等价.

```js
ai('Reply with OK').then((text) => {
    console.log(text);
});
```

## [m] ask

### ask(input, options?)

**`6.8.0`** **`Async`**

- **input** { [string](dataTypes#string) | [AiMessage](#aimessage) | [AiMessage](#aimessage)[[]](dataTypes#array) | [AiRequest](#airequest) } - 提示词, 消息或完整请求
- **[ options = `{}` ]** { [AiOptions](#aioptions) } - 目标和生成选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [string](dataTypes#string) 类型的生成文本

发起非流式请求, 并仅返回响应中的文本结果. 结构化输出仍以完整 JSON 文本字符串兑现.

## [m] chat

### chat(input, options?)

**`6.8.0`** **`Async`**

- **input** { [string](dataTypes#string) | [AiMessage](#aimessage) | [AiMessage](#aimessage)[[]](dataTypes#array) | [AiRequest](#airequest) } - 提示词, 消息或完整请求
- **[ options = `{}` ]** { [AiOptions](#aioptions) } - 目标和生成选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [AiResponse](#airesponse)

发起非流式请求, 并返回包含精确目标, 用量, 完成原因和推理文本的完整响应.

```js
let messages = [
    { role: 'system', content: 'Answer with one short sentence.' },
    { role: 'user', content: 'Introduce AutoJs6.' },
];

ai.chat(messages).then((response) => {
    console.log(response.target.id, response.provider, response.model);
    console.log(response.text);
    console.log(response.usage);
});
```

## [m] stream

### stream(input, options?)

**`6.8.0`** **`Async`**

- **input** { [string](dataTypes#string) | [AiMessage](#aimessage) | [AiMessage](#aimessage)[[]](dataTypes#array) | [AiRequest](#airequest) } - 提示词, 消息或完整请求
- **[ options = `{}` ]** { [AiOptions](#aioptions) } - 目标和生成选项
- <ins>**returns**</ins> { [AiStream](#aistream) } - 流式请求对象

发起流式请求并立即返回事件对象. `open`, `delta`, `chunk`, `usage` 和 `done` 分别提供目标元数据, 增量, 用量与完整响应.

```js
let stream = ai.stream('Count from 1 to 3');

stream
    .on('delta', (text, chunk) => {
        console.log(text, chunk.reasoning);
    })
    .on('done', (response) => {
        console.log(response.finishReason, response.usage);
    })
    .on('error', (error) => {
        console.error(error.code, error.message);
    });
```

## [m] session

### session(options?)

**`6.8.0`** **`Async`**

- **[ options = `{}` ]** { [AiSessionOptions](#aisessionoptions) | [null](dataTypes#null) } - 持久目标会话选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [AiSession](#aisession)

规划并打开一个插件目标的多轮会话. 不传选项或传入 `null` 时选择官方 3-Stone AI 插件声明的默认目标.

会话固定插件, 目标, 提供商, 模型, backend, 采样参数, 输出上限和超时. 后续轮次复用插件持有的 Conversation 上下文; 本地目标还可复用其 KV cache. 每次 [ask](#m-aisessionaskprompt), [chat](#m-aisessionchatprompt) 或 [stream](#m-aisessionstreamprompt) 只接收当前的新用户提示词.

```js
ai.session({
    system: 'Remember facts from earlier turns.',
    maxTokens: 128,
}).then((session) => {
    return session.ask('The project code is Orion.')
        .then(() => session.chat('What is the project code?'))
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

- **[ options = `{}` ]** { [AiCatalogOptions](#aicatalogoptions) | [null](dataTypes#null) } - 插件目录选项
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [AiTargetCatalog](#aitargetcatalog)

读取一个 AI Provider 插件公开的完整目标目录. 不传选项或传入 `null` 时选择官方 3-Stone AI 插件. 此方法只读取目录, 不创建生成会话, 也不接受 `target` 或生成控制选项.

目录同时描述本地模型和插件管理的在线服务. `defaultTarget` 是插件声明的默认目标 ID; 每个 `targets` 元素的完整 `id` 均可传给 [AiOptions](#aioptions) 的 `target`.

```js
ai.catalog().then((catalog) => {
    console.log(catalog.generation, catalog.defaultTarget);
    catalog.targets.forEach((target) => {
        console.log(target.id, target.displayName, target.locality);
        console.log(target.configured, target.available);
        console.log(target.backendProfiles);
    });
});
```

## 请求输入

### AiMessage

- **role** { `'system'` | `'user'` | `'assistant'` } - 消息角色
- **content** { [string](dataTypes#string) } - 非空纯文本内容

消息对象不能包含其他字段. 消息数组必须非空并以 `user` 消息结束. 消息顺序会原样传给目标.

### AiRequest

- **messages** { [AiMessage](#aimessage)[[]](dataTypes#array) } - 非空且以 `user` 结束的消息数组

AiRequest 是至少包含 `messages` 属性的可进行 JSON 序列化对象. `messages` 之外的属性按内联 [AiOptions](#aioptions) 处理. 同时传入第二个 `options` 参数时, 第二个参数中的同名属性覆盖内联选项.

以下输入会被转换为消息数组:

- 字符串转换为一条 `user` 消息.
- 单个 `user` 消息对象转换为单元素消息数组.
- 消息数组保持原顺序.
- 包含 `messages` 的对象使用其 `messages` 属性.

输入必须可由 `JSON.stringify` 序列化. 当前公开接口不接受工具定义或工具消息, 因此完成响应中的 `toolCalls` 固定为空数组.

### AiOptions

- **[ plugin ]** { [AiPluginSelector](#aipluginselector) } - 插件选择器
- **[ target ]** { [string](dataTypes#string) | [null](dataTypes#null) } - [AiTarget](#aitarget) 的完整 `id`
- **[ timeout = `120000` ]** { [number](dataTypes#number) | [null](dataTypes#null) } - 整次请求的绝对超时, 单位为毫秒
- **[ temperature ]** { [number](dataTypes#number) | [null](dataTypes#null) } - 非负有限采样温度
- **[ topK ]** { [number](dataTypes#number) | [null](dataTypes#null) } - 正整数候选 token 数
- **[ topP ]** { [number](dataTypes#number) | [null](dataTypes#null) } - `0..1` 范围内的有限核采样概率
- **[ maxTokens ]** { [number](dataTypes#number) | [null](dataTypes#null) } - `1..2147483647` 范围内的最大输出 token 数
- **[ backend ]** { `'cpu'` | `'gpu'` | `'npu'` | [null](dataTypes#null) } - 显式 backend profile
- **[ reasoning = `false` ]** { [boolean](dataTypes#boolean) | [null](dataTypes#null) } - 是否请求推理输出
- **[ structuredJson = `false` ]** { [boolean](dataTypes#boolean) | [null](dataTypes#null) } - 是否启用原生 JSON Schema 约束解码
- **[ responseSchema ]** { [Object](dataTypes#object) | [null](dataTypes#null) } - JSON Schema 对象; 提供时会隐式启用结构化输出

省略 `plugin` 和 `target` 时选择官方 3-Stone AI 插件声明的默认目标. 只提供 `target` 时在官方插件中精确选择该目标. 只提供 `plugin` 时选择该插件声明的默认目标. 同时提供时, `target` 必须存在于所选插件的 [AiTargetCatalog](#aitargetcatalog) 中.

目标 ID 是形如 `local:...` 或 `profile:...` 的稳定字符串. 必须完整传递, 不能从显示名称或模型名称推测. 目标不存在, 未配置, 不可用或能力不匹配时请求失败, 不会改选其他目标.

`timeout` 必须是 `1000..600000` 范围内的整数. `null` 与省略等价. 所有生成方法与目录读取的默认值均为 `120000` 毫秒. 选项只接受本节列出的规范属性名, 其他属性会使请求以 `INVALID_REQUEST` 失败.

`reasoning: true` 要求目标目录包含 `reasoning` 能力. 推理文本通过 `response.reasoning` 或流式块的 `reasoning` 属性返回. 不支持该能力的目标会以 `TARGET_CAPABILITY_MISMATCH` 失败.

`responseSchema` 必须是 JSON 对象, UTF-8 序列化后不能超过 64 KiB. 单独提供 `responseSchema` 等价于同时启用 `structuredJson`. 启用 `structuredJson` 但省略 schema 时使用 `{ "type": "object" }`; `structuredJson: false` 不能与非空 `responseSchema` 同时使用. 目标必须同时公开 `structured-json` 能力和 `response-json-schema` 控制.

`backend` 省略或为 `null` 时由目标使用默认 backend. 显式指定时, 目标必须公开 `backend-profile` 控制, 且 [AiTarget](#aitarget) 的 `backendProfiles` 中必须包含可用的对应项. 不可用的 profile 会以 `BACKEND_UNAVAILABLE` 失败. 在线目标通常不公开 backend profile.

官方插件的 LiteRT-LM 本地目标可公开 CPU, GPU 和 NPU. GPU 只有在 ABI 和 OpenCL 运行时前置条件满足时可用. NPU 当前固定为 `unavailable`, 并以 `npu-runtime-not-packaged` 表示插件未打包所需运行时. 在线目标的 `backendProfiles` 为空数组.

结构化模式使用插件原生约束解码并按严格 JSON 验证完成结果. [ai](#ai) 和 [ask](#m-ask) 仍兑现 JSON 文本字符串, [chat](#m-chat) 及流式 `done` 事件在 `response.text` 中提供完整 JSON 文本. `delta` 和 `chunk` 可能尚未构成完整 JSON, 只能在完成后解析.

插件报告的 `durationMillis` 只覆盖生成调用, 不包含宿主发现, 绑定, 目录读取或回调分发时间. [ai.stream](#m-stream) 会在完成前发出累计 `usage` 事件, `done` 响应中也包含同一最终用量.

### AiSessionOptions

AiSessionOptions 包含 [AiOptions](#aioptions) 的全部属性, 并增加以下属性:

- **[ system ]** { [string](dataTypes#string) } - 仅在创建 Conversation 时发送的非空系统指令

目标, 采样参数, 输出上限, 超时, backend, 推理和结构化输出配置在会话创建后不能按轮次修改. 目标还必须公开 `persistent-session` 能力.

会话轮次只接受一个非空字符串并将其作为 `user` 消息. `system` 只进入首轮上下文, 后续 Binder 请求不再次携带系统指令或既有消息.

同一会话一次只允许一个活动轮次. 并发轮次以 `BUSY` 失败, 但不会关闭正在运行的轮次. 正常完成后会话保持可用; 生成失败, 超时, 协议错误, Binder 失效, 输出字节上限终止或流式取消会关闭整个会话. 关闭后需要重新调用 [ai.session](#m-session).

### AiCatalogOptions

- **[ plugin ]** { [AiPluginSelector](#aipluginselector) } - 插件选择器
- **[ timeout = `120000` ]** { [number](dataTypes#number) | [null](dataTypes#null) } - 目录读取的绝对超时, 单位为毫秒

目录选项只接受 `plugin` 和 `timeout`. 返回目录已经包含目标配置状态, 可用性, 能力, 控制, 限制, HTTPS origins 和 backend 探测结果.

### AiPluginSelector

AiPluginSelector 接受以下三种形式:

- `true`: 选择官方 3-Stone AI 插件及其固定提供商 ID.
- [AiOfficialPluginSelection](#aiofficialpluginselection): 选择官方插件, 可显式固定 `providerId`.
- [AiPluginSelection](#aipluginselection): 通过精确 Android 服务组件选择插件, 并固定 `providerId`.

`false`, `null`, 字符串及包含未知字段的对象均不是有效选择器.

### AiOfficialPluginSelection

- **[ providerId = `'autojs6.three-stone-ai'` ]** { [string](dataTypes#string) | [null](dataTypes#null) } - 官方插件提供商 ID

此对象不能包含 `component`. 空对象 `{}` 与 `true` 等价. `providerId` 为 `null` 时使用官方默认值. 目标不属于插件选择器; 需要精确目标时另行传入完整 `target` ID.

### AiPluginSelection

- **component** { [AiPluginComponent](#aiplugincomponent) } - Android 服务组件
- **providerId** { [string](dataTypes#string) } - 插件声明的精确提供商 ID

`providerId` 必须匹配 `^[a-z0-9][a-z0-9._-]{0,127}$`. 宿主不会改选其他组件或提供商. 需要精确目标时另行传入完整 `target` ID.

### AiPluginComponent

- **packageName** { [string](dataTypes#string) } - 插件 APK 的精确 Android 包名
- **className** { [string](dataTypes#string) } - 插件 AI Provider 服务的精确类名

宿主仅绑定此处指定的组件, 不使用隐式服务选择.

### 结构化 JSON 示例

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
    console.log(JSON.parse(text));
});
```

### 精确目标路由示例

以下示例先读取官方插件目录, 再用完整目标 ID 发起带有消息历史的单次请求. 示例优先选择已配置且可用的在线目标; 没有在线目标时使用插件声明的默认目标.

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
        throw new Error('No usable AI target is available');
    }
    return ai.chat(messages, {
        target: selectedTarget.id,
        timeout: 30000,
        temperature: 0.7,
        topP: 0.9,
        maxTokens: 128,
    });
}).then((response) => {
    console.log(response.target.id, response.provider, response.model);
    console.log(response.text, response.finishReason);
    console.log(response.usage);
}).catch((error) => {
    console.error(error.route, error.code, error.message);
});
```

需要固定精确组件时使用完整选择器. 第三方 AI Provider 插件应替换包名, 类名和提供商 ID.

```js
let plugin = {
    component: {
        packageName: 'io.github.example.ai',
        className: 'io.github.example.ai.provider.ExampleAiProviderService',
    },
    providerId: 'example.ai-provider',
};

ai.catalog({ plugin: plugin }).then((catalog) => {
    if (!catalog.defaultTarget) {
        throw new Error('The plugin has no default target');
    }
    return ai.chat('Reply with OK', {
        plugin: plugin,
        target: catalog.defaultTarget,
    });
}).then((response) => {
    console.log(response.plugin, response.target.id, response.text);
});
```

## 返回对象

### AiResponse

- **text** { [string](dataTypes#string) } - 生成文本; 结构化模式下为完整 JSON 文本
- **reasoning** { [string](dataTypes#string) } - 推理文本; 未请求或不可用时为空字符串
- **toolCalls** { [Array](dataTypes#array) } - 空数组
- **usage** { [AiUsage](#aiusage) } - 最终用量
- **finishReason** { `'stop'` | `'length'` | `'tool_calls'` | `'content_filter'` | `'error'` | `'other'` } - 协议完成原因
- **message** { [null](dataTypes#null) } - 固定为 `null`
- **error** { [null](dataTypes#null) } - 固定为 `null`; 失败通过 Promise 拒绝或 `error` 事件报告
- **raw** { [null](dataTypes#null) } - 固定为 `null`
- **profile** { [AiTargetProfileReference](#aitargetprofilereference) | [null](dataTypes#null) } - 在线目标的插件管理档案引用; 本地目标为 `null`
- **target** { [AiTarget](#aitarget) } - 实际解析的完整目标元数据
- **plugin** { [AiPluginIdentity](#aipluginidentity) } - 实际绑定的插件身份
- **route** { `'plugin'` } - 插件路由标识
- **provider** { [string](dataTypes#string) } - 实际提供商 ID
- **model** { [string](dataTypes#string) } - 实际模型 ID

### AiStreamMetadata

- **route** { `'plugin'` } - 插件路由标识
- **provider** { [string](dataTypes#string) } - 实际提供商 ID
- **model** { [string](dataTypes#string) } - 实际模型 ID
- **target** { [AiTarget](#aitarget) } - 实际解析的完整目标元数据
- **profile** { [AiTargetProfileReference](#aitargetprofilereference) | [null](dataTypes#null) } - 在线目标的插件管理档案引用
- **plugin** { [AiPluginIdentity](#aipluginidentity) } - 实际绑定的插件身份

### AiStreamChunk

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
- **backendProfiles** { [AiBackendProfile](#aibackendprofile)[[]](dataTypes#array) } - backend profile 及当前设备可用性

能力 ID 当前包括 `streaming`, `reasoning`, `tools`, `structured-json`, `usage` 和 `persistent-session`. 控制 ID 当前包括 `maximum-output-tokens`, `temperature`, `top-k`, `top-p`, `response-json-schema` 和 `backend-profile`. 调用方应按字符串集合判断, 不应假设每个目标都支持全部能力或控制.

目录中的字节上限来自插件协议, 不等同于 token 上限. `configured: false` 的目标必然不可用; 此类目标仍保留在目录中, 便于 UI 和脚本引导用户完成配置.

### AiPluginIdentity

- **provider** { [string](dataTypes#string) } - 插件提供商 ID
- **component** { [AiPluginComponent](#aiplugincomponent) } - 实际绑定的 Android 服务组件

### AiTargetProfileReference

- **id** { [string](dataTypes#string) } - 插件管理的在线档案 ID
- **provider** { [string](dataTypes#string) } - 目标提供商 ID
- **model** { [string](dataTypes#string) } - 模型 ID
- **target** { [string](dataTypes#string) } - 完整目标 ID

### AiBackendProfile

- **id** { `'cpu'` | `'gpu'` | `'npu'` } - 可传给 `backend` 的稳定 profile ID
- **availability** { `'available'` | `'unavailable'` } - 当前插件进程和设备的运行时前置条件状态
- **[ unavailableReason ]** { `'abi-unsupported'` | `'opencl-library-unavailable'` | `'npu-runtime-not-packaged'` } - 仅在 `unavailable` 时存在的稳定原因

`available` 不是特定模型必然能够初始化的保证. 它用于在生成前排除 ABI, 动态链接命名空间和未打包运行时等确定性问题; 最终兼容性仍由目标在对应 backend 上的初始化结果决定. backend 探测结果会参与目录 generation.

### AiUsage

- **inputTokens** { [number](dataTypes#number) | [null](dataTypes#null) } - 输入 token 数
- **outputTokens** { [number](dataTypes#number) | [null](dataTypes#null) } - 输出 token 数
- **totalTokens** { [number](dataTypes#number) | [null](dataTypes#null) } - token 总数
- **reasoningTokens** { [number](dataTypes#number) | [null](dataTypes#null) } - 推理 token 数
- **cachedInputTokens** { [number](dataTypes#number) | [null](dataTypes#null) } - 缓存输入 token 数
- **durationMillis** { [number](dataTypes#number) | [null](dataTypes#null) } - 插件实测生成耗时
- **raw** { [null](dataTypes#null) } - 固定为 `null`

协议要求上述五个 token 计数至少有一个非空. 各字段均为插件报告值; 宿主不会根据字符数估算或改写.

## AiSession

AiSession 表示一个由 AI Provider 插件持有的持久 Conversation. 在线目标的档案和凭据仍由插件管理. 会话保持打开时会占用插件的会话准入和目标资源, 不再使用时应调用 [close](#m-aisessionclose).

### [p#] AiSession#provider

**`6.8.0`** **`READONLY`**

- { [string](dataTypes#string) }

会话固定的目标提供商 ID.

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
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [AiResponse](#airesponse)

在保留既有 Conversation 上下文的同时发起一个非流式轮次, 并返回完整响应.

### [m#] AiSession#stream(prompt)

**`6.8.0`** **`Async`**

- **prompt** { [string](dataTypes#string) } - 当前轮次的新用户提示词
- <ins>**returns**</ins> { [AiStream](#aistream) } - 当前轮次的流式请求对象

在保留既有 Conversation 上下文的同时发起一个流式轮次. 事件形状与普通流式请求相同.

调用返回对象的 `cancel()` 会关闭整个 AiSession, 因为取消后的插件 Conversation 不会继续复用. `error` 事件, 超时或协议错误也会使会话进入 `closed` 状态.

### [m#] AiSession#close()

**`6.8.0`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

关闭会话, 取消活动轮次并释放插件 Conversation, Binder 连接和目标资源. 重复调用不会产生额外效果.

## AiStream

- <ins>**extends**</ins> { [EventEmitter](eventEmitterType) }

AiStream 是单次流式 AI 请求的事件对象. 它继承 [EventEmitter](eventEmitterType) 的 `addListener`, `eventNames`, `listenerCount`, `listeners`, `prependListener`, `prependOnceListener`, `removeAllListeners`, `removeListener` 和 `setMaxListeners` 等方法.

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

取消当前请求并终止流. 重复调用不会再次取消. 成功接受取消操作后触发 `cancelled` 事件.

## AiStream 事件

事件监听器参数:

| 事件 | 监听器参数 | 说明 |
| --- | --- | --- |
| `open` | `metadata` { [AiStreamMetadata](#aistreammetadata) } | 请求已打开 |
| `delta` | `text` { [string](dataTypes#string) }, `chunk` { [AiStreamChunk](#aistreamchunk) } | 收到文本或推理增量 |
| `chunk` | `chunk` { [AiStreamChunk](#aistreamchunk) } | 收到规范化增量对象 |
| `usage` | `usage` { [AiUsage](#aiusage) } | 收到最终累计用量 |
| `done` | `response` { [AiResponse](#airesponse) } | 流正常完成 |
| `error` | `error` { [AiError](#aierror) } | 流失败 |
| `cancelled` | 无 | 流被调用方取消 |

`delta` 的 `text` 参数对应 `chunk.text`. 当事件只包含推理增量时, `text` 可能为空字符串, 此时使用 `chunk.reasoning`. `chunk.usage` 固定为 `null`; 最终累计用量通过 `usage` 事件发出, 并再次出现在 `done` 响应中.

### AiError

- **name** { [string](dataTypes#string) } - 异常类名称
- **message** { [string](dataTypes#string) } - 稳定且不含敏感配置的错误消息
- **route** { `'plugin'` } - 插件路由标识
- **code** { [AiErrorCode](#aierrorcode) } - 稳定错误码

Promise 拒绝和流式 `error` 事件使用同一错误形状.

### AiErrorCode

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
