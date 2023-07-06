# InjectableWebClient

[android.webkit.WebViewClient](https://developer.android.com/reference/android/webkit/WebViewClient) 的子类.

常见相关方法或属性:

- [web.newInjectableWebClient](web#m-newinjectablewebclient)

> 注: 本章节仅列出 InjectableWebClient 独有的而不包含继承的属性及方法.

---

<p style="font: bold 2em sans-serif; color: #FF7043">InjectableWebClient</p>

---

## [m#] inject

### inject(script, callback?)

**`Overload [1-2]/2`**

- **script** { [string](dataTypes#string) } - 脚本
- **[ callback ]** { [(](dataTypes#function)value: [string](dataTypes#string)[)](dataTypes#function) [=>](dataTypes#function) [void](dataTypes#void) } - 脚本
- <ins>**returns**</ins> { [void](dataTypes#void) }

注入 `script` 参数提供的 JavaScript 脚本, `callback` 回调参数可用于获取脚本语句的执行结果.

```js
'ui';

let client = web.newInjectableWebClient();
client.inject('navigator.userAgent', value => console.log(value));

let webView = web.newInjectableWebView('www.github.com');
webView.setWebViewClient(client);
activity.setContentView(webView);
```

## [m#] injectAndWait

### injectAndWait(script)

**`Overload [1-2]/2`**

- **script** { [string](dataTypes#string) } - 脚本
- <ins>**returns**</ins> { [string](dataTypes#string) } - 脚本执行结果

注入 `script` 参数提供的 JavaScript 脚本, 等待脚本执行完毕, 返回执行结果.