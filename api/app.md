# App

app模块提供一系列函数，用于与其他应用的交互。例如打开文件、拍照、发送邮件等。

同时提供了方便的基础函数startActivity和sendBroadcast，用他们可完成app模块没有内置的和其他应用的交互。

## app.viewFile(path)
* path {string} 文件路径

用其他应用查看文件。

## app.editFile(path)
* path {string} 文件路径

用其他应用编辑文件。

## app.uninstall(packageName)
* packageName {string} 应用包名

卸载应用。

## app.openUrl(url)
* url {string} 网站的Url

用浏览器打开网站url。

## app.takePhoto(path)
* `path` {string} 照片保存路径

调用相机应用拍照，完成后保存到路径path。

## app.sendEmail(options)
*  `options` {Object} 发送邮件的参数。包括:
  * email {string} | {Array} 收件人的邮件地址。如果有多个收件人，则用字符串数组表示
  * cc {string} | {Array} 抄送收件人的邮件地址。如果有多个抄送收件人，则用字符串数组表示
  * bcc {string} | {Array} 密送收件人的邮件地址。如果有多个密送收件人，则用字符串数组表示
  * subject {string}  邮件主题(标题)
  * text {string} 邮件正文
  * attachment {string} | {Array} 附件的路径。如果有多个附件，则用字符串数组表示

根据选项options调用邮箱应用发送邮件。这些选项均是可选的。

## app.intent(intent)
* intent {Object} 一个表示Intent对象，其属性可以包括：
    * action {string} 这个Intent的Action，比如"android.intent.action.SEND"
    * type {string} 这个Intent的MimeType，比如"text/plain"
    * data {string} 这个Intent的Data(Uri)，可以是文件路径或者Url等。
    * category \<Array\> 这个Intent的Category的字符串数组。
    * packageName {string} 目标包名
    * className {string} 目标Activity或Service等组件的名称
    * extras {Object} 以键值对构成的这个Intent的Extras。

返回用intent对象构造的android.content.Intent对象。

例如：
```
var i = app.intent({
    action: "android.intent.action.VIEW",
    type: "text/plain",
    data: "file:///sdcard/1.txt",
});
```

如果你看了一脸懵逼，请百度[安卓Intent](https://www.baidu.com/s?wd=android%20Intent)。

## app.startActivity(intent)
* intent {Object} 与app.intent函数的参数一样的intent对象。

相当于context.startActivity(intent)。


## app.sendBroadcast(intent)
* intent {Object} 与app.intent函数的参数一样的intent对象。

相当于context.sendBroadcast(intent)。

