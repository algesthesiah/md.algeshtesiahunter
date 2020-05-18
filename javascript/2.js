/**
 *  (发布订阅) 观察者 被观察者
 */
class Dep {
  constructor() {
    this.subs = [] //存放所有的 watcher
  }
  //订阅
  addSub(watcher) {
    //添加 watcher
    this.subs.push(watcher)
  }
  //发布
  notify() {
    this.subs.forEach((watcher) => watcher.updata())
  }
}

/**
 * 观察者
 */
class Watcher {
  constructor(vm, expr, cd) {
    this.vm = vm
    this.expr = expr
    this.cd = cd

    //存放旧值
    this.oldValue = this.get()
  }
  get() {
    //获取旧值
    Dep.target = this //先把自己放到 this 上
    //取值时 把这个观察者和数据关联起来
    let value = CompileUtil.getVal(this.vm, this.expr)
    Dep.target = null //不取消 任何值取都会 添加watcher
    return value
  }
  updata() {
    let newVal = CompileUtil.getVal(this.vm, this.expr) //获取新值
    if (newVal !== this.oldValue) {
      this.cd(newVal)
    }
  }
}

/**
 * 数据劫持
 */
class Observer {
  constructor(data) {
    this.observer(data)
  }
  observer(data) {
    //如果是对象才观察
    if (data && typeof data === 'object') {
      for (let key in data) {
        //循环 data 中的所有子项
        this.defineReactive(data, key, data[key])
      }
    }
  }
  //实现数据劫持
  defineReactive(obj, key, value) {
    this.observer(value) //如果传进来的参数是对象,就回调一下这个函数,就是一个递归函数

    let dep = new Dep() //给每一个属性都添加一个具有发布和订阅的功能

    Object.defineProperty(obj, key, {
      get() {
        //创建watcher时,会获取到对应的内容 并且把watcher放到了全局上
        Dep.target && dep.addSub(Dep.target)
        return value
      },
      set: (newVal) => {
        if (value !== newVal) {
          this.observer(newVal) //给设置的新值也加上 get set 方法
          value = newVal
          dep.notify() //执行观察者更新时的函数
        }
      },
    })
  }
}

/**
 * 模板编译
 */
class Compiler {
  constructor(el, vm) {
    this.vm = vm
    //判断el属性 是不是一个元素 不是就获取
    this.el = this.isElementNode(el) ? el : document.querySelector(el)
    // console.log(this.el);

    //把当前的节点元素 获取到 放到内存中 创建文档碎片
    let fragment = this.node2fragment(this.el)

    //把节点中的内容进行替换

    //模板编译 用数据编译
    this.compile(fragment)

    //把内容在塞到页面中
    this.el.appendChild(fragment)
  }

  //判断属性是不是以 v- 开头
  isDirective(attrName) {
    return attrName.startsWith('v-')
    // return /^v-/.test(attrName)
  }

  //编译元素的
  compileElement(node) {
    let attributes = node.attributes //类数组, 获取所有node节点的属性和属性值
    // console.log(attributes)
    attributes = [...attributes]
    // console.log(attributes)
    attributes.forEach((attr) => {
      //是一个属性对象attr
      let { name, value: expr } = attr //:expr是给value起一个别名叫 expr **school.name
      //判断是不是vue指令
      if (this.isDirective(name)) {
        // v-model='asdad' v-on:click='dsa'
        let [, directive] = name.split('-')
        let [directiveName, eventName] = directive.split(':')
        //需要调用不同的指令来处理 *** v-if v-modle v-show v-else
        CompileUtil[directiveName](node, expr, this.vm, eventName)
      }
    })
  }

  //编译文本的
  compileText(node) {
    //判断节点中是否包含 {{}}
    let content = node.textContent
    if (/\{\{.+?\}\}/.test(content)) {
      CompileUtil['text'](node, content, this.vm)
    }
  }

  //用来编译内存中的dom节点 核心方法
  compile(node) {
    let childNodes = node.childNodes //获取node的所有子节点
    ;[...childNodes].forEach((child) => {
      if (this.isElementNode(child)) {
        //判断是不是元素节点

        this.compileElement(child) //编译元素指令

        //如果是元素节点的话 需要把自己传不进去 再去遍历子元素节点
        this.compile(child)
      } else {
        //文本元素
        this.compileText(child) //编译文本指令
      }
    })
  }

  //获取所有元素,放到内存中
  node2fragment(node) {
    //创建一个文档碎片
    let fragment = document.createDocumentFragment()
    let firstChild

    //将node节点的的第一个节点给firstChild 如果node节点的的第一个节点为空则结束
    while ((firstChild = node.firstChild)) {
      //appendChild具有移动性
      fragment.appendChild(firstChild)
    }
    return fragment
  }

  // 是不是元素节点
  isElementNode(node) {
    return node.nodeType === 1
  }
}

CompileUtil = {
  //根据表达式获取对应的数据
  getVal(vm, expr) {
    // 7. reduce() 方法
    //  函数的参数 （第一参数）1.相加的初始值，2.循环出来的那一项，3.索引 4.循环的数组
    //  （第二个参数）初始值
    //  返回值：总和的结果
    expr = expr.trim()
    return expr.split('.').reduce((data, current) => {
      //[school,name]
      // console.log(data,current)
      return data[current]
    }, vm.$data)
  },
  setValue(vm, expr, value) {
    expr.split('.').reduce((data, current, index, arr) => {
      //[school,name]
      if (index === arr.length - 1) {
        //如果循环到最后一项时执行
        //console.log(data,current)
        //对象赋值是赋值对象的地址 所以更改data会改变相对应的对象
        data[current] = value //将数据从新赋值 school.name = xxxx
      }
      return data[current]
    }, vm.$data)
  },
  model(node, expr, vm) {
    //node是节点  expr是表达式 vm是实例
    // console.log(node)
    let fn = this.updater['modelUpdater']

    //给输入框加一个观察者 一旦数据变化,会把新值赋值给输入框
    new Watcher(vm, expr, (newVal) => {
      //newVal 是原生方法中自带的,是重新获取的新值
      fn(node, newVal)
    })

    node.addEventListener('input', (e) => {
      let value = e.target.value //获取用户输入的值
      this.setValue(vm, expr, value) //设置v-model的值
    })

    let value = this.getVal(vm, expr)
    // console.log(value)
    fn(node, value)
  },
  on(node, expr, vm, eventName) {
    node.addEventListener(eventName, (e) => {
      //给node添加事件
      vm[expr].call(vm, e)
    })
  },
  html(node, expr, vm, eventName) {
    let fn = this.updater['htmlUpdater']

    //给输入框加一个观察者 一旦数据变化,会把新值赋值给输入框
    new Watcher(vm, expr, (newVal) => {
      //newVal 是原生方法中自带的,是重新获取的新值
      fn(node, newVal)
    })

    let value = this.getVal(vm, expr)

    fn(node, value)
  },
  getContentValue(vm, expr) {
    //遍历表达式 将内容 重新替换成一个完整的内容 返还回去
    return expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
      return this.getVal(vm, args[1])
    })
  },
  text(node, expr, vm) {
    let fn = this.updater['textUpdater']
    //console.log(expr) :{{ school.name }}
    let content = expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
      //console.log(args) :["{{ school.name }}", " school.name ", 0, "{{ school.name }}"]

      //给每个表达式 都加上观察者
      new Watcher(vm, args[1], () => {
        fn(node, this.getContentValue(vm, expr)) //返回一个全的字符串
      })

      return this.getVal(vm, args[1])
    })
    // console.log(content) //
    fn(node, content)
  },
  updater: {
    //把数据插入到value中
    modelUpdater(node, value) {
      node.value = value
    },
    htmlUpdater(node, value) {
      node.innerHTML = value
    },
    //处理文本节点
    textUpdater(node, value) {
      //textContent 属性设置或返回指定节点的文本内容，以及它的所有后代。
      node.textContent = value
    },
  },
}

class Vue {
  constructor(options) {
    this.$el = options.el
    this.$data = options.data
    this.computed = options.computed
    this.methods = options.methods
    //这个根元素存在则编译模板
    if (this.$el) {
      //数据劫持 把 this.$data 数据全部编译成 用 Object.defineProperty 来定义
      new Observer(this.$data)

      //把 vm上的数据获取操作 都代理到 vm.$data 上
      this.proxyVm(this.$data)

      //计算机属性
      for (let key in this.computed) {
        Object.defineProperty(this.$data, key, {
          //有依赖关系 数据
          get: () => {
            return this.computed[key].call(this)
          },
        })
      }

      //函数的储存
      for (let key in this.methods) {
        Object.defineProperty(this, key, {
          get: () => {
            return this.methods[key]
          },
        })
      }

      //模板编译
      new Compiler(this.$el, this)
    }
  }
  //给vm.$data 代理
  proxyVm(data) {
    for (let key in data) {
      //实现了通过vm.xxx 可以取到vm.$data.xxx
      Object.defineProperty(this, key, {
        //this 是 Vue 实例
        get: () => {
          //取vm 的值 等于 取vm.$data的值
          // console.log(this)
          return data[key] // 进行转换操作
        },
        set: (newVal) => {
          //设置vm 的值 等于 设置vm.$data的值
          data[key] = newVal
        },
      })
    }
  }
}
