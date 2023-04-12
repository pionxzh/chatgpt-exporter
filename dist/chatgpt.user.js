// ==UserScript==
// @name               ChatGPT Exporter
// @name:zh-CN         ChatGPT Exporter
// @name:zh-TW         ChatGPT Exporter
// @namespace          pionxzh
// @version            2.6.2
// @author             pionxzh
// @description        Easily export the whole ChatGPT conversation history for further analysis or sharing.
// @description:zh-CN  轻松导出 ChatGPT 聊天记录，以便进一步分析或分享。
// @description:zh-TW  輕鬆匯出 ChatGPT 聊天紀錄，以便進一步分析或分享。
// @license            MIT
// @icon               https://chat.openai.com/favicon.ico
// @match              https://chat.openai.com/chat
// @match              https://chat.openai.com/chat?*
// @match              https://chat.openai.com/chat/*
// @require            https://cdn.jsdelivr.net/npm/jszip@3.9.1/dist/jszip.min.js
// @require            https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js
// @grant              GM_deleteValue
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              unsafeWindow
// @run-at             document-end
// ==/UserScript==

(e=>{const n=document.createElement("style");n.dataset.source="vite-plugin-monkey",n.innerText=e,document.head.appendChild(n)})(` .CheckBoxLabel {
    position: relative;
    display: flex;
    font-size: 16px;
    vertical-align: middle;
}

.CheckBoxLabel * {
    cursor: pointer;
}

.CheckBoxLabel[disabled] {
    opacity: 0.7;
}

.CheckBoxLabel[disabled] * {
    cursor: not-allowed;
}

.CheckBoxLabel input {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    margin: 0;
    padding: 0;
}

.CheckBoxLabel .IconWrapper {
    display: inline-flex;
    align-items: center;
    position: relative;
    vertical-align: middle;
    font-size: 1.5rem;
}

.CheckBoxLabel input:checked ~ svg {
    color: rgb(28 100 242);
}

.dark .CheckBoxLabel input:checked ~ svg {
    color: rgb(144, 202, 249);
}

.CheckBoxLabel .LabelText {
    margin-left: 0.5rem;
    font-size: 1rem;
    line-height: 1.5;
}
img[src*="https://source.unsplash.com/"] {
    visibility: hidden;
}

/* hide the flickering */
p > img[src*="https://images.unsplash.com/"] {
    animation: fadeIn .3s;
}

span[data-time-format] {
    display: none;
}

body[data-time-format="12"] span[data-time-format="12"] {
    display: inline;
}

body[data-time-format="24"] span[data-time-format="24"] {
    display: inline;
}

.Select {
    padding: 0 0 0 0.5rem;
    width: 7.5rem;
    border-radius: 4px;
    box-shadow: 0 0 0 1px #6f6e77;
}

.dark .Select {
    background-color: #2f2f2f;
    color: #fff;
    box-shadow: 0 0 0 1px #6f6e77;
}

.menu-item {
    height: 46px;
}

.menu-item[disabled] {
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

.row-half {
    grid-column: auto / span 1;
}

.row-full {
    grid-column: auto / span 2;
}

.dropdown-backdrop {
    display: block;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0,0,0,.5);
    animation-name: pointerFadeIn;
    animation-duration: .3s;
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
    background-color: #f3f3f3;
    border-radius: 6px;
    box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90vw;
    max-width: 560px;
    max-height: 85vh;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 16px 24px;
    z-index: 1001;
    animation: contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
}

.dark .DialogContent {
    background-color: #2a2a2a;
    border-color: #40414f;
    border-width: 1px;
}

.DialogContent input[type="checkbox"] {
    border: none;
    outline: none;
    box-shadow: none;
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
.Button.red {
    background-color: #f9d9d9;
    color: #a71d2a;
}
.Button.green:hover {
    background-color: #ccebd7;
}
.Button:disabled {
    opacity: 0.5;
    color: #6f6e77;
    background-color: #e0e0e0;
    cursor: not-allowed;
}
.Button:disabled:hover {
    background-color: #e0e0e0;
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
}
.IconButton:hover {
    background-color: rgba(0, 0, 0, 0.06);
}

.CloseButton {
    position: absolute;
    top: 10px;
    right: 10px;
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
    min-width: 90px;
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
    color: #000;
    background-color: #fafafa;
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

.SelectToolbar {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-radius: 4px 4px 0 0;
    border: 1px solid #6f6e77;
    border-bottom: none;
}

.SelectList {
    position: relative;
    width: 100%;
    height: 300px;
    padding: 12px 16px;
    overflow-x: hidden;
    overflow-y: auto;
    border: 1px solid #6f6e77;
    border-radius: 0 0 4px 4px;
    white-space: nowrap;
}

.SelectItem {
    overflow: hidden;
    text-overflow: ellipsis;
}

.SelectItem label, .SelectItem input {
    cursor: pointer;
}

.SelectItem span {
    vertical-align: middle;
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
.invisible + .secondary-toolbar {
    display: none;
}
.after\\:content-\\[\\'\\'\\]:after {
    --tw-content: "";
    content: var(--tw-content);
}

.after\\:transition-all:after {
    content: var(--tw-content);
    transition-duration: .15s;
    transition-property: all;
    transition-timing-function: cubic-bezier(.4,0,.2,1);
}

.after\\:bg-white:after {
    --tw-bg-opacity: 1;
    background-color: rgb(255 255 255/var(--tw-bg-opacity));
    content: var(--tw-content);
}

.after\\:border-gray-300:after {
    --tw-border-opacity: 1;
    border-color: rgb(209 213 219/var(--tw-border-opacity));
    content: var(--tw-content);
}

.after\\:border:after {
    border-width: 1px;
    content: var(--tw-content);
}

.after\\:rounded-full:after {
    border-radius: 9999px;

    content: var(--tw-content);
}
.after\\:w-4:after {
    content: var(--tw-content);
    width: 1rem
}

.after\\:h-4:after {
    content: var(--tw-content);
    height: 1rem;
}

.after\\:top-\\[2px\\]:after {
    content: var(--tw-content);
    top: 2px;
}

.after\\:left-\\[2px\\]:after {
    content: var(--tw-content);
    left: 2px;
}

.after\\:absolute:after {
    content: var(--tw-content);
    position: absolute;
}

.animate-fadeIn  {
    animation: fadeIn .3s;
}

.animate-slideUp  {
    animation: slideUp .3s;
}

.bg-blue-600 {
    --tw-bg-opacity: 1;
    background-color: rgb(28 100 242/var(--tw-bg-opacity));
}

.border-\\[\\#6f6e77\\] {
    border-color: #6f6e77;
}

.cursor-help {
    cursor: help;
}

.dark .dark\\:bg-white\\/5 {
    --tw-bg-opacity: 1;
    background-color: rgb(255 255 255 / 5%);
}

.dark .dark\\:border-gray-\\[\\#86858d\\] {
    border-color: #86858d;
}

.dark .dark\\:border-gray-600 {
    --tw-border-opacity: 1;
    border-color: rgb(75 85 99/var(--tw-border-opacity));
}

.empty\\:hidden:empty {
    display: none;
}

.fill-current {
    fill: currentColor;
}

.gap-x-1	 {
    column-gap: 0.25rem;
}

.h-2\\.5 {
    height: 0.625rem;
}

.h-4 {
    height: 1rem;
}

.h-5 {
    height: 1.25rem;
}

.mr-8 {
    margin-right: 2rem;
}

.pb-0 {
    padding-bottom: 0;
}

.peer:checked~.peer-checked\\:bg-blue-600 {
    --tw-bg-opacity: 1;
    background-color: rgb(28 100 242/var(--tw-bg-opacity));
}

.peer:checked~.peer-checked\\:after\\:border-white:after {
    --tw-border-opacity: 1;
    border-color: rgb(255 255 255/var(--tw-border-opacity));
    content: var(--tw-content);
}
.peer:checked~.peer-checked\\:after\\:translate-x-full:after {
    --tw-translate-x: 100%;
    content: var(--tw-content);
    transform: translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.pl-4 {
    padding-left: 1rem;
}

.pr-8 {
    padding-right: 2rem;
}

.rounded-full {
    border-radius: 9999px;
}

.select-all {
    user-select: all!important;
}

.space-y-6>:not([hidden])~:not([hidden]) {
    --tw-space-y-reverse: 0;
    margin-top: calc(1.5rem * calc(1 - var(--tw-space-y-reverse)));
    margin-bottom: calc(1.5rem * var(--tw-space-y-reverse));
}

.truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.w-9 {
    width: 2.25rem;
}

.whitespace-nowrap {
    white-space: nowrap;
}

@media (min-width:768px) {
    /* md */
}

@media (min-width:1024px) {
    .lg\\:mt-0 {
        margin-top: 0;
    }

    .lg\\:top-8 {
        top: 2rem;
    }
}
 `);

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
(function(JSZip2, html2canvas2) {
  "use strict";
  var n$2, l$3, u$3, t$2, r$3, o$4, f$3, e$2, c$3 = {}, s$3 = [], a$3 = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
  function h$3(n2, l2) {
    for (var u2 in l2)
      n2[u2] = l2[u2];
    return n2;
  }
  function v$2(n2) {
    var l2 = n2.parentNode;
    l2 && l2.removeChild(n2);
  }
  function y$3(l2, u2, i2) {
    var t2, r2, o2, f2 = {};
    for (o2 in u2)
      "key" == o2 ? t2 = u2[o2] : "ref" == o2 ? r2 = u2[o2] : f2[o2] = u2[o2];
    if (arguments.length > 2 && (f2.children = arguments.length > 3 ? n$2.call(arguments, 2) : i2), "function" == typeof l2 && null != l2.defaultProps)
      for (o2 in l2.defaultProps)
        void 0 === f2[o2] && (f2[o2] = l2.defaultProps[o2]);
    return p$4(l2, f2, t2, r2, null);
  }
  function p$4(n2, i2, t2, r2, o2) {
    var f2 = { type: n2, props: i2, key: t2, ref: r2, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, __h: null, constructor: void 0, __v: null == o2 ? ++u$3 : o2 };
    return null == o2 && null != l$3.vnode && l$3.vnode(f2), f2;
  }
  function d$3() {
    return { current: null };
  }
  function _$2(n2) {
    return n2.children;
  }
  function k$3(n2, l2) {
    this.props = n2, this.context = l2;
  }
  function b$3(n2, l2) {
    if (null == l2)
      return n2.__ ? b$3(n2.__, n2.__.__k.indexOf(n2) + 1) : null;
    for (var u2; l2 < n2.__k.length; l2++)
      if (null != (u2 = n2.__k[l2]) && null != u2.__e)
        return u2.__e;
    return "function" == typeof n2.type ? b$3(n2) : null;
  }
  function g$4(n2) {
    var l2, u2;
    if (null != (n2 = n2.__) && null != n2.__c) {
      for (n2.__e = n2.__c.base = null, l2 = 0; l2 < n2.__k.length; l2++)
        if (null != (u2 = n2.__k[l2]) && null != u2.__e) {
          n2.__e = n2.__c.base = u2.__e;
          break;
        }
      return g$4(n2);
    }
  }
  function m$3(n2) {
    (!n2.__d && (n2.__d = true) && t$2.push(n2) && !w$3.__r++ || r$3 !== l$3.debounceRendering) && ((r$3 = l$3.debounceRendering) || o$4)(w$3);
  }
  function w$3() {
    var n2, l2, u2, i2, r2, o2, e2, c2;
    for (t$2.sort(f$3); n2 = t$2.shift(); )
      n2.__d && (l2 = t$2.length, i2 = void 0, r2 = void 0, e2 = (o2 = (u2 = n2).__v).__e, (c2 = u2.__P) && (i2 = [], (r2 = h$3({}, o2)).__v = o2.__v + 1, L$3(c2, o2, r2, u2.__n, void 0 !== c2.ownerSVGElement, null != o2.__h ? [e2] : null, i2, null == e2 ? b$3(o2) : e2, o2.__h), M$1(i2, o2), o2.__e != e2 && g$4(o2)), t$2.length > l2 && t$2.sort(f$3));
    w$3.__r = 0;
  }
  function x$4(n2, l2, u2, i2, t2, r2, o2, f2, e2, a2) {
    var h2, v2, y2, d2, k2, g2, m2, w2 = i2 && i2.__k || s$3, x2 = w2.length;
    for (u2.__k = [], h2 = 0; h2 < l2.length; h2++)
      if (null != (d2 = u2.__k[h2] = null == (d2 = l2[h2]) || "boolean" == typeof d2 || "function" == typeof d2 ? null : "string" == typeof d2 || "number" == typeof d2 || "bigint" == typeof d2 ? p$4(null, d2, null, null, d2) : Array.isArray(d2) ? p$4(_$2, { children: d2 }, null, null, null) : d2.__b > 0 ? p$4(d2.type, d2.props, d2.key, d2.ref ? d2.ref : null, d2.__v) : d2)) {
        if (d2.__ = u2, d2.__b = u2.__b + 1, null === (y2 = w2[h2]) || y2 && d2.key == y2.key && d2.type === y2.type)
          w2[h2] = void 0;
        else
          for (v2 = 0; v2 < x2; v2++) {
            if ((y2 = w2[v2]) && d2.key == y2.key && d2.type === y2.type) {
              w2[v2] = void 0;
              break;
            }
            y2 = null;
          }
        L$3(n2, d2, y2 = y2 || c$3, t2, r2, o2, f2, e2, a2), k2 = d2.__e, (v2 = d2.ref) && y2.ref != v2 && (m2 || (m2 = []), y2.ref && m2.push(y2.ref, null, d2), m2.push(v2, d2.__c || k2, d2)), null != k2 ? (null == g2 && (g2 = k2), "function" == typeof d2.type && d2.__k === y2.__k ? d2.__d = e2 = A$3(d2, e2, n2) : e2 = C$2(n2, d2, y2, w2, k2, e2), "function" == typeof u2.type && (u2.__d = e2)) : e2 && y2.__e == e2 && e2.parentNode != n2 && (e2 = b$3(y2));
      }
    for (u2.__e = g2, h2 = x2; h2--; )
      null != w2[h2] && ("function" == typeof u2.type && null != w2[h2].__e && w2[h2].__e == u2.__d && (u2.__d = $$1(i2).nextSibling), S$1(w2[h2], w2[h2]));
    if (m2)
      for (h2 = 0; h2 < m2.length; h2++)
        O$2(m2[h2], m2[++h2], m2[++h2]);
  }
  function A$3(n2, l2, u2) {
    for (var i2, t2 = n2.__k, r2 = 0; t2 && r2 < t2.length; r2++)
      (i2 = t2[r2]) && (i2.__ = n2, l2 = "function" == typeof i2.type ? A$3(i2, l2, u2) : C$2(u2, i2, i2, t2, i2.__e, l2));
    return l2;
  }
  function P$3(n2, l2) {
    return l2 = l2 || [], null == n2 || "boolean" == typeof n2 || (Array.isArray(n2) ? n2.some(function(n3) {
      P$3(n3, l2);
    }) : l2.push(n2)), l2;
  }
  function C$2(n2, l2, u2, i2, t2, r2) {
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
  function $$1(n2) {
    var l2, u2, i2;
    if (null == n2.type || "string" == typeof n2.type)
      return n2.__e;
    if (n2.__k) {
      for (l2 = n2.__k.length - 1; l2 >= 0; l2--)
        if ((u2 = n2.__k[l2]) && (i2 = $$1(u2)))
          return i2;
    }
    return null;
  }
  function H$2(n2, l2, u2, i2, t2) {
    var r2;
    for (r2 in u2)
      "children" === r2 || "key" === r2 || r2 in l2 || T$4(n2, r2, null, u2[r2], i2);
    for (r2 in l2)
      t2 && "function" != typeof l2[r2] || "children" === r2 || "key" === r2 || "value" === r2 || "checked" === r2 || u2[r2] === l2[r2] || T$4(n2, r2, l2[r2], u2[r2], i2);
  }
  function I$1(n2, l2, u2) {
    "-" === l2[0] ? n2.setProperty(l2, null == u2 ? "" : u2) : n2[l2] = null == u2 ? "" : "number" != typeof u2 || a$3.test(l2) ? u2 : u2 + "px";
  }
  function T$4(n2, l2, u2, i2, t2) {
    var r2;
    n:
      if ("style" === l2)
        if ("string" == typeof u2)
          n2.style.cssText = u2;
        else {
          if ("string" == typeof i2 && (n2.style.cssText = i2 = ""), i2)
            for (l2 in i2)
              u2 && l2 in u2 || I$1(n2.style, l2, "");
          if (u2)
            for (l2 in u2)
              i2 && u2[l2] === i2[l2] || I$1(n2.style, l2, u2[l2]);
        }
      else if ("o" === l2[0] && "n" === l2[1])
        r2 = l2 !== (l2 = l2.replace(/Capture$/, "")), l2 = l2.toLowerCase() in n2 ? l2.toLowerCase().slice(2) : l2.slice(2), n2.l || (n2.l = {}), n2.l[l2 + r2] = u2, u2 ? i2 || n2.addEventListener(l2, r2 ? z$3 : j$2, r2) : n2.removeEventListener(l2, r2 ? z$3 : j$2, r2);
      else if ("dangerouslySetInnerHTML" !== l2) {
        if (t2)
          l2 = l2.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
        else if ("width" !== l2 && "height" !== l2 && "href" !== l2 && "list" !== l2 && "form" !== l2 && "tabIndex" !== l2 && "download" !== l2 && l2 in n2)
          try {
            n2[l2] = null == u2 ? "" : u2;
            break n;
          } catch (n3) {
          }
        "function" == typeof u2 || (null == u2 || false === u2 && "-" !== l2[4] ? n2.removeAttribute(l2) : n2.setAttribute(l2, u2));
      }
  }
  function j$2(n2) {
    return this.l[n2.type + false](l$3.event ? l$3.event(n2) : n2);
  }
  function z$3(n2) {
    return this.l[n2.type + true](l$3.event ? l$3.event(n2) : n2);
  }
  function L$3(n2, u2, i2, t2, r2, o2, f2, e2, c2) {
    var s2, a2, v2, y2, p2, d2, b2, g2, m2, w2, A2, P2, C2, $2, H2, I2 = u2.type;
    if (void 0 !== u2.constructor)
      return null;
    null != i2.__h && (c2 = i2.__h, e2 = u2.__e = i2.__e, u2.__h = null, o2 = [e2]), (s2 = l$3.__b) && s2(u2);
    try {
      n:
        if ("function" == typeof I2) {
          if (g2 = u2.props, m2 = (s2 = I2.contextType) && t2[s2.__c], w2 = s2 ? m2 ? m2.props.value : s2.__ : t2, i2.__c ? b2 = (a2 = u2.__c = i2.__c).__ = a2.__E : ("prototype" in I2 && I2.prototype.render ? u2.__c = a2 = new I2(g2, w2) : (u2.__c = a2 = new k$3(g2, w2), a2.constructor = I2, a2.render = q$2), m2 && m2.sub(a2), a2.props = g2, a2.state || (a2.state = {}), a2.context = w2, a2.__n = t2, v2 = a2.__d = true, a2.__h = [], a2._sb = []), null == a2.__s && (a2.__s = a2.state), null != I2.getDerivedStateFromProps && (a2.__s == a2.state && (a2.__s = h$3({}, a2.__s)), h$3(a2.__s, I2.getDerivedStateFromProps(g2, a2.__s))), y2 = a2.props, p2 = a2.state, a2.__v = u2, v2)
            null == I2.getDerivedStateFromProps && null != a2.componentWillMount && a2.componentWillMount(), null != a2.componentDidMount && a2.__h.push(a2.componentDidMount);
          else {
            if (null == I2.getDerivedStateFromProps && g2 !== y2 && null != a2.componentWillReceiveProps && a2.componentWillReceiveProps(g2, w2), !a2.__e && null != a2.shouldComponentUpdate && false === a2.shouldComponentUpdate(g2, a2.__s, w2) || u2.__v === i2.__v) {
              for (u2.__v !== i2.__v && (a2.props = g2, a2.state = a2.__s, a2.__d = false), a2.__e = false, u2.__e = i2.__e, u2.__k = i2.__k, u2.__k.forEach(function(n3) {
                n3 && (n3.__ = u2);
              }), A2 = 0; A2 < a2._sb.length; A2++)
                a2.__h.push(a2._sb[A2]);
              a2._sb = [], a2.__h.length && f2.push(a2);
              break n;
            }
            null != a2.componentWillUpdate && a2.componentWillUpdate(g2, a2.__s, w2), null != a2.componentDidUpdate && a2.__h.push(function() {
              a2.componentDidUpdate(y2, p2, d2);
            });
          }
          if (a2.context = w2, a2.props = g2, a2.__P = n2, P2 = l$3.__r, C2 = 0, "prototype" in I2 && I2.prototype.render) {
            for (a2.state = a2.__s, a2.__d = false, P2 && P2(u2), s2 = a2.render(a2.props, a2.state, a2.context), $2 = 0; $2 < a2._sb.length; $2++)
              a2.__h.push(a2._sb[$2]);
            a2._sb = [];
          } else
            do {
              a2.__d = false, P2 && P2(u2), s2 = a2.render(a2.props, a2.state, a2.context), a2.state = a2.__s;
            } while (a2.__d && ++C2 < 25);
          a2.state = a2.__s, null != a2.getChildContext && (t2 = h$3(h$3({}, t2), a2.getChildContext())), v2 || null == a2.getSnapshotBeforeUpdate || (d2 = a2.getSnapshotBeforeUpdate(y2, p2)), H2 = null != s2 && s2.type === _$2 && null == s2.key ? s2.props.children : s2, x$4(n2, Array.isArray(H2) ? H2 : [H2], u2, i2, t2, r2, o2, f2, e2, c2), a2.base = u2.__e, u2.__h = null, a2.__h.length && f2.push(a2), b2 && (a2.__E = a2.__ = null), a2.__e = false;
        } else
          null == o2 && u2.__v === i2.__v ? (u2.__k = i2.__k, u2.__e = i2.__e) : u2.__e = N$2(i2.__e, u2, i2, t2, r2, o2, f2, c2);
      (s2 = l$3.diffed) && s2(u2);
    } catch (n3) {
      u2.__v = null, (c2 || null != o2) && (u2.__e = e2, u2.__h = !!c2, o2[o2.indexOf(e2)] = null), l$3.__e(n3, u2, i2);
    }
  }
  function M$1(n2, u2) {
    l$3.__c && l$3.__c(u2, n2), n2.some(function(u3) {
      try {
        n2 = u3.__h, u3.__h = [], n2.some(function(n3) {
          n3.call(u3);
        });
      } catch (n3) {
        l$3.__e(n3, u3.__v);
      }
    });
  }
  function N$2(l2, u2, i2, t2, r2, o2, f2, e2) {
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
      if (o2 = o2 && n$2.call(l2.childNodes), a2 = (y2 = i2.props || c$3).dangerouslySetInnerHTML, h2 = p2.dangerouslySetInnerHTML, !e2) {
        if (null != o2)
          for (y2 = {}, _2 = 0; _2 < l2.attributes.length; _2++)
            y2[l2.attributes[_2].name] = l2.attributes[_2].value;
        (h2 || a2) && (h2 && (a2 && h2.__html == a2.__html || h2.__html === l2.innerHTML) || (l2.innerHTML = h2 && h2.__html || ""));
      }
      if (H$2(l2, p2, y2, r2, e2), h2)
        u2.__k = [];
      else if (_2 = u2.props.children, x$4(l2, Array.isArray(_2) ? _2 : [_2], u2, i2, t2, r2 && "foreignObject" !== d2, o2, f2, o2 ? o2[0] : i2.__k && b$3(i2, 0), e2), null != o2)
        for (_2 = o2.length; _2--; )
          null != o2[_2] && v$2(o2[_2]);
      e2 || ("value" in p2 && void 0 !== (_2 = p2.value) && (_2 !== l2.value || "progress" === d2 && !_2 || "option" === d2 && _2 !== y2.value) && T$4(l2, "value", _2, y2.value, false), "checked" in p2 && void 0 !== (_2 = p2.checked) && _2 !== l2.checked && T$4(l2, "checked", _2, y2.checked, false));
    }
    return l2;
  }
  function O$2(n2, u2, i2) {
    try {
      "function" == typeof n2 ? n2(u2) : n2.current = u2;
    } catch (n3) {
      l$3.__e(n3, i2);
    }
  }
  function S$1(n2, u2, i2) {
    var t2, r2;
    if (l$3.unmount && l$3.unmount(n2), (t2 = n2.ref) && (t2.current && t2.current !== n2.__e || O$2(t2, null, u2)), null != (t2 = n2.__c)) {
      if (t2.componentWillUnmount)
        try {
          t2.componentWillUnmount();
        } catch (n3) {
          l$3.__e(n3, u2);
        }
      t2.base = t2.__P = null, n2.__c = void 0;
    }
    if (t2 = n2.__k)
      for (r2 = 0; r2 < t2.length; r2++)
        t2[r2] && S$1(t2[r2], u2, i2 || "function" != typeof n2.type);
    i2 || null == n2.__e || v$2(n2.__e), n2.__ = n2.__e = n2.__d = void 0;
  }
  function q$2(n2, l2, u2) {
    return this.constructor(n2, u2);
  }
  function B$2(u2, i2, t2) {
    var r2, o2, f2;
    l$3.__ && l$3.__(u2, i2), o2 = (r2 = "function" == typeof t2) ? null : t2 && t2.__k || i2.__k, f2 = [], L$3(i2, u2 = (!r2 && t2 || i2).__k = y$3(_$2, null, [u2]), o2 || c$3, c$3, void 0 !== i2.ownerSVGElement, !r2 && t2 ? [t2] : o2 ? null : i2.firstChild ? n$2.call(i2.childNodes) : null, f2, !r2 && t2 ? t2 : o2 ? o2.__e : i2.firstChild, r2), M$1(f2, u2);
  }
  function D$3(n2, l2) {
    B$2(n2, l2, D$3);
  }
  function E$2(l2, u2, i2) {
    var t2, r2, o2, f2 = h$3({}, l2.props);
    for (o2 in u2)
      "key" == o2 ? t2 = u2[o2] : "ref" == o2 ? r2 = u2[o2] : f2[o2] = u2[o2];
    return arguments.length > 2 && (f2.children = arguments.length > 3 ? n$2.call(arguments, 2) : i2), p$4(l2.type, f2, t2 || l2.key, r2 || l2.ref, null);
  }
  function F$2(n2, l2) {
    var u2 = { __c: l2 = "__cC" + e$2++, __: n2, Consumer: function(n3, l3) {
      return n3.children(l3);
    }, Provider: function(n3) {
      var u3, i2;
      return this.getChildContext || (u3 = [], (i2 = {})[l2] = this, this.getChildContext = function() {
        return i2;
      }, this.shouldComponentUpdate = function(n4) {
        this.props.value !== n4.value && u3.some(function(n5) {
          n5.__e = true, m$3(n5);
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
  n$2 = s$3.slice, l$3 = { __e: function(n2, l2, u2, i2) {
    for (var t2, r2, o2; l2 = l2.__; )
      if ((t2 = l2.__c) && !t2.__)
        try {
          if ((r2 = t2.constructor) && null != r2.getDerivedStateFromError && (t2.setState(r2.getDerivedStateFromError(n2)), o2 = t2.__d), null != t2.componentDidCatch && (t2.componentDidCatch(n2, i2 || {}), o2 = t2.__d), o2)
            return t2.__E = t2;
        } catch (l3) {
          n2 = l3;
        }
    throw n2;
  } }, u$3 = 0, k$3.prototype.setState = function(n2, l2) {
    var u2;
    u2 = null != this.__s && this.__s !== this.state ? this.__s : this.__s = h$3({}, this.state), "function" == typeof n2 && (n2 = n2(h$3({}, u2), this.props)), n2 && h$3(u2, n2), null != n2 && this.__v && (l2 && this._sb.push(l2), m$3(this));
  }, k$3.prototype.forceUpdate = function(n2) {
    this.__v && (this.__e = true, n2 && this.__h.push(n2), m$3(this));
  }, k$3.prototype.render = _$2, t$2 = [], o$4 = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, f$3 = function(n2, l2) {
    return n2.__v.__b - l2.__v.__b;
  }, w$3.__r = 0, e$2 = 0;
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
  var monkeyWindow = window;
  var unsafeWindow = /* @__PURE__ */ (() => {
    return monkeyWindow.unsafeWindow;
  })();
  var GM_setValue = /* @__PURE__ */ (() => monkeyWindow.GM_setValue)();
  var GM_deleteValue = /* @__PURE__ */ (() => monkeyWindow.GM_deleteValue)();
  var GM_getValue = /* @__PURE__ */ (() => monkeyWindow.GM_getValue)();
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
  const baseUrl = "https://chat.openai.com";
  const LEGACY_KEY_FILENAME_FORMAT = "exporter-format";
  const KEY_FILENAME_FORMAT = "exporter:filename_format";
  const KEY_TIMESTAMP_ENABLED = "exporter:enable_timestamp";
  const KEY_TIMESTAMP_24H = "exporter:timestamp_24h";
  const KEY_META_ENABLED = "exporter:enable_meta";
  const KEY_META_LIST = "exporter:meta_list";
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
  function getChatIdFromUrl() {
    const match = location.pathname.match(/^\/chat\/([a-z0-9-]+)$/i);
    if (match)
      return match[1];
    return null;
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
    try {
      const {
        picture
      } = getUserProfile();
      if (picture)
        return await getBase64FromImageUrl(picture);
    } catch (e2) {
      console.error(e2);
    }
    try {
      const avatars = Array.from(document.querySelectorAll("img[alt]:not([aria-hidden])"));
      const avatar = avatars.find((avatar2) => !avatar2.src.startsWith("data:"));
      if (avatar)
        return getBase64FromImg(avatar);
    } catch (e2) {
      console.error(e2);
    }
    return defaultAvatar;
  }
  function checkIfConversationStarted() {
    return !!document.querySelector("main .group");
  }
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
    const chatId = getChatIdFromUrl();
    if (chatId)
      return chatId;
    const conversations = await fetchConversations();
    if (conversations && conversations.items.length > 0) {
      return conversations.items[0].id;
    }
    throw new Error("No chat id found.");
  }
  async function fetchConversation(chatId) {
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
  async function fetchAllConversations() {
    const conversations = [];
    const limit = 20;
    let offset = 0;
    while (true) {
      const result = await fetchConversations(offset, limit);
      conversations.push(...result.items);
      if (offset + limit >= result.total)
        break;
      offset += limit;
    }
    return conversations;
  }
  async function deleteConversation(chatId) {
    const url = conversationApi(chatId);
    const {
      success
    } = await fetchApi(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        is_visible: false
      })
    });
    return success;
  }
  async function fetchApi(url, options2) {
    const accessToken = await getAccessToken();
    const response = await fetch(url, {
      ...options2,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...options2 == null ? void 0 : options2.headers
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
    constructor(value) {
      __publicField(this, "value");
      __publicField(this, "child", null);
      this.value = value;
    }
  }
  const modelMapping = {
    "text-davinci-002-render-sha": "GTP-3.5",
    "text-davinci-002-render-paid": "GTP-3.5",
    "gpt-4": "GPT-4"
  };
  function processConversation(conversation, conversationChoices = []) {
    var _a, _b, _c, _d;
    const title = conversation.title || "ChatGPT Conversation";
    const createTime = conversation.create_time;
    const modelSlug = ((_c = (_b = (_a = Object.values(conversation.mapping).find((node2) => {
      var _a2, _b2;
      return (_b2 = (_a2 = node2.message) == null ? void 0 : _a2.metadata) == null ? void 0 : _b2.model_slug;
    })) == null ? void 0 : _a.message) == null ? void 0 : _b.metadata) == null ? void 0 : _c.model_slug) || "";
    const model = modelSlug ? modelMapping[modelSlug] || "" : "";
    const result = [];
    const nodes = Object.values(conversation.mapping);
    const root2 = nodes.find((node2) => !node2.parent);
    if (!root2)
      throw new Error("No root node found.");
    const nodeMap = new Map(Object.entries(conversation.mapping));
    const tail = new LinkedListItem(root2);
    const queue = [tail];
    let index2 = -1;
    while (queue.length > 0) {
      const current = queue.shift();
      const node2 = nodeMap.get(current.value.id);
      if (!node2)
        throw new Error("No node found.");
      const role = (_d = node2.message) == null ? void 0 : _d.author.role;
      if (role === "assistant" || role === "user") {
        result.push(node2);
      }
      if (node2.children.length === 0)
        continue;
      const _last = node2.children.length - 1;
      const choice = conversationChoices[index2++] ?? _last;
      const childId = node2.children[choice] ?? node2.children[_last];
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
      modelSlug,
      model,
      createTime,
      conversationNodes: result
    };
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
  var t$1, r$2, u$2, i$2, o$3 = 0, f$2 = [], c$2 = [], e$1 = l$3.__b, a$2 = l$3.__r, v$1 = l$3.diffed, l$2 = l$3.__c, m$2 = l$3.unmount;
  function d$2(t2, u2) {
    l$3.__h && l$3.__h(r$2, t2, o$3 || u2), o$3 = 0;
    var i2 = r$2.__H || (r$2.__H = { __: [], __h: [] });
    return t2 >= i2.__.length && i2.__.push({ __V: c$2 }), i2.__[t2];
  }
  function h$2(n2) {
    return o$3 = 1, s$2(B$1, n2);
  }
  function s$2(n2, u2, i2) {
    var o2 = d$2(t$1++, 2);
    if (o2.t = n2, !o2.__c && (o2.__ = [i2 ? i2(u2) : B$1(void 0, u2), function(n3) {
      var t2 = o2.__N ? o2.__N[0] : o2.__[0], r2 = o2.t(t2, n3);
      t2 !== r2 && (o2.__N = [r2, o2.__[1]], o2.__c.setState({}));
    }], o2.__c = r$2, !r$2.u)) {
      var f2 = function(n3, t2, r2) {
        if (!o2.__c.__H)
          return true;
        var u3 = o2.__c.__H.__.filter(function(n4) {
          return n4.__c;
        });
        if (u3.every(function(n4) {
          return !n4.__N;
        }))
          return !c2 || c2.call(this, n3, t2, r2);
        var i3 = false;
        return u3.forEach(function(n4) {
          if (n4.__N) {
            var t3 = n4.__[0];
            n4.__ = n4.__N, n4.__N = void 0, t3 !== n4.__[0] && (i3 = true);
          }
        }), !(!i3 && o2.__c.props === n3) && (!c2 || c2.call(this, n3, t2, r2));
      };
      r$2.u = true;
      var c2 = r$2.shouldComponentUpdate, e2 = r$2.componentWillUpdate;
      r$2.componentWillUpdate = function(n3, t2, r2) {
        if (this.__e) {
          var u3 = c2;
          c2 = void 0, f2(n3, t2, r2), c2 = u3;
        }
        e2 && e2.call(this, n3, t2, r2);
      }, r$2.shouldComponentUpdate = f2;
    }
    return o2.__N || o2.__;
  }
  function p$3(u2, i2) {
    var o2 = d$2(t$1++, 3);
    !l$3.__s && z$2(o2.__H, i2) && (o2.__ = u2, o2.i = i2, r$2.__H.__h.push(o2));
  }
  function y$2(u2, i2) {
    var o2 = d$2(t$1++, 4);
    !l$3.__s && z$2(o2.__H, i2) && (o2.__ = u2, o2.i = i2, r$2.__h.push(o2));
  }
  function _$1(n2) {
    return o$3 = 5, F$1(function() {
      return { current: n2 };
    }, []);
  }
  function A$2(n2, t2, r2) {
    o$3 = 6, y$2(function() {
      return "function" == typeof n2 ? (n2(t2()), function() {
        return n2(null);
      }) : n2 ? (n2.current = t2(), function() {
        return n2.current = null;
      }) : void 0;
    }, null == r2 ? r2 : r2.concat(n2));
  }
  function F$1(n2, r2) {
    var u2 = d$2(t$1++, 7);
    return z$2(u2.__H, r2) ? (u2.__V = n2(), u2.i = r2, u2.__h = n2, u2.__V) : u2.__;
  }
  function T$3(n2, t2) {
    return o$3 = 8, F$1(function() {
      return n2;
    }, t2);
  }
  function q$1(n2) {
    var u2 = r$2.context[n2.__c], i2 = d$2(t$1++, 9);
    return i2.c = n2, u2 ? (null == i2.__ && (i2.__ = true, u2.sub(r$2)), u2.props.value) : n2.__;
  }
  function x$3(t2, r2) {
    l$3.useDebugValue && l$3.useDebugValue(r2 ? r2(t2) : t2);
  }
  function P$2(n2) {
    var u2 = d$2(t$1++, 10), i2 = h$2();
    return u2.__ = n2, r$2.componentDidCatch || (r$2.componentDidCatch = function(n3, t2) {
      u2.__ && u2.__(n3, t2), i2[1](n3);
    }), [i2[0], function() {
      i2[1](void 0);
    }];
  }
  function V$1() {
    var n2 = d$2(t$1++, 11);
    if (!n2.__) {
      for (var u2 = r$2.__v; null !== u2 && !u2.__m && null !== u2.__; )
        u2 = u2.__;
      var i2 = u2.__m || (u2.__m = [0, 0]);
      n2.__ = "P" + i2[0] + "-" + i2[1]++;
    }
    return n2.__;
  }
  function b$2() {
    for (var t2; t2 = f$2.shift(); )
      if (t2.__P && t2.__H)
        try {
          t2.__H.__h.forEach(k$2), t2.__H.__h.forEach(w$2), t2.__H.__h = [];
        } catch (r2) {
          t2.__H.__h = [], l$3.__e(r2, t2.__v);
        }
  }
  l$3.__b = function(n2) {
    r$2 = null, e$1 && e$1(n2);
  }, l$3.__r = function(n2) {
    a$2 && a$2(n2), t$1 = 0;
    var i2 = (r$2 = n2.__c).__H;
    i2 && (u$2 === r$2 ? (i2.__h = [], r$2.__h = [], i2.__.forEach(function(n3) {
      n3.__N && (n3.__ = n3.__N), n3.__V = c$2, n3.__N = n3.i = void 0;
    })) : (i2.__h.forEach(k$2), i2.__h.forEach(w$2), i2.__h = [])), u$2 = r$2;
  }, l$3.diffed = function(t2) {
    v$1 && v$1(t2);
    var o2 = t2.__c;
    o2 && o2.__H && (o2.__H.__h.length && (1 !== f$2.push(o2) && i$2 === l$3.requestAnimationFrame || ((i$2 = l$3.requestAnimationFrame) || j$1)(b$2)), o2.__H.__.forEach(function(n2) {
      n2.i && (n2.__H = n2.i), n2.__V !== c$2 && (n2.__ = n2.__V), n2.i = void 0, n2.__V = c$2;
    })), u$2 = r$2 = null;
  }, l$3.__c = function(t2, r2) {
    r2.some(function(t3) {
      try {
        t3.__h.forEach(k$2), t3.__h = t3.__h.filter(function(n2) {
          return !n2.__ || w$2(n2);
        });
      } catch (u2) {
        r2.some(function(n2) {
          n2.__h && (n2.__h = []);
        }), r2 = [], l$3.__e(u2, t3.__v);
      }
    }), l$2 && l$2(t2, r2);
  }, l$3.unmount = function(t2) {
    m$2 && m$2(t2);
    var r2, u2 = t2.__c;
    u2 && u2.__H && (u2.__H.__.forEach(function(n2) {
      try {
        k$2(n2);
      } catch (n3) {
        r2 = n3;
      }
    }), u2.__H = void 0, r2 && l$3.__e(r2, u2.__v));
  };
  var g$3 = "function" == typeof requestAnimationFrame;
  function j$1(n2) {
    var t2, r2 = function() {
      clearTimeout(u2), g$3 && cancelAnimationFrame(t2), setTimeout(n2);
    }, u2 = setTimeout(r2, 100);
    g$3 && (t2 = requestAnimationFrame(r2));
  }
  function k$2(n2) {
    var t2 = r$2, u2 = n2.__c;
    "function" == typeof u2 && (n2.__c = void 0, u2()), r$2 = t2;
  }
  function w$2(n2) {
    var t2 = r$2;
    n2.__c = n2.__(), r$2 = t2;
  }
  function z$2(n2, t2) {
    return !n2 || n2.length !== t2.length || t2.some(function(t3, r2) {
      return t3 !== n2[r2];
    });
  }
  function B$1(n2, t2) {
    return "function" == typeof t2 ? t2(n2) : t2;
  }
  function g$2(n2, t2) {
    for (var e2 in t2)
      n2[e2] = t2[e2];
    return n2;
  }
  function C$1(n2, t2) {
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
  function w$1(n2) {
    this.props = n2;
  }
  function x$2(n2, e2) {
    function r2(n3) {
      var t2 = this.props.ref, r3 = t2 == n3.ref;
      return !r3 && t2 && (t2.call ? t2(null) : t2.current = null), e2 ? !e2(this.props, n3) || !r3 : C$1(this.props, n3);
    }
    function u2(e3) {
      return this.shouldComponentUpdate = r2, y$3(n2, e3);
    }
    return u2.displayName = "Memo(" + (n2.displayName || n2.name) + ")", u2.prototype.isReactComponent = true, u2.__f = true, u2;
  }
  (w$1.prototype = new k$3()).isPureReactComponent = true, w$1.prototype.shouldComponentUpdate = function(n2, t2) {
    return C$1(this.props, n2) || C$1(this.state, t2);
  };
  var R$2 = l$3.__b;
  l$3.__b = function(n2) {
    n2.type && n2.type.__f && n2.ref && (n2.props.ref = n2.ref, n2.ref = null), R$2 && R$2(n2);
  };
  var N$1 = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.forward_ref") || 3911;
  function k$1(n2) {
    function t2(t3) {
      var e2 = g$2({}, t3);
      return delete e2.ref, n2(e2, t3.ref || null);
    }
    return t2.$$typeof = N$1, t2.render = t2, t2.prototype.isReactComponent = t2.__f = true, t2.displayName = "ForwardRef(" + (n2.displayName || n2.name) + ")", t2;
  }
  var A$1 = function(n2, t2) {
    return null == n2 ? null : P$3(P$3(n2).map(t2));
  }, O$1 = { map: A$1, forEach: A$1, count: function(n2) {
    return n2 ? P$3(n2).length : 0;
  }, only: function(n2) {
    var t2 = P$3(n2);
    if (1 !== t2.length)
      throw "Children.only";
    return t2[0];
  }, toArray: P$3 }, T$2 = l$3.__e;
  l$3.__e = function(n2, t2, e2, r2) {
    if (n2.then) {
      for (var u2, o2 = t2; o2 = o2.__; )
        if ((u2 = o2.__c) && u2.__c)
          return null == t2.__e && (t2.__e = e2.__e, t2.__k = e2.__k), u2.__c(n2, t2);
    }
    T$2(n2, t2, e2, r2);
  };
  var I = l$3.unmount;
  function L$2(n2, t2, e2) {
    return n2 && (n2.__c && n2.__c.__H && (n2.__c.__H.__.forEach(function(n3) {
      "function" == typeof n3.__c && n3.__c();
    }), n2.__c.__H = null), null != (n2 = g$2({}, n2)).__c && (n2.__c.__P === e2 && (n2.__c.__P = t2), n2.__c = null), n2.__k = n2.__k && n2.__k.map(function(n3) {
      return L$2(n3, t2, e2);
    })), n2;
  }
  function U(n2, t2, e2) {
    return n2 && (n2.__v = null, n2.__k = n2.__k && n2.__k.map(function(n3) {
      return U(n3, t2, e2);
    }), n2.__c && n2.__c.__P === t2 && (n2.__e && e2.insertBefore(n2.__e, n2.__d), n2.__c.__e = true, n2.__c.__P = e2)), n2;
  }
  function D$2() {
    this.__u = 0, this.t = null, this.__b = null;
  }
  function F(n2) {
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
      return y$3(r2, o3);
    }
    return o2.displayName = "Lazy", o2.__f = true, o2;
  }
  function V() {
    this.u = null, this.o = null;
  }
  l$3.unmount = function(n2) {
    var t2 = n2.__c;
    t2 && t2.__R && t2.__R(), t2 && true === n2.__h && (n2.type = null), I && I(n2);
  }, (D$2.prototype = new k$3()).__c = function(n2, t2) {
    var e2 = t2.__c, r2 = this;
    null == r2.t && (r2.t = []), r2.t.push(e2);
    var u2 = F(r2.__v), o2 = false, i2 = function() {
      o2 || (o2 = true, e2.__R = null, u2 ? u2(l2) : l2());
    };
    e2.__R = i2;
    var l2 = function() {
      if (!--r2.__u) {
        if (r2.state.__a) {
          var n3 = r2.state.__a;
          r2.__v.__k[0] = U(n3, n3.__c.__P, n3.__c.__O);
        }
        var t3;
        for (r2.setState({ __a: r2.__b = null }); t3 = r2.t.pop(); )
          t3.forceUpdate();
      }
    }, c2 = true === t2.__h;
    r2.__u++ || c2 || r2.setState({ __a: r2.__b = r2.__v.__k[0] }), n2.then(i2, i2);
  }, D$2.prototype.componentWillUnmount = function() {
    this.t = [];
  }, D$2.prototype.render = function(n2, e2) {
    if (this.__b) {
      if (this.__v.__k) {
        var r2 = document.createElement("div"), o2 = this.__v.__k[0].__c;
        this.__v.__k[0] = L$2(this.__b, r2, o2.__O = o2.__P);
      }
      this.__b = null;
    }
    var i2 = e2.__a && y$3(_$2, null, n2.fallback);
    return i2 && (i2.__h = null), [y$3(_$2, null, e2.__a ? null : n2.children), i2];
  };
  var W$1 = function(n2, t2, e2) {
    if (++e2[1] === e2[0] && n2.o.delete(t2), n2.props.revealOrder && ("t" !== n2.props.revealOrder[0] || !n2.o.size))
      for (e2 = n2.u; e2; ) {
        for (; e2.length > 3; )
          e2.pop()();
        if (e2[1] < e2[0])
          break;
        n2.u = e2 = e2[2];
      }
  };
  function P$1(n2) {
    return this.getChildContext = function() {
      return n2.context;
    }, n2.children;
  }
  function j(n2) {
    var e2 = this, r2 = n2.i;
    e2.componentWillUnmount = function() {
      B$2(null, e2.l), e2.l = null, e2.i = null;
    }, e2.i && e2.i !== r2 && e2.componentWillUnmount(), n2.__v ? (e2.l || (e2.i = r2, e2.l = { nodeType: 1, parentNode: r2, childNodes: [], appendChild: function(n3) {
      this.childNodes.push(n3), e2.i.appendChild(n3);
    }, insertBefore: function(n3, t2) {
      this.childNodes.push(n3), e2.i.appendChild(n3);
    }, removeChild: function(n3) {
      this.childNodes.splice(this.childNodes.indexOf(n3) >>> 1, 1), e2.i.removeChild(n3);
    } }), B$2(y$3(P$1, { context: e2.context }, n2.__v), e2.l)) : e2.l && e2.componentWillUnmount();
  }
  function z$1(n2, e2) {
    var r2 = y$3(j, { __v: n2, i: e2 });
    return r2.containerInfo = e2, r2;
  }
  (V.prototype = new k$3()).__a = function(n2) {
    var t2 = this, e2 = F(t2.__v), r2 = t2.o.get(n2);
    return r2[0]++, function(u2) {
      var o2 = function() {
        t2.props.revealOrder ? (r2.push(u2), W$1(t2, n2, r2)) : u2();
      };
      e2 ? e2(o2) : o2();
    };
  }, V.prototype.render = function(n2) {
    this.u = null, this.o = /* @__PURE__ */ new Map();
    var t2 = P$3(n2.children);
    n2.revealOrder && "b" === n2.revealOrder[0] && t2.reverse();
    for (var e2 = t2.length; e2--; )
      this.o.set(t2[e2], this.u = [1, 0, this.u]);
    return n2.children;
  }, V.prototype.componentDidUpdate = V.prototype.componentDidMount = function() {
    var n2 = this;
    this.o.forEach(function(t2, e2) {
      W$1(n2, e2, t2);
    });
  };
  var B = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.element") || 60103, H$1 = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/, Z = /^on(Ani|Tra|Tou|BeforeInp|Compo)/, Y = /[A-Z0-9]/g, $ = "undefined" != typeof document, q = function(n2) {
    return ("undefined" != typeof Symbol && "symbol" == typeof Symbol() ? /fil|che|rad/ : /fil|che|ra/).test(n2);
  };
  function G(n2, t2, e2) {
    return null == t2.__k && (t2.textContent = ""), B$2(n2, t2), "function" == typeof e2 && e2(), n2 ? n2.__c : null;
  }
  function J(n2, t2, e2) {
    return D$3(n2, t2), "function" == typeof e2 && e2(), n2 ? n2.__c : null;
  }
  k$3.prototype.isReactComponent = {}, ["componentWillMount", "componentWillReceiveProps", "componentWillUpdate"].forEach(function(t2) {
    Object.defineProperty(k$3.prototype, t2, { configurable: true, get: function() {
      return this["UNSAFE_" + t2];
    }, set: function(n2) {
      Object.defineProperty(this, t2, { configurable: true, writable: true, value: n2 });
    } });
  });
  var K = l$3.event;
  function Q() {
  }
  function X() {
    return this.cancelBubble;
  }
  function nn() {
    return this.defaultPrevented;
  }
  l$3.event = function(n2) {
    return K && (n2 = K(n2)), n2.persist = Q, n2.isPropagationStopped = X, n2.isDefaultPrevented = nn, n2.nativeEvent = n2;
  };
  var tn, en = { enumerable: false, configurable: true, get: function() {
    return this.class;
  } }, rn = l$3.vnode;
  l$3.vnode = function(n2) {
    "string" == typeof n2.type && function(n3) {
      var t2 = n3.props, e2 = n3.type, u2 = {};
      for (var o2 in t2) {
        var i2 = t2[o2];
        if (!("value" === o2 && "defaultValue" in t2 && null == i2 || $ && "children" === o2 && "noscript" === e2 || "class" === o2 || "className" === o2)) {
          var l2 = o2.toLowerCase();
          "defaultValue" === o2 && "value" in t2 && null == t2.value ? o2 = "value" : "download" === o2 && true === i2 ? i2 = "" : "ondoubleclick" === l2 ? o2 = "ondblclick" : "onchange" !== l2 || "input" !== e2 && "textarea" !== e2 || q(t2.type) ? "onfocus" === l2 ? o2 = "onfocusin" : "onblur" === l2 ? o2 = "onfocusout" : Z.test(o2) ? o2 = l2 : -1 === e2.indexOf("-") && H$1.test(o2) ? o2 = o2.replace(Y, "-$&").toLowerCase() : null === i2 && (i2 = void 0) : l2 = o2 = "oninput", "oninput" === l2 && u2[o2 = l2] && (o2 = "oninputCapture"), u2[o2] = i2;
        }
      }
      "select" == e2 && u2.multiple && Array.isArray(u2.value) && (u2.value = P$3(t2.children).forEach(function(n4) {
        n4.props.selected = -1 != u2.value.indexOf(n4.props.value);
      })), "select" == e2 && null != u2.defaultValue && (u2.value = P$3(t2.children).forEach(function(n4) {
        n4.props.selected = u2.multiple ? -1 != u2.defaultValue.indexOf(n4.props.value) : u2.defaultValue == n4.props.value;
      })), t2.class && !t2.className ? (u2.class = t2.class, Object.defineProperty(u2, "className", en)) : (t2.className && !t2.class || t2.class && t2.className) && (u2.class = u2.className = t2.className), n3.props = u2;
    }(n2), n2.$$typeof = B, rn && rn(n2);
  };
  var un = l$3.__r;
  l$3.__r = function(n2) {
    un && un(n2), tn = n2.__c;
  };
  var on = l$3.diffed;
  l$3.diffed = function(n2) {
    on && on(n2);
    var t2 = n2.props, e2 = n2.__e;
    null != e2 && "textarea" === n2.type && "value" in t2 && t2.value !== e2.value && (e2.value = null == t2.value ? "" : t2.value), tn = null;
  };
  var ln = { ReactCurrentDispatcher: { current: { readContext: function(n2) {
    return tn.__n[n2.__c].props.value;
  } } } }, cn = "17.0.2";
  function fn(n2) {
    return y$3.bind(null, n2);
  }
  function an(n2) {
    return !!n2 && n2.$$typeof === B;
  }
  function sn(n2) {
    return an(n2) ? E$2.apply(null, arguments) : n2;
  }
  function hn(n2) {
    return !!n2.__k && (B$2(null, n2), true);
  }
  function vn(n2) {
    return n2 && (n2.base || 1 === n2.nodeType && n2) || null;
  }
  var dn = function(n2, t2) {
    return n2(t2);
  }, pn = function(n2, t2) {
    return n2(t2);
  }, mn = _$2;
  function yn(n2) {
    n2();
  }
  function _n(n2) {
    return n2;
  }
  function bn() {
    return [false, yn];
  }
  var Sn = y$2;
  function gn(n2, t2) {
    var e2 = t2(), r2 = h$2({ h: { __: e2, v: t2 } }), u2 = r2[0].h, o2 = r2[1];
    return y$2(function() {
      u2.__ = e2, u2.v = t2, E$1(u2.__, t2()) || o2({ h: u2 });
    }, [n2, e2, t2]), p$3(function() {
      return E$1(u2.__, u2.v()) || o2({ h: u2 }), n2(function() {
        E$1(u2.__, u2.v()) || o2({ h: u2 });
      });
    }, [n2]), e2;
  }
  var Cn = { useState: h$2, useId: V$1, useReducer: s$2, useEffect: p$3, useLayoutEffect: y$2, useInsertionEffect: Sn, useTransition: bn, useDeferredValue: _n, useSyncExternalStore: gn, startTransition: yn, useRef: _$1, useImperativeHandle: A$2, useMemo: F$1, useCallback: T$3, useContext: q$1, useDebugValue: x$3, version: "17.0.2", Children: O$1, render: G, hydrate: J, unmountComponentAtNode: hn, createPortal: z$1, createElement: y$3, createContext: F$2, createFactory: fn, cloneElement: sn, createRef: d$3, Fragment: _$2, isValidElement: an, findDOMNode: vn, Component: k$3, PureComponent: w$1, memo: x$2, forwardRef: k$1, flushSync: pn, unstable_batchedUpdates: dn, StrictMode: mn, Suspense: D$2, SuspenseList: V, lazy: M, __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: ln };
  const $2AODx$react = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    Children: O$1,
    Component: k$3,
    Fragment: _$2,
    PureComponent: w$1,
    StrictMode: mn,
    Suspense: D$2,
    SuspenseList: V,
    __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: ln,
    cloneElement: sn,
    createContext: F$2,
    createElement: y$3,
    createFactory: fn,
    createPortal: z$1,
    createRef: d$3,
    default: Cn,
    findDOMNode: vn,
    flushSync: pn,
    forwardRef: k$1,
    hydrate: J,
    isValidElement: an,
    lazy: M,
    memo: x$2,
    render: G,
    startTransition: yn,
    unmountComponentAtNode: hn,
    unstable_batchedUpdates: dn,
    useCallback: T$3,
    useContext: q$1,
    useDebugValue: x$3,
    useDeferredValue: _n,
    useEffect: p$3,
    useErrorBoundary: P$2,
    useId: V$1,
    useImperativeHandle: A$2,
    useInsertionEffect: Sn,
    useLayoutEffect: y$2,
    useMemo: F$1,
    useReducer: s$2,
    useRef: _$1,
    useState: h$2,
    useSyncExternalStore: gn,
    useTransition: bn,
    version: cn
  }, Symbol.toStringTag, { value: "Module" }));
  function $e42e1063c40fb3ef$export$b9ecd428b558ff10(originalEventHandler, ourEventHandler, { checkForDefaultPrevented = true } = {}) {
    return function handleEvent(event) {
      originalEventHandler === null || originalEventHandler === void 0 || originalEventHandler(event);
      if (checkForDefaultPrevented === false || !event.defaultPrevented)
        return ourEventHandler === null || ourEventHandler === void 0 ? void 0 : ourEventHandler(event);
    };
  }
  function $c512c27ab02ef895$export$50c7b4e9d9f19c1(scopeName, createContextScopeDeps = []) {
    let defaultContexts = [];
    function $c512c27ab02ef895$export$fd42f52fd3ae1109(rootComponentName, defaultContext) {
      const BaseContext = /* @__PURE__ */ F$2(defaultContext);
      const index2 = defaultContexts.length;
      defaultContexts = [
        ...defaultContexts,
        defaultContext
      ];
      function Provider(props) {
        const { scope, children, ...context } = props;
        const Context = (scope === null || scope === void 0 ? void 0 : scope[scopeName][index2]) || BaseContext;
        const value = F$1(
          () => context,
          Object.values(context)
        );
        return /* @__PURE__ */ y$3(Context.Provider, {
          value
        }, children);
      }
      function useContext(consumerName, scope) {
        const Context = (scope === null || scope === void 0 ? void 0 : scope[scopeName][index2]) || BaseContext;
        const context = q$1(Context);
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
        return /* @__PURE__ */ F$2(defaultContext);
      });
      return function useScope(scope) {
        const contexts = (scope === null || scope === void 0 ? void 0 : scope[scopeName]) || scopeContexts;
        return F$1(
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
        return F$1(
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
  function $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(callback) {
    const callbackRef = _$1(callback);
    p$3(() => {
      callbackRef.current = callback;
    });
    return F$1(
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
    const setValue = T$3((nextValue) => {
      if (isControlled) {
        const setter = nextValue;
        const value = typeof nextValue === "function" ? setter(prop) : nextValue;
        if (value !== prop)
          handleChange(value);
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
    const uncontrolledState = h$2(defaultProp);
    const [value] = uncontrolledState;
    const prevValueRef = _$1(value);
    const handleChange = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onChange);
    p$3(() => {
      if (prevValueRef.current !== value) {
        handleChange(value);
        prevValueRef.current = value;
      }
    }, [
      value,
      prevValueRef,
      handleChange
    ]);
    return uncontrolledState;
  }
  function $6ed0406888f73fc4$var$setRef(ref, value) {
    if (typeof ref === "function")
      ref(value);
    else if (ref !== null && ref !== void 0)
      ref.current = value;
  }
  function $6ed0406888f73fc4$export$43e446d32b3d21af(...refs) {
    return (node2) => refs.forEach(
      (ref) => $6ed0406888f73fc4$var$setRef(ref, node2)
    );
  }
  function $6ed0406888f73fc4$export$c7b2cbe3552a0d05(...refs) {
    return T$3($6ed0406888f73fc4$export$43e446d32b3d21af(...refs), refs);
  }
  function t(t2) {
    return t2.split("-")[0];
  }
  function e(t2) {
    return t2.split("-")[1];
  }
  function n$1(e2) {
    return ["top", "bottom"].includes(t(e2)) ? "x" : "y";
  }
  function r$1(t2) {
    return "y" === t2 ? "height" : "width";
  }
  function i$1(i2, o2, a2) {
    let { reference: l2, floating: s2 } = i2;
    const c2 = l2.x + l2.width / 2 - s2.width / 2, f2 = l2.y + l2.height / 2 - s2.height / 2, u2 = n$1(o2), m2 = r$1(u2), g2 = l2[m2] / 2 - s2[m2] / 2, d2 = "x" === u2;
    let p2;
    switch (t(o2)) {
      case "top":
        p2 = { x: c2, y: l2.y - s2.height };
        break;
      case "bottom":
        p2 = { x: c2, y: l2.y + l2.height };
        break;
      case "right":
        p2 = { x: l2.x + l2.width, y: f2 };
        break;
      case "left":
        p2 = { x: l2.x - s2.width, y: f2 };
        break;
      default:
        p2 = { x: l2.x, y: l2.y };
    }
    switch (e(o2)) {
      case "start":
        p2[u2] -= g2 * (a2 && d2 ? -1 : 1);
        break;
      case "end":
        p2[u2] += g2 * (a2 && d2 ? -1 : 1);
    }
    return p2;
  }
  const o$2 = async (t2, e2, n2) => {
    const { placement: r2 = "bottom", strategy: o2 = "absolute", middleware: a2 = [], platform: l2 } = n2, s2 = await (null == l2.isRTL ? void 0 : l2.isRTL(e2));
    let c2 = await l2.getElementRects({ reference: t2, floating: e2, strategy: o2 }), { x: f2, y: u2 } = i$1(c2, r2, s2), m2 = r2, g2 = {}, d2 = 0;
    for (let n3 = 0; n3 < a2.length; n3++) {
      const { name: p2, fn: h2 } = a2[n3], { x: y2, y: x2, data: w2, reset: v2 } = await h2({ x: f2, y: u2, initialPlacement: r2, placement: m2, strategy: o2, middlewareData: g2, rects: c2, platform: l2, elements: { reference: t2, floating: e2 } });
      f2 = null != y2 ? y2 : f2, u2 = null != x2 ? x2 : u2, g2 = { ...g2, [p2]: { ...g2[p2], ...w2 } }, v2 && d2 <= 50 && (d2++, "object" == typeof v2 && (v2.placement && (m2 = v2.placement), v2.rects && (c2 = true === v2.rects ? await l2.getElementRects({ reference: t2, floating: e2, strategy: o2 }) : v2.rects), { x: f2, y: u2 } = i$1(c2, m2, s2)), n3 = -1);
    }
    return { x: f2, y: u2, placement: m2, strategy: o2, middlewareData: g2 };
  };
  function a$1(t2) {
    return "number" != typeof t2 ? function(t3) {
      return { top: 0, right: 0, bottom: 0, left: 0, ...t3 };
    }(t2) : { top: t2, right: t2, bottom: t2, left: t2 };
  }
  function l$1(t2) {
    return { ...t2, top: t2.y, left: t2.x, right: t2.x + t2.width, bottom: t2.y + t2.height };
  }
  async function s$1(t2, e2) {
    var n2;
    void 0 === e2 && (e2 = {});
    const { x: r2, y: i2, platform: o2, rects: s2, elements: c2, strategy: f2 } = t2, { boundary: u2 = "clippingAncestors", rootBoundary: m2 = "viewport", elementContext: g2 = "floating", altBoundary: d2 = false, padding: p2 = 0 } = e2, h2 = a$1(p2), y2 = c2[d2 ? "floating" === g2 ? "reference" : "floating" : g2], x2 = l$1(await o2.getClippingRect({ element: null == (n2 = await (null == o2.isElement ? void 0 : o2.isElement(y2))) || n2 ? y2 : y2.contextElement || await (null == o2.getDocumentElement ? void 0 : o2.getDocumentElement(c2.floating)), boundary: u2, rootBoundary: m2, strategy: f2 })), w2 = l$1(o2.convertOffsetParentRelativeRectToViewportRelativeRect ? await o2.convertOffsetParentRelativeRectToViewportRelativeRect({ rect: "floating" === g2 ? { ...s2.floating, x: r2, y: i2 } : s2.reference, offsetParent: await (null == o2.getOffsetParent ? void 0 : o2.getOffsetParent(c2.floating)), strategy: f2 }) : s2[g2]);
    return { top: x2.top - w2.top + h2.top, bottom: w2.bottom - x2.bottom + h2.bottom, left: x2.left - w2.left + h2.left, right: w2.right - x2.right + h2.right };
  }
  const c$1 = Math.min, f$1 = Math.max;
  function u$1(t2, e2, n2) {
    return f$1(t2, c$1(e2, n2));
  }
  const m$1 = (t2) => ({ name: "arrow", options: t2, async fn(i2) {
    const { element: o2, padding: l2 = 0 } = null != t2 ? t2 : {}, { x: s2, y: c2, placement: f2, rects: m2, platform: g2 } = i2;
    if (null == o2)
      return {};
    const d2 = a$1(l2), p2 = { x: s2, y: c2 }, h2 = n$1(f2), y2 = e(f2), x2 = r$1(h2), w2 = await g2.getDimensions(o2), v2 = "y" === h2 ? "top" : "left", b2 = "y" === h2 ? "bottom" : "right", R2 = m2.reference[x2] + m2.reference[h2] - p2[h2] - m2.floating[x2], A2 = p2[h2] - m2.reference[h2], P2 = await (null == g2.getOffsetParent ? void 0 : g2.getOffsetParent(o2));
    let T2 = P2 ? "y" === h2 ? P2.clientHeight || 0 : P2.clientWidth || 0 : 0;
    0 === T2 && (T2 = m2.floating[x2]);
    const O2 = R2 / 2 - A2 / 2, D2 = d2[v2], L2 = T2 - w2[x2] - d2[b2], k2 = T2 / 2 - w2[x2] / 2 + O2, E2 = u$1(D2, k2, L2), C2 = ("start" === y2 ? d2[v2] : d2[b2]) > 0 && k2 !== E2 && m2.reference[x2] <= m2.floating[x2];
    return { [h2]: p2[h2] - (C2 ? k2 < D2 ? D2 - k2 : L2 - k2 : 0), data: { [h2]: E2, centerOffset: k2 - E2 } };
  } }), g$1 = { left: "right", right: "left", bottom: "top", top: "bottom" };
  function d$1(t2) {
    return t2.replace(/left|right|bottom|top/g, (t3) => g$1[t3]);
  }
  function p$2(t2, i2, o2) {
    void 0 === o2 && (o2 = false);
    const a2 = e(t2), l2 = n$1(t2), s2 = r$1(l2);
    let c2 = "x" === l2 ? a2 === (o2 ? "end" : "start") ? "right" : "left" : "start" === a2 ? "bottom" : "top";
    return i2.reference[s2] > i2.floating[s2] && (c2 = d$1(c2)), { main: c2, cross: d$1(c2) };
  }
  const h$1 = { start: "end", end: "start" };
  function y$1(t2) {
    return t2.replace(/start|end/g, (t3) => h$1[t3]);
  }
  const x$1 = ["top", "right", "bottom", "left"];
  x$1.reduce((t2, e2) => t2.concat(e2, e2 + "-start", e2 + "-end"), []);
  const b$1 = function(e2) {
    return void 0 === e2 && (e2 = {}), { name: "flip", options: e2, async fn(n2) {
      var r2;
      const { placement: i2, middlewareData: o2, rects: a2, initialPlacement: l2, platform: c2, elements: f2 } = n2, { mainAxis: u2 = true, crossAxis: m2 = true, fallbackPlacements: g2, fallbackStrategy: h2 = "bestFit", flipAlignment: x2 = true, ...w2 } = e2, v2 = t(i2), b2 = g2 || (v2 === l2 || !x2 ? [d$1(l2)] : function(t2) {
        const e3 = d$1(t2);
        return [y$1(t2), e3, y$1(e3)];
      }(l2)), R2 = [l2, ...b2], A2 = await s$1(n2, w2), P2 = [];
      let T2 = (null == (r2 = o2.flip) ? void 0 : r2.overflows) || [];
      if (u2 && P2.push(A2[v2]), m2) {
        const { main: t2, cross: e3 } = p$2(i2, a2, await (null == c2.isRTL ? void 0 : c2.isRTL(f2.floating)));
        P2.push(A2[t2], A2[e3]);
      }
      if (T2 = [...T2, { placement: i2, overflows: P2 }], !P2.every((t2) => t2 <= 0)) {
        var O2, D2;
        const t2 = (null != (O2 = null == (D2 = o2.flip) ? void 0 : D2.index) ? O2 : 0) + 1, e3 = R2[t2];
        if (e3)
          return { data: { index: t2, overflows: T2 }, reset: { placement: e3 } };
        let n3 = "bottom";
        switch (h2) {
          case "bestFit": {
            var L2;
            const t3 = null == (L2 = T2.map((t4) => [t4, t4.overflows.filter((t5) => t5 > 0).reduce((t5, e4) => t5 + e4, 0)]).sort((t4, e4) => t4[1] - e4[1])[0]) ? void 0 : L2[0].placement;
            t3 && (n3 = t3);
            break;
          }
          case "initialPlacement":
            n3 = l2;
        }
        if (i2 !== n3)
          return { reset: { placement: n3 } };
      }
      return {};
    } };
  };
  function R$1(t2, e2) {
    return { top: t2.top - e2.height, right: t2.right - e2.width, bottom: t2.bottom - e2.height, left: t2.left - e2.width };
  }
  function A(t2) {
    return x$1.some((e2) => t2[e2] >= 0);
  }
  const P = function(t2) {
    let { strategy: e2 = "referenceHidden", ...n2 } = void 0 === t2 ? {} : t2;
    return { name: "hide", async fn(t3) {
      const { rects: r2 } = t3;
      switch (e2) {
        case "referenceHidden": {
          const e3 = R$1(await s$1(t3, { ...n2, elementContext: "reference" }), r2.reference);
          return { data: { referenceHiddenOffsets: e3, referenceHidden: A(e3) } };
        }
        case "escaped": {
          const e3 = R$1(await s$1(t3, { ...n2, altBoundary: true }), r2.floating);
          return { data: { escapedOffsets: e3, escaped: A(e3) } };
        }
        default:
          return {};
      }
    } };
  };
  const T$1 = function(r2) {
    return void 0 === r2 && (r2 = 0), { name: "offset", options: r2, async fn(i2) {
      const { x: o2, y: a2 } = i2, l2 = await async function(r3, i3) {
        const { placement: o3, platform: a3, elements: l3 } = r3, s2 = await (null == a3.isRTL ? void 0 : a3.isRTL(l3.floating)), c2 = t(o3), f2 = e(o3), u2 = "x" === n$1(o3), m2 = ["left", "top"].includes(c2) ? -1 : 1, g2 = s2 && u2 ? -1 : 1, d2 = "function" == typeof i3 ? i3(r3) : i3;
        let { mainAxis: p2, crossAxis: h2, alignmentAxis: y2 } = "number" == typeof d2 ? { mainAxis: d2, crossAxis: 0, alignmentAxis: null } : { mainAxis: 0, crossAxis: 0, alignmentAxis: null, ...d2 };
        return f2 && "number" == typeof y2 && (h2 = "end" === f2 ? -1 * y2 : y2), u2 ? { x: h2 * g2, y: p2 * m2 } : { x: p2 * m2, y: h2 * g2 };
      }(i2, r2);
      return { x: o2 + l2.x, y: a2 + l2.y, data: l2 };
    } };
  };
  function O(t2) {
    return "x" === t2 ? "y" : "x";
  }
  const D$1 = function(e2) {
    return void 0 === e2 && (e2 = {}), { name: "shift", options: e2, async fn(r2) {
      const { x: i2, y: o2, placement: a2 } = r2, { mainAxis: l2 = true, crossAxis: c2 = false, limiter: f2 = { fn: (t2) => {
        let { x: e3, y: n2 } = t2;
        return { x: e3, y: n2 };
      } }, ...m2 } = e2, g2 = { x: i2, y: o2 }, d2 = await s$1(r2, m2), p2 = n$1(t(a2)), h2 = O(p2);
      let y2 = g2[p2], x2 = g2[h2];
      if (l2) {
        const t2 = "y" === p2 ? "bottom" : "right";
        y2 = u$1(y2 + d2["y" === p2 ? "top" : "left"], y2, y2 - d2[t2]);
      }
      if (c2) {
        const t2 = "y" === h2 ? "bottom" : "right";
        x2 = u$1(x2 + d2["y" === h2 ? "top" : "left"], x2, x2 - d2[t2]);
      }
      const w2 = f2.fn({ ...r2, [p2]: y2, [h2]: x2 });
      return { ...w2, data: { x: w2.x - i2, y: w2.y - o2 } };
    } };
  }, L$1 = function(e2) {
    return void 0 === e2 && (e2 = {}), { options: e2, fn(r2) {
      const { x: i2, y: o2, placement: a2, rects: l2, middlewareData: s2 } = r2, { offset: c2 = 0, mainAxis: f2 = true, crossAxis: u2 = true } = e2, m2 = { x: i2, y: o2 }, g2 = n$1(a2), d2 = O(g2);
      let p2 = m2[g2], h2 = m2[d2];
      const y2 = "function" == typeof c2 ? c2({ ...l2, placement: a2 }) : c2, x2 = "number" == typeof y2 ? { mainAxis: y2, crossAxis: 0 } : { mainAxis: 0, crossAxis: 0, ...y2 };
      if (f2) {
        const t2 = "y" === g2 ? "height" : "width", e3 = l2.reference[g2] - l2.floating[t2] + x2.mainAxis, n2 = l2.reference[g2] + l2.reference[t2] - x2.mainAxis;
        p2 < e3 ? p2 = e3 : p2 > n2 && (p2 = n2);
      }
      if (u2) {
        var w2, v2, b2, R2;
        const e3 = "y" === g2 ? "width" : "height", n2 = ["top", "left"].includes(t(a2)), r3 = l2.reference[d2] - l2.floating[e3] + (n2 && null != (w2 = null == (v2 = s2.offset) ? void 0 : v2[d2]) ? w2 : 0) + (n2 ? 0 : x2.crossAxis), i3 = l2.reference[d2] + l2.reference[e3] + (n2 ? 0 : null != (b2 = null == (R2 = s2.offset) ? void 0 : R2[d2]) ? b2 : 0) - (n2 ? x2.crossAxis : 0);
        h2 < r3 ? h2 = r3 : h2 > i3 && (h2 = i3);
      }
      return { [g2]: p2, [d2]: h2 };
    } };
  }, k = function(n2) {
    return void 0 === n2 && (n2 = {}), { name: "size", options: n2, async fn(r2) {
      const { placement: i2, rects: o2, platform: a2, elements: l2 } = r2, { apply: c2, ...u2 } = n2, m2 = await s$1(r2, u2), g2 = t(i2), d2 = e(i2);
      let p2, h2;
      "top" === g2 || "bottom" === g2 ? (p2 = g2, h2 = d2 === (await (null == a2.isRTL ? void 0 : a2.isRTL(l2.floating)) ? "start" : "end") ? "left" : "right") : (h2 = g2, p2 = "end" === d2 ? "top" : "bottom");
      const y2 = f$1(m2.left, 0), x2 = f$1(m2.right, 0), w2 = f$1(m2.top, 0), v2 = f$1(m2.bottom, 0), b2 = { availableHeight: o2.floating.height - (["left", "right"].includes(i2) ? 2 * (0 !== w2 || 0 !== v2 ? w2 + v2 : f$1(m2.top, m2.bottom)) : m2[p2]), availableWidth: o2.floating.width - (["top", "bottom"].includes(i2) ? 2 * (0 !== y2 || 0 !== x2 ? y2 + x2 : f$1(m2.left, m2.right)) : m2[h2]) }, R2 = await a2.getDimensions(l2.floating);
      null == c2 || c2({ ...r2, ...b2 });
      const A2 = await a2.getDimensions(l2.floating);
      return R2.width !== A2.width || R2.height !== A2.height ? { reset: { rects: true } } : {};
    } };
  };
  function n(t2) {
    return t2 && t2.document && t2.location && t2.alert && t2.setInterval;
  }
  function o$1(t2) {
    if (null == t2)
      return window;
    if (!n(t2)) {
      const e2 = t2.ownerDocument;
      return e2 && e2.defaultView || window;
    }
    return t2;
  }
  function i(t2) {
    return o$1(t2).getComputedStyle(t2);
  }
  function r(t2) {
    return n(t2) ? "" : t2 ? (t2.nodeName || "").toLowerCase() : "";
  }
  function l() {
    const t2 = navigator.userAgentData;
    return null != t2 && t2.brands ? t2.brands.map((t3) => t3.brand + "/" + t3.version).join(" ") : navigator.userAgent;
  }
  function c(t2) {
    return t2 instanceof o$1(t2).HTMLElement;
  }
  function f(t2) {
    return t2 instanceof o$1(t2).Element;
  }
  function s(t2) {
    if ("undefined" == typeof ShadowRoot)
      return false;
    return t2 instanceof o$1(t2).ShadowRoot || t2 instanceof ShadowRoot;
  }
  function u(t2) {
    const { overflow: e2, overflowX: n2, overflowY: o2 } = i(t2);
    return /auto|scroll|overlay|hidden/.test(e2 + o2 + n2);
  }
  function d(t2) {
    return ["table", "td", "th"].includes(r(t2));
  }
  function h(t2) {
    const e2 = /firefox/i.test(l()), n2 = i(t2);
    return "none" !== n2.transform || "none" !== n2.perspective || "paint" === n2.contain || ["transform", "perspective"].includes(n2.willChange) || e2 && "filter" === n2.willChange || e2 && !!n2.filter && "none" !== n2.filter;
  }
  function a() {
    return !/^((?!chrome|android).)*safari/i.test(l());
  }
  const g = Math.min, p$1 = Math.max, m = Math.round;
  function w(t2, e2, n2) {
    var i2, r2, l2, s2;
    void 0 === e2 && (e2 = false), void 0 === n2 && (n2 = false);
    const u2 = t2.getBoundingClientRect();
    let d2 = 1, h2 = 1;
    e2 && c(t2) && (d2 = t2.offsetWidth > 0 && m(u2.width) / t2.offsetWidth || 1, h2 = t2.offsetHeight > 0 && m(u2.height) / t2.offsetHeight || 1);
    const g2 = f(t2) ? o$1(t2) : window, p2 = !a() && n2, w2 = (u2.left + (p2 && null != (i2 = null == (r2 = g2.visualViewport) ? void 0 : r2.offsetLeft) ? i2 : 0)) / d2, v2 = (u2.top + (p2 && null != (l2 = null == (s2 = g2.visualViewport) ? void 0 : s2.offsetTop) ? l2 : 0)) / h2, y2 = u2.width / d2, x2 = u2.height / h2;
    return { width: y2, height: x2, top: v2, right: w2 + y2, bottom: v2 + x2, left: w2, x: w2, y: v2 };
  }
  function v(t2) {
    return (e2 = t2, (e2 instanceof o$1(e2).Node ? t2.ownerDocument : t2.document) || window.document).documentElement;
    var e2;
  }
  function y(t2) {
    return f(t2) ? { scrollLeft: t2.scrollLeft, scrollTop: t2.scrollTop } : { scrollLeft: t2.pageXOffset, scrollTop: t2.pageYOffset };
  }
  function x(t2) {
    return w(v(t2)).left + y(t2).scrollLeft;
  }
  function b(t2, e2, n2) {
    const o2 = c(e2), i2 = v(e2), l2 = w(t2, o2 && function(t3) {
      const e3 = w(t3);
      return m(e3.width) !== t3.offsetWidth || m(e3.height) !== t3.offsetHeight;
    }(e2), "fixed" === n2);
    let f2 = { scrollLeft: 0, scrollTop: 0 };
    const s2 = { x: 0, y: 0 };
    if (o2 || !o2 && "fixed" !== n2)
      if (("body" !== r(e2) || u(i2)) && (f2 = y(e2)), c(e2)) {
        const t3 = w(e2, true);
        s2.x = t3.x + e2.clientLeft, s2.y = t3.y + e2.clientTop;
      } else
        i2 && (s2.x = x(i2));
    return { x: l2.left + f2.scrollLeft - s2.x, y: l2.top + f2.scrollTop - s2.y, width: l2.width, height: l2.height };
  }
  function L(t2) {
    return "html" === r(t2) ? t2 : t2.assignedSlot || t2.parentNode || (s(t2) ? t2.host : null) || v(t2);
  }
  function R(t2) {
    return c(t2) && "fixed" !== getComputedStyle(t2).position ? t2.offsetParent : null;
  }
  function T(t2) {
    const e2 = o$1(t2);
    let n2 = R(t2);
    for (; n2 && d(n2) && "static" === getComputedStyle(n2).position; )
      n2 = R(n2);
    return n2 && ("html" === r(n2) || "body" === r(n2) && "static" === getComputedStyle(n2).position && !h(n2)) ? e2 : n2 || function(t3) {
      let e3 = L(t3);
      for (s(e3) && (e3 = e3.host); c(e3) && !["html", "body"].includes(r(e3)); ) {
        if (h(e3))
          return e3;
        e3 = e3.parentNode;
      }
      return null;
    }(t2) || e2;
  }
  function W(t2) {
    if (c(t2))
      return { width: t2.offsetWidth, height: t2.offsetHeight };
    const e2 = w(t2);
    return { width: e2.width, height: e2.height };
  }
  function E(t2) {
    const e2 = L(t2);
    return ["html", "body", "#document"].includes(r(e2)) ? t2.ownerDocument.body : c(e2) && u(e2) ? e2 : E(e2);
  }
  function H(t2, e2) {
    var n2;
    void 0 === e2 && (e2 = []);
    const i2 = E(t2), r2 = i2 === (null == (n2 = t2.ownerDocument) ? void 0 : n2.body), l2 = o$1(i2), c2 = r2 ? [l2].concat(l2.visualViewport || [], u(i2) ? i2 : []) : i2, f2 = e2.concat(c2);
    return r2 ? f2 : f2.concat(H(c2));
  }
  function C(e2, n2, r2) {
    return "viewport" === n2 ? l$1(function(t2, e3) {
      const n3 = o$1(t2), i2 = v(t2), r3 = n3.visualViewport;
      let l2 = i2.clientWidth, c2 = i2.clientHeight, f2 = 0, s2 = 0;
      if (r3) {
        l2 = r3.width, c2 = r3.height;
        const t3 = a();
        (t3 || !t3 && "fixed" === e3) && (f2 = r3.offsetLeft, s2 = r3.offsetTop);
      }
      return { width: l2, height: c2, x: f2, y: s2 };
    }(e2, r2)) : f(n2) ? function(t2, e3) {
      const n3 = w(t2, false, "fixed" === e3), o2 = n3.top + t2.clientTop, i2 = n3.left + t2.clientLeft;
      return { top: o2, left: i2, x: i2, y: o2, right: i2 + t2.clientWidth, bottom: o2 + t2.clientHeight, width: t2.clientWidth, height: t2.clientHeight };
    }(n2, r2) : l$1(function(t2) {
      var e3;
      const n3 = v(t2), o2 = y(t2), r3 = null == (e3 = t2.ownerDocument) ? void 0 : e3.body, l2 = p$1(n3.scrollWidth, n3.clientWidth, r3 ? r3.scrollWidth : 0, r3 ? r3.clientWidth : 0), c2 = p$1(n3.scrollHeight, n3.clientHeight, r3 ? r3.scrollHeight : 0, r3 ? r3.clientHeight : 0);
      let f2 = -o2.scrollLeft + x(t2);
      const s2 = -o2.scrollTop;
      return "rtl" === i(r3 || n3).direction && (f2 += p$1(n3.clientWidth, r3 ? r3.clientWidth : 0) - l2), { width: l2, height: c2, x: f2, y: s2 };
    }(v(e2)));
  }
  function S(t2) {
    const e2 = H(t2), n2 = ["absolute", "fixed"].includes(i(t2).position) && c(t2) ? T(t2) : t2;
    return f(n2) ? e2.filter((t3) => f(t3) && function(t4, e3) {
      const n3 = null == e3.getRootNode ? void 0 : e3.getRootNode();
      if (t4.contains(e3))
        return true;
      if (n3 && s(n3)) {
        let n4 = e3;
        do {
          if (n4 && t4 === n4)
            return true;
          n4 = n4.parentNode || n4.host;
        } while (n4);
      }
      return false;
    }(t3, n2) && "body" !== r(t3)) : [];
  }
  const D = { getClippingRect: function(t2) {
    let { element: e2, boundary: n2, rootBoundary: o2, strategy: i2 } = t2;
    const r2 = [..."clippingAncestors" === n2 ? S(e2) : [].concat(n2), o2], l2 = r2[0], c2 = r2.reduce((t3, n3) => {
      const o3 = C(e2, n3, i2);
      return t3.top = p$1(o3.top, t3.top), t3.right = g(o3.right, t3.right), t3.bottom = g(o3.bottom, t3.bottom), t3.left = p$1(o3.left, t3.left), t3;
    }, C(e2, l2, i2));
    return { width: c2.right - c2.left, height: c2.bottom - c2.top, x: c2.left, y: c2.top };
  }, convertOffsetParentRelativeRectToViewportRelativeRect: function(t2) {
    let { rect: e2, offsetParent: n2, strategy: o2 } = t2;
    const i2 = c(n2), l2 = v(n2);
    if (n2 === l2)
      return e2;
    let f2 = { scrollLeft: 0, scrollTop: 0 };
    const s2 = { x: 0, y: 0 };
    if ((i2 || !i2 && "fixed" !== o2) && (("body" !== r(n2) || u(l2)) && (f2 = y(n2)), c(n2))) {
      const t3 = w(n2, true);
      s2.x = t3.x + n2.clientLeft, s2.y = t3.y + n2.clientTop;
    }
    return { ...e2, x: e2.x - f2.scrollLeft + s2.x, y: e2.y - f2.scrollTop + s2.y };
  }, isElement: f, getDimensions: W, getOffsetParent: T, getDocumentElement: v, getElementRects: (t2) => {
    let { reference: e2, floating: n2, strategy: o2 } = t2;
    return { reference: b(e2, T(n2), o2), floating: { ...W(n2), x: 0, y: 0 } };
  }, getClientRects: (t2) => Array.from(t2.getClientRects()), isRTL: (t2) => "rtl" === i(t2).direction };
  function N(t2, e2, n2, o2) {
    void 0 === o2 && (o2 = {});
    const { ancestorScroll: i2 = true, ancestorResize: r2 = true, elementResize: l2 = true, animationFrame: c2 = false } = o2, s2 = i2 && !c2, u2 = r2 && !c2, d2 = s2 || u2 ? [...f(t2) ? H(t2) : [], ...H(e2)] : [];
    d2.forEach((t3) => {
      s2 && t3.addEventListener("scroll", n2, { passive: true }), u2 && t3.addEventListener("resize", n2);
    });
    let h2, a2 = null;
    if (l2) {
      let o3 = true;
      a2 = new ResizeObserver(() => {
        o3 || n2(), o3 = false;
      }), f(t2) && !c2 && a2.observe(t2), a2.observe(e2);
    }
    let g2 = c2 ? w(t2) : null;
    return c2 && function e3() {
      const o3 = w(t2);
      !g2 || o3.x === g2.x && o3.y === g2.y && o3.width === g2.width && o3.height === g2.height || n2();
      g2 = o3, h2 = requestAnimationFrame(e3);
    }(), n2(), () => {
      var t3;
      d2.forEach((t4) => {
        s2 && t4.removeEventListener("scroll", n2), u2 && t4.removeEventListener("resize", n2);
      }), null == (t3 = a2) || t3.disconnect(), a2 = null, c2 && cancelAnimationFrame(h2);
    };
  }
  const z = (t2, n2, o2) => o$2(t2, n2, { platform: D, ...o2 });
  var index$1 = typeof document !== "undefined" ? y$2 : p$3;
  function deepEqual(a2, b2) {
    if (a2 === b2) {
      return true;
    }
    if (typeof a2 !== typeof b2) {
      return false;
    }
    if (typeof a2 === "function" && a2.toString() === b2.toString()) {
      return true;
    }
    let length, i2, keys;
    if (a2 && b2 && typeof a2 == "object") {
      if (Array.isArray(a2)) {
        length = a2.length;
        if (length != b2.length)
          return false;
        for (i2 = length; i2-- !== 0; ) {
          if (!deepEqual(a2[i2], b2[i2])) {
            return false;
          }
        }
        return true;
      }
      keys = Object.keys(a2);
      length = keys.length;
      if (length !== Object.keys(b2).length) {
        return false;
      }
      for (i2 = length; i2-- !== 0; ) {
        if (!Object.prototype.hasOwnProperty.call(b2, keys[i2])) {
          return false;
        }
      }
      for (i2 = length; i2-- !== 0; ) {
        const key2 = keys[i2];
        if (key2 === "_owner" && a2.$$typeof) {
          continue;
        }
        if (!deepEqual(a2[key2], b2[key2])) {
          return false;
        }
      }
      return true;
    }
    return a2 !== a2 && b2 !== b2;
  }
  function useLatestRef(value) {
    const ref = _$1(value);
    index$1(() => {
      ref.current = value;
    });
    return ref;
  }
  function useFloating(_temp) {
    let {
      middleware,
      placement = "bottom",
      strategy = "absolute",
      whileElementsMounted
    } = _temp === void 0 ? {} : _temp;
    const reference = _$1(null);
    const floating = _$1(null);
    const whileElementsMountedRef = useLatestRef(whileElementsMounted);
    const cleanupRef = _$1(null);
    const [data, setData] = h$2({
      // Setting these to `null` will allow the consumer to determine if
      // `computePosition()` has run yet
      x: null,
      y: null,
      strategy,
      placement,
      middlewareData: {}
    });
    const [latestMiddleware, setLatestMiddleware] = h$2(middleware);
    if (!deepEqual(latestMiddleware == null ? void 0 : latestMiddleware.map((_ref) => {
      let {
        options: options2
      } = _ref;
      return options2;
    }), middleware == null ? void 0 : middleware.map((_ref2) => {
      let {
        options: options2
      } = _ref2;
      return options2;
    }))) {
      setLatestMiddleware(middleware);
    }
    const update = T$3(() => {
      if (!reference.current || !floating.current) {
        return;
      }
      z(reference.current, floating.current, {
        middleware: latestMiddleware,
        placement,
        strategy
      }).then((data2) => {
        if (isMountedRef.current) {
          pn(() => {
            setData(data2);
          });
        }
      });
    }, [latestMiddleware, placement, strategy]);
    index$1(() => {
      if (isMountedRef.current) {
        update();
      }
    }, [update]);
    const isMountedRef = _$1(false);
    index$1(() => {
      isMountedRef.current = true;
      return () => {
        isMountedRef.current = false;
      };
    }, []);
    const runElementMountCallback = T$3(() => {
      if (typeof cleanupRef.current === "function") {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      if (reference.current && floating.current) {
        if (whileElementsMountedRef.current) {
          const cleanupFn = whileElementsMountedRef.current(reference.current, floating.current, update);
          cleanupRef.current = cleanupFn;
        } else {
          update();
        }
      }
    }, [update, whileElementsMountedRef]);
    const setReference = T$3((node2) => {
      reference.current = node2;
      runElementMountCallback();
    }, [runElementMountCallback]);
    const setFloating = T$3((node2) => {
      floating.current = node2;
      runElementMountCallback();
    }, [runElementMountCallback]);
    const refs = F$1(() => ({
      reference,
      floating
    }), []);
    return F$1(() => ({
      ...data,
      update,
      refs,
      reference: setReference,
      floating: setFloating
    }), [data, update, refs, setReference, setFloating]);
  }
  const arrow = (options2) => {
    const {
      element: element2,
      padding
    } = options2;
    function isRef(value) {
      return Object.prototype.hasOwnProperty.call(value, "current");
    }
    return {
      name: "arrow",
      options: options2,
      fn(args) {
        if (isRef(element2)) {
          if (element2.current != null) {
            return m$1({
              element: element2.current,
              padding
            }).fn(args);
          }
          return {};
        } else if (element2) {
          return m$1({
            element: element2,
            padding
          }).fn(args);
        }
        return {};
      }
    };
  };
  const $5e63c961fc1ce211$export$8c6ed5c666ac1360 = /* @__PURE__ */ k$1((props, forwardedRef) => {
    const { children, ...slotProps } = props;
    const childrenArray = O$1.toArray(children);
    const slottable = childrenArray.find($5e63c961fc1ce211$var$isSlottable);
    if (slottable) {
      const newElement = slottable.props.children;
      const newChildren = childrenArray.map((child) => {
        if (child === slottable) {
          if (O$1.count(newElement) > 1)
            return O$1.only(null);
          return /* @__PURE__ */ an(newElement) ? newElement.props.children : null;
        } else
          return child;
      });
      return /* @__PURE__ */ y$3($5e63c961fc1ce211$var$SlotClone, _extends({}, slotProps, {
        ref: forwardedRef
      }), /* @__PURE__ */ an(newElement) ? /* @__PURE__ */ sn(newElement, void 0, newChildren) : null);
    }
    return /* @__PURE__ */ y$3($5e63c961fc1ce211$var$SlotClone, _extends({}, slotProps, {
      ref: forwardedRef
    }), children);
  });
  $5e63c961fc1ce211$export$8c6ed5c666ac1360.displayName = "Slot";
  const $5e63c961fc1ce211$var$SlotClone = /* @__PURE__ */ k$1((props, forwardedRef) => {
    const { children, ...slotProps } = props;
    if (/* @__PURE__ */ an(children))
      return /* @__PURE__ */ sn(children, {
        ...$5e63c961fc1ce211$var$mergeProps(slotProps, children.props),
        ref: $6ed0406888f73fc4$export$43e446d32b3d21af(forwardedRef, children.ref)
      });
    return O$1.count(children) > 1 ? O$1.only(null) : null;
  });
  $5e63c961fc1ce211$var$SlotClone.displayName = "SlotClone";
  const $5e63c961fc1ce211$export$d9f1ccf0bdb05d45 = ({ children }) => {
    return /* @__PURE__ */ y$3(_$2, null, children);
  };
  function $5e63c961fc1ce211$var$isSlottable(child) {
    return /* @__PURE__ */ an(child) && child.type === $5e63c961fc1ce211$export$d9f1ccf0bdb05d45;
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
    "form",
    "h2",
    "h3",
    "img",
    "input",
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
    const Node = /* @__PURE__ */ k$1((props, forwardedRef) => {
      const { asChild, ...primitiveProps } = props;
      const Comp = asChild ? $5e63c961fc1ce211$export$8c6ed5c666ac1360 : node2;
      p$3(() => {
        window[Symbol.for("radix-ui")] = true;
      }, []);
      return /* @__PURE__ */ y$3(Comp, _extends({}, primitiveProps, {
        ref: forwardedRef
      }));
    });
    Node.displayName = `Primitive.${node2}`;
    return {
      ...primitive,
      [node2]: Node
    };
  }, {});
  function $8927f6f2acc4f386$export$6d1a0317bde7de7f(target, event) {
    if (target)
      pn(
        () => target.dispatchEvent(event)
      );
  }
  const $7e8f5cd07187803e$export$21b07c8f274aebd5 = /* @__PURE__ */ k$1((props, forwardedRef) => {
    const { children, width = 10, height = 5, ...arrowProps } = props;
    return /* @__PURE__ */ y$3($8927f6f2acc4f386$export$250ffa63cdc0d034.svg, _extends({}, arrowProps, {
      ref: forwardedRef,
      width,
      height,
      viewBox: "0 0 30 10",
      preserveAspectRatio: "none"
    }), props.asChild ? children : /* @__PURE__ */ y$3("polygon", {
      points: "0,0 30,0 15,10"
    }));
  });
  const $7e8f5cd07187803e$export$be92b6f5f03c0fe9 = $7e8f5cd07187803e$export$21b07c8f274aebd5;
  const $9f79659886946c16$export$e5c5a5f917a5871c = Boolean(globalThis === null || globalThis === void 0 ? void 0 : globalThis.document) ? y$2 : () => {
  };
  function $db6c3485150b8e66$export$1ab7ae714698c4b8(element2) {
    const [size, setSize] = h$2(void 0);
    $9f79659886946c16$export$e5c5a5f917a5871c(() => {
      if (element2) {
        setSize({
          width: element2.offsetWidth,
          height: element2.offsetHeight
        });
        const resizeObserver = new ResizeObserver((entries) => {
          if (!Array.isArray(entries))
            return;
          if (!entries.length)
            return;
          const entry = entries[0];
          let width;
          let height;
          if ("borderBoxSize" in entry) {
            const borderSizeEntry = entry["borderBoxSize"];
            const borderSize = Array.isArray(borderSizeEntry) ? borderSizeEntry[0] : borderSizeEntry;
            width = borderSize["inlineSize"];
            height = borderSize["blockSize"];
          } else {
            width = element2.offsetWidth;
            height = element2.offsetHeight;
          }
          setSize({
            width,
            height
          });
        });
        resizeObserver.observe(element2, {
          box: "border-box"
        });
        return () => resizeObserver.unobserve(element2);
      } else
        setSize(void 0);
    }, [
      element2
    ]);
    return size;
  }
  const $cf1ac5d9fe0e8206$var$POPPER_NAME = "Popper";
  const [$cf1ac5d9fe0e8206$var$createPopperContext, $cf1ac5d9fe0e8206$export$722aac194ae923] = $c512c27ab02ef895$export$50c7b4e9d9f19c1($cf1ac5d9fe0e8206$var$POPPER_NAME);
  const [$cf1ac5d9fe0e8206$var$PopperProvider, $cf1ac5d9fe0e8206$var$usePopperContext] = $cf1ac5d9fe0e8206$var$createPopperContext($cf1ac5d9fe0e8206$var$POPPER_NAME);
  const $cf1ac5d9fe0e8206$export$badac9ada3a0bdf9 = (props) => {
    const { __scopePopper, children } = props;
    const [anchor, setAnchor] = h$2(null);
    return /* @__PURE__ */ y$3($cf1ac5d9fe0e8206$var$PopperProvider, {
      scope: __scopePopper,
      anchor,
      onAnchorChange: setAnchor
    }, children);
  };
  const $cf1ac5d9fe0e8206$var$ANCHOR_NAME = "PopperAnchor";
  const $cf1ac5d9fe0e8206$export$ecd4e1ccab6ed6d = /* @__PURE__ */ k$1((props, forwardedRef) => {
    const { __scopePopper, virtualRef, ...anchorProps } = props;
    const context = $cf1ac5d9fe0e8206$var$usePopperContext($cf1ac5d9fe0e8206$var$ANCHOR_NAME, __scopePopper);
    const ref = _$1(null);
    const composedRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedRef, ref);
    p$3(() => {
      context.onAnchorChange((virtualRef === null || virtualRef === void 0 ? void 0 : virtualRef.current) || ref.current);
    });
    return virtualRef ? null : /* @__PURE__ */ y$3($8927f6f2acc4f386$export$250ffa63cdc0d034.div, _extends({}, anchorProps, {
      ref: composedRefs
    }));
  });
  const $cf1ac5d9fe0e8206$var$CONTENT_NAME = "PopperContent";
  const [$cf1ac5d9fe0e8206$var$PopperContentProvider, $cf1ac5d9fe0e8206$var$useContentContext] = $cf1ac5d9fe0e8206$var$createPopperContext($cf1ac5d9fe0e8206$var$CONTENT_NAME);
  const [$cf1ac5d9fe0e8206$var$PositionContextProvider, $cf1ac5d9fe0e8206$var$usePositionContext] = $cf1ac5d9fe0e8206$var$createPopperContext($cf1ac5d9fe0e8206$var$CONTENT_NAME, {
    hasParent: false,
    positionUpdateFns: /* @__PURE__ */ new Set()
  });
  const $cf1ac5d9fe0e8206$export$bc4ae5855d3c4fc = /* @__PURE__ */ k$1((props, forwardedRef) => {
    var _arrowSize$width, _arrowSize$height, _middlewareData$arrow, _middlewareData$arrow2, _middlewareData$arrow3, _middlewareData$hide, _middlewareData$trans, _middlewareData$trans2;
    const { __scopePopper, side = "bottom", sideOffset = 0, align = "center", alignOffset = 0, arrowPadding = 0, collisionBoundary = [], collisionPadding: collisionPaddingProp = 0, sticky = "partial", hideWhenDetached = false, avoidCollisions = true, onPlaced, ...contentProps } = props;
    const context = $cf1ac5d9fe0e8206$var$usePopperContext($cf1ac5d9fe0e8206$var$CONTENT_NAME, __scopePopper);
    const [content2, setContent] = h$2(null);
    const composedRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(
      forwardedRef,
      (node2) => setContent(node2)
    );
    const [arrow$1, setArrow] = h$2(null);
    const arrowSize = $db6c3485150b8e66$export$1ab7ae714698c4b8(arrow$1);
    const arrowWidth = (_arrowSize$width = arrowSize === null || arrowSize === void 0 ? void 0 : arrowSize.width) !== null && _arrowSize$width !== void 0 ? _arrowSize$width : 0;
    const arrowHeight = (_arrowSize$height = arrowSize === null || arrowSize === void 0 ? void 0 : arrowSize.height) !== null && _arrowSize$height !== void 0 ? _arrowSize$height : 0;
    const desiredPlacement = side + (align !== "center" ? "-" + align : "");
    const collisionPadding = typeof collisionPaddingProp === "number" ? collisionPaddingProp : {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...collisionPaddingProp
    };
    const boundary = Array.isArray(collisionBoundary) ? collisionBoundary : [
      collisionBoundary
    ];
    const hasExplicitBoundaries = boundary.length > 0;
    const detectOverflowOptions = {
      padding: collisionPadding,
      boundary: boundary.filter($cf1ac5d9fe0e8206$var$isNotNull),
      // with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
      altBoundary: hasExplicitBoundaries
    };
    const { reference, floating, strategy, x: x2, y: y2, placement, middlewareData, update } = useFloating({
      // default to `fixed` strategy so users don't have to pick and we also avoid focus scroll issues
      strategy: "fixed",
      placement: desiredPlacement,
      whileElementsMounted: N,
      middleware: [
        $cf1ac5d9fe0e8206$var$anchorCssProperties(),
        T$1({
          mainAxis: sideOffset + arrowHeight,
          alignmentAxis: alignOffset
        }),
        avoidCollisions ? D$1({
          mainAxis: true,
          crossAxis: false,
          limiter: sticky === "partial" ? L$1() : void 0,
          ...detectOverflowOptions
        }) : void 0,
        arrow$1 ? arrow({
          element: arrow$1,
          padding: arrowPadding
        }) : void 0,
        avoidCollisions ? b$1({
          ...detectOverflowOptions
        }) : void 0,
        k({
          ...detectOverflowOptions,
          apply: ({ elements, availableWidth: width, availableHeight: height }) => {
            elements.floating.style.setProperty("--radix-popper-available-width", `${width}px`);
            elements.floating.style.setProperty("--radix-popper-available-height", `${height}px`);
          }
        }),
        $cf1ac5d9fe0e8206$var$transformOrigin({
          arrowWidth,
          arrowHeight
        }),
        hideWhenDetached ? P({
          strategy: "referenceHidden"
        }) : void 0
      ].filter($cf1ac5d9fe0e8206$var$isDefined)
    });
    $9f79659886946c16$export$e5c5a5f917a5871c(() => {
      reference(context.anchor);
    }, [
      reference,
      context.anchor
    ]);
    const isPlaced = x2 !== null && y2 !== null;
    const [placedSide, placedAlign] = $cf1ac5d9fe0e8206$var$getSideAndAlignFromPlacement(placement);
    const handlePlaced = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onPlaced);
    $9f79659886946c16$export$e5c5a5f917a5871c(() => {
      if (isPlaced)
        handlePlaced === null || handlePlaced === void 0 || handlePlaced();
    }, [
      isPlaced,
      handlePlaced
    ]);
    const arrowX = (_middlewareData$arrow = middlewareData.arrow) === null || _middlewareData$arrow === void 0 ? void 0 : _middlewareData$arrow.x;
    const arrowY = (_middlewareData$arrow2 = middlewareData.arrow) === null || _middlewareData$arrow2 === void 0 ? void 0 : _middlewareData$arrow2.y;
    const cannotCenterArrow = ((_middlewareData$arrow3 = middlewareData.arrow) === null || _middlewareData$arrow3 === void 0 ? void 0 : _middlewareData$arrow3.centerOffset) !== 0;
    const [contentZIndex, setContentZIndex] = h$2();
    $9f79659886946c16$export$e5c5a5f917a5871c(() => {
      if (content2)
        setContentZIndex(window.getComputedStyle(content2).zIndex);
    }, [
      content2
    ]);
    const { hasParent, positionUpdateFns } = $cf1ac5d9fe0e8206$var$usePositionContext($cf1ac5d9fe0e8206$var$CONTENT_NAME, __scopePopper);
    const isRoot = !hasParent;
    y$2(() => {
      if (!isRoot) {
        positionUpdateFns.add(update);
        return () => {
          positionUpdateFns.delete(update);
        };
      }
    }, [
      isRoot,
      positionUpdateFns,
      update
    ]);
    $9f79659886946c16$export$e5c5a5f917a5871c(() => {
      if (isRoot && isPlaced)
        Array.from(positionUpdateFns).reverse().forEach(
          (fn2) => requestAnimationFrame(fn2)
        );
    }, [
      isRoot,
      isPlaced,
      positionUpdateFns
    ]);
    const commonProps = {
      "data-side": placedSide,
      "data-align": placedAlign,
      ...contentProps,
      ref: composedRefs,
      style: {
        ...contentProps.style,
        // if the PopperContent hasn't been placed yet (not all measurements done)
        // we prevent animations so that users's animation don't kick in too early referring wrong sides
        animation: !isPlaced ? "none" : void 0,
        // hide the content if using the hide middleware and should be hidden
        opacity: (_middlewareData$hide = middlewareData.hide) !== null && _middlewareData$hide !== void 0 && _middlewareData$hide.referenceHidden ? 0 : void 0
      }
    };
    return /* @__PURE__ */ y$3("div", {
      ref: floating,
      "data-radix-popper-content-wrapper": "",
      style: {
        position: strategy,
        left: 0,
        top: 0,
        transform: isPlaced ? `translate3d(${Math.round(x2)}px, ${Math.round(y2)}px, 0)` : "translate3d(0, -200%, 0)",
        // keep off the page when measuring
        minWidth: "max-content",
        zIndex: contentZIndex,
        ["--radix-popper-transform-origin"]: [
          (_middlewareData$trans = middlewareData.transformOrigin) === null || _middlewareData$trans === void 0 ? void 0 : _middlewareData$trans.x,
          (_middlewareData$trans2 = middlewareData.transformOrigin) === null || _middlewareData$trans2 === void 0 ? void 0 : _middlewareData$trans2.y
        ].join(" ")
      },
      dir: props.dir
    }, /* @__PURE__ */ y$3($cf1ac5d9fe0e8206$var$PopperContentProvider, {
      scope: __scopePopper,
      placedSide,
      onArrowChange: setArrow,
      arrowX,
      arrowY,
      shouldHideArrow: cannotCenterArrow
    }, isRoot ? /* @__PURE__ */ y$3($cf1ac5d9fe0e8206$var$PositionContextProvider, {
      scope: __scopePopper,
      hasParent: true,
      positionUpdateFns
    }, /* @__PURE__ */ y$3($8927f6f2acc4f386$export$250ffa63cdc0d034.div, commonProps)) : /* @__PURE__ */ y$3($8927f6f2acc4f386$export$250ffa63cdc0d034.div, commonProps)));
  });
  const $cf1ac5d9fe0e8206$var$ARROW_NAME = "PopperArrow";
  const $cf1ac5d9fe0e8206$var$OPPOSITE_SIDE = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right"
  };
  const $cf1ac5d9fe0e8206$export$79d62cd4e10a3fd0 = /* @__PURE__ */ k$1(function $cf1ac5d9fe0e8206$export$79d62cd4e10a3fd02(props, forwardedRef) {
    const { __scopePopper, ...arrowProps } = props;
    const contentContext = $cf1ac5d9fe0e8206$var$useContentContext($cf1ac5d9fe0e8206$var$ARROW_NAME, __scopePopper);
    const baseSide = $cf1ac5d9fe0e8206$var$OPPOSITE_SIDE[contentContext.placedSide];
    return (
      // we have to use an extra wrapper because `ResizeObserver` (used by `useSize`)
      // doesn't report size as we'd expect on SVG elements.
      // it reports their bounding box which is effectively the largest path inside the SVG.
      /* @__PURE__ */ y$3("span", {
        ref: contentContext.onArrowChange,
        style: {
          position: "absolute",
          left: contentContext.arrowX,
          top: contentContext.arrowY,
          [baseSide]: 0,
          transformOrigin: {
            top: "",
            right: "0 0",
            bottom: "center 0",
            left: "100% 0"
          }[contentContext.placedSide],
          transform: {
            top: "translateY(100%)",
            right: "translateY(50%) rotate(90deg) translateX(-50%)",
            bottom: `rotate(180deg)`,
            left: "translateY(50%) rotate(-90deg) translateX(50%)"
          }[contentContext.placedSide],
          visibility: contentContext.shouldHideArrow ? "hidden" : void 0
        }
      }, /* @__PURE__ */ y$3($7e8f5cd07187803e$export$be92b6f5f03c0fe9, _extends({}, arrowProps, {
        ref: forwardedRef,
        style: {
          ...arrowProps.style,
          // ensures the element can be measured correctly (mostly for if SVG)
          display: "block"
        }
      })))
    );
  });
  function $cf1ac5d9fe0e8206$var$isDefined(value) {
    return value !== void 0;
  }
  function $cf1ac5d9fe0e8206$var$isNotNull(value) {
    return value !== null;
  }
  const $cf1ac5d9fe0e8206$var$anchorCssProperties = () => ({
    name: "anchorCssProperties",
    fn(data) {
      const { rects, elements } = data;
      const { width, height } = rects.reference;
      elements.floating.style.setProperty("--radix-popper-anchor-width", `${width}px`);
      elements.floating.style.setProperty("--radix-popper-anchor-height", `${height}px`);
      return {};
    }
  });
  const $cf1ac5d9fe0e8206$var$transformOrigin = (options2) => ({
    name: "transformOrigin",
    options: options2,
    fn(data) {
      var _middlewareData$arrow4, _middlewareData$arrow5, _middlewareData$arrow6, _middlewareData$arrow7, _middlewareData$arrow8;
      const { placement, rects, middlewareData } = data;
      const cannotCenterArrow = ((_middlewareData$arrow4 = middlewareData.arrow) === null || _middlewareData$arrow4 === void 0 ? void 0 : _middlewareData$arrow4.centerOffset) !== 0;
      const isArrowHidden = cannotCenterArrow;
      const arrowWidth = isArrowHidden ? 0 : options2.arrowWidth;
      const arrowHeight = isArrowHidden ? 0 : options2.arrowHeight;
      const [placedSide, placedAlign] = $cf1ac5d9fe0e8206$var$getSideAndAlignFromPlacement(placement);
      const noArrowAlign = {
        start: "0%",
        center: "50%",
        end: "100%"
      }[placedAlign];
      const arrowXCenter = ((_middlewareData$arrow5 = (_middlewareData$arrow6 = middlewareData.arrow) === null || _middlewareData$arrow6 === void 0 ? void 0 : _middlewareData$arrow6.x) !== null && _middlewareData$arrow5 !== void 0 ? _middlewareData$arrow5 : 0) + arrowWidth / 2;
      const arrowYCenter = ((_middlewareData$arrow7 = (_middlewareData$arrow8 = middlewareData.arrow) === null || _middlewareData$arrow8 === void 0 ? void 0 : _middlewareData$arrow8.y) !== null && _middlewareData$arrow7 !== void 0 ? _middlewareData$arrow7 : 0) + arrowHeight / 2;
      let x2 = "";
      let y2 = "";
      if (placedSide === "bottom") {
        x2 = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
        y2 = `${-arrowHeight}px`;
      } else if (placedSide === "top") {
        x2 = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
        y2 = `${rects.floating.height + arrowHeight}px`;
      } else if (placedSide === "right") {
        x2 = `${-arrowHeight}px`;
        y2 = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
      } else if (placedSide === "left") {
        x2 = `${rects.floating.width + arrowHeight}px`;
        y2 = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
      }
      return {
        data: {
          x: x2,
          y: y2
        }
      };
    }
  });
  function $cf1ac5d9fe0e8206$var$getSideAndAlignFromPlacement(placement) {
    const [side, align = "center"] = placement.split("-");
    return [
      side,
      align
    ];
  }
  const $cf1ac5d9fe0e8206$export$be92b6f5f03c0fe9 = $cf1ac5d9fe0e8206$export$badac9ada3a0bdf9;
  const $cf1ac5d9fe0e8206$export$b688253958b8dfe7 = $cf1ac5d9fe0e8206$export$ecd4e1ccab6ed6d;
  const $cf1ac5d9fe0e8206$export$7c6e2c02157bb7d2 = $cf1ac5d9fe0e8206$export$bc4ae5855d3c4fc;
  const $cf1ac5d9fe0e8206$export$21b07c8f274aebd5 = $cf1ac5d9fe0e8206$export$79d62cd4e10a3fd0;
  const $f1701beae083dbae$export$602eac185826482c = /* @__PURE__ */ k$1((props, forwardedRef) => {
    var _globalThis$document;
    const { container = globalThis === null || globalThis === void 0 ? void 0 : (_globalThis$document = globalThis.document) === null || _globalThis$document === void 0 ? void 0 : _globalThis$document.body, ...portalProps } = props;
    return container ? /* @__PURE__ */ Cn.createPortal(/* @__PURE__ */ y$3($8927f6f2acc4f386$export$250ffa63cdc0d034.div, _extends({}, portalProps, {
      ref: forwardedRef
    })), container) : null;
  });
  function $fe963b355347cc68$export$3e6543de14f8614f(initialState, machine) {
    return s$2((state, event) => {
      const nextState = machine[state][event];
      return nextState !== null && nextState !== void 0 ? nextState : state;
    }, initialState);
  }
  const $921a889cee6df7e8$export$99c2b779aa4e8b8b = (props) => {
    const { present, children } = props;
    const presence = $921a889cee6df7e8$var$usePresence(present);
    const child = typeof children === "function" ? children({
      present: presence.isPresent
    }) : O$1.only(children);
    const ref = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(presence.ref, child.ref);
    const forceMount = typeof children === "function";
    return forceMount || presence.isPresent ? /* @__PURE__ */ sn(child, {
      ref
    }) : null;
  };
  $921a889cee6df7e8$export$99c2b779aa4e8b8b.displayName = "Presence";
  function $921a889cee6df7e8$var$usePresence(present) {
    const [node1, setNode] = h$2();
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
    p$3(() => {
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
            pn(
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
      ref: T$3((node2) => {
        if (node2)
          stylesRef.current = getComputedStyle(node2);
        setNode(node2);
      }, [])
    };
  }
  function $921a889cee6df7e8$var$getAnimationName(styles) {
    return (styles === null || styles === void 0 ? void 0 : styles.animationName) || "none";
  }
  function $addc16e1bbe58fd0$export$3a72a57244d6e765(onEscapeKeyDownProp, ownerDocument = globalThis === null || globalThis === void 0 ? void 0 : globalThis.document) {
    const onEscapeKeyDown = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onEscapeKeyDownProp);
    p$3(() => {
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
  const $5cb92bef7577960e$var$DismissableLayerContext = /* @__PURE__ */ F$2({
    layers: /* @__PURE__ */ new Set(),
    layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
    branches: /* @__PURE__ */ new Set()
  });
  const $5cb92bef7577960e$export$177fb62ff3ec1f22 = /* @__PURE__ */ k$1((props, forwardedRef) => {
    var _node$ownerDocument;
    const { disableOutsidePointerEvents = false, onEscapeKeyDown, onPointerDownOutside, onFocusOutside, onInteractOutside, onDismiss, ...layerProps } = props;
    const context = q$1($5cb92bef7577960e$var$DismissableLayerContext);
    const [node1, setNode] = h$2(null);
    const ownerDocument = (_node$ownerDocument = node1 === null || node1 === void 0 ? void 0 : node1.ownerDocument) !== null && _node$ownerDocument !== void 0 ? _node$ownerDocument : globalThis === null || globalThis === void 0 ? void 0 : globalThis.document;
    const [, force] = h$2({});
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
    p$3(() => {
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
    p$3(() => {
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
    p$3(() => {
      const handleUpdate = () => force({});
      document.addEventListener($5cb92bef7577960e$var$CONTEXT_UPDATE, handleUpdate);
      return () => document.removeEventListener($5cb92bef7577960e$var$CONTEXT_UPDATE, handleUpdate);
    }, []);
    return /* @__PURE__ */ y$3($8927f6f2acc4f386$export$250ffa63cdc0d034.div, _extends({}, layerProps, {
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
    p$3(() => {
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
    p$3(() => {
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
  function $5cb92bef7577960e$var$handleAndDispatchCustomEvent(name, handler, detail, { discrete }) {
    const target = detail.originalEvent.target;
    const event = new CustomEvent(name, {
      bubbles: false,
      cancelable: true,
      detail
    });
    if (handler)
      target.addEventListener(name, handler, {
        once: true
      });
    if (discrete)
      $8927f6f2acc4f386$export$6d1a0317bde7de7f(target, event);
    else
      target.dispatchEvent(event);
  }
  let $cef8881cdc69808e$var$originalBodyUserSelect;
  const $cef8881cdc69808e$var$HOVERCARD_NAME = "HoverCard";
  const [$cef8881cdc69808e$var$createHoverCardContext, $cef8881cdc69808e$export$47b6998a836b7260] = $c512c27ab02ef895$export$50c7b4e9d9f19c1($cef8881cdc69808e$var$HOVERCARD_NAME, [
    $cf1ac5d9fe0e8206$export$722aac194ae923
  ]);
  const $cef8881cdc69808e$var$usePopperScope = $cf1ac5d9fe0e8206$export$722aac194ae923();
  const [$cef8881cdc69808e$var$HoverCardProvider, $cef8881cdc69808e$var$useHoverCardContext] = $cef8881cdc69808e$var$createHoverCardContext($cef8881cdc69808e$var$HOVERCARD_NAME);
  const $cef8881cdc69808e$export$57a077cc9fbe653e = (props) => {
    const { __scopeHoverCard, children, open: openProp, defaultOpen, onOpenChange, openDelay = 700, closeDelay = 300 } = props;
    const popperScope = $cef8881cdc69808e$var$usePopperScope(__scopeHoverCard);
    const openTimerRef = _$1(0);
    const closeTimerRef = _$1(0);
    const hasSelectionRef = _$1(false);
    const isPointerDownOnContentRef = _$1(false);
    const [open = false, setOpen] = $71cd76cc60e0454e$export$6f32135080cb4c3({
      prop: openProp,
      defaultProp: defaultOpen,
      onChange: onOpenChange
    });
    const handleOpen = T$3(() => {
      clearTimeout(closeTimerRef.current);
      openTimerRef.current = window.setTimeout(
        () => setOpen(true),
        openDelay
      );
    }, [
      openDelay,
      setOpen
    ]);
    const handleClose = T$3(() => {
      clearTimeout(openTimerRef.current);
      if (!hasSelectionRef.current && !isPointerDownOnContentRef.current)
        closeTimerRef.current = window.setTimeout(
          () => setOpen(false),
          closeDelay
        );
    }, [
      closeDelay,
      setOpen
    ]);
    const handleDismiss = T$3(
      () => setOpen(false),
      [
        setOpen
      ]
    );
    p$3(() => {
      return () => {
        clearTimeout(openTimerRef.current);
        clearTimeout(closeTimerRef.current);
      };
    }, []);
    return /* @__PURE__ */ y$3($cef8881cdc69808e$var$HoverCardProvider, {
      scope: __scopeHoverCard,
      open,
      onOpenChange: setOpen,
      onOpen: handleOpen,
      onClose: handleClose,
      onDismiss: handleDismiss,
      hasSelectionRef,
      isPointerDownOnContentRef
    }, /* @__PURE__ */ y$3($cf1ac5d9fe0e8206$export$be92b6f5f03c0fe9, popperScope, children));
  };
  const $cef8881cdc69808e$var$TRIGGER_NAME = "HoverCardTrigger";
  const $cef8881cdc69808e$export$ef9f7fd8e4ba882f = /* @__PURE__ */ k$1((props, forwardedRef) => {
    const { __scopeHoverCard, ...triggerProps } = props;
    const context = $cef8881cdc69808e$var$useHoverCardContext($cef8881cdc69808e$var$TRIGGER_NAME, __scopeHoverCard);
    const popperScope = $cef8881cdc69808e$var$usePopperScope(__scopeHoverCard);
    return /* @__PURE__ */ y$3($cf1ac5d9fe0e8206$export$b688253958b8dfe7, _extends({
      asChild: true
    }, popperScope), /* @__PURE__ */ y$3($8927f6f2acc4f386$export$250ffa63cdc0d034.a, _extends({
      "data-state": context.open ? "open" : "closed"
    }, triggerProps, {
      ref: forwardedRef,
      onPointerEnter: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onPointerEnter, $cef8881cdc69808e$var$excludeTouch(context.onOpen)),
      onPointerLeave: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onPointerLeave, $cef8881cdc69808e$var$excludeTouch(context.onClose)),
      onFocus: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onFocus, context.onOpen),
      onBlur: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onBlur, context.onClose),
      onTouchStart: $e42e1063c40fb3ef$export$b9ecd428b558ff10(
        props.onTouchStart,
        (event) => event.preventDefault()
      )
    })));
  });
  const $cef8881cdc69808e$var$PORTAL_NAME = "HoverCardPortal";
  const [$cef8881cdc69808e$var$PortalProvider, $cef8881cdc69808e$var$usePortalContext] = $cef8881cdc69808e$var$createHoverCardContext($cef8881cdc69808e$var$PORTAL_NAME, {
    forceMount: void 0
  });
  const $cef8881cdc69808e$export$b384c6e0a789f88b = (props) => {
    const { __scopeHoverCard, forceMount, children, container } = props;
    const context = $cef8881cdc69808e$var$useHoverCardContext($cef8881cdc69808e$var$PORTAL_NAME, __scopeHoverCard);
    return /* @__PURE__ */ y$3($cef8881cdc69808e$var$PortalProvider, {
      scope: __scopeHoverCard,
      forceMount
    }, /* @__PURE__ */ y$3($921a889cee6df7e8$export$99c2b779aa4e8b8b, {
      present: forceMount || context.open
    }, /* @__PURE__ */ y$3($f1701beae083dbae$export$602eac185826482c, {
      asChild: true,
      container
    }, children)));
  };
  const $cef8881cdc69808e$var$CONTENT_NAME = "HoverCardContent";
  const $cef8881cdc69808e$export$aa4724a5938c586 = /* @__PURE__ */ k$1((props, forwardedRef) => {
    const portalContext = $cef8881cdc69808e$var$usePortalContext($cef8881cdc69808e$var$CONTENT_NAME, props.__scopeHoverCard);
    const { forceMount = portalContext.forceMount, ...contentProps } = props;
    const context = $cef8881cdc69808e$var$useHoverCardContext($cef8881cdc69808e$var$CONTENT_NAME, props.__scopeHoverCard);
    return /* @__PURE__ */ y$3($921a889cee6df7e8$export$99c2b779aa4e8b8b, {
      present: forceMount || context.open
    }, /* @__PURE__ */ y$3($cef8881cdc69808e$var$HoverCardContentImpl, _extends({
      "data-state": context.open ? "open" : "closed"
    }, contentProps, {
      onPointerEnter: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onPointerEnter, $cef8881cdc69808e$var$excludeTouch(context.onOpen)),
      onPointerLeave: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onPointerLeave, $cef8881cdc69808e$var$excludeTouch(context.onClose)),
      ref: forwardedRef
    })));
  });
  const $cef8881cdc69808e$var$HoverCardContentImpl = /* @__PURE__ */ k$1((props, forwardedRef) => {
    const { __scopeHoverCard, onEscapeKeyDown, onPointerDownOutside, onFocusOutside, onInteractOutside, ...contentProps } = props;
    const context = $cef8881cdc69808e$var$useHoverCardContext($cef8881cdc69808e$var$CONTENT_NAME, __scopeHoverCard);
    const popperScope = $cef8881cdc69808e$var$usePopperScope(__scopeHoverCard);
    const ref = _$1(null);
    const composedRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedRef, ref);
    const [containSelection, setContainSelection] = h$2(false);
    p$3(() => {
      if (containSelection) {
        const body2 = document.body;
        $cef8881cdc69808e$var$originalBodyUserSelect = body2.style.userSelect || body2.style.webkitUserSelect;
        body2.style.userSelect = "none";
        body2.style.webkitUserSelect = "none";
        return () => {
          body2.style.userSelect = $cef8881cdc69808e$var$originalBodyUserSelect;
          body2.style.webkitUserSelect = $cef8881cdc69808e$var$originalBodyUserSelect;
        };
      }
    }, [
      containSelection
    ]);
    p$3(() => {
      if (ref.current) {
        const handlePointerUp = () => {
          setContainSelection(false);
          context.isPointerDownOnContentRef.current = false;
          setTimeout(() => {
            var _document$getSelectio;
            const hasSelection = ((_document$getSelectio = document.getSelection()) === null || _document$getSelectio === void 0 ? void 0 : _document$getSelectio.toString()) !== "";
            if (hasSelection)
              context.hasSelectionRef.current = true;
          });
        };
        document.addEventListener("pointerup", handlePointerUp);
        return () => {
          document.removeEventListener("pointerup", handlePointerUp);
          context.hasSelectionRef.current = false;
          context.isPointerDownOnContentRef.current = false;
        };
      }
    }, [
      context.isPointerDownOnContentRef,
      context.hasSelectionRef
    ]);
    p$3(() => {
      if (ref.current) {
        const tabbables = $cef8881cdc69808e$var$getTabbableNodes(ref.current);
        tabbables.forEach(
          (tabbable) => tabbable.setAttribute("tabindex", "-1")
        );
      }
    });
    return /* @__PURE__ */ y$3($5cb92bef7577960e$export$177fb62ff3ec1f22, {
      asChild: true,
      disableOutsidePointerEvents: false,
      onInteractOutside,
      onEscapeKeyDown,
      onPointerDownOutside,
      onFocusOutside: $e42e1063c40fb3ef$export$b9ecd428b558ff10(onFocusOutside, (event) => {
        event.preventDefault();
      }),
      onDismiss: context.onDismiss
    }, /* @__PURE__ */ y$3($cf1ac5d9fe0e8206$export$7c6e2c02157bb7d2, _extends({}, popperScope, contentProps, {
      onPointerDown: $e42e1063c40fb3ef$export$b9ecd428b558ff10(contentProps.onPointerDown, (event) => {
        if (event.currentTarget.contains(event.target))
          setContainSelection(true);
        context.hasSelectionRef.current = false;
        context.isPointerDownOnContentRef.current = true;
      }),
      ref: composedRefs,
      style: {
        ...contentProps.style,
        userSelect: containSelection ? "text" : void 0,
        // Safari requires prefix
        WebkitUserSelect: containSelection ? "text" : void 0,
        "--radix-hover-card-content-transform-origin": "var(--radix-popper-transform-origin)",
        "--radix-hover-card-content-available-width": "var(--radix-popper-available-width)",
        "--radix-hover-card-content-available-height": "var(--radix-popper-available-height)",
        "--radix-hover-card-trigger-width": "var(--radix-popper-anchor-width)",
        "--radix-hover-card-trigger-height": "var(--radix-popper-anchor-height)"
      }
    })));
  });
  const $cef8881cdc69808e$export$b9744d3e7456d806 = /* @__PURE__ */ k$1((props, forwardedRef) => {
    const { __scopeHoverCard, ...arrowProps } = props;
    const popperScope = $cef8881cdc69808e$var$usePopperScope(__scopeHoverCard);
    return /* @__PURE__ */ y$3($cf1ac5d9fe0e8206$export$21b07c8f274aebd5, _extends({}, popperScope, arrowProps, {
      ref: forwardedRef
    }));
  });
  function $cef8881cdc69808e$var$excludeTouch(eventHandler) {
    return (event) => event.pointerType === "touch" ? void 0 : eventHandler();
  }
  function $cef8881cdc69808e$var$getTabbableNodes(container) {
    const nodes = [];
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (node2) => {
        return node2.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    while (walker.nextNode())
      nodes.push(walker.currentNode);
    return nodes;
  }
  const $cef8881cdc69808e$export$be92b6f5f03c0fe9 = $cef8881cdc69808e$export$57a077cc9fbe653e;
  const $cef8881cdc69808e$export$41fb9f06171c75f4 = $cef8881cdc69808e$export$ef9f7fd8e4ba882f;
  const $cef8881cdc69808e$export$602eac185826482c = $cef8881cdc69808e$export$b384c6e0a789f88b;
  const $cef8881cdc69808e$export$7c6e2c02157bb7d2 = $cef8881cdc69808e$export$aa4724a5938c586;
  const $cef8881cdc69808e$export$21b07c8f274aebd5 = $cef8881cdc69808e$export$b9744d3e7456d806;
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
            --meta-title: #616c77;
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
            --meta-title: #959faa;
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

        .metadata_container {
            display: flex;
            flex-direction: column;
            margin-top: 8px;
            padding-left: 1rem;
        }

        .metadata_item {
            display: flex;
            flex-direction: row;
            align-items: center;
            border-radius: 16px;
            padding: 4px 0.5rem;
        }

        .metadata_item:hover {
            background-color: rgba(0,0,0,.1);
        }

        .metadata_item > div:first-child {
            flex: 0 1 100px;
            color: var(--meta-title);
        }

        .metadata_item > div:last-child {
            flex: 1;
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

        .author.GPT-3 {
            background-color: rgb(16, 163, 127);
        }

        .author.GPT-4 {
            background-color: black;
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
            {{details}}
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
  function dateStr(date = /* @__PURE__ */ new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  function timestamp() {
    return (/* @__PURE__ */ new Date()).toISOString().replace(/:/g, "-").replace(/\..+/, "");
  }
  function getColorScheme() {
    return document.documentElement.style.getPropertyValue("color-scheme");
  }
  function downloadFile(filename, type, content2) {
    const blob = content2 instanceof Blob ? content2 : new Blob([content2], {
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
  function getFileNameWithFormat(format, ext, {
    title = document.title,
    // chatId will be empty when exporting all conversations
    chatId = ""
  } = {}) {
    const _title = sanitizeFilename(title).replace(/\s+/g, "_");
    return format.replace("{title}", _title).replace("{date}", dateStr()).replace("{timestamp}", timestamp()).replace("{chat_id}", chatId).concat(`.${ext}`);
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
  function normalize(value) {
    return value.toLowerCase();
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
  function mark(values, key2, value) {
    if (value) {
      values[key2] = value;
    }
  }
  const own$7 = {}.hasOwnProperty;
  function create(definition2) {
    const property = {};
    const normal = {};
    let prop;
    for (prop in definition2.properties) {
      if (own$7.call(definition2.properties, prop)) {
        const value = definition2.properties[prop];
        const info = new DefinedInfo(
          prop,
          definition2.transform(definition2.attributes || {}, prop),
          value,
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
  const html$5 = create({
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
  function find(schema, value) {
    const normal = normalize(value);
    let prop = value;
    let Type = Info;
    if (normal in schema.normal) {
      return schema.property[schema.normal[normal]];
    }
    if (normal.length > 4 && normal.slice(0, 4) === "data" && valid.test(value)) {
      if (value.charAt(4) === "-") {
        const rest = value.slice(5).replace(dash, camelcase);
        prop = "data" + rest.charAt(0).toUpperCase() + rest.slice(1);
      } else {
        const rest = value.slice(4);
        if (!dash.test(rest)) {
          let dashes = rest.replace(cap, kebab);
          if (dashes.charAt(0) !== "-") {
            dashes = "-" + dashes;
          }
          value = "data" + dashes;
        }
      }
      Type = DefinedInfo;
    }
    return new Type(prop, value);
  }
  function kebab($0) {
    return "-" + $0.toLowerCase();
  }
  function camelcase($0) {
    return $0.charAt(1).toUpperCase();
  }
  const html$4 = merge([xml, xlink, xmlns, aria, html$5], "html");
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
  const own$6 = {}.hasOwnProperty;
  function zwitch(key2, options2) {
    const settings = options2 || {};
    function one2(value, ...parameters) {
      let fn2 = one2.invalid;
      const handlers2 = one2.handlers;
      if (value && own$6.call(value, key2)) {
        const id = String(value[key2]);
        fn2 = own$6.call(handlers2, id) ? handlers2[id] : one2.unknown;
      }
      if (fn2) {
        return fn2.call(this, value, ...parameters);
      }
    }
    one2.handlers = settings.handlers || {};
    one2.invalid = settings.invalid;
    one2.unknown = settings.unknown;
    return one2;
  }
  function core(value, options2) {
    value = value.replace(
      options2.subset ? charactersToExpression(options2.subset) : /["&'<>`]/g,
      basic
    );
    if (options2.subset || options2.escapeOnly) {
      return value;
    }
    return value.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, surrogate).replace(
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
    const value = "&#x" + code2.toString(16).toUpperCase();
    return omit && next && !/[\dA-Fa-f]/.test(String.fromCharCode(next)) ? value : value + ";";
  }
  function toDecimal(code2, next, omit) {
    const value = "&#" + String(code2);
    return omit && next && !/\d/.test(String.fromCharCode(next)) ? value : value + ";";
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
  const own$5 = {}.hasOwnProperty;
  const characters = {};
  let key;
  for (key in characterEntitiesHtml4) {
    if (own$5.call(characterEntitiesHtml4, key)) {
      characters[characterEntitiesHtml4[key]] = key;
    }
  }
  function toNamed(code2, next, omit, attribute) {
    const character = String.fromCharCode(code2);
    if (own$5.call(characters, character)) {
      const name = characters[character];
      const value = "&" + name;
      if (omit && characterEntitiesLegacy.includes(name) && !dangerous.includes(name) && (!attribute || next && next !== 61 && /[^\da-z]/i.test(String.fromCharCode(next)))) {
        return value;
      }
      return value + ";";
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
  function stringifyEntities(value, options2) {
    return core(value, Object.assign({ format: formatSmart }, options2));
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
  function ccount(value, character) {
    const source = String(value);
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
    const value = (
      // @ts-expect-error looks like a node.
      thing && typeof thing === "object" && thing.type === "text" ? (
        // @ts-expect-error looks like a text.
        thing.value || ""
      ) : thing
    );
    return typeof value === "string" && value.replace(/[ \t\n\f\r]/g, "") === "";
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
  const own$4 = {}.hasOwnProperty;
  function omission(handlers2) {
    return omit;
    function omit(node2, index2, parent) {
      return own$4.call(handlers2, node2.tagName) && handlers2[node2.tagName](node2, index2, parent);
    }
  }
  const closing = omission({
    html: html$3,
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
  function html$3(_2, index2, parent) {
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
    html: html$2,
    head,
    body,
    colgroup,
    tbody
  });
  function html$2(node2) {
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
  function element$1(node2, index2, parent, state) {
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
          const value = serializeAttribute(state, key2, props[key2]);
          if (value)
            values.push(value);
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
  function serializeAttribute(state, key2, value) {
    const info = find(state.schema, key2);
    const x2 = state.settings.allowParseErrors && state.schema.space === "html" ? 0 : 1;
    const y2 = state.settings.allowDangerousCharacters ? 0 : 1;
    let quote = state.quote;
    let result;
    if (info.overloadedBoolean && (value === info.attribute || value === "")) {
      value = true;
    } else if (info.boolean || info.overloadedBoolean && typeof value !== "string") {
      value = Boolean(value);
    }
    if (value === void 0 || value === null || value === false || typeof value === "number" && Number.isNaN(value)) {
      return "";
    }
    const name = stringifyEntities(
      info.attribute,
      Object.assign({}, state.settings.characterReferences, {
        // Always encode without parse errors in non-HTML.
        subset: constants.name[x2][y2]
      })
    );
    if (value === true)
      return name;
    value = Array.isArray(value) ? (info.commaSeparated ? stringify$1 : stringify)(value, {
      padLeft: !state.settings.tightCommaSeparatedLists
    }) : String(value);
    if (state.settings.collapseEmptyAttributes && !value)
      return name;
    if (state.settings.preferUnquoted) {
      result = stringifyEntities(
        value,
        Object.assign({}, state.settings.characterReferences, {
          subset: constants.unquoted[x2][y2],
          attribute: true
        })
      );
    }
    if (result !== value) {
      if (state.settings.quoteSmart && ccount(value, quote) > ccount(value, state.alternative)) {
        quote = state.alternative;
      }
      result = quote + stringifyEntities(
        value,
        Object.assign({}, state.settings.characterReferences, {
          // Always encode without parse errors in non-HTML.
          subset: (quote === "'" ? constants.single : constants.double)[x2][y2],
          attribute: true
        })
      ) + quote;
    }
    return name + (result ? "=" + result : result);
  }
  function text$5(node2, _2, parent, state) {
    return parent && parent.type === "element" && (parent.tagName === "script" || parent.tagName === "style") ? node2.value : stringifyEntities(
      node2.value,
      Object.assign({}, state.settings.characterReferences, {
        subset: ["<", "&"]
      })
    );
  }
  function raw(node2, index2, parent, state) {
    return state.settings.allowDangerousHtml ? node2.value : text$5(node2, index2, parent, state);
  }
  function root$2(node2, _1, _2, state) {
    return state.all(node2);
  }
  const handle$1 = zwitch("type", {
    invalid: invalid$1,
    unknown: unknown$1,
    handlers: { comment, doctype, element: element$1, raw, root: root$2, text: text$5 }
  });
  function invalid$1(node2) {
    throw new Error("Expected node, not `" + node2 + "`");
  }
  function unknown$1(node2) {
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
      one: one$2,
      all: all$2,
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
      schema: options_.space === "svg" ? svg : html$4,
      quote,
      alternative
    };
    return state.one(
      Array.isArray(tree) ? { type: "root", children: tree } : tree,
      void 0,
      void 0
    );
  }
  function one$2(node2, index2, parent) {
    return handle$1(node2, index2, parent, this);
  }
  function all$2(parent) {
    const results = [];
    const children = parent && parent.children || [];
    let index2 = -1;
    while (++index2 < children.length) {
      results[index2] = this.one(children[index2], index2, parent);
    }
    return results.join("");
  }
  const emptyOptions = {};
  function toString(value, options2) {
    const settings = options2 || emptyOptions;
    const includeImageAlt = typeof settings.includeImageAlt === "boolean" ? settings.includeImageAlt : true;
    const includeHtml = typeof settings.includeHtml === "boolean" ? settings.includeHtml : true;
    return one$1(value, includeImageAlt, includeHtml);
  }
  function one$1(value, includeImageAlt, includeHtml) {
    if (node(value)) {
      if ("value" in value) {
        return value.type === "html" && !includeHtml ? "" : value.value;
      }
      if (includeImageAlt && "alt" in value && value.alt) {
        return value.alt;
      }
      if ("children" in value) {
        return all$1(value.children, includeImageAlt, includeHtml);
      }
    }
    if (Array.isArray(value)) {
      return all$1(value, includeImageAlt, includeHtml);
    }
    return "";
  }
  function all$1(values, includeImageAlt, includeHtml) {
    const result = [];
    let index2 = -1;
    while (++index2 < values.length) {
      result[index2] = one$1(values[index2], includeImageAlt, includeHtml);
    }
    return result.join("");
  }
  function node(value) {
    return Boolean(value && typeof value === "object");
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
        const value = right[code2];
        constructs(
          // @ts-expect-error Looks like a list.
          left[code2],
          Array.isArray(value) ? value : value ? [value] : []
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
  const content$1 = {
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
      const close = !before || before === 2 && after || attentionMarkers2.includes(previous2);
      token._open = Boolean(marker === 42 ? open : open && (before || !close));
      token._close = Boolean(marker === 42 ? close : close && (after || !open));
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
  const element = document.createElement("i");
  function decodeNamedCharacterReference(value) {
    const characterReference2 = "&" + value + ";";
    element.innerHTML = characterReference2;
    const char = element.textContent;
    if (char.charCodeAt(char.length - 1) === 59 && value !== "semi") {
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
      return value(code2);
    }
    function numeric(code2) {
      if (code2 === 88 || code2 === 120) {
        effects.enter("characterReferenceMarkerHexadecimal");
        effects.consume(code2);
        effects.exit("characterReferenceMarkerHexadecimal");
        effects.enter("characterReferenceValue");
        max = 6;
        test = asciiHexDigit;
        return value;
      }
      effects.enter("characterReferenceValue");
      max = 7;
      test = asciiDigit;
      return value(code2);
    }
    function value(code2) {
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
        return value;
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
  const content = {
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
  function normalizeIdentifier(value) {
    return value.replace(/[\t\n\r ]+/g, " ").replace(/^ | $/g, "").toLowerCase().toUpperCase();
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
    let close;
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
      } else if (close) {
        if (events[index2][0] === "enter" && (token.type === "labelImage" || token.type === "labelLink") && !token._balanced) {
          open = index2;
          if (token.type !== "labelLink") {
            offset = 2;
            break;
          }
        }
      } else if (token.type === "labelEnd") {
        close = index2;
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
      end: Object.assign({}, events[close][1].end)
    };
    const text2 = {
      type: "labelText",
      start: Object.assign({}, events[open + offset + 2][1].end),
      end: Object.assign({}, events[close - 2][1].start)
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
        events.slice(open + offset + 4, close - 3),
        context
      )
    );
    media = push(media, [
      ["exit", text2, context],
      events[close - 2],
      events[close - 1],
      ["exit", label, context]
    ]);
    media = push(media, events.slice(close + 1));
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
            effects.attempt(content, afterConstruct)
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
  const text$4 = initializeFactory("text");
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
    function defineSkip(value) {
      columnStart[value.line] = value.column;
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
      let value;
      if (typeof chunk === "string") {
        value = chunk;
      } else
        switch (chunk) {
          case -5: {
            value = "\r";
            break;
          }
          case -4: {
            value = "\n";
            break;
          }
          case -3: {
            value = "\r\n";
            break;
          }
          case -2: {
            value = expandTabs ? " " : "	";
            break;
          }
          case -1: {
            if (!expandTabs && atTab)
              continue;
            value = " ";
            break;
          }
          default: {
            value = String.fromCharCode(chunk);
          }
        }
      atTab = chunk === -2;
      result.push(value);
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
  const text$3 = {
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
    text: text$3
  }, Symbol.toStringTag, { value: "Module" }));
  function parse$1(options2 = {}) {
    const constructs2 = combineExtensions(
      // @ts-expect-error Same as above.
      [defaultConstructs].concat(options2.extensions || [])
    );
    const parser = {
      defined: [],
      lazy: {},
      constructs: constructs2,
      content: create2(content$1),
      document: create2(document$2),
      flow: create2(flow$1),
      string: create2(string$1),
      text: create2(text$4)
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
    function preprocessor(value, encoding, end) {
      const chunks = [];
      let match;
      let next;
      let startPosition;
      let endPosition;
      let code2;
      value = buffer + value.toString(encoding);
      startPosition = 0;
      buffer = "";
      if (start) {
        if (value.charCodeAt(0) === 65279) {
          startPosition++;
        }
        start = void 0;
      }
      while (startPosition < value.length) {
        search.lastIndex = startPosition;
        match = search.exec(value);
        endPosition = match && match.index !== void 0 ? match.index : value.length;
        code2 = value.charCodeAt(endPosition);
        if (!match) {
          buffer = value.slice(startPosition);
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
            chunks.push(value.slice(startPosition, endPosition));
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
  function decodeNumericCharacterReference(value, base) {
    const code2 = Number.parseInt(value, base);
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
  function decodeString(value) {
    return value.replace(characterEscapeOrReference, decode);
  }
  function decode($0, $1, $2) {
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
  function stringifyPosition(value) {
    if (!value || typeof value !== "object") {
      return "";
    }
    if ("position" in value || "type" in value) {
      return position$1(value.position);
    }
    if ("start" in value || "end" in value) {
      return position$1(value);
    }
    if ("line" in value || "column" in value) {
      return point$2(value);
    }
    return "";
  }
  function point$2(point2) {
    return index(point2 && point2.line) + ":" + index(point2 && point2.column);
  }
  function position$1(pos) {
    return point$2(pos && pos.start) + "-" + point$2(pos && pos.end);
  }
  function index(value) {
    return value && typeof value === "number" ? value : 1;
  }
  const own$3 = {}.hasOwnProperty;
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
    function(value, encoding, options2) {
      if (typeof encoding !== "string") {
        options2 = encoding;
        encoding = void 0;
      }
      return compiler(options2)(
        postprocess(
          // @ts-expect-error: micromark types need to accept `null`.
          parse$1(options2).document().write(preprocess()(value, encoding, true))
        )
      );
    }
  );
  function compiler(options2) {
    const config = {
      transforms: [],
      canContainEols: ["emphasis", "fragment", "heading", "paragraph", "strong"],
      enter: {
        autolink: opener(link2),
        autolinkProtocol: onenterdata,
        autolinkEmail: onenterdata,
        atxHeading: opener(heading2),
        blockQuote: opener(blockQuote2),
        characterEscape: onenterdata,
        characterReference: onenterdata,
        codeFenced: opener(codeFlow),
        codeFencedFenceInfo: buffer,
        codeFencedFenceMeta: buffer,
        codeIndented: opener(codeFlow, buffer),
        codeText: opener(codeText2, buffer),
        codeTextData: onenterdata,
        data: onenterdata,
        codeFlowValue: onenterdata,
        definition: opener(definition2),
        definitionDestinationString: buffer,
        definitionLabelString: buffer,
        definitionTitleString: buffer,
        emphasis: opener(emphasis2),
        hardBreakEscape: opener(hardBreak2),
        hardBreakTrailing: opener(hardBreak2),
        htmlFlow: opener(html2, buffer),
        htmlFlowData: onenterdata,
        htmlText: opener(html2, buffer),
        htmlTextData: onenterdata,
        image: opener(image2),
        label: buffer,
        link: opener(link2),
        listItem: opener(listItem2),
        listItemValue: onenterlistitemvalue,
        listOrdered: opener(list2, onenterlistordered),
        listUnordered: opener(list2),
        paragraph: opener(paragraph2),
        reference: onenterreference,
        referenceString: buffer,
        resourceDestinationString: buffer,
        resourceTitleString: buffer,
        setextHeading: opener(heading2),
        strong: opener(strong2),
        thematicBreak: opener(thematicBreak2)
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
        const handler = config[events[index2][0]];
        if (own$3.call(handler, events[index2][1].type)) {
          handler[events[index2][1].type].call(
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
        const handler = tail[1] || defaultOnError;
        handler.call(context, void 0, tail[0]);
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
    function setData(key2, value) {
      data[key2] = value;
    }
    function getData(key2) {
      return data[key2];
    }
    function opener(create2, and) {
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
      return close;
      function close(token) {
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
          const handler = open[1] || defaultOnError;
          handler.call(this, token, open[0]);
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
      const value = this.resume();
      const node2 = this.stack[this.stack.length - 1];
      setData("inReference", true);
      if (node2.type === "link") {
        const children = fragment.children;
        node2.children = children;
      } else {
        node2.alt = value;
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
      let value;
      if (type) {
        value = decodeNumericCharacterReference(
          data2,
          type === "characterReferenceMarkerNumeric" ? 10 : 16
        );
        setData("characterReferenceType");
      } else {
        const result = decodeNamedCharacterReference(data2);
        value = result;
      }
      const tail = this.stack.pop();
      tail.value += value;
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
      const value = extensions[index2];
      if (Array.isArray(value)) {
        configure$1(combined, value);
      } else {
        extension(combined, value);
      }
    }
  }
  function extension(combined, extension2) {
    let key2;
    for (key2 in extension2) {
      if (own$3.call(extension2, key2)) {
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
  function escapeStringRegexp(string2) {
    if (typeof string2 !== "string") {
      throw new TypeError("Expected a string");
    }
    return string2.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
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
  function color(d2) {
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
        const value = node2 && typeof node2 === "object" ? node2 : {};
        if (typeof value.type === "string") {
          const name = (
            // `hast`
            typeof value.tagName === "string" ? value.tagName : (
              // `xast`
              typeof value.name === "string" ? value.name : void 0
            )
          );
          Object.defineProperty(visit2, "name", {
            value: "node (" + color(node2.type + (name ? "<" + name + ">" : "")) + ")"
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
  function toResult(value) {
    if (Array.isArray(value)) {
      return value;
    }
    if (typeof value === "number") {
      return [CONTINUE, value];
    }
    return [value];
  }
  const own$2 = {}.hasOwnProperty;
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
          return handler(node2, parents);
        }
      }
      function handler(node2, parents) {
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
          let value = replace3(...match, matchObject);
          if (typeof value === "string") {
            value = value.length > 0 ? { type: "text", value } : void 0;
          }
          if (value !== false) {
            if (start !== position2) {
              nodes.push({
                type: "text",
                value: node2.value.slice(start, position2)
              });
            }
            if (Array.isArray(value)) {
              nodes.push(...value);
            } else if (value) {
              nodes.push(value);
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
        if (own$2.call(schema, key2)) {
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
  function association(node2) {
    if (node2.label || !node2.identifier) {
      return node2.label || "";
    }
    return decodeString(node2.identifier);
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
  function indentLines(value, map2) {
    const result = [];
    let start = 0;
    let line = 0;
    let match;
    while (match = eol.exec(value)) {
      one2(value.slice(start, match.index));
      result.push(match[0]);
      start = match.index + match[0].length;
      line++;
    }
    one2(value.slice(start));
    return result.join("");
    function one2(value2) {
      result.push(map2(value2, line, !value2));
    }
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
  function safe(state, input, config) {
    const value = (config.before || "") + (input || "") + (config.after || "");
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
      while (match = expression.exec(value)) {
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
    const end = value.length - (config.after ? config.after.length : 0);
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
        result.push(escapeBackslashes(value.slice(start, position2), "\\"));
      }
      start = position2;
      if (/[!-/:-@[-`{-~]/.test(value.charAt(position2)) && (!config.encode || !config.encode.includes(value.charAt(position2)))) {
        result.push("\\");
      } else {
        result.push(
          "&#x" + value.charCodeAt(position2).toString(16).toUpperCase() + ";"
        );
        start++;
      }
    }
    result.push(escapeBackslashes(value.slice(start, end), config.after));
    return result.join("");
  }
  function numerical(a2, b2) {
    return a2 - b2;
  }
  function escapeBackslashes(value, after) {
    const expression = /\\(?=[!-/:-@[-`{-~])/g;
    const positions = [];
    const results = [];
    const whole = value + after;
    let index2 = -1;
    let start = 0;
    let match;
    while (match = expression.exec(whole)) {
      positions.push(match.index);
    }
    while (++index2 < positions.length) {
      if (start !== positions[index2]) {
        results.push(value.slice(start, positions[index2]));
      }
      results.push("\\");
      start = positions[index2];
    }
    results.push(value.slice(start));
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
    function shift(value) {
      lineShift += value;
    }
    function move(input) {
      const value = input || "";
      const chunks = value.split(/\r?\n|\r/g);
      const tail = chunks[chunks.length - 1];
      line += chunks.length - 1;
      column = chunks.length === 1 ? column + tail.length : 1 + tail.length + lineShift;
      return value;
    }
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
    let value = tracker.move("[^");
    const exit2 = context.enter("footnoteReference");
    const subexit = context.enter("reference");
    value += tracker.move(
      safe(context, association(node2), {
        ...tracker.current(),
        before: value,
        after: "]"
      })
    );
    subexit();
    exit2();
    value += tracker.move("]");
    return value;
  }
  function footnoteReferencePeek() {
    return "[";
  }
  function footnoteDefinition(node2, _2, context, safeOptions) {
    const tracker = track(safeOptions);
    let value = tracker.move("[^");
    const exit2 = context.enter("footnoteDefinition");
    const subexit = context.enter("label");
    value += tracker.move(
      safe(context, association(node2), {
        ...tracker.current(),
        before: value,
        after: "]"
      })
    );
    subexit();
    value += tracker.move(
      "]:" + (node2.children && node2.children.length > 0 ? " " : "")
    );
    tracker.shift(4);
    value += tracker.move(
      indentLines(containerFlow(node2, context, tracker.current()), map$2)
    );
    exit2();
    return value;
  }
  function map$2(line, index2, blank) {
    if (index2 === 0) {
      return line;
    }
    return (blank ? "" : "    ") + line;
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
    let value = tracker.move("~~");
    value += containerPhrasing(node2, context, {
      ...tracker.current(),
      before: value,
      after: "~"
    });
    value += tracker.move("~~");
    exit2();
    return value;
  }
  function peekDelete() {
    return "~";
  }
  inlineCode$1.peek = inlineCodePeek;
  function inlineCode$1(node2, _2, state) {
    let value = node2.value || "";
    let sequence = "`";
    let index2 = -1;
    while (new RegExp("(^|[^`])" + sequence + "([^`]|$)").test(value)) {
      sequence += "`";
    }
    if (/[^ \r\n]/.test(value) && (/^[ \r\n]/.test(value) && /[ \r\n]$/.test(value) || /^`|`$/.test(value))) {
      value = " " + value + " ";
    }
    while (++index2 < state.unsafe.length) {
      const pattern = state.unsafe[index2];
      const expression = patternCompile(pattern);
      let match;
      if (!pattern.atBreak)
        continue;
      while (match = expression.exec(value)) {
        let position2 = match.index;
        if (value.charCodeAt(position2) === 10 && value.charCodeAt(position2 - 1) === 13) {
          position2--;
        }
        value = value.slice(0, position2) + " " + value.slice(match.index + 1);
      }
    }
    return sequence + value + sequence;
  }
  function inlineCodePeek() {
    return "`";
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
  function serialize(value) {
    return value === null || value === void 0 ? "" : String(value);
  }
  function defaultStringLength(value) {
    return value.length;
  }
  function toAlignment(value) {
    const code2 = typeof value === "string" ? value.codePointAt(0) : 0;
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
    let value = this.resume();
    if (this.getData("inTable")) {
      value = value.replace(/\\([\\|])/g, replace);
    }
    const node2 = (
      /** @type {InlineCode} */
      this.stack[this.stack.length - 1]
    );
    node2.value = value;
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
      const value = serializeData([row]);
      return value.slice(0, value.indexOf("\n"));
    }
    function handleTableCell(node2, _2, context, safeOptions) {
      const exit2 = context.enter("tableCell");
      const subexit = context.enter("phrasing");
      const value = containerPhrasing(node2, context, {
        ...safeOptions,
        before: around,
        after: around
      });
      subexit();
      exit2();
      return value;
    }
    function serializeData(matrix, align) {
      return markdownTable(matrix, {
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
      let value = inlineCode$1(node2, parent, context);
      if (context.stack.includes("tableCell")) {
        value = value.replace(/\|/g, "\\$&");
      }
      return value;
    }
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
    const value = state.indentLines(
      state.containerFlow(node2, tracker.current()),
      map2
    );
    exit2();
    return value;
    function map2(line, index2, blank) {
      if (index2) {
        return (blank ? "" : " ".repeat(size)) + line;
      }
      return (blank ? bullet : bullet + " ".repeat(size - bullet.length)) + line;
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
    let value = listItem$1(node2, parent, context, {
      ...safeOptions,
      ...tracker.current()
    });
    if (checkable) {
      value = value.replace(/^(?:[*+-]|\d+\.)([\r\n]| {1,3})/, check);
    }
    return value;
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
  function blockquote$1(state, node2) {
    const result = {
      type: "element",
      tagName: "blockquote",
      properties: {},
      children: state.wrap(state.all(node2), true)
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }
  function hardBreak$1(state, node2) {
    const result = { type: "element", tagName: "br", properties: {}, children: [] };
    state.patch(node2, result);
    return [state.applyData(node2, result), { type: "text", value: "\n" }];
  }
  function code$2(state, node2) {
    const value = node2.value ? node2.value + "\n" : "";
    const lang = node2.lang ? node2.lang.match(/^[^ \t]+(?=[ \t]|$)/) : null;
    const properties = {};
    if (lang) {
      properties.className = ["language-" + lang];
    }
    let result = {
      type: "element",
      tagName: "code",
      properties,
      children: [{ type: "text", value }]
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
  function emphasis$1(state, node2) {
    const result = {
      type: "element",
      tagName: "em",
      properties: {},
      children: state.all(node2)
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }
  function normalizeUri(value) {
    const result = [];
    let index2 = -1;
    let start = 0;
    let skip = 0;
    while (++index2 < value.length) {
      const code2 = value.charCodeAt(index2);
      let replace2 = "";
      if (code2 === 37 && asciiAlphanumeric(value.charCodeAt(index2 + 1)) && asciiAlphanumeric(value.charCodeAt(index2 + 2))) {
        skip = 2;
      } else if (code2 < 128) {
        if (!/[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(code2))) {
          replace2 = String.fromCharCode(code2);
        }
      } else if (code2 > 55295 && code2 < 57344) {
        const next = value.charCodeAt(index2 + 1);
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
        result.push(value.slice(start, index2), encodeURIComponent(replace2));
        start = index2 + skip + 1;
        replace2 = "";
      }
      if (skip) {
        index2 += skip;
        skip = 0;
      }
    }
    return result.join("") + value.slice(start);
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
  function heading$1(state, node2) {
    const result = {
      type: "element",
      tagName: "h" + node2.depth,
      properties: {},
      children: state.all(node2)
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }
  function html$1(state, node2) {
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
  function imageReference$1(state, node2) {
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
  function linkReference$1(state, node2) {
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
  function link$1(state, node2) {
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
  function list$1(state, node2) {
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
  function paragraph$1(state, node2) {
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
  function strong$1(state, node2) {
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
  function position(node2) {
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
  function trimLines(value) {
    const source = String(value);
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
  function trimLine(value, start, end) {
    let startIndex = 0;
    let endIndex = value.length;
    if (start) {
      let code2 = value.codePointAt(startIndex);
      while (code2 === tab || code2 === space) {
        startIndex++;
        code2 = value.codePointAt(startIndex);
      }
    }
    if (end) {
      let code2 = value.codePointAt(endIndex - 1);
      while (code2 === tab || code2 === space) {
        endIndex--;
        code2 = value.codePointAt(endIndex - 1);
      }
    }
    return endIndex > startIndex ? value.slice(startIndex, endIndex) : "";
  }
  function text$2(state, node2) {
    const result = { type: "text", value: trimLines(String(node2.value)) };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }
  function thematicBreak$1(state, node2) {
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
    blockquote: blockquote$1,
    break: hardBreak$1,
    code: code$2,
    delete: strikethrough,
    emphasis: emphasis$1,
    footnoteReference,
    footnote,
    heading: heading$1,
    html: html$1,
    imageReference: imageReference$1,
    image: image$1,
    inlineCode,
    linkReference: linkReference$1,
    link: link$1,
    listItem,
    list: list$1,
    paragraph: paragraph$1,
    root: root$1,
    strong: strong$1,
    table,
    tableCell,
    tableRow,
    text: text$2,
    thematicBreak: thematicBreak$1,
    toml: ignore,
    yaml: ignore,
    definition: ignore,
    footnoteDefinition: ignore
  };
  function ignore() {
    return null;
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
  function generated(node2) {
    return !node2 || !node2.position || !node2.position.start || !node2.position.start.line || !node2.position.start.column || !node2.position.end || !node2.position.end.line || !node2.position.end.column;
  }
  const own$1 = {}.hasOwnProperty;
  function definitions(tree) {
    const cache = /* @__PURE__ */ Object.create(null);
    if (!tree || !tree.type) {
      throw new Error("mdast-util-definitions expected node");
    }
    visit(tree, "definition", (definition3) => {
      const id = clean(definition3.identifier);
      if (id && !own$1.call(cache, id)) {
        cache[id] = definition3;
      }
    });
    return definition2;
    function definition2(identifier) {
      const id = clean(identifier);
      return id && own$1.call(cache, id) ? cache[id] : null;
    }
  }
  function clean(value) {
    return String(value || "").toUpperCase();
  }
  const own = {}.hasOwnProperty;
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
      if (!own.call(footnoteById, id)) {
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
      return one(state, node2, parent);
    }
    function allBound(parent) {
      return all(state, parent);
    }
  }
  function patch(from, to) {
    if (from.position)
      to.position = position(from);
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
  function one(state, node2, parent) {
    const type = node2 && node2.type;
    if (!type) {
      throw new Error("Expected node, got `" + node2 + "`");
    }
    if (own.call(state.handlers, type)) {
      return state.handlers[type](state, node2, parent);
    }
    if (state.passThrough && state.passThrough.includes(type)) {
      return "children" in node2 ? { ...node2, children: all(state, node2) } : node2;
    }
    if (state.unknownHandler) {
      return state.unknownHandler(state, node2, parent);
    }
    return defaultUnknownHandler(state, node2);
  }
  function all(state, parent) {
    const values = [];
    if ("children" in parent) {
      const nodes = parent.children;
      let index2 = -1;
      while (++index2 < nodes.length) {
        const result = one(state, nodes[index2], parent);
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
    const result = "value" in node2 && !(own.call(data, "hProperties") || own.call(data, "hChildren")) ? { type: "text", value: node2.value } : {
      type: "element",
      tagName: "div",
      properties: {},
      children: all(state, node2)
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
  function blockquote(node2, _2, state, info) {
    const exit2 = state.enter("blockquote");
    const tracker = state.createTracker(info);
    tracker.move("> ");
    tracker.shift(2);
    const value = state.indentLines(
      state.containerFlow(node2, tracker.current()),
      map$1
    );
    exit2();
    return value;
  }
  function map$1(line, _2, blank) {
    return ">" + (blank ? "" : " ") + line;
  }
  function hardBreak(_2, _1, state, info) {
    let index2 = -1;
    while (++index2 < state.unsafe.length) {
      if (state.unsafe[index2].character === "\n" && patternInScope(state.stack, state.unsafe[index2])) {
        return /[ \t]/.test(info.before) ? "" : " ";
      }
    }
    return "\\\n";
  }
  function longestStreak(value, substring) {
    const source = String(value);
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
  function code$1(node2, _2, state, info) {
    const marker = checkFence(state);
    const raw2 = node2.value || "";
    const suffix = marker === "`" ? "GraveAccent" : "Tilde";
    if (formatCodeAsIndented(node2, state)) {
      const exit3 = state.enter("codeIndented");
      const value2 = state.indentLines(raw2, map);
      exit3();
      return value2;
    }
    const tracker = state.createTracker(info);
    const sequence = marker.repeat(Math.max(longestStreak(raw2, marker) + 1, 3));
    const exit2 = state.enter("codeFenced");
    let value = tracker.move(sequence);
    if (node2.lang) {
      const subexit = state.enter(`codeFencedLang${suffix}`);
      value += tracker.move(
        state.safe(node2.lang, {
          before: value,
          after: " ",
          encode: ["`"],
          ...tracker.current()
        })
      );
      subexit();
    }
    if (node2.lang && node2.meta) {
      const subexit = state.enter(`codeFencedMeta${suffix}`);
      value += tracker.move(" ");
      value += tracker.move(
        state.safe(node2.meta, {
          before: value,
          after: "\n",
          encode: ["`"],
          ...tracker.current()
        })
      );
      subexit();
    }
    value += tracker.move("\n");
    if (raw2) {
      value += tracker.move(raw2 + "\n");
    }
    value += tracker.move(sequence);
    exit2();
    return value;
  }
  function map(line, _2, blank) {
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
    let value = tracker.move("[");
    value += tracker.move(
      state.safe(state.associationId(node2), {
        before: value,
        after: "]",
        ...tracker.current()
      })
    );
    value += tracker.move("]: ");
    subexit();
    if (
      // If there’s no url, or…
      !node2.url || // If there are control characters or whitespace.
      /[\0- \u007F]/.test(node2.url)
    ) {
      subexit = state.enter("destinationLiteral");
      value += tracker.move("<");
      value += tracker.move(
        state.safe(node2.url, { before: value, after: ">", ...tracker.current() })
      );
      value += tracker.move(">");
    } else {
      subexit = state.enter("destinationRaw");
      value += tracker.move(
        state.safe(node2.url, {
          before: value,
          after: node2.title ? " " : "\n",
          ...tracker.current()
        })
      );
    }
    subexit();
    if (node2.title) {
      subexit = state.enter(`title${suffix}`);
      value += tracker.move(" " + quote);
      value += tracker.move(
        state.safe(node2.title, {
          before: value,
          after: quote,
          ...tracker.current()
        })
      );
      value += tracker.move(quote);
      subexit();
    }
    exit2();
    return value;
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
  emphasis.peek = emphasisPeek;
  function emphasis(node2, _2, state, info) {
    const marker = checkEmphasis(state);
    const exit2 = state.enter("emphasis");
    const tracker = state.createTracker(info);
    let value = tracker.move(marker);
    value += tracker.move(
      state.containerPhrasing(node2, {
        before: value,
        after: marker,
        ...tracker.current()
      })
    );
    value += tracker.move(marker);
    exit2();
    return value;
  }
  function emphasisPeek(_2, _1, state) {
    return state.options.emphasis || "*";
  }
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
  function heading(node2, _2, state, info) {
    const rank = Math.max(Math.min(6, node2.depth || 1), 1);
    const tracker = state.createTracker(info);
    if (formatHeadingAsSetext(node2, state)) {
      const exit3 = state.enter("headingSetext");
      const subexit2 = state.enter("phrasing");
      const value2 = state.containerPhrasing(node2, {
        ...tracker.current(),
        before: "\n",
        after: "\n"
      });
      subexit2();
      exit3();
      return value2 + "\n" + (rank === 1 ? "=" : "-").repeat(
        // The whole size…
        value2.length - // Minus the position of the character after the last EOL (or
        // 0 if there is none)…
        (Math.max(value2.lastIndexOf("\r"), value2.lastIndexOf("\n")) + 1)
      );
    }
    const sequence = "#".repeat(rank);
    const exit2 = state.enter("headingAtx");
    const subexit = state.enter("phrasing");
    tracker.move(sequence + " ");
    let value = state.containerPhrasing(node2, {
      before: "# ",
      after: "\n",
      ...tracker.current()
    });
    if (/^[\t ]/.test(value)) {
      value = "&#x" + value.charCodeAt(0).toString(16).toUpperCase() + ";" + value.slice(1);
    }
    value = value ? sequence + " " + value : sequence;
    if (state.options.closeAtx) {
      value += " " + sequence;
    }
    subexit();
    exit2();
    return value;
  }
  html.peek = htmlPeek;
  function html(node2) {
    return node2.value || "";
  }
  function htmlPeek() {
    return "<";
  }
  image.peek = imagePeek;
  function image(node2, _2, state, info) {
    const quote = checkQuote(state);
    const suffix = quote === '"' ? "Quote" : "Apostrophe";
    const exit2 = state.enter("image");
    let subexit = state.enter("label");
    const tracker = state.createTracker(info);
    let value = tracker.move("![");
    value += tracker.move(
      state.safe(node2.alt, { before: value, after: "]", ...tracker.current() })
    );
    value += tracker.move("](");
    subexit();
    if (
      // If there’s no url but there is a title…
      !node2.url && node2.title || // If there are control characters or whitespace.
      /[\0- \u007F]/.test(node2.url)
    ) {
      subexit = state.enter("destinationLiteral");
      value += tracker.move("<");
      value += tracker.move(
        state.safe(node2.url, { before: value, after: ">", ...tracker.current() })
      );
      value += tracker.move(">");
    } else {
      subexit = state.enter("destinationRaw");
      value += tracker.move(
        state.safe(node2.url, {
          before: value,
          after: node2.title ? " " : ")",
          ...tracker.current()
        })
      );
    }
    subexit();
    if (node2.title) {
      subexit = state.enter(`title${suffix}`);
      value += tracker.move(" " + quote);
      value += tracker.move(
        state.safe(node2.title, {
          before: value,
          after: quote,
          ...tracker.current()
        })
      );
      value += tracker.move(quote);
      subexit();
    }
    value += tracker.move(")");
    exit2();
    return value;
  }
  function imagePeek() {
    return "!";
  }
  imageReference.peek = imageReferencePeek;
  function imageReference(node2, _2, state, info) {
    const type = node2.referenceType;
    const exit2 = state.enter("imageReference");
    let subexit = state.enter("label");
    const tracker = state.createTracker(info);
    let value = tracker.move("![");
    const alt = state.safe(node2.alt, {
      before: value,
      after: "]",
      ...tracker.current()
    });
    value += tracker.move(alt + "][");
    subexit();
    const stack = state.stack;
    state.stack = [];
    subexit = state.enter("reference");
    const reference = state.safe(state.associationId(node2), {
      before: value,
      after: "]",
      ...tracker.current()
    });
    subexit();
    state.stack = stack;
    exit2();
    if (type === "full" || !alt || alt !== reference) {
      value += tracker.move(reference + "]");
    } else if (type === "shortcut") {
      value = value.slice(0, -1);
    } else {
      value += tracker.move("]");
    }
    return value;
  }
  function imageReferencePeek() {
    return "!";
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
  link.peek = linkPeek;
  function link(node2, _2, state, info) {
    const quote = checkQuote(state);
    const suffix = quote === '"' ? "Quote" : "Apostrophe";
    const tracker = state.createTracker(info);
    let exit2;
    let subexit;
    if (formatLinkAsAutolink(node2, state)) {
      const stack = state.stack;
      state.stack = [];
      exit2 = state.enter("autolink");
      let value2 = tracker.move("<");
      value2 += tracker.move(
        state.containerPhrasing(node2, {
          before: value2,
          after: ">",
          ...tracker.current()
        })
      );
      value2 += tracker.move(">");
      exit2();
      state.stack = stack;
      return value2;
    }
    exit2 = state.enter("link");
    subexit = state.enter("label");
    let value = tracker.move("[");
    value += tracker.move(
      state.containerPhrasing(node2, {
        before: value,
        after: "](",
        ...tracker.current()
      })
    );
    value += tracker.move("](");
    subexit();
    if (
      // If there’s no url but there is a title…
      !node2.url && node2.title || // If there are control characters or whitespace.
      /[\0- \u007F]/.test(node2.url)
    ) {
      subexit = state.enter("destinationLiteral");
      value += tracker.move("<");
      value += tracker.move(
        state.safe(node2.url, { before: value, after: ">", ...tracker.current() })
      );
      value += tracker.move(">");
    } else {
      subexit = state.enter("destinationRaw");
      value += tracker.move(
        state.safe(node2.url, {
          before: value,
          after: node2.title ? " " : ")",
          ...tracker.current()
        })
      );
    }
    subexit();
    if (node2.title) {
      subexit = state.enter(`title${suffix}`);
      value += tracker.move(" " + quote);
      value += tracker.move(
        state.safe(node2.title, {
          before: value,
          after: quote,
          ...tracker.current()
        })
      );
      value += tracker.move(quote);
      subexit();
    }
    value += tracker.move(")");
    exit2();
    return value;
  }
  function linkPeek(node2, _2, state) {
    return formatLinkAsAutolink(node2, state) ? "<" : "[";
  }
  linkReference.peek = linkReferencePeek;
  function linkReference(node2, _2, state, info) {
    const type = node2.referenceType;
    const exit2 = state.enter("linkReference");
    let subexit = state.enter("label");
    const tracker = state.createTracker(info);
    let value = tracker.move("[");
    const text2 = state.containerPhrasing(node2, {
      before: value,
      after: "]",
      ...tracker.current()
    });
    value += tracker.move(text2 + "][");
    subexit();
    const stack = state.stack;
    state.stack = [];
    subexit = state.enter("reference");
    const reference = state.safe(state.associationId(node2), {
      before: value,
      after: "]",
      ...tracker.current()
    });
    subexit();
    state.stack = stack;
    exit2();
    if (type === "full" || !text2 || text2 !== reference) {
      value += tracker.move(reference + "]");
    } else if (type === "shortcut") {
      value = value.slice(0, -1);
    } else {
      value += tracker.move("]");
    }
    return value;
  }
  function linkReferencePeek() {
    return "[";
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
  function list(node2, parent, state, info) {
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
    const value = state.containerFlow(node2, info);
    state.bulletLastUsed = bullet;
    state.bulletCurrent = bulletCurrent;
    exit2();
    return value;
  }
  function paragraph(node2, _2, state, info) {
    const exit2 = state.enter("paragraph");
    const subexit = state.enter("phrasing");
    const value = state.containerPhrasing(node2, info);
    subexit();
    exit2();
    return value;
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
  function root(node2, _2, state, info) {
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
  strong.peek = strongPeek;
  function strong(node2, _2, state, info) {
    const marker = checkStrong(state);
    const exit2 = state.enter("strong");
    const tracker = state.createTracker(info);
    let value = tracker.move(marker + marker);
    value += tracker.move(
      state.containerPhrasing(node2, {
        before: value,
        after: marker,
        ...tracker.current()
      })
    );
    value += tracker.move(marker + marker);
    exit2();
    return value;
  }
  function strongPeek(_2, _1, state) {
    return state.options.strong || "*";
  }
  function text$1(node2, _2, state, info) {
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
  function thematicBreak(_2, _1, state) {
    const value = (checkRule(state) + (state.options.ruleSpaces ? " " : "")).repeat(checkRuleRepetition(state));
    return state.options.ruleSpaces ? value.slice(0, -1) : value;
  }
  const handle = {
    blockquote,
    break: hardBreak,
    code: code$1,
    definition,
    emphasis,
    hardBreak,
    heading,
    html,
    image,
    imageReference,
    inlineCode: inlineCode$1,
    link,
    linkReference,
    list,
    listItem: listItem$1,
    paragraph,
    root,
    strong,
    text: text$1,
    thematicBreak
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
    configure(state, { unsafe, join, handlers: handle });
    configure(state, options2);
    if (state.options.tightDefinitions) {
      configure(state, { join: [joinDefinition] });
    }
    state.handle = zwitch("type", {
      invalid,
      unknown,
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
  function invalid(value) {
    throw new Error("Cannot handle value `" + value + "`, expected node");
  }
  function unknown(node2) {
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
  function safeBound(value, config) {
    return safe(this, value, config);
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
  const text = {};
  const gfmAutolinkLiteral = {
    text
  };
  let code = 48;
  while (code < 123) {
    text[code] = emailAutolink;
    code++;
    if (code === 58)
      code = 65;
    else if (code === 91)
      code = 97;
  }
  text[43] = emailAutolink;
  text[45] = emailAutolink;
  text[46] = emailAutolink;
  text[95] = emailAutolink;
  text[72] = [emailAutolink, httpAutolink];
  text[104] = [emailAutolink, httpAutolink];
  text[87] = [emailAutolink, wwwAutolink];
  text[119] = [emailAutolink, wwwAutolink];
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
      if (id.codePointAt(0) !== 94 || !defined.includes(id.slice(1))) {
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
      if (
        // Too long.
        size > 999 || // Closing brace with nothing.
        code2 === 93 && !data || // Space or tab is not supported by GFM for some reason.
        // `\n` and `[` not being supported makes sense.
        code2 === null || code2 === 91 || markdownLineEndingOrSpace(code2)
      ) {
        return nok(code2);
      }
      if (code2 === 93) {
        effects.exit("chunkString");
        const token = effects.exit("gfmFootnoteCallString");
        if (!defined.includes(normalizeIdentifier(self2.sliceSerialize(token)))) {
          return nok(code2);
        }
        effects.enter("gfmFootnoteCallLabelMarker");
        effects.consume(code2);
        effects.exit("gfmFootnoteCallLabelMarker");
        effects.exit("gfmFootnoteCall");
        return ok2;
      }
      if (!markdownLineEndingOrSpace(code2)) {
        data = true;
      }
      size++;
      effects.consume(code2);
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
      return labelAtMarker;
    }
    function labelAtMarker(code2) {
      if (code2 === 94) {
        effects.enter("gfmFootnoteDefinitionMarker");
        effects.consume(code2);
        effects.exit("gfmFootnoteDefinitionMarker");
        effects.enter("gfmFootnoteDefinitionLabelString");
        effects.enter("chunkString").contentType = "string";
        return labelInside;
      }
      return nok(code2);
    }
    function labelInside(code2) {
      if (
        // Too long.
        size > 999 || // Closing brace with nothing.
        code2 === 93 && !data || // Space or tab is not supported by GFM for some reason.
        // `\n` and `[` not being supported makes sense.
        code2 === null || code2 === 91 || markdownLineEndingOrSpace(code2)
      ) {
        return nok(code2);
      }
      if (code2 === 93) {
        effects.exit("chunkString");
        const token = effects.exit("gfmFootnoteDefinitionLabelString");
        identifier = normalizeIdentifier(self2.sliceSerialize(token));
        effects.enter("gfmFootnoteDefinitionLabelMarker");
        effects.consume(code2);
        effects.exit("gfmFootnoteDefinitionLabelMarker");
        effects.exit("gfmFootnoteDefinitionLabel");
        return labelAfter;
      }
      if (!markdownLineEndingOrSpace(code2)) {
        data = true;
      }
      size++;
      effects.consume(code2);
      return code2 === 92 ? labelEscape : labelInside;
    }
    function labelEscape(code2) {
      if (code2 === 91 || code2 === 92 || code2 === 93) {
        effects.consume(code2);
        size++;
        return labelInside;
      }
      return labelInside(code2);
    }
    function labelAfter(code2) {
      if (code2 === 58) {
        effects.enter("definitionMarker");
        effects.consume(code2);
        effects.exit("definitionMarker");
        if (!defined.includes(identifier)) {
          defined.push(identifier);
        }
        return factorySpace(
          effects,
          whitespaceAfter,
          "gfmFootnoteDefinitionWhitespace"
        );
      }
      return nok(code2);
    }
    function whitespaceAfter(code2) {
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
  function gfmStrikethrough(options2) {
    const options_ = options2 || {};
    let single = options_.singleTilde;
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
              const insideSpan2 = context.parser.constructs.insideSpan.null;
              if (insideSpan2) {
                splice(
                  nextEvents,
                  nextEvents.length,
                  0,
                  // @ts-expect-error: to do: update `mdast-util-types` to allow explicit `undefined`s.
                  resolveAll(insideSpan2, events.slice(open + 1, index2), context)
                );
              }
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
        return close;
      }
      if (code2 === 88 || code2 === 120) {
        effects.enter("taskListCheckValueChecked");
        effects.consume(code2);
        effects.exit("taskListCheckValueChecked");
        return close;
      }
      return nok(code2);
    }
    function close(code2) {
      if (code2 === 93) {
        effects.enter("taskListCheckMarker");
        effects.consume(code2);
        effects.exit("taskListCheckMarker");
        effects.exit("taskListCheck");
        return after;
      }
      return nok(code2);
    }
    function after(code2) {
      if (markdownLineEnding(code2)) {
        return ok2(code2);
      }
      if (markdownSpace(code2)) {
        return effects.check(
          {
            tokenize: spaceThenNonSpace
          },
          ok2,
          nok
        )(code2);
      }
      return nok(code2);
    }
  }
  function spaceThenNonSpace(effects, ok2, nok) {
    return factorySpace(effects, after, "whitespace");
    function after(code2) {
      return code2 === null ? nok(code2) : ok2(code2);
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
  function fromMarkdown(content2) {
    return fromMarkdown$1(content2, {
      extensions: [gfm()],
      mdastExtensions: [gfmFromMarkdown()]
    });
  }
  function toMarkdown(ast) {
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
      extensions: [gfmToMarkdown()]
    });
  }
  function toHtml(node2) {
    return toHtml$1(toHast(node2));
  }
  function flatMap(tree, fn2) {
    function transform(node2, i2, parent) {
      if ("children" in node2) {
        const p2 = node2;
        p2.children = p2.children.flatMap((item, i22) => transform(item, i22, p2));
      }
      return fn2(node2, i2, parent);
    }
    return transform(tree, 0, void 0)[0];
  }
  class GMStorage {
    static get(key2) {
      const item = GM_getValue(key2, "");
      if (item) {
        try {
          return JSON.parse(item);
        } catch {
          return null;
        }
      }
      return null;
    }
    static set(key2, value) {
      const item = JSON.stringify(value);
      GM_setValue(key2, item);
    }
    static delete(key2) {
      GM_deleteValue(key2);
    }
  }
  __publicField(GMStorage, "supported", typeof GM_getValue === "function" && typeof GM_setValue === "function" && typeof GM_deleteValue === "function");
  class LocalStorage {
    static get(key2) {
      const item = localStorage.getItem(key2);
      if (item) {
        try {
          return JSON.parse(item);
        } catch {
          return null;
        }
      }
      return null;
    }
    static set(key2, value) {
      const item = JSON.stringify(value);
      localStorage.setItem(key2, item);
    }
    static delete(key2) {
      localStorage.removeItem(key2);
    }
  }
  __publicField(LocalStorage, "supported", typeof localStorage === "object");
  class MemoryStorage {
    static get(key2) {
      const item = this.map.get(key2);
      if (!item)
        return null;
      return item;
    }
    static set(key2, value) {
      this.map.set(key2, value);
    }
    static delete(key2) {
      this.map.delete(key2);
    }
  }
  __publicField(MemoryStorage, "map", /* @__PURE__ */ new Map());
  __publicField(MemoryStorage, "supported", true);
  class ScriptStorage {
    static get(key2) {
      if (GMStorage.supported) {
        try {
          return GMStorage.get(key2);
        } catch {
        }
      }
      if (LocalStorage.supported) {
        try {
          return LocalStorage.get(key2);
        } catch {
        }
      }
      return MemoryStorage.get(key2);
    }
    static set(key2, value) {
      if (GMStorage.supported) {
        try {
          return GMStorage.set(key2, value);
        } catch {
        }
      }
      if (LocalStorage.supported) {
        try {
          return LocalStorage.set(key2, value);
        } catch {
        }
      }
      return MemoryStorage.set(key2, value);
    }
    static delete(key2) {
      if (GMStorage.supported) {
        try {
          return GMStorage.delete(key2);
        } catch {
        }
      }
      if (LocalStorage.supported) {
        try {
          return LocalStorage.delete(key2);
        } catch {
        }
      }
      return MemoryStorage.delete(key2);
    }
  }
  function standardizeLineBreaks(text2) {
    return text2.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  }
  async function exportToHtml(fileNameFormat, metaList) {
    if (!checkIfConversationStarted()) {
      alert("Please start a conversation first.");
      return false;
    }
    const userAvatar = await getUserAvatar();
    const chatId = await getCurrentChatId();
    const rawConversation = await fetchConversation(chatId);
    const conversationChoices = getConversationChoice();
    const conversation = processConversation(rawConversation, conversationChoices);
    const html2 = conversationToHtml(conversation, userAvatar, metaList);
    const fileName = getFileNameWithFormat(fileNameFormat, "html", {
      title: conversation.title,
      chatId
    });
    downloadFile(fileName, "text/html", standardizeLineBreaks(html2));
    return true;
  }
  async function exportAllToHtml(fileNameFormat, apiConversations, metaList) {
    const userAvatar = await getUserAvatar();
    const zip = new JSZip2();
    const conversations = apiConversations.map((x2) => processConversation(x2));
    conversations.forEach((conversation) => {
      const fileName = getFileNameWithFormat(fileNameFormat, "html", {
        title: conversation.title,
        chatId: conversation.id
      });
      const content2 = conversationToHtml(conversation, userAvatar, metaList);
      zip.file(fileName, content2);
    });
    const blob = await zip.generateAsync({
      type: "blob"
    });
    downloadFile("chatgpt-export.zip", "application/zip", blob);
    return true;
  }
  function conversationToHtml(conversation, avatar, metaList) {
    const {
      id,
      title,
      model,
      modelSlug,
      conversationNodes
    } = conversation;
    const conversationHtml = conversationNodes.map((item) => {
      var _a, _b, _c, _d, _e;
      const author = ((_a = item.message) == null ? void 0 : _a.author.role) === "assistant" ? "ChatGPT" : "You";
      const model2 = ((_c = (_b = item.message) == null ? void 0 : _b.metadata) == null ? void 0 : _c.model_slug) === "gpt-4" ? "GPT-4" : "GPT-3";
      const authorType = author === "ChatGPT" ? model2 : "user";
      const avatarEl = author === "ChatGPT" ? '<svg width="41" height="41"><use xlink:href="#chatgpt" /></svg>' : `<img alt="${author}" />`;
      const content2 = ((_d = item.message) == null ? void 0 : _d.content.parts.join("\n")) ?? "";
      let conversationContent = content2;
      if (author === "ChatGPT") {
        const root2 = fromMarkdown(content2);
        conversationContent = toHtml(root2);
      } else {
        conversationContent = `<p>${escapeHtml(content2)}</p>`;
      }
      const enableTimestamp = ScriptStorage.get(KEY_TIMESTAMP_ENABLED) ?? false;
      const timeStamp24H = ScriptStorage.get(KEY_TIMESTAMP_24H) ?? false;
      const timestamp2 = ((_e = item.message) == null ? void 0 : _e.create_time) ?? "";
      const showTimestamp = enableTimestamp && timestamp2;
      let conversationDate = "";
      let conversationTime = "";
      if (showTimestamp) {
        const date2 = new Date(timestamp2 * 1e3);
        const isoStr = date2.toISOString();
        conversationDate = `${isoStr.split("T")[0]} ${isoStr.split("T")[1].split(".")[0]} UTC`;
        conversationTime = timeStamp24H ? date2.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        }) : date2.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit"
        });
      }
      return `
<div class="conversation-item">
    <div class="author ${authorType}">
        ${avatarEl}
    </div>
    <div class="conversation-content-wrapper">
        <div class="conversation-content">
            ${conversationContent}
        </div>
    </div>
    ${showTimestamp ? `<div class="time" title="${conversationDate}">${conversationTime}</div>` : ""}
</div>`;
    }).join("\n\n");
    const date = dateStr();
    const time = (/* @__PURE__ */ new Date()).toISOString();
    const source = `${baseUrl}/chat/${id}`;
    const lang = document.documentElement.lang ?? "en";
    const theme = getColorScheme();
    const _metaList = (metaList == null ? void 0 : metaList.filter((x2) => !!x2.name).map(({
      name,
      value
    }) => {
      const val = value.replace("{title}", title).replace("{date}", date).replace("{timestamp}", timestamp()).replace("{source}", source).replace("{model}", model).replace("{mode_name}", modelSlug);
      return [name, val];
    })) ?? [];
    const detailsHtml = _metaList.length > 0 ? `<details>
    <summary>Metadata</summary>
    <div class="metadata_container">
        ${_metaList.map(([key2, value]) => `<div class="metadata_item"><div>${key2}</div><div>${value}</div></div>`).join("\n")}
    </div>
</details>` : "";
    const html2 = templateHtml.replaceAll("{{title}}", title).replaceAll("{{date}}", date).replaceAll("{{time}}", time).replaceAll("{{source}}", source).replaceAll("{{lang}}", lang).replaceAll("{{theme}}", theme).replaceAll("{{avatar}}", avatar).replaceAll("{{details}}", detailsHtml).replaceAll("{{content}}", conversationHtml);
    return html2;
  }
  function escapeHtml(html2) {
    return html2.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
  class Effect {
    constructor() {
      __publicField(this, "_sideEffects", []);
      __publicField(this, "_cleanupFns", []);
      __publicField(this, "_isDisposed", false);
    }
    /**
     * Adds a side effect to the effect, with a cleanup function.
     */
    add(sideEffect) {
      if (this._isDisposed)
        return;
      this._sideEffects.push(sideEffect);
    }
    /**
     * Executes all the side effects.
     */
    run() {
      if (this._isDisposed)
        return;
      this._sideEffects.forEach((fn2) => {
        const cleanupFn = fn2();
        if (cleanupFn)
          this._cleanupFns.push(cleanupFn);
      });
      this._sideEffects = [];
    }
    /**
     * Executes all the cleanup functions.
     * This method should be called when the effect is no longer needed.
     * After this method is called, the effect is considered disposed.
     * Any subsequent call to `add` or `run` will be ignored.
     */
    dispose() {
      if (this._isDisposed)
        return;
      this._cleanupFns.forEach((fn2) => fn2());
      this._cleanupFns = [];
      this._isDisposed = true;
    }
  }
  function fnIgnoreElements(el) {
    return typeof el.shadowRoot === "object" && el.shadowRoot !== null;
  }
  async function exportToPng(fileNameFormat) {
    var _a, _b;
    if (!checkIfConversationStarted()) {
      alert("Please start a conversation first.");
      return false;
    }
    const thread = (_a = document.querySelector("main .group")) == null ? void 0 : _a.parentElement;
    if (!thread || thread.children.length === 0)
      return false;
    const effect = new Effect();
    const modelBar = thread.firstElementChild;
    if ((_b = modelBar == null ? void 0 : modelBar.textContent) == null ? void 0 : _b.startsWith("Model:")) {
      effect.add(() => {
        modelBar.classList.add("hidden");
        return () => modelBar.classList.remove("hidden");
      });
    }
    effect.add(() => {
      const bottomBar = thread.children[thread.children.length - 1];
      bottomBar.classList.add("hidden");
      return () => bottomBar.classList.remove("hidden");
    });
    const avatarEls = Array.from(document.querySelectorAll("img[alt]:not([aria-hidden])"));
    avatarEls.forEach((el) => {
      const srcset = el.getAttribute("srcset");
      if (srcset) {
        effect.add(() => {
          el.setAttribute("data-srcset", srcset);
          el.removeAttribute("srcset");
          return () => {
            el.setAttribute("srcset", srcset);
            el.removeAttribute("data-srcset");
          };
        });
      }
    });
    const messageEls = Array.from(thread.querySelectorAll(".group .whitespace-pre-wrap"));
    messageEls.forEach((el) => {
      effect.add(() => {
        el.classList.add("break-words");
        return () => el.classList.remove("break-words");
      });
    });
    effect.run();
    await sleep(100);
    const canvas = await html2canvas2(thread, {
      scale: 1,
      useCORS: true,
      scrollX: -window.scrollX,
      scrollY: -window.scrollY,
      windowWidth: thread.scrollWidth,
      windowHeight: thread.scrollHeight,
      ignoreElements: fnIgnoreElements
    });
    effect.dispose();
    const dataUrl = canvas.toDataURL("image/png", 1).replace(/^data:image\/[^;]/, "data:application/octet-stream");
    const chatId = getChatIdFromUrl() || void 0;
    const fileName = getFileNameWithFormat(fileNameFormat, "png", {
      chatId
    });
    downloadUrl(fileName, dataUrl);
    window.URL.revokeObjectURL(dataUrl);
    return true;
  }
  async function exportToJson(fileNameFormat) {
    if (!checkIfConversationStarted()) {
      alert("Please start a conversation first.");
      return false;
    }
    const chatId = await getCurrentChatId();
    const rawConversation = await fetchConversation(chatId);
    const conversationChoices = getConversationChoice();
    const conversation = processConversation(rawConversation, conversationChoices);
    const fileName = getFileNameWithFormat(fileNameFormat, "json", {
      title: conversation.title,
      chatId
    });
    const content2 = conversationToJson(rawConversation);
    downloadFile(fileName, "application/json", content2);
    return true;
  }
  async function exportAllToJson(fileNameFormat, apiConversations) {
    const zip = new JSZip2();
    const conversations = apiConversations.map((x2) => ({
      conversation: processConversation(x2),
      rawConversation: x2
    }));
    conversations.forEach(({
      conversation,
      rawConversation
    }) => {
      const fileName = getFileNameWithFormat(fileNameFormat, "json", {
        title: conversation.title,
        chatId: conversation.id
      });
      const content2 = conversationToJson(rawConversation);
      zip.file(fileName, content2);
    });
    const blob = await zip.generateAsync({
      type: "blob"
    });
    downloadFile("chatgpt-export.zip", "application/zip", blob);
    return true;
  }
  function conversationToJson(conversation) {
    return JSON.stringify(conversation);
  }
  async function exportToMarkdown(fileNameFormat, metaList) {
    if (!checkIfConversationStarted()) {
      alert("Please start a conversation first.");
      return false;
    }
    const chatId = await getCurrentChatId();
    const rawConversation = await fetchConversation(chatId);
    const conversationChoices = getConversationChoice();
    const conversation = processConversation(rawConversation, conversationChoices);
    const markdown = conversationToMarkdown(conversation, metaList);
    const fileName = getFileNameWithFormat(fileNameFormat, "md", {
      title: conversation.title,
      chatId
    });
    downloadFile(fileName, "text/markdown", standardizeLineBreaks(markdown));
    return true;
  }
  async function exportAllToMarkdown(fileNameFormat, apiConversations, metaList) {
    const zip = new JSZip2();
    const conversations = apiConversations.map((x2) => processConversation(x2));
    conversations.forEach((conversation) => {
      const fileName = getFileNameWithFormat(fileNameFormat, "md", {
        title: conversation.title,
        chatId: conversation.id
      });
      const content2 = conversationToMarkdown(conversation, metaList);
      zip.file(fileName, content2);
    });
    const blob = await zip.generateAsync({
      type: "blob"
    });
    downloadFile("chatgpt-export.zip", "application/zip", blob);
    return true;
  }
  function conversationToMarkdown(conversation, metaList) {
    const {
      id,
      title,
      model,
      modelSlug,
      conversationNodes
    } = conversation;
    const source = `${baseUrl}/chat/${id}`;
    const _metaList = (metaList == null ? void 0 : metaList.filter((x2) => !!x2.name).map(({
      name,
      value
    }) => {
      const val = value.replace("{title}", title).replace("{date}", dateStr()).replace("{timestamp}", timestamp()).replace("{source}", source).replace("{model}", model).replace("{modelSlug}", modelSlug);
      return `${name}: ${val}`;
    })) ?? [];
    const frontMatter = _metaList.length > 0 ? `---
${_metaList.join("\n")}
---

` : "";
    const content2 = conversationNodes.map((item) => {
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
    const markdown = `${frontMatter}# ${title}

${content2}`;
    return markdown;
  }
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
  async function exportToText() {
    if (!checkIfConversationStarted()) {
      alert("Please start a conversation first.");
      return false;
    }
    const chatId = await getCurrentChatId();
    const rawConversation = await fetchConversation(chatId);
    const conversationChoices = getConversationChoice();
    const {
      conversationNodes
    } = processConversation(rawConversation, conversationChoices);
    const text2 = conversationNodes.map((item) => {
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
  async function exportToTextFromIndex(index2) {
    var _a;
    if (!checkIfConversationStarted()) {
      alert("Please start a conversation first.");
      return false;
    }
    const chatId = await getCurrentChatId();
    const rawConversation = await fetchConversation(chatId);
    const conversationChoices = getConversationChoice();
    const {
      conversationNodes
    } = processConversation(rawConversation, conversationChoices);
    const text2 = ((_a = conversationNodes[index2].message) == null ? void 0 : _a.content.parts.join("\n")) ?? "";
    copyToClipboard(standardizeLineBreaks(text2));
    return true;
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
    return l$3.vnode && l$3.vnode(i2), i2;
  }
  const Divider = () => o("div", {
    className: "border-b border-white/20"
  });
  const $1746a345f3d73bb7$var$useReactId = $2AODx$react["useId".toString()] || (() => void 0);
  let $1746a345f3d73bb7$var$count = 0;
  function $1746a345f3d73bb7$export$f680877a34711e37(deterministicId) {
    const [id, setId] = h$2($1746a345f3d73bb7$var$useReactId());
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
  const $d3863c46a17e8a28$var$AUTOFOCUS_ON_MOUNT = "focusScope.autoFocusOnMount";
  const $d3863c46a17e8a28$var$AUTOFOCUS_ON_UNMOUNT = "focusScope.autoFocusOnUnmount";
  const $d3863c46a17e8a28$var$EVENT_OPTIONS = {
    bubbles: false,
    cancelable: true
  };
  const $d3863c46a17e8a28$export$20e40289641fbbb6 = /* @__PURE__ */ k$1((props, forwardedRef) => {
    const { loop = false, trapped = false, onMountAutoFocus: onMountAutoFocusProp, onUnmountAutoFocus: onUnmountAutoFocusProp, ...scopeProps } = props;
    const [container1, setContainer] = h$2(null);
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
    p$3(() => {
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
    p$3(() => {
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
    const handleKeyDown = T$3((event) => {
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
    return /* @__PURE__ */ y$3($8927f6f2acc4f386$export$250ffa63cdc0d034.div, _extends({
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
  let $3db38b7d1fb3fe6a$var$count = 0;
  function $3db38b7d1fb3fe6a$export$b7ece24a22aeda8c() {
    p$3(() => {
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
  function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2)
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
  function assignRef(ref, value) {
    if (typeof ref === "function") {
      ref(value);
    } else if (ref) {
      ref.current = value;
    }
    return ref;
  }
  function useCallbackRef(initialValue, callback) {
    var ref = h$2(function() {
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
          set current(value) {
            var last = ref.value;
            if (last !== value) {
              ref.value = value;
              ref.callback(value, last);
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
    medium.options = __assign({ async: true, ssr: false }, options2);
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
    return y$3(Target, __assign({}, rest));
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
  var RemoveScroll = k$1(function(props, parentRef) {
    var ref = _$1(null);
    var _a = h$2({
      onScrollCapture: nothing,
      onWheelCapture: nothing,
      onTouchMoveCapture: nothing
    }), callbacks = _a[0], setCallbacks = _a[1];
    var forwardProps = props.forwardProps, children = props.children, className = props.className, removeScrollBar = props.removeScrollBar, enabled = props.enabled, shards = props.shards, sideCar = props.sideCar, noIsolation = props.noIsolation, inert = props.inert, allowPinchZoom = props.allowPinchZoom, _b = props.as, Container = _b === void 0 ? "div" : _b, rest = __rest(props, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noIsolation", "inert", "allowPinchZoom", "as"]);
    var SideCar2 = sideCar;
    var containerRef = useMergeRefs([ref, parentRef]);
    var containerProps = __assign(__assign({}, rest), callbacks);
    return y$3(
      _$2,
      null,
      enabled && y$3(SideCar2, { sideCar: effectCar, removeScrollBar, shards, noIsolation, inert, setCallbacks, allowPinchZoom: !!allowPinchZoom, lockRef: ref }),
      forwardProps ? sn(O$1.only(children), __assign(__assign({}, containerProps), { ref: containerRef })) : y$3(Container, __assign({}, containerProps, { className, ref: containerRef }), children)
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
  var currentNonce;
  var getNonce = function() {
    if (currentNonce) {
      return currentNonce;
    }
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
      p$3(function() {
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
  var parse = function(x2) {
    return parseInt(x2 || "", 10) || 0;
  };
  var getOffset = function(gapMode) {
    var cs = window.getComputedStyle(document.body);
    var left = cs[gapMode === "padding" ? "paddingLeft" : "marginLeft"];
    var top = cs[gapMode === "padding" ? "paddingTop" : "marginTop"];
    var right = cs[gapMode === "padding" ? "paddingRight" : "marginRight"];
    return [parse(left), parse(top), parse(right)];
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
    var gap = F$1(function() {
      return getGapWidth(gapMode);
    }, [gapMode]);
    return y$3(Style, { styles: getStyles(gap, !noRelative, gapMode, !noImportant ? "!important" : "") });
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
  var elementCanBeScrolled = function(node2, overflow) {
    var styles = window.getComputedStyle(node2);
    return (
      // not-not-scrollable
      styles[overflow] !== "hidden" && // contains scroll inside self
      !(styles.overflowY === styles.overflowX && !alwaysContainsScroll(node2) && styles[overflow] === "visible")
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
  var getDirectionFactor = function(axis, direction) {
    return axis === "h" && direction === "rtl" ? -1 : 1;
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
    var id = h$2(idCounter++)[0];
    var Style2 = h$2(function() {
      return styleSingleton();
    })[0];
    var lastProps = _$1(props);
    p$3(function() {
      lastProps.current = props;
    }, [props]);
    p$3(function() {
      if (props.inert) {
        document.body.classList.add("block-interactivity-".concat(id));
        var allow_1 = __spreadArray([props.lockRef.current], (props.shards || []).map(extractRef), true).filter(Boolean);
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
    var shouldCancelEvent = T$3(function(event, parent) {
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
    var shouldPrevent = T$3(function(_event) {
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
    var shouldCancel = T$3(function(name, delta, target, should) {
      var event = { name, delta, target, should };
      shouldPreventQueue.current.push(event);
      setTimeout(function() {
        shouldPreventQueue.current = shouldPreventQueue.current.filter(function(e2) {
          return e2 !== event;
        });
      }, 1);
    }, []);
    var scrollTouchStart = T$3(function(event) {
      touchStartRef.current = getTouchXY(event);
      activeAxis.current = void 0;
    }, []);
    var scrollWheel = T$3(function(event) {
      shouldCancel(event.type, getDeltaXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
    }, []);
    var scrollTouchMove = T$3(function(event) {
      shouldCancel(event.type, getTouchXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
    }, []);
    p$3(function() {
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
    return y$3(
      _$2,
      null,
      inert ? y$3(Style2, { styles: generateStyle(id) }) : null,
      removeScrollBar ? y$3(RemoveScrollBar, { gapMode: "margin" }) : null
    );
  }
  const SideCar = exportSidecar(effectCar, RemoveScrollSideCar);
  var ReactRemoveScroll = k$1(function(props, ref) {
    return y$3(RemoveScroll, __assign({}, props, { ref, sideCar: SideCar }));
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
    return /* @__PURE__ */ y$3($5d3850c4d0b4e6c7$var$DialogProvider, {
      scope: __scopeDialog,
      triggerRef,
      contentRef,
      contentId: $1746a345f3d73bb7$export$f680877a34711e37(),
      titleId: $1746a345f3d73bb7$export$f680877a34711e37(),
      descriptionId: $1746a345f3d73bb7$export$f680877a34711e37(),
      open,
      onOpenChange: setOpen,
      onOpenToggle: T$3(
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
  const $5d3850c4d0b4e6c7$export$2e1e1122cf0cba88 = /* @__PURE__ */ k$1((props, forwardedRef) => {
    const { __scopeDialog, ...triggerProps } = props;
    const context = $5d3850c4d0b4e6c7$var$useDialogContext($5d3850c4d0b4e6c7$var$TRIGGER_NAME, __scopeDialog);
    const composedTriggerRef = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedRef, context.triggerRef);
    return /* @__PURE__ */ y$3($8927f6f2acc4f386$export$250ffa63cdc0d034.button, _extends({
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
    return /* @__PURE__ */ y$3($5d3850c4d0b4e6c7$var$PortalProvider, {
      scope: __scopeDialog,
      forceMount
    }, O$1.map(
      children,
      (child) => /* @__PURE__ */ y$3($921a889cee6df7e8$export$99c2b779aa4e8b8b, {
        present: forceMount || context.open
      }, /* @__PURE__ */ y$3($f1701beae083dbae$export$602eac185826482c, {
        asChild: true,
        container
      }, child))
    ));
  };
  const $5d3850c4d0b4e6c7$var$OVERLAY_NAME = "DialogOverlay";
  const $5d3850c4d0b4e6c7$export$bd1d06c79be19e17 = /* @__PURE__ */ k$1((props, forwardedRef) => {
    const portalContext = $5d3850c4d0b4e6c7$var$usePortalContext($5d3850c4d0b4e6c7$var$OVERLAY_NAME, props.__scopeDialog);
    const { forceMount = portalContext.forceMount, ...overlayProps } = props;
    const context = $5d3850c4d0b4e6c7$var$useDialogContext($5d3850c4d0b4e6c7$var$OVERLAY_NAME, props.__scopeDialog);
    return context.modal ? /* @__PURE__ */ y$3($921a889cee6df7e8$export$99c2b779aa4e8b8b, {
      present: forceMount || context.open
    }, /* @__PURE__ */ y$3($5d3850c4d0b4e6c7$var$DialogOverlayImpl, _extends({}, overlayProps, {
      ref: forwardedRef
    }))) : null;
  });
  const $5d3850c4d0b4e6c7$var$DialogOverlayImpl = /* @__PURE__ */ k$1((props, forwardedRef) => {
    const { __scopeDialog, ...overlayProps } = props;
    const context = $5d3850c4d0b4e6c7$var$useDialogContext($5d3850c4d0b4e6c7$var$OVERLAY_NAME, __scopeDialog);
    return (
      // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
      // ie. when `Overlay` and `Content` are siblings
      /* @__PURE__ */ y$3($67UHm$RemoveScroll, {
        as: $5e63c961fc1ce211$export$8c6ed5c666ac1360,
        allowPinchZoom: true,
        shards: [
          context.contentRef
        ]
      }, /* @__PURE__ */ y$3($8927f6f2acc4f386$export$250ffa63cdc0d034.div, _extends({
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
  const $5d3850c4d0b4e6c7$export$b6d9565de1e068cf = /* @__PURE__ */ k$1((props, forwardedRef) => {
    const portalContext = $5d3850c4d0b4e6c7$var$usePortalContext($5d3850c4d0b4e6c7$var$CONTENT_NAME, props.__scopeDialog);
    const { forceMount = portalContext.forceMount, ...contentProps } = props;
    const context = $5d3850c4d0b4e6c7$var$useDialogContext($5d3850c4d0b4e6c7$var$CONTENT_NAME, props.__scopeDialog);
    return /* @__PURE__ */ y$3($921a889cee6df7e8$export$99c2b779aa4e8b8b, {
      present: forceMount || context.open
    }, context.modal ? /* @__PURE__ */ y$3($5d3850c4d0b4e6c7$var$DialogContentModal, _extends({}, contentProps, {
      ref: forwardedRef
    })) : /* @__PURE__ */ y$3($5d3850c4d0b4e6c7$var$DialogContentNonModal, _extends({}, contentProps, {
      ref: forwardedRef
    })));
  });
  const $5d3850c4d0b4e6c7$var$DialogContentModal = /* @__PURE__ */ k$1((props, forwardedRef) => {
    const context = $5d3850c4d0b4e6c7$var$useDialogContext($5d3850c4d0b4e6c7$var$CONTENT_NAME, props.__scopeDialog);
    const contentRef = _$1(null);
    const composedRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedRef, context.contentRef, contentRef);
    p$3(() => {
      const content2 = contentRef.current;
      if (content2)
        return hideOthers(content2);
    }, []);
    return /* @__PURE__ */ y$3($5d3850c4d0b4e6c7$var$DialogContentImpl, _extends({}, props, {
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
  const $5d3850c4d0b4e6c7$var$DialogContentNonModal = /* @__PURE__ */ k$1((props, forwardedRef) => {
    const context = $5d3850c4d0b4e6c7$var$useDialogContext($5d3850c4d0b4e6c7$var$CONTENT_NAME, props.__scopeDialog);
    const hasInteractedOutsideRef = _$1(false);
    return /* @__PURE__ */ y$3($5d3850c4d0b4e6c7$var$DialogContentImpl, _extends({}, props, {
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
  const $5d3850c4d0b4e6c7$var$DialogContentImpl = /* @__PURE__ */ k$1((props, forwardedRef) => {
    const { __scopeDialog, trapFocus, onOpenAutoFocus, onCloseAutoFocus, ...contentProps } = props;
    const context = $5d3850c4d0b4e6c7$var$useDialogContext($5d3850c4d0b4e6c7$var$CONTENT_NAME, __scopeDialog);
    const contentRef = _$1(null);
    const composedRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedRef, contentRef);
    $3db38b7d1fb3fe6a$export$b7ece24a22aeda8c();
    return /* @__PURE__ */ y$3(_$2, null, /* @__PURE__ */ y$3($d3863c46a17e8a28$export$20e40289641fbbb6, {
      asChild: true,
      loop: true,
      trapped: trapFocus,
      onMountAutoFocus: onOpenAutoFocus,
      onUnmountAutoFocus: onCloseAutoFocus
    }, /* @__PURE__ */ y$3($5cb92bef7577960e$export$177fb62ff3ec1f22, _extends({
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
  const $5d3850c4d0b4e6c7$export$16f7638e4a34b909 = /* @__PURE__ */ k$1((props, forwardedRef) => {
    const { __scopeDialog, ...titleProps } = props;
    const context = $5d3850c4d0b4e6c7$var$useDialogContext($5d3850c4d0b4e6c7$var$TITLE_NAME, __scopeDialog);
    return /* @__PURE__ */ y$3($8927f6f2acc4f386$export$250ffa63cdc0d034.h2, _extends({
      id: context.titleId
    }, titleProps, {
      ref: forwardedRef
    }));
  });
  const $5d3850c4d0b4e6c7$var$CLOSE_NAME = "DialogClose";
  const $5d3850c4d0b4e6c7$export$fba2fb7cd781b7ac = /* @__PURE__ */ k$1((props, forwardedRef) => {
    const { __scopeDialog, ...closeProps } = props;
    const context = $5d3850c4d0b4e6c7$var$useDialogContext($5d3850c4d0b4e6c7$var$CLOSE_NAME, __scopeDialog);
    return /* @__PURE__ */ y$3($8927f6f2acc4f386$export$250ffa63cdc0d034.button, _extends({
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
  var eventemitter3Exports = {};
  var eventemitter3 = {
    get exports() {
      return eventemitter3Exports;
    },
    set exports(v2) {
      eventemitter3Exports = v2;
    }
  };
  (function(module) {
    var has = Object.prototype.hasOwnProperty, prefix = "~";
    function Events() {
    }
    if (Object.create) {
      Events.prototype = /* @__PURE__ */ Object.create(null);
      if (!new Events().__proto__)
        prefix = false;
    }
    function EE(fn2, context, once) {
      this.fn = fn2;
      this.context = context;
      this.once = once || false;
    }
    function addListener(emitter, event, fn2, context, once) {
      if (typeof fn2 !== "function") {
        throw new TypeError("The listener must be a function");
      }
      var listener = new EE(fn2, context || emitter, once), evt = prefix ? prefix + event : event;
      if (!emitter._events[evt])
        emitter._events[evt] = listener, emitter._eventsCount++;
      else if (!emitter._events[evt].fn)
        emitter._events[evt].push(listener);
      else
        emitter._events[evt] = [emitter._events[evt], listener];
      return emitter;
    }
    function clearEvent(emitter, evt) {
      if (--emitter._eventsCount === 0)
        emitter._events = new Events();
      else
        delete emitter._events[evt];
    }
    function EventEmitter2() {
      this._events = new Events();
      this._eventsCount = 0;
    }
    EventEmitter2.prototype.eventNames = function eventNames() {
      var names = [], events, name;
      if (this._eventsCount === 0)
        return names;
      for (name in events = this._events) {
        if (has.call(events, name))
          names.push(prefix ? name.slice(1) : name);
      }
      if (Object.getOwnPropertySymbols) {
        return names.concat(Object.getOwnPropertySymbols(events));
      }
      return names;
    };
    EventEmitter2.prototype.listeners = function listeners(event) {
      var evt = prefix ? prefix + event : event, handlers2 = this._events[evt];
      if (!handlers2)
        return [];
      if (handlers2.fn)
        return [handlers2.fn];
      for (var i2 = 0, l2 = handlers2.length, ee = new Array(l2); i2 < l2; i2++) {
        ee[i2] = handlers2[i2].fn;
      }
      return ee;
    };
    EventEmitter2.prototype.listenerCount = function listenerCount(event) {
      var evt = prefix ? prefix + event : event, listeners = this._events[evt];
      if (!listeners)
        return 0;
      if (listeners.fn)
        return 1;
      return listeners.length;
    };
    EventEmitter2.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt])
        return false;
      var listeners = this._events[evt], len = arguments.length, args, i2;
      if (listeners.fn) {
        if (listeners.once)
          this.removeListener(event, listeners.fn, void 0, true);
        switch (len) {
          case 1:
            return listeners.fn.call(listeners.context), true;
          case 2:
            return listeners.fn.call(listeners.context, a1), true;
          case 3:
            return listeners.fn.call(listeners.context, a1, a2), true;
          case 4:
            return listeners.fn.call(listeners.context, a1, a2, a3), true;
          case 5:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
          case 6:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
        }
        for (i2 = 1, args = new Array(len - 1); i2 < len; i2++) {
          args[i2 - 1] = arguments[i2];
        }
        listeners.fn.apply(listeners.context, args);
      } else {
        var length = listeners.length, j2;
        for (i2 = 0; i2 < length; i2++) {
          if (listeners[i2].once)
            this.removeListener(event, listeners[i2].fn, void 0, true);
          switch (len) {
            case 1:
              listeners[i2].fn.call(listeners[i2].context);
              break;
            case 2:
              listeners[i2].fn.call(listeners[i2].context, a1);
              break;
            case 3:
              listeners[i2].fn.call(listeners[i2].context, a1, a2);
              break;
            case 4:
              listeners[i2].fn.call(listeners[i2].context, a1, a2, a3);
              break;
            default:
              if (!args)
                for (j2 = 1, args = new Array(len - 1); j2 < len; j2++) {
                  args[j2 - 1] = arguments[j2];
                }
              listeners[i2].fn.apply(listeners[i2].context, args);
          }
        }
      }
      return true;
    };
    EventEmitter2.prototype.on = function on2(event, fn2, context) {
      return addListener(this, event, fn2, context, false);
    };
    EventEmitter2.prototype.once = function once(event, fn2, context) {
      return addListener(this, event, fn2, context, true);
    };
    EventEmitter2.prototype.removeListener = function removeListener(event, fn2, context, once) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt])
        return this;
      if (!fn2) {
        clearEvent(this, evt);
        return this;
      }
      var listeners = this._events[evt];
      if (listeners.fn) {
        if (listeners.fn === fn2 && (!once || listeners.once) && (!context || listeners.context === context)) {
          clearEvent(this, evt);
        }
      } else {
        for (var i2 = 0, events = [], length = listeners.length; i2 < length; i2++) {
          if (listeners[i2].fn !== fn2 || once && !listeners[i2].once || context && listeners[i2].context !== context) {
            events.push(listeners[i2]);
          }
        }
        if (events.length)
          this._events[evt] = events.length === 1 ? events[0] : events;
        else
          clearEvent(this, evt);
      }
      return this;
    };
    EventEmitter2.prototype.removeAllListeners = function removeAllListeners(event) {
      var evt;
      if (event) {
        evt = prefix ? prefix + event : event;
        if (this._events[evt])
          clearEvent(this, evt);
      } else {
        this._events = new Events();
        this._eventsCount = 0;
      }
      return this;
    };
    EventEmitter2.prototype.off = EventEmitter2.prototype.removeListener;
    EventEmitter2.prototype.addListener = EventEmitter2.prototype.on;
    EventEmitter2.prefixed = prefix;
    EventEmitter2.EventEmitter = EventEmitter2;
    {
      module.exports = EventEmitter2;
    }
  })(eventemitter3);
  const EventEmitter = eventemitter3Exports;
  class RequestQueue {
    constructor(minBackoff, maxBackoff) {
      __publicField(this, "eventEmitter", new eventemitter3Exports());
      __publicField(this, "queue", []);
      __publicField(this, "results", []);
      __publicField(this, "status", "IDLE");
      __publicField(this, "backoffMultiplier", 2);
      __publicField(this, "backoff");
      __publicField(this, "total", 0);
      __publicField(this, "completed", 0);
      this.minBackoff = minBackoff;
      this.maxBackoff = maxBackoff;
      this.backoff = minBackoff;
    }
    add(requestObject) {
      this.queue.push(requestObject);
    }
    start() {
      if (this.status === "IDLE") {
        this.total = this.queue.length;
        this.process();
      }
    }
    stop() {
      this.status = "STOPPED";
      this.eventEmitter.emit("done", this.results);
    }
    clear() {
      this.queue = [];
      this.results = [];
      this.status = "IDLE";
      this.backoff = this.minBackoff;
      this.total = 0;
      this.completed = 0;
    }
    on(event, fn2) {
      this.eventEmitter.on(event, fn2);
      return () => this.eventEmitter.off(event, fn2);
    }
    async process() {
      if (this.status === "STOPPED" || this.status === "COMPLETED") {
        return;
      }
      if (this.queue.length === 0) {
        this.done();
        return;
      }
      this.status = "IN_PROGRESS";
      const requestObject = this.queue.shift();
      const {
        name,
        request
      } = requestObject;
      try {
        this.progress(name, "processing");
        const result = await request();
        this.results.push(result);
        this.completed++;
        this.progress(name, "processing");
        this.backoff = this.minBackoff;
      } catch (error) {
        console.error(`Request ${name} failed:`, error);
        this.progress(name, "retrying");
        this.backoff = Math.min(this.backoff * this.backoffMultiplier, this.maxBackoff);
        this.queue.unshift(requestObject);
      }
      await sleep(this.backoff);
      this.process();
    }
    progress(name, status) {
      this.eventEmitter.emit("progress", {
        total: this.total,
        completed: this.completed,
        currentName: name,
        currentStatus: status
      });
    }
    done() {
      this.status = "COMPLETED";
      this.eventEmitter.emit("done", this.results);
    }
  }
  const CheckBox$1 = "";
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
  function IconCopy({
    className,
    style: style2
  }) {
    return o("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 512 512",
      className,
      style: style2,
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
    return o("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 15 15",
      className: "w-4 h-4",
      stroke: "currentColor",
      "stroke-width": "0.5",
      children: o("path", {
        d: "M7.07095 0.650238C6.67391 0.650238 6.32977 0.925096 6.24198 1.31231L6.0039 2.36247C5.6249 2.47269 5.26335 2.62363 4.92436 2.81013L4.01335 2.23585C3.67748 2.02413 3.23978 2.07312 2.95903 2.35386L2.35294 2.95996C2.0722 3.2407 2.0232 3.6784 2.23493 4.01427L2.80942 4.92561C2.62307 5.2645 2.47227 5.62594 2.36216 6.00481L1.31209 6.24287C0.924883 6.33065 0.650024 6.6748 0.650024 7.07183V7.92897C0.650024 8.32601 0.924883 8.67015 1.31209 8.75794L2.36228 8.99603C2.47246 9.375 2.62335 9.73652 2.80979 10.0755L2.2354 10.9867C2.02367 11.3225 2.07267 11.7602 2.35341 12.041L2.95951 12.6471C3.24025 12.9278 3.67795 12.9768 4.01382 12.7651L4.92506 12.1907C5.26384 12.377 5.62516 12.5278 6.0039 12.6379L6.24198 13.6881C6.32977 14.0753 6.67391 14.3502 7.07095 14.3502H7.92809C8.32512 14.3502 8.66927 14.0753 8.75705 13.6881L8.99505 12.6383C9.37411 12.5282 9.73573 12.3773 10.0748 12.1909L10.986 12.7653C11.3218 12.977 11.7595 12.928 12.0403 12.6473L12.6464 12.0412C12.9271 11.7604 12.9761 11.3227 12.7644 10.9869L12.1902 10.076C12.3768 9.73688 12.5278 9.37515 12.638 8.99596L13.6879 8.75794C14.0751 8.67015 14.35 8.32601 14.35 7.92897V7.07183C14.35 6.6748 14.0751 6.33065 13.6879 6.24287L12.6381 6.00488C12.528 5.62578 12.3771 5.26414 12.1906 4.92507L12.7648 4.01407C12.9766 3.6782 12.9276 3.2405 12.6468 2.95975L12.0407 2.35366C11.76 2.07292 11.3223 2.02392 10.9864 2.23565L10.0755 2.80989C9.73622 2.62328 9.37437 2.47229 8.99505 2.36209L8.75705 1.31231C8.66927 0.925096 8.32512 0.650238 7.92809 0.650238H7.07095ZM4.92053 3.81251C5.44724 3.44339 6.05665 3.18424 6.71543 3.06839L7.07095 1.50024H7.92809L8.28355 3.06816C8.94267 3.18387 9.5524 3.44302 10.0794 3.81224L11.4397 2.9547L12.0458 3.56079L11.1882 4.92117C11.5573 5.44798 11.8164 6.0575 11.9321 6.71638L13.5 7.07183V7.92897L11.932 8.28444C11.8162 8.94342 11.557 9.55301 11.1878 10.0798L12.0453 11.4402L11.4392 12.0462L10.0787 11.1886C9.55192 11.5576 8.94241 11.8166 8.28355 11.9323L7.92809 13.5002H7.07095L6.71543 11.932C6.0569 11.8162 5.44772 11.5572 4.92116 11.1883L3.56055 12.046L2.95445 11.4399L3.81213 10.0794C3.4431 9.55266 3.18403 8.94326 3.06825 8.2845L1.50002 7.92897V7.07183L3.06818 6.71632C3.18388 6.05765 3.44283 5.44833 3.81171 4.92165L2.95398 3.561L3.56008 2.95491L4.92053 3.81251ZM9.02496 7.50008C9.02496 8.34226 8.34223 9.02499 7.50005 9.02499C6.65786 9.02499 5.97513 8.34226 5.97513 7.50008C5.97513 6.65789 6.65786 5.97516 7.50005 5.97516C8.34223 5.97516 9.02496 6.65789 9.02496 7.50008ZM9.92496 7.50008C9.92496 8.83932 8.83929 9.92499 7.50005 9.92499C6.1608 9.92499 5.07513 8.83932 5.07513 7.50008C5.07513 6.16084 6.1608 5.07516 7.50005 5.07516C8.83929 5.07516 9.92496 6.16084 9.92496 7.50008Z",
        fill: "currentColor",
        fillRule: "evenodd",
        clipRule: "evenodd"
      })
    });
  }
  function IconCross() {
    return o("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 15 15",
      width: "15",
      height: "15",
      children: o("path", {
        d: "M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z",
        fill: "currentColor",
        fillRule: "evenodd",
        clipRule: "evenodd"
      })
    });
  }
  function IconJSON() {
    return o("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      className: "w-4 h-4",
      "stroke-width": "2",
      stroke: "currentColor",
      fill: "none",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [o("path", {
        stroke: "none",
        d: "M0 0h24v24H0z",
        fill: "none"
      }), o("path", {
        d: "M20 16v-8l3 8v-8"
      }), o("path", {
        d: "M15 8a2 2 0 0 1 2 2v4a2 2 0 1 1 -4 0v-4a2 2 0 0 1 2 -2z"
      }), o("path", {
        d: "M1 8h3v6.5a1.5 1.5 0 0 1 -3 0v-.5"
      }), o("path", {
        d: "M7 15a1 1 0 0 0 1 1h1a1 1 0 0 0 1 -1v-2a1 1 0 0 0 -1 -1h-1a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1h1a1 1 0 0 1 1 1"
      })]
    });
  }
  function IconZip() {
    return o("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      className: "w-4 h-4",
      "stroke-width": "2",
      stroke: "currentColor",
      fill: "none",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [o("path", {
        stroke: "none",
        d: "M0 0h24v24H0z",
        fill: "none"
      }), o("path", {
        d: "M6 20.735a2 2 0 0 1 -1 -1.735v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-1"
      }), o("path", {
        d: "M11 17a2 2 0 0 1 2 2v2a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-2a2 2 0 0 1 2 -2z"
      }), o("path", {
        d: "M11 5l-1 0"
      }), o("path", {
        d: "M13 7l-1 0"
      }), o("path", {
        d: "M11 9l-1 0"
      }), o("path", {
        d: "M13 11l-1 0"
      }), o("path", {
        d: "M11 13l-1 0"
      }), o("path", {
        d: "M13 15l-1 0"
      })]
    });
  }
  function IconLoading({
    className,
    style: style2
  }) {
    return o("span", {
      style: {
        animation: "1.4s linear 0s infinite normal none running rotate"
      },
      children: o("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "22 22 44 44",
        className,
        style: {
          animation: "1.4s ease-in-out 0s infinite normal none running circularDash",
          ...style2
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
  function IconCheckBox() {
    return o("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      style: "width: 1em; height: 1em; display: inline-block",
      fill: "currentColor",
      children: o("path", {
        d: "M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
      })
    });
  }
  function IconCheckBoxChecked({
    className
  }) {
    return o("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      className,
      style: "width: 1em; height: 1em; display: inline-block",
      fill: "currentColor",
      children: o("path", {
        d: "M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
      })
    });
  }
  function IconCheck({
    className,
    style: style2
  }) {
    return o("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      className,
      style: style2,
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      children: [o("path", {
        stroke: "none",
        d: "M0 0h24v24H0z",
        fill: "none"
      }), o("path", {
        d: "M5 12l5 5l10 -10"
      })]
    });
  }
  function IconTrash({
    className,
    style: style2
  }) {
    return o("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      className,
      style: style2,
      fill: "none",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      children: [o("path", {
        stroke: "none",
        d: "M0 0h24v24H0z",
        fill: "none"
      }), o("path", {
        d: "M20 6a1 1 0 0 1 .117 1.993l-.117 .007h-.081l-.919 11a3 3 0 0 1 -2.824 2.995l-.176 .005h-8c-1.598 0 -2.904 -1.249 -2.992 -2.75l-.005 -.167l-.923 -11.083h-.08a1 1 0 0 1 -.117 -1.993l.117 -.007h16z",
        "stroke-width": "0",
        fill: "currentColor"
      }), o("path", {
        d: "M14 2a2 2 0 0 1 2 2a1 1 0 0 1 -1.993 .117l-.007 -.117h-4l-.007 .117a1 1 0 0 1 -1.993 -.117a2 2 0 0 1 1.85 -1.995l.15 -.005h4z",
        "stroke-width": "0",
        fill: "currentColor"
      })]
    });
  }
  const CheckBox = ({
    className,
    checked = false,
    disabled,
    label,
    onCheckedChange
  }) => {
    const [isChecked, setChecked] = h$2(checked);
    const onChange = (e2) => {
      const newValue = e2.currentTarget.checked;
      setChecked(newValue);
      onCheckedChange == null ? void 0 : onCheckedChange(newValue);
    };
    p$3(() => {
      setChecked(checked);
    }, [checked]);
    return o("label", {
      className: `CheckBoxLabel ${className ?? ""}`,
      disabled,
      children: [o("span", {
        className: "IconWrapper",
        children: [o("input", {
          type: "checkbox",
          checked: isChecked,
          onChange,
          disabled
        }), isChecked ? o(IconCheckBoxChecked, {}) : o(IconCheckBox, {})]
      }), o("span", {
        className: "LabelText",
        children: label
      })]
    });
  };
  function useGMStorage(key2, initialValue) {
    const [storedValue, setStoredValue] = h$2(() => ScriptStorage.get(key2) ?? initialValue);
    const setValue = (value) => {
      setStoredValue(value);
      ScriptStorage.set(key2, value);
    };
    return [storedValue, setValue];
  }
  const defaultFormat = "ChatGPT-{title}";
  const defaultExportMetaList = [{
    name: "title",
    value: "{title}"
  }, {
    name: "source",
    value: "{source}"
  }];
  const SettingContext = F$2({
    format: defaultFormat,
    setFormat: (_2) => {
    },
    enableTimestamp: false,
    setEnableTimestamp: (_2) => {
    },
    timeStamp24H: false,
    setTimeStamp24H: (_2) => {
    },
    enableMeta: false,
    setEnableMeta: (_2) => {
    },
    exportMetaList: defaultExportMetaList,
    setExportMetaList: (_2) => {
    },
    resetDefault: () => {
    }
  });
  const SettingProvider = ({
    children
  }) => {
    const [format, setFormat] = useGMStorage(KEY_FILENAME_FORMAT, defaultFormat);
    const [enableTimestamp, setEnableTimestamp] = useGMStorage(KEY_TIMESTAMP_ENABLED, false);
    const [timeStamp24H, setTimeStamp24H] = useGMStorage(KEY_TIMESTAMP_24H, false);
    const [enableMeta, setEnableMeta] = useGMStorage(KEY_META_ENABLED, false);
    const [exportMetaList, setExportMetaList] = useGMStorage(KEY_META_LIST, defaultExportMetaList);
    const resetDefault = T$3(() => {
      setFormat(defaultFormat);
      setEnableMeta(false);
      setExportMetaList(defaultExportMetaList);
    }, [setFormat, setEnableMeta, setExportMetaList]);
    return o(SettingContext.Provider, {
      value: {
        format,
        setFormat,
        enableTimestamp,
        setEnableTimestamp,
        timeStamp24H,
        setTimeStamp24H,
        enableMeta,
        setEnableMeta,
        exportMetaList,
        setExportMetaList,
        resetDefault
      },
      children
    });
  };
  const useSettingContext = () => q$1(SettingContext);
  const exportAllOptions = [{
    label: "Markdown",
    callback: exportAllToMarkdown
  }, {
    label: "JSON",
    callback: exportAllToJson
  }, {
    label: "HTML",
    callback: exportAllToHtml
  }];
  const ConversationSelect = ({
    conversations,
    selected,
    setSelected,
    disabled,
    loading,
    error
  }) => {
    return o(_$2, {
      children: [o("div", {
        className: "SelectToolbar",
        children: o(CheckBox, {
          label: "Select All",
          disabled,
          checked: selected.length === conversations.length,
          onCheckedChange: (checked) => {
            setSelected(checked ? conversations : []);
          }
        })
      }), o("ul", {
        className: "SelectList",
        children: [loading && o("li", {
          className: "SelectItem",
          children: "Loading..."
        }), error && o("li", {
          className: "SelectItem",
          children: ["Error: ", error]
        }), conversations.map((c2) => o("li", {
          className: "SelectItem",
          children: o(CheckBox, {
            label: c2.title,
            disabled,
            checked: selected.some((x2) => x2.id === c2.id),
            onCheckedChange: (checked) => {
              setSelected(checked ? [...selected, c2] : selected.filter((x2) => x2.id !== c2.id));
            }
          })
        }, c2.id))]
      })]
    });
  };
  const ExportDialog = ({
    format,
    open,
    onOpenChange,
    children
  }) => {
    const {
      enableMeta,
      exportMetaList
    } = useSettingContext();
    const metaList = F$1(() => enableMeta ? exportMetaList : [], [enableMeta, exportMetaList]);
    const [conversations, setConversations] = h$2([]);
    const [loading, setLoading] = h$2(false);
    const [error, setError] = h$2("");
    const [processing, setProcessing] = h$2(false);
    const [selected, setSelected] = h$2([]);
    const [exportType, setExportType] = h$2(exportAllOptions[0].label);
    const disabled = loading || processing || !!error || selected.length === 0;
    const requestQueue = F$1(() => new RequestQueue(200, 1600), []);
    const deleteQueue = F$1(() => new RequestQueue(200, 1600), []);
    const [progress, setProgress] = h$2({
      total: 0,
      completed: 0,
      currentName: "",
      currentStatus: ""
    });
    p$3(() => {
      const off = requestQueue.on("progress", (progress2) => {
        setProcessing(true);
        setProgress(progress2);
      });
      return () => off();
    }, [requestQueue]);
    p$3(() => {
      const off = deleteQueue.on("progress", (progress2) => {
        setProcessing(true);
        setProgress(progress2);
      });
      return () => off();
    }, [deleteQueue]);
    p$3(() => {
      const off = requestQueue.on("done", (results) => {
        var _a;
        setProcessing(false);
        const callback = (_a = exportAllOptions.find((o2) => o2.label === exportType)) == null ? void 0 : _a.callback;
        if (callback)
          callback(format, results, metaList);
      });
      return () => off();
    }, [requestQueue, exportType, format, metaList]);
    p$3(() => {
      const off = deleteQueue.on("done", () => {
        setProcessing(false);
        setConversations(conversations.filter((c2) => !selected.some((s2) => s2.id === c2.id)));
        setSelected([]);
        alert("All selected conversations have been deleted. Please refresh the page to see the changes.");
      });
      return () => off();
    }, [deleteQueue, conversations, selected]);
    const exportAll = T$3(() => {
      if (disabled)
        return;
      requestQueue.clear();
      selected.forEach(({
        id,
        title
      }) => {
        requestQueue.add({
          name: title,
          request: () => fetchConversation(id)
        });
      });
      requestQueue.start();
    }, [disabled, selected, requestQueue]);
    const deleteAll = T$3(() => {
      if (disabled)
        return;
      const result = confirm("Are you sure you want to delete all selected conversations?");
      if (!result)
        return;
      deleteQueue.clear();
      selected.forEach(({
        id,
        title
      }) => {
        deleteQueue.add({
          name: title,
          request: () => deleteConversation(id)
        });
      });
      deleteQueue.start();
    }, [disabled, selected, deleteQueue]);
    p$3(() => {
      setLoading(true);
      fetchAllConversations().then(setConversations).catch(setError).finally(() => setLoading(false));
    }, []);
    return o($5d3850c4d0b4e6c7$export$be92b6f5f03c0fe9, {
      open,
      onOpenChange,
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
            children: "Export Conversations"
          }), o(ConversationSelect, {
            conversations,
            selected,
            setSelected,
            disabled: processing,
            loading,
            error
          }), o("div", {
            className: "flex mt-6",
            style: {
              justifyContent: "space-between"
            },
            children: [o("select", {
              className: "Select",
              disabled: processing,
              value: exportType,
              onChange: (e2) => setExportType(e2.currentTarget.value),
              children: exportAllOptions.map(({
                label
              }) => o("option", {
                value: label,
                children: label
              }, label))
            }), o("div", {
              className: "flex flex-grow"
            }), o("button", {
              className: "Button red",
              disabled,
              onClick: deleteAll,
              children: "Delete"
            }), o("button", {
              className: "Button green ml-4",
              disabled,
              onClick: exportAll,
              children: "Export"
            })]
          }), processing && o(_$2, {
            children: [o("div", {
              className: "mt-2 mb-1 justify-between flex",
              children: [o("span", {
                className: "truncate mr-8",
                children: progress.currentName
              }), o("span", {
                children: `${progress.completed}/${progress.total}`
              })]
            }), o("div", {
              className: "w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700",
              children: o("div", {
                className: "bg-blue-600 h-2.5 rounded-full",
                style: {
                  width: `${progress.completed / progress.total * 100}%`
                }
              })
            })]
          }), o($5d3850c4d0b4e6c7$export$f39c2d165cd861fe, {
            asChild: true,
            children: o("button", {
              className: "IconButton CloseButton",
              "aria-label": "Close",
              children: o(IconCross, {})
            })
          })]
        })]
      })]
    });
  };
  const TIMEOUT$1 = 2500;
  const MenuItem = ({
    text: text2,
    successText,
    disabled = false,
    title,
    icon: Icon,
    onClick,
    className
  }) => {
    const [loading, setLoading] = h$2(false);
    const [succeed, setSucceed] = h$2(false);
    const handleClick = typeof onClick === "function" ? async () => {
      try {
        setLoading(true);
        const result = await onClick();
        if (result) {
          setSucceed(true);
          setTimeout(() => setSucceed(false), TIMEOUT$1);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    } : void 0;
    return o("div", {
      className: `menu-item flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20 ${className}`,
      onClick: handleClick,
      onTouchStart: handleClick,
      disabled,
      title,
      children: loading ? o("div", {
        className: "flex justify-center items-center w-full h-full",
        children: o(IconLoading, {
          className: "w-4 h-4"
        })
      }) : o(_$2, {
        children: [Icon && o(Icon, {}), succeed && successText ? successText : text2]
      })
    });
  };
  function useTitle() {
    const title = gn(subscribe, getSnapshot);
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
  const Toggle = (props) => {
    const {
      label = "",
      checked = true,
      onCheckedUpdate
    } = props;
    const handleChange = (e2) => {
      if (!e2.target || !onCheckedUpdate)
        return;
      onCheckedUpdate(e2.target.checked);
    };
    return o("label", {
      className: "relative inline-flex items-center cursor-pointer",
      children: [o("input", {
        type: "checkbox",
        checked,
        onChange: handleChange,
        className: "sr-only peer"
      }), o("div", {
        className: "relative shrink-0 w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
      }), o("span", {
        className: "ml-3 text-sm font-medium text-gray-900 dark:text-gray-300 empty:hidden",
        children: label
      })]
    });
  };
  const Variable = ({
    name,
    title
  }) => o("strong", {
    className: "cursor-help select-all whitespace-nowrap",
    title,
    children: name
  });
  const SettingDialog = ({
    open,
    onOpenChange,
    children
  }) => {
    const {
      format,
      setFormat,
      enableTimestamp,
      setEnableTimestamp,
      timeStamp24H,
      setTimeStamp24H,
      enableMeta,
      setEnableMeta,
      exportMetaList,
      setExportMetaList
    } = useSettingContext();
    const _title = useTitle();
    const date = dateStr();
    const timestamp$1 = timestamp();
    const title = sanitizeFilename(_title).replace(/\s+/g, "_");
    const chatId = getChatIdFromUrl() || "this-is-a-mock-chat-id";
    const preview = getFileNameWithFormat(format, "{ext}", {
      title,
      chatId
    });
    const source = `${baseUrl}/${chatId}`;
    return o($5d3850c4d0b4e6c7$export$be92b6f5f03c0fe9, {
      open,
      onOpenChange,
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
          }), o("dl", {
            className: "space-y-6",
            children: [o("div", {
              className: "relative flex bg-white dark:bg-white/5 rounded p-4",
              children: o("div", {
                children: [o("dt", {
                  className: "text-md font-medium text-gray-800 dark:text-white",
                  children: "File Name"
                }), o("dd", {
                  children: [o("p", {
                    className: "text-sm text-gray-700 dark:text-gray-300",
                    children: ["Available variables:", " ", o(Variable, {
                      name: "{title}",
                      title
                    }), ",", " ", o(Variable, {
                      name: "{date}",
                      title: date
                    }), ",", " ", o(Variable, {
                      name: "{timestamp}",
                      title: timestamp$1
                    }), ",", " ", o(Variable, {
                      name: "{chat_id}",
                      title: chatId
                    })]
                  }), o("input", {
                    className: "Input mt-4",
                    id: "filename",
                    value: format,
                    onChange: (e2) => setFormat(e2.currentTarget.value)
                  }), o("p", {
                    className: "mt-1 text-sm text-gray-700 dark:text-gray-300",
                    children: ["Preview:", " ", o("span", {
                      className: "select-all",
                      style: {
                        "text-decoration": "underline",
                        "text-underline-offset": 4
                      },
                      children: preview
                    })]
                  })]
                })]
              })
            }), o("div", {
              className: "relative flex bg-white dark:bg-white/5 rounded p-4",
              children: [o("div", {
                children: [o("dt", {
                  className: "text-md font-medium text-gray-800 dark:text-white",
                  children: "Conversation Timestamp"
                }), o("dd", {
                  className: "text-sm text-gray-700 dark:text-gray-300",
                  children: ["Will show on the page and HTML files.", enableTimestamp && o("div", {
                    className: "mt-2",
                    children: o(Toggle, {
                      label: "Use 24-hour format (eg. 23:59)",
                      checked: timeStamp24H,
                      onCheckedUpdate: setTimeStamp24H
                    })
                  })]
                })]
              }), o("div", {
                className: "absolute right-4",
                children: o(Toggle, {
                  label: "",
                  checked: enableTimestamp,
                  onCheckedUpdate: setEnableTimestamp
                })
              })]
            }), o("div", {
              className: "relative flex bg-white dark:bg-white/5 rounded p-4",
              children: [o("div", {
                children: [o("dt", {
                  className: "text-md font-medium text-gray-800 dark:text-white",
                  children: "Export Metadata"
                }), o("dd", {
                  className: "text-sm text-gray-700 dark:text-gray-300",
                  children: ["Add metadata to exported Markdown and HTML files.", enableMeta && o(_$2, {
                    children: [o("p", {
                      className: "mt-2 text-sm text-gray-700 dark:text-gray-300",
                      children: ["Available variables:", " ", o(Variable, {
                        name: "{title}",
                        title
                      }), ",", " ", o(Variable, {
                        name: "{date}",
                        title: date
                      }), ",", " ", o(Variable, {
                        name: "{timestamp}",
                        title: timestamp$1
                      }), ",", " ", o(Variable, {
                        name: "{source}",
                        title: source
                      }), ",", " ", o(Variable, {
                        name: "{model}",
                        title: "ChatGPT-3.5"
                      }), ",", " ", o(Variable, {
                        name: "{model_name}",
                        title: "text-davinci-002-render-sha"
                      })]
                    }), exportMetaList.map((meta, i2) => o("div", {
                      className: "flex items-center mt-2",
                      children: [o("input", {
                        className: "Input",
                        value: meta.name,
                        onChange: (e2) => {
                          const list2 = [...exportMetaList];
                          list2[i2] = {
                            ...list2[i2],
                            name: e2.currentTarget.value
                          };
                          setExportMetaList(list2);
                        }
                      }), o("span", {
                        className: "mx-2",
                        children: "→"
                      }), o("input", {
                        className: "Input",
                        value: meta.value,
                        onChange: (e2) => {
                          const list2 = [...exportMetaList];
                          list2[i2] = {
                            ...list2[i2],
                            value: e2.currentTarget.value
                          };
                          setExportMetaList(list2);
                        }
                      }), o("button", {
                        className: "ml-2 rounded-full p-1 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition ease-in-out duration-150",
                        "aria-label": "Remove",
                        onClick: () => setExportMetaList(exportMetaList.filter((_2, j2) => j2 !== i2)),
                        children: o(IconTrash, {
                          className: "w-4 h-4"
                        })
                      })]
                    }, i2)), o("div", {
                      className: "flex justify-center items-center mt-2 pr-8",
                      children: o("button", {
                        className: "w-full border border-[#6f6e77] dark:border-gray-[#86858d] rounded-md py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition ease-in-out duration-150",
                        "aria-label": "Add",
                        onClick: () => setExportMetaList([...exportMetaList, {
                          name: "",
                          value: ""
                        }]),
                        children: "+"
                      })
                    })]
                  })]
                })]
              }), o("div", {
                className: "absolute right-4",
                children: o(Toggle, {
                  label: "",
                  checked: enableMeta,
                  onCheckedUpdate: setEnableMeta
                })
              })]
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
              className: "IconButton CloseButton",
              "aria-label": "Close",
              children: o(IconCross, {})
            })
          })]
        })]
      })]
    });
  };
  const style = "";
  const Dialog = "";
  const disabledTitle = `Exporter is relying on the History API.
But History feature is disabled by OpenAI temporarily.
We all have to wait for them to bring it back.`;
  function MenuInner({
    container
  }) {
    const disabled = getHistoryDisabled();
    const [open, setOpen] = h$2(false);
    const [exportOpen, setExportOpen] = h$2(false);
    const [settingOpen, setSettingOpen] = h$2(false);
    const {
      format,
      enableTimestamp,
      timeStamp24H,
      enableMeta,
      exportMetaList
    } = useSettingContext();
    p$3(() => {
      if (enableTimestamp) {
        document.body.setAttribute("data-time-format", timeStamp24H ? "24" : "12");
      } else {
        document.body.removeAttribute("data-time-format");
      }
    }, [enableTimestamp, timeStamp24H]);
    const metaList = F$1(() => enableMeta ? exportMetaList : [], [enableMeta, exportMetaList]);
    const onClickText = T$3(() => exportToText(), []);
    const onClickPng = T$3(() => exportToPng(format), [format]);
    const onClickMarkdown = T$3(() => exportToMarkdown(format, metaList), [format, metaList]);
    const onClickHtml = T$3(() => exportToHtml(format, metaList), [format, metaList]);
    const onClickJSON = T$3(() => exportToJson(format), [format]);
    const isMobile = window.innerWidth < 768;
    const Portal = isMobile ? "div" : $cef8881cdc69808e$export$602eac185826482c;
    if (disabled) {
      return o(MenuItem, {
        className: "mt-1",
        text: "Exporter unavailable",
        icon: IconArrowRightFromBracket,
        title: disabledTitle,
        disabled: true
      });
    }
    return o(_$2, {
      children: [isMobile && open && o("div", {
        className: "dropdown-backdrop animate-fadeIn",
        onClick: () => setOpen(false)
      }), o($cef8881cdc69808e$export$be92b6f5f03c0fe9, {
        openDelay: 0,
        closeDelay: 300,
        open,
        onOpenChange: setOpen,
        children: [o($cef8881cdc69808e$export$41fb9f06171c75f4, {
          children: o(MenuItem, {
            className: "mt-1",
            text: "Export",
            icon: IconArrowRightFromBracket,
            onClick: () => {
              setOpen(true);
              return true;
            }
          })
        }), o(Portal, {
          container: isMobile ? container : document.body,
          forceMount: open || settingOpen || exportOpen,
          children: o($cef8881cdc69808e$export$7c6e2c02157bb7d2, {
            className: isMobile ? "fixed grid grid-cols-2 gap-x-1 px-1.5 py-2 bg-gray-900 shadow-md transition-opacity duration-200 animate-slideUp" : "grid grid-cols-2 gap-x-1 px-1.5 py-2 pb-0 rounded-md bg-gray-900 shadow-md transition-opacity duration-200 animate-fadeIn",
            style: {
              width: isMobile ? 316 : 268,
              left: -6,
              bottom: "calc(-1 * var(--radix-popper-available-height))"
            },
            sideOffset: 8,
            side: isMobile ? "bottom" : "right",
            align: "start",
            alignOffset: isMobile ? 0 : -64,
            children: [o(SettingDialog, {
              open: settingOpen,
              onOpenChange: setSettingOpen,
              children: o("div", {
                className: "row-full",
                children: o(MenuItem, {
                  text: "Setting",
                  icon: IconSetting
                })
              })
            }), o(MenuItem, {
              text: "Copy Text",
              successText: "Copied!",
              icon: () => o(IconCopy, {
                className: "w-4 h-4"
              }),
              className: "row-full",
              onClick: onClickText
            }), o(MenuItem, {
              text: "Screenshot",
              icon: IconCamera,
              className: "row-half",
              onClick: onClickPng
            }), o(MenuItem, {
              text: "Markdown",
              icon: IconMarkdown,
              className: "row-half",
              onClick: onClickMarkdown
            }), o(MenuItem, {
              text: "HTML",
              icon: FileCode,
              className: "row-half",
              onClick: onClickHtml
            }), o(MenuItem, {
              text: "JSON",
              icon: IconJSON,
              className: "row-half",
              onClick: onClickJSON
            }), o(ExportDialog, {
              format,
              open: exportOpen,
              onOpenChange: setExportOpen,
              children: o("div", {
                className: "row-full",
                children: o(MenuItem, {
                  text: "Export All",
                  icon: IconZip
                })
              })
            }), o($cef8881cdc69808e$export$21b07c8f274aebd5, {
              width: "16",
              height: "8",
              className: "text-gray-900 fill-current"
            })]
          })
        })]
      }), o(Divider, {})]
    });
  }
  function Menu({
    container
  }) {
    return o(SettingProvider, {
      children: o(MenuInner, {
        container
      })
    });
  }
  const SecondaryToolbar$1 = "";
  const TIMEOUT = 2500;
  const SecondaryToolbar = ({
    index: index2
  }) => {
    const [loading, setLoading] = h$2(false);
    const [succeed, setSucceed] = h$2(false);
    const handleClick = async () => {
      try {
        setLoading(true);
        const result = await exportToTextFromIndex(index2);
        if (result) {
          setSucceed(true);
          setTimeout(() => setSucceed(false), TIMEOUT);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    return o("div", {
      className: "flex w-full ml-4 mt-2 absolute lg:translate-x-full lg:right-0 lg:pl-2 lg:mt-0 lg:top-8",
      children: loading ? o(IconLoading, {
        className: "w-6 h-6 text-gray-500 dark:text-gray-400",
        style: {
          padding: 5
        }
      }) : succeed ? o(IconCheck, {
        className: "w-6 h-6 text-gray-500 dark:text-gray-400",
        style: {
          padding: 3
        }
      }) : o("button", {
        onClick: handleClick,
        className: "p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200",
        children: o(IconCopy, {
          className: "w-4 h-4 text-gray-400 dark:text-gray-400"
        })
      })
    });
  };
  const missingTailwind = "";
  try {
    const legacyFormat = GM_getValue == null ? void 0 : GM_getValue(LEGACY_KEY_FILENAME_FORMAT, "");
    const localLegacyFormat = localStorage.getItem(LEGACY_KEY_FILENAME_FORMAT);
    if (legacyFormat) {
      GM_deleteValue == null ? void 0 : GM_deleteValue(LEGACY_KEY_FILENAME_FORMAT);
      GM_setValue == null ? void 0 : GM_setValue(KEY_FILENAME_FORMAT, JSON.stringify(legacyFormat));
    } else if (localLegacyFormat) {
      localStorage.removeItem(LEGACY_KEY_FILENAME_FORMAT);
      localStorage.setItem(KEY_FILENAME_FORMAT, JSON.stringify(localLegacyFormat));
    }
  } catch (error) {
    console.error("Failed to migrate legacy filename format", error);
  }
  main();
  function main() {
    onloadSafe(() => {
      const container = document.createElement("div");
      B$2(o(Menu, {
        container
      }), container);
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
      sentinel.on("main .flex.justify-between", (node2) => {
        if (!node2.querySelector("button"))
          return;
        if (node2.closest("pre"))
          return;
        const secondaryToolbar = document.createElement("div");
        secondaryToolbar.className = "w-full secondary-toolbar";
        const threads = Array.from(document.querySelectorAll("main .group"));
        const index2 = threads.indexOf(node2.closest(".group"));
        B$2(o(SecondaryToolbar, {
          index: index2
        }), secondaryToolbar);
        node2.append(secondaryToolbar);
      });
      let chatId = "";
      sentinel.on("main .group", async () => {
        const threadContents = Array.from(document.querySelectorAll("main .group > .text-base > .relative:nth-child(2)"));
        const currentChatId = getChatIdFromUrl();
        if (!currentChatId || currentChatId === chatId)
          return;
        chatId = currentChatId;
        const rawConversation = await fetchConversation(chatId);
        const conversationChoices = getConversationChoice();
        const {
          conversationNodes
        } = processConversation(rawConversation, conversationChoices);
        threadContents.forEach((thread, index2) => {
          var _a;
          const createTime = (_a = conversationNodes[index2].message) == null ? void 0 : _a.create_time;
          if (!createTime)
            return;
          const date = new Date(createTime * 1e3);
          const timestamp2 = document.createElement("time");
          timestamp2.className = "text-gray-500 dark:text-gray-400 text-sm text-right";
          timestamp2.dateTime = date.toISOString();
          timestamp2.title = date.toLocaleString();
          const hour12 = document.createElement("span");
          hour12.setAttribute("data-time-format", "12");
          hour12.textContent = date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit"
          });
          const hour24 = document.createElement("span");
          hour24.setAttribute("data-time-format", "24");
          hour24.textContent = date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
          });
          timestamp2.append(hour12, hour24);
          thread.append(timestamp2);
        });
      });
    });
  }
})(JSZip, html2canvas);
