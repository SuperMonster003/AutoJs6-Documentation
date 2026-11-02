# ImGui 对话框 Promise (ImguiDialogPromise)

ImguiDialogPromise 是 [imgui.alert](imgui#m-alert), [confirm](imgui#m-confirm), [singleChoice](imgui#m-singlechoice), [multiChoice](imgui#m-multichoice) 与 [ImguiSession](imguiSessionType) 同名方法的返回值. 它是普通的 Promise, 另有下列成员. 结果在关闭对话框的那一帧内, 在脚本线程上解决. 类型声明中的名称是 `ImGui.DialogPromise`.

<p style="font: bold 2em sans-serif; color: #FF7043">ImguiDialogPromise</p>

## [p#] controller

**`READONLY`**

- { [ImguiDialog](imguiDialogType) }

对话框 [ImguiDialog](imguiDialogType).

## [m#] cancel

### promise.cancel()

- <ins>**returns**</ins> { [ImguiDialogPromise](imguiDialogPromiseType) }

以取消值关闭对话框.

## [m#] accept

### promise.accept()

- <ins>**returns**</ins> { [ImguiDialogPromise](imguiDialogPromiseType) }

与确定按钮一样关闭对话框.
