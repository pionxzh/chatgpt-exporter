// ==UserScript==
// @name               ChatGPT Exporter
// @name:zh-CN         ChatGPT Exporter
// @name:zh-TW         ChatGPT Exporter
// @namespace          pionxzh
// @version            2.36.3
// @author             pionxzh
// @description        Export ChatGPT conversations with one click — backup & share effortlessly!
// @description:zh-CN  一键导出 ChatGPT 对话，轻松备份与分享
// @description:zh-TW  一鍵導出 ChatGPT 對話，輕鬆備份與分享
// @license            MIT
// @icon               https://chatgpt.com/favicon.ico
// @match              https://chat.openai.com/
// @match              https://chat.openai.com/?*
// @match              https://chat.openai.com/c/*
// @match              https://chat.openai.com/g/*
// @match              https://chat.openai.com/gpts
// @match              https://chat.openai.com/gpts/*
// @match              https://chat.openai.com/share/*
// @match              https://chat.openai.com/share/*/continue
// @match              https://chatgpt.com/
// @match              https://chatgpt.com/?*
// @match              https://chatgpt.com/c/*
// @match              https://chatgpt.com/g/*
// @match              https://chatgpt.com/gpts
// @match              https://chatgpt.com/gpts/*
// @match              https://chatgpt.com/share/*
// @match              https://chatgpt.com/share/*/continue
// @require            https://cdn.jsdelivr.net/npm/jszip@3.9.1/dist/jszip.min.js
// @require            https://cdn.jsdelivr.net/npm/@zumer/snapdom@2.24.10/dist/snapdom.js
// @grant              GM_deleteValue
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              unsafeWindow
// @run-at             document-end
// ==/UserScript==

(function(jszip, _zumer_snapdom) {
	"use strict";
	var __create$1 = Object.create;
	var __defProp$1 = Object.defineProperty;
	var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
	var __getOwnPropNames$1 = Object.getOwnPropertyNames;
	var __getProtoOf$1 = Object.getPrototypeOf;
	var __hasOwnProp$1 = Object.prototype.hasOwnProperty;
	var __copyProps$1 = (to, from, except, desc) => {
		if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames$1(from), i = 0, n = keys.length, key; i < n; i++) {
			key = keys[i];
			if (!__hasOwnProp$1.call(to, key) && key !== except) __defProp$1(to, key, {
				get: ((k) => from[k]).bind(null, key),
				enumerable: !(desc = __getOwnPropDesc$1(from, key)) || desc.enumerable
			});
		}
		return to;
	};
	var __toESM$1 = (mod, isNodeMode, target) => (target = mod != null ? __create$1(__getProtoOf$1(mod)) : {}, __copyProps$1(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp$1.call(mod, "default") ? __defProp$1(target, "default", {
		value: mod,
		enumerable: true
	}) : target, mod));
	jszip = __toESM$1(jszip);
	var s$2 = new Set();
	var _css = async (t) => {
		if (s$2.has(t)) return;
		s$2.add(t);
		((css) => {
			const o = document.createElement("style");
			o.textContent = css;
			document.head.append(o);
			setInterval(() => {
				if (o.isConnected) return;
				document.head.append(o);
			}, 300);
		})(t);
	};
	var __create = Object.create;
	var __defProp = Object.defineProperty;
	var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
	var __getOwnPropNames = Object.getOwnPropertyNames;
	var __getProtoOf = Object.getPrototypeOf;
	var __hasOwnProp = Object.prototype.hasOwnProperty;
	var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
	var __exportAll = (all, no_symbols) => {
		let target = {};
		for (var name in all) __defProp(target, name, {
			get: all[name],
			enumerable: true
		});
		if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
		return target;
	};
	var __copyProps = (to, from, except, desc) => {
		if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
			key = keys[i];
			if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
				get: ((k) => from[k]).bind(null, key),
				enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
			});
		}
		return to;
	};
	var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
		value: mod,
		enumerable: true
	}) : target, mod));
	var n;
	var l$1;
	var u$1;
	var i$1;
	var o$2;
	var r$1;
	var f$1;
	var e$1;
	var c$1 = {};
	var s$1 = [];
	var a$1 = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
	var h$1 = Array.isArray;
	function v$1(n, l) {
		for (var u in l) n[u] = l[u];
		return n;
	}
	function p$2(n) {
		var l = n.parentNode;
		l && l.removeChild(n);
	}
	function y$1(l, u, t) {
		var i, o, r, f = {};
		for (r in u) "key" == r ? i = u[r] : "ref" == r ? o = u[r] : f[r] = u[r];
		if (arguments.length > 2 && (f.children = arguments.length > 3 ? n.call(arguments, 2) : t), "function" == typeof l && null != l.defaultProps) for (r in l.defaultProps) void 0 === f[r] && (f[r] = l.defaultProps[r]);
		return d$1(l, f, i, o, null);
	}
	function d$1(n, t, i, o, r) {
		var f = {
			type: n,
			props: t,
			key: i,
			ref: o,
			__k: null,
			__: null,
			__b: 0,
			__e: null,
			__d: void 0,
			__c: null,
			__h: null,
			constructor: void 0,
			__v: null == r ? ++u$1 : r
		};
		return null == r && null != l$1.vnode && l$1.vnode(f), f;
	}
	function k$1(n) {
		return n.children;
	}
	function b$1(n, l) {
		this.props = n, this.context = l;
	}
	function g$2(n, l) {
		if (null == l) return n.__ ? g$2(n.__, n.__.__k.indexOf(n) + 1) : null;
		for (var u; l < n.__k.length; l++) if (null != (u = n.__k[l]) && null != u.__e) return u.__e;
		return "function" == typeof n.type ? g$2(n) : null;
	}
	function m$1(n) {
		var l, u;
		if (null != (n = n.__) && null != n.__c) {
			for (n.__e = n.__c.base = null, l = 0; l < n.__k.length; l++) if (null != (u = n.__k[l]) && null != u.__e) {
				n.__e = n.__c.base = u.__e;
				break;
			}
			return m$1(n);
		}
	}
	function w$2(n) {
		(!n.__d && (n.__d = !0) && i$1.push(n) && !x.__r++ || o$2 !== l$1.debounceRendering) && ((o$2 = l$1.debounceRendering) || r$1)(x);
	}
	function x() {
		var n, l, u, t, o, r, e, c, s;
		for (i$1.sort(f$1); n = i$1.shift();) n.__d && (l = i$1.length, t = void 0, o = void 0, r = void 0, c = (e = (u = n).__v).__e, (s = u.__P) && (t = [], o = [], (r = v$1({}, e)).__v = e.__v + 1, L$1(s, e, r, u.__n, void 0 !== s.ownerSVGElement, null != e.__h ? [c] : null, t, null == c ? g$2(e) : c, e.__h, o), M(t, e, o), e.__e != c && m$1(e)), i$1.length > l && i$1.sort(f$1));
		x.__r = 0;
	}
	function P$1(n, l, u, t, i, o, r, f, e, a, v) {
		var p, y, _, b, m, w, x, P, C, H = 0, I = t && t.__k || s$1, T = I.length, j = T, z = l.length;
		for (u.__k = [], p = 0; p < z; p++) null != (b = u.__k[p] = null == (b = l[p]) || "boolean" == typeof b || "function" == typeof b ? null : "string" == typeof b || "number" == typeof b || "bigint" == typeof b ? d$1(null, b, null, null, b) : h$1(b) ? d$1(k$1, { children: b }, null, null, null) : b.__b > 0 ? d$1(b.type, b.props, b.key, b.ref ? b.ref : null, b.__v) : b) ? (b.__ = u, b.__b = u.__b + 1, -1 === (P = A(b, I, x = p + H, j)) ? _ = c$1 : (_ = I[P] || c$1, I[P] = void 0, j--), L$1(n, b, _, i, o, r, f, e, a, v), m = b.__e, (y = b.ref) && _.ref != y && (_.ref && O(_.ref, null, b), v.push(y, b.__c || m, b)), null != m && (w ??= m, (C = _ === c$1 || null === _.__v) ? -1 == P && H-- : P !== x && (P === x + 1 ? H++ : P > x ? j > z - x ? H += P - x : H-- : H = P < x && P == x - 1 ? P - x : 0), x = p + H, "function" != typeof b.type || P === x && _.__k !== b.__k ? "function" == typeof b.type || P === x && !C ? void 0 !== b.__d ? (e = b.__d, b.__d = void 0) : e = m.nextSibling : e = S(n, m, e) : e = $$1(b, e, n), "function" == typeof u.type && (u.__d = e))) : (_ = I[p]) && null == _.key && _.__e && (_.__e == e && (e = g$2(_)), q$2(_, _, !1), I[p] = null);
		for (u.__e = w, p = T; p--;) null != I[p] && ("function" == typeof u.type && null != I[p].__e && I[p].__e == u.__d && (u.__d = I[p].__e.nextSibling), q$2(I[p], I[p]));
	}
	function $$1(n, l, u) {
		for (var t, i = n.__k, o = 0; i && o < i.length; o++) (t = i[o]) && (t.__ = n, l = "function" == typeof t.type ? $$1(t, l, u) : S(u, t.__e, l));
		return l;
	}
	function C$1(n, l) {
		return l = l || [], null == n || "boolean" == typeof n || (h$1(n) ? n.some(function(n) {
			C$1(n, l);
		}) : l.push(n)), l;
	}
	function S(n, l, u) {
		return null == u || u.parentNode !== n ? n.insertBefore(l, null) : l == u && null != l.parentNode || n.insertBefore(l, u), l.nextSibling;
	}
	function A(n, l, u, t) {
		var i = n.key, o = n.type, r = u - 1, f = u + 1, e = l[u];
		if (null === e || e && i == e.key && o === e.type) return u;
		if (t > (null != e ? 1 : 0)) for (; r >= 0 || f < l.length;) {
			if (r >= 0) {
				if ((e = l[r]) && i == e.key && o === e.type) return r;
				r--;
			}
			if (f < l.length) {
				if ((e = l[f]) && i == e.key && o === e.type) return f;
				f++;
			}
		}
		return -1;
	}
	function H$1(n, l, u, t, i) {
		var o;
		for (o in u) "children" === o || "key" === o || o in l || T$2(n, o, null, u[o], t);
		for (o in l) i && "function" != typeof l[o] || "children" === o || "key" === o || "value" === o || "checked" === o || u[o] === l[o] || T$2(n, o, l[o], u[o], t);
	}
	function I$1(n, l, u) {
		"-" === l[0] ? n.setProperty(l, null == u ? "" : u) : n[l] = null == u ? "" : "number" != typeof u || a$1.test(l) ? u : u + "px";
	}
	function T$2(n, l, u, t, i) {
		var o;
		n: if ("style" === l) if ("string" == typeof u) n.style.cssText = u;
		else {
			if ("string" == typeof t && (n.style.cssText = t = ""), t) for (l in t) u && l in u || I$1(n.style, l, "");
			if (u) for (l in u) t && u[l] === t[l] || I$1(n.style, l, u[l]);
		}
		else if ("o" === l[0] && "n" === l[1]) o = l !== (l = l.replace(/(PointerCapture)$|Capture$/, "$1")), l = l.toLowerCase() in n ? l.toLowerCase().slice(2) : l.slice(2), n.l || (n.l = {}), n.l[l + o] = u, u ? t || n.addEventListener(l, o ? z$2 : j$2, o) : n.removeEventListener(l, o ? z$2 : j$2, o);
		else if ("dangerouslySetInnerHTML" !== l) {
			if (i) l = l.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
			else if ("width" !== l && "height" !== l && "href" !== l && "list" !== l && "form" !== l && "tabIndex" !== l && "download" !== l && "rowSpan" !== l && "colSpan" !== l && l in n) try {
				n[l] = null == u ? "" : u;
				break n;
			} catch (n) {}
			"function" == typeof u || (null == u || !1 === u && "-" !== l[4] ? n.removeAttribute(l) : n.setAttribute(l, u));
		}
	}
	function j$2(n) {
		return this.l[n.type + !1](l$1.event ? l$1.event(n) : n);
	}
	function z$2(n) {
		return this.l[n.type + !0](l$1.event ? l$1.event(n) : n);
	}
	function L$1(n, u, t, i, o, r, f, e, c, s) {
		var a, p, y, d, _, g, m, w, x, $, C, S, A, H, I, T = u.type;
		if (void 0 !== u.constructor) return null;
		null != t.__h && (c = t.__h, e = u.__e = t.__e, u.__h = null, r = [e]), (a = l$1.__b) && a(u);
		n: if ("function" == typeof T) try {
			if (w = u.props, x = (a = T.contextType) && i[a.__c], $ = a ? x ? x.props.value : a.__ : i, t.__c ? m = (p = u.__c = t.__c).__ = p.__E : ("prototype" in T && T.prototype.render ? u.__c = p = new T(w, $) : (u.__c = p = new b$1(w, $), p.constructor = T, p.render = B$2), x && x.sub(p), p.props = w, p.state || (p.state = {}), p.context = $, p.__n = i, y = p.__d = !0, p.__h = [], p._sb = []), p.__s ?? (p.__s = p.state), null != T.getDerivedStateFromProps && (p.__s == p.state && (p.__s = v$1({}, p.__s)), v$1(p.__s, T.getDerivedStateFromProps(w, p.__s))), d = p.props, _ = p.state, p.__v = u, y) null == T.getDerivedStateFromProps && null != p.componentWillMount && p.componentWillMount(), null != p.componentDidMount && p.__h.push(p.componentDidMount);
			else {
				if (null == T.getDerivedStateFromProps && w !== d && null != p.componentWillReceiveProps && p.componentWillReceiveProps(w, $), !p.__e && (null != p.shouldComponentUpdate && !1 === p.shouldComponentUpdate(w, p.__s, $) || u.__v === t.__v)) {
					for (u.__v !== t.__v && (p.props = w, p.state = p.__s, p.__d = !1), u.__e = t.__e, u.__k = t.__k, u.__k.forEach(function(n) {
						n && (n.__ = u);
					}), C = 0; C < p._sb.length; C++) p.__h.push(p._sb[C]);
					p._sb = [], p.__h.length && f.push(p);
					break n;
				}
				null != p.componentWillUpdate && p.componentWillUpdate(w, p.__s, $), null != p.componentDidUpdate && p.__h.push(function() {
					p.componentDidUpdate(d, _, g);
				});
			}
			if (p.context = $, p.props = w, p.__P = n, p.__e = !1, S = l$1.__r, A = 0, "prototype" in T && T.prototype.render) {
				for (p.state = p.__s, p.__d = !1, S && S(u), a = p.render(p.props, p.state, p.context), H = 0; H < p._sb.length; H++) p.__h.push(p._sb[H]);
				p._sb = [];
			} else do
				p.__d = !1, S && S(u), a = p.render(p.props, p.state, p.context), p.state = p.__s;
			while (p.__d && ++A < 25);
			p.state = p.__s, null != p.getChildContext && (i = v$1(v$1({}, i), p.getChildContext())), y || null == p.getSnapshotBeforeUpdate || (g = p.getSnapshotBeforeUpdate(d, _)), P$1(n, h$1(I = null != a && a.type === k$1 && null == a.key ? a.props.children : a) ? I : [I], u, t, i, o, r, f, e, c, s), p.base = u.__e, u.__h = null, p.__h.length && f.push(p), m && (p.__E = p.__ = null);
		} catch (n) {
			u.__v = null, (c || null != r) && (u.__e = e, u.__h = !!c, r[r.indexOf(e)] = null), l$1.__e(n, u, t);
		}
		else null == r && u.__v === t.__v ? (u.__k = t.__k, u.__e = t.__e) : u.__e = N$1(t.__e, u, t, i, o, r, f, c, s);
		(a = l$1.diffed) && a(u);
	}
	function M(n, u, t) {
		for (var i = 0; i < t.length; i++) O(t[i], t[++i], t[++i]);
		l$1.__c && l$1.__c(u, n), n.some(function(u) {
			try {
				n = u.__h, u.__h = [], n.some(function(n) {
					n.call(u);
				});
			} catch (n) {
				l$1.__e(n, u.__v);
			}
		});
	}
	function N$1(l, u, t, i, o, r, f, e, s) {
		var a, v, y, d = t.props, _ = u.props, k = u.type, b = 0;
		if ("svg" === k && (o = !0), null != r) {
			for (; b < r.length; b++) if ((a = r[b]) && "setAttribute" in a == !!k && (k ? a.localName === k : 3 === a.nodeType)) {
				l = a, r[b] = null;
				break;
			}
		}
		if (null == l) {
			if (null === k) return document.createTextNode(_);
			l = o ? document.createElementNS("http://www.w3.org/2000/svg", k) : document.createElement(k, _.is && _), r = null, e = !1;
		}
		if (null === k) d === _ || e && l.data === _ || (l.data = _);
		else {
			if (r = r && n.call(l.childNodes), v = (d = t.props || c$1).dangerouslySetInnerHTML, y = _.dangerouslySetInnerHTML, !e) {
				if (null != r) for (d = {}, b = 0; b < l.attributes.length; b++) d[l.attributes[b].name] = l.attributes[b].value;
				(y || v) && (y && (v && y.__html == v.__html || y.__html === l.innerHTML) || (l.innerHTML = y && y.__html || ""));
			}
			if (H$1(l, _, d, o, e), y) u.__k = [];
			else if (P$1(l, h$1(b = u.props.children) ? b : [b], u, t, i, o && "foreignObject" !== k, r, f, r ? r[0] : t.__k && g$2(t, 0), e, s), null != r) for (b = r.length; b--;) null != r[b] && p$2(r[b]);
			e || ("value" in _ && void 0 !== (b = _.value) && (b !== l.value || "progress" === k && !b || "option" === k && b !== d.value) && T$2(l, "value", b, d.value, !1), "checked" in _ && void 0 !== (b = _.checked) && b !== l.checked && T$2(l, "checked", b, d.checked, !1));
		}
		return l;
	}
	function O(n, u, t) {
		try {
			"function" == typeof n ? n(u) : n.current = u;
		} catch (n) {
			l$1.__e(n, t);
		}
	}
	function q$2(n, u, t) {
		var i, o;
		if (l$1.unmount && l$1.unmount(n), (i = n.ref) && (i.current && i.current !== n.__e || O(i, null, u)), null != (i = n.__c)) {
			if (i.componentWillUnmount) try {
				i.componentWillUnmount();
			} catch (n) {
				l$1.__e(n, u);
			}
			i.base = i.__P = null, n.__c = void 0;
		}
		if (i = n.__k) for (o = 0; o < i.length; o++) i[o] && q$2(i[o], u, t || "function" != typeof n.type);
		t || null == n.__e || p$2(n.__e), n.__ = n.__e = n.__d = void 0;
	}
	function B$2(n, l, u) {
		return this.constructor(n, u);
	}
	function D$1(u, t, i) {
		var o, r, f, e;
		l$1.__ && l$1.__(u, t), r = (o = "function" == typeof i) ? null : i && i.__k || t.__k, f = [], e = [], L$1(t, u = (!o && i || t).__k = y$1(k$1, null, [u]), r || c$1, c$1, void 0 !== t.ownerSVGElement, !o && i ? [i] : r ? null : t.firstChild ? n.call(t.childNodes) : null, f, !o && i ? i : r ? r.__e : t.firstChild, o, e), M(f, u, e);
	}
	function G(n, l) {
		var u = {
			__c: l = "__cC" + e$1++,
			__: n,
			Consumer: function(n, l) {
				return n.children(l);
			},
			Provider: function(n) {
				var u, t;
				return this.getChildContext || (u = [], (t = {})[l] = this, this.getChildContext = function() {
					return t;
				}, this.shouldComponentUpdate = function(n) {
					this.props.value !== n.value && u.some(function(n) {
						n.__e = !0, w$2(n);
					});
				}, this.sub = function(n) {
					u.push(n);
					var l = n.componentWillUnmount;
					n.componentWillUnmount = function() {
						u.splice(u.indexOf(n), 1), l && l.call(n);
					};
				}), n.children;
			}
		};
		return u.Provider.__ = u.Consumer.contextType = u;
	}
	n = s$1.slice, l$1 = { __e: function(n, l, u, t) {
		for (var i, o, r; l = l.__;) if ((i = l.__c) && !i.__) try {
			if ((o = i.constructor) && null != o.getDerivedStateFromError && (i.setState(o.getDerivedStateFromError(n)), r = i.__d), null != i.componentDidCatch && (i.componentDidCatch(n, t || {}), r = i.__d), r) return i.__E = i;
		} catch (l) {
			n = l;
		}
		throw n;
	} }, u$1 = 0, b$1.prototype.setState = function(n, l) {
		var u = null != this.__s && this.__s !== this.state ? this.__s : this.__s = v$1({}, this.state);
		"function" == typeof n && (n = n(v$1({}, u), this.props)), n && v$1(u, n), null != n && this.__v && (l && this._sb.push(l), w$2(this));
	}, b$1.prototype.forceUpdate = function(n) {
		this.__v && (this.__e = !0, n && this.__h.push(n), w$2(this));
	}, b$1.prototype.render = k$1, i$1 = [], r$1 = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, f$1 = function(n, l) {
		return n.__v.__b - l.__v.__b;
	}, x.__r = 0, e$1 = 0;
	var require_sentinel_umd = __commonJSMin(((exports, module) => {
		(function(root, factory) {
			if (typeof define === "function" && define.amd) define([], factory);
			else if (typeof exports === "object") module.exports = factory();
			else root.sentinel = factory();
		})(exports, function() {
			var isArray = Array.isArray, selectorToAnimationMap = {}, animationCallbacks = {}, styleEl, styleSheet, cssRules;
			return {
				on: function(cssSelectors, callback) {
					if (!callback) return;
					if (!styleEl) {
						var doc = document, head = doc.head;
						doc.addEventListener("animationstart", function(ev, callbacks, l, i) {
							callbacks = animationCallbacks[ev.animationName];
							if (!callbacks) return;
							ev.stopImmediatePropagation();
							l = callbacks.length;
							for (i = 0; i < l; i++) callbacks[i](ev.target);
						}, true);
						styleEl = doc.getElementById("sentinel-css");
						if (!styleEl) {
							styleEl = doc.createElement("style");
							head.insertBefore(styleEl, head.firstChild);
						}
						styleSheet = styleEl.sheet;
						cssRules = styleSheet.cssRules;
					}
					(isArray(cssSelectors) ? cssSelectors : [cssSelectors]).map(function(selector, animId, isCustomName) {
						animId = selectorToAnimationMap[selector];
						if (!animId) {
							isCustomName = selector[0] == "!";
							selectorToAnimationMap[selector] = animId = isCustomName ? selector.slice(1) : "sentinel-" + Math.random().toString(16).slice(2);
							cssRules[styleSheet.insertRule("@keyframes " + animId + "{from{transform:none;}to{transform:none;}}", cssRules.length)]._id = selector;
							if (!isCustomName) cssRules[styleSheet.insertRule(selector + "{animation-duration:0.0001s;animation-name:" + animId + ";}", cssRules.length)]._id = selector;
							selectorToAnimationMap[selector] = animId;
						}
						(animationCallbacks[animId] = animationCallbacks[animId] || []).push(callback);
					});
				},
				off: function(cssSelectors, callback) {
					(isArray(cssSelectors) ? cssSelectors : [cssSelectors]).map(function(selector, animId, callbackList, i) {
						if (!(animId = selectorToAnimationMap[selector])) return;
						callbackList = animationCallbacks[animId];
						if (callback) {
							i = callbackList.length;
							while (i--) if (callbackList[i] === callback) callbackList.splice(i, 1);
						} else callbackList = [];
						if (callbackList.length) return;
						i = cssRules.length;
						while (i--) if (cssRules[i]._id == selector) styleSheet.deleteRule(i);
						delete selectorToAnimationMap[selector];
						delete animationCallbacks[animId];
					});
				},
				reset: function() {
					selectorToAnimationMap = {};
					animationCallbacks = {};
					if (styleEl) styleEl.parentNode.removeChild(styleEl);
					styleEl = 0;
				}
			};
		});
	}));
	var require_dist = __commonJSMin(((exports) => {
		var __assign = exports && exports.__assign || function() {
			__assign = Object.assign || function(t) {
				for (var s, i = 1, n = arguments.length; i < n; i++) {
					s = arguments[i];
					for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
				}
				return t;
			};
			return __assign.apply(this, arguments);
		};
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.join = exports.subst = exports.query = void 0;
		function urlcat(baseUrlOrTemplate, pathTemplateOrParams, maybeParams) {
			if (maybeParams === void 0) maybeParams = {};
			if (typeof pathTemplateOrParams === "string") {
				var baseUrl = baseUrlOrTemplate;
				var pathTemplate = pathTemplateOrParams;
				var params = maybeParams;
				return urlcatImpl(pathTemplate, params, baseUrl);
			} else {
				var baseTemplate = baseUrlOrTemplate;
				var params = pathTemplateOrParams;
				return urlcatImpl(baseTemplate, params);
			}
		}
		exports.default = urlcat;
		function urlcatImpl(pathTemplate, params, baseUrl) {
			var _a = path(pathTemplate, params), renderedPath = _a.renderedPath, remainingParams = _a.remainingParams;
			var pathAndQuery = join(renderedPath, "?", query(removeNullOrUndef(remainingParams)));
			return baseUrl ? join(baseUrl, "/", pathAndQuery) : pathAndQuery;
		}
		function query(params) {
			return new URLSearchParams(params).toString();
		}
		exports.query = query;
		function subst(template, params) {
			return path(template, params).renderedPath;
		}
		exports.subst = subst;
		function path(template, params) {
			var remainingParams = __assign({}, params);
			var allowedTypes = [
				"boolean",
				"string",
				"number"
			];
			return {
				renderedPath: template.replace(/:\w+/g, function(p) {
					var key = p.slice(1);
					if (/^\d+$/.test(key)) return p;
					if (!params.hasOwnProperty(key)) throw new Error("Missing value for path parameter " + key + ".");
					if (!allowedTypes.includes(typeof params[key])) throw new TypeError("Path parameter " + key + " cannot be of type " + typeof params[key] + ". " + ("Allowed types are: " + allowedTypes.join(", ") + "."));
					if (typeof params[key] === "string" && params[key].trim() === "") throw new Error("Path parameter " + key + " cannot be an empty string.");
					delete remainingParams[key];
					return encodeURIComponent(params[key]);
				}),
				remainingParams
			};
		}
		function join(part1, separator, part2) {
			var p1 = part1.endsWith(separator) ? part1.slice(0, -separator.length) : part1;
			var p2 = part2.startsWith(separator) ? part2.slice(separator.length) : part2;
			return p1 === "" || p2 === "" ? p1 + p2 : p1 + separator + p2;
		}
		exports.join = join;
		function removeNullOrUndef(params) {
			return Object.keys(params).filter(function(k) {
				return notNullOrUndefined(params[k]);
			}).reduce(function(result, k) {
				result[k] = params[k];
				return result;
			}, {});
		}
		function notNullOrUndefined(v) {
			return v !== void 0 && v !== null;
		}
	}));
	var import_sentinel_umd = __toESM(require_sentinel_umd(), 1);
	var import_dist = __toESM(require_dist(), 1);
	var API_MAPPING = {
		"https://chat.openai.com": "https://chat.openai.com/backend-api",
		"https://chatgpt.com": "https://chatgpt.com/backend-api"
	};
	var baseUrl = new URL(location.href).origin;
	var apiUrl = API_MAPPING[baseUrl];
	var KEY_LANGUAGE = "exporter:language";
	var KEY_FILENAME_FORMAT = "exporter:filename_format";
	var KEY_TIMESTAMP_ENABLED = "exporter:enable_timestamp";
	var KEY_TIMESTAMP_24H = "exporter:timestamp_24h";
	var KEY_TIMESTAMP_MARKDOWN = "exporter:timestamp_markdown";
	var KEY_TIMESTAMP_HTML = "exporter:timestamp_html";
	var KEY_META_ENABLED = "exporter:enable_meta";
	var KEY_META_LIST = "exporter:meta_list";
	var KEY_THINKING_ENABLED = "exporter:enable_thinking";
	var KEY_SOURCES_ENABLED = "exporter:enable_sources";
	var KEY_EXPORT_ALL_LIMIT = "exporter:export_all_limit";
	var KEY_EXPORTED_UPDATE_TIMES = "exporter:exported_update_times";
	var _GM_deleteValue = (() => typeof GM_deleteValue != "undefined" ? GM_deleteValue : void 0)();
	var _GM_getValue = (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
	var _GM_setValue = (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
	var _unsafeWindow = (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
	function getBase64FromImg(el) {
		const canvas = document.createElement("canvas");
		canvas.width = el.naturalWidth;
		canvas.height = el.naturalHeight;
		const ctx = canvas.getContext("2d");
		if (!ctx) return "";
		ctx.drawImage(el, 0, 0);
		return canvas.toDataURL("image/png");
	}
	function blobToDataURL(blob) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onerror = reject;
			reader.onload = () => resolve(reader.result);
			reader.readAsDataURL(blob);
		});
	}
	function getChatIdFromUrl() {
		const match = location.pathname.match(/^\/(?:share(?:\/[a-z]+)?|c|g\/[a-z0-9-]+\/c)\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i);
		if (match) return match[1];
		return null;
	}
	function isTemporaryChat() {
		return new URLSearchParams(location.search).get("temporary-chat") === "true";
	}
	function isSharePage() {
		return location.pathname.startsWith("/share") && !location.pathname.endsWith("/continue");
	}
	function getConversationFromSharePage() {
		if (_unsafeWindow.__reactRouterContext?.state?.loaderData?.["routes/share.$shareId.($action)"]?.serverResponse?.data) return JSON.parse(JSON.stringify(_unsafeWindow.__reactRouterContext.state.loaderData["routes/share.$shareId.($action)"].serverResponse.data));
		return null;
	}
	var defaultAvatar = "data:image/svg+xml,%3Csvg%20stroke%3D%22currentColor%22%20fill%3D%22none%22%20stroke-width%3D%221.5%22%20viewBox%3D%22-6%20-6%2036%2036%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20style%3D%22color%3A%20white%3B%20background%3A%20%23ab68ff%3B%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M20%2021v-2a4%204%200%200%200-4-4H8a4%204%200%200%200-4%204v2%22%3E%3C%2Fpath%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%227%22%20r%3D%224%22%3E%3C%2Fcircle%3E%3C%2Fsvg%3E";
	async function getUserAvatar() {
		try {
			const avatar = Array.from(document.querySelectorAll("img[alt]:not([aria-hidden])")).find((avatar) => avatar.src.startsWith("https://cdn.auth0.com/avatars/"));
			if (avatar) return getBase64FromImg(avatar);
		} catch (e) {
			console.error(e);
		}
		return defaultAvatar;
	}
	function checkIfConversationStarted() {
		return !!document.querySelector(["[data-testid^=\"conversation-turn-\"]", "[data-chatgpt-conversation-selection-target] [data-chatgpt-search-message-ids]"].join(", "));
	}
	function isCompleteConversation(conversation) {
		return !!conversation?.mapping && !!conversation.current_node;
	}
	async function loadShareConversation(embedded, fetchFallback) {
		const conversation = isCompleteConversation(embedded) ? embedded : await fetchFallback();
		if (!isCompleteConversation(conversation)) throw new Error("Failed to load shared conversation data.");
		return conversation;
	}
	var CONVERSATION_STREAM_PATH = "/backend-api/f/conversation";
	var DATA_PREFIX = "data:";
	var MAX_SCAN_LENGTH = 2e5;
	var temporaryChatId = null;
	function getTemporaryChatId() {
		return temporaryChatId;
	}
	function checkIfTemporaryChatIsExportable() {
		return !isTemporaryChat() || temporaryChatId !== null;
	}
	function watchTemporaryChatId() {
		const originalFetch = _unsafeWindow.fetch;
		const logObserverError = (error) => {
			console.error("[Exporter] Failed to observe the temporary chat response", error);
		};
		const observeResponse = (response) => {
			try {
				if (!response.body) return;
				readConversationId(response.clone()).catch(logObserverError);
			} catch (error) {
				logObserverError(error);
			}
		};
		const ignoreFetchFailure = () => {};
		const canExportToPage = typeof exportFunction === "function";
		const pageResponseObserver = canExportToPage ? exportFunction(observeResponse, _unsafeWindow) : observeResponse;
		const pageFetchFailureHandler = canExportToPage ? exportFunction(ignoreFetchFailure, _unsafeWindow) : ignoreFetchFailure;
		const patchedFetch = (input, init) => {
			const response = originalFetch.call(_unsafeWindow, input, init);
			if (isTemporaryChat()) try {
				if ((typeof input === "string" ? input : input instanceof URL ? input.href : input.url).includes(CONVERSATION_STREAM_PATH)) response.then(pageResponseObserver, pageFetchFailureHandler);
			} catch (error) {
				logObserverError(error);
			}
			return response;
		};
		_unsafeWindow.fetch = typeof exportFunction === "function" ? exportFunction(patchedFetch, _unsafeWindow) : patchedFetch;
	}
	async function readConversationId(response) {
		const reader = response.body?.getReader();
		if (!reader) return;
		const decoder = new TextDecoder();
		let buffer = "";
		let scanned = 0;
		try {
			while (scanned < MAX_SCAN_LENGTH) {
				const { done, value } = await reader.read();
				if (done) break;
				const chunk = decoder.decode(value, { stream: true });
				scanned += chunk.length;
				buffer += chunk;
				const lines = buffer.split("\n");
				buffer = lines.pop() ?? "";
				const conversationId = findConversationId(lines);
				if (conversationId) {
					temporaryChatId = conversationId;
					break;
				}
			}
		} catch (error) {
			console.error("[Exporter] Failed to read the temporary chat id", error);
		} finally {
			reader.cancel().catch(() => {});
		}
	}
	function findConversationId(lines) {
		for (const line of lines) {
			if (!line.startsWith(DATA_PREFIX)) continue;
			const payload = line.slice(5).trim();
			if (!payload || payload === "[DONE]") continue;
			try {
				const { conversation_id: conversationId } = JSON.parse(payload);
				if (typeof conversationId === "string") return conversationId;
			} catch {}
		}
		return null;
	}
	var DB_NAME = "chatgpt-exporter";
	var STORE_NAME = "images";
	var EXPIRY_MS = 2592e6;
	var dbPromise = null;
	function promisify(request) {
		return new Promise((resolve, reject) => {
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	}
	function openDb() {
		dbPromise ??= new Promise((resolve) => {
			const request = indexedDB.open(DB_NAME, 1);
			request.onupgradeneeded = () => {
				request.result.createObjectStore(STORE_NAME).createIndex("savedAt", "savedAt");
			};
			request.onsuccess = () => {
				pruneExpired(request.result);
				resolve(request.result);
			};
			request.onerror = () => resolve(null);
		}).catch(() => null);
		return dbPromise;
	}
	function pruneExpired(db) {
		try {
			const cursorRequest = db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).index("savedAt").openCursor(IDBKeyRange.upperBound(Date.now() - EXPIRY_MS));
			cursorRequest.onsuccess = () => {
				const cursor = cursorRequest.result;
				if (!cursor) return;
				cursor.delete();
				cursor.continue();
			};
		} catch (error) {
			console.warn("[Exporter] Failed to prune image cache", error);
		}
	}
	async function getCachedImage(pointer) {
		try {
			const db = await openDb();
			if (!db) return null;
			const entry = await promisify(db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(pointer));
			if (!entry || Date.now() - entry.savedAt > EXPIRY_MS) return null;
			return entry.dataUrl;
		} catch {
			return null;
		}
	}
	async function setCachedImage(pointer, dataUrl) {
		try {
			const db = await openDb();
			if (!db) return;
			const entry = {
				dataUrl,
				savedAt: Date.now()
			};
			await promisify(db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).put(entry, pointer));
		} catch (error) {
			console.warn("[Exporter] Failed to cache image", error);
		}
	}
	var generateKey = (args) => JSON.stringify(args);
	function memorize(fn) {
		const cache = new Map();
		const memorized = (...args) => {
			const key = generateKey(args);
			if (cache.has(key)) return cache.get(key);
			const result = fn(...args);
			cache.set(key, result);
			return result;
		};
		return memorized;
	}
	var aliases = [["text-davinci-002", "GPT-3.5"], ["gpt-4-browsing", "GPT-4 (Browser)"]];
	function getModelName(slug) {
		const alias = aliases.find(([prefix]) => slug.startsWith(prefix));
		if (alias) return alias[1];
		const gpt = /^gpt-(\d+)(o)?(?:-(\d)(?=-|$))?/.exec(slug);
		if (gpt) {
			const [, major, omni = "", minor] = gpt;
			return `GPT-${major}${minor ? `.${minor}` : ""}${omni}`;
		}
		const reasoning = /^o\d+/.exec(slug);
		if (reasoning) return reasoning[0];
		return "";
	}
	var urlcat = typeof import_dist.default === "function" ? import_dist.default : import_dist.default.default;
	var sessionApi = urlcat(baseUrl, "/api/auth/session");
	var conversationApi = (id) => urlcat(apiUrl, "/conversation/:id", { id });
	var shareConversationApi = (id) => urlcat(apiUrl, "/share/:id", { id });
	var conversationsApi = (offset, limit) => urlcat(apiUrl, "/conversations", {
		offset,
		limit
	});
	var fileDownloadApi = (id) => urlcat(apiUrl, "/files/download/:id", {
		id,
		post_id: "",
		inline: false
	});
	var projectsApi = (cursor) => urlcat(apiUrl, "/gizmos/snorlax/sidebar", {
		conversations_per_gizmo: 0,
		cursor
	});
	var projectConversationsApi = (gizmo, cursor, limit) => urlcat(apiUrl, "/gizmos/:gizmo/conversations", {
		gizmo,
		cursor,
		limit
	});
	var accountsCheckApi = urlcat(apiUrl, "/accounts/check/v4-2023-04-27");
	async function getCurrentChatId() {
		if (isSharePage()) {
			const shareId = getChatIdFromUrl();
			if (!shareId) throw new Error("No share id found.");
			return `__share__${shareId}`;
		}
		if (isTemporaryChat()) {
			const temporaryChatId = getTemporaryChatId();
			if (!temporaryChatId) throw new Error("No temporary chat id found.");
			return temporaryChatId;
		}
		const chatId = getChatIdFromUrl();
		if (chatId) return chatId;
		const conversations = await fetchConversations();
		if (conversations && conversations.items.length > 0) return conversations.items[0].id;
		throw new Error("No chat id found.");
	}
	async function fetchImageFromPointer(uri) {
		const cached = await getCachedImage(uri);
		if (cached) return cached;
		const imageDetails = await fetchApi(fileDownloadApi(uri.replace("sediment://", "")));
		if (imageDetails.status === "error") {
			console.error("Failed to fetch image asset", imageDetails.error_code, imageDetails.error_message);
			return null;
		}
		const image = await fetch(imageDetails.download_url);
		const dataUrl = (await blobToDataURL(await image.blob())).replace(/^data:.*?;/, `data:${image.headers.get("content-type")};`);
		await setCachedImage(uri, dataUrl);
		return dataUrl;
	}
	async function withImageAssets(conversation) {
		const copy = structuredClone(conversation);
		await replaceImageAssets(copy);
		return copy;
	}
	async function replaceImageAssets(conversation) {
		const isMultiModalInputImage = (part) => {
			return typeof part === "object" && part !== null && "content_type" in part && part.content_type === "image_asset_pointer" && "asset_pointer" in part && typeof part.asset_pointer === "string" && part.asset_pointer.startsWith("sediment://");
		};
		const imageAssets = Object.values(conversation.mapping).flatMap((node) => {
			if (!node.message) return [];
			if (node.message.content.content_type !== "multimodal_text") return [];
			return (Array.isArray(node.message.content.parts) ? node.message.content.parts : []).filter(isMultiModalInputImage);
		});
		const executionOutputs = Object.values(conversation.mapping).flatMap((node) => {
			if (!node.message) return [];
			if (node.message.content.content_type !== "execution_output") return [];
			if (!node.message.metadata?.aggregate_result?.messages) return [];
			return node.message.metadata.aggregate_result.messages.filter((msg) => msg.message_type === "image");
		});
		await Promise.all([...imageAssets.map(async (asset) => {
			try {
				const newAssetPointer = await fetchImageFromPointer(asset.asset_pointer);
				if (newAssetPointer) asset.asset_pointer = newAssetPointer;
			} catch (error) {
				console.error("Failed to fetch image asset", error);
			}
		}), ...executionOutputs.map(async (msg) => {
			try {
				const newImageUrl = await fetchImageFromPointer(msg.image_url);
				if (newImageUrl) msg.image_url = newImageUrl;
			} catch (error) {
				console.error("Failed to fetch image asset", error);
			}
		})]);
	}
	async function fetchConversation(chatId) {
		if (chatId.startsWith("__share__")) {
			const id = chatId.replace("__share__", "");
			return {
				id,
				...await loadShareConversation(getConversationFromSharePage(), () => fetchApi(shareConversationApi(id)))
			};
		}
		return {
			id: chatId,
			...await fetchApi(conversationApi(chatId))
		};
	}
	async function fetchProjects() {
		let cursor = null;
		const allItems = [];
		while (true) {
			const { items, cursor: nextCursor = null } = await fetchApi(projectsApi(cursor));
			cursor = nextCursor;
			allItems.push(...items);
			if (nextCursor === null) break;
		}
		return allItems.map((gizmo) => gizmo.gizmo.gizmo);
	}
	async function fetchConversations(offset = 0, limit = 20, project = null) {
		if (project) return fetchProjectConversations(project, offset, limit);
		return fetchApi(conversationsApi(offset, limit));
	}
	async function fetchProjectConversations(project, cursor = 0, limit = 20) {
		const { items, cursor: nextCursor } = await fetchApi(projectConversationsApi(project, cursor, limit));
		return {
			has_missing_conversations: false,
			items,
			limit,
			offset: typeof cursor === "number" ? cursor : 0,
			total: null,
			cursor: nextCursor ?? null
		};
	}
	async function fetchConversationsPage(project, offset, limit) {
		return fetchConversations(offset, limit, project);
	}
	async function fetchAllConversations(project = null, maxConversations = 1e3, onBatch, onHasMore, onError) {
		const conversations = [];
		const limit = project === null ? 100 : 50;
		let offset = 0;
		let cursor = 0;
		while (true) try {
			const result = project === null ? await fetchConversations(offset, limit) : await fetchProjectConversations(project, cursor, limit);
			if (!result.items) {
				console.warn("fetchAllConversations received no items at offset:", offset);
				break;
			}
			conversations.push(...result.items);
			if (result.items.length === 0) break;
			onBatch?.(result.items);
			if (result.total == null && result.cursor == null) break;
			if (result.total !== null && offset + limit >= result.total) break;
			if (conversations.length >= maxConversations) break;
			if (result.cursor != null) cursor = result.cursor;
			else offset += limit;
		} catch (error) {
			console.error("Error fetching conversations batch:", error);
			onError?.(error);
			break;
		}
		const result = conversations.slice(0, maxConversations);
		onHasMore?.(result.length >= maxConversations);
		return result;
	}
	async function archiveConversation(chatId) {
		const { success } = await fetchApi(conversationApi(chatId), {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ is_archived: true })
		});
		return success;
	}
	async function deleteConversation(chatId) {
		const { success } = await fetchApi(conversationApi(chatId), {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ is_visible: false })
		});
		return success;
	}
	var RateLimitError = class extends Error {
		retryAfterMs;
		retryAfterFromServer;
		constructor(retryAfterHeader) {
			super("Too Many Requests (429)");
			this.name = "RateLimitError";
			const secs = retryAfterHeader != null ? Number.parseInt(retryAfterHeader, 10) : NaN;
			this.retryAfterFromServer = Number.isFinite(secs) && secs > 0;
			this.retryAfterMs = this.retryAfterFromServer ? secs * 1e3 : 3e4;
		}
	};
	var RATE_LIMIT_HEADERS = [
		"retry-after",
		"x-ratelimit-limit-requests",
		"x-ratelimit-remaining-requests",
		"x-ratelimit-reset-requests",
		"x-ratelimit-limit-tokens",
		"x-ratelimit-remaining-tokens",
		"x-ratelimit-reset-tokens"
	];
	function logRateLimitHeaders(response) {
		const found = {};
		for (const h of RATE_LIMIT_HEADERS) {
			const val = response.headers.get(h);
			if (val != null) found[h] = val;
		}
		if (Object.keys(found).length > 0) console.info("[Exporter] Rate-limit headers:", found);
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
				...options?.headers
			}
		});
		logRateLimitHeaders(response);
		if (!response.ok) {
			if (response.status === 429) throw new RateLimitError(response.headers.get("Retry-After"));
			throw new Error(response.statusText);
		}
		return response.json();
	}
	async function probeApi() {
		const accessToken = await getAccessToken();
		const accountId = await getTeamAccountId();
		const url = conversationsApi(0, 1);
		const response = await fetch(url, { headers: {
			"Authorization": `Bearer ${accessToken}`,
			"X-Authorization": `Bearer ${accessToken}`,
			...accountId ? { "Chatgpt-Account-Id": accountId } : {}
		} });
		const rateLimitHeaders = {};
		for (const h of RATE_LIMIT_HEADERS) {
			const val = response.headers.get(h);
			if (val != null) rateLimitHeaders[h] = val;
		}
		if (!response.ok) {
			if (response.status === 429) {
				const secs = response.headers.get("retry-after");
				return {
					ok: false,
					retryAfterMs: secs ? Number.parseInt(secs, 10) * 1e3 : 6e4,
					rateLimitHeaders
				};
			}
			return {
				ok: false,
				rateLimitHeaders
			};
		}
		return {
			ok: true,
			rateLimitHeaders
		};
	}
	async function _fetchSession() {
		const response = await fetch(sessionApi);
		if (!response.ok) throw new Error(response.statusText);
		return response.json();
	}
	var fetchSession = memorize(_fetchSession);
	async function getAccessToken() {
		return (await fetchSession()).accessToken;
	}
	async function _fetchAccountsCheck() {
		const accessToken = await getAccessToken();
		const response = await fetch(accountsCheckApi, { headers: {
			"Authorization": `Bearer ${accessToken}`,
			"X-Authorization": `Bearer ${accessToken}`
		} });
		if (!response.ok) throw new Error(response.statusText);
		return response.json();
	}
	var fetchAccountsCheck = memorize(_fetchAccountsCheck);
	var getCookie = (key) => document.cookie.match(`(^|;)\\s*${key}\\s*=\\s*([^;]+)`)?.pop() || "";
	async function getTeamAccountId() {
		const accountsCheck = await fetchAccountsCheck();
		const workspaceId = getCookie("_account");
		if (workspaceId) {
			const account = accountsCheck.accounts[workspaceId];
			if (account) return account.account.account_id;
		}
		return null;
	}
	function getFileAttachmentNames(message) {
		return (message.metadata?.attachments ?? []).filter((attachment) => attachment.name && !attachment.mime_type?.startsWith("image/")).map((attachment) => attachment.name);
	}
	function shouldSkipMessageInExport(message) {
		if (!message || !message.content) return true;
		if (message.recipient !== "all") return true;
		if (message.content.content_type === "thoughts") return true;
		if (message.content.content_type === "reasoning_recap") return true;
		if (message.metadata?.is_visually_hidden_from_conversation) return true;
		if (message.metadata?.is_thinking_preamble_message) return true;
		if (message.author.role === "assistant" && message.content.content_type === "text" && !message.content.parts.join("").trim()) return true;
		if (message.author.role === "tool") {
			if (message.author.name === "file_search") return true;
			const hasExecutionImages = message.content.content_type === "execution_output" && !!message.metadata?.aggregate_result?.messages?.some((msg) => msg.message_type === "image");
			const hasMultimodalImage = message.content.content_type === "multimodal_text" && message.content.parts.some((part) => {
				return typeof part !== "string" && part.content_type === "image_asset_pointer";
			});
			if (!hasExecutionImages && !hasMultimodalImage) return true;
		}
		return false;
	}
	function processConversation(conversation, options) {
		const title = conversation.title || "ChatGPT Conversation";
		const createTime = conversation.create_time;
		const updateTime = conversation.update_time;
		const startNodeId = conversation.current_node || Object.values(conversation.mapping).find((node) => !node.children || node.children.length === 0)?.id;
		if (!startNodeId) throw new Error("Failed to find start node.");
		const conversationNodes = extractConversationResult(conversation.mapping, startNodeId);
		const { model, modelSlug } = extractModel(conversation.mapping, conversationNodes);
		const mergedConversationNodes = mergeContinuationNodes(conversationNodes);
		if (options?.enableThinking) attachThinkingToNodes(conversation.mapping, mergedConversationNodes, startNodeId);
		return {
			id: conversation.id,
			title,
			model,
			modelSlug,
			createTime,
			updateTime,
			conversationNodes: mergedConversationNodes
		};
	}
	function extractModel(conversationMapping, conversationNodes) {
		const modelSlug = (conversationNodes.findLast((node) => node.message?.metadata?.model_slug) ?? Object.values(conversationMapping).find((node) => node.message?.metadata?.model_slug))?.message?.metadata?.model_slug ?? "";
		return {
			model: getModelName(modelSlug),
			modelSlug
		};
	}
	function extractConversationResult(conversationMapping, startNodeId) {
		const result = [];
		let currentNodeId = startNodeId;
		while (currentNodeId) {
			const node = conversationMapping[currentNodeId];
			if (!node) break;
			if (node.parent === void 0) break;
			if (node.message?.author.role !== "system" && node.message?.content.content_type !== "model_editable_context" && node.message?.content.content_type !== "user_editable_context" && !shouldSkipMessageInExport(node.message)) result.unshift(copyNode(node));
			currentNodeId = node.parent;
		}
		return result;
	}
	function copyNode(node) {
		const { message } = node;
		if (!message) return { ...node };
		const content = message.content.content_type === "text" ? {
			...message.content,
			parts: [...message.content.parts]
		} : message.content;
		return {
			...node,
			message: {
				...message,
				content,
				metadata: message.metadata && { ...message.metadata }
			}
		};
	}
	function mergeContinuationNodes(nodes) {
		const result = [];
		for (const node of nodes) {
			const prevNode = result[result.length - 1];
			if (prevNode?.message?.author.role === "assistant" && node.message?.author.role === "assistant" && prevNode.message.recipient === "all" && node.message.recipient === "all" && prevNode.message.content.content_type === "text" && node.message.content.content_type === "text") {
				const separator = prevNode.message.channel !== node.message.channel ? "\n\n" : "";
				prevNode.message.content.parts[prevNode.message.content.parts.length - 1] += separator + node.message.content.parts[0];
				prevNode.message.content.parts.push(...node.message.content.parts.slice(1));
				if (node.message.metadata) {
					const prevMeta = prevNode.message.metadata ??= {};
					if (node.message.metadata.citations?.length) prevMeta.citations = [...prevMeta.citations || [], ...node.message.metadata.citations];
					if (node.message.metadata.content_references?.length) prevMeta.content_references = [...prevMeta.content_references || [], ...node.message.metadata.content_references];
				}
			} else result.push(node);
		}
		return result;
	}
	function hasThinkingContent(thinking) {
		return thinking.thoughts.length > 0 || thinking.activities != null && thinking.activities.length > 0;
	}
	function attachThinkingToNodes(mapping, resultNodes, startNodeId) {
		const resultNodeIds = new Set(resultNodes.map((n) => n.id));
		let currentNodeId = startNodeId;
		let targetNodeId = null;
		let thinking = { thoughts: [] };
		while (currentNodeId) {
			const node = mapping[currentNodeId];
			if (!node || node.parent === void 0) break;
			const message = node.message;
			if (message?.content) {
				const ct = message.content.content_type;
				if (resultNodeIds.has(node.id) && message.author.role !== "user") {
					if (hasThinkingContent(thinking)) {
						const saveToId = targetNodeId ?? node.id;
						const target = resultNodes.find((n) => n.id === saveToId);
						if (target) target.thinking = thinking;
					}
					targetNodeId = node.id;
					thinking = { thoughts: [] };
				} else if (ct === "reasoning_recap") {
					const duration = message.metadata?.finished_duration_sec;
					if (typeof duration === "number") thinking.durationSeconds = duration;
					else {
						const match = message.content.content.match(/(\d+)/);
						if (match) thinking.durationSeconds = Number.parseInt(match[1]);
					}
				} else if (ct === "thoughts") thinking.thoughts.unshift(...message.content.thoughts.filter((thought) => thought.content || thought.summary).map((thought) => ({
					summary: thought.summary,
					content: thought.content
				})));
				else if (ct === "text" && message.metadata?.is_thinking_preamble_message) {
					const content = message.content.parts.join("\n");
					if (content) thinking.thoughts.unshift({
						summary: "",
						content
					});
				} else if (message.metadata?.reasoning_title) {
					if (!thinking.activities) thinking.activities = [];
					const title = message.metadata.reasoning_title;
					const index = thinking.activities.indexOf(title);
					if (index !== -1) thinking.activities.splice(index, 1);
					thinking.activities.unshift(title);
				} else if (message.author.role === "user" && !message.metadata?.is_visually_hidden_from_conversation) {
					if (targetNodeId && hasThinkingContent(thinking)) {
						const target = resultNodes.find((n) => n.id === targetNodeId);
						if (target) target.thinking = thinking;
					}
					targetNodeId = null;
					thinking = { thoughts: [] };
				}
			}
			currentNodeId = node.parent;
		}
		if (targetNodeId && hasThinkingContent(thinking)) {
			const target = resultNodes.find((n) => n.id === targetNodeId);
			if (target) target.thinking = thinking;
		}
	}
	var t$1;
	var r;
	var u;
	var i;
	var o$1 = 0;
	var f = [];
	var c = [];
	var e = l$1.__b;
	var a = l$1.__r;
	var v = l$1.diffed;
	var l = l$1.__c;
	var m = l$1.unmount;
	function d(t, u) {
		l$1.__h && l$1.__h(r, t, o$1 || u), o$1 = 0;
		var i = r.__H || (r.__H = {
			__: [],
			__h: []
		});
		return t >= i.__.length && i.__.push({ __V: c }), i.__[t];
	}
	function h(n) {
		return o$1 = 1, s(B$1, n);
	}
	function s(n, u, i) {
		var o = d(t$1++, 2);
		if (o.t = n, !o.__c && (o.__ = [i ? i(u) : B$1(void 0, u), function(n) {
			var t = o.__N ? o.__N[0] : o.__[0], r = o.t(t, n);
			t !== r && (o.__N = [r, o.__[1]], o.__c.setState({}));
		}], o.__c = r, !r.u)) {
			var f = function(n, t, r) {
				if (!o.__c.__H) return !0;
				var u = o.__c.__H.__.filter(function(n) {
					return n.__c;
				});
				if (u.every(function(n) {
					return !n.__N;
				})) return !c || c.call(this, n, t, r);
				var i = !1;
				return u.forEach(function(n) {
					if (n.__N) {
						var t = n.__[0];
						n.__ = n.__N, n.__N = void 0, t !== n.__[0] && (i = !0);
					}
				}), !(!i && o.__c.props === n) && (!c || c.call(this, n, t, r));
			};
			r.u = !0;
			var c = r.shouldComponentUpdate, e = r.componentWillUpdate;
			r.componentWillUpdate = function(n, t, r) {
				if (this.__e) {
					var u = c;
					c = void 0, f(n, t, r), c = u;
				}
				e && e.call(this, n, t, r);
			}, r.shouldComponentUpdate = f;
		}
		return o.__N || o.__;
	}
	function p$1(u, i) {
		var o = d(t$1++, 3);
		!l$1.__s && z$1(o.__H, i) && (o.__ = u, o.i = i, r.__H.__h.push(o));
	}
	function y(u, i) {
		var o = d(t$1++, 4);
		!l$1.__s && z$1(o.__H, i) && (o.__ = u, o.i = i, r.__h.push(o));
	}
	function _$1(n) {
		return o$1 = 5, F$1(function() {
			return { current: n };
		}, []);
	}
	function F$1(n, r) {
		var u = d(t$1++, 7);
		return z$1(u.__H, r) ? (u.__V = n(), u.i = r, u.__h = n, u.__V) : u.__;
	}
	function T$1(n, t) {
		return o$1 = 8, F$1(function() {
			return n;
		}, t);
	}
	function q$1(n) {
		var u = r.context[n.__c], i = d(t$1++, 9);
		return i.c = n, u ? (i.__ ?? (i.__ = !0, u.sub(r)), u.props.value) : n.__;
	}
	function V$1() {
		var n = d(t$1++, 11);
		if (!n.__) {
			for (var u = r.__v; null !== u && !u.__m && null !== u.__;) u = u.__;
			var i = u.__m || (u.__m = [0, 0]);
			n.__ = "P" + i[0] + "-" + i[1]++;
		}
		return n.__;
	}
	function b() {
		for (var t; t = f.shift();) if (t.__P && t.__H) try {
			t.__H.__h.forEach(k), t.__H.__h.forEach(w$1), t.__H.__h = [];
		} catch (r) {
			t.__H.__h = [], l$1.__e(r, t.__v);
		}
	}
	l$1.__b = function(n) {
		r = null, e && e(n);
	}, l$1.__r = function(n) {
		a && a(n), t$1 = 0;
		var i = (r = n.__c).__H;
		i && (u === r ? (i.__h = [], r.__h = [], i.__.forEach(function(n) {
			n.__N && (n.__ = n.__N), n.__V = c, n.__N = n.i = void 0;
		})) : (i.__h.forEach(k), i.__h.forEach(w$1), i.__h = [], t$1 = 0)), u = r;
	}, l$1.diffed = function(t) {
		v && v(t);
		var o = t.__c;
		o && o.__H && (o.__H.__h.length && (1 !== f.push(o) && i === l$1.requestAnimationFrame || ((i = l$1.requestAnimationFrame) || j$1)(b)), o.__H.__.forEach(function(n) {
			n.i && (n.__H = n.i), n.__V !== c && (n.__ = n.__V), n.i = void 0, n.__V = c;
		})), u = r = null;
	}, l$1.__c = function(t, r) {
		r.some(function(t) {
			try {
				t.__h.forEach(k), t.__h = t.__h.filter(function(n) {
					return !n.__ || w$1(n);
				});
			} catch (u) {
				r.some(function(n) {
					n.__h && (n.__h = []);
				}), r = [], l$1.__e(u, t.__v);
			}
		}), l && l(t, r);
	}, l$1.unmount = function(t) {
		m && m(t);
		var r, u = t.__c;
		u && u.__H && (u.__H.__.forEach(function(n) {
			try {
				k(n);
			} catch (n) {
				r = n;
			}
		}), u.__H = void 0, r && l$1.__e(r, u.__v));
	};
	var g$1 = "function" == typeof requestAnimationFrame;
	function j$1(n) {
		var t, r = function() {
			clearTimeout(u), g$1 && cancelAnimationFrame(t), setTimeout(n);
		}, u = setTimeout(r, 100);
		g$1 && (t = requestAnimationFrame(r));
	}
	function k(n) {
		var t = r, u = n.__c;
		"function" == typeof u && (n.__c = void 0, u()), r = t;
	}
	function w$1(n) {
		var t = r;
		n.__c = n.__(), r = t;
	}
	function z$1(n, t) {
		return !n || n.length !== t.length || t.some(function(t, r) {
			return t !== n[r];
		});
	}
	function B$1(n, t) {
		return "function" == typeof t ? t(n) : t;
	}
	function g(n, t) {
		for (var e in t) n[e] = t[e];
		return n;
	}
	function C(n, t) {
		for (var e in n) if ("__source" !== e && !(e in t)) return !0;
		for (var r in t) if ("__source" !== r && n[r] !== t[r]) return !0;
		return !1;
	}
	function E(n, t) {
		return n === t && (0 !== n || 1 / n == 1 / t) || n != n && t != t;
	}
	function w(n) {
		this.props = n;
	}
	(w.prototype = new b$1()).isPureReactComponent = !0, w.prototype.shouldComponentUpdate = function(n, t) {
		return C(this.props, n) || C(this.state, t);
	};
	var R = l$1.__b;
	l$1.__b = function(n) {
		n.type && n.type.__f && n.ref && (n.props.ref = n.ref, n.ref = null), R && R(n);
	};
	"undefined" != typeof Symbol && Symbol.for;
	var T = l$1.__e;
	l$1.__e = function(n, t, e, r) {
		if (n.then) {
			for (var u, o = t; o = o.__;) if ((u = o.__c) && u.__c) return t.__e ?? (t.__e = e.__e, t.__k = e.__k), u.__c(n, t);
		}
		T(n, t, e, r);
	};
	var F = l$1.unmount;
	function I(n, t, e) {
		return n && (n.__c && n.__c.__H && (n.__c.__H.__.forEach(function(n) {
			"function" == typeof n.__c && n.__c();
		}), n.__c.__H = null), null != (n = g({}, n)).__c && (n.__c.__P === e && (n.__c.__P = t), n.__c = null), n.__k = n.__k && n.__k.map(function(n) {
			return I(n, t, e);
		})), n;
	}
	function L(n, t, e) {
		return n && (n.__v = null, n.__k = n.__k && n.__k.map(function(n) {
			return L(n, t, e);
		}), n.__c && n.__c.__P === t && (n.__e && e.insertBefore(n.__e, n.__d), n.__c.__e = !0, n.__c.__P = e)), n;
	}
	function U() {
		this.__u = 0, this.t = null, this.__b = null;
	}
	function D(n) {
		var t = n.__.__c;
		return t && t.__a && t.__a(n);
	}
	function V() {
		this.u = null, this.o = null;
	}
	l$1.unmount = function(n) {
		var t = n.__c;
		t && t.__R && t.__R(), t && !0 === n.__h && (n.type = null), F && F(n);
	}, (U.prototype = new b$1()).__c = function(n, t) {
		var e = t.__c, r = this;
		r.t ??= [], r.t.push(e);
		var u = D(r.__v), o = !1, i = function() {
			o || (o = !0, e.__R = null, u ? u(l) : l());
		};
		e.__R = i;
		var l = function() {
			if (!--r.__u) {
				if (r.state.__a) {
					var n = r.state.__a;
					r.__v.__k[0] = L(n, n.__c.__P, n.__c.__O);
				}
				var t;
				for (r.setState({ __a: r.__b = null }); t = r.t.pop();) t.forceUpdate();
			}
		}, c = !0 === t.__h;
		r.__u++ || c || r.setState({ __a: r.__b = r.__v.__k[0] }), n.then(i, i);
	}, U.prototype.componentWillUnmount = function() {
		this.t = [];
	}, U.prototype.render = function(n, e) {
		if (this.__b) {
			if (this.__v.__k) {
				var r = document.createElement("div"), o = this.__v.__k[0].__c;
				this.__v.__k[0] = I(this.__b, r, o.__O = o.__P);
			}
			this.__b = null;
		}
		var i = e.__a && y$1(k$1, null, n.fallback);
		return i && (i.__h = null), [y$1(k$1, null, e.__a ? null : n.children), i];
	};
	var W = function(n, t, e) {
		if (++e[1] === e[0] && n.o.delete(t), n.props.revealOrder && ("t" !== n.props.revealOrder[0] || !n.o.size)) for (e = n.u; e;) {
			for (; e.length > 3;) e.pop()();
			if (e[1] < e[0]) break;
			n.u = e = e[2];
		}
	};
	function P(n) {
		return this.getChildContext = function() {
			return n.context;
		}, n.children;
	}
	function j(n) {
		var e = this, r = n.i;
		e.componentWillUnmount = function() {
			D$1(null, e.l), e.l = null, e.i = null;
		}, e.i && e.i !== r && e.componentWillUnmount(), e.l || (e.i = r, e.l = {
			nodeType: 1,
			parentNode: r,
			childNodes: [],
			appendChild: function(n) {
				this.childNodes.push(n), e.i.appendChild(n);
			},
			insertBefore: function(n, t) {
				this.childNodes.push(n), e.i.appendChild(n);
			},
			removeChild: function(n) {
				this.childNodes.splice(this.childNodes.indexOf(n) >>> 1, 1), e.i.removeChild(n);
			}
		}), D$1(y$1(P, { context: e.context }, n.__v), e.l);
	}
	function z(n, e) {
		var r = y$1(j, {
			__v: n,
			i: e
		});
		return r.containerInfo = e, r;
	}
	(V.prototype = new b$1()).__a = function(n) {
		var t = this, e = D(t.__v), r = t.o.get(n);
		return r[0]++, function(u) {
			var o = function() {
				t.props.revealOrder ? (r.push(u), W(t, n, r)) : u();
			};
			e ? e(o) : o();
		};
	}, V.prototype.render = function(n) {
		this.u = null, this.o = new Map();
		var t = C$1(n.children);
		n.revealOrder && "b" === n.revealOrder[0] && t.reverse();
		for (var e = t.length; e--;) this.o.set(t[e], this.u = [
			1,
			0,
			this.u
		]);
		return n.children;
	}, V.prototype.componentDidUpdate = V.prototype.componentDidMount = function() {
		var n = this;
		this.o.forEach(function(t, e) {
			W(n, e, t);
		});
	};
	var B = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.element") || 60103;
	var H = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/;
	var Z = /^on(Ani|Tra|Tou|BeforeInp|Compo)/;
	var Y = /[A-Z0-9]/g;
	var $ = "undefined" != typeof document;
	var q = function(n) {
		return ("undefined" != typeof Symbol && "symbol" == typeof Symbol() ? /fil|che|rad/ : /fil|che|ra/).test(n);
	};
	b$1.prototype.isReactComponent = {}, [
		"componentWillMount",
		"componentWillReceiveProps",
		"componentWillUpdate"
	].forEach(function(t) {
		Object.defineProperty(b$1.prototype, t, {
			configurable: !0,
			get: function() {
				return this["UNSAFE_" + t];
			},
			set: function(n) {
				Object.defineProperty(this, t, {
					configurable: !0,
					writable: !0,
					value: n
				});
			}
		});
	});
	var K = l$1.event;
	function Q() {}
	function X() {
		return this.cancelBubble;
	}
	function nn() {
		return this.defaultPrevented;
	}
	l$1.event = function(n) {
		return K && (n = K(n)), n.persist = Q, n.isPropagationStopped = X, n.isDefaultPrevented = nn, n.nativeEvent = n;
	};
	var en = {
		enumerable: !1,
		configurable: !0,
		get: function() {
			return this.class;
		}
	};
	var rn = l$1.vnode;
	l$1.vnode = function(n) {
		"string" == typeof n.type && function(n) {
			var t = n.props, e = n.type, u = {};
			for (var o in t) {
				var i = t[o];
				if (!("value" === o && "defaultValue" in t && null == i || $ && "children" === o && "noscript" === e || "class" === o || "className" === o)) {
					var l = o.toLowerCase();
					"defaultValue" === o && "value" in t && null == t.value ? o = "value" : "download" === o && !0 === i ? i = "" : "ondoubleclick" === l ? o = "ondblclick" : "onchange" !== l || "input" !== e && "textarea" !== e || q(t.type) ? "onfocus" === l ? o = "onfocusin" : "onblur" === l ? o = "onfocusout" : Z.test(o) ? o = l : -1 === e.indexOf("-") && H.test(o) ? o = o.replace(Y, "-$&").toLowerCase() : null === i && (i = void 0) : l = o = "oninput", "oninput" === l && u[o = l] && (o = "oninputCapture"), u[o] = i;
				}
			}
			"select" == e && u.multiple && Array.isArray(u.value) && (u.value = C$1(t.children).forEach(function(n) {
				n.props.selected = -1 != u.value.indexOf(n.props.value);
			})), "select" == e && null != u.defaultValue && (u.value = C$1(t.children).forEach(function(n) {
				n.props.selected = u.multiple ? -1 != u.defaultValue.indexOf(n.props.value) : u.defaultValue == n.props.value;
			})), t.class && !t.className ? (u.class = t.class, Object.defineProperty(u, "className", en)) : (t.className && !t.class || t.class && t.className) && (u.class = u.className = t.className), n.props = u;
		}(n), n.$$typeof = B, rn && rn(n);
	};
	var un = l$1.__r;
	l$1.__r = function(n) {
		un && un(n), n.__c;
	};
	var on = l$1.diffed;
	l$1.diffed = function(n) {
		on && on(n);
		var t = n.props, e = n.__e;
		null != e && "textarea" === n.type && "value" in t && t.value !== e.value && (e.value = null == t.value ? "" : t.value);
	};
	function En(n, t) {
		var e = t(), r = h({ h: {
			__: e,
			v: t
		} }), u = r[0].h, o = r[1];
		return y(function() {
			u.__ = e, u.v = t, E(u.__, t()) || o({ h: u });
		}, [
			n,
			e,
			t
		]), p$1(function() {
			return E(u.__, u.v()) || o({ h: u }), n(function() {
				E(u.__, u.v()) || o({ h: u });
			});
		}, [n]), e;
	}
	var en_default = {
		title: "ChatGPT Exporter",
		ExportHelper: "Export",
		Setting: "Setting",
		Language: "Language",
		"Copy Text": "Copy Text",
		"Copied!": "Copied!",
		Screenshot: "Screenshot",
		Markdown: "Markdown",
		HTML: "HTML",
		JSON: "JSON",
		Archive: "Archive",
		Save: "Save",
		Delete: "Delete",
		Cancel: "Cancel",
		"Select All": "Select All",
		"Select...": "Select...",
		"Select Not Exported": "Select Not Exported",
		"Select Updated": "Select Updated",
		"Shift Select Hint": "Tip: Shift+click to select a range",
		Export: "Export",
		Error: "Error",
		Loading: "Loading",
		Preview: "Preview",
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
		"Export Thinking Process": "Export Thinking Process",
		"Export Thinking Process Description": "Include the model's thinking/reasoning process in exported Markdown and HTML files.",
		"Export Sources": "Export Sources",
		"Export Sources Description": "Include the source list shown at the end of each answer in exported Markdown and HTML files.",
		Sources: "Sources",
		"OpenAI Official Format": "OpenAI Official Format",
		"Conversation Archive Alert": "Are you sure you want to archive all selected conversations?",
		"Conversation Archived Message": "All selected conversations have been archived. Please refresh the page to see the changes.",
		"Conversation Delete Alert": "Are you sure you want to delete all selected conversations?",
		"Conversation Deleted Message": "All selected conversations have been deleted. Please refresh the page to see the changes.",
		"Please start a conversation first": "Please start a conversation first.",
		"Temporary chat could not be captured": "This temporary chat could not be read. It may have started before the exporter was loaded. You can still export it as a PNG screenshot.",
		"Select Project": "Select Project",
		"(no project)": "(no project)",
		"Export All Limit": "Export All Limit",
		"Export All Limit Description": "Set the maximum number of conversations to load. Exports run in waves of 100 conversations to stay within API rate limits.",
		"Select a source to load conversations": "Select a project above to load conversations.",
		Search: "Search",
		"No results": "No results",
		"Batch progress": "Batch {{current}}/{{total}}",
		"All conversations": "All conversations",
		"Load more conversations": "Load {{n}} more",
		"Load more conversations remaining": "Load {{n}} more · {{remaining}} left",
		"Export Skipped Message": "{{n}} conversations failed after repeated retries and are missing from the export:",
		"List Rate Limited Wait": "Rate limited by the API · wait {{n}}s and try again",
		"List Rate Limited": "Rate limited by the API · try again in a moment",
		"List Load Failed": "Failed to load conversations"
	};
	var es_default = {
		title: "ChatGPT Exporter",
		ExportHelper: "Exportar",
		Setting: "Ajustes",
		Language: "Idioma",
		"Copy Text": "Copiar Texto",
		"Copied!": "¡Copiado!",
		Screenshot: "Captura",
		Markdown: "Markdown",
		HTML: "HTML",
		JSON: "JSON",
		Archive: "Archivo",
		Save: "Guardar",
		Delete: "Borrar",
		Cancel: "Cancelar",
		"Select All": "Seleccionar Todos",
		"Select...": "Selección…",
		"Select Not Exported": "Seleccionar conversaciones no exportadas",
		"Select Updated": "Seleccionar conversaciones actualizadas",
		"Shift Select Hint": "Consejo: Shift+clic para seleccionar un rango",
		Export: "Exportar",
		Error: "Error",
		Loading: "Cargando",
		Preview: "Previsualizar",
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
		"Export Thinking Process": "Exportar Proceso de Pensamiento",
		"Export Thinking Process Description": "Incluir el proceso de pensamiento/razonamiento del modelo en los archivos Markdown y HTML exportados.",
		"Export Sources": "Exportar fuentes",
		"Export Sources Description": "Incluir la lista de fuentes que se muestra al final de cada respuesta en los archivos Markdown y HTML exportados.",
		Sources: "Fuentes",
		"OpenAI Official Format": "Formato Oficial de OpenAI",
		"Conversation Archive Alert": "¿Estás seguro que quieres archivar todas las conversaciones seleccionadas?",
		"Conversation Archived Message": "Todos las conversaciones seleccionadas se han archivado. Por favor refresca la página para ver los cambios.",
		"Conversation Delete Alert": "¿Estás seguro que quieres borrar todas las conversaciones seleccionadas?",
		"Conversation Deleted Message": "Todos las conversaciones seleccionadas se han borrado. Por favor refresca la página para ver los cambios.",
		"Please start a conversation first": "Por favor empieza una conversación antes.",
		"Temporary chat could not be captured": "No se pudo leer este chat temporal. Es posible que haya comenzado antes de que se cargara el exportador. Aún puedes exportarlo como una captura de pantalla PNG.",
		"Select Project": "Seleccionar proyecto",
		"(no project)": "(sin proyecto)",
		"Export All Limit": "Límite de Exportar Todos",
		"Export All Limit Description": "Establece el número máximo de conversaciones a cargar en el diálogo 'Exportar Todos'.",
		"Select a source to load conversations": "Selecciona un proyecto arriba para cargar conversaciones.",
		Search: "Buscar",
		"No results": "Sin resultados",
		"Batch progress": "Lote {{current}}/{{total}}",
		"All conversations": "Todas las conversaciones",
		"Load more conversations": "Cargar {{n}} más",
		"Load more conversations remaining": "Cargar {{n}} más · quedan {{remaining}}",
		"Export Skipped Message": "{{n}} conversaciones fallaron tras varios reintentos y no están en la exportación:",
		"List Rate Limited Wait": "Límite de solicitudes de la API · espera {{n}} s y vuelve a intentarlo",
		"List Rate Limited": "Límite de solicitudes de la API · vuelve a intentarlo en un momento",
		"List Load Failed": "No se pudieron cargar las conversaciones"
	};
	var fr_default = {
		title: "Exportateur ChatGPT",
		ExportHelper: "Exporter",
		Setting: "Paramètre",
		Language: "Langue",
		"Copy Text": "Copier le texte",
		"Copied!": "Copié !",
		Screenshot: "Capture",
		Markdown: "Markdown",
		HTML: "HTML",
		JSON: "JSON",
		Archive: "Archiver",
		Save: "Enregistrer",
		Delete: "Supprimer",
		Cancel: "Annuler",
		"Select All": "Tout sélectionner",
		"Select...": "Sélection…",
		"Select Not Exported": "Sélectionner les conversations non exportées",
		"Select Updated": "Sélectionner les conversations mises à jour",
		"Shift Select Hint": "Astuce : Maj+clic pour sélectionner une plage",
		Export: "Exporter",
		Error: "Erreur",
		Loading: "Chargement",
		Preview: "Aperçu",
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
		"Export Thinking Process": "Exporter le processus de réflexion",
		"Export Thinking Process Description": "Inclure le processus de réflexion/raisonnement du modèle dans les fichiers Markdown et HTML exportés.",
		"Export Sources": "Exporter les sources",
		"Export Sources Description": "Inclure la liste des sources affichée à la fin de chaque réponse dans les fichiers Markdown et HTML exportés.",
		Sources: "Sources",
		"OpenAI Official Format": "Format officiel OpenAI",
		"Conversation Archive Alert": "Êtes-vous sûr de vouloir archiver toutes les conversations sélectionnées ?",
		"Conversation Archived Message": "Toutes les conversations sélectionnées ont été archivées. Veuillez actualiser la page pour voir les changements.",
		"Conversation Delete Alert": "Êtes-vous sûr de vouloir supprimer toutes les conversations sélectionnées ?",
		"Conversation Deleted Message": "Toutes les conversations sélectionnées ont été supprimées. Veuillez actualiser la page pour voir les changements.",
		"Please start a conversation first": "Veuillez commencer une conversation d'abord.",
		"Temporary chat could not be captured": "Ce chat éphémère n'a pas pu être lu. Il a peut-être commencé avant le chargement de l'exportateur. Vous pouvez toujours l'exporter en capture d'écran PNG.",
		"Select Project": "Sélectionner un projet",
		"(no project)": "(aucun projet)",
		"Export All Limit": "Limite d'Exportation Multiple",
		"Export All Limit Description": "Définit le nombre maximal de conversations à charger dans la boîte de dialogue 'Tout exporter'.",
		"Select a source to load conversations": "Sélectionnez un projet ci-dessus pour charger les conversations.",
		Search: "Rechercher",
		"No results": "Aucun résultat",
		"Batch progress": "Lot {{current}}/{{total}}",
		"All conversations": "Toutes les conversations",
		"Load more conversations": "Charger {{n}} de plus",
		"Load more conversations remaining": "Charger {{n}} de plus · {{remaining}} restantes",
		"Export Skipped Message": "{{n}} conversations ont échoué après plusieurs tentatives et ne figurent pas dans l'export :",
		"List Rate Limited Wait": "Limite de requêtes de l'API atteinte · attendez {{n}} s et réessayez",
		"List Rate Limited": "Limite de requêtes de l'API atteinte · réessayez dans un instant",
		"List Load Failed": "Impossible de charger les conversations"
	};
	var id_default = {
		title: "ChatGPT Exporter",
		ExportHelper: "Ekspor",
		Setting: "Pengaturan",
		Language: "Bahasa",
		"Copy Text": "Salin Teks",
		"Copied!": "Disalin!",
		Screenshot: "Screenshot",
		Markdown: "Markdown",
		HTML: "HTML",
		JSON: "JSON",
		Archive: "Arsip",
		Save: "Simpan",
		Delete: "Hapus",
		Cancel: "Batal",
		"Select All": "Pilih Semua",
		"Select...": "Pilih massal…",
		"Select Not Exported": "Pilih percakapan yang belum diekspor",
		"Select Updated": "Pilih percakapan yang diperbarui",
		"Shift Select Hint": "Tips: Shift+klik untuk memilih rentang",
		Export: "Ekspor",
		Error: "Kesalahan",
		Loading: "Memuat",
		Preview: "Pratinjau",
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
		"Export Thinking Process": "Ekspor Proses Berpikir",
		"Export Thinking Process Description": "Sertakan proses berpikir/penalaran model dalam file Markdown dan HTML yang diekspor.",
		"Export Sources": "Ekspor Sumber",
		"Export Sources Description": "Sertakan daftar sumber yang ditampilkan di akhir setiap jawaban dalam file Markdown dan HTML yang diekspor.",
		Sources: "Sumber",
		"OpenAI Official Format": "Format Resmi OpenAI",
		"Conversation Archive Alert": "Apakah Anda yakin ingin mengarsipkan semua percakapan yang dipilih?",
		"Conversation Archived Message": "Semua percakapan yang dipilih telah diarsipkan. Harap segarkan halaman untuk melihat perubahan.",
		"Conversation Delete Alert": "Apakah Anda yakin ingin menghapus semua percakapan yang dipilih?",
		"Conversation Deleted Message": "Semua percakapan yang dipilih telah dihapus. Harap segarkan halaman untuk melihat perubahan.",
		"Please start a conversation first": "Harap mulai percakapan terlebih dahulu.",
		"Temporary chat could not be captured": "Obrolan sementara ini tidak dapat dibaca. Mungkin obrolan dimulai sebelum pengekspor dimuat. Anda masih dapat mengekspornya sebagai tangkapan layar PNG.",
		"Select Project": "Pilih Proyek",
		"(no project)": "(tidak ada proyek)",
		"Export All Limit": "Batas Ekspor Semua",
		"Export All Limit Description": "Atur jumlah maksimum percakapan yang akan dimuat dalam dialog 'Ekspor Semua'.",
		"Select a source to load conversations": "Pilih proyek di atas untuk memuat percakapan.",
		Search: "Cari",
		"No results": "Tidak ada hasil",
		"Batch progress": "Kelompok {{current}}/{{total}}",
		"All conversations": "Semua percakapan",
		"Load more conversations": "Muat {{n}} lagi",
		"Load more conversations remaining": "Muat {{n}} lagi · tersisa {{remaining}}",
		"Export Skipped Message": "{{n}} percakapan gagal setelah beberapa kali dicoba ulang dan tidak ada dalam ekspor:",
		"List Rate Limited Wait": "Dibatasi oleh API · tunggu {{n}} dtk lalu coba lagi",
		"List Rate Limited": "Dibatasi oleh API · coba lagi sebentar lagi",
		"List Load Failed": "Gagal memuat percakapan"
	};
	var jp_default = {
		title: "ChatGPTエクスポーター",
		ExportHelper: "エクスポート",
		Setting: "設定",
		Language: "言語",
		"Copy Text": "テキストをコピー",
		"Copied!": "コピーしました！",
		Screenshot: "スクリーンショット",
		Markdown: "Markdown",
		HTML: "HTML",
		JSON: "JSON",
		Archive: "アーカイブ",
		Save: "保存",
		Delete: "削除",
		Cancel: "キャンセル",
		"Select All": "すべて選択",
		"Select...": "一括選択…",
		"Select Not Exported": "未エクスポートの会話を選択",
		"Select Updated": "更新された会話を選択",
		"Shift Select Hint": "ヒント: Shift+クリックで範囲選択",
		Export: "エクスポート",
		Error: "エラー",
		Loading: "読み込み中",
		Preview: "プレビュー",
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
		"Export Thinking Process": "思考プロセスをエクスポート",
		"Export Thinking Process Description": "エクスポートされたMarkdownおよびHTMLファイルにモデルの思考・推論プロセスを含めます。",
		"Export Sources": "ソースをエクスポート",
		"Export Sources Description": "各回答の末尾に表示されるソース一覧を、エクスポートされた Markdown および HTML ファイルに含めます。",
		Sources: "出典",
		"OpenAI Official Format": "OpenAI公式フォーマット",
		"Conversation Archive Alert": "選択したすべての会話をアーカイブしてもよろしいですか？",
		"Conversation Archived Message": "選択したすべての会話がアーカイブされました。変更を表示するには、ページを更新してください。",
		"Conversation Delete Alert": "選択したすべての会話を削除してもよろしいですか？",
		"Conversation Deleted Message": "選択したすべての会話が削除されました。変更を表示するには、ページを更新してください。",
		"Please start a conversation first": "まず会話を開始してください。",
		"Temporary chat could not be captured": "この一時チャットを読み取れませんでした。エクスポーターが読み込まれる前に開始された可能性があります。PNG スクリーンショットとしてエクスポートすることは可能です。",
		"Select Project": "プロジェクトを選択",
		"(no project)": "（プロジェクトなし）",
		"Export All Limit": "すべてエクスポートの上限",
		"Export All Limit Description": "「すべてエクスポート」ダイアログで読み込む会話の最大数を設定します。",
		"Select a source to load conversations": "上からプロジェクトを選択して会話を読み込んでください。",
		Search: "検索",
		"No results": "結果なし",
		"Batch progress": "バッチ {{current}}/{{total}}",
		"All conversations": "すべての会話",
		"Load more conversations": "さらに {{n}} 件読み込む",
		"Load more conversations remaining": "さらに {{n}} 件読み込む · 残り {{remaining}} 件",
		"Export Skipped Message": "{{n}} 件の会話は再試行しても失敗したため、エクスポートに含まれていません：",
		"List Rate Limited Wait": "リクエストが多すぎます · {{n}} 秒後に再試行してください",
		"List Rate Limited": "リクエストが多すぎます · しばらくしてから再試行してください",
		"List Load Failed": "会話を読み込めませんでした"
	};
	var ru_default = {
		title: "ChatGPT Exporter",
		ExportHelper: "Export",
		Setting: "Параметры",
		Language: "Язык",
		"Copy Text": "Копировать текст",
		"Copied!": "Скопировано!",
		Screenshot: "Скриншот",
		Markdown: "Markdown",
		HTML: "HTML",
		JSON: "JSON",
		Archive: "Архивировать",
		Save: "Сохранить",
		Delete: "Удалить",
		Cancel: "Отмена",
		"Select All": "Выбрать все",
		"Select...": "Выбрать…",
		"Select Not Exported": "Выбрать неэкспортированные разговоры",
		"Select Updated": "Выбрать обновлённые разговоры",
		"Shift Select Hint": "Совет: Shift+клик выбирает диапазон",
		Export: "Экспорт",
		Error: "Ошибка",
		Loading: "Загрузка",
		Preview: "Предпросмотр",
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
		"Export Thinking Process": "Экспорт процесса мышления",
		"Export Thinking Process Description": "Включить процесс мышления/рассуждения модели в экспортированные файлы Markdown и HTML.",
		"Export Sources": "Экспорт источников",
		"Export Sources Description": "Включить список источников, показанный в конце каждого ответа, в экспортированные файлы Markdown и HTML.",
		Sources: "Источники",
		"OpenAI Official Format": "Официальный формат OpenAI",
		"Conversation Archive Alert": "Вы уверены, что хотите архивировать все выбранные разговоры?",
		"Conversation Archived Message": "Все выбранные разговоры были заархивированы. Пожалуйста, обновите страницу, чтобы увидеть изменения.",
		"Conversation Delete Alert": "Вы уверены, что хотите удалить все выбранные разговоры?",
		"Conversation Deleted Message": "Все выбранные разговоры были удалены. Пожалуйста, обновите страницу, чтобы увидеть изменения.",
		"Please start a conversation first": "Пожалуйста, начните разговор первым.",
		"Temporary chat could not be captured": "Не удалось прочитать этот временный чат. Возможно, он был начат до загрузки экспортёра. Вы всё ещё можете экспортировать его как PNG-скриншот.",
		"Select Project": "Выберите проект",
		"(no project)": "(нет проекта)",
		"Export All Limit": "Лимит экспорта всех",
		"Export All Limit Description": "Установите максимальное количество бесед для загрузки в диалоге 'Экспортировать все'.",
		"Select a source to load conversations": "Выберите проект выше, чтобы загрузить беседы.",
		Search: "Поиск",
		"No results": "Нет результатов",
		"Batch progress": "Партия {{current}}/{{total}}",
		"All conversations": "Все разговоры",
		"Load more conversations": "Загрузить ещё {{n}}",
		"Load more conversations remaining": "Загрузить ещё {{n}} · осталось {{remaining}}",
		"Export Skipped Message": "{{n}} разговоров не удалось загрузить после нескольких попыток, они отсутствуют в экспорте:",
		"List Rate Limited Wait": "Слишком много запросов к API · подождите {{n}} с и попробуйте снова",
		"List Rate Limited": "Слишком много запросов к API · попробуйте чуть позже",
		"List Load Failed": "Не удалось загрузить беседы"
	};
	var tr_default = {
		title: "ChatGPT Exporter",
		ExportHelper: "Dışa Aktar",
		Setting: "Ayarlar",
		Language: "Dil",
		"Copy Text": "Metni Kopyala",
		"Copied!": "Kopyalandı!",
		Screenshot: "Ekran Alıntısı",
		Markdown: "Markdown",
		HTML: "HTML",
		JSON: "JSON",
		Archive: "Arşiv",
		Save: "Kaydet",
		Delete: "Sil",
		Cancel: "İptal",
		"Select All": "Tümünü Seç",
		"Select...": "Toplu seçim…",
		"Select Not Exported": "Dışa aktarılmamış konuşmaları seç",
		"Select Updated": "Güncellenen konuşmaları seç",
		"Shift Select Hint": "İpucu: Aralık seçmek için Shift+tık",
		Export: "Dışa Aktar",
		Error: "Hata",
		Loading: "Yükleniyor",
		Preview: "Önizleme",
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
		"Export Thinking Process": "Düşünme Sürecini Dışa Aktar",
		"Export Thinking Process Description": "Dışa aktarılan Markdown ve HTML dosyalarına modelin düşünme/akıl yürütme sürecini dahil et.",
		"Export Sources": "Kaynakları Dışa Aktar",
		"Export Sources Description": "Her yanıtın sonunda gösterilen kaynak listesini dışa aktarılan Markdown ve HTML dosyalarına dahil et.",
		Sources: "Kaynaklar",
		"OpenAI Official Format": "OpenAI Resmi Format",
		"Conversation Archive Alert": "Seçilen tüm konuşmaları arşivlemek istediğinizden emin misiniz?",
		"Conversation Archived Message": "Seçilen tüm konuşmalar arşivlendi. Değişiklikleri görmek için sayfayı yenileyin.",
		"Conversation Delete Alert": "Seçilen tüm konuşmaları silmek istediğinizden emin misiniz?",
		"Conversation Deleted Message": "Seçilen tüm konuşmalar silindi. Değişiklikleri görmek için sayfayı yenileyin.",
		"Please start a conversation first": "Lütfen önce bir konuşma başlatın.",
		"Temporary chat could not be captured": "Bu geçici sohbet okunamadı. Dışa aktarıcı yüklenmeden önce başlamış olabilir. Yine de PNG ekran görüntüsü olarak dışa aktarabilirsiniz.",
		"Select Project": "Proje Seç",
		"(no project)": "(proje yok)",
		"Export All Limit": "Tümünü Dışa Aktarma Limiti",
		"Export All Limit Description": "'Tümünü Dışa Aktar' iletişim kutusunda yüklenecek maksimum konuşma sayısını ayarlayın.",
		"Select a source to load conversations": "Konuşmaları yüklemek için yukarıdan bir proje seçin.",
		Search: "Ara",
		"No results": "Sonuç yok",
		"Batch progress": "Grup {{current}}/{{total}}",
		"All conversations": "Tüm konuşmalar",
		"Load more conversations": "{{n}} tane daha yükle",
		"Load more conversations remaining": "{{n}} tane daha yükle · {{remaining}} kaldı",
		"Export Skipped Message": "{{n}} konuşma tekrar denemelere rağmen başarısız oldu ve dışa aktarımda yer almıyor:",
		"List Rate Limited Wait": "API istek sınırına ulaşıldı · {{n}} sn bekleyip tekrar deneyin",
		"List Rate Limited": "API istek sınırına ulaşıldı · biraz sonra tekrar deneyin",
		"List Load Failed": "Sohbetler yüklenemedi"
	};
	var zh_Hans_default = {
		title: "ChatGPT Exporter",
		ExportHelper: "导出助手",
		Setting: "设置",
		Language: "语言",
		"Copy Text": "复制文字",
		"Copied!": "已复制!",
		Screenshot: "截屏",
		Markdown: "Markdown",
		HTML: "HTML",
		JSON: "JSON",
		Archive: "归档",
		Save: "保存",
		Delete: "删除",
		Cancel: "取消",
		"Select All": "全选",
		"Select...": "批量选择…",
		"Select Not Exported": "选择未导出的对话",
		"Select Updated": "选择有更新的对话",
		"Shift Select Hint": "提示：Shift+点击可选择范围",
		Export: "导出",
		Error: "错误",
		Loading: "加载中",
		Preview: "预览",
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
		"Export Thinking Process": "导出思考过程",
		"Export Thinking Process Description": "在导出的 Markdown 和 HTML 文件中包含模型的思考/推理过程。",
		"Export Sources": "导出来源",
		"Export Sources Description": "在导出的 Markdown 和 HTML 文件中包含每个回答末尾显示的来源列表。",
		Sources: "来源",
		"OpenAI Official Format": "OpenAI 官方格式",
		"Conversation Archive Alert": "确定要归档所有选取的对话？",
		"Conversation Archived Message": "所有所选的对话已归档。请刷新页面。",
		"Conversation Delete Alert": "确定要删除所有选取的对话？",
		"Conversation Deleted Message": "所有所选的对话已删除。请刷新页面。",
		"Please start a conversation first": "请先开始对话。",
		"Temporary chat could not be captured": "无法读取此临时聊天，它可能在导出工具加载前就已开始。你仍可以将其导出为 PNG 截图。",
		"Select Project": "选择项目",
		"(no project)": "（无项目）",
		"Export All Limit": "批量导出上限",
		"Export All Limit Description": "设置“批量导出”对话框中加载的最大对话数量。",
		"Select a source to load conversations": "请在上方选择一个项目以加载对话。",
		Search: "搜索",
		"No results": "无结果",
		"Batch progress": "第 {{current}}/{{total}} 批",
		"All conversations": "全部对话",
		"Load more conversations": "再加载 {{n}} 条",
		"Load more conversations remaining": "再加载 {{n}} 条 · 剩余 {{remaining}} 条",
		"Export Skipped Message": "有 {{n}} 个对话多次重试后仍失败，未包含在导出文件中：",
		"List Rate Limited Wait": "请求过于频繁 · 请等待 {{n}} 秒后重试",
		"List Rate Limited": "请求过于频繁 · 请稍后重试",
		"List Load Failed": "无法加载对话"
	};
	var zh_Hant_default = {
		title: "ChatGPT Exporter",
		ExportHelper: "Export",
		Setting: "設定",
		Language: "語言",
		"Copy Text": "複製文字",
		"Copied!": "已複製!",
		Screenshot: "截圖",
		Markdown: "Markdown",
		HTML: "HTML",
		JSON: "JSON",
		Archive: "封存",
		Save: "保存",
		Delete: "刪除",
		Cancel: "取消",
		"Select All": "全選",
		"Select...": "批次選取…",
		"Select Not Exported": "選取未匯出的對話",
		"Select Updated": "選取有更新的對話",
		"Shift Select Hint": "提示：Shift+點擊可選取範圍",
		Export: "匯出",
		Error: "錯誤",
		Loading: "載入中",
		Preview: "預覽",
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
		"Export Thinking Process": "匯出思考過程",
		"Export Thinking Process Description": "在匯出的 Markdown 和 HTML 檔案中包含模型的思考/推理過程。",
		"Export Sources": "匯出來源",
		"Export Sources Description": "在匯出的 Markdown 和 HTML 檔案中包含每個回答末尾顯示的來源列表。",
		Sources: "來源",
		"OpenAI Official Format": "OpenAI 官方格式",
		"Conversation Archive Alert": "確定要封存所有選取的對話？",
		"Conversation Archived Message": "所有選取的對話已封存。請重新整理頁面。",
		"Conversation Delete Alert": "確定要刪除所有選取的對話？",
		"Conversation Deleted Message": "所有選取的對話已刪除。請重新整理頁面。",
		"Please start a conversation first": "請先開始對話。",
		"Temporary chat could not be captured": "無法讀取此暫存對話，它可能在匯出工具載入前就已開始。你仍可以將其匯出為 PNG 截圖。",
		"Select Project": "選擇專案",
		"(no project)": "（無專案）",
		"Export All Limit": "批量匯出上限",
		"Export All Limit Description": "設定「批量匯出」對話方塊中載入的最大對話數量。",
		"Select a source to load conversations": "請在上方選擇一個專案以載入對話。",
		Search: "搜尋",
		"No results": "無結果",
		"Batch progress": "第 {{current}}/{{total}} 批",
		"All conversations": "全部對話",
		"Load more conversations": "再載入 {{n}} 筆",
		"Load more conversations remaining": "再載入 {{n}} 筆 · 剩餘 {{remaining}} 筆",
		"Export Skipped Message": "有 {{n}} 個對話重試多次仍失敗，沒有包含在匯出檔中：",
		"List Rate Limited Wait": "請求太頻繁 · 請等 {{n}} 秒後再試",
		"List Rate Limited": "請求太頻繁 · 請稍後再試",
		"List Load Failed": "無法載入對話"
	};
	var GMStorage = class {
		static supported = typeof _GM_getValue === "function" && typeof _GM_setValue === "function" && typeof _GM_deleteValue === "function";
		static get(key) {
			const item = _GM_getValue(key, "");
			if (item) try {
				return JSON.parse(item);
			} catch {
				return null;
			}
			return null;
		}
		static set(key, value) {
			_GM_setValue(key, JSON.stringify(value));
		}
		static delete(key) {
			_GM_deleteValue(key);
		}
	};
	var LocalStorage = class {
		static supported = typeof localStorage === "object";
		static get(key) {
			const item = localStorage.getItem(key);
			if (item) try {
				return JSON.parse(item);
			} catch {
				return null;
			}
			return null;
		}
		static set(key, value) {
			const item = JSON.stringify(value);
			localStorage.setItem(key, item);
		}
		static delete(key) {
			localStorage.removeItem(key);
		}
	};
	var MemoryStorage = class {
		static map = new Map();
		static supported = true;
		static get(key) {
			const item = this.map.get(key);
			if (!item) return null;
			return item;
		}
		static set(key, value) {
			this.map.set(key, value);
		}
		static delete(key) {
			this.map.delete(key);
		}
	};
	var ScriptStorage = class {
		static get(key) {
			if (GMStorage.supported) try {
				return GMStorage.get(key);
			} catch {}
			if (LocalStorage.supported) try {
				return LocalStorage.get(key);
			} catch {}
			return MemoryStorage.get(key);
		}
		static set(key, value) {
			if (GMStorage.supported) try {
				return GMStorage.set(key, value);
			} catch {}
			if (LocalStorage.supported) try {
				return LocalStorage.set(key, value);
			} catch {}
			return MemoryStorage.set(key, value);
		}
		static delete(key) {
			if (GMStorage.supported) try {
				return GMStorage.delete(key);
			} catch {}
			if (LocalStorage.supported) try {
				return LocalStorage.delete(key);
			} catch {}
			return MemoryStorage.delete(key);
		}
	};
	var EN_US = {
		name: "English",
		code: "en-US",
		resource: en_default
	};
	var ES = {
		name: "Español",
		code: "es",
		resource: es_default
	};
	var FR = {
		name: "Français",
		code: "fr",
		resource: fr_default
	};
	var ID_ID = {
		name: "Indonesia",
		code: "id-ID",
		resource: id_default
	};
	var JA_JP = {
		name: "日本語",
		code: "ja-JP",
		resource: jp_default
	};
	var RU = {
		name: "Русский",
		code: "ru",
		resource: ru_default
	};
	var TR_TR = {
		name: "Türkçe",
		code: "tr-TR",
		resource: tr_default
	};
	var ZH_Hans = {
		name: "简体中文",
		code: "zh-Hans",
		resource: zh_Hans_default
	};
	var ZH_Hant = {
		name: "繁體中文",
		code: "zh-Hant",
		resource: zh_Hant_default
	};
	var LOCALES = [
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
	var LanguageMapping = {
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
	var resources = LOCALES.reduce((acc, cur) => {
		acc[cur.code] = cur.resource;
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
		if (languages && languages.length) return languages[0];
		return null;
	}
	function getOaiLanguage() {
		return (window?.localStorage?.getItem("oai/apps/locale"))?.replace(/^"(.*)"$/, "$1") ?? null;
	}
	function getDefaultLanguage() {
		const storedLanguage = ScriptStorage.get(KEY_LANGUAGE);
		const oaiLanguage = getOaiLanguage();
		const browserLanguage = getNavigatorLanguage();
		return standardizeLanguage(storedLanguage) ?? standardizeLanguage(oaiLanguage) ?? standardizeLanguage(browserLanguage) ?? EN_US.code;
	}
	var language = getDefaultLanguage();
	var listeners = new Set();
	function t(key, options) {
		const template = resources[language]?.[key] ?? resources[EN_US.code][key] ?? key;
		if (!options) return template;
		return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, name) => String(options[name] ?? ""));
	}
	function changeLanguage(lng) {
		if (lng === language) return;
		language = lng;
		ScriptStorage.set(KEY_LANGUAGE, lng);
		listeners.forEach((listener) => listener());
	}
	function subscribe$2(listener) {
		listeners.add(listener);
		return () => listeners.delete(listener);
	}
	var i18n = {
		t,
		changeLanguage,
		get language() {
			return language;
		}
	};
	var translators = new Map();
	function getTranslator(lng) {
		let translator = translators.get(lng);
		if (!translator) {
			translator = (key, options) => t(key, options);
			translators.set(lng, translator);
		}
		return translator;
	}
	function useTranslation() {
		return {
			t: getTranslator(En(subscribe$2, () => language)),
			i18n
		};
	}
	var template_default = "<!DOCTYPE html>\n<html lang=\"{{lang}}\" data-theme=\"{{theme}}\">\n<head>\n    <meta charset=\"UTF-8\" />\n    <link rel=\"icon\" href=\"https://chat.openai.com/favicon.ico\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>{{title}}</title>\n    <link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/github-dark.min.css\">\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js\"><\/script>\n    <script>\n        hljs.highlightAll()\n    <\/script>\n    <link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.3/katex.min.css\">\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.3/katex.min.js\"><\/script>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.3/contrib/auto-render.min.js\"><\/script>\n    <script>\n        document.addEventListener(\"DOMContentLoaded\", function() {\n            renderMathInElement(document.body, {\n                delimiters: [\n                    { left: \"\\\\[\", right: \"\\\\]\", display: true },\n                    { left: \"\\\\(\", right: \"\\\\)\", display: false }\n                ],\n                throwOnError: false,\n                ignoredClasses: [\"no-katex\"]\n            });\n        });\n    <\/script>\n\n    <style>\n        :root {\n            --page-text: #0d0d0d;\n            --page-bg: #fff;\n            --td-borders: #374151;\n            --th-borders: #4b5563;\n            --tw-prose-code: var(--page-text);\n            --tw-prose-counters: #9b9b9b;\n            --tw-prose-headings: var(--page-text);\n            --tw-prose-hr: rgba(0,0,0,.25);\n            --tw-prose-links: var(--page-text);\n            --tw-prose-quotes: var(--page-text);\n            --meta-title: #616c77;\n        }\n\n        [data-theme=\"dark\"] {\n            --page-text: #ececec;\n            --page-bg: #212121;\n            --tw-prose-code: var(--page-text);\n            --tw-prose-counters: #9b9b9b;\n            --tw-prose-headings: var(--page-text);\n            --tw-prose-hr: hsla(0,0%,100%,.25);\n            --tw-prose-links: var(--page-text);\n            --tw-prose-quotes: var(--page-text);\n            --meta-title: #959faa;\n        }\n\n        * {\n            box-sizing: border-box;\n            font-size: 16px;\n        }\n\n        ::-webkit-scrollbar {\n            height: 1rem;\n            width: .5rem\n        }\n\n        ::-webkit-scrollbar:horizontal {\n            height: .5rem;\n            width: 1rem\n        }\n\n        ::-webkit-scrollbar-track {\n            background-color: transparent;\n            border-radius: 9999px\n        }\n\n        ::-webkit-scrollbar-thumb {\n            --tw-border-opacity: 1;\n            background-color: rgba(217,217,227,.8);\n            border-color: rgba(255,255,255,var(--tw-border-opacity));\n            border-radius: 9999px;\n            border-width: 1px\n        }\n\n        ::-webkit-scrollbar-thumb:hover {\n            --tw-bg-opacity: 1;\n            background-color: rgba(236,236,241,var(--tw-bg-opacity))\n        }\n\n        [data-theme=\"dark\"] ::-webkit-scrollbar-thumb {\n            --tw-bg-opacity: 1;\n            background-color: rgba(86,88,105,var(--tw-bg-opacity))\n        }\n\n        [data-theme=\"dark\"] ::-webkit-scrollbar-thumb:hover {\n            --tw-bg-opacity: 1;\n            background-color: rgba(172,172,190,var(--tw-bg-opacity))\n        }\n\n        @media (min-width: 768px) {\n            .scrollbar-trigger ::-webkit-scrollbar-thumb {\n                visibility:hidden\n            }\n\n            .scrollbar-trigger:hover ::-webkit-scrollbar-thumb {\n                visibility: visible\n            }\n        }\n\n        body {\n            font-family: Söhne,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,Helvetica Neue,Arial,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;\n            font-size: 14px;\n            line-height: 1.5;\n            color: var(--page-text);\n            background-color: var(--page-bg);\n            margin: 0;\n            padding: 0;\n        }\n\n        [data-theme=\"light\"] .sun {\n            display: none;\n        }\n\n        [data-theme=\"dark\"] .moon {\n            display: none;\n        }\n\n        .toggle {\n            display: inline-flex;\n            justify-content: center;\n            align-items: center;\n            width: 32px;\n            height: 32px;\n            border-radius: 4px;\n            background-color: #fff;\n            border: 1px solid #e2e8f0;\n        }\n\n        [data-width=\"narrow\"] .width-toggle .expand {\n            display: block;\n        }\n\n        [data-width=\"wide\"] .width-toggle .narrow {\n            display: block;\n        }\n\n        .width-toggle {\n            display: inline-flex;\n            justify-content: center;\n            align-items: center;\n            width: 32px;\n            height: 32px;\n            border-radius: 4px;\n            background-color: #fff;\n            border: 1px solid #e2e8f0;\n            margin-left: 8px;\n            cursor: pointer;\n        }\n\n        .width-toggle svg {\n            display: none;\n        }\n\n        .metadata_container {\n            display: flex;\n            flex-direction: column;\n            margin-top: 8px;\n            padding-left: 1rem;\n        }\n\n        .metadata_item {\n            display: flex;\n            flex-direction: row;\n            align-items: center;\n            border-radius: 16px;\n            padding: 4px 0.5rem;\n        }\n\n        .metadata_item:hover {\n            background-color: rgba(0,0,0,.1);\n        }\n\n        .metadata_item > div:first-child {\n            flex: 0 1 100px;\n            color: var(--meta-title);\n        }\n\n        .metadata_item > div:last-child {\n            flex: 1;\n        }\n\n        a {\n            color: var(--tw-prose-links);\n            font-size: 0.8rem;\n            text-decoration-line: underline;\n            text-underline-offset: 2px;\n        }\n\n        .conversation-content > p:first-child,\n        ol:first-child {\n            margin-top: 0;\n        }\n\n        :not(pre)>code {\n            color: var(--tw-prose-code);\n            font-family: ui-monospace, SFMono-Regular, \"SF Mono\", Menlo, Consolas, monospace;\n            font-size: .92em;\n            background-color: rgba(0, 0, 0, .09);\n            border-radius: 6px;\n            padding: 1px 6px;\n        }\n\n        [data-theme=\"dark\"] :not(pre)>code {\n            background-color: rgba(255, 255, 255, .1);\n        }\n\n        hr {\n            width: 100%;\n            height: 0;\n            border: 1px solid var(--tw-prose-hr);\n            margin-bottom: 1em;\n            margin-top: 1em;\n        }\n\n        pre {\n            color: #ffffff;\n            background-color: #000000;\n            overflow-x: auto;\n            margin: 0 0 1rem 0;\n            padding: 1rem;\n            border-radius: 0.375rem;\n        }\n\n        /* The highlight.js theme pads and colors `code.hljs`, but only for languages it knows */\n        pre>code.hljs {\n            padding: 0;\n            background: none;\n        }\n\n        pre>code {\n            font-family: Söhne Mono, Monaco, Andale Mono, Ubuntu Mono, monospace !important;\n            font-weight: 400;\n            font-size: .875em;\n            line-height: 1.7142857;\n        }\n\n        h1, h2, h3, h4, h5, h6 {\n            color: var(--tw-prose-headings);\n            margin: 0;\n        }\n\n        h1 {\n            font-size: 2.25em;\n            font-weight: 600;\n            line-height: 1.1111111;\n            margin-bottom: 0.8888889em;\n            margin-top: 0;\n        }\n\n        h2 {\n            font-size: 1.5em;\n            font-weight: 700;\n            line-height: 1.3333333;\n            margin-bottom: 1em;\n            margin-top: 2em;\n        }\n\n        h3 {\n            font-size: 1.25em;\n            font-weight: 600;\n            line-height: 1.6;\n            margin-bottom: .6em;\n            margin-top: 1.6em;\n        }\n\n        h4 {\n            font-weight: 400;\n            line-height: 1.5;\n            margin-bottom: .5em;\n            margin-top: 1.5em\n        }\n\n        h3,h4 {\n            margin-bottom: .5rem;\n            margin-top: 1rem;\n        }\n\n        h5 {\n            font-weight: 600;\n        }\n\n        blockquote {\n            border-left: 2px solid rgba(142,142,160,1);\n            color: var(--tw-prose-quotes);\n            font-style: italic;\n            font-style: normal;\n            font-weight: 500;\n            line-height: 1rem;\n            margin: 1.6em 0;\n            padding-left: 1em;\n            quotes: \"\\201C\"\"\\201D\"\"\\2018\"\"\\2019\";\n        }\n\n        blockquote p:first-of-type:before {\n            content: open-quote;\n        }\n\n        blockquote p:last-of-type:after {\n            content: close-quote;\n        }\n\n        ol, ul {\n            padding-left: 1.1rem;\n        }\n\n        ::marker {\n            color: var(--tw-prose-counters);\n            font-weight: 400;\n        }\n\n        table {\n            width: 100%;\n            border-collapse: separate;\n            border-spacing: 0 0;\n            table-layout: auto;\n            text-align: left;\n            font-size: .875em;\n            line-height: 1.7142857;\n        }\n\n        table * {\n            box-sizing: border-box;\n            border-width: 0;\n            border-style: solid;\n            border-color: #d9d9e3;\n        }\n\n        table thead {\n            border-bottom-color: var(--th-borders);\n            border-bottom-width: 1px;\n        }\n\n        table th {\n            background-color: rgba(236,236,241,.2);\n            border-bottom-width: 1px;\n            border-left-width: 1px;\n            border-top-width: 1px;\n            padding: 0.25rem 0.75rem;\n        }\n\n        table th:first-child {\n            border-top-left-radius: 0.375rem;\n        }\n\n        table th:last-child {\n            border-right-width: 1px;\n            border-top-right-radius: 0.375rem;\n        }\n\n        table tbody tr {\n            border-bottom-color: var(--td-borders);\n            border-bottom-width: 1px;\n        }\n\n        table tbody tr:last-child {\n            border-bottom-width: 0;\n        }\n\n        table tbody tr:last-child td:first-child {\n            border-bottom-left-radius: 0.375rem;\n        }\n\n        table tbody tr:last-child td:last-child {\n            border-bottom-right-radius: 0.375rem;\n        }\n\n        table td {\n            border-bottom-width: 1px;\n            border-left-width: 1px;\n            padding: 0.25rem 0.75rem;\n        }\n\n        table td:last-child {\n            border-right-width: 1px;\n        }\n\n        [type=checkbox], [type=radio] {\n            accent-color: #2563eb;\n        }\n\n        .conversation {\n            margin: 0 auto;\n            padding: 1rem;\n            max-width: 64rem;\n        }\n\n        [data-width=\"narrow\"] .conversation {\n            max-width: 64rem;\n        }\n\n        [data-width=\"wide\"] .conversation {\n            max-width: 90%;\n        }\n\n        @media (min-width: 1280px) {\n            .conversation {\n                max-width: 48rem;\n            }\n        }\n\n        @media (min-width: 1024px) {\n            .conversation {\n                max-width: 40rem;\n            }\n        }\n\n        @media (min-width: 768px) {\n            .conversation {\n                max-width: 48rem;\n            }\n        }\n\n        .conversation-header {\n            margin-bottom: 1rem;\n        }\n\n        .conversation-header h1 {\n            margin: 0;\n        }\n\n        .conversation-header h1 a {\n            font-size: 1.5rem;\n        }\n\n        .conversation-header .conversation-export {\n            margin-top: 0.5rem;\n            font-size: 0.8rem;\n        }\n\n        .conversation-header p {\n            margin-top: 0.5rem;\n            font-size: 0.8rem;\n        }\n\n        .conversation-item {\n            display: flex;\n            position: relative;\n            padding: 1rem;\n            border-left: 1px solid rgba(0,0,0,.1);\n            border-right: 1px solid rgba(0,0,0,.1);\n            border-bottom: 1px solid rgba(0,0,0,.1);\n        }\n\n        .conversation-item:first-of-type {\n            border-top: 1px solid rgba(0,0,0,.1);\n        }\n\n        .author {\n            display: flex;\n            flex: 0 0 30px;\n            justify-content: center;\n            align-items: center;\n            width: 30px;\n            height: 30px;\n            border-radius: 0.125rem;\n            margin-right: 1rem;\n            overflow: hidden;\n        }\n\n        .author svg {\n            color: #fff;\n            width: 22px;\n            height: 22px;\n        }\n\n        .author img {\n            content: url({{avatar}});\n            width: 100%;\n            height: 100%;\n        }\n\n        .author.assistant {\n            background-color: rgb(16, 163, 127);\n        }\n\n        .conversation-content-wrapper {\n            display: flex;\n            position: relative;\n            overflow: hidden;\n            flex: 1 1 auto;\n            flex-direction: column;\n        }\n\n        .thinking {\n            font-size: 0.875rem;\n            line-height: 1.5;\n            margin-bottom: 0.75rem;\n            border: 1px solid #d1d5db;\n            border-radius: 0.5rem;\n            padding: 0.5rem 0.75rem;\n        }\n\n        .thinking summary {\n            cursor: pointer;\n            font-weight: 500;\n            color: #6b7280;\n        }\n\n        .thinking p {\n            margin: 0.5rem 0;\n            color: #6b7280;\n        }\n\n        [data-theme=\"dark\"] .thinking {\n            border-color: #4b5563;\n        }\n\n        [data-theme=\"dark\"] .thinking summary,\n        [data-theme=\"dark\"] .thinking p {\n            color: #9ca3af;\n        }\n\n        .conversation-content {\n            font-size: 1rem;\n            line-height: 1.5;\n        }\n\n        .conversation-content p {\n            white-space: pre-wrap;\n            line-height: 28px;\n        }\n\n        .conversation-content img, .conversation-content video {\n            display: block;\n            max-width: 100%;\n            height: auto;\n            margin-bottom: 2em;\n            margin-top: 2em;\n        }\n\n        .attachments {\n            list-style: none;\n            margin: 0.5rem 0 0;\n            padding: 0;\n            font-size: 0.875rem;\n            color: #6b7280;\n        }\n\n        [data-theme=\"dark\"] .attachments {\n            color: #9ca3af;\n        }\n\n        .time {\n            position: absolute;\n            right: 8px;\n            bottom: 0;\n            font-size: 0.8rem;\n            color: #acacbe\n        }\n\n    </style>\n</head>\n\n<body>\n    <svg aria-hidden=\"true\" style=\"position: absolute; width: 0; height: 0; overflow: hidden;\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n        <symbol id=\"chatgpt\" viewBox=\"0 0 41 41\">\n            <path d=\"M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500197C16.1708 0.495044 14.0893 1.16803 12.3614 2.42214C10.6335 3.67624 9.34853 5.44666 8.6917 7.47815C7.30085 7.76286 5.98686 8.3414 4.8377 9.17505C3.68854 10.0087 2.73073 11.0782 2.02839 12.312C0.956464 14.1591 0.498905 16.2988 0.721698 18.4228C0.944492 20.5467 1.83612 22.5449 3.268 24.1293C2.81966 25.4759 2.66413 26.9026 2.81182 28.3141C2.95951 29.7256 3.40701 31.0892 4.12437 32.3138C5.18791 34.1659 6.8123 35.6322 8.76321 36.5013C10.7141 37.3704 12.8907 37.5973 14.9789 37.1492C15.9208 38.2107 17.0786 39.0587 18.3747 39.6366C19.6709 40.2144 21.0755 40.5087 22.4946 40.4998C24.6307 40.5054 26.7133 39.8321 28.4418 38.5772C30.1704 37.3223 31.4556 35.5506 32.1119 33.5179C33.5027 33.2332 34.8167 32.6547 35.9659 31.821C37.115 30.9874 38.0728 29.9178 38.7752 28.684C39.8458 26.8371 40.3023 24.6979 40.0789 22.5748C39.8556 20.4517 38.9639 18.4544 37.5324 16.8707ZM22.4978 37.8849C20.7443 37.8874 19.0459 37.2733 17.6994 36.1501C17.7601 36.117 17.8666 36.0586 17.936 36.0161L25.9004 31.4156C26.1003 31.3019 26.2663 31.137 26.3813 30.9378C26.4964 30.7386 26.5563 30.5124 26.5549 30.2825V19.0542L29.9213 20.998C29.9389 21.0068 29.9541 21.0198 29.9656 21.0359C29.977 21.052 29.9842 21.0707 29.9867 21.0902V30.3889C29.9842 32.375 29.1946 34.2791 27.7909 35.6841C26.3872 37.0892 24.4838 37.8806 22.4978 37.8849ZM6.39227 31.0064C5.51397 29.4888 5.19742 27.7107 5.49804 25.9832C5.55718 26.0187 5.66048 26.0818 5.73461 26.1244L13.699 30.7248C13.8975 30.8408 14.1233 30.902 14.3532 30.902C14.583 30.902 14.8088 30.8408 15.0073 30.7248L24.731 25.1103V28.9979C24.7321 29.0177 24.7283 29.0376 24.7199 29.0556C24.7115 29.0736 24.6988 29.0893 24.6829 29.1012L16.6317 33.7497C14.9096 34.7416 12.8643 35.0097 10.9447 34.4954C9.02506 33.9811 7.38785 32.7263 6.39227 31.0064ZM4.29707 13.6194C5.17156 12.0998 6.55279 10.9364 8.19885 10.3327C8.19885 10.4013 8.19491 10.5228 8.19491 10.6071V19.808C8.19351 20.0378 8.25334 20.2638 8.36823 20.4629C8.48312 20.6619 8.64893 20.8267 8.84863 20.9404L18.5723 26.5542L15.206 28.4979C15.1894 28.5089 15.1703 28.5155 15.1505 28.5173C15.1307 28.5191 15.1107 28.516 15.0924 28.5082L7.04046 23.8557C5.32135 22.8601 4.06716 21.2235 3.55289 19.3046C3.03862 17.3858 3.30624 15.3413 4.29707 13.6194ZM31.955 20.0556L22.2312 14.4411L25.5976 12.4981C25.6142 12.4872 25.6333 12.4805 25.6531 12.4787C25.6729 12.4769 25.6928 12.4801 25.7111 12.4879L33.7631 17.1364C34.9967 17.849 36.0017 18.8982 36.6606 20.1613C37.3194 21.4244 37.6047 22.849 37.4832 24.2684C37.3617 25.6878 36.8382 27.0432 35.9743 28.1759C35.1103 29.3086 33.9415 30.1717 32.6047 30.6641C32.6047 30.5947 32.6047 30.4733 32.6047 30.3889V21.188C32.6066 20.9586 32.5474 20.7328 32.4332 20.5338C32.319 20.3348 32.154 20.1698 31.955 20.0556ZM35.3055 15.0128C35.2464 14.9765 35.1431 14.9142 35.069 14.8717L27.1045 10.2712C26.906 10.1554 26.6803 10.0943 26.4504 10.0943C26.2206 10.0943 25.9948 10.1554 25.7963 10.2712L16.0726 15.8858V11.9982C16.0715 11.9783 16.0753 11.9585 16.0837 11.9405C16.0921 11.9225 16.1048 11.9068 16.1207 11.8949L24.1719 7.25025C25.4053 6.53903 26.8158 6.19376 28.2383 6.25482C29.6608 6.31589 31.0364 6.78077 32.2044 7.59508C33.3723 8.40939 34.2842 9.53945 34.8334 10.8531C35.3826 12.1667 35.5464 13.6095 35.3055 15.0128ZM14.2424 21.9419L10.8752 19.9981C10.8576 19.9893 10.8423 19.9763 10.8309 19.9602C10.8195 19.9441 10.8122 19.9254 10.8098 19.9058V10.6071C10.8107 9.18295 11.2173 7.78848 11.9819 6.58696C12.7466 5.38544 13.8377 4.42659 15.1275 3.82264C16.4173 3.21869 17.8524 2.99464 19.2649 3.1767C20.6775 3.35876 22.0089 3.93941 23.1034 4.85067C23.0427 4.88379 22.937 4.94215 22.8668 4.98473L14.9024 9.58517C14.7025 9.69878 14.5366 9.86356 14.4215 10.0626C14.3065 10.2616 14.2466 10.4877 14.2479 10.7175L14.2424 21.9419ZM16.071 17.9991L20.4018 15.4978L24.7325 17.9975V22.9985L20.4018 25.4983L16.071 22.9985V17.9991Z\" fill=\"currentColor\"></path>\n        </symbol>\n    </svg>\n    <div class=\"conversation\">\n        <div class=\"conversation-header\">\n            <h1>\n                <a href=\"{{source}}\" target=\"_blank\" rel=\"noopener noreferrer\">{{title}}</a>\n                <button class=\"toggle\">\n                    <svg class=\"sun\" stroke=\"currentColor\" fill=\"none\" stroke-width=\"2\" viewBox=\"0 0 24 24\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"w-4 h-4\" height=\"1em\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"12\" cy=\"12\" r=\"5\"></circle><line x1=\"12\" y1=\"1\" x2=\"12\" y2=\"3\"></line><line x1=\"12\" y1=\"21\" x2=\"12\" y2=\"23\"></line><line x1=\"4.22\" y1=\"4.22\" x2=\"5.64\" y2=\"5.64\"></line><line x1=\"18.36\" y1=\"18.36\" x2=\"19.78\" y2=\"19.78\"></line><line x1=\"1\" y1=\"12\" x2=\"3\" y2=\"12\"></line><line x1=\"21\" y1=\"12\" x2=\"23\" y2=\"12\"></line><line x1=\"4.22\" y1=\"19.78\" x2=\"5.64\" y2=\"18.36\"></line><line x1=\"18.36\" y1=\"5.64\" x2=\"19.78\" y2=\"4.22\"></line></svg>\n                    <svg class=\"moon\" stroke=\"currentColor\" fill=\"none\" stroke-width=\"2\" viewBox=\"0 0 24 24\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"w-4 h-4\" height=\"1em\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z\"></path></svg>\n                </button>\n                <button class=\"toggle width-toggle\">\n                    <svg class=\"expand\" stroke=\"currentColor\" fill=\"none\" stroke-width=\"2\" viewBox=\"0 0 24 24\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"w-4 h-4\" height=\"1em\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\" style=\"display: block;\">\n                        <path d=\"M3 12h18M6 8l-4 4 4 4M18 8l4 4-4 4\"></path>\n                    </svg>\n                    <svg class=\"narrow\" stroke=\"currentColor\" fill=\"none\" stroke-width=\"2\" viewBox=\"0 0 24 24\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"w-4 h-4\" height=\"1em\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\" style=\"display: none;\">\n                        <path d=\"M3 12h7M14 12h7M6 16l4-4-4-4M18 16l-4-4 4-4\"></path>\n                    </svg>\n                </button>\n            </h1>\n            <div class=\"conversation-export\">\n                <p>Exported by\n                <a href=\"https://github.com/pionxzh/chatgpt-exporter.git\">ChatGPT Exporter</a>\n                at {{time}}</p>\n            </div>\n            {{details}}\n        </div>\n\n        {{content}}\n    </div>\n\n\n    <script>\n        function toggleDarkMode(mode) {\n            const html = document.querySelector('html');\n            const isDarkMode = html.getAttribute('data-theme') === 'dark';\n            const newMode = mode || (isDarkMode ? 'light' : 'dark');\n            if (newMode !== 'dark' && newMode !== 'light') return;\n            html.setAttribute('data-theme', newMode);\n\n            const url = new URL(window.location);\n            url.searchParams.set('theme', newMode);\n            window.history.replaceState({}, '', url);\n        }\n        function toggleWidthMode(mode) {\n            const body = document.querySelector('body');\n            const widthToggleButton = document.querySelector('.width-toggle');\n            const isWide = body.getAttribute('data-width') === 'wide';\n            const newWidthMode = mode || (isWide ? 'narrow' : 'wide');\n            if (newWidthMode !== 'narrow' && newWidthMode !== 'wide') return;\n            body.setAttribute('data-width', newWidthMode);\n\n            const url = new URL(window.location);\n            url.searchParams.set('width', newWidthMode);\n            window.history.replaceState({}, '', url);\n\n            // Update the icon based on the current mode\n            const narrowIcon = widthToggleButton.querySelector('.narrow');\n            const expandIcon = widthToggleButton.querySelector('.expand');\n\n            if (newWidthMode === 'wide') {\n                expandIcon.style.display = \"none\";\n                narrowIcon.style.display = \"block\";\n            } else {\n                expandIcon.style.display = \"block\";\n                narrowIcon.style.display = \"none\";\n            }\n        }\n\n        const urlParams = new URLSearchParams(window.location.search);\n        const theme = urlParams.get('theme');\n        const width = urlParams.get('width');\n\n        if (theme) toggleDarkMode(theme);\n        if (width) toggleWidthMode(width);\n\n        document.querySelector('.toggle').addEventListener('click', () => toggleDarkMode());\n        document.querySelector('.width-toggle').addEventListener('click', () => toggleWidthMode());\n    <\/script>\n</body>\n\n</html>\n";
	var CitationMarkerRegex = /\uE200cite(?:\uE202[^\uE200\uE201]*)+\uE201/gu;
	function normalizeCitationText(input) {
		return input.replaceAll(/[\u00A0\u202F\u2007\u2060]/gu, " ").replaceAll(/[\u2010-\u2015\u2212]/gu, "-").replaceAll(/[\uE203\uE204]/gu, "");
	}
	function transformContentReferences(input, metadata, options = {}) {
		const outputType = options.output ?? "markdown";
		const inlineReferenceMode = options.inlineReferenceMode ?? "expanded";
		const contentRefs = metadata?.content_references ?? [];
		let output = normalizeCitationText(input);
		const sortedRefs = [...contentRefs].filter((ref) => ref.type !== "sources_footnote").sort((a, b) => (b.matched_text?.length || 0) - (a.matched_text?.length || 0));
		const fileReplacements = new Set();
		for (const ref of sortedRefs) {
			if (!ref.matched_text) continue;
			const matchedText = normalizeCitationText(ref.matched_text);
			if (!matchedText) continue;
			const replacement = formatInlineReference(ref, outputType, inlineReferenceMode);
			output = output.replaceAll(matchedText, () => replacement);
			if (ref.type === "file" && replacement) fileReplacements.add(replacement);
		}
		for (const replacement of fileReplacements) {
			const escaped = escapeRegExp(replacement);
			output = output.replaceAll(new RegExp(`${escaped}(?:\\s*${escaped})+`, "g"), () => replacement);
		}
		output = output.replace(CitationMarkerRegex, "");
		if (options.includeSourceList !== false) {
			const sources = getSourcesFootnoteSources(contentRefs);
			if (sources.length > 0) output = appendSourcesSection(output, sources, outputType, options.sourceListLabel ?? "Sources");
		}
		return output;
	}
	function formatCitationSource(source, output) {
		const label = getSourceLabel(source);
		const url = source.url?.trim();
		if (!url) return output === "markdown" ? escapeMarkdownText(label) : label;
		if (output === "text") return `${label}: ${url}`;
		return `[${escapeMarkdownText(label)}](<${escapeMarkdownUrl(url)}>)`;
	}
	function formatInlineReference(ref, output, mode) {
		if (mode === "alt") return formatAlt(ref.alt);
		if (output === "markdown" && (ref.type === "image_group" || ref.type === "image_v2")) {
			const images = formatImageResults(ref);
			if (images) return images;
			return formatAlt(ref.alt);
		}
		const sources = getInlineSources(ref);
		if (sources.length > 0) {
			const separator = output === "markdown" ? ", " : "; ";
			return `(${sources.map((source) => formatCitationSource(source, output)).join(separator)})`;
		}
		return formatAlt(ref.alt);
	}
	function formatImageResults(ref) {
		return (ref.images ?? []).map((entry) => {
			const image = entry.image_result ?? entry;
			const src = image.content_url?.trim();
			if (!src) return "";
			const markdown = `![${escapeMarkdownText(image.title?.trim() || "Image")}](<${escapeMarkdownUrl(src)}>)`;
			const page = image.url?.trim();
			return page ? `[${markdown}](<${escapeMarkdownUrl(page)}>)` : markdown;
		}).filter(Boolean).join("\n\n");
	}
	function formatAlt(alt) {
		return alt?.replaceAll(/\[([^\]]*)\]\(\)/g, "$1") ?? "";
	}
	function getInlineSources(ref) {
		const sources = [];
		for (const item of ref.items ?? []) {
			sources.push(item);
			sources.push(...item.supporting_websites ?? []);
		}
		sources.push(...ref.fallback_items ?? []);
		if (sources.length === 0 && ref.type === "file" && ref.name) sources.push({ title: ref.name });
		if (sources.length === 0 && (ref.url || ref.title || ref.attribution)) sources.push(ref);
		const safeUrls = ref.safe_urls?.filter(Boolean) ?? [];
		if (sources.length === 0 && safeUrls.length) sources.push(...safeUrls.map((url) => ({
			title: url,
			url
		})));
		return dedupeSources(sources);
	}
	function getSourcesFootnoteSources(contentRefs) {
		return dedupeSources(contentRefs.filter((ref) => ref.type === "sources_footnote").flatMap((ref) => {
			if (ref.sources?.length) return ref.sources;
			if (ref.items?.length) return ref.items;
			if (ref.fallback_items?.length) return ref.fallback_items;
			if (ref.safe_urls?.length) return ref.safe_urls.map((url) => ({
				title: url,
				url
			}));
			return [];
		}));
	}
	function appendSourcesSection(input, sources, output, label) {
		const trimmed = input.trimEnd();
		const sourceList = output === "markdown" ? [
			`**${escapeMarkdownText(label)}:**`,
			"",
			...sources.map((source) => `- ${formatCitationSource(source, output)}`)
		].join("\n") : [`${label}:`, ...sources.map((source, index) => `${index + 1}. ${formatCitationSource(source, output)}`)].join("\n");
		return trimmed ? `${trimmed}\n\n${sourceList}` : sourceList;
	}
	function dedupeSources(sources) {
		const seen = new Set();
		const result = [];
		for (const source of sources) {
			const key = source.url?.trim() || getSourceLabel(source);
			if (!key || seen.has(key)) continue;
			seen.add(key);
			result.push(source);
		}
		return result;
	}
	function getSourceLabel(source) {
		return source.attribution?.trim() || source.title?.trim() || source.url?.trim() || "Source";
	}
	function escapeMarkdownText(input) {
		return input.replaceAll("\\", "\\\\").replaceAll("[", "\\[").replaceAll("]", "\\]").replaceAll("\n", " ");
	}
	function escapeMarkdownUrl(input) {
		return input.replaceAll("<", "%3C").replaceAll(">", "%3E").replaceAll("\n", "");
	}
	function escapeRegExp(input) {
		return input.replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&");
	}
	var require_truncate = __commonJSMin(((exports, module) => {
		function isHighSurrogate(codePoint) {
			return codePoint >= 55296 && codePoint <= 56319;
		}
		function isLowSurrogate(codePoint) {
			return codePoint >= 56320 && codePoint <= 57343;
		}
		module.exports = function truncate(getLength, string, byteLength) {
			if (typeof string !== "string") throw new Error("Input must be string");
			var charLength = string.length;
			var curByteLength = 0;
			var codePoint;
			var segment;
			for (var i = 0; i < charLength; i += 1) {
				codePoint = string.charCodeAt(i);
				segment = string[i];
				if (isHighSurrogate(codePoint) && isLowSurrogate(string.charCodeAt(i + 1))) {
					i += 1;
					segment += string[i];
				}
				curByteLength += getLength(segment);
				if (curByteLength === byteLength) return string.slice(0, i + 1);
				else if (curByteLength > byteLength) return string.slice(0, i - segment.length + 1);
			}
			return string;
		};
	}));
	var require_browser$1 = __commonJSMin(((exports, module) => {
		function isHighSurrogate(codePoint) {
			return codePoint >= 55296 && codePoint <= 56319;
		}
		function isLowSurrogate(codePoint) {
			return codePoint >= 56320 && codePoint <= 57343;
		}
		module.exports = function getByteLength(string) {
			if (typeof string !== "string") throw new Error("Input must be string");
			var charLength = string.length;
			var byteLength = 0;
			var codePoint = null;
			var prevCodePoint = null;
			for (var i = 0; i < charLength; i++) {
				codePoint = string.charCodeAt(i);
				if (isLowSurrogate(codePoint)) {
					if (prevCodePoint != null && isHighSurrogate(prevCodePoint)) byteLength += 1;
					else byteLength += 3;
				} else if (codePoint <= 127) byteLength += 1;
				else if (codePoint >= 128 && codePoint <= 2047) byteLength += 2;
				else if (codePoint >= 2048 && codePoint <= 65535) byteLength += 3;
				prevCodePoint = codePoint;
			}
			return byteLength;
		};
	}));
	var require_browser = __commonJSMin(((exports, module) => {
		var truncate = require_truncate();
		var getLength = require_browser$1();
		module.exports = truncate.bind(null, getLength);
	}));
	var import_sanitize_filename = __toESM(__commonJSMin(((exports, module) => {
		var truncate = require_browser();
		var illegalRe = /[\/\?<>\\:\*\|"]/g;
		var controlRe = /[\x00-\x1f\x80-\x9f]/g;
		var reservedRe = /^\.+$/;
		var windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
		var windowsTrailingRe = /[\. ]+$/;
		function sanitize(input, replacement) {
			if (typeof input !== "string") throw new Error("Input must be string");
			return truncate(input.replace(illegalRe, replacement).replace(controlRe, replacement).replace(reservedRe, replacement).replace(windowsReservedRe, replacement).replace(windowsTrailingRe, replacement), 255);
		}
		module.exports = function(input, options) {
			var replacement = options && options.replacement || "";
			var output = sanitize(input, replacement);
			if (replacement === "") return output;
			return sanitize(output, "");
		};
	}))(), 1);
	function noop() {}
	function nonNullable(x) {
		return x != null;
	}
	function onloadSafe(fn) {
		if (document.readyState === "complete") fn();
		else window.addEventListener("load", fn);
	}
	var _WORKER_SRC = "onmessage=function(e){setTimeout(function(){postMessage(e.data)},e.data.ms)}";
	var _sleepWorker = null;
	var _sleepWorkerFailed = false;
	var _pendingResolves = new Map();
	var _sleepIdCounter = 0;
	function _getSleepWorker() {
		if (_sleepWorkerFailed) return null;
		if (_sleepWorker) return _sleepWorker;
		try {
			const blob = new Blob([_WORKER_SRC], { type: "application/javascript" });
			const url = URL.createObjectURL(blob);
			const w = new Worker(url);
			URL.revokeObjectURL(url);
			w.onmessage = (e) => {
				const resolve = _pendingResolves.get(e.data.id);
				if (resolve) {
					_pendingResolves.delete(e.data.id);
					resolve();
				}
			};
			w.onerror = () => {
				_sleepWorkerFailed = true;
				_sleepWorker = null;
				for (const resolve of _pendingResolves.values()) resolve();
				_pendingResolves.clear();
			};
			_sleepWorker = w;
			return w;
		} catch {
			_sleepWorkerFailed = true;
			return null;
		}
	}
	function sleep(ms) {
		if (ms <= 0) return Promise.resolve();
		const worker = _getSleepWorker();
		if (!worker) return new Promise((resolve) => setTimeout(resolve, ms));
		return new Promise((resolve) => {
			const id = _sleepIdCounter++;
			_pendingResolves.set(id, resolve);
			worker.postMessage({
				id,
				ms
			});
		});
	}
	function dateStr(date = new Date()) {
		return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
	}
	function timestamp() {
		return new Date().toISOString().replace(/:/g, "-").replace(/\..+/, "");
	}
	function getColorScheme() {
		const root = document.documentElement;
		const theme = root.getAttribute("data-theme");
		if (theme === "light" || theme === "dark") return theme;
		if (root.classList.contains("dark")) return "dark";
		if (root.classList.contains("light")) return "light";
		const scheme = getComputedStyle(root).colorScheme;
		if (scheme === "light" || scheme === "dark") return scheme;
		return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
	}
	function unixTimestampToISOString(timestamp) {
		if (!timestamp) return "";
		return new Date(timestamp * 1e3).toISOString();
	}
	function jsonlStringify(list) {
		return list.map((msg) => JSON.stringify(msg)).join("\n");
	}
	function downloadFile(filename, type, content) {
		const blob = content instanceof Blob ? content : new Blob([content], { type });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		setTimeout(() => URL.revokeObjectURL(url), 1e3);
	}
	function normalizeProjectName(projectName) {
		return projectName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
	}
	function partSuffix(partInfo) {
		if (!partInfo || partInfo.total <= 1) return "";
		const pad = (n) => String(n).padStart(2, "0");
		return `-part-${pad(partInfo.part)}-of-${pad(partInfo.total)}`;
	}
	function buildZipFileName(format, projectName, partInfo) {
		const suffix = partSuffix(partInfo);
		if (projectName) return `chatgpt-export-${format}-project-${normalizeProjectName(projectName)}${suffix}.zip`;
		return `chatgpt-export-${format}${suffix}.zip`;
	}
	function buildJsonBatchFileName(projectName, partInfo) {
		const suffix = partSuffix(partInfo);
		if (projectName) return `chatgpt-export-project-${normalizeProjectName(projectName)}${suffix}.json`;
		return `chatgpt-export${suffix}.json`;
	}
	function getFileNameWithFormat(format, ext, { title = document.title, chatId = "", createTime = Math.floor(Date.now() / 1e3), updateTime = Math.floor(Date.now() / 1e3) } = {}) {
		const _title = (0, import_sanitize_filename.default)(title).replace(/\s+/g, "_");
		const _createTime = unixTimestampToISOString(createTime);
		const _updateTime = unixTimestampToISOString(updateTime);
		return format.replace("{title}", _title).replace("{date}", dateStr()).replace("{timestamp}", timestamp()).replace("{chat_id}", chatId).replace("{create_time}", _createTime).replace("{update_time}", _updateTime).concat(`.${ext}`);
	}
	var CodeRegex = /(```[\s\S]*?(?:```|$)|`[^`\n]+`)/;
	var MathRegex = new RegExp([
		/(?<blockStart>^|\n)(?<indent>[ \t]*)\\\[(?<block>[\s\S]+?)\\\][ \t]*(?=\n|$)/.source,
		/\\\[(?<display>[\s\S]+?)\\\]/.source,
		/\\\((?<inline>[\s\S]+?)\\\)/.source,
		/(?<dollarBlock>\$\$[\s\S]+?\$\$)/.source,
		/(?<=^|\s)(?<dollarInline>\$[^\s$][^$\n]*\$)(?=\s|$)/.source
	].join("|"), "g");
	function protectMath(input) {
		const formulas = [];
		const placeholder = (formula) => `╬${formulas.push(formula) - 1}╬`;
		const text = input.split(CodeRegex).map((part, index) => {
			if (index % 2 === 1) return part;
			return part.replace(MathRegex, (...args) => {
				const groups = args.at(-1);
				if (groups.block != null) {
					const { blockStart = "", indent = "" } = groups;
					return `${blockStart}${indent}${placeholder(`$$\n${groups.block.trim()}\n${indent}$$`)}`;
				}
				if (groups.display != null) return placeholder(`$$${groups.display.trim()}$$`);
				if (groups.inline != null) return placeholder(`$${groups.inline.trim()}$`);
				return placeholder(groups.dollarBlock ?? groups.dollarInline ?? "");
			});
		}).join("");
		const restore = (output, escape = (formula) => formula) => output.replace(/╬(\d+)╬/g, (match, index) => {
			const formula = formulas[Number(index)];
			return formula == null ? match : escape(formula);
		});
		return {
			text,
			restore
		};
	}
	function toBracketDelimiters(formula) {
		const display = /^\$\$([\s\S]*)\$\$$/.exec(formula);
		if (display) return `\\[${display[1]}\\]`;
		return `\\(${formula.slice(1, -1)}\\)`;
	}
	var Schema = class {
		constructor(property, normal, space) {
			this.property = property;
			this.normal = normal;
			if (space) this.space = space;
		}
	};
	Schema.prototype.property = {};
	Schema.prototype.normal = {};
	Schema.prototype.space = null;
	function merge(definitions, space) {
		const property = {};
		const normal = {};
		let index = -1;
		while (++index < definitions.length) {
			Object.assign(property, definitions[index].property);
			Object.assign(normal, definitions[index].normal);
		}
		return new Schema(property, normal, space);
	}
	function normalize(value) {
		return value.toLowerCase();
	}
	var Info = class {
		constructor(property, attribute) {
			this.property = property;
			this.attribute = attribute;
		}
	};
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
	var types_exports = __exportAll({
		boolean: () => boolean,
		booleanish: () => booleanish,
		commaOrSpaceSeparated: () => commaOrSpaceSeparated,
		commaSeparated: () => commaSeparated,
		number: () => number,
		overloadedBoolean: () => overloadedBoolean,
		spaceSeparated: () => spaceSeparated
	});
	var powers = 0;
	var boolean = increment();
	var booleanish = increment();
	var overloadedBoolean = increment();
	var number = increment();
	var spaceSeparated = increment();
	var commaSeparated = increment();
	var commaOrSpaceSeparated = increment();
	function increment() {
		return 2 ** ++powers;
	}
	var checks = Object.keys(types_exports);
	var DefinedInfo = class extends Info {
		constructor(property, attribute, mask, space) {
			let index = -1;
			super(property, attribute);
			mark(this, "space", space);
			if (typeof mask === "number") while (++index < checks.length) {
				const check = checks[index];
				mark(this, checks[index], (mask & types_exports[check]) === types_exports[check]);
			}
		}
	};
	DefinedInfo.prototype.defined = true;
	function mark(values, key, value) {
		if (value) values[key] = value;
	}
	var own$7 = {}.hasOwnProperty;
	function create(definition) {
		const property = {};
		const normal = {};
		let prop;
		for (prop in definition.properties) if (own$7.call(definition.properties, prop)) {
			const value = definition.properties[prop];
			const info = new DefinedInfo(prop, definition.transform(definition.attributes || {}, prop), value, definition.space);
			if (definition.mustUseProperty && definition.mustUseProperty.includes(prop)) info.mustUseProperty = true;
			property[prop] = info;
			normal[normalize(prop)] = prop;
			normal[normalize(info.attribute)] = prop;
		}
		return new Schema(property, normal, definition.space);
	}
	var xlink = create({
		space: "xlink",
		transform(_, prop) {
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
	var xml = create({
		space: "xml",
		transform(_, prop) {
			return "xml:" + prop.slice(3).toLowerCase();
		},
		properties: {
			xmlLang: null,
			xmlBase: null,
			xmlSpace: null
		}
	});
	function caseSensitiveTransform(attributes, attribute) {
		return attribute in attributes ? attributes[attribute] : attribute;
	}
	function caseInsensitiveTransform(attributes, property) {
		return caseSensitiveTransform(attributes, property.toLowerCase());
	}
	var xmlns = create({
		space: "xmlns",
		attributes: { xmlnsxlink: "xmlns:xlink" },
		transform: caseInsensitiveTransform,
		properties: {
			xmlns: null,
			xmlnsXLink: null
		}
	});
	var aria = create({
		transform(_, prop) {
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
	var html$5 = create({
		space: "html",
		attributes: {
			acceptcharset: "accept-charset",
			classname: "class",
			htmlfor: "for",
			httpequiv: "http-equiv"
		},
		transform: caseInsensitiveTransform,
		mustUseProperty: [
			"checked",
			"multiple",
			"muted",
			"selected"
		],
		properties: {
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
			align: null,
			aLink: null,
			archive: spaceSeparated,
			axis: null,
			background: null,
			bgColor: null,
			border: number,
			borderColor: null,
			bottomMargin: number,
			cellPadding: null,
			cellSpacing: null,
			char: null,
			charOff: null,
			classId: null,
			clear: null,
			code: null,
			codeBase: null,
			codeType: null,
			color: null,
			compact: boolean,
			declare: boolean,
			event: null,
			face: null,
			frame: null,
			frameBorder: null,
			hSpace: number,
			leftMargin: number,
			link: null,
			longDesc: null,
			lowSrc: null,
			marginHeight: number,
			marginWidth: number,
			noResize: boolean,
			noHref: boolean,
			noShade: boolean,
			noWrap: boolean,
			object: null,
			profile: null,
			prompt: null,
			rev: null,
			rightMargin: number,
			rules: null,
			scheme: null,
			scrolling: booleanish,
			standby: null,
			summary: null,
			text: null,
			topMargin: number,
			valueType: null,
			version: null,
			vAlign: null,
			vLink: null,
			vSpace: number,
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
	var svg$1 = create({
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
			keySplines: null,
			keyTimes: null,
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
	var valid = /^data[-\w.:]+$/i;
	var dash = /-[a-z]/g;
	var cap = /[A-Z]/g;
	function find(schema, value) {
		const normal = normalize(value);
		let prop = value;
		let Type = Info;
		if (normal in schema.normal) return schema.property[schema.normal[normal]];
		if (normal.length > 4 && normal.slice(0, 4) === "data" && valid.test(value)) {
			if (value.charAt(4) === "-") {
				const rest = value.slice(5).replace(dash, camelcase);
				prop = "data" + rest.charAt(0).toUpperCase() + rest.slice(1);
			} else {
				const rest = value.slice(4);
				if (!dash.test(rest)) {
					let dashes = rest.replace(cap, kebab);
					if (dashes.charAt(0) !== "-") dashes = "-" + dashes;
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
	var html$4 = merge([
		xml,
		xlink,
		xmlns,
		aria,
		html$5
	], "html");
	var svg = merge([
		xml,
		xlink,
		xmlns,
		aria,
		svg$1
	], "svg");
	var htmlVoidElements = [
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
	var own$6 = {}.hasOwnProperty;
	function zwitch(key, options) {
		const settings = options || {};
		function one(value, ...parameters) {
			let fn = one.invalid;
			const handlers = one.handlers;
			if (value && own$6.call(value, key)) {
				const id = String(value[key]);
				fn = own$6.call(handlers, id) ? handlers[id] : one.unknown;
			}
			if (fn) return fn.call(this, value, ...parameters);
		}
		one.handlers = settings.handlers || {};
		one.invalid = settings.invalid;
		one.unknown = settings.unknown;
		return one;
	}
	function core(value, options) {
		value = value.replace(options.subset ? charactersToExpression(options.subset) : /["&'<>`]/g, basic);
		if (options.subset || options.escapeOnly) return value;
		return value.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, surrogate).replace(/[\x01-\t\v\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g, basic);
		function surrogate(pair, index, all) {
			return options.format((pair.charCodeAt(0) - 55296) * 1024 + pair.charCodeAt(1) - 56320 + 65536, all.charCodeAt(index + 2), options);
		}
		function basic(character, index, all) {
			return options.format(character.charCodeAt(0), all.charCodeAt(index + 1), options);
		}
	}
	function charactersToExpression(subset) {
		const groups = [];
		let index = -1;
		while (++index < subset.length) groups.push(subset[index].replace(/[|\\{}()[\]^$+*?.]/g, "\\$&"));
		return new RegExp("(?:" + groups.join("|") + ")", "g");
	}
	function toHexadecimal(code, next, omit) {
		const value = "&#x" + code.toString(16).toUpperCase();
		return omit && next && !/[\dA-Fa-f]/.test(String.fromCharCode(next)) ? value : value + ";";
	}
	function toDecimal(code, next, omit) {
		const value = "&#" + String(code);
		return omit && next && !/\d/.test(String.fromCharCode(next)) ? value : value + ";";
	}
	var characterEntitiesLegacy = [
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
	var characterEntitiesHtml4 = {
		nbsp: "\xA0",
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
		quot: "\"",
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
	var dangerous = [
		"cent",
		"copy",
		"divide",
		"gt",
		"lt",
		"not",
		"para",
		"times"
	];
	var own$5 = {}.hasOwnProperty;
	var characters = {};
	var key;
	for (key in characterEntitiesHtml4) if (own$5.call(characterEntitiesHtml4, key)) characters[characterEntitiesHtml4[key]] = key;
	function toNamed(code, next, omit, attribute) {
		const character = String.fromCharCode(code);
		if (own$5.call(characters, character)) {
			const name = characters[character];
			const value = "&" + name;
			if (omit && characterEntitiesLegacy.includes(name) && !dangerous.includes(name) && (!attribute || next && next !== 61 && /[^\da-z]/i.test(String.fromCharCode(next)))) return value;
			return value + ";";
		}
		return "";
	}
	function formatSmart(code, next, options) {
		let numeric = toHexadecimal(code, next, options.omitOptionalSemicolons);
		let named;
		if (options.useNamedReferences || options.useShortestReferences) named = toNamed(code, next, options.omitOptionalSemicolons, options.attribute);
		if ((options.useShortestReferences || !named) && options.useShortestReferences) {
			const decimal = toDecimal(code, next, options.omitOptionalSemicolons);
			if (decimal.length < numeric.length) numeric = decimal;
		}
		return named && (!options.useShortestReferences || named.length < numeric.length) ? named : numeric;
	}
	function stringifyEntities(value, options) {
		return core(value, Object.assign({ format: formatSmart }, options));
	}
	function comment(node, _1, _2, state) {
		return state.settings.bogusComments ? "<?" + stringifyEntities(node.value, Object.assign({}, state.settings.characterReferences, { subset: [">"] })) + ">" : "<!--" + node.value.replace(/^>|^->|<!--|-->|--!>|<!-$/g, encode) + "-->";
		function encode($0) {
			return stringifyEntities($0, Object.assign({}, state.settings.characterReferences, { subset: ["<", ">"] }));
		}
	}
	function doctype(_1, _2, _3, state) {
		return "<!" + (state.settings.upperDoctype ? "DOCTYPE" : "doctype") + (state.settings.tightDoctype ? "" : " ") + "html>";
	}
	function ccount(value, character) {
		const source = String(value);
		if (typeof character !== "string") throw new TypeError("Expected character");
		let count = 0;
		let index = source.indexOf(character);
		while (index !== -1) {
			count++;
			index = source.indexOf(character, index + character.length);
		}
		return count;
	}
	function stringify$1(values, options) {
		const settings = options || {};
		return (values[values.length - 1] === "" ? [...values, ""] : values).join((settings.padRight ? " " : "") + "," + (settings.padLeft === false ? "" : " ")).trim();
	}
	function stringify(values) {
		return values.join(" ").trim();
	}
	function whitespace(thing) {
		const value = thing && typeof thing === "object" && thing.type === "text" ? thing.value || "" : thing;
		return typeof value === "string" && value.replace(/[ \t\n\f\r]/g, "") === "";
	}
	var siblingAfter = siblings(1);
	var siblingBefore = siblings(-1);
	function siblings(increment) {
		return sibling;
		function sibling(parent, index, includeWhitespace) {
			const siblings = parent ? parent.children : [];
			let offset = (index || 0) + increment;
			let next = siblings && siblings[offset];
			if (!includeWhitespace) while (next && whitespace(next)) {
				offset += increment;
				next = siblings[offset];
			}
			return next;
		}
	}
	var own$4 = {}.hasOwnProperty;
	function omission(handlers) {
		return omit;
		function omit(node, index, parent) {
			return own$4.call(handlers, node.tagName) && handlers[node.tagName](node, index, parent);
		}
	}
	var closing = omission({
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
	function headOrColgroupOrCaption(_, index, parent) {
		const next = siblingAfter(parent, index, true);
		return !next || next.type !== "comment" && !(next.type === "text" && whitespace(next.value.charAt(0)));
	}
	function html$3(_, index, parent) {
		const next = siblingAfter(parent, index);
		return !next || next.type !== "comment";
	}
	function body$1(_, index, parent) {
		const next = siblingAfter(parent, index);
		return !next || next.type !== "comment";
	}
	function p(_, index, parent) {
		const next = siblingAfter(parent, index);
		return next ? next.type === "element" && (next.tagName === "address" || next.tagName === "article" || next.tagName === "aside" || next.tagName === "blockquote" || next.tagName === "details" || next.tagName === "div" || next.tagName === "dl" || next.tagName === "fieldset" || next.tagName === "figcaption" || next.tagName === "figure" || next.tagName === "footer" || next.tagName === "form" || next.tagName === "h1" || next.tagName === "h2" || next.tagName === "h3" || next.tagName === "h4" || next.tagName === "h5" || next.tagName === "h6" || next.tagName === "header" || next.tagName === "hgroup" || next.tagName === "hr" || next.tagName === "main" || next.tagName === "menu" || next.tagName === "nav" || next.tagName === "ol" || next.tagName === "p" || next.tagName === "pre" || next.tagName === "section" || next.tagName === "table" || next.tagName === "ul") : !parent || !(parent.type === "element" && (parent.tagName === "a" || parent.tagName === "audio" || parent.tagName === "del" || parent.tagName === "ins" || parent.tagName === "map" || parent.tagName === "noscript" || parent.tagName === "video"));
	}
	function li(_, index, parent) {
		const next = siblingAfter(parent, index);
		return !next || next.type === "element" && next.tagName === "li";
	}
	function dt(_, index, parent) {
		const next = siblingAfter(parent, index);
		return next && next.type === "element" && (next.tagName === "dt" || next.tagName === "dd");
	}
	function dd(_, index, parent) {
		const next = siblingAfter(parent, index);
		return !next || next.type === "element" && (next.tagName === "dt" || next.tagName === "dd");
	}
	function rubyElement(_, index, parent) {
		const next = siblingAfter(parent, index);
		return !next || next.type === "element" && (next.tagName === "rp" || next.tagName === "rt");
	}
	function optgroup(_, index, parent) {
		const next = siblingAfter(parent, index);
		return !next || next.type === "element" && next.tagName === "optgroup";
	}
	function option(_, index, parent) {
		const next = siblingAfter(parent, index);
		return !next || next.type === "element" && (next.tagName === "option" || next.tagName === "optgroup");
	}
	function menuitem(_, index, parent) {
		const next = siblingAfter(parent, index);
		return !next || next.type === "element" && (next.tagName === "menuitem" || next.tagName === "hr" || next.tagName === "menu");
	}
	function thead(_, index, parent) {
		const next = siblingAfter(parent, index);
		return next && next.type === "element" && (next.tagName === "tbody" || next.tagName === "tfoot");
	}
	function tbody$1(_, index, parent) {
		const next = siblingAfter(parent, index);
		return !next || next.type === "element" && (next.tagName === "tbody" || next.tagName === "tfoot");
	}
	function tfoot(_, index, parent) {
		return !siblingAfter(parent, index);
	}
	function tr(_, index, parent) {
		const next = siblingAfter(parent, index);
		return !next || next.type === "element" && next.tagName === "tr";
	}
	function cells(_, index, parent) {
		const next = siblingAfter(parent, index);
		return !next || next.type === "element" && (next.tagName === "td" || next.tagName === "th");
	}
	var opening = omission({
		html: html$2,
		head,
		body,
		colgroup,
		tbody
	});
	function html$2(node) {
		const head = siblingAfter(node, -1);
		return !head || head.type !== "comment";
	}
	function head(node) {
		const children = node.children;
		const seen = [];
		let index = -1;
		while (++index < children.length) {
			const child = children[index];
			if (child.type === "element" && (child.tagName === "title" || child.tagName === "base")) {
				if (seen.includes(child.tagName)) return false;
				seen.push(child.tagName);
			}
		}
		return children.length > 0;
	}
	function body(node) {
		const head = siblingAfter(node, -1, true);
		return !head || head.type !== "comment" && !(head.type === "text" && whitespace(head.value.charAt(0))) && !(head.type === "element" && (head.tagName === "meta" || head.tagName === "link" || head.tagName === "script" || head.tagName === "style" || head.tagName === "template"));
	}
	function colgroup(node, index, parent) {
		const previous = siblingBefore(parent, index);
		const head = siblingAfter(node, -1, true);
		if (parent && previous && previous.type === "element" && previous.tagName === "colgroup" && closing(previous, parent.children.indexOf(previous), parent)) return false;
		return head && head.type === "element" && head.tagName === "col";
	}
	function tbody(node, index, parent) {
		const previous = siblingBefore(parent, index);
		const head = siblingAfter(node, -1);
		if (parent && previous && previous.type === "element" && (previous.tagName === "thead" || previous.tagName === "tbody") && closing(previous, parent.children.indexOf(previous), parent)) return false;
		return head && head.type === "element" && head.tagName === "tr";
	}
	var constants = {
		name: [["	\n\f\r &/=>".split(""), "	\n\f\r \"&'/=>`".split("")], ["\0	\n\f\r \"&'/<=>".split(""), "\0	\n\f\r \"&'/<=>`".split("")]],
		unquoted: [["	\n\f\r &>".split(""), "\0	\n\f\r \"&'<=>`".split("")], ["\0	\n\f\r \"&'<=>`".split(""), "\0	\n\f\r \"&'<=>`".split("")]],
		single: [["&'".split(""), "\"&'`".split("")], ["\0&'".split(""), "\0\"&'`".split("")]],
		double: [["\"&".split(""), "\"&'`".split("")], ["\0\"&".split(""), "\0\"&'`".split("")]]
	};
	function element$1(node, index, parent, state) {
		const schema = state.schema;
		const omit = schema.space === "svg" ? false : state.settings.omitOptionalTags;
		let selfClosing = schema.space === "svg" ? state.settings.closeEmptyElements : state.settings.voids.includes(node.tagName.toLowerCase());
		const parts = [];
		let last;
		if (schema.space === "html" && node.tagName === "svg") state.schema = svg;
		const attrs = serializeAttributes(state, node.properties);
		const content = state.all(schema.space === "html" && node.tagName === "template" ? node.content : node);
		state.schema = schema;
		if (content) selfClosing = false;
		if (attrs || !omit || !opening(node, index, parent)) {
			parts.push("<", node.tagName, attrs ? " " + attrs : "");
			if (selfClosing && (schema.space === "svg" || state.settings.closeSelfClosing)) {
				last = attrs.charAt(attrs.length - 1);
				if (!state.settings.tightSelfClosing || last === "/" || last && last !== "\"" && last !== "'") parts.push(" ");
				parts.push("/");
			}
			parts.push(">");
		}
		parts.push(content);
		if (!selfClosing && (!omit || !closing(node, index, parent))) parts.push("</" + node.tagName + ">");
		return parts.join("");
	}
	function serializeAttributes(state, props) {
		const values = [];
		let index = -1;
		let key;
		if (props) {
			for (key in props) if (props[key] !== void 0 && props[key] !== null) {
				const value = serializeAttribute(state, key, props[key]);
				if (value) values.push(value);
			}
		}
		while (++index < values.length) {
			const last = state.settings.tightAttributes ? values[index].charAt(values[index].length - 1) : null;
			if (index !== values.length - 1 && last !== "\"" && last !== "'") values[index] += " ";
		}
		return values.join("");
	}
	function serializeAttribute(state, key, value) {
		const info = find(state.schema, key);
		const x = state.settings.allowParseErrors && state.schema.space === "html" ? 0 : 1;
		const y = state.settings.allowDangerousCharacters ? 0 : 1;
		let quote = state.quote;
		let result;
		if (info.overloadedBoolean && (value === info.attribute || value === "")) value = true;
		else if (info.boolean || info.overloadedBoolean && typeof value !== "string") value = Boolean(value);
		if (value === void 0 || value === null || value === false || typeof value === "number" && Number.isNaN(value)) return "";
		const name = stringifyEntities(info.attribute, Object.assign({}, state.settings.characterReferences, { subset: constants.name[x][y] }));
		if (value === true) return name;
		value = Array.isArray(value) ? (info.commaSeparated ? stringify$1 : stringify)(value, { padLeft: !state.settings.tightCommaSeparatedLists }) : String(value);
		if (state.settings.collapseEmptyAttributes && !value) return name;
		if (state.settings.preferUnquoted) result = stringifyEntities(value, Object.assign({}, state.settings.characterReferences, {
			subset: constants.unquoted[x][y],
			attribute: true
		}));
		if (result !== value) {
			if (state.settings.quoteSmart && ccount(value, quote) > ccount(value, state.alternative)) quote = state.alternative;
			result = quote + stringifyEntities(value, Object.assign({}, state.settings.characterReferences, {
				subset: (quote === "'" ? constants.single : constants.double)[x][y],
				attribute: true
			})) + quote;
		}
		return name + (result ? "=" + result : result);
	}
	function text$5(node, _, parent, state) {
		return parent && parent.type === "element" && (parent.tagName === "script" || parent.tagName === "style") ? node.value : stringifyEntities(node.value, Object.assign({}, state.settings.characterReferences, { subset: ["<", "&"] }));
	}
	function raw(node, index, parent, state) {
		return state.settings.allowDangerousHtml ? node.value : text$5(node, index, parent, state);
	}
	function root$2(node, _1, _2, state) {
		return state.all(node);
	}
	var handle$1 = zwitch("type", {
		invalid: invalid$1,
		unknown: unknown$1,
		handlers: {
			comment,
			doctype,
			element: element$1,
			raw,
			root: root$2,
			text: text$5
		}
	});
	function invalid$1(node) {
		throw new Error("Expected node, not `" + node + "`");
	}
	function unknown$1(node) {
		throw new Error("Cannot compile unknown node `" + node.type + "`");
	}
	function toHtml$1(tree, options) {
		const options_ = options || {};
		const quote = options_.quote || "\"";
		const alternative = quote === "\"" ? "'" : "\"";
		if (quote !== "\"" && quote !== "'") throw new Error("Invalid quote `" + quote + "`, expected `'` or `\"`");
		return {
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
		}.one(Array.isArray(tree) ? {
			type: "root",
			children: tree
		} : tree, void 0, void 0);
	}
	function one$2(node, index, parent) {
		return handle$1(node, index, parent, this);
	}
	function all$2(parent) {
		const results = [];
		const children = parent && parent.children || [];
		let index = -1;
		while (++index < children.length) results[index] = this.one(children[index], index, parent);
		return results.join("");
	}
	var emptyOptions = {};
	function toString(value, options) {
		const settings = options || emptyOptions;
		return one$1(value, typeof settings.includeImageAlt === "boolean" ? settings.includeImageAlt : true, typeof settings.includeHtml === "boolean" ? settings.includeHtml : true);
	}
	function one$1(value, includeImageAlt, includeHtml) {
		if (node(value)) {
			if ("value" in value) return value.type === "html" && !includeHtml ? "" : value.value;
			if (includeImageAlt && "alt" in value && value.alt) return value.alt;
			if ("children" in value) return all$1(value.children, includeImageAlt, includeHtml);
		}
		if (Array.isArray(value)) return all$1(value, includeImageAlt, includeHtml);
		return "";
	}
	function all$1(values, includeImageAlt, includeHtml) {
		const result = [];
		let index = -1;
		while (++index < values.length) result[index] = one$1(values[index], includeImageAlt, includeHtml);
		return result.join("");
	}
	function node(value) {
		return Boolean(value && typeof value === "object");
	}
	function splice(list, start, remove, items) {
		const end = list.length;
		let chunkStart = 0;
		let parameters;
		if (start < 0) start = -start > end ? 0 : end + start;
		else start = start > end ? end : start;
		remove = remove > 0 ? remove : 0;
		if (items.length < 1e4) {
			parameters = Array.from(items);
			parameters.unshift(start, remove);
			[].splice.apply(list, parameters);
		} else {
			if (remove) [].splice.apply(list, [start, remove]);
			while (chunkStart < items.length) {
				parameters = items.slice(chunkStart, chunkStart + 1e4);
				parameters.unshift(start, 0);
				[].splice.apply(list, parameters);
				chunkStart += 1e4;
				start += 1e4;
			}
		}
	}
	function push(list, items) {
		if (list.length > 0) {
			splice(list, list.length, 0, items);
			return list;
		}
		return items;
	}
	var hasOwnProperty = {}.hasOwnProperty;
	function combineExtensions(extensions) {
		const all = {};
		let index = -1;
		while (++index < extensions.length) syntaxExtension(all, extensions[index]);
		return all;
	}
	function syntaxExtension(all, extension) {
		let hook;
		for (hook in extension) {
			const left = (hasOwnProperty.call(all, hook) ? all[hook] : void 0) || (all[hook] = {});
			const right = extension[hook];
			let code;
			for (code in right) {
				if (!hasOwnProperty.call(left, code)) left[code] = [];
				const value = right[code];
				constructs(left[code], Array.isArray(value) ? value : value ? [value] : []);
			}
		}
	}
	function constructs(existing, list) {
		let index = -1;
		const before = [];
		while (++index < list.length) (list[index].add === "after" ? existing : before).push(list[index]);
		splice(existing, 0, 0, before);
	}
	var unicodePunctuationRegex = /[!-/:-@[-`{-~\u00A1\u00A7\u00AB\u00B6\u00B7\u00BB\u00BF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]/;
	var asciiAlpha = regexCheck(/[A-Za-z]/);
	var asciiDigit = regexCheck(/\d/);
	var asciiHexDigit = regexCheck(/[\dA-Fa-f]/);
	var asciiAlphanumeric = regexCheck(/[\dA-Za-z]/);
	var asciiPunctuation = regexCheck(/[!-/:-@[-`{-~]/);
	var asciiAtext = regexCheck(/[#-'*+\--9=?A-Z^-~]/);
	function asciiControl(code) {
		return code !== null && (code < 32 || code === 127);
	}
	function markdownLineEndingOrSpace(code) {
		return code !== null && (code < 0 || code === 32);
	}
	function markdownLineEnding(code) {
		return code !== null && code < -2;
	}
	function markdownSpace(code) {
		return code === -2 || code === -1 || code === 32;
	}
	var unicodeWhitespace = regexCheck(/\s/);
	var unicodePunctuation = regexCheck(unicodePunctuationRegex);
	function regexCheck(regex) {
		return check;
		function check(code) {
			return code !== null && regex.test(String.fromCharCode(code));
		}
	}
	function factorySpace(effects, ok, type, max) {
		const limit = max ? max - 1 : Number.POSITIVE_INFINITY;
		let size = 0;
		return start;
		function start(code) {
			if (markdownSpace(code)) {
				effects.enter(type);
				return prefix(code);
			}
			return ok(code);
		}
		function prefix(code) {
			if (markdownSpace(code) && size++ < limit) {
				effects.consume(code);
				return prefix;
			}
			effects.exit(type);
			return ok(code);
		}
	}
	var content$1 = { tokenize: initializeContent };
	function initializeContent(effects) {
		const contentStart = effects.attempt(this.parser.constructs.contentInitial, afterContentStartConstruct, paragraphInitial);
		let previous;
		return contentStart;
		function afterContentStartConstruct(code) {
			if (code === null) {
				effects.consume(code);
				return;
			}
			effects.enter("lineEnding");
			effects.consume(code);
			effects.exit("lineEnding");
			return factorySpace(effects, contentStart, "linePrefix");
		}
		function paragraphInitial(code) {
			effects.enter("paragraph");
			return lineStart(code);
		}
		function lineStart(code) {
			const token = effects.enter("chunkText", {
				contentType: "text",
				previous
			});
			if (previous) previous.next = token;
			previous = token;
			return data(code);
		}
		function data(code) {
			if (code === null) {
				effects.exit("chunkText");
				effects.exit("paragraph");
				effects.consume(code);
				return;
			}
			if (markdownLineEnding(code)) {
				effects.consume(code);
				effects.exit("chunkText");
				return lineStart;
			}
			effects.consume(code);
			return data;
		}
	}
	var document$2 = { tokenize: initializeDocument };
	var containerConstruct = { tokenize: tokenizeContainer };
	function initializeDocument(effects) {
		const self = this;
		const stack = [];
		let continued = 0;
		let childFlow;
		let childToken;
		let lineStartOffset;
		return start;
		function start(code) {
			if (continued < stack.length) {
				const item = stack[continued];
				self.containerState = item[1];
				return effects.attempt(item[0].continuation, documentContinue, checkNewContainers)(code);
			}
			return checkNewContainers(code);
		}
		function documentContinue(code) {
			continued++;
			if (self.containerState._closeFlow) {
				self.containerState._closeFlow = void 0;
				if (childFlow) closeFlow();
				const indexBeforeExits = self.events.length;
				let indexBeforeFlow = indexBeforeExits;
				let point;
				while (indexBeforeFlow--) if (self.events[indexBeforeFlow][0] === "exit" && self.events[indexBeforeFlow][1].type === "chunkFlow") {
					point = self.events[indexBeforeFlow][1].end;
					break;
				}
				exitContainers(continued);
				let index = indexBeforeExits;
				while (index < self.events.length) {
					self.events[index][1].end = Object.assign({}, point);
					index++;
				}
				splice(self.events, indexBeforeFlow + 1, 0, self.events.slice(indexBeforeExits));
				self.events.length = index;
				return checkNewContainers(code);
			}
			return start(code);
		}
		function checkNewContainers(code) {
			if (continued === stack.length) {
				if (!childFlow) return documentContinued(code);
				if (childFlow.currentConstruct && childFlow.currentConstruct.concrete) return flowStart(code);
				self.interrupt = Boolean(childFlow.currentConstruct && !childFlow._gfmTableDynamicInterruptHack);
			}
			self.containerState = {};
			return effects.check(containerConstruct, thereIsANewContainer, thereIsNoNewContainer)(code);
		}
		function thereIsANewContainer(code) {
			if (childFlow) closeFlow();
			exitContainers(continued);
			return documentContinued(code);
		}
		function thereIsNoNewContainer(code) {
			self.parser.lazy[self.now().line] = continued !== stack.length;
			lineStartOffset = self.now().offset;
			return flowStart(code);
		}
		function documentContinued(code) {
			self.containerState = {};
			return effects.attempt(containerConstruct, containerContinue, flowStart)(code);
		}
		function containerContinue(code) {
			continued++;
			stack.push([self.currentConstruct, self.containerState]);
			return documentContinued(code);
		}
		function flowStart(code) {
			if (code === null) {
				if (childFlow) closeFlow();
				exitContainers(0);
				effects.consume(code);
				return;
			}
			childFlow = childFlow || self.parser.flow(self.now());
			effects.enter("chunkFlow", {
				contentType: "flow",
				previous: childToken,
				_tokenizer: childFlow
			});
			return flowContinue(code);
		}
		function flowContinue(code) {
			if (code === null) {
				writeToChild(effects.exit("chunkFlow"), true);
				exitContainers(0);
				effects.consume(code);
				return;
			}
			if (markdownLineEnding(code)) {
				effects.consume(code);
				writeToChild(effects.exit("chunkFlow"));
				continued = 0;
				self.interrupt = void 0;
				return start;
			}
			effects.consume(code);
			return flowContinue;
		}
		function writeToChild(token, eof) {
			const stream = self.sliceStream(token);
			if (eof) stream.push(null);
			token.previous = childToken;
			if (childToken) childToken.next = token;
			childToken = token;
			childFlow.defineSkip(token.start);
			childFlow.write(stream);
			if (self.parser.lazy[token.start.line]) {
				let index = childFlow.events.length;
				while (index--) if (childFlow.events[index][1].start.offset < lineStartOffset && (!childFlow.events[index][1].end || childFlow.events[index][1].end.offset > lineStartOffset)) return;
				const indexBeforeExits = self.events.length;
				let indexBeforeFlow = indexBeforeExits;
				let seen;
				let point;
				while (indexBeforeFlow--) if (self.events[indexBeforeFlow][0] === "exit" && self.events[indexBeforeFlow][1].type === "chunkFlow") {
					if (seen) {
						point = self.events[indexBeforeFlow][1].end;
						break;
					}
					seen = true;
				}
				exitContainers(continued);
				index = indexBeforeExits;
				while (index < self.events.length) {
					self.events[index][1].end = Object.assign({}, point);
					index++;
				}
				splice(self.events, indexBeforeFlow + 1, 0, self.events.slice(indexBeforeExits));
				self.events.length = index;
			}
		}
		function exitContainers(size) {
			let index = stack.length;
			while (index-- > size) {
				const entry = stack[index];
				self.containerState = entry[1];
				entry[0].exit.call(self, effects);
			}
			stack.length = size;
		}
		function closeFlow() {
			childFlow.write([null]);
			childToken = void 0;
			childFlow = void 0;
			self.containerState._closeFlow = void 0;
		}
	}
	function tokenizeContainer(effects, ok, nok) {
		return factorySpace(effects, effects.attempt(this.parser.constructs.document, ok, nok), "linePrefix", this.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4);
	}
	function classifyCharacter(code) {
		if (code === null || markdownLineEndingOrSpace(code) || unicodeWhitespace(code)) return 1;
		if (unicodePunctuation(code)) return 2;
	}
	function resolveAll(constructs, events, context) {
		const called = [];
		let index = -1;
		while (++index < constructs.length) {
			const resolve = constructs[index].resolveAll;
			if (resolve && !called.includes(resolve)) {
				events = resolve(events, context);
				called.push(resolve);
			}
		}
		return events;
	}
	var attention = {
		name: "attention",
		tokenize: tokenizeAttention,
		resolveAll: resolveAllAttention
	};
	function resolveAllAttention(events, context) {
		let index = -1;
		let open;
		let group;
		let text;
		let openingSequence;
		let closingSequence;
		let use;
		let nextEvents;
		let offset;
		while (++index < events.length) if (events[index][0] === "enter" && events[index][1].type === "attentionSequence" && events[index][1]._close) {
			open = index;
			while (open--) if (events[open][0] === "exit" && events[open][1].type === "attentionSequence" && events[open][1]._open && context.sliceSerialize(events[open][1]).charCodeAt(0) === context.sliceSerialize(events[index][1]).charCodeAt(0)) {
				if ((events[open][1]._close || events[index][1]._open) && (events[index][1].end.offset - events[index][1].start.offset) % 3 && !((events[open][1].end.offset - events[open][1].start.offset + events[index][1].end.offset - events[index][1].start.offset) % 3)) continue;
				use = events[open][1].end.offset - events[open][1].start.offset > 1 && events[index][1].end.offset - events[index][1].start.offset > 1 ? 2 : 1;
				const start = Object.assign({}, events[open][1].end);
				const end = Object.assign({}, events[index][1].start);
				movePoint(start, -use);
				movePoint(end, use);
				openingSequence = {
					type: use > 1 ? "strongSequence" : "emphasisSequence",
					start,
					end: Object.assign({}, events[open][1].end)
				};
				closingSequence = {
					type: use > 1 ? "strongSequence" : "emphasisSequence",
					start: Object.assign({}, events[index][1].start),
					end
				};
				text = {
					type: use > 1 ? "strongText" : "emphasisText",
					start: Object.assign({}, events[open][1].end),
					end: Object.assign({}, events[index][1].start)
				};
				group = {
					type: use > 1 ? "strong" : "emphasis",
					start: Object.assign({}, openingSequence.start),
					end: Object.assign({}, closingSequence.end)
				};
				events[open][1].end = Object.assign({}, openingSequence.start);
				events[index][1].start = Object.assign({}, closingSequence.end);
				nextEvents = [];
				if (events[open][1].end.offset - events[open][1].start.offset) nextEvents = push(nextEvents, [[
					"enter",
					events[open][1],
					context
				], [
					"exit",
					events[open][1],
					context
				]]);
				nextEvents = push(nextEvents, [
					[
						"enter",
						group,
						context
					],
					[
						"enter",
						openingSequence,
						context
					],
					[
						"exit",
						openingSequence,
						context
					],
					[
						"enter",
						text,
						context
					]
				]);
				nextEvents = push(nextEvents, resolveAll(context.parser.constructs.insideSpan.null, events.slice(open + 1, index), context));
				nextEvents = push(nextEvents, [
					[
						"exit",
						text,
						context
					],
					[
						"enter",
						closingSequence,
						context
					],
					[
						"exit",
						closingSequence,
						context
					],
					[
						"exit",
						group,
						context
					]
				]);
				if (events[index][1].end.offset - events[index][1].start.offset) {
					offset = 2;
					nextEvents = push(nextEvents, [[
						"enter",
						events[index][1],
						context
					], [
						"exit",
						events[index][1],
						context
					]]);
				} else offset = 0;
				splice(events, open - 1, index - open + 3, nextEvents);
				index = open + nextEvents.length - offset - 2;
				break;
			}
		}
		index = -1;
		while (++index < events.length) if (events[index][1].type === "attentionSequence") events[index][1].type = "data";
		return events;
	}
	function tokenizeAttention(effects, ok) {
		const attentionMarkers = this.parser.constructs.attentionMarkers.null;
		const previous = this.previous;
		const before = classifyCharacter(previous);
		let marker;
		return start;
		function start(code) {
			effects.enter("attentionSequence");
			marker = code;
			return sequence(code);
		}
		function sequence(code) {
			if (code === marker) {
				effects.consume(code);
				return sequence;
			}
			const token = effects.exit("attentionSequence");
			const after = classifyCharacter(code);
			const open = !after || after === 2 && before || attentionMarkers.includes(code);
			const close = !before || before === 2 && after || attentionMarkers.includes(previous);
			token._open = Boolean(marker === 42 ? open : open && (before || !close));
			token._close = Boolean(marker === 42 ? close : close && (after || !open));
			return ok(code);
		}
	}
	function movePoint(point, offset) {
		point.column += offset;
		point.offset += offset;
		point._bufferIndex += offset;
	}
	var autolink = {
		name: "autolink",
		tokenize: tokenizeAutolink
	};
	function tokenizeAutolink(effects, ok, nok) {
		let size = 1;
		return start;
		function start(code) {
			effects.enter("autolink");
			effects.enter("autolinkMarker");
			effects.consume(code);
			effects.exit("autolinkMarker");
			effects.enter("autolinkProtocol");
			return open;
		}
		function open(code) {
			if (asciiAlpha(code)) {
				effects.consume(code);
				return schemeOrEmailAtext;
			}
			return asciiAtext(code) ? emailAtext(code) : nok(code);
		}
		function schemeOrEmailAtext(code) {
			return code === 43 || code === 45 || code === 46 || asciiAlphanumeric(code) ? schemeInsideOrEmailAtext(code) : emailAtext(code);
		}
		function schemeInsideOrEmailAtext(code) {
			if (code === 58) {
				effects.consume(code);
				return urlInside;
			}
			if ((code === 43 || code === 45 || code === 46 || asciiAlphanumeric(code)) && size++ < 32) {
				effects.consume(code);
				return schemeInsideOrEmailAtext;
			}
			return emailAtext(code);
		}
		function urlInside(code) {
			if (code === 62) {
				effects.exit("autolinkProtocol");
				return end(code);
			}
			if (code === null || code === 32 || code === 60 || asciiControl(code)) return nok(code);
			effects.consume(code);
			return urlInside;
		}
		function emailAtext(code) {
			if (code === 64) {
				effects.consume(code);
				size = 0;
				return emailAtSignOrDot;
			}
			if (asciiAtext(code)) {
				effects.consume(code);
				return emailAtext;
			}
			return nok(code);
		}
		function emailAtSignOrDot(code) {
			return asciiAlphanumeric(code) ? emailLabel(code) : nok(code);
		}
		function emailLabel(code) {
			if (code === 46) {
				effects.consume(code);
				size = 0;
				return emailAtSignOrDot;
			}
			if (code === 62) {
				effects.exit("autolinkProtocol").type = "autolinkEmail";
				return end(code);
			}
			return emailValue(code);
		}
		function emailValue(code) {
			if ((code === 45 || asciiAlphanumeric(code)) && size++ < 63) {
				effects.consume(code);
				return code === 45 ? emailValue : emailLabel;
			}
			return nok(code);
		}
		function end(code) {
			effects.enter("autolinkMarker");
			effects.consume(code);
			effects.exit("autolinkMarker");
			effects.exit("autolink");
			return ok;
		}
	}
	var blankLine = {
		tokenize: tokenizeBlankLine,
		partial: true
	};
	function tokenizeBlankLine(effects, ok, nok) {
		return factorySpace(effects, afterWhitespace, "linePrefix");
		function afterWhitespace(code) {
			return code === null || markdownLineEnding(code) ? ok(code) : nok(code);
		}
	}
	var blockQuote = {
		name: "blockQuote",
		tokenize: tokenizeBlockQuoteStart,
		continuation: { tokenize: tokenizeBlockQuoteContinuation },
		exit: exit$1
	};
	function tokenizeBlockQuoteStart(effects, ok, nok) {
		const self = this;
		return start;
		function start(code) {
			if (code === 62) {
				const state = self.containerState;
				if (!state.open) {
					effects.enter("blockQuote", { _container: true });
					state.open = true;
				}
				effects.enter("blockQuotePrefix");
				effects.enter("blockQuoteMarker");
				effects.consume(code);
				effects.exit("blockQuoteMarker");
				return after;
			}
			return nok(code);
		}
		function after(code) {
			if (markdownSpace(code)) {
				effects.enter("blockQuotePrefixWhitespace");
				effects.consume(code);
				effects.exit("blockQuotePrefixWhitespace");
				effects.exit("blockQuotePrefix");
				return ok;
			}
			effects.exit("blockQuotePrefix");
			return ok(code);
		}
	}
	function tokenizeBlockQuoteContinuation(effects, ok, nok) {
		return factorySpace(effects, effects.attempt(blockQuote, ok, nok), "linePrefix", this.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4);
	}
	function exit$1(effects) {
		effects.exit("blockQuote");
	}
	var characterEscape = {
		name: "characterEscape",
		tokenize: tokenizeCharacterEscape
	};
	function tokenizeCharacterEscape(effects, ok, nok) {
		return start;
		function start(code) {
			effects.enter("characterEscape");
			effects.enter("escapeMarker");
			effects.consume(code);
			effects.exit("escapeMarker");
			return open;
		}
		function open(code) {
			if (asciiPunctuation(code)) {
				effects.enter("characterEscapeValue");
				effects.consume(code);
				effects.exit("characterEscapeValue");
				effects.exit("characterEscape");
				return ok;
			}
			return nok(code);
		}
	}
	var element = document.createElement("i");
	function decodeNamedCharacterReference(value) {
		const characterReference = "&" + value + ";";
		element.innerHTML = characterReference;
		const char = element.textContent;
		if (char.charCodeAt(char.length - 1) === 59 && value !== "semi") return false;
		return char === characterReference ? false : char;
	}
	var characterReference = {
		name: "characterReference",
		tokenize: tokenizeCharacterReference
	};
	function tokenizeCharacterReference(effects, ok, nok) {
		const self = this;
		let size = 0;
		let max;
		let test;
		return start;
		function start(code) {
			effects.enter("characterReference");
			effects.enter("characterReferenceMarker");
			effects.consume(code);
			effects.exit("characterReferenceMarker");
			return open;
		}
		function open(code) {
			if (code === 35) {
				effects.enter("characterReferenceMarkerNumeric");
				effects.consume(code);
				effects.exit("characterReferenceMarkerNumeric");
				return numeric;
			}
			effects.enter("characterReferenceValue");
			max = 31;
			test = asciiAlphanumeric;
			return value(code);
		}
		function numeric(code) {
			if (code === 88 || code === 120) {
				effects.enter("characterReferenceMarkerHexadecimal");
				effects.consume(code);
				effects.exit("characterReferenceMarkerHexadecimal");
				effects.enter("characterReferenceValue");
				max = 6;
				test = asciiHexDigit;
				return value;
			}
			effects.enter("characterReferenceValue");
			max = 7;
			test = asciiDigit;
			return value(code);
		}
		function value(code) {
			let token;
			if (code === 59 && size) {
				token = effects.exit("characterReferenceValue");
				if (test === asciiAlphanumeric && !decodeNamedCharacterReference(self.sliceSerialize(token))) return nok(code);
				effects.enter("characterReferenceMarker");
				effects.consume(code);
				effects.exit("characterReferenceMarker");
				effects.exit("characterReference");
				return ok;
			}
			if (test(code) && size++ < max) {
				effects.consume(code);
				return value;
			}
			return nok(code);
		}
	}
	var codeFenced = {
		name: "codeFenced",
		tokenize: tokenizeCodeFenced,
		concrete: true
	};
	function tokenizeCodeFenced(effects, ok, nok) {
		const self = this;
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
		function start(code) {
			effects.enter("codeFenced");
			effects.enter("codeFencedFence");
			effects.enter("codeFencedFenceSequence");
			marker = code;
			return sequenceOpen(code);
		}
		function sequenceOpen(code) {
			if (code === marker) {
				effects.consume(code);
				sizeOpen++;
				return sequenceOpen;
			}
			effects.exit("codeFencedFenceSequence");
			return sizeOpen < 3 ? nok(code) : factorySpace(effects, infoOpen, "whitespace")(code);
		}
		function infoOpen(code) {
			if (code === null || markdownLineEnding(code)) return openAfter(code);
			effects.enter("codeFencedFenceInfo");
			effects.enter("chunkString", { contentType: "string" });
			return info(code);
		}
		function info(code) {
			if (code === null || markdownLineEndingOrSpace(code)) {
				effects.exit("chunkString");
				effects.exit("codeFencedFenceInfo");
				return factorySpace(effects, infoAfter, "whitespace")(code);
			}
			if (code === 96 && code === marker) return nok(code);
			effects.consume(code);
			return info;
		}
		function infoAfter(code) {
			if (code === null || markdownLineEnding(code)) return openAfter(code);
			effects.enter("codeFencedFenceMeta");
			effects.enter("chunkString", { contentType: "string" });
			return meta(code);
		}
		function meta(code) {
			if (code === null || markdownLineEnding(code)) {
				effects.exit("chunkString");
				effects.exit("codeFencedFenceMeta");
				return openAfter(code);
			}
			if (code === 96 && code === marker) return nok(code);
			effects.consume(code);
			return meta;
		}
		function openAfter(code) {
			effects.exit("codeFencedFence");
			return self.interrupt ? ok(code) : contentStart(code);
		}
		function contentStart(code) {
			if (code === null) return after(code);
			if (markdownLineEnding(code)) return effects.attempt(nonLazyLine, effects.attempt(closingFenceConstruct, after, initialPrefix ? factorySpace(effects, contentStart, "linePrefix", initialPrefix + 1) : contentStart), after)(code);
			effects.enter("codeFlowValue");
			return contentContinue(code);
		}
		function contentContinue(code) {
			if (code === null || markdownLineEnding(code)) {
				effects.exit("codeFlowValue");
				return contentStart(code);
			}
			effects.consume(code);
			return contentContinue;
		}
		function after(code) {
			effects.exit("codeFenced");
			return ok(code);
		}
		function tokenizeNonLazyLine(effects, ok, nok) {
			const self = this;
			return start;
			function start(code) {
				effects.enter("lineEnding");
				effects.consume(code);
				effects.exit("lineEnding");
				return lineStart;
			}
			function lineStart(code) {
				return self.parser.lazy[self.now().line] ? nok(code) : ok(code);
			}
		}
		function tokenizeClosingFence(effects, ok, nok) {
			let size = 0;
			return factorySpace(effects, closingSequenceStart, "linePrefix", this.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4);
			function closingSequenceStart(code) {
				effects.enter("codeFencedFence");
				effects.enter("codeFencedFenceSequence");
				return closingSequence(code);
			}
			function closingSequence(code) {
				if (code === marker) {
					effects.consume(code);
					size++;
					return closingSequence;
				}
				if (size < sizeOpen) return nok(code);
				effects.exit("codeFencedFenceSequence");
				return factorySpace(effects, closingSequenceEnd, "whitespace")(code);
			}
			function closingSequenceEnd(code) {
				if (code === null || markdownLineEnding(code)) {
					effects.exit("codeFencedFence");
					return ok(code);
				}
				return nok(code);
			}
		}
	}
	var codeIndented = {
		name: "codeIndented",
		tokenize: tokenizeCodeIndented
	};
	var indentedContent = {
		tokenize: tokenizeIndentedContent,
		partial: true
	};
	function tokenizeCodeIndented(effects, ok, nok) {
		const self = this;
		return start;
		function start(code) {
			effects.enter("codeIndented");
			return factorySpace(effects, afterStartPrefix, "linePrefix", 5)(code);
		}
		function afterStartPrefix(code) {
			const tail = self.events[self.events.length - 1];
			return tail && tail[1].type === "linePrefix" && tail[2].sliceSerialize(tail[1], true).length >= 4 ? afterPrefix(code) : nok(code);
		}
		function afterPrefix(code) {
			if (code === null) return after(code);
			if (markdownLineEnding(code)) return effects.attempt(indentedContent, afterPrefix, after)(code);
			effects.enter("codeFlowValue");
			return content(code);
		}
		function content(code) {
			if (code === null || markdownLineEnding(code)) {
				effects.exit("codeFlowValue");
				return afterPrefix(code);
			}
			effects.consume(code);
			return content;
		}
		function after(code) {
			effects.exit("codeIndented");
			return ok(code);
		}
	}
	function tokenizeIndentedContent(effects, ok, nok) {
		const self = this;
		return start;
		function start(code) {
			if (self.parser.lazy[self.now().line]) return nok(code);
			if (markdownLineEnding(code)) {
				effects.enter("lineEnding");
				effects.consume(code);
				effects.exit("lineEnding");
				return start;
			}
			return factorySpace(effects, afterPrefix, "linePrefix", 5)(code);
		}
		function afterPrefix(code) {
			const tail = self.events[self.events.length - 1];
			return tail && tail[1].type === "linePrefix" && tail[2].sliceSerialize(tail[1], true).length >= 4 ? ok(code) : markdownLineEnding(code) ? start(code) : nok(code);
		}
	}
	var codeText = {
		name: "codeText",
		tokenize: tokenizeCodeText,
		resolve: resolveCodeText,
		previous: previous$1
	};
	function resolveCodeText(events) {
		let tailExitIndex = events.length - 4;
		let headEnterIndex = 3;
		let index;
		let enter;
		if ((events[headEnterIndex][1].type === "lineEnding" || events[headEnterIndex][1].type === "space") && (events[tailExitIndex][1].type === "lineEnding" || events[tailExitIndex][1].type === "space")) {
			index = headEnterIndex;
			while (++index < tailExitIndex) if (events[index][1].type === "codeTextData") {
				events[headEnterIndex][1].type = "codeTextPadding";
				events[tailExitIndex][1].type = "codeTextPadding";
				headEnterIndex += 2;
				tailExitIndex -= 2;
				break;
			}
		}
		index = headEnterIndex - 1;
		tailExitIndex++;
		while (++index <= tailExitIndex) if (enter === void 0) {
			if (index !== tailExitIndex && events[index][1].type !== "lineEnding") enter = index;
		} else if (index === tailExitIndex || events[index][1].type === "lineEnding") {
			events[enter][1].type = "codeTextData";
			if (index !== enter + 2) {
				events[enter][1].end = events[index - 1][1].end;
				events.splice(enter + 2, index - enter - 2);
				tailExitIndex -= index - enter - 2;
				index = enter + 2;
			}
			enter = void 0;
		}
		return events;
	}
	function previous$1(code) {
		return code !== 96 || this.events[this.events.length - 1][1].type === "characterEscape";
	}
	function tokenizeCodeText(effects, ok, nok) {
		let sizeOpen = 0;
		let size;
		let token;
		return start;
		function start(code) {
			effects.enter("codeText");
			effects.enter("codeTextSequence");
			return openingSequence(code);
		}
		function openingSequence(code) {
			if (code === 96) {
				effects.consume(code);
				sizeOpen++;
				return openingSequence;
			}
			effects.exit("codeTextSequence");
			return gap(code);
		}
		function gap(code) {
			if (code === null) return nok(code);
			if (code === 96) {
				token = effects.enter("codeTextSequence");
				size = 0;
				return closingSequence(code);
			}
			if (code === 32) {
				effects.enter("space");
				effects.consume(code);
				effects.exit("space");
				return gap;
			}
			if (markdownLineEnding(code)) {
				effects.enter("lineEnding");
				effects.consume(code);
				effects.exit("lineEnding");
				return gap;
			}
			effects.enter("codeTextData");
			return data(code);
		}
		function data(code) {
			if (code === null || code === 32 || code === 96 || markdownLineEnding(code)) {
				effects.exit("codeTextData");
				return gap(code);
			}
			effects.consume(code);
			return data;
		}
		function closingSequence(code) {
			if (code === 96) {
				effects.consume(code);
				size++;
				return closingSequence;
			}
			if (size === sizeOpen) {
				effects.exit("codeTextSequence");
				effects.exit("codeText");
				return ok(code);
			}
			token.type = "codeTextData";
			return data(code);
		}
	}
	function subtokenize(events) {
		const jumps = {};
		let index = -1;
		let event;
		let lineIndex;
		let otherIndex;
		let otherEvent;
		let parameters;
		let subevents;
		let more;
		while (++index < events.length) {
			while (index in jumps) index = jumps[index];
			event = events[index];
			if (index && event[1].type === "chunkFlow" && events[index - 1][1].type === "listItemPrefix") {
				subevents = event[1]._tokenizer.events;
				otherIndex = 0;
				if (otherIndex < subevents.length && subevents[otherIndex][1].type === "lineEndingBlank") otherIndex += 2;
				if (otherIndex < subevents.length && subevents[otherIndex][1].type === "content") while (++otherIndex < subevents.length) {
					if (subevents[otherIndex][1].type === "content") break;
					if (subevents[otherIndex][1].type === "chunkText") {
						subevents[otherIndex][1]._isInFirstContentOfListItem = true;
						otherIndex++;
					}
				}
			}
			if (event[0] === "enter") {
				if (event[1].contentType) {
					Object.assign(jumps, subcontent(events, index));
					index = jumps[index];
					more = true;
				}
			} else if (event[1]._container) {
				otherIndex = index;
				lineIndex = void 0;
				while (otherIndex--) {
					otherEvent = events[otherIndex];
					if (otherEvent[1].type === "lineEnding" || otherEvent[1].type === "lineEndingBlank") {
						if (otherEvent[0] === "enter") {
							if (lineIndex) events[lineIndex][1].type = "lineEndingBlank";
							otherEvent[1].type = "lineEnding";
							lineIndex = otherIndex;
						}
					} else break;
				}
				if (lineIndex) {
					event[1].end = Object.assign({}, events[lineIndex][1].start);
					parameters = events.slice(lineIndex, index);
					parameters.unshift(event);
					splice(events, lineIndex, index - lineIndex + 1, parameters);
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
		let previous;
		let index = -1;
		let current = token;
		let adjust = 0;
		let start = 0;
		const breaks = [start];
		while (current) {
			while (events[++startPosition][1] !== current);
			startPositions.push(startPosition);
			if (!current._tokenizer) {
				stream = context.sliceStream(current);
				if (!current.next) stream.push(null);
				if (previous) tokenizer.defineSkip(current.start);
				if (current._isInFirstContentOfListItem) tokenizer._gfmTasklistFirstContentOfListItem = true;
				tokenizer.write(stream);
				if (current._isInFirstContentOfListItem) tokenizer._gfmTasklistFirstContentOfListItem = void 0;
			}
			previous = current;
			current = current.next;
		}
		current = token;
		while (++index < childEvents.length) if (childEvents[index][0] === "exit" && childEvents[index - 1][0] === "enter" && childEvents[index][1].type === childEvents[index - 1][1].type && childEvents[index][1].start.line !== childEvents[index][1].end.line) {
			start = index + 1;
			breaks.push(start);
			current._tokenizer = void 0;
			current.previous = void 0;
			current = current.next;
		}
		tokenizer.events = [];
		if (current) {
			current._tokenizer = void 0;
			current.previous = void 0;
		} else breaks.pop();
		index = breaks.length;
		while (index--) {
			const slice = childEvents.slice(breaks[index], breaks[index + 1]);
			const start = startPositions.pop();
			jumps.unshift([start, start + slice.length - 1]);
			splice(events, start, 2, slice);
		}
		index = -1;
		while (++index < jumps.length) {
			gaps[adjust + jumps[index][0]] = adjust + jumps[index][1];
			adjust += jumps[index][1] - jumps[index][0] - 1;
		}
		return gaps;
	}
	var content = {
		tokenize: tokenizeContent,
		resolve: resolveContent
	};
	var continuationConstruct = {
		tokenize: tokenizeContinuation,
		partial: true
	};
	function resolveContent(events) {
		subtokenize(events);
		return events;
	}
	function tokenizeContent(effects, ok) {
		let previous;
		return start;
		function start(code) {
			effects.enter("content");
			previous = effects.enter("chunkContent", { contentType: "content" });
			return data(code);
		}
		function data(code) {
			if (code === null) return contentEnd(code);
			if (markdownLineEnding(code)) return effects.check(continuationConstruct, contentContinue, contentEnd)(code);
			effects.consume(code);
			return data;
		}
		function contentEnd(code) {
			effects.exit("chunkContent");
			effects.exit("content");
			return ok(code);
		}
		function contentContinue(code) {
			effects.consume(code);
			effects.exit("chunkContent");
			previous.next = effects.enter("chunkContent", {
				contentType: "content",
				previous
			});
			previous = previous.next;
			return data;
		}
	}
	function tokenizeContinuation(effects, ok, nok) {
		const self = this;
		return startLookahead;
		function startLookahead(code) {
			effects.exit("chunkContent");
			effects.enter("lineEnding");
			effects.consume(code);
			effects.exit("lineEnding");
			return factorySpace(effects, prefixed, "linePrefix");
		}
		function prefixed(code) {
			if (code === null || markdownLineEnding(code)) return nok(code);
			const tail = self.events[self.events.length - 1];
			if (!self.parser.constructs.disable.null.includes("codeIndented") && tail && tail[1].type === "linePrefix" && tail[2].sliceSerialize(tail[1], true).length >= 4) return ok(code);
			return effects.interrupt(self.parser.constructs.flow, nok, ok)(code);
		}
	}
	function factoryDestination(effects, ok, nok, type, literalType, literalMarkerType, rawType, stringType, max) {
		const limit = max || Number.POSITIVE_INFINITY;
		let balance = 0;
		return start;
		function start(code) {
			if (code === 60) {
				effects.enter(type);
				effects.enter(literalType);
				effects.enter(literalMarkerType);
				effects.consume(code);
				effects.exit(literalMarkerType);
				return destinationEnclosedBefore;
			}
			if (code === null || code === 41 || asciiControl(code)) return nok(code);
			effects.enter(type);
			effects.enter(rawType);
			effects.enter(stringType);
			effects.enter("chunkString", { contentType: "string" });
			return destinationRaw(code);
		}
		function destinationEnclosedBefore(code) {
			if (code === 62) {
				effects.enter(literalMarkerType);
				effects.consume(code);
				effects.exit(literalMarkerType);
				effects.exit(literalType);
				effects.exit(type);
				return ok;
			}
			effects.enter(stringType);
			effects.enter("chunkString", { contentType: "string" });
			return destinationEnclosed(code);
		}
		function destinationEnclosed(code) {
			if (code === 62) {
				effects.exit("chunkString");
				effects.exit(stringType);
				return destinationEnclosedBefore(code);
			}
			if (code === null || code === 60 || markdownLineEnding(code)) return nok(code);
			effects.consume(code);
			return code === 92 ? destinationEnclosedEscape : destinationEnclosed;
		}
		function destinationEnclosedEscape(code) {
			if (code === 60 || code === 62 || code === 92) {
				effects.consume(code);
				return destinationEnclosed;
			}
			return destinationEnclosed(code);
		}
		function destinationRaw(code) {
			if (code === 40) {
				if (++balance > limit) return nok(code);
				effects.consume(code);
				return destinationRaw;
			}
			if (code === 41) {
				if (!balance--) {
					effects.exit("chunkString");
					effects.exit(stringType);
					effects.exit(rawType);
					effects.exit(type);
					return ok(code);
				}
				effects.consume(code);
				return destinationRaw;
			}
			if (code === null || markdownLineEndingOrSpace(code)) {
				if (balance) return nok(code);
				effects.exit("chunkString");
				effects.exit(stringType);
				effects.exit(rawType);
				effects.exit(type);
				return ok(code);
			}
			if (asciiControl(code)) return nok(code);
			effects.consume(code);
			return code === 92 ? destinationRawEscape : destinationRaw;
		}
		function destinationRawEscape(code) {
			if (code === 40 || code === 41 || code === 92) {
				effects.consume(code);
				return destinationRaw;
			}
			return destinationRaw(code);
		}
	}
	function factoryLabel(effects, ok, nok, type, markerType, stringType) {
		const self = this;
		let size = 0;
		let data;
		return start;
		function start(code) {
			effects.enter(type);
			effects.enter(markerType);
			effects.consume(code);
			effects.exit(markerType);
			effects.enter(stringType);
			return atBreak;
		}
		function atBreak(code) {
			if (code === null || code === 91 || code === 93 && !data || code === 94 && !size && "_hiddenFootnoteSupport" in self.parser.constructs || size > 999) return nok(code);
			if (code === 93) {
				effects.exit(stringType);
				effects.enter(markerType);
				effects.consume(code);
				effects.exit(markerType);
				effects.exit(type);
				return ok;
			}
			if (markdownLineEnding(code)) {
				effects.enter("lineEnding");
				effects.consume(code);
				effects.exit("lineEnding");
				return atBreak;
			}
			effects.enter("chunkString", { contentType: "string" });
			return label(code);
		}
		function label(code) {
			if (code === null || code === 91 || code === 93 || markdownLineEnding(code) || size++ > 999) {
				effects.exit("chunkString");
				return atBreak(code);
			}
			effects.consume(code);
			data = data || !markdownSpace(code);
			return code === 92 ? labelEscape : label;
		}
		function labelEscape(code) {
			if (code === 91 || code === 92 || code === 93) {
				effects.consume(code);
				size++;
				return label;
			}
			return label(code);
		}
	}
	function factoryTitle(effects, ok, nok, type, markerType, stringType) {
		let marker;
		return start;
		function start(code) {
			effects.enter(type);
			effects.enter(markerType);
			effects.consume(code);
			effects.exit(markerType);
			marker = code === 40 ? 41 : code;
			return atFirstTitleBreak;
		}
		function atFirstTitleBreak(code) {
			if (code === marker) {
				effects.enter(markerType);
				effects.consume(code);
				effects.exit(markerType);
				effects.exit(type);
				return ok;
			}
			effects.enter(stringType);
			return atTitleBreak(code);
		}
		function atTitleBreak(code) {
			if (code === marker) {
				effects.exit(stringType);
				return atFirstTitleBreak(marker);
			}
			if (code === null) return nok(code);
			if (markdownLineEnding(code)) {
				effects.enter("lineEnding");
				effects.consume(code);
				effects.exit("lineEnding");
				return factorySpace(effects, atTitleBreak, "linePrefix");
			}
			effects.enter("chunkString", { contentType: "string" });
			return title(code);
		}
		function title(code) {
			if (code === marker || code === null || markdownLineEnding(code)) {
				effects.exit("chunkString");
				return atTitleBreak(code);
			}
			effects.consume(code);
			return code === 92 ? titleEscape : title;
		}
		function titleEscape(code) {
			if (code === marker || code === 92) {
				effects.consume(code);
				return title;
			}
			return title(code);
		}
	}
	function factoryWhitespace(effects, ok) {
		let seen;
		return start;
		function start(code) {
			if (markdownLineEnding(code)) {
				effects.enter("lineEnding");
				effects.consume(code);
				effects.exit("lineEnding");
				seen = true;
				return start;
			}
			if (markdownSpace(code)) return factorySpace(effects, start, seen ? "linePrefix" : "lineSuffix")(code);
			return ok(code);
		}
	}
	function normalizeIdentifier(value) {
		return value.replace(/[\t\n\r ]+/g, " ").replace(/^ | $/g, "").toLowerCase().toUpperCase();
	}
	var definition$1 = {
		name: "definition",
		tokenize: tokenizeDefinition
	};
	var titleConstruct = {
		tokenize: tokenizeTitle,
		partial: true
	};
	function tokenizeDefinition(effects, ok, nok) {
		const self = this;
		let identifier;
		return start;
		function start(code) {
			effects.enter("definition");
			return factoryLabel.call(self, effects, labelAfter, nok, "definitionLabel", "definitionLabelMarker", "definitionLabelString")(code);
		}
		function labelAfter(code) {
			identifier = normalizeIdentifier(self.sliceSerialize(self.events[self.events.length - 1][1]).slice(1, -1));
			if (code === 58) {
				effects.enter("definitionMarker");
				effects.consume(code);
				effects.exit("definitionMarker");
				return factoryWhitespace(effects, factoryDestination(effects, effects.attempt(titleConstruct, factorySpace(effects, after, "whitespace"), factorySpace(effects, after, "whitespace")), nok, "definitionDestination", "definitionDestinationLiteral", "definitionDestinationLiteralMarker", "definitionDestinationRaw", "definitionDestinationString"));
			}
			return nok(code);
		}
		function after(code) {
			if (code === null || markdownLineEnding(code)) {
				effects.exit("definition");
				if (!self.parser.defined.includes(identifier)) self.parser.defined.push(identifier);
				return ok(code);
			}
			return nok(code);
		}
	}
	function tokenizeTitle(effects, ok, nok) {
		return start;
		function start(code) {
			return markdownLineEndingOrSpace(code) ? factoryWhitespace(effects, before)(code) : nok(code);
		}
		function before(code) {
			if (code === 34 || code === 39 || code === 40) return factoryTitle(effects, factorySpace(effects, after, "whitespace"), nok, "definitionTitle", "definitionTitleMarker", "definitionTitleString")(code);
			return nok(code);
		}
		function after(code) {
			return code === null || markdownLineEnding(code) ? ok(code) : nok(code);
		}
	}
	var hardBreakEscape = {
		name: "hardBreakEscape",
		tokenize: tokenizeHardBreakEscape
	};
	function tokenizeHardBreakEscape(effects, ok, nok) {
		return start;
		function start(code) {
			effects.enter("hardBreakEscape");
			effects.enter("escapeMarker");
			effects.consume(code);
			return open;
		}
		function open(code) {
			if (markdownLineEnding(code)) {
				effects.exit("escapeMarker");
				effects.exit("hardBreakEscape");
				return ok(code);
			}
			return nok(code);
		}
	}
	var headingAtx = {
		name: "headingAtx",
		tokenize: tokenizeHeadingAtx,
		resolve: resolveHeadingAtx
	};
	function resolveHeadingAtx(events, context) {
		let contentEnd = events.length - 2;
		let contentStart = 3;
		let content;
		let text;
		if (events[contentStart][1].type === "whitespace") contentStart += 2;
		if (contentEnd - 2 > contentStart && events[contentEnd][1].type === "whitespace") contentEnd -= 2;
		if (events[contentEnd][1].type === "atxHeadingSequence" && (contentStart === contentEnd - 1 || contentEnd - 4 > contentStart && events[contentEnd - 2][1].type === "whitespace")) contentEnd -= contentStart + 1 === contentEnd ? 2 : 4;
		if (contentEnd > contentStart) {
			content = {
				type: "atxHeadingText",
				start: events[contentStart][1].start,
				end: events[contentEnd][1].end
			};
			text = {
				type: "chunkText",
				start: events[contentStart][1].start,
				end: events[contentEnd][1].end,
				contentType: "text"
			};
			splice(events, contentStart, contentEnd - contentStart + 1, [
				[
					"enter",
					content,
					context
				],
				[
					"enter",
					text,
					context
				],
				[
					"exit",
					text,
					context
				],
				[
					"exit",
					content,
					context
				]
			]);
		}
		return events;
	}
	function tokenizeHeadingAtx(effects, ok, nok) {
		const self = this;
		let size = 0;
		return start;
		function start(code) {
			effects.enter("atxHeading");
			effects.enter("atxHeadingSequence");
			return fenceOpenInside(code);
		}
		function fenceOpenInside(code) {
			if (code === 35 && size++ < 6) {
				effects.consume(code);
				return fenceOpenInside;
			}
			if (code === null || markdownLineEndingOrSpace(code)) {
				effects.exit("atxHeadingSequence");
				return self.interrupt ? ok(code) : headingBreak(code);
			}
			return nok(code);
		}
		function headingBreak(code) {
			if (code === 35) {
				effects.enter("atxHeadingSequence");
				return sequence(code);
			}
			if (code === null || markdownLineEnding(code)) {
				effects.exit("atxHeading");
				return ok(code);
			}
			if (markdownSpace(code)) return factorySpace(effects, headingBreak, "whitespace")(code);
			effects.enter("atxHeadingText");
			return data(code);
		}
		function sequence(code) {
			if (code === 35) {
				effects.consume(code);
				return sequence;
			}
			effects.exit("atxHeadingSequence");
			return headingBreak(code);
		}
		function data(code) {
			if (code === null || code === 35 || markdownLineEndingOrSpace(code)) {
				effects.exit("atxHeadingText");
				return headingBreak(code);
			}
			effects.consume(code);
			return data;
		}
	}
	var htmlBlockNames = [
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
	var htmlRawNames = [
		"pre",
		"script",
		"style",
		"textarea"
	];
	var htmlFlow = {
		name: "htmlFlow",
		tokenize: tokenizeHtmlFlow,
		resolveTo: resolveToHtmlFlow,
		concrete: true
	};
	var nextBlankConstruct = {
		tokenize: tokenizeNextBlank,
		partial: true
	};
	function resolveToHtmlFlow(events) {
		let index = events.length;
		while (index--) if (events[index][0] === "enter" && events[index][1].type === "htmlFlow") break;
		if (index > 1 && events[index - 2][1].type === "linePrefix") {
			events[index][1].start = events[index - 2][1].start;
			events[index + 1][1].start = events[index - 2][1].start;
			events.splice(index - 2, 2);
		}
		return events;
	}
	function tokenizeHtmlFlow(effects, ok, nok) {
		const self = this;
		let kind;
		let startTag;
		let buffer;
		let index;
		let marker;
		return start;
		function start(code) {
			effects.enter("htmlFlow");
			effects.enter("htmlFlowData");
			effects.consume(code);
			return open;
		}
		function open(code) {
			if (code === 33) {
				effects.consume(code);
				return declarationStart;
			}
			if (code === 47) {
				effects.consume(code);
				return tagCloseStart;
			}
			if (code === 63) {
				effects.consume(code);
				kind = 3;
				return self.interrupt ? ok : continuationDeclarationInside;
			}
			if (asciiAlpha(code)) {
				effects.consume(code);
				buffer = String.fromCharCode(code);
				startTag = true;
				return tagName;
			}
			return nok(code);
		}
		function declarationStart(code) {
			if (code === 45) {
				effects.consume(code);
				kind = 2;
				return commentOpenInside;
			}
			if (code === 91) {
				effects.consume(code);
				kind = 5;
				buffer = "CDATA[";
				index = 0;
				return cdataOpenInside;
			}
			if (asciiAlpha(code)) {
				effects.consume(code);
				kind = 4;
				return self.interrupt ? ok : continuationDeclarationInside;
			}
			return nok(code);
		}
		function commentOpenInside(code) {
			if (code === 45) {
				effects.consume(code);
				return self.interrupt ? ok : continuationDeclarationInside;
			}
			return nok(code);
		}
		function cdataOpenInside(code) {
			if (code === buffer.charCodeAt(index++)) {
				effects.consume(code);
				return index === buffer.length ? self.interrupt ? ok : continuation : cdataOpenInside;
			}
			return nok(code);
		}
		function tagCloseStart(code) {
			if (asciiAlpha(code)) {
				effects.consume(code);
				buffer = String.fromCharCode(code);
				return tagName;
			}
			return nok(code);
		}
		function tagName(code) {
			if (code === null || code === 47 || code === 62 || markdownLineEndingOrSpace(code)) {
				if (code !== 47 && startTag && htmlRawNames.includes(buffer.toLowerCase())) {
					kind = 1;
					return self.interrupt ? ok(code) : continuation(code);
				}
				if (htmlBlockNames.includes(buffer.toLowerCase())) {
					kind = 6;
					if (code === 47) {
						effects.consume(code);
						return basicSelfClosing;
					}
					return self.interrupt ? ok(code) : continuation(code);
				}
				kind = 7;
				return self.interrupt && !self.parser.lazy[self.now().line] ? nok(code) : startTag ? completeAttributeNameBefore(code) : completeClosingTagAfter(code);
			}
			if (code === 45 || asciiAlphanumeric(code)) {
				effects.consume(code);
				buffer += String.fromCharCode(code);
				return tagName;
			}
			return nok(code);
		}
		function basicSelfClosing(code) {
			if (code === 62) {
				effects.consume(code);
				return self.interrupt ? ok : continuation;
			}
			return nok(code);
		}
		function completeClosingTagAfter(code) {
			if (markdownSpace(code)) {
				effects.consume(code);
				return completeClosingTagAfter;
			}
			return completeEnd(code);
		}
		function completeAttributeNameBefore(code) {
			if (code === 47) {
				effects.consume(code);
				return completeEnd;
			}
			if (code === 58 || code === 95 || asciiAlpha(code)) {
				effects.consume(code);
				return completeAttributeName;
			}
			if (markdownSpace(code)) {
				effects.consume(code);
				return completeAttributeNameBefore;
			}
			return completeEnd(code);
		}
		function completeAttributeName(code) {
			if (code === 45 || code === 46 || code === 58 || code === 95 || asciiAlphanumeric(code)) {
				effects.consume(code);
				return completeAttributeName;
			}
			return completeAttributeNameAfter(code);
		}
		function completeAttributeNameAfter(code) {
			if (code === 61) {
				effects.consume(code);
				return completeAttributeValueBefore;
			}
			if (markdownSpace(code)) {
				effects.consume(code);
				return completeAttributeNameAfter;
			}
			return completeAttributeNameBefore(code);
		}
		function completeAttributeValueBefore(code) {
			if (code === null || code === 60 || code === 61 || code === 62 || code === 96) return nok(code);
			if (code === 34 || code === 39) {
				effects.consume(code);
				marker = code;
				return completeAttributeValueQuoted;
			}
			if (markdownSpace(code)) {
				effects.consume(code);
				return completeAttributeValueBefore;
			}
			marker = null;
			return completeAttributeValueUnquoted(code);
		}
		function completeAttributeValueQuoted(code) {
			if (code === null || markdownLineEnding(code)) return nok(code);
			if (code === marker) {
				effects.consume(code);
				return completeAttributeValueQuotedAfter;
			}
			effects.consume(code);
			return completeAttributeValueQuoted;
		}
		function completeAttributeValueUnquoted(code) {
			if (code === null || code === 34 || code === 39 || code === 60 || code === 61 || code === 62 || code === 96 || markdownLineEndingOrSpace(code)) return completeAttributeNameAfter(code);
			effects.consume(code);
			return completeAttributeValueUnquoted;
		}
		function completeAttributeValueQuotedAfter(code) {
			if (code === 47 || code === 62 || markdownSpace(code)) return completeAttributeNameBefore(code);
			return nok(code);
		}
		function completeEnd(code) {
			if (code === 62) {
				effects.consume(code);
				return completeAfter;
			}
			return nok(code);
		}
		function completeAfter(code) {
			if (markdownSpace(code)) {
				effects.consume(code);
				return completeAfter;
			}
			return code === null || markdownLineEnding(code) ? continuation(code) : nok(code);
		}
		function continuation(code) {
			if (code === 45 && kind === 2) {
				effects.consume(code);
				return continuationCommentInside;
			}
			if (code === 60 && kind === 1) {
				effects.consume(code);
				return continuationRawTagOpen;
			}
			if (code === 62 && kind === 4) {
				effects.consume(code);
				return continuationClose;
			}
			if (code === 63 && kind === 3) {
				effects.consume(code);
				return continuationDeclarationInside;
			}
			if (code === 93 && kind === 5) {
				effects.consume(code);
				return continuationCharacterDataInside;
			}
			if (markdownLineEnding(code) && (kind === 6 || kind === 7)) return effects.check(nextBlankConstruct, continuationClose, continuationAtLineEnding)(code);
			if (code === null || markdownLineEnding(code)) return continuationAtLineEnding(code);
			effects.consume(code);
			return continuation;
		}
		function continuationAtLineEnding(code) {
			effects.exit("htmlFlowData");
			return htmlContinueStart(code);
		}
		function htmlContinueStart(code) {
			if (code === null) return done(code);
			if (markdownLineEnding(code)) return effects.attempt({
				tokenize: htmlLineEnd,
				partial: true
			}, htmlContinueStart, done)(code);
			effects.enter("htmlFlowData");
			return continuation(code);
		}
		function htmlLineEnd(effects, ok, nok) {
			return start;
			function start(code) {
				effects.enter("lineEnding");
				effects.consume(code);
				effects.exit("lineEnding");
				return lineStart;
			}
			function lineStart(code) {
				return self.parser.lazy[self.now().line] ? nok(code) : ok(code);
			}
		}
		function continuationCommentInside(code) {
			if (code === 45) {
				effects.consume(code);
				return continuationDeclarationInside;
			}
			return continuation(code);
		}
		function continuationRawTagOpen(code) {
			if (code === 47) {
				effects.consume(code);
				buffer = "";
				return continuationRawEndTag;
			}
			return continuation(code);
		}
		function continuationRawEndTag(code) {
			if (code === 62 && htmlRawNames.includes(buffer.toLowerCase())) {
				effects.consume(code);
				return continuationClose;
			}
			if (asciiAlpha(code) && buffer.length < 8) {
				effects.consume(code);
				buffer += String.fromCharCode(code);
				return continuationRawEndTag;
			}
			return continuation(code);
		}
		function continuationCharacterDataInside(code) {
			if (code === 93) {
				effects.consume(code);
				return continuationDeclarationInside;
			}
			return continuation(code);
		}
		function continuationDeclarationInside(code) {
			if (code === 62) {
				effects.consume(code);
				return continuationClose;
			}
			if (code === 45 && kind === 2) {
				effects.consume(code);
				return continuationDeclarationInside;
			}
			return continuation(code);
		}
		function continuationClose(code) {
			if (code === null || markdownLineEnding(code)) {
				effects.exit("htmlFlowData");
				return done(code);
			}
			effects.consume(code);
			return continuationClose;
		}
		function done(code) {
			effects.exit("htmlFlow");
			return ok(code);
		}
	}
	function tokenizeNextBlank(effects, ok, nok) {
		return start;
		function start(code) {
			effects.exit("htmlFlowData");
			effects.enter("lineEndingBlank");
			effects.consume(code);
			effects.exit("lineEndingBlank");
			return effects.attempt(blankLine, ok, nok);
		}
	}
	var htmlText = {
		name: "htmlText",
		tokenize: tokenizeHtmlText
	};
	function tokenizeHtmlText(effects, ok, nok) {
		const self = this;
		let marker;
		let buffer;
		let index;
		let returnState;
		return start;
		function start(code) {
			effects.enter("htmlText");
			effects.enter("htmlTextData");
			effects.consume(code);
			return open;
		}
		function open(code) {
			if (code === 33) {
				effects.consume(code);
				return declarationOpen;
			}
			if (code === 47) {
				effects.consume(code);
				return tagCloseStart;
			}
			if (code === 63) {
				effects.consume(code);
				return instruction;
			}
			if (asciiAlpha(code)) {
				effects.consume(code);
				return tagOpen;
			}
			return nok(code);
		}
		function declarationOpen(code) {
			if (code === 45) {
				effects.consume(code);
				return commentOpen;
			}
			if (code === 91) {
				effects.consume(code);
				buffer = "CDATA[";
				index = 0;
				return cdataOpen;
			}
			if (asciiAlpha(code)) {
				effects.consume(code);
				return declaration;
			}
			return nok(code);
		}
		function commentOpen(code) {
			if (code === 45) {
				effects.consume(code);
				return commentStart;
			}
			return nok(code);
		}
		function commentStart(code) {
			if (code === null || code === 62) return nok(code);
			if (code === 45) {
				effects.consume(code);
				return commentStartDash;
			}
			return comment(code);
		}
		function commentStartDash(code) {
			if (code === null || code === 62) return nok(code);
			return comment(code);
		}
		function comment(code) {
			if (code === null) return nok(code);
			if (code === 45) {
				effects.consume(code);
				return commentClose;
			}
			if (markdownLineEnding(code)) {
				returnState = comment;
				return atLineEnding(code);
			}
			effects.consume(code);
			return comment;
		}
		function commentClose(code) {
			if (code === 45) {
				effects.consume(code);
				return end;
			}
			return comment(code);
		}
		function cdataOpen(code) {
			if (code === buffer.charCodeAt(index++)) {
				effects.consume(code);
				return index === buffer.length ? cdata : cdataOpen;
			}
			return nok(code);
		}
		function cdata(code) {
			if (code === null) return nok(code);
			if (code === 93) {
				effects.consume(code);
				return cdataClose;
			}
			if (markdownLineEnding(code)) {
				returnState = cdata;
				return atLineEnding(code);
			}
			effects.consume(code);
			return cdata;
		}
		function cdataClose(code) {
			if (code === 93) {
				effects.consume(code);
				return cdataEnd;
			}
			return cdata(code);
		}
		function cdataEnd(code) {
			if (code === 62) return end(code);
			if (code === 93) {
				effects.consume(code);
				return cdataEnd;
			}
			return cdata(code);
		}
		function declaration(code) {
			if (code === null || code === 62) return end(code);
			if (markdownLineEnding(code)) {
				returnState = declaration;
				return atLineEnding(code);
			}
			effects.consume(code);
			return declaration;
		}
		function instruction(code) {
			if (code === null) return nok(code);
			if (code === 63) {
				effects.consume(code);
				return instructionClose;
			}
			if (markdownLineEnding(code)) {
				returnState = instruction;
				return atLineEnding(code);
			}
			effects.consume(code);
			return instruction;
		}
		function instructionClose(code) {
			return code === 62 ? end(code) : instruction(code);
		}
		function tagCloseStart(code) {
			if (asciiAlpha(code)) {
				effects.consume(code);
				return tagClose;
			}
			return nok(code);
		}
		function tagClose(code) {
			if (code === 45 || asciiAlphanumeric(code)) {
				effects.consume(code);
				return tagClose;
			}
			return tagCloseBetween(code);
		}
		function tagCloseBetween(code) {
			if (markdownLineEnding(code)) {
				returnState = tagCloseBetween;
				return atLineEnding(code);
			}
			if (markdownSpace(code)) {
				effects.consume(code);
				return tagCloseBetween;
			}
			return end(code);
		}
		function tagOpen(code) {
			if (code === 45 || asciiAlphanumeric(code)) {
				effects.consume(code);
				return tagOpen;
			}
			if (code === 47 || code === 62 || markdownLineEndingOrSpace(code)) return tagOpenBetween(code);
			return nok(code);
		}
		function tagOpenBetween(code) {
			if (code === 47) {
				effects.consume(code);
				return end;
			}
			if (code === 58 || code === 95 || asciiAlpha(code)) {
				effects.consume(code);
				return tagOpenAttributeName;
			}
			if (markdownLineEnding(code)) {
				returnState = tagOpenBetween;
				return atLineEnding(code);
			}
			if (markdownSpace(code)) {
				effects.consume(code);
				return tagOpenBetween;
			}
			return end(code);
		}
		function tagOpenAttributeName(code) {
			if (code === 45 || code === 46 || code === 58 || code === 95 || asciiAlphanumeric(code)) {
				effects.consume(code);
				return tagOpenAttributeName;
			}
			return tagOpenAttributeNameAfter(code);
		}
		function tagOpenAttributeNameAfter(code) {
			if (code === 61) {
				effects.consume(code);
				return tagOpenAttributeValueBefore;
			}
			if (markdownLineEnding(code)) {
				returnState = tagOpenAttributeNameAfter;
				return atLineEnding(code);
			}
			if (markdownSpace(code)) {
				effects.consume(code);
				return tagOpenAttributeNameAfter;
			}
			return tagOpenBetween(code);
		}
		function tagOpenAttributeValueBefore(code) {
			if (code === null || code === 60 || code === 61 || code === 62 || code === 96) return nok(code);
			if (code === 34 || code === 39) {
				effects.consume(code);
				marker = code;
				return tagOpenAttributeValueQuoted;
			}
			if (markdownLineEnding(code)) {
				returnState = tagOpenAttributeValueBefore;
				return atLineEnding(code);
			}
			if (markdownSpace(code)) {
				effects.consume(code);
				return tagOpenAttributeValueBefore;
			}
			effects.consume(code);
			marker = void 0;
			return tagOpenAttributeValueUnquoted;
		}
		function tagOpenAttributeValueQuoted(code) {
			if (code === marker) {
				effects.consume(code);
				return tagOpenAttributeValueQuotedAfter;
			}
			if (code === null) return nok(code);
			if (markdownLineEnding(code)) {
				returnState = tagOpenAttributeValueQuoted;
				return atLineEnding(code);
			}
			effects.consume(code);
			return tagOpenAttributeValueQuoted;
		}
		function tagOpenAttributeValueQuotedAfter(code) {
			if (code === 62 || code === 47 || markdownLineEndingOrSpace(code)) return tagOpenBetween(code);
			return nok(code);
		}
		function tagOpenAttributeValueUnquoted(code) {
			if (code === null || code === 34 || code === 39 || code === 60 || code === 61 || code === 96) return nok(code);
			if (code === 62 || markdownLineEndingOrSpace(code)) return tagOpenBetween(code);
			effects.consume(code);
			return tagOpenAttributeValueUnquoted;
		}
		function atLineEnding(code) {
			effects.exit("htmlTextData");
			effects.enter("lineEnding");
			effects.consume(code);
			effects.exit("lineEnding");
			return factorySpace(effects, afterPrefix, "linePrefix", self.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4);
		}
		function afterPrefix(code) {
			effects.enter("htmlTextData");
			return returnState(code);
		}
		function end(code) {
			if (code === 62) {
				effects.consume(code);
				effects.exit("htmlTextData");
				effects.exit("htmlText");
				return ok;
			}
			return nok(code);
		}
	}
	var labelEnd = {
		name: "labelEnd",
		tokenize: tokenizeLabelEnd,
		resolveTo: resolveToLabelEnd,
		resolveAll: resolveAllLabelEnd
	};
	var resourceConstruct = { tokenize: tokenizeResource };
	var fullReferenceConstruct = { tokenize: tokenizeFullReference };
	var collapsedReferenceConstruct = { tokenize: tokenizeCollapsedReference };
	function resolveAllLabelEnd(events) {
		let index = -1;
		let token;
		while (++index < events.length) {
			token = events[index][1];
			if (token.type === "labelImage" || token.type === "labelLink" || token.type === "labelEnd") {
				events.splice(index + 1, token.type === "labelImage" ? 4 : 2);
				token.type = "data";
				index++;
			}
		}
		return events;
	}
	function resolveToLabelEnd(events, context) {
		let index = events.length;
		let offset = 0;
		let token;
		let open;
		let close;
		let media;
		while (index--) {
			token = events[index][1];
			if (open) {
				if (token.type === "link" || token.type === "labelLink" && token._inactive) break;
				if (events[index][0] === "enter" && token.type === "labelLink") token._inactive = true;
			} else if (close) {
				if (events[index][0] === "enter" && (token.type === "labelImage" || token.type === "labelLink") && !token._balanced) {
					open = index;
					if (token.type !== "labelLink") {
						offset = 2;
						break;
					}
				}
			} else if (token.type === "labelEnd") close = index;
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
		const text = {
			type: "labelText",
			start: Object.assign({}, events[open + offset + 2][1].end),
			end: Object.assign({}, events[close - 2][1].start)
		};
		media = [[
			"enter",
			group,
			context
		], [
			"enter",
			label,
			context
		]];
		media = push(media, events.slice(open + 1, open + offset + 3));
		media = push(media, [[
			"enter",
			text,
			context
		]]);
		media = push(media, resolveAll(context.parser.constructs.insideSpan.null, events.slice(open + offset + 4, close - 3), context));
		media = push(media, [
			[
				"exit",
				text,
				context
			],
			events[close - 2],
			events[close - 1],
			[
				"exit",
				label,
				context
			]
		]);
		media = push(media, events.slice(close + 1));
		media = push(media, [[
			"exit",
			group,
			context
		]]);
		splice(events, open, events.length, media);
		return events;
	}
	function tokenizeLabelEnd(effects, ok, nok) {
		const self = this;
		let index = self.events.length;
		let labelStart;
		let defined;
		while (index--) if ((self.events[index][1].type === "labelImage" || self.events[index][1].type === "labelLink") && !self.events[index][1]._balanced) {
			labelStart = self.events[index][1];
			break;
		}
		return start;
		function start(code) {
			if (!labelStart) return nok(code);
			if (labelStart._inactive) return balanced(code);
			defined = self.parser.defined.includes(normalizeIdentifier(self.sliceSerialize({
				start: labelStart.end,
				end: self.now()
			})));
			effects.enter("labelEnd");
			effects.enter("labelMarker");
			effects.consume(code);
			effects.exit("labelMarker");
			effects.exit("labelEnd");
			return afterLabelEnd;
		}
		function afterLabelEnd(code) {
			if (code === 40) return effects.attempt(resourceConstruct, ok, defined ? ok : balanced)(code);
			if (code === 91) return effects.attempt(fullReferenceConstruct, ok, defined ? effects.attempt(collapsedReferenceConstruct, ok, balanced) : balanced)(code);
			return defined ? ok(code) : balanced(code);
		}
		function balanced(code) {
			labelStart._balanced = true;
			return nok(code);
		}
	}
	function tokenizeResource(effects, ok, nok) {
		return start;
		function start(code) {
			effects.enter("resource");
			effects.enter("resourceMarker");
			effects.consume(code);
			effects.exit("resourceMarker");
			return factoryWhitespace(effects, open);
		}
		function open(code) {
			if (code === 41) return end(code);
			return factoryDestination(effects, destinationAfter, nok, "resourceDestination", "resourceDestinationLiteral", "resourceDestinationLiteralMarker", "resourceDestinationRaw", "resourceDestinationString", 32)(code);
		}
		function destinationAfter(code) {
			return markdownLineEndingOrSpace(code) ? factoryWhitespace(effects, between)(code) : end(code);
		}
		function between(code) {
			if (code === 34 || code === 39 || code === 40) return factoryTitle(effects, factoryWhitespace(effects, end), nok, "resourceTitle", "resourceTitleMarker", "resourceTitleString")(code);
			return end(code);
		}
		function end(code) {
			if (code === 41) {
				effects.enter("resourceMarker");
				effects.consume(code);
				effects.exit("resourceMarker");
				effects.exit("resource");
				return ok;
			}
			return nok(code);
		}
	}
	function tokenizeFullReference(effects, ok, nok) {
		const self = this;
		return start;
		function start(code) {
			return factoryLabel.call(self, effects, afterLabel, nok, "reference", "referenceMarker", "referenceString")(code);
		}
		function afterLabel(code) {
			return self.parser.defined.includes(normalizeIdentifier(self.sliceSerialize(self.events[self.events.length - 1][1]).slice(1, -1))) ? ok(code) : nok(code);
		}
	}
	function tokenizeCollapsedReference(effects, ok, nok) {
		return start;
		function start(code) {
			effects.enter("reference");
			effects.enter("referenceMarker");
			effects.consume(code);
			effects.exit("referenceMarker");
			return open;
		}
		function open(code) {
			if (code === 93) {
				effects.enter("referenceMarker");
				effects.consume(code);
				effects.exit("referenceMarker");
				effects.exit("reference");
				return ok;
			}
			return nok(code);
		}
	}
	var labelStartImage = {
		name: "labelStartImage",
		tokenize: tokenizeLabelStartImage,
		resolveAll: labelEnd.resolveAll
	};
	function tokenizeLabelStartImage(effects, ok, nok) {
		const self = this;
		return start;
		function start(code) {
			effects.enter("labelImage");
			effects.enter("labelImageMarker");
			effects.consume(code);
			effects.exit("labelImageMarker");
			return open;
		}
		function open(code) {
			if (code === 91) {
				effects.enter("labelMarker");
				effects.consume(code);
				effects.exit("labelMarker");
				effects.exit("labelImage");
				return after;
			}
			return nok(code);
		}
		function after(code) {
			return code === 94 && "_hiddenFootnoteSupport" in self.parser.constructs ? nok(code) : ok(code);
		}
	}
	var labelStartLink = {
		name: "labelStartLink",
		tokenize: tokenizeLabelStartLink,
		resolveAll: labelEnd.resolveAll
	};
	function tokenizeLabelStartLink(effects, ok, nok) {
		const self = this;
		return start;
		function start(code) {
			effects.enter("labelLink");
			effects.enter("labelMarker");
			effects.consume(code);
			effects.exit("labelMarker");
			effects.exit("labelLink");
			return after;
		}
		function after(code) {
			return code === 94 && "_hiddenFootnoteSupport" in self.parser.constructs ? nok(code) : ok(code);
		}
	}
	var lineEnding = {
		name: "lineEnding",
		tokenize: tokenizeLineEnding
	};
	function tokenizeLineEnding(effects, ok) {
		return start;
		function start(code) {
			effects.enter("lineEnding");
			effects.consume(code);
			effects.exit("lineEnding");
			return factorySpace(effects, ok, "linePrefix");
		}
	}
	var thematicBreak$2 = {
		name: "thematicBreak",
		tokenize: tokenizeThematicBreak
	};
	function tokenizeThematicBreak(effects, ok, nok) {
		let size = 0;
		let marker;
		return start;
		function start(code) {
			effects.enter("thematicBreak");
			marker = code;
			return atBreak(code);
		}
		function atBreak(code) {
			if (code === marker) {
				effects.enter("thematicBreakSequence");
				return sequence(code);
			}
			if (markdownSpace(code)) return factorySpace(effects, atBreak, "whitespace")(code);
			if (size < 3 || code !== null && !markdownLineEnding(code)) return nok(code);
			effects.exit("thematicBreak");
			return ok(code);
		}
		function sequence(code) {
			if (code === marker) {
				effects.consume(code);
				size++;
				return sequence;
			}
			effects.exit("thematicBreakSequence");
			return atBreak(code);
		}
	}
	var list$2 = {
		name: "list",
		tokenize: tokenizeListStart,
		continuation: { tokenize: tokenizeListContinuation },
		exit: tokenizeListEnd
	};
	var listItemPrefixWhitespaceConstruct = {
		tokenize: tokenizeListItemPrefixWhitespace,
		partial: true
	};
	var indentConstruct = {
		tokenize: tokenizeIndent$1,
		partial: true
	};
	function tokenizeListStart(effects, ok, nok) {
		const self = this;
		const tail = self.events[self.events.length - 1];
		let initialSize = tail && tail[1].type === "linePrefix" ? tail[2].sliceSerialize(tail[1], true).length : 0;
		let size = 0;
		return start;
		function start(code) {
			const kind = self.containerState.type || (code === 42 || code === 43 || code === 45 ? "listUnordered" : "listOrdered");
			if (kind === "listUnordered" ? !self.containerState.marker || code === self.containerState.marker : asciiDigit(code)) {
				if (!self.containerState.type) {
					self.containerState.type = kind;
					effects.enter(kind, { _container: true });
				}
				if (kind === "listUnordered") {
					effects.enter("listItemPrefix");
					return code === 42 || code === 45 ? effects.check(thematicBreak$2, nok, atMarker)(code) : atMarker(code);
				}
				if (!self.interrupt || code === 49) {
					effects.enter("listItemPrefix");
					effects.enter("listItemValue");
					return inside(code);
				}
			}
			return nok(code);
		}
		function inside(code) {
			if (asciiDigit(code) && ++size < 10) {
				effects.consume(code);
				return inside;
			}
			if ((!self.interrupt || size < 2) && (self.containerState.marker ? code === self.containerState.marker : code === 41 || code === 46)) {
				effects.exit("listItemValue");
				return atMarker(code);
			}
			return nok(code);
		}
		function atMarker(code) {
			effects.enter("listItemMarker");
			effects.consume(code);
			effects.exit("listItemMarker");
			self.containerState.marker = self.containerState.marker || code;
			return effects.check(blankLine, self.interrupt ? nok : onBlank, effects.attempt(listItemPrefixWhitespaceConstruct, endOfPrefix, otherPrefix));
		}
		function onBlank(code) {
			self.containerState.initialBlankLine = true;
			initialSize++;
			return endOfPrefix(code);
		}
		function otherPrefix(code) {
			if (markdownSpace(code)) {
				effects.enter("listItemPrefixWhitespace");
				effects.consume(code);
				effects.exit("listItemPrefixWhitespace");
				return endOfPrefix;
			}
			return nok(code);
		}
		function endOfPrefix(code) {
			self.containerState.size = initialSize + self.sliceSerialize(effects.exit("listItemPrefix"), true).length;
			return ok(code);
		}
	}
	function tokenizeListContinuation(effects, ok, nok) {
		const self = this;
		self.containerState._closeFlow = void 0;
		return effects.check(blankLine, onBlank, notBlank);
		function onBlank(code) {
			self.containerState.furtherBlankLines = self.containerState.furtherBlankLines || self.containerState.initialBlankLine;
			return factorySpace(effects, ok, "listItemIndent", self.containerState.size + 1)(code);
		}
		function notBlank(code) {
			if (self.containerState.furtherBlankLines || !markdownSpace(code)) {
				self.containerState.furtherBlankLines = void 0;
				self.containerState.initialBlankLine = void 0;
				return notInCurrentItem(code);
			}
			self.containerState.furtherBlankLines = void 0;
			self.containerState.initialBlankLine = void 0;
			return effects.attempt(indentConstruct, ok, notInCurrentItem)(code);
		}
		function notInCurrentItem(code) {
			self.containerState._closeFlow = true;
			self.interrupt = void 0;
			return factorySpace(effects, effects.attempt(list$2, ok, nok), "linePrefix", self.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(code);
		}
	}
	function tokenizeIndent$1(effects, ok, nok) {
		const self = this;
		return factorySpace(effects, afterPrefix, "listItemIndent", self.containerState.size + 1);
		function afterPrefix(code) {
			const tail = self.events[self.events.length - 1];
			return tail && tail[1].type === "listItemIndent" && tail[2].sliceSerialize(tail[1], true).length === self.containerState.size ? ok(code) : nok(code);
		}
	}
	function tokenizeListEnd(effects) {
		effects.exit(this.containerState.type);
	}
	function tokenizeListItemPrefixWhitespace(effects, ok, nok) {
		const self = this;
		return factorySpace(effects, afterPrefix, "listItemPrefixWhitespace", self.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 5);
		function afterPrefix(code) {
			const tail = self.events[self.events.length - 1];
			return !markdownSpace(code) && tail && tail[1].type === "listItemPrefixWhitespace" ? ok(code) : nok(code);
		}
	}
	var setextUnderline = {
		name: "setextUnderline",
		tokenize: tokenizeSetextUnderline,
		resolveTo: resolveToSetextUnderline
	};
	function resolveToSetextUnderline(events, context) {
		let index = events.length;
		let content;
		let text;
		let definition;
		while (index--) if (events[index][0] === "enter") {
			if (events[index][1].type === "content") {
				content = index;
				break;
			}
			if (events[index][1].type === "paragraph") text = index;
		} else {
			if (events[index][1].type === "content") events.splice(index, 1);
			if (!definition && events[index][1].type === "definition") definition = index;
		}
		const heading = {
			type: "setextHeading",
			start: Object.assign({}, events[text][1].start),
			end: Object.assign({}, events[events.length - 1][1].end)
		};
		events[text][1].type = "setextHeadingText";
		if (definition) {
			events.splice(text, 0, [
				"enter",
				heading,
				context
			]);
			events.splice(definition + 1, 0, [
				"exit",
				events[content][1],
				context
			]);
			events[content][1].end = Object.assign({}, events[definition][1].end);
		} else events[content][1] = heading;
		events.push([
			"exit",
			heading,
			context
		]);
		return events;
	}
	function tokenizeSetextUnderline(effects, ok, nok) {
		const self = this;
		let index = self.events.length;
		let marker;
		let paragraph;
		while (index--) if (self.events[index][1].type !== "lineEnding" && self.events[index][1].type !== "linePrefix" && self.events[index][1].type !== "content") {
			paragraph = self.events[index][1].type === "paragraph";
			break;
		}
		return start;
		function start(code) {
			if (!self.parser.lazy[self.now().line] && (self.interrupt || paragraph)) {
				effects.enter("setextHeadingLine");
				effects.enter("setextHeadingLineSequence");
				marker = code;
				return closingSequence(code);
			}
			return nok(code);
		}
		function closingSequence(code) {
			if (code === marker) {
				effects.consume(code);
				return closingSequence;
			}
			effects.exit("setextHeadingLineSequence");
			return factorySpace(effects, closingSequenceEnd, "lineSuffix")(code);
		}
		function closingSequenceEnd(code) {
			if (code === null || markdownLineEnding(code)) {
				effects.exit("setextHeadingLine");
				return ok(code);
			}
			return nok(code);
		}
	}
	var flow$1 = { tokenize: initializeFlow };
	function initializeFlow(effects) {
		const self = this;
		const initial = effects.attempt(blankLine, atBlankEnding, effects.attempt(this.parser.constructs.flowInitial, afterConstruct, factorySpace(effects, effects.attempt(this.parser.constructs.flow, afterConstruct, effects.attempt(content, afterConstruct)), "linePrefix")));
		return initial;
		function atBlankEnding(code) {
			if (code === null) {
				effects.consume(code);
				return;
			}
			effects.enter("lineEndingBlank");
			effects.consume(code);
			effects.exit("lineEndingBlank");
			self.currentConstruct = void 0;
			return initial;
		}
		function afterConstruct(code) {
			if (code === null) {
				effects.consume(code);
				return;
			}
			effects.enter("lineEnding");
			effects.consume(code);
			effects.exit("lineEnding");
			self.currentConstruct = void 0;
			return initial;
		}
	}
	var resolver = { resolveAll: createResolver() };
	var string$1 = initializeFactory("string");
	var text$4 = initializeFactory("text");
	function initializeFactory(field) {
		return {
			tokenize: initializeText,
			resolveAll: createResolver(field === "text" ? resolveAllLineSuffixes : void 0)
		};
		function initializeText(effects) {
			const self = this;
			const constructs = this.parser.constructs[field];
			const text = effects.attempt(constructs, start, notText);
			return start;
			function start(code) {
				return atBreak(code) ? text(code) : notText(code);
			}
			function notText(code) {
				if (code === null) {
					effects.consume(code);
					return;
				}
				effects.enter("data");
				effects.consume(code);
				return data;
			}
			function data(code) {
				if (atBreak(code)) {
					effects.exit("data");
					return text(code);
				}
				effects.consume(code);
				return data;
			}
			function atBreak(code) {
				if (code === null) return true;
				const list = constructs[code];
				let index = -1;
				if (list) while (++index < list.length) {
					const item = list[index];
					if (!item.previous || item.previous.call(self, self.previous)) return true;
				}
				return false;
			}
		}
	}
	function createResolver(extraResolver) {
		return resolveAllText;
		function resolveAllText(events, context) {
			let index = -1;
			let enter;
			while (++index <= events.length) if (enter === void 0) {
				if (events[index] && events[index][1].type === "data") {
					enter = index;
					index++;
				}
			} else if (!events[index] || events[index][1].type !== "data") {
				if (index !== enter + 2) {
					events[enter][1].end = events[index - 1][1].end;
					events.splice(enter + 2, index - enter - 2);
					index = enter + 2;
				}
				enter = void 0;
			}
			return extraResolver ? extraResolver(events, context) : events;
		}
	}
	function resolveAllLineSuffixes(events, context) {
		let eventIndex = 0;
		while (++eventIndex <= events.length) if ((eventIndex === events.length || events[eventIndex][1].type === "lineEnding") && events[eventIndex - 1][1].type === "data") {
			const data = events[eventIndex - 1][1];
			const chunks = context.sliceStream(data);
			let index = chunks.length;
			let bufferIndex = -1;
			let size = 0;
			let tabs;
			while (index--) {
				const chunk = chunks[index];
				if (typeof chunk === "string") {
					bufferIndex = chunk.length;
					while (chunk.charCodeAt(bufferIndex - 1) === 32) {
						size++;
						bufferIndex--;
					}
					if (bufferIndex) break;
					bufferIndex = -1;
				} else if (chunk === -2) {
					tabs = true;
					size++;
				} else if (chunk === -1) {} else {
					index++;
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
						_index: data.start._index + index,
						_bufferIndex: index ? bufferIndex : data.start._bufferIndex + bufferIndex
					},
					end: Object.assign({}, data.end)
				};
				data.end = Object.assign({}, token.start);
				if (data.start.offset === data.end.offset) Object.assign(data, token);
				else {
					events.splice(eventIndex, 0, [
						"enter",
						token,
						context
					], [
						"exit",
						token,
						context
					]);
					eventIndex += 2;
				}
			}
			eventIndex++;
		}
		return events;
	}
	function createTokenizer(parser, initialize, from) {
		let point = Object.assign(from ? Object.assign({}, from) : {
			line: 1,
			column: 1,
			offset: 0
		}, {
			_index: 0,
			_bufferIndex: -1
		});
		const columnStart = {};
		const resolveAllConstructs = [];
		let chunks = [];
		let stack = [];
		const effects = {
			consume,
			enter,
			exit,
			attempt: constructFactory(onsuccessfulconstruct),
			check: constructFactory(onsuccessfulcheck),
			interrupt: constructFactory(onsuccessfulcheck, { interrupt: true })
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
		if (initialize.resolveAll) resolveAllConstructs.push(initialize);
		return context;
		function write(slice) {
			chunks = push(chunks, slice);
			main();
			if (chunks[chunks.length - 1] !== null) return [];
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
			return Object.assign({}, point);
		}
		function defineSkip(value) {
			columnStart[value.line] = value.column;
			accountForPotentialSkip();
		}
		function main() {
			let chunkIndex;
			while (point._index < chunks.length) {
				const chunk = chunks[point._index];
				if (typeof chunk === "string") {
					chunkIndex = point._index;
					if (point._bufferIndex < 0) point._bufferIndex = 0;
					while (point._index === chunkIndex && point._bufferIndex < chunk.length) go(chunk.charCodeAt(point._bufferIndex));
				} else go(chunk);
			}
		}
		function go(code) {
			state = state(code);
		}
		function consume(code) {
			if (markdownLineEnding(code)) {
				point.line++;
				point.column = 1;
				point.offset += code === -3 ? 2 : 1;
				accountForPotentialSkip();
			} else if (code !== -1) {
				point.column++;
				point.offset++;
			}
			if (point._bufferIndex < 0) point._index++;
			else {
				point._bufferIndex++;
				if (point._bufferIndex === chunks[point._index].length) {
					point._bufferIndex = -1;
					point._index++;
				}
			}
			context.previous = code;
		}
		function enter(type, fields) {
			const token = fields || {};
			token.type = type;
			token.start = now();
			context.events.push([
				"enter",
				token,
				context
			]);
			stack.push(token);
			return token;
		}
		function exit(type) {
			const token = stack.pop();
			token.end = now();
			context.events.push([
				"exit",
				token,
				context
			]);
			return token;
		}
		function onsuccessfulconstruct(construct, info) {
			addResult(construct, info.from);
		}
		function onsuccessfulcheck(_, info) {
			info.restore();
		}
		function constructFactory(onreturn, fields) {
			return hook;
			function hook(constructs, returnState, bogusState) {
				let listOfConstructs;
				let constructIndex;
				let currentConstruct;
				let info;
				return Array.isArray(constructs) ? handleListOfConstructs(constructs) : "tokenize" in constructs ? handleListOfConstructs([constructs]) : handleMapOfConstructs(constructs);
				function handleMapOfConstructs(map) {
					return start;
					function start(code) {
						const def = code !== null && map[code];
						const all = code !== null && map.null;
						return handleListOfConstructs([...Array.isArray(def) ? def : def ? [def] : [], ...Array.isArray(all) ? all : all ? [all] : []])(code);
					}
				}
				function handleListOfConstructs(list) {
					listOfConstructs = list;
					constructIndex = 0;
					if (list.length === 0) return bogusState;
					return handleConstruct(list[constructIndex]);
				}
				function handleConstruct(construct) {
					return start;
					function start(code) {
						info = store();
						currentConstruct = construct;
						if (!construct.partial) context.currentConstruct = construct;
						if (construct.name && context.parser.constructs.disable.null.includes(construct.name)) return nok(code);
						return construct.tokenize.call(fields ? Object.assign(Object.create(context), fields) : context, effects, ok, nok)(code);
					}
				}
				function ok(code) {
					onreturn(currentConstruct, info);
					return returnState;
				}
				function nok(code) {
					info.restore();
					if (++constructIndex < listOfConstructs.length) return handleConstruct(listOfConstructs[constructIndex]);
					return bogusState;
				}
			}
		}
		function addResult(construct, from) {
			if (construct.resolveAll && !resolveAllConstructs.includes(construct)) resolveAllConstructs.push(construct);
			if (construct.resolve) splice(context.events, from, context.events.length - from, construct.resolve(context.events.slice(from), context));
			if (construct.resolveTo) context.events = construct.resolveTo(context.events, context);
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
				point = startPoint;
				context.previous = startPrevious;
				context.currentConstruct = startCurrentConstruct;
				context.events.length = startEventsIndex;
				stack = startStack;
				accountForPotentialSkip();
			}
		}
		function accountForPotentialSkip() {
			if (point.line in columnStart && point.column < 2) {
				point.column = columnStart[point.line];
				point.offset += columnStart[point.line] - 1;
			}
		}
	}
	function sliceChunks(chunks, token) {
		const startIndex = token.start._index;
		const startBufferIndex = token.start._bufferIndex;
		const endIndex = token.end._index;
		const endBufferIndex = token.end._bufferIndex;
		let view;
		if (startIndex === endIndex) view = [chunks[startIndex].slice(startBufferIndex, endBufferIndex)];
		else {
			view = chunks.slice(startIndex, endIndex);
			if (startBufferIndex > -1) view[0] = view[0].slice(startBufferIndex);
			if (endBufferIndex > 0) view.push(chunks[endIndex].slice(0, endBufferIndex));
		}
		return view;
	}
	function serializeChunks(chunks, expandTabs) {
		let index = -1;
		const result = [];
		let atTab;
		while (++index < chunks.length) {
			const chunk = chunks[index];
			let value;
			if (typeof chunk === "string") value = chunk;
			else switch (chunk) {
				case -5:
					value = "\r";
					break;
				case -4:
					value = "\n";
					break;
				case -3:
					value = "\r\n";
					break;
				case -2:
					value = expandTabs ? " " : "	";
					break;
				case -1:
					if (!expandTabs && atTab) continue;
					value = " ";
					break;
				default: value = String.fromCharCode(chunk);
			}
			atTab = chunk === -2;
			result.push(value);
		}
		return result.join("");
	}
	var constructs_exports = __exportAll({
		attentionMarkers: () => attentionMarkers,
		contentInitial: () => contentInitial,
		disable: () => disable,
		document: () => document$1,
		flow: () => flow,
		flowInitial: () => flowInitial,
		insideSpan: () => insideSpan,
		string: () => string,
		text: () => text$3
	});
	var document$1 = {
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
	var contentInitial = { [91]: definition$1 };
	var flowInitial = {
		[-2]: codeIndented,
		[-1]: codeIndented,
		[32]: codeIndented
	};
	var flow = {
		[35]: headingAtx,
		[42]: thematicBreak$2,
		[45]: [setextUnderline, thematicBreak$2],
		[60]: htmlFlow,
		[61]: setextUnderline,
		[95]: thematicBreak$2,
		[96]: codeFenced,
		[126]: codeFenced
	};
	var string = {
		[38]: characterReference,
		[92]: characterEscape
	};
	var text$3 = {
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
	var insideSpan = { null: [attention, resolver] };
	var attentionMarkers = { null: [42, 95] };
	var disable = { null: [] };
	function parse(options = {}) {
		const parser = {
			defined: [],
			lazy: {},
			constructs: combineExtensions([constructs_exports].concat(options.extensions || [])),
			content: create(content$1),
			document: create(document$2),
			flow: create(flow$1),
			string: create(string$1),
			text: create(text$4)
		};
		return parser;
		function create(initial) {
			return creator;
			function creator(from) {
				return createTokenizer(parser, initial, from);
			}
		}
	}
	var search = /[\0\t\n\r]/g;
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
			let code;
			value = buffer + value.toString(encoding);
			startPosition = 0;
			buffer = "";
			if (start) {
				if (value.charCodeAt(0) === 65279) startPosition++;
				start = void 0;
			}
			while (startPosition < value.length) {
				search.lastIndex = startPosition;
				match = search.exec(value);
				endPosition = match && match.index !== void 0 ? match.index : value.length;
				code = value.charCodeAt(endPosition);
				if (!match) {
					buffer = value.slice(startPosition);
					break;
				}
				if (code === 10 && startPosition === endPosition && atCarriageReturn) {
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
					switch (code) {
						case 0:
							chunks.push(65533);
							column++;
							break;
						case 9:
							next = Math.ceil(column / 4) * 4;
							chunks.push(-2);
							while (column++ < next) chunks.push(-1);
							break;
						case 10:
							chunks.push(-4);
							column = 1;
							break;
						default:
							atCarriageReturn = true;
							column = 1;
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
		while (!subtokenize(events));
		return events;
	}
	function decodeNumericCharacterReference(value, base) {
		const code = Number.parseInt(value, base);
		if (code < 9 || code === 11 || code > 13 && code < 32 || code > 126 && code < 160 || code > 55295 && code < 57344 || code > 64975 && code < 65008 || (code & 65535) === 65535 || (code & 65535) === 65534 || code > 1114111) return "�";
		return String.fromCharCode(code);
	}
	var characterEscapeOrReference = /\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;
	function decodeString(value) {
		return value.replace(characterEscapeOrReference, decode);
	}
	function decode($0, $1, $2) {
		if ($1) return $1;
		if ($2.charCodeAt(0) === 35) {
			const head = $2.charCodeAt(1);
			const hex = head === 120 || head === 88;
			return decodeNumericCharacterReference($2.slice(hex ? 2 : 1), hex ? 16 : 10);
		}
		return decodeNamedCharacterReference($2) || $0;
	}
	function stringifyPosition(value) {
		if (!value || typeof value !== "object") return "";
		if ("position" in value || "type" in value) return position$1(value.position);
		if ("start" in value || "end" in value) return position$1(value);
		if ("line" in value || "column" in value) return point$2(value);
		return "";
	}
	function point$2(point) {
		return index(point && point.line) + ":" + index(point && point.column);
	}
	function position$1(pos) {
		return point$2(pos && pos.start) + "-" + point$2(pos && pos.end);
	}
	function index(value) {
		return value && typeof value === "number" ? value : 1;
	}
	var own$3 = {}.hasOwnProperty;
	var fromMarkdown$1 = function(value, encoding, options) {
		if (typeof encoding !== "string") {
			options = encoding;
			encoding = void 0;
		}
		return compiler(options)(postprocess(parse(options).document().write(preprocess()(value, encoding, true))));
	};
	function compiler(options) {
		const config = {
			transforms: [],
			canContainEols: [
				"emphasis",
				"fragment",
				"heading",
				"paragraph",
				"strong"
			],
			enter: {
				autolink: opener(link),
				autolinkProtocol: onenterdata,
				autolinkEmail: onenterdata,
				atxHeading: opener(heading),
				blockQuote: opener(blockQuote),
				characterEscape: onenterdata,
				characterReference: onenterdata,
				codeFenced: opener(codeFlow),
				codeFencedFenceInfo: buffer,
				codeFencedFenceMeta: buffer,
				codeIndented: opener(codeFlow, buffer),
				codeText: opener(codeText, buffer),
				codeTextData: onenterdata,
				data: onenterdata,
				codeFlowValue: onenterdata,
				definition: opener(definition),
				definitionDestinationString: buffer,
				definitionLabelString: buffer,
				definitionTitleString: buffer,
				emphasis: opener(emphasis),
				hardBreakEscape: opener(hardBreak),
				hardBreakTrailing: opener(hardBreak),
				htmlFlow: opener(html, buffer),
				htmlFlowData: onenterdata,
				htmlText: opener(html, buffer),
				htmlTextData: onenterdata,
				image: opener(image),
				label: buffer,
				link: opener(link),
				listItem: opener(listItem),
				listItemValue: onenterlistitemvalue,
				listOrdered: opener(list, onenterlistordered),
				listUnordered: opener(list),
				paragraph: opener(paragraph),
				reference: onenterreference,
				referenceString: buffer,
				resourceDestinationString: buffer,
				resourceTitleString: buffer,
				setextHeading: opener(heading),
				strong: opener(strong),
				thematicBreak: opener(thematicBreak)
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
				exit,
				buffer,
				resume,
				setData,
				getData
			};
			const listStack = [];
			let index = -1;
			while (++index < events.length) if (events[index][1].type === "listOrdered" || events[index][1].type === "listUnordered") {
				if (events[index][0] === "enter") listStack.push(index);
				else index = prepareList(events, listStack.pop(), index);
			}
			index = -1;
			while (++index < events.length) {
				const handler = config[events[index][0]];
				if (own$3.call(handler, events[index][1].type)) handler[events[index][1].type].call(Object.assign({ sliceSerialize: events[index][2].sliceSerialize }, context), events[index][1]);
			}
			if (context.tokenStack.length > 0) {
				const tail = context.tokenStack[context.tokenStack.length - 1];
				(tail[1] || defaultOnError).call(context, void 0, tail[0]);
			}
			tree.position = {
				start: point$1(events.length > 0 ? events[0][1].start : {
					line: 1,
					column: 1,
					offset: 0
				}),
				end: point$1(events.length > 0 ? events[events.length - 2][1].end : {
					line: 1,
					column: 1,
					offset: 0
				})
			};
			index = -1;
			while (++index < config.transforms.length) tree = config.transforms[index](tree) || tree;
			return tree;
		}
		function prepareList(events, start, length) {
			let index = start - 1;
			let containerBalance = -1;
			let listSpread = false;
			let listItem;
			let lineIndex;
			let firstBlankLineIndex;
			let atMarker;
			while (++index <= length) {
				const event = events[index];
				if (event[1].type === "listUnordered" || event[1].type === "listOrdered" || event[1].type === "blockQuote") {
					if (event[0] === "enter") containerBalance++;
					else containerBalance--;
					atMarker = void 0;
				} else if (event[1].type === "lineEndingBlank") {
					if (event[0] === "enter") {
						if (listItem && !atMarker && !containerBalance && !firstBlankLineIndex) firstBlankLineIndex = index;
						atMarker = void 0;
					}
				} else if (event[1].type === "linePrefix" || event[1].type === "listItemValue" || event[1].type === "listItemMarker" || event[1].type === "listItemPrefix" || event[1].type === "listItemPrefixWhitespace") {} else atMarker = void 0;
				if (!containerBalance && event[0] === "enter" && event[1].type === "listItemPrefix" || containerBalance === -1 && event[0] === "exit" && (event[1].type === "listUnordered" || event[1].type === "listOrdered")) {
					if (listItem) {
						let tailIndex = index;
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
							} else if (tailEvent[1].type === "linePrefix" || tailEvent[1].type === "blockQuotePrefix" || tailEvent[1].type === "blockQuotePrefixWhitespace" || tailEvent[1].type === "blockQuoteMarker" || tailEvent[1].type === "listItemIndent") {} else break;
						}
						if (firstBlankLineIndex && (!lineIndex || firstBlankLineIndex < lineIndex)) listItem._spread = true;
						listItem.end = Object.assign({}, lineIndex ? events[lineIndex][1].start : event[1].end);
						events.splice(lineIndex || index, 0, [
							"exit",
							listItem,
							event[2]
						]);
						index++;
						length++;
					}
					if (event[1].type === "listItemPrefix") {
						listItem = {
							type: "listItem",
							_spread: false,
							start: Object.assign({}, event[1].start),
							end: void 0
						};
						events.splice(index, 0, [
							"enter",
							listItem,
							event[2]
						]);
						index++;
						length++;
						firstBlankLineIndex = void 0;
						atMarker = true;
					}
				}
			}
			events[start][1]._spread = listSpread;
			return length;
		}
		function setData(key, value) {
			data[key] = value;
		}
		function getData(key) {
			return data[key];
		}
		function opener(create, and) {
			return open;
			function open(token) {
				enter.call(this, create(token), token);
				if (and) and.call(this, token);
			}
		}
		function buffer() {
			this.stack.push({
				type: "fragment",
				children: []
			});
		}
		function enter(node, token, errorHandler) {
			this.stack[this.stack.length - 1].children.push(node);
			this.stack.push(node);
			this.tokenStack.push([token, errorHandler]);
			node.position = { start: point$1(token.start) };
			return node;
		}
		function closer(and) {
			return close;
			function close(token) {
				if (and) and.call(this, token);
				exit.call(this, token);
			}
		}
		function exit(token, onExitError) {
			const node = this.stack.pop();
			const open = this.tokenStack.pop();
			if (!open) throw new Error("Cannot close `" + token.type + "` (" + stringifyPosition({
				start: token.start,
				end: token.end
			}) + "): it’s not open");
			else if (open[0].type !== token.type) {
				if (onExitError) onExitError.call(this, token, open[0]);
				else (open[1] || defaultOnError).call(this, token, open[0]);
			}
			node.position.end = point$1(token.end);
			return node;
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
			const data = this.resume();
			const node = this.stack[this.stack.length - 1];
			node.lang = data;
		}
		function onexitcodefencedfencemeta() {
			const data = this.resume();
			const node = this.stack[this.stack.length - 1];
			node.meta = data;
		}
		function onexitcodefencedfence() {
			if (getData("flowCodeInside")) return;
			this.buffer();
			setData("flowCodeInside", true);
		}
		function onexitcodefenced() {
			const data = this.resume();
			const node = this.stack[this.stack.length - 1];
			node.value = data.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, "");
			setData("flowCodeInside");
		}
		function onexitcodeindented() {
			const data = this.resume();
			const node = this.stack[this.stack.length - 1];
			node.value = data.replace(/(\r?\n|\r)$/g, "");
		}
		function onexitdefinitionlabelstring(token) {
			const label = this.resume();
			const node = this.stack[this.stack.length - 1];
			node.label = label;
			node.identifier = normalizeIdentifier(this.sliceSerialize(token)).toLowerCase();
		}
		function onexitdefinitiontitlestring() {
			const data = this.resume();
			const node = this.stack[this.stack.length - 1];
			node.title = data;
		}
		function onexitdefinitiondestinationstring() {
			const data = this.resume();
			const node = this.stack[this.stack.length - 1];
			node.url = data;
		}
		function onexitatxheadingsequence(token) {
			const node = this.stack[this.stack.length - 1];
			if (!node.depth) node.depth = this.sliceSerialize(token).length;
		}
		function onexitsetextheadingtext() {
			setData("setextHeadingSlurpLineEnding", true);
		}
		function onexitsetextheadinglinesequence(token) {
			const node = this.stack[this.stack.length - 1];
			node.depth = this.sliceSerialize(token).charCodeAt(0) === 61 ? 1 : 2;
		}
		function onexitsetextheading() {
			setData("setextHeadingSlurpLineEnding");
		}
		function onenterdata(token) {
			const node = this.stack[this.stack.length - 1];
			let tail = node.children[node.children.length - 1];
			if (!tail || tail.type !== "text") {
				tail = text();
				tail.position = { start: point$1(token.start) };
				node.children.push(tail);
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
			const data = this.resume();
			const node = this.stack[this.stack.length - 1];
			node.value = data;
		}
		function onexithtmltext() {
			const data = this.resume();
			const node = this.stack[this.stack.length - 1];
			node.value = data;
		}
		function onexitcodetext() {
			const data = this.resume();
			const node = this.stack[this.stack.length - 1];
			node.value = data;
		}
		function onexitlink() {
			const node = this.stack[this.stack.length - 1];
			if (getData("inReference")) {
				const referenceType = getData("referenceType") || "shortcut";
				node.type += "Reference";
				node.referenceType = referenceType;
				delete node.url;
				delete node.title;
			} else {
				delete node.identifier;
				delete node.label;
			}
			setData("referenceType");
		}
		function onexitimage() {
			const node = this.stack[this.stack.length - 1];
			if (getData("inReference")) {
				const referenceType = getData("referenceType") || "shortcut";
				node.type += "Reference";
				node.referenceType = referenceType;
				delete node.url;
				delete node.title;
			} else {
				delete node.identifier;
				delete node.label;
			}
			setData("referenceType");
		}
		function onexitlabeltext(token) {
			const string = this.sliceSerialize(token);
			const ancestor = this.stack[this.stack.length - 2];
			ancestor.label = decodeString(string);
			ancestor.identifier = normalizeIdentifier(string).toLowerCase();
		}
		function onexitlabel() {
			const fragment = this.stack[this.stack.length - 1];
			const value = this.resume();
			const node = this.stack[this.stack.length - 1];
			setData("inReference", true);
			if (node.type === "link") node.children = fragment.children;
			else node.alt = value;
		}
		function onexitresourcedestinationstring() {
			const data = this.resume();
			const node = this.stack[this.stack.length - 1];
			node.url = data;
		}
		function onexitresourcetitlestring() {
			const data = this.resume();
			const node = this.stack[this.stack.length - 1];
			node.title = data;
		}
		function onexitresource() {
			setData("inReference");
		}
		function onenterreference() {
			setData("referenceType", "collapsed");
		}
		function onexitreferencestring(token) {
			const label = this.resume();
			const node = this.stack[this.stack.length - 1];
			node.label = label;
			node.identifier = normalizeIdentifier(this.sliceSerialize(token)).toLowerCase();
			setData("referenceType", "full");
		}
		function onexitcharacterreferencemarker(token) {
			setData("characterReferenceType", token.type);
		}
		function onexitcharacterreferencevalue(token) {
			const data = this.sliceSerialize(token);
			const type = getData("characterReferenceType");
			let value;
			if (type) {
				value = decodeNumericCharacterReference(data, type === "characterReferenceMarkerNumeric" ? 10 : 16);
				setData("characterReferenceType");
			} else value = decodeNamedCharacterReference(data);
			const tail = this.stack.pop();
			tail.value += value;
			tail.position.end = point$1(token.end);
		}
		function onexitautolinkprotocol(token) {
			onexitdata.call(this, token);
			const node = this.stack[this.stack.length - 1];
			node.url = this.sliceSerialize(token);
		}
		function onexitautolinkemail(token) {
			onexitdata.call(this, token);
			const node = this.stack[this.stack.length - 1];
			node.url = "mailto:" + this.sliceSerialize(token);
		}
		function blockQuote() {
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
		function codeText() {
			return {
				type: "inlineCode",
				value: ""
			};
		}
		function definition() {
			return {
				type: "definition",
				identifier: "",
				label: null,
				title: null,
				url: ""
			};
		}
		function emphasis() {
			return {
				type: "emphasis",
				children: []
			};
		}
		function heading() {
			return {
				type: "heading",
				depth: void 0,
				children: []
			};
		}
		function hardBreak() {
			return { type: "break" };
		}
		function html() {
			return {
				type: "html",
				value: ""
			};
		}
		function image() {
			return {
				type: "image",
				title: null,
				url: "",
				alt: null
			};
		}
		function link() {
			return {
				type: "link",
				title: null,
				url: "",
				children: []
			};
		}
		function list(token) {
			return {
				type: "list",
				ordered: token.type === "listOrdered",
				start: null,
				spread: token._spread,
				children: []
			};
		}
		function listItem(token) {
			return {
				type: "listItem",
				spread: token._spread,
				checked: null,
				children: []
			};
		}
		function paragraph() {
			return {
				type: "paragraph",
				children: []
			};
		}
		function strong() {
			return {
				type: "strong",
				children: []
			};
		}
		function text() {
			return {
				type: "text",
				value: ""
			};
		}
		function thematicBreak() {
			return { type: "thematicBreak" };
		}
	}
	function point$1(d) {
		return {
			line: d.line,
			column: d.column,
			offset: d.offset
		};
	}
	function configure$1(combined, extensions) {
		let index = -1;
		while (++index < extensions.length) {
			const value = extensions[index];
			if (Array.isArray(value)) configure$1(combined, value);
			else extension(combined, value);
		}
	}
	function extension(combined, extension) {
		let key;
		for (key in extension) if (own$3.call(extension, key)) {
			if (key === "canContainEols") {
				const right = extension[key];
				if (right) combined[key].push(...right);
			} else if (key === "transforms") {
				const right = extension[key];
				if (right) combined[key].push(...right);
			} else if (key === "enter" || key === "exit") {
				const right = extension[key];
				if (right) Object.assign(combined[key], right);
			}
		}
	}
	function defaultOnError(left, right) {
		if (left) throw new Error("Cannot close `" + left.type + "` (" + stringifyPosition({
			start: left.start,
			end: left.end
		}) + "): a different token (`" + right.type + "`, " + stringifyPosition({
			start: right.start,
			end: right.end
		}) + ") is open");
		else throw new Error("Cannot close document, a token (`" + right.type + "`, " + stringifyPosition({
			start: right.start,
			end: right.end
		}) + ") is still open");
	}
	function escapeStringRegexp(string) {
		if (typeof string !== "string") throw new TypeError("Expected a string");
		return string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
	}
	var convert = (function(test) {
		if (test === void 0 || test === null) return ok;
		if (typeof test === "string") return typeFactory(test);
		if (typeof test === "object") return Array.isArray(test) ? anyFactory(test) : propsFactory(test);
		if (typeof test === "function") return castFactory(test);
		throw new Error("Expected function, string, or object as test");
	});
	function anyFactory(tests) {
		const checks = [];
		let index = -1;
		while (++index < tests.length) checks[index] = convert(tests[index]);
		return castFactory(any);
		function any(...parameters) {
			let index = -1;
			while (++index < checks.length) if (checks[index].call(this, ...parameters)) return true;
			return false;
		}
	}
	function propsFactory(check) {
		return castFactory(all);
		function all(node) {
			let key;
			for (key in check) if (node[key] !== check[key]) return false;
			return true;
		}
	}
	function typeFactory(check) {
		return castFactory(type);
		function type(node) {
			return node && node.type === check;
		}
	}
	function castFactory(check) {
		return assertion;
		function assertion(node, ...parameters) {
			return Boolean(node && typeof node === "object" && "type" in node && Boolean(check.call(this, node, ...parameters)));
		}
	}
	function ok() {
		return true;
	}
	function color(d) {
		return d;
	}
	var visitParents = (function(tree, test, visitor, reverse) {
		if (typeof test === "function" && typeof visitor !== "function") {
			reverse = visitor;
			visitor = test;
			test = null;
		}
		const is = convert(test);
		const step = reverse ? -1 : 1;
		factory(tree, void 0, [])();
		function factory(node, index, parents) {
			const value = node && typeof node === "object" ? node : {};
			if (typeof value.type === "string") {
				const name = typeof value.tagName === "string" ? value.tagName : typeof value.name === "string" ? value.name : void 0;
				Object.defineProperty(visit, "name", { value: "node (" + color(node.type + (name ? "<" + name + ">" : "")) + ")" });
			}
			return visit;
			function visit() {
				let result = [];
				let subresult;
				let offset;
				let grandparents;
				if (!test || is(node, index, parents[parents.length - 1] || null)) {
					result = toResult(visitor(node, parents));
					if (result[0] === false) return result;
				}
				if (node.children && result[0] !== "skip") {
					offset = (reverse ? node.children.length : -1) + step;
					grandparents = parents.concat(node);
					while (offset > -1 && offset < node.children.length) {
						subresult = factory(node.children[offset], offset, grandparents)();
						if (subresult[0] === false) return subresult;
						offset = typeof subresult[1] === "number" ? subresult[1] : offset + step;
					}
				}
				return result;
			}
		}
	});
	function toResult(value) {
		if (Array.isArray(value)) return value;
		if (typeof value === "number") return [true, value];
		return [value];
	}
	var own$2 = {}.hasOwnProperty;
	var findAndReplace = (function(tree, find, replace, options) {
		let settings;
		let schema;
		if (typeof find === "string" || find instanceof RegExp) {
			schema = [[find, replace]];
			settings = options;
		} else {
			schema = find;
			settings = replace;
		}
		if (!settings) settings = {};
		const ignored = convert(settings.ignore || []);
		const pairs = toPairs(schema);
		let pairIndex = -1;
		while (++pairIndex < pairs.length) visitParents(tree, "text", visitor);
		return tree;
		function visitor(node, parents) {
			let index = -1;
			let grandparent;
			while (++index < parents.length) {
				const parent = parents[index];
				if (ignored(parent, grandparent ? grandparent.children.indexOf(parent) : void 0, grandparent)) return;
				grandparent = parent;
			}
			if (grandparent) return handler(node, parents);
		}
		function handler(node, parents) {
			const parent = parents[parents.length - 1];
			const find = pairs[pairIndex][0];
			const replace = pairs[pairIndex][1];
			let start = 0;
			const index = parent.children.indexOf(node);
			let change = false;
			let nodes = [];
			find.lastIndex = 0;
			let match = find.exec(node.value);
			while (match) {
				const position = match.index;
				const matchObject = {
					index: match.index,
					input: match.input,
					stack: [...parents, node]
				};
				let value = replace(...match, matchObject);
				if (typeof value === "string") value = value.length > 0 ? {
					type: "text",
					value
				} : void 0;
				if (value !== false) {
					if (start !== position) nodes.push({
						type: "text",
						value: node.value.slice(start, position)
					});
					if (Array.isArray(value)) nodes.push(...value);
					else if (value) nodes.push(value);
					start = position + match[0].length;
					change = true;
				}
				if (!find.global) break;
				match = find.exec(node.value);
			}
			if (change) {
				if (start < node.value.length) nodes.push({
					type: "text",
					value: node.value.slice(start)
				});
				parent.children.splice(index, 1, ...nodes);
			} else nodes = [node];
			return index + nodes.length;
		}
	});
	function toPairs(schema) {
		const result = [];
		if (typeof schema !== "object") throw new TypeError("Expected array or object as schema");
		if (Array.isArray(schema)) {
			let index = -1;
			while (++index < schema.length) result.push([toExpression(schema[index][0]), toFunction(schema[index][1])]);
		} else {
			let key;
			for (key in schema) if (own$2.call(schema, key)) result.push([toExpression(key), toFunction(schema[key])]);
		}
		return result;
	}
	function toExpression(find) {
		return typeof find === "string" ? new RegExp(escapeStringRegexp(find), "g") : find;
	}
	function toFunction(replace) {
		return typeof replace === "function" ? replace : () => replace;
	}
	var inConstruct = "phrasing";
	var notInConstruct = [
		"autolink",
		"link",
		"image",
		"label"
	];
	var gfmAutolinkLiteralFromMarkdown = {
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
	var gfmAutolinkLiteralToMarkdown = { unsafe: [
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
		{
			character: ":",
			before: "[ps]",
			after: "\\/",
			inConstruct,
			notInConstruct
		}
	] };
	function enterLiteralAutolink(token) {
		this.enter({
			type: "link",
			title: null,
			url: "",
			children: []
		}, token);
	}
	function enterLiteralAutolinkValue(token) {
		this.config.enter.autolinkProtocol.call(this, token);
	}
	function exitLiteralAutolinkHttp(token) {
		this.config.exit.autolinkProtocol.call(this, token);
	}
	function exitLiteralAutolinkWww(token) {
		this.config.exit.data.call(this, token);
		const node = this.stack[this.stack.length - 1];
		node.url = "http://" + this.sliceSerialize(token);
	}
	function exitLiteralAutolinkEmail(token) {
		this.config.exit.autolinkEmail.call(this, token);
	}
	function exitLiteralAutolink(token) {
		this.exit(token);
	}
	function transformGfmAutolinkLiterals(tree) {
		findAndReplace(tree, [[/(https?:\/\/|www(?=\.))([-.\w]+)([^ \t\r\n]*)/gi, findUrl], [/([-.\w+]+)@([-\w]+(?:\.[-\w]+)+)/g, findEmail]], { ignore: ["link", "linkReference"] });
	}
	function findUrl(_, protocol, domain, path, match) {
		let prefix = "";
		if (!previous(match)) return false;
		if (/^w/i.test(protocol)) {
			domain = protocol + domain;
			protocol = "";
			prefix = "http://";
		}
		if (!isCorrectDomain(domain)) return false;
		const parts = splitUrl(domain + path);
		if (!parts[0]) return false;
		const result = {
			type: "link",
			title: null,
			url: prefix + protocol + parts[0],
			children: [{
				type: "text",
				value: protocol + parts[0]
			}]
		};
		if (parts[1]) return [result, {
			type: "text",
			value: parts[1]
		}];
		return result;
	}
	function findEmail(_, atext, label, match) {
		if (!previous(match, true) || /[-\d_]$/.test(label)) return false;
		return {
			type: "link",
			title: null,
			url: "mailto:" + atext + "@" + label,
			children: [{
				type: "text",
				value: atext + "@" + label
			}]
		};
	}
	function isCorrectDomain(domain) {
		const parts = domain.split(".");
		if (parts.length < 2 || parts[parts.length - 1] && (/_/.test(parts[parts.length - 1]) || !/[a-zA-Z\d]/.test(parts[parts.length - 1])) || parts[parts.length - 2] && (/_/.test(parts[parts.length - 2]) || !/[a-zA-Z\d]/.test(parts[parts.length - 2]))) return false;
		return true;
	}
	function splitUrl(url) {
		const trailExec = /[!"&'),.:;<>?\]}]+$/.exec(url);
		if (!trailExec) return [url, void 0];
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
		const code = match.input.charCodeAt(match.index - 1);
		return (match.index === 0 || unicodeWhitespace(code) || unicodePunctuation(code)) && (!email || code !== 47);
	}
	function association(node) {
		if (node.label || !node.identifier) return node.label || "";
		return decodeString(node.identifier);
	}
	function containerFlow(parent, state, info) {
		const indexStack = state.indexStack;
		const children = parent.children || [];
		const tracker = state.createTracker(info);
		const results = [];
		let index = -1;
		indexStack.push(-1);
		while (++index < children.length) {
			const child = children[index];
			indexStack[indexStack.length - 1] = index;
			results.push(tracker.move(state.handle(child, parent, state, {
				before: "\n",
				after: "\n",
				...tracker.current()
			})));
			if (child.type !== "list") state.bulletLastUsed = void 0;
			if (index < children.length - 1) results.push(tracker.move(between(child, children[index + 1], parent, state)));
		}
		indexStack.pop();
		return results.join("");
	}
	function between(left, right, parent, state) {
		let index = state.join.length;
		while (index--) {
			const result = state.join[index](left, right, parent, state);
			if (result === true || result === 1) break;
			if (typeof result === "number") return "\n".repeat(1 + result);
			if (result === false) return "\n\n<!---->\n\n";
		}
		return "\n\n";
	}
	var eol = /\r?\n|\r/g;
	function indentLines(value, map) {
		const result = [];
		let start = 0;
		let line = 0;
		let match;
		while (match = eol.exec(value)) {
			one(value.slice(start, match.index));
			result.push(match[0]);
			start = match.index + match[0].length;
			line++;
		}
		one(value.slice(start));
		return result.join("");
		function one(value) {
			result.push(map(value, line, !value));
		}
	}
	function patternCompile(pattern) {
		if (!pattern._compiled) {
			const before = (pattern.atBreak ? "[\\r\\n][\\t ]*" : "") + (pattern.before ? "(?:" + pattern.before + ")" : "");
			pattern._compiled = new RegExp((before ? "(" + before + ")" : "") + (/[|\\{}()[\]^$+*?.-]/.test(pattern.character) ? "\\" : "") + pattern.character + (pattern.after ? "(?:" + pattern.after + ")" : ""), "g");
		}
		return pattern._compiled;
	}
	function patternInScope(stack, pattern) {
		return listInScope(stack, pattern.inConstruct, true) && !listInScope(stack, pattern.notInConstruct, false);
	}
	function listInScope(stack, list, none) {
		if (typeof list === "string") list = [list];
		if (!list || list.length === 0) return none;
		let index = -1;
		while (++index < list.length) if (stack.includes(list[index])) return true;
		return false;
	}
	function safe(state, input, config) {
		const value = (config.before || "") + (input || "") + (config.after || "");
		const positions = [];
		const result = [];
		const infos = {};
		let index = -1;
		while (++index < state.unsafe.length) {
			const pattern = state.unsafe[index];
			if (!patternInScope(state.stack, pattern)) continue;
			const expression = patternCompile(pattern);
			let match;
			while (match = expression.exec(value)) {
				const before = "before" in pattern || Boolean(pattern.atBreak);
				const after = "after" in pattern;
				const position = match.index + (before ? match[1].length : 0);
				if (positions.includes(position)) {
					if (infos[position].before && !before) infos[position].before = false;
					if (infos[position].after && !after) infos[position].after = false;
				} else {
					positions.push(position);
					infos[position] = {
						before,
						after
					};
				}
			}
		}
		positions.sort(numerical);
		let start = config.before ? config.before.length : 0;
		const end = value.length - (config.after ? config.after.length : 0);
		index = -1;
		while (++index < positions.length) {
			const position = positions[index];
			if (position < start || position >= end) continue;
			if (position + 1 < end && positions[index + 1] === position + 1 && infos[position].after && !infos[position + 1].before && !infos[position + 1].after || positions[index - 1] === position - 1 && infos[position].before && !infos[position - 1].before && !infos[position - 1].after) continue;
			if (start !== position) result.push(escapeBackslashes(value.slice(start, position), "\\"));
			start = position;
			if (/[!-/:-@[-`{-~]/.test(value.charAt(position)) && (!config.encode || !config.encode.includes(value.charAt(position)))) result.push("\\");
			else {
				result.push("&#x" + value.charCodeAt(position).toString(16).toUpperCase() + ";");
				start++;
			}
		}
		result.push(escapeBackslashes(value.slice(start, end), config.after));
		return result.join("");
	}
	function numerical(a, b) {
		return a - b;
	}
	function escapeBackslashes(value, after) {
		const expression = /\\(?=[!-/:-@[-`{-~])/g;
		const positions = [];
		const results = [];
		const whole = value + after;
		let index = -1;
		let start = 0;
		let match;
		while (match = expression.exec(whole)) positions.push(match.index);
		while (++index < positions.length) {
			if (start !== positions[index]) results.push(value.slice(start, positions[index]));
			results.push("\\");
			start = positions[index];
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
		return {
			move,
			current,
			shift
		};
		function current() {
			return {
				now: {
					line,
					column
				},
				lineShift
			};
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
			unsafe: [{
				character: "[",
				inConstruct: [
					"phrasing",
					"label",
					"reference"
				]
			}],
			handlers: {
				footnoteDefinition,
				footnoteReference: footnoteReference$1
			}
		};
	}
	function enterFootnoteDefinition(token) {
		this.enter({
			type: "footnoteDefinition",
			identifier: "",
			label: "",
			children: []
		}, token);
	}
	function enterFootnoteDefinitionLabelString() {
		this.buffer();
	}
	function exitFootnoteDefinitionLabelString(token) {
		const label = this.resume();
		const node = this.stack[this.stack.length - 1];
		node.label = label;
		node.identifier = normalizeIdentifier(this.sliceSerialize(token)).toLowerCase();
	}
	function exitFootnoteDefinition(token) {
		this.exit(token);
	}
	function enterFootnoteCall(token) {
		this.enter({
			type: "footnoteReference",
			identifier: "",
			label: ""
		}, token);
	}
	function enterFootnoteCallString() {
		this.buffer();
	}
	function exitFootnoteCallString(token) {
		const label = this.resume();
		const node = this.stack[this.stack.length - 1];
		node.label = label;
		node.identifier = normalizeIdentifier(this.sliceSerialize(token)).toLowerCase();
	}
	function exitFootnoteCall(token) {
		this.exit(token);
	}
	function footnoteReference$1(node, _, context, safeOptions) {
		const tracker = track(safeOptions);
		let value = tracker.move("[^");
		const exit = context.enter("footnoteReference");
		const subexit = context.enter("reference");
		value += tracker.move(safe(context, association(node), {
			...tracker.current(),
			before: value,
			after: "]"
		}));
		subexit();
		exit();
		value += tracker.move("]");
		return value;
	}
	function footnoteReferencePeek() {
		return "[";
	}
	function footnoteDefinition(node, _, context, safeOptions) {
		const tracker = track(safeOptions);
		let value = tracker.move("[^");
		const exit = context.enter("footnoteDefinition");
		const subexit = context.enter("label");
		value += tracker.move(safe(context, association(node), {
			...tracker.current(),
			before: value,
			after: "]"
		}));
		subexit();
		value += tracker.move("]:" + (node.children && node.children.length > 0 ? " " : ""));
		tracker.shift(4);
		value += tracker.move(indentLines(containerFlow(node, context, tracker.current()), map$2));
		exit();
		return value;
	}
	function map$2(line, index, blank) {
		if (index === 0) return line;
		return (blank ? "" : "    ") + line;
	}
	function containerPhrasing(parent, state, info) {
		const indexStack = state.indexStack;
		const children = parent.children || [];
		const results = [];
		let index = -1;
		let before = info.before;
		indexStack.push(-1);
		let tracker = state.createTracker(info);
		while (++index < children.length) {
			const child = children[index];
			let after;
			indexStack[indexStack.length - 1] = index;
			if (index + 1 < children.length) {
				let handle = state.handle.handlers[children[index + 1].type];
				if (handle && handle.peek) handle = handle.peek;
				after = handle ? handle(children[index + 1], parent, state, {
					before: "",
					after: "",
					...tracker.current()
				}).charAt(0) : "";
			} else after = info.after;
			if (results.length > 0 && (before === "\r" || before === "\n") && child.type === "html") {
				results[results.length - 1] = results[results.length - 1].replace(/(\r?\n|\r)$/, " ");
				before = " ";
				tracker = state.createTracker(info);
				tracker.move(results.join(""));
			}
			results.push(tracker.move(state.handle(child, parent, state, {
				...tracker.current(),
				before,
				after
			})));
			before = results[results.length - 1].slice(-1);
		}
		indexStack.pop();
		return results.join("");
	}
	var constructsWithoutStrikethrough = [
		"autolink",
		"destinationLiteral",
		"destinationRaw",
		"reference",
		"titleQuote",
		"titleApostrophe"
	];
	handleDelete.peek = peekDelete;
	var gfmStrikethroughFromMarkdown = {
		canContainEols: ["delete"],
		enter: { strikethrough: enterStrikethrough },
		exit: { strikethrough: exitStrikethrough }
	};
	var gfmStrikethroughToMarkdown = {
		unsafe: [{
			character: "~",
			inConstruct: "phrasing",
			notInConstruct: constructsWithoutStrikethrough
		}],
		handlers: { delete: handleDelete }
	};
	function enterStrikethrough(token) {
		this.enter({
			type: "delete",
			children: []
		}, token);
	}
	function exitStrikethrough(token) {
		this.exit(token);
	}
	function handleDelete(node, _, context, safeOptions) {
		const tracker = track(safeOptions);
		const exit = context.enter("strikethrough");
		let value = tracker.move("~~");
		value += containerPhrasing(node, context, {
			...tracker.current(),
			before: value,
			after: "~"
		});
		value += tracker.move("~~");
		exit();
		return value;
	}
	function peekDelete() {
		return "~";
	}
	inlineCode$1.peek = inlineCodePeek;
	function inlineCode$1(node, _, state) {
		let value = node.value || "";
		let sequence = "`";
		let index = -1;
		while (new RegExp("(^|[^`])" + sequence + "([^`]|$)").test(value)) sequence += "`";
		if (/[^ \r\n]/.test(value) && (/^[ \r\n]/.test(value) && /[ \r\n]$/.test(value) || /^`|`$/.test(value))) value = " " + value + " ";
		while (++index < state.unsafe.length) {
			const pattern = state.unsafe[index];
			const expression = patternCompile(pattern);
			let match;
			if (!pattern.atBreak) continue;
			while (match = expression.exec(value)) {
				let position = match.index;
				if (value.charCodeAt(position) === 10 && value.charCodeAt(position - 1) === 13) position--;
				value = value.slice(0, position) + " " + value.slice(match.index + 1);
			}
		}
		return sequence + value + sequence;
	}
	function inlineCodePeek() {
		return "`";
	}
	function markdownTable(table, options = {}) {
		const align = (options.align || []).concat();
		const stringLength = options.stringLength || defaultStringLength;
		const alignments = [];
		const cellMatrix = [];
		const sizeMatrix = [];
		const longestCellByColumn = [];
		let mostCellsPerRow = 0;
		let rowIndex = -1;
		while (++rowIndex < table.length) {
			const row = [];
			const sizes = [];
			let columnIndex = -1;
			if (table[rowIndex].length > mostCellsPerRow) mostCellsPerRow = table[rowIndex].length;
			while (++columnIndex < table[rowIndex].length) {
				const cell = serialize(table[rowIndex][columnIndex]);
				if (options.alignDelimiters !== false) {
					const size = stringLength(cell);
					sizes[columnIndex] = size;
					if (longestCellByColumn[columnIndex] === void 0 || size > longestCellByColumn[columnIndex]) longestCellByColumn[columnIndex] = size;
				}
				row.push(cell);
			}
			cellMatrix[rowIndex] = row;
			sizeMatrix[rowIndex] = sizes;
		}
		let columnIndex = -1;
		if (typeof align === "object" && "length" in align) while (++columnIndex < mostCellsPerRow) alignments[columnIndex] = toAlignment(align[columnIndex]);
		else {
			const code = toAlignment(align);
			while (++columnIndex < mostCellsPerRow) alignments[columnIndex] = code;
		}
		columnIndex = -1;
		const row = [];
		const sizes = [];
		while (++columnIndex < mostCellsPerRow) {
			const code = alignments[columnIndex];
			let before = "";
			let after = "";
			if (code === 99) {
				before = ":";
				after = ":";
			} else if (code === 108) before = ":";
			else if (code === 114) after = ":";
			let size = options.alignDelimiters === false ? 1 : Math.max(1, longestCellByColumn[columnIndex] - before.length - after.length);
			const cell = before + "-".repeat(size) + after;
			if (options.alignDelimiters !== false) {
				size = before.length + size + after.length;
				if (size > longestCellByColumn[columnIndex]) longestCellByColumn[columnIndex] = size;
				sizes[columnIndex] = size;
			}
			row[columnIndex] = cell;
		}
		cellMatrix.splice(1, 0, row);
		sizeMatrix.splice(1, 0, sizes);
		rowIndex = -1;
		const lines = [];
		while (++rowIndex < cellMatrix.length) {
			const row = cellMatrix[rowIndex];
			const sizes = sizeMatrix[rowIndex];
			columnIndex = -1;
			const line = [];
			while (++columnIndex < mostCellsPerRow) {
				const cell = row[columnIndex] || "";
				let before = "";
				let after = "";
				if (options.alignDelimiters !== false) {
					const size = longestCellByColumn[columnIndex] - (sizes[columnIndex] || 0);
					const code = alignments[columnIndex];
					if (code === 114) before = " ".repeat(size);
					else if (code === 99) {
						if (size % 2) {
							before = " ".repeat(size / 2 + .5);
							after = " ".repeat(size / 2 - .5);
						} else {
							before = " ".repeat(size / 2);
							after = before;
						}
					} else after = " ".repeat(size);
				}
				if (options.delimiterStart !== false && !columnIndex) line.push("|");
				if (options.padding !== false && !(options.alignDelimiters === false && cell === "") && (options.delimiterStart !== false || columnIndex)) line.push(" ");
				if (options.alignDelimiters !== false) line.push(before);
				line.push(cell);
				if (options.alignDelimiters !== false) line.push(after);
				if (options.padding !== false) line.push(" ");
				if (options.delimiterEnd !== false || columnIndex !== mostCellsPerRow - 1) line.push("|");
			}
			lines.push(options.delimiterEnd === false ? line.join("").replace(/ +$/, "") : line.join(""));
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
		const code = typeof value === "string" ? value.codePointAt(0) : 0;
		return code === 67 || code === 99 ? 99 : code === 76 || code === 108 ? 108 : code === 82 || code === 114 ? 114 : 0;
	}
	var gfmTableFromMarkdown = {
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
		this.enter({
			type: "table",
			align: align.map((d) => d === "none" ? null : d),
			children: []
		}, token);
		this.setData("inTable", true);
	}
	function exitTable(token) {
		this.exit(token);
		this.setData("inTable");
	}
	function enterRow(token) {
		this.enter({
			type: "tableRow",
			children: []
		}, token);
	}
	function exit(token) {
		this.exit(token);
	}
	function enterCell(token) {
		this.enter({
			type: "tableCell",
			children: []
		}, token);
	}
	function exitCodeText(token) {
		let value = this.resume();
		if (this.getData("inTable")) value = value.replace(/\\([\\|])/g, replace);
		const node = this.stack[this.stack.length - 1];
		node.value = value;
		this.exit(token);
	}
	function replace($0, $1) {
		return $1 === "|" ? $1 : $0;
	}
	function gfmTableToMarkdown(options) {
		const settings = options || {};
		const padding = settings.tableCellPadding;
		const alignDelimiters = settings.tablePipeAlign;
		const stringLength = settings.stringLength;
		const around = padding ? " " : "|";
		return {
			unsafe: [
				{
					character: "\r",
					inConstruct: "tableCell"
				},
				{
					character: "\n",
					inConstruct: "tableCell"
				},
				{
					atBreak: true,
					character: "|",
					after: "[	 :-]"
				},
				{
					character: "|",
					inConstruct: "tableCell"
				},
				{
					atBreak: true,
					character: ":",
					after: "-"
				},
				{
					atBreak: true,
					character: "-",
					after: "[:|-]"
				}
			],
			handlers: {
				table: handleTable,
				tableRow: handleTableRow,
				tableCell: handleTableCell,
				inlineCode: inlineCodeWithTable
			}
		};
		function handleTable(node, _, context, safeOptions) {
			return serializeData(handleTableAsData(node, context, safeOptions), node.align);
		}
		function handleTableRow(node, _, context, safeOptions) {
			const value = serializeData([handleTableRowAsData(node, context, safeOptions)]);
			return value.slice(0, value.indexOf("\n"));
		}
		function handleTableCell(node, _, context, safeOptions) {
			const exit = context.enter("tableCell");
			const subexit = context.enter("phrasing");
			const value = containerPhrasing(node, context, {
				...safeOptions,
				before: around,
				after: around
			});
			subexit();
			exit();
			return value;
		}
		function serializeData(matrix, align) {
			return markdownTable(matrix, {
				align,
				alignDelimiters,
				padding,
				stringLength
			});
		}
		function handleTableAsData(node, context, safeOptions) {
			const children = node.children;
			let index = -1;
			const result = [];
			const subexit = context.enter("table");
			while (++index < children.length) result[index] = handleTableRowAsData(children[index], context, safeOptions);
			subexit();
			return result;
		}
		function handleTableRowAsData(node, context, safeOptions) {
			const children = node.children;
			let index = -1;
			const result = [];
			const subexit = context.enter("tableRow");
			while (++index < children.length) result[index] = handleTableCell(children[index], node, context, safeOptions);
			subexit();
			return result;
		}
		function inlineCodeWithTable(node, parent, context) {
			let value = inlineCode$1(node, parent, context);
			if (context.stack.includes("tableCell")) value = value.replace(/\|/g, "\\$&");
			return value;
		}
	}
	function checkBullet(state) {
		const marker = state.options.bullet || "*";
		if (marker !== "*" && marker !== "+" && marker !== "-") throw new Error("Cannot serialize items with `" + marker + "` for `options.bullet`, expected `*`, `+`, or `-`");
		return marker;
	}
	function checkListItemIndent(state) {
		const style = state.options.listItemIndent || "tab";
		if (style === 1 || style === "1") return "one";
		if (style !== "tab" && style !== "one" && style !== "mixed") throw new Error("Cannot serialize items with `" + style + "` for `options.listItemIndent`, expected `tab`, `one`, or `mixed`");
		return style;
	}
	function listItem$1(node, parent, state, info) {
		const listItemIndent = checkListItemIndent(state);
		let bullet = state.bulletCurrent || checkBullet(state);
		if (parent && parent.type === "list" && parent.ordered) bullet = (typeof parent.start === "number" && parent.start > -1 ? parent.start : 1) + (state.options.incrementListMarker === false ? 0 : parent.children.indexOf(node)) + bullet;
		let size = bullet.length + 1;
		if (listItemIndent === "tab" || listItemIndent === "mixed" && (parent && parent.type === "list" && parent.spread || node.spread)) size = Math.ceil(size / 4) * 4;
		const tracker = state.createTracker(info);
		tracker.move(bullet + " ".repeat(size - bullet.length));
		tracker.shift(size);
		const exit = state.enter("listItem");
		const value = state.indentLines(state.containerFlow(node, tracker.current()), map);
		exit();
		return value;
		function map(line, index, blank) {
			if (index) return (blank ? "" : " ".repeat(size)) + line;
			return (blank ? bullet : bullet + " ".repeat(size - bullet.length)) + line;
		}
	}
	var gfmTaskListItemFromMarkdown = { exit: {
		taskListCheckValueChecked: exitCheck,
		taskListCheckValueUnchecked: exitCheck,
		paragraph: exitParagraphWithTaskListItem
	} };
	var gfmTaskListItemToMarkdown = {
		unsafe: [{
			atBreak: true,
			character: "-",
			after: "[:|-]"
		}],
		handlers: { listItem: listItemWithTaskListItem }
	};
	function exitCheck(token) {
		const node = this.stack[this.stack.length - 2];
		node.checked = token.type === "taskListCheckValueChecked";
	}
	function exitParagraphWithTaskListItem(token) {
		const parent = this.stack[this.stack.length - 2];
		if (parent && parent.type === "listItem" && typeof parent.checked === "boolean") {
			const node = this.stack[this.stack.length - 1];
			const head = node.children[0];
			if (head && head.type === "text") {
				const siblings = parent.children;
				let index = -1;
				let firstParaghraph;
				while (++index < siblings.length) {
					const sibling = siblings[index];
					if (sibling.type === "paragraph") {
						firstParaghraph = sibling;
						break;
					}
				}
				if (firstParaghraph === node) {
					head.value = head.value.slice(1);
					if (head.value.length === 0) node.children.shift();
					else if (node.position && head.position && typeof head.position.start.offset === "number") {
						head.position.start.column++;
						head.position.start.offset++;
						node.position.start = Object.assign({}, head.position.start);
					}
				}
			}
		}
		this.exit(token);
	}
	function listItemWithTaskListItem(node, parent, context, safeOptions) {
		const head = node.children[0];
		const checkable = typeof node.checked === "boolean" && head && head.type === "paragraph";
		const checkbox = "[" + (node.checked ? "x" : " ") + "] ";
		const tracker = track(safeOptions);
		if (checkable) tracker.move(checkbox);
		let value = listItem$1(node, parent, context, {
			...safeOptions,
			...tracker.current()
		});
		if (checkable) value = value.replace(/^(?:[*+-]|\d+\.)([\r\n]| {1,3})/, check);
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
		return { extensions: [
			gfmAutolinkLiteralToMarkdown,
			gfmFootnoteToMarkdown(),
			gfmStrikethroughToMarkdown,
			gfmTableToMarkdown(options),
			gfmTaskListItemToMarkdown
		] };
	}
	function blockquote$1(state, node) {
		const result = {
			type: "element",
			tagName: "blockquote",
			properties: {},
			children: state.wrap(state.all(node), true)
		};
		state.patch(node, result);
		return state.applyData(node, result);
	}
	function hardBreak$1(state, node) {
		const result = {
			type: "element",
			tagName: "br",
			properties: {},
			children: []
		};
		state.patch(node, result);
		return [state.applyData(node, result), {
			type: "text",
			value: "\n"
		}];
	}
	function code$2(state, node) {
		const value = node.value ? node.value + "\n" : "";
		const lang = node.lang ? node.lang.match(/^[^ \t]+(?=[ \t]|$)/) : null;
		const properties = {};
		if (lang) properties.className = ["language-" + lang];
		let result = {
			type: "element",
			tagName: "code",
			properties,
			children: [{
				type: "text",
				value
			}]
		};
		if (node.meta) result.data = { meta: node.meta };
		state.patch(node, result);
		result = state.applyData(node, result);
		result = {
			type: "element",
			tagName: "pre",
			properties: {},
			children: [result]
		};
		state.patch(node, result);
		return result;
	}
	function strikethrough(state, node) {
		const result = {
			type: "element",
			tagName: "del",
			properties: {},
			children: state.all(node)
		};
		state.patch(node, result);
		return state.applyData(node, result);
	}
	function emphasis$1(state, node) {
		const result = {
			type: "element",
			tagName: "em",
			properties: {},
			children: state.all(node)
		};
		state.patch(node, result);
		return state.applyData(node, result);
	}
	function normalizeUri(value) {
		const result = [];
		let index = -1;
		let start = 0;
		let skip = 0;
		while (++index < value.length) {
			const code = value.charCodeAt(index);
			let replace = "";
			if (code === 37 && asciiAlphanumeric(value.charCodeAt(index + 1)) && asciiAlphanumeric(value.charCodeAt(index + 2))) skip = 2;
			else if (code < 128) {
				if (!/[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(code))) replace = String.fromCharCode(code);
			} else if (code > 55295 && code < 57344) {
				const next = value.charCodeAt(index + 1);
				if (code < 56320 && next > 56319 && next < 57344) {
					replace = String.fromCharCode(code, next);
					skip = 1;
				} else replace = "�";
			} else replace = String.fromCharCode(code);
			if (replace) {
				result.push(value.slice(start, index), encodeURIComponent(replace));
				start = index + skip + 1;
				replace = "";
			}
			if (skip) {
				index += skip;
				skip = 0;
			}
		}
		return result.join("") + value.slice(start);
	}
	function footnoteReference(state, node) {
		const id = String(node.identifier).toUpperCase();
		const safeId = normalizeUri(id.toLowerCase());
		const index = state.footnoteOrder.indexOf(id);
		let counter;
		if (index === -1) {
			state.footnoteOrder.push(id);
			state.footnoteCounts[id] = 1;
			counter = state.footnoteOrder.length;
		} else {
			state.footnoteCounts[id]++;
			counter = index + 1;
		}
		const reuseCounter = state.footnoteCounts[id];
		const link = {
			type: "element",
			tagName: "a",
			properties: {
				href: "#" + state.clobberPrefix + "fn-" + safeId,
				id: state.clobberPrefix + "fnref-" + safeId + (reuseCounter > 1 ? "-" + reuseCounter : ""),
				dataFootnoteRef: true,
				ariaDescribedBy: ["footnote-label"]
			},
			children: [{
				type: "text",
				value: String(counter)
			}]
		};
		state.patch(node, link);
		const sup = {
			type: "element",
			tagName: "sup",
			properties: {},
			children: [link]
		};
		state.patch(node, sup);
		return state.applyData(node, sup);
	}
	function footnote(state, node) {
		const footnoteById = state.footnoteById;
		let no = 1;
		while (no in footnoteById) no++;
		const identifier = String(no);
		footnoteById[identifier] = {
			type: "footnoteDefinition",
			identifier,
			children: [{
				type: "paragraph",
				children: node.children
			}],
			position: node.position
		};
		return footnoteReference(state, {
			type: "footnoteReference",
			identifier,
			position: node.position
		});
	}
	function heading$1(state, node) {
		const result = {
			type: "element",
			tagName: "h" + node.depth,
			properties: {},
			children: state.all(node)
		};
		state.patch(node, result);
		return state.applyData(node, result);
	}
	function html$1(state, node) {
		if (state.dangerous) {
			const result = {
				type: "raw",
				value: node.value
			};
			state.patch(node, result);
			return state.applyData(node, result);
		}
		return null;
	}
	function revert(state, node) {
		const subtype = node.referenceType;
		let suffix = "]";
		if (subtype === "collapsed") suffix += "[]";
		else if (subtype === "full") suffix += "[" + (node.label || node.identifier) + "]";
		if (node.type === "imageReference") return {
			type: "text",
			value: "![" + node.alt + suffix
		};
		const contents = state.all(node);
		const head = contents[0];
		if (head && head.type === "text") head.value = "[" + head.value;
		else contents.unshift({
			type: "text",
			value: "["
		});
		const tail = contents[contents.length - 1];
		if (tail && tail.type === "text") tail.value += suffix;
		else contents.push({
			type: "text",
			value: suffix
		});
		return contents;
	}
	function imageReference$1(state, node) {
		const def = state.definition(node.identifier);
		if (!def) return revert(state, node);
		const properties = {
			src: normalizeUri(def.url || ""),
			alt: node.alt
		};
		if (def.title !== null && def.title !== void 0) properties.title = def.title;
		const result = {
			type: "element",
			tagName: "img",
			properties,
			children: []
		};
		state.patch(node, result);
		return state.applyData(node, result);
	}
	function image$1(state, node) {
		const properties = { src: normalizeUri(node.url) };
		if (node.alt !== null && node.alt !== void 0) properties.alt = node.alt;
		if (node.title !== null && node.title !== void 0) properties.title = node.title;
		const result = {
			type: "element",
			tagName: "img",
			properties,
			children: []
		};
		state.patch(node, result);
		return state.applyData(node, result);
	}
	function inlineCode(state, node) {
		const text = {
			type: "text",
			value: node.value.replace(/\r?\n|\r/g, " ")
		};
		state.patch(node, text);
		const result = {
			type: "element",
			tagName: "code",
			properties: {},
			children: [text]
		};
		state.patch(node, result);
		return state.applyData(node, result);
	}
	function linkReference$1(state, node) {
		const def = state.definition(node.identifier);
		if (!def) return revert(state, node);
		const properties = { href: normalizeUri(def.url || "") };
		if (def.title !== null && def.title !== void 0) properties.title = def.title;
		const result = {
			type: "element",
			tagName: "a",
			properties,
			children: state.all(node)
		};
		state.patch(node, result);
		return state.applyData(node, result);
	}
	function link$1(state, node) {
		const properties = { href: normalizeUri(node.url) };
		if (node.title !== null && node.title !== void 0) properties.title = node.title;
		const result = {
			type: "element",
			tagName: "a",
			properties,
			children: state.all(node)
		};
		state.patch(node, result);
		return state.applyData(node, result);
	}
	function listItem(state, node, parent) {
		const results = state.all(node);
		const loose = parent ? listLoose(parent) : listItemLoose(node);
		const properties = {};
		const children = [];
		if (typeof node.checked === "boolean") {
			const head = results[0];
			let paragraph;
			if (head && head.type === "element" && head.tagName === "p") paragraph = head;
			else {
				paragraph = {
					type: "element",
					tagName: "p",
					properties: {},
					children: []
				};
				results.unshift(paragraph);
			}
			if (paragraph.children.length > 0) paragraph.children.unshift({
				type: "text",
				value: " "
			});
			paragraph.children.unshift({
				type: "element",
				tagName: "input",
				properties: {
					type: "checkbox",
					checked: node.checked,
					disabled: true
				},
				children: []
			});
			properties.className = ["task-list-item"];
		}
		let index = -1;
		while (++index < results.length) {
			const child = results[index];
			if (loose || index !== 0 || child.type !== "element" || child.tagName !== "p") children.push({
				type: "text",
				value: "\n"
			});
			if (child.type === "element" && child.tagName === "p" && !loose) children.push(...child.children);
			else children.push(child);
		}
		const tail = results[results.length - 1];
		if (tail && (loose || tail.type !== "element" || tail.tagName !== "p")) children.push({
			type: "text",
			value: "\n"
		});
		const result = {
			type: "element",
			tagName: "li",
			properties,
			children
		};
		state.patch(node, result);
		return state.applyData(node, result);
	}
	function listLoose(node) {
		let loose = false;
		if (node.type === "list") {
			loose = node.spread || false;
			const children = node.children;
			let index = -1;
			while (!loose && ++index < children.length) loose = listItemLoose(children[index]);
		}
		return loose;
	}
	function listItemLoose(node) {
		const spread = node.spread;
		return spread === void 0 || spread === null ? node.children.length > 1 : spread;
	}
	function list$1(state, node) {
		const properties = {};
		const results = state.all(node);
		let index = -1;
		if (typeof node.start === "number" && node.start !== 1) properties.start = node.start;
		while (++index < results.length) {
			const child = results[index];
			if (child.type === "element" && child.tagName === "li" && child.properties && Array.isArray(child.properties.className) && child.properties.className.includes("task-list-item")) {
				properties.className = ["contains-task-list"];
				break;
			}
		}
		const result = {
			type: "element",
			tagName: node.ordered ? "ol" : "ul",
			properties,
			children: state.wrap(results, true)
		};
		state.patch(node, result);
		return state.applyData(node, result);
	}
	function paragraph$1(state, node) {
		const result = {
			type: "element",
			tagName: "p",
			properties: {},
			children: state.all(node)
		};
		state.patch(node, result);
		return state.applyData(node, result);
	}
	function root$1(state, node) {
		const result = {
			type: "root",
			children: state.wrap(state.all(node))
		};
		state.patch(node, result);
		return state.applyData(node, result);
	}
	function strong$1(state, node) {
		const result = {
			type: "element",
			tagName: "strong",
			properties: {},
			children: state.all(node)
		};
		state.patch(node, result);
		return state.applyData(node, result);
	}
	var pointStart = point("start");
	var pointEnd = point("end");
	function position(node) {
		return {
			start: pointStart(node),
			end: pointEnd(node)
		};
	}
	function point(type) {
		return point;
		function point(node) {
			const point = node && node.position && node.position[type] || {};
			return {
				line: point.line || null,
				column: point.column || null,
				offset: point.offset > -1 ? point.offset : null
			};
		}
	}
	function table(state, node) {
		const rows = state.all(node);
		const firstRow = rows.shift();
		const tableContent = [];
		if (firstRow) {
			const head = {
				type: "element",
				tagName: "thead",
				properties: {},
				children: state.wrap([firstRow], true)
			};
			state.patch(node.children[0], head);
			tableContent.push(head);
		}
		if (rows.length > 0) {
			const body = {
				type: "element",
				tagName: "tbody",
				properties: {},
				children: state.wrap(rows, true)
			};
			const start = pointStart(node.children[1]);
			const end = pointEnd(node.children[node.children.length - 1]);
			if (start.line && end.line) body.position = {
				start,
				end
			};
			tableContent.push(body);
		}
		const result = {
			type: "element",
			tagName: "table",
			properties: {},
			children: state.wrap(tableContent, true)
		};
		state.patch(node, result);
		return state.applyData(node, result);
	}
	function tableRow(state, node, parent) {
		const siblings = parent ? parent.children : void 0;
		const tagName = (siblings ? siblings.indexOf(node) : 1) === 0 ? "th" : "td";
		const align = parent && parent.type === "table" ? parent.align : void 0;
		const length = align ? align.length : node.children.length;
		let cellIndex = -1;
		const cells = [];
		while (++cellIndex < length) {
			const cell = node.children[cellIndex];
			const properties = {};
			const alignValue = align ? align[cellIndex] : void 0;
			if (alignValue) properties.align = alignValue;
			let result = {
				type: "element",
				tagName,
				properties,
				children: []
			};
			if (cell) {
				result.children = state.all(cell);
				state.patch(cell, result);
				result = state.applyData(node, result);
			}
			cells.push(result);
		}
		const result = {
			type: "element",
			tagName: "tr",
			properties: {},
			children: state.wrap(cells, true)
		};
		state.patch(node, result);
		return state.applyData(node, result);
	}
	function tableCell(state, node) {
		const result = {
			type: "element",
			tagName: "td",
			properties: {},
			children: state.all(node)
		};
		state.patch(node, result);
		return state.applyData(node, result);
	}
	var tab = 9;
	var space = 32;
	function trimLines(value) {
		const source = String(value);
		const search = /\r?\n|\r/g;
		let match = search.exec(source);
		let last = 0;
		const lines = [];
		while (match) {
			lines.push(trimLine(source.slice(last, match.index), last > 0, true), match[0]);
			last = match.index + match[0].length;
			match = search.exec(source);
		}
		lines.push(trimLine(source.slice(last), last > 0, false));
		return lines.join("");
	}
	function trimLine(value, start, end) {
		let startIndex = 0;
		let endIndex = value.length;
		if (start) {
			let code = value.codePointAt(startIndex);
			while (code === tab || code === space) {
				startIndex++;
				code = value.codePointAt(startIndex);
			}
		}
		if (end) {
			let code = value.codePointAt(endIndex - 1);
			while (code === tab || code === space) {
				endIndex--;
				code = value.codePointAt(endIndex - 1);
			}
		}
		return endIndex > startIndex ? value.slice(startIndex, endIndex) : "";
	}
	function text$2(state, node) {
		const result = {
			type: "text",
			value: trimLines(String(node.value))
		};
		state.patch(node, result);
		return state.applyData(node, result);
	}
	function thematicBreak$1(state, node) {
		const result = {
			type: "element",
			tagName: "hr",
			properties: {},
			children: []
		};
		state.patch(node, result);
		return state.applyData(node, result);
	}
	var handlers = {
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
	var visit = (function(tree, test, visitor, reverse) {
		if (typeof test === "function" && typeof visitor !== "function") {
			reverse = visitor;
			visitor = test;
			test = null;
		}
		visitParents(tree, test, overload, reverse);
		function overload(node, parents) {
			const parent = parents[parents.length - 1];
			return visitor(node, parent ? parent.children.indexOf(node) : null, parent);
		}
	});
	function generated(node) {
		return !node || !node.position || !node.position.start || !node.position.start.line || !node.position.start.column || !node.position.end || !node.position.end.line || !node.position.end.column;
	}
	var own$1 = {}.hasOwnProperty;
	function definitions(tree) {
		const cache = Object.create(null);
		if (!tree || !tree.type) throw new Error("mdast-util-definitions expected node");
		visit(tree, "definition", (definition) => {
			const id = clean(definition.identifier);
			if (id && !own$1.call(cache, id)) cache[id] = definition;
		});
		return definition;
		function definition(identifier) {
			const id = clean(identifier);
			return id && own$1.call(cache, id) ? cache[id] : null;
		}
	}
	function clean(value) {
		return String(value || "").toUpperCase();
	}
	var own = {}.hasOwnProperty;
	function createState(tree, options) {
		const settings = options || {};
		const dangerous = settings.allowDangerousHtml || false;
		const footnoteById = {};
		state.dangerous = dangerous;
		state.clobberPrefix = settings.clobberPrefix === void 0 || settings.clobberPrefix === null ? "user-content-" : settings.clobberPrefix;
		state.footnoteLabel = settings.footnoteLabel || "Footnotes";
		state.footnoteLabelTagName = settings.footnoteLabelTagName || "h2";
		state.footnoteLabelProperties = settings.footnoteLabelProperties || { className: ["sr-only"] };
		state.footnoteBackLabel = settings.footnoteBackLabel || "Back to content";
		state.unknownHandler = settings.unknownHandler;
		state.passThrough = settings.passThrough;
		state.handlers = {
			...handlers,
			...settings.handlers
		};
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
		visit(tree, "footnoteDefinition", (definition) => {
			const id = String(definition.identifier).toUpperCase();
			if (!own.call(footnoteById, id)) footnoteById[id] = definition;
		});
		return state;
		function augment(left, right) {
			if (left && "data" in left && left.data) {
				const data = left.data;
				if (data.hName) {
					if (right.type !== "element") right = {
						type: "element",
						tagName: "",
						properties: {},
						children: []
					};
					right.tagName = data.hName;
				}
				if (right.type === "element" && data.hProperties) right.properties = {
					...right.properties,
					...data.hProperties
				};
				if ("children" in right && right.children && data.hChildren) right.children = data.hChildren;
			}
			if (left) {
				const ctx = "type" in left ? left : { position: left };
				if (!generated(ctx)) right.position = {
					start: pointStart(ctx),
					end: pointEnd(ctx)
				};
			}
			return right;
		}
		function state(node, tagName, props, children) {
			if (Array.isArray(props)) {
				children = props;
				props = {};
			}
			return augment(node, {
				type: "element",
				tagName,
				properties: props || {},
				children: children || []
			});
		}
		function oneBound(node, parent) {
			return one(state, node, parent);
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
				if (result.type === "element") result.tagName = hName;
				else result = {
					type: "element",
					tagName: hName,
					properties: {},
					children: []
				};
			}
			if (result.type === "element" && hProperties) result.properties = {
				...result.properties,
				...hProperties
			};
			if ("children" in result && result.children && hChildren !== null && hChildren !== void 0) result.children = hChildren;
		}
		return result;
	}
	function one(state, node, parent) {
		const type = node && node.type;
		if (!type) throw new Error("Expected node, got `" + node + "`");
		if (own.call(state.handlers, type)) return state.handlers[type](state, node, parent);
		if (state.passThrough && state.passThrough.includes(type)) return "children" in node ? {
			...node,
			children: all(state, node)
		} : node;
		if (state.unknownHandler) return state.unknownHandler(state, node, parent);
		return defaultUnknownHandler(state, node);
	}
	function all(state, parent) {
		const values = [];
		if ("children" in parent) {
			const nodes = parent.children;
			let index = -1;
			while (++index < nodes.length) {
				const result = one(state, nodes[index], parent);
				if (result) {
					if (index && nodes[index - 1].type === "break") {
						if (!Array.isArray(result) && result.type === "text") result.value = result.value.replace(/^\s+/, "");
						if (!Array.isArray(result) && result.type === "element") {
							const head = result.children[0];
							if (head && head.type === "text") head.value = head.value.replace(/^\s+/, "");
						}
					}
					if (Array.isArray(result)) values.push(...result);
					else values.push(result);
				}
			}
		}
		return values;
	}
	function defaultUnknownHandler(state, node) {
		const data = node.data || {};
		const result = "value" in node && !(own.call(data, "hProperties") || own.call(data, "hChildren")) ? {
			type: "text",
			value: node.value
		} : {
			type: "element",
			tagName: "div",
			properties: {},
			children: all(state, node)
		};
		state.patch(node, result);
		return state.applyData(node, result);
	}
	function wrap(nodes, loose) {
		const result = [];
		let index = -1;
		if (loose) result.push({
			type: "text",
			value: "\n"
		});
		while (++index < nodes.length) {
			if (index) result.push({
				type: "text",
				value: "\n"
			});
			result.push(nodes[index]);
		}
		if (loose && nodes.length > 0) result.push({
			type: "text",
			value: "\n"
		});
		return result;
	}
	function footer(state) {
		const listItems = [];
		let index = -1;
		while (++index < state.footnoteOrder.length) {
			const def = state.footnoteById[state.footnoteOrder[index]];
			if (!def) continue;
			const content = state.all(def);
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
					children: [{
						type: "text",
						value: "↩"
					}]
				};
				if (referenceIndex > 1) backReference.children.push({
					type: "element",
					tagName: "sup",
					children: [{
						type: "text",
						value: String(referenceIndex)
					}]
				});
				if (backReferences.length > 0) backReferences.push({
					type: "text",
					value: " "
				});
				backReferences.push(backReference);
			}
			const tail = content[content.length - 1];
			if (tail && tail.type === "element" && tail.tagName === "p") {
				const tailTail = tail.children[tail.children.length - 1];
				if (tailTail && tailTail.type === "text") tailTail.value += " ";
				else tail.children.push({
					type: "text",
					value: " "
				});
				tail.children.push(...backReferences);
			} else content.push(...backReferences);
			const listItem = {
				type: "element",
				tagName: "li",
				properties: { id: state.clobberPrefix + "fn-" + safeId },
				children: state.wrap(content, true)
			};
			state.patch(def, listItem);
			listItems.push(listItem);
		}
		if (listItems.length === 0) return;
		return {
			type: "element",
			tagName: "section",
			properties: {
				dataFootnotes: true,
				className: ["footnotes"]
			},
			children: [
				{
					type: "element",
					tagName: state.footnoteLabelTagName,
					properties: {
						...JSON.parse(JSON.stringify(state.footnoteLabelProperties)),
						id: "footnote-label"
					},
					children: [{
						type: "text",
						value: state.footnoteLabel
					}]
				},
				{
					type: "text",
					value: "\n"
				},
				{
					type: "element",
					tagName: "ol",
					properties: {},
					children: state.wrap(listItems, true)
				},
				{
					type: "text",
					value: "\n"
				}
			]
		};
	}
	function toHast(tree, options) {
		const state = createState(tree, options);
		const node = state.one(tree, null);
		const foot = footer(state);
		if (foot) node.children.push({
			type: "text",
			value: "\n"
		}, foot);
		return Array.isArray(node) ? {
			type: "root",
			children: node
		} : node;
	}
	function configure(base, extension) {
		let index = -1;
		let key;
		if (extension.extensions) while (++index < extension.extensions.length) configure(base, extension.extensions[index]);
		for (key in extension) if (key === "extensions") {} else if (key === "unsafe" || key === "join") base[key] = [...base[key] || [], ...extension[key] || []];
		else if (key === "handlers") base[key] = Object.assign(base[key], extension[key] || {});
		else base.options[key] = extension[key];
		return base;
	}
	function blockquote(node, _, state, info) {
		const exit = state.enter("blockquote");
		const tracker = state.createTracker(info);
		tracker.move("> ");
		tracker.shift(2);
		const value = state.indentLines(state.containerFlow(node, tracker.current()), map$1);
		exit();
		return value;
	}
	function map$1(line, _, blank) {
		return ">" + (blank ? "" : " ") + line;
	}
	function hardBreak(_, _1, state, info) {
		let index = -1;
		while (++index < state.unsafe.length) if (state.unsafe[index].character === "\n" && patternInScope(state.stack, state.unsafe[index])) return /[ \t]/.test(info.before) ? "" : " ";
		return "\\\n";
	}
	function longestStreak(value, substring) {
		const source = String(value);
		let index = source.indexOf(substring);
		let expected = index;
		let count = 0;
		let max = 0;
		if (typeof substring !== "string") throw new TypeError("Expected substring");
		while (index !== -1) {
			if (index === expected) {
				if (++count > max) max = count;
			} else count = 1;
			expected = index + substring.length;
			index = source.indexOf(substring, expected);
		}
		return max;
	}
	function formatCodeAsIndented(node, state) {
		return Boolean(!state.options.fences && node.value && !node.lang && /[^ \r\n]/.test(node.value) && !/^[\t ]*(?:[\r\n]|$)|(?:^|[\r\n])[\t ]*$/.test(node.value));
	}
	function checkFence(state) {
		const marker = state.options.fence || "`";
		if (marker !== "`" && marker !== "~") throw new Error("Cannot serialize code with `" + marker + "` for `options.fence`, expected `` ` `` or `~`");
		return marker;
	}
	function code$1(node, _, state, info) {
		const marker = checkFence(state);
		const raw = node.value || "";
		const suffix = marker === "`" ? "GraveAccent" : "Tilde";
		if (formatCodeAsIndented(node, state)) {
			const exit = state.enter("codeIndented");
			const value = state.indentLines(raw, map);
			exit();
			return value;
		}
		const tracker = state.createTracker(info);
		const sequence = marker.repeat(Math.max(longestStreak(raw, marker) + 1, 3));
		const exit = state.enter("codeFenced");
		let value = tracker.move(sequence);
		if (node.lang) {
			const subexit = state.enter(`codeFencedLang${suffix}`);
			value += tracker.move(state.safe(node.lang, {
				before: value,
				after: " ",
				encode: ["`"],
				...tracker.current()
			}));
			subexit();
		}
		if (node.lang && node.meta) {
			const subexit = state.enter(`codeFencedMeta${suffix}`);
			value += tracker.move(" ");
			value += tracker.move(state.safe(node.meta, {
				before: value,
				after: "\n",
				encode: ["`"],
				...tracker.current()
			}));
			subexit();
		}
		value += tracker.move("\n");
		if (raw) value += tracker.move(raw + "\n");
		value += tracker.move(sequence);
		exit();
		return value;
	}
	function map(line, _, blank) {
		return (blank ? "" : "    ") + line;
	}
	function checkQuote(state) {
		const marker = state.options.quote || "\"";
		if (marker !== "\"" && marker !== "'") throw new Error("Cannot serialize title with `" + marker + "` for `options.quote`, expected `\"`, or `'`");
		return marker;
	}
	function definition(node, _, state, info) {
		const quote = checkQuote(state);
		const suffix = quote === "\"" ? "Quote" : "Apostrophe";
		const exit = state.enter("definition");
		let subexit = state.enter("label");
		const tracker = state.createTracker(info);
		let value = tracker.move("[");
		value += tracker.move(state.safe(state.associationId(node), {
			before: value,
			after: "]",
			...tracker.current()
		}));
		value += tracker.move("]: ");
		subexit();
		if (!node.url || /[\0- \u007F]/.test(node.url)) {
			subexit = state.enter("destinationLiteral");
			value += tracker.move("<");
			value += tracker.move(state.safe(node.url, {
				before: value,
				after: ">",
				...tracker.current()
			}));
			value += tracker.move(">");
		} else {
			subexit = state.enter("destinationRaw");
			value += tracker.move(state.safe(node.url, {
				before: value,
				after: node.title ? " " : "\n",
				...tracker.current()
			}));
		}
		subexit();
		if (node.title) {
			subexit = state.enter(`title${suffix}`);
			value += tracker.move(" " + quote);
			value += tracker.move(state.safe(node.title, {
				before: value,
				after: quote,
				...tracker.current()
			}));
			value += tracker.move(quote);
			subexit();
		}
		exit();
		return value;
	}
	function checkEmphasis(state) {
		const marker = state.options.emphasis || "*";
		if (marker !== "*" && marker !== "_") throw new Error("Cannot serialize emphasis with `" + marker + "` for `options.emphasis`, expected `*`, or `_`");
		return marker;
	}
	emphasis.peek = emphasisPeek;
	function emphasis(node, _, state, info) {
		const marker = checkEmphasis(state);
		const exit = state.enter("emphasis");
		const tracker = state.createTracker(info);
		let value = tracker.move(marker);
		value += tracker.move(state.containerPhrasing(node, {
			before: value,
			after: marker,
			...tracker.current()
		}));
		value += tracker.move(marker);
		exit();
		return value;
	}
	function emphasisPeek(_, _1, state) {
		return state.options.emphasis || "*";
	}
	function formatHeadingAsSetext(node, state) {
		let literalWithBreak = false;
		visit(node, (node) => {
			if ("value" in node && /\r?\n|\r/.test(node.value) || node.type === "break") {
				literalWithBreak = true;
				return false;
			}
		});
		return Boolean((!node.depth || node.depth < 3) && toString(node) && (state.options.setext || literalWithBreak));
	}
	function heading(node, _, state, info) {
		const rank = Math.max(Math.min(6, node.depth || 1), 1);
		const tracker = state.createTracker(info);
		if (formatHeadingAsSetext(node, state)) {
			const exit = state.enter("headingSetext");
			const subexit = state.enter("phrasing");
			const value = state.containerPhrasing(node, {
				...tracker.current(),
				before: "\n",
				after: "\n"
			});
			subexit();
			exit();
			return value + "\n" + (rank === 1 ? "=" : "-").repeat(value.length - (Math.max(value.lastIndexOf("\r"), value.lastIndexOf("\n")) + 1));
		}
		const sequence = "#".repeat(rank);
		const exit = state.enter("headingAtx");
		const subexit = state.enter("phrasing");
		tracker.move(sequence + " ");
		let value = state.containerPhrasing(node, {
			before: "# ",
			after: "\n",
			...tracker.current()
		});
		if (/^[\t ]/.test(value)) value = "&#x" + value.charCodeAt(0).toString(16).toUpperCase() + ";" + value.slice(1);
		value = value ? sequence + " " + value : sequence;
		if (state.options.closeAtx) value += " " + sequence;
		subexit();
		exit();
		return value;
	}
	html.peek = htmlPeek;
	function html(node) {
		return node.value || "";
	}
	function htmlPeek() {
		return "<";
	}
	image.peek = imagePeek;
	function image(node, _, state, info) {
		const quote = checkQuote(state);
		const suffix = quote === "\"" ? "Quote" : "Apostrophe";
		const exit = state.enter("image");
		let subexit = state.enter("label");
		const tracker = state.createTracker(info);
		let value = tracker.move("![");
		value += tracker.move(state.safe(node.alt, {
			before: value,
			after: "]",
			...tracker.current()
		}));
		value += tracker.move("](");
		subexit();
		if (!node.url && node.title || /[\0- \u007F]/.test(node.url)) {
			subexit = state.enter("destinationLiteral");
			value += tracker.move("<");
			value += tracker.move(state.safe(node.url, {
				before: value,
				after: ">",
				...tracker.current()
			}));
			value += tracker.move(">");
		} else {
			subexit = state.enter("destinationRaw");
			value += tracker.move(state.safe(node.url, {
				before: value,
				after: node.title ? " " : ")",
				...tracker.current()
			}));
		}
		subexit();
		if (node.title) {
			subexit = state.enter(`title${suffix}`);
			value += tracker.move(" " + quote);
			value += tracker.move(state.safe(node.title, {
				before: value,
				after: quote,
				...tracker.current()
			}));
			value += tracker.move(quote);
			subexit();
		}
		value += tracker.move(")");
		exit();
		return value;
	}
	function imagePeek() {
		return "!";
	}
	imageReference.peek = imageReferencePeek;
	function imageReference(node, _, state, info) {
		const type = node.referenceType;
		const exit = state.enter("imageReference");
		let subexit = state.enter("label");
		const tracker = state.createTracker(info);
		let value = tracker.move("![");
		const alt = state.safe(node.alt, {
			before: value,
			after: "]",
			...tracker.current()
		});
		value += tracker.move(alt + "][");
		subexit();
		const stack = state.stack;
		state.stack = [];
		subexit = state.enter("reference");
		const reference = state.safe(state.associationId(node), {
			before: value,
			after: "]",
			...tracker.current()
		});
		subexit();
		state.stack = stack;
		exit();
		if (type === "full" || !alt || alt !== reference) value += tracker.move(reference + "]");
		else if (type === "shortcut") value = value.slice(0, -1);
		else value += tracker.move("]");
		return value;
	}
	function imageReferencePeek() {
		return "!";
	}
	function formatLinkAsAutolink(node, state) {
		const raw = toString(node);
		return Boolean(!state.options.resourceLink && node.url && !node.title && node.children && node.children.length === 1 && node.children[0].type === "text" && (raw === node.url || "mailto:" + raw === node.url) && /^[a-z][a-z+.-]+:/i.test(node.url) && !/[\0- <>\u007F]/.test(node.url));
	}
	link.peek = linkPeek;
	function link(node, _, state, info) {
		const quote = checkQuote(state);
		const suffix = quote === "\"" ? "Quote" : "Apostrophe";
		const tracker = state.createTracker(info);
		let exit;
		let subexit;
		if (formatLinkAsAutolink(node, state)) {
			const stack = state.stack;
			state.stack = [];
			exit = state.enter("autolink");
			let value = tracker.move("<");
			value += tracker.move(state.containerPhrasing(node, {
				before: value,
				after: ">",
				...tracker.current()
			}));
			value += tracker.move(">");
			exit();
			state.stack = stack;
			return value;
		}
		exit = state.enter("link");
		subexit = state.enter("label");
		let value = tracker.move("[");
		value += tracker.move(state.containerPhrasing(node, {
			before: value,
			after: "](",
			...tracker.current()
		}));
		value += tracker.move("](");
		subexit();
		if (!node.url && node.title || /[\0- \u007F]/.test(node.url)) {
			subexit = state.enter("destinationLiteral");
			value += tracker.move("<");
			value += tracker.move(state.safe(node.url, {
				before: value,
				after: ">",
				...tracker.current()
			}));
			value += tracker.move(">");
		} else {
			subexit = state.enter("destinationRaw");
			value += tracker.move(state.safe(node.url, {
				before: value,
				after: node.title ? " " : ")",
				...tracker.current()
			}));
		}
		subexit();
		if (node.title) {
			subexit = state.enter(`title${suffix}`);
			value += tracker.move(" " + quote);
			value += tracker.move(state.safe(node.title, {
				before: value,
				after: quote,
				...tracker.current()
			}));
			value += tracker.move(quote);
			subexit();
		}
		value += tracker.move(")");
		exit();
		return value;
	}
	function linkPeek(node, _, state) {
		return formatLinkAsAutolink(node, state) ? "<" : "[";
	}
	linkReference.peek = linkReferencePeek;
	function linkReference(node, _, state, info) {
		const type = node.referenceType;
		const exit = state.enter("linkReference");
		let subexit = state.enter("label");
		const tracker = state.createTracker(info);
		let value = tracker.move("[");
		const text = state.containerPhrasing(node, {
			before: value,
			after: "]",
			...tracker.current()
		});
		value += tracker.move(text + "][");
		subexit();
		const stack = state.stack;
		state.stack = [];
		subexit = state.enter("reference");
		const reference = state.safe(state.associationId(node), {
			before: value,
			after: "]",
			...tracker.current()
		});
		subexit();
		state.stack = stack;
		exit();
		if (type === "full" || !text || text !== reference) value += tracker.move(reference + "]");
		else if (type === "shortcut") value = value.slice(0, -1);
		else value += tracker.move("]");
		return value;
	}
	function linkReferencePeek() {
		return "[";
	}
	function checkBulletOther(state) {
		const bullet = checkBullet(state);
		const bulletOther = state.options.bulletOther;
		if (!bulletOther) return bullet === "*" ? "-" : "*";
		if (bulletOther !== "*" && bulletOther !== "+" && bulletOther !== "-") throw new Error("Cannot serialize items with `" + bulletOther + "` for `options.bulletOther`, expected `*`, `+`, or `-`");
		if (bulletOther === bullet) throw new Error("Expected `bullet` (`" + bullet + "`) and `bulletOther` (`" + bulletOther + "`) to be different");
		return bulletOther;
	}
	function checkBulletOrdered(state) {
		const marker = state.options.bulletOrdered || ".";
		if (marker !== "." && marker !== ")") throw new Error("Cannot serialize items with `" + marker + "` for `options.bulletOrdered`, expected `.` or `)`");
		return marker;
	}
	function checkBulletOrderedOther(state) {
		const bulletOrdered = checkBulletOrdered(state);
		const bulletOrderedOther = state.options.bulletOrderedOther;
		if (!bulletOrderedOther) return bulletOrdered === "." ? ")" : ".";
		if (bulletOrderedOther !== "." && bulletOrderedOther !== ")") throw new Error("Cannot serialize items with `" + bulletOrderedOther + "` for `options.bulletOrderedOther`, expected `*`, `+`, or `-`");
		if (bulletOrderedOther === bulletOrdered) throw new Error("Expected `bulletOrdered` (`" + bulletOrdered + "`) and `bulletOrderedOther` (`" + bulletOrderedOther + "`) to be different");
		return bulletOrderedOther;
	}
	function checkRule(state) {
		const marker = state.options.rule || "*";
		if (marker !== "*" && marker !== "-" && marker !== "_") throw new Error("Cannot serialize rules with `" + marker + "` for `options.rule`, expected `*`, `-`, or `_`");
		return marker;
	}
	function list(node, parent, state, info) {
		const exit = state.enter("list");
		const bulletCurrent = state.bulletCurrent;
		let bullet = node.ordered ? checkBulletOrdered(state) : checkBullet(state);
		const bulletOther = node.ordered ? checkBulletOrderedOther(state) : checkBulletOther(state);
		const bulletLastUsed = state.bulletLastUsed;
		let useDifferentMarker = false;
		if (parent && (node.ordered ? state.options.bulletOrderedOther : state.options.bulletOther) && bulletLastUsed && bullet === bulletLastUsed) useDifferentMarker = true;
		if (!node.ordered) {
			const firstListItem = node.children ? node.children[0] : void 0;
			if ((bullet === "*" || bullet === "-") && firstListItem && (!firstListItem.children || !firstListItem.children[0]) && state.stack[state.stack.length - 1] === "list" && state.stack[state.stack.length - 2] === "listItem" && state.stack[state.stack.length - 3] === "list" && state.stack[state.stack.length - 4] === "listItem" && state.indexStack[state.indexStack.length - 1] === 0 && state.indexStack[state.indexStack.length - 2] === 0 && state.indexStack[state.indexStack.length - 3] === 0) useDifferentMarker = true;
			if (checkRule(state) === bullet && firstListItem) {
				let index = -1;
				while (++index < node.children.length) {
					const item = node.children[index];
					if (item && item.type === "listItem" && item.children && item.children[0] && item.children[0].type === "thematicBreak") {
						useDifferentMarker = true;
						break;
					}
				}
			}
		}
		if (useDifferentMarker) bullet = bulletOther;
		state.bulletCurrent = bullet;
		const value = state.containerFlow(node, info);
		state.bulletLastUsed = bullet;
		state.bulletCurrent = bulletCurrent;
		exit();
		return value;
	}
	function paragraph(node, _, state, info) {
		const exit = state.enter("paragraph");
		const subexit = state.enter("phrasing");
		const value = state.containerPhrasing(node, info);
		subexit();
		exit();
		return value;
	}
	var phrasing = convert([
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
	]);
	function root(node, _, state, info) {
		return (node.children.some((d) => phrasing(d)) ? state.containerPhrasing : state.containerFlow).call(state, node, info);
	}
	function checkStrong(state) {
		const marker = state.options.strong || "*";
		if (marker !== "*" && marker !== "_") throw new Error("Cannot serialize strong with `" + marker + "` for `options.strong`, expected `*`, or `_`");
		return marker;
	}
	strong.peek = strongPeek;
	function strong(node, _, state, info) {
		const marker = checkStrong(state);
		const exit = state.enter("strong");
		const tracker = state.createTracker(info);
		let value = tracker.move(marker + marker);
		value += tracker.move(state.containerPhrasing(node, {
			before: value,
			after: marker,
			...tracker.current()
		}));
		value += tracker.move(marker + marker);
		exit();
		return value;
	}
	function strongPeek(_, _1, state) {
		return state.options.strong || "*";
	}
	function text$1(node, _, state, info) {
		return state.safe(node.value, info);
	}
	function checkRuleRepetition(state) {
		const repetition = state.options.ruleRepetition || 3;
		if (repetition < 3) throw new Error("Cannot serialize rules with repetition `" + repetition + "` for `options.ruleRepetition`, expected `3` or more");
		return repetition;
	}
	function thematicBreak(_, _1, state) {
		const value = (checkRule(state) + (state.options.ruleSpaces ? " " : "")).repeat(checkRuleRepetition(state));
		return state.options.ruleSpaces ? value.slice(0, -1) : value;
	}
	var handle = {
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
	var join = [joinDefaults];
	function joinDefaults(left, right, parent, state) {
		if (right.type === "code" && formatCodeAsIndented(right, state) && (left.type === "list" || left.type === right.type && formatCodeAsIndented(left, state))) return false;
		if (left.type === "list" && left.type === right.type && Boolean(left.ordered) === Boolean(right.ordered) && !(left.ordered ? state.options.bulletOrderedOther : state.options.bulletOther)) return false;
		if ("spread" in parent && typeof parent.spread === "boolean") {
			if (left.type === "paragraph" && (left.type === right.type || right.type === "definition" || right.type === "heading" && formatHeadingAsSetext(right, state))) return;
			return parent.spread ? 1 : 0;
		}
	}
	var fullPhrasingSpans = [
		"autolink",
		"destinationLiteral",
		"destinationRaw",
		"reference",
		"titleQuote",
		"titleApostrophe"
	];
	var unsafe = [
		{
			character: "	",
			after: "[\\r\\n]",
			inConstruct: "phrasing"
		},
		{
			character: "	",
			before: "[\\r\\n]",
			inConstruct: "phrasing"
		},
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
		{
			character: " ",
			after: "[\\r\\n]",
			inConstruct: "phrasing"
		},
		{
			character: " ",
			before: "[\\r\\n]",
			inConstruct: "phrasing"
		},
		{
			character: " ",
			inConstruct: ["codeFencedLangGraveAccent", "codeFencedLangTilde"]
		},
		{
			character: "!",
			after: "\\[",
			inConstruct: "phrasing",
			notInConstruct: fullPhrasingSpans
		},
		{
			character: "\"",
			inConstruct: "titleQuote"
		},
		{
			atBreak: true,
			character: "#"
		},
		{
			character: "#",
			inConstruct: "headingAtx",
			after: "(?:[\r\n]|$)"
		},
		{
			character: "&",
			after: "[#A-Za-z]",
			inConstruct: "phrasing"
		},
		{
			character: "'",
			inConstruct: "titleApostrophe"
		},
		{
			character: "(",
			inConstruct: "destinationRaw"
		},
		{
			before: "\\]",
			character: "(",
			inConstruct: "phrasing",
			notInConstruct: fullPhrasingSpans
		},
		{
			atBreak: true,
			before: "\\d+",
			character: ")"
		},
		{
			character: ")",
			inConstruct: "destinationRaw"
		},
		{
			atBreak: true,
			character: "*",
			after: "(?:[ 	\r\n*])"
		},
		{
			character: "*",
			inConstruct: "phrasing",
			notInConstruct: fullPhrasingSpans
		},
		{
			atBreak: true,
			character: "+",
			after: "(?:[ 	\r\n])"
		},
		{
			atBreak: true,
			character: "-",
			after: "(?:[ 	\r\n-])"
		},
		{
			atBreak: true,
			before: "\\d+",
			character: ".",
			after: "(?:[ 	\r\n]|$)"
		},
		{
			atBreak: true,
			character: "<",
			after: "[!/?A-Za-z]"
		},
		{
			character: "<",
			after: "[!/?A-Za-z]",
			inConstruct: "phrasing",
			notInConstruct: fullPhrasingSpans
		},
		{
			character: "<",
			inConstruct: "destinationLiteral"
		},
		{
			atBreak: true,
			character: "="
		},
		{
			atBreak: true,
			character: ">"
		},
		{
			character: ">",
			inConstruct: "destinationLiteral"
		},
		{
			atBreak: true,
			character: "["
		},
		{
			character: "[",
			inConstruct: "phrasing",
			notInConstruct: fullPhrasingSpans
		},
		{
			character: "[",
			inConstruct: ["label", "reference"]
		},
		{
			character: "\\",
			after: "[\\r\\n]",
			inConstruct: "phrasing"
		},
		{
			character: "]",
			inConstruct: ["label", "reference"]
		},
		{
			atBreak: true,
			character: "_"
		},
		{
			character: "_",
			inConstruct: "phrasing",
			notInConstruct: fullPhrasingSpans
		},
		{
			atBreak: true,
			character: "`"
		},
		{
			character: "`",
			inConstruct: ["codeFencedLangGraveAccent", "codeFencedMetaGraveAccent"]
		},
		{
			character: "`",
			inConstruct: "phrasing",
			notInConstruct: fullPhrasingSpans
		},
		{
			atBreak: true,
			character: "~"
		}
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
			handlers: {},
			options: {},
			indexStack: [],
			handle: void 0
		};
		configure(state, {
			unsafe,
			join,
			handlers: handle
		});
		configure(state, options);
		if (state.options.tightDefinitions) configure(state, { join: [joinDefinition] });
		state.handle = zwitch("type", {
			invalid,
			unknown,
			handlers: state.handlers
		});
		let result = state.handle(tree, void 0, state, {
			before: "\n",
			after: "\n",
			now: {
				line: 1,
				column: 1
			},
			lineShift: 0
		});
		if (result && result.charCodeAt(result.length - 1) !== 10 && result.charCodeAt(result.length - 1) !== 13) result += "\n";
		return result;
		function enter(name) {
			state.stack.push(name);
			return exit;
			function exit() {
				state.stack.pop();
			}
		}
	}
	function invalid(value) {
		throw new Error("Cannot handle value `" + value + "`, expected node");
	}
	function unknown(node) {
		throw new Error("Cannot handle unknown node `" + node.type + "`");
	}
	function joinDefinition(left, right) {
		if (left.type === "definition" && left.type === right.type) return 0;
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
	var wwwPrefix = {
		tokenize: tokenizeWwwPrefix,
		partial: true
	};
	var domain = {
		tokenize: tokenizeDomain,
		partial: true
	};
	var path = {
		tokenize: tokenizePath,
		partial: true
	};
	var trail = {
		tokenize: tokenizeTrail,
		partial: true
	};
	var emailDomainDotTrail = {
		tokenize: tokenizeEmailDomainDotTrail,
		partial: true
	};
	var wwwAutolink = {
		tokenize: tokenizeWwwAutolink,
		previous: previousWww
	};
	var protocolAutolink = {
		tokenize: tokenizeProtocolAutolink,
		previous: previousProtocol
	};
	var emailAutolink = {
		tokenize: tokenizeEmailAutolink,
		previous: previousEmail
	};
	var text = {};
	var gfmAutolinkLiteral = { text };
	var code = 48;
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
	function tokenizeEmailAutolink(effects, ok, nok) {
		const self = this;
		let dot;
		let data;
		return start;
		function start(code) {
			if (!gfmAtext(code) || !previousEmail.call(self, self.previous) || previousUnbalanced(self.events)) return nok(code);
			effects.enter("literalAutolink");
			effects.enter("literalAutolinkEmail");
			return atext(code);
		}
		function atext(code) {
			if (gfmAtext(code)) {
				effects.consume(code);
				return atext;
			}
			if (code === 64) {
				effects.consume(code);
				return emailDomain;
			}
			return nok(code);
		}
		function emailDomain(code) {
			if (code === 46) return effects.check(emailDomainDotTrail, emailDomainAfter, emailDomainDot)(code);
			if (code === 45 || code === 95 || asciiAlphanumeric(code)) {
				data = true;
				effects.consume(code);
				return emailDomain;
			}
			return emailDomainAfter(code);
		}
		function emailDomainDot(code) {
			effects.consume(code);
			dot = true;
			return emailDomain;
		}
		function emailDomainAfter(code) {
			if (data && dot && asciiAlpha(self.previous)) {
				effects.exit("literalAutolinkEmail");
				effects.exit("literalAutolink");
				return ok(code);
			}
			return nok(code);
		}
	}
	function tokenizeWwwAutolink(effects, ok, nok) {
		const self = this;
		return wwwStart;
		function wwwStart(code) {
			if (code !== 87 && code !== 119 || !previousWww.call(self, self.previous) || previousUnbalanced(self.events)) return nok(code);
			effects.enter("literalAutolink");
			effects.enter("literalAutolinkWww");
			return effects.check(wwwPrefix, effects.attempt(domain, effects.attempt(path, wwwAfter), nok), nok)(code);
		}
		function wwwAfter(code) {
			effects.exit("literalAutolinkWww");
			effects.exit("literalAutolink");
			return ok(code);
		}
	}
	function tokenizeProtocolAutolink(effects, ok, nok) {
		const self = this;
		let buffer = "";
		let seen = false;
		return protocolStart;
		function protocolStart(code) {
			if ((code === 72 || code === 104) && previousProtocol.call(self, self.previous) && !previousUnbalanced(self.events)) {
				effects.enter("literalAutolink");
				effects.enter("literalAutolinkHttp");
				buffer += String.fromCodePoint(code);
				effects.consume(code);
				return protocolPrefixInside;
			}
			return nok(code);
		}
		function protocolPrefixInside(code) {
			if (asciiAlpha(code) && buffer.length < 5) {
				buffer += String.fromCodePoint(code);
				effects.consume(code);
				return protocolPrefixInside;
			}
			if (code === 58) {
				const protocol = buffer.toLowerCase();
				if (protocol === "http" || protocol === "https") {
					effects.consume(code);
					return protocolSlashesInside;
				}
			}
			return nok(code);
		}
		function protocolSlashesInside(code) {
			if (code === 47) {
				effects.consume(code);
				if (seen) return afterProtocol;
				seen = true;
				return protocolSlashesInside;
			}
			return nok(code);
		}
		function afterProtocol(code) {
			return code === null || asciiControl(code) || markdownLineEndingOrSpace(code) || unicodeWhitespace(code) || unicodePunctuation(code) ? nok(code) : effects.attempt(domain, effects.attempt(path, protocolAfter), nok)(code);
		}
		function protocolAfter(code) {
			effects.exit("literalAutolinkHttp");
			effects.exit("literalAutolink");
			return ok(code);
		}
	}
	function tokenizeWwwPrefix(effects, ok, nok) {
		let size = 0;
		return wwwPrefixInside;
		function wwwPrefixInside(code) {
			if ((code === 87 || code === 119) && size < 3) {
				size++;
				effects.consume(code);
				return wwwPrefixInside;
			}
			if (code === 46 && size === 3) {
				effects.consume(code);
				return wwwPrefixAfter;
			}
			return nok(code);
		}
		function wwwPrefixAfter(code) {
			return code === null ? nok(code) : ok(code);
		}
	}
	function tokenizeDomain(effects, ok, nok) {
		let underscoreInLastSegment;
		let underscoreInLastLastSegment;
		let seen;
		return domainInside;
		function domainInside(code) {
			if (code === 46 || code === 95) return effects.check(trail, domainAfter, domainAtPunctuation)(code);
			if (code === null || markdownLineEndingOrSpace(code) || unicodeWhitespace(code) || code !== 45 && unicodePunctuation(code)) return domainAfter(code);
			seen = true;
			effects.consume(code);
			return domainInside;
		}
		function domainAtPunctuation(code) {
			if (code === 95) underscoreInLastSegment = true;
			else {
				underscoreInLastLastSegment = underscoreInLastSegment;
				underscoreInLastSegment = void 0;
			}
			effects.consume(code);
			return domainInside;
		}
		function domainAfter(code) {
			if (underscoreInLastLastSegment || underscoreInLastSegment || !seen) return nok(code);
			return ok(code);
		}
	}
	function tokenizePath(effects, ok) {
		let sizeOpen = 0;
		let sizeClose = 0;
		return pathInside;
		function pathInside(code) {
			if (code === 40) {
				sizeOpen++;
				effects.consume(code);
				return pathInside;
			}
			if (code === 41 && sizeClose < sizeOpen) return pathAtPunctuation(code);
			if (code === 33 || code === 34 || code === 38 || code === 39 || code === 41 || code === 42 || code === 44 || code === 46 || code === 58 || code === 59 || code === 60 || code === 63 || code === 93 || code === 95 || code === 126) return effects.check(trail, ok, pathAtPunctuation)(code);
			if (code === null || markdownLineEndingOrSpace(code) || unicodeWhitespace(code)) return ok(code);
			effects.consume(code);
			return pathInside;
		}
		function pathAtPunctuation(code) {
			if (code === 41) sizeClose++;
			effects.consume(code);
			return pathInside;
		}
	}
	function tokenizeTrail(effects, ok, nok) {
		return trail;
		function trail(code) {
			if (code === 33 || code === 34 || code === 39 || code === 41 || code === 42 || code === 44 || code === 46 || code === 58 || code === 59 || code === 63 || code === 95 || code === 126) {
				effects.consume(code);
				return trail;
			}
			if (code === 38) {
				effects.consume(code);
				return trailCharRefStart;
			}
			if (code === 93) {
				effects.consume(code);
				return trailBracketAfter;
			}
			if (code === 60 || code === null || markdownLineEndingOrSpace(code) || unicodeWhitespace(code)) return ok(code);
			return nok(code);
		}
		function trailBracketAfter(code) {
			if (code === null || code === 40 || code === 91 || markdownLineEndingOrSpace(code) || unicodeWhitespace(code)) return ok(code);
			return trail(code);
		}
		function trailCharRefStart(code) {
			return asciiAlpha(code) ? trailCharRefInside(code) : nok(code);
		}
		function trailCharRefInside(code) {
			if (code === 59) {
				effects.consume(code);
				return trail;
			}
			if (asciiAlpha(code)) {
				effects.consume(code);
				return trailCharRefInside;
			}
			return nok(code);
		}
	}
	function tokenizeEmailDomainDotTrail(effects, ok, nok) {
		return start;
		function start(code) {
			effects.consume(code);
			return after;
		}
		function after(code) {
			return asciiAlphanumeric(code) ? nok(code) : ok(code);
		}
	}
	function previousWww(code) {
		return code === null || code === 40 || code === 42 || code === 95 || code === 91 || code === 93 || code === 126 || markdownLineEndingOrSpace(code);
	}
	function previousProtocol(code) {
		return !asciiAlpha(code);
	}
	function previousEmail(code) {
		return !(code === 47 || gfmAtext(code));
	}
	function gfmAtext(code) {
		return code === 43 || code === 45 || code === 46 || code === 95 || asciiAlphanumeric(code);
	}
	function previousUnbalanced(events) {
		let index = events.length;
		let result = false;
		while (index--) {
			const token = events[index][1];
			if ((token.type === "labelLink" || token.type === "labelImage") && !token._balanced) {
				result = true;
				break;
			}
			if (token._gfmAutolinkLiteralWalkedInto) {
				result = false;
				break;
			}
		}
		if (events.length > 0 && !result) events[events.length - 1][1]._gfmAutolinkLiteralWalkedInto = true;
		return result;
	}
	var indent = {
		tokenize: tokenizeIndent,
		partial: true
	};
	function gfmFootnote() {
		return {
			document: { [91]: {
				tokenize: tokenizeDefinitionStart,
				continuation: { tokenize: tokenizeDefinitionContinuation },
				exit: gfmFootnoteDefinitionEnd
			} },
			text: {
				[91]: { tokenize: tokenizeGfmFootnoteCall },
				[93]: {
					add: "after",
					tokenize: tokenizePotentialGfmFootnoteCall,
					resolveTo: resolveToPotentialGfmFootnoteCall
				}
			}
		};
	}
	function tokenizePotentialGfmFootnoteCall(effects, ok, nok) {
		const self = this;
		let index = self.events.length;
		const defined = self.parser.gfmFootnotes || (self.parser.gfmFootnotes = []);
		let labelStart;
		while (index--) {
			const token = self.events[index][1];
			if (token.type === "labelImage") {
				labelStart = token;
				break;
			}
			if (token.type === "gfmFootnoteCall" || token.type === "labelLink" || token.type === "label" || token.type === "image" || token.type === "link") break;
		}
		return start;
		function start(code) {
			if (!labelStart || !labelStart._balanced) return nok(code);
			const id = normalizeIdentifier(self.sliceSerialize({
				start: labelStart.end,
				end: self.now()
			}));
			if (id.codePointAt(0) !== 94 || !defined.includes(id.slice(1))) return nok(code);
			effects.enter("gfmFootnoteCallLabelMarker");
			effects.consume(code);
			effects.exit("gfmFootnoteCallLabelMarker");
			return ok(code);
		}
	}
	function resolveToPotentialGfmFootnoteCall(events, context) {
		let index = events.length;
		while (index--) if (events[index][1].type === "labelImage" && events[index][0] === "enter") {
			events[index][1];
			break;
		}
		events[index + 1][1].type = "data";
		events[index + 3][1].type = "gfmFootnoteCallLabelMarker";
		const call = {
			type: "gfmFootnoteCall",
			start: Object.assign({}, events[index + 3][1].start),
			end: Object.assign({}, events[events.length - 1][1].end)
		};
		const marker = {
			type: "gfmFootnoteCallMarker",
			start: Object.assign({}, events[index + 3][1].end),
			end: Object.assign({}, events[index + 3][1].end)
		};
		marker.end.column++;
		marker.end.offset++;
		marker.end._bufferIndex++;
		const string = {
			type: "gfmFootnoteCallString",
			start: Object.assign({}, marker.end),
			end: Object.assign({}, events[events.length - 1][1].start)
		};
		const chunk = {
			type: "chunkString",
			contentType: "string",
			start: Object.assign({}, string.start),
			end: Object.assign({}, string.end)
		};
		const replacement = [
			events[index + 1],
			events[index + 2],
			[
				"enter",
				call,
				context
			],
			events[index + 3],
			events[index + 4],
			[
				"enter",
				marker,
				context
			],
			[
				"exit",
				marker,
				context
			],
			[
				"enter",
				string,
				context
			],
			[
				"enter",
				chunk,
				context
			],
			[
				"exit",
				chunk,
				context
			],
			[
				"exit",
				string,
				context
			],
			events[events.length - 2],
			events[events.length - 1],
			[
				"exit",
				call,
				context
			]
		];
		events.splice(index, events.length - index + 1, ...replacement);
		return events;
	}
	function tokenizeGfmFootnoteCall(effects, ok, nok) {
		const self = this;
		const defined = self.parser.gfmFootnotes || (self.parser.gfmFootnotes = []);
		let size = 0;
		let data;
		return start;
		function start(code) {
			effects.enter("gfmFootnoteCall");
			effects.enter("gfmFootnoteCallLabelMarker");
			effects.consume(code);
			effects.exit("gfmFootnoteCallLabelMarker");
			return callStart;
		}
		function callStart(code) {
			if (code !== 94) return nok(code);
			effects.enter("gfmFootnoteCallMarker");
			effects.consume(code);
			effects.exit("gfmFootnoteCallMarker");
			effects.enter("gfmFootnoteCallString");
			effects.enter("chunkString").contentType = "string";
			return callData;
		}
		function callData(code) {
			if (size > 999 || code === 93 && !data || code === null || code === 91 || markdownLineEndingOrSpace(code)) return nok(code);
			if (code === 93) {
				effects.exit("chunkString");
				const token = effects.exit("gfmFootnoteCallString");
				if (!defined.includes(normalizeIdentifier(self.sliceSerialize(token)))) return nok(code);
				effects.enter("gfmFootnoteCallLabelMarker");
				effects.consume(code);
				effects.exit("gfmFootnoteCallLabelMarker");
				effects.exit("gfmFootnoteCall");
				return ok;
			}
			if (!markdownLineEndingOrSpace(code)) data = true;
			size++;
			effects.consume(code);
			return code === 92 ? callEscape : callData;
		}
		function callEscape(code) {
			if (code === 91 || code === 92 || code === 93) {
				effects.consume(code);
				size++;
				return callData;
			}
			return callData(code);
		}
	}
	function tokenizeDefinitionStart(effects, ok, nok) {
		const self = this;
		const defined = self.parser.gfmFootnotes || (self.parser.gfmFootnotes = []);
		let identifier;
		let size = 0;
		let data;
		return start;
		function start(code) {
			effects.enter("gfmFootnoteDefinition")._container = true;
			effects.enter("gfmFootnoteDefinitionLabel");
			effects.enter("gfmFootnoteDefinitionLabelMarker");
			effects.consume(code);
			effects.exit("gfmFootnoteDefinitionLabelMarker");
			return labelAtMarker;
		}
		function labelAtMarker(code) {
			if (code === 94) {
				effects.enter("gfmFootnoteDefinitionMarker");
				effects.consume(code);
				effects.exit("gfmFootnoteDefinitionMarker");
				effects.enter("gfmFootnoteDefinitionLabelString");
				effects.enter("chunkString").contentType = "string";
				return labelInside;
			}
			return nok(code);
		}
		function labelInside(code) {
			if (size > 999 || code === 93 && !data || code === null || code === 91 || markdownLineEndingOrSpace(code)) return nok(code);
			if (code === 93) {
				effects.exit("chunkString");
				const token = effects.exit("gfmFootnoteDefinitionLabelString");
				identifier = normalizeIdentifier(self.sliceSerialize(token));
				effects.enter("gfmFootnoteDefinitionLabelMarker");
				effects.consume(code);
				effects.exit("gfmFootnoteDefinitionLabelMarker");
				effects.exit("gfmFootnoteDefinitionLabel");
				return labelAfter;
			}
			if (!markdownLineEndingOrSpace(code)) data = true;
			size++;
			effects.consume(code);
			return code === 92 ? labelEscape : labelInside;
		}
		function labelEscape(code) {
			if (code === 91 || code === 92 || code === 93) {
				effects.consume(code);
				size++;
				return labelInside;
			}
			return labelInside(code);
		}
		function labelAfter(code) {
			if (code === 58) {
				effects.enter("definitionMarker");
				effects.consume(code);
				effects.exit("definitionMarker");
				if (!defined.includes(identifier)) defined.push(identifier);
				return factorySpace(effects, whitespaceAfter, "gfmFootnoteDefinitionWhitespace");
			}
			return nok(code);
		}
		function whitespaceAfter(code) {
			return ok(code);
		}
	}
	function tokenizeDefinitionContinuation(effects, ok, nok) {
		return effects.check(blankLine, ok, effects.attempt(indent, ok, nok));
	}
	function gfmFootnoteDefinitionEnd(effects) {
		effects.exit("gfmFootnoteDefinition");
	}
	function tokenizeIndent(effects, ok, nok) {
		const self = this;
		return factorySpace(effects, afterPrefix, "gfmFootnoteDefinitionIndent", 5);
		function afterPrefix(code) {
			const tail = self.events[self.events.length - 1];
			return tail && tail[1].type === "gfmFootnoteDefinitionIndent" && tail[2].sliceSerialize(tail[1], true).length === 4 ? ok(code) : nok(code);
		}
	}
	function gfmStrikethrough(options) {
		let single = (options || {}).singleTilde;
		const tokenizer = {
			tokenize: tokenizeStrikethrough,
			resolveAll: resolveAllStrikethrough
		};
		if (single === null || single === void 0) single = true;
		return {
			text: { [126]: tokenizer },
			insideSpan: { null: [tokenizer] },
			attentionMarkers: { null: [126] }
		};
		function resolveAllStrikethrough(events, context) {
			let index = -1;
			while (++index < events.length) if (events[index][0] === "enter" && events[index][1].type === "strikethroughSequenceTemporary" && events[index][1]._close) {
				let open = index;
				while (open--) if (events[open][0] === "exit" && events[open][1].type === "strikethroughSequenceTemporary" && events[open][1]._open && events[index][1].end.offset - events[index][1].start.offset === events[open][1].end.offset - events[open][1].start.offset) {
					events[index][1].type = "strikethroughSequence";
					events[open][1].type = "strikethroughSequence";
					const strikethrough = {
						type: "strikethrough",
						start: Object.assign({}, events[open][1].start),
						end: Object.assign({}, events[index][1].end)
					};
					const text = {
						type: "strikethroughText",
						start: Object.assign({}, events[open][1].end),
						end: Object.assign({}, events[index][1].start)
					};
					const nextEvents = [
						[
							"enter",
							strikethrough,
							context
						],
						[
							"enter",
							events[open][1],
							context
						],
						[
							"exit",
							events[open][1],
							context
						],
						[
							"enter",
							text,
							context
						]
					];
					const insideSpan = context.parser.constructs.insideSpan.null;
					if (insideSpan) splice(nextEvents, nextEvents.length, 0, resolveAll(insideSpan, events.slice(open + 1, index), context));
					splice(nextEvents, nextEvents.length, 0, [
						[
							"exit",
							text,
							context
						],
						[
							"enter",
							events[index][1],
							context
						],
						[
							"exit",
							events[index][1],
							context
						],
						[
							"exit",
							strikethrough,
							context
						]
					]);
					splice(events, open - 1, index - open + 3, nextEvents);
					index = open + nextEvents.length - 2;
					break;
				}
			}
			index = -1;
			while (++index < events.length) if (events[index][1].type === "strikethroughSequenceTemporary") events[index][1].type = "data";
			return events;
		}
		function tokenizeStrikethrough(effects, ok, nok) {
			const previous = this.previous;
			const events = this.events;
			let size = 0;
			return start;
			function start(code) {
				if (previous === 126 && events[events.length - 1][1].type !== "characterEscape") return nok(code);
				effects.enter("strikethroughSequenceTemporary");
				return more(code);
			}
			function more(code) {
				const before = classifyCharacter(previous);
				if (code === 126) {
					if (size > 1) return nok(code);
					effects.consume(code);
					size++;
					return more;
				}
				if (size < 2 && !single) return nok(code);
				const token = effects.exit("strikethroughSequenceTemporary");
				const after = classifyCharacter(code);
				token._open = !after || after === 2 && Boolean(before);
				token._close = !before || before === 2 && Boolean(after);
				return ok(code);
			}
		}
	}
	var EditMap = class {
		constructor() {
			this.map = [];
		}
		add(index, remove, add) {
			addImpl(this, index, remove, add);
		}
		consume(events) {
			this.map.sort((a, b) => a[0] - b[0]);
			if (this.map.length === 0) return;
			let index = this.map.length;
			const vecs = [];
			while (index > 0) {
				index -= 1;
				vecs.push(events.slice(this.map[index][0] + this.map[index][1]));
				vecs.push(this.map[index][2]);
				events.length = this.map[index][0];
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
	};
	function addImpl(editMap, at, remove, add) {
		let index = 0;
		if (remove === 0 && add.length === 0) return;
		while (index < editMap.map.length) {
			if (editMap.map[index][0] === at) {
				editMap.map[index][1] += remove;
				editMap.map[index][2].push(...add);
				return;
			}
			index += 1;
		}
		editMap.map.push([
			at,
			remove,
			add
		]);
	}
	function gfmTableAlign(events, index) {
		let inDelimiterRow = false;
		const align = [];
		while (index < events.length) {
			const event = events[index];
			if (inDelimiterRow) {
				if (event[0] === "enter") {
					if (event[1].type === "tableContent") align.push(events[index + 1][1].type === "tableDelimiterMarker" ? "left" : "none");
				} else if (event[1].type === "tableContent") {
					if (events[index - 1][1].type === "tableDelimiterMarker") {
						const alignIndex = align.length - 1;
						align[alignIndex] = align[alignIndex] === "left" ? "center" : "right";
					}
				} else if (event[1].type === "tableDelimiterRow") break;
			} else if (event[0] === "enter" && event[1].type === "tableDelimiterRow") inDelimiterRow = true;
			index += 1;
		}
		return align;
	}
	var gfmTable = { flow: { null: {
		tokenize: tokenizeTable,
		resolveAll: resolveTable
	} } };
	function tokenizeTable(effects, ok, nok) {
		const self = this;
		let size = 0;
		let sizeB = 0;
		let seen;
		return start;
		function start(code) {
			let index = self.events.length - 1;
			while (index > -1) {
				const type = self.events[index][1].type;
				if (type === "lineEnding" || type === "linePrefix") index--;
				else break;
			}
			const tail = index > -1 ? self.events[index][1].type : null;
			const next = tail === "tableHead" || tail === "tableRow" ? bodyRowStart : headRowBefore;
			if (next === bodyRowStart && self.parser.lazy[self.now().line]) return nok(code);
			return next(code);
		}
		function headRowBefore(code) {
			effects.enter("tableHead");
			effects.enter("tableRow");
			return headRowStart(code);
		}
		function headRowStart(code) {
			if (code === 124) return headRowBreak(code);
			seen = true;
			sizeB += 1;
			return headRowBreak(code);
		}
		function headRowBreak(code) {
			if (code === null) return nok(code);
			if (markdownLineEnding(code)) {
				if (sizeB > 1) {
					sizeB = 0;
					self.interrupt = true;
					effects.exit("tableRow");
					effects.enter("lineEnding");
					effects.consume(code);
					effects.exit("lineEnding");
					return headDelimiterStart;
				}
				return nok(code);
			}
			if (markdownSpace(code)) return factorySpace(effects, headRowBreak, "whitespace")(code);
			sizeB += 1;
			if (seen) {
				seen = false;
				size += 1;
			}
			if (code === 124) {
				effects.enter("tableCellDivider");
				effects.consume(code);
				effects.exit("tableCellDivider");
				seen = true;
				return headRowBreak;
			}
			effects.enter("data");
			return headRowData(code);
		}
		function headRowData(code) {
			if (code === null || code === 124 || markdownLineEndingOrSpace(code)) {
				effects.exit("data");
				return headRowBreak(code);
			}
			effects.consume(code);
			return code === 92 ? headRowEscape : headRowData;
		}
		function headRowEscape(code) {
			if (code === 92 || code === 124) {
				effects.consume(code);
				return headRowData;
			}
			return headRowData(code);
		}
		function headDelimiterStart(code) {
			self.interrupt = false;
			if (self.parser.lazy[self.now().line]) return nok(code);
			effects.enter("tableDelimiterRow");
			seen = false;
			if (markdownSpace(code)) return factorySpace(effects, headDelimiterBefore, "linePrefix", self.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(code);
			return headDelimiterBefore(code);
		}
		function headDelimiterBefore(code) {
			if (code === 45 || code === 58) return headDelimiterValueBefore(code);
			if (code === 124) {
				seen = true;
				effects.enter("tableCellDivider");
				effects.consume(code);
				effects.exit("tableCellDivider");
				return headDelimiterCellBefore;
			}
			return headDelimiterNok(code);
		}
		function headDelimiterCellBefore(code) {
			if (markdownSpace(code)) return factorySpace(effects, headDelimiterValueBefore, "whitespace")(code);
			return headDelimiterValueBefore(code);
		}
		function headDelimiterValueBefore(code) {
			if (code === 58) {
				sizeB += 1;
				seen = true;
				effects.enter("tableDelimiterMarker");
				effects.consume(code);
				effects.exit("tableDelimiterMarker");
				return headDelimiterLeftAlignmentAfter;
			}
			if (code === 45) {
				sizeB += 1;
				return headDelimiterLeftAlignmentAfter(code);
			}
			if (code === null || markdownLineEnding(code)) return headDelimiterCellAfter(code);
			return headDelimiterNok(code);
		}
		function headDelimiterLeftAlignmentAfter(code) {
			if (code === 45) {
				effects.enter("tableDelimiterFiller");
				return headDelimiterFiller(code);
			}
			return headDelimiterNok(code);
		}
		function headDelimiterFiller(code) {
			if (code === 45) {
				effects.consume(code);
				return headDelimiterFiller;
			}
			if (code === 58) {
				seen = true;
				effects.exit("tableDelimiterFiller");
				effects.enter("tableDelimiterMarker");
				effects.consume(code);
				effects.exit("tableDelimiterMarker");
				return headDelimiterRightAlignmentAfter;
			}
			effects.exit("tableDelimiterFiller");
			return headDelimiterRightAlignmentAfter(code);
		}
		function headDelimiterRightAlignmentAfter(code) {
			if (markdownSpace(code)) return factorySpace(effects, headDelimiterCellAfter, "whitespace")(code);
			return headDelimiterCellAfter(code);
		}
		function headDelimiterCellAfter(code) {
			if (code === 124) return headDelimiterBefore(code);
			if (code === null || markdownLineEnding(code)) {
				if (!seen || size !== sizeB) return headDelimiterNok(code);
				effects.exit("tableDelimiterRow");
				effects.exit("tableHead");
				return ok(code);
			}
			return headDelimiterNok(code);
		}
		function headDelimiterNok(code) {
			return nok(code);
		}
		function bodyRowStart(code) {
			effects.enter("tableRow");
			return bodyRowBreak(code);
		}
		function bodyRowBreak(code) {
			if (code === 124) {
				effects.enter("tableCellDivider");
				effects.consume(code);
				effects.exit("tableCellDivider");
				return bodyRowBreak;
			}
			if (code === null || markdownLineEnding(code)) {
				effects.exit("tableRow");
				return ok(code);
			}
			if (markdownSpace(code)) return factorySpace(effects, bodyRowBreak, "whitespace")(code);
			effects.enter("data");
			return bodyRowData(code);
		}
		function bodyRowData(code) {
			if (code === null || code === 124 || markdownLineEndingOrSpace(code)) {
				effects.exit("data");
				return bodyRowBreak(code);
			}
			effects.consume(code);
			return code === 92 ? bodyRowEscape : bodyRowData;
		}
		function bodyRowEscape(code) {
			if (code === 92 || code === 124) {
				effects.consume(code);
				return bodyRowData;
			}
			return bodyRowData(code);
		}
	}
	function resolveTable(events, context) {
		let index = -1;
		let inFirstCellAwaitingPipe = true;
		let rowKind = 0;
		let lastCell = [
			0,
			0,
			0,
			0
		];
		let cell = [
			0,
			0,
			0,
			0
		];
		let afterHeadAwaitingFirstBodyRow = false;
		let lastTableEnd = 0;
		let currentTable;
		let currentBody;
		let currentCell;
		const map = new EditMap();
		while (++index < events.length) {
			const event = events[index];
			const token = event[1];
			if (event[0] === "enter") {
				if (token.type === "tableHead") {
					afterHeadAwaitingFirstBodyRow = false;
					if (lastTableEnd !== 0) {
						flushTableEnd(map, context, lastTableEnd, currentTable, currentBody);
						currentBody = void 0;
						lastTableEnd = 0;
					}
					currentTable = {
						type: "table",
						start: Object.assign({}, token.start),
						end: Object.assign({}, token.end)
					};
					map.add(index, 0, [[
						"enter",
						currentTable,
						context
					]]);
				} else if (token.type === "tableRow" || token.type === "tableDelimiterRow") {
					inFirstCellAwaitingPipe = true;
					currentCell = void 0;
					lastCell = [
						0,
						0,
						0,
						0
					];
					cell = [
						0,
						index + 1,
						0,
						0
					];
					if (afterHeadAwaitingFirstBodyRow) {
						afterHeadAwaitingFirstBodyRow = false;
						currentBody = {
							type: "tableBody",
							start: Object.assign({}, token.start),
							end: Object.assign({}, token.end)
						};
						map.add(index, 0, [[
							"enter",
							currentBody,
							context
						]]);
					}
					rowKind = token.type === "tableDelimiterRow" ? 2 : currentBody ? 3 : 1;
				} else if (rowKind && (token.type === "data" || token.type === "tableDelimiterMarker" || token.type === "tableDelimiterFiller")) {
					inFirstCellAwaitingPipe = false;
					if (cell[2] === 0) {
						if (lastCell[1] !== 0) {
							cell[0] = cell[1];
							currentCell = flushCell(map, context, lastCell, rowKind, void 0, currentCell);
							lastCell = [
								0,
								0,
								0,
								0
							];
						}
						cell[2] = index;
					}
				} else if (token.type === "tableCellDivider") {
					if (inFirstCellAwaitingPipe) inFirstCellAwaitingPipe = false;
					else {
						if (lastCell[1] !== 0) {
							cell[0] = cell[1];
							currentCell = flushCell(map, context, lastCell, rowKind, void 0, currentCell);
						}
						lastCell = cell;
						cell = [
							lastCell[1],
							index,
							0,
							0
						];
					}
				}
			} else if (token.type === "tableHead") {
				afterHeadAwaitingFirstBodyRow = true;
				lastTableEnd = index;
			} else if (token.type === "tableRow" || token.type === "tableDelimiterRow") {
				lastTableEnd = index;
				if (lastCell[1] !== 0) {
					cell[0] = cell[1];
					currentCell = flushCell(map, context, lastCell, rowKind, index, currentCell);
				} else if (cell[1] !== 0) currentCell = flushCell(map, context, cell, rowKind, index, currentCell);
				rowKind = 0;
			} else if (rowKind && (token.type === "data" || token.type === "tableDelimiterMarker" || token.type === "tableDelimiterFiller")) cell[3] = index;
		}
		if (lastTableEnd !== 0) flushTableEnd(map, context, lastTableEnd, currentTable, currentBody);
		map.consume(context.events);
		index = -1;
		while (++index < context.events.length) {
			const event = context.events[index];
			if (event[0] === "enter" && event[1].type === "table") event[1]._align = gfmTableAlign(context.events, index);
		}
		return events;
	}
	function flushCell(map, context, range, rowKind, rowEnd, previousCell) {
		const groupName = rowKind === 1 ? "tableHeader" : rowKind === 2 ? "tableDelimiter" : "tableData";
		const valueName = "tableContent";
		if (range[0] !== 0) {
			previousCell.end = Object.assign({}, getPoint(context.events, range[0]));
			map.add(range[0], 0, [[
				"exit",
				previousCell,
				context
			]]);
		}
		const now = getPoint(context.events, range[1]);
		previousCell = {
			type: groupName,
			start: Object.assign({}, now),
			end: Object.assign({}, now)
		};
		map.add(range[1], 0, [[
			"enter",
			previousCell,
			context
		]]);
		if (range[2] !== 0) {
			const relatedStart = getPoint(context.events, range[2]);
			const relatedEnd = getPoint(context.events, range[3]);
			const valueToken = {
				type: valueName,
				start: Object.assign({}, relatedStart),
				end: Object.assign({}, relatedEnd)
			};
			map.add(range[2], 0, [[
				"enter",
				valueToken,
				context
			]]);
			if (rowKind !== 2) {
				const start = context.events[range[2]];
				const end = context.events[range[3]];
				start[1].end = Object.assign({}, end[1].end);
				start[1].type = "chunkText";
				start[1].contentType = "text";
				if (range[3] > range[2] + 1) {
					const a = range[2] + 1;
					const b = range[3] - range[2] - 1;
					map.add(a, b, []);
				}
			}
			map.add(range[3] + 1, 0, [[
				"exit",
				valueToken,
				context
			]]);
		}
		if (rowEnd !== void 0) {
			previousCell.end = Object.assign({}, getPoint(context.events, rowEnd));
			map.add(rowEnd, 0, [[
				"exit",
				previousCell,
				context
			]]);
			previousCell = void 0;
		}
		return previousCell;
	}
	function flushTableEnd(map, context, index, table, tableBody) {
		const exits = [];
		const related = getPoint(context.events, index);
		if (tableBody) {
			tableBody.end = Object.assign({}, related);
			exits.push([
				"exit",
				tableBody,
				context
			]);
		}
		table.end = Object.assign({}, related);
		exits.push([
			"exit",
			table,
			context
		]);
		map.add(index + 1, 0, exits);
	}
	function getPoint(events, index) {
		const event = events[index];
		const side = event[0] === "enter" ? "start" : "end";
		return event[1][side];
	}
	var tasklistCheck = { tokenize: tokenizeTasklistCheck };
	var gfmTaskListItem = { text: { [91]: tasklistCheck } };
	function tokenizeTasklistCheck(effects, ok, nok) {
		const self = this;
		return open;
		function open(code) {
			if (self.previous !== null || !self._gfmTasklistFirstContentOfListItem) return nok(code);
			effects.enter("taskListCheck");
			effects.enter("taskListCheckMarker");
			effects.consume(code);
			effects.exit("taskListCheckMarker");
			return inside;
		}
		function inside(code) {
			if (markdownLineEndingOrSpace(code)) {
				effects.enter("taskListCheckValueUnchecked");
				effects.consume(code);
				effects.exit("taskListCheckValueUnchecked");
				return close;
			}
			if (code === 88 || code === 120) {
				effects.enter("taskListCheckValueChecked");
				effects.consume(code);
				effects.exit("taskListCheckValueChecked");
				return close;
			}
			return nok(code);
		}
		function close(code) {
			if (code === 93) {
				effects.enter("taskListCheckMarker");
				effects.consume(code);
				effects.exit("taskListCheckMarker");
				effects.exit("taskListCheck");
				return after;
			}
			return nok(code);
		}
		function after(code) {
			if (markdownLineEnding(code)) return ok(code);
			if (markdownSpace(code)) return effects.check({ tokenize: spaceThenNonSpace }, ok, nok)(code);
			return nok(code);
		}
	}
	function spaceThenNonSpace(effects, ok, nok) {
		return factorySpace(effects, after, "whitespace");
		function after(code) {
			return code === null ? nok(code) : ok(code);
		}
	}
	function gfm(options) {
		return combineExtensions([
			gfmAutolinkLiteral,
			gfmFootnote(),
			gfmStrikethrough(options),
			gfmTable,
			gfmTaskListItem
		]);
	}
	function fromMarkdown(content) {
		return fromMarkdown$1(content, {
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
	function toHtml(node) {
		return toHtml$1(toHast(node));
	}
	function flatMap(tree, fn) {
		function transform(node, i, parent) {
			if ("children" in node) {
				const p = node;
				p.children = p.children.flatMap((item, i) => transform(item, i, p));
			}
			return fn(node, i, parent);
		}
		return transform(tree, 0, void 0)[0];
	}
	function standardizeLineBreaks(text) {
		return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
	}
	function transformAuthor(author) {
		switch (author.role) {
			case "assistant":
			case "tool": return "ChatGPT";
			case "user": return "You";
			default: return author.role;
		}
	}
	function fillTemplate(template, values) {
		return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
			return Object.hasOwn(values, key) ? values[key] : match;
		});
	}
	function escapeHtml(html) {
		return html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
	}
	function metaDetailsHtml(metaList) {
		if (metaList.length === 0) return "";
		return `<details>
    <summary>Metadata</summary>
    <div class="metadata_container">
        ${metaList.map(([name, value]) => `<div class="metadata_item"><div>${escapeHtml(name)}</div><div>${escapeHtml(value)}</div></div>`).join("\n")}
    </div>
</details>`;
	}
	function getMetaVariables({ title, model, modelSlug, createTime, updateTime }, source, date = dateStr()) {
		return {
			title,
			date,
			timestamp: timestamp(),
			source,
			model,
			model_name: modelSlug,
			create_time: unixTimestampToISOString(createTime),
			update_time: unixTimestampToISOString(updateTime)
		};
	}
	function resolveMetaList(metaList, variables) {
		return metaList?.filter((x) => !!x.name).map(({ name, value }) => {
			return [name, value.replace(/\{(\w+)\}/g, (match, key) => {
				return Object.hasOwn(variables, key) ? variables[key] : match;
			})];
		}) ?? [];
	}
	async function exportToHtml(fileNameFormat, metaList) {
		if (!checkIfConversationStarted()) {
			alert(i18n.t("Please start a conversation first"));
			return false;
		}
		if (!checkIfTemporaryChatIsExportable()) {
			alert(i18n.t("Temporary chat could not be captured"));
			return false;
		}
		const userAvatar = await getUserAvatar();
		const chatId = await getCurrentChatId();
		const conversation = processConversation(await withImageAssets(await fetchConversation(chatId)), { enableThinking: ScriptStorage.get("exporter:enable_thinking") ?? false });
		const html = conversationToHtml(conversation, userAvatar, metaList);
		downloadFile(getFileNameWithFormat(fileNameFormat, "html", {
			title: conversation.title,
			chatId,
			createTime: conversation.createTime,
			updateTime: conversation.updateTime
		}), "text/html", standardizeLineBreaks(html));
		return true;
	}
	async function exportAllToHtml(fileNameFormat, apiConversations, metaList, projectName, partIndex, totalParts) {
		const userAvatar = await getUserAvatar();
		const zip = new jszip.default();
		const filenameMap = new Map();
		const enableThinking = ScriptStorage.get("exporter:enable_thinking") ?? false;
		apiConversations.map((x) => processConversation(x, { enableThinking })).forEach((conversation) => {
			let fileName = getFileNameWithFormat(fileNameFormat, "html", {
				title: conversation.title,
				chatId: conversation.id,
				createTime: conversation.createTime,
				updateTime: conversation.updateTime
			});
			if (filenameMap.has(fileName)) {
				const count = filenameMap.get(fileName) ?? 1;
				filenameMap.set(fileName, count + 1);
				fileName = `${fileName.slice(0, -5)} (${count}).html`;
			} else filenameMap.set(fileName, 1);
			const content = conversationToHtml(conversation, userAvatar, metaList);
			zip.file(fileName, content);
		});
		const blob = await zip.generateAsync({
			type: "blob",
			compression: "DEFLATE",
			compressionOptions: { level: 9 }
		});
		downloadFile(buildZipFileName("html", projectName, partIndex != null && totalParts != null ? {
			part: partIndex,
			total: totalParts
		} : void 0), "application/zip", blob);
		return true;
	}
	function conversationToHtml(conversation, avatar, metaList) {
		const { id, title, conversationNodes } = conversation;
		const enableTimestamp = ScriptStorage.get("exporter:enable_timestamp") ?? false;
		const timeStampHtml = ScriptStorage.get("exporter:timestamp_html") ?? false;
		const timeStamp24H = ScriptStorage.get("exporter:timestamp_24h") ?? false;
		const enableSources = ScriptStorage.get("exporter:enable_sources") ?? true;
		const conversationHtml = conversationNodes.map(({ message, thinking }) => {
			if (!message || !message.content) return null;
			if (shouldSkipMessageInExport(message)) return null;
			const author = transformAuthor(message.author);
			const authorType = message.author.role === "user" ? "user" : "assistant";
			const avatarEl = message.author.role === "user" ? `<img alt="${author}" />` : "<svg width=\"41\" height=\"41\"><use xlink:href=\"#chatgpt\" /></svg>";
			let postSteps = [];
			if (message.author.role === "assistant") {
				postSteps.push((input) => transformFootNotes$2(input, message.metadata));
				postSteps.push((input) => transformContentReferences(input, message.metadata, {
					includeSourceList: enableSources,
					sourceListLabel: i18n.t("Sources")
				}));
				postSteps.push((input) => {
					const { text, restore } = protectMath(input);
					return restore(toHtml(fromMarkdown(text)), (formula) => escapeHtml(toBracketDelimiters(formula)));
				});
			} else postSteps = [(input) => `<p class="no-katex">${escapeHtml(input)}</p>`];
			const postProcess = (input) => postSteps.reduce((acc, fn) => fn(acc), input);
			const content = transformContent$2(message.content, message.metadata, postProcess);
			const attachments = getFileAttachmentNames(message);
			const attachmentsHtml = attachments.length ? `<ul class="attachments">${attachments.map((name) => `<li>📎 ${escapeHtml(name)}</li>`).join("")}</ul>` : "";
			const timestamp = message?.create_time ?? "";
			const showTimestamp = enableTimestamp && timeStampHtml && timestamp;
			let timestampHtml = "";
			let conversationTime = "";
			if (showTimestamp) {
				const date = new Date(timestamp * 1e3);
				conversationTime = date.toLocaleTimeString("en-US", {
					hour: "2-digit",
					minute: "2-digit",
					hour12: !timeStamp24H
				});
				timestampHtml = `<time class="time" datetime="${date.toISOString()}" title="${date.toLocaleString()}">${conversationTime}</time>`;
			}
			return `
<div class="conversation-item">
    <div class="author ${authorType}">
        ${avatarEl}
    </div>
    <div class="conversation-content-wrapper">
        ${thinking ? formatThinkingHtml(thinking) : ""}
        <div class="conversation-content">
            ${content}
            ${attachmentsHtml}
        </div>
    </div>
    ${timestampHtml}
</div>`;
		}).filter(Boolean).join("\n\n");
		const date = dateStr();
		const time = new Date().toISOString();
		const source = `${baseUrl}/c/${id}`;
		const lang = document.documentElement.lang ?? "en";
		const theme = getColorScheme();
		const _metaList = resolveMetaList(metaList, getMetaVariables(conversation, source, date));
		return fillTemplate(template_default, {
			title: escapeHtml(title),
			date,
			time,
			source,
			lang,
			theme,
			avatar,
			details: metaDetailsHtml(_metaList),
			content: conversationHtml
		});
	}
	function transformFootNotes$2(input, metadata) {
		return input.replace(/【(\d+)†\((.+?)\)】/g, (match, citeIndex, _evidenceText) => {
			if (metadata?.citations?.find((cite) => cite.metadata?.extra?.cited_message_idx === +citeIndex)) return "";
			return match;
		});
	}
	function transformContent$2(content, metadata, postProcess) {
		switch (content.content_type) {
			case "text": return postProcess(content.parts?.join("\n") || "");
			case "code": return postProcess(`Code:\n\`\`\`\n${content.text}\n\`\`\``);
			case "execution_output":
				if (metadata?.aggregate_result?.messages) return metadata.aggregate_result.messages.filter((msg) => msg.message_type === "image").map((msg) => `<img src="${msg.image_url}" height="${msg.height}" width="${msg.width}" />`).join("\n");
				return postProcess(`Result:\n\`\`\`\n${content.text}\n\`\`\`` || "");
			case "tether_quote": return postProcess(`> ${content.title || content.text || ""}`);
			case "tether_browsing_code": return postProcess("");
			case "tether_browsing_display": {
				const metadataList = metadata?._cite_metadata?.metadata_list;
				if (Array.isArray(metadataList) && metadataList.length > 0) return postProcess(metadataList.map(({ title, url }) => {
					return `> [${title}](${url})`;
				}).join("\n"));
				return postProcess("");
			}
			case "multimodal_text": return content.parts?.map((part) => {
				if (typeof part === "string") return postProcess(part);
				if (part.content_type === "image_asset_pointer") return `<img src="${part.asset_pointer}" height="${part.height}" width="${part.width}" />`;
				if (part.content_type === "audio_transcription") return `<div style="font-style: italic; opacity: 0.65;">“${escapeHtml(part.text)}”</div>`;
				if (part.content_type === "audio_asset_pointer") return null;
				if (part.content_type === "real_time_user_audio_video_asset_pointer") return null;
				return postProcess("[Unsupported multimodal content]");
			}).join("\n") || "";
			default:
				console.warn("[Exporter] Unsupported Content:", content.content_type, content);
				return postProcess(`[Unsupported Content: ${content.content_type} ]`);
		}
	}
	function formatThinkingHtml(thinking) {
		const durationLabel = thinking.durationSeconds != null ? `Thought for ${thinking.durationSeconds} seconds` : "Thinking";
		const parts = [];
		if (thinking.activities?.length) {
			const items = thinking.activities.map((a) => `<li>${escapeHtml(a)}</li>`).join("");
			parts.push(`<ul>${items}</ul>`);
		}
		const thoughts = thinking.thoughts.map((t) => t.content || t.summary).filter(Boolean).map((text) => `<p>${escapeHtml(text)}</p>`).join("\n");
		if (thoughts) parts.push(thoughts);
		const body = parts.join("\n");
		if (!body) return "";
		return `<details class="thinking"><summary>${escapeHtml(durationLabel)}</summary>${body}</details>`;
	}
	var Effect = class {
		_sideEffects = [];
		_cleanupFns = [];
		_isDisposed = false;
		add(sideEffect) {
			if (this._isDisposed) return;
			this._sideEffects.push(sideEffect);
		}
		run() {
			if (this._isDisposed) return;
			this._sideEffects.forEach((fn) => {
				const cleanupFn = fn();
				if (cleanupFn) this._cleanupFns.push(cleanupFn);
			});
			this._sideEffects = [];
		}
		dispose() {
			if (this._isDisposed) return;
			this._cleanupFns.forEach((fn) => fn());
			this._cleanupFns = [];
			this._isDisposed = true;
		}
	};
	var PNG_SIGNATURE = new Uint8Array([
		137,
		80,
		78,
		71,
		13,
		10,
		26,
		10
	]);
	var PNG_TYPE_IHDR = new Uint8Array([
		73,
		72,
		68,
		82
	]);
	var PNG_TYPE_IDAT = new Uint8Array([
		73,
		68,
		65,
		84
	]);
	var PNG_TYPE_IEND = new Uint8Array([
		73,
		69,
		78,
		68
	]);
	var ROW_CHUNK_BYTES = 262144;
	var crcTable = new Uint32Array(256);
	for (let index = 0; index < crcTable.length; index++) {
		let value = index;
		for (let bit = 0; bit < 8; bit++) value = value & 1 ? 3988292384 ^ value >>> 1 : value >>> 1;
		crcTable[index] = value >>> 0;
	}
	function writeUint32(target, offset, value) {
		target[offset] = value >>> 24;
		target[offset + 1] = value >>> 16;
		target[offset + 2] = value >>> 8;
		target[offset + 3] = value;
	}
	function pngChunk(type, data = new Uint8Array()) {
		const chunk = new Uint8Array(12 + data.length);
		writeUint32(chunk, 0, data.length);
		chunk.set(type, 4);
		chunk.set(data, 8);
		let crc = 4294967295;
		for (let index = 4; index < 8 + data.length; index++) crc = crcTable[(crc ^ chunk[index]) & 255] ^ crc >>> 8;
		writeUint32(chunk, 8 + data.length, (crc ^ 4294967295) >>> 0);
		return chunk;
	}
	function pngHeader(width, height) {
		const data = new Uint8Array(13);
		writeUint32(data, 0, width);
		writeUint32(data, 4, height);
		data[8] = 8;
		data[9] = 6;
		return pngChunk(PNG_TYPE_IHDR, data);
	}
	async function encodePng(width, renderRows) {
		if (!Number.isInteger(width) || width <= 0) throw new RangeError("PNG width must be a positive integer");
		if (typeof CompressionStream === "undefined") throw new TypeError("CompressionStream is not supported by this browser");
		const compression = new CompressionStream("deflate");
		const writer = compression.writable.getWriter();
		const idatChunks = [];
		const readCompressedData = (async () => {
			const reader = compression.readable.getReader();
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				idatChunks.push(pngChunk(PNG_TYPE_IDAT, value));
			}
		})();
		let writtenRows = 0;
		try {
			await renderRows(async ({ data, width: rowWidth, height: rowCount }) => {
				if (rowWidth !== width || data.length !== rowWidth * rowCount * 4) throw new RangeError("Invalid RGBA rows supplied to PNG encoder");
				const rgbaStride = width * 4;
				const pngStride = rgbaStride + 1;
				const rowsPerWrite = Math.max(1, Math.floor(ROW_CHUNK_BYTES / pngStride));
				for (let startRow = 0; startRow < rowCount; startRow += rowsPerWrite) {
					const rowsInWrite = Math.min(rowsPerWrite, rowCount - startRow);
					const filteredRows = new Uint8Array(pngStride * rowsInWrite);
					for (let row = 0; row < rowsInWrite; row++) {
						const sourceOffset = (startRow + row) * rgbaStride;
						const targetOffset = row * pngStride;
						filteredRows[targetOffset] = 0;
						filteredRows.set(data.subarray(sourceOffset, sourceOffset + rgbaStride), targetOffset + 1);
					}
					await writer.write(filteredRows);
				}
				writtenRows += rowCount;
			});
			if (writtenRows === 0) throw new RangeError("PNG must contain at least one row");
			await writer.close();
			await readCompressedData;
		} catch (error) {
			await writer.abort(error).catch(() => {});
			await readCompressedData.catch(() => {});
			throw error;
		}
		return new Blob([
			PNG_SIGNATURE,
			pngHeader(width, writtenRows),
			...idatChunks,
			pngChunk(PNG_TYPE_IEND)
		], { type: "image/png" });
	}
	var MAX_SCREENSHOT_DIMENSION = 16e3;
	var MAX_TILE_PIXELS = 16e6;
	function scrollElementWithinRoot(scrollRoot, target, block) {
		const scrollRect = scrollRoot.getBoundingClientRect();
		const targetRect = target.getBoundingClientRect();
		const offset = targetRect.top - scrollRect.top;
		const alignment = block === "center" ? (scrollRoot.clientHeight - targetRect.height) / 2 : 0;
		scrollRoot.scrollTop = Math.max(0, Math.min(scrollRoot.scrollHeight - scrollRoot.clientHeight, scrollRoot.scrollTop + offset - alignment));
		scrollRoot.dispatchEvent(new Event("scroll", { bubbles: true }));
	}
	function findCommonAncestor(elements) {
		let ancestor = elements[0]?.parentElement;
		while (ancestor && !elements.every((element) => ancestor.contains(element))) ancestor = ancestor.parentElement;
		return ancestor;
	}
	var REDESIGNED_THREAD_SELECTOR = "[data-chatgpt-conversation-selection-target]";
	var REDESIGNED_SCROLL_ROOT_SELECTOR = "[data-app-action-timeline-scroll]";
	var REDESIGNED_TURN_SELECTOR = "[data-turn-key]";
	var HISTORY_SPINNER_SELECTOR = ":scope > div > [role=\"status\"]";
	var HISTORY_LOAD_ATTEMPTS = 120;
	function scrollRootTo(scrollRoot, scrollTop) {
		scrollRoot.scrollTop = scrollTop;
		scrollRoot.dispatchEvent(new Event("scroll", { bubbles: true }));
	}
	function createScrollPosition(scrollRoot) {
		const initialScrollTop = scrollRoot.scrollTop;
		scrollRoot.scrollTop = -1;
		const reversed = initialScrollTop < 0 || scrollRoot.scrollTop < 0;
		scrollRoot.scrollTop = initialScrollTop;
		const max = () => Math.max(0, scrollRoot.scrollHeight - scrollRoot.clientHeight);
		return {
			reversed,
			max,
			get: () => reversed ? scrollRoot.scrollTop + max() : scrollRoot.scrollTop,
			set: (top) => scrollRootTo(scrollRoot, reversed ? top - max() : top)
		};
	}
	var IMAGE_LOAD_TIMEOUT = 5e3;
	function waitForImages(root) {
		const pending = Array.from(root.querySelectorAll("img")).filter((img) => !img.complete);
		if (pending.length === 0) return Promise.resolve();
		return Promise.race([Promise.all(pending.map((img) => new Promise((resolve) => {
			img.addEventListener("load", resolve, { once: true });
			img.addEventListener("error", resolve, { once: true });
		}))), sleep(IMAGE_LOAD_TIMEOUT)]);
	}
	function inlineBlobImages(live, snapshot) {
		const snapshotImages = snapshot.querySelectorAll("img");
		live.querySelectorAll("img").forEach((img, index) => {
			const target = snapshotImages[index];
			if (!target || !img.currentSrc.startsWith("blob:") || !img.complete || img.naturalWidth === 0) return;
			try {
				const dataUrl = getBase64FromImg(img);
				if (!dataUrl) return;
				target.removeAttribute("srcset");
				target.src = dataUrl;
			} catch (error) {
				console.warn("[ChatGPT Exporter:screenshot] failed to copy image", error);
			}
		});
	}
	var growUserBubbles = {
		name: "chatgpt-exporter-grow-user-bubbles",
		afterClone({ clone: root, nodeMap }) {
			nodeMap?.forEach((source, clone) => {
				if (!(source instanceof HTMLElement) || !(clone instanceof HTMLElement)) return;
				if (!source.matches(".bg-user-message")) return;
				for (let el = clone; el && el !== root; el = el.parentElement) el.style.height = "auto";
				clone.querySelectorAll("*").forEach((child) => {
					if (!(child instanceof HTMLImageElement)) child.style.height = "auto";
				});
			});
		}
	};
	var CJK_FONT_FAMILY = "chatgpt-exporter-cjk";
	var CJK_UNICODE_RANGE = "U+2E80-2FFF, U+3000-303F, U+3040-30FF, U+3100-31FF, U+3400-4DBF, U+4E00-9FFF, U+F900-FAFF, U+FE30-FE4F, U+FF00-FFEF";
	var CJK_FONT_FACES = [
		{
			weight: "100 400",
			names: ["PingFang TC", "PingFangTC-Regular"]
		},
		{
			weight: "500",
			names: ["PingFangTC-Medium"]
		},
		{
			weight: "600 900",
			names: ["PingFangTC-Semibold"]
		}
	].map(({ weight, names }) => `
    @font-face {
        font-family: "${CJK_FONT_FAMILY}";
        src: ${names.map((name) => `local("${name}")`).join(", ")};
        font-weight: ${weight};
        unicode-range: ${CJK_UNICODE_RANGE};
    }
`).join("");
	async function matchCjkMetrics(root) {
		const elements = [root, ...Array.from(root.querySelectorAll("*"))];
		const families = new Map(elements.map((el) => [el, getComputedStyle(el).fontFamily]));
		elements.forEach((el) => {
			const family = families.get(el);
			if (!family || el !== root && family === families.get(el.parentElement)) return;
			el.style.fontFamily = `"${CJK_FONT_FAMILY}", ${family}`;
		});
		await Promise.all([
			"400",
			"500",
			"600"
		].map((weight) => document.fonts.load(`${weight} 16px "${CJK_FONT_FAMILY}"`, "中").catch(() => [])));
	}
	var EMOJI_PATTERN = /[\u{1F1E6}-\u{1F1FF}]{2}|[0-9#*]️⃣|(?:\p{Emoji_Presentation}|\p{Extended_Pictographic}️)(?:[\u{1F3FB}-\u{1F3FF}]|️|‍(?:\p{Emoji_Presentation}|\p{Extended_Pictographic}️?))*/gu;
	function pinEmojiWidths(root) {
		const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
		const textNodes = [];
		for (let node = walker.nextNode(); node; node = walker.nextNode()) {
			EMOJI_PATTERN.lastIndex = 0;
			if (EMOJI_PATTERN.test(node.nodeValue ?? "") && !node.parentElement?.closest("style, script, svg")) textNodes.push(node);
		}
		const wrappers = [];
		textNodes.forEach((node) => {
			const text = node.nodeValue ?? "";
			const fragment = document.createDocumentFragment();
			let last = 0;
			for (const match of text.matchAll(EMOJI_PATTERN)) {
				fragment.append(text.slice(last, match.index));
				const wrapper = document.createElement("span");
				wrapper.textContent = match[0];
				fragment.append(wrapper);
				wrappers.push(wrapper);
				last = match.index + match[0].length;
			}
			fragment.append(text.slice(last));
			node.replaceWith(fragment);
		});
		const widths = wrappers.map((wrapper) => wrapper.getBoundingClientRect().width);
		wrappers.forEach((wrapper, index) => {
			Object.assign(wrapper.style, {
				display: "inline-block",
				width: `${widths[index]}px`,
				textIndent: "0"
			});
		});
	}
	var TRANSPARENT_PIXEL = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
	var FAVICON_MAX_SIZE = 40;
	function toSvgDataUrl(svg) {
		return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
	}
	function getFaviconHost(src) {
		try {
			const url = new URL(src);
			const site = url.searchParams.get("url") || url.searchParams.get("domain");
			return new URL(site && /^https?:/.test(site) ? site : `https://${site || url.hostname}`).hostname.replace(/^www\./, "");
		} catch {
			return "";
		}
	}
	function createImagePlaceholder(target, src, isDarkMode) {
		const rect = target.getBoundingClientRect();
		const width = Math.round(rect.width);
		const height = Math.round(rect.height);
		if (width === 0 || height === 0) return TRANSPARENT_PIXEL;
		const fill = isDarkMode ? "#303030" : "#ececec";
		const ink = isDarkMode ? "#8f8f8f" : "#a3a3a3";
		if (Math.max(width, height) <= FAVICON_MAX_SIZE) {
			const initial = getFaviconHost(src).charAt(0).toUpperCase();
			const size = Math.min(width, height);
			return toSvgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><circle cx="${width / 2}" cy="${height / 2}" r="${size / 2}" fill="${fill}"/><text x="50%" y="50%" dy="0.35em" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${size * .55}" font-weight="600" fill="${ink}">${initial}</text></svg>`);
		}
		const iconSize = Math.max(16, Math.min(48, Math.min(width, height) * .3));
		const scale = iconSize / 24;
		return toSvgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" fill="${fill}"/><g transform="translate(${(width - iconSize) / 2} ${(height - iconSize) / 2}) scale(${scale})" fill="none" stroke="${ink}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2.5"/><circle cx="9" cy="9.5" r="1.75"/><path d="M3.5 17.5l5-5 3.5 3.5 2.5-2.5 6 6"/></g></svg>`);
	}
	var EXTERNAL_IMAGE_CONCURRENCY = 6;
	var EXTERNAL_IMAGE_SCALE = 2;
	function loadCorsImage(url) {
		return new Promise((resolve) => {
			const img = new Image();
			const timer = setTimeout(() => resolve(null), IMAGE_LOAD_TIMEOUT);
			img.crossOrigin = "anonymous";
			img.onload = () => {
				clearTimeout(timer);
				resolve(img);
			};
			img.onerror = () => {
				clearTimeout(timer);
				resolve(null);
			};
			img.src = url;
		});
	}
	function encodeImage(source, target) {
		const rect = target.getBoundingClientRect();
		const ratio = rect.width > 0 && rect.height > 0 ? Math.min(1, Math.max(rect.width * EXTERNAL_IMAGE_SCALE / source.naturalWidth, rect.height * EXTERNAL_IMAGE_SCALE / source.naturalHeight)) : 1;
		const canvas = document.createElement("canvas");
		canvas.width = Math.max(1, Math.round(source.naturalWidth * ratio));
		canvas.height = Math.max(1, Math.round(source.naturalHeight * ratio));
		const context = canvas.getContext("2d");
		if (!context) return null;
		context.drawImage(source, 0, 0, canvas.width, canvas.height);
		return canvas.toDataURL("image/png");
	}
	async function inlineExternalImages(root, isDarkMode) {
		const imagesBySrc = new Map();
		root.querySelectorAll("img").forEach((img) => {
			const src = img.currentSrc || img.src;
			try {
				const url = new URL(src, location.href);
				if (!url.protocol.startsWith("http") || url.origin === location.origin) return;
			} catch {
				return;
			}
			imagesBySrc.set(src, [...imagesBySrc.get(src) ?? [], img]);
		});
		const queue = Array.from(imagesBySrc.entries());
		const worker = async () => {
			for (let entry = queue.shift(); entry; entry = queue.shift()) {
				const [src, targets] = entry;
				const source = await loadCorsImage(src);
				targets.forEach((target) => {
					let dataUrl = null;
					try {
						dataUrl = source && encodeImage(source, target);
					} catch {}
					target.removeAttribute("srcset");
					target.src = dataUrl || createImagePlaceholder(target, src, isDarkMode);
				});
			}
		};
		await Promise.all(Array.from({ length: EXTERNAL_IMAGE_CONCURRENCY }, worker));
	}
	function getSurfaceColor(element, fallback) {
		for (let el = element; el; el = el.parentElement) {
			const color = getComputedStyle(el).backgroundColor;
			if (color && color !== "transparent" && !/^rgba\(.*,\s*0\)$/.test(color)) return color;
		}
		return fallback;
	}
	async function prepareRedesignedThread(threadEl, effect, isDarkMode) {
		const scrollRoot = threadEl.closest(REDESIGNED_SCROLL_ROOT_SELECTOR);
		if (!scrollRoot || !threadEl.querySelector(REDESIGNED_TURN_SELECTOR)) return null;
		const backgroundColor = getSurfaceColor(threadEl, isDarkMode ? "#212121" : "#fff");
		const position = createScrollPosition(scrollRoot);
		effect.add(() => {
			const distanceFromBottom = position.max() - position.get();
			return () => position.set(position.max() - distanceFromBottom);
		});
		effect.run();
		let previousScrollHeight = -1;
		for (let attempt = 0; attempt < HISTORY_LOAD_ATTEMPTS && threadEl.querySelector(HISTORY_SPINNER_SELECTOR); attempt++) {
			if (scrollRoot.scrollHeight === previousScrollHeight) {
				position.set(scrollRoot.clientHeight * 2);
				await sleep(100);
			}
			previousScrollHeight = scrollRoot.scrollHeight;
			position.set(0);
			await sleep(500);
		}
		if (threadEl.querySelector(HISTORY_SPINNER_SELECTOR)) console.warn("[ChatGPT Exporter:screenshot] history is still loading; exporting the loaded part");
		const snapshots = new Map();
		const getListOffset = (turn) => turn.getBoundingClientRect().top - scrollRoot.getBoundingClientRect().top + position.get();
		const getMountedTurns = () => Array.from(threadEl.querySelectorAll(REDESIGNED_TURN_SELECTOR));
		const captureMountedTurns = async () => {
			const turns = getMountedTurns().filter((turn) => {
				const key = turn.dataset.turnKey;
				return !!key && !snapshots.has(key) && turn.offsetHeight > 0;
			});
			if (turns.length === 0) return;
			turns.forEach((turn) => turn.querySelectorAll("img[loading=\"lazy\"]").forEach((img) => img.setAttribute("loading", "eager")));
			await Promise.all(turns.map(waitForImages));
			await sleep(100);
			turns.forEach((turn) => {
				const key = turn.dataset.turnKey;
				if (snapshots.has(key) || !turn.isConnected) return;
				const snapshot = turn.cloneNode(true);
				snapshot.querySelectorAll("img[loading=\"lazy\"]").forEach((img) => img.setAttribute("loading", "eager"));
				inlineBlobImages(turn, snapshot);
				snapshots.set(key, {
					top: getListOffset(turn),
					snapshot
				});
			});
		};
		position.set(0);
		await sleep(250);
		while (true) {
			await captureMountedTurns();
			const previousTop = position.get();
			if (previousTop >= position.max() - 1) break;
			const lastTurn = getMountedTurns().at(-1);
			const lastTurnOffset = lastTurn ? lastTurn.getBoundingClientRect().top - scrollRoot.getBoundingClientRect().top : 0;
			position.set(lastTurnOffset > 0 ? previousTop + Math.floor(lastTurnOffset) : position.max());
			await sleep(250);
			if (position.get() <= previousTop) break;
		}
		await captureMountedTurns();
		if (snapshots.size === 0) return null;
		const staticThread = threadEl.cloneNode(false);
		staticThread.removeAttribute("data-chatgpt-conversation-selection-target");
		staticThread.removeAttribute("data-thread-find-target");
		staticThread.setAttribute("data-chatgpt-exporter-screenshot-root", "");
		Object.assign(staticThread.style, {
			position: "absolute",
			left: "-100000px",
			top: "0",
			width: `${threadEl.offsetWidth}px`,
			height: "auto",
			minHeight: "0",
			pointerEvents: "none"
		});
		const style = document.createElement("style");
		style.textContent = `${CJK_FONT_FACES}
        [data-chatgpt-exporter-screenshot-root] {
            color: ${isDarkMode ? "#ececec" : "#0d0d0d"};
            background-color: ${backgroundColor};
        }

        [data-chatgpt-exporter-screenshot-root] [data-virtualized-turn-content] {
            content-visibility: visible !important;
        }

        /* date separators such as "Yesterday 10:08 AM" */
        [data-chatgpt-exporter-screenshot-root] [role="separator"] {
            display: none;
        }

        /* the "Is this conversation helpful so far?" card */
        [data-chatgpt-exporter-screenshot-root] :has(> aside) {
            display: none;
        }

        /* image groups ChatGPT hid for lack of images, left as empty skeletons */
        [data-chatgpt-exporter-screenshot-root] :has(> [class~="group/generated-image-preview"]):not(:has(img)) {
            display: none;
        }

        /* Keep the spacing of the action row and code block headers. */
        [data-chatgpt-exporter-screenshot-root] .turn-action-controls,
        [data-chatgpt-exporter-screenshot-root] [data-markdown-copy="code-block"] button {
            visibility: hidden;
        }
    `;
		staticThread.appendChild(style);
		Array.from(snapshots.values()).sort((a, b) => a.top - b.top).forEach(({ snapshot }) => staticThread.appendChild(snapshot));
		if (document.documentElement.lang) staticThread.lang = document.documentElement.lang;
		effect.add(() => {
			threadEl.after(staticThread);
			return () => staticThread.remove();
		});
		effect.run();
		await matchCjkMetrics(staticThread);
		pinEmojiWidths(staticThread);
		await inlineExternalImages(staticThread, isDarkMode);
		await sleep(100);
		return {
			screenshotEls: splitIntoParts(staticThread, effect),
			backgroundColor
		};
	}
	var MAX_PART_HEIGHT = 32e3;
	function splitIntoParts(staticThread, effect) {
		const maxHeight = MAX_PART_HEIGHT / Math.min(2, MAX_SCREENSHOT_DIMENSION / staticThread.offsetWidth) - 100;
		if (staticThread.scrollHeight <= maxHeight) return [staticThread];
		const style = staticThread.querySelector(":scope > style");
		const groups = [[]];
		let groupHeight = 0;
		Array.from(staticThread.children).forEach((turn) => {
			if (!(turn instanceof HTMLElement) || turn === style) return;
			const height = turn.offsetHeight;
			if (groups.at(-1).length > 0 && groupHeight + height > maxHeight) {
				groups.push([]);
				groupHeight = 0;
			}
			groups.at(-1).push(turn);
			groupHeight += height;
		});
		const parts = groups.map((turns) => {
			const part = staticThread.cloneNode(false);
			if (style) part.appendChild(style.cloneNode(true));
			part.append(...turns);
			return part;
		});
		effect.add(() => {
			staticThread.after(...parts);
			return () => parts.forEach((part) => part.remove());
		});
		effect.run();
		return parts;
	}
	async function prepareLegacyThread(effect, isDarkMode) {
		const conversationTurns = Array.from(document.querySelectorAll("#thread [data-testid^=\"conversation-turn-\"]"));
		const thread = findCommonAncestor(conversationTurns);
		if (!thread || thread.children.length === 0 || thread.scrollHeight < 50) return null;
		const threadEl = thread;
		const turnContainerIds = Array.from(threadEl.querySelectorAll("[data-turn-id-container][data-is-intersecting]")).filter((element) => !!element.querySelector("[data-testid^=\"conversation-turn-\"]") || element.offsetHeight > 0 || !!element.style.getPropertyValue("--last-known-height")).map((element) => element.dataset.turnIdContainer).filter((id) => !!id && id !== "client-created-root");
		effect.add(() => {
			threadEl.setAttribute("data-chatgpt-exporter-screenshot-root", "");
			const style = document.createElement("style");
			style.textContent = `
            [data-chatgpt-exporter-screenshot-root],
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
            /* date separators such as "Yesterday 10:08 AM" */
            [data-chatgpt-exporter-screenshot-root] [role="separator"],
            /* any other elements that are not conversation turns */
            [data-chatgpt-exporter-screenshot-root] > :not([data-turn-id-container]):not([data-testid^="conversation-turn-"]):not(:has([data-testid^="conversation-turn-"])),
            /* hide back to top button */
            button.absolute,
            /* question button */
            .group.absolute > button {
                display: none;
            }

            /* Preserve the action row's spacing while hiding its toolbar. */
            [data-testid^="conversation-turn-"] [role="group"]:has([data-testid="copy-turn-action-button"]),
            /* code block buttons */
            #thread pre button {
                visibility: hidden;
            }

            /* Later user turns currently have much larger top padding than the first one. */
            [data-testid^="conversation-turn-"][data-turn="user"] > h4 + div {
                padding-top: 0 !important;
            }
            `;
			threadEl.appendChild(style);
			return () => {
				style.remove();
				threadEl.removeAttribute("data-chatgpt-exporter-screenshot-root");
			};
		});
		const scrollRoot = threadEl.closest("[data-scroll-root]");
		if (scrollRoot) effect.add(() => {
			const scrollTop = scrollRoot.scrollTop;
			const scrollLeft = scrollRoot.scrollLeft;
			const overflowAnchor = scrollRoot.style.overflowAnchor;
			scrollRoot.style.overflowAnchor = "none";
			return () => {
				scrollRoot.style.overflowAnchor = overflowAnchor;
				scrollRoot.scrollTop = scrollTop;
				scrollRoot.scrollLeft = scrollLeft;
			};
		});
		effect.run();
		const turnSnapshots = new Map();
		if (scrollRoot && turnContainerIds.length > 0) for (const turnContainerId of turnContainerIds) {
			for (let pass = 0; pass < 10; pass++) {
				const container = Array.from(threadEl.querySelectorAll("[data-turn-id-container][data-is-intersecting]")).find((element) => element.dataset.turnIdContainer === turnContainerId);
				if (!container) break;
				if (container.querySelector("[data-testid^=\"conversation-turn-\"]")) {
					turnSnapshots.set(turnContainerId, container.cloneNode(true));
					break;
				}
				scrollElementWithinRoot(scrollRoot, container, "center");
				await sleep(250);
			}
			if (!turnSnapshots.has(turnContainerId)) {
				const placeholder = Array.from(threadEl.querySelectorAll("[data-turn-id-container][data-is-intersecting]")).find((element) => element.dataset.turnIdContainer === turnContainerId);
				if (placeholder) turnSnapshots.set(turnContainerId, placeholder.cloneNode(true));
			}
		}
		else if (scrollRoot && conversationTurns[0]) {
			scrollElementWithinRoot(scrollRoot, conversationTurns[0], "start");
			await sleep(250);
		}
		await sleep(500);
		let screenshotEl = threadEl;
		if (turnSnapshots.size > 0) {
			const staticThread = threadEl.cloneNode(false);
			staticThread.setAttribute("data-chatgpt-exporter-screenshot-root", "");
			staticThread.style.position = "absolute";
			staticThread.style.left = "-100000px";
			staticThread.style.top = "0";
			staticThread.style.width = `${threadEl.offsetWidth}px`;
			staticThread.style.height = "auto";
			staticThread.style.minHeight = "0";
			staticThread.style.maxHeight = "none";
			staticThread.style.overflow = "visible";
			staticThread.style.pointerEvents = "none";
			for (const turnContainerId of turnContainerIds) {
				const snapshot = turnSnapshots.get(turnContainerId);
				if (snapshot) staticThread.appendChild(snapshot);
			}
			effect.add(() => {
				document.body.appendChild(staticThread);
				return () => staticThread.remove();
			});
			effect.run();
			screenshotEl = staticThread;
			await sleep(100);
		}
		return {
			screenshotEls: [screenshotEl],
			backgroundColor: isDarkMode ? "#212121" : "#fff"
		};
	}
	async function exportToPng(fileNameFormat) {
		if (!checkIfConversationStarted()) {
			alert(i18n.t("Please start a conversation first"));
			return false;
		}
		const effect = new Effect();
		const isDarkMode = getColorScheme() === "dark";
		const redesignedThread = document.querySelector(REDESIGNED_THREAD_SELECTOR);
		const source = redesignedThread ? await prepareRedesignedThread(redesignedThread, effect, isDarkMode) : await prepareLegacyThread(effect, isDarkMode);
		if (!source) {
			effect.dispose();
			alert(i18n.t("Failed to export to PNG. Failed to find the element node."));
			return false;
		}
		const { screenshotEls, backgroundColor } = source;
		const pngs = [];
		for (const screenshotEl of screenshotEls) {
			const png = await renderPng(screenshotEl, effect, backgroundColor);
			if (!png) {
				effect.dispose();
				alert("Failed to export to PNG. This might be caused by the size of the conversation. Please try to export a smaller conversation.");
				return false;
			}
			pngs.push(png);
		}
		effect.dispose();
		const chatId = getChatIdFromUrl() || void 0;
		const fileName = getFileNameWithFormat(fileNameFormat, "png", { chatId });
		if (pngs.length === 1) {
			downloadFile(fileName, "image/png", pngs[0]);
			return true;
		}
		const zip = new jszip.default();
		const baseName = fileName.replace(/\.png$/, "");
		const digits = String(pngs.length).length;
		pngs.forEach((png, index) => {
			zip.file(`${baseName}-${String(index + 1).padStart(digits, "0")}.png`, png);
		});
		const blob = await zip.generateAsync({
			type: "blob",
			compression: "STORE"
		});
		downloadFile(getFileNameWithFormat(fileNameFormat, "zip", { chatId }), "application/zip", blob);
		return true;
	}
	async function renderPng(screenshotEl, effect, backgroundColor) {
		effect.add(() => {
			const minHeight = screenshotEl.style.minHeight;
			screenshotEl.style.minHeight = `${screenshotEl.scrollHeight}px`;
			return () => {
				screenshotEl.style.minHeight = minHeight;
			};
		});
		effect.run();
		await sleep(0);
		const width = Math.max(screenshotEl.offsetWidth, screenshotEl.scrollWidth);
		const height = Math.max(screenshotEl.offsetHeight, screenshotEl.scrollHeight);
		let capture = null;
		try {
			capture = await (0, _zumer_snapdom.snapdom)(screenshotEl, {
				embedFonts: true,
				reconcile: true,
				plugins: [growUserBubbles],
				backgroundColor
			});
		} catch (error) {
			console.error("Failed to capture screenshot DOM", error);
		}
		const sourceWidth = capture?.meta.vbW || width;
		const sourceHeight = capture?.meta.vbH || height;
		const requestedScale = Math.min(2, MAX_SCREENSHOT_DIMENSION / sourceWidth);
		const desiredWidth = Math.max(1, Math.floor(sourceWidth * requestedScale));
		const desiredScale = desiredWidth / sourceWidth;
		const desiredHeight = Math.max(1, Math.floor(sourceHeight * desiredScale));
		const takeTiledScreenshot = async () => {
			if (!capture) {
				console.warn("[ChatGPT Exporter:screenshot] tiled capture unavailable");
				return null;
			}
			if (typeof CompressionStream === "undefined") {
				console.warn("[ChatGPT Exporter:screenshot] CompressionStream unavailable; using downscaled fallback");
				return null;
			}
			const tileHeight = Math.max(1, Math.min(MAX_SCREENSHOT_DIMENSION, Math.floor(MAX_TILE_PIXELS / desiredWidth)));
			try {
				return await encodePng(desiredWidth, async (appendRows) => {
					for (let targetY = 0; targetY < desiredHeight; targetY += tileHeight) {
						const targetTileHeight = Math.min(tileHeight, desiredHeight - targetY);
						const sourceY = sourceHeight * targetY / desiredHeight;
						const sourceBottom = sourceHeight * (targetY + targetTileHeight) / desiredHeight;
						const canvas = await capture.toCanvas({
							crop: {
								x: 0,
								y: sourceY,
								width: sourceWidth,
								height: sourceBottom - sourceY
							},
							scale: desiredScale,
							dpr: 1,
							backgroundColor
						});
						if (canvas.width !== desiredWidth) throw new Error(`Unexpected screenshot tile width: ${canvas.width}`);
						const context = canvas.getContext("2d", { willReadFrequently: true });
						if (!context) throw new Error("Failed to read screenshot tile");
						await appendRows(context.getImageData(0, 0, canvas.width, canvas.height));
						canvas.width = 1;
						canvas.height = 1;
					}
				});
			} catch (error) {
				console.error("Failed to encode tiled screenshot", error);
				return null;
			}
		};
		const passLimit = 10;
		const takeDownscaledScreenshot = async (additionalScale = 1, currentPass = 1) => {
			if (!capture) return null;
			const scale = Math.min(requestedScale, MAX_SCREENSHOT_DIMENSION / sourceWidth, MAX_SCREENSHOT_DIMENSION / sourceHeight) * additionalScale;
			const targetWidth = Math.max(1, Math.floor(sourceWidth * scale));
			const targetHeight = Math.max(1, Math.floor(sourceHeight * scale));
			let canvas = null;
			try {
				canvas = await capture.toCanvas({
					scale,
					dpr: 1,
					backgroundColor
				});
				const context = canvas.getContext("2d");
				if (context) context.imageSmoothingEnabled = false;
				const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png", 1));
				if (blob) return blob;
			} catch (error) {
				console.error("Failed to take screenshot", error);
			}
			console.log(`ChatGPT Exporter:takeScreenshot with height=${height} width=${width} targetHeight=${targetHeight} targetWidth=${targetWidth}`);
			if (currentPass > passLimit) return null;
			return takeDownscaledScreenshot(additionalScale / 1.4, currentPass + 1);
		};
		const shouldTile = desiredHeight > MAX_SCREENSHOT_DIMENSION || desiredWidth * desiredHeight > MAX_SCREENSHOT_DIMENSION * MAX_SCREENSHOT_DIMENSION;
		let png = shouldTile ? await takeTiledScreenshot() : await takeDownscaledScreenshot();
		if (!png && shouldTile) {
			console.warn("[ChatGPT Exporter:screenshot] tiled export failed; using downscaled fallback");
			png = await takeDownscaledScreenshot();
		}
		return png;
	}
	function convertMessageToTavern(node) {
		if (!node.message || shouldSkipMessageInExport(node.message) || node.message.content.content_type !== "text") return null;
		const authorRole = node.message.author.role;
		const createTime = node.message.create_time || new Date().getTime() / 1e3;
		const text = node.message.content.parts.join("\n");
		return {
			name: authorRole === "assistant" ? "Assistant" : "You",
			is_user: authorRole === "user",
			is_name: authorRole === "assistant",
			send_date: createTime,
			mes: text,
			swipes: [text],
			swipe_id: 0
		};
	}
	function convertToTavern(conversation) {
		return jsonlStringify([{
			user_name: "You",
			character_name: "Assistant"
		}, ...conversation.conversationNodes.map(convertMessageToTavern).filter(nonNullable)]);
	}
	function convertToOoba(conversation) {
		const pairs = [];
		const messages = conversation.conversationNodes.filter((node) => {
			return !!node.message && !shouldSkipMessageInExport(node.message) && node.message.content.content_type === "text";
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
			const text = message.message.content.parts.join("\n");
			const nextRole = nextMessage.message.author.role;
			const nextText = nextMessage.message.content.parts.join("\n");
			if (role === "system") {
				if (text !== "") pairs.push(["<|BEGIN-VISIBLE-CHAT|>", text]);
				idx += 1;
				continue;
			}
			if (role === "user") {
				if (nextRole === "assistant") {
					pairs.push([text, nextText]);
					idx += 2;
					continue;
				} else if (nextRole === "user") {
					pairs.push([text, ""]);
					idx += 1;
					continue;
				}
			}
			if (role === "assistant") {
				pairs.push(["", text]);
				idx += 1;
			}
		}
		const oobaData = {
			internal: pairs,
			visible: JSON.parse(JSON.stringify(pairs))
		};
		if (oobaData.visible[0] && oobaData.visible[0][0] === "<|BEGIN-VISIBLE-CHAT|>") oobaData.visible[0][0] = "";
		return JSON.stringify(oobaData, null, 2);
	}
	async function exportToJson(fileNameFormat) {
		if (!checkIfConversationStarted()) {
			alert(i18n.t("Please start a conversation first"));
			return false;
		}
		if (!checkIfTemporaryChatIsExportable()) {
			alert(i18n.t("Temporary chat could not be captured"));
			return false;
		}
		const chatId = await getCurrentChatId();
		const rawConversation = await fetchConversation(chatId);
		downloadFile(getFileNameWithFormat(fileNameFormat, "json", {
			title: rawConversation.title || "ChatGPT Conversation",
			chatId
		}), "application/json", conversationToJson([rawConversation]));
		return true;
	}
	async function exportToTavern(fileNameFormat) {
		if (!checkIfConversationStarted()) {
			alert(i18n.t("Please start a conversation first"));
			return false;
		}
		if (!checkIfTemporaryChatIsExportable()) {
			alert(i18n.t("Temporary chat could not be captured"));
			return false;
		}
		const chatId = await getCurrentChatId();
		const conversation = processConversation(await fetchConversation(chatId));
		downloadFile(getFileNameWithFormat(`${fileNameFormat}.tavern`, "jsonl", {
			title: conversation.title,
			chatId
		}), "application/json-lines", convertToTavern(conversation));
		return true;
	}
	async function exportToOoba(fileNameFormat) {
		if (!checkIfConversationStarted()) {
			alert(i18n.t("Please start a conversation first"));
			return false;
		}
		if (!checkIfTemporaryChatIsExportable()) {
			alert(i18n.t("Temporary chat could not be captured"));
			return false;
		}
		const chatId = await getCurrentChatId();
		const conversation = processConversation(await fetchConversation(chatId));
		downloadFile(getFileNameWithFormat(`${fileNameFormat}.ooba`, "json", {
			title: conversation.title,
			chatId
		}), "application/json", convertToOoba(conversation));
		return true;
	}
	async function exportAllToOfficialJson(_fileNameFormat, apiConversations, _metaList, projectName, partIndex, totalParts) {
		const partInfo = partIndex != null && totalParts != null ? {
			part: partIndex,
			total: totalParts
		} : void 0;
		const content = conversationToJson(apiConversations);
		downloadFile(buildJsonBatchFileName(projectName, partInfo), "application/json", content);
		return true;
	}
	async function exportAllToJson(fileNameFormat, apiConversations, _metaList, projectName, partIndex, totalParts) {
		const zip = new jszip.default();
		const filenameMap = new Map();
		apiConversations.forEach((rawConversation) => {
			let fileName = getFileNameWithFormat(fileNameFormat, "json", {
				title: rawConversation.title || "ChatGPT Conversation",
				chatId: rawConversation.id,
				createTime: rawConversation.create_time,
				updateTime: rawConversation.update_time
			});
			if (filenameMap.has(fileName)) {
				const count = filenameMap.get(fileName) ?? 1;
				filenameMap.set(fileName, count + 1);
				fileName = `${fileName.slice(0, -5)} (${count}).json`;
			} else filenameMap.set(fileName, 1);
			const content = conversationToJson(rawConversation);
			zip.file(fileName, content);
		});
		const blob = await zip.generateAsync({
			type: "blob",
			compression: "DEFLATE",
			compressionOptions: { level: 9 }
		});
		downloadFile(buildZipFileName("json", projectName, partIndex != null && totalParts != null ? {
			part: partIndex,
			total: totalParts
		} : void 0), "application/zip", blob);
		return true;
	}
	function conversationToJson(conversation) {
		return JSON.stringify(conversation);
	}
	async function exportToMarkdown(fileNameFormat, metaList) {
		if (!checkIfConversationStarted()) {
			alert(i18n.t("Please start a conversation first"));
			return false;
		}
		if (!checkIfTemporaryChatIsExportable()) {
			alert(i18n.t("Temporary chat could not be captured"));
			return false;
		}
		const chatId = await getCurrentChatId();
		const conversation = processConversation(await withImageAssets(await fetchConversation(chatId)), { enableThinking: ScriptStorage.get("exporter:enable_thinking") ?? false });
		const markdown = conversationToMarkdown(conversation, metaList);
		downloadFile(getFileNameWithFormat(fileNameFormat, "md", {
			title: conversation.title,
			chatId,
			createTime: conversation.createTime,
			updateTime: conversation.updateTime
		}), "text/markdown", standardizeLineBreaks(markdown));
		return true;
	}
	async function exportAllToMarkdown(fileNameFormat, apiConversations, metaList, projectName, partIndex, totalParts) {
		const zip = new jszip.default();
		const filenameMap = new Map();
		const enableThinking = ScriptStorage.get("exporter:enable_thinking") ?? false;
		apiConversations.map((x) => processConversation(x, { enableThinking })).forEach((conversation) => {
			let fileName = getFileNameWithFormat(fileNameFormat, "md", {
				title: conversation.title,
				chatId: conversation.id,
				createTime: conversation.createTime,
				updateTime: conversation.updateTime
			});
			if (filenameMap.has(fileName)) {
				const count = filenameMap.get(fileName) ?? 1;
				filenameMap.set(fileName, count + 1);
				fileName = `${fileName.slice(0, -3)} (${count}).md`;
			} else filenameMap.set(fileName, 1);
			const content = conversationToMarkdown(conversation, metaList);
			zip.file(fileName, content);
		});
		const blob = await zip.generateAsync({
			type: "blob",
			compression: "DEFLATE",
			compressionOptions: { level: 9 }
		});
		downloadFile(buildZipFileName("markdown", projectName, partIndex != null && totalParts != null ? {
			part: partIndex,
			total: totalParts
		} : void 0), "application/zip", blob);
		return true;
	}
	function conversationToMarkdown(conversation, metaList) {
		const { id, title, conversationNodes } = conversation;
		const _metaList = resolveMetaList(metaList, getMetaVariables(conversation, `${baseUrl}/c/${id}`)).map(([name, val]) => `${name}: ${val}`);
		const frontMatter = _metaList.length > 0 ? `---\n${_metaList.join("\n")}\n---\n\n` : "";
		const enableTimestamp = ScriptStorage.get("exporter:enable_timestamp") ?? false;
		const timeStampMarkdown = ScriptStorage.get("exporter:timestamp_markdown") ?? false;
		const timeStamp24H = ScriptStorage.get("exporter:timestamp_24h") ?? false;
		const enableSources = ScriptStorage.get("exporter:enable_sources") ?? true;
		return `${frontMatter}# ${title}\n\n${conversationNodes.map(({ message, thinking }) => {
			if (!message || !message.content) return null;
			if (shouldSkipMessageInExport(message)) return null;
			const timestamp = message?.create_time ?? "";
			const showTimestamp = enableTimestamp && timeStampMarkdown && timestamp;
			let timestampHtml = "";
			if (showTimestamp) {
				const date = new Date(timestamp * 1e3);
				const conversationTime = date.toLocaleTimeString("en-US", {
					hour: "2-digit",
					minute: "2-digit",
					hour12: !timeStamp24H
				});
				timestampHtml = `<time datetime="${date.toISOString()}" title="${date.toLocaleString()}">${conversationTime}</time>\n\n`;
			}
			const author = transformAuthor(message.author);
			const thinkingBlock = thinking ? formatThinkingMarkdown(thinking) : "";
			const postSteps = [];
			if (message.author.role === "assistant") {
				postSteps.push((input) => transformContentReferences(input, message.metadata, {
					includeSourceList: enableSources,
					sourceListLabel: i18n.t("Sources")
				}));
				postSteps.push((input) => transformFootNotes$1(input, message.metadata));
			}
			if (message.author.role === "assistant") postSteps.push((input) => {
				const { text, restore } = protectMath(input);
				return restore(toMarkdown(fromMarkdown(text)));
			});
			const postProcess = (input) => postSteps.reduce((acc, fn) => fn(acc), input);
			const content = transformContent$1(message.content, message.metadata, postProcess);
			const attachments = getFileAttachmentNames(message).map((name) => `- 📎 ${name}`).join("\n");
			const attachmentsBlock = attachments ? `\n\n${attachments}` : "";
			return `#### ${author}:\n${timestampHtml}${thinkingBlock}${content}${attachmentsBlock}`;
		}).filter(Boolean).join("\n\n")}`;
	}
	function transformFootNotes$1(input, metadata) {
		const footNoteMarkRegex = /【(\d+)†\((.+?)\)】/g;
		const citationList = [];
		return `${input.replace(footNoteMarkRegex, (match, citeIndex, _evidenceText) => {
			const citation = metadata?.citations?.find((cite) => cite.metadata?.extra?.cited_message_idx === +citeIndex);
			if (citation) {
				citationList.push(citation);
				return `[^${citeIndex}]`;
			}
			return match;
		})}\n\n${citationList.map((citation) => {
			return `[^${citation.metadata?.extra?.cited_message_idx ?? 1}]: ${citation.metadata?.title ?? "No title"}`;
		}).join("\n")}`;
	}
	function transformContent$1(content, metadata, postProcess) {
		switch (content.content_type) {
			case "text": return postProcess(content.parts?.join("\n") || "");
			case "code": return postProcess(`Code:\n\`\`\`\n${content.text}\n\`\`\``);
			case "execution_output":
				if (metadata?.aggregate_result?.messages) return metadata.aggregate_result.messages.filter((msg) => msg.message_type === "image").map((msg) => `![image](${msg.image_url})`).join("\n");
				return postProcess(`Result:\n\`\`\`\n${content.text}\n\`\`\`` || "");
			case "tether_quote": return postProcess(`> ${content.title || content.text || ""}`);
			case "tether_browsing_code": return postProcess("");
			case "tether_browsing_display": {
				const metadataList = metadata?._cite_metadata?.metadata_list;
				if (Array.isArray(metadataList) && metadataList.length > 0) return postProcess(metadataList.map(({ title, url }) => `> [${title}](${url})`).join("\n"));
				return postProcess("");
			}
			case "multimodal_text": return content.parts?.map((part) => {
				if (typeof part === "string") return postProcess(part);
				if (part.content_type === "image_asset_pointer") return `![image](${part.asset_pointer})`;
				if (part.content_type === "audio_transcription") return `[audio] ${part.text}`;
				if (part.content_type === "audio_asset_pointer") return null;
				if (part.content_type === "real_time_user_audio_video_asset_pointer") return null;
				return postProcess("[Unsupported multimodal content]");
			}).join("\n") || "";
			default:
				console.warn("[Exporter] Unsupported Content:", content.content_type, content);
				return postProcess(`[Unsupported Content: ${content.content_type}]`);
		}
	}
	function formatThinkingMarkdown(thinking) {
		const durationLabel = thinking.durationSeconds != null ? `Thought for ${thinking.durationSeconds} seconds` : "Thinking";
		const parts = [];
		if (thinking.activities?.length) parts.push(thinking.activities.map((a) => `- ${a}`).join("\n"));
		const thoughts = thinking.thoughts.map((t) => t.content || t.summary).filter(Boolean).join("\n\n");
		if (thoughts) parts.push(thoughts);
		const body = parts.join("\n\n");
		if (!body) return "";
		return `<details>\n<summary>${durationLabel}</summary>\n\n${body}\n\n</details>\n\n`;
	}
	function copyToClipboard(text) {
		try {
			navigator.clipboard.writeText(text);
		} catch {
			const textarea = document.createElement("textarea");
			textarea.value = text;
			document.body.appendChild(textarea);
			textarea.select();
			document.execCommand("copy");
			document.body.removeChild(textarea);
		}
	}
	async function exportToText() {
		if (!checkIfConversationStarted()) {
			alert(i18n.t("Please start a conversation first"));
			return false;
		}
		if (!checkIfTemporaryChatIsExportable()) {
			alert(i18n.t("Temporary chat could not be captured"));
			return false;
		}
		const { conversationNodes } = processConversation(await fetchConversation(await getCurrentChatId()));
		copyToClipboard(standardizeLineBreaks(conversationNodes.map(({ message }) => transformMessage(message)).filter(Boolean).join("\n\n")));
		return true;
	}
	function transformMessage(message) {
		if (!message || !message.content) return null;
		if (shouldSkipMessageInExport(message)) return null;
		const author = transformAuthor(message.author);
		let content = transformContent(message.content, message.metadata);
		if (message.author.role === "assistant") {
			content = transformContentReferences(content, message.metadata, {
				output: "text",
				inlineReferenceMode: "alt",
				includeSourceList: false
			});
			content = transformFootNotes(content, message.metadata);
		}
		if (message.author.role === "assistant" && content) {
			const { text, restore } = protectMath(content);
			content = restore(reformatContent(text));
		}
		return `${author}:\n${content}`;
	}
	function transformContent(content, metadata) {
		switch (content.content_type) {
			case "text": return content.parts?.join("\n") || "";
			case "code": return content.text || "";
			case "execution_output":
				if (metadata?.aggregate_result?.messages) return metadata.aggregate_result.messages.filter((msg) => msg.message_type === "image").map(() => "[image]").join("\n");
				return content.text || "";
			case "tether_quote": return `> ${content.title || content.text || ""}`;
			case "tether_browsing_code": return "";
			case "tether_browsing_display": {
				const metadataList = metadata?._cite_metadata?.metadata_list;
				if (Array.isArray(metadataList) && metadataList.length > 0) return metadataList.map(({ title, url }) => `> [${title}](${url})`).join("\n");
				return "";
			}
			case "multimodal_text": return content.parts?.map((part) => {
				if (typeof part === "string") return part;
				if (part.content_type === "image_asset_pointer") return "[image]";
				if (part.content_type === "audio_transcription") return `[audio] ${part.text}`;
				if (part.content_type === "audio_asset_pointer") return null;
				if (part.content_type === "real_time_user_audio_video_asset_pointer") return null;
				return "[Unsupported multimodal content]";
			}).join("\n") || "";
			default:
				console.warn("[Exporter] Unsupported Content:", content.content_type, content);
				return "[Unsupported Content]";
		}
	}
	function reformatContent(input) {
		const root = fromMarkdown(input);
		flatMap(root, (item) => {
			if (item.type === "strong") return item.children;
			if (item.type === "emphasis") return item.children;
			return [item];
		});
		const result = toMarkdown(root);
		if (result.startsWith("\\[") && input.startsWith("[")) return result.slice(1);
		return result;
	}
	function transformFootNotes(input, metadata) {
		return input.replace(/【(\d+)†\((.+?)\)】/g, (match, citeIndex, _evidenceText) => {
			if (metadata?.citations?.find((cite) => cite.metadata?.extra?.cited_message_idx === +citeIndex)) return "";
			return match;
		});
	}
	function useWindowResize(selector) {
		return En(subscribe$1, selector);
	}
	function subscribe$1(callback) {
		window.addEventListener("resize", callback);
		return () => window.removeEventListener("resize", callback);
	}
	var _ = 0;
	function o(o, e, n, t, f, l) {
		var s, u, a = {};
		for (u in e) "ref" == u ? s = e[u] : a[u] = e[u];
		var i = {
			type: o,
			props: a,
			key: n,
			ref: s,
			__k: null,
			__: null,
			__b: 0,
			__e: null,
			__d: void 0,
			__c: null,
			__h: null,
			constructor: void 0,
			__v: --_,
			__source: f,
			__self: l
		};
		if ("function" == typeof o && (s = o.defaultProps)) for (u in s) void 0 === a[u] && (a[u] = s[u]);
		return l$1.vnode && l$1.vnode(i), i;
	}
	function Dialog({ open, ...props }) {
		if (!open) return null;
		return z(o(OpenDialog, { ...props }), document.body);
	}
	function OpenDialog({ onOpenChange, title, className, style, children }) {
		const ref = _$1(null);
		const titleId = V$1();
		const mounted = _$1(true);
		y(() => {
			const dialog = ref.current;
			mounted.current = true;
			dialog.showModal();
			dialog.focus();
			return () => {
				mounted.current = false;
				dialog.close();
			};
		}, []);
		const onOpenChangeRef = _$1(onOpenChange);
		onOpenChangeRef.current = onOpenChange;
		const close = () => onOpenChangeRef.current(false);
		p$1(() => {
			const onBackdropClick = (e) => {
				e.stopPropagation();
				close();
			};
			const onPointerDown = (e) => {
				document.removeEventListener("click", onBackdropClick, true);
				const rect = ref.current.getBoundingClientRect();
				if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) return;
				e.stopPropagation();
				if (e.pointerType === "touch") {
					document.addEventListener("click", onBackdropClick, {
						once: true,
						capture: true
					});
					return;
				}
				close();
			};
			document.addEventListener("pointerdown", onPointerDown, true);
			return () => {
				document.removeEventListener("pointerdown", onPointerDown, true);
				document.removeEventListener("click", onBackdropClick, true);
			};
		}, []);
		const onCancel = (e) => {
			e.preventDefault();
			close();
		};
		const onClose = () => {
			if (!mounted.current) return;
			close();
			requestAnimationFrame(() => {
				const dialog = ref.current;
				if (mounted.current && dialog && !dialog.open) dialog.showModal();
			});
		};
		return o("dialog", {
			ref,
			className: `ce-root ce-dialog ${className ?? ""}`,
			style,
			"aria-labelledby": titleId,
			tabIndex: -1,
			onCancel,
			onClose,
			children: [o("h2", {
				id: titleId,
				className: "ce-dialog-title",
				children: title
			}), children]
		});
	}
	var Divider = () => o("div", { className: "ce-divider" });
	async function refreshConversationList(cached, fetchPage, pageSize, maxItems) {
		const known = new Map(cached.map((c) => [c.id, c.update_time]));
		const fresh = [];
		let total = null;
		let offset = 0;
		while (offset < maxItems) {
			const page = await fetchPage(offset, pageSize);
			const items = page.items ?? [];
			total = page.total;
			const firstUnchanged = items.findIndex((c) => known.has(c.id) && known.get(c.id) === c.update_time);
			if (firstUnchanged !== -1) {
				fresh.push(...items.slice(0, firstUnchanged));
				break;
			}
			fresh.push(...items);
			if (items.length < pageSize) break;
			offset += pageSize;
		}
		return {
			head: fresh,
			total
		};
	}
	function applyHead(head, items) {
		if (head.length === 0) return items;
		const headIds = new Set(head.map((c) => c.id));
		return [...head, ...items.filter((c) => !headIds.has(c.id))];
	}
	function mitt_default(n) {
		return {
			all: n = n || new Map(),
			on: function(t, e) {
				var i = n.get(t);
				i ? i.push(e) : n.set(t, [e]);
			},
			off: function(t, e) {
				var i = n.get(t);
				i && (e ? i.splice(i.indexOf(e) >>> 0, 1) : n.set(t, []));
			},
			emit: function(t, e) {
				var i = n.get(t);
				i && i.slice().map(function(n) {
					n(e);
				}), (i = n.get("*")) && i.slice().map(function(n) {
					n(t, e);
				});
			}
		};
	}
	var MAX_RETRIES = 5;
	var DEFAULT_429_PAUSE_MS = 6e4;
	var MAX_429_PAUSE_MS = 3e5;
	var RequestQueue = class {
		minBackoff;
		maxBackoff;
		eventEmitter = mitt_default();
		queue = [];
		results = [];
		skipped = [];
		status = "IDLE";
		backoffMultiplier = 2;
		backoff;
		total = 0;
		completed = 0;
		pauseUntil = 0;
		batchPauses = 0;
		runId = 0;
		constructor(minBackoff, maxBackoff) {
			this.minBackoff = minBackoff;
			this.maxBackoff = maxBackoff;
			this.backoff = minBackoff;
		}
		add(requestObject) {
			this.queue.push({
				...requestObject,
				retries: 0,
				rateRetries: 0
			});
		}
		start() {
			if (this.status === "IDLE") {
				this.total = this.queue.length;
				this.process();
			}
		}
		stop() {
			this.runId++;
			const wasRunning = this.status === "IN_PROGRESS";
			this.status = "STOPPED";
			if (wasRunning) this.eventEmitter.emit("done", this.results);
		}
		clear() {
			this.runId++;
			this.queue = [];
			this.results = [];
			this.skipped = [];
			this.status = "IDLE";
			this.backoff = this.minBackoff;
			this.pauseUntil = 0;
			this.batchPauses = 0;
			this.total = 0;
			this.completed = 0;
		}
		getSkipped() {
			return this.skipped;
		}
		on(event, fn) {
			this.eventEmitter.on(event, fn);
			return () => this.eventEmitter.off(event, fn);
		}
		async process() {
			if (this.status === "STOPPED" || this.status === "COMPLETED") return;
			if (this.queue.length === 0) {
				this.done();
				return;
			}
			const runId = this.runId;
			const remaining = this.pauseUntil - Date.now();
			if (remaining > 0) {
				const waitSecs = Math.ceil(remaining / 1e3);
				this.progress(this.queue[0].name, "rate_limited", waitSecs);
				await sleep(remaining);
				if (runId !== this.runId) return;
				this.pauseUntil = 0;
			}
			this.status = "IN_PROGRESS";
			const requestObject = this.queue.shift();
			const { name, request } = requestObject;
			let waitMs = this.backoff;
			try {
				this.progress(name, "processing");
				const result = await request();
				if (runId !== this.runId) return;
				this.results.push(result);
				this.completed++;
				this.progress(name, "processing");
				this.backoff = this.minBackoff;
				requestObject.retries = 0;
				if (requestObject.cached) waitMs = 0;
			} catch (error) {
				if (runId !== this.runId) return;
				if (error instanceof RateLimitError) {
					this.batchPauses++;
					const backoffMs = DEFAULT_429_PAUSE_MS * 2 ** (this.batchPauses - 1);
					const pauseMs = Math.max(error.retryAfterMs, Math.min(MAX_429_PAUSE_MS, backoffMs));
					this.pauseUntil = Date.now() + pauseMs;
					this.progress(name, "rate_limited", Math.round(pauseMs / 1e3));
					console.warn(`[Exporter] Rate limited (429). Pausing ${Math.round(pauseMs / 1e3)}s (pause #${this.batchPauses} this batch)`);
					this.queue.unshift(requestObject);
					waitMs = 0;
				} else {
					console.error(`[Exporter] "${name}" failed:`, error);
					requestObject.retries++;
					if (requestObject.retries > MAX_RETRIES) {
						console.warn(`[Exporter] "${name}" skipped after ${MAX_RETRIES} retries`);
						this.skipped.push(name);
						waitMs = 0;
					} else {
						this.backoff = Math.min(this.backoff * this.backoffMultiplier, this.maxBackoff);
						waitMs = this.backoff;
						this.progress(name, "retrying");
						this.queue.unshift(requestObject);
					}
				}
			}
			await sleep(waitMs);
			if (runId !== this.runId) return;
			this.process();
		}
		progress(name, status, rateLimitWaitSecs) {
			this.eventEmitter.emit("progress", {
				total: this.total,
				completed: this.completed,
				currentName: name,
				currentStatus: status,
				rateLimitWaitSecs
			});
		}
		done() {
			this.status = "COMPLETED";
			this.eventEmitter.emit("done", this.results);
		}
	};
	_css(".ce-checkbox {\n    position: relative;\n    display: flex;\n    font-size: 16px;\n    vertical-align: middle;\n}\n\n.ce-checkbox * {\n    cursor: pointer;\n}\n\n.ce-checkbox[disabled] {\n    opacity: 0.7;\n}\n\n.ce-checkbox[disabled] * {\n    cursor: not-allowed;\n}\n\n.ce-checkbox input {\n    position: absolute;\n    opacity: 0;\n    width: 100%;\n    height: 100%;\n    top: 0;\n    left: 0;\n    margin: 0;\n    padding: 0;\n}\n\n.ce-checkbox-icon {\n    display: inline-flex;\n    align-items: center;\n    position: relative;\n    vertical-align: middle;\n    font-size: 1.5rem;\n}\n\n.ce-checkbox input:checked ~ svg {\n    color: var(--ce-accent);\n}\n\n.ce-checkbox-label {\n    margin-left: 0.5rem;\n    font-size: 1rem;\n    line-height: 1.5;\n}\n");
	function FileCode() {
		return o("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 384 512",
			className: "ce-icon",
			fill: "currentColor",
			children: o("path", { d: "M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM153 289l-31 31 31 31c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L71 337c-9.4-9.4-9.4-24.6 0-33.9l48-48c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9zM265 255l48 48c9.4 9.4 9.4 24.6 0 33.9l-48 48c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l31-31-31-31c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0z" })
		});
	}
	function IconCamera() {
		return o("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 512 512",
			className: "ce-icon",
			fill: "currentColor",
			children: o("path", { d: "M149.1 64.8L138.7 96H64C28.7 96 0 124.7 0 160V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H373.3L362.9 64.8C356.4 45.2 338.1 32 317.4 32H194.6c-20.7 0-39 13.2-45.5 32.8zM256 384c-53 0-96-43-96-96s43-96 96-96s96 43 96 96s-43 96-96 96z" })
		});
	}
	function IconMarkdown() {
		return o("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 640 512",
			className: "ce-icon",
			fill: "currentColor",
			children: o("path", { d: "M593.8 59.1H46.2C20.7 59.1 0 79.8 0 105.2v301.5c0 25.5 20.7 46.2 46.2 46.2h547.7c25.5 0 46.2-20.7 46.1-46.1V105.2c0-25.4-20.7-46.1-46.2-46.1zM338.5 360.6H277v-120l-61.5 76.9-61.5-76.9v120H92.3V151.4h61.5l61.5 76.9 61.5-76.9h61.5v209.2zm135.3 3.1L381.5 256H443V151.4h61.5V256H566z" })
		});
	}
	function IconCopy() {
		return o("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 512 512",
			className: "ce-icon",
			fill: "currentColor",
			children: o("path", { d: "M502.6 70.63l-61.25-61.25C435.4 3.371 427.2 0 418.7 0H255.1c-35.35 0-64 28.66-64 64l.0195 256C192 355.4 220.7 384 256 384h192c35.2 0 64-28.8 64-64V93.25C512 84.77 508.6 76.63 502.6 70.63zM464 320c0 8.836-7.164 16-16 16H255.1c-8.838 0-16-7.164-16-16L239.1 64.13c0-8.836 7.164-16 16-16h128L384 96c0 17.67 14.33 32 32 32h47.1V320zM272 448c0 8.836-7.164 16-16 16H63.1c-8.838 0-16-7.164-16-16L47.98 192.1c0-8.836 7.164-16 16-16H160V128H63.99c-35.35 0-64 28.65-64 64l.0098 256C.002 483.3 28.66 512 64 512h192c35.2 0 64-28.8 64-64v-32h-47.1L272 448z" })
		});
	}
	function IconArrowRightFromBracket() {
		return o("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 576 512",
			className: "ce-icon",
			fill: "currentColor",
			children: o("path", { d: "M534.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L434.7 224 224 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM192 96c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-53 0-96 43-96 96l0 256c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z" })
		});
	}
	function IconSetting() {
		return o("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 15 15",
			className: "ce-icon",
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
			className: "ce-icon-md",
			style: {
				marginInline: "-2px",
				marginTop: "2px"
			},
			"stroke-width": "2",
			stroke: "currentColor",
			fill: "none",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			children: [
				o("path", {
					stroke: "none",
					d: "M0 0h24v24H0z",
					fill: "none"
				}),
				o("path", { d: "M20 16v-8l3 8v-8" }),
				o("path", { d: "M15 8a2 2 0 0 1 2 2v4a2 2 0 1 1 -4 0v-4a2 2 0 0 1 2 -2z" }),
				o("path", { d: "M1 8h3v6.5a1.5 1.5 0 0 1 -3 0v-.5" }),
				o("path", { d: "M7 15a1 1 0 0 0 1 1h1a1 1 0 0 0 1 -1v-2a1 1 0 0 0 -1 -1h-1a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1h1a1 1 0 0 1 1 1" })
			]
		});
	}
	function IconZip() {
		return o("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 24 24",
			className: "ce-icon",
			"stroke-width": "2",
			stroke: "currentColor",
			fill: "none",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			children: [
				o("path", {
					stroke: "none",
					d: "M0 0h24v24H0z",
					fill: "none"
				}),
				o("path", { d: "M6 20.735a2 2 0 0 1 -1 -1.735v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-1" }),
				o("path", { d: "M11 17a2 2 0 0 1 2 2v2a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-2a2 2 0 0 1 2 -2z" }),
				o("path", { d: "M11 5l-1 0" }),
				o("path", { d: "M13 7l-1 0" }),
				o("path", { d: "M11 9l-1 0" }),
				o("path", { d: "M13 11l-1 0" }),
				o("path", { d: "M11 13l-1 0" }),
				o("path", { d: "M13 15l-1 0" })
			]
		});
	}
	function IconLoading({ className, style }) {
		return o("span", {
			style: {
				display: "inline-flex",
				animation: "1.4s linear 0s infinite normal none running ce-rotate"
			},
			children: o("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				viewBox: "22 22 44 44",
				className,
				style: {
					animation: "1.4s ease-in-out 0s infinite normal none running ce-circular-dash",
					...style
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
			style: {
				width: "1em",
				height: "1em",
				display: "inline-block"
			},
			fill: "currentColor",
			children: o("path", { d: "M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" })
		});
	}
	function IconCheckBoxChecked({ className }) {
		return o("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 24 24",
			className,
			style: {
				width: "1em",
				height: "1em",
				display: "inline-block"
			},
			fill: "currentColor",
			children: o("path", { d: "M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" })
		});
	}
	function IconTrash({ className, style }) {
		return o("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 24 24",
			className,
			style,
			fill: "none",
			"stroke-linecap": "round",
			"stroke-linejoin": "round",
			children: [
				o("path", {
					stroke: "none",
					d: "M0 0h24v24H0z",
					fill: "none"
				}),
				o("path", {
					d: "M20 6a1 1 0 0 1 .117 1.993l-.117 .007h-.081l-.919 11a3 3 0 0 1 -2.824 2.995l-.176 .005h-8c-1.598 0 -2.904 -1.249 -2.992 -2.75l-.005 -.167l-.923 -11.083h-.08a1 1 0 0 1 -.117 -1.993l.117 -.007h16z",
					"stroke-width": "0",
					fill: "currentColor"
				}),
				o("path", {
					d: "M14 2a2 2 0 0 1 2 2a1 1 0 0 1 -1.993 .117l-.007 -.117h-4l-.007 .117a1 1 0 0 1 -1.993 -.117a2 2 0 0 1 1.85 -1.995l.15 -.005h4z",
					"stroke-width": "0",
					fill: "currentColor"
				})
			]
		});
	}
	function IconUpload({ className, style }) {
		return o("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 24 24",
			className,
			style,
			fill: "none",
			"stroke-linecap": "round",
			"stroke-linejoin": "round",
			children: [
				o("path", {
					stroke: "none",
					d: "M0 0h24v24H0z",
					fill: "none"
				}),
				o("path", {
					stroke: "currentColor",
					d: "M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"
				}),
				o("path", {
					stroke: "currentColor",
					d: "M7 9l5 -5l5 5"
				}),
				o("path", {
					stroke: "currentColor",
					d: "M12 4l0 12"
				})
			]
		});
	}
	var CheckBox = ({ className, checked = false, disabled, label, onCheckedChange }) => {
		const [isChecked, setChecked] = h(checked);
		const onChange = (e) => {
			const newValue = e.currentTarget.checked;
			setChecked(newValue);
			onCheckedChange?.(newValue);
		};
		p$1(() => {
			setChecked(checked);
		}, [checked]);
		return o("label", {
			className: `ce-checkbox ${className ?? ""}`,
			disabled,
			children: [o("span", {
				className: "ce-checkbox-icon",
				children: [o("input", {
					type: "checkbox",
					checked: isChecked,
					onChange,
					disabled
				}), isChecked ? o(IconCheckBoxChecked, {}) : o(IconCheckBox, {})]
			}), o("span", {
				className: "ce-checkbox-label",
				children: label
			})]
		});
	};
	function useGMStorage(key, initialValue) {
		const [storedValue, setStoredValue] = h(() => ScriptStorage.get(key) ?? initialValue);
		return [storedValue, T$1((value) => {
			setStoredValue(value);
			ScriptStorage.set(key, value);
		}, [key])];
	}
	var defaultFormat = "ChatGPT-{title}";
	var defaultExportAllLimit = 200;
	var defaultExportMetaList = [{
		name: "title",
		value: "{title}"
	}, {
		name: "source",
		value: "{source}"
	}];
	var SettingContext = G({
		format: defaultFormat,
		setFormat: (_) => {},
		enableTimestamp: false,
		setEnableTimestamp: (_) => {},
		timeStamp24H: false,
		setTimeStamp24H: (_) => {},
		enableTimestampHTML: false,
		setEnableTimestampHTML: (_) => {},
		enableTimestampMarkdown: false,
		setEnableTimestampMarkdown: (_) => {},
		enableMeta: false,
		setEnableMeta: (_) => {},
		exportMetaList: defaultExportMetaList,
		setExportMetaList: (_) => {},
		enableThinking: false,
		setEnableThinking: (_) => {},
		enableSources: true,
		setEnableSources: (_) => {},
		exportAllLimit: defaultExportAllLimit,
		setExportAllLimit: (_) => {},
		resetDefault: () => {}
	});
	var SettingProvider = ({ children }) => {
		const [format, setFormat] = useGMStorage(KEY_FILENAME_FORMAT, defaultFormat);
		const [enableTimestamp, setEnableTimestamp] = useGMStorage(KEY_TIMESTAMP_ENABLED, false);
		const [timeStamp24H, setTimeStamp24H] = useGMStorage(KEY_TIMESTAMP_24H, false);
		const [enableTimestampHTML, setEnableTimestampHTML] = useGMStorage(KEY_TIMESTAMP_HTML, false);
		const [enableTimestampMarkdown, setEnableTimestampMarkdown] = useGMStorage(KEY_TIMESTAMP_MARKDOWN, false);
		const [enableMeta, setEnableMeta] = useGMStorage(KEY_META_ENABLED, false);
		const [exportMetaList, setExportMetaList] = useGMStorage(KEY_META_LIST, defaultExportMetaList);
		const [enableThinking, setEnableThinking] = useGMStorage(KEY_THINKING_ENABLED, false);
		const [enableSources, setEnableSources] = useGMStorage(KEY_SOURCES_ENABLED, true);
		const [exportAllLimit, setExportAllLimit] = useGMStorage(KEY_EXPORT_ALL_LIMIT, defaultExportAllLimit);
		const resetDefault = T$1(() => {
			setFormat(defaultFormat);
			setEnableTimestamp(false);
			setEnableMeta(false);
			setExportMetaList(defaultExportMetaList);
			setEnableThinking(false);
			setEnableSources(true);
			setExportAllLimit(defaultExportAllLimit);
		}, [
			setFormat,
			setEnableTimestamp,
			setEnableMeta,
			setExportMetaList,
			setEnableThinking,
			setEnableSources,
			setExportAllLimit
		]);
		const value = F$1(() => ({
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
			enableThinking,
			setEnableThinking,
			enableSources,
			setEnableSources,
			exportAllLimit,
			setExportAllLimit,
			resetDefault
		}), [
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
			enableThinking,
			setEnableThinking,
			enableSources,
			setEnableSources,
			exportAllLimit,
			setExportAllLimit,
			resetDefault
		]);
		return o(SettingContext.Provider, {
			value,
			children
		});
	};
	var useSettingContext = () => q$1(SettingContext);
	var exportingRef = { current: false };
	var conversationCache = new Map();
	var listCache = null;
	function dropFromListCache(removed) {
		if (!listCache) return;
		const ids = new Set(removed.map((c) => c.id));
		listCache = {
			...listCache,
			items: listCache.items.filter((c) => !ids.has(c.id))
		};
	}
	var MAX_SKIPPED_SHOWN = 20;
	function toMs(time) {
		if (time == null) return 0;
		if (typeof time === "number") return time * 1e3;
		return new Date(time).getTime();
	}
	function chunkArray(arr, size) {
		const result = [];
		for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
		return result;
	}
	function formatConvDate(time) {
		if (!time) return "—";
		const ms = typeof time === "number" ? time * 1e3 : new Date(time).getTime();
		if (Number.isNaN(ms) || ms === 0) return "—";
		const d = new Date(ms);
		const diffDays = Math.floor((Date.now() - ms) / 864e5);
		if (diffDays === 0) return "Today";
		if (diffDays === 1) return "Yesterday";
		return d.toLocaleDateString(void 0, {
			year: "numeric",
			month: "short",
			day: "numeric"
		});
	}
	function getExportedUpdateTimes() {
		const stored = ScriptStorage.get(KEY_EXPORTED_UPDATE_TIMES);
		if (stored && typeof stored === "object") return stored;
		return {};
	}
	function markExported(conversations) {
		if (conversations.length === 0) return;
		const map = getExportedUpdateTimes();
		for (const c of conversations) {
			const ms = toMs(c.update_time);
			if (ms > (map[c.id] ?? 0)) map[c.id] = ms;
		}
		ScriptStorage.set(KEY_EXPORTED_UPDATE_TIMES, map);
	}
	function textSearch(title, query) {
		const q = query.trim();
		if (!q) return true;
		const lower = q.toLowerCase();
		if (!lower.includes("*") && !lower.includes("?")) return title.toLowerCase().includes(lower);
		const regexStr = lower.replace(/[\\\^$.|+()[\]{}]/g, "\\$&").replace(/\*/g, ".*").replace(/\?/g, ".");
		try {
			return new RegExp(regexStr).test(title.toLowerCase());
		} catch {
			return title.toLowerCase().includes(lower);
		}
	}
	function describeListLoadError(error) {
		if (error instanceof RateLimitError) return error.retryAfterFromServer ? i18n.t("List Rate Limited Wait", { n: Math.ceil(error.retryAfterMs / 1e3) }) : i18n.t("List Rate Limited");
		if (error instanceof Error && error.message) return error.message;
		return i18n.t("List Load Failed");
	}
	var ProjectSelect = ({ projects, selected, setSelected, disabled, loading }) => {
		const { t } = useTranslation();
		return o("div", {
			className: "ce-project-select",
			children: [t("Select Project"), o("div", {
				className: "ce-hstack",
				children: [loading && o(IconLoading, { className: "ce-icon-sm" }), o("select", {
					disabled,
					className: "ce-select",
					value: selected ?? "",
					onChange: (e) => {
						const val = e.currentTarget.value;
						setSelected(val || null);
					},
					children: [o("option", {
						value: "",
						children: t("All conversations")
					}), projects.map((project) => o("option", {
						value: project.id,
						children: project.display.name
					}, project.id))]
				})]
			})]
		});
	};
	var ConversationSelect = ({ conversations, selected, setSelected, disabled, loading, error }) => {
		const { t } = useTranslation();
		const [query, setQuery] = h("");
		const lastClickedIndex = _$1(-1);
		const [sortField, setSortField] = h("create_time");
		const [sortDir, setSortDir] = h("desc");
		const filtered = F$1(() => {
			let result = conversations;
			const q = query.trim();
			if (q) result = result.filter((c) => textSearch(c.title, q));
			const dir = sortDir === "asc" ? 1 : -1;
			return [...result].sort((a, b) => {
				if (sortField === "title") return dir * (a.title ?? "").localeCompare(b.title ?? "");
				const aMs = toMs(sortField === "update_time" ? a.update_time : a.create_time);
				const bMs = toMs(sortField === "update_time" ? b.update_time : b.create_time);
				return dir * (aMs - bMs);
			});
		}, [
			conversations,
			query,
			sortField,
			sortDir
		]);
		const allFilteredSelected = filtered.length > 0 && filtered.every((c) => selected.some((x) => x.id === c.id));
		const selectByExportStatus = T$1((status) => {
			lastClickedIndex.current = -1;
			const exportedMap = getExportedUpdateTimes();
			if (status === "all") setSelected(filtered);
			else if (status === "not_exported") setSelected(filtered.filter((c) => !(c.id in exportedMap)));
			else setSelected(filtered.filter((c) => c.id in exportedMap && exportedMap[c.id] < toMs(c.update_time)));
		}, [filtered, setSelected]);
		return o(k$1, { children: [
			o("input", {
				type: "search",
				className: "ce-select-search",
				placeholder: t("Search"),
				value: query,
				disabled,
				onInput: (e) => {
					const val = e.currentTarget.value;
					lastClickedIndex.current = -1;
					setQuery(val);
				}
			}),
			o("div", {
				className: "ce-select-toolbar",
				children: [o(CheckBox, {
					label: t("Select All"),
					disabled,
					checked: allFilteredSelected,
					onCheckedChange: (checked) => {
						lastClickedIndex.current = -1;
						setSelected(checked ? filtered : []);
					}
				}), o("div", {
					className: "ce-select-toolbar-end",
					children: [
						loading && conversations.length > 0 && o("span", {
							className: "ce-toolbar-loading",
							children: [
								o(IconLoading, { className: "ce-icon-sm" }),
								t("Loading"),
								"... (",
								conversations.length,
								")"
							]
						}),
						o("select", {
							className: "ce-select ce-toolbar-status",
							disabled: disabled || filtered.length === 0,
							value: "",
							title: "Select conversations by export status",
							onChange: (e) => {
								const val = e.currentTarget.value;
								if (val) selectByExportStatus(val);
							},
							children: [
								o("option", {
									value: "",
									disabled: true,
									children: t("Select...")
								}),
								o("option", {
									value: "all",
									children: t("Select All")
								}),
								o("option", {
									value: "not_exported",
									children: t("Select Not Exported")
								}),
								o("option", {
									value: "updated",
									children: t("Select Updated")
								})
							]
						}),
						o("span", {
							className: "ce-toolbar-hint",
							children: t("Shift Select Hint")
						}),
						o("span", {
							className: "ce-toolbar-count",
							children: [
								selected.length,
								" / ",
								filtered.length
							]
						})
					]
				})]
			}),
			o("div", {
				className: "ce-list-header",
				children: [
					o("button", {
						className: `ce-list-header-cell ce-list-header-cell-title${sortField === "title" ? " ce-list-header-cell-active" : ""}`,
						onClick: () => {
							if (sortField === "title") setSortDir((d) => d === "asc" ? "desc" : "asc");
							else {
								setSortField("title");
								setSortDir("asc");
							}
						},
						children: ["Title ", sortField === "title" ? sortDir === "asc" ? "↑" : "↓" : "↕"]
					}),
					o("button", {
						className: `ce-list-header-cell${sortField === "create_time" ? " ce-list-header-cell-active" : ""}`,
						onClick: () => {
							if (sortField === "create_time") setSortDir((d) => d === "asc" ? "desc" : "asc");
							else {
								setSortField("create_time");
								setSortDir("desc");
							}
						},
						children: ["Created ", sortField === "create_time" ? sortDir === "asc" ? "↑" : "↓" : "↕"]
					}),
					o("button", {
						className: `ce-list-header-cell${sortField === "update_time" ? " ce-list-header-cell-active" : ""}`,
						onClick: () => {
							if (sortField === "update_time") setSortDir((d) => d === "asc" ? "desc" : "asc");
							else {
								setSortField("update_time");
								setSortDir("desc");
							}
						},
						children: ["Updated ", sortField === "update_time" ? sortDir === "asc" ? "↑" : "↓" : "↕"]
					})
				]
			}),
			o("ul", {
				className: "ce-select-list",
				children: [
					loading && conversations.length === 0 && o("li", {
						className: "ce-select-item",
						children: [t("Loading"), "..."]
					}),
					error && o("li", {
						className: "ce-select-item",
						children: [
							t("Error"),
							": ",
							error
						]
					}),
					filtered.map((c, index) => {
						const isSelected = selected.some((x) => x.id === c.id);
						return o("li", {
							className: "ce-select-item",
							onClickCapture: (e) => {
								if (disabled) return;
								if (e.shiftKey && lastClickedIndex.current !== -1) {
									e.preventDefault();
									const start = Math.min(lastClickedIndex.current, index);
									const end = Math.max(lastClickedIndex.current, index);
									const rangeItems = filtered.slice(start, end + 1);
									const newSelected = [...selected];
									for (const item of rangeItems) if (!newSelected.some((x) => x.id === item.id)) newSelected.push(item);
									setSelected(newSelected);
									return;
								}
								lastClickedIndex.current = index;
							},
							children: [
								o(CheckBox, {
									label: c.title,
									disabled,
									checked: isSelected,
									onCheckedChange: (checked) => {
										setSelected(checked ? [...selected, c] : selected.filter((x) => x.id !== c.id));
									}
								}),
								c.is_starred && o("span", {
									className: "ce-starred",
									title: "Starred",
									children: "★"
								}),
								o("span", {
									className: `ce-select-item-meta${sortField === "create_time" ? " ce-select-item-meta-active" : ""}`,
									title: `Created: ${c.create_time ?? "—"}`,
									children: formatConvDate(c.create_time)
								}),
								o("span", {
									className: `ce-select-item-meta${sortField === "update_time" ? " ce-select-item-meta-active" : ""}`,
									title: `Updated: ${c.update_time ?? "—"}`,
									children: formatConvDate(c.update_time)
								})
							]
						}, c.id);
					}),
					!loading && !error && filtered.length === 0 && conversations.length > 0 && o("li", {
						className: "ce-select-item ce-select-item-empty",
						children: t("No results")
					})
				]
			})
		] });
	};
	var DialogContent = ({ format, onClose }) => {
		const { t } = useTranslation();
		const { enableMeta, exportMetaList, exportAllLimit } = useSettingContext();
		const metaList = F$1(() => enableMeta ? exportMetaList : [], [enableMeta, exportMetaList]);
		const exportAllOptions = F$1(() => [
			{
				label: "Markdown",
				callback: exportAllToMarkdown
			},
			{
				label: "HTML",
				callback: exportAllToHtml
			},
			{
				label: "JSON",
				callback: exportAllToOfficialJson
			},
			{
				label: "JSON (ZIP)",
				callback: exportAllToJson
			}
		], []);
		const fileInputRef = _$1(null);
		const [exportSource, setExportSource] = h("API");
		const [apiConversations, setApiConversations] = h([]);
		const [localConversations, setLocalConversations] = h([]);
		const conversations = exportSource === "API" ? apiConversations : localConversations;
		const [projects, setProjects] = h([]);
		const [selectedProjectId, setSelectedProjectId] = h(null);
		const [projectsLoading, setProjectsLoading] = h(false);
		const selectedProject = projects.find((p) => p.id === selectedProjectId) ?? null;
		const [loading, setLoading] = h(false);
		const [error, setError] = h("");
		const [processing, setProcessing] = h(false);
		const [selected, setSelected] = h([]);
		const [exportType, setExportType] = h(exportAllOptions[0].label);
		const disabled = processing || selected.length === 0;
		const [hasMore, setHasMore] = h(false);
		const [loadingMore, setLoadingMore] = h(false);
		const [totalAvailable, setTotalAvailable] = h(null);
		const requestQueue = F$1(() => new RequestQueue(200, 1600), []);
		const archiveQueue = F$1(() => new RequestQueue(200, 1600), []);
		const deleteQueue = F$1(() => new RequestQueue(200, 1600), []);
		const [progress, setProgress] = h({
			total: 0,
			completed: 0,
			currentName: "",
			currentStatus: "",
			rateLimitWaitSecs: void 0,
			batchIndex: 0,
			totalBatches: 0
		});
		const pendingBatchesRef = _$1([]);
		const batchIndexRef = _$1(0);
		const totalBatchesRef = _$1(0);
		const cancelledRef = _$1(false);
		const skippedRef = _$1([]);
		const fetchGenRef = _$1(0);
		const onUpload = T$1((e) => {
			const file = e.target?.files?.[0];
			if (!file) return;
			const fileReader = new FileReader();
			fileReader.onload = () => {
				const data = JSON.parse(fileReader.result);
				if (!Array.isArray(data)) {
					alert(t("Invalid File Format"));
					return;
				}
				setSelected([]);
				setExportSource("Local");
				setLocalConversations(data);
			};
			fileReader.readAsText(file);
		}, [t]);
		const startApiBatch = T$1((chunk) => {
			requestQueue.clear();
			chunk.forEach(({ id, title, update_time }) => {
				const entry = conversationCache.get(id);
				const cached = entry && entry.updateTime === update_time ? entry.conversation : void 0;
				requestQueue.add({
					name: title,
					cached: !!cached,
					request: async () => {
						let conversation = cached;
						if (!conversation) {
							conversation = await fetchConversation(id);
							conversationCache.set(id, {
								updateTime: update_time,
								conversation
							});
						}
						return exportType === "JSON" ? conversation : withImageAssets(conversation);
					}
				});
			});
			requestQueue.start();
		}, [requestQueue, exportType]);
		p$1(() => {
			const off = requestQueue.on("progress", (prog) => {
				setProcessing(true);
				setProgress({
					...prog,
					rateLimitWaitSecs: prog.rateLimitWaitSecs,
					batchIndex: batchIndexRef.current,
					totalBatches: totalBatchesRef.current,
					completed: batchIndexRef.current * 100 + prog.completed,
					total: pendingBatchesRef.current.reduce((n, batch) => n + batch.length, 0)
				});
			});
			return () => off();
		}, [requestQueue]);
		p$1(() => {
			const off = archiveQueue.on("progress", (prog) => {
				setProcessing(true);
				setProgress({
					...prog,
					rateLimitWaitSecs: prog.rateLimitWaitSecs,
					batchIndex: 0,
					totalBatches: 0
				});
			});
			return () => off();
		}, [archiveQueue]);
		p$1(() => {
			const off = deleteQueue.on("progress", (prog) => {
				setProcessing(true);
				setProgress({
					...prog,
					rateLimitWaitSecs: prog.rateLimitWaitSecs,
					batchIndex: 0,
					totalBatches: 0
				});
			});
			return () => off();
		}, [deleteQueue]);
		p$1(() => {
			const off = requestQueue.on("done", async (results) => {
				if (cancelledRef.current) {
					cancelledRef.current = false;
					setProcessing(false);
					exportingRef.current = false;
					return;
				}
				const batchIdx = batchIndexRef.current;
				const totalBatches = totalBatchesRef.current;
				const partIndex = batchIdx + 1;
				const callback = exportAllOptions.find((o) => o.label === exportType)?.callback;
				if (callback && results.length > 0) {
					await callback(format, results, metaList, selectedProject?.display.name, partIndex, totalBatches);
					markExported(results);
				}
				skippedRef.current.push(...requestQueue.getSkipped());
				if (partIndex < totalBatches) {
					await sleep(400);
					batchIndexRef.current++;
					const nextChunk = pendingBatchesRef.current[batchIndexRef.current];
					if (nextChunk) startApiBatch(nextChunk);
				} else {
					setProcessing(false);
					const skipped = skippedRef.current;
					if (skipped.length > 0) {
						const shown = skipped.slice(0, MAX_SKIPPED_SHOWN).map((name) => `- ${name}`);
						if (skipped.length > MAX_SKIPPED_SHOWN) shown.push("- …");
						alert(`${t("Export Skipped Message", { n: skipped.length })}\n\n${shown.join("\n")}`);
					}
				}
			});
			return () => off();
		}, [
			requestQueue,
			exportAllOptions,
			exportType,
			format,
			metaList,
			startApiBatch,
			selectedProject,
			t
		]);
		p$1(() => {
			const off = archiveQueue.on("done", () => {
				setProcessing(false);
				setApiConversations((prev) => prev.filter((c) => !selected.some((s) => s.id === c.id)));
				dropFromListCache(selected);
				setSelected([]);
				alert(t("Conversation Archived Message"));
			});
			return () => off();
		}, [
			archiveQueue,
			selected,
			t
		]);
		p$1(() => {
			const off = deleteQueue.on("done", () => {
				setProcessing(false);
				setApiConversations((prev) => prev.filter((c) => !selected.some((s) => s.id === c.id)));
				dropFromListCache(selected);
				setSelected([]);
				alert(t("Conversation Deleted Message"));
			});
			return () => off();
		}, [
			deleteQueue,
			selected,
			t
		]);
		const cancelExport = T$1(() => {
			cancelledRef.current = true;
			requestQueue.stop();
			archiveQueue.stop();
			deleteQueue.stop();
		}, [
			requestQueue,
			archiveQueue,
			deleteQueue
		]);
		const exportAllFromApi = T$1(() => {
			if (disabled) return;
			cancelledRef.current = false;
			skippedRef.current = [];
			const chunks = chunkArray(selected, 100);
			pendingBatchesRef.current = chunks;
			batchIndexRef.current = 0;
			totalBatchesRef.current = chunks.length;
			setProcessing(true);
			setProgress({
				total: selected.length,
				completed: 0,
				currentName: "",
				currentStatus: "processing",
				rateLimitWaitSecs: void 0,
				batchIndex: 0,
				totalBatches: chunks.length
			});
			startApiBatch(chunks[0]);
		}, [
			disabled,
			selected,
			startApiBatch
		]);
		const exportAllFromLocal = T$1(async () => {
			if (disabled) return;
			const results = localConversations.filter((c) => selected.some((s) => s.id === c.id));
			const callback = exportAllOptions.find((o) => o.label === exportType)?.callback;
			if (!callback) return;
			const chunks = chunkArray(results, 100);
			setProcessing(true);
			for (let i = 0; i < chunks.length; i++) {
				await callback(format, chunks[i], metaList, selectedProject?.display.name, i + 1, chunks.length);
				markExported(chunks[i]);
				if (i < chunks.length - 1) await sleep(400);
			}
			setProcessing(false);
		}, [
			disabled,
			selected,
			localConversations,
			exportAllOptions,
			exportType,
			format,
			metaList,
			selectedProject
		]);
		const exportAll = F$1(() => {
			return exportSource === "API" ? exportAllFromApi : exportAllFromLocal;
		}, [
			exportSource,
			exportAllFromApi,
			exportAllFromLocal
		]);
		const deleteAll = T$1(() => {
			if (disabled) return;
			if (!confirm(t("Conversation Delete Alert"))) return;
			deleteQueue.clear();
			selected.forEach(({ id, title }) => {
				deleteQueue.add({
					name: title,
					request: () => deleteConversation(id)
				});
			});
			deleteQueue.start();
		}, [
			disabled,
			selected,
			deleteQueue,
			t
		]);
		const archiveAll = T$1(() => {
			if (disabled) return;
			if (!confirm(t("Conversation Archive Alert"))) return;
			archiveQueue.clear();
			selected.forEach(({ id, title }) => {
				archiveQueue.add({
					name: title,
					request: () => archiveConversation(id)
				});
			});
			archiveQueue.start();
		}, [
			disabled,
			selected,
			archiveQueue,
			t
		]);
		p$1(() => {
			const genRef = fetchGenRef;
			return () => {
				exportingRef.current = false;
				genRef.current++;
				requestQueue.clear();
				archiveQueue.clear();
				deleteQueue.clear();
			};
		}, [
			requestQueue,
			archiveQueue,
			deleteQueue
		]);
		p$1(() => {
			exportingRef.current = processing;
		}, [processing]);
		p$1(() => {
			setProjectsLoading(true);
			fetchProjects().then(setProjects).catch((err) => console.error("Error fetching projects:", err)).finally(() => setProjectsLoading(false));
		}, []);
		p$1(() => {
			const gen = ++fetchGenRef.current;
			const alive = () => gen === fetchGenRef.current;
			setSelected([]);
			const cache = selectedProjectId === null && listCache?.limit === exportAllLimit ? listCache : null;
			if (cache) {
				setApiConversations(cache.items);
				setHasMore(cache.hasMore);
				setTotalAvailable(cache.total);
				setError("");
				setLoading(false);
				refreshConversationList(cache.items, (offset, limit) => fetchConversationsPage(null, offset, limit), 100, exportAllLimit).then(({ head, total }) => {
					if (listCache) listCache = {
						...listCache,
						items: applyHead(head, listCache.items),
						total: listCache.total !== null ? total : null
					};
					if (!alive() || !listCache) return;
					setApiConversations((prev) => applyHead(head, prev));
					setTotalAvailable(listCache.total);
					const byId = new Map(head.map((c) => [c.id, c]));
					setSelected((prev) => prev.map((c) => byId.get(c.id) ?? c));
				}).catch((err) => console.error("Error refreshing conversations:", err));
				return;
			}
			setApiConversations([]);
			setHasMore(false);
			setTotalAvailable(null);
			setError("");
			setLoading(true);
			let loadedHasMore = false;
			let loadFailed = false;
			fetchAllConversations(selectedProjectId, exportAllLimit, (batch) => {
				if (alive()) setApiConversations((prev) => [...prev, ...batch]);
			}, (hasMore) => {
				loadedHasMore = hasMore;
				if (alive()) setHasMore(hasMore);
			}, (error) => {
				loadFailed = true;
				if (alive()) setError(describeListLoadError(error));
			}).then((items) => {
				if (selectedProjectId === null && items.length > 0 && !loadFailed) listCache = {
					limit: exportAllLimit,
					items,
					hasMore: loadedHasMore,
					total: null
				};
			}).catch((err) => {
				if (!alive()) return;
				console.error("Error fetching conversations:", err);
				setError(describeListLoadError(err));
			}).finally(() => {
				if (alive()) setLoading(false);
			});
		}, [exportAllLimit, selectedProjectId]);
		const loadMore = T$1(async () => {
			if (loadingMore) return;
			setLoadingMore(true);
			try {
				const page = await fetchConversationsPage(selectedProjectId, apiConversations.length, 100);
				setApiConversations((prev) => [...prev, ...page.items]);
				if (page.total !== null) setTotalAvailable(page.total);
				const more = page.items.length >= 100 && (page.total === null || apiConversations.length + page.items.length < page.total);
				setHasMore(more);
				if (selectedProjectId === null && listCache) listCache = {
					...listCache,
					items: [...listCache.items, ...page.items],
					hasMore: more,
					total: page.total ?? listCache.total
				};
			} catch (err) {
				console.error("loadMore error", err);
			} finally {
				setLoadingMore(false);
			}
		}, [
			loadingMore,
			apiConversations.length,
			selectedProjectId
		]);
		const totalBatches = Math.ceil(selected.length / 100) || 1;
		const [probeStatus, setProbeStatus] = h(null);
		const [probeRetryAfterSecs, setProbeRetryAfterSecs] = h();
		const [probeHeaders, setProbeHeaders] = h({});
		const runProbe = T$1(async () => {
			setProbeStatus("testing");
			try {
				const result = await probeApi();
				setProbeHeaders(result.rateLimitHeaders);
				if (result.ok) setProbeStatus("ok");
				else {
					setProbeStatus("rate_limited");
					setProbeRetryAfterSecs(result.retryAfterMs != null ? Math.round(result.retryAfterMs / 1e3) : void 0);
				}
			} catch {
				setProbeStatus("error");
			}
		}, []);
		const probeLabel = probeStatus === "testing" ? "⏳ Testing…" : probeStatus === "ok" ? "✅ API ready" : probeStatus === "rate_limited" ? `🚫 Rate limited${probeRetryAfterSecs != null ? ` · wait ${probeRetryAfterSecs}s` : ""}` : probeStatus === "error" ? "⚠️ Error" : null;
		return o(k$1, { children: [
			o("div", {
				className: "ce-export-source",
				children: [
					t("Export from official export file"),
					" (conversations.json)\xA0",
					o("div", {
						className: "ce-hstack",
						children: [exportSource === "API" && o("button", {
							className: "ce-button ce-button-neutral",
							style: {
								fontSize: "0.72rem",
								padding: "2px 8px",
								whiteSpace: "nowrap"
							},
							disabled: probeStatus === "testing" || processing,
							title: Object.keys(probeHeaders).length > 0 ? `Rate-limit headers: ${JSON.stringify(probeHeaders)}` : "Check if the API is currently rate-limiting requests",
							onClick: runProbe,
							children: probeLabel ?? "Test API"
						}), exportSource === "API" && o("button", {
							className: "ce-icon-button",
							"aria-label": "Upload",
							onClick: () => fileInputRef.current?.click(),
							children: o(IconUpload, { className: "ce-icon" })
						})]
					})
				]
			}),
			o("input", {
				type: "file",
				accept: "application/json",
				hidden: true,
				ref: fileInputRef,
				onChange: onUpload
			}),
			exportSource === "API" && o(ProjectSelect, {
				projects,
				selected: selectedProjectId,
				setSelected: setSelectedProjectId,
				disabled: processing,
				loading: projectsLoading
			}),
			o(ConversationSelect, {
				conversations,
				selected,
				setSelected,
				disabled: processing,
				loading,
				error
			}),
			exportSource === "API" && !loading && !processing && hasMore && o("div", {
				className: "ce-load-more",
				children: [o("button", {
					className: "ce-button ce-button-neutral",
					style: {
						fontSize: "0.8rem",
						padding: "4px 14px"
					},
					disabled: loadingMore,
					onClick: loadMore,
					children: loadingMore ? `${t("Loading")}...` : totalAvailable !== null ? t("Load more conversations remaining", {
						n: 100,
						remaining: totalAvailable - apiConversations.length
					}) : t("Load more conversations", { n: 100 })
				}), totalAvailable !== null && !loadingMore && o("span", {
					className: "ce-muted-count",
					children: [
						apiConversations.length,
						" / ",
						totalAvailable
					]
				})]
			}),
			o("div", {
				className: "ce-action-bar",
				children: [
					o("select", {
						className: "ce-select",
						disabled: processing,
						value: exportType,
						onChange: (e) => setExportType(e.currentTarget.value),
						children: exportAllOptions.map(({ label }) => o("option", {
							value: label,
							children: label
						}, t(label)))
					}),
					o("div", { className: "ce-spacer" }),
					o("button", {
						className: "ce-button ce-button-red",
						disabled: disabled || exportSource === "Local",
						onClick: archiveAll,
						children: t("Archive")
					}),
					o("button", {
						className: "ce-button ce-button-red",
						disabled: disabled || exportSource === "Local",
						onClick: deleteAll,
						children: t("Delete")
					}),
					o("button", {
						className: "ce-button ce-button-green",
						disabled,
						onClick: exportAll,
						children: t("Export")
					})
				]
			}),
			totalBatches > 1 && !processing && o("p", {
				className: "ce-batch-note",
				children: `${totalBatches} downloads \u00B7 100 conversations each`
			}),
			processing && o(k$1, { children: [o("div", {
				className: "ce-progress-header",
				children: [
					o("span", {
						className: "ce-progress-name",
						children: progress.currentStatus === "rate_limited" ? `⏳ Rate limited — waiting ${progress.rateLimitWaitSecs ?? "…"}s` : progress.currentName
					}),
					o("span", {
						className: "ce-progress-count",
						children: progress.totalBatches > 1 ? `${t("Batch progress").replace("{{current}}", String(progress.batchIndex + 1)).replace("{{total}}", String(progress.totalBatches))} \u00B7 ${progress.completed}/${progress.total}` : `${progress.completed}/${progress.total}`
					}),
					o("button", {
						className: "ce-button ce-button-red",
						style: {
							fontSize: "0.75rem",
							padding: "3px 10px",
							height: "auto"
						},
						title: "Stop the export — any batches already downloaded are kept",
						onClick: cancelExport,
						children: t("Cancel")
					})
				]
			}), o("div", {
				className: "ce-progress",
				children: o("div", {
					className: `ce-progress-bar${progress.currentStatus === "rate_limited" ? " ce-progress-bar-waiting" : ""}`,
					style: { width: `${progress.total > 0 ? progress.completed / progress.total * 100 : 0}%` }
				})
			})] }),
			processing ? o("button", {
				className: "ce-icon-button ce-close-button",
				"aria-label": "Export in progress",
				title: "Click Cancel to stop the export",
				style: {
					cursor: "not-allowed",
					opacity: .25
				},
				children: o(IconCross, {})
			}) : o("button", {
				className: "ce-icon-button ce-close-button",
				"aria-label": "Close",
				onClick: onClose,
				children: o(IconCross, {})
			})
		] });
	};
	function ExportDialog({ format, open, onOpenChange }) {
		const { t } = useTranslation();
		const onChange = (value) => {
			if (!value && exportingRef.current) return;
			onOpenChange(value);
		};
		return o(Dialog, {
			open,
			onOpenChange: onChange,
			title: t("Export Dialog Title"),
			className: "ce-dialog-plain",
			children: o(DialogContent, {
				format,
				onClose: () => onChange(false)
			})
		});
	}
	var CLOSE_DELAY = 300;
	var SIDE_OFFSET = 8;
	var ARROW_WIDTH = 8;
	var ARROW_HEIGHT = 16;
	var ALIGN_OFFSET = -64;
	var VIEWPORT_PADDING = 8;
	function HoverCard({ open, onOpenChange, keepMounted, isMobile, width, trigger, children }) {
		const triggerRef = _$1(null);
		const cardRef = _$1(null);
		const arrowRef = _$1(null);
		const closeTimer = _$1(0);
		const cancelClose = () => clearTimeout(closeTimer.current);
		const onPointerEnter = (e) => {
			if (e.pointerType === "touch") return;
			cancelClose();
			onOpenChange(true);
		};
		const onPointerLeave = (e) => {
			if (e.pointerType === "touch") return;
			cancelClose();
			closeTimer.current = window.setTimeout(() => onOpenChange(false), CLOSE_DELAY);
		};
		p$1(() => cancelClose, []);
		p$1(() => {
			if (!open || keepMounted) return;
			const close = () => onOpenChange(false);
			const onPointerDown = (e) => {
				document.removeEventListener("click", close, true);
				const target = e.target;
				if (triggerRef.current?.contains(target) || cardRef.current?.contains(target)) return;
				if (e.pointerType === "touch") {
					document.addEventListener("click", close, {
						once: true,
						capture: true
					});
					return;
				}
				close();
			};
			const onKeyDown = (e) => {
				if (e.key === "Escape") onOpenChange(false);
			};
			document.addEventListener("pointerdown", onPointerDown, true);
			document.addEventListener("keydown", onKeyDown);
			return () => {
				document.removeEventListener("pointerdown", onPointerDown, true);
				document.removeEventListener("click", close, true);
				document.removeEventListener("keydown", onKeyDown);
			};
		}, [
			open,
			keepMounted,
			onOpenChange
		]);
		const mounted = open || keepMounted;
		y(() => {
			if (!mounted) return;
			const update = () => {
				const anchor = triggerRef.current;
				const card = cardRef.current;
				if (!anchor || !card) return;
				const rect = anchor.getBoundingClientRect();
				const height = card.offsetHeight;
				const clamp = (value, min, max) => Math.max(min, Math.min(value, max));
				let left;
				let top;
				if (isMobile) {
					left = clamp(rect.left, 0, window.innerWidth - width);
					top = window.innerHeight - rect.bottom >= height ? rect.bottom : rect.top - height;
					top = clamp(top, 0, window.innerHeight - height);
				} else {
					left = rect.right + SIDE_OFFSET + ARROW_WIDTH;
					top = clamp(rect.top + ALIGN_OFFSET, VIEWPORT_PADDING, window.innerHeight - VIEWPORT_PADDING - height);
					const arrow = arrowRef.current;
					if (arrow) {
						const arrowTop = rect.top + rect.height / 2 - top - ARROW_HEIGHT / 2;
						arrow.style.top = `${clamp(arrowTop, 0, height - ARROW_HEIGHT)}px`;
					}
				}
				card.style.left = `${left}px`;
				card.style.top = `${top}px`;
			};
			update();
			window.addEventListener("resize", update);
			window.addEventListener("scroll", update, true);
			return () => {
				window.removeEventListener("resize", update);
				window.removeEventListener("scroll", update, true);
			};
		}, [
			mounted,
			isMobile,
			width
		]);
		const card = mounted && o("div", {
			ref: cardRef,
			className: `ce-root ce-card${isMobile ? " ce-card-mobile" : ""}`,
			style: { width },
			"data-state": open ? "open" : "closed",
			onPointerEnter,
			onPointerLeave,
			children: [children, !isMobile && o("svg", {
				ref: arrowRef,
				className: "ce-card-arrow",
				width: ARROW_WIDTH,
				height: ARROW_HEIGHT,
				viewBox: `0 0 ${ARROW_WIDTH} ${ARROW_HEIGHT}`,
				"aria-hidden": "true",
				children: o("polygon", { points: `${ARROW_WIDTH},0 0,${ARROW_HEIGHT / 2} ${ARROW_WIDTH},${ARROW_HEIGHT}` })
			})]
		});
		return o(k$1, { children: [o("div", {
			ref: triggerRef,
			onPointerEnter,
			onPointerLeave,
			children: trigger
		}), card && (isMobile ? card : z(card, document.body))] });
	}
	var TIMEOUT = 2500;
	var MenuItem = ({ text, successText, disabled = false, title, ariaLabel, icon: Icon, onClick, className }) => {
		const [loading, setLoading] = h(false);
		const [succeed, setSucceed] = h(false);
		const handleClick = typeof onClick === "function" ? async (e) => {
			e.preventDefault();
			if (loading) return;
			try {
				setLoading(true);
				if (await onClick()) {
					setSucceed(true);
					setTimeout(() => setSucceed(false), TIMEOUT);
				}
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		} : void 0;
		const handleKeyDown = (e) => {
			if (e.key !== "Enter" && e.key !== " ") return;
			e.preventDefault();
			e.currentTarget.click();
		};
		return o("div", {
			className: `ce-menu-item ${className ?? ""}`,
			role: "button",
			tabIndex: disabled ? -1 : 0,
			onClick: handleClick,
			onTouchStart: handleClick,
			onKeyDown: handleKeyDown,
			disabled,
			"aria-disabled": disabled || void 0,
			"aria-busy": loading || void 0,
			"aria-label": ariaLabel,
			title,
			children: loading ? o("div", {
				className: "ce-menu-item-loading",
				children: o(IconLoading, { className: "ce-icon" })
			}) : o(k$1, { children: [Icon && o(Icon, {}), o("span", {
				className: "ce-menu-item-text",
				children: succeed && successText ? successText : text
			})] })
		});
	};
	function useTitle() {
		return En(subscribe, getSnapshot);
	}
	function subscribe(callback) {
		const target = document.querySelector("title");
		if (!target) return noop;
		const observer = new MutationObserver(callback);
		observer.observe(target, {
			subtree: true,
			characterData: true,
			childList: true
		});
		return () => observer.disconnect();
	}
	function getSnapshot() {
		return document.title;
	}
	_css(".ce-toggle {\n    display: inline-flex;\n    align-items: center;\n}\n\n/* Matches ChatGPT's own switches: no border, a tinted track, a white thumb. */\n.ce-toggle-switch {\n    position: relative;\n    display: inline-flex;\n    flex-shrink: 0;\n    align-items: center;\n    width: 32px;\n    height: 20px;\n    border-radius: 9999px;\n    outline: none;\n    cursor: pointer;\n    background-color: color-mix(in srgb, var(--ce-text-primary) 10%, transparent);\n    transition: background-color 0.15s ease-out;\n}\n\n.ce-toggle-switch[data-state=\"checked\"] {\n    background-color: var(--ce-accent);\n}\n\n.ce-toggle-switch:focus-visible {\n    box-shadow: 0 0 0 2px var(--ce-accent);\n}\n\n.ce-toggle-handle {\n    display: block;\n    width: 16px;\n    height: 16px;\n    border: 1px solid #ffffff;\n    border-radius: 9999px;\n    background-color: #ffffff;\n    box-shadow: 0 1px 2px -1px #00000014;\n    transform: translateX(2px);\n    transition: transform 0.15s ease-out;\n}\n\n.ce-toggle-handle[data-state=\"checked\"] {\n    transform: translateX(14px);\n}\n\n.ce-toggle-label {\n    color: var(--ce-text-secondary);\n    margin-left: 0.75rem;\n    font-size: 0.875rem;\n    font-weight: 500;\n}\n\n.ce-toggle-label:hover {\n    color: var(--ce-text-primary);\n}\n");
	function Toggle({ label, checked = true, onCheckedUpdate }) {
		return o("div", {
			className: "ce-toggle",
			children: [o("button", {
				type: "button",
				role: "switch",
				"aria-checked": checked,
				"aria-label": label || void 0,
				onClick: () => onCheckedUpdate?.(!checked),
				"data-state": checked ? "checked" : "unchecked",
				className: "ce-toggle-switch",
				children: o("span", {
					"data-state": checked ? "checked" : "unchecked",
					className: "ce-toggle-handle"
				})
			}), label && o("span", {
				className: "ce-toggle-label",
				children: label
			})]
		});
	}
	_css(".ce-setting-list {\n    display: flex;\n    flex-direction: column;\n    gap: 24px;\n}\n\n.ce-setting-card {\n    position: relative;\n    display: flex;\n    padding: 16px;\n    border-radius: 4px;\n    background-color: var(--ce-card-surface);\n}\n\n.ce-setting-title {\n    font-size: 1rem;\n    font-weight: 500;\n    color: var(--ce-text-primary);\n}\n\n.ce-setting-desc {\n    font-size: 0.875rem;\n    line-height: 1.25rem;\n    color: var(--ce-text-secondary);\n}\n\n.ce-setting-control {\n    position: absolute;\n    right: 16px;\n}\n\n.ce-setting-select {\n    margin-top: 12px;\n}\n\n.ce-setting-filename {\n    margin-top: 16px;\n}\n\n.ce-setting-preview-line {\n    margin-top: 4px;\n}\n\n.ce-variable {\n    cursor: help;\n    user-select: all;\n    white-space: nowrap;\n    font-weight: 600;\n}\n\n.ce-preview {\n    user-select: all;\n    text-decoration: underline;\n    text-underline-offset: 4px;\n}\n\n.ce-range-row {\n    display: flex;\n    align-items: center;\n    gap: 16px;\n    margin-top: 12px;\n}\n\n.ce-range {\n    /* ChatGPT's base styles strip the native look from range inputs. */\n    appearance: auto;\n    flex-grow: 1;\n    cursor: pointer;\n    accent-color: var(--ce-accent);\n}\n\n.ce-range-value {\n    width: 3rem;\n    text-align: right;\n    font-weight: 500;\n    color: var(--ce-text-primary);\n}\n\n.ce-meta-row {\n    display: flex;\n    align-items: center;\n    margin-top: 8px;\n}\n\n.ce-meta-arrow {\n    margin: 0 8px;\n}\n\n.ce-meta-remove {\n    margin-left: 8px;\n    padding: 4px;\n    border-radius: 9999px;\n    color: var(--ce-text-secondary);\n    transition: background-color 150ms ease-in-out;\n}\n\n.ce-meta-add-row {\n    display: flex;\n    margin-top: 8px;\n    padding-right: 32px;\n}\n\n.ce-meta-add {\n    width: 100%;\n    padding: 8px 0;\n    border: 1px solid var(--ce-control-border);\n    border-radius: 6px;\n    font-size: 0.875rem;\n    font-weight: 500;\n    color: var(--ce-text-secondary);\n    transition: background-color 150ms ease-in-out;\n}\n\n.ce-meta-remove:hover,\n.ce-meta-add:hover {\n    background-color: var(--ce-hover);\n}\n");
	function Variable({ name, title }) {
		return o("strong", {
			className: "ce-variable",
			title,
			children: name
		});
	}
	var SettingDialog = ({ open, onOpenChange }) => {
		const { format, setFormat, enableTimestamp, setEnableTimestamp, timeStamp24H, setTimeStamp24H, enableTimestampHTML, setEnableTimestampHTML, enableTimestampMarkdown, setEnableTimestampMarkdown, enableMeta, setEnableMeta, exportMetaList, setExportMetaList, enableThinking, setEnableThinking, enableSources, setEnableSources, exportAllLimit, setExportAllLimit } = useSettingContext();
		const { t, i18n } = useTranslation();
		const _title = useTitle();
		const date = dateStr();
		const timestamp$1 = timestamp();
		const title = (0, import_sanitize_filename.default)(_title).replace(/\s+/g, "_");
		const chatId = getChatIdFromUrl() || "this-is-a-mock-chat-id";
		const now = Date.now() / 1e3;
		const createTime = now;
		const updateTime = now;
		const preview = getFileNameWithFormat(format, "{ext}", {
			title,
			chatId,
			createTime,
			updateTime
		});
		const source = `${baseUrl}/${chatId}`;
		return o(Dialog, {
			open,
			onOpenChange,
			title: t("Exporter Settings"),
			children: [
				o("div", {
					className: "ce-dialog-body",
					children: o("dl", {
						className: "ce-setting-list",
						children: [
							o("div", {
								className: "ce-setting-card",
								children: o("div", { children: [o("dt", {
									className: "ce-setting-title",
									children: `${t("Language")} 🌐`
								}), o("dd", { children: o("select", {
									className: "ce-select ce-setting-select",
									value: i18n.language,
									onChange: (e) => i18n.changeLanguage(e.currentTarget.value),
									children: LOCALES.map(({ name, code }) => o("option", {
										value: code,
										children: name
									}, code))
								}) })] })
							}),
							o("div", {
								className: "ce-setting-card",
								children: o("div", { children: [o("dt", {
									className: "ce-setting-title",
									children: t("File Name")
								}), o("dd", { children: [
									o("p", {
										className: "ce-setting-desc",
										children: [
											t("Available variables"),
											":",
											" ",
											o(Variable, {
												name: "{title}",
												title
											}),
											",",
											" ",
											o(Variable, {
												name: "{date}",
												title: date
											}),
											",",
											" ",
											o(Variable, {
												name: "{timestamp}",
												title: timestamp$1
											}),
											",",
											" ",
											o(Variable, {
												name: "{chat_id}",
												title: chatId
											}),
											",",
											" ",
											o(Variable, {
												name: "{create_time}",
												title: unixTimestampToISOString(createTime)
											}),
											",",
											" ",
											o(Variable, {
												name: "{update_time}",
												title: unixTimestampToISOString(updateTime)
											})
										]
									}),
									o("input", {
										className: "ce-input ce-setting-filename",
										id: "filename",
										value: format,
										onChange: (e) => setFormat(e.currentTarget.value)
									}),
									o("p", {
										className: "ce-setting-desc ce-setting-preview-line",
										children: [
											t("Preview"),
											":",
											" ",
											o("span", {
												className: "ce-preview",
												children: preview
											})
										]
									})
								] })] })
							}),
							o("div", {
								className: "ce-setting-card",
								children: [o("div", { children: [o("dt", {
									className: "ce-setting-title",
									children: t("Export Thinking Process")
								}), o("dd", {
									className: "ce-setting-desc",
									children: t("Export Thinking Process Description")
								})] }), o("div", {
									className: "ce-setting-control",
									children: o(Toggle, {
										label: "",
										checked: enableThinking,
										onCheckedUpdate: setEnableThinking
									})
								})]
							}),
							o("div", {
								className: "ce-setting-card",
								children: [o("div", { children: [o("dt", {
									className: "ce-setting-title",
									children: t("Export Sources")
								}), o("dd", {
									className: "ce-setting-desc",
									children: t("Export Sources Description")
								})] }), o("div", {
									className: "ce-setting-control",
									children: o(Toggle, {
										label: "",
										checked: enableSources,
										onCheckedUpdate: setEnableSources
									})
								})]
							}),
							o("div", {
								className: "ce-setting-card",
								children: o("div", { children: [o("dt", {
									className: "ce-setting-title",
									children: [t("Export All Limit"), " "]
								}), o("dd", {
									className: "ce-setting-desc ce-mt-2",
									children: [
										t("Export All Limit Description"),
										" ",
										o("div", {
											className: "ce-range-row",
											children: [o("input", {
												type: "range",
												min: "100",
												max: "20000",
												step: "100",
												value: exportAllLimit,
												onChange: (e) => setExportAllLimit(Number.parseInt(e.currentTarget.value, 10)),
												className: "ce-range",
												id: "exportAllLimitSlider"
											}), o("span", {
												className: "ce-range-value",
												children: exportAllLimit
											})]
										})
									]
								})] })
							}),
							o("div", {
								className: "ce-setting-card",
								children: [o("div", { children: [o("dt", {
									className: "ce-setting-title",
									children: t("Conversation Timestamp")
								}), o("dd", {
									className: "ce-setting-desc",
									children: [t("Conversation Timestamp Description"), enableTimestamp && o(k$1, { children: [
										o("div", {
											className: "ce-mt-2",
											children: o(Toggle, {
												label: t("Use 24-hour format"),
												checked: timeStamp24H,
												onCheckedUpdate: setTimeStamp24H
											})
										}),
										o("div", {
											className: "ce-mt-2",
											children: o(Toggle, {
												label: t("Enable on HTML"),
												checked: enableTimestampHTML,
												onCheckedUpdate: setEnableTimestampHTML
											})
										}),
										o("div", {
											className: "ce-mt-2",
											children: o(Toggle, {
												label: t("Enable on Markdown"),
												checked: enableTimestampMarkdown,
												onCheckedUpdate: setEnableTimestampMarkdown
											})
										})
									] })]
								})] }), o("div", {
									className: "ce-setting-control",
									children: o(Toggle, {
										label: "",
										checked: enableTimestamp,
										onCheckedUpdate: setEnableTimestamp
									})
								})]
							}),
							o("div", {
								className: "ce-setting-card",
								children: [o("div", { children: [o("dt", {
									className: "ce-setting-title",
									children: t("Export Metadata")
								}), o("dd", {
									className: "ce-setting-desc",
									children: [t("Export Metadata Description"), enableMeta && o(k$1, { children: [
										o("p", {
											className: "ce-setting-desc ce-mt-2",
											children: [
												t("Available variables"),
												":",
												" ",
												o(Variable, {
													name: "{title}",
													title
												}),
												",",
												" ",
												o(Variable, {
													name: "{date}",
													title: date
												}),
												",",
												" ",
												o(Variable, {
													name: "{timestamp}",
													title: timestamp$1
												}),
												",",
												" ",
												o(Variable, {
													name: "{source}",
													title: source
												}),
												",",
												" ",
												o(Variable, {
													name: "{model}",
													title: "ChatGPT-3.5"
												}),
												",",
												" ",
												o(Variable, {
													name: "{model_name}",
													title: "text-davinci-002-render-sha"
												}),
												",",
												" ",
												o(Variable, {
													name: "{create_time}",
													title: "2023-04-10T21:45:35.027Z"
												}),
												",",
												" ",
												o(Variable, {
													name: "{update_time}",
													title: "2023-04-10T21:45:35.027Z"
												})
											]
										}),
										exportMetaList.map((meta, i) => o("div", {
											className: "ce-meta-row",
											children: [
												o("input", {
													className: "ce-input",
													value: meta.name,
													onChange: (e) => {
														const list = [...exportMetaList];
														list[i] = {
															...list[i],
															name: e.currentTarget.value
														};
														setExportMetaList(list);
													}
												}),
												o("span", {
													className: "ce-meta-arrow",
													children: "→"
												}),
												o("input", {
													className: "ce-input",
													value: meta.value,
													onChange: (e) => {
														const list = [...exportMetaList];
														list[i] = {
															...list[i],
															value: e.currentTarget.value
														};
														setExportMetaList(list);
													}
												}),
												o("button", {
													className: "ce-meta-remove",
													"aria-label": "Remove",
													onClick: () => setExportMetaList(exportMetaList.filter((_, j) => j !== i)),
													children: o(IconTrash, { className: "ce-icon" })
												})
											]
										}, i)),
										o("div", {
											className: "ce-meta-add-row",
											children: o("button", {
												className: "ce-meta-add",
												"aria-label": "Add",
												onClick: () => setExportMetaList([...exportMetaList, {
													name: "",
													value: ""
												}]),
												children: "+"
											})
										})
									] })]
								})] }), o("div", {
									className: "ce-setting-control",
									children: o(Toggle, {
										label: "",
										checked: enableMeta,
										onCheckedUpdate: setEnableMeta
									})
								})]
							})
						]
					})
				}),
				o("div", {
					className: "ce-dialog-footer",
					children: o("button", {
						className: "ce-button ce-button-green ce-button-strong",
						onClick: () => onOpenChange(false),
						children: t("Save")
					})
				}),
				o("button", {
					className: "ce-icon-button ce-close-button",
					"aria-label": "Close",
					onClick: () => onOpenChange(false),
					children: o(IconCross, {})
				})
			]
		});
	};
	_css("/*\n * The exporter owns all of its styles. The only things it takes from\n * ChatGPT are the theme variables below, each with a fallback so the UI\n * still works when ChatGPT renames or drops one, and the light/dark switch.\n */\n\nhtml {\n    --ce-text-primary: var(--color-text-primary, #0d0d0d);\n    --ce-text-secondary: var(--color-text-secondary, #5d5d5d);\n    --ce-text-tertiary: var(--color-text-tertiary, #8f8f8f);\n    --ce-border: var(--color-token-border-default, #0000001a);\n    --ce-border-light: var(--color-token-border-light, #0000000d);\n    --ce-hover: var(--color-token-list-hover-background, #0000000d);\n    /* ChatGPT's switches use this, and it follows the accent in Appearance. */\n    --ce-accent: var(--color-chart-blue, #3a83f7);\n    --ce-menu-arrow: var(--sidebar-surface-secondary, #ececec);\n\n    --ce-control-border: #6f6e77;\n    --ce-menu-surface: #ffffff;\n    --ce-menu-border: #0d0d0d26;\n    --ce-dialog-surface: #f3f3f3;\n    --ce-dialog-surface-plain: #ffffff;\n    --ce-card-surface: #ffffff;\n    --ce-input-surface: #fafafa;\n    --ce-track: rgb(229 231 235);\n    --ce-list-header-surface: #f9fafb;\n}\n\n:is(.dark, [data-theme=\"dark\"]) {\n    --ce-text-primary: var(--color-text-primary, #ededed);\n    --ce-text-secondary: var(--color-text-secondary, #cdcdcd);\n    --ce-text-tertiary: var(--color-text-tertiary, #afafaf);\n    --ce-border: var(--color-token-border-default, #ffffff26);\n    --ce-border-light: var(--color-token-border-light, #ffffff0d);\n    --ce-hover: var(--color-token-list-hover-background, #ffffff1a);\n    --ce-menu-arrow: var(--sidebar-surface-secondary, #212121);\n\n    --ce-menu-surface: #2a2a2a;\n    --ce-menu-border: var(--color-token-border-default, #ffffff26);\n    --ce-dialog-surface: #2a2a2a;\n    --ce-dialog-surface-plain: #2a2a2a;\n    --ce-card-surface: rgb(255 255 255 / 5%);\n    --ce-input-surface: #2f2f2f;\n    --ce-track: rgb(255 255 255 / 10%);\n    --ce-list-header-surface: #1f2937;\n}\n\n/*\n * Reset everything under our roots, so ChatGPT's base styles neither help\n * nor break us. :where() keeps it at zero specificity, so any of our own\n * class rules win over it.\n */\n:where(.ce-root, .ce-root *, .ce-root ::before, .ce-root ::after) {\n    box-sizing: border-box;\n    margin: 0;\n    padding: 0;\n    border: 0 solid;\n}\n\n:where(.ce-root :is(button, input, select, textarea)) {\n    font: inherit;\n    color: inherit;\n}\n\n/* A background drops the native look of a range input, so leave it alone. */\n:where(.ce-root :is(button, input:not([type=\"range\"]), select, textarea)) {\n    background-color: transparent;\n}\n\n:where(.ce-root :is(button, select, [role=\"button\"])) {\n    cursor: pointer;\n}\n\n:where(.ce-root :is(ul, ol)) {\n    list-style: none;\n}\n\n:where(.ce-root svg) {\n    display: block;\n    flex-shrink: 0;\n}\n\n:where(.ce-root [hidden]) {\n    display: none;\n}\n\n.ce-icon {\n    width: 1rem;\n    height: 1rem;\n}\n\n.ce-icon-sm {\n    width: 0.75rem;\n    height: 0.75rem;\n}\n\n.ce-icon-md {\n    width: 1.25rem;\n    height: 1.25rem;\n}\n\n.ce-icon-lg {\n    width: 1.5rem;\n    height: 1.5rem;\n}\n\n.ce-hstack {\n    display: flex;\n    align-items: center;\n    gap: 0.5rem;\n}\n\n.ce-mt-2 {\n    margin-top: 0.5rem;\n}\n\n.ce-truncate {\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n}\n\n@keyframes ce-fade-in {\n    from {\n        opacity: 0;\n    }\n    to {\n        opacity: 1;\n    }\n}\n\n@keyframes ce-slide-up {\n    from {\n        transform: translateY(100%);\n    }\n    to {\n        transform: translateY(0);\n    }\n}\n\n@keyframes ce-pointer-fade-in {\n    from {\n        opacity: 0;\n        pointer-events: none;\n    }\n    to {\n        opacity: 1;\n        pointer-events: auto;\n    }\n}\n\n@keyframes ce-rotate {\n    from {\n        transform: rotate(0deg);\n    }\n    to {\n        transform: rotate(360deg);\n    }\n}\n\n@keyframes ce-circular-dash {\n    0% {\n        stroke-dasharray: 1px, 200px;\n        stroke-dashoffset: 0;\n    }\n    50% {\n        stroke-dasharray: 100px, 200px;\n        stroke-dashoffset: -15px;\n    }\n    100% {\n        stroke-dasharray: 100px, 200px;\n        stroke-dashoffset: -125px;\n    }\n}\n");
	_css(".ce-timestamp {\n    display: block;\n    width: 100%;\n    font-size: 0.875rem;\n    line-height: 1.25rem;\n    text-align: right;\n    color: var(--ce-text-tertiary);\n}\n\nspan[data-time-format] {\n    display: none;\n}\n\nbody[data-time-format=\"12\"] span[data-time-format=\"12\"] {\n    display: inline;\n}\n\nbody[data-time-format=\"24\"] span[data-time-format=\"24\"] {\n    display: inline;\n}\n\n.ce-menu-item {\n    display: flex;\n    flex-shrink: 0;\n    align-items: center;\n    gap: 12px;\n    height: 46px;\n    border: 1px solid var(--ce-menu-border);\n    border-radius: 8px;\n    cursor: pointer;\n    transition: background-color 0.2s;\n}\n\n.ce-menu-item[disabled] {\n    filter: brightness(0.5);\n}\n\n.ce-menu-item:not([disabled]):hover {\n    background-color: var(--ce-hover);\n}\n\n.ce-menu-item-loading {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    width: 100%;\n    height: 100%;\n}\n\n.ce-nav-trigger {\n    min-width: 0;\n    border: 0;\n    color: var(--ce-text-primary);\n}\n\n.ce-nav-trigger .ce-menu-item-text {\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n}\n\n/* Same box as ChatGPT's sidebar rows, so the icon lines up with theirs. */\n.ce-nav-trigger-expanded {\n    margin: 0 0 8px;\n    padding-inline: 10px;\n}\n\n.ce-nav-trigger-collapsed {\n    width: 32px;\n    height: 32px;\n    margin: 0 auto 0.5rem;\n    padding: 0;\n    justify-content: center;\n    gap: 0;\n    border-radius: 8px;\n    color: var(--ce-text-secondary);\n}\n\n.ce-nav-trigger-collapsed .ce-menu-item-text {\n    display: none;\n}\n\n.ce-divider {\n    height: 1px;\n    background-color: var(--ce-border-light);\n}\n\n.ce-card {\n    display: grid;\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n    gap: 4px;\n    padding: 8px 4px;\n    color: var(--ce-text-primary);\n    background-color: var(--ce-menu-surface);\n    border-radius: 1rem;\n    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);\n    transition: opacity 0.2s;\n    animation: ce-fade-in 0.3s;\n}\n\n.ce-card-mobile {\n    animation: ce-slide-up 0.3s;\n}\n\n:is(.dark, [data-theme=\"dark\"]) .ce-card {\n    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3);\n}\n\n.ce-card .ce-menu-item {\n    column-gap: 8px;\n    padding-inline-start: 8px;\n}\n\n.ce-dialog .ce-menu-item {\n    padding-inline-start: 8px;\n}\n\n/* HoverCard sets left/top. ChatGPT's main column carries its own z-index,\n   so raise the card above it. Dialogs sit in the top layer, above this. */\n.ce-card {\n    position: fixed;\n    z-index: 999;\n}\n\n.ce-card-arrow {\n    position: absolute;\n    left: -8px;\n    fill: var(--ce-menu-arrow);\n    stroke: var(--ce-menu-border);\n}\n\n.ce-row-half {\n    grid-column: auto / span 1;\n}\n\n.ce-row-full {\n    grid-column: auto / span 2;\n}\n\n.ce-backdrop {\n    display: block;\n    position: fixed;\n    inset: 0;\n    background-color: rgba(0, 0, 0, 0.5);\n    animation: ce-pointer-fade-in 0.3s;\n}\n");
	_css("/* Native <dialog>: the backdrop replaces a separate overlay element. */\n.ce-dialog::backdrop {\n    background-color: rgba(0, 0, 0, 0.44);\n    animation: ce-fade-in 150ms cubic-bezier(0.16, 1, 0.3, 1);\n}\n\n.ce-dialog {\n    color: var(--ce-text-primary);\n    background-color: var(--ce-dialog-surface);\n    border-radius: 6px;\n    box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px;\n    position: fixed;\n    /* The UA sheet sets inset: 0 and margin: auto on a modal <dialog>. */\n    inset: 50% auto auto 50%;\n    margin: 0;\n    border: 0;\n    transform: translate(-50%, -50%);\n    width: 90vw;\n    max-width: 560px;\n    max-height: 85vh;\n    overflow: hidden;\n    padding: 16px 24px;\n    outline: none;\n    animation: ce-content-show 150ms cubic-bezier(0.16, 1, 0.3, 1);\n    display: flex;\n    flex-direction: column;\n}\n\n/* display: flex above would otherwise show a closed <dialog>. */\n.ce-dialog:not([open]) {\n    display: none;\n}\n\n.ce-dialog-plain {\n    background-color: var(--ce-dialog-surface-plain);\n}\n\n:is(.dark, [data-theme=\"dark\"]) .ce-dialog {\n    border: 1px solid #40414f;\n}\n\n.ce-dialog-title {\n    margin: 0 0 16px 0;\n    font-weight: 500;\n    font-size: 20px;\n    line-height: 1.5;\n    flex-shrink: 0;\n}\n\n.ce-dialog-body {\n    flex: 1;\n    min-height: 0;\n    overflow-y: auto;\n    overflow-x: hidden;\n}\n\n.ce-dialog-footer {\n    display: flex;\n    flex-shrink: 0;\n    justify-content: flex-end;\n    padding-top: 16px;\n}\n\n.ce-button {\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    border-radius: 4px;\n    padding: 0 15px;\n    font-size: 15px;\n    line-height: 1;\n    height: 35px;\n}\n.ce-button-strong {\n    font-weight: 700;\n}\n.ce-button-green {\n    background-color: #ddf3e4;\n    color: #18794e;\n}\n.ce-button-green:hover {\n    background-color: #ccebd7;\n}\n.ce-button-red {\n    background-color: #f9d9d9;\n    color: #a71d2a;\n}\n.ce-button-neutral {\n    color: #6f6e77;\n    border: 1px solid #6f6e77;\n    font-size: 13px;\n    height: 26px;\n    padding: 0 8px;\n}\n.ce-button-neutral:hover {\n    background-color: rgba(111, 110, 119, 0.1);\n}\n:is(.dark, [data-theme=\"dark\"]) .ce-button-neutral {\n    color: #a0a0a8;\n    border-color: #a0a0a8;\n}\n:is(.dark, [data-theme=\"dark\"]) .ce-button-neutral:hover {\n    background-color: rgba(160, 160, 168, 0.1);\n}\n.ce-button:disabled,\n.ce-button:disabled:hover {\n    opacity: 0.5;\n    color: #6f6e77;\n    background-color: #e0e0e0;\n    cursor: not-allowed;\n}\n\n.ce-icon-button {\n    border-radius: 100%;\n    height: 25px;\n    width: 25px;\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    color: var(--ce-text-secondary);\n}\n.ce-icon-button:hover {\n    background-color: var(--ce-hover);\n}\n\n.ce-close-button {\n    position: absolute;\n    top: 10px;\n    right: 10px;\n}\n\n.ce-input {\n    width: 100%;\n    flex: 1;\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    border-radius: 4px;\n    padding: 0 10px;\n    font-size: 15px;\n    line-height: 1;\n    color: var(--ce-text-primary);\n    background-color: var(--ce-input-surface);\n    box-shadow: 0 0 0 1px var(--ce-control-border);\n    height: 35px;\n    outline: none;\n}\n\n.ce-select {\n    appearance: none;\n    height: 2rem;\n    padding: 0 2rem 0 0.5rem;\n    width: auto;\n    min-width: 7.5rem;\n    border-radius: 4px;\n    color: var(--ce-text-primary);\n    background-color: var(--ce-input-surface);\n    /* Our own chevron, since appearance: none drops the native one. */\n    background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='%238f8f8f' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 6l4 4 4-4'/%3E%3C/svg%3E\");\n    background-repeat: no-repeat;\n    background-position: right 0.5rem center;\n    background-size: 1rem;\n    box-shadow: 0 0 0 1px var(--ce-control-border);\n}\n\n.ce-select:disabled {\n    opacity: 0.6;\n    cursor: not-allowed;\n}\n\n/* ── Export dialog ── */\n\n.ce-export-source {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    padding-bottom: 12px;\n    margin-bottom: 12px;\n    border-bottom: 1px solid var(--ce-border);\n    color: var(--ce-text-secondary);\n}\n\n.ce-project-select {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    margin-bottom: 12px;\n    color: var(--ce-text-secondary);\n}\n\n.ce-select-search {\n    width: 100%;\n    padding: 8px 16px;\n    border: 1px solid var(--ce-control-border);\n    border-bottom: none;\n    border-radius: 4px 4px 0 0;\n    font-size: 14px;\n    outline: none;\n    flex-shrink: 0;\n}\n.ce-select-search::placeholder {\n    color: var(--ce-text-tertiary);\n}\n\n.ce-select-toolbar {\n    display: flex;\n    align-items: center;\n    /* Minimum breathing room between the select-all label and the right\n       group once the auto margin collapses under pressure */\n    gap: 12px;\n    padding: 12px 16px;\n    border: 1px solid var(--ce-control-border);\n    border-bottom: none;\n    flex-shrink: 0;\n}\n\n/* CJK labels wrap per-character when the row is squeezed — never shrink it */\n.ce-select-toolbar .ce-checkbox {\n    white-space: nowrap;\n    flex-shrink: 0;\n}\n\n.ce-select-toolbar-end {\n    display: flex;\n    align-items: center;\n    gap: 8px;\n    margin-left: auto;\n    min-width: 0;\n}\n\n.ce-toolbar-loading {\n    display: flex;\n    align-items: center;\n    gap: 4px;\n    min-width: 0;\n    overflow: hidden;\n    white-space: nowrap;\n    font-size: 0.875rem;\n    color: var(--ce-text-tertiary);\n}\n\n.ce-toolbar-status {\n    flex-shrink: 0;\n    height: auto;\n    font-size: 0.75rem;\n    padding: 2px 2rem 2px 0.5rem;\n    width: 8.5rem;\n    text-overflow: ellipsis;\n}\n\n.ce-toolbar-hint {\n    min-width: 0;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n    font-size: 0.75rem;\n    color: var(--ce-text-tertiary);\n    /* Highest shrink factor: the hint collapses before the loading\n       indicator starts truncating */\n    flex-shrink: 99;\n}\n\n.ce-toolbar-count {\n    flex-shrink: 0;\n    white-space: nowrap;\n    font-size: 0.875rem;\n    font-weight: 500;\n    font-variant-numeric: tabular-nums;\n    color: var(--ce-text-tertiary);\n}\n\n.ce-select-list {\n    position: relative;\n    width: 100%;\n    flex: 1;\n    min-height: 120px;\n    padding: 12px 16px;\n    overflow-x: hidden;\n    overflow-y: auto;\n    border: 1px solid var(--ce-control-border);\n    border-radius: 0 0 4px 4px;\n    white-space: nowrap;\n}\n\n.ce-select-item {\n    display: flex;\n    align-items: center;\n    gap: 6px;\n    overflow: hidden;\n}\n\n.ce-select-item-empty {\n    color: var(--ce-text-tertiary);\n}\n\n.ce-select-item .ce-checkbox {\n    flex: 1;\n    min-width: 0;\n}\n\n.ce-select-item .ce-checkbox-label {\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n}\n\n.ce-starred {\n    flex-shrink: 0;\n    color: #f59e0b;\n}\n\n.ce-select-item-meta {\n    flex-shrink: 0;\n    font-size: 0.7rem;\n    color: var(--ce-text-tertiary);\n    white-space: nowrap;\n    font-variant-numeric: tabular-nums;\n    min-width: 6.5rem;\n    text-align: right;\n}\n.ce-select-item-meta-active {\n    color: var(--ce-text-secondary);\n    font-weight: 600;\n}\n\n/* ── Sortable column header row ── */\n.ce-list-header {\n    display: flex;\n    align-items: center;\n    padding: 0 16px;\n    border: 1px solid var(--ce-control-border);\n    border-bottom: none;\n    background: var(--ce-list-header-surface);\n    user-select: none;\n    flex-shrink: 0;\n}\n\n.ce-list-header-cell {\n    flex-shrink: 0;\n    font-size: 0.68rem;\n    font-weight: 600;\n    color: var(--ce-text-tertiary);\n    letter-spacing: 0.03em;\n    text-transform: uppercase;\n    padding: 5px 4px;\n    white-space: nowrap;\n    min-width: 6.5rem;\n    text-align: right;\n}\n.ce-list-header-cell:hover {\n    color: var(--ce-text-primary);\n}\n.ce-list-header-cell-title {\n    flex: 1;\n    text-align: left;\n    padding-left: 28px; /* align with checkbox label */\n}\n.ce-list-header-cell-active {\n    color: var(--ce-accent);\n}\n\n.ce-load-more {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    gap: 8px;\n    margin: 8px 0 4px;\n}\n\n.ce-muted-count {\n    font-size: 0.75rem;\n    font-variant-numeric: tabular-nums;\n    color: var(--ce-text-tertiary);\n}\n\n.ce-action-bar {\n    display: flex;\n    flex-wrap: wrap;\n    align-items: center;\n    gap: 8px;\n    margin-top: 12px;\n}\n\n.ce-action-bar > .ce-select {\n    flex-shrink: 0;\n}\n\n.ce-spacer {\n    flex-grow: 1;\n}\n\n.ce-batch-note {\n    margin-top: 6px;\n    font-size: 0.75rem;\n    text-align: right;\n    color: var(--ce-text-tertiary);\n}\n\n.ce-progress-header {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    gap: 8px;\n    margin: 8px 0 4px;\n}\n\n.ce-progress-name {\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n    font-size: 0.875rem;\n    color: var(--ce-text-secondary);\n}\n\n.ce-progress-count {\n    flex-shrink: 0;\n    font-size: 0.875rem;\n    font-variant-numeric: tabular-nums;\n    color: var(--ce-text-tertiary);\n}\n\n.ce-progress {\n    width: 100%;\n    height: 10px;\n    margin-bottom: 16px;\n    border-radius: 9999px;\n    background-color: var(--ce-track);\n}\n\n.ce-progress-bar {\n    height: 100%;\n    border-radius: 9999px;\n    background-color: var(--ce-accent);\n}\n\n.ce-progress-bar-waiting {\n    background-color: #f59e0b;\n}\n\n@media (max-width: 480px) {\n    .ce-dialog { max-height: 90vh; }\n    .ce-list-header-cell:last-child { display: none; }\n    .ce-select-item-meta:last-child { display: none; }\n    .ce-action-bar { justify-content: flex-end; }\n    .ce-action-bar > .ce-select { width: 100%; }\n    .ce-action-bar > .ce-spacer { display: none; }\n}\n\n@keyframes ce-content-show {\n    from {\n        opacity: 0;\n        transform: translate(-50%, -48%) scale(0.96);\n    }\n    to {\n        opacity: 1;\n        transform: translate(-50%, -50%) scale(1);\n    }\n}\n");
	function useCollapsedSidebar(container, isMobile) {
		const [isCollapsed, setIsCollapsed] = h(false);
		p$1(() => {
			if (isMobile) {
				setIsCollapsed(false);
				return;
			}
			let frame = 0;
			const observed = new Set();
			const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
			function sidebarElement() {
				return container.closest("nav, aside, [aria-label=\"Sidebar\"], [data-testid=\"sidebar\"]") ?? container.parentElement;
			}
			function observe(element) {
				if (!observer || !element || observed.has(element)) return;
				observer.observe(element);
				observed.add(element);
			}
			function update() {
				cancelAnimationFrame(frame);
				frame = requestAnimationFrame(() => {
					const parentWidth = container.parentElement?.getBoundingClientRect().width ?? 0;
					const sidebarWidth = sidebarElement()?.getBoundingClientRect().width ?? parentWidth;
					const nextCollapsed = parentWidth > 0 && parentWidth < 96 || sidebarWidth > 0 && sidebarWidth < 96;
					setIsCollapsed(nextCollapsed);
					container.toggleAttribute("data-ce-sidebar-collapsed", nextCollapsed);
					observe(container.parentElement);
					observe(sidebarElement());
				});
			}
			observe(container.parentElement);
			observe(sidebarElement());
			update();
			window.addEventListener("resize", update);
			return () => {
				cancelAnimationFrame(frame);
				window.removeEventListener("resize", update);
				observer?.disconnect();
				container.removeAttribute("data-ce-sidebar-collapsed");
			};
		}, [container, isMobile]);
		return isCollapsed;
	}
	function MenuInner({ container }) {
		const { t } = useTranslation();
		const [open, setOpen] = h(false);
		const [jsonOpen, setJsonOpen] = h(false);
		const [exportOpen, setExportOpen] = h(false);
		const [settingOpen, setSettingOpen] = h(false);
		const { format, enableTimestamp, timeStamp24H, enableMeta, exportMetaList } = useSettingContext();
		p$1(() => {
			if (enableTimestamp) document.body.setAttribute("data-time-format", timeStamp24H ? "24" : "12");
			else document.body.removeAttribute("data-time-format");
		}, [enableTimestamp, timeStamp24H]);
		const metaList = F$1(() => enableMeta ? exportMetaList : [], [enableMeta, exportMetaList]);
		const onClickText = T$1(() => exportToText(), []);
		const onClickPng = T$1(() => exportToPng(format), [format]);
		const onClickMarkdown = T$1(() => exportToMarkdown(format, metaList), [format, metaList]);
		const onClickHtml = T$1(() => exportToHtml(format, metaList), [format, metaList]);
		const onClickJSON = T$1(() => {
			setJsonOpen(true);
			return false;
		}, []);
		const onClickSetting = T$1(() => {
			setSettingOpen(true);
			return false;
		}, []);
		const onClickExportAll = T$1(() => {
			setExportOpen(true);
			return false;
		}, []);
		const onClickOfficialJSON = T$1(() => exportToJson(format), [format]);
		const onClickTavern = T$1(() => exportToTavern(format), [format]);
		const onClickOoba = T$1(() => exportToOoba(format), [format]);
		const isMobile = useWindowResize(() => window.innerWidth) < 768;
		const isCollapsedSidebar = useCollapsedSidebar(container, isMobile);
		return o(k$1, { children: [
			isMobile && open && o("div", {
				className: "ce-backdrop",
				onClick: () => setOpen(false)
			}),
			o(HoverCard, {
				open,
				onOpenChange: setOpen,
				keepMounted: jsonOpen || settingOpen || exportOpen,
				isMobile,
				width: isMobile ? 316 : 268,
				trigger: o(MenuItem, {
					className: isCollapsedSidebar ? "ce-nav-trigger ce-nav-trigger-collapsed" : "ce-nav-trigger ce-nav-trigger-expanded",
					text: t("ExportHelper"),
					ariaLabel: t("ExportHelper"),
					icon: IconArrowRightFromBracket,
					onClick: () => {
						setOpen(true);
						return true;
					}
				}),
				children: [
					o(MenuItem, {
						text: t("Setting"),
						icon: IconSetting,
						className: "ce-row-full",
						onClick: onClickSetting
					}),
					o(SettingDialog, {
						open: settingOpen,
						onOpenChange: setSettingOpen
					}),
					o(MenuItem, {
						text: t("Copy Text"),
						successText: t("Copied!"),
						icon: IconCopy,
						className: "ce-row-full",
						onClick: onClickText
					}),
					o(MenuItem, {
						text: t("Screenshot"),
						icon: IconCamera,
						className: "ce-row-half",
						onClick: onClickPng
					}),
					o(MenuItem, {
						text: t("Markdown"),
						icon: IconMarkdown,
						className: "ce-row-half",
						onClick: onClickMarkdown
					}),
					o(MenuItem, {
						text: t("HTML"),
						icon: FileCode,
						className: "ce-row-half",
						onClick: onClickHtml
					}),
					o(MenuItem, {
						text: t("JSON"),
						icon: IconJSON,
						className: "ce-row-half",
						onClick: onClickJSON
					}),
					o(Dialog, {
						open: jsonOpen,
						onOpenChange: setJsonOpen,
						title: t("JSON"),
						style: { width: "320px" },
						children: [
							o(MenuItem, {
								text: t("OpenAI Official Format"),
								icon: IconCopy,
								className: "ce-row-full",
								onClick: onClickOfficialJSON
							}),
							o(MenuItem, {
								text: "JSONL (TavernAI, SillyTavern)",
								icon: IconCopy,
								className: "ce-row-full",
								onClick: onClickTavern
							}),
							o(MenuItem, {
								text: "Ooba (text-generation-webui)",
								icon: IconCopy,
								className: "ce-row-full",
								onClick: onClickOoba
							})
						]
					}),
					o(MenuItem, {
						text: t("Export All"),
						icon: IconZip,
						className: "ce-row-full",
						onClick: onClickExportAll
					}),
					o(ExportDialog, {
						format,
						open: exportOpen,
						onOpenChange: setExportOpen
					})
				]
			}),
			!isCollapsedSidebar && o(Divider, {})
		] });
	}
	function Menu({ container }) {
		return o(SettingProvider, { children: o(MenuInner, { container }) });
	}
	var PROFILE_BUTTON_SELECTOR = "[data-testid=\"accounts-profile-button\"]";
	var SIDEBAR_SCROLL_SELECTOR = "[data-app-action-sidebar-scroll]";
	var AUTOMATIONS_SELECTOR = "[data-sidebar-destination=\"builtin:automations\"]";
	var MESSAGE_UNIT_SELECTOR = "[data-chatgpt-conversation-selection-target] [data-chatgpt-search-message-ids]";
	var RAIL_MENU_BUTTON_SELECTOR = "[data-app-navigation-rail] button[aria-haspopup=\"menu\"]";
	main();
	function main() {
		watchTemporaryChatId();
		onloadSafe(() => {
			console.log("[Exporter] Loaded");
			const styleEl = document.createElement("style");
			styleEl.id = "sentinel-css";
			document.head.append(styleEl);
			const injectionMap = new Map();
			const injectNavMenu = ({ target, insert }) => {
				if (injectionMap.has(target)) return;
				console.log("[Exporter] Injecting nav", target);
				const container = getMenuContainer();
				injectionMap.set(target, container);
				insert(container);
			};
			const syncNavMenu = () => {
				const mounts = getNavMenuMounts();
				const activeTargets = new Set(mounts.map(({ target }) => target));
				injectionMap.forEach((container, target) => {
					if (!target.isConnected || !container.isConnected || !activeTargets.has(target)) {
						container.remove();
						injectionMap.delete(target);
					}
				});
				mounts.forEach(injectNavMenu);
			};
			for (const selector of [
				PROFILE_BUTTON_SELECTOR,
				SIDEBAR_SCROLL_SELECTOR,
				RAIL_MENU_BUTTON_SELECTOR,
				AUTOMATIONS_SELECTOR
			]) import_sentinel_umd.default.on(selector, syncNavMenu);
			syncNavMenu();
			setInterval(syncNavMenu, 1e3);
			if (isSharePage()) import_sentinel_umd.default.on(`div[role="presentation"] > .w-full > div >.flex.w-full`, (target) => {
				target.prepend(getMenuContainer());
			});
			watchMessageTimestamps();
		});
	}
	function watchMessageTimestamps() {
		let chatId = "";
		let createTimes = Promise.resolve(new Map());
		const missingIds = new Set();
		let refetch = null;
		const loadCreateTimes = async (id) => {
			const conversation = await fetchConversation(id);
			const times = new Map();
			Object.values(conversation.mapping).forEach(({ message }) => {
				if (message?.create_time) times.set(message.id, message.create_time);
			});
			return times;
		};
		const findCreateTime = (times, ids) => {
			for (let i = ids.length - 1; i >= 0; i--) {
				const time = times.get(ids[i]);
				if (time) return time;
			}
			return null;
		};
		const stamp = async (unit) => {
			if (!document.body.hasAttribute("data-time-format")) return;
			if (isSharePage()) return;
			if (unit.parentElement?.closest("[data-chatgpt-search-message-ids]")) return;
			const currentChatId = getChatIdFromUrl();
			if (!currentChatId) return;
			if (currentChatId !== chatId) {
				chatId = currentChatId;
				missingIds.clear();
				refetch = null;
				createTimes = loadCreateTimes(chatId).catch(() => new Map());
			}
			const ids = unit.getAttribute("data-chatgpt-search-message-ids")?.split(/\s+/).filter(Boolean) ?? [];
			if (ids.length === 0) return;
			let createTime = findCreateTime(await createTimes, ids);
			if (!createTime && ids.some((id) => !missingIds.has(id)) && currentChatId === chatId) {
				ids.forEach((id) => missingIds.add(id));
				refetch ??= loadCreateTimes(chatId).catch(() => new Map()).finally(() => {
					refetch = null;
				});
				createTimes = refetch;
				createTime = findCreateTime(await createTimes, ids);
			}
			if (!createTime || !unit.isConnected || unit.querySelector(":scope > time[data-ce-timestamp]")) return;
			unit.append(createTimestamp(createTime));
		};
		import_sentinel_umd.default.on(MESSAGE_UNIT_SELECTOR, stamp);
		new MutationObserver(() => {
			document.querySelectorAll(MESSAGE_UNIT_SELECTOR).forEach(stamp);
		}).observe(document.body, {
			attributes: true,
			attributeFilter: ["data-time-format"]
		});
	}
	function createTimestamp(createTime) {
		const date = new Date(createTime * 1e3);
		const timestamp = document.createElement("time");
		timestamp.className = "ce-timestamp";
		timestamp.setAttribute("data-ce-timestamp", "");
		timestamp.dateTime = date.toISOString();
		timestamp.title = date.toLocaleString();
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
		timestamp.append(hour12, hour24);
		return timestamp;
	}
	function getMenuContainer() {
		const container = document.createElement("div");
		container.className = "ce-root";
		container.style.zIndex = "99";
		D$1(o(Menu, { container }), container);
		return container;
	}
	function getNavMenuInsertionTarget(target) {
		const wrapper = target.parentElement;
		if (!wrapper || wrapper.children.length !== 1) return target;
		return wrapper;
	}
	function getNavMenuMounts() {
		const profileButtons = Array.from(document.querySelectorAll(PROFILE_BUTTON_SELECTOR));
		if (profileButtons.length > 0) return profileButtons.map((target) => ({
			target,
			insert: (container) => getNavMenuInsertionTarget(target).before(container)
		}));
		const mounts = [];
		Array.from(document.querySelectorAll(SIDEBAR_SCROLL_SELECTOR)).forEach((scrollRoot) => {
			const footer = [scrollRoot.nextElementSibling, scrollRoot.parentElement?.nextElementSibling].find((el) => el?.querySelector("button[aria-haspopup=\"menu\"]"));
			if (footer) mounts.push({
				target: footer,
				insert: (container) => {
					Object.assign(container.style, {
						paddingInline: "var(--padding-row-x)",
						paddingTop: "8px"
					});
					footer.prepend(container);
				}
			});
		});
		const railMenuButton = document.querySelector(RAIL_MENU_BUTTON_SELECTOR);
		const rail = railMenuButton?.closest("[data-app-navigation-rail]");
		const railRow = rail && Array.from(rail.children).find((row) => row.contains(railMenuButton));
		if (railMenuButton && railRow) mounts.push({
			target: railMenuButton,
			insert: (container) => {
				container.style.pointerEvents = "auto";
				railRow.before(container);
			}
		});
		if (mounts.length > 0) return mounts;
		return Array.from(document.querySelectorAll(AUTOMATIONS_SELECTOR)).map((target) => ({
			target,
			insert: (container) => getNavMenuInsertionTarget(target).before(container)
		}));
	}
})(JSZip, window);
