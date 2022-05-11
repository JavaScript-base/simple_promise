Promise A+ 规范

# Promise规范

Promise是一套专门处理异步场景的规范，它能有效的避免回调地狱的产生，使异步代码更加清晰、简洁、统一

这套规范最早诞生于前端社区，规范名称为[Promise A+](https://promisesaplus.com/)

该规范出现后，立即得到了很多开发者的响应

Promise A+ 规定：

1. 所有的异步场景，都可以看作是一个异步任务，每个异步任务，在JS中应该表现为一个**对象**，该对象称之为**Promise对象**，也叫做任务对象

   <img src="http://mdrs.yuanjin.tech/img/20210618154556.png" alt="image-20210618154556558" style="zoom:50%;" />

2. 每个任务对象，都应该有两个阶段、三个状态

   <img src="http://mdrs.yuanjin.tech/img/20210618155145.png" alt="image-20210618155145355" style="zoom:50%;" />

   根据常理，它们之间存在以下逻辑：

   - 任务总是从未决阶段变到已决阶段，无法逆行
   - 任务总是从挂起状态变到完成或失败状态，无法逆行
   - 时间不能倒流，历史不可改写，任务一旦完成或失败，状态就固定下来，永远无法改变

3. `挂起->完成`，称之为`resolve`；`挂起->失败`称之为`reject`。任务完成时，可能有一个相关数据；任务失败时，可能有一个失败原因。

   ![image-20210618160538875](http://mdrs.yuanjin.tech/img/20210618160538.png)

4. 可以针对任务进行后续处理，针对完成状态的后续处理称之为onFulfilled，针对失败的后续处理称之为onRejected

   ![image-20210618161125894](http://mdrs.yuanjin.tech/img/20210618161125.png)

# Promise API

ES6提供了一套API，实现了Promise A+规范

基本使用如下：

```js
// 创建一个任务对象，该任务立即进入 pending 状态
const pro = new Promise((resolve, reject) => {
  // 任务的具体执行流程，该函数会立即被执行
  // 调用 resolve(data)，可将任务变为 fulfilled 状态， data 为需要传递的相关数据
  // 调用 reject(reason)，可将任务变为 rejected 状态，reason 为需要传递的失败原因
});

pro.then(
  (data) => {
    // onFulfilled 函数，当任务完成后，会自动运行该函数，data为任务完成的相关数据
  },
  (reason) => {
    // onRejected 函数，当任务失败后，会自动运行该函数，reason为任务失败的相关原因
  }
);
```

## 实现一个自己的promise对于深入理解ES6+ 异步解决方案是很有帮助的；

具体的思路和实现可以参考commit 和 代码中的注释；
目前只是实现了基础功能， all、race 等静态方法还未实现

未完待续...
