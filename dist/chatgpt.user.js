// ==UserScript==
// @name               ChatGPT Exporter
// @name:zh-CN         ChatGPT Exporter
// @name:zh-TW         ChatGPT Exporter
// @namespace          pionxzh
// @version            2.35.2
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
	var s$8 = new Set();
	var _css = async (t) => {
		if (s$8.has(t)) return;
		s$8.add(t);
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
	var n$2;
	var l$5;
	var u$6;
	var i$6;
	var o$9;
	var r$5;
	var f$4;
	var e$3;
	var c$5 = {};
	var s$7 = [];
	var a$4 = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
	var h$5 = Array.isArray;
	function v$3(n, l) {
		for (var u in l) n[u] = l[u];
		return n;
	}
	function p$7(n) {
		var l = n.parentNode;
		l && l.removeChild(n);
	}
	function y$6(l, u, t) {
		var i, o, r, f = {};
		for (r in u) "key" == r ? i = u[r] : "ref" == r ? o = u[r] : f[r] = u[r];
		if (arguments.length > 2 && (f.children = arguments.length > 3 ? n$2.call(arguments, 2) : t), "function" == typeof l && null != l.defaultProps) for (r in l.defaultProps) void 0 === f[r] && (f[r] = l.defaultProps[r]);
		return d$6(l, f, i, o, null);
	}
	function d$6(n, t, i, o, r) {
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
			__v: null == r ? ++u$6 : r
		};
		return null == r && null != l$5.vnode && l$5.vnode(f), f;
	}
	function _$2() {
		return { current: null };
	}
	function k$3(n) {
		return n.children;
	}
	function b$4(n, l) {
		this.props = n, this.context = l;
	}
	function g$5(n, l) {
		if (null == l) return n.__ ? g$5(n.__, n.__.__k.indexOf(n) + 1) : null;
		for (var u; l < n.__k.length; l++) if (null != (u = n.__k[l]) && null != u.__e) return u.__e;
		return "function" == typeof n.type ? g$5(n) : null;
	}
	function m$3(n) {
		var l, u;
		if (null != (n = n.__) && null != n.__c) {
			for (n.__e = n.__c.base = null, l = 0; l < n.__k.length; l++) if (null != (u = n.__k[l]) && null != u.__e) {
				n.__e = n.__c.base = u.__e;
				break;
			}
			return m$3(n);
		}
	}
	function w$5(n) {
		(!n.__d && (n.__d = !0) && i$6.push(n) && !x$4.__r++ || o$9 !== l$5.debounceRendering) && ((o$9 = l$5.debounceRendering) || r$5)(x$4);
	}
	function x$4() {
		var n, l, u, t, o, r, e, c, s;
		for (i$6.sort(f$4); n = i$6.shift();) n.__d && (l = i$6.length, t = void 0, o = void 0, r = void 0, c = (e = (u = n).__v).__e, (s = u.__P) && (t = [], o = [], (r = v$3({}, e)).__v = e.__v + 1, L$3(s, e, r, u.__n, void 0 !== s.ownerSVGElement, null != e.__h ? [c] : null, t, null == c ? g$5(e) : c, e.__h, o), M$3(t, e, o), e.__e != c && m$3(e)), i$6.length > l && i$6.sort(f$4));
		x$4.__r = 0;
	}
	function P$3(n, l, u, t, i, o, r, f, e, a, v) {
		var p, y, _, b, m, w, x, P, C, H = 0, I = t && t.__k || s$7, T = I.length, j = T, z = l.length;
		for (u.__k = [], p = 0; p < z; p++) null != (b = u.__k[p] = null == (b = l[p]) || "boolean" == typeof b || "function" == typeof b ? null : "string" == typeof b || "number" == typeof b || "bigint" == typeof b ? d$6(null, b, null, null, b) : h$5(b) ? d$6(k$3, { children: b }, null, null, null) : b.__b > 0 ? d$6(b.type, b.props, b.key, b.ref ? b.ref : null, b.__v) : b) ? (b.__ = u, b.__b = u.__b + 1, -1 === (P = A$4(b, I, x = p + H, j)) ? _ = c$5 : (_ = I[P] || c$5, I[P] = void 0, j--), L$3(n, b, _, i, o, r, f, e, a, v), m = b.__e, (y = b.ref) && _.ref != y && (_.ref && O$2(_.ref, null, b), v.push(y, b.__c || m, b)), null != m && (w ??= m, (C = _ === c$5 || null === _.__v) ? -1 == P && H-- : P !== x && (P === x + 1 ? H++ : P > x ? j > z - x ? H += P - x : H-- : H = P < x && P == x - 1 ? P - x : 0), x = p + H, "function" != typeof b.type || P === x && _.__k !== b.__k ? "function" == typeof b.type || P === x && !C ? void 0 !== b.__d ? (e = b.__d, b.__d = void 0) : e = m.nextSibling : e = S$3(n, m, e) : e = $$1(b, e, n), "function" == typeof u.type && (u.__d = e))) : (_ = I[p]) && null == _.key && _.__e && (_.__e == e && (e = g$5(_)), q$2(_, _, !1), I[p] = null);
		for (u.__e = w, p = T; p--;) null != I[p] && ("function" == typeof u.type && null != I[p].__e && I[p].__e == u.__d && (u.__d = I[p].__e.nextSibling), q$2(I[p], I[p]));
	}
	function $$1(n, l, u) {
		for (var t, i = n.__k, o = 0; i && o < i.length; o++) (t = i[o]) && (t.__ = n, l = "function" == typeof t.type ? $$1(t, l, u) : S$3(u, t.__e, l));
		return l;
	}
	function C$2(n, l) {
		return l = l || [], null == n || "boolean" == typeof n || (h$5(n) ? n.some(function(n) {
			C$2(n, l);
		}) : l.push(n)), l;
	}
	function S$3(n, l, u) {
		return null == u || u.parentNode !== n ? n.insertBefore(l, null) : l == u && null != l.parentNode || n.insertBefore(l, u), l.nextSibling;
	}
	function A$4(n, l, u, t) {
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
	function H$3(n, l, u, t, i) {
		var o;
		for (o in u) "children" === o || "key" === o || o in l || T$5(n, o, null, u[o], t);
		for (o in l) i && "function" != typeof l[o] || "children" === o || "key" === o || "value" === o || "checked" === o || u[o] === l[o] || T$5(n, o, l[o], u[o], t);
	}
	function I$2(n, l, u) {
		"-" === l[0] ? n.setProperty(l, null == u ? "" : u) : n[l] = null == u ? "" : "number" != typeof u || a$4.test(l) ? u : u + "px";
	}
	function T$5(n, l, u, t, i) {
		var o;
		n: if ("style" === l) if ("string" == typeof u) n.style.cssText = u;
		else {
			if ("string" == typeof t && (n.style.cssText = t = ""), t) for (l in t) u && l in u || I$2(n.style, l, "");
			if (u) for (l in u) t && u[l] === t[l] || I$2(n.style, l, u[l]);
		}
		else if ("o" === l[0] && "n" === l[1]) o = l !== (l = l.replace(/(PointerCapture)$|Capture$/, "$1")), l = l.toLowerCase() in n ? l.toLowerCase().slice(2) : l.slice(2), n.l || (n.l = {}), n.l[l + o] = u, u ? t || n.addEventListener(l, o ? z$3 : j$3, o) : n.removeEventListener(l, o ? z$3 : j$3, o);
		else if ("dangerouslySetInnerHTML" !== l) {
			if (i) l = l.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
			else if ("width" !== l && "height" !== l && "href" !== l && "list" !== l && "form" !== l && "tabIndex" !== l && "download" !== l && "rowSpan" !== l && "colSpan" !== l && l in n) try {
				n[l] = null == u ? "" : u;
				break n;
			} catch (n) {}
			"function" == typeof u || (null == u || !1 === u && "-" !== l[4] ? n.removeAttribute(l) : n.setAttribute(l, u));
		}
	}
	function j$3(n) {
		return this.l[n.type + !1](l$5.event ? l$5.event(n) : n);
	}
	function z$3(n) {
		return this.l[n.type + !0](l$5.event ? l$5.event(n) : n);
	}
	function L$3(n, u, t, i, o, r, f, e, c, s) {
		var a, p, y, d, _, g, m, w, x, $, C, S, A, H, I, T = u.type;
		if (void 0 !== u.constructor) return null;
		null != t.__h && (c = t.__h, e = u.__e = t.__e, u.__h = null, r = [e]), (a = l$5.__b) && a(u);
		n: if ("function" == typeof T) try {
			if (w = u.props, x = (a = T.contextType) && i[a.__c], $ = a ? x ? x.props.value : a.__ : i, t.__c ? m = (p = u.__c = t.__c).__ = p.__E : ("prototype" in T && T.prototype.render ? u.__c = p = new T(w, $) : (u.__c = p = new b$4(w, $), p.constructor = T, p.render = B$2), x && x.sub(p), p.props = w, p.state || (p.state = {}), p.context = $, p.__n = i, y = p.__d = !0, p.__h = [], p._sb = []), p.__s ?? (p.__s = p.state), null != T.getDerivedStateFromProps && (p.__s == p.state && (p.__s = v$3({}, p.__s)), v$3(p.__s, T.getDerivedStateFromProps(w, p.__s))), d = p.props, _ = p.state, p.__v = u, y) null == T.getDerivedStateFromProps && null != p.componentWillMount && p.componentWillMount(), null != p.componentDidMount && p.__h.push(p.componentDidMount);
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
			if (p.context = $, p.props = w, p.__P = n, p.__e = !1, S = l$5.__r, A = 0, "prototype" in T && T.prototype.render) {
				for (p.state = p.__s, p.__d = !1, S && S(u), a = p.render(p.props, p.state, p.context), H = 0; H < p._sb.length; H++) p.__h.push(p._sb[H]);
				p._sb = [];
			} else do
				p.__d = !1, S && S(u), a = p.render(p.props, p.state, p.context), p.state = p.__s;
			while (p.__d && ++A < 25);
			p.state = p.__s, null != p.getChildContext && (i = v$3(v$3({}, i), p.getChildContext())), y || null == p.getSnapshotBeforeUpdate || (g = p.getSnapshotBeforeUpdate(d, _)), P$3(n, h$5(I = null != a && a.type === k$3 && null == a.key ? a.props.children : a) ? I : [I], u, t, i, o, r, f, e, c, s), p.base = u.__e, u.__h = null, p.__h.length && f.push(p), m && (p.__E = p.__ = null);
		} catch (n) {
			u.__v = null, (c || null != r) && (u.__e = e, u.__h = !!c, r[r.indexOf(e)] = null), l$5.__e(n, u, t);
		}
		else null == r && u.__v === t.__v ? (u.__k = t.__k, u.__e = t.__e) : u.__e = N$3(t.__e, u, t, i, o, r, f, c, s);
		(a = l$5.diffed) && a(u);
	}
	function M$3(n, u, t) {
		for (var i = 0; i < t.length; i++) O$2(t[i], t[++i], t[++i]);
		l$5.__c && l$5.__c(u, n), n.some(function(u) {
			try {
				n = u.__h, u.__h = [], n.some(function(n) {
					n.call(u);
				});
			} catch (n) {
				l$5.__e(n, u.__v);
			}
		});
	}
	function N$3(l, u, t, i, o, r, f, e, s) {
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
			if (r = r && n$2.call(l.childNodes), v = (d = t.props || c$5).dangerouslySetInnerHTML, y = _.dangerouslySetInnerHTML, !e) {
				if (null != r) for (d = {}, b = 0; b < l.attributes.length; b++) d[l.attributes[b].name] = l.attributes[b].value;
				(y || v) && (y && (v && y.__html == v.__html || y.__html === l.innerHTML) || (l.innerHTML = y && y.__html || ""));
			}
			if (H$3(l, _, d, o, e), y) u.__k = [];
			else if (P$3(l, h$5(b = u.props.children) ? b : [b], u, t, i, o && "foreignObject" !== k, r, f, r ? r[0] : t.__k && g$5(t, 0), e, s), null != r) for (b = r.length; b--;) null != r[b] && p$7(r[b]);
			e || ("value" in _ && void 0 !== (b = _.value) && (b !== l.value || "progress" === k && !b || "option" === k && b !== d.value) && T$5(l, "value", b, d.value, !1), "checked" in _ && void 0 !== (b = _.checked) && b !== l.checked && T$5(l, "checked", b, d.checked, !1));
		}
		return l;
	}
	function O$2(n, u, t) {
		try {
			"function" == typeof n ? n(u) : n.current = u;
		} catch (n) {
			l$5.__e(n, t);
		}
	}
	function q$2(n, u, t) {
		var i, o;
		if (l$5.unmount && l$5.unmount(n), (i = n.ref) && (i.current && i.current !== n.__e || O$2(i, null, u)), null != (i = n.__c)) {
			if (i.componentWillUnmount) try {
				i.componentWillUnmount();
			} catch (n) {
				l$5.__e(n, u);
			}
			i.base = i.__P = null, n.__c = void 0;
		}
		if (i = n.__k) for (o = 0; o < i.length; o++) i[o] && q$2(i[o], u, t || "function" != typeof n.type);
		t || null == n.__e || p$7(n.__e), n.__ = n.__e = n.__d = void 0;
	}
	function B$2(n, l, u) {
		return this.constructor(n, u);
	}
	function D$4(u, t, i) {
		var o, r, f, e;
		l$5.__ && l$5.__(u, t), r = (o = "function" == typeof i) ? null : i && i.__k || t.__k, f = [], e = [], L$3(t, u = (!o && i || t).__k = y$6(k$3, null, [u]), r || c$5, c$5, void 0 !== t.ownerSVGElement, !o && i ? [i] : r ? null : t.firstChild ? n$2.call(t.childNodes) : null, f, !o && i ? i : r ? r.__e : t.firstChild, o, e), M$3(f, u, e);
	}
	function E$2(n, l) {
		D$4(n, l, E$2);
	}
	function F$2(l, u, t) {
		var i, o, r, f, e = v$3({}, l.props);
		for (r in l.type && l.type.defaultProps && (f = l.type.defaultProps), u) "key" == r ? i = u[r] : "ref" == r ? o = u[r] : e[r] = void 0 === u[r] && void 0 !== f ? f[r] : u[r];
		return arguments.length > 2 && (e.children = arguments.length > 3 ? n$2.call(arguments, 2) : t), d$6(l.type, e, i || l.key, o || l.ref, null);
	}
	function G$1(n, l) {
		var u = {
			__c: l = "__cC" + e$3++,
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
						n.__e = !0, w$5(n);
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
	n$2 = s$7.slice, l$5 = { __e: function(n, l, u, t) {
		for (var i, o, r; l = l.__;) if ((i = l.__c) && !i.__) try {
			if ((o = i.constructor) && null != o.getDerivedStateFromError && (i.setState(o.getDerivedStateFromError(n)), r = i.__d), null != i.componentDidCatch && (i.componentDidCatch(n, t || {}), r = i.__d), r) return i.__E = i;
		} catch (l) {
			n = l;
		}
		throw n;
	} }, u$6 = 0, b$4.prototype.setState = function(n, l) {
		var u = null != this.__s && this.__s !== this.state ? this.__s : this.__s = v$3({}, this.state);
		"function" == typeof n && (n = n(v$3({}, u), this.props)), n && v$3(u, n), null != n && this.__v && (l && this._sb.push(l), w$5(this));
	}, b$4.prototype.forceUpdate = function(n) {
		this.__v && (this.__e = !0, n && this.__h.push(n), w$5(this));
	}, b$4.prototype.render = k$3, i$6 = [], r$5 = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, f$4 = function(n, l) {
		return n.__v.__b - l.__v.__b;
	}, x$4.__r = 0, e$3 = 0;
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
		return !!document.querySelector("[data-testid^=\"conversation-turn-\"]");
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
		const imageDetails = await fetchApi(fileDownloadApi(uri.replace("sediment://", "")));
		if (imageDetails.status === "error") {
			console.error("Failed to fetch image asset", imageDetails.error_code, imageDetails.error_message);
			return null;
		}
		const image = await fetch(imageDetails.download_url);
		return (await blobToDataURL(await image.blob())).replace(/^data:.*?;/, `data:${image.headers.get("content-type")};`);
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
	async function fetchConversation(chatId, shouldReplaceAssets) {
		if (chatId.startsWith("__share__")) {
			const id = chatId.replace("__share__", "");
			const shareConversation = await loadShareConversation(getConversationFromSharePage(), () => fetchApi(shareConversationApi(id)));
			if (shouldReplaceAssets) await replaceImageAssets(shareConversation);
			return {
				id,
				...shareConversation
			};
		}
		const conversation = await fetchApi(conversationApi(chatId));
		if (shouldReplaceAssets) await replaceImageAssets(conversation);
		return {
			id: chatId,
			...conversation
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
	async function fetchAllConversations(project = null, maxConversations = 1e3, onBatch, onHasMore) {
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
		constructor(retryAfterHeader) {
			super("Too Many Requests (429)");
			this.name = "RateLimitError";
			const secs = retryAfterHeader != null ? Number.parseInt(retryAfterHeader, 10) : NaN;
			this.retryAfterMs = Number.isFinite(secs) && secs > 0 ? secs * 1e3 : 3e4;
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
	function _extends() {
		_extends = Object.assign ? Object.assign.bind() : function(target) {
			for (var i = 1; i < arguments.length; i++) {
				var source = arguments[i];
				for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
			}
			return target;
		};
		return _extends.apply(this, arguments);
	}
	var t$3;
	var r$4;
	var u$5;
	var i$5;
	var o$8 = 0;
	var f$3 = [];
	var c$4 = [];
	var e$2 = l$5.__b;
	var a$3 = l$5.__r;
	var v$2 = l$5.diffed;
	var l$4 = l$5.__c;
	var m$2 = l$5.unmount;
	function d$5(t, u) {
		l$5.__h && l$5.__h(r$4, t, o$8 || u), o$8 = 0;
		var i = r$4.__H || (r$4.__H = {
			__: [],
			__h: []
		});
		return t >= i.__.length && i.__.push({ __V: c$4 }), i.__[t];
	}
	function h$4(n) {
		return o$8 = 1, s$6(B$1, n);
	}
	function s$6(n, u, i) {
		var o = d$5(t$3++, 2);
		if (o.t = n, !o.__c && (o.__ = [i ? i(u) : B$1(void 0, u), function(n) {
			var t = o.__N ? o.__N[0] : o.__[0], r = o.t(t, n);
			t !== r && (o.__N = [r, o.__[1]], o.__c.setState({}));
		}], o.__c = r$4, !r$4.u)) {
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
			r$4.u = !0;
			var c = r$4.shouldComponentUpdate, e = r$4.componentWillUpdate;
			r$4.componentWillUpdate = function(n, t, r) {
				if (this.__e) {
					var u = c;
					c = void 0, f(n, t, r), c = u;
				}
				e && e.call(this, n, t, r);
			}, r$4.shouldComponentUpdate = f;
		}
		return o.__N || o.__;
	}
	function p$6(u, i) {
		var o = d$5(t$3++, 3);
		!l$5.__s && z$2(o.__H, i) && (o.__ = u, o.i = i, r$4.__H.__h.push(o));
	}
	function y$5(u, i) {
		var o = d$5(t$3++, 4);
		!l$5.__s && z$2(o.__H, i) && (o.__ = u, o.i = i, r$4.__h.push(o));
	}
	function _$1(n) {
		return o$8 = 5, F$1(function() {
			return { current: n };
		}, []);
	}
	function A$3(n, t, r) {
		o$8 = 6, y$5(function() {
			return "function" == typeof n ? (n(t()), function() {
				return n(null);
			}) : n ? (n.current = t(), function() {
				return n.current = null;
			}) : void 0;
		}, null == r ? r : r.concat(n));
	}
	function F$1(n, r) {
		var u = d$5(t$3++, 7);
		return z$2(u.__H, r) ? (u.__V = n(), u.i = r, u.__h = n, u.__V) : u.__;
	}
	function T$4(n, t) {
		return o$8 = 8, F$1(function() {
			return n;
		}, t);
	}
	function q$1(n) {
		var u = r$4.context[n.__c], i = d$5(t$3++, 9);
		return i.c = n, u ? (i.__ ?? (i.__ = !0, u.sub(r$4)), u.props.value) : n.__;
	}
	function x$3(t, r) {
		l$5.useDebugValue && l$5.useDebugValue(r ? r(t) : t);
	}
	function P$2(n) {
		var u = d$5(t$3++, 10), i = h$4();
		return u.__ = n, r$4.componentDidCatch || (r$4.componentDidCatch = function(n, t) {
			u.__ && u.__(n, t), i[1](n);
		}), [i[0], function() {
			i[1](void 0);
		}];
	}
	function V$1() {
		var n = d$5(t$3++, 11);
		if (!n.__) {
			for (var u = r$4.__v; null !== u && !u.__m && null !== u.__;) u = u.__;
			var i = u.__m || (u.__m = [0, 0]);
			n.__ = "P" + i[0] + "-" + i[1]++;
		}
		return n.__;
	}
	function b$3() {
		for (var t; t = f$3.shift();) if (t.__P && t.__H) try {
			t.__H.__h.forEach(k$2), t.__H.__h.forEach(w$4), t.__H.__h = [];
		} catch (r) {
			t.__H.__h = [], l$5.__e(r, t.__v);
		}
	}
	l$5.__b = function(n) {
		r$4 = null, e$2 && e$2(n);
	}, l$5.__r = function(n) {
		a$3 && a$3(n), t$3 = 0;
		var i = (r$4 = n.__c).__H;
		i && (u$5 === r$4 ? (i.__h = [], r$4.__h = [], i.__.forEach(function(n) {
			n.__N && (n.__ = n.__N), n.__V = c$4, n.__N = n.i = void 0;
		})) : (i.__h.forEach(k$2), i.__h.forEach(w$4), i.__h = [], t$3 = 0)), u$5 = r$4;
	}, l$5.diffed = function(t) {
		v$2 && v$2(t);
		var o = t.__c;
		o && o.__H && (o.__H.__h.length && (1 !== f$3.push(o) && i$5 === l$5.requestAnimationFrame || ((i$5 = l$5.requestAnimationFrame) || j$2)(b$3)), o.__H.__.forEach(function(n) {
			n.i && (n.__H = n.i), n.__V !== c$4 && (n.__ = n.__V), n.i = void 0, n.__V = c$4;
		})), u$5 = r$4 = null;
	}, l$5.__c = function(t, r) {
		r.some(function(t) {
			try {
				t.__h.forEach(k$2), t.__h = t.__h.filter(function(n) {
					return !n.__ || w$4(n);
				});
			} catch (u) {
				r.some(function(n) {
					n.__h && (n.__h = []);
				}), r = [], l$5.__e(u, t.__v);
			}
		}), l$4 && l$4(t, r);
	}, l$5.unmount = function(t) {
		m$2 && m$2(t);
		var r, u = t.__c;
		u && u.__H && (u.__H.__.forEach(function(n) {
			try {
				k$2(n);
			} catch (n) {
				r = n;
			}
		}), u.__H = void 0, r && l$5.__e(r, u.__v));
	};
	var g$4 = "function" == typeof requestAnimationFrame;
	function j$2(n) {
		var t, r = function() {
			clearTimeout(u), g$4 && cancelAnimationFrame(t), setTimeout(n);
		}, u = setTimeout(r, 100);
		g$4 && (t = requestAnimationFrame(r));
	}
	function k$2(n) {
		var t = r$4, u = n.__c;
		"function" == typeof u && (n.__c = void 0, u()), r$4 = t;
	}
	function w$4(n) {
		var t = r$4;
		n.__c = n.__(), r$4 = t;
	}
	function z$2(n, t) {
		return !n || n.length !== t.length || t.some(function(t, r) {
			return t !== n[r];
		});
	}
	function B$1(n, t) {
		return "function" == typeof t ? t(n) : t;
	}
	var compat_module_exports = __exportAll({
		Children: () => O$1,
		Component: () => b$4,
		Fragment: () => k$3,
		PureComponent: () => w$3,
		StrictMode: () => yn,
		Suspense: () => U,
		SuspenseList: () => V,
		__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: () => ln,
		cloneElement: () => hn,
		createContext: () => G$1,
		createElement: () => y$6,
		createFactory: () => fn,
		createPortal: () => z$1,
		createRef: () => _$2,
		default: () => wn,
		findDOMNode: () => dn,
		flushSync: () => mn,
		forwardRef: () => k$1,
		hydrate: () => J,
		isElement: () => Cn,
		isFragment: () => sn,
		isValidElement: () => an,
		lazy: () => M$2,
		memo: () => x$2,
		render: () => G,
		startTransition: () => _n,
		unmountComponentAtNode: () => vn,
		unstable_batchedUpdates: () => pn,
		useCallback: () => T$4,
		useContext: () => q$1,
		useDebugValue: () => x$3,
		useDeferredValue: () => bn,
		useEffect: () => p$6,
		useErrorBoundary: () => P$2,
		useId: () => V$1,
		useImperativeHandle: () => A$3,
		useInsertionEffect: () => gn,
		useLayoutEffect: () => y$5,
		useMemo: () => F$1,
		useReducer: () => s$6,
		useRef: () => _$1,
		useState: () => h$4,
		useSyncExternalStore: () => En,
		useTransition: () => Sn,
		version: () => cn
	});
	function g$3(n, t) {
		for (var e in t) n[e] = t[e];
		return n;
	}
	function C$1(n, t) {
		for (var e in n) if ("__source" !== e && !(e in t)) return !0;
		for (var r in t) if ("__source" !== r && n[r] !== t[r]) return !0;
		return !1;
	}
	function E$1(n, t) {
		return n === t && (0 !== n || 1 / n == 1 / t) || n != n && t != t;
	}
	function w$3(n) {
		this.props = n;
	}
	function x$2(n, e) {
		function r(n) {
			var t = this.props.ref, r = t == n.ref;
			return !r && t && (t.call ? t(null) : t.current = null), e ? !e(this.props, n) || !r : C$1(this.props, n);
		}
		function u(e) {
			return this.shouldComponentUpdate = r, y$6(n, e);
		}
		return u.displayName = "Memo(" + (n.displayName || n.name) + ")", u.prototype.isReactComponent = !0, u.__f = !0, u;
	}
	(w$3.prototype = new b$4()).isPureReactComponent = !0, w$3.prototype.shouldComponentUpdate = function(n, t) {
		return C$1(this.props, n) || C$1(this.state, t);
	};
	var R$3 = l$5.__b;
	l$5.__b = function(n) {
		n.type && n.type.__f && n.ref && (n.props.ref = n.ref, n.ref = null), R$3 && R$3(n);
	};
	var N$2 = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.forward_ref") || 3911;
	function k$1(n) {
		function t(t) {
			var e = g$3({}, t);
			return delete e.ref, n(e, t.ref || null);
		}
		return t.$$typeof = N$2, t.render = t, t.prototype.isReactComponent = t.__f = !0, t.displayName = "ForwardRef(" + (n.displayName || n.name) + ")", t;
	}
	var A$2 = function(n, t) {
		return null == n ? null : C$2(C$2(n).map(t));
	};
	var O$1 = {
		map: A$2,
		forEach: A$2,
		count: function(n) {
			return n ? C$2(n).length : 0;
		},
		only: function(n) {
			var t = C$2(n);
			if (1 !== t.length) throw "Children.only";
			return t[0];
		},
		toArray: C$2
	};
	var T$3 = l$5.__e;
	l$5.__e = function(n, t, e, r) {
		if (n.then) {
			for (var u, o = t; o = o.__;) if ((u = o.__c) && u.__c) return t.__e ?? (t.__e = e.__e, t.__k = e.__k), u.__c(n, t);
		}
		T$3(n, t, e, r);
	};
	var F = l$5.unmount;
	function I$1(n, t, e) {
		return n && (n.__c && n.__c.__H && (n.__c.__H.__.forEach(function(n) {
			"function" == typeof n.__c && n.__c();
		}), n.__c.__H = null), null != (n = g$3({}, n)).__c && (n.__c.__P === e && (n.__c.__P = t), n.__c = null), n.__k = n.__k && n.__k.map(function(n) {
			return I$1(n, t, e);
		})), n;
	}
	function L$2(n, t, e) {
		return n && (n.__v = null, n.__k = n.__k && n.__k.map(function(n) {
			return L$2(n, t, e);
		}), n.__c && n.__c.__P === t && (n.__e && e.insertBefore(n.__e, n.__d), n.__c.__e = !0, n.__c.__P = e)), n;
	}
	function U() {
		this.__u = 0, this.t = null, this.__b = null;
	}
	function D$3(n) {
		var t = n.__.__c;
		return t && t.__a && t.__a(n);
	}
	function M$2(n) {
		var e, r, u;
		function o(o) {
			if (e || (e = n()).then(function(n) {
				r = n.default || n;
			}, function(n) {
				u = n;
			}), u) throw u;
			if (!r) throw e;
			return y$6(r, o);
		}
		return o.displayName = "Lazy", o.__f = !0, o;
	}
	function V() {
		this.u = null, this.o = null;
	}
	l$5.unmount = function(n) {
		var t = n.__c;
		t && t.__R && t.__R(), t && !0 === n.__h && (n.type = null), F && F(n);
	}, (U.prototype = new b$4()).__c = function(n, t) {
		var e = t.__c, r = this;
		r.t ??= [], r.t.push(e);
		var u = D$3(r.__v), o = !1, i = function() {
			o || (o = !0, e.__R = null, u ? u(l) : l());
		};
		e.__R = i;
		var l = function() {
			if (!--r.__u) {
				if (r.state.__a) {
					var n = r.state.__a;
					r.__v.__k[0] = L$2(n, n.__c.__P, n.__c.__O);
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
				this.__v.__k[0] = I$1(this.__b, r, o.__O = o.__P);
			}
			this.__b = null;
		}
		var i = e.__a && y$6(k$3, null, n.fallback);
		return i && (i.__h = null), [y$6(k$3, null, e.__a ? null : n.children), i];
	};
	var W$1 = function(n, t, e) {
		if (++e[1] === e[0] && n.o.delete(t), n.props.revealOrder && ("t" !== n.props.revealOrder[0] || !n.o.size)) for (e = n.u; e;) {
			for (; e.length > 3;) e.pop()();
			if (e[1] < e[0]) break;
			n.u = e = e[2];
		}
	};
	function P$1(n) {
		return this.getChildContext = function() {
			return n.context;
		}, n.children;
	}
	function j$1(n) {
		var e = this, r = n.i;
		e.componentWillUnmount = function() {
			D$4(null, e.l), e.l = null, e.i = null;
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
		}), D$4(y$6(P$1, { context: e.context }, n.__v), e.l);
	}
	function z$1(n, e) {
		var r = y$6(j$1, {
			__v: n,
			i: e
		});
		return r.containerInfo = e, r;
	}
	(V.prototype = new b$4()).__a = function(n) {
		var t = this, e = D$3(t.__v), r = t.o.get(n);
		return r[0]++, function(u) {
			var o = function() {
				t.props.revealOrder ? (r.push(u), W$1(t, n, r)) : u();
			};
			e ? e(o) : o();
		};
	}, V.prototype.render = function(n) {
		this.u = null, this.o = new Map();
		var t = C$2(n.children);
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
			W$1(n, e, t);
		});
	};
	var B = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.element") || 60103;
	var H$2 = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/;
	var Z$1 = /^on(Ani|Tra|Tou|BeforeInp|Compo)/;
	var Y$1 = /[A-Z0-9]/g;
	var $ = "undefined" != typeof document;
	var q = function(n) {
		return ("undefined" != typeof Symbol && "symbol" == typeof Symbol() ? /fil|che|rad/ : /fil|che|ra/).test(n);
	};
	function G(n, t, e) {
		return t.__k ?? (t.textContent = ""), D$4(n, t), "function" == typeof e && e(), n ? n.__c : null;
	}
	function J(n, t, e) {
		return E$2(n, t), "function" == typeof e && e(), n ? n.__c : null;
	}
	b$4.prototype.isReactComponent = {}, [
		"componentWillMount",
		"componentWillReceiveProps",
		"componentWillUpdate"
	].forEach(function(t) {
		Object.defineProperty(b$4.prototype, t, {
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
	var K = l$5.event;
	function Q() {}
	function X$1() {
		return this.cancelBubble;
	}
	function nn() {
		return this.defaultPrevented;
	}
	l$5.event = function(n) {
		return K && (n = K(n)), n.persist = Q, n.isPropagationStopped = X$1, n.isDefaultPrevented = nn, n.nativeEvent = n;
	};
	var tn;
	var en = {
		enumerable: !1,
		configurable: !0,
		get: function() {
			return this.class;
		}
	};
	var rn = l$5.vnode;
	l$5.vnode = function(n) {
		"string" == typeof n.type && function(n) {
			var t = n.props, e = n.type, u = {};
			for (var o in t) {
				var i = t[o];
				if (!("value" === o && "defaultValue" in t && null == i || $ && "children" === o && "noscript" === e || "class" === o || "className" === o)) {
					var l = o.toLowerCase();
					"defaultValue" === o && "value" in t && null == t.value ? o = "value" : "download" === o && !0 === i ? i = "" : "ondoubleclick" === l ? o = "ondblclick" : "onchange" !== l || "input" !== e && "textarea" !== e || q(t.type) ? "onfocus" === l ? o = "onfocusin" : "onblur" === l ? o = "onfocusout" : Z$1.test(o) ? o = l : -1 === e.indexOf("-") && H$2.test(o) ? o = o.replace(Y$1, "-$&").toLowerCase() : null === i && (i = void 0) : l = o = "oninput", "oninput" === l && u[o = l] && (o = "oninputCapture"), u[o] = i;
				}
			}
			"select" == e && u.multiple && Array.isArray(u.value) && (u.value = C$2(t.children).forEach(function(n) {
				n.props.selected = -1 != u.value.indexOf(n.props.value);
			})), "select" == e && null != u.defaultValue && (u.value = C$2(t.children).forEach(function(n) {
				n.props.selected = u.multiple ? -1 != u.defaultValue.indexOf(n.props.value) : u.defaultValue == n.props.value;
			})), t.class && !t.className ? (u.class = t.class, Object.defineProperty(u, "className", en)) : (t.className && !t.class || t.class && t.className) && (u.class = u.className = t.className), n.props = u;
		}(n), n.$$typeof = B, rn && rn(n);
	};
	var un = l$5.__r;
	l$5.__r = function(n) {
		un && un(n), tn = n.__c;
	};
	var on = l$5.diffed;
	l$5.diffed = function(n) {
		on && on(n);
		var t = n.props, e = n.__e;
		null != e && "textarea" === n.type && "value" in t && t.value !== e.value && (e.value = null == t.value ? "" : t.value), tn = null;
	};
	var ln = { ReactCurrentDispatcher: { current: { readContext: function(n) {
		return tn.__n[n.__c].props.value;
	} } } };
	var cn = "17.0.2";
	function fn(n) {
		return y$6.bind(null, n);
	}
	function an(n) {
		return !!n && n.$$typeof === B;
	}
	function sn(n) {
		return an(n) && n.type === k$3;
	}
	function hn(n) {
		return an(n) ? F$2.apply(null, arguments) : n;
	}
	function vn(n) {
		return !!n.__k && (D$4(null, n), !0);
	}
	function dn(n) {
		return n && (n.base || 1 === n.nodeType && n) || null;
	}
	var pn = function(n, t) {
		return n(t);
	};
	var mn = function(n, t) {
		return n(t);
	};
	var yn = k$3;
	function _n(n) {
		n();
	}
	function bn(n) {
		return n;
	}
	function Sn() {
		return [!1, _n];
	}
	var gn = y$5;
	var Cn = an;
	function En(n, t) {
		var e = t(), r = h$4({ h: {
			__: e,
			v: t
		} }), u = r[0].h, o = r[1];
		return y$5(function() {
			u.__ = e, u.v = t, E$1(u.__, t()) || o({ h: u });
		}, [
			n,
			e,
			t
		]), p$6(function() {
			return E$1(u.__, u.v()) || o({ h: u }), n(function() {
				E$1(u.__, u.v()) || o({ h: u });
			});
		}, [n]), e;
	}
	var wn = {
		useState: h$4,
		useId: V$1,
		useReducer: s$6,
		useEffect: p$6,
		useLayoutEffect: y$5,
		useInsertionEffect: gn,
		useTransition: Sn,
		useDeferredValue: bn,
		useSyncExternalStore: En,
		startTransition: _n,
		useRef: _$1,
		useImperativeHandle: A$3,
		useMemo: F$1,
		useCallback: T$4,
		useContext: q$1,
		useDebugValue: x$3,
		version: "17.0.2",
		Children: O$1,
		render: G,
		hydrate: J,
		unmountComponentAtNode: vn,
		createPortal: z$1,
		createElement: y$6,
		createContext: G$1,
		createFactory: fn,
		cloneElement: hn,
		createRef: _$2,
		Fragment: k$3,
		isValidElement: an,
		isElement: Cn,
		isFragment: sn,
		findDOMNode: dn,
		Component: b$4,
		PureComponent: w$3,
		memo: x$2,
		forwardRef: k$1,
		flushSync: mn,
		unstable_batchedUpdates: pn,
		StrictMode: yn,
		Suspense: U,
		SuspenseList: V,
		lazy: M$2,
		__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: ln
	};
	function $e42e1063c40fb3ef$export$b9ecd428b558ff10(originalEventHandler, ourEventHandler, { checkForDefaultPrevented = true } = {}) {
		return function handleEvent(event) {
			originalEventHandler === null || originalEventHandler === void 0 || originalEventHandler(event);
			if (checkForDefaultPrevented === false || !event.defaultPrevented) return ourEventHandler === null || ourEventHandler === void 0 ? void 0 : ourEventHandler(event);
		};
	}
	function $6ed0406888f73fc4$var$setRef(ref, value) {
		if (typeof ref === "function") ref(value);
		else if (ref !== null && ref !== void 0) ref.current = value;
	}
	function $6ed0406888f73fc4$export$43e446d32b3d21af(...refs) {
		return (node) => refs.forEach((ref) => $6ed0406888f73fc4$var$setRef(ref, node));
	}
	function $6ed0406888f73fc4$export$c7b2cbe3552a0d05(...refs) {
		return T$4($6ed0406888f73fc4$export$43e446d32b3d21af(...refs), refs);
	}
	function $c512c27ab02ef895$export$fd42f52fd3ae1109(rootComponentName, defaultContext) {
		const Context = G$1(defaultContext);
		function Provider(props) {
			const { children, ...context } = props;
			const value = F$1(() => context, Object.values(context));
			return y$6(Context.Provider, { value }, children);
		}
		function useContext(consumerName) {
			const context = q$1(Context);
			if (context) return context;
			if (defaultContext !== void 0) return defaultContext;
			throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
		}
		Provider.displayName = rootComponentName + "Provider";
		return [Provider, useContext];
	}
	function $c512c27ab02ef895$export$50c7b4e9d9f19c1(scopeName, createContextScopeDeps = []) {
		let defaultContexts = [];
		function $c512c27ab02ef895$export$fd42f52fd3ae1109(rootComponentName, defaultContext) {
			const BaseContext = G$1(defaultContext);
			const index = defaultContexts.length;
			defaultContexts = [...defaultContexts, defaultContext];
			function Provider(props) {
				const { scope, children, ...context } = props;
				const Context = (scope === null || scope === void 0 ? void 0 : scope[scopeName][index]) || BaseContext;
				const value = F$1(() => context, Object.values(context));
				return y$6(Context.Provider, { value }, children);
			}
			function useContext(consumerName, scope) {
				const context = q$1((scope === null || scope === void 0 ? void 0 : scope[scopeName][index]) || BaseContext);
				if (context) return context;
				if (defaultContext !== void 0) return defaultContext;
				throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
			}
			Provider.displayName = rootComponentName + "Provider";
			return [Provider, useContext];
		}
		const createScope = () => {
			const scopeContexts = defaultContexts.map((defaultContext) => {
				return G$1(defaultContext);
			});
			return function useScope(scope) {
				const contexts = (scope === null || scope === void 0 ? void 0 : scope[scopeName]) || scopeContexts;
				return F$1(() => ({ [`__scope${scopeName}`]: {
					...scope,
					[scopeName]: contexts
				} }), [scope, contexts]);
			};
		};
		createScope.scopeName = scopeName;
		return [$c512c27ab02ef895$export$fd42f52fd3ae1109, $c512c27ab02ef895$var$composeContextScopes(createScope, ...createContextScopeDeps)];
	}
	function $c512c27ab02ef895$var$composeContextScopes(...scopes) {
		const baseScope = scopes[0];
		if (scopes.length === 1) return baseScope;
		const createScope1 = () => {
			const scopeHooks = scopes.map((createScope) => ({
				useScope: createScope(),
				scopeName: createScope.scopeName
			}));
			return function useComposedScopes(overrideScopes) {
				const nextScopes1 = scopeHooks.reduce((nextScopes, { useScope, scopeName }) => {
					const currentScope = useScope(overrideScopes)[`__scope${scopeName}`];
					return {
						...nextScopes,
						...currentScope
					};
				}, {});
				return F$1(() => ({ [`__scope${baseScope.scopeName}`]: nextScopes1 }), [nextScopes1]);
			};
		};
		createScope1.scopeName = baseScope.scopeName;
		return createScope1;
	}
	var $9f79659886946c16$export$e5c5a5f917a5871c = Boolean(globalThis === null || globalThis === void 0 ? void 0 : globalThis.document) ? y$5 : () => {};
	var $1746a345f3d73bb7$var$useReactId = compat_module_exports["useId".toString()] || (() => void 0);
	var $1746a345f3d73bb7$var$count = 0;
	function $1746a345f3d73bb7$export$f680877a34711e37(deterministicId) {
		const [id, setId] = h$4($1746a345f3d73bb7$var$useReactId());
		$9f79659886946c16$export$e5c5a5f917a5871c(() => {
			if (!deterministicId) setId((reactId) => reactId !== null && reactId !== void 0 ? reactId : String($1746a345f3d73bb7$var$count++));
		}, [deterministicId]);
		return deterministicId || (id ? `radix-${id}` : "");
	}
	function $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(callback) {
		const callbackRef = _$1(callback);
		p$6(() => {
			callbackRef.current = callback;
		});
		return F$1(() => (...args) => {
			var _callbackRef$current;
			return (_callbackRef$current = callbackRef.current) === null || _callbackRef$current === void 0 ? void 0 : _callbackRef$current.call(callbackRef, ...args);
		}, []);
	}
	function $71cd76cc60e0454e$export$6f32135080cb4c3({ prop, defaultProp, onChange = () => {} }) {
		const [uncontrolledProp, setUncontrolledProp] = $71cd76cc60e0454e$var$useUncontrolledState({
			defaultProp,
			onChange
		});
		const isControlled = prop !== void 0;
		const value1 = isControlled ? prop : uncontrolledProp;
		const handleChange = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onChange);
		return [value1, T$4((nextValue) => {
			if (isControlled) {
				const value = typeof nextValue === "function" ? nextValue(prop) : nextValue;
				if (value !== prop) handleChange(value);
			} else setUncontrolledProp(nextValue);
		}, [
			isControlled,
			prop,
			setUncontrolledProp,
			handleChange
		])];
	}
	function $71cd76cc60e0454e$var$useUncontrolledState({ defaultProp, onChange }) {
		const uncontrolledState = h$4(defaultProp);
		const [value] = uncontrolledState;
		const prevValueRef = _$1(value);
		const handleChange = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onChange);
		p$6(() => {
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
	var $5e63c961fc1ce211$export$8c6ed5c666ac1360 = k$1((props, forwardedRef) => {
		const { children, ...slotProps } = props;
		const childrenArray = O$1.toArray(children);
		const slottable = childrenArray.find($5e63c961fc1ce211$var$isSlottable);
		if (slottable) {
			const newElement = slottable.props.children;
			const newChildren = childrenArray.map((child) => {
				if (child === slottable) {
					if (O$1.count(newElement) > 1) return O$1.only(null);
					return an(newElement) ? newElement.props.children : null;
				} else return child;
			});
			return y$6($5e63c961fc1ce211$var$SlotClone, _extends({}, slotProps, { ref: forwardedRef }), an(newElement) ? hn(newElement, void 0, newChildren) : null);
		}
		return y$6($5e63c961fc1ce211$var$SlotClone, _extends({}, slotProps, { ref: forwardedRef }), children);
	});
	$5e63c961fc1ce211$export$8c6ed5c666ac1360.displayName = "Slot";
	var $5e63c961fc1ce211$var$SlotClone = k$1((props, forwardedRef) => {
		const { children, ...slotProps } = props;
		if (an(children)) return hn(children, {
			...$5e63c961fc1ce211$var$mergeProps(slotProps, children.props),
			ref: $6ed0406888f73fc4$export$43e446d32b3d21af(forwardedRef, children.ref)
		});
		return O$1.count(children) > 1 ? O$1.only(null) : null;
	});
	$5e63c961fc1ce211$var$SlotClone.displayName = "SlotClone";
	var $5e63c961fc1ce211$export$d9f1ccf0bdb05d45 = ({ children }) => {
		return y$6(k$3, null, children);
	};
	function $5e63c961fc1ce211$var$isSlottable(child) {
		return an(child) && child.type === $5e63c961fc1ce211$export$d9f1ccf0bdb05d45;
	}
	function $5e63c961fc1ce211$var$mergeProps(slotProps, childProps) {
		const overrideProps = { ...childProps };
		for (const propName in childProps) {
			const slotPropValue = slotProps[propName];
			const childPropValue = childProps[propName];
			if (/^on[A-Z]/.test(propName)) {
				if (slotPropValue && childPropValue) overrideProps[propName] = (...args) => {
					childPropValue(...args);
					slotPropValue(...args);
				};
				else if (slotPropValue) overrideProps[propName] = slotPropValue;
			} else if (propName === "style") overrideProps[propName] = {
				...slotPropValue,
				...childPropValue
			};
			else if (propName === "className") overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
		}
		return {
			...slotProps,
			...overrideProps
		};
	}
	var $8927f6f2acc4f386$export$250ffa63cdc0d034 = [
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
	].reduce((primitive, node) => {
		const Node = k$1((props, forwardedRef) => {
			const { asChild, ...primitiveProps } = props;
			const Comp = asChild ? $5e63c961fc1ce211$export$8c6ed5c666ac1360 : node;
			p$6(() => {
				window[Symbol.for("radix-ui")] = true;
			}, []);
			return y$6(Comp, _extends({}, primitiveProps, { ref: forwardedRef }));
		});
		Node.displayName = `Primitive.${node}`;
		return {
			...primitive,
			[node]: Node
		};
	}, {});
	function $8927f6f2acc4f386$export$6d1a0317bde7de7f(target, event) {
		if (target) mn(() => target.dispatchEvent(event));
	}
	function $addc16e1bbe58fd0$export$3a72a57244d6e765(onEscapeKeyDownProp, ownerDocument = globalThis === null || globalThis === void 0 ? void 0 : globalThis.document) {
		const onEscapeKeyDown = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onEscapeKeyDownProp);
		p$6(() => {
			const handleKeyDown = (event) => {
				if (event.key === "Escape") onEscapeKeyDown(event);
			};
			ownerDocument.addEventListener("keydown", handleKeyDown);
			return () => ownerDocument.removeEventListener("keydown", handleKeyDown);
		}, [onEscapeKeyDown, ownerDocument]);
	}
	var $5cb92bef7577960e$var$CONTEXT_UPDATE = "dismissableLayer.update";
	var $5cb92bef7577960e$var$POINTER_DOWN_OUTSIDE = "dismissableLayer.pointerDownOutside";
	var $5cb92bef7577960e$var$FOCUS_OUTSIDE = "dismissableLayer.focusOutside";
	var $5cb92bef7577960e$var$originalBodyPointerEvents;
	var $5cb92bef7577960e$var$DismissableLayerContext = G$1({
		layers: new Set(),
		layersWithOutsidePointerEventsDisabled: new Set(),
		branches: new Set()
	});
	var $5cb92bef7577960e$export$177fb62ff3ec1f22 = k$1((props, forwardedRef) => {
		var _node$ownerDocument;
		const { disableOutsidePointerEvents = false, onEscapeKeyDown, onPointerDownOutside, onFocusOutside, onInteractOutside, onDismiss, ...layerProps } = props;
		const context = q$1($5cb92bef7577960e$var$DismissableLayerContext);
		const [node1, setNode] = h$4(null);
		const ownerDocument = (_node$ownerDocument = node1 === null || node1 === void 0 ? void 0 : node1.ownerDocument) !== null && _node$ownerDocument !== void 0 ? _node$ownerDocument : globalThis === null || globalThis === void 0 ? void 0 : globalThis.document;
		const [, force] = h$4({});
		const composedRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedRef, (node) => setNode(node));
		const layers = Array.from(context.layers);
		const [highestLayerWithOutsidePointerEventsDisabled] = [...context.layersWithOutsidePointerEventsDisabled].slice(-1);
		const highestLayerWithOutsidePointerEventsDisabledIndex = layers.indexOf(highestLayerWithOutsidePointerEventsDisabled);
		const index = node1 ? layers.indexOf(node1) : -1;
		const isBodyPointerEventsDisabled = context.layersWithOutsidePointerEventsDisabled.size > 0;
		const isPointerEventsEnabled = index >= highestLayerWithOutsidePointerEventsDisabledIndex;
		const pointerDownOutside = $5cb92bef7577960e$var$usePointerDownOutside((event) => {
			const target = event.target;
			const isPointerDownOnBranch = [...context.branches].some((branch) => branch.contains(target));
			if (!isPointerEventsEnabled || isPointerDownOnBranch) return;
			onPointerDownOutside === null || onPointerDownOutside === void 0 || onPointerDownOutside(event);
			onInteractOutside === null || onInteractOutside === void 0 || onInteractOutside(event);
			if (!event.defaultPrevented) onDismiss === null || onDismiss === void 0 || onDismiss();
		}, ownerDocument);
		const focusOutside = $5cb92bef7577960e$var$useFocusOutside((event) => {
			const target = event.target;
			if ([...context.branches].some((branch) => branch.contains(target))) return;
			onFocusOutside === null || onFocusOutside === void 0 || onFocusOutside(event);
			onInteractOutside === null || onInteractOutside === void 0 || onInteractOutside(event);
			if (!event.defaultPrevented) onDismiss === null || onDismiss === void 0 || onDismiss();
		}, ownerDocument);
		$addc16e1bbe58fd0$export$3a72a57244d6e765((event) => {
			if (!(index === context.layers.size - 1)) return;
			onEscapeKeyDown === null || onEscapeKeyDown === void 0 || onEscapeKeyDown(event);
			if (!event.defaultPrevented && onDismiss) {
				event.preventDefault();
				onDismiss();
			}
		}, ownerDocument);
		p$6(() => {
			if (!node1) return;
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
				if (disableOutsidePointerEvents && context.layersWithOutsidePointerEventsDisabled.size === 1) ownerDocument.body.style.pointerEvents = $5cb92bef7577960e$var$originalBodyPointerEvents;
			};
		}, [
			node1,
			ownerDocument,
			disableOutsidePointerEvents,
			context
		]);
		p$6(() => {
			return () => {
				if (!node1) return;
				context.layers.delete(node1);
				context.layersWithOutsidePointerEventsDisabled.delete(node1);
				$5cb92bef7577960e$var$dispatchUpdate();
			};
		}, [node1, context]);
		p$6(() => {
			const handleUpdate = () => force({});
			document.addEventListener($5cb92bef7577960e$var$CONTEXT_UPDATE, handleUpdate);
			return () => document.removeEventListener($5cb92bef7577960e$var$CONTEXT_UPDATE, handleUpdate);
		}, []);
		return y$6($8927f6f2acc4f386$export$250ffa63cdc0d034.div, _extends({}, layerProps, {
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
		const handleClickRef = _$1(() => {});
		p$6(() => {
			const handlePointerDown = (event) => {
				if (event.target && !isPointerInsideReactTreeRef.current) {
					const eventDetail = { originalEvent: event };
					function handleAndDispatchPointerDownOutsideEvent() {
						$5cb92bef7577960e$var$handleAndDispatchCustomEvent($5cb92bef7577960e$var$POINTER_DOWN_OUTSIDE, handlePointerDownOutside, eventDetail, { discrete: true });
					}
					if (event.pointerType === "touch") {
						ownerDocument.removeEventListener("click", handleClickRef.current);
						handleClickRef.current = handleAndDispatchPointerDownOutsideEvent;
						ownerDocument.addEventListener("click", handleClickRef.current, { once: true });
					} else handleAndDispatchPointerDownOutsideEvent();
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
		return { onPointerDownCapture: () => isPointerInsideReactTreeRef.current = true };
	}
	function $5cb92bef7577960e$var$useFocusOutside(onFocusOutside, ownerDocument = globalThis === null || globalThis === void 0 ? void 0 : globalThis.document) {
		const handleFocusOutside = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onFocusOutside);
		const isFocusInsideReactTreeRef = _$1(false);
		p$6(() => {
			const handleFocus = (event) => {
				if (event.target && !isFocusInsideReactTreeRef.current) $5cb92bef7577960e$var$handleAndDispatchCustomEvent($5cb92bef7577960e$var$FOCUS_OUTSIDE, handleFocusOutside, { originalEvent: event }, { discrete: false });
			};
			ownerDocument.addEventListener("focusin", handleFocus);
			return () => ownerDocument.removeEventListener("focusin", handleFocus);
		}, [ownerDocument, handleFocusOutside]);
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
		if (handler) target.addEventListener(name, handler, { once: true });
		if (discrete) $8927f6f2acc4f386$export$6d1a0317bde7de7f(target, event);
		else target.dispatchEvent(event);
	}
	var $d3863c46a17e8a28$var$AUTOFOCUS_ON_MOUNT = "focusScope.autoFocusOnMount";
	var $d3863c46a17e8a28$var$AUTOFOCUS_ON_UNMOUNT = "focusScope.autoFocusOnUnmount";
	var $d3863c46a17e8a28$var$EVENT_OPTIONS = {
		bubbles: false,
		cancelable: true
	};
	var $d3863c46a17e8a28$export$20e40289641fbbb6 = k$1((props, forwardedRef) => {
		const { loop = false, trapped = false, onMountAutoFocus: onMountAutoFocusProp, onUnmountAutoFocus: onUnmountAutoFocusProp, ...scopeProps } = props;
		const [container1, setContainer] = h$4(null);
		const onMountAutoFocus = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onMountAutoFocusProp);
		const onUnmountAutoFocus = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onUnmountAutoFocusProp);
		const lastFocusedElementRef = _$1(null);
		const composedRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedRef, (node) => setContainer(node));
		const focusScope = _$1({
			paused: false,
			pause() {
				this.paused = true;
			},
			resume() {
				this.paused = false;
			}
		}).current;
		p$6(() => {
			if (trapped) {
				function handleFocusIn(event) {
					if (focusScope.paused || !container1) return;
					const target = event.target;
					if (container1.contains(target)) lastFocusedElementRef.current = target;
					else $d3863c46a17e8a28$var$focus(lastFocusedElementRef.current, { select: true });
				}
				function handleFocusOut(event) {
					if (focusScope.paused || !container1) return;
					if (!container1.contains(event.relatedTarget)) $d3863c46a17e8a28$var$focus(lastFocusedElementRef.current, { select: true });
				}
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
		p$6(() => {
			if (container1) {
				$d3863c46a17e8a28$var$focusScopesStack.add(focusScope);
				const previouslyFocusedElement = document.activeElement;
				if (!container1.contains(previouslyFocusedElement)) {
					const mountEvent = new CustomEvent($d3863c46a17e8a28$var$AUTOFOCUS_ON_MOUNT, $d3863c46a17e8a28$var$EVENT_OPTIONS);
					container1.addEventListener($d3863c46a17e8a28$var$AUTOFOCUS_ON_MOUNT, onMountAutoFocus);
					container1.dispatchEvent(mountEvent);
					if (!mountEvent.defaultPrevented) {
						$d3863c46a17e8a28$var$focusFirst($d3863c46a17e8a28$var$removeLinks($d3863c46a17e8a28$var$getTabbableCandidates(container1)), { select: true });
						if (document.activeElement === previouslyFocusedElement) $d3863c46a17e8a28$var$focus(container1);
					}
				}
				return () => {
					container1.removeEventListener($d3863c46a17e8a28$var$AUTOFOCUS_ON_MOUNT, onMountAutoFocus);
					setTimeout(() => {
						const unmountEvent = new CustomEvent($d3863c46a17e8a28$var$AUTOFOCUS_ON_UNMOUNT, $d3863c46a17e8a28$var$EVENT_OPTIONS);
						container1.addEventListener($d3863c46a17e8a28$var$AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);
						container1.dispatchEvent(unmountEvent);
						if (!unmountEvent.defaultPrevented) $d3863c46a17e8a28$var$focus(previouslyFocusedElement !== null && previouslyFocusedElement !== void 0 ? previouslyFocusedElement : document.body, { select: true });
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
		const handleKeyDown = T$4((event) => {
			if (!loop && !trapped) return;
			if (focusScope.paused) return;
			const isTabKey = event.key === "Tab" && !event.altKey && !event.ctrlKey && !event.metaKey;
			const focusedElement = document.activeElement;
			if (isTabKey && focusedElement) {
				const container = event.currentTarget;
				const [first, last] = $d3863c46a17e8a28$var$getTabbableEdges(container);
				if (!(first && last)) {
					if (focusedElement === container) event.preventDefault();
				} else if (!event.shiftKey && focusedElement === last) {
					event.preventDefault();
					if (loop) $d3863c46a17e8a28$var$focus(first, { select: true });
				} else if (event.shiftKey && focusedElement === first) {
					event.preventDefault();
					if (loop) $d3863c46a17e8a28$var$focus(last, { select: true });
				}
			}
		}, [
			loop,
			trapped,
			focusScope.paused
		]);
		return y$6($8927f6f2acc4f386$export$250ffa63cdc0d034.div, _extends({ tabIndex: -1 }, scopeProps, {
			ref: composedRefs,
			onKeyDown: handleKeyDown
		}));
	});
	function $d3863c46a17e8a28$var$focusFirst(candidates, { select = false } = {}) {
		const previouslyFocusedElement = document.activeElement;
		for (const candidate of candidates) {
			$d3863c46a17e8a28$var$focus(candidate, { select });
			if (document.activeElement !== previouslyFocusedElement) return;
		}
	}
	function $d3863c46a17e8a28$var$getTabbableEdges(container) {
		const candidates = $d3863c46a17e8a28$var$getTabbableCandidates(container);
		return [$d3863c46a17e8a28$var$findVisible(candidates, container), $d3863c46a17e8a28$var$findVisible(candidates.reverse(), container)];
	}
	function $d3863c46a17e8a28$var$getTabbableCandidates(container) {
		const nodes = [];
		const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, { acceptNode: (node) => {
			const isHiddenInput = node.tagName === "INPUT" && node.type === "hidden";
			if (node.disabled || node.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP;
			return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
		} });
		while (walker.nextNode()) nodes.push(walker.currentNode);
		return nodes;
	}
	function $d3863c46a17e8a28$var$findVisible(elements, container) {
		for (const element of elements) if (!$d3863c46a17e8a28$var$isHidden(element, { upTo: container })) return element;
	}
	function $d3863c46a17e8a28$var$isHidden(node, { upTo }) {
		if (getComputedStyle(node).visibility === "hidden") return true;
		while (node) {
			if (upTo !== void 0 && node === upTo) return false;
			if (getComputedStyle(node).display === "none") return true;
			node = node.parentElement;
		}
		return false;
	}
	function $d3863c46a17e8a28$var$isSelectableInput(element) {
		return element instanceof HTMLInputElement && "select" in element;
	}
	function $d3863c46a17e8a28$var$focus(element, { select = false } = {}) {
		if (element && element.focus) {
			const previouslyFocusedElement = document.activeElement;
			element.focus({ preventScroll: true });
			if (element !== previouslyFocusedElement && $d3863c46a17e8a28$var$isSelectableInput(element) && select) element.select();
		}
	}
	var $d3863c46a17e8a28$var$focusScopesStack = $d3863c46a17e8a28$var$createFocusScopesStack();
	function $d3863c46a17e8a28$var$createFocusScopesStack() {
		let stack = [];
		return {
			add(focusScope) {
				const activeFocusScope = stack[0];
				if (focusScope !== activeFocusScope) activeFocusScope === null || activeFocusScope === void 0 || activeFocusScope.pause();
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
		const updatedArray = [...array];
		const index = updatedArray.indexOf(item);
		if (index !== -1) updatedArray.splice(index, 1);
		return updatedArray;
	}
	function $d3863c46a17e8a28$var$removeLinks(items) {
		return items.filter((item) => item.tagName !== "A");
	}
	var $f1701beae083dbae$export$602eac185826482c = k$1((props, forwardedRef) => {
		var _globalThis$document;
		const { container = globalThis === null || globalThis === void 0 ? void 0 : (_globalThis$document = globalThis.document) === null || _globalThis$document === void 0 ? void 0 : _globalThis$document.body, ...portalProps } = props;
		return container ? wn.createPortal(y$6($8927f6f2acc4f386$export$250ffa63cdc0d034.div, _extends({}, portalProps, { ref: forwardedRef })), container) : null;
	});
	function $fe963b355347cc68$export$3e6543de14f8614f(initialState, machine) {
		return s$6((state, event) => {
			const nextState = machine[state][event];
			return nextState !== null && nextState !== void 0 ? nextState : state;
		}, initialState);
	}
	var $921a889cee6df7e8$export$99c2b779aa4e8b8b = (props) => {
		const { present, children } = props;
		const presence = $921a889cee6df7e8$var$usePresence(present);
		const child = typeof children === "function" ? children({ present: presence.isPresent }) : O$1.only(children);
		const ref = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(presence.ref, child.ref);
		return typeof children === "function" || presence.isPresent ? hn(child, { ref }) : null;
	};
	$921a889cee6df7e8$export$99c2b779aa4e8b8b.displayName = "Presence";
	function $921a889cee6df7e8$var$usePresence(present) {
		const [node1, setNode] = h$4();
		const stylesRef = _$1({});
		const prevPresentRef = _$1(present);
		const prevAnimationNameRef = _$1("none");
		const [state, send] = $fe963b355347cc68$export$3e6543de14f8614f(present ? "mounted" : "unmounted", {
			mounted: {
				UNMOUNT: "unmounted",
				ANIMATION_OUT: "unmountSuspended"
			},
			unmountSuspended: {
				MOUNT: "mounted",
				ANIMATION_END: "unmounted"
			},
			unmounted: { MOUNT: "mounted" }
		});
		p$6(() => {
			const currentAnimationName = $921a889cee6df7e8$var$getAnimationName(stylesRef.current);
			prevAnimationNameRef.current = state === "mounted" ? currentAnimationName : "none";
		}, [state]);
		$9f79659886946c16$export$e5c5a5f917a5871c(() => {
			const styles = stylesRef.current;
			const wasPresent = prevPresentRef.current;
			if (wasPresent !== present) {
				const prevAnimationName = prevAnimationNameRef.current;
				const currentAnimationName = $921a889cee6df7e8$var$getAnimationName(styles);
				if (present) send("MOUNT");
				else if (currentAnimationName === "none" || (styles === null || styles === void 0 ? void 0 : styles.display) === "none") send("UNMOUNT");
				else if (wasPresent && prevAnimationName !== currentAnimationName) send("ANIMATION_OUT");
				else send("UNMOUNT");
				prevPresentRef.current = present;
			}
		}, [present, send]);
		$9f79659886946c16$export$e5c5a5f917a5871c(() => {
			if (node1) {
				const handleAnimationEnd = (event) => {
					const isCurrentAnimation = $921a889cee6df7e8$var$getAnimationName(stylesRef.current).includes(event.animationName);
					if (event.target === node1 && isCurrentAnimation) mn(() => send("ANIMATION_END"));
				};
				const handleAnimationStart = (event) => {
					if (event.target === node1) prevAnimationNameRef.current = $921a889cee6df7e8$var$getAnimationName(stylesRef.current);
				};
				node1.addEventListener("animationstart", handleAnimationStart);
				node1.addEventListener("animationcancel", handleAnimationEnd);
				node1.addEventListener("animationend", handleAnimationEnd);
				return () => {
					node1.removeEventListener("animationstart", handleAnimationStart);
					node1.removeEventListener("animationcancel", handleAnimationEnd);
					node1.removeEventListener("animationend", handleAnimationEnd);
				};
			} else send("ANIMATION_END");
		}, [node1, send]);
		return {
			isPresent: ["mounted", "unmountSuspended"].includes(state),
			ref: T$4((node) => {
				if (node) stylesRef.current = getComputedStyle(node);
				setNode(node);
			}, [])
		};
	}
	function $921a889cee6df7e8$var$getAnimationName(styles) {
		return (styles === null || styles === void 0 ? void 0 : styles.animationName) || "none";
	}
	var $3db38b7d1fb3fe6a$var$count = 0;
	function $3db38b7d1fb3fe6a$export$b7ece24a22aeda8c() {
		p$6(() => {
			var _edgeGuards$, _edgeGuards$2;
			const edgeGuards = document.querySelectorAll("[data-radix-focus-guard]");
			document.body.insertAdjacentElement("afterbegin", (_edgeGuards$ = edgeGuards[0]) !== null && _edgeGuards$ !== void 0 ? _edgeGuards$ : $3db38b7d1fb3fe6a$var$createFocusGuard());
			document.body.insertAdjacentElement("beforeend", (_edgeGuards$2 = edgeGuards[1]) !== null && _edgeGuards$2 !== void 0 ? _edgeGuards$2 : $3db38b7d1fb3fe6a$var$createFocusGuard());
			$3db38b7d1fb3fe6a$var$count++;
			return () => {
				if ($3db38b7d1fb3fe6a$var$count === 1) document.querySelectorAll("[data-radix-focus-guard]").forEach((node) => node.remove());
				$3db38b7d1fb3fe6a$var$count--;
			};
		}, []);
	}
	function $3db38b7d1fb3fe6a$var$createFocusGuard() {
		const element = document.createElement("span");
		element.setAttribute("data-radix-focus-guard", "");
		element.tabIndex = 0;
		element.style.cssText = "outline: none; opacity: 0; position: fixed; pointer-events: none";
		return element;
	}
	var __assign = function() {
		__assign = Object.assign || function __assign(t) {
			for (var s, i = 1, n = arguments.length; i < n; i++) {
				s = arguments[i];
				for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
			}
			return t;
		};
		return __assign.apply(this, arguments);
	};
	function __rest(s, e) {
		var t = {};
		for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
		if (s != null && typeof Object.getOwnPropertySymbols === "function") {
			for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
		}
		return t;
	}
	function __spreadArray(to, from, pack) {
		if (pack || arguments.length === 2) {
			for (var i = 0, l = from.length, ar; i < l; i++) if (ar || !(i in from)) {
				if (!ar) ar = Array.prototype.slice.call(from, 0, i);
				ar[i] = from[i];
			}
		}
		return to.concat(ar || Array.prototype.slice.call(from));
	}
	var zeroRightClassName = "right-scroll-bar-position";
	var fullWidthClassName = "width-before-scroll-bar";
	var noScrollbarsClassName = "with-scroll-bars-hidden";
	var removedBarSizeVariable = "--removed-body-scroll-bar-size";
	function assignRef(ref, value) {
		if (typeof ref === "function") ref(value);
		else if (ref) ref.current = value;
		return ref;
	}
	function useCallbackRef(initialValue, callback) {
		var ref = h$4(function() {
			return {
				value: initialValue,
				callback,
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
	function ItoI(a) {
		return a;
	}
	function innerCreateMedium(defaults, middleware) {
		if (middleware === void 0) middleware = ItoI;
		var buffer = [];
		var assigned = false;
		return {
			read: function() {
				if (assigned) throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
				if (buffer.length) return buffer[buffer.length - 1];
				return defaults;
			},
			useMedium: function(data) {
				var item = middleware(data, assigned);
				buffer.push(item);
				return function() {
					buffer = buffer.filter(function(x) {
						return x !== item;
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
					push: function(x) {
						return cb(x);
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
					var cbs = pendingQueue;
					pendingQueue = [];
					cbs.forEach(cb);
				};
				var cycle = function() {
					return Promise.resolve().then(executeQueue);
				};
				cycle();
				buffer = {
					push: function(x) {
						pendingQueue.push(x);
						cycle();
					},
					filter: function(filter) {
						pendingQueue = pendingQueue.filter(filter);
						return buffer;
					}
				};
			}
		};
	}
	function createSidecarMedium(options) {
		if (options === void 0) options = {};
		var medium = innerCreateMedium(null);
		medium.options = __assign({
			async: true,
			ssr: false
		}, options);
		return medium;
	}
	var SideCar = function(_a) {
		var sideCar = _a.sideCar, rest = __rest(_a, ["sideCar"]);
		if (!sideCar) throw new Error("Sidecar: please provide `sideCar` property to import the right car");
		var Target = sideCar.read();
		if (!Target) throw new Error("Sidecar medium not found");
		return y$6(Target, __assign({}, rest));
	};
	SideCar.isSideCarExport = true;
	function exportSidecar(medium, exported) {
		medium.useMedium(exported);
		return SideCar;
	}
	var effectCar = createSidecarMedium();
	var nothing = function() {};
	var RemoveScroll = k$1(function(props, parentRef) {
		var ref = _$1(null);
		var _a = h$4({
			onScrollCapture: nothing,
			onWheelCapture: nothing,
			onTouchMoveCapture: nothing
		}), callbacks = _a[0], setCallbacks = _a[1];
		var forwardProps = props.forwardProps, children = props.children, className = props.className, removeScrollBar = props.removeScrollBar, enabled = props.enabled, shards = props.shards, sideCar = props.sideCar, noIsolation = props.noIsolation, inert = props.inert, allowPinchZoom = props.allowPinchZoom, _b = props.as, Container = _b === void 0 ? "div" : _b, rest = __rest(props, [
			"forwardProps",
			"children",
			"className",
			"removeScrollBar",
			"enabled",
			"shards",
			"sideCar",
			"noIsolation",
			"inert",
			"allowPinchZoom",
			"as"
		]);
		var SideCar = sideCar;
		var containerRef = useMergeRefs([ref, parentRef]);
		var containerProps = __assign(__assign({}, rest), callbacks);
		return y$6(k$3, null, enabled && y$6(SideCar, {
			sideCar: effectCar,
			removeScrollBar,
			shards,
			noIsolation,
			inert,
			setCallbacks,
			allowPinchZoom: !!allowPinchZoom,
			lockRef: ref
		}), forwardProps ? hn(O$1.only(children), __assign(__assign({}, containerProps), { ref: containerRef })) : y$6(Container, __assign({}, containerProps, {
			className,
			ref: containerRef
		}), children));
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
		if (typeof __webpack_nonce__ !== "undefined") return __webpack_nonce__;
	};
	function makeStyleTag() {
		if (!document) return null;
		var tag = document.createElement("style");
		tag.type = "text/css";
		var nonce = getNonce();
		if (nonce) tag.setAttribute("nonce", nonce);
		return tag;
	}
	function injectStyles(tag, css) {
		if (tag.styleSheet) tag.styleSheet.cssText = css;
		else tag.appendChild(document.createTextNode(css));
	}
	function insertStyleTag(tag) {
		(document.head || document.getElementsByTagName("head")[0]).appendChild(tag);
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
			p$6(function() {
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
	var parse$1 = function(x) {
		return parseInt(x || "", 10) || 0;
	};
	var getOffset = function(gapMode) {
		var cs = window.getComputedStyle(document.body);
		var left = cs[gapMode === "padding" ? "paddingLeft" : "marginLeft"];
		var top = cs[gapMode === "padding" ? "paddingTop" : "marginTop"];
		var right = cs[gapMode === "padding" ? "paddingRight" : "marginRight"];
		return [
			parse$1(left),
			parse$1(top),
			parse$1(right)
		];
	};
	var getGapWidth = function(gapMode) {
		if (gapMode === void 0) gapMode = "margin";
		if (typeof window === "undefined") return zeroGap;
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
		if (gapMode === void 0) gapMode = "margin";
		return "\n  .".concat(noScrollbarsClassName, " {\n   overflow: hidden ").concat(important, ";\n   padding-right: ").concat(gap, "px ").concat(important, ";\n  }\n  body {\n    overflow: hidden ").concat(important, ";\n    overscroll-behavior: contain;\n    ").concat([
			allowRelative && "position: relative ".concat(important, ";"),
			gapMode === "margin" && "\n    padding-left: ".concat(left, "px;\n    padding-top: ").concat(top, "px;\n    padding-right: ").concat(right, "px;\n    margin-left:0;\n    margin-top:0;\n    margin-right: ").concat(gap, "px ").concat(important, ";\n    "),
			gapMode === "padding" && "padding-right: ".concat(gap, "px ").concat(important, ";")
		].filter(Boolean).join(""), "\n  }\n  \n  .").concat(zeroRightClassName, " {\n    right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(fullWidthClassName, " {\n    margin-right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(zeroRightClassName, " .").concat(zeroRightClassName, " {\n    right: 0 ").concat(important, ";\n  }\n  \n  .").concat(fullWidthClassName, " .").concat(fullWidthClassName, " {\n    margin-right: 0 ").concat(important, ";\n  }\n  \n  body {\n    ").concat(removedBarSizeVariable, ": ").concat(gap, "px;\n  }\n");
	};
	var RemoveScrollBar = function(props) {
		var noRelative = props.noRelative, noImportant = props.noImportant, _a = props.gapMode, gapMode = _a === void 0 ? "margin" : _a;
		return y$6(Style, { styles: getStyles(F$1(function() {
			return getGapWidth(gapMode);
		}, [gapMode]), !noRelative, gapMode, !noImportant ? "!important" : "") });
	};
	var passiveSupported = false;
	if (typeof window !== "undefined") try {
		var options = Object.defineProperty({}, "passive", { get: function() {
			passiveSupported = true;
			return true;
		} });
		window.addEventListener("test", options, options);
		window.removeEventListener("test", options, options);
	} catch (err) {
		passiveSupported = false;
	}
	var nonPassive = passiveSupported ? { passive: false } : false;
	var alwaysContainsScroll = function(node) {
		return node.tagName === "TEXTAREA";
	};
	var elementCanBeScrolled = function(node, overflow) {
		var styles = window.getComputedStyle(node);
		return styles[overflow] !== "hidden" && !(styles.overflowY === styles.overflowX && !alwaysContainsScroll(node) && styles[overflow] === "visible");
	};
	var elementCouldBeVScrolled = function(node) {
		return elementCanBeScrolled(node, "overflowY");
	};
	var elementCouldBeHScrolled = function(node) {
		return elementCanBeScrolled(node, "overflowX");
	};
	var locationCouldBeScrolled = function(axis, node) {
		var current = node;
		do {
			if (typeof ShadowRoot !== "undefined" && current instanceof ShadowRoot) current = current.host;
			if (elementCouldBeScrolled(axis, current)) {
				var _a = getScrollVariables(axis, current);
				if (_a[1] > _a[2]) return true;
			}
			current = current.parentNode;
		} while (current && current !== document.body);
		return false;
	};
	var getVScrollVariables = function(_a) {
		return [
			_a.scrollTop,
			_a.scrollHeight,
			_a.clientHeight
		];
	};
	var getHScrollVariables = function(_a) {
		return [
			_a.scrollLeft,
			_a.scrollWidth,
			_a.clientWidth
		];
	};
	var elementCouldBeScrolled = function(axis, node) {
		return axis === "v" ? elementCouldBeVScrolled(node) : elementCouldBeHScrolled(node);
	};
	var getScrollVariables = function(axis, node) {
		return axis === "v" ? getVScrollVariables(node) : getHScrollVariables(node);
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
			var _a = getScrollVariables(axis, target), position = _a[0];
			var elementScroll = _a[1] - _a[2] - directionFactor * position;
			if (position || elementScroll) {
				if (elementCouldBeScrolled(axis, target)) {
					availableScroll += elementScroll;
					availableScrollTop += position;
				}
			}
			target = target.parentNode;
		} while (!targetInLock && target !== document.body || targetInLock && (endTarget.contains(target) || endTarget === target));
		if (isDeltaPositive && (noOverscroll && availableScroll === 0 || !noOverscroll && delta > availableScroll)) shouldCancelScroll = true;
		else if (!isDeltaPositive && (noOverscroll && availableScrollTop === 0 || !noOverscroll && -delta > availableScrollTop)) shouldCancelScroll = true;
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
	var deltaCompare = function(x, y) {
		return x[0] === y[0] && x[1] === y[1];
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
		var id = h$4(idCounter++)[0];
		var Style = h$4(function() {
			return styleSingleton();
		})[0];
		var lastProps = _$1(props);
		p$6(function() {
			lastProps.current = props;
		}, [props]);
		p$6(function() {
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
		}, [
			props.inert,
			props.lockRef.current,
			props.shards
		]);
		var shouldCancelEvent = T$4(function(event, parent) {
			if ("touches" in event && event.touches.length === 2) return !lastProps.current.allowPinchZoom;
			var touch = getTouchXY(event);
			var touchStart = touchStartRef.current;
			var deltaX = "deltaX" in event ? event.deltaX : touchStart[0] - touch[0];
			var deltaY = "deltaY" in event ? event.deltaY : touchStart[1] - touch[1];
			var currentAxis;
			var target = event.target;
			var moveDirection = Math.abs(deltaX) > Math.abs(deltaY) ? "h" : "v";
			if ("touches" in event && moveDirection === "h" && target.type === "range") return false;
			var canBeScrolledInMainDirection = locationCouldBeScrolled(moveDirection, target);
			if (!canBeScrolledInMainDirection) return true;
			if (canBeScrolledInMainDirection) currentAxis = moveDirection;
			else {
				currentAxis = moveDirection === "v" ? "h" : "v";
				canBeScrolledInMainDirection = locationCouldBeScrolled(moveDirection, target);
			}
			if (!canBeScrolledInMainDirection) return false;
			if (!activeAxis.current && "changedTouches" in event && (deltaX || deltaY)) activeAxis.current = currentAxis;
			if (!currentAxis) return true;
			var cancelingAxis = activeAxis.current || currentAxis;
			return handleScroll(cancelingAxis, parent, event, cancelingAxis === "h" ? deltaX : deltaY, true);
		}, []);
		var shouldPrevent = T$4(function(_event) {
			var event = _event;
			if (!lockStack.length || lockStack[lockStack.length - 1] !== Style) return;
			var delta = "deltaY" in event ? getDeltaXY(event) : getTouchXY(event);
			var sourceEvent = shouldPreventQueue.current.filter(function(e) {
				return e.name === event.type && e.target === event.target && deltaCompare(e.delta, delta);
			})[0];
			if (sourceEvent && sourceEvent.should) {
				if (event.cancelable) event.preventDefault();
				return;
			}
			if (!sourceEvent) {
				var shardNodes = (lastProps.current.shards || []).map(extractRef).filter(Boolean).filter(function(node) {
					return node.contains(event.target);
				});
				if (shardNodes.length > 0 ? shouldCancelEvent(event, shardNodes[0]) : !lastProps.current.noIsolation) {
					if (event.cancelable) event.preventDefault();
				}
			}
		}, []);
		var shouldCancel = T$4(function(name, delta, target, should) {
			var event = {
				name,
				delta,
				target,
				should
			};
			shouldPreventQueue.current.push(event);
			setTimeout(function() {
				shouldPreventQueue.current = shouldPreventQueue.current.filter(function(e) {
					return e !== event;
				});
			}, 1);
		}, []);
		var scrollTouchStart = T$4(function(event) {
			touchStartRef.current = getTouchXY(event);
			activeAxis.current = void 0;
		}, []);
		var scrollWheel = T$4(function(event) {
			shouldCancel(event.type, getDeltaXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
		}, []);
		var scrollTouchMove = T$4(function(event) {
			shouldCancel(event.type, getTouchXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
		}, []);
		p$6(function() {
			lockStack.push(Style);
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
					return inst !== Style;
				});
				document.removeEventListener("wheel", shouldPrevent, nonPassive);
				document.removeEventListener("touchmove", shouldPrevent, nonPassive);
				document.removeEventListener("touchstart", scrollTouchStart, nonPassive);
			};
		}, []);
		var removeScrollBar = props.removeScrollBar, inert = props.inert;
		return y$6(k$3, null, inert ? y$6(Style, { styles: generateStyle(id) }) : null, removeScrollBar ? y$6(RemoveScrollBar, { gapMode: "margin" }) : null);
	}
	var sidecar_default = exportSidecar(effectCar, RemoveScrollSideCar);
	var ReactRemoveScroll = k$1(function(props, ref) {
		return y$6(RemoveScroll, __assign({}, props, {
			ref,
			sideCar: sidecar_default
		}));
	});
	ReactRemoveScroll.classNames = RemoveScroll.classNames;
	var getDefaultParent = function(originalTarget) {
		if (typeof document === "undefined") return null;
		return (Array.isArray(originalTarget) ? originalTarget[0] : originalTarget).ownerDocument.body;
	};
	var counterMap = new WeakMap();
	var uncontrolledNodes = new WeakMap();
	var markerMap = {};
	var lockCount = 0;
	var unwrapHost = function(node) {
		return node && (node.host || unwrapHost(node.parentNode));
	};
	var correctTargets = function(parent, targets) {
		return targets.map(function(target) {
			if (parent.contains(target)) return target;
			var correctedTarget = unwrapHost(target);
			if (correctedTarget && parent.contains(correctedTarget)) return correctedTarget;
			console.error("aria-hidden", target, "in not contained inside", parent, ". Doing nothing");
			return null;
		}).filter(function(x) {
			return Boolean(x);
		});
	};
	var applyAttributeToOthers = function(originalTarget, parentNode, markerName, controlAttribute) {
		var targets = correctTargets(parentNode, Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
		if (!markerMap[markerName]) markerMap[markerName] = new WeakMap();
		var markerCounter = markerMap[markerName];
		var hiddenNodes = [];
		var elementsToKeep = new Set();
		var elementsToStop = new Set(targets);
		var keep = function(el) {
			if (!el || elementsToKeep.has(el)) return;
			elementsToKeep.add(el);
			keep(el.parentNode);
		};
		targets.forEach(keep);
		var deep = function(parent) {
			if (!parent || elementsToStop.has(parent)) return;
			Array.prototype.forEach.call(parent.children, function(node) {
				if (elementsToKeep.has(node)) deep(node);
				else {
					var attr = node.getAttribute(controlAttribute);
					var alreadyHidden = attr !== null && attr !== "false";
					var counterValue = (counterMap.get(node) || 0) + 1;
					var markerValue = (markerCounter.get(node) || 0) + 1;
					counterMap.set(node, counterValue);
					markerCounter.set(node, markerValue);
					hiddenNodes.push(node);
					if (counterValue === 1 && alreadyHidden) uncontrolledNodes.set(node, true);
					if (markerValue === 1) node.setAttribute(markerName, "true");
					if (!alreadyHidden) node.setAttribute(controlAttribute, "true");
				}
			});
		};
		deep(parentNode);
		elementsToKeep.clear();
		lockCount++;
		return function() {
			hiddenNodes.forEach(function(node) {
				var counterValue = counterMap.get(node) - 1;
				var markerValue = markerCounter.get(node) - 1;
				counterMap.set(node, counterValue);
				markerCounter.set(node, markerValue);
				if (!counterValue) {
					if (!uncontrolledNodes.has(node)) node.removeAttribute(controlAttribute);
					uncontrolledNodes.delete(node);
				}
				if (!markerValue) node.removeAttribute(markerName);
			});
			lockCount--;
			if (!lockCount) {
				counterMap = new WeakMap();
				counterMap = new WeakMap();
				uncontrolledNodes = new WeakMap();
				markerMap = {};
			}
		};
	};
	var hideOthers = function(originalTarget, parentNode, markerName) {
		if (markerName === void 0) markerName = "data-aria-hidden";
		var targets = Array.from(Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
		var activeParentNode = parentNode || getDefaultParent(originalTarget);
		if (!activeParentNode) return function() {
			return null;
		};
		targets.push.apply(targets, Array.from(activeParentNode.querySelectorAll("[aria-live]")));
		return applyAttributeToOthers(targets, activeParentNode, markerName, "aria-hidden");
	};
	var $5d3850c4d0b4e6c7$var$DIALOG_NAME = "Dialog";
	var [$5d3850c4d0b4e6c7$var$createDialogContext, $5d3850c4d0b4e6c7$export$cc702773b8ea3e41] = $c512c27ab02ef895$export$50c7b4e9d9f19c1($5d3850c4d0b4e6c7$var$DIALOG_NAME);
	var [$5d3850c4d0b4e6c7$var$DialogProvider, $5d3850c4d0b4e6c7$var$useDialogContext] = $5d3850c4d0b4e6c7$var$createDialogContext($5d3850c4d0b4e6c7$var$DIALOG_NAME);
	var $5d3850c4d0b4e6c7$export$3ddf2d174ce01153 = (props) => {
		const { __scopeDialog, children, open: openProp, defaultOpen, onOpenChange, modal = true } = props;
		const triggerRef = _$1(null);
		const contentRef = _$1(null);
		const [open = false, setOpen] = $71cd76cc60e0454e$export$6f32135080cb4c3({
			prop: openProp,
			defaultProp: defaultOpen,
			onChange: onOpenChange
		});
		return y$6($5d3850c4d0b4e6c7$var$DialogProvider, {
			scope: __scopeDialog,
			triggerRef,
			contentRef,
			contentId: $1746a345f3d73bb7$export$f680877a34711e37(),
			titleId: $1746a345f3d73bb7$export$f680877a34711e37(),
			descriptionId: $1746a345f3d73bb7$export$f680877a34711e37(),
			open,
			onOpenChange: setOpen,
			onOpenToggle: T$4(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
			modal
		}, children);
	};
	var $5d3850c4d0b4e6c7$var$TRIGGER_NAME = "DialogTrigger";
	var $5d3850c4d0b4e6c7$export$2e1e1122cf0cba88 = k$1((props, forwardedRef) => {
		const { __scopeDialog, ...triggerProps } = props;
		const context = $5d3850c4d0b4e6c7$var$useDialogContext($5d3850c4d0b4e6c7$var$TRIGGER_NAME, __scopeDialog);
		const composedTriggerRef = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedRef, context.triggerRef);
		return y$6($8927f6f2acc4f386$export$250ffa63cdc0d034.button, _extends({
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
	var $5d3850c4d0b4e6c7$var$PORTAL_NAME = "DialogPortal";
	var [$5d3850c4d0b4e6c7$var$PortalProvider, $5d3850c4d0b4e6c7$var$usePortalContext] = $5d3850c4d0b4e6c7$var$createDialogContext($5d3850c4d0b4e6c7$var$PORTAL_NAME, { forceMount: void 0 });
	var $5d3850c4d0b4e6c7$export$dad7c95542bacce0 = (props) => {
		const { __scopeDialog, forceMount, children, container } = props;
		const context = $5d3850c4d0b4e6c7$var$useDialogContext($5d3850c4d0b4e6c7$var$PORTAL_NAME, __scopeDialog);
		return y$6($5d3850c4d0b4e6c7$var$PortalProvider, {
			scope: __scopeDialog,
			forceMount
		}, O$1.map(children, (child) => y$6($921a889cee6df7e8$export$99c2b779aa4e8b8b, { present: forceMount || context.open }, y$6($f1701beae083dbae$export$602eac185826482c, {
			asChild: true,
			container
		}, child))));
	};
	var $5d3850c4d0b4e6c7$var$OVERLAY_NAME = "DialogOverlay";
	var $5d3850c4d0b4e6c7$export$bd1d06c79be19e17 = k$1((props, forwardedRef) => {
		const portalContext = $5d3850c4d0b4e6c7$var$usePortalContext($5d3850c4d0b4e6c7$var$OVERLAY_NAME, props.__scopeDialog);
		const { forceMount = portalContext.forceMount, ...overlayProps } = props;
		const context = $5d3850c4d0b4e6c7$var$useDialogContext($5d3850c4d0b4e6c7$var$OVERLAY_NAME, props.__scopeDialog);
		return context.modal ? y$6($921a889cee6df7e8$export$99c2b779aa4e8b8b, { present: forceMount || context.open }, y$6($5d3850c4d0b4e6c7$var$DialogOverlayImpl, _extends({}, overlayProps, { ref: forwardedRef }))) : null;
	});
	var $5d3850c4d0b4e6c7$var$DialogOverlayImpl = k$1((props, forwardedRef) => {
		const { __scopeDialog, ...overlayProps } = props;
		const context = $5d3850c4d0b4e6c7$var$useDialogContext($5d3850c4d0b4e6c7$var$OVERLAY_NAME, __scopeDialog);
		return y$6(ReactRemoveScroll, {
			as: $5e63c961fc1ce211$export$8c6ed5c666ac1360,
			allowPinchZoom: true,
			shards: [context.contentRef]
		}, y$6($8927f6f2acc4f386$export$250ffa63cdc0d034.div, _extends({ "data-state": $5d3850c4d0b4e6c7$var$getState(context.open) }, overlayProps, {
			ref: forwardedRef,
			style: {
				pointerEvents: "auto",
				...overlayProps.style
			}
		})));
	});
	var $5d3850c4d0b4e6c7$var$CONTENT_NAME = "DialogContent";
	var $5d3850c4d0b4e6c7$export$b6d9565de1e068cf = k$1((props, forwardedRef) => {
		const portalContext = $5d3850c4d0b4e6c7$var$usePortalContext($5d3850c4d0b4e6c7$var$CONTENT_NAME, props.__scopeDialog);
		const { forceMount = portalContext.forceMount, ...contentProps } = props;
		const context = $5d3850c4d0b4e6c7$var$useDialogContext($5d3850c4d0b4e6c7$var$CONTENT_NAME, props.__scopeDialog);
		return y$6($921a889cee6df7e8$export$99c2b779aa4e8b8b, { present: forceMount || context.open }, context.modal ? y$6($5d3850c4d0b4e6c7$var$DialogContentModal, _extends({}, contentProps, { ref: forwardedRef })) : y$6($5d3850c4d0b4e6c7$var$DialogContentNonModal, _extends({}, contentProps, { ref: forwardedRef })));
	});
	var $5d3850c4d0b4e6c7$var$DialogContentModal = k$1((props, forwardedRef) => {
		const context = $5d3850c4d0b4e6c7$var$useDialogContext($5d3850c4d0b4e6c7$var$CONTENT_NAME, props.__scopeDialog);
		const contentRef = _$1(null);
		const composedRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedRef, context.contentRef, contentRef);
		p$6(() => {
			const content = contentRef.current;
			if (content) return hideOthers(content);
		}, []);
		return y$6($5d3850c4d0b4e6c7$var$DialogContentImpl, _extends({}, props, {
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
				if (originalEvent.button === 2 || ctrlLeftClick) event.preventDefault();
			}),
			onFocusOutside: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onFocusOutside, (event) => event.preventDefault())
		}));
	});
	var $5d3850c4d0b4e6c7$var$DialogContentNonModal = k$1((props, forwardedRef) => {
		const context = $5d3850c4d0b4e6c7$var$useDialogContext($5d3850c4d0b4e6c7$var$CONTENT_NAME, props.__scopeDialog);
		const hasInteractedOutsideRef = _$1(false);
		return y$6($5d3850c4d0b4e6c7$var$DialogContentImpl, _extends({}, props, {
			ref: forwardedRef,
			trapFocus: false,
			disableOutsidePointerEvents: false,
			onCloseAutoFocus: (event) => {
				var _props$onCloseAutoFoc;
				(_props$onCloseAutoFoc = props.onCloseAutoFocus) === null || _props$onCloseAutoFoc === void 0 || _props$onCloseAutoFoc.call(props, event);
				if (!event.defaultPrevented) {
					var _context$triggerRef$c2;
					if (!hasInteractedOutsideRef.current) (_context$triggerRef$c2 = context.triggerRef.current) === null || _context$triggerRef$c2 === void 0 || _context$triggerRef$c2.focus();
					event.preventDefault();
				}
				hasInteractedOutsideRef.current = false;
			},
			onInteractOutside: (event) => {
				var _props$onInteractOuts, _context$triggerRef$c3;
				(_props$onInteractOuts = props.onInteractOutside) === null || _props$onInteractOuts === void 0 || _props$onInteractOuts.call(props, event);
				if (!event.defaultPrevented) hasInteractedOutsideRef.current = true;
				const target = event.target;
				if ((_context$triggerRef$c3 = context.triggerRef.current) === null || _context$triggerRef$c3 === void 0 ? void 0 : _context$triggerRef$c3.contains(target)) event.preventDefault();
			}
		}));
	});
	var $5d3850c4d0b4e6c7$var$DialogContentImpl = k$1((props, forwardedRef) => {
		const { __scopeDialog, trapFocus, onOpenAutoFocus, onCloseAutoFocus, ...contentProps } = props;
		const context = $5d3850c4d0b4e6c7$var$useDialogContext($5d3850c4d0b4e6c7$var$CONTENT_NAME, __scopeDialog);
		const composedRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedRef, _$1(null));
		$3db38b7d1fb3fe6a$export$b7ece24a22aeda8c();
		return y$6(k$3, null, y$6($d3863c46a17e8a28$export$20e40289641fbbb6, {
			asChild: true,
			loop: true,
			trapped: trapFocus,
			onMountAutoFocus: onOpenAutoFocus,
			onUnmountAutoFocus: onCloseAutoFocus
		}, y$6($5cb92bef7577960e$export$177fb62ff3ec1f22, _extends({
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
	var $5d3850c4d0b4e6c7$var$TITLE_NAME = "DialogTitle";
	var $5d3850c4d0b4e6c7$export$16f7638e4a34b909 = k$1((props, forwardedRef) => {
		const { __scopeDialog, ...titleProps } = props;
		const context = $5d3850c4d0b4e6c7$var$useDialogContext($5d3850c4d0b4e6c7$var$TITLE_NAME, __scopeDialog);
		return y$6($8927f6f2acc4f386$export$250ffa63cdc0d034.h2, _extends({ id: context.titleId }, titleProps, { ref: forwardedRef }));
	});
	var $5d3850c4d0b4e6c7$var$CLOSE_NAME = "DialogClose";
	var $5d3850c4d0b4e6c7$export$fba2fb7cd781b7ac = k$1((props, forwardedRef) => {
		const { __scopeDialog, ...closeProps } = props;
		const context = $5d3850c4d0b4e6c7$var$useDialogContext($5d3850c4d0b4e6c7$var$CLOSE_NAME, __scopeDialog);
		return y$6($8927f6f2acc4f386$export$250ffa63cdc0d034.button, _extends({ type: "button" }, closeProps, {
			ref: forwardedRef,
			onClick: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onClick, () => context.onOpenChange(false))
		}));
	});
	function $5d3850c4d0b4e6c7$var$getState(open) {
		return open ? "open" : "closed";
	}
	var [$5d3850c4d0b4e6c7$export$69b62a49393917d6, $5d3850c4d0b4e6c7$var$useWarningContext] = $c512c27ab02ef895$export$fd42f52fd3ae1109("DialogTitleWarning", {
		contentName: $5d3850c4d0b4e6c7$var$CONTENT_NAME,
		titleName: $5d3850c4d0b4e6c7$var$TITLE_NAME,
		docsSlug: "dialog"
	});
	var $5d3850c4d0b4e6c7$export$be92b6f5f03c0fe9 = $5d3850c4d0b4e6c7$export$3ddf2d174ce01153;
	var $5d3850c4d0b4e6c7$export$41fb9f06171c75f4 = $5d3850c4d0b4e6c7$export$2e1e1122cf0cba88;
	var $5d3850c4d0b4e6c7$export$602eac185826482c = $5d3850c4d0b4e6c7$export$dad7c95542bacce0;
	var $5d3850c4d0b4e6c7$export$c6fdb837b070b4ff = $5d3850c4d0b4e6c7$export$bd1d06c79be19e17;
	var $5d3850c4d0b4e6c7$export$7c6e2c02157bb7d2 = $5d3850c4d0b4e6c7$export$b6d9565de1e068cf;
	var $5d3850c4d0b4e6c7$export$f99233281efd08a0 = $5d3850c4d0b4e6c7$export$16f7638e4a34b909;
	var $5d3850c4d0b4e6c7$export$f39c2d165cd861fe = $5d3850c4d0b4e6c7$export$fba2fb7cd781b7ac;
	function t$2(t) {
		return t.split("-")[0];
	}
	function e$1(t) {
		return t.split("-")[1];
	}
	function n$1(e) {
		return ["top", "bottom"].includes(t$2(e)) ? "x" : "y";
	}
	function r$3(t) {
		return "y" === t ? "height" : "width";
	}
	function i$4(i, o, a) {
		let { reference: l, floating: s } = i;
		const c = l.x + l.width / 2 - s.width / 2, f = l.y + l.height / 2 - s.height / 2, u = n$1(o), m = r$3(u), g = l[m] / 2 - s[m] / 2, d = "x" === u;
		let p;
		switch (t$2(o)) {
			case "top":
				p = {
					x: c,
					y: l.y - s.height
				};
				break;
			case "bottom":
				p = {
					x: c,
					y: l.y + l.height
				};
				break;
			case "right":
				p = {
					x: l.x + l.width,
					y: f
				};
				break;
			case "left":
				p = {
					x: l.x - s.width,
					y: f
				};
				break;
			default: p = {
				x: l.x,
				y: l.y
			};
		}
		switch (e$1(o)) {
			case "start":
				p[u] -= g * (a && d ? -1 : 1);
				break;
			case "end": p[u] += g * (a && d ? -1 : 1);
		}
		return p;
	}
	var o$7 = async (t, e, n) => {
		const { placement: r = "bottom", strategy: o = "absolute", middleware: a = [], platform: l } = n, s = await (null == l.isRTL ? void 0 : l.isRTL(e));
		let c = await l.getElementRects({
			reference: t,
			floating: e,
			strategy: o
		}), { x: f, y: u } = i$4(c, r, s), m = r, g = {}, d = 0;
		for (let n = 0; n < a.length; n++) {
			const { name: p, fn: h } = a[n], { x: y, y: x, data: w, reset: v } = await h({
				x: f,
				y: u,
				initialPlacement: r,
				placement: m,
				strategy: o,
				middlewareData: g,
				rects: c,
				platform: l,
				elements: {
					reference: t,
					floating: e
				}
			});
			f = null != y ? y : f, u = null != x ? x : u, g = {
				...g,
				[p]: {
					...g[p],
					...w
				}
			}, v && d <= 50 && (d++, "object" == typeof v && (v.placement && (m = v.placement), v.rects && (c = !0 === v.rects ? await l.getElementRects({
				reference: t,
				floating: e,
				strategy: o
			}) : v.rects), {x: f, y: u} = i$4(c, m, s)), n = -1);
		}
		return {
			x: f,
			y: u,
			placement: m,
			strategy: o,
			middlewareData: g
		};
	};
	function a$2(t) {
		return "number" != typeof t ? function(t) {
			return {
				top: 0,
				right: 0,
				bottom: 0,
				left: 0,
				...t
			};
		}(t) : {
			top: t,
			right: t,
			bottom: t,
			left: t
		};
	}
	function l$3(t) {
		return {
			...t,
			top: t.y,
			left: t.x,
			right: t.x + t.width,
			bottom: t.y + t.height
		};
	}
	async function s$5(t, e) {
		var n;
		void 0 === e && (e = {});
		const { x: r, y: i, platform: o, rects: s, elements: c, strategy: f } = t, { boundary: u = "clippingAncestors", rootBoundary: m = "viewport", elementContext: g = "floating", altBoundary: d = !1, padding: p = 0 } = e, h = a$2(p), y = c[d ? "floating" === g ? "reference" : "floating" : g], x = l$3(await o.getClippingRect({
			element: null == (n = await (null == o.isElement ? void 0 : o.isElement(y))) || n ? y : y.contextElement || await (null == o.getDocumentElement ? void 0 : o.getDocumentElement(c.floating)),
			boundary: u,
			rootBoundary: m,
			strategy: f
		})), w = l$3(o.convertOffsetParentRelativeRectToViewportRelativeRect ? await o.convertOffsetParentRelativeRectToViewportRelativeRect({
			rect: "floating" === g ? {
				...s.floating,
				x: r,
				y: i
			} : s.reference,
			offsetParent: await (null == o.getOffsetParent ? void 0 : o.getOffsetParent(c.floating)),
			strategy: f
		}) : s[g]);
		return {
			top: x.top - w.top + h.top,
			bottom: w.bottom - x.bottom + h.bottom,
			left: x.left - w.left + h.left,
			right: w.right - x.right + h.right
		};
	}
	var c$3 = Math.min;
	var f$2 = Math.max;
	function u$4(t, e, n) {
		return f$2(t, c$3(e, n));
	}
	var m$1 = (t) => ({
		name: "arrow",
		options: t,
		async fn(i) {
			const { element: o, padding: l = 0 } = null != t ? t : {}, { x: s, y: c, placement: f, rects: m, platform: g } = i;
			if (null == o) return {};
			const d = a$2(l), p = {
				x: s,
				y: c
			}, h = n$1(f), y = e$1(f), x = r$3(h), w = await g.getDimensions(o), v = "y" === h ? "top" : "left", b = "y" === h ? "bottom" : "right", R = m.reference[x] + m.reference[h] - p[h] - m.floating[x], A = p[h] - m.reference[h], P = await (null == g.getOffsetParent ? void 0 : g.getOffsetParent(o));
			let T = P ? "y" === h ? P.clientHeight || 0 : P.clientWidth || 0 : 0;
			0 === T && (T = m.floating[x]);
			const O = R / 2 - A / 2, D = d[v], L = T - w[x] - d[b], k = T / 2 - w[x] / 2 + O, E = u$4(D, k, L), C = ("start" === y ? d[v] : d[b]) > 0 && k !== E && m.reference[x] <= m.floating[x];
			return {
				[h]: p[h] - (C ? k < D ? D - k : L - k : 0),
				data: {
					[h]: E,
					centerOffset: k - E
				}
			};
		}
	});
	var g$2 = {
		left: "right",
		right: "left",
		bottom: "top",
		top: "bottom"
	};
	function d$4(t) {
		return t.replace(/left|right|bottom|top/g, ((t) => g$2[t]));
	}
	function p$5(t, i, o) {
		void 0 === o && (o = !1);
		const a = e$1(t), l = n$1(t), s = r$3(l);
		let c = "x" === l ? a === (o ? "end" : "start") ? "right" : "left" : "start" === a ? "bottom" : "top";
		return i.reference[s] > i.floating[s] && (c = d$4(c)), {
			main: c,
			cross: d$4(c)
		};
	}
	var h$3 = {
		start: "end",
		end: "start"
	};
	function y$4(t) {
		return t.replace(/start|end/g, ((t) => h$3[t]));
	}
	var x$1 = [
		"top",
		"right",
		"bottom",
		"left"
	];
	x$1.reduce(((t, e) => t.concat(e, e + "-start", e + "-end")), []);
	var b$2 = function(e) {
		return void 0 === e && (e = {}), {
			name: "flip",
			options: e,
			async fn(n) {
				var r;
				const { placement: i, middlewareData: o, rects: a, initialPlacement: l, platform: c, elements: f } = n, { mainAxis: u = !0, crossAxis: m = !0, fallbackPlacements: g, fallbackStrategy: h = "bestFit", flipAlignment: x = !0, ...w } = e, v = t$2(i), R = [l, ...g || (v === l || !x ? [d$4(l)] : function(t) {
					const e = d$4(t);
					return [
						y$4(t),
						e,
						y$4(e)
					];
				}(l))], A = await s$5(n, w), P = [];
				let T = (null == (r = o.flip) ? void 0 : r.overflows) || [];
				if (u && P.push(A[v]), m) {
					const { main: t, cross: e } = p$5(i, a, await (null == c.isRTL ? void 0 : c.isRTL(f.floating)));
					P.push(A[t], A[e]);
				}
				if (T = [...T, {
					placement: i,
					overflows: P
				}], !P.every(((t) => t <= 0))) {
					var O, D;
					const t = (null != (O = null == (D = o.flip) ? void 0 : D.index) ? O : 0) + 1, e = R[t];
					if (e) return {
						data: {
							index: t,
							overflows: T
						},
						reset: { placement: e }
					};
					let n = "bottom";
					switch (h) {
						case "bestFit": {
							var L;
							const t = null == (L = T.map(((t) => [t, t.overflows.filter(((t) => t > 0)).reduce(((t, e) => t + e), 0)])).sort(((t, e) => t[1] - e[1]))[0]) ? void 0 : L[0].placement;
							t && (n = t);
							break;
						}
						case "initialPlacement": n = l;
					}
					if (i !== n) return { reset: { placement: n } };
				}
				return {};
			}
		};
	};
	function R$2(t, e) {
		return {
			top: t.top - e.height,
			right: t.right - e.width,
			bottom: t.bottom - e.height,
			left: t.left - e.width
		};
	}
	function A$1(t) {
		return x$1.some(((e) => t[e] >= 0));
	}
	var P = function(t) {
		let { strategy: e = "referenceHidden", ...n } = void 0 === t ? {} : t;
		return {
			name: "hide",
			async fn(t) {
				const { rects: r } = t;
				switch (e) {
					case "referenceHidden": {
						const e = R$2(await s$5(t, {
							...n,
							elementContext: "reference"
						}), r.reference);
						return { data: {
							referenceHiddenOffsets: e,
							referenceHidden: A$1(e)
						} };
					}
					case "escaped": {
						const e = R$2(await s$5(t, {
							...n,
							altBoundary: !0
						}), r.floating);
						return { data: {
							escapedOffsets: e,
							escaped: A$1(e)
						} };
					}
					default: return {};
				}
			}
		};
	};
	var T$2 = function(r) {
		return void 0 === r && (r = 0), {
			name: "offset",
			options: r,
			async fn(i) {
				const { x: o, y: a } = i, l = await async function(r, i) {
					const { placement: o, platform: a, elements: l } = r, s = await (null == a.isRTL ? void 0 : a.isRTL(l.floating)), c = t$2(o), f = e$1(o), u = "x" === n$1(o), m = ["left", "top"].includes(c) ? -1 : 1, g = s && u ? -1 : 1, d = "function" == typeof i ? i(r) : i;
					let { mainAxis: p, crossAxis: h, alignmentAxis: y } = "number" == typeof d ? {
						mainAxis: d,
						crossAxis: 0,
						alignmentAxis: null
					} : {
						mainAxis: 0,
						crossAxis: 0,
						alignmentAxis: null,
						...d
					};
					return f && "number" == typeof y && (h = "end" === f ? -1 * y : y), u ? {
						x: h * g,
						y: p * m
					} : {
						x: p * m,
						y: h * g
					};
				}(i, r);
				return {
					x: o + l.x,
					y: a + l.y,
					data: l
				};
			}
		};
	};
	function O(t) {
		return "x" === t ? "y" : "x";
	}
	var D$2 = function(e) {
		return void 0 === e && (e = {}), {
			name: "shift",
			options: e,
			async fn(r) {
				const { x: i, y: o, placement: a } = r, { mainAxis: l = !0, crossAxis: c = !1, limiter: f = { fn: (t) => {
					let { x: e, y: n } = t;
					return {
						x: e,
						y: n
					};
				} }, ...m } = e, g = {
					x: i,
					y: o
				}, d = await s$5(r, m), p = n$1(t$2(a)), h = O(p);
				let y = g[p], x = g[h];
				if (l) {
					const t = "y" === p ? "bottom" : "right";
					y = u$4(y + d["y" === p ? "top" : "left"], y, y - d[t]);
				}
				if (c) {
					const t = "y" === h ? "bottom" : "right";
					x = u$4(x + d["y" === h ? "top" : "left"], x, x - d[t]);
				}
				const w = f.fn({
					...r,
					[p]: y,
					[h]: x
				});
				return {
					...w,
					data: {
						x: w.x - i,
						y: w.y - o
					}
				};
			}
		};
	};
	var L$1 = function(e) {
		return void 0 === e && (e = {}), {
			options: e,
			fn(r) {
				const { x: i, y: o, placement: a, rects: l, middlewareData: s } = r, { offset: c = 0, mainAxis: f = !0, crossAxis: u = !0 } = e, m = {
					x: i,
					y: o
				}, g = n$1(a), d = O(g);
				let p = m[g], h = m[d];
				const y = "function" == typeof c ? c({
					...l,
					placement: a
				}) : c, x = "number" == typeof y ? {
					mainAxis: y,
					crossAxis: 0
				} : {
					mainAxis: 0,
					crossAxis: 0,
					...y
				};
				if (f) {
					const t = "y" === g ? "height" : "width", e = l.reference[g] - l.floating[t] + x.mainAxis, n = l.reference[g] + l.reference[t] - x.mainAxis;
					p < e ? p = e : p > n && (p = n);
				}
				if (u) {
					var w, v, b, R;
					const e = "y" === g ? "width" : "height", n = ["top", "left"].includes(t$2(a)), r = l.reference[d] - l.floating[e] + (n && null != (w = null == (v = s.offset) ? void 0 : v[d]) ? w : 0) + (n ? 0 : x.crossAxis), i = l.reference[d] + l.reference[e] + (n ? 0 : null != (b = null == (R = s.offset) ? void 0 : R[d]) ? b : 0) - (n ? x.crossAxis : 0);
					h < r ? h = r : h > i && (h = i);
				}
				return {
					[g]: p,
					[d]: h
				};
			}
		};
	};
	var k = function(n) {
		return void 0 === n && (n = {}), {
			name: "size",
			options: n,
			async fn(r) {
				const { placement: i, rects: o, platform: a, elements: l } = r, { apply: c, ...u } = n, m = await s$5(r, u), g = t$2(i), d = e$1(i);
				let p, h;
				"top" === g || "bottom" === g ? (p = g, h = d === (await (null == a.isRTL ? void 0 : a.isRTL(l.floating)) ? "start" : "end") ? "left" : "right") : (h = g, p = "end" === d ? "top" : "bottom");
				const y = f$2(m.left, 0), x = f$2(m.right, 0), w = f$2(m.top, 0), v = f$2(m.bottom, 0), b = {
					availableHeight: o.floating.height - (["left", "right"].includes(i) ? 2 * (0 !== w || 0 !== v ? w + v : f$2(m.top, m.bottom)) : m[p]),
					availableWidth: o.floating.width - (["top", "bottom"].includes(i) ? 2 * (0 !== y || 0 !== x ? y + x : f$2(m.left, m.right)) : m[h])
				}, R = await a.getDimensions(l.floating);
				c?.({
					...r,
					...b
				});
				const A = await a.getDimensions(l.floating);
				return R.width !== A.width || R.height !== A.height ? { reset: { rects: !0 } } : {};
			}
		};
	};
	function n(t) {
		return t && t.document && t.location && t.alert && t.setInterval;
	}
	function o$6(t) {
		if (null == t) return window;
		if (!n(t)) {
			const e = t.ownerDocument;
			return e && e.defaultView || window;
		}
		return t;
	}
	function i$3(t) {
		return o$6(t).getComputedStyle(t);
	}
	function r$2(t) {
		return n(t) ? "" : t ? (t.nodeName || "").toLowerCase() : "";
	}
	function l$2() {
		const t = navigator.userAgentData;
		return null != t && t.brands ? t.brands.map(((t) => t.brand + "/" + t.version)).join(" ") : navigator.userAgent;
	}
	function c$2(t) {
		return t instanceof o$6(t).HTMLElement;
	}
	function f$1(t) {
		return t instanceof o$6(t).Element;
	}
	function s$4(t) {
		if ("undefined" == typeof ShadowRoot) return !1;
		return t instanceof o$6(t).ShadowRoot || t instanceof ShadowRoot;
	}
	function u$3(t) {
		const { overflow: e, overflowX: n, overflowY: o } = i$3(t);
		return /auto|scroll|overlay|hidden/.test(e + o + n);
	}
	function d$3(t) {
		return [
			"table",
			"td",
			"th"
		].includes(r$2(t));
	}
	function h$2(t) {
		const e = /firefox/i.test(l$2()), n = i$3(t);
		return "none" !== n.transform || "none" !== n.perspective || "paint" === n.contain || ["transform", "perspective"].includes(n.willChange) || e && "filter" === n.willChange || e && !!n.filter && "none" !== n.filter;
	}
	function a$1() {
		return !/^((?!chrome|android).)*safari/i.test(l$2());
	}
	var g$1 = Math.min;
	var p$4 = Math.max;
	var m = Math.round;
	function w$1(t, e, n) {
		var i, r, l, s;
		void 0 === e && (e = !1), void 0 === n && (n = !1);
		const u = t.getBoundingClientRect();
		let d = 1, h = 1;
		e && c$2(t) && (d = t.offsetWidth > 0 && m(u.width) / t.offsetWidth || 1, h = t.offsetHeight > 0 && m(u.height) / t.offsetHeight || 1);
		const g = f$1(t) ? o$6(t) : window, p = !a$1() && n, w = (u.left + (p && null != (i = null == (r = g.visualViewport) ? void 0 : r.offsetLeft) ? i : 0)) / d, v = (u.top + (p && null != (l = null == (s = g.visualViewport) ? void 0 : s.offsetTop) ? l : 0)) / h, y = u.width / d, x = u.height / h;
		return {
			width: y,
			height: x,
			top: v,
			right: w + y,
			bottom: v + x,
			left: w,
			x: w,
			y: v
		};
	}
	function v$1(t) {
		return (e = t, (e instanceof o$6(e).Node ? t.ownerDocument : t.document) || window.document).documentElement;
		var e;
	}
	function y$3(t) {
		return f$1(t) ? {
			scrollLeft: t.scrollLeft,
			scrollTop: t.scrollTop
		} : {
			scrollLeft: t.pageXOffset,
			scrollTop: t.pageYOffset
		};
	}
	function x(t) {
		return w$1(v$1(t)).left + y$3(t).scrollLeft;
	}
	function b$1(t, e, n) {
		const o = c$2(e), i = v$1(e), l = w$1(t, o && function(t) {
			const e = w$1(t);
			return m(e.width) !== t.offsetWidth || m(e.height) !== t.offsetHeight;
		}(e), "fixed" === n);
		let f = {
			scrollLeft: 0,
			scrollTop: 0
		};
		const s = {
			x: 0,
			y: 0
		};
		if (o || !o && "fixed" !== n) if (("body" !== r$2(e) || u$3(i)) && (f = y$3(e)), c$2(e)) {
			const t = w$1(e, !0);
			s.x = t.x + e.clientLeft, s.y = t.y + e.clientTop;
		} else i && (s.x = x(i));
		return {
			x: l.left + f.scrollLeft - s.x,
			y: l.top + f.scrollTop - s.y,
			width: l.width,
			height: l.height
		};
	}
	function L(t) {
		return "html" === r$2(t) ? t : t.assignedSlot || t.parentNode || (s$4(t) ? t.host : null) || v$1(t);
	}
	function R$1(t) {
		return c$2(t) && "fixed" !== getComputedStyle(t).position ? t.offsetParent : null;
	}
	function T$1(t) {
		const e = o$6(t);
		let n = R$1(t);
		for (; n && d$3(n) && "static" === getComputedStyle(n).position;) n = R$1(n);
		return n && ("html" === r$2(n) || "body" === r$2(n) && "static" === getComputedStyle(n).position && !h$2(n)) ? e : n || function(t) {
			let e = L(t);
			for (s$4(e) && (e = e.host); c$2(e) && !["html", "body"].includes(r$2(e));) {
				if (h$2(e)) return e;
				e = e.parentNode;
			}
			return null;
		}(t) || e;
	}
	function W(t) {
		if (c$2(t)) return {
			width: t.offsetWidth,
			height: t.offsetHeight
		};
		const e = w$1(t);
		return {
			width: e.width,
			height: e.height
		};
	}
	function E(t) {
		const e = L(t);
		return [
			"html",
			"body",
			"#document"
		].includes(r$2(e)) ? t.ownerDocument.body : c$2(e) && u$3(e) ? e : E(e);
	}
	function H$1(t, e) {
		var n;
		void 0 === e && (e = []);
		const i = E(t), r = i === (null == (n = t.ownerDocument) ? void 0 : n.body), l = o$6(i), c = r ? [l].concat(l.visualViewport || [], u$3(i) ? i : []) : i, f = e.concat(c);
		return r ? f : f.concat(H$1(c));
	}
	function C(e, n, r) {
		return "viewport" === n ? l$3(function(t, e) {
			const n = o$6(t), i = v$1(t), r = n.visualViewport;
			let l = i.clientWidth, c = i.clientHeight, f = 0, s = 0;
			if (r) {
				l = r.width, c = r.height;
				const t = a$1();
				(t || !t && "fixed" === e) && (f = r.offsetLeft, s = r.offsetTop);
			}
			return {
				width: l,
				height: c,
				x: f,
				y: s
			};
		}(e, r)) : f$1(n) ? function(t, e) {
			const n = w$1(t, !1, "fixed" === e), o = n.top + t.clientTop, i = n.left + t.clientLeft;
			return {
				top: o,
				left: i,
				x: i,
				y: o,
				right: i + t.clientWidth,
				bottom: o + t.clientHeight,
				width: t.clientWidth,
				height: t.clientHeight
			};
		}(n, r) : l$3(function(t) {
			var e;
			const n = v$1(t), o = y$3(t), r = null == (e = t.ownerDocument) ? void 0 : e.body, l = p$4(n.scrollWidth, n.clientWidth, r ? r.scrollWidth : 0, r ? r.clientWidth : 0), c = p$4(n.scrollHeight, n.clientHeight, r ? r.scrollHeight : 0, r ? r.clientHeight : 0);
			let f = -o.scrollLeft + x(t);
			const s = -o.scrollTop;
			return "rtl" === i$3(r || n).direction && (f += p$4(n.clientWidth, r ? r.clientWidth : 0) - l), {
				width: l,
				height: c,
				x: f,
				y: s
			};
		}(v$1(e)));
	}
	function S$2(t) {
		const e = H$1(t), n = ["absolute", "fixed"].includes(i$3(t).position) && c$2(t) ? T$1(t) : t;
		return f$1(n) ? e.filter(((t) => f$1(t) && function(t, e) {
			const n = null == e.getRootNode ? void 0 : e.getRootNode();
			if (t.contains(e)) return !0;
			if (n && s$4(n)) {
				let n = e;
				do {
					if (n && t === n) return !0;
					n = n.parentNode || n.host;
				} while (n);
			}
			return !1;
		}(t, n) && "body" !== r$2(t))) : [];
	}
	var D$1 = {
		getClippingRect: function(t) {
			let { element: e, boundary: n, rootBoundary: o, strategy: i } = t;
			const r = [..."clippingAncestors" === n ? S$2(e) : [].concat(n), o], l = r[0], c = r.reduce(((t, n) => {
				const o = C(e, n, i);
				return t.top = p$4(o.top, t.top), t.right = g$1(o.right, t.right), t.bottom = g$1(o.bottom, t.bottom), t.left = p$4(o.left, t.left), t;
			}), C(e, l, i));
			return {
				width: c.right - c.left,
				height: c.bottom - c.top,
				x: c.left,
				y: c.top
			};
		},
		convertOffsetParentRelativeRectToViewportRelativeRect: function(t) {
			let { rect: e, offsetParent: n, strategy: o } = t;
			const i = c$2(n), l = v$1(n);
			if (n === l) return e;
			let f = {
				scrollLeft: 0,
				scrollTop: 0
			};
			const s = {
				x: 0,
				y: 0
			};
			if ((i || !i && "fixed" !== o) && (("body" !== r$2(n) || u$3(l)) && (f = y$3(n)), c$2(n))) {
				const t = w$1(n, !0);
				s.x = t.x + n.clientLeft, s.y = t.y + n.clientTop;
			}
			return {
				...e,
				x: e.x - f.scrollLeft + s.x,
				y: e.y - f.scrollTop + s.y
			};
		},
		isElement: f$1,
		getDimensions: W,
		getOffsetParent: T$1,
		getDocumentElement: v$1,
		getElementRects: (t) => {
			let { reference: e, floating: n, strategy: o } = t;
			return {
				reference: b$1(e, T$1(n), o),
				floating: {
					...W(n),
					x: 0,
					y: 0
				}
			};
		},
		getClientRects: (t) => Array.from(t.getClientRects()),
		isRTL: (t) => "rtl" === i$3(t).direction
	};
	function N$1(t, e, n, o) {
		void 0 === o && (o = {});
		const { ancestorScroll: i = !0, ancestorResize: r = !0, elementResize: l = !0, animationFrame: c = !1 } = o, s = i && !c, u = r && !c, d = s || u ? [...f$1(t) ? H$1(t) : [], ...H$1(e)] : [];
		d.forEach(((t) => {
			s && t.addEventListener("scroll", n, { passive: !0 }), u && t.addEventListener("resize", n);
		}));
		let h, a = null;
		if (l) {
			let o = !0;
			a = new ResizeObserver((() => {
				o || n(), o = !1;
			})), f$1(t) && !c && a.observe(t), a.observe(e);
		}
		let g = c ? w$1(t) : null;
		return c && function e() {
			const o = w$1(t);
			!g || o.x === g.x && o.y === g.y && o.width === g.width && o.height === g.height || n();
			g = o, h = requestAnimationFrame(e);
		}(), n(), () => {
			var t;
			d.forEach(((t) => {
				s && t.removeEventListener("scroll", n), u && t.removeEventListener("resize", n);
			})), null == (t = a) || t.disconnect(), a = null, c && cancelAnimationFrame(h);
		};
	}
	var z = (t, n, o) => o$7(t, n, {
		platform: D$1,
		...o
	});
	var index$1 = typeof document !== "undefined" ? y$5 : p$6;
	function deepEqual(a, b) {
		if (a === b) return true;
		if (typeof a !== typeof b) return false;
		if (typeof a === "function" && a.toString() === b.toString()) return true;
		let length, i, keys;
		if (a && b && typeof a == "object") {
			if (Array.isArray(a)) {
				length = a.length;
				if (length != b.length) return false;
				for (i = length; i-- !== 0;) if (!deepEqual(a[i], b[i])) return false;
				return true;
			}
			keys = Object.keys(a);
			length = keys.length;
			if (length !== Object.keys(b).length) return false;
			for (i = length; i-- !== 0;) if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
			for (i = length; i-- !== 0;) {
				const key = keys[i];
				if (key === "_owner" && a.$$typeof) continue;
				if (!deepEqual(a[key], b[key])) return false;
			}
			return true;
		}
		return a !== a && b !== b;
	}
	function useLatestRef(value) {
		const ref = _$1(value);
		index$1(() => {
			ref.current = value;
		});
		return ref;
	}
	function useFloating(_temp) {
		let { middleware, placement = "bottom", strategy = "absolute", whileElementsMounted } = _temp === void 0 ? {} : _temp;
		const reference = _$1(null);
		const floating = _$1(null);
		const whileElementsMountedRef = useLatestRef(whileElementsMounted);
		const cleanupRef = _$1(null);
		const [data, setData] = h$4({
			x: null,
			y: null,
			strategy,
			placement,
			middlewareData: {}
		});
		const [latestMiddleware, setLatestMiddleware] = h$4(middleware);
		if (!deepEqual(latestMiddleware == null ? void 0 : latestMiddleware.map((_ref) => {
			let { options } = _ref;
			return options;
		}), middleware == null ? void 0 : middleware.map((_ref2) => {
			let { options } = _ref2;
			return options;
		}))) setLatestMiddleware(middleware);
		const update = T$4(() => {
			if (!reference.current || !floating.current) return;
			z(reference.current, floating.current, {
				middleware: latestMiddleware,
				placement,
				strategy
			}).then((data) => {
				if (isMountedRef.current) mn(() => {
					setData(data);
				});
			});
		}, [
			latestMiddleware,
			placement,
			strategy
		]);
		index$1(() => {
			if (isMountedRef.current) update();
		}, [update]);
		const isMountedRef = _$1(false);
		index$1(() => {
			isMountedRef.current = true;
			return () => {
				isMountedRef.current = false;
			};
		}, []);
		const runElementMountCallback = T$4(() => {
			if (typeof cleanupRef.current === "function") {
				cleanupRef.current();
				cleanupRef.current = null;
			}
			if (reference.current && floating.current) {
				if (whileElementsMountedRef.current) {
					const cleanupFn = whileElementsMountedRef.current(reference.current, floating.current, update);
					cleanupRef.current = cleanupFn;
				} else update();
			}
		}, [update, whileElementsMountedRef]);
		const setReference = T$4((node) => {
			reference.current = node;
			runElementMountCallback();
		}, [runElementMountCallback]);
		const setFloating = T$4((node) => {
			floating.current = node;
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
		}), [
			data,
			update,
			refs,
			setReference,
			setFloating
		]);
	}
	var arrow = (options) => {
		const { element, padding } = options;
		function isRef(value) {
			return Object.prototype.hasOwnProperty.call(value, "current");
		}
		return {
			name: "arrow",
			options,
			fn(args) {
				if (isRef(element)) {
					if (element.current != null) return m$1({
						element: element.current,
						padding
					}).fn(args);
					return {};
				} else if (element) return m$1({
					element,
					padding
				}).fn(args);
				return {};
			}
		};
	};
	var $7e8f5cd07187803e$export$be92b6f5f03c0fe9 = k$1((props, forwardedRef) => {
		const { children, width = 10, height = 5, ...arrowProps } = props;
		return y$6($8927f6f2acc4f386$export$250ffa63cdc0d034.svg, _extends({}, arrowProps, {
			ref: forwardedRef,
			width,
			height,
			viewBox: "0 0 30 10",
			preserveAspectRatio: "none"
		}), props.asChild ? children : y$6("polygon", { points: "0,0 30,0 15,10" }));
	});
	function $db6c3485150b8e66$export$1ab7ae714698c4b8(element) {
		const [size, setSize] = h$4(void 0);
		$9f79659886946c16$export$e5c5a5f917a5871c(() => {
			if (element) {
				setSize({
					width: element.offsetWidth,
					height: element.offsetHeight
				});
				const resizeObserver = new ResizeObserver((entries) => {
					if (!Array.isArray(entries)) return;
					if (!entries.length) return;
					const entry = entries[0];
					let width;
					let height;
					if ("borderBoxSize" in entry) {
						const borderSizeEntry = entry["borderBoxSize"];
						const borderSize = Array.isArray(borderSizeEntry) ? borderSizeEntry[0] : borderSizeEntry;
						width = borderSize["inlineSize"];
						height = borderSize["blockSize"];
					} else {
						width = element.offsetWidth;
						height = element.offsetHeight;
					}
					setSize({
						width,
						height
					});
				});
				resizeObserver.observe(element, { box: "border-box" });
				return () => resizeObserver.unobserve(element);
			} else setSize(void 0);
		}, [element]);
		return size;
	}
	var $cf1ac5d9fe0e8206$var$POPPER_NAME = "Popper";
	var [$cf1ac5d9fe0e8206$var$createPopperContext, $cf1ac5d9fe0e8206$export$722aac194ae923] = $c512c27ab02ef895$export$50c7b4e9d9f19c1($cf1ac5d9fe0e8206$var$POPPER_NAME);
	var [$cf1ac5d9fe0e8206$var$PopperProvider, $cf1ac5d9fe0e8206$var$usePopperContext] = $cf1ac5d9fe0e8206$var$createPopperContext($cf1ac5d9fe0e8206$var$POPPER_NAME);
	var $cf1ac5d9fe0e8206$export$badac9ada3a0bdf9 = (props) => {
		const { __scopePopper, children } = props;
		const [anchor, setAnchor] = h$4(null);
		return y$6($cf1ac5d9fe0e8206$var$PopperProvider, {
			scope: __scopePopper,
			anchor,
			onAnchorChange: setAnchor
		}, children);
	};
	var $cf1ac5d9fe0e8206$var$ANCHOR_NAME = "PopperAnchor";
	var $cf1ac5d9fe0e8206$export$ecd4e1ccab6ed6d = k$1((props, forwardedRef) => {
		const { __scopePopper, virtualRef, ...anchorProps } = props;
		const context = $cf1ac5d9fe0e8206$var$usePopperContext($cf1ac5d9fe0e8206$var$ANCHOR_NAME, __scopePopper);
		const ref = _$1(null);
		const composedRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedRef, ref);
		p$6(() => {
			context.onAnchorChange((virtualRef === null || virtualRef === void 0 ? void 0 : virtualRef.current) || ref.current);
		});
		return virtualRef ? null : y$6($8927f6f2acc4f386$export$250ffa63cdc0d034.div, _extends({}, anchorProps, { ref: composedRefs }));
	});
	var $cf1ac5d9fe0e8206$var$CONTENT_NAME = "PopperContent";
	var [$cf1ac5d9fe0e8206$var$PopperContentProvider, $cf1ac5d9fe0e8206$var$useContentContext] = $cf1ac5d9fe0e8206$var$createPopperContext($cf1ac5d9fe0e8206$var$CONTENT_NAME);
	var [$cf1ac5d9fe0e8206$var$PositionContextProvider, $cf1ac5d9fe0e8206$var$usePositionContext] = $cf1ac5d9fe0e8206$var$createPopperContext($cf1ac5d9fe0e8206$var$CONTENT_NAME, {
		hasParent: false,
		positionUpdateFns: new Set()
	});
	var $cf1ac5d9fe0e8206$export$bc4ae5855d3c4fc = k$1((props, forwardedRef) => {
		var _arrowSize$width, _arrowSize$height, _middlewareData$arrow, _middlewareData$arrow2, _middlewareData$arrow3, _middlewareData$hide, _middlewareData$trans, _middlewareData$trans2;
		const { __scopePopper, side = "bottom", sideOffset = 0, align = "center", alignOffset = 0, arrowPadding = 0, collisionBoundary = [], collisionPadding: collisionPaddingProp = 0, sticky = "partial", hideWhenDetached = false, avoidCollisions = true, onPlaced, ...contentProps } = props;
		const context = $cf1ac5d9fe0e8206$var$usePopperContext($cf1ac5d9fe0e8206$var$CONTENT_NAME, __scopePopper);
		const [content, setContent] = h$4(null);
		const composedRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedRef, (node) => setContent(node));
		const [arrow$1, setArrow] = h$4(null);
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
		const boundary = Array.isArray(collisionBoundary) ? collisionBoundary : [collisionBoundary];
		const hasExplicitBoundaries = boundary.length > 0;
		const detectOverflowOptions = {
			padding: collisionPadding,
			boundary: boundary.filter($cf1ac5d9fe0e8206$var$isNotNull),
			altBoundary: hasExplicitBoundaries
		};
		const { reference, floating, strategy, x, y, placement, middlewareData, update } = useFloating({
			strategy: "fixed",
			placement: desiredPlacement,
			whileElementsMounted: N$1,
			middleware: [
				$cf1ac5d9fe0e8206$var$anchorCssProperties(),
				T$2({
					mainAxis: sideOffset + arrowHeight,
					alignmentAxis: alignOffset
				}),
				avoidCollisions ? D$2({
					mainAxis: true,
					crossAxis: false,
					limiter: sticky === "partial" ? L$1() : void 0,
					...detectOverflowOptions
				}) : void 0,
				arrow$1 ? arrow({
					element: arrow$1,
					padding: arrowPadding
				}) : void 0,
				avoidCollisions ? b$2({ ...detectOverflowOptions }) : void 0,
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
				hideWhenDetached ? P({ strategy: "referenceHidden" }) : void 0
			].filter($cf1ac5d9fe0e8206$var$isDefined)
		});
		$9f79659886946c16$export$e5c5a5f917a5871c(() => {
			reference(context.anchor);
		}, [reference, context.anchor]);
		const isPlaced = x !== null && y !== null;
		const [placedSide, placedAlign] = $cf1ac5d9fe0e8206$var$getSideAndAlignFromPlacement(placement);
		const handlePlaced = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onPlaced);
		$9f79659886946c16$export$e5c5a5f917a5871c(() => {
			if (isPlaced) handlePlaced === null || handlePlaced === void 0 || handlePlaced();
		}, [isPlaced, handlePlaced]);
		const arrowX = (_middlewareData$arrow = middlewareData.arrow) === null || _middlewareData$arrow === void 0 ? void 0 : _middlewareData$arrow.x;
		const arrowY = (_middlewareData$arrow2 = middlewareData.arrow) === null || _middlewareData$arrow2 === void 0 ? void 0 : _middlewareData$arrow2.y;
		const cannotCenterArrow = ((_middlewareData$arrow3 = middlewareData.arrow) === null || _middlewareData$arrow3 === void 0 ? void 0 : _middlewareData$arrow3.centerOffset) !== 0;
		const [contentZIndex, setContentZIndex] = h$4();
		$9f79659886946c16$export$e5c5a5f917a5871c(() => {
			if (content) setContentZIndex(window.getComputedStyle(content).zIndex);
		}, [content]);
		const { hasParent, positionUpdateFns } = $cf1ac5d9fe0e8206$var$usePositionContext($cf1ac5d9fe0e8206$var$CONTENT_NAME, __scopePopper);
		const isRoot = !hasParent;
		y$5(() => {
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
			if (isRoot && isPlaced) Array.from(positionUpdateFns).reverse().forEach((fn) => requestAnimationFrame(fn));
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
				animation: !isPlaced ? "none" : void 0,
				opacity: (_middlewareData$hide = middlewareData.hide) !== null && _middlewareData$hide !== void 0 && _middlewareData$hide.referenceHidden ? 0 : void 0
			}
		};
		return y$6("div", {
			ref: floating,
			"data-radix-popper-content-wrapper": "",
			style: {
				position: strategy,
				left: 0,
				top: 0,
				transform: isPlaced ? `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)` : "translate3d(0, -200%, 0)",
				minWidth: "max-content",
				zIndex: contentZIndex,
				["--radix-popper-transform-origin"]: [(_middlewareData$trans = middlewareData.transformOrigin) === null || _middlewareData$trans === void 0 ? void 0 : _middlewareData$trans.x, (_middlewareData$trans2 = middlewareData.transformOrigin) === null || _middlewareData$trans2 === void 0 ? void 0 : _middlewareData$trans2.y].join(" ")
			},
			dir: props.dir
		}, y$6($cf1ac5d9fe0e8206$var$PopperContentProvider, {
			scope: __scopePopper,
			placedSide,
			onArrowChange: setArrow,
			arrowX,
			arrowY,
			shouldHideArrow: cannotCenterArrow
		}, isRoot ? y$6($cf1ac5d9fe0e8206$var$PositionContextProvider, {
			scope: __scopePopper,
			hasParent: true,
			positionUpdateFns
		}, y$6($8927f6f2acc4f386$export$250ffa63cdc0d034.div, commonProps)) : y$6($8927f6f2acc4f386$export$250ffa63cdc0d034.div, commonProps)));
	});
	var $cf1ac5d9fe0e8206$var$ARROW_NAME = "PopperArrow";
	var $cf1ac5d9fe0e8206$var$OPPOSITE_SIDE = {
		top: "bottom",
		right: "left",
		bottom: "top",
		left: "right"
	};
	var $cf1ac5d9fe0e8206$export$79d62cd4e10a3fd0 = k$1(function $cf1ac5d9fe0e8206$export$79d62cd4e10a3fd0(props, forwardedRef) {
		const { __scopePopper, ...arrowProps } = props;
		const contentContext = $cf1ac5d9fe0e8206$var$useContentContext($cf1ac5d9fe0e8206$var$ARROW_NAME, __scopePopper);
		const baseSide = $cf1ac5d9fe0e8206$var$OPPOSITE_SIDE[contentContext.placedSide];
		return y$6("span", {
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
		}, y$6($7e8f5cd07187803e$export$be92b6f5f03c0fe9, _extends({}, arrowProps, {
			ref: forwardedRef,
			style: {
				...arrowProps.style,
				display: "block"
			}
		})));
	});
	function $cf1ac5d9fe0e8206$var$isDefined(value) {
		return value !== void 0;
	}
	function $cf1ac5d9fe0e8206$var$isNotNull(value) {
		return value !== null;
	}
	var $cf1ac5d9fe0e8206$var$anchorCssProperties = () => ({
		name: "anchorCssProperties",
		fn(data) {
			const { rects, elements } = data;
			const { width, height } = rects.reference;
			elements.floating.style.setProperty("--radix-popper-anchor-width", `${width}px`);
			elements.floating.style.setProperty("--radix-popper-anchor-height", `${height}px`);
			return {};
		}
	});
	var $cf1ac5d9fe0e8206$var$transformOrigin = (options) => ({
		name: "transformOrigin",
		options,
		fn(data) {
			var _middlewareData$arrow4, _middlewareData$arrow5, _middlewareData$arrow6, _middlewareData$arrow7, _middlewareData$arrow8;
			const { placement, rects, middlewareData } = data;
			const isArrowHidden = ((_middlewareData$arrow4 = middlewareData.arrow) === null || _middlewareData$arrow4 === void 0 ? void 0 : _middlewareData$arrow4.centerOffset) !== 0;
			const arrowWidth = isArrowHidden ? 0 : options.arrowWidth;
			const arrowHeight = isArrowHidden ? 0 : options.arrowHeight;
			const [placedSide, placedAlign] = $cf1ac5d9fe0e8206$var$getSideAndAlignFromPlacement(placement);
			const noArrowAlign = {
				start: "0%",
				center: "50%",
				end: "100%"
			}[placedAlign];
			const arrowXCenter = ((_middlewareData$arrow5 = (_middlewareData$arrow6 = middlewareData.arrow) === null || _middlewareData$arrow6 === void 0 ? void 0 : _middlewareData$arrow6.x) !== null && _middlewareData$arrow5 !== void 0 ? _middlewareData$arrow5 : 0) + arrowWidth / 2;
			const arrowYCenter = ((_middlewareData$arrow7 = (_middlewareData$arrow8 = middlewareData.arrow) === null || _middlewareData$arrow8 === void 0 ? void 0 : _middlewareData$arrow8.y) !== null && _middlewareData$arrow7 !== void 0 ? _middlewareData$arrow7 : 0) + arrowHeight / 2;
			let x = "";
			let y = "";
			if (placedSide === "bottom") {
				x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
				y = `${-arrowHeight}px`;
			} else if (placedSide === "top") {
				x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
				y = `${rects.floating.height + arrowHeight}px`;
			} else if (placedSide === "right") {
				x = `${-arrowHeight}px`;
				y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
			} else if (placedSide === "left") {
				x = `${rects.floating.width + arrowHeight}px`;
				y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
			}
			return { data: {
				x,
				y
			} };
		}
	});
	function $cf1ac5d9fe0e8206$var$getSideAndAlignFromPlacement(placement) {
		const [side, align = "center"] = placement.split("-");
		return [side, align];
	}
	var $cf1ac5d9fe0e8206$export$be92b6f5f03c0fe9 = $cf1ac5d9fe0e8206$export$badac9ada3a0bdf9;
	var $cf1ac5d9fe0e8206$export$b688253958b8dfe7 = $cf1ac5d9fe0e8206$export$ecd4e1ccab6ed6d;
	var $cf1ac5d9fe0e8206$export$7c6e2c02157bb7d2 = $cf1ac5d9fe0e8206$export$bc4ae5855d3c4fc;
	var $cf1ac5d9fe0e8206$export$21b07c8f274aebd5 = $cf1ac5d9fe0e8206$export$79d62cd4e10a3fd0;
	var $cef8881cdc69808e$var$originalBodyUserSelect;
	var $cef8881cdc69808e$var$HOVERCARD_NAME = "HoverCard";
	var [$cef8881cdc69808e$var$createHoverCardContext, $cef8881cdc69808e$export$47b6998a836b7260] = $c512c27ab02ef895$export$50c7b4e9d9f19c1($cef8881cdc69808e$var$HOVERCARD_NAME, [$cf1ac5d9fe0e8206$export$722aac194ae923]);
	var $cef8881cdc69808e$var$usePopperScope = $cf1ac5d9fe0e8206$export$722aac194ae923();
	var [$cef8881cdc69808e$var$HoverCardProvider, $cef8881cdc69808e$var$useHoverCardContext] = $cef8881cdc69808e$var$createHoverCardContext($cef8881cdc69808e$var$HOVERCARD_NAME);
	var $cef8881cdc69808e$export$57a077cc9fbe653e = (props) => {
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
		const handleOpen = T$4(() => {
			clearTimeout(closeTimerRef.current);
			openTimerRef.current = window.setTimeout(() => setOpen(true), openDelay);
		}, [openDelay, setOpen]);
		const handleClose = T$4(() => {
			clearTimeout(openTimerRef.current);
			if (!hasSelectionRef.current && !isPointerDownOnContentRef.current) closeTimerRef.current = window.setTimeout(() => setOpen(false), closeDelay);
		}, [closeDelay, setOpen]);
		const handleDismiss = T$4(() => setOpen(false), [setOpen]);
		p$6(() => {
			return () => {
				clearTimeout(openTimerRef.current);
				clearTimeout(closeTimerRef.current);
			};
		}, []);
		return y$6($cef8881cdc69808e$var$HoverCardProvider, {
			scope: __scopeHoverCard,
			open,
			onOpenChange: setOpen,
			onOpen: handleOpen,
			onClose: handleClose,
			onDismiss: handleDismiss,
			hasSelectionRef,
			isPointerDownOnContentRef
		}, y$6($cf1ac5d9fe0e8206$export$be92b6f5f03c0fe9, popperScope, children));
	};
	var $cef8881cdc69808e$var$TRIGGER_NAME = "HoverCardTrigger";
	var $cef8881cdc69808e$export$ef9f7fd8e4ba882f = k$1((props, forwardedRef) => {
		const { __scopeHoverCard, ...triggerProps } = props;
		const context = $cef8881cdc69808e$var$useHoverCardContext($cef8881cdc69808e$var$TRIGGER_NAME, __scopeHoverCard);
		const popperScope = $cef8881cdc69808e$var$usePopperScope(__scopeHoverCard);
		return y$6($cf1ac5d9fe0e8206$export$b688253958b8dfe7, _extends({ asChild: true }, popperScope), y$6($8927f6f2acc4f386$export$250ffa63cdc0d034.a, _extends({ "data-state": context.open ? "open" : "closed" }, triggerProps, {
			ref: forwardedRef,
			onPointerEnter: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onPointerEnter, $cef8881cdc69808e$var$excludeTouch(context.onOpen)),
			onPointerLeave: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onPointerLeave, $cef8881cdc69808e$var$excludeTouch(context.onClose)),
			onFocus: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onFocus, context.onOpen),
			onBlur: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onBlur, context.onClose),
			onTouchStart: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onTouchStart, (event) => event.preventDefault())
		})));
	});
	var $cef8881cdc69808e$var$PORTAL_NAME = "HoverCardPortal";
	var [$cef8881cdc69808e$var$PortalProvider, $cef8881cdc69808e$var$usePortalContext] = $cef8881cdc69808e$var$createHoverCardContext($cef8881cdc69808e$var$PORTAL_NAME, { forceMount: void 0 });
	var $cef8881cdc69808e$export$b384c6e0a789f88b = (props) => {
		const { __scopeHoverCard, forceMount, children, container } = props;
		const context = $cef8881cdc69808e$var$useHoverCardContext($cef8881cdc69808e$var$PORTAL_NAME, __scopeHoverCard);
		return y$6($cef8881cdc69808e$var$PortalProvider, {
			scope: __scopeHoverCard,
			forceMount
		}, y$6($921a889cee6df7e8$export$99c2b779aa4e8b8b, { present: forceMount || context.open }, y$6($f1701beae083dbae$export$602eac185826482c, {
			asChild: true,
			container
		}, children)));
	};
	var $cef8881cdc69808e$var$CONTENT_NAME = "HoverCardContent";
	var $cef8881cdc69808e$export$aa4724a5938c586 = k$1((props, forwardedRef) => {
		const portalContext = $cef8881cdc69808e$var$usePortalContext($cef8881cdc69808e$var$CONTENT_NAME, props.__scopeHoverCard);
		const { forceMount = portalContext.forceMount, ...contentProps } = props;
		const context = $cef8881cdc69808e$var$useHoverCardContext($cef8881cdc69808e$var$CONTENT_NAME, props.__scopeHoverCard);
		return y$6($921a889cee6df7e8$export$99c2b779aa4e8b8b, { present: forceMount || context.open }, y$6($cef8881cdc69808e$var$HoverCardContentImpl, _extends({ "data-state": context.open ? "open" : "closed" }, contentProps, {
			onPointerEnter: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onPointerEnter, $cef8881cdc69808e$var$excludeTouch(context.onOpen)),
			onPointerLeave: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onPointerLeave, $cef8881cdc69808e$var$excludeTouch(context.onClose)),
			ref: forwardedRef
		})));
	});
	var $cef8881cdc69808e$var$HoverCardContentImpl = k$1((props, forwardedRef) => {
		const { __scopeHoverCard, onEscapeKeyDown, onPointerDownOutside, onFocusOutside, onInteractOutside, ...contentProps } = props;
		const context = $cef8881cdc69808e$var$useHoverCardContext($cef8881cdc69808e$var$CONTENT_NAME, __scopeHoverCard);
		const popperScope = $cef8881cdc69808e$var$usePopperScope(__scopeHoverCard);
		const ref = _$1(null);
		const composedRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedRef, ref);
		const [containSelection, setContainSelection] = h$4(false);
		p$6(() => {
			if (containSelection) {
				const body = document.body;
				$cef8881cdc69808e$var$originalBodyUserSelect = body.style.userSelect || body.style.webkitUserSelect;
				body.style.userSelect = "none";
				body.style.webkitUserSelect = "none";
				return () => {
					body.style.userSelect = $cef8881cdc69808e$var$originalBodyUserSelect;
					body.style.webkitUserSelect = $cef8881cdc69808e$var$originalBodyUserSelect;
				};
			}
		}, [containSelection]);
		p$6(() => {
			if (ref.current) {
				const handlePointerUp = () => {
					setContainSelection(false);
					context.isPointerDownOnContentRef.current = false;
					setTimeout(() => {
						var _document$getSelectio;
						if (((_document$getSelectio = document.getSelection()) === null || _document$getSelectio === void 0 ? void 0 : _document$getSelectio.toString()) !== "") context.hasSelectionRef.current = true;
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
		p$6(() => {
			if (ref.current) $cef8881cdc69808e$var$getTabbableNodes(ref.current).forEach((tabbable) => tabbable.setAttribute("tabindex", "-1"));
		});
		return y$6($5cb92bef7577960e$export$177fb62ff3ec1f22, {
			asChild: true,
			disableOutsidePointerEvents: false,
			onInteractOutside,
			onEscapeKeyDown,
			onPointerDownOutside,
			onFocusOutside: $e42e1063c40fb3ef$export$b9ecd428b558ff10(onFocusOutside, (event) => {
				event.preventDefault();
			}),
			onDismiss: context.onDismiss
		}, y$6($cf1ac5d9fe0e8206$export$7c6e2c02157bb7d2, _extends({}, popperScope, contentProps, {
			onPointerDown: $e42e1063c40fb3ef$export$b9ecd428b558ff10(contentProps.onPointerDown, (event) => {
				if (event.currentTarget.contains(event.target)) setContainSelection(true);
				context.hasSelectionRef.current = false;
				context.isPointerDownOnContentRef.current = true;
			}),
			ref: composedRefs,
			style: {
				...contentProps.style,
				userSelect: containSelection ? "text" : void 0,
				WebkitUserSelect: containSelection ? "text" : void 0,
				"--radix-hover-card-content-transform-origin": "var(--radix-popper-transform-origin)",
				"--radix-hover-card-content-available-width": "var(--radix-popper-available-width)",
				"--radix-hover-card-content-available-height": "var(--radix-popper-available-height)",
				"--radix-hover-card-trigger-width": "var(--radix-popper-anchor-width)",
				"--radix-hover-card-trigger-height": "var(--radix-popper-anchor-height)"
			}
		})));
	});
	var $cef8881cdc69808e$export$b9744d3e7456d806 = k$1((props, forwardedRef) => {
		const { __scopeHoverCard, ...arrowProps } = props;
		const popperScope = $cef8881cdc69808e$var$usePopperScope(__scopeHoverCard);
		return y$6($cf1ac5d9fe0e8206$export$21b07c8f274aebd5, _extends({}, popperScope, arrowProps, { ref: forwardedRef }));
	});
	function $cef8881cdc69808e$var$excludeTouch(eventHandler) {
		return (event) => event.pointerType === "touch" ? void 0 : eventHandler();
	}
	function $cef8881cdc69808e$var$getTabbableNodes(container) {
		const nodes = [];
		const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, { acceptNode: (node) => {
			return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
		} });
		while (walker.nextNode()) nodes.push(walker.currentNode);
		return nodes;
	}
	var $cef8881cdc69808e$export$be92b6f5f03c0fe9 = $cef8881cdc69808e$export$57a077cc9fbe653e;
	var $cef8881cdc69808e$export$41fb9f06171c75f4 = $cef8881cdc69808e$export$ef9f7fd8e4ba882f;
	var $cef8881cdc69808e$export$602eac185826482c = $cef8881cdc69808e$export$b384c6e0a789f88b;
	var $cef8881cdc69808e$export$7c6e2c02157bb7d2 = $cef8881cdc69808e$export$aa4724a5938c586;
	var $cef8881cdc69808e$export$21b07c8f274aebd5 = $cef8881cdc69808e$export$b9744d3e7456d806;
	function _typeof(obj) {
		"@babel/helpers - typeof";
		return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
			return typeof obj;
		} : function(obj) {
			return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
		}, _typeof(obj);
	}
	function _toPrimitive(input, hint) {
		if (_typeof(input) !== "object" || input === null) return input;
		var prim = input[Symbol.toPrimitive];
		if (prim !== void 0) {
			var res = prim.call(input, hint || "default");
			if (_typeof(res) !== "object") return res;
			throw new TypeError("@@toPrimitive must return a primitive value.");
		}
		return (hint === "string" ? String : Number)(input);
	}
	function _toPropertyKey(arg) {
		var key = _toPrimitive(arg, "string");
		return _typeof(key) === "symbol" ? key : String(key);
	}
	function _defineProperty(obj, key, value) {
		key = _toPropertyKey(key);
		if (key in obj) Object.defineProperty(obj, key, {
			value,
			enumerable: true,
			configurable: true,
			writable: true
		});
		else obj[key] = value;
		return obj;
	}
	function warn() {
		if (console && console.warn) {
			var _console;
			for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
			if (typeof args[0] === "string") args[0] = "react-i18next:: ".concat(args[0]);
			(_console = console).warn.apply(_console, args);
		}
	}
	var alreadyWarned = {};
	function warnOnce() {
		for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) args[_key2] = arguments[_key2];
		if (typeof args[0] === "string" && alreadyWarned[args[0]]) return;
		if (typeof args[0] === "string") alreadyWarned[args[0]] = new Date();
		warn.apply(void 0, args);
	}
	var loadedClb = function loadedClb(i18n, cb) {
		return function() {
			if (i18n.isInitialized) cb();
			else i18n.on("initialized", function initialized() {
				setTimeout(function() {
					i18n.off("initialized", initialized);
				}, 0);
				cb();
			});
		};
	};
	function loadNamespaces$1(i18n, ns, cb) {
		i18n.loadNamespaces(ns, loadedClb(i18n, cb));
	}
	function loadLanguages$1(i18n, lng, ns, cb) {
		if (typeof ns === "string") ns = [ns];
		ns.forEach(function(n) {
			if (i18n.options.ns.indexOf(n) < 0) i18n.options.ns.push(n);
		});
		i18n.loadLanguages(lng, loadedClb(i18n, cb));
	}
	function oldI18nextHasLoadedNamespace(ns, i18n) {
		var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
		var lng = i18n.languages[0];
		var fallbackLng = i18n.options ? i18n.options.fallbackLng : false;
		var lastLng = i18n.languages[i18n.languages.length - 1];
		if (lng.toLowerCase() === "cimode") return true;
		var loadNotPending = function loadNotPending(l, n) {
			var loadState = i18n.services.backendConnector.state["".concat(l, "|").concat(n)];
			return loadState === -1 || loadState === 2;
		};
		if (options.bindI18n && options.bindI18n.indexOf("languageChanging") > -1 && i18n.services.backendConnector.backend && i18n.isLanguageChangingTo && !loadNotPending(i18n.isLanguageChangingTo, ns)) return false;
		if (i18n.hasResourceBundle(lng, ns)) return true;
		if (!i18n.services.backendConnector.backend || i18n.options.resources && !i18n.options.partialBundledLanguages) return true;
		if (loadNotPending(lng, ns) && (!fallbackLng || loadNotPending(lastLng, ns))) return true;
		return false;
	}
	function hasLoadedNamespace$1(ns, i18n) {
		var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
		if (!i18n.languages || !i18n.languages.length) {
			warnOnce("i18n.languages were undefined or empty", i18n.languages);
			return true;
		}
		if (!(i18n.options.ignoreJSONStructure !== void 0)) return oldI18nextHasLoadedNamespace(ns, i18n, options);
		return i18n.hasLoadedNamespace(ns, {
			lng: options.lng,
			precheck: function precheck(i18nInstance, loadNotPending) {
				if (options.bindI18n && options.bindI18n.indexOf("languageChanging") > -1 && i18nInstance.services.backendConnector.backend && i18nInstance.isLanguageChangingTo && !loadNotPending(i18nInstance.isLanguageChangingTo, ns)) return false;
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
		"&quot;": "\"",
		"&#34;": "\"",
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
	var unescapeHtmlEntity = function unescapeHtmlEntity(m) {
		return htmlEntities[m];
	};
	var unescape = function unescape(text) {
		return text.replace(matchHtmlEntity, unescapeHtmlEntity);
	};
	function ownKeys$8(object, enumerableOnly) {
		var keys = Object.keys(object);
		if (Object.getOwnPropertySymbols) {
			var symbols = Object.getOwnPropertySymbols(object);
			if (enumerableOnly) symbols = symbols.filter(function(sym) {
				return Object.getOwnPropertyDescriptor(object, sym).enumerable;
			});
			keys.push.apply(keys, symbols);
		}
		return keys;
	}
	function _objectSpread$8(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i] != null ? arguments[i] : {};
			if (i % 2) ownKeys$8(Object(source), true).forEach(function(key) {
				_defineProperty(target, key, source[key]);
			});
			else if (Object.getOwnPropertyDescriptors) Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
			else ownKeys$8(Object(source)).forEach(function(key) {
				Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
			});
		}
		return target;
	}
	var defaultOptions = {
		bindI18n: "languageChanged",
		bindI18nStore: "",
		transEmptyNodeValue: "",
		transSupportBasicHtmlNodes: true,
		transWrapTextNodes: "",
		transKeepBasicHtmlNodesFor: [
			"br",
			"strong",
			"i",
			"p"
		],
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
	function setI18n(instance) {
		i18nInstance = instance;
	}
	function getI18n() {
		return i18nInstance;
	}
	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
	}
	function _defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];
			descriptor.enumerable = descriptor.enumerable || false;
			descriptor.configurable = true;
			if ("value" in descriptor) descriptor.writable = true;
			Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
		}
	}
	function _createClass(Constructor, protoProps, staticProps) {
		if (protoProps) _defineProperties(Constructor.prototype, protoProps);
		if (staticProps) _defineProperties(Constructor, staticProps);
		Object.defineProperty(Constructor, "prototype", { writable: false });
		return Constructor;
	}
	var initReactI18next = {
		type: "3rdParty",
		init: function init(instance) {
			setDefaults(instance.options.react);
			setI18n(instance);
		}
	};
	var I18nContext = G$1();
	var ReportNamespaces = function() {
		function ReportNamespaces() {
			_classCallCheck(this, ReportNamespaces);
			this.usedNamespaces = {};
		}
		_createClass(ReportNamespaces, [{
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
		return ReportNamespaces;
	}();
	function _arrayWithHoles(arr) {
		if (Array.isArray(arr)) return arr;
	}
	function _iterableToArrayLimit(arr, i) {
		var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
		if (null != _i) {
			var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1;
			try {
				if (_x = (_i = _i.call(arr)).next, 0 === i) {
					if (Object(_i) !== _i) return;
					_n = !1;
				} else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
			} catch (err) {
				_d = !0, _e = err;
			} finally {
				try {
					if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return;
				} finally {
					if (_d) throw _e;
				}
			}
			return _arr;
		}
	}
	function _arrayLikeToArray(arr, len) {
		if (len == null || len > arr.length) len = arr.length;
		for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
		return arr2;
	}
	function _unsupportedIterableToArray(o, minLen) {
		if (!o) return;
		if (typeof o === "string") return _arrayLikeToArray(o, minLen);
		var n = Object.prototype.toString.call(o).slice(8, -1);
		if (n === "Object" && o.constructor) n = o.constructor.name;
		if (n === "Map" || n === "Set") return Array.from(o);
		if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
	}
	function _nonIterableRest() {
		throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}
	function _slicedToArray(arr, i) {
		return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
	}
	function ownKeys$7(object, enumerableOnly) {
		var keys = Object.keys(object);
		if (Object.getOwnPropertySymbols) {
			var symbols = Object.getOwnPropertySymbols(object);
			if (enumerableOnly) symbols = symbols.filter(function(sym) {
				return Object.getOwnPropertyDescriptor(object, sym).enumerable;
			});
			keys.push.apply(keys, symbols);
		}
		return keys;
	}
	function _objectSpread$7(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i] != null ? arguments[i] : {};
			if (i % 2) ownKeys$7(Object(source), true).forEach(function(key) {
				_defineProperty(target, key, source[key]);
			});
			else if (Object.getOwnPropertyDescriptors) Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
			else ownKeys$7(Object(source)).forEach(function(key) {
				Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
			});
		}
		return target;
	}
	var usePrevious = function usePrevious(value, ignore) {
		var ref = _$1();
		p$6(function() {
			ref.current = ignore ? ref.current : value;
		}, [value, ignore]);
		return ref.current;
	};
	function useTranslation(ns) {
		var props = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
		var i18nFromProps = props.i18n;
		var _ref = q$1(I18nContext) || {}, i18nFromContext = _ref.i18n, defaultNSFromContext = _ref.defaultNS;
		var i18n = i18nFromProps || i18nFromContext || getI18n();
		if (i18n && !i18n.reportNamespaces) i18n.reportNamespaces = new ReportNamespaces();
		if (!i18n) {
			warnOnce("You will need to pass in an i18next instance by using initReactI18next");
			var notReadyT = function notReadyT(k, optsOrDefaultValue) {
				if (typeof optsOrDefaultValue === "string") return optsOrDefaultValue;
				if (optsOrDefaultValue && _typeof(optsOrDefaultValue) === "object" && typeof optsOrDefaultValue.defaultValue === "string") return optsOrDefaultValue.defaultValue;
				return Array.isArray(k) ? k[k.length - 1] : k;
			};
			var retNotReady = [
				notReadyT,
				{},
				false
			];
			retNotReady.t = notReadyT;
			retNotReady.i18n = {};
			retNotReady.ready = false;
			return retNotReady;
		}
		if (i18n.options.react && i18n.options.react.wait !== void 0) warnOnce("It seems you are still using the old wait option, you may migrate to the new useSuspense behaviour.");
		var i18nOptions = _objectSpread$7(_objectSpread$7(_objectSpread$7({}, getDefaults()), i18n.options.react), props);
		var useSuspense = i18nOptions.useSuspense, keyPrefix = i18nOptions.keyPrefix;
		var namespaces = ns || defaultNSFromContext || i18n.options && i18n.options.defaultNS;
		namespaces = typeof namespaces === "string" ? [namespaces] : namespaces || ["translation"];
		if (i18n.reportNamespaces.addUsedNamespaces) i18n.reportNamespaces.addUsedNamespaces(namespaces);
		var ready = (i18n.isInitialized || i18n.initializedStoreOnce) && namespaces.every(function(n) {
			return hasLoadedNamespace$1(n, i18n, i18nOptions);
		});
		function getT() {
			return i18n.getFixedT(props.lng || null, i18nOptions.nsMode === "fallback" ? namespaces : namespaces[0], keyPrefix);
		}
		var _useState2 = _slicedToArray(h$4(getT), 2), t = _useState2[0], setT = _useState2[1];
		var joinedNS = namespaces.join();
		if (props.lng) joinedNS = "".concat(props.lng).concat(joinedNS);
		var previousJoinedNS = usePrevious(joinedNS);
		var isMounted = _$1(true);
		p$6(function() {
			var bindI18n = i18nOptions.bindI18n, bindI18nStore = i18nOptions.bindI18nStore;
			isMounted.current = true;
			if (!ready && !useSuspense) {
				if (props.lng) loadLanguages$1(i18n, props.lng, namespaces, function() {
					if (isMounted.current) setT(getT);
				});
				else loadNamespaces$1(i18n, namespaces, function() {
					if (isMounted.current) setT(getT);
				});
			}
			if (ready && previousJoinedNS && previousJoinedNS !== joinedNS && isMounted.current) setT(getT);
			function boundReset() {
				if (isMounted.current) setT(getT);
			}
			if (bindI18n && i18n) i18n.on(bindI18n, boundReset);
			if (bindI18nStore && i18n) i18n.store.on(bindI18nStore, boundReset);
			return function() {
				isMounted.current = false;
				if (bindI18n && i18n) bindI18n.split(" ").forEach(function(e) {
					return i18n.off(e, boundReset);
				});
				if (bindI18nStore && i18n) bindI18nStore.split(" ").forEach(function(e) {
					return i18n.store.off(e, boundReset);
				});
			};
		}, [i18n, joinedNS]);
		var isInitial = _$1(true);
		p$6(function() {
			if (isMounted.current && !isInitial.current) setT(getT);
			isInitial.current = false;
		}, [i18n, keyPrefix]);
		var ret = [
			t,
			i18n,
			ready
		];
		ret.t = t;
		ret.i18n = i18n;
		ret.ready = ready;
		if (ready) return ret;
		if (!ready && !useSuspense) return ret;
		throw new Promise(function(resolve) {
			if (props.lng) loadLanguages$1(i18n, props.lng, namespaces, function() {
				return resolve();
			});
			else loadNamespaces$1(i18n, namespaces, function() {
				return resolve();
			});
		});
	}
	function _assertThisInitialized(self) {
		if (self === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		return self;
	}
	function _setPrototypeOf(o, p) {
		_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
			o.__proto__ = p;
			return o;
		};
		return _setPrototypeOf(o, p);
	}
	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function");
		subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
			value: subClass,
			writable: true,
			configurable: true
		} });
		Object.defineProperty(subClass, "prototype", { writable: false });
		if (superClass) _setPrototypeOf(subClass, superClass);
	}
	function _possibleConstructorReturn(self, call) {
		if (call && (_typeof(call) === "object" || typeof call === "function")) return call;
		else if (call !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
		return _assertThisInitialized(self);
	}
	function _getPrototypeOf(o) {
		_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
			return o.__proto__ || Object.getPrototypeOf(o);
		};
		return _getPrototypeOf(o);
	}
	function _iterableToArray(iter) {
		if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
	}
	function _toArray(arr) {
		return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest();
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
		for (var i = 1; i < arguments.length; i++) {
			var source = null != arguments[i] ? arguments[i] : {};
			i % 2 ? ownKeys$6(Object(source), !0).forEach(function(key) {
				_defineProperty(target, key, source[key]);
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$6(Object(source)).forEach(function(key) {
				Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
			});
		}
		return target;
	}
	var consoleLogger = {
		type: "logger",
		log: function log(args) {
			this.output("log", args);
		},
		warn: function warn(args) {
			this.output("warn", args);
		},
		error: function error(args) {
			this.output("error", args);
		},
		output: function output(type, args) {
			if (console && console[type]) console[type].apply(console, args);
		}
	};
	var baseLogger = new (function() {
		function Logger(concreteLogger) {
			var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
			_classCallCheck(this, Logger);
			this.init(concreteLogger, options);
		}
		_createClass(Logger, [
			{
				key: "init",
				value: function init(concreteLogger) {
					var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
					this.prefix = options.prefix || "i18next:";
					this.logger = concreteLogger || consoleLogger;
					this.options = options;
					this.debug = options.debug;
				}
			},
			{
				key: "setDebug",
				value: function setDebug(bool) {
					this.debug = bool;
				}
			},
			{
				key: "log",
				value: function log() {
					for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
					return this.forward(args, "log", "", true);
				}
			},
			{
				key: "warn",
				value: function warn() {
					for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) args[_key2] = arguments[_key2];
					return this.forward(args, "warn", "", true);
				}
			},
			{
				key: "error",
				value: function error() {
					for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) args[_key3] = arguments[_key3];
					return this.forward(args, "error", "");
				}
			},
			{
				key: "deprecate",
				value: function deprecate() {
					for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) args[_key4] = arguments[_key4];
					return this.forward(args, "warn", "WARNING DEPRECATED: ", true);
				}
			},
			{
				key: "forward",
				value: function forward(args, lvl, prefix, debugOnly) {
					if (debugOnly && !this.debug) return null;
					if (typeof args[0] === "string") args[0] = "".concat(prefix).concat(this.prefix, " ").concat(args[0]);
					return this.logger[lvl](args);
				}
			},
			{
				key: "create",
				value: function create(moduleName) {
					return new Logger(this.logger, _objectSpread$6(_objectSpread$6({}, { prefix: "".concat(this.prefix, ":").concat(moduleName, ":") }), this.options));
				}
			},
			{
				key: "clone",
				value: function clone(options) {
					options = options || this.options;
					options.prefix = options.prefix || this.prefix;
					return new Logger(this.logger, options);
				}
			}
		]);
		return Logger;
	}())();
	var EventEmitter = function() {
		function EventEmitter() {
			_classCallCheck(this, EventEmitter);
			this.observers = {};
		}
		_createClass(EventEmitter, [
			{
				key: "on",
				value: function on(events, listener) {
					var _this = this;
					events.split(" ").forEach(function(event) {
						_this.observers[event] = _this.observers[event] || [];
						_this.observers[event].push(listener);
					});
					return this;
				}
			},
			{
				key: "off",
				value: function off(event, listener) {
					if (!this.observers[event]) return;
					if (!listener) {
						delete this.observers[event];
						return;
					}
					this.observers[event] = this.observers[event].filter(function(l) {
						return l !== listener;
					});
				}
			},
			{
				key: "emit",
				value: function emit(event) {
					for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) args[_key - 1] = arguments[_key];
					if (this.observers[event]) [].concat(this.observers[event]).forEach(function(observer) {
						observer.apply(void 0, args);
					});
					if (this.observers["*"]) [].concat(this.observers["*"]).forEach(function(observer) {
						observer.apply(observer, [event].concat(args));
					});
				}
			}
		]);
		return EventEmitter;
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
	function copy(a, s, t) {
		a.forEach(function(m) {
			if (s[m]) t[m] = s[m];
		});
	}
	function getLastOfPath(object, path, Empty) {
		function cleanKey(key) {
			return key && key.indexOf("###") > -1 ? key.replace(/###/g, ".") : key;
		}
		function canNotTraverseDeeper() {
			return !object || typeof object === "string";
		}
		var stack = typeof path !== "string" ? [].concat(path) : path.split(".");
		while (stack.length > 1) {
			if (canNotTraverseDeeper()) return {};
			var key = cleanKey(stack.shift());
			if (!object[key] && Empty) object[key] = new Empty();
			if (Object.prototype.hasOwnProperty.call(object, key)) object = object[key];
			else object = {};
		}
		if (canNotTraverseDeeper()) return {};
		return {
			obj: object,
			k: cleanKey(stack.shift())
		};
	}
	function setPath(object, path, newValue) {
		var _getLastOfPath = getLastOfPath(object, path, Object), obj = _getLastOfPath.obj, k = _getLastOfPath.k;
		obj[k] = newValue;
	}
	function pushPath(object, path, newValue, concat) {
		var _getLastOfPath2 = getLastOfPath(object, path, Object), obj = _getLastOfPath2.obj, k = _getLastOfPath2.k;
		obj[k] = obj[k] || [];
		if (concat) obj[k] = obj[k].concat(newValue);
		if (!concat) obj[k].push(newValue);
	}
	function getPath(object, path) {
		var _getLastOfPath3 = getLastOfPath(object, path), obj = _getLastOfPath3.obj, k = _getLastOfPath3.k;
		if (!obj) return void 0;
		return obj[k];
	}
	function getPathWithDefaults(data, defaultData, key) {
		var value = getPath(data, key);
		if (value !== void 0) return value;
		return getPath(defaultData, key);
	}
	function deepExtend(target, source, overwrite) {
		for (var prop in source) if (prop !== "__proto__" && prop !== "constructor") {
			if (prop in target) {
				if (typeof target[prop] === "string" || target[prop] instanceof String || typeof source[prop] === "string" || source[prop] instanceof String) {
					if (overwrite) target[prop] = source[prop];
				} else deepExtend(target[prop], source[prop], overwrite);
			} else target[prop] = source[prop];
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
		"\"": "&quot;",
		"'": "&#39;",
		"/": "&#x2F;"
	};
	function escape(data) {
		if (typeof data === "string") return data.replace(/[&<>"'\/]/g, function(s) {
			return _entityMap[s];
		});
		return data;
	}
	var isIE10 = typeof window !== "undefined" && window.navigator && typeof window.navigator.userAgentData === "undefined" && window.navigator.userAgent && window.navigator.userAgent.indexOf("MSIE") > -1;
	var chars = [
		" ",
		",",
		"?",
		"!",
		";"
	];
	function looksLikeObjectPath(key, nsSeparator, keySeparator) {
		nsSeparator = nsSeparator || "";
		keySeparator = keySeparator || "";
		var possibleChars = chars.filter(function(c) {
			return nsSeparator.indexOf(c) < 0 && keySeparator.indexOf(c) < 0;
		});
		if (possibleChars.length === 0) return true;
		var r = new RegExp("(".concat(possibleChars.map(function(c) {
			return c === "?" ? "\\?" : c;
		}).join("|"), ")"));
		var matched = !r.test(key);
		if (!matched) {
			var ki = key.indexOf(keySeparator);
			if (ki > 0 && !r.test(key.substring(0, ki))) matched = true;
		}
		return matched;
	}
	function deepFind(obj, path) {
		var keySeparator = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : ".";
		if (!obj) return void 0;
		if (obj[path]) return obj[path];
		var paths = path.split(keySeparator);
		var current = obj;
		for (var i = 0; i < paths.length; ++i) {
			if (!current) return void 0;
			if (typeof current[paths[i]] === "string" && i + 1 < paths.length) return;
			if (current[paths[i]] === void 0) {
				var j = 2;
				var p = paths.slice(i, i + j).join(keySeparator);
				var mix = current[p];
				while (mix === void 0 && paths.length > i + j) {
					j++;
					p = paths.slice(i, i + j).join(keySeparator);
					mix = current[p];
				}
				if (mix === void 0) return void 0;
				if (mix === null) return null;
				if (path.endsWith(p)) {
					if (typeof mix === "string") return mix;
					if (p && typeof mix[p] === "string") return mix[p];
				}
				var joinedPath = paths.slice(i + j).join(keySeparator);
				if (joinedPath) return deepFind(mix, joinedPath, keySeparator);
				return;
			}
			current = current[paths[i]];
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
		for (var i = 1; i < arguments.length; i++) {
			var source = null != arguments[i] ? arguments[i] : {};
			i % 2 ? ownKeys$5(Object(source), !0).forEach(function(key) {
				_defineProperty(target, key, source[key]);
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$5(Object(source)).forEach(function(key) {
				Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
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
			} else result = Super.apply(this, arguments);
			return _possibleConstructorReturn(this, result);
		};
	}
	function _isNativeReflectConstruct$3() {
		if (typeof Reflect === "undefined" || !Reflect.construct) return false;
		if (Reflect.construct.sham) return false;
		if (typeof Proxy === "function") return true;
		try {
			Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
			return true;
		} catch (e) {
			return false;
		}
	}
	var ResourceStore = function(_EventEmitter) {
		_inherits(ResourceStore, _EventEmitter);
		var _super = _createSuper$3(ResourceStore);
		function ResourceStore(data) {
			var _this;
			var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
				ns: ["translation"],
				defaultNS: "translation"
			};
			_classCallCheck(this, ResourceStore);
			_this = _super.call(this);
			if (isIE10) EventEmitter.call(_assertThisInitialized(_this));
			_this.data = data || {};
			_this.options = options;
			if (_this.options.keySeparator === void 0) _this.options.keySeparator = ".";
			if (_this.options.ignoreJSONStructure === void 0) _this.options.ignoreJSONStructure = true;
			return _this;
		}
		_createClass(ResourceStore, [
			{
				key: "addNamespaces",
				value: function addNamespaces(ns) {
					if (this.options.ns.indexOf(ns) < 0) this.options.ns.push(ns);
				}
			},
			{
				key: "removeNamespaces",
				value: function removeNamespaces(ns) {
					var index = this.options.ns.indexOf(ns);
					if (index > -1) this.options.ns.splice(index, 1);
				}
			},
			{
				key: "getResource",
				value: function getResource(lng, ns, key) {
					var options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
					var keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
					var ignoreJSONStructure = options.ignoreJSONStructure !== void 0 ? options.ignoreJSONStructure : this.options.ignoreJSONStructure;
					var path = [lng, ns];
					if (key && typeof key !== "string") path = path.concat(key);
					if (key && typeof key === "string") path = path.concat(keySeparator ? key.split(keySeparator) : key);
					if (lng.indexOf(".") > -1) path = lng.split(".");
					var result = getPath(this.data, path);
					if (result || !ignoreJSONStructure || typeof key !== "string") return result;
					return deepFind(this.data && this.data[lng] && this.data[lng][ns], key, keySeparator);
				}
			},
			{
				key: "addResource",
				value: function addResource(lng, ns, key, value) {
					var options = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : { silent: false };
					var keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
					var path = [lng, ns];
					if (key) path = path.concat(keySeparator ? key.split(keySeparator) : key);
					if (lng.indexOf(".") > -1) {
						path = lng.split(".");
						value = ns;
						ns = path[1];
					}
					this.addNamespaces(ns);
					setPath(this.data, path, value);
					if (!options.silent) this.emit("added", lng, ns, key, value);
				}
			},
			{
				key: "addResources",
				value: function addResources(lng, ns, resources) {
					var options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : { silent: false };
					for (var m in resources) if (typeof resources[m] === "string" || Object.prototype.toString.apply(resources[m]) === "[object Array]") this.addResource(lng, ns, m, resources[m], { silent: true });
					if (!options.silent) this.emit("added", lng, ns, resources);
				}
			},
			{
				key: "addResourceBundle",
				value: function addResourceBundle(lng, ns, resources, deep, overwrite) {
					var options = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : { silent: false };
					var path = [lng, ns];
					if (lng.indexOf(".") > -1) {
						path = lng.split(".");
						deep = resources;
						resources = ns;
						ns = path[1];
					}
					this.addNamespaces(ns);
					var pack = getPath(this.data, path) || {};
					if (deep) deepExtend(pack, resources, overwrite);
					else pack = _objectSpread$5(_objectSpread$5({}, pack), resources);
					setPath(this.data, path, pack);
					if (!options.silent) this.emit("added", lng, ns, resources);
				}
			},
			{
				key: "removeResourceBundle",
				value: function removeResourceBundle(lng, ns) {
					if (this.hasResourceBundle(lng, ns)) delete this.data[lng][ns];
					this.removeNamespaces(ns);
					this.emit("removed", lng, ns);
				}
			},
			{
				key: "hasResourceBundle",
				value: function hasResourceBundle(lng, ns) {
					return this.getResource(lng, ns) !== void 0;
				}
			},
			{
				key: "getResourceBundle",
				value: function getResourceBundle(lng, ns) {
					if (!ns) ns = this.options.defaultNS;
					if (this.options.compatibilityAPI === "v1") return _objectSpread$5(_objectSpread$5({}, {}), this.getResource(lng, ns));
					return this.getResource(lng, ns);
				}
			},
			{
				key: "getDataByLanguage",
				value: function getDataByLanguage(lng) {
					return this.data[lng];
				}
			},
			{
				key: "hasLanguageSomeTranslations",
				value: function hasLanguageSomeTranslations(lng) {
					var data = this.getDataByLanguage(lng);
					return !!(data && Object.keys(data) || []).find(function(v) {
						return data[v] && Object.keys(data[v]).length > 0;
					});
				}
			},
			{
				key: "toJSON",
				value: function toJSON() {
					return this.data;
				}
			}
		]);
		return ResourceStore;
	}(EventEmitter);
	var postProcessor = {
		processors: {},
		addPostProcessor: function addPostProcessor(module) {
			this.processors[module.name] = module;
		},
		handle: function handle(processors, value, key, options, translator) {
			var _this = this;
			processors.forEach(function(processor) {
				if (_this.processors[processor]) value = _this.processors[processor].process(value, key, options, translator);
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
		for (var i = 1; i < arguments.length; i++) {
			var source = null != arguments[i] ? arguments[i] : {};
			i % 2 ? ownKeys$4(Object(source), !0).forEach(function(key) {
				_defineProperty(target, key, source[key]);
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$4(Object(source)).forEach(function(key) {
				Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
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
			} else result = Super.apply(this, arguments);
			return _possibleConstructorReturn(this, result);
		};
	}
	function _isNativeReflectConstruct$2() {
		if (typeof Reflect === "undefined" || !Reflect.construct) return false;
		if (Reflect.construct.sham) return false;
		if (typeof Proxy === "function") return true;
		try {
			Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
			return true;
		} catch (e) {
			return false;
		}
	}
	var checkedLoadedFor = {};
	var Translator = function(_EventEmitter) {
		_inherits(Translator, _EventEmitter);
		var _super = _createSuper$2(Translator);
		function Translator(services) {
			var _this;
			var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
			_classCallCheck(this, Translator);
			_this = _super.call(this);
			if (isIE10) EventEmitter.call(_assertThisInitialized(_this));
			copy([
				"resourceStore",
				"languageUtils",
				"pluralResolver",
				"interpolator",
				"backendConnector",
				"i18nFormat",
				"utils"
			], services, _assertThisInitialized(_this));
			_this.options = options;
			if (_this.options.keySeparator === void 0) _this.options.keySeparator = ".";
			_this.logger = baseLogger.create("translator");
			return _this;
		}
		_createClass(Translator, [
			{
				key: "changeLanguage",
				value: function changeLanguage(lng) {
					if (lng) this.language = lng;
				}
			},
			{
				key: "exists",
				value: function exists(key) {
					var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : { interpolation: {} };
					if (key === void 0 || key === null) return false;
					var resolved = this.resolve(key, options);
					return resolved && resolved.res !== void 0;
				}
			},
			{
				key: "extractFromKey",
				value: function extractFromKey(key, options) {
					var nsSeparator = options.nsSeparator !== void 0 ? options.nsSeparator : this.options.nsSeparator;
					if (nsSeparator === void 0) nsSeparator = ":";
					var keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
					var namespaces = options.ns || this.options.defaultNS || [];
					var wouldCheckForNsInKey = nsSeparator && key.indexOf(nsSeparator) > -1;
					var seemsNaturalLanguage = !this.options.userDefinedKeySeparator && !options.keySeparator && !this.options.userDefinedNsSeparator && !options.nsSeparator && !looksLikeObjectPath(key, nsSeparator, keySeparator);
					if (wouldCheckForNsInKey && !seemsNaturalLanguage) {
						var m = key.match(this.interpolator.nestingRegexp);
						if (m && m.length > 0) return {
							key,
							namespaces
						};
						var parts = key.split(nsSeparator);
						if (nsSeparator !== keySeparator || nsSeparator === keySeparator && this.options.ns.indexOf(parts[0]) > -1) namespaces = parts.shift();
						key = parts.join(keySeparator);
					}
					if (typeof namespaces === "string") namespaces = [namespaces];
					return {
						key,
						namespaces
					};
				}
			},
			{
				key: "translate",
				value: function translate(keys, options, lastKey) {
					var _this2 = this;
					if (_typeof(options) !== "object" && this.options.overloadTranslationOptionHandler) options = this.options.overloadTranslationOptionHandler(arguments);
					if (_typeof(options) === "object") options = _objectSpread$4({}, options);
					if (!options) options = {};
					if (keys === void 0 || keys === null) return "";
					if (!Array.isArray(keys)) keys = [String(keys)];
					var returnDetails = options.returnDetails !== void 0 ? options.returnDetails : this.options.returnDetails;
					var keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
					var _this$extractFromKey = this.extractFromKey(keys[keys.length - 1], options), key = _this$extractFromKey.key, namespaces = _this$extractFromKey.namespaces;
					var namespace = namespaces[namespaces.length - 1];
					var lng = options.lng || this.language;
					var appendNamespaceToCIMode = options.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;
					if (lng && lng.toLowerCase() === "cimode") {
						if (appendNamespaceToCIMode) {
							var nsSeparator = options.nsSeparator || this.options.nsSeparator;
							if (returnDetails) return {
								res: "".concat(namespace).concat(nsSeparator).concat(key),
								usedKey: key,
								exactUsedKey: key,
								usedLng: lng,
								usedNS: namespace
							};
							return "".concat(namespace).concat(nsSeparator).concat(key);
						}
						if (returnDetails) return {
							res: key,
							usedKey: key,
							exactUsedKey: key,
							usedLng: lng,
							usedNS: namespace
						};
						return key;
					}
					var resolved = this.resolve(keys, options);
					var res = resolved && resolved.res;
					var resUsedKey = resolved && resolved.usedKey || key;
					var resExactUsedKey = resolved && resolved.exactUsedKey || key;
					var resType = Object.prototype.toString.apply(res);
					var noObject = [
						"[object Number]",
						"[object Function]",
						"[object RegExp]"
					];
					var joinArrays = options.joinArrays !== void 0 ? options.joinArrays : this.options.joinArrays;
					var handleAsObjectInI18nFormat = !this.i18nFormat || this.i18nFormat.handleAsObject;
					if (handleAsObjectInI18nFormat && res && typeof res !== "string" && typeof res !== "boolean" && typeof res !== "number" && noObject.indexOf(resType) < 0 && !(typeof joinArrays === "string" && resType === "[object Array]")) {
						if (!options.returnObjects && !this.options.returnObjects) {
							if (!this.options.returnedObjectHandler) this.logger.warn("accessing an object - but returnObjects options is not enabled!");
							var r = this.options.returnedObjectHandler ? this.options.returnedObjectHandler(resUsedKey, res, _objectSpread$4(_objectSpread$4({}, options), {}, { ns: namespaces })) : "key '".concat(key, " (").concat(this.language, ")' returned an object instead of string.");
							if (returnDetails) {
								resolved.res = r;
								return resolved;
							}
							return r;
						}
						if (keySeparator) {
							var resTypeIsArray = resType === "[object Array]";
							var copy = resTypeIsArray ? [] : {};
							var newKeyToUse = resTypeIsArray ? resExactUsedKey : resUsedKey;
							for (var m in res) if (Object.prototype.hasOwnProperty.call(res, m)) {
								var deepKey = "".concat(newKeyToUse).concat(keySeparator).concat(m);
								copy[m] = this.translate(deepKey, _objectSpread$4(_objectSpread$4({}, options), {
									joinArrays: false,
									ns: namespaces
								}));
								if (copy[m] === deepKey) copy[m] = res[m];
							}
							res = copy;
						}
					} else if (handleAsObjectInI18nFormat && typeof joinArrays === "string" && resType === "[object Array]") {
						res = res.join(joinArrays);
						if (res) res = this.extendTranslation(res, keys, options, lastKey);
					} else {
						var usedDefault = false;
						var usedKey = false;
						var needsPluralHandling = options.count !== void 0 && typeof options.count !== "string";
						var hasDefaultValue = Translator.hasDefaultValue(options);
						var defaultValueSuffix = needsPluralHandling ? this.pluralResolver.getSuffix(lng, options.count, options) : "";
						var defaultValue = options["defaultValue".concat(defaultValueSuffix)] || options.defaultValue;
						if (!this.isValidLookup(res) && hasDefaultValue) {
							usedDefault = true;
							res = defaultValue;
						}
						if (!this.isValidLookup(res)) {
							usedKey = true;
							res = key;
						}
						var resForMissing = (options.missingKeyNoValueFallbackToKey || this.options.missingKeyNoValueFallbackToKey) && usedKey ? void 0 : res;
						var updateMissing = hasDefaultValue && defaultValue !== res && this.options.updateMissing;
						if (usedKey || usedDefault || updateMissing) {
							this.logger.log(updateMissing ? "updateKey" : "missingKey", lng, namespace, key, updateMissing ? defaultValue : res);
							if (keySeparator) {
								var fk = this.resolve(key, _objectSpread$4(_objectSpread$4({}, options), {}, { keySeparator: false }));
								if (fk && fk.res) this.logger.warn("Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.");
							}
							var lngs = [];
							var fallbackLngs = this.languageUtils.getFallbackCodes(this.options.fallbackLng, options.lng || this.language);
							if (this.options.saveMissingTo === "fallback" && fallbackLngs && fallbackLngs[0]) for (var i = 0; i < fallbackLngs.length; i++) lngs.push(fallbackLngs[i]);
							else if (this.options.saveMissingTo === "all") lngs = this.languageUtils.toResolveHierarchy(options.lng || this.language);
							else lngs.push(options.lng || this.language);
							var send = function send(l, k, specificDefaultValue) {
								var defaultForMissing = hasDefaultValue && specificDefaultValue !== res ? specificDefaultValue : resForMissing;
								if (_this2.options.missingKeyHandler) _this2.options.missingKeyHandler(l, namespace, k, defaultForMissing, updateMissing, options);
								else if (_this2.backendConnector && _this2.backendConnector.saveMissing) _this2.backendConnector.saveMissing(l, namespace, k, defaultForMissing, updateMissing, options);
								_this2.emit("missingKey", l, namespace, k, res);
							};
							if (this.options.saveMissing) {
								if (this.options.saveMissingPlurals && needsPluralHandling) lngs.forEach(function(language) {
									_this2.pluralResolver.getSuffixes(language, options).forEach(function(suffix) {
										send([language], key + suffix, options["defaultValue".concat(suffix)] || defaultValue);
									});
								});
								else send(lngs, key, defaultValue);
							}
						}
						res = this.extendTranslation(res, keys, options, resolved, lastKey);
						if (usedKey && res === key && this.options.appendNamespaceToMissingKey) res = "".concat(namespace, ":").concat(key);
						if ((usedKey || usedDefault) && this.options.parseMissingKeyHandler) {
							if (this.options.compatibilityAPI !== "v1") res = this.options.parseMissingKeyHandler(this.options.appendNamespaceToMissingKey ? "".concat(namespace, ":").concat(key) : key, usedDefault ? res : void 0);
							else res = this.options.parseMissingKeyHandler(res);
						}
					}
					if (returnDetails) {
						resolved.res = res;
						return resolved;
					}
					return res;
				}
			},
			{
				key: "extendTranslation",
				value: function extendTranslation(res, key, options, resolved, lastKey) {
					var _this3 = this;
					if (this.i18nFormat && this.i18nFormat.parse) res = this.i18nFormat.parse(res, _objectSpread$4(_objectSpread$4({}, this.options.interpolation.defaultVariables), options), resolved.usedLng, resolved.usedNS, resolved.usedKey, { resolved });
					else if (!options.skipInterpolation) {
						if (options.interpolation) this.interpolator.init(_objectSpread$4(_objectSpread$4({}, options), { interpolation: _objectSpread$4(_objectSpread$4({}, this.options.interpolation), options.interpolation) }));
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
							for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
							if (lastKey && lastKey[0] === args[0] && !options.context) {
								_this3.logger.warn("It seems you are nesting recursively key: ".concat(args[0], " in key: ").concat(key[0]));
								return null;
							}
							return _this3.translate.apply(_this3, args.concat([key]));
						}, options);
						if (options.interpolation) this.interpolator.reset();
					}
					var postProcess = options.postProcess || this.options.postProcess;
					var postProcessorNames = typeof postProcess === "string" ? [postProcess] : postProcess;
					if (res !== void 0 && res !== null && postProcessorNames && postProcessorNames.length && options.applyPostProcessor !== false) res = postProcessor.handle(postProcessorNames, res, key, this.options && this.options.postProcessPassResolved ? _objectSpread$4({ i18nResolved: resolved }, options) : options, this);
					return res;
				}
			},
			{
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
					keys.forEach(function(k) {
						if (_this4.isValidLookup(found)) return;
						var extracted = _this4.extractFromKey(k, options);
						var key = extracted.key;
						usedKey = key;
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
								_this4.logger.warn("key \"".concat(usedKey, "\" for languages \"").concat(codes.join(", "), "\" won't get resolved as namespace \"").concat(usedNS, "\" was not yet loaded"), "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
							}
							codes.forEach(function(code) {
								if (_this4.isValidLookup(found)) return;
								usedLng = code;
								var finalKeys = [key];
								if (_this4.i18nFormat && _this4.i18nFormat.addLookupKeys) _this4.i18nFormat.addLookupKeys(finalKeys, key, code, ns, options);
								else {
									var pluralSuffix;
									if (needsPluralHandling) pluralSuffix = _this4.pluralResolver.getSuffix(code, options.count, options);
									var zeroSuffix = "".concat(_this4.options.pluralSeparator, "zero");
									if (needsPluralHandling) {
										finalKeys.push(key + pluralSuffix);
										if (needsZeroSuffixLookup) finalKeys.push(key + zeroSuffix);
									}
									if (needsContextHandling) {
										var contextKey = "".concat(key).concat(_this4.options.contextSeparator).concat(options.context);
										finalKeys.push(contextKey);
										if (needsPluralHandling) {
											finalKeys.push(contextKey + pluralSuffix);
											if (needsZeroSuffixLookup) finalKeys.push(contextKey + zeroSuffix);
										}
									}
								}
								var possibleKey;
								while (possibleKey = finalKeys.pop()) if (!_this4.isValidLookup(found)) {
									exactUsedKey = possibleKey;
									found = _this4.getResource(code, ns, possibleKey, options);
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
			},
			{
				key: "isValidLookup",
				value: function isValidLookup(res) {
					return res !== void 0 && !(!this.options.returnNull && res === null) && !(!this.options.returnEmptyString && res === "");
				}
			},
			{
				key: "getResource",
				value: function getResource(code, ns, key) {
					var options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
					if (this.i18nFormat && this.i18nFormat.getResource) return this.i18nFormat.getResource(code, ns, key, options);
					return this.resourceStore.getResource(code, ns, key, options);
				}
			}
		], [{
			key: "hasDefaultValue",
			value: function hasDefaultValue(options) {
				var prefix = "defaultValue";
				for (var option in options) if (Object.prototype.hasOwnProperty.call(options, option) && prefix === option.substring(0, prefix.length) && void 0 !== options[option]) return true;
				return false;
			}
		}]);
		return Translator;
	}(EventEmitter);
	function capitalize(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
	var LanguageUtil = function() {
		function LanguageUtil(options) {
			_classCallCheck(this, LanguageUtil);
			this.options = options;
			this.supportedLngs = this.options.supportedLngs || false;
			this.logger = baseLogger.create("languageUtils");
		}
		_createClass(LanguageUtil, [
			{
				key: "getScriptPartFromCode",
				value: function getScriptPartFromCode(code) {
					if (!code || code.indexOf("-") < 0) return null;
					var p = code.split("-");
					if (p.length === 2) return null;
					p.pop();
					if (p[p.length - 1].toLowerCase() === "x") return null;
					return this.formatLanguageCode(p.join("-"));
				}
			},
			{
				key: "getLanguagePartFromCode",
				value: function getLanguagePartFromCode(code) {
					if (!code || code.indexOf("-") < 0) return code;
					var p = code.split("-");
					return this.formatLanguageCode(p[0]);
				}
			},
			{
				key: "formatLanguageCode",
				value: function formatLanguageCode(code) {
					if (typeof code === "string" && code.indexOf("-") > -1) {
						var specialCases = [
							"hans",
							"hant",
							"latn",
							"cyrl",
							"cans",
							"mong",
							"arab"
						];
						var p = code.split("-");
						if (this.options.lowerCaseLng) p = p.map(function(part) {
							return part.toLowerCase();
						});
						else if (p.length === 2) {
							p[0] = p[0].toLowerCase();
							p[1] = p[1].toUpperCase();
							if (specialCases.indexOf(p[1].toLowerCase()) > -1) p[1] = capitalize(p[1].toLowerCase());
						} else if (p.length === 3) {
							p[0] = p[0].toLowerCase();
							if (p[1].length === 2) p[1] = p[1].toUpperCase();
							if (p[0] !== "sgn" && p[2].length === 2) p[2] = p[2].toUpperCase();
							if (specialCases.indexOf(p[1].toLowerCase()) > -1) p[1] = capitalize(p[1].toLowerCase());
							if (specialCases.indexOf(p[2].toLowerCase()) > -1) p[2] = capitalize(p[2].toLowerCase());
						}
						return p.join("-");
					}
					return this.options.cleanCode || this.options.lowerCaseLng ? code.toLowerCase() : code;
				}
			},
			{
				key: "isSupportedCode",
				value: function isSupportedCode(code) {
					if (this.options.load === "languageOnly" || this.options.nonExplicitSupportedLngs) code = this.getLanguagePartFromCode(code);
					return !this.supportedLngs || !this.supportedLngs.length || this.supportedLngs.indexOf(code) > -1;
				}
			},
			{
				key: "getBestMatchFromCodes",
				value: function getBestMatchFromCodes(codes) {
					var _this = this;
					if (!codes) return null;
					var found;
					codes.forEach(function(code) {
						if (found) return;
						var cleanedLng = _this.formatLanguageCode(code);
						if (!_this.options.supportedLngs || _this.isSupportedCode(cleanedLng)) found = cleanedLng;
					});
					if (!found && this.options.supportedLngs) codes.forEach(function(code) {
						if (found) return;
						var lngOnly = _this.getLanguagePartFromCode(code);
						if (_this.isSupportedCode(lngOnly)) return found = lngOnly;
						found = _this.options.supportedLngs.find(function(supportedLng) {
							if (supportedLng === lngOnly) return supportedLng;
							if (supportedLng.indexOf("-") < 0 && lngOnly.indexOf("-") < 0) return;
							if (supportedLng.indexOf(lngOnly) === 0) return supportedLng;
						});
					});
					if (!found) found = this.getFallbackCodes(this.options.fallbackLng)[0];
					return found;
				}
			},
			{
				key: "getFallbackCodes",
				value: function getFallbackCodes(fallbacks, code) {
					if (!fallbacks) return [];
					if (typeof fallbacks === "function") fallbacks = fallbacks(code);
					if (typeof fallbacks === "string") fallbacks = [fallbacks];
					if (Object.prototype.toString.apply(fallbacks) === "[object Array]") return fallbacks;
					if (!code) return fallbacks["default"] || [];
					var found = fallbacks[code];
					if (!found) found = fallbacks[this.getScriptPartFromCode(code)];
					if (!found) found = fallbacks[this.formatLanguageCode(code)];
					if (!found) found = fallbacks[this.getLanguagePartFromCode(code)];
					if (!found) found = fallbacks["default"];
					return found || [];
				}
			},
			{
				key: "toResolveHierarchy",
				value: function toResolveHierarchy(code, fallbackCode) {
					var _this2 = this;
					var fallbackCodes = this.getFallbackCodes(fallbackCode || this.options.fallbackLng || [], code);
					var codes = [];
					var addCode = function addCode(c) {
						if (!c) return;
						if (_this2.isSupportedCode(c)) codes.push(c);
						else _this2.logger.warn("rejecting language code not found in supportedLngs: ".concat(c));
					};
					if (typeof code === "string" && code.indexOf("-") > -1) {
						if (this.options.load !== "languageOnly") addCode(this.formatLanguageCode(code));
						if (this.options.load !== "languageOnly" && this.options.load !== "currentOnly") addCode(this.getScriptPartFromCode(code));
						if (this.options.load !== "currentOnly") addCode(this.getLanguagePartFromCode(code));
					} else if (typeof code === "string") addCode(this.formatLanguageCode(code));
					fallbackCodes.forEach(function(fc) {
						if (codes.indexOf(fc) < 0) addCode(_this2.formatLanguageCode(fc));
					});
					return codes;
				}
			}
		]);
		return LanguageUtil;
	}();
	var sets = [
		{
			lngs: [
				"ach",
				"ak",
				"am",
				"arn",
				"br",
				"fil",
				"gun",
				"ln",
				"mfe",
				"mg",
				"mi",
				"oc",
				"pt",
				"pt-BR",
				"tg",
				"tl",
				"ti",
				"tr",
				"uz",
				"wa"
			],
			nr: [1, 2],
			fc: 1
		},
		{
			lngs: [
				"af",
				"an",
				"ast",
				"az",
				"bg",
				"bn",
				"ca",
				"da",
				"de",
				"dev",
				"el",
				"en",
				"eo",
				"es",
				"et",
				"eu",
				"fi",
				"fo",
				"fur",
				"fy",
				"gl",
				"gu",
				"ha",
				"hi",
				"hu",
				"hy",
				"ia",
				"it",
				"kk",
				"kn",
				"ku",
				"lb",
				"mai",
				"ml",
				"mn",
				"mr",
				"nah",
				"nap",
				"nb",
				"ne",
				"nl",
				"nn",
				"no",
				"nso",
				"pa",
				"pap",
				"pms",
				"ps",
				"pt-PT",
				"rm",
				"sco",
				"se",
				"si",
				"so",
				"son",
				"sq",
				"sv",
				"sw",
				"ta",
				"te",
				"tk",
				"ur",
				"yo"
			],
			nr: [1, 2],
			fc: 2
		},
		{
			lngs: [
				"ay",
				"bo",
				"cgg",
				"fa",
				"ht",
				"id",
				"ja",
				"jbo",
				"ka",
				"km",
				"ko",
				"ky",
				"lo",
				"ms",
				"sah",
				"su",
				"th",
				"tt",
				"ug",
				"vi",
				"wo",
				"zh"
			],
			nr: [1],
			fc: 3
		},
		{
			lngs: [
				"be",
				"bs",
				"cnr",
				"dz",
				"hr",
				"ru",
				"sr",
				"uk"
			],
			nr: [
				1,
				2,
				5
			],
			fc: 4
		},
		{
			lngs: ["ar"],
			nr: [
				0,
				1,
				2,
				3,
				11,
				100
			],
			fc: 5
		},
		{
			lngs: ["cs", "sk"],
			nr: [
				1,
				2,
				5
			],
			fc: 6
		},
		{
			lngs: ["csb", "pl"],
			nr: [
				1,
				2,
				5
			],
			fc: 7
		},
		{
			lngs: ["cy"],
			nr: [
				1,
				2,
				3,
				8
			],
			fc: 8
		},
		{
			lngs: ["fr"],
			nr: [1, 2],
			fc: 9
		},
		{
			lngs: ["ga"],
			nr: [
				1,
				2,
				3,
				7,
				11
			],
			fc: 10
		},
		{
			lngs: ["gd"],
			nr: [
				1,
				2,
				3,
				20
			],
			fc: 11
		},
		{
			lngs: ["is"],
			nr: [1, 2],
			fc: 12
		},
		{
			lngs: ["jv"],
			nr: [0, 1],
			fc: 13
		},
		{
			lngs: ["kw"],
			nr: [
				1,
				2,
				3,
				4
			],
			fc: 14
		},
		{
			lngs: ["lt"],
			nr: [
				1,
				2,
				10
			],
			fc: 15
		},
		{
			lngs: ["lv"],
			nr: [
				1,
				2,
				0
			],
			fc: 16
		},
		{
			lngs: ["mk"],
			nr: [1, 2],
			fc: 17
		},
		{
			lngs: ["mnk"],
			nr: [
				0,
				1,
				2
			],
			fc: 18
		},
		{
			lngs: ["mt"],
			nr: [
				1,
				2,
				11,
				20
			],
			fc: 19
		},
		{
			lngs: ["or"],
			nr: [2, 1],
			fc: 2
		},
		{
			lngs: ["ro"],
			nr: [
				1,
				2,
				20
			],
			fc: 20
		},
		{
			lngs: ["sl"],
			nr: [
				5,
				1,
				2,
				3
			],
			fc: 21
		},
		{
			lngs: ["he", "iw"],
			nr: [
				1,
				2,
				20,
				21
			],
			fc: 22
		}
	];
	var _rulesPluralsTypes = {
		1: function _(n) {
			return Number(n > 1);
		},
		2: function _(n) {
			return Number(n != 1);
		},
		3: function _(n) {
			return 0;
		},
		4: function _(n) {
			return Number(n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
		},
		5: function _(n) {
			return Number(n == 0 ? 0 : n == 1 ? 1 : n == 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5);
		},
		6: function _(n) {
			return Number(n == 1 ? 0 : n >= 2 && n <= 4 ? 1 : 2);
		},
		7: function _(n) {
			return Number(n == 1 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
		},
		8: function _(n) {
			return Number(n == 1 ? 0 : n == 2 ? 1 : n != 8 && n != 11 ? 2 : 3);
		},
		9: function _(n) {
			return Number(n >= 2);
		},
		10: function _(n) {
			return Number(n == 1 ? 0 : n == 2 ? 1 : n < 7 ? 2 : n < 11 ? 3 : 4);
		},
		11: function _(n) {
			return Number(n == 1 || n == 11 ? 0 : n == 2 || n == 12 ? 1 : n > 2 && n < 20 ? 2 : 3);
		},
		12: function _(n) {
			return Number(n % 10 != 1 || n % 100 == 11);
		},
		13: function _(n) {
			return Number(n !== 0);
		},
		14: function _(n) {
			return Number(n == 1 ? 0 : n == 2 ? 1 : n == 3 ? 2 : 3);
		},
		15: function _(n) {
			return Number(n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
		},
		16: function _(n) {
			return Number(n % 10 == 1 && n % 100 != 11 ? 0 : n !== 0 ? 1 : 2);
		},
		17: function _(n) {
			return Number(n == 1 || n % 10 == 1 && n % 100 != 11 ? 0 : 1);
		},
		18: function _(n) {
			return Number(n == 0 ? 0 : n == 1 ? 1 : 2);
		},
		19: function _(n) {
			return Number(n == 1 ? 0 : n == 0 || n % 100 > 1 && n % 100 < 11 ? 1 : n % 100 > 10 && n % 100 < 20 ? 2 : 3);
		},
		20: function _(n) {
			return Number(n == 1 ? 0 : n == 0 || n % 100 > 0 && n % 100 < 20 ? 1 : 2);
		},
		21: function _(n) {
			return Number(n % 100 == 1 ? 1 : n % 100 == 2 ? 2 : n % 100 == 3 || n % 100 == 4 ? 3 : 0);
		},
		22: function _(n) {
			return Number(n == 1 ? 0 : n == 2 ? 1 : (n < 0 || n > 10) && n % 10 == 0 ? 2 : 3);
		}
	};
	var deprecatedJsonVersions = [
		"v1",
		"v2",
		"v3"
	];
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
			set.lngs.forEach(function(l) {
				rules[l] = {
					numbers: set.nr,
					plurals: _rulesPluralsTypes[set.fc]
				};
			});
		});
		return rules;
	}
	var PluralResolver = function() {
		function PluralResolver(languageUtils) {
			var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
			_classCallCheck(this, PluralResolver);
			this.languageUtils = languageUtils;
			this.options = options;
			this.logger = baseLogger.create("pluralResolver");
			if ((!this.options.compatibilityJSON || this.options.compatibilityJSON === "v4") && (typeof Intl === "undefined" || !Intl.PluralRules)) {
				this.options.compatibilityJSON = "v3";
				this.logger.error("Your environment seems not to be Intl API compatible, use an Intl.PluralRules polyfill. Will fallback to the compatibilityJSON v3 format handling.");
			}
			this.rules = createRules();
		}
		_createClass(PluralResolver, [
			{
				key: "addRule",
				value: function addRule(lng, obj) {
					this.rules[lng] = obj;
				}
			},
			{
				key: "getRule",
				value: function getRule(code) {
					var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
					if (this.shouldUseIntlApi()) try {
						return new Intl.PluralRules(code, { type: options.ordinal ? "ordinal" : "cardinal" });
					} catch (_unused) {
						return;
					}
					return this.rules[code] || this.rules[this.languageUtils.getLanguagePartFromCode(code)];
				}
			},
			{
				key: "needsPlural",
				value: function needsPlural(code) {
					var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
					var rule = this.getRule(code, options);
					if (this.shouldUseIntlApi()) return rule && rule.resolvedOptions().pluralCategories.length > 1;
					return rule && rule.numbers.length > 1;
				}
			},
			{
				key: "getPluralFormsOfKey",
				value: function getPluralFormsOfKey(code, key) {
					var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
					return this.getSuffixes(code, options).map(function(suffix) {
						return "".concat(key).concat(suffix);
					});
				}
			},
			{
				key: "getSuffixes",
				value: function getSuffixes(code) {
					var _this = this;
					var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
					var rule = this.getRule(code, options);
					if (!rule) return [];
					if (this.shouldUseIntlApi()) return rule.resolvedOptions().pluralCategories.sort(function(pluralCategory1, pluralCategory2) {
						return suffixesOrder[pluralCategory1] - suffixesOrder[pluralCategory2];
					}).map(function(pluralCategory) {
						return "".concat(_this.options.prepend).concat(pluralCategory);
					});
					return rule.numbers.map(function(number) {
						return _this.getSuffix(code, number, options);
					});
				}
			},
			{
				key: "getSuffix",
				value: function getSuffix(code, count) {
					var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
					var rule = this.getRule(code, options);
					if (rule) {
						if (this.shouldUseIntlApi()) return "".concat(this.options.prepend).concat(rule.select(count));
						return this.getSuffixRetroCompatible(rule, count);
					}
					this.logger.warn("no plural rule found for: ".concat(code));
					return "";
				}
			},
			{
				key: "getSuffixRetroCompatible",
				value: function getSuffixRetroCompatible(rule, count) {
					var _this2 = this;
					var idx = rule.noAbs ? rule.plurals(count) : rule.plurals(Math.abs(count));
					var suffix = rule.numbers[idx];
					if (this.options.simplifyPluralSuffix && rule.numbers.length === 2 && rule.numbers[0] === 1) {
						if (suffix === 2) suffix = "plural";
						else if (suffix === 1) suffix = "";
					}
					var returnSuffix = function returnSuffix() {
						return _this2.options.prepend && suffix.toString() ? _this2.options.prepend + suffix.toString() : suffix.toString();
					};
					if (this.options.compatibilityJSON === "v1") {
						if (suffix === 1) return "";
						if (typeof suffix === "number") return "_plural_".concat(suffix.toString());
						return returnSuffix();
					} else if (this.options.compatibilityJSON === "v2") return returnSuffix();
					else if (this.options.simplifyPluralSuffix && rule.numbers.length === 2 && rule.numbers[0] === 1) return returnSuffix();
					return this.options.prepend && idx.toString() ? this.options.prepend + idx.toString() : idx.toString();
				}
			},
			{
				key: "shouldUseIntlApi",
				value: function shouldUseIntlApi() {
					return !deprecatedJsonVersions.includes(this.options.compatibilityJSON);
				}
			}
		]);
		return PluralResolver;
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
		for (var i = 1; i < arguments.length; i++) {
			var source = null != arguments[i] ? arguments[i] : {};
			i % 2 ? ownKeys$3(Object(source), !0).forEach(function(key) {
				_defineProperty(target, key, source[key]);
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$3(Object(source)).forEach(function(key) {
				Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
			});
		}
		return target;
	}
	function deepFindWithDefaults(data, defaultData, key) {
		var keySeparator = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : ".";
		var ignoreJSONStructure = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : true;
		var path = getPathWithDefaults(data, defaultData, key);
		if (!path && ignoreJSONStructure && typeof key === "string") {
			path = deepFind(data, key, keySeparator);
			if (path === void 0) path = deepFind(defaultData, key, keySeparator);
		}
		return path;
	}
	var Interpolator = function() {
		function Interpolator() {
			var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
			_classCallCheck(this, Interpolator);
			this.logger = baseLogger.create("interpolator");
			this.options = options;
			this.format = options.interpolation && options.interpolation.format || function(value) {
				return value;
			};
			this.init(options);
		}
		_createClass(Interpolator, [
			{
				key: "init",
				value: function init() {
					var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
					if (!options.interpolation) options.interpolation = { escapeValue: true };
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
			},
			{
				key: "reset",
				value: function reset() {
					if (this.options) this.init(this.options);
				}
			},
			{
				key: "resetRegExp",
				value: function resetRegExp() {
					var regexpStr = "".concat(this.prefix, "(.+?)").concat(this.suffix);
					this.regexp = new RegExp(regexpStr, "g");
					var regexpUnescapeStr = "".concat(this.prefix).concat(this.unescapePrefix, "(.+?)").concat(this.unescapeSuffix).concat(this.suffix);
					this.regexpUnescape = new RegExp(regexpUnescapeStr, "g");
					var nestingRegexpStr = "".concat(this.nestingPrefix, "(.+?)").concat(this.nestingSuffix);
					this.nestingRegexp = new RegExp(nestingRegexpStr, "g");
				}
			},
			{
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
					var handleFormat = function handleFormat(key) {
						if (key.indexOf(_this.formatSeparator) < 0) {
							var path = deepFindWithDefaults(data, defaultData, key, _this.options.keySeparator, _this.options.ignoreJSONStructure);
							return _this.alwaysFormat ? _this.format(path, void 0, lng, _objectSpread$3(_objectSpread$3(_objectSpread$3({}, options), data), {}, { interpolationkey: key })) : path;
						}
						var p = key.split(_this.formatSeparator);
						var k = p.shift().trim();
						var f = p.join(_this.formatSeparator).trim();
						return _this.format(deepFindWithDefaults(data, defaultData, k, _this.options.keySeparator, _this.options.ignoreJSONStructure), f, lng, _objectSpread$3(_objectSpread$3(_objectSpread$3({}, options), data), {}, { interpolationkey: k }));
					};
					this.resetRegExp();
					var missingInterpolationHandler = options && options.missingInterpolationHandler || this.options.missingInterpolationHandler;
					var skipOnVariables = options && options.interpolation && options.interpolation.skipOnVariables !== void 0 ? options.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables;
					[{
						regex: this.regexpUnescape,
						safeValue: function safeValue(val) {
							return regexSafe(val);
						}
					}, {
						regex: this.regexp,
						safeValue: function safeValue(val) {
							return _this.escapeValue ? regexSafe(_this.escape(val)) : regexSafe(val);
						}
					}].forEach(function(todo) {
						replaces = 0;
						while (match = todo.regex.exec(str)) {
							var matchedVar = match[1].trim();
							value = handleFormat(matchedVar);
							if (value === void 0) {
								if (typeof missingInterpolationHandler === "function") {
									var temp = missingInterpolationHandler(str, match, options);
									value = typeof temp === "string" ? temp : "";
								} else if (options && Object.prototype.hasOwnProperty.call(options, matchedVar)) value = "";
								else if (skipOnVariables) {
									value = match[0];
									continue;
								} else {
									_this.logger.warn("missed to pass in variable ".concat(matchedVar, " for interpolating ").concat(str));
									value = "";
								}
							} else if (typeof value !== "string" && !_this.useRawValueToEscape) value = makeString(value);
							var safeValue = todo.safeValue(value);
							str = str.replace(match[0], safeValue);
							if (skipOnVariables) {
								todo.regex.lastIndex += value.length;
								todo.regex.lastIndex -= match[0].length;
							} else todo.regex.lastIndex = 0;
							replaces++;
							if (replaces >= _this.maxReplaces) break;
						}
					});
					return str;
				}
			},
			{
				key: "nest",
				value: function nest(str, fc) {
					var _this2 = this;
					var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
					var match;
					var value;
					var clonedOptions;
					function handleHasOptions(key, inheritedOptions) {
						var sep = this.nestingOptionsSeparator;
						if (key.indexOf(sep) < 0) return key;
						var c = key.split(new RegExp("".concat(sep, "[ ]*{")));
						var optionsString = "{".concat(c[1]);
						key = c[0];
						optionsString = this.interpolate(optionsString, clonedOptions);
						var matchedSingleQuotes = optionsString.match(/'/g);
						var matchedDoubleQuotes = optionsString.match(/"/g);
						if (matchedSingleQuotes && matchedSingleQuotes.length % 2 === 0 && !matchedDoubleQuotes || matchedDoubleQuotes.length % 2 !== 0) optionsString = optionsString.replace(/'/g, "\"");
						try {
							clonedOptions = JSON.parse(optionsString);
							if (inheritedOptions) clonedOptions = _objectSpread$3(_objectSpread$3({}, inheritedOptions), clonedOptions);
						} catch (e) {
							this.logger.warn("failed parsing options string in nesting for key ".concat(key), e);
							return "".concat(key).concat(sep).concat(optionsString);
						}
						delete clonedOptions.defaultValue;
						return key;
					}
					while (match = this.nestingRegexp.exec(str)) {
						var formatters = [];
						clonedOptions = _objectSpread$3({}, options);
						clonedOptions = clonedOptions.replace && typeof clonedOptions.replace !== "string" ? clonedOptions.replace : clonedOptions;
						clonedOptions.applyPostProcessor = false;
						delete clonedOptions.defaultValue;
						var doReduce = false;
						if (match[0].indexOf(this.formatSeparator) !== -1 && !/{.*}/.test(match[1])) {
							var r = match[1].split(this.formatSeparator).map(function(elem) {
								return elem.trim();
							});
							match[1] = r.shift();
							formatters = r;
							doReduce = true;
						}
						value = fc(handleHasOptions.call(this, match[1].trim(), clonedOptions), clonedOptions);
						if (value && match[0] === str && typeof value !== "string") return value;
						if (typeof value !== "string") value = makeString(value);
						if (!value) {
							this.logger.warn("missed to resolve ".concat(match[1], " for nesting ").concat(str));
							value = "";
						}
						if (doReduce) value = formatters.reduce(function(v, f) {
							return _this2.format(v, f, options.lng, _objectSpread$3(_objectSpread$3({}, options), {}, { interpolationkey: match[1].trim() }));
						}, value.trim());
						str = str.replace(match[0], value);
						this.regexp.lastIndex = 0;
					}
					return str;
				}
			}
		]);
		return Interpolator;
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
		for (var i = 1; i < arguments.length; i++) {
			var source = null != arguments[i] ? arguments[i] : {};
			i % 2 ? ownKeys$2(Object(source), !0).forEach(function(key) {
				_defineProperty(target, key, source[key]);
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$2(Object(source)).forEach(function(key) {
				Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
			});
		}
		return target;
	}
	function parseFormatStr(formatStr) {
		var formatName = formatStr.toLowerCase().trim();
		var formatOptions = {};
		if (formatStr.indexOf("(") > -1) {
			var p = formatStr.split("(");
			formatName = p[0].toLowerCase().trim();
			var optStr = p[1].substring(0, p[1].length - 1);
			if (formatName === "currency" && optStr.indexOf(":") < 0) {
				if (!formatOptions.currency) formatOptions.currency = optStr.trim();
			} else if (formatName === "relativetime" && optStr.indexOf(":") < 0) {
				if (!formatOptions.range) formatOptions.range = optStr.trim();
			} else optStr.split(";").forEach(function(opt) {
				if (!opt) return;
				var _opt$split2 = _toArray(opt.split(":")), key = _opt$split2[0];
				var val = _opt$split2.slice(1).join(":").trim().replace(/^'+|'+$/g, "");
				if (!formatOptions[key.trim()]) formatOptions[key.trim()] = val;
				if (val === "false") formatOptions[key.trim()] = false;
				if (val === "true") formatOptions[key.trim()] = true;
				if (!isNaN(val)) formatOptions[key.trim()] = parseInt(val, 10);
			});
		}
		return {
			formatName,
			formatOptions
		};
	}
	function createCachedFormatter(fn) {
		var cache = {};
		return function invokeFormatter(val, lng, options) {
			var key = lng + JSON.stringify(options);
			var formatter = cache[key];
			if (!formatter) {
				formatter = fn(lng, options);
				cache[key] = formatter;
			}
			return formatter(val);
		};
	}
	var Formatter = function() {
		function Formatter() {
			var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
			_classCallCheck(this, Formatter);
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
					var formatter = new Intl.NumberFormat(lng, _objectSpread$2(_objectSpread$2({}, opt), {}, { style: "currency" }));
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
		_createClass(Formatter, [
			{
				key: "init",
				value: function init(services) {
					var iOpts = (arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : { interpolation: {} }).interpolation;
					this.formatSeparator = iOpts.formatSeparator ? iOpts.formatSeparator : iOpts.formatSeparator || ",";
				}
			},
			{
				key: "add",
				value: function add(name, fc) {
					this.formats[name.toLowerCase().trim()] = fc;
				}
			},
			{
				key: "addCached",
				value: function addCached(name, fc) {
					this.formats[name.toLowerCase().trim()] = createCachedFormatter(fc);
				}
			},
			{
				key: "format",
				value: function format(value, _format, lng) {
					var _this = this;
					var options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
					return _format.split(this.formatSeparator).reduce(function(mem, f) {
						var _parseFormatStr = parseFormatStr(f), formatName = _parseFormatStr.formatName, formatOptions = _parseFormatStr.formatOptions;
						if (_this.formats[formatName]) {
							var formatted = mem;
							try {
								var valOptions = options && options.formatParams && options.formatParams[options.interpolationkey] || {};
								var l = valOptions.locale || valOptions.lng || options.locale || options.lng || lng;
								formatted = _this.formats[formatName](mem, l, _objectSpread$2(_objectSpread$2(_objectSpread$2({}, formatOptions), options), valOptions));
							} catch (error) {
								_this.logger.warn(error);
							}
							return formatted;
						} else _this.logger.warn("there was no format function for ".concat(formatName));
						return mem;
					}, value);
				}
			}
		]);
		return Formatter;
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
		for (var i = 1; i < arguments.length; i++) {
			var source = null != arguments[i] ? arguments[i] : {};
			i % 2 ? ownKeys$1(Object(source), !0).forEach(function(key) {
				_defineProperty(target, key, source[key]);
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$1(Object(source)).forEach(function(key) {
				Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
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
			} else result = Super.apply(this, arguments);
			return _possibleConstructorReturn(this, result);
		};
	}
	function _isNativeReflectConstruct$1() {
		if (typeof Reflect === "undefined" || !Reflect.construct) return false;
		if (Reflect.construct.sham) return false;
		if (typeof Proxy === "function") return true;
		try {
			Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
			return true;
		} catch (e) {
			return false;
		}
	}
	function removePending(q, name) {
		if (q.pending[name] !== void 0) {
			delete q.pending[name];
			q.pendingCount--;
		}
	}
	var Connector = function(_EventEmitter) {
		_inherits(Connector, _EventEmitter);
		var _super = _createSuper$1(Connector);
		function Connector(backend, store, services) {
			var _this;
			var options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
			_classCallCheck(this, Connector);
			_this = _super.call(this);
			if (isIE10) EventEmitter.call(_assertThisInitialized(_this));
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
			if (_this.backend && _this.backend.init) _this.backend.init(services, options.backend, options);
			return _this;
		}
		_createClass(Connector, [
			{
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
							if (!options.reload && _this2.store.hasResourceBundle(lng, ns)) _this2.state[name] = 2;
							else if (_this2.state[name] < 0);
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
					if (Object.keys(toLoad).length || Object.keys(pending).length) this.queue.push({
						pending,
						pendingCount: Object.keys(pending).length,
						loaded: {},
						errors: [],
						callback
					});
					return {
						toLoad: Object.keys(toLoad),
						pending: Object.keys(pending),
						toLoadLanguages: Object.keys(toLoadLanguages),
						toLoadNamespaces: Object.keys(toLoadNamespaces)
					};
				}
			},
			{
				key: "loaded",
				value: function loaded(name, err, data) {
					var s = name.split("|");
					var lng = s[0];
					var ns = s[1];
					if (err) this.emit("failedLoading", lng, ns, err);
					if (data) this.store.addResourceBundle(lng, ns, data);
					this.state[name] = err ? -1 : 2;
					var loaded = {};
					this.queue.forEach(function(q) {
						pushPath(q.loaded, [lng], ns);
						removePending(q, name);
						if (err) q.errors.push(err);
						if (q.pendingCount === 0 && !q.done) {
							Object.keys(q.loaded).forEach(function(l) {
								if (!loaded[l]) loaded[l] = {};
								var loadedKeys = q.loaded[l];
								if (loadedKeys.length) loadedKeys.forEach(function(n) {
									if (loaded[l][n] === void 0) loaded[l][n] = true;
								});
							});
							q.done = true;
							if (q.errors.length) q.callback(q.errors);
							else q.callback();
						}
					});
					this.emit("loaded", loaded);
					this.queue = this.queue.filter(function(q) {
						return !q.done;
					});
				}
			},
			{
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
					var resolver = function resolver(err, data) {
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
							var r = fc(lng, ns);
							if (r && typeof r.then === "function") r.then(function(data) {
								return resolver(null, data);
							})["catch"](resolver);
							else resolver(null, r);
						} catch (err) {
							resolver(err);
						}
						return;
					}
					return fc(lng, ns, resolver);
				}
			},
			{
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
			},
			{
				key: "load",
				value: function load(languages, namespaces, callback) {
					this.prepareLoading(languages, namespaces, {}, callback);
				}
			},
			{
				key: "reload",
				value: function reload(languages, namespaces, callback) {
					this.prepareLoading(languages, namespaces, { reload: true }, callback);
				}
			},
			{
				key: "loadOne",
				value: function loadOne(name) {
					var _this5 = this;
					var prefix = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
					var s = name.split("|");
					var lng = s[0];
					var ns = s[1];
					this.read(lng, ns, "read", void 0, void 0, function(err, data) {
						if (err) _this5.logger.warn("".concat(prefix, "loading namespace ").concat(ns, " for language ").concat(lng, " failed"), err);
						if (!err && data) _this5.logger.log("".concat(prefix, "loaded namespace ").concat(ns, " for language ").concat(lng), data);
						_this5.loaded(name, err, data);
					});
				}
			},
			{
				key: "saveMissing",
				value: function saveMissing(languages, namespace, key, fallbackValue, isUpdate) {
					var options = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : {};
					var clb = arguments.length > 6 && arguments[6] !== void 0 ? arguments[6] : function() {};
					if (this.services.utils && this.services.utils.hasLoadedNamespace && !this.services.utils.hasLoadedNamespace(namespace)) {
						this.logger.warn("did not save key \"".concat(key, "\" as the namespace \"").concat(namespace, "\" was not yet loaded"), "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
						return;
					}
					if (key === void 0 || key === null || key === "") return;
					if (this.backend && this.backend.create) {
						var opts = _objectSpread$1(_objectSpread$1({}, options), {}, { isUpdate });
						var fc = this.backend.create.bind(this.backend);
						if (fc.length < 6) try {
							var r;
							if (fc.length === 5) r = fc(languages, namespace, key, fallbackValue, opts);
							else r = fc(languages, namespace, key, fallbackValue);
							if (r && typeof r.then === "function") r.then(function(data) {
								return clb(null, data);
							})["catch"](clb);
							else clb(null, r);
						} catch (err) {
							clb(err);
						}
						else fc(languages, namespace, key, fallbackValue, clb, opts);
					}
					if (!languages || !languages[0]) return;
					this.store.addResource(languages[0], namespace, key, fallbackValue);
				}
			}
		]);
		return Connector;
	}(EventEmitter);
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
			overloadTranslationOptionHandler: function handle(args) {
				var ret = {};
				if (_typeof(args[1]) === "object") ret = args[1];
				if (typeof args[1] === "string") ret.defaultValue = args[1];
				if (typeof args[2] === "string") ret.tDescription = args[2];
				if (_typeof(args[2]) === "object" || _typeof(args[3]) === "object") {
					var options = args[3] || args[2];
					Object.keys(options).forEach(function(key) {
						ret[key] = options[key];
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
		if (options.supportedLngs && options.supportedLngs.indexOf("cimode") < 0) options.supportedLngs = options.supportedLngs.concat(["cimode"]);
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
		for (var i = 1; i < arguments.length; i++) {
			var source = null != arguments[i] ? arguments[i] : {};
			i % 2 ? ownKeys(Object(source), !0).forEach(function(key) {
				_defineProperty(target, key, source[key]);
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
				Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
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
			} else result = Super.apply(this, arguments);
			return _possibleConstructorReturn(this, result);
		};
	}
	function _isNativeReflectConstruct() {
		if (typeof Reflect === "undefined" || !Reflect.construct) return false;
		if (Reflect.construct.sham) return false;
		if (typeof Proxy === "function") return true;
		try {
			Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
			return true;
		} catch (e) {
			return false;
		}
	}
	function noop$1() {}
	function bindMemberFunctions(inst) {
		Object.getOwnPropertyNames(Object.getPrototypeOf(inst)).forEach(function(mem) {
			if (typeof inst[mem] === "function") inst[mem] = inst[mem].bind(inst);
		});
	}
	var I18n = function(_EventEmitter) {
		_inherits(I18n, _EventEmitter);
		var _super = _createSuper(I18n);
		function I18n() {
			var _this;
			var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
			var callback = arguments.length > 1 ? arguments[1] : void 0;
			_classCallCheck(this, I18n);
			_this = _super.call(this);
			if (isIE10) EventEmitter.call(_assertThisInitialized(_this));
			_this.options = transformOptions(options);
			_this.services = {};
			_this.logger = baseLogger;
			_this.modules = { external: [] };
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
		_createClass(I18n, [
			{
				key: "init",
				value: function init() {
					var _this2 = this;
					var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
					var callback = arguments.length > 1 ? arguments[1] : void 0;
					if (typeof options === "function") {
						callback = options;
						options = {};
					}
					if (!options.defaultNS && options.defaultNS !== false && options.ns) {
						if (typeof options.ns === "string") options.defaultNS = options.ns;
						else if (options.ns.indexOf("translation") < 0) options.defaultNS = options.ns[0];
					}
					var defOpts = get();
					this.options = _objectSpread(_objectSpread(_objectSpread({}, defOpts), this.options), transformOptions(options));
					if (this.options.compatibilityAPI !== "v1") this.options.interpolation = _objectSpread(_objectSpread({}, defOpts.interpolation), this.options.interpolation);
					if (options.keySeparator !== void 0) this.options.userDefinedKeySeparator = options.keySeparator;
					if (options.nsSeparator !== void 0) this.options.userDefinedNsSeparator = options.nsSeparator;
					function createClassOnDemand(ClassOrObject) {
						if (!ClassOrObject) return null;
						if (typeof ClassOrObject === "function") return new ClassOrObject();
						return ClassOrObject;
					}
					if (!this.options.isClone) {
						if (this.modules.logger) baseLogger.init(createClassOnDemand(this.modules.logger), this.options);
						else baseLogger.init(null, this.options);
						var formatter;
						if (this.modules.formatter) formatter = this.modules.formatter;
						else if (typeof Intl !== "undefined") formatter = Formatter;
						var lu = new LanguageUtil(this.options);
						this.store = new ResourceStore(this.options.resources, this.options);
						var s = this.services;
						s.logger = baseLogger;
						s.resourceStore = this.store;
						s.languageUtils = lu;
						s.pluralResolver = new PluralResolver(lu, {
							prepend: this.options.pluralSeparator,
							compatibilityJSON: this.options.compatibilityJSON,
							simplifyPluralSuffix: this.options.simplifyPluralSuffix
						});
						if (formatter && (!this.options.interpolation.format || this.options.interpolation.format === defOpts.interpolation.format)) {
							s.formatter = createClassOnDemand(formatter);
							s.formatter.init(s, this.options);
							this.options.interpolation.format = s.formatter.format.bind(s.formatter);
						}
						s.interpolator = new Interpolator(this.options);
						s.utils = { hasLoadedNamespace: this.hasLoadedNamespace.bind(this) };
						s.backendConnector = new Connector(createClassOnDemand(this.modules.backend), s.resourceStore, s, this.options);
						s.backendConnector.on("*", function(event) {
							for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) args[_key - 1] = arguments[_key];
							_this2.emit.apply(_this2, [event].concat(args));
						});
						if (this.modules.languageDetector) {
							s.languageDetector = createClassOnDemand(this.modules.languageDetector);
							if (s.languageDetector.init) s.languageDetector.init(s, this.options.detection, this.options);
						}
						if (this.modules.i18nFormat) {
							s.i18nFormat = createClassOnDemand(this.modules.i18nFormat);
							if (s.i18nFormat.init) s.i18nFormat.init(this);
						}
						this.translator = new Translator(this.services, this.options);
						this.translator.on("*", function(event) {
							for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) args[_key2 - 1] = arguments[_key2];
							_this2.emit.apply(_this2, [event].concat(args));
						});
						this.modules.external.forEach(function(m) {
							if (m.init) m.init(_this2);
						});
					}
					this.format = this.options.interpolation.format;
					if (!callback) callback = noop$1;
					if (this.options.fallbackLng && !this.services.languageDetector && !this.options.lng) {
						var codes = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
						if (codes.length > 0 && codes[0] !== "dev") this.options.lng = codes[0];
					}
					if (!this.services.languageDetector && !this.options.lng) this.logger.warn("init: no languageDetector is used and no lng is defined");
					[
						"getResource",
						"hasResourceBundle",
						"getResourceBundle",
						"getDataByLanguage"
					].forEach(function(fcName) {
						_this2[fcName] = function() {
							var _this2$store;
							return (_this2$store = _this2.store)[fcName].apply(_this2$store, arguments);
						};
					});
					[
						"addResource",
						"addResources",
						"addResourceBundle",
						"removeResourceBundle"
					].forEach(function(fcName) {
						_this2[fcName] = function() {
							var _this2$store2;
							(_this2$store2 = _this2.store)[fcName].apply(_this2$store2, arguments);
							return _this2;
						};
					});
					var deferred = defer();
					var load = function load() {
						var finish = function finish(err, t) {
							if (_this2.isInitialized && !_this2.initializedStoreOnce) _this2.logger.warn("init: i18next is already initialized. You should call init just once!");
							_this2.isInitialized = true;
							if (!_this2.options.isClone) _this2.logger.log("initialized", _this2.options);
							_this2.emit("initialized", _this2.options);
							deferred.resolve(t);
							callback(err, t);
						};
						if (_this2.languages && _this2.options.compatibilityAPI !== "v1" && !_this2.isInitialized) return finish(null, _this2.t.bind(_this2));
						_this2.changeLanguage(_this2.options.lng, finish);
					};
					if (this.options.resources || !this.options.initImmediate) load();
					else setTimeout(load, 0);
					return deferred;
				}
			},
			{
				key: "loadResources",
				value: function loadResources(language) {
					var _this3 = this;
					var usedCallback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : noop$1;
					var usedLng = typeof language === "string" ? language : this.language;
					if (typeof language === "function") usedCallback = language;
					if (!this.options.resources || this.options.partialBundledLanguages) {
						if (usedLng && usedLng.toLowerCase() === "cimode") return usedCallback();
						var toLoad = [];
						var append = function append(lng) {
							if (!lng) return;
							_this3.services.languageUtils.toResolveHierarchy(lng).forEach(function(l) {
								if (toLoad.indexOf(l) < 0) toLoad.push(l);
							});
						};
						if (!usedLng) this.services.languageUtils.getFallbackCodes(this.options.fallbackLng).forEach(function(l) {
							return append(l);
						});
						else append(usedLng);
						if (this.options.preload) this.options.preload.forEach(function(l) {
							return append(l);
						});
						this.services.backendConnector.load(toLoad, this.options.ns, function(e) {
							if (!e && !_this3.resolvedLanguage && _this3.language) _this3.setResolvedLanguage(_this3.language);
							usedCallback(e);
						});
					} else usedCallback(null);
				}
			},
			{
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
			},
			{
				key: "use",
				value: function use(module) {
					if (!module) throw new Error("You are passing an undefined module! Please check the object you are passing to i18next.use()");
					if (!module.type) throw new Error("You are passing a wrong module! Please check the object you are passing to i18next.use()");
					if (module.type === "backend") this.modules.backend = module;
					if (module.type === "logger" || module.log && module.warn && module.error) this.modules.logger = module;
					if (module.type === "languageDetector") this.modules.languageDetector = module;
					if (module.type === "i18nFormat") this.modules.i18nFormat = module;
					if (module.type === "postProcessor") postProcessor.addPostProcessor(module);
					if (module.type === "formatter") this.modules.formatter = module;
					if (module.type === "3rdParty") this.modules.external.push(module);
					return this;
				}
			},
			{
				key: "setResolvedLanguage",
				value: function setResolvedLanguage(l) {
					if (!l || !this.languages) return;
					if (["cimode", "dev"].indexOf(l) > -1) return;
					for (var li = 0; li < this.languages.length; li++) {
						var lngInLngs = this.languages[li];
						if (["cimode", "dev"].indexOf(lngInLngs) > -1) continue;
						if (this.store.hasLanguageSomeTranslations(lngInLngs)) {
							this.resolvedLanguage = lngInLngs;
							break;
						}
					}
				}
			},
			{
				key: "changeLanguage",
				value: function changeLanguage(lng, callback) {
					var _this4 = this;
					this.isLanguageChangingTo = lng;
					var deferred = defer();
					this.emit("languageChanging", lng);
					var setLngProps = function setLngProps(l) {
						_this4.language = l;
						_this4.languages = _this4.services.languageUtils.toResolveHierarchy(l);
						_this4.resolvedLanguage = void 0;
						_this4.setResolvedLanguage(l);
					};
					var done = function done(err, l) {
						if (l) {
							setLngProps(l);
							_this4.translator.changeLanguage(l);
							_this4.isLanguageChangingTo = void 0;
							_this4.emit("languageChanged", l);
							_this4.logger.log("languageChanged", l);
						} else _this4.isLanguageChangingTo = void 0;
						deferred.resolve(function() {
							return _this4.t.apply(_this4, arguments);
						});
						if (callback) callback(err, function() {
							return _this4.t.apply(_this4, arguments);
						});
					};
					var setLng = function setLng(lngs) {
						if (!lng && !lngs && _this4.services.languageDetector) lngs = [];
						var l = typeof lngs === "string" ? lngs : _this4.services.languageUtils.getBestMatchFromCodes(lngs);
						if (l) {
							if (!_this4.language) setLngProps(l);
							if (!_this4.translator.language) _this4.translator.changeLanguage(l);
							if (_this4.services.languageDetector && _this4.services.languageDetector.cacheUserLanguage) _this4.services.languageDetector.cacheUserLanguage(l);
						}
						_this4.loadResources(l, function(err) {
							done(err, l);
						});
					};
					if (!lng && this.services.languageDetector && !this.services.languageDetector.async) setLng(this.services.languageDetector.detect());
					else if (!lng && this.services.languageDetector && this.services.languageDetector.async) {
						if (this.services.languageDetector.detect.length === 0) this.services.languageDetector.detect().then(setLng);
						else this.services.languageDetector.detect(setLng);
					} else setLng(lng);
					return deferred;
				}
			},
			{
				key: "getFixedT",
				value: function getFixedT(lng, ns, keyPrefix) {
					var _this5 = this;
					var fixedT = function fixedT(key, opts) {
						var options;
						if (_typeof(opts) !== "object") {
							for (var _len3 = arguments.length, rest = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) rest[_key3 - 2] = arguments[_key3];
							options = _this5.options.overloadTranslationOptionHandler([key, opts].concat(rest));
						} else options = _objectSpread({}, opts);
						options.lng = options.lng || fixedT.lng;
						options.lngs = options.lngs || fixedT.lngs;
						options.ns = options.ns || fixedT.ns;
						options.keyPrefix = options.keyPrefix || keyPrefix || fixedT.keyPrefix;
						var keySeparator = _this5.options.keySeparator || ".";
						var resultKey;
						if (options.keyPrefix && Array.isArray(key)) resultKey = key.map(function(k) {
							return "".concat(options.keyPrefix).concat(keySeparator).concat(k);
						});
						else resultKey = options.keyPrefix ? "".concat(options.keyPrefix).concat(keySeparator).concat(key) : key;
						return _this5.t(resultKey, options);
					};
					if (typeof lng === "string") fixedT.lng = lng;
					else fixedT.lngs = lng;
					fixedT.ns = ns;
					fixedT.keyPrefix = keyPrefix;
					return fixedT;
				}
			},
			{
				key: "t",
				value: function t() {
					var _this$translator;
					return this.translator && (_this$translator = this.translator).translate.apply(_this$translator, arguments);
				}
			},
			{
				key: "exists",
				value: function exists() {
					var _this$translator2;
					return this.translator && (_this$translator2 = this.translator).exists.apply(_this$translator2, arguments);
				}
			},
			{
				key: "setDefaultNamespace",
				value: function setDefaultNamespace(ns) {
					this.options.defaultNS = ns;
				}
			},
			{
				key: "hasLoadedNamespace",
				value: function hasLoadedNamespace(ns) {
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
					var loadNotPending = function loadNotPending(l, n) {
						var loadState = _this6.services.backendConnector.state["".concat(l, "|").concat(n)];
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
			},
			{
				key: "loadNamespaces",
				value: function loadNamespaces(ns, callback) {
					var _this7 = this;
					var deferred = defer();
					if (!this.options.ns) {
						if (callback) callback();
						return Promise.resolve();
					}
					if (typeof ns === "string") ns = [ns];
					ns.forEach(function(n) {
						if (_this7.options.ns.indexOf(n) < 0) _this7.options.ns.push(n);
					});
					this.loadResources(function(err) {
						deferred.resolve();
						if (callback) callback(err);
					});
					return deferred;
				}
			},
			{
				key: "loadLanguages",
				value: function loadLanguages(lngs, callback) {
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
			},
			{
				key: "dir",
				value: function dir(lng) {
					if (!lng) lng = this.resolvedLanguage || (this.languages && this.languages.length > 0 ? this.languages[0] : this.language);
					if (!lng) return "rtl";
					var rtlLngs = [
						"ar",
						"shu",
						"sqr",
						"ssh",
						"xaa",
						"yhd",
						"yud",
						"aao",
						"abh",
						"abv",
						"acm",
						"acq",
						"acw",
						"acx",
						"acy",
						"adf",
						"ads",
						"aeb",
						"aec",
						"afb",
						"ajp",
						"apc",
						"apd",
						"arb",
						"arq",
						"ars",
						"ary",
						"arz",
						"auz",
						"avl",
						"ayh",
						"ayl",
						"ayn",
						"ayp",
						"bbz",
						"pga",
						"he",
						"iw",
						"ps",
						"pbt",
						"pbu",
						"pst",
						"prp",
						"prd",
						"ug",
						"ur",
						"ydd",
						"yds",
						"yih",
						"ji",
						"yi",
						"hbo",
						"men",
						"xmn",
						"fa",
						"jpr",
						"peo",
						"pes",
						"prs",
						"dv",
						"sam",
						"ckb"
					];
					var languageUtils = this.services && this.services.languageUtils || new LanguageUtil(get());
					return rtlLngs.indexOf(languageUtils.getLanguagePartFromCode(lng)) > -1 || lng.toLowerCase().indexOf("-arab") > 1 ? "rtl" : "ltr";
				}
			},
			{
				key: "cloneInstance",
				value: function cloneInstance() {
					var _this8 = this;
					var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
					var callback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : noop$1;
					var mergedOptions = _objectSpread(_objectSpread(_objectSpread({}, this.options), options), { isClone: true });
					var clone = new I18n(mergedOptions);
					if (options.debug !== void 0 || options.prefix !== void 0) clone.logger = clone.logger.clone(options);
					[
						"store",
						"services",
						"language"
					].forEach(function(m) {
						clone[m] = _this8[m];
					});
					clone.services = _objectSpread({}, this.services);
					clone.services.utils = { hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone) };
					clone.translator = new Translator(clone.services, clone.options);
					clone.translator.on("*", function(event) {
						for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) args[_key4 - 1] = arguments[_key4];
						clone.emit.apply(clone, [event].concat(args));
					});
					clone.init(mergedOptions, callback);
					clone.translator.options = clone.options;
					clone.translator.backendConnector.services.utils = { hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone) };
					return clone;
				}
			},
			{
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
			}
		]);
		return I18n;
	}(EventEmitter);
	_defineProperty(I18n, "createInstance", function() {
		return new I18n(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, arguments.length > 1 ? arguments[1] : void 0);
	});
	var instance = I18n.createInstance();
	instance.createInstance = I18n.createInstance;
	instance.createInstance;
	instance.dir;
	instance.init;
	instance.loadResources;
	instance.reloadResources;
	instance.use;
	instance.changeLanguage;
	instance.getFixedT;
	instance.t;
	instance.exists;
	instance.setDefaultNamespace;
	instance.hasLoadedNamespace;
	instance.loadNamespaces;
	instance.loadLanguages;
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
		"Load more conversations remaining": "Load {{n}} more · {{remaining}} left"
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
		"Load more conversations remaining": "Cargar {{n}} más · quedan {{remaining}}"
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
		"Load more conversations remaining": "Charger {{n}} de plus · {{remaining}} restantes"
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
		"Load more conversations remaining": "Muat {{n}} lagi · tersisa {{remaining}}"
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
		"Load more conversations remaining": "さらに {{n}} 件読み込む · 残り {{remaining}} 件"
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
		"Load more conversations remaining": "Загрузить ещё {{n}} · осталось {{remaining}}"
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
		"Load more conversations remaining": "{{n}} tane daha yükle · {{remaining}} kaldı"
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
		"Load more conversations remaining": "再加载 {{n}} 条 · 剩余 {{remaining}} 条"
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
		"Load more conversations remaining": "再載入 {{n}} 筆 · 剩餘 {{remaining}} 筆"
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
	instance.use(initReactI18next).init({
		fallbackLng: EN_US.code,
		lng: getDefaultLanguage(),
		debug: false,
		resources,
		interpolation: { escapeValue: false }
	});
	instance.on("languageChanged", (lng) => {
		ScriptStorage.set(KEY_LANGUAGE, lng);
	});
	var i18n_default = instance;
	var template_default = "<!DOCTYPE html>\n<html lang=\"{{lang}}\" data-theme=\"{{theme}}\">\n<head>\n    <meta charset=\"UTF-8\" />\n    <link rel=\"icon\" href=\"https://chat.openai.com/favicon.ico\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>{{title}}</title>\n    <link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/github-dark.min.css\">\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js\"><\/script>\n    <script>\n        hljs.highlightAll()\n    <\/script>\n    <link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.3/katex.min.css\">\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.3/katex.min.js\"><\/script>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.3/contrib/auto-render.min.js\"><\/script>\n    <script>\n        document.addEventListener(\"DOMContentLoaded\", function() {\n            renderMathInElement(document.body, {\n                delimiters: [\n                    { left: \"$$\", right: \"$$\", display: true },\n                    { left: \"$\", right: \"$\", display: false },\n                    { left: \"\\\\[\", right: \"\\\\]\", display: true },\n                    { left: \"\\\\(\", right: \"\\\\)\", display: false }\n                ],\n                throwOnError: false,\n                ignoredClasses: [\"no-katex\"],\n                preProcess: function(math) {\n                    return `\\\\displaystyle \\\\Large ${math}`;\n                }\n            });\n            document.querySelectorAll('.katex').forEach(function(el) {\n                const parent = el.parentNode;\n                const grandparent = parent.parentNode;\n                if (grandparent.tagName === 'P' && isOnlyContent(grandparent, parent)) {\n                    el.style.width = '100%';\n                    el.style.display = 'block';\n                    el.style.textAlign = 'center';\n                    parent.style.textAlign = 'center';\n                } else {\n                    el.style.display = 'inline-block';\n                    el.style.width = 'fit-content';\n                }\n            });\n            function isOnlyContent(parent, element) {\n                let onlyKaTeX = true;\n                parent.childNodes.forEach(function(child) {\n                    console.log(child.textContent);\n                    if (child !== element) {\n                        if (child.nodeType === Node.TEXT_NODE) {\n                            if (child.textContent.trim().length > 0) {\n                                onlyKaTeX = false;\n                            }\n                        } else if (child.nodeType === Node.ELEMENT_NODE) {\n                            onlyKaTeX = false;\n                        }\n                    }\n                });\n                return onlyKaTeX;\n            }\n        });\n    <\/script>\n\n    <style>\n        :root {\n            --page-text: #0d0d0d;\n            --page-bg: #fff;\n            --td-borders: #374151;\n            --th-borders: #4b5563;\n            --tw-prose-code: var(--page-text);\n            --tw-prose-counters: #9b9b9b;\n            --tw-prose-headings: var(--page-text);\n            --tw-prose-hr: rgba(0,0,0,.25);\n            --tw-prose-links: var(--page-text);\n            --tw-prose-quotes: var(--page-text);\n            --meta-title: #616c77;\n        }\n\n        [data-theme=\"dark\"] {\n            --page-text: #ececec;\n            --page-bg: #212121;\n            --tw-prose-code: var(--page-text);\n            --tw-prose-counters: #9b9b9b;\n            --tw-prose-headings: var(--page-text);\n            --tw-prose-hr: hsla(0,0%,100%,.25);\n            --tw-prose-links: var(--page-text);\n            --tw-prose-quotes: var(--page-text);\n            --meta-title: #959faa;\n        }\n\n        * {\n            box-sizing: border-box;\n            font-size: 16px;\n        }\n\n        ::-webkit-scrollbar {\n            height: 1rem;\n            width: .5rem\n        }\n\n        ::-webkit-scrollbar:horizontal {\n            height: .5rem;\n            width: 1rem\n        }\n\n        ::-webkit-scrollbar-track {\n            background-color: transparent;\n            border-radius: 9999px\n        }\n\n        ::-webkit-scrollbar-thumb {\n            --tw-border-opacity: 1;\n            background-color: rgba(217,217,227,.8);\n            border-color: rgba(255,255,255,var(--tw-border-opacity));\n            border-radius: 9999px;\n            border-width: 1px\n        }\n\n        ::-webkit-scrollbar-thumb:hover {\n            --tw-bg-opacity: 1;\n            background-color: rgba(236,236,241,var(--tw-bg-opacity))\n        }\n\n        .dark ::-webkit-scrollbar-thumb {\n            --tw-bg-opacity: 1;\n            background-color: rgba(86,88,105,var(--tw-bg-opacity))\n        }\n\n        .dark ::-webkit-scrollbar-thumb:hover {\n            --tw-bg-opacity: 1;\n            background-color: rgba(172,172,190,var(--tw-bg-opacity))\n        }\n\n        @media (min-width: 768px) {\n            .scrollbar-trigger ::-webkit-scrollbar-thumb {\n                visibility:hidden\n            }\n\n            .scrollbar-trigger:hover ::-webkit-scrollbar-thumb {\n                visibility: visible\n            }\n        }\n\n        body {\n            font-family: Söhne,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,Helvetica Neue,Arial,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;\n            font-size: 14px;\n            line-height: 1.5;\n            color: var(--page-text);\n            background-color: var(--page-bg);\n            margin: 0;\n            padding: 0;\n        }\n\n        [data-theme=\"light\"] .sun {\n            display: none;\n        }\n\n        [data-theme=\"dark\"] .moon {\n            display: none;\n        }\n\n        .toggle {\n            display: inline-flex;\n            justify-content: center;\n            align-items: center;\n            width: 32px;\n            height: 32px;\n            border-radius: 4px;\n            background-color: #fff;\n            border: 1px solid #e2e8f0;\n        }\n\n        [data-width=\"narrow\"] .width-toggle .expand {\n            display: block;\n        }\n\n        [data-width=\"wide\"] .width-toggle .narrow {\n            display: block;\n        }\n\n        .width-toggle {\n            display: inline-flex;\n            justify-content: center;\n            align-items: center;\n            width: 32px;\n            height: 32px;\n            border-radius: 4px;\n            background-color: #fff;\n            border: 1px solid #e2e8f0;\n            margin-left: 8px;\n            cursor: pointer;\n        }\n\n        .width-toggle svg {\n            display: none;\n        }\n\n        .metadata_container {\n            display: flex;\n            flex-direction: column;\n            margin-top: 8px;\n            padding-left: 1rem;\n        }\n\n        .metadata_item {\n            display: flex;\n            flex-direction: row;\n            align-items: center;\n            border-radius: 16px;\n            padding: 4px 0.5rem;\n        }\n\n        .metadata_item:hover {\n            background-color: rgba(0,0,0,.1);\n        }\n\n        .metadata_item > div:first-child {\n            flex: 0 1 100px;\n            color: var(--meta-title);\n        }\n\n        .metadata_item > div:last-child {\n            flex: 1;\n        }\n\n        a {\n            color: var(--tw-prose-links);\n            font-size: 0.8rem;\n            text-decoration-line: underline;\n            text-underline-offset: 2px;\n        }\n\n        .conversation-content > p:first-child,\n        ol:first-child {\n            margin-top: 0;\n        }\n\n        p>code, li>code {\n            color: var(--tw-prose-code);\n            font-weight: 600;\n            font-size: .875em;\n        }\n\n        p>code::before,\n        p>code::after,\n        li>code::before,\n        li>code::after {\n            content: \"`\";\n        }\n\n        hr {\n            width: 100%;\n            height: 0;\n            border: 1px solid var(--tw-prose-hr);\n            margin-bottom: 1em;\n            margin-top: 1em;\n        }\n\n        pre {\n            color: #ffffff;\n            background-color: #000000;\n            overflow-x: auto;\n            margin: 0 0 1rem 0;\n            border-radius: 0.375rem;\n        }\n\n        pre>code {\n            font-family: Söhne Mono, Monaco, Andale Mono, Ubuntu Mono, monospace !important;\n            font-weight: 400;\n            font-size: .875em;\n            line-height: 1.7142857;\n        }\n\n        h1, h2, h3, h4, h5, h6 {\n            color: var(--tw-prose-headings);\n            margin: 0;\n        }\n\n        h1 {\n            font-size: 2.25em;\n            font-weight: 600;\n            line-height: 1.1111111;\n            margin-bottom: 0.8888889em;\n            margin-top: 0;\n        }\n\n        h2 {\n            font-size: 1.5em;\n            font-weight: 700;\n            line-height: 1.3333333;\n            margin-bottom: 1em;\n            margin-top: 2em;\n        }\n\n        h3 {\n            font-size: 1.25em;\n            font-weight: 600;\n            line-height: 1.6;\n            margin-bottom: .6em;\n            margin-top: 1.6em;\n        }\n\n        h4 {\n            font-weight: 400;\n            line-height: 1.5;\n            margin-bottom: .5em;\n            margin-top: 1.5em\n        }\n\n        h3,h4 {\n            margin-bottom: .5rem;\n            margin-top: 1rem;\n        }\n\n        h5 {\n            font-weight: 600;\n        }\n\n        blockquote {\n            border-left: 2px solid rgba(142,142,160,1);\n            color: var(--tw-prose-quotes);\n            font-style: italic;\n            font-style: normal;\n            font-weight: 500;\n            line-height: 1rem;\n            margin: 1.6em 0;\n            padding-left: 1em;\n            quotes: \"\\201C\"\"\\201D\"\"\\2018\"\"\\2019\";\n        }\n\n        blockquote p:first-of-type:before {\n            content: open-quote;\n        }\n\n        blockquote p:last-of-type:after {\n            content: close-quote;\n        }\n\n        ol, ul {\n            padding-left: 1.1rem;\n        }\n\n        ::marker {\n            color: var(--tw-prose-counters);\n            font-weight: 400;\n        }\n\n        table {\n            width: 100%;\n            border-collapse: separate;\n            border-spacing: 0 0;\n            table-layout: auto;\n            text-align: left;\n            font-size: .875em;\n            line-height: 1.7142857;\n        }\n\n        table * {\n            box-sizing: border-box;\n            border-width: 0;\n            border-style: solid;\n            border-color: #d9d9e3;\n        }\n\n        table thead {\n            border-bottom-color: var(--th-borders);\n            border-bottom-width: 1px;\n        }\n\n        table th {\n            background-color: rgba(236,236,241,.2);\n            border-bottom-width: 1px;\n            border-left-width: 1px;\n            border-top-width: 1px;\n            padding: 0.25rem 0.75rem;\n        }\n\n        table th:first-child {\n            border-top-left-radius: 0.375rem;\n        }\n\n        table th:last-child {\n            border-right-width: 1px;\n            border-top-right-radius: 0.375rem;\n        }\n\n        table tbody tr {\n            border-bottom-color: var(--td-borders);\n            border-bottom-width: 1px;\n        }\n\n        table tbody tr:last-child {\n            border-bottom-width: 0;\n        }\n\n        table tbody tr:last-child td:first-child {\n            border-bottom-left-radius: 0.375rem;\n        }\n\n        table tbody tr:last-child td:last-child {\n            border-bottom-right-radius: 0.375rem;\n        }\n\n        table td {\n            border-bottom-width: 1px;\n            border-left-width: 1px;\n            padding: 0.25rem 0.75rem;\n        }\n\n        table td:last-child {\n            border-right-width: 1px;\n        }\n\n        [type=checkbox], [type=radio] {\n            accent-color: #2563eb;\n        }\n\n        .conversation {\n            margin: 0 auto;\n            padding: 1rem;\n            max-width: 64rem;\n        }\n\n        [data-width=\"narrow\"] .conversation {\n            max-width: 64rem;\n        }\n\n        [data-width=\"wide\"] .conversation {\n            max-width: 90%;\n        }\n\n        @media (min-width: 1280px) {\n            .conversation {\n                max-width: 48rem;\n            }\n        }\n\n        @media (min-width: 1024px) {\n            .conversation {\n                max-width: 40rem;\n            }\n        }\n\n        @media (min-width: 768px) {\n            .conversation {\n                max-width: 48rem;\n            }\n        }\n\n        .conversation-header {\n            margin-bottom: 1rem;\n        }\n\n        .conversation-header h1 {\n            margin: 0;\n        }\n\n        .conversation-header h1 a {\n            font-size: 1.5rem;\n        }\n\n        .conversation-header .conversation-export {\n            margin-top: 0.5rem;\n            font-size: 0.8rem;\n        }\n\n        .conversation-header p {\n            margin-top: 0.5rem;\n            font-size: 0.8rem;\n        }\n\n        .conversation-item {\n            display: flex;\n            position: relative;\n            padding: 1rem;\n            border-left: 1px solid rgba(0,0,0,.1);\n            border-right: 1px solid rgba(0,0,0,.1);\n            border-bottom: 1px solid rgba(0,0,0,.1);\n        }\n\n        .conversation-item:first-of-type {\n            border-top: 1px solid rgba(0,0,0,.1);\n        }\n\n        .author {\n            display: flex;\n            flex: 0 0 30px;\n            justify-content: center;\n            align-items: center;\n            width: 30px;\n            height: 30px;\n            border-radius: 0.125rem;\n            margin-right: 1rem;\n            overflow: hidden;\n        }\n\n        .author svg {\n            color: #fff;\n            width: 22px;\n            height: 22px;\n        }\n\n        .author img {\n            content: url({{avatar}});\n            width: 100%;\n            height: 100%;\n        }\n\n        .author.assistant {\n            background-color: rgb(16, 163, 127);\n        }\n\n        .conversation-content-wrapper {\n            display: flex;\n            position: relative;\n            overflow: hidden;\n            flex: 1 1 auto;\n            flex-direction: column;\n        }\n\n        .thinking {\n            font-size: 0.875rem;\n            line-height: 1.5;\n            margin-bottom: 0.75rem;\n            border: 1px solid #d1d5db;\n            border-radius: 0.5rem;\n            padding: 0.5rem 0.75rem;\n        }\n\n        .thinking summary {\n            cursor: pointer;\n            font-weight: 500;\n            color: #6b7280;\n        }\n\n        .thinking p {\n            margin: 0.5rem 0;\n            color: #6b7280;\n        }\n\n        .dark .thinking {\n            border-color: #4b5563;\n        }\n\n        .dark .thinking summary,\n        .dark .thinking p {\n            color: #9ca3af;\n        }\n\n        .conversation-content {\n            font-size: 1rem;\n            line-height: 1.5;\n        }\n\n        .conversation-content p {\n            white-space: pre-wrap;\n            line-height: 28px;\n        }\n\n        .conversation-content img, .conversation-content video {\n            display: block;\n            max-width: 100%;\n            height: auto;\n            margin-bottom: 2em;\n            margin-top: 2em;\n        }\n\n        .time {\n            position: absolute;\n            right: 8px;\n            bottom: 0;\n            font-size: 0.8rem;\n            color: #acacbe\n        }\n\n    </style>\n</head>\n\n<body>\n    <svg aria-hidden=\"true\" style=\"position: absolute; width: 0; height: 0; overflow: hidden;\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n        <symbol id=\"chatgpt\" viewBox=\"0 0 41 41\">\n            <path d=\"M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500197C16.1708 0.495044 14.0893 1.16803 12.3614 2.42214C10.6335 3.67624 9.34853 5.44666 8.6917 7.47815C7.30085 7.76286 5.98686 8.3414 4.8377 9.17505C3.68854 10.0087 2.73073 11.0782 2.02839 12.312C0.956464 14.1591 0.498905 16.2988 0.721698 18.4228C0.944492 20.5467 1.83612 22.5449 3.268 24.1293C2.81966 25.4759 2.66413 26.9026 2.81182 28.3141C2.95951 29.7256 3.40701 31.0892 4.12437 32.3138C5.18791 34.1659 6.8123 35.6322 8.76321 36.5013C10.7141 37.3704 12.8907 37.5973 14.9789 37.1492C15.9208 38.2107 17.0786 39.0587 18.3747 39.6366C19.6709 40.2144 21.0755 40.5087 22.4946 40.4998C24.6307 40.5054 26.7133 39.8321 28.4418 38.5772C30.1704 37.3223 31.4556 35.5506 32.1119 33.5179C33.5027 33.2332 34.8167 32.6547 35.9659 31.821C37.115 30.9874 38.0728 29.9178 38.7752 28.684C39.8458 26.8371 40.3023 24.6979 40.0789 22.5748C39.8556 20.4517 38.9639 18.4544 37.5324 16.8707ZM22.4978 37.8849C20.7443 37.8874 19.0459 37.2733 17.6994 36.1501C17.7601 36.117 17.8666 36.0586 17.936 36.0161L25.9004 31.4156C26.1003 31.3019 26.2663 31.137 26.3813 30.9378C26.4964 30.7386 26.5563 30.5124 26.5549 30.2825V19.0542L29.9213 20.998C29.9389 21.0068 29.9541 21.0198 29.9656 21.0359C29.977 21.052 29.9842 21.0707 29.9867 21.0902V30.3889C29.9842 32.375 29.1946 34.2791 27.7909 35.6841C26.3872 37.0892 24.4838 37.8806 22.4978 37.8849ZM6.39227 31.0064C5.51397 29.4888 5.19742 27.7107 5.49804 25.9832C5.55718 26.0187 5.66048 26.0818 5.73461 26.1244L13.699 30.7248C13.8975 30.8408 14.1233 30.902 14.3532 30.902C14.583 30.902 14.8088 30.8408 15.0073 30.7248L24.731 25.1103V28.9979C24.7321 29.0177 24.7283 29.0376 24.7199 29.0556C24.7115 29.0736 24.6988 29.0893 24.6829 29.1012L16.6317 33.7497C14.9096 34.7416 12.8643 35.0097 10.9447 34.4954C9.02506 33.9811 7.38785 32.7263 6.39227 31.0064ZM4.29707 13.6194C5.17156 12.0998 6.55279 10.9364 8.19885 10.3327C8.19885 10.4013 8.19491 10.5228 8.19491 10.6071V19.808C8.19351 20.0378 8.25334 20.2638 8.36823 20.4629C8.48312 20.6619 8.64893 20.8267 8.84863 20.9404L18.5723 26.5542L15.206 28.4979C15.1894 28.5089 15.1703 28.5155 15.1505 28.5173C15.1307 28.5191 15.1107 28.516 15.0924 28.5082L7.04046 23.8557C5.32135 22.8601 4.06716 21.2235 3.55289 19.3046C3.03862 17.3858 3.30624 15.3413 4.29707 13.6194ZM31.955 20.0556L22.2312 14.4411L25.5976 12.4981C25.6142 12.4872 25.6333 12.4805 25.6531 12.4787C25.6729 12.4769 25.6928 12.4801 25.7111 12.4879L33.7631 17.1364C34.9967 17.849 36.0017 18.8982 36.6606 20.1613C37.3194 21.4244 37.6047 22.849 37.4832 24.2684C37.3617 25.6878 36.8382 27.0432 35.9743 28.1759C35.1103 29.3086 33.9415 30.1717 32.6047 30.6641C32.6047 30.5947 32.6047 30.4733 32.6047 30.3889V21.188C32.6066 20.9586 32.5474 20.7328 32.4332 20.5338C32.319 20.3348 32.154 20.1698 31.955 20.0556ZM35.3055 15.0128C35.2464 14.9765 35.1431 14.9142 35.069 14.8717L27.1045 10.2712C26.906 10.1554 26.6803 10.0943 26.4504 10.0943C26.2206 10.0943 25.9948 10.1554 25.7963 10.2712L16.0726 15.8858V11.9982C16.0715 11.9783 16.0753 11.9585 16.0837 11.9405C16.0921 11.9225 16.1048 11.9068 16.1207 11.8949L24.1719 7.25025C25.4053 6.53903 26.8158 6.19376 28.2383 6.25482C29.6608 6.31589 31.0364 6.78077 32.2044 7.59508C33.3723 8.40939 34.2842 9.53945 34.8334 10.8531C35.3826 12.1667 35.5464 13.6095 35.3055 15.0128ZM14.2424 21.9419L10.8752 19.9981C10.8576 19.9893 10.8423 19.9763 10.8309 19.9602C10.8195 19.9441 10.8122 19.9254 10.8098 19.9058V10.6071C10.8107 9.18295 11.2173 7.78848 11.9819 6.58696C12.7466 5.38544 13.8377 4.42659 15.1275 3.82264C16.4173 3.21869 17.8524 2.99464 19.2649 3.1767C20.6775 3.35876 22.0089 3.93941 23.1034 4.85067C23.0427 4.88379 22.937 4.94215 22.8668 4.98473L14.9024 9.58517C14.7025 9.69878 14.5366 9.86356 14.4215 10.0626C14.3065 10.2616 14.2466 10.4877 14.2479 10.7175L14.2424 21.9419ZM16.071 17.9991L20.4018 15.4978L24.7325 17.9975V22.9985L20.4018 25.4983L16.071 22.9985V17.9991Z\" fill=\"currentColor\"></path>\n        </symbol>\n    </svg>\n    <div class=\"conversation\">\n        <div class=\"conversation-header\">\n            <h1>\n                <a href=\"{{source}}\" target=\"_blank\" rel=\"noopener noreferrer\">{{title}}</a>\n                <button class=\"toggle\">\n                    <svg class=\"sun\" stroke=\"currentColor\" fill=\"none\" stroke-width=\"2\" viewBox=\"0 0 24 24\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"w-4 h-4\" height=\"1em\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"12\" cy=\"12\" r=\"5\"></circle><line x1=\"12\" y1=\"1\" x2=\"12\" y2=\"3\"></line><line x1=\"12\" y1=\"21\" x2=\"12\" y2=\"23\"></line><line x1=\"4.22\" y1=\"4.22\" x2=\"5.64\" y2=\"5.64\"></line><line x1=\"18.36\" y1=\"18.36\" x2=\"19.78\" y2=\"19.78\"></line><line x1=\"1\" y1=\"12\" x2=\"3\" y2=\"12\"></line><line x1=\"21\" y1=\"12\" x2=\"23\" y2=\"12\"></line><line x1=\"4.22\" y1=\"19.78\" x2=\"5.64\" y2=\"18.36\"></line><line x1=\"18.36\" y1=\"5.64\" x2=\"19.78\" y2=\"4.22\"></line></svg>\n                    <svg class=\"moon\" stroke=\"currentColor\" fill=\"none\" stroke-width=\"2\" viewBox=\"0 0 24 24\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"w-4 h-4\" height=\"1em\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z\"></path></svg>\n                </button>\n                <button class=\"toggle width-toggle\">\n                    <svg class=\"expand\" stroke=\"currentColor\" fill=\"none\" stroke-width=\"2\" viewBox=\"0 0 24 24\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"w-4 h-4\" height=\"1em\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\" style=\"display: block;\">\n                        <path d=\"M3 12h18M6 8l-4 4 4 4M18 8l4 4-4 4\"></path>\n                    </svg>\n                    <svg class=\"narrow\" stroke=\"currentColor\" fill=\"none\" stroke-width=\"2\" viewBox=\"0 0 24 24\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"w-4 h-4\" height=\"1em\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\" style=\"display: none;\">\n                        <path d=\"M3 12h7M14 12h7M6 16l4-4-4-4M18 16l-4-4 4-4\"></path>\n                    </svg>\n                </button>\n            </h1>\n            <div class=\"conversation-export\">\n                <p>Exported by\n                <a href=\"https://github.com/pionxzh/chatgpt-exporter.git\">ChatGPT Exporter</a>\n                at {{time}}</p>\n            </div>\n            {{details}}\n        </div>\n\n        {{content}}\n    </div>\n\n\n    <script>\n        function toggleDarkMode(mode) {\n            const html = document.querySelector('html');\n            const isDarkMode = html.getAttribute('data-theme') === 'dark';\n            const newMode = mode || (isDarkMode ? 'light' : 'dark');\n            if (newMode !== 'dark' && newMode !== 'light') return;\n            html.setAttribute('data-theme', newMode);\n\n            const url = new URL(window.location);\n            url.searchParams.set('theme', newMode);\n            window.history.replaceState({}, '', url);\n        }\n        function toggleWidthMode(mode) {\n            const body = document.querySelector('body');\n            const widthToggleButton = document.querySelector('.width-toggle');\n            const isWide = body.getAttribute('data-width') === 'wide';\n            const newWidthMode = mode || (isWide ? 'narrow' : 'wide');\n            if (newWidthMode !== 'narrow' && newWidthMode !== 'wide') return;\n            body.setAttribute('data-width', newWidthMode);\n\n            const url = new URL(window.location);\n            url.searchParams.set('width', newWidthMode);\n            window.history.replaceState({}, '', url);\n\n            // Update the icon based on the current mode\n            const narrowIcon = widthToggleButton.querySelector('.narrow');\n            const expandIcon = widthToggleButton.querySelector('.expand');\n\n            if (newWidthMode === 'wide') {\n                expandIcon.style.display = \"none\";\n                narrowIcon.style.display = \"block\";\n            } else {\n                expandIcon.style.display = \"block\";\n                narrowIcon.style.display = \"none\";\n            }\n        }\n\n        const urlParams = new URLSearchParams(window.location.search);\n        const theme = urlParams.get('theme');\n        const width = urlParams.get('width');\n\n        if (theme) toggleDarkMode(theme);\n        if (width) toggleWidthMode(width);\n\n        document.querySelector('.toggle').addEventListener('click', () => toggleDarkMode());\n        document.querySelector('.width-toggle').addEventListener('click', () => toggleWidthMode());\n    <\/script>\n</body>\n\n</html>\n";
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
		return document.documentElement.style.getPropertyValue("color-scheme");
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
	function p$3(_, index, parent) {
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
			alert(i18n_default.t("Please start a conversation first"));
			return false;
		}
		if (!checkIfTemporaryChatIsExportable()) {
			alert(i18n_default.t("Temporary chat could not be captured"));
			return false;
		}
		const userAvatar = await getUserAvatar();
		const chatId = await getCurrentChatId();
		const conversation = processConversation(await fetchConversation(chatId, true), { enableThinking: ScriptStorage.get("exporter:enable_thinking") ?? false });
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
		const LatexRegex = /(\s\$\$.+?\$\$\s|\s\$.+?\$\s|\\\[.+?\\\]|\\\(.+?\\\))|(^\$$[\S\s]+?^\$$)|(^\$\$[\S\s]+?^\$\$\$)/gm;
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
					sourceListLabel: i18n_default.t("Sources")
				}));
				postSteps.push((input) => {
					const matches = input.match(LatexRegex);
					const isCodeBlock = /```/.test(input);
					if (!isCodeBlock && matches) {
						let index = 0;
						input = input.replace(LatexRegex, () => {
							return `╬${index++}╬`;
						});
						input = input.replace(/^\\\[(.+)\\\]$/gm, "$$$$$1$$$$").replace(/\\\[/g, "$$").replace(/\\\]/g, "$$").replace(/\\\(/g, "$").replace(/\\\)/g, "$");
					}
					let transformed = toHtml(fromMarkdown(input));
					if (!isCodeBlock && matches) transformed = transformed.replace(/╬(\d+)╬/g, (_, index) => {
						return matches[+index];
					});
					return transformed;
				});
			}
			if (message.author.role === "user") postSteps = [...postSteps, (input) => `<p class="no-katex">${escapeHtml(input)}</p>`];
			const postProcess = (input) => postSteps.reduce((acc, fn) => fn(acc), input);
			const content = transformContent$2(message.content, message.metadata, postProcess);
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
			case "code": return `Code:\n\`\`\`\n${content.text}\n\`\`\`` || "";
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
				if (part.content_type === "audio_transcription") return `<div style="font-style: italic; opacity: 0.65;">“${part.text}”</div>`;
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
	async function exportToPng(fileNameFormat) {
		if (!checkIfConversationStarted()) {
			alert(i18n_default.t("Please start a conversation first"));
			return false;
		}
		const effect = new Effect();
		const conversationTurns = Array.from(document.querySelectorAll("#thread [data-testid^=\"conversation-turn-\"]"));
		const thread = findCommonAncestor(conversationTurns);
		if (!thread || thread.children.length === 0 || thread.scrollHeight < 50) {
			alert(i18n_default.t("Failed to export to PNG. Failed to find the element node."));
			return false;
		}
		const isDarkMode = document.documentElement.classList.contains("dark");
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
		effect.add(() => {
			const minHeight = screenshotEl.style.minHeight;
			screenshotEl.style.minHeight = `${screenshotEl.scrollHeight}px`;
			return () => {
				screenshotEl.style.minHeight = minHeight;
			};
		});
		effect.run();
		await sleep(0);
		const backgroundColor = isDarkMode ? "#212121" : "#fff";
		const width = Math.max(screenshotEl.offsetWidth, screenshotEl.scrollWidth);
		const height = Math.max(screenshotEl.offsetHeight, screenshotEl.scrollHeight);
		let capture = null;
		try {
			capture = await (0, _zumer_snapdom.snapdom)(screenshotEl, {
				embedFonts: true,
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
		effect.dispose();
		if (!png) {
			alert("Failed to export to PNG. This might be caused by the size of the conversation. Please try to export a smaller conversation.");
			return false;
		}
		downloadFile(getFileNameWithFormat(fileNameFormat, "png", { chatId: getChatIdFromUrl() || void 0 }), "image/png", png);
		return true;
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
			alert(i18n_default.t("Please start a conversation first"));
			return false;
		}
		if (!checkIfTemporaryChatIsExportable()) {
			alert(i18n_default.t("Temporary chat could not be captured"));
			return false;
		}
		const chatId = await getCurrentChatId();
		const rawConversation = await fetchConversation(chatId, false);
		downloadFile(getFileNameWithFormat(fileNameFormat, "json", {
			title: rawConversation.title || "ChatGPT Conversation",
			chatId
		}), "application/json", conversationToJson([rawConversation]));
		return true;
	}
	async function exportToTavern(fileNameFormat) {
		if (!checkIfConversationStarted()) {
			alert(i18n_default.t("Please start a conversation first"));
			return false;
		}
		if (!checkIfTemporaryChatIsExportable()) {
			alert(i18n_default.t("Temporary chat could not be captured"));
			return false;
		}
		const chatId = await getCurrentChatId();
		const conversation = processConversation(await fetchConversation(chatId, false));
		downloadFile(getFileNameWithFormat(`${fileNameFormat}.tavern`, "jsonl", {
			title: conversation.title,
			chatId
		}), "application/json-lines", convertToTavern(conversation));
		return true;
	}
	async function exportToOoba(fileNameFormat) {
		if (!checkIfConversationStarted()) {
			alert(i18n_default.t("Please start a conversation first"));
			return false;
		}
		if (!checkIfTemporaryChatIsExportable()) {
			alert(i18n_default.t("Temporary chat could not be captured"));
			return false;
		}
		const chatId = await getCurrentChatId();
		const conversation = processConversation(await fetchConversation(chatId, false));
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
		const restore = (output) => output.replace(/╬(\d+)╬/g, (match, index) => formulas[Number(index)] ?? match);
		return {
			text,
			restore
		};
	}
	async function exportToMarkdown(fileNameFormat, metaList) {
		if (!checkIfConversationStarted()) {
			alert(i18n_default.t("Please start a conversation first"));
			return false;
		}
		if (!checkIfTemporaryChatIsExportable()) {
			alert(i18n_default.t("Temporary chat could not be captured"));
			return false;
		}
		const chatId = await getCurrentChatId();
		const conversation = processConversation(await fetchConversation(chatId, true), { enableThinking: ScriptStorage.get("exporter:enable_thinking") ?? false });
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
					sourceListLabel: i18n_default.t("Sources")
				}));
				postSteps.push((input) => transformFootNotes$1(input, message.metadata));
			}
			if (message.author.role === "assistant") postSteps.push((input) => {
				const { text, restore } = protectMath(input);
				return restore(toMarkdown(fromMarkdown(text)));
			});
			const postProcess = (input) => postSteps.reduce((acc, fn) => fn(acc), input);
			const content = transformContent$1(message.content, message.metadata, postProcess);
			return `#### ${author}:\n${timestampHtml}${thinkingBlock}${content}`;
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
			case "code": return `Code:\n\`\`\`\n${content.text}\n\`\`\`` || "";
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
			alert(i18n_default.t("Please start a conversation first"));
			return false;
		}
		if (!checkIfTemporaryChatIsExportable()) {
			alert(i18n_default.t("Temporary chat could not be captured"));
			return false;
		}
		const { conversationNodes } = processConversation(await fetchConversation(await getCurrentChatId(), false));
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
	function o$5(o, e, n, t, f, l) {
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
		return l$5.vnode && l$5.vnode(i), i;
	}
	var Divider = () => o$5("div", { className: "h-px bg-token-border-light" });
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
			this.status = "IDLE";
			this.backoff = this.minBackoff;
			this.pauseUntil = 0;
			this.batchPauses = 0;
			this.total = 0;
			this.completed = 0;
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
	_css(".CheckBoxLabel {\n    position: relative;\n    display: flex;\n    font-size: 16px;\n    vertical-align: middle;\n}\n\n.CheckBoxLabel * {\n    cursor: pointer;\n}\n\n.CheckBoxLabel[disabled] {\n    opacity: 0.7;\n}\n\n.CheckBoxLabel[disabled] * {\n    cursor: not-allowed;\n}\n\n.CheckBoxLabel input {\n    position: absolute;\n    opacity: 0;\n    width: 100%;\n    height: 100%;\n    top: 0;\n    left: 0;\n    margin: 0;\n    padding: 0;\n}\n\n.CheckBoxLabel .IconWrapper {\n    display: inline-flex;\n    align-items: center;\n    position: relative;\n    vertical-align: middle;\n    font-size: 1.5rem;\n}\n\n.CheckBoxLabel input:checked ~ svg {\n    color: rgb(28 100 242);\n}\n\n.dark .CheckBoxLabel input:checked ~ svg {\n    color: rgb(144, 202, 249);\n}\n\n.CheckBoxLabel .LabelText {\n    margin-left: 0.5rem;\n    font-size: 1rem;\n    line-height: 1.5;\n}\n");
	function FileCode() {
		return o$5("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 384 512",
			className: "w-4 h-4 shrink-0",
			fill: "currentColor",
			children: o$5("path", { d: "M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM153 289l-31 31 31 31c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L71 337c-9.4-9.4-9.4-24.6 0-33.9l48-48c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9zM265 255l48 48c9.4 9.4 9.4 24.6 0 33.9l-48 48c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l31-31-31-31c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0z" })
		});
	}
	function IconCamera() {
		return o$5("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 512 512",
			className: "w-4 h-4 shrink-0",
			fill: "currentColor",
			children: o$5("path", { d: "M149.1 64.8L138.7 96H64C28.7 96 0 124.7 0 160V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H373.3L362.9 64.8C356.4 45.2 338.1 32 317.4 32H194.6c-20.7 0-39 13.2-45.5 32.8zM256 384c-53 0-96-43-96-96s43-96 96-96s96 43 96 96s-43 96-96 96z" })
		});
	}
	function IconMarkdown() {
		return o$5("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 640 512",
			className: "w-4 h-4 shrink-0",
			fill: "currentColor",
			children: o$5("path", { d: "M593.8 59.1H46.2C20.7 59.1 0 79.8 0 105.2v301.5c0 25.5 20.7 46.2 46.2 46.2h547.7c25.5 0 46.2-20.7 46.1-46.1V105.2c0-25.4-20.7-46.1-46.2-46.1zM338.5 360.6H277v-120l-61.5 76.9-61.5-76.9v120H92.3V151.4h61.5l61.5 76.9 61.5-76.9h61.5v209.2zm135.3 3.1L381.5 256H443V151.4h61.5V256H566z" })
		});
	}
	function IconCopy() {
		return o$5("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 512 512",
			className: "w-4 h-4 shrink-0",
			fill: "currentColor",
			children: o$5("path", { d: "M502.6 70.63l-61.25-61.25C435.4 3.371 427.2 0 418.7 0H255.1c-35.35 0-64 28.66-64 64l.0195 256C192 355.4 220.7 384 256 384h192c35.2 0 64-28.8 64-64V93.25C512 84.77 508.6 76.63 502.6 70.63zM464 320c0 8.836-7.164 16-16 16H255.1c-8.838 0-16-7.164-16-16L239.1 64.13c0-8.836 7.164-16 16-16h128L384 96c0 17.67 14.33 32 32 32h47.1V320zM272 448c0 8.836-7.164 16-16 16H63.1c-8.838 0-16-7.164-16-16L47.98 192.1c0-8.836 7.164-16 16-16H160V128H63.99c-35.35 0-64 28.65-64 64l.0098 256C.002 483.3 28.66 512 64 512h192c35.2 0 64-28.8 64-64v-32h-47.1L272 448z" })
		});
	}
	function IconArrowRightFromBracket() {
		return o$5("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 576 512",
			className: "w-4 h-4 shrink-0",
			fill: "currentColor",
			children: o$5("path", { d: "M534.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L434.7 224 224 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM192 96c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-53 0-96 43-96 96l0 256c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z" })
		});
	}
	function IconSetting() {
		return o$5("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 15 15",
			className: "w-4 h-4 shrink-0",
			stroke: "currentColor",
			"stroke-width": "0.5",
			children: o$5("path", {
				d: "M7.07095 0.650238C6.67391 0.650238 6.32977 0.925096 6.24198 1.31231L6.0039 2.36247C5.6249 2.47269 5.26335 2.62363 4.92436 2.81013L4.01335 2.23585C3.67748 2.02413 3.23978 2.07312 2.95903 2.35386L2.35294 2.95996C2.0722 3.2407 2.0232 3.6784 2.23493 4.01427L2.80942 4.92561C2.62307 5.2645 2.47227 5.62594 2.36216 6.00481L1.31209 6.24287C0.924883 6.33065 0.650024 6.6748 0.650024 7.07183V7.92897C0.650024 8.32601 0.924883 8.67015 1.31209 8.75794L2.36228 8.99603C2.47246 9.375 2.62335 9.73652 2.80979 10.0755L2.2354 10.9867C2.02367 11.3225 2.07267 11.7602 2.35341 12.041L2.95951 12.6471C3.24025 12.9278 3.67795 12.9768 4.01382 12.7651L4.92506 12.1907C5.26384 12.377 5.62516 12.5278 6.0039 12.6379L6.24198 13.6881C6.32977 14.0753 6.67391 14.3502 7.07095 14.3502H7.92809C8.32512 14.3502 8.66927 14.0753 8.75705 13.6881L8.99505 12.6383C9.37411 12.5282 9.73573 12.3773 10.0748 12.1909L10.986 12.7653C11.3218 12.977 11.7595 12.928 12.0403 12.6473L12.6464 12.0412C12.9271 11.7604 12.9761 11.3227 12.7644 10.9869L12.1902 10.076C12.3768 9.73688 12.5278 9.37515 12.638 8.99596L13.6879 8.75794C14.0751 8.67015 14.35 8.32601 14.35 7.92897V7.07183C14.35 6.6748 14.0751 6.33065 13.6879 6.24287L12.6381 6.00488C12.528 5.62578 12.3771 5.26414 12.1906 4.92507L12.7648 4.01407C12.9766 3.6782 12.9276 3.2405 12.6468 2.95975L12.0407 2.35366C11.76 2.07292 11.3223 2.02392 10.9864 2.23565L10.0755 2.80989C9.73622 2.62328 9.37437 2.47229 8.99505 2.36209L8.75705 1.31231C8.66927 0.925096 8.32512 0.650238 7.92809 0.650238H7.07095ZM4.92053 3.81251C5.44724 3.44339 6.05665 3.18424 6.71543 3.06839L7.07095 1.50024H7.92809L8.28355 3.06816C8.94267 3.18387 9.5524 3.44302 10.0794 3.81224L11.4397 2.9547L12.0458 3.56079L11.1882 4.92117C11.5573 5.44798 11.8164 6.0575 11.9321 6.71638L13.5 7.07183V7.92897L11.932 8.28444C11.8162 8.94342 11.557 9.55301 11.1878 10.0798L12.0453 11.4402L11.4392 12.0462L10.0787 11.1886C9.55192 11.5576 8.94241 11.8166 8.28355 11.9323L7.92809 13.5002H7.07095L6.71543 11.932C6.0569 11.8162 5.44772 11.5572 4.92116 11.1883L3.56055 12.046L2.95445 11.4399L3.81213 10.0794C3.4431 9.55266 3.18403 8.94326 3.06825 8.2845L1.50002 7.92897V7.07183L3.06818 6.71632C3.18388 6.05765 3.44283 5.44833 3.81171 4.92165L2.95398 3.561L3.56008 2.95491L4.92053 3.81251ZM9.02496 7.50008C9.02496 8.34226 8.34223 9.02499 7.50005 9.02499C6.65786 9.02499 5.97513 8.34226 5.97513 7.50008C5.97513 6.65789 6.65786 5.97516 7.50005 5.97516C8.34223 5.97516 9.02496 6.65789 9.02496 7.50008ZM9.92496 7.50008C9.92496 8.83932 8.83929 9.92499 7.50005 9.92499C6.1608 9.92499 5.07513 8.83932 5.07513 7.50008C5.07513 6.16084 6.1608 5.07516 7.50005 5.07516C8.83929 5.07516 9.92496 6.16084 9.92496 7.50008Z",
				fill: "currentColor",
				fillRule: "evenodd",
				clipRule: "evenodd"
			})
		});
	}
	function IconCross() {
		return o$5("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 15 15",
			width: "15",
			height: "15",
			children: o$5("path", {
				d: "M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z",
				fill: "currentColor",
				fillRule: "evenodd",
				clipRule: "evenodd"
			})
		});
	}
	function IconJSON() {
		return o$5("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 24 24",
			className: "w-5 h-5",
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
				o$5("path", {
					stroke: "none",
					d: "M0 0h24v24H0z",
					fill: "none"
				}),
				o$5("path", { d: "M20 16v-8l3 8v-8" }),
				o$5("path", { d: "M15 8a2 2 0 0 1 2 2v4a2 2 0 1 1 -4 0v-4a2 2 0 0 1 2 -2z" }),
				o$5("path", { d: "M1 8h3v6.5a1.5 1.5 0 0 1 -3 0v-.5" }),
				o$5("path", { d: "M7 15a1 1 0 0 0 1 1h1a1 1 0 0 0 1 -1v-2a1 1 0 0 0 -1 -1h-1a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1h1a1 1 0 0 1 1 1" })
			]
		});
	}
	function IconZip() {
		return o$5("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 24 24",
			className: "w-4 h-4 shrink-0",
			"stroke-width": "2",
			stroke: "currentColor",
			fill: "none",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			children: [
				o$5("path", {
					stroke: "none",
					d: "M0 0h24v24H0z",
					fill: "none"
				}),
				o$5("path", { d: "M6 20.735a2 2 0 0 1 -1 -1.735v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-1" }),
				o$5("path", { d: "M11 17a2 2 0 0 1 2 2v2a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-2a2 2 0 0 1 2 -2z" }),
				o$5("path", { d: "M11 5l-1 0" }),
				o$5("path", { d: "M13 7l-1 0" }),
				o$5("path", { d: "M11 9l-1 0" }),
				o$5("path", { d: "M13 11l-1 0" }),
				o$5("path", { d: "M11 13l-1 0" }),
				o$5("path", { d: "M13 15l-1 0" })
			]
		});
	}
	function IconLoading({ className, style }) {
		return o$5("span", {
			style: { animation: "1.4s linear 0s infinite normal none running rotate" },
			children: o$5("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				viewBox: "22 22 44 44",
				className,
				style: {
					animation: "1.4s ease-in-out 0s infinite normal none running circularDash",
					...style
				},
				fill: "none",
				stroke: "currentColor",
				"stroke-width": "2",
				children: o$5("circle", {
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
		return o$5("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 24 24",
			style: {
				width: "1em",
				height: "1em",
				display: "inline-block"
			},
			fill: "currentColor",
			children: o$5("path", { d: "M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" })
		});
	}
	function IconCheckBoxChecked({ className }) {
		return o$5("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 24 24",
			className,
			style: {
				width: "1em",
				height: "1em",
				display: "inline-block"
			},
			fill: "currentColor",
			children: o$5("path", { d: "M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" })
		});
	}
	function IconTrash({ className, style }) {
		return o$5("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 24 24",
			className,
			style,
			fill: "none",
			"stroke-linecap": "round",
			"stroke-linejoin": "round",
			children: [
				o$5("path", {
					stroke: "none",
					d: "M0 0h24v24H0z",
					fill: "none"
				}),
				o$5("path", {
					d: "M20 6a1 1 0 0 1 .117 1.993l-.117 .007h-.081l-.919 11a3 3 0 0 1 -2.824 2.995l-.176 .005h-8c-1.598 0 -2.904 -1.249 -2.992 -2.75l-.005 -.167l-.923 -11.083h-.08a1 1 0 0 1 -.117 -1.993l.117 -.007h16z",
					"stroke-width": "0",
					fill: "currentColor"
				}),
				o$5("path", {
					d: "M14 2a2 2 0 0 1 2 2a1 1 0 0 1 -1.993 .117l-.007 -.117h-4l-.007 .117a1 1 0 0 1 -1.993 -.117a2 2 0 0 1 1.85 -1.995l.15 -.005h4z",
					"stroke-width": "0",
					fill: "currentColor"
				})
			]
		});
	}
	function IconUpload({ className, style }) {
		return o$5("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 24 24",
			className,
			style,
			fill: "none",
			"stroke-linecap": "round",
			"stroke-linejoin": "round",
			children: [
				o$5("path", {
					stroke: "none",
					d: "M0 0h24v24H0z",
					fill: "none"
				}),
				o$5("path", {
					stroke: "currentColor",
					d: "M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"
				}),
				o$5("path", {
					stroke: "currentColor",
					d: "M7 9l5 -5l5 5"
				}),
				o$5("path", {
					stroke: "currentColor",
					d: "M12 4l0 12"
				})
			]
		});
	}
	var CheckBox = ({ className, checked = false, disabled, label, onCheckedChange }) => {
		const [isChecked, setChecked] = h$4(checked);
		const onChange = (e) => {
			const newValue = e.currentTarget.checked;
			setChecked(newValue);
			onCheckedChange?.(newValue);
		};
		p$6(() => {
			setChecked(checked);
		}, [checked]);
		return o$5("label", {
			className: `CheckBoxLabel ${className ?? ""}`,
			disabled,
			children: [o$5("span", {
				className: "IconWrapper",
				children: [o$5("input", {
					type: "checkbox",
					checked: isChecked,
					onChange,
					disabled
				}), isChecked ? o$5(IconCheckBoxChecked, {}) : o$5(IconCheckBox, {})]
			}), o$5("span", {
				className: "LabelText",
				children: label
			})]
		});
	};
	function useGMStorage(key, initialValue) {
		const [storedValue, setStoredValue] = h$4(() => ScriptStorage.get(key) ?? initialValue);
		return [storedValue, T$4((value) => {
			setStoredValue(value);
			ScriptStorage.set(key, value);
		}, [key])];
	}
	var defaultFormat = "ChatGPT-{title}";
	var defaultExportAllLimit = 1e3;
	var defaultExportMetaList = [{
		name: "title",
		value: "{title}"
	}, {
		name: "source",
		value: "{source}"
	}];
	var SettingContext = G$1({
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
		const resetDefault = T$4(() => {
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
		return o$5(SettingContext.Provider, {
			value,
			children
		});
	};
	var useSettingContext = () => q$1(SettingContext);
	var exportingRef = { current: false };
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
	var ProjectSelect = ({ projects, selected, setSelected, disabled, loading }) => {
		const { t } = useTranslation();
		return o$5("div", {
			className: "ProjectSelect flex items-center text-gray-600 dark:text-gray-300 justify-between mb-3",
			children: [t("Select Project"), o$5("div", {
				className: "flex items-center gap-2",
				children: [loading && o$5(IconLoading, { className: "w-3 h-3" }), o$5("select", {
					disabled,
					className: "Select",
					value: selected ?? "",
					onChange: (e) => {
						const val = e.currentTarget.value;
						setSelected(val || null);
					},
					children: [o$5("option", {
						value: "",
						children: t("All conversations")
					}), projects.map((project) => o$5("option", {
						value: project.id,
						children: project.display.name
					}, project.id))]
				})]
			})]
		});
	};
	var ConversationSelect = ({ conversations, selected, setSelected, disabled, loading, error }) => {
		const { t } = useTranslation();
		const [query, setQuery] = h$4("");
		const lastClickedIndex = _$1(-1);
		const [sortField, setSortField] = h$4("create_time");
		const [sortDir, setSortDir] = h$4("desc");
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
		const selectByExportStatus = T$4((status) => {
			lastClickedIndex.current = -1;
			const exportedMap = getExportedUpdateTimes();
			if (status === "all") setSelected(filtered);
			else if (status === "not_exported") setSelected(filtered.filter((c) => !(c.id in exportedMap)));
			else setSelected(filtered.filter((c) => c.id in exportedMap && exportedMap[c.id] < toMs(c.update_time)));
		}, [filtered, setSelected]);
		return o$5(k$3, { children: [
			o$5("input", {
				type: "search",
				className: "SelectSearch",
				placeholder: t("Search"),
				value: query,
				disabled,
				onInput: (e) => {
					const val = e.currentTarget.value;
					lastClickedIndex.current = -1;
					setQuery(val);
				}
			}),
			o$5("div", {
				className: "SelectToolbar",
				children: [o$5(CheckBox, {
					label: t("Select All"),
					disabled,
					checked: allFilteredSelected,
					onCheckedChange: (checked) => {
						lastClickedIndex.current = -1;
						setSelected(checked ? filtered : []);
					}
				}), o$5("div", {
					className: "flex items-center gap-2 ml-auto min-w-0",
					children: [
						loading && conversations.length > 0 && o$5("span", {
							className: "flex items-center gap-1 truncate min-w-0 text-sm text-gray-500 dark:text-gray-400",
							children: [
								o$5(IconLoading, { className: "w-3 h-3" }),
								t("Loading"),
								"... (",
								conversations.length,
								")"
							]
						}),
						o$5("select", {
							className: "Select shrink-0",
							style: {
								fontSize: "0.75rem",
								padding: "2px 2rem 2px 0.5rem",
								width: "8.5rem",
								textOverflow: "ellipsis"
							},
							disabled: disabled || filtered.length === 0,
							value: "",
							title: "Select conversations by export status",
							onChange: (e) => {
								const val = e.currentTarget.value;
								if (val) selectByExportStatus(val);
							},
							children: [
								o$5("option", {
									value: "",
									disabled: true,
									children: t("Select...")
								}),
								o$5("option", {
									value: "all",
									children: t("Select All")
								}),
								o$5("option", {
									value: "not_exported",
									children: t("Select Not Exported")
								}),
								o$5("option", {
									value: "updated",
									children: t("Select Updated")
								})
							]
						}),
						o$5("span", {
							className: "truncate min-w-0 text-xs text-gray-400 dark:text-gray-500",
							style: { flexShrink: 99 },
							children: t("Shift Select Hint")
						}),
						o$5("span", {
							className: "whitespace-nowrap shrink-0 text-sm font-medium tabular-nums text-gray-500 dark:text-gray-400",
							children: [
								selected.length,
								" / ",
								filtered.length
							]
						})
					]
				})]
			}),
			o$5("div", {
				className: "SelectListHeader",
				children: [
					o$5("button", {
						className: `SelectListHeaderCell SelectListHeaderCellTitle${sortField === "title" ? " SelectListHeaderCellActive" : ""}`,
						onClick: () => {
							if (sortField === "title") setSortDir((d) => d === "asc" ? "desc" : "asc");
							else {
								setSortField("title");
								setSortDir("asc");
							}
						},
						children: ["Title ", sortField === "title" ? sortDir === "asc" ? "↑" : "↓" : "↕"]
					}),
					o$5("button", {
						className: `SelectListHeaderCell${sortField === "create_time" ? " SelectListHeaderCellActive" : ""}`,
						onClick: () => {
							if (sortField === "create_time") setSortDir((d) => d === "asc" ? "desc" : "asc");
							else {
								setSortField("create_time");
								setSortDir("desc");
							}
						},
						children: ["Created ", sortField === "create_time" ? sortDir === "asc" ? "↑" : "↓" : "↕"]
					}),
					o$5("button", {
						className: `SelectListHeaderCell${sortField === "update_time" ? " SelectListHeaderCellActive" : ""}`,
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
			o$5("ul", {
				className: "SelectList",
				children: [
					loading && conversations.length === 0 && o$5("li", {
						className: "SelectItem",
						children: [t("Loading"), "..."]
					}),
					error && o$5("li", {
						className: "SelectItem",
						children: [
							t("Error"),
							": ",
							error
						]
					}),
					filtered.map((c, index) => {
						const isSelected = selected.some((x) => x.id === c.id);
						return o$5("li", {
							className: "SelectItem",
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
								o$5(CheckBox, {
									label: c.title,
									disabled,
									checked: isSelected,
									onCheckedChange: (checked) => {
										setSelected(checked ? [...selected, c] : selected.filter((x) => x.id !== c.id));
									}
								}),
								c.is_starred && o$5("span", {
									title: "Starred",
									style: {
										color: "#f59e0b",
										flexShrink: 0
									},
									children: "★"
								}),
								o$5("span", {
									className: `SelectItemMeta${sortField === "create_time" ? " SelectItemMetaActive" : ""}`,
									title: `Created: ${c.create_time ?? "—"}`,
									children: formatConvDate(c.create_time)
								}),
								o$5("span", {
									className: `SelectItemMeta${sortField === "update_time" ? " SelectItemMetaActive" : ""}`,
									title: `Updated: ${c.update_time ?? "—"}`,
									children: formatConvDate(c.update_time)
								})
							]
						}, c.id);
					}),
					!loading && !error && filtered.length === 0 && conversations.length > 0 && o$5("li", {
						className: "SelectItem text-gray-400 dark:text-gray-500",
						children: t("No results")
					})
				]
			})
		] });
	};
	var DialogContent = ({ format }) => {
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
		const [exportSource, setExportSource] = h$4("API");
		const [apiConversations, setApiConversations] = h$4([]);
		const [localConversations, setLocalConversations] = h$4([]);
		const conversations = exportSource === "API" ? apiConversations : localConversations;
		const [projects, setProjects] = h$4([]);
		const [selectedProjectId, setSelectedProjectId] = h$4(null);
		const [projectsLoading, setProjectsLoading] = h$4(false);
		const selectedProject = projects.find((p) => p.id === selectedProjectId) ?? null;
		const [loading, setLoading] = h$4(false);
		const [error, setError] = h$4("");
		const [processing, setProcessing] = h$4(false);
		const [selected, setSelected] = h$4([]);
		const [exportType, setExportType] = h$4(exportAllOptions[0].label);
		const disabled = processing || !!error || selected.length === 0;
		const [hasMore, setHasMore] = h$4(false);
		const [loadingMore, setLoadingMore] = h$4(false);
		const [totalAvailable, setTotalAvailable] = h$4(null);
		const requestQueue = F$1(() => new RequestQueue(200, 1600), []);
		const archiveQueue = F$1(() => new RequestQueue(200, 1600), []);
		const deleteQueue = F$1(() => new RequestQueue(200, 1600), []);
		const [progress, setProgress] = h$4({
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
		const fetchGenRef = _$1(0);
		const onUpload = T$4((e) => {
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
		const startApiBatch = T$4((chunk) => {
			requestQueue.clear();
			chunk.forEach(({ id, title }) => {
				requestQueue.add({
					name: title,
					request: () => fetchConversation(id, exportType !== "JSON")
				});
			});
			requestQueue.start();
		}, [requestQueue, exportType]);
		p$6(() => {
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
		p$6(() => {
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
		p$6(() => {
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
		p$6(() => {
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
				if (partIndex < totalBatches) {
					await sleep(400);
					batchIndexRef.current++;
					const nextChunk = pendingBatchesRef.current[batchIndexRef.current];
					if (nextChunk) startApiBatch(nextChunk);
				} else setProcessing(false);
			});
			return () => off();
		}, [
			requestQueue,
			exportAllOptions,
			exportType,
			format,
			metaList,
			startApiBatch,
			selectedProject
		]);
		p$6(() => {
			const off = archiveQueue.on("done", () => {
				setProcessing(false);
				setApiConversations((prev) => prev.filter((c) => !selected.some((s) => s.id === c.id)));
				setSelected([]);
				alert(t("Conversation Archived Message"));
			});
			return () => off();
		}, [
			archiveQueue,
			selected,
			t
		]);
		p$6(() => {
			const off = deleteQueue.on("done", () => {
				setProcessing(false);
				setApiConversations((prev) => prev.filter((c) => !selected.some((s) => s.id === c.id)));
				setSelected([]);
				alert(t("Conversation Deleted Message"));
			});
			return () => off();
		}, [
			deleteQueue,
			selected,
			t
		]);
		const cancelExport = T$4(() => {
			cancelledRef.current = true;
			requestQueue.stop();
			archiveQueue.stop();
			deleteQueue.stop();
		}, [
			requestQueue,
			archiveQueue,
			deleteQueue
		]);
		const exportAllFromApi = T$4(() => {
			if (disabled) return;
			cancelledRef.current = false;
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
		const exportAllFromLocal = T$4(async () => {
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
		const deleteAll = T$4(() => {
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
		const archiveAll = T$4(() => {
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
		p$6(() => {
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
		p$6(() => {
			exportingRef.current = processing;
		}, [processing]);
		p$6(() => {
			setProjectsLoading(true);
			fetchProjects().then(setProjects).catch((err) => console.error("Error fetching projects:", err)).finally(() => setProjectsLoading(false));
		}, []);
		p$6(() => {
			const gen = ++fetchGenRef.current;
			const alive = () => gen === fetchGenRef.current;
			setSelected([]);
			setApiConversations([]);
			setHasMore(false);
			setTotalAvailable(null);
			setLoading(true);
			fetchAllConversations(selectedProjectId, exportAllLimit, (batch) => {
				if (alive()) setApiConversations((prev) => [...prev, ...batch]);
			}, (hasMore) => {
				if (alive()) setHasMore(hasMore);
			}).catch((err) => {
				if (!alive()) return;
				console.error("Error fetching conversations:", err);
				setError(err.message || "Failed to load conversations");
			}).finally(() => {
				if (alive()) setLoading(false);
			});
		}, [exportAllLimit, selectedProjectId]);
		const loadMore = T$4(async () => {
			if (loadingMore) return;
			setLoadingMore(true);
			try {
				const page = await fetchConversationsPage(selectedProjectId, apiConversations.length, 100);
				setApiConversations((prev) => [...prev, ...page.items]);
				if (page.total !== null) setTotalAvailable(page.total);
				setHasMore(page.items.length >= 100 && (page.total === null || apiConversations.length + page.items.length < page.total));
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
		const [probeStatus, setProbeStatus] = h$4(null);
		const [probeRetryAfterSecs, setProbeRetryAfterSecs] = h$4();
		const [probeHeaders, setProbeHeaders] = h$4({});
		const runProbe = T$4(async () => {
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
		return o$5(k$3, { children: [
			o$5($5d3850c4d0b4e6c7$export$f99233281efd08a0, {
				className: "DialogTitle",
				children: t("Export Dialog Title")
			}),
			o$5("div", {
				className: "flex items-center text-gray-600 dark:text-gray-300 flex justify-between border-b-[1px] pb-3 mb-3 dark:border-gray-700",
				children: [
					t("Export from official export file"),
					" (conversations.json)\xA0",
					o$5("div", {
						className: "flex items-center gap-2",
						children: [exportSource === "API" && o$5("button", {
							className: "Button neutral",
							style: {
								fontSize: "0.72rem",
								padding: "2px 8px",
								whiteSpace: "nowrap"
							},
							disabled: probeStatus === "testing" || processing,
							title: Object.keys(probeHeaders).length > 0 ? `Rate-limit headers: ${JSON.stringify(probeHeaders)}` : "Check if the API is currently rate-limiting requests",
							onClick: runProbe,
							children: probeLabel ?? "Test API"
						}), exportSource === "API" && o$5("button", {
							className: "btn relative btn-neutral",
							onClick: () => fileInputRef.current?.click(),
							children: o$5(IconUpload, { className: "w-4 h-4" })
						})]
					})
				]
			}),
			o$5("input", {
				type: "file",
				accept: "application/json",
				className: "hidden",
				ref: fileInputRef,
				onChange: onUpload
			}),
			exportSource === "API" && o$5(ProjectSelect, {
				projects,
				selected: selectedProjectId,
				setSelected: setSelectedProjectId,
				disabled: processing,
				loading: projectsLoading
			}),
			o$5(ConversationSelect, {
				conversations,
				selected,
				setSelected,
				disabled: processing,
				loading,
				error
			}),
			exportSource === "API" && !loading && !processing && hasMore && o$5("div", {
				className: "flex items-center justify-center mt-2 mb-1 gap-2",
				children: [o$5("button", {
					className: "Button neutral",
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
				}), totalAvailable !== null && !loadingMore && o$5("span", {
					className: "text-xs text-gray-400 dark:text-gray-500 tabular-nums",
					children: [
						apiConversations.length,
						" / ",
						totalAvailable
					]
				})]
			}),
			o$5("div", {
				className: "ActionBar flex flex-wrap mt-3 items-center gap-2",
				children: [
					o$5("select", {
						className: "Select shrink-0",
						disabled: processing,
						value: exportType,
						onChange: (e) => setExportType(e.currentTarget.value),
						children: exportAllOptions.map(({ label }) => o$5("option", {
							value: label,
							children: label
						}, t(label)))
					}),
					o$5("div", { className: "flex flex-grow" }),
					o$5("button", {
						className: "Button red",
						disabled: disabled || exportSource === "Local",
						onClick: archiveAll,
						children: t("Archive")
					}),
					o$5("button", {
						className: "Button red",
						disabled: disabled || exportSource === "Local",
						onClick: deleteAll,
						children: t("Delete")
					}),
					o$5("button", {
						className: "Button green",
						disabled,
						onClick: exportAll,
						children: t("Export")
					})
				]
			}),
			totalBatches > 1 && !processing && o$5("p", {
				className: "mt-1.5 text-xs text-right text-gray-400 dark:text-gray-500",
				children: `${totalBatches} downloads \u00B7 100 conversations each`
			}),
			processing && o$5(k$3, { children: [o$5("div", {
				className: "mt-2 mb-1 justify-between flex items-center gap-2",
				children: [
					o$5("span", {
						className: "truncate text-sm text-gray-600 dark:text-gray-300",
						children: progress.currentStatus === "rate_limited" ? `⏳ Rate limited — waiting ${progress.rateLimitWaitSecs ?? "…"}s` : progress.currentName
					}),
					o$5("span", {
						className: "shrink-0 tabular-nums text-sm text-gray-500 dark:text-gray-400",
						children: progress.totalBatches > 1 ? `${t("Batch progress").replace("{{current}}", String(progress.batchIndex + 1)).replace("{{total}}", String(progress.totalBatches))} \u00B7 ${progress.completed}/${progress.total}` : `${progress.completed}/${progress.total}`
					}),
					o$5("button", {
						className: "Button red",
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
			}), o$5("div", {
				className: "w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700",
				children: o$5("div", {
					className: `h-2.5 rounded-full ${progress.currentStatus === "rate_limited" ? "bg-amber-500" : "bg-blue-600"}`,
					style: { width: `${progress.total > 0 ? progress.completed / progress.total * 100 : 0}%` }
				})
			})] }),
			processing ? o$5("button", {
				className: "IconButton CloseButton",
				"aria-label": "Export in progress",
				title: "Click Cancel to stop the export",
				style: {
					cursor: "not-allowed",
					opacity: .25
				},
				children: o$5(IconCross, {})
			}) : o$5($5d3850c4d0b4e6c7$export$f39c2d165cd861fe, {
				asChild: true,
				children: o$5("button", {
					className: "IconButton CloseButton",
					"aria-label": "Close",
					children: o$5(IconCross, {})
				})
			})
		] });
	};
	var ExportDialog = ({ format, open, onOpenChange, children }) => {
		const guardClose = (e) => {
			if (exportingRef.current) e.preventDefault();
		};
		return o$5($5d3850c4d0b4e6c7$export$be92b6f5f03c0fe9, {
			open,
			onOpenChange: (val) => {
				if (!val && exportingRef.current) return;
				onOpenChange(val);
			},
			children: [o$5($5d3850c4d0b4e6c7$export$41fb9f06171c75f4, {
				asChild: true,
				children
			}), o$5($5d3850c4d0b4e6c7$export$602eac185826482c, { children: [o$5($5d3850c4d0b4e6c7$export$c6fdb837b070b4ff, { className: "DialogOverlay" }), o$5($5d3850c4d0b4e6c7$export$7c6e2c02157bb7d2, {
				className: "DialogContent _export",
				onEscapeKeyDown: guardClose,
				onInteractOutside: guardClose,
				children: open && o$5(DialogContent, { format })
			})] })]
		});
	};
	var TIMEOUT = 2500;
	var MenuItem = ({ text, successText, disabled = false, title, ariaLabel, icon: Icon, onClick, className }) => {
		const [loading, setLoading] = h$4(false);
		const [succeed, setSucceed] = h$4(false);
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
		return o$5("div", {
			className: `
            menu-item
            __menu-item hoverable
            flex flex-shrink-0 m-0 items-center gap-3 rounded-lg
            transition-colors duration-200
            cursor-pointer
            border border-menu ${className}`,
			onClick: handleClick,
			onTouchStart: handleClick,
			disabled,
			"aria-label": ariaLabel,
			title,
			children: loading ? o$5("div", {
				className: "flex justify-center items-center w-full h-full",
				children: o$5(IconLoading, { className: "w-4 h-4" })
			}) : o$5(k$3, { children: [Icon && o$5(Icon, {}), o$5("span", {
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
	var i$2 = Object.defineProperty;
	var d$2 = (t, e, n) => e in t ? i$2(t, e, {
		enumerable: !0,
		configurable: !0,
		writable: !0,
		value: n
	}) : t[e] = n;
	var r$1 = (t, e, n) => (d$2(t, typeof e != "symbol" ? e + "" : e, n), n);
	var o$4 = class {
		constructor() {
			r$1(this, "current", this.detect());
			r$1(this, "handoffState", "pending");
			r$1(this, "currentId", 0);
		}
		set(e) {
			this.current !== e && (this.handoffState = "pending", this.currentId = 0, this.current = e);
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
	var s$3 = new o$4();
	var l$1 = (e, f) => {
		s$3.isServer ? p$6(e, f) : y$5(e, f);
	};
	function s$2(e) {
		let r = _$1(e);
		return l$1(() => {
			r.current = e;
		}, [e]), r;
	}
	function t(e) {
		typeof queueMicrotask == "function" ? queueMicrotask(e) : Promise.resolve().then(e).catch((o) => setTimeout(() => {
			throw o;
		}));
	}
	function o$3() {
		let n = [], r = {
			addEventListener(e, t, s, a) {
				return e.addEventListener(t, s, a), r.add(() => e.removeEventListener(t, s, a));
			},
			requestAnimationFrame(...e) {
				let t = requestAnimationFrame(...e);
				return r.add(() => cancelAnimationFrame(t));
			},
			nextFrame(...e) {
				return r.requestAnimationFrame(() => r.requestAnimationFrame(...e));
			},
			setTimeout(...e) {
				let t = setTimeout(...e);
				return r.add(() => clearTimeout(t));
			},
			microTask(...e) {
				let t$5 = { current: !0 };
				return t(() => {
					t$5.current && e[0]();
				}), r.add(() => {
					t$5.current = !1;
				});
			},
			style(e, t, s) {
				let a = e.style.getPropertyValue(t);
				return Object.assign(e.style, { [t]: s }), this.add(() => {
					Object.assign(e.style, { [t]: a });
				});
			},
			group(e) {
				let t = o$3();
				return e(t), this.add(() => t.dispose());
			},
			add(e) {
				return n.push(e), () => {
					let t = n.indexOf(e);
					if (t >= 0) for (let s of n.splice(t, 1)) s();
				};
			},
			dispose() {
				for (let e of n.splice(0)) e();
			}
		};
		return r;
	}
	function p$2() {
		let [e] = h$4(o$3);
		return p$6(() => () => e.dispose(), [e]), e;
	}
	var o$2 = function(t) {
		let e = s$2(t);
		return wn.useCallback((...r) => e.current(...r), [e]);
	};
	function l() {
		let [e, f] = h$4(s$3.isHandoffComplete);
		return e && s$3.isHandoffComplete === !1 && f(!1), p$6(() => {
			e !== !0 && f(!0);
		}, [e]), p$6(() => s$3.handoff(), []), e;
	}
	var o$1;
	var I = (o$1 = wn.useId) != null ? o$1 : function() {
		let n = l(), [e, u] = wn.useState(n ? () => s$3.nextId() : null);
		return l$1(() => {
			e === null && u(s$3.nextId());
		}, [e]), e != null ? "" + e : void 0;
	};
	function u$2(r, n, ...a) {
		if (r in n) {
			let e = n[r];
			return typeof e == "function" ? e(...a) : e;
		}
		let t = new Error(`Tried to handle "${r}" but there is no handler defined. Only defined handlers are: ${Object.keys(n).map((e) => `"${e}"`).join(", ")}.`);
		throw Error.captureStackTrace && Error.captureStackTrace(t, u$2), t;
	}
	function i$1(t) {
		var n;
		if (t.type) return t.type;
		let e = (n = t.as) != null ? n : "button";
		if (typeof e == "string" && e.toLowerCase() === "button") return "button";
	}
	function s$1(t, e) {
		let [n, u] = h$4(() => i$1(t));
		return l$1(() => {
			u(i$1(t));
		}, [t.type, t.as]), l$1(() => {
			n || e.current && e.current instanceof HTMLButtonElement && !e.current.hasAttribute("type") && u("button");
		}, [n, e]), n;
	}
	var u$1 = Symbol();
	function y$2(...t) {
		let n = _$1(t);
		p$6(() => {
			n.current = t;
		}, [t]);
		let c = o$2((e) => {
			for (let o of n.current) o != null && (typeof o == "function" ? o(e) : o.current = e);
		});
		return t.every((e) => e == null || (e == null ? void 0 : e[u$1])) ? void 0 : c;
	}
	function e(...n) {
		return n.filter(Boolean).join(" ");
	}
	var S$1 = ((a) => (a[a.None = 0] = "None", a[a.RenderStrategy = 1] = "RenderStrategy", a[a.Static = 2] = "Static", a))(S$1 || {});
	var j = ((e) => (e[e.Unmount = 0] = "Unmount", e[e.Hidden = 1] = "Hidden", e))(j || {});
	function X({ ourProps: r, theirProps: t, slot: e, defaultTag: a, features: s, visible: n = !0, name: f }) {
		let o = N(t, r);
		if (n) return c$1(o, e, a, f);
		let u = s != null ? s : 0;
		if (u & 2) {
			let { static: l = !1, ...p } = o;
			if (l) return c$1(p, e, a, f);
		}
		if (u & 1) {
			let { unmount: l = !0, ...p } = o;
			return u$2(l ? 0 : 1, {
				[0]() {
					return null;
				},
				[1]() {
					return c$1({
						...p,
						hidden: !0,
						style: { display: "none" }
					}, e, a, f);
				}
			});
		}
		return c$1(o, e, a, f);
	}
	function c$1(r, t = {}, e$4, a) {
		let { as: s = e$4, children: n, refName: f = "ref", ...o } = g(r, ["unmount", "static"]), u = r.ref !== void 0 ? { [f]: r.ref } : {}, l = typeof n == "function" ? n(t) : n;
		"className" in o && o.className && typeof o.className == "function" && (o.className = o.className(t));
		let p = {};
		if (t) {
			let i = !1, m = [];
			for (let [y, d] of Object.entries(t)) typeof d == "boolean" && (i = !0), d === !0 && m.push(y);
			i && (p["data-headlessui-state"] = m.join(" "));
		}
		if (s === k$3 && Object.keys(R(o)).length > 0) {
			if (!an(l) || Array.isArray(l) && l.length > 1) throw new Error([
				"Passing props on \"Fragment\"!",
				"",
				`The current component <${a} /> is rendering a "Fragment".`,
				"However we need to passthrough the following props:",
				Object.keys(o).map((d) => `  - ${d}`).join(`
`),
				"",
				"You can apply a few solutions:",
				["Add an `as=\"...\"` prop, to ensure that we render an actual element instead of a \"Fragment\".", "Render a single element as the child so that we can forward the props onto that element."].map((d) => `  - ${d}`).join(`
`)
			].join(`
`));
			let i = l.props, m = typeof (i == null ? void 0 : i.className) == "function" ? (...d) => e(i == null ? void 0 : i.className(...d), o.className) : e(i == null ? void 0 : i.className, o.className), y = m ? { className: m } : {};
			return hn(l, Object.assign({}, N(l.props, R(g(o, ["ref"]))), p, u, w(l.ref, u.ref), y));
		}
		return y$6(s, Object.assign({}, g(o, ["ref"]), s !== k$3 && u, s !== k$3 && p), l);
	}
	function w(...r) {
		return { ref: r.every((t) => t == null) ? void 0 : (t) => {
			for (let e of r) e != null && (typeof e == "function" ? e(t) : e.current = t);
		} };
	}
	function N(...r) {
		if (r.length === 0) return {};
		if (r.length === 1) return r[0];
		let t = {}, e = {};
		for (let s of r) for (let n in s) n.startsWith("on") && typeof s[n] == "function" ? (e[n] ?? (e[n] = []), e[n].push(s[n])) : t[n] = s[n];
		if (t.disabled || t["aria-disabled"]) return Object.assign(t, Object.fromEntries(Object.keys(e).map((s) => [s, void 0])));
		for (let s in e) Object.assign(t, { [s](n, ...f) {
			let o = e[s];
			for (let u of o) {
				if ((n instanceof Event || (n == null ? void 0 : n.nativeEvent) instanceof Event) && n.defaultPrevented) return;
				u(n, ...f);
			}
		} });
		return t;
	}
	function D(r) {
		var t;
		return Object.assign(k$1(r), { displayName: (t = r.displayName) != null ? t : r.name });
	}
	function R(r) {
		let t = Object.assign({}, r);
		for (let e in t) t[e] === void 0 && delete t[e];
		return t;
	}
	function g(r, t = []) {
		let e = Object.assign({}, r);
		for (let a of t) a in e && delete e[a];
		return e;
	}
	function r(n) {
		let e = n.parentElement, l = null;
		for (; e && !(e instanceof HTMLFieldSetElement);) e instanceof HTMLLegendElement && (l = e), e = e.parentElement;
		let t = (e == null ? void 0 : e.getAttribute("disabled")) === "";
		return t && i(l) ? !1 : t;
	}
	function i(n) {
		if (!n) return !1;
		let e = n.previousElementSibling;
		for (; e !== null;) {
			if (e instanceof HTMLLegendElement) return !1;
			e = e.previousElementSibling;
		}
		return !0;
	}
	function p$1(n) {
		var t;
		let r = (t = n == null ? void 0 : n.form) != null ? t : n.closest("form");
		if (r) {
			for (let i of r.elements) if (i.tagName === "INPUT" && i.type === "submit" || i.tagName === "BUTTON" && i.type === "submit" || i.nodeName === "INPUT" && i.type === "image") {
				i.click();
				return;
			}
		}
	}
	var a = "div";
	var p = ((e) => (e[e.None = 1] = "None", e[e.Focusable = 2] = "Focusable", e[e.Hidden = 4] = "Hidden", e))(p || {});
	function s(t, o) {
		let { features: n = 1, ...e } = t;
		return X({
			ourProps: {
				ref: o,
				"aria-hidden": (n & 2) === 2 ? !0 : void 0,
				style: {
					position: "fixed",
					top: 1,
					left: 1,
					width: 1,
					height: 0,
					padding: 0,
					margin: -1,
					overflow: "hidden",
					clip: "rect(0, 0, 0, 0)",
					whiteSpace: "nowrap",
					borderWidth: "0",
					...(n & 4) === 4 && (n & 2) !== 2 && { display: "none" }
				}
			},
			theirProps: e,
			slot: {},
			defaultTag: a,
			name: "Hidden"
		});
	}
	var c = D(s);
	var o = ((r) => (r.Space = " ", r.Enter = "Enter", r.Escape = "Escape", r.Backspace = "Backspace", r.Delete = "Delete", r.ArrowLeft = "ArrowLeft", r.ArrowUp = "ArrowUp", r.ArrowRight = "ArrowRight", r.ArrowDown = "ArrowDown", r.Home = "Home", r.End = "End", r.PageUp = "PageUp", r.PageDown = "PageDown", r.Tab = "Tab", r))(o || {});
	function T(l, r, c) {
		let [i, s] = h$4(c), e = l !== void 0, t = _$1(e), u = _$1(!1), d = _$1(!1);
		return e && !t.current && !u.current ? (u.current = !0, t.current = e, console.error("A component is changing from uncontrolled to controlled. This may be caused by the value changing from undefined to a defined value, which should not happen.")) : !e && t.current && !d.current && (d.current = !0, t.current = e, console.error("A component is changing from controlled to uncontrolled. This may be caused by the value changing from a defined value to undefined, which should not happen.")), [e ? l : i, o$2((n) => (e || s(n), r == null ? void 0 : r(n)))];
	}
	var d$1 = G$1(null);
	function f() {
		let r = q$1(d$1);
		if (r === null) {
			let t = new Error("You used a <Description /> component, but it is not inside a relevant parent.");
			throw Error.captureStackTrace && Error.captureStackTrace(t, f), t;
		}
		return r;
	}
	function M$1() {
		let [r, t] = h$4([]);
		return [r.length > 0 ? r.join(" ") : void 0, F$1(() => function(e) {
			let i = o$2((s) => (t((o) => [...o, s]), () => t((o) => {
				let p = o.slice(), c = p.indexOf(s);
				return c !== -1 && p.splice(c, 1), p;
			}))), n = F$1(() => ({
				register: i,
				slot: e.slot,
				name: e.name,
				props: e.props
			}), [
				i,
				e.slot,
				e.name,
				e.props
			]);
			return wn.createElement(d$1.Provider, { value: n }, e.children);
		}, [t])];
	}
	var S = "p";
	function h$1(r, t) {
		let a = I(), { id: e = `headlessui-description-${a}`, ...i } = r, n = f(), s = y$2(t);
		l$1(() => n.register(e), [e, n.register]);
		return X({
			ourProps: {
				ref: s,
				...n.props,
				id: e
			},
			theirProps: i,
			slot: n.slot || {},
			defaultTag: S,
			name: n.name || "Description"
		});
	}
	var y$1 = D(h$1);
	var b = Object.assign(y$1, {});
	var d = G$1(null);
	function u() {
		let o = q$1(d);
		if (o === null) {
			let t = new Error("You used a <Label /> component, but it is not inside a relevant parent.");
			throw Error.captureStackTrace && Error.captureStackTrace(t, u), t;
		}
		return o;
	}
	function H() {
		let [o, t] = h$4([]);
		return [o.length > 0 ? o.join(" ") : void 0, F$1(() => function(e) {
			let s = o$2((r) => (t((l) => [...l, r]), () => t((l) => {
				let n = l.slice(), p = n.indexOf(r);
				return p !== -1 && n.splice(p, 1), n;
			}))), a = F$1(() => ({
				register: s,
				slot: e.slot,
				name: e.name,
				props: e.props
			}), [
				s,
				e.slot,
				e.name,
				e.props
			]);
			return wn.createElement(d.Provider, { value: a }, e.children);
		}, [t])];
	}
	var A = "label";
	function h(o, t) {
		let i = I(), { id: e = `headlessui-label-${i}`, passive: s = !1, ...a } = o, r = u(), l = y$2(t);
		l$1(() => r.register(e), [e, r.register]);
		let n = {
			ref: l,
			...r.props,
			id: e
		};
		return s && ("onClick" in n && (delete n.htmlFor, delete n.onClick), "onClick" in a && delete a.onClick), X({
			ourProps: n,
			theirProps: a,
			slot: r.slot || {},
			defaultTag: A,
			name: r.name || "Label"
		});
	}
	var v = D(h);
	var M = Object.assign(v, {});
	var y = G$1(null);
	y.displayName = "GroupContext";
	var Y = k$3;
	function Z(s) {
		var d;
		let [n, p] = h$4(null), [c, f] = H(), [r, h] = M$1(), l = F$1(() => ({
			switch: n,
			setSwitch: p,
			labelledby: c,
			describedby: r
		}), [
			n,
			p,
			c,
			r
		]), T = {}, b = s;
		return wn.createElement(h, { name: "Switch.Description" }, wn.createElement(f, {
			name: "Switch.Label",
			props: {
				htmlFor: (d = l.switch) == null ? void 0 : d.id,
				onClick(t) {
					n && (t.currentTarget.tagName === "LABEL" && t.preventDefault(), n.click(), n.focus({ preventScroll: !0 }));
				}
			}
		}, wn.createElement(y.Provider, { value: l }, X({
			ourProps: T,
			theirProps: b,
			defaultTag: Y,
			name: "Switch.Group"
		}))));
	}
	var ee = "button";
	function te(s, n) {
		let p$8 = I(), { id: c$6 = `headlessui-switch-${p$8}`, checked: f, defaultChecked: r$6 = !1, onChange: h, name: l, value: T$6, form: b, ...d } = s, t = q$1(y), u = _$1(null), D = y$2(u, n, t === null ? null : t.setSwitch), [o$10, a] = T(f, h, r$6), S = o$2(() => a == null ? void 0 : a(!o$10)), C = o$2((e) => {
			if (r(e.currentTarget)) return e.preventDefault();
			e.preventDefault(), S();
		}), L = o$2((e) => {
			e.key === o.Space ? (e.preventDefault(), S()) : e.key === o.Enter && p$1(e.currentTarget);
		}), v = o$2((e) => e.preventDefault()), G = F$1(() => ({ checked: o$10 }), [o$10]), R$4 = {
			id: c$6,
			ref: D,
			role: "switch",
			type: s$1(s, u),
			tabIndex: 0,
			"aria-checked": o$10,
			"aria-labelledby": t == null ? void 0 : t.labelledby,
			"aria-describedby": t == null ? void 0 : t.describedby,
			onClick: C,
			onKeyUp: L,
			onKeyPress: v
		}, k = p$2();
		return p$6(() => {
			var w;
			let e = (w = u.current) == null ? void 0 : w.closest("form");
			e && r$6 !== void 0 && k.addEventListener(e, "reset", () => {
				a(r$6);
			});
		}, [u, a]), wn.createElement(wn.Fragment, null, l != null && o$10 && wn.createElement(c, {
			features: p.Hidden,
			...R({
				as: "input",
				type: "checkbox",
				hidden: !0,
				readOnly: !0,
				form: b,
				checked: o$10,
				name: l,
				value: T$6
			})
		}), X({
			ourProps: R$4,
			theirProps: d,
			slot: G,
			defaultTag: ee,
			name: "Switch"
		}));
	}
	var ne = D(te);
	var Ge = Object.assign(ne, {
		Group: Z,
		Label: M,
		Description: b
	});
	function Toggle({ label, checked = true, onCheckedUpdate }) {
		return o$5("div", {
			className: "inline-flex items-center",
			children: [o$5(Ge, {
				checked,
				onChange: onCheckedUpdate,
				"data-state": checked ? "checked" : "unchecked",
				className: "toggle-switch",
				children: o$5("span", {
					"data-state": checked ? "checked" : "unchecked",
					className: "toggle-switch-handle"
				})
			}), label && o$5("span", {
				className: "toggle-switch-label",
				children: label
			})]
		});
	}
	function Variable({ name, title }) {
		return o$5("strong", {
			className: "cursor-help select-all whitespace-nowrap",
			title,
			children: name
		});
	}
	var SettingDialog = ({ open, onOpenChange, children }) => {
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
		return o$5($5d3850c4d0b4e6c7$export$be92b6f5f03c0fe9, {
			open,
			onOpenChange,
			children: [o$5($5d3850c4d0b4e6c7$export$41fb9f06171c75f4, {
				asChild: true,
				children
			}), o$5($5d3850c4d0b4e6c7$export$602eac185826482c, { children: [o$5($5d3850c4d0b4e6c7$export$c6fdb837b070b4ff, { className: "DialogOverlay" }), o$5($5d3850c4d0b4e6c7$export$7c6e2c02157bb7d2, {
				className: "DialogContent",
				children: [
					o$5($5d3850c4d0b4e6c7$export$f99233281efd08a0, {
						className: "DialogTitle",
						children: t("Exporter Settings")
					}),
					o$5("div", {
						className: "DialogBody",
						children: o$5("dl", {
							className: "space-y-6",
							children: [
								o$5("div", {
									className: "relative flex bg-white dark:bg-white/5 rounded p-4",
									children: o$5("div", { children: [o$5("dt", {
										className: "text-md font-medium text-gray-800 dark:text-white",
										children: `${t("Language")} 🌐`
									}), o$5("dd", { children: o$5("select", {
										className: "Select mt-3",
										value: i18n.language,
										onChange: (e) => i18n.changeLanguage(e.currentTarget.value),
										children: LOCALES.map(({ name, code }) => o$5("option", {
											value: code,
											children: name
										}, code))
									}) })] })
								}),
								o$5("div", {
									className: "relative flex bg-white dark:bg-white/5 rounded p-4",
									children: o$5("div", { children: [o$5("dt", {
										className: "text-md font-medium text-gray-800 dark:text-white",
										children: t("File Name")
									}), o$5("dd", { children: [
										o$5("p", {
											className: "text-sm text-gray-700 dark:text-gray-300",
											children: [
												t("Available variables"),
												":",
												" ",
												o$5(Variable, {
													name: "{title}",
													title
												}),
												",",
												" ",
												o$5(Variable, {
													name: "{date}",
													title: date
												}),
												",",
												" ",
												o$5(Variable, {
													name: "{timestamp}",
													title: timestamp$1
												}),
												",",
												" ",
												o$5(Variable, {
													name: "{chat_id}",
													title: chatId
												}),
												",",
												" ",
												o$5(Variable, {
													name: "{create_time}",
													title: unixTimestampToISOString(createTime)
												}),
												",",
												" ",
												o$5(Variable, {
													name: "{update_time}",
													title: unixTimestampToISOString(updateTime)
												})
											]
										}),
										o$5("input", {
											className: "Input mt-4",
											id: "filename",
											value: format,
											onChange: (e) => setFormat(e.currentTarget.value)
										}),
										o$5("p", {
											className: "mt-1 text-sm text-gray-700 dark:text-gray-300",
											children: [
												t("Preview"),
												":",
												" ",
												o$5("span", {
													className: "select-all",
													style: {
														"text-decoration": "underline",
														"text-underline-offset": 4
													},
													children: preview
												})
											]
										})
									] })] })
								}),
								o$5("div", {
									className: "relative flex bg-white dark:bg-white/5 rounded p-4",
									children: [o$5("div", { children: [o$5("dt", {
										className: "text-md font-medium text-gray-800 dark:text-white",
										children: t("Export Thinking Process")
									}), o$5("dd", {
										className: "text-sm text-gray-700 dark:text-gray-300",
										children: t("Export Thinking Process Description")
									})] }), o$5("div", {
										className: "absolute right-4",
										children: o$5(Toggle, {
											label: "",
											checked: enableThinking,
											onCheckedUpdate: setEnableThinking
										})
									})]
								}),
								o$5("div", {
									className: "relative flex bg-white dark:bg-white/5 rounded p-4",
									children: [o$5("div", { children: [o$5("dt", {
										className: "text-md font-medium text-gray-800 dark:text-white",
										children: t("Export Sources")
									}), o$5("dd", {
										className: "text-sm text-gray-700 dark:text-gray-300",
										children: t("Export Sources Description")
									})] }), o$5("div", {
										className: "absolute right-4",
										children: o$5(Toggle, {
											label: "",
											checked: enableSources,
											onCheckedUpdate: setEnableSources
										})
									})]
								}),
								o$5("div", {
									className: "relative flex bg-white dark:bg-white/5 rounded p-4",
									children: o$5("div", { children: [o$5("dt", {
										className: "text-md font-medium text-gray-800 dark:text-white",
										children: [t("Export All Limit"), " "]
									}), o$5("dd", {
										className: "text-sm text-gray-700 dark:text-gray-300 mt-2",
										children: [
											t("Export All Limit Description"),
											" ",
											o$5("div", {
												className: "flex items-center gap-4 mt-3",
												children: [o$5("input", {
													type: "range",
													min: "100",
													max: "20000",
													step: "100",
													value: exportAllLimit,
													onChange: (e) => setExportAllLimit(Number.parseInt(e.currentTarget.value, 10)),
													className: "flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700",
													id: "exportAllLimitSlider"
												}), o$5("span", {
													className: "font-medium text-gray-900 dark:text-gray-300 w-12 text-right",
													children: exportAllLimit
												})]
											})
										]
									})] })
								}),
								o$5("div", {
									className: "relative flex bg-white dark:bg-white/5 rounded p-4",
									children: [o$5("div", { children: [o$5("dt", {
										className: "text-md font-medium text-gray-800 dark:text-white",
										children: t("Conversation Timestamp")
									}), o$5("dd", {
										className: "text-sm text-gray-700 dark:text-gray-300",
										children: [t("Conversation Timestamp Description"), enableTimestamp && o$5(k$3, { children: [
											o$5("div", {
												className: "mt-2",
												children: o$5(Toggle, {
													label: t("Use 24-hour format"),
													checked: timeStamp24H,
													onCheckedUpdate: setTimeStamp24H
												})
											}),
											o$5("div", {
												className: "mt-2",
												children: o$5(Toggle, {
													label: t("Enable on HTML"),
													checked: enableTimestampHTML,
													onCheckedUpdate: setEnableTimestampHTML
												})
											}),
											o$5("div", {
												className: "mt-2",
												children: o$5(Toggle, {
													label: t("Enable on Markdown"),
													checked: enableTimestampMarkdown,
													onCheckedUpdate: setEnableTimestampMarkdown
												})
											})
										] })]
									})] }), o$5("div", {
										className: "absolute right-4",
										children: o$5(Toggle, {
											label: "",
											checked: enableTimestamp,
											onCheckedUpdate: setEnableTimestamp
										})
									})]
								}),
								o$5("div", {
									className: "relative flex bg-white dark:bg-white/5 rounded p-4",
									children: [o$5("div", { children: [o$5("dt", {
										className: "text-md font-medium text-gray-800 dark:text-white",
										children: t("Export Metadata")
									}), o$5("dd", {
										className: "text-sm text-gray-700 dark:text-gray-300",
										children: [t("Export Metadata Description"), enableMeta && o$5(k$3, { children: [
											o$5("p", {
												className: "mt-2 text-sm text-gray-700 dark:text-gray-300",
												children: [
													t("Available variables"),
													":",
													" ",
													o$5(Variable, {
														name: "{title}",
														title
													}),
													",",
													" ",
													o$5(Variable, {
														name: "{date}",
														title: date
													}),
													",",
													" ",
													o$5(Variable, {
														name: "{timestamp}",
														title: timestamp$1
													}),
													",",
													" ",
													o$5(Variable, {
														name: "{source}",
														title: source
													}),
													",",
													" ",
													o$5(Variable, {
														name: "{model}",
														title: "ChatGPT-3.5"
													}),
													",",
													" ",
													o$5(Variable, {
														name: "{model_name}",
														title: "text-davinci-002-render-sha"
													}),
													",",
													" ",
													o$5(Variable, {
														name: "{create_time}",
														title: "2023-04-10T21:45:35.027Z"
													}),
													",",
													" ",
													o$5(Variable, {
														name: "{update_time}",
														title: "2023-04-10T21:45:35.027Z"
													})
												]
											}),
											exportMetaList.map((meta, i) => o$5("div", {
												className: "flex items-center mt-2",
												children: [
													o$5("input", {
														className: "Input",
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
													o$5("span", {
														className: "mx-2",
														children: "→"
													}),
													o$5("input", {
														className: "Input",
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
													o$5("button", {
														className: "ml-2 rounded-full p-1 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition ease-in-out duration-150",
														"aria-label": "Remove",
														onClick: () => setExportMetaList(exportMetaList.filter((_, j) => j !== i)),
														children: o$5(IconTrash, { className: "w-4 h-4" })
													})
												]
											}, i)),
											o$5("div", {
												className: "flex justify-center items-center mt-2 pr-8",
												children: o$5("button", {
													className: "w-full border border-[#6f6e77] dark:border-gray-[#86858d] rounded-md py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition ease-in-out duration-150",
													"aria-label": "Add",
													onClick: () => setExportMetaList([...exportMetaList, {
														name: "",
														value: ""
													}]),
													children: "+"
												})
											})
										] })]
									})] }), o$5("div", {
										className: "absolute right-4",
										children: o$5(Toggle, {
											label: "",
											checked: enableMeta,
											onCheckedUpdate: setEnableMeta
										})
									})]
								})
							]
						})
					}),
					o$5("div", {
						className: "flex shrink-0 pt-4",
						style: { justifyContent: "flex-end" },
						children: o$5($5d3850c4d0b4e6c7$export$f39c2d165cd861fe, {
							asChild: true,
							children: o$5("button", {
								className: "Button green font-bold",
								children: t("Save")
							})
						})
					}),
					o$5($5d3850c4d0b4e6c7$export$f39c2d165cd861fe, {
						asChild: true,
						children: o$5("button", {
							className: "IconButton CloseButton",
							"aria-label": "Close",
							children: o$5(IconCross, {})
						})
					})
				]
			})] })]
		});
	};
	_css("span[data-time-format] {\n    display: none;\n}\n\nbody[data-time-format=\"12\"] span[data-time-format=\"12\"] {\n    display: inline;\n}\n\nbody[data-time-format=\"24\"] span[data-time-format=\"24\"] {\n    display: inline;\n}\n\n.Select {\n    padding: 0 2rem 0 0.5rem;\n    width: auto;\n    min-width: 7.5rem;\n    border-radius: 4px;\n    box-shadow: 0 0 0 1px #6f6e77;\n}\n\n.dark .Select {\n    background-color: #2f2f2f;\n    color: #fff;\n    box-shadow: 0 0 0 1px #6f6e77;\n}\n\nhtml {\n    --ce-text-primary: var(--text-primary, #0d0d0d);\n    --ce-menu-primary: #ffffff;\n    --ce-menu-secondary: var(--sidebar-surface-secondary, #ececec);\n    --ce-border-light: #0d0d0d26;\n}\n\n.dark {\n    --ce-text-primary: var(--text-primary, #ececec);\n    --ce-menu-primary: #2A2A2A;\n    --ce-menu-secondary: var(--sidebar-surface-secondary, #212121);\n    --ce-border-light: var(--border-default, rgba(255, 255, 255, .15));\n}\n\n/* Define our own background in both themes — this used to lean on\n   ChatGPT's bg-menu utility class, which no longer paints one */\n.bg-menu {\n    background-color: var(--ce-menu-primary);\n}\n\n.dark .bg-menu {\n    background-color: var(--ce-menu-primary);\n}\n\n.border-menu {\n    border-color: var(--ce-border-light);\n}\n\n.menu-item {\n    height: 46px;\n}\n\n.menu-item[disabled] {\n    filter: brightness(0.5);\n}\n\n.ce-nav-trigger {\n    min-width: 0;\n    border: 0;\n    color: var(--ce-text-primary);\n}\n\n.ce-nav-trigger .ce-menu-item-text {\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n}\n\n.ce-nav-trigger-collapsed {\n    width: 32px;\n    height: 32px;\n    margin: 0 auto 0.5rem;\n    padding: 0;\n    justify-content: center;\n    gap: 0;\n    border-radius: 8px;\n    color: var(--text-secondary, var(--ce-text-primary));\n}\n\n.ce-nav-trigger-collapsed:hover {\n    background-color: var(--sidebar-surface-secondary, rgba(255, 255, 255, 0.1));\n}\n\n.ce-nav-trigger-collapsed .ce-menu-item-text {\n    display: none;\n}\n\n.ce-card {\n    border-radius: 1rem;\n    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);\n}\n\n/* ChatGPT's main column carries its own z-index, which beats the menu's\n   portalled Radix popper wrapper (position: fixed, z-index: auto). Raise\n   only OUR wrapper — :has keeps ChatGPT's own Radix poppers untouched —\n   and stay below the dialogs at 1000/1001. */\n[data-radix-popper-content-wrapper]:has(.ce-card) {\n    z-index: 999 !important;\n}\n\n.dark .ce-card {\n    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3);\n}\n\n.inputFieldSet {\n    display: block;\n    border-width: 2px;\n    border-style: groove;\n}\n\n.inputFieldSet legend {\n    margin-left: 4px;\n}\n\n.inputFieldSet input {\n    background-color: transparent;\n    box-shadow: none!important;\n}\n\n.row-half {\n    grid-column: auto / span 1;\n}\n\n.row-full {\n    grid-column: auto / span 2;\n}\n\n.dropdown-backdrop {\n    display: block;\n    position: fixed;\n    top: 0;\n    bottom: 0;\n    left: 0;\n    right: 0;\n    background-color: rgba(0,0,0,.5);\n    animation-name: pointerFadeIn;\n    animation-duration: .3s;\n}\n\n@keyframes fadeIn {\n    from {\n        opacity: 0;\n    }\n    to {\n        opacity: 1;\n    }\n}\n\n@keyframes slideUp {\n    from {\n        transform: translateY(100%);\n    }\n    to {\n        transform: translateY(0);\n    }\n}\n\n@keyframes pointerFadeIn {\n    from {\n        opacity: 0;\n        pointer-events: none;\n    }\n    to {\n        opacity: 1;\n        pointer-events: auto;\n    }\n}\n\n@keyframes rotate {\n    from {\n        transform: rotate(0deg);\n    }\n    to {\n        transform: rotate(360deg);\n    }\n}\n\n@keyframes circularDash {\n    0% {\n        stroke-dasharray: 1px, 200px;\n        stroke-dashoffset: 0;\n    }\n    50% {\n        stroke-dasharray: 100px, 200px;\n        stroke-dashoffset: -15px;\n    }\n    100% {\n        stroke-dasharray: 100px, 200px;\n        stroke-dashoffset: -125px;\n    }\n}\n");
	_css(".DialogOverlay {\n    background-color: rgba(0, 0, 0, 0.44);\n    position: fixed;\n    inset: 0;\n    z-index: 1000;\n    animation: fadeIn 150ms cubic-bezier(0.16, 1, 0.3, 1);\n}\n\n.DialogContent {\n    background-color: #f3f3f3;\n    border-radius: 6px;\n    box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px;\n    position: fixed;\n    top: 50%;\n    left: 50%;\n    transform: translate(-50%, -50%);\n    width: 90vw;\n    max-width: 560px;\n    max-height: 85vh;\n    overflow: hidden;\n    padding: 16px 24px;\n    z-index: 1001;\n    outline: none;\n    animation: contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1);\n    display: flex;\n    flex-direction: column;\n}\n\n.dark .DialogContent {\n    background-color: #2a2a2a;\n    border-color: #40414f;\n    border-width: 1px;\n}\n\n.DialogContent._export {\n    background-color: #ffffff;\n}\n\n.dark .DialogContent._export {\n    background-color: #2a2a2a;\n}\n\n.DialogContent input[type=\"checkbox\"] {\n    border: none;\n    outline: none;\n    box-shadow: none;\n}\n\n.DialogTitle {\n    margin: 0 0 16px 0;\n    font-weight: 500;\n    color: #1a1523;\n    font-size: 20px;\n    flex-shrink: 0;\n}\n\n.DialogBody {\n    flex: 1;\n    min-height: 0;\n    overflow-y: auto;\n    overflow-x: hidden;\n}\n\n.dark .DialogTitle {\n    color: #fff;\n}\n\n.Button {\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    border-radius: 4px;\n    padding: 0 15px;\n    font-size: 15px;\n    line-height: 1;\n    height: 35px;\n}\n.Button.green {\n    background-color: #ddf3e4;\n    color: #18794e;\n}\n.Button.red {\n    background-color: #f9d9d9;\n    color: #a71d2a;\n}\n.Button.neutral {\n    background-color: transparent;\n    color: #6f6e77;\n    border: 1px solid #6f6e77;\n    font-size: 13px;\n    height: 26px;\n    padding: 0 8px;\n}\n.Button.green:hover {\n    background-color: #ccebd7;\n}\n.Button.neutral:hover {\n    background-color: rgba(111, 110, 119, 0.1);\n}\n.dark .Button.neutral {\n    color: #a0a0a8;\n    border-color: #a0a0a8;\n}\n.dark .Button.neutral:hover {\n    background-color: rgba(160, 160, 168, 0.1);\n}\n.Button:disabled {\n    opacity: 0.5;\n    color: #6f6e77;\n    background-color: #e0e0e0;\n    cursor: not-allowed;\n}\n.Button:disabled:hover {\n    background-color: #e0e0e0;\n}\n\n.IconButton {\n    font-family: inherit;\n    border-radius: 100%;\n    height: 25px;\n    width: 25px;\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    color: #6f6e77;\n}\n.IconButton:hover {\n    background-color: rgba(0, 0, 0, 0.06);\n}\n\n.CloseButton {\n    position: absolute;\n    top: 10px;\n    right: 10px;\n}\n\n.Fieldset {\n    display: flex;\n    gap: 20px;\n    align-items: center;\n    margin-bottom: 15px;\n}\n\n.Label {\n    font-size: 15px;\n    color: #1a1523;\n    min-width: 90px;\n    text-align: right;\n}\n\n.dark .Label {\n    color: #fff;\n}\n\n.Input {\n    width: 100%;\n    flex: 1;\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    border-radius: 4px;\n    padding: 0 10px;\n    font-size: 15px;\n    line-height: 1;\n    color: #000;\n    background-color: #fafafa;\n    box-shadow: 0 0 0 1px #6f6e77;\n    height: 35px;\n    outline: none;\n}\n\n.dark .Input {\n    background-color: #2f2f2f;\n    color: #fff;\n    box-shadow: 0 0 0 1px #6f6e77;\n}\n\n.Description {\n    font-size: 13px;\n    color: #5a5865;\n    text-align: right;\n    margin-bottom: 4px;\n}\n\n.dark .Description {\n    color: #bcbcbc;\n}\n\n.SelectSearch {\n    width: 100%;\n    padding: 8px 16px;\n    border: 1px solid #6f6e77;\n    border-bottom: none;\n    border-radius: 4px 4px 0 0;\n    background-color: transparent;\n    color: inherit;\n    font-size: 14px;\n    outline: none;\n    flex-shrink: 0;\n}\n.SelectSearch::placeholder {\n    color: #9ca3af;\n}\n\n.SelectToolbar {\n    display: flex;\n    align-items: center;\n    /* Minimum breathing room between the select-all label and the right\n       group once the ml-auto margin collapses under pressure */\n    gap: 12px;\n    padding: 12px 16px;\n    border-radius: 0;\n    border: 1px solid #6f6e77;\n    border-bottom: none;\n    flex-shrink: 0;\n}\n\n/* CJK labels wrap per-character when the row is squeezed — never shrink it */\n.SelectToolbar .CheckBoxLabel {\n    white-space: nowrap;\n    flex-shrink: 0;\n}\n\n.ProjectSelect .Select {\n    width: auto;\n}\n\n.SelectList {\n    position: relative;\n    width: 100%;\n    flex: 1;\n    min-height: 120px;\n    padding: 12px 16px;\n    overflow-x: hidden;\n    overflow-y: auto;\n    border: 1px solid #6f6e77;\n    border-radius: 0 0 4px 4px;\n    white-space: nowrap;\n}\n\n.SelectItem {\n    display: flex;\n    align-items: center;\n    gap: 6px;\n    overflow: hidden;\n}\n\n.SelectItem .CheckBoxLabel {\n    flex: 1;\n    min-width: 0;\n}\n\n.SelectItem .LabelText {\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n}\n\n.SelectItem label, .SelectItem input {\n    cursor: pointer;\n}\n\n.SelectItem span {\n    vertical-align: middle;\n}\n\n.SelectItemMeta {\n    flex-shrink: 0;\n    font-size: 0.7rem;\n    color: #9ca3af;\n    white-space: nowrap;\n    font-variant-numeric: tabular-nums;\n    min-width: 6.5rem;\n    text-align: right;\n}\n.SelectItemMetaActive {\n    color: #6b7280;\n    font-weight: 600;\n}\n.dark {\n    .SelectItemMetaActive { color: #d1d5db; }\n}\n\n/* ── Sortable column header row ── */\n.SelectListHeader {\n    display: flex;\n    align-items: center;\n    padding: 0 16px;\n    border: 1px solid #6f6e77;\n    border-bottom: none;\n    background: #f9fafb;\n    user-select: none;\n    flex-shrink: 0;\n}\n\n.dark {\n    .SelectListHeader { background: #1f2937; }\n}\n\n.SelectListHeaderCell {\n    flex-shrink: 0;\n    font-size: 0.68rem;\n    font-weight: 600;\n    color: #9ca3af;\n    letter-spacing: 0.03em;\n    text-transform: uppercase;\n    background: transparent;\n    border: none;\n    padding: 5px 4px;\n    cursor: pointer;\n    white-space: nowrap;\n    min-width: 6.5rem;\n    text-align: right;\n}\n.SelectListHeaderCell:hover { color: #374151; }\n.dark {\n    .SelectListHeaderCell:hover { color: #e5e7eb; }\n}\n.SelectListHeaderCellTitle {\n    flex: 1;\n    text-align: left;\n    padding-left: 28px; /* align with checkbox label */\n}\n.SelectListHeaderCellActive {\n    color: #2563eb;\n}\n.dark {\n    .SelectListHeaderCellActive { color: #60a5fa; }\n}\n\n\n@media (max-width: 480px) {\n    .DialogContent { max-height: 90vh; }\n    .SelectListHeaderCell:last-child { display: none; }\n    .SelectItemMeta:last-child { display: none; }\n    .ActionBar { justify-content: flex-end; }\n    .ActionBar > .Select { width: 100%; }\n    .ActionBar > .flex-grow { display: none; }\n}\n\n@keyframes contentShow {\n    from {\n        opacity: 0;\n        transform: translate(-50%, -48%) scale(0.96);\n    }\n    to {\n        opacity: 1;\n        transform: translate(-50%, -50%) scale(1);\n    }\n}\n");
	function useCollapsedSidebar(container, isMobile) {
		const [isCollapsed, setIsCollapsed] = h$4(false);
		p$6(() => {
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
		const [open, setOpen] = h$4(false);
		const [jsonOpen, setJsonOpen] = h$4(false);
		const [exportOpen, setExportOpen] = h$4(false);
		const [settingOpen, setSettingOpen] = h$4(false);
		const { format, enableTimestamp, timeStamp24H, enableMeta, exportMetaList } = useSettingContext();
		p$6(() => {
			if (enableTimestamp) document.body.setAttribute("data-time-format", timeStamp24H ? "24" : "12");
			else document.body.removeAttribute("data-time-format");
		}, [enableTimestamp, timeStamp24H]);
		const metaList = F$1(() => enableMeta ? exportMetaList : [], [enableMeta, exportMetaList]);
		const onClickText = T$4(() => exportToText(), []);
		const onClickPng = T$4(() => exportToPng(format), [format]);
		const onClickMarkdown = T$4(() => exportToMarkdown(format, metaList), [format, metaList]);
		const onClickHtml = T$4(() => exportToHtml(format, metaList), [format, metaList]);
		const onClickJSON = T$4(() => {
			setJsonOpen(true);
			return true;
		}, []);
		const onClickOfficialJSON = T$4(() => exportToJson(format), [format]);
		const onClickTavern = T$4(() => exportToTavern(format), [format]);
		const onClickOoba = T$4(() => exportToOoba(format), [format]);
		const isMobile = useWindowResize(() => window.innerWidth) < 768;
		const isCollapsedSidebar = useCollapsedSidebar(container, isMobile);
		const Portal = isMobile ? "div" : $cef8881cdc69808e$export$602eac185826482c;
		return o$5(k$3, { children: [
			isMobile && open && o$5("div", {
				className: "dropdown-backdrop animate-fadeIn",
				onClick: () => setOpen(false)
			}),
			o$5($cef8881cdc69808e$export$be92b6f5f03c0fe9, {
				openDelay: 0,
				closeDelay: 300,
				open,
				onOpenChange: setOpen,
				children: [o$5($cef8881cdc69808e$export$41fb9f06171c75f4, { children: o$5(MenuItem, {
					className: isCollapsedSidebar ? "ce-nav-trigger ce-nav-trigger-collapsed" : "ce-nav-trigger border-0 ms-2 me-1.5 mb-2",
					text: t("ExportHelper"),
					ariaLabel: t("ExportHelper"),
					icon: IconArrowRightFromBracket,
					onClick: () => {
						setOpen(true);
						return true;
					}
				}) }), o$5(Portal, {
					container: isMobile ? container : document.body,
					forceMount: open || jsonOpen || settingOpen || exportOpen,
					children: o$5($cef8881cdc69808e$export$7c6e2c02157bb7d2, {
						className: `
                        grid grid-cols-2
                        bg-menu
                        ce-card
                        transition-opacity duration-200
                        gap-1 py-2 px-1
                        ${isMobile ? "animate-slideUp" : "animate-fadeIn"}`,
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
							o$5(SettingDialog, {
								open: settingOpen,
								onOpenChange: setSettingOpen,
								children: o$5("div", {
									className: "row-full",
									children: o$5(MenuItem, {
										text: t("Setting"),
										icon: IconSetting
									})
								})
							}),
							o$5(MenuItem, {
								text: t("Copy Text"),
								successText: t("Copied!"),
								icon: IconCopy,
								className: "row-full",
								onClick: onClickText
							}),
							o$5(MenuItem, {
								text: t("Screenshot"),
								icon: IconCamera,
								className: "row-half",
								onClick: onClickPng
							}),
							o$5(MenuItem, {
								text: t("Markdown"),
								icon: IconMarkdown,
								className: "row-half",
								onClick: onClickMarkdown
							}),
							o$5(MenuItem, {
								text: t("HTML"),
								icon: FileCode,
								className: "row-half",
								onClick: onClickHtml
							}),
							o$5($5d3850c4d0b4e6c7$export$be92b6f5f03c0fe9, {
								open: jsonOpen,
								onOpenChange: setJsonOpen,
								children: [o$5($5d3850c4d0b4e6c7$export$41fb9f06171c75f4, {
									asChild: true,
									children: o$5(MenuItem, {
										text: t("JSON"),
										icon: IconJSON,
										className: "row-half",
										onClick: onClickJSON
									})
								}), o$5($5d3850c4d0b4e6c7$export$602eac185826482c, { children: [o$5($5d3850c4d0b4e6c7$export$c6fdb837b070b4ff, { className: "DialogOverlay" }), o$5($5d3850c4d0b4e6c7$export$7c6e2c02157bb7d2, {
									className: "DialogContent",
									style: { width: "320px" },
									children: [
										o$5($5d3850c4d0b4e6c7$export$f99233281efd08a0, {
											className: "DialogTitle",
											children: t("JSON")
										}),
										o$5(MenuItem, {
											text: t("OpenAI Official Format"),
											icon: IconCopy,
											className: "row-full",
											onClick: onClickOfficialJSON
										}),
										o$5(MenuItem, {
											text: "JSONL (TavernAI, SillyTavern)",
											icon: IconCopy,
											className: "row-full",
											onClick: onClickTavern
										}),
										o$5(MenuItem, {
											text: "Ooba (text-generation-webui)",
											icon: IconCopy,
											className: "row-full",
											onClick: onClickOoba
										})
									]
								})] })]
							}),
							o$5(ExportDialog, {
								format,
								open: exportOpen,
								onOpenChange: setExportOpen,
								children: o$5("div", {
									className: "row-full",
									children: o$5(MenuItem, {
										text: t("Export All"),
										icon: IconZip
									})
								})
							}),
							!isMobile && o$5($cef8881cdc69808e$export$21b07c8f274aebd5, {
								width: "16",
								height: "8",
								style: {
									"fill": "var(--ce-menu-secondary)",
									"stroke": "var(--ce-border-light)",
									"stoke-width": "2px"
								}
							})
						]
					})
				})]
			}),
			!isCollapsedSidebar && o$5(Divider, {})
		] });
	}
	function Menu({ container }) {
		return o$5(SettingProvider, { children: o$5(MenuInner, { container }) });
	}
	_css(".animate-fadeIn  {\n    animation: fadeIn .3s;\n}\n\n.animate-slideUp  {\n    animation: slideUp .3s;\n}\n\n.bg-blue-600 {\n    background-color: rgb(28 100 242);\n}\n\n.hover\\:bg-gray-500\\/10:hover {\n    background-color: hsla(0, 0%, 61%, .1)\n}\n\n.border-\\[\\#6f6e77\\] {\n    border-color: #6f6e77;\n}\n\n.cursor-help {\n    cursor: help;\n}\n\n.dark .dark\\:bg-white\\/5 {\n    background-color: rgb(255 255 255 / 5%);\n}\n\n.dark .dark\\:text-gray-200 {\n    color: rgb(229 231 235 / 1);\n}\n\n.dark .dark\\:text-gray-300 {\n    color: rgb(209 213 219 / 1);\n}\n\n.dark .dark\\:border-gray-\\[\\#86858d\\] {\n    border-color: #86858d;\n}\n\n.gap-x-1 {\n    column-gap: 0.25rem;\n}\n\n.h-2\\.5 {\n    height: 0.625rem;\n}\n\n.h-4 {\n    height: 1rem;\n}\n\n.inline-flex {\n    display: inline-flex;\n}\n\n.items-center {\n    align-items: center;\n}\n\n.ml-3 {\n    margin-left: 0.75rem;\n}\n\n.ml-4 {\n    margin-left: 1rem;\n}\n\n.mr-8 {\n    margin-right: 2rem;\n}\n\n.pb-0 {\n    padding-bottom: 0;\n}\n\n.pr-8 {\n    padding-right: 2rem;\n}\n\n.right-4 {\n    right: 1rem;\n}\n\n.rounded-full {\n    border-radius: 9999px;\n}\n\n.select-all {\n    user-select: all!important;\n}\n\n.shrink-0 {\n    flex-shrink: 0;\n}\n\n.min-w-0 {\n    min-width: 0;\n}\n\n.space-y-6>:not([hidden])~:not([hidden]) {\n    --tw-space-y-reverse: 0;\n    margin-top: calc(1.5rem * calc(1 - var(--tw-space-y-reverse)));\n    margin-bottom: calc(1.5rem * var(--tw-space-y-reverse));\n}\n\n.truncate {\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n}\n\n.whitespace-nowrap {\n    white-space: nowrap;\n}\n\n@media (min-width:768px) {\n    /* md */\n}\n\n@media (min-width:1024px) {\n    .lg\\:mt-0 {\n        margin-top: 0;\n    }\n\n    .lg\\:top-8 {\n        top: 2rem;\n    }\n}\n\n\n.toggle-switch {\n    position: relative;\n    outline: none;\n    background-color: rgb(229 231 235);\n    border: 1px solid rgb(107 114 128);\n    border-radius: 9999px;\n    cursor: pointer;\n    height: 20px;\n    width: 32px;\n}\n\n.dark .toggle-switch {\n    background-color: rgb(255 255 255 / 5%);\n    border-color: rgb(255 255 255 / 1);\n}\n\n.toggle-switch[data-state=\"checked\"] {\n    background-color: rgb(0 0 0);\n    border-color: rgb(0 0 0);\n}\n\n.dark .toggle-switch[data-state=\"checked\"] {\n    background-color: rgb(22 163 74);\n    border-color: rgb(22 163 74);\n}\n\n.toggle-switch-handle {\n    display: block;\n    background-color: rgb(255 255 255);\n    border-radius: 9999px;\n    height: 16px;\n    width: 16px;\n    transition: transform 0.1s;\n    will-change: transform;\n    transform: translateX(1px);\n}\n\n.toggle-switch-handle[data-state=\"checked\"] {\n    transform: translateX(14px);\n}\n\n.toggle-switch-handle:hover {\n    background-color: rgb(243 244 246);\n}\n\n.toggle-switch-label {\n    color: rgb(107 114 128);\n    margin-left: 0.75rem;\n    font-size: 0.875rem;\n    font-weight: 500;\n}\n\n.toggle-switch-label:hover {\n    color: rgb(71 85 105);\n}\n\n");
	var PROFILE_BUTTON_SELECTOR = "[data-testid=\"accounts-profile-button\"]";
	var SIDEBAR_SCROLL_SELECTOR = "[data-app-action-sidebar-scroll]";
	var AUTOMATIONS_SELECTOR = "[data-sidebar-destination=\"builtin:automations\"]";
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
				AUTOMATIONS_SELECTOR
			]) import_sentinel_umd.default.on(selector, syncNavMenu);
			syncNavMenu();
			setInterval(syncNavMenu, 1e3);
			if (isSharePage()) import_sentinel_umd.default.on(`div[role="presentation"] > .w-full > div >.flex.w-full`, (target) => {
				target.prepend(getMenuContainer());
			});
			let chatId = "";
			import_sentinel_umd.default.on("[role=\"presentation\"]", async () => {
				if (isSharePage()) return;
				const currentChatId = getChatIdFromUrl();
				if (!currentChatId || currentChatId === chatId) return;
				chatId = currentChatId;
				const { conversationNodes } = processConversation(await fetchConversation(chatId, false));
				const threadContents = Array.from(document.querySelectorAll("main [data-testid^=\"conversation-turn-\"] [data-message-id]"));
				if (threadContents.length === 0) return;
				threadContents.forEach((thread, index) => {
					const createTime = conversationNodes[index]?.message?.create_time;
					if (!createTime) return;
					const date = new Date(createTime * 1e3);
					const timestamp = document.createElement("time");
					timestamp.className = "w-full text-gray-500 dark:text-gray-400 text-sm text-right";
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
					thread.append(timestamp);
				});
			});
		});
	}
	function getMenuContainer() {
		const container = document.createElement("div");
		container.style.zIndex = "99";
		D$4(o$5(Menu, { container }), container);
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
		const profileFooters = Array.from(document.querySelectorAll(SIDEBAR_SCROLL_SELECTOR)).map((scrollRoot) => scrollRoot.nextElementSibling).filter((footer) => !!footer?.querySelector("button[aria-haspopup=\"menu\"]"));
		if (profileFooters.length > 0) return profileFooters.map((target) => ({
			target,
			insert: (container) => target.prepend(container)
		}));
		return Array.from(document.querySelectorAll(AUTOMATIONS_SELECTOR)).map((target) => ({
			target,
			insert: (container) => getNavMenuInsertionTarget(target).before(container)
		}));
	}
})(JSZip, window);
