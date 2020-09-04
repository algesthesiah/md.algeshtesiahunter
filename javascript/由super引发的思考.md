> 突然之间对super有点遗忘了，今天着手复习下

### es6源码

``` js
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

### babel 转义源码

``` js
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== 'undefined' && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    }
    return left instanceof right;
}

function _typeof(obj) {
    '@babel/helpers - typeof';

    if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
        _typeof = function _typeof(obj) {
            return typeof obj;
        };
    } else {
        _typeof = function _typeof(obj) {
            return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype
                ? 'symbol'
                : typeof obj;
        };
    }
    return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
    if (!_instanceof(instance, Constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}

function _defineProperties(target, props) {
    for (let i = 0; i < props.length; i++) {
        let descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ('value' in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}

function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== 'function' && superClass !== null) {
        // 这个null感觉没必要
        throw new TypeError('Super expression must either be null or a function');
    }
    // 桥接下级，添加构造函数的原型对象
    // 创建一个新对象，使用现有的对象来提供新创建的对象的__proto__
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: { value: subClass, writable: true, configurable: true },
    });
    // 桥接上级__proto__，添加上层构造函数的原型对象
    if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
    _setPrototypeOf =
        Object.setPrototypeOf ||
        function _setPrototypeOf(o, p) {
            o.__proto__ = p;
            return o;
        };
    return _setPrototypeOf(o, p);
}

function _createSuper(Derived) {
    let hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
        let Super = _getPrototypeOf(Derived);
        let result;
        if (hasNativeReflectConstruct) {
            let NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else {
            result = Super.apply(this, arguments); // Super不是原型对象吗，为何会有apply方法
        }
        return _possibleConstructorReturn(this, result);
    };
}

function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === 'object' || typeof call === 'function')) {
        return call;
    }
    return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
}

function _isNativeReflectConstruct() {
    if (typeof Reflect === 'undefined' || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === 'function') return true;
    try {
        Date.prototype.toString.call(Reflect.construct(Date, [], function() {}));
        return true;
    } catch (e) {
        return false;
    }
}

function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf
        ? Object.getPrototypeOf
        : function _getPrototypeOf(o) {
              return o.__proto__ || Object.getPrototypeOf(o);
          };
    return _getPrototypeOf(o);
}

let Clock = /* #__PURE__ */ (function(_React$Component) {
    _inherits(Clock, _React$Component);

    let _super = _createSuper(Clock); // _createSuperInternal

    function Clock(props) {
        let _this;

        _classCallCheck(this, Clock);

        _this = _super.call(this, props);
        _this.state = {
            date: new Date(),
        };
        return _this;
    }

    _createClass(Clock, [
        {
            key: 'render',
            value: function render() {
                return /* #__PURE__ */ React.createElement(
                    'div',
                    null,
                    /* #__PURE__ */ React.createElement('h1', null, 'Hello, world!'),
                    /* #__PURE__ */ React.createElement('h2', null, 'It is ', this.state.date.toLocaleTimeString(), '.')
                );
            },
        },
    ]);

    return Clock; // 自执行函数 返回一个继承外部参数React.Component的类 Clock
})(React.Component);
```

### 感悟

之前学的都忘了，55555~~，那就多动笔把~
