# async/await 与 continuation

AutoJs6 的 Rhino 引擎支持 ECMAScript 的 async 函数, async 生成器与 `for await`, 全局 `Promise` 是 Rhino 内建的标准实现. 本章说明支持范围, 回调的运行时机, 以及 async/await 与 [续体 (Continuation)](continuation) 如何配合.

> 注: 本章内容需要 AutoJs6 6.8.0 及以上版本 (Rhino 引擎). Node.js, Bun 等其他运行时使用各自引擎的实现, 不适用本章的线程, 控制台提示与 `continuation` 说明.

## 语法支持范围

```js
async function codeOf(url) {
    let response = await http.getAsync(url);
    return response.statusCode;
}

const double = async (value) => (await value) * 2; /* async 箭头函数. */

class Store {
    async load() { return await double(21); } /* async 方法. */
    static async create() { return new Store(); } /* 静态 async 方法. */
    async *items() { yield 1; yield 2; } /* async 生成器方法. */
}

async function* countdown(from) { /* async 生成器. */
    while (from > 0) {
        yield from--;
    }
}

async function main() {
    for await (let value of countdown(3)) {
        console.log(value); /* 3, 2, 1. */
    }
    for await (let value of [Promise.resolve('a'), 'b']) {
        console.log(value); /* a, b. */
    }
    try {
        await Promise.reject(new Error('失败'));
    } catch (e) {
        console.log(e.message); /* 失败. */
    }
}

main();
```

- async 函数总是返回 Promise. 函数内抛出的错误使这个 Promise 拒绝.
- `await` 只在 async 函数体内是关键字. 脚本顶层不能写 `await`, 顶层等待见 [与 continuation 的关系](#与-continuation-的关系).
- `for await` 可以遍历有 `Symbol.asyncIterator` 方法的对象, 也可以遍历元素为 Promise 的普通可迭代对象.
- `await` 不是 Promise 的值时直接得到这个值. Java 的 `Future` 不是 Promise, `await future` 得到 `Future` 对象本身, 不会等待.

## Promise

全局 `Promise` 提供标准的 `then` / `catch` / `finally` 与 `Promise.resolve` / `reject` / `all` / `allSettled` / `race` / `any` / `withResolvers` / `try`. `http.getAsync` 等宿主方法返回的也是这种 Promise, 可以 `await`, `instanceof Promise` 为 `true`.

AutoJs6 另外保留两个方法:

| 方法 | 说明 |
|---|---|
| `promise.await()` | 挂起当前协程, 落定后恢复. 只能在协程可以挂起的位置调用, 见 [续体 (Continuation)](continuation) |
| `promise.wait()` | 阻塞当前线程直到落定, 返回结果或在调用处抛出拒绝原因. 不需要 `continuation` 特性. 等待期间当前线程继续运行微任务与到期的定时器回调 |

## 回调的运行时机

Promise 的回调与 `await` 之后的代码是微任务: 当前代码运行完, 调用栈清空之后立即运行, 排在下一个定时器回调之前.

```js
setTimeout(() => console.log('timeout'), 0);
Promise.resolve().then(() => console.log('then'));
(async () => {
    await null;
    console.log('await');
})();
console.log('sync');

/* 依次打印 sync, then, await, timeout. */
```

> 注: 6.8.0 之前 Promise 的回调经 `setImmediate` 排队, 与定时器回调交错运行. 依赖旧顺序的脚本 (例如用 `setTimeout(fn, 0)` 抢在 `then` 之前) 需要调整.

## 与 continuation 的关系

两种写法并存, 按等待发生的位置选用: 脚本顶层同步等待用 `continuation`, 函数内用 async/await.

| 位置 | 写法 |
|---|---|
| 脚本顶层 | `continuation.await(promise)` 或 `promise.await()`, 需要 `continuation` 特性 |
| 函数内 | 写成 async 函数, 用 `await` |
| Promise 回调内 | 写成 async 函数, 或继续用 `then` |

两者可以配合. `continuation.await` 能等待 async 函数返回的 Promise, async 函数内可以 `await` 宿主方法返回的 Promise:

```js
/* project.json 的 useFeatures 含有 continuation. */

async function codeOf(url) {
    let response = await http.getAsync(url);
    return response.statusCode;
}

let code = continuation.await(codeOf('https://www.example.com/'));
console.log(code);
```

async 函数内不能挂起协程. 在 async 函数内调用 `continuation.await`, `promise.await()`, `continuation.delay` 等会报 TypeError, 错误信息为 "协程无法在此处挂起. async 函数内请使用 await 关键字, Promise 回调内请使用 then()". 这个错误可以用 `try` / `catch` 捕获, 没有捕获时按 [未捕获的拒绝](#未捕获的拒绝) 处理, 不会使脚本挂起.

```js
async function wrong(promise) {
    continuation.await(promise); /* TypeError. */
}

async function right(promise) {
    await promise;
}
```

## 线程

- async 函数在调用它的线程上开始, `await` 之后回到同一个线程, 包括 `threads.start` 创建的线程与 ui 模式的 UI 线程.
- `then` 回调运行在落定 Promise 的线程上. 落定 Promise 的线程不能运行回调时 (普通 Java 线程, 线程池与系统回调的线程), 回调转到脚本主线程运行.
- `http.getAsync` 等宿主方法的 Promise 在 UI 线程落定, `then` 回调因此运行在 UI 线程, 可以直接操作控件.
- 未落定的 Promise 不让线程继续运行. async 函数所在的线程结束后, `await` 之后的代码在落定 Promise 的线程上运行, 这个函数不再回到原来的线程. 要留在 `threads.start` 的线程上时, 用定时器让线程保持运行.

## 未捕获的拒绝

Promise 拒绝后, 到本轮回调运行完仍没有处理函数时, 控制台输出一条 error, 内容为 "未捕获的 Promise 拒绝: " 加上拒绝原因与调用栈, 脚本继续运行.

```js
function boom() {
    throw new RangeError('失败');
}

Promise.resolve().then(boom); /* 控制台输出一次 error. */
setTimeout(() => console.log('脚本继续运行'), 100);
```

同一轮内用 `catch` 或 `await` 接住的拒绝不会输出.

## 脚本何时结束

脚本在没有待运行的定时器, 事件监听与宿主异步任务时结束. 未落定的 Promise 不让脚本继续运行, 这与 Node.js 相同. `http.getAsync` 这样的宿主方法运行期间脚本不会结束, 等待 `new Promise` 时要有定时器或事件监听在运行.

脚本这样结束时, 如果还有 async 函数在等待, 控制台输出一条 warn, 内容是等待中的函数个数与第一个的位置. 调用 `exit()` 或手动停止脚本时不输出.

```js
async function waiting() {
    await new Promise(() => {}); /* 这个 Promise 不会落定. */
}

waiting();

/* 脚本已结束, 仍有 1 个 async 函数在等待 Promise, 第一个位于 /sdcard/脚本/main.js:2. 未落定的 Promise 不会让脚本继续运行 */
```

## 版本要求

async 函数, async 生成器与 `for await` 需要 AutoJs6 6.8.0 及以上版本的 Rhino 引擎, 较低版本解析脚本时报 SyntaxError. TypeScript 项目在 Rhino 上按 ES2018 输出, async 函数原样保留, 同样需要 6.8.0.
