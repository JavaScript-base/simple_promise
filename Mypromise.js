const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

/**
 * 创建一个Promise
 * param {function} executor 任务执行器，立即执行
 */
class MyPromise {
    constructor(executor) {
        this._state = PENDING;
        this._value = undefined;
        try{
            executor(this._resolve.bind(this), this._reject.bind(this)); // 这里不使用bind会报错
        } catch(error) {
            this._reject(error);
        }
    }

    _changeState(newState, value) {
        if(this._state !== PENDING) {
            // 当前状态已经更改
            return;
        }
        this._state = newState;
        this._value = value;
    }
    /**
     * 改变状态和数据
     * 而且状态的改变不能回滚
     * 标记当前任务完成
     */
    _resolve(data) {
        this._changeState(FULFILLED, data);
        console.log("完成", data)
    }
    /**
     * 改变状态和数据
     * 而且状态的改变不能回滚
     * 标记当前任务失败
     */
    _reject(reason) {
        this._changeState(REJECTED, reason);
        console.log("失败", reason)
    }
}
 
const pro = new MyPromise((resolve, reject) => {
    throw 123;
})

console.log(pro);
