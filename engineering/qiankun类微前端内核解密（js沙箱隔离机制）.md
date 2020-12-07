# 前言

qiankun模式是企业级后台迁移微前端的一个标杆模式，稍微有点技术的企业都会选择基于qiankun技术来自定义一套符合自身的微前端技术体系，所以这里面技术大部分是相通的，我司也不例外，在迁移微前端架构中有种种疑问，现在我们一起解密这个黑盒

# qiankun类微前端内核实现主要功能

1. JS沙箱：子应用之间互不影响，包括全局变量、事件等等
2. CSS隔离：子应用之间样式互不影响
3. Config Entry：配置每个子应用的JS和CSS
4. 按需加赞：切换到相应页面才加载对应资源
5. 公共依赖加载：大部分子应用都需要用到的资源如何处理
6. 预加载：空闲时间加载子应用资源
7. 父子应用通信：子应用如何触发父级应用方法、父级应用如何调子级方法

> 单纯论微前端有多种方式，上面列表微前端核心功能也有多种实现方式，为了高效专注解密，本主题仅仅解密类qiankun微前端内核处理方式

## CSS沙箱

### shadowDOM

Web components 的一个重要属性是封装——可以将标记结构、样式和行为隐藏起来，并与页面上的其他代码相隔离，保证不同的部分不会混在一起，可使代码更加干净、整洁。其中，Shadow DOM 接口是关键所在，它可以将一个隐藏的、独立的 DOM 附加到一个元素上。

这里官方文档写的还是挺好的推荐直接看文档[shadowDOM](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components/Using_shadow_DOM)

简易示例

``` ts
var shadowEl = document.querySelector(".shadow");
var shadow = shadowEl.attachShadow({mode: 'open'});
var link = document.createElement("a");
link.href = 'https://baidu.com';
link.innerHTML='百度'
shadow.appendChild(link);
```

特点

1. 对主文档的 `JavaScript` 选择器隐身，比如 `querySelector`
2. 只使用 `shadow tree` 内部的样式，不使用主文档的样式

### scopedCSS

 核心原理：利用`css属性选择器`层叠类似`vue scoped`的方式做样式隔离，被隔离的应用的样式表会被特定规则改写成如下模式

``` css
div .react15-lib{
    color: rgb(129, 143, 247);
}
```

``` css
div[data-qiankun="react15"] .react15-lib {
    color: rgb(129, 143, 247);
}
```

那么`qiankun`具体是如何实现的呢？它巧妙的利用[CSSRule](https://developer.mozilla.org/en-US/docs/Web/API/CSSRule)改写来实现上述功能。没用过这个功能的可能一脸懵逼，下面举个常用示例，可以找个网页打开`F12`测试下

``` ts
var style=document.createElement('style')
var textnode=document.createTextNode('#id{color:red}')
style.appendChild(textnode)
document.body.appendChild(style)
var styleList=document.querySelectorAll('style')
var current=styleList[styleList.length-1]
console.log(current.sheet)
```

不想试的可以直接看结果
![styleSheet](style-sheet.png)

我们可以通过这个接口便捷实现css的编辑

### 源码步骤如下

![css-step1](qiankun-css-step1.png)

上图得知往`createElement`传了四个参数`appContent`子应用入口文件，`strictStyleIsolation`是否开启严格的风格隔离，`scopedCSS`是否开启scopedCss隔离，`appName`子应用名称

``` ts
export function isEnableScopedCSS(sandbox: FrameworkConfiguration['sandbox']) {
  if (typeof sandbox !== 'object') {
    return false;
  }

  if (sandbox.strictStyleIsolation) {
    return false;
  }

  return !!sandbox.experimentalStyleIsolation;
}
```

通过上述源代码得知，传入的css隔离配置，`shadowDOM`的css隔离优先于`scopedCSS`，关键函数`createElement`

``` ts
function createElement(
  appContent: string,
  strictStyleIsolation: boolean,
  scopedCSS: boolean,
  appName: string,
): HTMLElement {
  const containerElement = document.createElement('div');
  containerElement.innerHTML = appContent;
  // appContent always wrapped with a singular div
  const appElement = containerElement.firstChild as HTMLElement;
  if (strictStyleIsolation) {
    if (!supportShadowDOM) {
      console.warn(
        '[qiankun]: As current browser not support shadow dom, your strictStyleIsolation configuration will be ignored!',
      );
    } else {
      const { innerHTML } = appElement;
      appElement.innerHTML = '';
      let shadow: ShadowRoot;

      if (appElement.attachShadow) {
        shadow = appElement.attachShadow({ mode: 'open' });
      } else {
        // createShadowRoot was proposed in initial spec, which has then been deprecated
        shadow = (appElement as any).createShadowRoot();
      }
      shadow.innerHTML = innerHTML;
    }
  }

  if (scopedCSS) {
    const attr = appElement.getAttribute(css.QiankunCSSRewriteAttr);
    if (!attr) {
      appElement.setAttribute(css.QiankunCSSRewriteAttr, appName);
    }

    const styleNodes = appElement.querySelectorAll('style') || [];
    forEach(styleNodes, (stylesheetElement: HTMLStyleElement) => {
      css.process(appElement!, stylesheetElement, appName);
    });
  }

  return appElement;
}
```

`strictStyleIsolation`为`true`的话直接shadowDOM覆盖掉，`scopedCSS`为`true`的话进入关键函数`css.process`

``` ts
export const QiankunCSSRewriteAttr = 'data-qiankun';
export const process = (
  appWrapper: HTMLElement,
  stylesheetElement: HTMLStyleElement | HTMLLinkElement,
  appName: string,
): void => {
  // lazy singleton pattern
  if (!processor) {
    processor = new ScopedCSS();
  }

  if (stylesheetElement.tagName === 'LINK') {
    console.warn('Feature: sandbox.experimentalStyleIsolation is not support for link element yet.');
  }

  const mountDOM = appWrapper;
  if (!mountDOM) {
    return;
  }

  const tag = (mountDOM.tagName || '').toLowerCase();

  if (tag && stylesheetElement.tagName === 'STYLE') {
    const prefix = `${tag}[${QiankunCSSRewriteAttr}="${appName}"]`;
    processor.process(stylesheetElement, prefix);
  }
};
```

核心实现就是`ScopedCSS`这个类

``` ts
export class ScopedCSS {
  private static ModifiedTag = 'Symbol(style-modified-qiankun)';

  private sheet: StyleSheet;

  private swapNode: HTMLStyleElement;

  constructor() {
    const styleNode = document.createElement('style');
    rawDocumentBodyAppend.call(document.body, styleNode);

    this.swapNode = styleNode;
    this.sheet = styleNode.sheet!;
    this.sheet.disabled = true;
  }

  process(styleNode: HTMLStyleElement, prefix: string = '') {
    if (styleNode.textContent !== '') {
      const textNode = document.createTextNode(styleNode.textContent || '');
      this.swapNode.appendChild(textNode);
      const sheet = this.swapNode.sheet as any; // type is missing
      const rules = arrayify<CSSRule>(sheet?.cssRules ?? []);
      const css = this.rewrite(rules, prefix);
      styleNode.textContent = css;

      // cleanup
      this.swapNode.removeChild(textNode);
      return;
    }

      // style标签动态改变走到这里，重写css
    const mutator = new MutationObserver((mutations) => {
      for (let i = 0; i < mutations.length; i += 1) {
        const mutation = mutations[i];

        if (ScopedCSS.ModifiedTag in styleNode) {
          return;
        }

        if (mutation.type === 'childList') {
          const sheet = styleNode.sheet as any;
          const rules = arrayify<CSSRule>(sheet?.cssRules ?? []);
          const css = this.rewrite(rules, prefix);

          styleNode.textContent = css;
          (styleNode as any)[ScopedCSS.ModifiedTag] = true;
        }
      }
    });

    mutator.observe(styleNode, { childList: true });
  }
}
```

观察下css重写核心代码

```ts
   rewrite(rules: CSSRule[], prefix: string = '') {
    let css = '';

    rules.forEach((rule) => {
      switch (rule.type) {
        case RuleType.STYLE:
          css += this.ruleStyle(rule as CSSStyleRule, prefix);
          break;
        case RuleType.MEDIA:
          css += this.ruleMedia(rule as CSSMediaRule, prefix);
          break;
        case RuleType.SUPPORTS:
          css += this.ruleSupport(rule as CSSSupportsRule, prefix);
          break;
        default:
          css += `${rule.cssText}`;
          break;
      }
    });
    return css;
  }
  ```

``` ts
  ruleStyle(rule: CSSStyleRule, prefix: string) {
    const rootSelectorRE = /((?:[^\w\-.#]|^)(body|html|:root))/gm;
    const rootCombinationRE = /(html[^\w{[]+)/gm;

    const selector = rule.selectorText.trim();

    let { cssText } = rule;
    // handle html { ... }
    // handle body { ... }
    // handle :root { ... }
    if (selector === 'html' || selector === 'body' || selector === ':root') {
      return cssText.replace(rootSelectorRE, prefix);
    }

    // handle html body { ... }
    // handle html > body { ... }
    if (rootCombinationRE.test(rule.selectorText)) {
      const siblingSelectorRE = /(html[^\w{]+)(\+|~)/gm;

      // since html + body is a non-standard rule for html
      // transformer will ignore it
      if (!siblingSelectorRE.test(rule.selectorText)) {
        cssText = cssText.replace(rootCombinationRE, '');
      }
    }

    // handle grouping selector, a,span,p,div { ... }
    cssText = cssText.replace(/^[\s\S]+{/, (selectors) =>
      selectors.replace(/(^|,\n?)([^,]+)/g, (item, p, s) => {
        // handle div,body,span { ... }
        if (rootSelectorRE.test(item)) {
          return item.replace(rootSelectorRE, (m) => {
            // do not discard valid previous character, such as body,html or *:not(:root)
            const whitePrevChars = [',', '('];

            if (m && whitePrevChars.includes(m[0])) {
              return `${m[0]}${prefix}`;
            }

            // replace root selector with prefix
            return prefix;
          });
        }

        return `${p}${prefix} ${s.replace(/^ */, '')}`;
      }),
    );

    return cssText;
  }
```

主要通过正则匹配改写了css，`ruleMedia`函数和`ruleSupport`类似原理直接忽略

#### 总结

传入配置参数如果开启了`shadowDOM`的话直接让子应用插入`shadowDOM`的root实现css隔离，如果开启了`scopedCSS`
遍历从配置传进来的`appElement`上的`style`标签，巧妙利用`CSSRule`、正则匹配改写css前缀实现隔离
