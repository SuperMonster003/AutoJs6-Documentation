# Dialogs

> Stability: 2 - Stable

dialogs 模块提供了简单的对话框支持，可以通过对话框和用户进行交互。最简单的例子如下：
```
alert("您好");
```
这段代码会弹出一个消息提示框显示"您好"，并在用户点击"确定"后继续运行。稍微复杂一点的例子如下：
```
var clear = confirm("要清除所有缓存吗?");
if(clear){
    alert("清除成功!");
}
```
`confirm()`会弹出一个对话框并让用户选择"是"或"否"，如果选择"是"则返回true。

需要特别注意的是，对话框在ui模式下不能像通常那样使用，应该使用回调函数或者[Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)的形式。理解这一点可能稍有困难。举个例子:
```
"ui";
//回调形式
 confirm("要清除所有缓存吗?", function(clear){
     if(clear){
          alert("清除成功!");
     }
 });
//Promise形式
confirm("要清除所有缓存吗?")
    .then(clear => {
        if(clear){
          alert("清除成功!");
        }
    });
```

## dialogs.alert(title[, content, callback])
*  `title` {string} 对话框的标题。
*  `content` {string} 可选，对话框的内容。默认为空。
* `callback` {Function} 回调函数，可选。当用户点击确定时被调用,一般用于ui模式。

显示一个只包含“确定”按钮的提示对话框。直至用户点击确定脚本才继续运行。

该函数也可以作为全局函数使用。
```
alert("出现错误~", "出现未知错误，请联系脚本作者”);
```

在ui模式下该函数返回一个`Promise`。例如:
```
"ui";
alert("嘿嘿嘿").then(()=>{
    //当点击确定后会执行这里
});
```

## dialogs.confirm(title[, content, callback])
*  `title` {string} 对话框的标题。
*  `content` {string} 可选，对话框的内容。默认为空。
* `callback` {Function} 回调函数，可选。当用户点击确定时被调用,一般用于ui模式。

显示一个包含“确定”和“取消”按钮的提示对话框。如果用户点击“确定”则返回 `true` ，否则返回 `false` 。

该函数也可以作为全局函数使用。


在ui模式下该函数返回一个`Promise`。例如:
```
"ui";
confirm("确定吗").then(value=>{
    //当点击确定后会执行这里, value为true或false, 表示点击"确定"或"取消"
});
```

## dialogs.rawInput(title[, prefill, callback])
*  `title` {string} 对话框的标题。
*  `prefill` {string} 输入框的初始内容，可选，默认为空。
* `callback` {Function} 回调函数，可选。当用户点击确定时被调用,一般用于ui模式。

显示一个包含输入框的对话框，等待用户输入内容，并在用户点击确定时将输入的字符串返回。如果用户取消了输入，返回null。

该函数也可以作为全局函数使用。

```
var name = rawInput("请输入您的名字", "小明");
alert("您的名字是" + name);
```
在ui模式下该函数返回一个`Promise`。例如:
```
"ui";
rawInput("请输入您的名字", "小明").then(name => {
    alert("您的名字是" + name);
});
```
当然也可以使用回调函数，例如:
```
rawInput("请输入您的名字", "小明", name => {
     alert("您的名字是" + name);
});
```

## dialogs.input(title[, prefill, callback])
等效于 `eval(dialogs.rawInput(title, prefill, callback))`, 该函数和rawInput的区别在于，会把输入的字符串用eval计算一遍再返回，返回的可能不是字符串。

可以用该函数输入数字、数组等。例如：
```
var age = dialogs.input("请输入您的年龄", "18");
// new Date().getYear() + 1900 可获取当前年份
var year = new Date().getYear() + 1900 - age;
alert("您的出生年份是" + year);
```
在ui模式下该函数返回一个`Promise`。例如:
```
"ui";
dialogs.input("请输入您的年龄", "18").then(age => {
    var year = new Date().getYear() + 1900 - age;
    alert("您的出生年份是" + year);
});
```
## dialogs.prompt(title[, prefill, callback])
相当于 `dialogs.rawInput()`;

## dialogs.select(title, items, callback)
*  `title` {string} 对话框的标题。
*  `items` {Array} 对话框的选项列表，是一个字符串数组。
* `callback` {Function} 回调函数，可选。当用户点击确定时被调用,一般用于ui模式。

显示一个带有选项列表的对话框，等待用户选择，返回用户选择的选项索引(0 ~ item.length - 1)。如果用户取消了选择，返回-1。

```
var options = ["选项A", "选项B", "选项C", "选项D"]
var i = dialogs.select("请选择一个选项", options);
if(i >= 0){
    toast("您选择的是" + options[i]);
}else{
    toast("您取消了选择");
}
```
在ui模式下该函数返回一个`Promise`。例如:
```
"ui";
dialogs.select("请选择一个选项", ["选项A", "选项B", "选项C", "选项D"])
    .then(i => {
        toast(i);
    });
```

## dialogs.singleChoice(title, items[, index, callback])
*  `title` {string} 对话框的标题。
*  `items` {Array} 对话框的选项列表，是一个字符串数组。
*  `index` {number} 对话框的初始选项的位置，默认为0。
* `callback` {Function} 回调函数，可选。当用户点击确定时被调用,一般用于ui模式。

显示一个单选列表对话框，等待用户选择，返回用户选择的选项索引(0 ~ item.length - 1)。如果用户取消了选择，返回-1。

在ui模式下该函数返回一个`Promise`。

## dialogs.multiChoice(title, items[, indices, callback])
*  `title` {string} 对话框的标题。
*  `items` {Array} 对话框的选项列表，是一个字符串数组。
*  `indices` {Array} 选项列表中初始选中的项目索引的数组，默认为空数组。
* `callback` {Function} 回调函数，可选。当用户点击确定时被调用,一般用于ui模式。

显示一个多选列表对话框，等待用户选择，返回用户选择的选项索引的数组。如果用户取消了选择，返回`[]`。

在ui模式下该函数返回一个`Promise`。