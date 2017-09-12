# Engines

> Stability: 2 - Stable

engines模块包含了一些与脚本引擎有关的函数，包括运行其他脚本，关闭脚本等。

## engines.execScript(name, script[, config])
* `name` {string} 要运行的脚本名称。这个名称和文件名称无关，只是在任务管理中显示的名称。
* `script` {string} 要运行的脚本内容。
* `config` \<Object\> 运行配置项
    * `delay` {number} 延迟执行的毫秒数，默认为0
    * `loopTimes` {number} 循环运行次数，默认为1
    * `interval` {number} 循环运行时两次运行之间的时间间隔，默认为0
    * `path` {Array} | {string} 指定脚本运行的目录。这个路径会用于require时寻找模块文件。

在新线程中运行脚本script。返回一个[ScriptExectuion](#engines_scriptexecution)对象。

## engines.execScriptFile(path[, config])
* `path` {string} 要运行的脚本路径。
* `config` \<Object\> 运行配置项
    * `delay` {number} 延迟执行的毫秒数，默认为0
    * `loopTimes` {number} 循环运行次数，默认为1
    * `interval` {number} 循环运行时两次运行之间的时间间隔，默认为0
    * `path` {Array} | {string} 指定脚本运行的目录。这个路径会用于require时寻找模块文件。

在新线程中运行脚本文件path。返回一个[ScriptExecution](#ScriptExecution)对象。

## engines.execAutoFile(path[, config])
* `path` {string} 要运行的录制文件路径。
* `config` \<Object\> 运行配置项
    * `delay` {number} 延迟执行的毫秒数，默认为0
    * `loopTimes` {number} 循环运行次数，默认为1
    * `interval` {number} 循环运行时两次运行之间的时间间隔，默认为0
    * `path` {Array} | {string} 指定脚本运行的目录。这个路径会用于require时寻找模块文件。

在新线程中运行录制文件path。返回一个[ScriptExecution](#ScriptExecution)对象。

## engines.stopAll()

停止所有正在运行的脚本。包括当前脚本自身。

## engines.stopAllAndToast()

停止所有正在运行的脚本并显示停止的脚本数量。包括当前脚本自身。

## engines.myEngine()

返回当前脚本的脚本引擎对象([ScriptEngine](#engines_scriptengine))

# ScriptExecution

执行脚本时返回的对象，可以通过他获取执行的引擎、配置、源码等。

## ScriptExecution.getEngine()

返回执行该脚本的脚本引擎对象([ScriptEngine](#engines_scriptengine))

## ScriptExecution.getConfig()

返回该脚本的运行配置([ScriptConfig](#engines_scriptconfig))

## ScriptExecution.getSource()

返回该脚本的源码对象([ScriptSource](#engines_scriptsource))

# ScriptEngine

## ScriptEngine.forceStop()

停止脚本引擎的执行。

## ScriptEngine.getTag(tagName)
* `tagName` {string} 名称

返回对应于tagName的附加在该脚本引擎上的额外信息。tagName包括：
* `source` 该脚本引擎当前正在执行的源码([ScriptSource](#engines_scriptsource))
* `execute_path` 该脚本引擎当前执行的路径

停止脚本引擎的执行。

# ScriptConfig
脚本执行时的配置。

## delay

延迟执行的毫秒数

## interval

循环运行时两次运行之间的时间间隔

## loopTimes

循环运行次数

## getPath()

返回一个字符串数组表示脚本运行时模块寻找的路径。

# ScriptSource
脚本执行时的源码对象。可以是字符串源码、文件源码等。

如果该源码是文件脚本，则可以通过`toString()`得到该文件的路径。

## getName()

返回该源码的名称。

## getEngineName()

返回执行该源码的脚本引擎的名称。


