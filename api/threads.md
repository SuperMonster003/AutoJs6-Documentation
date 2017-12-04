# Threads

> Stability: 1 - Experiment

threads模块提供了多线程支持。可以启动新线程来运行脚本。新线程会在脚本停止时也自动停止。

但是，在新线程中暂时不能使用timers模块的函数，包括setTimeout, setInterval等。而且目前在新线程调用exit()函数时只会退出当前线程。

## threads.start(action)
* `action` {Function} 要在新线程执行的函数

启动一个新线程并执行action。

例如:
```
threads.start(function(){
    while(true){
        log("线程2");
    }
});
while(true){
    log("线程1");
}
```

