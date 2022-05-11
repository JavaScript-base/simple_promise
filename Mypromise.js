const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

/**
 * 运行一个微队列函数
 * 把传递的函数队列放到微队列中
 * @param {*} callback 
 */
function runMicroTask(callback) {
    // 判断node环境
    if(process && process.nextTick) {
        process.nextTick(callback)
    } else if(MutationObserver){
        // 使用MutationOberver模拟微队列的场景
        const p = document.createElement("p");
        const observer = new MutationObserver(function () {
            callback();
        });
        p.innerHTML = "1";
    } else {
        setTimeout(callback, 0);
    }
}

/**
 * 判断obj是否是promise
 * @param {*} obj 
 * @returns 
 */
function isPromise(obj) {
    return !!(obj && typeof obj === "object" && typeof obj.then === "function");
}

/**
 * 创建一个Promise
 * param {function} executor 任务执行器，立即执行
 */
class MyPromise {
    constructor(executor) {
        this._state = PENDING;
        this._value = undefined;
        this._handlers = [];
        try{
            executor(this._resolve.bind(this), this._reject.bind(this)); // 这里不使用bind会报错
        } catch(error) {
            this._reject(error);
        }
    }

    /**
     * then function returns a new promise object
     * Promise A+规范的then, 函数会放到微队列中
     * @param {*} onFulfilled 成功之后调用
     * @param {*} onRejected 失败时调用
     * 主要的功能是把函数把函数放到队列里面，并不会立即去执行
     */
    then(onFulfilled, onRejected) {
        return new MyPromise((resolve, reject) => {
            this._pushHandlers(onFulfilled, FULFILLED, resolve, reject);
            this._pushHandlers(onRejected, REJECTED, resolve, reject);
            this._runHandlers(); // 执行队列
        })
    }

    /**
     * 
     * @param {*} executor 执行器
     * @param {*} state 调用的执行器的状态
     */
    _pushHandlers(executor, state, resolve, reject) {
        this._handlers.push({
            executor,
            state,
            resolve,
            reject
        })
    }

    /**
     * executor queue
     */
    _runHandlers() {
        if(this._state === PENDING) {
            return;
        }
        // 循环
        while(this._handlers[0]) {
            this._runOneHandler(this._handlers[0]);
            this._handlers.shift(); // 执行一个删除一个
        }
    }

    /**
     * 处理单个handler
     * @param {*} handler 
     */
    _runOneHandler({executor, reject, resolve, state}) {
        runMicroTask(() => {
            if(this._state !== state) {
                return;
            }
            if(typeof executor !== "function") {
                // 不是一个函数, 状态穿透
                this._state === FULFILLED
                    ? resolve(this._value)
                    : reject(this._value);
                return;
            }
            try{
                const result = executor(this._value);
                if(isPromise(result)) {
                    result.then(resolve, reject);
                } else {
                    resolve(result);
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    _changeState(newState, value) {
        if(this._state !== PENDING) {
            // 当前状态已经更改
            return;
        }
        this._state = newState;
        this._value = value;
        this._runHandlers();
    }
    /**
     * 改变状态和数据
     * 而且状态的改变不能回滚
     * 标记当前任务完成
     */
    _resolve(data) {
        this._changeState(FULFILLED, data);
    }
    /**
     * 改变状态和数据
     * 而且状态的改变不能回滚
     * 标记当前任务失败
     */
    _reject(reason) {
        this._changeState(REJECTED, reason);
    }
}
 
// const pro = new Promise((resolve, reject) => {
//     resolve(1);
// })

// pro.then((data) => {
//     console.log(data);
//     return new MyPromise((resolve) => {
//         resolve(2);
//     })
// })
// .then((data) => {
//     console.log(data);
// })

// 互操作
function delay(duration) {
    return new MyPromise((resolve) => {
        setTimeout(resolve, duration);
    });
}

(async function () {
    console.log("start");
    await delay(5000);
    console.log("ok");
})()

// TODO: 实现all、race 静态方法
