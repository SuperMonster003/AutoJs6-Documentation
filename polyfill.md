# 代码填泥 (Polyfill)

## 定义

代码填泥, 又称 [ 填泥 / 腻子 / 泥子 ], 是一个完整的代码块, 用于为不支持原生 ECMAScript 新功能的环境提供功能支持.  
例如 Polyfill 可以让 AutoJs6 模拟 Array 原型上的 [at](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/at) 等新增方法.

之所以被称为填泥, 是因为它主要用于 "抹平" 不同环境的功能支持差异.  
换句话说, 它是当前环境中某个标准 API 缺失后的手动实现.  

> 参阅: [MDN](https://developer.mozilla.org/zh-CN/docs/Glossary/Polyfill)

## AutoJs6 实现

截至 2022 年 10 月, AutoJs6 实现了以下代码填泥:

- [Array.prototype.at](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/at)
- [Array.prototype.flat](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/flat)
- ~~[Object.getOwnPropertyDescriptors](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptors)~~ (Rhino 1.7.15-SNAPSHOT 已实现)

## 区别于 Shim (代码垫片)

Polyfill 与 Shim (代码垫片) 不同, Shim 针对的是环境, Polyfill 针对的是API.  

Shim 作为 "垫片", 主要用于为旧环境提供 API 或提供新功能.  
在使用 Shim 时, 通常不会在意旧环境是否已存在某 API, 它会直接改变或重新定义某些全局对象, 以实现在不同环境下功能的完整性和统一性.

Polyfill 是腻子, 用于抹平不同环境下的 API 差异, 它会判断旧环境是否已经存在 API, 不存在时才会添加新API.

> 参阅: [掘金](https://juejin.cn/post/6844904050882772999) / [StackOverflow](https://stackoverflow.com/questions/6599815/what-is-the-difference-between-a-shim-and-a-polyfill)