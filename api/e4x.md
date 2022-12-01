# E4X

> 注: E4X __已弃用__.
>
> 尽管少数浏览器依然支持, 但随着件更新正逐步被废除, 应尽量避免使用.  
> AutoJs6 使用 Rhino 引擎, 因此依然保持对 E4X 的支持.
>
> 本章节仅用于技术概念的归档及溯源, 不建议用于脚本编写.

ECMAScript for XML (E4X) 是对 ECMAScript 的扩展, 增加对 XML 的内在支持.  
其目标是在访问 XML 文档时, 提供一种更直观且语法更简洁的的 DOM 接口, 成为处理 XML 文档的新方式.

```e4x
var sales = <sales vendor="John">
    <item type="peas" price="4" quantity="6"/>
    <item type="carrot" price="3" quantity="10"/>
    <item type="chips" price="5" quantity="3"/>
  </sales>;

alert( sales.item.(@type == "carrot").@quantity );
alert( sales.@vendor );
for each( var price in sales..@price ) {
  alert( price );
}
delete sales.item[0];
sales.item += <item type="oranges" price="4"/>;
sales.item.(@type == "oranges").@quantity = 4;
```

> 参阅: [Wikipedia (英)](https://en.wikipedia.org/wiki/ECMAScript_for_XML) / [Wikipedia (中)](https://zh.wikipedia.org/wiki/E4X)  
> 替代: [DOMParser](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMParser) / [DOMSerializer](https://www.npmjs.com/package/dom-serializer)