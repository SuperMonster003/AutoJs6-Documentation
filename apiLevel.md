# 安卓 API 级别 (Android API Level)

API 级别 (API Level) 是对 Android 平台版本 (SDK Platforms) 提供的框架 API 修订版进行唯一标识的整数值 (SDK INT).

Android 平台提供一种框架 API, 应用可利用它与底层 Android 系统进行交互.
每个 Android 平台版本恰好支持一个 API 级别, 但隐含对所有早期 API 级别的支持.  
Android 平台初始版本提供的是 API 级别 1, 后续版本的 API 级别则依次增加.

下表列出了各 Android 平台版本所支持的 API 级别:

| API 级别 | 版本名称 (Version Name)        | 版本代号 (Version Code)    | 版本号 (Version Number) | 内部代号 (Internal Codename) | 发行日期         |
|:-------|:---------------------------|:-----------------------|:---------------------|:-------------------------|:-------------|
| 35 (?) | Android 15                 | VANILLA_ICE_CREAM      | 15                   | Vanilla Ice Cream        | Q3, 2024 (?) |
| 34     | Android 14                 | UPSIDE_DOWN_CAKE       | 14                   | Upside Down Cake         | Q3, 2023 (?) |
| 33     | Android 13                 | TIRAMISU               | 13                   | Tiramisu                 | Aug 15, 2022 |
| 32     | Android 12L                | S_V2                   | 12.1                 | Snow Cone v2             | Mar 7, 2022  |
| 31     | Android 12                 | S                      | 12                   | Snow Cone                | Oct 4, 2021  |
| 30     | Android 11                 | R                      | 11                   | Red Velvet Cake          | Sep 8, 2020  |
| 29     | Android 10                 | Q                      | 10                   | Quince Tart              | Sep 3, 2019  |
| 28     | Android Pie                | P                      | 9                    | Pistachio Ice Cream      | Aug 6, 2018  |
| 27     | Android Oreo               | O_MR1                  | 8.1                  | Oatmeal Cookie           | Dec 5, 2017  |
| 26     | Android Oreo               | O                      | 8.0                  | Oatmeal Cookie           | Aug 21, 2017 |
| 25     | Android Nougat             | N_MR1                  | 7.1-7.1.2            | New York Cheesecake      | Oct 4, 2016  |
| 24     | Android Nougat             | N                      | 7.0                  | New York Cheesecake      | Aug 22, 2016 |
| 23     | Android Marshmallow        | M                      | 6.0-6.0.1            | Macadamia Nut Cookie     | Oct 2, 2015  |
| 22     | Android Lollipop           | LOLLIPOP_MR1           | 5.1-5.1.1            | Lemon Meringue Pie       | Mar 2, 2015  |
| 21     | Android Lollipop           | LOLLIPOP               | 5.0-5.0.2            | Lemon Meringue Pie       | Nov 4, 2014  |
| 20     | Android KitKat             | KITKAT_WATCH           | 4.4W-4.4W.2          | Key Lime Pie             | Jun 25, 2014 |
| 19     | Android KitKat             | KITKAT                 | 4.4-4.4.4            | Key Lime Pie             | Oct 31, 2013 |
| 18     | Android Jelly Bean         | JELLY_BEAN_MR2         | 4.3-4.3.1            | Jelly Bean               | Jul 24, 2013 |
| 17     | Android Jelly Bean         | JELLY_BEAN_MR1         | 4.2-4.2.2            | Jelly Bean               | Nov 13, 2012 |
| 16     | Android Jelly Bean         | JELLY_BEAN             | 4.1-4.1.2            | Jelly Bean               | Jul 9, 2012  |
| 15     | Android Ice Cream Sandwich | ICE_CREAM_SANDWICH_MR1 | 4.0.3-4.0.4          | Ice Cream Sandwich       | Dec 16, 2011 |
| 14     | Android Ice Cream Sandwich | ICE_CREAM_SANDWICH     | 4.0-4.0.2            | Ice Cream Sandwich       | Oct 18, 2011 |
| 13     | Android Honeycomb          | HONEYCOMB_MR2          | 3.2-3.2.6            | Honeycomb                | Jul 15, 2011 |
| 12     | Android Honeycomb          | HONEYCOMB_MR1          | 3.1                  | Honeycomb                | May 10, 2011 |
| 11     | Android Honeycomb          | HONEYCOMB              | 3.0                  | Honeycomb                | Feb 22, 2011 |
| 10     | Android Gingerbread        | GINGERBREAD_MR1        | 2.3.3-2.3.7          | Gingerbread              | Feb 9, 2011  |
| 9      | Android Gingerbread        | GINGERBREAD            | 2.3-2.3.2            | Gingerbread              | Dec 6, 2010  |
| 8      | Android Froyo              | FROYO                  | 2.2-2.2.3            | Froyo                    | May 20, 2010 |
| 7      | Android Eclair             | ECLAIR_MR1             | 2.1                  | Eclair                   | Jan 11, 2010 |
| 6      | Android Eclair             | ECLAIR_0_1             | 2.0.1                | Eclair                   | Dec 3, 2009  |
| 5      | Android Eclair             | ECLAIR                 | 2.0                  | Eclair                   | Oct 27, 2009 |
| 4      | Android Donut              | DONUT                  | 1.6                  | Donut                    | Sep 15, 2009 |
| 3      | Android Cupcake            | CUPCAKE                | 1.5                  | Cupcake                  | Apr 27, 2009 |
| 2      | Android 1.1                | BASE_1_1               | 1.1                  | Petit Four               | Feb 9, 2009  |
| 1      | Android 1.0                | BASE                   | 1.0                  | -                        | Sep 23, 2008 |

文档通常使用以下格式之一表示 API 级别的信息:

- 30 (11) [R]
- API 30 (11) [R]
- Android API 30 (11) [R]

上述示例中,  
`30` 表示 `API 级别`,  
`11` 表示 `版本号 (Version Number)`,  
`R` 表示 `版本代号 (Version Code)`.

查询当前设备的 API 级别:

```js
console.log(device.sdkInt); /* e.g. 30 */
```

要求设备 API 级别不低于指定值:

```js
/* 在 API 级别低于 30 的设备上将抛出异常. */
runtime.requiresApi(30);
runtime.requiresApi(util.versionCodes.R); /* 效果同上. */
```

> 注: AutoJs6 安装及使用需满足的最低 API 级别为 24 (7.0) [N].

> 参阅: [Wikipedia (英)](https://en.wikipedia.org/wiki/Android_version_history) / [Wikipedia (中)](https://zh.wikipedia.org/wiki/Android%E7%89%88%E6%9C%AC%E5%88%97%E8%A1%A8)