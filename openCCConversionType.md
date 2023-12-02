# OpenCCConversion

用于 [opencc](opencc) 模块的 "字符转换类型" 类型.

`OpenCCConversion` 为字符串, 作为参数使用时不区分大小写.

将繁体中文 "這裏" 转换为简体中文 "这里" 的简单示例:

```ts
opencc('這裏', 'S2T');
```

其中 `'S2T'` 即为 `OpenCCConversion` 类型.

## HK2S

- 香港繁体 (香港小学学习字词表标准) 到简体
- 香港繁體 (香港小學學習字詞表標準) 到簡體
- Traditional Chinese (Hong Kong Standard) to Simplified Chinese

## HK2T

- 香港繁体 (香港小学学习字词表标准) 到繁体
- 香港繁體 (香港小學學習字詞表標準) 到繁體
- Traditional Chinese (Hong Kong variant) to Traditional Chinese

## JP2T

- 日本汉字到繁体
- 日本漢字到繁體
- New Japanese Kanji (Shinjitai) to Traditional Chinese Characters (Kyūjitai)

## S2HK

- 简体到香港繁体 (香港小学学习字词表标准)
- 簡體到香港繁體 (香港小學學習字詞表標準)
- Simplified Chinese to Traditional Chinese (Hong Kong Standard)

## S2T

- 简体到繁体
- 簡體到繁體
- Simplified Chinese to Traditional Chinese

## S2TW

- 简体到台湾正体
- 簡體到臺灣正體
- Simplified Chinese to Traditional Chinese (Taiwan Standard)

## S2TWI

- 简体到繁体 (台湾正体标准) [惯用词]
- 簡體到繁體 (臺灣正體標準) [慣用詞]
- Simplified Chinese to Traditional Chinese (Taiwan Standard) [with idiom]

## T2HK

- 繁体到香港繁体 (香港小学学习字词表标准)
- 繁體到香港繁體 (香港小學學習字詞表標準)
- Traditional Chinese to Traditional Chinese (Hong Kong Standard)

## T2S

- 繁体到简体
- 繁體到簡體
- Traditional Chinese to Simplified Chinese

## T2TW

- 繁体到台湾正体
- 繁體到臺灣正體
- Traditional Chinese to Traditional Chinese (Taiwan Standard)

## TW2S

- 台湾正体到简体
- 臺灣正體到簡體
- Traditional Chinese (Taiwan Standard) to Simplified Chinese

## T2JP

- 繁体到日本汉字
- 繁體到日本漢字
- Traditional Chinese Characters (Kyūjitai) to New Japanese Kanji (Shinjitai)

## TW2T

- 台湾正体到繁体
- 臺灣正體到繁體
- Traditional Chinese (Taiwan standard) to Traditional Chinese

## TWI2S

- 繁体 (台湾正体标准) [惯用词] 到简体
- 繁體 (臺灣正體標準) [慣用詞] 到簡體
- Traditional Chinese (Taiwan Standard) [with idiom] to Simplified Chinese

## S2JP

- 简体到日本汉字
- 簡體到日本漢字
- Simplified Chinese to New Japanese Kanji (Shinjitai)

## T2TWI

- 繁体到台湾正体 [惯用词]
- 繁體到臺灣正體 [慣用詞]
- Traditional Chinese to Traditional Chinese (Taiwan Standard) [with idiom]

## HK2TW

- 香港繁体 (香港小学学习字词表标准) 到台湾正体
- 香港繁體 (香港小學學習字詞表標準) 到臺灣正體
- Traditional Chinese (Hong Kong variant) to Traditional Chinese (Taiwan Standard)

## HK2TWI

- 香港繁体 (香港小学学习字词表标准) 到台湾正体 [惯用词]
- 香港繁體 (香港小學學習字詞表標準) 到臺灣正體 [慣用詞]
- Traditional Chinese (Hong Kong variant) to Traditional Chinese (Taiwan Standard) [with idiom]

## HK2JP

- 香港繁体 (香港小学学习字词表标准) 到日本汉字
- 香港繁體 (香港小學學習字詞表標準) 到日本漢字
- Traditional Chinese (Hong Kong variant) to New Japanese Kanji (Shinjitai)

## TW2HK

- 台湾正体到香港繁体 (香港小学学习字词表标准)
- 臺灣正體到香港繁體 (香港小學學習字詞表標準)
- Traditional Chinese (Taiwan Standard) to Traditional Chinese (Hong Kong Standard)

## TW2TWI

- 台湾正体到台湾正体 [惯用词]
- 臺灣正體到臺灣正體 [慣用詞]
- Traditional Chinese (Taiwan Standard) to Traditional Chinese (Taiwan Standard) [with idiom]

## TW2JP

- 台湾正体到日本汉字
- 臺灣正體到日本漢字
- Traditional Chinese (Taiwan Standard) to New Japanese Kanji (Shinjitai)

## TWI2T

- 台湾正体 [惯用词] 到繁体
- 臺灣正體 [慣用詞] 到繁體
- Traditional Chinese (Taiwan Standard) [with idiom] to Traditional Chinese

## TWI2HK

- 台湾正体 [惯用词] 到香港繁体 (香港小学学习字词表标准)
- 臺灣正體 [慣用詞] 到香港繁體 (香港小學學習字詞表標準)
- Traditional Chinese (Taiwan Standard) [with idiom] to Traditional Chinese (Hong Kong Standard)

## TWI2TW

- 台湾正体 [惯用词] 到台湾正体
- 臺灣正體 [慣用詞] 到臺灣正體
- Traditional Chinese (Taiwan Standard) [with idiom] to Traditional Chinese (Taiwan Standard)

## TWI2JP

- 台湾正体 [惯用词] 到日本汉字
- 臺灣正體 [慣用詞] 到日本漢字
- Traditional Chinese (Taiwan Standard) [with idiom] to New Japanese Kanji (Shinjitai)

## JP2S

- 日本汉字到简体
- 日本漢字到簡體
- New Japanese Kanji (Shinjitai) to Simplified Chinese

## JP2HK

- 日本汉字到香港繁体 (香港小学学习字词表标准)
- 日本漢字到香港繁體 (香港小學學習字詞表標準)
- New Japanese Kanji (Shinjitai) to Traditional Chinese (Hong Kong Standard)

## JP2TW

- 日本汉字到台湾正体
- 日本漢字到臺灣正體
- New Japanese Kanji (Shinjitai) to Traditional Chinese (Taiwan Standard)

## JP2TWI

- 日本汉字到台湾正体 [惯用词]
- 日本漢字到臺灣正體 [慣用詞]
- New Japanese Kanji (Shinjitai) to Traditional Chinese (Taiwan Standard) [with idiom]
