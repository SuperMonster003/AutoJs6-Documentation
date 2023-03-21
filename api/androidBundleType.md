# AndroidBundle

[android.os.Bundle](https://developer.android.com/reference/android/os/Bundle) 别名.

Bundle 表示一个会被打包成捆的容器, 容器内可存储 `键值对 (Key-Value Pair)` 形式的数据.

```js
let bundleA = new android.os.Bundle();
bundleA.putInt("num_key", 23);
console.log(bundleA.getInt("num_key") === 23); // true

let bundleB = new android.os.Bundle();
let arrList = new java.util.ArrayList(2);
arrList.add("A");
arrList.add("B");
bundleB.putStringArrayList("arr_list_key", arrList);
console.log(bundleB.getStringArrayList("arr_list_key").get(0) === "A"); // true
console.log(bundleB.getStringArrayList("arr_list_key").get(1) === "B"); // true
```