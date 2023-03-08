// ==UserScript==
// @name               ChatGPT Exporter
// @name:zh-CN         ChatGPT Exporter
// @name:zh-TW         ChatGPT Exporter
// @namespace          pionxzh
// @version            2.1.0
// @author             pionxzh
// @description        Easily export the whole ChatGPT conversation history for further analysis or sharing.
// @description:zh-CN  轻松导出 ChatGPT 聊天记录，以便进一步分析或分享。
// @description:zh-TW  輕鬆匯出 ChatGPT 聊天紀錄，以便進一步分析或分享。
// @license            MIT
// @icon               https://chat.openai.com/favicon.ico
// @match              https://chat.openai.com/chat
// @match              https://chat.openai.com/chat/*
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              unsafeWindow
// @run-at             document-end
// ==/UserScript==

(e=>{const n=document.createElement("style");n.dataset.source="vite-plugin-monkey",n.innerText=e,document.head.appendChild(n)})(`img[src*="https://source.unsplash.com/"] {
    visibility: hidden;
}

/* hide the flickering */
p > img[src*="https://images.unsplash.com/"] {
    animation: fadeIn .3s;
}

.cursor-help {
    cursor: help;
}

.select-all {
    user-select: all!important;
}

.menu-item {
    height: 46px;
}

.menu-item[disabled] {
    pointer-events: none;
    filter: brightness(0.5);
}

.inputFieldSet {
    display: block;
    border-width: 2px;
    border-style: groove;
}

.inputFieldSet legend {
    margin-left: 4px;
}

.inputFieldSet input {
    background-color: transparent;
    box-shadow: none!important;
}

.dropdown-backdrop {
    display: none;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0,0,0,.5);
    z-index: 998;
    animation-name: pointerFadeIn;
    animation-duration: .3s;
}

.dropdown-menu {
    display: none;
    position: absolute;
    flex-direction: column;
    left: calc(100% + 1rem);
    top: -4.2rem;
    width: 220px;
    padding: .75rem .4rem 0 .4rem;
    border-radius: .375rem;
    box-shadow: 0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);
    animation: fadeIn .3s;
}

.dropdown-menu::before {
    content: '';
    position: absolute;
    top: 0;
    left: -1rem;
    width: 1rem;
    height: 100%;
}

#exporter-menu[disabled] {
    cursor: not-allowed;
}

#exporter-menu:not([disabled]):hover::after {
    content: '';
    position: absolute;
    top: 1.2rem;
    right: -1rem;
    width: 0;
    height: 0;
    border-top: .5rem solid transparent;
    border-bottom: .5rem solid transparent;
    border-right: .5rem solid #202123;
    animation: fadeIn .3s;
}

@supports not selector(:has(.test:hover)) {
    #exporter-menu:not([disabled]):hover .dropdown-menu {
        display: flex;
    }
}

@supports selector(:has(.test:hover)) {
    #exporter-menu:not([disabled]):not(:has(.dropdown-backdrop:hover)):hover .dropdown-menu {
        display: flex;
    }
}

@media screen and (hover: none) and (max-width: 768px) {
    .dropdown-menu {
        position: fixed;
        left: 0;
        top: unset;
        bottom: 0;
        width: 100%;
        border-radius: 0;
        box-shadow: none;
        z-index: 999;
        animation: slideUp .3s;
    }

    @supports selector(:has(.test:hover)) {
        #exporter-menu:not([disabled]):not(:has(.dropdown-backdrop:hover)):hover .dropdown-backdrop {
            display: block;
        }

        #exporter-menu:not([disabled]):has(.dropdown-backdrop:hover):hover .dropdown-backdrop {
            display: block;
            pointer-events: none;
            opacity: 0;
            animation-name: pointerFadeInReverse;
        }
    }

    #exporter-menu:hover::after {
        display: none;
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes slideUp {
    from {
        transform: translateY(100%);
    }
    to {
        transform: translateY(0);
    }
}

@keyframes pointerFadeIn {
    from {
        opacity: 0;
        pointer-events: none;
    }
    to {
        opacity: 1;
        pointer-events: auto;
    }
}

/* Using \`animation-direction: reverse\` is not working in our case */
@keyframes pointerFadeInReverse {
    from {
        opacity: 1;
        pointer-events: auto;
    }
    to {
        opacity: 0;
        pointer-events: none;
    }
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

@keyframes circularDash {
    0% {
        stroke-dasharray: 1px, 200px;
        stroke-dashoffset: 0;
    }
    50% {
        stroke-dasharray: 100px, 200px;
        stroke-dashoffset: -15px;
    }
    100% {
        stroke-dasharray: 100px, 200px;
        stroke-dashoffset: -125px;
    }
}
.DialogOverlay {
    background-color: rgba(0, 0, 0, 0.44);
    position: fixed;
    inset: 0;
    z-index: 1000;
    animation: fadeIn 150ms cubic-bezier(0.16, 1, 0.3, 1);
}

.DialogContent {
    background-color: white;
    border-radius: 6px;
    box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90vw;
    max-width: 450px;
    max-height: 85vh;
    padding: 16px 24px;
    z-index: 1001;
    animation: contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
}

.dark .DialogContent {
    background-color: rgba(32,33,35,1);
    border-color: rgba(64,65,79,1);
    border-width: 1px;
}

.DialogTitle {
    margin: 0 0 16px 0;
    font-weight: 500;
    color: #1a1523;
    font-size: 20px;
}

.dark .DialogTitle {
    color: #fff;
}

.Button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    padding: 0 15px;
    font-size: 15px;
    line-height: 1;
    font-weight: 500;
    height: 35px;
}
.Button.green {
    background-color: #ddf3e4;
    color: #18794e;
}
.Button.green:hover {
    background-color: #ccebd7;
}

.IconButton {
    font-family: inherit;
    border-radius: 100%;
    height: 25px;
    width: 25px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #6f6e77;
    position: absolute;
    top: 10px;
    right: 10px;
}
.IconButton:hover {
    background-color: rgba(0, 0, 0, 0.06);
}

.Fieldset {
    display: flex;
    gap: 20px;
    align-items: center;
    margin-bottom: 15px;
}

.Label {
    font-size: 15px;
    color: #1a1523;
    width: 90px;
    text-align: right;
}

.dark .Label {
    color: #fff;
}

.Input {
    width: 100%;
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    padding: 0 10px;
    font-size: 15px;
    line-height: 1;
    color: #5a5865;
    background-color: #f7f7f7;
    box-shadow: 0 0 0 1px #6f6e77;
    height: 35px;
    outline: none;
}

.dark .Input {
    background-color: #2f2f2f;
    color: #fff;
    box-shadow: 0 0 0 1px #6f6e77;
}

.Description {
    font-size: 13px;
    color: #5a5865;
    text-align: right;
    margin-bottom: 4px;
}

.dark .Description {
    color: #bcbcbc;
}

@keyframes contentShow {
    from {
        opacity: 0;
        transform: translate(-50%, -48%) scale(0.96);
    }
    to {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
}
`);

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
(function() {
  "use strict";
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  var sentinel_umdExports = {};
  var sentinel_umd = {
    get exports() {
      return sentinel_umdExports;
    },
    set exports(v2) {
      sentinel_umdExports = v2;
    }
  };
  (function(module, exports) {
    (function(root2, factory) {
      {
        module.exports = factory();
      }
    })(commonjsGlobal, function() {
      var isArray = Array.isArray, selectorToAnimationMap = {}, animationCallbacks = {}, styleEl, styleSheet, cssRules;
      return {
        /**
         * Add watcher.
         * @param {array} cssSelectors - List of CSS selector strings
         * @param {Function} callback - The callback function
         */
        on: function(cssSelectors, callback) {
          if (!callback)
            return;
          if (!styleEl) {
            var doc = document, head2 = doc.head;
            doc.addEventListener("animationstart", function(ev, callbacks, l2, i2) {
              callbacks = animationCallbacks[ev.animationName];
              if (!callbacks)
                return;
              ev.stopImmediatePropagation();
              l2 = callbacks.length;
              for (i2 = 0; i2 < l2; i2++)
                callbacks[i2](ev.target);
            }, true);
            styleEl = doc.createElement("style");
            head2.append(styleEl);
            styleSheet = styleEl.sheet;
            cssRules = styleSheet.cssRules;
          }
          (isArray(cssSelectors) ? cssSelectors : [cssSelectors]).map(function(selector, animId, isCustomName) {
            animId = selectorToAnimationMap[selector];
            if (!animId) {
              isCustomName = selector[0] == "!";
              selectorToAnimationMap[selector] = animId = isCustomName ? selector.slice(1) : "sentinel-" + Math.random().toString(16).slice(2);
              cssRules[styleSheet.insertRule(
                "@keyframes " + animId + "{from{transform:none;}to{transform:none;}}",
                cssRules.length
              )]._id = selector;
              if (!isCustomName) {
                cssRules[styleSheet.insertRule(
                  selector + "{animation-duration:0.0001s;animation-name:" + animId + ";}",
                  cssRules.length
                )]._id = selector;
              }
              selectorToAnimationMap[selector] = animId;
            }
            (animationCallbacks[animId] = animationCallbacks[animId] || []).push(callback);
          });
        },
        /**
         * Remove watcher.
         * @param {array} cssSelectors - List of CSS selector strings
         * @param {Function} callback - The callback function (optional)
         */
        off: function(cssSelectors, callback) {
          (isArray(cssSelectors) ? cssSelectors : [cssSelectors]).map(function(selector, animId, callbackList, i2) {
            if (!(animId = selectorToAnimationMap[selector]))
              return;
            callbackList = animationCallbacks[animId];
            if (callback) {
              i2 = callbackList.length;
              while (i2--) {
                if (callbackList[i2] === callback)
                  callbackList.splice(i2, 1);
              }
            } else {
              callbackList = [];
            }
            if (callbackList.length)
              return;
            i2 = cssRules.length;
            while (i2--) {
              if (cssRules[i2]._id == selector)
                styleSheet.deleteRule(i2);
            }
            delete selectorToAnimationMap[selector];
            delete animationCallbacks[animId];
          });
        },
        /**
         * Reset watchers and cache
         */
        reset: function() {
          selectorToAnimationMap = {};
          animationCallbacks = {};
          if (styleEl)
            styleEl.parentNode.removeChild(styleEl);
          styleEl = 0;
        }
      };
    });
  })(sentinel_umd);
  const sentinel = sentinel_umdExports;
  var n, l$1, u$2, t$1, r$1, o$2, f$2, e$2, c$1 = {}, s$1 = [], a$2 = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
  function h$1(n2, l2) {
    for (var u2 in l2)
      n2[u2] = l2[u2];
    return n2;
  }
  function v$1(n2) {
    var l2 = n2.parentNode;
    l2 && l2.removeChild(n2);
  }
  function y$1(l2, u2, i2) {
    var t2, r2, o2, f2 = {};
    for (o2 in u2)
      "key" == o2 ? t2 = u2[o2] : "ref" == o2 ? r2 = u2[o2] : f2[o2] = u2[o2];
    if (arguments.length > 2 && (f2.children = arguments.length > 3 ? n.call(arguments, 2) : i2), "function" == typeof l2 && null != l2.defaultProps)
      for (o2 in l2.defaultProps)
        void 0 === f2[o2] && (f2[o2] = l2.defaultProps[o2]);
    return p$2(l2, f2, t2, r2, null);
  }
  function p$2(n2, i2, t2, r2, o2) {
    var f2 = { type: n2, props: i2, key: t2, ref: r2, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, __h: null, constructor: void 0, __v: null == o2 ? ++u$2 : o2 };
    return null == o2 && null != l$1.vnode && l$1.vnode(f2), f2;
  }
  function d$1() {
    return { current: null };
  }
  function _$2(n2) {
    return n2.children;
  }
  function k$2(n2, l2, u2, i2, t2) {
    var r2;
    for (r2 in u2)
      "children" === r2 || "key" === r2 || r2 in l2 || g$2(n2, r2, null, u2[r2], i2);
    for (r2 in l2)
      t2 && "function" != typeof l2[r2] || "children" === r2 || "key" === r2 || "value" === r2 || "checked" === r2 || u2[r2] === l2[r2] || g$2(n2, r2, l2[r2], u2[r2], i2);
  }
  function b$1(n2, l2, u2) {
    "-" === l2[0] ? n2.setProperty(l2, null == u2 ? "" : u2) : n2[l2] = null == u2 ? "" : "number" != typeof u2 || a$2.test(l2) ? u2 : u2 + "px";
  }
  function g$2(n2, l2, u2, i2, t2) {
    var r2;
    n:
      if ("style" === l2)
        if ("string" == typeof u2)
          n2.style.cssText = u2;
        else {
          if ("string" == typeof i2 && (n2.style.cssText = i2 = ""), i2)
            for (l2 in i2)
              u2 && l2 in u2 || b$1(n2.style, l2, "");
          if (u2)
            for (l2 in u2)
              i2 && u2[l2] === i2[l2] || b$1(n2.style, l2, u2[l2]);
        }
      else if ("o" === l2[0] && "n" === l2[1])
        r2 = l2 !== (l2 = l2.replace(/Capture$/, "")), l2 = l2.toLowerCase() in n2 ? l2.toLowerCase().slice(2) : l2.slice(2), n2.l || (n2.l = {}), n2.l[l2 + r2] = u2, u2 ? i2 || n2.addEventListener(l2, r2 ? w$2 : m$1, r2) : n2.removeEventListener(l2, r2 ? w$2 : m$1, r2);
      else if ("dangerouslySetInnerHTML" !== l2) {
        if (t2)
          l2 = l2.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
        else if ("width" !== l2 && "height" !== l2 && "href" !== l2 && "list" !== l2 && "form" !== l2 && "tabIndex" !== l2 && "download" !== l2 && l2 in n2)
          try {
            n2[l2] = null == u2 ? "" : u2;
            break n;
          } catch (n3) {
          }
        "function" == typeof u2 || (null == u2 || false === u2 && -1 == l2.indexOf("-") ? n2.removeAttribute(l2) : n2.setAttribute(l2, u2));
      }
  }
  function m$1(n2) {
    t$1 = true;
    try {
      return this.l[n2.type + false](l$1.event ? l$1.event(n2) : n2);
    } finally {
      t$1 = false;
    }
  }
  function w$2(n2) {
    t$1 = true;
    try {
      return this.l[n2.type + true](l$1.event ? l$1.event(n2) : n2);
    } finally {
      t$1 = false;
    }
  }
  function x$2(n2, l2) {
    this.props = n2, this.context = l2;
  }
  function A$3(n2, l2) {
    if (null == l2)
      return n2.__ ? A$3(n2.__, n2.__.__k.indexOf(n2) + 1) : null;
    for (var u2; l2 < n2.__k.length; l2++)
      if (null != (u2 = n2.__k[l2]) && null != u2.__e)
        return u2.__e;
    return "function" == typeof n2.type ? A$3(n2) : null;
  }
  function P$2(n2) {
    var l2, u2;
    if (null != (n2 = n2.__) && null != n2.__c) {
      for (n2.__e = n2.__c.base = null, l2 = 0; l2 < n2.__k.length; l2++)
        if (null != (u2 = n2.__k[l2]) && null != u2.__e) {
          n2.__e = n2.__c.base = u2.__e;
          break;
        }
      return P$2(n2);
    }
  }
  function C$1(n2) {
    t$1 ? setTimeout(n2) : f$2(n2);
  }
  function T$3(n2) {
    (!n2.__d && (n2.__d = true) && r$1.push(n2) && !$$1.__r++ || o$2 !== l$1.debounceRendering) && ((o$2 = l$1.debounceRendering) || C$1)($$1);
  }
  function $$1() {
    var n2, l2, u2, i2, t2, o2, f2, e2;
    for (r$1.sort(function(n3, l3) {
      return n3.__v.__b - l3.__v.__b;
    }); n2 = r$1.shift(); )
      n2.__d && (l2 = r$1.length, i2 = void 0, t2 = void 0, f2 = (o2 = (u2 = n2).__v).__e, (e2 = u2.__P) && (i2 = [], (t2 = h$1({}, o2)).__v = o2.__v + 1, M$1(e2, o2, t2, u2.__n, void 0 !== e2.ownerSVGElement, null != o2.__h ? [f2] : null, i2, null == f2 ? A$3(o2) : f2, o2.__h), N$1(i2, o2), o2.__e != f2 && P$2(o2)), r$1.length > l2 && r$1.sort(function(n3, l3) {
        return n3.__v.__b - l3.__v.__b;
      }));
    $$1.__r = 0;
  }
  function H$1(n2, l2, u2, i2, t2, r2, o2, f2, e2, a2) {
    var h2, v2, y2, d2, k2, b2, g2, m2 = i2 && i2.__k || s$1, w2 = m2.length;
    for (u2.__k = [], h2 = 0; h2 < l2.length; h2++)
      if (null != (d2 = u2.__k[h2] = null == (d2 = l2[h2]) || "boolean" == typeof d2 ? null : "string" == typeof d2 || "number" == typeof d2 || "bigint" == typeof d2 ? p$2(null, d2, null, null, d2) : Array.isArray(d2) ? p$2(_$2, { children: d2 }, null, null, null) : d2.__b > 0 ? p$2(d2.type, d2.props, d2.key, d2.ref ? d2.ref : null, d2.__v) : d2)) {
        if (d2.__ = u2, d2.__b = u2.__b + 1, null === (y2 = m2[h2]) || y2 && d2.key == y2.key && d2.type === y2.type)
          m2[h2] = void 0;
        else
          for (v2 = 0; v2 < w2; v2++) {
            if ((y2 = m2[v2]) && d2.key == y2.key && d2.type === y2.type) {
              m2[v2] = void 0;
              break;
            }
            y2 = null;
          }
        M$1(n2, d2, y2 = y2 || c$1, t2, r2, o2, f2, e2, a2), k2 = d2.__e, (v2 = d2.ref) && y2.ref != v2 && (g2 || (g2 = []), y2.ref && g2.push(y2.ref, null, d2), g2.push(v2, d2.__c || k2, d2)), null != k2 ? (null == b2 && (b2 = k2), "function" == typeof d2.type && d2.__k === y2.__k ? d2.__d = e2 = I$1(d2, e2, n2) : e2 = z$3(n2, d2, y2, m2, k2, e2), "function" == typeof u2.type && (u2.__d = e2)) : e2 && y2.__e == e2 && e2.parentNode != n2 && (e2 = A$3(y2));
      }
    for (u2.__e = b2, h2 = w2; h2--; )
      null != m2[h2] && ("function" == typeof u2.type && null != m2[h2].__e && m2[h2].__e == u2.__d && (u2.__d = L$2(i2).nextSibling), q$2(m2[h2], m2[h2]));
    if (g2)
      for (h2 = 0; h2 < g2.length; h2++)
        S(g2[h2], g2[++h2], g2[++h2]);
  }
  function I$1(n2, l2, u2) {
    for (var i2, t2 = n2.__k, r2 = 0; t2 && r2 < t2.length; r2++)
      (i2 = t2[r2]) && (i2.__ = n2, l2 = "function" == typeof i2.type ? I$1(i2, l2, u2) : z$3(u2, i2, i2, t2, i2.__e, l2));
    return l2;
  }
  function j$2(n2, l2) {
    return l2 = l2 || [], null == n2 || "boolean" == typeof n2 || (Array.isArray(n2) ? n2.some(function(n3) {
      j$2(n3, l2);
    }) : l2.push(n2)), l2;
  }
  function z$3(n2, l2, u2, i2, t2, r2) {
    var o2, f2, e2;
    if (void 0 !== l2.__d)
      o2 = l2.__d, l2.__d = void 0;
    else if (null == u2 || t2 != r2 || null == t2.parentNode)
      n:
        if (null == r2 || r2.parentNode !== n2)
          n2.appendChild(t2), o2 = null;
        else {
          for (f2 = r2, e2 = 0; (f2 = f2.nextSibling) && e2 < i2.length; e2 += 1)
            if (f2 == t2)
              break n;
          n2.insertBefore(t2, r2), o2 = r2;
        }
    return void 0 !== o2 ? o2 : t2.nextSibling;
  }
  function L$2(n2) {
    var l2, u2, i2;
    if (null == n2.type || "string" == typeof n2.type)
      return n2.__e;
    if (n2.__k) {
      for (l2 = n2.__k.length - 1; l2 >= 0; l2--)
        if ((u2 = n2.__k[l2]) && (i2 = L$2(u2)))
          return i2;
    }
    return null;
  }
  function M$1(n2, u2, i2, t2, r2, o2, f2, e2, c2) {
    var s2, a2, v2, y2, p2, d2, k2, b2, g2, m2, w2, A2, P2, C2, T2, $2 = u2.type;
    if (void 0 !== u2.constructor)
      return null;
    null != i2.__h && (c2 = i2.__h, e2 = u2.__e = i2.__e, u2.__h = null, o2 = [e2]), (s2 = l$1.__b) && s2(u2);
    try {
      n:
        if ("function" == typeof $2) {
          if (b2 = u2.props, g2 = (s2 = $2.contextType) && t2[s2.__c], m2 = s2 ? g2 ? g2.props.value : s2.__ : t2, i2.__c ? k2 = (a2 = u2.__c = i2.__c).__ = a2.__E : ("prototype" in $2 && $2.prototype.render ? u2.__c = a2 = new $2(b2, m2) : (u2.__c = a2 = new x$2(b2, m2), a2.constructor = $2, a2.render = B$2), g2 && g2.sub(a2), a2.props = b2, a2.state || (a2.state = {}), a2.context = m2, a2.__n = t2, v2 = a2.__d = true, a2.__h = [], a2._sb = []), null == a2.__s && (a2.__s = a2.state), null != $2.getDerivedStateFromProps && (a2.__s == a2.state && (a2.__s = h$1({}, a2.__s)), h$1(a2.__s, $2.getDerivedStateFromProps(b2, a2.__s))), y2 = a2.props, p2 = a2.state, a2.__v = u2, v2)
            null == $2.getDerivedStateFromProps && null != a2.componentWillMount && a2.componentWillMount(), null != a2.componentDidMount && a2.__h.push(a2.componentDidMount);
          else {
            if (null == $2.getDerivedStateFromProps && b2 !== y2 && null != a2.componentWillReceiveProps && a2.componentWillReceiveProps(b2, m2), !a2.__e && null != a2.shouldComponentUpdate && false === a2.shouldComponentUpdate(b2, a2.__s, m2) || u2.__v === i2.__v) {
              for (u2.__v !== i2.__v && (a2.props = b2, a2.state = a2.__s, a2.__d = false), u2.__e = i2.__e, u2.__k = i2.__k, u2.__k.forEach(function(n3) {
                n3 && (n3.__ = u2);
              }), w2 = 0; w2 < a2._sb.length; w2++)
                a2.__h.push(a2._sb[w2]);
              a2._sb = [], a2.__h.length && f2.push(a2);
              break n;
            }
            null != a2.componentWillUpdate && a2.componentWillUpdate(b2, a2.__s, m2), null != a2.componentDidUpdate && a2.__h.push(function() {
              a2.componentDidUpdate(y2, p2, d2);
            });
          }
          if (a2.context = m2, a2.props = b2, a2.__P = n2, A2 = l$1.__r, P2 = 0, "prototype" in $2 && $2.prototype.render) {
            for (a2.state = a2.__s, a2.__d = false, A2 && A2(u2), s2 = a2.render(a2.props, a2.state, a2.context), C2 = 0; C2 < a2._sb.length; C2++)
              a2.__h.push(a2._sb[C2]);
            a2._sb = [];
          } else
            do {
              a2.__d = false, A2 && A2(u2), s2 = a2.render(a2.props, a2.state, a2.context), a2.state = a2.__s;
            } while (a2.__d && ++P2 < 25);
          a2.state = a2.__s, null != a2.getChildContext && (t2 = h$1(h$1({}, t2), a2.getChildContext())), v2 || null == a2.getSnapshotBeforeUpdate || (d2 = a2.getSnapshotBeforeUpdate(y2, p2)), T2 = null != s2 && s2.type === _$2 && null == s2.key ? s2.props.children : s2, H$1(n2, Array.isArray(T2) ? T2 : [T2], u2, i2, t2, r2, o2, f2, e2, c2), a2.base = u2.__e, u2.__h = null, a2.__h.length && f2.push(a2), k2 && (a2.__E = a2.__ = null), a2.__e = false;
        } else
          null == o2 && u2.__v === i2.__v ? (u2.__k = i2.__k, u2.__e = i2.__e) : u2.__e = O$1(i2.__e, u2, i2, t2, r2, o2, f2, c2);
      (s2 = l$1.diffed) && s2(u2);
    } catch (n3) {
      u2.__v = null, (c2 || null != o2) && (u2.__e = e2, u2.__h = !!c2, o2[o2.indexOf(e2)] = null), l$1.__e(n3, u2, i2);
    }
  }
  function N$1(n2, u2) {
    l$1.__c && l$1.__c(u2, n2), n2.some(function(u3) {
      try {
        n2 = u3.__h, u3.__h = [], n2.some(function(n3) {
          n3.call(u3);
        });
      } catch (n3) {
        l$1.__e(n3, u3.__v);
      }
    });
  }
  function O$1(l2, u2, i2, t2, r2, o2, f2, e2) {
    var s2, a2, h2, y2 = i2.props, p2 = u2.props, d2 = u2.type, _2 = 0;
    if ("svg" === d2 && (r2 = true), null != o2) {
      for (; _2 < o2.length; _2++)
        if ((s2 = o2[_2]) && "setAttribute" in s2 == !!d2 && (d2 ? s2.localName === d2 : 3 === s2.nodeType)) {
          l2 = s2, o2[_2] = null;
          break;
        }
    }
    if (null == l2) {
      if (null === d2)
        return document.createTextNode(p2);
      l2 = r2 ? document.createElementNS("http://www.w3.org/2000/svg", d2) : document.createElement(d2, p2.is && p2), o2 = null, e2 = false;
    }
    if (null === d2)
      y2 === p2 || e2 && l2.data === p2 || (l2.data = p2);
    else {
      if (o2 = o2 && n.call(l2.childNodes), a2 = (y2 = i2.props || c$1).dangerouslySetInnerHTML, h2 = p2.dangerouslySetInnerHTML, !e2) {
        if (null != o2)
          for (y2 = {}, _2 = 0; _2 < l2.attributes.length; _2++)
            y2[l2.attributes[_2].name] = l2.attributes[_2].value;
        (h2 || a2) && (h2 && (a2 && h2.__html == a2.__html || h2.__html === l2.innerHTML) || (l2.innerHTML = h2 && h2.__html || ""));
      }
      if (k$2(l2, p2, y2, r2, e2), h2)
        u2.__k = [];
      else if (_2 = u2.props.children, H$1(l2, Array.isArray(_2) ? _2 : [_2], u2, i2, t2, r2 && "foreignObject" !== d2, o2, f2, o2 ? o2[0] : i2.__k && A$3(i2, 0), e2), null != o2)
        for (_2 = o2.length; _2--; )
          null != o2[_2] && v$1(o2[_2]);
      e2 || ("value" in p2 && void 0 !== (_2 = p2.value) && (_2 !== l2.value || "progress" === d2 && !_2 || "option" === d2 && _2 !== y2.value) && g$2(l2, "value", _2, y2.value, false), "checked" in p2 && void 0 !== (_2 = p2.checked) && _2 !== l2.checked && g$2(l2, "checked", _2, y2.checked, false));
    }
    return l2;
  }
  function S(n2, u2, i2) {
    try {
      "function" == typeof n2 ? n2(u2) : n2.current = u2;
    } catch (n3) {
      l$1.__e(n3, i2);
    }
  }
  function q$2(n2, u2, i2) {
    var t2, r2;
    if (l$1.unmount && l$1.unmount(n2), (t2 = n2.ref) && (t2.current && t2.current !== n2.__e || S(t2, null, u2)), null != (t2 = n2.__c)) {
      if (t2.componentWillUnmount)
        try {
          t2.componentWillUnmount();
        } catch (n3) {
          l$1.__e(n3, u2);
        }
      t2.base = t2.__P = null, n2.__c = void 0;
    }
    if (t2 = n2.__k)
      for (r2 = 0; r2 < t2.length; r2++)
        t2[r2] && q$2(t2[r2], u2, i2 || "function" != typeof n2.type);
    i2 || null == n2.__e || v$1(n2.__e), n2.__ = n2.__e = n2.__d = void 0;
  }
  function B$2(n2, l2, u2) {
    return this.constructor(n2, u2);
  }
  function D$1(u2, i2, t2) {
    var r2, o2, f2;
    l$1.__ && l$1.__(u2, i2), o2 = (r2 = "function" == typeof t2) ? null : t2 && t2.__k || i2.__k, f2 = [], M$1(i2, u2 = (!r2 && t2 || i2).__k = y$1(_$2, null, [u2]), o2 || c$1, c$1, void 0 !== i2.ownerSVGElement, !r2 && t2 ? [t2] : o2 ? null : i2.firstChild ? n.call(i2.childNodes) : null, f2, !r2 && t2 ? t2 : o2 ? o2.__e : i2.firstChild, r2), N$1(f2, u2);
  }
  function E$2(n2, l2) {
    D$1(n2, l2, E$2);
  }
  function F$3(l2, u2, i2) {
    var t2, r2, o2, f2 = h$1({}, l2.props);
    for (o2 in u2)
      "key" == o2 ? t2 = u2[o2] : "ref" == o2 ? r2 = u2[o2] : f2[o2] = u2[o2];
    return arguments.length > 2 && (f2.children = arguments.length > 3 ? n.call(arguments, 2) : i2), p$2(l2.type, f2, t2 || l2.key, r2 || l2.ref, null);
  }
  function G$1(n2, l2) {
    var u2 = { __c: l2 = "__cC" + e$2++, __: n2, Consumer: function(n3, l3) {
      return n3.children(l3);
    }, Provider: function(n3) {
      var u3, i2;
      return this.getChildContext || (u3 = [], (i2 = {})[l2] = this, this.getChildContext = function() {
        return i2;
      }, this.shouldComponentUpdate = function(n4) {
        this.props.value !== n4.value && u3.some(function(n5) {
          n5.__e = true, T$3(n5);
        });
      }, this.sub = function(n4) {
        u3.push(n4);
        var l3 = n4.componentWillUnmount;
        n4.componentWillUnmount = function() {
          u3.splice(u3.indexOf(n4), 1), l3 && l3.call(n4);
        };
      }), n3.children;
    } };
    return u2.Provider.__ = u2.Consumer.contextType = u2;
  }
  n = s$1.slice, l$1 = { __e: function(n2, l2, u2, i2) {
    for (var t2, r2, o2; l2 = l2.__; )
      if ((t2 = l2.__c) && !t2.__)
        try {
          if ((r2 = t2.constructor) && null != r2.getDerivedStateFromError && (t2.setState(r2.getDerivedStateFromError(n2)), o2 = t2.__d), null != t2.componentDidCatch && (t2.componentDidCatch(n2, i2 || {}), o2 = t2.__d), o2)
            return t2.__E = t2;
        } catch (l3) {
          n2 = l3;
        }
    throw n2;
  } }, u$2 = 0, t$1 = false, x$2.prototype.setState = function(n2, l2) {
    var u2;
    u2 = null != this.__s && this.__s !== this.state ? this.__s : this.__s = h$1({}, this.state), "function" == typeof n2 && (n2 = n2(h$1({}, u2), this.props)), n2 && h$1(u2, n2), null != n2 && this.__v && (l2 && this._sb.push(l2), T$3(this));
  }, x$2.prototype.forceUpdate = function(n2) {
    this.__v && (this.__e = true, n2 && this.__h.push(n2), T$3(this));
  }, x$2.prototype.render = _$2, r$1 = [], f$2 = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, $$1.__r = 0, e$2 = 0;
  var t, r, u$1, i$4, o$1 = 0, f$1 = [], c = [], e$1 = l$1.__b, a$1 = l$1.__r, v = l$1.diffed, l = l$1.__c, m = l$1.unmount;
  function d(t2, u2) {
    l$1.__h && l$1.__h(r, t2, o$1 || u2), o$1 = 0;
    var i2 = r.__H || (r.__H = { __: [], __h: [] });
    return t2 >= i2.__.length && i2.__.push({ __V: c }), i2.__[t2];
  }
  function p$1(n2) {
    return o$1 = 1, y(B$1, n2);
  }
  function y(n2, u2, i2) {
    var o2 = d(t++, 2);
    if (o2.t = n2, !o2.__c && (o2.__ = [i2 ? i2(u2) : B$1(void 0, u2), function(n3) {
      var t2 = o2.__N ? o2.__N[0] : o2.__[0], r2 = o2.t(t2, n3);
      t2 !== r2 && (o2.__N = [r2, o2.__[1]], o2.__c.setState({}));
    }], o2.__c = r, !r.u)) {
      r.u = true;
      var f2 = r.shouldComponentUpdate;
      r.shouldComponentUpdate = function(n3, t2, r2) {
        if (!o2.__c.__H)
          return true;
        var u3 = o2.__c.__H.__.filter(function(n4) {
          return n4.__c;
        });
        if (u3.every(function(n4) {
          return !n4.__N;
        }))
          return !f2 || f2.call(this, n3, t2, r2);
        var i3 = false;
        return u3.forEach(function(n4) {
          if (n4.__N) {
            var t3 = n4.__[0];
            n4.__ = n4.__N, n4.__N = void 0, t3 !== n4.__[0] && (i3 = true);
          }
        }), !(!i3 && o2.__c.props === n3) && (!f2 || f2.call(this, n3, t2, r2));
      };
    }
    return o2.__N || o2.__;
  }
  function h(u2, i2) {
    var o2 = d(t++, 3);
    !l$1.__s && z$2(o2.__H, i2) && (o2.__ = u2, o2.i = i2, r.__H.__h.push(o2));
  }
  function s(u2, i2) {
    var o2 = d(t++, 4);
    !l$1.__s && z$2(o2.__H, i2) && (o2.__ = u2, o2.i = i2, r.__h.push(o2));
  }
  function _$1(n2) {
    return o$1 = 5, F$2(function() {
      return { current: n2 };
    }, []);
  }
  function A$2(n2, t2, r2) {
    o$1 = 6, s(function() {
      return "function" == typeof n2 ? (n2(t2()), function() {
        return n2(null);
      }) : n2 ? (n2.current = t2(), function() {
        return n2.current = null;
      }) : void 0;
    }, null == r2 ? r2 : r2.concat(n2));
  }
  function F$2(n2, r2) {
    var u2 = d(t++, 7);
    return z$2(u2.__H, r2) ? (u2.__V = n2(), u2.i = r2, u2.__h = n2, u2.__V) : u2.__;
  }
  function T$2(n2, t2) {
    return o$1 = 8, F$2(function() {
      return n2;
    }, t2);
  }
  function q$1(n2) {
    var u2 = r.context[n2.__c], i2 = d(t++, 9);
    return i2.c = n2, u2 ? (null == i2.__ && (i2.__ = true, u2.sub(r)), u2.props.value) : n2.__;
  }
  function x$1(t2, r2) {
    l$1.useDebugValue && l$1.useDebugValue(r2 ? r2(t2) : t2);
  }
  function P$1(n2) {
    var u2 = d(t++, 10), i2 = p$1();
    return u2.__ = n2, r.componentDidCatch || (r.componentDidCatch = function(n3, t2) {
      u2.__ && u2.__(n3, t2), i2[1](n3);
    }), [i2[0], function() {
      i2[1](void 0);
    }];
  }
  function V$2() {
    var n2 = d(t++, 11);
    if (!n2.__) {
      for (var u2 = r.__v; null !== u2 && !u2.__m && null !== u2.__; )
        u2 = u2.__;
      var i2 = u2.__m || (u2.__m = [0, 0]);
      n2.__ = "P" + i2[0] + "-" + i2[1]++;
    }
    return n2.__;
  }
  function b() {
    for (var t2; t2 = f$1.shift(); )
      if (t2.__P && t2.__H)
        try {
          t2.__H.__h.forEach(k$1), t2.__H.__h.forEach(w$1), t2.__H.__h = [];
        } catch (r2) {
          t2.__H.__h = [], l$1.__e(r2, t2.__v);
        }
  }
  l$1.__b = function(n2) {
    r = null, e$1 && e$1(n2);
  }, l$1.__r = function(n2) {
    a$1 && a$1(n2), t = 0;
    var i2 = (r = n2.__c).__H;
    i2 && (u$1 === r ? (i2.__h = [], r.__h = [], i2.__.forEach(function(n3) {
      n3.__N && (n3.__ = n3.__N), n3.__V = c, n3.__N = n3.i = void 0;
    })) : (i2.__h.forEach(k$1), i2.__h.forEach(w$1), i2.__h = [])), u$1 = r;
  }, l$1.diffed = function(t2) {
    v && v(t2);
    var o2 = t2.__c;
    o2 && o2.__H && (o2.__H.__h.length && (1 !== f$1.push(o2) && i$4 === l$1.requestAnimationFrame || ((i$4 = l$1.requestAnimationFrame) || j$1)(b)), o2.__H.__.forEach(function(n2) {
      n2.i && (n2.__H = n2.i), n2.__V !== c && (n2.__ = n2.__V), n2.i = void 0, n2.__V = c;
    })), u$1 = r = null;
  }, l$1.__c = function(t2, r2) {
    r2.some(function(t3) {
      try {
        t3.__h.forEach(k$1), t3.__h = t3.__h.filter(function(n2) {
          return !n2.__ || w$1(n2);
        });
      } catch (u2) {
        r2.some(function(n2) {
          n2.__h && (n2.__h = []);
        }), r2 = [], l$1.__e(u2, t3.__v);
      }
    }), l && l(t2, r2);
  }, l$1.unmount = function(t2) {
    m && m(t2);
    var r2, u2 = t2.__c;
    u2 && u2.__H && (u2.__H.__.forEach(function(n2) {
      try {
        k$1(n2);
      } catch (n3) {
        r2 = n3;
      }
    }), u2.__H = void 0, r2 && l$1.__e(r2, u2.__v));
  };
  var g$1 = "function" == typeof requestAnimationFrame;
  function j$1(n2) {
    var t2, r2 = function() {
      clearTimeout(u2), g$1 && cancelAnimationFrame(t2), setTimeout(n2);
    }, u2 = setTimeout(r2, 100);
    g$1 && (t2 = requestAnimationFrame(r2));
  }
  function k$1(n2) {
    var t2 = r, u2 = n2.__c;
    "function" == typeof u2 && (n2.__c = void 0, u2()), r = t2;
  }
  function w$1(n2) {
    var t2 = r;
    n2.__c = n2.__(), r = t2;
  }
  function z$2(n2, t2) {
    return !n2 || n2.length !== t2.length || t2.some(function(t3, r2) {
      return t3 !== n2[r2];
    });
  }
  function B$1(n2, t2) {
    return "function" == typeof t2 ? t2(n2) : t2;
  }
  function _extends() {
    _extends = Object.assign ? Object.assign.bind() : function(target) {
      for (var i2 = 1; i2 < arguments.length; i2++) {
        var source = arguments[i2];
        for (var key2 in source) {
          if (Object.prototype.hasOwnProperty.call(source, key2)) {
            target[key2] = source[key2];
          }
        }
      }
      return target;
    };
    return _extends.apply(this, arguments);
  }
  function g(n2, t2) {
    for (var e2 in t2)
      n2[e2] = t2[e2];
    return n2;
  }
  function C(n2, t2) {
    for (var e2 in n2)
      if ("__source" !== e2 && !(e2 in t2))
        return true;
    for (var r2 in t2)
      if ("__source" !== r2 && n2[r2] !== t2[r2])
        return true;
    return false;
  }
  function E$1(n2, t2) {
    return n2 === t2 && (0 !== n2 || 1 / n2 == 1 / t2) || n2 != n2 && t2 != t2;
  }
  function w(n2) {
    this.props = n2;
  }
  function R(n2, e2) {
    function r2(n3) {
      var t2 = this.props.ref, r3 = t2 == n3.ref;
      return !r3 && t2 && (t2.call ? t2(null) : t2.current = null), e2 ? !e2(this.props, n3) || !r3 : C(this.props, n3);
    }
    function u2(e3) {
      return this.shouldComponentUpdate = r2, y$1(n2, e3);
    }
    return u2.displayName = "Memo(" + (n2.displayName || n2.name) + ")", u2.prototype.isReactComponent = true, u2.__f = true, u2;
  }
  (w.prototype = new x$2()).isPureReactComponent = true, w.prototype.shouldComponentUpdate = function(n2, t2) {
    return C(this.props, n2) || C(this.state, t2);
  };
  var x = l$1.__b;
  l$1.__b = function(n2) {
    n2.type && n2.type.__f && n2.ref && (n2.props.ref = n2.ref, n2.ref = null), x && x(n2);
  };
  var N = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.forward_ref") || 3911;
  function k(n2) {
    function t2(t3) {
      var e2 = g({}, t3);
      return delete e2.ref, n2(e2, t3.ref || null);
    }
    return t2.$$typeof = N, t2.render = t2, t2.prototype.isReactComponent = t2.__f = true, t2.displayName = "ForwardRef(" + (n2.displayName || n2.name) + ")", t2;
  }
  var A$1 = function(n2, t2) {
    return null == n2 ? null : j$2(j$2(n2).map(t2));
  }, O = { map: A$1, forEach: A$1, count: function(n2) {
    return n2 ? j$2(n2).length : 0;
  }, only: function(n2) {
    var t2 = j$2(n2);
    if (1 !== t2.length)
      throw "Children.only";
    return t2[0];
  }, toArray: j$2 }, T$1 = l$1.__e;
  l$1.__e = function(n2, t2, e2, r2) {
    if (n2.then) {
      for (var u2, o2 = t2; o2 = o2.__; )
        if ((u2 = o2.__c) && u2.__c)
          return null == t2.__e && (t2.__e = e2.__e, t2.__k = e2.__k), u2.__c(n2, t2);
    }
    T$1(n2, t2, e2, r2);
  };
  var I = l$1.unmount;
  function L$1(n2, t2, e2) {
    return n2 && (n2.__c && n2.__c.__H && (n2.__c.__H.__.forEach(function(n3) {
      "function" == typeof n3.__c && n3.__c();
    }), n2.__c.__H = null), null != (n2 = g({}, n2)).__c && (n2.__c.__P === e2 && (n2.__c.__P = t2), n2.__c = null), n2.__k = n2.__k && n2.__k.map(function(n3) {
      return L$1(n3, t2, e2);
    })), n2;
  }
  function U$1(n2, t2, e2) {
    return n2 && (n2.__v = null, n2.__k = n2.__k && n2.__k.map(function(n3) {
      return U$1(n3, t2, e2);
    }), n2.__c && n2.__c.__P === t2 && (n2.__e && e2.insertBefore(n2.__e, n2.__d), n2.__c.__e = true, n2.__c.__P = e2)), n2;
  }
  function D() {
    this.__u = 0, this.t = null, this.__b = null;
  }
  function F$1(n2) {
    var t2 = n2.__.__c;
    return t2 && t2.__a && t2.__a(n2);
  }
  function M(n2) {
    var e2, r2, u2;
    function o2(o3) {
      if (e2 || (e2 = n2()).then(function(n3) {
        r2 = n3.default || n3;
      }, function(n3) {
        u2 = n3;
      }), u2)
        throw u2;
      if (!r2)
        throw e2;
      return y$1(r2, o3);
    }
    return o2.displayName = "Lazy", o2.__f = true, o2;
  }
  function V$1() {
    this.u = null, this.o = null;
  }
  l$1.unmount = function(n2) {
    var t2 = n2.__c;
    t2 && t2.__R && t2.__R(), t2 && true === n2.__h && (n2.type = null), I && I(n2);
  }, (D.prototype = new x$2()).__c = function(n2, t2) {
    var e2 = t2.__c, r2 = this;
    null == r2.t && (r2.t = []), r2.t.push(e2);
    var u2 = F$1(r2.__v), o2 = false, i2 = function() {
      o2 || (o2 = true, e2.__R = null, u2 ? u2(l2) : l2());
    };
    e2.__R = i2;
    var l2 = function() {
      if (!--r2.__u) {
        if (r2.state.__a) {
          var n3 = r2.state.__a;
          r2.__v.__k[0] = U$1(n3, n3.__c.__P, n3.__c.__O);
        }
        var t3;
        for (r2.setState({ __a: r2.__b = null }); t3 = r2.t.pop(); )
          t3.forceUpdate();
      }
    }, c2 = true === t2.__h;
    r2.__u++ || c2 || r2.setState({ __a: r2.__b = r2.__v.__k[0] }), n2.then(i2, i2);
  }, D.prototype.componentWillUnmount = function() {
    this.t = [];
  }, D.prototype.render = function(n2, e2) {
    if (this.__b) {
      if (this.__v.__k) {
        var r2 = document.createElement("div"), o2 = this.__v.__k[0].__c;
        this.__v.__k[0] = L$1(this.__b, r2, o2.__O = o2.__P);
      }
      this.__b = null;
    }
    var i2 = e2.__a && y$1(_$2, null, n2.fallback);
    return i2 && (i2.__h = null), [y$1(_$2, null, e2.__a ? null : n2.children), i2];
  };
  var W = function(n2, t2, e2) {
    if (++e2[1] === e2[0] && n2.o.delete(t2), n2.props.revealOrder && ("t" !== n2.props.revealOrder[0] || !n2.o.size))
      for (e2 = n2.u; e2; ) {
        for (; e2.length > 3; )
          e2.pop()();
        if (e2[1] < e2[0])
          break;
        n2.u = e2 = e2[2];
      }
  };
  function P(n2) {
    return this.getChildContext = function() {
      return n2.context;
    }, n2.children;
  }
  function $(n2) {
    var e2 = this, r2 = n2.i;
    e2.componentWillUnmount = function() {
      D$1(null, e2.l), e2.l = null, e2.i = null;
    }, e2.i && e2.i !== r2 && e2.componentWillUnmount(), n2.__v ? (e2.l || (e2.i = r2, e2.l = { nodeType: 1, parentNode: r2, childNodes: [], appendChild: function(n3) {
      this.childNodes.push(n3), e2.i.appendChild(n3);
    }, insertBefore: function(n3, t2) {
      this.childNodes.push(n3), e2.i.appendChild(n3);
    }, removeChild: function(n3) {
      this.childNodes.splice(this.childNodes.indexOf(n3) >>> 1, 1), e2.i.removeChild(n3);
    } }), D$1(y$1(P, { context: e2.context }, n2.__v), e2.l)) : e2.l && e2.componentWillUnmount();
  }
  function j(n2, e2) {
    var r2 = y$1($, { __v: n2, i: e2 });
    return r2.containerInfo = e2, r2;
  }
  (V$1.prototype = new x$2()).__a = function(n2) {
    var t2 = this, e2 = F$1(t2.__v), r2 = t2.o.get(n2);
    return r2[0]++, function(u2) {
      var o2 = function() {
        t2.props.revealOrder ? (r2.push(u2), W(t2, n2, r2)) : u2();
      };
      e2 ? e2(o2) : o2();
    };
  }, V$1.prototype.render = function(n2) {
    this.u = null, this.o = /* @__PURE__ */ new Map();
    var t2 = j$2(n2.children);
    n2.revealOrder && "b" === n2.revealOrder[0] && t2.reverse();
    for (var e2 = t2.length; e2--; )
      this.o.set(t2[e2], this.u = [1, 0, this.u]);
    return n2.children;
  }, V$1.prototype.componentDidUpdate = V$1.prototype.componentDidMount = function() {
    var n2 = this;
    this.o.forEach(function(t2, e2) {
      W(n2, e2, t2);
    });
  };
  var z$1 = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.element") || 60103, B = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/, H = "undefined" != typeof document, Z$1 = function(n2) {
    return ("undefined" != typeof Symbol && "symbol" == typeof Symbol() ? /fil|che|rad/i : /fil|che|ra/i).test(n2);
  };
  function Y(n2, t2, e2) {
    return null == t2.__k && (t2.textContent = ""), D$1(n2, t2), "function" == typeof e2 && e2(), n2 ? n2.__c : null;
  }
  function q(n2, t2, e2) {
    return E$2(n2, t2), "function" == typeof e2 && e2(), n2 ? n2.__c : null;
  }
  x$2.prototype.isReactComponent = {}, ["componentWillMount", "componentWillReceiveProps", "componentWillUpdate"].forEach(function(t2) {
    Object.defineProperty(x$2.prototype, t2, { configurable: true, get: function() {
      return this["UNSAFE_" + t2];
    }, set: function(n2) {
      Object.defineProperty(this, t2, { configurable: true, writable: true, value: n2 });
    } });
  });
  var G = l$1.event;
  function J() {
  }
  function K() {
    return this.cancelBubble;
  }
  function Q() {
    return this.defaultPrevented;
  }
  l$1.event = function(n2) {
    return G && (n2 = G(n2)), n2.persist = J, n2.isPropagationStopped = K, n2.isDefaultPrevented = Q, n2.nativeEvent = n2;
  };
  var X, nn = { configurable: true, get: function() {
    return this.class;
  } }, tn = l$1.vnode;
  l$1.vnode = function(n2) {
    var t2 = n2.type, e2 = n2.props, u2 = e2;
    if ("string" == typeof t2) {
      var o2 = -1 === t2.indexOf("-");
      for (var i2 in u2 = {}, e2) {
        var l2 = e2[i2];
        H && "children" === i2 && "noscript" === t2 || "value" === i2 && "defaultValue" in e2 && null == l2 || ("defaultValue" === i2 && "value" in e2 && null == e2.value ? i2 = "value" : "download" === i2 && true === l2 ? l2 = "" : /ondoubleclick/i.test(i2) ? i2 = "ondblclick" : /^onchange(textarea|input)/i.test(i2 + t2) && !Z$1(e2.type) ? i2 = "oninput" : /^onfocus$/i.test(i2) ? i2 = "onfocusin" : /^onblur$/i.test(i2) ? i2 = "onfocusout" : /^on(Ani|Tra|Tou|BeforeInp|Compo)/.test(i2) ? i2 = i2.toLowerCase() : o2 && B.test(i2) ? i2 = i2.replace(/[A-Z0-9]/g, "-$&").toLowerCase() : null === l2 && (l2 = void 0), /^oninput$/i.test(i2) && (i2 = i2.toLowerCase(), u2[i2] && (i2 = "oninputCapture")), u2[i2] = l2);
      }
      "select" == t2 && u2.multiple && Array.isArray(u2.value) && (u2.value = j$2(e2.children).forEach(function(n3) {
        n3.props.selected = -1 != u2.value.indexOf(n3.props.value);
      })), "select" == t2 && null != u2.defaultValue && (u2.value = j$2(e2.children).forEach(function(n3) {
        n3.props.selected = u2.multiple ? -1 != u2.defaultValue.indexOf(n3.props.value) : u2.defaultValue == n3.props.value;
      })), n2.props = u2, e2.class != e2.className && (nn.enumerable = "className" in e2, null != e2.className && (u2.class = e2.className), Object.defineProperty(u2, "className", nn));
    }
    n2.$$typeof = z$1, tn && tn(n2);
  };
  var en = l$1.__r;
  l$1.__r = function(n2) {
    en && en(n2), X = n2.__c;
  };
  var rn = { ReactCurrentDispatcher: { current: { readContext: function(n2) {
    return X.__n[n2.__c].props.value;
  } } } }, un = "17.0.2";
  function on(n2) {
    return y$1.bind(null, n2);
  }
  function ln(n2) {
    return !!n2 && n2.$$typeof === z$1;
  }
  function cn(n2) {
    return ln(n2) ? F$3.apply(null, arguments) : n2;
  }
  function fn(n2) {
    return !!n2.__k && (D$1(null, n2), true);
  }
  function an(n2) {
    return n2 && (n2.base || 1 === n2.nodeType && n2) || null;
  }
  var sn = function(n2, t2) {
    return n2(t2);
  }, hn = function(n2, t2) {
    return n2(t2);
  }, vn = _$2;
  function dn(n2) {
    n2();
  }
  function pn(n2) {
    return n2;
  }
  function mn() {
    return [false, dn];
  }
  var yn = s;
  function _n(n2, t2) {
    var e2 = t2(), r2 = p$1({ h: { __: e2, v: t2 } }), u2 = r2[0].h, o2 = r2[1];
    return s(function() {
      u2.__ = e2, u2.v = t2, E$1(u2.__, t2()) || o2({ h: u2 });
    }, [n2, e2, t2]), h(function() {
      return E$1(u2.__, u2.v()) || o2({ h: u2 }), n2(function() {
        E$1(u2.__, u2.v()) || o2({ h: u2 });
      });
    }, [n2]), e2;
  }
  var bn = { useState: p$1, useId: V$2, useReducer: y, useEffect: h, useLayoutEffect: s, useInsertionEffect: yn, useTransition: mn, useDeferredValue: pn, useSyncExternalStore: _n, startTransition: dn, useRef: _$1, useImperativeHandle: A$2, useMemo: F$2, useCallback: T$2, useContext: q$1, useDebugValue: x$1, version: "17.0.2", Children: O, render: Y, hydrate: q, unmountComponentAtNode: fn, createPortal: j, createElement: y$1, createContext: G$1, createFactory: on, cloneElement: cn, createRef: d$1, Fragment: _$2, isValidElement: ln, findDOMNode: an, Component: x$2, PureComponent: w, memo: R, forwardRef: k, flushSync: hn, unstable_batchedUpdates: sn, StrictMode: vn, Suspense: D, SuspenseList: V$1, lazy: M, __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: rn };
  const $2AODx$react = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    Children: O,
    Component: x$2,
    Fragment: _$2,
    PureComponent: w,
    StrictMode: vn,
    Suspense: D,
    SuspenseList: V$1,
    __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: rn,
    cloneElement: cn,
    createContext: G$1,
    createElement: y$1,
    createFactory: on,
    createPortal: j,
    createRef: d$1,
    default: bn,
    findDOMNode: an,
    flushSync: hn,
    forwardRef: k,
    hydrate: q,
    isValidElement: ln,
    lazy: M,
    memo: R,
    render: Y,
    startTransition: dn,
    unmountComponentAtNode: fn,
    unstable_batchedUpdates: sn,
    useCallback: T$2,
    useContext: q$1,
    useDebugValue: x$1,
    useDeferredValue: pn,
    useEffect: h,
    useErrorBoundary: P$1,
    useId: V$2,
    useImperativeHandle: A$2,
    useInsertionEffect: yn,
    useLayoutEffect: s,
    useMemo: F$2,
    useReducer: y,
    useRef: _$1,
    useState: p$1,
    useSyncExternalStore: _n,
    useTransition: mn,
    version: un
  }, Symbol.toStringTag, { value: "Module" }));
  function $e42e1063c40fb3ef$export$b9ecd428b558ff10(originalEventHandler, ourEventHandler, { checkForDefaultPrevented = true } = {}) {
    return function handleEvent(event) {
      originalEventHandler === null || originalEventHandler === void 0 || originalEventHandler(event);
      if (checkForDefaultPrevented === false || !event.defaultPrevented)
        return ourEventHandler === null || ourEventHandler === void 0 ? void 0 : ourEventHandler(event);
    };
  }
  function $6ed0406888f73fc4$var$setRef(ref, value2) {
    if (typeof ref === "function")
      ref(value2);
    else if (ref !== null && ref !== void 0)
      ref.current = value2;
  }
  function $6ed0406888f73fc4$export$43e446d32b3d21af(...refs) {
    return (node2) => refs.forEach(
      (ref) => $6ed0406888f73fc4$var$setRef(ref, node2)
    );
  }
  function $6ed0406888f73fc4$export$c7b2cbe3552a0d05(...refs) {
    return T$2($6ed0406888f73fc4$export$43e446d32b3d21af(...refs), refs);
  }
  function $c512c27ab02ef895$export$50c7b4e9d9f19c1(scopeName, createContextScopeDeps = []) {
    let defaultContexts = [];
    function $c512c27ab02ef895$export$fd42f52fd3ae1109(rootComponentName, defaultContext) {
      const BaseContext = /* @__PURE__ */ G$1(defaultContext);
      const index2 = defaultContexts.length;
      defaultContexts = [
        ...defaultContexts,
        defaultContext
      ];
      function Provider(props) {
        const { scope, children, ...context } = props;
        const Context2 = (scope === null || scope === void 0 ? void 0 : scope[scopeName][index2]) || BaseContext;
        const value2 = F$2(
          () => context,
          Object.values(context)
        );
        return /* @__PURE__ */ y$1(Context2.Provider, {
          value: value2
        }, children);
      }
      function useContext(consumerName, scope) {
        const Context2 = (scope === null || scope === void 0 ? void 0 : scope[scopeName][index2]) || BaseContext;
        const context = q$1(Context2);
        if (context)
          return context;
        if (defaultContext !== void 0)
          return defaultContext;
        throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
      }
      Provider.displayName = rootComponentName + "Provider";
      return [
        Provider,
        useContext
      ];
    }
    const createScope = () => {
      const scopeContexts = defaultContexts.map((defaultContext) => {
        return /* @__PURE__ */ G$1(defaultContext);
      });
      return function useScope(scope) {
        const contexts = (scope === null || scope === void 0 ? void 0 : scope[scopeName]) || scopeContexts;
        return F$2(
          () => ({
            [`__scope${scopeName}`]: {
              ...scope,
              [scopeName]: contexts
            }
          }),
          [
            scope,
            contexts
          ]
        );
      };
    };
    createScope.scopeName = scopeName;
    return [
      $c512c27ab02ef895$export$fd42f52fd3ae1109,
      $c512c27ab02ef895$var$composeContextScopes(createScope, ...createContextScopeDeps)
    ];
  }
  function $c512c27ab02ef895$var$composeContextScopes(...scopes) {
    const baseScope = scopes[0];
    if (scopes.length === 1)
      return baseScope;
    const createScope1 = () => {
      const scopeHooks = scopes.map(
        (createScope) => ({
          useScope: createScope(),
          scopeName: createScope.scopeName
        })
      );
      return function useComposedScopes(overrideScopes) {
        const nextScopes1 = scopeHooks.reduce((nextScopes, { useScope, scopeName }) => {
          const scopeProps = useScope(overrideScopes);
          const currentScope = scopeProps[`__scope${scopeName}`];
          return {
            ...nextScopes,
            ...currentScope
          };
        }, {});
        return F$2(
          () => ({
            [`__scope${baseScope.scopeName}`]: nextScopes1
          }),
          [
            nextScopes1
          ]
        );
      };
    };
    createScope1.scopeName = baseScope.scopeName;
    return createScope1;
  }
  const $9f79659886946c16$export$e5c5a5f917a5871c = Boolean(globalThis === null || globalThis === void 0 ? void 0 : globalThis.document) ? s : () => {
  };
  const $1746a345f3d73bb7$var$useReactId = $2AODx$react["useId".toString()] || (() => void 0);
  let $1746a345f3d73bb7$var$count = 0;
  function $1746a345f3d73bb7$export$f680877a34711e37(deterministicId) {
    const [id, setId] = p$1($1746a345f3d73bb7$var$useReactId());
    $9f79659886946c16$export$e5c5a5f917a5871c(() => {
      if (!deterministicId)
        setId(
          (reactId) => reactId !== null && reactId !== void 0 ? reactId : String($1746a345f3d73bb7$var$count++)
        );
    }, [
      deterministicId
    ]);
    return deterministicId || (id ? `radix-${id}` : "");
  }
  function $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(callback) {
    const callbackRef = _$1(callback);
    h(() => {
      callbackRef.current = callback;
    });
    return F$2(
      () => (...args) => {
        var _callbackRef$current;
        return (_callbackRef$current = callbackRef.current) === null || _callbackRef$current === void 0 ? void 0 : _callbackRef$current.call(callbackRef, ...args);
      },
      []
    );
  }
  function $71cd76cc60e0454e$export$6f32135080cb4c3({ prop, defaultProp, onChange = () => {
  } }) {
    const [uncontrolledProp, setUncontrolledProp] = $71cd76cc60e0454e$var$useUncontrolledState({
      defaultProp,
      onChange
    });
    const isControlled = prop !== void 0;
    const value1 = isControlled ? prop : uncontrolledProp;
    const handleChange = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onChange);
    const setValue = T$2((nextValue) => {
      if (isControlled) {
        const setter = nextValue;
        const value2 = typeof nextValue === "function" ? setter(prop) : nextValue;
        if (value2 !== prop)
          handleChange(value2);
      } else
        setUncontrolledProp(nextValue);
    }, [
      isControlled,
      prop,
      setUncontrolledProp,
      handleChange
    ]);
    return [
      value1,
      setValue
    ];
  }
  function $71cd76cc60e0454e$var$useUncontrolledState({ defaultProp, onChange }) {
    const uncontrolledState = p$1(defaultProp);
    const [value2] = uncontrolledState;
    const prevValueRef = _$1(value2);
    const handleChange = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onChange);
    h(() => {
      if (prevValueRef.current !== value2) {
        handleChange(value2);
        prevValueRef.current = value2;
      }
    }, [
      value2,
      prevValueRef,
      handleChange
    ]);
    return uncontrolledState;
  }
  const $5e63c961fc1ce211$export$8c6ed5c666ac1360 = /* @__PURE__ */ k((props, forwardedRef) => {
    const { children, ...slotProps } = props;
    const childrenArray = O.toArray(children);
    const slottable = childrenArray.find($5e63c961fc1ce211$var$isSlottable);
    if (slottable) {
      const newElement = slottable.props.children;
      const newChildren = childrenArray.map((child) => {
        if (child === slottable) {
          if (O.count(newElement) > 1)
            return O.only(null);
          return /* @__PURE__ */ ln(newElement) ? newElement.props.children : null;
        } else
          return child;
      });
      return /* @__PURE__ */ y$1($5e63c961fc1ce211$var$SlotClone, _extends({}, slotProps, {
        ref: forwardedRef
      }), /* @__PURE__ */ ln(newElement) ? /* @__PURE__ */ cn(newElement, void 0, newChildren) : null);
    }
    return /* @__PURE__ */ y$1($5e63c961fc1ce211$var$SlotClone, _extends({}, slotProps, {
      ref: forwardedRef
    }), children);
  });
  $5e63c961fc1ce211$export$8c6ed5c666ac1360.displayName = "Slot";
  const $5e63c961fc1ce211$var$SlotClone = /* @__PURE__ */ k((props, forwardedRef) => {
    const { children, ...slotProps } = props;
    if (/* @__PURE__ */ ln(children))
      return /* @__PURE__ */ cn(children, {
        ...$5e63c961fc1ce211$var$mergeProps(slotProps, children.props),
        ref: $6ed0406888f73fc4$export$43e446d32b3d21af(forwardedRef, children.ref)
      });
    return O.count(children) > 1 ? O.only(null) : null;
  });
  $5e63c961fc1ce211$var$SlotClone.displayName = "SlotClone";
  const $5e63c961fc1ce211$export$d9f1ccf0bdb05d45 = ({ children }) => {
    return /* @__PURE__ */ y$1(_$2, null, children);
  };
  function $5e63c961fc1ce211$var$isSlottable(child) {
    return /* @__PURE__ */ ln(child) && child.type === $5e63c961fc1ce211$export$d9f1ccf0bdb05d45;
  }
  function $5e63c961fc1ce211$var$mergeProps(slotProps, childProps) {
    const overrideProps = {
      ...childProps
    };
    for (const propName in childProps) {
      const slotPropValue = slotProps[propName];
      const childPropValue = childProps[propName];
      const isHandler = /^on[A-Z]/.test(propName);
      if (isHandler) {
        if (slotPropValue && childPropValue)
          overrideProps[propName] = (...args) => {
            childPropValue(...args);
            slotPropValue(...args);
          };
        else if (slotPropValue)
          overrideProps[propName] = slotPropValue;
      } else if (propName === "style")
        overrideProps[propName] = {
          ...slotPropValue,
          ...childPropValue
        };
      else if (propName === "className")
        overrideProps[propName] = [
          slotPropValue,
          childPropValue
        ].filter(Boolean).join(" ");
    }
    return {
      ...slotProps,
      ...overrideProps
    };
  }
  const $8927f6f2acc4f386$var$NODES = [
    "a",
    "button",
    "div",
    "h2",
    "h3",
    "img",
    "label",
    "li",
    "nav",
    "ol",
    "p",
    "span",
    "svg",
    "ul"
  ];
  const $8927f6f2acc4f386$export$250ffa63cdc0d034 = $8927f6f2acc4f386$var$NODES.reduce((primitive, node2) => {
    const Node2 = /* @__PURE__ */ k((props, forwardedRef) => {
      const { asChild, ...primitiveProps } = props;
      const Comp = asChild ? $5e63c961fc1ce211$export$8c6ed5c666ac1360 : node2;
      h(() => {
        window[Symbol.for("radix-ui")] = true;
      }, []);
      return /* @__PURE__ */ y$1(Comp, _extends({}, primitiveProps, {
        ref: forwardedRef
      }));
    });
    Node2.displayName = `Primitive.${node2}`;
    return {
      ...primitive,
      [node2]: Node2
    };
  }, {});
  function $8927f6f2acc4f386$export$6d1a0317bde7de7f(target, event) {
    if (target)
      hn(
        () => target.dispatchEvent(event)
      );
  }
  function $addc16e1bbe58fd0$export$3a72a57244d6e765(onEscapeKeyDownProp, ownerDocument = globalThis === null || globalThis === void 0 ? void 0 : globalThis.document) {
    const onEscapeKeyDown = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onEscapeKeyDownProp);
    h(() => {
      const handleKeyDown = (event) => {
        if (event.key === "Escape")
          onEscapeKeyDown(event);
      };
      ownerDocument.addEventListener("keydown", handleKeyDown);
      return () => ownerDocument.removeEventListener("keydown", handleKeyDown);
    }, [
      onEscapeKeyDown,
      ownerDocument
    ]);
  }
  const $5cb92bef7577960e$var$CONTEXT_UPDATE = "dismissableLayer.update";
  const $5cb92bef7577960e$var$POINTER_DOWN_OUTSIDE = "dismissableLayer.pointerDownOutside";
  const $5cb92bef7577960e$var$FOCUS_OUTSIDE = "dismissableLayer.focusOutside";
  let $5cb92bef7577960e$var$originalBodyPointerEvents;
  const $5cb92bef7577960e$var$DismissableLayerContext = /* @__PURE__ */ G$1({
    layers: /* @__PURE__ */ new Set(),
    layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
    branches: /* @__PURE__ */ new Set()
  });
  const $5cb92bef7577960e$export$177fb62ff3ec1f22 = /* @__PURE__ */ k((props, forwardedRef) => {
    var _node$ownerDocument;
    const { disableOutsidePointerEvents = false, onEscapeKeyDown, onPointerDownOutside, onFocusOutside, onInteractOutside, onDismiss, ...layerProps } = props;
    const context = q$1($5cb92bef7577960e$var$DismissableLayerContext);
    const [node1, setNode] = p$1(null);
    const ownerDocument = (_node$ownerDocument = node1 === null || node1 === void 0 ? void 0 : node1.ownerDocument) !== null && _node$ownerDocument !== void 0 ? _node$ownerDocument : globalThis === null || globalThis === void 0 ? void 0 : globalThis.document;
    const [, force] = p$1({});
    const composedRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(
      forwardedRef,
      (node2) => setNode(node2)
    );
    const layers = Array.from(context.layers);
    const [highestLayerWithOutsidePointerEventsDisabled] = [
      ...context.layersWithOutsidePointerEventsDisabled
    ].slice(-1);
    const highestLayerWithOutsidePointerEventsDisabledIndex = layers.indexOf(highestLayerWithOutsidePointerEventsDisabled);
    const index2 = node1 ? layers.indexOf(node1) : -1;
    const isBodyPointerEventsDisabled = context.layersWithOutsidePointerEventsDisabled.size > 0;
    const isPointerEventsEnabled = index2 >= highestLayerWithOutsidePointerEventsDisabledIndex;
    const pointerDownOutside = $5cb92bef7577960e$var$usePointerDownOutside((event) => {
      const target = event.target;
      const isPointerDownOnBranch = [
        ...context.branches
      ].some(
        (branch) => branch.contains(target)
      );
      if (!isPointerEventsEnabled || isPointerDownOnBranch)
        return;
      onPointerDownOutside === null || onPointerDownOutside === void 0 || onPointerDownOutside(event);
      onInteractOutside === null || onInteractOutside === void 0 || onInteractOutside(event);
      if (!event.defaultPrevented)
        onDismiss === null || onDismiss === void 0 || onDismiss();
    }, ownerDocument);
    const focusOutside = $5cb92bef7577960e$var$useFocusOutside((event) => {
      const target = event.target;
      const isFocusInBranch = [
        ...context.branches
      ].some(
        (branch) => branch.contains(target)
      );
      if (isFocusInBranch)
        return;
      onFocusOutside === null || onFocusOutside === void 0 || onFocusOutside(event);
      onInteractOutside === null || onInteractOutside === void 0 || onInteractOutside(event);
      if (!event.defaultPrevented)
        onDismiss === null || onDismiss === void 0 || onDismiss();
    }, ownerDocument);
    $addc16e1bbe58fd0$export$3a72a57244d6e765((event) => {
      const isHighestLayer = index2 === context.layers.size - 1;
      if (!isHighestLayer)
        return;
      onEscapeKeyDown === null || onEscapeKeyDown === void 0 || onEscapeKeyDown(event);
      if (!event.defaultPrevented && onDismiss) {
        event.preventDefault();
        onDismiss();
      }
    }, ownerDocument);
    h(() => {
      if (!node1)
        return;
      if (disableOutsidePointerEvents) {
        if (context.layersWithOutsidePointerEventsDisabled.size === 0) {
          $5cb92bef7577960e$var$originalBodyPointerEvents = ownerDocument.body.style.pointerEvents;
          ownerDocument.body.style.pointerEvents = "none";
        }
        context.layersWithOutsidePointerEventsDisabled.add(node1);
      }
      context.layers.add(node1);
      $5cb92bef7577960e$var$dispatchUpdate();
      return () => {
        if (disableOutsidePointerEvents && context.layersWithOutsidePointerEventsDisabled.size === 1)
          ownerDocument.body.style.pointerEvents = $5cb92bef7577960e$var$originalBodyPointerEvents;
      };
    }, [
      node1,
      ownerDocument,
      disableOutsidePointerEvents,
      context
    ]);
    h(() => {
      return () => {
        if (!node1)
          return;
        context.layers.delete(node1);
        context.layersWithOutsidePointerEventsDisabled.delete(node1);
        $5cb92bef7577960e$var$dispatchUpdate();
      };
    }, [
      node1,
      context
    ]);
    h(() => {
      const handleUpdate = () => force({});
      document.addEventListener($5cb92bef7577960e$var$CONTEXT_UPDATE, handleUpdate);
      return () => document.removeEventListener($5cb92bef7577960e$var$CONTEXT_UPDATE, handleUpdate);
    }, []);
    return /* @__PURE__ */ y$1($8927f6f2acc4f386$export$250ffa63cdc0d034.div, _extends({}, layerProps, {
      ref: composedRefs,
      style: {
        pointerEvents: isBodyPointerEventsDisabled ? isPointerEventsEnabled ? "auto" : "none" : void 0,
        ...props.style
      },
      onFocusCapture: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onFocusCapture, focusOutside.onFocusCapture),
      onBlurCapture: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onBlurCapture, focusOutside.onBlurCapture),
      onPointerDownCapture: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onPointerDownCapture, pointerDownOutside.onPointerDownCapture)
    }));
  });
  function $5cb92bef7577960e$var$usePointerDownOutside(onPointerDownOutside, ownerDocument = globalThis === null || globalThis === void 0 ? void 0 : globalThis.document) {
    const handlePointerDownOutside = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onPointerDownOutside);
    const isPointerInsideReactTreeRef = _$1(false);
    const handleClickRef = _$1(() => {
    });
    h(() => {
      const handlePointerDown = (event) => {
        if (event.target && !isPointerInsideReactTreeRef.current) {
          let handleAndDispatchPointerDownOutsideEvent = function() {
            $5cb92bef7577960e$var$handleAndDispatchCustomEvent($5cb92bef7577960e$var$POINTER_DOWN_OUTSIDE, handlePointerDownOutside, eventDetail, {
              discrete: true
            });
          };
          const eventDetail = {
            originalEvent: event
          };
          if (event.pointerType === "touch") {
            ownerDocument.removeEventListener("click", handleClickRef.current);
            handleClickRef.current = handleAndDispatchPointerDownOutsideEvent;
            ownerDocument.addEventListener("click", handleClickRef.current, {
              once: true
            });
          } else
            handleAndDispatchPointerDownOutsideEvent();
        }
        isPointerInsideReactTreeRef.current = false;
      };
      const timerId = window.setTimeout(() => {
        ownerDocument.addEventListener("pointerdown", handlePointerDown);
      }, 0);
      return () => {
        window.clearTimeout(timerId);
        ownerDocument.removeEventListener("pointerdown", handlePointerDown);
        ownerDocument.removeEventListener("click", handleClickRef.current);
      };
    }, [
      ownerDocument,
      handlePointerDownOutside
    ]);
    return {
      // ensures we check React component tree (not just DOM tree)
      onPointerDownCapture: () => isPointerInsideReactTreeRef.current = true
    };
  }
  function $5cb92bef7577960e$var$useFocusOutside(onFocusOutside, ownerDocument = globalThis === null || globalThis === void 0 ? void 0 : globalThis.document) {
    const handleFocusOutside = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onFocusOutside);
    const isFocusInsideReactTreeRef = _$1(false);
    h(() => {
      const handleFocus = (event) => {
        if (event.target && !isFocusInsideReactTreeRef.current) {
          const eventDetail = {
            originalEvent: event
          };
          $5cb92bef7577960e$var$handleAndDispatchCustomEvent($5cb92bef7577960e$var$FOCUS_OUTSIDE, handleFocusOutside, eventDetail, {
            discrete: false
          });
        }
      };
      ownerDocument.addEventListener("focusin", handleFocus);
      return () => ownerDocument.removeEventListener("focusin", handleFocus);
    }, [
      ownerDocument,
      handleFocusOutside
    ]);
    return {
      onFocusCapture: () => isFocusInsideReactTreeRef.current = true,
      onBlurCapture: () => isFocusInsideReactTreeRef.current = false
    };
  }
  function $5cb92bef7577960e$var$dispatchUpdate() {
    const event = new CustomEvent($5cb92bef7577960e$var$CONTEXT_UPDATE);
    document.dispatchEvent(event);
  }
  function $5cb92bef7577960e$var$handleAndDispatchCustomEvent(name, handler2, detail, { discrete }) {
    const target = detail.originalEvent.target;
    const event = new CustomEvent(name, {
      bubbles: false,
      cancelable: true,
      detail
    });
    if (handler2)
      target.addEventListener(name, handler2, {
        once: true
      });
    if (discrete)
      $8927f6f2acc4f386$export$6d1a0317bde7de7f(target, event);
    else
      target.dispatchEvent(event);
  }
  const $d3863c46a17e8a28$var$AUTOFOCUS_ON_MOUNT = "focusScope.autoFocusOnMount";
  const $d3863c46a17e8a28$var$AUTOFOCUS_ON_UNMOUNT = "focusScope.autoFocusOnUnmount";
  const $d3863c46a17e8a28$var$EVENT_OPTIONS = {
    bubbles: false,
    cancelable: true
  };
  const $d3863c46a17e8a28$export$20e40289641fbbb6 = /* @__PURE__ */ k((props, forwardedRef) => {
    const { loop = false, trapped = false, onMountAutoFocus: onMountAutoFocusProp, onUnmountAutoFocus: onUnmountAutoFocusProp, ...scopeProps } = props;
    const [container1, setContainer] = p$1(null);
    const onMountAutoFocus = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onMountAutoFocusProp);
    const onUnmountAutoFocus = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onUnmountAutoFocusProp);
    const lastFocusedElementRef = _$1(null);
    const composedRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(
      forwardedRef,
      (node2) => setContainer(node2)
    );
    const focusScope = _$1({
      paused: false,
      pause() {
        this.paused = true;
      },
      resume() {
        this.paused = false;
      }
    }).current;
    h(() => {
      if (trapped) {
        let handleFocusIn = function(event) {
          if (focusScope.paused || !container1)
            return;
          const target = event.target;
          if (container1.contains(target))
            lastFocusedElementRef.current = target;
          else
            $d3863c46a17e8a28$var$focus(lastFocusedElementRef.current, {
              select: true
            });
        }, handleFocusOut = function(event) {
          if (focusScope.paused || !container1)
            return;
          if (!container1.contains(event.relatedTarget))
            $d3863c46a17e8a28$var$focus(lastFocusedElementRef.current, {
              select: true
            });
        };
        document.addEventListener("focusin", handleFocusIn);
        document.addEventListener("focusout", handleFocusOut);
        return () => {
          document.removeEventListener("focusin", handleFocusIn);
          document.removeEventListener("focusout", handleFocusOut);
        };
      }
    }, [
      trapped,
      container1,
      focusScope.paused
    ]);
    h(() => {
      if (container1) {
        $d3863c46a17e8a28$var$focusScopesStack.add(focusScope);
        const previouslyFocusedElement = document.activeElement;
        const hasFocusedCandidate = container1.contains(previouslyFocusedElement);
        if (!hasFocusedCandidate) {
          const mountEvent = new CustomEvent($d3863c46a17e8a28$var$AUTOFOCUS_ON_MOUNT, $d3863c46a17e8a28$var$EVENT_OPTIONS);
          container1.addEventListener($d3863c46a17e8a28$var$AUTOFOCUS_ON_MOUNT, onMountAutoFocus);
          container1.dispatchEvent(mountEvent);
          if (!mountEvent.defaultPrevented) {
            $d3863c46a17e8a28$var$focusFirst($d3863c46a17e8a28$var$removeLinks($d3863c46a17e8a28$var$getTabbableCandidates(container1)), {
              select: true
            });
            if (document.activeElement === previouslyFocusedElement)
              $d3863c46a17e8a28$var$focus(container1);
          }
        }
        return () => {
          container1.removeEventListener($d3863c46a17e8a28$var$AUTOFOCUS_ON_MOUNT, onMountAutoFocus);
          setTimeout(() => {
            const unmountEvent = new CustomEvent($d3863c46a17e8a28$var$AUTOFOCUS_ON_UNMOUNT, $d3863c46a17e8a28$var$EVENT_OPTIONS);
            container1.addEventListener($d3863c46a17e8a28$var$AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);
            container1.dispatchEvent(unmountEvent);
            if (!unmountEvent.defaultPrevented)
              $d3863c46a17e8a28$var$focus(previouslyFocusedElement !== null && previouslyFocusedElement !== void 0 ? previouslyFocusedElement : document.body, {
                select: true
              });
            container1.removeEventListener($d3863c46a17e8a28$var$AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);
            $d3863c46a17e8a28$var$focusScopesStack.remove(focusScope);
          }, 0);
        };
      }
    }, [
      container1,
      onMountAutoFocus,
      onUnmountAutoFocus,
      focusScope
    ]);
    const handleKeyDown = T$2((event) => {
      if (!loop && !trapped)
        return;
      if (focusScope.paused)
        return;
      const isTabKey = event.key === "Tab" && !event.altKey && !event.ctrlKey && !event.metaKey;
      const focusedElement = document.activeElement;
      if (isTabKey && focusedElement) {
        const container = event.currentTarget;
        const [first, last] = $d3863c46a17e8a28$var$getTabbableEdges(container);
        const hasTabbableElementsInside = first && last;
        if (!hasTabbableElementsInside) {
          if (focusedElement === container)
            event.preventDefault();
        } else {
          if (!event.shiftKey && focusedElement === last) {
            event.preventDefault();
            if (loop)
              $d3863c46a17e8a28$var$focus(first, {
                select: true
              });
          } else if (event.shiftKey && focusedElement === first) {
            event.preventDefault();
            if (loop)
              $d3863c46a17e8a28$var$focus(last, {
                select: true
              });
          }
        }
      }
    }, [
      loop,
      trapped,
      focusScope.paused
    ]);
    return /* @__PURE__ */ y$1($8927f6f2acc4f386$export$250ffa63cdc0d034.div, _extends({
      tabIndex: -1
    }, scopeProps, {
      ref: composedRefs,
      onKeyDown: handleKeyDown
    }));
  });
  function $d3863c46a17e8a28$var$focusFirst(candidates, { select = false } = {}) {
    const previouslyFocusedElement = document.activeElement;
    for (const candidate of candidates) {
      $d3863c46a17e8a28$var$focus(candidate, {
        select
      });
      if (document.activeElement !== previouslyFocusedElement)
        return;
    }
  }
  function $d3863c46a17e8a28$var$getTabbableEdges(container) {
    const candidates = $d3863c46a17e8a28$var$getTabbableCandidates(container);
    const first = $d3863c46a17e8a28$var$findVisible(candidates, container);
    const last = $d3863c46a17e8a28$var$findVisible(candidates.reverse(), container);
    return [
      first,
      last
    ];
  }
  function $d3863c46a17e8a28$var$getTabbableCandidates(container) {
    const nodes = [];
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (node2) => {
        const isHiddenInput = node2.tagName === "INPUT" && node2.type === "hidden";
        if (node2.disabled || node2.hidden || isHiddenInput)
          return NodeFilter.FILTER_SKIP;
        return node2.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    while (walker.nextNode())
      nodes.push(walker.currentNode);
    return nodes;
  }
  function $d3863c46a17e8a28$var$findVisible(elements, container) {
    for (const element2 of elements) {
      if (!$d3863c46a17e8a28$var$isHidden(element2, {
        upTo: container
      }))
        return element2;
    }
  }
  function $d3863c46a17e8a28$var$isHidden(node2, { upTo }) {
    if (getComputedStyle(node2).visibility === "hidden")
      return true;
    while (node2) {
      if (upTo !== void 0 && node2 === upTo)
        return false;
      if (getComputedStyle(node2).display === "none")
        return true;
      node2 = node2.parentElement;
    }
    return false;
  }
  function $d3863c46a17e8a28$var$isSelectableInput(element2) {
    return element2 instanceof HTMLInputElement && "select" in element2;
  }
  function $d3863c46a17e8a28$var$focus(element2, { select = false } = {}) {
    if (element2 && element2.focus) {
      const previouslyFocusedElement = document.activeElement;
      element2.focus({
        preventScroll: true
      });
      if (element2 !== previouslyFocusedElement && $d3863c46a17e8a28$var$isSelectableInput(element2) && select)
        element2.select();
    }
  }
  const $d3863c46a17e8a28$var$focusScopesStack = $d3863c46a17e8a28$var$createFocusScopesStack();
  function $d3863c46a17e8a28$var$createFocusScopesStack() {
    let stack = [];
    return {
      add(focusScope) {
        const activeFocusScope = stack[0];
        if (focusScope !== activeFocusScope)
          activeFocusScope === null || activeFocusScope === void 0 || activeFocusScope.pause();
        stack = $d3863c46a17e8a28$var$arrayRemove(stack, focusScope);
        stack.unshift(focusScope);
      },
      remove(focusScope) {
        var _stack$;
        stack = $d3863c46a17e8a28$var$arrayRemove(stack, focusScope);
        (_stack$ = stack[0]) === null || _stack$ === void 0 || _stack$.resume();
      }
    };
  }
  function $d3863c46a17e8a28$var$arrayRemove(array, item) {
    const updatedArray = [
      ...array
    ];
    const index2 = updatedArray.indexOf(item);
    if (index2 !== -1)
      updatedArray.splice(index2, 1);
    return updatedArray;
  }
  function $d3863c46a17e8a28$var$removeLinks(items) {
    return items.filter(
      (item) => item.tagName !== "A"
    );
  }
  const $f1701beae083dbae$export$602eac185826482c = /* @__PURE__ */ k((props, forwardedRef) => {
    var _globalThis$document;
    const { container = globalThis === null || globalThis === void 0 ? void 0 : (_globalThis$document = globalThis.document) === null || _globalThis$document === void 0 ? void 0 : _globalThis$document.body, ...portalProps } = props;
    return container ? /* @__PURE__ */ bn.createPortal(/* @__PURE__ */ y$1($8927f6f2acc4f386$export$250ffa63cdc0d034.div, _extends({}, portalProps, {
      ref: forwardedRef
    })), container) : null;
  });
  function $fe963b355347cc68$export$3e6543de14f8614f(initialState, machine) {
    return y((state, event) => {
      const nextState = machine[state][event];
      return nextState !== null && nextState !== void 0 ? nextState : state;
    }, initialState);
  }
  const $921a889cee6df7e8$export$99c2b779aa4e8b8b = (props) => {
    const { present, children } = props;
    const presence = $921a889cee6df7e8$var$usePresence(present);
    const child = typeof children === "function" ? children({
      present: presence.isPresent
    }) : O.only(children);
    const ref = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(presence.ref, child.ref);
    const forceMount = typeof children === "function";
    return forceMount || presence.isPresent ? /* @__PURE__ */ cn(child, {
      ref
    }) : null;
  };
  $921a889cee6df7e8$export$99c2b779aa4e8b8b.displayName = "Presence";
  function $921a889cee6df7e8$var$usePresence(present) {
    const [node1, setNode] = p$1();
    const stylesRef = _$1({});
    const prevPresentRef = _$1(present);
    const prevAnimationNameRef = _$1("none");
    const initialState = present ? "mounted" : "unmounted";
    const [state, send] = $fe963b355347cc68$export$3e6543de14f8614f(initialState, {
      mounted: {
        UNMOUNT: "unmounted",
        ANIMATION_OUT: "unmountSuspended"
      },
      unmountSuspended: {
        MOUNT: "mounted",
        ANIMATION_END: "unmounted"
      },
      unmounted: {
        MOUNT: "mounted"
      }
    });
    h(() => {
      const currentAnimationName = $921a889cee6df7e8$var$getAnimationName(stylesRef.current);
      prevAnimationNameRef.current = state === "mounted" ? currentAnimationName : "none";
    }, [
      state
    ]);
    $9f79659886946c16$export$e5c5a5f917a5871c(() => {
      const styles = stylesRef.current;
      const wasPresent = prevPresentRef.current;
      const hasPresentChanged = wasPresent !== present;
      if (hasPresentChanged) {
        const prevAnimationName = prevAnimationNameRef.current;
        const currentAnimationName = $921a889cee6df7e8$var$getAnimationName(styles);
        if (present)
          send("MOUNT");
        else if (currentAnimationName === "none" || (styles === null || styles === void 0 ? void 0 : styles.display) === "none")
          send("UNMOUNT");
        else {
          const isAnimating = prevAnimationName !== currentAnimationName;
          if (wasPresent && isAnimating)
            send("ANIMATION_OUT");
          else
            send("UNMOUNT");
        }
        prevPresentRef.current = present;
      }
    }, [
      present,
      send
    ]);
    $9f79659886946c16$export$e5c5a5f917a5871c(() => {
      if (node1) {
        const handleAnimationEnd = (event) => {
          const currentAnimationName = $921a889cee6df7e8$var$getAnimationName(stylesRef.current);
          const isCurrentAnimation = currentAnimationName.includes(event.animationName);
          if (event.target === node1 && isCurrentAnimation)
            hn(
              () => send("ANIMATION_END")
            );
        };
        const handleAnimationStart = (event) => {
          if (event.target === node1)
            prevAnimationNameRef.current = $921a889cee6df7e8$var$getAnimationName(stylesRef.current);
        };
        node1.addEventListener("animationstart", handleAnimationStart);
        node1.addEventListener("animationcancel", handleAnimationEnd);
        node1.addEventListener("animationend", handleAnimationEnd);
        return () => {
          node1.removeEventListener("animationstart", handleAnimationStart);
          node1.removeEventListener("animationcancel", handleAnimationEnd);
          node1.removeEventListener("animationend", handleAnimationEnd);
        };
      } else
        send("ANIMATION_END");
    }, [
      node1,
      send
    ]);
    return {
      isPresent: [
        "mounted",
        "unmountSuspended"
      ].includes(state),
      ref: T$2((node2) => {
        if (node2)
          stylesRef.current = getComputedStyle(node2);
        setNode(node2);
      }, [])
    };
  }
  function $921a889cee6df7e8$var$getAnimationName(styles) {
    return (styles === null || styles === void 0 ? void 0 : styles.animationName) || "none";
  }
  let $3db38b7d1fb3fe6a$var$count = 0;
  function $3db38b7d1fb3fe6a$export$b7ece24a22aeda8c() {
    h(() => {
      var _edgeGuards$, _edgeGuards$2;
      const edgeGuards = document.querySelectorAll("[data-radix-focus-guard]");
      document.body.insertAdjacentElement("afterbegin", (_edgeGuards$ = edgeGuards[0]) !== null && _edgeGuards$ !== void 0 ? _edgeGuards$ : $3db38b7d1fb3fe6a$var$createFocusGuard());
      document.body.insertAdjacentElement("beforeend", (_edgeGuards$2 = edgeGuards[1]) !== null && _edgeGuards$2 !== void 0 ? _edgeGuards$2 : $3db38b7d1fb3fe6a$var$createFocusGuard());
      $3db38b7d1fb3fe6a$var$count++;
      return () => {
        if ($3db38b7d1fb3fe6a$var$count === 1)
          document.querySelectorAll("[data-radix-focus-guard]").forEach(
            (node2) => node2.remove()
          );
        $3db38b7d1fb3fe6a$var$count--;
      };
    }, []);
  }
  function $3db38b7d1fb3fe6a$var$createFocusGuard() {
    const element2 = document.createElement("span");
    element2.setAttribute("data-radix-focus-guard", "");
    element2.tabIndex = 0;
    element2.style.cssText = "outline: none; opacity: 0; position: fixed; pointer-events: none";
    return element2;
  }
  var __assign$2 = function() {
    __assign$2 = Object.assign || function __assign2(t2) {
      for (var s2, i2 = 1, n2 = arguments.length; i2 < n2; i2++) {
        s2 = arguments[i2];
        for (var p2 in s2)
          if (Object.prototype.hasOwnProperty.call(s2, p2))
            t2[p2] = s2[p2];
      }
      return t2;
    };
    return __assign$2.apply(this, arguments);
  };
  function __rest(s2, e2) {
    var t2 = {};
    for (var p2 in s2)
      if (Object.prototype.hasOwnProperty.call(s2, p2) && e2.indexOf(p2) < 0)
        t2[p2] = s2[p2];
    if (s2 != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i2 = 0, p2 = Object.getOwnPropertySymbols(s2); i2 < p2.length; i2++) {
        if (e2.indexOf(p2[i2]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p2[i2]))
          t2[p2[i2]] = s2[p2[i2]];
      }
    return t2;
  }
  function __spreadArray$1(to, from, pack2) {
    if (pack2 || arguments.length === 2)
      for (var i2 = 0, l2 = from.length, ar; i2 < l2; i2++) {
        if (ar || !(i2 in from)) {
          if (!ar)
            ar = Array.prototype.slice.call(from, 0, i2);
          ar[i2] = from[i2];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  }
  var zeroRightClassName = "right-scroll-bar-position";
  var fullWidthClassName = "width-before-scroll-bar";
  var noScrollbarsClassName = "with-scroll-bars-hidden";
  var removedBarSizeVariable = "--removed-body-scroll-bar-size";
  function assignRef(ref, value2) {
    if (typeof ref === "function") {
      ref(value2);
    } else if (ref) {
      ref.current = value2;
    }
    return ref;
  }
  function useCallbackRef(initialValue, callback) {
    var ref = p$1(function() {
      return {
        // value
        value: initialValue,
        // last callback
        callback,
        // "memoized" public interface
        facade: {
          get current() {
            return ref.value;
          },
          set current(value2) {
            var last = ref.value;
            if (last !== value2) {
              ref.value = value2;
              ref.callback(value2, last);
            }
          }
        }
      };
    })[0];
    ref.callback = callback;
    return ref.facade;
  }
  function useMergeRefs(refs, defaultValue) {
    return useCallbackRef(defaultValue || null, function(newValue) {
      return refs.forEach(function(ref) {
        return assignRef(ref, newValue);
      });
    });
  }
  function ItoI(a2) {
    return a2;
  }
  function innerCreateMedium(defaults, middleware) {
    if (middleware === void 0) {
      middleware = ItoI;
    }
    var buffer = [];
    var assigned = false;
    var medium = {
      read: function() {
        if (assigned) {
          throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
        }
        if (buffer.length) {
          return buffer[buffer.length - 1];
        }
        return defaults;
      },
      useMedium: function(data) {
        var item = middleware(data, assigned);
        buffer.push(item);
        return function() {
          buffer = buffer.filter(function(x2) {
            return x2 !== item;
          });
        };
      },
      assignSyncMedium: function(cb) {
        assigned = true;
        while (buffer.length) {
          var cbs = buffer;
          buffer = [];
          cbs.forEach(cb);
        }
        buffer = {
          push: function(x2) {
            return cb(x2);
          },
          filter: function() {
            return buffer;
          }
        };
      },
      assignMedium: function(cb) {
        assigned = true;
        var pendingQueue = [];
        if (buffer.length) {
          var cbs = buffer;
          buffer = [];
          cbs.forEach(cb);
          pendingQueue = buffer;
        }
        var executeQueue = function() {
          var cbs2 = pendingQueue;
          pendingQueue = [];
          cbs2.forEach(cb);
        };
        var cycle = function() {
          return Promise.resolve().then(executeQueue);
        };
        cycle();
        buffer = {
          push: function(x2) {
            pendingQueue.push(x2);
            cycle();
          },
          filter: function(filter) {
            pendingQueue = pendingQueue.filter(filter);
            return buffer;
          }
        };
      }
    };
    return medium;
  }
  function createSidecarMedium(options2) {
    if (options2 === void 0) {
      options2 = {};
    }
    var medium = innerCreateMedium(null);
    medium.options = __assign$2({ async: true, ssr: false }, options2);
    return medium;
  }
  var SideCar$1 = function(_a) {
    var sideCar = _a.sideCar, rest = __rest(_a, ["sideCar"]);
    if (!sideCar) {
      throw new Error("Sidecar: please provide `sideCar` property to import the right car");
    }
    var Target = sideCar.read();
    if (!Target) {
      throw new Error("Sidecar medium not found");
    }
    return y$1(Target, __assign$2({}, rest));
  };
  SideCar$1.isSideCarExport = true;
  function exportSidecar(medium, exported) {
    medium.useMedium(exported);
    return SideCar$1;
  }
  var effectCar = createSidecarMedium();
  var nothing = function() {
    return;
  };
  var RemoveScroll = k(function(props, parentRef) {
    var ref = _$1(null);
    var _a = p$1({
      onScrollCapture: nothing,
      onWheelCapture: nothing,
      onTouchMoveCapture: nothing
    }), callbacks = _a[0], setCallbacks = _a[1];
    var forwardProps = props.forwardProps, children = props.children, className = props.className, removeScrollBar = props.removeScrollBar, enabled = props.enabled, shards = props.shards, sideCar = props.sideCar, noIsolation = props.noIsolation, inert = props.inert, allowPinchZoom = props.allowPinchZoom, _b = props.as, Container = _b === void 0 ? "div" : _b, rest = __rest(props, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noIsolation", "inert", "allowPinchZoom", "as"]);
    var SideCar2 = sideCar;
    var containerRef = useMergeRefs([ref, parentRef]);
    var containerProps = __assign$2(__assign$2({}, rest), callbacks);
    return y$1(
      _$2,
      null,
      enabled && y$1(SideCar2, { sideCar: effectCar, removeScrollBar, shards, noIsolation, inert, setCallbacks, allowPinchZoom: !!allowPinchZoom, lockRef: ref }),
      forwardProps ? cn(O.only(children), __assign$2(__assign$2({}, containerProps), { ref: containerRef })) : y$1(Container, __assign$2({}, containerProps, { className, ref: containerRef }), children)
    );
  });
  RemoveScroll.defaultProps = {
    enabled: true,
    removeScrollBar: true,
    inert: false
  };
  RemoveScroll.classNames = {
    fullWidth: fullWidthClassName,
    zeroRight: zeroRightClassName
  };
  var getNonce = function() {
    if (typeof __webpack_nonce__ !== "undefined") {
      return __webpack_nonce__;
    }
    return void 0;
  };
  function makeStyleTag() {
    if (!document)
      return null;
    var tag = document.createElement("style");
    tag.type = "text/css";
    var nonce = getNonce();
    if (nonce) {
      tag.setAttribute("nonce", nonce);
    }
    return tag;
  }
  function injectStyles(tag, css) {
    if (tag.styleSheet) {
      tag.styleSheet.cssText = css;
    } else {
      tag.appendChild(document.createTextNode(css));
    }
  }
  function insertStyleTag(tag) {
    var head2 = document.head || document.getElementsByTagName("head")[0];
    head2.appendChild(tag);
  }
  var stylesheetSingleton = function() {
    var counter = 0;
    var stylesheet = null;
    return {
      add: function(style2) {
        if (counter == 0) {
          if (stylesheet = makeStyleTag()) {
            injectStyles(stylesheet, style2);
            insertStyleTag(stylesheet);
          }
        }
        counter++;
      },
      remove: function() {
        counter--;
        if (!counter && stylesheet) {
          stylesheet.parentNode && stylesheet.parentNode.removeChild(stylesheet);
          stylesheet = null;
        }
      }
    };
  };
  var styleHookSingleton = function() {
    var sheet = stylesheetSingleton();
    return function(styles, isDynamic) {
      h(function() {
        sheet.add(styles);
        return function() {
          sheet.remove();
        };
      }, [styles && isDynamic]);
    };
  };
  var styleSingleton = function() {
    var useStyle = styleHookSingleton();
    var Sheet = function(_a) {
      var styles = _a.styles, dynamic = _a.dynamic;
      useStyle(styles, dynamic);
      return null;
    };
    return Sheet;
  };
  var zeroGap = {
    left: 0,
    top: 0,
    right: 0,
    gap: 0
  };
  var parse$3 = function(x2) {
    return parseInt(x2 || "", 10) || 0;
  };
  var getOffset = function(gapMode) {
    var cs = window.getComputedStyle(document.body);
    var left = cs[gapMode === "padding" ? "paddingLeft" : "marginLeft"];
    var top = cs[gapMode === "padding" ? "paddingTop" : "marginTop"];
    var right = cs[gapMode === "padding" ? "paddingRight" : "marginRight"];
    return [parse$3(left), parse$3(top), parse$3(right)];
  };
  var getGapWidth = function(gapMode) {
    if (gapMode === void 0) {
      gapMode = "margin";
    }
    if (typeof window === "undefined") {
      return zeroGap;
    }
    var offsets = getOffset(gapMode);
    var documentWidth = document.documentElement.clientWidth;
    var windowWidth = window.innerWidth;
    return {
      left: offsets[0],
      top: offsets[1],
      right: offsets[2],
      gap: Math.max(0, windowWidth - documentWidth + offsets[2] - offsets[0])
    };
  };
  var Style = styleSingleton();
  var getStyles = function(_a, allowRelative, gapMode, important) {
    var left = _a.left, top = _a.top, right = _a.right, gap = _a.gap;
    if (gapMode === void 0) {
      gapMode = "margin";
    }
    return "\n  .".concat(noScrollbarsClassName, " {\n   overflow: hidden ").concat(important, ";\n   padding-right: ").concat(gap, "px ").concat(important, ";\n  }\n  body {\n    overflow: hidden ").concat(important, ";\n    overscroll-behavior: contain;\n    ").concat([
      allowRelative && "position: relative ".concat(important, ";"),
      gapMode === "margin" && "\n    padding-left: ".concat(left, "px;\n    padding-top: ").concat(top, "px;\n    padding-right: ").concat(right, "px;\n    margin-left:0;\n    margin-top:0;\n    margin-right: ").concat(gap, "px ").concat(important, ";\n    "),
      gapMode === "padding" && "padding-right: ".concat(gap, "px ").concat(important, ";")
    ].filter(Boolean).join(""), "\n  }\n  \n  .").concat(zeroRightClassName, " {\n    right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(fullWidthClassName, " {\n    margin-right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(zeroRightClassName, " .").concat(zeroRightClassName, " {\n    right: 0 ").concat(important, ";\n  }\n  \n  .").concat(fullWidthClassName, " .").concat(fullWidthClassName, " {\n    margin-right: 0 ").concat(important, ";\n  }\n  \n  body {\n    ").concat(removedBarSizeVariable, ": ").concat(gap, "px;\n  }\n");
  };
  var RemoveScrollBar = function(props) {
    var noRelative = props.noRelative, noImportant = props.noImportant, _a = props.gapMode, gapMode = _a === void 0 ? "margin" : _a;
    var gap = F$2(function() {
      return getGapWidth(gapMode);
    }, [gapMode]);
    return y$1(Style, { styles: getStyles(gap, !noRelative, gapMode, !noImportant ? "!important" : "") });
  };
  var passiveSupported = false;
  if (typeof window !== "undefined") {
    try {
      var options = Object.defineProperty({}, "passive", {
        get: function() {
          passiveSupported = true;
          return true;
        }
      });
      window.addEventListener("test", options, options);
      window.removeEventListener("test", options, options);
    } catch (err) {
      passiveSupported = false;
    }
  }
  var nonPassive = passiveSupported ? { passive: false } : false;
  var alwaysContainsScroll = function(node2) {
    return node2.tagName === "TEXTAREA";
  };
  var elementCanBeScrolled = function(node2, overflow2) {
    var styles = window.getComputedStyle(node2);
    return (
      // not-not-scrollable
      styles[overflow2] !== "hidden" && // contains scroll inside self
      !(styles.overflowY === styles.overflowX && !alwaysContainsScroll(node2) && styles[overflow2] === "visible")
    );
  };
  var elementCouldBeVScrolled = function(node2) {
    return elementCanBeScrolled(node2, "overflowY");
  };
  var elementCouldBeHScrolled = function(node2) {
    return elementCanBeScrolled(node2, "overflowX");
  };
  var locationCouldBeScrolled = function(axis, node2) {
    var current = node2;
    do {
      if (typeof ShadowRoot !== "undefined" && current instanceof ShadowRoot) {
        current = current.host;
      }
      var isScrollable = elementCouldBeScrolled(axis, current);
      if (isScrollable) {
        var _a = getScrollVariables(axis, current), s2 = _a[1], d2 = _a[2];
        if (s2 > d2) {
          return true;
        }
      }
      current = current.parentNode;
    } while (current && current !== document.body);
    return false;
  };
  var getVScrollVariables = function(_a) {
    var scrollTop = _a.scrollTop, scrollHeight = _a.scrollHeight, clientHeight = _a.clientHeight;
    return [
      scrollTop,
      scrollHeight,
      clientHeight
    ];
  };
  var getHScrollVariables = function(_a) {
    var scrollLeft = _a.scrollLeft, scrollWidth = _a.scrollWidth, clientWidth = _a.clientWidth;
    return [
      scrollLeft,
      scrollWidth,
      clientWidth
    ];
  };
  var elementCouldBeScrolled = function(axis, node2) {
    return axis === "v" ? elementCouldBeVScrolled(node2) : elementCouldBeHScrolled(node2);
  };
  var getScrollVariables = function(axis, node2) {
    return axis === "v" ? getVScrollVariables(node2) : getHScrollVariables(node2);
  };
  var getDirectionFactor = function(axis, direction2) {
    return axis === "h" && direction2 === "rtl" ? -1 : 1;
  };
  var handleScroll = function(axis, endTarget, event, sourceDelta, noOverscroll) {
    var directionFactor = getDirectionFactor(axis, window.getComputedStyle(endTarget).direction);
    var delta = directionFactor * sourceDelta;
    var target = event.target;
    var targetInLock = endTarget.contains(target);
    var shouldCancelScroll = false;
    var isDeltaPositive = delta > 0;
    var availableScroll = 0;
    var availableScrollTop = 0;
    do {
      var _a = getScrollVariables(axis, target), position2 = _a[0], scroll_1 = _a[1], capacity = _a[2];
      var elementScroll = scroll_1 - capacity - directionFactor * position2;
      if (position2 || elementScroll) {
        if (elementCouldBeScrolled(axis, target)) {
          availableScroll += elementScroll;
          availableScrollTop += position2;
        }
      }
      target = target.parentNode;
    } while (
      // portaled content
      !targetInLock && target !== document.body || // self content
      targetInLock && (endTarget.contains(target) || endTarget === target)
    );
    if (isDeltaPositive && (noOverscroll && availableScroll === 0 || !noOverscroll && delta > availableScroll)) {
      shouldCancelScroll = true;
    } else if (!isDeltaPositive && (noOverscroll && availableScrollTop === 0 || !noOverscroll && -delta > availableScrollTop)) {
      shouldCancelScroll = true;
    }
    return shouldCancelScroll;
  };
  var getTouchXY = function(event) {
    return "changedTouches" in event ? [event.changedTouches[0].clientX, event.changedTouches[0].clientY] : [0, 0];
  };
  var getDeltaXY = function(event) {
    return [event.deltaX, event.deltaY];
  };
  var extractRef = function(ref) {
    return ref && "current" in ref ? ref.current : ref;
  };
  var deltaCompare = function(x2, y2) {
    return x2[0] === y2[0] && x2[1] === y2[1];
  };
  var generateStyle = function(id) {
    return "\n  .block-interactivity-".concat(id, " {pointer-events: none;}\n  .allow-interactivity-").concat(id, " {pointer-events: all;}\n");
  };
  var idCounter = 0;
  var lockStack = [];
  function RemoveScrollSideCar(props) {
    var shouldPreventQueue = _$1([]);
    var touchStartRef = _$1([0, 0]);
    var activeAxis = _$1();
    var id = p$1(idCounter++)[0];
    var Style2 = p$1(function() {
      return styleSingleton();
    })[0];
    var lastProps = _$1(props);
    h(function() {
      lastProps.current = props;
    }, [props]);
    h(function() {
      if (props.inert) {
        document.body.classList.add("block-interactivity-".concat(id));
        var allow_1 = __spreadArray$1([props.lockRef.current], (props.shards || []).map(extractRef), true).filter(Boolean);
        allow_1.forEach(function(el) {
          return el.classList.add("allow-interactivity-".concat(id));
        });
        return function() {
          document.body.classList.remove("block-interactivity-".concat(id));
          allow_1.forEach(function(el) {
            return el.classList.remove("allow-interactivity-".concat(id));
          });
        };
      }
      return;
    }, [props.inert, props.lockRef.current, props.shards]);
    var shouldCancelEvent = T$2(function(event, parent) {
      if ("touches" in event && event.touches.length === 2) {
        return !lastProps.current.allowPinchZoom;
      }
      var touch = getTouchXY(event);
      var touchStart = touchStartRef.current;
      var deltaX = "deltaX" in event ? event.deltaX : touchStart[0] - touch[0];
      var deltaY = "deltaY" in event ? event.deltaY : touchStart[1] - touch[1];
      var currentAxis;
      var target = event.target;
      var moveDirection = Math.abs(deltaX) > Math.abs(deltaY) ? "h" : "v";
      if ("touches" in event && moveDirection === "h" && target.type === "range") {
        return false;
      }
      var canBeScrolledInMainDirection = locationCouldBeScrolled(moveDirection, target);
      if (!canBeScrolledInMainDirection) {
        return true;
      }
      if (canBeScrolledInMainDirection) {
        currentAxis = moveDirection;
      } else {
        currentAxis = moveDirection === "v" ? "h" : "v";
        canBeScrolledInMainDirection = locationCouldBeScrolled(moveDirection, target);
      }
      if (!canBeScrolledInMainDirection) {
        return false;
      }
      if (!activeAxis.current && "changedTouches" in event && (deltaX || deltaY)) {
        activeAxis.current = currentAxis;
      }
      if (!currentAxis) {
        return true;
      }
      var cancelingAxis = activeAxis.current || currentAxis;
      return handleScroll(cancelingAxis, parent, event, cancelingAxis === "h" ? deltaX : deltaY, true);
    }, []);
    var shouldPrevent = T$2(function(_event) {
      var event = _event;
      if (!lockStack.length || lockStack[lockStack.length - 1] !== Style2) {
        return;
      }
      var delta = "deltaY" in event ? getDeltaXY(event) : getTouchXY(event);
      var sourceEvent = shouldPreventQueue.current.filter(function(e2) {
        return e2.name === event.type && e2.target === event.target && deltaCompare(e2.delta, delta);
      })[0];
      if (sourceEvent && sourceEvent.should) {
        if (event.cancelable) {
          event.preventDefault();
        }
        return;
      }
      if (!sourceEvent) {
        var shardNodes = (lastProps.current.shards || []).map(extractRef).filter(Boolean).filter(function(node2) {
          return node2.contains(event.target);
        });
        var shouldStop = shardNodes.length > 0 ? shouldCancelEvent(event, shardNodes[0]) : !lastProps.current.noIsolation;
        if (shouldStop) {
          if (event.cancelable) {
            event.preventDefault();
          }
        }
      }
    }, []);
    var shouldCancel = T$2(function(name, delta, target, should) {
      var event = { name, delta, target, should };
      shouldPreventQueue.current.push(event);
      setTimeout(function() {
        shouldPreventQueue.current = shouldPreventQueue.current.filter(function(e2) {
          return e2 !== event;
        });
      }, 1);
    }, []);
    var scrollTouchStart = T$2(function(event) {
      touchStartRef.current = getTouchXY(event);
      activeAxis.current = void 0;
    }, []);
    var scrollWheel = T$2(function(event) {
      shouldCancel(event.type, getDeltaXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
    }, []);
    var scrollTouchMove = T$2(function(event) {
      shouldCancel(event.type, getTouchXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
    }, []);
    h(function() {
      lockStack.push(Style2);
      props.setCallbacks({
        onScrollCapture: scrollWheel,
        onWheelCapture: scrollWheel,
        onTouchMoveCapture: scrollTouchMove
      });
      document.addEventListener("wheel", shouldPrevent, nonPassive);
      document.addEventListener("touchmove", shouldPrevent, nonPassive);
      document.addEventListener("touchstart", scrollTouchStart, nonPassive);
      return function() {
        lockStack = lockStack.filter(function(inst) {
          return inst !== Style2;
        });
        document.removeEventListener("wheel", shouldPrevent, nonPassive);
        document.removeEventListener("touchmove", shouldPrevent, nonPassive);
        document.removeEventListener("touchstart", scrollTouchStart, nonPassive);
      };
    }, []);
    var removeScrollBar = props.removeScrollBar, inert = props.inert;
    return y$1(
      _$2,
      null,
      inert ? y$1(Style2, { styles: generateStyle(id) }) : null,
      removeScrollBar ? y$1(RemoveScrollBar, { gapMode: "margin" }) : null
    );
  }
  const SideCar = exportSidecar(effectCar, RemoveScrollSideCar);
  var ReactRemoveScroll = k(function(props, ref) {
    return y$1(RemoveScroll, __assign$2({}, props, { ref, sideCar: SideCar }));
  });
  ReactRemoveScroll.classNames = RemoveScroll.classNames;
  const $67UHm$RemoveScroll = ReactRemoveScroll;
  var getDefaultParent = function(originalTarget) {
    if (typeof document === "undefined") {
      return null;
    }
    var sampleTarget = Array.isArray(originalTarget) ? originalTarget[0] : originalTarget;
    return sampleTarget.ownerDocument.body;
  };
  var counterMap = /* @__PURE__ */ new WeakMap();
  var uncontrolledNodes = /* @__PURE__ */ new WeakMap();
  var markerMap = {};
  var lockCount = 0;
  var unwrapHost = function(node2) {
    return node2 && (node2.host || unwrapHost(node2.parentNode));
  };
  var correctTargets = function(parent, targets) {
    return targets.map(function(target) {
      if (parent.contains(target)) {
        return target;
      }
      var correctedTarget = unwrapHost(target);
      if (correctedTarget && parent.contains(correctedTarget)) {
        return correctedTarget;
      }
      console.error("aria-hidden", target, "in not contained inside", parent, ". Doing nothing");
      return null;
    }).filter(function(x2) {
      return Boolean(x2);
    });
  };
  var applyAttributeToOthers = function(originalTarget, parentNode, markerName, controlAttribute) {
    var targets = correctTargets(parentNode, Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
    if (!markerMap[markerName]) {
      markerMap[markerName] = /* @__PURE__ */ new WeakMap();
    }
    var markerCounter = markerMap[markerName];
    var hiddenNodes = [];
    var elementsToKeep = /* @__PURE__ */ new Set();
    var elementsToStop = new Set(targets);
    var keep = function(el) {
      if (!el || elementsToKeep.has(el)) {
        return;
      }
      elementsToKeep.add(el);
      keep(el.parentNode);
    };
    targets.forEach(keep);
    var deep = function(parent) {
      if (!parent || elementsToStop.has(parent)) {
        return;
      }
      Array.prototype.forEach.call(parent.children, function(node2) {
        if (elementsToKeep.has(node2)) {
          deep(node2);
        } else {
          var attr = node2.getAttribute(controlAttribute);
          var alreadyHidden = attr !== null && attr !== "false";
          var counterValue = (counterMap.get(node2) || 0) + 1;
          var markerValue = (markerCounter.get(node2) || 0) + 1;
          counterMap.set(node2, counterValue);
          markerCounter.set(node2, markerValue);
          hiddenNodes.push(node2);
          if (counterValue === 1 && alreadyHidden) {
            uncontrolledNodes.set(node2, true);
          }
          if (markerValue === 1) {
            node2.setAttribute(markerName, "true");
          }
          if (!alreadyHidden) {
            node2.setAttribute(controlAttribute, "true");
          }
        }
      });
    };
    deep(parentNode);
    elementsToKeep.clear();
    lockCount++;
    return function() {
      hiddenNodes.forEach(function(node2) {
        var counterValue = counterMap.get(node2) - 1;
        var markerValue = markerCounter.get(node2) - 1;
        counterMap.set(node2, counterValue);
        markerCounter.set(node2, markerValue);
        if (!counterValue) {
          if (!uncontrolledNodes.has(node2)) {
            node2.removeAttribute(controlAttribute);
          }
          uncontrolledNodes.delete(node2);
        }
        if (!markerValue) {
          node2.removeAttribute(markerName);
        }
      });
      lockCount--;
      if (!lockCount) {
        counterMap = /* @__PURE__ */ new WeakMap();
        counterMap = /* @__PURE__ */ new WeakMap();
        uncontrolledNodes = /* @__PURE__ */ new WeakMap();
        markerMap = {};
      }
    };
  };
  var hideOthers = function(originalTarget, parentNode, markerName) {
    if (markerName === void 0) {
      markerName = "data-aria-hidden";
    }
    var targets = Array.from(Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
    var activeParentNode = parentNode || getDefaultParent(originalTarget);
    if (!activeParentNode) {
      return function() {
        return null;
      };
    }
    targets.push.apply(targets, Array.from(activeParentNode.querySelectorAll("[aria-live]")));
    return applyAttributeToOthers(targets, activeParentNode, markerName, "aria-hidden");
  };
  const $5d3850c4d0b4e6c7$var$DIALOG_NAME = "Dialog";
  const [$5d3850c4d0b4e6c7$var$createDialogContext, $5d3850c4d0b4e6c7$export$cc702773b8ea3e41] = $c512c27ab02ef895$export$50c7b4e9d9f19c1($5d3850c4d0b4e6c7$var$DIALOG_NAME);
  const [$5d3850c4d0b4e6c7$var$DialogProvider, $5d3850c4d0b4e6c7$var$useDialogContext] = $5d3850c4d0b4e6c7$var$createDialogContext($5d3850c4d0b4e6c7$var$DIALOG_NAME);
  const $5d3850c4d0b4e6c7$export$3ddf2d174ce01153 = (props) => {
    const { __scopeDialog, children, open: openProp, defaultOpen, onOpenChange, modal = true } = props;
    const triggerRef = _$1(null);
    const contentRef = _$1(null);
    const [open = false, setOpen] = $71cd76cc60e0454e$export$6f32135080cb4c3({
      prop: openProp,
      defaultProp: defaultOpen,
      onChange: onOpenChange
    });
    return /* @__PURE__ */ y$1($5d3850c4d0b4e6c7$var$DialogProvider, {
      scope: __scopeDialog,
      triggerRef,
      contentRef,
      contentId: $1746a345f3d73bb7$export$f680877a34711e37(),
      titleId: $1746a345f3d73bb7$export$f680877a34711e37(),
      descriptionId: $1746a345f3d73bb7$export$f680877a34711e37(),
      open,
      onOpenChange: setOpen,
      onOpenToggle: T$2(
        () => setOpen(
          (prevOpen) => !prevOpen
        ),
        [
          setOpen
        ]
      ),
      modal
    }, children);
  };
  const $5d3850c4d0b4e6c7$var$TRIGGER_NAME = "DialogTrigger";
  const $5d3850c4d0b4e6c7$export$2e1e1122cf0cba88 = /* @__PURE__ */ k((props, forwardedRef) => {
    const { __scopeDialog, ...triggerProps } = props;
    const context = $5d3850c4d0b4e6c7$var$useDialogContext($5d3850c4d0b4e6c7$var$TRIGGER_NAME, __scopeDialog);
    const composedTriggerRef = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedRef, context.triggerRef);
    return /* @__PURE__ */ y$1($8927f6f2acc4f386$export$250ffa63cdc0d034.button, _extends({
      type: "button",
      "aria-haspopup": "dialog",
      "aria-expanded": context.open,
      "aria-controls": context.contentId,
      "data-state": $5d3850c4d0b4e6c7$var$getState(context.open)
    }, triggerProps, {
      ref: composedTriggerRef,
      onClick: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onClick, context.onOpenToggle)
    }));
  });
  const $5d3850c4d0b4e6c7$var$PORTAL_NAME = "DialogPortal";
  const [$5d3850c4d0b4e6c7$var$PortalProvider, $5d3850c4d0b4e6c7$var$usePortalContext] = $5d3850c4d0b4e6c7$var$createDialogContext($5d3850c4d0b4e6c7$var$PORTAL_NAME, {
    forceMount: void 0
  });
  const $5d3850c4d0b4e6c7$export$dad7c95542bacce0 = (props) => {
    const { __scopeDialog, forceMount, children, container } = props;
    const context = $5d3850c4d0b4e6c7$var$useDialogContext($5d3850c4d0b4e6c7$var$PORTAL_NAME, __scopeDialog);
    return /* @__PURE__ */ y$1($5d3850c4d0b4e6c7$var$PortalProvider, {
      scope: __scopeDialog,
      forceMount
    }, O.map(
      children,
      (child) => /* @__PURE__ */ y$1($921a889cee6df7e8$export$99c2b779aa4e8b8b, {
        present: forceMount || context.open
      }, /* @__PURE__ */ y$1($f1701beae083dbae$export$602eac185826482c, {
        asChild: true,
        container
      }, child))
    ));
  };
  const $5d3850c4d0b4e6c7$var$OVERLAY_NAME = "DialogOverlay";
  const $5d3850c4d0b4e6c7$export$bd1d06c79be19e17 = /* @__PURE__ */ k((props, forwardedRef) => {
    const portalContext = $5d3850c4d0b4e6c7$var$usePortalContext($5d3850c4d0b4e6c7$var$OVERLAY_NAME, props.__scopeDialog);
    const { forceMount = portalContext.forceMount, ...overlayProps } = props;
    const context = $5d3850c4d0b4e6c7$var$useDialogContext($5d3850c4d0b4e6c7$var$OVERLAY_NAME, props.__scopeDialog);
    return context.modal ? /* @__PURE__ */ y$1($921a889cee6df7e8$export$99c2b779aa4e8b8b, {
      present: forceMount || context.open
    }, /* @__PURE__ */ y$1($5d3850c4d0b4e6c7$var$DialogOverlayImpl, _extends({}, overlayProps, {
      ref: forwardedRef
    }))) : null;
  });
  const $5d3850c4d0b4e6c7$var$DialogOverlayImpl = /* @__PURE__ */ k((props, forwardedRef) => {
    const { __scopeDialog, ...overlayProps } = props;
    const context = $5d3850c4d0b4e6c7$var$useDialogContext($5d3850c4d0b4e6c7$var$OVERLAY_NAME, __scopeDialog);
    return (
      // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
      // ie. when `Overlay` and `Content` are siblings
      /* @__PURE__ */ y$1($67UHm$RemoveScroll, {
        as: $5e63c961fc1ce211$export$8c6ed5c666ac1360,
        allowPinchZoom: true,
        shards: [
          context.contentRef
        ]
      }, /* @__PURE__ */ y$1($8927f6f2acc4f386$export$250ffa63cdc0d034.div, _extends({
        "data-state": $5d3850c4d0b4e6c7$var$getState(context.open)
      }, overlayProps, {
        ref: forwardedRef,
        style: {
          pointerEvents: "auto",
          ...overlayProps.style
        }
      })))
    );
  });
  const $5d3850c4d0b4e6c7$var$CONTENT_NAME = "DialogContent";
  const $5d3850c4d0b4e6c7$export$b6d9565de1e068cf = /* @__PURE__ */ k((props, forwardedRef) => {
    const portalContext = $5d3850c4d0b4e6c7$var$usePortalContext($5d3850c4d0b4e6c7$var$CONTENT_NAME, props.__scopeDialog);
    const { forceMount = portalContext.forceMount, ...contentProps } = props;
    const context = $5d3850c4d0b4e6c7$var$useDialogContext($5d3850c4d0b4e6c7$var$CONTENT_NAME, props.__scopeDialog);
    return /* @__PURE__ */ y$1($921a889cee6df7e8$export$99c2b779aa4e8b8b, {
      present: forceMount || context.open
    }, context.modal ? /* @__PURE__ */ y$1($5d3850c4d0b4e6c7$var$DialogContentModal, _extends({}, contentProps, {
      ref: forwardedRef
    })) : /* @__PURE__ */ y$1($5d3850c4d0b4e6c7$var$DialogContentNonModal, _extends({}, contentProps, {
      ref: forwardedRef
    })));
  });
  const $5d3850c4d0b4e6c7$var$DialogContentModal = /* @__PURE__ */ k((props, forwardedRef) => {
    const context = $5d3850c4d0b4e6c7$var$useDialogContext($5d3850c4d0b4e6c7$var$CONTENT_NAME, props.__scopeDialog);
    const contentRef = _$1(null);
    const composedRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedRef, context.contentRef, contentRef);
    h(() => {
      const content2 = contentRef.current;
      if (content2)
        return hideOthers(content2);
    }, []);
    return /* @__PURE__ */ y$1($5d3850c4d0b4e6c7$var$DialogContentImpl, _extends({}, props, {
      ref: composedRefs,
      trapFocus: context.open,
      disableOutsidePointerEvents: true,
      onCloseAutoFocus: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onCloseAutoFocus, (event) => {
        var _context$triggerRef$c;
        event.preventDefault();
        (_context$triggerRef$c = context.triggerRef.current) === null || _context$triggerRef$c === void 0 || _context$triggerRef$c.focus();
      }),
      onPointerDownOutside: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onPointerDownOutside, (event) => {
        const originalEvent = event.detail.originalEvent;
        const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
        const isRightClick = originalEvent.button === 2 || ctrlLeftClick;
        if (isRightClick)
          event.preventDefault();
      }),
      onFocusOutside: $e42e1063c40fb3ef$export$b9ecd428b558ff10(
        props.onFocusOutside,
        (event) => event.preventDefault()
      )
    }));
  });
  const $5d3850c4d0b4e6c7$var$DialogContentNonModal = /* @__PURE__ */ k((props, forwardedRef) => {
    const context = $5d3850c4d0b4e6c7$var$useDialogContext($5d3850c4d0b4e6c7$var$CONTENT_NAME, props.__scopeDialog);
    const hasInteractedOutsideRef = _$1(false);
    return /* @__PURE__ */ y$1($5d3850c4d0b4e6c7$var$DialogContentImpl, _extends({}, props, {
      ref: forwardedRef,
      trapFocus: false,
      disableOutsidePointerEvents: false,
      onCloseAutoFocus: (event) => {
        var _props$onCloseAutoFoc;
        (_props$onCloseAutoFoc = props.onCloseAutoFocus) === null || _props$onCloseAutoFoc === void 0 || _props$onCloseAutoFoc.call(props, event);
        if (!event.defaultPrevented) {
          var _context$triggerRef$c2;
          if (!hasInteractedOutsideRef.current)
            (_context$triggerRef$c2 = context.triggerRef.current) === null || _context$triggerRef$c2 === void 0 || _context$triggerRef$c2.focus();
          event.preventDefault();
        }
        hasInteractedOutsideRef.current = false;
      },
      onInteractOutside: (event) => {
        var _props$onInteractOuts, _context$triggerRef$c3;
        (_props$onInteractOuts = props.onInteractOutside) === null || _props$onInteractOuts === void 0 || _props$onInteractOuts.call(props, event);
        if (!event.defaultPrevented)
          hasInteractedOutsideRef.current = true;
        const target = event.target;
        const targetIsTrigger = (_context$triggerRef$c3 = context.triggerRef.current) === null || _context$triggerRef$c3 === void 0 ? void 0 : _context$triggerRef$c3.contains(target);
        if (targetIsTrigger)
          event.preventDefault();
      }
    }));
  });
  const $5d3850c4d0b4e6c7$var$DialogContentImpl = /* @__PURE__ */ k((props, forwardedRef) => {
    const { __scopeDialog, trapFocus, onOpenAutoFocus, onCloseAutoFocus, ...contentProps } = props;
    const context = $5d3850c4d0b4e6c7$var$useDialogContext($5d3850c4d0b4e6c7$var$CONTENT_NAME, __scopeDialog);
    const contentRef = _$1(null);
    const composedRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedRef, contentRef);
    $3db38b7d1fb3fe6a$export$b7ece24a22aeda8c();
    return /* @__PURE__ */ y$1(_$2, null, /* @__PURE__ */ y$1($d3863c46a17e8a28$export$20e40289641fbbb6, {
      asChild: true,
      loop: true,
      trapped: trapFocus,
      onMountAutoFocus: onOpenAutoFocus,
      onUnmountAutoFocus: onCloseAutoFocus
    }, /* @__PURE__ */ y$1($5cb92bef7577960e$export$177fb62ff3ec1f22, _extends({
      role: "dialog",
      id: context.contentId,
      "aria-describedby": context.descriptionId,
      "aria-labelledby": context.titleId,
      "data-state": $5d3850c4d0b4e6c7$var$getState(context.open)
    }, contentProps, {
      ref: composedRefs,
      onDismiss: () => context.onOpenChange(false)
    }))), false);
  });
  const $5d3850c4d0b4e6c7$var$TITLE_NAME = "DialogTitle";
  const $5d3850c4d0b4e6c7$export$16f7638e4a34b909 = /* @__PURE__ */ k((props, forwardedRef) => {
    const { __scopeDialog, ...titleProps } = props;
    const context = $5d3850c4d0b4e6c7$var$useDialogContext($5d3850c4d0b4e6c7$var$TITLE_NAME, __scopeDialog);
    return /* @__PURE__ */ y$1($8927f6f2acc4f386$export$250ffa63cdc0d034.h2, _extends({
      id: context.titleId
    }, titleProps, {
      ref: forwardedRef
    }));
  });
  const $5d3850c4d0b4e6c7$var$CLOSE_NAME = "DialogClose";
  const $5d3850c4d0b4e6c7$export$fba2fb7cd781b7ac = /* @__PURE__ */ k((props, forwardedRef) => {
    const { __scopeDialog, ...closeProps } = props;
    const context = $5d3850c4d0b4e6c7$var$useDialogContext($5d3850c4d0b4e6c7$var$CLOSE_NAME, __scopeDialog);
    return /* @__PURE__ */ y$1($8927f6f2acc4f386$export$250ffa63cdc0d034.button, _extends({
      type: "button"
    }, closeProps, {
      ref: forwardedRef,
      onClick: $e42e1063c40fb3ef$export$b9ecd428b558ff10(
        props.onClick,
        () => context.onOpenChange(false)
      )
    }));
  });
  function $5d3850c4d0b4e6c7$var$getState(open) {
    return open ? "open" : "closed";
  }
  const $5d3850c4d0b4e6c7$export$be92b6f5f03c0fe9 = $5d3850c4d0b4e6c7$export$3ddf2d174ce01153;
  const $5d3850c4d0b4e6c7$export$41fb9f06171c75f4 = $5d3850c4d0b4e6c7$export$2e1e1122cf0cba88;
  const $5d3850c4d0b4e6c7$export$602eac185826482c = $5d3850c4d0b4e6c7$export$dad7c95542bacce0;
  const $5d3850c4d0b4e6c7$export$c6fdb837b070b4ff = $5d3850c4d0b4e6c7$export$bd1d06c79be19e17;
  const $5d3850c4d0b4e6c7$export$7c6e2c02157bb7d2 = $5d3850c4d0b4e6c7$export$b6d9565de1e068cf;
  const $5d3850c4d0b4e6c7$export$f99233281efd08a0 = $5d3850c4d0b4e6c7$export$16f7638e4a34b909;
  const $5d3850c4d0b4e6c7$export$f39c2d165cd861fe = $5d3850c4d0b4e6c7$export$fba2fb7cd781b7ac;
  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null)
      return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key2, i2;
    for (i2 = 0; i2 < sourceKeys.length; i2++) {
      key2 = sourceKeys[i2];
      if (excluded.indexOf(key2) >= 0)
        continue;
      target[key2] = source[key2];
    }
    return target;
  }
  var _excluded$1r = ["color"];
  var Cross2Icon = /* @__PURE__ */ k(function(_ref, forwardedRef) {
    var _ref$color = _ref.color, color2 = _ref$color === void 0 ? "currentColor" : _ref$color, props = _objectWithoutPropertiesLoose(_ref, _excluded$1r);
    return y$1("svg", Object.assign({
      width: "15",
      height: "15",
      viewBox: "0 0 15 15",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, props, {
      ref: forwardedRef
    }), y$1("path", {
      d: "M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z",
      fill: color2,
      fillRule: "evenodd",
      clipRule: "evenodd"
    }));
  });
  var _excluded$2l = ["color"];
  var GearIcon = /* @__PURE__ */ k(function(_ref, forwardedRef) {
    var _ref$color = _ref.color, color2 = _ref$color === void 0 ? "currentColor" : _ref$color, props = _objectWithoutPropertiesLoose(_ref, _excluded$2l);
    return y$1("svg", Object.assign({
      width: "15",
      height: "15",
      viewBox: "0 0 15 15",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, props, {
      ref: forwardedRef
    }), y$1("path", {
      d: "M7.07095 0.650238C6.67391 0.650238 6.32977 0.925096 6.24198 1.31231L6.0039 2.36247C5.6249 2.47269 5.26335 2.62363 4.92436 2.81013L4.01335 2.23585C3.67748 2.02413 3.23978 2.07312 2.95903 2.35386L2.35294 2.95996C2.0722 3.2407 2.0232 3.6784 2.23493 4.01427L2.80942 4.92561C2.62307 5.2645 2.47227 5.62594 2.36216 6.00481L1.31209 6.24287C0.924883 6.33065 0.650024 6.6748 0.650024 7.07183V7.92897C0.650024 8.32601 0.924883 8.67015 1.31209 8.75794L2.36228 8.99603C2.47246 9.375 2.62335 9.73652 2.80979 10.0755L2.2354 10.9867C2.02367 11.3225 2.07267 11.7602 2.35341 12.041L2.95951 12.6471C3.24025 12.9278 3.67795 12.9768 4.01382 12.7651L4.92506 12.1907C5.26384 12.377 5.62516 12.5278 6.0039 12.6379L6.24198 13.6881C6.32977 14.0753 6.67391 14.3502 7.07095 14.3502H7.92809C8.32512 14.3502 8.66927 14.0753 8.75705 13.6881L8.99505 12.6383C9.37411 12.5282 9.73573 12.3773 10.0748 12.1909L10.986 12.7653C11.3218 12.977 11.7595 12.928 12.0403 12.6473L12.6464 12.0412C12.9271 11.7604 12.9761 11.3227 12.7644 10.9869L12.1902 10.076C12.3768 9.73688 12.5278 9.37515 12.638 8.99596L13.6879 8.75794C14.0751 8.67015 14.35 8.32601 14.35 7.92897V7.07183C14.35 6.6748 14.0751 6.33065 13.6879 6.24287L12.6381 6.00488C12.528 5.62578 12.3771 5.26414 12.1906 4.92507L12.7648 4.01407C12.9766 3.6782 12.9276 3.2405 12.6468 2.95975L12.0407 2.35366C11.76 2.07292 11.3223 2.02392 10.9864 2.23565L10.0755 2.80989C9.73622 2.62328 9.37437 2.47229 8.99505 2.36209L8.75705 1.31231C8.66927 0.925096 8.32512 0.650238 7.92809 0.650238H7.07095ZM4.92053 3.81251C5.44724 3.44339 6.05665 3.18424 6.71543 3.06839L7.07095 1.50024H7.92809L8.28355 3.06816C8.94267 3.18387 9.5524 3.44302 10.0794 3.81224L11.4397 2.9547L12.0458 3.56079L11.1882 4.92117C11.5573 5.44798 11.8164 6.0575 11.9321 6.71638L13.5 7.07183V7.92897L11.932 8.28444C11.8162 8.94342 11.557 9.55301 11.1878 10.0798L12.0453 11.4402L11.4392 12.0462L10.0787 11.1886C9.55192 11.5576 8.94241 11.8166 8.28355 11.9323L7.92809 13.5002H7.07095L6.71543 11.932C6.0569 11.8162 5.44772 11.5572 4.92116 11.1883L3.56055 12.046L2.95445 11.4399L3.81213 10.0794C3.4431 9.55266 3.18403 8.94326 3.06825 8.2845L1.50002 7.92897V7.07183L3.06818 6.71632C3.18388 6.05765 3.44283 5.44833 3.81171 4.92165L2.95398 3.561L3.56008 2.95491L4.92053 3.81251ZM9.02496 7.50008C9.02496 8.34226 8.34223 9.02499 7.50005 9.02499C6.65786 9.02499 5.97513 8.34226 5.97513 7.50008C5.97513 6.65789 6.65786 5.97516 7.50005 5.97516C8.34223 5.97516 9.02496 6.65789 9.02496 7.50008ZM9.92496 7.50008C9.92496 8.83932 8.83929 9.92499 7.50005 9.92499C6.1608 9.92499 5.07513 8.83932 5.07513 7.50008C5.07513 6.16084 6.1608 5.07516 7.50005 5.07516C8.83929 5.07516 9.92496 6.16084 9.92496 7.50008Z",
      fill: color2,
      fillRule: "evenodd",
      clipRule: "evenodd"
    }));
  });
  function isHighSurrogate$1(codePoint) {
    return codePoint >= 55296 && codePoint <= 56319;
  }
  function isLowSurrogate$1(codePoint) {
    return codePoint >= 56320 && codePoint <= 57343;
  }
  var truncate$2 = function truncate2(getLength2, string2, byteLength) {
    if (typeof string2 !== "string") {
      throw new Error("Input must be string");
    }
    var charLength = string2.length;
    var curByteLength = 0;
    var codePoint;
    var segment;
    for (var i2 = 0; i2 < charLength; i2 += 1) {
      codePoint = string2.charCodeAt(i2);
      segment = string2[i2];
      if (isHighSurrogate$1(codePoint) && isLowSurrogate$1(string2.charCodeAt(i2 + 1))) {
        i2 += 1;
        segment += string2[i2];
      }
      curByteLength += getLength2(segment);
      if (curByteLength === byteLength) {
        return string2.slice(0, i2 + 1);
      } else if (curByteLength > byteLength) {
        return string2.slice(0, i2 - segment.length + 1);
      }
    }
    return string2;
  };
  function isHighSurrogate(codePoint) {
    return codePoint >= 55296 && codePoint <= 56319;
  }
  function isLowSurrogate(codePoint) {
    return codePoint >= 56320 && codePoint <= 57343;
  }
  var browser$1 = function getByteLength(string2) {
    if (typeof string2 !== "string") {
      throw new Error("Input must be string");
    }
    var charLength = string2.length;
    var byteLength = 0;
    var codePoint = null;
    var prevCodePoint = null;
    for (var i2 = 0; i2 < charLength; i2++) {
      codePoint = string2.charCodeAt(i2);
      if (isLowSurrogate(codePoint)) {
        if (prevCodePoint != null && isHighSurrogate(prevCodePoint)) {
          byteLength += 1;
        } else {
          byteLength += 3;
        }
      } else if (codePoint <= 127) {
        byteLength += 1;
      } else if (codePoint >= 128 && codePoint <= 2047) {
        byteLength += 2;
      } else if (codePoint >= 2048 && codePoint <= 65535) {
        byteLength += 3;
      }
      prevCodePoint = codePoint;
    }
    return byteLength;
  };
  var truncate$1 = truncate$2;
  var getLength = browser$1;
  var browser = truncate$1.bind(null, getLength);
  var truncate = browser;
  var illegalRe = /[\/\?<>\\:\*\|"]/g;
  var controlRe = /[\x00-\x1f\x80-\x9f]/g;
  var reservedRe = /^\.+$/;
  var windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
  var windowsTrailingRe = /[\. ]+$/;
  function sanitize(input, replacement) {
    if (typeof input !== "string") {
      throw new Error("Input must be string");
    }
    var sanitized = input.replace(illegalRe, replacement).replace(controlRe, replacement).replace(reservedRe, replacement).replace(windowsReservedRe, replacement).replace(windowsTrailingRe, replacement);
    return truncate(sanitized, 255);
  }
  var sanitizeFilename = function(input, options2) {
    var replacement = options2 && options2.replacement || "";
    var output = sanitize(input, replacement);
    if (replacement === "") {
      return output;
    }
    return sanitize(output, "");
  };
  function copyToClipboard(text2) {
    try {
      navigator.clipboard.writeText(text2);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text2;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
  }
  function standardizeLineBreaks(text2) {
    return text2.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  }
  var dist = {};
  var __assign$1 = commonjsGlobal && commonjsGlobal.__assign || function() {
    __assign$1 = Object.assign || function(t2) {
      for (var s2, i2 = 1, n2 = arguments.length; i2 < n2; i2++) {
        s2 = arguments[i2];
        for (var p2 in s2)
          if (Object.prototype.hasOwnProperty.call(s2, p2))
            t2[p2] = s2[p2];
      }
      return t2;
    };
    return __assign$1.apply(this, arguments);
  };
  Object.defineProperty(dist, "__esModule", { value: true });
  dist.join = dist.subst = dist.query = void 0;
  function urlcat(baseUrlOrTemplate, pathTemplateOrParams, maybeParams) {
    if (maybeParams === void 0) {
      maybeParams = {};
    }
    if (typeof pathTemplateOrParams === "string") {
      var baseUrl2 = baseUrlOrTemplate;
      var pathTemplate = pathTemplateOrParams;
      var params = maybeParams;
      return urlcatImpl(pathTemplate, params, baseUrl2);
    } else {
      var baseTemplate = baseUrlOrTemplate;
      var params = pathTemplateOrParams;
      return urlcatImpl(baseTemplate, params);
    }
  }
  var _default = dist.default = urlcat;
  function urlcatImpl(pathTemplate, params, baseUrl2) {
    var _a = path$1(pathTemplate, params), renderedPath = _a.renderedPath, remainingParams = _a.remainingParams;
    var cleanParams = removeNullOrUndef(remainingParams);
    var renderedQuery = query(cleanParams);
    var pathAndQuery = join$1(renderedPath, "?", renderedQuery);
    return baseUrl2 ? join$1(baseUrl2, "/", pathAndQuery) : pathAndQuery;
  }
  function query(params) {
    return new URLSearchParams(params).toString();
  }
  dist.query = query;
  function subst(template, params) {
    var renderedPath = path$1(template, params).renderedPath;
    return renderedPath;
  }
  dist.subst = subst;
  function path$1(template, params) {
    var remainingParams = __assign$1({}, params);
    var allowedTypes = ["boolean", "string", "number"];
    var renderedPath = template.replace(/:\w+/g, function(p2) {
      var key2 = p2.slice(1);
      if (/^\d+$/.test(key2)) {
        return p2;
      }
      if (!params.hasOwnProperty(key2)) {
        throw new Error("Missing value for path parameter " + key2 + ".");
      }
      if (!allowedTypes.includes(typeof params[key2])) {
        throw new TypeError("Path parameter " + key2 + " cannot be of type " + typeof params[key2] + ". " + ("Allowed types are: " + allowedTypes.join(", ") + "."));
      }
      if (typeof params[key2] === "string" && params[key2].trim() === "") {
        throw new Error("Path parameter " + key2 + " cannot be an empty string.");
      }
      delete remainingParams[key2];
      return encodeURIComponent(params[key2]);
    });
    return { renderedPath, remainingParams };
  }
  function join$1(part1, separator, part2) {
    var p1 = part1.endsWith(separator) ? part1.slice(0, -separator.length) : part1;
    var p2 = part2.startsWith(separator) ? part2.slice(separator.length) : part2;
    return p1 === "" || p2 === "" ? p1 + p2 : p1 + separator + p2;
  }
  dist.join = join$1;
  function removeNullOrUndef(params) {
    return Object.keys(params).filter(function(k2) {
      return notNullOrUndefined(params[k2]);
    }).reduce(function(result, k2) {
      result[k2] = params[k2];
      return result;
    }, {});
  }
  function notNullOrUndefined(v2) {
    return v2 !== void 0 && v2 !== null;
  }
  var monkeyWindow = window;
  var unsafeWindow = /* @__PURE__ */ (() => {
    return monkeyWindow.unsafeWindow;
  })();
  var GM_setValue = /* @__PURE__ */ (() => monkeyWindow.GM_setValue)();
  var GM_getValue = /* @__PURE__ */ (() => monkeyWindow.GM_getValue)();
  function getBase64FromImg(el) {
    const canvas = document.createElement("canvas");
    canvas.width = el.naturalWidth;
    canvas.height = el.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx)
      return "";
    ctx.drawImage(el, 0, 0);
    return canvas.toDataURL("image/png");
  }
  async function getBase64FromImageUrl(url) {
    const img = await loadImage(url);
    return getBase64FromImg(img);
  }
  function loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  }
  function getPageAccessToken() {
    var _a, _b, _c;
    return ((_c = (_b = (_a = unsafeWindow == null ? void 0 : unsafeWindow.__NEXT_DATA__) == null ? void 0 : _a.props) == null ? void 0 : _b.pageProps) == null ? void 0 : _c.accessToken) ?? null;
  }
  function getHistoryDisabled() {
    var _a, _b, _c;
    return ((_c = (_b = (_a = unsafeWindow == null ? void 0 : unsafeWindow.__NEXT_DATA__) == null ? void 0 : _a.props) == null ? void 0 : _b.pageProps) == null ? void 0 : _c.shouldDisableHistory) ?? false;
  }
  function getUserProfile() {
    var _a, _b, _c;
    const user = (_c = (_b = (_a = unsafeWindow == null ? void 0 : unsafeWindow.__NEXT_DATA__) == null ? void 0 : _a.props) == null ? void 0 : _b.pageProps) == null ? void 0 : _c.user;
    if (!user)
      throw new Error("No user found.");
    return user;
  }
  function getConversationChoice() {
    const conversationChoices = Array.from(document.querySelectorAll("main .group")).map((group) => group.querySelector(".flex.justify-center span.flex-grow")).map((span) => {
      var _a;
      return parseInt(((_a = span == null ? void 0 : span.textContent) == null ? void 0 : _a.trim().split(" / ")[0]) ?? "0") - 1;
    }).map((x2) => x2 === -1 ? null : x2);
    return conversationChoices;
  }
  const defaultAvatar = "data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%2730%27%20height=%2730%27/%3e";
  async function getUserAvatar() {
    const {
      picture
    } = getUserProfile();
    if (picture)
      return getBase64FromImageUrl(picture);
    return defaultAvatar;
  }
  function checkIfConversationStarted() {
    return !!document.querySelector("main .group");
  }
  const baseUrl = "https://chat.openai.com";
  const apiUrl = `${baseUrl}/backend-api`;
  const sessionApi = _default(baseUrl, "/api/auth/session");
  const conversationApi = (id) => _default(apiUrl, "/conversation/:id", {
    id
  });
  const conversationsApi = (offset, limit) => _default(apiUrl, "/conversations", {
    offset,
    limit
  });
  async function getCurrentChatId() {
    const match = location.pathname.match(/^\/chat\/([a-z0-9-]+)$/i);
    if (match)
      return match[1];
    const conversations = await fetchConversations();
    if (conversations && conversations.items.length > 0) {
      return conversations.items[0].id;
    }
    throw new Error("No chat id found.");
  }
  async function fetchConversation() {
    const chatId = await getCurrentChatId();
    const url = conversationApi(chatId);
    const conversation = await fetchApi(url);
    return {
      id: chatId,
      ...conversation
    };
  }
  async function fetchConversations(offset = 0, limit = 20) {
    const url = conversationsApi(offset, limit);
    return fetchApi(url);
  }
  async function fetchApi(url) {
    const accessToken = await getAccessToken();
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  }
  async function getAccessToken() {
    const _accessToken = getPageAccessToken();
    if (_accessToken)
      return _accessToken;
    const session2 = await fetchSession();
    return session2.accessToken;
  }
  let session = null;
  async function fetchSession() {
    if (session)
      return session;
    const response = await fetch(sessionApi);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    session = await response.json();
    return session;
  }
  class LinkedListItem {
    constructor(value2) {
      __publicField(this, "value");
      __publicField(this, "child", null);
      this.value = value2;
    }
  }
  async function getConversations() {
    var _a;
    const conversation = await fetchConversation();
    const title = conversation.title || "ChatGPT Conversation";
    const createTime = conversation.create_time;
    const result = [];
    const nodes = Object.values(conversation.mapping);
    const root2 = nodes.find((node2) => node2.parent === null);
    if (!root2)
      throw new Error("No root node found.");
    const conversationChoices = getConversationChoice();
    const nodeMap = new Map(Object.entries(conversation.mapping));
    const tail = new LinkedListItem(root2);
    const queue = [tail];
    let index2 = -1;
    while (queue.length > 0) {
      const current = queue.shift();
      const node2 = nodeMap.get(current.value.id);
      if (!node2)
        throw new Error("No node found.");
      const role = (_a = node2.message) == null ? void 0 : _a.author.role;
      if (role === "assistant" || role === "user") {
        result.push(node2);
      }
      if (node2.children.length === 0)
        continue;
      const _last = node2.children.length - 1;
      const choice = conversationChoices[index2++] ?? _last;
      const childId = node2.children[choice];
      if (!childId)
        throw new Error("No child node found.");
      const child = nodeMap.get(childId);
      if (!child)
        throw new Error("No child node found.");
      const childItem = new LinkedListItem(child);
      current.child = childItem;
      queue.push(childItem);
    }
    return {
      id: conversation.id,
      title,
      createTime,
      conversations: result
    };
  }
  function toString(value2, options2) {
    const includeImageAlt = (options2 || {}).includeImageAlt;
    return one$2(
      value2,
      typeof includeImageAlt === "boolean" ? includeImageAlt : true
    );
  }
  function one$2(value2, includeImageAlt) {
    return node(value2) && ("value" in value2 && value2.value || includeImageAlt && "alt" in value2 && value2.alt || "children" in value2 && all$2(value2.children, includeImageAlt)) || Array.isArray(value2) && all$2(value2, includeImageAlt) || "";
  }
  function all$2(values, includeImageAlt) {
    const result = [];
    let index2 = -1;
    while (++index2 < values.length) {
      result[index2] = one$2(values[index2], includeImageAlt);
    }
    return result.join("");
  }
  function node(value2) {
    return Boolean(value2 && typeof value2 === "object");
  }
  function splice(list2, start, remove, items) {
    const end = list2.length;
    let chunkStart = 0;
    let parameters;
    if (start < 0) {
      start = -start > end ? 0 : end + start;
    } else {
      start = start > end ? end : start;
    }
    remove = remove > 0 ? remove : 0;
    if (items.length < 1e4) {
      parameters = Array.from(items);
      parameters.unshift(start, remove);
      [].splice.apply(list2, parameters);
    } else {
      if (remove)
        [].splice.apply(list2, [start, remove]);
      while (chunkStart < items.length) {
        parameters = items.slice(chunkStart, chunkStart + 1e4);
        parameters.unshift(start, 0);
        [].splice.apply(list2, parameters);
        chunkStart += 1e4;
        start += 1e4;
      }
    }
  }
  function push(list2, items) {
    if (list2.length > 0) {
      splice(list2, list2.length, 0, items);
      return list2;
    }
    return items;
  }
  const hasOwnProperty = {}.hasOwnProperty;
  function combineExtensions(extensions) {
    const all2 = {};
    let index2 = -1;
    while (++index2 < extensions.length) {
      syntaxExtension(all2, extensions[index2]);
    }
    return all2;
  }
  function syntaxExtension(all2, extension2) {
    let hook;
    for (hook in extension2) {
      const maybe = hasOwnProperty.call(all2, hook) ? all2[hook] : void 0;
      const left = maybe || (all2[hook] = {});
      const right = extension2[hook];
      let code2;
      for (code2 in right) {
        if (!hasOwnProperty.call(left, code2))
          left[code2] = [];
        const value2 = right[code2];
        constructs(
          // @ts-expect-error Looks like a list.
          left[code2],
          Array.isArray(value2) ? value2 : value2 ? [value2] : []
        );
      }
    }
  }
  function constructs(existing, list2) {
    let index2 = -1;
    const before = [];
    while (++index2 < list2.length) {
      (list2[index2].add === "after" ? existing : before).push(list2[index2]);
    }
    splice(existing, 0, 0, before);
  }
  const unicodePunctuationRegex = /[!-/:-@[-`{-~\u00A1\u00A7\u00AB\u00B6\u00B7\u00BB\u00BF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]/;
  const asciiAlpha = regexCheck(/[A-Za-z]/);
  const asciiDigit = regexCheck(/\d/);
  const asciiHexDigit = regexCheck(/[\dA-Fa-f]/);
  const asciiAlphanumeric = regexCheck(/[\dA-Za-z]/);
  const asciiPunctuation = regexCheck(/[!-/:-@[-`{-~]/);
  const asciiAtext = regexCheck(/[#-'*+\--9=?A-Z^-~]/);
  function asciiControl(code2) {
    return (
      // Special whitespace codes (which have negative values), C0 and Control
      // character DEL
      code2 !== null && (code2 < 32 || code2 === 127)
    );
  }
  function markdownLineEndingOrSpace(code2) {
    return code2 !== null && (code2 < 0 || code2 === 32);
  }
  function markdownLineEnding(code2) {
    return code2 !== null && code2 < -2;
  }
  function markdownSpace(code2) {
    return code2 === -2 || code2 === -1 || code2 === 32;
  }
  const unicodeWhitespace = regexCheck(/\s/);
  const unicodePunctuation = regexCheck(unicodePunctuationRegex);
  function regexCheck(regex) {
    return check;
    function check(code2) {
      return code2 !== null && regex.test(String.fromCharCode(code2));
    }
  }
  function factorySpace(effects, ok2, type, max) {
    const limit = max ? max - 1 : Number.POSITIVE_INFINITY;
    let size = 0;
    return start;
    function start(code2) {
      if (markdownSpace(code2)) {
        effects.enter(type);
        return prefix(code2);
      }
      return ok2(code2);
    }
    function prefix(code2) {
      if (markdownSpace(code2) && size++ < limit) {
        effects.consume(code2);
        return prefix;
      }
      effects.exit(type);
      return ok2(code2);
    }
  }
  const content$2 = {
    tokenize: initializeContent
  };
  function initializeContent(effects) {
    const contentStart = effects.attempt(
      this.parser.constructs.contentInitial,
      afterContentStartConstruct,
      paragraphInitial
    );
    let previous2;
    return contentStart;
    function afterContentStartConstruct(code2) {
      if (code2 === null) {
        effects.consume(code2);
        return;
      }
      effects.enter("lineEnding");
      effects.consume(code2);
      effects.exit("lineEnding");
      return factorySpace(effects, contentStart, "linePrefix");
    }
    function paragraphInitial(code2) {
      effects.enter("paragraph");
      return lineStart(code2);
    }
    function lineStart(code2) {
      const token = effects.enter("chunkText", {
        contentType: "text",
        previous: previous2
      });
      if (previous2) {
        previous2.next = token;
      }
      previous2 = token;
      return data(code2);
    }
    function data(code2) {
      if (code2 === null) {
        effects.exit("chunkText");
        effects.exit("paragraph");
        effects.consume(code2);
        return;
      }
      if (markdownLineEnding(code2)) {
        effects.consume(code2);
        effects.exit("chunkText");
        return lineStart;
      }
      effects.consume(code2);
      return data;
    }
  }
  const document$2 = {
    tokenize: initializeDocument
  };
  const containerConstruct = {
    tokenize: tokenizeContainer
  };
  function initializeDocument(effects) {
    const self2 = this;
    const stack = [];
    let continued = 0;
    let childFlow;
    let childToken;
    let lineStartOffset;
    return start;
    function start(code2) {
      if (continued < stack.length) {
        const item = stack[continued];
        self2.containerState = item[1];
        return effects.attempt(
          item[0].continuation,
          documentContinue,
          checkNewContainers
        )(code2);
      }
      return checkNewContainers(code2);
    }
    function documentContinue(code2) {
      continued++;
      if (self2.containerState._closeFlow) {
        self2.containerState._closeFlow = void 0;
        if (childFlow) {
          closeFlow();
        }
        const indexBeforeExits = self2.events.length;
        let indexBeforeFlow = indexBeforeExits;
        let point2;
        while (indexBeforeFlow--) {
          if (self2.events[indexBeforeFlow][0] === "exit" && self2.events[indexBeforeFlow][1].type === "chunkFlow") {
            point2 = self2.events[indexBeforeFlow][1].end;
            break;
          }
        }
        exitContainers(continued);
        let index2 = indexBeforeExits;
        while (index2 < self2.events.length) {
          self2.events[index2][1].end = Object.assign({}, point2);
          index2++;
        }
        splice(
          self2.events,
          indexBeforeFlow + 1,
          0,
          self2.events.slice(indexBeforeExits)
        );
        self2.events.length = index2;
        return checkNewContainers(code2);
      }
      return start(code2);
    }
    function checkNewContainers(code2) {
      if (continued === stack.length) {
        if (!childFlow) {
          return documentContinued(code2);
        }
        if (childFlow.currentConstruct && childFlow.currentConstruct.concrete) {
          return flowStart(code2);
        }
        self2.interrupt = Boolean(
          childFlow.currentConstruct && !childFlow._gfmTableDynamicInterruptHack
        );
      }
      self2.containerState = {};
      return effects.check(
        containerConstruct,
        thereIsANewContainer,
        thereIsNoNewContainer
      )(code2);
    }
    function thereIsANewContainer(code2) {
      if (childFlow)
        closeFlow();
      exitContainers(continued);
      return documentContinued(code2);
    }
    function thereIsNoNewContainer(code2) {
      self2.parser.lazy[self2.now().line] = continued !== stack.length;
      lineStartOffset = self2.now().offset;
      return flowStart(code2);
    }
    function documentContinued(code2) {
      self2.containerState = {};
      return effects.attempt(
        containerConstruct,
        containerContinue,
        flowStart
      )(code2);
    }
    function containerContinue(code2) {
      continued++;
      stack.push([self2.currentConstruct, self2.containerState]);
      return documentContinued(code2);
    }
    function flowStart(code2) {
      if (code2 === null) {
        if (childFlow)
          closeFlow();
        exitContainers(0);
        effects.consume(code2);
        return;
      }
      childFlow = childFlow || self2.parser.flow(self2.now());
      effects.enter("chunkFlow", {
        contentType: "flow",
        previous: childToken,
        _tokenizer: childFlow
      });
      return flowContinue(code2);
    }
    function flowContinue(code2) {
      if (code2 === null) {
        writeToChild(effects.exit("chunkFlow"), true);
        exitContainers(0);
        effects.consume(code2);
        return;
      }
      if (markdownLineEnding(code2)) {
        effects.consume(code2);
        writeToChild(effects.exit("chunkFlow"));
        continued = 0;
        self2.interrupt = void 0;
        return start;
      }
      effects.consume(code2);
      return flowContinue;
    }
    function writeToChild(token, eof) {
      const stream = self2.sliceStream(token);
      if (eof)
        stream.push(null);
      token.previous = childToken;
      if (childToken)
        childToken.next = token;
      childToken = token;
      childFlow.defineSkip(token.start);
      childFlow.write(stream);
      if (self2.parser.lazy[token.start.line]) {
        let index2 = childFlow.events.length;
        while (index2--) {
          if (
            // The token starts before the line ending…
            childFlow.events[index2][1].start.offset < lineStartOffset && // …and either is not ended yet…
            (!childFlow.events[index2][1].end || // …or ends after it.
            childFlow.events[index2][1].end.offset > lineStartOffset)
          ) {
            return;
          }
        }
        const indexBeforeExits = self2.events.length;
        let indexBeforeFlow = indexBeforeExits;
        let seen;
        let point2;
        while (indexBeforeFlow--) {
          if (self2.events[indexBeforeFlow][0] === "exit" && self2.events[indexBeforeFlow][1].type === "chunkFlow") {
            if (seen) {
              point2 = self2.events[indexBeforeFlow][1].end;
              break;
            }
            seen = true;
          }
        }
        exitContainers(continued);
        index2 = indexBeforeExits;
        while (index2 < self2.events.length) {
          self2.events[index2][1].end = Object.assign({}, point2);
          index2++;
        }
        splice(
          self2.events,
          indexBeforeFlow + 1,
          0,
          self2.events.slice(indexBeforeExits)
        );
        self2.events.length = index2;
      }
    }
    function exitContainers(size) {
      let index2 = stack.length;
      while (index2-- > size) {
        const entry = stack[index2];
        self2.containerState = entry[1];
        entry[0].exit.call(self2, effects);
      }
      stack.length = size;
    }
    function closeFlow() {
      childFlow.write([null]);
      childToken = void 0;
      childFlow = void 0;
      self2.containerState._closeFlow = void 0;
    }
  }
  function tokenizeContainer(effects, ok2, nok) {
    return factorySpace(
      effects,
      effects.attempt(this.parser.constructs.document, ok2, nok),
      "linePrefix",
      this.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4
    );
  }
  function classifyCharacter(code2) {
    if (code2 === null || markdownLineEndingOrSpace(code2) || unicodeWhitespace(code2)) {
      return 1;
    }
    if (unicodePunctuation(code2)) {
      return 2;
    }
  }
  function resolveAll(constructs2, events, context) {
    const called = [];
    let index2 = -1;
    while (++index2 < constructs2.length) {
      const resolve = constructs2[index2].resolveAll;
      if (resolve && !called.includes(resolve)) {
        events = resolve(events, context);
        called.push(resolve);
      }
    }
    return events;
  }
  const attention = {
    name: "attention",
    tokenize: tokenizeAttention,
    resolveAll: resolveAllAttention
  };
  function resolveAllAttention(events, context) {
    let index2 = -1;
    let open;
    let group;
    let text2;
    let openingSequence;
    let closingSequence;
    let use;
    let nextEvents;
    let offset;
    while (++index2 < events.length) {
      if (events[index2][0] === "enter" && events[index2][1].type === "attentionSequence" && events[index2][1]._close) {
        open = index2;
        while (open--) {
          if (events[open][0] === "exit" && events[open][1].type === "attentionSequence" && events[open][1]._open && // If the markers are the same:
          context.sliceSerialize(events[open][1]).charCodeAt(0) === context.sliceSerialize(events[index2][1]).charCodeAt(0)) {
            if ((events[open][1]._close || events[index2][1]._open) && (events[index2][1].end.offset - events[index2][1].start.offset) % 3 && !((events[open][1].end.offset - events[open][1].start.offset + events[index2][1].end.offset - events[index2][1].start.offset) % 3)) {
              continue;
            }
            use = events[open][1].end.offset - events[open][1].start.offset > 1 && events[index2][1].end.offset - events[index2][1].start.offset > 1 ? 2 : 1;
            const start = Object.assign({}, events[open][1].end);
            const end = Object.assign({}, events[index2][1].start);
            movePoint(start, -use);
            movePoint(end, use);
            openingSequence = {
              type: use > 1 ? "strongSequence" : "emphasisSequence",
              start,
              end: Object.assign({}, events[open][1].end)
            };
            closingSequence = {
              type: use > 1 ? "strongSequence" : "emphasisSequence",
              start: Object.assign({}, events[index2][1].start),
              end
            };
            text2 = {
              type: use > 1 ? "strongText" : "emphasisText",
              start: Object.assign({}, events[open][1].end),
              end: Object.assign({}, events[index2][1].start)
            };
            group = {
              type: use > 1 ? "strong" : "emphasis",
              start: Object.assign({}, openingSequence.start),
              end: Object.assign({}, closingSequence.end)
            };
            events[open][1].end = Object.assign({}, openingSequence.start);
            events[index2][1].start = Object.assign({}, closingSequence.end);
            nextEvents = [];
            if (events[open][1].end.offset - events[open][1].start.offset) {
              nextEvents = push(nextEvents, [
                ["enter", events[open][1], context],
                ["exit", events[open][1], context]
              ]);
            }
            nextEvents = push(nextEvents, [
              ["enter", group, context],
              ["enter", openingSequence, context],
              ["exit", openingSequence, context],
              ["enter", text2, context]
            ]);
            nextEvents = push(
              nextEvents,
              resolveAll(
                context.parser.constructs.insideSpan.null,
                events.slice(open + 1, index2),
                context
              )
            );
            nextEvents = push(nextEvents, [
              ["exit", text2, context],
              ["enter", closingSequence, context],
              ["exit", closingSequence, context],
              ["exit", group, context]
            ]);
            if (events[index2][1].end.offset - events[index2][1].start.offset) {
              offset = 2;
              nextEvents = push(nextEvents, [
                ["enter", events[index2][1], context],
                ["exit", events[index2][1], context]
              ]);
            } else {
              offset = 0;
            }
            splice(events, open - 1, index2 - open + 3, nextEvents);
            index2 = open + nextEvents.length - offset - 2;
            break;
          }
        }
      }
    }
    index2 = -1;
    while (++index2 < events.length) {
      if (events[index2][1].type === "attentionSequence") {
        events[index2][1].type = "data";
      }
    }
    return events;
  }
  function tokenizeAttention(effects, ok2) {
    const attentionMarkers2 = this.parser.constructs.attentionMarkers.null;
    const previous2 = this.previous;
    const before = classifyCharacter(previous2);
    let marker;
    return start;
    function start(code2) {
      effects.enter("attentionSequence");
      marker = code2;
      return sequence(code2);
    }
    function sequence(code2) {
      if (code2 === marker) {
        effects.consume(code2);
        return sequence;
      }
      const token = effects.exit("attentionSequence");
      const after = classifyCharacter(code2);
      const open = !after || after === 2 && before || attentionMarkers2.includes(code2);
      const close2 = !before || before === 2 && after || attentionMarkers2.includes(previous2);
      token._open = Boolean(marker === 42 ? open : open && (before || !close2));
      token._close = Boolean(marker === 42 ? close2 : close2 && (after || !open));
      return ok2(code2);
    }
  }
  function movePoint(point2, offset) {
    point2.column += offset;
    point2.offset += offset;
    point2._bufferIndex += offset;
  }
  const autolink = {
    name: "autolink",
    tokenize: tokenizeAutolink
  };
  function tokenizeAutolink(effects, ok2, nok) {
    let size = 1;
    return start;
    function start(code2) {
      effects.enter("autolink");
      effects.enter("autolinkMarker");
      effects.consume(code2);
      effects.exit("autolinkMarker");
      effects.enter("autolinkProtocol");
      return open;
    }
    function open(code2) {
      if (asciiAlpha(code2)) {
        effects.consume(code2);
        return schemeOrEmailAtext;
      }
      return asciiAtext(code2) ? emailAtext(code2) : nok(code2);
    }
    function schemeOrEmailAtext(code2) {
      return code2 === 43 || code2 === 45 || code2 === 46 || asciiAlphanumeric(code2) ? schemeInsideOrEmailAtext(code2) : emailAtext(code2);
    }
    function schemeInsideOrEmailAtext(code2) {
      if (code2 === 58) {
        effects.consume(code2);
        return urlInside;
      }
      if ((code2 === 43 || code2 === 45 || code2 === 46 || asciiAlphanumeric(code2)) && size++ < 32) {
        effects.consume(code2);
        return schemeInsideOrEmailAtext;
      }
      return emailAtext(code2);
    }
    function urlInside(code2) {
      if (code2 === 62) {
        effects.exit("autolinkProtocol");
        return end(code2);
      }
      if (code2 === null || code2 === 32 || code2 === 60 || asciiControl(code2)) {
        return nok(code2);
      }
      effects.consume(code2);
      return urlInside;
    }
    function emailAtext(code2) {
      if (code2 === 64) {
        effects.consume(code2);
        size = 0;
        return emailAtSignOrDot;
      }
      if (asciiAtext(code2)) {
        effects.consume(code2);
        return emailAtext;
      }
      return nok(code2);
    }
    function emailAtSignOrDot(code2) {
      return asciiAlphanumeric(code2) ? emailLabel(code2) : nok(code2);
    }
    function emailLabel(code2) {
      if (code2 === 46) {
        effects.consume(code2);
        size = 0;
        return emailAtSignOrDot;
      }
      if (code2 === 62) {
        effects.exit("autolinkProtocol").type = "autolinkEmail";
        return end(code2);
      }
      return emailValue(code2);
    }
    function emailValue(code2) {
      if ((code2 === 45 || asciiAlphanumeric(code2)) && size++ < 63) {
        effects.consume(code2);
        return code2 === 45 ? emailValue : emailLabel;
      }
      return nok(code2);
    }
    function end(code2) {
      effects.enter("autolinkMarker");
      effects.consume(code2);
      effects.exit("autolinkMarker");
      effects.exit("autolink");
      return ok2;
    }
  }
  const blankLine = {
    tokenize: tokenizeBlankLine,
    partial: true
  };
  function tokenizeBlankLine(effects, ok2, nok) {
    return factorySpace(effects, afterWhitespace, "linePrefix");
    function afterWhitespace(code2) {
      return code2 === null || markdownLineEnding(code2) ? ok2(code2) : nok(code2);
    }
  }
  const blockQuote = {
    name: "blockQuote",
    tokenize: tokenizeBlockQuoteStart,
    continuation: {
      tokenize: tokenizeBlockQuoteContinuation
    },
    exit: exit$1
  };
  function tokenizeBlockQuoteStart(effects, ok2, nok) {
    const self2 = this;
    return start;
    function start(code2) {
      if (code2 === 62) {
        const state = self2.containerState;
        if (!state.open) {
          effects.enter("blockQuote", {
            _container: true
          });
          state.open = true;
        }
        effects.enter("blockQuotePrefix");
        effects.enter("blockQuoteMarker");
        effects.consume(code2);
        effects.exit("blockQuoteMarker");
        return after;
      }
      return nok(code2);
    }
    function after(code2) {
      if (markdownSpace(code2)) {
        effects.enter("blockQuotePrefixWhitespace");
        effects.consume(code2);
        effects.exit("blockQuotePrefixWhitespace");
        effects.exit("blockQuotePrefix");
        return ok2;
      }
      effects.exit("blockQuotePrefix");
      return ok2(code2);
    }
  }
  function tokenizeBlockQuoteContinuation(effects, ok2, nok) {
    return factorySpace(
      effects,
      effects.attempt(blockQuote, ok2, nok),
      "linePrefix",
      this.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4
    );
  }
  function exit$1(effects) {
    effects.exit("blockQuote");
  }
  const characterEscape = {
    name: "characterEscape",
    tokenize: tokenizeCharacterEscape
  };
  function tokenizeCharacterEscape(effects, ok2, nok) {
    return start;
    function start(code2) {
      effects.enter("characterEscape");
      effects.enter("escapeMarker");
      effects.consume(code2);
      effects.exit("escapeMarker");
      return open;
    }
    function open(code2) {
      if (asciiPunctuation(code2)) {
        effects.enter("characterEscapeValue");
        effects.consume(code2);
        effects.exit("characterEscapeValue");
        effects.exit("characterEscape");
        return ok2;
      }
      return nok(code2);
    }
  }
  const element$1 = document.createElement("i");
  function decodeNamedCharacterReference(value2) {
    const characterReference2 = "&" + value2 + ";";
    element$1.innerHTML = characterReference2;
    const char = element$1.textContent;
    if (char.charCodeAt(char.length - 1) === 59 && value2 !== "semi") {
      return false;
    }
    return char === characterReference2 ? false : char;
  }
  const characterReference = {
    name: "characterReference",
    tokenize: tokenizeCharacterReference
  };
  function tokenizeCharacterReference(effects, ok2, nok) {
    const self2 = this;
    let size = 0;
    let max;
    let test;
    return start;
    function start(code2) {
      effects.enter("characterReference");
      effects.enter("characterReferenceMarker");
      effects.consume(code2);
      effects.exit("characterReferenceMarker");
      return open;
    }
    function open(code2) {
      if (code2 === 35) {
        effects.enter("characterReferenceMarkerNumeric");
        effects.consume(code2);
        effects.exit("characterReferenceMarkerNumeric");
        return numeric;
      }
      effects.enter("characterReferenceValue");
      max = 31;
      test = asciiAlphanumeric;
      return value2(code2);
    }
    function numeric(code2) {
      if (code2 === 88 || code2 === 120) {
        effects.enter("characterReferenceMarkerHexadecimal");
        effects.consume(code2);
        effects.exit("characterReferenceMarkerHexadecimal");
        effects.enter("characterReferenceValue");
        max = 6;
        test = asciiHexDigit;
        return value2;
      }
      effects.enter("characterReferenceValue");
      max = 7;
      test = asciiDigit;
      return value2(code2);
    }
    function value2(code2) {
      let token;
      if (code2 === 59 && size) {
        token = effects.exit("characterReferenceValue");
        if (test === asciiAlphanumeric && !decodeNamedCharacterReference(self2.sliceSerialize(token))) {
          return nok(code2);
        }
        effects.enter("characterReferenceMarker");
        effects.consume(code2);
        effects.exit("characterReferenceMarker");
        effects.exit("characterReference");
        return ok2;
      }
      if (test(code2) && size++ < max) {
        effects.consume(code2);
        return value2;
      }
      return nok(code2);
    }
  }
  const codeFenced = {
    name: "codeFenced",
    tokenize: tokenizeCodeFenced,
    concrete: true
  };
  function tokenizeCodeFenced(effects, ok2, nok) {
    const self2 = this;
    const closingFenceConstruct = {
      tokenize: tokenizeClosingFence,
      partial: true
    };
    const nonLazyLine = {
      tokenize: tokenizeNonLazyLine,
      partial: true
    };
    const tail = this.events[this.events.length - 1];
    const initialPrefix = tail && tail[1].type === "linePrefix" ? tail[2].sliceSerialize(tail[1], true).length : 0;
    let sizeOpen = 0;
    let marker;
    return start;
    function start(code2) {
      effects.enter("codeFenced");
      effects.enter("codeFencedFence");
      effects.enter("codeFencedFenceSequence");
      marker = code2;
      return sequenceOpen(code2);
    }
    function sequenceOpen(code2) {
      if (code2 === marker) {
        effects.consume(code2);
        sizeOpen++;
        return sequenceOpen;
      }
      effects.exit("codeFencedFenceSequence");
      return sizeOpen < 3 ? nok(code2) : factorySpace(effects, infoOpen, "whitespace")(code2);
    }
    function infoOpen(code2) {
      if (code2 === null || markdownLineEnding(code2)) {
        return openAfter(code2);
      }
      effects.enter("codeFencedFenceInfo");
      effects.enter("chunkString", {
        contentType: "string"
      });
      return info(code2);
    }
    function info(code2) {
      if (code2 === null || markdownLineEndingOrSpace(code2)) {
        effects.exit("chunkString");
        effects.exit("codeFencedFenceInfo");
        return factorySpace(effects, infoAfter, "whitespace")(code2);
      }
      if (code2 === 96 && code2 === marker)
        return nok(code2);
      effects.consume(code2);
      return info;
    }
    function infoAfter(code2) {
      if (code2 === null || markdownLineEnding(code2)) {
        return openAfter(code2);
      }
      effects.enter("codeFencedFenceMeta");
      effects.enter("chunkString", {
        contentType: "string"
      });
      return meta(code2);
    }
    function meta(code2) {
      if (code2 === null || markdownLineEnding(code2)) {
        effects.exit("chunkString");
        effects.exit("codeFencedFenceMeta");
        return openAfter(code2);
      }
      if (code2 === 96 && code2 === marker)
        return nok(code2);
      effects.consume(code2);
      return meta;
    }
    function openAfter(code2) {
      effects.exit("codeFencedFence");
      return self2.interrupt ? ok2(code2) : contentStart(code2);
    }
    function contentStart(code2) {
      if (code2 === null) {
        return after(code2);
      }
      if (markdownLineEnding(code2)) {
        return effects.attempt(
          nonLazyLine,
          effects.attempt(
            closingFenceConstruct,
            after,
            initialPrefix ? factorySpace(
              effects,
              contentStart,
              "linePrefix",
              initialPrefix + 1
            ) : contentStart
          ),
          after
        )(code2);
      }
      effects.enter("codeFlowValue");
      return contentContinue(code2);
    }
    function contentContinue(code2) {
      if (code2 === null || markdownLineEnding(code2)) {
        effects.exit("codeFlowValue");
        return contentStart(code2);
      }
      effects.consume(code2);
      return contentContinue;
    }
    function after(code2) {
      effects.exit("codeFenced");
      return ok2(code2);
    }
    function tokenizeNonLazyLine(effects2, ok3, nok2) {
      const self3 = this;
      return start2;
      function start2(code2) {
        effects2.enter("lineEnding");
        effects2.consume(code2);
        effects2.exit("lineEnding");
        return lineStart;
      }
      function lineStart(code2) {
        return self3.parser.lazy[self3.now().line] ? nok2(code2) : ok3(code2);
      }
    }
    function tokenizeClosingFence(effects2, ok3, nok2) {
      let size = 0;
      return factorySpace(
        effects2,
        closingSequenceStart,
        "linePrefix",
        this.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4
      );
      function closingSequenceStart(code2) {
        effects2.enter("codeFencedFence");
        effects2.enter("codeFencedFenceSequence");
        return closingSequence(code2);
      }
      function closingSequence(code2) {
        if (code2 === marker) {
          effects2.consume(code2);
          size++;
          return closingSequence;
        }
        if (size < sizeOpen)
          return nok2(code2);
        effects2.exit("codeFencedFenceSequence");
        return factorySpace(effects2, closingSequenceEnd, "whitespace")(code2);
      }
      function closingSequenceEnd(code2) {
        if (code2 === null || markdownLineEnding(code2)) {
          effects2.exit("codeFencedFence");
          return ok3(code2);
        }
        return nok2(code2);
      }
    }
  }
  const codeIndented = {
    name: "codeIndented",
    tokenize: tokenizeCodeIndented
  };
  const indentedContent = {
    tokenize: tokenizeIndentedContent,
    partial: true
  };
  function tokenizeCodeIndented(effects, ok2, nok) {
    const self2 = this;
    return start;
    function start(code2) {
      effects.enter("codeIndented");
      return factorySpace(effects, afterStartPrefix, "linePrefix", 4 + 1)(code2);
    }
    function afterStartPrefix(code2) {
      const tail = self2.events[self2.events.length - 1];
      return tail && tail[1].type === "linePrefix" && tail[2].sliceSerialize(tail[1], true).length >= 4 ? afterPrefix(code2) : nok(code2);
    }
    function afterPrefix(code2) {
      if (code2 === null) {
        return after(code2);
      }
      if (markdownLineEnding(code2)) {
        return effects.attempt(indentedContent, afterPrefix, after)(code2);
      }
      effects.enter("codeFlowValue");
      return content2(code2);
    }
    function content2(code2) {
      if (code2 === null || markdownLineEnding(code2)) {
        effects.exit("codeFlowValue");
        return afterPrefix(code2);
      }
      effects.consume(code2);
      return content2;
    }
    function after(code2) {
      effects.exit("codeIndented");
      return ok2(code2);
    }
  }
  function tokenizeIndentedContent(effects, ok2, nok) {
    const self2 = this;
    return start;
    function start(code2) {
      if (self2.parser.lazy[self2.now().line]) {
        return nok(code2);
      }
      if (markdownLineEnding(code2)) {
        effects.enter("lineEnding");
        effects.consume(code2);
        effects.exit("lineEnding");
        return start;
      }
      return factorySpace(effects, afterPrefix, "linePrefix", 4 + 1)(code2);
    }
    function afterPrefix(code2) {
      const tail = self2.events[self2.events.length - 1];
      return tail && tail[1].type === "linePrefix" && tail[2].sliceSerialize(tail[1], true).length >= 4 ? ok2(code2) : markdownLineEnding(code2) ? start(code2) : nok(code2);
    }
  }
  const codeText = {
    name: "codeText",
    tokenize: tokenizeCodeText,
    resolve: resolveCodeText,
    previous: previous$1
  };
  function resolveCodeText(events) {
    let tailExitIndex = events.length - 4;
    let headEnterIndex = 3;
    let index2;
    let enter;
    if ((events[headEnterIndex][1].type === "lineEnding" || events[headEnterIndex][1].type === "space") && (events[tailExitIndex][1].type === "lineEnding" || events[tailExitIndex][1].type === "space")) {
      index2 = headEnterIndex;
      while (++index2 < tailExitIndex) {
        if (events[index2][1].type === "codeTextData") {
          events[headEnterIndex][1].type = "codeTextPadding";
          events[tailExitIndex][1].type = "codeTextPadding";
          headEnterIndex += 2;
          tailExitIndex -= 2;
          break;
        }
      }
    }
    index2 = headEnterIndex - 1;
    tailExitIndex++;
    while (++index2 <= tailExitIndex) {
      if (enter === void 0) {
        if (index2 !== tailExitIndex && events[index2][1].type !== "lineEnding") {
          enter = index2;
        }
      } else if (index2 === tailExitIndex || events[index2][1].type === "lineEnding") {
        events[enter][1].type = "codeTextData";
        if (index2 !== enter + 2) {
          events[enter][1].end = events[index2 - 1][1].end;
          events.splice(enter + 2, index2 - enter - 2);
          tailExitIndex -= index2 - enter - 2;
          index2 = enter + 2;
        }
        enter = void 0;
      }
    }
    return events;
  }
  function previous$1(code2) {
    return code2 !== 96 || this.events[this.events.length - 1][1].type === "characterEscape";
  }
  function tokenizeCodeText(effects, ok2, nok) {
    let sizeOpen = 0;
    let size;
    let token;
    return start;
    function start(code2) {
      effects.enter("codeText");
      effects.enter("codeTextSequence");
      return openingSequence(code2);
    }
    function openingSequence(code2) {
      if (code2 === 96) {
        effects.consume(code2);
        sizeOpen++;
        return openingSequence;
      }
      effects.exit("codeTextSequence");
      return gap(code2);
    }
    function gap(code2) {
      if (code2 === null) {
        return nok(code2);
      }
      if (code2 === 96) {
        token = effects.enter("codeTextSequence");
        size = 0;
        return closingSequence(code2);
      }
      if (code2 === 32) {
        effects.enter("space");
        effects.consume(code2);
        effects.exit("space");
        return gap;
      }
      if (markdownLineEnding(code2)) {
        effects.enter("lineEnding");
        effects.consume(code2);
        effects.exit("lineEnding");
        return gap;
      }
      effects.enter("codeTextData");
      return data(code2);
    }
    function data(code2) {
      if (code2 === null || code2 === 32 || code2 === 96 || markdownLineEnding(code2)) {
        effects.exit("codeTextData");
        return gap(code2);
      }
      effects.consume(code2);
      return data;
    }
    function closingSequence(code2) {
      if (code2 === 96) {
        effects.consume(code2);
        size++;
        return closingSequence;
      }
      if (size === sizeOpen) {
        effects.exit("codeTextSequence");
        effects.exit("codeText");
        return ok2(code2);
      }
      token.type = "codeTextData";
      return data(code2);
    }
  }
  function subtokenize(events) {
    const jumps = {};
    let index2 = -1;
    let event;
    let lineIndex;
    let otherIndex;
    let otherEvent;
    let parameters;
    let subevents;
    let more;
    while (++index2 < events.length) {
      while (index2 in jumps) {
        index2 = jumps[index2];
      }
      event = events[index2];
      if (index2 && event[1].type === "chunkFlow" && events[index2 - 1][1].type === "listItemPrefix") {
        subevents = event[1]._tokenizer.events;
        otherIndex = 0;
        if (otherIndex < subevents.length && subevents[otherIndex][1].type === "lineEndingBlank") {
          otherIndex += 2;
        }
        if (otherIndex < subevents.length && subevents[otherIndex][1].type === "content") {
          while (++otherIndex < subevents.length) {
            if (subevents[otherIndex][1].type === "content") {
              break;
            }
            if (subevents[otherIndex][1].type === "chunkText") {
              subevents[otherIndex][1]._isInFirstContentOfListItem = true;
              otherIndex++;
            }
          }
        }
      }
      if (event[0] === "enter") {
        if (event[1].contentType) {
          Object.assign(jumps, subcontent(events, index2));
          index2 = jumps[index2];
          more = true;
        }
      } else if (event[1]._container) {
        otherIndex = index2;
        lineIndex = void 0;
        while (otherIndex--) {
          otherEvent = events[otherIndex];
          if (otherEvent[1].type === "lineEnding" || otherEvent[1].type === "lineEndingBlank") {
            if (otherEvent[0] === "enter") {
              if (lineIndex) {
                events[lineIndex][1].type = "lineEndingBlank";
              }
              otherEvent[1].type = "lineEnding";
              lineIndex = otherIndex;
            }
          } else {
            break;
          }
        }
        if (lineIndex) {
          event[1].end = Object.assign({}, events[lineIndex][1].start);
          parameters = events.slice(lineIndex, index2);
          parameters.unshift(event);
          splice(events, lineIndex, index2 - lineIndex + 1, parameters);
        }
      }
    }
    return !more;
  }
  function subcontent(events, eventIndex) {
    const token = events[eventIndex][1];
    const context = events[eventIndex][2];
    let startPosition = eventIndex - 1;
    const startPositions = [];
    const tokenizer = token._tokenizer || context.parser[token.contentType](token.start);
    const childEvents = tokenizer.events;
    const jumps = [];
    const gaps = {};
    let stream;
    let previous2;
    let index2 = -1;
    let current = token;
    let adjust = 0;
    let start = 0;
    const breaks = [start];
    while (current) {
      while (events[++startPosition][1] !== current) {
      }
      startPositions.push(startPosition);
      if (!current._tokenizer) {
        stream = context.sliceStream(current);
        if (!current.next) {
          stream.push(null);
        }
        if (previous2) {
          tokenizer.defineSkip(current.start);
        }
        if (current._isInFirstContentOfListItem) {
          tokenizer._gfmTasklistFirstContentOfListItem = true;
        }
        tokenizer.write(stream);
        if (current._isInFirstContentOfListItem) {
          tokenizer._gfmTasklistFirstContentOfListItem = void 0;
        }
      }
      previous2 = current;
      current = current.next;
    }
    current = token;
    while (++index2 < childEvents.length) {
      if (
        // Find a void token that includes a break.
        childEvents[index2][0] === "exit" && childEvents[index2 - 1][0] === "enter" && childEvents[index2][1].type === childEvents[index2 - 1][1].type && childEvents[index2][1].start.line !== childEvents[index2][1].end.line
      ) {
        start = index2 + 1;
        breaks.push(start);
        current._tokenizer = void 0;
        current.previous = void 0;
        current = current.next;
      }
    }
    tokenizer.events = [];
    if (current) {
      current._tokenizer = void 0;
      current.previous = void 0;
    } else {
      breaks.pop();
    }
    index2 = breaks.length;
    while (index2--) {
      const slice = childEvents.slice(breaks[index2], breaks[index2 + 1]);
      const start2 = startPositions.pop();
      jumps.unshift([start2, start2 + slice.length - 1]);
      splice(events, start2, 2, slice);
    }
    index2 = -1;
    while (++index2 < jumps.length) {
      gaps[adjust + jumps[index2][0]] = adjust + jumps[index2][1];
      adjust += jumps[index2][1] - jumps[index2][0] - 1;
    }
    return gaps;
  }
  const content$1 = {
    tokenize: tokenizeContent,
    resolve: resolveContent
  };
  const continuationConstruct = {
    tokenize: tokenizeContinuation,
    partial: true
  };
  function resolveContent(events) {
    subtokenize(events);
    return events;
  }
  function tokenizeContent(effects, ok2) {
    let previous2;
    return start;
    function start(code2) {
      effects.enter("content");
      previous2 = effects.enter("chunkContent", {
        contentType: "content"
      });
      return data(code2);
    }
    function data(code2) {
      if (code2 === null) {
        return contentEnd(code2);
      }
      if (markdownLineEnding(code2)) {
        return effects.check(
          continuationConstruct,
          contentContinue,
          contentEnd
        )(code2);
      }
      effects.consume(code2);
      return data;
    }
    function contentEnd(code2) {
      effects.exit("chunkContent");
      effects.exit("content");
      return ok2(code2);
    }
    function contentContinue(code2) {
      effects.consume(code2);
      effects.exit("chunkContent");
      previous2.next = effects.enter("chunkContent", {
        contentType: "content",
        previous: previous2
      });
      previous2 = previous2.next;
      return data;
    }
  }
  function tokenizeContinuation(effects, ok2, nok) {
    const self2 = this;
    return startLookahead;
    function startLookahead(code2) {
      effects.exit("chunkContent");
      effects.enter("lineEnding");
      effects.consume(code2);
      effects.exit("lineEnding");
      return factorySpace(effects, prefixed, "linePrefix");
    }
    function prefixed(code2) {
      if (code2 === null || markdownLineEnding(code2)) {
        return nok(code2);
      }
      const tail = self2.events[self2.events.length - 1];
      if (!self2.parser.constructs.disable.null.includes("codeIndented") && tail && tail[1].type === "linePrefix" && tail[2].sliceSerialize(tail[1], true).length >= 4) {
        return ok2(code2);
      }
      return effects.interrupt(self2.parser.constructs.flow, nok, ok2)(code2);
    }
  }
  function factoryDestination(effects, ok2, nok, type, literalType, literalMarkerType, rawType, stringType, max) {
    const limit = max || Number.POSITIVE_INFINITY;
    let balance = 0;
    return start;
    function start(code2) {
      if (code2 === 60) {
        effects.enter(type);
        effects.enter(literalType);
        effects.enter(literalMarkerType);
        effects.consume(code2);
        effects.exit(literalMarkerType);
        return destinationEnclosedBefore;
      }
      if (code2 === null || code2 === 41 || asciiControl(code2)) {
        return nok(code2);
      }
      effects.enter(type);
      effects.enter(rawType);
      effects.enter(stringType);
      effects.enter("chunkString", {
        contentType: "string"
      });
      return destinationRaw(code2);
    }
    function destinationEnclosedBefore(code2) {
      if (code2 === 62) {
        effects.enter(literalMarkerType);
        effects.consume(code2);
        effects.exit(literalMarkerType);
        effects.exit(literalType);
        effects.exit(type);
        return ok2;
      }
      effects.enter(stringType);
      effects.enter("chunkString", {
        contentType: "string"
      });
      return destinationEnclosed(code2);
    }
    function destinationEnclosed(code2) {
      if (code2 === 62) {
        effects.exit("chunkString");
        effects.exit(stringType);
        return destinationEnclosedBefore(code2);
      }
      if (code2 === null || code2 === 60 || markdownLineEnding(code2)) {
        return nok(code2);
      }
      effects.consume(code2);
      return code2 === 92 ? destinationEnclosedEscape : destinationEnclosed;
    }
    function destinationEnclosedEscape(code2) {
      if (code2 === 60 || code2 === 62 || code2 === 92) {
        effects.consume(code2);
        return destinationEnclosed;
      }
      return destinationEnclosed(code2);
    }
    function destinationRaw(code2) {
      if (code2 === 40) {
        if (++balance > limit)
          return nok(code2);
        effects.consume(code2);
        return destinationRaw;
      }
      if (code2 === 41) {
        if (!balance--) {
          effects.exit("chunkString");
          effects.exit(stringType);
          effects.exit(rawType);
          effects.exit(type);
          return ok2(code2);
        }
        effects.consume(code2);
        return destinationRaw;
      }
      if (code2 === null || markdownLineEndingOrSpace(code2)) {
        if (balance)
          return nok(code2);
        effects.exit("chunkString");
        effects.exit(stringType);
        effects.exit(rawType);
        effects.exit(type);
        return ok2(code2);
      }
      if (asciiControl(code2))
        return nok(code2);
      effects.consume(code2);
      return code2 === 92 ? destinationRawEscape : destinationRaw;
    }
    function destinationRawEscape(code2) {
      if (code2 === 40 || code2 === 41 || code2 === 92) {
        effects.consume(code2);
        return destinationRaw;
      }
      return destinationRaw(code2);
    }
  }
  function factoryLabel(effects, ok2, nok, type, markerType, stringType) {
    const self2 = this;
    let size = 0;
    let data;
    return start;
    function start(code2) {
      effects.enter(type);
      effects.enter(markerType);
      effects.consume(code2);
      effects.exit(markerType);
      effects.enter(stringType);
      return atBreak;
    }
    function atBreak(code2) {
      if (code2 === null || code2 === 91 || code2 === 93 && !data || /* To do: remove in the future once we’ve switched from
       * `micromark-extension-footnote` to `micromark-extension-gfm-footnote`,
       * which doesn’t need this */
      /* Hidden footnotes hook */
      /* c8 ignore next 3 */
      code2 === 94 && !size && "_hiddenFootnoteSupport" in self2.parser.constructs || size > 999) {
        return nok(code2);
      }
      if (code2 === 93) {
        effects.exit(stringType);
        effects.enter(markerType);
        effects.consume(code2);
        effects.exit(markerType);
        effects.exit(type);
        return ok2;
      }
      if (markdownLineEnding(code2)) {
        effects.enter("lineEnding");
        effects.consume(code2);
        effects.exit("lineEnding");
        return atBreak;
      }
      effects.enter("chunkString", {
        contentType: "string"
      });
      return label(code2);
    }
    function label(code2) {
      if (code2 === null || code2 === 91 || code2 === 93 || markdownLineEnding(code2) || size++ > 999) {
        effects.exit("chunkString");
        return atBreak(code2);
      }
      effects.consume(code2);
      data = data || !markdownSpace(code2);
      return code2 === 92 ? labelEscape : label;
    }
    function labelEscape(code2) {
      if (code2 === 91 || code2 === 92 || code2 === 93) {
        effects.consume(code2);
        size++;
        return label;
      }
      return label(code2);
    }
  }
  function factoryTitle(effects, ok2, nok, type, markerType, stringType) {
    let marker;
    return start;
    function start(code2) {
      effects.enter(type);
      effects.enter(markerType);
      effects.consume(code2);
      effects.exit(markerType);
      marker = code2 === 40 ? 41 : code2;
      return atFirstTitleBreak;
    }
    function atFirstTitleBreak(code2) {
      if (code2 === marker) {
        effects.enter(markerType);
        effects.consume(code2);
        effects.exit(markerType);
        effects.exit(type);
        return ok2;
      }
      effects.enter(stringType);
      return atTitleBreak(code2);
    }
    function atTitleBreak(code2) {
      if (code2 === marker) {
        effects.exit(stringType);
        return atFirstTitleBreak(marker);
      }
      if (code2 === null) {
        return nok(code2);
      }
      if (markdownLineEnding(code2)) {
        effects.enter("lineEnding");
        effects.consume(code2);
        effects.exit("lineEnding");
        return factorySpace(effects, atTitleBreak, "linePrefix");
      }
      effects.enter("chunkString", {
        contentType: "string"
      });
      return title(code2);
    }
    function title(code2) {
      if (code2 === marker || code2 === null || markdownLineEnding(code2)) {
        effects.exit("chunkString");
        return atTitleBreak(code2);
      }
      effects.consume(code2);
      return code2 === 92 ? titleEscape : title;
    }
    function titleEscape(code2) {
      if (code2 === marker || code2 === 92) {
        effects.consume(code2);
        return title;
      }
      return title(code2);
    }
  }
  function factoryWhitespace(effects, ok2) {
    let seen;
    return start;
    function start(code2) {
      if (markdownLineEnding(code2)) {
        effects.enter("lineEnding");
        effects.consume(code2);
        effects.exit("lineEnding");
        seen = true;
        return start;
      }
      if (markdownSpace(code2)) {
        return factorySpace(
          effects,
          start,
          seen ? "linePrefix" : "lineSuffix"
        )(code2);
      }
      return ok2(code2);
    }
  }
  function normalizeIdentifier(value2) {
    return value2.replace(/[\t\n\r ]+/g, " ").replace(/^ | $/g, "").toLowerCase().toUpperCase();
  }
  const definition$1 = {
    name: "definition",
    tokenize: tokenizeDefinition
  };
  const titleConstruct = {
    tokenize: tokenizeTitle,
    partial: true
  };
  function tokenizeDefinition(effects, ok2, nok) {
    const self2 = this;
    let identifier;
    return start;
    function start(code2) {
      effects.enter("definition");
      return factoryLabel.call(
        self2,
        effects,
        labelAfter,
        nok,
        "definitionLabel",
        "definitionLabelMarker",
        "definitionLabelString"
      )(code2);
    }
    function labelAfter(code2) {
      identifier = normalizeIdentifier(
        self2.sliceSerialize(self2.events[self2.events.length - 1][1]).slice(1, -1)
      );
      if (code2 === 58) {
        effects.enter("definitionMarker");
        effects.consume(code2);
        effects.exit("definitionMarker");
        return factoryWhitespace(
          effects,
          factoryDestination(
            effects,
            effects.attempt(
              titleConstruct,
              factorySpace(effects, after, "whitespace"),
              factorySpace(effects, after, "whitespace")
            ),
            nok,
            "definitionDestination",
            "definitionDestinationLiteral",
            "definitionDestinationLiteralMarker",
            "definitionDestinationRaw",
            "definitionDestinationString"
          )
        );
      }
      return nok(code2);
    }
    function after(code2) {
      if (code2 === null || markdownLineEnding(code2)) {
        effects.exit("definition");
        if (!self2.parser.defined.includes(identifier)) {
          self2.parser.defined.push(identifier);
        }
        return ok2(code2);
      }
      return nok(code2);
    }
  }
  function tokenizeTitle(effects, ok2, nok) {
    return start;
    function start(code2) {
      return markdownLineEndingOrSpace(code2) ? factoryWhitespace(effects, before)(code2) : nok(code2);
    }
    function before(code2) {
      if (code2 === 34 || code2 === 39 || code2 === 40) {
        return factoryTitle(
          effects,
          factorySpace(effects, after, "whitespace"),
          nok,
          "definitionTitle",
          "definitionTitleMarker",
          "definitionTitleString"
        )(code2);
      }
      return nok(code2);
    }
    function after(code2) {
      return code2 === null || markdownLineEnding(code2) ? ok2(code2) : nok(code2);
    }
  }
  const hardBreakEscape = {
    name: "hardBreakEscape",
    tokenize: tokenizeHardBreakEscape
  };
  function tokenizeHardBreakEscape(effects, ok2, nok) {
    return start;
    function start(code2) {
      effects.enter("hardBreakEscape");
      effects.enter("escapeMarker");
      effects.consume(code2);
      return open;
    }
    function open(code2) {
      if (markdownLineEnding(code2)) {
        effects.exit("escapeMarker");
        effects.exit("hardBreakEscape");
        return ok2(code2);
      }
      return nok(code2);
    }
  }
  const headingAtx = {
    name: "headingAtx",
    tokenize: tokenizeHeadingAtx,
    resolve: resolveHeadingAtx
  };
  function resolveHeadingAtx(events, context) {
    let contentEnd = events.length - 2;
    let contentStart = 3;
    let content2;
    let text2;
    if (events[contentStart][1].type === "whitespace") {
      contentStart += 2;
    }
    if (contentEnd - 2 > contentStart && events[contentEnd][1].type === "whitespace") {
      contentEnd -= 2;
    }
    if (events[contentEnd][1].type === "atxHeadingSequence" && (contentStart === contentEnd - 1 || contentEnd - 4 > contentStart && events[contentEnd - 2][1].type === "whitespace")) {
      contentEnd -= contentStart + 1 === contentEnd ? 2 : 4;
    }
    if (contentEnd > contentStart) {
      content2 = {
        type: "atxHeadingText",
        start: events[contentStart][1].start,
        end: events[contentEnd][1].end
      };
      text2 = {
        type: "chunkText",
        start: events[contentStart][1].start,
        end: events[contentEnd][1].end,
        // @ts-expect-error Constants are fine to assign.
        contentType: "text"
      };
      splice(events, contentStart, contentEnd - contentStart + 1, [
        ["enter", content2, context],
        ["enter", text2, context],
        ["exit", text2, context],
        ["exit", content2, context]
      ]);
    }
    return events;
  }
  function tokenizeHeadingAtx(effects, ok2, nok) {
    const self2 = this;
    let size = 0;
    return start;
    function start(code2) {
      effects.enter("atxHeading");
      effects.enter("atxHeadingSequence");
      return fenceOpenInside(code2);
    }
    function fenceOpenInside(code2) {
      if (code2 === 35 && size++ < 6) {
        effects.consume(code2);
        return fenceOpenInside;
      }
      if (code2 === null || markdownLineEndingOrSpace(code2)) {
        effects.exit("atxHeadingSequence");
        return self2.interrupt ? ok2(code2) : headingBreak(code2);
      }
      return nok(code2);
    }
    function headingBreak(code2) {
      if (code2 === 35) {
        effects.enter("atxHeadingSequence");
        return sequence(code2);
      }
      if (code2 === null || markdownLineEnding(code2)) {
        effects.exit("atxHeading");
        return ok2(code2);
      }
      if (markdownSpace(code2)) {
        return factorySpace(effects, headingBreak, "whitespace")(code2);
      }
      effects.enter("atxHeadingText");
      return data(code2);
    }
    function sequence(code2) {
      if (code2 === 35) {
        effects.consume(code2);
        return sequence;
      }
      effects.exit("atxHeadingSequence");
      return headingBreak(code2);
    }
    function data(code2) {
      if (code2 === null || code2 === 35 || markdownLineEndingOrSpace(code2)) {
        effects.exit("atxHeadingText");
        return headingBreak(code2);
      }
      effects.consume(code2);
      return data;
    }
  }
  const htmlBlockNames = [
    "address",
    "article",
    "aside",
    "base",
    "basefont",
    "blockquote",
    "body",
    "caption",
    "center",
    "col",
    "colgroup",
    "dd",
    "details",
    "dialog",
    "dir",
    "div",
    "dl",
    "dt",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "frame",
    "frameset",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "head",
    "header",
    "hr",
    "html",
    "iframe",
    "legend",
    "li",
    "link",
    "main",
    "menu",
    "menuitem",
    "nav",
    "noframes",
    "ol",
    "optgroup",
    "option",
    "p",
    "param",
    "section",
    "summary",
    "table",
    "tbody",
    "td",
    "tfoot",
    "th",
    "thead",
    "title",
    "tr",
    "track",
    "ul"
  ];
  const htmlRawNames = ["pre", "script", "style", "textarea"];
  const htmlFlow = {
    name: "htmlFlow",
    tokenize: tokenizeHtmlFlow,
    resolveTo: resolveToHtmlFlow,
    concrete: true
  };
  const nextBlankConstruct = {
    tokenize: tokenizeNextBlank,
    partial: true
  };
  function resolveToHtmlFlow(events) {
    let index2 = events.length;
    while (index2--) {
      if (events[index2][0] === "enter" && events[index2][1].type === "htmlFlow") {
        break;
      }
    }
    if (index2 > 1 && events[index2 - 2][1].type === "linePrefix") {
      events[index2][1].start = events[index2 - 2][1].start;
      events[index2 + 1][1].start = events[index2 - 2][1].start;
      events.splice(index2 - 2, 2);
    }
    return events;
  }
  function tokenizeHtmlFlow(effects, ok2, nok) {
    const self2 = this;
    let kind;
    let startTag;
    let buffer;
    let index2;
    let marker;
    return start;
    function start(code2) {
      effects.enter("htmlFlow");
      effects.enter("htmlFlowData");
      effects.consume(code2);
      return open;
    }
    function open(code2) {
      if (code2 === 33) {
        effects.consume(code2);
        return declarationStart;
      }
      if (code2 === 47) {
        effects.consume(code2);
        return tagCloseStart;
      }
      if (code2 === 63) {
        effects.consume(code2);
        kind = 3;
        return self2.interrupt ? ok2 : continuationDeclarationInside;
      }
      if (asciiAlpha(code2)) {
        effects.consume(code2);
        buffer = String.fromCharCode(code2);
        startTag = true;
        return tagName;
      }
      return nok(code2);
    }
    function declarationStart(code2) {
      if (code2 === 45) {
        effects.consume(code2);
        kind = 2;
        return commentOpenInside;
      }
      if (code2 === 91) {
        effects.consume(code2);
        kind = 5;
        buffer = "CDATA[";
        index2 = 0;
        return cdataOpenInside;
      }
      if (asciiAlpha(code2)) {
        effects.consume(code2);
        kind = 4;
        return self2.interrupt ? ok2 : continuationDeclarationInside;
      }
      return nok(code2);
    }
    function commentOpenInside(code2) {
      if (code2 === 45) {
        effects.consume(code2);
        return self2.interrupt ? ok2 : continuationDeclarationInside;
      }
      return nok(code2);
    }
    function cdataOpenInside(code2) {
      if (code2 === buffer.charCodeAt(index2++)) {
        effects.consume(code2);
        return index2 === buffer.length ? self2.interrupt ? ok2 : continuation : cdataOpenInside;
      }
      return nok(code2);
    }
    function tagCloseStart(code2) {
      if (asciiAlpha(code2)) {
        effects.consume(code2);
        buffer = String.fromCharCode(code2);
        return tagName;
      }
      return nok(code2);
    }
    function tagName(code2) {
      if (code2 === null || code2 === 47 || code2 === 62 || markdownLineEndingOrSpace(code2)) {
        if (code2 !== 47 && startTag && htmlRawNames.includes(buffer.toLowerCase())) {
          kind = 1;
          return self2.interrupt ? ok2(code2) : continuation(code2);
        }
        if (htmlBlockNames.includes(buffer.toLowerCase())) {
          kind = 6;
          if (code2 === 47) {
            effects.consume(code2);
            return basicSelfClosing;
          }
          return self2.interrupt ? ok2(code2) : continuation(code2);
        }
        kind = 7;
        return self2.interrupt && !self2.parser.lazy[self2.now().line] ? nok(code2) : startTag ? completeAttributeNameBefore(code2) : completeClosingTagAfter(code2);
      }
      if (code2 === 45 || asciiAlphanumeric(code2)) {
        effects.consume(code2);
        buffer += String.fromCharCode(code2);
        return tagName;
      }
      return nok(code2);
    }
    function basicSelfClosing(code2) {
      if (code2 === 62) {
        effects.consume(code2);
        return self2.interrupt ? ok2 : continuation;
      }
      return nok(code2);
    }
    function completeClosingTagAfter(code2) {
      if (markdownSpace(code2)) {
        effects.consume(code2);
        return completeClosingTagAfter;
      }
      return completeEnd(code2);
    }
    function completeAttributeNameBefore(code2) {
      if (code2 === 47) {
        effects.consume(code2);
        return completeEnd;
      }
      if (code2 === 58 || code2 === 95 || asciiAlpha(code2)) {
        effects.consume(code2);
        return completeAttributeName;
      }
      if (markdownSpace(code2)) {
        effects.consume(code2);
        return completeAttributeNameBefore;
      }
      return completeEnd(code2);
    }
    function completeAttributeName(code2) {
      if (code2 === 45 || code2 === 46 || code2 === 58 || code2 === 95 || asciiAlphanumeric(code2)) {
        effects.consume(code2);
        return completeAttributeName;
      }
      return completeAttributeNameAfter(code2);
    }
    function completeAttributeNameAfter(code2) {
      if (code2 === 61) {
        effects.consume(code2);
        return completeAttributeValueBefore;
      }
      if (markdownSpace(code2)) {
        effects.consume(code2);
        return completeAttributeNameAfter;
      }
      return completeAttributeNameBefore(code2);
    }
    function completeAttributeValueBefore(code2) {
      if (code2 === null || code2 === 60 || code2 === 61 || code2 === 62 || code2 === 96) {
        return nok(code2);
      }
      if (code2 === 34 || code2 === 39) {
        effects.consume(code2);
        marker = code2;
        return completeAttributeValueQuoted;
      }
      if (markdownSpace(code2)) {
        effects.consume(code2);
        return completeAttributeValueBefore;
      }
      marker = null;
      return completeAttributeValueUnquoted(code2);
    }
    function completeAttributeValueQuoted(code2) {
      if (code2 === null || markdownLineEnding(code2)) {
        return nok(code2);
      }
      if (code2 === marker) {
        effects.consume(code2);
        return completeAttributeValueQuotedAfter;
      }
      effects.consume(code2);
      return completeAttributeValueQuoted;
    }
    function completeAttributeValueUnquoted(code2) {
      if (code2 === null || code2 === 34 || code2 === 39 || code2 === 60 || code2 === 61 || code2 === 62 || code2 === 96 || markdownLineEndingOrSpace(code2)) {
        return completeAttributeNameAfter(code2);
      }
      effects.consume(code2);
      return completeAttributeValueUnquoted;
    }
    function completeAttributeValueQuotedAfter(code2) {
      if (code2 === 47 || code2 === 62 || markdownSpace(code2)) {
        return completeAttributeNameBefore(code2);
      }
      return nok(code2);
    }
    function completeEnd(code2) {
      if (code2 === 62) {
        effects.consume(code2);
        return completeAfter;
      }
      return nok(code2);
    }
    function completeAfter(code2) {
      if (markdownSpace(code2)) {
        effects.consume(code2);
        return completeAfter;
      }
      return code2 === null || markdownLineEnding(code2) ? continuation(code2) : nok(code2);
    }
    function continuation(code2) {
      if (code2 === 45 && kind === 2) {
        effects.consume(code2);
        return continuationCommentInside;
      }
      if (code2 === 60 && kind === 1) {
        effects.consume(code2);
        return continuationRawTagOpen;
      }
      if (code2 === 62 && kind === 4) {
        effects.consume(code2);
        return continuationClose;
      }
      if (code2 === 63 && kind === 3) {
        effects.consume(code2);
        return continuationDeclarationInside;
      }
      if (code2 === 93 && kind === 5) {
        effects.consume(code2);
        return continuationCharacterDataInside;
      }
      if (markdownLineEnding(code2) && (kind === 6 || kind === 7)) {
        return effects.check(
          nextBlankConstruct,
          continuationClose,
          continuationAtLineEnding
        )(code2);
      }
      if (code2 === null || markdownLineEnding(code2)) {
        return continuationAtLineEnding(code2);
      }
      effects.consume(code2);
      return continuation;
    }
    function continuationAtLineEnding(code2) {
      effects.exit("htmlFlowData");
      return htmlContinueStart(code2);
    }
    function htmlContinueStart(code2) {
      if (code2 === null) {
        return done(code2);
      }
      if (markdownLineEnding(code2)) {
        return effects.attempt(
          {
            tokenize: htmlLineEnd,
            partial: true
          },
          htmlContinueStart,
          done
        )(code2);
      }
      effects.enter("htmlFlowData");
      return continuation(code2);
    }
    function htmlLineEnd(effects2, ok3, nok2) {
      return start2;
      function start2(code2) {
        effects2.enter("lineEnding");
        effects2.consume(code2);
        effects2.exit("lineEnding");
        return lineStart;
      }
      function lineStart(code2) {
        return self2.parser.lazy[self2.now().line] ? nok2(code2) : ok3(code2);
      }
    }
    function continuationCommentInside(code2) {
      if (code2 === 45) {
        effects.consume(code2);
        return continuationDeclarationInside;
      }
      return continuation(code2);
    }
    function continuationRawTagOpen(code2) {
      if (code2 === 47) {
        effects.consume(code2);
        buffer = "";
        return continuationRawEndTag;
      }
      return continuation(code2);
    }
    function continuationRawEndTag(code2) {
      if (code2 === 62 && htmlRawNames.includes(buffer.toLowerCase())) {
        effects.consume(code2);
        return continuationClose;
      }
      if (asciiAlpha(code2) && buffer.length < 8) {
        effects.consume(code2);
        buffer += String.fromCharCode(code2);
        return continuationRawEndTag;
      }
      return continuation(code2);
    }
    function continuationCharacterDataInside(code2) {
      if (code2 === 93) {
        effects.consume(code2);
        return continuationDeclarationInside;
      }
      return continuation(code2);
    }
    function continuationDeclarationInside(code2) {
      if (code2 === 62) {
        effects.consume(code2);
        return continuationClose;
      }
      if (code2 === 45 && kind === 2) {
        effects.consume(code2);
        return continuationDeclarationInside;
      }
      return continuation(code2);
    }
    function continuationClose(code2) {
      if (code2 === null || markdownLineEnding(code2)) {
        effects.exit("htmlFlowData");
        return done(code2);
      }
      effects.consume(code2);
      return continuationClose;
    }
    function done(code2) {
      effects.exit("htmlFlow");
      return ok2(code2);
    }
  }
  function tokenizeNextBlank(effects, ok2, nok) {
    return start;
    function start(code2) {
      effects.exit("htmlFlowData");
      effects.enter("lineEndingBlank");
      effects.consume(code2);
      effects.exit("lineEndingBlank");
      return effects.attempt(blankLine, ok2, nok);
    }
  }
  const htmlText = {
    name: "htmlText",
    tokenize: tokenizeHtmlText
  };
  function tokenizeHtmlText(effects, ok2, nok) {
    const self2 = this;
    let marker;
    let buffer;
    let index2;
    let returnState;
    return start;
    function start(code2) {
      effects.enter("htmlText");
      effects.enter("htmlTextData");
      effects.consume(code2);
      return open;
    }
    function open(code2) {
      if (code2 === 33) {
        effects.consume(code2);
        return declarationOpen;
      }
      if (code2 === 47) {
        effects.consume(code2);
        return tagCloseStart;
      }
      if (code2 === 63) {
        effects.consume(code2);
        return instruction;
      }
      if (asciiAlpha(code2)) {
        effects.consume(code2);
        return tagOpen;
      }
      return nok(code2);
    }
    function declarationOpen(code2) {
      if (code2 === 45) {
        effects.consume(code2);
        return commentOpen;
      }
      if (code2 === 91) {
        effects.consume(code2);
        buffer = "CDATA[";
        index2 = 0;
        return cdataOpen;
      }
      if (asciiAlpha(code2)) {
        effects.consume(code2);
        return declaration;
      }
      return nok(code2);
    }
    function commentOpen(code2) {
      if (code2 === 45) {
        effects.consume(code2);
        return commentStart;
      }
      return nok(code2);
    }
    function commentStart(code2) {
      if (code2 === null || code2 === 62) {
        return nok(code2);
      }
      if (code2 === 45) {
        effects.consume(code2);
        return commentStartDash;
      }
      return comment2(code2);
    }
    function commentStartDash(code2) {
      if (code2 === null || code2 === 62) {
        return nok(code2);
      }
      return comment2(code2);
    }
    function comment2(code2) {
      if (code2 === null) {
        return nok(code2);
      }
      if (code2 === 45) {
        effects.consume(code2);
        return commentClose;
      }
      if (markdownLineEnding(code2)) {
        returnState = comment2;
        return atLineEnding(code2);
      }
      effects.consume(code2);
      return comment2;
    }
    function commentClose(code2) {
      if (code2 === 45) {
        effects.consume(code2);
        return end;
      }
      return comment2(code2);
    }
    function cdataOpen(code2) {
      if (code2 === buffer.charCodeAt(index2++)) {
        effects.consume(code2);
        return index2 === buffer.length ? cdata : cdataOpen;
      }
      return nok(code2);
    }
    function cdata(code2) {
      if (code2 === null) {
        return nok(code2);
      }
      if (code2 === 93) {
        effects.consume(code2);
        return cdataClose;
      }
      if (markdownLineEnding(code2)) {
        returnState = cdata;
        return atLineEnding(code2);
      }
      effects.consume(code2);
      return cdata;
    }
    function cdataClose(code2) {
      if (code2 === 93) {
        effects.consume(code2);
        return cdataEnd;
      }
      return cdata(code2);
    }
    function cdataEnd(code2) {
      if (code2 === 62) {
        return end(code2);
      }
      if (code2 === 93) {
        effects.consume(code2);
        return cdataEnd;
      }
      return cdata(code2);
    }
    function declaration(code2) {
      if (code2 === null || code2 === 62) {
        return end(code2);
      }
      if (markdownLineEnding(code2)) {
        returnState = declaration;
        return atLineEnding(code2);
      }
      effects.consume(code2);
      return declaration;
    }
    function instruction(code2) {
      if (code2 === null) {
        return nok(code2);
      }
      if (code2 === 63) {
        effects.consume(code2);
        return instructionClose;
      }
      if (markdownLineEnding(code2)) {
        returnState = instruction;
        return atLineEnding(code2);
      }
      effects.consume(code2);
      return instruction;
    }
    function instructionClose(code2) {
      return code2 === 62 ? end(code2) : instruction(code2);
    }
    function tagCloseStart(code2) {
      if (asciiAlpha(code2)) {
        effects.consume(code2);
        return tagClose;
      }
      return nok(code2);
    }
    function tagClose(code2) {
      if (code2 === 45 || asciiAlphanumeric(code2)) {
        effects.consume(code2);
        return tagClose;
      }
      return tagCloseBetween(code2);
    }
    function tagCloseBetween(code2) {
      if (markdownLineEnding(code2)) {
        returnState = tagCloseBetween;
        return atLineEnding(code2);
      }
      if (markdownSpace(code2)) {
        effects.consume(code2);
        return tagCloseBetween;
      }
      return end(code2);
    }
    function tagOpen(code2) {
      if (code2 === 45 || asciiAlphanumeric(code2)) {
        effects.consume(code2);
        return tagOpen;
      }
      if (code2 === 47 || code2 === 62 || markdownLineEndingOrSpace(code2)) {
        return tagOpenBetween(code2);
      }
      return nok(code2);
    }
    function tagOpenBetween(code2) {
      if (code2 === 47) {
        effects.consume(code2);
        return end;
      }
      if (code2 === 58 || code2 === 95 || asciiAlpha(code2)) {
        effects.consume(code2);
        return tagOpenAttributeName;
      }
      if (markdownLineEnding(code2)) {
        returnState = tagOpenBetween;
        return atLineEnding(code2);
      }
      if (markdownSpace(code2)) {
        effects.consume(code2);
        return tagOpenBetween;
      }
      return end(code2);
    }
    function tagOpenAttributeName(code2) {
      if (code2 === 45 || code2 === 46 || code2 === 58 || code2 === 95 || asciiAlphanumeric(code2)) {
        effects.consume(code2);
        return tagOpenAttributeName;
      }
      return tagOpenAttributeNameAfter(code2);
    }
    function tagOpenAttributeNameAfter(code2) {
      if (code2 === 61) {
        effects.consume(code2);
        return tagOpenAttributeValueBefore;
      }
      if (markdownLineEnding(code2)) {
        returnState = tagOpenAttributeNameAfter;
        return atLineEnding(code2);
      }
      if (markdownSpace(code2)) {
        effects.consume(code2);
        return tagOpenAttributeNameAfter;
      }
      return tagOpenBetween(code2);
    }
    function tagOpenAttributeValueBefore(code2) {
      if (code2 === null || code2 === 60 || code2 === 61 || code2 === 62 || code2 === 96) {
        return nok(code2);
      }
      if (code2 === 34 || code2 === 39) {
        effects.consume(code2);
        marker = code2;
        return tagOpenAttributeValueQuoted;
      }
      if (markdownLineEnding(code2)) {
        returnState = tagOpenAttributeValueBefore;
        return atLineEnding(code2);
      }
      if (markdownSpace(code2)) {
        effects.consume(code2);
        return tagOpenAttributeValueBefore;
      }
      effects.consume(code2);
      marker = void 0;
      return tagOpenAttributeValueUnquoted;
    }
    function tagOpenAttributeValueQuoted(code2) {
      if (code2 === marker) {
        effects.consume(code2);
        return tagOpenAttributeValueQuotedAfter;
      }
      if (code2 === null) {
        return nok(code2);
      }
      if (markdownLineEnding(code2)) {
        returnState = tagOpenAttributeValueQuoted;
        return atLineEnding(code2);
      }
      effects.consume(code2);
      return tagOpenAttributeValueQuoted;
    }
    function tagOpenAttributeValueQuotedAfter(code2) {
      if (code2 === 62 || code2 === 47 || markdownLineEndingOrSpace(code2)) {
        return tagOpenBetween(code2);
      }
      return nok(code2);
    }
    function tagOpenAttributeValueUnquoted(code2) {
      if (code2 === null || code2 === 34 || code2 === 39 || code2 === 60 || code2 === 61 || code2 === 96) {
        return nok(code2);
      }
      if (code2 === 62 || markdownLineEndingOrSpace(code2)) {
        return tagOpenBetween(code2);
      }
      effects.consume(code2);
      return tagOpenAttributeValueUnquoted;
    }
    function atLineEnding(code2) {
      effects.exit("htmlTextData");
      effects.enter("lineEnding");
      effects.consume(code2);
      effects.exit("lineEnding");
      return factorySpace(
        effects,
        afterPrefix,
        "linePrefix",
        self2.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4
      );
    }
    function afterPrefix(code2) {
      effects.enter("htmlTextData");
      return returnState(code2);
    }
    function end(code2) {
      if (code2 === 62) {
        effects.consume(code2);
        effects.exit("htmlTextData");
        effects.exit("htmlText");
        return ok2;
      }
      return nok(code2);
    }
  }
  const labelEnd = {
    name: "labelEnd",
    tokenize: tokenizeLabelEnd,
    resolveTo: resolveToLabelEnd,
    resolveAll: resolveAllLabelEnd
  };
  const resourceConstruct = {
    tokenize: tokenizeResource
  };
  const fullReferenceConstruct = {
    tokenize: tokenizeFullReference
  };
  const collapsedReferenceConstruct = {
    tokenize: tokenizeCollapsedReference
  };
  function resolveAllLabelEnd(events) {
    let index2 = -1;
    let token;
    while (++index2 < events.length) {
      token = events[index2][1];
      if (token.type === "labelImage" || token.type === "labelLink" || token.type === "labelEnd") {
        events.splice(index2 + 1, token.type === "labelImage" ? 4 : 2);
        token.type = "data";
        index2++;
      }
    }
    return events;
  }
  function resolveToLabelEnd(events, context) {
    let index2 = events.length;
    let offset = 0;
    let token;
    let open;
    let close2;
    let media;
    while (index2--) {
      token = events[index2][1];
      if (open) {
        if (token.type === "link" || token.type === "labelLink" && token._inactive) {
          break;
        }
        if (events[index2][0] === "enter" && token.type === "labelLink") {
          token._inactive = true;
        }
      } else if (close2) {
        if (events[index2][0] === "enter" && (token.type === "labelImage" || token.type === "labelLink") && !token._balanced) {
          open = index2;
          if (token.type !== "labelLink") {
            offset = 2;
            break;
          }
        }
      } else if (token.type === "labelEnd") {
        close2 = index2;
      }
    }
    const group = {
      type: events[open][1].type === "labelLink" ? "link" : "image",
      start: Object.assign({}, events[open][1].start),
      end: Object.assign({}, events[events.length - 1][1].end)
    };
    const label = {
      type: "label",
      start: Object.assign({}, events[open][1].start),
      end: Object.assign({}, events[close2][1].end)
    };
    const text2 = {
      type: "labelText",
      start: Object.assign({}, events[open + offset + 2][1].end),
      end: Object.assign({}, events[close2 - 2][1].start)
    };
    media = [
      ["enter", group, context],
      ["enter", label, context]
    ];
    media = push(media, events.slice(open + 1, open + offset + 3));
    media = push(media, [["enter", text2, context]]);
    media = push(
      media,
      resolveAll(
        context.parser.constructs.insideSpan.null,
        events.slice(open + offset + 4, close2 - 3),
        context
      )
    );
    media = push(media, [
      ["exit", text2, context],
      events[close2 - 2],
      events[close2 - 1],
      ["exit", label, context]
    ]);
    media = push(media, events.slice(close2 + 1));
    media = push(media, [["exit", group, context]]);
    splice(events, open, events.length, media);
    return events;
  }
  function tokenizeLabelEnd(effects, ok2, nok) {
    const self2 = this;
    let index2 = self2.events.length;
    let labelStart;
    let defined;
    while (index2--) {
      if ((self2.events[index2][1].type === "labelImage" || self2.events[index2][1].type === "labelLink") && !self2.events[index2][1]._balanced) {
        labelStart = self2.events[index2][1];
        break;
      }
    }
    return start;
    function start(code2) {
      if (!labelStart) {
        return nok(code2);
      }
      if (labelStart._inactive)
        return balanced(code2);
      defined = self2.parser.defined.includes(
        normalizeIdentifier(
          self2.sliceSerialize({
            start: labelStart.end,
            end: self2.now()
          })
        )
      );
      effects.enter("labelEnd");
      effects.enter("labelMarker");
      effects.consume(code2);
      effects.exit("labelMarker");
      effects.exit("labelEnd");
      return afterLabelEnd;
    }
    function afterLabelEnd(code2) {
      if (code2 === 40) {
        return effects.attempt(
          resourceConstruct,
          ok2,
          defined ? ok2 : balanced
        )(code2);
      }
      if (code2 === 91) {
        return effects.attempt(
          fullReferenceConstruct,
          ok2,
          defined ? effects.attempt(collapsedReferenceConstruct, ok2, balanced) : balanced
        )(code2);
      }
      return defined ? ok2(code2) : balanced(code2);
    }
    function balanced(code2) {
      labelStart._balanced = true;
      return nok(code2);
    }
  }
  function tokenizeResource(effects, ok2, nok) {
    return start;
    function start(code2) {
      effects.enter("resource");
      effects.enter("resourceMarker");
      effects.consume(code2);
      effects.exit("resourceMarker");
      return factoryWhitespace(effects, open);
    }
    function open(code2) {
      if (code2 === 41) {
        return end(code2);
      }
      return factoryDestination(
        effects,
        destinationAfter,
        nok,
        "resourceDestination",
        "resourceDestinationLiteral",
        "resourceDestinationLiteralMarker",
        "resourceDestinationRaw",
        "resourceDestinationString",
        32
      )(code2);
    }
    function destinationAfter(code2) {
      return markdownLineEndingOrSpace(code2) ? factoryWhitespace(effects, between2)(code2) : end(code2);
    }
    function between2(code2) {
      if (code2 === 34 || code2 === 39 || code2 === 40) {
        return factoryTitle(
          effects,
          factoryWhitespace(effects, end),
          nok,
          "resourceTitle",
          "resourceTitleMarker",
          "resourceTitleString"
        )(code2);
      }
      return end(code2);
    }
    function end(code2) {
      if (code2 === 41) {
        effects.enter("resourceMarker");
        effects.consume(code2);
        effects.exit("resourceMarker");
        effects.exit("resource");
        return ok2;
      }
      return nok(code2);
    }
  }
  function tokenizeFullReference(effects, ok2, nok) {
    const self2 = this;
    return start;
    function start(code2) {
      return factoryLabel.call(
        self2,
        effects,
        afterLabel,
        nok,
        "reference",
        "referenceMarker",
        "referenceString"
      )(code2);
    }
    function afterLabel(code2) {
      return self2.parser.defined.includes(
        normalizeIdentifier(
          self2.sliceSerialize(self2.events[self2.events.length - 1][1]).slice(1, -1)
        )
      ) ? ok2(code2) : nok(code2);
    }
  }
  function tokenizeCollapsedReference(effects, ok2, nok) {
    return start;
    function start(code2) {
      effects.enter("reference");
      effects.enter("referenceMarker");
      effects.consume(code2);
      effects.exit("referenceMarker");
      return open;
    }
    function open(code2) {
      if (code2 === 93) {
        effects.enter("referenceMarker");
        effects.consume(code2);
        effects.exit("referenceMarker");
        effects.exit("reference");
        return ok2;
      }
      return nok(code2);
    }
  }
  const labelStartImage = {
    name: "labelStartImage",
    tokenize: tokenizeLabelStartImage,
    resolveAll: labelEnd.resolveAll
  };
  function tokenizeLabelStartImage(effects, ok2, nok) {
    const self2 = this;
    return start;
    function start(code2) {
      effects.enter("labelImage");
      effects.enter("labelImageMarker");
      effects.consume(code2);
      effects.exit("labelImageMarker");
      return open;
    }
    function open(code2) {
      if (code2 === 91) {
        effects.enter("labelMarker");
        effects.consume(code2);
        effects.exit("labelMarker");
        effects.exit("labelImage");
        return after;
      }
      return nok(code2);
    }
    function after(code2) {
      return code2 === 94 && "_hiddenFootnoteSupport" in self2.parser.constructs ? nok(code2) : ok2(code2);
    }
  }
  const labelStartLink = {
    name: "labelStartLink",
    tokenize: tokenizeLabelStartLink,
    resolveAll: labelEnd.resolveAll
  };
  function tokenizeLabelStartLink(effects, ok2, nok) {
    const self2 = this;
    return start;
    function start(code2) {
      effects.enter("labelLink");
      effects.enter("labelMarker");
      effects.consume(code2);
      effects.exit("labelMarker");
      effects.exit("labelLink");
      return after;
    }
    function after(code2) {
      return code2 === 94 && "_hiddenFootnoteSupport" in self2.parser.constructs ? nok(code2) : ok2(code2);
    }
  }
  const lineEnding = {
    name: "lineEnding",
    tokenize: tokenizeLineEnding
  };
  function tokenizeLineEnding(effects, ok2) {
    return start;
    function start(code2) {
      effects.enter("lineEnding");
      effects.consume(code2);
      effects.exit("lineEnding");
      return factorySpace(effects, ok2, "linePrefix");
    }
  }
  const thematicBreak$2 = {
    name: "thematicBreak",
    tokenize: tokenizeThematicBreak
  };
  function tokenizeThematicBreak(effects, ok2, nok) {
    let size = 0;
    let marker;
    return start;
    function start(code2) {
      effects.enter("thematicBreak");
      marker = code2;
      return atBreak(code2);
    }
    function atBreak(code2) {
      if (code2 === marker) {
        effects.enter("thematicBreakSequence");
        return sequence(code2);
      }
      if (markdownSpace(code2)) {
        return factorySpace(effects, atBreak, "whitespace")(code2);
      }
      if (size < 3 || code2 !== null && !markdownLineEnding(code2)) {
        return nok(code2);
      }
      effects.exit("thematicBreak");
      return ok2(code2);
    }
    function sequence(code2) {
      if (code2 === marker) {
        effects.consume(code2);
        size++;
        return sequence;
      }
      effects.exit("thematicBreakSequence");
      return atBreak(code2);
    }
  }
  const list$2 = {
    name: "list",
    tokenize: tokenizeListStart,
    continuation: {
      tokenize: tokenizeListContinuation
    },
    exit: tokenizeListEnd
  };
  const listItemPrefixWhitespaceConstruct = {
    tokenize: tokenizeListItemPrefixWhitespace,
    partial: true
  };
  const indentConstruct = {
    tokenize: tokenizeIndent$1,
    partial: true
  };
  function tokenizeListStart(effects, ok2, nok) {
    const self2 = this;
    const tail = self2.events[self2.events.length - 1];
    let initialSize = tail && tail[1].type === "linePrefix" ? tail[2].sliceSerialize(tail[1], true).length : 0;
    let size = 0;
    return start;
    function start(code2) {
      const kind = self2.containerState.type || (code2 === 42 || code2 === 43 || code2 === 45 ? "listUnordered" : "listOrdered");
      if (kind === "listUnordered" ? !self2.containerState.marker || code2 === self2.containerState.marker : asciiDigit(code2)) {
        if (!self2.containerState.type) {
          self2.containerState.type = kind;
          effects.enter(kind, {
            _container: true
          });
        }
        if (kind === "listUnordered") {
          effects.enter("listItemPrefix");
          return code2 === 42 || code2 === 45 ? effects.check(thematicBreak$2, nok, atMarker)(code2) : atMarker(code2);
        }
        if (!self2.interrupt || code2 === 49) {
          effects.enter("listItemPrefix");
          effects.enter("listItemValue");
          return inside(code2);
        }
      }
      return nok(code2);
    }
    function inside(code2) {
      if (asciiDigit(code2) && ++size < 10) {
        effects.consume(code2);
        return inside;
      }
      if ((!self2.interrupt || size < 2) && (self2.containerState.marker ? code2 === self2.containerState.marker : code2 === 41 || code2 === 46)) {
        effects.exit("listItemValue");
        return atMarker(code2);
      }
      return nok(code2);
    }
    function atMarker(code2) {
      effects.enter("listItemMarker");
      effects.consume(code2);
      effects.exit("listItemMarker");
      self2.containerState.marker = self2.containerState.marker || code2;
      return effects.check(
        blankLine,
        // Can’t be empty when interrupting.
        self2.interrupt ? nok : onBlank,
        effects.attempt(
          listItemPrefixWhitespaceConstruct,
          endOfPrefix,
          otherPrefix
        )
      );
    }
    function onBlank(code2) {
      self2.containerState.initialBlankLine = true;
      initialSize++;
      return endOfPrefix(code2);
    }
    function otherPrefix(code2) {
      if (markdownSpace(code2)) {
        effects.enter("listItemPrefixWhitespace");
        effects.consume(code2);
        effects.exit("listItemPrefixWhitespace");
        return endOfPrefix;
      }
      return nok(code2);
    }
    function endOfPrefix(code2) {
      self2.containerState.size = initialSize + self2.sliceSerialize(effects.exit("listItemPrefix"), true).length;
      return ok2(code2);
    }
  }
  function tokenizeListContinuation(effects, ok2, nok) {
    const self2 = this;
    self2.containerState._closeFlow = void 0;
    return effects.check(blankLine, onBlank, notBlank);
    function onBlank(code2) {
      self2.containerState.furtherBlankLines = self2.containerState.furtherBlankLines || self2.containerState.initialBlankLine;
      return factorySpace(
        effects,
        ok2,
        "listItemIndent",
        self2.containerState.size + 1
      )(code2);
    }
    function notBlank(code2) {
      if (self2.containerState.furtherBlankLines || !markdownSpace(code2)) {
        self2.containerState.furtherBlankLines = void 0;
        self2.containerState.initialBlankLine = void 0;
        return notInCurrentItem(code2);
      }
      self2.containerState.furtherBlankLines = void 0;
      self2.containerState.initialBlankLine = void 0;
      return effects.attempt(indentConstruct, ok2, notInCurrentItem)(code2);
    }
    function notInCurrentItem(code2) {
      self2.containerState._closeFlow = true;
      self2.interrupt = void 0;
      return factorySpace(
        effects,
        effects.attempt(list$2, ok2, nok),
        "linePrefix",
        self2.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4
      )(code2);
    }
  }
  function tokenizeIndent$1(effects, ok2, nok) {
    const self2 = this;
    return factorySpace(
      effects,
      afterPrefix,
      "listItemIndent",
      self2.containerState.size + 1
    );
    function afterPrefix(code2) {
      const tail = self2.events[self2.events.length - 1];
      return tail && tail[1].type === "listItemIndent" && tail[2].sliceSerialize(tail[1], true).length === self2.containerState.size ? ok2(code2) : nok(code2);
    }
  }
  function tokenizeListEnd(effects) {
    effects.exit(this.containerState.type);
  }
  function tokenizeListItemPrefixWhitespace(effects, ok2, nok) {
    const self2 = this;
    return factorySpace(
      effects,
      afterPrefix,
      "listItemPrefixWhitespace",
      self2.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4 + 1
    );
    function afterPrefix(code2) {
      const tail = self2.events[self2.events.length - 1];
      return !markdownSpace(code2) && tail && tail[1].type === "listItemPrefixWhitespace" ? ok2(code2) : nok(code2);
    }
  }
  const setextUnderline = {
    name: "setextUnderline",
    tokenize: tokenizeSetextUnderline,
    resolveTo: resolveToSetextUnderline
  };
  function resolveToSetextUnderline(events, context) {
    let index2 = events.length;
    let content2;
    let text2;
    let definition2;
    while (index2--) {
      if (events[index2][0] === "enter") {
        if (events[index2][1].type === "content") {
          content2 = index2;
          break;
        }
        if (events[index2][1].type === "paragraph") {
          text2 = index2;
        }
      } else {
        if (events[index2][1].type === "content") {
          events.splice(index2, 1);
        }
        if (!definition2 && events[index2][1].type === "definition") {
          definition2 = index2;
        }
      }
    }
    const heading2 = {
      type: "setextHeading",
      start: Object.assign({}, events[text2][1].start),
      end: Object.assign({}, events[events.length - 1][1].end)
    };
    events[text2][1].type = "setextHeadingText";
    if (definition2) {
      events.splice(text2, 0, ["enter", heading2, context]);
      events.splice(definition2 + 1, 0, ["exit", events[content2][1], context]);
      events[content2][1].end = Object.assign({}, events[definition2][1].end);
    } else {
      events[content2][1] = heading2;
    }
    events.push(["exit", heading2, context]);
    return events;
  }
  function tokenizeSetextUnderline(effects, ok2, nok) {
    const self2 = this;
    let index2 = self2.events.length;
    let marker;
    let paragraph2;
    while (index2--) {
      if (self2.events[index2][1].type !== "lineEnding" && self2.events[index2][1].type !== "linePrefix" && self2.events[index2][1].type !== "content") {
        paragraph2 = self2.events[index2][1].type === "paragraph";
        break;
      }
    }
    return start;
    function start(code2) {
      if (!self2.parser.lazy[self2.now().line] && (self2.interrupt || paragraph2)) {
        effects.enter("setextHeadingLine");
        effects.enter("setextHeadingLineSequence");
        marker = code2;
        return closingSequence(code2);
      }
      return nok(code2);
    }
    function closingSequence(code2) {
      if (code2 === marker) {
        effects.consume(code2);
        return closingSequence;
      }
      effects.exit("setextHeadingLineSequence");
      return factorySpace(effects, closingSequenceEnd, "lineSuffix")(code2);
    }
    function closingSequenceEnd(code2) {
      if (code2 === null || markdownLineEnding(code2)) {
        effects.exit("setextHeadingLine");
        return ok2(code2);
      }
      return nok(code2);
    }
  }
  const flow$1 = {
    tokenize: initializeFlow
  };
  function initializeFlow(effects) {
    const self2 = this;
    const initial = effects.attempt(
      // Try to parse a blank line.
      blankLine,
      atBlankEnding,
      // Try to parse initial flow (essentially, only code).
      effects.attempt(
        this.parser.constructs.flowInitial,
        afterConstruct,
        factorySpace(
          effects,
          effects.attempt(
            this.parser.constructs.flow,
            afterConstruct,
            effects.attempt(content$1, afterConstruct)
          ),
          "linePrefix"
        )
      )
    );
    return initial;
    function atBlankEnding(code2) {
      if (code2 === null) {
        effects.consume(code2);
        return;
      }
      effects.enter("lineEndingBlank");
      effects.consume(code2);
      effects.exit("lineEndingBlank");
      self2.currentConstruct = void 0;
      return initial;
    }
    function afterConstruct(code2) {
      if (code2 === null) {
        effects.consume(code2);
        return;
      }
      effects.enter("lineEnding");
      effects.consume(code2);
      effects.exit("lineEnding");
      self2.currentConstruct = void 0;
      return initial;
    }
  }
  const resolver = {
    resolveAll: createResolver()
  };
  const string$1 = initializeFactory("string");
  const text$5 = initializeFactory("text");
  function initializeFactory(field) {
    return {
      tokenize: initializeText,
      resolveAll: createResolver(
        field === "text" ? resolveAllLineSuffixes : void 0
      )
    };
    function initializeText(effects) {
      const self2 = this;
      const constructs2 = this.parser.constructs[field];
      const text2 = effects.attempt(constructs2, start, notText);
      return start;
      function start(code2) {
        return atBreak(code2) ? text2(code2) : notText(code2);
      }
      function notText(code2) {
        if (code2 === null) {
          effects.consume(code2);
          return;
        }
        effects.enter("data");
        effects.consume(code2);
        return data;
      }
      function data(code2) {
        if (atBreak(code2)) {
          effects.exit("data");
          return text2(code2);
        }
        effects.consume(code2);
        return data;
      }
      function atBreak(code2) {
        if (code2 === null) {
          return true;
        }
        const list2 = constructs2[code2];
        let index2 = -1;
        if (list2) {
          while (++index2 < list2.length) {
            const item = list2[index2];
            if (!item.previous || item.previous.call(self2, self2.previous)) {
              return true;
            }
          }
        }
        return false;
      }
    }
  }
  function createResolver(extraResolver) {
    return resolveAllText;
    function resolveAllText(events, context) {
      let index2 = -1;
      let enter;
      while (++index2 <= events.length) {
        if (enter === void 0) {
          if (events[index2] && events[index2][1].type === "data") {
            enter = index2;
            index2++;
          }
        } else if (!events[index2] || events[index2][1].type !== "data") {
          if (index2 !== enter + 2) {
            events[enter][1].end = events[index2 - 1][1].end;
            events.splice(enter + 2, index2 - enter - 2);
            index2 = enter + 2;
          }
          enter = void 0;
        }
      }
      return extraResolver ? extraResolver(events, context) : events;
    }
  }
  function resolveAllLineSuffixes(events, context) {
    let eventIndex = 0;
    while (++eventIndex <= events.length) {
      if ((eventIndex === events.length || events[eventIndex][1].type === "lineEnding") && events[eventIndex - 1][1].type === "data") {
        const data = events[eventIndex - 1][1];
        const chunks = context.sliceStream(data);
        let index2 = chunks.length;
        let bufferIndex = -1;
        let size = 0;
        let tabs;
        while (index2--) {
          const chunk = chunks[index2];
          if (typeof chunk === "string") {
            bufferIndex = chunk.length;
            while (chunk.charCodeAt(bufferIndex - 1) === 32) {
              size++;
              bufferIndex--;
            }
            if (bufferIndex)
              break;
            bufferIndex = -1;
          } else if (chunk === -2) {
            tabs = true;
            size++;
          } else if (chunk === -1)
            ;
          else {
            index2++;
            break;
          }
        }
        if (size) {
          const token = {
            type: eventIndex === events.length || tabs || size < 2 ? "lineSuffix" : "hardBreakTrailing",
            start: {
              line: data.end.line,
              column: data.end.column - size,
              offset: data.end.offset - size,
              _index: data.start._index + index2,
              _bufferIndex: index2 ? bufferIndex : data.start._bufferIndex + bufferIndex
            },
            end: Object.assign({}, data.end)
          };
          data.end = Object.assign({}, token.start);
          if (data.start.offset === data.end.offset) {
            Object.assign(data, token);
          } else {
            events.splice(
              eventIndex,
              0,
              ["enter", token, context],
              ["exit", token, context]
            );
            eventIndex += 2;
          }
        }
        eventIndex++;
      }
    }
    return events;
  }
  function createTokenizer(parser, initialize, from) {
    let point2 = Object.assign(
      from ? Object.assign({}, from) : {
        line: 1,
        column: 1,
        offset: 0
      },
      {
        _index: 0,
        _bufferIndex: -1
      }
    );
    const columnStart = {};
    const resolveAllConstructs = [];
    let chunks = [];
    let stack = [];
    const effects = {
      consume,
      enter,
      exit: exit2,
      attempt: constructFactory(onsuccessfulconstruct),
      check: constructFactory(onsuccessfulcheck),
      interrupt: constructFactory(onsuccessfulcheck, {
        interrupt: true
      })
    };
    const context = {
      previous: null,
      code: null,
      containerState: {},
      events: [],
      parser,
      sliceStream,
      sliceSerialize,
      now,
      defineSkip,
      write
    };
    let state = initialize.tokenize.call(context, effects);
    if (initialize.resolveAll) {
      resolveAllConstructs.push(initialize);
    }
    return context;
    function write(slice) {
      chunks = push(chunks, slice);
      main2();
      if (chunks[chunks.length - 1] !== null) {
        return [];
      }
      addResult(initialize, 0);
      context.events = resolveAll(resolveAllConstructs, context.events, context);
      return context.events;
    }
    function sliceSerialize(token, expandTabs) {
      return serializeChunks(sliceStream(token), expandTabs);
    }
    function sliceStream(token) {
      return sliceChunks(chunks, token);
    }
    function now() {
      return Object.assign({}, point2);
    }
    function defineSkip(value2) {
      columnStart[value2.line] = value2.column;
      accountForPotentialSkip();
    }
    function main2() {
      let chunkIndex;
      while (point2._index < chunks.length) {
        const chunk = chunks[point2._index];
        if (typeof chunk === "string") {
          chunkIndex = point2._index;
          if (point2._bufferIndex < 0) {
            point2._bufferIndex = 0;
          }
          while (point2._index === chunkIndex && point2._bufferIndex < chunk.length) {
            go(chunk.charCodeAt(point2._bufferIndex));
          }
        } else {
          go(chunk);
        }
      }
    }
    function go(code2) {
      state = state(code2);
    }
    function consume(code2) {
      if (markdownLineEnding(code2)) {
        point2.line++;
        point2.column = 1;
        point2.offset += code2 === -3 ? 2 : 1;
        accountForPotentialSkip();
      } else if (code2 !== -1) {
        point2.column++;
        point2.offset++;
      }
      if (point2._bufferIndex < 0) {
        point2._index++;
      } else {
        point2._bufferIndex++;
        if (point2._bufferIndex === chunks[point2._index].length) {
          point2._bufferIndex = -1;
          point2._index++;
        }
      }
      context.previous = code2;
    }
    function enter(type, fields) {
      const token = fields || {};
      token.type = type;
      token.start = now();
      context.events.push(["enter", token, context]);
      stack.push(token);
      return token;
    }
    function exit2(type) {
      const token = stack.pop();
      token.end = now();
      context.events.push(["exit", token, context]);
      return token;
    }
    function onsuccessfulconstruct(construct, info) {
      addResult(construct, info.from);
    }
    function onsuccessfulcheck(_2, info) {
      info.restore();
    }
    function constructFactory(onreturn, fields) {
      return hook;
      function hook(constructs2, returnState, bogusState) {
        let listOfConstructs;
        let constructIndex;
        let currentConstruct;
        let info;
        return Array.isArray(constructs2) ? (
          /* c8 ignore next 1 */
          handleListOfConstructs(constructs2)
        ) : "tokenize" in constructs2 ? handleListOfConstructs([constructs2]) : handleMapOfConstructs(constructs2);
        function handleMapOfConstructs(map2) {
          return start;
          function start(code2) {
            const def = code2 !== null && map2[code2];
            const all2 = code2 !== null && map2.null;
            const list2 = [
              // To do: add more extension tests.
              /* c8 ignore next 2 */
              ...Array.isArray(def) ? def : def ? [def] : [],
              ...Array.isArray(all2) ? all2 : all2 ? [all2] : []
            ];
            return handleListOfConstructs(list2)(code2);
          }
        }
        function handleListOfConstructs(list2) {
          listOfConstructs = list2;
          constructIndex = 0;
          if (list2.length === 0) {
            return bogusState;
          }
          return handleConstruct(list2[constructIndex]);
        }
        function handleConstruct(construct) {
          return start;
          function start(code2) {
            info = store();
            currentConstruct = construct;
            if (!construct.partial) {
              context.currentConstruct = construct;
            }
            if (construct.name && context.parser.constructs.disable.null.includes(construct.name)) {
              return nok();
            }
            return construct.tokenize.call(
              // If we do have fields, create an object w/ `context` as its
              // prototype.
              // This allows a “live binding”, which is needed for `interrupt`.
              fields ? Object.assign(Object.create(context), fields) : context,
              effects,
              ok2,
              nok
            )(code2);
          }
        }
        function ok2(code2) {
          onreturn(currentConstruct, info);
          return returnState;
        }
        function nok(code2) {
          info.restore();
          if (++constructIndex < listOfConstructs.length) {
            return handleConstruct(listOfConstructs[constructIndex]);
          }
          return bogusState;
        }
      }
    }
    function addResult(construct, from2) {
      if (construct.resolveAll && !resolveAllConstructs.includes(construct)) {
        resolveAllConstructs.push(construct);
      }
      if (construct.resolve) {
        splice(
          context.events,
          from2,
          context.events.length - from2,
          construct.resolve(context.events.slice(from2), context)
        );
      }
      if (construct.resolveTo) {
        context.events = construct.resolveTo(context.events, context);
      }
    }
    function store() {
      const startPoint = now();
      const startPrevious = context.previous;
      const startCurrentConstruct = context.currentConstruct;
      const startEventsIndex = context.events.length;
      const startStack = Array.from(stack);
      return {
        restore,
        from: startEventsIndex
      };
      function restore() {
        point2 = startPoint;
        context.previous = startPrevious;
        context.currentConstruct = startCurrentConstruct;
        context.events.length = startEventsIndex;
        stack = startStack;
        accountForPotentialSkip();
      }
    }
    function accountForPotentialSkip() {
      if (point2.line in columnStart && point2.column < 2) {
        point2.column = columnStart[point2.line];
        point2.offset += columnStart[point2.line] - 1;
      }
    }
  }
  function sliceChunks(chunks, token) {
    const startIndex = token.start._index;
    const startBufferIndex = token.start._bufferIndex;
    const endIndex = token.end._index;
    const endBufferIndex = token.end._bufferIndex;
    let view;
    if (startIndex === endIndex) {
      view = [chunks[startIndex].slice(startBufferIndex, endBufferIndex)];
    } else {
      view = chunks.slice(startIndex, endIndex);
      if (startBufferIndex > -1) {
        view[0] = view[0].slice(startBufferIndex);
      }
      if (endBufferIndex > 0) {
        view.push(chunks[endIndex].slice(0, endBufferIndex));
      }
    }
    return view;
  }
  function serializeChunks(chunks, expandTabs) {
    let index2 = -1;
    const result = [];
    let atTab;
    while (++index2 < chunks.length) {
      const chunk = chunks[index2];
      let value2;
      if (typeof chunk === "string") {
        value2 = chunk;
      } else
        switch (chunk) {
          case -5: {
            value2 = "\r";
            break;
          }
          case -4: {
            value2 = "\n";
            break;
          }
          case -3: {
            value2 = "\r\n";
            break;
          }
          case -2: {
            value2 = expandTabs ? " " : "	";
            break;
          }
          case -1: {
            if (!expandTabs && atTab)
              continue;
            value2 = " ";
            break;
          }
          default: {
            value2 = String.fromCharCode(chunk);
          }
        }
      atTab = chunk === -2;
      result.push(value2);
    }
    return result.join("");
  }
  const document$1 = {
    [42]: list$2,
    [43]: list$2,
    [45]: list$2,
    [48]: list$2,
    [49]: list$2,
    [50]: list$2,
    [51]: list$2,
    [52]: list$2,
    [53]: list$2,
    [54]: list$2,
    [55]: list$2,
    [56]: list$2,
    [57]: list$2,
    [62]: blockQuote
  };
  const contentInitial = {
    [91]: definition$1
  };
  const flowInitial = {
    [-2]: codeIndented,
    [-1]: codeIndented,
    [32]: codeIndented
  };
  const flow = {
    [35]: headingAtx,
    [42]: thematicBreak$2,
    [45]: [setextUnderline, thematicBreak$2],
    [60]: htmlFlow,
    [61]: setextUnderline,
    [95]: thematicBreak$2,
    [96]: codeFenced,
    [126]: codeFenced
  };
  const string = {
    [38]: characterReference,
    [92]: characterEscape
  };
  const text$4 = {
    [-5]: lineEnding,
    [-4]: lineEnding,
    [-3]: lineEnding,
    [33]: labelStartImage,
    [38]: characterReference,
    [42]: attention,
    [60]: [autolink, htmlText],
    [91]: labelStartLink,
    [92]: [hardBreakEscape, characterEscape],
    [93]: labelEnd,
    [95]: attention,
    [96]: codeText
  };
  const insideSpan = {
    null: [attention, resolver]
  };
  const attentionMarkers = {
    null: [42, 95]
  };
  const disable = {
    null: []
  };
  const defaultConstructs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    attentionMarkers,
    contentInitial,
    disable,
    document: document$1,
    flow,
    flowInitial,
    insideSpan,
    string,
    text: text$4
  }, Symbol.toStringTag, { value: "Module" }));
  function parse$2(options2 = {}) {
    const constructs2 = combineExtensions(
      // @ts-expect-error Same as above.
      [defaultConstructs].concat(options2.extensions || [])
    );
    const parser = {
      defined: [],
      lazy: {},
      constructs: constructs2,
      content: create2(content$2),
      document: create2(document$2),
      flow: create2(flow$1),
      string: create2(string$1),
      text: create2(text$5)
    };
    return parser;
    function create2(initial) {
      return creator;
      function creator(from) {
        return createTokenizer(parser, initial, from);
      }
    }
  }
  const search = /[\0\t\n\r]/g;
  function preprocess() {
    let column = 1;
    let buffer = "";
    let start = true;
    let atCarriageReturn;
    return preprocessor;
    function preprocessor(value2, encoding, end) {
      const chunks = [];
      let match;
      let next;
      let startPosition;
      let endPosition;
      let code2;
      value2 = buffer + value2.toString(encoding);
      startPosition = 0;
      buffer = "";
      if (start) {
        if (value2.charCodeAt(0) === 65279) {
          startPosition++;
        }
        start = void 0;
      }
      while (startPosition < value2.length) {
        search.lastIndex = startPosition;
        match = search.exec(value2);
        endPosition = match && match.index !== void 0 ? match.index : value2.length;
        code2 = value2.charCodeAt(endPosition);
        if (!match) {
          buffer = value2.slice(startPosition);
          break;
        }
        if (code2 === 10 && startPosition === endPosition && atCarriageReturn) {
          chunks.push(-3);
          atCarriageReturn = void 0;
        } else {
          if (atCarriageReturn) {
            chunks.push(-5);
            atCarriageReturn = void 0;
          }
          if (startPosition < endPosition) {
            chunks.push(value2.slice(startPosition, endPosition));
            column += endPosition - startPosition;
          }
          switch (code2) {
            case 0: {
              chunks.push(65533);
              column++;
              break;
            }
            case 9: {
              next = Math.ceil(column / 4) * 4;
              chunks.push(-2);
              while (column++ < next)
                chunks.push(-1);
              break;
            }
            case 10: {
              chunks.push(-4);
              column = 1;
              break;
            }
            default: {
              atCarriageReturn = true;
              column = 1;
            }
          }
        }
        startPosition = endPosition + 1;
      }
      if (end) {
        if (atCarriageReturn)
          chunks.push(-5);
        if (buffer)
          chunks.push(buffer);
        chunks.push(null);
      }
      return chunks;
    }
  }
  function postprocess(events) {
    while (!subtokenize(events)) {
    }
    return events;
  }
  function decodeNumericCharacterReference(value2, base) {
    const code2 = Number.parseInt(value2, base);
    if (
      // C0 except for HT, LF, FF, CR, space
      code2 < 9 || code2 === 11 || code2 > 13 && code2 < 32 || // Control character (DEL) of the basic block and C1 controls.
      code2 > 126 && code2 < 160 || // Lone high surrogates and low surrogates.
      code2 > 55295 && code2 < 57344 || // Noncharacters.
      code2 > 64975 && code2 < 65008 || (code2 & 65535) === 65535 || (code2 & 65535) === 65534 || // Out of range
      code2 > 1114111
    ) {
      return "�";
    }
    return String.fromCharCode(code2);
  }
  const characterEscapeOrReference = /\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;
  function decodeString(value2) {
    return value2.replace(characterEscapeOrReference, decode$2);
  }
  function decode$2($0, $1, $2) {
    if ($1) {
      return $1;
    }
    const head2 = $2.charCodeAt(0);
    if (head2 === 35) {
      const head3 = $2.charCodeAt(1);
      const hex = head3 === 120 || head3 === 88;
      return decodeNumericCharacterReference($2.slice(hex ? 2 : 1), hex ? 16 : 10);
    }
    return decodeNamedCharacterReference($2) || $0;
  }
  function stringifyPosition(value2) {
    if (!value2 || typeof value2 !== "object") {
      return "";
    }
    if ("position" in value2 || "type" in value2) {
      return position$2(value2.position);
    }
    if ("start" in value2 || "end" in value2) {
      return position$2(value2);
    }
    if ("line" in value2 || "column" in value2) {
      return point$2(value2);
    }
    return "";
  }
  function point$2(point2) {
    return index(point2 && point2.line) + ":" + index(point2 && point2.column);
  }
  function position$2(pos) {
    return point$2(pos && pos.start) + "-" + point$2(pos && pos.end);
  }
  function index(value2) {
    return value2 && typeof value2 === "number" ? value2 : 1;
  }
  const own$8 = {}.hasOwnProperty;
  const fromMarkdown$1 = (
    /**
     * @type {(
     *   ((value: Value, encoding: Encoding, options?: Options | null | undefined) => Root) &
     *   ((value: Value, options?: Options | null | undefined) => Root)
     * )}
     */
    /**
     * @param {Value} value
     * @param {Encoding | Options | null | undefined} [encoding]
     * @param {Options | null | undefined} [options]
     * @returns {Root}
     */
    function(value2, encoding, options2) {
      if (typeof encoding !== "string") {
        options2 = encoding;
        encoding = void 0;
      }
      return compiler(options2)(
        postprocess(
          // @ts-expect-error: micromark types need to accept `null`.
          parse$2(options2).document().write(preprocess()(value2, encoding, true))
        )
      );
    }
  );
  function compiler(options2) {
    const config = {
      transforms: [],
      canContainEols: ["emphasis", "fragment", "heading", "paragraph", "strong"],
      enter: {
        autolink: opener2(link2),
        autolinkProtocol: onenterdata,
        autolinkEmail: onenterdata,
        atxHeading: opener2(heading2),
        blockQuote: opener2(blockQuote2),
        characterEscape: onenterdata,
        characterReference: onenterdata,
        codeFenced: opener2(codeFlow),
        codeFencedFenceInfo: buffer,
        codeFencedFenceMeta: buffer,
        codeIndented: opener2(codeFlow, buffer),
        codeText: opener2(codeText2, buffer),
        codeTextData: onenterdata,
        data: onenterdata,
        codeFlowValue: onenterdata,
        definition: opener2(definition2),
        definitionDestinationString: buffer,
        definitionLabelString: buffer,
        definitionTitleString: buffer,
        emphasis: opener2(emphasis2),
        hardBreakEscape: opener2(hardBreak2),
        hardBreakTrailing: opener2(hardBreak2),
        htmlFlow: opener2(html2, buffer),
        htmlFlowData: onenterdata,
        htmlText: opener2(html2, buffer),
        htmlTextData: onenterdata,
        image: opener2(image2),
        label: buffer,
        link: opener2(link2),
        listItem: opener2(listItem2),
        listItemValue: onenterlistitemvalue,
        listOrdered: opener2(list2, onenterlistordered),
        listUnordered: opener2(list2),
        paragraph: opener2(paragraph2),
        reference: onenterreference,
        referenceString: buffer,
        resourceDestinationString: buffer,
        resourceTitleString: buffer,
        setextHeading: opener2(heading2),
        strong: opener2(strong2),
        thematicBreak: opener2(thematicBreak2)
      },
      exit: {
        atxHeading: closer(),
        atxHeadingSequence: onexitatxheadingsequence,
        autolink: closer(),
        autolinkEmail: onexitautolinkemail,
        autolinkProtocol: onexitautolinkprotocol,
        blockQuote: closer(),
        characterEscapeValue: onexitdata,
        characterReferenceMarkerHexadecimal: onexitcharacterreferencemarker,
        characterReferenceMarkerNumeric: onexitcharacterreferencemarker,
        characterReferenceValue: onexitcharacterreferencevalue,
        codeFenced: closer(onexitcodefenced),
        codeFencedFence: onexitcodefencedfence,
        codeFencedFenceInfo: onexitcodefencedfenceinfo,
        codeFencedFenceMeta: onexitcodefencedfencemeta,
        codeFlowValue: onexitdata,
        codeIndented: closer(onexitcodeindented),
        codeText: closer(onexitcodetext),
        codeTextData: onexitdata,
        data: onexitdata,
        definition: closer(),
        definitionDestinationString: onexitdefinitiondestinationstring,
        definitionLabelString: onexitdefinitionlabelstring,
        definitionTitleString: onexitdefinitiontitlestring,
        emphasis: closer(),
        hardBreakEscape: closer(onexithardbreak),
        hardBreakTrailing: closer(onexithardbreak),
        htmlFlow: closer(onexithtmlflow),
        htmlFlowData: onexitdata,
        htmlText: closer(onexithtmltext),
        htmlTextData: onexitdata,
        image: closer(onexitimage),
        label: onexitlabel,
        labelText: onexitlabeltext,
        lineEnding: onexitlineending,
        link: closer(onexitlink),
        listItem: closer(),
        listOrdered: closer(),
        listUnordered: closer(),
        paragraph: closer(),
        referenceString: onexitreferencestring,
        resourceDestinationString: onexitresourcedestinationstring,
        resourceTitleString: onexitresourcetitlestring,
        resource: onexitresource,
        setextHeading: closer(onexitsetextheading),
        setextHeadingLineSequence: onexitsetextheadinglinesequence,
        setextHeadingText: onexitsetextheadingtext,
        strong: closer(),
        thematicBreak: closer()
      }
    };
    configure$1(config, (options2 || {}).mdastExtensions || []);
    const data = {};
    return compile;
    function compile(events) {
      let tree = {
        type: "root",
        children: []
      };
      const context = {
        stack: [tree],
        tokenStack: [],
        config,
        enter,
        exit: exit2,
        buffer,
        resume,
        setData,
        getData
      };
      const listStack = [];
      let index2 = -1;
      while (++index2 < events.length) {
        if (events[index2][1].type === "listOrdered" || events[index2][1].type === "listUnordered") {
          if (events[index2][0] === "enter") {
            listStack.push(index2);
          } else {
            const tail = listStack.pop();
            index2 = prepareList(events, tail, index2);
          }
        }
      }
      index2 = -1;
      while (++index2 < events.length) {
        const handler2 = config[events[index2][0]];
        if (own$8.call(handler2, events[index2][1].type)) {
          handler2[events[index2][1].type].call(
            Object.assign(
              {
                sliceSerialize: events[index2][2].sliceSerialize
              },
              context
            ),
            events[index2][1]
          );
        }
      }
      if (context.tokenStack.length > 0) {
        const tail = context.tokenStack[context.tokenStack.length - 1];
        const handler2 = tail[1] || defaultOnError;
        handler2.call(context, void 0, tail[0]);
      }
      tree.position = {
        start: point$1(
          events.length > 0 ? events[0][1].start : {
            line: 1,
            column: 1,
            offset: 0
          }
        ),
        end: point$1(
          events.length > 0 ? events[events.length - 2][1].end : {
            line: 1,
            column: 1,
            offset: 0
          }
        )
      };
      index2 = -1;
      while (++index2 < config.transforms.length) {
        tree = config.transforms[index2](tree) || tree;
      }
      return tree;
    }
    function prepareList(events, start, length) {
      let index2 = start - 1;
      let containerBalance = -1;
      let listSpread = false;
      let listItem3;
      let lineIndex;
      let firstBlankLineIndex;
      let atMarker;
      while (++index2 <= length) {
        const event = events[index2];
        if (event[1].type === "listUnordered" || event[1].type === "listOrdered" || event[1].type === "blockQuote") {
          if (event[0] === "enter") {
            containerBalance++;
          } else {
            containerBalance--;
          }
          atMarker = void 0;
        } else if (event[1].type === "lineEndingBlank") {
          if (event[0] === "enter") {
            if (listItem3 && !atMarker && !containerBalance && !firstBlankLineIndex) {
              firstBlankLineIndex = index2;
            }
            atMarker = void 0;
          }
        } else if (event[1].type === "linePrefix" || event[1].type === "listItemValue" || event[1].type === "listItemMarker" || event[1].type === "listItemPrefix" || event[1].type === "listItemPrefixWhitespace")
          ;
        else {
          atMarker = void 0;
        }
        if (!containerBalance && event[0] === "enter" && event[1].type === "listItemPrefix" || containerBalance === -1 && event[0] === "exit" && (event[1].type === "listUnordered" || event[1].type === "listOrdered")) {
          if (listItem3) {
            let tailIndex = index2;
            lineIndex = void 0;
            while (tailIndex--) {
              const tailEvent = events[tailIndex];
              if (tailEvent[1].type === "lineEnding" || tailEvent[1].type === "lineEndingBlank") {
                if (tailEvent[0] === "exit")
                  continue;
                if (lineIndex) {
                  events[lineIndex][1].type = "lineEndingBlank";
                  listSpread = true;
                }
                tailEvent[1].type = "lineEnding";
                lineIndex = tailIndex;
              } else if (tailEvent[1].type === "linePrefix" || tailEvent[1].type === "blockQuotePrefix" || tailEvent[1].type === "blockQuotePrefixWhitespace" || tailEvent[1].type === "blockQuoteMarker" || tailEvent[1].type === "listItemIndent")
                ;
              else {
                break;
              }
            }
            if (firstBlankLineIndex && (!lineIndex || firstBlankLineIndex < lineIndex)) {
              listItem3._spread = true;
            }
            listItem3.end = Object.assign(
              {},
              lineIndex ? events[lineIndex][1].start : event[1].end
            );
            events.splice(lineIndex || index2, 0, ["exit", listItem3, event[2]]);
            index2++;
            length++;
          }
          if (event[1].type === "listItemPrefix") {
            listItem3 = {
              type: "listItem",
              // @ts-expect-error Patched
              _spread: false,
              start: Object.assign({}, event[1].start)
            };
            events.splice(index2, 0, ["enter", listItem3, event[2]]);
            index2++;
            length++;
            firstBlankLineIndex = void 0;
            atMarker = true;
          }
        }
      }
      events[start][1]._spread = listSpread;
      return length;
    }
    function setData(key2, value2) {
      data[key2] = value2;
    }
    function getData(key2) {
      return data[key2];
    }
    function opener2(create2, and) {
      return open;
      function open(token) {
        enter.call(this, create2(token), token);
        if (and)
          and.call(this, token);
      }
    }
    function buffer() {
      this.stack.push({
        type: "fragment",
        children: []
      });
    }
    function enter(node2, token, errorHandler) {
      const parent = this.stack[this.stack.length - 1];
      parent.children.push(node2);
      this.stack.push(node2);
      this.tokenStack.push([token, errorHandler]);
      node2.position = {
        start: point$1(token.start)
      };
      return node2;
    }
    function closer(and) {
      return close2;
      function close2(token) {
        if (and)
          and.call(this, token);
        exit2.call(this, token);
      }
    }
    function exit2(token, onExitError) {
      const node2 = this.stack.pop();
      const open = this.tokenStack.pop();
      if (!open) {
        throw new Error(
          "Cannot close `" + token.type + "` (" + stringifyPosition({
            start: token.start,
            end: token.end
          }) + "): it’s not open"
        );
      } else if (open[0].type !== token.type) {
        if (onExitError) {
          onExitError.call(this, token, open[0]);
        } else {
          const handler2 = open[1] || defaultOnError;
          handler2.call(this, token, open[0]);
        }
      }
      node2.position.end = point$1(token.end);
      return node2;
    }
    function resume() {
      return toString(this.stack.pop());
    }
    function onenterlistordered() {
      setData("expectingFirstListItemValue", true);
    }
    function onenterlistitemvalue(token) {
      if (getData("expectingFirstListItemValue")) {
        const ancestor = this.stack[this.stack.length - 2];
        ancestor.start = Number.parseInt(this.sliceSerialize(token), 10);
        setData("expectingFirstListItemValue");
      }
    }
    function onexitcodefencedfenceinfo() {
      const data2 = this.resume();
      const node2 = this.stack[this.stack.length - 1];
      node2.lang = data2;
    }
    function onexitcodefencedfencemeta() {
      const data2 = this.resume();
      const node2 = this.stack[this.stack.length - 1];
      node2.meta = data2;
    }
    function onexitcodefencedfence() {
      if (getData("flowCodeInside"))
        return;
      this.buffer();
      setData("flowCodeInside", true);
    }
    function onexitcodefenced() {
      const data2 = this.resume();
      const node2 = this.stack[this.stack.length - 1];
      node2.value = data2.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, "");
      setData("flowCodeInside");
    }
    function onexitcodeindented() {
      const data2 = this.resume();
      const node2 = this.stack[this.stack.length - 1];
      node2.value = data2.replace(/(\r?\n|\r)$/g, "");
    }
    function onexitdefinitionlabelstring(token) {
      const label = this.resume();
      const node2 = this.stack[this.stack.length - 1];
      node2.label = label;
      node2.identifier = normalizeIdentifier(
        this.sliceSerialize(token)
      ).toLowerCase();
    }
    function onexitdefinitiontitlestring() {
      const data2 = this.resume();
      const node2 = this.stack[this.stack.length - 1];
      node2.title = data2;
    }
    function onexitdefinitiondestinationstring() {
      const data2 = this.resume();
      const node2 = this.stack[this.stack.length - 1];
      node2.url = data2;
    }
    function onexitatxheadingsequence(token) {
      const node2 = this.stack[this.stack.length - 1];
      if (!node2.depth) {
        const depth = this.sliceSerialize(token).length;
        node2.depth = depth;
      }
    }
    function onexitsetextheadingtext() {
      setData("setextHeadingSlurpLineEnding", true);
    }
    function onexitsetextheadinglinesequence(token) {
      const node2 = this.stack[this.stack.length - 1];
      node2.depth = this.sliceSerialize(token).charCodeAt(0) === 61 ? 1 : 2;
    }
    function onexitsetextheading() {
      setData("setextHeadingSlurpLineEnding");
    }
    function onenterdata(token) {
      const node2 = this.stack[this.stack.length - 1];
      let tail = node2.children[node2.children.length - 1];
      if (!tail || tail.type !== "text") {
        tail = text2();
        tail.position = {
          start: point$1(token.start)
        };
        node2.children.push(tail);
      }
      this.stack.push(tail);
    }
    function onexitdata(token) {
      const tail = this.stack.pop();
      tail.value += this.sliceSerialize(token);
      tail.position.end = point$1(token.end);
    }
    function onexitlineending(token) {
      const context = this.stack[this.stack.length - 1];
      if (getData("atHardBreak")) {
        const tail = context.children[context.children.length - 1];
        tail.position.end = point$1(token.end);
        setData("atHardBreak");
        return;
      }
      if (!getData("setextHeadingSlurpLineEnding") && config.canContainEols.includes(context.type)) {
        onenterdata.call(this, token);
        onexitdata.call(this, token);
      }
    }
    function onexithardbreak() {
      setData("atHardBreak", true);
    }
    function onexithtmlflow() {
      const data2 = this.resume();
      const node2 = this.stack[this.stack.length - 1];
      node2.value = data2;
    }
    function onexithtmltext() {
      const data2 = this.resume();
      const node2 = this.stack[this.stack.length - 1];
      node2.value = data2;
    }
    function onexitcodetext() {
      const data2 = this.resume();
      const node2 = this.stack[this.stack.length - 1];
      node2.value = data2;
    }
    function onexitlink() {
      const node2 = this.stack[this.stack.length - 1];
      if (getData("inReference")) {
        const referenceType = getData("referenceType") || "shortcut";
        node2.type += "Reference";
        node2.referenceType = referenceType;
        delete node2.url;
        delete node2.title;
      } else {
        delete node2.identifier;
        delete node2.label;
      }
      setData("referenceType");
    }
    function onexitimage() {
      const node2 = this.stack[this.stack.length - 1];
      if (getData("inReference")) {
        const referenceType = getData("referenceType") || "shortcut";
        node2.type += "Reference";
        node2.referenceType = referenceType;
        delete node2.url;
        delete node2.title;
      } else {
        delete node2.identifier;
        delete node2.label;
      }
      setData("referenceType");
    }
    function onexitlabeltext(token) {
      const string2 = this.sliceSerialize(token);
      const ancestor = this.stack[this.stack.length - 2];
      ancestor.label = decodeString(string2);
      ancestor.identifier = normalizeIdentifier(string2).toLowerCase();
    }
    function onexitlabel() {
      const fragment = this.stack[this.stack.length - 1];
      const value2 = this.resume();
      const node2 = this.stack[this.stack.length - 1];
      setData("inReference", true);
      if (node2.type === "link") {
        const children = fragment.children;
        node2.children = children;
      } else {
        node2.alt = value2;
      }
    }
    function onexitresourcedestinationstring() {
      const data2 = this.resume();
      const node2 = this.stack[this.stack.length - 1];
      node2.url = data2;
    }
    function onexitresourcetitlestring() {
      const data2 = this.resume();
      const node2 = this.stack[this.stack.length - 1];
      node2.title = data2;
    }
    function onexitresource() {
      setData("inReference");
    }
    function onenterreference() {
      setData("referenceType", "collapsed");
    }
    function onexitreferencestring(token) {
      const label = this.resume();
      const node2 = this.stack[this.stack.length - 1];
      node2.label = label;
      node2.identifier = normalizeIdentifier(
        this.sliceSerialize(token)
      ).toLowerCase();
      setData("referenceType", "full");
    }
    function onexitcharacterreferencemarker(token) {
      setData("characterReferenceType", token.type);
    }
    function onexitcharacterreferencevalue(token) {
      const data2 = this.sliceSerialize(token);
      const type = getData("characterReferenceType");
      let value2;
      if (type) {
        value2 = decodeNumericCharacterReference(
          data2,
          type === "characterReferenceMarkerNumeric" ? 10 : 16
        );
        setData("characterReferenceType");
      } else {
        const result = decodeNamedCharacterReference(data2);
        value2 = result;
      }
      const tail = this.stack.pop();
      tail.value += value2;
      tail.position.end = point$1(token.end);
    }
    function onexitautolinkprotocol(token) {
      onexitdata.call(this, token);
      const node2 = this.stack[this.stack.length - 1];
      node2.url = this.sliceSerialize(token);
    }
    function onexitautolinkemail(token) {
      onexitdata.call(this, token);
      const node2 = this.stack[this.stack.length - 1];
      node2.url = "mailto:" + this.sliceSerialize(token);
    }
    function blockQuote2() {
      return {
        type: "blockquote",
        children: []
      };
    }
    function codeFlow() {
      return {
        type: "code",
        lang: null,
        meta: null,
        value: ""
      };
    }
    function codeText2() {
      return {
        type: "inlineCode",
        value: ""
      };
    }
    function definition2() {
      return {
        type: "definition",
        identifier: "",
        label: null,
        title: null,
        url: ""
      };
    }
    function emphasis2() {
      return {
        type: "emphasis",
        children: []
      };
    }
    function heading2() {
      return {
        type: "heading",
        depth: void 0,
        children: []
      };
    }
    function hardBreak2() {
      return {
        type: "break"
      };
    }
    function html2() {
      return {
        type: "html",
        value: ""
      };
    }
    function image2() {
      return {
        type: "image",
        title: null,
        url: "",
        alt: null
      };
    }
    function link2() {
      return {
        type: "link",
        title: null,
        url: "",
        children: []
      };
    }
    function list2(token) {
      return {
        type: "list",
        ordered: token.type === "listOrdered",
        start: null,
        // @ts-expect-error Patched.
        spread: token._spread,
        children: []
      };
    }
    function listItem2(token) {
      return {
        type: "listItem",
        // @ts-expect-error Patched.
        spread: token._spread,
        checked: null,
        children: []
      };
    }
    function paragraph2() {
      return {
        type: "paragraph",
        children: []
      };
    }
    function strong2() {
      return {
        type: "strong",
        children: []
      };
    }
    function text2() {
      return {
        type: "text",
        value: ""
      };
    }
    function thematicBreak2() {
      return {
        type: "thematicBreak"
      };
    }
  }
  function point$1(d2) {
    return {
      line: d2.line,
      column: d2.column,
      offset: d2.offset
    };
  }
  function configure$1(combined, extensions) {
    let index2 = -1;
    while (++index2 < extensions.length) {
      const value2 = extensions[index2];
      if (Array.isArray(value2)) {
        configure$1(combined, value2);
      } else {
        extension(combined, value2);
      }
    }
  }
  function extension(combined, extension2) {
    let key2;
    for (key2 in extension2) {
      if (own$8.call(extension2, key2)) {
        if (key2 === "canContainEols") {
          const right = extension2[key2];
          if (right) {
            combined[key2].push(...right);
          }
        } else if (key2 === "transforms") {
          const right = extension2[key2];
          if (right) {
            combined[key2].push(...right);
          }
        } else if (key2 === "enter" || key2 === "exit") {
          const right = extension2[key2];
          if (right) {
            Object.assign(combined[key2], right);
          }
        }
      }
    }
  }
  function defaultOnError(left, right) {
    if (left) {
      throw new Error(
        "Cannot close `" + left.type + "` (" + stringifyPosition({
          start: left.start,
          end: left.end
        }) + "): a different token (`" + right.type + "`, " + stringifyPosition({
          start: right.start,
          end: right.end
        }) + ") is open"
      );
    } else {
      throw new Error(
        "Cannot close document, a token (`" + right.type + "`, " + stringifyPosition({
          start: right.start,
          end: right.end
        }) + ") is still open"
      );
    }
  }
  const own$7 = {}.hasOwnProperty;
  function zwitch(key2, options2) {
    const settings = options2 || {};
    function one2(value2, ...parameters) {
      let fn2 = one2.invalid;
      const handlers2 = one2.handlers;
      if (value2 && own$7.call(value2, key2)) {
        const id = String(value2[key2]);
        fn2 = own$7.call(handlers2, id) ? handlers2[id] : one2.unknown;
      }
      if (fn2) {
        return fn2.call(this, value2, ...parameters);
      }
    }
    one2.handlers = settings.handlers || {};
    one2.invalid = settings.invalid;
    one2.unknown = settings.unknown;
    return one2;
  }
  function configure(base, extension2) {
    let index2 = -1;
    let key2;
    if (extension2.extensions) {
      while (++index2 < extension2.extensions.length) {
        configure(base, extension2.extensions[index2]);
      }
    }
    for (key2 in extension2) {
      if (key2 === "extensions")
        ;
      else if (key2 === "unsafe" || key2 === "join") {
        base[key2] = [...base[key2] || [], ...extension2[key2] || []];
      } else if (key2 === "handlers") {
        base[key2] = Object.assign(base[key2], extension2[key2] || {});
      } else {
        base.options[key2] = extension2[key2];
      }
    }
    return base;
  }
  function blockquote$1(node2, _2, state, info) {
    const exit2 = state.enter("blockquote");
    const tracker = state.createTracker(info);
    tracker.move("> ");
    tracker.shift(2);
    const value2 = state.indentLines(
      state.containerFlow(node2, tracker.current()),
      map$2
    );
    exit2();
    return value2;
  }
  function map$2(line, _2, blank) {
    return ">" + (blank ? "" : " ") + line;
  }
  function patternInScope(stack, pattern) {
    return listInScope(stack, pattern.inConstruct, true) && !listInScope(stack, pattern.notInConstruct, false);
  }
  function listInScope(stack, list2, none) {
    if (typeof list2 === "string") {
      list2 = [list2];
    }
    if (!list2 || list2.length === 0) {
      return none;
    }
    let index2 = -1;
    while (++index2 < list2.length) {
      if (stack.includes(list2[index2])) {
        return true;
      }
    }
    return false;
  }
  function hardBreak$1(_2, _1, state, info) {
    let index2 = -1;
    while (++index2 < state.unsafe.length) {
      if (state.unsafe[index2].character === "\n" && patternInScope(state.stack, state.unsafe[index2])) {
        return /[ \t]/.test(info.before) ? "" : " ";
      }
    }
    return "\\\n";
  }
  function longestStreak(value2, substring) {
    const source = String(value2);
    let index2 = source.indexOf(substring);
    let expected = index2;
    let count = 0;
    let max = 0;
    if (typeof substring !== "string") {
      throw new TypeError("Expected substring");
    }
    while (index2 !== -1) {
      if (index2 === expected) {
        if (++count > max) {
          max = count;
        }
      } else {
        count = 1;
      }
      expected = index2 + substring.length;
      index2 = source.indexOf(substring, expected);
    }
    return max;
  }
  function formatCodeAsIndented(node2, state) {
    return Boolean(
      !state.options.fences && node2.value && // If there’s no info…
      !node2.lang && // And there’s a non-whitespace character…
      /[^ \r\n]/.test(node2.value) && // And the value doesn’t start or end in a blank…
      !/^[\t ]*(?:[\r\n]|$)|(?:^|[\r\n])[\t ]*$/.test(node2.value)
    );
  }
  function checkFence(state) {
    const marker = state.options.fence || "`";
    if (marker !== "`" && marker !== "~") {
      throw new Error(
        "Cannot serialize code with `" + marker + "` for `options.fence`, expected `` ` `` or `~`"
      );
    }
    return marker;
  }
  function code$2(node2, _2, state, info) {
    const marker = checkFence(state);
    const raw2 = node2.value || "";
    const suffix = marker === "`" ? "GraveAccent" : "Tilde";
    if (formatCodeAsIndented(node2, state)) {
      const exit3 = state.enter("codeIndented");
      const value3 = state.indentLines(raw2, map$1);
      exit3();
      return value3;
    }
    const tracker = state.createTracker(info);
    const sequence = marker.repeat(Math.max(longestStreak(raw2, marker) + 1, 3));
    const exit2 = state.enter("codeFenced");
    let value2 = tracker.move(sequence);
    if (node2.lang) {
      const subexit = state.enter(`codeFencedLang${suffix}`);
      value2 += tracker.move(
        state.safe(node2.lang, {
          before: value2,
          after: " ",
          encode: ["`"],
          ...tracker.current()
        })
      );
      subexit();
    }
    if (node2.lang && node2.meta) {
      const subexit = state.enter(`codeFencedMeta${suffix}`);
      value2 += tracker.move(" ");
      value2 += tracker.move(
        state.safe(node2.meta, {
          before: value2,
          after: "\n",
          encode: ["`"],
          ...tracker.current()
        })
      );
      subexit();
    }
    value2 += tracker.move("\n");
    if (raw2) {
      value2 += tracker.move(raw2 + "\n");
    }
    value2 += tracker.move(sequence);
    exit2();
    return value2;
  }
  function map$1(line, _2, blank) {
    return (blank ? "" : "    ") + line;
  }
  function checkQuote(state) {
    const marker = state.options.quote || '"';
    if (marker !== '"' && marker !== "'") {
      throw new Error(
        "Cannot serialize title with `" + marker + "` for `options.quote`, expected `\"`, or `'`"
      );
    }
    return marker;
  }
  function definition(node2, _2, state, info) {
    const quote = checkQuote(state);
    const suffix = quote === '"' ? "Quote" : "Apostrophe";
    const exit2 = state.enter("definition");
    let subexit = state.enter("label");
    const tracker = state.createTracker(info);
    let value2 = tracker.move("[");
    value2 += tracker.move(
      state.safe(state.associationId(node2), {
        before: value2,
        after: "]",
        ...tracker.current()
      })
    );
    value2 += tracker.move("]: ");
    subexit();
    if (
      // If there’s no url, or…
      !node2.url || // If there are control characters or whitespace.
      /[\0- \u007F]/.test(node2.url)
    ) {
      subexit = state.enter("destinationLiteral");
      value2 += tracker.move("<");
      value2 += tracker.move(
        state.safe(node2.url, { before: value2, after: ">", ...tracker.current() })
      );
      value2 += tracker.move(">");
    } else {
      subexit = state.enter("destinationRaw");
      value2 += tracker.move(
        state.safe(node2.url, {
          before: value2,
          after: node2.title ? " " : "\n",
          ...tracker.current()
        })
      );
    }
    subexit();
    if (node2.title) {
      subexit = state.enter(`title${suffix}`);
      value2 += tracker.move(" " + quote);
      value2 += tracker.move(
        state.safe(node2.title, {
          before: value2,
          after: quote,
          ...tracker.current()
        })
      );
      value2 += tracker.move(quote);
      subexit();
    }
    exit2();
    return value2;
  }
  function checkEmphasis(state) {
    const marker = state.options.emphasis || "*";
    if (marker !== "*" && marker !== "_") {
      throw new Error(
        "Cannot serialize emphasis with `" + marker + "` for `options.emphasis`, expected `*`, or `_`"
      );
    }
    return marker;
  }
  emphasis$1.peek = emphasisPeek;
  function emphasis$1(node2, _2, state, info) {
    const marker = checkEmphasis(state);
    const exit2 = state.enter("emphasis");
    const tracker = state.createTracker(info);
    let value2 = tracker.move(marker);
    value2 += tracker.move(
      state.containerPhrasing(node2, {
        before: value2,
        after: marker,
        ...tracker.current()
      })
    );
    value2 += tracker.move(marker);
    exit2();
    return value2;
  }
  function emphasisPeek(_2, _1, state) {
    return state.options.emphasis || "*";
  }
  const convert = (
    /**
     * @type {(
     *   (<Kind extends Node>(test: PredicateTest<Kind>) => AssertPredicate<Kind>) &
     *   ((test?: Test) => AssertAnything)
     * )}
     */
    /**
     * @param {Test} [test]
     * @returns {AssertAnything}
     */
    function(test) {
      if (test === void 0 || test === null) {
        return ok;
      }
      if (typeof test === "string") {
        return typeFactory(test);
      }
      if (typeof test === "object") {
        return Array.isArray(test) ? anyFactory(test) : propsFactory(test);
      }
      if (typeof test === "function") {
        return castFactory(test);
      }
      throw new Error("Expected function, string, or object as test");
    }
  );
  function anyFactory(tests) {
    const checks2 = [];
    let index2 = -1;
    while (++index2 < tests.length) {
      checks2[index2] = convert(tests[index2]);
    }
    return castFactory(any);
    function any(...parameters) {
      let index3 = -1;
      while (++index3 < checks2.length) {
        if (checks2[index3].call(this, ...parameters))
          return true;
      }
      return false;
    }
  }
  function propsFactory(check) {
    return castFactory(all2);
    function all2(node2) {
      let key2;
      for (key2 in check) {
        if (node2[key2] !== check[key2])
          return false;
      }
      return true;
    }
  }
  function typeFactory(check) {
    return castFactory(type);
    function type(node2) {
      return node2 && node2.type === check;
    }
  }
  function castFactory(check) {
    return assertion;
    function assertion(node2, ...parameters) {
      return Boolean(
        node2 && typeof node2 === "object" && "type" in node2 && // @ts-expect-error: fine.
        Boolean(check.call(this, node2, ...parameters))
      );
    }
  }
  function ok() {
    return true;
  }
  function color$2(d2) {
    return d2;
  }
  const CONTINUE = true;
  const EXIT = false;
  const SKIP = "skip";
  const visitParents = (
    /**
     * @type {(
     *   (<Tree extends Node, Check extends Test>(tree: Tree, test: Check, visitor: BuildVisitor<Tree, Check>, reverse?: boolean | null | undefined) => void) &
     *   (<Tree extends Node>(tree: Tree, visitor: BuildVisitor<Tree>, reverse?: boolean | null | undefined) => void)
     * )}
     */
    /**
     * @param {Node} tree
     * @param {Test} test
     * @param {Visitor<Node>} visitor
     * @param {boolean | null | undefined} [reverse]
     * @returns {void}
     */
    function(tree, test, visitor, reverse) {
      if (typeof test === "function" && typeof visitor !== "function") {
        reverse = visitor;
        visitor = test;
        test = null;
      }
      const is = convert(test);
      const step = reverse ? -1 : 1;
      factory(tree, void 0, [])();
      function factory(node2, index2, parents) {
        const value2 = node2 && typeof node2 === "object" ? node2 : {};
        if (typeof value2.type === "string") {
          const name = (
            // `hast`
            typeof value2.tagName === "string" ? value2.tagName : (
              // `xast`
              typeof value2.name === "string" ? value2.name : void 0
            )
          );
          Object.defineProperty(visit2, "name", {
            value: "node (" + color$2(node2.type + (name ? "<" + name + ">" : "")) + ")"
          });
        }
        return visit2;
        function visit2() {
          let result = [];
          let subresult;
          let offset;
          let grandparents;
          if (!test || is(node2, index2, parents[parents.length - 1] || null)) {
            result = toResult(visitor(node2, parents));
            if (result[0] === EXIT) {
              return result;
            }
          }
          if (node2.children && result[0] !== SKIP) {
            offset = (reverse ? node2.children.length : -1) + step;
            grandparents = parents.concat(node2);
            while (offset > -1 && offset < node2.children.length) {
              subresult = factory(node2.children[offset], offset, grandparents)();
              if (subresult[0] === EXIT) {
                return subresult;
              }
              offset = typeof subresult[1] === "number" ? subresult[1] : offset + step;
            }
          }
          return result;
        }
      }
    }
  );
  function toResult(value2) {
    if (Array.isArray(value2)) {
      return value2;
    }
    if (typeof value2 === "number") {
      return [CONTINUE, value2];
    }
    return [value2];
  }
  const visit = (
    /**
     * @type {(
     *   (<Tree extends Node, Check extends Test>(tree: Tree, test: Check, visitor: BuildVisitor<Tree, Check>, reverse?: boolean | null | undefined) => void) &
     *   (<Tree extends Node>(tree: Tree, visitor: BuildVisitor<Tree>, reverse?: boolean | null | undefined) => void)
     * )}
     */
    /**
     * @param {Node} tree
     * @param {Test} test
     * @param {Visitor} visitor
     * @param {boolean | null | undefined} [reverse]
     * @returns {void}
     */
    function(tree, test, visitor, reverse) {
      if (typeof test === "function" && typeof visitor !== "function") {
        reverse = visitor;
        visitor = test;
        test = null;
      }
      visitParents(tree, test, overload, reverse);
      function overload(node2, parents) {
        const parent = parents[parents.length - 1];
        return visitor(
          node2,
          parent ? parent.children.indexOf(node2) : null,
          parent
        );
      }
    }
  );
  function formatHeadingAsSetext(node2, state) {
    let literalWithBreak = false;
    visit(node2, (node3) => {
      if ("value" in node3 && /\r?\n|\r/.test(node3.value) || node3.type === "break") {
        literalWithBreak = true;
        return EXIT;
      }
    });
    return Boolean(
      (!node2.depth || node2.depth < 3) && toString(node2) && (state.options.setext || literalWithBreak)
    );
  }
  function heading$1(node2, _2, state, info) {
    const rank = Math.max(Math.min(6, node2.depth || 1), 1);
    const tracker = state.createTracker(info);
    if (formatHeadingAsSetext(node2, state)) {
      const exit3 = state.enter("headingSetext");
      const subexit2 = state.enter("phrasing");
      const value3 = state.containerPhrasing(node2, {
        ...tracker.current(),
        before: "\n",
        after: "\n"
      });
      subexit2();
      exit3();
      return value3 + "\n" + (rank === 1 ? "=" : "-").repeat(
        // The whole size…
        value3.length - // Minus the position of the character after the last EOL (or
        // 0 if there is none)…
        (Math.max(value3.lastIndexOf("\r"), value3.lastIndexOf("\n")) + 1)
      );
    }
    const sequence = "#".repeat(rank);
    const exit2 = state.enter("headingAtx");
    const subexit = state.enter("phrasing");
    tracker.move(sequence + " ");
    let value2 = state.containerPhrasing(node2, {
      before: "# ",
      after: "\n",
      ...tracker.current()
    });
    if (/^[\t ]/.test(value2)) {
      value2 = "&#x" + value2.charCodeAt(0).toString(16).toUpperCase() + ";" + value2.slice(1);
    }
    value2 = value2 ? sequence + " " + value2 : sequence;
    if (state.options.closeAtx) {
      value2 += " " + sequence;
    }
    subexit();
    exit2();
    return value2;
  }
  html$5.peek = htmlPeek;
  function html$5(node2) {
    return node2.value || "";
  }
  function htmlPeek() {
    return "<";
  }
  image$2.peek = imagePeek;
  function image$2(node2, _2, state, info) {
    const quote = checkQuote(state);
    const suffix = quote === '"' ? "Quote" : "Apostrophe";
    const exit2 = state.enter("image");
    let subexit = state.enter("label");
    const tracker = state.createTracker(info);
    let value2 = tracker.move("![");
    value2 += tracker.move(
      state.safe(node2.alt, { before: value2, after: "]", ...tracker.current() })
    );
    value2 += tracker.move("](");
    subexit();
    if (
      // If there’s no url but there is a title…
      !node2.url && node2.title || // If there are control characters or whitespace.
      /[\0- \u007F]/.test(node2.url)
    ) {
      subexit = state.enter("destinationLiteral");
      value2 += tracker.move("<");
      value2 += tracker.move(
        state.safe(node2.url, { before: value2, after: ">", ...tracker.current() })
      );
      value2 += tracker.move(">");
    } else {
      subexit = state.enter("destinationRaw");
      value2 += tracker.move(
        state.safe(node2.url, {
          before: value2,
          after: node2.title ? " " : ")",
          ...tracker.current()
        })
      );
    }
    subexit();
    if (node2.title) {
      subexit = state.enter(`title${suffix}`);
      value2 += tracker.move(" " + quote);
      value2 += tracker.move(
        state.safe(node2.title, {
          before: value2,
          after: quote,
          ...tracker.current()
        })
      );
      value2 += tracker.move(quote);
      subexit();
    }
    value2 += tracker.move(")");
    exit2();
    return value2;
  }
  function imagePeek() {
    return "!";
  }
  imageReference$1.peek = imageReferencePeek;
  function imageReference$1(node2, _2, state, info) {
    const type = node2.referenceType;
    const exit2 = state.enter("imageReference");
    let subexit = state.enter("label");
    const tracker = state.createTracker(info);
    let value2 = tracker.move("![");
    const alt = state.safe(node2.alt, {
      before: value2,
      after: "]",
      ...tracker.current()
    });
    value2 += tracker.move(alt + "][");
    subexit();
    const stack = state.stack;
    state.stack = [];
    subexit = state.enter("reference");
    const reference = state.safe(state.associationId(node2), {
      before: value2,
      after: "]",
      ...tracker.current()
    });
    subexit();
    state.stack = stack;
    exit2();
    if (type === "full" || !alt || alt !== reference) {
      value2 += tracker.move(reference + "]");
    } else if (type === "shortcut") {
      value2 = value2.slice(0, -1);
    } else {
      value2 += tracker.move("]");
    }
    return value2;
  }
  function imageReferencePeek() {
    return "!";
  }
  function patternCompile(pattern) {
    if (!pattern._compiled) {
      const before = (pattern.atBreak ? "[\\r\\n][\\t ]*" : "") + (pattern.before ? "(?:" + pattern.before + ")" : "");
      pattern._compiled = new RegExp(
        (before ? "(" + before + ")" : "") + (/[|\\{}()[\]^$+*?.-]/.test(pattern.character) ? "\\" : "") + pattern.character + (pattern.after ? "(?:" + pattern.after + ")" : ""),
        "g"
      );
    }
    return pattern._compiled;
  }
  inlineCode$1.peek = inlineCodePeek;
  function inlineCode$1(node2, _2, state) {
    let value2 = node2.value || "";
    let sequence = "`";
    let index2 = -1;
    while (new RegExp("(^|[^`])" + sequence + "([^`]|$)").test(value2)) {
      sequence += "`";
    }
    if (/[^ \r\n]/.test(value2) && (/^[ \r\n]/.test(value2) && /[ \r\n]$/.test(value2) || /^`|`$/.test(value2))) {
      value2 = " " + value2 + " ";
    }
    while (++index2 < state.unsafe.length) {
      const pattern = state.unsafe[index2];
      const expression = patternCompile(pattern);
      let match;
      if (!pattern.atBreak)
        continue;
      while (match = expression.exec(value2)) {
        let position2 = match.index;
        if (value2.charCodeAt(position2) === 10 && value2.charCodeAt(position2 - 1) === 13) {
          position2--;
        }
        value2 = value2.slice(0, position2) + " " + value2.slice(match.index + 1);
      }
    }
    return sequence + value2 + sequence;
  }
  function inlineCodePeek() {
    return "`";
  }
  function formatLinkAsAutolink(node2, state) {
    const raw2 = toString(node2);
    return Boolean(
      !state.options.resourceLink && // If there’s a url…
      node2.url && // And there’s a no title…
      !node2.title && // And the content of `node` is a single text node…
      node2.children && node2.children.length === 1 && node2.children[0].type === "text" && // And if the url is the same as the content…
      (raw2 === node2.url || "mailto:" + raw2 === node2.url) && // And that starts w/ a protocol…
      /^[a-z][a-z+.-]+:/i.test(node2.url) && // And that doesn’t contain ASCII control codes (character escapes and
      // references don’t work), space, or angle brackets…
      !/[\0- <>\u007F]/.test(node2.url)
    );
  }
  link$1.peek = linkPeek;
  function link$1(node2, _2, state, info) {
    const quote = checkQuote(state);
    const suffix = quote === '"' ? "Quote" : "Apostrophe";
    const tracker = state.createTracker(info);
    let exit2;
    let subexit;
    if (formatLinkAsAutolink(node2, state)) {
      const stack = state.stack;
      state.stack = [];
      exit2 = state.enter("autolink");
      let value3 = tracker.move("<");
      value3 += tracker.move(
        state.containerPhrasing(node2, {
          before: value3,
          after: ">",
          ...tracker.current()
        })
      );
      value3 += tracker.move(">");
      exit2();
      state.stack = stack;
      return value3;
    }
    exit2 = state.enter("link");
    subexit = state.enter("label");
    let value2 = tracker.move("[");
    value2 += tracker.move(
      state.containerPhrasing(node2, {
        before: value2,
        after: "](",
        ...tracker.current()
      })
    );
    value2 += tracker.move("](");
    subexit();
    if (
      // If there’s no url but there is a title…
      !node2.url && node2.title || // If there are control characters or whitespace.
      /[\0- \u007F]/.test(node2.url)
    ) {
      subexit = state.enter("destinationLiteral");
      value2 += tracker.move("<");
      value2 += tracker.move(
        state.safe(node2.url, { before: value2, after: ">", ...tracker.current() })
      );
      value2 += tracker.move(">");
    } else {
      subexit = state.enter("destinationRaw");
      value2 += tracker.move(
        state.safe(node2.url, {
          before: value2,
          after: node2.title ? " " : ")",
          ...tracker.current()
        })
      );
    }
    subexit();
    if (node2.title) {
      subexit = state.enter(`title${suffix}`);
      value2 += tracker.move(" " + quote);
      value2 += tracker.move(
        state.safe(node2.title, {
          before: value2,
          after: quote,
          ...tracker.current()
        })
      );
      value2 += tracker.move(quote);
      subexit();
    }
    value2 += tracker.move(")");
    exit2();
    return value2;
  }
  function linkPeek(node2, _2, state) {
    return formatLinkAsAutolink(node2, state) ? "<" : "[";
  }
  linkReference$1.peek = linkReferencePeek;
  function linkReference$1(node2, _2, state, info) {
    const type = node2.referenceType;
    const exit2 = state.enter("linkReference");
    let subexit = state.enter("label");
    const tracker = state.createTracker(info);
    let value2 = tracker.move("[");
    const text2 = state.containerPhrasing(node2, {
      before: value2,
      after: "]",
      ...tracker.current()
    });
    value2 += tracker.move(text2 + "][");
    subexit();
    const stack = state.stack;
    state.stack = [];
    subexit = state.enter("reference");
    const reference = state.safe(state.associationId(node2), {
      before: value2,
      after: "]",
      ...tracker.current()
    });
    subexit();
    state.stack = stack;
    exit2();
    if (type === "full" || !text2 || text2 !== reference) {
      value2 += tracker.move(reference + "]");
    } else if (type === "shortcut") {
      value2 = value2.slice(0, -1);
    } else {
      value2 += tracker.move("]");
    }
    return value2;
  }
  function linkReferencePeek() {
    return "[";
  }
  function checkBullet(state) {
    const marker = state.options.bullet || "*";
    if (marker !== "*" && marker !== "+" && marker !== "-") {
      throw new Error(
        "Cannot serialize items with `" + marker + "` for `options.bullet`, expected `*`, `+`, or `-`"
      );
    }
    return marker;
  }
  function checkBulletOther(state) {
    const bullet = checkBullet(state);
    const bulletOther = state.options.bulletOther;
    if (!bulletOther) {
      return bullet === "*" ? "-" : "*";
    }
    if (bulletOther !== "*" && bulletOther !== "+" && bulletOther !== "-") {
      throw new Error(
        "Cannot serialize items with `" + bulletOther + "` for `options.bulletOther`, expected `*`, `+`, or `-`"
      );
    }
    if (bulletOther === bullet) {
      throw new Error(
        "Expected `bullet` (`" + bullet + "`) and `bulletOther` (`" + bulletOther + "`) to be different"
      );
    }
    return bulletOther;
  }
  function checkBulletOrdered(state) {
    const marker = state.options.bulletOrdered || ".";
    if (marker !== "." && marker !== ")") {
      throw new Error(
        "Cannot serialize items with `" + marker + "` for `options.bulletOrdered`, expected `.` or `)`"
      );
    }
    return marker;
  }
  function checkBulletOrderedOther(state) {
    const bulletOrdered = checkBulletOrdered(state);
    const bulletOrderedOther = state.options.bulletOrderedOther;
    if (!bulletOrderedOther) {
      return bulletOrdered === "." ? ")" : ".";
    }
    if (bulletOrderedOther !== "." && bulletOrderedOther !== ")") {
      throw new Error(
        "Cannot serialize items with `" + bulletOrderedOther + "` for `options.bulletOrderedOther`, expected `*`, `+`, or `-`"
      );
    }
    if (bulletOrderedOther === bulletOrdered) {
      throw new Error(
        "Expected `bulletOrdered` (`" + bulletOrdered + "`) and `bulletOrderedOther` (`" + bulletOrderedOther + "`) to be different"
      );
    }
    return bulletOrderedOther;
  }
  function checkRule(state) {
    const marker = state.options.rule || "*";
    if (marker !== "*" && marker !== "-" && marker !== "_") {
      throw new Error(
        "Cannot serialize rules with `" + marker + "` for `options.rule`, expected `*`, `-`, or `_`"
      );
    }
    return marker;
  }
  function list$1(node2, parent, state, info) {
    const exit2 = state.enter("list");
    const bulletCurrent = state.bulletCurrent;
    let bullet = node2.ordered ? checkBulletOrdered(state) : checkBullet(state);
    const bulletOther = node2.ordered ? checkBulletOrderedOther(state) : checkBulletOther(state);
    const bulletLastUsed = state.bulletLastUsed;
    let useDifferentMarker = false;
    if (parent && // Explicit `other` set.
    (node2.ordered ? state.options.bulletOrderedOther : state.options.bulletOther) && bulletLastUsed && bullet === bulletLastUsed) {
      useDifferentMarker = true;
    }
    if (!node2.ordered) {
      const firstListItem = node2.children ? node2.children[0] : void 0;
      if (
        // Bullet could be used as a thematic break marker:
        (bullet === "*" || bullet === "-") && // Empty first list item:
        firstListItem && (!firstListItem.children || !firstListItem.children[0]) && // Directly in two other list items:
        state.stack[state.stack.length - 1] === "list" && state.stack[state.stack.length - 2] === "listItem" && state.stack[state.stack.length - 3] === "list" && state.stack[state.stack.length - 4] === "listItem" && // That are each the first child.
        state.indexStack[state.indexStack.length - 1] === 0 && state.indexStack[state.indexStack.length - 2] === 0 && state.indexStack[state.indexStack.length - 3] === 0
      ) {
        useDifferentMarker = true;
      }
      if (checkRule(state) === bullet && firstListItem) {
        let index2 = -1;
        while (++index2 < node2.children.length) {
          const item = node2.children[index2];
          if (item && item.type === "listItem" && item.children && item.children[0] && item.children[0].type === "thematicBreak") {
            useDifferentMarker = true;
            break;
          }
        }
      }
    }
    if (useDifferentMarker) {
      bullet = bulletOther;
    }
    state.bulletCurrent = bullet;
    const value2 = state.containerFlow(node2, info);
    state.bulletLastUsed = bullet;
    state.bulletCurrent = bulletCurrent;
    exit2();
    return value2;
  }
  function checkListItemIndent(state) {
    const style2 = state.options.listItemIndent || "tab";
    if (style2 === 1 || style2 === "1") {
      return "one";
    }
    if (style2 !== "tab" && style2 !== "one" && style2 !== "mixed") {
      throw new Error(
        "Cannot serialize items with `" + style2 + "` for `options.listItemIndent`, expected `tab`, `one`, or `mixed`"
      );
    }
    return style2;
  }
  function listItem$1(node2, parent, state, info) {
    const listItemIndent = checkListItemIndent(state);
    let bullet = state.bulletCurrent || checkBullet(state);
    if (parent && parent.type === "list" && parent.ordered) {
      bullet = (typeof parent.start === "number" && parent.start > -1 ? parent.start : 1) + (state.options.incrementListMarker === false ? 0 : parent.children.indexOf(node2)) + bullet;
    }
    let size = bullet.length + 1;
    if (listItemIndent === "tab" || listItemIndent === "mixed" && (parent && parent.type === "list" && parent.spread || node2.spread)) {
      size = Math.ceil(size / 4) * 4;
    }
    const tracker = state.createTracker(info);
    tracker.move(bullet + " ".repeat(size - bullet.length));
    tracker.shift(size);
    const exit2 = state.enter("listItem");
    const value2 = state.indentLines(
      state.containerFlow(node2, tracker.current()),
      map2
    );
    exit2();
    return value2;
    function map2(line, index2, blank) {
      if (index2) {
        return (blank ? "" : " ".repeat(size)) + line;
      }
      return (blank ? bullet : bullet + " ".repeat(size - bullet.length)) + line;
    }
  }
  function paragraph$1(node2, _2, state, info) {
    const exit2 = state.enter("paragraph");
    const subexit = state.enter("phrasing");
    const value2 = state.containerPhrasing(node2, info);
    subexit();
    exit2();
    return value2;
  }
  const phrasing = (
    /** @type {AssertPredicatePhrasing} */
    convert([
      "break",
      "delete",
      "emphasis",
      "footnote",
      "footnoteReference",
      "image",
      "imageReference",
      "inlineCode",
      "link",
      "linkReference",
      "strong",
      "text"
    ])
  );
  function root$2(node2, _2, state, info) {
    const hasPhrasing = node2.children.some((d2) => phrasing(d2));
    const fn2 = hasPhrasing ? state.containerPhrasing : state.containerFlow;
    return fn2.call(state, node2, info);
  }
  function checkStrong(state) {
    const marker = state.options.strong || "*";
    if (marker !== "*" && marker !== "_") {
      throw new Error(
        "Cannot serialize strong with `" + marker + "` for `options.strong`, expected `*`, or `_`"
      );
    }
    return marker;
  }
  strong$1.peek = strongPeek;
  function strong$1(node2, _2, state, info) {
    const marker = checkStrong(state);
    const exit2 = state.enter("strong");
    const tracker = state.createTracker(info);
    let value2 = tracker.move(marker + marker);
    value2 += tracker.move(
      state.containerPhrasing(node2, {
        before: value2,
        after: marker,
        ...tracker.current()
      })
    );
    value2 += tracker.move(marker + marker);
    exit2();
    return value2;
  }
  function strongPeek(_2, _1, state) {
    return state.options.strong || "*";
  }
  function text$3(node2, _2, state, info) {
    return state.safe(node2.value, info);
  }
  function checkRuleRepetition(state) {
    const repetition = state.options.ruleRepetition || 3;
    if (repetition < 3) {
      throw new Error(
        "Cannot serialize rules with repetition `" + repetition + "` for `options.ruleRepetition`, expected `3` or more"
      );
    }
    return repetition;
  }
  function thematicBreak$1(_2, _1, state) {
    const value2 = (checkRule(state) + (state.options.ruleSpaces ? " " : "")).repeat(checkRuleRepetition(state));
    return state.options.ruleSpaces ? value2.slice(0, -1) : value2;
  }
  const handle$1 = {
    blockquote: blockquote$1,
    break: hardBreak$1,
    code: code$2,
    definition,
    emphasis: emphasis$1,
    hardBreak: hardBreak$1,
    heading: heading$1,
    html: html$5,
    image: image$2,
    imageReference: imageReference$1,
    inlineCode: inlineCode$1,
    link: link$1,
    linkReference: linkReference$1,
    list: list$1,
    listItem: listItem$1,
    paragraph: paragraph$1,
    root: root$2,
    strong: strong$1,
    text: text$3,
    thematicBreak: thematicBreak$1
  };
  const join = [joinDefaults];
  function joinDefaults(left, right, parent, state) {
    if (right.type === "code" && formatCodeAsIndented(right, state) && (left.type === "list" || left.type === right.type && formatCodeAsIndented(left, state))) {
      return false;
    }
    if (left.type === "list" && left.type === right.type && Boolean(left.ordered) === Boolean(right.ordered) && !(left.ordered ? state.options.bulletOrderedOther : state.options.bulletOther)) {
      return false;
    }
    if ("spread" in parent && typeof parent.spread === "boolean") {
      if (left.type === "paragraph" && // Two paragraphs.
      (left.type === right.type || right.type === "definition" || // Paragraph followed by a setext heading.
      right.type === "heading" && formatHeadingAsSetext(right, state))) {
        return;
      }
      return parent.spread ? 1 : 0;
    }
  }
  const fullPhrasingSpans = [
    "autolink",
    "destinationLiteral",
    "destinationRaw",
    "reference",
    "titleQuote",
    "titleApostrophe"
  ];
  const unsafe = [
    { character: "	", after: "[\\r\\n]", inConstruct: "phrasing" },
    { character: "	", before: "[\\r\\n]", inConstruct: "phrasing" },
    {
      character: "	",
      inConstruct: ["codeFencedLangGraveAccent", "codeFencedLangTilde"]
    },
    {
      character: "\r",
      inConstruct: [
        "codeFencedLangGraveAccent",
        "codeFencedLangTilde",
        "codeFencedMetaGraveAccent",
        "codeFencedMetaTilde",
        "destinationLiteral",
        "headingAtx"
      ]
    },
    {
      character: "\n",
      inConstruct: [
        "codeFencedLangGraveAccent",
        "codeFencedLangTilde",
        "codeFencedMetaGraveAccent",
        "codeFencedMetaTilde",
        "destinationLiteral",
        "headingAtx"
      ]
    },
    { character: " ", after: "[\\r\\n]", inConstruct: "phrasing" },
    { character: " ", before: "[\\r\\n]", inConstruct: "phrasing" },
    {
      character: " ",
      inConstruct: ["codeFencedLangGraveAccent", "codeFencedLangTilde"]
    },
    // An exclamation mark can start an image, if it is followed by a link or
    // a link reference.
    {
      character: "!",
      after: "\\[",
      inConstruct: "phrasing",
      notInConstruct: fullPhrasingSpans
    },
    // A quote can break out of a title.
    { character: '"', inConstruct: "titleQuote" },
    // A number sign could start an ATX heading if it starts a line.
    { atBreak: true, character: "#" },
    { character: "#", inConstruct: "headingAtx", after: "(?:[\r\n]|$)" },
    // Dollar sign and percentage are not used in markdown.
    // An ampersand could start a character reference.
    { character: "&", after: "[#A-Za-z]", inConstruct: "phrasing" },
    // An apostrophe can break out of a title.
    { character: "'", inConstruct: "titleApostrophe" },
    // A left paren could break out of a destination raw.
    { character: "(", inConstruct: "destinationRaw" },
    // A left paren followed by `]` could make something into a link or image.
    {
      before: "\\]",
      character: "(",
      inConstruct: "phrasing",
      notInConstruct: fullPhrasingSpans
    },
    // A right paren could start a list item or break out of a destination
    // raw.
    { atBreak: true, before: "\\d+", character: ")" },
    { character: ")", inConstruct: "destinationRaw" },
    // An asterisk can start thematic breaks, list items, emphasis, strong.
    { atBreak: true, character: "*", after: "(?:[ 	\r\n*])" },
    { character: "*", inConstruct: "phrasing", notInConstruct: fullPhrasingSpans },
    // A plus sign could start a list item.
    { atBreak: true, character: "+", after: "(?:[ 	\r\n])" },
    // A dash can start thematic breaks, list items, and setext heading
    // underlines.
    { atBreak: true, character: "-", after: "(?:[ 	\r\n-])" },
    // A dot could start a list item.
    { atBreak: true, before: "\\d+", character: ".", after: "(?:[ 	\r\n]|$)" },
    // Slash, colon, and semicolon are not used in markdown for constructs.
    // A less than can start html (flow or text) or an autolink.
    // HTML could start with an exclamation mark (declaration, cdata, comment),
    // slash (closing tag), question mark (instruction), or a letter (tag).
    // An autolink also starts with a letter.
    // Finally, it could break out of a destination literal.
    { atBreak: true, character: "<", after: "[!/?A-Za-z]" },
    {
      character: "<",
      after: "[!/?A-Za-z]",
      inConstruct: "phrasing",
      notInConstruct: fullPhrasingSpans
    },
    { character: "<", inConstruct: "destinationLiteral" },
    // An equals to can start setext heading underlines.
    { atBreak: true, character: "=" },
    // A greater than can start block quotes and it can break out of a
    // destination literal.
    { atBreak: true, character: ">" },
    { character: ">", inConstruct: "destinationLiteral" },
    // Question mark and at sign are not used in markdown for constructs.
    // A left bracket can start definitions, references, labels,
    { atBreak: true, character: "[" },
    { character: "[", inConstruct: "phrasing", notInConstruct: fullPhrasingSpans },
    { character: "[", inConstruct: ["label", "reference"] },
    // A backslash can start an escape (when followed by punctuation) or a
    // hard break (when followed by an eol).
    // Note: typical escapes are handled in `safe`!
    { character: "\\", after: "[\\r\\n]", inConstruct: "phrasing" },
    // A right bracket can exit labels.
    { character: "]", inConstruct: ["label", "reference"] },
    // Caret is not used in markdown for constructs.
    // An underscore can start emphasis, strong, or a thematic break.
    { atBreak: true, character: "_" },
    { character: "_", inConstruct: "phrasing", notInConstruct: fullPhrasingSpans },
    // A grave accent can start code (fenced or text), or it can break out of
    // a grave accent code fence.
    { atBreak: true, character: "`" },
    {
      character: "`",
      inConstruct: ["codeFencedLangGraveAccent", "codeFencedMetaGraveAccent"]
    },
    { character: "`", inConstruct: "phrasing", notInConstruct: fullPhrasingSpans },
    // Left brace, vertical bar, right brace are not used in markdown for
    // constructs.
    // A tilde can start code (fenced).
    { atBreak: true, character: "~" }
  ];
  function association(node2) {
    if (node2.label || !node2.identifier) {
      return node2.label || "";
    }
    return decodeString(node2.identifier);
  }
  function containerPhrasing(parent, state, info) {
    const indexStack = state.indexStack;
    const children = parent.children || [];
    const results = [];
    let index2 = -1;
    let before = info.before;
    indexStack.push(-1);
    let tracker = state.createTracker(info);
    while (++index2 < children.length) {
      const child = children[index2];
      let after;
      indexStack[indexStack.length - 1] = index2;
      if (index2 + 1 < children.length) {
        let handle2 = state.handle.handlers[children[index2 + 1].type];
        if (handle2 && handle2.peek)
          handle2 = handle2.peek;
        after = handle2 ? handle2(children[index2 + 1], parent, state, {
          before: "",
          after: "",
          ...tracker.current()
        }).charAt(0) : "";
      } else {
        after = info.after;
      }
      if (results.length > 0 && (before === "\r" || before === "\n") && child.type === "html") {
        results[results.length - 1] = results[results.length - 1].replace(
          /(\r?\n|\r)$/,
          " "
        );
        before = " ";
        tracker = state.createTracker(info);
        tracker.move(results.join(""));
      }
      results.push(
        tracker.move(
          state.handle(child, parent, state, {
            ...tracker.current(),
            before,
            after
          })
        )
      );
      before = results[results.length - 1].slice(-1);
    }
    indexStack.pop();
    return results.join("");
  }
  function containerFlow(parent, state, info) {
    const indexStack = state.indexStack;
    const children = parent.children || [];
    const tracker = state.createTracker(info);
    const results = [];
    let index2 = -1;
    indexStack.push(-1);
    while (++index2 < children.length) {
      const child = children[index2];
      indexStack[indexStack.length - 1] = index2;
      results.push(
        tracker.move(
          state.handle(child, parent, state, {
            before: "\n",
            after: "\n",
            ...tracker.current()
          })
        )
      );
      if (child.type !== "list") {
        state.bulletLastUsed = void 0;
      }
      if (index2 < children.length - 1) {
        results.push(
          tracker.move(between(child, children[index2 + 1], parent, state))
        );
      }
    }
    indexStack.pop();
    return results.join("");
  }
  function between(left, right, parent, state) {
    let index2 = state.join.length;
    while (index2--) {
      const result = state.join[index2](left, right, parent, state);
      if (result === true || result === 1) {
        break;
      }
      if (typeof result === "number") {
        return "\n".repeat(1 + result);
      }
      if (result === false) {
        return "\n\n<!---->\n\n";
      }
    }
    return "\n\n";
  }
  const eol = /\r?\n|\r/g;
  function indentLines(value2, map2) {
    const result = [];
    let start = 0;
    let line = 0;
    let match;
    while (match = eol.exec(value2)) {
      one2(value2.slice(start, match.index));
      result.push(match[0]);
      start = match.index + match[0].length;
      line++;
    }
    one2(value2.slice(start));
    return result.join("");
    function one2(value3) {
      result.push(map2(value3, line, !value3));
    }
  }
  function safe(state, input, config) {
    const value2 = (config.before || "") + (input || "") + (config.after || "");
    const positions = [];
    const result = [];
    const infos = {};
    let index2 = -1;
    while (++index2 < state.unsafe.length) {
      const pattern = state.unsafe[index2];
      if (!patternInScope(state.stack, pattern)) {
        continue;
      }
      const expression = patternCompile(pattern);
      let match;
      while (match = expression.exec(value2)) {
        const before = "before" in pattern || Boolean(pattern.atBreak);
        const after = "after" in pattern;
        const position2 = match.index + (before ? match[1].length : 0);
        if (positions.includes(position2)) {
          if (infos[position2].before && !before) {
            infos[position2].before = false;
          }
          if (infos[position2].after && !after) {
            infos[position2].after = false;
          }
        } else {
          positions.push(position2);
          infos[position2] = { before, after };
        }
      }
    }
    positions.sort(numerical);
    let start = config.before ? config.before.length : 0;
    const end = value2.length - (config.after ? config.after.length : 0);
    index2 = -1;
    while (++index2 < positions.length) {
      const position2 = positions[index2];
      if (position2 < start || position2 >= end) {
        continue;
      }
      if (position2 + 1 < end && positions[index2 + 1] === position2 + 1 && infos[position2].after && !infos[position2 + 1].before && !infos[position2 + 1].after || positions[index2 - 1] === position2 - 1 && infos[position2].before && !infos[position2 - 1].before && !infos[position2 - 1].after) {
        continue;
      }
      if (start !== position2) {
        result.push(escapeBackslashes(value2.slice(start, position2), "\\"));
      }
      start = position2;
      if (/[!-/:-@[-`{-~]/.test(value2.charAt(position2)) && (!config.encode || !config.encode.includes(value2.charAt(position2)))) {
        result.push("\\");
      } else {
        result.push(
          "&#x" + value2.charCodeAt(position2).toString(16).toUpperCase() + ";"
        );
        start++;
      }
    }
    result.push(escapeBackslashes(value2.slice(start, end), config.after));
    return result.join("");
  }
  function numerical(a2, b2) {
    return a2 - b2;
  }
  function escapeBackslashes(value2, after) {
    const expression = /\\(?=[!-/:-@[-`{-~])/g;
    const positions = [];
    const results = [];
    const whole = value2 + after;
    let index2 = -1;
    let start = 0;
    let match;
    while (match = expression.exec(whole)) {
      positions.push(match.index);
    }
    while (++index2 < positions.length) {
      if (start !== positions[index2]) {
        results.push(value2.slice(start, positions[index2]));
      }
      results.push("\\");
      start = positions[index2];
    }
    results.push(value2.slice(start));
    return results.join("");
  }
  function track(config) {
    const options2 = config || {};
    const now = options2.now || {};
    let lineShift = options2.lineShift || 0;
    let line = now.line || 1;
    let column = now.column || 1;
    return { move, current, shift };
    function current() {
      return { now: { line, column }, lineShift };
    }
    function shift(value2) {
      lineShift += value2;
    }
    function move(input) {
      const value2 = input || "";
      const chunks = value2.split(/\r?\n|\r/g);
      const tail = chunks[chunks.length - 1];
      line += chunks.length - 1;
      column = chunks.length === 1 ? column + tail.length : 1 + tail.length + lineShift;
      return value2;
    }
  }
  function toMarkdown$1(tree, options2 = {}) {
    const state = {
      enter,
      indentLines,
      associationId: association,
      containerPhrasing: containerPhrasingBound,
      containerFlow: containerFlowBound,
      createTracker: track,
      safe: safeBound,
      stack: [],
      unsafe: [],
      join: [],
      // @ts-expect-error: we’ll fill it next.
      handlers: {},
      options: {},
      indexStack: [],
      // @ts-expect-error: we’ll add `handle` later.
      handle: void 0
    };
    configure(state, { unsafe, join, handlers: handle$1 });
    configure(state, options2);
    if (state.options.tightDefinitions) {
      configure(state, { join: [joinDefinition] });
    }
    state.handle = zwitch("type", {
      invalid: invalid$1,
      unknown: unknown$1,
      handlers: state.handlers
    });
    let result = state.handle(tree, void 0, state, {
      before: "\n",
      after: "\n",
      now: { line: 1, column: 1 },
      lineShift: 0
    });
    if (result && result.charCodeAt(result.length - 1) !== 10 && result.charCodeAt(result.length - 1) !== 13) {
      result += "\n";
    }
    return result;
    function enter(name) {
      state.stack.push(name);
      return exit2;
      function exit2() {
        state.stack.pop();
      }
    }
  }
  function invalid$1(value2) {
    throw new Error("Cannot handle value `" + value2 + "`, expected node");
  }
  function unknown$1(node2) {
    throw new Error("Cannot handle unknown node `" + node2.type + "`");
  }
  function joinDefinition(left, right) {
    if (left.type === "definition" && left.type === right.type) {
      return 0;
    }
  }
  function containerPhrasingBound(parent, info) {
    return containerPhrasing(parent, this, info);
  }
  function containerFlowBound(parent, info) {
    return containerFlow(parent, this, info);
  }
  function safeBound(value2, config) {
    return safe(this, value2, config);
  }
  var formatExports = {};
  var format = {
    get exports() {
      return formatExports;
    },
    set exports(v2) {
      formatExports = v2;
    }
  };
  (function(module) {
    (function() {
      var namespace;
      {
        namespace = module.exports = format2;
      }
      namespace.format = format2;
      namespace.vsprintf = vsprintf;
      if (typeof console !== "undefined" && typeof console.log === "function") {
        namespace.printf = printf;
      }
      function printf() {
        console.log(format2.apply(null, arguments));
      }
      function vsprintf(fmt, replacements) {
        return format2.apply(null, [fmt].concat(replacements));
      }
      function format2(fmt) {
        var argIndex = 1, args = [].slice.call(arguments), i2 = 0, n2 = fmt.length, result = "", c2, escaped = false, arg, tmp, leadingZero = false, precision, nextArg = function() {
          return args[argIndex++];
        }, slurpNumber = function() {
          var digits = "";
          while (/\d/.test(fmt[i2])) {
            digits += fmt[i2++];
            c2 = fmt[i2];
          }
          return digits.length > 0 ? parseInt(digits) : null;
        };
        for (; i2 < n2; ++i2) {
          c2 = fmt[i2];
          if (escaped) {
            escaped = false;
            if (c2 == ".") {
              leadingZero = false;
              c2 = fmt[++i2];
            } else if (c2 == "0" && fmt[i2 + 1] == ".") {
              leadingZero = true;
              i2 += 2;
              c2 = fmt[i2];
            } else {
              leadingZero = true;
            }
            precision = slurpNumber();
            switch (c2) {
              case "b":
                result += parseInt(nextArg(), 10).toString(2);
                break;
              case "c":
                arg = nextArg();
                if (typeof arg === "string" || arg instanceof String)
                  result += arg;
                else
                  result += String.fromCharCode(parseInt(arg, 10));
                break;
              case "d":
                result += parseInt(nextArg(), 10);
                break;
              case "f":
                tmp = String(parseFloat(nextArg()).toFixed(precision || 6));
                result += leadingZero ? tmp : tmp.replace(/^0/, "");
                break;
              case "j":
                result += JSON.stringify(nextArg());
                break;
              case "o":
                result += "0" + parseInt(nextArg(), 10).toString(8);
                break;
              case "s":
                result += nextArg();
                break;
              case "x":
                result += "0x" + parseInt(nextArg(), 10).toString(16);
                break;
              case "X":
                result += "0x" + parseInt(nextArg(), 10).toString(16).toUpperCase();
                break;
              default:
                result += c2;
                break;
            }
          } else if (c2 === "%") {
            escaped = true;
          } else {
            result += c2;
          }
        }
        return result;
      }
    })();
  })(format);
  const formatter = formatExports;
  const fault = Object.assign(create$1(Error), {
    eval: create$1(EvalError),
    range: create$1(RangeError),
    reference: create$1(ReferenceError),
    syntax: create$1(SyntaxError),
    type: create$1(TypeError),
    uri: create$1(URIError)
  });
  function create$1(Constructor) {
    FormattedError.displayName = Constructor.displayName || Constructor.name;
    return FormattedError;
    function FormattedError(format2, ...values) {
      const reason = format2 ? formatter(format2, ...values) : format2;
      return new Constructor(reason);
    }
  }
  const own$6 = {}.hasOwnProperty;
  const markers = {
    yaml: "-",
    toml: "+"
  };
  function matters(options2 = "yaml") {
    const results = [];
    let index2 = -1;
    if (!Array.isArray(options2)) {
      options2 = [options2];
    }
    while (++index2 < options2.length) {
      results[index2] = matter(options2[index2]);
    }
    return results;
  }
  function matter(option2) {
    let result = option2;
    if (typeof result === "string") {
      if (!own$6.call(markers, result)) {
        throw fault("Missing matter definition for `%s`", result);
      }
      result = {
        type: result,
        marker: markers[result]
      };
    } else if (typeof result !== "object") {
      throw fault("Expected matter to be an object, not `%j`", result);
    }
    if (!own$6.call(result, "type")) {
      throw fault("Missing `type` in matter `%j`", result);
    }
    if (!own$6.call(result, "fence") && !own$6.call(result, "marker")) {
      throw fault("Missing `marker` or `fence` in matter `%j`", result);
    }
    return result;
  }
  function frontmatterFromMarkdown(options2) {
    const settings = matters(options2);
    const enter = {};
    const exit2 = {};
    let index2 = -1;
    while (++index2 < settings.length) {
      const matter2 = settings[index2];
      enter[matter2.type] = opener(matter2);
      exit2[matter2.type] = close;
      exit2[matter2.type + "Value"] = value;
    }
    return { enter, exit: exit2 };
  }
  function opener(matter2) {
    return open;
    function open(token) {
      this.enter({ type: matter2.type, value: "" }, token);
      this.buffer();
    }
  }
  function close(token) {
    const data = this.resume();
    const node2 = (
      /** @type {Literal} */
      this.exit(token)
    );
    node2.value = data.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, "");
  }
  function value(token) {
    this.config.enter.data.call(this, token);
    this.config.exit.data.call(this, token);
  }
  function frontmatterToMarkdown(options2) {
    const unsafe2 = [];
    const handlers2 = {};
    const settings = matters(options2);
    let index2 = -1;
    while (++index2 < settings.length) {
      const matter2 = settings[index2];
      handlers2[matter2.type] = handler(matter2);
      unsafe2.push({ atBreak: true, character: fence$1(matter2, "open").charAt(0) });
    }
    return { unsafe: unsafe2, handlers: handlers2 };
  }
  function handler(matter2) {
    const open = fence$1(matter2, "open");
    const close2 = fence$1(matter2, "close");
    return handle2;
    function handle2(node2) {
      return open + (node2.value ? "\n" + node2.value : "") + "\n" + close2;
    }
  }
  function fence$1(matter2, prop) {
    return matter2.marker ? pick$1(matter2.marker, prop).repeat(3) : (
      // @ts-expect-error: They’re mutually exclusive.
      pick$1(matter2.fence, prop)
    );
  }
  function pick$1(schema, prop) {
    return typeof schema === "string" ? schema : schema[prop];
  }
  function frontmatter(options2) {
    const settings = matters(options2);
    const flow2 = {};
    let index2 = -1;
    while (++index2 < settings.length) {
      const matter2 = settings[index2];
      const code2 = fence(matter2, "open").charCodeAt(0);
      if (code2 in flow2) {
        flow2[code2].push(parse$1(matter2));
      } else {
        flow2[code2] = [parse$1(matter2)];
      }
    }
    return {
      flow: flow2
    };
  }
  function parse$1(matter2) {
    const name = matter2.type;
    const anywhere = matter2.anywhere;
    const valueType = name + "Value";
    const fenceType = name + "Fence";
    const sequenceType = fenceType + "Sequence";
    const fenceConstruct = {
      tokenize: tokenizeFence,
      partial: true
    };
    let buffer;
    return {
      tokenize: tokenizeFrontmatter,
      concrete: true
    };
    function tokenizeFrontmatter(effects, ok2, nok) {
      const self2 = this;
      return start;
      function start(code2) {
        const position2 = self2.now();
        if (position2.column !== 1 || !anywhere && position2.line !== 1) {
          return nok(code2);
        }
        effects.enter(name);
        buffer = fence(matter2, "open");
        return effects.attempt(fenceConstruct, afterOpeningFence, nok)(code2);
      }
      function afterOpeningFence(code2) {
        buffer = fence(matter2, "close");
        return lineEnd(code2);
      }
      function lineStart(code2) {
        if (code2 === null || markdownLineEnding(code2)) {
          return lineEnd(code2);
        }
        effects.enter(valueType);
        return lineData(code2);
      }
      function lineData(code2) {
        if (code2 === null || markdownLineEnding(code2)) {
          effects.exit(valueType);
          return lineEnd(code2);
        }
        effects.consume(code2);
        return lineData;
      }
      function lineEnd(code2) {
        if (code2 === null) {
          return nok(code2);
        }
        effects.enter("lineEnding");
        effects.consume(code2);
        effects.exit("lineEnding");
        return effects.attempt(fenceConstruct, after, lineStart);
      }
      function after(code2) {
        effects.exit(name);
        return ok2(code2);
      }
    }
    function tokenizeFence(effects, ok2, nok) {
      let bufferIndex = 0;
      return start;
      function start(code2) {
        if (code2 === buffer.charCodeAt(bufferIndex)) {
          effects.enter(fenceType);
          effects.enter(sequenceType);
          return insideSequence(code2);
        }
        return nok(code2);
      }
      function insideSequence(code2) {
        if (bufferIndex === buffer.length) {
          effects.exit(sequenceType);
          if (markdownSpace(code2)) {
            effects.enter("whitespace");
            return insideWhitespace(code2);
          }
          return fenceEnd(code2);
        }
        if (code2 === buffer.charCodeAt(bufferIndex++)) {
          effects.consume(code2);
          return insideSequence;
        }
        return nok(code2);
      }
      function insideWhitespace(code2) {
        if (markdownSpace(code2)) {
          effects.consume(code2);
          return insideWhitespace;
        }
        effects.exit("whitespace");
        return fenceEnd(code2);
      }
      function fenceEnd(code2) {
        if (code2 === null || markdownLineEnding(code2)) {
          effects.exit(fenceType);
          return ok2(code2);
        }
        return nok(code2);
      }
    }
  }
  function fence(matter2, prop) {
    return matter2.marker ? pick(matter2.marker, prop).repeat(3) : (
      // @ts-expect-error: They’re mutually exclusive.
      pick(matter2.fence, prop)
    );
  }
  function pick(schema, prop) {
    return typeof schema === "string" ? schema : schema[prop];
  }
  const www = {
    tokenize: tokenizeWww,
    partial: true
  };
  const domain = {
    tokenize: tokenizeDomain,
    partial: true
  };
  const path = {
    tokenize: tokenizePath,
    partial: true
  };
  const punctuation = {
    tokenize: tokenizePunctuation,
    partial: true
  };
  const namedCharacterReference = {
    tokenize: tokenizeNamedCharacterReference,
    partial: true
  };
  const wwwAutolink = {
    tokenize: tokenizeWwwAutolink,
    previous: previousWww
  };
  const httpAutolink = {
    tokenize: tokenizeHttpAutolink,
    previous: previousHttp
  };
  const emailAutolink = {
    tokenize: tokenizeEmailAutolink,
    previous: previousEmail
  };
  const text$2 = {};
  const gfmAutolinkLiteral = {
    text: text$2
  };
  let code$1 = 48;
  while (code$1 < 123) {
    text$2[code$1] = emailAutolink;
    code$1++;
    if (code$1 === 58)
      code$1 = 65;
    else if (code$1 === 91)
      code$1 = 97;
  }
  text$2[43] = emailAutolink;
  text$2[45] = emailAutolink;
  text$2[46] = emailAutolink;
  text$2[95] = emailAutolink;
  text$2[72] = [emailAutolink, httpAutolink];
  text$2[104] = [emailAutolink, httpAutolink];
  text$2[87] = [emailAutolink, wwwAutolink];
  text$2[119] = [emailAutolink, wwwAutolink];
  function tokenizeEmailAutolink(effects, ok2, nok) {
    const self2 = this;
    let hasDot;
    let hasDigitInLastSegment;
    return start;
    function start(code2) {
      if (!gfmAtext(code2) || !previousEmail(self2.previous) || previousUnbalanced(self2.events)) {
        return nok(code2);
      }
      effects.enter("literalAutolink");
      effects.enter("literalAutolinkEmail");
      return atext(code2);
    }
    function atext(code2) {
      if (gfmAtext(code2)) {
        effects.consume(code2);
        return atext;
      }
      if (code2 === 64) {
        effects.consume(code2);
        return label;
      }
      return nok(code2);
    }
    function label(code2) {
      if (code2 === 46) {
        return effects.check(punctuation, done, dotContinuation)(code2);
      }
      if (code2 === 45 || code2 === 95) {
        return effects.check(punctuation, nok, dashOrUnderscoreContinuation)(code2);
      }
      if (asciiAlphanumeric(code2)) {
        if (!hasDigitInLastSegment && asciiDigit(code2)) {
          hasDigitInLastSegment = true;
        }
        effects.consume(code2);
        return label;
      }
      return done(code2);
    }
    function dotContinuation(code2) {
      effects.consume(code2);
      hasDot = true;
      hasDigitInLastSegment = void 0;
      return label;
    }
    function dashOrUnderscoreContinuation(code2) {
      effects.consume(code2);
      return afterDashOrUnderscore;
    }
    function afterDashOrUnderscore(code2) {
      if (code2 === 46) {
        return effects.check(punctuation, nok, dotContinuation)(code2);
      }
      return label(code2);
    }
    function done(code2) {
      if (hasDot && !hasDigitInLastSegment) {
        effects.exit("literalAutolinkEmail");
        effects.exit("literalAutolink");
        return ok2(code2);
      }
      return nok(code2);
    }
  }
  function tokenizeWwwAutolink(effects, ok2, nok) {
    const self2 = this;
    return start;
    function start(code2) {
      if (code2 !== 87 && code2 !== 119 || !previousWww(self2.previous) || previousUnbalanced(self2.events)) {
        return nok(code2);
      }
      effects.enter("literalAutolink");
      effects.enter("literalAutolinkWww");
      return effects.check(
        www,
        effects.attempt(domain, effects.attempt(path, done), nok),
        nok
      )(code2);
    }
    function done(code2) {
      effects.exit("literalAutolinkWww");
      effects.exit("literalAutolink");
      return ok2(code2);
    }
  }
  function tokenizeHttpAutolink(effects, ok2, nok) {
    const self2 = this;
    return start;
    function start(code2) {
      if (code2 !== 72 && code2 !== 104 || !previousHttp(self2.previous) || previousUnbalanced(self2.events)) {
        return nok(code2);
      }
      effects.enter("literalAutolink");
      effects.enter("literalAutolinkHttp");
      effects.consume(code2);
      return t1;
    }
    function t1(code2) {
      if (code2 === 84 || code2 === 116) {
        effects.consume(code2);
        return t2;
      }
      return nok(code2);
    }
    function t2(code2) {
      if (code2 === 84 || code2 === 116) {
        effects.consume(code2);
        return p2;
      }
      return nok(code2);
    }
    function p2(code2) {
      if (code2 === 80 || code2 === 112) {
        effects.consume(code2);
        return s2;
      }
      return nok(code2);
    }
    function s2(code2) {
      if (code2 === 83 || code2 === 115) {
        effects.consume(code2);
        return colon;
      }
      return colon(code2);
    }
    function colon(code2) {
      if (code2 === 58) {
        effects.consume(code2);
        return slash1;
      }
      return nok(code2);
    }
    function slash1(code2) {
      if (code2 === 47) {
        effects.consume(code2);
        return slash2;
      }
      return nok(code2);
    }
    function slash2(code2) {
      if (code2 === 47) {
        effects.consume(code2);
        return after;
      }
      return nok(code2);
    }
    function after(code2) {
      return code2 === null || asciiControl(code2) || unicodeWhitespace(code2) || unicodePunctuation(code2) ? nok(code2) : effects.attempt(domain, effects.attempt(path, done), nok)(code2);
    }
    function done(code2) {
      effects.exit("literalAutolinkHttp");
      effects.exit("literalAutolink");
      return ok2(code2);
    }
  }
  function tokenizeWww(effects, ok2, nok) {
    return start;
    function start(code2) {
      effects.consume(code2);
      return w2;
    }
    function w2(code2) {
      if (code2 === 87 || code2 === 119) {
        effects.consume(code2);
        return w3;
      }
      return nok(code2);
    }
    function w3(code2) {
      if (code2 === 87 || code2 === 119) {
        effects.consume(code2);
        return dot;
      }
      return nok(code2);
    }
    function dot(code2) {
      if (code2 === 46) {
        effects.consume(code2);
        return after;
      }
      return nok(code2);
    }
    function after(code2) {
      return code2 === null || markdownLineEnding(code2) ? nok(code2) : ok2(code2);
    }
  }
  function tokenizeDomain(effects, ok2, nok) {
    let hasUnderscoreInLastSegment;
    let hasUnderscoreInLastLastSegment;
    return domain2;
    function domain2(code2) {
      if (code2 === 38) {
        return effects.check(
          namedCharacterReference,
          done,
          punctuationContinuation
        )(code2);
      }
      if (code2 === 46 || code2 === 95) {
        return effects.check(punctuation, done, punctuationContinuation)(code2);
      }
      if (code2 === null || asciiControl(code2) || unicodeWhitespace(code2) || code2 !== 45 && unicodePunctuation(code2)) {
        return done(code2);
      }
      effects.consume(code2);
      return domain2;
    }
    function punctuationContinuation(code2) {
      if (code2 === 46) {
        hasUnderscoreInLastLastSegment = hasUnderscoreInLastSegment;
        hasUnderscoreInLastSegment = void 0;
        effects.consume(code2);
        return domain2;
      }
      if (code2 === 95)
        hasUnderscoreInLastSegment = true;
      effects.consume(code2);
      return domain2;
    }
    function done(code2) {
      if (!hasUnderscoreInLastLastSegment && !hasUnderscoreInLastSegment) {
        return ok2(code2);
      }
      return nok(code2);
    }
  }
  function tokenizePath(effects, ok2) {
    let balance = 0;
    return inPath;
    function inPath(code2) {
      if (code2 === 38) {
        return effects.check(
          namedCharacterReference,
          ok2,
          continuedPunctuation
        )(code2);
      }
      if (code2 === 40) {
        balance++;
      }
      if (code2 === 41) {
        return effects.check(
          punctuation,
          parenAtPathEnd,
          continuedPunctuation
        )(code2);
      }
      if (pathEnd(code2)) {
        return ok2(code2);
      }
      if (trailingPunctuation(code2)) {
        return effects.check(punctuation, ok2, continuedPunctuation)(code2);
      }
      effects.consume(code2);
      return inPath;
    }
    function continuedPunctuation(code2) {
      effects.consume(code2);
      return inPath;
    }
    function parenAtPathEnd(code2) {
      balance--;
      return balance < 0 ? ok2(code2) : continuedPunctuation(code2);
    }
  }
  function tokenizeNamedCharacterReference(effects, ok2, nok) {
    return start;
    function start(code2) {
      effects.consume(code2);
      return inside;
    }
    function inside(code2) {
      if (asciiAlpha(code2)) {
        effects.consume(code2);
        return inside;
      }
      if (code2 === 59) {
        effects.consume(code2);
        return after;
      }
      return nok(code2);
    }
    function after(code2) {
      return pathEnd(code2) ? ok2(code2) : nok(code2);
    }
  }
  function tokenizePunctuation(effects, ok2, nok) {
    return start;
    function start(code2) {
      effects.consume(code2);
      return after;
    }
    function after(code2) {
      if (trailingPunctuation(code2)) {
        effects.consume(code2);
        return after;
      }
      return pathEnd(code2) ? ok2(code2) : nok(code2);
    }
  }
  function trailingPunctuation(code2) {
    return code2 === 33 || code2 === 34 || code2 === 39 || code2 === 41 || code2 === 42 || code2 === 44 || code2 === 46 || code2 === 58 || code2 === 59 || code2 === 60 || code2 === 63 || code2 === 95 || code2 === 126;
  }
  function pathEnd(code2) {
    return code2 === null || code2 === 60 || markdownLineEndingOrSpace(code2);
  }
  function gfmAtext(code2) {
    return code2 === 43 || code2 === 45 || code2 === 46 || code2 === 95 || asciiAlphanumeric(code2);
  }
  function previousWww(code2) {
    return code2 === null || code2 === 40 || code2 === 42 || code2 === 95 || code2 === 126 || markdownLineEndingOrSpace(code2);
  }
  function previousHttp(code2) {
    return code2 === null || !asciiAlpha(code2);
  }
  function previousEmail(code2) {
    return code2 !== 47 && previousHttp(code2);
  }
  function previousUnbalanced(events) {
    let index2 = events.length;
    let result = false;
    while (index2--) {
      const token = events[index2][1];
      if ((token.type === "labelLink" || token.type === "labelImage") && !token._balanced) {
        result = true;
        break;
      }
      if (token._gfmAutolinkLiteralWalkedInto) {
        result = false;
        break;
      }
    }
    if (events.length > 0 && !result) {
      events[events.length - 1][1]._gfmAutolinkLiteralWalkedInto = true;
    }
    return result;
  }
  function normalizeUri(value2) {
    const result = [];
    let index2 = -1;
    let start = 0;
    let skip = 0;
    while (++index2 < value2.length) {
      const code2 = value2.charCodeAt(index2);
      let replace2 = "";
      if (code2 === 37 && asciiAlphanumeric(value2.charCodeAt(index2 + 1)) && asciiAlphanumeric(value2.charCodeAt(index2 + 2))) {
        skip = 2;
      } else if (code2 < 128) {
        if (!/[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(code2))) {
          replace2 = String.fromCharCode(code2);
        }
      } else if (code2 > 55295 && code2 < 57344) {
        const next = value2.charCodeAt(index2 + 1);
        if (code2 < 56320 && next > 56319 && next < 57344) {
          replace2 = String.fromCharCode(code2, next);
          skip = 1;
        } else {
          replace2 = "�";
        }
      } else {
        replace2 = String.fromCharCode(code2);
      }
      if (replace2) {
        result.push(value2.slice(start, index2), encodeURIComponent(replace2));
        start = index2 + skip + 1;
        replace2 = "";
      }
      if (skip) {
        index2 += skip;
        skip = 0;
      }
    }
    return result.join("") + value2.slice(start);
  }
  const indent = {
    tokenize: tokenizeIndent,
    partial: true
  };
  function gfmFootnote() {
    return {
      document: {
        [91]: {
          tokenize: tokenizeDefinitionStart,
          continuation: {
            tokenize: tokenizeDefinitionContinuation
          },
          exit: gfmFootnoteDefinitionEnd
        }
      },
      text: {
        [91]: {
          tokenize: tokenizeGfmFootnoteCall
        },
        [93]: {
          add: "after",
          tokenize: tokenizePotentialGfmFootnoteCall,
          resolveTo: resolveToPotentialGfmFootnoteCall
        }
      }
    };
  }
  function tokenizePotentialGfmFootnoteCall(effects, ok2, nok) {
    const self2 = this;
    let index2 = self2.events.length;
    const defined = self2.parser.gfmFootnotes || (self2.parser.gfmFootnotes = []);
    let labelStart;
    while (index2--) {
      const token = self2.events[index2][1];
      if (token.type === "labelImage") {
        labelStart = token;
        break;
      }
      if (token.type === "gfmFootnoteCall" || token.type === "labelLink" || token.type === "label" || token.type === "image" || token.type === "link") {
        break;
      }
    }
    return start;
    function start(code2) {
      if (!labelStart || !labelStart._balanced) {
        return nok(code2);
      }
      const id = normalizeIdentifier(
        self2.sliceSerialize({
          start: labelStart.end,
          end: self2.now()
        })
      );
      if (id.charCodeAt(0) !== 94 || !defined.includes(id.slice(1))) {
        return nok(code2);
      }
      effects.enter("gfmFootnoteCallLabelMarker");
      effects.consume(code2);
      effects.exit("gfmFootnoteCallLabelMarker");
      return ok2(code2);
    }
  }
  function resolveToPotentialGfmFootnoteCall(events, context) {
    let index2 = events.length;
    while (index2--) {
      if (events[index2][1].type === "labelImage" && events[index2][0] === "enter") {
        events[index2][1];
        break;
      }
    }
    events[index2 + 1][1].type = "data";
    events[index2 + 3][1].type = "gfmFootnoteCallLabelMarker";
    const call = {
      type: "gfmFootnoteCall",
      start: Object.assign({}, events[index2 + 3][1].start),
      end: Object.assign({}, events[events.length - 1][1].end)
    };
    const marker = {
      type: "gfmFootnoteCallMarker",
      start: Object.assign({}, events[index2 + 3][1].end),
      end: Object.assign({}, events[index2 + 3][1].end)
    };
    marker.end.column++;
    marker.end.offset++;
    marker.end._bufferIndex++;
    const string2 = {
      type: "gfmFootnoteCallString",
      start: Object.assign({}, marker.end),
      end: Object.assign({}, events[events.length - 1][1].start)
    };
    const chunk = {
      type: "chunkString",
      contentType: "string",
      start: Object.assign({}, string2.start),
      end: Object.assign({}, string2.end)
    };
    const replacement = [
      // Take the `labelImageMarker` (now `data`, the `!`)
      events[index2 + 1],
      events[index2 + 2],
      ["enter", call, context],
      // The `[`
      events[index2 + 3],
      events[index2 + 4],
      // The `^`.
      ["enter", marker, context],
      ["exit", marker, context],
      // Everything in between.
      ["enter", string2, context],
      ["enter", chunk, context],
      ["exit", chunk, context],
      ["exit", string2, context],
      // The ending (`]`, properly parsed and labelled).
      events[events.length - 2],
      events[events.length - 1],
      ["exit", call, context]
    ];
    events.splice(index2, events.length - index2 + 1, ...replacement);
    return events;
  }
  function tokenizeGfmFootnoteCall(effects, ok2, nok) {
    const self2 = this;
    const defined = self2.parser.gfmFootnotes || (self2.parser.gfmFootnotes = []);
    let size = 0;
    let data;
    return start;
    function start(code2) {
      effects.enter("gfmFootnoteCall");
      effects.enter("gfmFootnoteCallLabelMarker");
      effects.consume(code2);
      effects.exit("gfmFootnoteCallLabelMarker");
      return callStart;
    }
    function callStart(code2) {
      if (code2 !== 94)
        return nok(code2);
      effects.enter("gfmFootnoteCallMarker");
      effects.consume(code2);
      effects.exit("gfmFootnoteCallMarker");
      effects.enter("gfmFootnoteCallString");
      effects.enter("chunkString").contentType = "string";
      return callData;
    }
    function callData(code2) {
      let token;
      if (code2 === null || code2 === 91 || size++ > 999) {
        return nok(code2);
      }
      if (code2 === 93) {
        if (!data) {
          return nok(code2);
        }
        effects.exit("chunkString");
        token = effects.exit("gfmFootnoteCallString");
        return defined.includes(normalizeIdentifier(self2.sliceSerialize(token))) ? end(code2) : nok(code2);
      }
      effects.consume(code2);
      if (!markdownLineEndingOrSpace(code2)) {
        data = true;
      }
      return code2 === 92 ? callEscape : callData;
    }
    function callEscape(code2) {
      if (code2 === 91 || code2 === 92 || code2 === 93) {
        effects.consume(code2);
        size++;
        return callData;
      }
      return callData(code2);
    }
    function end(code2) {
      effects.enter("gfmFootnoteCallLabelMarker");
      effects.consume(code2);
      effects.exit("gfmFootnoteCallLabelMarker");
      effects.exit("gfmFootnoteCall");
      return ok2;
    }
  }
  function tokenizeDefinitionStart(effects, ok2, nok) {
    const self2 = this;
    const defined = self2.parser.gfmFootnotes || (self2.parser.gfmFootnotes = []);
    let identifier;
    let size = 0;
    let data;
    return start;
    function start(code2) {
      effects.enter("gfmFootnoteDefinition")._container = true;
      effects.enter("gfmFootnoteDefinitionLabel");
      effects.enter("gfmFootnoteDefinitionLabelMarker");
      effects.consume(code2);
      effects.exit("gfmFootnoteDefinitionLabelMarker");
      return labelStart;
    }
    function labelStart(code2) {
      if (code2 === 94) {
        effects.enter("gfmFootnoteDefinitionMarker");
        effects.consume(code2);
        effects.exit("gfmFootnoteDefinitionMarker");
        effects.enter("gfmFootnoteDefinitionLabelString");
        return atBreak;
      }
      return nok(code2);
    }
    function atBreak(code2) {
      let token;
      if (code2 === null || code2 === 91 || size > 999) {
        return nok(code2);
      }
      if (code2 === 93) {
        if (!data) {
          return nok(code2);
        }
        token = effects.exit("gfmFootnoteDefinitionLabelString");
        identifier = normalizeIdentifier(self2.sliceSerialize(token));
        effects.enter("gfmFootnoteDefinitionLabelMarker");
        effects.consume(code2);
        effects.exit("gfmFootnoteDefinitionLabelMarker");
        effects.exit("gfmFootnoteDefinitionLabel");
        return labelAfter;
      }
      if (markdownLineEnding(code2)) {
        effects.enter("lineEnding");
        effects.consume(code2);
        effects.exit("lineEnding");
        size++;
        return atBreak;
      }
      effects.enter("chunkString").contentType = "string";
      return label(code2);
    }
    function label(code2) {
      if (code2 === null || markdownLineEnding(code2) || code2 === 91 || code2 === 93 || size > 999) {
        effects.exit("chunkString");
        return atBreak(code2);
      }
      if (!markdownLineEndingOrSpace(code2)) {
        data = true;
      }
      size++;
      effects.consume(code2);
      return code2 === 92 ? labelEscape : label;
    }
    function labelEscape(code2) {
      if (code2 === 91 || code2 === 92 || code2 === 93) {
        effects.consume(code2);
        size++;
        return label;
      }
      return label(code2);
    }
    function labelAfter(code2) {
      if (code2 === 58) {
        effects.enter("definitionMarker");
        effects.consume(code2);
        effects.exit("definitionMarker");
        return factorySpace(effects, done, "gfmFootnoteDefinitionWhitespace");
      }
      return nok(code2);
    }
    function done(code2) {
      if (!defined.includes(identifier)) {
        defined.push(identifier);
      }
      return ok2(code2);
    }
  }
  function tokenizeDefinitionContinuation(effects, ok2, nok) {
    return effects.check(blankLine, ok2, effects.attempt(indent, ok2, nok));
  }
  function gfmFootnoteDefinitionEnd(effects) {
    effects.exit("gfmFootnoteDefinition");
  }
  function tokenizeIndent(effects, ok2, nok) {
    const self2 = this;
    return factorySpace(
      effects,
      afterPrefix,
      "gfmFootnoteDefinitionIndent",
      4 + 1
    );
    function afterPrefix(code2) {
      const tail = self2.events[self2.events.length - 1];
      return tail && tail[1].type === "gfmFootnoteDefinitionIndent" && tail[2].sliceSerialize(tail[1], true).length === 4 ? ok2(code2) : nok(code2);
    }
  }
  function gfmStrikethrough(options2 = {}) {
    let single = options2.singleTilde;
    const tokenizer = {
      tokenize: tokenizeStrikethrough,
      resolveAll: resolveAllStrikethrough
    };
    if (single === null || single === void 0) {
      single = true;
    }
    return {
      text: {
        [126]: tokenizer
      },
      insideSpan: {
        null: [tokenizer]
      },
      attentionMarkers: {
        null: [126]
      }
    };
    function resolveAllStrikethrough(events, context) {
      let index2 = -1;
      while (++index2 < events.length) {
        if (events[index2][0] === "enter" && events[index2][1].type === "strikethroughSequenceTemporary" && events[index2][1]._close) {
          let open = index2;
          while (open--) {
            if (events[open][0] === "exit" && events[open][1].type === "strikethroughSequenceTemporary" && events[open][1]._open && // If the sizes are the same:
            events[index2][1].end.offset - events[index2][1].start.offset === events[open][1].end.offset - events[open][1].start.offset) {
              events[index2][1].type = "strikethroughSequence";
              events[open][1].type = "strikethroughSequence";
              const strikethrough2 = {
                type: "strikethrough",
                start: Object.assign({}, events[open][1].start),
                end: Object.assign({}, events[index2][1].end)
              };
              const text2 = {
                type: "strikethroughText",
                start: Object.assign({}, events[open][1].end),
                end: Object.assign({}, events[index2][1].start)
              };
              const nextEvents = [
                ["enter", strikethrough2, context],
                ["enter", events[open][1], context],
                ["exit", events[open][1], context],
                ["enter", text2, context]
              ];
              splice(
                nextEvents,
                nextEvents.length,
                0,
                resolveAll(
                  context.parser.constructs.insideSpan.null,
                  events.slice(open + 1, index2),
                  context
                )
              );
              splice(nextEvents, nextEvents.length, 0, [
                ["exit", text2, context],
                ["enter", events[index2][1], context],
                ["exit", events[index2][1], context],
                ["exit", strikethrough2, context]
              ]);
              splice(events, open - 1, index2 - open + 3, nextEvents);
              index2 = open + nextEvents.length - 2;
              break;
            }
          }
        }
      }
      index2 = -1;
      while (++index2 < events.length) {
        if (events[index2][1].type === "strikethroughSequenceTemporary") {
          events[index2][1].type = "data";
        }
      }
      return events;
    }
    function tokenizeStrikethrough(effects, ok2, nok) {
      const previous2 = this.previous;
      const events = this.events;
      let size = 0;
      return start;
      function start(code2) {
        if (previous2 === 126 && events[events.length - 1][1].type !== "characterEscape") {
          return nok(code2);
        }
        effects.enter("strikethroughSequenceTemporary");
        return more(code2);
      }
      function more(code2) {
        const before = classifyCharacter(previous2);
        if (code2 === 126) {
          if (size > 1)
            return nok(code2);
          effects.consume(code2);
          size++;
          return more;
        }
        if (size < 2 && !single)
          return nok(code2);
        const token = effects.exit("strikethroughSequenceTemporary");
        const after = classifyCharacter(code2);
        token._open = !after || after === 2 && Boolean(before);
        token._close = !before || before === 2 && Boolean(after);
        return ok2(code2);
      }
    }
  }
  const gfmTable = {
    flow: {
      null: {
        tokenize: tokenizeTable,
        resolve: resolveTable
      }
    }
  };
  const nextPrefixedOrBlank = {
    tokenize: tokenizeNextPrefixedOrBlank,
    partial: true
  };
  function resolveTable(events, context) {
    let index2 = -1;
    let inHead;
    let inDelimiterRow;
    let inRow;
    let contentStart;
    let contentEnd;
    let cellStart;
    let seenCellInRow;
    while (++index2 < events.length) {
      const token = events[index2][1];
      if (inRow) {
        if (token.type === "temporaryTableCellContent") {
          contentStart = contentStart || index2;
          contentEnd = index2;
        }
        if (
          // Combine separate content parts into one.
          (token.type === "tableCellDivider" || token.type === "tableRow") && contentEnd
        ) {
          const content2 = {
            type: "tableContent",
            start: events[contentStart][1].start,
            end: events[contentEnd][1].end
          };
          const text2 = {
            type: "chunkText",
            start: content2.start,
            end: content2.end,
            // @ts-expect-error It’s fine.
            contentType: "text"
          };
          events.splice(
            contentStart,
            contentEnd - contentStart + 1,
            ["enter", content2, context],
            ["enter", text2, context],
            ["exit", text2, context],
            ["exit", content2, context]
          );
          index2 -= contentEnd - contentStart - 3;
          contentStart = void 0;
          contentEnd = void 0;
        }
      }
      if (events[index2][0] === "exit" && cellStart !== void 0 && cellStart + (seenCellInRow ? 0 : 1) < index2 && (token.type === "tableCellDivider" || token.type === "tableRow" && (cellStart + 3 < index2 || events[cellStart][1].type !== "whitespace"))) {
        const cell = {
          type: inDelimiterRow ? "tableDelimiter" : inHead ? "tableHeader" : "tableData",
          start: events[cellStart][1].start,
          end: events[index2][1].end
        };
        events.splice(index2 + (token.type === "tableCellDivider" ? 1 : 0), 0, [
          "exit",
          cell,
          context
        ]);
        events.splice(cellStart, 0, ["enter", cell, context]);
        index2 += 2;
        cellStart = index2 + 1;
        seenCellInRow = true;
      }
      if (token.type === "tableRow") {
        inRow = events[index2][0] === "enter";
        if (inRow) {
          cellStart = index2 + 1;
          seenCellInRow = false;
        }
      }
      if (token.type === "tableDelimiterRow") {
        inDelimiterRow = events[index2][0] === "enter";
        if (inDelimiterRow) {
          cellStart = index2 + 1;
          seenCellInRow = false;
        }
      }
      if (token.type === "tableHead") {
        inHead = events[index2][0] === "enter";
      }
    }
    return events;
  }
  function tokenizeTable(effects, ok2, nok) {
    const self2 = this;
    const align = [];
    let tableHeaderCount = 0;
    let seenDelimiter;
    let hasDash;
    return start;
    function start(code2) {
      effects.enter("table")._align = align;
      effects.enter("tableHead");
      effects.enter("tableRow");
      if (code2 === 124) {
        return cellDividerHead(code2);
      }
      tableHeaderCount++;
      effects.enter("temporaryTableCellContent");
      return inCellContentHead(code2);
    }
    function cellDividerHead(code2) {
      effects.enter("tableCellDivider");
      effects.consume(code2);
      effects.exit("tableCellDivider");
      seenDelimiter = true;
      return cellBreakHead;
    }
    function cellBreakHead(code2) {
      if (code2 === null || markdownLineEnding(code2)) {
        return atRowEndHead(code2);
      }
      if (markdownSpace(code2)) {
        effects.enter("whitespace");
        effects.consume(code2);
        return inWhitespaceHead;
      }
      if (seenDelimiter) {
        seenDelimiter = void 0;
        tableHeaderCount++;
      }
      if (code2 === 124) {
        return cellDividerHead(code2);
      }
      effects.enter("temporaryTableCellContent");
      return inCellContentHead(code2);
    }
    function inWhitespaceHead(code2) {
      if (markdownSpace(code2)) {
        effects.consume(code2);
        return inWhitespaceHead;
      }
      effects.exit("whitespace");
      return cellBreakHead(code2);
    }
    function inCellContentHead(code2) {
      if (code2 === null || code2 === 124 || markdownLineEndingOrSpace(code2)) {
        effects.exit("temporaryTableCellContent");
        return cellBreakHead(code2);
      }
      effects.consume(code2);
      return code2 === 92 ? inCellContentEscapeHead : inCellContentHead;
    }
    function inCellContentEscapeHead(code2) {
      if (code2 === 92 || code2 === 124) {
        effects.consume(code2);
        return inCellContentHead;
      }
      return inCellContentHead(code2);
    }
    function atRowEndHead(code2) {
      if (code2 === null) {
        return nok(code2);
      }
      effects.exit("tableRow");
      effects.exit("tableHead");
      const originalInterrupt = self2.interrupt;
      self2.interrupt = true;
      return effects.attempt(
        {
          tokenize: tokenizeRowEnd,
          partial: true
        },
        function(code3) {
          self2.interrupt = originalInterrupt;
          effects.enter("tableDelimiterRow");
          return atDelimiterRowBreak(code3);
        },
        function(code3) {
          self2.interrupt = originalInterrupt;
          return nok(code3);
        }
      )(code2);
    }
    function atDelimiterRowBreak(code2) {
      if (code2 === null || markdownLineEnding(code2)) {
        return rowEndDelimiter(code2);
      }
      if (markdownSpace(code2)) {
        effects.enter("whitespace");
        effects.consume(code2);
        return inWhitespaceDelimiter;
      }
      if (code2 === 45) {
        effects.enter("tableDelimiterFiller");
        effects.consume(code2);
        hasDash = true;
        align.push("none");
        return inFillerDelimiter;
      }
      if (code2 === 58) {
        effects.enter("tableDelimiterAlignment");
        effects.consume(code2);
        effects.exit("tableDelimiterAlignment");
        align.push("left");
        return afterLeftAlignment;
      }
      if (code2 === 124) {
        effects.enter("tableCellDivider");
        effects.consume(code2);
        effects.exit("tableCellDivider");
        return atDelimiterRowBreak;
      }
      return nok(code2);
    }
    function inWhitespaceDelimiter(code2) {
      if (markdownSpace(code2)) {
        effects.consume(code2);
        return inWhitespaceDelimiter;
      }
      effects.exit("whitespace");
      return atDelimiterRowBreak(code2);
    }
    function inFillerDelimiter(code2) {
      if (code2 === 45) {
        effects.consume(code2);
        return inFillerDelimiter;
      }
      effects.exit("tableDelimiterFiller");
      if (code2 === 58) {
        effects.enter("tableDelimiterAlignment");
        effects.consume(code2);
        effects.exit("tableDelimiterAlignment");
        align[align.length - 1] = align[align.length - 1] === "left" ? "center" : "right";
        return afterRightAlignment;
      }
      return atDelimiterRowBreak(code2);
    }
    function afterLeftAlignment(code2) {
      if (code2 === 45) {
        effects.enter("tableDelimiterFiller");
        effects.consume(code2);
        hasDash = true;
        return inFillerDelimiter;
      }
      return nok(code2);
    }
    function afterRightAlignment(code2) {
      if (code2 === null || markdownLineEnding(code2)) {
        return rowEndDelimiter(code2);
      }
      if (markdownSpace(code2)) {
        effects.enter("whitespace");
        effects.consume(code2);
        return inWhitespaceDelimiter;
      }
      if (code2 === 124) {
        effects.enter("tableCellDivider");
        effects.consume(code2);
        effects.exit("tableCellDivider");
        return atDelimiterRowBreak;
      }
      return nok(code2);
    }
    function rowEndDelimiter(code2) {
      effects.exit("tableDelimiterRow");
      if (!hasDash || tableHeaderCount !== align.length) {
        return nok(code2);
      }
      if (code2 === null) {
        return tableClose(code2);
      }
      return effects.check(
        nextPrefixedOrBlank,
        tableClose,
        effects.attempt(
          {
            tokenize: tokenizeRowEnd,
            partial: true
          },
          factorySpace(effects, bodyStart, "linePrefix", 4),
          tableClose
        )
      )(code2);
    }
    function tableClose(code2) {
      effects.exit("table");
      return ok2(code2);
    }
    function bodyStart(code2) {
      effects.enter("tableBody");
      return rowStartBody(code2);
    }
    function rowStartBody(code2) {
      effects.enter("tableRow");
      if (code2 === 124) {
        return cellDividerBody(code2);
      }
      effects.enter("temporaryTableCellContent");
      return inCellContentBody(code2);
    }
    function cellDividerBody(code2) {
      effects.enter("tableCellDivider");
      effects.consume(code2);
      effects.exit("tableCellDivider");
      return cellBreakBody;
    }
    function cellBreakBody(code2) {
      if (code2 === null || markdownLineEnding(code2)) {
        return atRowEndBody(code2);
      }
      if (markdownSpace(code2)) {
        effects.enter("whitespace");
        effects.consume(code2);
        return inWhitespaceBody;
      }
      if (code2 === 124) {
        return cellDividerBody(code2);
      }
      effects.enter("temporaryTableCellContent");
      return inCellContentBody(code2);
    }
    function inWhitespaceBody(code2) {
      if (markdownSpace(code2)) {
        effects.consume(code2);
        return inWhitespaceBody;
      }
      effects.exit("whitespace");
      return cellBreakBody(code2);
    }
    function inCellContentBody(code2) {
      if (code2 === null || code2 === 124 || markdownLineEndingOrSpace(code2)) {
        effects.exit("temporaryTableCellContent");
        return cellBreakBody(code2);
      }
      effects.consume(code2);
      return code2 === 92 ? inCellContentEscapeBody : inCellContentBody;
    }
    function inCellContentEscapeBody(code2) {
      if (code2 === 92 || code2 === 124) {
        effects.consume(code2);
        return inCellContentBody;
      }
      return inCellContentBody(code2);
    }
    function atRowEndBody(code2) {
      effects.exit("tableRow");
      if (code2 === null) {
        return tableBodyClose(code2);
      }
      return effects.check(
        nextPrefixedOrBlank,
        tableBodyClose,
        effects.attempt(
          {
            tokenize: tokenizeRowEnd,
            partial: true
          },
          factorySpace(effects, rowStartBody, "linePrefix", 4),
          tableBodyClose
        )
      )(code2);
    }
    function tableBodyClose(code2) {
      effects.exit("tableBody");
      return tableClose(code2);
    }
    function tokenizeRowEnd(effects2, ok3, nok2) {
      return start2;
      function start2(code2) {
        effects2.enter("lineEnding");
        effects2.consume(code2);
        effects2.exit("lineEnding");
        return factorySpace(effects2, prefixed, "linePrefix");
      }
      function prefixed(code2) {
        if (self2.parser.lazy[self2.now().line] || code2 === null || markdownLineEnding(code2)) {
          return nok2(code2);
        }
        const tail = self2.events[self2.events.length - 1];
        if (!self2.parser.constructs.disable.null.includes("codeIndented") && tail && tail[1].type === "linePrefix" && tail[2].sliceSerialize(tail[1], true).length >= 4) {
          return nok2(code2);
        }
        self2._gfmTableDynamicInterruptHack = true;
        return effects2.check(
          self2.parser.constructs.flow,
          function(code3) {
            self2._gfmTableDynamicInterruptHack = false;
            return nok2(code3);
          },
          function(code3) {
            self2._gfmTableDynamicInterruptHack = false;
            return ok3(code3);
          }
        )(code2);
      }
    }
  }
  function tokenizeNextPrefixedOrBlank(effects, ok2, nok) {
    let size = 0;
    return start;
    function start(code2) {
      effects.enter("check");
      effects.consume(code2);
      return whitespace2;
    }
    function whitespace2(code2) {
      if (code2 === -1 || code2 === 32) {
        effects.consume(code2);
        size++;
        return size === 4 ? ok2 : whitespace2;
      }
      if (code2 === null || markdownLineEndingOrSpace(code2)) {
        return ok2(code2);
      }
      return nok(code2);
    }
  }
  const tasklistCheck = {
    tokenize: tokenizeTasklistCheck
  };
  const gfmTaskListItem = {
    text: {
      [91]: tasklistCheck
    }
  };
  function tokenizeTasklistCheck(effects, ok2, nok) {
    const self2 = this;
    return open;
    function open(code2) {
      if (
        // Exit if there’s stuff before.
        self2.previous !== null || // Exit if not in the first content that is the first child of a list
        // item.
        !self2._gfmTasklistFirstContentOfListItem
      ) {
        return nok(code2);
      }
      effects.enter("taskListCheck");
      effects.enter("taskListCheckMarker");
      effects.consume(code2);
      effects.exit("taskListCheckMarker");
      return inside;
    }
    function inside(code2) {
      if (markdownLineEndingOrSpace(code2)) {
        effects.enter("taskListCheckValueUnchecked");
        effects.consume(code2);
        effects.exit("taskListCheckValueUnchecked");
        return close2;
      }
      if (code2 === 88 || code2 === 120) {
        effects.enter("taskListCheckValueChecked");
        effects.consume(code2);
        effects.exit("taskListCheckValueChecked");
        return close2;
      }
      return nok(code2);
    }
    function close2(code2) {
      if (code2 === 93) {
        effects.enter("taskListCheckMarker");
        effects.consume(code2);
        effects.exit("taskListCheckMarker");
        effects.exit("taskListCheck");
        return effects.check(
          {
            tokenize: spaceThenNonSpace
          },
          ok2,
          nok
        );
      }
      return nok(code2);
    }
  }
  function spaceThenNonSpace(effects, ok2, nok) {
    const self2 = this;
    return factorySpace(effects, after, "whitespace");
    function after(code2) {
      const tail = self2.events[self2.events.length - 1];
      return (
        // We either found spaces…
        (tail && tail[1].type === "whitespace" || // …or it was followed by a line ending, in which case, there has to be
        // non-whitespace after that line ending, because otherwise we’d get an
        // EOF as the content is closed with blank lines.
        markdownLineEnding(code2)) && code2 !== null ? ok2(code2) : nok(code2)
      );
    }
  }
  function gfm(options2) {
    return combineExtensions([
      gfmAutolinkLiteral,
      gfmFootnote(),
      gfmStrikethrough(options2),
      gfmTable,
      gfmTaskListItem
    ]);
  }
  function ccount(value2, character) {
    const source = String(value2);
    if (typeof character !== "string") {
      throw new TypeError("Expected character");
    }
    let count = 0;
    let index2 = source.indexOf(character);
    while (index2 !== -1) {
      count++;
      index2 = source.indexOf(character, index2 + character.length);
    }
    return count;
  }
  function escapeStringRegexp(string2) {
    if (typeof string2 !== "string") {
      throw new TypeError("Expected a string");
    }
    return string2.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
  }
  const own$5 = {}.hasOwnProperty;
  const findAndReplace = (
    /**
     * @type {(
     *   (<Tree extends Node>(tree: Tree, find: Find, replace?: Replace | null | undefined, options?: Options | null | undefined) => Tree) &
     *   (<Tree extends Node>(tree: Tree, schema: FindAndReplaceSchema | FindAndReplaceList, options?: Options | null | undefined) => Tree)
     * )}
     **/
    /**
     * @template {Node} Tree
     * @param {Tree} tree
     * @param {Find | FindAndReplaceSchema | FindAndReplaceList} find
     * @param {Replace | Options | null | undefined} [replace]
     * @param {Options | null | undefined} [options]
     * @returns {Tree}
     */
    function(tree, find2, replace2, options2) {
      let settings;
      let schema;
      if (typeof find2 === "string" || find2 instanceof RegExp) {
        schema = [[find2, replace2]];
        settings = options2;
      } else {
        schema = find2;
        settings = replace2;
      }
      if (!settings) {
        settings = {};
      }
      const ignored = convert(settings.ignore || []);
      const pairs = toPairs(schema);
      let pairIndex = -1;
      while (++pairIndex < pairs.length) {
        visitParents(tree, "text", visitor);
      }
      return tree;
      function visitor(node2, parents) {
        let index2 = -1;
        let grandparent;
        while (++index2 < parents.length) {
          const parent = parents[index2];
          if (ignored(
            parent,
            // @ts-expect-error: TS doesn’t understand but it’s perfect.
            grandparent ? grandparent.children.indexOf(parent) : void 0,
            grandparent
          )) {
            return;
          }
          grandparent = parent;
        }
        if (grandparent) {
          return handler2(node2, parents);
        }
      }
      function handler2(node2, parents) {
        const parent = parents[parents.length - 1];
        const find3 = pairs[pairIndex][0];
        const replace3 = pairs[pairIndex][1];
        let start = 0;
        const index2 = parent.children.indexOf(node2);
        let change = false;
        let nodes = [];
        find3.lastIndex = 0;
        let match = find3.exec(node2.value);
        while (match) {
          const position2 = match.index;
          const matchObject = {
            index: match.index,
            input: match.input,
            // @ts-expect-error: stack is fine.
            stack: [...parents, node2]
          };
          let value2 = replace3(...match, matchObject);
          if (typeof value2 === "string") {
            value2 = value2.length > 0 ? { type: "text", value: value2 } : void 0;
          }
          if (value2 !== false) {
            if (start !== position2) {
              nodes.push({
                type: "text",
                value: node2.value.slice(start, position2)
              });
            }
            if (Array.isArray(value2)) {
              nodes.push(...value2);
            } else if (value2) {
              nodes.push(value2);
            }
            start = position2 + match[0].length;
            change = true;
          }
          if (!find3.global) {
            break;
          }
          match = find3.exec(node2.value);
        }
        if (change) {
          if (start < node2.value.length) {
            nodes.push({ type: "text", value: node2.value.slice(start) });
          }
          parent.children.splice(index2, 1, ...nodes);
        } else {
          nodes = [node2];
        }
        return index2 + nodes.length;
      }
    }
  );
  function toPairs(schema) {
    const result = [];
    if (typeof schema !== "object") {
      throw new TypeError("Expected array or object as schema");
    }
    if (Array.isArray(schema)) {
      let index2 = -1;
      while (++index2 < schema.length) {
        result.push([
          toExpression(schema[index2][0]),
          toFunction(schema[index2][1])
        ]);
      }
    } else {
      let key2;
      for (key2 in schema) {
        if (own$5.call(schema, key2)) {
          result.push([toExpression(key2), toFunction(schema[key2])]);
        }
      }
    }
    return result;
  }
  function toExpression(find2) {
    return typeof find2 === "string" ? new RegExp(escapeStringRegexp(find2), "g") : find2;
  }
  function toFunction(replace2) {
    return typeof replace2 === "function" ? replace2 : () => replace2;
  }
  const inConstruct = "phrasing";
  const notInConstruct = ["autolink", "link", "image", "label"];
  const gfmAutolinkLiteralFromMarkdown = {
    transforms: [transformGfmAutolinkLiterals],
    enter: {
      literalAutolink: enterLiteralAutolink,
      literalAutolinkEmail: enterLiteralAutolinkValue,
      literalAutolinkHttp: enterLiteralAutolinkValue,
      literalAutolinkWww: enterLiteralAutolinkValue
    },
    exit: {
      literalAutolink: exitLiteralAutolink,
      literalAutolinkEmail: exitLiteralAutolinkEmail,
      literalAutolinkHttp: exitLiteralAutolinkHttp,
      literalAutolinkWww: exitLiteralAutolinkWww
    }
  };
  const gfmAutolinkLiteralToMarkdown = {
    unsafe: [
      {
        character: "@",
        before: "[+\\-.\\w]",
        after: "[\\-.\\w]",
        inConstruct,
        notInConstruct
      },
      {
        character: ".",
        before: "[Ww]",
        after: "[\\-.\\w]",
        inConstruct,
        notInConstruct
      },
      { character: ":", before: "[ps]", after: "\\/", inConstruct, notInConstruct }
    ]
  };
  function enterLiteralAutolink(token) {
    this.enter({ type: "link", title: null, url: "", children: [] }, token);
  }
  function enterLiteralAutolinkValue(token) {
    this.config.enter.autolinkProtocol.call(this, token);
  }
  function exitLiteralAutolinkHttp(token) {
    this.config.exit.autolinkProtocol.call(this, token);
  }
  function exitLiteralAutolinkWww(token) {
    this.config.exit.data.call(this, token);
    const node2 = (
      /** @type {Link} */
      this.stack[this.stack.length - 1]
    );
    node2.url = "http://" + this.sliceSerialize(token);
  }
  function exitLiteralAutolinkEmail(token) {
    this.config.exit.autolinkEmail.call(this, token);
  }
  function exitLiteralAutolink(token) {
    this.exit(token);
  }
  function transformGfmAutolinkLiterals(tree) {
    findAndReplace(
      tree,
      [
        [/(https?:\/\/|www(?=\.))([-.\w]+)([^ \t\r\n]*)/gi, findUrl],
        [/([-.\w+]+)@([-\w]+(?:\.[-\w]+)+)/g, findEmail]
      ],
      { ignore: ["link", "linkReference"] }
    );
  }
  function findUrl(_2, protocol, domain2, path2, match) {
    let prefix = "";
    if (!previous(match)) {
      return false;
    }
    if (/^w/i.test(protocol)) {
      domain2 = protocol + domain2;
      protocol = "";
      prefix = "http://";
    }
    if (!isCorrectDomain(domain2)) {
      return false;
    }
    const parts = splitUrl(domain2 + path2);
    if (!parts[0])
      return false;
    const result = {
      type: "link",
      title: null,
      url: prefix + protocol + parts[0],
      children: [{ type: "text", value: protocol + parts[0] }]
    };
    if (parts[1]) {
      return [result, { type: "text", value: parts[1] }];
    }
    return result;
  }
  function findEmail(_2, atext, label, match) {
    if (
      // Not an expected previous character.
      !previous(match, true) || // Label ends in not allowed character.
      /[-\d_]$/.test(label)
    ) {
      return false;
    }
    return {
      type: "link",
      title: null,
      url: "mailto:" + atext + "@" + label,
      children: [{ type: "text", value: atext + "@" + label }]
    };
  }
  function isCorrectDomain(domain2) {
    const parts = domain2.split(".");
    if (parts.length < 2 || parts[parts.length - 1] && (/_/.test(parts[parts.length - 1]) || !/[a-zA-Z\d]/.test(parts[parts.length - 1])) || parts[parts.length - 2] && (/_/.test(parts[parts.length - 2]) || !/[a-zA-Z\d]/.test(parts[parts.length - 2]))) {
      return false;
    }
    return true;
  }
  function splitUrl(url) {
    const trailExec = /[!"&'),.:;<>?\]}]+$/.exec(url);
    if (!trailExec) {
      return [url, void 0];
    }
    url = url.slice(0, trailExec.index);
    let trail = trailExec[0];
    let closingParenIndex = trail.indexOf(")");
    const openingParens = ccount(url, "(");
    let closingParens = ccount(url, ")");
    while (closingParenIndex !== -1 && openingParens > closingParens) {
      url += trail.slice(0, closingParenIndex + 1);
      trail = trail.slice(closingParenIndex + 1);
      closingParenIndex = trail.indexOf(")");
      closingParens++;
    }
    return [url, trail];
  }
  function previous(match, email) {
    const code2 = match.input.charCodeAt(match.index - 1);
    return (match.index === 0 || unicodeWhitespace(code2) || unicodePunctuation(code2)) && (!email || code2 !== 47);
  }
  footnoteReference$1.peek = footnoteReferencePeek;
  function gfmFootnoteFromMarkdown() {
    return {
      enter: {
        gfmFootnoteDefinition: enterFootnoteDefinition,
        gfmFootnoteDefinitionLabelString: enterFootnoteDefinitionLabelString,
        gfmFootnoteCall: enterFootnoteCall,
        gfmFootnoteCallString: enterFootnoteCallString
      },
      exit: {
        gfmFootnoteDefinition: exitFootnoteDefinition,
        gfmFootnoteDefinitionLabelString: exitFootnoteDefinitionLabelString,
        gfmFootnoteCall: exitFootnoteCall,
        gfmFootnoteCallString: exitFootnoteCallString
      }
    };
  }
  function gfmFootnoteToMarkdown() {
    return {
      // This is on by default already.
      unsafe: [{ character: "[", inConstruct: ["phrasing", "label", "reference"] }],
      handlers: { footnoteDefinition, footnoteReference: footnoteReference$1 }
    };
  }
  function enterFootnoteDefinition(token) {
    this.enter(
      { type: "footnoteDefinition", identifier: "", label: "", children: [] },
      token
    );
  }
  function enterFootnoteDefinitionLabelString() {
    this.buffer();
  }
  function exitFootnoteDefinitionLabelString(token) {
    const label = this.resume();
    const node2 = (
      /** @type {FootnoteDefinition} */
      this.stack[this.stack.length - 1]
    );
    node2.label = label;
    node2.identifier = normalizeIdentifier(
      this.sliceSerialize(token)
    ).toLowerCase();
  }
  function exitFootnoteDefinition(token) {
    this.exit(token);
  }
  function enterFootnoteCall(token) {
    this.enter({ type: "footnoteReference", identifier: "", label: "" }, token);
  }
  function enterFootnoteCallString() {
    this.buffer();
  }
  function exitFootnoteCallString(token) {
    const label = this.resume();
    const node2 = (
      /** @type {FootnoteDefinition} */
      this.stack[this.stack.length - 1]
    );
    node2.label = label;
    node2.identifier = normalizeIdentifier(
      this.sliceSerialize(token)
    ).toLowerCase();
  }
  function exitFootnoteCall(token) {
    this.exit(token);
  }
  function footnoteReference$1(node2, _2, context, safeOptions) {
    const tracker = track(safeOptions);
    let value2 = tracker.move("[^");
    const exit2 = context.enter("footnoteReference");
    const subexit = context.enter("reference");
    value2 += tracker.move(
      safe(context, association(node2), {
        ...tracker.current(),
        before: value2,
        after: "]"
      })
    );
    subexit();
    exit2();
    value2 += tracker.move("]");
    return value2;
  }
  function footnoteReferencePeek() {
    return "[";
  }
  function footnoteDefinition(node2, _2, context, safeOptions) {
    const tracker = track(safeOptions);
    let value2 = tracker.move("[^");
    const exit2 = context.enter("footnoteDefinition");
    const subexit = context.enter("label");
    value2 += tracker.move(
      safe(context, association(node2), {
        ...tracker.current(),
        before: value2,
        after: "]"
      })
    );
    subexit();
    value2 += tracker.move(
      "]:" + (node2.children && node2.children.length > 0 ? " " : "")
    );
    tracker.shift(4);
    value2 += tracker.move(
      indentLines(containerFlow(node2, context, tracker.current()), map)
    );
    exit2();
    return value2;
  }
  function map(line, index2, blank) {
    if (index2 === 0) {
      return line;
    }
    return (blank ? "" : "    ") + line;
  }
  const constructsWithoutStrikethrough = [
    "autolink",
    "destinationLiteral",
    "destinationRaw",
    "reference",
    "titleQuote",
    "titleApostrophe"
  ];
  handleDelete.peek = peekDelete;
  const gfmStrikethroughFromMarkdown = {
    canContainEols: ["delete"],
    enter: { strikethrough: enterStrikethrough },
    exit: { strikethrough: exitStrikethrough }
  };
  const gfmStrikethroughToMarkdown = {
    unsafe: [
      {
        character: "~",
        inConstruct: "phrasing",
        notInConstruct: constructsWithoutStrikethrough
      }
    ],
    handlers: { delete: handleDelete }
  };
  function enterStrikethrough(token) {
    this.enter({ type: "delete", children: [] }, token);
  }
  function exitStrikethrough(token) {
    this.exit(token);
  }
  function handleDelete(node2, _2, context, safeOptions) {
    const tracker = track(safeOptions);
    const exit2 = context.enter("strikethrough");
    let value2 = tracker.move("~~");
    value2 += containerPhrasing(node2, context, {
      ...tracker.current(),
      before: value2,
      after: "~"
    });
    value2 += tracker.move("~~");
    exit2();
    return value2;
  }
  function peekDelete() {
    return "~";
  }
  function markdownTable(table2, options2 = {}) {
    const align = (options2.align || []).concat();
    const stringLength = options2.stringLength || defaultStringLength;
    const alignments = [];
    const cellMatrix = [];
    const sizeMatrix = [];
    const longestCellByColumn = [];
    let mostCellsPerRow = 0;
    let rowIndex = -1;
    while (++rowIndex < table2.length) {
      const row2 = [];
      const sizes2 = [];
      let columnIndex2 = -1;
      if (table2[rowIndex].length > mostCellsPerRow) {
        mostCellsPerRow = table2[rowIndex].length;
      }
      while (++columnIndex2 < table2[rowIndex].length) {
        const cell = serialize(table2[rowIndex][columnIndex2]);
        if (options2.alignDelimiters !== false) {
          const size = stringLength(cell);
          sizes2[columnIndex2] = size;
          if (longestCellByColumn[columnIndex2] === void 0 || size > longestCellByColumn[columnIndex2]) {
            longestCellByColumn[columnIndex2] = size;
          }
        }
        row2.push(cell);
      }
      cellMatrix[rowIndex] = row2;
      sizeMatrix[rowIndex] = sizes2;
    }
    let columnIndex = -1;
    if (typeof align === "object" && "length" in align) {
      while (++columnIndex < mostCellsPerRow) {
        alignments[columnIndex] = toAlignment(align[columnIndex]);
      }
    } else {
      const code2 = toAlignment(align);
      while (++columnIndex < mostCellsPerRow) {
        alignments[columnIndex] = code2;
      }
    }
    columnIndex = -1;
    const row = [];
    const sizes = [];
    while (++columnIndex < mostCellsPerRow) {
      const code2 = alignments[columnIndex];
      let before = "";
      let after = "";
      if (code2 === 99) {
        before = ":";
        after = ":";
      } else if (code2 === 108) {
        before = ":";
      } else if (code2 === 114) {
        after = ":";
      }
      let size = options2.alignDelimiters === false ? 1 : Math.max(
        1,
        longestCellByColumn[columnIndex] - before.length - after.length
      );
      const cell = before + "-".repeat(size) + after;
      if (options2.alignDelimiters !== false) {
        size = before.length + size + after.length;
        if (size > longestCellByColumn[columnIndex]) {
          longestCellByColumn[columnIndex] = size;
        }
        sizes[columnIndex] = size;
      }
      row[columnIndex] = cell;
    }
    cellMatrix.splice(1, 0, row);
    sizeMatrix.splice(1, 0, sizes);
    rowIndex = -1;
    const lines = [];
    while (++rowIndex < cellMatrix.length) {
      const row2 = cellMatrix[rowIndex];
      const sizes2 = sizeMatrix[rowIndex];
      columnIndex = -1;
      const line = [];
      while (++columnIndex < mostCellsPerRow) {
        const cell = row2[columnIndex] || "";
        let before = "";
        let after = "";
        if (options2.alignDelimiters !== false) {
          const size = longestCellByColumn[columnIndex] - (sizes2[columnIndex] || 0);
          const code2 = alignments[columnIndex];
          if (code2 === 114) {
            before = " ".repeat(size);
          } else if (code2 === 99) {
            if (size % 2) {
              before = " ".repeat(size / 2 + 0.5);
              after = " ".repeat(size / 2 - 0.5);
            } else {
              before = " ".repeat(size / 2);
              after = before;
            }
          } else {
            after = " ".repeat(size);
          }
        }
        if (options2.delimiterStart !== false && !columnIndex) {
          line.push("|");
        }
        if (options2.padding !== false && // Don’t add the opening space if we’re not aligning and the cell is
        // empty: there will be a closing space.
        !(options2.alignDelimiters === false && cell === "") && (options2.delimiterStart !== false || columnIndex)) {
          line.push(" ");
        }
        if (options2.alignDelimiters !== false) {
          line.push(before);
        }
        line.push(cell);
        if (options2.alignDelimiters !== false) {
          line.push(after);
        }
        if (options2.padding !== false) {
          line.push(" ");
        }
        if (options2.delimiterEnd !== false || columnIndex !== mostCellsPerRow - 1) {
          line.push("|");
        }
      }
      lines.push(
        options2.delimiterEnd === false ? line.join("").replace(/ +$/, "") : line.join("")
      );
    }
    return lines.join("\n");
  }
  function serialize(value2) {
    return value2 === null || value2 === void 0 ? "" : String(value2);
  }
  function defaultStringLength(value2) {
    return value2.length;
  }
  function toAlignment(value2) {
    const code2 = typeof value2 === "string" ? value2.codePointAt(0) : 0;
    return code2 === 67 || code2 === 99 ? 99 : code2 === 76 || code2 === 108 ? 108 : code2 === 82 || code2 === 114 ? 114 : 0;
  }
  const gfmTableFromMarkdown = {
    enter: {
      table: enterTable,
      tableData: enterCell,
      tableHeader: enterCell,
      tableRow: enterRow
    },
    exit: {
      codeText: exitCodeText,
      table: exitTable,
      tableData: exit,
      tableHeader: exit,
      tableRow: exit
    }
  };
  function enterTable(token) {
    const align = token._align;
    this.enter(
      {
        type: "table",
        align: align.map((d2) => d2 === "none" ? null : d2),
        children: []
      },
      token
    );
    this.setData("inTable", true);
  }
  function exitTable(token) {
    this.exit(token);
    this.setData("inTable");
  }
  function enterRow(token) {
    this.enter({ type: "tableRow", children: [] }, token);
  }
  function exit(token) {
    this.exit(token);
  }
  function enterCell(token) {
    this.enter({ type: "tableCell", children: [] }, token);
  }
  function exitCodeText(token) {
    let value2 = this.resume();
    if (this.getData("inTable")) {
      value2 = value2.replace(/\\([\\|])/g, replace);
    }
    const node2 = (
      /** @type {InlineCode} */
      this.stack[this.stack.length - 1]
    );
    node2.value = value2;
    this.exit(token);
  }
  function replace($0, $1) {
    return $1 === "|" ? $1 : $0;
  }
  function gfmTableToMarkdown(options2) {
    const settings = options2 || {};
    const padding = settings.tableCellPadding;
    const alignDelimiters = settings.tablePipeAlign;
    const stringLength = settings.stringLength;
    const around = padding ? " " : "|";
    return {
      unsafe: [
        { character: "\r", inConstruct: "tableCell" },
        { character: "\n", inConstruct: "tableCell" },
        // A pipe, when followed by a tab or space (padding), or a dash or colon
        // (unpadded delimiter row), could result in a table.
        { atBreak: true, character: "|", after: "[	 :-]" },
        // A pipe in a cell must be encoded.
        { character: "|", inConstruct: "tableCell" },
        // A colon must be followed by a dash, in which case it could start a
        // delimiter row.
        { atBreak: true, character: ":", after: "-" },
        // A delimiter row can also start with a dash, when followed by more
        // dashes, a colon, or a pipe.
        // This is a stricter version than the built in check for lists, thematic
        // breaks, and setex heading underlines though:
        // <https://github.com/syntax-tree/mdast-util-to-markdown/blob/51a2038/lib/unsafe.js#L57>
        { atBreak: true, character: "-", after: "[:|-]" }
      ],
      handlers: {
        table: handleTable,
        tableRow: handleTableRow,
        tableCell: handleTableCell,
        inlineCode: inlineCodeWithTable
      }
    };
    function handleTable(node2, _2, context, safeOptions) {
      return serializeData(
        handleTableAsData(node2, context, safeOptions),
        node2.align
      );
    }
    function handleTableRow(node2, _2, context, safeOptions) {
      const row = handleTableRowAsData(node2, context, safeOptions);
      const value2 = serializeData([row]);
      return value2.slice(0, value2.indexOf("\n"));
    }
    function handleTableCell(node2, _2, context, safeOptions) {
      const exit2 = context.enter("tableCell");
      const subexit = context.enter("phrasing");
      const value2 = containerPhrasing(node2, context, {
        ...safeOptions,
        before: around,
        after: around
      });
      subexit();
      exit2();
      return value2;
    }
    function serializeData(matrix2, align) {
      return markdownTable(matrix2, {
        align,
        // @ts-expect-error: `markdown-table` types should support `null`.
        alignDelimiters,
        // @ts-expect-error: `markdown-table` types should support `null`.
        padding,
        // @ts-expect-error: `markdown-table` types should support `null`.
        stringLength
      });
    }
    function handleTableAsData(node2, context, safeOptions) {
      const children = node2.children;
      let index2 = -1;
      const result = [];
      const subexit = context.enter("table");
      while (++index2 < children.length) {
        result[index2] = handleTableRowAsData(
          children[index2],
          context,
          safeOptions
        );
      }
      subexit();
      return result;
    }
    function handleTableRowAsData(node2, context, safeOptions) {
      const children = node2.children;
      let index2 = -1;
      const result = [];
      const subexit = context.enter("tableRow");
      while (++index2 < children.length) {
        result[index2] = handleTableCell(
          children[index2],
          node2,
          context,
          safeOptions
        );
      }
      subexit();
      return result;
    }
    function inlineCodeWithTable(node2, parent, context) {
      let value2 = inlineCode$1(node2, parent, context);
      if (context.stack.includes("tableCell")) {
        value2 = value2.replace(/\|/g, "\\$&");
      }
      return value2;
    }
  }
  const gfmTaskListItemFromMarkdown = {
    exit: {
      taskListCheckValueChecked: exitCheck,
      taskListCheckValueUnchecked: exitCheck,
      paragraph: exitParagraphWithTaskListItem
    }
  };
  const gfmTaskListItemToMarkdown = {
    unsafe: [{ atBreak: true, character: "-", after: "[:|-]" }],
    handlers: { listItem: listItemWithTaskListItem }
  };
  function exitCheck(token) {
    const node2 = (
      /** @type {ListItem} */
      this.stack[this.stack.length - 2]
    );
    node2.checked = token.type === "taskListCheckValueChecked";
  }
  function exitParagraphWithTaskListItem(token) {
    const parent = (
      /** @type {Parents} */
      this.stack[this.stack.length - 2]
    );
    if (parent && parent.type === "listItem" && typeof parent.checked === "boolean") {
      const node2 = (
        /** @type {Paragraph} */
        this.stack[this.stack.length - 1]
      );
      const head2 = node2.children[0];
      if (head2 && head2.type === "text") {
        const siblings2 = parent.children;
        let index2 = -1;
        let firstParaghraph;
        while (++index2 < siblings2.length) {
          const sibling = siblings2[index2];
          if (sibling.type === "paragraph") {
            firstParaghraph = sibling;
            break;
          }
        }
        if (firstParaghraph === node2) {
          head2.value = head2.value.slice(1);
          if (head2.value.length === 0) {
            node2.children.shift();
          } else if (node2.position && head2.position && typeof head2.position.start.offset === "number") {
            head2.position.start.column++;
            head2.position.start.offset++;
            node2.position.start = Object.assign({}, head2.position.start);
          }
        }
      }
    }
    this.exit(token);
  }
  function listItemWithTaskListItem(node2, parent, context, safeOptions) {
    const head2 = node2.children[0];
    const checkable = typeof node2.checked === "boolean" && head2 && head2.type === "paragraph";
    const checkbox = "[" + (node2.checked ? "x" : " ") + "] ";
    const tracker = track(safeOptions);
    if (checkable) {
      tracker.move(checkbox);
    }
    let value2 = listItem$1(node2, parent, context, {
      ...safeOptions,
      ...tracker.current()
    });
    if (checkable) {
      value2 = value2.replace(/^(?:[*+-]|\d+\.)([\r\n]| {1,3})/, check);
    }
    return value2;
    function check($0) {
      return $0 + checkbox;
    }
  }
  function gfmFromMarkdown() {
    return [
      gfmAutolinkLiteralFromMarkdown,
      gfmFootnoteFromMarkdown(),
      gfmStrikethroughFromMarkdown,
      gfmTableFromMarkdown,
      gfmTaskListItemFromMarkdown
    ];
  }
  function gfmToMarkdown(options2) {
    return {
      extensions: [
        gfmAutolinkLiteralToMarkdown,
        gfmFootnoteToMarkdown(),
        gfmStrikethroughToMarkdown,
        gfmTableToMarkdown(options2),
        gfmTaskListItemToMarkdown
      ]
    };
  }
  function blockquote(state, node2) {
    const result = {
      type: "element",
      tagName: "blockquote",
      properties: {},
      children: state.wrap(state.all(node2), true)
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }
  function hardBreak(state, node2) {
    const result = { type: "element", tagName: "br", properties: {}, children: [] };
    state.patch(node2, result);
    return [state.applyData(node2, result), { type: "text", value: "\n" }];
  }
  function code(state, node2) {
    const value2 = node2.value ? node2.value + "\n" : "";
    const lang = node2.lang ? node2.lang.match(/^[^ \t]+(?=[ \t]|$)/) : null;
    const properties = {};
    if (lang) {
      properties.className = ["language-" + lang];
    }
    let result = {
      type: "element",
      tagName: "code",
      properties,
      children: [{ type: "text", value: value2 }]
    };
    if (node2.meta) {
      result.data = { meta: node2.meta };
    }
    state.patch(node2, result);
    result = state.applyData(node2, result);
    result = { type: "element", tagName: "pre", properties: {}, children: [result] };
    state.patch(node2, result);
    return result;
  }
  function strikethrough(state, node2) {
    const result = {
      type: "element",
      tagName: "del",
      properties: {},
      children: state.all(node2)
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }
  function emphasis(state, node2) {
    const result = {
      type: "element",
      tagName: "em",
      properties: {},
      children: state.all(node2)
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }
  function footnoteReference(state, node2) {
    const id = String(node2.identifier).toUpperCase();
    const safeId = normalizeUri(id.toLowerCase());
    const index2 = state.footnoteOrder.indexOf(id);
    let counter;
    if (index2 === -1) {
      state.footnoteOrder.push(id);
      state.footnoteCounts[id] = 1;
      counter = state.footnoteOrder.length;
    } else {
      state.footnoteCounts[id]++;
      counter = index2 + 1;
    }
    const reuseCounter = state.footnoteCounts[id];
    const link2 = {
      type: "element",
      tagName: "a",
      properties: {
        href: "#" + state.clobberPrefix + "fn-" + safeId,
        id: state.clobberPrefix + "fnref-" + safeId + (reuseCounter > 1 ? "-" + reuseCounter : ""),
        dataFootnoteRef: true,
        ariaDescribedBy: ["footnote-label"]
      },
      children: [{ type: "text", value: String(counter) }]
    };
    state.patch(node2, link2);
    const sup = {
      type: "element",
      tagName: "sup",
      properties: {},
      children: [link2]
    };
    state.patch(node2, sup);
    return state.applyData(node2, sup);
  }
  function footnote(state, node2) {
    const footnoteById = state.footnoteById;
    let no = 1;
    while (no in footnoteById)
      no++;
    const identifier = String(no);
    footnoteById[identifier] = {
      type: "footnoteDefinition",
      identifier,
      children: [{ type: "paragraph", children: node2.children }],
      position: node2.position
    };
    return footnoteReference(state, {
      type: "footnoteReference",
      identifier,
      position: node2.position
    });
  }
  function heading(state, node2) {
    const result = {
      type: "element",
      tagName: "h" + node2.depth,
      properties: {},
      children: state.all(node2)
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }
  function html$4(state, node2) {
    if (state.dangerous) {
      const result = { type: "raw", value: node2.value };
      state.patch(node2, result);
      return state.applyData(node2, result);
    }
    return null;
  }
  function revert(state, node2) {
    const subtype = node2.referenceType;
    let suffix = "]";
    if (subtype === "collapsed") {
      suffix += "[]";
    } else if (subtype === "full") {
      suffix += "[" + (node2.label || node2.identifier) + "]";
    }
    if (node2.type === "imageReference") {
      return { type: "text", value: "![" + node2.alt + suffix };
    }
    const contents = state.all(node2);
    const head2 = contents[0];
    if (head2 && head2.type === "text") {
      head2.value = "[" + head2.value;
    } else {
      contents.unshift({ type: "text", value: "[" });
    }
    const tail = contents[contents.length - 1];
    if (tail && tail.type === "text") {
      tail.value += suffix;
    } else {
      contents.push({ type: "text", value: suffix });
    }
    return contents;
  }
  function imageReference(state, node2) {
    const def = state.definition(node2.identifier);
    if (!def) {
      return revert(state, node2);
    }
    const properties = { src: normalizeUri(def.url || ""), alt: node2.alt };
    if (def.title !== null && def.title !== void 0) {
      properties.title = def.title;
    }
    const result = { type: "element", tagName: "img", properties, children: [] };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }
  function image$1(state, node2) {
    const properties = { src: normalizeUri(node2.url) };
    if (node2.alt !== null && node2.alt !== void 0) {
      properties.alt = node2.alt;
    }
    if (node2.title !== null && node2.title !== void 0) {
      properties.title = node2.title;
    }
    const result = { type: "element", tagName: "img", properties, children: [] };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }
  function inlineCode(state, node2) {
    const text2 = { type: "text", value: node2.value.replace(/\r?\n|\r/g, " ") };
    state.patch(node2, text2);
    const result = {
      type: "element",
      tagName: "code",
      properties: {},
      children: [text2]
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }
  function linkReference(state, node2) {
    const def = state.definition(node2.identifier);
    if (!def) {
      return revert(state, node2);
    }
    const properties = { href: normalizeUri(def.url || "") };
    if (def.title !== null && def.title !== void 0) {
      properties.title = def.title;
    }
    const result = {
      type: "element",
      tagName: "a",
      properties,
      children: state.all(node2)
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }
  function link(state, node2) {
    const properties = { href: normalizeUri(node2.url) };
    if (node2.title !== null && node2.title !== void 0) {
      properties.title = node2.title;
    }
    const result = {
      type: "element",
      tagName: "a",
      properties,
      children: state.all(node2)
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }
  function listItem(state, node2, parent) {
    const results = state.all(node2);
    const loose = parent ? listLoose(parent) : listItemLoose(node2);
    const properties = {};
    const children = [];
    if (typeof node2.checked === "boolean") {
      const head2 = results[0];
      let paragraph2;
      if (head2 && head2.type === "element" && head2.tagName === "p") {
        paragraph2 = head2;
      } else {
        paragraph2 = { type: "element", tagName: "p", properties: {}, children: [] };
        results.unshift(paragraph2);
      }
      if (paragraph2.children.length > 0) {
        paragraph2.children.unshift({ type: "text", value: " " });
      }
      paragraph2.children.unshift({
        type: "element",
        tagName: "input",
        properties: { type: "checkbox", checked: node2.checked, disabled: true },
        children: []
      });
      properties.className = ["task-list-item"];
    }
    let index2 = -1;
    while (++index2 < results.length) {
      const child = results[index2];
      if (loose || index2 !== 0 || child.type !== "element" || child.tagName !== "p") {
        children.push({ type: "text", value: "\n" });
      }
      if (child.type === "element" && child.tagName === "p" && !loose) {
        children.push(...child.children);
      } else {
        children.push(child);
      }
    }
    const tail = results[results.length - 1];
    if (tail && (loose || tail.type !== "element" || tail.tagName !== "p")) {
      children.push({ type: "text", value: "\n" });
    }
    const result = { type: "element", tagName: "li", properties, children };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }
  function listLoose(node2) {
    let loose = false;
    if (node2.type === "list") {
      loose = node2.spread || false;
      const children = node2.children;
      let index2 = -1;
      while (!loose && ++index2 < children.length) {
        loose = listItemLoose(children[index2]);
      }
    }
    return loose;
  }
  function listItemLoose(node2) {
    const spread = node2.spread;
    return spread === void 0 || spread === null ? node2.children.length > 1 : spread;
  }
  function list(state, node2) {
    const properties = {};
    const results = state.all(node2);
    let index2 = -1;
    if (typeof node2.start === "number" && node2.start !== 1) {
      properties.start = node2.start;
    }
    while (++index2 < results.length) {
      const child = results[index2];
      if (child.type === "element" && child.tagName === "li" && child.properties && Array.isArray(child.properties.className) && child.properties.className.includes("task-list-item")) {
        properties.className = ["contains-task-list"];
        break;
      }
    }
    const result = {
      type: "element",
      tagName: node2.ordered ? "ol" : "ul",
      properties,
      children: state.wrap(results, true)
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }
  function paragraph(state, node2) {
    const result = {
      type: "element",
      tagName: "p",
      properties: {},
      children: state.all(node2)
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }
  function root$1(state, node2) {
    const result = { type: "root", children: state.wrap(state.all(node2)) };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }
  function strong(state, node2) {
    const result = {
      type: "element",
      tagName: "strong",
      properties: {},
      children: state.all(node2)
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }
  const pointStart = point("start");
  const pointEnd = point("end");
  function position$1(node2) {
    return { start: pointStart(node2), end: pointEnd(node2) };
  }
  function point(type) {
    return point2;
    function point2(node2) {
      const point3 = node2 && node2.position && node2.position[type] || {};
      return {
        // @ts-expect-error: in practice, null is allowed.
        line: point3.line || null,
        // @ts-expect-error: in practice, null is allowed.
        column: point3.column || null,
        // @ts-expect-error: in practice, null is allowed.
        offset: point3.offset > -1 ? point3.offset : null
      };
    }
  }
  function table(state, node2) {
    const rows = state.all(node2);
    const firstRow = rows.shift();
    const tableContent = [];
    if (firstRow) {
      const head2 = {
        type: "element",
        tagName: "thead",
        properties: {},
        children: state.wrap([firstRow], true)
      };
      state.patch(node2.children[0], head2);
      tableContent.push(head2);
    }
    if (rows.length > 0) {
      const body2 = {
        type: "element",
        tagName: "tbody",
        properties: {},
        children: state.wrap(rows, true)
      };
      const start = pointStart(node2.children[1]);
      const end = pointEnd(node2.children[node2.children.length - 1]);
      if (start.line && end.line)
        body2.position = { start, end };
      tableContent.push(body2);
    }
    const result = {
      type: "element",
      tagName: "table",
      properties: {},
      children: state.wrap(tableContent, true)
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }
  function tableRow(state, node2, parent) {
    const siblings2 = parent ? parent.children : void 0;
    const rowIndex = siblings2 ? siblings2.indexOf(node2) : 1;
    const tagName = rowIndex === 0 ? "th" : "td";
    const align = parent && parent.type === "table" ? parent.align : void 0;
    const length = align ? align.length : node2.children.length;
    let cellIndex = -1;
    const cells2 = [];
    while (++cellIndex < length) {
      const cell = node2.children[cellIndex];
      const properties = {};
      const alignValue = align ? align[cellIndex] : void 0;
      if (alignValue) {
        properties.align = alignValue;
      }
      let result2 = { type: "element", tagName, properties, children: [] };
      if (cell) {
        result2.children = state.all(cell);
        state.patch(cell, result2);
        result2 = state.applyData(node2, result2);
      }
      cells2.push(result2);
    }
    const result = {
      type: "element",
      tagName: "tr",
      properties: {},
      children: state.wrap(cells2, true)
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }
  function tableCell(state, node2) {
    const result = {
      type: "element",
      tagName: "td",
      // Assume body cell.
      properties: {},
      children: state.all(node2)
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }
  const tab = 9;
  const space = 32;
  function trimLines(value2) {
    const source = String(value2);
    const search2 = /\r?\n|\r/g;
    let match = search2.exec(source);
    let last = 0;
    const lines = [];
    while (match) {
      lines.push(
        trimLine(source.slice(last, match.index), last > 0, true),
        match[0]
      );
      last = match.index + match[0].length;
      match = search2.exec(source);
    }
    lines.push(trimLine(source.slice(last), last > 0, false));
    return lines.join("");
  }
  function trimLine(value2, start, end) {
    let startIndex = 0;
    let endIndex = value2.length;
    if (start) {
      let code2 = value2.codePointAt(startIndex);
      while (code2 === tab || code2 === space) {
        startIndex++;
        code2 = value2.codePointAt(startIndex);
      }
    }
    if (end) {
      let code2 = value2.codePointAt(endIndex - 1);
      while (code2 === tab || code2 === space) {
        endIndex--;
        code2 = value2.codePointAt(endIndex - 1);
      }
    }
    return endIndex > startIndex ? value2.slice(startIndex, endIndex) : "";
  }
  function text$1(state, node2) {
    const result = { type: "text", value: trimLines(String(node2.value)) };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }
  function thematicBreak(state, node2) {
    const result = {
      type: "element",
      tagName: "hr",
      properties: {},
      children: []
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }
  const handlers = {
    blockquote,
    break: hardBreak,
    code,
    delete: strikethrough,
    emphasis,
    footnoteReference,
    footnote,
    heading,
    html: html$4,
    imageReference,
    image: image$1,
    inlineCode,
    linkReference,
    link,
    listItem,
    list,
    paragraph,
    root: root$1,
    strong,
    table,
    tableCell,
    tableRow,
    text: text$1,
    thematicBreak,
    toml: ignore,
    yaml: ignore,
    definition: ignore,
    footnoteDefinition: ignore
  };
  function ignore() {
    return null;
  }
  function generated(node2) {
    return !node2 || !node2.position || !node2.position.start || !node2.position.start.line || !node2.position.start.column || !node2.position.end || !node2.position.end.line || !node2.position.end.column;
  }
  const own$4 = {}.hasOwnProperty;
  function definitions(tree) {
    const cache = /* @__PURE__ */ Object.create(null);
    if (!tree || !tree.type) {
      throw new Error("mdast-util-definitions expected node");
    }
    visit(tree, "definition", (definition3) => {
      const id = clean(definition3.identifier);
      if (id && !own$4.call(cache, id)) {
        cache[id] = definition3;
      }
    });
    return definition2;
    function definition2(identifier) {
      const id = clean(identifier);
      return id && own$4.call(cache, id) ? cache[id] : null;
    }
  }
  function clean(value2) {
    return String(value2 || "").toUpperCase();
  }
  const own$3 = {}.hasOwnProperty;
  function createState(tree, options2) {
    const settings = options2 || {};
    const dangerous2 = settings.allowDangerousHtml || false;
    const footnoteById = {};
    state.dangerous = dangerous2;
    state.clobberPrefix = settings.clobberPrefix === void 0 || settings.clobberPrefix === null ? "user-content-" : settings.clobberPrefix;
    state.footnoteLabel = settings.footnoteLabel || "Footnotes";
    state.footnoteLabelTagName = settings.footnoteLabelTagName || "h2";
    state.footnoteLabelProperties = settings.footnoteLabelProperties || {
      className: ["sr-only"]
    };
    state.footnoteBackLabel = settings.footnoteBackLabel || "Back to content";
    state.unknownHandler = settings.unknownHandler;
    state.passThrough = settings.passThrough;
    state.handlers = { ...handlers, ...settings.handlers };
    state.definition = definitions(tree);
    state.footnoteById = footnoteById;
    state.footnoteOrder = [];
    state.footnoteCounts = {};
    state.patch = patch;
    state.applyData = applyData;
    state.one = oneBound;
    state.all = allBound;
    state.wrap = wrap;
    state.augment = augment;
    visit(tree, "footnoteDefinition", (definition2) => {
      const id = String(definition2.identifier).toUpperCase();
      if (!own$3.call(footnoteById, id)) {
        footnoteById[id] = definition2;
      }
    });
    return state;
    function augment(left, right) {
      if (left && "data" in left && left.data) {
        const data = left.data;
        if (data.hName) {
          if (right.type !== "element") {
            right = {
              type: "element",
              tagName: "",
              properties: {},
              children: []
            };
          }
          right.tagName = data.hName;
        }
        if (right.type === "element" && data.hProperties) {
          right.properties = { ...right.properties, ...data.hProperties };
        }
        if ("children" in right && right.children && data.hChildren) {
          right.children = data.hChildren;
        }
      }
      if (left) {
        const ctx = "type" in left ? left : { position: left };
        if (!generated(ctx)) {
          right.position = { start: pointStart(ctx), end: pointEnd(ctx) };
        }
      }
      return right;
    }
    function state(node2, tagName, props, children) {
      if (Array.isArray(props)) {
        children = props;
        props = {};
      }
      return augment(node2, {
        type: "element",
        tagName,
        properties: props || {},
        children: children || []
      });
    }
    function oneBound(node2, parent) {
      return one$1(state, node2, parent);
    }
    function allBound(parent) {
      return all$1(state, parent);
    }
  }
  function patch(from, to) {
    if (from.position)
      to.position = position$1(from);
  }
  function applyData(from, to) {
    let result = to;
    if (from && from.data) {
      const hName = from.data.hName;
      const hChildren = from.data.hChildren;
      const hProperties = from.data.hProperties;
      if (typeof hName === "string") {
        if (result.type === "element") {
          result.tagName = hName;
        } else {
          result = {
            type: "element",
            tagName: hName,
            properties: {},
            children: []
          };
        }
      }
      if (result.type === "element" && hProperties) {
        result.properties = { ...result.properties, ...hProperties };
      }
      if ("children" in result && result.children && hChildren !== null && hChildren !== void 0) {
        result.children = hChildren;
      }
    }
    return result;
  }
  function one$1(state, node2, parent) {
    const type = node2 && node2.type;
    if (!type) {
      throw new Error("Expected node, got `" + node2 + "`");
    }
    if (own$3.call(state.handlers, type)) {
      return state.handlers[type](state, node2, parent);
    }
    if (state.passThrough && state.passThrough.includes(type)) {
      return "children" in node2 ? { ...node2, children: all$1(state, node2) } : node2;
    }
    if (state.unknownHandler) {
      return state.unknownHandler(state, node2, parent);
    }
    return defaultUnknownHandler(state, node2);
  }
  function all$1(state, parent) {
    const values = [];
    if ("children" in parent) {
      const nodes = parent.children;
      let index2 = -1;
      while (++index2 < nodes.length) {
        const result = one$1(state, nodes[index2], parent);
        if (result) {
          if (index2 && nodes[index2 - 1].type === "break") {
            if (!Array.isArray(result) && result.type === "text") {
              result.value = result.value.replace(/^\s+/, "");
            }
            if (!Array.isArray(result) && result.type === "element") {
              const head2 = result.children[0];
              if (head2 && head2.type === "text") {
                head2.value = head2.value.replace(/^\s+/, "");
              }
            }
          }
          if (Array.isArray(result)) {
            values.push(...result);
          } else {
            values.push(result);
          }
        }
      }
    }
    return values;
  }
  function defaultUnknownHandler(state, node2) {
    const data = node2.data || {};
    const result = "value" in node2 && !(own$3.call(data, "hProperties") || own$3.call(data, "hChildren")) ? { type: "text", value: node2.value } : {
      type: "element",
      tagName: "div",
      properties: {},
      children: all$1(state, node2)
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }
  function wrap(nodes, loose) {
    const result = [];
    let index2 = -1;
    if (loose) {
      result.push({ type: "text", value: "\n" });
    }
    while (++index2 < nodes.length) {
      if (index2)
        result.push({ type: "text", value: "\n" });
      result.push(nodes[index2]);
    }
    if (loose && nodes.length > 0) {
      result.push({ type: "text", value: "\n" });
    }
    return result;
  }
  function footer(state) {
    const listItems = [];
    let index2 = -1;
    while (++index2 < state.footnoteOrder.length) {
      const def = state.footnoteById[state.footnoteOrder[index2]];
      if (!def) {
        continue;
      }
      const content2 = state.all(def);
      const id = String(def.identifier).toUpperCase();
      const safeId = normalizeUri(id.toLowerCase());
      let referenceIndex = 0;
      const backReferences = [];
      while (++referenceIndex <= state.footnoteCounts[id]) {
        const backReference = {
          type: "element",
          tagName: "a",
          properties: {
            href: "#" + state.clobberPrefix + "fnref-" + safeId + (referenceIndex > 1 ? "-" + referenceIndex : ""),
            dataFootnoteBackref: true,
            className: ["data-footnote-backref"],
            ariaLabel: state.footnoteBackLabel
          },
          children: [{ type: "text", value: "↩" }]
        };
        if (referenceIndex > 1) {
          backReference.children.push({
            type: "element",
            tagName: "sup",
            children: [{ type: "text", value: String(referenceIndex) }]
          });
        }
        if (backReferences.length > 0) {
          backReferences.push({ type: "text", value: " " });
        }
        backReferences.push(backReference);
      }
      const tail = content2[content2.length - 1];
      if (tail && tail.type === "element" && tail.tagName === "p") {
        const tailTail = tail.children[tail.children.length - 1];
        if (tailTail && tailTail.type === "text") {
          tailTail.value += " ";
        } else {
          tail.children.push({ type: "text", value: " " });
        }
        tail.children.push(...backReferences);
      } else {
        content2.push(...backReferences);
      }
      const listItem2 = {
        type: "element",
        tagName: "li",
        properties: { id: state.clobberPrefix + "fn-" + safeId },
        children: state.wrap(content2, true)
      };
      state.patch(def, listItem2);
      listItems.push(listItem2);
    }
    if (listItems.length === 0) {
      return;
    }
    return {
      type: "element",
      tagName: "section",
      properties: { dataFootnotes: true, className: ["footnotes"] },
      children: [
        {
          type: "element",
          tagName: state.footnoteLabelTagName,
          properties: {
            // To do: use structured clone.
            ...JSON.parse(JSON.stringify(state.footnoteLabelProperties)),
            id: "footnote-label"
          },
          children: [{ type: "text", value: state.footnoteLabel }]
        },
        { type: "text", value: "\n" },
        {
          type: "element",
          tagName: "ol",
          properties: {},
          children: state.wrap(listItems, true)
        },
        { type: "text", value: "\n" }
      ]
    };
  }
  function toHast(tree, options2) {
    const state = createState(tree, options2);
    const node2 = state.one(tree, null);
    const foot = footer(state);
    if (foot) {
      node2.children.push({ type: "text", value: "\n" }, foot);
    }
    return Array.isArray(node2) ? { type: "root", children: node2 } : node2;
  }
  class Schema {
    /**
     * @constructor
     * @param {Properties} property
     * @param {Normal} normal
     * @param {string} [space]
     */
    constructor(property, normal, space2) {
      this.property = property;
      this.normal = normal;
      if (space2) {
        this.space = space2;
      }
    }
  }
  Schema.prototype.property = {};
  Schema.prototype.normal = {};
  Schema.prototype.space = null;
  function merge(definitions2, space2) {
    const property = {};
    const normal = {};
    let index2 = -1;
    while (++index2 < definitions2.length) {
      Object.assign(property, definitions2[index2].property);
      Object.assign(normal, definitions2[index2].normal);
    }
    return new Schema(property, normal, space2);
  }
  function normalize(value2) {
    return value2.toLowerCase();
  }
  class Info {
    /**
     * @constructor
     * @param {string} property
     * @param {string} attribute
     */
    constructor(property, attribute) {
      this.property = property;
      this.attribute = attribute;
    }
  }
  Info.prototype.space = null;
  Info.prototype.boolean = false;
  Info.prototype.booleanish = false;
  Info.prototype.overloadedBoolean = false;
  Info.prototype.number = false;
  Info.prototype.commaSeparated = false;
  Info.prototype.spaceSeparated = false;
  Info.prototype.commaOrSpaceSeparated = false;
  Info.prototype.mustUseProperty = false;
  Info.prototype.defined = false;
  let powers = 0;
  const boolean = increment();
  const booleanish = increment();
  const overloadedBoolean = increment();
  const number = increment();
  const spaceSeparated = increment();
  const commaSeparated = increment();
  const commaOrSpaceSeparated = increment();
  function increment() {
    return 2 ** ++powers;
  }
  const types = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    boolean,
    booleanish,
    commaOrSpaceSeparated,
    commaSeparated,
    number,
    overloadedBoolean,
    spaceSeparated
  }, Symbol.toStringTag, { value: "Module" }));
  const checks = Object.keys(types);
  class DefinedInfo extends Info {
    /**
     * @constructor
     * @param {string} property
     * @param {string} attribute
     * @param {number|null} [mask]
     * @param {string} [space]
     */
    constructor(property, attribute, mask, space2) {
      let index2 = -1;
      super(property, attribute);
      mark(this, "space", space2);
      if (typeof mask === "number") {
        while (++index2 < checks.length) {
          const check = checks[index2];
          mark(this, checks[index2], (mask & types[check]) === types[check]);
        }
      }
    }
  }
  DefinedInfo.prototype.defined = true;
  function mark(values, key2, value2) {
    if (value2) {
      values[key2] = value2;
    }
  }
  const own$2 = {}.hasOwnProperty;
  function create(definition2) {
    const property = {};
    const normal = {};
    let prop;
    for (prop in definition2.properties) {
      if (own$2.call(definition2.properties, prop)) {
        const value2 = definition2.properties[prop];
        const info = new DefinedInfo(
          prop,
          definition2.transform(definition2.attributes || {}, prop),
          value2,
          definition2.space
        );
        if (definition2.mustUseProperty && definition2.mustUseProperty.includes(prop)) {
          info.mustUseProperty = true;
        }
        property[prop] = info;
        normal[normalize(prop)] = prop;
        normal[normalize(info.attribute)] = prop;
      }
    }
    return new Schema(property, normal, definition2.space);
  }
  const xlink = create({
    space: "xlink",
    transform(_2, prop) {
      return "xlink:" + prop.slice(5).toLowerCase();
    },
    properties: {
      xLinkActuate: null,
      xLinkArcRole: null,
      xLinkHref: null,
      xLinkRole: null,
      xLinkShow: null,
      xLinkTitle: null,
      xLinkType: null
    }
  });
  const xml = create({
    space: "xml",
    transform(_2, prop) {
      return "xml:" + prop.slice(3).toLowerCase();
    },
    properties: { xmlLang: null, xmlBase: null, xmlSpace: null }
  });
  function caseSensitiveTransform(attributes, attribute) {
    return attribute in attributes ? attributes[attribute] : attribute;
  }
  function caseInsensitiveTransform(attributes, property) {
    return caseSensitiveTransform(attributes, property.toLowerCase());
  }
  const xmlns = create({
    space: "xmlns",
    attributes: { xmlnsxlink: "xmlns:xlink" },
    transform: caseInsensitiveTransform,
    properties: { xmlns: null, xmlnsXLink: null }
  });
  const aria = create({
    transform(_2, prop) {
      return prop === "role" ? prop : "aria-" + prop.slice(4).toLowerCase();
    },
    properties: {
      ariaActiveDescendant: null,
      ariaAtomic: booleanish,
      ariaAutoComplete: null,
      ariaBusy: booleanish,
      ariaChecked: booleanish,
      ariaColCount: number,
      ariaColIndex: number,
      ariaColSpan: number,
      ariaControls: spaceSeparated,
      ariaCurrent: null,
      ariaDescribedBy: spaceSeparated,
      ariaDetails: null,
      ariaDisabled: booleanish,
      ariaDropEffect: spaceSeparated,
      ariaErrorMessage: null,
      ariaExpanded: booleanish,
      ariaFlowTo: spaceSeparated,
      ariaGrabbed: booleanish,
      ariaHasPopup: null,
      ariaHidden: booleanish,
      ariaInvalid: null,
      ariaKeyShortcuts: null,
      ariaLabel: null,
      ariaLabelledBy: spaceSeparated,
      ariaLevel: number,
      ariaLive: null,
      ariaModal: booleanish,
      ariaMultiLine: booleanish,
      ariaMultiSelectable: booleanish,
      ariaOrientation: null,
      ariaOwns: spaceSeparated,
      ariaPlaceholder: null,
      ariaPosInSet: number,
      ariaPressed: booleanish,
      ariaReadOnly: booleanish,
      ariaRelevant: null,
      ariaRequired: booleanish,
      ariaRoleDescription: spaceSeparated,
      ariaRowCount: number,
      ariaRowIndex: number,
      ariaRowSpan: number,
      ariaSelected: booleanish,
      ariaSetSize: number,
      ariaSort: null,
      ariaValueMax: number,
      ariaValueMin: number,
      ariaValueNow: number,
      ariaValueText: null,
      role: null
    }
  });
  const html$3 = create({
    space: "html",
    attributes: {
      acceptcharset: "accept-charset",
      classname: "class",
      htmlfor: "for",
      httpequiv: "http-equiv"
    },
    transform: caseInsensitiveTransform,
    mustUseProperty: ["checked", "multiple", "muted", "selected"],
    properties: {
      // Standard Properties.
      abbr: null,
      accept: commaSeparated,
      acceptCharset: spaceSeparated,
      accessKey: spaceSeparated,
      action: null,
      allow: null,
      allowFullScreen: boolean,
      allowPaymentRequest: boolean,
      allowUserMedia: boolean,
      alt: null,
      as: null,
      async: boolean,
      autoCapitalize: null,
      autoComplete: spaceSeparated,
      autoFocus: boolean,
      autoPlay: boolean,
      capture: boolean,
      charSet: null,
      checked: boolean,
      cite: null,
      className: spaceSeparated,
      cols: number,
      colSpan: null,
      content: null,
      contentEditable: booleanish,
      controls: boolean,
      controlsList: spaceSeparated,
      coords: number | commaSeparated,
      crossOrigin: null,
      data: null,
      dateTime: null,
      decoding: null,
      default: boolean,
      defer: boolean,
      dir: null,
      dirName: null,
      disabled: boolean,
      download: overloadedBoolean,
      draggable: booleanish,
      encType: null,
      enterKeyHint: null,
      form: null,
      formAction: null,
      formEncType: null,
      formMethod: null,
      formNoValidate: boolean,
      formTarget: null,
      headers: spaceSeparated,
      height: number,
      hidden: boolean,
      high: number,
      href: null,
      hrefLang: null,
      htmlFor: spaceSeparated,
      httpEquiv: spaceSeparated,
      id: null,
      imageSizes: null,
      imageSrcSet: null,
      inputMode: null,
      integrity: null,
      is: null,
      isMap: boolean,
      itemId: null,
      itemProp: spaceSeparated,
      itemRef: spaceSeparated,
      itemScope: boolean,
      itemType: spaceSeparated,
      kind: null,
      label: null,
      lang: null,
      language: null,
      list: null,
      loading: null,
      loop: boolean,
      low: number,
      manifest: null,
      max: null,
      maxLength: number,
      media: null,
      method: null,
      min: null,
      minLength: number,
      multiple: boolean,
      muted: boolean,
      name: null,
      nonce: null,
      noModule: boolean,
      noValidate: boolean,
      onAbort: null,
      onAfterPrint: null,
      onAuxClick: null,
      onBeforeMatch: null,
      onBeforePrint: null,
      onBeforeUnload: null,
      onBlur: null,
      onCancel: null,
      onCanPlay: null,
      onCanPlayThrough: null,
      onChange: null,
      onClick: null,
      onClose: null,
      onContextLost: null,
      onContextMenu: null,
      onContextRestored: null,
      onCopy: null,
      onCueChange: null,
      onCut: null,
      onDblClick: null,
      onDrag: null,
      onDragEnd: null,
      onDragEnter: null,
      onDragExit: null,
      onDragLeave: null,
      onDragOver: null,
      onDragStart: null,
      onDrop: null,
      onDurationChange: null,
      onEmptied: null,
      onEnded: null,
      onError: null,
      onFocus: null,
      onFormData: null,
      onHashChange: null,
      onInput: null,
      onInvalid: null,
      onKeyDown: null,
      onKeyPress: null,
      onKeyUp: null,
      onLanguageChange: null,
      onLoad: null,
      onLoadedData: null,
      onLoadedMetadata: null,
      onLoadEnd: null,
      onLoadStart: null,
      onMessage: null,
      onMessageError: null,
      onMouseDown: null,
      onMouseEnter: null,
      onMouseLeave: null,
      onMouseMove: null,
      onMouseOut: null,
      onMouseOver: null,
      onMouseUp: null,
      onOffline: null,
      onOnline: null,
      onPageHide: null,
      onPageShow: null,
      onPaste: null,
      onPause: null,
      onPlay: null,
      onPlaying: null,
      onPopState: null,
      onProgress: null,
      onRateChange: null,
      onRejectionHandled: null,
      onReset: null,
      onResize: null,
      onScroll: null,
      onScrollEnd: null,
      onSecurityPolicyViolation: null,
      onSeeked: null,
      onSeeking: null,
      onSelect: null,
      onSlotChange: null,
      onStalled: null,
      onStorage: null,
      onSubmit: null,
      onSuspend: null,
      onTimeUpdate: null,
      onToggle: null,
      onUnhandledRejection: null,
      onUnload: null,
      onVolumeChange: null,
      onWaiting: null,
      onWheel: null,
      open: boolean,
      optimum: number,
      pattern: null,
      ping: spaceSeparated,
      placeholder: null,
      playsInline: boolean,
      poster: null,
      preload: null,
      readOnly: boolean,
      referrerPolicy: null,
      rel: spaceSeparated,
      required: boolean,
      reversed: boolean,
      rows: number,
      rowSpan: number,
      sandbox: spaceSeparated,
      scope: null,
      scoped: boolean,
      seamless: boolean,
      selected: boolean,
      shape: null,
      size: number,
      sizes: null,
      slot: null,
      span: number,
      spellCheck: booleanish,
      src: null,
      srcDoc: null,
      srcLang: null,
      srcSet: null,
      start: number,
      step: null,
      style: null,
      tabIndex: number,
      target: null,
      title: null,
      translate: null,
      type: null,
      typeMustMatch: boolean,
      useMap: null,
      value: booleanish,
      width: number,
      wrap: null,
      // Legacy.
      // See: https://html.spec.whatwg.org/#other-elements,-attributes-and-apis
      align: null,
      // Several. Use CSS `text-align` instead,
      aLink: null,
      // `<body>`. Use CSS `a:active {color}` instead
      archive: spaceSeparated,
      // `<object>`. List of URIs to archives
      axis: null,
      // `<td>` and `<th>`. Use `scope` on `<th>`
      background: null,
      // `<body>`. Use CSS `background-image` instead
      bgColor: null,
      // `<body>` and table elements. Use CSS `background-color` instead
      border: number,
      // `<table>`. Use CSS `border-width` instead,
      borderColor: null,
      // `<table>`. Use CSS `border-color` instead,
      bottomMargin: number,
      // `<body>`
      cellPadding: null,
      // `<table>`
      cellSpacing: null,
      // `<table>`
      char: null,
      // Several table elements. When `align=char`, sets the character to align on
      charOff: null,
      // Several table elements. When `char`, offsets the alignment
      classId: null,
      // `<object>`
      clear: null,
      // `<br>`. Use CSS `clear` instead
      code: null,
      // `<object>`
      codeBase: null,
      // `<object>`
      codeType: null,
      // `<object>`
      color: null,
      // `<font>` and `<hr>`. Use CSS instead
      compact: boolean,
      // Lists. Use CSS to reduce space between items instead
      declare: boolean,
      // `<object>`
      event: null,
      // `<script>`
      face: null,
      // `<font>`. Use CSS instead
      frame: null,
      // `<table>`
      frameBorder: null,
      // `<iframe>`. Use CSS `border` instead
      hSpace: number,
      // `<img>` and `<object>`
      leftMargin: number,
      // `<body>`
      link: null,
      // `<body>`. Use CSS `a:link {color: *}` instead
      longDesc: null,
      // `<frame>`, `<iframe>`, and `<img>`. Use an `<a>`
      lowSrc: null,
      // `<img>`. Use a `<picture>`
      marginHeight: number,
      // `<body>`
      marginWidth: number,
      // `<body>`
      noResize: boolean,
      // `<frame>`
      noHref: boolean,
      // `<area>`. Use no href instead of an explicit `nohref`
      noShade: boolean,
      // `<hr>`. Use background-color and height instead of borders
      noWrap: boolean,
      // `<td>` and `<th>`
      object: null,
      // `<applet>`
      profile: null,
      // `<head>`
      prompt: null,
      // `<isindex>`
      rev: null,
      // `<link>`
      rightMargin: number,
      // `<body>`
      rules: null,
      // `<table>`
      scheme: null,
      // `<meta>`
      scrolling: booleanish,
      // `<frame>`. Use overflow in the child context
      standby: null,
      // `<object>`
      summary: null,
      // `<table>`
      text: null,
      // `<body>`. Use CSS `color` instead
      topMargin: number,
      // `<body>`
      valueType: null,
      // `<param>`
      version: null,
      // `<html>`. Use a doctype.
      vAlign: null,
      // Several. Use CSS `vertical-align` instead
      vLink: null,
      // `<body>`. Use CSS `a:visited {color}` instead
      vSpace: number,
      // `<img>` and `<object>`
      // Non-standard Properties.
      allowTransparency: null,
      autoCorrect: null,
      autoSave: null,
      disablePictureInPicture: boolean,
      disableRemotePlayback: boolean,
      prefix: null,
      property: null,
      results: number,
      security: null,
      unselectable: null
    }
  });
  const svg$1 = create({
    space: "svg",
    attributes: {
      accentHeight: "accent-height",
      alignmentBaseline: "alignment-baseline",
      arabicForm: "arabic-form",
      baselineShift: "baseline-shift",
      capHeight: "cap-height",
      className: "class",
      clipPath: "clip-path",
      clipRule: "clip-rule",
      colorInterpolation: "color-interpolation",
      colorInterpolationFilters: "color-interpolation-filters",
      colorProfile: "color-profile",
      colorRendering: "color-rendering",
      crossOrigin: "crossorigin",
      dataType: "datatype",
      dominantBaseline: "dominant-baseline",
      enableBackground: "enable-background",
      fillOpacity: "fill-opacity",
      fillRule: "fill-rule",
      floodColor: "flood-color",
      floodOpacity: "flood-opacity",
      fontFamily: "font-family",
      fontSize: "font-size",
      fontSizeAdjust: "font-size-adjust",
      fontStretch: "font-stretch",
      fontStyle: "font-style",
      fontVariant: "font-variant",
      fontWeight: "font-weight",
      glyphName: "glyph-name",
      glyphOrientationHorizontal: "glyph-orientation-horizontal",
      glyphOrientationVertical: "glyph-orientation-vertical",
      hrefLang: "hreflang",
      horizAdvX: "horiz-adv-x",
      horizOriginX: "horiz-origin-x",
      horizOriginY: "horiz-origin-y",
      imageRendering: "image-rendering",
      letterSpacing: "letter-spacing",
      lightingColor: "lighting-color",
      markerEnd: "marker-end",
      markerMid: "marker-mid",
      markerStart: "marker-start",
      navDown: "nav-down",
      navDownLeft: "nav-down-left",
      navDownRight: "nav-down-right",
      navLeft: "nav-left",
      navNext: "nav-next",
      navPrev: "nav-prev",
      navRight: "nav-right",
      navUp: "nav-up",
      navUpLeft: "nav-up-left",
      navUpRight: "nav-up-right",
      onAbort: "onabort",
      onActivate: "onactivate",
      onAfterPrint: "onafterprint",
      onBeforePrint: "onbeforeprint",
      onBegin: "onbegin",
      onCancel: "oncancel",
      onCanPlay: "oncanplay",
      onCanPlayThrough: "oncanplaythrough",
      onChange: "onchange",
      onClick: "onclick",
      onClose: "onclose",
      onCopy: "oncopy",
      onCueChange: "oncuechange",
      onCut: "oncut",
      onDblClick: "ondblclick",
      onDrag: "ondrag",
      onDragEnd: "ondragend",
      onDragEnter: "ondragenter",
      onDragExit: "ondragexit",
      onDragLeave: "ondragleave",
      onDragOver: "ondragover",
      onDragStart: "ondragstart",
      onDrop: "ondrop",
      onDurationChange: "ondurationchange",
      onEmptied: "onemptied",
      onEnd: "onend",
      onEnded: "onended",
      onError: "onerror",
      onFocus: "onfocus",
      onFocusIn: "onfocusin",
      onFocusOut: "onfocusout",
      onHashChange: "onhashchange",
      onInput: "oninput",
      onInvalid: "oninvalid",
      onKeyDown: "onkeydown",
      onKeyPress: "onkeypress",
      onKeyUp: "onkeyup",
      onLoad: "onload",
      onLoadedData: "onloadeddata",
      onLoadedMetadata: "onloadedmetadata",
      onLoadStart: "onloadstart",
      onMessage: "onmessage",
      onMouseDown: "onmousedown",
      onMouseEnter: "onmouseenter",
      onMouseLeave: "onmouseleave",
      onMouseMove: "onmousemove",
      onMouseOut: "onmouseout",
      onMouseOver: "onmouseover",
      onMouseUp: "onmouseup",
      onMouseWheel: "onmousewheel",
      onOffline: "onoffline",
      onOnline: "ononline",
      onPageHide: "onpagehide",
      onPageShow: "onpageshow",
      onPaste: "onpaste",
      onPause: "onpause",
      onPlay: "onplay",
      onPlaying: "onplaying",
      onPopState: "onpopstate",
      onProgress: "onprogress",
      onRateChange: "onratechange",
      onRepeat: "onrepeat",
      onReset: "onreset",
      onResize: "onresize",
      onScroll: "onscroll",
      onSeeked: "onseeked",
      onSeeking: "onseeking",
      onSelect: "onselect",
      onShow: "onshow",
      onStalled: "onstalled",
      onStorage: "onstorage",
      onSubmit: "onsubmit",
      onSuspend: "onsuspend",
      onTimeUpdate: "ontimeupdate",
      onToggle: "ontoggle",
      onUnload: "onunload",
      onVolumeChange: "onvolumechange",
      onWaiting: "onwaiting",
      onZoom: "onzoom",
      overlinePosition: "overline-position",
      overlineThickness: "overline-thickness",
      paintOrder: "paint-order",
      panose1: "panose-1",
      pointerEvents: "pointer-events",
      referrerPolicy: "referrerpolicy",
      renderingIntent: "rendering-intent",
      shapeRendering: "shape-rendering",
      stopColor: "stop-color",
      stopOpacity: "stop-opacity",
      strikethroughPosition: "strikethrough-position",
      strikethroughThickness: "strikethrough-thickness",
      strokeDashArray: "stroke-dasharray",
      strokeDashOffset: "stroke-dashoffset",
      strokeLineCap: "stroke-linecap",
      strokeLineJoin: "stroke-linejoin",
      strokeMiterLimit: "stroke-miterlimit",
      strokeOpacity: "stroke-opacity",
      strokeWidth: "stroke-width",
      tabIndex: "tabindex",
      textAnchor: "text-anchor",
      textDecoration: "text-decoration",
      textRendering: "text-rendering",
      typeOf: "typeof",
      underlinePosition: "underline-position",
      underlineThickness: "underline-thickness",
      unicodeBidi: "unicode-bidi",
      unicodeRange: "unicode-range",
      unitsPerEm: "units-per-em",
      vAlphabetic: "v-alphabetic",
      vHanging: "v-hanging",
      vIdeographic: "v-ideographic",
      vMathematical: "v-mathematical",
      vectorEffect: "vector-effect",
      vertAdvY: "vert-adv-y",
      vertOriginX: "vert-origin-x",
      vertOriginY: "vert-origin-y",
      wordSpacing: "word-spacing",
      writingMode: "writing-mode",
      xHeight: "x-height",
      // These were camelcased in Tiny. Now lowercased in SVG 2
      playbackOrder: "playbackorder",
      timelineBegin: "timelinebegin"
    },
    transform: caseSensitiveTransform,
    properties: {
      about: commaOrSpaceSeparated,
      accentHeight: number,
      accumulate: null,
      additive: null,
      alignmentBaseline: null,
      alphabetic: number,
      amplitude: number,
      arabicForm: null,
      ascent: number,
      attributeName: null,
      attributeType: null,
      azimuth: number,
      bandwidth: null,
      baselineShift: null,
      baseFrequency: null,
      baseProfile: null,
      bbox: null,
      begin: null,
      bias: number,
      by: null,
      calcMode: null,
      capHeight: number,
      className: spaceSeparated,
      clip: null,
      clipPath: null,
      clipPathUnits: null,
      clipRule: null,
      color: null,
      colorInterpolation: null,
      colorInterpolationFilters: null,
      colorProfile: null,
      colorRendering: null,
      content: null,
      contentScriptType: null,
      contentStyleType: null,
      crossOrigin: null,
      cursor: null,
      cx: null,
      cy: null,
      d: null,
      dataType: null,
      defaultAction: null,
      descent: number,
      diffuseConstant: number,
      direction: null,
      display: null,
      dur: null,
      divisor: number,
      dominantBaseline: null,
      download: boolean,
      dx: null,
      dy: null,
      edgeMode: null,
      editable: null,
      elevation: number,
      enableBackground: null,
      end: null,
      event: null,
      exponent: number,
      externalResourcesRequired: null,
      fill: null,
      fillOpacity: number,
      fillRule: null,
      filter: null,
      filterRes: null,
      filterUnits: null,
      floodColor: null,
      floodOpacity: null,
      focusable: null,
      focusHighlight: null,
      fontFamily: null,
      fontSize: null,
      fontSizeAdjust: null,
      fontStretch: null,
      fontStyle: null,
      fontVariant: null,
      fontWeight: null,
      format: null,
      fr: null,
      from: null,
      fx: null,
      fy: null,
      g1: commaSeparated,
      g2: commaSeparated,
      glyphName: commaSeparated,
      glyphOrientationHorizontal: null,
      glyphOrientationVertical: null,
      glyphRef: null,
      gradientTransform: null,
      gradientUnits: null,
      handler: null,
      hanging: number,
      hatchContentUnits: null,
      hatchUnits: null,
      height: null,
      href: null,
      hrefLang: null,
      horizAdvX: number,
      horizOriginX: number,
      horizOriginY: number,
      id: null,
      ideographic: number,
      imageRendering: null,
      initialVisibility: null,
      in: null,
      in2: null,
      intercept: number,
      k: number,
      k1: number,
      k2: number,
      k3: number,
      k4: number,
      kernelMatrix: commaOrSpaceSeparated,
      kernelUnitLength: null,
      keyPoints: null,
      // SEMI_COLON_SEPARATED
      keySplines: null,
      // SEMI_COLON_SEPARATED
      keyTimes: null,
      // SEMI_COLON_SEPARATED
      kerning: null,
      lang: null,
      lengthAdjust: null,
      letterSpacing: null,
      lightingColor: null,
      limitingConeAngle: number,
      local: null,
      markerEnd: null,
      markerMid: null,
      markerStart: null,
      markerHeight: null,
      markerUnits: null,
      markerWidth: null,
      mask: null,
      maskContentUnits: null,
      maskUnits: null,
      mathematical: null,
      max: null,
      media: null,
      mediaCharacterEncoding: null,
      mediaContentEncodings: null,
      mediaSize: number,
      mediaTime: null,
      method: null,
      min: null,
      mode: null,
      name: null,
      navDown: null,
      navDownLeft: null,
      navDownRight: null,
      navLeft: null,
      navNext: null,
      navPrev: null,
      navRight: null,
      navUp: null,
      navUpLeft: null,
      navUpRight: null,
      numOctaves: null,
      observer: null,
      offset: null,
      onAbort: null,
      onActivate: null,
      onAfterPrint: null,
      onBeforePrint: null,
      onBegin: null,
      onCancel: null,
      onCanPlay: null,
      onCanPlayThrough: null,
      onChange: null,
      onClick: null,
      onClose: null,
      onCopy: null,
      onCueChange: null,
      onCut: null,
      onDblClick: null,
      onDrag: null,
      onDragEnd: null,
      onDragEnter: null,
      onDragExit: null,
      onDragLeave: null,
      onDragOver: null,
      onDragStart: null,
      onDrop: null,
      onDurationChange: null,
      onEmptied: null,
      onEnd: null,
      onEnded: null,
      onError: null,
      onFocus: null,
      onFocusIn: null,
      onFocusOut: null,
      onHashChange: null,
      onInput: null,
      onInvalid: null,
      onKeyDown: null,
      onKeyPress: null,
      onKeyUp: null,
      onLoad: null,
      onLoadedData: null,
      onLoadedMetadata: null,
      onLoadStart: null,
      onMessage: null,
      onMouseDown: null,
      onMouseEnter: null,
      onMouseLeave: null,
      onMouseMove: null,
      onMouseOut: null,
      onMouseOver: null,
      onMouseUp: null,
      onMouseWheel: null,
      onOffline: null,
      onOnline: null,
      onPageHide: null,
      onPageShow: null,
      onPaste: null,
      onPause: null,
      onPlay: null,
      onPlaying: null,
      onPopState: null,
      onProgress: null,
      onRateChange: null,
      onRepeat: null,
      onReset: null,
      onResize: null,
      onScroll: null,
      onSeeked: null,
      onSeeking: null,
      onSelect: null,
      onShow: null,
      onStalled: null,
      onStorage: null,
      onSubmit: null,
      onSuspend: null,
      onTimeUpdate: null,
      onToggle: null,
      onUnload: null,
      onVolumeChange: null,
      onWaiting: null,
      onZoom: null,
      opacity: null,
      operator: null,
      order: null,
      orient: null,
      orientation: null,
      origin: null,
      overflow: null,
      overlay: null,
      overlinePosition: number,
      overlineThickness: number,
      paintOrder: null,
      panose1: null,
      path: null,
      pathLength: number,
      patternContentUnits: null,
      patternTransform: null,
      patternUnits: null,
      phase: null,
      ping: spaceSeparated,
      pitch: null,
      playbackOrder: null,
      pointerEvents: null,
      points: null,
      pointsAtX: number,
      pointsAtY: number,
      pointsAtZ: number,
      preserveAlpha: null,
      preserveAspectRatio: null,
      primitiveUnits: null,
      propagate: null,
      property: commaOrSpaceSeparated,
      r: null,
      radius: null,
      referrerPolicy: null,
      refX: null,
      refY: null,
      rel: commaOrSpaceSeparated,
      rev: commaOrSpaceSeparated,
      renderingIntent: null,
      repeatCount: null,
      repeatDur: null,
      requiredExtensions: commaOrSpaceSeparated,
      requiredFeatures: commaOrSpaceSeparated,
      requiredFonts: commaOrSpaceSeparated,
      requiredFormats: commaOrSpaceSeparated,
      resource: null,
      restart: null,
      result: null,
      rotate: null,
      rx: null,
      ry: null,
      scale: null,
      seed: null,
      shapeRendering: null,
      side: null,
      slope: null,
      snapshotTime: null,
      specularConstant: number,
      specularExponent: number,
      spreadMethod: null,
      spacing: null,
      startOffset: null,
      stdDeviation: null,
      stemh: null,
      stemv: null,
      stitchTiles: null,
      stopColor: null,
      stopOpacity: null,
      strikethroughPosition: number,
      strikethroughThickness: number,
      string: null,
      stroke: null,
      strokeDashArray: commaOrSpaceSeparated,
      strokeDashOffset: null,
      strokeLineCap: null,
      strokeLineJoin: null,
      strokeMiterLimit: number,
      strokeOpacity: number,
      strokeWidth: null,
      style: null,
      surfaceScale: number,
      syncBehavior: null,
      syncBehaviorDefault: null,
      syncMaster: null,
      syncTolerance: null,
      syncToleranceDefault: null,
      systemLanguage: commaOrSpaceSeparated,
      tabIndex: number,
      tableValues: null,
      target: null,
      targetX: number,
      targetY: number,
      textAnchor: null,
      textDecoration: null,
      textRendering: null,
      textLength: null,
      timelineBegin: null,
      title: null,
      transformBehavior: null,
      type: null,
      typeOf: commaOrSpaceSeparated,
      to: null,
      transform: null,
      u1: null,
      u2: null,
      underlinePosition: number,
      underlineThickness: number,
      unicode: null,
      unicodeBidi: null,
      unicodeRange: null,
      unitsPerEm: number,
      values: null,
      vAlphabetic: number,
      vMathematical: number,
      vectorEffect: null,
      vHanging: number,
      vIdeographic: number,
      version: null,
      vertAdvY: number,
      vertOriginX: number,
      vertOriginY: number,
      viewBox: null,
      viewTarget: null,
      visibility: null,
      width: null,
      widths: null,
      wordSpacing: null,
      writingMode: null,
      x: null,
      x1: null,
      x2: null,
      xChannelSelector: null,
      xHeight: number,
      y: null,
      y1: null,
      y2: null,
      yChannelSelector: null,
      z: null,
      zoomAndPan: null
    }
  });
  const valid = /^data[-\w.:]+$/i;
  const dash = /-[a-z]/g;
  const cap = /[A-Z]/g;
  function find(schema, value2) {
    const normal = normalize(value2);
    let prop = value2;
    let Type = Info;
    if (normal in schema.normal) {
      return schema.property[schema.normal[normal]];
    }
    if (normal.length > 4 && normal.slice(0, 4) === "data" && valid.test(value2)) {
      if (value2.charAt(4) === "-") {
        const rest = value2.slice(5).replace(dash, camelcase);
        prop = "data" + rest.charAt(0).toUpperCase() + rest.slice(1);
      } else {
        const rest = value2.slice(4);
        if (!dash.test(rest)) {
          let dashes = rest.replace(cap, kebab);
          if (dashes.charAt(0) !== "-") {
            dashes = "-" + dashes;
          }
          value2 = "data" + dashes;
        }
      }
      Type = DefinedInfo;
    }
    return new Type(prop, value2);
  }
  function kebab($0) {
    return "-" + $0.toLowerCase();
  }
  function camelcase($0) {
    return $0.charAt(1).toUpperCase();
  }
  const html$2 = merge([xml, xlink, xmlns, aria, html$3], "html");
  const svg = merge([xml, xlink, xmlns, aria, svg$1], "svg");
  const htmlVoidElements = [
    "area",
    "base",
    "basefont",
    "bgsound",
    "br",
    "col",
    "command",
    "embed",
    "frame",
    "hr",
    "image",
    "img",
    "input",
    "isindex",
    "keygen",
    "link",
    "menuitem",
    "meta",
    "nextid",
    "param",
    "source",
    "track",
    "wbr"
  ];
  function core(value2, options2) {
    value2 = value2.replace(
      options2.subset ? charactersToExpression(options2.subset) : /["&'<>`]/g,
      basic
    );
    if (options2.subset || options2.escapeOnly) {
      return value2;
    }
    return value2.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, surrogate).replace(
      // eslint-disable-next-line no-control-regex, unicorn/no-hex-escape
      /[\x01-\t\v\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g,
      basic
    );
    function surrogate(pair, index2, all2) {
      return options2.format(
        (pair.charCodeAt(0) - 55296) * 1024 + pair.charCodeAt(1) - 56320 + 65536,
        all2.charCodeAt(index2 + 2),
        options2
      );
    }
    function basic(character, index2, all2) {
      return options2.format(
        character.charCodeAt(0),
        all2.charCodeAt(index2 + 1),
        options2
      );
    }
  }
  function charactersToExpression(subset) {
    const groups = [];
    let index2 = -1;
    while (++index2 < subset.length) {
      groups.push(subset[index2].replace(/[|\\{}()[\]^$+*?.]/g, "\\$&"));
    }
    return new RegExp("(?:" + groups.join("|") + ")", "g");
  }
  function toHexadecimal(code2, next, omit) {
    const value2 = "&#x" + code2.toString(16).toUpperCase();
    return omit && next && !/[\dA-Fa-f]/.test(String.fromCharCode(next)) ? value2 : value2 + ";";
  }
  function toDecimal(code2, next, omit) {
    const value2 = "&#" + String(code2);
    return omit && next && !/\d/.test(String.fromCharCode(next)) ? value2 : value2 + ";";
  }
  const characterEntitiesLegacy = [
    "AElig",
    "AMP",
    "Aacute",
    "Acirc",
    "Agrave",
    "Aring",
    "Atilde",
    "Auml",
    "COPY",
    "Ccedil",
    "ETH",
    "Eacute",
    "Ecirc",
    "Egrave",
    "Euml",
    "GT",
    "Iacute",
    "Icirc",
    "Igrave",
    "Iuml",
    "LT",
    "Ntilde",
    "Oacute",
    "Ocirc",
    "Ograve",
    "Oslash",
    "Otilde",
    "Ouml",
    "QUOT",
    "REG",
    "THORN",
    "Uacute",
    "Ucirc",
    "Ugrave",
    "Uuml",
    "Yacute",
    "aacute",
    "acirc",
    "acute",
    "aelig",
    "agrave",
    "amp",
    "aring",
    "atilde",
    "auml",
    "brvbar",
    "ccedil",
    "cedil",
    "cent",
    "copy",
    "curren",
    "deg",
    "divide",
    "eacute",
    "ecirc",
    "egrave",
    "eth",
    "euml",
    "frac12",
    "frac14",
    "frac34",
    "gt",
    "iacute",
    "icirc",
    "iexcl",
    "igrave",
    "iquest",
    "iuml",
    "laquo",
    "lt",
    "macr",
    "micro",
    "middot",
    "nbsp",
    "not",
    "ntilde",
    "oacute",
    "ocirc",
    "ograve",
    "ordf",
    "ordm",
    "oslash",
    "otilde",
    "ouml",
    "para",
    "plusmn",
    "pound",
    "quot",
    "raquo",
    "reg",
    "sect",
    "shy",
    "sup1",
    "sup2",
    "sup3",
    "szlig",
    "thorn",
    "times",
    "uacute",
    "ucirc",
    "ugrave",
    "uml",
    "uuml",
    "yacute",
    "yen",
    "yuml"
  ];
  const characterEntitiesHtml4 = {
    nbsp: " ",
    iexcl: "¡",
    cent: "¢",
    pound: "£",
    curren: "¤",
    yen: "¥",
    brvbar: "¦",
    sect: "§",
    uml: "¨",
    copy: "©",
    ordf: "ª",
    laquo: "«",
    not: "¬",
    shy: "­",
    reg: "®",
    macr: "¯",
    deg: "°",
    plusmn: "±",
    sup2: "²",
    sup3: "³",
    acute: "´",
    micro: "µ",
    para: "¶",
    middot: "·",
    cedil: "¸",
    sup1: "¹",
    ordm: "º",
    raquo: "»",
    frac14: "¼",
    frac12: "½",
    frac34: "¾",
    iquest: "¿",
    Agrave: "À",
    Aacute: "Á",
    Acirc: "Â",
    Atilde: "Ã",
    Auml: "Ä",
    Aring: "Å",
    AElig: "Æ",
    Ccedil: "Ç",
    Egrave: "È",
    Eacute: "É",
    Ecirc: "Ê",
    Euml: "Ë",
    Igrave: "Ì",
    Iacute: "Í",
    Icirc: "Î",
    Iuml: "Ï",
    ETH: "Ð",
    Ntilde: "Ñ",
    Ograve: "Ò",
    Oacute: "Ó",
    Ocirc: "Ô",
    Otilde: "Õ",
    Ouml: "Ö",
    times: "×",
    Oslash: "Ø",
    Ugrave: "Ù",
    Uacute: "Ú",
    Ucirc: "Û",
    Uuml: "Ü",
    Yacute: "Ý",
    THORN: "Þ",
    szlig: "ß",
    agrave: "à",
    aacute: "á",
    acirc: "â",
    atilde: "ã",
    auml: "ä",
    aring: "å",
    aelig: "æ",
    ccedil: "ç",
    egrave: "è",
    eacute: "é",
    ecirc: "ê",
    euml: "ë",
    igrave: "ì",
    iacute: "í",
    icirc: "î",
    iuml: "ï",
    eth: "ð",
    ntilde: "ñ",
    ograve: "ò",
    oacute: "ó",
    ocirc: "ô",
    otilde: "õ",
    ouml: "ö",
    divide: "÷",
    oslash: "ø",
    ugrave: "ù",
    uacute: "ú",
    ucirc: "û",
    uuml: "ü",
    yacute: "ý",
    thorn: "þ",
    yuml: "ÿ",
    fnof: "ƒ",
    Alpha: "Α",
    Beta: "Β",
    Gamma: "Γ",
    Delta: "Δ",
    Epsilon: "Ε",
    Zeta: "Ζ",
    Eta: "Η",
    Theta: "Θ",
    Iota: "Ι",
    Kappa: "Κ",
    Lambda: "Λ",
    Mu: "Μ",
    Nu: "Ν",
    Xi: "Ξ",
    Omicron: "Ο",
    Pi: "Π",
    Rho: "Ρ",
    Sigma: "Σ",
    Tau: "Τ",
    Upsilon: "Υ",
    Phi: "Φ",
    Chi: "Χ",
    Psi: "Ψ",
    Omega: "Ω",
    alpha: "α",
    beta: "β",
    gamma: "γ",
    delta: "δ",
    epsilon: "ε",
    zeta: "ζ",
    eta: "η",
    theta: "θ",
    iota: "ι",
    kappa: "κ",
    lambda: "λ",
    mu: "μ",
    nu: "ν",
    xi: "ξ",
    omicron: "ο",
    pi: "π",
    rho: "ρ",
    sigmaf: "ς",
    sigma: "σ",
    tau: "τ",
    upsilon: "υ",
    phi: "φ",
    chi: "χ",
    psi: "ψ",
    omega: "ω",
    thetasym: "ϑ",
    upsih: "ϒ",
    piv: "ϖ",
    bull: "•",
    hellip: "…",
    prime: "′",
    Prime: "″",
    oline: "‾",
    frasl: "⁄",
    weierp: "℘",
    image: "ℑ",
    real: "ℜ",
    trade: "™",
    alefsym: "ℵ",
    larr: "←",
    uarr: "↑",
    rarr: "→",
    darr: "↓",
    harr: "↔",
    crarr: "↵",
    lArr: "⇐",
    uArr: "⇑",
    rArr: "⇒",
    dArr: "⇓",
    hArr: "⇔",
    forall: "∀",
    part: "∂",
    exist: "∃",
    empty: "∅",
    nabla: "∇",
    isin: "∈",
    notin: "∉",
    ni: "∋",
    prod: "∏",
    sum: "∑",
    minus: "−",
    lowast: "∗",
    radic: "√",
    prop: "∝",
    infin: "∞",
    ang: "∠",
    and: "∧",
    or: "∨",
    cap: "∩",
    cup: "∪",
    int: "∫",
    there4: "∴",
    sim: "∼",
    cong: "≅",
    asymp: "≈",
    ne: "≠",
    equiv: "≡",
    le: "≤",
    ge: "≥",
    sub: "⊂",
    sup: "⊃",
    nsub: "⊄",
    sube: "⊆",
    supe: "⊇",
    oplus: "⊕",
    otimes: "⊗",
    perp: "⊥",
    sdot: "⋅",
    lceil: "⌈",
    rceil: "⌉",
    lfloor: "⌊",
    rfloor: "⌋",
    lang: "〈",
    rang: "〉",
    loz: "◊",
    spades: "♠",
    clubs: "♣",
    hearts: "♥",
    diams: "♦",
    quot: '"',
    amp: "&",
    lt: "<",
    gt: ">",
    OElig: "Œ",
    oelig: "œ",
    Scaron: "Š",
    scaron: "š",
    Yuml: "Ÿ",
    circ: "ˆ",
    tilde: "˜",
    ensp: " ",
    emsp: " ",
    thinsp: " ",
    zwnj: "‌",
    zwj: "‍",
    lrm: "‎",
    rlm: "‏",
    ndash: "–",
    mdash: "—",
    lsquo: "‘",
    rsquo: "’",
    sbquo: "‚",
    ldquo: "“",
    rdquo: "”",
    bdquo: "„",
    dagger: "†",
    Dagger: "‡",
    permil: "‰",
    lsaquo: "‹",
    rsaquo: "›",
    euro: "€"
  };
  const dangerous = [
    "cent",
    "copy",
    "divide",
    "gt",
    "lt",
    "not",
    "para",
    "times"
  ];
  const own$1 = {}.hasOwnProperty;
  const characters = {};
  let key;
  for (key in characterEntitiesHtml4) {
    if (own$1.call(characterEntitiesHtml4, key)) {
      characters[characterEntitiesHtml4[key]] = key;
    }
  }
  function toNamed(code2, next, omit, attribute) {
    const character = String.fromCharCode(code2);
    if (own$1.call(characters, character)) {
      const name = characters[character];
      const value2 = "&" + name;
      if (omit && characterEntitiesLegacy.includes(name) && !dangerous.includes(name) && (!attribute || next && next !== 61 && /[^\da-z]/i.test(String.fromCharCode(next)))) {
        return value2;
      }
      return value2 + ";";
    }
    return "";
  }
  function formatSmart(code2, next, options2) {
    let numeric = toHexadecimal(code2, next, options2.omitOptionalSemicolons);
    let named;
    if (options2.useNamedReferences || options2.useShortestReferences) {
      named = toNamed(
        code2,
        next,
        options2.omitOptionalSemicolons,
        options2.attribute
      );
    }
    if ((options2.useShortestReferences || !named) && options2.useShortestReferences) {
      const decimal = toDecimal(code2, next, options2.omitOptionalSemicolons);
      if (decimal.length < numeric.length) {
        numeric = decimal;
      }
    }
    return named && (!options2.useShortestReferences || named.length < numeric.length) ? named : numeric;
  }
  function stringifyEntities(value2, options2) {
    return core(value2, Object.assign({ format: formatSmart }, options2));
  }
  function comment(node2, _1, _2, state) {
    return state.settings.bogusComments ? "<?" + stringifyEntities(
      node2.value,
      Object.assign({}, state.settings.characterReferences, { subset: [">"] })
    ) + ">" : "<!--" + node2.value.replace(/^>|^->|<!--|-->|--!>|<!-$/g, encode) + "-->";
    function encode($0) {
      return stringifyEntities(
        $0,
        Object.assign({}, state.settings.characterReferences, {
          subset: ["<", ">"]
        })
      );
    }
  }
  function doctype(_1, _2, _3, state) {
    return "<!" + (state.settings.upperDoctype ? "DOCTYPE" : "doctype") + (state.settings.tightDoctype ? "" : " ") + "html>";
  }
  function stringify$1(values, options2) {
    const settings = options2 || {};
    const input = values[values.length - 1] === "" ? [...values, ""] : values;
    return input.join(
      (settings.padRight ? " " : "") + "," + (settings.padLeft === false ? "" : " ")
    ).trim();
  }
  function stringify(values) {
    return values.join(" ").trim();
  }
  function whitespace(thing) {
    const value2 = (
      // @ts-expect-error looks like a node.
      thing && typeof thing === "object" && thing.type === "text" ? (
        // @ts-expect-error looks like a text.
        thing.value || ""
      ) : thing
    );
    return typeof value2 === "string" && value2.replace(/[ \t\n\f\r]/g, "") === "";
  }
  const siblingAfter = siblings(1);
  const siblingBefore = siblings(-1);
  function siblings(increment2) {
    return sibling;
    function sibling(parent, index2, includeWhitespace) {
      const siblings2 = parent ? parent.children : [];
      let offset = (index2 || 0) + increment2;
      let next = siblings2 && siblings2[offset];
      if (!includeWhitespace) {
        while (next && whitespace(next)) {
          offset += increment2;
          next = siblings2[offset];
        }
      }
      return next;
    }
  }
  const own = {}.hasOwnProperty;
  function omission(handlers2) {
    return omit;
    function omit(node2, index2, parent) {
      return own.call(handlers2, node2.tagName) && handlers2[node2.tagName](node2, index2, parent);
    }
  }
  const closing = omission({
    html: html$1,
    head: headOrColgroupOrCaption,
    body: body$1,
    p,
    li,
    dt,
    dd,
    rt: rubyElement,
    rp: rubyElement,
    optgroup,
    option,
    menuitem,
    colgroup: headOrColgroupOrCaption,
    caption: headOrColgroupOrCaption,
    thead,
    tbody: tbody$1,
    tfoot,
    tr,
    td: cells,
    th: cells
  });
  function headOrColgroupOrCaption(_2, index2, parent) {
    const next = siblingAfter(parent, index2, true);
    return !next || next.type !== "comment" && !(next.type === "text" && whitespace(next.value.charAt(0)));
  }
  function html$1(_2, index2, parent) {
    const next = siblingAfter(parent, index2);
    return !next || next.type !== "comment";
  }
  function body$1(_2, index2, parent) {
    const next = siblingAfter(parent, index2);
    return !next || next.type !== "comment";
  }
  function p(_2, index2, parent) {
    const next = siblingAfter(parent, index2);
    return next ? next.type === "element" && (next.tagName === "address" || next.tagName === "article" || next.tagName === "aside" || next.tagName === "blockquote" || next.tagName === "details" || next.tagName === "div" || next.tagName === "dl" || next.tagName === "fieldset" || next.tagName === "figcaption" || next.tagName === "figure" || next.tagName === "footer" || next.tagName === "form" || next.tagName === "h1" || next.tagName === "h2" || next.tagName === "h3" || next.tagName === "h4" || next.tagName === "h5" || next.tagName === "h6" || next.tagName === "header" || next.tagName === "hgroup" || next.tagName === "hr" || next.tagName === "main" || next.tagName === "menu" || next.tagName === "nav" || next.tagName === "ol" || next.tagName === "p" || next.tagName === "pre" || next.tagName === "section" || next.tagName === "table" || next.tagName === "ul") : !parent || // Confusing parent.
    !(parent.type === "element" && (parent.tagName === "a" || parent.tagName === "audio" || parent.tagName === "del" || parent.tagName === "ins" || parent.tagName === "map" || parent.tagName === "noscript" || parent.tagName === "video"));
  }
  function li(_2, index2, parent) {
    const next = siblingAfter(parent, index2);
    return !next || next.type === "element" && next.tagName === "li";
  }
  function dt(_2, index2, parent) {
    const next = siblingAfter(parent, index2);
    return next && next.type === "element" && (next.tagName === "dt" || next.tagName === "dd");
  }
  function dd(_2, index2, parent) {
    const next = siblingAfter(parent, index2);
    return !next || next.type === "element" && (next.tagName === "dt" || next.tagName === "dd");
  }
  function rubyElement(_2, index2, parent) {
    const next = siblingAfter(parent, index2);
    return !next || next.type === "element" && (next.tagName === "rp" || next.tagName === "rt");
  }
  function optgroup(_2, index2, parent) {
    const next = siblingAfter(parent, index2);
    return !next || next.type === "element" && next.tagName === "optgroup";
  }
  function option(_2, index2, parent) {
    const next = siblingAfter(parent, index2);
    return !next || next.type === "element" && (next.tagName === "option" || next.tagName === "optgroup");
  }
  function menuitem(_2, index2, parent) {
    const next = siblingAfter(parent, index2);
    return !next || next.type === "element" && (next.tagName === "menuitem" || next.tagName === "hr" || next.tagName === "menu");
  }
  function thead(_2, index2, parent) {
    const next = siblingAfter(parent, index2);
    return next && next.type === "element" && (next.tagName === "tbody" || next.tagName === "tfoot");
  }
  function tbody$1(_2, index2, parent) {
    const next = siblingAfter(parent, index2);
    return !next || next.type === "element" && (next.tagName === "tbody" || next.tagName === "tfoot");
  }
  function tfoot(_2, index2, parent) {
    return !siblingAfter(parent, index2);
  }
  function tr(_2, index2, parent) {
    const next = siblingAfter(parent, index2);
    return !next || next.type === "element" && next.tagName === "tr";
  }
  function cells(_2, index2, parent) {
    const next = siblingAfter(parent, index2);
    return !next || next.type === "element" && (next.tagName === "td" || next.tagName === "th");
  }
  const opening = omission({
    html,
    head,
    body,
    colgroup,
    tbody
  });
  function html(node2) {
    const head2 = siblingAfter(node2, -1);
    return !head2 || head2.type !== "comment";
  }
  function head(node2) {
    const children = node2.children;
    const seen = [];
    let index2 = -1;
    while (++index2 < children.length) {
      const child = children[index2];
      if (child.type === "element" && (child.tagName === "title" || child.tagName === "base")) {
        if (seen.includes(child.tagName))
          return false;
        seen.push(child.tagName);
      }
    }
    return children.length > 0;
  }
  function body(node2) {
    const head2 = siblingAfter(node2, -1, true);
    return !head2 || head2.type !== "comment" && !(head2.type === "text" && whitespace(head2.value.charAt(0))) && !(head2.type === "element" && (head2.tagName === "meta" || head2.tagName === "link" || head2.tagName === "script" || head2.tagName === "style" || head2.tagName === "template"));
  }
  function colgroup(node2, index2, parent) {
    const previous2 = siblingBefore(parent, index2);
    const head2 = siblingAfter(node2, -1, true);
    if (parent && previous2 && previous2.type === "element" && previous2.tagName === "colgroup" && closing(previous2, parent.children.indexOf(previous2), parent)) {
      return false;
    }
    return head2 && head2.type === "element" && head2.tagName === "col";
  }
  function tbody(node2, index2, parent) {
    const previous2 = siblingBefore(parent, index2);
    const head2 = siblingAfter(node2, -1);
    if (parent && previous2 && previous2.type === "element" && (previous2.tagName === "thead" || previous2.tagName === "tbody") && closing(previous2, parent.children.indexOf(previous2), parent)) {
      return false;
    }
    return head2 && head2.type === "element" && head2.tagName === "tr";
  }
  const constants = {
    // See: <https://html.spec.whatwg.org/#attribute-name-state>.
    name: [
      ["	\n\f\r &/=>".split(""), "	\n\f\r \"&'/=>`".split("")],
      [`\0	
\f\r "&'/<=>`.split(""), "\0	\n\f\r \"&'/<=>`".split("")]
    ],
    // See: <https://html.spec.whatwg.org/#attribute-value-(unquoted)-state>.
    unquoted: [
      ["	\n\f\r &>".split(""), "\0	\n\f\r \"&'<=>`".split("")],
      ["\0	\n\f\r \"&'<=>`".split(""), "\0	\n\f\r \"&'<=>`".split("")]
    ],
    // See: <https://html.spec.whatwg.org/#attribute-value-(single-quoted)-state>.
    single: [
      ["&'".split(""), "\"&'`".split("")],
      ["\0&'".split(""), "\0\"&'`".split("")]
    ],
    // See: <https://html.spec.whatwg.org/#attribute-value-(double-quoted)-state>.
    double: [
      ['"&'.split(""), "\"&'`".split("")],
      ['\0"&'.split(""), "\0\"&'`".split("")]
    ]
  };
  function element(node2, index2, parent, state) {
    const schema = state.schema;
    const omit = schema.space === "svg" ? false : state.settings.omitOptionalTags;
    let selfClosing = schema.space === "svg" ? state.settings.closeEmptyElements : state.settings.voids.includes(node2.tagName.toLowerCase());
    const parts = [];
    let last;
    if (schema.space === "html" && node2.tagName === "svg") {
      state.schema = svg;
    }
    const attrs = serializeAttributes(state, node2.properties);
    const content2 = state.all(
      schema.space === "html" && node2.tagName === "template" ? node2.content : node2
    );
    state.schema = schema;
    if (content2)
      selfClosing = false;
    if (attrs || !omit || !opening(node2, index2, parent)) {
      parts.push("<", node2.tagName, attrs ? " " + attrs : "");
      if (selfClosing && (schema.space === "svg" || state.settings.closeSelfClosing)) {
        last = attrs.charAt(attrs.length - 1);
        if (!state.settings.tightSelfClosing || last === "/" || last && last !== '"' && last !== "'") {
          parts.push(" ");
        }
        parts.push("/");
      }
      parts.push(">");
    }
    parts.push(content2);
    if (!selfClosing && (!omit || !closing(node2, index2, parent))) {
      parts.push("</" + node2.tagName + ">");
    }
    return parts.join("");
  }
  function serializeAttributes(state, props) {
    const values = [];
    let index2 = -1;
    let key2;
    if (props) {
      for (key2 in props) {
        if (props[key2] !== void 0 && props[key2] !== null) {
          const value2 = serializeAttribute(state, key2, props[key2]);
          if (value2)
            values.push(value2);
        }
      }
    }
    while (++index2 < values.length) {
      const last = state.settings.tightAttributes ? values[index2].charAt(values[index2].length - 1) : null;
      if (index2 !== values.length - 1 && last !== '"' && last !== "'") {
        values[index2] += " ";
      }
    }
    return values.join("");
  }
  function serializeAttribute(state, key2, value2) {
    const info = find(state.schema, key2);
    const x2 = state.settings.allowParseErrors && state.schema.space === "html" ? 0 : 1;
    const y2 = state.settings.allowDangerousCharacters ? 0 : 1;
    let quote = state.quote;
    let result;
    if (info.overloadedBoolean && (value2 === info.attribute || value2 === "")) {
      value2 = true;
    } else if (info.boolean || info.overloadedBoolean && typeof value2 !== "string") {
      value2 = Boolean(value2);
    }
    if (value2 === void 0 || value2 === null || value2 === false || typeof value2 === "number" && Number.isNaN(value2)) {
      return "";
    }
    const name = stringifyEntities(
      info.attribute,
      Object.assign({}, state.settings.characterReferences, {
        // Always encode without parse errors in non-HTML.
        subset: constants.name[x2][y2]
      })
    );
    if (value2 === true)
      return name;
    value2 = Array.isArray(value2) ? (info.commaSeparated ? stringify$1 : stringify)(value2, {
      padLeft: !state.settings.tightCommaSeparatedLists
    }) : String(value2);
    if (state.settings.collapseEmptyAttributes && !value2)
      return name;
    if (state.settings.preferUnquoted) {
      result = stringifyEntities(
        value2,
        Object.assign({}, state.settings.characterReferences, {
          subset: constants.unquoted[x2][y2],
          attribute: true
        })
      );
    }
    if (result !== value2) {
      if (state.settings.quoteSmart && ccount(value2, quote) > ccount(value2, state.alternative)) {
        quote = state.alternative;
      }
      result = quote + stringifyEntities(
        value2,
        Object.assign({}, state.settings.characterReferences, {
          // Always encode without parse errors in non-HTML.
          subset: (quote === "'" ? constants.single : constants.double)[x2][y2],
          attribute: true
        })
      ) + quote;
    }
    return name + (result ? "=" + result : result);
  }
  function text(node2, _2, parent, state) {
    return parent && parent.type === "element" && (parent.tagName === "script" || parent.tagName === "style") ? node2.value : stringifyEntities(
      node2.value,
      Object.assign({}, state.settings.characterReferences, {
        subset: ["<", "&"]
      })
    );
  }
  function raw(node2, index2, parent, state) {
    return state.settings.allowDangerousHtml ? node2.value : text(node2, index2, parent, state);
  }
  function root(node2, _1, _2, state) {
    return state.all(node2);
  }
  const handle = zwitch("type", {
    invalid,
    unknown,
    handlers: { comment, doctype, element, raw, root, text }
  });
  function invalid(node2) {
    throw new Error("Expected node, not `" + node2 + "`");
  }
  function unknown(node2) {
    throw new Error("Cannot compile unknown node `" + node2.type + "`");
  }
  function toHtml$1(tree, options2) {
    const options_ = options2 || {};
    const quote = options_.quote || '"';
    const alternative = quote === '"' ? "'" : '"';
    if (quote !== '"' && quote !== "'") {
      throw new Error("Invalid quote `" + quote + "`, expected `'` or `\"`");
    }
    const state = {
      one,
      all,
      settings: {
        omitOptionalTags: options_.omitOptionalTags || false,
        allowParseErrors: options_.allowParseErrors || false,
        allowDangerousCharacters: options_.allowDangerousCharacters || false,
        quoteSmart: options_.quoteSmart || false,
        preferUnquoted: options_.preferUnquoted || false,
        tightAttributes: options_.tightAttributes || false,
        upperDoctype: options_.upperDoctype || false,
        tightDoctype: options_.tightDoctype || false,
        bogusComments: options_.bogusComments || false,
        tightCommaSeparatedLists: options_.tightCommaSeparatedLists || false,
        tightSelfClosing: options_.tightSelfClosing || false,
        collapseEmptyAttributes: options_.collapseEmptyAttributes || false,
        allowDangerousHtml: options_.allowDangerousHtml || false,
        voids: options_.voids || htmlVoidElements,
        characterReferences: options_.characterReferences || options_.entities || {},
        closeSelfClosing: options_.closeSelfClosing || false,
        closeEmptyElements: options_.closeEmptyElements || false
      },
      schema: options_.space === "svg" ? svg : html$2,
      quote,
      alternative
    };
    return state.one(
      Array.isArray(tree) ? { type: "root", children: tree } : tree,
      void 0,
      void 0
    );
  }
  function one(node2, index2, parent) {
    return handle(node2, index2, parent, this);
  }
  function all(parent) {
    const results = [];
    const children = parent && parent.children || [];
    let index2 = -1;
    while (++index2 < children.length) {
      results[index2] = this.one(children[index2], index2, parent);
    }
    return results.join("");
  }
  function fromMarkdown(content2, options2) {
    return fromMarkdown$1(content2, {
      ...options2,
      extensions: [frontmatter(["yaml"]), gfm()].concat((options2 == null ? void 0 : options2.extensions) ?? []),
      mdastExtensions: [frontmatterFromMarkdown(["yaml"]), gfmFromMarkdown()].concat((options2 == null ? void 0 : options2.mdastExtensions) ?? [])
    });
  }
  function toMarkdown(ast, options2) {
    return toMarkdown$1(ast, {
      bullet: "-",
      bulletOther: "*",
      bulletOrdered: ".",
      emphasis: "*",
      fence: "`",
      fences: true,
      listItemIndent: "one",
      resourceLink: false,
      rule: "-",
      ruleRepetition: 3,
      ruleSpaces: false,
      strong: "*",
      ...options2,
      extensions: [frontmatterToMarkdown(["yaml"]), gfmToMarkdown()].concat((options2 == null ? void 0 : options2.extensions) ?? [])
    });
  }
  function toHtml(node2) {
    return toHtml$1(toHast(node2));
  }
  function flatMap(tree, fn2) {
    function transform2(node2, i2, parent) {
      if ("children" in node2) {
        const p2 = node2;
        p2.children = p2.children.flatMap((item, i22) => transform2(item, i22, p2));
      }
      return fn2(node2, i2, parent);
    }
    return transform2(tree, 0, void 0)[0];
  }
  async function exportToText() {
    if (!checkIfConversationStarted()) {
      alert("Please start a conversation first.");
      return false;
    }
    const {
      conversations
    } = await getConversations();
    const text2 = conversations.map((item) => {
      var _a, _b;
      const author = ((_a = item.message) == null ? void 0 : _a.author.role) === "assistant" ? "ChatGPT" : "You";
      const content2 = ((_b = item.message) == null ? void 0 : _b.content.parts.join("\n")) ?? "";
      let message = content2;
      if (author === "ChatGPT") {
        const root2 = fromMarkdown(content2);
        flatMap(root2, (item2) => {
          if (item2.type === "strong")
            return item2.children;
          if (item2.type === "emphasis")
            return item2.children;
          return [item2];
        });
        message = toMarkdown(root2);
      }
      return `${author}:
${message}`;
    }).join("\n\n");
    copyToClipboard(standardizeLineBreaks(text2));
    return true;
  }
  /*!
   * html2canvas 1.4.1 <https://html2canvas.hertzen.com>
   * Copyright (c) 2022 Niklas von Hertzen <https://hertzen.com>
   * Released under MIT License
   */
  /*! *****************************************************************************
  	Copyright (c) Microsoft Corporation.
  
  	Permission to use, copy, modify, and/or distribute this software for any
  	purpose with or without fee is hereby granted.
  
  	THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  	REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  	AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  	INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  	LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  	OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  	PERFORMANCE OF THIS SOFTWARE.
  	***************************************************************************** */
  var extendStatics = function(d2, b2) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d3, b3) {
      d3.__proto__ = b3;
    } || function(d3, b3) {
      for (var p2 in b3)
        if (Object.prototype.hasOwnProperty.call(b3, p2))
          d3[p2] = b3[p2];
    };
    return extendStatics(d2, b2);
  };
  function __extends(d2, b2) {
    if (typeof b2 !== "function" && b2 !== null)
      throw new TypeError("Class extends value " + String(b2) + " is not a constructor or null");
    extendStatics(d2, b2);
    function __() {
      this.constructor = d2;
    }
    d2.prototype = b2 === null ? Object.create(b2) : (__.prototype = b2.prototype, new __());
  }
  var __assign = function() {
    __assign = Object.assign || function __assign2(t2) {
      for (var s2, i2 = 1, n2 = arguments.length; i2 < n2; i2++) {
        s2 = arguments[i2];
        for (var p2 in s2)
          if (Object.prototype.hasOwnProperty.call(s2, p2))
            t2[p2] = s2[p2];
      }
      return t2;
    };
    return __assign.apply(this, arguments);
  };
  function __awaiter(thisArg, _arguments, P2, generator) {
    function adopt(value2) {
      return value2 instanceof P2 ? value2 : new P2(function(resolve) {
        resolve(value2);
      });
    }
    return new (P2 || (P2 = Promise))(function(resolve, reject) {
      function fulfilled(value2) {
        try {
          step(generator.next(value2));
        } catch (e2) {
          reject(e2);
        }
      }
      function rejected(value2) {
        try {
          step(generator["throw"](value2));
        } catch (e2) {
          reject(e2);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  }
  function __generator(thisArg, body2) {
    var _2 = { label: 0, sent: function() {
      if (t2[0] & 1)
        throw t2[1];
      return t2[1];
    }, trys: [], ops: [] }, f2, y2, t2, g2;
    return g2 = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g2[Symbol.iterator] = function() {
      return this;
    }), g2;
    function verb(n2) {
      return function(v2) {
        return step([n2, v2]);
      };
    }
    function step(op) {
      if (f2)
        throw new TypeError("Generator is already executing.");
      while (_2)
        try {
          if (f2 = 1, y2 && (t2 = op[0] & 2 ? y2["return"] : op[0] ? y2["throw"] || ((t2 = y2["return"]) && t2.call(y2), 0) : y2.next) && !(t2 = t2.call(y2, op[1])).done)
            return t2;
          if (y2 = 0, t2)
            op = [op[0] & 2, t2.value];
          switch (op[0]) {
            case 0:
            case 1:
              t2 = op;
              break;
            case 4:
              _2.label++;
              return { value: op[1], done: false };
            case 5:
              _2.label++;
              y2 = op[1];
              op = [0];
              continue;
            case 7:
              op = _2.ops.pop();
              _2.trys.pop();
              continue;
            default:
              if (!(t2 = _2.trys, t2 = t2.length > 0 && t2[t2.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _2 = 0;
                continue;
              }
              if (op[0] === 3 && (!t2 || op[1] > t2[0] && op[1] < t2[3])) {
                _2.label = op[1];
                break;
              }
              if (op[0] === 6 && _2.label < t2[1]) {
                _2.label = t2[1];
                t2 = op;
                break;
              }
              if (t2 && _2.label < t2[2]) {
                _2.label = t2[2];
                _2.ops.push(op);
                break;
              }
              if (t2[2])
                _2.ops.pop();
              _2.trys.pop();
              continue;
          }
          op = body2.call(thisArg, _2);
        } catch (e2) {
          op = [6, e2];
          y2 = 0;
        } finally {
          f2 = t2 = 0;
        }
      if (op[0] & 5)
        throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  }
  function __spreadArray(to, from, pack2) {
    if (pack2 || arguments.length === 2)
      for (var i2 = 0, l2 = from.length, ar; i2 < l2; i2++) {
        if (ar || !(i2 in from)) {
          if (!ar)
            ar = Array.prototype.slice.call(from, 0, i2);
          ar[i2] = from[i2];
        }
      }
    return to.concat(ar || from);
  }
  var Bounds = (
    /** @class */
    function() {
      function Bounds2(left, top, width, height) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
      }
      Bounds2.prototype.add = function(x2, y2, w2, h2) {
        return new Bounds2(this.left + x2, this.top + y2, this.width + w2, this.height + h2);
      };
      Bounds2.fromClientRect = function(context, clientRect) {
        return new Bounds2(clientRect.left + context.windowBounds.left, clientRect.top + context.windowBounds.top, clientRect.width, clientRect.height);
      };
      Bounds2.fromDOMRectList = function(context, domRectList) {
        var domRect = Array.from(domRectList).find(function(rect) {
          return rect.width !== 0;
        });
        return domRect ? new Bounds2(domRect.left + context.windowBounds.left, domRect.top + context.windowBounds.top, domRect.width, domRect.height) : Bounds2.EMPTY;
      };
      Bounds2.EMPTY = new Bounds2(0, 0, 0, 0);
      return Bounds2;
    }()
  );
  var parseBounds = function(context, node2) {
    return Bounds.fromClientRect(context, node2.getBoundingClientRect());
  };
  var parseDocumentSize = function(document2) {
    var body2 = document2.body;
    var documentElement = document2.documentElement;
    if (!body2 || !documentElement) {
      throw new Error("Unable to get document size");
    }
    var width = Math.max(Math.max(body2.scrollWidth, documentElement.scrollWidth), Math.max(body2.offsetWidth, documentElement.offsetWidth), Math.max(body2.clientWidth, documentElement.clientWidth));
    var height = Math.max(Math.max(body2.scrollHeight, documentElement.scrollHeight), Math.max(body2.offsetHeight, documentElement.offsetHeight), Math.max(body2.clientHeight, documentElement.clientHeight));
    return new Bounds(0, 0, width, height);
  };
  var toCodePoints$1 = function(str) {
    var codePoints = [];
    var i2 = 0;
    var length = str.length;
    while (i2 < length) {
      var value2 = str.charCodeAt(i2++);
      if (value2 >= 55296 && value2 <= 56319 && i2 < length) {
        var extra = str.charCodeAt(i2++);
        if ((extra & 64512) === 56320) {
          codePoints.push(((value2 & 1023) << 10) + (extra & 1023) + 65536);
        } else {
          codePoints.push(value2);
          i2--;
        }
      } else {
        codePoints.push(value2);
      }
    }
    return codePoints;
  };
  var fromCodePoint$1 = function() {
    var codePoints = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      codePoints[_i] = arguments[_i];
    }
    if (String.fromCodePoint) {
      return String.fromCodePoint.apply(String, codePoints);
    }
    var length = codePoints.length;
    if (!length) {
      return "";
    }
    var codeUnits = [];
    var index2 = -1;
    var result = "";
    while (++index2 < length) {
      var codePoint = codePoints[index2];
      if (codePoint <= 65535) {
        codeUnits.push(codePoint);
      } else {
        codePoint -= 65536;
        codeUnits.push((codePoint >> 10) + 55296, codePoint % 1024 + 56320);
      }
      if (index2 + 1 === length || codeUnits.length > 16384) {
        result += String.fromCharCode.apply(String, codeUnits);
        codeUnits.length = 0;
      }
    }
    return result;
  };
  var chars$2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var lookup$2 = typeof Uint8Array === "undefined" ? [] : new Uint8Array(256);
  for (var i$2 = 0; i$2 < chars$2.length; i$2++) {
    lookup$2[chars$2.charCodeAt(i$2)] = i$2;
  }
  var chars$1$1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var lookup$1$1 = typeof Uint8Array === "undefined" ? [] : new Uint8Array(256);
  for (var i$1$1 = 0; i$1$1 < chars$1$1.length; i$1$1++) {
    lookup$1$1[chars$1$1.charCodeAt(i$1$1)] = i$1$1;
  }
  var decode$1 = function(base642) {
    var bufferLength = base642.length * 0.75, len = base642.length, i2, p2 = 0, encoded1, encoded2, encoded3, encoded4;
    if (base642[base642.length - 1] === "=") {
      bufferLength--;
      if (base642[base642.length - 2] === "=") {
        bufferLength--;
      }
    }
    var buffer = typeof ArrayBuffer !== "undefined" && typeof Uint8Array !== "undefined" && typeof Uint8Array.prototype.slice !== "undefined" ? new ArrayBuffer(bufferLength) : new Array(bufferLength);
    var bytes = Array.isArray(buffer) ? buffer : new Uint8Array(buffer);
    for (i2 = 0; i2 < len; i2 += 4) {
      encoded1 = lookup$1$1[base642.charCodeAt(i2)];
      encoded2 = lookup$1$1[base642.charCodeAt(i2 + 1)];
      encoded3 = lookup$1$1[base642.charCodeAt(i2 + 2)];
      encoded4 = lookup$1$1[base642.charCodeAt(i2 + 3)];
      bytes[p2++] = encoded1 << 2 | encoded2 >> 4;
      bytes[p2++] = (encoded2 & 15) << 4 | encoded3 >> 2;
      bytes[p2++] = (encoded3 & 3) << 6 | encoded4 & 63;
    }
    return buffer;
  };
  var polyUint16Array$1 = function(buffer) {
    var length = buffer.length;
    var bytes = [];
    for (var i2 = 0; i2 < length; i2 += 2) {
      bytes.push(buffer[i2 + 1] << 8 | buffer[i2]);
    }
    return bytes;
  };
  var polyUint32Array$1 = function(buffer) {
    var length = buffer.length;
    var bytes = [];
    for (var i2 = 0; i2 < length; i2 += 4) {
      bytes.push(buffer[i2 + 3] << 24 | buffer[i2 + 2] << 16 | buffer[i2 + 1] << 8 | buffer[i2]);
    }
    return bytes;
  };
  var UTRIE2_SHIFT_2$1 = 5;
  var UTRIE2_SHIFT_1$1 = 6 + 5;
  var UTRIE2_INDEX_SHIFT$1 = 2;
  var UTRIE2_SHIFT_1_2$1 = UTRIE2_SHIFT_1$1 - UTRIE2_SHIFT_2$1;
  var UTRIE2_LSCP_INDEX_2_OFFSET$1 = 65536 >> UTRIE2_SHIFT_2$1;
  var UTRIE2_DATA_BLOCK_LENGTH$1 = 1 << UTRIE2_SHIFT_2$1;
  var UTRIE2_DATA_MASK$1 = UTRIE2_DATA_BLOCK_LENGTH$1 - 1;
  var UTRIE2_LSCP_INDEX_2_LENGTH$1 = 1024 >> UTRIE2_SHIFT_2$1;
  var UTRIE2_INDEX_2_BMP_LENGTH$1 = UTRIE2_LSCP_INDEX_2_OFFSET$1 + UTRIE2_LSCP_INDEX_2_LENGTH$1;
  var UTRIE2_UTF8_2B_INDEX_2_OFFSET$1 = UTRIE2_INDEX_2_BMP_LENGTH$1;
  var UTRIE2_UTF8_2B_INDEX_2_LENGTH$1 = 2048 >> 6;
  var UTRIE2_INDEX_1_OFFSET$1 = UTRIE2_UTF8_2B_INDEX_2_OFFSET$1 + UTRIE2_UTF8_2B_INDEX_2_LENGTH$1;
  var UTRIE2_OMITTED_BMP_INDEX_1_LENGTH$1 = 65536 >> UTRIE2_SHIFT_1$1;
  var UTRIE2_INDEX_2_BLOCK_LENGTH$1 = 1 << UTRIE2_SHIFT_1_2$1;
  var UTRIE2_INDEX_2_MASK$1 = UTRIE2_INDEX_2_BLOCK_LENGTH$1 - 1;
  var slice16$1 = function(view, start, end) {
    if (view.slice) {
      return view.slice(start, end);
    }
    return new Uint16Array(Array.prototype.slice.call(view, start, end));
  };
  var slice32$1 = function(view, start, end) {
    if (view.slice) {
      return view.slice(start, end);
    }
    return new Uint32Array(Array.prototype.slice.call(view, start, end));
  };
  var createTrieFromBase64$1 = function(base642, _byteLength) {
    var buffer = decode$1(base642);
    var view32 = Array.isArray(buffer) ? polyUint32Array$1(buffer) : new Uint32Array(buffer);
    var view16 = Array.isArray(buffer) ? polyUint16Array$1(buffer) : new Uint16Array(buffer);
    var headerLength = 24;
    var index2 = slice16$1(view16, headerLength / 2, view32[4] / 2);
    var data = view32[5] === 2 ? slice16$1(view16, (headerLength + view32[4]) / 2) : slice32$1(view32, Math.ceil((headerLength + view32[4]) / 4));
    return new Trie$1(view32[0], view32[1], view32[2], view32[3], index2, data);
  };
  var Trie$1 = (
    /** @class */
    function() {
      function Trie2(initialValue, errorValue, highStart, highValueIndex, index2, data) {
        this.initialValue = initialValue;
        this.errorValue = errorValue;
        this.highStart = highStart;
        this.highValueIndex = highValueIndex;
        this.index = index2;
        this.data = data;
      }
      Trie2.prototype.get = function(codePoint) {
        var ix;
        if (codePoint >= 0) {
          if (codePoint < 55296 || codePoint > 56319 && codePoint <= 65535) {
            ix = this.index[codePoint >> UTRIE2_SHIFT_2$1];
            ix = (ix << UTRIE2_INDEX_SHIFT$1) + (codePoint & UTRIE2_DATA_MASK$1);
            return this.data[ix];
          }
          if (codePoint <= 65535) {
            ix = this.index[UTRIE2_LSCP_INDEX_2_OFFSET$1 + (codePoint - 55296 >> UTRIE2_SHIFT_2$1)];
            ix = (ix << UTRIE2_INDEX_SHIFT$1) + (codePoint & UTRIE2_DATA_MASK$1);
            return this.data[ix];
          }
          if (codePoint < this.highStart) {
            ix = UTRIE2_INDEX_1_OFFSET$1 - UTRIE2_OMITTED_BMP_INDEX_1_LENGTH$1 + (codePoint >> UTRIE2_SHIFT_1$1);
            ix = this.index[ix];
            ix += codePoint >> UTRIE2_SHIFT_2$1 & UTRIE2_INDEX_2_MASK$1;
            ix = this.index[ix];
            ix = (ix << UTRIE2_INDEX_SHIFT$1) + (codePoint & UTRIE2_DATA_MASK$1);
            return this.data[ix];
          }
          if (codePoint <= 1114111) {
            return this.data[this.highValueIndex];
          }
        }
        return this.errorValue;
      };
      return Trie2;
    }()
  );
  var chars$3 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var lookup$3 = typeof Uint8Array === "undefined" ? [] : new Uint8Array(256);
  for (var i$3 = 0; i$3 < chars$3.length; i$3++) {
    lookup$3[chars$3.charCodeAt(i$3)] = i$3;
  }
  var base64$1 = "KwAAAAAAAAAACA4AUD0AADAgAAACAAAAAAAIABAAGABAAEgAUABYAGAAaABgAGgAYgBqAF8AZwBgAGgAcQB5AHUAfQCFAI0AlQCdAKIAqgCyALoAYABoAGAAaABgAGgAwgDKAGAAaADGAM4A0wDbAOEA6QDxAPkAAQEJAQ8BFwF1AH0AHAEkASwBNAE6AUIBQQFJAVEBWQFhAWgBcAF4ATAAgAGGAY4BlQGXAZ8BpwGvAbUBvQHFAc0B0wHbAeMB6wHxAfkBAQIJAvEBEQIZAiECKQIxAjgCQAJGAk4CVgJeAmQCbAJ0AnwCgQKJApECmQKgAqgCsAK4ArwCxAIwAMwC0wLbAjAA4wLrAvMC+AIAAwcDDwMwABcDHQMlAy0DNQN1AD0DQQNJA0kDSQNRA1EDVwNZA1kDdQB1AGEDdQBpA20DdQN1AHsDdQCBA4kDkQN1AHUAmQOhA3UAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AKYDrgN1AHUAtgO+A8YDzgPWAxcD3gPjA+sD8wN1AHUA+wMDBAkEdQANBBUEHQQlBCoEFwMyBDgEYABABBcDSARQBFgEYARoBDAAcAQzAXgEgASIBJAEdQCXBHUAnwSnBK4EtgS6BMIEyAR1AHUAdQB1AHUAdQCVANAEYABgAGAAYABgAGAAYABgANgEYADcBOQEYADsBPQE/AQEBQwFFAUcBSQFLAU0BWQEPAVEBUsFUwVbBWAAYgVgAGoFcgV6BYIFigWRBWAAmQWfBaYFYABgAGAAYABgAKoFYACxBbAFuQW6BcEFwQXHBcEFwQXPBdMF2wXjBeoF8gX6BQIGCgYSBhoGIgYqBjIGOgZgAD4GRgZMBmAAUwZaBmAAYABgAGAAYABgAGAAYABgAGAAYABgAGIGYABpBnAGYABgAGAAYABgAGAAYABgAGAAYAB4Bn8GhQZgAGAAYAB1AHcDFQSLBmAAYABgAJMGdQA9A3UAmwajBqsGqwaVALMGuwbDBjAAywbSBtIG1QbSBtIG0gbSBtIG0gbdBuMG6wbzBvsGAwcLBxMHAwcbByMHJwcsBywHMQcsB9IGOAdAB0gHTgfSBkgHVgfSBtIG0gbSBtIG0gbSBtIG0gbSBiwHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAdgAGAALAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAdbB2MHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsB2kH0gZwB64EdQB1AHUAdQB1AHUAdQB1AHUHfQdgAIUHjQd1AHUAlQedB2AAYAClB6sHYACzB7YHvgfGB3UAzgfWBzMB3gfmB1EB7gf1B/0HlQENAQUIDQh1ABUIHQglCBcDLQg1CD0IRQhNCEEDUwh1AHUAdQBbCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIcAh3CHoIMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIgggwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAALAcsBywHLAcsBywHLAcsBywHLAcsB4oILAcsB44I0gaWCJ4Ipgh1AHUAqgiyCHUAdQB1AHUAdQB1AHUAdQB1AHUAtwh8AXUAvwh1AMUIyQjRCNkI4AjoCHUAdQB1AO4I9gj+CAYJDgkTCS0HGwkjCYIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiAAIAAAAFAAYABgAGIAXwBgAHEAdQBFAJUAogCyAKAAYABgAEIA4ABGANMA4QDxAMEBDwE1AFwBLAE6AQEBUQF4QkhCmEKoQrhCgAHIQsAB0MLAAcABwAHAAeDC6ABoAHDCwMMAAcABwAHAAdDDGMMAAcAB6MM4wwjDWMNow3jDaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAEjDqABWw6bDqABpg6gAaABoAHcDvwOPA+gAaABfA/8DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DpcPAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcAB9cPKwkyCToJMAB1AHUAdQBCCUoJTQl1AFUJXAljCWcJawkwADAAMAAwAHMJdQB2CX4JdQCECYoJjgmWCXUAngkwAGAAYABxAHUApgn3A64JtAl1ALkJdQDACTAAMAAwADAAdQB1AHUAdQB1AHUAdQB1AHUAowYNBMUIMAAwADAAMADICcsJ0wnZCRUE4QkwAOkJ8An4CTAAMAB1AAAKvwh1AAgKDwoXCh8KdQAwACcKLgp1ADYKqAmICT4KRgowADAAdQB1AE4KMAB1AFYKdQBeCnUAZQowADAAMAAwADAAMAAwADAAMAAVBHUAbQowADAAdQC5CXUKMAAwAHwBxAijBogEMgF9CoQKiASMCpQKmgqIBKIKqgquCogEDQG2Cr4KxgrLCjAAMADTCtsKCgHjCusK8Qr5CgELMAAwADAAMAB1AIsECQsRC3UANAEZCzAAMAAwADAAMAB1ACELKQswAHUANAExCzkLdQBBC0kLMABRC1kLMAAwADAAMAAwADAAdQBhCzAAMAAwAGAAYABpC3ELdwt/CzAAMACHC4sLkwubC58Lpwt1AK4Ltgt1APsDMAAwADAAMAAwADAAMAAwAL4LwwvLC9IL1wvdCzAAMADlC+kL8Qv5C/8LSQswADAAMAAwADAAMAAwADAAMAAHDDAAMAAwADAAMAAODBYMHgx1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1ACYMMAAwADAAdQB1AHUALgx1AHUAdQB1AHUAdQA2DDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AD4MdQBGDHUAdQB1AHUAdQB1AEkMdQB1AHUAdQB1AFAMMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQBYDHUAdQB1AF8MMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUA+wMVBGcMMAAwAHwBbwx1AHcMfwyHDI8MMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAYABgAJcMMAAwADAAdQB1AJ8MlQClDDAAMACtDCwHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsB7UMLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AA0EMAC9DDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAsBywHLAcsBywHLAcsBywHLQcwAMEMyAwsBywHLAcsBywHLAcsBywHLAcsBywHzAwwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1ANQM2QzhDDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMABgAGAAYABgAGAAYABgAOkMYADxDGAA+AwADQYNYABhCWAAYAAODTAAMAAwADAAFg1gAGAAHg37AzAAMAAwADAAYABgACYNYAAsDTQNPA1gAEMNPg1LDWAAYABgAGAAYABgAGAAYABgAGAAUg1aDYsGVglhDV0NcQBnDW0NdQ15DWAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAlQCBDZUAiA2PDZcNMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAnw2nDTAAMAAwADAAMAAwAHUArw23DTAAMAAwADAAMAAwADAAMAAwADAAMAB1AL8NMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAB1AHUAdQB1AHUAdQDHDTAAYABgAM8NMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAA1w11ANwNMAAwAD0B5A0wADAAMAAwADAAMADsDfQN/A0EDgwOFA4wABsOMAAwADAAMAAwADAAMAAwANIG0gbSBtIG0gbSBtIG0gYjDigOwQUuDsEFMw7SBjoO0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGQg5KDlIOVg7SBtIGXg5lDm0OdQ7SBtIGfQ6EDooOjQ6UDtIGmg6hDtIG0gaoDqwO0ga0DrwO0gZgAGAAYADEDmAAYAAkBtIGzA5gANIOYADaDokO0gbSBt8O5w7SBu8O0gb1DvwO0gZgAGAAxA7SBtIG0gbSBtIGYABgAGAAYAAED2AAsAUMD9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGFA8sBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAccD9IGLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHJA8sBywHLAcsBywHLAccDywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywPLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAc0D9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAccD9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGFA8sBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHPA/SBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gYUD0QPlQCVAJUAMAAwADAAMACVAJUAlQCVAJUAlQCVAEwPMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAA//8EAAQABAAEAAQABAAEAAQABAANAAMAAQABAAIABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQACgATABcAHgAbABoAHgAXABYAEgAeABsAGAAPABgAHABLAEsASwBLAEsASwBLAEsASwBLABgAGAAeAB4AHgATAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABYAGwASAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAWAA0AEQAeAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAFAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAJABYAGgAbABsAGwAeAB0AHQAeAE8AFwAeAA0AHgAeABoAGwBPAE8ADgBQAB0AHQAdAE8ATwAXAE8ATwBPABYAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAFAATwBAAE8ATwBPAEAATwBQAFAATwBQAB4AHgAeAB4AHgAeAB0AHQAdAB0AHgAdAB4ADgBQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgBQAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAJAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAkACQAJAAkACQAJAAkABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAFAAHgAeAB4AKwArAFAAUABQAFAAGABQACsAKwArACsAHgAeAFAAHgBQAFAAUAArAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUAAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAYAA0AKwArAB4AHgAbACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQADQAEAB4ABAAEAB4ABAAEABMABAArACsAKwArACsAKwArACsAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAKwArACsAKwBWAFYAVgBWAB4AHgArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AGgAaABoAGAAYAB4AHgAEAAQABAAEAAQABAAEAAQABAAEAAQAEwAEACsAEwATAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABLAEsASwBLAEsASwBLAEsASwBLABoAGQAZAB4AUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABMAUAAEAAQABAAEAAQABAAEAB4AHgAEAAQABAAEAAQABABQAFAABAAEAB4ABAAEAAQABABQAFAASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUAAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAFAABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQAUABQAB4AHgAYABMAUAArACsABAAbABsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAFAABAAEAAQABAAEAFAABAAEAAQAUAAEAAQABAAEAAQAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAArACsAHgArAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAUAAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAABAAEAA0ADQBLAEsASwBLAEsASwBLAEsASwBLAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUAArACsAKwBQAFAAUABQACsAKwAEAFAABAAEAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABABQACsAKwArACsAKwArACsAKwAEACsAKwArACsAUABQACsAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUAAaABoAUABQAFAAUABQAEwAHgAbAFAAHgAEACsAKwAEAAQABAArAFAAUABQAFAAUABQACsAKwArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQACsAUABQACsAKwAEACsABAAEAAQABAAEACsAKwArACsABAAEACsAKwAEAAQABAArACsAKwAEACsAKwArACsAKwArACsAUABQAFAAUAArAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLAAQABABQAFAAUAAEAB4AKwArACsAKwArACsAKwArACsAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQACsAKwAEAFAABAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAArACsAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAB4AGwArACsAKwArACsAKwArAFAABAAEAAQABAAEAAQAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABAArACsAKwArACsAKwArAAQABAAEACsAKwArACsAUABQACsAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAB4AUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAAQAUAArAFAAUABQAFAAUABQACsAKwArAFAAUABQACsAUABQAFAAUAArACsAKwBQAFAAKwBQACsAUABQACsAKwArAFAAUAArACsAKwBQAFAAUAArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArAAQABAAEAAQABAArACsAKwAEAAQABAArAAQABAAEAAQAKwArAFAAKwArACsAKwArACsABAArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAHgAeAB4AHgAeAB4AGwAeACsAKwArACsAKwAEAAQABAAEAAQAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAUAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAAEACsAKwArACsAKwArACsABAAEACsAUABQAFAAKwArACsAKwArAFAAUAAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKwAOAFAAUABQAFAAUABQAFAAHgBQAAQABAAEAA4AUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAKwArAAQAUAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAAEACsAKwArACsAKwArACsABAAEACsAKwArACsAKwArACsAUAArAFAAUAAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwBQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAFAABAAEAAQABAAEAAQABAArAAQABAAEACsABAAEAAQABABQAB4AKwArACsAKwBQAFAAUAAEAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQABoAUABQAFAAUABQAFAAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQACsAUAArACsAUABQAFAAUABQAFAAUAArACsAKwAEACsAKwArACsABAAEAAQABAAEAAQAKwAEACsABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArAAQABAAeACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAXAAqACoAKgAqACoAKgAqACsAKwArACsAGwBcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAeAEsASwBLAEsASwBLAEsASwBLAEsADQANACsAKwArACsAKwBcAFwAKwBcACsAXABcAFwAXABcACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAXAArAFwAXABcAFwAXABcAFwAXABcAFwAKgBcAFwAKgAqACoAKgAqACoAKgAqACoAXAArACsAXABcAFwAXABcACsAXAArACoAKgAqACoAKgAqACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwBcAFwAXABcAFAADgAOAA4ADgAeAA4ADgAJAA4ADgANAAkAEwATABMAEwATAAkAHgATAB4AHgAeAAQABAAeAB4AHgAeAB4AHgBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQAFAADQAEAB4ABAAeAAQAFgARABYAEQAEAAQAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQADQAEAAQABAAEAAQADQAEAAQAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAA0ADQAeAB4AHgAeAB4AHgAEAB4AHgAeAB4AHgAeACsAHgAeAA4ADgANAA4AHgAeAB4AHgAeAAkACQArACsAKwArACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgBcAEsASwBLAEsASwBLAEsASwBLAEsADQANAB4AHgAeAB4AXABcAFwAXABcAFwAKgAqACoAKgBcAFwAXABcACoAKgAqAFwAKgAqACoAXABcACoAKgAqACoAKgAqACoAXABcAFwAKgAqACoAKgBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKgAqAFwAKgBLAEsASwBLAEsASwBLAEsASwBLACoAKgAqACoAKgAqAFAAUABQAFAAUABQACsAUAArACsAKwArACsAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgBQAFAAUABQAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAKwBQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsABAAEAAQAHgANAB4AHgAeAB4AHgAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUAArACsADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAWABEAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAA0ADQANAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAANAA0AKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUAArAAQABAArACsAKwArACsAKwArACsAKwArACsAKwBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqAA0ADQAVAFwADQAeAA0AGwBcACoAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwAeAB4AEwATAA0ADQAOAB4AEwATAB4ABAAEAAQACQArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUAAEAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAHgArACsAKwATABMASwBLAEsASwBLAEsASwBLAEsASwBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAArACsAXABcAFwAXABcACsAKwArACsAKwArACsAKwArACsAKwBcAFwAXABcAFwAXABcAFwAXABcAFwAXAArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAXAArACsAKwAqACoAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAArACsAHgAeAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKwAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKwArAAQASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArACoAKgAqACoAKgAqACoAXAAqACoAKgAqACoAKgArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABABQAFAAUABQAFAAUABQACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwANAA0AHgANAA0ADQANAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQAHgAeAB4AHgAeAB4AHgAeAB4AKwArACsABAAEAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwAeAB4AHgAeAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArAA0ADQANAA0ADQBLAEsASwBLAEsASwBLAEsASwBLACsAKwArAFAAUABQAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAA0ADQBQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUAAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArAAQABAAEAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAAQAUABQAFAAUABQAFAABABQAFAABAAEAAQAUAArACsAKwArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAKwBQACsAUAArAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAFAAUABQACsAHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQACsAKwAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQACsAHgAeAB4AHgAeAB4AHgAOAB4AKwANAA0ADQANAA0ADQANAAkADQANAA0ACAAEAAsABAAEAA0ACQANAA0ADAAdAB0AHgAXABcAFgAXABcAFwAWABcAHQAdAB4AHgAUABQAFAANAAEAAQAEAAQABAAEAAQACQAaABoAGgAaABoAGgAaABoAHgAXABcAHQAVABUAHgAeAB4AHgAeAB4AGAAWABEAFQAVABUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ADQAeAA0ADQANAA0AHgANAA0ADQAHAB4AHgAeAB4AKwAEAAQABAAEAAQABAAEAAQABAAEAFAAUAArACsATwBQAFAAUABQAFAAHgAeAB4AFgARAE8AUABPAE8ATwBPAFAAUABQAFAAUAAeAB4AHgAWABEAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArABsAGwAbABsAGwAbABsAGgAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGgAbABsAGwAbABoAGwAbABoAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAHgAeAFAAGgAeAB0AHgBQAB4AGgAeAB4AHgAeAB4AHgAeAB4AHgBPAB4AUAAbAB4AHgBQAFAAUABQAFAAHgAeAB4AHQAdAB4AUAAeAFAAHgBQAB4AUABPAFAAUAAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAHgBQAFAAUABQAE8ATwBQAFAAUABQAFAATwBQAFAATwBQAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAFAAUABQAFAATwBPAE8ATwBPAE8ATwBPAE8ATwBQAFAAUABQAFAAUABQAFAAUAAeAB4AUABQAFAAUABPAB4AHgArACsAKwArAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHQAdAB4AHgAeAB0AHQAeAB4AHQAeAB4AHgAdAB4AHQAbABsAHgAdAB4AHgAeAB4AHQAeAB4AHQAdAB0AHQAeAB4AHQAeAB0AHgAdAB0AHQAdAB0AHQAeAB0AHgAeAB4AHgAeAB0AHQAdAB0AHgAeAB4AHgAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHgAeAB0AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAeAB0AHQAdAB0AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAeAB4AHgAdAB4AHgAeAB4AHgAeAB4AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAWABEAHgAeAB4AHgAeAB4AHQAeAB4AHgAeAB4AHgAeACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAWABEAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAFAAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAeAB4AHQAdAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHQAdAB4AHgAeAB4AHQAdAB0AHgAeAB0AHgAeAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlAB4AHQAdAB4AHgAdAB4AHgAeAB4AHQAdAB4AHgAeAB4AJQAlAB0AHQAlAB4AJQAlACUAIAAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAeAB4AHgAeAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAdAB0AHQAeAB0AJQAdAB0AHgAdAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAdAB0AHQAdACUAHgAlACUAJQAdACUAJQAdAB0AHQAlACUAHQAdACUAHQAdACUAJQAlAB4AHQAeAB4AHgAeAB0AHQAlAB0AHQAdAB0AHQAdACUAJQAlACUAJQAdACUAJQAgACUAHQAdACUAJQAlACUAJQAlACUAJQAeAB4AHgAlACUAIAAgACAAIAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AFwAXABcAFwAXABcAHgATABMAJQAeAB4AHgAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAFgARABYAEQAWABEAFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAEAAQABAAeAB4AKwArACsAKwArABMADQANAA0AUAATAA0AUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUAANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAA0ADQANAA0ADQANAA0ADQAeAA0AFgANAB4AHgAXABcAHgAeABcAFwAWABEAFgARABYAEQAWABEADQANAA0ADQATAFAADQANAB4ADQANAB4AHgAeAB4AHgAMAAwADQANAA0AHgANAA0AFgANAA0ADQANAA0ADQANAA0AHgANAB4ADQANAB4AHgAeACsAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArAA0AEQARACUAJQBHAFcAVwAWABEAFgARABYAEQAWABEAFgARACUAJQAWABEAFgARABYAEQAWABEAFQAWABEAEQAlAFcAVwBXAFcAVwBXAFcAVwBXAAQABAAEAAQABAAEACUAVwBXAFcAVwA2ACUAJQBXAFcAVwBHAEcAJQAlACUAKwBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBRAFcAUQBXAFEAVwBXAFcAVwBXAFcAUQBXAFcAVwBXAFcAVwBRAFEAKwArAAQABAAVABUARwBHAFcAFQBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBRAFcAVwBXAFcAVwBXAFEAUQBXAFcAVwBXABUAUQBHAEcAVwArACsAKwArACsAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwAlACUAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACsAKwArACsAKwArACsAKwArACsAKwArAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBPAE8ATwBPAE8ATwBPAE8AJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADQATAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABLAEsASwBLAEsASwBLAEsASwBLAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAABAAEAAQABAAeAAQABAAEAAQABAAEAAQABAAEAAQAHgBQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUABQAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAeAA0ADQANAA0ADQArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAB4AHgAeAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAAQAUABQAFAABABQAFAAUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAeAB4AHgAeAAQAKwArACsAUABQAFAAUABQAFAAHgAeABoAHgArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADgAOABMAEwArACsAKwArACsAKwArACsABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwANAA0ASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUAAeAB4AHgBQAA4AUABQAAQAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAA0ADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArAB4AWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYACsAKwArAAQAHgAeAB4AHgAeAB4ADQANAA0AHgAeAB4AHgArAFAASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArAB4AHgBcAFwAXABcAFwAKgBcAFwAXABcAFwAXABcAFwAXABcAEsASwBLAEsASwBLAEsASwBLAEsAXABcAFwAXABcACsAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArAFAAUABQAAQAUABQAFAAUABQAFAAUABQAAQABAArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAHgANAA0ADQBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAXAAqACoAKgBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAKgAqACoAXABcACoAKgBcAFwAXABcAFwAKgAqAFwAKgBcACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcACoAKgBQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAA0ADQBQAFAAUAAEAAQAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQADQAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAVABVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBUAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVACsAKwArACsAKwArACsAKwArACsAKwArAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAKwArACsAKwBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAKwArACsAKwAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAKwArACsAKwArAFYABABWAFYAVgBWAFYAVgBWAFYAVgBWAB4AVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgArAFYAVgBWAFYAVgArAFYAKwBWAFYAKwBWAFYAKwBWAFYAVgBWAFYAVgBWAFYAVgBWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAEQAWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAaAB4AKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAGAARABEAGAAYABMAEwAWABEAFAArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACUAJQAlACUAJQAWABEAFgARABYAEQAWABEAFgARABYAEQAlACUAFgARACUAJQAlACUAJQAlACUAEQAlABEAKwAVABUAEwATACUAFgARABYAEQAWABEAJQAlACUAJQAlACUAJQAlACsAJQAbABoAJQArACsAKwArAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAcAKwATACUAJQAbABoAJQAlABYAEQAlACUAEQAlABEAJQBXAFcAVwBXAFcAVwBXAFcAVwBXABUAFQAlACUAJQATACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXABYAJQARACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAWACUAEQAlABYAEQARABYAEQARABUAVwBRAFEAUQBRAFEAUQBRAFEAUQBRAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcARwArACsAVwBXAFcAVwBXAFcAKwArAFcAVwBXAFcAVwBXACsAKwBXAFcAVwBXAFcAVwArACsAVwBXAFcAKwArACsAGgAbACUAJQAlABsAGwArAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwAEAAQABAAQAB0AKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsADQANAA0AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAAQAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAA0AUABQAFAAUAArACsAKwArAFAAUABQAFAAUABQAFAAUAANAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAKwArAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUAArACsAKwBQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAUABQAFAAUABQAAQABAAEACsABAAEACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAKwBQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEACsAKwArACsABABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAA0ADQANAA0ADQANAA0ADQAeACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAArACsAKwArAFAAUABQAFAAUAANAA0ADQANAA0ADQAUACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsADQANAA0ADQANAA0ADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAAQABAAEAAQAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArAAQABAANACsAKwBQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAB4AHgAeAB4AHgArACsAKwArACsAKwAEAAQABAAEAAQABAAEAA0ADQAeAB4AHgAeAB4AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwAeACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsASwBLAEsASwBLAEsASwBLAEsASwANAA0ADQANAFAABAAEAFAAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAeAA4AUAArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAADQANAB4ADQAEAAQABAAEAB4ABAAEAEsASwBLAEsASwBLAEsASwBLAEsAUAAOAFAADQANAA0AKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAANAA0AHgANAA0AHgAEACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAA0AKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsABAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQACsABAAEAFAABAAEAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABAArACsAUAArACsAKwArACsAKwAEACsAKwArACsAKwBQAFAAUABQAFAABAAEACsAKwAEAAQABAAEAAQABAAEACsAKwArAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAAQABABQAFAAUABQAA0ADQANAA0AHgBLAEsASwBLAEsASwBLAEsASwBLAA0ADQArAB4ABABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAFAAUAAeAFAAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAArACsABAAEAAQABAAEAAQABAAEAAQADgANAA0AEwATAB4AHgAeAA0ADQANAA0ADQANAA0ADQANAA0ADQANAA0ADQANAFAAUABQAFAABAAEACsAKwAEAA0ADQAeAFAAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKwArACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBcAFwADQANAA0AKgBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAKwArAFAAKwArAFAAUABQAFAAUABQAFAAUAArAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQAKwAEAAQAKwArAAQABAAEAAQAUAAEAFAABAAEAA0ADQANACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAArACsABAAEAAQABAAEAAQABABQAA4AUAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAFAABAAEAAQABAAOAB4ADQANAA0ADQAOAB4ABAArACsAKwArACsAKwArACsAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAA0ADQANAFAADgAOAA4ADQANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAAQABAAEAFAADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwAOABMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAArACsAKwAEACsABAAEACsABAAEAAQABAAEAAQABABQAAQAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAKwBQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQAKwAEAAQAKwAEAAQABAAEAAQAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAaABoAGgAaAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABIAEgAQwBDAEMAUABQAFAAUABDAFAAUABQAEgAQwBIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABDAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwAJAAkACQAJAAkACQAJABYAEQArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwANAA0AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAANACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAA0ADQANAB4AHgAeAB4AHgAeAFAAUABQAFAADQAeACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAANAA0AHgAeACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwAEAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAARwBHABUARwAJACsAKwArACsAKwArACsAKwArACsAKwAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACsAKwArACsAKwArACsAKwBXAFcAVwBXAFcAVwBXAFcAVwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUQBRAFEAKwArACsAKwArACsAKwArACsAKwArACsAKwBRAFEAUQBRACsAKwArACsAKwArACsAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArACsAHgAEAAQADQAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAAQABAAEAAQABAAeAB4AHgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4AHgAEAAQABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQAHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwBQAFAAKwArAFAAKwArAFAAUAArACsAUABQAFAAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAUAArAFAAUABQAFAAUABQAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAHgAeAFAAUABQAFAAUAArAFAAKwArACsAUABQAFAAUABQAFAAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeACsAKwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4ABAAeAB4AHgAeAB4AHgAeAB4AHgAeAAQAHgAeAA0ADQANAA0AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAAQAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArAAQABAAEAAQABAAEAAQAKwAEAAQAKwAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwBQAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArABsAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArAB4AHgAeAB4ABAAEAAQABAAEAAQABABQACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArABYAFgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAGgBQAFAAUAAaAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAKwBQACsAKwBQACsAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwBQACsAUAArACsAKwArACsAKwBQACsAKwArACsAUAArAFAAKwBQACsAUABQAFAAKwBQAFAAKwBQACsAKwBQACsAUAArAFAAKwBQACsAUAArAFAAUAArAFAAKwArAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUAArAFAAUABQAFAAKwBQACsAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAKwBQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8AJQAlACUAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB4AHgAeACUAJQAlAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAlACUAJQAlACUAHgAlACUAJQAlACUAIAAgACAAJQAlACAAJQAlACAAIAAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACEAIQAhACEAIQAlACUAIAAgACUAJQAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAIAAlACUAJQAlACAAIAAgACUAIAAgACAAJQAlACUAJQAlACUAJQAgACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAlAB4AJQAeACUAJQAlACUAJQAgACUAJQAlACUAHgAlAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACAAIAAgACUAJQAlACAAIAAgACAAIAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABcAFwAXABUAFQAVAB4AHgAeAB4AJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAgACUAJQAgACUAJQAlACUAJQAlACUAJQAgACAAIAAgACAAIAAgACAAJQAlACUAJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAgACAAIAAgACAAIAAgACAAIAAgACUAJQAgACAAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAlACAAIAAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAgACAAIAAlACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACUAVwBXACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAA==";
  var LETTER_NUMBER_MODIFIER = 50;
  var BK = 1;
  var CR$1 = 2;
  var LF$1 = 3;
  var CM = 4;
  var NL = 5;
  var WJ = 7;
  var ZW = 8;
  var GL = 9;
  var SP = 10;
  var ZWJ$1 = 11;
  var B2 = 12;
  var BA = 13;
  var BB = 14;
  var HY = 15;
  var CB = 16;
  var CL = 17;
  var CP = 18;
  var EX = 19;
  var IN = 20;
  var NS = 21;
  var OP = 22;
  var QU = 23;
  var IS = 24;
  var NU = 25;
  var PO = 26;
  var PR = 27;
  var SY = 28;
  var AI = 29;
  var AL = 30;
  var CJ = 31;
  var EB = 32;
  var EM = 33;
  var H2 = 34;
  var H3 = 35;
  var HL = 36;
  var ID = 37;
  var JL = 38;
  var JV = 39;
  var JT = 40;
  var RI$1 = 41;
  var SA = 42;
  var XX = 43;
  var ea_OP = [9001, 65288];
  var BREAK_MANDATORY = "!";
  var BREAK_NOT_ALLOWED$1 = "×";
  var BREAK_ALLOWED$1 = "÷";
  var UnicodeTrie$1 = createTrieFromBase64$1(base64$1);
  var ALPHABETICS = [AL, HL];
  var HARD_LINE_BREAKS = [BK, CR$1, LF$1, NL];
  var SPACE$1 = [SP, ZW];
  var PREFIX_POSTFIX = [PR, PO];
  var LINE_BREAKS = HARD_LINE_BREAKS.concat(SPACE$1);
  var KOREAN_SYLLABLE_BLOCK = [JL, JV, JT, H2, H3];
  var HYPHEN = [HY, BA];
  var codePointsToCharacterClasses = function(codePoints, lineBreak2) {
    if (lineBreak2 === void 0) {
      lineBreak2 = "strict";
    }
    var types2 = [];
    var indices = [];
    var categories = [];
    codePoints.forEach(function(codePoint, index2) {
      var classType = UnicodeTrie$1.get(codePoint);
      if (classType > LETTER_NUMBER_MODIFIER) {
        categories.push(true);
        classType -= LETTER_NUMBER_MODIFIER;
      } else {
        categories.push(false);
      }
      if (["normal", "auto", "loose"].indexOf(lineBreak2) !== -1) {
        if ([8208, 8211, 12316, 12448].indexOf(codePoint) !== -1) {
          indices.push(index2);
          return types2.push(CB);
        }
      }
      if (classType === CM || classType === ZWJ$1) {
        if (index2 === 0) {
          indices.push(index2);
          return types2.push(AL);
        }
        var prev = types2[index2 - 1];
        if (LINE_BREAKS.indexOf(prev) === -1) {
          indices.push(indices[index2 - 1]);
          return types2.push(prev);
        }
        indices.push(index2);
        return types2.push(AL);
      }
      indices.push(index2);
      if (classType === CJ) {
        return types2.push(lineBreak2 === "strict" ? NS : ID);
      }
      if (classType === SA) {
        return types2.push(AL);
      }
      if (classType === AI) {
        return types2.push(AL);
      }
      if (classType === XX) {
        if (codePoint >= 131072 && codePoint <= 196605 || codePoint >= 196608 && codePoint <= 262141) {
          return types2.push(ID);
        } else {
          return types2.push(AL);
        }
      }
      types2.push(classType);
    });
    return [indices, types2, categories];
  };
  var isAdjacentWithSpaceIgnored = function(a2, b2, currentIndex, classTypes) {
    var current = classTypes[currentIndex];
    if (Array.isArray(a2) ? a2.indexOf(current) !== -1 : a2 === current) {
      var i2 = currentIndex;
      while (i2 <= classTypes.length) {
        i2++;
        var next = classTypes[i2];
        if (next === b2) {
          return true;
        }
        if (next !== SP) {
          break;
        }
      }
    }
    if (current === SP) {
      var i2 = currentIndex;
      while (i2 > 0) {
        i2--;
        var prev = classTypes[i2];
        if (Array.isArray(a2) ? a2.indexOf(prev) !== -1 : a2 === prev) {
          var n2 = currentIndex;
          while (n2 <= classTypes.length) {
            n2++;
            var next = classTypes[n2];
            if (next === b2) {
              return true;
            }
            if (next !== SP) {
              break;
            }
          }
        }
        if (prev !== SP) {
          break;
        }
      }
    }
    return false;
  };
  var previousNonSpaceClassType = function(currentIndex, classTypes) {
    var i2 = currentIndex;
    while (i2 >= 0) {
      var type = classTypes[i2];
      if (type === SP) {
        i2--;
      } else {
        return type;
      }
    }
    return 0;
  };
  var _lineBreakAtIndex = function(codePoints, classTypes, indicies, index2, forbiddenBreaks) {
    if (indicies[index2] === 0) {
      return BREAK_NOT_ALLOWED$1;
    }
    var currentIndex = index2 - 1;
    if (Array.isArray(forbiddenBreaks) && forbiddenBreaks[currentIndex] === true) {
      return BREAK_NOT_ALLOWED$1;
    }
    var beforeIndex = currentIndex - 1;
    var afterIndex = currentIndex + 1;
    var current = classTypes[currentIndex];
    var before = beforeIndex >= 0 ? classTypes[beforeIndex] : 0;
    var next = classTypes[afterIndex];
    if (current === CR$1 && next === LF$1) {
      return BREAK_NOT_ALLOWED$1;
    }
    if (HARD_LINE_BREAKS.indexOf(current) !== -1) {
      return BREAK_MANDATORY;
    }
    if (HARD_LINE_BREAKS.indexOf(next) !== -1) {
      return BREAK_NOT_ALLOWED$1;
    }
    if (SPACE$1.indexOf(next) !== -1) {
      return BREAK_NOT_ALLOWED$1;
    }
    if (previousNonSpaceClassType(currentIndex, classTypes) === ZW) {
      return BREAK_ALLOWED$1;
    }
    if (UnicodeTrie$1.get(codePoints[currentIndex]) === ZWJ$1) {
      return BREAK_NOT_ALLOWED$1;
    }
    if ((current === EB || current === EM) && UnicodeTrie$1.get(codePoints[afterIndex]) === ZWJ$1) {
      return BREAK_NOT_ALLOWED$1;
    }
    if (current === WJ || next === WJ) {
      return BREAK_NOT_ALLOWED$1;
    }
    if (current === GL) {
      return BREAK_NOT_ALLOWED$1;
    }
    if ([SP, BA, HY].indexOf(current) === -1 && next === GL) {
      return BREAK_NOT_ALLOWED$1;
    }
    if ([CL, CP, EX, IS, SY].indexOf(next) !== -1) {
      return BREAK_NOT_ALLOWED$1;
    }
    if (previousNonSpaceClassType(currentIndex, classTypes) === OP) {
      return BREAK_NOT_ALLOWED$1;
    }
    if (isAdjacentWithSpaceIgnored(QU, OP, currentIndex, classTypes)) {
      return BREAK_NOT_ALLOWED$1;
    }
    if (isAdjacentWithSpaceIgnored([CL, CP], NS, currentIndex, classTypes)) {
      return BREAK_NOT_ALLOWED$1;
    }
    if (isAdjacentWithSpaceIgnored(B2, B2, currentIndex, classTypes)) {
      return BREAK_NOT_ALLOWED$1;
    }
    if (current === SP) {
      return BREAK_ALLOWED$1;
    }
    if (current === QU || next === QU) {
      return BREAK_NOT_ALLOWED$1;
    }
    if (next === CB || current === CB) {
      return BREAK_ALLOWED$1;
    }
    if ([BA, HY, NS].indexOf(next) !== -1 || current === BB) {
      return BREAK_NOT_ALLOWED$1;
    }
    if (before === HL && HYPHEN.indexOf(current) !== -1) {
      return BREAK_NOT_ALLOWED$1;
    }
    if (current === SY && next === HL) {
      return BREAK_NOT_ALLOWED$1;
    }
    if (next === IN) {
      return BREAK_NOT_ALLOWED$1;
    }
    if (ALPHABETICS.indexOf(next) !== -1 && current === NU || ALPHABETICS.indexOf(current) !== -1 && next === NU) {
      return BREAK_NOT_ALLOWED$1;
    }
    if (current === PR && [ID, EB, EM].indexOf(next) !== -1 || [ID, EB, EM].indexOf(current) !== -1 && next === PO) {
      return BREAK_NOT_ALLOWED$1;
    }
    if (ALPHABETICS.indexOf(current) !== -1 && PREFIX_POSTFIX.indexOf(next) !== -1 || PREFIX_POSTFIX.indexOf(current) !== -1 && ALPHABETICS.indexOf(next) !== -1) {
      return BREAK_NOT_ALLOWED$1;
    }
    if (
      // (PR | PO) × ( OP | HY )? NU
      [PR, PO].indexOf(current) !== -1 && (next === NU || [OP, HY].indexOf(next) !== -1 && classTypes[afterIndex + 1] === NU) || // ( OP | HY ) × NU
      [OP, HY].indexOf(current) !== -1 && next === NU || // NU ×	(NU | SY | IS)
      current === NU && [NU, SY, IS].indexOf(next) !== -1
    ) {
      return BREAK_NOT_ALLOWED$1;
    }
    if ([NU, SY, IS, CL, CP].indexOf(next) !== -1) {
      var prevIndex = currentIndex;
      while (prevIndex >= 0) {
        var type = classTypes[prevIndex];
        if (type === NU) {
          return BREAK_NOT_ALLOWED$1;
        } else if ([SY, IS].indexOf(type) !== -1) {
          prevIndex--;
        } else {
          break;
        }
      }
    }
    if ([PR, PO].indexOf(next) !== -1) {
      var prevIndex = [CL, CP].indexOf(current) !== -1 ? beforeIndex : currentIndex;
      while (prevIndex >= 0) {
        var type = classTypes[prevIndex];
        if (type === NU) {
          return BREAK_NOT_ALLOWED$1;
        } else if ([SY, IS].indexOf(type) !== -1) {
          prevIndex--;
        } else {
          break;
        }
      }
    }
    if (JL === current && [JL, JV, H2, H3].indexOf(next) !== -1 || [JV, H2].indexOf(current) !== -1 && [JV, JT].indexOf(next) !== -1 || [JT, H3].indexOf(current) !== -1 && next === JT) {
      return BREAK_NOT_ALLOWED$1;
    }
    if (KOREAN_SYLLABLE_BLOCK.indexOf(current) !== -1 && [IN, PO].indexOf(next) !== -1 || KOREAN_SYLLABLE_BLOCK.indexOf(next) !== -1 && current === PR) {
      return BREAK_NOT_ALLOWED$1;
    }
    if (ALPHABETICS.indexOf(current) !== -1 && ALPHABETICS.indexOf(next) !== -1) {
      return BREAK_NOT_ALLOWED$1;
    }
    if (current === IS && ALPHABETICS.indexOf(next) !== -1) {
      return BREAK_NOT_ALLOWED$1;
    }
    if (ALPHABETICS.concat(NU).indexOf(current) !== -1 && next === OP && ea_OP.indexOf(codePoints[afterIndex]) === -1 || ALPHABETICS.concat(NU).indexOf(next) !== -1 && current === CP) {
      return BREAK_NOT_ALLOWED$1;
    }
    if (current === RI$1 && next === RI$1) {
      var i2 = indicies[currentIndex];
      var count = 1;
      while (i2 > 0) {
        i2--;
        if (classTypes[i2] === RI$1) {
          count++;
        } else {
          break;
        }
      }
      if (count % 2 !== 0) {
        return BREAK_NOT_ALLOWED$1;
      }
    }
    if (current === EB && next === EM) {
      return BREAK_NOT_ALLOWED$1;
    }
    return BREAK_ALLOWED$1;
  };
  var cssFormattedClasses = function(codePoints, options2) {
    if (!options2) {
      options2 = { lineBreak: "normal", wordBreak: "normal" };
    }
    var _a = codePointsToCharacterClasses(codePoints, options2.lineBreak), indicies = _a[0], classTypes = _a[1], isLetterNumber = _a[2];
    if (options2.wordBreak === "break-all" || options2.wordBreak === "break-word") {
      classTypes = classTypes.map(function(type) {
        return [NU, AL, SA].indexOf(type) !== -1 ? ID : type;
      });
    }
    var forbiddenBreakpoints = options2.wordBreak === "keep-all" ? isLetterNumber.map(function(letterNumber, i2) {
      return letterNumber && codePoints[i2] >= 19968 && codePoints[i2] <= 40959;
    }) : void 0;
    return [indicies, classTypes, forbiddenBreakpoints];
  };
  var Break = (
    /** @class */
    function() {
      function Break2(codePoints, lineBreak2, start, end) {
        this.codePoints = codePoints;
        this.required = lineBreak2 === BREAK_MANDATORY;
        this.start = start;
        this.end = end;
      }
      Break2.prototype.slice = function() {
        return fromCodePoint$1.apply(void 0, this.codePoints.slice(this.start, this.end));
      };
      return Break2;
    }()
  );
  var LineBreaker = function(str, options2) {
    var codePoints = toCodePoints$1(str);
    var _a = cssFormattedClasses(codePoints, options2), indicies = _a[0], classTypes = _a[1], forbiddenBreakpoints = _a[2];
    var length = codePoints.length;
    var lastEnd = 0;
    var nextIndex = 0;
    return {
      next: function() {
        if (nextIndex >= length) {
          return { done: true, value: null };
        }
        var lineBreak2 = BREAK_NOT_ALLOWED$1;
        while (nextIndex < length && (lineBreak2 = _lineBreakAtIndex(codePoints, classTypes, indicies, ++nextIndex, forbiddenBreakpoints)) === BREAK_NOT_ALLOWED$1) {
        }
        if (lineBreak2 !== BREAK_NOT_ALLOWED$1 || nextIndex === length) {
          var value2 = new Break(codePoints, lineBreak2, lastEnd, nextIndex);
          lastEnd = nextIndex;
          return { value: value2, done: false };
        }
        return { done: true, value: null };
      }
    };
  };
  var FLAG_UNRESTRICTED = 1 << 0;
  var FLAG_ID = 1 << 1;
  var FLAG_INTEGER = 1 << 2;
  var FLAG_NUMBER = 1 << 3;
  var LINE_FEED = 10;
  var SOLIDUS = 47;
  var REVERSE_SOLIDUS = 92;
  var CHARACTER_TABULATION = 9;
  var SPACE = 32;
  var QUOTATION_MARK = 34;
  var EQUALS_SIGN = 61;
  var NUMBER_SIGN = 35;
  var DOLLAR_SIGN = 36;
  var PERCENTAGE_SIGN = 37;
  var APOSTROPHE = 39;
  var LEFT_PARENTHESIS = 40;
  var RIGHT_PARENTHESIS = 41;
  var LOW_LINE = 95;
  var HYPHEN_MINUS = 45;
  var EXCLAMATION_MARK = 33;
  var LESS_THAN_SIGN = 60;
  var GREATER_THAN_SIGN = 62;
  var COMMERCIAL_AT = 64;
  var LEFT_SQUARE_BRACKET = 91;
  var RIGHT_SQUARE_BRACKET = 93;
  var CIRCUMFLEX_ACCENT = 61;
  var LEFT_CURLY_BRACKET = 123;
  var QUESTION_MARK = 63;
  var RIGHT_CURLY_BRACKET = 125;
  var VERTICAL_LINE = 124;
  var TILDE = 126;
  var CONTROL = 128;
  var REPLACEMENT_CHARACTER = 65533;
  var ASTERISK = 42;
  var PLUS_SIGN = 43;
  var COMMA = 44;
  var COLON = 58;
  var SEMICOLON = 59;
  var FULL_STOP = 46;
  var NULL = 0;
  var BACKSPACE = 8;
  var LINE_TABULATION = 11;
  var SHIFT_OUT = 14;
  var INFORMATION_SEPARATOR_ONE = 31;
  var DELETE = 127;
  var EOF = -1;
  var ZERO = 48;
  var a = 97;
  var e = 101;
  var f = 102;
  var u = 117;
  var z = 122;
  var A = 65;
  var E = 69;
  var F = 70;
  var U = 85;
  var Z = 90;
  var isDigit = function(codePoint) {
    return codePoint >= ZERO && codePoint <= 57;
  };
  var isSurrogateCodePoint = function(codePoint) {
    return codePoint >= 55296 && codePoint <= 57343;
  };
  var isHex = function(codePoint) {
    return isDigit(codePoint) || codePoint >= A && codePoint <= F || codePoint >= a && codePoint <= f;
  };
  var isLowerCaseLetter = function(codePoint) {
    return codePoint >= a && codePoint <= z;
  };
  var isUpperCaseLetter = function(codePoint) {
    return codePoint >= A && codePoint <= Z;
  };
  var isLetter = function(codePoint) {
    return isLowerCaseLetter(codePoint) || isUpperCaseLetter(codePoint);
  };
  var isNonASCIICodePoint = function(codePoint) {
    return codePoint >= CONTROL;
  };
  var isWhiteSpace = function(codePoint) {
    return codePoint === LINE_FEED || codePoint === CHARACTER_TABULATION || codePoint === SPACE;
  };
  var isNameStartCodePoint = function(codePoint) {
    return isLetter(codePoint) || isNonASCIICodePoint(codePoint) || codePoint === LOW_LINE;
  };
  var isNameCodePoint = function(codePoint) {
    return isNameStartCodePoint(codePoint) || isDigit(codePoint) || codePoint === HYPHEN_MINUS;
  };
  var isNonPrintableCodePoint = function(codePoint) {
    return codePoint >= NULL && codePoint <= BACKSPACE || codePoint === LINE_TABULATION || codePoint >= SHIFT_OUT && codePoint <= INFORMATION_SEPARATOR_ONE || codePoint === DELETE;
  };
  var isValidEscape = function(c1, c2) {
    if (c1 !== REVERSE_SOLIDUS) {
      return false;
    }
    return c2 !== LINE_FEED;
  };
  var isIdentifierStart = function(c1, c2, c3) {
    if (c1 === HYPHEN_MINUS) {
      return isNameStartCodePoint(c2) || isValidEscape(c2, c3);
    } else if (isNameStartCodePoint(c1)) {
      return true;
    } else if (c1 === REVERSE_SOLIDUS && isValidEscape(c1, c2)) {
      return true;
    }
    return false;
  };
  var isNumberStart = function(c1, c2, c3) {
    if (c1 === PLUS_SIGN || c1 === HYPHEN_MINUS) {
      if (isDigit(c2)) {
        return true;
      }
      return c2 === FULL_STOP && isDigit(c3);
    }
    if (c1 === FULL_STOP) {
      return isDigit(c2);
    }
    return isDigit(c1);
  };
  var stringToNumber = function(codePoints) {
    var c2 = 0;
    var sign = 1;
    if (codePoints[c2] === PLUS_SIGN || codePoints[c2] === HYPHEN_MINUS) {
      if (codePoints[c2] === HYPHEN_MINUS) {
        sign = -1;
      }
      c2++;
    }
    var integers = [];
    while (isDigit(codePoints[c2])) {
      integers.push(codePoints[c2++]);
    }
    var int = integers.length ? parseInt(fromCodePoint$1.apply(void 0, integers), 10) : 0;
    if (codePoints[c2] === FULL_STOP) {
      c2++;
    }
    var fraction = [];
    while (isDigit(codePoints[c2])) {
      fraction.push(codePoints[c2++]);
    }
    var fracd = fraction.length;
    var frac = fracd ? parseInt(fromCodePoint$1.apply(void 0, fraction), 10) : 0;
    if (codePoints[c2] === E || codePoints[c2] === e) {
      c2++;
    }
    var expsign = 1;
    if (codePoints[c2] === PLUS_SIGN || codePoints[c2] === HYPHEN_MINUS) {
      if (codePoints[c2] === HYPHEN_MINUS) {
        expsign = -1;
      }
      c2++;
    }
    var exponent = [];
    while (isDigit(codePoints[c2])) {
      exponent.push(codePoints[c2++]);
    }
    var exp = exponent.length ? parseInt(fromCodePoint$1.apply(void 0, exponent), 10) : 0;
    return sign * (int + frac * Math.pow(10, -fracd)) * Math.pow(10, expsign * exp);
  };
  var LEFT_PARENTHESIS_TOKEN = {
    type: 2
    /* LEFT_PARENTHESIS_TOKEN */
  };
  var RIGHT_PARENTHESIS_TOKEN = {
    type: 3
    /* RIGHT_PARENTHESIS_TOKEN */
  };
  var COMMA_TOKEN = {
    type: 4
    /* COMMA_TOKEN */
  };
  var SUFFIX_MATCH_TOKEN = {
    type: 13
    /* SUFFIX_MATCH_TOKEN */
  };
  var PREFIX_MATCH_TOKEN = {
    type: 8
    /* PREFIX_MATCH_TOKEN */
  };
  var COLUMN_TOKEN = {
    type: 21
    /* COLUMN_TOKEN */
  };
  var DASH_MATCH_TOKEN = {
    type: 9
    /* DASH_MATCH_TOKEN */
  };
  var INCLUDE_MATCH_TOKEN = {
    type: 10
    /* INCLUDE_MATCH_TOKEN */
  };
  var LEFT_CURLY_BRACKET_TOKEN = {
    type: 11
    /* LEFT_CURLY_BRACKET_TOKEN */
  };
  var RIGHT_CURLY_BRACKET_TOKEN = {
    type: 12
    /* RIGHT_CURLY_BRACKET_TOKEN */
  };
  var SUBSTRING_MATCH_TOKEN = {
    type: 14
    /* SUBSTRING_MATCH_TOKEN */
  };
  var BAD_URL_TOKEN = {
    type: 23
    /* BAD_URL_TOKEN */
  };
  var BAD_STRING_TOKEN = {
    type: 1
    /* BAD_STRING_TOKEN */
  };
  var CDO_TOKEN = {
    type: 25
    /* CDO_TOKEN */
  };
  var CDC_TOKEN = {
    type: 24
    /* CDC_TOKEN */
  };
  var COLON_TOKEN = {
    type: 26
    /* COLON_TOKEN */
  };
  var SEMICOLON_TOKEN = {
    type: 27
    /* SEMICOLON_TOKEN */
  };
  var LEFT_SQUARE_BRACKET_TOKEN = {
    type: 28
    /* LEFT_SQUARE_BRACKET_TOKEN */
  };
  var RIGHT_SQUARE_BRACKET_TOKEN = {
    type: 29
    /* RIGHT_SQUARE_BRACKET_TOKEN */
  };
  var WHITESPACE_TOKEN = {
    type: 31
    /* WHITESPACE_TOKEN */
  };
  var EOF_TOKEN = {
    type: 32
    /* EOF_TOKEN */
  };
  var Tokenizer = (
    /** @class */
    function() {
      function Tokenizer2() {
        this._value = [];
      }
      Tokenizer2.prototype.write = function(chunk) {
        this._value = this._value.concat(toCodePoints$1(chunk));
      };
      Tokenizer2.prototype.read = function() {
        var tokens = [];
        var token = this.consumeToken();
        while (token !== EOF_TOKEN) {
          tokens.push(token);
          token = this.consumeToken();
        }
        return tokens;
      };
      Tokenizer2.prototype.consumeToken = function() {
        var codePoint = this.consumeCodePoint();
        switch (codePoint) {
          case QUOTATION_MARK:
            return this.consumeStringToken(QUOTATION_MARK);
          case NUMBER_SIGN:
            var c1 = this.peekCodePoint(0);
            var c2 = this.peekCodePoint(1);
            var c3 = this.peekCodePoint(2);
            if (isNameCodePoint(c1) || isValidEscape(c2, c3)) {
              var flags = isIdentifierStart(c1, c2, c3) ? FLAG_ID : FLAG_UNRESTRICTED;
              var value2 = this.consumeName();
              return { type: 5, value: value2, flags };
            }
            break;
          case DOLLAR_SIGN:
            if (this.peekCodePoint(0) === EQUALS_SIGN) {
              this.consumeCodePoint();
              return SUFFIX_MATCH_TOKEN;
            }
            break;
          case APOSTROPHE:
            return this.consumeStringToken(APOSTROPHE);
          case LEFT_PARENTHESIS:
            return LEFT_PARENTHESIS_TOKEN;
          case RIGHT_PARENTHESIS:
            return RIGHT_PARENTHESIS_TOKEN;
          case ASTERISK:
            if (this.peekCodePoint(0) === EQUALS_SIGN) {
              this.consumeCodePoint();
              return SUBSTRING_MATCH_TOKEN;
            }
            break;
          case PLUS_SIGN:
            if (isNumberStart(codePoint, this.peekCodePoint(0), this.peekCodePoint(1))) {
              this.reconsumeCodePoint(codePoint);
              return this.consumeNumericToken();
            }
            break;
          case COMMA:
            return COMMA_TOKEN;
          case HYPHEN_MINUS:
            var e1 = codePoint;
            var e2 = this.peekCodePoint(0);
            var e3 = this.peekCodePoint(1);
            if (isNumberStart(e1, e2, e3)) {
              this.reconsumeCodePoint(codePoint);
              return this.consumeNumericToken();
            }
            if (isIdentifierStart(e1, e2, e3)) {
              this.reconsumeCodePoint(codePoint);
              return this.consumeIdentLikeToken();
            }
            if (e2 === HYPHEN_MINUS && e3 === GREATER_THAN_SIGN) {
              this.consumeCodePoint();
              this.consumeCodePoint();
              return CDC_TOKEN;
            }
            break;
          case FULL_STOP:
            if (isNumberStart(codePoint, this.peekCodePoint(0), this.peekCodePoint(1))) {
              this.reconsumeCodePoint(codePoint);
              return this.consumeNumericToken();
            }
            break;
          case SOLIDUS:
            if (this.peekCodePoint(0) === ASTERISK) {
              this.consumeCodePoint();
              while (true) {
                var c4 = this.consumeCodePoint();
                if (c4 === ASTERISK) {
                  c4 = this.consumeCodePoint();
                  if (c4 === SOLIDUS) {
                    return this.consumeToken();
                  }
                }
                if (c4 === EOF) {
                  return this.consumeToken();
                }
              }
            }
            break;
          case COLON:
            return COLON_TOKEN;
          case SEMICOLON:
            return SEMICOLON_TOKEN;
          case LESS_THAN_SIGN:
            if (this.peekCodePoint(0) === EXCLAMATION_MARK && this.peekCodePoint(1) === HYPHEN_MINUS && this.peekCodePoint(2) === HYPHEN_MINUS) {
              this.consumeCodePoint();
              this.consumeCodePoint();
              return CDO_TOKEN;
            }
            break;
          case COMMERCIAL_AT:
            var a1 = this.peekCodePoint(0);
            var a2 = this.peekCodePoint(1);
            var a3 = this.peekCodePoint(2);
            if (isIdentifierStart(a1, a2, a3)) {
              var value2 = this.consumeName();
              return { type: 7, value: value2 };
            }
            break;
          case LEFT_SQUARE_BRACKET:
            return LEFT_SQUARE_BRACKET_TOKEN;
          case REVERSE_SOLIDUS:
            if (isValidEscape(codePoint, this.peekCodePoint(0))) {
              this.reconsumeCodePoint(codePoint);
              return this.consumeIdentLikeToken();
            }
            break;
          case RIGHT_SQUARE_BRACKET:
            return RIGHT_SQUARE_BRACKET_TOKEN;
          case CIRCUMFLEX_ACCENT:
            if (this.peekCodePoint(0) === EQUALS_SIGN) {
              this.consumeCodePoint();
              return PREFIX_MATCH_TOKEN;
            }
            break;
          case LEFT_CURLY_BRACKET:
            return LEFT_CURLY_BRACKET_TOKEN;
          case RIGHT_CURLY_BRACKET:
            return RIGHT_CURLY_BRACKET_TOKEN;
          case u:
          case U:
            var u1 = this.peekCodePoint(0);
            var u2 = this.peekCodePoint(1);
            if (u1 === PLUS_SIGN && (isHex(u2) || u2 === QUESTION_MARK)) {
              this.consumeCodePoint();
              this.consumeUnicodeRangeToken();
            }
            this.reconsumeCodePoint(codePoint);
            return this.consumeIdentLikeToken();
          case VERTICAL_LINE:
            if (this.peekCodePoint(0) === EQUALS_SIGN) {
              this.consumeCodePoint();
              return DASH_MATCH_TOKEN;
            }
            if (this.peekCodePoint(0) === VERTICAL_LINE) {
              this.consumeCodePoint();
              return COLUMN_TOKEN;
            }
            break;
          case TILDE:
            if (this.peekCodePoint(0) === EQUALS_SIGN) {
              this.consumeCodePoint();
              return INCLUDE_MATCH_TOKEN;
            }
            break;
          case EOF:
            return EOF_TOKEN;
        }
        if (isWhiteSpace(codePoint)) {
          this.consumeWhiteSpace();
          return WHITESPACE_TOKEN;
        }
        if (isDigit(codePoint)) {
          this.reconsumeCodePoint(codePoint);
          return this.consumeNumericToken();
        }
        if (isNameStartCodePoint(codePoint)) {
          this.reconsumeCodePoint(codePoint);
          return this.consumeIdentLikeToken();
        }
        return { type: 6, value: fromCodePoint$1(codePoint) };
      };
      Tokenizer2.prototype.consumeCodePoint = function() {
        var value2 = this._value.shift();
        return typeof value2 === "undefined" ? -1 : value2;
      };
      Tokenizer2.prototype.reconsumeCodePoint = function(codePoint) {
        this._value.unshift(codePoint);
      };
      Tokenizer2.prototype.peekCodePoint = function(delta) {
        if (delta >= this._value.length) {
          return -1;
        }
        return this._value[delta];
      };
      Tokenizer2.prototype.consumeUnicodeRangeToken = function() {
        var digits = [];
        var codePoint = this.consumeCodePoint();
        while (isHex(codePoint) && digits.length < 6) {
          digits.push(codePoint);
          codePoint = this.consumeCodePoint();
        }
        var questionMarks = false;
        while (codePoint === QUESTION_MARK && digits.length < 6) {
          digits.push(codePoint);
          codePoint = this.consumeCodePoint();
          questionMarks = true;
        }
        if (questionMarks) {
          var start_1 = parseInt(fromCodePoint$1.apply(void 0, digits.map(function(digit) {
            return digit === QUESTION_MARK ? ZERO : digit;
          })), 16);
          var end = parseInt(fromCodePoint$1.apply(void 0, digits.map(function(digit) {
            return digit === QUESTION_MARK ? F : digit;
          })), 16);
          return { type: 30, start: start_1, end };
        }
        var start = parseInt(fromCodePoint$1.apply(void 0, digits), 16);
        if (this.peekCodePoint(0) === HYPHEN_MINUS && isHex(this.peekCodePoint(1))) {
          this.consumeCodePoint();
          codePoint = this.consumeCodePoint();
          var endDigits = [];
          while (isHex(codePoint) && endDigits.length < 6) {
            endDigits.push(codePoint);
            codePoint = this.consumeCodePoint();
          }
          var end = parseInt(fromCodePoint$1.apply(void 0, endDigits), 16);
          return { type: 30, start, end };
        } else {
          return { type: 30, start, end: start };
        }
      };
      Tokenizer2.prototype.consumeIdentLikeToken = function() {
        var value2 = this.consumeName();
        if (value2.toLowerCase() === "url" && this.peekCodePoint(0) === LEFT_PARENTHESIS) {
          this.consumeCodePoint();
          return this.consumeUrlToken();
        } else if (this.peekCodePoint(0) === LEFT_PARENTHESIS) {
          this.consumeCodePoint();
          return { type: 19, value: value2 };
        }
        return { type: 20, value: value2 };
      };
      Tokenizer2.prototype.consumeUrlToken = function() {
        var value2 = [];
        this.consumeWhiteSpace();
        if (this.peekCodePoint(0) === EOF) {
          return { type: 22, value: "" };
        }
        var next = this.peekCodePoint(0);
        if (next === APOSTROPHE || next === QUOTATION_MARK) {
          var stringToken = this.consumeStringToken(this.consumeCodePoint());
          if (stringToken.type === 0) {
            this.consumeWhiteSpace();
            if (this.peekCodePoint(0) === EOF || this.peekCodePoint(0) === RIGHT_PARENTHESIS) {
              this.consumeCodePoint();
              return { type: 22, value: stringToken.value };
            }
          }
          this.consumeBadUrlRemnants();
          return BAD_URL_TOKEN;
        }
        while (true) {
          var codePoint = this.consumeCodePoint();
          if (codePoint === EOF || codePoint === RIGHT_PARENTHESIS) {
            return { type: 22, value: fromCodePoint$1.apply(void 0, value2) };
          } else if (isWhiteSpace(codePoint)) {
            this.consumeWhiteSpace();
            if (this.peekCodePoint(0) === EOF || this.peekCodePoint(0) === RIGHT_PARENTHESIS) {
              this.consumeCodePoint();
              return { type: 22, value: fromCodePoint$1.apply(void 0, value2) };
            }
            this.consumeBadUrlRemnants();
            return BAD_URL_TOKEN;
          } else if (codePoint === QUOTATION_MARK || codePoint === APOSTROPHE || codePoint === LEFT_PARENTHESIS || isNonPrintableCodePoint(codePoint)) {
            this.consumeBadUrlRemnants();
            return BAD_URL_TOKEN;
          } else if (codePoint === REVERSE_SOLIDUS) {
            if (isValidEscape(codePoint, this.peekCodePoint(0))) {
              value2.push(this.consumeEscapedCodePoint());
            } else {
              this.consumeBadUrlRemnants();
              return BAD_URL_TOKEN;
            }
          } else {
            value2.push(codePoint);
          }
        }
      };
      Tokenizer2.prototype.consumeWhiteSpace = function() {
        while (isWhiteSpace(this.peekCodePoint(0))) {
          this.consumeCodePoint();
        }
      };
      Tokenizer2.prototype.consumeBadUrlRemnants = function() {
        while (true) {
          var codePoint = this.consumeCodePoint();
          if (codePoint === RIGHT_PARENTHESIS || codePoint === EOF) {
            return;
          }
          if (isValidEscape(codePoint, this.peekCodePoint(0))) {
            this.consumeEscapedCodePoint();
          }
        }
      };
      Tokenizer2.prototype.consumeStringSlice = function(count) {
        var SLICE_STACK_SIZE = 5e4;
        var value2 = "";
        while (count > 0) {
          var amount = Math.min(SLICE_STACK_SIZE, count);
          value2 += fromCodePoint$1.apply(void 0, this._value.splice(0, amount));
          count -= amount;
        }
        this._value.shift();
        return value2;
      };
      Tokenizer2.prototype.consumeStringToken = function(endingCodePoint) {
        var value2 = "";
        var i2 = 0;
        do {
          var codePoint = this._value[i2];
          if (codePoint === EOF || codePoint === void 0 || codePoint === endingCodePoint) {
            value2 += this.consumeStringSlice(i2);
            return { type: 0, value: value2 };
          }
          if (codePoint === LINE_FEED) {
            this._value.splice(0, i2);
            return BAD_STRING_TOKEN;
          }
          if (codePoint === REVERSE_SOLIDUS) {
            var next = this._value[i2 + 1];
            if (next !== EOF && next !== void 0) {
              if (next === LINE_FEED) {
                value2 += this.consumeStringSlice(i2);
                i2 = -1;
                this._value.shift();
              } else if (isValidEscape(codePoint, next)) {
                value2 += this.consumeStringSlice(i2);
                value2 += fromCodePoint$1(this.consumeEscapedCodePoint());
                i2 = -1;
              }
            }
          }
          i2++;
        } while (true);
      };
      Tokenizer2.prototype.consumeNumber = function() {
        var repr = [];
        var type = FLAG_INTEGER;
        var c1 = this.peekCodePoint(0);
        if (c1 === PLUS_SIGN || c1 === HYPHEN_MINUS) {
          repr.push(this.consumeCodePoint());
        }
        while (isDigit(this.peekCodePoint(0))) {
          repr.push(this.consumeCodePoint());
        }
        c1 = this.peekCodePoint(0);
        var c2 = this.peekCodePoint(1);
        if (c1 === FULL_STOP && isDigit(c2)) {
          repr.push(this.consumeCodePoint(), this.consumeCodePoint());
          type = FLAG_NUMBER;
          while (isDigit(this.peekCodePoint(0))) {
            repr.push(this.consumeCodePoint());
          }
        }
        c1 = this.peekCodePoint(0);
        c2 = this.peekCodePoint(1);
        var c3 = this.peekCodePoint(2);
        if ((c1 === E || c1 === e) && ((c2 === PLUS_SIGN || c2 === HYPHEN_MINUS) && isDigit(c3) || isDigit(c2))) {
          repr.push(this.consumeCodePoint(), this.consumeCodePoint());
          type = FLAG_NUMBER;
          while (isDigit(this.peekCodePoint(0))) {
            repr.push(this.consumeCodePoint());
          }
        }
        return [stringToNumber(repr), type];
      };
      Tokenizer2.prototype.consumeNumericToken = function() {
        var _a = this.consumeNumber(), number2 = _a[0], flags = _a[1];
        var c1 = this.peekCodePoint(0);
        var c2 = this.peekCodePoint(1);
        var c3 = this.peekCodePoint(2);
        if (isIdentifierStart(c1, c2, c3)) {
          var unit = this.consumeName();
          return { type: 15, number: number2, flags, unit };
        }
        if (c1 === PERCENTAGE_SIGN) {
          this.consumeCodePoint();
          return { type: 16, number: number2, flags };
        }
        return { type: 17, number: number2, flags };
      };
      Tokenizer2.prototype.consumeEscapedCodePoint = function() {
        var codePoint = this.consumeCodePoint();
        if (isHex(codePoint)) {
          var hex = fromCodePoint$1(codePoint);
          while (isHex(this.peekCodePoint(0)) && hex.length < 6) {
            hex += fromCodePoint$1(this.consumeCodePoint());
          }
          if (isWhiteSpace(this.peekCodePoint(0))) {
            this.consumeCodePoint();
          }
          var hexCodePoint = parseInt(hex, 16);
          if (hexCodePoint === 0 || isSurrogateCodePoint(hexCodePoint) || hexCodePoint > 1114111) {
            return REPLACEMENT_CHARACTER;
          }
          return hexCodePoint;
        }
        if (codePoint === EOF) {
          return REPLACEMENT_CHARACTER;
        }
        return codePoint;
      };
      Tokenizer2.prototype.consumeName = function() {
        var result = "";
        while (true) {
          var codePoint = this.consumeCodePoint();
          if (isNameCodePoint(codePoint)) {
            result += fromCodePoint$1(codePoint);
          } else if (isValidEscape(codePoint, this.peekCodePoint(0))) {
            result += fromCodePoint$1(this.consumeEscapedCodePoint());
          } else {
            this.reconsumeCodePoint(codePoint);
            return result;
          }
        }
      };
      return Tokenizer2;
    }()
  );
  var Parser = (
    /** @class */
    function() {
      function Parser2(tokens) {
        this._tokens = tokens;
      }
      Parser2.create = function(value2) {
        var tokenizer = new Tokenizer();
        tokenizer.write(value2);
        return new Parser2(tokenizer.read());
      };
      Parser2.parseValue = function(value2) {
        return Parser2.create(value2).parseComponentValue();
      };
      Parser2.parseValues = function(value2) {
        return Parser2.create(value2).parseComponentValues();
      };
      Parser2.prototype.parseComponentValue = function() {
        var token = this.consumeToken();
        while (token.type === 31) {
          token = this.consumeToken();
        }
        if (token.type === 32) {
          throw new SyntaxError("Error parsing CSS component value, unexpected EOF");
        }
        this.reconsumeToken(token);
        var value2 = this.consumeComponentValue();
        do {
          token = this.consumeToken();
        } while (token.type === 31);
        if (token.type === 32) {
          return value2;
        }
        throw new SyntaxError("Error parsing CSS component value, multiple values found when expecting only one");
      };
      Parser2.prototype.parseComponentValues = function() {
        var values = [];
        while (true) {
          var value2 = this.consumeComponentValue();
          if (value2.type === 32) {
            return values;
          }
          values.push(value2);
          values.push();
        }
      };
      Parser2.prototype.consumeComponentValue = function() {
        var token = this.consumeToken();
        switch (token.type) {
          case 11:
          case 28:
          case 2:
            return this.consumeSimpleBlock(token.type);
          case 19:
            return this.consumeFunction(token);
        }
        return token;
      };
      Parser2.prototype.consumeSimpleBlock = function(type) {
        var block = { type, values: [] };
        var token = this.consumeToken();
        while (true) {
          if (token.type === 32 || isEndingTokenFor(token, type)) {
            return block;
          }
          this.reconsumeToken(token);
          block.values.push(this.consumeComponentValue());
          token = this.consumeToken();
        }
      };
      Parser2.prototype.consumeFunction = function(functionToken) {
        var cssFunction = {
          name: functionToken.value,
          values: [],
          type: 18
          /* FUNCTION */
        };
        while (true) {
          var token = this.consumeToken();
          if (token.type === 32 || token.type === 3) {
            return cssFunction;
          }
          this.reconsumeToken(token);
          cssFunction.values.push(this.consumeComponentValue());
        }
      };
      Parser2.prototype.consumeToken = function() {
        var token = this._tokens.shift();
        return typeof token === "undefined" ? EOF_TOKEN : token;
      };
      Parser2.prototype.reconsumeToken = function(token) {
        this._tokens.unshift(token);
      };
      return Parser2;
    }()
  );
  var isDimensionToken = function(token) {
    return token.type === 15;
  };
  var isNumberToken = function(token) {
    return token.type === 17;
  };
  var isIdentToken = function(token) {
    return token.type === 20;
  };
  var isStringToken = function(token) {
    return token.type === 0;
  };
  var isIdentWithValue = function(token, value2) {
    return isIdentToken(token) && token.value === value2;
  };
  var nonWhiteSpace = function(token) {
    return token.type !== 31;
  };
  var nonFunctionArgSeparator = function(token) {
    return token.type !== 31 && token.type !== 4;
  };
  var parseFunctionArgs = function(tokens) {
    var args = [];
    var arg = [];
    tokens.forEach(function(token) {
      if (token.type === 4) {
        if (arg.length === 0) {
          throw new Error("Error parsing function args, zero tokens for arg");
        }
        args.push(arg);
        arg = [];
        return;
      }
      if (token.type !== 31) {
        arg.push(token);
      }
    });
    if (arg.length) {
      args.push(arg);
    }
    return args;
  };
  var isEndingTokenFor = function(token, type) {
    if (type === 11 && token.type === 12) {
      return true;
    }
    if (type === 28 && token.type === 29) {
      return true;
    }
    return type === 2 && token.type === 3;
  };
  var isLength = function(token) {
    return token.type === 17 || token.type === 15;
  };
  var isLengthPercentage = function(token) {
    return token.type === 16 || isLength(token);
  };
  var parseLengthPercentageTuple = function(tokens) {
    return tokens.length > 1 ? [tokens[0], tokens[1]] : [tokens[0]];
  };
  var ZERO_LENGTH = {
    type: 17,
    number: 0,
    flags: FLAG_INTEGER
  };
  var FIFTY_PERCENT = {
    type: 16,
    number: 50,
    flags: FLAG_INTEGER
  };
  var HUNDRED_PERCENT = {
    type: 16,
    number: 100,
    flags: FLAG_INTEGER
  };
  var getAbsoluteValueForTuple = function(tuple, width, height) {
    var x2 = tuple[0], y2 = tuple[1];
    return [getAbsoluteValue(x2, width), getAbsoluteValue(typeof y2 !== "undefined" ? y2 : x2, height)];
  };
  var getAbsoluteValue = function(token, parent) {
    if (token.type === 16) {
      return token.number / 100 * parent;
    }
    if (isDimensionToken(token)) {
      switch (token.unit) {
        case "rem":
        case "em":
          return 16 * token.number;
        case "px":
        default:
          return token.number;
      }
    }
    return token.number;
  };
  var DEG = "deg";
  var GRAD = "grad";
  var RAD = "rad";
  var TURN = "turn";
  var angle = {
    name: "angle",
    parse: function(_context, value2) {
      if (value2.type === 15) {
        switch (value2.unit) {
          case DEG:
            return Math.PI * value2.number / 180;
          case GRAD:
            return Math.PI / 200 * value2.number;
          case RAD:
            return value2.number;
          case TURN:
            return Math.PI * 2 * value2.number;
        }
      }
      throw new Error("Unsupported angle type");
    }
  };
  var isAngle = function(value2) {
    if (value2.type === 15) {
      if (value2.unit === DEG || value2.unit === GRAD || value2.unit === RAD || value2.unit === TURN) {
        return true;
      }
    }
    return false;
  };
  var parseNamedSide = function(tokens) {
    var sideOrCorner = tokens.filter(isIdentToken).map(function(ident) {
      return ident.value;
    }).join(" ");
    switch (sideOrCorner) {
      case "to bottom right":
      case "to right bottom":
      case "left top":
      case "top left":
        return [ZERO_LENGTH, ZERO_LENGTH];
      case "to top":
      case "bottom":
        return deg(0);
      case "to bottom left":
      case "to left bottom":
      case "right top":
      case "top right":
        return [ZERO_LENGTH, HUNDRED_PERCENT];
      case "to right":
      case "left":
        return deg(90);
      case "to top left":
      case "to left top":
      case "right bottom":
      case "bottom right":
        return [HUNDRED_PERCENT, HUNDRED_PERCENT];
      case "to bottom":
      case "top":
        return deg(180);
      case "to top right":
      case "to right top":
      case "left bottom":
      case "bottom left":
        return [HUNDRED_PERCENT, ZERO_LENGTH];
      case "to left":
      case "right":
        return deg(270);
    }
    return 0;
  };
  var deg = function(deg2) {
    return Math.PI * deg2 / 180;
  };
  var color$1 = {
    name: "color",
    parse: function(context, value2) {
      if (value2.type === 18) {
        var colorFunction = SUPPORTED_COLOR_FUNCTIONS[value2.name];
        if (typeof colorFunction === "undefined") {
          throw new Error('Attempting to parse an unsupported color function "' + value2.name + '"');
        }
        return colorFunction(context, value2.values);
      }
      if (value2.type === 5) {
        if (value2.value.length === 3) {
          var r2 = value2.value.substring(0, 1);
          var g2 = value2.value.substring(1, 2);
          var b2 = value2.value.substring(2, 3);
          return pack(parseInt(r2 + r2, 16), parseInt(g2 + g2, 16), parseInt(b2 + b2, 16), 1);
        }
        if (value2.value.length === 4) {
          var r2 = value2.value.substring(0, 1);
          var g2 = value2.value.substring(1, 2);
          var b2 = value2.value.substring(2, 3);
          var a2 = value2.value.substring(3, 4);
          return pack(parseInt(r2 + r2, 16), parseInt(g2 + g2, 16), parseInt(b2 + b2, 16), parseInt(a2 + a2, 16) / 255);
        }
        if (value2.value.length === 6) {
          var r2 = value2.value.substring(0, 2);
          var g2 = value2.value.substring(2, 4);
          var b2 = value2.value.substring(4, 6);
          return pack(parseInt(r2, 16), parseInt(g2, 16), parseInt(b2, 16), 1);
        }
        if (value2.value.length === 8) {
          var r2 = value2.value.substring(0, 2);
          var g2 = value2.value.substring(2, 4);
          var b2 = value2.value.substring(4, 6);
          var a2 = value2.value.substring(6, 8);
          return pack(parseInt(r2, 16), parseInt(g2, 16), parseInt(b2, 16), parseInt(a2, 16) / 255);
        }
      }
      if (value2.type === 20) {
        var namedColor = COLORS[value2.value.toUpperCase()];
        if (typeof namedColor !== "undefined") {
          return namedColor;
        }
      }
      return COLORS.TRANSPARENT;
    }
  };
  var isTransparent = function(color2) {
    return (255 & color2) === 0;
  };
  var asString = function(color2) {
    var alpha = 255 & color2;
    var blue = 255 & color2 >> 8;
    var green = 255 & color2 >> 16;
    var red = 255 & color2 >> 24;
    return alpha < 255 ? "rgba(" + red + "," + green + "," + blue + "," + alpha / 255 + ")" : "rgb(" + red + "," + green + "," + blue + ")";
  };
  var pack = function(r2, g2, b2, a2) {
    return (r2 << 24 | g2 << 16 | b2 << 8 | Math.round(a2 * 255) << 0) >>> 0;
  };
  var getTokenColorValue = function(token, i2) {
    if (token.type === 17) {
      return token.number;
    }
    if (token.type === 16) {
      var max = i2 === 3 ? 1 : 255;
      return i2 === 3 ? token.number / 100 * max : Math.round(token.number / 100 * max);
    }
    return 0;
  };
  var rgb = function(_context, args) {
    var tokens = args.filter(nonFunctionArgSeparator);
    if (tokens.length === 3) {
      var _a = tokens.map(getTokenColorValue), r2 = _a[0], g2 = _a[1], b2 = _a[2];
      return pack(r2, g2, b2, 1);
    }
    if (tokens.length === 4) {
      var _b = tokens.map(getTokenColorValue), r2 = _b[0], g2 = _b[1], b2 = _b[2], a2 = _b[3];
      return pack(r2, g2, b2, a2);
    }
    return 0;
  };
  function hue2rgb(t1, t2, hue) {
    if (hue < 0) {
      hue += 1;
    }
    if (hue >= 1) {
      hue -= 1;
    }
    if (hue < 1 / 6) {
      return (t2 - t1) * hue * 6 + t1;
    } else if (hue < 1 / 2) {
      return t2;
    } else if (hue < 2 / 3) {
      return (t2 - t1) * 6 * (2 / 3 - hue) + t1;
    } else {
      return t1;
    }
  }
  var hsl = function(context, args) {
    var tokens = args.filter(nonFunctionArgSeparator);
    var hue = tokens[0], saturation = tokens[1], lightness = tokens[2], alpha = tokens[3];
    var h2 = (hue.type === 17 ? deg(hue.number) : angle.parse(context, hue)) / (Math.PI * 2);
    var s2 = isLengthPercentage(saturation) ? saturation.number / 100 : 0;
    var l2 = isLengthPercentage(lightness) ? lightness.number / 100 : 0;
    var a2 = typeof alpha !== "undefined" && isLengthPercentage(alpha) ? getAbsoluteValue(alpha, 1) : 1;
    if (s2 === 0) {
      return pack(l2 * 255, l2 * 255, l2 * 255, 1);
    }
    var t2 = l2 <= 0.5 ? l2 * (s2 + 1) : l2 + s2 - l2 * s2;
    var t1 = l2 * 2 - t2;
    var r2 = hue2rgb(t1, t2, h2 + 1 / 3);
    var g2 = hue2rgb(t1, t2, h2);
    var b2 = hue2rgb(t1, t2, h2 - 1 / 3);
    return pack(r2 * 255, g2 * 255, b2 * 255, a2);
  };
  var SUPPORTED_COLOR_FUNCTIONS = {
    hsl,
    hsla: hsl,
    rgb,
    rgba: rgb
  };
  var parseColor = function(context, value2) {
    return color$1.parse(context, Parser.create(value2).parseComponentValue());
  };
  var COLORS = {
    ALICEBLUE: 4042850303,
    ANTIQUEWHITE: 4209760255,
    AQUA: 16777215,
    AQUAMARINE: 2147472639,
    AZURE: 4043309055,
    BEIGE: 4126530815,
    BISQUE: 4293182719,
    BLACK: 255,
    BLANCHEDALMOND: 4293643775,
    BLUE: 65535,
    BLUEVIOLET: 2318131967,
    BROWN: 2771004159,
    BURLYWOOD: 3736635391,
    CADETBLUE: 1604231423,
    CHARTREUSE: 2147418367,
    CHOCOLATE: 3530104575,
    CORAL: 4286533887,
    CORNFLOWERBLUE: 1687547391,
    CORNSILK: 4294499583,
    CRIMSON: 3692313855,
    CYAN: 16777215,
    DARKBLUE: 35839,
    DARKCYAN: 9145343,
    DARKGOLDENROD: 3095837695,
    DARKGRAY: 2846468607,
    DARKGREEN: 6553855,
    DARKGREY: 2846468607,
    DARKKHAKI: 3182914559,
    DARKMAGENTA: 2332068863,
    DARKOLIVEGREEN: 1433087999,
    DARKORANGE: 4287365375,
    DARKORCHID: 2570243327,
    DARKRED: 2332033279,
    DARKSALMON: 3918953215,
    DARKSEAGREEN: 2411499519,
    DARKSLATEBLUE: 1211993087,
    DARKSLATEGRAY: 793726975,
    DARKSLATEGREY: 793726975,
    DARKTURQUOISE: 13554175,
    DARKVIOLET: 2483082239,
    DEEPPINK: 4279538687,
    DEEPSKYBLUE: 12582911,
    DIMGRAY: 1768516095,
    DIMGREY: 1768516095,
    DODGERBLUE: 512819199,
    FIREBRICK: 2988581631,
    FLORALWHITE: 4294635775,
    FORESTGREEN: 579543807,
    FUCHSIA: 4278255615,
    GAINSBORO: 3705462015,
    GHOSTWHITE: 4177068031,
    GOLD: 4292280575,
    GOLDENROD: 3668254975,
    GRAY: 2155905279,
    GREEN: 8388863,
    GREENYELLOW: 2919182335,
    GREY: 2155905279,
    HONEYDEW: 4043305215,
    HOTPINK: 4285117695,
    INDIANRED: 3445382399,
    INDIGO: 1258324735,
    IVORY: 4294963455,
    KHAKI: 4041641215,
    LAVENDER: 3873897215,
    LAVENDERBLUSH: 4293981695,
    LAWNGREEN: 2096890111,
    LEMONCHIFFON: 4294626815,
    LIGHTBLUE: 2916673279,
    LIGHTCORAL: 4034953471,
    LIGHTCYAN: 3774873599,
    LIGHTGOLDENRODYELLOW: 4210742015,
    LIGHTGRAY: 3553874943,
    LIGHTGREEN: 2431553791,
    LIGHTGREY: 3553874943,
    LIGHTPINK: 4290167295,
    LIGHTSALMON: 4288707327,
    LIGHTSEAGREEN: 548580095,
    LIGHTSKYBLUE: 2278488831,
    LIGHTSLATEGRAY: 2005441023,
    LIGHTSLATEGREY: 2005441023,
    LIGHTSTEELBLUE: 2965692159,
    LIGHTYELLOW: 4294959359,
    LIME: 16711935,
    LIMEGREEN: 852308735,
    LINEN: 4210091775,
    MAGENTA: 4278255615,
    MAROON: 2147483903,
    MEDIUMAQUAMARINE: 1724754687,
    MEDIUMBLUE: 52735,
    MEDIUMORCHID: 3126187007,
    MEDIUMPURPLE: 2473647103,
    MEDIUMSEAGREEN: 1018393087,
    MEDIUMSLATEBLUE: 2070474495,
    MEDIUMSPRINGGREEN: 16423679,
    MEDIUMTURQUOISE: 1221709055,
    MEDIUMVIOLETRED: 3340076543,
    MIDNIGHTBLUE: 421097727,
    MINTCREAM: 4127193855,
    MISTYROSE: 4293190143,
    MOCCASIN: 4293178879,
    NAVAJOWHITE: 4292783615,
    NAVY: 33023,
    OLDLACE: 4260751103,
    OLIVE: 2155872511,
    OLIVEDRAB: 1804477439,
    ORANGE: 4289003775,
    ORANGERED: 4282712319,
    ORCHID: 3664828159,
    PALEGOLDENROD: 4008225535,
    PALEGREEN: 2566625535,
    PALETURQUOISE: 2951671551,
    PALEVIOLETRED: 3681588223,
    PAPAYAWHIP: 4293907967,
    PEACHPUFF: 4292524543,
    PERU: 3448061951,
    PINK: 4290825215,
    PLUM: 3718307327,
    POWDERBLUE: 2967529215,
    PURPLE: 2147516671,
    REBECCAPURPLE: 1714657791,
    RED: 4278190335,
    ROSYBROWN: 3163525119,
    ROYALBLUE: 1097458175,
    SADDLEBROWN: 2336560127,
    SALMON: 4202722047,
    SANDYBROWN: 4104413439,
    SEAGREEN: 780883967,
    SEASHELL: 4294307583,
    SIENNA: 2689740287,
    SILVER: 3233857791,
    SKYBLUE: 2278484991,
    SLATEBLUE: 1784335871,
    SLATEGRAY: 1887473919,
    SLATEGREY: 1887473919,
    SNOW: 4294638335,
    SPRINGGREEN: 16744447,
    STEELBLUE: 1182971135,
    TAN: 3535047935,
    TEAL: 8421631,
    THISTLE: 3636451583,
    TOMATO: 4284696575,
    TRANSPARENT: 0,
    TURQUOISE: 1088475391,
    VIOLET: 4001558271,
    WHEAT: 4125012991,
    WHITE: 4294967295,
    WHITESMOKE: 4126537215,
    YELLOW: 4294902015,
    YELLOWGREEN: 2597139199
  };
  var backgroundClip = {
    name: "background-clip",
    initialValue: "border-box",
    prefix: false,
    type: 1,
    parse: function(_context, tokens) {
      return tokens.map(function(token) {
        if (isIdentToken(token)) {
          switch (token.value) {
            case "padding-box":
              return 1;
            case "content-box":
              return 2;
          }
        }
        return 0;
      });
    }
  };
  var backgroundColor = {
    name: "background-color",
    initialValue: "transparent",
    prefix: false,
    type: 3,
    format: "color"
  };
  var parseColorStop = function(context, args) {
    var color2 = color$1.parse(context, args[0]);
    var stop = args[1];
    return stop && isLengthPercentage(stop) ? { color: color2, stop } : { color: color2, stop: null };
  };
  var processColorStops = function(stops, lineLength) {
    var first = stops[0];
    var last = stops[stops.length - 1];
    if (first.stop === null) {
      first.stop = ZERO_LENGTH;
    }
    if (last.stop === null) {
      last.stop = HUNDRED_PERCENT;
    }
    var processStops = [];
    var previous2 = 0;
    for (var i2 = 0; i2 < stops.length; i2++) {
      var stop_1 = stops[i2].stop;
      if (stop_1 !== null) {
        var absoluteValue = getAbsoluteValue(stop_1, lineLength);
        if (absoluteValue > previous2) {
          processStops.push(absoluteValue);
        } else {
          processStops.push(previous2);
        }
        previous2 = absoluteValue;
      } else {
        processStops.push(null);
      }
    }
    var gapBegin = null;
    for (var i2 = 0; i2 < processStops.length; i2++) {
      var stop_2 = processStops[i2];
      if (stop_2 === null) {
        if (gapBegin === null) {
          gapBegin = i2;
        }
      } else if (gapBegin !== null) {
        var gapLength = i2 - gapBegin;
        var beforeGap = processStops[gapBegin - 1];
        var gapValue = (stop_2 - beforeGap) / (gapLength + 1);
        for (var g2 = 1; g2 <= gapLength; g2++) {
          processStops[gapBegin + g2 - 1] = gapValue * g2;
        }
        gapBegin = null;
      }
    }
    return stops.map(function(_a, i3) {
      var color2 = _a.color;
      return { color: color2, stop: Math.max(Math.min(1, processStops[i3] / lineLength), 0) };
    });
  };
  var getAngleFromCorner = function(corner, width, height) {
    var centerX = width / 2;
    var centerY = height / 2;
    var x2 = getAbsoluteValue(corner[0], width) - centerX;
    var y2 = centerY - getAbsoluteValue(corner[1], height);
    return (Math.atan2(y2, x2) + Math.PI * 2) % (Math.PI * 2);
  };
  var calculateGradientDirection = function(angle2, width, height) {
    var radian = typeof angle2 === "number" ? angle2 : getAngleFromCorner(angle2, width, height);
    var lineLength = Math.abs(width * Math.sin(radian)) + Math.abs(height * Math.cos(radian));
    var halfWidth = width / 2;
    var halfHeight = height / 2;
    var halfLineLength = lineLength / 2;
    var yDiff = Math.sin(radian - Math.PI / 2) * halfLineLength;
    var xDiff = Math.cos(radian - Math.PI / 2) * halfLineLength;
    return [lineLength, halfWidth - xDiff, halfWidth + xDiff, halfHeight - yDiff, halfHeight + yDiff];
  };
  var distance = function(a2, b2) {
    return Math.sqrt(a2 * a2 + b2 * b2);
  };
  var findCorner = function(width, height, x2, y2, closest) {
    var corners = [
      [0, 0],
      [0, height],
      [width, 0],
      [width, height]
    ];
    return corners.reduce(function(stat, corner) {
      var cx = corner[0], cy = corner[1];
      var d2 = distance(x2 - cx, y2 - cy);
      if (closest ? d2 < stat.optimumDistance : d2 > stat.optimumDistance) {
        return {
          optimumCorner: corner,
          optimumDistance: d2
        };
      }
      return stat;
    }, {
      optimumDistance: closest ? Infinity : -Infinity,
      optimumCorner: null
    }).optimumCorner;
  };
  var calculateRadius = function(gradient, x2, y2, width, height) {
    var rx = 0;
    var ry = 0;
    switch (gradient.size) {
      case 0:
        if (gradient.shape === 0) {
          rx = ry = Math.min(Math.abs(x2), Math.abs(x2 - width), Math.abs(y2), Math.abs(y2 - height));
        } else if (gradient.shape === 1) {
          rx = Math.min(Math.abs(x2), Math.abs(x2 - width));
          ry = Math.min(Math.abs(y2), Math.abs(y2 - height));
        }
        break;
      case 2:
        if (gradient.shape === 0) {
          rx = ry = Math.min(distance(x2, y2), distance(x2, y2 - height), distance(x2 - width, y2), distance(x2 - width, y2 - height));
        } else if (gradient.shape === 1) {
          var c2 = Math.min(Math.abs(y2), Math.abs(y2 - height)) / Math.min(Math.abs(x2), Math.abs(x2 - width));
          var _a = findCorner(width, height, x2, y2, true), cx = _a[0], cy = _a[1];
          rx = distance(cx - x2, (cy - y2) / c2);
          ry = c2 * rx;
        }
        break;
      case 1:
        if (gradient.shape === 0) {
          rx = ry = Math.max(Math.abs(x2), Math.abs(x2 - width), Math.abs(y2), Math.abs(y2 - height));
        } else if (gradient.shape === 1) {
          rx = Math.max(Math.abs(x2), Math.abs(x2 - width));
          ry = Math.max(Math.abs(y2), Math.abs(y2 - height));
        }
        break;
      case 3:
        if (gradient.shape === 0) {
          rx = ry = Math.max(distance(x2, y2), distance(x2, y2 - height), distance(x2 - width, y2), distance(x2 - width, y2 - height));
        } else if (gradient.shape === 1) {
          var c2 = Math.max(Math.abs(y2), Math.abs(y2 - height)) / Math.max(Math.abs(x2), Math.abs(x2 - width));
          var _b = findCorner(width, height, x2, y2, false), cx = _b[0], cy = _b[1];
          rx = distance(cx - x2, (cy - y2) / c2);
          ry = c2 * rx;
        }
        break;
    }
    if (Array.isArray(gradient.size)) {
      rx = getAbsoluteValue(gradient.size[0], width);
      ry = gradient.size.length === 2 ? getAbsoluteValue(gradient.size[1], height) : rx;
    }
    return [rx, ry];
  };
  var linearGradient = function(context, tokens) {
    var angle$1 = deg(180);
    var stops = [];
    parseFunctionArgs(tokens).forEach(function(arg, i2) {
      if (i2 === 0) {
        var firstToken = arg[0];
        if (firstToken.type === 20 && firstToken.value === "to") {
          angle$1 = parseNamedSide(arg);
          return;
        } else if (isAngle(firstToken)) {
          angle$1 = angle.parse(context, firstToken);
          return;
        }
      }
      var colorStop = parseColorStop(context, arg);
      stops.push(colorStop);
    });
    return {
      angle: angle$1,
      stops,
      type: 1
      /* LINEAR_GRADIENT */
    };
  };
  var prefixLinearGradient = function(context, tokens) {
    var angle$1 = deg(180);
    var stops = [];
    parseFunctionArgs(tokens).forEach(function(arg, i2) {
      if (i2 === 0) {
        var firstToken = arg[0];
        if (firstToken.type === 20 && ["top", "left", "right", "bottom"].indexOf(firstToken.value) !== -1) {
          angle$1 = parseNamedSide(arg);
          return;
        } else if (isAngle(firstToken)) {
          angle$1 = (angle.parse(context, firstToken) + deg(270)) % deg(360);
          return;
        }
      }
      var colorStop = parseColorStop(context, arg);
      stops.push(colorStop);
    });
    return {
      angle: angle$1,
      stops,
      type: 1
      /* LINEAR_GRADIENT */
    };
  };
  var webkitGradient = function(context, tokens) {
    var angle2 = deg(180);
    var stops = [];
    var type = 1;
    var shape = 0;
    var size = 3;
    var position2 = [];
    parseFunctionArgs(tokens).forEach(function(arg, i2) {
      var firstToken = arg[0];
      if (i2 === 0) {
        if (isIdentToken(firstToken) && firstToken.value === "linear") {
          type = 1;
          return;
        } else if (isIdentToken(firstToken) && firstToken.value === "radial") {
          type = 2;
          return;
        }
      }
      if (firstToken.type === 18) {
        if (firstToken.name === "from") {
          var color2 = color$1.parse(context, firstToken.values[0]);
          stops.push({ stop: ZERO_LENGTH, color: color2 });
        } else if (firstToken.name === "to") {
          var color2 = color$1.parse(context, firstToken.values[0]);
          stops.push({ stop: HUNDRED_PERCENT, color: color2 });
        } else if (firstToken.name === "color-stop") {
          var values = firstToken.values.filter(nonFunctionArgSeparator);
          if (values.length === 2) {
            var color2 = color$1.parse(context, values[1]);
            var stop_1 = values[0];
            if (isNumberToken(stop_1)) {
              stops.push({
                stop: { type: 16, number: stop_1.number * 100, flags: stop_1.flags },
                color: color2
              });
            }
          }
        }
      }
    });
    return type === 1 ? {
      angle: (angle2 + deg(180)) % deg(360),
      stops,
      type
    } : { size, shape, stops, position: position2, type };
  };
  var CLOSEST_SIDE = "closest-side";
  var FARTHEST_SIDE = "farthest-side";
  var CLOSEST_CORNER = "closest-corner";
  var FARTHEST_CORNER = "farthest-corner";
  var CIRCLE = "circle";
  var ELLIPSE = "ellipse";
  var COVER = "cover";
  var CONTAIN = "contain";
  var radialGradient = function(context, tokens) {
    var shape = 0;
    var size = 3;
    var stops = [];
    var position2 = [];
    parseFunctionArgs(tokens).forEach(function(arg, i2) {
      var isColorStop = true;
      if (i2 === 0) {
        var isAtPosition_1 = false;
        isColorStop = arg.reduce(function(acc, token) {
          if (isAtPosition_1) {
            if (isIdentToken(token)) {
              switch (token.value) {
                case "center":
                  position2.push(FIFTY_PERCENT);
                  return acc;
                case "top":
                case "left":
                  position2.push(ZERO_LENGTH);
                  return acc;
                case "right":
                case "bottom":
                  position2.push(HUNDRED_PERCENT);
                  return acc;
              }
            } else if (isLengthPercentage(token) || isLength(token)) {
              position2.push(token);
            }
          } else if (isIdentToken(token)) {
            switch (token.value) {
              case CIRCLE:
                shape = 0;
                return false;
              case ELLIPSE:
                shape = 1;
                return false;
              case "at":
                isAtPosition_1 = true;
                return false;
              case CLOSEST_SIDE:
                size = 0;
                return false;
              case COVER:
              case FARTHEST_SIDE:
                size = 1;
                return false;
              case CONTAIN:
              case CLOSEST_CORNER:
                size = 2;
                return false;
              case FARTHEST_CORNER:
                size = 3;
                return false;
            }
          } else if (isLength(token) || isLengthPercentage(token)) {
            if (!Array.isArray(size)) {
              size = [];
            }
            size.push(token);
            return false;
          }
          return acc;
        }, isColorStop);
      }
      if (isColorStop) {
        var colorStop = parseColorStop(context, arg);
        stops.push(colorStop);
      }
    });
    return {
      size,
      shape,
      stops,
      position: position2,
      type: 2
      /* RADIAL_GRADIENT */
    };
  };
  var prefixRadialGradient = function(context, tokens) {
    var shape = 0;
    var size = 3;
    var stops = [];
    var position2 = [];
    parseFunctionArgs(tokens).forEach(function(arg, i2) {
      var isColorStop = true;
      if (i2 === 0) {
        isColorStop = arg.reduce(function(acc, token) {
          if (isIdentToken(token)) {
            switch (token.value) {
              case "center":
                position2.push(FIFTY_PERCENT);
                return false;
              case "top":
              case "left":
                position2.push(ZERO_LENGTH);
                return false;
              case "right":
              case "bottom":
                position2.push(HUNDRED_PERCENT);
                return false;
            }
          } else if (isLengthPercentage(token) || isLength(token)) {
            position2.push(token);
            return false;
          }
          return acc;
        }, isColorStop);
      } else if (i2 === 1) {
        isColorStop = arg.reduce(function(acc, token) {
          if (isIdentToken(token)) {
            switch (token.value) {
              case CIRCLE:
                shape = 0;
                return false;
              case ELLIPSE:
                shape = 1;
                return false;
              case CONTAIN:
              case CLOSEST_SIDE:
                size = 0;
                return false;
              case FARTHEST_SIDE:
                size = 1;
                return false;
              case CLOSEST_CORNER:
                size = 2;
                return false;
              case COVER:
              case FARTHEST_CORNER:
                size = 3;
                return false;
            }
          } else if (isLength(token) || isLengthPercentage(token)) {
            if (!Array.isArray(size)) {
              size = [];
            }
            size.push(token);
            return false;
          }
          return acc;
        }, isColorStop);
      }
      if (isColorStop) {
        var colorStop = parseColorStop(context, arg);
        stops.push(colorStop);
      }
    });
    return {
      size,
      shape,
      stops,
      position: position2,
      type: 2
      /* RADIAL_GRADIENT */
    };
  };
  var isLinearGradient = function(background) {
    return background.type === 1;
  };
  var isRadialGradient = function(background) {
    return background.type === 2;
  };
  var image = {
    name: "image",
    parse: function(context, value2) {
      if (value2.type === 22) {
        var image_1 = {
          url: value2.value,
          type: 0
          /* URL */
        };
        context.cache.addImage(value2.value);
        return image_1;
      }
      if (value2.type === 18) {
        var imageFunction = SUPPORTED_IMAGE_FUNCTIONS[value2.name];
        if (typeof imageFunction === "undefined") {
          throw new Error('Attempting to parse an unsupported image function "' + value2.name + '"');
        }
        return imageFunction(context, value2.values);
      }
      throw new Error("Unsupported image type " + value2.type);
    }
  };
  function isSupportedImage(value2) {
    return !(value2.type === 20 && value2.value === "none") && (value2.type !== 18 || !!SUPPORTED_IMAGE_FUNCTIONS[value2.name]);
  }
  var SUPPORTED_IMAGE_FUNCTIONS = {
    "linear-gradient": linearGradient,
    "-moz-linear-gradient": prefixLinearGradient,
    "-ms-linear-gradient": prefixLinearGradient,
    "-o-linear-gradient": prefixLinearGradient,
    "-webkit-linear-gradient": prefixLinearGradient,
    "radial-gradient": radialGradient,
    "-moz-radial-gradient": prefixRadialGradient,
    "-ms-radial-gradient": prefixRadialGradient,
    "-o-radial-gradient": prefixRadialGradient,
    "-webkit-radial-gradient": prefixRadialGradient,
    "-webkit-gradient": webkitGradient
  };
  var backgroundImage = {
    name: "background-image",
    initialValue: "none",
    type: 1,
    prefix: false,
    parse: function(context, tokens) {
      if (tokens.length === 0) {
        return [];
      }
      var first = tokens[0];
      if (first.type === 20 && first.value === "none") {
        return [];
      }
      return tokens.filter(function(value2) {
        return nonFunctionArgSeparator(value2) && isSupportedImage(value2);
      }).map(function(value2) {
        return image.parse(context, value2);
      });
    }
  };
  var backgroundOrigin = {
    name: "background-origin",
    initialValue: "border-box",
    prefix: false,
    type: 1,
    parse: function(_context, tokens) {
      return tokens.map(function(token) {
        if (isIdentToken(token)) {
          switch (token.value) {
            case "padding-box":
              return 1;
            case "content-box":
              return 2;
          }
        }
        return 0;
      });
    }
  };
  var backgroundPosition = {
    name: "background-position",
    initialValue: "0% 0%",
    type: 1,
    prefix: false,
    parse: function(_context, tokens) {
      return parseFunctionArgs(tokens).map(function(values) {
        return values.filter(isLengthPercentage);
      }).map(parseLengthPercentageTuple);
    }
  };
  var backgroundRepeat = {
    name: "background-repeat",
    initialValue: "repeat",
    prefix: false,
    type: 1,
    parse: function(_context, tokens) {
      return parseFunctionArgs(tokens).map(function(values) {
        return values.filter(isIdentToken).map(function(token) {
          return token.value;
        }).join(" ");
      }).map(parseBackgroundRepeat);
    }
  };
  var parseBackgroundRepeat = function(value2) {
    switch (value2) {
      case "no-repeat":
        return 1;
      case "repeat-x":
      case "repeat no-repeat":
        return 2;
      case "repeat-y":
      case "no-repeat repeat":
        return 3;
      case "repeat":
      default:
        return 0;
    }
  };
  var BACKGROUND_SIZE;
  (function(BACKGROUND_SIZE2) {
    BACKGROUND_SIZE2["AUTO"] = "auto";
    BACKGROUND_SIZE2["CONTAIN"] = "contain";
    BACKGROUND_SIZE2["COVER"] = "cover";
  })(BACKGROUND_SIZE || (BACKGROUND_SIZE = {}));
  var backgroundSize = {
    name: "background-size",
    initialValue: "0",
    prefix: false,
    type: 1,
    parse: function(_context, tokens) {
      return parseFunctionArgs(tokens).map(function(values) {
        return values.filter(isBackgroundSizeInfoToken);
      });
    }
  };
  var isBackgroundSizeInfoToken = function(value2) {
    return isIdentToken(value2) || isLengthPercentage(value2);
  };
  var borderColorForSide = function(side) {
    return {
      name: "border-" + side + "-color",
      initialValue: "transparent",
      prefix: false,
      type: 3,
      format: "color"
    };
  };
  var borderTopColor = borderColorForSide("top");
  var borderRightColor = borderColorForSide("right");
  var borderBottomColor = borderColorForSide("bottom");
  var borderLeftColor = borderColorForSide("left");
  var borderRadiusForSide = function(side) {
    return {
      name: "border-radius-" + side,
      initialValue: "0 0",
      prefix: false,
      type: 1,
      parse: function(_context, tokens) {
        return parseLengthPercentageTuple(tokens.filter(isLengthPercentage));
      }
    };
  };
  var borderTopLeftRadius = borderRadiusForSide("top-left");
  var borderTopRightRadius = borderRadiusForSide("top-right");
  var borderBottomRightRadius = borderRadiusForSide("bottom-right");
  var borderBottomLeftRadius = borderRadiusForSide("bottom-left");
  var borderStyleForSide = function(side) {
    return {
      name: "border-" + side + "-style",
      initialValue: "solid",
      prefix: false,
      type: 2,
      parse: function(_context, style2) {
        switch (style2) {
          case "none":
            return 0;
          case "dashed":
            return 2;
          case "dotted":
            return 3;
          case "double":
            return 4;
        }
        return 1;
      }
    };
  };
  var borderTopStyle = borderStyleForSide("top");
  var borderRightStyle = borderStyleForSide("right");
  var borderBottomStyle = borderStyleForSide("bottom");
  var borderLeftStyle = borderStyleForSide("left");
  var borderWidthForSide = function(side) {
    return {
      name: "border-" + side + "-width",
      initialValue: "0",
      type: 0,
      prefix: false,
      parse: function(_context, token) {
        if (isDimensionToken(token)) {
          return token.number;
        }
        return 0;
      }
    };
  };
  var borderTopWidth = borderWidthForSide("top");
  var borderRightWidth = borderWidthForSide("right");
  var borderBottomWidth = borderWidthForSide("bottom");
  var borderLeftWidth = borderWidthForSide("left");
  var color = {
    name: "color",
    initialValue: "transparent",
    prefix: false,
    type: 3,
    format: "color"
  };
  var direction = {
    name: "direction",
    initialValue: "ltr",
    prefix: false,
    type: 2,
    parse: function(_context, direction2) {
      switch (direction2) {
        case "rtl":
          return 1;
        case "ltr":
        default:
          return 0;
      }
    }
  };
  var display = {
    name: "display",
    initialValue: "inline-block",
    prefix: false,
    type: 1,
    parse: function(_context, tokens) {
      return tokens.filter(isIdentToken).reduce(
        function(bit, token) {
          return bit | parseDisplayValue(token.value);
        },
        0
        /* NONE */
      );
    }
  };
  var parseDisplayValue = function(display2) {
    switch (display2) {
      case "block":
      case "-webkit-box":
        return 2;
      case "inline":
        return 4;
      case "run-in":
        return 8;
      case "flow":
        return 16;
      case "flow-root":
        return 32;
      case "table":
        return 64;
      case "flex":
      case "-webkit-flex":
        return 128;
      case "grid":
      case "-ms-grid":
        return 256;
      case "ruby":
        return 512;
      case "subgrid":
        return 1024;
      case "list-item":
        return 2048;
      case "table-row-group":
        return 4096;
      case "table-header-group":
        return 8192;
      case "table-footer-group":
        return 16384;
      case "table-row":
        return 32768;
      case "table-cell":
        return 65536;
      case "table-column-group":
        return 131072;
      case "table-column":
        return 262144;
      case "table-caption":
        return 524288;
      case "ruby-base":
        return 1048576;
      case "ruby-text":
        return 2097152;
      case "ruby-base-container":
        return 4194304;
      case "ruby-text-container":
        return 8388608;
      case "contents":
        return 16777216;
      case "inline-block":
        return 33554432;
      case "inline-list-item":
        return 67108864;
      case "inline-table":
        return 134217728;
      case "inline-flex":
        return 268435456;
      case "inline-grid":
        return 536870912;
    }
    return 0;
  };
  var float = {
    name: "float",
    initialValue: "none",
    prefix: false,
    type: 2,
    parse: function(_context, float2) {
      switch (float2) {
        case "left":
          return 1;
        case "right":
          return 2;
        case "inline-start":
          return 3;
        case "inline-end":
          return 4;
      }
      return 0;
    }
  };
  var letterSpacing = {
    name: "letter-spacing",
    initialValue: "0",
    prefix: false,
    type: 0,
    parse: function(_context, token) {
      if (token.type === 20 && token.value === "normal") {
        return 0;
      }
      if (token.type === 17) {
        return token.number;
      }
      if (token.type === 15) {
        return token.number;
      }
      return 0;
    }
  };
  var LINE_BREAK;
  (function(LINE_BREAK2) {
    LINE_BREAK2["NORMAL"] = "normal";
    LINE_BREAK2["STRICT"] = "strict";
  })(LINE_BREAK || (LINE_BREAK = {}));
  var lineBreak = {
    name: "line-break",
    initialValue: "normal",
    prefix: false,
    type: 2,
    parse: function(_context, lineBreak2) {
      switch (lineBreak2) {
        case "strict":
          return LINE_BREAK.STRICT;
        case "normal":
        default:
          return LINE_BREAK.NORMAL;
      }
    }
  };
  var lineHeight = {
    name: "line-height",
    initialValue: "normal",
    prefix: false,
    type: 4
    /* TOKEN_VALUE */
  };
  var computeLineHeight = function(token, fontSize2) {
    if (isIdentToken(token) && token.value === "normal") {
      return 1.2 * fontSize2;
    } else if (token.type === 17) {
      return fontSize2 * token.number;
    } else if (isLengthPercentage(token)) {
      return getAbsoluteValue(token, fontSize2);
    }
    return fontSize2;
  };
  var listStyleImage = {
    name: "list-style-image",
    initialValue: "none",
    type: 0,
    prefix: false,
    parse: function(context, token) {
      if (token.type === 20 && token.value === "none") {
        return null;
      }
      return image.parse(context, token);
    }
  };
  var listStylePosition = {
    name: "list-style-position",
    initialValue: "outside",
    prefix: false,
    type: 2,
    parse: function(_context, position2) {
      switch (position2) {
        case "inside":
          return 0;
        case "outside":
        default:
          return 1;
      }
    }
  };
  var listStyleType = {
    name: "list-style-type",
    initialValue: "none",
    prefix: false,
    type: 2,
    parse: function(_context, type) {
      switch (type) {
        case "disc":
          return 0;
        case "circle":
          return 1;
        case "square":
          return 2;
        case "decimal":
          return 3;
        case "cjk-decimal":
          return 4;
        case "decimal-leading-zero":
          return 5;
        case "lower-roman":
          return 6;
        case "upper-roman":
          return 7;
        case "lower-greek":
          return 8;
        case "lower-alpha":
          return 9;
        case "upper-alpha":
          return 10;
        case "arabic-indic":
          return 11;
        case "armenian":
          return 12;
        case "bengali":
          return 13;
        case "cambodian":
          return 14;
        case "cjk-earthly-branch":
          return 15;
        case "cjk-heavenly-stem":
          return 16;
        case "cjk-ideographic":
          return 17;
        case "devanagari":
          return 18;
        case "ethiopic-numeric":
          return 19;
        case "georgian":
          return 20;
        case "gujarati":
          return 21;
        case "gurmukhi":
          return 22;
        case "hebrew":
          return 22;
        case "hiragana":
          return 23;
        case "hiragana-iroha":
          return 24;
        case "japanese-formal":
          return 25;
        case "japanese-informal":
          return 26;
        case "kannada":
          return 27;
        case "katakana":
          return 28;
        case "katakana-iroha":
          return 29;
        case "khmer":
          return 30;
        case "korean-hangul-formal":
          return 31;
        case "korean-hanja-formal":
          return 32;
        case "korean-hanja-informal":
          return 33;
        case "lao":
          return 34;
        case "lower-armenian":
          return 35;
        case "malayalam":
          return 36;
        case "mongolian":
          return 37;
        case "myanmar":
          return 38;
        case "oriya":
          return 39;
        case "persian":
          return 40;
        case "simp-chinese-formal":
          return 41;
        case "simp-chinese-informal":
          return 42;
        case "tamil":
          return 43;
        case "telugu":
          return 44;
        case "thai":
          return 45;
        case "tibetan":
          return 46;
        case "trad-chinese-formal":
          return 47;
        case "trad-chinese-informal":
          return 48;
        case "upper-armenian":
          return 49;
        case "disclosure-open":
          return 50;
        case "disclosure-closed":
          return 51;
        case "none":
        default:
          return -1;
      }
    }
  };
  var marginForSide = function(side) {
    return {
      name: "margin-" + side,
      initialValue: "0",
      prefix: false,
      type: 4
      /* TOKEN_VALUE */
    };
  };
  var marginTop = marginForSide("top");
  var marginRight = marginForSide("right");
  var marginBottom = marginForSide("bottom");
  var marginLeft = marginForSide("left");
  var overflow = {
    name: "overflow",
    initialValue: "visible",
    prefix: false,
    type: 1,
    parse: function(_context, tokens) {
      return tokens.filter(isIdentToken).map(function(overflow2) {
        switch (overflow2.value) {
          case "hidden":
            return 1;
          case "scroll":
            return 2;
          case "clip":
            return 3;
          case "auto":
            return 4;
          case "visible":
          default:
            return 0;
        }
      });
    }
  };
  var overflowWrap = {
    name: "overflow-wrap",
    initialValue: "normal",
    prefix: false,
    type: 2,
    parse: function(_context, overflow2) {
      switch (overflow2) {
        case "break-word":
          return "break-word";
        case "normal":
        default:
          return "normal";
      }
    }
  };
  var paddingForSide = function(side) {
    return {
      name: "padding-" + side,
      initialValue: "0",
      prefix: false,
      type: 3,
      format: "length-percentage"
    };
  };
  var paddingTop = paddingForSide("top");
  var paddingRight = paddingForSide("right");
  var paddingBottom = paddingForSide("bottom");
  var paddingLeft = paddingForSide("left");
  var textAlign = {
    name: "text-align",
    initialValue: "left",
    prefix: false,
    type: 2,
    parse: function(_context, textAlign2) {
      switch (textAlign2) {
        case "right":
          return 2;
        case "center":
        case "justify":
          return 1;
        case "left":
        default:
          return 0;
      }
    }
  };
  var position = {
    name: "position",
    initialValue: "static",
    prefix: false,
    type: 2,
    parse: function(_context, position2) {
      switch (position2) {
        case "relative":
          return 1;
        case "absolute":
          return 2;
        case "fixed":
          return 3;
        case "sticky":
          return 4;
      }
      return 0;
    }
  };
  var textShadow = {
    name: "text-shadow",
    initialValue: "none",
    type: 1,
    prefix: false,
    parse: function(context, tokens) {
      if (tokens.length === 1 && isIdentWithValue(tokens[0], "none")) {
        return [];
      }
      return parseFunctionArgs(tokens).map(function(values) {
        var shadow = {
          color: COLORS.TRANSPARENT,
          offsetX: ZERO_LENGTH,
          offsetY: ZERO_LENGTH,
          blur: ZERO_LENGTH
        };
        var c2 = 0;
        for (var i2 = 0; i2 < values.length; i2++) {
          var token = values[i2];
          if (isLength(token)) {
            if (c2 === 0) {
              shadow.offsetX = token;
            } else if (c2 === 1) {
              shadow.offsetY = token;
            } else {
              shadow.blur = token;
            }
            c2++;
          } else {
            shadow.color = color$1.parse(context, token);
          }
        }
        return shadow;
      });
    }
  };
  var textTransform = {
    name: "text-transform",
    initialValue: "none",
    prefix: false,
    type: 2,
    parse: function(_context, textTransform2) {
      switch (textTransform2) {
        case "uppercase":
          return 2;
        case "lowercase":
          return 1;
        case "capitalize":
          return 3;
      }
      return 0;
    }
  };
  var transform$1 = {
    name: "transform",
    initialValue: "none",
    prefix: true,
    type: 0,
    parse: function(_context, token) {
      if (token.type === 20 && token.value === "none") {
        return null;
      }
      if (token.type === 18) {
        var transformFunction = SUPPORTED_TRANSFORM_FUNCTIONS[token.name];
        if (typeof transformFunction === "undefined") {
          throw new Error('Attempting to parse an unsupported transform function "' + token.name + '"');
        }
        return transformFunction(token.values);
      }
      return null;
    }
  };
  var matrix = function(args) {
    var values = args.filter(function(arg) {
      return arg.type === 17;
    }).map(function(arg) {
      return arg.number;
    });
    return values.length === 6 ? values : null;
  };
  var matrix3d = function(args) {
    var values = args.filter(function(arg) {
      return arg.type === 17;
    }).map(function(arg) {
      return arg.number;
    });
    var a1 = values[0], b1 = values[1];
    values[2];
    values[3];
    var a2 = values[4], b2 = values[5];
    values[6];
    values[7];
    values[8];
    values[9];
    values[10];
    values[11];
    var a4 = values[12], b4 = values[13];
    values[14];
    values[15];
    return values.length === 16 ? [a1, b1, a2, b2, a4, b4] : null;
  };
  var SUPPORTED_TRANSFORM_FUNCTIONS = {
    matrix,
    matrix3d
  };
  var DEFAULT_VALUE = {
    type: 16,
    number: 50,
    flags: FLAG_INTEGER
  };
  var DEFAULT = [DEFAULT_VALUE, DEFAULT_VALUE];
  var transformOrigin = {
    name: "transform-origin",
    initialValue: "50% 50%",
    prefix: true,
    type: 1,
    parse: function(_context, tokens) {
      var origins = tokens.filter(isLengthPercentage);
      if (origins.length !== 2) {
        return DEFAULT;
      }
      return [origins[0], origins[1]];
    }
  };
  var visibility = {
    name: "visible",
    initialValue: "none",
    prefix: false,
    type: 2,
    parse: function(_context, visibility2) {
      switch (visibility2) {
        case "hidden":
          return 1;
        case "collapse":
          return 2;
        case "visible":
        default:
          return 0;
      }
    }
  };
  var WORD_BREAK;
  (function(WORD_BREAK2) {
    WORD_BREAK2["NORMAL"] = "normal";
    WORD_BREAK2["BREAK_ALL"] = "break-all";
    WORD_BREAK2["KEEP_ALL"] = "keep-all";
  })(WORD_BREAK || (WORD_BREAK = {}));
  var wordBreak = {
    name: "word-break",
    initialValue: "normal",
    prefix: false,
    type: 2,
    parse: function(_context, wordBreak2) {
      switch (wordBreak2) {
        case "break-all":
          return WORD_BREAK.BREAK_ALL;
        case "keep-all":
          return WORD_BREAK.KEEP_ALL;
        case "normal":
        default:
          return WORD_BREAK.NORMAL;
      }
    }
  };
  var zIndex = {
    name: "z-index",
    initialValue: "auto",
    prefix: false,
    type: 0,
    parse: function(_context, token) {
      if (token.type === 20) {
        return { auto: true, order: 0 };
      }
      if (isNumberToken(token)) {
        return { auto: false, order: token.number };
      }
      throw new Error("Invalid z-index number parsed");
    }
  };
  var time = {
    name: "time",
    parse: function(_context, value2) {
      if (value2.type === 15) {
        switch (value2.unit.toLowerCase()) {
          case "s":
            return 1e3 * value2.number;
          case "ms":
            return value2.number;
        }
      }
      throw new Error("Unsupported time type");
    }
  };
  var opacity = {
    name: "opacity",
    initialValue: "1",
    type: 0,
    prefix: false,
    parse: function(_context, token) {
      if (isNumberToken(token)) {
        return token.number;
      }
      return 1;
    }
  };
  var textDecorationColor = {
    name: "text-decoration-color",
    initialValue: "transparent",
    prefix: false,
    type: 3,
    format: "color"
  };
  var textDecorationLine = {
    name: "text-decoration-line",
    initialValue: "none",
    prefix: false,
    type: 1,
    parse: function(_context, tokens) {
      return tokens.filter(isIdentToken).map(function(token) {
        switch (token.value) {
          case "underline":
            return 1;
          case "overline":
            return 2;
          case "line-through":
            return 3;
          case "none":
            return 4;
        }
        return 0;
      }).filter(function(line) {
        return line !== 0;
      });
    }
  };
  var fontFamily = {
    name: "font-family",
    initialValue: "",
    prefix: false,
    type: 1,
    parse: function(_context, tokens) {
      var accumulator = [];
      var results = [];
      tokens.forEach(function(token) {
        switch (token.type) {
          case 20:
          case 0:
            accumulator.push(token.value);
            break;
          case 17:
            accumulator.push(token.number.toString());
            break;
          case 4:
            results.push(accumulator.join(" "));
            accumulator.length = 0;
            break;
        }
      });
      if (accumulator.length) {
        results.push(accumulator.join(" "));
      }
      return results.map(function(result) {
        return result.indexOf(" ") === -1 ? result : "'" + result + "'";
      });
    }
  };
  var fontSize = {
    name: "font-size",
    initialValue: "0",
    prefix: false,
    type: 3,
    format: "length"
  };
  var fontWeight = {
    name: "font-weight",
    initialValue: "normal",
    type: 0,
    prefix: false,
    parse: function(_context, token) {
      if (isNumberToken(token)) {
        return token.number;
      }
      if (isIdentToken(token)) {
        switch (token.value) {
          case "bold":
            return 700;
          case "normal":
          default:
            return 400;
        }
      }
      return 400;
    }
  };
  var fontVariant = {
    name: "font-variant",
    initialValue: "none",
    type: 1,
    prefix: false,
    parse: function(_context, tokens) {
      return tokens.filter(isIdentToken).map(function(token) {
        return token.value;
      });
    }
  };
  var fontStyle = {
    name: "font-style",
    initialValue: "normal",
    prefix: false,
    type: 2,
    parse: function(_context, overflow2) {
      switch (overflow2) {
        case "oblique":
          return "oblique";
        case "italic":
          return "italic";
        case "normal":
        default:
          return "normal";
      }
    }
  };
  var contains = function(bit, value2) {
    return (bit & value2) !== 0;
  };
  var content = {
    name: "content",
    initialValue: "none",
    type: 1,
    prefix: false,
    parse: function(_context, tokens) {
      if (tokens.length === 0) {
        return [];
      }
      var first = tokens[0];
      if (first.type === 20 && first.value === "none") {
        return [];
      }
      return tokens;
    }
  };
  var counterIncrement = {
    name: "counter-increment",
    initialValue: "none",
    prefix: true,
    type: 1,
    parse: function(_context, tokens) {
      if (tokens.length === 0) {
        return null;
      }
      var first = tokens[0];
      if (first.type === 20 && first.value === "none") {
        return null;
      }
      var increments = [];
      var filtered = tokens.filter(nonWhiteSpace);
      for (var i2 = 0; i2 < filtered.length; i2++) {
        var counter = filtered[i2];
        var next = filtered[i2 + 1];
        if (counter.type === 20) {
          var increment2 = next && isNumberToken(next) ? next.number : 1;
          increments.push({ counter: counter.value, increment: increment2 });
        }
      }
      return increments;
    }
  };
  var counterReset = {
    name: "counter-reset",
    initialValue: "none",
    prefix: true,
    type: 1,
    parse: function(_context, tokens) {
      if (tokens.length === 0) {
        return [];
      }
      var resets = [];
      var filtered = tokens.filter(nonWhiteSpace);
      for (var i2 = 0; i2 < filtered.length; i2++) {
        var counter = filtered[i2];
        var next = filtered[i2 + 1];
        if (isIdentToken(counter) && counter.value !== "none") {
          var reset = next && isNumberToken(next) ? next.number : 0;
          resets.push({ counter: counter.value, reset });
        }
      }
      return resets;
    }
  };
  var duration = {
    name: "duration",
    initialValue: "0s",
    prefix: false,
    type: 1,
    parse: function(context, tokens) {
      return tokens.filter(isDimensionToken).map(function(token) {
        return time.parse(context, token);
      });
    }
  };
  var quotes = {
    name: "quotes",
    initialValue: "none",
    prefix: true,
    type: 1,
    parse: function(_context, tokens) {
      if (tokens.length === 0) {
        return null;
      }
      var first = tokens[0];
      if (first.type === 20 && first.value === "none") {
        return null;
      }
      var quotes2 = [];
      var filtered = tokens.filter(isStringToken);
      if (filtered.length % 2 !== 0) {
        return null;
      }
      for (var i2 = 0; i2 < filtered.length; i2 += 2) {
        var open_1 = filtered[i2].value;
        var close_1 = filtered[i2 + 1].value;
        quotes2.push({ open: open_1, close: close_1 });
      }
      return quotes2;
    }
  };
  var getQuote = function(quotes2, depth, open) {
    if (!quotes2) {
      return "";
    }
    var quote = quotes2[Math.min(depth, quotes2.length - 1)];
    if (!quote) {
      return "";
    }
    return open ? quote.open : quote.close;
  };
  var boxShadow = {
    name: "box-shadow",
    initialValue: "none",
    type: 1,
    prefix: false,
    parse: function(context, tokens) {
      if (tokens.length === 1 && isIdentWithValue(tokens[0], "none")) {
        return [];
      }
      return parseFunctionArgs(tokens).map(function(values) {
        var shadow = {
          color: 255,
          offsetX: ZERO_LENGTH,
          offsetY: ZERO_LENGTH,
          blur: ZERO_LENGTH,
          spread: ZERO_LENGTH,
          inset: false
        };
        var c2 = 0;
        for (var i2 = 0; i2 < values.length; i2++) {
          var token = values[i2];
          if (isIdentWithValue(token, "inset")) {
            shadow.inset = true;
          } else if (isLength(token)) {
            if (c2 === 0) {
              shadow.offsetX = token;
            } else if (c2 === 1) {
              shadow.offsetY = token;
            } else if (c2 === 2) {
              shadow.blur = token;
            } else {
              shadow.spread = token;
            }
            c2++;
          } else {
            shadow.color = color$1.parse(context, token);
          }
        }
        return shadow;
      });
    }
  };
  var paintOrder = {
    name: "paint-order",
    initialValue: "normal",
    prefix: false,
    type: 1,
    parse: function(_context, tokens) {
      var DEFAULT_VALUE2 = [
        0,
        1,
        2
        /* MARKERS */
      ];
      var layers = [];
      tokens.filter(isIdentToken).forEach(function(token) {
        switch (token.value) {
          case "stroke":
            layers.push(
              1
              /* STROKE */
            );
            break;
          case "fill":
            layers.push(
              0
              /* FILL */
            );
            break;
          case "markers":
            layers.push(
              2
              /* MARKERS */
            );
            break;
        }
      });
      DEFAULT_VALUE2.forEach(function(value2) {
        if (layers.indexOf(value2) === -1) {
          layers.push(value2);
        }
      });
      return layers;
    }
  };
  var webkitTextStrokeColor = {
    name: "-webkit-text-stroke-color",
    initialValue: "currentcolor",
    prefix: false,
    type: 3,
    format: "color"
  };
  var webkitTextStrokeWidth = {
    name: "-webkit-text-stroke-width",
    initialValue: "0",
    type: 0,
    prefix: false,
    parse: function(_context, token) {
      if (isDimensionToken(token)) {
        return token.number;
      }
      return 0;
    }
  };
  var CSSParsedDeclaration = (
    /** @class */
    function() {
      function CSSParsedDeclaration2(context, declaration) {
        var _a, _b;
        this.animationDuration = parse(context, duration, declaration.animationDuration);
        this.backgroundClip = parse(context, backgroundClip, declaration.backgroundClip);
        this.backgroundColor = parse(context, backgroundColor, declaration.backgroundColor);
        this.backgroundImage = parse(context, backgroundImage, declaration.backgroundImage);
        this.backgroundOrigin = parse(context, backgroundOrigin, declaration.backgroundOrigin);
        this.backgroundPosition = parse(context, backgroundPosition, declaration.backgroundPosition);
        this.backgroundRepeat = parse(context, backgroundRepeat, declaration.backgroundRepeat);
        this.backgroundSize = parse(context, backgroundSize, declaration.backgroundSize);
        this.borderTopColor = parse(context, borderTopColor, declaration.borderTopColor);
        this.borderRightColor = parse(context, borderRightColor, declaration.borderRightColor);
        this.borderBottomColor = parse(context, borderBottomColor, declaration.borderBottomColor);
        this.borderLeftColor = parse(context, borderLeftColor, declaration.borderLeftColor);
        this.borderTopLeftRadius = parse(context, borderTopLeftRadius, declaration.borderTopLeftRadius);
        this.borderTopRightRadius = parse(context, borderTopRightRadius, declaration.borderTopRightRadius);
        this.borderBottomRightRadius = parse(context, borderBottomRightRadius, declaration.borderBottomRightRadius);
        this.borderBottomLeftRadius = parse(context, borderBottomLeftRadius, declaration.borderBottomLeftRadius);
        this.borderTopStyle = parse(context, borderTopStyle, declaration.borderTopStyle);
        this.borderRightStyle = parse(context, borderRightStyle, declaration.borderRightStyle);
        this.borderBottomStyle = parse(context, borderBottomStyle, declaration.borderBottomStyle);
        this.borderLeftStyle = parse(context, borderLeftStyle, declaration.borderLeftStyle);
        this.borderTopWidth = parse(context, borderTopWidth, declaration.borderTopWidth);
        this.borderRightWidth = parse(context, borderRightWidth, declaration.borderRightWidth);
        this.borderBottomWidth = parse(context, borderBottomWidth, declaration.borderBottomWidth);
        this.borderLeftWidth = parse(context, borderLeftWidth, declaration.borderLeftWidth);
        this.boxShadow = parse(context, boxShadow, declaration.boxShadow);
        this.color = parse(context, color, declaration.color);
        this.direction = parse(context, direction, declaration.direction);
        this.display = parse(context, display, declaration.display);
        this.float = parse(context, float, declaration.cssFloat);
        this.fontFamily = parse(context, fontFamily, declaration.fontFamily);
        this.fontSize = parse(context, fontSize, declaration.fontSize);
        this.fontStyle = parse(context, fontStyle, declaration.fontStyle);
        this.fontVariant = parse(context, fontVariant, declaration.fontVariant);
        this.fontWeight = parse(context, fontWeight, declaration.fontWeight);
        this.letterSpacing = parse(context, letterSpacing, declaration.letterSpacing);
        this.lineBreak = parse(context, lineBreak, declaration.lineBreak);
        this.lineHeight = parse(context, lineHeight, declaration.lineHeight);
        this.listStyleImage = parse(context, listStyleImage, declaration.listStyleImage);
        this.listStylePosition = parse(context, listStylePosition, declaration.listStylePosition);
        this.listStyleType = parse(context, listStyleType, declaration.listStyleType);
        this.marginTop = parse(context, marginTop, declaration.marginTop);
        this.marginRight = parse(context, marginRight, declaration.marginRight);
        this.marginBottom = parse(context, marginBottom, declaration.marginBottom);
        this.marginLeft = parse(context, marginLeft, declaration.marginLeft);
        this.opacity = parse(context, opacity, declaration.opacity);
        var overflowTuple = parse(context, overflow, declaration.overflow);
        this.overflowX = overflowTuple[0];
        this.overflowY = overflowTuple[overflowTuple.length > 1 ? 1 : 0];
        this.overflowWrap = parse(context, overflowWrap, declaration.overflowWrap);
        this.paddingTop = parse(context, paddingTop, declaration.paddingTop);
        this.paddingRight = parse(context, paddingRight, declaration.paddingRight);
        this.paddingBottom = parse(context, paddingBottom, declaration.paddingBottom);
        this.paddingLeft = parse(context, paddingLeft, declaration.paddingLeft);
        this.paintOrder = parse(context, paintOrder, declaration.paintOrder);
        this.position = parse(context, position, declaration.position);
        this.textAlign = parse(context, textAlign, declaration.textAlign);
        this.textDecorationColor = parse(context, textDecorationColor, (_a = declaration.textDecorationColor) !== null && _a !== void 0 ? _a : declaration.color);
        this.textDecorationLine = parse(context, textDecorationLine, (_b = declaration.textDecorationLine) !== null && _b !== void 0 ? _b : declaration.textDecoration);
        this.textShadow = parse(context, textShadow, declaration.textShadow);
        this.textTransform = parse(context, textTransform, declaration.textTransform);
        this.transform = parse(context, transform$1, declaration.transform);
        this.transformOrigin = parse(context, transformOrigin, declaration.transformOrigin);
        this.visibility = parse(context, visibility, declaration.visibility);
        this.webkitTextStrokeColor = parse(context, webkitTextStrokeColor, declaration.webkitTextStrokeColor);
        this.webkitTextStrokeWidth = parse(context, webkitTextStrokeWidth, declaration.webkitTextStrokeWidth);
        this.wordBreak = parse(context, wordBreak, declaration.wordBreak);
        this.zIndex = parse(context, zIndex, declaration.zIndex);
      }
      CSSParsedDeclaration2.prototype.isVisible = function() {
        return this.display > 0 && this.opacity > 0 && this.visibility === 0;
      };
      CSSParsedDeclaration2.prototype.isTransparent = function() {
        return isTransparent(this.backgroundColor);
      };
      CSSParsedDeclaration2.prototype.isTransformed = function() {
        return this.transform !== null;
      };
      CSSParsedDeclaration2.prototype.isPositioned = function() {
        return this.position !== 0;
      };
      CSSParsedDeclaration2.prototype.isPositionedWithZIndex = function() {
        return this.isPositioned() && !this.zIndex.auto;
      };
      CSSParsedDeclaration2.prototype.isFloating = function() {
        return this.float !== 0;
      };
      CSSParsedDeclaration2.prototype.isInlineLevel = function() {
        return contains(
          this.display,
          4
          /* INLINE */
        ) || contains(
          this.display,
          33554432
          /* INLINE_BLOCK */
        ) || contains(
          this.display,
          268435456
          /* INLINE_FLEX */
        ) || contains(
          this.display,
          536870912
          /* INLINE_GRID */
        ) || contains(
          this.display,
          67108864
          /* INLINE_LIST_ITEM */
        ) || contains(
          this.display,
          134217728
          /* INLINE_TABLE */
        );
      };
      return CSSParsedDeclaration2;
    }()
  );
  var CSSParsedPseudoDeclaration = (
    /** @class */
    function() {
      function CSSParsedPseudoDeclaration2(context, declaration) {
        this.content = parse(context, content, declaration.content);
        this.quotes = parse(context, quotes, declaration.quotes);
      }
      return CSSParsedPseudoDeclaration2;
    }()
  );
  var CSSParsedCounterDeclaration = (
    /** @class */
    function() {
      function CSSParsedCounterDeclaration2(context, declaration) {
        this.counterIncrement = parse(context, counterIncrement, declaration.counterIncrement);
        this.counterReset = parse(context, counterReset, declaration.counterReset);
      }
      return CSSParsedCounterDeclaration2;
    }()
  );
  var parse = function(context, descriptor, style2) {
    var tokenizer = new Tokenizer();
    var value2 = style2 !== null && typeof style2 !== "undefined" ? style2.toString() : descriptor.initialValue;
    tokenizer.write(value2);
    var parser = new Parser(tokenizer.read());
    switch (descriptor.type) {
      case 2:
        var token = parser.parseComponentValue();
        return descriptor.parse(context, isIdentToken(token) ? token.value : descriptor.initialValue);
      case 0:
        return descriptor.parse(context, parser.parseComponentValue());
      case 1:
        return descriptor.parse(context, parser.parseComponentValues());
      case 4:
        return parser.parseComponentValue();
      case 3:
        switch (descriptor.format) {
          case "angle":
            return angle.parse(context, parser.parseComponentValue());
          case "color":
            return color$1.parse(context, parser.parseComponentValue());
          case "image":
            return image.parse(context, parser.parseComponentValue());
          case "length":
            var length_1 = parser.parseComponentValue();
            return isLength(length_1) ? length_1 : ZERO_LENGTH;
          case "length-percentage":
            var value_1 = parser.parseComponentValue();
            return isLengthPercentage(value_1) ? value_1 : ZERO_LENGTH;
          case "time":
            return time.parse(context, parser.parseComponentValue());
        }
        break;
    }
  };
  var elementDebuggerAttribute = "data-html2canvas-debug";
  var getElementDebugType = function(element2) {
    var attribute = element2.getAttribute(elementDebuggerAttribute);
    switch (attribute) {
      case "all":
        return 1;
      case "clone":
        return 2;
      case "parse":
        return 3;
      case "render":
        return 4;
      default:
        return 0;
    }
  };
  var isDebugging = function(element2, type) {
    var elementType = getElementDebugType(element2);
    return elementType === 1 || type === elementType;
  };
  var ElementContainer = (
    /** @class */
    function() {
      function ElementContainer2(context, element2) {
        this.context = context;
        this.textNodes = [];
        this.elements = [];
        this.flags = 0;
        if (isDebugging(
          element2,
          3
          /* PARSE */
        )) {
          debugger;
        }
        this.styles = new CSSParsedDeclaration(context, window.getComputedStyle(element2, null));
        if (isHTMLElementNode(element2)) {
          if (this.styles.animationDuration.some(function(duration2) {
            return duration2 > 0;
          })) {
            element2.style.animationDuration = "0s";
          }
          if (this.styles.transform !== null) {
            element2.style.transform = "none";
          }
        }
        this.bounds = parseBounds(this.context, element2);
        if (isDebugging(
          element2,
          4
          /* RENDER */
        )) {
          this.flags |= 16;
        }
      }
      return ElementContainer2;
    }()
  );
  var base64 = "AAAAAAAAAAAAEA4AGBkAAFAaAAACAAAAAAAIABAAGAAwADgACAAQAAgAEAAIABAACAAQAAgAEAAIABAACAAQAAgAEAAIABAAQABIAEQATAAIABAACAAQAAgAEAAIABAAVABcAAgAEAAIABAACAAQAGAAaABwAHgAgACIAI4AlgAIABAAmwCjAKgAsAC2AL4AvQDFAMoA0gBPAVYBWgEIAAgACACMANoAYgFkAWwBdAF8AX0BhQGNAZUBlgGeAaMBlQGWAasBswF8AbsBwwF0AcsBYwHTAQgA2wG/AOMBdAF8AekB8QF0AfkB+wHiAHQBfAEIAAMC5gQIAAsCEgIIAAgAFgIeAggAIgIpAggAMQI5AkACygEIAAgASAJQAlgCYAIIAAgACAAKBQoFCgUTBRMFGQUrBSsFCAAIAAgACAAIAAgACAAIAAgACABdAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABoAmgCrwGvAQgAbgJ2AggAHgEIAAgACADnAXsCCAAIAAgAgwIIAAgACAAIAAgACACKAggAkQKZAggAPADJAAgAoQKkAqwCsgK6AsICCADJAggA0AIIAAgACAAIANYC3gIIAAgACAAIAAgACABAAOYCCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAkASoB+QIEAAgACAA8AEMCCABCBQgACABJBVAFCAAIAAgACAAIAAgACAAIAAgACABTBVoFCAAIAFoFCABfBWUFCAAIAAgACAAIAAgAbQUIAAgACAAIAAgACABzBXsFfQWFBYoFigWKBZEFigWKBYoFmAWfBaYFrgWxBbkFCAAIAAgACAAIAAgACAAIAAgACAAIAMEFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAMgFCADQBQgACAAIAAgACAAIAAgACAAIAAgACAAIAO4CCAAIAAgAiQAIAAgACABAAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAD0AggACAD8AggACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIANYFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAMDvwAIAAgAJAIIAAgACAAIAAgACAAIAAgACwMTAwgACAB9BOsEGwMjAwgAKwMyAwsFYgE3A/MEPwMIAEUDTQNRAwgAWQOsAGEDCAAIAAgACAAIAAgACABpAzQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFIQUoBSwFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABtAwgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABMAEwACAAIAAgACAAIABgACAAIAAgACAC/AAgACAAyAQgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACACAAIAAwAAgACAAIAAgACAAIAAgACAAIAAAARABIAAgACAAIABQASAAIAAgAIABwAEAAjgCIABsAqAC2AL0AigDQAtwC+IJIQqVAZUBWQqVAZUBlQGVAZUBlQGrC5UBlQGVAZUBlQGVAZUBlQGVAXsKlQGVAbAK6wsrDGUMpQzlDJUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAfAKAAuZA64AtwCJALoC6ADwAAgAuACgA/oEpgO6AqsD+AAIAAgAswMIAAgACAAIAIkAuwP5AfsBwwPLAwgACAAIAAgACADRA9kDCAAIAOED6QMIAAgACAAIAAgACADuA/YDCAAIAP4DyQAIAAgABgQIAAgAXQAOBAgACAAIAAgACAAIABMECAAIAAgACAAIAAgACAD8AAQBCAAIAAgAGgQiBCoECAExBAgAEAEIAAgACAAIAAgACAAIAAgACAAIAAgACAA4BAgACABABEYECAAIAAgATAQYAQgAVAQIAAgACAAIAAgACAAIAAgACAAIAFoECAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAOQEIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAB+BAcACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAEABhgSMBAgACAAIAAgAlAQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAwAEAAQABAADAAMAAwADAAQABAAEAAQABAAEAAQABHATAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAdQMIAAgACAAIAAgACAAIAMkACAAIAAgAfQMIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACACFA4kDCAAIAAgACAAIAOcBCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAIcDCAAIAAgACAAIAAgACAAIAAgACAAIAJEDCAAIAAgACADFAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABgBAgAZgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAbAQCBXIECAAIAHkECAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABAAJwEQACjBKoEsgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAC6BMIECAAIAAgACAAIAAgACABmBAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAxwQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAGYECAAIAAgAzgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAigWKBYoFigWKBYoFigWKBd0FXwUIAOIF6gXxBYoF3gT5BQAGCAaKBYoFigWKBYoFigWKBYoFigWKBYoFigXWBIoFigWKBYoFigWKBYoFigWKBYsFEAaKBYoFigWKBYoFigWKBRQGCACKBYoFigWKBQgACAAIANEECAAIABgGigUgBggAJgYIAC4GMwaKBYoF0wQ3Bj4GigWKBYoFigWKBYoFigWKBYoFigWKBYoFigUIAAgACAAIAAgACAAIAAgAigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWLBf///////wQABAAEAAQABAAEAAQABAAEAAQAAwAEAAQAAgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAQADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAUAAAAFAAUAAAAFAAUAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUAAQAAAAUABQAFAAUABQAFAAAAAAAFAAUAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAFAAUAAQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUABQAFAAAABwAHAAcAAAAHAAcABwAFAAEAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAcABwAFAAUAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAQABAAAAAAAAAAAAAAAFAAUABQAFAAAABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABwAHAAcAAAAHAAcAAAAAAAUABQAHAAUAAQAHAAEABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABwABAAUABQAFAAUAAAAAAAAAAAAAAAEAAQABAAEAAQABAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABQANAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEAAQABAAEAAQABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAABQAHAAUABQAFAAAAAAAAAAcABQAFAAUABQAFAAQABAAEAAQABAAEAAQABAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUAAAAFAAUABQAFAAUAAAAFAAUABQAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAAAAAAAAAAAAUABQAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAUAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABwAHAAcABwAFAAcABwAAAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAUABwAHAAUABQAFAAUAAAAAAAcABwAAAAAABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAABQAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAABwAHAAcABQAFAAAAAAAAAAAABQAFAAAAAAAFAAUABQAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAFAAUABQAFAAUAAAAFAAUABwAAAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAFAAUABwAFAAUABQAFAAAAAAAHAAcAAAAAAAcABwAFAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABwAAAAAAAAAHAAcABwAAAAcABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAABQAHAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAcABwAAAAUABQAFAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABQAHAAcABQAHAAcAAAAFAAcABwAAAAcABwAFAAUAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAFAAcABwAFAAUABQAAAAUAAAAHAAcABwAHAAcABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAHAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAABwAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAUAAAAFAAAAAAAAAAAABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUABQAFAAUAAAAFAAUAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABwAFAAUABQAFAAUABQAAAAUABQAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABQAFAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABQAFAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAHAAUABQAFAAUABQAFAAUABwAHAAcABwAHAAcABwAHAAUABwAHAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABwAHAAcABwAFAAUABwAHAAcAAAAAAAAAAAAHAAcABQAHAAcABwAHAAcABwAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAHAAUABQAFAAUABQAFAAUAAAAFAAAABQAAAAAABQAFAAUABQAFAAUABQAFAAcABwAHAAcABwAHAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAUABQAFAAUABQAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABwAFAAcABwAHAAcABwAFAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAUABQAFAAUABwAHAAUABQAHAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABQAFAAcABwAHAAUABwAFAAUABQAHAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAUABQAFAAUABQAFAAUABQAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAcABQAFAAUABQAFAAUABQAAAAAAAAAAAAUAAAAAAAAAAAAAAAAABQAAAAAABwAFAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUAAAAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAABQAAAAAAAAAFAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAUABQAHAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAHAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABwAFAAUABQAFAAcABwAFAAUABwAHAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAcABwAFAAUABwAHAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAFAAUABQAAAAAABQAFAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAFAAcABwAAAAAAAAAAAAAABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAFAAcABwAFAAcABwAAAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAFAAUABQAAAAUABQAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABwAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABQAFAAUABQAFAAUABQAFAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAHAAcABQAHAAUABQAAAAAAAAAAAAAAAAAFAAAABwAHAAcABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAcABwAAAAAABwAHAAAAAAAHAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABwAHAAUABQAFAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABQAFAAUABQAFAAUABwAFAAcABwAFAAcABQAFAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABQAFAAUABQAAAAAABwAHAAcABwAFAAUABwAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAHAAUABQAFAAUABQAFAAUABQAHAAcABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAFAAcABwAFAAUABQAFAAUABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAcABwAFAAUABQAFAAcABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABQAHAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAAAAAAFAAUABwAHAAcABwAFAAAAAAAAAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABwAHAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAHAAUABQAFAAUABQAFAAUABwAFAAUABwAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAAAAAAAABQAAAAUABQAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAHAAcAAAAFAAUAAAAHAAcABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAAAAAAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAUABQAFAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAABQAFAAUABQAFAAUABQAAAAUABQAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAFAAUABQAFAAUADgAOAA4ADgAOAA4ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAAAAAAAAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAMAAwADAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAAAAAAAAAAAAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAAAAAAAAAAAAsADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwACwAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAADgAOAA4AAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAAAA4ADgAOAA4ADgAOAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAA4AAAAOAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAADgAAAAAAAAAAAA4AAAAOAAAAAAAAAAAADgAOAA4AAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAA4ADgAOAA4ADgAOAA4ADgAOAAAADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4AAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAOAA4ADgAOAA4ADgAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAAAAAAA=";
  var chars$1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var lookup$1 = typeof Uint8Array === "undefined" ? [] : new Uint8Array(256);
  for (var i$1 = 0; i$1 < chars$1.length; i$1++) {
    lookup$1[chars$1.charCodeAt(i$1)] = i$1;
  }
  var decode = function(base642) {
    var bufferLength = base642.length * 0.75, len = base642.length, i2, p2 = 0, encoded1, encoded2, encoded3, encoded4;
    if (base642[base642.length - 1] === "=") {
      bufferLength--;
      if (base642[base642.length - 2] === "=") {
        bufferLength--;
      }
    }
    var buffer = typeof ArrayBuffer !== "undefined" && typeof Uint8Array !== "undefined" && typeof Uint8Array.prototype.slice !== "undefined" ? new ArrayBuffer(bufferLength) : new Array(bufferLength);
    var bytes = Array.isArray(buffer) ? buffer : new Uint8Array(buffer);
    for (i2 = 0; i2 < len; i2 += 4) {
      encoded1 = lookup$1[base642.charCodeAt(i2)];
      encoded2 = lookup$1[base642.charCodeAt(i2 + 1)];
      encoded3 = lookup$1[base642.charCodeAt(i2 + 2)];
      encoded4 = lookup$1[base642.charCodeAt(i2 + 3)];
      bytes[p2++] = encoded1 << 2 | encoded2 >> 4;
      bytes[p2++] = (encoded2 & 15) << 4 | encoded3 >> 2;
      bytes[p2++] = (encoded3 & 3) << 6 | encoded4 & 63;
    }
    return buffer;
  };
  var polyUint16Array = function(buffer) {
    var length = buffer.length;
    var bytes = [];
    for (var i2 = 0; i2 < length; i2 += 2) {
      bytes.push(buffer[i2 + 1] << 8 | buffer[i2]);
    }
    return bytes;
  };
  var polyUint32Array = function(buffer) {
    var length = buffer.length;
    var bytes = [];
    for (var i2 = 0; i2 < length; i2 += 4) {
      bytes.push(buffer[i2 + 3] << 24 | buffer[i2 + 2] << 16 | buffer[i2 + 1] << 8 | buffer[i2]);
    }
    return bytes;
  };
  var UTRIE2_SHIFT_2 = 5;
  var UTRIE2_SHIFT_1 = 6 + 5;
  var UTRIE2_INDEX_SHIFT = 2;
  var UTRIE2_SHIFT_1_2 = UTRIE2_SHIFT_1 - UTRIE2_SHIFT_2;
  var UTRIE2_LSCP_INDEX_2_OFFSET = 65536 >> UTRIE2_SHIFT_2;
  var UTRIE2_DATA_BLOCK_LENGTH = 1 << UTRIE2_SHIFT_2;
  var UTRIE2_DATA_MASK = UTRIE2_DATA_BLOCK_LENGTH - 1;
  var UTRIE2_LSCP_INDEX_2_LENGTH = 1024 >> UTRIE2_SHIFT_2;
  var UTRIE2_INDEX_2_BMP_LENGTH = UTRIE2_LSCP_INDEX_2_OFFSET + UTRIE2_LSCP_INDEX_2_LENGTH;
  var UTRIE2_UTF8_2B_INDEX_2_OFFSET = UTRIE2_INDEX_2_BMP_LENGTH;
  var UTRIE2_UTF8_2B_INDEX_2_LENGTH = 2048 >> 6;
  var UTRIE2_INDEX_1_OFFSET = UTRIE2_UTF8_2B_INDEX_2_OFFSET + UTRIE2_UTF8_2B_INDEX_2_LENGTH;
  var UTRIE2_OMITTED_BMP_INDEX_1_LENGTH = 65536 >> UTRIE2_SHIFT_1;
  var UTRIE2_INDEX_2_BLOCK_LENGTH = 1 << UTRIE2_SHIFT_1_2;
  var UTRIE2_INDEX_2_MASK = UTRIE2_INDEX_2_BLOCK_LENGTH - 1;
  var slice16 = function(view, start, end) {
    if (view.slice) {
      return view.slice(start, end);
    }
    return new Uint16Array(Array.prototype.slice.call(view, start, end));
  };
  var slice32 = function(view, start, end) {
    if (view.slice) {
      return view.slice(start, end);
    }
    return new Uint32Array(Array.prototype.slice.call(view, start, end));
  };
  var createTrieFromBase64 = function(base642, _byteLength) {
    var buffer = decode(base642);
    var view32 = Array.isArray(buffer) ? polyUint32Array(buffer) : new Uint32Array(buffer);
    var view16 = Array.isArray(buffer) ? polyUint16Array(buffer) : new Uint16Array(buffer);
    var headerLength = 24;
    var index2 = slice16(view16, headerLength / 2, view32[4] / 2);
    var data = view32[5] === 2 ? slice16(view16, (headerLength + view32[4]) / 2) : slice32(view32, Math.ceil((headerLength + view32[4]) / 4));
    return new Trie(view32[0], view32[1], view32[2], view32[3], index2, data);
  };
  var Trie = (
    /** @class */
    function() {
      function Trie2(initialValue, errorValue, highStart, highValueIndex, index2, data) {
        this.initialValue = initialValue;
        this.errorValue = errorValue;
        this.highStart = highStart;
        this.highValueIndex = highValueIndex;
        this.index = index2;
        this.data = data;
      }
      Trie2.prototype.get = function(codePoint) {
        var ix;
        if (codePoint >= 0) {
          if (codePoint < 55296 || codePoint > 56319 && codePoint <= 65535) {
            ix = this.index[codePoint >> UTRIE2_SHIFT_2];
            ix = (ix << UTRIE2_INDEX_SHIFT) + (codePoint & UTRIE2_DATA_MASK);
            return this.data[ix];
          }
          if (codePoint <= 65535) {
            ix = this.index[UTRIE2_LSCP_INDEX_2_OFFSET + (codePoint - 55296 >> UTRIE2_SHIFT_2)];
            ix = (ix << UTRIE2_INDEX_SHIFT) + (codePoint & UTRIE2_DATA_MASK);
            return this.data[ix];
          }
          if (codePoint < this.highStart) {
            ix = UTRIE2_INDEX_1_OFFSET - UTRIE2_OMITTED_BMP_INDEX_1_LENGTH + (codePoint >> UTRIE2_SHIFT_1);
            ix = this.index[ix];
            ix += codePoint >> UTRIE2_SHIFT_2 & UTRIE2_INDEX_2_MASK;
            ix = this.index[ix];
            ix = (ix << UTRIE2_INDEX_SHIFT) + (codePoint & UTRIE2_DATA_MASK);
            return this.data[ix];
          }
          if (codePoint <= 1114111) {
            return this.data[this.highValueIndex];
          }
        }
        return this.errorValue;
      };
      return Trie2;
    }()
  );
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var lookup = typeof Uint8Array === "undefined" ? [] : new Uint8Array(256);
  for (var i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
  }
  var Prepend = 1;
  var CR = 2;
  var LF = 3;
  var Control = 4;
  var Extend = 5;
  var SpacingMark = 7;
  var L = 8;
  var V = 9;
  var T = 10;
  var LV = 11;
  var LVT = 12;
  var ZWJ = 13;
  var Extended_Pictographic = 14;
  var RI = 15;
  var toCodePoints = function(str) {
    var codePoints = [];
    var i2 = 0;
    var length = str.length;
    while (i2 < length) {
      var value2 = str.charCodeAt(i2++);
      if (value2 >= 55296 && value2 <= 56319 && i2 < length) {
        var extra = str.charCodeAt(i2++);
        if ((extra & 64512) === 56320) {
          codePoints.push(((value2 & 1023) << 10) + (extra & 1023) + 65536);
        } else {
          codePoints.push(value2);
          i2--;
        }
      } else {
        codePoints.push(value2);
      }
    }
    return codePoints;
  };
  var fromCodePoint = function() {
    var codePoints = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      codePoints[_i] = arguments[_i];
    }
    if (String.fromCodePoint) {
      return String.fromCodePoint.apply(String, codePoints);
    }
    var length = codePoints.length;
    if (!length) {
      return "";
    }
    var codeUnits = [];
    var index2 = -1;
    var result = "";
    while (++index2 < length) {
      var codePoint = codePoints[index2];
      if (codePoint <= 65535) {
        codeUnits.push(codePoint);
      } else {
        codePoint -= 65536;
        codeUnits.push((codePoint >> 10) + 55296, codePoint % 1024 + 56320);
      }
      if (index2 + 1 === length || codeUnits.length > 16384) {
        result += String.fromCharCode.apply(String, codeUnits);
        codeUnits.length = 0;
      }
    }
    return result;
  };
  var UnicodeTrie = createTrieFromBase64(base64);
  var BREAK_NOT_ALLOWED = "×";
  var BREAK_ALLOWED = "÷";
  var codePointToClass = function(codePoint) {
    return UnicodeTrie.get(codePoint);
  };
  var _graphemeBreakAtIndex = function(_codePoints, classTypes, index2) {
    var prevIndex = index2 - 2;
    var prev = classTypes[prevIndex];
    var current = classTypes[index2 - 1];
    var next = classTypes[index2];
    if (current === CR && next === LF) {
      return BREAK_NOT_ALLOWED;
    }
    if (current === CR || current === LF || current === Control) {
      return BREAK_ALLOWED;
    }
    if (next === CR || next === LF || next === Control) {
      return BREAK_ALLOWED;
    }
    if (current === L && [L, V, LV, LVT].indexOf(next) !== -1) {
      return BREAK_NOT_ALLOWED;
    }
    if ((current === LV || current === V) && (next === V || next === T)) {
      return BREAK_NOT_ALLOWED;
    }
    if ((current === LVT || current === T) && next === T) {
      return BREAK_NOT_ALLOWED;
    }
    if (next === ZWJ || next === Extend) {
      return BREAK_NOT_ALLOWED;
    }
    if (next === SpacingMark) {
      return BREAK_NOT_ALLOWED;
    }
    if (current === Prepend) {
      return BREAK_NOT_ALLOWED;
    }
    if (current === ZWJ && next === Extended_Pictographic) {
      while (prev === Extend) {
        prev = classTypes[--prevIndex];
      }
      if (prev === Extended_Pictographic) {
        return BREAK_NOT_ALLOWED;
      }
    }
    if (current === RI && next === RI) {
      var countRI = 0;
      while (prev === RI) {
        countRI++;
        prev = classTypes[--prevIndex];
      }
      if (countRI % 2 === 0) {
        return BREAK_NOT_ALLOWED;
      }
    }
    return BREAK_ALLOWED;
  };
  var GraphemeBreaker = function(str) {
    var codePoints = toCodePoints(str);
    var length = codePoints.length;
    var index2 = 0;
    var lastEnd = 0;
    var classTypes = codePoints.map(codePointToClass);
    return {
      next: function() {
        if (index2 >= length) {
          return { done: true, value: null };
        }
        var graphemeBreak = BREAK_NOT_ALLOWED;
        while (index2 < length && (graphemeBreak = _graphemeBreakAtIndex(codePoints, classTypes, ++index2)) === BREAK_NOT_ALLOWED) {
        }
        if (graphemeBreak !== BREAK_NOT_ALLOWED || index2 === length) {
          var value2 = fromCodePoint.apply(null, codePoints.slice(lastEnd, index2));
          lastEnd = index2;
          return { value: value2, done: false };
        }
        return { done: true, value: null };
      }
    };
  };
  var splitGraphemes = function(str) {
    var breaker = GraphemeBreaker(str);
    var graphemes = [];
    var bk;
    while (!(bk = breaker.next()).done) {
      if (bk.value) {
        graphemes.push(bk.value.slice());
      }
    }
    return graphemes;
  };
  var testRangeBounds = function(document2) {
    var TEST_HEIGHT = 123;
    if (document2.createRange) {
      var range = document2.createRange();
      if (range.getBoundingClientRect) {
        var testElement = document2.createElement("boundtest");
        testElement.style.height = TEST_HEIGHT + "px";
        testElement.style.display = "block";
        document2.body.appendChild(testElement);
        range.selectNode(testElement);
        var rangeBounds = range.getBoundingClientRect();
        var rangeHeight = Math.round(rangeBounds.height);
        document2.body.removeChild(testElement);
        if (rangeHeight === TEST_HEIGHT) {
          return true;
        }
      }
    }
    return false;
  };
  var testIOSLineBreak = function(document2) {
    var testElement = document2.createElement("boundtest");
    testElement.style.width = "50px";
    testElement.style.display = "block";
    testElement.style.fontSize = "12px";
    testElement.style.letterSpacing = "0px";
    testElement.style.wordSpacing = "0px";
    document2.body.appendChild(testElement);
    var range = document2.createRange();
    testElement.innerHTML = typeof "".repeat === "function" ? "&#128104;".repeat(10) : "";
    var node2 = testElement.firstChild;
    var textList = toCodePoints$1(node2.data).map(function(i2) {
      return fromCodePoint$1(i2);
    });
    var offset = 0;
    var prev = {};
    var supports = textList.every(function(text2, i2) {
      range.setStart(node2, offset);
      range.setEnd(node2, offset + text2.length);
      var rect = range.getBoundingClientRect();
      offset += text2.length;
      var boundAhead = rect.x > prev.x || rect.y > prev.y;
      prev = rect;
      if (i2 === 0) {
        return true;
      }
      return boundAhead;
    });
    document2.body.removeChild(testElement);
    return supports;
  };
  var testCORS = function() {
    return typeof new Image().crossOrigin !== "undefined";
  };
  var testResponseType = function() {
    return typeof new XMLHttpRequest().responseType === "string";
  };
  var testSVG = function(document2) {
    var img = new Image();
    var canvas = document2.createElement("canvas");
    var ctx = canvas.getContext("2d");
    if (!ctx) {
      return false;
    }
    img.src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'></svg>";
    try {
      ctx.drawImage(img, 0, 0);
      canvas.toDataURL();
    } catch (e2) {
      return false;
    }
    return true;
  };
  var isGreenPixel = function(data) {
    return data[0] === 0 && data[1] === 255 && data[2] === 0 && data[3] === 255;
  };
  var testForeignObject = function(document2) {
    var canvas = document2.createElement("canvas");
    var size = 100;
    canvas.width = size;
    canvas.height = size;
    var ctx = canvas.getContext("2d");
    if (!ctx) {
      return Promise.reject(false);
    }
    ctx.fillStyle = "rgb(0, 255, 0)";
    ctx.fillRect(0, 0, size, size);
    var img = new Image();
    var greenImageSrc = canvas.toDataURL();
    img.src = greenImageSrc;
    var svg2 = createForeignObjectSVG(size, size, 0, 0, img);
    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, size, size);
    return loadSerializedSVG$1(svg2).then(function(img2) {
      ctx.drawImage(img2, 0, 0);
      var data = ctx.getImageData(0, 0, size, size).data;
      ctx.fillStyle = "red";
      ctx.fillRect(0, 0, size, size);
      var node2 = document2.createElement("div");
      node2.style.backgroundImage = "url(" + greenImageSrc + ")";
      node2.style.height = size + "px";
      return isGreenPixel(data) ? loadSerializedSVG$1(createForeignObjectSVG(size, size, 0, 0, node2)) : Promise.reject(false);
    }).then(function(img2) {
      ctx.drawImage(img2, 0, 0);
      return isGreenPixel(ctx.getImageData(0, 0, size, size).data);
    }).catch(function() {
      return false;
    });
  };
  var createForeignObjectSVG = function(width, height, x2, y2, node2) {
    var xmlns2 = "http://www.w3.org/2000/svg";
    var svg2 = document.createElementNS(xmlns2, "svg");
    var foreignObject = document.createElementNS(xmlns2, "foreignObject");
    svg2.setAttributeNS(null, "width", width.toString());
    svg2.setAttributeNS(null, "height", height.toString());
    foreignObject.setAttributeNS(null, "width", "100%");
    foreignObject.setAttributeNS(null, "height", "100%");
    foreignObject.setAttributeNS(null, "x", x2.toString());
    foreignObject.setAttributeNS(null, "y", y2.toString());
    foreignObject.setAttributeNS(null, "externalResourcesRequired", "true");
    svg2.appendChild(foreignObject);
    foreignObject.appendChild(node2);
    return svg2;
  };
  var loadSerializedSVG$1 = function(svg2) {
    return new Promise(function(resolve, reject) {
      var img = new Image();
      img.onload = function() {
        return resolve(img);
      };
      img.onerror = reject;
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(svg2));
    });
  };
  var FEATURES = {
    get SUPPORT_RANGE_BOUNDS() {
      var value2 = testRangeBounds(document);
      Object.defineProperty(FEATURES, "SUPPORT_RANGE_BOUNDS", { value: value2 });
      return value2;
    },
    get SUPPORT_WORD_BREAKING() {
      var value2 = FEATURES.SUPPORT_RANGE_BOUNDS && testIOSLineBreak(document);
      Object.defineProperty(FEATURES, "SUPPORT_WORD_BREAKING", { value: value2 });
      return value2;
    },
    get SUPPORT_SVG_DRAWING() {
      var value2 = testSVG(document);
      Object.defineProperty(FEATURES, "SUPPORT_SVG_DRAWING", { value: value2 });
      return value2;
    },
    get SUPPORT_FOREIGNOBJECT_DRAWING() {
      var value2 = typeof Array.from === "function" && typeof window.fetch === "function" ? testForeignObject(document) : Promise.resolve(false);
      Object.defineProperty(FEATURES, "SUPPORT_FOREIGNOBJECT_DRAWING", { value: value2 });
      return value2;
    },
    get SUPPORT_CORS_IMAGES() {
      var value2 = testCORS();
      Object.defineProperty(FEATURES, "SUPPORT_CORS_IMAGES", { value: value2 });
      return value2;
    },
    get SUPPORT_RESPONSE_TYPE() {
      var value2 = testResponseType();
      Object.defineProperty(FEATURES, "SUPPORT_RESPONSE_TYPE", { value: value2 });
      return value2;
    },
    get SUPPORT_CORS_XHR() {
      var value2 = "withCredentials" in new XMLHttpRequest();
      Object.defineProperty(FEATURES, "SUPPORT_CORS_XHR", { value: value2 });
      return value2;
    },
    get SUPPORT_NATIVE_TEXT_SEGMENTATION() {
      var value2 = !!(typeof Intl !== "undefined" && Intl.Segmenter);
      Object.defineProperty(FEATURES, "SUPPORT_NATIVE_TEXT_SEGMENTATION", { value: value2 });
      return value2;
    }
  };
  var TextBounds = (
    /** @class */
    function() {
      function TextBounds2(text2, bounds) {
        this.text = text2;
        this.bounds = bounds;
      }
      return TextBounds2;
    }()
  );
  var parseTextBounds = function(context, value2, styles, node2) {
    var textList = breakText(value2, styles);
    var textBounds = [];
    var offset = 0;
    textList.forEach(function(text2) {
      if (styles.textDecorationLine.length || text2.trim().length > 0) {
        if (FEATURES.SUPPORT_RANGE_BOUNDS) {
          var clientRects = createRange(node2, offset, text2.length).getClientRects();
          if (clientRects.length > 1) {
            var subSegments = segmentGraphemes(text2);
            var subOffset_1 = 0;
            subSegments.forEach(function(subSegment) {
              textBounds.push(new TextBounds(subSegment, Bounds.fromDOMRectList(context, createRange(node2, subOffset_1 + offset, subSegment.length).getClientRects())));
              subOffset_1 += subSegment.length;
            });
          } else {
            textBounds.push(new TextBounds(text2, Bounds.fromDOMRectList(context, clientRects)));
          }
        } else {
          var replacementNode = node2.splitText(text2.length);
          textBounds.push(new TextBounds(text2, getWrapperBounds(context, node2)));
          node2 = replacementNode;
        }
      } else if (!FEATURES.SUPPORT_RANGE_BOUNDS) {
        node2 = node2.splitText(text2.length);
      }
      offset += text2.length;
    });
    return textBounds;
  };
  var getWrapperBounds = function(context, node2) {
    var ownerDocument = node2.ownerDocument;
    if (ownerDocument) {
      var wrapper = ownerDocument.createElement("html2canvaswrapper");
      wrapper.appendChild(node2.cloneNode(true));
      var parentNode = node2.parentNode;
      if (parentNode) {
        parentNode.replaceChild(wrapper, node2);
        var bounds = parseBounds(context, wrapper);
        if (wrapper.firstChild) {
          parentNode.replaceChild(wrapper.firstChild, wrapper);
        }
        return bounds;
      }
    }
    return Bounds.EMPTY;
  };
  var createRange = function(node2, offset, length) {
    var ownerDocument = node2.ownerDocument;
    if (!ownerDocument) {
      throw new Error("Node has no owner document");
    }
    var range = ownerDocument.createRange();
    range.setStart(node2, offset);
    range.setEnd(node2, offset + length);
    return range;
  };
  var segmentGraphemes = function(value2) {
    if (FEATURES.SUPPORT_NATIVE_TEXT_SEGMENTATION) {
      var segmenter = new Intl.Segmenter(void 0, { granularity: "grapheme" });
      return Array.from(segmenter.segment(value2)).map(function(segment) {
        return segment.segment;
      });
    }
    return splitGraphemes(value2);
  };
  var segmentWords = function(value2, styles) {
    if (FEATURES.SUPPORT_NATIVE_TEXT_SEGMENTATION) {
      var segmenter = new Intl.Segmenter(void 0, {
        granularity: "word"
      });
      return Array.from(segmenter.segment(value2)).map(function(segment) {
        return segment.segment;
      });
    }
    return breakWords(value2, styles);
  };
  var breakText = function(value2, styles) {
    return styles.letterSpacing !== 0 ? segmentGraphemes(value2) : segmentWords(value2, styles);
  };
  var wordSeparators = [32, 160, 4961, 65792, 65793, 4153, 4241];
  var breakWords = function(str, styles) {
    var breaker = LineBreaker(str, {
      lineBreak: styles.lineBreak,
      wordBreak: styles.overflowWrap === "break-word" ? "break-word" : styles.wordBreak
    });
    var words = [];
    var bk;
    var _loop_1 = function() {
      if (bk.value) {
        var value2 = bk.value.slice();
        var codePoints = toCodePoints$1(value2);
        var word_1 = "";
        codePoints.forEach(function(codePoint) {
          if (wordSeparators.indexOf(codePoint) === -1) {
            word_1 += fromCodePoint$1(codePoint);
          } else {
            if (word_1.length) {
              words.push(word_1);
            }
            words.push(fromCodePoint$1(codePoint));
            word_1 = "";
          }
        });
        if (word_1.length) {
          words.push(word_1);
        }
      }
    };
    while (!(bk = breaker.next()).done) {
      _loop_1();
    }
    return words;
  };
  var TextContainer = (
    /** @class */
    function() {
      function TextContainer2(context, node2, styles) {
        this.text = transform(node2.data, styles.textTransform);
        this.textBounds = parseTextBounds(context, this.text, styles, node2);
      }
      return TextContainer2;
    }()
  );
  var transform = function(text2, transform2) {
    switch (transform2) {
      case 1:
        return text2.toLowerCase();
      case 3:
        return text2.replace(CAPITALIZE, capitalize);
      case 2:
        return text2.toUpperCase();
      default:
        return text2;
    }
  };
  var CAPITALIZE = /(^|\s|:|-|\(|\))([a-z])/g;
  var capitalize = function(m2, p1, p2) {
    if (m2.length > 0) {
      return p1 + p2.toUpperCase();
    }
    return m2;
  };
  var ImageElementContainer = (
    /** @class */
    function(_super) {
      __extends(ImageElementContainer2, _super);
      function ImageElementContainer2(context, img) {
        var _this = _super.call(this, context, img) || this;
        _this.src = img.currentSrc || img.src;
        _this.intrinsicWidth = img.naturalWidth;
        _this.intrinsicHeight = img.naturalHeight;
        _this.context.cache.addImage(_this.src);
        return _this;
      }
      return ImageElementContainer2;
    }(ElementContainer)
  );
  var CanvasElementContainer = (
    /** @class */
    function(_super) {
      __extends(CanvasElementContainer2, _super);
      function CanvasElementContainer2(context, canvas) {
        var _this = _super.call(this, context, canvas) || this;
        _this.canvas = canvas;
        _this.intrinsicWidth = canvas.width;
        _this.intrinsicHeight = canvas.height;
        return _this;
      }
      return CanvasElementContainer2;
    }(ElementContainer)
  );
  var SVGElementContainer = (
    /** @class */
    function(_super) {
      __extends(SVGElementContainer2, _super);
      function SVGElementContainer2(context, img) {
        var _this = _super.call(this, context, img) || this;
        var s2 = new XMLSerializer();
        var bounds = parseBounds(context, img);
        img.setAttribute("width", bounds.width + "px");
        img.setAttribute("height", bounds.height + "px");
        _this.svg = "data:image/svg+xml," + encodeURIComponent(s2.serializeToString(img));
        _this.intrinsicWidth = img.width.baseVal.value;
        _this.intrinsicHeight = img.height.baseVal.value;
        _this.context.cache.addImage(_this.svg);
        return _this;
      }
      return SVGElementContainer2;
    }(ElementContainer)
  );
  var LIElementContainer = (
    /** @class */
    function(_super) {
      __extends(LIElementContainer2, _super);
      function LIElementContainer2(context, element2) {
        var _this = _super.call(this, context, element2) || this;
        _this.value = element2.value;
        return _this;
      }
      return LIElementContainer2;
    }(ElementContainer)
  );
  var OLElementContainer = (
    /** @class */
    function(_super) {
      __extends(OLElementContainer2, _super);
      function OLElementContainer2(context, element2) {
        var _this = _super.call(this, context, element2) || this;
        _this.start = element2.start;
        _this.reversed = typeof element2.reversed === "boolean" && element2.reversed === true;
        return _this;
      }
      return OLElementContainer2;
    }(ElementContainer)
  );
  var CHECKBOX_BORDER_RADIUS = [
    {
      type: 15,
      flags: 0,
      unit: "px",
      number: 3
    }
  ];
  var RADIO_BORDER_RADIUS = [
    {
      type: 16,
      flags: 0,
      number: 50
    }
  ];
  var reformatInputBounds = function(bounds) {
    if (bounds.width > bounds.height) {
      return new Bounds(bounds.left + (bounds.width - bounds.height) / 2, bounds.top, bounds.height, bounds.height);
    } else if (bounds.width < bounds.height) {
      return new Bounds(bounds.left, bounds.top + (bounds.height - bounds.width) / 2, bounds.width, bounds.width);
    }
    return bounds;
  };
  var getInputValue = function(node2) {
    var value2 = node2.type === PASSWORD ? new Array(node2.value.length + 1).join("•") : node2.value;
    return value2.length === 0 ? node2.placeholder || "" : value2;
  };
  var CHECKBOX = "checkbox";
  var RADIO = "radio";
  var PASSWORD = "password";
  var INPUT_COLOR = 707406591;
  var InputElementContainer = (
    /** @class */
    function(_super) {
      __extends(InputElementContainer2, _super);
      function InputElementContainer2(context, input) {
        var _this = _super.call(this, context, input) || this;
        _this.type = input.type.toLowerCase();
        _this.checked = input.checked;
        _this.value = getInputValue(input);
        if (_this.type === CHECKBOX || _this.type === RADIO) {
          _this.styles.backgroundColor = 3739148031;
          _this.styles.borderTopColor = _this.styles.borderRightColor = _this.styles.borderBottomColor = _this.styles.borderLeftColor = 2779096575;
          _this.styles.borderTopWidth = _this.styles.borderRightWidth = _this.styles.borderBottomWidth = _this.styles.borderLeftWidth = 1;
          _this.styles.borderTopStyle = _this.styles.borderRightStyle = _this.styles.borderBottomStyle = _this.styles.borderLeftStyle = 1;
          _this.styles.backgroundClip = [
            0
            /* BORDER_BOX */
          ];
          _this.styles.backgroundOrigin = [
            0
            /* BORDER_BOX */
          ];
          _this.bounds = reformatInputBounds(_this.bounds);
        }
        switch (_this.type) {
          case CHECKBOX:
            _this.styles.borderTopRightRadius = _this.styles.borderTopLeftRadius = _this.styles.borderBottomRightRadius = _this.styles.borderBottomLeftRadius = CHECKBOX_BORDER_RADIUS;
            break;
          case RADIO:
            _this.styles.borderTopRightRadius = _this.styles.borderTopLeftRadius = _this.styles.borderBottomRightRadius = _this.styles.borderBottomLeftRadius = RADIO_BORDER_RADIUS;
            break;
        }
        return _this;
      }
      return InputElementContainer2;
    }(ElementContainer)
  );
  var SelectElementContainer = (
    /** @class */
    function(_super) {
      __extends(SelectElementContainer2, _super);
      function SelectElementContainer2(context, element2) {
        var _this = _super.call(this, context, element2) || this;
        var option2 = element2.options[element2.selectedIndex || 0];
        _this.value = option2 ? option2.text || "" : "";
        return _this;
      }
      return SelectElementContainer2;
    }(ElementContainer)
  );
  var TextareaElementContainer = (
    /** @class */
    function(_super) {
      __extends(TextareaElementContainer2, _super);
      function TextareaElementContainer2(context, element2) {
        var _this = _super.call(this, context, element2) || this;
        _this.value = element2.value;
        return _this;
      }
      return TextareaElementContainer2;
    }(ElementContainer)
  );
  var IFrameElementContainer = (
    /** @class */
    function(_super) {
      __extends(IFrameElementContainer2, _super);
      function IFrameElementContainer2(context, iframe) {
        var _this = _super.call(this, context, iframe) || this;
        _this.src = iframe.src;
        _this.width = parseInt(iframe.width, 10) || 0;
        _this.height = parseInt(iframe.height, 10) || 0;
        _this.backgroundColor = _this.styles.backgroundColor;
        try {
          if (iframe.contentWindow && iframe.contentWindow.document && iframe.contentWindow.document.documentElement) {
            _this.tree = parseTree(context, iframe.contentWindow.document.documentElement);
            var documentBackgroundColor = iframe.contentWindow.document.documentElement ? parseColor(context, getComputedStyle(iframe.contentWindow.document.documentElement).backgroundColor) : COLORS.TRANSPARENT;
            var bodyBackgroundColor = iframe.contentWindow.document.body ? parseColor(context, getComputedStyle(iframe.contentWindow.document.body).backgroundColor) : COLORS.TRANSPARENT;
            _this.backgroundColor = isTransparent(documentBackgroundColor) ? isTransparent(bodyBackgroundColor) ? _this.styles.backgroundColor : bodyBackgroundColor : documentBackgroundColor;
          }
        } catch (e2) {
        }
        return _this;
      }
      return IFrameElementContainer2;
    }(ElementContainer)
  );
  var LIST_OWNERS = ["OL", "UL", "MENU"];
  var parseNodeTree = function(context, node2, parent, root2) {
    for (var childNode = node2.firstChild, nextNode = void 0; childNode; childNode = nextNode) {
      nextNode = childNode.nextSibling;
      if (isTextNode(childNode) && childNode.data.trim().length > 0) {
        parent.textNodes.push(new TextContainer(context, childNode, parent.styles));
      } else if (isElementNode(childNode)) {
        if (isSlotElement(childNode) && childNode.assignedNodes) {
          childNode.assignedNodes().forEach(function(childNode2) {
            return parseNodeTree(context, childNode2, parent, root2);
          });
        } else {
          var container = createContainer(context, childNode);
          if (container.styles.isVisible()) {
            if (createsRealStackingContext(childNode, container, root2)) {
              container.flags |= 4;
            } else if (createsStackingContext(container.styles)) {
              container.flags |= 2;
            }
            if (LIST_OWNERS.indexOf(childNode.tagName) !== -1) {
              container.flags |= 8;
            }
            parent.elements.push(container);
            childNode.slot;
            if (childNode.shadowRoot) {
              parseNodeTree(context, childNode.shadowRoot, container, root2);
            } else if (!isTextareaElement(childNode) && !isSVGElement(childNode) && !isSelectElement(childNode)) {
              parseNodeTree(context, childNode, container, root2);
            }
          }
        }
      }
    }
  };
  var createContainer = function(context, element2) {
    if (isImageElement(element2)) {
      return new ImageElementContainer(context, element2);
    }
    if (isCanvasElement(element2)) {
      return new CanvasElementContainer(context, element2);
    }
    if (isSVGElement(element2)) {
      return new SVGElementContainer(context, element2);
    }
    if (isLIElement(element2)) {
      return new LIElementContainer(context, element2);
    }
    if (isOLElement(element2)) {
      return new OLElementContainer(context, element2);
    }
    if (isInputElement(element2)) {
      return new InputElementContainer(context, element2);
    }
    if (isSelectElement(element2)) {
      return new SelectElementContainer(context, element2);
    }
    if (isTextareaElement(element2)) {
      return new TextareaElementContainer(context, element2);
    }
    if (isIFrameElement(element2)) {
      return new IFrameElementContainer(context, element2);
    }
    return new ElementContainer(context, element2);
  };
  var parseTree = function(context, element2) {
    var container = createContainer(context, element2);
    container.flags |= 4;
    parseNodeTree(context, element2, container, container);
    return container;
  };
  var createsRealStackingContext = function(node2, container, root2) {
    return container.styles.isPositionedWithZIndex() || container.styles.opacity < 1 || container.styles.isTransformed() || isBodyElement(node2) && root2.styles.isTransparent();
  };
  var createsStackingContext = function(styles) {
    return styles.isPositioned() || styles.isFloating();
  };
  var isTextNode = function(node2) {
    return node2.nodeType === Node.TEXT_NODE;
  };
  var isElementNode = function(node2) {
    return node2.nodeType === Node.ELEMENT_NODE;
  };
  var isHTMLElementNode = function(node2) {
    return isElementNode(node2) && typeof node2.style !== "undefined" && !isSVGElementNode(node2);
  };
  var isSVGElementNode = function(element2) {
    return typeof element2.className === "object";
  };
  var isLIElement = function(node2) {
    return node2.tagName === "LI";
  };
  var isOLElement = function(node2) {
    return node2.tagName === "OL";
  };
  var isInputElement = function(node2) {
    return node2.tagName === "INPUT";
  };
  var isHTMLElement = function(node2) {
    return node2.tagName === "HTML";
  };
  var isSVGElement = function(node2) {
    return node2.tagName === "svg";
  };
  var isBodyElement = function(node2) {
    return node2.tagName === "BODY";
  };
  var isCanvasElement = function(node2) {
    return node2.tagName === "CANVAS";
  };
  var isVideoElement = function(node2) {
    return node2.tagName === "VIDEO";
  };
  var isImageElement = function(node2) {
    return node2.tagName === "IMG";
  };
  var isIFrameElement = function(node2) {
    return node2.tagName === "IFRAME";
  };
  var isStyleElement = function(node2) {
    return node2.tagName === "STYLE";
  };
  var isScriptElement = function(node2) {
    return node2.tagName === "SCRIPT";
  };
  var isTextareaElement = function(node2) {
    return node2.tagName === "TEXTAREA";
  };
  var isSelectElement = function(node2) {
    return node2.tagName === "SELECT";
  };
  var isSlotElement = function(node2) {
    return node2.tagName === "SLOT";
  };
  var isCustomElement = function(node2) {
    return node2.tagName.indexOf("-") > 0;
  };
  var CounterState = (
    /** @class */
    function() {
      function CounterState2() {
        this.counters = {};
      }
      CounterState2.prototype.getCounterValue = function(name) {
        var counter = this.counters[name];
        if (counter && counter.length) {
          return counter[counter.length - 1];
        }
        return 1;
      };
      CounterState2.prototype.getCounterValues = function(name) {
        var counter = this.counters[name];
        return counter ? counter : [];
      };
      CounterState2.prototype.pop = function(counters) {
        var _this = this;
        counters.forEach(function(counter) {
          return _this.counters[counter].pop();
        });
      };
      CounterState2.prototype.parse = function(style2) {
        var _this = this;
        var counterIncrement2 = style2.counterIncrement;
        var counterReset2 = style2.counterReset;
        var canReset = true;
        if (counterIncrement2 !== null) {
          counterIncrement2.forEach(function(entry) {
            var counter = _this.counters[entry.counter];
            if (counter && entry.increment !== 0) {
              canReset = false;
              if (!counter.length) {
                counter.push(1);
              }
              counter[Math.max(0, counter.length - 1)] += entry.increment;
            }
          });
        }
        var counterNames = [];
        if (canReset) {
          counterReset2.forEach(function(entry) {
            var counter = _this.counters[entry.counter];
            counterNames.push(entry.counter);
            if (!counter) {
              counter = _this.counters[entry.counter] = [];
            }
            counter.push(entry.reset);
          });
        }
        return counterNames;
      };
      return CounterState2;
    }()
  );
  var ROMAN_UPPER = {
    integers: [1e3, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1],
    values: ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"]
  };
  var ARMENIAN = {
    integers: [
      9e3,
      8e3,
      7e3,
      6e3,
      5e3,
      4e3,
      3e3,
      2e3,
      1e3,
      900,
      800,
      700,
      600,
      500,
      400,
      300,
      200,
      100,
      90,
      80,
      70,
      60,
      50,
      40,
      30,
      20,
      10,
      9,
      8,
      7,
      6,
      5,
      4,
      3,
      2,
      1
    ],
    values: [
      "Ք",
      "Փ",
      "Ւ",
      "Ց",
      "Ր",
      "Տ",
      "Վ",
      "Ս",
      "Ռ",
      "Ջ",
      "Պ",
      "Չ",
      "Ո",
      "Շ",
      "Ն",
      "Յ",
      "Մ",
      "Ճ",
      "Ղ",
      "Ձ",
      "Հ",
      "Կ",
      "Ծ",
      "Խ",
      "Լ",
      "Ի",
      "Ժ",
      "Թ",
      "Ը",
      "Է",
      "Զ",
      "Ե",
      "Դ",
      "Գ",
      "Բ",
      "Ա"
    ]
  };
  var HEBREW = {
    integers: [
      1e4,
      9e3,
      8e3,
      7e3,
      6e3,
      5e3,
      4e3,
      3e3,
      2e3,
      1e3,
      400,
      300,
      200,
      100,
      90,
      80,
      70,
      60,
      50,
      40,
      30,
      20,
      19,
      18,
      17,
      16,
      15,
      10,
      9,
      8,
      7,
      6,
      5,
      4,
      3,
      2,
      1
    ],
    values: [
      "י׳",
      "ט׳",
      "ח׳",
      "ז׳",
      "ו׳",
      "ה׳",
      "ד׳",
      "ג׳",
      "ב׳",
      "א׳",
      "ת",
      "ש",
      "ר",
      "ק",
      "צ",
      "פ",
      "ע",
      "ס",
      "נ",
      "מ",
      "ל",
      "כ",
      "יט",
      "יח",
      "יז",
      "טז",
      "טו",
      "י",
      "ט",
      "ח",
      "ז",
      "ו",
      "ה",
      "ד",
      "ג",
      "ב",
      "א"
    ]
  };
  var GEORGIAN = {
    integers: [
      1e4,
      9e3,
      8e3,
      7e3,
      6e3,
      5e3,
      4e3,
      3e3,
      2e3,
      1e3,
      900,
      800,
      700,
      600,
      500,
      400,
      300,
      200,
      100,
      90,
      80,
      70,
      60,
      50,
      40,
      30,
      20,
      10,
      9,
      8,
      7,
      6,
      5,
      4,
      3,
      2,
      1
    ],
    values: [
      "ჵ",
      "ჰ",
      "ჯ",
      "ჴ",
      "ხ",
      "ჭ",
      "წ",
      "ძ",
      "ც",
      "ჩ",
      "შ",
      "ყ",
      "ღ",
      "ქ",
      "ფ",
      "ჳ",
      "ტ",
      "ს",
      "რ",
      "ჟ",
      "პ",
      "ო",
      "ჲ",
      "ნ",
      "მ",
      "ლ",
      "კ",
      "ი",
      "თ",
      "ჱ",
      "ზ",
      "ვ",
      "ე",
      "დ",
      "გ",
      "ბ",
      "ა"
    ]
  };
  var createAdditiveCounter = function(value2, min, max, symbols, fallback, suffix) {
    if (value2 < min || value2 > max) {
      return createCounterText(value2, fallback, suffix.length > 0);
    }
    return symbols.integers.reduce(function(string2, integer, index2) {
      while (value2 >= integer) {
        value2 -= integer;
        string2 += symbols.values[index2];
      }
      return string2;
    }, "") + suffix;
  };
  var createCounterStyleWithSymbolResolver = function(value2, codePointRangeLength, isNumeric, resolver2) {
    var string2 = "";
    do {
      if (!isNumeric) {
        value2--;
      }
      string2 = resolver2(value2) + string2;
      value2 /= codePointRangeLength;
    } while (value2 * codePointRangeLength >= codePointRangeLength);
    return string2;
  };
  var createCounterStyleFromRange = function(value2, codePointRangeStart, codePointRangeEnd, isNumeric, suffix) {
    var codePointRangeLength = codePointRangeEnd - codePointRangeStart + 1;
    return (value2 < 0 ? "-" : "") + (createCounterStyleWithSymbolResolver(Math.abs(value2), codePointRangeLength, isNumeric, function(codePoint) {
      return fromCodePoint$1(Math.floor(codePoint % codePointRangeLength) + codePointRangeStart);
    }) + suffix);
  };
  var createCounterStyleFromSymbols = function(value2, symbols, suffix) {
    if (suffix === void 0) {
      suffix = ". ";
    }
    var codePointRangeLength = symbols.length;
    return createCounterStyleWithSymbolResolver(Math.abs(value2), codePointRangeLength, false, function(codePoint) {
      return symbols[Math.floor(codePoint % codePointRangeLength)];
    }) + suffix;
  };
  var CJK_ZEROS = 1 << 0;
  var CJK_TEN_COEFFICIENTS = 1 << 1;
  var CJK_TEN_HIGH_COEFFICIENTS = 1 << 2;
  var CJK_HUNDRED_COEFFICIENTS = 1 << 3;
  var createCJKCounter = function(value2, numbers, multipliers, negativeSign, suffix, flags) {
    if (value2 < -9999 || value2 > 9999) {
      return createCounterText(value2, 4, suffix.length > 0);
    }
    var tmp = Math.abs(value2);
    var string2 = suffix;
    if (tmp === 0) {
      return numbers[0] + string2;
    }
    for (var digit = 0; tmp > 0 && digit <= 4; digit++) {
      var coefficient = tmp % 10;
      if (coefficient === 0 && contains(flags, CJK_ZEROS) && string2 !== "") {
        string2 = numbers[coefficient] + string2;
      } else if (coefficient > 1 || coefficient === 1 && digit === 0 || coefficient === 1 && digit === 1 && contains(flags, CJK_TEN_COEFFICIENTS) || coefficient === 1 && digit === 1 && contains(flags, CJK_TEN_HIGH_COEFFICIENTS) && value2 > 100 || coefficient === 1 && digit > 1 && contains(flags, CJK_HUNDRED_COEFFICIENTS)) {
        string2 = numbers[coefficient] + (digit > 0 ? multipliers[digit - 1] : "") + string2;
      } else if (coefficient === 1 && digit > 0) {
        string2 = multipliers[digit - 1] + string2;
      }
      tmp = Math.floor(tmp / 10);
    }
    return (value2 < 0 ? negativeSign : "") + string2;
  };
  var CHINESE_INFORMAL_MULTIPLIERS = "十百千萬";
  var CHINESE_FORMAL_MULTIPLIERS = "拾佰仟萬";
  var JAPANESE_NEGATIVE = "マイナス";
  var KOREAN_NEGATIVE = "마이너스";
  var createCounterText = function(value2, type, appendSuffix) {
    var defaultSuffix = appendSuffix ? ". " : "";
    var cjkSuffix = appendSuffix ? "、" : "";
    var koreanSuffix = appendSuffix ? ", " : "";
    var spaceSuffix = appendSuffix ? " " : "";
    switch (type) {
      case 0:
        return "•" + spaceSuffix;
      case 1:
        return "◦" + spaceSuffix;
      case 2:
        return "◾" + spaceSuffix;
      case 5:
        var string2 = createCounterStyleFromRange(value2, 48, 57, true, defaultSuffix);
        return string2.length < 4 ? "0" + string2 : string2;
      case 4:
        return createCounterStyleFromSymbols(value2, "〇一二三四五六七八九", cjkSuffix);
      case 6:
        return createAdditiveCounter(value2, 1, 3999, ROMAN_UPPER, 3, defaultSuffix).toLowerCase();
      case 7:
        return createAdditiveCounter(value2, 1, 3999, ROMAN_UPPER, 3, defaultSuffix);
      case 8:
        return createCounterStyleFromRange(value2, 945, 969, false, defaultSuffix);
      case 9:
        return createCounterStyleFromRange(value2, 97, 122, false, defaultSuffix);
      case 10:
        return createCounterStyleFromRange(value2, 65, 90, false, defaultSuffix);
      case 11:
        return createCounterStyleFromRange(value2, 1632, 1641, true, defaultSuffix);
      case 12:
      case 49:
        return createAdditiveCounter(value2, 1, 9999, ARMENIAN, 3, defaultSuffix);
      case 35:
        return createAdditiveCounter(value2, 1, 9999, ARMENIAN, 3, defaultSuffix).toLowerCase();
      case 13:
        return createCounterStyleFromRange(value2, 2534, 2543, true, defaultSuffix);
      case 14:
      case 30:
        return createCounterStyleFromRange(value2, 6112, 6121, true, defaultSuffix);
      case 15:
        return createCounterStyleFromSymbols(value2, "子丑寅卯辰巳午未申酉戌亥", cjkSuffix);
      case 16:
        return createCounterStyleFromSymbols(value2, "甲乙丙丁戊己庚辛壬癸", cjkSuffix);
      case 17:
      case 48:
        return createCJKCounter(value2, "零一二三四五六七八九", CHINESE_INFORMAL_MULTIPLIERS, "負", cjkSuffix, CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS | CJK_HUNDRED_COEFFICIENTS);
      case 47:
        return createCJKCounter(value2, "零壹貳參肆伍陸柒捌玖", CHINESE_FORMAL_MULTIPLIERS, "負", cjkSuffix, CJK_ZEROS | CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS | CJK_HUNDRED_COEFFICIENTS);
      case 42:
        return createCJKCounter(value2, "零一二三四五六七八九", CHINESE_INFORMAL_MULTIPLIERS, "负", cjkSuffix, CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS | CJK_HUNDRED_COEFFICIENTS);
      case 41:
        return createCJKCounter(value2, "零壹贰叁肆伍陆柒捌玖", CHINESE_FORMAL_MULTIPLIERS, "负", cjkSuffix, CJK_ZEROS | CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS | CJK_HUNDRED_COEFFICIENTS);
      case 26:
        return createCJKCounter(value2, "〇一二三四五六七八九", "十百千万", JAPANESE_NEGATIVE, cjkSuffix, 0);
      case 25:
        return createCJKCounter(value2, "零壱弐参四伍六七八九", "拾百千万", JAPANESE_NEGATIVE, cjkSuffix, CJK_ZEROS | CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS);
      case 31:
        return createCJKCounter(value2, "영일이삼사오육칠팔구", "십백천만", KOREAN_NEGATIVE, koreanSuffix, CJK_ZEROS | CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS);
      case 33:
        return createCJKCounter(value2, "零一二三四五六七八九", "十百千萬", KOREAN_NEGATIVE, koreanSuffix, 0);
      case 32:
        return createCJKCounter(value2, "零壹貳參四五六七八九", "拾百千", KOREAN_NEGATIVE, koreanSuffix, CJK_ZEROS | CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS);
      case 18:
        return createCounterStyleFromRange(value2, 2406, 2415, true, defaultSuffix);
      case 20:
        return createAdditiveCounter(value2, 1, 19999, GEORGIAN, 3, defaultSuffix);
      case 21:
        return createCounterStyleFromRange(value2, 2790, 2799, true, defaultSuffix);
      case 22:
        return createCounterStyleFromRange(value2, 2662, 2671, true, defaultSuffix);
      case 22:
        return createAdditiveCounter(value2, 1, 10999, HEBREW, 3, defaultSuffix);
      case 23:
        return createCounterStyleFromSymbols(value2, "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわゐゑをん");
      case 24:
        return createCounterStyleFromSymbols(value2, "いろはにほへとちりぬるをわかよたれそつねならむうゐのおくやまけふこえてあさきゆめみしゑひもせす");
      case 27:
        return createCounterStyleFromRange(value2, 3302, 3311, true, defaultSuffix);
      case 28:
        return createCounterStyleFromSymbols(value2, "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲン", cjkSuffix);
      case 29:
        return createCounterStyleFromSymbols(value2, "イロハニホヘトチリヌルヲワカヨタレソツネナラムウヰノオクヤマケフコエテアサキユメミシヱヒモセス", cjkSuffix);
      case 34:
        return createCounterStyleFromRange(value2, 3792, 3801, true, defaultSuffix);
      case 37:
        return createCounterStyleFromRange(value2, 6160, 6169, true, defaultSuffix);
      case 38:
        return createCounterStyleFromRange(value2, 4160, 4169, true, defaultSuffix);
      case 39:
        return createCounterStyleFromRange(value2, 2918, 2927, true, defaultSuffix);
      case 40:
        return createCounterStyleFromRange(value2, 1776, 1785, true, defaultSuffix);
      case 43:
        return createCounterStyleFromRange(value2, 3046, 3055, true, defaultSuffix);
      case 44:
        return createCounterStyleFromRange(value2, 3174, 3183, true, defaultSuffix);
      case 45:
        return createCounterStyleFromRange(value2, 3664, 3673, true, defaultSuffix);
      case 46:
        return createCounterStyleFromRange(value2, 3872, 3881, true, defaultSuffix);
      case 3:
      default:
        return createCounterStyleFromRange(value2, 48, 57, true, defaultSuffix);
    }
  };
  var IGNORE_ATTRIBUTE = "data-html2canvas-ignore";
  var DocumentCloner = (
    /** @class */
    function() {
      function DocumentCloner2(context, element2, options2) {
        this.context = context;
        this.options = options2;
        this.scrolledElements = [];
        this.referenceElement = element2;
        this.counters = new CounterState();
        this.quoteDepth = 0;
        if (!element2.ownerDocument) {
          throw new Error("Cloned element does not have an owner document");
        }
        this.documentElement = this.cloneNode(element2.ownerDocument.documentElement, false);
      }
      DocumentCloner2.prototype.toIFrame = function(ownerDocument, windowSize) {
        var _this = this;
        var iframe = createIFrameContainer(ownerDocument, windowSize);
        if (!iframe.contentWindow) {
          return Promise.reject("Unable to find iframe window");
        }
        var scrollX = ownerDocument.defaultView.pageXOffset;
        var scrollY = ownerDocument.defaultView.pageYOffset;
        var cloneWindow = iframe.contentWindow;
        var documentClone = cloneWindow.document;
        var iframeLoad = iframeLoader(iframe).then(function() {
          return __awaiter(_this, void 0, void 0, function() {
            var onclone, referenceElement;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  this.scrolledElements.forEach(restoreNodeScroll);
                  if (cloneWindow) {
                    cloneWindow.scrollTo(windowSize.left, windowSize.top);
                    if (/(iPad|iPhone|iPod)/g.test(navigator.userAgent) && (cloneWindow.scrollY !== windowSize.top || cloneWindow.scrollX !== windowSize.left)) {
                      this.context.logger.warn("Unable to restore scroll position for cloned document");
                      this.context.windowBounds = this.context.windowBounds.add(cloneWindow.scrollX - windowSize.left, cloneWindow.scrollY - windowSize.top, 0, 0);
                    }
                  }
                  onclone = this.options.onclone;
                  referenceElement = this.clonedReferenceElement;
                  if (typeof referenceElement === "undefined") {
                    return [2, Promise.reject("Error finding the " + this.referenceElement.nodeName + " in the cloned document")];
                  }
                  if (!(documentClone.fonts && documentClone.fonts.ready))
                    return [3, 2];
                  return [4, documentClone.fonts.ready];
                case 1:
                  _a.sent();
                  _a.label = 2;
                case 2:
                  if (!/(AppleWebKit)/g.test(navigator.userAgent))
                    return [3, 4];
                  return [4, imagesReady(documentClone)];
                case 3:
                  _a.sent();
                  _a.label = 4;
                case 4:
                  if (typeof onclone === "function") {
                    return [2, Promise.resolve().then(function() {
                      return onclone(documentClone, referenceElement);
                    }).then(function() {
                      return iframe;
                    })];
                  }
                  return [2, iframe];
              }
            });
          });
        });
        documentClone.open();
        documentClone.write(serializeDoctype(document.doctype) + "<html></html>");
        restoreOwnerScroll(this.referenceElement.ownerDocument, scrollX, scrollY);
        documentClone.replaceChild(documentClone.adoptNode(this.documentElement), documentClone.documentElement);
        documentClone.close();
        return iframeLoad;
      };
      DocumentCloner2.prototype.createElementClone = function(node2) {
        if (isDebugging(
          node2,
          2
          /* CLONE */
        )) {
          debugger;
        }
        if (isCanvasElement(node2)) {
          return this.createCanvasClone(node2);
        }
        if (isVideoElement(node2)) {
          return this.createVideoClone(node2);
        }
        if (isStyleElement(node2)) {
          return this.createStyleClone(node2);
        }
        var clone = node2.cloneNode(false);
        if (isImageElement(clone)) {
          if (isImageElement(node2) && node2.currentSrc && node2.currentSrc !== node2.src) {
            clone.src = node2.currentSrc;
            clone.srcset = "";
          }
          if (clone.loading === "lazy") {
            clone.loading = "eager";
          }
        }
        if (isCustomElement(clone)) {
          return this.createCustomElementClone(clone);
        }
        return clone;
      };
      DocumentCloner2.prototype.createCustomElementClone = function(node2) {
        var clone = document.createElement("html2canvascustomelement");
        copyCSSStyles(node2.style, clone);
        return clone;
      };
      DocumentCloner2.prototype.createStyleClone = function(node2) {
        try {
          var sheet = node2.sheet;
          if (sheet && sheet.cssRules) {
            var css = [].slice.call(sheet.cssRules, 0).reduce(function(css2, rule) {
              if (rule && typeof rule.cssText === "string") {
                return css2 + rule.cssText;
              }
              return css2;
            }, "");
            var style2 = node2.cloneNode(false);
            style2.textContent = css;
            return style2;
          }
        } catch (e2) {
          this.context.logger.error("Unable to access cssRules property", e2);
          if (e2.name !== "SecurityError") {
            throw e2;
          }
        }
        return node2.cloneNode(false);
      };
      DocumentCloner2.prototype.createCanvasClone = function(canvas) {
        var _a;
        if (this.options.inlineImages && canvas.ownerDocument) {
          var img = canvas.ownerDocument.createElement("img");
          try {
            img.src = canvas.toDataURL();
            return img;
          } catch (e2) {
            this.context.logger.info("Unable to inline canvas contents, canvas is tainted", canvas);
          }
        }
        var clonedCanvas = canvas.cloneNode(false);
        try {
          clonedCanvas.width = canvas.width;
          clonedCanvas.height = canvas.height;
          var ctx = canvas.getContext("2d");
          var clonedCtx = clonedCanvas.getContext("2d");
          if (clonedCtx) {
            if (!this.options.allowTaint && ctx) {
              clonedCtx.putImageData(ctx.getImageData(0, 0, canvas.width, canvas.height), 0, 0);
            } else {
              var gl = (_a = canvas.getContext("webgl2")) !== null && _a !== void 0 ? _a : canvas.getContext("webgl");
              if (gl) {
                var attribs = gl.getContextAttributes();
                if ((attribs === null || attribs === void 0 ? void 0 : attribs.preserveDrawingBuffer) === false) {
                  this.context.logger.warn("Unable to clone WebGL context as it has preserveDrawingBuffer=false", canvas);
                }
              }
              clonedCtx.drawImage(canvas, 0, 0);
            }
          }
          return clonedCanvas;
        } catch (e2) {
          this.context.logger.info("Unable to clone canvas as it is tainted", canvas);
        }
        return clonedCanvas;
      };
      DocumentCloner2.prototype.createVideoClone = function(video) {
        var canvas = video.ownerDocument.createElement("canvas");
        canvas.width = video.offsetWidth;
        canvas.height = video.offsetHeight;
        var ctx = canvas.getContext("2d");
        try {
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            if (!this.options.allowTaint) {
              ctx.getImageData(0, 0, canvas.width, canvas.height);
            }
          }
          return canvas;
        } catch (e2) {
          this.context.logger.info("Unable to clone video as it is tainted", video);
        }
        var blankCanvas = video.ownerDocument.createElement("canvas");
        blankCanvas.width = video.offsetWidth;
        blankCanvas.height = video.offsetHeight;
        return blankCanvas;
      };
      DocumentCloner2.prototype.appendChildNode = function(clone, child, copyStyles) {
        if (!isElementNode(child) || !isScriptElement(child) && !child.hasAttribute(IGNORE_ATTRIBUTE) && (typeof this.options.ignoreElements !== "function" || !this.options.ignoreElements(child))) {
          if (!this.options.copyStyles || !isElementNode(child) || !isStyleElement(child)) {
            clone.appendChild(this.cloneNode(child, copyStyles));
          }
        }
      };
      DocumentCloner2.prototype.cloneChildNodes = function(node2, clone, copyStyles) {
        var _this = this;
        for (var child = node2.shadowRoot ? node2.shadowRoot.firstChild : node2.firstChild; child; child = child.nextSibling) {
          if (isElementNode(child) && isSlotElement(child) && typeof child.assignedNodes === "function") {
            var assignedNodes = child.assignedNodes();
            if (assignedNodes.length) {
              assignedNodes.forEach(function(assignedNode) {
                return _this.appendChildNode(clone, assignedNode, copyStyles);
              });
            }
          } else {
            this.appendChildNode(clone, child, copyStyles);
          }
        }
      };
      DocumentCloner2.prototype.cloneNode = function(node2, copyStyles) {
        if (isTextNode(node2)) {
          return document.createTextNode(node2.data);
        }
        if (!node2.ownerDocument) {
          return node2.cloneNode(false);
        }
        var window2 = node2.ownerDocument.defaultView;
        if (window2 && isElementNode(node2) && (isHTMLElementNode(node2) || isSVGElementNode(node2))) {
          var clone = this.createElementClone(node2);
          clone.style.transitionProperty = "none";
          var style2 = window2.getComputedStyle(node2);
          var styleBefore = window2.getComputedStyle(node2, ":before");
          var styleAfter = window2.getComputedStyle(node2, ":after");
          if (this.referenceElement === node2 && isHTMLElementNode(clone)) {
            this.clonedReferenceElement = clone;
          }
          if (isBodyElement(clone)) {
            createPseudoHideStyles(clone);
          }
          var counters = this.counters.parse(new CSSParsedCounterDeclaration(this.context, style2));
          var before = this.resolvePseudoContent(node2, clone, styleBefore, PseudoElementType.BEFORE);
          if (isCustomElement(node2)) {
            copyStyles = true;
          }
          if (!isVideoElement(node2)) {
            this.cloneChildNodes(node2, clone, copyStyles);
          }
          if (before) {
            clone.insertBefore(before, clone.firstChild);
          }
          var after = this.resolvePseudoContent(node2, clone, styleAfter, PseudoElementType.AFTER);
          if (after) {
            clone.appendChild(after);
          }
          this.counters.pop(counters);
          if (style2 && (this.options.copyStyles || isSVGElementNode(node2)) && !isIFrameElement(node2) || copyStyles) {
            copyCSSStyles(style2, clone);
          }
          if (node2.scrollTop !== 0 || node2.scrollLeft !== 0) {
            this.scrolledElements.push([clone, node2.scrollLeft, node2.scrollTop]);
          }
          if ((isTextareaElement(node2) || isSelectElement(node2)) && (isTextareaElement(clone) || isSelectElement(clone))) {
            clone.value = node2.value;
          }
          return clone;
        }
        return node2.cloneNode(false);
      };
      DocumentCloner2.prototype.resolvePseudoContent = function(node2, clone, style2, pseudoElt) {
        var _this = this;
        if (!style2) {
          return;
        }
        var value2 = style2.content;
        var document2 = clone.ownerDocument;
        if (!document2 || !value2 || value2 === "none" || value2 === "-moz-alt-content" || style2.display === "none") {
          return;
        }
        this.counters.parse(new CSSParsedCounterDeclaration(this.context, style2));
        var declaration = new CSSParsedPseudoDeclaration(this.context, style2);
        var anonymousReplacedElement = document2.createElement("html2canvaspseudoelement");
        copyCSSStyles(style2, anonymousReplacedElement);
        declaration.content.forEach(function(token) {
          if (token.type === 0) {
            anonymousReplacedElement.appendChild(document2.createTextNode(token.value));
          } else if (token.type === 22) {
            var img = document2.createElement("img");
            img.src = token.value;
            img.style.opacity = "1";
            anonymousReplacedElement.appendChild(img);
          } else if (token.type === 18) {
            if (token.name === "attr") {
              var attr = token.values.filter(isIdentToken);
              if (attr.length) {
                anonymousReplacedElement.appendChild(document2.createTextNode(node2.getAttribute(attr[0].value) || ""));
              }
            } else if (token.name === "counter") {
              var _a = token.values.filter(nonFunctionArgSeparator), counter = _a[0], counterStyle = _a[1];
              if (counter && isIdentToken(counter)) {
                var counterState = _this.counters.getCounterValue(counter.value);
                var counterType = counterStyle && isIdentToken(counterStyle) ? listStyleType.parse(_this.context, counterStyle.value) : 3;
                anonymousReplacedElement.appendChild(document2.createTextNode(createCounterText(counterState, counterType, false)));
              }
            } else if (token.name === "counters") {
              var _b = token.values.filter(nonFunctionArgSeparator), counter = _b[0], delim = _b[1], counterStyle = _b[2];
              if (counter && isIdentToken(counter)) {
                var counterStates = _this.counters.getCounterValues(counter.value);
                var counterType_1 = counterStyle && isIdentToken(counterStyle) ? listStyleType.parse(_this.context, counterStyle.value) : 3;
                var separator = delim && delim.type === 0 ? delim.value : "";
                var text2 = counterStates.map(function(value3) {
                  return createCounterText(value3, counterType_1, false);
                }).join(separator);
                anonymousReplacedElement.appendChild(document2.createTextNode(text2));
              }
            } else
              ;
          } else if (token.type === 20) {
            switch (token.value) {
              case "open-quote":
                anonymousReplacedElement.appendChild(document2.createTextNode(getQuote(declaration.quotes, _this.quoteDepth++, true)));
                break;
              case "close-quote":
                anonymousReplacedElement.appendChild(document2.createTextNode(getQuote(declaration.quotes, --_this.quoteDepth, false)));
                break;
              default:
                anonymousReplacedElement.appendChild(document2.createTextNode(token.value));
            }
          }
        });
        anonymousReplacedElement.className = PSEUDO_HIDE_ELEMENT_CLASS_BEFORE + " " + PSEUDO_HIDE_ELEMENT_CLASS_AFTER;
        var newClassName = pseudoElt === PseudoElementType.BEFORE ? " " + PSEUDO_HIDE_ELEMENT_CLASS_BEFORE : " " + PSEUDO_HIDE_ELEMENT_CLASS_AFTER;
        if (isSVGElementNode(clone)) {
          clone.className.baseValue += newClassName;
        } else {
          clone.className += newClassName;
        }
        return anonymousReplacedElement;
      };
      DocumentCloner2.destroy = function(container) {
        if (container.parentNode) {
          container.parentNode.removeChild(container);
          return true;
        }
        return false;
      };
      return DocumentCloner2;
    }()
  );
  var PseudoElementType;
  (function(PseudoElementType2) {
    PseudoElementType2[PseudoElementType2["BEFORE"] = 0] = "BEFORE";
    PseudoElementType2[PseudoElementType2["AFTER"] = 1] = "AFTER";
  })(PseudoElementType || (PseudoElementType = {}));
  var createIFrameContainer = function(ownerDocument, bounds) {
    var cloneIframeContainer = ownerDocument.createElement("iframe");
    cloneIframeContainer.className = "html2canvas-container";
    cloneIframeContainer.style.visibility = "hidden";
    cloneIframeContainer.style.position = "fixed";
    cloneIframeContainer.style.left = "-10000px";
    cloneIframeContainer.style.top = "0px";
    cloneIframeContainer.style.border = "0";
    cloneIframeContainer.width = bounds.width.toString();
    cloneIframeContainer.height = bounds.height.toString();
    cloneIframeContainer.scrolling = "no";
    cloneIframeContainer.setAttribute(IGNORE_ATTRIBUTE, "true");
    ownerDocument.body.appendChild(cloneIframeContainer);
    return cloneIframeContainer;
  };
  var imageReady = function(img) {
    return new Promise(function(resolve) {
      if (img.complete) {
        resolve();
        return;
      }
      if (!img.src) {
        resolve();
        return;
      }
      img.onload = resolve;
      img.onerror = resolve;
    });
  };
  var imagesReady = function(document2) {
    return Promise.all([].slice.call(document2.images, 0).map(imageReady));
  };
  var iframeLoader = function(iframe) {
    return new Promise(function(resolve, reject) {
      var cloneWindow = iframe.contentWindow;
      if (!cloneWindow) {
        return reject("No window assigned for iframe");
      }
      var documentClone = cloneWindow.document;
      cloneWindow.onload = iframe.onload = function() {
        cloneWindow.onload = iframe.onload = null;
        var interval = setInterval(function() {
          if (documentClone.body.childNodes.length > 0 && documentClone.readyState === "complete") {
            clearInterval(interval);
            resolve(iframe);
          }
        }, 50);
      };
    });
  };
  var ignoredStyleProperties = [
    "all",
    "d",
    "content"
    // Safari shows pseudoelements if content is set
  ];
  var copyCSSStyles = function(style2, target) {
    for (var i2 = style2.length - 1; i2 >= 0; i2--) {
      var property = style2.item(i2);
      if (ignoredStyleProperties.indexOf(property) === -1) {
        target.style.setProperty(property, style2.getPropertyValue(property));
      }
    }
    return target;
  };
  var serializeDoctype = function(doctype2) {
    var str = "";
    if (doctype2) {
      str += "<!DOCTYPE ";
      if (doctype2.name) {
        str += doctype2.name;
      }
      if (doctype2.internalSubset) {
        str += doctype2.internalSubset;
      }
      if (doctype2.publicId) {
        str += '"' + doctype2.publicId + '"';
      }
      if (doctype2.systemId) {
        str += '"' + doctype2.systemId + '"';
      }
      str += ">";
    }
    return str;
  };
  var restoreOwnerScroll = function(ownerDocument, x2, y2) {
    if (ownerDocument && ownerDocument.defaultView && (x2 !== ownerDocument.defaultView.pageXOffset || y2 !== ownerDocument.defaultView.pageYOffset)) {
      ownerDocument.defaultView.scrollTo(x2, y2);
    }
  };
  var restoreNodeScroll = function(_a) {
    var element2 = _a[0], x2 = _a[1], y2 = _a[2];
    element2.scrollLeft = x2;
    element2.scrollTop = y2;
  };
  var PSEUDO_BEFORE = ":before";
  var PSEUDO_AFTER = ":after";
  var PSEUDO_HIDE_ELEMENT_CLASS_BEFORE = "___html2canvas___pseudoelement_before";
  var PSEUDO_HIDE_ELEMENT_CLASS_AFTER = "___html2canvas___pseudoelement_after";
  var PSEUDO_HIDE_ELEMENT_STYLE = '{\n    content: "" !important;\n    display: none !important;\n}';
  var createPseudoHideStyles = function(body2) {
    createStyles(body2, "." + PSEUDO_HIDE_ELEMENT_CLASS_BEFORE + PSEUDO_BEFORE + PSEUDO_HIDE_ELEMENT_STYLE + "\n         ." + PSEUDO_HIDE_ELEMENT_CLASS_AFTER + PSEUDO_AFTER + PSEUDO_HIDE_ELEMENT_STYLE);
  };
  var createStyles = function(body2, styles) {
    var document2 = body2.ownerDocument;
    if (document2) {
      var style2 = document2.createElement("style");
      style2.textContent = styles;
      body2.appendChild(style2);
    }
  };
  var CacheStorage = (
    /** @class */
    function() {
      function CacheStorage2() {
      }
      CacheStorage2.getOrigin = function(url) {
        var link2 = CacheStorage2._link;
        if (!link2) {
          return "about:blank";
        }
        link2.href = url;
        link2.href = link2.href;
        return link2.protocol + link2.hostname + link2.port;
      };
      CacheStorage2.isSameOrigin = function(src) {
        return CacheStorage2.getOrigin(src) === CacheStorage2._origin;
      };
      CacheStorage2.setContext = function(window2) {
        CacheStorage2._link = window2.document.createElement("a");
        CacheStorage2._origin = CacheStorage2.getOrigin(window2.location.href);
      };
      CacheStorage2._origin = "about:blank";
      return CacheStorage2;
    }()
  );
  var Cache = (
    /** @class */
    function() {
      function Cache2(context, _options) {
        this.context = context;
        this._options = _options;
        this._cache = {};
      }
      Cache2.prototype.addImage = function(src) {
        var result = Promise.resolve();
        if (this.has(src)) {
          return result;
        }
        if (isBlobImage(src) || isRenderable(src)) {
          (this._cache[src] = this.loadImage(src)).catch(function() {
          });
          return result;
        }
        return result;
      };
      Cache2.prototype.match = function(src) {
        return this._cache[src];
      };
      Cache2.prototype.loadImage = function(key2) {
        return __awaiter(this, void 0, void 0, function() {
          var isSameOrigin, useCORS, useProxy, src;
          var _this = this;
          return __generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                isSameOrigin = CacheStorage.isSameOrigin(key2);
                useCORS = !isInlineImage(key2) && this._options.useCORS === true && FEATURES.SUPPORT_CORS_IMAGES && !isSameOrigin;
                useProxy = !isInlineImage(key2) && !isSameOrigin && !isBlobImage(key2) && typeof this._options.proxy === "string" && FEATURES.SUPPORT_CORS_XHR && !useCORS;
                if (!isSameOrigin && this._options.allowTaint === false && !isInlineImage(key2) && !isBlobImage(key2) && !useProxy && !useCORS) {
                  return [
                    2
                    /*return*/
                  ];
                }
                src = key2;
                if (!useProxy)
                  return [3, 2];
                return [4, this.proxy(src)];
              case 1:
                src = _a.sent();
                _a.label = 2;
              case 2:
                this.context.logger.debug("Added image " + key2.substring(0, 256));
                return [4, new Promise(function(resolve, reject) {
                  var img = new Image();
                  img.onload = function() {
                    return resolve(img);
                  };
                  img.onerror = reject;
                  if (isInlineBase64Image(src) || useCORS) {
                    img.crossOrigin = "anonymous";
                  }
                  img.src = src;
                  if (img.complete === true) {
                    setTimeout(function() {
                      return resolve(img);
                    }, 500);
                  }
                  if (_this._options.imageTimeout > 0) {
                    setTimeout(function() {
                      return reject("Timed out (" + _this._options.imageTimeout + "ms) loading image");
                    }, _this._options.imageTimeout);
                  }
                })];
              case 3:
                return [2, _a.sent()];
            }
          });
        });
      };
      Cache2.prototype.has = function(key2) {
        return typeof this._cache[key2] !== "undefined";
      };
      Cache2.prototype.keys = function() {
        return Promise.resolve(Object.keys(this._cache));
      };
      Cache2.prototype.proxy = function(src) {
        var _this = this;
        var proxy = this._options.proxy;
        if (!proxy) {
          throw new Error("No proxy defined");
        }
        var key2 = src.substring(0, 256);
        return new Promise(function(resolve, reject) {
          var responseType = FEATURES.SUPPORT_RESPONSE_TYPE ? "blob" : "text";
          var xhr = new XMLHttpRequest();
          xhr.onload = function() {
            if (xhr.status === 200) {
              if (responseType === "text") {
                resolve(xhr.response);
              } else {
                var reader_1 = new FileReader();
                reader_1.addEventListener("load", function() {
                  return resolve(reader_1.result);
                }, false);
                reader_1.addEventListener("error", function(e2) {
                  return reject(e2);
                }, false);
                reader_1.readAsDataURL(xhr.response);
              }
            } else {
              reject("Failed to proxy resource " + key2 + " with status code " + xhr.status);
            }
          };
          xhr.onerror = reject;
          var queryString = proxy.indexOf("?") > -1 ? "&" : "?";
          xhr.open("GET", "" + proxy + queryString + "url=" + encodeURIComponent(src) + "&responseType=" + responseType);
          if (responseType !== "text" && xhr instanceof XMLHttpRequest) {
            xhr.responseType = responseType;
          }
          if (_this._options.imageTimeout) {
            var timeout_1 = _this._options.imageTimeout;
            xhr.timeout = timeout_1;
            xhr.ontimeout = function() {
              return reject("Timed out (" + timeout_1 + "ms) proxying " + key2);
            };
          }
          xhr.send();
        });
      };
      return Cache2;
    }()
  );
  var INLINE_SVG = /^data:image\/svg\+xml/i;
  var INLINE_BASE64 = /^data:image\/.*;base64,/i;
  var INLINE_IMG = /^data:image\/.*/i;
  var isRenderable = function(src) {
    return FEATURES.SUPPORT_SVG_DRAWING || !isSVG(src);
  };
  var isInlineImage = function(src) {
    return INLINE_IMG.test(src);
  };
  var isInlineBase64Image = function(src) {
    return INLINE_BASE64.test(src);
  };
  var isBlobImage = function(src) {
    return src.substr(0, 4) === "blob";
  };
  var isSVG = function(src) {
    return src.substr(-3).toLowerCase() === "svg" || INLINE_SVG.test(src);
  };
  var Vector = (
    /** @class */
    function() {
      function Vector2(x2, y2) {
        this.type = 0;
        this.x = x2;
        this.y = y2;
      }
      Vector2.prototype.add = function(deltaX, deltaY) {
        return new Vector2(this.x + deltaX, this.y + deltaY);
      };
      return Vector2;
    }()
  );
  var lerp = function(a2, b2, t2) {
    return new Vector(a2.x + (b2.x - a2.x) * t2, a2.y + (b2.y - a2.y) * t2);
  };
  var BezierCurve = (
    /** @class */
    function() {
      function BezierCurve2(start, startControl, endControl, end) {
        this.type = 1;
        this.start = start;
        this.startControl = startControl;
        this.endControl = endControl;
        this.end = end;
      }
      BezierCurve2.prototype.subdivide = function(t2, firstHalf) {
        var ab = lerp(this.start, this.startControl, t2);
        var bc = lerp(this.startControl, this.endControl, t2);
        var cd = lerp(this.endControl, this.end, t2);
        var abbc = lerp(ab, bc, t2);
        var bccd = lerp(bc, cd, t2);
        var dest = lerp(abbc, bccd, t2);
        return firstHalf ? new BezierCurve2(this.start, ab, abbc, dest) : new BezierCurve2(dest, bccd, cd, this.end);
      };
      BezierCurve2.prototype.add = function(deltaX, deltaY) {
        return new BezierCurve2(this.start.add(deltaX, deltaY), this.startControl.add(deltaX, deltaY), this.endControl.add(deltaX, deltaY), this.end.add(deltaX, deltaY));
      };
      BezierCurve2.prototype.reverse = function() {
        return new BezierCurve2(this.end, this.endControl, this.startControl, this.start);
      };
      return BezierCurve2;
    }()
  );
  var isBezierCurve = function(path2) {
    return path2.type === 1;
  };
  var BoundCurves = (
    /** @class */
    function() {
      function BoundCurves2(element2) {
        var styles = element2.styles;
        var bounds = element2.bounds;
        var _a = getAbsoluteValueForTuple(styles.borderTopLeftRadius, bounds.width, bounds.height), tlh = _a[0], tlv = _a[1];
        var _b = getAbsoluteValueForTuple(styles.borderTopRightRadius, bounds.width, bounds.height), trh = _b[0], trv = _b[1];
        var _c = getAbsoluteValueForTuple(styles.borderBottomRightRadius, bounds.width, bounds.height), brh = _c[0], brv = _c[1];
        var _d = getAbsoluteValueForTuple(styles.borderBottomLeftRadius, bounds.width, bounds.height), blh = _d[0], blv = _d[1];
        var factors = [];
        factors.push((tlh + trh) / bounds.width);
        factors.push((blh + brh) / bounds.width);
        factors.push((tlv + blv) / bounds.height);
        factors.push((trv + brv) / bounds.height);
        var maxFactor = Math.max.apply(Math, factors);
        if (maxFactor > 1) {
          tlh /= maxFactor;
          tlv /= maxFactor;
          trh /= maxFactor;
          trv /= maxFactor;
          brh /= maxFactor;
          brv /= maxFactor;
          blh /= maxFactor;
          blv /= maxFactor;
        }
        var topWidth = bounds.width - trh;
        var rightHeight = bounds.height - brv;
        var bottomWidth = bounds.width - brh;
        var leftHeight = bounds.height - blv;
        var borderTopWidth2 = styles.borderTopWidth;
        var borderRightWidth2 = styles.borderRightWidth;
        var borderBottomWidth2 = styles.borderBottomWidth;
        var borderLeftWidth2 = styles.borderLeftWidth;
        var paddingTop2 = getAbsoluteValue(styles.paddingTop, element2.bounds.width);
        var paddingRight2 = getAbsoluteValue(styles.paddingRight, element2.bounds.width);
        var paddingBottom2 = getAbsoluteValue(styles.paddingBottom, element2.bounds.width);
        var paddingLeft2 = getAbsoluteValue(styles.paddingLeft, element2.bounds.width);
        this.topLeftBorderDoubleOuterBox = tlh > 0 || tlv > 0 ? getCurvePoints(bounds.left + borderLeftWidth2 / 3, bounds.top + borderTopWidth2 / 3, tlh - borderLeftWidth2 / 3, tlv - borderTopWidth2 / 3, CORNER.TOP_LEFT) : new Vector(bounds.left + borderLeftWidth2 / 3, bounds.top + borderTopWidth2 / 3);
        this.topRightBorderDoubleOuterBox = tlh > 0 || tlv > 0 ? getCurvePoints(bounds.left + topWidth, bounds.top + borderTopWidth2 / 3, trh - borderRightWidth2 / 3, trv - borderTopWidth2 / 3, CORNER.TOP_RIGHT) : new Vector(bounds.left + bounds.width - borderRightWidth2 / 3, bounds.top + borderTopWidth2 / 3);
        this.bottomRightBorderDoubleOuterBox = brh > 0 || brv > 0 ? getCurvePoints(bounds.left + bottomWidth, bounds.top + rightHeight, brh - borderRightWidth2 / 3, brv - borderBottomWidth2 / 3, CORNER.BOTTOM_RIGHT) : new Vector(bounds.left + bounds.width - borderRightWidth2 / 3, bounds.top + bounds.height - borderBottomWidth2 / 3);
        this.bottomLeftBorderDoubleOuterBox = blh > 0 || blv > 0 ? getCurvePoints(bounds.left + borderLeftWidth2 / 3, bounds.top + leftHeight, blh - borderLeftWidth2 / 3, blv - borderBottomWidth2 / 3, CORNER.BOTTOM_LEFT) : new Vector(bounds.left + borderLeftWidth2 / 3, bounds.top + bounds.height - borderBottomWidth2 / 3);
        this.topLeftBorderDoubleInnerBox = tlh > 0 || tlv > 0 ? getCurvePoints(bounds.left + borderLeftWidth2 * 2 / 3, bounds.top + borderTopWidth2 * 2 / 3, tlh - borderLeftWidth2 * 2 / 3, tlv - borderTopWidth2 * 2 / 3, CORNER.TOP_LEFT) : new Vector(bounds.left + borderLeftWidth2 * 2 / 3, bounds.top + borderTopWidth2 * 2 / 3);
        this.topRightBorderDoubleInnerBox = tlh > 0 || tlv > 0 ? getCurvePoints(bounds.left + topWidth, bounds.top + borderTopWidth2 * 2 / 3, trh - borderRightWidth2 * 2 / 3, trv - borderTopWidth2 * 2 / 3, CORNER.TOP_RIGHT) : new Vector(bounds.left + bounds.width - borderRightWidth2 * 2 / 3, bounds.top + borderTopWidth2 * 2 / 3);
        this.bottomRightBorderDoubleInnerBox = brh > 0 || brv > 0 ? getCurvePoints(bounds.left + bottomWidth, bounds.top + rightHeight, brh - borderRightWidth2 * 2 / 3, brv - borderBottomWidth2 * 2 / 3, CORNER.BOTTOM_RIGHT) : new Vector(bounds.left + bounds.width - borderRightWidth2 * 2 / 3, bounds.top + bounds.height - borderBottomWidth2 * 2 / 3);
        this.bottomLeftBorderDoubleInnerBox = blh > 0 || blv > 0 ? getCurvePoints(bounds.left + borderLeftWidth2 * 2 / 3, bounds.top + leftHeight, blh - borderLeftWidth2 * 2 / 3, blv - borderBottomWidth2 * 2 / 3, CORNER.BOTTOM_LEFT) : new Vector(bounds.left + borderLeftWidth2 * 2 / 3, bounds.top + bounds.height - borderBottomWidth2 * 2 / 3);
        this.topLeftBorderStroke = tlh > 0 || tlv > 0 ? getCurvePoints(bounds.left + borderLeftWidth2 / 2, bounds.top + borderTopWidth2 / 2, tlh - borderLeftWidth2 / 2, tlv - borderTopWidth2 / 2, CORNER.TOP_LEFT) : new Vector(bounds.left + borderLeftWidth2 / 2, bounds.top + borderTopWidth2 / 2);
        this.topRightBorderStroke = tlh > 0 || tlv > 0 ? getCurvePoints(bounds.left + topWidth, bounds.top + borderTopWidth2 / 2, trh - borderRightWidth2 / 2, trv - borderTopWidth2 / 2, CORNER.TOP_RIGHT) : new Vector(bounds.left + bounds.width - borderRightWidth2 / 2, bounds.top + borderTopWidth2 / 2);
        this.bottomRightBorderStroke = brh > 0 || brv > 0 ? getCurvePoints(bounds.left + bottomWidth, bounds.top + rightHeight, brh - borderRightWidth2 / 2, brv - borderBottomWidth2 / 2, CORNER.BOTTOM_RIGHT) : new Vector(bounds.left + bounds.width - borderRightWidth2 / 2, bounds.top + bounds.height - borderBottomWidth2 / 2);
        this.bottomLeftBorderStroke = blh > 0 || blv > 0 ? getCurvePoints(bounds.left + borderLeftWidth2 / 2, bounds.top + leftHeight, blh - borderLeftWidth2 / 2, blv - borderBottomWidth2 / 2, CORNER.BOTTOM_LEFT) : new Vector(bounds.left + borderLeftWidth2 / 2, bounds.top + bounds.height - borderBottomWidth2 / 2);
        this.topLeftBorderBox = tlh > 0 || tlv > 0 ? getCurvePoints(bounds.left, bounds.top, tlh, tlv, CORNER.TOP_LEFT) : new Vector(bounds.left, bounds.top);
        this.topRightBorderBox = trh > 0 || trv > 0 ? getCurvePoints(bounds.left + topWidth, bounds.top, trh, trv, CORNER.TOP_RIGHT) : new Vector(bounds.left + bounds.width, bounds.top);
        this.bottomRightBorderBox = brh > 0 || brv > 0 ? getCurvePoints(bounds.left + bottomWidth, bounds.top + rightHeight, brh, brv, CORNER.BOTTOM_RIGHT) : new Vector(bounds.left + bounds.width, bounds.top + bounds.height);
        this.bottomLeftBorderBox = blh > 0 || blv > 0 ? getCurvePoints(bounds.left, bounds.top + leftHeight, blh, blv, CORNER.BOTTOM_LEFT) : new Vector(bounds.left, bounds.top + bounds.height);
        this.topLeftPaddingBox = tlh > 0 || tlv > 0 ? getCurvePoints(bounds.left + borderLeftWidth2, bounds.top + borderTopWidth2, Math.max(0, tlh - borderLeftWidth2), Math.max(0, tlv - borderTopWidth2), CORNER.TOP_LEFT) : new Vector(bounds.left + borderLeftWidth2, bounds.top + borderTopWidth2);
        this.topRightPaddingBox = trh > 0 || trv > 0 ? getCurvePoints(bounds.left + Math.min(topWidth, bounds.width - borderRightWidth2), bounds.top + borderTopWidth2, topWidth > bounds.width + borderRightWidth2 ? 0 : Math.max(0, trh - borderRightWidth2), Math.max(0, trv - borderTopWidth2), CORNER.TOP_RIGHT) : new Vector(bounds.left + bounds.width - borderRightWidth2, bounds.top + borderTopWidth2);
        this.bottomRightPaddingBox = brh > 0 || brv > 0 ? getCurvePoints(bounds.left + Math.min(bottomWidth, bounds.width - borderLeftWidth2), bounds.top + Math.min(rightHeight, bounds.height - borderBottomWidth2), Math.max(0, brh - borderRightWidth2), Math.max(0, brv - borderBottomWidth2), CORNER.BOTTOM_RIGHT) : new Vector(bounds.left + bounds.width - borderRightWidth2, bounds.top + bounds.height - borderBottomWidth2);
        this.bottomLeftPaddingBox = blh > 0 || blv > 0 ? getCurvePoints(bounds.left + borderLeftWidth2, bounds.top + Math.min(leftHeight, bounds.height - borderBottomWidth2), Math.max(0, blh - borderLeftWidth2), Math.max(0, blv - borderBottomWidth2), CORNER.BOTTOM_LEFT) : new Vector(bounds.left + borderLeftWidth2, bounds.top + bounds.height - borderBottomWidth2);
        this.topLeftContentBox = tlh > 0 || tlv > 0 ? getCurvePoints(bounds.left + borderLeftWidth2 + paddingLeft2, bounds.top + borderTopWidth2 + paddingTop2, Math.max(0, tlh - (borderLeftWidth2 + paddingLeft2)), Math.max(0, tlv - (borderTopWidth2 + paddingTop2)), CORNER.TOP_LEFT) : new Vector(bounds.left + borderLeftWidth2 + paddingLeft2, bounds.top + borderTopWidth2 + paddingTop2);
        this.topRightContentBox = trh > 0 || trv > 0 ? getCurvePoints(bounds.left + Math.min(topWidth, bounds.width + borderLeftWidth2 + paddingLeft2), bounds.top + borderTopWidth2 + paddingTop2, topWidth > bounds.width + borderLeftWidth2 + paddingLeft2 ? 0 : trh - borderLeftWidth2 + paddingLeft2, trv - (borderTopWidth2 + paddingTop2), CORNER.TOP_RIGHT) : new Vector(bounds.left + bounds.width - (borderRightWidth2 + paddingRight2), bounds.top + borderTopWidth2 + paddingTop2);
        this.bottomRightContentBox = brh > 0 || brv > 0 ? getCurvePoints(bounds.left + Math.min(bottomWidth, bounds.width - (borderLeftWidth2 + paddingLeft2)), bounds.top + Math.min(rightHeight, bounds.height + borderTopWidth2 + paddingTop2), Math.max(0, brh - (borderRightWidth2 + paddingRight2)), brv - (borderBottomWidth2 + paddingBottom2), CORNER.BOTTOM_RIGHT) : new Vector(bounds.left + bounds.width - (borderRightWidth2 + paddingRight2), bounds.top + bounds.height - (borderBottomWidth2 + paddingBottom2));
        this.bottomLeftContentBox = blh > 0 || blv > 0 ? getCurvePoints(bounds.left + borderLeftWidth2 + paddingLeft2, bounds.top + leftHeight, Math.max(0, blh - (borderLeftWidth2 + paddingLeft2)), blv - (borderBottomWidth2 + paddingBottom2), CORNER.BOTTOM_LEFT) : new Vector(bounds.left + borderLeftWidth2 + paddingLeft2, bounds.top + bounds.height - (borderBottomWidth2 + paddingBottom2));
      }
      return BoundCurves2;
    }()
  );
  var CORNER;
  (function(CORNER2) {
    CORNER2[CORNER2["TOP_LEFT"] = 0] = "TOP_LEFT";
    CORNER2[CORNER2["TOP_RIGHT"] = 1] = "TOP_RIGHT";
    CORNER2[CORNER2["BOTTOM_RIGHT"] = 2] = "BOTTOM_RIGHT";
    CORNER2[CORNER2["BOTTOM_LEFT"] = 3] = "BOTTOM_LEFT";
  })(CORNER || (CORNER = {}));
  var getCurvePoints = function(x2, y2, r1, r2, position2) {
    var kappa = 4 * ((Math.sqrt(2) - 1) / 3);
    var ox = r1 * kappa;
    var oy = r2 * kappa;
    var xm = x2 + r1;
    var ym = y2 + r2;
    switch (position2) {
      case CORNER.TOP_LEFT:
        return new BezierCurve(new Vector(x2, ym), new Vector(x2, ym - oy), new Vector(xm - ox, y2), new Vector(xm, y2));
      case CORNER.TOP_RIGHT:
        return new BezierCurve(new Vector(x2, y2), new Vector(x2 + ox, y2), new Vector(xm, ym - oy), new Vector(xm, ym));
      case CORNER.BOTTOM_RIGHT:
        return new BezierCurve(new Vector(xm, y2), new Vector(xm, y2 + oy), new Vector(x2 + ox, ym), new Vector(x2, ym));
      case CORNER.BOTTOM_LEFT:
      default:
        return new BezierCurve(new Vector(xm, ym), new Vector(xm - ox, ym), new Vector(x2, y2 + oy), new Vector(x2, y2));
    }
  };
  var calculateBorderBoxPath = function(curves) {
    return [curves.topLeftBorderBox, curves.topRightBorderBox, curves.bottomRightBorderBox, curves.bottomLeftBorderBox];
  };
  var calculateContentBoxPath = function(curves) {
    return [
      curves.topLeftContentBox,
      curves.topRightContentBox,
      curves.bottomRightContentBox,
      curves.bottomLeftContentBox
    ];
  };
  var calculatePaddingBoxPath = function(curves) {
    return [
      curves.topLeftPaddingBox,
      curves.topRightPaddingBox,
      curves.bottomRightPaddingBox,
      curves.bottomLeftPaddingBox
    ];
  };
  var TransformEffect = (
    /** @class */
    function() {
      function TransformEffect2(offsetX, offsetY, matrix2) {
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.matrix = matrix2;
        this.type = 0;
        this.target = 2 | 4;
      }
      return TransformEffect2;
    }()
  );
  var ClipEffect = (
    /** @class */
    function() {
      function ClipEffect2(path2, target) {
        this.path = path2;
        this.target = target;
        this.type = 1;
      }
      return ClipEffect2;
    }()
  );
  var OpacityEffect = (
    /** @class */
    function() {
      function OpacityEffect2(opacity2) {
        this.opacity = opacity2;
        this.type = 2;
        this.target = 2 | 4;
      }
      return OpacityEffect2;
    }()
  );
  var isTransformEffect = function(effect) {
    return effect.type === 0;
  };
  var isClipEffect = function(effect) {
    return effect.type === 1;
  };
  var isOpacityEffect = function(effect) {
    return effect.type === 2;
  };
  var equalPath = function(a2, b2) {
    if (a2.length === b2.length) {
      return a2.some(function(v2, i2) {
        return v2 === b2[i2];
      });
    }
    return false;
  };
  var transformPath = function(path2, deltaX, deltaY, deltaW, deltaH) {
    return path2.map(function(point2, index2) {
      switch (index2) {
        case 0:
          return point2.add(deltaX, deltaY);
        case 1:
          return point2.add(deltaX + deltaW, deltaY);
        case 2:
          return point2.add(deltaX + deltaW, deltaY + deltaH);
        case 3:
          return point2.add(deltaX, deltaY + deltaH);
      }
      return point2;
    });
  };
  var StackingContext = (
    /** @class */
    function() {
      function StackingContext2(container) {
        this.element = container;
        this.inlineLevel = [];
        this.nonInlineLevel = [];
        this.negativeZIndex = [];
        this.zeroOrAutoZIndexOrTransformedOrOpacity = [];
        this.positiveZIndex = [];
        this.nonPositionedFloats = [];
        this.nonPositionedInlineLevel = [];
      }
      return StackingContext2;
    }()
  );
  var ElementPaint = (
    /** @class */
    function() {
      function ElementPaint2(container, parent) {
        this.container = container;
        this.parent = parent;
        this.effects = [];
        this.curves = new BoundCurves(this.container);
        if (this.container.styles.opacity < 1) {
          this.effects.push(new OpacityEffect(this.container.styles.opacity));
        }
        if (this.container.styles.transform !== null) {
          var offsetX = this.container.bounds.left + this.container.styles.transformOrigin[0].number;
          var offsetY = this.container.bounds.top + this.container.styles.transformOrigin[1].number;
          var matrix2 = this.container.styles.transform;
          this.effects.push(new TransformEffect(offsetX, offsetY, matrix2));
        }
        if (this.container.styles.overflowX !== 0) {
          var borderBox = calculateBorderBoxPath(this.curves);
          var paddingBox2 = calculatePaddingBoxPath(this.curves);
          if (equalPath(borderBox, paddingBox2)) {
            this.effects.push(new ClipEffect(
              borderBox,
              2 | 4
              /* CONTENT */
            ));
          } else {
            this.effects.push(new ClipEffect(
              borderBox,
              2
              /* BACKGROUND_BORDERS */
            ));
            this.effects.push(new ClipEffect(
              paddingBox2,
              4
              /* CONTENT */
            ));
          }
        }
      }
      ElementPaint2.prototype.getEffects = function(target) {
        var inFlow = [
          2,
          3
          /* FIXED */
        ].indexOf(this.container.styles.position) === -1;
        var parent = this.parent;
        var effects = this.effects.slice(0);
        while (parent) {
          var croplessEffects = parent.effects.filter(function(effect) {
            return !isClipEffect(effect);
          });
          if (inFlow || parent.container.styles.position !== 0 || !parent.parent) {
            effects.unshift.apply(effects, croplessEffects);
            inFlow = [
              2,
              3
              /* FIXED */
            ].indexOf(parent.container.styles.position) === -1;
            if (parent.container.styles.overflowX !== 0) {
              var borderBox = calculateBorderBoxPath(parent.curves);
              var paddingBox2 = calculatePaddingBoxPath(parent.curves);
              if (!equalPath(borderBox, paddingBox2)) {
                effects.unshift(new ClipEffect(
                  paddingBox2,
                  2 | 4
                  /* CONTENT */
                ));
              }
            }
          } else {
            effects.unshift.apply(effects, croplessEffects);
          }
          parent = parent.parent;
        }
        return effects.filter(function(effect) {
          return contains(effect.target, target);
        });
      };
      return ElementPaint2;
    }()
  );
  var parseStackTree = function(parent, stackingContext, realStackingContext, listItems) {
    parent.container.elements.forEach(function(child) {
      var treatAsRealStackingContext = contains(
        child.flags,
        4
        /* CREATES_REAL_STACKING_CONTEXT */
      );
      var createsStackingContext2 = contains(
        child.flags,
        2
        /* CREATES_STACKING_CONTEXT */
      );
      var paintContainer = new ElementPaint(child, parent);
      if (contains(
        child.styles.display,
        2048
        /* LIST_ITEM */
      )) {
        listItems.push(paintContainer);
      }
      var listOwnerItems = contains(
        child.flags,
        8
        /* IS_LIST_OWNER */
      ) ? [] : listItems;
      if (treatAsRealStackingContext || createsStackingContext2) {
        var parentStack = treatAsRealStackingContext || child.styles.isPositioned() ? realStackingContext : stackingContext;
        var stack = new StackingContext(paintContainer);
        if (child.styles.isPositioned() || child.styles.opacity < 1 || child.styles.isTransformed()) {
          var order_1 = child.styles.zIndex.order;
          if (order_1 < 0) {
            var index_1 = 0;
            parentStack.negativeZIndex.some(function(current, i2) {
              if (order_1 > current.element.container.styles.zIndex.order) {
                index_1 = i2;
                return false;
              } else if (index_1 > 0) {
                return true;
              }
              return false;
            });
            parentStack.negativeZIndex.splice(index_1, 0, stack);
          } else if (order_1 > 0) {
            var index_2 = 0;
            parentStack.positiveZIndex.some(function(current, i2) {
              if (order_1 >= current.element.container.styles.zIndex.order) {
                index_2 = i2 + 1;
                return false;
              } else if (index_2 > 0) {
                return true;
              }
              return false;
            });
            parentStack.positiveZIndex.splice(index_2, 0, stack);
          } else {
            parentStack.zeroOrAutoZIndexOrTransformedOrOpacity.push(stack);
          }
        } else {
          if (child.styles.isFloating()) {
            parentStack.nonPositionedFloats.push(stack);
          } else {
            parentStack.nonPositionedInlineLevel.push(stack);
          }
        }
        parseStackTree(paintContainer, stack, treatAsRealStackingContext ? stack : realStackingContext, listOwnerItems);
      } else {
        if (child.styles.isInlineLevel()) {
          stackingContext.inlineLevel.push(paintContainer);
        } else {
          stackingContext.nonInlineLevel.push(paintContainer);
        }
        parseStackTree(paintContainer, stackingContext, realStackingContext, listOwnerItems);
      }
      if (contains(
        child.flags,
        8
        /* IS_LIST_OWNER */
      )) {
        processListItems(child, listOwnerItems);
      }
    });
  };
  var processListItems = function(owner, elements) {
    var numbering = owner instanceof OLElementContainer ? owner.start : 1;
    var reversed = owner instanceof OLElementContainer ? owner.reversed : false;
    for (var i2 = 0; i2 < elements.length; i2++) {
      var item = elements[i2];
      if (item.container instanceof LIElementContainer && typeof item.container.value === "number" && item.container.value !== 0) {
        numbering = item.container.value;
      }
      item.listValue = createCounterText(numbering, item.container.styles.listStyleType, true);
      numbering += reversed ? -1 : 1;
    }
  };
  var parseStackingContexts = function(container) {
    var paintContainer = new ElementPaint(container, null);
    var root2 = new StackingContext(paintContainer);
    var listItems = [];
    parseStackTree(paintContainer, root2, root2, listItems);
    processListItems(paintContainer.container, listItems);
    return root2;
  };
  var parsePathForBorder = function(curves, borderSide) {
    switch (borderSide) {
      case 0:
        return createPathFromCurves(curves.topLeftBorderBox, curves.topLeftPaddingBox, curves.topRightBorderBox, curves.topRightPaddingBox);
      case 1:
        return createPathFromCurves(curves.topRightBorderBox, curves.topRightPaddingBox, curves.bottomRightBorderBox, curves.bottomRightPaddingBox);
      case 2:
        return createPathFromCurves(curves.bottomRightBorderBox, curves.bottomRightPaddingBox, curves.bottomLeftBorderBox, curves.bottomLeftPaddingBox);
      case 3:
      default:
        return createPathFromCurves(curves.bottomLeftBorderBox, curves.bottomLeftPaddingBox, curves.topLeftBorderBox, curves.topLeftPaddingBox);
    }
  };
  var parsePathForBorderDoubleOuter = function(curves, borderSide) {
    switch (borderSide) {
      case 0:
        return createPathFromCurves(curves.topLeftBorderBox, curves.topLeftBorderDoubleOuterBox, curves.topRightBorderBox, curves.topRightBorderDoubleOuterBox);
      case 1:
        return createPathFromCurves(curves.topRightBorderBox, curves.topRightBorderDoubleOuterBox, curves.bottomRightBorderBox, curves.bottomRightBorderDoubleOuterBox);
      case 2:
        return createPathFromCurves(curves.bottomRightBorderBox, curves.bottomRightBorderDoubleOuterBox, curves.bottomLeftBorderBox, curves.bottomLeftBorderDoubleOuterBox);
      case 3:
      default:
        return createPathFromCurves(curves.bottomLeftBorderBox, curves.bottomLeftBorderDoubleOuterBox, curves.topLeftBorderBox, curves.topLeftBorderDoubleOuterBox);
    }
  };
  var parsePathForBorderDoubleInner = function(curves, borderSide) {
    switch (borderSide) {
      case 0:
        return createPathFromCurves(curves.topLeftBorderDoubleInnerBox, curves.topLeftPaddingBox, curves.topRightBorderDoubleInnerBox, curves.topRightPaddingBox);
      case 1:
        return createPathFromCurves(curves.topRightBorderDoubleInnerBox, curves.topRightPaddingBox, curves.bottomRightBorderDoubleInnerBox, curves.bottomRightPaddingBox);
      case 2:
        return createPathFromCurves(curves.bottomRightBorderDoubleInnerBox, curves.bottomRightPaddingBox, curves.bottomLeftBorderDoubleInnerBox, curves.bottomLeftPaddingBox);
      case 3:
      default:
        return createPathFromCurves(curves.bottomLeftBorderDoubleInnerBox, curves.bottomLeftPaddingBox, curves.topLeftBorderDoubleInnerBox, curves.topLeftPaddingBox);
    }
  };
  var parsePathForBorderStroke = function(curves, borderSide) {
    switch (borderSide) {
      case 0:
        return createStrokePathFromCurves(curves.topLeftBorderStroke, curves.topRightBorderStroke);
      case 1:
        return createStrokePathFromCurves(curves.topRightBorderStroke, curves.bottomRightBorderStroke);
      case 2:
        return createStrokePathFromCurves(curves.bottomRightBorderStroke, curves.bottomLeftBorderStroke);
      case 3:
      default:
        return createStrokePathFromCurves(curves.bottomLeftBorderStroke, curves.topLeftBorderStroke);
    }
  };
  var createStrokePathFromCurves = function(outer1, outer2) {
    var path2 = [];
    if (isBezierCurve(outer1)) {
      path2.push(outer1.subdivide(0.5, false));
    } else {
      path2.push(outer1);
    }
    if (isBezierCurve(outer2)) {
      path2.push(outer2.subdivide(0.5, true));
    } else {
      path2.push(outer2);
    }
    return path2;
  };
  var createPathFromCurves = function(outer1, inner1, outer2, inner2) {
    var path2 = [];
    if (isBezierCurve(outer1)) {
      path2.push(outer1.subdivide(0.5, false));
    } else {
      path2.push(outer1);
    }
    if (isBezierCurve(outer2)) {
      path2.push(outer2.subdivide(0.5, true));
    } else {
      path2.push(outer2);
    }
    if (isBezierCurve(inner2)) {
      path2.push(inner2.subdivide(0.5, true).reverse());
    } else {
      path2.push(inner2);
    }
    if (isBezierCurve(inner1)) {
      path2.push(inner1.subdivide(0.5, false).reverse());
    } else {
      path2.push(inner1);
    }
    return path2;
  };
  var paddingBox = function(element2) {
    var bounds = element2.bounds;
    var styles = element2.styles;
    return bounds.add(styles.borderLeftWidth, styles.borderTopWidth, -(styles.borderRightWidth + styles.borderLeftWidth), -(styles.borderTopWidth + styles.borderBottomWidth));
  };
  var contentBox = function(element2) {
    var styles = element2.styles;
    var bounds = element2.bounds;
    var paddingLeft2 = getAbsoluteValue(styles.paddingLeft, bounds.width);
    var paddingRight2 = getAbsoluteValue(styles.paddingRight, bounds.width);
    var paddingTop2 = getAbsoluteValue(styles.paddingTop, bounds.width);
    var paddingBottom2 = getAbsoluteValue(styles.paddingBottom, bounds.width);
    return bounds.add(paddingLeft2 + styles.borderLeftWidth, paddingTop2 + styles.borderTopWidth, -(styles.borderRightWidth + styles.borderLeftWidth + paddingLeft2 + paddingRight2), -(styles.borderTopWidth + styles.borderBottomWidth + paddingTop2 + paddingBottom2));
  };
  var calculateBackgroundPositioningArea = function(backgroundOrigin2, element2) {
    if (backgroundOrigin2 === 0) {
      return element2.bounds;
    }
    if (backgroundOrigin2 === 2) {
      return contentBox(element2);
    }
    return paddingBox(element2);
  };
  var calculateBackgroundPaintingArea = function(backgroundClip2, element2) {
    if (backgroundClip2 === 0) {
      return element2.bounds;
    }
    if (backgroundClip2 === 2) {
      return contentBox(element2);
    }
    return paddingBox(element2);
  };
  var calculateBackgroundRendering = function(container, index2, intrinsicSize) {
    var backgroundPositioningArea = calculateBackgroundPositioningArea(getBackgroundValueForIndex(container.styles.backgroundOrigin, index2), container);
    var backgroundPaintingArea = calculateBackgroundPaintingArea(getBackgroundValueForIndex(container.styles.backgroundClip, index2), container);
    var backgroundImageSize = calculateBackgroundSize(getBackgroundValueForIndex(container.styles.backgroundSize, index2), intrinsicSize, backgroundPositioningArea);
    var sizeWidth = backgroundImageSize[0], sizeHeight = backgroundImageSize[1];
    var position2 = getAbsoluteValueForTuple(getBackgroundValueForIndex(container.styles.backgroundPosition, index2), backgroundPositioningArea.width - sizeWidth, backgroundPositioningArea.height - sizeHeight);
    var path2 = calculateBackgroundRepeatPath(getBackgroundValueForIndex(container.styles.backgroundRepeat, index2), position2, backgroundImageSize, backgroundPositioningArea, backgroundPaintingArea);
    var offsetX = Math.round(backgroundPositioningArea.left + position2[0]);
    var offsetY = Math.round(backgroundPositioningArea.top + position2[1]);
    return [path2, offsetX, offsetY, sizeWidth, sizeHeight];
  };
  var isAuto = function(token) {
    return isIdentToken(token) && token.value === BACKGROUND_SIZE.AUTO;
  };
  var hasIntrinsicValue = function(value2) {
    return typeof value2 === "number";
  };
  var calculateBackgroundSize = function(size, _a, bounds) {
    var intrinsicWidth = _a[0], intrinsicHeight = _a[1], intrinsicProportion = _a[2];
    var first = size[0], second = size[1];
    if (!first) {
      return [0, 0];
    }
    if (isLengthPercentage(first) && second && isLengthPercentage(second)) {
      return [getAbsoluteValue(first, bounds.width), getAbsoluteValue(second, bounds.height)];
    }
    var hasIntrinsicProportion = hasIntrinsicValue(intrinsicProportion);
    if (isIdentToken(first) && (first.value === BACKGROUND_SIZE.CONTAIN || first.value === BACKGROUND_SIZE.COVER)) {
      if (hasIntrinsicValue(intrinsicProportion)) {
        var targetRatio = bounds.width / bounds.height;
        return targetRatio < intrinsicProportion !== (first.value === BACKGROUND_SIZE.COVER) ? [bounds.width, bounds.width / intrinsicProportion] : [bounds.height * intrinsicProportion, bounds.height];
      }
      return [bounds.width, bounds.height];
    }
    var hasIntrinsicWidth = hasIntrinsicValue(intrinsicWidth);
    var hasIntrinsicHeight = hasIntrinsicValue(intrinsicHeight);
    var hasIntrinsicDimensions = hasIntrinsicWidth || hasIntrinsicHeight;
    if (isAuto(first) && (!second || isAuto(second))) {
      if (hasIntrinsicWidth && hasIntrinsicHeight) {
        return [intrinsicWidth, intrinsicHeight];
      }
      if (!hasIntrinsicProportion && !hasIntrinsicDimensions) {
        return [bounds.width, bounds.height];
      }
      if (hasIntrinsicDimensions && hasIntrinsicProportion) {
        var width_1 = hasIntrinsicWidth ? intrinsicWidth : intrinsicHeight * intrinsicProportion;
        var height_1 = hasIntrinsicHeight ? intrinsicHeight : intrinsicWidth / intrinsicProportion;
        return [width_1, height_1];
      }
      var width_2 = hasIntrinsicWidth ? intrinsicWidth : bounds.width;
      var height_2 = hasIntrinsicHeight ? intrinsicHeight : bounds.height;
      return [width_2, height_2];
    }
    if (hasIntrinsicProportion) {
      var width_3 = 0;
      var height_3 = 0;
      if (isLengthPercentage(first)) {
        width_3 = getAbsoluteValue(first, bounds.width);
      } else if (isLengthPercentage(second)) {
        height_3 = getAbsoluteValue(second, bounds.height);
      }
      if (isAuto(first)) {
        width_3 = height_3 * intrinsicProportion;
      } else if (!second || isAuto(second)) {
        height_3 = width_3 / intrinsicProportion;
      }
      return [width_3, height_3];
    }
    var width = null;
    var height = null;
    if (isLengthPercentage(first)) {
      width = getAbsoluteValue(first, bounds.width);
    } else if (second && isLengthPercentage(second)) {
      height = getAbsoluteValue(second, bounds.height);
    }
    if (width !== null && (!second || isAuto(second))) {
      height = hasIntrinsicWidth && hasIntrinsicHeight ? width / intrinsicWidth * intrinsicHeight : bounds.height;
    }
    if (height !== null && isAuto(first)) {
      width = hasIntrinsicWidth && hasIntrinsicHeight ? height / intrinsicHeight * intrinsicWidth : bounds.width;
    }
    if (width !== null && height !== null) {
      return [width, height];
    }
    throw new Error("Unable to calculate background-size for element");
  };
  var getBackgroundValueForIndex = function(values, index2) {
    var value2 = values[index2];
    if (typeof value2 === "undefined") {
      return values[0];
    }
    return value2;
  };
  var calculateBackgroundRepeatPath = function(repeat, _a, _b, backgroundPositioningArea, backgroundPaintingArea) {
    var x2 = _a[0], y2 = _a[1];
    var width = _b[0], height = _b[1];
    switch (repeat) {
      case 2:
        return [
          new Vector(Math.round(backgroundPositioningArea.left), Math.round(backgroundPositioningArea.top + y2)),
          new Vector(Math.round(backgroundPositioningArea.left + backgroundPositioningArea.width), Math.round(backgroundPositioningArea.top + y2)),
          new Vector(Math.round(backgroundPositioningArea.left + backgroundPositioningArea.width), Math.round(height + backgroundPositioningArea.top + y2)),
          new Vector(Math.round(backgroundPositioningArea.left), Math.round(height + backgroundPositioningArea.top + y2))
        ];
      case 3:
        return [
          new Vector(Math.round(backgroundPositioningArea.left + x2), Math.round(backgroundPositioningArea.top)),
          new Vector(Math.round(backgroundPositioningArea.left + x2 + width), Math.round(backgroundPositioningArea.top)),
          new Vector(Math.round(backgroundPositioningArea.left + x2 + width), Math.round(backgroundPositioningArea.height + backgroundPositioningArea.top)),
          new Vector(Math.round(backgroundPositioningArea.left + x2), Math.round(backgroundPositioningArea.height + backgroundPositioningArea.top))
        ];
      case 1:
        return [
          new Vector(Math.round(backgroundPositioningArea.left + x2), Math.round(backgroundPositioningArea.top + y2)),
          new Vector(Math.round(backgroundPositioningArea.left + x2 + width), Math.round(backgroundPositioningArea.top + y2)),
          new Vector(Math.round(backgroundPositioningArea.left + x2 + width), Math.round(backgroundPositioningArea.top + y2 + height)),
          new Vector(Math.round(backgroundPositioningArea.left + x2), Math.round(backgroundPositioningArea.top + y2 + height))
        ];
      default:
        return [
          new Vector(Math.round(backgroundPaintingArea.left), Math.round(backgroundPaintingArea.top)),
          new Vector(Math.round(backgroundPaintingArea.left + backgroundPaintingArea.width), Math.round(backgroundPaintingArea.top)),
          new Vector(Math.round(backgroundPaintingArea.left + backgroundPaintingArea.width), Math.round(backgroundPaintingArea.height + backgroundPaintingArea.top)),
          new Vector(Math.round(backgroundPaintingArea.left), Math.round(backgroundPaintingArea.height + backgroundPaintingArea.top))
        ];
    }
  };
  var SMALL_IMAGE = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  var SAMPLE_TEXT = "Hidden Text";
  var FontMetrics = (
    /** @class */
    function() {
      function FontMetrics2(document2) {
        this._data = {};
        this._document = document2;
      }
      FontMetrics2.prototype.parseMetrics = function(fontFamily2, fontSize2) {
        var container = this._document.createElement("div");
        var img = this._document.createElement("img");
        var span = this._document.createElement("span");
        var body2 = this._document.body;
        container.style.visibility = "hidden";
        container.style.fontFamily = fontFamily2;
        container.style.fontSize = fontSize2;
        container.style.margin = "0";
        container.style.padding = "0";
        container.style.whiteSpace = "nowrap";
        body2.appendChild(container);
        img.src = SMALL_IMAGE;
        img.width = 1;
        img.height = 1;
        img.style.margin = "0";
        img.style.padding = "0";
        img.style.verticalAlign = "baseline";
        span.style.fontFamily = fontFamily2;
        span.style.fontSize = fontSize2;
        span.style.margin = "0";
        span.style.padding = "0";
        span.appendChild(this._document.createTextNode(SAMPLE_TEXT));
        container.appendChild(span);
        container.appendChild(img);
        var baseline = img.offsetTop - span.offsetTop + 2;
        container.removeChild(span);
        container.appendChild(this._document.createTextNode(SAMPLE_TEXT));
        container.style.lineHeight = "normal";
        img.style.verticalAlign = "super";
        var middle = img.offsetTop - container.offsetTop + 2;
        body2.removeChild(container);
        return { baseline, middle };
      };
      FontMetrics2.prototype.getMetrics = function(fontFamily2, fontSize2) {
        var key2 = fontFamily2 + " " + fontSize2;
        if (typeof this._data[key2] === "undefined") {
          this._data[key2] = this.parseMetrics(fontFamily2, fontSize2);
        }
        return this._data[key2];
      };
      return FontMetrics2;
    }()
  );
  var Renderer = (
    /** @class */
    function() {
      function Renderer2(context, options2) {
        this.context = context;
        this.options = options2;
      }
      return Renderer2;
    }()
  );
  var MASK_OFFSET = 1e4;
  var CanvasRenderer = (
    /** @class */
    function(_super) {
      __extends(CanvasRenderer2, _super);
      function CanvasRenderer2(context, options2) {
        var _this = _super.call(this, context, options2) || this;
        _this._activeEffects = [];
        _this.canvas = options2.canvas ? options2.canvas : document.createElement("canvas");
        _this.ctx = _this.canvas.getContext("2d");
        if (!options2.canvas) {
          _this.canvas.width = Math.floor(options2.width * options2.scale);
          _this.canvas.height = Math.floor(options2.height * options2.scale);
          _this.canvas.style.width = options2.width + "px";
          _this.canvas.style.height = options2.height + "px";
        }
        _this.fontMetrics = new FontMetrics(document);
        _this.ctx.scale(_this.options.scale, _this.options.scale);
        _this.ctx.translate(-options2.x, -options2.y);
        _this.ctx.textBaseline = "bottom";
        _this._activeEffects = [];
        _this.context.logger.debug("Canvas renderer initialized (" + options2.width + "x" + options2.height + ") with scale " + options2.scale);
        return _this;
      }
      CanvasRenderer2.prototype.applyEffects = function(effects) {
        var _this = this;
        while (this._activeEffects.length) {
          this.popEffect();
        }
        effects.forEach(function(effect) {
          return _this.applyEffect(effect);
        });
      };
      CanvasRenderer2.prototype.applyEffect = function(effect) {
        this.ctx.save();
        if (isOpacityEffect(effect)) {
          this.ctx.globalAlpha = effect.opacity;
        }
        if (isTransformEffect(effect)) {
          this.ctx.translate(effect.offsetX, effect.offsetY);
          this.ctx.transform(effect.matrix[0], effect.matrix[1], effect.matrix[2], effect.matrix[3], effect.matrix[4], effect.matrix[5]);
          this.ctx.translate(-effect.offsetX, -effect.offsetY);
        }
        if (isClipEffect(effect)) {
          this.path(effect.path);
          this.ctx.clip();
        }
        this._activeEffects.push(effect);
      };
      CanvasRenderer2.prototype.popEffect = function() {
        this._activeEffects.pop();
        this.ctx.restore();
      };
      CanvasRenderer2.prototype.renderStack = function(stack) {
        return __awaiter(this, void 0, void 0, function() {
          var styles;
          return __generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                styles = stack.element.container.styles;
                if (!styles.isVisible())
                  return [3, 2];
                return [4, this.renderStackContent(stack)];
              case 1:
                _a.sent();
                _a.label = 2;
              case 2:
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      };
      CanvasRenderer2.prototype.renderNode = function(paint) {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                if (contains(
                  paint.container.flags,
                  16
                  /* DEBUG_RENDER */
                )) {
                  debugger;
                }
                if (!paint.container.styles.isVisible())
                  return [3, 3];
                return [4, this.renderNodeBackgroundAndBorders(paint)];
              case 1:
                _a.sent();
                return [4, this.renderNodeContent(paint)];
              case 2:
                _a.sent();
                _a.label = 3;
              case 3:
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      };
      CanvasRenderer2.prototype.renderTextWithLetterSpacing = function(text2, letterSpacing2, baseline) {
        var _this = this;
        if (letterSpacing2 === 0) {
          this.ctx.fillText(text2.text, text2.bounds.left, text2.bounds.top + baseline);
        } else {
          var letters = segmentGraphemes(text2.text);
          letters.reduce(function(left, letter) {
            _this.ctx.fillText(letter, left, text2.bounds.top + baseline);
            return left + _this.ctx.measureText(letter).width;
          }, text2.bounds.left);
        }
      };
      CanvasRenderer2.prototype.createFontStyle = function(styles) {
        var fontVariant2 = styles.fontVariant.filter(function(variant) {
          return variant === "normal" || variant === "small-caps";
        }).join("");
        var fontFamily2 = fixIOSSystemFonts(styles.fontFamily).join(", ");
        var fontSize2 = isDimensionToken(styles.fontSize) ? "" + styles.fontSize.number + styles.fontSize.unit : styles.fontSize.number + "px";
        return [
          [styles.fontStyle, fontVariant2, styles.fontWeight, fontSize2, fontFamily2].join(" "),
          fontFamily2,
          fontSize2
        ];
      };
      CanvasRenderer2.prototype.renderTextNode = function(text2, styles) {
        return __awaiter(this, void 0, void 0, function() {
          var _a, font, fontFamily2, fontSize2, _b, baseline, middle, paintOrder2;
          var _this = this;
          return __generator(this, function(_c) {
            _a = this.createFontStyle(styles), font = _a[0], fontFamily2 = _a[1], fontSize2 = _a[2];
            this.ctx.font = font;
            this.ctx.direction = styles.direction === 1 ? "rtl" : "ltr";
            this.ctx.textAlign = "left";
            this.ctx.textBaseline = "alphabetic";
            _b = this.fontMetrics.getMetrics(fontFamily2, fontSize2), baseline = _b.baseline, middle = _b.middle;
            paintOrder2 = styles.paintOrder;
            text2.textBounds.forEach(function(text3) {
              paintOrder2.forEach(function(paintOrderLayer) {
                switch (paintOrderLayer) {
                  case 0:
                    _this.ctx.fillStyle = asString(styles.color);
                    _this.renderTextWithLetterSpacing(text3, styles.letterSpacing, baseline);
                    var textShadows = styles.textShadow;
                    if (textShadows.length && text3.text.trim().length) {
                      textShadows.slice(0).reverse().forEach(function(textShadow2) {
                        _this.ctx.shadowColor = asString(textShadow2.color);
                        _this.ctx.shadowOffsetX = textShadow2.offsetX.number * _this.options.scale;
                        _this.ctx.shadowOffsetY = textShadow2.offsetY.number * _this.options.scale;
                        _this.ctx.shadowBlur = textShadow2.blur.number;
                        _this.renderTextWithLetterSpacing(text3, styles.letterSpacing, baseline);
                      });
                      _this.ctx.shadowColor = "";
                      _this.ctx.shadowOffsetX = 0;
                      _this.ctx.shadowOffsetY = 0;
                      _this.ctx.shadowBlur = 0;
                    }
                    if (styles.textDecorationLine.length) {
                      _this.ctx.fillStyle = asString(styles.textDecorationColor || styles.color);
                      styles.textDecorationLine.forEach(function(textDecorationLine2) {
                        switch (textDecorationLine2) {
                          case 1:
                            _this.ctx.fillRect(text3.bounds.left, Math.round(text3.bounds.top + baseline), text3.bounds.width, 1);
                            break;
                          case 2:
                            _this.ctx.fillRect(text3.bounds.left, Math.round(text3.bounds.top), text3.bounds.width, 1);
                            break;
                          case 3:
                            _this.ctx.fillRect(text3.bounds.left, Math.ceil(text3.bounds.top + middle), text3.bounds.width, 1);
                            break;
                        }
                      });
                    }
                    break;
                  case 1:
                    if (styles.webkitTextStrokeWidth && text3.text.trim().length) {
                      _this.ctx.strokeStyle = asString(styles.webkitTextStrokeColor);
                      _this.ctx.lineWidth = styles.webkitTextStrokeWidth;
                      _this.ctx.lineJoin = !!window.chrome ? "miter" : "round";
                      _this.ctx.strokeText(text3.text, text3.bounds.left, text3.bounds.top + baseline);
                    }
                    _this.ctx.strokeStyle = "";
                    _this.ctx.lineWidth = 0;
                    _this.ctx.lineJoin = "miter";
                    break;
                }
              });
            });
            return [
              2
              /*return*/
            ];
          });
        });
      };
      CanvasRenderer2.prototype.renderReplacedElement = function(container, curves, image2) {
        if (image2 && container.intrinsicWidth > 0 && container.intrinsicHeight > 0) {
          var box = contentBox(container);
          var path2 = calculatePaddingBoxPath(curves);
          this.path(path2);
          this.ctx.save();
          this.ctx.clip();
          this.ctx.drawImage(image2, 0, 0, container.intrinsicWidth, container.intrinsicHeight, box.left, box.top, box.width, box.height);
          this.ctx.restore();
        }
      };
      CanvasRenderer2.prototype.renderNodeContent = function(paint) {
        return __awaiter(this, void 0, void 0, function() {
          var container, curves, styles, _i, _a, child, image2, image2, iframeRenderer, canvas, size, _b, fontFamily2, fontSize2, baseline, bounds, x2, textBounds, img, image2, url, fontFamily2, bounds;
          return __generator(this, function(_c) {
            switch (_c.label) {
              case 0:
                this.applyEffects(paint.getEffects(
                  4
                  /* CONTENT */
                ));
                container = paint.container;
                curves = paint.curves;
                styles = container.styles;
                _i = 0, _a = container.textNodes;
                _c.label = 1;
              case 1:
                if (!(_i < _a.length))
                  return [3, 4];
                child = _a[_i];
                return [4, this.renderTextNode(child, styles)];
              case 2:
                _c.sent();
                _c.label = 3;
              case 3:
                _i++;
                return [3, 1];
              case 4:
                if (!(container instanceof ImageElementContainer))
                  return [3, 8];
                _c.label = 5;
              case 5:
                _c.trys.push([5, 7, , 8]);
                return [4, this.context.cache.match(container.src)];
              case 6:
                image2 = _c.sent();
                this.renderReplacedElement(container, curves, image2);
                return [3, 8];
              case 7:
                _c.sent();
                this.context.logger.error("Error loading image " + container.src);
                return [3, 8];
              case 8:
                if (container instanceof CanvasElementContainer) {
                  this.renderReplacedElement(container, curves, container.canvas);
                }
                if (!(container instanceof SVGElementContainer))
                  return [3, 12];
                _c.label = 9;
              case 9:
                _c.trys.push([9, 11, , 12]);
                return [4, this.context.cache.match(container.svg)];
              case 10:
                image2 = _c.sent();
                this.renderReplacedElement(container, curves, image2);
                return [3, 12];
              case 11:
                _c.sent();
                this.context.logger.error("Error loading svg " + container.svg.substring(0, 255));
                return [3, 12];
              case 12:
                if (!(container instanceof IFrameElementContainer && container.tree))
                  return [3, 14];
                iframeRenderer = new CanvasRenderer2(this.context, {
                  scale: this.options.scale,
                  backgroundColor: container.backgroundColor,
                  x: 0,
                  y: 0,
                  width: container.width,
                  height: container.height
                });
                return [4, iframeRenderer.render(container.tree)];
              case 13:
                canvas = _c.sent();
                if (container.width && container.height) {
                  this.ctx.drawImage(canvas, 0, 0, container.width, container.height, container.bounds.left, container.bounds.top, container.bounds.width, container.bounds.height);
                }
                _c.label = 14;
              case 14:
                if (container instanceof InputElementContainer) {
                  size = Math.min(container.bounds.width, container.bounds.height);
                  if (container.type === CHECKBOX) {
                    if (container.checked) {
                      this.ctx.save();
                      this.path([
                        new Vector(container.bounds.left + size * 0.39363, container.bounds.top + size * 0.79),
                        new Vector(container.bounds.left + size * 0.16, container.bounds.top + size * 0.5549),
                        new Vector(container.bounds.left + size * 0.27347, container.bounds.top + size * 0.44071),
                        new Vector(container.bounds.left + size * 0.39694, container.bounds.top + size * 0.5649),
                        new Vector(container.bounds.left + size * 0.72983, container.bounds.top + size * 0.23),
                        new Vector(container.bounds.left + size * 0.84, container.bounds.top + size * 0.34085),
                        new Vector(container.bounds.left + size * 0.39363, container.bounds.top + size * 0.79)
                      ]);
                      this.ctx.fillStyle = asString(INPUT_COLOR);
                      this.ctx.fill();
                      this.ctx.restore();
                    }
                  } else if (container.type === RADIO) {
                    if (container.checked) {
                      this.ctx.save();
                      this.ctx.beginPath();
                      this.ctx.arc(container.bounds.left + size / 2, container.bounds.top + size / 2, size / 4, 0, Math.PI * 2, true);
                      this.ctx.fillStyle = asString(INPUT_COLOR);
                      this.ctx.fill();
                      this.ctx.restore();
                    }
                  }
                }
                if (isTextInputElement(container) && container.value.length) {
                  _b = this.createFontStyle(styles), fontFamily2 = _b[0], fontSize2 = _b[1];
                  baseline = this.fontMetrics.getMetrics(fontFamily2, fontSize2).baseline;
                  this.ctx.font = fontFamily2;
                  this.ctx.fillStyle = asString(styles.color);
                  this.ctx.textBaseline = "alphabetic";
                  this.ctx.textAlign = canvasTextAlign(container.styles.textAlign);
                  bounds = contentBox(container);
                  x2 = 0;
                  switch (container.styles.textAlign) {
                    case 1:
                      x2 += bounds.width / 2;
                      break;
                    case 2:
                      x2 += bounds.width;
                      break;
                  }
                  textBounds = bounds.add(x2, 0, 0, -bounds.height / 2 + 1);
                  this.ctx.save();
                  this.path([
                    new Vector(bounds.left, bounds.top),
                    new Vector(bounds.left + bounds.width, bounds.top),
                    new Vector(bounds.left + bounds.width, bounds.top + bounds.height),
                    new Vector(bounds.left, bounds.top + bounds.height)
                  ]);
                  this.ctx.clip();
                  this.renderTextWithLetterSpacing(new TextBounds(container.value, textBounds), styles.letterSpacing, baseline);
                  this.ctx.restore();
                  this.ctx.textBaseline = "alphabetic";
                  this.ctx.textAlign = "left";
                }
                if (!contains(
                  container.styles.display,
                  2048
                  /* LIST_ITEM */
                ))
                  return [3, 20];
                if (!(container.styles.listStyleImage !== null))
                  return [3, 19];
                img = container.styles.listStyleImage;
                if (!(img.type === 0))
                  return [3, 18];
                image2 = void 0;
                url = img.url;
                _c.label = 15;
              case 15:
                _c.trys.push([15, 17, , 18]);
                return [4, this.context.cache.match(url)];
              case 16:
                image2 = _c.sent();
                this.ctx.drawImage(image2, container.bounds.left - (image2.width + 10), container.bounds.top);
                return [3, 18];
              case 17:
                _c.sent();
                this.context.logger.error("Error loading list-style-image " + url);
                return [3, 18];
              case 18:
                return [3, 20];
              case 19:
                if (paint.listValue && container.styles.listStyleType !== -1) {
                  fontFamily2 = this.createFontStyle(styles)[0];
                  this.ctx.font = fontFamily2;
                  this.ctx.fillStyle = asString(styles.color);
                  this.ctx.textBaseline = "middle";
                  this.ctx.textAlign = "right";
                  bounds = new Bounds(container.bounds.left, container.bounds.top + getAbsoluteValue(container.styles.paddingTop, container.bounds.width), container.bounds.width, computeLineHeight(styles.lineHeight, styles.fontSize.number) / 2 + 1);
                  this.renderTextWithLetterSpacing(new TextBounds(paint.listValue, bounds), styles.letterSpacing, computeLineHeight(styles.lineHeight, styles.fontSize.number) / 2 + 2);
                  this.ctx.textBaseline = "bottom";
                  this.ctx.textAlign = "left";
                }
                _c.label = 20;
              case 20:
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      };
      CanvasRenderer2.prototype.renderStackContent = function(stack) {
        return __awaiter(this, void 0, void 0, function() {
          var _i, _a, child, _b, _c, child, _d, _e, child, _f, _g, child, _h, _j, child, _k, _l, child, _m, _o, child;
          return __generator(this, function(_p) {
            switch (_p.label) {
              case 0:
                if (contains(
                  stack.element.container.flags,
                  16
                  /* DEBUG_RENDER */
                )) {
                  debugger;
                }
                return [4, this.renderNodeBackgroundAndBorders(stack.element)];
              case 1:
                _p.sent();
                _i = 0, _a = stack.negativeZIndex;
                _p.label = 2;
              case 2:
                if (!(_i < _a.length))
                  return [3, 5];
                child = _a[_i];
                return [4, this.renderStack(child)];
              case 3:
                _p.sent();
                _p.label = 4;
              case 4:
                _i++;
                return [3, 2];
              case 5:
                return [4, this.renderNodeContent(stack.element)];
              case 6:
                _p.sent();
                _b = 0, _c = stack.nonInlineLevel;
                _p.label = 7;
              case 7:
                if (!(_b < _c.length))
                  return [3, 10];
                child = _c[_b];
                return [4, this.renderNode(child)];
              case 8:
                _p.sent();
                _p.label = 9;
              case 9:
                _b++;
                return [3, 7];
              case 10:
                _d = 0, _e = stack.nonPositionedFloats;
                _p.label = 11;
              case 11:
                if (!(_d < _e.length))
                  return [3, 14];
                child = _e[_d];
                return [4, this.renderStack(child)];
              case 12:
                _p.sent();
                _p.label = 13;
              case 13:
                _d++;
                return [3, 11];
              case 14:
                _f = 0, _g = stack.nonPositionedInlineLevel;
                _p.label = 15;
              case 15:
                if (!(_f < _g.length))
                  return [3, 18];
                child = _g[_f];
                return [4, this.renderStack(child)];
              case 16:
                _p.sent();
                _p.label = 17;
              case 17:
                _f++;
                return [3, 15];
              case 18:
                _h = 0, _j = stack.inlineLevel;
                _p.label = 19;
              case 19:
                if (!(_h < _j.length))
                  return [3, 22];
                child = _j[_h];
                return [4, this.renderNode(child)];
              case 20:
                _p.sent();
                _p.label = 21;
              case 21:
                _h++;
                return [3, 19];
              case 22:
                _k = 0, _l = stack.zeroOrAutoZIndexOrTransformedOrOpacity;
                _p.label = 23;
              case 23:
                if (!(_k < _l.length))
                  return [3, 26];
                child = _l[_k];
                return [4, this.renderStack(child)];
              case 24:
                _p.sent();
                _p.label = 25;
              case 25:
                _k++;
                return [3, 23];
              case 26:
                _m = 0, _o = stack.positiveZIndex;
                _p.label = 27;
              case 27:
                if (!(_m < _o.length))
                  return [3, 30];
                child = _o[_m];
                return [4, this.renderStack(child)];
              case 28:
                _p.sent();
                _p.label = 29;
              case 29:
                _m++;
                return [3, 27];
              case 30:
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      };
      CanvasRenderer2.prototype.mask = function(paths) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(this.canvas.width, 0);
        this.ctx.lineTo(this.canvas.width, this.canvas.height);
        this.ctx.lineTo(0, this.canvas.height);
        this.ctx.lineTo(0, 0);
        this.formatPath(paths.slice(0).reverse());
        this.ctx.closePath();
      };
      CanvasRenderer2.prototype.path = function(paths) {
        this.ctx.beginPath();
        this.formatPath(paths);
        this.ctx.closePath();
      };
      CanvasRenderer2.prototype.formatPath = function(paths) {
        var _this = this;
        paths.forEach(function(point2, index2) {
          var start = isBezierCurve(point2) ? point2.start : point2;
          if (index2 === 0) {
            _this.ctx.moveTo(start.x, start.y);
          } else {
            _this.ctx.lineTo(start.x, start.y);
          }
          if (isBezierCurve(point2)) {
            _this.ctx.bezierCurveTo(point2.startControl.x, point2.startControl.y, point2.endControl.x, point2.endControl.y, point2.end.x, point2.end.y);
          }
        });
      };
      CanvasRenderer2.prototype.renderRepeat = function(path2, pattern, offsetX, offsetY) {
        this.path(path2);
        this.ctx.fillStyle = pattern;
        this.ctx.translate(offsetX, offsetY);
        this.ctx.fill();
        this.ctx.translate(-offsetX, -offsetY);
      };
      CanvasRenderer2.prototype.resizeImage = function(image2, width, height) {
        var _a;
        if (image2.width === width && image2.height === height) {
          return image2;
        }
        var ownerDocument = (_a = this.canvas.ownerDocument) !== null && _a !== void 0 ? _a : document;
        var canvas = ownerDocument.createElement("canvas");
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);
        var ctx = canvas.getContext("2d");
        ctx.drawImage(image2, 0, 0, image2.width, image2.height, 0, 0, width, height);
        return canvas;
      };
      CanvasRenderer2.prototype.renderBackgroundImage = function(container) {
        return __awaiter(this, void 0, void 0, function() {
          var index2, _loop_1, this_1, _i, _a, backgroundImage2;
          return __generator(this, function(_b) {
            switch (_b.label) {
              case 0:
                index2 = container.styles.backgroundImage.length - 1;
                _loop_1 = function(backgroundImage3) {
                  var image2, url, _c, path2, x2, y2, width, height, pattern, _d, path2, x2, y2, width, height, _e, lineLength, x0, x1, y0, y1, canvas, ctx, gradient_1, pattern, _f, path2, left, top_1, width, height, position2, x2, y2, _g, rx, ry, radialGradient_1, midX, midY, f2, invF;
                  return __generator(this, function(_h) {
                    switch (_h.label) {
                      case 0:
                        if (!(backgroundImage3.type === 0))
                          return [3, 5];
                        image2 = void 0;
                        url = backgroundImage3.url;
                        _h.label = 1;
                      case 1:
                        _h.trys.push([1, 3, , 4]);
                        return [4, this_1.context.cache.match(url)];
                      case 2:
                        image2 = _h.sent();
                        return [3, 4];
                      case 3:
                        _h.sent();
                        this_1.context.logger.error("Error loading background-image " + url);
                        return [3, 4];
                      case 4:
                        if (image2) {
                          _c = calculateBackgroundRendering(container, index2, [
                            image2.width,
                            image2.height,
                            image2.width / image2.height
                          ]), path2 = _c[0], x2 = _c[1], y2 = _c[2], width = _c[3], height = _c[4];
                          pattern = this_1.ctx.createPattern(this_1.resizeImage(image2, width, height), "repeat");
                          this_1.renderRepeat(path2, pattern, x2, y2);
                        }
                        return [3, 6];
                      case 5:
                        if (isLinearGradient(backgroundImage3)) {
                          _d = calculateBackgroundRendering(container, index2, [null, null, null]), path2 = _d[0], x2 = _d[1], y2 = _d[2], width = _d[3], height = _d[4];
                          _e = calculateGradientDirection(backgroundImage3.angle, width, height), lineLength = _e[0], x0 = _e[1], x1 = _e[2], y0 = _e[3], y1 = _e[4];
                          canvas = document.createElement("canvas");
                          canvas.width = width;
                          canvas.height = height;
                          ctx = canvas.getContext("2d");
                          gradient_1 = ctx.createLinearGradient(x0, y0, x1, y1);
                          processColorStops(backgroundImage3.stops, lineLength).forEach(function(colorStop) {
                            return gradient_1.addColorStop(colorStop.stop, asString(colorStop.color));
                          });
                          ctx.fillStyle = gradient_1;
                          ctx.fillRect(0, 0, width, height);
                          if (width > 0 && height > 0) {
                            pattern = this_1.ctx.createPattern(canvas, "repeat");
                            this_1.renderRepeat(path2, pattern, x2, y2);
                          }
                        } else if (isRadialGradient(backgroundImage3)) {
                          _f = calculateBackgroundRendering(container, index2, [
                            null,
                            null,
                            null
                          ]), path2 = _f[0], left = _f[1], top_1 = _f[2], width = _f[3], height = _f[4];
                          position2 = backgroundImage3.position.length === 0 ? [FIFTY_PERCENT] : backgroundImage3.position;
                          x2 = getAbsoluteValue(position2[0], width);
                          y2 = getAbsoluteValue(position2[position2.length - 1], height);
                          _g = calculateRadius(backgroundImage3, x2, y2, width, height), rx = _g[0], ry = _g[1];
                          if (rx > 0 && ry > 0) {
                            radialGradient_1 = this_1.ctx.createRadialGradient(left + x2, top_1 + y2, 0, left + x2, top_1 + y2, rx);
                            processColorStops(backgroundImage3.stops, rx * 2).forEach(function(colorStop) {
                              return radialGradient_1.addColorStop(colorStop.stop, asString(colorStop.color));
                            });
                            this_1.path(path2);
                            this_1.ctx.fillStyle = radialGradient_1;
                            if (rx !== ry) {
                              midX = container.bounds.left + 0.5 * container.bounds.width;
                              midY = container.bounds.top + 0.5 * container.bounds.height;
                              f2 = ry / rx;
                              invF = 1 / f2;
                              this_1.ctx.save();
                              this_1.ctx.translate(midX, midY);
                              this_1.ctx.transform(1, 0, 0, f2, 0, 0);
                              this_1.ctx.translate(-midX, -midY);
                              this_1.ctx.fillRect(left, invF * (top_1 - midY) + midY, width, height * invF);
                              this_1.ctx.restore();
                            } else {
                              this_1.ctx.fill();
                            }
                          }
                        }
                        _h.label = 6;
                      case 6:
                        index2--;
                        return [
                          2
                          /*return*/
                        ];
                    }
                  });
                };
                this_1 = this;
                _i = 0, _a = container.styles.backgroundImage.slice(0).reverse();
                _b.label = 1;
              case 1:
                if (!(_i < _a.length))
                  return [3, 4];
                backgroundImage2 = _a[_i];
                return [5, _loop_1(backgroundImage2)];
              case 2:
                _b.sent();
                _b.label = 3;
              case 3:
                _i++;
                return [3, 1];
              case 4:
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      };
      CanvasRenderer2.prototype.renderSolidBorder = function(color2, side, curvePoints) {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a) {
            this.path(parsePathForBorder(curvePoints, side));
            this.ctx.fillStyle = asString(color2);
            this.ctx.fill();
            return [
              2
              /*return*/
            ];
          });
        });
      };
      CanvasRenderer2.prototype.renderDoubleBorder = function(color2, width, side, curvePoints) {
        return __awaiter(this, void 0, void 0, function() {
          var outerPaths, innerPaths;
          return __generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                if (!(width < 3))
                  return [3, 2];
                return [4, this.renderSolidBorder(color2, side, curvePoints)];
              case 1:
                _a.sent();
                return [
                  2
                  /*return*/
                ];
              case 2:
                outerPaths = parsePathForBorderDoubleOuter(curvePoints, side);
                this.path(outerPaths);
                this.ctx.fillStyle = asString(color2);
                this.ctx.fill();
                innerPaths = parsePathForBorderDoubleInner(curvePoints, side);
                this.path(innerPaths);
                this.ctx.fill();
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      };
      CanvasRenderer2.prototype.renderNodeBackgroundAndBorders = function(paint) {
        return __awaiter(this, void 0, void 0, function() {
          var styles, hasBackground, borders, backgroundPaintingArea, side, _i, borders_1, border;
          var _this = this;
          return __generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                this.applyEffects(paint.getEffects(
                  2
                  /* BACKGROUND_BORDERS */
                ));
                styles = paint.container.styles;
                hasBackground = !isTransparent(styles.backgroundColor) || styles.backgroundImage.length;
                borders = [
                  { style: styles.borderTopStyle, color: styles.borderTopColor, width: styles.borderTopWidth },
                  { style: styles.borderRightStyle, color: styles.borderRightColor, width: styles.borderRightWidth },
                  { style: styles.borderBottomStyle, color: styles.borderBottomColor, width: styles.borderBottomWidth },
                  { style: styles.borderLeftStyle, color: styles.borderLeftColor, width: styles.borderLeftWidth }
                ];
                backgroundPaintingArea = calculateBackgroundCurvedPaintingArea(getBackgroundValueForIndex(styles.backgroundClip, 0), paint.curves);
                if (!(hasBackground || styles.boxShadow.length))
                  return [3, 2];
                this.ctx.save();
                this.path(backgroundPaintingArea);
                this.ctx.clip();
                if (!isTransparent(styles.backgroundColor)) {
                  this.ctx.fillStyle = asString(styles.backgroundColor);
                  this.ctx.fill();
                }
                return [4, this.renderBackgroundImage(paint.container)];
              case 1:
                _a.sent();
                this.ctx.restore();
                styles.boxShadow.slice(0).reverse().forEach(function(shadow) {
                  _this.ctx.save();
                  var borderBoxArea = calculateBorderBoxPath(paint.curves);
                  var maskOffset = shadow.inset ? 0 : MASK_OFFSET;
                  var shadowPaintingArea = transformPath(borderBoxArea, -maskOffset + (shadow.inset ? 1 : -1) * shadow.spread.number, (shadow.inset ? 1 : -1) * shadow.spread.number, shadow.spread.number * (shadow.inset ? -2 : 2), shadow.spread.number * (shadow.inset ? -2 : 2));
                  if (shadow.inset) {
                    _this.path(borderBoxArea);
                    _this.ctx.clip();
                    _this.mask(shadowPaintingArea);
                  } else {
                    _this.mask(borderBoxArea);
                    _this.ctx.clip();
                    _this.path(shadowPaintingArea);
                  }
                  _this.ctx.shadowOffsetX = shadow.offsetX.number + maskOffset;
                  _this.ctx.shadowOffsetY = shadow.offsetY.number;
                  _this.ctx.shadowColor = asString(shadow.color);
                  _this.ctx.shadowBlur = shadow.blur.number;
                  _this.ctx.fillStyle = shadow.inset ? asString(shadow.color) : "rgba(0,0,0,1)";
                  _this.ctx.fill();
                  _this.ctx.restore();
                });
                _a.label = 2;
              case 2:
                side = 0;
                _i = 0, borders_1 = borders;
                _a.label = 3;
              case 3:
                if (!(_i < borders_1.length))
                  return [3, 13];
                border = borders_1[_i];
                if (!(border.style !== 0 && !isTransparent(border.color) && border.width > 0))
                  return [3, 11];
                if (!(border.style === 2))
                  return [3, 5];
                return [4, this.renderDashedDottedBorder(
                  border.color,
                  border.width,
                  side,
                  paint.curves,
                  2
                  /* DASHED */
                )];
              case 4:
                _a.sent();
                return [3, 11];
              case 5:
                if (!(border.style === 3))
                  return [3, 7];
                return [4, this.renderDashedDottedBorder(
                  border.color,
                  border.width,
                  side,
                  paint.curves,
                  3
                  /* DOTTED */
                )];
              case 6:
                _a.sent();
                return [3, 11];
              case 7:
                if (!(border.style === 4))
                  return [3, 9];
                return [4, this.renderDoubleBorder(border.color, border.width, side, paint.curves)];
              case 8:
                _a.sent();
                return [3, 11];
              case 9:
                return [4, this.renderSolidBorder(border.color, side, paint.curves)];
              case 10:
                _a.sent();
                _a.label = 11;
              case 11:
                side++;
                _a.label = 12;
              case 12:
                _i++;
                return [3, 3];
              case 13:
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      };
      CanvasRenderer2.prototype.renderDashedDottedBorder = function(color2, width, side, curvePoints, style2) {
        return __awaiter(this, void 0, void 0, function() {
          var strokePaths, boxPaths, startX, startY, endX, endY, length, dashLength, spaceLength, useLineDash, multiplier, numberOfDashes, minSpace, maxSpace, path1, path2, path1, path2;
          return __generator(this, function(_a) {
            this.ctx.save();
            strokePaths = parsePathForBorderStroke(curvePoints, side);
            boxPaths = parsePathForBorder(curvePoints, side);
            if (style2 === 2) {
              this.path(boxPaths);
              this.ctx.clip();
            }
            if (isBezierCurve(boxPaths[0])) {
              startX = boxPaths[0].start.x;
              startY = boxPaths[0].start.y;
            } else {
              startX = boxPaths[0].x;
              startY = boxPaths[0].y;
            }
            if (isBezierCurve(boxPaths[1])) {
              endX = boxPaths[1].end.x;
              endY = boxPaths[1].end.y;
            } else {
              endX = boxPaths[1].x;
              endY = boxPaths[1].y;
            }
            if (side === 0 || side === 2) {
              length = Math.abs(startX - endX);
            } else {
              length = Math.abs(startY - endY);
            }
            this.ctx.beginPath();
            if (style2 === 3) {
              this.formatPath(strokePaths);
            } else {
              this.formatPath(boxPaths.slice(0, 2));
            }
            dashLength = width < 3 ? width * 3 : width * 2;
            spaceLength = width < 3 ? width * 2 : width;
            if (style2 === 3) {
              dashLength = width;
              spaceLength = width;
            }
            useLineDash = true;
            if (length <= dashLength * 2) {
              useLineDash = false;
            } else if (length <= dashLength * 2 + spaceLength) {
              multiplier = length / (2 * dashLength + spaceLength);
              dashLength *= multiplier;
              spaceLength *= multiplier;
            } else {
              numberOfDashes = Math.floor((length + spaceLength) / (dashLength + spaceLength));
              minSpace = (length - numberOfDashes * dashLength) / (numberOfDashes - 1);
              maxSpace = (length - (numberOfDashes + 1) * dashLength) / numberOfDashes;
              spaceLength = maxSpace <= 0 || Math.abs(spaceLength - minSpace) < Math.abs(spaceLength - maxSpace) ? minSpace : maxSpace;
            }
            if (useLineDash) {
              if (style2 === 3) {
                this.ctx.setLineDash([0, dashLength + spaceLength]);
              } else {
                this.ctx.setLineDash([dashLength, spaceLength]);
              }
            }
            if (style2 === 3) {
              this.ctx.lineCap = "round";
              this.ctx.lineWidth = width;
            } else {
              this.ctx.lineWidth = width * 2 + 1.1;
            }
            this.ctx.strokeStyle = asString(color2);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
            if (style2 === 2) {
              if (isBezierCurve(boxPaths[0])) {
                path1 = boxPaths[3];
                path2 = boxPaths[0];
                this.ctx.beginPath();
                this.formatPath([new Vector(path1.end.x, path1.end.y), new Vector(path2.start.x, path2.start.y)]);
                this.ctx.stroke();
              }
              if (isBezierCurve(boxPaths[1])) {
                path1 = boxPaths[1];
                path2 = boxPaths[2];
                this.ctx.beginPath();
                this.formatPath([new Vector(path1.end.x, path1.end.y), new Vector(path2.start.x, path2.start.y)]);
                this.ctx.stroke();
              }
            }
            this.ctx.restore();
            return [
              2
              /*return*/
            ];
          });
        });
      };
      CanvasRenderer2.prototype.render = function(element2) {
        return __awaiter(this, void 0, void 0, function() {
          var stack;
          return __generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                if (this.options.backgroundColor) {
                  this.ctx.fillStyle = asString(this.options.backgroundColor);
                  this.ctx.fillRect(this.options.x, this.options.y, this.options.width, this.options.height);
                }
                stack = parseStackingContexts(element2);
                return [4, this.renderStack(stack)];
              case 1:
                _a.sent();
                this.applyEffects([]);
                return [2, this.canvas];
            }
          });
        });
      };
      return CanvasRenderer2;
    }(Renderer)
  );
  var isTextInputElement = function(container) {
    if (container instanceof TextareaElementContainer) {
      return true;
    } else if (container instanceof SelectElementContainer) {
      return true;
    } else if (container instanceof InputElementContainer && container.type !== RADIO && container.type !== CHECKBOX) {
      return true;
    }
    return false;
  };
  var calculateBackgroundCurvedPaintingArea = function(clip, curves) {
    switch (clip) {
      case 0:
        return calculateBorderBoxPath(curves);
      case 2:
        return calculateContentBoxPath(curves);
      case 1:
      default:
        return calculatePaddingBoxPath(curves);
    }
  };
  var canvasTextAlign = function(textAlign2) {
    switch (textAlign2) {
      case 1:
        return "center";
      case 2:
        return "right";
      case 0:
      default:
        return "left";
    }
  };
  var iOSBrokenFonts = ["-apple-system", "system-ui"];
  var fixIOSSystemFonts = function(fontFamilies) {
    return /iPhone OS 15_(0|1)/.test(window.navigator.userAgent) ? fontFamilies.filter(function(fontFamily2) {
      return iOSBrokenFonts.indexOf(fontFamily2) === -1;
    }) : fontFamilies;
  };
  var ForeignObjectRenderer = (
    /** @class */
    function(_super) {
      __extends(ForeignObjectRenderer2, _super);
      function ForeignObjectRenderer2(context, options2) {
        var _this = _super.call(this, context, options2) || this;
        _this.canvas = options2.canvas ? options2.canvas : document.createElement("canvas");
        _this.ctx = _this.canvas.getContext("2d");
        _this.options = options2;
        _this.canvas.width = Math.floor(options2.width * options2.scale);
        _this.canvas.height = Math.floor(options2.height * options2.scale);
        _this.canvas.style.width = options2.width + "px";
        _this.canvas.style.height = options2.height + "px";
        _this.ctx.scale(_this.options.scale, _this.options.scale);
        _this.ctx.translate(-options2.x, -options2.y);
        _this.context.logger.debug("EXPERIMENTAL ForeignObject renderer initialized (" + options2.width + "x" + options2.height + " at " + options2.x + "," + options2.y + ") with scale " + options2.scale);
        return _this;
      }
      ForeignObjectRenderer2.prototype.render = function(element2) {
        return __awaiter(this, void 0, void 0, function() {
          var svg2, img;
          return __generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                svg2 = createForeignObjectSVG(this.options.width * this.options.scale, this.options.height * this.options.scale, this.options.scale, this.options.scale, element2);
                return [4, loadSerializedSVG(svg2)];
              case 1:
                img = _a.sent();
                if (this.options.backgroundColor) {
                  this.ctx.fillStyle = asString(this.options.backgroundColor);
                  this.ctx.fillRect(0, 0, this.options.width * this.options.scale, this.options.height * this.options.scale);
                }
                this.ctx.drawImage(img, -this.options.x * this.options.scale, -this.options.y * this.options.scale);
                return [2, this.canvas];
            }
          });
        });
      };
      return ForeignObjectRenderer2;
    }(Renderer)
  );
  var loadSerializedSVG = function(svg2) {
    return new Promise(function(resolve, reject) {
      var img = new Image();
      img.onload = function() {
        resolve(img);
      };
      img.onerror = reject;
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(svg2));
    });
  };
  var Logger = (
    /** @class */
    function() {
      function Logger2(_a) {
        var id = _a.id, enabled = _a.enabled;
        this.id = id;
        this.enabled = enabled;
        this.start = Date.now();
      }
      Logger2.prototype.debug = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        if (this.enabled) {
          if (typeof window !== "undefined" && window.console && typeof console.debug === "function") {
            console.debug.apply(console, __spreadArray([this.id, this.getTime() + "ms"], args));
          } else {
            this.info.apply(this, args);
          }
        }
      };
      Logger2.prototype.getTime = function() {
        return Date.now() - this.start;
      };
      Logger2.prototype.info = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        if (this.enabled) {
          if (typeof window !== "undefined" && window.console && typeof console.info === "function") {
            console.info.apply(console, __spreadArray([this.id, this.getTime() + "ms"], args));
          }
        }
      };
      Logger2.prototype.warn = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        if (this.enabled) {
          if (typeof window !== "undefined" && window.console && typeof console.warn === "function") {
            console.warn.apply(console, __spreadArray([this.id, this.getTime() + "ms"], args));
          } else {
            this.info.apply(this, args);
          }
        }
      };
      Logger2.prototype.error = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        if (this.enabled) {
          if (typeof window !== "undefined" && window.console && typeof console.error === "function") {
            console.error.apply(console, __spreadArray([this.id, this.getTime() + "ms"], args));
          } else {
            this.info.apply(this, args);
          }
        }
      };
      Logger2.instances = {};
      return Logger2;
    }()
  );
  var Context = (
    /** @class */
    function() {
      function Context2(options2, windowBounds) {
        var _a;
        this.windowBounds = windowBounds;
        this.instanceName = "#" + Context2.instanceCount++;
        this.logger = new Logger({ id: this.instanceName, enabled: options2.logging });
        this.cache = (_a = options2.cache) !== null && _a !== void 0 ? _a : new Cache(this, options2);
      }
      Context2.instanceCount = 1;
      return Context2;
    }()
  );
  var html2canvas = function(element2, options2) {
    if (options2 === void 0) {
      options2 = {};
    }
    return renderElement(element2, options2);
  };
  if (typeof window !== "undefined") {
    CacheStorage.setContext(window);
  }
  var renderElement = function(element2, opts) {
    return __awaiter(void 0, void 0, void 0, function() {
      var ownerDocument, defaultView, resourceOptions, contextOptions, windowOptions, windowBounds, context, foreignObjectRendering, cloneOptions, documentCloner, clonedElement, container, _a, width, height, left, top, backgroundColor2, renderOptions, canvas, renderer, root2, renderer;
      var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
      return __generator(this, function(_u) {
        switch (_u.label) {
          case 0:
            if (!element2 || typeof element2 !== "object") {
              return [2, Promise.reject("Invalid element provided as first argument")];
            }
            ownerDocument = element2.ownerDocument;
            if (!ownerDocument) {
              throw new Error("Element is not attached to a Document");
            }
            defaultView = ownerDocument.defaultView;
            if (!defaultView) {
              throw new Error("Document is not attached to a Window");
            }
            resourceOptions = {
              allowTaint: (_b = opts.allowTaint) !== null && _b !== void 0 ? _b : false,
              imageTimeout: (_c = opts.imageTimeout) !== null && _c !== void 0 ? _c : 15e3,
              proxy: opts.proxy,
              useCORS: (_d = opts.useCORS) !== null && _d !== void 0 ? _d : false
            };
            contextOptions = __assign({ logging: (_e = opts.logging) !== null && _e !== void 0 ? _e : true, cache: opts.cache }, resourceOptions);
            windowOptions = {
              windowWidth: (_f = opts.windowWidth) !== null && _f !== void 0 ? _f : defaultView.innerWidth,
              windowHeight: (_g = opts.windowHeight) !== null && _g !== void 0 ? _g : defaultView.innerHeight,
              scrollX: (_h = opts.scrollX) !== null && _h !== void 0 ? _h : defaultView.pageXOffset,
              scrollY: (_j = opts.scrollY) !== null && _j !== void 0 ? _j : defaultView.pageYOffset
            };
            windowBounds = new Bounds(windowOptions.scrollX, windowOptions.scrollY, windowOptions.windowWidth, windowOptions.windowHeight);
            context = new Context(contextOptions, windowBounds);
            foreignObjectRendering = (_k = opts.foreignObjectRendering) !== null && _k !== void 0 ? _k : false;
            cloneOptions = {
              allowTaint: (_l = opts.allowTaint) !== null && _l !== void 0 ? _l : false,
              onclone: opts.onclone,
              ignoreElements: opts.ignoreElements,
              inlineImages: foreignObjectRendering,
              copyStyles: foreignObjectRendering
            };
            context.logger.debug("Starting document clone with size " + windowBounds.width + "x" + windowBounds.height + " scrolled to " + -windowBounds.left + "," + -windowBounds.top);
            documentCloner = new DocumentCloner(context, element2, cloneOptions);
            clonedElement = documentCloner.clonedReferenceElement;
            if (!clonedElement) {
              return [2, Promise.reject("Unable to find element in cloned iframe")];
            }
            return [4, documentCloner.toIFrame(ownerDocument, windowBounds)];
          case 1:
            container = _u.sent();
            _a = isBodyElement(clonedElement) || isHTMLElement(clonedElement) ? parseDocumentSize(clonedElement.ownerDocument) : parseBounds(context, clonedElement), width = _a.width, height = _a.height, left = _a.left, top = _a.top;
            backgroundColor2 = parseBackgroundColor(context, clonedElement, opts.backgroundColor);
            renderOptions = {
              canvas: opts.canvas,
              backgroundColor: backgroundColor2,
              scale: (_o = (_m = opts.scale) !== null && _m !== void 0 ? _m : defaultView.devicePixelRatio) !== null && _o !== void 0 ? _o : 1,
              x: ((_p = opts.x) !== null && _p !== void 0 ? _p : 0) + left,
              y: ((_q = opts.y) !== null && _q !== void 0 ? _q : 0) + top,
              width: (_r = opts.width) !== null && _r !== void 0 ? _r : Math.ceil(width),
              height: (_s = opts.height) !== null && _s !== void 0 ? _s : Math.ceil(height)
            };
            if (!foreignObjectRendering)
              return [3, 3];
            context.logger.debug("Document cloned, using foreign object rendering");
            renderer = new ForeignObjectRenderer(context, renderOptions);
            return [4, renderer.render(clonedElement)];
          case 2:
            canvas = _u.sent();
            return [3, 5];
          case 3:
            context.logger.debug("Document cloned, element located at " + left + "," + top + " with size " + width + "x" + height + " using computed rendering");
            context.logger.debug("Starting DOM parsing");
            root2 = parseTree(context, clonedElement);
            if (backgroundColor2 === root2.styles.backgroundColor) {
              root2.styles.backgroundColor = COLORS.TRANSPARENT;
            }
            context.logger.debug("Starting renderer for element at " + renderOptions.x + "," + renderOptions.y + " with size " + renderOptions.width + "x" + renderOptions.height);
            renderer = new CanvasRenderer(context, renderOptions);
            return [4, renderer.render(root2)];
          case 4:
            canvas = _u.sent();
            _u.label = 5;
          case 5:
            if ((_t = opts.removeContainer) !== null && _t !== void 0 ? _t : true) {
              if (!DocumentCloner.destroy(container)) {
                context.logger.error("Cannot detach cloned iframe as it is not in the DOM anymore");
              }
            }
            context.logger.debug("Finished rendering");
            return [2, canvas];
        }
      });
    });
  };
  var parseBackgroundColor = function(context, element2, backgroundColorOverride) {
    var ownerDocument = element2.ownerDocument;
    var documentBackgroundColor = ownerDocument.documentElement ? parseColor(context, getComputedStyle(ownerDocument.documentElement).backgroundColor) : COLORS.TRANSPARENT;
    var bodyBackgroundColor = ownerDocument.body ? parseColor(context, getComputedStyle(ownerDocument.body).backgroundColor) : COLORS.TRANSPARENT;
    var defaultBackgroundColor = typeof backgroundColorOverride === "string" ? parseColor(context, backgroundColorOverride) : backgroundColorOverride === null ? COLORS.TRANSPARENT : 4294967295;
    return element2 === ownerDocument.documentElement ? isTransparent(documentBackgroundColor) ? isTransparent(bodyBackgroundColor) ? defaultBackgroundColor : bodyBackgroundColor : documentBackgroundColor : defaultBackgroundColor;
  };
  const noop = () => {
  };
  function onloadSafe(fn2) {
    if (document.readyState === "complete") {
      fn2();
    } else {
      window.addEventListener("load", fn2);
    }
  }
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  function dateStr(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  function timestamp() {
    return new Date().toISOString().replace(/:/g, "-").replace(/\..+/, "");
  }
  function getColorScheme() {
    return document.documentElement.style.getPropertyValue("color-scheme");
  }
  function downloadFile(filename, type, content2) {
    const blob = new Blob([content2], {
      type
    });
    const url = URL.createObjectURL(blob);
    const a2 = document.createElement("a");
    a2.href = url;
    a2.download = filename;
    document.body.appendChild(a2);
    a2.click();
    document.body.removeChild(a2);
  }
  function downloadUrl(filename, url) {
    const a2 = document.createElement("a");
    a2.href = url;
    a2.download = filename;
    document.body.appendChild(a2);
    a2.click();
    document.body.removeChild(a2);
  }
  function getFileNameWithFormat(format2, ext, {
    title = document.title
  } = {}) {
    const _title = sanitizeFilename(title).replace(/\s+/g, "_");
    return format2.replace("{title}", _title).replace("{date}", dateStr()).replace("{timestamp}", timestamp()).concat(`.${ext}`);
  }
  function fnIgnoreElements(el) {
    return typeof el.shadowRoot === "object" && el.shadowRoot !== null;
  }
  async function exportToPng(fileNameFormat) {
    var _a;
    if (!checkIfConversationStarted()) {
      alert("Please start a conversation first.");
      return false;
    }
    const thread = (_a = document.querySelector("main .group")) == null ? void 0 : _a.parentElement;
    if (!thread || thread.children.length === 0)
      return false;
    Array.from(thread.children).forEach((el) => {
      const text2 = el.textContent;
      if (text2 === "Model: Default" || text2 === "Model: Legacy") {
        el.classList.add("hidden");
      }
    });
    thread.children[thread.children.length - 1].classList.add("hidden");
    await sleep(100);
    const canvas = await html2canvas(thread, {
      scale: 1,
      useCORS: true,
      scrollX: -window.scrollX,
      scrollY: -window.scrollY,
      windowWidth: thread.scrollWidth,
      windowHeight: thread.scrollHeight,
      ignoreElements: fnIgnoreElements
    });
    Array.from(thread.children).forEach((el) => {
      if (el.classList.contains("hidden")) {
        el.classList.remove("hidden");
      }
    });
    const dataUrl = canvas.toDataURL("image/png", 1).replace(/^data:image\/[^;]/, "data:application/octet-stream");
    const fileName = getFileNameWithFormat(fileNameFormat, "png");
    downloadUrl(fileName, dataUrl);
    window.URL.revokeObjectURL(dataUrl);
    return true;
  }
  async function exportToMarkdown(fileNameFormat) {
    if (!checkIfConversationStarted()) {
      alert("Please start a conversation first.");
      return false;
    }
    const {
      conversations
    } = await getConversations();
    const content2 = conversations.map((item) => {
      var _a, _b;
      const author = ((_a = item.message) == null ? void 0 : _a.author.role) === "assistant" ? "ChatGPT" : "You";
      const content22 = ((_b = item.message) == null ? void 0 : _b.content.parts.join("\n")) ?? "";
      let message = content22;
      if (author === "ChatGPT") {
        const root2 = fromMarkdown(content22);
        message = toMarkdown(root2);
      }
      return `#### ${author}:
${message}`;
    }).join("\n\n");
    const markdown = content2;
    const fileName = getFileNameWithFormat(fileNameFormat, "md");
    downloadFile(fileName, "text/markdown", standardizeLineBreaks(markdown));
    return true;
  }
  const templateHtml = `<!DOCTYPE html>
<html lang="{{lang}}" data-theme="{{theme}}">
<head>
    <meta charset="UTF-8" />
    <link rel="icon" href="https://chat.openai.com/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{title}}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/github-dark.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js"><\/script>
    <script>
        hljs.highlightAll()
    <\/script>

    <style>
        :root {
            --tw-prose-code: #111827;
            --tw-prose-hr: #e5e7eb;
            --tw-prose-links: #111827;
            --tw-prose-headings: #111827;
            --tw-prose-quotes: #111827;
            --tw-prose-counters: #6b7280;
            --page-bg: #f7f7f8;
            --page-text: #374151;
            --conversation-odd-bg: rgba(247,247,248);
            --th-boarders: #4b5563;
            --td-boarders: #374151;
        }

        [data-theme="dark"] {
            --tw-prose-code: #f9fafb;
            --tw-prose-hr: #374151;
            --tw-prose-links: #fff;
            --tw-prose-headings: #fff;
            --tw-prose-quotes: #f3f4f6;
            --tw-prose-counters: #9ca3af;
            --page-bg: rgba(52,53,65);
            --page-text: #fff;
            --conversation-odd-bg: rgb(68,70,84);
        }

        * {
            box-sizing: border-box;
            font-size: 16px;
        }

        ::-webkit-scrollbar {
            height: 1rem;
            width: .5rem
        }

        ::-webkit-scrollbar:horizontal {
            height: .5rem;
            width: 1rem
        }

        ::-webkit-scrollbar-track {
            background-color: transparent;
            border-radius: 9999px
        }

        ::-webkit-scrollbar-thumb {
            --tw-border-opacity: 1;
            background-color: rgba(217,217,227,.8);
            border-color: rgba(255,255,255,var(--tw-border-opacity));
            border-radius: 9999px;
            border-width: 1px
        }

        ::-webkit-scrollbar-thumb:hover {
            --tw-bg-opacity: 1;
            background-color: rgba(236,236,241,var(--tw-bg-opacity))
        }

        .dark ::-webkit-scrollbar-thumb {
            --tw-bg-opacity: 1;
            background-color: rgba(86,88,105,var(--tw-bg-opacity))
        }

        .dark ::-webkit-scrollbar-thumb:hover {
            --tw-bg-opacity: 1;
            background-color: rgba(172,172,190,var(--tw-bg-opacity))
        }

        @media (min-width: 768px) {
            .scrollbar-trigger ::-webkit-scrollbar-thumb {
                visibility:hidden
            }

            .scrollbar-trigger:hover ::-webkit-scrollbar-thumb {
                visibility: visible
            }
        }

        body {
            font-family: Söhne,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,Helvetica Neue,Arial,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;
            font-size: 14px;
            line-height: 1.5;
            color: var(--page-text);
            background-color: var(--page-bg);
            margin: 0;
            padding: 0;
        }

        [data-theme="light"] .sun {
            display: none;
        }

        [data-theme="dark"] .moon {
            display: none;
        }

        .toggle {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            width: 32px;
            height: 32px;
            border-radius: 4px;
            background-color: #fff;
            border: 1px solid #e2e8f0;
        }

        a {
            color: var(--tw-prose-links);
            font-size: 0.8rem;
            text-decoration-line: underline;
            text-underline-offset: 2px;
        }

        .conversation-content > p:first-child,
        ol:first-child {
            margin-top: 0;
        }

        p>code, li>code {
            color: var(--tw-prose-code);
            font-weight: 600;
            font-size: .875em;
        }

        p>code::before,
        p>code::after,
        li>code::before,
        li>code::after {
            content: "\`";
        }

        hr {
            width: 100%;
            height: 0;
            border: 1px solid var(--tw-prose-hr);
            margin-bottom: 1em;
            margin-top: 1em;
        }

        pre {
            color: #ffffff;
            background-color: #000000;
            overflow-x: auto;
            margin: 0 0 1rem 0;
            border-radius: 0.375rem;
        }

        pre>code {
            font-family: Söhne Mono, Monaco, Andale Mono, Ubuntu Mono, monospace !important;
            font-weight: 400;
            font-size: .875em;
            line-height: 1.7142857;
        }

        h1, h2, h3, h4, h5, h6 {
            color: var(--tw-prose-headings);
            margin: 0;
        }

        h1 {
            font-size: 2.25em;
            font-weight: 600;
            line-height: 1.1111111;
            margin-bottom: 0.8888889em;
            margin-top: 0;
        }

        h2 {
            font-size: 1.5em;
            font-weight: 700;
            line-height: 1.3333333;
            margin-bottom: 1em;
            margin-top: 2em;
        }

        h3 {
            font-size: 1.25em;
            font-weight: 600;
            line-height: 1.6;
            margin-bottom: .6em;
            margin-top: 1.6em;
        }

        h4 {
            font-weight: 400;
            line-height: 1.5;
            margin-bottom: .5em;
            margin-top: 1.5em
        }

        h3,h4 {
            margin-bottom: .5rem;
            margin-top: 1rem;
        }

        h5 {
            font-weight: 600;
        }

        blockquote {
            border-left: 2px solid rgba(142,142,160,1);
            color: var(--tw-prose-quotes);
            font-style: italic;
            font-style: normal;
            font-weight: 500;
            line-height: 1rem;
            margin: 1.6em 0;
            padding-left: 1em;
            quotes: "\\201C""\\201D""\\2018""\\2019";
        }

        blockquote p:first-of-type:before {
            content: open-quote;
        }

        blockquote p:last-of-type:after {
            content: close-quote;
        }

        ol, ul {
            padding-left: 1.1rem;
        }

        ::marker {
            color: var(--tw-prose-counters);
            font-weight: 400;
        }

        table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0 0;
            table-layout: auto;
            text-align: left;
            font-size: .875em;
            line-height: 1.7142857;
        }

        table * {
            box-sizing: border-box;
            border-width: 0;
            border-style: solid;
            border-color: #d9d9e3;
        }

        table thead {
            border-bottom-color: var(--th-boarders);
            border-bottom-width: 1px;
        }

        table th {
            background-color: rgba(236,236,241,.2);
            border-bottom-width: 1px;
            border-left-width: 1px;
            border-top-width: 1px;
            padding: 0.25rem 0.75rem;
        }

        table th:first-child {
            border-top-left-radius: 0.375rem;
        }

        table th:last-child {
            border-right-width: 1px;
            border-top-right-radius: 0.375rem;
        }

        table tbody tr {
            border-bottom-color: var(--td-boarders);
            border-bottom-width: 1px;
        }

        table tbody tr:last-child {
            border-bottom-width: 0;
        }

        table tbody tr:last-child td:first-child {
            border-bottom-left-radius: 0.375rem;
        }

        table tbody tr:last-child td:last-child {
            border-bottom-right-radius: 0.375rem;
        }

        table td {
            border-bottom-width: 1px;
            border-left-width: 1px;
            padding: 0.25rem 0.75rem;
        }

        table td:last-child {
            border-right-width: 1px;
        }

        [type=checkbox], [type=radio] {
            accent-color: #2563eb;
        }

        .conversation {
            margin: 0 auto;
            max-width: 800px;
            padding: 1rem;
        }

        .conversation-header {
            margin-bottom: 1rem;
        }

        .conversation-header h1 {
            margin: 0;
        }

        .conversation-header h1 a {
            font-size: 1.5rem;
        }

        .conversation-header .conversation-export {
            margin-top: 0.5rem;
            font-size: 0.8rem;
        }

        .conversation-header p {
            margin-top: 0.5rem;
            font-size: 0.8rem;
        }

        .conversation-item {
            display: flex;
            position: relative;
            padding: 1rem;
            border-left: 1px solid rgba(0,0,0,.1);
            border-right: 1px solid rgba(0,0,0,.1);
            border-bottom: 1px solid rgba(0,0,0,.1);
        }

        .conversation-item:first-of-type {
            border-top: 1px solid rgba(0,0,0,.1);
        }

        .conversation-item:nth-child(odd) {
            background-color: var(--conversation-odd-bg);
        }

        .author {
            display: flex;
            flex: 0 0 30px;
            justify-content: center;
            align-items: center;
            width: 30px;
            height: 30px;
            border-radius: 0.125rem;
            margin-right: 1rem;
            background-color: rgb(16, 163, 127);
            overflow: hidden;
        }

        .author svg {
            color: #fff;
            width: 22px;
            height: 22px;
        }

        .author img {
            content: url({{avatar}});
            width: 100%;
            height: 100%;
        }

        .conversation-content-wrapper {
            display: flex;
            position: relative;
            overflow: hidden;
            flex: 1 1 auto;
            flex-direction: column;
        }

        .conversation-content {
            font-size: 1rem;
            line-height: 1.5;
        }

        .conversation-content p {
            white-space: pre-wrap;
            line-height: 28px;
        }

        .conversation-content img, .conversation-content video {
            display: block;
            max-width: 100%;
            height: auto;
            margin-bottom: 2em;
            margin-top: 2em;
        }

        .time {
            position: absolute;
            right: 8px;
            bottom: 0;
            font-size: 0.8rem;
            color: #acacbe
        }
    </style>
</head>

<body>
    <svg aria-hidden="true" style="position: absolute; width: 0; height: 0; overflow: hidden;" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <symbol id="chatgpt" viewBox="0 0 41 41">
            <path d="M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500197C16.1708 0.495044 14.0893 1.16803 12.3614 2.42214C10.6335 3.67624 9.34853 5.44666 8.6917 7.47815C7.30085 7.76286 5.98686 8.3414 4.8377 9.17505C3.68854 10.0087 2.73073 11.0782 2.02839 12.312C0.956464 14.1591 0.498905 16.2988 0.721698 18.4228C0.944492 20.5467 1.83612 22.5449 3.268 24.1293C2.81966 25.4759 2.66413 26.9026 2.81182 28.3141C2.95951 29.7256 3.40701 31.0892 4.12437 32.3138C5.18791 34.1659 6.8123 35.6322 8.76321 36.5013C10.7141 37.3704 12.8907 37.5973 14.9789 37.1492C15.9208 38.2107 17.0786 39.0587 18.3747 39.6366C19.6709 40.2144 21.0755 40.5087 22.4946 40.4998C24.6307 40.5054 26.7133 39.8321 28.4418 38.5772C30.1704 37.3223 31.4556 35.5506 32.1119 33.5179C33.5027 33.2332 34.8167 32.6547 35.9659 31.821C37.115 30.9874 38.0728 29.9178 38.7752 28.684C39.8458 26.8371 40.3023 24.6979 40.0789 22.5748C39.8556 20.4517 38.9639 18.4544 37.5324 16.8707ZM22.4978 37.8849C20.7443 37.8874 19.0459 37.2733 17.6994 36.1501C17.7601 36.117 17.8666 36.0586 17.936 36.0161L25.9004 31.4156C26.1003 31.3019 26.2663 31.137 26.3813 30.9378C26.4964 30.7386 26.5563 30.5124 26.5549 30.2825V19.0542L29.9213 20.998C29.9389 21.0068 29.9541 21.0198 29.9656 21.0359C29.977 21.052 29.9842 21.0707 29.9867 21.0902V30.3889C29.9842 32.375 29.1946 34.2791 27.7909 35.6841C26.3872 37.0892 24.4838 37.8806 22.4978 37.8849ZM6.39227 31.0064C5.51397 29.4888 5.19742 27.7107 5.49804 25.9832C5.55718 26.0187 5.66048 26.0818 5.73461 26.1244L13.699 30.7248C13.8975 30.8408 14.1233 30.902 14.3532 30.902C14.583 30.902 14.8088 30.8408 15.0073 30.7248L24.731 25.1103V28.9979C24.7321 29.0177 24.7283 29.0376 24.7199 29.0556C24.7115 29.0736 24.6988 29.0893 24.6829 29.1012L16.6317 33.7497C14.9096 34.7416 12.8643 35.0097 10.9447 34.4954C9.02506 33.9811 7.38785 32.7263 6.39227 31.0064ZM4.29707 13.6194C5.17156 12.0998 6.55279 10.9364 8.19885 10.3327C8.19885 10.4013 8.19491 10.5228 8.19491 10.6071V19.808C8.19351 20.0378 8.25334 20.2638 8.36823 20.4629C8.48312 20.6619 8.64893 20.8267 8.84863 20.9404L18.5723 26.5542L15.206 28.4979C15.1894 28.5089 15.1703 28.5155 15.1505 28.5173C15.1307 28.5191 15.1107 28.516 15.0924 28.5082L7.04046 23.8557C5.32135 22.8601 4.06716 21.2235 3.55289 19.3046C3.03862 17.3858 3.30624 15.3413 4.29707 13.6194ZM31.955 20.0556L22.2312 14.4411L25.5976 12.4981C25.6142 12.4872 25.6333 12.4805 25.6531 12.4787C25.6729 12.4769 25.6928 12.4801 25.7111 12.4879L33.7631 17.1364C34.9967 17.849 36.0017 18.8982 36.6606 20.1613C37.3194 21.4244 37.6047 22.849 37.4832 24.2684C37.3617 25.6878 36.8382 27.0432 35.9743 28.1759C35.1103 29.3086 33.9415 30.1717 32.6047 30.6641C32.6047 30.5947 32.6047 30.4733 32.6047 30.3889V21.188C32.6066 20.9586 32.5474 20.7328 32.4332 20.5338C32.319 20.3348 32.154 20.1698 31.955 20.0556ZM35.3055 15.0128C35.2464 14.9765 35.1431 14.9142 35.069 14.8717L27.1045 10.2712C26.906 10.1554 26.6803 10.0943 26.4504 10.0943C26.2206 10.0943 25.9948 10.1554 25.7963 10.2712L16.0726 15.8858V11.9982C16.0715 11.9783 16.0753 11.9585 16.0837 11.9405C16.0921 11.9225 16.1048 11.9068 16.1207 11.8949L24.1719 7.25025C25.4053 6.53903 26.8158 6.19376 28.2383 6.25482C29.6608 6.31589 31.0364 6.78077 32.2044 7.59508C33.3723 8.40939 34.2842 9.53945 34.8334 10.8531C35.3826 12.1667 35.5464 13.6095 35.3055 15.0128ZM14.2424 21.9419L10.8752 19.9981C10.8576 19.9893 10.8423 19.9763 10.8309 19.9602C10.8195 19.9441 10.8122 19.9254 10.8098 19.9058V10.6071C10.8107 9.18295 11.2173 7.78848 11.9819 6.58696C12.7466 5.38544 13.8377 4.42659 15.1275 3.82264C16.4173 3.21869 17.8524 2.99464 19.2649 3.1767C20.6775 3.35876 22.0089 3.93941 23.1034 4.85067C23.0427 4.88379 22.937 4.94215 22.8668 4.98473L14.9024 9.58517C14.7025 9.69878 14.5366 9.86356 14.4215 10.0626C14.3065 10.2616 14.2466 10.4877 14.2479 10.7175L14.2424 21.9419ZM16.071 17.9991L20.4018 15.4978L24.7325 17.9975V22.9985L20.4018 25.4983L16.071 22.9985V17.9991Z" fill="currentColor"></path>
        </symbol>
    </svg>
    <div class="conversation">
        <div class="conversation-header">
            <h1>
                <a href="{{source}}" target="_blank" rel="noopener noreferrer">{{title}}</a>
                <button class="toggle">
                    <svg class="sun" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                    <svg class="moon" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                </button>
            </h1>
            <div class="conversation-export">
                <p>Exported by
                <a href="https://github.com/pionxzh/chatgpt-exporter">ChatGPT Exporter</a>
                at {{time}}</p>
            </div>
        </div>

        {{content}}
    </div>


    <script>
        function toggleDarkMode(mode) {
            const html = document.querySelector('html')
            const isDarkMode = html.getAttribute('data-theme') === 'dark'
            const newMode = mode || (isDarkMode ? 'light' : 'dark')
            if (newMode !== 'dark' && newMode !== 'light') return
            html.setAttribute('data-theme', newMode)

            const url = new URL(window.location)
            url.searchParams.set('theme', newMode)
            window.history.replaceState({}, '', url)
        }

        // Support for ?theme=dark
        const urlParams = new URLSearchParams(window.location.search)
        const theme = urlParams.get('theme')
        if (theme) toggleDarkMode(theme)

        document.querySelector('.toggle').addEventListener('click', () => toggleDarkMode())
    <\/script>
</body>

</html>
`;
  async function exportToHtml(fileNameFormat) {
    if (!checkIfConversationStarted()) {
      alert("Please start a conversation first.");
      return false;
    }
    const {
      id,
      title,
      conversations
    } = await getConversations();
    const userAvatar = await getUserAvatar();
    const conversationHtml = conversations.map((item) => {
      var _a, _b, _c;
      const author = ((_a = item.message) == null ? void 0 : _a.author.role) === "assistant" ? "ChatGPT" : "You";
      const avatarEl = author === "ChatGPT" ? '<svg width="41" height="41"><use xlink:href="#chatgpt" /></svg>' : `<img alt="${author}" />`;
      const content2 = ((_b = item.message) == null ? void 0 : _b.content.parts.join("\n")) ?? "";
      let conversationContent = content2;
      if (author === "ChatGPT") {
        const root2 = fromMarkdown(content2);
        conversationContent = toHtml(root2);
      }
      const timestamp2 = ((_c = item.message) == null ? void 0 : _c.create_time) ?? "";
      let conversationDate = "";
      let conversationTime = "";
      if (timestamp2) {
        const date2 = new Date(timestamp2 * 1e3);
        const isoStr = date2.toISOString();
        conversationDate = `${isoStr.split("T")[0]} ${isoStr.split("T")[1].split(".")[0]} UTC`;
        conversationTime = date2.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit"
        });
      }
      return `
<div class="conversation-item">
    <div class="author">
        ${avatarEl}
    </div>
    <div class="conversation-content-wrapper">
        <div class="conversation-content">
            ${conversationContent}
        </div>
    </div>
    ${timestamp2 ? `<div class="time" title="${conversationDate}">${conversationTime}</div>` : ""}
</div>`;
    }).join("\n\n");
    const date = dateStr();
    const time2 = new Date().toISOString();
    const source = `${baseUrl}/chat/${id}`;
    const lang = document.documentElement.lang ?? "en";
    const theme = getColorScheme();
    const html2 = templateHtml.replaceAll("{{title}}", title).replaceAll("{{date}}", date).replaceAll("{{time}}", time2).replaceAll("{{source}}", source).replaceAll("{{lang}}", lang).replaceAll("{{theme}}", theme).replaceAll("{{avatar}}", userAvatar).replaceAll("{{content}}", conversationHtml);
    const fileName = getFileNameWithFormat(fileNameFormat, "html");
    downloadFile(fileName, "text/html", standardizeLineBreaks(html2));
    return true;
  }
  function useGMStorage(key2, initialValue) {
    const [storedValue, setStoredValue] = p$1(() => {
      if (typeof window === "undefined") {
        return initialValue;
      }
      try {
        return GM_getValue(key2, initialValue);
      } catch (error) {
        try {
          const item = window.localStorage.getItem(key2);
          return item ?? initialValue;
        } catch (error2) {
          console.log(error2);
          return initialValue;
        }
      }
    });
    const setValue = (value2) => {
      setStoredValue(value2);
      try {
        GM_setValue(key2, value2);
      } catch (error) {
        try {
          if (typeof window !== "undefined") {
            window.localStorage.setItem(key2, JSON.stringify(value2));
          }
        } catch (error2) {
          console.log(error2);
        }
      }
    };
    return [storedValue, setValue];
  }
  var _ = 0;
  function o(o2, e2, n2, t2, f2, l2) {
    var s2, u2, a2 = {};
    for (u2 in e2)
      "ref" == u2 ? s2 = e2[u2] : a2[u2] = e2[u2];
    var i2 = { type: o2, props: a2, key: n2, ref: s2, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, __h: null, constructor: void 0, __v: --_, __source: f2, __self: l2 };
    if ("function" == typeof o2 && (s2 = o2.defaultProps))
      for (u2 in s2)
        void 0 === a2[u2] && (a2[u2] = s2[u2]);
    return l$1.vnode && l$1.vnode(i2), i2;
  }
  function FileCode() {
    return o("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 384 512",
      className: "w-4 h-4",
      fill: "currentColor",
      children: o("path", {
        d: "M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM153 289l-31 31 31 31c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L71 337c-9.4-9.4-9.4-24.6 0-33.9l48-48c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9zM265 255l48 48c9.4 9.4 9.4 24.6 0 33.9l-48 48c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l31-31-31-31c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0z"
      })
    });
  }
  function IconCamera() {
    return o("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 512 512",
      className: "w-4 h-4",
      fill: "currentColor",
      children: o("path", {
        d: "M149.1 64.8L138.7 96H64C28.7 96 0 124.7 0 160V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H373.3L362.9 64.8C356.4 45.2 338.1 32 317.4 32H194.6c-20.7 0-39 13.2-45.5 32.8zM256 384c-53 0-96-43-96-96s43-96 96-96s96 43 96 96s-43 96-96 96z"
      })
    });
  }
  function IconMarkdown() {
    return o("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 640 512",
      className: "w-4 h-4",
      fill: "currentColor",
      children: o("path", {
        d: "M593.8 59.1H46.2C20.7 59.1 0 79.8 0 105.2v301.5c0 25.5 20.7 46.2 46.2 46.2h547.7c25.5 0 46.2-20.7 46.1-46.1V105.2c0-25.4-20.7-46.1-46.2-46.1zM338.5 360.6H277v-120l-61.5 76.9-61.5-76.9v120H92.3V151.4h61.5l61.5 76.9 61.5-76.9h61.5v209.2zm135.3 3.1L381.5 256H443V151.4h61.5V256H566z"
      })
    });
  }
  function IconCopy() {
    return o("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 512 512",
      className: "w-4 h-4",
      fill: "currentColor",
      children: o("path", {
        d: "M502.6 70.63l-61.25-61.25C435.4 3.371 427.2 0 418.7 0H255.1c-35.35 0-64 28.66-64 64l.0195 256C192 355.4 220.7 384 256 384h192c35.2 0 64-28.8 64-64V93.25C512 84.77 508.6 76.63 502.6 70.63zM464 320c0 8.836-7.164 16-16 16H255.1c-8.838 0-16-7.164-16-16L239.1 64.13c0-8.836 7.164-16 16-16h128L384 96c0 17.67 14.33 32 32 32h47.1V320zM272 448c0 8.836-7.164 16-16 16H63.1c-8.838 0-16-7.164-16-16L47.98 192.1c0-8.836 7.164-16 16-16H160V128H63.99c-35.35 0-64 28.65-64 64l.0098 256C.002 483.3 28.66 512 64 512h192c35.2 0 64-28.8 64-64v-32h-47.1L272 448z"
      })
    });
  }
  function IconArrowRightFromBracket() {
    return o("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 576 512",
      className: "w-4 h-4",
      fill: "currentColor",
      children: o("path", {
        d: "M534.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L434.7 224 224 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM192 96c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-53 0-96 43-96 96l0 256c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z"
      })
    });
  }
  function IconSetting() {
    return o(GearIcon, {
      width: "1rem",
      height: "1rem",
      stroke: "currentColor",
      "stroke-width": "0.5"
    });
  }
  function IconLoading() {
    return o("span", {
      style: {
        animation: "1.4s linear 0s infinite normal none running rotate"
      },
      children: o("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "22 22 44 44",
        className: "w-4 h-4",
        style: {
          animation: "1.4s ease-in-out 0s infinite normal none running circularDash"
        },
        fill: "none",
        stroke: "currentColor",
        "stroke-width": "2",
        children: o("circle", {
          cx: "44",
          cy: "44",
          r: "20.2",
          fill: "none",
          stroke: "currentColor",
          "stroke-width": "3.6"
        })
      })
    });
  }
  const TIMEOUT = 2500;
  const MenuItem = ({
    text: text2,
    successText,
    disabled = false,
    icon: Icon,
    onClick
  }) => {
    const [loading, setLoading] = p$1(false);
    const [succeed, setSucceed] = p$1(false);
    const handleClick = typeof onClick === "function" ? async () => {
      try {
        setLoading(true);
        const result = await onClick();
        if (result) {
          setSucceed(true);
          setTimeout(() => setSucceed(false), TIMEOUT);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    } : void 0;
    return o("div", {
      className: "menu-item flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20",
      onClick: handleClick,
      disabled,
      children: loading ? o("div", {
        className: "flex justify-center items-center w-full h-full",
        children: o(IconLoading, {})
      }) : o(_$2, {
        children: [Icon && o(Icon, {}), succeed && successText ? successText : text2]
      })
    });
  };
  const Divider = () => o("div", {
    className: "border-b border-white/20"
  });
  const Dropdown = ({
    children
  }) => {
    return o(_$2, {
      children: [o("div", {
        className: "dropdown-backdrop"
      }), o("div", {
        className: "dropdown-menu bg-gray-900",
        children
      })]
    });
  };
  function useTitle() {
    const title = _n(subscribe, getSnapshot);
    return title;
  }
  function subscribe(callback) {
    const target = document.querySelector("title");
    if (!target)
      return noop;
    const observer = new MutationObserver(callback);
    const config = {
      subtree: true,
      characterData: true,
      childList: true
    };
    observer.observe(target, config);
    return () => observer.disconnect();
  }
  function getSnapshot() {
    return document.title;
  }
  const style = "";
  const dialog = "";
  const KEY = "exporter-format";
  const defaultFormat = "ChatGPT-{title}";
  const SettingDialog = ({
    format: format2,
    setFormat,
    children
  }) => {
    const handleChange = (e2) => {
      setFormat(e2.currentTarget.value);
    };
    const _title = useTitle();
    const title = sanitizeFilename(_title).replace(/\s+/g, "_");
    const preview = getFileNameWithFormat(format2, "{ext}", {
      title
    });
    return o($5d3850c4d0b4e6c7$export$be92b6f5f03c0fe9, {
      children: [o($5d3850c4d0b4e6c7$export$41fb9f06171c75f4, {
        asChild: true,
        children
      }), o($5d3850c4d0b4e6c7$export$602eac185826482c, {
        children: [o($5d3850c4d0b4e6c7$export$c6fdb837b070b4ff, {
          className: "DialogOverlay"
        }), o($5d3850c4d0b4e6c7$export$7c6e2c02157bb7d2, {
          className: "DialogContent",
          children: [o($5d3850c4d0b4e6c7$export$f99233281efd08a0, {
            className: "DialogTitle",
            children: "Exporter Setting"
          }), o("div", {
            className: "Description",
            children: ["Available variables: ", o("span", {
              className: "cursor-help select-all",
              title,
              children: "{title}"
            }), ", ", o("span", {
              className: "cursor-help select-all",
              title: dateStr(),
              children: "{date}"
            }), ", ", o("span", {
              className: "cursor-help select-all",
              title: timestamp(),
              children: "{timestamp}"
            })]
          }), o("fieldset", {
            className: "Fieldset",
            children: [o("label", {
              className: "Label",
              htmlFor: "filename",
              children: "File Name"
            }), o("input", {
              className: "Input",
              id: "filename",
              value: format2,
              onChange: handleChange
            })]
          }), o("div", {
            className: "Description",
            children: ["Preview: ", o("span", {
              className: "select-all",
              style: {
                "text-decoration": "underline",
                "text-underline-offset": 4
              },
              children: preview
            })]
          }), o("div", {
            className: "flex mt-6",
            style: {
              justifyContent: "flex-end"
            },
            children: o($5d3850c4d0b4e6c7$export$f39c2d165cd861fe, {
              asChild: true,
              children: o("button", {
                className: "Button green",
                children: "Save"
              })
            })
          }), o($5d3850c4d0b4e6c7$export$f39c2d165cd861fe, {
            asChild: true,
            children: o("button", {
              className: "IconButton",
              "aria-label": "Close",
              children: o(Cross2Icon, {})
            })
          })]
        })]
      })]
    });
  };
  function Menu() {
    const disabled = getHistoryDisabled();
    const menuText = disabled ? "Exporter unavailable" : "Export";
    const menuTitle = disabled ? "Exporter is relying on the History API.\nBut History feature is disabled by OpenAI temporarily.\nWe all have to wait for them to bring it back." : "";
    const [format2, setFormat] = useGMStorage(KEY, defaultFormat);
    const onClickText = T$2(() => exportToText(), []);
    const onClickPng = T$2(() => exportToPng(format2), [format2]);
    const onClickMarkdown = T$2(() => exportToMarkdown(format2), [format2]);
    const onClickHtml = T$2(() => exportToHtml(format2), [format2]);
    return o("div", {
      id: "exporter-menu",
      className: "pt-1 relative",
      disabled,
      title: menuTitle,
      children: [o(MenuItem, {
        text: menuText,
        icon: IconArrowRightFromBracket,
        disabled
      }), o(Dropdown, {
        children: [o(SettingDialog, {
          format: format2,
          setFormat,
          children: o("div", {
            children: o(MenuItem, {
              text: "Setting",
              icon: IconSetting
            })
          })
        }), o(MenuItem, {
          text: "Copy Text",
          successText: "Copied!",
          icon: IconCopy,
          onClick: onClickText
        }), o(MenuItem, {
          text: "Screenshot",
          icon: IconCamera,
          onClick: onClickPng
        }), o(MenuItem, {
          text: "Markdown",
          icon: IconMarkdown,
          onClick: onClickMarkdown
        }), o(MenuItem, {
          text: "WebPage (HTML)",
          icon: FileCode,
          onClick: onClickHtml
        })]
      }), o(Divider, {})]
    });
  }
  main();
  function main() {
    onloadSafe(() => {
      const container = document.createElement("div");
      D$1(o(Menu, {}), container);
      sentinel.on("nav", (nav) => {
        const chatList = document.querySelector("nav > div.overflow-y-auto");
        if (chatList) {
          chatList.after(container);
        } else {
          nav.append(container);
        }
      });
      const imageMap = /* @__PURE__ */ new Map();
      sentinel.on("img", (img) => {
        const src = img.src;
        if (src.startsWith("https://source.unsplash.com/")) {
          if (imageMap.has(src)) {
            img.src = imageMap.get(src);
            return;
          }
          const xhr = new XMLHttpRequest();
          xhr.open("HEAD", src, true);
          xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
              const finalUrl = xhr.responseURL;
              img.src = finalUrl;
              img.originalSrc = src;
              imageMap.set(src, finalUrl);
            }
          };
          xhr.send();
        }
      });
    });
  }
})();
