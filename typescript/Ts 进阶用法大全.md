> 初听不识曲中意,再听已是曲中人，正如这首诗一样初学 Ts 的时候不太理解高级用法，现在用多了感觉到这里面的重要性，所以整理一波经验值

### 交叉类型（&）

``` ts
interface Button {
  type: string
  text: string
}

interface Link {
  alt: string
  href: string
}

const linkBtn: Button & Link = {
  type: 'danger',
  text: '跳转到百度',
  alt: '跳转到百度',
  href: 'http://www.baidu.com'
}
```

### 联合类型（|）

``` ts
interface Button {
  type: 'default' | 'primary' | 'danger'
  text: string
}

const btn: Button = {
  type: 'primary',
  text: '按钮'
}
```

### 类型索引（keyof）

``` ts
interface Button {
    type: string
    text: string
}

type ButtonKeys = keyof Button
// 等效于
type ButtonKeys = "type" | "text"
```

### 类型约束（extends）

``` ts

type BaseType = string | number | boolean

// 这里表示 copy 的参数
// 只能是字符串、数字、布尔这几种基础类型
function copy<T extends BaseType>(arg: T): T {
  return arg
}

// 共用
function getValue<T, K extends keyof T>(obj: T, key: K) {
  return obj[key]
}

const obj = { a: 1 }
const a = getValue(obj, 'a')

```

### 类型映射（in）

in 关键词的作用主要是做类型的映射，`遍历`已有接口的 key 或者是遍历联合类型。下面使用内置的泛型接口 Readonly 来举例。

``` ts
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};

interface Obj {
  a: string
  b: string
}

type ReadOnlyObj = Readonly<Obj>
```

### 条件类型（U ? X : Y）

条件类型的语法规则和三元表达式一致，经常用于一些类型不确定的情况。

``` ts

// T extends U ? X : Y

type Extract<T, U> = T extends U ? T : never;


interface Worker {
  name: string
  age: number
  email: string
  salary: number
}

interface Student {
  name: string
  age: number
  email: string
  grade: number
}


type CommonKeys = Extract<keyof Worker, keyof Student>
// 'name' | 'age' | 'email'

```

### 工具泛型

#### Partial

Partial 用于将一个接口的所有属性设置为`可选状态`，首先通过 keyof T，取出类型变量 T 的所有属性，然后通过 in 进行遍历，最后在属性后加上一个 ?。
我们通过 TypeScript 写 React 的组件的时候，如果组件的属性都有默认值的存在，我们就可以通过 Partial 将属性值都`变成可选值`。

``` ts
type Partial<T> = {
    [P in keyof T]?: T[P]
}
```

``` ts
import React from 'react'

interface ButtonProps {
  type: 'button' | 'submit' | 'reset'
  text: string
  disabled: boolean
  onClick: () => void
}

// 将按钮组件的 props 的属性都改为可选
const render = (props: Partial<ButtonProps> = {}) => {
  const baseProps = {
    disabled: false,
    type: 'button',
    text: 'Hello World',
    onClick: () => {},
  }
  const options = { ...baseProps, ...props }
  return (
    <button
      type={options.type}
      disabled={options.disabled}
      onClick={options.onClick}>
      {options.text}
    </button>
  )
}
```

#### Required

Required 的作用刚好与 Partial 相反，就是将接口中所有可选的属性改为必须的，区别就是把 Partial 里面的 ? 替换成了 -?。

``` ts
// 其中-?是代表可移除?这个修改器的标识。
type Required<T> = {
    [P in keyof T]-?: T[P]
}
```

#### Record

``` ts

type petsGroup = 'dog' | 'cat' | 'fish';
interface IPetInfo {
    name:string,
    age:number,
}

type IPets = Record<petsGroup | 'otherAnamial', IPetInfo>;

const animalsInfo:IPets = {
    dog:{
        name:'dogName',
        age:2
    },
    cat:{
        name:'catName',
        age:3
    },
    fish:{
        name:'fishName',
        age:5
    },
    otherAnamial:{
        name:'otherAnamialName',
        age:10
    }
}

```

#### Extract

如果 T 中的类型在 U 存在，则返回，否则抛弃。假设我们两个类，有三个公共的属性，可以通过 Extract 提取这三个公共属性。

``` ts
type Extract<T, U> = T extends U ? T : never;

```

``` ts
interface Worker {
  name: string
  age: number
  email: string
  salary: number
}

interface Student {
  name: string
  age: number
  email: string
  grade: number
}


type CommonKeys = Extract<keyof Worker, keyof Student>
// 'name' | 'age' | 'email'
```

#### Exclude

Exclude 的作用与之前介绍过的 Extract 刚好相反，如果 T 中的类型在 U 不存在，则返回，否则抛弃。现在我们拿之前的两个类举例，看看 Exclude 的返回结果。

``` ts
type Exclude<T, U> = T extends U ? never : T
```

``` ts
interface Worker {
  name: string
  age: number
  email: string
  salary: number
}

interface Student {
  name: string
  age: number
  email: string
  grade: number
}


type ExcludeKeys = Exclude<keyof Worker, keyof Student>
// 'salary'
```

#### Pick

Pick 主要用于提取接口的某几个属性。做过 Todo 工具的同学都知道，Todo工具只有编辑的时候才会填写描述信息，预览的时候只有标题和完成状态，所以我们可以通过 Pick 工具，提取 Todo 接口的两个属性，生成一个新的类型 TodoPreview。

``` ts
type Pick<T, K extends keyof T> = {
    [P in K]: T[P]
}
```

#### Omit

Omit 的作用刚好和 Pick 相反，先通过 Exclude<keyof T, K> 先取出类型 T 中存在，但是 K 不存在的属性，然后再由这些属性构造一个新的类型。还是通过前面的 Todo 案例来说，TodoPreview 类型只需要排除接口的 description 属性即可，写法上比之前 Pick 精简了一些。

``` ts
type Omit<T, K extends keyof any> = Pick<
  T, Exclude<keyof T, K>
>


interface Todo {
  title: string
  completed: boolean
  description: string
}

type TodoPreview = Omit<Todo, "description">

const todo: TodoPreview = {
  title: 'Clean room',
  completed: false
}
```
