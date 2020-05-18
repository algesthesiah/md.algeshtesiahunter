function PromiseM(fn) {
  var value = null
  var callbacks = []
  //加入状态 为了解决在Promise异步操作成功之后调用的then注册的回调不会执行的问题
  var state = 'pending'
  var _this = this
  //注册所有的回调函数
  this.then = function(fulfilled, rejected) {
    //如果想链式promise 那就要在这边return一个new Promise
    return new PromiseM(function(resolv, rejec) {
      //异常处理
      try {
        if (state == 'pending') {
          callbacks.push(fulfilled)
          //实现链式调用
          return
        }
        if (state == 'fulfilled') {
          var data = fulfilled(value)
          //为了能让两个promise连接起来
          resolv(data)
          return
        }
        if (state == 'rejected') {
          var data = rejected(value)
          //为了能让两个promise连接起来
          rejec(data)
          return
        }
      } catch (e) {
        _this.catch(e)
      }
    })
  }
  //执行所有的回调函数
  function resolve(valueNew) {
    value = valueNew
    state = 'fulfilled'
    execute()
  }
  //执行所有的回调函数
  function reject(valueNew) {
    value = valueNew
    state = 'rejected'
    execute()
  }
  function execute() {
    //加入延时机制 防止promise里面有同步函数 导致resolve先执行 then还没注册上函数
    setTimeout(function() {
      callbacks.forEach(function(cb) {
        value = cb(value)
      })
    }, 0)
  }
  this.catch = function(e) {
    console.log(JSON.stringify(e))
  }
  //经典 实现异步回调
  fn(resolve, reject)
}


new PromiseM((res, rej) => {
  setTimeout(() => {
    rej('err')
  },330)
  }).then(function(e){
    console.log(e);
  console.log(111)
  }, function(e){
    console.log(e);
  console.log(222);
  })
  //111