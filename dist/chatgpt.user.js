// ==UserScript==
// @name               ChatGPT Exporter
// @name:zh-CN         ChatGPT Exporter
// @name:zh-TW         ChatGPT Exporter
// @namespace          pionxzh
// @version            2.29.1
// @author             pionxzh
// @description        Easily export the whole ChatGPT conversation history for further analysis or sharing.
// @description:zh-CN  轻松导出 ChatGPT 聊天记录，以便进一步分析或分享。
// @description:zh-TW  輕鬆匯出 ChatGPT 聊天紀錄，以便進一步分析或分享。
// @license            MIT
// @icon               https://chat.openai.com/favicon.ico
// @match              https://chat.openai.com/
// @match              https://chat.openai.com/?model=*
// @match              https://chat.openai.com/c/*
// @match              https://chat.openai.com/g/*
// @match              https://chat.openai.com/gpts
// @match              https://chat.openai.com/gpts/*
// @match              https://chat.openai.com/share/*
// @match              https://chat.openai.com/share/*/continue
// @match              https://chatgpt.com/
// @match              https://chatgpt.com/?model=*
// @match              https://chatgpt.com/c/*
// @match              https://chatgpt.com/g/*
// @match              https://chatgpt.com/gpts
// @match              https://chatgpt.com/gpts/*
// @match              https://chatgpt.com/share/*
// @match              https://chatgpt.com/share/*/continue
// @match              https://new.oaifree.com/
// @match              https://new.oaifree.com/?model=*
// @match              https://new.oaifree.com/c/*
// @match              https://new.oaifree.com/g/*
// @match              https://new.oaifree.com/gpts
// @match              https://new.oaifree.com/gpts/*
// @match              https://new.oaifree.com/share/*
// @match              https://new.oaifree.com/share/*/continue
// @require            https://cdn.jsdelivr.net/npm/jszip@3.9.1/dist/jszip.min.js
// @require            https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js
// @grant              GM_deleteValue
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              unsafeWindow
// @run-at             document-end
// ==/UserScript==

(e=>{const n=document.createElement("style");n.textContent=e,document.head.append(n),setInterval(()=>{n.isConnected||document.head.append(n)},300)})(` .CheckBoxLabel {
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

html {
    --ce-text-primary: var(--text-primary, #0d0d0d);
    --ce-menu-primary: var(--sidebar-surface-primary, #f9f9f9);
    --ce-menu-secondary: var(--sidebar-surface-secondary, #ececec);
    --ce-border-light: var(--border-light, rgba(0, 0, 0, .1));
}

.dark {
    --ce-text-primary: var(--text-primary, #ececec);
    --ce-menu-primary: var(--sidebar-surface-primary, #171717);
    --ce-menu-secondary: var(--sidebar-surface-secondary, #212121);
}

.text-menu {
    color: var(--ce-text-primary);
}

.bg-menu {
    background-color: var(--ce-menu-primary);
}

.border-menu {
    border-color: var(--ce-border-light);
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
    outline: none;
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
    height: 270px;
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
.animate-fadeIn  {
    animation: fadeIn .3s;
}

.animate-slideUp  {
    animation: slideUp .3s;
}

.bg-blue-600 {
    background-color: rgb(28 100 242);
}

.hover\\:bg-gray-500\\/10:hover {
    background-color: hsla(0, 0%, 61%, .1)
}

.border-\\[\\#6f6e77\\] {
    border-color: #6f6e77;
}

.cursor-help {
    cursor: help;
}

.dark .dark\\:bg-white\\/5 {
    background-color: rgb(255 255 255 / 5%);
}

.dark .dark\\:text-gray-200 {
    color: rgb(229 231 235 / 1);
}

.dark .dark\\:text-gray-300 {
    color: rgb(209 213 219 / 1);
}

.dark .dark\\:border-gray-\\[\\#86858d\\] {
    border-color: #86858d;
}

.gap-x-1 {
    column-gap: 0.25rem;
}

.h-2\\.5 {
    height: 0.625rem;
}

.h-4 {
    height: 1rem;
}

.inline-flex {
    display: inline-flex;
}

.items-center {
    align-items: center;
}

.ml-3 {
    margin-left: 0.75rem;
}

.ml-4 {
    margin-left: 1rem;
}

.mr-8 {
    margin-right: 2rem;
}

.pb-0 {
    padding-bottom: 0;
}

.pr-8 {
    padding-right: 2rem;
}

.right-4 {
    right: 1rem;
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


.toggle-switch {
    position: relative;
    outline: none;
    background-color: rgb(229 231 235);
    border: 1px solid rgb(107 114 128);
    border-radius: 9999px;
    cursor: pointer;
    height: 20px;
    width: 32px;
}

.dark .toggle-switch {
    background-color: rgb(255 255 255 / 5%);
    border-color: rgb(255 255 255 / 1);
}

.toggle-switch[data-state="checked"] {
    background-color: rgb(0 0 0);
    border-color: rgb(0 0 0);
}

.dark .toggle-switch[data-state="checked"] {
    background-color: rgb(22 163 74);
    border-color: rgb(22 163 74);
}

.toggle-switch-handle {
    display: block;
    background-color: rgb(255 255 255);
    border-radius: 9999px;
    height: 16px;
    width: 16px;
    transition: transform 0.1s;
    will-change: transform;
    transform: translateX(1px);
}

.toggle-switch-handle[data-state="checked"] {
    transform: translateX(14px);
}

.toggle-switch-handle:hover {
    background-color: rgb(243 244 246);
}

.toggle-switch-label {
    color: rgb(107 114 128);
    margin-left: 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
}

.toggle-switch-label:hover {
    color: rgb(71 85 105);
} `);

(function (JSZip, html2canvas) {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key2, value) => key2 in obj ? __defProp(obj, key2, { enumerable: true, configurable: true, writable: true, value }) : obj[key2] = value;
  var __publicField = (obj, key2, value) => __defNormalProp(obj, typeof key2 !== "symbol" ? key2 + "" : key2, value);
  var n, l$4, u$6, i$4, r$3, o$6, e$2, f$3, c$1, s$5, a$1, h$3, p$5 = {}, v$3 = [], y$2 = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, w$3 = Array.isArray;
  function d$4(n2, l2) {
    for (var u2 in l2) n2[u2] = l2[u2];
    return n2;
  }
  function g$2(n2) {
    n2 && n2.parentNode && n2.parentNode.removeChild(n2);
  }
  function _$1(l2, u2, t2) {
    var i2, r2, o3, e2 = {};
    for (o3 in u2) "key" == o3 ? i2 = u2[o3] : "ref" == o3 ? r2 = u2[o3] : e2[o3] = u2[o3];
    if (arguments.length > 2 && (e2.children = arguments.length > 3 ? n.call(arguments, 2) : t2), "function" == typeof l2 && null != l2.defaultProps) for (o3 in l2.defaultProps) void 0 === e2[o3] && (e2[o3] = l2.defaultProps[o3]);
    return m$2(l2, e2, i2, r2, null);
  }
  function m$2(n2, t2, i2, r2, o3) {
    var e2 = { type: n2, props: t2, key: i2, ref: r2, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: null == o3 ? ++u$6 : o3, __i: -1, __u: 0 };
    return null == o3 && null != l$4.vnode && l$4.vnode(e2), e2;
  }
  function b$1() {
    return { current: null };
  }
  function k$3(n2) {
    return n2.children;
  }
  function x$3(n2, l2) {
    this.props = n2, this.context = l2;
  }
  function S$2(n2, l2) {
    if (null == l2) return n2.__ ? S$2(n2.__, n2.__i + 1) : null;
    for (var u2; l2 < n2.__k.length; l2++) if (null != (u2 = n2.__k[l2]) && null != u2.__e) return u2.__e;
    return "function" == typeof n2.type ? S$2(n2) : null;
  }
  function C$3(n2) {
    var l2, u2;
    if (null != (n2 = n2.__) && null != n2.__c) {
      for (n2.__e = n2.__c.base = null, l2 = 0; l2 < n2.__k.length; l2++) if (null != (u2 = n2.__k[l2]) && null != u2.__e) {
        n2.__e = n2.__c.base = u2.__e;
        break;
      }
      return C$3(n2);
    }
  }
  function M$1(n2) {
    (!n2.__d && (n2.__d = true) && i$4.push(n2) && !$$1.__r++ || r$3 != l$4.debounceRendering) && ((r$3 = l$4.debounceRendering) || o$6)($$1);
  }
  function $$1() {
    for (var n2, u2, t2, r2, o3, f2, c2, s2 = 1; i$4.length; ) i$4.length > s2 && i$4.sort(e$2), n2 = i$4.shift(), s2 = i$4.length, n2.__d && (t2 = void 0, r2 = void 0, o3 = (r2 = (u2 = n2).__v).__e, f2 = [], c2 = [], u2.__P && ((t2 = d$4({}, r2)).__v = r2.__v + 1, l$4.vnode && l$4.vnode(t2), O$2(u2.__P, t2, r2, u2.__n, u2.__P.namespaceURI, 32 & r2.__u ? [o3] : null, f2, null == o3 ? S$2(r2) : o3, !!(32 & r2.__u), c2), t2.__v = r2.__v, t2.__.__k[t2.__i] = t2, N$1(f2, t2, c2), r2.__e = r2.__ = null, t2.__e != o3 && C$3(t2)));
    $$1.__r = 0;
  }
  function I$3(n2, l2, u2, t2, i2, r2, o3, e2, f2, c2, s2) {
    var a2, h2, y2, w2, d2, g2, _24, m2 = t2 && t2.__k || v$3, b2 = l2.length;
    for (f2 = P$2(u2, l2, m2, f2, b2), a2 = 0; a2 < b2; a2++) null != (y2 = u2.__k[a2]) && (h2 = -1 == y2.__i ? p$5 : m2[y2.__i] || p$5, y2.__i = a2, g2 = O$2(n2, y2, h2, i2, r2, o3, e2, f2, c2, s2), w2 = y2.__e, y2.ref && h2.ref != y2.ref && (h2.ref && B$3(h2.ref, null, y2), s2.push(y2.ref, y2.__c || w2, y2)), null == d2 && null != w2 && (d2 = w2), (_24 = !!(4 & y2.__u)) || h2.__k === y2.__k ? f2 = A$3(y2, f2, n2, _24) : "function" == typeof y2.type && void 0 !== g2 ? f2 = g2 : w2 && (f2 = w2.nextSibling), y2.__u &= -7);
    return u2.__e = d2, f2;
  }
  function P$2(n2, l2, u2, t2, i2) {
    var r2, o3, e2, f2, c2, s2 = u2.length, a2 = s2, h2 = 0;
    for (n2.__k = new Array(i2), r2 = 0; r2 < i2; r2++) null != (o3 = l2[r2]) && "boolean" != typeof o3 && "function" != typeof o3 ? (f2 = r2 + h2, (o3 = n2.__k[r2] = "string" == typeof o3 || "number" == typeof o3 || "bigint" == typeof o3 || o3.constructor == String ? m$2(null, o3, null, null, null) : w$3(o3) ? m$2(k$3, { children: o3 }, null, null, null) : null == o3.constructor && o3.__b > 0 ? m$2(o3.type, o3.props, o3.key, o3.ref ? o3.ref : null, o3.__v) : o3).__ = n2, o3.__b = n2.__b + 1, e2 = null, -1 != (c2 = o3.__i = L$1(o3, u2, f2, a2)) && (a2--, (e2 = u2[c2]) && (e2.__u |= 2)), null == e2 || null == e2.__v ? (-1 == c2 && (i2 > s2 ? h2-- : i2 < s2 && h2++), "function" != typeof o3.type && (o3.__u |= 4)) : c2 != f2 && (c2 == f2 - 1 ? h2-- : c2 == f2 + 1 ? h2++ : (c2 > f2 ? h2-- : h2++, o3.__u |= 4))) : n2.__k[r2] = null;
    if (a2) for (r2 = 0; r2 < s2; r2++) null != (e2 = u2[r2]) && 0 == (2 & e2.__u) && (e2.__e == t2 && (t2 = S$2(e2)), D$2(e2, e2));
    return t2;
  }
  function A$3(n2, l2, u2, t2) {
    var i2, r2;
    if ("function" == typeof n2.type) {
      for (i2 = n2.__k, r2 = 0; i2 && r2 < i2.length; r2++) i2[r2] && (i2[r2].__ = n2, l2 = A$3(i2[r2], l2, u2, t2));
      return l2;
    }
    n2.__e != l2 && (t2 && (l2 && n2.type && !l2.parentNode && (l2 = S$2(n2)), u2.insertBefore(n2.__e, l2 || null)), l2 = n2.__e);
    do {
      l2 = l2 && l2.nextSibling;
    } while (null != l2 && 8 == l2.nodeType);
    return l2;
  }
  function H$1(n2, l2) {
    return l2 = l2 || [], null == n2 || "boolean" == typeof n2 || (w$3(n2) ? n2.some(function(n3) {
      H$1(n3, l2);
    }) : l2.push(n2)), l2;
  }
  function L$1(n2, l2, u2, t2) {
    var i2, r2, o3, e2 = n2.key, f2 = n2.type, c2 = l2[u2], s2 = null != c2 && 0 == (2 & c2.__u);
    if (null === c2 && null == n2.key || s2 && e2 == c2.key && f2 == c2.type) return u2;
    if (t2 > (s2 ? 1 : 0)) {
      for (i2 = u2 - 1, r2 = u2 + 1; i2 >= 0 || r2 < l2.length; ) if (null != (c2 = l2[o3 = i2 >= 0 ? i2-- : r2++]) && 0 == (2 & c2.__u) && e2 == c2.key && f2 == c2.type) return o3;
    }
    return -1;
  }
  function T$4(n2, l2, u2) {
    "-" == l2[0] ? n2.setProperty(l2, null == u2 ? "" : u2) : n2[l2] = null == u2 ? "" : "number" != typeof u2 || y$2.test(l2) ? u2 : u2 + "px";
  }
  function j$2(n2, l2, u2, t2, i2) {
    var r2, o3;
    n: if ("style" == l2) if ("string" == typeof u2) n2.style.cssText = u2;
    else {
      if ("string" == typeof t2 && (n2.style.cssText = t2 = ""), t2) for (l2 in t2) u2 && l2 in u2 || T$4(n2.style, l2, "");
      if (u2) for (l2 in u2) t2 && u2[l2] == t2[l2] || T$4(n2.style, l2, u2[l2]);
    }
    else if ("o" == l2[0] && "n" == l2[1]) r2 = l2 != (l2 = l2.replace(f$3, "$1")), o3 = l2.toLowerCase(), l2 = o3 in n2 || "onFocusOut" == l2 || "onFocusIn" == l2 ? o3.slice(2) : l2.slice(2), n2.l || (n2.l = {}), n2.l[l2 + r2] = u2, u2 ? t2 ? u2.u = t2.u : (u2.u = c$1, n2.addEventListener(l2, r2 ? a$1 : s$5, r2)) : n2.removeEventListener(l2, r2 ? a$1 : s$5, r2);
    else {
      if ("http://www.w3.org/2000/svg" == i2) l2 = l2.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
      else if ("width" != l2 && "height" != l2 && "href" != l2 && "list" != l2 && "form" != l2 && "tabIndex" != l2 && "download" != l2 && "rowSpan" != l2 && "colSpan" != l2 && "role" != l2 && "popover" != l2 && l2 in n2) try {
        n2[l2] = null == u2 ? "" : u2;
        break n;
      } catch (n3) {
      }
      "function" == typeof u2 || (null == u2 || false === u2 && "-" != l2[4] ? n2.removeAttribute(l2) : n2.setAttribute(l2, "popover" == l2 && 1 == u2 ? "" : u2));
    }
  }
  function F$4(n2) {
    return function(u2) {
      if (this.l) {
        var t2 = this.l[u2.type + n2];
        if (null == u2.t) u2.t = c$1++;
        else if (u2.t < t2.u) return;
        return t2(l$4.event ? l$4.event(u2) : u2);
      }
    };
  }
  function O$2(n2, u2, t2, i2, r2, o3, e2, f2, c2, s2) {
    var a2, h2, p2, v2, y2, _24, m2, b2, S2, C2, M2, $2, P2, A2, H2, L2, T2, j2 = u2.type;
    if (null != u2.constructor) return null;
    128 & t2.__u && (c2 = !!(32 & t2.__u), o3 = [f2 = u2.__e = t2.__e]), (a2 = l$4.__b) && a2(u2);
    n: if ("function" == typeof j2) try {
      if (b2 = u2.props, S2 = "prototype" in j2 && j2.prototype.render, C2 = (a2 = j2.contextType) && i2[a2.__c], M2 = a2 ? C2 ? C2.props.value : a2.__ : i2, t2.__c ? m2 = (h2 = u2.__c = t2.__c).__ = h2.__E : (S2 ? u2.__c = h2 = new j2(b2, M2) : (u2.__c = h2 = new x$3(b2, M2), h2.constructor = j2, h2.render = E$1), C2 && C2.sub(h2), h2.props = b2, h2.state || (h2.state = {}), h2.context = M2, h2.__n = i2, p2 = h2.__d = true, h2.__h = [], h2._sb = []), S2 && null == h2.__s && (h2.__s = h2.state), S2 && null != j2.getDerivedStateFromProps && (h2.__s == h2.state && (h2.__s = d$4({}, h2.__s)), d$4(h2.__s, j2.getDerivedStateFromProps(b2, h2.__s))), v2 = h2.props, y2 = h2.state, h2.__v = u2, p2) S2 && null == j2.getDerivedStateFromProps && null != h2.componentWillMount && h2.componentWillMount(), S2 && null != h2.componentDidMount && h2.__h.push(h2.componentDidMount);
      else {
        if (S2 && null == j2.getDerivedStateFromProps && b2 !== v2 && null != h2.componentWillReceiveProps && h2.componentWillReceiveProps(b2, M2), !h2.__e && null != h2.shouldComponentUpdate && false === h2.shouldComponentUpdate(b2, h2.__s, M2) || u2.__v == t2.__v) {
          for (u2.__v != t2.__v && (h2.props = b2, h2.state = h2.__s, h2.__d = false), u2.__e = t2.__e, u2.__k = t2.__k, u2.__k.some(function(n3) {
            n3 && (n3.__ = u2);
          }), $2 = 0; $2 < h2._sb.length; $2++) h2.__h.push(h2._sb[$2]);
          h2._sb = [], h2.__h.length && e2.push(h2);
          break n;
        }
        null != h2.componentWillUpdate && h2.componentWillUpdate(b2, h2.__s, M2), S2 && null != h2.componentDidUpdate && h2.__h.push(function() {
          h2.componentDidUpdate(v2, y2, _24);
        });
      }
      if (h2.context = M2, h2.props = b2, h2.__P = n2, h2.__e = false, P2 = l$4.__r, A2 = 0, S2) {
        for (h2.state = h2.__s, h2.__d = false, P2 && P2(u2), a2 = h2.render(h2.props, h2.state, h2.context), H2 = 0; H2 < h2._sb.length; H2++) h2.__h.push(h2._sb[H2]);
        h2._sb = [];
      } else do {
        h2.__d = false, P2 && P2(u2), a2 = h2.render(h2.props, h2.state, h2.context), h2.state = h2.__s;
      } while (h2.__d && ++A2 < 25);
      h2.state = h2.__s, null != h2.getChildContext && (i2 = d$4(d$4({}, i2), h2.getChildContext())), S2 && !p2 && null != h2.getSnapshotBeforeUpdate && (_24 = h2.getSnapshotBeforeUpdate(v2, y2)), L2 = a2, null != a2 && a2.type === k$3 && null == a2.key && (L2 = V$1(a2.props.children)), f2 = I$3(n2, w$3(L2) ? L2 : [L2], u2, t2, i2, r2, o3, e2, f2, c2, s2), h2.base = u2.__e, u2.__u &= -161, h2.__h.length && e2.push(h2), m2 && (h2.__E = h2.__ = null);
    } catch (n3) {
      if (u2.__v = null, c2 || null != o3) if (n3.then) {
        for (u2.__u |= c2 ? 160 : 128; f2 && 8 == f2.nodeType && f2.nextSibling; ) f2 = f2.nextSibling;
        o3[o3.indexOf(f2)] = null, u2.__e = f2;
      } else {
        for (T2 = o3.length; T2--; ) g$2(o3[T2]);
        z$2(u2);
      }
      else u2.__e = t2.__e, u2.__k = t2.__k, n3.then || z$2(u2);
      l$4.__e(n3, u2, t2);
    }
    else null == o3 && u2.__v == t2.__v ? (u2.__k = t2.__k, u2.__e = t2.__e) : f2 = u2.__e = q$2(t2.__e, u2, t2, i2, r2, o3, e2, c2, s2);
    return (a2 = l$4.diffed) && a2(u2), 128 & u2.__u ? void 0 : f2;
  }
  function z$2(n2) {
    n2 && n2.__c && (n2.__c.__e = true), n2 && n2.__k && n2.__k.forEach(z$2);
  }
  function N$1(n2, u2, t2) {
    for (var i2 = 0; i2 < t2.length; i2++) B$3(t2[i2], t2[++i2], t2[++i2]);
    l$4.__c && l$4.__c(u2, n2), n2.some(function(u3) {
      try {
        n2 = u3.__h, u3.__h = [], n2.some(function(n3) {
          n3.call(u3);
        });
      } catch (n3) {
        l$4.__e(n3, u3.__v);
      }
    });
  }
  function V$1(n2) {
    return "object" != typeof n2 || null == n2 || n2.__b && n2.__b > 0 ? n2 : w$3(n2) ? n2.map(V$1) : d$4({}, n2);
  }
  function q$2(u2, t2, i2, r2, o3, e2, f2, c2, s2) {
    var a2, h2, v2, y2, d2, _24, m2, b2 = i2.props, k2 = t2.props, x2 = t2.type;
    if ("svg" == x2 ? o3 = "http://www.w3.org/2000/svg" : "math" == x2 ? o3 = "http://www.w3.org/1998/Math/MathML" : o3 || (o3 = "http://www.w3.org/1999/xhtml"), null != e2) {
      for (a2 = 0; a2 < e2.length; a2++) if ((d2 = e2[a2]) && "setAttribute" in d2 == !!x2 && (x2 ? d2.localName == x2 : 3 == d2.nodeType)) {
        u2 = d2, e2[a2] = null;
        break;
      }
    }
    if (null == u2) {
      if (null == x2) return document.createTextNode(k2);
      u2 = document.createElementNS(o3, x2, k2.is && k2), c2 && (l$4.__m && l$4.__m(t2, e2), c2 = false), e2 = null;
    }
    if (null == x2) b2 === k2 || c2 && u2.data == k2 || (u2.data = k2);
    else {
      if (e2 = e2 && n.call(u2.childNodes), b2 = i2.props || p$5, !c2 && null != e2) for (b2 = {}, a2 = 0; a2 < u2.attributes.length; a2++) b2[(d2 = u2.attributes[a2]).name] = d2.value;
      for (a2 in b2) if (d2 = b2[a2], "children" == a2) ;
      else if ("dangerouslySetInnerHTML" == a2) v2 = d2;
      else if (!(a2 in k2)) {
        if ("value" == a2 && "defaultValue" in k2 || "checked" == a2 && "defaultChecked" in k2) continue;
        j$2(u2, a2, null, d2, o3);
      }
      for (a2 in k2) d2 = k2[a2], "children" == a2 ? y2 = d2 : "dangerouslySetInnerHTML" == a2 ? h2 = d2 : "value" == a2 ? _24 = d2 : "checked" == a2 ? m2 = d2 : c2 && "function" != typeof d2 || b2[a2] === d2 || j$2(u2, a2, d2, b2[a2], o3);
      if (h2) c2 || v2 && (h2.__html == v2.__html || h2.__html == u2.innerHTML) || (u2.innerHTML = h2.__html), t2.__k = [];
      else if (v2 && (u2.innerHTML = ""), I$3("template" == t2.type ? u2.content : u2, w$3(y2) ? y2 : [y2], t2, i2, r2, "foreignObject" == x2 ? "http://www.w3.org/1999/xhtml" : o3, e2, f2, e2 ? e2[0] : i2.__k && S$2(i2, 0), c2, s2), null != e2) for (a2 = e2.length; a2--; ) g$2(e2[a2]);
      c2 || (a2 = "value", "progress" == x2 && null == _24 ? u2.removeAttribute("value") : null != _24 && (_24 !== u2[a2] || "progress" == x2 && !_24 || "option" == x2 && _24 != b2[a2]) && j$2(u2, a2, _24, b2[a2], o3), a2 = "checked", null != m2 && m2 != u2[a2] && j$2(u2, a2, m2, b2[a2], o3));
    }
    return u2;
  }
  function B$3(n2, u2, t2) {
    try {
      if ("function" == typeof n2) {
        var i2 = "function" == typeof n2.__u;
        i2 && n2.__u(), i2 && null == u2 || (n2.__u = n2(u2));
      } else n2.current = u2;
    } catch (n3) {
      l$4.__e(n3, t2);
    }
  }
  function D$2(n2, u2, t2) {
    var i2, r2;
    if (l$4.unmount && l$4.unmount(n2), (i2 = n2.ref) && (i2.current && i2.current != n2.__e || B$3(i2, null, u2)), null != (i2 = n2.__c)) {
      if (i2.componentWillUnmount) try {
        i2.componentWillUnmount();
      } catch (n3) {
        l$4.__e(n3, u2);
      }
      i2.base = i2.__P = null;
    }
    if (i2 = n2.__k) for (r2 = 0; r2 < i2.length; r2++) i2[r2] && D$2(i2[r2], u2, t2 || "function" != typeof n2.type);
    t2 || g$2(n2.__e), n2.__c = n2.__ = n2.__e = void 0;
  }
  function E$1(n2, l2, u2) {
    return this.constructor(n2, u2);
  }
  function G$2(u2, t2, i2) {
    var r2, o3, e2, f2;
    t2 == document && (t2 = document.documentElement), l$4.__ && l$4.__(u2, t2), o3 = (r2 = "function" == typeof i2) ? null : i2 && i2.__k || t2.__k, e2 = [], f2 = [], O$2(t2, u2 = (!r2 && i2 || t2).__k = _$1(k$3, null, [u2]), o3 || p$5, p$5, t2.namespaceURI, !r2 && i2 ? [i2] : o3 ? null : t2.firstChild ? n.call(t2.childNodes) : null, e2, !r2 && i2 ? i2 : o3 ? o3.__e : t2.firstChild, r2, f2), N$1(e2, u2, f2);
  }
  function J$1(n2, l2) {
    G$2(n2, l2, J$1);
  }
  function K$1(l2, u2, t2) {
    var i2, r2, o3, e2, f2 = d$4({}, l2.props);
    for (o3 in l2.type && l2.type.defaultProps && (e2 = l2.type.defaultProps), u2) "key" == o3 ? i2 = u2[o3] : "ref" == o3 ? r2 = u2[o3] : f2[o3] = void 0 === u2[o3] && null != e2 ? e2[o3] : u2[o3];
    return arguments.length > 2 && (f2.children = arguments.length > 3 ? n.call(arguments, 2) : t2), m$2(l2.type, f2, i2 || l2.key, r2 || l2.ref, null);
  }
  function Q$1(n2) {
    function l2(n3) {
      var u2, t2;
      return this.getChildContext || (u2 = /* @__PURE__ */ new Set(), (t2 = {})[l2.__c] = this, this.getChildContext = function() {
        return t2;
      }, this.componentWillUnmount = function() {
        u2 = null;
      }, this.shouldComponentUpdate = function(n4) {
        this.props.value != n4.value && u2.forEach(function(n5) {
          n5.__e = true, M$1(n5);
        });
      }, this.sub = function(n4) {
        u2.add(n4);
        var l3 = n4.componentWillUnmount;
        n4.componentWillUnmount = function() {
          u2 && u2.delete(n4), l3 && l3.call(n4);
        };
      }), n3.children;
    }
    return l2.__c = "__cC" + h$3++, l2.__ = n2, l2.Provider = l2.__l = (l2.Consumer = function(n3, l3) {
      return n3.children(l3);
    }).contextType = l2, l2;
  }
  n = v$3.slice, l$4 = { __e: function(n2, l2, u2, t2) {
    for (var i2, r2, o3; l2 = l2.__; ) if ((i2 = l2.__c) && !i2.__) try {
      if ((r2 = i2.constructor) && null != r2.getDerivedStateFromError && (i2.setState(r2.getDerivedStateFromError(n2)), o3 = i2.__d), null != i2.componentDidCatch && (i2.componentDidCatch(n2, t2 || {}), o3 = i2.__d), o3) return i2.__E = i2;
    } catch (l3) {
      n2 = l3;
    }
    throw n2;
  } }, u$6 = 0, x$3.prototype.setState = function(n2, l2) {
    var u2;
    u2 = null != this.__s && this.__s != this.state ? this.__s : this.__s = d$4({}, this.state), "function" == typeof n2 && (n2 = n2(d$4({}, u2), this.props)), n2 && d$4(u2, n2), null != n2 && this.__v && (l2 && this._sb.push(l2), M$1(this));
  }, x$3.prototype.forceUpdate = function(n2) {
    this.__v && (this.__e = true, n2 && this.__h.push(n2), M$1(this));
  }, x$3.prototype.render = k$3, i$4 = [], o$6 = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, e$2 = function(n2, l2) {
    return n2.__v.__b - l2.__v.__b;
  }, $$1.__r = 0, f$3 = /(PointerCapture)$|Capture$/i, c$1 = 0, s$5 = F$4(false), a$1 = F$4(true), h$3 = 0;
  var f$2 = 0;
  function u$5(e2, t2, n2, o3, i2, u2) {
    t2 || (t2 = {});
    var a2, c2, p2 = t2;
    if ("ref" in p2) for (c2 in p2 = {}, t2) "ref" == c2 ? a2 = t2[c2] : p2[c2] = t2[c2];
    var l2 = { type: e2, props: p2, key: n2, ref: a2, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f$2, __i: -1, __u: 0, __source: i2, __self: u2 };
    if ("function" == typeof e2 && (a2 = e2.defaultProps)) for (c2 in a2) void 0 === p2[c2] && (p2[c2] = a2[c2]);
    return l$4.vnode && l$4.vnode(l2), l2;
  }
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function getDefaultExportFromCjs(x2) {
    return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
  }
  var sentinel_umd = { exports: {} };
  (function(module, exports$1) {
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
          if (!callback) return;
          if (!styleEl) {
            var doc = document, head2 = doc.head;
            doc.addEventListener("animationstart", function(ev, callbacks, l2, i2) {
              callbacks = animationCallbacks[ev.animationName];
              if (!callbacks) return;
              ev.stopImmediatePropagation();
              l2 = callbacks.length;
              for (i2 = 0; i2 < l2; i2++) callbacks[i2](ev.target);
            }, true);
            styleEl = doc.getElementById("sentinel-css");
            if (!styleEl) {
              styleEl = doc.createElement("style");
              head2.insertBefore(styleEl, head2.firstChild);
            }
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
            if (!(animId = selectorToAnimationMap[selector])) return;
            callbackList = animationCallbacks[animId];
            if (callback) {
              i2 = callbackList.length;
              while (i2--) {
                if (callbackList[i2] === callback) callbackList.splice(i2, 1);
              }
            } else {
              callbackList = [];
            }
            if (callbackList.length) return;
            i2 = cssRules.length;
            while (i2--) {
              if (cssRules[i2]._id == selector) styleSheet.deleteRule(i2);
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
          if (styleEl) styleEl.parentNode.removeChild(styleEl);
          styleEl = 0;
        }
      };
    });
  })(sentinel_umd);
  var sentinel_umdExports = sentinel_umd.exports;
  const sentinel = /* @__PURE__ */ getDefaultExportFromCjs(sentinel_umdExports);
  var dist = {};
  var __assign$1 = commonjsGlobal && commonjsGlobal.__assign || function() {
    __assign$1 = Object.assign || function(t2) {
      for (var s2, i2 = 1, n2 = arguments.length; i2 < n2; i2++) {
        s2 = arguments[i2];
        for (var p2 in s2) if (Object.prototype.hasOwnProperty.call(s2, p2))
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
  const API_MAPPING = {
    "https://chat.openai.com": "https://chat.openai.com/backend-api",
    "https://chatgpt.com": "https://chatgpt.com/backend-api",
    "https://new.oaifree.com": "https://new.oaifree.com/backend-api"
  };
  const baseUrl = new URL(location.href).origin;
  const apiUrl = API_MAPPING[baseUrl];
  const KEY_LANGUAGE = "exporter:language";
  const KEY_FILENAME_FORMAT = "exporter:filename_format";
  const KEY_TIMESTAMP_ENABLED = "exporter:enable_timestamp";
  const KEY_TIMESTAMP_24H = "exporter:timestamp_24h";
  const KEY_TIMESTAMP_MARKDOWN = "exporter:timestamp_markdown";
  const KEY_TIMESTAMP_HTML = "exporter:timestamp_html";
  const KEY_META_ENABLED = "exporter:enable_meta";
  const KEY_META_LIST = "exporter:meta_list";
  const KEY_EXPORT_ALL_LIMIT = "exporter:export_all_limit";
  const KEY_EXPORT_CHUNK_SIZE = "exporter:export_chunk_size";
  const KEY_ANTHROPIC_API_KEY = "exporter:anthropic_api_key";
  const KEY_OAI_LOCALE = "oai/apps/locale";
  const KEY_OAI_HISTORY_DISABLED = "oai/apps/historyDisabled";
  var _GM_deleteValue = /* @__PURE__ */ (() => typeof GM_deleteValue != "undefined" ? GM_deleteValue : void 0)();
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  function getBase64FromImg(el) {
    const canvas = document.createElement("canvas");
    canvas.width = el.naturalWidth;
    canvas.height = el.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";
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
  function blobToDataURL(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }
  function getHistoryDisabled() {
    return localStorage.getItem(KEY_OAI_HISTORY_DISABLED) === '"true"';
  }
  function getPageAccessToken() {
    var _a, _b, _c, _d, _e2, _f;
    return ((_f = (_e2 = (_d = (_c = (_b = (_a = _unsafeWindow == null ? void 0 : _unsafeWindow.__remixContext) == null ? void 0 : _a.state) == null ? void 0 : _b.loaderData) == null ? void 0 : _c.root) == null ? void 0 : _d.clientBootstrap) == null ? void 0 : _e2.session) == null ? void 0 : _f.accessToken) ?? null;
  }
  function getUserProfile() {
    var _a, _b, _c, _d, _e2, _f, _g, _h, _i;
    const user = ((_c = (_b = (_a = _unsafeWindow == null ? void 0 : _unsafeWindow.__NEXT_DATA__) == null ? void 0 : _a.props) == null ? void 0 : _b.pageProps) == null ? void 0 : _c.user) ?? ((_i = (_h = (_g = (_f = (_e2 = (_d = _unsafeWindow == null ? void 0 : _unsafeWindow.__remixContext) == null ? void 0 : _d.state) == null ? void 0 : _e2.loaderData) == null ? void 0 : _f.root) == null ? void 0 : _g.clientBootstrap) == null ? void 0 : _h.session) == null ? void 0 : _i.user);
    if (!user) throw new Error("No user found.");
    return user;
  }
  function getChatIdFromUrl() {
    const match = location.pathname.match(/^\/(?:share|c|g\/[a-z0-9-]+\/c)\/([a-z0-9-]+)/i);
    if (match) return match[1];
    return null;
  }
  function isSharePage() {
    return location.pathname.startsWith("/share") && !location.pathname.endsWith("/continue");
  }
  function getConversationFromSharePage() {
    var _a, _b, _c, _d, _e2, _f, _g, _h, _i;
    if ((_d = (_c = (_b = (_a = window.__NEXT_DATA__) == null ? void 0 : _a.props) == null ? void 0 : _b.pageProps) == null ? void 0 : _c.serverResponse) == null ? void 0 : _d.data) {
      return JSON.parse(JSON.stringify(window.__NEXT_DATA__.props.pageProps.serverResponse.data));
    }
    if ((_i = (_h = (_g = (_f = (_e2 = window.__remixContext) == null ? void 0 : _e2.state) == null ? void 0 : _f.loaderData) == null ? void 0 : _g["routes/share.$shareId.($action)"]) == null ? void 0 : _h.serverResponse) == null ? void 0 : _i.data) {
      return JSON.parse(JSON.stringify(window.__remixContext.state.loaderData["routes/share.$shareId.($action)"].serverResponse.data));
    }
    return null;
  }
  const defaultAvatar = "data:image/svg+xml,%3Csvg%20stroke%3D%22currentColor%22%20fill%3D%22none%22%20stroke-width%3D%221.5%22%20viewBox%3D%22-6%20-6%2036%2036%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20style%3D%22color%3A%20white%3B%20background%3A%20%23ab68ff%3B%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M20%2021v-2a4%204%200%200%200-4-4H8a4%204%200%200%200-4%204v2%22%3E%3C%2Fpath%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%227%22%20r%3D%224%22%3E%3C%2Fcircle%3E%3C%2Fsvg%3E";
  async function getUserAvatar() {
    try {
      const { picture } = getUserProfile();
      if (picture) return await getBase64FromImageUrl(picture);
    } catch (e2) {
      console.error(e2);
    }
    try {
      const avatars = Array.from(document.querySelectorAll("img[alt]:not([aria-hidden])"));
      const avatar = avatars.find((avatar2) => !avatar2.src.startsWith("data:"));
      if (avatar) return getBase64FromImg(avatar);
    } catch (e2) {
      console.error(e2);
    }
    return defaultAvatar;
  }
  function checkIfConversationStarted() {
    return !!document.querySelector('[data-testid^="conversation-turn-"]');
  }
  const generateKey = (args) => JSON.stringify(args);
  function memorize(fn2) {
    const cache = /* @__PURE__ */ new Map();
    const memorized = (...args) => {
      const key2 = generateKey(args);
      if (cache.has(key2)) {
        return cache.get(key2);
      }
      const result = fn2(...args);
      cache.set(key2, result);
      return result;
    };
    return memorized;
  }
  const sessionApi = _default(baseUrl, "/api/auth/session");
  const conversationApi = (id) => _default(apiUrl, "/conversation/:id", { id });
  const conversationsApi = (offset2, limit) => _default(apiUrl, "/conversations", { offset: offset2, limit });
  const fileDownloadApi = (id) => _default(apiUrl, "/files/:id/download", { id });
  const projectsApi = () => _default(apiUrl, "/gizmos/snorlax/sidebar", { conversations_per_gizmo: 0 });
  const projectConversationsApi = (gizmo, offset2, limit) => _default(apiUrl, "/gizmos/:gizmo/conversations", { gizmo, cursor: offset2, limit });
  const accountsCheckApi = _default(apiUrl, "/accounts/check/v4-2023-04-27");
  async function getCurrentChatId() {
    if (isSharePage()) {
      return `__share__${getChatIdFromUrl()}`;
    }
    const chatId = getChatIdFromUrl();
    if (chatId) return chatId;
    const conversations = await fetchConversations();
    if (conversations && conversations.items.length > 0) {
      return conversations.items[0].id;
    }
    throw new Error("No chat id found.");
  }
  async function fetchImageFromPointer(uri) {
    const pointer = uri.replace("file-service://", "");
    const imageDetails = await fetchApi(fileDownloadApi(pointer));
    if (imageDetails.status === "error") {
      console.error("Failed to fetch image asset", imageDetails.error_code, imageDetails.error_message);
      return null;
    }
    const image2 = await fetch(imageDetails.download_url);
    const blob = await image2.blob();
    const base64 = await blobToDataURL(blob);
    return base64.replace(/^data:.*?;/, `data:${image2.headers.get("content-type")};`);
  }
  async function replaceImageAssets(conversation) {
    const isMultiModalInputImage = (part) => {
      return typeof part === "object" && part !== null && "content_type" in part && part.content_type === "image_asset_pointer" && "asset_pointer" in part && typeof part.asset_pointer === "string" && part.asset_pointer.startsWith("file-service://");
    };
    const imageAssets = Object.values(conversation.mapping).flatMap((node2) => {
      if (!node2.message) return [];
      if (node2.message.content.content_type !== "multimodal_text") return [];
      return (Array.isArray(node2.message.content.parts) ? node2.message.content.parts : []).filter(isMultiModalInputImage);
    });
    const executionOutputs = Object.values(conversation.mapping).flatMap((node2) => {
      var _a, _b;
      if (!node2.message) return [];
      if (node2.message.content.content_type !== "execution_output") return [];
      if (!((_b = (_a = node2.message.metadata) == null ? void 0 : _a.aggregate_result) == null ? void 0 : _b.messages)) return [];
      return node2.message.metadata.aggregate_result.messages.filter((msg) => msg.message_type === "image");
    });
    await Promise.all([
      ...imageAssets.map(async (asset) => {
        try {
          const newAssetPointer = await fetchImageFromPointer(asset.asset_pointer);
          if (newAssetPointer) asset.asset_pointer = newAssetPointer;
        } catch (error2) {
          console.error("Failed to fetch image asset", error2);
        }
      }),
      ...executionOutputs.map(async (msg) => {
        try {
          const newImageUrl = await fetchImageFromPointer(msg.image_url);
          if (newImageUrl) msg.image_url = newImageUrl;
        } catch (error2) {
          console.error("Failed to fetch image asset", error2);
        }
      })
    ]);
  }
  async function fetchConversation(chatId, shouldReplaceAssets) {
    if (chatId.startsWith("__share__")) {
      const id = chatId.replace("__share__", "");
      const shareConversation = getConversationFromSharePage();
      await replaceImageAssets(shareConversation);
      return {
        id,
        ...shareConversation
      };
    }
    const url = conversationApi(chatId);
    const conversation = await fetchApi(url);
    if (shouldReplaceAssets) {
      await replaceImageAssets(conversation);
    }
    return {
      id: chatId,
      ...conversation
    };
  }
  async function fetchProjects() {
    const url = projectsApi();
    const { items } = await fetchApi(url);
    return items.map((gizmo) => gizmo.gizmo.gizmo);
  }
  async function fetchConversations(offset2 = 0, limit = 20, project = null) {
    if (project) {
      return fetchProjectConversations(project, offset2, limit);
    }
    const url = conversationsApi(offset2, limit);
    return fetchApi(url);
  }
  async function fetchProjectConversations(project, offset2 = 0, limit = 20) {
    const url = projectConversationsApi(project, offset2, limit);
    const { items } = await fetchApi(url);
    return {
      has_missing_conversations: false,
      items,
      limit,
      offset: offset2,
      total: null
    };
  }
  async function fetchAllConversations(project = null, maxConversations = 1e3) {
    const conversations = [];
    const limit = project === null ? 100 : 50;
    let offset2 = 0;
    while (true) {
      try {
        const result = project === null ? await fetchConversations(offset2, limit) : await fetchProjectConversations(project, offset2, limit);
        if (!result.items) {
          console.warn("fetchAllConversations received no items at offset:", offset2);
          break;
        }
        conversations.push(...result.items);
        if (result.items.length === 0) break;
        if (result.total !== null && offset2 + limit >= result.total) break;
        if (conversations.length >= maxConversations) break;
        offset2 += limit;
      } catch (error2) {
        console.error("Error fetching conversations batch:", error2);
        break;
      }
    }
    return conversations.slice(0, maxConversations);
  }
  async function archiveConversation(chatId) {
    const url = conversationApi(chatId);
    const { success } = await fetchApi(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_archived: true })
    });
    return success;
  }
  async function deleteConversation(chatId) {
    const url = conversationApi(chatId);
    const { success } = await fetchApi(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_visible: false })
    });
    return success;
  }
  async function fetchApi(url, options) {
    const accessToken = await getAccessToken();
    const accountId = await getTeamAccountId();
    const response = await fetch(url, {
      ...options,
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "X-Authorization": `Bearer ${accessToken}`,
        ...accountId ? { "Chatgpt-Account-Id": accountId } : {},
        ...options == null ? void 0 : options.headers
      }
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  }
  async function _fetchSession() {
    const response = await fetch(sessionApi);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  }
  const fetchSession = memorize(_fetchSession);
  async function getAccessToken() {
    const pageAccessToken = getPageAccessToken();
    if (pageAccessToken) return pageAccessToken;
    const session = await fetchSession();
    return session.accessToken;
  }
  async function _fetchAccountsCheck() {
    const accessToken = await getAccessToken();
    const response = await fetch(accountsCheckApi, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "X-Authorization": `Bearer ${accessToken}`
      }
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  }
  const fetchAccountsCheck = memorize(_fetchAccountsCheck);
  const getCookie = (key2) => {
    var _a;
    return ((_a = document.cookie.match(`(^|;)\\s*${key2}\\s*=\\s*([^;]+)`)) == null ? void 0 : _a.pop()) || "";
  };
  async function getTeamAccountId() {
    const accountsCheck = await fetchAccountsCheck();
    const workspaceId = getCookie(
      "_account"
      /* Workspace */
    );
    if (workspaceId) {
      const account = accountsCheck.accounts[workspaceId];
      if (account) {
        return account.account.account_id;
      }
    }
    return null;
  }
  const ModelMapping = {
    "text-davinci-002-render-sha": "GPT-3.5",
    "text-davinci-002-render-paid": "GPT-3.5",
    "text-davinci-002-browse": "GPT-3.5",
    "gpt-4": "GPT-4",
    "gpt-4-browsing": "GPT-4 (Browser)",
    "gpt-4o": "GPT-4o",
    // fuzzy matching
    "text-davinci-002": "GPT-3.5"
  };
  function processConversation(conversation) {
    var _a;
    const title2 = conversation.title || "ChatGPT Conversation";
    const createTime = conversation.create_time;
    const updateTime = conversation.update_time;
    const { model, modelSlug } = extractModel(conversation.mapping);
    const startNodeId = conversation.current_node || ((_a = Object.values(conversation.mapping).find((node2) => !node2.children || node2.children.length === 0)) == null ? void 0 : _a.id);
    if (!startNodeId) throw new Error("Failed to find start node.");
    const conversationNodes = extractConversationResult(conversation.mapping, startNodeId);
    const mergedConversationNodes = mergeContinuationNodes(conversationNodes);
    return {
      id: conversation.id,
      title: title2,
      model,
      modelSlug,
      createTime,
      updateTime,
      conversationNodes: mergedConversationNodes
    };
  }
  function extractModel(conversationMapping) {
    var _a, _b, _c;
    let model = "";
    const modelSlug = ((_c = (_b = (_a = Object.values(conversationMapping).find((node2) => {
      var _a2, _b2;
      return (_b2 = (_a2 = node2.message) == null ? void 0 : _a2.metadata) == null ? void 0 : _b2.model_slug;
    })) == null ? void 0 : _a.message) == null ? void 0 : _b.metadata) == null ? void 0 : _c.model_slug) || "";
    if (modelSlug) {
      if (ModelMapping[modelSlug]) {
        model = ModelMapping[modelSlug];
      } else {
        Object.keys(ModelMapping).forEach((key2) => {
          if (modelSlug.startsWith(key2)) {
            model = key2;
          }
        });
      }
    }
    return {
      model,
      modelSlug
    };
  }
  function extractConversationResult(conversationMapping, startNodeId) {
    var _a, _b, _c;
    const result = [];
    let currentNodeId = startNodeId;
    while (currentNodeId) {
      const node2 = conversationMapping[currentNodeId];
      if (!node2) {
        break;
      }
      if (node2.parent === void 0) {
        break;
      }
      if (
        // Skip system messages
        ((_a = node2.message) == null ? void 0 : _a.author.role) !== "system" && ((_b = node2.message) == null ? void 0 : _b.content.content_type) !== "model_editable_context" && ((_c = node2.message) == null ? void 0 : _c.content.content_type) !== "user_editable_context"
      ) {
        result.unshift(node2);
      }
      currentNodeId = node2.parent;
    }
    return result;
  }
  function mergeContinuationNodes(nodes) {
    var _a, _b;
    const result = [];
    for (const node2 of nodes) {
      const prevNode = result[result.length - 1];
      if (((_a = prevNode == null ? void 0 : prevNode.message) == null ? void 0 : _a.author.role) === "assistant" && ((_b = node2.message) == null ? void 0 : _b.author.role) === "assistant" && prevNode.message.recipient === "all" && node2.message.recipient === "all" && prevNode.message.content.content_type === "text" && node2.message.content.content_type === "text") {
        prevNode.message.content.parts[prevNode.message.content.parts.length - 1] += node2.message.content.parts[0];
        prevNode.message.content.parts.push(...node2.message.content.parts.slice(1));
      } else {
        result.push(node2);
      }
    }
    return result;
  }
  var t$2, r$2, u$4, i$3, o$5 = 0, f$1 = [], c = l$4, e$1 = c.__b, a = c.__r, v$2 = c.diffed, l$3 = c.__c, m$1 = c.unmount, s$4 = c.__;
  function p$4(n2, t2) {
    c.__h && c.__h(r$2, n2, o$5 || t2), o$5 = 0;
    var u2 = r$2.__H || (r$2.__H = { __: [], __h: [] });
    return n2 >= u2.__.length && u2.__.push({}), u2.__[n2];
  }
  function d$3(n2) {
    return o$5 = 1, h$2(D$1, n2);
  }
  function h$2(n2, u2, i2) {
    var o3 = p$4(t$2++, 2);
    if (o3.t = n2, !o3.__c && (o3.__ = [i2 ? i2(u2) : D$1(void 0, u2), function(n3) {
      var t2 = o3.__N ? o3.__N[0] : o3.__[0], r2 = o3.t(t2, n3);
      t2 !== r2 && (o3.__N = [r2, o3.__[1]], o3.__c.setState({}));
    }], o3.__c = r$2, !r$2.__f)) {
      var f2 = function(n3, t2, r2) {
        if (!o3.__c.__H) return true;
        var u3 = o3.__c.__H.__.filter(function(n4) {
          return !!n4.__c;
        });
        if (u3.every(function(n4) {
          return !n4.__N;
        })) return !c2 || c2.call(this, n3, t2, r2);
        var i3 = o3.__c.props !== n3;
        return u3.forEach(function(n4) {
          if (n4.__N) {
            var t3 = n4.__[0];
            n4.__ = n4.__N, n4.__N = void 0, t3 !== n4.__[0] && (i3 = true);
          }
        }), c2 && c2.call(this, n3, t2, r2) || i3;
      };
      r$2.__f = true;
      var c2 = r$2.shouldComponentUpdate, e2 = r$2.componentWillUpdate;
      r$2.componentWillUpdate = function(n3, t2, r2) {
        if (this.__e) {
          var u3 = c2;
          c2 = void 0, f2(n3, t2, r2), c2 = u3;
        }
        e2 && e2.call(this, n3, t2, r2);
      }, r$2.shouldComponentUpdate = f2;
    }
    return o3.__N || o3.__;
  }
  function y$1(n2, u2) {
    var i2 = p$4(t$2++, 3);
    !c.__s && C$2(i2.__H, u2) && (i2.__ = n2, i2.u = u2, r$2.__H.__h.push(i2));
  }
  function _(n2, u2) {
    var i2 = p$4(t$2++, 4);
    !c.__s && C$2(i2.__H, u2) && (i2.__ = n2, i2.u = u2, r$2.__h.push(i2));
  }
  function A$2(n2) {
    return o$5 = 5, T$3(function() {
      return { current: n2 };
    }, []);
  }
  function F$3(n2, t2, r2) {
    o$5 = 6, _(function() {
      if ("function" == typeof n2) {
        var r3 = n2(t2());
        return function() {
          n2(null), r3 && "function" == typeof r3 && r3();
        };
      }
      if (n2) return n2.current = t2(), function() {
        return n2.current = null;
      };
    }, null == r2 ? r2 : r2.concat(n2));
  }
  function T$3(n2, r2) {
    var u2 = p$4(t$2++, 7);
    return C$2(u2.__H, r2) && (u2.__ = n2(), u2.__H = r2, u2.__h = n2), u2.__;
  }
  function q$1(n2, t2) {
    return o$5 = 8, T$3(function() {
      return n2;
    }, t2);
  }
  function x$2(n2) {
    var u2 = r$2.context[n2.__c], i2 = p$4(t$2++, 9);
    return i2.c = n2, u2 ? (null == i2.__ && (i2.__ = true, u2.sub(r$2)), u2.props.value) : n2.__;
  }
  function P$1(n2, t2) {
    c.useDebugValue && c.useDebugValue(t2 ? t2(n2) : n2);
  }
  function b(n2) {
    var u2 = p$4(t$2++, 10), i2 = d$3();
    return u2.__ = n2, r$2.componentDidCatch || (r$2.componentDidCatch = function(n3, t2) {
      u2.__ && u2.__(n3, t2), i2[1](n3);
    }), [i2[0], function() {
      i2[1](void 0);
    }];
  }
  function g$1() {
    var n2 = p$4(t$2++, 11);
    if (!n2.__) {
      for (var u2 = r$2.__v; null !== u2 && !u2.__m && null !== u2.__; ) u2 = u2.__;
      var i2 = u2.__m || (u2.__m = [0, 0]);
      n2.__ = "P" + i2[0] + "-" + i2[1]++;
    }
    return n2.__;
  }
  function j$1() {
    for (var n2; n2 = f$1.shift(); ) if (n2.__P && n2.__H) try {
      n2.__H.__h.forEach(z$1), n2.__H.__h.forEach(B$2), n2.__H.__h = [];
    } catch (t2) {
      n2.__H.__h = [], c.__e(t2, n2.__v);
    }
  }
  c.__b = function(n2) {
    r$2 = null, e$1 && e$1(n2);
  }, c.__ = function(n2, t2) {
    n2 && t2.__k && t2.__k.__m && (n2.__m = t2.__k.__m), s$4 && s$4(n2, t2);
  }, c.__r = function(n2) {
    a && a(n2), t$2 = 0;
    var i2 = (r$2 = n2.__c).__H;
    i2 && (u$4 === r$2 ? (i2.__h = [], r$2.__h = [], i2.__.forEach(function(n3) {
      n3.__N && (n3.__ = n3.__N), n3.u = n3.__N = void 0;
    })) : (i2.__h.forEach(z$1), i2.__h.forEach(B$2), i2.__h = [], t$2 = 0)), u$4 = r$2;
  }, c.diffed = function(n2) {
    v$2 && v$2(n2);
    var t2 = n2.__c;
    t2 && t2.__H && (t2.__H.__h.length && (1 !== f$1.push(t2) && i$3 === c.requestAnimationFrame || ((i$3 = c.requestAnimationFrame) || w$2)(j$1)), t2.__H.__.forEach(function(n3) {
      n3.u && (n3.__H = n3.u), n3.u = void 0;
    })), u$4 = r$2 = null;
  }, c.__c = function(n2, t2) {
    t2.some(function(n3) {
      try {
        n3.__h.forEach(z$1), n3.__h = n3.__h.filter(function(n4) {
          return !n4.__ || B$2(n4);
        });
      } catch (r2) {
        t2.some(function(n4) {
          n4.__h && (n4.__h = []);
        }), t2 = [], c.__e(r2, n3.__v);
      }
    }), l$3 && l$3(n2, t2);
  }, c.unmount = function(n2) {
    m$1 && m$1(n2);
    var t2, r2 = n2.__c;
    r2 && r2.__H && (r2.__H.__.forEach(function(n3) {
      try {
        z$1(n3);
      } catch (n4) {
        t2 = n4;
      }
    }), r2.__H = void 0, t2 && c.__e(t2, r2.__v));
  };
  var k$2 = "function" == typeof requestAnimationFrame;
  function w$2(n2) {
    var t2, r2 = function() {
      clearTimeout(u2), k$2 && cancelAnimationFrame(t2), setTimeout(n2);
    }, u2 = setTimeout(r2, 35);
    k$2 && (t2 = requestAnimationFrame(r2));
  }
  function z$1(n2) {
    var t2 = r$2, u2 = n2.__c;
    "function" == typeof u2 && (n2.__c = void 0, u2()), r$2 = t2;
  }
  function B$2(n2) {
    var t2 = r$2;
    n2.__c = n2.__(), r$2 = t2;
  }
  function C$2(n2, t2) {
    return !n2 || n2.length !== t2.length || t2.some(function(t3, r2) {
      return t3 !== n2[r2];
    });
  }
  function D$1(n2, t2) {
    return "function" == typeof t2 ? t2(n2) : t2;
  }
  function g(n2, t2) {
    for (var e2 in t2) n2[e2] = t2[e2];
    return n2;
  }
  function E(n2, t2) {
    for (var e2 in n2) if ("__source" !== e2 && !(e2 in t2)) return true;
    for (var r2 in t2) if ("__source" !== r2 && n2[r2] !== t2[r2]) return true;
    return false;
  }
  function C$1(n2, t2) {
    var e2 = t2(), r2 = d$3({ t: { __: e2, u: t2 } }), u2 = r2[0].t, o3 = r2[1];
    return _(function() {
      u2.__ = e2, u2.u = t2, x$1(u2) && o3({ t: u2 });
    }, [n2, e2, t2]), y$1(function() {
      return x$1(u2) && o3({ t: u2 }), n2(function() {
        x$1(u2) && o3({ t: u2 });
      });
    }, [n2]), e2;
  }
  function x$1(n2) {
    var t2, e2, r2 = n2.u, u2 = n2.__;
    try {
      var o3 = r2();
      return !((t2 = u2) === (e2 = o3) && (0 !== t2 || 1 / t2 == 1 / e2) || t2 != t2 && e2 != e2);
    } catch (n3) {
      return true;
    }
  }
  function R$1(n2) {
    n2();
  }
  function w$1(n2) {
    return n2;
  }
  function k$1() {
    return [false, R$1];
  }
  var I$2 = _;
  function N(n2, t2) {
    this.props = n2, this.context = t2;
  }
  function M(n2, e2) {
    function r2(n3) {
      var t2 = this.props.ref, r3 = t2 == n3.ref;
      return !r3 && t2 && (t2.call ? t2(null) : t2.current = null), e2 ? !e2(this.props, n3) || !r3 : E(this.props, n3);
    }
    function u2(e3) {
      return this.shouldComponentUpdate = r2, _$1(n2, e3);
    }
    return u2.displayName = "Memo(" + (n2.displayName || n2.name) + ")", u2.prototype.isReactComponent = true, u2.__f = true, u2.type = n2, u2;
  }
  (N.prototype = new x$3()).isPureReactComponent = true, N.prototype.shouldComponentUpdate = function(n2, t2) {
    return E(this.props, n2) || E(this.state, t2);
  };
  var T$2 = l$4.__b;
  l$4.__b = function(n2) {
    n2.type && n2.type.__f && n2.ref && (n2.props.ref = n2.ref, n2.ref = null), T$2 && T$2(n2);
  };
  var A$1 = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.forward_ref") || 3911;
  function D(n2) {
    function t2(t3) {
      var e2 = g({}, t3);
      return delete e2.ref, n2(e2, t3.ref || null);
    }
    return t2.$$typeof = A$1, t2.render = n2, t2.prototype.isReactComponent = t2.__f = true, t2.displayName = "ForwardRef(" + (n2.displayName || n2.name) + ")", t2;
  }
  var L = function(n2, t2) {
    return null == n2 ? null : H$1(H$1(n2).map(t2));
  }, O$1 = { map: L, forEach: L, count: function(n2) {
    return n2 ? H$1(n2).length : 0;
  }, only: function(n2) {
    var t2 = H$1(n2);
    if (1 !== t2.length) throw "Children.only";
    return t2[0];
  }, toArray: H$1 }, F$2 = l$4.__e;
  l$4.__e = function(n2, t2, e2, r2) {
    if (n2.then) {
      for (var u2, o3 = t2; o3 = o3.__; ) if ((u2 = o3.__c) && u2.__c) return null == t2.__e && (t2.__e = e2.__e, t2.__k = e2.__k), u2.__c(n2, t2);
    }
    F$2(n2, t2, e2, r2);
  };
  var U$1 = l$4.unmount;
  function V(n2, t2, e2) {
    return n2 && (n2.__c && n2.__c.__H && (n2.__c.__H.__.forEach(function(n3) {
      "function" == typeof n3.__c && n3.__c();
    }), n2.__c.__H = null), null != (n2 = g({}, n2)).__c && (n2.__c.__P === e2 && (n2.__c.__P = t2), n2.__c.__e = true, n2.__c = null), n2.__k = n2.__k && n2.__k.map(function(n3) {
      return V(n3, t2, e2);
    })), n2;
  }
  function W(n2, t2, e2) {
    return n2 && e2 && (n2.__v = null, n2.__k = n2.__k && n2.__k.map(function(n3) {
      return W(n3, t2, e2);
    }), n2.__c && n2.__c.__P === t2 && (n2.__e && e2.appendChild(n2.__e), n2.__c.__e = true, n2.__c.__P = e2)), n2;
  }
  function P() {
    this.__u = 0, this.o = null, this.__b = null;
  }
  function j(n2) {
    var t2 = n2.__.__c;
    return t2 && t2.__a && t2.__a(n2);
  }
  function z(n2) {
    var e2, r2, u2;
    function o3(o4) {
      if (e2 || (e2 = n2()).then(function(n3) {
        r2 = n3.default || n3;
      }, function(n3) {
        u2 = n3;
      }), u2) throw u2;
      if (!r2) throw e2;
      return _$1(r2, o4);
    }
    return o3.displayName = "Lazy", o3.__f = true, o3;
  }
  function B$1() {
    this.i = null, this.l = null;
  }
  l$4.unmount = function(n2) {
    var t2 = n2.__c;
    t2 && t2.__R && t2.__R(), t2 && 32 & n2.__u && (n2.type = null), U$1 && U$1(n2);
  }, (P.prototype = new x$3()).__c = function(n2, t2) {
    var e2 = t2.__c, r2 = this;
    null == r2.o && (r2.o = []), r2.o.push(e2);
    var u2 = j(r2.__v), o3 = false, i2 = function() {
      o3 || (o3 = true, e2.__R = null, u2 ? u2(l2) : l2());
    };
    e2.__R = i2;
    var l2 = function() {
      if (!--r2.__u) {
        if (r2.state.__a) {
          var n3 = r2.state.__a;
          r2.__v.__k[0] = W(n3, n3.__c.__P, n3.__c.__O);
        }
        var t3;
        for (r2.setState({ __a: r2.__b = null }); t3 = r2.o.pop(); ) t3.forceUpdate();
      }
    };
    r2.__u++ || 32 & t2.__u || r2.setState({ __a: r2.__b = r2.__v.__k[0] }), n2.then(i2, i2);
  }, P.prototype.componentWillUnmount = function() {
    this.o = [];
  }, P.prototype.render = function(n2, e2) {
    if (this.__b) {
      if (this.__v.__k) {
        var r2 = document.createElement("div"), o3 = this.__v.__k[0].__c;
        this.__v.__k[0] = V(this.__b, r2, o3.__O = o3.__P);
      }
      this.__b = null;
    }
    var i2 = e2.__a && _$1(k$3, null, n2.fallback);
    return i2 && (i2.__u &= -33), [_$1(k$3, null, e2.__a ? null : n2.children), i2];
  };
  var H = function(n2, t2, e2) {
    if (++e2[1] === e2[0] && n2.l.delete(t2), n2.props.revealOrder && ("t" !== n2.props.revealOrder[0] || !n2.l.size)) for (e2 = n2.i; e2; ) {
      for (; e2.length > 3; ) e2.pop()();
      if (e2[1] < e2[0]) break;
      n2.i = e2 = e2[2];
    }
  };
  function Z(n2) {
    return this.getChildContext = function() {
      return n2.context;
    }, n2.children;
  }
  function Y(n2) {
    var e2 = this, r2 = n2.h;
    if (e2.componentWillUnmount = function() {
      G$2(null, e2.v), e2.v = null, e2.h = null;
    }, e2.h && e2.h !== r2 && e2.componentWillUnmount(), !e2.v) {
      for (var u2 = e2.__v; null !== u2 && !u2.__m && null !== u2.__; ) u2 = u2.__;
      e2.h = r2, e2.v = { nodeType: 1, parentNode: r2, childNodes: [], __k: { __m: u2.__m }, contains: function() {
        return true;
      }, insertBefore: function(n3, t2) {
        this.childNodes.push(n3), e2.h.insertBefore(n3, t2);
      }, removeChild: function(n3) {
        this.childNodes.splice(this.childNodes.indexOf(n3) >>> 1, 1), e2.h.removeChild(n3);
      } };
    }
    G$2(_$1(Z, { context: e2.context }, n2.__v), e2.v);
  }
  function $(n2, e2) {
    var r2 = _$1(Y, { __v: n2, h: e2 });
    return r2.containerInfo = e2, r2;
  }
  (B$1.prototype = new x$3()).__a = function(n2) {
    var t2 = this, e2 = j(t2.__v), r2 = t2.l.get(n2);
    return r2[0]++, function(u2) {
      var o3 = function() {
        t2.props.revealOrder ? (r2.push(u2), H(t2, n2, r2)) : u2();
      };
      e2 ? e2(o3) : o3();
    };
  }, B$1.prototype.render = function(n2) {
    this.i = null, this.l = /* @__PURE__ */ new Map();
    var t2 = H$1(n2.children);
    n2.revealOrder && "b" === n2.revealOrder[0] && t2.reverse();
    for (var e2 = t2.length; e2--; ) this.l.set(t2[e2], this.i = [1, 0, this.i]);
    return n2.children;
  }, B$1.prototype.componentDidUpdate = B$1.prototype.componentDidMount = function() {
    var n2 = this;
    this.l.forEach(function(t2, e2) {
      H(n2, e2, t2);
    });
  };
  var q = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.element") || 60103, G$1 = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/, J = /^on(Ani|Tra|Tou|BeforeInp|Compo)/, K = /[A-Z0-9]/g, Q = "undefined" != typeof document, X = function(n2) {
    return ("undefined" != typeof Symbol && "symbol" == typeof Symbol() ? /fil|che|rad/ : /fil|che|ra/).test(n2);
  };
  function nn(n2, t2, e2) {
    return null == t2.__k && (t2.textContent = ""), G$2(n2, t2), "function" == typeof e2 && e2(), n2 ? n2.__c : null;
  }
  function tn(n2, t2, e2) {
    return J$1(n2, t2), "function" == typeof e2 && e2(), n2 ? n2.__c : null;
  }
  x$3.prototype.isReactComponent = {}, ["componentWillMount", "componentWillReceiveProps", "componentWillUpdate"].forEach(function(t2) {
    Object.defineProperty(x$3.prototype, t2, { configurable: true, get: function() {
      return this["UNSAFE_" + t2];
    }, set: function(n2) {
      Object.defineProperty(this, t2, { configurable: true, writable: true, value: n2 });
    } });
  });
  var en = l$4.event;
  function rn() {
  }
  function un() {
    return this.cancelBubble;
  }
  function on() {
    return this.defaultPrevented;
  }
  l$4.event = function(n2) {
    return en && (n2 = en(n2)), n2.persist = rn, n2.isPropagationStopped = un, n2.isDefaultPrevented = on, n2.nativeEvent = n2;
  };
  var ln, cn = { enumerable: false, configurable: true, get: function() {
    return this.class;
  } }, fn = l$4.vnode;
  l$4.vnode = function(n2) {
    "string" == typeof n2.type && function(n3) {
      var t2 = n3.props, e2 = n3.type, u2 = {}, o3 = -1 === e2.indexOf("-");
      for (var i2 in t2) {
        var l2 = t2[i2];
        if (!("value" === i2 && "defaultValue" in t2 && null == l2 || Q && "children" === i2 && "noscript" === e2 || "class" === i2 || "className" === i2)) {
          var c2 = i2.toLowerCase();
          "defaultValue" === i2 && "value" in t2 && null == t2.value ? i2 = "value" : "download" === i2 && true === l2 ? l2 = "" : "translate" === c2 && "no" === l2 ? l2 = false : "o" === c2[0] && "n" === c2[1] ? "ondoubleclick" === c2 ? i2 = "ondblclick" : "onchange" !== c2 || "input" !== e2 && "textarea" !== e2 || X(t2.type) ? "onfocus" === c2 ? i2 = "onfocusin" : "onblur" === c2 ? i2 = "onfocusout" : J.test(i2) && (i2 = c2) : c2 = i2 = "oninput" : o3 && G$1.test(i2) ? i2 = i2.replace(K, "-$&").toLowerCase() : null === l2 && (l2 = void 0), "oninput" === c2 && u2[i2 = c2] && (i2 = "oninputCapture"), u2[i2] = l2;
        }
      }
      "select" == e2 && u2.multiple && Array.isArray(u2.value) && (u2.value = H$1(t2.children).forEach(function(n4) {
        n4.props.selected = -1 != u2.value.indexOf(n4.props.value);
      })), "select" == e2 && null != u2.defaultValue && (u2.value = H$1(t2.children).forEach(function(n4) {
        n4.props.selected = u2.multiple ? -1 != u2.defaultValue.indexOf(n4.props.value) : u2.defaultValue == n4.props.value;
      })), t2.class && !t2.className ? (u2.class = t2.class, Object.defineProperty(u2, "className", cn)) : (t2.className && !t2.class || t2.class && t2.className) && (u2.class = u2.className = t2.className), n3.props = u2;
    }(n2), n2.$$typeof = q, fn && fn(n2);
  };
  var an = l$4.__r;
  l$4.__r = function(n2) {
    an && an(n2), ln = n2.__c;
  };
  var sn = l$4.diffed;
  l$4.diffed = function(n2) {
    sn && sn(n2);
    var t2 = n2.props, e2 = n2.__e;
    null != e2 && "textarea" === n2.type && "value" in t2 && t2.value !== e2.value && (e2.value = null == t2.value ? "" : t2.value), ln = null;
  };
  var hn = { ReactCurrentDispatcher: { current: { readContext: function(n2) {
    return ln.__n[n2.__c].props.value;
  }, useCallback: q$1, useContext: x$2, useDebugValue: P$1, useDeferredValue: w$1, useEffect: y$1, useId: g$1, useImperativeHandle: F$3, useInsertionEffect: I$2, useLayoutEffect: _, useMemo: T$3, useReducer: h$2, useRef: A$2, useState: d$3, useSyncExternalStore: C$1, useTransition: k$1 } } }, vn = "18.3.1";
  function dn(n2) {
    return _$1.bind(null, n2);
  }
  function mn(n2) {
    return !!n2 && n2.$$typeof === q;
  }
  function pn(n2) {
    return mn(n2) && n2.type === k$3;
  }
  function yn(n2) {
    return !!n2 && !!n2.displayName && ("string" == typeof n2.displayName || n2.displayName instanceof String) && n2.displayName.startsWith("Memo(");
  }
  function _n(n2) {
    return mn(n2) ? K$1.apply(null, arguments) : n2;
  }
  function bn(n2) {
    return !!n2.__k && (G$2(null, n2), true);
  }
  function Sn(n2) {
    return n2 && (n2.base || 1 === n2.nodeType && n2) || null;
  }
  var gn = function(n2, t2) {
    return n2(t2);
  }, En = function(n2, t2) {
    return n2(t2);
  }, Cn = k$3, xn = mn, Rn = { useState: d$3, useId: g$1, useReducer: h$2, useEffect: y$1, useLayoutEffect: _, useInsertionEffect: I$2, useTransition: k$1, useDeferredValue: w$1, useSyncExternalStore: C$1, startTransition: R$1, useRef: A$2, useImperativeHandle: F$3, useMemo: T$3, useCallback: q$1, useContext: x$2, useDebugValue: P$1, version: "18.3.1", Children: O$1, render: nn, hydrate: tn, unmountComponentAtNode: bn, createPortal: $, createElement: _$1, createContext: Q$1, createFactory: dn, cloneElement: _n, createRef: b$1, Fragment: k$3, isValidElement: mn, isElement: xn, isFragment: pn, isMemo: yn, findDOMNode: Sn, Component: x$3, PureComponent: N, memo: M, forwardRef: D, flushSync: En, unstable_batchedUpdates: gn, StrictMode: Cn, Suspense: P, SuspenseList: B$1, lazy: z, __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: hn };
  const e = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    Children: O$1,
    Component: x$3,
    Fragment: k$3,
    PureComponent: N,
    StrictMode: Cn,
    Suspense: P,
    SuspenseList: B$1,
    __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: hn,
    cloneElement: _n,
    createContext: Q$1,
    createElement: _$1,
    createFactory: dn,
    createPortal: $,
    createRef: b$1,
    default: Rn,
    findDOMNode: Sn,
    flushSync: En,
    forwardRef: D,
    hydrate: tn,
    isElement: xn,
    isFragment: pn,
    isMemo: yn,
    isValidElement: mn,
    lazy: z,
    memo: M,
    render: nn,
    startTransition: R$1,
    unmountComponentAtNode: bn,
    unstable_batchedUpdates: gn,
    useCallback: q$1,
    useContext: x$2,
    useDebugValue: P$1,
    useDeferredValue: w$1,
    useEffect: y$1,
    useErrorBoundary: b,
    useId: g$1,
    useImperativeHandle: F$3,
    useInsertionEffect: I$2,
    useLayoutEffect: _,
    useMemo: T$3,
    useReducer: h$2,
    useRef: A$2,
    useState: d$3,
    useSyncExternalStore: C$1,
    useTransition: k$1,
    version: vn
  }, Symbol.toStringTag, { value: "Module" }));
  function composeEventHandlers(originalEventHandler, ourEventHandler, { checkForDefaultPrevented = true } = {}) {
    return function handleEvent(event) {
      originalEventHandler == null ? void 0 : originalEventHandler(event);
      if (checkForDefaultPrevented === false || !event.defaultPrevented) {
        return ourEventHandler == null ? void 0 : ourEventHandler(event);
      }
    };
  }
  function setRef(ref, value) {
    if (typeof ref === "function") {
      return ref(value);
    } else if (ref !== null && ref !== void 0) {
      ref.current = value;
    }
  }
  function composeRefs(...refs) {
    return (node2) => {
      let hasCleanup = false;
      const cleanups = refs.map((ref) => {
        const cleanup = setRef(ref, node2);
        if (!hasCleanup && typeof cleanup == "function") {
          hasCleanup = true;
        }
        return cleanup;
      });
      if (hasCleanup) {
        return () => {
          for (let i2 = 0; i2 < cleanups.length; i2++) {
            const cleanup = cleanups[i2];
            if (typeof cleanup == "function") {
              cleanup();
            } else {
              setRef(refs[i2], null);
            }
          }
        };
      }
    };
  }
  function useComposedRefs(...refs) {
    return q$1(composeRefs(...refs), refs);
  }
  function createContext2(rootComponentName, defaultContext) {
    const Context = Q$1(defaultContext);
    const Provider = (props) => {
      const { children, ...context } = props;
      const value = T$3(() => context, Object.values(context));
      return /* @__PURE__ */ u$5(Context.Provider, { value, children });
    };
    Provider.displayName = rootComponentName + "Provider";
    function useContext2(consumerName) {
      const context = x$2(Context);
      if (context) return context;
      if (defaultContext !== void 0) return defaultContext;
      throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
    }
    return [Provider, useContext2];
  }
  function createContextScope(scopeName, createContextScopeDeps = []) {
    let defaultContexts = [];
    function createContext3(rootComponentName, defaultContext) {
      const BaseContext = Q$1(defaultContext);
      const index2 = defaultContexts.length;
      defaultContexts = [...defaultContexts, defaultContext];
      const Provider = (props) => {
        var _a;
        const { scope, children, ...context } = props;
        const Context = ((_a = scope == null ? void 0 : scope[scopeName]) == null ? void 0 : _a[index2]) || BaseContext;
        const value = T$3(() => context, Object.values(context));
        return /* @__PURE__ */ u$5(Context.Provider, { value, children });
      };
      Provider.displayName = rootComponentName + "Provider";
      function useContext2(consumerName, scope) {
        var _a;
        const Context = ((_a = scope == null ? void 0 : scope[scopeName]) == null ? void 0 : _a[index2]) || BaseContext;
        const context = x$2(Context);
        if (context) return context;
        if (defaultContext !== void 0) return defaultContext;
        throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
      }
      return [Provider, useContext2];
    }
    const createScope = () => {
      const scopeContexts = defaultContexts.map((defaultContext) => {
        return Q$1(defaultContext);
      });
      return function useScope(scope) {
        const contexts = (scope == null ? void 0 : scope[scopeName]) || scopeContexts;
        return T$3(
          () => ({ [`__scope${scopeName}`]: { ...scope, [scopeName]: contexts } }),
          [scope, contexts]
        );
      };
    };
    createScope.scopeName = scopeName;
    return [createContext3, composeContextScopes(createScope, ...createContextScopeDeps)];
  }
  function composeContextScopes(...scopes) {
    const baseScope = scopes[0];
    if (scopes.length === 1) return baseScope;
    const createScope = () => {
      const scopeHooks = scopes.map((createScope2) => ({
        useScope: createScope2(),
        scopeName: createScope2.scopeName
      }));
      return function useComposedScopes(overrideScopes) {
        const nextScopes = scopeHooks.reduce((nextScopes2, { useScope, scopeName }) => {
          const scopeProps = useScope(overrideScopes);
          const currentScope = scopeProps[`__scope${scopeName}`];
          return { ...nextScopes2, ...currentScope };
        }, {});
        return T$3(() => ({ [`__scope${baseScope.scopeName}`]: nextScopes }), [nextScopes]);
      };
    };
    createScope.scopeName = baseScope.scopeName;
    return createScope;
  }
  var useLayoutEffect2 = (globalThis == null ? void 0 : globalThis.document) ? _ : () => {
  };
  var useReactId = e[" useId ".trim().toString()] || (() => void 0);
  var count$1 = 0;
  function useId(deterministicId) {
    const [id, setId] = d$3(useReactId());
    useLayoutEffect2(() => {
      setId((reactId) => reactId ?? String(count$1++));
    }, [deterministicId]);
    return deterministicId || (id ? `radix-${id}` : "");
  }
  var useInsertionEffect = e[" useInsertionEffect ".trim().toString()] || useLayoutEffect2;
  function useControllableState({
    prop,
    defaultProp,
    onChange = () => {
    },
    caller
  }) {
    const [uncontrolledProp, setUncontrolledProp, onChangeRef] = useUncontrolledState({
      defaultProp,
      onChange
    });
    const isControlled = prop !== void 0;
    const value = isControlled ? prop : uncontrolledProp;
    {
      const isControlledRef = A$2(prop !== void 0);
      y$1(() => {
        const wasControlled = isControlledRef.current;
        if (wasControlled !== isControlled) {
          const from = wasControlled ? "controlled" : "uncontrolled";
          const to = isControlled ? "controlled" : "uncontrolled";
          console.warn(
            `${caller} is changing from ${from} to ${to}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`
          );
        }
        isControlledRef.current = isControlled;
      }, [isControlled, caller]);
    }
    const setValue = q$1(
      (nextValue) => {
        var _a;
        if (isControlled) {
          const value2 = isFunction(nextValue) ? nextValue(prop) : nextValue;
          if (value2 !== prop) {
            (_a = onChangeRef.current) == null ? void 0 : _a.call(onChangeRef, value2);
          }
        } else {
          setUncontrolledProp(nextValue);
        }
      },
      [isControlled, prop, setUncontrolledProp, onChangeRef]
    );
    return [value, setValue];
  }
  function useUncontrolledState({
    defaultProp,
    onChange
  }) {
    const [value, setValue] = d$3(defaultProp);
    const prevValueRef = A$2(value);
    const onChangeRef = A$2(onChange);
    useInsertionEffect(() => {
      onChangeRef.current = onChange;
    }, [onChange]);
    y$1(() => {
      var _a;
      if (prevValueRef.current !== value) {
        (_a = onChangeRef.current) == null ? void 0 : _a.call(onChangeRef, value);
        prevValueRef.current = value;
      }
    }, [value, prevValueRef]);
    return [value, setValue, onChangeRef];
  }
  function isFunction(value) {
    return typeof value === "function";
  }
  // @__NO_SIDE_EFFECTS__
  function createSlot(ownerName) {
    const SlotClone = /* @__PURE__ */ createSlotClone(ownerName);
    const Slot2 = D((props, forwardedRef) => {
      const { children, ...slotProps } = props;
      const childrenArray = O$1.toArray(children);
      const slottable = childrenArray.find(isSlottable);
      if (slottable) {
        const newElement = slottable.props.children;
        const newChildren = childrenArray.map((child) => {
          if (child === slottable) {
            if (O$1.count(newElement) > 1) return O$1.only(null);
            return mn(newElement) ? newElement.props.children : null;
          } else {
            return child;
          }
        });
        return /* @__PURE__ */ u$5(SlotClone, { ...slotProps, ref: forwardedRef, children: mn(newElement) ? _n(newElement, void 0, newChildren) : null });
      }
      return /* @__PURE__ */ u$5(SlotClone, { ...slotProps, ref: forwardedRef, children });
    });
    Slot2.displayName = `${ownerName}.Slot`;
    return Slot2;
  }
  // @__NO_SIDE_EFFECTS__
  function createSlotClone(ownerName) {
    const SlotClone = D((props, forwardedRef) => {
      const { children, ...slotProps } = props;
      if (mn(children)) {
        const childrenRef = getElementRef$1(children);
        const props2 = mergeProps(slotProps, children.props);
        if (children.type !== k$3) {
          props2.ref = forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef;
        }
        return _n(children, props2);
      }
      return O$1.count(children) > 1 ? O$1.only(null) : null;
    });
    SlotClone.displayName = `${ownerName}.SlotClone`;
    return SlotClone;
  }
  var SLOTTABLE_IDENTIFIER = Symbol("radix.slottable");
  function isSlottable(child) {
    return mn(child) && typeof child.type === "function" && "__radixId" in child.type && child.type.__radixId === SLOTTABLE_IDENTIFIER;
  }
  function mergeProps(slotProps, childProps) {
    const overrideProps = { ...childProps };
    for (const propName in childProps) {
      const slotPropValue = slotProps[propName];
      const childPropValue = childProps[propName];
      const isHandler = /^on[A-Z]/.test(propName);
      if (isHandler) {
        if (slotPropValue && childPropValue) {
          overrideProps[propName] = (...args) => {
            const result = childPropValue(...args);
            slotPropValue(...args);
            return result;
          };
        } else if (slotPropValue) {
          overrideProps[propName] = slotPropValue;
        }
      } else if (propName === "style") {
        overrideProps[propName] = { ...slotPropValue, ...childPropValue };
      } else if (propName === "className") {
        overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
      }
    }
    return { ...slotProps, ...overrideProps };
  }
  function getElementRef$1(element2) {
    var _a, _b;
    let getter = (_a = Object.getOwnPropertyDescriptor(element2.props, "ref")) == null ? void 0 : _a.get;
    let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
    if (mayWarn) {
      return element2.ref;
    }
    getter = (_b = Object.getOwnPropertyDescriptor(element2, "ref")) == null ? void 0 : _b.get;
    mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
    if (mayWarn) {
      return element2.props.ref;
    }
    return element2.props.ref || element2.ref;
  }
  var NODES = [
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
    "select",
    "span",
    "svg",
    "ul"
  ];
  var Primitive = NODES.reduce((primitive, node2) => {
    const Slot2 = /* @__PURE__ */ createSlot(`Primitive.${node2}`);
    const Node2 = D((props, forwardedRef) => {
      const { asChild, ...primitiveProps } = props;
      const Comp = asChild ? Slot2 : node2;
      if (typeof window !== "undefined") {
        window[Symbol.for("radix-ui")] = true;
      }
      return /* @__PURE__ */ u$5(Comp, { ...primitiveProps, ref: forwardedRef });
    });
    Node2.displayName = `Primitive.${node2}`;
    return { ...primitive, [node2]: Node2 };
  }, {});
  function dispatchDiscreteCustomEvent(target, event) {
    if (target) En(() => target.dispatchEvent(event));
  }
  function useCallbackRef$1(callback) {
    const callbackRef = A$2(callback);
    y$1(() => {
      callbackRef.current = callback;
    });
    return T$3(() => (...args) => {
      var _a;
      return (_a = callbackRef.current) == null ? void 0 : _a.call(callbackRef, ...args);
    }, []);
  }
  function useEscapeKeydown(onEscapeKeyDownProp, ownerDocument = globalThis == null ? void 0 : globalThis.document) {
    const onEscapeKeyDown = useCallbackRef$1(onEscapeKeyDownProp);
    y$1(() => {
      const handleKeyDown = (event) => {
        if (event.key === "Escape") {
          onEscapeKeyDown(event);
        }
      };
      ownerDocument.addEventListener("keydown", handleKeyDown, { capture: true });
      return () => ownerDocument.removeEventListener("keydown", handleKeyDown, { capture: true });
    }, [onEscapeKeyDown, ownerDocument]);
  }
  var DISMISSABLE_LAYER_NAME = "DismissableLayer";
  var CONTEXT_UPDATE = "dismissableLayer.update";
  var POINTER_DOWN_OUTSIDE = "dismissableLayer.pointerDownOutside";
  var FOCUS_OUTSIDE = "dismissableLayer.focusOutside";
  var originalBodyPointerEvents;
  var DismissableLayerContext = Q$1({
    layers: /* @__PURE__ */ new Set(),
    layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
    branches: /* @__PURE__ */ new Set()
  });
  var DismissableLayer = D(
    (props, forwardedRef) => {
      const {
        disableOutsidePointerEvents = false,
        onEscapeKeyDown,
        onPointerDownOutside,
        onFocusOutside,
        onInteractOutside,
        onDismiss,
        ...layerProps
      } = props;
      const context = x$2(DismissableLayerContext);
      const [node2, setNode] = d$3(null);
      const ownerDocument = (node2 == null ? void 0 : node2.ownerDocument) ?? (globalThis == null ? void 0 : globalThis.document);
      const [, force] = d$3({});
      const composedRefs = useComposedRefs(forwardedRef, (node22) => setNode(node22));
      const layers = Array.from(context.layers);
      const [highestLayerWithOutsidePointerEventsDisabled] = [...context.layersWithOutsidePointerEventsDisabled].slice(-1);
      const highestLayerWithOutsidePointerEventsDisabledIndex = layers.indexOf(highestLayerWithOutsidePointerEventsDisabled);
      const index2 = node2 ? layers.indexOf(node2) : -1;
      const isBodyPointerEventsDisabled = context.layersWithOutsidePointerEventsDisabled.size > 0;
      const isPointerEventsEnabled = index2 >= highestLayerWithOutsidePointerEventsDisabledIndex;
      const pointerDownOutside = usePointerDownOutside((event) => {
        const target = event.target;
        const isPointerDownOnBranch = [...context.branches].some((branch) => branch.contains(target));
        if (!isPointerEventsEnabled || isPointerDownOnBranch) return;
        onPointerDownOutside == null ? void 0 : onPointerDownOutside(event);
        onInteractOutside == null ? void 0 : onInteractOutside(event);
        if (!event.defaultPrevented) onDismiss == null ? void 0 : onDismiss();
      }, ownerDocument);
      const focusOutside = useFocusOutside((event) => {
        const target = event.target;
        const isFocusInBranch = [...context.branches].some((branch) => branch.contains(target));
        if (isFocusInBranch) return;
        onFocusOutside == null ? void 0 : onFocusOutside(event);
        onInteractOutside == null ? void 0 : onInteractOutside(event);
        if (!event.defaultPrevented) onDismiss == null ? void 0 : onDismiss();
      }, ownerDocument);
      useEscapeKeydown((event) => {
        const isHighestLayer = index2 === context.layers.size - 1;
        if (!isHighestLayer) return;
        onEscapeKeyDown == null ? void 0 : onEscapeKeyDown(event);
        if (!event.defaultPrevented && onDismiss) {
          event.preventDefault();
          onDismiss();
        }
      }, ownerDocument);
      y$1(() => {
        if (!node2) return;
        if (disableOutsidePointerEvents) {
          if (context.layersWithOutsidePointerEventsDisabled.size === 0) {
            originalBodyPointerEvents = ownerDocument.body.style.pointerEvents;
            ownerDocument.body.style.pointerEvents = "none";
          }
          context.layersWithOutsidePointerEventsDisabled.add(node2);
        }
        context.layers.add(node2);
        dispatchUpdate();
        return () => {
          if (disableOutsidePointerEvents && context.layersWithOutsidePointerEventsDisabled.size === 1) {
            ownerDocument.body.style.pointerEvents = originalBodyPointerEvents;
          }
        };
      }, [node2, ownerDocument, disableOutsidePointerEvents, context]);
      y$1(() => {
        return () => {
          if (!node2) return;
          context.layers.delete(node2);
          context.layersWithOutsidePointerEventsDisabled.delete(node2);
          dispatchUpdate();
        };
      }, [node2, context]);
      y$1(() => {
        const handleUpdate = () => force({});
        document.addEventListener(CONTEXT_UPDATE, handleUpdate);
        return () => document.removeEventListener(CONTEXT_UPDATE, handleUpdate);
      }, []);
      return /* @__PURE__ */ u$5(
        Primitive.div,
        {
          ...layerProps,
          ref: composedRefs,
          style: {
            pointerEvents: isBodyPointerEventsDisabled ? isPointerEventsEnabled ? "auto" : "none" : void 0,
            ...props.style
          },
          onFocusCapture: composeEventHandlers(props.onFocusCapture, focusOutside.onFocusCapture),
          onBlurCapture: composeEventHandlers(props.onBlurCapture, focusOutside.onBlurCapture),
          onPointerDownCapture: composeEventHandlers(
            props.onPointerDownCapture,
            pointerDownOutside.onPointerDownCapture
          )
        }
      );
    }
  );
  DismissableLayer.displayName = DISMISSABLE_LAYER_NAME;
  var BRANCH_NAME = "DismissableLayerBranch";
  var DismissableLayerBranch = D((props, forwardedRef) => {
    const context = x$2(DismissableLayerContext);
    const ref = A$2(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    y$1(() => {
      const node2 = ref.current;
      if (node2) {
        context.branches.add(node2);
        return () => {
          context.branches.delete(node2);
        };
      }
    }, [context.branches]);
    return /* @__PURE__ */ u$5(Primitive.div, { ...props, ref: composedRefs });
  });
  DismissableLayerBranch.displayName = BRANCH_NAME;
  function usePointerDownOutside(onPointerDownOutside, ownerDocument = globalThis == null ? void 0 : globalThis.document) {
    const handlePointerDownOutside = useCallbackRef$1(onPointerDownOutside);
    const isPointerInsideReactTreeRef = A$2(false);
    const handleClickRef = A$2(() => {
    });
    y$1(() => {
      const handlePointerDown = (event) => {
        if (event.target && !isPointerInsideReactTreeRef.current) {
          let handleAndDispatchPointerDownOutsideEvent2 = function() {
            handleAndDispatchCustomEvent(
              POINTER_DOWN_OUTSIDE,
              handlePointerDownOutside,
              eventDetail,
              { discrete: true }
            );
          };
          const eventDetail = { originalEvent: event };
          if (event.pointerType === "touch") {
            ownerDocument.removeEventListener("click", handleClickRef.current);
            handleClickRef.current = handleAndDispatchPointerDownOutsideEvent2;
            ownerDocument.addEventListener("click", handleClickRef.current, { once: true });
          } else {
            handleAndDispatchPointerDownOutsideEvent2();
          }
        } else {
          ownerDocument.removeEventListener("click", handleClickRef.current);
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
    }, [ownerDocument, handlePointerDownOutside]);
    return {
      // ensures we check React component tree (not just DOM tree)
      onPointerDownCapture: () => isPointerInsideReactTreeRef.current = true
    };
  }
  function useFocusOutside(onFocusOutside, ownerDocument = globalThis == null ? void 0 : globalThis.document) {
    const handleFocusOutside = useCallbackRef$1(onFocusOutside);
    const isFocusInsideReactTreeRef = A$2(false);
    y$1(() => {
      const handleFocus = (event) => {
        if (event.target && !isFocusInsideReactTreeRef.current) {
          const eventDetail = { originalEvent: event };
          handleAndDispatchCustomEvent(FOCUS_OUTSIDE, handleFocusOutside, eventDetail, {
            discrete: false
          });
        }
      };
      ownerDocument.addEventListener("focusin", handleFocus);
      return () => ownerDocument.removeEventListener("focusin", handleFocus);
    }, [ownerDocument, handleFocusOutside]);
    return {
      onFocusCapture: () => isFocusInsideReactTreeRef.current = true,
      onBlurCapture: () => isFocusInsideReactTreeRef.current = false
    };
  }
  function dispatchUpdate() {
    const event = new CustomEvent(CONTEXT_UPDATE);
    document.dispatchEvent(event);
  }
  function handleAndDispatchCustomEvent(name, handler, detail, { discrete }) {
    const target = detail.originalEvent.target;
    const event = new CustomEvent(name, { bubbles: false, cancelable: true, detail });
    if (handler) target.addEventListener(name, handler, { once: true });
    if (discrete) {
      dispatchDiscreteCustomEvent(target, event);
    } else {
      target.dispatchEvent(event);
    }
  }
  var AUTOFOCUS_ON_MOUNT = "focusScope.autoFocusOnMount";
  var AUTOFOCUS_ON_UNMOUNT = "focusScope.autoFocusOnUnmount";
  var EVENT_OPTIONS = { bubbles: false, cancelable: true };
  var FOCUS_SCOPE_NAME = "FocusScope";
  var FocusScope = D((props, forwardedRef) => {
    const {
      loop = false,
      trapped = false,
      onMountAutoFocus: onMountAutoFocusProp,
      onUnmountAutoFocus: onUnmountAutoFocusProp,
      ...scopeProps
    } = props;
    const [container, setContainer] = d$3(null);
    const onMountAutoFocus = useCallbackRef$1(onMountAutoFocusProp);
    const onUnmountAutoFocus = useCallbackRef$1(onUnmountAutoFocusProp);
    const lastFocusedElementRef = A$2(null);
    const composedRefs = useComposedRefs(forwardedRef, (node2) => setContainer(node2));
    const focusScope = A$2({
      paused: false,
      pause() {
        this.paused = true;
      },
      resume() {
        this.paused = false;
      }
    }).current;
    y$1(() => {
      if (trapped) {
        let handleFocusIn2 = function(event) {
          if (focusScope.paused || !container) return;
          const target = event.target;
          if (container.contains(target)) {
            lastFocusedElementRef.current = target;
          } else {
            focus(lastFocusedElementRef.current, { select: true });
          }
        }, handleFocusOut2 = function(event) {
          if (focusScope.paused || !container) return;
          const relatedTarget = event.relatedTarget;
          if (relatedTarget === null) return;
          if (!container.contains(relatedTarget)) {
            focus(lastFocusedElementRef.current, { select: true });
          }
        }, handleMutations2 = function(mutations) {
          const focusedElement = document.activeElement;
          if (focusedElement !== document.body) return;
          for (const mutation of mutations) {
            if (mutation.removedNodes.length > 0) focus(container);
          }
        };
        document.addEventListener("focusin", handleFocusIn2);
        document.addEventListener("focusout", handleFocusOut2);
        const mutationObserver = new MutationObserver(handleMutations2);
        if (container) mutationObserver.observe(container, { childList: true, subtree: true });
        return () => {
          document.removeEventListener("focusin", handleFocusIn2);
          document.removeEventListener("focusout", handleFocusOut2);
          mutationObserver.disconnect();
        };
      }
    }, [trapped, container, focusScope.paused]);
    y$1(() => {
      if (container) {
        focusScopesStack.add(focusScope);
        const previouslyFocusedElement = document.activeElement;
        const hasFocusedCandidate = container.contains(previouslyFocusedElement);
        if (!hasFocusedCandidate) {
          const mountEvent = new CustomEvent(AUTOFOCUS_ON_MOUNT, EVENT_OPTIONS);
          container.addEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus);
          container.dispatchEvent(mountEvent);
          if (!mountEvent.defaultPrevented) {
            focusFirst(removeLinks(getTabbableCandidates(container)), { select: true });
            if (document.activeElement === previouslyFocusedElement) {
              focus(container);
            }
          }
        }
        return () => {
          container.removeEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus);
          setTimeout(() => {
            const unmountEvent = new CustomEvent(AUTOFOCUS_ON_UNMOUNT, EVENT_OPTIONS);
            container.addEventListener(AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);
            container.dispatchEvent(unmountEvent);
            if (!unmountEvent.defaultPrevented) {
              focus(previouslyFocusedElement ?? document.body, { select: true });
            }
            container.removeEventListener(AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);
            focusScopesStack.remove(focusScope);
          }, 0);
        };
      }
    }, [container, onMountAutoFocus, onUnmountAutoFocus, focusScope]);
    const handleKeyDown = q$1(
      (event) => {
        if (!loop && !trapped) return;
        if (focusScope.paused) return;
        const isTabKey = event.key === "Tab" && !event.altKey && !event.ctrlKey && !event.metaKey;
        const focusedElement = document.activeElement;
        if (isTabKey && focusedElement) {
          const container2 = event.currentTarget;
          const [first, last] = getTabbableEdges(container2);
          const hasTabbableElementsInside = first && last;
          if (!hasTabbableElementsInside) {
            if (focusedElement === container2) event.preventDefault();
          } else {
            if (!event.shiftKey && focusedElement === last) {
              event.preventDefault();
              if (loop) focus(first, { select: true });
            } else if (event.shiftKey && focusedElement === first) {
              event.preventDefault();
              if (loop) focus(last, { select: true });
            }
          }
        }
      },
      [loop, trapped, focusScope.paused]
    );
    return /* @__PURE__ */ u$5(Primitive.div, { tabIndex: -1, ...scopeProps, ref: composedRefs, onKeyDown: handleKeyDown });
  });
  FocusScope.displayName = FOCUS_SCOPE_NAME;
  function focusFirst(candidates, { select = false } = {}) {
    const previouslyFocusedElement = document.activeElement;
    for (const candidate of candidates) {
      focus(candidate, { select });
      if (document.activeElement !== previouslyFocusedElement) return;
    }
  }
  function getTabbableEdges(container) {
    const candidates = getTabbableCandidates(container);
    const first = findVisible(candidates, container);
    const last = findVisible(candidates.reverse(), container);
    return [first, last];
  }
  function getTabbableCandidates(container) {
    const nodes = [];
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (node2) => {
        const isHiddenInput = node2.tagName === "INPUT" && node2.type === "hidden";
        if (node2.disabled || node2.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP;
        return node2.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    while (walker.nextNode()) nodes.push(walker.currentNode);
    return nodes;
  }
  function findVisible(elements, container) {
    for (const element2 of elements) {
      if (!isHidden(element2, { upTo: container })) return element2;
    }
  }
  function isHidden(node2, { upTo }) {
    if (getComputedStyle(node2).visibility === "hidden") return true;
    while (node2) {
      if (upTo !== void 0 && node2 === upTo) return false;
      if (getComputedStyle(node2).display === "none") return true;
      node2 = node2.parentElement;
    }
    return false;
  }
  function isSelectableInput(element2) {
    return element2 instanceof HTMLInputElement && "select" in element2;
  }
  function focus(element2, { select = false } = {}) {
    if (element2 && element2.focus) {
      const previouslyFocusedElement = document.activeElement;
      element2.focus({ preventScroll: true });
      if (element2 !== previouslyFocusedElement && isSelectableInput(element2) && select)
        element2.select();
    }
  }
  var focusScopesStack = createFocusScopesStack();
  function createFocusScopesStack() {
    let stack = [];
    return {
      add(focusScope) {
        const activeFocusScope = stack[0];
        if (focusScope !== activeFocusScope) {
          activeFocusScope == null ? void 0 : activeFocusScope.pause();
        }
        stack = arrayRemove(stack, focusScope);
        stack.unshift(focusScope);
      },
      remove(focusScope) {
        var _a;
        stack = arrayRemove(stack, focusScope);
        (_a = stack[0]) == null ? void 0 : _a.resume();
      }
    };
  }
  function arrayRemove(array, item) {
    const updatedArray = [...array];
    const index2 = updatedArray.indexOf(item);
    if (index2 !== -1) {
      updatedArray.splice(index2, 1);
    }
    return updatedArray;
  }
  function removeLinks(items) {
    return items.filter((item) => item.tagName !== "A");
  }
  var PORTAL_NAME$2 = "Portal";
  var Portal$2 = D((props, forwardedRef) => {
    var _a;
    const { container: containerProp, ...portalProps } = props;
    const [mounted, setMounted] = d$3(false);
    useLayoutEffect2(() => setMounted(true), []);
    const container = containerProp || mounted && ((_a = globalThis == null ? void 0 : globalThis.document) == null ? void 0 : _a.body);
    return container ? Rn.createPortal(/* @__PURE__ */ u$5(Primitive.div, { ...portalProps, ref: forwardedRef }), container) : null;
  });
  Portal$2.displayName = PORTAL_NAME$2;
  function useStateMachine(initialState, machine) {
    return h$2((state, event) => {
      const nextState = machine[state][event];
      return nextState ?? state;
    }, initialState);
  }
  var Presence = (props) => {
    const { present, children } = props;
    const presence = usePresence(present);
    const child = typeof children === "function" ? children({ present: presence.isPresent }) : O$1.only(children);
    const ref = useComposedRefs(presence.ref, getElementRef(child));
    const forceMount = typeof children === "function";
    return forceMount || presence.isPresent ? _n(child, { ref }) : null;
  };
  Presence.displayName = "Presence";
  function usePresence(present) {
    const [node2, setNode] = d$3();
    const stylesRef = A$2(null);
    const prevPresentRef = A$2(present);
    const prevAnimationNameRef = A$2("none");
    const initialState = present ? "mounted" : "unmounted";
    const [state, send] = useStateMachine(initialState, {
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
    y$1(() => {
      const currentAnimationName = getAnimationName(stylesRef.current);
      prevAnimationNameRef.current = state === "mounted" ? currentAnimationName : "none";
    }, [state]);
    useLayoutEffect2(() => {
      const styles = stylesRef.current;
      const wasPresent = prevPresentRef.current;
      const hasPresentChanged = wasPresent !== present;
      if (hasPresentChanged) {
        const prevAnimationName = prevAnimationNameRef.current;
        const currentAnimationName = getAnimationName(styles);
        if (present) {
          send("MOUNT");
        } else if (currentAnimationName === "none" || (styles == null ? void 0 : styles.display) === "none") {
          send("UNMOUNT");
        } else {
          const isAnimating = prevAnimationName !== currentAnimationName;
          if (wasPresent && isAnimating) {
            send("ANIMATION_OUT");
          } else {
            send("UNMOUNT");
          }
        }
        prevPresentRef.current = present;
      }
    }, [present, send]);
    useLayoutEffect2(() => {
      if (node2) {
        let timeoutId;
        const ownerWindow = node2.ownerDocument.defaultView ?? window;
        const handleAnimationEnd = (event) => {
          const currentAnimationName = getAnimationName(stylesRef.current);
          const isCurrentAnimation = currentAnimationName.includes(CSS.escape(event.animationName));
          if (event.target === node2 && isCurrentAnimation) {
            send("ANIMATION_END");
            if (!prevPresentRef.current) {
              const currentFillMode = node2.style.animationFillMode;
              node2.style.animationFillMode = "forwards";
              timeoutId = ownerWindow.setTimeout(() => {
                if (node2.style.animationFillMode === "forwards") {
                  node2.style.animationFillMode = currentFillMode;
                }
              });
            }
          }
        };
        const handleAnimationStart = (event) => {
          if (event.target === node2) {
            prevAnimationNameRef.current = getAnimationName(stylesRef.current);
          }
        };
        node2.addEventListener("animationstart", handleAnimationStart);
        node2.addEventListener("animationcancel", handleAnimationEnd);
        node2.addEventListener("animationend", handleAnimationEnd);
        return () => {
          ownerWindow.clearTimeout(timeoutId);
          node2.removeEventListener("animationstart", handleAnimationStart);
          node2.removeEventListener("animationcancel", handleAnimationEnd);
          node2.removeEventListener("animationend", handleAnimationEnd);
        };
      } else {
        send("ANIMATION_END");
      }
    }, [node2, send]);
    return {
      isPresent: ["mounted", "unmountSuspended"].includes(state),
      ref: q$1((node22) => {
        stylesRef.current = node22 ? getComputedStyle(node22) : null;
        setNode(node22);
      }, [])
    };
  }
  function getAnimationName(styles) {
    return (styles == null ? void 0 : styles.animationName) || "none";
  }
  function getElementRef(element2) {
    var _a, _b;
    let getter = (_a = Object.getOwnPropertyDescriptor(element2.props, "ref")) == null ? void 0 : _a.get;
    let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
    if (mayWarn) {
      return element2.ref;
    }
    getter = (_b = Object.getOwnPropertyDescriptor(element2, "ref")) == null ? void 0 : _b.get;
    mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
    if (mayWarn) {
      return element2.props.ref;
    }
    return element2.props.ref || element2.ref;
  }
  var count = 0;
  function useFocusGuards() {
    y$1(() => {
      const edgeGuards = document.querySelectorAll("[data-radix-focus-guard]");
      document.body.insertAdjacentElement("afterbegin", edgeGuards[0] ?? createFocusGuard());
      document.body.insertAdjacentElement("beforeend", edgeGuards[1] ?? createFocusGuard());
      count++;
      return () => {
        if (count === 1) {
          document.querySelectorAll("[data-radix-focus-guard]").forEach((node2) => node2.remove());
        }
        count--;
      };
    }, []);
  }
  function createFocusGuard() {
    const element2 = document.createElement("span");
    element2.setAttribute("data-radix-focus-guard", "");
    element2.tabIndex = 0;
    element2.style.outline = "none";
    element2.style.opacity = "0";
    element2.style.position = "fixed";
    element2.style.pointerEvents = "none";
    return element2;
  }
  var __assign = function() {
    __assign = Object.assign || function __assign2(t2) {
      for (var s2, i2 = 1, n2 = arguments.length; i2 < n2; i2++) {
        s2 = arguments[i2];
        for (var p2 in s2) if (Object.prototype.hasOwnProperty.call(s2, p2)) t2[p2] = s2[p2];
      }
      return t2;
    };
    return __assign.apply(this, arguments);
  };
  function __rest(s2, e2) {
    var t2 = {};
    for (var p2 in s2) if (Object.prototype.hasOwnProperty.call(s2, p2) && e2.indexOf(p2) < 0)
      t2[p2] = s2[p2];
    if (s2 != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i2 = 0, p2 = Object.getOwnPropertySymbols(s2); i2 < p2.length; i2++) {
        if (e2.indexOf(p2[i2]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p2[i2]))
          t2[p2[i2]] = s2[p2[i2]];
      }
    return t2;
  }
  function __spreadArray(to, from, pack) {
    for (var i2 = 0, l2 = from.length, ar; i2 < l2; i2++) {
      if (ar || !(i2 in from)) {
        if (!ar) ar = Array.prototype.slice.call(from, 0, i2);
        ar[i2] = from[i2];
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  }
  typeof SuppressedError === "function" ? SuppressedError : function(error2, suppressed, message) {
    var e2 = new Error(message);
    return e2.name = "SuppressedError", e2.error = error2, e2.suppressed = suppressed, e2;
  };
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
    var ref = d$3(function() {
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
  var useIsomorphicLayoutEffect = typeof window !== "undefined" ? _ : y$1;
  var currentValues = /* @__PURE__ */ new WeakMap();
  function useMergeRefs(refs, defaultValue) {
    var callbackRef = useCallbackRef(null, function(newValue) {
      return refs.forEach(function(ref) {
        return assignRef(ref, newValue);
      });
    });
    useIsomorphicLayoutEffect(function() {
      var oldValue = currentValues.get(callbackRef);
      if (oldValue) {
        var prevRefs_1 = new Set(oldValue);
        var nextRefs_1 = new Set(refs);
        var current_1 = callbackRef.current;
        prevRefs_1.forEach(function(ref) {
          if (!nextRefs_1.has(ref)) {
            assignRef(ref, null);
          }
        });
        nextRefs_1.forEach(function(ref) {
          if (!prevRefs_1.has(ref)) {
            assignRef(ref, current_1);
          }
        });
      }
      currentValues.set(callbackRef, refs);
    }, [refs]);
    return callbackRef;
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
  function createSidecarMedium(options) {
    if (options === void 0) {
      options = {};
    }
    var medium = innerCreateMedium(null);
    medium.options = __assign({ async: true, ssr: false }, options);
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
    return _$1(Target, __assign({}, rest));
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
  var RemoveScroll = D(function(props, parentRef) {
    var ref = A$2(null);
    var _a = d$3({
      onScrollCapture: nothing,
      onWheelCapture: nothing,
      onTouchMoveCapture: nothing
    }), callbacks = _a[0], setCallbacks = _a[1];
    var forwardProps = props.forwardProps, children = props.children, className = props.className, removeScrollBar = props.removeScrollBar, enabled = props.enabled, shards = props.shards, sideCar = props.sideCar, noRelative = props.noRelative, noIsolation = props.noIsolation, inert = props.inert, allowPinchZoom = props.allowPinchZoom, _b = props.as, Container = _b === void 0 ? "div" : _b, gapMode = props.gapMode, rest = __rest(props, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noRelative", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"]);
    var SideCar2 = sideCar;
    var containerRef = useMergeRefs([ref, parentRef]);
    var containerProps = __assign(__assign({}, rest), callbacks);
    return _$1(
      k$3,
      null,
      enabled && _$1(SideCar2, { sideCar: effectCar, removeScrollBar, shards, noRelative, noIsolation, inert, setCallbacks, allowPinchZoom: !!allowPinchZoom, lockRef: ref, gapMode }),
      forwardProps ? _n(O$1.only(children), __assign(__assign({}, containerProps), { ref: containerRef })) : _$1(Container, __assign({}, containerProps, { className, ref: containerRef }), children)
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
      add: function(style) {
        if (counter == 0) {
          if (stylesheet = makeStyleTag()) {
            injectStyles(stylesheet, style);
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
      y$1(function() {
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
  var parse$1 = function(x2) {
    return parseInt(x2 || "", 10) || 0;
  };
  var getOffset = function(gapMode) {
    var cs = window.getComputedStyle(document.body);
    var left = cs[gapMode === "padding" ? "paddingLeft" : "marginLeft"];
    var top = cs[gapMode === "padding" ? "paddingTop" : "marginTop"];
    var right = cs[gapMode === "padding" ? "paddingRight" : "marginRight"];
    return [parse$1(left), parse$1(top), parse$1(right)];
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
  var lockAttribute = "data-scroll-locked";
  var getStyles = function(_a, allowRelative, gapMode, important) {
    var left = _a.left, top = _a.top, right = _a.right, gap = _a.gap;
    if (gapMode === void 0) {
      gapMode = "margin";
    }
    return "\n  .".concat(noScrollbarsClassName, " {\n   overflow: hidden ").concat(important, ";\n   padding-right: ").concat(gap, "px ").concat(important, ";\n  }\n  body[").concat(lockAttribute, "] {\n    overflow: hidden ").concat(important, ";\n    overscroll-behavior: contain;\n    ").concat([
      allowRelative && "position: relative ".concat(important, ";"),
      gapMode === "margin" && "\n    padding-left: ".concat(left, "px;\n    padding-top: ").concat(top, "px;\n    padding-right: ").concat(right, "px;\n    margin-left:0;\n    margin-top:0;\n    margin-right: ").concat(gap, "px ").concat(important, ";\n    "),
      gapMode === "padding" && "padding-right: ".concat(gap, "px ").concat(important, ";")
    ].filter(Boolean).join(""), "\n  }\n  \n  .").concat(zeroRightClassName, " {\n    right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(fullWidthClassName, " {\n    margin-right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(zeroRightClassName, " .").concat(zeroRightClassName, " {\n    right: 0 ").concat(important, ";\n  }\n  \n  .").concat(fullWidthClassName, " .").concat(fullWidthClassName, " {\n    margin-right: 0 ").concat(important, ";\n  }\n  \n  body[").concat(lockAttribute, "] {\n    ").concat(removedBarSizeVariable, ": ").concat(gap, "px;\n  }\n");
  };
  var getCurrentUseCounter = function() {
    var counter = parseInt(document.body.getAttribute(lockAttribute) || "0", 10);
    return isFinite(counter) ? counter : 0;
  };
  var useLockAttribute = function() {
    y$1(function() {
      document.body.setAttribute(lockAttribute, (getCurrentUseCounter() + 1).toString());
      return function() {
        var newCounter = getCurrentUseCounter() - 1;
        if (newCounter <= 0) {
          document.body.removeAttribute(lockAttribute);
        } else {
          document.body.setAttribute(lockAttribute, newCounter.toString());
        }
      };
    }, []);
  };
  var RemoveScrollBar = function(_a) {
    var noRelative = _a.noRelative, noImportant = _a.noImportant, _b = _a.gapMode, gapMode = _b === void 0 ? "margin" : _b;
    useLockAttribute();
    var gap = T$3(function() {
      return getGapWidth(gapMode);
    }, [gapMode]);
    return _$1(Style, { styles: getStyles(gap, !noRelative, gapMode, !noImportant ? "!important" : "") });
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
    if (!(node2 instanceof Element)) {
      return false;
    }
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
    var ownerDocument = node2.ownerDocument;
    var current = node2;
    do {
      if (typeof ShadowRoot !== "undefined" && current instanceof ShadowRoot) {
        current = current.host;
      }
      var isScrollable = elementCouldBeScrolled(axis, current);
      if (isScrollable) {
        var _a = getScrollVariables(axis, current), scrollHeight = _a[1], clientHeight = _a[2];
        if (scrollHeight > clientHeight) {
          return true;
        }
      }
      current = current.parentNode;
    } while (current && current !== ownerDocument.body);
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
      if (!target) {
        break;
      }
      var _a = getScrollVariables(axis, target), position2 = _a[0], scroll_1 = _a[1], capacity = _a[2];
      var elementScroll = scroll_1 - capacity - directionFactor * position2;
      if (position2 || elementScroll) {
        if (elementCouldBeScrolled(axis, target)) {
          availableScroll += elementScroll;
          availableScrollTop += position2;
        }
      }
      var parent_1 = target.parentNode;
      target = parent_1 && parent_1.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? parent_1.host : parent_1;
    } while (
      // portaled content
      !targetInLock && target !== document.body || // self content
      targetInLock && (endTarget.contains(target) || endTarget === target)
    );
    if (isDeltaPositive && (Math.abs(availableScroll) < 1 || false)) {
      shouldCancelScroll = true;
    } else if (!isDeltaPositive && (Math.abs(availableScrollTop) < 1 || false)) {
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
    var shouldPreventQueue = A$2([]);
    var touchStartRef = A$2([0, 0]);
    var activeAxis = A$2();
    var id = d$3(idCounter++)[0];
    var Style2 = d$3(styleSingleton)[0];
    var lastProps = A$2(props);
    y$1(function() {
      lastProps.current = props;
    }, [props]);
    y$1(function() {
      if (props.inert) {
        document.body.classList.add("block-interactivity-".concat(id));
        var allow_1 = __spreadArray([props.lockRef.current], (props.shards || []).map(extractRef)).filter(Boolean);
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
    var shouldCancelEvent = q$1(function(event, parent) {
      if ("touches" in event && event.touches.length === 2 || event.type === "wheel" && event.ctrlKey) {
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
      return handleScroll(cancelingAxis, parent, event, cancelingAxis === "h" ? deltaX : deltaY);
    }, []);
    var shouldPrevent = q$1(function(_event) {
      var event = _event;
      if (!lockStack.length || lockStack[lockStack.length - 1] !== Style2) {
        return;
      }
      var delta = "deltaY" in event ? getDeltaXY(event) : getTouchXY(event);
      var sourceEvent = shouldPreventQueue.current.filter(function(e2) {
        return e2.name === event.type && (e2.target === event.target || event.target === e2.shadowParent) && deltaCompare(e2.delta, delta);
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
    var shouldCancel = q$1(function(name, delta, target, should) {
      var event = { name, delta, target, should, shadowParent: getOutermostShadowParent(target) };
      shouldPreventQueue.current.push(event);
      setTimeout(function() {
        shouldPreventQueue.current = shouldPreventQueue.current.filter(function(e2) {
          return e2 !== event;
        });
      }, 1);
    }, []);
    var scrollTouchStart = q$1(function(event) {
      touchStartRef.current = getTouchXY(event);
      activeAxis.current = void 0;
    }, []);
    var scrollWheel = q$1(function(event) {
      shouldCancel(event.type, getDeltaXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
    }, []);
    var scrollTouchMove = q$1(function(event) {
      shouldCancel(event.type, getTouchXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
    }, []);
    y$1(function() {
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
    return _$1(
      k$3,
      null,
      inert ? _$1(Style2, { styles: generateStyle(id) }) : null,
      removeScrollBar ? _$1(RemoveScrollBar, { noRelative: props.noRelative, gapMode: props.gapMode }) : null
    );
  }
  function getOutermostShadowParent(node2) {
    var shadowParent = null;
    while (node2 !== null) {
      if (node2 instanceof ShadowRoot) {
        shadowParent = node2.host;
        node2 = node2.host;
      }
      node2 = node2.parentNode;
    }
    return shadowParent;
  }
  const SideCar = exportSidecar(effectCar, RemoveScrollSideCar);
  var ReactRemoveScroll = D(function(props, ref) {
    return _$1(RemoveScroll, __assign({}, props, { ref, sideCar: SideCar }));
  });
  ReactRemoveScroll.classNames = RemoveScroll.classNames;
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
          try {
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
          } catch (e2) {
            console.error("aria-hidden: cannot operate on ", node2, e2);
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
    var activeParentNode = getDefaultParent(originalTarget);
    if (!activeParentNode) {
      return function() {
        return null;
      };
    }
    targets.push.apply(targets, Array.from(activeParentNode.querySelectorAll("[aria-live], script")));
    return applyAttributeToOthers(targets, activeParentNode, markerName, "aria-hidden");
  };
  var DIALOG_NAME = "Dialog";
  var [createDialogContext] = createContextScope(DIALOG_NAME);
  var [DialogProvider, useDialogContext] = createDialogContext(DIALOG_NAME);
  var Dialog = (props) => {
    const {
      __scopeDialog,
      children,
      open: openProp,
      defaultOpen,
      onOpenChange,
      modal = true
    } = props;
    const triggerRef = A$2(null);
    const contentRef = A$2(null);
    const [open, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen ?? false,
      onChange: onOpenChange,
      caller: DIALOG_NAME
    });
    return /* @__PURE__ */ u$5(
      DialogProvider,
      {
        scope: __scopeDialog,
        triggerRef,
        contentRef,
        contentId: useId(),
        titleId: useId(),
        descriptionId: useId(),
        open,
        onOpenChange: setOpen,
        onOpenToggle: q$1(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
        modal,
        children
      }
    );
  };
  Dialog.displayName = DIALOG_NAME;
  var TRIGGER_NAME$1 = "DialogTrigger";
  var DialogTrigger = D(
    (props, forwardedRef) => {
      const { __scopeDialog, ...triggerProps } = props;
      const context = useDialogContext(TRIGGER_NAME$1, __scopeDialog);
      const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);
      return /* @__PURE__ */ u$5(
        Primitive.button,
        {
          type: "button",
          "aria-haspopup": "dialog",
          "aria-expanded": context.open,
          "aria-controls": context.contentId,
          "data-state": getState(context.open),
          ...triggerProps,
          ref: composedTriggerRef,
          onClick: composeEventHandlers(props.onClick, context.onOpenToggle)
        }
      );
    }
  );
  DialogTrigger.displayName = TRIGGER_NAME$1;
  var PORTAL_NAME$1 = "DialogPortal";
  var [PortalProvider$1, usePortalContext$1] = createDialogContext(PORTAL_NAME$1, {
    forceMount: void 0
  });
  var DialogPortal = (props) => {
    const { __scopeDialog, forceMount, children, container } = props;
    const context = useDialogContext(PORTAL_NAME$1, __scopeDialog);
    return /* @__PURE__ */ u$5(PortalProvider$1, { scope: __scopeDialog, forceMount, children: O$1.map(children, (child) => /* @__PURE__ */ u$5(Presence, { present: forceMount || context.open, children: /* @__PURE__ */ u$5(Portal$2, { asChild: true, container, children: child }) })) });
  };
  DialogPortal.displayName = PORTAL_NAME$1;
  var OVERLAY_NAME = "DialogOverlay";
  var DialogOverlay = D(
    (props, forwardedRef) => {
      const portalContext = usePortalContext$1(OVERLAY_NAME, props.__scopeDialog);
      const { forceMount = portalContext.forceMount, ...overlayProps } = props;
      const context = useDialogContext(OVERLAY_NAME, props.__scopeDialog);
      return context.modal ? /* @__PURE__ */ u$5(Presence, { present: forceMount || context.open, children: /* @__PURE__ */ u$5(DialogOverlayImpl, { ...overlayProps, ref: forwardedRef }) }) : null;
    }
  );
  DialogOverlay.displayName = OVERLAY_NAME;
  var Slot = /* @__PURE__ */ createSlot("DialogOverlay.RemoveScroll");
  var DialogOverlayImpl = D(
    (props, forwardedRef) => {
      const { __scopeDialog, ...overlayProps } = props;
      const context = useDialogContext(OVERLAY_NAME, __scopeDialog);
      return (
        // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
        // ie. when `Overlay` and `Content` are siblings
        /* @__PURE__ */ u$5(ReactRemoveScroll, { as: Slot, allowPinchZoom: true, shards: [context.contentRef], children: /* @__PURE__ */ u$5(
          Primitive.div,
          {
            "data-state": getState(context.open),
            ...overlayProps,
            ref: forwardedRef,
            style: { pointerEvents: "auto", ...overlayProps.style }
          }
        ) })
      );
    }
  );
  var CONTENT_NAME$2 = "DialogContent";
  var DialogContent$1 = D(
    (props, forwardedRef) => {
      const portalContext = usePortalContext$1(CONTENT_NAME$2, props.__scopeDialog);
      const { forceMount = portalContext.forceMount, ...contentProps } = props;
      const context = useDialogContext(CONTENT_NAME$2, props.__scopeDialog);
      return /* @__PURE__ */ u$5(Presence, { present: forceMount || context.open, children: context.modal ? /* @__PURE__ */ u$5(DialogContentModal, { ...contentProps, ref: forwardedRef }) : /* @__PURE__ */ u$5(DialogContentNonModal, { ...contentProps, ref: forwardedRef }) });
    }
  );
  DialogContent$1.displayName = CONTENT_NAME$2;
  var DialogContentModal = D(
    (props, forwardedRef) => {
      const context = useDialogContext(CONTENT_NAME$2, props.__scopeDialog);
      const contentRef = A$2(null);
      const composedRefs = useComposedRefs(forwardedRef, context.contentRef, contentRef);
      y$1(() => {
        const content2 = contentRef.current;
        if (content2) return hideOthers(content2);
      }, []);
      return /* @__PURE__ */ u$5(
        DialogContentImpl,
        {
          ...props,
          ref: composedRefs,
          trapFocus: context.open,
          disableOutsidePointerEvents: true,
          onCloseAutoFocus: composeEventHandlers(props.onCloseAutoFocus, (event) => {
            var _a;
            event.preventDefault();
            (_a = context.triggerRef.current) == null ? void 0 : _a.focus();
          }),
          onPointerDownOutside: composeEventHandlers(props.onPointerDownOutside, (event) => {
            const originalEvent = event.detail.originalEvent;
            const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
            const isRightClick = originalEvent.button === 2 || ctrlLeftClick;
            if (isRightClick) event.preventDefault();
          }),
          onFocusOutside: composeEventHandlers(
            props.onFocusOutside,
            (event) => event.preventDefault()
          )
        }
      );
    }
  );
  var DialogContentNonModal = D(
    (props, forwardedRef) => {
      const context = useDialogContext(CONTENT_NAME$2, props.__scopeDialog);
      const hasInteractedOutsideRef = A$2(false);
      const hasPointerDownOutsideRef = A$2(false);
      return /* @__PURE__ */ u$5(
        DialogContentImpl,
        {
          ...props,
          ref: forwardedRef,
          trapFocus: false,
          disableOutsidePointerEvents: false,
          onCloseAutoFocus: (event) => {
            var _a, _b;
            (_a = props.onCloseAutoFocus) == null ? void 0 : _a.call(props, event);
            if (!event.defaultPrevented) {
              if (!hasInteractedOutsideRef.current) (_b = context.triggerRef.current) == null ? void 0 : _b.focus();
              event.preventDefault();
            }
            hasInteractedOutsideRef.current = false;
            hasPointerDownOutsideRef.current = false;
          },
          onInteractOutside: (event) => {
            var _a, _b;
            (_a = props.onInteractOutside) == null ? void 0 : _a.call(props, event);
            if (!event.defaultPrevented) {
              hasInteractedOutsideRef.current = true;
              if (event.detail.originalEvent.type === "pointerdown") {
                hasPointerDownOutsideRef.current = true;
              }
            }
            const target = event.target;
            const targetIsTrigger = (_b = context.triggerRef.current) == null ? void 0 : _b.contains(target);
            if (targetIsTrigger) event.preventDefault();
            if (event.detail.originalEvent.type === "focusin" && hasPointerDownOutsideRef.current) {
              event.preventDefault();
            }
          }
        }
      );
    }
  );
  var DialogContentImpl = D(
    (props, forwardedRef) => {
      const { __scopeDialog, trapFocus, onOpenAutoFocus, onCloseAutoFocus, ...contentProps } = props;
      const context = useDialogContext(CONTENT_NAME$2, __scopeDialog);
      const contentRef = A$2(null);
      const composedRefs = useComposedRefs(forwardedRef, contentRef);
      useFocusGuards();
      return /* @__PURE__ */ u$5(k$3, { children: [
        /* @__PURE__ */ u$5(
          FocusScope,
          {
            asChild: true,
            loop: true,
            trapped: trapFocus,
            onMountAutoFocus: onOpenAutoFocus,
            onUnmountAutoFocus: onCloseAutoFocus,
            children: /* @__PURE__ */ u$5(
              DismissableLayer,
              {
                role: "dialog",
                id: context.contentId,
                "aria-describedby": context.descriptionId,
                "aria-labelledby": context.titleId,
                "data-state": getState(context.open),
                ...contentProps,
                ref: composedRefs,
                onDismiss: () => context.onOpenChange(false)
              }
            )
          }
        ),
        /* @__PURE__ */ u$5(k$3, { children: [
          /* @__PURE__ */ u$5(TitleWarning, { titleId: context.titleId }),
          /* @__PURE__ */ u$5(DescriptionWarning, { contentRef, descriptionId: context.descriptionId })
        ] })
      ] });
    }
  );
  var TITLE_NAME = "DialogTitle";
  var DialogTitle = D(
    (props, forwardedRef) => {
      const { __scopeDialog, ...titleProps } = props;
      const context = useDialogContext(TITLE_NAME, __scopeDialog);
      return /* @__PURE__ */ u$5(Primitive.h2, { id: context.titleId, ...titleProps, ref: forwardedRef });
    }
  );
  DialogTitle.displayName = TITLE_NAME;
  var DESCRIPTION_NAME = "DialogDescription";
  var DialogDescription = D(
    (props, forwardedRef) => {
      const { __scopeDialog, ...descriptionProps } = props;
      const context = useDialogContext(DESCRIPTION_NAME, __scopeDialog);
      return /* @__PURE__ */ u$5(Primitive.p, { id: context.descriptionId, ...descriptionProps, ref: forwardedRef });
    }
  );
  DialogDescription.displayName = DESCRIPTION_NAME;
  var CLOSE_NAME = "DialogClose";
  var DialogClose = D(
    (props, forwardedRef) => {
      const { __scopeDialog, ...closeProps } = props;
      const context = useDialogContext(CLOSE_NAME, __scopeDialog);
      return /* @__PURE__ */ u$5(
        Primitive.button,
        {
          type: "button",
          ...closeProps,
          ref: forwardedRef,
          onClick: composeEventHandlers(props.onClick, () => context.onOpenChange(false))
        }
      );
    }
  );
  DialogClose.displayName = CLOSE_NAME;
  function getState(open) {
    return open ? "open" : "closed";
  }
  var TITLE_WARNING_NAME = "DialogTitleWarning";
  var [WarningProvider, useWarningContext] = createContext2(TITLE_WARNING_NAME, {
    contentName: CONTENT_NAME$2,
    titleName: TITLE_NAME,
    docsSlug: "dialog"
  });
  var TitleWarning = ({ titleId }) => {
    const titleWarningContext = useWarningContext(TITLE_WARNING_NAME);
    const MESSAGE = `\`${titleWarningContext.contentName}\` requires a \`${titleWarningContext.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${titleWarningContext.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${titleWarningContext.docsSlug}`;
    y$1(() => {
      if (titleId) {
        const hasTitle = document.getElementById(titleId);
        if (!hasTitle) console.error(MESSAGE);
      }
    }, [MESSAGE, titleId]);
    return null;
  };
  var DESCRIPTION_WARNING_NAME = "DialogDescriptionWarning";
  var DescriptionWarning = ({ contentRef, descriptionId }) => {
    const descriptionWarningContext = useWarningContext(DESCRIPTION_WARNING_NAME);
    const MESSAGE = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${descriptionWarningContext.contentName}}.`;
    y$1(() => {
      var _a;
      const describedById = (_a = contentRef.current) == null ? void 0 : _a.getAttribute("aria-describedby");
      if (descriptionId && describedById) {
        const hasDescription = document.getElementById(descriptionId);
        if (!hasDescription) console.warn(MESSAGE);
      }
    }, [MESSAGE, contentRef, descriptionId]);
    return null;
  };
  var Root$1 = Dialog;
  var Trigger$1 = DialogTrigger;
  var Portal$1 = DialogPortal;
  var Overlay = DialogOverlay;
  var Content$1 = DialogContent$1;
  var Title = DialogTitle;
  var Close = DialogClose;
  const sides = ["top", "right", "bottom", "left"];
  const min = Math.min;
  const max = Math.max;
  const round = Math.round;
  const floor = Math.floor;
  const createCoords = (v2) => ({
    x: v2,
    y: v2
  });
  const oppositeSideMap = {
    left: "right",
    right: "left",
    bottom: "top",
    top: "bottom"
  };
  const oppositeAlignmentMap = {
    start: "end",
    end: "start"
  };
  function clamp(start, value, end) {
    return max(start, min(value, end));
  }
  function evaluate(value, param) {
    return typeof value === "function" ? value(param) : value;
  }
  function getSide(placement) {
    return placement.split("-")[0];
  }
  function getAlignment(placement) {
    return placement.split("-")[1];
  }
  function getOppositeAxis(axis) {
    return axis === "x" ? "y" : "x";
  }
  function getAxisLength(axis) {
    return axis === "y" ? "height" : "width";
  }
  const yAxisSides = /* @__PURE__ */ new Set(["top", "bottom"]);
  function getSideAxis(placement) {
    return yAxisSides.has(getSide(placement)) ? "y" : "x";
  }
  function getAlignmentAxis(placement) {
    return getOppositeAxis(getSideAxis(placement));
  }
  function getAlignmentSides(placement, rects, rtl) {
    if (rtl === void 0) {
      rtl = false;
    }
    const alignment = getAlignment(placement);
    const alignmentAxis = getAlignmentAxis(placement);
    const length = getAxisLength(alignmentAxis);
    let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
    if (rects.reference[length] > rects.floating[length]) {
      mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
    }
    return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
  }
  function getExpandedPlacements(placement) {
    const oppositePlacement = getOppositePlacement(placement);
    return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
  }
  function getOppositeAlignmentPlacement(placement) {
    return placement.replace(/start|end/g, (alignment) => oppositeAlignmentMap[alignment]);
  }
  const lrPlacement = ["left", "right"];
  const rlPlacement = ["right", "left"];
  const tbPlacement = ["top", "bottom"];
  const btPlacement = ["bottom", "top"];
  function getSideList(side, isStart, rtl) {
    switch (side) {
      case "top":
      case "bottom":
        if (rtl) return isStart ? rlPlacement : lrPlacement;
        return isStart ? lrPlacement : rlPlacement;
      case "left":
      case "right":
        return isStart ? tbPlacement : btPlacement;
      default:
        return [];
    }
  }
  function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
    const alignment = getAlignment(placement);
    let list2 = getSideList(getSide(placement), direction === "start", rtl);
    if (alignment) {
      list2 = list2.map((side) => side + "-" + alignment);
      if (flipAlignment) {
        list2 = list2.concat(list2.map(getOppositeAlignmentPlacement));
      }
    }
    return list2;
  }
  function getOppositePlacement(placement) {
    return placement.replace(/left|right|bottom|top/g, (side) => oppositeSideMap[side]);
  }
  function expandPaddingObject(padding) {
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...padding
    };
  }
  function getPaddingObject(padding) {
    return typeof padding !== "number" ? expandPaddingObject(padding) : {
      top: padding,
      right: padding,
      bottom: padding,
      left: padding
    };
  }
  function rectToClientRect(rect) {
    const {
      x: x2,
      y: y2,
      width,
      height
    } = rect;
    return {
      width,
      height,
      top: y2,
      left: x2,
      right: x2 + width,
      bottom: y2 + height,
      x: x2,
      y: y2
    };
  }
  function computeCoordsFromPlacement(_ref, placement, rtl) {
    let {
      reference,
      floating
    } = _ref;
    const sideAxis = getSideAxis(placement);
    const alignmentAxis = getAlignmentAxis(placement);
    const alignLength = getAxisLength(alignmentAxis);
    const side = getSide(placement);
    const isVertical = sideAxis === "y";
    const commonX = reference.x + reference.width / 2 - floating.width / 2;
    const commonY = reference.y + reference.height / 2 - floating.height / 2;
    const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
    let coords;
    switch (side) {
      case "top":
        coords = {
          x: commonX,
          y: reference.y - floating.height
        };
        break;
      case "bottom":
        coords = {
          x: commonX,
          y: reference.y + reference.height
        };
        break;
      case "right":
        coords = {
          x: reference.x + reference.width,
          y: commonY
        };
        break;
      case "left":
        coords = {
          x: reference.x - floating.width,
          y: commonY
        };
        break;
      default:
        coords = {
          x: reference.x,
          y: reference.y
        };
    }
    switch (getAlignment(placement)) {
      case "start":
        coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
        break;
      case "end":
        coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
        break;
    }
    return coords;
  }
  const computePosition$1 = async (reference, floating, config) => {
    const {
      placement = "bottom",
      strategy = "absolute",
      middleware = [],
      platform: platform2
    } = config;
    const validMiddleware = middleware.filter(Boolean);
    const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(floating));
    let rects = await platform2.getElementRects({
      reference,
      floating,
      strategy
    });
    let {
      x: x2,
      y: y2
    } = computeCoordsFromPlacement(rects, placement, rtl);
    let statefulPlacement = placement;
    let middlewareData = {};
    let resetCount = 0;
    for (let i2 = 0; i2 < validMiddleware.length; i2++) {
      const {
        name,
        fn: fn2
      } = validMiddleware[i2];
      const {
        x: nextX,
        y: nextY,
        data,
        reset
      } = await fn2({
        x: x2,
        y: y2,
        initialPlacement: placement,
        placement: statefulPlacement,
        strategy,
        middlewareData,
        rects,
        platform: platform2,
        elements: {
          reference,
          floating
        }
      });
      x2 = nextX != null ? nextX : x2;
      y2 = nextY != null ? nextY : y2;
      middlewareData = {
        ...middlewareData,
        [name]: {
          ...middlewareData[name],
          ...data
        }
      };
      if (reset && resetCount <= 50) {
        resetCount++;
        if (typeof reset === "object") {
          if (reset.placement) {
            statefulPlacement = reset.placement;
          }
          if (reset.rects) {
            rects = reset.rects === true ? await platform2.getElementRects({
              reference,
              floating,
              strategy
            }) : reset.rects;
          }
          ({
            x: x2,
            y: y2
          } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
        }
        i2 = -1;
      }
    }
    return {
      x: x2,
      y: y2,
      placement: statefulPlacement,
      strategy,
      middlewareData
    };
  };
  async function detectOverflow(state, options) {
    var _await$platform$isEle;
    if (options === void 0) {
      options = {};
    }
    const {
      x: x2,
      y: y2,
      platform: platform2,
      rects,
      elements,
      strategy
    } = state;
    const {
      boundary = "clippingAncestors",
      rootBoundary = "viewport",
      elementContext = "floating",
      altBoundary = false,
      padding = 0
    } = evaluate(options, state);
    const paddingObject = getPaddingObject(padding);
    const altContext = elementContext === "floating" ? "reference" : "floating";
    const element2 = elements[altBoundary ? altContext : elementContext];
    const clippingClientRect = rectToClientRect(await platform2.getClippingRect({
      element: ((_await$platform$isEle = await (platform2.isElement == null ? void 0 : platform2.isElement(element2))) != null ? _await$platform$isEle : true) ? element2 : element2.contextElement || await (platform2.getDocumentElement == null ? void 0 : platform2.getDocumentElement(elements.floating)),
      boundary,
      rootBoundary,
      strategy
    }));
    const rect = elementContext === "floating" ? {
      x: x2,
      y: y2,
      width: rects.floating.width,
      height: rects.floating.height
    } : rects.reference;
    const offsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(elements.floating));
    const offsetScale = await (platform2.isElement == null ? void 0 : platform2.isElement(offsetParent)) ? await (platform2.getScale == null ? void 0 : platform2.getScale(offsetParent)) || {
      x: 1,
      y: 1
    } : {
      x: 1,
      y: 1
    };
    const elementClientRect = rectToClientRect(platform2.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform2.convertOffsetParentRelativeRectToViewportRelativeRect({
      elements,
      rect,
      offsetParent,
      strategy
    }) : rect);
    return {
      top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
      bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
      left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
      right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
    };
  }
  const arrow$3 = (options) => ({
    name: "arrow",
    options,
    async fn(state) {
      const {
        x: x2,
        y: y2,
        placement,
        rects,
        platform: platform2,
        elements,
        middlewareData
      } = state;
      const {
        element: element2,
        padding = 0
      } = evaluate(options, state) || {};
      if (element2 == null) {
        return {};
      }
      const paddingObject = getPaddingObject(padding);
      const coords = {
        x: x2,
        y: y2
      };
      const axis = getAlignmentAxis(placement);
      const length = getAxisLength(axis);
      const arrowDimensions = await platform2.getDimensions(element2);
      const isYAxis = axis === "y";
      const minProp = isYAxis ? "top" : "left";
      const maxProp = isYAxis ? "bottom" : "right";
      const clientProp = isYAxis ? "clientHeight" : "clientWidth";
      const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
      const startDiff = coords[axis] - rects.reference[axis];
      const arrowOffsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(element2));
      let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;
      if (!clientSize || !await (platform2.isElement == null ? void 0 : platform2.isElement(arrowOffsetParent))) {
        clientSize = elements.floating[clientProp] || rects.floating[length];
      }
      const centerToReference = endDiff / 2 - startDiff / 2;
      const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
      const minPadding = min(paddingObject[minProp], largestPossiblePadding);
      const maxPadding = min(paddingObject[maxProp], largestPossiblePadding);
      const min$1 = minPadding;
      const max2 = clientSize - arrowDimensions[length] - maxPadding;
      const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
      const offset2 = clamp(min$1, center, max2);
      const shouldAddOffset = !middlewareData.arrow && getAlignment(placement) != null && center !== offset2 && rects.reference[length] / 2 - (center < min$1 ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
      const alignmentOffset = shouldAddOffset ? center < min$1 ? center - min$1 : center - max2 : 0;
      return {
        [axis]: coords[axis] + alignmentOffset,
        data: {
          [axis]: offset2,
          centerOffset: center - offset2 - alignmentOffset,
          ...shouldAddOffset && {
            alignmentOffset
          }
        },
        reset: shouldAddOffset
      };
    }
  });
  const flip$2 = function(options) {
    if (options === void 0) {
      options = {};
    }
    return {
      name: "flip",
      options,
      async fn(state) {
        var _middlewareData$arrow, _middlewareData$flip;
        const {
          placement,
          middlewareData,
          rects,
          initialPlacement,
          platform: platform2,
          elements
        } = state;
        const {
          mainAxis: checkMainAxis = true,
          crossAxis: checkCrossAxis = true,
          fallbackPlacements: specifiedFallbackPlacements,
          fallbackStrategy = "bestFit",
          fallbackAxisSideDirection = "none",
          flipAlignment = true,
          ...detectOverflowOptions
        } = evaluate(options, state);
        if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
          return {};
        }
        const side = getSide(placement);
        const initialSideAxis = getSideAxis(initialPlacement);
        const isBasePlacement = getSide(initialPlacement) === initialPlacement;
        const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
        const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
        const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== "none";
        if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
          fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
        }
        const placements = [initialPlacement, ...fallbackPlacements];
        const overflow = await detectOverflow(state, detectOverflowOptions);
        const overflows = [];
        let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
        if (checkMainAxis) {
          overflows.push(overflow[side]);
        }
        if (checkCrossAxis) {
          const sides2 = getAlignmentSides(placement, rects, rtl);
          overflows.push(overflow[sides2[0]], overflow[sides2[1]]);
        }
        overflowsData = [...overflowsData, {
          placement,
          overflows
        }];
        if (!overflows.every((side2) => side2 <= 0)) {
          var _middlewareData$flip2, _overflowsData$filter;
          const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
          const nextPlacement = placements[nextIndex];
          if (nextPlacement) {
            const ignoreCrossAxisOverflow = checkCrossAxis === "alignment" ? initialSideAxis !== getSideAxis(nextPlacement) : false;
            if (!ignoreCrossAxisOverflow || // We leave the current main axis only if every placement on that axis
            // overflows the main axis.
            overflowsData.every((d2) => getSideAxis(d2.placement) === initialSideAxis ? d2.overflows[0] > 0 : true)) {
              return {
                data: {
                  index: nextIndex,
                  overflows: overflowsData
                },
                reset: {
                  placement: nextPlacement
                }
              };
            }
          }
          let resetPlacement = (_overflowsData$filter = overflowsData.filter((d2) => d2.overflows[0] <= 0).sort((a2, b2) => a2.overflows[1] - b2.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
          if (!resetPlacement) {
            switch (fallbackStrategy) {
              case "bestFit": {
                var _overflowsData$filter2;
                const placement2 = (_overflowsData$filter2 = overflowsData.filter((d2) => {
                  if (hasFallbackAxisSideDirection) {
                    const currentSideAxis = getSideAxis(d2.placement);
                    return currentSideAxis === initialSideAxis || // Create a bias to the `y` side axis due to horizontal
                    // reading directions favoring greater width.
                    currentSideAxis === "y";
                  }
                  return true;
                }).map((d2) => [d2.placement, d2.overflows.filter((overflow2) => overflow2 > 0).reduce((acc, overflow2) => acc + overflow2, 0)]).sort((a2, b2) => a2[1] - b2[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
                if (placement2) {
                  resetPlacement = placement2;
                }
                break;
              }
              case "initialPlacement":
                resetPlacement = initialPlacement;
                break;
            }
          }
          if (placement !== resetPlacement) {
            return {
              reset: {
                placement: resetPlacement
              }
            };
          }
        }
        return {};
      }
    };
  };
  function getSideOffsets(overflow, rect) {
    return {
      top: overflow.top - rect.height,
      right: overflow.right - rect.width,
      bottom: overflow.bottom - rect.height,
      left: overflow.left - rect.width
    };
  }
  function isAnySideFullyClipped(overflow) {
    return sides.some((side) => overflow[side] >= 0);
  }
  const hide$2 = function(options) {
    if (options === void 0) {
      options = {};
    }
    return {
      name: "hide",
      options,
      async fn(state) {
        const {
          rects
        } = state;
        const {
          strategy = "referenceHidden",
          ...detectOverflowOptions
        } = evaluate(options, state);
        switch (strategy) {
          case "referenceHidden": {
            const overflow = await detectOverflow(state, {
              ...detectOverflowOptions,
              elementContext: "reference"
            });
            const offsets = getSideOffsets(overflow, rects.reference);
            return {
              data: {
                referenceHiddenOffsets: offsets,
                referenceHidden: isAnySideFullyClipped(offsets)
              }
            };
          }
          case "escaped": {
            const overflow = await detectOverflow(state, {
              ...detectOverflowOptions,
              altBoundary: true
            });
            const offsets = getSideOffsets(overflow, rects.floating);
            return {
              data: {
                escapedOffsets: offsets,
                escaped: isAnySideFullyClipped(offsets)
              }
            };
          }
          default: {
            return {};
          }
        }
      }
    };
  };
  const originSides = /* @__PURE__ */ new Set(["left", "top"]);
  async function convertValueToCoords(state, options) {
    const {
      placement,
      platform: platform2,
      elements
    } = state;
    const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
    const side = getSide(placement);
    const alignment = getAlignment(placement);
    const isVertical = getSideAxis(placement) === "y";
    const mainAxisMulti = originSides.has(side) ? -1 : 1;
    const crossAxisMulti = rtl && isVertical ? -1 : 1;
    const rawValue = evaluate(options, state);
    let {
      mainAxis,
      crossAxis,
      alignmentAxis
    } = typeof rawValue === "number" ? {
      mainAxis: rawValue,
      crossAxis: 0,
      alignmentAxis: null
    } : {
      mainAxis: rawValue.mainAxis || 0,
      crossAxis: rawValue.crossAxis || 0,
      alignmentAxis: rawValue.alignmentAxis
    };
    if (alignment && typeof alignmentAxis === "number") {
      crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
    }
    return isVertical ? {
      x: crossAxis * crossAxisMulti,
      y: mainAxis * mainAxisMulti
    } : {
      x: mainAxis * mainAxisMulti,
      y: crossAxis * crossAxisMulti
    };
  }
  const offset$2 = function(options) {
    if (options === void 0) {
      options = 0;
    }
    return {
      name: "offset",
      options,
      async fn(state) {
        var _middlewareData$offse, _middlewareData$arrow;
        const {
          x: x2,
          y: y2,
          placement,
          middlewareData
        } = state;
        const diffCoords = await convertValueToCoords(state, options);
        if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
          return {};
        }
        return {
          x: x2 + diffCoords.x,
          y: y2 + diffCoords.y,
          data: {
            ...diffCoords,
            placement
          }
        };
      }
    };
  };
  const shift$2 = function(options) {
    if (options === void 0) {
      options = {};
    }
    return {
      name: "shift",
      options,
      async fn(state) {
        const {
          x: x2,
          y: y2,
          placement
        } = state;
        const {
          mainAxis: checkMainAxis = true,
          crossAxis: checkCrossAxis = false,
          limiter = {
            fn: (_ref) => {
              let {
                x: x3,
                y: y3
              } = _ref;
              return {
                x: x3,
                y: y3
              };
            }
          },
          ...detectOverflowOptions
        } = evaluate(options, state);
        const coords = {
          x: x2,
          y: y2
        };
        const overflow = await detectOverflow(state, detectOverflowOptions);
        const crossAxis = getSideAxis(getSide(placement));
        const mainAxis = getOppositeAxis(crossAxis);
        let mainAxisCoord = coords[mainAxis];
        let crossAxisCoord = coords[crossAxis];
        if (checkMainAxis) {
          const minSide = mainAxis === "y" ? "top" : "left";
          const maxSide = mainAxis === "y" ? "bottom" : "right";
          const min2 = mainAxisCoord + overflow[minSide];
          const max2 = mainAxisCoord - overflow[maxSide];
          mainAxisCoord = clamp(min2, mainAxisCoord, max2);
        }
        if (checkCrossAxis) {
          const minSide = crossAxis === "y" ? "top" : "left";
          const maxSide = crossAxis === "y" ? "bottom" : "right";
          const min2 = crossAxisCoord + overflow[minSide];
          const max2 = crossAxisCoord - overflow[maxSide];
          crossAxisCoord = clamp(min2, crossAxisCoord, max2);
        }
        const limitedCoords = limiter.fn({
          ...state,
          [mainAxis]: mainAxisCoord,
          [crossAxis]: crossAxisCoord
        });
        return {
          ...limitedCoords,
          data: {
            x: limitedCoords.x - x2,
            y: limitedCoords.y - y2,
            enabled: {
              [mainAxis]: checkMainAxis,
              [crossAxis]: checkCrossAxis
            }
          }
        };
      }
    };
  };
  const limitShift$2 = function(options) {
    if (options === void 0) {
      options = {};
    }
    return {
      options,
      fn(state) {
        const {
          x: x2,
          y: y2,
          placement,
          rects,
          middlewareData
        } = state;
        const {
          offset: offset2 = 0,
          mainAxis: checkMainAxis = true,
          crossAxis: checkCrossAxis = true
        } = evaluate(options, state);
        const coords = {
          x: x2,
          y: y2
        };
        const crossAxis = getSideAxis(placement);
        const mainAxis = getOppositeAxis(crossAxis);
        let mainAxisCoord = coords[mainAxis];
        let crossAxisCoord = coords[crossAxis];
        const rawOffset = evaluate(offset2, state);
        const computedOffset = typeof rawOffset === "number" ? {
          mainAxis: rawOffset,
          crossAxis: 0
        } : {
          mainAxis: 0,
          crossAxis: 0,
          ...rawOffset
        };
        if (checkMainAxis) {
          const len = mainAxis === "y" ? "height" : "width";
          const limitMin = rects.reference[mainAxis] - rects.floating[len] + computedOffset.mainAxis;
          const limitMax = rects.reference[mainAxis] + rects.reference[len] - computedOffset.mainAxis;
          if (mainAxisCoord < limitMin) {
            mainAxisCoord = limitMin;
          } else if (mainAxisCoord > limitMax) {
            mainAxisCoord = limitMax;
          }
        }
        if (checkCrossAxis) {
          var _middlewareData$offse, _middlewareData$offse2;
          const len = mainAxis === "y" ? "width" : "height";
          const isOriginSide = originSides.has(getSide(placement));
          const limitMin = rects.reference[crossAxis] - rects.floating[len] + (isOriginSide ? ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse[crossAxis]) || 0 : 0) + (isOriginSide ? 0 : computedOffset.crossAxis);
          const limitMax = rects.reference[crossAxis] + rects.reference[len] + (isOriginSide ? 0 : ((_middlewareData$offse2 = middlewareData.offset) == null ? void 0 : _middlewareData$offse2[crossAxis]) || 0) - (isOriginSide ? computedOffset.crossAxis : 0);
          if (crossAxisCoord < limitMin) {
            crossAxisCoord = limitMin;
          } else if (crossAxisCoord > limitMax) {
            crossAxisCoord = limitMax;
          }
        }
        return {
          [mainAxis]: mainAxisCoord,
          [crossAxis]: crossAxisCoord
        };
      }
    };
  };
  const size$2 = function(options) {
    if (options === void 0) {
      options = {};
    }
    return {
      name: "size",
      options,
      async fn(state) {
        var _state$middlewareData, _state$middlewareData2;
        const {
          placement,
          rects,
          platform: platform2,
          elements
        } = state;
        const {
          apply = () => {
          },
          ...detectOverflowOptions
        } = evaluate(options, state);
        const overflow = await detectOverflow(state, detectOverflowOptions);
        const side = getSide(placement);
        const alignment = getAlignment(placement);
        const isYAxis = getSideAxis(placement) === "y";
        const {
          width,
          height
        } = rects.floating;
        let heightSide;
        let widthSide;
        if (side === "top" || side === "bottom") {
          heightSide = side;
          widthSide = alignment === (await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating)) ? "start" : "end") ? "left" : "right";
        } else {
          widthSide = side;
          heightSide = alignment === "end" ? "top" : "bottom";
        }
        const maximumClippingHeight = height - overflow.top - overflow.bottom;
        const maximumClippingWidth = width - overflow.left - overflow.right;
        const overflowAvailableHeight = min(height - overflow[heightSide], maximumClippingHeight);
        const overflowAvailableWidth = min(width - overflow[widthSide], maximumClippingWidth);
        const noShift = !state.middlewareData.shift;
        let availableHeight = overflowAvailableHeight;
        let availableWidth = overflowAvailableWidth;
        if ((_state$middlewareData = state.middlewareData.shift) != null && _state$middlewareData.enabled.x) {
          availableWidth = maximumClippingWidth;
        }
        if ((_state$middlewareData2 = state.middlewareData.shift) != null && _state$middlewareData2.enabled.y) {
          availableHeight = maximumClippingHeight;
        }
        if (noShift && !alignment) {
          const xMin = max(overflow.left, 0);
          const xMax = max(overflow.right, 0);
          const yMin = max(overflow.top, 0);
          const yMax = max(overflow.bottom, 0);
          if (isYAxis) {
            availableWidth = width - 2 * (xMin !== 0 || xMax !== 0 ? xMin + xMax : max(overflow.left, overflow.right));
          } else {
            availableHeight = height - 2 * (yMin !== 0 || yMax !== 0 ? yMin + yMax : max(overflow.top, overflow.bottom));
          }
        }
        await apply({
          ...state,
          availableWidth,
          availableHeight
        });
        const nextDimensions = await platform2.getDimensions(elements.floating);
        if (width !== nextDimensions.width || height !== nextDimensions.height) {
          return {
            reset: {
              rects: true
            }
          };
        }
        return {};
      }
    };
  };
  function hasWindow() {
    return typeof window !== "undefined";
  }
  function getNodeName(node2) {
    if (isNode(node2)) {
      return (node2.nodeName || "").toLowerCase();
    }
    return "#document";
  }
  function getWindow(node2) {
    var _node$ownerDocument;
    return (node2 == null || (_node$ownerDocument = node2.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
  }
  function getDocumentElement(node2) {
    var _ref;
    return (_ref = (isNode(node2) ? node2.ownerDocument : node2.document) || window.document) == null ? void 0 : _ref.documentElement;
  }
  function isNode(value) {
    if (!hasWindow()) {
      return false;
    }
    return value instanceof Node || value instanceof getWindow(value).Node;
  }
  function isElement(value) {
    if (!hasWindow()) {
      return false;
    }
    return value instanceof Element || value instanceof getWindow(value).Element;
  }
  function isHTMLElement(value) {
    if (!hasWindow()) {
      return false;
    }
    return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
  }
  function isShadowRoot(value) {
    if (!hasWindow() || typeof ShadowRoot === "undefined") {
      return false;
    }
    return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
  }
  const invalidOverflowDisplayValues = /* @__PURE__ */ new Set(["inline", "contents"]);
  function isOverflowElement(element2) {
    const {
      overflow,
      overflowX,
      overflowY,
      display
    } = getComputedStyle$1(element2);
    return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !invalidOverflowDisplayValues.has(display);
  }
  const tableElements = /* @__PURE__ */ new Set(["table", "td", "th"]);
  function isTableElement(element2) {
    return tableElements.has(getNodeName(element2));
  }
  const topLayerSelectors = [":popover-open", ":modal"];
  function isTopLayer(element2) {
    return topLayerSelectors.some((selector) => {
      try {
        return element2.matches(selector);
      } catch (_e2) {
        return false;
      }
    });
  }
  const transformProperties = ["transform", "translate", "scale", "rotate", "perspective"];
  const willChangeValues = ["transform", "translate", "scale", "rotate", "perspective", "filter"];
  const containValues = ["paint", "layout", "strict", "content"];
  function isContainingBlock(elementOrCss) {
    const webkit = isWebKit();
    const css = isElement(elementOrCss) ? getComputedStyle$1(elementOrCss) : elementOrCss;
    return transformProperties.some((value) => css[value] ? css[value] !== "none" : false) || (css.containerType ? css.containerType !== "normal" : false) || !webkit && (css.backdropFilter ? css.backdropFilter !== "none" : false) || !webkit && (css.filter ? css.filter !== "none" : false) || willChangeValues.some((value) => (css.willChange || "").includes(value)) || containValues.some((value) => (css.contain || "").includes(value));
  }
  function getContainingBlock(element2) {
    let currentNode = getParentNode(element2);
    while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
      if (isContainingBlock(currentNode)) {
        return currentNode;
      } else if (isTopLayer(currentNode)) {
        return null;
      }
      currentNode = getParentNode(currentNode);
    }
    return null;
  }
  function isWebKit() {
    if (typeof CSS === "undefined" || !CSS.supports) return false;
    return CSS.supports("-webkit-backdrop-filter", "none");
  }
  const lastTraversableNodeNames = /* @__PURE__ */ new Set(["html", "body", "#document"]);
  function isLastTraversableNode(node2) {
    return lastTraversableNodeNames.has(getNodeName(node2));
  }
  function getComputedStyle$1(element2) {
    return getWindow(element2).getComputedStyle(element2);
  }
  function getNodeScroll(element2) {
    if (isElement(element2)) {
      return {
        scrollLeft: element2.scrollLeft,
        scrollTop: element2.scrollTop
      };
    }
    return {
      scrollLeft: element2.scrollX,
      scrollTop: element2.scrollY
    };
  }
  function getParentNode(node2) {
    if (getNodeName(node2) === "html") {
      return node2;
    }
    const result = (
      // Step into the shadow DOM of the parent of a slotted node.
      node2.assignedSlot || // DOM Element detected.
      node2.parentNode || // ShadowRoot detected.
      isShadowRoot(node2) && node2.host || // Fallback.
      getDocumentElement(node2)
    );
    return isShadowRoot(result) ? result.host : result;
  }
  function getNearestOverflowAncestor(node2) {
    const parentNode = getParentNode(node2);
    if (isLastTraversableNode(parentNode)) {
      return node2.ownerDocument ? node2.ownerDocument.body : node2.body;
    }
    if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
      return parentNode;
    }
    return getNearestOverflowAncestor(parentNode);
  }
  function getOverflowAncestors(node2, list2, traverseIframes) {
    var _node$ownerDocument2;
    if (list2 === void 0) {
      list2 = [];
    }
    if (traverseIframes === void 0) {
      traverseIframes = true;
    }
    const scrollableAncestor = getNearestOverflowAncestor(node2);
    const isBody = scrollableAncestor === ((_node$ownerDocument2 = node2.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
    const win = getWindow(scrollableAncestor);
    if (isBody) {
      const frameElement = getFrameElement(win);
      return list2.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
    }
    return list2.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
  }
  function getFrameElement(win) {
    return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
  }
  function getCssDimensions(element2) {
    const css = getComputedStyle$1(element2);
    let width = parseFloat(css.width) || 0;
    let height = parseFloat(css.height) || 0;
    const hasOffset = isHTMLElement(element2);
    const offsetWidth = hasOffset ? element2.offsetWidth : width;
    const offsetHeight = hasOffset ? element2.offsetHeight : height;
    const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
    if (shouldFallback) {
      width = offsetWidth;
      height = offsetHeight;
    }
    return {
      width,
      height,
      $: shouldFallback
    };
  }
  function unwrapElement(element2) {
    return !isElement(element2) ? element2.contextElement : element2;
  }
  function getScale(element2) {
    const domElement = unwrapElement(element2);
    if (!isHTMLElement(domElement)) {
      return createCoords(1);
    }
    const rect = domElement.getBoundingClientRect();
    const {
      width,
      height,
      $: $2
    } = getCssDimensions(domElement);
    let x2 = ($2 ? round(rect.width) : rect.width) / width;
    let y2 = ($2 ? round(rect.height) : rect.height) / height;
    if (!x2 || !Number.isFinite(x2)) {
      x2 = 1;
    }
    if (!y2 || !Number.isFinite(y2)) {
      y2 = 1;
    }
    return {
      x: x2,
      y: y2
    };
  }
  const noOffsets = /* @__PURE__ */ createCoords(0);
  function getVisualOffsets(element2) {
    const win = getWindow(element2);
    if (!isWebKit() || !win.visualViewport) {
      return noOffsets;
    }
    return {
      x: win.visualViewport.offsetLeft,
      y: win.visualViewport.offsetTop
    };
  }
  function shouldAddVisualOffsets(element2, isFixed, floatingOffsetParent) {
    if (isFixed === void 0) {
      isFixed = false;
    }
    if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow(element2)) {
      return false;
    }
    return isFixed;
  }
  function getBoundingClientRect(element2, includeScale, isFixedStrategy, offsetParent) {
    if (includeScale === void 0) {
      includeScale = false;
    }
    if (isFixedStrategy === void 0) {
      isFixedStrategy = false;
    }
    const clientRect = element2.getBoundingClientRect();
    const domElement = unwrapElement(element2);
    let scale = createCoords(1);
    if (includeScale) {
      if (offsetParent) {
        if (isElement(offsetParent)) {
          scale = getScale(offsetParent);
        }
      } else {
        scale = getScale(element2);
      }
    }
    const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
    let x2 = (clientRect.left + visualOffsets.x) / scale.x;
    let y2 = (clientRect.top + visualOffsets.y) / scale.y;
    let width = clientRect.width / scale.x;
    let height = clientRect.height / scale.y;
    if (domElement) {
      const win = getWindow(domElement);
      const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
      let currentWin = win;
      let currentIFrame = getFrameElement(currentWin);
      while (currentIFrame && offsetParent && offsetWin !== currentWin) {
        const iframeScale = getScale(currentIFrame);
        const iframeRect = currentIFrame.getBoundingClientRect();
        const css = getComputedStyle$1(currentIFrame);
        const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
        const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
        x2 *= iframeScale.x;
        y2 *= iframeScale.y;
        width *= iframeScale.x;
        height *= iframeScale.y;
        x2 += left;
        y2 += top;
        currentWin = getWindow(currentIFrame);
        currentIFrame = getFrameElement(currentWin);
      }
    }
    return rectToClientRect({
      width,
      height,
      x: x2,
      y: y2
    });
  }
  function getWindowScrollBarX(element2, rect) {
    const leftScroll = getNodeScroll(element2).scrollLeft;
    if (!rect) {
      return getBoundingClientRect(getDocumentElement(element2)).left + leftScroll;
    }
    return rect.left + leftScroll;
  }
  function getHTMLOffset(documentElement, scroll) {
    const htmlRect = documentElement.getBoundingClientRect();
    const x2 = htmlRect.left + scroll.scrollLeft - getWindowScrollBarX(documentElement, htmlRect);
    const y2 = htmlRect.top + scroll.scrollTop;
    return {
      x: x2,
      y: y2
    };
  }
  function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
    let {
      elements,
      rect,
      offsetParent,
      strategy
    } = _ref;
    const isFixed = strategy === "fixed";
    const documentElement = getDocumentElement(offsetParent);
    const topLayer = elements ? isTopLayer(elements.floating) : false;
    if (offsetParent === documentElement || topLayer && isFixed) {
      return rect;
    }
    let scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    let scale = createCoords(1);
    const offsets = createCoords(0);
    const isOffsetParentAnElement = isHTMLElement(offsetParent);
    if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
      if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
        scroll = getNodeScroll(offsetParent);
      }
      if (isHTMLElement(offsetParent)) {
        const offsetRect = getBoundingClientRect(offsetParent);
        scale = getScale(offsetParent);
        offsets.x = offsetRect.x + offsetParent.clientLeft;
        offsets.y = offsetRect.y + offsetParent.clientTop;
      }
    }
    const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
    return {
      width: rect.width * scale.x,
      height: rect.height * scale.y,
      x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
      y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
    };
  }
  function getClientRects(element2) {
    return Array.from(element2.getClientRects());
  }
  function getDocumentRect(element2) {
    const html2 = getDocumentElement(element2);
    const scroll = getNodeScroll(element2);
    const body2 = element2.ownerDocument.body;
    const width = max(html2.scrollWidth, html2.clientWidth, body2.scrollWidth, body2.clientWidth);
    const height = max(html2.scrollHeight, html2.clientHeight, body2.scrollHeight, body2.clientHeight);
    let x2 = -scroll.scrollLeft + getWindowScrollBarX(element2);
    const y2 = -scroll.scrollTop;
    if (getComputedStyle$1(body2).direction === "rtl") {
      x2 += max(html2.clientWidth, body2.clientWidth) - width;
    }
    return {
      width,
      height,
      x: x2,
      y: y2
    };
  }
  const SCROLLBAR_MAX = 25;
  function getViewportRect(element2, strategy) {
    const win = getWindow(element2);
    const html2 = getDocumentElement(element2);
    const visualViewport = win.visualViewport;
    let width = html2.clientWidth;
    let height = html2.clientHeight;
    let x2 = 0;
    let y2 = 0;
    if (visualViewport) {
      width = visualViewport.width;
      height = visualViewport.height;
      const visualViewportBased = isWebKit();
      if (!visualViewportBased || visualViewportBased && strategy === "fixed") {
        x2 = visualViewport.offsetLeft;
        y2 = visualViewport.offsetTop;
      }
    }
    const windowScrollbarX = getWindowScrollBarX(html2);
    if (windowScrollbarX <= 0) {
      const doc = html2.ownerDocument;
      const body2 = doc.body;
      const bodyStyles = getComputedStyle(body2);
      const bodyMarginInline = doc.compatMode === "CSS1Compat" ? parseFloat(bodyStyles.marginLeft) + parseFloat(bodyStyles.marginRight) || 0 : 0;
      const clippingStableScrollbarWidth = Math.abs(html2.clientWidth - body2.clientWidth - bodyMarginInline);
      if (clippingStableScrollbarWidth <= SCROLLBAR_MAX) {
        width -= clippingStableScrollbarWidth;
      }
    } else if (windowScrollbarX <= SCROLLBAR_MAX) {
      width += windowScrollbarX;
    }
    return {
      width,
      height,
      x: x2,
      y: y2
    };
  }
  const absoluteOrFixed = /* @__PURE__ */ new Set(["absolute", "fixed"]);
  function getInnerBoundingClientRect(element2, strategy) {
    const clientRect = getBoundingClientRect(element2, true, strategy === "fixed");
    const top = clientRect.top + element2.clientTop;
    const left = clientRect.left + element2.clientLeft;
    const scale = isHTMLElement(element2) ? getScale(element2) : createCoords(1);
    const width = element2.clientWidth * scale.x;
    const height = element2.clientHeight * scale.y;
    const x2 = left * scale.x;
    const y2 = top * scale.y;
    return {
      width,
      height,
      x: x2,
      y: y2
    };
  }
  function getClientRectFromClippingAncestor(element2, clippingAncestor, strategy) {
    let rect;
    if (clippingAncestor === "viewport") {
      rect = getViewportRect(element2, strategy);
    } else if (clippingAncestor === "document") {
      rect = getDocumentRect(getDocumentElement(element2));
    } else if (isElement(clippingAncestor)) {
      rect = getInnerBoundingClientRect(clippingAncestor, strategy);
    } else {
      const visualOffsets = getVisualOffsets(element2);
      rect = {
        x: clippingAncestor.x - visualOffsets.x,
        y: clippingAncestor.y - visualOffsets.y,
        width: clippingAncestor.width,
        height: clippingAncestor.height
      };
    }
    return rectToClientRect(rect);
  }
  function hasFixedPositionAncestor(element2, stopNode) {
    const parentNode = getParentNode(element2);
    if (parentNode === stopNode || !isElement(parentNode) || isLastTraversableNode(parentNode)) {
      return false;
    }
    return getComputedStyle$1(parentNode).position === "fixed" || hasFixedPositionAncestor(parentNode, stopNode);
  }
  function getClippingElementAncestors(element2, cache) {
    const cachedResult = cache.get(element2);
    if (cachedResult) {
      return cachedResult;
    }
    let result = getOverflowAncestors(element2, [], false).filter((el) => isElement(el) && getNodeName(el) !== "body");
    let currentContainingBlockComputedStyle = null;
    const elementIsFixed = getComputedStyle$1(element2).position === "fixed";
    let currentNode = elementIsFixed ? getParentNode(element2) : element2;
    while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
      const computedStyle = getComputedStyle$1(currentNode);
      const currentNodeIsContaining = isContainingBlock(currentNode);
      if (!currentNodeIsContaining && computedStyle.position === "fixed") {
        currentContainingBlockComputedStyle = null;
      }
      const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === "static" && !!currentContainingBlockComputedStyle && absoluteOrFixed.has(currentContainingBlockComputedStyle.position) || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element2, currentNode);
      if (shouldDropCurrentNode) {
        result = result.filter((ancestor) => ancestor !== currentNode);
      } else {
        currentContainingBlockComputedStyle = computedStyle;
      }
      currentNode = getParentNode(currentNode);
    }
    cache.set(element2, result);
    return result;
  }
  function getClippingRect(_ref) {
    let {
      element: element2,
      boundary,
      rootBoundary,
      strategy
    } = _ref;
    const elementClippingAncestors = boundary === "clippingAncestors" ? isTopLayer(element2) ? [] : getClippingElementAncestors(element2, this._c) : [].concat(boundary);
    const clippingAncestors = [...elementClippingAncestors, rootBoundary];
    const firstClippingAncestor = clippingAncestors[0];
    const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
      const rect = getClientRectFromClippingAncestor(element2, clippingAncestor, strategy);
      accRect.top = max(rect.top, accRect.top);
      accRect.right = min(rect.right, accRect.right);
      accRect.bottom = min(rect.bottom, accRect.bottom);
      accRect.left = max(rect.left, accRect.left);
      return accRect;
    }, getClientRectFromClippingAncestor(element2, firstClippingAncestor, strategy));
    return {
      width: clippingRect.right - clippingRect.left,
      height: clippingRect.bottom - clippingRect.top,
      x: clippingRect.left,
      y: clippingRect.top
    };
  }
  function getDimensions(element2) {
    const {
      width,
      height
    } = getCssDimensions(element2);
    return {
      width,
      height
    };
  }
  function getRectRelativeToOffsetParent(element2, offsetParent, strategy) {
    const isOffsetParentAnElement = isHTMLElement(offsetParent);
    const documentElement = getDocumentElement(offsetParent);
    const isFixed = strategy === "fixed";
    const rect = getBoundingClientRect(element2, true, isFixed, offsetParent);
    let scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    const offsets = createCoords(0);
    function setLeftRTLScrollbarOffset() {
      offsets.x = getWindowScrollBarX(documentElement);
    }
    if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
      if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
        scroll = getNodeScroll(offsetParent);
      }
      if (isOffsetParentAnElement) {
        const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
        offsets.x = offsetRect.x + offsetParent.clientLeft;
        offsets.y = offsetRect.y + offsetParent.clientTop;
      } else if (documentElement) {
        setLeftRTLScrollbarOffset();
      }
    }
    if (isFixed && !isOffsetParentAnElement && documentElement) {
      setLeftRTLScrollbarOffset();
    }
    const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
    const x2 = rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x;
    const y2 = rect.top + scroll.scrollTop - offsets.y - htmlOffset.y;
    return {
      x: x2,
      y: y2,
      width: rect.width,
      height: rect.height
    };
  }
  function isStaticPositioned(element2) {
    return getComputedStyle$1(element2).position === "static";
  }
  function getTrueOffsetParent(element2, polyfill) {
    if (!isHTMLElement(element2) || getComputedStyle$1(element2).position === "fixed") {
      return null;
    }
    if (polyfill) {
      return polyfill(element2);
    }
    let rawOffsetParent = element2.offsetParent;
    if (getDocumentElement(element2) === rawOffsetParent) {
      rawOffsetParent = rawOffsetParent.ownerDocument.body;
    }
    return rawOffsetParent;
  }
  function getOffsetParent(element2, polyfill) {
    const win = getWindow(element2);
    if (isTopLayer(element2)) {
      return win;
    }
    if (!isHTMLElement(element2)) {
      let svgOffsetParent = getParentNode(element2);
      while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
        if (isElement(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
          return svgOffsetParent;
        }
        svgOffsetParent = getParentNode(svgOffsetParent);
      }
      return win;
    }
    let offsetParent = getTrueOffsetParent(element2, polyfill);
    while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) {
      offsetParent = getTrueOffsetParent(offsetParent, polyfill);
    }
    if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) {
      return win;
    }
    return offsetParent || getContainingBlock(element2) || win;
  }
  const getElementRects = async function(data) {
    const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
    const getDimensionsFn = this.getDimensions;
    const floatingDimensions = await getDimensionsFn(data.floating);
    return {
      reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
      floating: {
        x: 0,
        y: 0,
        width: floatingDimensions.width,
        height: floatingDimensions.height
      }
    };
  };
  function isRTL(element2) {
    return getComputedStyle$1(element2).direction === "rtl";
  }
  const platform = {
    convertOffsetParentRelativeRectToViewportRelativeRect,
    getDocumentElement,
    getClippingRect,
    getOffsetParent,
    getElementRects,
    getClientRects,
    getDimensions,
    getScale,
    isElement,
    isRTL
  };
  function rectsAreEqual(a2, b2) {
    return a2.x === b2.x && a2.y === b2.y && a2.width === b2.width && a2.height === b2.height;
  }
  function observeMove(element2, onMove) {
    let io = null;
    let timeoutId;
    const root2 = getDocumentElement(element2);
    function cleanup() {
      var _io;
      clearTimeout(timeoutId);
      (_io = io) == null || _io.disconnect();
      io = null;
    }
    function refresh(skip, threshold) {
      if (skip === void 0) {
        skip = false;
      }
      if (threshold === void 0) {
        threshold = 1;
      }
      cleanup();
      const elementRectForRootMargin = element2.getBoundingClientRect();
      const {
        left,
        top,
        width,
        height
      } = elementRectForRootMargin;
      if (!skip) {
        onMove();
      }
      if (!width || !height) {
        return;
      }
      const insetTop = floor(top);
      const insetRight = floor(root2.clientWidth - (left + width));
      const insetBottom = floor(root2.clientHeight - (top + height));
      const insetLeft = floor(left);
      const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
      const options = {
        rootMargin,
        threshold: max(0, min(1, threshold)) || 1
      };
      let isFirstUpdate = true;
      function handleObserve(entries) {
        const ratio = entries[0].intersectionRatio;
        if (ratio !== threshold) {
          if (!isFirstUpdate) {
            return refresh();
          }
          if (!ratio) {
            timeoutId = setTimeout(() => {
              refresh(false, 1e-7);
            }, 1e3);
          } else {
            refresh(false, ratio);
          }
        }
        if (ratio === 1 && !rectsAreEqual(elementRectForRootMargin, element2.getBoundingClientRect())) {
          refresh();
        }
        isFirstUpdate = false;
      }
      try {
        io = new IntersectionObserver(handleObserve, {
          ...options,
          // Handle <iframe>s
          root: root2.ownerDocument
        });
      } catch (_e2) {
        io = new IntersectionObserver(handleObserve, options);
      }
      io.observe(element2);
    }
    refresh(true);
    return cleanup;
  }
  function autoUpdate(reference, floating, update, options) {
    if (options === void 0) {
      options = {};
    }
    const {
      ancestorScroll = true,
      ancestorResize = true,
      elementResize = typeof ResizeObserver === "function",
      layoutShift = typeof IntersectionObserver === "function",
      animationFrame = false
    } = options;
    const referenceEl = unwrapElement(reference);
    const ancestors = ancestorScroll || ancestorResize ? [...referenceEl ? getOverflowAncestors(referenceEl) : [], ...getOverflowAncestors(floating)] : [];
    ancestors.forEach((ancestor) => {
      ancestorScroll && ancestor.addEventListener("scroll", update, {
        passive: true
      });
      ancestorResize && ancestor.addEventListener("resize", update);
    });
    const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
    let reobserveFrame = -1;
    let resizeObserver = null;
    if (elementResize) {
      resizeObserver = new ResizeObserver((_ref) => {
        let [firstEntry] = _ref;
        if (firstEntry && firstEntry.target === referenceEl && resizeObserver) {
          resizeObserver.unobserve(floating);
          cancelAnimationFrame(reobserveFrame);
          reobserveFrame = requestAnimationFrame(() => {
            var _resizeObserver;
            (_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
          });
        }
        update();
      });
      if (referenceEl && !animationFrame) {
        resizeObserver.observe(referenceEl);
      }
      resizeObserver.observe(floating);
    }
    let frameId;
    let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
    if (animationFrame) {
      frameLoop();
    }
    function frameLoop() {
      const nextRefRect = getBoundingClientRect(reference);
      if (prevRefRect && !rectsAreEqual(prevRefRect, nextRefRect)) {
        update();
      }
      prevRefRect = nextRefRect;
      frameId = requestAnimationFrame(frameLoop);
    }
    update();
    return () => {
      var _resizeObserver2;
      ancestors.forEach((ancestor) => {
        ancestorScroll && ancestor.removeEventListener("scroll", update);
        ancestorResize && ancestor.removeEventListener("resize", update);
      });
      cleanupIo == null || cleanupIo();
      (_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
      resizeObserver = null;
      if (animationFrame) {
        cancelAnimationFrame(frameId);
      }
    };
  }
  const offset$1 = offset$2;
  const shift$1 = shift$2;
  const flip$1 = flip$2;
  const size$1 = size$2;
  const hide$1 = hide$2;
  const arrow$2 = arrow$3;
  const limitShift$1 = limitShift$2;
  const computePosition = (reference, floating, options) => {
    const cache = /* @__PURE__ */ new Map();
    const mergedOptions = {
      platform,
      ...options
    };
    const platformWithCache = {
      ...mergedOptions.platform,
      _c: cache
    };
    return computePosition$1(reference, floating, {
      ...mergedOptions,
      platform: platformWithCache
    });
  };
  var isClient = typeof document !== "undefined";
  var noop$2 = function noop() {
  };
  var index$1 = isClient ? _ : noop$2;
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
    let length;
    let i2;
    let keys;
    if (a2 && b2 && typeof a2 === "object") {
      if (Array.isArray(a2)) {
        length = a2.length;
        if (length !== b2.length) return false;
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
        if (!{}.hasOwnProperty.call(b2, keys[i2])) {
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
  function getDPR(element2) {
    if (typeof window === "undefined") {
      return 1;
    }
    const win = element2.ownerDocument.defaultView || window;
    return win.devicePixelRatio || 1;
  }
  function roundByDPR(element2, value) {
    const dpr = getDPR(element2);
    return Math.round(value * dpr) / dpr;
  }
  function useLatestRef(value) {
    const ref = A$2(value);
    index$1(() => {
      ref.current = value;
    });
    return ref;
  }
  function useFloating(options) {
    if (options === void 0) {
      options = {};
    }
    const {
      placement = "bottom",
      strategy = "absolute",
      middleware = [],
      platform: platform2,
      elements: {
        reference: externalReference,
        floating: externalFloating
      } = {},
      transform = true,
      whileElementsMounted,
      open
    } = options;
    const [data, setData] = d$3({
      x: 0,
      y: 0,
      strategy,
      placement,
      middlewareData: {},
      isPositioned: false
    });
    const [latestMiddleware, setLatestMiddleware] = d$3(middleware);
    if (!deepEqual(latestMiddleware, middleware)) {
      setLatestMiddleware(middleware);
    }
    const [_reference, _setReference] = d$3(null);
    const [_floating, _setFloating] = d$3(null);
    const setReference = q$1((node2) => {
      if (node2 !== referenceRef.current) {
        referenceRef.current = node2;
        _setReference(node2);
      }
    }, []);
    const setFloating = q$1((node2) => {
      if (node2 !== floatingRef.current) {
        floatingRef.current = node2;
        _setFloating(node2);
      }
    }, []);
    const referenceEl = externalReference || _reference;
    const floatingEl = externalFloating || _floating;
    const referenceRef = A$2(null);
    const floatingRef = A$2(null);
    const dataRef = A$2(data);
    const hasWhileElementsMounted = whileElementsMounted != null;
    const whileElementsMountedRef = useLatestRef(whileElementsMounted);
    const platformRef = useLatestRef(platform2);
    const openRef = useLatestRef(open);
    const update = q$1(() => {
      if (!referenceRef.current || !floatingRef.current) {
        return;
      }
      const config = {
        placement,
        strategy,
        middleware: latestMiddleware
      };
      if (platformRef.current) {
        config.platform = platformRef.current;
      }
      computePosition(referenceRef.current, floatingRef.current, config).then((data2) => {
        const fullData = {
          ...data2,
          // The floating element's position may be recomputed while it's closed
          // but still mounted (such as when transitioning out). To ensure
          // `isPositioned` will be `false` initially on the next open, avoid
          // setting it to `true` when `open === false` (must be specified).
          isPositioned: openRef.current !== false
        };
        if (isMountedRef.current && !deepEqual(dataRef.current, fullData)) {
          dataRef.current = fullData;
          En(() => {
            setData(fullData);
          });
        }
      });
    }, [latestMiddleware, placement, strategy, platformRef, openRef]);
    index$1(() => {
      if (open === false && dataRef.current.isPositioned) {
        dataRef.current.isPositioned = false;
        setData((data2) => ({
          ...data2,
          isPositioned: false
        }));
      }
    }, [open]);
    const isMountedRef = A$2(false);
    index$1(() => {
      isMountedRef.current = true;
      return () => {
        isMountedRef.current = false;
      };
    }, []);
    index$1(() => {
      if (referenceEl) referenceRef.current = referenceEl;
      if (floatingEl) floatingRef.current = floatingEl;
      if (referenceEl && floatingEl) {
        if (whileElementsMountedRef.current) {
          return whileElementsMountedRef.current(referenceEl, floatingEl, update);
        }
        update();
      }
    }, [referenceEl, floatingEl, update, whileElementsMountedRef, hasWhileElementsMounted]);
    const refs = T$3(() => ({
      reference: referenceRef,
      floating: floatingRef,
      setReference,
      setFloating
    }), [setReference, setFloating]);
    const elements = T$3(() => ({
      reference: referenceEl,
      floating: floatingEl
    }), [referenceEl, floatingEl]);
    const floatingStyles = T$3(() => {
      const initialStyles = {
        position: strategy,
        left: 0,
        top: 0
      };
      if (!elements.floating) {
        return initialStyles;
      }
      const x2 = roundByDPR(elements.floating, data.x);
      const y2 = roundByDPR(elements.floating, data.y);
      if (transform) {
        return {
          ...initialStyles,
          transform: "translate(" + x2 + "px, " + y2 + "px)",
          ...getDPR(elements.floating) >= 1.5 && {
            willChange: "transform"
          }
        };
      }
      return {
        position: strategy,
        left: x2,
        top: y2
      };
    }, [strategy, transform, elements.floating, data.x, data.y]);
    return T$3(() => ({
      ...data,
      update,
      refs,
      elements,
      floatingStyles
    }), [data, update, refs, elements, floatingStyles]);
  }
  const arrow$1 = (options) => {
    function isRef(value) {
      return {}.hasOwnProperty.call(value, "current");
    }
    return {
      name: "arrow",
      options,
      fn(state) {
        const {
          element: element2,
          padding
        } = typeof options === "function" ? options(state) : options;
        if (element2 && isRef(element2)) {
          if (element2.current != null) {
            return arrow$2({
              element: element2.current,
              padding
            }).fn(state);
          }
          return {};
        }
        if (element2) {
          return arrow$2({
            element: element2,
            padding
          }).fn(state);
        }
        return {};
      }
    };
  };
  const offset = (options, deps) => ({
    ...offset$1(options),
    options: [options, deps]
  });
  const shift = (options, deps) => ({
    ...shift$1(options),
    options: [options, deps]
  });
  const limitShift = (options, deps) => ({
    ...limitShift$1(options),
    options: [options, deps]
  });
  const flip = (options, deps) => ({
    ...flip$1(options),
    options: [options, deps]
  });
  const size = (options, deps) => ({
    ...size$1(options),
    options: [options, deps]
  });
  const hide = (options, deps) => ({
    ...hide$1(options),
    options: [options, deps]
  });
  const arrow = (options, deps) => ({
    ...arrow$1(options),
    options: [options, deps]
  });
  var NAME = "Arrow";
  var Arrow$1 = D((props, forwardedRef) => {
    const { children, width = 10, height = 5, ...arrowProps } = props;
    return /* @__PURE__ */ u$5(
      Primitive.svg,
      {
        ...arrowProps,
        ref: forwardedRef,
        width,
        height,
        viewBox: "0 0 30 10",
        preserveAspectRatio: "none",
        children: props.asChild ? children : /* @__PURE__ */ u$5("polygon", { points: "0,0 30,0 15,10" })
      }
    );
  });
  Arrow$1.displayName = NAME;
  var Root = Arrow$1;
  function useSize(element2) {
    const [size2, setSize] = d$3(void 0);
    useLayoutEffect2(() => {
      if (element2) {
        setSize({ width: element2.offsetWidth, height: element2.offsetHeight });
        const resizeObserver = new ResizeObserver((entries) => {
          if (!Array.isArray(entries)) {
            return;
          }
          if (!entries.length) {
            return;
          }
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
          setSize({ width, height });
        });
        resizeObserver.observe(element2, { box: "border-box" });
        return () => resizeObserver.unobserve(element2);
      } else {
        setSize(void 0);
      }
    }, [element2]);
    return size2;
  }
  var POPPER_NAME = "Popper";
  var [createPopperContext, createPopperScope] = createContextScope(POPPER_NAME);
  var [PopperProvider, usePopperContext] = createPopperContext(POPPER_NAME);
  var Popper = (props) => {
    const { __scopePopper, children } = props;
    const [anchor, setAnchor] = d$3(null);
    return /* @__PURE__ */ u$5(PopperProvider, { scope: __scopePopper, anchor, onAnchorChange: setAnchor, children });
  };
  Popper.displayName = POPPER_NAME;
  var ANCHOR_NAME = "PopperAnchor";
  var PopperAnchor = D(
    (props, forwardedRef) => {
      const { __scopePopper, virtualRef, ...anchorProps } = props;
      const context = usePopperContext(ANCHOR_NAME, __scopePopper);
      const ref = A$2(null);
      const composedRefs = useComposedRefs(forwardedRef, ref);
      const anchorRef = A$2(null);
      y$1(() => {
        const previousAnchor = anchorRef.current;
        anchorRef.current = (virtualRef == null ? void 0 : virtualRef.current) || ref.current;
        if (previousAnchor !== anchorRef.current) {
          context.onAnchorChange(anchorRef.current);
        }
      });
      return virtualRef ? null : /* @__PURE__ */ u$5(Primitive.div, { ...anchorProps, ref: composedRefs });
    }
  );
  PopperAnchor.displayName = ANCHOR_NAME;
  var CONTENT_NAME$1 = "PopperContent";
  var [PopperContentProvider, useContentContext] = createPopperContext(CONTENT_NAME$1);
  var PopperContent = D(
    (props, forwardedRef) => {
      var _a, _b, _c, _d, _e2, _f;
      const {
        __scopePopper,
        side = "bottom",
        sideOffset = 0,
        align = "center",
        alignOffset = 0,
        arrowPadding = 0,
        avoidCollisions = true,
        collisionBoundary = [],
        collisionPadding: collisionPaddingProp = 0,
        sticky = "partial",
        hideWhenDetached = false,
        updatePositionStrategy = "optimized",
        onPlaced,
        ...contentProps
      } = props;
      const context = usePopperContext(CONTENT_NAME$1, __scopePopper);
      const [content2, setContent] = d$3(null);
      const composedRefs = useComposedRefs(forwardedRef, (node2) => setContent(node2));
      const [arrow$12, setArrow] = d$3(null);
      const arrowSize = useSize(arrow$12);
      const arrowWidth = (arrowSize == null ? void 0 : arrowSize.width) ?? 0;
      const arrowHeight = (arrowSize == null ? void 0 : arrowSize.height) ?? 0;
      const desiredPlacement = side + (align !== "center" ? "-" + align : "");
      const collisionPadding = typeof collisionPaddingProp === "number" ? collisionPaddingProp : { top: 0, right: 0, bottom: 0, left: 0, ...collisionPaddingProp };
      const boundary = Array.isArray(collisionBoundary) ? collisionBoundary : [collisionBoundary];
      const hasExplicitBoundaries = boundary.length > 0;
      const detectOverflowOptions = {
        padding: collisionPadding,
        boundary: boundary.filter(isNotNull),
        // with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
        altBoundary: hasExplicitBoundaries
      };
      const { refs, floatingStyles, placement, isPositioned, middlewareData } = useFloating({
        // default to `fixed` strategy so users don't have to pick and we also avoid focus scroll issues
        strategy: "fixed",
        placement: desiredPlacement,
        whileElementsMounted: (...args) => {
          const cleanup = autoUpdate(...args, {
            animationFrame: updatePositionStrategy === "always"
          });
          return cleanup;
        },
        elements: {
          reference: context.anchor
        },
        middleware: [
          offset({ mainAxis: sideOffset + arrowHeight, alignmentAxis: alignOffset }),
          avoidCollisions && shift({
            mainAxis: true,
            crossAxis: false,
            limiter: sticky === "partial" ? limitShift() : void 0,
            ...detectOverflowOptions
          }),
          avoidCollisions && flip({ ...detectOverflowOptions }),
          size({
            ...detectOverflowOptions,
            apply: ({ elements, rects, availableWidth, availableHeight }) => {
              const { width: anchorWidth, height: anchorHeight } = rects.reference;
              const contentStyle = elements.floating.style;
              contentStyle.setProperty("--radix-popper-available-width", `${availableWidth}px`);
              contentStyle.setProperty("--radix-popper-available-height", `${availableHeight}px`);
              contentStyle.setProperty("--radix-popper-anchor-width", `${anchorWidth}px`);
              contentStyle.setProperty("--radix-popper-anchor-height", `${anchorHeight}px`);
            }
          }),
          arrow$12 && arrow({ element: arrow$12, padding: arrowPadding }),
          transformOrigin({ arrowWidth, arrowHeight }),
          hideWhenDetached && hide({ strategy: "referenceHidden", ...detectOverflowOptions })
        ]
      });
      const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
      const handlePlaced = useCallbackRef$1(onPlaced);
      useLayoutEffect2(() => {
        if (isPositioned) {
          handlePlaced == null ? void 0 : handlePlaced();
        }
      }, [isPositioned, handlePlaced]);
      const arrowX = (_a = middlewareData.arrow) == null ? void 0 : _a.x;
      const arrowY = (_b = middlewareData.arrow) == null ? void 0 : _b.y;
      const cannotCenterArrow = ((_c = middlewareData.arrow) == null ? void 0 : _c.centerOffset) !== 0;
      const [contentZIndex, setContentZIndex] = d$3();
      useLayoutEffect2(() => {
        if (content2) setContentZIndex(window.getComputedStyle(content2).zIndex);
      }, [content2]);
      return /* @__PURE__ */ u$5(
        "div",
        {
          ref: refs.setFloating,
          "data-radix-popper-content-wrapper": "",
          style: {
            ...floatingStyles,
            transform: isPositioned ? floatingStyles.transform : "translate(0, -200%)",
            // keep off the page when measuring
            minWidth: "max-content",
            zIndex: contentZIndex,
            ["--radix-popper-transform-origin"]: [
              (_d = middlewareData.transformOrigin) == null ? void 0 : _d.x,
              (_e2 = middlewareData.transformOrigin) == null ? void 0 : _e2.y
            ].join(" "),
            // hide the content if using the hide middleware and should be hidden
            // set visibility to hidden and disable pointer events so the UI behaves
            // as if the PopperContent isn't there at all
            ...((_f = middlewareData.hide) == null ? void 0 : _f.referenceHidden) && {
              visibility: "hidden",
              pointerEvents: "none"
            }
          },
          dir: props.dir,
          children: /* @__PURE__ */ u$5(
            PopperContentProvider,
            {
              scope: __scopePopper,
              placedSide,
              onArrowChange: setArrow,
              arrowX,
              arrowY,
              shouldHideArrow: cannotCenterArrow,
              children: /* @__PURE__ */ u$5(
                Primitive.div,
                {
                  "data-side": placedSide,
                  "data-align": placedAlign,
                  ...contentProps,
                  ref: composedRefs,
                  style: {
                    ...contentProps.style,
                    // if the PopperContent hasn't been placed yet (not all measurements done)
                    // we prevent animations so that users's animation don't kick in too early referring wrong sides
                    animation: !isPositioned ? "none" : void 0
                  }
                }
              )
            }
          )
        }
      );
    }
  );
  PopperContent.displayName = CONTENT_NAME$1;
  var ARROW_NAME$1 = "PopperArrow";
  var OPPOSITE_SIDE = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right"
  };
  var PopperArrow = D(function PopperArrow2(props, forwardedRef) {
    const { __scopePopper, ...arrowProps } = props;
    const contentContext = useContentContext(ARROW_NAME$1, __scopePopper);
    const baseSide = OPPOSITE_SIDE[contentContext.placedSide];
    return (
      // we have to use an extra wrapper because `ResizeObserver` (used by `useSize`)
      // doesn't report size as we'd expect on SVG elements.
      // it reports their bounding box which is effectively the largest path inside the SVG.
      /* @__PURE__ */ u$5(
        "span",
        {
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
          },
          children: /* @__PURE__ */ u$5(
            Root,
            {
              ...arrowProps,
              ref: forwardedRef,
              style: {
                ...arrowProps.style,
                // ensures the element can be measured correctly (mostly for if SVG)
                display: "block"
              }
            }
          )
        }
      )
    );
  });
  PopperArrow.displayName = ARROW_NAME$1;
  function isNotNull(value) {
    return value !== null;
  }
  var transformOrigin = (options) => ({
    name: "transformOrigin",
    options,
    fn(data) {
      var _a, _b, _c;
      const { placement, rects, middlewareData } = data;
      const cannotCenterArrow = ((_a = middlewareData.arrow) == null ? void 0 : _a.centerOffset) !== 0;
      const isArrowHidden = cannotCenterArrow;
      const arrowWidth = isArrowHidden ? 0 : options.arrowWidth;
      const arrowHeight = isArrowHidden ? 0 : options.arrowHeight;
      const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
      const noArrowAlign = { start: "0%", center: "50%", end: "100%" }[placedAlign];
      const arrowXCenter = (((_b = middlewareData.arrow) == null ? void 0 : _b.x) ?? 0) + arrowWidth / 2;
      const arrowYCenter = (((_c = middlewareData.arrow) == null ? void 0 : _c.y) ?? 0) + arrowHeight / 2;
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
      return { data: { x: x2, y: y2 } };
    }
  });
  function getSideAndAlignFromPlacement(placement) {
    const [side, align = "center"] = placement.split("-");
    return [side, align];
  }
  var Root2$1 = Popper;
  var Anchor = PopperAnchor;
  var Content = PopperContent;
  var Arrow = PopperArrow;
  var originalBodyUserSelect;
  var HOVERCARD_NAME = "HoverCard";
  var [createHoverCardContext] = createContextScope(HOVERCARD_NAME, [
    createPopperScope
  ]);
  var usePopperScope = createPopperScope();
  var [HoverCardProvider, useHoverCardContext] = createHoverCardContext(HOVERCARD_NAME);
  var HoverCard = (props) => {
    const {
      __scopeHoverCard,
      children,
      open: openProp,
      defaultOpen,
      onOpenChange,
      openDelay = 700,
      closeDelay = 300
    } = props;
    const popperScope = usePopperScope(__scopeHoverCard);
    const openTimerRef = A$2(0);
    const closeTimerRef = A$2(0);
    const hasSelectionRef = A$2(false);
    const isPointerDownOnContentRef = A$2(false);
    const [open, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen ?? false,
      onChange: onOpenChange,
      caller: HOVERCARD_NAME
    });
    const handleOpen = q$1(() => {
      clearTimeout(closeTimerRef.current);
      openTimerRef.current = window.setTimeout(() => setOpen(true), openDelay);
    }, [openDelay, setOpen]);
    const handleClose = q$1(() => {
      clearTimeout(openTimerRef.current);
      if (!hasSelectionRef.current && !isPointerDownOnContentRef.current) {
        closeTimerRef.current = window.setTimeout(() => setOpen(false), closeDelay);
      }
    }, [closeDelay, setOpen]);
    const handleDismiss = q$1(() => setOpen(false), [setOpen]);
    y$1(() => {
      return () => {
        clearTimeout(openTimerRef.current);
        clearTimeout(closeTimerRef.current);
      };
    }, []);
    return /* @__PURE__ */ u$5(
      HoverCardProvider,
      {
        scope: __scopeHoverCard,
        open,
        onOpenChange: setOpen,
        onOpen: handleOpen,
        onClose: handleClose,
        onDismiss: handleDismiss,
        hasSelectionRef,
        isPointerDownOnContentRef,
        children: /* @__PURE__ */ u$5(Root2$1, { ...popperScope, children })
      }
    );
  };
  HoverCard.displayName = HOVERCARD_NAME;
  var TRIGGER_NAME = "HoverCardTrigger";
  var HoverCardTrigger = D(
    (props, forwardedRef) => {
      const { __scopeHoverCard, ...triggerProps } = props;
      const context = useHoverCardContext(TRIGGER_NAME, __scopeHoverCard);
      const popperScope = usePopperScope(__scopeHoverCard);
      return /* @__PURE__ */ u$5(Anchor, { asChild: true, ...popperScope, children: /* @__PURE__ */ u$5(
        Primitive.a,
        {
          "data-state": context.open ? "open" : "closed",
          ...triggerProps,
          ref: forwardedRef,
          onPointerEnter: composeEventHandlers(props.onPointerEnter, excludeTouch(context.onOpen)),
          onPointerLeave: composeEventHandlers(props.onPointerLeave, excludeTouch(context.onClose)),
          onFocus: composeEventHandlers(props.onFocus, context.onOpen),
          onBlur: composeEventHandlers(props.onBlur, context.onClose),
          onTouchStart: composeEventHandlers(props.onTouchStart, (event) => event.preventDefault())
        }
      ) });
    }
  );
  HoverCardTrigger.displayName = TRIGGER_NAME;
  var PORTAL_NAME = "HoverCardPortal";
  var [PortalProvider, usePortalContext] = createHoverCardContext(PORTAL_NAME, {
    forceMount: void 0
  });
  var HoverCardPortal = (props) => {
    const { __scopeHoverCard, forceMount, children, container } = props;
    const context = useHoverCardContext(PORTAL_NAME, __scopeHoverCard);
    return /* @__PURE__ */ u$5(PortalProvider, { scope: __scopeHoverCard, forceMount, children: /* @__PURE__ */ u$5(Presence, { present: forceMount || context.open, children: /* @__PURE__ */ u$5(Portal$2, { asChild: true, container, children }) }) });
  };
  HoverCardPortal.displayName = PORTAL_NAME;
  var CONTENT_NAME = "HoverCardContent";
  var HoverCardContent = D(
    (props, forwardedRef) => {
      const portalContext = usePortalContext(CONTENT_NAME, props.__scopeHoverCard);
      const { forceMount = portalContext.forceMount, ...contentProps } = props;
      const context = useHoverCardContext(CONTENT_NAME, props.__scopeHoverCard);
      return /* @__PURE__ */ u$5(Presence, { present: forceMount || context.open, children: /* @__PURE__ */ u$5(
        HoverCardContentImpl,
        {
          "data-state": context.open ? "open" : "closed",
          ...contentProps,
          onPointerEnter: composeEventHandlers(props.onPointerEnter, excludeTouch(context.onOpen)),
          onPointerLeave: composeEventHandlers(props.onPointerLeave, excludeTouch(context.onClose)),
          ref: forwardedRef
        }
      ) });
    }
  );
  HoverCardContent.displayName = CONTENT_NAME;
  var HoverCardContentImpl = D((props, forwardedRef) => {
    const {
      __scopeHoverCard,
      onEscapeKeyDown,
      onPointerDownOutside,
      onFocusOutside,
      onInteractOutside,
      ...contentProps
    } = props;
    const context = useHoverCardContext(CONTENT_NAME, __scopeHoverCard);
    const popperScope = usePopperScope(__scopeHoverCard);
    const ref = A$2(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const [containSelection, setContainSelection] = d$3(false);
    y$1(() => {
      if (containSelection) {
        const body2 = document.body;
        originalBodyUserSelect = body2.style.userSelect || body2.style.webkitUserSelect;
        body2.style.userSelect = "none";
        body2.style.webkitUserSelect = "none";
        return () => {
          body2.style.userSelect = originalBodyUserSelect;
          body2.style.webkitUserSelect = originalBodyUserSelect;
        };
      }
    }, [containSelection]);
    y$1(() => {
      if (ref.current) {
        const handlePointerUp = () => {
          setContainSelection(false);
          context.isPointerDownOnContentRef.current = false;
          setTimeout(() => {
            var _a;
            const hasSelection = ((_a = document.getSelection()) == null ? void 0 : _a.toString()) !== "";
            if (hasSelection) context.hasSelectionRef.current = true;
          });
        };
        document.addEventListener("pointerup", handlePointerUp);
        return () => {
          document.removeEventListener("pointerup", handlePointerUp);
          context.hasSelectionRef.current = false;
          context.isPointerDownOnContentRef.current = false;
        };
      }
    }, [context.isPointerDownOnContentRef, context.hasSelectionRef]);
    y$1(() => {
      if (ref.current) {
        const tabbables = getTabbableNodes(ref.current);
        tabbables.forEach((tabbable) => tabbable.setAttribute("tabindex", "-1"));
      }
    });
    return /* @__PURE__ */ u$5(
      DismissableLayer,
      {
        asChild: true,
        disableOutsidePointerEvents: false,
        onInteractOutside,
        onEscapeKeyDown,
        onPointerDownOutside,
        onFocusOutside: composeEventHandlers(onFocusOutside, (event) => {
          event.preventDefault();
        }),
        onDismiss: context.onDismiss,
        children: /* @__PURE__ */ u$5(
          Content,
          {
            ...popperScope,
            ...contentProps,
            onPointerDown: composeEventHandlers(contentProps.onPointerDown, (event) => {
              if (event.currentTarget.contains(event.target)) {
                setContainSelection(true);
              }
              context.hasSelectionRef.current = false;
              context.isPointerDownOnContentRef.current = true;
            }),
            ref: composedRefs,
            style: {
              ...contentProps.style,
              userSelect: containSelection ? "text" : void 0,
              // Safari requires prefix
              WebkitUserSelect: containSelection ? "text" : void 0,
              // re-namespace exposed content custom properties
              ...{
                "--radix-hover-card-content-transform-origin": "var(--radix-popper-transform-origin)",
                "--radix-hover-card-content-available-width": "var(--radix-popper-available-width)",
                "--radix-hover-card-content-available-height": "var(--radix-popper-available-height)",
                "--radix-hover-card-trigger-width": "var(--radix-popper-anchor-width)",
                "--radix-hover-card-trigger-height": "var(--radix-popper-anchor-height)"
              }
            }
          }
        )
      }
    );
  });
  var ARROW_NAME = "HoverCardArrow";
  var HoverCardArrow = D(
    (props, forwardedRef) => {
      const { __scopeHoverCard, ...arrowProps } = props;
      const popperScope = usePopperScope(__scopeHoverCard);
      return /* @__PURE__ */ u$5(Arrow, { ...popperScope, ...arrowProps, ref: forwardedRef });
    }
  );
  HoverCardArrow.displayName = ARROW_NAME;
  function excludeTouch(eventHandler) {
    return (event) => event.pointerType === "touch" ? void 0 : eventHandler();
  }
  function getTabbableNodes(container) {
    const nodes = [];
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (node2) => {
        return node2.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    while (walker.nextNode()) nodes.push(walker.currentNode);
    return nodes;
  }
  var Root2 = HoverCard;
  var Trigger = HoverCardTrigger;
  var Portal = HoverCardPortal;
  var Content2 = HoverCardContent;
  var Arrow2 = HoverCardArrow;
  function _typeof(o3) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o4) {
      return typeof o4;
    } : function(o4) {
      return o4 && "function" == typeof Symbol && o4.constructor === Symbol && o4 !== Symbol.prototype ? "symbol" : typeof o4;
    }, _typeof(o3);
  }
  function toPrimitive(t2, r2) {
    if ("object" != _typeof(t2) || !t2) return t2;
    var e2 = t2[Symbol.toPrimitive];
    if (void 0 !== e2) {
      var i2 = e2.call(t2, r2);
      if ("object" != _typeof(i2)) return i2;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r2 ? String : Number)(t2);
  }
  function toPropertyKey(t2) {
    var i2 = toPrimitive(t2, "string");
    return "symbol" == _typeof(i2) ? i2 : i2 + "";
  }
  function _defineProperty(e2, r2, t2) {
    return (r2 = toPropertyKey(r2)) in e2 ? Object.defineProperty(e2, r2, {
      value: t2,
      enumerable: true,
      configurable: true,
      writable: true
    }) : e2[r2] = t2, e2;
  }
  function warn() {
    if (console && console.warn) {
      var _console;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      if (typeof args[0] === "string") args[0] = "react-i18next:: ".concat(args[0]);
      (_console = console).warn.apply(_console, args);
    }
  }
  var alreadyWarned = {};
  function warnOnce() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    if (typeof args[0] === "string" && alreadyWarned[args[0]]) return;
    if (typeof args[0] === "string") alreadyWarned[args[0]] = /* @__PURE__ */ new Date();
    warn.apply(void 0, args);
  }
  var loadedClb = function loadedClb2(i18n, cb) {
    return function() {
      if (i18n.isInitialized) {
        cb();
      } else {
        var initialized = function initialized2() {
          setTimeout(function() {
            i18n.off("initialized", initialized2);
          }, 0);
          cb();
        };
        i18n.on("initialized", initialized);
      }
    };
  };
  function loadNamespaces(i18n, ns, cb) {
    i18n.loadNamespaces(ns, loadedClb(i18n, cb));
  }
  function loadLanguages(i18n, lng, ns, cb) {
    if (typeof ns === "string") ns = [ns];
    ns.forEach(function(n2) {
      if (i18n.options.ns.indexOf(n2) < 0) i18n.options.ns.push(n2);
    });
    i18n.loadLanguages(lng, loadedClb(i18n, cb));
  }
  function oldI18nextHasLoadedNamespace(ns, i18n) {
    var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    var lng = i18n.languages[0];
    var fallbackLng = i18n.options ? i18n.options.fallbackLng : false;
    var lastLng = i18n.languages[i18n.languages.length - 1];
    if (lng.toLowerCase() === "cimode") return true;
    var loadNotPending = function loadNotPending2(l2, n2) {
      var loadState = i18n.services.backendConnector.state["".concat(l2, "|").concat(n2)];
      return loadState === -1 || loadState === 2;
    };
    if (options.bindI18n && options.bindI18n.indexOf("languageChanging") > -1 && i18n.services.backendConnector.backend && i18n.isLanguageChangingTo && !loadNotPending(i18n.isLanguageChangingTo, ns)) return false;
    if (i18n.hasResourceBundle(lng, ns)) return true;
    if (!i18n.services.backendConnector.backend || i18n.options.resources && !i18n.options.partialBundledLanguages) return true;
    if (loadNotPending(lng, ns) && (!fallbackLng || loadNotPending(lastLng, ns))) return true;
    return false;
  }
  function hasLoadedNamespace(ns, i18n) {
    var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    if (!i18n.languages || !i18n.languages.length) {
      warnOnce("i18n.languages were undefined or empty", i18n.languages);
      return true;
    }
    var isNewerI18next = i18n.options.ignoreJSONStructure !== void 0;
    if (!isNewerI18next) {
      return oldI18nextHasLoadedNamespace(ns, i18n, options);
    }
    return i18n.hasLoadedNamespace(ns, {
      lng: options.lng,
      precheck: function precheck(i18nInstance2, loadNotPending) {
        if (options.bindI18n && options.bindI18n.indexOf("languageChanging") > -1 && i18nInstance2.services.backendConnector.backend && i18nInstance2.isLanguageChangingTo && !loadNotPending(i18nInstance2.isLanguageChangingTo, ns)) return false;
      }
    });
  }
  var matchHtmlEntity = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34|nbsp|#160|copy|#169|reg|#174|hellip|#8230|#x2F|#47);/g;
  var htmlEntities = {
    "&amp;": "&",
    "&#38;": "&",
    "&lt;": "<",
    "&#60;": "<",
    "&gt;": ">",
    "&#62;": ">",
    "&apos;": "'",
    "&#39;": "'",
    "&quot;": '"',
    "&#34;": '"',
    "&nbsp;": " ",
    "&#160;": " ",
    "&copy;": "©",
    "&#169;": "©",
    "&reg;": "®",
    "&#174;": "®",
    "&hellip;": "…",
    "&#8230;": "…",
    "&#x2F;": "/",
    "&#47;": "/"
  };
  var unescapeHtmlEntity = function unescapeHtmlEntity2(m2) {
    return htmlEntities[m2];
  };
  var unescape = function unescape2(text2) {
    return text2.replace(matchHtmlEntity, unescapeHtmlEntity);
  };
  function ownKeys$8(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) {
        symbols = symbols.filter(function(sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      }
      keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread$8(target) {
    for (var i2 = 1; i2 < arguments.length; i2++) {
      var source = arguments[i2] != null ? arguments[i2] : {};
      if (i2 % 2) {
        ownKeys$8(Object(source), true).forEach(function(key2) {
          _defineProperty(target, key2, source[key2]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys$8(Object(source)).forEach(function(key2) {
          Object.defineProperty(target, key2, Object.getOwnPropertyDescriptor(source, key2));
        });
      }
    }
    return target;
  }
  var defaultOptions = {
    bindI18n: "languageChanged",
    bindI18nStore: "",
    transEmptyNodeValue: "",
    transSupportBasicHtmlNodes: true,
    transWrapTextNodes: "",
    transKeepBasicHtmlNodesFor: ["br", "strong", "i", "p"],
    useSuspense: true,
    unescape
  };
  function setDefaults() {
    var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    defaultOptions = _objectSpread$8(_objectSpread$8({}, defaultOptions), options);
  }
  function getDefaults() {
    return defaultOptions;
  }
  var i18nInstance;
  function setI18n(instance2) {
    i18nInstance = instance2;
  }
  function getI18n() {
    return i18nInstance;
  }
  function _classCallCheck(a2, n2) {
    if (!(a2 instanceof n2)) throw new TypeError("Cannot call a class as a function");
  }
  function _defineProperties(e2, r2) {
    for (var t2 = 0; t2 < r2.length; t2++) {
      var o3 = r2[t2];
      o3.enumerable = o3.enumerable || false, o3.configurable = true, "value" in o3 && (o3.writable = true), Object.defineProperty(e2, toPropertyKey(o3.key), o3);
    }
  }
  function _createClass(e2, r2, t2) {
    return r2 && _defineProperties(e2.prototype, r2), t2 && _defineProperties(e2, t2), Object.defineProperty(e2, "prototype", {
      writable: false
    }), e2;
  }
  var initReactI18next = {
    type: "3rdParty",
    init: function init(instance2) {
      setDefaults(instance2.options.react);
      setI18n(instance2);
    }
  };
  var I18nContext = Q$1();
  var ReportNamespaces = function() {
    function ReportNamespaces2() {
      _classCallCheck(this, ReportNamespaces2);
      this.usedNamespaces = {};
    }
    _createClass(ReportNamespaces2, [{
      key: "addUsedNamespaces",
      value: function addUsedNamespaces(namespaces) {
        var _this = this;
        namespaces.forEach(function(ns) {
          if (!_this.usedNamespaces[ns]) _this.usedNamespaces[ns] = true;
        });
      }
    }, {
      key: "getUsedNamespaces",
      value: function getUsedNamespaces() {
        return Object.keys(this.usedNamespaces);
      }
    }]);
    return ReportNamespaces2;
  }();
  function _arrayWithHoles(r2) {
    if (Array.isArray(r2)) return r2;
  }
  function _iterableToArrayLimit(r2, l2) {
    var t2 = null == r2 ? null : "undefined" != typeof Symbol && r2[Symbol.iterator] || r2["@@iterator"];
    if (null != t2) {
      var e2, n2, i2, u2, a2 = [], f2 = true, o3 = false;
      try {
        if (i2 = (t2 = t2.call(r2)).next, 0 === l2) ;
        else for (; !(f2 = (e2 = i2.call(t2)).done) && (a2.push(e2.value), a2.length !== l2); f2 = true) ;
      } catch (r3) {
        o3 = true, n2 = r3;
      } finally {
        try {
          if (!f2 && null != t2["return"] && (u2 = t2["return"](), Object(u2) !== u2)) return;
        } finally {
          if (o3) throw n2;
        }
      }
      return a2;
    }
  }
  function _arrayLikeToArray(r2, a2) {
    (null == a2 || a2 > r2.length) && (a2 = r2.length);
    for (var e2 = 0, n2 = Array(a2); e2 < a2; e2++) n2[e2] = r2[e2];
    return n2;
  }
  function _unsupportedIterableToArray(r2, a2) {
    if (r2) {
      if ("string" == typeof r2) return _arrayLikeToArray(r2, a2);
      var t2 = {}.toString.call(r2).slice(8, -1);
      return "Object" === t2 && r2.constructor && (t2 = r2.constructor.name), "Map" === t2 || "Set" === t2 ? Array.from(r2) : "Arguments" === t2 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t2) ? _arrayLikeToArray(r2, a2) : void 0;
    }
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _slicedToArray(r2, e2) {
    return _arrayWithHoles(r2) || _iterableToArrayLimit(r2, e2) || _unsupportedIterableToArray(r2, e2) || _nonIterableRest();
  }
  function ownKeys$7(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) {
        symbols = symbols.filter(function(sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      }
      keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread$7(target) {
    for (var i2 = 1; i2 < arguments.length; i2++) {
      var source = arguments[i2] != null ? arguments[i2] : {};
      if (i2 % 2) {
        ownKeys$7(Object(source), true).forEach(function(key2) {
          _defineProperty(target, key2, source[key2]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys$7(Object(source)).forEach(function(key2) {
          Object.defineProperty(target, key2, Object.getOwnPropertyDescriptor(source, key2));
        });
      }
    }
    return target;
  }
  var usePrevious = function usePrevious2(value, ignore2) {
    var ref = A$2();
    y$1(function() {
      ref.current = value;
    }, [value, ignore2]);
    return ref.current;
  };
  function useTranslation(ns) {
    var props = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var i18nFromProps = props.i18n;
    var _ref = x$2(I18nContext) || {}, i18nFromContext = _ref.i18n, defaultNSFromContext = _ref.defaultNS;
    var i18n = i18nFromProps || i18nFromContext || getI18n();
    if (i18n && !i18n.reportNamespaces) i18n.reportNamespaces = new ReportNamespaces();
    if (!i18n) {
      warnOnce("You will need to pass in an i18next instance by using initReactI18next");
      var notReadyT = function notReadyT2(k2, optsOrDefaultValue) {
        if (typeof optsOrDefaultValue === "string") return optsOrDefaultValue;
        if (optsOrDefaultValue && _typeof(optsOrDefaultValue) === "object" && typeof optsOrDefaultValue.defaultValue === "string") return optsOrDefaultValue.defaultValue;
        return Array.isArray(k2) ? k2[k2.length - 1] : k2;
      };
      var retNotReady = [notReadyT, {}, false];
      retNotReady.t = notReadyT;
      retNotReady.i18n = {};
      retNotReady.ready = false;
      return retNotReady;
    }
    if (i18n.options.react && i18n.options.react.wait !== void 0) warnOnce("It seems you are still using the old wait option, you may migrate to the new useSuspense behaviour.");
    var i18nOptions = _objectSpread$7(_objectSpread$7(_objectSpread$7({}, getDefaults()), i18n.options.react), props);
    var useSuspense = i18nOptions.useSuspense, keyPrefix = i18nOptions.keyPrefix;
    var namespaces = defaultNSFromContext || i18n.options && i18n.options.defaultNS;
    namespaces = typeof namespaces === "string" ? [namespaces] : namespaces || ["translation"];
    if (i18n.reportNamespaces.addUsedNamespaces) i18n.reportNamespaces.addUsedNamespaces(namespaces);
    var ready = (i18n.isInitialized || i18n.initializedStoreOnce) && namespaces.every(function(n2) {
      return hasLoadedNamespace(n2, i18n, i18nOptions);
    });
    function getT() {
      return i18n.getFixedT(props.lng || null, i18nOptions.nsMode === "fallback" ? namespaces : namespaces[0], keyPrefix);
    }
    var _useState = d$3(getT), _useState2 = _slicedToArray(_useState, 2), t2 = _useState2[0], setT = _useState2[1];
    var joinedNS = namespaces.join();
    if (props.lng) joinedNS = "".concat(props.lng).concat(joinedNS);
    var previousJoinedNS = usePrevious(joinedNS);
    var isMounted = A$2(true);
    y$1(function() {
      var bindI18n = i18nOptions.bindI18n, bindI18nStore = i18nOptions.bindI18nStore;
      isMounted.current = true;
      if (!ready && !useSuspense) {
        if (props.lng) {
          loadLanguages(i18n, props.lng, namespaces, function() {
            if (isMounted.current) setT(getT);
          });
        } else {
          loadNamespaces(i18n, namespaces, function() {
            if (isMounted.current) setT(getT);
          });
        }
      }
      if (ready && previousJoinedNS && previousJoinedNS !== joinedNS && isMounted.current) {
        setT(getT);
      }
      function boundReset() {
        if (isMounted.current) setT(getT);
      }
      if (bindI18n && i18n) i18n.on(bindI18n, boundReset);
      if (bindI18nStore && i18n) i18n.store.on(bindI18nStore, boundReset);
      return function() {
        isMounted.current = false;
        if (bindI18n && i18n) bindI18n.split(" ").forEach(function(e2) {
          return i18n.off(e2, boundReset);
        });
        if (bindI18nStore && i18n) bindI18nStore.split(" ").forEach(function(e2) {
          return i18n.store.off(e2, boundReset);
        });
      };
    }, [i18n, joinedNS]);
    var isInitial = A$2(true);
    y$1(function() {
      if (isMounted.current && !isInitial.current) {
        setT(getT);
      }
      isInitial.current = false;
    }, [i18n, keyPrefix]);
    var ret = [t2, i18n, ready];
    ret.t = t2;
    ret.i18n = i18n;
    ret.ready = ready;
    if (ready) return ret;
    if (!ready && !useSuspense) return ret;
    throw new Promise(function(resolve) {
      if (props.lng) {
        loadLanguages(i18n, props.lng, namespaces, function() {
          return resolve();
        });
      } else {
        loadNamespaces(i18n, namespaces, function() {
          return resolve();
        });
      }
    });
  }
  function _assertThisInitialized(e2) {
    if (void 0 === e2) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return e2;
  }
  function _setPrototypeOf(t2, e2) {
    return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t3, e3) {
      return t3.__proto__ = e3, t3;
    }, _setPrototypeOf(t2, e2);
  }
  function _inherits(t2, e2) {
    if ("function" != typeof e2 && null !== e2) throw new TypeError("Super expression must either be null or a function");
    t2.prototype = Object.create(e2 && e2.prototype, {
      constructor: {
        value: t2,
        writable: true,
        configurable: true
      }
    }), Object.defineProperty(t2, "prototype", {
      writable: false
    }), e2 && _setPrototypeOf(t2, e2);
  }
  function _possibleConstructorReturn(t2, e2) {
    if (e2 && ("object" == _typeof(e2) || "function" == typeof e2)) return e2;
    if (void 0 !== e2) throw new TypeError("Derived constructors may only return object or undefined");
    return _assertThisInitialized(t2);
  }
  function _getPrototypeOf(t2) {
    return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t3) {
      return t3.__proto__ || Object.getPrototypeOf(t3);
    }, _getPrototypeOf(t2);
  }
  function _iterableToArray(r2) {
    if ("undefined" != typeof Symbol && null != r2[Symbol.iterator] || null != r2["@@iterator"]) return Array.from(r2);
  }
  function _toArray(r2) {
    return _arrayWithHoles(r2) || _iterableToArray(r2) || _unsupportedIterableToArray(r2) || _nonIterableRest();
  }
  function ownKeys$6(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      enumerableOnly && (symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })), keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread$6(target) {
    for (var i2 = 1; i2 < arguments.length; i2++) {
      var source = null != arguments[i2] ? arguments[i2] : {};
      i2 % 2 ? ownKeys$6(Object(source), true).forEach(function(key2) {
        _defineProperty(target, key2, source[key2]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$6(Object(source)).forEach(function(key2) {
        Object.defineProperty(target, key2, Object.getOwnPropertyDescriptor(source, key2));
      });
    }
    return target;
  }
  var consoleLogger = {
    type: "logger",
    log: function log(args) {
      this.output("log", args);
    },
    warn: function warn2(args) {
      this.output("warn", args);
    },
    error: function error(args) {
      this.output("error", args);
    },
    output: function output(type, args) {
      if (console && console[type]) console[type].apply(console, args);
    }
  };
  var Logger = function() {
    function Logger2(concreteLogger) {
      var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      _classCallCheck(this, Logger2);
      this.init(concreteLogger, options);
    }
    _createClass(Logger2, [{
      key: "init",
      value: function init2(concreteLogger) {
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        this.prefix = options.prefix || "i18next:";
        this.logger = concreteLogger || consoleLogger;
        this.options = options;
        this.debug = options.debug;
      }
    }, {
      key: "setDebug",
      value: function setDebug(bool) {
        this.debug = bool;
      }
    }, {
      key: "log",
      value: function log2() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        return this.forward(args, "log", "", true);
      }
    }, {
      key: "warn",
      value: function warn3() {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }
        return this.forward(args, "warn", "", true);
      }
    }, {
      key: "error",
      value: function error2() {
        for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }
        return this.forward(args, "error", "");
      }
    }, {
      key: "deprecate",
      value: function deprecate() {
        for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          args[_key4] = arguments[_key4];
        }
        return this.forward(args, "warn", "WARNING DEPRECATED: ", true);
      }
    }, {
      key: "forward",
      value: function forward(args, lvl, prefix, debugOnly) {
        if (debugOnly && !this.debug) return null;
        if (typeof args[0] === "string") args[0] = "".concat(prefix).concat(this.prefix, " ").concat(args[0]);
        return this.logger[lvl](args);
      }
    }, {
      key: "create",
      value: function create2(moduleName) {
        return new Logger2(this.logger, _objectSpread$6(_objectSpread$6({}, {
          prefix: "".concat(this.prefix, ":").concat(moduleName, ":")
        }), this.options));
      }
    }, {
      key: "clone",
      value: function clone(options) {
        options = options || this.options;
        options.prefix = options.prefix || this.prefix;
        return new Logger2(this.logger, options);
      }
    }]);
    return Logger2;
  }();
  var baseLogger = new Logger();
  var EventEmitter$1 = function() {
    function EventEmitter2() {
      _classCallCheck(this, EventEmitter2);
      this.observers = {};
    }
    _createClass(EventEmitter2, [{
      key: "on",
      value: function on2(events, listener) {
        var _this = this;
        events.split(" ").forEach(function(event) {
          _this.observers[event] = _this.observers[event] || [];
          _this.observers[event].push(listener);
        });
        return this;
      }
    }, {
      key: "off",
      value: function off(event, listener) {
        if (!this.observers[event]) return;
        if (!listener) {
          delete this.observers[event];
          return;
        }
        this.observers[event] = this.observers[event].filter(function(l2) {
          return l2 !== listener;
        });
      }
    }, {
      key: "emit",
      value: function emit(event) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }
        if (this.observers[event]) {
          var cloned = [].concat(this.observers[event]);
          cloned.forEach(function(observer) {
            observer.apply(void 0, args);
          });
        }
        if (this.observers["*"]) {
          var _cloned = [].concat(this.observers["*"]);
          _cloned.forEach(function(observer) {
            observer.apply(observer, [event].concat(args));
          });
        }
      }
    }]);
    return EventEmitter2;
  }();
  function defer() {
    var res;
    var rej;
    var promise = new Promise(function(resolve, reject) {
      res = resolve;
      rej = reject;
    });
    promise.resolve = res;
    promise.reject = rej;
    return promise;
  }
  function makeString(object) {
    if (object == null) return "";
    return "" + object;
  }
  function copy(a2, s2, t2) {
    a2.forEach(function(m2) {
      if (s2[m2]) t2[m2] = s2[m2];
    });
  }
  function getLastOfPath(object, path2, Empty) {
    function cleanKey(key3) {
      return key3 && key3.indexOf("###") > -1 ? key3.replace(/###/g, ".") : key3;
    }
    function canNotTraverseDeeper() {
      return !object || typeof object === "string";
    }
    var stack = typeof path2 !== "string" ? [].concat(path2) : path2.split(".");
    while (stack.length > 1) {
      if (canNotTraverseDeeper()) return {};
      var key2 = cleanKey(stack.shift());
      if (!object[key2] && Empty) object[key2] = new Empty();
      if (Object.prototype.hasOwnProperty.call(object, key2)) {
        object = object[key2];
      } else {
        object = {};
      }
    }
    if (canNotTraverseDeeper()) return {};
    return {
      obj: object,
      k: cleanKey(stack.shift())
    };
  }
  function setPath(object, path2, newValue) {
    var _getLastOfPath = getLastOfPath(object, path2, Object), obj = _getLastOfPath.obj, k2 = _getLastOfPath.k;
    obj[k2] = newValue;
  }
  function pushPath(object, path2, newValue, concat) {
    var _getLastOfPath2 = getLastOfPath(object, path2, Object), obj = _getLastOfPath2.obj, k2 = _getLastOfPath2.k;
    obj[k2] = obj[k2] || [];
    obj[k2].push(newValue);
  }
  function getPath(object, path2) {
    var _getLastOfPath3 = getLastOfPath(object, path2), obj = _getLastOfPath3.obj, k2 = _getLastOfPath3.k;
    if (!obj) return void 0;
    return obj[k2];
  }
  function getPathWithDefaults(data, defaultData, key2) {
    var value = getPath(data, key2);
    if (value !== void 0) {
      return value;
    }
    return getPath(defaultData, key2);
  }
  function deepExtend(target, source, overwrite) {
    for (var prop in source) {
      if (prop !== "__proto__" && prop !== "constructor") {
        if (prop in target) {
          if (typeof target[prop] === "string" || target[prop] instanceof String || typeof source[prop] === "string" || source[prop] instanceof String) {
            if (overwrite) target[prop] = source[prop];
          } else {
            deepExtend(target[prop], source[prop], overwrite);
          }
        } else {
          target[prop] = source[prop];
        }
      }
    }
    return target;
  }
  function regexEscape(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }
  var _entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "/": "&#x2F;"
  };
  function escape(data) {
    if (typeof data === "string") {
      return data.replace(/[&<>"'\/]/g, function(s2) {
        return _entityMap[s2];
      });
    }
    return data;
  }
  var isIE10 = typeof window !== "undefined" && window.navigator && typeof window.navigator.userAgentData === "undefined" && window.navigator.userAgent && window.navigator.userAgent.indexOf("MSIE") > -1;
  var chars = [" ", ",", "?", "!", ";"];
  function looksLikeObjectPath(key2, nsSeparator, keySeparator) {
    nsSeparator = nsSeparator || "";
    keySeparator = keySeparator || "";
    var possibleChars = chars.filter(function(c2) {
      return nsSeparator.indexOf(c2) < 0 && keySeparator.indexOf(c2) < 0;
    });
    if (possibleChars.length === 0) return true;
    var r2 = new RegExp("(".concat(possibleChars.map(function(c2) {
      return c2 === "?" ? "\\?" : c2;
    }).join("|"), ")"));
    var matched = !r2.test(key2);
    if (!matched) {
      var ki = key2.indexOf(keySeparator);
      if (ki > 0 && !r2.test(key2.substring(0, ki))) {
        matched = true;
      }
    }
    return matched;
  }
  function deepFind(obj, path2) {
    var keySeparator = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : ".";
    if (!obj) return void 0;
    if (obj[path2]) return obj[path2];
    var paths = path2.split(keySeparator);
    var current = obj;
    for (var i2 = 0; i2 < paths.length; ++i2) {
      if (!current) return void 0;
      if (typeof current[paths[i2]] === "string" && i2 + 1 < paths.length) {
        return void 0;
      }
      if (current[paths[i2]] === void 0) {
        var j2 = 2;
        var p2 = paths.slice(i2, i2 + j2).join(keySeparator);
        var mix = current[p2];
        while (mix === void 0 && paths.length > i2 + j2) {
          j2++;
          p2 = paths.slice(i2, i2 + j2).join(keySeparator);
          mix = current[p2];
        }
        if (mix === void 0) return void 0;
        if (mix === null) return null;
        if (path2.endsWith(p2)) {
          if (typeof mix === "string") return mix;
          if (p2 && typeof mix[p2] === "string") return mix[p2];
        }
        var joinedPath = paths.slice(i2 + j2).join(keySeparator);
        if (joinedPath) return deepFind(mix, joinedPath, keySeparator);
        return void 0;
      }
      current = current[paths[i2]];
    }
    return current;
  }
  function ownKeys$5(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      enumerableOnly && (symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })), keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread$5(target) {
    for (var i2 = 1; i2 < arguments.length; i2++) {
      var source = null != arguments[i2] ? arguments[i2] : {};
      i2 % 2 ? ownKeys$5(Object(source), true).forEach(function(key2) {
        _defineProperty(target, key2, source[key2]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$5(Object(source)).forEach(function(key2) {
        Object.defineProperty(target, key2, Object.getOwnPropertyDescriptor(source, key2));
      });
    }
    return target;
  }
  function _createSuper$3(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct$3();
    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived), result;
      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;
        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }
      return _possibleConstructorReturn(this, result);
    };
  }
  function _isNativeReflectConstruct$3() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
      return true;
    } catch (e2) {
      return false;
    }
  }
  var ResourceStore = function(_EventEmitter) {
    _inherits(ResourceStore2, _EventEmitter);
    var _super = _createSuper$3(ResourceStore2);
    function ResourceStore2(data) {
      var _this;
      var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
        ns: ["translation"],
        defaultNS: "translation"
      };
      _classCallCheck(this, ResourceStore2);
      _this = _super.call(this);
      if (isIE10) {
        EventEmitter$1.call(_assertThisInitialized(_this));
      }
      _this.data = data || {};
      _this.options = options;
      if (_this.options.keySeparator === void 0) {
        _this.options.keySeparator = ".";
      }
      if (_this.options.ignoreJSONStructure === void 0) {
        _this.options.ignoreJSONStructure = true;
      }
      return _this;
    }
    _createClass(ResourceStore2, [{
      key: "addNamespaces",
      value: function addNamespaces(ns) {
        if (this.options.ns.indexOf(ns) < 0) {
          this.options.ns.push(ns);
        }
      }
    }, {
      key: "removeNamespaces",
      value: function removeNamespaces(ns) {
        var index2 = this.options.ns.indexOf(ns);
        if (index2 > -1) {
          this.options.ns.splice(index2, 1);
        }
      }
    }, {
      key: "getResource",
      value: function getResource(lng, ns, key2) {
        var options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
        var keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
        var ignoreJSONStructure = options.ignoreJSONStructure !== void 0 ? options.ignoreJSONStructure : this.options.ignoreJSONStructure;
        var path2 = [lng, ns];
        if (key2 && typeof key2 !== "string") path2 = path2.concat(key2);
        if (key2 && typeof key2 === "string") path2 = path2.concat(keySeparator ? key2.split(keySeparator) : key2);
        if (lng.indexOf(".") > -1) {
          path2 = lng.split(".");
        }
        var result = getPath(this.data, path2);
        if (result || !ignoreJSONStructure || typeof key2 !== "string") return result;
        return deepFind(this.data && this.data[lng] && this.data[lng][ns], key2, keySeparator);
      }
    }, {
      key: "addResource",
      value: function addResource(lng, ns, key2, value) {
        var options = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : {
          silent: false
        };
        var keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
        var path2 = [lng, ns];
        if (key2) path2 = path2.concat(keySeparator ? key2.split(keySeparator) : key2);
        if (lng.indexOf(".") > -1) {
          path2 = lng.split(".");
          value = ns;
          ns = path2[1];
        }
        this.addNamespaces(ns);
        setPath(this.data, path2, value);
        if (!options.silent) this.emit("added", lng, ns, key2, value);
      }
    }, {
      key: "addResources",
      value: function addResources(lng, ns, resources2) {
        var options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {
          silent: false
        };
        for (var m2 in resources2) {
          if (typeof resources2[m2] === "string" || Object.prototype.toString.apply(resources2[m2]) === "[object Array]") this.addResource(lng, ns, m2, resources2[m2], {
            silent: true
          });
        }
        if (!options.silent) this.emit("added", lng, ns, resources2);
      }
    }, {
      key: "addResourceBundle",
      value: function addResourceBundle(lng, ns, resources2, deep, overwrite) {
        var options = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : {
          silent: false
        };
        var path2 = [lng, ns];
        if (lng.indexOf(".") > -1) {
          path2 = lng.split(".");
          deep = resources2;
          resources2 = ns;
          ns = path2[1];
        }
        this.addNamespaces(ns);
        var pack = getPath(this.data, path2) || {};
        if (deep) {
          deepExtend(pack, resources2, overwrite);
        } else {
          pack = _objectSpread$5(_objectSpread$5({}, pack), resources2);
        }
        setPath(this.data, path2, pack);
        if (!options.silent) this.emit("added", lng, ns, resources2);
      }
    }, {
      key: "removeResourceBundle",
      value: function removeResourceBundle(lng, ns) {
        if (this.hasResourceBundle(lng, ns)) {
          delete this.data[lng][ns];
        }
        this.removeNamespaces(ns);
        this.emit("removed", lng, ns);
      }
    }, {
      key: "hasResourceBundle",
      value: function hasResourceBundle(lng, ns) {
        return this.getResource(lng, ns) !== void 0;
      }
    }, {
      key: "getResourceBundle",
      value: function getResourceBundle(lng, ns) {
        if (!ns) ns = this.options.defaultNS;
        if (this.options.compatibilityAPI === "v1") return _objectSpread$5(_objectSpread$5({}, {}), this.getResource(lng, ns));
        return this.getResource(lng, ns);
      }
    }, {
      key: "getDataByLanguage",
      value: function getDataByLanguage(lng) {
        return this.data[lng];
      }
    }, {
      key: "hasLanguageSomeTranslations",
      value: function hasLanguageSomeTranslations(lng) {
        var data = this.getDataByLanguage(lng);
        var n2 = data && Object.keys(data) || [];
        return !!n2.find(function(v2) {
          return data[v2] && Object.keys(data[v2]).length > 0;
        });
      }
    }, {
      key: "toJSON",
      value: function toJSON() {
        return this.data;
      }
    }]);
    return ResourceStore2;
  }(EventEmitter$1);
  var postProcessor = {
    processors: {},
    addPostProcessor: function addPostProcessor(module) {
      this.processors[module.name] = module;
    },
    handle: function handle(processors, value, key2, options, translator) {
      var _this = this;
      processors.forEach(function(processor) {
        if (_this.processors[processor]) value = _this.processors[processor].process(value, key2, options, translator);
      });
      return value;
    }
  };
  function ownKeys$4(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      enumerableOnly && (symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })), keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread$4(target) {
    for (var i2 = 1; i2 < arguments.length; i2++) {
      var source = null != arguments[i2] ? arguments[i2] : {};
      i2 % 2 ? ownKeys$4(Object(source), true).forEach(function(key2) {
        _defineProperty(target, key2, source[key2]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$4(Object(source)).forEach(function(key2) {
        Object.defineProperty(target, key2, Object.getOwnPropertyDescriptor(source, key2));
      });
    }
    return target;
  }
  function _createSuper$2(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct$2();
    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived), result;
      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;
        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }
      return _possibleConstructorReturn(this, result);
    };
  }
  function _isNativeReflectConstruct$2() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
      return true;
    } catch (e2) {
      return false;
    }
  }
  var checkedLoadedFor = {};
  var Translator = function(_EventEmitter) {
    _inherits(Translator2, _EventEmitter);
    var _super = _createSuper$2(Translator2);
    function Translator2(services) {
      var _this;
      var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      _classCallCheck(this, Translator2);
      _this = _super.call(this);
      if (isIE10) {
        EventEmitter$1.call(_assertThisInitialized(_this));
      }
      copy(["resourceStore", "languageUtils", "pluralResolver", "interpolator", "backendConnector", "i18nFormat", "utils"], services, _assertThisInitialized(_this));
      _this.options = options;
      if (_this.options.keySeparator === void 0) {
        _this.options.keySeparator = ".";
      }
      _this.logger = baseLogger.create("translator");
      return _this;
    }
    _createClass(Translator2, [{
      key: "changeLanguage",
      value: function changeLanguage(lng) {
        if (lng) this.language = lng;
      }
    }, {
      key: "exists",
      value: function exists(key2) {
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
          interpolation: {}
        };
        if (key2 === void 0 || key2 === null) {
          return false;
        }
        var resolved = this.resolve(key2, options);
        return resolved && resolved.res !== void 0;
      }
    }, {
      key: "extractFromKey",
      value: function extractFromKey(key2, options) {
        var nsSeparator = options.nsSeparator !== void 0 ? options.nsSeparator : this.options.nsSeparator;
        if (nsSeparator === void 0) nsSeparator = ":";
        var keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
        var namespaces = options.ns || this.options.defaultNS || [];
        var wouldCheckForNsInKey = nsSeparator && key2.indexOf(nsSeparator) > -1;
        var seemsNaturalLanguage = !this.options.userDefinedKeySeparator && !options.keySeparator && !this.options.userDefinedNsSeparator && !options.nsSeparator && !looksLikeObjectPath(key2, nsSeparator, keySeparator);
        if (wouldCheckForNsInKey && !seemsNaturalLanguage) {
          var m2 = key2.match(this.interpolator.nestingRegexp);
          if (m2 && m2.length > 0) {
            return {
              key: key2,
              namespaces
            };
          }
          var parts = key2.split(nsSeparator);
          if (nsSeparator !== keySeparator || nsSeparator === keySeparator && this.options.ns.indexOf(parts[0]) > -1) namespaces = parts.shift();
          key2 = parts.join(keySeparator);
        }
        if (typeof namespaces === "string") namespaces = [namespaces];
        return {
          key: key2,
          namespaces
        };
      }
    }, {
      key: "translate",
      value: function translate(keys, options, lastKey) {
        var _this2 = this;
        if (_typeof(options) !== "object" && this.options.overloadTranslationOptionHandler) {
          options = this.options.overloadTranslationOptionHandler(arguments);
        }
        if (_typeof(options) === "object") options = _objectSpread$4({}, options);
        if (!options) options = {};
        if (keys === void 0 || keys === null) return "";
        if (!Array.isArray(keys)) keys = [String(keys)];
        var returnDetails = options.returnDetails !== void 0 ? options.returnDetails : this.options.returnDetails;
        var keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
        var _this$extractFromKey = this.extractFromKey(keys[keys.length - 1], options), key2 = _this$extractFromKey.key, namespaces = _this$extractFromKey.namespaces;
        var namespace = namespaces[namespaces.length - 1];
        var lng = options.lng || this.language;
        var appendNamespaceToCIMode = options.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;
        if (lng && lng.toLowerCase() === "cimode") {
          if (appendNamespaceToCIMode) {
            var nsSeparator = options.nsSeparator || this.options.nsSeparator;
            if (returnDetails) {
              return {
                res: "".concat(namespace).concat(nsSeparator).concat(key2),
                usedKey: key2,
                exactUsedKey: key2,
                usedLng: lng,
                usedNS: namespace
              };
            }
            return "".concat(namespace).concat(nsSeparator).concat(key2);
          }
          if (returnDetails) {
            return {
              res: key2,
              usedKey: key2,
              exactUsedKey: key2,
              usedLng: lng,
              usedNS: namespace
            };
          }
          return key2;
        }
        var resolved = this.resolve(keys, options);
        var res = resolved && resolved.res;
        var resUsedKey = resolved && resolved.usedKey || key2;
        var resExactUsedKey = resolved && resolved.exactUsedKey || key2;
        var resType = Object.prototype.toString.apply(res);
        var noObject = ["[object Number]", "[object Function]", "[object RegExp]"];
        var joinArrays = options.joinArrays !== void 0 ? options.joinArrays : this.options.joinArrays;
        var handleAsObjectInI18nFormat = !this.i18nFormat || this.i18nFormat.handleAsObject;
        var handleAsObject = typeof res !== "string" && typeof res !== "boolean" && typeof res !== "number";
        if (handleAsObjectInI18nFormat && res && handleAsObject && noObject.indexOf(resType) < 0 && !(typeof joinArrays === "string" && resType === "[object Array]")) {
          if (!options.returnObjects && !this.options.returnObjects) {
            if (!this.options.returnedObjectHandler) {
              this.logger.warn("accessing an object - but returnObjects options is not enabled!");
            }
            var r2 = this.options.returnedObjectHandler ? this.options.returnedObjectHandler(resUsedKey, res, _objectSpread$4(_objectSpread$4({}, options), {}, {
              ns: namespaces
            })) : "key '".concat(key2, " (").concat(this.language, ")' returned an object instead of string.");
            if (returnDetails) {
              resolved.res = r2;
              return resolved;
            }
            return r2;
          }
          if (keySeparator) {
            var resTypeIsArray = resType === "[object Array]";
            var copy2 = resTypeIsArray ? [] : {};
            var newKeyToUse = resTypeIsArray ? resExactUsedKey : resUsedKey;
            for (var m2 in res) {
              if (Object.prototype.hasOwnProperty.call(res, m2)) {
                var deepKey = "".concat(newKeyToUse).concat(keySeparator).concat(m2);
                copy2[m2] = this.translate(deepKey, _objectSpread$4(_objectSpread$4({}, options), {
                  joinArrays: false,
                  ns: namespaces
                }));
                if (copy2[m2] === deepKey) copy2[m2] = res[m2];
              }
            }
            res = copy2;
          }
        } else if (handleAsObjectInI18nFormat && typeof joinArrays === "string" && resType === "[object Array]") {
          res = res.join(joinArrays);
          if (res) res = this.extendTranslation(res, keys, options, lastKey);
        } else {
          var usedDefault = false;
          var usedKey = false;
          var needsPluralHandling = options.count !== void 0 && typeof options.count !== "string";
          var hasDefaultValue = Translator2.hasDefaultValue(options);
          var defaultValueSuffix = needsPluralHandling ? this.pluralResolver.getSuffix(lng, options.count, options) : "";
          var defaultValue = options["defaultValue".concat(defaultValueSuffix)] || options.defaultValue;
          if (!this.isValidLookup(res) && hasDefaultValue) {
            usedDefault = true;
            res = defaultValue;
          }
          if (!this.isValidLookup(res)) {
            usedKey = true;
            res = key2;
          }
          var missingKeyNoValueFallbackToKey = options.missingKeyNoValueFallbackToKey || this.options.missingKeyNoValueFallbackToKey;
          var resForMissing = missingKeyNoValueFallbackToKey && usedKey ? void 0 : res;
          var updateMissing = hasDefaultValue && defaultValue !== res && this.options.updateMissing;
          if (usedKey || usedDefault || updateMissing) {
            this.logger.log(updateMissing ? "updateKey" : "missingKey", lng, namespace, key2, updateMissing ? defaultValue : res);
            if (keySeparator) {
              var fk = this.resolve(key2, _objectSpread$4(_objectSpread$4({}, options), {}, {
                keySeparator: false
              }));
              if (fk && fk.res) this.logger.warn("Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.");
            }
            var lngs = [];
            var fallbackLngs = this.languageUtils.getFallbackCodes(this.options.fallbackLng, options.lng || this.language);
            if (this.options.saveMissingTo === "fallback" && fallbackLngs && fallbackLngs[0]) {
              for (var i2 = 0; i2 < fallbackLngs.length; i2++) {
                lngs.push(fallbackLngs[i2]);
              }
            } else if (this.options.saveMissingTo === "all") {
              lngs = this.languageUtils.toResolveHierarchy(options.lng || this.language);
            } else {
              lngs.push(options.lng || this.language);
            }
            var send = function send2(l2, k2, specificDefaultValue) {
              var defaultForMissing = hasDefaultValue && specificDefaultValue !== res ? specificDefaultValue : resForMissing;
              if (_this2.options.missingKeyHandler) {
                _this2.options.missingKeyHandler(l2, namespace, k2, defaultForMissing, updateMissing, options);
              } else if (_this2.backendConnector && _this2.backendConnector.saveMissing) {
                _this2.backendConnector.saveMissing(l2, namespace, k2, defaultForMissing, updateMissing, options);
              }
              _this2.emit("missingKey", l2, namespace, k2, res);
            };
            if (this.options.saveMissing) {
              if (this.options.saveMissingPlurals && needsPluralHandling) {
                lngs.forEach(function(language) {
                  _this2.pluralResolver.getSuffixes(language, options).forEach(function(suffix) {
                    send([language], key2 + suffix, options["defaultValue".concat(suffix)] || defaultValue);
                  });
                });
              } else {
                send(lngs, key2, defaultValue);
              }
            }
          }
          res = this.extendTranslation(res, keys, options, resolved, lastKey);
          if (usedKey && res === key2 && this.options.appendNamespaceToMissingKey) res = "".concat(namespace, ":").concat(key2);
          if ((usedKey || usedDefault) && this.options.parseMissingKeyHandler) {
            if (this.options.compatibilityAPI !== "v1") {
              res = this.options.parseMissingKeyHandler(this.options.appendNamespaceToMissingKey ? "".concat(namespace, ":").concat(key2) : key2, usedDefault ? res : void 0);
            } else {
              res = this.options.parseMissingKeyHandler(res);
            }
          }
        }
        if (returnDetails) {
          resolved.res = res;
          return resolved;
        }
        return res;
      }
    }, {
      key: "extendTranslation",
      value: function extendTranslation(res, key2, options, resolved, lastKey) {
        var _this3 = this;
        if (this.i18nFormat && this.i18nFormat.parse) {
          res = this.i18nFormat.parse(res, _objectSpread$4(_objectSpread$4({}, this.options.interpolation.defaultVariables), options), resolved.usedLng, resolved.usedNS, resolved.usedKey, {
            resolved
          });
        } else if (!options.skipInterpolation) {
          if (options.interpolation) this.interpolator.init(_objectSpread$4(_objectSpread$4({}, options), {
            interpolation: _objectSpread$4(_objectSpread$4({}, this.options.interpolation), options.interpolation)
          }));
          var skipOnVariables = typeof res === "string" && (options && options.interpolation && options.interpolation.skipOnVariables !== void 0 ? options.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables);
          var nestBef;
          if (skipOnVariables) {
            var nb = res.match(this.interpolator.nestingRegexp);
            nestBef = nb && nb.length;
          }
          var data = options.replace && typeof options.replace !== "string" ? options.replace : options;
          if (this.options.interpolation.defaultVariables) data = _objectSpread$4(_objectSpread$4({}, this.options.interpolation.defaultVariables), data);
          res = this.interpolator.interpolate(res, data, options.lng || this.language, options);
          if (skipOnVariables) {
            var na = res.match(this.interpolator.nestingRegexp);
            var nestAft = na && na.length;
            if (nestBef < nestAft) options.nest = false;
          }
          if (!options.lng && this.options.compatibilityAPI !== "v1" && resolved && resolved.res) options.lng = resolved.usedLng;
          if (options.nest !== false) res = this.interpolator.nest(res, function() {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }
            if (lastKey && lastKey[0] === args[0] && !options.context) {
              _this3.logger.warn("It seems you are nesting recursively key: ".concat(args[0], " in key: ").concat(key2[0]));
              return null;
            }
            return _this3.translate.apply(_this3, args.concat([key2]));
          }, options);
          if (options.interpolation) this.interpolator.reset();
        }
        var postProcess = options.postProcess || this.options.postProcess;
        var postProcessorNames = typeof postProcess === "string" ? [postProcess] : postProcess;
        if (res !== void 0 && res !== null && postProcessorNames && postProcessorNames.length && options.applyPostProcessor !== false) {
          res = postProcessor.handle(postProcessorNames, res, key2, this.options && this.options.postProcessPassResolved ? _objectSpread$4({
            i18nResolved: resolved
          }, options) : options, this);
        }
        return res;
      }
    }, {
      key: "resolve",
      value: function resolve(keys) {
        var _this4 = this;
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var found;
        var usedKey;
        var exactUsedKey;
        var usedLng;
        var usedNS;
        if (typeof keys === "string") keys = [keys];
        keys.forEach(function(k2) {
          if (_this4.isValidLookup(found)) return;
          var extracted = _this4.extractFromKey(k2, options);
          var key2 = extracted.key;
          usedKey = key2;
          var namespaces = extracted.namespaces;
          if (_this4.options.fallbackNS) namespaces = namespaces.concat(_this4.options.fallbackNS);
          var needsPluralHandling = options.count !== void 0 && typeof options.count !== "string";
          var needsZeroSuffixLookup = needsPluralHandling && !options.ordinal && options.count === 0 && _this4.pluralResolver.shouldUseIntlApi();
          var needsContextHandling = options.context !== void 0 && (typeof options.context === "string" || typeof options.context === "number") && options.context !== "";
          var codes = options.lngs ? options.lngs : _this4.languageUtils.toResolveHierarchy(options.lng || _this4.language, options.fallbackLng);
          namespaces.forEach(function(ns) {
            if (_this4.isValidLookup(found)) return;
            usedNS = ns;
            if (!checkedLoadedFor["".concat(codes[0], "-").concat(ns)] && _this4.utils && _this4.utils.hasLoadedNamespace && !_this4.utils.hasLoadedNamespace(usedNS)) {
              checkedLoadedFor["".concat(codes[0], "-").concat(ns)] = true;
              _this4.logger.warn('key "'.concat(usedKey, '" for languages "').concat(codes.join(", "), `" won't get resolved as namespace "`).concat(usedNS, '" was not yet loaded'), "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
            }
            codes.forEach(function(code2) {
              if (_this4.isValidLookup(found)) return;
              usedLng = code2;
              var finalKeys = [key2];
              if (_this4.i18nFormat && _this4.i18nFormat.addLookupKeys) {
                _this4.i18nFormat.addLookupKeys(finalKeys, key2, code2, ns, options);
              } else {
                var pluralSuffix;
                if (needsPluralHandling) pluralSuffix = _this4.pluralResolver.getSuffix(code2, options.count, options);
                var zeroSuffix = "".concat(_this4.options.pluralSeparator, "zero");
                if (needsPluralHandling) {
                  finalKeys.push(key2 + pluralSuffix);
                  if (needsZeroSuffixLookup) {
                    finalKeys.push(key2 + zeroSuffix);
                  }
                }
                if (needsContextHandling) {
                  var contextKey = "".concat(key2).concat(_this4.options.contextSeparator).concat(options.context);
                  finalKeys.push(contextKey);
                  if (needsPluralHandling) {
                    finalKeys.push(contextKey + pluralSuffix);
                    if (needsZeroSuffixLookup) {
                      finalKeys.push(contextKey + zeroSuffix);
                    }
                  }
                }
              }
              var possibleKey;
              while (possibleKey = finalKeys.pop()) {
                if (!_this4.isValidLookup(found)) {
                  exactUsedKey = possibleKey;
                  found = _this4.getResource(code2, ns, possibleKey, options);
                }
              }
            });
          });
        });
        return {
          res: found,
          usedKey,
          exactUsedKey,
          usedLng,
          usedNS
        };
      }
    }, {
      key: "isValidLookup",
      value: function isValidLookup(res) {
        return res !== void 0 && !(!this.options.returnNull && res === null) && !(!this.options.returnEmptyString && res === "");
      }
    }, {
      key: "getResource",
      value: function getResource(code2, ns, key2) {
        var options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
        if (this.i18nFormat && this.i18nFormat.getResource) return this.i18nFormat.getResource(code2, ns, key2, options);
        return this.resourceStore.getResource(code2, ns, key2, options);
      }
    }], [{
      key: "hasDefaultValue",
      value: function hasDefaultValue(options) {
        var prefix = "defaultValue";
        for (var option2 in options) {
          if (Object.prototype.hasOwnProperty.call(options, option2) && prefix === option2.substring(0, prefix.length) && void 0 !== options[option2]) {
            return true;
          }
        }
        return false;
      }
    }]);
    return Translator2;
  }(EventEmitter$1);
  function capitalize(string2) {
    return string2.charAt(0).toUpperCase() + string2.slice(1);
  }
  var LanguageUtil = function() {
    function LanguageUtil2(options) {
      _classCallCheck(this, LanguageUtil2);
      this.options = options;
      this.supportedLngs = this.options.supportedLngs || false;
      this.logger = baseLogger.create("languageUtils");
    }
    _createClass(LanguageUtil2, [{
      key: "getScriptPartFromCode",
      value: function getScriptPartFromCode(code2) {
        if (!code2 || code2.indexOf("-") < 0) return null;
        var p2 = code2.split("-");
        if (p2.length === 2) return null;
        p2.pop();
        if (p2[p2.length - 1].toLowerCase() === "x") return null;
        return this.formatLanguageCode(p2.join("-"));
      }
    }, {
      key: "getLanguagePartFromCode",
      value: function getLanguagePartFromCode(code2) {
        if (!code2 || code2.indexOf("-") < 0) return code2;
        var p2 = code2.split("-");
        return this.formatLanguageCode(p2[0]);
      }
    }, {
      key: "formatLanguageCode",
      value: function formatLanguageCode(code2) {
        if (typeof code2 === "string" && code2.indexOf("-") > -1) {
          var specialCases = ["hans", "hant", "latn", "cyrl", "cans", "mong", "arab"];
          var p2 = code2.split("-");
          if (this.options.lowerCaseLng) {
            p2 = p2.map(function(part) {
              return part.toLowerCase();
            });
          } else if (p2.length === 2) {
            p2[0] = p2[0].toLowerCase();
            p2[1] = p2[1].toUpperCase();
            if (specialCases.indexOf(p2[1].toLowerCase()) > -1) p2[1] = capitalize(p2[1].toLowerCase());
          } else if (p2.length === 3) {
            p2[0] = p2[0].toLowerCase();
            if (p2[1].length === 2) p2[1] = p2[1].toUpperCase();
            if (p2[0] !== "sgn" && p2[2].length === 2) p2[2] = p2[2].toUpperCase();
            if (specialCases.indexOf(p2[1].toLowerCase()) > -1) p2[1] = capitalize(p2[1].toLowerCase());
            if (specialCases.indexOf(p2[2].toLowerCase()) > -1) p2[2] = capitalize(p2[2].toLowerCase());
          }
          return p2.join("-");
        }
        return this.options.cleanCode || this.options.lowerCaseLng ? code2.toLowerCase() : code2;
      }
    }, {
      key: "isSupportedCode",
      value: function isSupportedCode(code2) {
        if (this.options.load === "languageOnly" || this.options.nonExplicitSupportedLngs) {
          code2 = this.getLanguagePartFromCode(code2);
        }
        return !this.supportedLngs || !this.supportedLngs.length || this.supportedLngs.indexOf(code2) > -1;
      }
    }, {
      key: "getBestMatchFromCodes",
      value: function getBestMatchFromCodes(codes) {
        var _this = this;
        if (!codes) return null;
        var found;
        codes.forEach(function(code2) {
          if (found) return;
          var cleanedLng = _this.formatLanguageCode(code2);
          if (!_this.options.supportedLngs || _this.isSupportedCode(cleanedLng)) found = cleanedLng;
        });
        if (!found && this.options.supportedLngs) {
          codes.forEach(function(code2) {
            if (found) return;
            var lngOnly = _this.getLanguagePartFromCode(code2);
            if (_this.isSupportedCode(lngOnly)) return found = lngOnly;
            found = _this.options.supportedLngs.find(function(supportedLng) {
              if (supportedLng === lngOnly) return supportedLng;
              if (supportedLng.indexOf("-") < 0 && lngOnly.indexOf("-") < 0) return;
              if (supportedLng.indexOf(lngOnly) === 0) return supportedLng;
            });
          });
        }
        if (!found) found = this.getFallbackCodes(this.options.fallbackLng)[0];
        return found;
      }
    }, {
      key: "getFallbackCodes",
      value: function getFallbackCodes(fallbacks, code2) {
        if (!fallbacks) return [];
        if (typeof fallbacks === "function") fallbacks = fallbacks(code2);
        if (typeof fallbacks === "string") fallbacks = [fallbacks];
        if (Object.prototype.toString.apply(fallbacks) === "[object Array]") return fallbacks;
        if (!code2) return fallbacks["default"] || [];
        var found = fallbacks[code2];
        if (!found) found = fallbacks[this.getScriptPartFromCode(code2)];
        if (!found) found = fallbacks[this.formatLanguageCode(code2)];
        if (!found) found = fallbacks[this.getLanguagePartFromCode(code2)];
        if (!found) found = fallbacks["default"];
        return found || [];
      }
    }, {
      key: "toResolveHierarchy",
      value: function toResolveHierarchy(code2, fallbackCode) {
        var _this2 = this;
        var fallbackCodes = this.getFallbackCodes(fallbackCode || this.options.fallbackLng || [], code2);
        var codes = [];
        var addCode = function addCode2(c2) {
          if (!c2) return;
          if (_this2.isSupportedCode(c2)) {
            codes.push(c2);
          } else {
            _this2.logger.warn("rejecting language code not found in supportedLngs: ".concat(c2));
          }
        };
        if (typeof code2 === "string" && code2.indexOf("-") > -1) {
          if (this.options.load !== "languageOnly") addCode(this.formatLanguageCode(code2));
          if (this.options.load !== "languageOnly" && this.options.load !== "currentOnly") addCode(this.getScriptPartFromCode(code2));
          if (this.options.load !== "currentOnly") addCode(this.getLanguagePartFromCode(code2));
        } else if (typeof code2 === "string") {
          addCode(this.formatLanguageCode(code2));
        }
        fallbackCodes.forEach(function(fc) {
          if (codes.indexOf(fc) < 0) addCode(_this2.formatLanguageCode(fc));
        });
        return codes;
      }
    }]);
    return LanguageUtil2;
  }();
  var sets = [{
    lngs: ["ach", "ak", "am", "arn", "br", "fil", "gun", "ln", "mfe", "mg", "mi", "oc", "pt", "pt-BR", "tg", "tl", "ti", "tr", "uz", "wa"],
    nr: [1, 2],
    fc: 1
  }, {
    lngs: ["af", "an", "ast", "az", "bg", "bn", "ca", "da", "de", "dev", "el", "en", "eo", "es", "et", "eu", "fi", "fo", "fur", "fy", "gl", "gu", "ha", "hi", "hu", "hy", "ia", "it", "kk", "kn", "ku", "lb", "mai", "ml", "mn", "mr", "nah", "nap", "nb", "ne", "nl", "nn", "no", "nso", "pa", "pap", "pms", "ps", "pt-PT", "rm", "sco", "se", "si", "so", "son", "sq", "sv", "sw", "ta", "te", "tk", "ur", "yo"],
    nr: [1, 2],
    fc: 2
  }, {
    lngs: ["ay", "bo", "cgg", "fa", "ht", "id", "ja", "jbo", "ka", "km", "ko", "ky", "lo", "ms", "sah", "su", "th", "tt", "ug", "vi", "wo", "zh"],
    nr: [1],
    fc: 3
  }, {
    lngs: ["be", "bs", "cnr", "dz", "hr", "ru", "sr", "uk"],
    nr: [1, 2, 5],
    fc: 4
  }, {
    lngs: ["ar"],
    nr: [0, 1, 2, 3, 11, 100],
    fc: 5
  }, {
    lngs: ["cs", "sk"],
    nr: [1, 2, 5],
    fc: 6
  }, {
    lngs: ["csb", "pl"],
    nr: [1, 2, 5],
    fc: 7
  }, {
    lngs: ["cy"],
    nr: [1, 2, 3, 8],
    fc: 8
  }, {
    lngs: ["fr"],
    nr: [1, 2],
    fc: 9
  }, {
    lngs: ["ga"],
    nr: [1, 2, 3, 7, 11],
    fc: 10
  }, {
    lngs: ["gd"],
    nr: [1, 2, 3, 20],
    fc: 11
  }, {
    lngs: ["is"],
    nr: [1, 2],
    fc: 12
  }, {
    lngs: ["jv"],
    nr: [0, 1],
    fc: 13
  }, {
    lngs: ["kw"],
    nr: [1, 2, 3, 4],
    fc: 14
  }, {
    lngs: ["lt"],
    nr: [1, 2, 10],
    fc: 15
  }, {
    lngs: ["lv"],
    nr: [1, 2, 0],
    fc: 16
  }, {
    lngs: ["mk"],
    nr: [1, 2],
    fc: 17
  }, {
    lngs: ["mnk"],
    nr: [0, 1, 2],
    fc: 18
  }, {
    lngs: ["mt"],
    nr: [1, 2, 11, 20],
    fc: 19
  }, {
    lngs: ["or"],
    nr: [2, 1],
    fc: 2
  }, {
    lngs: ["ro"],
    nr: [1, 2, 20],
    fc: 20
  }, {
    lngs: ["sl"],
    nr: [5, 1, 2, 3],
    fc: 21
  }, {
    lngs: ["he", "iw"],
    nr: [1, 2, 20, 21],
    fc: 22
  }];
  var _rulesPluralsTypes = {
    1: function _2(n2) {
      return Number(n2 > 1);
    },
    2: function _3(n2) {
      return Number(n2 != 1);
    },
    3: function _4(n2) {
      return 0;
    },
    4: function _5(n2) {
      return Number(n2 % 10 == 1 && n2 % 100 != 11 ? 0 : n2 % 10 >= 2 && n2 % 10 <= 4 && (n2 % 100 < 10 || n2 % 100 >= 20) ? 1 : 2);
    },
    5: function _6(n2) {
      return Number(n2 == 0 ? 0 : n2 == 1 ? 1 : n2 == 2 ? 2 : n2 % 100 >= 3 && n2 % 100 <= 10 ? 3 : n2 % 100 >= 11 ? 4 : 5);
    },
    6: function _7(n2) {
      return Number(n2 == 1 ? 0 : n2 >= 2 && n2 <= 4 ? 1 : 2);
    },
    7: function _8(n2) {
      return Number(n2 == 1 ? 0 : n2 % 10 >= 2 && n2 % 10 <= 4 && (n2 % 100 < 10 || n2 % 100 >= 20) ? 1 : 2);
    },
    8: function _9(n2) {
      return Number(n2 == 1 ? 0 : n2 == 2 ? 1 : n2 != 8 && n2 != 11 ? 2 : 3);
    },
    9: function _10(n2) {
      return Number(n2 >= 2);
    },
    10: function _11(n2) {
      return Number(n2 == 1 ? 0 : n2 == 2 ? 1 : n2 < 7 ? 2 : n2 < 11 ? 3 : 4);
    },
    11: function _12(n2) {
      return Number(n2 == 1 || n2 == 11 ? 0 : n2 == 2 || n2 == 12 ? 1 : n2 > 2 && n2 < 20 ? 2 : 3);
    },
    12: function _13(n2) {
      return Number(n2 % 10 != 1 || n2 % 100 == 11);
    },
    13: function _14(n2) {
      return Number(n2 !== 0);
    },
    14: function _15(n2) {
      return Number(n2 == 1 ? 0 : n2 == 2 ? 1 : n2 == 3 ? 2 : 3);
    },
    15: function _16(n2) {
      return Number(n2 % 10 == 1 && n2 % 100 != 11 ? 0 : n2 % 10 >= 2 && (n2 % 100 < 10 || n2 % 100 >= 20) ? 1 : 2);
    },
    16: function _17(n2) {
      return Number(n2 % 10 == 1 && n2 % 100 != 11 ? 0 : n2 !== 0 ? 1 : 2);
    },
    17: function _18(n2) {
      return Number(n2 == 1 || n2 % 10 == 1 && n2 % 100 != 11 ? 0 : 1);
    },
    18: function _19(n2) {
      return Number(n2 == 0 ? 0 : n2 == 1 ? 1 : 2);
    },
    19: function _20(n2) {
      return Number(n2 == 1 ? 0 : n2 == 0 || n2 % 100 > 1 && n2 % 100 < 11 ? 1 : n2 % 100 > 10 && n2 % 100 < 20 ? 2 : 3);
    },
    20: function _21(n2) {
      return Number(n2 == 1 ? 0 : n2 == 0 || n2 % 100 > 0 && n2 % 100 < 20 ? 1 : 2);
    },
    21: function _22(n2) {
      return Number(n2 % 100 == 1 ? 1 : n2 % 100 == 2 ? 2 : n2 % 100 == 3 || n2 % 100 == 4 ? 3 : 0);
    },
    22: function _23(n2) {
      return Number(n2 == 1 ? 0 : n2 == 2 ? 1 : (n2 < 0 || n2 > 10) && n2 % 10 == 0 ? 2 : 3);
    }
  };
  var deprecatedJsonVersions = ["v1", "v2", "v3"];
  var suffixesOrder = {
    zero: 0,
    one: 1,
    two: 2,
    few: 3,
    many: 4,
    other: 5
  };
  function createRules() {
    var rules = {};
    sets.forEach(function(set) {
      set.lngs.forEach(function(l2) {
        rules[l2] = {
          numbers: set.nr,
          plurals: _rulesPluralsTypes[set.fc]
        };
      });
    });
    return rules;
  }
  var PluralResolver = function() {
    function PluralResolver2(languageUtils) {
      var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      _classCallCheck(this, PluralResolver2);
      this.languageUtils = languageUtils;
      this.options = options;
      this.logger = baseLogger.create("pluralResolver");
      if ((!this.options.compatibilityJSON || this.options.compatibilityJSON === "v4") && (typeof Intl === "undefined" || !Intl.PluralRules)) {
        this.options.compatibilityJSON = "v3";
        this.logger.error("Your environment seems not to be Intl API compatible, use an Intl.PluralRules polyfill. Will fallback to the compatibilityJSON v3 format handling.");
      }
      this.rules = createRules();
    }
    _createClass(PluralResolver2, [{
      key: "addRule",
      value: function addRule(lng, obj) {
        this.rules[lng] = obj;
      }
    }, {
      key: "getRule",
      value: function getRule(code2) {
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        if (this.shouldUseIntlApi()) {
          try {
            return new Intl.PluralRules(code2, {
              type: options.ordinal ? "ordinal" : "cardinal"
            });
          } catch (_unused) {
            return;
          }
        }
        return this.rules[code2] || this.rules[this.languageUtils.getLanguagePartFromCode(code2)];
      }
    }, {
      key: "needsPlural",
      value: function needsPlural(code2) {
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var rule = this.getRule(code2, options);
        if (this.shouldUseIntlApi()) {
          return rule && rule.resolvedOptions().pluralCategories.length > 1;
        }
        return rule && rule.numbers.length > 1;
      }
    }, {
      key: "getPluralFormsOfKey",
      value: function getPluralFormsOfKey(code2, key2) {
        var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
        return this.getSuffixes(code2, options).map(function(suffix) {
          return "".concat(key2).concat(suffix);
        });
      }
    }, {
      key: "getSuffixes",
      value: function getSuffixes(code2) {
        var _this = this;
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var rule = this.getRule(code2, options);
        if (!rule) {
          return [];
        }
        if (this.shouldUseIntlApi()) {
          return rule.resolvedOptions().pluralCategories.sort(function(pluralCategory1, pluralCategory2) {
            return suffixesOrder[pluralCategory1] - suffixesOrder[pluralCategory2];
          }).map(function(pluralCategory) {
            return "".concat(_this.options.prepend).concat(pluralCategory);
          });
        }
        return rule.numbers.map(function(number2) {
          return _this.getSuffix(code2, number2, options);
        });
      }
    }, {
      key: "getSuffix",
      value: function getSuffix(code2, count2) {
        var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
        var rule = this.getRule(code2, options);
        if (rule) {
          if (this.shouldUseIntlApi()) {
            return "".concat(this.options.prepend).concat(rule.select(count2));
          }
          return this.getSuffixRetroCompatible(rule, count2);
        }
        this.logger.warn("no plural rule found for: ".concat(code2));
        return "";
      }
    }, {
      key: "getSuffixRetroCompatible",
      value: function getSuffixRetroCompatible(rule, count2) {
        var _this2 = this;
        var idx = rule.noAbs ? rule.plurals(count2) : rule.plurals(Math.abs(count2));
        var suffix = rule.numbers[idx];
        if (this.options.simplifyPluralSuffix && rule.numbers.length === 2 && rule.numbers[0] === 1) {
          if (suffix === 2) {
            suffix = "plural";
          } else if (suffix === 1) {
            suffix = "";
          }
        }
        var returnSuffix = function returnSuffix2() {
          return _this2.options.prepend && suffix.toString() ? _this2.options.prepend + suffix.toString() : suffix.toString();
        };
        if (this.options.compatibilityJSON === "v1") {
          if (suffix === 1) return "";
          if (typeof suffix === "number") return "_plural_".concat(suffix.toString());
          return returnSuffix();
        } else if (this.options.compatibilityJSON === "v2") {
          return returnSuffix();
        } else if (this.options.simplifyPluralSuffix && rule.numbers.length === 2 && rule.numbers[0] === 1) {
          return returnSuffix();
        }
        return this.options.prepend && idx.toString() ? this.options.prepend + idx.toString() : idx.toString();
      }
    }, {
      key: "shouldUseIntlApi",
      value: function shouldUseIntlApi() {
        return !deprecatedJsonVersions.includes(this.options.compatibilityJSON);
      }
    }]);
    return PluralResolver2;
  }();
  function ownKeys$3(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      enumerableOnly && (symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })), keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread$3(target) {
    for (var i2 = 1; i2 < arguments.length; i2++) {
      var source = null != arguments[i2] ? arguments[i2] : {};
      i2 % 2 ? ownKeys$3(Object(source), true).forEach(function(key2) {
        _defineProperty(target, key2, source[key2]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$3(Object(source)).forEach(function(key2) {
        Object.defineProperty(target, key2, Object.getOwnPropertyDescriptor(source, key2));
      });
    }
    return target;
  }
  function deepFindWithDefaults(data, defaultData, key2) {
    var keySeparator = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : ".";
    var ignoreJSONStructure = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : true;
    var path2 = getPathWithDefaults(data, defaultData, key2);
    if (!path2 && ignoreJSONStructure && typeof key2 === "string") {
      path2 = deepFind(data, key2, keySeparator);
      if (path2 === void 0) path2 = deepFind(defaultData, key2, keySeparator);
    }
    return path2;
  }
  var Interpolator = function() {
    function Interpolator2() {
      var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      _classCallCheck(this, Interpolator2);
      this.logger = baseLogger.create("interpolator");
      this.options = options;
      this.format = options.interpolation && options.interpolation.format || function(value) {
        return value;
      };
      this.init(options);
    }
    _createClass(Interpolator2, [{
      key: "init",
      value: function init2() {
        var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
        if (!options.interpolation) options.interpolation = {
          escapeValue: true
        };
        var iOpts = options.interpolation;
        this.escape = iOpts.escape !== void 0 ? iOpts.escape : escape;
        this.escapeValue = iOpts.escapeValue !== void 0 ? iOpts.escapeValue : true;
        this.useRawValueToEscape = iOpts.useRawValueToEscape !== void 0 ? iOpts.useRawValueToEscape : false;
        this.prefix = iOpts.prefix ? regexEscape(iOpts.prefix) : iOpts.prefixEscaped || "{{";
        this.suffix = iOpts.suffix ? regexEscape(iOpts.suffix) : iOpts.suffixEscaped || "}}";
        this.formatSeparator = iOpts.formatSeparator ? iOpts.formatSeparator : iOpts.formatSeparator || ",";
        this.unescapePrefix = iOpts.unescapeSuffix ? "" : iOpts.unescapePrefix || "-";
        this.unescapeSuffix = this.unescapePrefix ? "" : iOpts.unescapeSuffix || "";
        this.nestingPrefix = iOpts.nestingPrefix ? regexEscape(iOpts.nestingPrefix) : iOpts.nestingPrefixEscaped || regexEscape("$t(");
        this.nestingSuffix = iOpts.nestingSuffix ? regexEscape(iOpts.nestingSuffix) : iOpts.nestingSuffixEscaped || regexEscape(")");
        this.nestingOptionsSeparator = iOpts.nestingOptionsSeparator ? iOpts.nestingOptionsSeparator : iOpts.nestingOptionsSeparator || ",";
        this.maxReplaces = iOpts.maxReplaces ? iOpts.maxReplaces : 1e3;
        this.alwaysFormat = iOpts.alwaysFormat !== void 0 ? iOpts.alwaysFormat : false;
        this.resetRegExp();
      }
    }, {
      key: "reset",
      value: function reset() {
        if (this.options) this.init(this.options);
      }
    }, {
      key: "resetRegExp",
      value: function resetRegExp() {
        var regexpStr = "".concat(this.prefix, "(.+?)").concat(this.suffix);
        this.regexp = new RegExp(regexpStr, "g");
        var regexpUnescapeStr = "".concat(this.prefix).concat(this.unescapePrefix, "(.+?)").concat(this.unescapeSuffix).concat(this.suffix);
        this.regexpUnescape = new RegExp(regexpUnescapeStr, "g");
        var nestingRegexpStr = "".concat(this.nestingPrefix, "(.+?)").concat(this.nestingSuffix);
        this.nestingRegexp = new RegExp(nestingRegexpStr, "g");
      }
    }, {
      key: "interpolate",
      value: function interpolate(str, data, lng, options) {
        var _this = this;
        var match;
        var value;
        var replaces;
        var defaultData = this.options && this.options.interpolation && this.options.interpolation.defaultVariables || {};
        function regexSafe(val) {
          return val.replace(/\$/g, "$$$$");
        }
        var handleFormat = function handleFormat2(key2) {
          if (key2.indexOf(_this.formatSeparator) < 0) {
            var path2 = deepFindWithDefaults(data, defaultData, key2, _this.options.keySeparator, _this.options.ignoreJSONStructure);
            return _this.alwaysFormat ? _this.format(path2, void 0, lng, _objectSpread$3(_objectSpread$3(_objectSpread$3({}, options), data), {}, {
              interpolationkey: key2
            })) : path2;
          }
          var p2 = key2.split(_this.formatSeparator);
          var k2 = p2.shift().trim();
          var f2 = p2.join(_this.formatSeparator).trim();
          return _this.format(deepFindWithDefaults(data, defaultData, k2, _this.options.keySeparator, _this.options.ignoreJSONStructure), f2, lng, _objectSpread$3(_objectSpread$3(_objectSpread$3({}, options), data), {}, {
            interpolationkey: k2
          }));
        };
        this.resetRegExp();
        var missingInterpolationHandler = options && options.missingInterpolationHandler || this.options.missingInterpolationHandler;
        var skipOnVariables = options && options.interpolation && options.interpolation.skipOnVariables !== void 0 ? options.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables;
        var todos = [{
          regex: this.regexpUnescape,
          safeValue: function safeValue(val) {
            return regexSafe(val);
          }
        }, {
          regex: this.regexp,
          safeValue: function safeValue(val) {
            return _this.escapeValue ? regexSafe(_this.escape(val)) : regexSafe(val);
          }
        }];
        todos.forEach(function(todo) {
          replaces = 0;
          while (match = todo.regex.exec(str)) {
            var matchedVar = match[1].trim();
            value = handleFormat(matchedVar);
            if (value === void 0) {
              if (typeof missingInterpolationHandler === "function") {
                var temp = missingInterpolationHandler(str, match, options);
                value = typeof temp === "string" ? temp : "";
              } else if (options && Object.prototype.hasOwnProperty.call(options, matchedVar)) {
                value = "";
              } else if (skipOnVariables) {
                value = match[0];
                continue;
              } else {
                _this.logger.warn("missed to pass in variable ".concat(matchedVar, " for interpolating ").concat(str));
                value = "";
              }
            } else if (typeof value !== "string" && !_this.useRawValueToEscape) {
              value = makeString(value);
            }
            var safeValue = todo.safeValue(value);
            str = str.replace(match[0], safeValue);
            if (skipOnVariables) {
              todo.regex.lastIndex += value.length;
              todo.regex.lastIndex -= match[0].length;
            } else {
              todo.regex.lastIndex = 0;
            }
            replaces++;
            if (replaces >= _this.maxReplaces) {
              break;
            }
          }
        });
        return str;
      }
    }, {
      key: "nest",
      value: function nest(str, fc) {
        var _this2 = this;
        var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
        var match;
        var value;
        var clonedOptions;
        function handleHasOptions(key2, inheritedOptions) {
          var sep = this.nestingOptionsSeparator;
          if (key2.indexOf(sep) < 0) return key2;
          var c2 = key2.split(new RegExp("".concat(sep, "[ ]*{")));
          var optionsString = "{".concat(c2[1]);
          key2 = c2[0];
          optionsString = this.interpolate(optionsString, clonedOptions);
          var matchedSingleQuotes = optionsString.match(/'/g);
          var matchedDoubleQuotes = optionsString.match(/"/g);
          if (matchedSingleQuotes && matchedSingleQuotes.length % 2 === 0 && !matchedDoubleQuotes || matchedDoubleQuotes.length % 2 !== 0) {
            optionsString = optionsString.replace(/'/g, '"');
          }
          try {
            clonedOptions = JSON.parse(optionsString);
            if (inheritedOptions) clonedOptions = _objectSpread$3(_objectSpread$3({}, inheritedOptions), clonedOptions);
          } catch (e2) {
            this.logger.warn("failed parsing options string in nesting for key ".concat(key2), e2);
            return "".concat(key2).concat(sep).concat(optionsString);
          }
          delete clonedOptions.defaultValue;
          return key2;
        }
        while (match = this.nestingRegexp.exec(str)) {
          var formatters = [];
          clonedOptions = _objectSpread$3({}, options);
          clonedOptions = clonedOptions.replace && typeof clonedOptions.replace !== "string" ? clonedOptions.replace : clonedOptions;
          clonedOptions.applyPostProcessor = false;
          delete clonedOptions.defaultValue;
          var doReduce = false;
          if (match[0].indexOf(this.formatSeparator) !== -1 && !/{.*}/.test(match[1])) {
            var r2 = match[1].split(this.formatSeparator).map(function(elem) {
              return elem.trim();
            });
            match[1] = r2.shift();
            formatters = r2;
            doReduce = true;
          }
          value = fc(handleHasOptions.call(this, match[1].trim(), clonedOptions), clonedOptions);
          if (value && match[0] === str && typeof value !== "string") return value;
          if (typeof value !== "string") value = makeString(value);
          if (!value) {
            this.logger.warn("missed to resolve ".concat(match[1], " for nesting ").concat(str));
            value = "";
          }
          if (doReduce) {
            value = formatters.reduce(function(v2, f2) {
              return _this2.format(v2, f2, options.lng, _objectSpread$3(_objectSpread$3({}, options), {}, {
                interpolationkey: match[1].trim()
              }));
            }, value.trim());
          }
          str = str.replace(match[0], value);
          this.regexp.lastIndex = 0;
        }
        return str;
      }
    }]);
    return Interpolator2;
  }();
  function ownKeys$2(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      enumerableOnly && (symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })), keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread$2(target) {
    for (var i2 = 1; i2 < arguments.length; i2++) {
      var source = null != arguments[i2] ? arguments[i2] : {};
      i2 % 2 ? ownKeys$2(Object(source), true).forEach(function(key2) {
        _defineProperty(target, key2, source[key2]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$2(Object(source)).forEach(function(key2) {
        Object.defineProperty(target, key2, Object.getOwnPropertyDescriptor(source, key2));
      });
    }
    return target;
  }
  function parseFormatStr(formatStr) {
    var formatName = formatStr.toLowerCase().trim();
    var formatOptions = {};
    if (formatStr.indexOf("(") > -1) {
      var p2 = formatStr.split("(");
      formatName = p2[0].toLowerCase().trim();
      var optStr = p2[1].substring(0, p2[1].length - 1);
      if (formatName === "currency" && optStr.indexOf(":") < 0) {
        if (!formatOptions.currency) formatOptions.currency = optStr.trim();
      } else if (formatName === "relativetime" && optStr.indexOf(":") < 0) {
        if (!formatOptions.range) formatOptions.range = optStr.trim();
      } else {
        var opts = optStr.split(";");
        opts.forEach(function(opt) {
          if (!opt) return;
          var _opt$split = opt.split(":"), _opt$split2 = _toArray(_opt$split), key2 = _opt$split2[0], rest = _opt$split2.slice(1);
          var val = rest.join(":").trim().replace(/^'+|'+$/g, "");
          if (!formatOptions[key2.trim()]) formatOptions[key2.trim()] = val;
          if (val === "false") formatOptions[key2.trim()] = false;
          if (val === "true") formatOptions[key2.trim()] = true;
          if (!isNaN(val)) formatOptions[key2.trim()] = parseInt(val, 10);
        });
      }
    }
    return {
      formatName,
      formatOptions
    };
  }
  function createCachedFormatter(fn2) {
    var cache = {};
    return function invokeFormatter(val, lng, options) {
      var key2 = lng + JSON.stringify(options);
      var formatter = cache[key2];
      if (!formatter) {
        formatter = fn2(lng, options);
        cache[key2] = formatter;
      }
      return formatter(val);
    };
  }
  var Formatter = function() {
    function Formatter2() {
      var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      _classCallCheck(this, Formatter2);
      this.logger = baseLogger.create("formatter");
      this.options = options;
      this.formats = {
        number: createCachedFormatter(function(lng, opt) {
          var formatter = new Intl.NumberFormat(lng, _objectSpread$2({}, opt));
          return function(val) {
            return formatter.format(val);
          };
        }),
        currency: createCachedFormatter(function(lng, opt) {
          var formatter = new Intl.NumberFormat(lng, _objectSpread$2(_objectSpread$2({}, opt), {}, {
            style: "currency"
          }));
          return function(val) {
            return formatter.format(val);
          };
        }),
        datetime: createCachedFormatter(function(lng, opt) {
          var formatter = new Intl.DateTimeFormat(lng, _objectSpread$2({}, opt));
          return function(val) {
            return formatter.format(val);
          };
        }),
        relativetime: createCachedFormatter(function(lng, opt) {
          var formatter = new Intl.RelativeTimeFormat(lng, _objectSpread$2({}, opt));
          return function(val) {
            return formatter.format(val, opt.range || "day");
          };
        }),
        list: createCachedFormatter(function(lng, opt) {
          var formatter = new Intl.ListFormat(lng, _objectSpread$2({}, opt));
          return function(val) {
            return formatter.format(val);
          };
        })
      };
      this.init(options);
    }
    _createClass(Formatter2, [{
      key: "init",
      value: function init2(services) {
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
          interpolation: {}
        };
        var iOpts = options.interpolation;
        this.formatSeparator = iOpts.formatSeparator ? iOpts.formatSeparator : iOpts.formatSeparator || ",";
      }
    }, {
      key: "add",
      value: function add(name, fc) {
        this.formats[name.toLowerCase().trim()] = fc;
      }
    }, {
      key: "addCached",
      value: function addCached(name, fc) {
        this.formats[name.toLowerCase().trim()] = createCachedFormatter(fc);
      }
    }, {
      key: "format",
      value: function format(value, _format, lng) {
        var _this = this;
        var options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
        var formats = _format.split(this.formatSeparator);
        var result = formats.reduce(function(mem, f2) {
          var _parseFormatStr = parseFormatStr(f2), formatName = _parseFormatStr.formatName, formatOptions = _parseFormatStr.formatOptions;
          if (_this.formats[formatName]) {
            var formatted = mem;
            try {
              var valOptions = options && options.formatParams && options.formatParams[options.interpolationkey] || {};
              var l2 = valOptions.locale || valOptions.lng || options.locale || options.lng || lng;
              formatted = _this.formats[formatName](mem, l2, _objectSpread$2(_objectSpread$2(_objectSpread$2({}, formatOptions), options), valOptions));
            } catch (error2) {
              _this.logger.warn(error2);
            }
            return formatted;
          } else {
            _this.logger.warn("there was no format function for ".concat(formatName));
          }
          return mem;
        }, value);
        return result;
      }
    }]);
    return Formatter2;
  }();
  function ownKeys$1(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      enumerableOnly && (symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })), keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread$1(target) {
    for (var i2 = 1; i2 < arguments.length; i2++) {
      var source = null != arguments[i2] ? arguments[i2] : {};
      i2 % 2 ? ownKeys$1(Object(source), true).forEach(function(key2) {
        _defineProperty(target, key2, source[key2]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$1(Object(source)).forEach(function(key2) {
        Object.defineProperty(target, key2, Object.getOwnPropertyDescriptor(source, key2));
      });
    }
    return target;
  }
  function _createSuper$1(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct$1();
    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived), result;
      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;
        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }
      return _possibleConstructorReturn(this, result);
    };
  }
  function _isNativeReflectConstruct$1() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
      return true;
    } catch (e2) {
      return false;
    }
  }
  function removePending(q2, name) {
    if (q2.pending[name] !== void 0) {
      delete q2.pending[name];
      q2.pendingCount--;
    }
  }
  var Connector = function(_EventEmitter) {
    _inherits(Connector2, _EventEmitter);
    var _super = _createSuper$1(Connector2);
    function Connector2(backend, store, services) {
      var _this;
      var options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
      _classCallCheck(this, Connector2);
      _this = _super.call(this);
      if (isIE10) {
        EventEmitter$1.call(_assertThisInitialized(_this));
      }
      _this.backend = backend;
      _this.store = store;
      _this.services = services;
      _this.languageUtils = services.languageUtils;
      _this.options = options;
      _this.logger = baseLogger.create("backendConnector");
      _this.waitingReads = [];
      _this.maxParallelReads = options.maxParallelReads || 10;
      _this.readingCalls = 0;
      _this.maxRetries = options.maxRetries >= 0 ? options.maxRetries : 5;
      _this.retryTimeout = options.retryTimeout >= 1 ? options.retryTimeout : 350;
      _this.state = {};
      _this.queue = [];
      if (_this.backend && _this.backend.init) {
        _this.backend.init(services, options.backend, options);
      }
      return _this;
    }
    _createClass(Connector2, [{
      key: "queueLoad",
      value: function queueLoad(languages, namespaces, options, callback) {
        var _this2 = this;
        var toLoad = {};
        var pending = {};
        var toLoadLanguages = {};
        var toLoadNamespaces = {};
        languages.forEach(function(lng) {
          var hasAllNamespaces = true;
          namespaces.forEach(function(ns) {
            var name = "".concat(lng, "|").concat(ns);
            if (!options.reload && _this2.store.hasResourceBundle(lng, ns)) {
              _this2.state[name] = 2;
            } else if (_this2.state[name] < 0) ;
            else if (_this2.state[name] === 1) {
              if (pending[name] === void 0) pending[name] = true;
            } else {
              _this2.state[name] = 1;
              hasAllNamespaces = false;
              if (pending[name] === void 0) pending[name] = true;
              if (toLoad[name] === void 0) toLoad[name] = true;
              if (toLoadNamespaces[ns] === void 0) toLoadNamespaces[ns] = true;
            }
          });
          if (!hasAllNamespaces) toLoadLanguages[lng] = true;
        });
        if (Object.keys(toLoad).length || Object.keys(pending).length) {
          this.queue.push({
            pending,
            pendingCount: Object.keys(pending).length,
            loaded: {},
            errors: [],
            callback
          });
        }
        return {
          toLoad: Object.keys(toLoad),
          pending: Object.keys(pending),
          toLoadLanguages: Object.keys(toLoadLanguages),
          toLoadNamespaces: Object.keys(toLoadNamespaces)
        };
      }
    }, {
      key: "loaded",
      value: function loaded(name, err, data) {
        var s2 = name.split("|");
        var lng = s2[0];
        var ns = s2[1];
        if (err) this.emit("failedLoading", lng, ns, err);
        if (data) {
          this.store.addResourceBundle(lng, ns, data);
        }
        this.state[name] = err ? -1 : 2;
        var loaded2 = {};
        this.queue.forEach(function(q2) {
          pushPath(q2.loaded, [lng], ns);
          removePending(q2, name);
          if (err) q2.errors.push(err);
          if (q2.pendingCount === 0 && !q2.done) {
            Object.keys(q2.loaded).forEach(function(l2) {
              if (!loaded2[l2]) loaded2[l2] = {};
              var loadedKeys = q2.loaded[l2];
              if (loadedKeys.length) {
                loadedKeys.forEach(function(n2) {
                  if (loaded2[l2][n2] === void 0) loaded2[l2][n2] = true;
                });
              }
            });
            q2.done = true;
            if (q2.errors.length) {
              q2.callback(q2.errors);
            } else {
              q2.callback();
            }
          }
        });
        this.emit("loaded", loaded2);
        this.queue = this.queue.filter(function(q2) {
          return !q2.done;
        });
      }
    }, {
      key: "read",
      value: function read(lng, ns, fcName) {
        var _this3 = this;
        var tried = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0;
        var wait = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : this.retryTimeout;
        var callback = arguments.length > 5 ? arguments[5] : void 0;
        if (!lng.length) return callback(null, {});
        if (this.readingCalls >= this.maxParallelReads) {
          this.waitingReads.push({
            lng,
            ns,
            fcName,
            tried,
            wait,
            callback
          });
          return;
        }
        this.readingCalls++;
        var resolver2 = function resolver3(err, data) {
          _this3.readingCalls--;
          if (_this3.waitingReads.length > 0) {
            var next = _this3.waitingReads.shift();
            _this3.read(next.lng, next.ns, next.fcName, next.tried, next.wait, next.callback);
          }
          if (err && data && tried < _this3.maxRetries) {
            setTimeout(function() {
              _this3.read.call(_this3, lng, ns, fcName, tried + 1, wait * 2, callback);
            }, wait);
            return;
          }
          callback(err, data);
        };
        var fc = this.backend[fcName].bind(this.backend);
        if (fc.length === 2) {
          try {
            var r2 = fc(lng, ns);
            if (r2 && typeof r2.then === "function") {
              r2.then(function(data) {
                return resolver2(null, data);
              })["catch"](resolver2);
            } else {
              resolver2(null, r2);
            }
          } catch (err) {
            resolver2(err);
          }
          return;
        }
        return fc(lng, ns, resolver2);
      }
    }, {
      key: "prepareLoading",
      value: function prepareLoading(languages, namespaces) {
        var _this4 = this;
        var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
        var callback = arguments.length > 3 ? arguments[3] : void 0;
        if (!this.backend) {
          this.logger.warn("No backend was added via i18next.use. Will not load resources.");
          return callback && callback();
        }
        if (typeof languages === "string") languages = this.languageUtils.toResolveHierarchy(languages);
        if (typeof namespaces === "string") namespaces = [namespaces];
        var toLoad = this.queueLoad(languages, namespaces, options, callback);
        if (!toLoad.toLoad.length) {
          if (!toLoad.pending.length) callback();
          return null;
        }
        toLoad.toLoad.forEach(function(name) {
          _this4.loadOne(name);
        });
      }
    }, {
      key: "load",
      value: function load(languages, namespaces, callback) {
        this.prepareLoading(languages, namespaces, {}, callback);
      }
    }, {
      key: "reload",
      value: function reload(languages, namespaces, callback) {
        this.prepareLoading(languages, namespaces, {
          reload: true
        }, callback);
      }
    }, {
      key: "loadOne",
      value: function loadOne(name) {
        var _this5 = this;
        var prefix = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
        var s2 = name.split("|");
        var lng = s2[0];
        var ns = s2[1];
        this.read(lng, ns, "read", void 0, void 0, function(err, data) {
          if (err) _this5.logger.warn("".concat(prefix, "loading namespace ").concat(ns, " for language ").concat(lng, " failed"), err);
          if (!err && data) _this5.logger.log("".concat(prefix, "loaded namespace ").concat(ns, " for language ").concat(lng), data);
          _this5.loaded(name, err, data);
        });
      }
    }, {
      key: "saveMissing",
      value: function saveMissing(languages, namespace, key2, fallbackValue, isUpdate) {
        var options = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : {};
        var clb = arguments.length > 6 && arguments[6] !== void 0 ? arguments[6] : function() {
        };
        if (this.services.utils && this.services.utils.hasLoadedNamespace && !this.services.utils.hasLoadedNamespace(namespace)) {
          this.logger.warn('did not save key "'.concat(key2, '" as the namespace "').concat(namespace, '" was not yet loaded'), "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
          return;
        }
        if (key2 === void 0 || key2 === null || key2 === "") return;
        if (this.backend && this.backend.create) {
          var opts = _objectSpread$1(_objectSpread$1({}, options), {}, {
            isUpdate
          });
          var fc = this.backend.create.bind(this.backend);
          if (fc.length < 6) {
            try {
              var r2;
              if (fc.length === 5) {
                r2 = fc(languages, namespace, key2, fallbackValue, opts);
              } else {
                r2 = fc(languages, namespace, key2, fallbackValue);
              }
              if (r2 && typeof r2.then === "function") {
                r2.then(function(data) {
                  return clb(null, data);
                })["catch"](clb);
              } else {
                clb(null, r2);
              }
            } catch (err) {
              clb(err);
            }
          } else {
            fc(languages, namespace, key2, fallbackValue, clb, opts);
          }
        }
        if (!languages || !languages[0]) return;
        this.store.addResource(languages[0], namespace, key2, fallbackValue);
      }
    }]);
    return Connector2;
  }(EventEmitter$1);
  function get() {
    return {
      debug: false,
      initImmediate: true,
      ns: ["translation"],
      defaultNS: ["translation"],
      fallbackLng: ["dev"],
      fallbackNS: false,
      supportedLngs: false,
      nonExplicitSupportedLngs: false,
      load: "all",
      preload: false,
      simplifyPluralSuffix: true,
      keySeparator: ".",
      nsSeparator: ":",
      pluralSeparator: "_",
      contextSeparator: "_",
      partialBundledLanguages: false,
      saveMissing: false,
      updateMissing: false,
      saveMissingTo: "fallback",
      saveMissingPlurals: true,
      missingKeyHandler: false,
      missingInterpolationHandler: false,
      postProcess: false,
      postProcessPassResolved: false,
      returnNull: true,
      returnEmptyString: true,
      returnObjects: false,
      joinArrays: false,
      returnedObjectHandler: false,
      parseMissingKeyHandler: false,
      appendNamespaceToMissingKey: false,
      appendNamespaceToCIMode: false,
      overloadTranslationOptionHandler: function handle3(args) {
        var ret = {};
        if (_typeof(args[1]) === "object") ret = args[1];
        if (typeof args[1] === "string") ret.defaultValue = args[1];
        if (typeof args[2] === "string") ret.tDescription = args[2];
        if (_typeof(args[2]) === "object" || _typeof(args[3]) === "object") {
          var options = args[3] || args[2];
          Object.keys(options).forEach(function(key2) {
            ret[key2] = options[key2];
          });
        }
        return ret;
      },
      interpolation: {
        escapeValue: true,
        format: function format(value, _format, lng, options) {
          return value;
        },
        prefix: "{{",
        suffix: "}}",
        formatSeparator: ",",
        unescapePrefix: "-",
        nestingPrefix: "$t(",
        nestingSuffix: ")",
        nestingOptionsSeparator: ",",
        maxReplaces: 1e3,
        skipOnVariables: true
      }
    };
  }
  function transformOptions(options) {
    if (typeof options.ns === "string") options.ns = [options.ns];
    if (typeof options.fallbackLng === "string") options.fallbackLng = [options.fallbackLng];
    if (typeof options.fallbackNS === "string") options.fallbackNS = [options.fallbackNS];
    if (options.supportedLngs && options.supportedLngs.indexOf("cimode") < 0) {
      options.supportedLngs = options.supportedLngs.concat(["cimode"]);
    }
    return options;
  }
  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      enumerableOnly && (symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })), keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread(target) {
    for (var i2 = 1; i2 < arguments.length; i2++) {
      var source = null != arguments[i2] ? arguments[i2] : {};
      i2 % 2 ? ownKeys(Object(source), true).forEach(function(key2) {
        _defineProperty(target, key2, source[key2]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key2) {
        Object.defineProperty(target, key2, Object.getOwnPropertyDescriptor(source, key2));
      });
    }
    return target;
  }
  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived), result;
      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;
        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }
      return _possibleConstructorReturn(this, result);
    };
  }
  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
      return true;
    } catch (e2) {
      return false;
    }
  }
  function noop$1() {
  }
  function bindMemberFunctions(inst) {
    var mems = Object.getOwnPropertyNames(Object.getPrototypeOf(inst));
    mems.forEach(function(mem) {
      if (typeof inst[mem] === "function") {
        inst[mem] = inst[mem].bind(inst);
      }
    });
  }
  var I18n = function(_EventEmitter) {
    _inherits(I18n2, _EventEmitter);
    var _super = _createSuper(I18n2);
    function I18n2() {
      var _this;
      var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      var callback = arguments.length > 1 ? arguments[1] : void 0;
      _classCallCheck(this, I18n2);
      _this = _super.call(this);
      if (isIE10) {
        EventEmitter$1.call(_assertThisInitialized(_this));
      }
      _this.options = transformOptions(options);
      _this.services = {};
      _this.logger = baseLogger;
      _this.modules = {
        external: []
      };
      bindMemberFunctions(_assertThisInitialized(_this));
      if (callback && !_this.isInitialized && !options.isClone) {
        if (!_this.options.initImmediate) {
          _this.init(options, callback);
          return _possibleConstructorReturn(_this, _assertThisInitialized(_this));
        }
        setTimeout(function() {
          _this.init(options, callback);
        }, 0);
      }
      return _this;
    }
    _createClass(I18n2, [{
      key: "init",
      value: function init2() {
        var _this2 = this;
        var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
        var callback = arguments.length > 1 ? arguments[1] : void 0;
        if (typeof options === "function") {
          callback = options;
          options = {};
        }
        if (!options.defaultNS && options.defaultNS !== false && options.ns) {
          if (typeof options.ns === "string") {
            options.defaultNS = options.ns;
          } else if (options.ns.indexOf("translation") < 0) {
            options.defaultNS = options.ns[0];
          }
        }
        var defOpts = get();
        this.options = _objectSpread(_objectSpread(_objectSpread({}, defOpts), this.options), transformOptions(options));
        if (this.options.compatibilityAPI !== "v1") {
          this.options.interpolation = _objectSpread(_objectSpread({}, defOpts.interpolation), this.options.interpolation);
        }
        if (options.keySeparator !== void 0) {
          this.options.userDefinedKeySeparator = options.keySeparator;
        }
        if (options.nsSeparator !== void 0) {
          this.options.userDefinedNsSeparator = options.nsSeparator;
        }
        function createClassOnDemand(ClassOrObject) {
          if (!ClassOrObject) return null;
          if (typeof ClassOrObject === "function") return new ClassOrObject();
          return ClassOrObject;
        }
        if (!this.options.isClone) {
          if (this.modules.logger) {
            baseLogger.init(createClassOnDemand(this.modules.logger), this.options);
          } else {
            baseLogger.init(null, this.options);
          }
          var formatter;
          if (this.modules.formatter) {
            formatter = this.modules.formatter;
          } else if (typeof Intl !== "undefined") {
            formatter = Formatter;
          }
          var lu = new LanguageUtil(this.options);
          this.store = new ResourceStore(this.options.resources, this.options);
          var s2 = this.services;
          s2.logger = baseLogger;
          s2.resourceStore = this.store;
          s2.languageUtils = lu;
          s2.pluralResolver = new PluralResolver(lu, {
            prepend: this.options.pluralSeparator,
            compatibilityJSON: this.options.compatibilityJSON,
            simplifyPluralSuffix: this.options.simplifyPluralSuffix
          });
          if (formatter && (!this.options.interpolation.format || this.options.interpolation.format === defOpts.interpolation.format)) {
            s2.formatter = createClassOnDemand(formatter);
            s2.formatter.init(s2, this.options);
            this.options.interpolation.format = s2.formatter.format.bind(s2.formatter);
          }
          s2.interpolator = new Interpolator(this.options);
          s2.utils = {
            hasLoadedNamespace: this.hasLoadedNamespace.bind(this)
          };
          s2.backendConnector = new Connector(createClassOnDemand(this.modules.backend), s2.resourceStore, s2, this.options);
          s2.backendConnector.on("*", function(event) {
            for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
              args[_key - 1] = arguments[_key];
            }
            _this2.emit.apply(_this2, [event].concat(args));
          });
          if (this.modules.languageDetector) {
            s2.languageDetector = createClassOnDemand(this.modules.languageDetector);
            if (s2.languageDetector.init) s2.languageDetector.init(s2, this.options.detection, this.options);
          }
          if (this.modules.i18nFormat) {
            s2.i18nFormat = createClassOnDemand(this.modules.i18nFormat);
            if (s2.i18nFormat.init) s2.i18nFormat.init(this);
          }
          this.translator = new Translator(this.services, this.options);
          this.translator.on("*", function(event) {
            for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
              args[_key2 - 1] = arguments[_key2];
            }
            _this2.emit.apply(_this2, [event].concat(args));
          });
          this.modules.external.forEach(function(m2) {
            if (m2.init) m2.init(_this2);
          });
        }
        this.format = this.options.interpolation.format;
        if (!callback) callback = noop$1;
        if (this.options.fallbackLng && !this.services.languageDetector && !this.options.lng) {
          var codes = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
          if (codes.length > 0 && codes[0] !== "dev") this.options.lng = codes[0];
        }
        if (!this.services.languageDetector && !this.options.lng) {
          this.logger.warn("init: no languageDetector is used and no lng is defined");
        }
        var storeApi = ["getResource", "hasResourceBundle", "getResourceBundle", "getDataByLanguage"];
        storeApi.forEach(function(fcName) {
          _this2[fcName] = function() {
            var _this2$store;
            return (_this2$store = _this2.store)[fcName].apply(_this2$store, arguments);
          };
        });
        var storeApiChained = ["addResource", "addResources", "addResourceBundle", "removeResourceBundle"];
        storeApiChained.forEach(function(fcName) {
          _this2[fcName] = function() {
            var _this2$store2;
            (_this2$store2 = _this2.store)[fcName].apply(_this2$store2, arguments);
            return _this2;
          };
        });
        var deferred = defer();
        var load = function load2() {
          var finish = function finish2(err, t2) {
            if (_this2.isInitialized && !_this2.initializedStoreOnce) _this2.logger.warn("init: i18next is already initialized. You should call init just once!");
            _this2.isInitialized = true;
            if (!_this2.options.isClone) _this2.logger.log("initialized", _this2.options);
            _this2.emit("initialized", _this2.options);
            deferred.resolve(t2);
            callback(err, t2);
          };
          if (_this2.languages && _this2.options.compatibilityAPI !== "v1" && !_this2.isInitialized) return finish(null, _this2.t.bind(_this2));
          _this2.changeLanguage(_this2.options.lng, finish);
        };
        if (this.options.resources || !this.options.initImmediate) {
          load();
        } else {
          setTimeout(load, 0);
        }
        return deferred;
      }
    }, {
      key: "loadResources",
      value: function loadResources(language) {
        var _this3 = this;
        var callback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : noop$1;
        var usedCallback = callback;
        var usedLng = typeof language === "string" ? language : this.language;
        if (typeof language === "function") usedCallback = language;
        if (!this.options.resources || this.options.partialBundledLanguages) {
          if (usedLng && usedLng.toLowerCase() === "cimode") return usedCallback();
          var toLoad = [];
          var append = function append2(lng) {
            if (!lng) return;
            var lngs = _this3.services.languageUtils.toResolveHierarchy(lng);
            lngs.forEach(function(l2) {
              if (toLoad.indexOf(l2) < 0) toLoad.push(l2);
            });
          };
          if (!usedLng) {
            var fallbacks = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
            fallbacks.forEach(function(l2) {
              return append(l2);
            });
          } else {
            append(usedLng);
          }
          if (this.options.preload) {
            this.options.preload.forEach(function(l2) {
              return append(l2);
            });
          }
          this.services.backendConnector.load(toLoad, this.options.ns, function(e2) {
            if (!e2 && !_this3.resolvedLanguage && _this3.language) _this3.setResolvedLanguage(_this3.language);
            usedCallback(e2);
          });
        } else {
          usedCallback(null);
        }
      }
    }, {
      key: "reloadResources",
      value: function reloadResources(lngs, ns, callback) {
        var deferred = defer();
        if (!lngs) lngs = this.languages;
        if (!ns) ns = this.options.ns;
        if (!callback) callback = noop$1;
        this.services.backendConnector.reload(lngs, ns, function(err) {
          deferred.resolve();
          callback(err);
        });
        return deferred;
      }
    }, {
      key: "use",
      value: function use(module) {
        if (!module) throw new Error("You are passing an undefined module! Please check the object you are passing to i18next.use()");
        if (!module.type) throw new Error("You are passing a wrong module! Please check the object you are passing to i18next.use()");
        if (module.type === "backend") {
          this.modules.backend = module;
        }
        if (module.type === "logger" || module.log && module.warn && module.error) {
          this.modules.logger = module;
        }
        if (module.type === "languageDetector") {
          this.modules.languageDetector = module;
        }
        if (module.type === "i18nFormat") {
          this.modules.i18nFormat = module;
        }
        if (module.type === "postProcessor") {
          postProcessor.addPostProcessor(module);
        }
        if (module.type === "formatter") {
          this.modules.formatter = module;
        }
        if (module.type === "3rdParty") {
          this.modules.external.push(module);
        }
        return this;
      }
    }, {
      key: "setResolvedLanguage",
      value: function setResolvedLanguage(l2) {
        if (!l2 || !this.languages) return;
        if (["cimode", "dev"].indexOf(l2) > -1) return;
        for (var li2 = 0; li2 < this.languages.length; li2++) {
          var lngInLngs = this.languages[li2];
          if (["cimode", "dev"].indexOf(lngInLngs) > -1) continue;
          if (this.store.hasLanguageSomeTranslations(lngInLngs)) {
            this.resolvedLanguage = lngInLngs;
            break;
          }
        }
      }
    }, {
      key: "changeLanguage",
      value: function changeLanguage(lng, callback) {
        var _this4 = this;
        this.isLanguageChangingTo = lng;
        var deferred = defer();
        this.emit("languageChanging", lng);
        var setLngProps = function setLngProps2(l2) {
          _this4.language = l2;
          _this4.languages = _this4.services.languageUtils.toResolveHierarchy(l2);
          _this4.resolvedLanguage = void 0;
          _this4.setResolvedLanguage(l2);
        };
        var done = function done2(err, l2) {
          if (l2) {
            setLngProps(l2);
            _this4.translator.changeLanguage(l2);
            _this4.isLanguageChangingTo = void 0;
            _this4.emit("languageChanged", l2);
            _this4.logger.log("languageChanged", l2);
          } else {
            _this4.isLanguageChangingTo = void 0;
          }
          deferred.resolve(function() {
            return _this4.t.apply(_this4, arguments);
          });
          if (callback) callback(err, function() {
            return _this4.t.apply(_this4, arguments);
          });
        };
        var setLng = function setLng2(lngs) {
          if (!lng && !lngs && _this4.services.languageDetector) lngs = [];
          var l2 = typeof lngs === "string" ? lngs : _this4.services.languageUtils.getBestMatchFromCodes(lngs);
          if (l2) {
            if (!_this4.language) {
              setLngProps(l2);
            }
            if (!_this4.translator.language) _this4.translator.changeLanguage(l2);
            if (_this4.services.languageDetector && _this4.services.languageDetector.cacheUserLanguage) _this4.services.languageDetector.cacheUserLanguage(l2);
          }
          _this4.loadResources(l2, function(err) {
            done(err, l2);
          });
        };
        if (!lng && this.services.languageDetector && !this.services.languageDetector.async) {
          setLng(this.services.languageDetector.detect());
        } else if (!lng && this.services.languageDetector && this.services.languageDetector.async) {
          if (this.services.languageDetector.detect.length === 0) {
            this.services.languageDetector.detect().then(setLng);
          } else {
            this.services.languageDetector.detect(setLng);
          }
        } else {
          setLng(lng);
        }
        return deferred;
      }
    }, {
      key: "getFixedT",
      value: function getFixedT(lng, ns, keyPrefix) {
        var _this5 = this;
        var fixedT = function fixedT2(key2, opts) {
          var options;
          if (_typeof(opts) !== "object") {
            for (var _len3 = arguments.length, rest = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
              rest[_key3 - 2] = arguments[_key3];
            }
            options = _this5.options.overloadTranslationOptionHandler([key2, opts].concat(rest));
          } else {
            options = _objectSpread({}, opts);
          }
          options.lng = options.lng || fixedT2.lng;
          options.lngs = options.lngs || fixedT2.lngs;
          options.ns = options.ns || fixedT2.ns;
          options.keyPrefix = options.keyPrefix || keyPrefix || fixedT2.keyPrefix;
          var keySeparator = _this5.options.keySeparator || ".";
          var resultKey;
          if (options.keyPrefix && Array.isArray(key2)) {
            resultKey = key2.map(function(k2) {
              return "".concat(options.keyPrefix).concat(keySeparator).concat(k2);
            });
          } else {
            resultKey = options.keyPrefix ? "".concat(options.keyPrefix).concat(keySeparator).concat(key2) : key2;
          }
          return _this5.t(resultKey, options);
        };
        if (typeof lng === "string") {
          fixedT.lng = lng;
        } else {
          fixedT.lngs = lng;
        }
        fixedT.ns = ns;
        fixedT.keyPrefix = keyPrefix;
        return fixedT;
      }
    }, {
      key: "t",
      value: function t2() {
        var _this$translator;
        return this.translator && (_this$translator = this.translator).translate.apply(_this$translator, arguments);
      }
    }, {
      key: "exists",
      value: function exists() {
        var _this$translator2;
        return this.translator && (_this$translator2 = this.translator).exists.apply(_this$translator2, arguments);
      }
    }, {
      key: "setDefaultNamespace",
      value: function setDefaultNamespace(ns) {
        this.options.defaultNS = ns;
      }
    }, {
      key: "hasLoadedNamespace",
      value: function hasLoadedNamespace2(ns) {
        var _this6 = this;
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        if (!this.isInitialized) {
          this.logger.warn("hasLoadedNamespace: i18next was not initialized", this.languages);
          return false;
        }
        if (!this.languages || !this.languages.length) {
          this.logger.warn("hasLoadedNamespace: i18n.languages were undefined or empty", this.languages);
          return false;
        }
        var lng = options.lng || this.resolvedLanguage || this.languages[0];
        var fallbackLng = this.options ? this.options.fallbackLng : false;
        var lastLng = this.languages[this.languages.length - 1];
        if (lng.toLowerCase() === "cimode") return true;
        var loadNotPending = function loadNotPending2(l2, n2) {
          var loadState = _this6.services.backendConnector.state["".concat(l2, "|").concat(n2)];
          return loadState === -1 || loadState === 2;
        };
        if (options.precheck) {
          var preResult = options.precheck(this, loadNotPending);
          if (preResult !== void 0) return preResult;
        }
        if (this.hasResourceBundle(lng, ns)) return true;
        if (!this.services.backendConnector.backend || this.options.resources && !this.options.partialBundledLanguages) return true;
        if (loadNotPending(lng, ns) && (!fallbackLng || loadNotPending(lastLng, ns))) return true;
        return false;
      }
    }, {
      key: "loadNamespaces",
      value: function loadNamespaces2(ns, callback) {
        var _this7 = this;
        var deferred = defer();
        if (!this.options.ns) {
          if (callback) callback();
          return Promise.resolve();
        }
        if (typeof ns === "string") ns = [ns];
        ns.forEach(function(n2) {
          if (_this7.options.ns.indexOf(n2) < 0) _this7.options.ns.push(n2);
        });
        this.loadResources(function(err) {
          deferred.resolve();
          if (callback) callback(err);
        });
        return deferred;
      }
    }, {
      key: "loadLanguages",
      value: function loadLanguages2(lngs, callback) {
        var deferred = defer();
        if (typeof lngs === "string") lngs = [lngs];
        var preloaded = this.options.preload || [];
        var newLngs = lngs.filter(function(lng) {
          return preloaded.indexOf(lng) < 0;
        });
        if (!newLngs.length) {
          if (callback) callback();
          return Promise.resolve();
        }
        this.options.preload = preloaded.concat(newLngs);
        this.loadResources(function(err) {
          deferred.resolve();
          if (callback) callback(err);
        });
        return deferred;
      }
    }, {
      key: "dir",
      value: function dir(lng) {
        if (!lng) lng = this.resolvedLanguage || (this.languages && this.languages.length > 0 ? this.languages[0] : this.language);
        if (!lng) return "rtl";
        var rtlLngs = ["ar", "shu", "sqr", "ssh", "xaa", "yhd", "yud", "aao", "abh", "abv", "acm", "acq", "acw", "acx", "acy", "adf", "ads", "aeb", "aec", "afb", "ajp", "apc", "apd", "arb", "arq", "ars", "ary", "arz", "auz", "avl", "ayh", "ayl", "ayn", "ayp", "bbz", "pga", "he", "iw", "ps", "pbt", "pbu", "pst", "prp", "prd", "ug", "ur", "ydd", "yds", "yih", "ji", "yi", "hbo", "men", "xmn", "fa", "jpr", "peo", "pes", "prs", "dv", "sam", "ckb"];
        var languageUtils = this.services && this.services.languageUtils || new LanguageUtil(get());
        return rtlLngs.indexOf(languageUtils.getLanguagePartFromCode(lng)) > -1 || lng.toLowerCase().indexOf("-arab") > 1 ? "rtl" : "ltr";
      }
    }, {
      key: "cloneInstance",
      value: function cloneInstance() {
        var _this8 = this;
        var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
        var callback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : noop$1;
        var mergedOptions = _objectSpread(_objectSpread(_objectSpread({}, this.options), options), {
          isClone: true
        });
        var clone = new I18n2(mergedOptions);
        if (options.debug !== void 0 || options.prefix !== void 0) {
          clone.logger = clone.logger.clone(options);
        }
        var membersToCopy = ["store", "services", "language"];
        membersToCopy.forEach(function(m2) {
          clone[m2] = _this8[m2];
        });
        clone.services = _objectSpread({}, this.services);
        clone.services.utils = {
          hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone)
        };
        clone.translator = new Translator(clone.services, clone.options);
        clone.translator.on("*", function(event) {
          for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
            args[_key4 - 1] = arguments[_key4];
          }
          clone.emit.apply(clone, [event].concat(args));
        });
        clone.init(mergedOptions, callback);
        clone.translator.options = clone.options;
        clone.translator.backendConnector.services.utils = {
          hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone)
        };
        return clone;
      }
    }, {
      key: "toJSON",
      value: function toJSON() {
        return {
          options: this.options,
          store: this.store,
          language: this.language,
          languages: this.languages,
          resolvedLanguage: this.resolvedLanguage
        };
      }
    }]);
    return I18n2;
  }(EventEmitter$1);
  _defineProperty(I18n, "createInstance", function() {
    var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    var callback = arguments.length > 1 ? arguments[1] : void 0;
    return new I18n(options, callback);
  });
  var instance$1 = I18n.createInstance();
  instance$1.createInstance = I18n.createInstance;
  instance$1.createInstance;
  instance$1.dir;
  instance$1.init;
  instance$1.loadResources;
  instance$1.reloadResources;
  instance$1.use;
  instance$1.changeLanguage;
  instance$1.getFixedT;
  instance$1.t;
  instance$1.exists;
  instance$1.setDefaultNamespace;
  instance$1.hasLoadedNamespace;
  instance$1.loadNamespaces;
  instance$1.loadLanguages;
  const title$8 = "ChatGPT Exporter";
  const ExportHelper$8 = "Export";
  const Setting$8 = "Setting";
  const Language$8 = "Language";
  const Screenshot$8 = "Screenshot";
  const Markdown$8 = "Markdown";
  const HTML$8 = "HTML";
  const Archive$8 = "Archive";
  const Save$8 = "Save";
  const Delete$8 = "Delete";
  const Export$8 = "Export";
  const Loading$8 = "Loading";
  const Preview$8 = "Preview";
  const of = "of";
  const en_US = {
    title: title$8,
    ExportHelper: ExportHelper$8,
    Setting: Setting$8,
    Language: Language$8,
    "Copy Text": "Copy Text",
    "Copied!": "Copied!",
    Screenshot: Screenshot$8,
    Markdown: Markdown$8,
    HTML: HTML$8,
    "JSON": "JSON",
    Archive: Archive$8,
    Save: Save$8,
    Delete: Delete$8,
    "Select All": "Select All",
    Export: Export$8,
    "Error": "Error",
    Loading: Loading$8,
    Preview: Preview$8,
    "File Name": "File Name",
    "Export All": "Export All",
    "Exporter Settings": "Exporter Settings",
    "Export Dialog Title": "Export Conversations",
    "Invalid File Format": "Invalid File Format",
    "Export from official export file": "Export from official export file",
    "Export from API": "Export from API",
    "Available variables": "Available variables",
    "Conversation Timestamp": "Conversation Timestamp",
    "Conversation Timestamp Description": "Will show on the page.",
    "Enable on HTML": "Enable on HTML files",
    "Enable on Markdown": "Enable on Markdown files",
    "Use 24-hour format": "Use 24-hour format (eg. 23:59)",
    "Export Format": "Export Format",
    "Export Metadata": "Export Metadata",
    "Export Metadata Description": "Add metadata to exported Markdown and HTML files.",
    "OpenAI Official Format": "OpenAI Official Format",
    "Conversation Archive Alert": "Are you sure you want to archive all selected conversations?",
    "Conversation Archived Message": "All selected conversations have been archived. Please refresh the page to see the changes.",
    "Conversation Delete Alert": "Are you sure you want to delete all selected conversations?",
    "Conversation Deleted Message": "All selected conversations have been deleted. Please refresh the page to see the changes.",
    "Please start a conversation first": "Please start a conversation first.",
    "Select Project": "Select Project",
    "(no project)": "(no project)",
    "Export All Limit": "Export All Limit",
    "Export All Limit Description": "Set the maximum number of conversations to load in the 'Export All' dialog.",
    "Export Chunk Size": "Export Chunk Size",
    "Export Chunk Size Description": "Number of conversations to process per chunk. Smaller chunks use less memory but create more ZIP files.",
    "Processing chunk": "Processing chunk",
    of,
    "Smart Filters": "Smart Filters",
    "Clear All": "Clear All",
    "Quick Filters": "Quick Filters",
    "Search in titles": "Search in titles",
    "Type to search...": "Type to search...",
    "Min Input/Output Ratio": "Min Input/Output Ratio",
    "Min Conversation Length": "Min Conversation Length",
    "Anthropic API Key": "Anthropic API Key",
    "Anthropic API Key Description": "Enter your Anthropic API key to enable conversation analysis with Claude Haiku 4.5. Get your API key at console.anthropic.com",
    "API Key Security Warning": "This key is stored locally in your browser. Never share it with others."
  };
  const title$7 = "ChatGPT Exporter";
  const ExportHelper$7 = "Exportar";
  const Setting$7 = "Ajustes";
  const Language$7 = "Idioma";
  const Screenshot$7 = "Captura De Pantalla";
  const Markdown$7 = "Markdown";
  const HTML$7 = "HTML";
  const Archive$7 = "Archivo";
  const Save$7 = "Guardar";
  const Delete$7 = "Borrar";
  const Export$7 = "Exportar";
  const Loading$7 = "Cargando";
  const Preview$7 = "Previsualizar";
  const es = {
    title: title$7,
    ExportHelper: ExportHelper$7,
    Setting: Setting$7,
    Language: Language$7,
    "Copy Text": "Copiar Texto",
    "Copied!": "¡Copiado!",
    Screenshot: Screenshot$7,
    Markdown: Markdown$7,
    HTML: HTML$7,
    "JSON": "JSON",
    Archive: Archive$7,
    Save: Save$7,
    Delete: Delete$7,
    "Select All": "Seleccionar Todos",
    Export: Export$7,
    "Error": "Error",
    Loading: Loading$7,
    Preview: Preview$7,
    "File Name": "Nombre del Archivo",
    "Export All": "Exportar Todos",
    "Exporter Settings": "Ajustes De Exportación",
    "Export Dialog Title": "Exportar Conversaciones",
    "Invalid File Format": "Formato de archivo inválido",
    "Export from official export file": "Exportar desde archivo de exportación oficial",
    "Export from API": "Exportar desde API",
    "Available variables": "Variables Disponibles",
    "Conversation Timestamp": "Marca de Tiempo",
    "Conversation Timestamp Description": "Aparecerá en la página.",
    "Enable on HTML": "Habilitar en archivos HTML",
    "Enable on Markdown": "Habilitar en archivos Markdown",
    "Use 24-hour format": "Usar formato de 24 horas (ej. 23:59)",
    "Export Format": "Formato de Exportación",
    "Export Metadata": "Exportar Metadatos",
    "Export Metadata Description": "Añadir Metadatos a los archivos Markdown y HTML exportados.",
    "OpenAI Official Format": "Formato Oficial de OpenAI",
    "Conversation Archive Alert": "¿Estás seguro que quieres archivar todas las conversaciones seleccionadas?",
    "Conversation Archived Message": "Todos las conversaciones seleccionadas se han archivado. Por favor refresca la página para ver los cambios.",
    "Conversation Delete Alert": "¿Estás seguro que quieres borrar todas las conversaciones seleccionadas?",
    "Conversation Deleted Message": "Todos las conversaciones seleccionadas se han borrado. Por favor refresca la página para ver los cambios.",
    "Please start a conversation first": "Por favor empieza una conversación antes.",
    "Select Project": "Seleccionar proyecto",
    "(no project)": "(sin proyecto)",
    "Export All Limit": "Límite de Exportar Todos",
    "Export All Limit Description": "Establece el número máximo de conversaciones a cargar en el diálogo 'Exportar Todos'."
  };
  const title$6 = "Exportateur ChatGPT";
  const ExportHelper$6 = "Exporter";
  const Setting$6 = "Paramètre";
  const Language$6 = "Langue";
  const Screenshot$6 = "Capture d'écran";
  const Markdown$6 = "Markdown";
  const HTML$6 = "HTML";
  const Archive$6 = "Archiver";
  const Save$6 = "Enregistrer";
  const Delete$6 = "Supprimer";
  const Export$6 = "Exporter";
  const Loading$6 = "Chargement";
  const Preview$6 = "Aperçu";
  const fr = {
    title: title$6,
    ExportHelper: ExportHelper$6,
    Setting: Setting$6,
    Language: Language$6,
    "Copy Text": "Copier le texte",
    "Copied!": "Copié !",
    Screenshot: Screenshot$6,
    Markdown: Markdown$6,
    HTML: HTML$6,
    "JSON": "JSON",
    Archive: Archive$6,
    Save: Save$6,
    Delete: Delete$6,
    "Select All": "Tout sélectionner",
    Export: Export$6,
    "Error": "Erreur",
    Loading: Loading$6,
    Preview: Preview$6,
    "File Name": "Nom du fichier",
    "Export All": "Tout exporter",
    "Exporter Settings": "Paramètres de l'exportateur",
    "Export Dialog Title": "Exporter les conversations",
    "Invalid File Format": "Format de fichier invalide",
    "Export from official export file": "Exporter depuis un fichier officiel",
    "Export from API": "Exporter depuis l'API",
    "Available variables": "Variables disponibles",
    "Conversation Timestamp": "Horodatage de la conversation",
    "Conversation Timestamp Description": "S'affichera sur la page.",
    "Enable on HTML": "Activer sur les fichiers HTML",
    "Enable on Markdown": "Activer sur les fichiers Markdown",
    "Use 24-hour format": "Utiliser le format 24 heures (ex. 23:59)",
    "Export Format": "Format d'exportation",
    "Export Metadata": "Exporter les métadonnées",
    "Export Metadata Description": "Ajouter des métadonnées aux fichiers Markdown et HTML exportés.",
    "OpenAI Official Format": "Format officiel OpenAI",
    "Conversation Archive Alert": "Êtes-vous sûr de vouloir archiver toutes les conversations sélectionnées ?",
    "Conversation Archived Message": "Toutes les conversations sélectionnées ont été archivées. Veuillez actualiser la page pour voir les changements.",
    "Conversation Delete Alert": "Êtes-vous sûr de vouloir supprimer toutes les conversations sélectionnées ?",
    "Conversation Deleted Message": "Toutes les conversations sélectionnées ont été supprimées. Veuillez actualiser la page pour voir les changements.",
    "Please start a conversation first": "Veuillez commencer une conversation d'abord.",
    "Select Project": "Sélectionner un projet",
    "(no project)": "(aucun projet)",
    "Export All Limit": "Limite d'Exportation Multiple",
    "Export All Limit Description": "Définit le nombre maximal de conversations à charger dans la boîte de dialogue 'Tout exporter'."
  };
  const title$5 = "ChatGPT Exporter";
  const ExportHelper$5 = "Ekspor";
  const Setting$5 = "Pengaturan";
  const Language$5 = "Bahasa";
  const Screenshot$5 = "Tangkapan Layar";
  const Markdown$5 = "Markdown";
  const HTML$5 = "HTML";
  const Archive$5 = "Arsip";
  const Save$5 = "Simpan";
  const Delete$5 = "Hapus";
  const Export$5 = "Ekspor";
  const Loading$5 = "Memuat";
  const Preview$5 = "Pratinjau";
  const id_ID = {
    title: title$5,
    ExportHelper: ExportHelper$5,
    Setting: Setting$5,
    Language: Language$5,
    "Copy Text": "Salin Teks",
    "Copied!": "Disalin!",
    Screenshot: Screenshot$5,
    Markdown: Markdown$5,
    HTML: HTML$5,
    "JSON": "JSON",
    Archive: Archive$5,
    Save: Save$5,
    Delete: Delete$5,
    "Select All": "Pilih Semua",
    Export: Export$5,
    "Error": "Kesalahan",
    Loading: Loading$5,
    Preview: Preview$5,
    "File Name": "Nama File",
    "Export All": "Ekspor Semua",
    "Exporter Settings": "Pengaturan Pengekspor",
    "Export Dialog Title": "Ekspor Percakapan",
    "Invalid File Format": "Format File Tidak Valid",
    "Export from official export file": "Ekspor dari file ekspor resmi",
    "Export from API": "Ekspor dari API",
    "Available variables": "Variabel yang Tersedia",
    "Conversation Timestamp": "Timestamp Percakapan",
    "Conversation Timestamp Description": "Akan ditampilkan pada halaman.",
    "Enable on HTML": "Aktifkan pada file HTML",
    "Enable on Markdown": "Aktifkan pada file Markdown",
    "Use 24-hour format": "Gunakan format 24 jam (contohnya: 23:59)",
    "Export Format": "Format Ekspor",
    "Export Metadata": "Ekspor Metada",
    "Export Metadata Description": "Tambahkan metadata ke file Markdown dan HTML yang diekspor.",
    "OpenAI Official Format": "Format Resmi OpenAI",
    "Conversation Archive Alert": "Apakah Anda yakin ingin mengarsipkan semua percakapan yang dipilih?",
    "Conversation Archived Message": "Semua percakapan yang dipilih telah diarsipkan. Harap segarkan halaman untuk melihat perubahan.",
    "Conversation Delete Alert": "Apakah Anda yakin ingin menghapus semua percakapan yang dipilih?",
    "Conversation Deleted Message": "Semua percakapan yang dipilih telah dihapus. Harap segarkan halaman untuk melihat perubahan.",
    "Please start a conversation first": "Harap mulai percakapan terlebih dahulu.",
    "Select Project": "Pilih Proyek",
    "(no project)": "(tidak ada proyek)",
    "Export All Limit": "Batas Ekspor Semua",
    "Export All Limit Description": "Atur jumlah maksimum percakapan yang akan dimuat dalam dialog 'Ekspor Semua'."
  };
  const title$4 = "ChatGPTエクスポーター";
  const ExportHelper$4 = "エクスポート";
  const Setting$4 = "設定";
  const Language$4 = "言語";
  const Screenshot$4 = "スクリーンショット";
  const Markdown$4 = "Markdown";
  const HTML$4 = "HTML";
  const Archive$4 = "アーカイブ";
  const Save$4 = "保存";
  const Delete$4 = "削除";
  const Export$4 = "エクスポート";
  const Loading$4 = "読み込み中";
  const Preview$4 = "プレビュー";
  const ja_JP = {
    title: title$4,
    ExportHelper: ExportHelper$4,
    Setting: Setting$4,
    Language: Language$4,
    "Copy Text": "テキストをコピー",
    "Copied!": "コピーしました！",
    Screenshot: Screenshot$4,
    Markdown: Markdown$4,
    HTML: HTML$4,
    "JSON": "JSON",
    Archive: Archive$4,
    Save: Save$4,
    Delete: Delete$4,
    "Select All": "すべて選択",
    Export: Export$4,
    "Error": "エラー",
    Loading: Loading$4,
    Preview: Preview$4,
    "File Name": "ファイル名",
    "Export All": "すべてエクスポート",
    "Exporter Settings": "エクスポーター設定",
    "Export Dialog Title": "会話をエクスポート",
    "Invalid File Format": "無効なファイル形式",
    "Export from official export file": "公式エクスポートファイルからエクスポートする",
    "Export from API": "APIからエクスポートする",
    "Available variables": "使用可能な変数",
    "Conversation Timestamp": "会話のタイムスタンプ",
    "Conversation Timestamp Description": "ページに表示されます。",
    "Enable on HTML": "HTML ファイルで有効にする",
    "Enable on Markdown": "Markdown ファイルで有効にする",
    "Use 24-hour format": "24時間形式を使用する (例: 23:59)",
    "Export Format": "エクスポートフォーマット",
    "Export Metadata": "メタデータをエクスポート",
    "Export Metadata Description": "エクスポートされたMarkdownおよびHTMLファイルにメタデータを追加します。",
    "OpenAI Official Format": "OpenAI公式フォーマット",
    "Conversation Archive Alert": "選択したすべての会話をアーカイブしてもよろしいですか？",
    "Conversation Archived Message": "選択したすべての会話がアーカイブされました。変更を表示するには、ページを更新してください。",
    "Conversation Delete Alert": "選択したすべての会話を削除してもよろしいですか？",
    "Conversation Deleted Message": "選択したすべての会話が削除されました。変更を表示するには、ページを更新してください。",
    "Please start a conversation first": "まず会話を開始してください。",
    "Select Project": "プロジェクトを選択",
    "(no project)": "（プロジェクトなし）",
    "Export All Limit": "すべてエクスポートの上限",
    "Export All Limit Description": "「すべてエクスポート」ダイアログで読み込む会話の最大数を設定します。"
  };
  const title$3 = "ChatGPT Exporter";
  const ExportHelper$3 = "Export";
  const Setting$3 = "Параметры";
  const Language$3 = "Язык";
  const Screenshot$3 = "Скриншот";
  const Markdown$3 = "Markdown";
  const HTML$3 = "HTML";
  const Archive$3 = "Архивировать";
  const Save$3 = "Сохранить";
  const Delete$3 = "Удалить";
  const Export$3 = "Экспорт";
  const Loading$3 = "Загрузка";
  const Preview$3 = "Предпросмотр";
  const ru = {
    title: title$3,
    ExportHelper: ExportHelper$3,
    Setting: Setting$3,
    Language: Language$3,
    "Copy Text": "Копировать текст",
    "Copied!": "Скопировано!",
    Screenshot: Screenshot$3,
    Markdown: Markdown$3,
    HTML: HTML$3,
    "JSON": "JSON",
    Archive: Archive$3,
    Save: Save$3,
    Delete: Delete$3,
    "Select All": "Выбрать все",
    Export: Export$3,
    "Error": "Ошибка",
    Loading: Loading$3,
    Preview: Preview$3,
    "File Name": "Имя файла",
    "Export All": "Экспортировать все",
    "Exporter Settings": "Параметры экспорта",
    "Export Dialog Title": "Экспортировать беседы",
    "Invalid File Format": "Неверный формат файла",
    "Export from official export file": "Экспорт из официального файла",
    "Export from API": "Экспорт из API",
    "Available variables": "Доступные переменные",
    "Conversation Timestamp": "Временная метка разговора",
    "Conversation Timestamp Description": "Будет отображаться на странице.",
    "Enable on HTML": "Включить для HTML-файлов",
    "Enable on Markdown": "Включить для файлов Markdown",
    "Use 24-hour format": "Использовать 24-часовой формат (например, 23:59)",
    "Export Format": "Формат экспорта",
    "Export Metadata": "Экспорт метаданных",
    "Export Metadata Description": "Добавляйте метаданные в экспортированные файлы Markdown и HTML.",
    "OpenAI Official Format": "Официальный формат OpenAI",
    "Conversation Archive Alert": "Вы уверены, что хотите архивировать все выбранные разговоры?",
    "Conversation Archived Message": "Все выбранные разговоры были заархивированы. Пожалуйста, обновите страницу, чтобы увидеть изменения.",
    "Conversation Delete Alert": "Вы уверены, что хотите удалить все выбранные разговоры?",
    "Conversation Deleted Message": "Все выбранные разговоры были удалены. Пожалуйста, обновите страницу, чтобы увидеть изменения.",
    "Please start a conversation first": "Пожалуйста, начните разговор первым.",
    "Select Project": "Выберите проект",
    "(no project)": "(нет проекта)",
    "Export All Limit": "Лимит экспорта всех",
    "Export All Limit Description": "Установите максимальное количество бесед для загрузки в диалоге 'Экспортировать все'."
  };
  const title$2 = "ChatGPT Exporter";
  const ExportHelper$2 = "Dışa Aktar";
  const Setting$2 = "Ayarlar";
  const Language$2 = "Dil";
  const Screenshot$2 = "Ekran Alıntısı";
  const Markdown$2 = "Markdown";
  const HTML$2 = "HTML";
  const Archive$2 = "Arşiv";
  const Save$2 = "Kaydet";
  const Delete$2 = "Sil";
  const Export$2 = "Dışa Aktar";
  const Loading$2 = "Yükleniyor";
  const Preview$2 = "Önizleme";
  const tr_TR = {
    title: title$2,
    ExportHelper: ExportHelper$2,
    Setting: Setting$2,
    Language: Language$2,
    "Copy Text": "Metni Kopyala",
    "Copied!": "Kopyalandı!",
    Screenshot: Screenshot$2,
    Markdown: Markdown$2,
    HTML: HTML$2,
    "JSON": "JSON",
    Archive: Archive$2,
    Save: Save$2,
    Delete: Delete$2,
    "Select All": "Tümünü Seç",
    Export: Export$2,
    "Error": "Hata",
    Loading: Loading$2,
    Preview: Preview$2,
    "File Name": "Dosya Adı",
    "Export All": "Tümünü Dışa Aktar",
    "Exporter Settings": "Dışa Aktarma Ayarları",
    "Export Dialog Title": "Konuşmaları Dışa Aktar",
    "Invalid File Format": "Dosya Biçimi Geçersiz",
    "Export from official export file": "Resmi dışa aktarma dosyasından dışa aktar",
    "Export from API": "API'den dışa aktar",
    "Available variables": "Kullanılabilir değişkenler",
    "Conversation Timestamp": "Konuşma zaman bilgisi",
    "Conversation Timestamp Description": "Sayfada gösterilir.",
    "Enable on HTML": "HTML dosyalarında etkinleştir",
    "Enable on Markdown": "Markdown dosyalarında etkinleştir",
    "Use 24-hour format": "24 saat biçimini kullan (örn. 23:59)",
    "Export Format": "Dışa Aktarma Formatı",
    "Export Metadata": "Üst veriyi dışa aktar",
    "Export Metadata Description": "Dışa aktarılan Markdown ve HTML dosyalarına üst veri ekle",
    "OpenAI Official Format": "OpenAI Resmi Format",
    "Conversation Archive Alert": "Seçilen tüm konuşmaları arşivlemek istediğinizden emin misiniz?",
    "Conversation Archived Message": "Seçilen tüm konuşmalar arşivlendi. Değişiklikleri görmek için sayfayı yenileyin.",
    "Conversation Delete Alert": "Seçilen tüm konuşmaları silmek istediğinizden emin misiniz?",
    "Conversation Deleted Message": "Seçilen tüm konuşmalar silindi. Değişiklikleri görmek için sayfayı yenileyin.",
    "Please start a conversation first": "Lütfen önce bir konuşma başlatın.",
    "Select Project": "Proje Seç",
    "(no project)": "(proje yok)",
    "Export All Limit": "Tümünü Dışa Aktarma Limiti",
    "Export All Limit Description": "'Tümünü Dışa Aktar' iletişim kutusunda yüklenecek maksimum konuşma sayısını ayarlayın."
  };
  const title$1 = "ChatGPT Exporter";
  const ExportHelper$1 = "导出助手";
  const Setting$1 = "设置";
  const Language$1 = "语言";
  const Screenshot$1 = "截屏";
  const Markdown$1 = "Markdown";
  const HTML$1 = "HTML";
  const Archive$1 = "归档";
  const Save$1 = "保存";
  const Delete$1 = "删除";
  const Export$1 = "导出";
  const Loading$1 = "加载中";
  const Preview$1 = "预览";
  const zh_Hans = {
    title: title$1,
    ExportHelper: ExportHelper$1,
    Setting: Setting$1,
    Language: Language$1,
    "Copy Text": "复制文字",
    "Copied!": "已复制!",
    Screenshot: Screenshot$1,
    Markdown: Markdown$1,
    HTML: HTML$1,
    "JSON": "JSON",
    Archive: Archive$1,
    Save: Save$1,
    Delete: Delete$1,
    "Select All": "全选",
    Export: Export$1,
    "Error": "错误",
    Loading: Loading$1,
    Preview: Preview$1,
    "File Name": "文件名",
    "Export All": "批量导出",
    "Exporter Settings": "导出设置",
    "Export Dialog Title": "导出对话",
    "Invalid File Format": "无效的文件格式",
    "Export from official export file": "从官方导出文件导出",
    "Export from API": "从 API 导出",
    "Available variables": "可用变量",
    "Conversation Timestamp": "对话时间戳",
    "Conversation Timestamp Description": "会显示在页面上。",
    "Enable on HTML": "在 HTML 文件上启用",
    "Enable on Markdown": "在 Markdown 文件上启用",
    "Use 24-hour format": "使用24小时制 (例如 23:59)",
    "Export Format": "导出格式",
    "Export Metadata": "导出元数据",
    "Export Metadata Description": "会添加至 Markdown 以及 HTML 导出。",
    "OpenAI Official Format": "OpenAI 官方格式",
    "Conversation Archive Alert": "确定要归档所有选取的对话？",
    "Conversation Archived Message": "所有所选的对话已归档。请刷新页面。",
    "Conversation Delete Alert": "确定要删除所有选取的对话？",
    "Conversation Deleted Message": "所有所选的对话已删除。请刷新页面。",
    "Please start a conversation first": "请先开始对话。",
    "Select Project": "选择项目",
    "(no project)": "（无项目）",
    "Export All Limit": "批量导出上限",
    "Export All Limit Description": "设置“批量导出”对话框中加载的最大对话数量。"
  };
  const title = "ChatGPT Exporter";
  const ExportHelper = "Export";
  const Setting = "設定";
  const Language = "語言";
  const Screenshot = "截圖";
  const Markdown = "Markdown";
  const HTML = "HTML";
  const Archive = "封存";
  const Save = "保存";
  const Delete = "刪除";
  const Export = "匯出";
  const Loading = "載入中";
  const Preview = "預覽";
  const zh_Hant = {
    title,
    ExportHelper,
    Setting,
    Language,
    "Copy Text": "複製文字",
    "Copied!": "已複製!",
    Screenshot,
    Markdown,
    HTML,
    "JSON": "JSON",
    Archive,
    Save,
    Delete,
    "Select All": "全選",
    Export,
    "Error": "錯誤",
    Loading,
    Preview,
    "File Name": "檔案名稱",
    "Export All": "批量匯出",
    "Exporter Settings": "設定",
    "Export Dialog Title": "匯出對話",
    "Invalid File Format": "無效的檔案格式",
    "Export from official export file": "從官方匯出檔案匯出",
    "Export from API": "從 API 匯出",
    "Available variables": "可用變數",
    "Conversation Timestamp": "對話時間戳",
    "Conversation Timestamp Description": "會顯示在頁面上。",
    "Enable on HTML": "在 HTML 檔案上啟用",
    "Enable on Markdown": "在 Markdown 檔案上啟用",
    "Use 24-hour format": "使用24小時制 (例如 23:59)",
    "Export Format": "匯出格式",
    "Export Metadata": "匯出元資料",
    "Export Metadata Description": "會添加至 Markdown 以及 HTML 匯出。",
    "OpenAI Official Format": "OpenAI 官方格式",
    "Conversation Archive Alert": "確定要封存所有選取的對話？",
    "Conversation Archived Message": "所有選取的對話已封存。請重新整理頁面。",
    "Conversation Delete Alert": "確定要刪除所有選取的對話？",
    "Conversation Deleted Message": "所有選取的對話已刪除。請重新整理頁面。",
    "Please start a conversation first": "請先開始對話。",
    "Select Project": "選擇專案",
    "(no project)": "（無專案）",
    "Export All Limit": "批量匯出上限",
    "Export All Limit Description": "設定「批量匯出」對話方塊中載入的最大對話數量。"
  };
  class GMStorage {
    static get(key2) {
      const item = _GM_getValue(key2, "");
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
      _GM_setValue(key2, item);
    }
    static delete(key2) {
      _GM_deleteValue(key2);
    }
  }
  __publicField(GMStorage, "supported", typeof _GM_getValue === "function" && typeof _GM_setValue === "function" && typeof _GM_deleteValue === "function");
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
      if (!item) return null;
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
  const EN_US = {
    name: "English",
    code: "en-US",
    resource: en_US
  };
  const ES = {
    name: "Español",
    code: "es",
    resource: es
  };
  const FR = {
    name: "Français",
    code: "fr",
    resource: fr
  };
  const ID_ID = {
    name: "Indonesia",
    code: "id-ID",
    resource: id_ID
  };
  const JA_JP = {
    name: "日本語",
    code: "ja-JP",
    resource: ja_JP
  };
  const RU = {
    name: "Русский",
    code: "ru",
    resource: ru
  };
  const TR_TR = {
    name: "Türkçe",
    code: "tr-TR",
    resource: tr_TR
  };
  const ZH_Hans = {
    name: "简体中文",
    code: "zh-Hans",
    resource: zh_Hans
  };
  const ZH_Hant = {
    name: "繁體中文",
    code: "zh-Hant",
    resource: zh_Hant
  };
  const LOCALES = [
    EN_US,
    ES,
    FR,
    ID_ID,
    JA_JP,
    RU,
    TR_TR,
    ZH_Hans,
    ZH_Hant
  ];
  const LanguageMapping = {
    "en": EN_US.code,
    "en-US": EN_US.code,
    "es": ES.code,
    "es-ES": ES.code,
    "es-AR": ES.code,
    "es-CL": ES.code,
    "es-CO": ES.code,
    "es-MX": ES.code,
    "es-US": ES.code,
    "fr": FR.code,
    "fr-FR": FR.code,
    "id": ID_ID.code,
    "id-ID": ID_ID.code,
    "ja": JA_JP.code,
    "ja-JP": JA_JP.code,
    "ru": RU.code,
    "ru-RU": RU.code,
    "tr": TR_TR.code,
    "tr-TR": TR_TR.code,
    "zh": ZH_Hans.code,
    "zh-CN": ZH_Hans.code,
    "zh-MO": ZH_Hans.code,
    "zh-SG": ZH_Hans.code,
    "zh-Hans": ZH_Hans.code,
    "zh-HK": ZH_Hant.code,
    "zh-TW": ZH_Hant.code,
    "zh-Hant": ZH_Hant.code
  };
  const resources = LOCALES.reduce((acc, cur) => {
    acc[cur.code] = { translation: cur.resource };
    return acc;
  }, {});
  function standardizeLanguage(language) {
    if (!language) return null;
    if (language in LanguageMapping) return LanguageMapping[language];
    const shortLang = language.split("-")[0];
    if (shortLang in LanguageMapping) return LanguageMapping[shortLang];
    return null;
  }
  function getNavigatorLanguage() {
    const { language, languages } = navigator;
    if (language) return language;
    if (languages && languages.length) {
      return languages[0];
    }
    return null;
  }
  function getOaiLanguage() {
    var _a;
    const storedLanguage = (_a = window == null ? void 0 : window.localStorage) == null ? void 0 : _a.getItem(KEY_OAI_LOCALE);
    return (storedLanguage == null ? void 0 : storedLanguage.replace(/^"(.*)"$/, "$1")) ?? null;
  }
  function getDefaultLanguage() {
    const storedLanguage = ScriptStorage.get(KEY_LANGUAGE);
    const oaiLanguage = getOaiLanguage();
    const browserLanguage = getNavigatorLanguage();
    return standardizeLanguage(storedLanguage) ?? standardizeLanguage(oaiLanguage) ?? standardizeLanguage(browserLanguage) ?? EN_US.code;
  }
  instance$1.use(initReactI18next).init({
    fallbackLng: EN_US.code,
    lng: getDefaultLanguage(),
    debug: false,
    resources,
    interpolation: {
      escapeValue: false
      // not needed for react as it escapes by default
    }
  });
  instance$1.on("languageChanged", (lng) => {
    ScriptStorage.set(KEY_LANGUAGE, lng);
  });
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
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.3/katex.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.3/katex.min.js"><\/script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.3/contrib/auto-render.min.js"><\/script>
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            renderMathInElement(document.body, {
                delimiters: [
                    { left: "$$", right: "$$", display: true },
                    { left: "$", right: "$", display: false },
                    { left: "\\\\[", right: "\\\\]", display: true },
                    { left: "\\\\(", right: "\\\\)", display: false }
                ],
                throwOnError: false,
                ignoredClasses: ["no-katex"],
                preProcess: function(math) {
                    return \`\\\\displaystyle \\\\Large \${math}\`;
                }
            });
            document.querySelectorAll('.katex').forEach(function(el) {
                const parent = el.parentNode;
                const grandparent = parent.parentNode;
                if (grandparent.tagName === 'P' && isOnlyContent(grandparent, parent)) {
                    el.style.width = '100%';
                    el.style.display = 'block';
                    el.style.textAlign = 'center';
                    parent.style.textAlign = 'center';
                } else {
                    el.style.display = 'inline-block';
                    el.style.width = 'fit-content';
                }
            });
            function isOnlyContent(parent, element) {
                let onlyKaTeX = true;
                parent.childNodes.forEach(function(child) {
                    console.log(child.textContent);
                    if (child !== element) {
                        if (child.nodeType === Node.TEXT_NODE) {
                            if (child.textContent.trim().length > 0) {
                                onlyKaTeX = false;
                            }
                        } else if (child.nodeType === Node.ELEMENT_NODE) {
                            onlyKaTeX = false;
                        }
                    }
                });
                return onlyKaTeX;
            }
        });
    <\/script>

    <style>
        :root {
            --page-text: #0d0d0d;
            --page-bg: #fff;
            --td-borders: #374151;
            --th-borders: #4b5563;
            --tw-prose-code: var(--page-text);
            --tw-prose-counters: #9b9b9b;
            --tw-prose-headings: var(--page-text);
            --tw-prose-hr: rgba(0,0,0,.25);
            --tw-prose-links: var(--page-text);
            --tw-prose-quotes: var(--page-text);
            --meta-title: #616c77;
        }

        [data-theme="dark"] {
            --page-text: #ececec;
            --page-bg: #212121;
            --tw-prose-code: var(--page-text);
            --tw-prose-counters: #9b9b9b;
            --tw-prose-headings: var(--page-text);
            --tw-prose-hr: hsla(0,0%,100%,.25);
            --tw-prose-links: var(--page-text);
            --tw-prose-quotes: var(--page-text);
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

        [data-width="narrow"] .width-toggle .expand {
            display: block;
        }

        [data-width="wide"] .width-toggle .narrow {
            display: block;
        }

        .width-toggle {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            width: 32px;
            height: 32px;
            border-radius: 4px;
            background-color: #fff;
            border: 1px solid #e2e8f0;
            margin-left: 8px;
            cursor: pointer;
        }

        .width-toggle svg {
            display: none;
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
            border-bottom-color: var(--th-borders);
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
            border-bottom-color: var(--td-borders);
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
            padding: 1rem;
            max-width: 64rem;
        }

        [data-width="narrow"] .conversation {
            max-width: 64rem;
        }

        [data-width="wide"] .conversation {
            max-width: 90%;
        }

        @media (min-width: 1280px) {
            .conversation {
                max-width: 48rem;
            }
        }

        @media (min-width: 1024px) {
            .conversation {
                max-width: 40rem;
            }
        }

        @media (min-width: 768px) {
            .conversation {
                max-width: 48rem;
            }
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
                <button class="toggle width-toggle">
                    <svg class="expand" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="display: block;">
                        <path d="M3 12h18M6 8l-4 4 4 4M18 8l4 4-4 4"></path>
                    </svg>
                    <svg class="narrow" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="display: none;">
                        <path d="M3 12h7M14 12h7M6 16l4-4-4-4M18 16l-4-4 4-4"></path>
                    </svg>
                </button>
            </h1>
            <div class="conversation-export">
                <p>Exported by
                <a href="https://github.com/pionxzh/chatgpt-exporter.git">ChatGPT Exporter</a>
                at {{time}}</p>
            </div>
            {{details}}
        </div>

        {{content}}
    </div>


    <script>
        function toggleDarkMode(mode) {
            const html = document.querySelector('html');
            const isDarkMode = html.getAttribute('data-theme') === 'dark';
            const newMode = mode || (isDarkMode ? 'light' : 'dark');
            if (newMode !== 'dark' && newMode !== 'light') return;
            html.setAttribute('data-theme', newMode);

            const url = new URL(window.location);
            url.searchParams.set('theme', newMode);
            window.history.replaceState({}, '', url);
        }
        function toggleWidthMode(mode) {
            const body = document.querySelector('body');
            const widthToggleButton = document.querySelector('.width-toggle');
            const isWide = body.getAttribute('data-width') === 'wide';
            const newWidthMode = mode || (isWide ? 'narrow' : 'wide');
            if (newWidthMode !== 'narrow' && newWidthMode !== 'wide') return;
            body.setAttribute('data-width', newWidthMode);

            const url = new URL(window.location);
            url.searchParams.set('width', newWidthMode);
            window.history.replaceState({}, '', url);

            // Update the icon based on the current mode
            const narrowIcon = widthToggleButton.querySelector('.narrow');
            const expandIcon = widthToggleButton.querySelector('.expand');

            if (newWidthMode === 'wide') {
                expandIcon.style.display = "none";
                narrowIcon.style.display = "block";
            } else {
                expandIcon.style.display = "block";
                narrowIcon.style.display = "none";
            }
        }

        const urlParams = new URLSearchParams(window.location.search);
        const theme = urlParams.get('theme');
        const width = urlParams.get('width');

        if (theme) toggleDarkMode(theme);
        if (width) toggleWidthMode(width);

        document.querySelector('.toggle').addEventListener('click', () => toggleDarkMode());
        document.querySelector('.width-toggle').addEventListener('click', () => toggleWidthMode());
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
  var truncate$2 = function truncate(getLength2, string2, byteLength) {
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
  var truncate2 = browser;
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
    return truncate2(sanitized, 255);
  }
  var sanitizeFilename = function(input, options) {
    var replacement = options && options.replacement || "";
    var output2 = sanitize(input, replacement);
    if (replacement === "") {
      return output2;
    }
    return sanitize(output2, "");
  };
  const sanitize$1 = /* @__PURE__ */ getDefaultExportFromCjs(sanitizeFilename);
  function noop2() {
  }
  function nonNullable(x2) {
    return x2 != null;
  }
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
  function unixTimestampToISOString(timestamp2) {
    if (!timestamp2) return "";
    return new Date(timestamp2 * 1e3).toISOString();
  }
  function jsonlStringify(list2) {
    return list2.map((msg) => JSON.stringify(msg)).join("\n");
  }
  function downloadFile(filename, type, content2) {
    const blob = content2 instanceof Blob ? content2 : new Blob([content2], { type });
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
    title: title2 = document.title,
    // chatId will be empty when exporting all conversations
    chatId = "",
    // convert to seconds for unixTimestampToISOString which expects a unix
    // timestamp (in seconds). using Date.now() directly would pass
    // milliseconds which results in an invalid far future date.
    createTime = Math.floor(Date.now() / 1e3),
    updateTime = Math.floor(Date.now() / 1e3)
  } = {}) {
    const _title = sanitize$1(title2).replace(/\s+/g, "_");
    const _createTime = unixTimestampToISOString(createTime);
    const _updateTime = unixTimestampToISOString(updateTime);
    return format.replace("{title}", _title).replace("{date}", dateStr()).replace("{timestamp}", timestamp()).replace("{chat_id}", chatId).replace("{create_time}", _createTime).replace("{update_time}", _updateTime).concat(`.${ext}`);
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
    transform(_24, prop) {
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
    transform(_24, prop) {
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
    transform(_24, prop) {
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
      blocking: spaceSeparated,
      capture: null,
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
      fetchPriority: null,
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
      inert: boolean,
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
      onBeforeToggle: null,
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
      popover: null,
      popoverTarget: null,
      popoverTargetAction: null,
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
      shadowRootClonable: boolean,
      shadowRootDelegatesFocus: boolean,
      shadowRootMode: null,
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
      writingSuggestions: null,
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
      transformOrigin: "transform-origin",
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
      transformOrigin: null,
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
  function zwitch(key2, options) {
    const settings = options || {};
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
  const defaultSubsetRegex = /["&'<>`]/g;
  const surrogatePairsRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
  const controlCharactersRegex = (
    // eslint-disable-next-line no-control-regex, unicorn/no-hex-escape
    /[\x01-\t\v\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g
  );
  const regexEscapeRegex = /[|\\{}()[\]^$+*?.]/g;
  const subsetToRegexCache = /* @__PURE__ */ new WeakMap();
  function core(value, options) {
    value = value.replace(
      options.subset ? charactersToExpressionCached(options.subset) : defaultSubsetRegex,
      basic
    );
    if (options.subset || options.escapeOnly) {
      return value;
    }
    return value.replace(surrogatePairsRegex, surrogate).replace(controlCharactersRegex, basic);
    function surrogate(pair, index2, all2) {
      return options.format(
        (pair.charCodeAt(0) - 55296) * 1024 + pair.charCodeAt(1) - 56320 + 65536,
        all2.charCodeAt(index2 + 2),
        options
      );
    }
    function basic(character, index2, all2) {
      return options.format(
        character.charCodeAt(0),
        all2.charCodeAt(index2 + 1),
        options
      );
    }
  }
  function charactersToExpressionCached(subset) {
    let cached = subsetToRegexCache.get(subset);
    if (!cached) {
      cached = charactersToExpression(subset);
      subsetToRegexCache.set(subset, cached);
    }
    return cached;
  }
  function charactersToExpression(subset) {
    const groups = [];
    let index2 = -1;
    while (++index2 < subset.length) {
      groups.push(subset[index2].replace(regexEscapeRegex, "\\$&"));
    }
    return new RegExp("(?:" + groups.join("|") + ")", "g");
  }
  const hexadecimalRegex = /[\dA-Fa-f]/;
  function toHexadecimal(code2, next, omit) {
    const value = "&#x" + code2.toString(16).toUpperCase();
    return omit && next && !hexadecimalRegex.test(String.fromCharCode(next)) ? value : value + ";";
  }
  const decimalRegex = /\d/;
  function toDecimal(code2, next, omit) {
    const value = "&#" + String(code2);
    return omit && next && !decimalRegex.test(String.fromCharCode(next)) ? value : value + ";";
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
  const notAlphanumericRegex = /[^\dA-Za-z]/;
  function toNamed(code2, next, omit, attribute) {
    const character = String.fromCharCode(code2);
    if (own$5.call(characters, character)) {
      const name = characters[character];
      const value = "&" + name;
      if (omit && characterEntitiesLegacy.includes(name) && !dangerous.includes(name) && (!attribute || next && next !== 61 && notAlphanumericRegex.test(String.fromCharCode(next)))) {
        return value;
      }
      return value + ";";
    }
    return "";
  }
  function formatSmart(code2, next, options) {
    let numeric = toHexadecimal(code2, next, options.omitOptionalSemicolons);
    let named;
    if (options.useNamedReferences || options.useShortestReferences) {
      named = toNamed(
        code2,
        next,
        options.omitOptionalSemicolons,
        options.attribute
      );
    }
    if ((options.useShortestReferences || !named) && options.useShortestReferences) {
      const decimal = toDecimal(code2, next, options.omitOptionalSemicolons);
      if (decimal.length < numeric.length) {
        numeric = decimal;
      }
    }
    return named && (!options.useShortestReferences || named.length < numeric.length) ? named : numeric;
  }
  function stringifyEntities(value, options) {
    return core(value, Object.assign({ format: formatSmart }, options));
  }
  function comment(node2, _1, _24, state) {
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
  function doctype(_1, _24, _32, state) {
    return "<!" + (state.settings.upperDoctype ? "DOCTYPE" : "doctype") + (state.settings.tightDoctype ? "" : " ") + "html>";
  }
  function ccount(value, character) {
    const source = String(value);
    if (typeof character !== "string") {
      throw new TypeError("Expected character");
    }
    let count2 = 0;
    let index2 = source.indexOf(character);
    while (index2 !== -1) {
      count2++;
      index2 = source.indexOf(character, index2 + character.length);
    }
    return count2;
  }
  function stringify$1(values, options) {
    const settings = options || {};
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
      let offset2 = (index2 || 0) + increment2;
      let next = siblings2 && siblings2[offset2];
      if (!includeWhitespace) {
        while (next && whitespace(next)) {
          offset2 += increment2;
          next = siblings2[offset2];
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
    p: p$3,
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
  function headOrColgroupOrCaption(_24, index2, parent) {
    const next = siblingAfter(parent, index2, true);
    return !next || next.type !== "comment" && !(next.type === "text" && whitespace(next.value.charAt(0)));
  }
  function html$3(_24, index2, parent) {
    const next = siblingAfter(parent, index2);
    return !next || next.type !== "comment";
  }
  function body$1(_24, index2, parent) {
    const next = siblingAfter(parent, index2);
    return !next || next.type !== "comment";
  }
  function p$3(_24, index2, parent) {
    const next = siblingAfter(parent, index2);
    return next ? next.type === "element" && (next.tagName === "address" || next.tagName === "article" || next.tagName === "aside" || next.tagName === "blockquote" || next.tagName === "details" || next.tagName === "div" || next.tagName === "dl" || next.tagName === "fieldset" || next.tagName === "figcaption" || next.tagName === "figure" || next.tagName === "footer" || next.tagName === "form" || next.tagName === "h1" || next.tagName === "h2" || next.tagName === "h3" || next.tagName === "h4" || next.tagName === "h5" || next.tagName === "h6" || next.tagName === "header" || next.tagName === "hgroup" || next.tagName === "hr" || next.tagName === "main" || next.tagName === "menu" || next.tagName === "nav" || next.tagName === "ol" || next.tagName === "p" || next.tagName === "pre" || next.tagName === "section" || next.tagName === "table" || next.tagName === "ul") : !parent || // Confusing parent.
    !(parent.type === "element" && (parent.tagName === "a" || parent.tagName === "audio" || parent.tagName === "del" || parent.tagName === "ins" || parent.tagName === "map" || parent.tagName === "noscript" || parent.tagName === "video"));
  }
  function li(_24, index2, parent) {
    const next = siblingAfter(parent, index2);
    return !next || next.type === "element" && next.tagName === "li";
  }
  function dt(_24, index2, parent) {
    const next = siblingAfter(parent, index2);
    return next && next.type === "element" && (next.tagName === "dt" || next.tagName === "dd");
  }
  function dd(_24, index2, parent) {
    const next = siblingAfter(parent, index2);
    return !next || next.type === "element" && (next.tagName === "dt" || next.tagName === "dd");
  }
  function rubyElement(_24, index2, parent) {
    const next = siblingAfter(parent, index2);
    return !next || next.type === "element" && (next.tagName === "rp" || next.tagName === "rt");
  }
  function optgroup(_24, index2, parent) {
    const next = siblingAfter(parent, index2);
    return !next || next.type === "element" && next.tagName === "optgroup";
  }
  function option(_24, index2, parent) {
    const next = siblingAfter(parent, index2);
    return !next || next.type === "element" && (next.tagName === "option" || next.tagName === "optgroup");
  }
  function menuitem(_24, index2, parent) {
    const next = siblingAfter(parent, index2);
    return !next || next.type === "element" && (next.tagName === "menuitem" || next.tagName === "hr" || next.tagName === "menu");
  }
  function thead(_24, index2, parent) {
    const next = siblingAfter(parent, index2);
    return next && next.type === "element" && (next.tagName === "tbody" || next.tagName === "tfoot");
  }
  function tbody$1(_24, index2, parent) {
    const next = siblingAfter(parent, index2);
    return !next || next.type === "element" && (next.tagName === "tbody" || next.tagName === "tfoot");
  }
  function tfoot(_24, index2, parent) {
    return !siblingAfter(parent, index2);
  }
  function tr(_24, index2, parent) {
    const next = siblingAfter(parent, index2);
    return !next || next.type === "element" && next.tagName === "tr";
  }
  function cells(_24, index2, parent) {
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
        if (seen.includes(child.tagName)) return false;
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
    if (content2) selfClosing = false;
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
          if (value) values.push(value);
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
    if (value === true) return name;
    value = Array.isArray(value) ? (info.commaSeparated ? stringify$1 : stringify)(value, {
      padLeft: !state.settings.tightCommaSeparatedLists
    }) : String(value);
    if (state.settings.collapseEmptyAttributes && !value) return name;
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
  function text$5(node2, _24, parent, state) {
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
  function root$2(node2, _1, _24, state) {
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
  function toHtml$1(tree, options) {
    const options_ = {};
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
  function toString(value, options) {
    const settings = emptyOptions;
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
      list2.splice(...parameters);
    } else {
      if (remove) list2.splice(start, remove);
      while (chunkStart < items.length) {
        parameters = items.slice(chunkStart, chunkStart + 1e4);
        parameters.unshift(start, 0);
        list2.splice(...parameters);
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
      if (right) {
        for (code2 in right) {
          if (!hasOwnProperty.call(left, code2)) left[code2] = [];
          const value = right[code2];
          constructs(
            // @ts-expect-error Looks like a list.
            left[code2],
            Array.isArray(value) ? value : value ? [value] : []
          );
        }
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
  const unicodePunctuationRegex = /[!-\/:-@\[-`\{-~\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061D-\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1B7D\u1B7E\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52-\u2E5D\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]/;
  const asciiAlpha = regexCheck(/[A-Za-z]/);
  const asciiAlphanumeric = regexCheck(/[\dA-Za-z]/);
  const asciiAtext = regexCheck(/[#-'*+\--9=?A-Z^-~]/);
  function asciiControl(code2) {
    return (
      // Special whitespace codes (which have negative values), C0 and Control
      // character DEL
      code2 !== null && (code2 < 32 || code2 === 127)
    );
  }
  const asciiDigit = regexCheck(/\d/);
  const asciiHexDigit = regexCheck(/[\dA-Fa-f]/);
  const asciiPunctuation = regexCheck(/[!-/:-@[-`{-~]/);
  function markdownLineEnding(code2) {
    return code2 !== null && code2 < -2;
  }
  function markdownLineEndingOrSpace(code2) {
    return code2 !== null && (code2 < 0 || code2 === 32);
  }
  function markdownSpace(code2) {
    return code2 === -2 || code2 === -1 || code2 === 32;
  }
  const unicodePunctuation = regexCheck(unicodePunctuationRegex);
  const unicodeWhitespace = regexCheck(/\s/);
  function regexCheck(regex) {
    return check;
    function check(code2) {
      return code2 !== null && regex.test(String.fromCharCode(code2));
    }
  }
  function factorySpace(effects, ok2, type, max2) {
    const limit = max2 ? max2 - 1 : Number.POSITIVE_INFINITY;
    let size2 = 0;
    return start;
    function start(code2) {
      if (markdownSpace(code2)) {
        effects.enter(type);
        return prefix(code2);
      }
      return ok2(code2);
    }
    function prefix(code2) {
      if (markdownSpace(code2) && size2++ < limit) {
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
      if (childFlow) closeFlow();
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
        if (childFlow) closeFlow();
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
      if (eof) stream.push(null);
      token.previous = childToken;
      if (childToken) childToken.next = token;
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
    function exitContainers(size2) {
      let index2 = stack.length;
      while (index2-- > size2) {
        const entry = stack[index2];
        self2.containerState = entry[1];
        entry[0].exit.call(self2, effects);
      }
      stack.length = size2;
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
    let offset2;
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
              offset2 = 2;
              nextEvents = push(nextEvents, [
                ["enter", events[index2][1], context],
                ["exit", events[index2][1], context]
              ]);
            } else {
              offset2 = 0;
            }
            splice(events, open - 1, index2 - open + 3, nextEvents);
            index2 = open + nextEvents.length - offset2 - 2;
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
      marker = code2;
      effects.enter("attentionSequence");
      return inside(code2);
    }
    function inside(code2) {
      if (code2 === marker) {
        effects.consume(code2);
        return inside;
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
  function movePoint(point2, offset2) {
    point2.column += offset2;
    point2.offset += offset2;
    point2._bufferIndex += offset2;
  }
  const autolink = {
    name: "autolink",
    tokenize: tokenizeAutolink
  };
  function tokenizeAutolink(effects, ok2, nok) {
    let size2 = 0;
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
      return emailAtext(code2);
    }
    function schemeOrEmailAtext(code2) {
      if (code2 === 43 || code2 === 45 || code2 === 46 || asciiAlphanumeric(code2)) {
        size2 = 1;
        return schemeInsideOrEmailAtext(code2);
      }
      return emailAtext(code2);
    }
    function schemeInsideOrEmailAtext(code2) {
      if (code2 === 58) {
        effects.consume(code2);
        size2 = 0;
        return urlInside;
      }
      if ((code2 === 43 || code2 === 45 || code2 === 46 || asciiAlphanumeric(code2)) && size2++ < 32) {
        effects.consume(code2);
        return schemeInsideOrEmailAtext;
      }
      size2 = 0;
      return emailAtext(code2);
    }
    function urlInside(code2) {
      if (code2 === 62) {
        effects.exit("autolinkProtocol");
        effects.enter("autolinkMarker");
        effects.consume(code2);
        effects.exit("autolinkMarker");
        effects.exit("autolink");
        return ok2;
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
        size2 = 0;
        return emailAtSignOrDot;
      }
      if (code2 === 62) {
        effects.exit("autolinkProtocol").type = "autolinkEmail";
        effects.enter("autolinkMarker");
        effects.consume(code2);
        effects.exit("autolinkMarker");
        effects.exit("autolink");
        return ok2;
      }
      return emailValue(code2);
    }
    function emailValue(code2) {
      if ((code2 === 45 || asciiAlphanumeric(code2)) && size2++ < 63) {
        const next = code2 === 45 ? emailValue : emailLabel;
        effects.consume(code2);
        return next;
      }
      return nok(code2);
    }
  }
  const blankLine = {
    tokenize: tokenizeBlankLine,
    partial: true
  };
  function tokenizeBlankLine(effects, ok2, nok) {
    return start;
    function start(code2) {
      return markdownSpace(code2) ? factorySpace(effects, after, "linePrefix")(code2) : after(code2);
    }
    function after(code2) {
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
    const self2 = this;
    return contStart;
    function contStart(code2) {
      if (markdownSpace(code2)) {
        return factorySpace(
          effects,
          contBefore,
          "linePrefix",
          self2.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4
        )(code2);
      }
      return contBefore(code2);
    }
    function contBefore(code2) {
      return effects.attempt(blockQuote, ok2, nok)(code2);
    }
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
      return inside;
    }
    function inside(code2) {
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
    const character = element.textContent;
    if (
      // @ts-expect-error: TypeScript is wrong that `textContent` on elements can
      // yield `null`.
      character.charCodeAt(character.length - 1) === 59 && value !== "semi"
    ) {
      return false;
    }
    return character === characterReference2 ? false : character;
  }
  const characterReference = {
    name: "characterReference",
    tokenize: tokenizeCharacterReference
  };
  function tokenizeCharacterReference(effects, ok2, nok) {
    const self2 = this;
    let size2 = 0;
    let max2;
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
      max2 = 31;
      test = asciiAlphanumeric;
      return value(code2);
    }
    function numeric(code2) {
      if (code2 === 88 || code2 === 120) {
        effects.enter("characterReferenceMarkerHexadecimal");
        effects.consume(code2);
        effects.exit("characterReferenceMarkerHexadecimal");
        effects.enter("characterReferenceValue");
        max2 = 6;
        test = asciiHexDigit;
        return value;
      }
      effects.enter("characterReferenceValue");
      max2 = 7;
      test = asciiDigit;
      return value(code2);
    }
    function value(code2) {
      if (code2 === 59 && size2) {
        const token = effects.exit("characterReferenceValue");
        if (test === asciiAlphanumeric && !decodeNamedCharacterReference(self2.sliceSerialize(token))) {
          return nok(code2);
        }
        effects.enter("characterReferenceMarker");
        effects.consume(code2);
        effects.exit("characterReferenceMarker");
        effects.exit("characterReference");
        return ok2;
      }
      if (test(code2) && size2++ < max2) {
        effects.consume(code2);
        return value;
      }
      return nok(code2);
    }
  }
  const nonLazyContinuation = {
    tokenize: tokenizeNonLazyContinuation,
    partial: true
  };
  const codeFenced = {
    name: "codeFenced",
    tokenize: tokenizeCodeFenced,
    concrete: true
  };
  function tokenizeCodeFenced(effects, ok2, nok) {
    const self2 = this;
    const closeStart = {
      tokenize: tokenizeCloseStart,
      partial: true
    };
    let initialPrefix = 0;
    let sizeOpen = 0;
    let marker;
    return start;
    function start(code2) {
      return beforeSequenceOpen(code2);
    }
    function beforeSequenceOpen(code2) {
      const tail = self2.events[self2.events.length - 1];
      initialPrefix = tail && tail[1].type === "linePrefix" ? tail[2].sliceSerialize(tail[1], true).length : 0;
      marker = code2;
      effects.enter("codeFenced");
      effects.enter("codeFencedFence");
      effects.enter("codeFencedFenceSequence");
      return sequenceOpen(code2);
    }
    function sequenceOpen(code2) {
      if (code2 === marker) {
        sizeOpen++;
        effects.consume(code2);
        return sequenceOpen;
      }
      if (sizeOpen < 3) {
        return nok(code2);
      }
      effects.exit("codeFencedFenceSequence");
      return markdownSpace(code2) ? factorySpace(effects, infoBefore, "whitespace")(code2) : infoBefore(code2);
    }
    function infoBefore(code2) {
      if (code2 === null || markdownLineEnding(code2)) {
        effects.exit("codeFencedFence");
        return self2.interrupt ? ok2(code2) : effects.check(nonLazyContinuation, atNonLazyBreak, after)(code2);
      }
      effects.enter("codeFencedFenceInfo");
      effects.enter("chunkString", {
        contentType: "string"
      });
      return info(code2);
    }
    function info(code2) {
      if (code2 === null || markdownLineEnding(code2)) {
        effects.exit("chunkString");
        effects.exit("codeFencedFenceInfo");
        return infoBefore(code2);
      }
      if (markdownSpace(code2)) {
        effects.exit("chunkString");
        effects.exit("codeFencedFenceInfo");
        return factorySpace(effects, metaBefore, "whitespace")(code2);
      }
      if (code2 === 96 && code2 === marker) {
        return nok(code2);
      }
      effects.consume(code2);
      return info;
    }
    function metaBefore(code2) {
      if (code2 === null || markdownLineEnding(code2)) {
        return infoBefore(code2);
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
        return infoBefore(code2);
      }
      if (code2 === 96 && code2 === marker) {
        return nok(code2);
      }
      effects.consume(code2);
      return meta;
    }
    function atNonLazyBreak(code2) {
      return effects.attempt(closeStart, after, contentBefore)(code2);
    }
    function contentBefore(code2) {
      effects.enter("lineEnding");
      effects.consume(code2);
      effects.exit("lineEnding");
      return contentStart;
    }
    function contentStart(code2) {
      return initialPrefix > 0 && markdownSpace(code2) ? factorySpace(
        effects,
        beforeContentChunk,
        "linePrefix",
        initialPrefix + 1
      )(code2) : beforeContentChunk(code2);
    }
    function beforeContentChunk(code2) {
      if (code2 === null || markdownLineEnding(code2)) {
        return effects.check(nonLazyContinuation, atNonLazyBreak, after)(code2);
      }
      effects.enter("codeFlowValue");
      return contentChunk(code2);
    }
    function contentChunk(code2) {
      if (code2 === null || markdownLineEnding(code2)) {
        effects.exit("codeFlowValue");
        return beforeContentChunk(code2);
      }
      effects.consume(code2);
      return contentChunk;
    }
    function after(code2) {
      effects.exit("codeFenced");
      return ok2(code2);
    }
    function tokenizeCloseStart(effects2, ok3, nok2) {
      let size2 = 0;
      return startBefore;
      function startBefore(code2) {
        effects2.enter("lineEnding");
        effects2.consume(code2);
        effects2.exit("lineEnding");
        return start2;
      }
      function start2(code2) {
        effects2.enter("codeFencedFence");
        return markdownSpace(code2) ? factorySpace(
          effects2,
          beforeSequenceClose,
          "linePrefix",
          self2.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4
        )(code2) : beforeSequenceClose(code2);
      }
      function beforeSequenceClose(code2) {
        if (code2 === marker) {
          effects2.enter("codeFencedFenceSequence");
          return sequenceClose(code2);
        }
        return nok2(code2);
      }
      function sequenceClose(code2) {
        if (code2 === marker) {
          size2++;
          effects2.consume(code2);
          return sequenceClose;
        }
        if (size2 >= sizeOpen) {
          effects2.exit("codeFencedFenceSequence");
          return markdownSpace(code2) ? factorySpace(effects2, sequenceCloseAfter, "whitespace")(code2) : sequenceCloseAfter(code2);
        }
        return nok2(code2);
      }
      function sequenceCloseAfter(code2) {
        if (code2 === null || markdownLineEnding(code2)) {
          effects2.exit("codeFencedFence");
          return ok3(code2);
        }
        return nok2(code2);
      }
    }
  }
  function tokenizeNonLazyContinuation(effects, ok2, nok) {
    const self2 = this;
    return start;
    function start(code2) {
      if (code2 === null) {
        return nok(code2);
      }
      effects.enter("lineEnding");
      effects.consume(code2);
      effects.exit("lineEnding");
      return lineStart;
    }
    function lineStart(code2) {
      return self2.parser.lazy[self2.now().line] ? nok(code2) : ok2(code2);
    }
  }
  const codeIndented = {
    name: "codeIndented",
    tokenize: tokenizeCodeIndented
  };
  const furtherStart = {
    tokenize: tokenizeFurtherStart,
    partial: true
  };
  function tokenizeCodeIndented(effects, ok2, nok) {
    const self2 = this;
    return start;
    function start(code2) {
      effects.enter("codeIndented");
      return factorySpace(effects, afterPrefix, "linePrefix", 4 + 1)(code2);
    }
    function afterPrefix(code2) {
      const tail = self2.events[self2.events.length - 1];
      return tail && tail[1].type === "linePrefix" && tail[2].sliceSerialize(tail[1], true).length >= 4 ? atBreak(code2) : nok(code2);
    }
    function atBreak(code2) {
      if (code2 === null) {
        return after(code2);
      }
      if (markdownLineEnding(code2)) {
        return effects.attempt(furtherStart, atBreak, after)(code2);
      }
      effects.enter("codeFlowValue");
      return inside(code2);
    }
    function inside(code2) {
      if (code2 === null || markdownLineEnding(code2)) {
        effects.exit("codeFlowValue");
        return atBreak(code2);
      }
      effects.consume(code2);
      return inside;
    }
    function after(code2) {
      effects.exit("codeIndented");
      return ok2(code2);
    }
  }
  function tokenizeFurtherStart(effects, ok2, nok) {
    const self2 = this;
    return furtherStart2;
    function furtherStart2(code2) {
      if (self2.parser.lazy[self2.now().line]) {
        return nok(code2);
      }
      if (markdownLineEnding(code2)) {
        effects.enter("lineEnding");
        effects.consume(code2);
        effects.exit("lineEnding");
        return furtherStart2;
      }
      return factorySpace(effects, afterPrefix, "linePrefix", 4 + 1)(code2);
    }
    function afterPrefix(code2) {
      const tail = self2.events[self2.events.length - 1];
      return tail && tail[1].type === "linePrefix" && tail[2].sliceSerialize(tail[1], true).length >= 4 ? ok2(code2) : markdownLineEnding(code2) ? furtherStart2(code2) : nok(code2);
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
    let size2;
    let token;
    return start;
    function start(code2) {
      effects.enter("codeText");
      effects.enter("codeTextSequence");
      return sequenceOpen(code2);
    }
    function sequenceOpen(code2) {
      if (code2 === 96) {
        effects.consume(code2);
        sizeOpen++;
        return sequenceOpen;
      }
      effects.exit("codeTextSequence");
      return between2(code2);
    }
    function between2(code2) {
      if (code2 === null) {
        return nok(code2);
      }
      if (code2 === 32) {
        effects.enter("space");
        effects.consume(code2);
        effects.exit("space");
        return between2;
      }
      if (code2 === 96) {
        token = effects.enter("codeTextSequence");
        size2 = 0;
        return sequenceClose(code2);
      }
      if (markdownLineEnding(code2)) {
        effects.enter("lineEnding");
        effects.consume(code2);
        effects.exit("lineEnding");
        return between2;
      }
      effects.enter("codeTextData");
      return data(code2);
    }
    function data(code2) {
      if (code2 === null || code2 === 32 || code2 === 96 || markdownLineEnding(code2)) {
        effects.exit("codeTextData");
        return between2(code2);
      }
      effects.consume(code2);
      return data;
    }
    function sequenceClose(code2) {
      if (code2 === 96) {
        effects.consume(code2);
        size2++;
        return sequenceClose;
      }
      if (size2 === sizeOpen) {
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
    return chunkStart;
    function chunkStart(code2) {
      effects.enter("content");
      previous2 = effects.enter("chunkContent", {
        contentType: "content"
      });
      return chunkInside(code2);
    }
    function chunkInside(code2) {
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
      return chunkInside;
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
      return chunkInside;
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
  function factoryDestination(effects, ok2, nok, type, literalType, literalMarkerType, rawType, stringType, max2) {
    const limit = max2 || Number.POSITIVE_INFINITY;
    let balance = 0;
    return start;
    function start(code2) {
      if (code2 === 60) {
        effects.enter(type);
        effects.enter(literalType);
        effects.enter(literalMarkerType);
        effects.consume(code2);
        effects.exit(literalMarkerType);
        return enclosedBefore;
      }
      if (code2 === null || code2 === 32 || code2 === 41 || asciiControl(code2)) {
        return nok(code2);
      }
      effects.enter(type);
      effects.enter(rawType);
      effects.enter(stringType);
      effects.enter("chunkString", {
        contentType: "string"
      });
      return raw2(code2);
    }
    function enclosedBefore(code2) {
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
      return enclosed(code2);
    }
    function enclosed(code2) {
      if (code2 === 62) {
        effects.exit("chunkString");
        effects.exit(stringType);
        return enclosedBefore(code2);
      }
      if (code2 === null || code2 === 60 || markdownLineEnding(code2)) {
        return nok(code2);
      }
      effects.consume(code2);
      return code2 === 92 ? enclosedEscape : enclosed;
    }
    function enclosedEscape(code2) {
      if (code2 === 60 || code2 === 62 || code2 === 92) {
        effects.consume(code2);
        return enclosed;
      }
      return enclosed(code2);
    }
    function raw2(code2) {
      if (!balance && (code2 === null || code2 === 41 || markdownLineEndingOrSpace(code2))) {
        effects.exit("chunkString");
        effects.exit(stringType);
        effects.exit(rawType);
        effects.exit(type);
        return ok2(code2);
      }
      if (balance < limit && code2 === 40) {
        effects.consume(code2);
        balance++;
        return raw2;
      }
      if (code2 === 41) {
        effects.consume(code2);
        balance--;
        return raw2;
      }
      if (code2 === null || code2 === 32 || code2 === 40 || asciiControl(code2)) {
        return nok(code2);
      }
      effects.consume(code2);
      return code2 === 92 ? rawEscape : raw2;
    }
    function rawEscape(code2) {
      if (code2 === 40 || code2 === 41 || code2 === 92) {
        effects.consume(code2);
        return raw2;
      }
      return raw2(code2);
    }
  }
  function factoryLabel(effects, ok2, nok, type, markerType, stringType) {
    const self2 = this;
    let size2 = 0;
    let seen;
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
      if (size2 > 999 || code2 === null || code2 === 91 || code2 === 93 && !seen || // To do: remove in the future once we’ve switched from
      // `micromark-extension-footnote` to `micromark-extension-gfm-footnote`,
      // which doesn’t need this.
      // Hidden footnotes hook.
      /* c8 ignore next 3 */
      code2 === 94 && !size2 && "_hiddenFootnoteSupport" in self2.parser.constructs) {
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
      return labelInside(code2);
    }
    function labelInside(code2) {
      if (code2 === null || code2 === 91 || code2 === 93 || markdownLineEnding(code2) || size2++ > 999) {
        effects.exit("chunkString");
        return atBreak(code2);
      }
      effects.consume(code2);
      if (!seen) seen = !markdownSpace(code2);
      return code2 === 92 ? labelEscape : labelInside;
    }
    function labelEscape(code2) {
      if (code2 === 91 || code2 === 92 || code2 === 93) {
        effects.consume(code2);
        size2++;
        return labelInside;
      }
      return labelInside(code2);
    }
  }
  function factoryTitle(effects, ok2, nok, type, markerType, stringType) {
    let marker;
    return start;
    function start(code2) {
      if (code2 === 34 || code2 === 39 || code2 === 40) {
        effects.enter(type);
        effects.enter(markerType);
        effects.consume(code2);
        effects.exit(markerType);
        marker = code2 === 40 ? 41 : code2;
        return begin;
      }
      return nok(code2);
    }
    function begin(code2) {
      if (code2 === marker) {
        effects.enter(markerType);
        effects.consume(code2);
        effects.exit(markerType);
        effects.exit(type);
        return ok2;
      }
      effects.enter(stringType);
      return atBreak(code2);
    }
    function atBreak(code2) {
      if (code2 === marker) {
        effects.exit(stringType);
        return begin(marker);
      }
      if (code2 === null) {
        return nok(code2);
      }
      if (markdownLineEnding(code2)) {
        effects.enter("lineEnding");
        effects.consume(code2);
        effects.exit("lineEnding");
        return factorySpace(effects, atBreak, "linePrefix");
      }
      effects.enter("chunkString", {
        contentType: "string"
      });
      return inside(code2);
    }
    function inside(code2) {
      if (code2 === marker || code2 === null || markdownLineEnding(code2)) {
        effects.exit("chunkString");
        return atBreak(code2);
      }
      effects.consume(code2);
      return code2 === 92 ? escape2 : inside;
    }
    function escape2(code2) {
      if (code2 === marker || code2 === 92) {
        effects.consume(code2);
        return inside;
      }
      return inside(code2);
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
  const titleBefore = {
    tokenize: tokenizeTitleBefore,
    partial: true
  };
  function tokenizeDefinition(effects, ok2, nok) {
    const self2 = this;
    let identifier;
    return start;
    function start(code2) {
      effects.enter("definition");
      return before(code2);
    }
    function before(code2) {
      return factoryLabel.call(
        self2,
        effects,
        labelAfter,
        // Note: we don’t need to reset the way `markdown-rs` does.
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
        return markerAfter;
      }
      return nok(code2);
    }
    function markerAfter(code2) {
      return markdownLineEndingOrSpace(code2) ? factoryWhitespace(effects, destinationBefore)(code2) : destinationBefore(code2);
    }
    function destinationBefore(code2) {
      return factoryDestination(
        effects,
        destinationAfter,
        // Note: we don’t need to reset the way `markdown-rs` does.
        nok,
        "definitionDestination",
        "definitionDestinationLiteral",
        "definitionDestinationLiteralMarker",
        "definitionDestinationRaw",
        "definitionDestinationString"
      )(code2);
    }
    function destinationAfter(code2) {
      return effects.attempt(titleBefore, after, after)(code2);
    }
    function after(code2) {
      return markdownSpace(code2) ? factorySpace(effects, afterWhitespace, "whitespace")(code2) : afterWhitespace(code2);
    }
    function afterWhitespace(code2) {
      if (code2 === null || markdownLineEnding(code2)) {
        effects.exit("definition");
        self2.parser.defined.push(identifier);
        return ok2(code2);
      }
      return nok(code2);
    }
  }
  function tokenizeTitleBefore(effects, ok2, nok) {
    return titleBefore2;
    function titleBefore2(code2) {
      return markdownLineEndingOrSpace(code2) ? factoryWhitespace(effects, beforeMarker)(code2) : nok(code2);
    }
    function beforeMarker(code2) {
      return factoryTitle(
        effects,
        titleAfter,
        nok,
        "definitionTitle",
        "definitionTitleMarker",
        "definitionTitleString"
      )(code2);
    }
    function titleAfter(code2) {
      return markdownSpace(code2) ? factorySpace(effects, titleAfterOptionalWhitespace, "whitespace")(code2) : titleAfterOptionalWhitespace(code2);
    }
    function titleAfterOptionalWhitespace(code2) {
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
      effects.consume(code2);
      return after;
    }
    function after(code2) {
      if (markdownLineEnding(code2)) {
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
    let size2 = 0;
    return start;
    function start(code2) {
      effects.enter("atxHeading");
      return before(code2);
    }
    function before(code2) {
      effects.enter("atxHeadingSequence");
      return sequenceOpen(code2);
    }
    function sequenceOpen(code2) {
      if (code2 === 35 && size2++ < 6) {
        effects.consume(code2);
        return sequenceOpen;
      }
      if (code2 === null || markdownLineEndingOrSpace(code2)) {
        effects.exit("atxHeadingSequence");
        return atBreak(code2);
      }
      return nok(code2);
    }
    function atBreak(code2) {
      if (code2 === 35) {
        effects.enter("atxHeadingSequence");
        return sequenceFurther(code2);
      }
      if (code2 === null || markdownLineEnding(code2)) {
        effects.exit("atxHeading");
        return ok2(code2);
      }
      if (markdownSpace(code2)) {
        return factorySpace(effects, atBreak, "whitespace")(code2);
      }
      effects.enter("atxHeadingText");
      return data(code2);
    }
    function sequenceFurther(code2) {
      if (code2 === 35) {
        effects.consume(code2);
        return sequenceFurther;
      }
      effects.exit("atxHeadingSequence");
      return atBreak(code2);
    }
    function data(code2) {
      if (code2 === null || code2 === 35 || markdownLineEndingOrSpace(code2)) {
        effects.exit("atxHeadingText");
        return atBreak(code2);
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
    "search",
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
  const blankLineBefore = {
    tokenize: tokenizeBlankLineBefore,
    partial: true
  };
  const nonLazyContinuationStart = {
    tokenize: tokenizeNonLazyContinuationStart,
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
    let marker;
    let closingTag;
    let buffer;
    let index2;
    let markerB;
    return start;
    function start(code2) {
      return before(code2);
    }
    function before(code2) {
      effects.enter("htmlFlow");
      effects.enter("htmlFlowData");
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
        closingTag = true;
        return tagCloseStart;
      }
      if (code2 === 63) {
        effects.consume(code2);
        marker = 3;
        return self2.interrupt ? ok2 : continuationDeclarationInside;
      }
      if (asciiAlpha(code2)) {
        effects.consume(code2);
        buffer = String.fromCharCode(code2);
        return tagName;
      }
      return nok(code2);
    }
    function declarationOpen(code2) {
      if (code2 === 45) {
        effects.consume(code2);
        marker = 2;
        return commentOpenInside;
      }
      if (code2 === 91) {
        effects.consume(code2);
        marker = 5;
        index2 = 0;
        return cdataOpenInside;
      }
      if (asciiAlpha(code2)) {
        effects.consume(code2);
        marker = 4;
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
      const value = "CDATA[";
      if (code2 === value.charCodeAt(index2++)) {
        effects.consume(code2);
        if (index2 === value.length) {
          return self2.interrupt ? ok2 : continuation;
        }
        return cdataOpenInside;
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
        const slash = code2 === 47;
        const name = buffer.toLowerCase();
        if (!slash && !closingTag && htmlRawNames.includes(name)) {
          marker = 1;
          return self2.interrupt ? ok2(code2) : continuation(code2);
        }
        if (htmlBlockNames.includes(buffer.toLowerCase())) {
          marker = 6;
          if (slash) {
            effects.consume(code2);
            return basicSelfClosing;
          }
          return self2.interrupt ? ok2(code2) : continuation(code2);
        }
        marker = 7;
        return self2.interrupt && !self2.parser.lazy[self2.now().line] ? nok(code2) : closingTag ? completeClosingTagAfter(code2) : completeAttributeNameBefore(code2);
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
        markerB = code2;
        return completeAttributeValueQuoted;
      }
      if (markdownSpace(code2)) {
        effects.consume(code2);
        return completeAttributeValueBefore;
      }
      return completeAttributeValueUnquoted(code2);
    }
    function completeAttributeValueQuoted(code2) {
      if (code2 === markerB) {
        effects.consume(code2);
        markerB = null;
        return completeAttributeValueQuotedAfter;
      }
      if (code2 === null || markdownLineEnding(code2)) {
        return nok(code2);
      }
      effects.consume(code2);
      return completeAttributeValueQuoted;
    }
    function completeAttributeValueUnquoted(code2) {
      if (code2 === null || code2 === 34 || code2 === 39 || code2 === 47 || code2 === 60 || code2 === 61 || code2 === 62 || code2 === 96 || markdownLineEndingOrSpace(code2)) {
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
      if (code2 === null || markdownLineEnding(code2)) {
        return continuation(code2);
      }
      if (markdownSpace(code2)) {
        effects.consume(code2);
        return completeAfter;
      }
      return nok(code2);
    }
    function continuation(code2) {
      if (code2 === 45 && marker === 2) {
        effects.consume(code2);
        return continuationCommentInside;
      }
      if (code2 === 60 && marker === 1) {
        effects.consume(code2);
        return continuationRawTagOpen;
      }
      if (code2 === 62 && marker === 4) {
        effects.consume(code2);
        return continuationClose;
      }
      if (code2 === 63 && marker === 3) {
        effects.consume(code2);
        return continuationDeclarationInside;
      }
      if (code2 === 93 && marker === 5) {
        effects.consume(code2);
        return continuationCdataInside;
      }
      if (markdownLineEnding(code2) && (marker === 6 || marker === 7)) {
        effects.exit("htmlFlowData");
        return effects.check(
          blankLineBefore,
          continuationAfter,
          continuationStart
        )(code2);
      }
      if (code2 === null || markdownLineEnding(code2)) {
        effects.exit("htmlFlowData");
        return continuationStart(code2);
      }
      effects.consume(code2);
      return continuation;
    }
    function continuationStart(code2) {
      return effects.check(
        nonLazyContinuationStart,
        continuationStartNonLazy,
        continuationAfter
      )(code2);
    }
    function continuationStartNonLazy(code2) {
      effects.enter("lineEnding");
      effects.consume(code2);
      effects.exit("lineEnding");
      return continuationBefore;
    }
    function continuationBefore(code2) {
      if (code2 === null || markdownLineEnding(code2)) {
        return continuationStart(code2);
      }
      effects.enter("htmlFlowData");
      return continuation(code2);
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
      if (code2 === 62) {
        const name = buffer.toLowerCase();
        if (htmlRawNames.includes(name)) {
          effects.consume(code2);
          return continuationClose;
        }
        return continuation(code2);
      }
      if (asciiAlpha(code2) && buffer.length < 8) {
        effects.consume(code2);
        buffer += String.fromCharCode(code2);
        return continuationRawEndTag;
      }
      return continuation(code2);
    }
    function continuationCdataInside(code2) {
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
      if (code2 === 45 && marker === 2) {
        effects.consume(code2);
        return continuationDeclarationInside;
      }
      return continuation(code2);
    }
    function continuationClose(code2) {
      if (code2 === null || markdownLineEnding(code2)) {
        effects.exit("htmlFlowData");
        return continuationAfter(code2);
      }
      effects.consume(code2);
      return continuationClose;
    }
    function continuationAfter(code2) {
      effects.exit("htmlFlow");
      return ok2(code2);
    }
  }
  function tokenizeNonLazyContinuationStart(effects, ok2, nok) {
    const self2 = this;
    return start;
    function start(code2) {
      if (markdownLineEnding(code2)) {
        effects.enter("lineEnding");
        effects.consume(code2);
        effects.exit("lineEnding");
        return after;
      }
      return nok(code2);
    }
    function after(code2) {
      return self2.parser.lazy[self2.now().line] ? nok(code2) : ok2(code2);
    }
  }
  function tokenizeBlankLineBefore(effects, ok2, nok) {
    return start;
    function start(code2) {
      effects.enter("lineEnding");
      effects.consume(code2);
      effects.exit("lineEnding");
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
        return commentOpenInside;
      }
      if (code2 === 91) {
        effects.consume(code2);
        index2 = 0;
        return cdataOpenInside;
      }
      if (asciiAlpha(code2)) {
        effects.consume(code2);
        return declaration;
      }
      return nok(code2);
    }
    function commentOpenInside(code2) {
      if (code2 === 45) {
        effects.consume(code2);
        return commentEnd;
      }
      return nok(code2);
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
        return lineEndingBefore(code2);
      }
      effects.consume(code2);
      return comment2;
    }
    function commentClose(code2) {
      if (code2 === 45) {
        effects.consume(code2);
        return commentEnd;
      }
      return comment2(code2);
    }
    function commentEnd(code2) {
      return code2 === 62 ? end(code2) : code2 === 45 ? commentClose(code2) : comment2(code2);
    }
    function cdataOpenInside(code2) {
      const value = "CDATA[";
      if (code2 === value.charCodeAt(index2++)) {
        effects.consume(code2);
        return index2 === value.length ? cdata : cdataOpenInside;
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
        return lineEndingBefore(code2);
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
        return lineEndingBefore(code2);
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
        return lineEndingBefore(code2);
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
        return lineEndingBefore(code2);
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
        return lineEndingBefore(code2);
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
        return lineEndingBefore(code2);
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
        return lineEndingBefore(code2);
      }
      if (markdownSpace(code2)) {
        effects.consume(code2);
        return tagOpenAttributeValueBefore;
      }
      effects.consume(code2);
      return tagOpenAttributeValueUnquoted;
    }
    function tagOpenAttributeValueQuoted(code2) {
      if (code2 === marker) {
        effects.consume(code2);
        marker = void 0;
        return tagOpenAttributeValueQuotedAfter;
      }
      if (code2 === null) {
        return nok(code2);
      }
      if (markdownLineEnding(code2)) {
        returnState = tagOpenAttributeValueQuoted;
        return lineEndingBefore(code2);
      }
      effects.consume(code2);
      return tagOpenAttributeValueQuoted;
    }
    function tagOpenAttributeValueUnquoted(code2) {
      if (code2 === null || code2 === 34 || code2 === 39 || code2 === 60 || code2 === 61 || code2 === 96) {
        return nok(code2);
      }
      if (code2 === 47 || code2 === 62 || markdownLineEndingOrSpace(code2)) {
        return tagOpenBetween(code2);
      }
      effects.consume(code2);
      return tagOpenAttributeValueUnquoted;
    }
    function tagOpenAttributeValueQuotedAfter(code2) {
      if (code2 === 47 || code2 === 62 || markdownLineEndingOrSpace(code2)) {
        return tagOpenBetween(code2);
      }
      return nok(code2);
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
    function lineEndingBefore(code2) {
      effects.exit("htmlTextData");
      effects.enter("lineEnding");
      effects.consume(code2);
      effects.exit("lineEnding");
      return lineEndingAfter;
    }
    function lineEndingAfter(code2) {
      return markdownSpace(code2) ? factorySpace(
        effects,
        lineEndingAfterPrefix,
        "linePrefix",
        self2.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4
      )(code2) : lineEndingAfterPrefix(code2);
    }
    function lineEndingAfterPrefix(code2) {
      effects.enter("htmlTextData");
      return returnState(code2);
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
  const referenceFullConstruct = {
    tokenize: tokenizeReferenceFull
  };
  const referenceCollapsedConstruct = {
    tokenize: tokenizeReferenceCollapsed
  };
  function resolveAllLabelEnd(events) {
    let index2 = -1;
    while (++index2 < events.length) {
      const token = events[index2][1];
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
    let offset2 = 0;
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
            offset2 = 2;
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
      start: Object.assign({}, events[open + offset2 + 2][1].end),
      end: Object.assign({}, events[close - 2][1].start)
    };
    media = [
      ["enter", group, context],
      ["enter", label, context]
    ];
    media = push(media, events.slice(open + 1, open + offset2 + 3));
    media = push(media, [["enter", text2, context]]);
    media = push(
      media,
      resolveAll(
        context.parser.constructs.insideSpan.null,
        events.slice(open + offset2 + 4, close - 3),
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
      if (labelStart._inactive) {
        return labelEndNok(code2);
      }
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
      return after;
    }
    function after(code2) {
      if (code2 === 40) {
        return effects.attempt(
          resourceConstruct,
          labelEndOk,
          defined ? labelEndOk : labelEndNok
        )(code2);
      }
      if (code2 === 91) {
        return effects.attempt(
          referenceFullConstruct,
          labelEndOk,
          defined ? referenceNotFull : labelEndNok
        )(code2);
      }
      return defined ? labelEndOk(code2) : labelEndNok(code2);
    }
    function referenceNotFull(code2) {
      return effects.attempt(
        referenceCollapsedConstruct,
        labelEndOk,
        labelEndNok
      )(code2);
    }
    function labelEndOk(code2) {
      return ok2(code2);
    }
    function labelEndNok(code2) {
      labelStart._balanced = true;
      return nok(code2);
    }
  }
  function tokenizeResource(effects, ok2, nok) {
    return resourceStart;
    function resourceStart(code2) {
      effects.enter("resource");
      effects.enter("resourceMarker");
      effects.consume(code2);
      effects.exit("resourceMarker");
      return resourceBefore;
    }
    function resourceBefore(code2) {
      return markdownLineEndingOrSpace(code2) ? factoryWhitespace(effects, resourceOpen)(code2) : resourceOpen(code2);
    }
    function resourceOpen(code2) {
      if (code2 === 41) {
        return resourceEnd(code2);
      }
      return factoryDestination(
        effects,
        resourceDestinationAfter,
        resourceDestinationMissing,
        "resourceDestination",
        "resourceDestinationLiteral",
        "resourceDestinationLiteralMarker",
        "resourceDestinationRaw",
        "resourceDestinationString",
        32
      )(code2);
    }
    function resourceDestinationAfter(code2) {
      return markdownLineEndingOrSpace(code2) ? factoryWhitespace(effects, resourceBetween)(code2) : resourceEnd(code2);
    }
    function resourceDestinationMissing(code2) {
      return nok(code2);
    }
    function resourceBetween(code2) {
      if (code2 === 34 || code2 === 39 || code2 === 40) {
        return factoryTitle(
          effects,
          resourceTitleAfter,
          nok,
          "resourceTitle",
          "resourceTitleMarker",
          "resourceTitleString"
        )(code2);
      }
      return resourceEnd(code2);
    }
    function resourceTitleAfter(code2) {
      return markdownLineEndingOrSpace(code2) ? factoryWhitespace(effects, resourceEnd)(code2) : resourceEnd(code2);
    }
    function resourceEnd(code2) {
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
  function tokenizeReferenceFull(effects, ok2, nok) {
    const self2 = this;
    return referenceFull;
    function referenceFull(code2) {
      return factoryLabel.call(
        self2,
        effects,
        referenceFullAfter,
        referenceFullMissing,
        "reference",
        "referenceMarker",
        "referenceString"
      )(code2);
    }
    function referenceFullAfter(code2) {
      return self2.parser.defined.includes(
        normalizeIdentifier(
          self2.sliceSerialize(self2.events[self2.events.length - 1][1]).slice(1, -1)
        )
      ) ? ok2(code2) : nok(code2);
    }
    function referenceFullMissing(code2) {
      return nok(code2);
    }
  }
  function tokenizeReferenceCollapsed(effects, ok2, nok) {
    return referenceCollapsedStart;
    function referenceCollapsedStart(code2) {
      effects.enter("reference");
      effects.enter("referenceMarker");
      effects.consume(code2);
      effects.exit("referenceMarker");
      return referenceCollapsedOpen;
    }
    function referenceCollapsedOpen(code2) {
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
    let size2 = 0;
    let marker;
    return start;
    function start(code2) {
      effects.enter("thematicBreak");
      return before(code2);
    }
    function before(code2) {
      marker = code2;
      return atBreak(code2);
    }
    function atBreak(code2) {
      if (code2 === marker) {
        effects.enter("thematicBreakSequence");
        return sequence(code2);
      }
      if (size2 >= 3 && (code2 === null || markdownLineEnding(code2))) {
        effects.exit("thematicBreak");
        return ok2(code2);
      }
      return nok(code2);
    }
    function sequence(code2) {
      if (code2 === marker) {
        effects.consume(code2);
        size2++;
        return sequence;
      }
      effects.exit("thematicBreakSequence");
      return markdownSpace(code2) ? factorySpace(effects, atBreak, "whitespace")(code2) : atBreak(code2);
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
    let size2 = 0;
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
      if (asciiDigit(code2) && ++size2 < 10) {
        effects.consume(code2);
        return inside;
      }
      if ((!self2.interrupt || size2 < 2) && (self2.containerState.marker ? code2 === self2.containerState.marker : code2 === 41 || code2 === 46)) {
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
    let marker;
    return start;
    function start(code2) {
      let index2 = self2.events.length;
      let paragraph2;
      while (index2--) {
        if (self2.events[index2][1].type !== "lineEnding" && self2.events[index2][1].type !== "linePrefix" && self2.events[index2][1].type !== "content") {
          paragraph2 = self2.events[index2][1].type === "paragraph";
          break;
        }
      }
      if (!self2.parser.lazy[self2.now().line] && (self2.interrupt || paragraph2)) {
        effects.enter("setextHeadingLine");
        marker = code2;
        return before(code2);
      }
      return nok(code2);
    }
    function before(code2) {
      effects.enter("setextHeadingLineSequence");
      return inside(code2);
    }
    function inside(code2) {
      if (code2 === marker) {
        effects.consume(code2);
        return inside;
      }
      effects.exit("setextHeadingLineSequence");
      return markdownSpace(code2) ? factorySpace(effects, after, "lineSuffix")(code2) : after(code2);
    }
    function after(code2) {
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
        let size2 = 0;
        let tabs;
        while (index2--) {
          const chunk = chunks[index2];
          if (typeof chunk === "string") {
            bufferIndex = chunk.length;
            while (chunk.charCodeAt(bufferIndex - 1) === 32) {
              size2++;
              bufferIndex--;
            }
            if (bufferIndex) break;
            bufferIndex = -1;
          } else if (chunk === -2) {
            tabs = true;
            size2++;
          } else if (chunk === -1) ;
          else {
            index2++;
            break;
          }
        }
        if (size2) {
          const token = {
            type: eventIndex === events.length || tabs || size2 < 2 ? "lineSuffix" : "hardBreakTrailing",
            start: {
              line: data.end.line,
              column: data.end.column - size2,
              offset: data.end.offset - size2,
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
      const { line, column, offset: offset2, _index, _bufferIndex } = point2;
      return {
        line,
        column,
        offset: offset2,
        _index,
        _bufferIndex
      };
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
    function onsuccessfulcheck(_24, info) {
      info.restore();
    }
    function constructFactory(onreturn, fields) {
      return hook;
      function hook(constructs2, returnState, bogusState) {
        let listOfConstructs;
        let constructIndex;
        let currentConstruct;
        let info;
        return Array.isArray(constructs2) ? handleListOfConstructs(constructs2) : "tokenize" in constructs2 ? (
          // @ts-expect-error Looks like a construct.
          handleListOfConstructs([constructs2])
        ) : handleMapOfConstructs(constructs2);
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
        const head2 = view[0];
        if (typeof head2 === "string") {
          view[0] = head2.slice(startBufferIndex);
        } else {
          view.shift();
        }
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
            if (!expandTabs && atTab) continue;
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
  function parse(options) {
    const settings = options || {};
    const constructs2 = (
      /** @type {FullNormalizedExtension} */
      combineExtensions([defaultConstructs, ...settings.extensions || []])
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
              while (column++ < next) chunks.push(-1);
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
        if (atCarriageReturn) chunks.push(-5);
        if (buffer) chunks.push(buffer);
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
      // C0 except for HT, LF, FF, CR, space.
      code2 < 9 || code2 === 11 || code2 > 13 && code2 < 32 || // Control character (DEL) of C0, and C1 controls.
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
    function(value, encoding, options) {
      if (typeof encoding !== "string") {
        options = encoding;
        encoding = void 0;
      }
      return compiler(options)(
        postprocess(
          parse(options).document().write(preprocess()(value, encoding, true))
        )
      );
    }
  );
  function compiler(options) {
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
    configure$1(config, (options || {}).mdastExtensions || []);
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
        } else if (event[1].type === "linePrefix" || event[1].type === "listItemValue" || event[1].type === "listItemMarker" || event[1].type === "listItemPrefix" || event[1].type === "listItemPrefixWhitespace") ;
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
                if (tailEvent[0] === "exit") continue;
                if (lineIndex) {
                  events[lineIndex][1].type = "lineEndingBlank";
                  listSpread = true;
                }
                tailEvent[1].type = "lineEnding";
                lineIndex = tailIndex;
              } else if (tailEvent[1].type === "linePrefix" || tailEvent[1].type === "blockQuotePrefix" || tailEvent[1].type === "blockQuotePrefixWhitespace" || tailEvent[1].type === "blockQuoteMarker" || tailEvent[1].type === "listItemIndent") ;
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
              _spread: false,
              start: Object.assign({}, event[1].start),
              // @ts-expect-error: we’ll add `end` in a second.
              end: void 0
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
        if (and) and.call(this, token);
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
        if (and) and.call(this, token);
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
      if (getData("flowCodeInside")) return;
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
        spread: token._spread,
        children: []
      };
    }
    function listItem2(token) {
      return {
        type: "listItem",
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
        if (checks2[index3].call(this, ...parameters)) return true;
      }
      return false;
    }
  }
  function propsFactory(check) {
    return castFactory(all2);
    function all2(node2) {
      let key2;
      for (key2 in check) {
        if (node2[key2] !== check[key2]) return false;
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
          let offset2;
          let grandparents;
          if (!test || is(node2, index2, parents[parents.length - 1] || null)) {
            result = toResult(visitor(node2, parents));
            if (result[0] === EXIT) {
              return result;
            }
          }
          if (node2.children && result[0] !== SKIP) {
            offset2 = (reverse ? node2.children.length : -1) + step;
            grandparents = parents.concat(node2);
            while (offset2 > -1 && offset2 < node2.children.length) {
              subresult = factory(node2.children[offset2], offset2, grandparents)();
              if (subresult[0] === EXIT) {
                return subresult;
              }
              offset2 = typeof subresult[1] === "number" ? subresult[1] : offset2 + step;
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
    function(tree, find2, replace2, options) {
      let settings;
      let schema;
      if (typeof find2 === "string" || find2 instanceof RegExp) {
        schema = [[find2, replace2]];
        settings = options;
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
  function findUrl(_24, protocol, domain2, path2, match) {
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
    if (!parts[0]) return false;
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
  function findEmail(_24, atext, label, match) {
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
    let trail2 = trailExec[0];
    let closingParenIndex = trail2.indexOf(")");
    const openingParens = ccount(url, "(");
    let closingParens = ccount(url, ")");
    while (closingParenIndex !== -1 && openingParens > closingParens) {
      url += trail2.slice(0, closingParenIndex + 1);
      trail2 = trail2.slice(closingParenIndex + 1);
      closingParenIndex = trail2.indexOf(")");
      closingParens++;
    }
    return [url, trail2];
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
    const options = config || {};
    const now = options.now || {};
    let lineShift = options.lineShift || 0;
    let line = now.line || 1;
    let column = now.column || 1;
    return { move, current, shift: shift2 };
    function current() {
      return { now: { line, column }, lineShift };
    }
    function shift2(value) {
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
  function footnoteReference$1(node2, _24, context, safeOptions) {
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
  function footnoteDefinition(node2, _24, context, safeOptions) {
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
        let handle3 = state.handle.handlers[children[index2 + 1].type];
        if (handle3 && handle3.peek) handle3 = handle3.peek;
        after = handle3 ? handle3(children[index2 + 1], parent, state, {
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
  function handleDelete(node2, _24, context, safeOptions) {
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
  function inlineCode$1(node2, _24, state) {
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
      if (!pattern.atBreak) continue;
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
  function defaultStringLength(value) {
    return value.length;
  }
  function markdownTable(table2, options) {
    const settings = options || {};
    const align = (settings.align || []).concat();
    const stringLength = settings.stringLength || defaultStringLength;
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
        if (settings.alignDelimiters !== false) {
          const size2 = stringLength(cell);
          sizes2[columnIndex2] = size2;
          if (longestCellByColumn[columnIndex2] === void 0 || size2 > longestCellByColumn[columnIndex2]) {
            longestCellByColumn[columnIndex2] = size2;
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
      let size2 = settings.alignDelimiters === false ? 1 : Math.max(
        1,
        longestCellByColumn[columnIndex] - before.length - after.length
      );
      const cell = before + "-".repeat(size2) + after;
      if (settings.alignDelimiters !== false) {
        size2 = before.length + size2 + after.length;
        if (size2 > longestCellByColumn[columnIndex]) {
          longestCellByColumn[columnIndex] = size2;
        }
        sizes[columnIndex] = size2;
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
        if (settings.alignDelimiters !== false) {
          const size2 = longestCellByColumn[columnIndex] - (sizes2[columnIndex] || 0);
          const code2 = alignments[columnIndex];
          if (code2 === 114) {
            before = " ".repeat(size2);
          } else if (code2 === 99) {
            if (size2 % 2) {
              before = " ".repeat(size2 / 2 + 0.5);
              after = " ".repeat(size2 / 2 - 0.5);
            } else {
              before = " ".repeat(size2 / 2);
              after = before;
            }
          } else {
            after = " ".repeat(size2);
          }
        }
        if (settings.delimiterStart !== false && !columnIndex) {
          line.push("|");
        }
        if (settings.padding !== false && // Don’t add the opening space if we’re not aligning and the cell is
        // empty: there will be a closing space.
        !(settings.alignDelimiters === false && cell === "") && (settings.delimiterStart !== false || columnIndex)) {
          line.push(" ");
        }
        if (settings.alignDelimiters !== false) {
          line.push(before);
        }
        line.push(cell);
        if (settings.alignDelimiters !== false) {
          line.push(after);
        }
        if (settings.padding !== false) {
          line.push(" ");
        }
        if (settings.delimiterEnd !== false || columnIndex !== mostCellsPerRow - 1) {
          line.push("|");
        }
      }
      lines.push(
        settings.delimiterEnd === false ? line.join("").replace(/ +$/, "") : line.join("")
      );
    }
    return lines.join("\n");
  }
  function serialize(value) {
    return value === null || value === void 0 ? "" : String(value);
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
  function gfmTableToMarkdown(options) {
    const settings = {};
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
    function handleTable(node2, _24, context, safeOptions) {
      return serializeData(
        handleTableAsData(node2, context, safeOptions),
        node2.align
      );
    }
    function handleTableRow(node2, _24, context, safeOptions) {
      const row = handleTableRowAsData(node2, context, safeOptions);
      const value = serializeData([row]);
      return value.slice(0, value.indexOf("\n"));
    }
    function handleTableCell(node2, _24, context, safeOptions) {
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
    const style = state.options.listItemIndent || "tab";
    if (style === 1 || style === "1") {
      return "one";
    }
    if (style !== "tab" && style !== "one" && style !== "mixed") {
      throw new Error(
        "Cannot serialize items with `" + style + "` for `options.listItemIndent`, expected `tab`, `one`, or `mixed`"
      );
    }
    return style;
  }
  function listItem$1(node2, parent, state, info) {
    const listItemIndent = checkListItemIndent(state);
    let bullet = state.bulletCurrent || checkBullet(state);
    if (parent && parent.type === "list" && parent.ordered) {
      bullet = (typeof parent.start === "number" && parent.start > -1 ? parent.start : 1) + (state.options.incrementListMarker === false ? 0 : parent.children.indexOf(node2)) + bullet;
    }
    let size2 = bullet.length + 1;
    if (listItemIndent === "tab" || listItemIndent === "mixed" && (parent && parent.type === "list" && parent.spread || node2.spread)) {
      size2 = Math.ceil(size2 / 4) * 4;
    }
    const tracker = state.createTracker(info);
    tracker.move(bullet + " ".repeat(size2 - bullet.length));
    tracker.shift(size2);
    const exit2 = state.enter("listItem");
    const value = state.indentLines(
      state.containerFlow(node2, tracker.current()),
      map2
    );
    exit2();
    return value;
    function map2(line, index2, blank) {
      if (index2) {
        return (blank ? "" : " ".repeat(size2)) + line;
      }
      return (blank ? bullet : bullet + " ".repeat(size2 - bullet.length)) + line;
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
  function gfmToMarkdown(options) {
    return {
      extensions: [
        gfmAutolinkLiteralToMarkdown,
        gfmFootnoteToMarkdown(),
        gfmStrikethroughToMarkdown,
        gfmTableToMarkdown(),
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
    while (no in footnoteById) no++;
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
      if (start.line && end.line) body2.position = { start, end };
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
  function createState(tree, options) {
    const settings = {};
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
    if (from.position) to.position = position(from);
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
      if (index2) result.push({ type: "text", value: "\n" });
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
  function toHast(tree, options) {
    const state = createState(tree);
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
      if (key2 === "extensions") ;
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
  function blockquote(node2, _24, state, info) {
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
  function map$1(line, _24, blank) {
    return ">" + (blank ? "" : " ") + line;
  }
  function hardBreak(_24, _1, state, info) {
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
    let count2 = 0;
    let max2 = 0;
    if (typeof substring !== "string") {
      throw new TypeError("Expected substring");
    }
    while (index2 !== -1) {
      if (index2 === expected) {
        if (++count2 > max2) {
          max2 = count2;
        }
      } else {
        count2 = 1;
      }
      expected = index2 + substring.length;
      index2 = source.indexOf(substring, expected);
    }
    return max2;
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
  function code$1(node2, _24, state, info) {
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
  function map(line, _24, blank) {
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
  function definition(node2, _24, state, info) {
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
  function emphasis(node2, _24, state, info) {
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
  function emphasisPeek(_24, _1, state) {
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
  function heading(node2, _24, state, info) {
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
  function image(node2, _24, state, info) {
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
  function imageReference(node2, _24, state, info) {
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
  function link(node2, _24, state, info) {
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
  function linkPeek(node2, _24, state) {
    return formatLinkAsAutolink(node2, state) ? "<" : "[";
  }
  linkReference.peek = linkReferencePeek;
  function linkReference(node2, _24, state, info) {
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
  function paragraph(node2, _24, state, info) {
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
  function root(node2, _24, state, info) {
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
  function strong(node2, _24, state, info) {
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
  function strongPeek(_24, _1, state) {
    return state.options.strong || "*";
  }
  function text$1(node2, _24, state, info) {
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
  function thematicBreak(_24, _1, state) {
    const value = (checkRule(state) + (state.options.ruleSpaces ? " " : "")).repeat(checkRuleRepetition(state));
    return state.options.ruleSpaces ? value.slice(0, -1) : value;
  }
  const handle2 = {
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
  function toMarkdown$1(tree, options = {}) {
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
    configure(state, { unsafe, join, handlers: handle2 });
    configure(state, options);
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
  const wwwPrefix = {
    tokenize: tokenizeWwwPrefix,
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
  const trail = {
    tokenize: tokenizeTrail,
    partial: true
  };
  const emailDomainDotTrail = {
    tokenize: tokenizeEmailDomainDotTrail,
    partial: true
  };
  const wwwAutolink = {
    tokenize: tokenizeWwwAutolink,
    previous: previousWww
  };
  const protocolAutolink = {
    tokenize: tokenizeProtocolAutolink,
    previous: previousProtocol
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
    if (code === 58) code = 65;
    else if (code === 91) code = 97;
  }
  text[43] = emailAutolink;
  text[45] = emailAutolink;
  text[46] = emailAutolink;
  text[95] = emailAutolink;
  text[72] = [emailAutolink, protocolAutolink];
  text[104] = [emailAutolink, protocolAutolink];
  text[87] = [emailAutolink, wwwAutolink];
  text[119] = [emailAutolink, wwwAutolink];
  function tokenizeEmailAutolink(effects, ok2, nok) {
    const self2 = this;
    let dot;
    let data;
    return start;
    function start(code2) {
      if (!gfmAtext(code2) || !previousEmail.call(self2, self2.previous) || previousUnbalanced(self2.events)) {
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
        return emailDomain;
      }
      return nok(code2);
    }
    function emailDomain(code2) {
      if (code2 === 46) {
        return effects.check(
          emailDomainDotTrail,
          emailDomainAfter,
          emailDomainDot
        )(code2);
      }
      if (code2 === 45 || code2 === 95 || asciiAlphanumeric(code2)) {
        data = true;
        effects.consume(code2);
        return emailDomain;
      }
      return emailDomainAfter(code2);
    }
    function emailDomainDot(code2) {
      effects.consume(code2);
      dot = true;
      return emailDomain;
    }
    function emailDomainAfter(code2) {
      if (data && dot && asciiAlpha(self2.previous)) {
        effects.exit("literalAutolinkEmail");
        effects.exit("literalAutolink");
        return ok2(code2);
      }
      return nok(code2);
    }
  }
  function tokenizeWwwAutolink(effects, ok2, nok) {
    const self2 = this;
    return wwwStart;
    function wwwStart(code2) {
      if (code2 !== 87 && code2 !== 119 || !previousWww.call(self2, self2.previous) || previousUnbalanced(self2.events)) {
        return nok(code2);
      }
      effects.enter("literalAutolink");
      effects.enter("literalAutolinkWww");
      return effects.check(
        wwwPrefix,
        effects.attempt(domain, effects.attempt(path, wwwAfter), nok),
        nok
      )(code2);
    }
    function wwwAfter(code2) {
      effects.exit("literalAutolinkWww");
      effects.exit("literalAutolink");
      return ok2(code2);
    }
  }
  function tokenizeProtocolAutolink(effects, ok2, nok) {
    const self2 = this;
    let buffer = "";
    let seen = false;
    return protocolStart;
    function protocolStart(code2) {
      if ((code2 === 72 || code2 === 104) && previousProtocol.call(self2, self2.previous) && !previousUnbalanced(self2.events)) {
        effects.enter("literalAutolink");
        effects.enter("literalAutolinkHttp");
        buffer += String.fromCodePoint(code2);
        effects.consume(code2);
        return protocolPrefixInside;
      }
      return nok(code2);
    }
    function protocolPrefixInside(code2) {
      if (asciiAlpha(code2) && buffer.length < 5) {
        buffer += String.fromCodePoint(code2);
        effects.consume(code2);
        return protocolPrefixInside;
      }
      if (code2 === 58) {
        const protocol = buffer.toLowerCase();
        if (protocol === "http" || protocol === "https") {
          effects.consume(code2);
          return protocolSlashesInside;
        }
      }
      return nok(code2);
    }
    function protocolSlashesInside(code2) {
      if (code2 === 47) {
        effects.consume(code2);
        if (seen) {
          return afterProtocol;
        }
        seen = true;
        return protocolSlashesInside;
      }
      return nok(code2);
    }
    function afterProtocol(code2) {
      return code2 === null || asciiControl(code2) || markdownLineEndingOrSpace(code2) || unicodeWhitespace(code2) || unicodePunctuation(code2) ? nok(code2) : effects.attempt(domain, effects.attempt(path, protocolAfter), nok)(code2);
    }
    function protocolAfter(code2) {
      effects.exit("literalAutolinkHttp");
      effects.exit("literalAutolink");
      return ok2(code2);
    }
  }
  function tokenizeWwwPrefix(effects, ok2, nok) {
    let size2 = 0;
    return wwwPrefixInside;
    function wwwPrefixInside(code2) {
      if ((code2 === 87 || code2 === 119) && size2 < 3) {
        size2++;
        effects.consume(code2);
        return wwwPrefixInside;
      }
      if (code2 === 46 && size2 === 3) {
        effects.consume(code2);
        return wwwPrefixAfter;
      }
      return nok(code2);
    }
    function wwwPrefixAfter(code2) {
      return code2 === null ? nok(code2) : ok2(code2);
    }
  }
  function tokenizeDomain(effects, ok2, nok) {
    let underscoreInLastSegment;
    let underscoreInLastLastSegment;
    let seen;
    return domainInside;
    function domainInside(code2) {
      if (code2 === 46 || code2 === 95) {
        return effects.check(trail, domainAfter, domainAtPunctuation)(code2);
      }
      if (code2 === null || markdownLineEndingOrSpace(code2) || unicodeWhitespace(code2) || code2 !== 45 && unicodePunctuation(code2)) {
        return domainAfter(code2);
      }
      seen = true;
      effects.consume(code2);
      return domainInside;
    }
    function domainAtPunctuation(code2) {
      if (code2 === 95) {
        underscoreInLastSegment = true;
      } else {
        underscoreInLastLastSegment = underscoreInLastSegment;
        underscoreInLastSegment = void 0;
      }
      effects.consume(code2);
      return domainInside;
    }
    function domainAfter(code2) {
      if (underscoreInLastLastSegment || underscoreInLastSegment || !seen) {
        return nok(code2);
      }
      return ok2(code2);
    }
  }
  function tokenizePath(effects, ok2) {
    let sizeOpen = 0;
    let sizeClose = 0;
    return pathInside;
    function pathInside(code2) {
      if (code2 === 40) {
        sizeOpen++;
        effects.consume(code2);
        return pathInside;
      }
      if (code2 === 41 && sizeClose < sizeOpen) {
        return pathAtPunctuation(code2);
      }
      if (code2 === 33 || code2 === 34 || code2 === 38 || code2 === 39 || code2 === 41 || code2 === 42 || code2 === 44 || code2 === 46 || code2 === 58 || code2 === 59 || code2 === 60 || code2 === 63 || code2 === 93 || code2 === 95 || code2 === 126) {
        return effects.check(trail, ok2, pathAtPunctuation)(code2);
      }
      if (code2 === null || markdownLineEndingOrSpace(code2) || unicodeWhitespace(code2)) {
        return ok2(code2);
      }
      effects.consume(code2);
      return pathInside;
    }
    function pathAtPunctuation(code2) {
      if (code2 === 41) {
        sizeClose++;
      }
      effects.consume(code2);
      return pathInside;
    }
  }
  function tokenizeTrail(effects, ok2, nok) {
    return trail2;
    function trail2(code2) {
      if (code2 === 33 || code2 === 34 || code2 === 39 || code2 === 41 || code2 === 42 || code2 === 44 || code2 === 46 || code2 === 58 || code2 === 59 || code2 === 63 || code2 === 95 || code2 === 126) {
        effects.consume(code2);
        return trail2;
      }
      if (code2 === 38) {
        effects.consume(code2);
        return trailCharRefStart;
      }
      if (code2 === 93) {
        effects.consume(code2);
        return trailBracketAfter;
      }
      if (
        // `<` is an end.
        code2 === 60 || // So is whitespace.
        code2 === null || markdownLineEndingOrSpace(code2) || unicodeWhitespace(code2)
      ) {
        return ok2(code2);
      }
      return nok(code2);
    }
    function trailBracketAfter(code2) {
      if (code2 === null || code2 === 40 || code2 === 91 || markdownLineEndingOrSpace(code2) || unicodeWhitespace(code2)) {
        return ok2(code2);
      }
      return trail2(code2);
    }
    function trailCharRefStart(code2) {
      return asciiAlpha(code2) ? trailCharRefInside(code2) : nok(code2);
    }
    function trailCharRefInside(code2) {
      if (code2 === 59) {
        effects.consume(code2);
        return trail2;
      }
      if (asciiAlpha(code2)) {
        effects.consume(code2);
        return trailCharRefInside;
      }
      return nok(code2);
    }
  }
  function tokenizeEmailDomainDotTrail(effects, ok2, nok) {
    return start;
    function start(code2) {
      effects.consume(code2);
      return after;
    }
    function after(code2) {
      return asciiAlphanumeric(code2) ? nok(code2) : ok2(code2);
    }
  }
  function previousWww(code2) {
    return code2 === null || code2 === 40 || code2 === 42 || code2 === 95 || code2 === 91 || code2 === 93 || code2 === 126 || markdownLineEndingOrSpace(code2);
  }
  function previousProtocol(code2) {
    return !asciiAlpha(code2);
  }
  function previousEmail(code2) {
    return !(code2 === 47 || gfmAtext(code2));
  }
  function gfmAtext(code2) {
    return code2 === 43 || code2 === 45 || code2 === 46 || code2 === 95 || asciiAlphanumeric(code2);
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
    let size2 = 0;
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
      if (code2 !== 94) return nok(code2);
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
        size2 > 999 || // Closing brace with nothing.
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
      size2++;
      effects.consume(code2);
      return code2 === 92 ? callEscape : callData;
    }
    function callEscape(code2) {
      if (code2 === 91 || code2 === 92 || code2 === 93) {
        effects.consume(code2);
        size2++;
        return callData;
      }
      return callData(code2);
    }
  }
  function tokenizeDefinitionStart(effects, ok2, nok) {
    const self2 = this;
    const defined = self2.parser.gfmFootnotes || (self2.parser.gfmFootnotes = []);
    let identifier;
    let size2 = 0;
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
        size2 > 999 || // Closing brace with nothing.
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
      size2++;
      effects.consume(code2);
      return code2 === 92 ? labelEscape : labelInside;
    }
    function labelEscape(code2) {
      if (code2 === 91 || code2 === 92 || code2 === 93) {
        effects.consume(code2);
        size2++;
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
  function gfmStrikethrough(options) {
    const options_ = {};
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
      let size2 = 0;
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
          if (size2 > 1) return nok(code2);
          effects.consume(code2);
          size2++;
          return more;
        }
        if (size2 < 2 && !single) return nok(code2);
        const token = effects.exit("strikethroughSequenceTemporary");
        const after = classifyCharacter(code2);
        token._open = !after || after === 2 && Boolean(before);
        token._close = !before || before === 2 && Boolean(after);
        return ok2(code2);
      }
    }
  }
  class EditMap {
    /**
     * Create a new edit map.
     */
    constructor() {
      this.map = [];
    }
    /**
     * Create an edit: a remove and/or add at a certain place.
     *
     * @param {number} index
     * @param {number} remove
     * @param {Array<Event>} add
     * @returns {void}
     */
    add(index2, remove, add) {
      addImpl(this, index2, remove, add);
    }
    // To do: not used here.
    // /**
    //  * Create an edit: but insert `add` before existing additions.
    //  *
    //  * @param {number} index
    //  * @param {number} remove
    //  * @param {Array<Event>} add
    //  * @returns {void}
    //  */
    // addBefore(index, remove, add) {
    //   addImpl(this, index, remove, add, true)
    // }
    /**
     * Done, change the events.
     *
     * @param {Array<Event>} events
     * @returns {void}
     */
    consume(events) {
      this.map.sort((a2, b2) => a2[0] - b2[0]);
      if (this.map.length === 0) {
        return;
      }
      let index2 = this.map.length;
      const vecs = [];
      while (index2 > 0) {
        index2 -= 1;
        vecs.push(events.slice(this.map[index2][0] + this.map[index2][1]));
        vecs.push(this.map[index2][2]);
        events.length = this.map[index2][0];
      }
      vecs.push([...events]);
      events.length = 0;
      let slice = vecs.pop();
      while (slice) {
        events.push(...slice);
        slice = vecs.pop();
      }
      this.map.length = 0;
    }
  }
  function addImpl(editMap, at, remove, add) {
    let index2 = 0;
    if (remove === 0 && add.length === 0) {
      return;
    }
    while (index2 < editMap.map.length) {
      if (editMap.map[index2][0] === at) {
        editMap.map[index2][1] += remove;
        editMap.map[index2][2].push(...add);
        return;
      }
      index2 += 1;
    }
    editMap.map.push([at, remove, add]);
  }
  function gfmTableAlign(events, index2) {
    let inDelimiterRow = false;
    const align = [];
    while (index2 < events.length) {
      const event = events[index2];
      if (inDelimiterRow) {
        if (event[0] === "enter") {
          if (event[1].type === "tableContent") {
            align.push(
              events[index2 + 1][1].type === "tableDelimiterMarker" ? "left" : "none"
            );
          }
        } else if (event[1].type === "tableContent") {
          if (events[index2 - 1][1].type === "tableDelimiterMarker") {
            const alignIndex = align.length - 1;
            align[alignIndex] = align[alignIndex] === "left" ? "center" : "right";
          }
        } else if (event[1].type === "tableDelimiterRow") {
          break;
        }
      } else if (event[0] === "enter" && event[1].type === "tableDelimiterRow") {
        inDelimiterRow = true;
      }
      index2 += 1;
    }
    return align;
  }
  const gfmTable = {
    flow: {
      null: {
        tokenize: tokenizeTable,
        resolveAll: resolveTable
      }
    }
  };
  function tokenizeTable(effects, ok2, nok) {
    const self2 = this;
    let size2 = 0;
    let sizeB = 0;
    let seen;
    return start;
    function start(code2) {
      let index2 = self2.events.length - 1;
      while (index2 > -1) {
        const type = self2.events[index2][1].type;
        if (type === "lineEnding" || // Note: markdown-rs uses `whitespace` instead of `linePrefix`
        type === "linePrefix")
          index2--;
        else break;
      }
      const tail = index2 > -1 ? self2.events[index2][1].type : null;
      const next = tail === "tableHead" || tail === "tableRow" ? bodyRowStart : headRowBefore;
      if (next === bodyRowStart && self2.parser.lazy[self2.now().line]) {
        return nok(code2);
      }
      return next(code2);
    }
    function headRowBefore(code2) {
      effects.enter("tableHead");
      effects.enter("tableRow");
      return headRowStart(code2);
    }
    function headRowStart(code2) {
      if (code2 === 124) {
        return headRowBreak(code2);
      }
      seen = true;
      sizeB += 1;
      return headRowBreak(code2);
    }
    function headRowBreak(code2) {
      if (code2 === null) {
        return nok(code2);
      }
      if (markdownLineEnding(code2)) {
        if (sizeB > 1) {
          sizeB = 0;
          self2.interrupt = true;
          effects.exit("tableRow");
          effects.enter("lineEnding");
          effects.consume(code2);
          effects.exit("lineEnding");
          return headDelimiterStart;
        }
        return nok(code2);
      }
      if (markdownSpace(code2)) {
        return factorySpace(effects, headRowBreak, "whitespace")(code2);
      }
      sizeB += 1;
      if (seen) {
        seen = false;
        size2 += 1;
      }
      if (code2 === 124) {
        effects.enter("tableCellDivider");
        effects.consume(code2);
        effects.exit("tableCellDivider");
        seen = true;
        return headRowBreak;
      }
      effects.enter("data");
      return headRowData(code2);
    }
    function headRowData(code2) {
      if (code2 === null || code2 === 124 || markdownLineEndingOrSpace(code2)) {
        effects.exit("data");
        return headRowBreak(code2);
      }
      effects.consume(code2);
      return code2 === 92 ? headRowEscape : headRowData;
    }
    function headRowEscape(code2) {
      if (code2 === 92 || code2 === 124) {
        effects.consume(code2);
        return headRowData;
      }
      return headRowData(code2);
    }
    function headDelimiterStart(code2) {
      self2.interrupt = false;
      if (self2.parser.lazy[self2.now().line]) {
        return nok(code2);
      }
      effects.enter("tableDelimiterRow");
      seen = false;
      if (markdownSpace(code2)) {
        return factorySpace(
          effects,
          headDelimiterBefore,
          "linePrefix",
          self2.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4
        )(code2);
      }
      return headDelimiterBefore(code2);
    }
    function headDelimiterBefore(code2) {
      if (code2 === 45 || code2 === 58) {
        return headDelimiterValueBefore(code2);
      }
      if (code2 === 124) {
        seen = true;
        effects.enter("tableCellDivider");
        effects.consume(code2);
        effects.exit("tableCellDivider");
        return headDelimiterCellBefore;
      }
      return headDelimiterNok(code2);
    }
    function headDelimiterCellBefore(code2) {
      if (markdownSpace(code2)) {
        return factorySpace(effects, headDelimiterValueBefore, "whitespace")(code2);
      }
      return headDelimiterValueBefore(code2);
    }
    function headDelimiterValueBefore(code2) {
      if (code2 === 58) {
        sizeB += 1;
        seen = true;
        effects.enter("tableDelimiterMarker");
        effects.consume(code2);
        effects.exit("tableDelimiterMarker");
        return headDelimiterLeftAlignmentAfter;
      }
      if (code2 === 45) {
        sizeB += 1;
        return headDelimiterLeftAlignmentAfter(code2);
      }
      if (code2 === null || markdownLineEnding(code2)) {
        return headDelimiterCellAfter(code2);
      }
      return headDelimiterNok(code2);
    }
    function headDelimiterLeftAlignmentAfter(code2) {
      if (code2 === 45) {
        effects.enter("tableDelimiterFiller");
        return headDelimiterFiller(code2);
      }
      return headDelimiterNok(code2);
    }
    function headDelimiterFiller(code2) {
      if (code2 === 45) {
        effects.consume(code2);
        return headDelimiterFiller;
      }
      if (code2 === 58) {
        seen = true;
        effects.exit("tableDelimiterFiller");
        effects.enter("tableDelimiterMarker");
        effects.consume(code2);
        effects.exit("tableDelimiterMarker");
        return headDelimiterRightAlignmentAfter;
      }
      effects.exit("tableDelimiterFiller");
      return headDelimiterRightAlignmentAfter(code2);
    }
    function headDelimiterRightAlignmentAfter(code2) {
      if (markdownSpace(code2)) {
        return factorySpace(effects, headDelimiterCellAfter, "whitespace")(code2);
      }
      return headDelimiterCellAfter(code2);
    }
    function headDelimiterCellAfter(code2) {
      if (code2 === 124) {
        return headDelimiterBefore(code2);
      }
      if (code2 === null || markdownLineEnding(code2)) {
        if (!seen || size2 !== sizeB) {
          return headDelimiterNok(code2);
        }
        effects.exit("tableDelimiterRow");
        effects.exit("tableHead");
        return ok2(code2);
      }
      return headDelimiterNok(code2);
    }
    function headDelimiterNok(code2) {
      return nok(code2);
    }
    function bodyRowStart(code2) {
      effects.enter("tableRow");
      return bodyRowBreak(code2);
    }
    function bodyRowBreak(code2) {
      if (code2 === 124) {
        effects.enter("tableCellDivider");
        effects.consume(code2);
        effects.exit("tableCellDivider");
        return bodyRowBreak;
      }
      if (code2 === null || markdownLineEnding(code2)) {
        effects.exit("tableRow");
        return ok2(code2);
      }
      if (markdownSpace(code2)) {
        return factorySpace(effects, bodyRowBreak, "whitespace")(code2);
      }
      effects.enter("data");
      return bodyRowData(code2);
    }
    function bodyRowData(code2) {
      if (code2 === null || code2 === 124 || markdownLineEndingOrSpace(code2)) {
        effects.exit("data");
        return bodyRowBreak(code2);
      }
      effects.consume(code2);
      return code2 === 92 ? bodyRowEscape : bodyRowData;
    }
    function bodyRowEscape(code2) {
      if (code2 === 92 || code2 === 124) {
        effects.consume(code2);
        return bodyRowData;
      }
      return bodyRowData(code2);
    }
  }
  function resolveTable(events, context) {
    let index2 = -1;
    let inFirstCellAwaitingPipe = true;
    let rowKind = 0;
    let lastCell = [0, 0, 0, 0];
    let cell = [0, 0, 0, 0];
    let afterHeadAwaitingFirstBodyRow = false;
    let lastTableEnd = 0;
    let currentTable;
    let currentBody;
    let currentCell;
    const map2 = new EditMap();
    while (++index2 < events.length) {
      const event = events[index2];
      const token = event[1];
      if (event[0] === "enter") {
        if (token.type === "tableHead") {
          afterHeadAwaitingFirstBodyRow = false;
          if (lastTableEnd !== 0) {
            flushTableEnd(map2, context, lastTableEnd, currentTable, currentBody);
            currentBody = void 0;
            lastTableEnd = 0;
          }
          currentTable = {
            type: "table",
            start: Object.assign({}, token.start),
            // Note: correct end is set later.
            end: Object.assign({}, token.end)
          };
          map2.add(index2, 0, [["enter", currentTable, context]]);
        } else if (token.type === "tableRow" || token.type === "tableDelimiterRow") {
          inFirstCellAwaitingPipe = true;
          currentCell = void 0;
          lastCell = [0, 0, 0, 0];
          cell = [0, index2 + 1, 0, 0];
          if (afterHeadAwaitingFirstBodyRow) {
            afterHeadAwaitingFirstBodyRow = false;
            currentBody = {
              type: "tableBody",
              start: Object.assign({}, token.start),
              // Note: correct end is set later.
              end: Object.assign({}, token.end)
            };
            map2.add(index2, 0, [["enter", currentBody, context]]);
          }
          rowKind = token.type === "tableDelimiterRow" ? 2 : currentBody ? 3 : 1;
        } else if (rowKind && (token.type === "data" || token.type === "tableDelimiterMarker" || token.type === "tableDelimiterFiller")) {
          inFirstCellAwaitingPipe = false;
          if (cell[2] === 0) {
            if (lastCell[1] !== 0) {
              cell[0] = cell[1];
              currentCell = flushCell(
                map2,
                context,
                lastCell,
                rowKind,
                void 0,
                currentCell
              );
              lastCell = [0, 0, 0, 0];
            }
            cell[2] = index2;
          }
        } else if (token.type === "tableCellDivider") {
          if (inFirstCellAwaitingPipe) {
            inFirstCellAwaitingPipe = false;
          } else {
            if (lastCell[1] !== 0) {
              cell[0] = cell[1];
              currentCell = flushCell(
                map2,
                context,
                lastCell,
                rowKind,
                void 0,
                currentCell
              );
            }
            lastCell = cell;
            cell = [lastCell[1], index2, 0, 0];
          }
        }
      } else if (token.type === "tableHead") {
        afterHeadAwaitingFirstBodyRow = true;
        lastTableEnd = index2;
      } else if (token.type === "tableRow" || token.type === "tableDelimiterRow") {
        lastTableEnd = index2;
        if (lastCell[1] !== 0) {
          cell[0] = cell[1];
          currentCell = flushCell(
            map2,
            context,
            lastCell,
            rowKind,
            index2,
            currentCell
          );
        } else if (cell[1] !== 0) {
          currentCell = flushCell(map2, context, cell, rowKind, index2, currentCell);
        }
        rowKind = 0;
      } else if (rowKind && (token.type === "data" || token.type === "tableDelimiterMarker" || token.type === "tableDelimiterFiller")) {
        cell[3] = index2;
      }
    }
    if (lastTableEnd !== 0) {
      flushTableEnd(map2, context, lastTableEnd, currentTable, currentBody);
    }
    map2.consume(context.events);
    index2 = -1;
    while (++index2 < context.events.length) {
      const event = context.events[index2];
      if (event[0] === "enter" && event[1].type === "table") {
        event[1]._align = gfmTableAlign(context.events, index2);
      }
    }
    return events;
  }
  function flushCell(map2, context, range, rowKind, rowEnd, previousCell) {
    const groupName = rowKind === 1 ? "tableHeader" : rowKind === 2 ? "tableDelimiter" : "tableData";
    const valueName = "tableContent";
    if (range[0] !== 0) {
      previousCell.end = Object.assign({}, getPoint(context.events, range[0]));
      map2.add(range[0], 0, [["exit", previousCell, context]]);
    }
    const now = getPoint(context.events, range[1]);
    previousCell = {
      type: groupName,
      start: Object.assign({}, now),
      // Note: correct end is set later.
      end: Object.assign({}, now)
    };
    map2.add(range[1], 0, [["enter", previousCell, context]]);
    if (range[2] !== 0) {
      const relatedStart = getPoint(context.events, range[2]);
      const relatedEnd = getPoint(context.events, range[3]);
      const valueToken = {
        type: valueName,
        start: Object.assign({}, relatedStart),
        end: Object.assign({}, relatedEnd)
      };
      map2.add(range[2], 0, [["enter", valueToken, context]]);
      if (rowKind !== 2) {
        const start = context.events[range[2]];
        const end = context.events[range[3]];
        start[1].end = Object.assign({}, end[1].end);
        start[1].type = "chunkText";
        start[1].contentType = "text";
        if (range[3] > range[2] + 1) {
          const a2 = range[2] + 1;
          const b2 = range[3] - range[2] - 1;
          map2.add(a2, b2, []);
        }
      }
      map2.add(range[3] + 1, 0, [["exit", valueToken, context]]);
    }
    if (rowEnd !== void 0) {
      previousCell.end = Object.assign({}, getPoint(context.events, rowEnd));
      map2.add(rowEnd, 0, [["exit", previousCell, context]]);
      previousCell = void 0;
    }
    return previousCell;
  }
  function flushTableEnd(map2, context, index2, table2, tableBody) {
    const exits = [];
    const related = getPoint(context.events, index2);
    if (tableBody) {
      tableBody.end = Object.assign({}, related);
      exits.push(["exit", tableBody, context]);
    }
    table2.end = Object.assign({}, related);
    exits.push(["exit", table2, context]);
    map2.add(index2 + 1, 0, exits);
  }
  function getPoint(events, index2) {
    const event = events[index2];
    const side = event[0] === "enter" ? "start" : "end";
    return event[1][side];
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
  function gfm(options) {
    return combineExtensions([
      gfmAutolinkLiteral,
      gfmFootnote(),
      gfmStrikethrough(),
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
  function standardizeLineBreaks(text2) {
    return text2.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  }
  async function exportToHtml(fileNameFormat, metaList) {
    if (!checkIfConversationStarted()) {
      alert(instance$1.t("Please start a conversation first"));
      return false;
    }
    const userAvatar = await getUserAvatar();
    const chatId = await getCurrentChatId();
    const rawConversation = await fetchConversation(chatId, true);
    const conversation = processConversation(rawConversation);
    const html2 = conversationToHtml(conversation, userAvatar, metaList);
    const fileName = getFileNameWithFormat(fileNameFormat, "html", { title: conversation.title, chatId, createTime: conversation.createTime, updateTime: conversation.updateTime });
    downloadFile(fileName, "text/html", standardizeLineBreaks(html2));
    return true;
  }
  async function exportAllToHtml(fileNameFormat, apiConversations, metaList, chunkIndex, totalChunks) {
    const userAvatar = await getUserAvatar();
    const zip = new JSZip();
    const filenameMap = /* @__PURE__ */ new Map();
    const conversations = apiConversations.map((x2) => processConversation(x2));
    conversations.forEach((conversation) => {
      let fileName = getFileNameWithFormat(fileNameFormat, "html", {
        title: conversation.title,
        chatId: conversation.id,
        createTime: conversation.createTime,
        updateTime: conversation.updateTime
      });
      if (filenameMap.has(fileName)) {
        const count2 = filenameMap.get(fileName) ?? 1;
        filenameMap.set(fileName, count2 + 1);
        fileName = `${fileName.slice(0, -5)} (${count2}).html`;
      } else {
        filenameMap.set(fileName, 1);
      }
      const content2 = conversationToHtml(conversation, userAvatar, metaList);
      zip.file(fileName, content2);
    });
    const blob = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: {
        level: 9
      }
    });
    const filename = totalChunks !== void 0 && totalChunks > 1 && chunkIndex !== void 0 ? `chatgpt-export-html-part${chunkIndex + 1}of${totalChunks}.zip` : "chatgpt-export-html.zip";
    downloadFile(filename, "application/zip", blob);
    return true;
  }
  function conversationToHtml(conversation, avatar, metaList) {
    const { id, title: title2, model, modelSlug, createTime, updateTime, conversationNodes } = conversation;
    const enableTimestamp = ScriptStorage.get(KEY_TIMESTAMP_ENABLED) ?? false;
    const timeStampHtml = ScriptStorage.get(KEY_TIMESTAMP_HTML) ?? false;
    const timeStamp24H = ScriptStorage.get(KEY_TIMESTAMP_24H) ?? false;
    const LatexRegex2 = /(\s\$\$.+?\$\$\s|\s\$.+?\$\s|\\\[.+?\\\]|\\\(.+?\\\))|(^\$$[\S\s]+?^\$$)|(^\$\$[\S\s]+?^\$\$\$)/gm;
    const conversationHtml = conversationNodes.map(({ message }) => {
      var _a, _b, _c, _d;
      if (!message || !message.content) return null;
      if (message.recipient !== "all") return null;
      if (message.author.role === "tool") {
        if (
          // HACK: we special case the content_type 'multimodal_text' here because it is used by
          // the dalle tool to return the image result, and we do want to show that.
          message.content.content_type !== "multimodal_text" && !(message.content.content_type === "execution_output" && ((_c = (_b = (_a = message.metadata) == null ? void 0 : _a.aggregate_result) == null ? void 0 : _b.messages) == null ? void 0 : _c.some((msg) => msg.message_type === "image")))
        ) {
          return null;
        }
      }
      const author = transformAuthor$2(message.author);
      const model2 = ((_d = message == null ? void 0 : message.metadata) == null ? void 0 : _d.model_slug) === "gpt-4" ? "GPT-4" : "GPT-3";
      const authorType = message.author.role === "user" ? "user" : model2;
      const avatarEl = message.author.role === "user" ? `<img alt="${author}" />` : '<svg width="41" height="41"><use xlink:href="#chatgpt" /></svg>';
      let postSteps = [];
      if (message.author.role === "assistant") {
        postSteps = [...postSteps, (input) => transformFootNotes$2(input, message.metadata)];
        postSteps.push((input) => {
          const matches = input.match(LatexRegex2);
          const isCodeBlock = /```/.test(input);
          if (!isCodeBlock && matches) {
            let index2 = 0;
            input = input.replace(LatexRegex2, () => {
              return `╬${index2++}╬`;
            });
            input = input.replace(/^\\\[(.+)\\\]$/gm, "$$$$$1$$$$").replace(/\\\[/g, "$$").replace(/\\\]/g, "$$").replace(/\\\(/g, "$").replace(/\\\)/g, "$");
          }
          let transformed = toHtml(fromMarkdown(input));
          if (!isCodeBlock && matches) {
            transformed = transformed.replace(/╬(\d+)╬/g, (_24, index2) => {
              return matches[+index2];
            });
          }
          return transformed;
        });
      }
      if (message.author.role === "user") {
        postSteps = [...postSteps, (input) => `<p class="no-katex">${escapeHtml(input)}</p>`];
      }
      const postProcess = (input) => postSteps.reduce((acc, fn2) => fn2(acc), input);
      const content2 = transformContent$2(message.content, message.metadata, postProcess);
      const timestamp2 = (message == null ? void 0 : message.create_time) ?? "";
      const showTimestamp = enableTimestamp && timeStampHtml && timestamp2;
      let timestampHtml = "";
      let conversationTime = "";
      if (showTimestamp) {
        const date2 = new Date(timestamp2 * 1e3);
        conversationTime = date2.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: !timeStamp24H });
        timestampHtml = `<time class="time" datetime="${date2.toISOString()}" title="${date2.toLocaleString()}">${conversationTime}</time>`;
      }
      return `
<div class="conversation-item">
    <div class="author ${authorType}">
        ${avatarEl}
    </div>
    <div class="conversation-content-wrapper">
        <div class="conversation-content">
            ${content2}
        </div>
    </div>
    ${timestampHtml}
</div>`;
    }).filter(Boolean).join("\n\n");
    const date = dateStr();
    const time = (/* @__PURE__ */ new Date()).toISOString();
    const source = `${baseUrl}/c/${id}`;
    const lang = document.documentElement.lang ?? "en";
    const theme = getColorScheme();
    const _metaList = (metaList == null ? void 0 : metaList.filter((x2) => !!x2.name).map(({ name, value }) => {
      const val = value.replace("{title}", title2).replace("{date}", date).replace("{timestamp}", timestamp()).replace("{source}", source).replace("{model}", model).replace("{mode_name}", modelSlug).replace("{create_time}", unixTimestampToISOString(createTime)).replace("{update_time}", unixTimestampToISOString(updateTime));
      return [name, val];
    })) ?? [];
    const detailsHtml = _metaList.length > 0 ? `<details>
    <summary>Metadata</summary>
    <div class="metadata_container">
        ${_metaList.map(([key2, value]) => `<div class="metadata_item"><div>${key2}</div><div>${value}</div></div>`).join("\n")}
    </div>
</details>` : "";
    const html2 = templateHtml.replaceAll("{{title}}", title2).replaceAll("{{date}}", date).replaceAll("{{time}}", time).replaceAll("{{source}}", source).replaceAll("{{lang}}", lang).replaceAll("{{theme}}", theme).replaceAll("{{avatar}}", avatar).replaceAll("{{details}}", detailsHtml).replaceAll("{{content}}", conversationHtml);
    return html2;
  }
  function transformAuthor$2(author) {
    switch (author.role) {
      case "assistant":
        return "ChatGPT";
      case "user":
        return "You";
      case "tool":
        return `Plugin${author.name ? ` (${author.name})` : ""}`;
      default:
        return author.role;
    }
  }
  function transformFootNotes$2(input, metadata) {
    const footNoteMarkRegex = /【(\d+)†\((.+?)\)】/g;
    return input.replace(footNoteMarkRegex, (match, citeIndex, _evidenceText) => {
      var _a;
      const citation = (_a = metadata == null ? void 0 : metadata.citations) == null ? void 0 : _a.find((cite) => {
        var _a2, _b;
        return ((_b = (_a2 = cite.metadata) == null ? void 0 : _a2.extra) == null ? void 0 : _b.cited_message_idx) === +citeIndex;
      });
      if (citation) return "";
      return match;
    });
  }
  function transformContent$2(content2, metadata, postProcess) {
    var _a, _b, _c, _d;
    switch (content2.content_type) {
      case "text":
        return postProcess(((_a = content2.parts) == null ? void 0 : _a.join("\n")) || "");
      case "code":
        return `Code:
\`\`\`
${content2.text}
\`\`\`` || "";
      case "execution_output":
        if ((_b = metadata == null ? void 0 : metadata.aggregate_result) == null ? void 0 : _b.messages) {
          return metadata.aggregate_result.messages.filter((msg) => msg.message_type === "image").map((msg) => `<img src="${msg.image_url}" height="${msg.height}" width="${msg.width}" />`).join("\n");
        }
        return postProcess(`Result:
\`\`\`
${content2.text}
\`\`\`` || "");
      case "tether_quote":
        return postProcess(`> ${content2.title || content2.text || ""}`);
      case "tether_browsing_code":
        return postProcess("");
      case "tether_browsing_display": {
        const metadataList = (_c = metadata == null ? void 0 : metadata._cite_metadata) == null ? void 0 : _c.metadata_list;
        if (Array.isArray(metadataList) && metadataList.length > 0) {
          return postProcess(metadataList.map(({ title: title2, url }) => {
            return `> [${title2}](${url})`;
          }).join("\n"));
        }
        return postProcess("");
      }
      case "multimodal_text": {
        return ((_d = content2.parts) == null ? void 0 : _d.map((part) => {
          if (typeof part === "string") return postProcess(part);
          if (part.content_type === "image_asset_pointer") return `<img src="${part.asset_pointer}" height="${part.height}" width="${part.width}" />`;
          if (part.content_type === "audio_transcription") return `<div style="font-style: italic; opacity: 0.65;">“${part.text}”</div>`;
          if (part.content_type === "audio_asset_pointer") return null;
          if (part.content_type === "real_time_user_audio_video_asset_pointer") return null;
          return postProcess("[Unsupported multimodal content]");
        }).join("\n")) || "";
      }
      default:
        return postProcess(`[Unsupported Content: ${content2.content_type} ]`);
    }
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
      if (this._isDisposed) return;
      this._sideEffects.push(sideEffect);
    }
    /**
     * Executes all the side effects.
     */
    run() {
      if (this._isDisposed) return;
      this._sideEffects.forEach((fn2) => {
        const cleanupFn = fn2();
        if (cleanupFn) this._cleanupFns.push(cleanupFn);
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
      if (this._isDisposed) return;
      this._cleanupFns.forEach((fn2) => fn2());
      this._cleanupFns = [];
      this._isDisposed = true;
    }
  }
  function fnIgnoreElements(el) {
    return typeof el.shadowRoot === "object" && el.shadowRoot !== null;
  }
  async function exportToPng(fileNameFormat) {
    if (!checkIfConversationStarted()) {
      alert(instance$1.t("Please start a conversation first"));
      return false;
    }
    const effect = new Effect();
    const thread = document.querySelector('#thread div:has(> [data-testid="conversation-turn-1"]');
    if (!thread || thread.children.length === 0 || thread.scrollHeight < 50) {
      alert(instance$1.t("Failed to export to PNG. Failed to find the element node."));
      return false;
    }
    const isDarkMode = document.documentElement.classList.contains("dark");
    effect.add(() => {
      const style = document.createElement("style");
      style.textContent = `
            #thread div:has(> [data-testid="conversation-turn-1"]),
            #thread [data-testid^="conversation-turn-"] {
                color: ${isDarkMode ? "#ececec" : "#0d0d0d"};
                background-color: ${isDarkMode ? "#212121" : "#fff"};
            }

            /* https://github.com/niklasvh/html2canvas/issues/2775#issuecomment-1204988157 */
            img {
                display: initial !important;
            }

            pre {
                margin-top: 8px !important;
            }

            pre > div > div > span {
                margin-top: -12px;
                padding-bottom: 2px;
            }

            #page-header,
            #thread-bottom-container,
            /* any other elements that are not conversation turns */
            #thread div:has(> [data-testid="conversation-turn-1"]) > :not([data-testid^="conversation-turn-"]),
            /* hide back to top button */
            button.absolute,
            /* question button */
            .group.absolute > button {
                display: none;
            }

            /* conversation action bar */
            .group\\/conversation-turn > div > div.absolute,
            /* code block buttons */
            #thread pre button {
                visibility: hidden;
            }
            `;
      thread.appendChild(style);
      return () => style.remove();
    });
    const threadEl = thread;
    effect.run();
    await sleep(100);
    const passLimit = 10;
    const takeScreenshot = async (width, height, additionalScale = 1, currentPass = 1) => {
      const ratio = window.devicePixelRatio || 1;
      const scale = ratio * 2 * additionalScale;
      let canvas = null;
      try {
        canvas = await html2canvas(threadEl, {
          scale,
          useCORS: true,
          scrollX: -window.scrollX,
          scrollY: -window.scrollY,
          windowWidth: width,
          windowHeight: height,
          ignoreElements: fnIgnoreElements
        });
      } catch (error2) {
        console.log(`ChatGPT Exporter:takeScreenshot with height=${height} width=${width} scale=${scale}`);
        console.error("Failed to take screenshot", error2);
      }
      const context = canvas == null ? void 0 : canvas.getContext("2d");
      if (context) context.imageSmoothingEnabled = false;
      const dataUrl2 = canvas == null ? void 0 : canvas.toDataURL("image/png", 1).replace(/^data:image\/[^;]/, "data:application/octet-stream");
      if (!canvas || !dataUrl2 || dataUrl2 === "data:,") {
        if (currentPass > passLimit) return null;
        return takeScreenshot(width, height, additionalScale / 1.4, currentPass + 1);
      }
      return dataUrl2;
    };
    const dataUrl = await takeScreenshot(thread.scrollWidth, thread.scrollHeight);
    effect.dispose();
    if (!dataUrl) {
      alert("Failed to export to PNG. This might be caused by the size of the conversation. Please try to export a smaller conversation.");
      return false;
    }
    const chatId = getChatIdFromUrl() || void 0;
    const fileName = getFileNameWithFormat(fileNameFormat, "png", { chatId });
    downloadUrl(fileName, dataUrl);
    window.URL.revokeObjectURL(dataUrl);
    return true;
  }
  function convertMessageToTavern(node2) {
    if (!node2.message || node2.message.content.content_type !== "text") {
      return null;
    }
    const authorRole = node2.message.author.role;
    const createTime = node2.message.create_time || (/* @__PURE__ */ new Date()).getTime() / 1e3;
    const text2 = node2.message.content.parts.join("\n");
    return {
      name: authorRole === "assistant" ? "Assistant" : "You",
      is_user: authorRole === "user",
      // This is the opposite of is_user! Not always true.
      is_name: authorRole === "assistant",
      send_date: createTime,
      mes: text2,
      swipes: [text2],
      swipe_id: 0
    };
  }
  function convertToTavern(conversation) {
    const messages = [
      {
        user_name: "You",
        character_name: "Assistant"
      },
      ...conversation.conversationNodes.map(convertMessageToTavern).filter(nonNullable)
    ];
    return jsonlStringify(messages);
  }
  function convertToOoba(conversation) {
    const pairs = [];
    const messages = conversation.conversationNodes.filter((node2) => {
      var _a, _b;
      return ((_a = node2.message) == null ? void 0 : _a.author.role) !== "tool" && ((_b = node2.message) == null ? void 0 : _b.content.content_type) === "text";
    });
    let idx = 0;
    while (idx < messages.length - 1) {
      const message = messages[idx];
      const nextMessage = messages[idx + 1];
      if (!message.message || !nextMessage.message || message.message.content.content_type !== "text" || nextMessage.message.content.content_type !== "text") {
        idx += 1;
        continue;
      }
      const role = message.message.author.role;
      const text2 = message.message.content.parts[0];
      const nextRole = nextMessage.message.author.role;
      const nextText = nextMessage.message.content.parts[0];
      if (role === "system") {
        if (text2 !== "") {
          pairs.push(["<|BEGIN-VISIBLE-CHAT|>", text2]);
        }
        idx += 1;
        continue;
      }
      if (role === "user") {
        if (nextRole === "assistant") {
          pairs.push([text2, nextText]);
          idx += 2;
          continue;
        } else if (nextRole === "user") {
          pairs.push([text2, ""]);
          idx += 1;
          continue;
        }
      }
      if (role === "assistant") {
        pairs.push(["", text2]);
        idx += 1;
      }
    }
    const oobaData = {
      internal: pairs,
      visible: JSON.parse(JSON.stringify(pairs))
    };
    if (oobaData.visible[0] && oobaData.visible[0][0] === "<|BEGIN-VISIBLE-CHAT|>") {
      oobaData.visible[0][0] = "";
    }
    return JSON.stringify(oobaData, null, 2);
  }
  async function exportToJson(fileNameFormat) {
    if (!checkIfConversationStarted()) {
      alert(instance$1.t("Please start a conversation first"));
      return false;
    }
    const chatId = await getCurrentChatId();
    const rawConversation = await fetchConversation(chatId, false);
    const conversation = processConversation(rawConversation);
    const fileName = getFileNameWithFormat(fileNameFormat, "json", { title: conversation.title, chatId });
    const content2 = conversationToJson([rawConversation]);
    downloadFile(fileName, "application/json", content2);
    return true;
  }
  async function exportToTavern(fileNameFormat) {
    if (!checkIfConversationStarted()) {
      alert(instance$1.t("Please start a conversation first"));
      return false;
    }
    const chatId = await getCurrentChatId();
    const rawConversation = await fetchConversation(chatId, false);
    const conversation = processConversation(rawConversation);
    const fileName = getFileNameWithFormat(`${fileNameFormat}.tavern`, "jsonl", { title: conversation.title, chatId });
    const content2 = convertToTavern(conversation);
    downloadFile(fileName, "application/json-lines", content2);
    return true;
  }
  async function exportToOoba(fileNameFormat) {
    if (!checkIfConversationStarted()) {
      alert(instance$1.t("Please start a conversation first"));
      return false;
    }
    const chatId = await getCurrentChatId();
    const rawConversation = await fetchConversation(chatId, false);
    const conversation = processConversation(rawConversation);
    const fileName = getFileNameWithFormat(`${fileNameFormat}.ooba`, "json", { title: conversation.title, chatId });
    const content2 = convertToOoba(conversation);
    downloadFile(fileName, "application/json", content2);
    return true;
  }
  async function exportAllToOfficialJson(_fileNameFormat, apiConversations, _metaList, chunkIndex, totalChunks) {
    const content2 = conversationToJson(apiConversations);
    const filename = totalChunks !== void 0 && totalChunks > 1 && chunkIndex !== void 0 ? `chatgpt-export-part${chunkIndex + 1}of${totalChunks}.json` : "chatgpt-export.json";
    downloadFile(filename, "application/json", content2);
    return true;
  }
  async function exportAllToJson(fileNameFormat, apiConversations, _metaList, chunkIndex, totalChunks) {
    const zip = new JSZip();
    const filenameMap = /* @__PURE__ */ new Map();
    const conversations = apiConversations.map((x2) => ({
      conversation: processConversation(x2),
      rawConversation: x2
    }));
    conversations.forEach(({ conversation, rawConversation }) => {
      let fileName = getFileNameWithFormat(fileNameFormat, "json", {
        title: conversation.title,
        chatId: conversation.id,
        createTime: conversation.createTime,
        updateTime: conversation.updateTime
      });
      if (filenameMap.has(fileName)) {
        const count2 = filenameMap.get(fileName) ?? 1;
        filenameMap.set(fileName, count2 + 1);
        fileName = `${fileName.slice(0, -5)} (${count2}).json`;
      } else {
        filenameMap.set(fileName, 1);
      }
      const content2 = conversationToJson(rawConversation);
      zip.file(fileName, content2);
    });
    const blob = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: {
        level: 9
      }
    });
    const filename = totalChunks !== void 0 && totalChunks > 1 && chunkIndex !== void 0 ? `chatgpt-export-json-part${chunkIndex + 1}of${totalChunks}.zip` : "chatgpt-export-json.zip";
    downloadFile(filename, "application/zip", blob);
    return true;
  }
  function conversationToJson(conversation) {
    return JSON.stringify(conversation);
  }
  async function exportToMarkdown(fileNameFormat, metaList) {
    if (!checkIfConversationStarted()) {
      alert(instance$1.t("Please start a conversation first"));
      return false;
    }
    const chatId = await getCurrentChatId();
    const rawConversation = await fetchConversation(chatId, true);
    const conversation = processConversation(rawConversation);
    const markdown = conversationToMarkdown(conversation, metaList);
    const fileName = getFileNameWithFormat(fileNameFormat, "md", { title: conversation.title, chatId, createTime: conversation.createTime, updateTime: conversation.updateTime });
    downloadFile(fileName, "text/markdown", standardizeLineBreaks(markdown));
    return true;
  }
  async function exportAllToMarkdown(fileNameFormat, apiConversations, metaList, chunkIndex, totalChunks) {
    const zip = new JSZip();
    const filenameMap = /* @__PURE__ */ new Map();
    const conversations = apiConversations.map((x2) => processConversation(x2));
    conversations.forEach((conversation) => {
      let fileName = getFileNameWithFormat(fileNameFormat, "md", {
        title: conversation.title,
        chatId: conversation.id,
        createTime: conversation.createTime,
        updateTime: conversation.updateTime
      });
      if (filenameMap.has(fileName)) {
        const count2 = filenameMap.get(fileName) ?? 1;
        filenameMap.set(fileName, count2 + 1);
        fileName = `${fileName.slice(0, -3)} (${count2}).md`;
      } else {
        filenameMap.set(fileName, 1);
      }
      const content2 = conversationToMarkdown(conversation, metaList);
      zip.file(fileName, content2);
    });
    const blob = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: {
        level: 9
      }
    });
    const filename = totalChunks !== void 0 && totalChunks > 1 && chunkIndex !== void 0 ? `chatgpt-export-markdown-part${chunkIndex + 1}of${totalChunks}.zip` : "chatgpt-export-markdown.zip";
    downloadFile(filename, "application/zip", blob);
    return true;
  }
  const LatexRegex$1 = /(\s\$\$.+\$\$\s|\s\$.+\$\s|\\\[.+\\\]|\\\(.+\\\))|(^\$$[\S\s]+^\$$)|(^\$\$[\S\s]+^\$\$$)/gm;
  function conversationToMarkdown(conversation, metaList) {
    const { id, title: title2, model, modelSlug, createTime, updateTime, conversationNodes } = conversation;
    const source = `${baseUrl}/c/${id}`;
    const _metaList = (metaList == null ? void 0 : metaList.filter((x2) => !!x2.name).map(({ name, value }) => {
      const val = value.replace("{title}", title2).replace("{date}", dateStr()).replace("{timestamp}", timestamp()).replace("{source}", source).replace("{model}", model).replace("{model_name}", modelSlug).replace("{create_time}", unixTimestampToISOString(createTime)).replace("{update_time}", unixTimestampToISOString(updateTime));
      return `${name}: ${val}`;
    })) ?? [];
    const frontMatter = _metaList.length > 0 ? `---
${_metaList.join("\n")}
---

` : "";
    const enableTimestamp = ScriptStorage.get(KEY_TIMESTAMP_ENABLED) ?? false;
    const timeStampMarkdown = ScriptStorage.get(KEY_TIMESTAMP_MARKDOWN) ?? false;
    const timeStamp24H = ScriptStorage.get(KEY_TIMESTAMP_24H) ?? false;
    const content2 = conversationNodes.map(({ message }) => {
      var _a, _b, _c;
      if (!message || !message.content) return null;
      if (message.recipient !== "all") return null;
      if (message.author.role === "tool") {
        if (
          // HACK: we special case the content_type 'multimodal_text' here because it is used by
          // the dalle tool to return the image result, and we do want to show that.
          message.content.content_type !== "multimodal_text" && !(message.content.content_type === "execution_output" && ((_c = (_b = (_a = message.metadata) == null ? void 0 : _a.aggregate_result) == null ? void 0 : _b.messages) == null ? void 0 : _c.some((msg) => msg.message_type === "image")))
        ) {
          return null;
        }
      }
      const timestamp2 = (message == null ? void 0 : message.create_time) ?? "";
      const showTimestamp = enableTimestamp && timeStampMarkdown && timestamp2;
      let timestampHtml = "";
      if (showTimestamp) {
        const date = new Date(timestamp2 * 1e3);
        const conversationTime = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: !timeStamp24H });
        timestampHtml = `<time datetime="${date.toISOString()}" title="${date.toLocaleString()}">${conversationTime}</time>

`;
      }
      const author = transformAuthor$1(message.author);
      const postSteps = [];
      if (message.author.role === "assistant") {
        postSteps.push((input) => transformFootNotes$1(input, message.metadata));
      }
      if (message.author.role === "assistant") {
        postSteps.push((input) => {
          input = input.replace(/^\\\[(.+)\\\]$/gm, "$$$$$1$$$$").replace(/\\\[/g, "$").replace(/\\\]/g, "$").replace(/\\\(/g, "$").replace(/\\\)/g, "$");
          const matches = input.match(LatexRegex$1);
          const isCodeBlock = /```/.test(input);
          if (!isCodeBlock && matches) {
            let index2 = 0;
            input = input.replace(LatexRegex$1, () => {
              return `╬${index2++}╬`;
            });
          }
          let transformed = toMarkdown(fromMarkdown(input));
          if (!isCodeBlock && matches) {
            transformed = transformed.replace(/╬(\d+)╬/g, (_24, index2) => {
              return matches[+index2];
            });
          }
          return transformed;
        });
      }
      const postProcess = (input) => postSteps.reduce((acc, fn2) => fn2(acc), input);
      const content22 = transformContent$1(message.content, message.metadata, postProcess);
      return `#### ${author}:
${timestampHtml}${content22}`;
    }).filter(Boolean).join("\n\n");
    const markdown = `${frontMatter}# ${title2}

${content2}`;
    return markdown;
  }
  function transformAuthor$1(author) {
    switch (author.role) {
      case "assistant":
        return "ChatGPT";
      case "user":
        return "You";
      case "tool":
        return `Plugin${author.name ? ` (${author.name})` : ""}`;
      default:
        return author.role;
    }
  }
  function transformFootNotes$1(input, metadata) {
    const footNoteMarkRegex = /【(\d+)†\((.+?)\)】/g;
    const citationList = [];
    const output2 = input.replace(footNoteMarkRegex, (match, citeIndex, _evidenceText) => {
      var _a;
      const citation = (_a = metadata == null ? void 0 : metadata.citations) == null ? void 0 : _a.find((cite) => {
        var _a2, _b;
        return ((_b = (_a2 = cite.metadata) == null ? void 0 : _a2.extra) == null ? void 0 : _b.cited_message_idx) === +citeIndex;
      });
      if (citation) {
        citationList.push(citation);
        return `[^${citeIndex}]`;
      }
      return match;
    });
    const citationText = citationList.map((citation) => {
      var _a, _b, _c;
      const citeIndex = ((_b = (_a = citation.metadata) == null ? void 0 : _a.extra) == null ? void 0 : _b.cited_message_idx) ?? 1;
      const citeTitle = ((_c = citation.metadata) == null ? void 0 : _c.title) ?? "No title";
      return `[^${citeIndex}]: ${citeTitle}`;
    }).join("\n");
    return `${output2}

${citationText}`;
  }
  function transformContent$1(content2, metadata, postProcess) {
    var _a, _b, _c, _d;
    switch (content2.content_type) {
      case "text":
        return postProcess(((_a = content2.parts) == null ? void 0 : _a.join("\n")) || "");
      case "code":
        return `Code:
\`\`\`
${content2.text}
\`\`\`` || "";
      case "execution_output":
        if ((_b = metadata == null ? void 0 : metadata.aggregate_result) == null ? void 0 : _b.messages) {
          return metadata.aggregate_result.messages.filter((msg) => msg.message_type === "image").map((msg) => `![image](${msg.image_url})`).join("\n");
        }
        return postProcess(`Result:
\`\`\`
${content2.text}
\`\`\`` || "");
      case "tether_quote":
        return postProcess(`> ${content2.title || content2.text || ""}`);
      case "tether_browsing_code":
        return postProcess("");
      case "tether_browsing_display": {
        const metadataList = (_c = metadata == null ? void 0 : metadata._cite_metadata) == null ? void 0 : _c.metadata_list;
        if (Array.isArray(metadataList) && metadataList.length > 0) {
          return postProcess(metadataList.map(({ title: title2, url }) => `> [${title2}](${url})`).join("\n"));
        }
        return postProcess("");
      }
      case "multimodal_text": {
        return ((_d = content2.parts) == null ? void 0 : _d.map((part) => {
          if (typeof part === "string") return postProcess(part);
          if (part.content_type === "image_asset_pointer") return `![image](${part.asset_pointer})`;
          if (part.content_type === "audio_transcription") return `[audio] ${part.text}`;
          if (part.content_type === "audio_asset_pointer") return null;
          if (part.content_type === "real_time_user_audio_video_asset_pointer") return null;
          return postProcess("[Unsupported multimodal content]");
        }).join("\n")) || "";
      }
      default:
        return postProcess("[Unsupported Content]");
    }
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
      alert(instance$1.t("Please start a conversation first"));
      return false;
    }
    const chatId = await getCurrentChatId();
    const rawConversation = await fetchConversation(chatId, false);
    const { conversationNodes } = processConversation(rawConversation);
    const text2 = conversationNodes.map(({ message }) => transformMessage(message)).filter(Boolean).join("\n\n");
    copyToClipboard(standardizeLineBreaks(text2));
    return true;
  }
  const LatexRegex = /(\s\$\$.+\$\$\s|\s\$.+\$\s|\\\[.+\\\]|\\\(.+\\\))|(^\$$[\S\s]+^\$$)|(^\$\$[\S\s]+^\$\$$)/gm;
  function transformMessage(message) {
    var _a, _b, _c;
    if (!message || !message.content) return null;
    if (message.recipient !== "all") return null;
    if (message.author.role === "tool") {
      if (
        // HACK: we special case the content_type 'multimodal_text' here because it is used by
        // the dalle tool to return the image result, and we do want to show that.
        message.content.content_type !== "multimodal_text" && !(message.content.content_type === "execution_output" && ((_c = (_b = (_a = message.metadata) == null ? void 0 : _a.aggregate_result) == null ? void 0 : _b.messages) == null ? void 0 : _c.some((msg) => msg.message_type === "image")))
      ) {
        return null;
      }
    }
    const author = transformAuthor(message.author);
    let content2 = transformContent(message.content, message.metadata);
    const matches = content2.match(LatexRegex);
    if (matches) {
      let index2 = 0;
      content2 = content2.replace(LatexRegex, () => {
        return `╬${index2++}╬`;
      });
    }
    if (message.author.role === "assistant") {
      content2 = transformFootNotes(content2, message.metadata);
    }
    if (message.author.role === "assistant" && content2) {
      content2 = reformatContent(content2);
    }
    if (matches) {
      content2 = content2.replace(/╬(\d+)╬/g, (_24, index2) => {
        return matches[+index2];
      });
    }
    return `${author}:
${content2}`;
  }
  function transformContent(content2, metadata) {
    var _a, _b, _c, _d;
    switch (content2.content_type) {
      case "text":
        return ((_a = content2.parts) == null ? void 0 : _a.join("\n")) || "";
      case "code":
        return content2.text || "";
      case "execution_output":
        if ((_b = metadata == null ? void 0 : metadata.aggregate_result) == null ? void 0 : _b.messages) {
          return metadata.aggregate_result.messages.filter((msg) => msg.message_type === "image").map(() => "[image]").join("\n");
        }
        return content2.text || "";
      case "tether_quote":
        return `> ${content2.title || content2.text || ""}`;
      case "tether_browsing_code":
        return "";
      case "tether_browsing_display": {
        const metadataList = (_c = metadata == null ? void 0 : metadata._cite_metadata) == null ? void 0 : _c.metadata_list;
        if (Array.isArray(metadataList) && metadataList.length > 0) {
          return metadataList.map(({ title: title2, url }) => `> [${title2}](${url})`).join("\n");
        }
        return "";
      }
      case "multimodal_text": {
        return ((_d = content2.parts) == null ? void 0 : _d.map((part) => {
          if (typeof part === "string") return part;
          if (part.content_type === "image_asset_pointer") return "[image]";
          if (part.content_type === "audio_transcription") return `[audio] ${part.text}`;
          if (part.content_type === "audio_asset_pointer") return null;
          if (part.content_type === "real_time_user_audio_video_asset_pointer") return null;
          return "[Unsupported multimodal content]";
        }).join("\n")) || "";
      }
      default:
        return "[Unsupported Content]";
    }
  }
  function reformatContent(input) {
    const root2 = fromMarkdown(input);
    flatMap(root2, (item) => {
      if (item.type === "strong") return item.children;
      if (item.type === "emphasis") return item.children;
      return [item];
    });
    const result = toMarkdown(root2);
    if (result.startsWith("\\[") && input.startsWith("[")) {
      return result.slice(1);
    }
    return result;
  }
  function transformAuthor(author) {
    switch (author.role) {
      case "assistant":
        return "ChatGPT";
      case "user":
        return "You";
      case "tool":
        return `Plugin${author.name ? ` (${author.name})` : ""}`;
      default:
        return author.role;
    }
  }
  function transformFootNotes(input, metadata) {
    const footNoteMarkRegex = /【(\d+)†\((.+?)\)】/g;
    return input.replace(footNoteMarkRegex, (match, citeIndex, _evidenceText) => {
      var _a;
      const citation = (_a = metadata == null ? void 0 : metadata.citations) == null ? void 0 : _a.find((cite) => {
        var _a2, _b;
        return ((_b = (_a2 = cite.metadata) == null ? void 0 : _a2.extra) == null ? void 0 : _b.cited_message_idx) === +citeIndex;
      });
      if (citation) return "";
      return match;
    });
  }
  function useWindowResize(selector) {
    return C$1(subscribe$1, selector);
  }
  function subscribe$1(callback) {
    window.addEventListener("resize", callback);
    return () => window.removeEventListener("resize", callback);
  }
  const Divider = () => /* @__PURE__ */ u$5("div", { className: "h-px bg-token-border-light" });
  const CODE_BLOCK_REGEX = /```[\s\S]*?```/g;
  const MATH_BLOCK_REGEX = /\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]/g;
  const LINK_REGEX = /https?:\/\/[^\s]+/g;
  const IMAGE_MARKDOWN_REGEX = /!\[.*?\]\(.*?\)/g;
  const UNCERTAINTY_WORDS = /\b(maybe|perhaps|possibly|not sure|I think|seems like|might be|could be|uncertain)\b/gi;
  const CERTAINTY_WORDS = /\b(definitely|clearly|obviously|exactly|certainly|surely|absolutely|precisely)\b/gi;
  const DISCOVERY_WORDS = /\b(aha|oh!|I see|wait|interesting|got it|makes sense|eureka)\b/gi;
  function analyzeConversation(conversation) {
    const nodes = Object.values(conversation.mapping);
    const messages = nodes.filter((n2) => n2.message && n2.message.author.role !== "system");
    const userMessages = messages.filter((n2) => {
      var _a;
      return ((_a = n2.message) == null ? void 0 : _a.author.role) === "user";
    });
    const aiMessages = messages.filter((n2) => {
      var _a;
      return ((_a = n2.message) == null ? void 0 : _a.author.role) === "assistant";
    });
    const userCharCount = userMessages.reduce((sum, n2) => sum + getMessageText(n2.message).length, 0);
    const aiCharCount = aiMessages.reduce((sum, n2) => sum + getMessageText(n2.message).length, 0);
    const totalCharCount = userCharCount + aiCharCount;
    const inputOutputRatio = aiCharCount > 0 ? userCharCount / aiCharCount : 0;
    const allText = messages.map((n2) => getMessageText(n2.message)).join("\n");
    const codeBlockCount = (allText.match(CODE_BLOCK_REGEX) || []).length;
    const mathBlockCount = (allText.match(MATH_BLOCK_REGEX) || []).length;
    const linkCount = (allText.match(LINK_REGEX) || []).length;
    const imageCount = (allText.match(IMAGE_MARKDOWN_REGEX) || []).length + countMultimodalImages(messages);
    const userText = userMessages.map((n2) => getMessageText(n2.message)).join("\n");
    const uncertaintyMarkers = (userText.match(UNCERTAINTY_WORDS) || []).length;
    const certaintyMarkers = (userText.match(CERTAINTY_WORDS) || []).length;
    const discoveryMarkers = (userText.match(DISCOVERY_WORDS) || []).length;
    const questionCount = (userText.match(/\?/g) || []).length;
    const exclamationCount = (userText.match(/!/g) || []).length;
    const createTime = conversation.create_time;
    const updateTime = conversation.update_time;
    const createDate = new Date(createTime * 1e3);
    const hourOfDay = createDate.getHours();
    const dayOfWeek = createDate.getDay();
    return {
      id: conversation.id,
      title: conversation.title,
      totalTurns: messages.length,
      userMessageCount: userMessages.length,
      aiMessageCount: aiMessages.length,
      userCharCount,
      aiCharCount,
      totalCharCount,
      inputOutputRatio,
      avgUserMessageLength: userMessages.length > 0 ? userCharCount / userMessages.length : 0,
      avgAiMessageLength: aiMessages.length > 0 ? aiCharCount / aiMessages.length : 0,
      depth: calculateDepth(conversation.mapping),
      hasCode: codeBlockCount > 0,
      codeBlockCount,
      hasMath: mathBlockCount > 0,
      mathBlockCount,
      hasImages: imageCount > 0,
      imageCount,
      hasLinks: linkCount > 0,
      linkCount,
      questionCount,
      exclamationCount,
      uncertaintyMarkers,
      certaintyMarkers,
      discoveryMarkers,
      createTime,
      updateTime,
      hourOfDay,
      dayOfWeek
    };
  }
  function filterConversations(conversations, criteria) {
    return conversations.filter((conv) => {
      const metrics = analyzeConversation(conv);
      if (criteria.minInputOutputRatio !== void 0 && metrics.inputOutputRatio < criteria.minInputOutputRatio) {
        return false;
      }
      if (criteria.maxInputOutputRatio !== void 0 && metrics.inputOutputRatio > criteria.maxInputOutputRatio) {
        return false;
      }
      if (criteria.minTurns !== void 0 && metrics.totalTurns < criteria.minTurns) {
        return false;
      }
      if (criteria.maxTurns !== void 0 && metrics.totalTurns > criteria.maxTurns) {
        return false;
      }
      if (criteria.hasCode !== void 0 && metrics.hasCode !== criteria.hasCode) {
        return false;
      }
      if (criteria.hasMath !== void 0 && metrics.hasMath !== criteria.hasMath) {
        return false;
      }
      if (criteria.hasImages !== void 0 && metrics.hasImages !== criteria.hasImages) {
        return false;
      }
      if (criteria.hasDiscoveryMarkers && metrics.discoveryMarkers === 0) {
        return false;
      }
      if (criteria.hasHighUncertainty && metrics.uncertaintyMarkers < 5) {
        return false;
      }
      if (criteria.isQuestionHeavy && metrics.questionCount < 10) {
        return false;
      }
      if (criteria.startDate !== void 0 && metrics.createTime < criteria.startDate) {
        return false;
      }
      if (criteria.endDate !== void 0 && metrics.createTime > criteria.endDate) {
        return false;
      }
      if (criteria.searchTerm) {
        const searchLower = criteria.searchTerm.toLowerCase();
        if (!metrics.title.toLowerCase().includes(searchLower)) {
          return false;
        }
      }
      return true;
    });
  }
  function getMessageText(message) {
    var _a, _b;
    if (!message.content) return "";
    switch (message.content.content_type) {
      case "text":
        return ((_a = message.content.parts) == null ? void 0 : _a.join("\n")) || "";
      case "code":
        return message.content.text || "";
      case "execution_output":
        return message.content.text || "";
      case "multimodal_text":
        return ((_b = message.content.parts) == null ? void 0 : _b.filter((p2) => typeof p2 === "string").join("\n")) || "";
      default:
        return "";
    }
  }
  function countMultimodalImages(messages) {
    let count2 = 0;
    messages.forEach((node2) => {
      if (!node2.message) return;
      const content2 = node2.message.content;
      if (content2.content_type === "multimodal_text" && Array.isArray(content2.parts)) {
        count2 += content2.parts.filter(
          (p2) => typeof p2 === "object" && p2 !== null && "content_type" in p2 && p2.content_type === "image_asset_pointer"
        ).length;
      }
    });
    return count2;
  }
  function calculateDepth(mapping) {
    let maxDepth = 0;
    function traverse(nodeId, depth) {
      maxDepth = Math.max(maxDepth, depth);
      const node2 = mapping[nodeId];
      if (node2 && node2.children) {
        node2.children.forEach((childId) => traverse(childId, depth + 1));
      }
    }
    Object.keys(mapping).forEach((id) => {
      if (!mapping[id].parent) {
        traverse(id, 0);
      }
    });
    return maxDepth;
  }
  function EventEmitter(n2) {
    return { all: n2 = n2 || /* @__PURE__ */ new Map(), on: function(t2, e2) {
      var i2 = n2.get(t2);
      i2 ? i2.push(e2) : n2.set(t2, [e2]);
    }, off: function(t2, e2) {
      var i2 = n2.get(t2);
      i2 && (e2 ? i2.splice(i2.indexOf(e2) >>> 0, 1) : n2.set(t2, []));
    }, emit: function(t2, e2) {
      var i2 = n2.get(t2);
      i2 && i2.slice().map(function(n3) {
        n3(e2);
      }), (i2 = n2.get("*")) && i2.slice().map(function(n3) {
        n3(t2, e2);
      });
    } };
  }
  class RequestQueue {
    constructor(minBackoff, maxBackoff, chunkSize) {
      __publicField(this, "eventEmitter", EventEmitter());
      __publicField(this, "queue", []);
      __publicField(this, "results", []);
      __publicField(this, "status", "IDLE");
      __publicField(this, "backoffMultiplier", 2);
      __publicField(this, "backoff");
      __publicField(this, "total", 0);
      __publicField(this, "completed", 0);
      __publicField(this, "currentChunkIndex", 0);
      this.minBackoff = minBackoff;
      this.maxBackoff = maxBackoff;
      this.chunkSize = chunkSize;
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
      this.currentChunkIndex = 0;
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
      const { name, request } = requestObject;
      try {
        this.progress(name, "processing");
        const result = await request();
        this.results.push(result);
        this.completed++;
        this.progress(name, "processing");
        this.backoff = this.minBackoff;
        if (this.chunkSize && this.results.length >= this.chunkSize) {
          const chunk = this.results.splice(0, this.chunkSize);
          const totalChunks = Math.ceil(this.total / this.chunkSize);
          this.eventEmitter.emit("chunkComplete", {
            chunk,
            chunkIndex: this.currentChunkIndex,
            totalChunks
          });
          this.currentChunkIndex++;
        }
      } catch (error2) {
        console.error(`Request ${name} failed:`, error2);
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
      if (this.chunkSize && this.results.length > 0) {
        const chunk = this.results.splice(0, this.results.length);
        const totalChunks = Math.ceil(this.total / this.chunkSize);
        this.eventEmitter.emit("chunkComplete", {
          chunk,
          chunkIndex: this.currentChunkIndex,
          totalChunks
        });
      }
      this.eventEmitter.emit("done", this.results);
    }
  }
  const SYSTEM_PROMPT = `You are an expert conversation analyst specializing in extracting structured insights from human-AI dialogues.

Your task is to analyze conversation chunks and extract specific types of events, insights, and patterns while ALWAYS providing evidence (exact quotes) from the source conversation.

Key principles:
1. **Evidence-based**: Every insight must be grounded in actual conversation text
2. **Precise quotes**: Include exact quotes with turn numbers
3. **Contextual**: Understand the flow and progression of ideas
4. **Structured output**: Always return valid JSON matching the requested schema
5. **Conservative**: Only extract insights you're confident about (confidence > 0.7)

When analyzing:
- Pay attention to discovery moments ("aha!", "I see", "oh!")
- Track assumptions ("I assume", "probably", "should")
- Identify decisions ("let's do", "we'll use", "I'll go with")
- Note questions (especially unanswered ones)
- Detect problem-solution pairs
- Recognize creative prompts and ideation

Remember: The conversation might be a chunk from a larger discussion. Consider context from turn numbers and timestamps.`;
  function createEventExtractionPrompt(chunk) {
    return `Analyze the following conversation chunk and extract ALL significant events.

For each event, provide:
- **type**: The event type (aha_moment, question_asked, decision_made, assumption_stated, problem_identified, solution_proposed, creative_prompt, uncertainty, discovery, etc.)
- **turn_number**: Which turn it occurred in
- **speaker**: "user" or "assistant"
- **content**: Brief description of the insight/event
- **quote**: EXACT quote from the conversation (2-3 sentences max)
- **context**: Surrounding context that makes this significant
- **confidence**: 0.0-1.0 how confident you are in this extraction
- **tags**: Relevant tags (e.g., ["technical", "decision"], ["creative", "ideation"])

Event types to look for:
- **aha_moment**: Sudden realization, "I see!", breakthrough moments
- **question_asked**: User asks a question (especially open/unanswered)
- **question_answered**: A previous question gets answered
- **decision_made**: A choice or direction is decided
- **assumption_stated**: User or assistant states an assumption
- **assumption_challenge**: An assumption is questioned or invalidated
- **problem_identified**: A problem/challenge is recognized
- **solution_proposed**: A solution is suggested
- **creative_prompt**: Generative thinking, "what if", brainstorming
- **uncertainty**: Expressions of uncertainty, doubt, "I'm not sure"
- **discovery**: Learning something new, realizations

Return a JSON object with this structure:
\`\`\`json
{
  "events": [
    {
      "type": "aha_moment",
      "turn_number": 5,
      "speaker": "user",
      "content": "Input/output ratio reveals conversation depth",
      "quote": "I think the ones where i write more are more interesting",
      "context": "User realized that conversations with higher user input are more valuable",
      "confidence": 0.95,
      "tags": ["discovery", "metrics", "insight"]
    }
  ]
}
\`\`\`

CONVERSATION CHUNK:
${formatChunkForPrompt(chunk)}

Analyze this chunk and extract all events in the JSON format specified above.`;
  }
  function createConceptExtractionPrompt(chunk) {
    return `Analyze the following conversation chunk and identify all significant CONCEPTS discussed.

A concept is a recurring idea, topic, technique, or theme. Examples:
- Technical concepts: "chunking", "rate limiting", "memory management"
- Domain concepts: "Theory of Mind", "conversation analysis", "knowledge graphs"
- Abstract concepts: "discovery", "optimization", "user experience"

For each concept mentioned, provide:
- **label**: The concept name (concise, 1-3 words)
- **turn_numbers**: Which turns mention this concept
- **context**: How it's being discussed (exploration/implementation/etc.)
- **quotes**: 1-2 representative quotes
- **confidence**: 0.0-1.0

Return JSON:
\`\`\`json
{
  "concepts": [
    {
      "label": "chunking",
      "alt_labels": ["batching", "segmentation"],
      "turn_numbers": [3, 5, 8],
      "context": "Used to prevent memory overflow when exporting large datasets",
      "quotes": [
        "we need to process in chunks to avoid freezing the browser"
      ],
      "confidence": 0.95
    }
  ]
}
\`\`\`

CONVERSATION CHUNK:
${formatChunkForPrompt(chunk)}

Extract all concepts:`;
  }
  function createToMPrompt(chunk) {
    return `Analyze the following conversation chunk using Theory of Mind reasoning.

Theory of Mind (ToM) is the ability to understand mental states - beliefs, desires, intentions, emotions.

For this conversation chunk, reconstruct:
1. **User's mental state evolution**: What were they thinking/feeling at key moments?
2. **Goals and motivations**: What is the user trying to achieve?
3. **Cognitive patterns**: How does the user approach problems?
4. **Emotional markers**: Frustration, excitement, uncertainty, confidence
5. **Perspective shifts**: Moments when understanding changed

Return JSON:
\`\`\`json
{
  "mental_states": [
    {
      "turn_number": 5,
      "state_type": "realization",
      "description": "User realized that input/output ratio is a key metric for conversation quality",
      "evidence": "I think the ones where i write more are more interesting",
      "confidence": 0.9
    }
  ],
  "user_goals": [
    {
      "goal": "Build a system to discover and organize insights from past conversations",
      "evidence_turns": [1, 3, 7],
      "confidence": 0.95
    }
  ],
  "cognitive_patterns": [
    {
      "pattern": "Iterative refinement - prefers building in phases",
      "evidence": "Let's do it in phases and be sure the first parts work",
      "confidence": 0.9
    }
  ]
}
\`\`\`

CONVERSATION CHUNK:
${formatChunkForPrompt(chunk)}

Perform ToM analysis:`;
  }
  function createDecisionTreePrompt(chunk) {
    return `Analyze this conversation chunk for DECISIONS and the reasoning behind them.

For each decision, extract:
- What was decided
- What options were considered
- The reasoning/tradeoffs
- Evidence (exact quotes)

Also identify:
- **Overruled decisions**: Decisions that were changed later
- **Decision chains**: How one decision led to another

Return JSON:
\`\`\`json
{
  "decisions": [
    {
      "turn_number": 20,
      "decision": "Use JSON as primary storage format",
      "options_considered": ["YAML", "CSV", "JSON"],
      "reasoning": "Better for temporal tracking with timestamps",
      "evidence": "maybe json is best and then we can export extract from it later",
      "confidence": 0.95,
      "supersedes": null
    }
  ],
  "decision_chains": [
    {
      "sequence": [
        {
          "decision": "Need cross-conversation insights",
          "leads_to": "Design storage format for insights"
        },
        {
          "decision": "Use JSON for storage",
          "leads_to": "Build ontology with temporal tracking"
        }
      ]
    }
  ]
}
\`\`\`

CONVERSATION CHUNK:
${formatChunkForPrompt(chunk)}

Extract decisions and chains:`;
  }
  function createAssumptionTrackingPrompt(chunk) {
    return `Analyze this conversation chunk for ASSUMPTIONS and whether they were challenged.

An assumption is a belief or premise stated without full verification.
Look for:
- Explicit assumptions ("I assume...", "probably...", "should be...")
- Implicit assumptions (unstated premises)
- Challenged assumptions (when evidence contradicts)

Return JSON:
\`\`\`json
{
  "assumptions": [
    {
      "turn_number": 3,
      "assumption": "Users have < 1000 conversations",
      "evidence": "we can load all conversations at once",
      "type": "explicit",
      "challenged": true,
      "challenged_at_turn": 5,
      "challenge_evidence": "my ALL is a lot and it sort of freezes",
      "outcome": "invalidated",
      "confidence": 0.9
    }
  ]
}
\`\`\`

CONVERSATION CHUNK:
${formatChunkForPrompt(chunk)}

Extract assumptions:`;
  }
  function createIdeaArchaeologyPrompt(chunk) {
    return `Analyze this conversation chunk for IDEA EVOLUTION.

Idea archaeology tracks how ideas develop, morph, and connect over time.

Look for:
- **Seed ideas**: Initial mentions of a concept
- **Refinements**: How ideas get more specific
- **Pivots**: When direction changes
- **Connections**: How ideas link together
- **Emergence**: New ideas arising from combinations

Return JSON:
\`\`\`json
{
  "idea_evolution": [
    {
      "concept": "conversation analysis",
      "stages": [
        {
          "turn_number": 3,
          "stage": "seed",
          "description": "Initial thought about analyzing conversations",
          "quote": "what would be interesting to extract"
        },
        {
          "turn_number": 8,
          "stage": "refinement",
          "description": "Specific focus on input/output ratio",
          "quote": "the ones where i write more are more interesting"
        },
        {
          "turn_number": 12,
          "stage": "implementation",
          "description": "Decision to build filtering system",
          "quote": "extract the preexport analysis and use those insights as filters"
        }
      ]
    }
  ]
}
\`\`\`

CONVERSATION CHUNK:
${formatChunkForPrompt(chunk)}

Extract idea evolution:`;
  }
  function createAutoTaggingPrompt(chunk) {
    return `Analyze this conversation chunk and generate semantic tags.

Tags should capture:
- **Topics**: What domains/subjects (e.g., "web development", "machine learning")
- **Activity type**: What's happening (e.g., "debugging", "brainstorming", "learning")
- **Complexity**: "beginner", "intermediate", "advanced"
- **Outcome**: "problem_solved", "question_answered", "exploration", "stuck"
- **Emotion**: "frustrated", "excited", "confused", "confident"
- **Collaboration style**: "directive", "exploratory", "iterative"

Return 5-10 tags.

Return JSON:
\`\`\`json
{
  "tags": [
    "conversation_analysis",
    "brainstorming",
    "advanced",
    "iterative",
    "excited"
  ],
  "primary_topic": "knowledge management",
  "activity_type": "design",
  "complexity": "advanced"
}
\`\`\`

CONVERSATION CHUNK:
${formatChunkForPrompt(chunk)}

Generate tags:`;
  }
  function formatChunkForPrompt(chunk) {
    let text2 = "";
    for (const turn of chunk.turns) {
      const speaker = turn.speaker.toUpperCase();
      text2 += `[Turn ${turn.turn_number}] ${speaker}: ${turn.content}

`;
    }
    return text2;
  }
  const HAIKU_4_5_PRICING = {
    input_per_million: 1,
    // $1 per million input tokens
    output_per_million: 5
    // $5 per million output tokens
  };
  function calculateCost(inputTokens, outputTokens) {
    const inputCost = inputTokens / 1e6 * HAIKU_4_5_PRICING.input_per_million;
    const outputCost = outputTokens / 1e6 * HAIKU_4_5_PRICING.output_per_million;
    return inputCost + outputCost;
  }
  class AnthropicClient {
    constructor(apiKey) {
      __publicField(this, "apiKey");
      __publicField(this, "baseUrl", "https://api.anthropic.com/v1");
      __publicField(this, "model", "claude-haiku-4-5-20250929");
      __publicField(this, "apiVersion", "2023-06-01");
      this.apiKey = apiKey;
    }
    /**
     * Make a request to Claude API
     */
    async makeRequest(userPrompt, options = {}) {
      const {
        systemPrompt = SYSTEM_PROMPT,
        maxTokens = 4096,
        temperature = 0
        // Low temperature for structured extraction
      } = options;
      const request = {
        model: this.model,
        max_tokens: maxTokens,
        temperature,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: userPrompt
          }
        ]
      };
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
          "anthropic-version": this.apiVersion,
          // Critical: Enable CORS for browser requests
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify(request)
      });
      if (!response.ok) {
        const error2 = await response.json();
        throw new Error(`Anthropic API error: ${error2.error.message}`);
      }
      return await response.json();
    }
    /**
     * Analyze with retry logic
     */
    async analyzeWithRetry(prompt, parseResponse, maxRetries = 3) {
      let lastError;
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const response = await this.makeRequest(prompt);
          const text2 = response.content.filter((c2) => c2.type === "text").map((c2) => c2.text).join("\n");
          let data;
          try {
            data = parseResponse(text2);
          } catch (parseError) {
            lastError = `Failed to parse response: ${parseError}`;
            if (attempt < maxRetries - 1) continue;
            throw parseError;
          }
          const cost = calculateCost(response.usage.input_tokens, response.usage.output_tokens);
          return {
            success: true,
            data,
            raw_response: text2,
            usage: {
              input_tokens: response.usage.input_tokens,
              output_tokens: response.usage.output_tokens,
              cost_usd: cost
            }
          };
        } catch (error2) {
          lastError = error2 instanceof Error ? error2.message : String(error2);
          if (attempt < maxRetries - 1) {
            await new Promise((resolve) => setTimeout(resolve, 1e3 * 2 ** attempt));
            continue;
          }
        }
      }
      return {
        success: false,
        error: lastError || "Unknown error"
      };
    }
    /**
     * Extract structured JSON from response
     */
    async extractJSON(prompt) {
      return this.analyzeWithRetry(prompt, (text2) => {
        const jsonMatch = text2.match(/```json\n?([\s\S]*?)\n?```/) || text2.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error("No JSON found in response");
        }
        const jsonText = jsonMatch[1] || jsonMatch[0];
        return JSON.parse(jsonText);
      });
    }
    /**
     * Extract plain text response
     */
    async extractText(prompt) {
      return this.analyzeWithRetry(prompt, (text2) => {
        const cleaned = text2.replace(/```[\s\S]*?```/g, "").trim();
        return cleaned;
      });
    }
  }
  function estimateAnalysisCost(estimatedInputTokens, analysisTypes = 1, tokensPerResponse = 1e3) {
    const totalInput = estimatedInputTokens * analysisTypes;
    const totalOutput = tokensPerResponse * analysisTypes;
    return calculateCost(totalInput, totalOutput);
  }
  const DEFAULT_CONFIG = {
    turns_per_chunk: 10,
    overlap_turns: 2,
    max_tokens: 8e3
    // Conservative limit for Haiku input
  };
  function extractMessageText(message) {
    if (!message || !message.content) return "";
    const content2 = message.content;
    if (typeof content2 === "string") {
      return content2;
    }
    if (Array.isArray(content2)) {
      return content2.filter((part) => (part == null ? void 0 : part.content_type) === "text").map((part) => {
        var _a;
        return ((_a = part == null ? void 0 : part.parts) == null ? void 0 : _a.join("")) || "";
      }).join("\n");
    }
    if (content2.parts) {
      return Array.isArray(content2.parts) ? content2.parts.join("") : String(content2.parts);
    }
    return String(content2);
  }
  function estimateTokens(text2) {
    return Math.ceil(text2.length / 4);
  }
  function parseConversationTurns(conversation, mapping) {
    var _a;
    const turns = [];
    const currentNodeId = conversation.current_node;
    if (!currentNodeId) return turns;
    const path2 = [];
    let nodeId = currentNodeId;
    while (nodeId) {
      path2.unshift(nodeId);
      const node2 = mapping[nodeId];
      nodeId = (node2 == null ? void 0 : node2.parent) || null;
    }
    let turnNumber = 0;
    for (const id of path2) {
      const node2 = mapping[id];
      if (!node2 || !node2.message) continue;
      const message = node2.message;
      const content2 = extractMessageText(message);
      if (!content2.trim()) continue;
      const role = (_a = message.author) == null ? void 0 : _a.role;
      if (role !== "user" && role !== "assistant") continue;
      turns.push({
        turn_number: turnNumber,
        timestamp: message.create_time ? new Date(message.create_time * 1e3).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
        speaker: role,
        content: content2,
        message_node: node2
      });
      turnNumber++;
    }
    return turns;
  }
  function chunkConversation(conversationId, conversationTitle, turns, config = {}) {
    const cfg = { ...DEFAULT_CONFIG, ...config };
    const chunks = [];
    if (turns.length === 0) {
      return chunks;
    }
    const totalTurns = turns.length;
    let chunkIndex = 0;
    let startIdx = 0;
    while (startIdx < totalTurns) {
      const endIdx = Math.min(startIdx + cfg.turns_per_chunk, totalTurns);
      const chunkTurns = turns.slice(startIdx, endIdx);
      const text2 = chunkTurns.map((t2) => t2.content).join("\n");
      const estimatedTokens = estimateTokens(text2);
      chunks.push({
        conversation_id: conversationId,
        conversation_title: conversationTitle,
        chunk_index: chunkIndex,
        total_chunks: 0,
        // Will be set after we know total
        turn_range: [chunkTurns[0].turn_number, chunkTurns[chunkTurns.length - 1].turn_number],
        turns: chunkTurns,
        has_overlap: startIdx > 0,
        estimated_tokens: estimatedTokens
      });
      startIdx += cfg.turns_per_chunk - cfg.overlap_turns;
      chunkIndex++;
      if (startIdx === startIdx + cfg.turns_per_chunk - cfg.overlap_turns) {
        break;
      }
    }
    const totalChunks = chunks.length;
    chunks.forEach((chunk) => {
      chunk.total_chunks = totalChunks;
    });
    return chunks;
  }
  class EventExtractor {
    constructor(client) {
      __publicField(this, "client");
      this.client = client;
    }
    /**
     * Analyze a single chunk - extract all insights
     */
    async analyzeChunk(chunk) {
      var _a, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n2, _o, _p, _q, _r, _s, _t, _u;
      const results = {};
      let totalTokensUsed = 0;
      let totalCost = 0;
      const eventsResult = await this.client.extractJSON(
        createEventExtractionPrompt(chunk)
      );
      if (eventsResult.success && eventsResult.data) {
        results.events = eventsResult.data.events;
        totalTokensUsed += (((_a = eventsResult.usage) == null ? void 0 : _a.input_tokens) || 0) + (((_b = eventsResult.usage) == null ? void 0 : _b.output_tokens) || 0);
        totalCost += ((_c = eventsResult.usage) == null ? void 0 : _c.cost_usd) || 0;
      }
      const conceptsResult = await this.client.extractJSON(
        createConceptExtractionPrompt(chunk)
      );
      if (conceptsResult.success && conceptsResult.data) {
        results.concepts = conceptsResult.data.concepts;
        totalTokensUsed += (((_d = conceptsResult.usage) == null ? void 0 : _d.input_tokens) || 0) + (((_e2 = conceptsResult.usage) == null ? void 0 : _e2.output_tokens) || 0);
        totalCost += ((_f = conceptsResult.usage) == null ? void 0 : _f.cost_usd) || 0;
      }
      const decisionsResult = await this.client.extractJSON(
        createDecisionTreePrompt(chunk)
      );
      if (decisionsResult.success && decisionsResult.data) {
        results.decisions = decisionsResult.data.decisions;
        totalTokensUsed += (((_g = decisionsResult.usage) == null ? void 0 : _g.input_tokens) || 0) + (((_h = decisionsResult.usage) == null ? void 0 : _h.output_tokens) || 0);
        totalCost += ((_i = decisionsResult.usage) == null ? void 0 : _i.cost_usd) || 0;
      }
      const assumptionsResult = await this.client.extractJSON(
        createAssumptionTrackingPrompt(chunk)
      );
      if (assumptionsResult.success && assumptionsResult.data) {
        results.assumptions = assumptionsResult.data.assumptions;
        totalTokensUsed += (((_j = assumptionsResult.usage) == null ? void 0 : _j.input_tokens) || 0) + (((_k = assumptionsResult.usage) == null ? void 0 : _k.output_tokens) || 0);
        totalCost += ((_l = assumptionsResult.usage) == null ? void 0 : _l.cost_usd) || 0;
      }
      const tomResult = await this.client.extractJSON(
        createToMPrompt(chunk)
      );
      if (tomResult.success && tomResult.data) {
        results.mental_states = tomResult.data.mental_states;
        totalTokensUsed += (((_m = tomResult.usage) == null ? void 0 : _m.input_tokens) || 0) + (((_n2 = tomResult.usage) == null ? void 0 : _n2.output_tokens) || 0);
        totalCost += ((_o = tomResult.usage) == null ? void 0 : _o.cost_usd) || 0;
      }
      const ideaEvolutionResult = await this.client.extractJSON(
        createIdeaArchaeologyPrompt(chunk)
      );
      if (ideaEvolutionResult.success && ideaEvolutionResult.data) {
        results.idea_evolution = ideaEvolutionResult.data.idea_evolution;
        totalTokensUsed += (((_p = ideaEvolutionResult.usage) == null ? void 0 : _p.input_tokens) || 0) + (((_q = ideaEvolutionResult.usage) == null ? void 0 : _q.output_tokens) || 0);
        totalCost += ((_r = ideaEvolutionResult.usage) == null ? void 0 : _r.cost_usd) || 0;
      }
      const tagsResult = await this.client.extractJSON(
        createAutoTaggingPrompt(chunk)
      );
      if (tagsResult.success && tagsResult.data) {
        results.tags = tagsResult.data;
        totalTokensUsed += (((_s = tagsResult.usage) == null ? void 0 : _s.input_tokens) || 0) + (((_t = tagsResult.usage) == null ? void 0 : _t.output_tokens) || 0);
        totalCost += ((_u = tagsResult.usage) == null ? void 0 : _u.cost_usd) || 0;
      }
      const events = (results.events || []).map((e2, idx) => {
        var _a2, _b2;
        const evidence = [
          {
            quote: e2.quote,
            speaker: e2.speaker,
            turn_number: e2.turn_number,
            turn_timestamp: ((_a2 = chunk.turns[e2.turn_number]) == null ? void 0 : _a2.timestamp) || (/* @__PURE__ */ new Date()).toISOString(),
            conversation_id: chunk.conversation_id
          }
        ];
        return {
          id: `evt_${chunk.conversation_id}_${chunk.chunk_index}_${idx}`,
          type: "event",
          subtype: e2.type,
          conversation_id: chunk.conversation_id,
          conversation_title: chunk.conversation_title,
          turn_number: e2.turn_number,
          turn_timestamp: ((_b2 = chunk.turns[e2.turn_number]) == null ? void 0 : _b2.timestamp) || (/* @__PURE__ */ new Date()).toISOString(),
          content: e2.content,
          evidence,
          related_entities: [],
          created_at: (/* @__PURE__ */ new Date()).toISOString(),
          tags: e2.tags,
          confidence: e2.confidence
        };
      });
      const chunkResult = {
        conversation_id: chunk.conversation_id,
        chunk_index: chunk.chunk_index,
        turn_range: chunk.turn_range,
        events,
        concept_mentions: (results.concepts || []).map((c2) => ({
          concept_label: c2.label,
          turn_number: c2.turn_numbers[0] || 0,
          context: c2.context
        })),
        metadata: {
          analyzed_at: (/* @__PURE__ */ new Date()).toISOString(),
          model: "claude-haiku-4-5",
          tokens_used: totalTokensUsed,
          cost_usd: totalCost
        }
      };
      return chunkResult;
    }
    /**
     * Analyze a full conversation (all chunks)
     */
    async analyzeConversation(conversationId, conversationTitle, chunks, onProgress) {
      const chunkResults = [];
      for (let i2 = 0; i2 < chunks.length; i2++) {
        if (onProgress) {
          onProgress(i2, chunks.length);
        }
        const result2 = await this.analyzeChunk(chunks[i2]);
        chunkResults.push(result2);
      }
      const allEvents = chunkResults.flatMap((r2) => r2.events);
      const eventTypeCounts = {};
      for (const event of allEvents) {
        eventTypeCounts[event.subtype] = (eventTypeCounts[event.subtype] || 0) + 1;
      }
      const conceptsSet = /* @__PURE__ */ new Set();
      for (const chunk of chunkResults) {
        for (const mention of chunk.concept_mentions) {
          conceptsSet.add(mention.concept_label);
        }
      }
      const totalCost = chunkResults.reduce((sum, r2) => sum + r2.metadata.cost_usd, 0);
      const result = {
        conversation_id: conversationId,
        conversation_title: conversationTitle,
        chunks: chunkResults,
        summary: {
          total_events: allEvents.length,
          event_types: eventTypeCounts,
          concepts_mentioned: conceptsSet.size,
          questions_asked: allEvents.filter((e2) => e2.subtype === "question_asked").length,
          decisions_made: allEvents.filter((e2) => e2.subtype === "decision_made").length
        },
        total_cost_usd: totalCost
      };
      return result;
    }
  }
  const STORAGE_KEY = "chatgpt_insights_kb";
  const STORAGE_VERSION = "1.0.0";
  class KnowledgeBaseManager {
    constructor() {
      __publicField(this, "kb");
      this.kb = this.loadFromStorage() || this.createEmpty();
    }
    /**
     * Create an empty knowledge base
     */
    createEmpty() {
      return {
        meta: {
          version: STORAGE_VERSION,
          namespace: "chatgpt-insights",
          last_updated: (/* @__PURE__ */ new Date()).toISOString(),
          conversations_analyzed: 0,
          total_entities: 0,
          total_events: 0
        },
        entities: {},
        relationships: [],
        temporal_chains: [],
        indexes: {
          by_type: {},
          by_conversation: {},
          by_date: {},
          by_tag: {},
          by_concept: {}
        }
      };
    }
    /**
     * Load from localStorage
     */
    loadFromStorage() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return null;
        const kb = JSON.parse(stored);
        if (kb.meta.version !== STORAGE_VERSION) {
          console.warn("Knowledge base version mismatch, creating new");
          return null;
        }
        return kb;
      } catch (error2) {
        console.error("Failed to load knowledge base:", error2);
        return null;
      }
    }
    /**
     * Save to localStorage
     */
    save() {
      try {
        this.kb.meta.last_updated = (/* @__PURE__ */ new Date()).toISOString();
        const json = JSON.stringify(this.kb);
        localStorage.setItem(STORAGE_KEY, json);
      } catch (error2) {
        console.error("Failed to save knowledge base:", error2);
        throw error2;
      }
    }
    /**
     * Get the entire knowledge base
     */
    getKnowledgeBase() {
      return this.kb;
    }
    /**
     * Add events from a conversation analysis
     */
    addConversationAnalysis(analysis) {
      const events = [];
      for (const chunk of analysis.chunks) {
        events.push(...chunk.events);
      }
      for (const event of events) {
        this.addEntity(event);
      }
      this.kb.meta.conversations_analyzed++;
      this.buildConceptsFromEvents(events);
      this.save();
    }
    /**
     * Add an entity to the knowledge base
     */
    addEntity(entity) {
      this.kb.entities[entity.id] = entity;
      this.updateIndexes(entity);
      this.kb.meta.total_entities = Object.keys(this.kb.entities).length;
      if (entity.type === "event") {
        this.kb.meta.total_events++;
      }
    }
    /**
     * Update indexes for an entity
     */
    updateIndexes(entity) {
      if (!this.kb.indexes.by_type[entity.type]) {
        this.kb.indexes.by_type[entity.type] = [];
      }
      if (!this.kb.indexes.by_type[entity.type].includes(entity.id)) {
        this.kb.indexes.by_type[entity.type].push(entity.id);
      }
      if (entity.type === "event") {
        const event = entity;
        if (!this.kb.indexes.by_conversation[event.conversation_id]) {
          this.kb.indexes.by_conversation[event.conversation_id] = [];
        }
        if (!this.kb.indexes.by_conversation[event.conversation_id].includes(entity.id)) {
          this.kb.indexes.by_conversation[event.conversation_id].push(entity.id);
        }
        const date = event.turn_timestamp.split("T")[0];
        if (!this.kb.indexes.by_date[date]) {
          this.kb.indexes.by_date[date] = [];
        }
        if (!this.kb.indexes.by_date[date].includes(entity.id)) {
          this.kb.indexes.by_date[date].push(entity.id);
        }
      }
      for (const tag of entity.tags) {
        if (!this.kb.indexes.by_tag[tag]) {
          this.kb.indexes.by_tag[tag] = [];
        }
        if (!this.kb.indexes.by_tag[tag].includes(entity.id)) {
          this.kb.indexes.by_tag[tag].push(entity.id);
        }
      }
    }
    /**
     * Build concept entities from event mentions
     */
    buildConceptsFromEvents(_events) {
    }
    /**
     * Add a relationship
     */
    addRelationship(relationship) {
      this.kb.relationships.push(relationship);
      this.save();
    }
    /**
     * Add a temporal chain
     */
    addTemporalChain(chain) {
      this.kb.temporal_chains.push(chain);
      this.save();
    }
    /**
     * Query entities by type
     */
    getEntitiesByType(type) {
      const ids = this.kb.indexes.by_type[type] || [];
      return ids.map((id) => this.kb.entities[id]);
    }
    /**
     * Query entities by conversation
     */
    getEntitiesByConversation(conversationId) {
      const ids = this.kb.indexes.by_conversation[conversationId] || [];
      return ids.map((id) => this.kb.entities[id]);
    }
    /**
     * Query entities by date range
     */
    getEntitiesByDateRange(startDate, endDate) {
      const ids = [];
      const dates = Object.keys(this.kb.indexes.by_date).filter(
        (date) => date >= startDate && date <= endDate
      );
      for (const date of dates) {
        ids.push(...this.kb.indexes.by_date[date]);
      }
      const uniqueIds = Array.from(new Set(ids));
      return uniqueIds.map((id) => this.kb.entities[id]);
    }
    /**
     * Query entities by tag
     */
    getEntitiesByTag(tag) {
      const ids = this.kb.indexes.by_tag[tag] || [];
      return ids.map((id) => this.kb.entities[id]);
    }
    /**
     * Get all concepts
     */
    getConcepts() {
      return this.getEntitiesByType("concept");
    }
    /**
     * Get all events
     */
    getEvents() {
      return this.getEntitiesByType("event");
    }
    /**
     * Get statistics
     */
    getStats() {
      const events = this.getEvents();
      const eventTypes = {};
      for (const event of events) {
        eventTypes[event.subtype] = (eventTypes[event.subtype] || 0) + 1;
      }
      return {
        total_entities: this.kb.meta.total_entities,
        total_events: this.kb.meta.total_events,
        conversations_analyzed: this.kb.meta.conversations_analyzed,
        event_types: eventTypes,
        concepts: this.getConcepts().length,
        relationships: this.kb.relationships.length,
        temporal_chains: this.kb.temporal_chains.length
      };
    }
    /**
     * Export knowledge base as JSON
     */
    exportJSON() {
      return JSON.stringify(this.kb, null, 2);
    }
    /**
     * Export as downloadable file
     */
    exportToFile() {
      const json = this.exportJSON();
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a2 = document.createElement("a");
      a2.href = url;
      a2.download = `chatgpt-insights-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
      document.body.appendChild(a2);
      a2.click();
      document.body.removeChild(a2);
      URL.revokeObjectURL(url);
    }
    /**
     * Import from JSON
     */
    importJSON(json) {
      try {
        const imported = JSON.parse(json);
        if (!imported.meta || !imported.entities) {
          throw new Error("Invalid knowledge base format");
        }
        this.kb = imported;
        this.save();
      } catch (error2) {
        console.error("Failed to import knowledge base:", error2);
        throw error2;
      }
    }
    /**
     * Clear all data
     */
    clear() {
      this.kb = this.createEmpty();
      this.save();
    }
    /**
     * Get storage size (approximate)
     */
    getStorageSize() {
      const json = this.exportJSON();
      return new Blob([json]).size;
    }
  }
  let instance = null;
  function getKnowledgeBaseManager() {
    if (!instance) {
      instance = new KnowledgeBaseManager();
    }
    return instance;
  }
  function useGMStorage(key2, initialValue) {
    const [storedValue, setStoredValue] = d$3(() => ScriptStorage.get(key2) ?? initialValue);
    const setValue = (value) => {
      setStoredValue(value);
      ScriptStorage.set(key2, value);
    };
    return [storedValue, setValue];
  }
  const defaultFormat = "ChatGPT-{title}";
  const defaultExportAllLimit = 1e3;
  const defaultExportChunkSize = 100;
  const defaultExportMetaList = [
    { name: "title", value: "{title}" },
    { name: "source", value: "{source}" }
  ];
  const SettingContext = Q$1({
    format: defaultFormat,
    setFormat: (_24) => {
    },
    enableTimestamp: false,
    setEnableTimestamp: (_24) => {
    },
    timeStamp24H: false,
    setTimeStamp24H: (_24) => {
    },
    enableTimestampHTML: false,
    setEnableTimestampHTML: (_24) => {
    },
    enableTimestampMarkdown: false,
    setEnableTimestampMarkdown: (_24) => {
    },
    enableMeta: false,
    setEnableMeta: (_24) => {
    },
    exportMetaList: defaultExportMetaList,
    setExportMetaList: (_24) => {
    },
    exportAllLimit: defaultExportAllLimit,
    setExportAllLimit: (_24) => {
    },
    exportChunkSize: defaultExportChunkSize,
    setExportChunkSize: (_24) => {
    },
    anthropicApiKey: "",
    setAnthropicApiKey: (_24) => {
    },
    resetDefault: () => {
    }
  });
  const SettingProvider = ({ children }) => {
    const [format, setFormat] = useGMStorage(KEY_FILENAME_FORMAT, defaultFormat);
    const [enableTimestamp, setEnableTimestamp] = useGMStorage(KEY_TIMESTAMP_ENABLED, false);
    const [timeStamp24H, setTimeStamp24H] = useGMStorage(KEY_TIMESTAMP_24H, false);
    const [enableTimestampHTML, setEnableTimestampHTML] = useGMStorage(KEY_TIMESTAMP_HTML, false);
    const [enableTimestampMarkdown, setEnableTimestampMarkdown] = useGMStorage(KEY_TIMESTAMP_MARKDOWN, false);
    const [enableMeta, setEnableMeta] = useGMStorage(KEY_META_ENABLED, false);
    const [exportMetaList, setExportMetaList] = useGMStorage(KEY_META_LIST, defaultExportMetaList);
    const [exportAllLimit, setExportAllLimit] = useGMStorage(KEY_EXPORT_ALL_LIMIT, defaultExportAllLimit);
    const [exportChunkSize, setExportChunkSize] = useGMStorage(KEY_EXPORT_CHUNK_SIZE, defaultExportChunkSize);
    const [anthropicApiKey, setAnthropicApiKey] = useGMStorage(KEY_ANTHROPIC_API_KEY, "");
    const resetDefault = q$1(() => {
      setFormat(defaultFormat);
      setEnableTimestamp(false);
      setEnableMeta(false);
      setExportMetaList(defaultExportMetaList);
      setExportAllLimit(defaultExportAllLimit);
      setExportChunkSize(defaultExportChunkSize);
    }, [
      setFormat,
      setEnableTimestamp,
      setEnableMeta,
      setExportMetaList,
      setExportAllLimit,
      setExportChunkSize
    ]);
    return /* @__PURE__ */ u$5(
      SettingContext.Provider,
      {
        value: {
          format,
          setFormat,
          enableTimestamp,
          setEnableTimestamp,
          timeStamp24H,
          setTimeStamp24H,
          enableTimestampHTML,
          setEnableTimestampHTML,
          enableTimestampMarkdown,
          setEnableTimestampMarkdown,
          enableMeta,
          setEnableMeta,
          exportMetaList,
          setExportMetaList,
          exportAllLimit,
          setExportAllLimit,
          exportChunkSize,
          setExportChunkSize,
          anthropicApiKey,
          setAnthropicApiKey,
          resetDefault
        },
        children
      }
    );
  };
  const useSettingContext = () => x$2(SettingContext);
  const AnalysisPanel = ({
    selectedConversations
  }) => {
    const { anthropicApiKey } = useSettingContext();
    const [expanded, setExpanded] = d$3(false);
    const [analyzing, setAnalyzing] = d$3(false);
    const [progress, setProgress] = d$3({ current: 0, total: 0 });
    const [estimatedCost, setEstimatedCost] = d$3(0);
    const [lastAnalysis, setLastAnalysis] = d$3(null);
    const [error2, setError] = d$3(null);
    const kb = getKnowledgeBaseManager();
    const stats = kb.getStats();
    const hasApiKey = anthropicApiKey && anthropicApiKey.trim().length > 0;
    const handleAnalyze = async () => {
      if (!hasApiKey) {
        alert("Please add your Anthropic API key in Settings first.");
        return;
      }
      if (selectedConversations.length === 0) {
        alert("Please select conversations to analyze.");
        return;
      }
      try {
        setError(null);
        setAnalyzing(true);
        setProgress({ current: 0, total: selectedConversations.length });
        const client = new AnthropicClient(anthropicApiKey);
        const extractor = new EventExtractor(client);
        let totalCost = 0;
        for (let i2 = 0; i2 < selectedConversations.length; i2++) {
          const conv = selectedConversations[i2];
          setProgress({ current: i2 + 1, total: selectedConversations.length });
          try {
            const fullConv = await fetchConversation(conv.id);
            const turns = parseConversationTurns(fullConv, fullConv.mapping);
            const chunks = chunkConversation(conv.id, conv.title, turns);
            if (chunks.length === 0) {
              continue;
            }
            const result = await extractor.analyzeConversation(
              conv.id,
              conv.title,
              chunks
            );
            kb.addConversationAnalysis(result);
            totalCost += result.total_cost_usd;
          } catch (convError) {
          }
        }
        setLastAnalysis({
          count: selectedConversations.length,
          cost: totalCost,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
        alert(
          `Analysis complete!

Analyzed: ${selectedConversations.length} conversations
Total cost: $${totalCost.toFixed(4)}
Total insights: ${kb.getStats().total_events}

Results saved to knowledge base.`
        );
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        setError(errorMsg);
        alert(`Analysis failed: ${errorMsg}`);
      } finally {
        setAnalyzing(false);
        setProgress({ current: 0, total: 0 });
      }
    };
    const updateCostEstimate = q$1(() => {
      if (selectedConversations.length === 0) {
        setEstimatedCost(0);
        return;
      }
      const avgTurns = 10;
      const avgCharsPerTurn = 500;
      const avgTokens = avgTurns * avgCharsPerTurn / 4;
      const cost = estimateAnalysisCost(avgTokens, 8) * selectedConversations.length;
      setEstimatedCost(cost);
    }, [selectedConversations.length]);
    y$1(() => {
      updateCostEstimate();
    }, [updateCostEstimate]);
    const handleExportKB = () => {
      kb.exportToFile();
    };
    const handleClearKB = () => {
      if (confirm("Are you sure you want to clear all analysis data? This cannot be undone.")) {
        kb.clear();
        alert("Knowledge base cleared.");
      }
    };
    return /* @__PURE__ */ u$5("div", { className: "mb-4 border rounded-lg p-3 bg-white dark:bg-white/5", children: [
      /* @__PURE__ */ u$5(
        "button",
        {
          className: "w-full flex items-center justify-between text-left",
          onClick: () => setExpanded(!expanded),
          children: [
            /* @__PURE__ */ u$5("span", { className: "font-medium text-gray-800 dark:text-white", children: [
              "🧠 AI Analysis",
              " ",
              stats.total_events > 0 && /* @__PURE__ */ u$5("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: [
                "(",
                stats.total_events,
                " insights extracted)"
              ] })
            ] }),
            /* @__PURE__ */ u$5("span", { className: "text-gray-500 dark:text-gray-400", children: expanded ? "▼" : "▶" })
          ]
        }
      ),
      expanded && /* @__PURE__ */ u$5("div", { className: "mt-4 space-y-4", children: [
        /* @__PURE__ */ u$5("div", { className: "text-sm", children: hasApiKey ? /* @__PURE__ */ u$5("span", { className: "text-green-600 dark:text-green-400", children: "✓ API key configured" }) : /* @__PURE__ */ u$5("span", { className: "text-red-600 dark:text-red-400", children: "⚠ No API key - add one in Settings" }) }),
        stats.total_events > 0 && /* @__PURE__ */ u$5("div", { className: "text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded", children: [
          /* @__PURE__ */ u$5("div", { className: "font-medium mb-2", children: "Knowledge Base Stats:" }),
          /* @__PURE__ */ u$5("div", { className: "grid grid-cols-2 gap-2 text-xs", children: [
            /* @__PURE__ */ u$5("div", { children: [
              "Total insights: ",
              stats.total_events
            ] }),
            /* @__PURE__ */ u$5("div", { children: [
              "Conversations: ",
              stats.conversations_analyzed
            ] }),
            /* @__PURE__ */ u$5("div", { children: [
              "Concepts: ",
              stats.concepts
            ] }),
            /* @__PURE__ */ u$5("div", { children: [
              "Relationships: ",
              stats.relationships
            ] })
          ] }),
          Object.keys(stats.event_types).length > 0 && /* @__PURE__ */ u$5("div", { className: "mt-2 text-xs", children: [
            /* @__PURE__ */ u$5("div", { className: "font-medium", children: "Event types:" }),
            Object.entries(stats.event_types).map(([type, count2]) => /* @__PURE__ */ u$5("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ u$5("span", { children: [
                type.replace(/_/g, " "),
                ":"
              ] }),
              /* @__PURE__ */ u$5("span", { children: count2 })
            ] }, type))
          ] })
        ] }),
        error2 && /* @__PURE__ */ u$5("div", { className: "text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded text-red-600 dark:text-red-400", children: [
          /* @__PURE__ */ u$5("strong", { children: "Error:" }),
          " ",
          error2
        ] }),
        selectedConversations.length > 0 && estimatedCost > 0 && /* @__PURE__ */ u$5("div", { className: "text-xs bg-blue-50 dark:bg-blue-900/20 p-2 rounded", children: [
          /* @__PURE__ */ u$5("strong", { children: "Estimated cost:" }),
          " $",
          estimatedCost.toFixed(4),
          " for ",
          selectedConversations.length,
          " conversation",
          selectedConversations.length > 1 ? "s" : "",
          /* @__PURE__ */ u$5("div", { className: "text-gray-600 dark:text-gray-400 mt-1", children: "(Actual cost may vary based on conversation length)" })
        ] }),
        /* @__PURE__ */ u$5("div", { className: "space-y-2", children: [
          /* @__PURE__ */ u$5(
            "button",
            {
              className: "w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed",
              onClick: handleAnalyze,
              disabled: !hasApiKey || analyzing || selectedConversations.length === 0,
              children: analyzing ? `Analyzing... ${progress.current}/${progress.total}` : `Analyze Selected (${selectedConversations.length})`
            }
          ),
          stats.total_events > 0 && /* @__PURE__ */ u$5("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ u$5(
              "button",
              {
                className: "flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded text-sm",
                onClick: handleExportKB,
                children: "📥 Export Knowledge Base"
              }
            ),
            /* @__PURE__ */ u$5(
              "button",
              {
                className: "flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded text-sm",
                onClick: handleClearKB,
                children: "🗑 Clear All"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ u$5("div", { className: "text-xs text-gray-600 dark:text-gray-400 space-y-1", children: [
          /* @__PURE__ */ u$5("div", { children: [
            /* @__PURE__ */ u$5("strong", { children: "What gets analyzed:" }),
            " ",
            "Aha moments, questions, decisions, assumptions, Theory of Mind, concept evolution, auto-tags"
          ] }),
          /* @__PURE__ */ u$5("div", { children: [
            /* @__PURE__ */ u$5("strong", { children: "Model:" }),
            " Claude Haiku 4.5 ($1/$5 per million tokens)"
          ] }),
          /* @__PURE__ */ u$5("div", { children: [
            /* @__PURE__ */ u$5("strong", { children: "Storage:" }),
            " Results saved locally in your browser"
          ] })
        ] }),
        lastAnalysis && /* @__PURE__ */ u$5("div", { className: "text-xs bg-green-50 dark:bg-green-900/20 p-2 rounded", children: [
          "Last analysis: ",
          lastAnalysis.count,
          " conversations for $",
          lastAnalysis.cost.toFixed(4),
          " ",
          "(",
          new Date(lastAnalysis.timestamp).toLocaleString(),
          ")"
        ] })
      ] })
    ] });
  };
  function FileCode() {
    return /* @__PURE__ */ u$5("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 384 512", className: "w-4 h-4", fill: "currentColor", children: /* @__PURE__ */ u$5("path", { d: "M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM153 289l-31 31 31 31c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L71 337c-9.4-9.4-9.4-24.6 0-33.9l48-48c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9zM265 255l48 48c9.4 9.4 9.4 24.6 0 33.9l-48 48c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l31-31-31-31c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0z" }) });
  }
  function IconCamera() {
    return /* @__PURE__ */ u$5("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512", className: "w-4 h-4", fill: "currentColor", children: /* @__PURE__ */ u$5("path", { d: "M149.1 64.8L138.7 96H64C28.7 96 0 124.7 0 160V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H373.3L362.9 64.8C356.4 45.2 338.1 32 317.4 32H194.6c-20.7 0-39 13.2-45.5 32.8zM256 384c-53 0-96-43-96-96s43-96 96-96s96 43 96 96s-43 96-96 96z" }) });
  }
  function IconMarkdown() {
    return /* @__PURE__ */ u$5("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 640 512", className: "w-4 h-4", fill: "currentColor", children: /* @__PURE__ */ u$5("path", { d: "M593.8 59.1H46.2C20.7 59.1 0 79.8 0 105.2v301.5c0 25.5 20.7 46.2 46.2 46.2h547.7c25.5 0 46.2-20.7 46.1-46.1V105.2c0-25.4-20.7-46.1-46.2-46.1zM338.5 360.6H277v-120l-61.5 76.9-61.5-76.9v120H92.3V151.4h61.5l61.5 76.9 61.5-76.9h61.5v209.2zm135.3 3.1L381.5 256H443V151.4h61.5V256H566z" }) });
  }
  function IconCopy() {
    return /* @__PURE__ */ u$5("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512", className: "w-4 h-4", fill: "currentColor", children: /* @__PURE__ */ u$5("path", { d: "M502.6 70.63l-61.25-61.25C435.4 3.371 427.2 0 418.7 0H255.1c-35.35 0-64 28.66-64 64l.0195 256C192 355.4 220.7 384 256 384h192c35.2 0 64-28.8 64-64V93.25C512 84.77 508.6 76.63 502.6 70.63zM464 320c0 8.836-7.164 16-16 16H255.1c-8.838 0-16-7.164-16-16L239.1 64.13c0-8.836 7.164-16 16-16h128L384 96c0 17.67 14.33 32 32 32h47.1V320zM272 448c0 8.836-7.164 16-16 16H63.1c-8.838 0-16-7.164-16-16L47.98 192.1c0-8.836 7.164-16 16-16H160V128H63.99c-35.35 0-64 28.65-64 64l.0098 256C.002 483.3 28.66 512 64 512h192c35.2 0 64-28.8 64-64v-32h-47.1L272 448z" }) });
  }
  function IconArrowRightFromBracket() {
    return /* @__PURE__ */ u$5("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 576 512", className: "w-4 h-4", fill: "currentColor", children: /* @__PURE__ */ u$5("path", { d: "M534.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L434.7 224 224 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM192 96c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-53 0-96 43-96 96l0 256c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z" }) });
  }
  function IconSetting() {
    return /* @__PURE__ */ u$5("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 15 15", className: "w-4 h-4", stroke: "currentColor", "stroke-width": "0.5", children: /* @__PURE__ */ u$5("path", { d: "M7.07095 0.650238C6.67391 0.650238 6.32977 0.925096 6.24198 1.31231L6.0039 2.36247C5.6249 2.47269 5.26335 2.62363 4.92436 2.81013L4.01335 2.23585C3.67748 2.02413 3.23978 2.07312 2.95903 2.35386L2.35294 2.95996C2.0722 3.2407 2.0232 3.6784 2.23493 4.01427L2.80942 4.92561C2.62307 5.2645 2.47227 5.62594 2.36216 6.00481L1.31209 6.24287C0.924883 6.33065 0.650024 6.6748 0.650024 7.07183V7.92897C0.650024 8.32601 0.924883 8.67015 1.31209 8.75794L2.36228 8.99603C2.47246 9.375 2.62335 9.73652 2.80979 10.0755L2.2354 10.9867C2.02367 11.3225 2.07267 11.7602 2.35341 12.041L2.95951 12.6471C3.24025 12.9278 3.67795 12.9768 4.01382 12.7651L4.92506 12.1907C5.26384 12.377 5.62516 12.5278 6.0039 12.6379L6.24198 13.6881C6.32977 14.0753 6.67391 14.3502 7.07095 14.3502H7.92809C8.32512 14.3502 8.66927 14.0753 8.75705 13.6881L8.99505 12.6383C9.37411 12.5282 9.73573 12.3773 10.0748 12.1909L10.986 12.7653C11.3218 12.977 11.7595 12.928 12.0403 12.6473L12.6464 12.0412C12.9271 11.7604 12.9761 11.3227 12.7644 10.9869L12.1902 10.076C12.3768 9.73688 12.5278 9.37515 12.638 8.99596L13.6879 8.75794C14.0751 8.67015 14.35 8.32601 14.35 7.92897V7.07183C14.35 6.6748 14.0751 6.33065 13.6879 6.24287L12.6381 6.00488C12.528 5.62578 12.3771 5.26414 12.1906 4.92507L12.7648 4.01407C12.9766 3.6782 12.9276 3.2405 12.6468 2.95975L12.0407 2.35366C11.76 2.07292 11.3223 2.02392 10.9864 2.23565L10.0755 2.80989C9.73622 2.62328 9.37437 2.47229 8.99505 2.36209L8.75705 1.31231C8.66927 0.925096 8.32512 0.650238 7.92809 0.650238H7.07095ZM4.92053 3.81251C5.44724 3.44339 6.05665 3.18424 6.71543 3.06839L7.07095 1.50024H7.92809L8.28355 3.06816C8.94267 3.18387 9.5524 3.44302 10.0794 3.81224L11.4397 2.9547L12.0458 3.56079L11.1882 4.92117C11.5573 5.44798 11.8164 6.0575 11.9321 6.71638L13.5 7.07183V7.92897L11.932 8.28444C11.8162 8.94342 11.557 9.55301 11.1878 10.0798L12.0453 11.4402L11.4392 12.0462L10.0787 11.1886C9.55192 11.5576 8.94241 11.8166 8.28355 11.9323L7.92809 13.5002H7.07095L6.71543 11.932C6.0569 11.8162 5.44772 11.5572 4.92116 11.1883L3.56055 12.046L2.95445 11.4399L3.81213 10.0794C3.4431 9.55266 3.18403 8.94326 3.06825 8.2845L1.50002 7.92897V7.07183L3.06818 6.71632C3.18388 6.05765 3.44283 5.44833 3.81171 4.92165L2.95398 3.561L3.56008 2.95491L4.92053 3.81251ZM9.02496 7.50008C9.02496 8.34226 8.34223 9.02499 7.50005 9.02499C6.65786 9.02499 5.97513 8.34226 5.97513 7.50008C5.97513 6.65789 6.65786 5.97516 7.50005 5.97516C8.34223 5.97516 9.02496 6.65789 9.02496 7.50008ZM9.92496 7.50008C9.92496 8.83932 8.83929 9.92499 7.50005 9.92499C6.1608 9.92499 5.07513 8.83932 5.07513 7.50008C5.07513 6.16084 6.1608 5.07516 7.50005 5.07516C8.83929 5.07516 9.92496 6.16084 9.92496 7.50008Z", fill: "currentColor", fillRule: "evenodd", clipRule: "evenodd" }) });
  }
  function IconCross() {
    return /* @__PURE__ */ u$5("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 15 15", width: "15", height: "15", children: /* @__PURE__ */ u$5("path", { d: "M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z", fill: "currentColor", fillRule: "evenodd", clipRule: "evenodd" }) });
  }
  function IconJSON() {
    return /* @__PURE__ */ u$5("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", className: "w-5 h-5", style: { marginInline: "-2px", marginTop: "2px" }, "stroke-width": "2", stroke: "currentColor", fill: "none", strokeLinecap: "round", strokeLinejoin: "round", children: [
      /* @__PURE__ */ u$5("path", { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }),
      /* @__PURE__ */ u$5("path", { d: "M20 16v-8l3 8v-8" }),
      /* @__PURE__ */ u$5("path", { d: "M15 8a2 2 0 0 1 2 2v4a2 2 0 1 1 -4 0v-4a2 2 0 0 1 2 -2z" }),
      /* @__PURE__ */ u$5("path", { d: "M1 8h3v6.5a1.5 1.5 0 0 1 -3 0v-.5" }),
      /* @__PURE__ */ u$5("path", { d: "M7 15a1 1 0 0 0 1 1h1a1 1 0 0 0 1 -1v-2a1 1 0 0 0 -1 -1h-1a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1h1a1 1 0 0 1 1 1" })
    ] });
  }
  function IconZip() {
    return /* @__PURE__ */ u$5("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", className: "w-4 h-4", "stroke-width": "2", stroke: "currentColor", fill: "none", strokeLinecap: "round", strokeLinejoin: "round", children: [
      /* @__PURE__ */ u$5("path", { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }),
      /* @__PURE__ */ u$5("path", { d: "M6 20.735a2 2 0 0 1 -1 -1.735v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-1" }),
      /* @__PURE__ */ u$5("path", { d: "M11 17a2 2 0 0 1 2 2v2a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-2a2 2 0 0 1 2 -2z" }),
      /* @__PURE__ */ u$5("path", { d: "M11 5l-1 0" }),
      /* @__PURE__ */ u$5("path", { d: "M13 7l-1 0" }),
      /* @__PURE__ */ u$5("path", { d: "M11 9l-1 0" }),
      /* @__PURE__ */ u$5("path", { d: "M13 11l-1 0" }),
      /* @__PURE__ */ u$5("path", { d: "M11 13l-1 0" }),
      /* @__PURE__ */ u$5("path", { d: "M13 15l-1 0" })
    ] });
  }
  function IconLoading({ className, style }) {
    return /* @__PURE__ */ u$5("span", { style: { animation: "1.4s linear 0s infinite normal none running rotate" }, children: /* @__PURE__ */ u$5(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "22 22 44 44",
        className,
        style: { animation: "1.4s ease-in-out 0s infinite normal none running circularDash", ...style },
        fill: "none",
        stroke: "currentColor",
        "stroke-width": "2",
        children: /* @__PURE__ */ u$5(
          "circle",
          {
            cx: "44",
            cy: "44",
            r: "20.2",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "3.6"
          }
        )
      }
    ) });
  }
  function IconCheckBox() {
    return /* @__PURE__ */ u$5("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", style: { width: "1em", height: "1em", display: "inline-block" }, fill: "currentColor", children: /* @__PURE__ */ u$5("path", { d: "M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" }) });
  }
  function IconCheckBoxChecked({ className }) {
    return /* @__PURE__ */ u$5("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", className, style: { width: "1em", height: "1em", display: "inline-block" }, fill: "currentColor", children: /* @__PURE__ */ u$5("path", { d: "M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" }) });
  }
  function IconTrash({ className, style }) {
    return /* @__PURE__ */ u$5("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", className, style, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round", children: [
      /* @__PURE__ */ u$5("path", { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }),
      /* @__PURE__ */ u$5("path", { d: "M20 6a1 1 0 0 1 .117 1.993l-.117 .007h-.081l-.919 11a3 3 0 0 1 -2.824 2.995l-.176 .005h-8c-1.598 0 -2.904 -1.249 -2.992 -2.75l-.005 -.167l-.923 -11.083h-.08a1 1 0 0 1 -.117 -1.993l.117 -.007h16z", "stroke-width": "0", fill: "currentColor" }),
      /* @__PURE__ */ u$5("path", { d: "M14 2a2 2 0 0 1 2 2a1 1 0 0 1 -1.993 .117l-.007 -.117h-4l-.007 .117a1 1 0 0 1 -1.993 -.117a2 2 0 0 1 1.85 -1.995l.15 -.005h4z", "stroke-width": "0", fill: "currentColor" })
    ] });
  }
  function IconUpload({ className, style }) {
    return /* @__PURE__ */ u$5("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", className, style, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round", children: [
      /* @__PURE__ */ u$5("path", { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }),
      /* @__PURE__ */ u$5("path", { stroke: "currentColor", d: "M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" }),
      /* @__PURE__ */ u$5("path", { stroke: "currentColor", d: "M7 9l5 -5l5 5" }),
      /* @__PURE__ */ u$5("path", { stroke: "currentColor", d: "M12 4l0 12" })
    ] });
  }
  const CheckBox = ({
    className,
    checked = false,
    disabled,
    label,
    onCheckedChange
  }) => {
    const [isChecked, setChecked] = d$3(checked);
    const onChange = (e2) => {
      const newValue = e2.currentTarget.checked;
      setChecked(newValue);
      onCheckedChange == null ? void 0 : onCheckedChange(newValue);
    };
    y$1(() => {
      setChecked(checked);
    }, [checked]);
    return /* @__PURE__ */ u$5("label", { className: `CheckBoxLabel ${className ?? ""} ${disabled ? "disabled" : ""}`, children: [
      /* @__PURE__ */ u$5("span", { className: "IconWrapper", children: [
        /* @__PURE__ */ u$5(
          "input",
          {
            type: "checkbox",
            checked: isChecked,
            onChange,
            disabled
          }
        ),
        isChecked ? /* @__PURE__ */ u$5(IconCheckBoxChecked, {}) : /* @__PURE__ */ u$5(IconCheckBox, {})
      ] }),
      /* @__PURE__ */ u$5("span", { className: "LabelText", children: label })
    ] });
  };
  const PRESET_FILTERS = {
    "deep-dives": {
      minInputOutputRatio: 0.7,
      minTurns: 15
    },
    "quick-questions": {
      maxTurns: 5,
      maxInputOutputRatio: 0.3
    },
    "code-heavy": {
      hasCode: true
    },
    "discovery-moments": {
      hasDiscoveryMarkers: true
    },
    "exploratory": {
      hasHighUncertainty: true,
      isQuestionHeavy: true
    },
    "marathons": {
      minTurns: 30
    },
    "balanced": {
      minInputOutputRatio: 0.4,
      maxInputOutputRatio: 0.6
    }
  };
  const PRESET_LABELS = {
    "deep-dives": "Deep Dives (You wrote a lot)",
    "quick-questions": "Quick Questions",
    "code-heavy": "Code Heavy",
    "discovery-moments": "Discovery Moments (Aha!)",
    "exploratory": "Exploratory (Uncertain)",
    "marathons": "Marathon Conversations (30+ turns)",
    "balanced": "Balanced Discussions"
  };
  const FilterPanel = ({
    onFilterChange,
    conversationCount,
    filteredCount
  }) => {
    const { t: t2 } = useTranslation();
    const [expanded, setExpanded] = d$3(false);
    const [selectedPresets, setSelectedPresets] = d$3([]);
    const [customFilters, setCustomFilters] = d$3({});
    const handlePresetToggle = (presetKey) => {
      const newPresets = selectedPresets.includes(presetKey) ? selectedPresets.filter((k2) => k2 !== presetKey) : [...selectedPresets, presetKey];
      setSelectedPresets(newPresets);
      const mergedCriteria = {};
      newPresets.forEach((key2) => {
        Object.assign(mergedCriteria, PRESET_FILTERS[key2]);
      });
      Object.assign(mergedCriteria, customFilters);
      onFilterChange(mergedCriteria);
    };
    const handleInputRatioChange = (value) => {
      const newFilters = { ...customFilters, minInputOutputRatio: value / 100 };
      setCustomFilters(newFilters);
      const mergedCriteria = {};
      selectedPresets.forEach((key2) => {
        Object.assign(mergedCriteria, PRESET_FILTERS[key2]);
      });
      Object.assign(mergedCriteria, newFilters);
      onFilterChange(mergedCriteria);
    };
    const handleMinTurnsChange = (value) => {
      const newFilters = { ...customFilters, minTurns: value };
      setCustomFilters(newFilters);
      const mergedCriteria = {};
      selectedPresets.forEach((key2) => {
        Object.assign(mergedCriteria, PRESET_FILTERS[key2]);
      });
      Object.assign(mergedCriteria, newFilters);
      onFilterChange(mergedCriteria);
    };
    const handleSearchChange = (value) => {
      const newFilters = { ...customFilters, searchTerm: value || void 0 };
      setCustomFilters(newFilters);
      const mergedCriteria = {};
      selectedPresets.forEach((key2) => {
        Object.assign(mergedCriteria, PRESET_FILTERS[key2]);
      });
      Object.assign(mergedCriteria, newFilters);
      onFilterChange(mergedCriteria);
    };
    const handleClearFilters = () => {
      setSelectedPresets([]);
      setCustomFilters({});
      onFilterChange({});
    };
    const hasActiveFilters = selectedPresets.length > 0 || Object.keys(customFilters).length > 0;
    return /* @__PURE__ */ u$5("div", { className: "mb-4 border border-gray-300 dark:border-gray-600 rounded-lg p-3", children: [
      /* @__PURE__ */ u$5("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ u$5(
          "button",
          {
            className: "text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2",
            onClick: () => setExpanded(!expanded),
            children: [
              "🔍 ",
              t2("Smart Filters"),
              /* @__PURE__ */ u$5("span", { className: "text-xs text-gray-500", children: [
                "(",
                filteredCount,
                " of ",
                conversationCount,
                ")"
              ] })
            ]
          }
        ),
        hasActiveFilters && /* @__PURE__ */ u$5(
          "button",
          {
            className: "text-xs text-blue-600 dark:text-blue-400 hover:underline",
            onClick: handleClearFilters,
            children: t2("Clear All")
          }
        )
      ] }),
      expanded && /* @__PURE__ */ u$5("div", { className: "space-y-3 mt-3", children: [
        /* @__PURE__ */ u$5("div", { children: [
          /* @__PURE__ */ u$5("div", { className: "text-xs font-medium text-gray-600 dark:text-gray-400 mb-2", children: [
            t2("Quick Filters"),
            ":"
          ] }),
          /* @__PURE__ */ u$5("div", { className: "flex flex-wrap gap-2", children: Object.keys(PRESET_FILTERS).map((key2) => /* @__PURE__ */ u$5(
            "button",
            {
              onClick: () => handlePresetToggle(key2),
              className: `text-xs px-3 py-1 rounded-full border transition-colors ${selectedPresets.includes(key2) ? "bg-blue-100 dark:bg-blue-900 border-blue-500 text-blue-700 dark:text-blue-300" : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue-400"}`,
              children: PRESET_LABELS[key2]
            },
            key2
          )) })
        ] }),
        /* @__PURE__ */ u$5("div", { children: [
          /* @__PURE__ */ u$5("label", { className: "text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1", children: [
            t2("Search in titles"),
            ":"
          ] }),
          /* @__PURE__ */ u$5(
            "input",
            {
              type: "text",
              placeholder: t2("Type to search..."),
              className: "Input w-full text-sm",
              value: customFilters.searchTerm || "",
              onChange: (e2) => handleSearchChange(e2.currentTarget.value)
            }
          )
        ] }),
        /* @__PURE__ */ u$5("div", { children: [
          /* @__PURE__ */ u$5("label", { className: "text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1", children: [
            t2("Min Input/Output Ratio"),
            ": ",
            ((customFilters.minInputOutputRatio || 0) * 100).toFixed(0),
            "%"
          ] }),
          /* @__PURE__ */ u$5(
            "input",
            {
              type: "range",
              min: "0",
              max: "150",
              step: "10",
              value: (customFilters.minInputOutputRatio || 0) * 100,
              onChange: (e2) => handleInputRatioChange(Number.parseInt(e2.currentTarget.value, 10)),
              className: "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            }
          ),
          /* @__PURE__ */ u$5("div", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children: [
            (customFilters.minInputOutputRatio || 0) === 0 && "All conversations",
            (customFilters.minInputOutputRatio || 0) > 0 && (customFilters.minInputOutputRatio || 0) < 0.5 && "Balanced or higher",
            (customFilters.minInputOutputRatio || 0) >= 0.5 && (customFilters.minInputOutputRatio || 0) < 0.8 && "You wrote more",
            (customFilters.minInputOutputRatio || 0) >= 0.8 && "Deep dives - you wrote a lot!"
          ] })
        ] }),
        /* @__PURE__ */ u$5("div", { children: [
          /* @__PURE__ */ u$5("label", { className: "text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1", children: [
            t2("Min Conversation Length"),
            ": ",
            customFilters.minTurns || 0,
            " turns"
          ] }),
          /* @__PURE__ */ u$5(
            "input",
            {
              type: "range",
              min: "0",
              max: "50",
              step: "5",
              value: customFilters.minTurns || 0,
              onChange: (e2) => handleMinTurnsChange(Number.parseInt(e2.currentTarget.value, 10)),
              className: "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            }
          )
        ] })
      ] })
    ] });
  };
  const ProjectSelect = ({ projects, selected, setSelected, disabled }) => {
    const { t: t2 } = useTranslation();
    return /* @__PURE__ */ u$5("div", { className: "flex items-center text-gray-600 dark:text-gray-300 flex justify-between mb-3", children: [
      t2("Select Project"),
      /* @__PURE__ */ u$5(
        "select",
        {
          disabled,
          className: "Select",
          value: (selected == null ? void 0 : selected.id) || "",
          onChange: (e2) => {
            const projectId = e2.currentTarget.value;
            const project = projects.find((p2) => p2.id === projectId);
            setSelected(project || null);
          },
          children: [
            /* @__PURE__ */ u$5("option", { value: "", children: t2("(no project)") }),
            projects.map((project) => /* @__PURE__ */ u$5("option", { value: project.id, children: project.display.name }, project.id))
          ]
        }
      )
    ] });
  };
  const ConversationSelect = ({
    conversations,
    selected,
    setSelected,
    disabled,
    loading,
    error: error2
  }) => {
    const { t: t2 } = useTranslation();
    return /* @__PURE__ */ u$5(k$3, { children: [
      /* @__PURE__ */ u$5("div", { className: "SelectToolbar", children: /* @__PURE__ */ u$5(
        CheckBox,
        {
          label: t2("Select All"),
          disabled,
          checked: selected.length === conversations.length,
          onCheckedChange: (checked) => {
            setSelected(checked ? conversations : []);
          }
        }
      ) }),
      /* @__PURE__ */ u$5("ul", { className: "SelectList", children: [
        loading && /* @__PURE__ */ u$5("li", { className: "SelectItem", children: [
          t2("Loading"),
          "..."
        ] }),
        error2 && /* @__PURE__ */ u$5("li", { className: "SelectItem", children: [
          t2("Error"),
          ": ",
          error2
        ] }),
        !loading && !error2 && conversations.map((c2) => /* @__PURE__ */ u$5("li", { className: "SelectItem", children: /* @__PURE__ */ u$5(
          CheckBox,
          {
            label: c2.title,
            disabled,
            checked: selected.some((x2) => x2.id === c2.id),
            onCheckedChange: (checked) => {
              setSelected(
                checked ? [...selected, c2] : selected.filter((x2) => x2.id !== c2.id)
              );
            }
          }
        ) }, c2.id))
      ] })
    ] });
  };
  const DialogContent = ({ format }) => {
    const { t: t2 } = useTranslation();
    const { enableMeta, exportMetaList, exportAllLimit, exportChunkSize } = useSettingContext();
    const metaList = T$3(() => enableMeta ? exportMetaList : [], [enableMeta, exportMetaList]);
    const exportAllOptions = T$3(() => [
      { label: "Markdown", callback: exportAllToMarkdown },
      { label: "HTML", callback: exportAllToHtml },
      { label: "JSON", callback: exportAllToOfficialJson },
      { label: "JSON (ZIP)", callback: exportAllToJson }
    ], []);
    const fileInputRef = A$2(null);
    const [exportSource, setExportSource] = d$3("API");
    const [apiConversations, setApiConversations] = d$3([]);
    const [localConversations, setLocalConversations] = d$3([]);
    const conversations = exportSource === "API" ? apiConversations : localConversations;
    const [projects, setProjects] = d$3([]);
    const [loading, setLoading] = d$3(false);
    const [error2, setError] = d$3("");
    const [processing, setProcessing] = d$3(false);
    const [selectedProject, setSelectedProject] = d$3(null);
    const [selected, setSelected] = d$3([]);
    const [exportType, setExportType] = d$3(exportAllOptions[0].label);
    const disabled = loading || processing || !!error2 || selected.length === 0;
    const requestQueue = T$3(() => new RequestQueue(200, 1600, exportChunkSize), [exportChunkSize]);
    const archiveQueue = T$3(() => new RequestQueue(200, 1600), []);
    const deleteQueue = T$3(() => new RequestQueue(200, 1600), []);
    const [progress, setProgress] = d$3({
      total: 0,
      completed: 0,
      currentName: "",
      currentStatus: ""
    });
    const [chunkProgress, setChunkProgress] = d$3({
      currentChunk: 0,
      totalChunks: 0
    });
    const [filterCriteria, setFilterCriteria] = d$3({});
    const filteredConversations = T$3(() => {
      if (Object.keys(filterCriteria).length === 0) {
        return conversations;
      }
      const conversationsWithMapping = conversations.map((c2) => ({
        ...c2,
        conversation_id: c2.id,
        mapping: {},
        current_node: "",
        moderation_results: [],
        is_archived: false
      }));
      const filtered = filterConversations(conversationsWithMapping, filterCriteria);
      return filtered.map((c2) => ({ id: c2.id, title: c2.title, create_time: c2.create_time }));
    }, [conversations, filterCriteria]);
    const onUpload = q$1((e2) => {
      var _a, _b;
      const file = (_b = (_a = e2.target) == null ? void 0 : _a.files) == null ? void 0 : _b[0];
      if (!file) return;
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const data = JSON.parse(fileReader.result);
        if (!Array.isArray(data)) {
          alert(t2("Invalid File Format"));
          return;
        }
        setSelected([]);
        setExportSource("Local");
        setLocalConversations(data);
      };
      fileReader.readAsText(file);
    }, [t2, setExportSource, setLocalConversations]);
    y$1(() => {
      const off = requestQueue.on("progress", (progress2) => {
        setProcessing(true);
        setProgress(progress2);
      });
      return () => off();
    }, [requestQueue]);
    y$1(() => {
      const off = requestQueue.on("chunkComplete", ({ chunk, chunkIndex, totalChunks }) => {
        var _a;
        setChunkProgress({
          currentChunk: chunkIndex + 1,
          totalChunks
        });
        const callback = (_a = exportAllOptions.find((o3) => o3.label === exportType)) == null ? void 0 : _a.callback;
        if (callback) callback(format, chunk, metaList, chunkIndex, totalChunks);
      });
      return () => off();
    }, [requestQueue, exportAllOptions, exportType, format, metaList]);
    y$1(() => {
      const off = archiveQueue.on("progress", (progress2) => {
        setProcessing(true);
        setProgress(progress2);
      });
      return () => off();
    }, [archiveQueue]);
    y$1(() => {
      const off = deleteQueue.on("progress", (progress2) => {
        setProcessing(true);
        setProgress(progress2);
      });
      return () => off();
    }, [deleteQueue]);
    y$1(() => {
      const off = requestQueue.on("done", () => {
        setProcessing(false);
        setChunkProgress({
          currentChunk: 0,
          totalChunks: 0
        });
      });
      return () => off();
    }, [requestQueue]);
    y$1(() => {
      const off = archiveQueue.on("done", () => {
        setProcessing(false);
        setApiConversations(apiConversations.filter((c2) => !selected.some((s2) => s2.id === c2.id)));
        setSelected([]);
        alert(t2("Conversation Archived Message"));
      });
      return () => off();
    }, [archiveQueue, apiConversations, selected, t2]);
    y$1(() => {
      const off = deleteQueue.on("done", () => {
        setProcessing(false);
        setApiConversations(apiConversations.filter((c2) => !selected.some((s2) => s2.id === c2.id)));
        setSelected([]);
        alert(t2("Conversation Deleted Message"));
      });
      return () => off();
    }, [deleteQueue, apiConversations, selected, t2]);
    const exportAllFromApi = q$1(() => {
      if (disabled) return;
      requestQueue.clear();
      selected.forEach(({ id, title: title2 }) => {
        requestQueue.add({
          name: title2,
          request: () => fetchConversation(id, exportType !== "JSON")
        });
      });
      requestQueue.start();
    }, [disabled, selected, requestQueue, exportType]);
    const exportAllFromLocal = q$1(() => {
      var _a;
      if (disabled) return;
      const results = localConversations.filter((c2) => selected.some((s2) => s2.id === c2.id));
      const callback = (_a = exportAllOptions.find((o3) => o3.label === exportType)) == null ? void 0 : _a.callback;
      if (callback) callback(format, results, metaList);
    }, [
      disabled,
      selected,
      localConversations,
      exportAllOptions,
      exportType,
      format,
      metaList
    ]);
    const exportAll = T$3(() => {
      return exportSource === "API" ? exportAllFromApi : exportAllFromLocal;
    }, [exportSource, exportAllFromApi, exportAllFromLocal]);
    const deleteAll = q$1(() => {
      if (disabled) return;
      const result = confirm(t2("Conversation Delete Alert"));
      if (!result) return;
      deleteQueue.clear();
      selected.forEach(({ id, title: title2 }) => {
        deleteQueue.add({
          name: title2,
          request: () => deleteConversation(id)
        });
      });
      deleteQueue.start();
    }, [disabled, selected, deleteQueue, t2]);
    const archiveAll = q$1(() => {
      if (disabled) return;
      const result = confirm(t2("Conversation Archive Alert"));
      if (!result) return;
      archiveQueue.clear();
      selected.forEach(({ id, title: title2 }) => {
        archiveQueue.add({
          name: title2,
          request: () => archiveConversation(id)
        });
      });
      archiveQueue.start();
    }, [disabled, selected, archiveQueue, t2]);
    y$1(() => {
      fetchProjects().then(setProjects).catch((err) => setError(err.toString()));
    }, []);
    y$1(() => {
      setLoading(true);
      fetchAllConversations(selectedProject == null ? void 0 : selectedProject.id, exportAllLimit).then(setApiConversations).catch((err) => {
        console.error("Error fetching conversations:", err);
        setError(err.message || "Failed to load conversations");
      }).finally(() => setLoading(false));
    }, [selectedProject, exportAllLimit]);
    return /* @__PURE__ */ u$5(k$3, { children: [
      /* @__PURE__ */ u$5(Title, { className: "DialogTitle", children: t2("Export Dialog Title") }),
      /* @__PURE__ */ u$5("div", { className: "flex items-center text-gray-600 dark:text-gray-300 flex justify-between border-b-[1px] pb-3 mb-3 dark:border-gray-700", children: [
        t2("Export from official export file"),
        " (conversations.json) ",
        exportSource === "API" && /* @__PURE__ */ u$5("button", { className: "btn relative btn-neutral", onClick: () => {
          var _a;
          return (_a = fileInputRef.current) == null ? void 0 : _a.click();
        }, children: /* @__PURE__ */ u$5(IconUpload, { className: "w-4 h-4" }) })
      ] }),
      /* @__PURE__ */ u$5(
        "input",
        {
          type: "file",
          accept: "application/json",
          className: "hidden",
          ref: fileInputRef,
          onChange: onUpload
        }
      ),
      exportSource === "API" && /* @__PURE__ */ u$5("div", { className: "flex items-center text-gray-600 dark:text-gray-300 flex justify-between mb-3", children: t2("Export from API") }),
      /* @__PURE__ */ u$5(ProjectSelect, { projects, selected: selectedProject, setSelected: setSelectedProject, disabled: processing || loading }),
      /* @__PURE__ */ u$5(
        FilterPanel,
        {
          onFilterChange: setFilterCriteria,
          conversationCount: conversations.length,
          filteredCount: filteredConversations.length
        }
      ),
      /* @__PURE__ */ u$5(
        AnalysisPanel,
        {
          conversationCount: filteredConversations.length,
          selectedConversations: selected.map((c2) => ({ id: c2.id, title: c2.title }))
        }
      ),
      /* @__PURE__ */ u$5(
        ConversationSelect,
        {
          conversations: filteredConversations,
          selected,
          setSelected,
          disabled: processing,
          loading,
          error: error2
        }
      ),
      /* @__PURE__ */ u$5("div", { className: "flex mt-6", style: { justifyContent: "space-between" }, children: [
        /* @__PURE__ */ u$5("select", { className: "Select", disabled: processing, value: exportType, onChange: (e2) => setExportType(e2.currentTarget.value), children: exportAllOptions.map(({ label }) => /* @__PURE__ */ u$5("option", { value: label, children: label }, t2(label))) }),
        /* @__PURE__ */ u$5("div", { className: "flex flex-grow" }),
        /* @__PURE__ */ u$5("button", { className: "Button red", disabled: disabled || exportSource === "Local", onClick: archiveAll, children: t2("Archive") }),
        /* @__PURE__ */ u$5("button", { className: "Button red ml-4", disabled: disabled || exportSource === "Local", onClick: deleteAll, children: t2("Delete") }),
        /* @__PURE__ */ u$5("button", { className: "Button green ml-4", disabled, onClick: exportAll, children: t2("Export") })
      ] }),
      processing && /* @__PURE__ */ u$5(k$3, { children: [
        /* @__PURE__ */ u$5("div", { className: "mt-2 mb-1 justify-between flex", children: [
          /* @__PURE__ */ u$5("span", { className: "truncate mr-8", children: progress.currentName }),
          /* @__PURE__ */ u$5("span", { children: `${progress.completed}/${progress.total}` })
        ] }),
        chunkProgress.totalChunks > 1 && /* @__PURE__ */ u$5("div", { className: "mb-1 text-sm text-gray-600 dark:text-gray-400", children: [
          t2("Processing chunk"),
          " ",
          chunkProgress.currentChunk,
          " ",
          t2("of"),
          " ",
          chunkProgress.totalChunks
        ] }),
        /* @__PURE__ */ u$5("div", { className: "w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700", children: /* @__PURE__ */ u$5("div", { className: "bg-blue-600 h-2.5 rounded-full", style: { width: `${progress.completed / progress.total * 100}%` } }) })
      ] }),
      /* @__PURE__ */ u$5(Close, { asChild: true, children: /* @__PURE__ */ u$5("button", { className: "IconButton CloseButton", "aria-label": "Close", children: /* @__PURE__ */ u$5(IconCross, {}) }) })
    ] });
  };
  const ExportDialog = ({ format, open, onOpenChange, children }) => {
    return /* @__PURE__ */ u$5(
      Root$1,
      {
        open,
        onOpenChange,
        children: [
          /* @__PURE__ */ u$5(Trigger$1, { asChild: true, children }),
          /* @__PURE__ */ u$5(Portal$1, { children: [
            /* @__PURE__ */ u$5(Overlay, { className: "DialogOverlay" }),
            /* @__PURE__ */ u$5(Content$1, { className: "DialogContent", children: open && /* @__PURE__ */ u$5(DialogContent, { format }) })
          ] })
        ]
      }
    );
  };
  const TIMEOUT = 2500;
  const MenuItem = ({ text: text2, successText, disabled = false, title: title2, icon: Icon, onClick, className }) => {
    const [loading, setLoading] = d$3(false);
    const [succeed, setSucceed] = d$3(false);
    const handleClick = typeof onClick === "function" ? async (e2) => {
      e2.preventDefault();
      if (loading || disabled) return;
      try {
        setLoading(true);
        const result = await onClick();
        if (result) {
          setSucceed(true);
          setTimeout(() => setSucceed(false), TIMEOUT);
        }
      } catch (error2) {
        console.error(error2);
      } finally {
        setLoading(false);
      }
    } : void 0;
    return /* @__PURE__ */ u$5(
      "div",
      {
        className: `
            menu-item
            flex flex-shrink-0 py-3 px-3 items-center gap-3 rounded-lg mb-2
            bg-menu hover:bg-gray-500/10
            transition-colors duration-200
            text-menu text-sm
            cursor-pointer
            border border-menu ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`,
        onClick: handleClick,
        onTouchStart: handleClick,
        title: title2,
        children: loading ? /* @__PURE__ */ u$5("div", { className: "flex justify-center items-center w-full h-full", children: /* @__PURE__ */ u$5(IconLoading, { className: "w-4 h-4" }) }) : /* @__PURE__ */ u$5(k$3, { children: [
          Icon && /* @__PURE__ */ u$5(Icon, {}),
          succeed && successText ? successText : text2
        ] })
      }
    );
  };
  function useTitle() {
    const title2 = C$1(subscribe, getSnapshot);
    return title2;
  }
  function subscribe(callback) {
    const target = document.querySelector("title");
    if (!target) return noop2;
    const observer = new MutationObserver(callback);
    const config = { subtree: true, characterData: true, childList: true };
    observer.observe(target, config);
    return () => observer.disconnect();
  }
  function getSnapshot() {
    return document.title;
  }
  var i$2 = Object.defineProperty;
  var d$2 = (t2, e2, n2) => e2 in t2 ? i$2(t2, e2, { enumerable: true, configurable: true, writable: true, value: n2 }) : t2[e2] = n2;
  var r$1 = (t2, e2, n2) => (d$2(t2, typeof e2 != "symbol" ? e2 + "" : e2, n2), n2);
  let o$4 = class o {
    constructor() {
      r$1(this, "current", this.detect());
      r$1(this, "handoffState", "pending");
      r$1(this, "currentId", 0);
    }
    set(e2) {
      this.current !== e2 && (this.handoffState = "pending", this.currentId = 0, this.current = e2);
    }
    reset() {
      this.set(this.detect());
    }
    nextId() {
      return ++this.currentId;
    }
    get isServer() {
      return this.current === "server";
    }
    get isClient() {
      return this.current === "client";
    }
    detect() {
      return typeof window == "undefined" || typeof document == "undefined" ? "server" : "client";
    }
    handoff() {
      this.handoffState === "pending" && (this.handoffState = "complete");
    }
    get isHandoffComplete() {
      return this.handoffState === "complete";
    }
  };
  let s$3 = new o$4();
  let l$2 = (e2, f2) => {
    s$3.isServer ? y$1(e2, f2) : _(e2, f2);
  };
  function s$2(e2) {
    let r2 = A$2(e2);
    return l$2(() => {
      r2.current = e2;
    }, [e2]), r2;
  }
  let o$3 = function(t2) {
    let e2 = s$2(t2);
    return Rn.useCallback((...r2) => e2.current(...r2), [e2]);
  };
  function T$1(l2, r2, c2) {
    let [i2, s2] = d$3(c2), e2 = l2 !== void 0, t2 = A$2(e2), u2 = A$2(false), d2 = A$2(false);
    return e2 && !t2.current && !u2.current ? (u2.current = true, t2.current = e2, console.error("A component is changing from uncontrolled to controlled. This may be caused by the value changing from undefined to a defined value, which should not happen.")) : !e2 && t2.current && !d2.current && (d2.current = true, t2.current = e2, console.error("A component is changing from controlled to uncontrolled. This may be caused by the value changing from a defined value to undefined, which should not happen.")), [e2 ? l2 : i2, o$3((n2) => (e2 || s2(n2), r2 == null ? void 0 : r2(n2)))];
  }
  function t$1(e2) {
    typeof queueMicrotask == "function" ? queueMicrotask(e2) : Promise.resolve().then(e2).catch((o3) => setTimeout(() => {
      throw o3;
    }));
  }
  function o$2() {
    let n2 = [], r2 = { addEventListener(e2, t2, s2, a2) {
      return e2.addEventListener(t2, s2, a2), r2.add(() => e2.removeEventListener(t2, s2, a2));
    }, requestAnimationFrame(...e2) {
      let t2 = requestAnimationFrame(...e2);
      return r2.add(() => cancelAnimationFrame(t2));
    }, nextFrame(...e2) {
      return r2.requestAnimationFrame(() => r2.requestAnimationFrame(...e2));
    }, setTimeout(...e2) {
      let t2 = setTimeout(...e2);
      return r2.add(() => clearTimeout(t2));
    }, microTask(...e2) {
      let t2 = { current: true };
      return t$1(() => {
        t2.current && e2[0]();
      }), r2.add(() => {
        t2.current = false;
      });
    }, style(e2, t2, s2) {
      let a2 = e2.style.getPropertyValue(t2);
      return Object.assign(e2.style, { [t2]: s2 }), this.add(() => {
        Object.assign(e2.style, { [t2]: a2 });
      });
    }, group(e2) {
      let t2 = o$2();
      return e2(t2), this.add(() => t2.dispose());
    }, add(e2) {
      return n2.push(e2), () => {
        let t2 = n2.indexOf(e2);
        if (t2 >= 0) for (let s2 of n2.splice(t2, 1)) s2();
      };
    }, dispose() {
      for (let e2 of n2.splice(0)) e2();
    } };
    return r2;
  }
  function p$2() {
    let [e2] = d$3(o$2);
    return y$1(() => () => e2.dispose(), [e2]), e2;
  }
  function s$1() {
    let r2 = typeof document == "undefined";
    return ((o3) => o3.useSyncExternalStore)(e)(() => () => {
    }, () => false, () => !r2);
  }
  function l$1() {
    let r2 = s$1(), [e$12, n2] = d$3(s$3.isHandoffComplete);
    return e$12 && s$3.isHandoffComplete === false && n2(false), y$1(() => {
      e$12 !== true && n2(true);
    }, [e$12]), y$1(() => s$3.handoff(), []), r2 ? false : e$12;
  }
  var o$1;
  let I$1 = (o$1 = Rn.useId) != null ? o$1 : function() {
    let n2 = l$1(), [e2, u2] = Rn.useState(n2 ? () => s$3.nextId() : null);
    return l$2(() => {
      e2 === null && u2(s$3.nextId());
    }, [e2]), e2 != null ? "" + e2 : void 0;
  };
  function u$3(r2, n2, ...a2) {
    if (r2 in n2) {
      let e2 = n2[r2];
      return typeof e2 == "function" ? e2(...a2) : e2;
    }
    let t2 = new Error(`Tried to handle "${r2}" but there is no handler defined. Only defined handlers are: ${Object.keys(n2).map((e2) => `"${e2}"`).join(", ")}.`);
    throw Error.captureStackTrace && Error.captureStackTrace(t2, u$3), t2;
  }
  function i$1(t2) {
    var n2;
    if (t2.type) return t2.type;
    let e2 = (n2 = t2.as) != null ? n2 : "button";
    if (typeof e2 == "string" && e2.toLowerCase() === "button") return "button";
  }
  function T(t2, e2) {
    let [n2, u2] = d$3(() => i$1(t2));
    return l$2(() => {
      u2(i$1(t2));
    }, [t2.type, t2.as]), l$2(() => {
      n2 || e2.current && e2.current instanceof HTMLButtonElement && !e2.current.hasAttribute("type") && u2("button");
    }, [n2, e2]), n2;
  }
  let u$2 = Symbol();
  function y(...t2) {
    let n2 = A$2(t2);
    y$1(() => {
      n2.current = t2;
    }, [t2]);
    let c2 = o$3((e2) => {
      for (let o3 of n2.current) o3 != null && (typeof o3 == "function" ? o3(e2) : o3.current = e2);
    });
    return t2.every((e2) => e2 == null || (e2 == null ? void 0 : e2[u$2])) ? void 0 : c2;
  }
  function t(...r2) {
    return Array.from(new Set(r2.flatMap((n2) => typeof n2 == "string" ? n2.split(" ") : []))).filter(Boolean).join(" ");
  }
  var O = ((n2) => (n2[n2.None = 0] = "None", n2[n2.RenderStrategy = 1] = "RenderStrategy", n2[n2.Static = 2] = "Static", n2))(O || {}), v$1 = ((e2) => (e2[e2.Unmount = 0] = "Unmount", e2[e2.Hidden = 1] = "Hidden", e2))(v$1 || {});
  function C({ ourProps: r2, theirProps: t2, slot: e2, defaultTag: n2, features: o3, visible: a2 = true, name: f2, mergeRefs: l2 }) {
    l2 = l2 != null ? l2 : k;
    let s2 = R(t2, r2);
    if (a2) return m(s2, e2, n2, f2, l2);
    let y2 = o3 != null ? o3 : 0;
    if (y2 & 2) {
      let { static: u2 = false, ...d2 } = s2;
      if (u2) return m(d2, e2, n2, f2, l2);
    }
    if (y2 & 1) {
      let { unmount: u2 = true, ...d2 } = s2;
      return u$3(u2 ? 0 : 1, { [0]() {
        return null;
      }, [1]() {
        return m({ ...d2, hidden: true, style: { display: "none" } }, e2, n2, f2, l2);
      } });
    }
    return m(s2, e2, n2, f2, l2);
  }
  function m(r2, t$12 = {}, e2, n2, o3) {
    let { as: a2 = e2, children: f2, refName: l2 = "ref", ...s2 } = F$1(r2, ["unmount", "static"]), y2 = r2.ref !== void 0 ? { [l2]: r2.ref } : {}, u2 = typeof f2 == "function" ? f2(t$12) : f2;
    "className" in s2 && s2.className && typeof s2.className == "function" && (s2.className = s2.className(t$12));
    let d2 = {};
    if (t$12) {
      let i2 = false, c2 = [];
      for (let [T2, p2] of Object.entries(t$12)) typeof p2 == "boolean" && (i2 = true), p2 === true && c2.push(T2);
      i2 && (d2["data-headlessui-state"] = c2.join(" "));
    }
    if (a2 === k$3 && Object.keys(x(s2)).length > 0) {
      if (!mn(u2) || Array.isArray(u2) && u2.length > 1) throw new Error(['Passing props on "Fragment"!', "", `The current component <${n2} /> is rendering a "Fragment".`, "However we need to passthrough the following props:", Object.keys(s2).map((p2) => `  - ${p2}`).join(`
`), "", "You can apply a few solutions:", ['Add an `as="..."` prop, to ensure that we render an actual element instead of a "Fragment".', "Render a single element as the child so that we can forward the props onto that element."].map((p2) => `  - ${p2}`).join(`
`)].join(`
`));
      let i2 = u2.props, c2 = typeof (i2 == null ? void 0 : i2.className) == "function" ? (...p2) => t(i2 == null ? void 0 : i2.className(...p2), s2.className) : t(i2 == null ? void 0 : i2.className, s2.className), T2 = c2 ? { className: c2 } : {};
      return _n(u2, Object.assign({}, R(u2.props, x(F$1(s2, ["ref"]))), d2, y2, { ref: o3(u2.ref, y2.ref) }, T2));
    }
    return _$1(a2, Object.assign({}, F$1(s2, ["ref"]), a2 !== k$3 && y2, a2 !== k$3 && d2), u2);
  }
  function k(...r2) {
    return r2.every((t2) => t2 == null) ? void 0 : (t2) => {
      for (let e2 of r2) e2 != null && (typeof e2 == "function" ? e2(t2) : e2.current = t2);
    };
  }
  function R(...r2) {
    if (r2.length === 0) return {};
    if (r2.length === 1) return r2[0];
    let t2 = {}, e2 = {};
    for (let o3 of r2) for (let a2 in o3) a2.startsWith("on") && typeof o3[a2] == "function" ? (e2[a2] != null || (e2[a2] = []), e2[a2].push(o3[a2])) : t2[a2] = o3[a2];
    if (t2.disabled || t2["aria-disabled"]) return Object.assign(t2, Object.fromEntries(Object.keys(e2).map((o3) => [o3, void 0])));
    for (let o3 in e2) Object.assign(t2, { [o3](a2, ...f2) {
      let l2 = e2[o3];
      for (let s2 of l2) {
        if ((a2 instanceof Event || (a2 == null ? void 0 : a2.nativeEvent) instanceof Event) && a2.defaultPrevented) return;
        s2(a2, ...f2);
      }
    } });
    return t2;
  }
  function U(r2) {
    var t2;
    return Object.assign(D(r2), { displayName: (t2 = r2.displayName) != null ? t2 : r2.name });
  }
  function x(r2) {
    let t2 = Object.assign({}, r2);
    for (let e2 in t2) t2[e2] === void 0 && delete t2[e2];
    return t2;
  }
  function F$1(r2, t2 = []) {
    let e2 = Object.assign({}, r2);
    for (let n2 of t2) n2 in e2 && delete e2[n2];
    return e2;
  }
  let p$1 = "div";
  var s = ((e2) => (e2[e2.None = 1] = "None", e2[e2.Focusable = 2] = "Focusable", e2[e2.Hidden = 4] = "Hidden", e2))(s || {});
  function l(d2, o3) {
    var n2;
    let { features: t2 = 1, ...e2 } = d2, r2 = { ref: o3, "aria-hidden": (t2 & 2) === 2 ? true : (n2 = e2["aria-hidden"]) != null ? n2 : void 0, hidden: (t2 & 4) === 4 ? true : void 0, style: { position: "fixed", top: 1, left: 1, width: 1, height: 0, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", borderWidth: "0", ...(t2 & 4) === 4 && (t2 & 2) !== 2 && { display: "none" } } };
    return C({ ourProps: r2, theirProps: e2, slot: {}, defaultTag: p$1, name: "Hidden" });
  }
  let u$1 = U(l);
  function r(n2) {
    let e2 = n2.parentElement, l2 = null;
    for (; e2 && !(e2 instanceof HTMLFieldSetElement); ) e2 instanceof HTMLLegendElement && (l2 = e2), e2 = e2.parentElement;
    let t2 = (e2 == null ? void 0 : e2.getAttribute("disabled")) === "";
    return t2 && i(l2) ? false : t2;
  }
  function i(n2) {
    if (!n2) return false;
    let e2 = n2.previousElementSibling;
    for (; e2 !== null; ) {
      if (e2 instanceof HTMLLegendElement) return false;
      e2 = e2.previousElementSibling;
    }
    return true;
  }
  function p(i2) {
    var t2, r2;
    let s2 = (t2 = i2 == null ? void 0 : i2.form) != null ? t2 : i2.closest("form");
    if (s2) {
      for (let n2 of s2.elements) if (n2 !== i2 && (n2.tagName === "INPUT" && n2.type === "submit" || n2.tagName === "BUTTON" && n2.type === "submit" || n2.nodeName === "INPUT" && n2.type === "image")) {
        n2.click();
        return;
      }
      (r2 = s2.requestSubmit) == null || r2.call(s2);
    }
  }
  var o2 = ((r2) => (r2.Space = " ", r2.Enter = "Enter", r2.Escape = "Escape", r2.Backspace = "Backspace", r2.Delete = "Delete", r2.ArrowLeft = "ArrowLeft", r2.ArrowUp = "ArrowUp", r2.ArrowRight = "ArrowRight", r2.ArrowDown = "ArrowDown", r2.Home = "Home", r2.End = "End", r2.PageUp = "PageUp", r2.PageDown = "PageDown", r2.Tab = "Tab", r2))(o2 || {});
  let d$1 = Q$1(null);
  function f() {
    let r2 = x$2(d$1);
    if (r2 === null) {
      let t2 = new Error("You used a <Description /> component, but it is not inside a relevant parent.");
      throw Error.captureStackTrace && Error.captureStackTrace(t2, f), t2;
    }
    return r2;
  }
  function w() {
    let [r2, t2] = d$3([]);
    return [r2.length > 0 ? r2.join(" ") : void 0, T$3(() => function(e2) {
      let i2 = o$3((s2) => (t2((o3) => [...o3, s2]), () => t2((o3) => {
        let p2 = o3.slice(), c2 = p2.indexOf(s2);
        return c2 !== -1 && p2.splice(c2, 1), p2;
      }))), n2 = T$3(() => ({ register: i2, slot: e2.slot, name: e2.name, props: e2.props }), [i2, e2.slot, e2.name, e2.props]);
      return Rn.createElement(d$1.Provider, { value: n2 }, e2.children);
    }, [t2])];
  }
  let I = "p";
  function S$1(r2, t2) {
    let a2 = I$1(), { id: e2 = `headlessui-description-${a2}`, ...i2 } = r2, n2 = f(), s2 = y(t2);
    l$2(() => n2.register(e2), [e2, n2.register]);
    let o3 = { ref: s2, ...n2.props, id: e2 };
    return C({ ourProps: o3, theirProps: i2, slot: n2.slot || {}, defaultTag: I, name: n2.name || "Description" });
  }
  let h$1 = U(S$1), G = Object.assign(h$1, {});
  let d = Q$1(null);
  function u() {
    let a2 = x$2(d);
    if (a2 === null) {
      let t2 = new Error("You used a <Label /> component, but it is not inside a relevant parent.");
      throw Error.captureStackTrace && Error.captureStackTrace(t2, u), t2;
    }
    return a2;
  }
  function F() {
    let [a2, t2] = d$3([]);
    return [a2.length > 0 ? a2.join(" ") : void 0, T$3(() => function(e2) {
      let s2 = o$3((r2) => (t2((l2) => [...l2, r2]), () => t2((l2) => {
        let n2 = l2.slice(), p2 = n2.indexOf(r2);
        return p2 !== -1 && n2.splice(p2, 1), n2;
      }))), o3 = T$3(() => ({ register: s2, slot: e2.slot, name: e2.name, props: e2.props }), [s2, e2.slot, e2.name, e2.props]);
      return Rn.createElement(d.Provider, { value: o3 }, e2.children);
    }, [t2])];
  }
  let A = "label";
  function h(a2, t2) {
    let i2 = I$1(), { id: e2 = `headlessui-label-${i2}`, passive: s2 = false, ...o3 } = a2, r2 = u(), l2 = y(t2);
    l$2(() => r2.register(e2), [e2, r2.register]);
    let n2 = { ref: l2, ...r2.props, id: e2 };
    return s2 && ("onClick" in n2 && (delete n2.htmlFor, delete n2.onClick), "onClick" in o3 && delete o3.onClick), C({ ourProps: n2, theirProps: o3, slot: r2.slot || {}, defaultTag: A, name: r2.name || "Label" });
  }
  let v = U(h), B = Object.assign(v, {});
  let S = Q$1(null);
  S.displayName = "GroupContext";
  let ee = k$3;
  function te(r2) {
    var u2;
    let [n2, p2] = d$3(null), [c2, T2] = F(), [o3, b2] = w(), a2 = T$3(() => ({ switch: n2, setSwitch: p2, labelledby: c2, describedby: o3 }), [n2, p2, c2, o3]), d2 = {}, y2 = r2;
    return Rn.createElement(b2, { name: "Switch.Description" }, Rn.createElement(T2, { name: "Switch.Label", props: { htmlFor: (u2 = a2.switch) == null ? void 0 : u2.id, onClick(m2) {
      n2 && (m2.currentTarget.tagName === "LABEL" && m2.preventDefault(), n2.click(), n2.focus({ preventScroll: true }));
    } } }, Rn.createElement(S.Provider, { value: a2 }, C({ ourProps: d2, theirProps: y2, defaultTag: ee, name: "Switch.Group" }))));
  }
  let ne = "button";
  function re(r$12, n2) {
    var E2;
    let p$12 = I$1(), { id: c2 = `headlessui-switch-${p$12}`, checked: T$22, defaultChecked: o$12 = false, onChange: b2, disabled: a2 = false, name: d2, value: y$22, form: u2, ...m2 } = r$12, t2 = x$2(S), f2 = A$2(null), C$12 = y(f2, n2, t2 === null ? null : t2.setSwitch), [i2, s$12] = T$1(T$22, b2, o$12), w2 = o$3(() => s$12 == null ? void 0 : s$12(!i2)), L2 = o$3((e2) => {
      if (r(e2.currentTarget)) return e2.preventDefault();
      e2.preventDefault(), w2();
    }), x$12 = o$3((e2) => {
      e2.key === o2.Space ? (e2.preventDefault(), w2()) : e2.key === o2.Enter && p(e2.currentTarget);
    }), v2 = o$3((e2) => e2.preventDefault()), G2 = T$3(() => ({ checked: i2 }), [i2]), R2 = { id: c2, ref: C$12, role: "switch", type: T(r$12, f2), tabIndex: r$12.tabIndex === -1 ? 0 : (E2 = r$12.tabIndex) != null ? E2 : 0, "aria-checked": i2, "aria-labelledby": t2 == null ? void 0 : t2.labelledby, "aria-describedby": t2 == null ? void 0 : t2.describedby, disabled: a2, onClick: L2, onKeyUp: x$12, onKeyPress: v2 }, k2 = p$2();
    return y$1(() => {
      var _24;
      let e2 = (_24 = f2.current) == null ? void 0 : _24.closest("form");
      e2 && o$12 !== void 0 && k2.addEventListener(e2, "reset", () => {
        s$12(o$12);
      });
    }, [f2, s$12]), Rn.createElement(Rn.Fragment, null, d2 != null && i2 && Rn.createElement(u$1, { features: s.Hidden, ...x({ as: "input", type: "checkbox", hidden: true, readOnly: true, disabled: a2, form: u2, checked: i2, name: d2, value: y$22 }) }), C({ ourProps: R2, theirProps: m2, slot: G2, defaultTag: ne, name: "Switch" }));
  }
  let oe = U(re), ie = te, _e = Object.assign(oe, { Group: ie, Label: B, Description: G });
  function Toggle({ label, checked = true, onCheckedUpdate }) {
    return /* @__PURE__ */ u$5("div", { className: "inline-flex items-center", children: [
      /* @__PURE__ */ u$5(
        _e,
        {
          checked,
          onChange: onCheckedUpdate,
          "data-state": checked ? "checked" : "unchecked",
          className: "toggle-switch",
          children: /* @__PURE__ */ u$5(
            "span",
            {
              "data-state": checked ? "checked" : "unchecked",
              className: "toggle-switch-handle"
            }
          )
        }
      ),
      label && /* @__PURE__ */ u$5("span", { className: "toggle-switch-label", children: label })
    ] });
  }
  function Variable({ name, title: title2 }) {
    return /* @__PURE__ */ u$5("strong", { className: "cursor-help select-all whitespace-nowrap", title: title2, children: name });
  }
  const SettingDialog = ({
    open,
    onOpenChange,
    children
  }) => {
    const {
      /* eslint-disable pionxzh/consistent-list-newline */
      format,
      setFormat,
      enableTimestamp,
      setEnableTimestamp,
      timeStamp24H,
      setTimeStamp24H,
      enableTimestampHTML,
      setEnableTimestampHTML,
      enableTimestampMarkdown,
      setEnableTimestampMarkdown,
      enableMeta,
      setEnableMeta,
      exportMetaList,
      setExportMetaList,
      exportAllLimit,
      setExportAllLimit,
      exportChunkSize,
      setExportChunkSize,
      anthropicApiKey,
      setAnthropicApiKey
      /* eslint-enable pionxzh/consistent-list-newline */
    } = useSettingContext();
    const { t: t2, i18n } = useTranslation();
    const _title = useTitle();
    const date = dateStr();
    const timestamp$1 = timestamp();
    const title2 = sanitize$1(_title).replace(/\s+/g, "_");
    const chatId = getChatIdFromUrl() || "this-is-a-mock-chat-id";
    const now = Date.now() / 1e3;
    const createTime = now;
    const updateTime = now;
    const preview = getFileNameWithFormat(format, "{ext}", { title: title2, chatId, createTime, updateTime });
    const source = `${baseUrl}/${chatId}`;
    return /* @__PURE__ */ u$5(
      Root$1,
      {
        open,
        onOpenChange,
        children: [
          /* @__PURE__ */ u$5(Trigger$1, { asChild: true, children }),
          /* @__PURE__ */ u$5(Portal$1, { children: [
            /* @__PURE__ */ u$5(Overlay, { className: "DialogOverlay" }),
            /* @__PURE__ */ u$5(Content$1, { className: "DialogContent", children: [
              /* @__PURE__ */ u$5(Title, { className: "DialogTitle", children: t2("Exporter Settings") }),
              /* @__PURE__ */ u$5("dl", { className: "space-y-6", children: [
                /* @__PURE__ */ u$5("div", { className: "relative flex bg-white dark:bg-white/5 rounded p-4", children: /* @__PURE__ */ u$5("div", { className: "w-full", children: [
                  /* @__PURE__ */ u$5("dt", { className: "text-md font-medium text-gray-800 dark:text-white", children: [
                    t2("Anthropic API Key"),
                    " 🔑"
                  ] }),
                  /* @__PURE__ */ u$5("dd", { className: "text-sm text-gray-700 dark:text-gray-300 mt-2", children: [
                    t2("Anthropic API Key Description"),
                    /* @__PURE__ */ u$5(
                      "input",
                      {
                        type: "password",
                        className: "Input mt-3 w-full",
                        placeholder: "sk-ant-...",
                        value: anthropicApiKey,
                        onChange: (e2) => setAnthropicApiKey(e2.currentTarget.value)
                      }
                    ),
                    /* @__PURE__ */ u$5("p", { className: "mt-2 text-xs text-gray-600 dark:text-gray-400", children: [
                      "⚠️ ",
                      t2("API Key Security Warning")
                    ] })
                  ] })
                ] }) }),
                /* @__PURE__ */ u$5("div", { className: "relative flex bg-white dark:bg-white/5 rounded p-4", children: /* @__PURE__ */ u$5("div", { children: [
                  /* @__PURE__ */ u$5("dt", { className: "text-md font-medium text-gray-800 dark:text-white", children: `${t2("Language")} 🌐` }),
                  /* @__PURE__ */ u$5("dd", { children: /* @__PURE__ */ u$5(
                    "select",
                    {
                      className: "Select mt-3",
                      value: i18n.language,
                      onChange: (e2) => i18n.changeLanguage(e2.currentTarget.value),
                      children: LOCALES.map(({ name, code: code2 }) => /* @__PURE__ */ u$5("option", { value: code2, children: name }, code2))
                    }
                  ) })
                ] }) }),
                /* @__PURE__ */ u$5("div", { className: "relative flex bg-white dark:bg-white/5 rounded p-4", children: /* @__PURE__ */ u$5("div", { children: [
                  /* @__PURE__ */ u$5("dt", { className: "text-md font-medium text-gray-800 dark:text-white", children: t2("File Name") }),
                  /* @__PURE__ */ u$5("dd", { children: [
                    /* @__PURE__ */ u$5("p", { className: "text-sm text-gray-700 dark:text-gray-300", children: [
                      t2("Available variables"),
                      ":",
                      " ",
                      /* @__PURE__ */ u$5(Variable, { name: "{title}", title: title2 }),
                      ",",
                      " ",
                      /* @__PURE__ */ u$5(Variable, { name: "{date}", title: date }),
                      ",",
                      " ",
                      /* @__PURE__ */ u$5(Variable, { name: "{timestamp}", title: timestamp$1 }),
                      ",",
                      " ",
                      /* @__PURE__ */ u$5(Variable, { name: "{chat_id}", title: chatId }),
                      ",",
                      " ",
                      /* @__PURE__ */ u$5(Variable, { name: "{create_time}", title: unixTimestampToISOString(createTime) }),
                      ",",
                      " ",
                      /* @__PURE__ */ u$5(Variable, { name: "{update_time}", title: unixTimestampToISOString(updateTime) })
                    ] }),
                    /* @__PURE__ */ u$5("input", { className: "Input mt-4", id: "filename", value: format, onChange: (e2) => setFormat(e2.currentTarget.value) }),
                    /* @__PURE__ */ u$5("p", { className: "mt-1 text-sm text-gray-700 dark:text-gray-300", children: [
                      t2("Preview"),
                      ":",
                      " ",
                      /* @__PURE__ */ u$5("span", { className: "select-all", style: { "text-decoration": "underline", "text-underline-offset": 4 }, children: preview })
                    ] })
                  ] })
                ] }) }),
                /* @__PURE__ */ u$5("div", { className: "relative flex bg-white dark:bg-white/5 rounded p-4", children: /* @__PURE__ */ u$5("div", { children: [
                  /* @__PURE__ */ u$5("dt", { className: "text-md font-medium text-gray-800 dark:text-white", children: [
                    t2("Export All Limit"),
                    " "
                  ] }),
                  /* @__PURE__ */ u$5("dd", { className: "text-sm text-gray-700 dark:text-gray-300 mt-2", children: [
                    t2("Export All Limit Description"),
                    " ",
                    /* @__PURE__ */ u$5("div", { className: "flex items-center gap-4 mt-3", children: [
                      /* @__PURE__ */ u$5(
                        "input",
                        {
                          type: "range",
                          min: "100",
                          max: "20000",
                          step: "100",
                          value: exportAllLimit,
                          onChange: (e2) => setExportAllLimit(
                            Number.parseInt(
                              e2.currentTarget.value,
                              10
                            )
                          ),
                          className: "flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700",
                          id: "exportAllLimitSlider"
                        }
                      ),
                      /* @__PURE__ */ u$5("span", { className: "font-medium text-gray-900 dark:text-gray-300 w-12 text-right", children: exportAllLimit })
                    ] })
                  ] })
                ] }) }),
                /* @__PURE__ */ u$5("div", { className: "relative flex bg-white dark:bg-white/5 rounded p-4", children: /* @__PURE__ */ u$5("div", { children: [
                  /* @__PURE__ */ u$5("dt", { className: "text-md font-medium text-gray-800 dark:text-white", children: [
                    t2("Export Chunk Size"),
                    " "
                  ] }),
                  /* @__PURE__ */ u$5("dd", { className: "text-sm text-gray-700 dark:text-gray-300 mt-2", children: [
                    t2("Export Chunk Size Description"),
                    " ",
                    /* @__PURE__ */ u$5("div", { className: "flex items-center gap-4 mt-3", children: [
                      /* @__PURE__ */ u$5(
                        "input",
                        {
                          type: "range",
                          min: "10",
                          max: "500",
                          step: "10",
                          value: exportChunkSize,
                          onChange: (e2) => setExportChunkSize(
                            Number.parseInt(
                              e2.currentTarget.value,
                              10
                            )
                          ),
                          className: "flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700",
                          id: "exportChunkSizeSlider"
                        }
                      ),
                      /* @__PURE__ */ u$5("span", { className: "font-medium text-gray-900 dark:text-gray-300 w-12 text-right", children: exportChunkSize })
                    ] })
                  ] })
                ] }) }),
                /* @__PURE__ */ u$5("div", { className: "relative flex bg-white dark:bg-white/5 rounded p-4", children: [
                  /* @__PURE__ */ u$5("div", { children: [
                    /* @__PURE__ */ u$5("dt", { className: "text-md font-medium text-gray-800 dark:text-white", children: t2("Conversation Timestamp") }),
                    /* @__PURE__ */ u$5("dd", { className: "text-sm text-gray-700 dark:text-gray-300", children: [
                      t2("Conversation Timestamp Description"),
                      enableTimestamp && /* @__PURE__ */ u$5(k$3, { children: [
                        /* @__PURE__ */ u$5("div", { className: "mt-2", children: /* @__PURE__ */ u$5(
                          Toggle,
                          {
                            label: t2("Use 24-hour format"),
                            checked: timeStamp24H,
                            onCheckedUpdate: setTimeStamp24H
                          }
                        ) }),
                        /* @__PURE__ */ u$5("div", { className: "mt-2", children: /* @__PURE__ */ u$5(
                          Toggle,
                          {
                            label: t2("Enable on HTML"),
                            checked: enableTimestampHTML,
                            onCheckedUpdate: setEnableTimestampHTML
                          }
                        ) }),
                        /* @__PURE__ */ u$5("div", { className: "mt-2", children: /* @__PURE__ */ u$5(
                          Toggle,
                          {
                            label: t2("Enable on Markdown"),
                            checked: enableTimestampMarkdown,
                            onCheckedUpdate: setEnableTimestampMarkdown
                          }
                        ) })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ u$5("div", { className: "absolute right-4", children: /* @__PURE__ */ u$5(Toggle, { label: "", checked: enableTimestamp, onCheckedUpdate: setEnableTimestamp }) })
                ] }),
                /* @__PURE__ */ u$5("div", { className: "relative flex bg-white dark:bg-white/5 rounded p-4", children: [
                  /* @__PURE__ */ u$5("div", { children: [
                    /* @__PURE__ */ u$5("dt", { className: "text-md font-medium text-gray-800 dark:text-white", children: t2("Export Metadata") }),
                    /* @__PURE__ */ u$5("dd", { className: "text-sm text-gray-700 dark:text-gray-300", children: [
                      t2("Export Metadata Description"),
                      enableMeta && /* @__PURE__ */ u$5(k$3, { children: [
                        /* @__PURE__ */ u$5("p", { className: "mt-2 text-sm text-gray-700 dark:text-gray-300", children: [
                          t2("Available variables"),
                          ":",
                          " ",
                          /* @__PURE__ */ u$5(Variable, { name: "{title}", title: title2 }),
                          ",",
                          " ",
                          /* @__PURE__ */ u$5(Variable, { name: "{date}", title: date }),
                          ",",
                          " ",
                          /* @__PURE__ */ u$5(Variable, { name: "{timestamp}", title: timestamp$1 }),
                          ",",
                          " ",
                          /* @__PURE__ */ u$5(Variable, { name: "{source}", title: source }),
                          ",",
                          " ",
                          /* @__PURE__ */ u$5(Variable, { name: "{model}", title: "ChatGPT-3.5" }),
                          ",",
                          " ",
                          /* @__PURE__ */ u$5(Variable, { name: "{model_name}", title: "text-davinci-002-render-sha" }),
                          ",",
                          " ",
                          /* @__PURE__ */ u$5(Variable, { name: "{create_time}", title: "2023-04-10T21:45:35.027Z" }),
                          ",",
                          " ",
                          /* @__PURE__ */ u$5(Variable, { name: "{update_time}", title: "2023-04-10T21:45:35.027Z" })
                        ] }),
                        exportMetaList.map((meta, i2) => /* @__PURE__ */ u$5("div", { className: "flex items-center mt-2", children: [
                          /* @__PURE__ */ u$5(
                            "input",
                            {
                              className: "Input",
                              value: meta.name,
                              onChange: (e2) => {
                                const list2 = [...exportMetaList];
                                list2[i2] = { ...list2[i2], name: e2.currentTarget.value };
                                setExportMetaList(list2);
                              }
                            }
                          ),
                          /* @__PURE__ */ u$5("span", { className: "mx-2", children: "→" }),
                          /* @__PURE__ */ u$5(
                            "input",
                            {
                              className: "Input",
                              value: meta.value,
                              onChange: (e2) => {
                                const list2 = [...exportMetaList];
                                list2[i2] = { ...list2[i2], value: e2.currentTarget.value };
                                setExportMetaList(list2);
                              }
                            }
                          ),
                          /* @__PURE__ */ u$5(
                            "button",
                            {
                              className: "ml-2 rounded-full p-1 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition ease-in-out duration-150",
                              "aria-label": "Remove",
                              onClick: () => setExportMetaList(exportMetaList.filter((_24, j2) => j2 !== i2)),
                              children: /* @__PURE__ */ u$5(IconTrash, { className: "w-4 h-4" })
                            }
                          )
                        ] }, i2)),
                        /* @__PURE__ */ u$5("div", { className: "flex justify-center items-center mt-2 pr-8", children: /* @__PURE__ */ u$5(
                          "button",
                          {
                            className: "w-full border border-[#6f6e77] dark:border-gray-[#86858d] rounded-md py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition ease-in-out duration-150",
                            "aria-label": "Add",
                            onClick: () => setExportMetaList([...exportMetaList, { name: "", value: "" }]),
                            children: "+"
                          }
                        ) })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ u$5("div", { className: "absolute right-4", children: /* @__PURE__ */ u$5(Toggle, { label: "", checked: enableMeta, onCheckedUpdate: setEnableMeta }) })
                ] })
              ] }),
              /* @__PURE__ */ u$5("div", { className: "flex mt-6", style: { justifyContent: "flex-end" }, children: /* @__PURE__ */ u$5(Close, { asChild: true, children: /* @__PURE__ */ u$5("button", { className: "Button green font-bold", children: t2("Save") }) }) }),
              /* @__PURE__ */ u$5(Close, { asChild: true, children: /* @__PURE__ */ u$5("button", { className: "IconButton CloseButton", "aria-label": "Close", children: /* @__PURE__ */ u$5(IconCross, {}) }) })
            ] })
          ] })
        ]
      }
    );
  };
  function MenuInner({ container }) {
    const { t: t2 } = useTranslation();
    const disabled = getHistoryDisabled();
    const [open, setOpen] = d$3(false);
    const [jsonOpen, setJsonOpen] = d$3(false);
    const [exportOpen, setExportOpen] = d$3(false);
    const [settingOpen, setSettingOpen] = d$3(false);
    const {
      format,
      enableTimestamp,
      timeStamp24H,
      enableMeta,
      exportMetaList
    } = useSettingContext();
    y$1(() => {
      if (enableTimestamp) {
        document.body.setAttribute("data-time-format", timeStamp24H ? "24" : "12");
      } else {
        document.body.removeAttribute("data-time-format");
      }
    }, [enableTimestamp, timeStamp24H]);
    const metaList = T$3(() => enableMeta ? exportMetaList : [], [enableMeta, exportMetaList]);
    const onClickText = q$1(() => exportToText(), []);
    const onClickPng = q$1(() => exportToPng(format), [format]);
    const onClickMarkdown = q$1(() => exportToMarkdown(format, metaList), [format, metaList]);
    const onClickHtml = q$1(() => exportToHtml(format, metaList), [format, metaList]);
    const onClickJSON = q$1(() => {
      setJsonOpen(true);
      return true;
    }, []);
    const onClickOfficialJSON = q$1(() => exportToJson(format), [format]);
    const onClickTavern = q$1(() => exportToTavern(format), [format]);
    const onClickOoba = q$1(() => exportToOoba(format), [format]);
    const width = useWindowResize(() => window.innerWidth);
    const isMobile = width < 768;
    const Portal$22 = isMobile ? "div" : Portal;
    if (disabled) {
      return /* @__PURE__ */ u$5(
        MenuItem,
        {
          className: "mt-1",
          text: "Chat History disabled",
          icon: IconArrowRightFromBracket,
          disabled: true
        }
      );
    }
    return /* @__PURE__ */ u$5(k$3, { children: [
      isMobile && open && /* @__PURE__ */ u$5(
        "div",
        {
          className: "dropdown-backdrop animate-fadeIn",
          onClick: () => setOpen(false)
        }
      ),
      /* @__PURE__ */ u$5(
        Root2,
        {
          openDelay: 0,
          closeDelay: 300,
          open,
          onOpenChange: setOpen,
          children: [
            /* @__PURE__ */ u$5(Trigger, { children: /* @__PURE__ */ u$5(
              MenuItem,
              {
                className: "mt-1",
                text: t2("ExportHelper"),
                icon: IconArrowRightFromBracket,
                onClick: () => {
                  setOpen(true);
                  return true;
                }
              }
            ) }),
            /* @__PURE__ */ u$5(
              Portal$22,
              {
                container: isMobile ? container : document.body,
                forceMount: open || jsonOpen || settingOpen || exportOpen,
                children: /* @__PURE__ */ u$5(
                  Content2,
                  {
                    className: `
                        grid grid-cols-2
                        bg-menu
                        border border-menu
                        transition-opacity duration-200 shadow-md
                        ${isMobile ? "gap-x-1 px-1.5 pt-2 rounded animate-slideUp" : "gap-x-1 px-1.5 py-2 pb-0 rounded-md animate-fadeIn"}`,
                    style: {
                      width: isMobile ? 316 : 268,
                      left: -6,
                      bottom: 0
                    },
                    sideOffset: isMobile ? 0 : 8,
                    side: isMobile ? "bottom" : "right",
                    align: "start",
                    alignOffset: isMobile ? 0 : -64,
                    collisionPadding: isMobile ? 0 : 8,
                    children: [
                      /* @__PURE__ */ u$5(
                        SettingDialog,
                        {
                          open: settingOpen,
                          onOpenChange: setSettingOpen,
                          children: /* @__PURE__ */ u$5("div", { className: "row-full", children: /* @__PURE__ */ u$5(MenuItem, { text: t2("Setting"), icon: IconSetting }) })
                        }
                      ),
                      /* @__PURE__ */ u$5(
                        MenuItem,
                        {
                          text: t2("Copy Text"),
                          successText: t2("Copied!"),
                          icon: IconCopy,
                          className: "row-full",
                          onClick: onClickText
                        }
                      ),
                      /* @__PURE__ */ u$5(
                        MenuItem,
                        {
                          text: t2("Screenshot"),
                          icon: IconCamera,
                          className: "row-half",
                          onClick: onClickPng
                        }
                      ),
                      /* @__PURE__ */ u$5(
                        MenuItem,
                        {
                          text: t2("Markdown"),
                          icon: IconMarkdown,
                          className: "row-half",
                          onClick: onClickMarkdown
                        }
                      ),
                      /* @__PURE__ */ u$5(
                        MenuItem,
                        {
                          text: t2("HTML"),
                          icon: FileCode,
                          className: "row-half",
                          onClick: onClickHtml
                        }
                      ),
                      /* @__PURE__ */ u$5(
                        Root$1,
                        {
                          open: jsonOpen,
                          onOpenChange: setJsonOpen,
                          children: [
                            /* @__PURE__ */ u$5(Trigger$1, { asChild: true, children: /* @__PURE__ */ u$5(
                              MenuItem,
                              {
                                text: t2("JSON"),
                                icon: IconJSON,
                                className: "row-half",
                                onClick: onClickJSON
                              }
                            ) }),
                            /* @__PURE__ */ u$5(Portal$1, { children: [
                              /* @__PURE__ */ u$5(Overlay, { className: "DialogOverlay" }),
                              /* @__PURE__ */ u$5(Content$1, { className: "DialogContent", style: { width: "320px" }, children: [
                                /* @__PURE__ */ u$5(Title, { className: "DialogTitle", children: t2("JSON") }),
                                /* @__PURE__ */ u$5(
                                  MenuItem,
                                  {
                                    text: t2("OpenAI Official Format"),
                                    icon: IconCopy,
                                    className: "row-full",
                                    onClick: onClickOfficialJSON
                                  }
                                ),
                                /* @__PURE__ */ u$5(
                                  MenuItem,
                                  {
                                    text: "JSONL (TavernAI, SillyTavern)",
                                    icon: IconCopy,
                                    className: "row-full",
                                    onClick: onClickTavern
                                  }
                                ),
                                /* @__PURE__ */ u$5(
                                  MenuItem,
                                  {
                                    text: "Ooba (text-generation-webui)",
                                    icon: IconCopy,
                                    className: "row-full",
                                    onClick: onClickOoba
                                  }
                                )
                              ] })
                            ] })
                          ]
                        }
                      ),
                      /* @__PURE__ */ u$5(
                        ExportDialog,
                        {
                          format,
                          open: exportOpen,
                          onOpenChange: setExportOpen,
                          children: /* @__PURE__ */ u$5("div", { className: "row-full", children: /* @__PURE__ */ u$5(
                            MenuItem,
                            {
                              text: t2("Export All"),
                              icon: IconZip
                            }
                          ) })
                        }
                      ),
                      !isMobile && /* @__PURE__ */ u$5(
                        Arrow2,
                        {
                          width: "16",
                          height: "8",
                          style: {
                            "fill": "var(--ce-menu-primary)",
                            "stroke": "var(--ce-border-light)",
                            "stoke-width": "2px"
                          }
                        }
                      )
                    ]
                  }
                )
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ u$5(Divider, {})
    ] });
  }
  function Menu({ container }) {
    return /* @__PURE__ */ u$5(SettingProvider, { children: /* @__PURE__ */ u$5(MenuInner, { container }) });
  }
  main();
  function main() {
    onloadSafe(() => {
      const styleEl = document.createElement("style");
      styleEl.id = "sentinel-css";
      document.head.append(styleEl);
      const injectionMap = /* @__PURE__ */ new Map();
      const injectNavMenu = (nav) => {
        if (injectionMap.has(nav)) return;
        const container = getMenuContainer();
        injectionMap.set(nav, container);
        const chatList = nav.querySelector(":scope > div.sticky.bottom-0");
        if (chatList) {
          chatList.prepend(container);
        } else {
          container.style.backgroundColor = "#171717";
          container.style.position = "sticky";
          container.style.bottom = "72px";
          nav.append(container);
        }
      };
      sentinel.on("nav", injectNavMenu);
      setInterval(() => {
        injectionMap.forEach((container, nav) => {
          if (!nav.isConnected) {
            container.remove();
            injectionMap.delete(nav);
          }
        });
        const navList = Array.from(document.querySelectorAll("nav")).filter((nav) => !injectionMap.has(nav));
        navList.forEach(injectNavMenu);
      }, 300);
      if (isSharePage()) {
        sentinel.on(`div[role="presentation"] > .w-full > div >.flex.w-full`, (target) => {
          target.prepend(getMenuContainer());
        });
      }
      let chatId = "";
      sentinel.on('[role="presentation"]', async () => {
        const currentChatId = getChatIdFromUrl();
        if (!currentChatId || currentChatId === chatId) return;
        chatId = currentChatId;
        const rawConversation = await fetchConversation(chatId, false);
        const { conversationNodes } = processConversation(rawConversation);
        const threadContents = Array.from(document.querySelectorAll('main [data-testid^="conversation-turn-"] [data-message-id]'));
        if (threadContents.length === 0) return;
        threadContents.forEach((thread, index2) => {
          var _a, _b;
          const createTime = (_b = (_a = conversationNodes[index2]) == null ? void 0 : _a.message) == null ? void 0 : _b.create_time;
          if (!createTime) return;
          const date = new Date(createTime * 1e3);
          const timestamp2 = document.createElement("time");
          timestamp2.className = "w-full text-gray-500 dark:text-gray-400 text-sm text-right";
          timestamp2.dateTime = date.toISOString();
          timestamp2.title = date.toLocaleString();
          const hour12 = document.createElement("span");
          hour12.setAttribute("data-time-format", "12");
          hour12.textContent = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
          const hour24 = document.createElement("span");
          hour24.setAttribute("data-time-format", "24");
          hour24.textContent = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
          timestamp2.append(hour12, hour24);
          thread.append(timestamp2);
        });
      });
    });
  }
  function getMenuContainer() {
    const container = document.createElement("div");
    container.style.zIndex = "99";
    G$2(/* @__PURE__ */ u$5(Menu, { container }), container);
    return container;
  }

})(JSZip, html2canvas);