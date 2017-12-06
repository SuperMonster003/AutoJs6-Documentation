# Device

> Stability: 2 - Stable

控制台模块提供了与设备有关的信息与操作，例如获取设备宽高，内存使用率，IMEI，调整设备亮度、音量等。

## device.width 
* {number}

设备宽度。例如1080。

## device.height 
* {number}

设备高度。例如1920。

## device.buildId

Either a changelist number, or a label like "M4-rc20".

设备的(系统)修订版本号，或者诸如"M4-rc20"的标识。

## device.broad 

The name of the underlying board, like "goldfish".

设备的主板(?)型号。

## device.brand

The consumer-visible brand with which the product/hardware will be associated, if any.

与产品或硬件相关的厂商品牌，如"Xiaomi", "Huawei"等。

## device.device

The name of the industrial design.

设备在工业设计中的名称。

## deivce.model

The end-user-visible name for the end product.

设备型号。

## device.product

The name of the overall product.

整个产品的名称。

## device.bootloader

The system bootloader version number.

设备Bootloader的版本。

## device.hardware

The name of the hardware (from the kernel command line or /proc).

设备的硬件名称(来自内核命令行或者/proc)。

## device.fingerprint

系统构建(build)的唯一标识码。

## device.sdkInt

The user-visible SDK version of the framework; its possible values are defined in Build.VERSION_CODES.

安卓系统API版本。例如安卓4.4的sdkInt为19。

## device.serial

A hardware serial number, if available. Alphanumeric only, case-insensitive.

硬件序列号。

## device.getIMEI()

## device.getAndroidId()

## device.getBrightness()

## device.getBrightnessMode()

## device.setBrightness(b)

## device.setBrightnessMode(mode)

