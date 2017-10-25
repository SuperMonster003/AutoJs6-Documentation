# Dialogs

> Stability: 2 - Stable

dialogs 模块允许用户通过对话框与脚本进行交互。

## dialogs.rawInput(title[, default])
*  `title` {string} 对话框的标题。
*  `default` {string} 可选，对话框内输入框的初始内容。默认为 `""` 。

显示一个包含输入框的对话框。如果指定了 `default` ，那么对话框显示时输入框的内容就为该值。

该函数也可通过 `rawInput(title[, default])` 、 `prompt(title[, default])` 或者 `dialogs.prompt(title[, default])` 来调用。调用时脚本将阻塞直至对话框被关闭。如果用户输入内容并点击确定，函数将返回输入的内容；否则返回 `null` 。

## dialogs.input(title[, default])
等效于 `eval(dialogs.rawInput(title, default))` 

## dialogs.prompt(title[, default])
见 dialogs.rawInput

## dialogs.alert(title[, content])
*  `title` {string} 对话框的标题。
*  `content` {string} 可选，对话框的内容。默认为空。

显示一个只包含“确定”按钮的提示对话框。

该函数也可通过 `alert(title[, content])` 来调用。调用时脚本将阻塞直至对话框被关闭。该函数无返回值。

## dialogs.confirm(title[, content])
*  `title` {string} 对话框的标题。
*  `content` {string} 可选，对话框的内容。默认为空。

显示一个包含“确定”和“取消”按钮的提示对话框。

该函数也可通过 `confirm(title[, content])` 来调用。调用时脚本将阻塞直至对话框被关闭。如果用户点击“确定”则返回 `true` ，否则返回 `false` 。

## dialogs.select(title, items)
*  `title` {string} 对话框的标题。
*  `items` {Array} 对话框的选项列表，是一个字符串数组。

显示一个带有选项列表的对话框。

该函数也可通过 `dialogs.select(title, ...items)` 来调用。  
例如： `dialogs.select("标题", ["A", "B", "C"])` 可以用  `dialogs.select("标题", "A", "B", "C")` 替代。

调用时脚本将阻塞直至对话框被关闭。如果用户点击了对话框中的某个选项，该函数会返回该选项的位置（选中第一个选项返回0，第二个选项返回1，以此类推），否则返回-1。

## dialogs.singleChoice(title, items[, index])
*  `title` {string} 对话框的标题。
*  `items` {Array} 对话框的选项列表，是一个字符串数组。
*  `index` {number} 可选，对话框的默认选项的位置。默认为0。

显示一个带有单选框选项列表的对话框。

调用时脚本将阻塞直至对话框被关闭。如果用户选中了对话框中的某个选项并点击“确定”，该函数会返回该选项的位置（选中第一个选项返回0，第二个选项返回1，以此类推），否则返回-1。

## dialogs.multiChoice(title, items[, indexes])
*  `title` {string} 对话框的标题。
*  `items` {Array} 对话框的选项列表，是一个字符串数组。
*  `indexes` {Array} 可选，对话框的默认选项的位置数组。默认为空数组。

显示一个带有多选框选项列表的对话框。

调用时脚本将阻塞直至对话框被关闭。如果用户点击“确定”按钮，该函数会返回所有已选选项的位置组成的数组，否则返回空数组。