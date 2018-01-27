# 基于控件的操作

本章节主要分为两部分，SimpleActionAutomator部分提供了简单操作模拟的函数；而选择器UiSelctor部分则提供了进阶的

# SimpleActionAutomator

> Stability: 2 - Stable

SimpleActionAutomator提供了一些模拟简单操作的函数，例如点击文字、模拟按键等。这些函数可以直接作为全局函数使用。

## click(text[, i])
* `text` {string} 要点击的文本
* `i` {number} 如果相同的文本在屏幕中出现多次，则i表示要点击第几个文本, i从0开始计算

返回是否点击成功。当屏幕中并未包含该文本，或者该文本所在区域不能点击时返回false，否则返回true。

该函数可以点击大部分包含文字的按钮。例如微信主界面下方的"微信", "联系人", "发现", "我"的按钮。  
通常与while同时使用以便点击按钮直至成功。例如:
```
while(!click("扫一扫"));
```
当不指定参数i时则会尝试点击屏幕上出现的所有文字text并返回是否全部点击成功。

i是从0开始计算的, 也就是, `click("啦啦啦", 0)`表示点击屏幕上第一个"啦啦啦", `click("啦啦啦", 1)`表示点击屏幕上第二个"啦啦啦"。

> 文本所在区域指的是，从文本处向其父视图寻找，直至发现一个可点击的部件为止。

## click(left, top, bottom, right)
* `left` {number} 要点击的长方形区域左边与屏幕左边的像素距离
* `top` {number} 要点击的长方形区域上边与屏幕上边的像素距离
* `bottom` {number} 要点击的长方形区域下边与屏幕下边的像素距离
* `right` {number} 要点击的长方形区域右边与屏幕右边的像素距离

**注意，该函数一般只用于录制的脚本中使用，在自己写的代码中使用该函数一般不要使用该函数。**

点击在指定区域的控件。当屏幕中并未包含与该区域严格匹配的区域，或者该区域不能点击时返回false，否则返回true。  

有些按钮或者部件是图标而不是文字（例如发送朋友圈的照相机图标以及QQ下方的消息、联系人、动态图标），这时不能通过`click(text, i)`来点击，可以通过描述图标所在的区域来点击。left, bottom, top, right描述的就是点击的区域。  

至于要定位点击的区域，可以在悬浮窗使用布局分析工具查看控件的bounds属性。

通过无障碍服务录制脚本会生成该语句。

## longClick(text[, i]))
* `text` {string} 要长按的文本
* `i` {number} 如果相同的文本在屏幕中出现多次，则i表示要长按第几个文本, i从0开始计算

返回是否点击成功。当屏幕中并未包含该文本，或者该文本所在区域不能点击时返回false，否则返回true。

当不指定参数i时则会尝试点击屏幕上出现的所有文字text并返回是否全部长按成功。

## scrollUp([i])
* `i` {number} 要滑动的控件序号

找到第i+1个可滑动控件上滑或**左滑**。返回是否操作成功。屏幕上没有可滑动的控件时返回false。

另外不加参数时`scrollUp()`会寻找面积最大的可滑动的控件上滑或左滑，例如微信消息列表等。  

参数为一个整数i时会找到第i + 1个可滑动控件滑动。例如`scrollUp(0)`为滑动第一个可滑动控件。


## scrollDown([i])
* `i` {number} 要滑动的控件序号

找到第i+1个可滑动控件下滑或**右滑**。返回是否操作成功。屏幕上没有可滑动的控件时返回false。

另外不加参数时`scrollUp()`会寻找面积最大的可滑动的控件下滑或右滑。  

参数为一个整数i时会找到第i + 1个可滑动控件滑动。例如`scrollUp(0)`为滑动第一个可滑动控件。

## setText([i, ]text) 
* i {number} 表示要输入的为第i + 1个输入框
* text {string} 要输入的文本

返回是否输入成功。当找不到对应的文本框时返回false。

不加参数i则会把所有输入框的文本都置为text。例如`setText("测试")`。

这里的输入文本的意思是，把输入框的文本置为text，而不是在原来的文本上追加。

## input([i, ]text) 
* i {number} 表示要输入的为第i + 1个输入框
* text {string} 要输入的文本

返回是否输入成功。当找不到对应的文本框时返回false。

不加参数i则会把所有输入框的文本追加内容text。例如`input("测试")`。

# UiSelector

选择器(UiSelector)是稍微复杂的自动操作脚本所必须。使用选择器的一般步骤是：
1. 用各种筛选条件找出想要的控件，如某个文本控件、列表控件、图片控件
2. 对找出的控件执行想要的操作，如点击、滑动、设置文字、长按

问题的关键在于如何找出想要的控件。对于文本控件一般通过他的文字来定位他，图片控件则通过id或者图片描述(desc)。选择器所做的就是提供这些筛选条件并给出筛选结果。

选择器提供了更强大的定位界面控件与对其进行操作的功能，可以用他们完成更多的自动操作和提取界面信息。  
选择器通过附加筛选条件，筛选出符合条件的控件或控件集合，之后可以对这些控件这些操作。  
可供选择的筛选条件包括：
* id
* text 文本
* desc 描述(Content-Description)
* className 类名
* packageName 包名
* bounds 在屏幕上的范围
* drawingOrder 绘制顺序
* 各种属性，主要包括：
    * clickable 可点击
    * longClickable 可长按
    * checkable 可勾选
    * checked 被勾选
    * scrollable 可滑动
    * selected 被选择
    * editable 可编辑
    * visibleToUser 可见
    * enabled 已启用

要对选择器所确定的筛选条件，对屏幕上的控件进行筛选，调用方法find(), findOne(), untilFind()。其中find(), untilFind()返回控件的集合，findOne()返回一个控件。untilFind和findOne函数会一直寻找直到屏幕上出现满足条件的控件为止。  
一个完整的选择器示例如下：
```
var emoj = id("name").packageName("com.tencent.mobileqq").clickable()
        .className("ImageView").drawingOrder(5).findOne();
emoj.click();
```
上述代码是找到QQ聊天界面下面的表情按钮(第5个按钮)并点击。也可以简化为:
```
id("name").packageName("com.tencent.mobileqq").clickable()
       .className("ImageView").click();
```

这段代码意思是，找出id为"name", 包名为"com.tentcent.mobileqq"，类名为ImageView的所有可点击控件，对他们执行点击动作。

最后的click()函数相当于untilFind().click()。也就是如果只需要在找到控件以后立即进行操作，只需要调用相应的操作函数，而不需要先调用find等函数等到控件再操作。  
要获取屏幕上的控件的信息(例如id, text, desc, bounds等)，可以开启悬浮窗，使用界面层次查看和界面范围查看。  

选择器部分内容如果有安卓开发经验会更容易掌握。

## id(resId)
* resId {string} 控件的id，以"包名:id/"开头，例如"com.tencent.mm:id/send_btn"。也可以不指定包名，这时会以当前正在运行的应用的包名来补全id。例如id("send_btn"),在QQ界面想当于id("com.tencent.mobileqq:id/send_btn")。  

附加id严格匹配筛选条件。

控件的id属性通常是可以用来确定控件的唯一标识，如果一个控件有id，那么使用id来找到他是最好的方法。要查看屏幕上的控件的id，可以开启悬浮窗并使用界面工具，点击相应控件即可查看。若查看到的控件id为null, 表示该控件没有id。另外，在列表中会出现多个控件的id相同的情况。例如微信的联系人列表，每个头像的id都是一样的。此时不能用id来唯一确定控件。

在QQ界面经常会出现多个id为"name"的控件，在微信上则每个版本的id都会变化。对于这些软件而言比较难用id定位控件。

## idContains(str)
* str {string} id要包含的字符串

附加控件id包含字符串str的筛选条件。

## idStartsWith(prefix)
* prefix {string} id前缀

附加id需要以prefix开头的筛选条件。

## idEndsWith(suffix)
* suffix {string} id后缀

附加id需要以suffix结束的筛选条件。

## idMatches(String)
* String {string} id要满足的正则表达式

附加id需要满足正则表达式。有关正则表达式，可以查看[菜鸟教程](http://www.runoob.com/Stringp/Stringp-example.html)。

这里的正则表达式是Java的正则表达式，不能直接使用JavaScript的正则表达式。
```
idMatches("[a-zA-Z]+")
```

## text(str)
* str {string} 控件文本

附加控件文本等于字符串str的筛选条件。

控件的text(文本)属性是控件上的显示的文字，例如微信左上角的"微信"文本。对于图片或者其他控件通常text属性为null。

## textContains(str)

* str {string} 要包含的字符串

附加控件文本需要以prefix开头的筛选条件。

## textStartsWith(prefix)

* prefix {string} 前缀

附加控件文本需要以prefix开头的筛选条件。

## textEndsWith(suffix)
* suffix {string} 后缀

附加控件文本需要以suffix结束的筛选条件。

## textMatches(str)
* String {string} 要满足的正则表达式

附加控件文本需要满足正则表达式的条件。

## desc(str)
* str {string} 控件描述

附加控件描述等于字符串str的筛选条件。

控件的desc(描述，全称为Content-Description)属性是对一个控件的描述，例如网易云音乐右上角的放大镜图标的描述为搜索。要查看一个控件的描述，同样地可以借助悬浮窗查看。

desc属性同样是定位控件的利器。

## descContains(str)

* str {string} 要包含的字符串

附加控件描述需要以prefix开头的筛选条件。

## descStartsWith(prefix)

* prefix {string} 前缀

附加控件描述需要以prefix开头的筛选条件。

## descEndsWith(suffix)
* suffix {string} 后缀

附加控件描述需要以suffix结束的筛选条件。

## descMatches(str)
* String {string} 要满足的正则表达式

附加控件描述需要满足正则表达式的条件。

## className(str)
* str {string} 控件类名

附加控件类名等于字符串str的筛选条件。

控件的className属性是一个控件的具体类型，例如图片控件通常为ImageView，文本控件通常为TextView, 输入框通常为EditText。(若一个控件是在android.widget包里的，那么android.widget可以省略。但除此之外的其他控件必须是类的全名，例如"com.stardust.theme.ThemeColorImageView")。

## classNameContains(str)

* str {string} 要包含的字符串

附加控件类名需要以prefix开头的筛选条件。

## classNameStartsWith(prefix)

* prefix {string} 前缀

附加控件类名需要以prefix开头的筛选条件。

## classNameEndsWith(suffix)
* suffix {string} 后缀

附加控件类名需要以suffix结束的筛选条件。

## classNameMatches(str)
* String {string} 要满足的正则表达式

附加控件类名需要满足正则表达式的条件。

## packageName(str)
* str {string} 包名

附加包名等于字符串str的筛选条件。

packageName属性也即控件所属的应用的包名(参见《shell命令:应用包名》)，通常用来保证当前运行的应用是想要的应用。

## packageNameContains(str)

* str {string} 要包含的字符串

附加包名需要以prefix开头的筛选条件。

## packageNameStartsWith(prefix)

* prefix {string} 前缀

附加包名需要以prefix开头的筛选条件。

## packageNameEndsWith(suffix)
* suffix {string} 后缀

附加包名需要以suffix结束的筛选条件。

## packageNameMatches(str)
* String {string} 要满足的正则表达式

附加包名需要满足正则表达式的条件。

## bounds(l, t, r, b)
* l, t, r, b 用来定位控件在屏幕上的范围的四个整数

## boundsInside(l, t, r, b)

## boundsContains(l, t, r, b)

## drawingOrder(order)
* order {number} 控件在父视图中的绘制顺序，在一些

## checkable([b = true])
* b {Boolean} 表示控件是否可勾选, 默认为true

附加控件是否可勾选的条件。可勾选指的是，例如QQ和微信发送图片时图片的勾选。

## selected([b = true])
* b {Boolean} 表示控件是否被选中，默认为true

附加控件是否被选中的条件。被选中指的是，例如QQ聊天界面点击下方的表情按钮时，会出现自己收藏的表情，这时表情按钮便处于选中状态。

## clickable([b = true])
* b {Boolean} 表示控件是否可点击, 默认为true

附加控件是否可点击的条件。但并非所有clickable为false的控件都真的不能点击，这取决于控件的实现。因而要确定一个控件的clickable属性，可以开启悬浮窗工具。

## longClickable([b = true])
* b {Boolean} 表示控件是否可长按, 默认为true

附加控件是否可长按的条件。

## enabled([b = true])
* b {Boolean} 表示控件是否已启用, 默认为true

附加控件是否已启用的条件。大多数控件都是启用的状态，处于“禁用”状态通常是灰色并且不可点击。

## scrollable([b = true])
* b {Boolean} 表示控件是否可滑动, 默认为true

附加控件是否可滑动的条件。

## editable([b = true])
* b {Boolean} 表示控件是否可编辑, 默认为true

附加控件是否可编辑的条件。一般来说可编辑的控件为输入框(EditText)。

## contentInvalid([b = true])
* b {Boolean} 表示控件是否是contentInvalid, 默认为true

我也不知道是什么，下次再补充吧。

## contextClickable([b = true])
* b {Boolean} 表示控件是否是contextClickable, 默认为true

我也不知道是什么，下次再补充吧。

## multiLine([b = true])
* b {Boolean} 表示文本或输入框控件是否是多行显示的, 默认为true

附加控件是否文本或输入框控件是否是多行显示的条件。

## findOne()
根据当前的选择器所确定的筛选条件，对屏幕上的控件进行搜索，直到屏幕上出现满足条件的一个控件为止，并返回该控件。如果找不到控件，当屏幕内容发生变化时会重新寻找，直至找到。参见[控件](#控件)。

## find()
根据当前的选择器所确定的筛选条件，对屏幕上的控件进行搜索，找到所有满足条件的控件集合并返回。这个搜索只进行一次，并不保证一直会找到，因而会出现返回的控件集合为空的情况。参见[控件集合](#控件集合)。

可以通过empty()或nonEmpty()函数判断找到的是否为空。例如：
```
var c = className("AbsListView").find();
if(c.empty()){
    toast("找到啦");
}else{
    toast("没找到╭(╯^╰)╮");
}
```

## untilFind()
根据当前的选择器所确定的筛选条件，对屏幕上的控件进行搜索，直到找到至少一个满足条件的控件为止，并返回所有满足条件的控件集合。参见[控件集合](#控件集合)。

## exists()
判断屏幕上是否存在控件符合选择器所确定的条件。例如要判断某个文本出现就执行某个动作，可以用：
```
if(text("嘿嘿嘿").exists()){
    //嘿嘿嘿
}
```

## waitFor()
等待屏幕上出现符合条件的控件。
```
text("嘿嘿嘿").waitFor();
```

## click()
找到所有符合条件的控件并点击。相当于untilFind().click()。参见[click](#UiCollection.click())。

## longClick()
找到所有符合条件的控件并长按。相当于untilFind().longClick()。参见[longClick](#UiCollection.longClick())。

## copy()
找到所有符合条件的控件并复制其内容，只对文本框或输入框控件有文字选中时有效。相当于untilFind().copy()。参见[copy](#UiCollection.copy())。

## paste()
找到所有符合条件的控件并粘贴，只对输入框控件有效。相当于untilFind().paste()。参见[paste](#UiCollection.paste())。

## select()
找到所有符合条件的控件并选中。相当于untilFind().select()。参见[select](#UiCollection.select())。

## cut()
找到所有符合条件的控件并剪切其内容，只对文本框或输入框控件有文字选中时有效。相当于untilFind().cut()。参见[cut](#UiCollection.cut())。

## collapse()
找到所有符合条件的控件并折叠。相当于untilFind().collapse()。参见[collapse](#UiCollection.collapse())。

## expand()
找到所有符合条件的控件并展开。相当于untilFind().expand()。参见[expand](#UiCollection.expand())。

## show()
找到所有符合条件的控件并使其出现在屏幕上。相当于untilFind().show()。参见[show](#UiCollection.show())。

## scrollForward()
找到所有符合条件的控件并向前滑。相当于untilFind().scrollForward()。参见[scrollForward](#UiCollection.scrollForward())。  
向前滑指的是，对于左右滑动的控件向右滑，上下滑动的控件向下滑。

## scrollBackward()
找到所有符合条件的控件并向后滑。相当于untilFind().scrollBackward()。参见[scrollBackward](#UiCollection.scrollBackward())。  
向后滑指的是，对于左右滑动的控件向左滑，上下滑动的控件向上滑。

## scrollUp()
找到所有符合条件的控件并向上滑。相当于untilFind().scrollUp()。参见[scrollUp](#UiCollection.scrollUp())。

## scrollDown()
找到所有符合条件的控件并向下滑。相当于untilFind().scrollDown()。参见[scrollDown](#UiCollection.scrollDown())。

## scrollLeft()
找到所有符合条件的控件并向左滑。相当于untilFind().scrollLeft()。参见[scrollLeft](#UiCollection.scrollLeft())。

## scrollRight()
找到所有符合条件的控件并向右滑。相当于untilFind().scrollRight()。参见[scrollRight](#UiCollection.scrollRight())。

## contextClick()

文档缺失

## setSelection(start, end)
* start {number} 文字选中开始位置
* end {number} 文字选中结束位置

找到所有符合条件的控件并设置文字选中区域，只对文本控件和输入框有效。相当于untilFind().setSelection()。参见[setSelection](#UiCollection.setSelection)。

## setText(text)
* text {string} 要设置的文本
找到所有符合条件的控件并设置文字，只对输入框有效。相当于untilFind().setText()。参见[setText](#UiCollection.setText)。

# UiCollection
UiCollection, 控件集合, 通过选择器的find(), untilFind()方法返回的对象。可以对其进行操作或者获取其信息。

## UiCollection.size()
返回集合中的控件数。

## UiCollection.get(i)
* i {number} 索引

返回集合中第i+1个控件(UiObject)。

## UiCollection.each(func)
* func \<Function\> 遍历函数

遍历集合。例如：
```
var c = clickable();
c.each(function(o){
    log(o.text());
});
```

## empty()
返回控件集合是否为空。

## nonEmpty()
返回控件集合是否非空。

## UiCollection.filter(filter)
* filter \<Function\> 过滤函数。参数为UiObject，返回值为Boolean。

过滤出控件集合中符合条件的子控件。例如要过滤出所有子控件数目为1的控件为：
```
var newCollection = collection.filter(function(obj){
    return obj.childCount() == 1;
});
```

## UiCollection.find(selector)
* selector \<UiSelector\> 选择器

根据selector所确定的条件在该控件集合的控件和**子控件**找到所有符合条件的控件并返回控件集合。

注意这会递归地遍历控件集合里所有的控件以及他们的子控件。和filter函数不同。

例如：
```
var names = id("name");
var clickableNames = names.find(clickable());
```

## UiCollection.findOne(selector)
* selector \<UiSelector\> 选择器

根据selector所确定的条件在该控件集合中找到一个符合条件的控件并返回控件。若找不到则返回null。

## UiCollection.click()
点击集合中所有控件，并返回是否全部点击成功。

## UiCollection.longClick()
长按集合中所有控件，并返回是否全部操作成功。

## UiCollection.copy()
对集合中所有控件执行复制操作，并返回是否全部操作成功。

## UiCollection.paste()
对集合中所有控件执行粘贴操作，并返回是否全部操作成功。

## UiCollection.select()
对集合中所有控件执行选中操作，并返回是否全部操作成功。

## UiCollection.cut()
对集合中所有控件执行剪切操作，并返回是否全部操作成功。

## UiCollection.collapse()
对集合中所有控件执行折叠操作，并返回是否全部操作成功。

## UiCollection.expand()
对集合中所有控件执行展开操作，并返回是否全部操作成功。

## UiCollection.show()
对集合中所有控件执行显示操作，并返回是否全部操作成功。

## UiCollection.scrollForward()
对集合中所有控件执行向前滑的操作，并返回是否全部操作成功。

## UiCollection.scrollBackward()
对集合中所有控件执行向后滑的操作，并返回是否全部操作成功。

## UiCollection.scrollUp()
对集合中所有控件执行向上滑的操作，并返回是否全部操作成功。

## UiCollection.scrollDown()
对集合中所有控件执行向下滑的操作，并返回是否全部操作成功。

## UiCollection.scrollLeft()
对集合中所有控件执行向左滑的操作，并返回是否全部操作成功。

## UiCollection.scrollRight()
对集合中所有控件执行向右滑的操作，并返回是否全部操作成功。

## UiCollection.contextClick()

## UiCollection.setSelection(start, end)
* start {number} 文字选中开始位置
* end {number} 文字选中结束位置

对集合中所有控件设置文字选中区域，并返回是否全部操作成功。

## UiCollection.setText(text)
* text {string} 要设置的文本
对集合中所有控件设置文本，并返回是否全部操作成功。

# UiObject

控件, 选择器的findOne方法返回的对象。和UiCollection有相似的方法，不再赘述。除此之外还有以下方法。

## child(i)
* i {number} 子控件索引

返回第i+1个子控件(UiObject)。

## parent()
返回父控件(UiObject)。

## children()
返回该控件的所有子控件组成的控件集合。

## childCount()
返回子控件数目。

## bounds()
返回控件在屏幕上的范围，其值是一个[Rect]对象。

## boundsInParent()
返回控件在父控件中的范围，其值是一个[Rect]对象。

## drawingOrder()
返回控件的绘制次序。

## id()
返回控件的id，可能为null。

## text()
返回控件的文本，如果控件没有文本，返回""。

## findByText(text)
* text {string} 文本

根据文本text在子控件中递归地寻找并返回文本或描述(desc)**包含**这段文本text的控件，返回它们组成的集合。。

## find(selector)
* selector \<UiSelector\> 选择器

根据选择器selector在子控件中递归地寻找符合条件的控件，返回它们组成的集合。

## findOne

## find(selector)
* selector \<UiSelector\> 选择器

根据选择器selector在子控件中递归地寻找一个符合条件的控件。找不到则返回null。

# Rect

UiObject.bounds(), UiObject.boundsInParent()返回的对象。表示一个长方形。

## Rect.left
长方形左边界的x坐标、

## Rect.right
长方形左边界的x坐标、

## Rect.top
长方形上边界的y坐标、

## Rect.bottom
长方形下边界的y坐标、

## Rect.centerX()
长方形中点x坐标。

## Rect.centerY()
长方形中点y坐标。

## Rect.width()
长方形宽度。通常可以作为控件宽度。

## Rect.height()
长方形高度。通常可以作为控件高度。

## Rect.contains(r)
* r \<Rect\> 

返回是否包含另一个长方形r。

## Rect.intersect(r)
* r \<Rect\> 

返回是否和另一个长方形相交。

