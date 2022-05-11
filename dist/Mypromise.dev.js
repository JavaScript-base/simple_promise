"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var PENDING = "pending";
var FULFILLED = "fulfilled";
var REJECTED = "rejected";
/**
 * 创建一个Promise
 * param {function} executor 任务执行器，立即执行
 */

var MyPromise =
/*#__PURE__*/
function () {
  function MyPromise(executor) {
    _classCallCheck(this, MyPromise);

    this._state = PENDING;
    this._value = undefined;

    try {
      executor(this._resolve.bind(this), this._reject.bind(this)); // 这里不使用bind会报错
    } catch (error) {
      this._reject(error);
    }
  }

  _createClass(MyPromise, [{
    key: "_changeState",
    value: function _changeState(newState, value) {
      if (this._state !== PENDING) {
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

  }, {
    key: "_resolve",
    value: function _resolve(data) {
      this._changeState(FULFILLED, data);

      console.log("完成", data);
    }
    /**
     * 改变状态和数据
     * 而且状态的改变不能回滚
     * 标记当前任务失败
     */

  }, {
    key: "_reject",
    value: function _reject(reason) {
      this._changeState(REJECTED, reason);

      console.log("失败", reason);
    }
  }]);

  return MyPromise;
}();

var pro = new MyPromise(function (resolve, reject) {
  throw 123;
});
console.log(pro);