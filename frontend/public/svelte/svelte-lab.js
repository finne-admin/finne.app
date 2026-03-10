var ks = Object.defineProperty;
var zs = (l, e, t) => e in l ? ks(l, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : l[e] = t;
var ze = (l, e, t) => zs(l, typeof e != "symbol" ? e + "" : e, t);
function I() {
}
const Jl = (l) => l;
function Ql(l) {
  return l();
}
function tl() {
  return /* @__PURE__ */ Object.create(null);
}
function ye(l) {
  l.forEach(Ql);
}
function Nt(l) {
  return typeof l == "function";
}
function W(l, e) {
  return l != l ? e == e : l !== e || l && typeof l == "object" || typeof l == "function";
}
let vt;
function rt(l, e) {
  return l === e ? !0 : (vt || (vt = document.createElement("a")), vt.href = e, l === vt.href);
}
function qs(l) {
  return Object.keys(l).length === 0;
}
function He(l) {
  return l ?? "";
}
function ll(l) {
  const e = typeof l == "string" && l.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);
  return e ? [parseFloat(e[1]), e[2] || "px"] : [
    /** @type {number} */
    l,
    "px"
  ];
}
const Kl = typeof window < "u";
let js = Kl ? () => window.performance.now() : () => Date.now(), It = Kl ? (l) => requestAnimationFrame(l) : I;
const Qe = /* @__PURE__ */ new Set();
function Wl(l) {
  Qe.forEach((e) => {
    e.c(l) || (Qe.delete(e), e.f());
  }), Qe.size !== 0 && It(Wl);
}
function Cs(l) {
  let e;
  return Qe.size === 0 && It(Wl), {
    promise: new Promise((t) => {
      Qe.add(e = { c: l, f: t });
    }),
    abort() {
      Qe.delete(e);
    }
  };
}
function n(l, e) {
  l.appendChild(e);
}
function ce(l, e, t) {
  const s = Dt(l);
  if (!s.getElementById(e)) {
    const i = d("style");
    i.id = e, i.textContent = t, Zl(s, i);
  }
}
function Dt(l) {
  if (!l) return document;
  const e = l.getRootNode ? l.getRootNode() : l.ownerDocument;
  return e && /** @type {ShadowRoot} */
  e.host ? (
    /** @type {ShadowRoot} */
    e
  ) : l.ownerDocument;
}
function Ss(l) {
  const e = d("style");
  return e.textContent = "/* empty */", Zl(Dt(l), e), e.sheet;
}
function Zl(l, e) {
  return n(
    /** @type {Document} */
    l.head || l,
    e
  ), e.sheet;
}
function E(l, e, t) {
  l.insertBefore(e, t || null);
}
function L(l) {
  l.parentNode && l.parentNode.removeChild(l);
}
function tt(l, e) {
  for (let t = 0; t < l.length; t += 1)
    l[t] && l[t].d(e);
}
function d(l) {
  return document.createElement(l);
}
function sl(l) {
  return document.createElementNS("http://www.w3.org/2000/svg", l);
}
function k(l) {
  return document.createTextNode(l);
}
function y() {
  return k(" ");
}
function Re() {
  return k("");
}
function X(l, e, t, s) {
  return l.addEventListener(e, t, s), () => l.removeEventListener(e, t, s);
}
function Et(l) {
  return function(e) {
    return e.preventDefault(), l.call(this, e);
  };
}
function Ls(l) {
  return function(e) {
    return e.stopPropagation(), l.call(this, e);
  };
}
function a(l, e, t) {
  t == null ? l.removeAttribute(e) : l.getAttribute(e) !== t && l.setAttribute(e, t);
}
function Es(l) {
  return Array.from(l.childNodes);
}
function M(l, e) {
  e = "" + e, l.data !== e && (l.data = /** @type {string} */
  e);
}
function Ee(l, e) {
  l.value = e ?? "";
}
function il(l, e, t) {
  for (let s = 0; s < l.options.length; s += 1) {
    const i = l.options[s];
    if (i.__value === e) {
      i.selected = !0;
      return;
    }
  }
  (!t || e !== void 0) && (l.selectedIndex = -1);
}
function Ms(l) {
  const e = l.querySelector(":checked");
  return e && e.__value;
}
function Ze(l, e, t) {
  l.classList.toggle(e, !!t);
}
function es(l, e, { bubbles: t = !1, cancelable: s = !1 } = {}) {
  return new CustomEvent(l, { detail: e, bubbles: t, cancelable: s });
}
function Ts(l) {
  const e = {};
  return l.childNodes.forEach(
    /** @param {Element} node */
    (t) => {
      e[t.slot || "default"] = !0;
    }
  ), e;
}
const bt = /* @__PURE__ */ new Map();
let mt = 0;
function As(l) {
  let e = 5381, t = l.length;
  for (; t--; ) e = (e << 5) - e ^ l.charCodeAt(t);
  return e >>> 0;
}
function Ns(l, e) {
  const t = { stylesheet: Ss(e), rules: {} };
  return bt.set(l, t), t;
}
function nl(l, e, t, s, i, o, r, c = 0) {
  const f = 16.666 / s;
  let m = `{
`;
  for (let x = 0; x <= 1; x += f) {
    const _ = e + (t - e) * o(x);
    m += x * 100 + `%{${r(_, 1 - _)}}
`;
  }
  const u = m + `100% {${r(t, 1 - t)}}
}`, b = `__svelte_${As(u)}_${c}`, p = Dt(l), { stylesheet: g, rules: v } = bt.get(p) || Ns(p, l);
  v[b] || (v[b] = !0, g.insertRule(`@keyframes ${b} ${u}`, g.cssRules.length));
  const h = l.style.animation || "";
  return l.style.animation = `${h ? `${h}, ` : ""}${b} ${s}ms linear ${i}ms 1 both`, mt += 1, b;
}
function Is(l, e) {
  const t = (l.style.animation || "").split(", "), s = t.filter(
    e ? (o) => o.indexOf(e) < 0 : (o) => o.indexOf("__svelte") === -1
    // remove all Svelte animations
  ), i = t.length - s.length;
  i && (l.style.animation = s.join(", "), mt -= i, mt || Ds());
}
function Ds() {
  It(() => {
    mt || (bt.forEach((l) => {
      const { ownerNode: e } = l.stylesheet;
      e && L(e);
    }), bt.clear());
  });
}
let ot;
function nt(l) {
  ot = l;
}
function ts() {
  if (!ot) throw new Error("Function called outside component initialization");
  return ot;
}
function Rs(l) {
  ts().$$.on_mount.push(l);
}
function Ae() {
  const l = ts();
  return (e, t, { cancelable: s = !1 } = {}) => {
    const i = l.$$.callbacks[e];
    if (i) {
      const o = es(
        /** @type {string} */
        e,
        t,
        { cancelable: s }
      );
      return i.slice().forEach((r) => {
        r.call(l, o);
      }), !o.defaultPrevented;
    }
    return !0;
  };
}
function Ps(l, e) {
  const t = l.$$.callbacks[e.type];
  t && t.slice().forEach((s) => s.call(this, e));
}
const Je = [], rl = [];
let Ke = [];
const ol = [], Ys = /* @__PURE__ */ Promise.resolve();
let Mt = !1;
function Xs() {
  Mt || (Mt = !0, Ys.then(z));
}
function Te(l) {
  Ke.push(l);
}
const St = /* @__PURE__ */ new Set();
let Ge = 0;
function z() {
  if (Ge !== 0)
    return;
  const l = ot;
  do {
    try {
      for (; Ge < Je.length; ) {
        const e = Je[Ge];
        Ge++, nt(e), Os(e.$$);
      }
    } catch (e) {
      throw Je.length = 0, Ge = 0, e;
    }
    for (nt(null), Je.length = 0, Ge = 0; rl.length; ) rl.pop()();
    for (let e = 0; e < Ke.length; e += 1) {
      const t = Ke[e];
      St.has(t) || (St.add(t), t());
    }
    Ke.length = 0;
  } while (Je.length);
  for (; ol.length; )
    ol.pop()();
  Mt = !1, St.clear(), nt(l);
}
function Os(l) {
  if (l.fragment !== null) {
    l.update(), ye(l.before_update);
    const e = l.dirty;
    l.dirty = [-1], l.fragment && l.fragment.p(l.ctx, e), l.after_update.forEach(Te);
  }
}
function Bs(l) {
  const e = [], t = [];
  Ke.forEach((s) => l.indexOf(s) === -1 ? e.push(s) : t.push(s)), t.forEach((s) => s()), Ke = e;
}
let it;
function Hs() {
  return it || (it = Promise.resolve(), it.then(() => {
    it = null;
  })), it;
}
function Lt(l, e, t) {
  l.dispatchEvent(es(`${e ? "intro" : "outro"}${t}`));
}
const gt = /* @__PURE__ */ new Set();
let Me;
function ls() {
  Me = {
    r: 0,
    c: [],
    p: Me
    // parent group
  };
}
function ss() {
  Me.r || ye(Me.c), Me = Me.p;
}
function We(l, e) {
  l && l.i && (gt.delete(l), l.i(e));
}
function Tt(l, e, t, s) {
  if (l && l.o) {
    if (gt.has(l)) return;
    gt.add(l), Me.c.push(() => {
      gt.delete(l), s && (t && l.d(1), s());
    }), l.o(e);
  } else s && s();
}
const Fs = { duration: 0 };
function De(l, e, t, s) {
  let o = e(l, t, { direction: "both" }), r = s ? 0 : 1, c = null, f = null, m = null, u;
  function b() {
    m && Is(l, m);
  }
  function p(v, h) {
    const x = (
      /** @type {Program['d']} */
      v.b - r
    );
    return h *= Math.abs(x), {
      a: r,
      b: v.b,
      d: x,
      duration: h,
      start: v.start,
      end: v.start + h,
      group: v.group
    };
  }
  function g(v) {
    const {
      delay: h = 0,
      duration: x = 300,
      easing: _ = Jl,
      tick: j = I,
      css: w
    } = o || Fs, C = {
      start: js() + h,
      b: v
    };
    v || (C.group = Me, Me.r += 1), "inert" in l && (v ? u !== void 0 && (l.inert = u) : (u = /** @type {HTMLElement} */
    l.inert, l.inert = !0)), c || f ? f = C : (w && (b(), m = nl(l, r, v, x, h, _, w)), v && j(0, 1), c = p(C, x), Te(() => Lt(l, v, "start")), Cs((T) => {
      if (f && T > f.start && (c = p(f, x), f = null, Lt(l, c.b, "start"), w && (b(), m = nl(
        l,
        r,
        c.b,
        c.duration,
        0,
        _,
        o.css
      ))), c) {
        if (T >= c.end)
          j(r = c.b, 1 - r), Lt(l, c.b, "end"), f || (c.b ? b() : --c.group.r || ye(c.group.c)), c = null;
        else if (T >= c.start) {
          const q = T - c.start;
          r = c.a + c.d * _(q / c.duration), j(r, 1 - r);
        }
      }
      return !!(c || f);
    }));
  }
  return {
    run(v) {
      Nt(o) ? Hs().then(() => {
        o = o({ direction: v ? "in" : "out" }), g(v);
      }) : g(v);
    },
    end() {
      b(), c = f = null;
    }
  };
}
function ne(l) {
  return (l == null ? void 0 : l.length) !== void 0 ? l : Array.from(l);
}
function xt(l, e) {
  l.d(1), e.delete(l.key);
}
function yt(l, e, t, s, i, o, r, c, f, m, u, b) {
  let p = l.length, g = o.length, v = p;
  const h = {};
  for (; v--; ) h[l[v].key] = v;
  const x = [], _ = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), w = [];
  for (v = g; v--; ) {
    const S = b(i, o, v), D = t(S);
    let Y = r.get(D);
    Y ? w.push(() => Y.p(S, e)) : (Y = m(D, S), Y.c()), _.set(D, x[v] = Y), D in h && j.set(D, Math.abs(v - h[D]));
  }
  const C = /* @__PURE__ */ new Set(), T = /* @__PURE__ */ new Set();
  function q(S) {
    We(S, 1), S.m(c, u), r.set(S.key, S), u = S.first, g--;
  }
  for (; p && g; ) {
    const S = x[g - 1], D = l[p - 1], Y = S.key, A = D.key;
    S === D ? (u = S.first, p--, g--) : _.has(A) ? !r.has(Y) || C.has(Y) ? q(S) : T.has(A) ? p-- : j.get(Y) > j.get(A) ? (T.add(Y), q(S)) : (C.add(A), p--) : (f(D, r), p--);
  }
  for (; p--; ) {
    const S = l[p];
    _.has(S.key) || f(S, r);
  }
  for (; g; ) q(x[g - 1]);
  return ye(w), x;
}
function Vs(l, e, t) {
  const { fragment: s, after_update: i } = l.$$;
  s && s.m(e, t), Te(() => {
    const o = l.$$.on_mount.map(Ql).filter(Nt);
    l.$$.on_destroy ? l.$$.on_destroy.push(...o) : ye(o), l.$$.on_mount = [];
  }), i.forEach(Te);
}
function $s(l, e) {
  const t = l.$$;
  t.fragment !== null && (Bs(t.after_update), ye(t.on_destroy), t.fragment && t.fragment.d(e), t.on_destroy = t.fragment = null, t.ctx = []);
}
function Us(l, e) {
  l.$$.dirty[0] === -1 && (Je.push(l), Xs(), l.$$.dirty.fill(0)), l.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function fe(l, e, t, s, i, o, r = null, c = [-1]) {
  const f = ot;
  nt(l);
  const m = l.$$ = {
    fragment: null,
    ctx: [],
    // state
    props: o,
    update: I,
    not_equal: i,
    bound: tl(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(e.context || (f ? f.$$.context : [])),
    // everything else
    callbacks: tl(),
    dirty: c,
    skip_bound: !1,
    root: e.target || f.$$.root
  };
  r && r(m.root);
  let u = !1;
  if (m.ctx = t ? t(l, e.props || {}, (b, p, ...g) => {
    const v = g.length ? g[0] : p;
    return m.ctx && i(m.ctx[b], m.ctx[b] = v) && (!m.skip_bound && m.bound[b] && m.bound[b](v), u && Us(l, b)), p;
  }) : [], m.update(), u = !0, ye(m.before_update), m.fragment = s ? s(m.ctx) : !1, e.target) {
    if (e.hydrate) {
      const b = Es(e.target);
      m.fragment && m.fragment.l(b), b.forEach(L);
    } else
      m.fragment && m.fragment.c();
    e.intro && We(l.$$.fragment), Vs(l, e.target, e.anchor), z();
  }
  nt(f);
}
let is;
typeof HTMLElement == "function" && (is = class extends HTMLElement {
  constructor(e, t, s) {
    super();
    /** The Svelte component constructor */
    ze(this, "$$ctor");
    /** Slots */
    ze(this, "$$s");
    /** The Svelte component instance */
    ze(this, "$$c");
    /** Whether or not the custom element is connected */
    ze(this, "$$cn", !1);
    /** Component props data */
    ze(this, "$$d", {});
    /** `true` if currently in the process of reflecting component props back to attributes */
    ze(this, "$$r", !1);
    /** @type {Record<string, CustomElementPropDefinition>} Props definition (name, reflected, type etc) */
    ze(this, "$$p_d", {});
    /** @type {Record<string, Function[]>} Event listeners */
    ze(this, "$$l", {});
    /** @type {Map<Function, Function>} Event listener unsubscribe functions */
    ze(this, "$$l_u", /* @__PURE__ */ new Map());
    this.$$ctor = e, this.$$s = t, s && this.attachShadow({ mode: "open" });
  }
  addEventListener(e, t, s) {
    if (this.$$l[e] = this.$$l[e] || [], this.$$l[e].push(t), this.$$c) {
      const i = this.$$c.$on(e, t);
      this.$$l_u.set(t, i);
    }
    super.addEventListener(e, t, s);
  }
  removeEventListener(e, t, s) {
    if (super.removeEventListener(e, t, s), this.$$c) {
      const i = this.$$l_u.get(t);
      i && (i(), this.$$l_u.delete(t));
    }
    if (this.$$l[e]) {
      const i = this.$$l[e].indexOf(t);
      i >= 0 && this.$$l[e].splice(i, 1);
    }
  }
  async connectedCallback() {
    if (this.$$cn = !0, !this.$$c) {
      let t = function(r) {
        return () => {
          let c;
          return {
            c: function() {
              c = d("slot"), r !== "default" && a(c, "name", r);
            },
            /**
             * @param {HTMLElement} target
             * @param {HTMLElement} [anchor]
             */
            m: function(u, b) {
              E(u, c, b);
            },
            d: function(u) {
              u && L(c);
            }
          };
        };
      };
      var e = t;
      if (await Promise.resolve(), !this.$$cn || this.$$c)
        return;
      const s = {}, i = Ts(this);
      for (const r of this.$$s)
        r in i && (s[r] = [t(r)]);
      for (const r of this.attributes) {
        const c = this.$$g_p(r.name);
        c in this.$$d || (this.$$d[c] = ht(c, r.value, this.$$p_d, "toProp"));
      }
      for (const r in this.$$p_d)
        !(r in this.$$d) && this[r] !== void 0 && (this.$$d[r] = this[r], delete this[r]);
      this.$$c = new this.$$ctor({
        target: this.shadowRoot || this,
        props: {
          ...this.$$d,
          $$slots: s,
          $$scope: {
            ctx: []
          }
        }
      });
      const o = () => {
        this.$$r = !0;
        for (const r in this.$$p_d)
          if (this.$$d[r] = this.$$c.$$.ctx[this.$$c.$$.props[r]], this.$$p_d[r].reflect) {
            const c = ht(
              r,
              this.$$d[r],
              this.$$p_d,
              "toAttribute"
            );
            c == null ? this.removeAttribute(this.$$p_d[r].attribute || r) : this.setAttribute(this.$$p_d[r].attribute || r, c);
          }
        this.$$r = !1;
      };
      this.$$c.$$.after_update.push(o), o();
      for (const r in this.$$l)
        for (const c of this.$$l[r]) {
          const f = this.$$c.$on(r, c);
          this.$$l_u.set(c, f);
        }
      this.$$l = {};
    }
  }
  // We don't need this when working within Svelte code, but for compatibility of people using this outside of Svelte
  // and setting attributes through setAttribute etc, this is helpful
  attributeChangedCallback(e, t, s) {
    var i;
    this.$$r || (e = this.$$g_p(e), this.$$d[e] = ht(e, s, this.$$p_d, "toProp"), (i = this.$$c) == null || i.$set({ [e]: this.$$d[e] }));
  }
  disconnectedCallback() {
    this.$$cn = !1, Promise.resolve().then(() => {
      !this.$$cn && this.$$c && (this.$$c.$destroy(), this.$$c = void 0);
    });
  }
  $$g_p(e) {
    return Object.keys(this.$$p_d).find(
      (t) => this.$$p_d[t].attribute === e || !this.$$p_d[t].attribute && t.toLowerCase() === e
    ) || e;
  }
});
function ht(l, e, t, s) {
  var o;
  const i = (o = t[l]) == null ? void 0 : o.type;
  if (e = i === "Boolean" && typeof e != "boolean" ? e != null : e, !s || !t[l])
    return e;
  if (s === "toAttribute")
    switch (i) {
      case "Object":
      case "Array":
        return e == null ? null : JSON.stringify(e);
      case "Boolean":
        return e ? "" : null;
      case "Number":
        return e ?? null;
      default:
        return e;
    }
  else
    switch (i) {
      case "Object":
      case "Array":
        return e && JSON.parse(e);
      case "Boolean":
        return e;
      case "Number":
        return e != null ? +e : e;
      default:
        return e;
    }
}
function de(l, e, t, s, i, o) {
  let r = class extends is {
    constructor() {
      super(l, t, i), this.$$p_d = e;
    }
    static get observedAttributes() {
      return Object.keys(e).map(
        (c) => (e[c].attribute || c).toLowerCase()
      );
    }
  };
  return Object.keys(e).forEach((c) => {
    Object.defineProperty(r.prototype, c, {
      get() {
        return this.$$c && c in this.$$c ? this.$$c[c] : this.$$d[c];
      },
      set(f) {
        var m;
        f = ht(c, f, e), this.$$d[c] = f, (m = this.$$c) == null || m.$set({ [c]: f });
      }
    });
  }), s.forEach((c) => {
    Object.defineProperty(r.prototype, c, {
      get() {
        var f;
        return (f = this.$$c) == null ? void 0 : f[c];
      }
    });
  }), l.element = /** @type {any} */
  r, r;
}
class ue {
  constructor() {
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    ze(this, "$$");
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    ze(this, "$$set");
  }
  /** @returns {void} */
  $destroy() {
    $s(this, 1), this.$destroy = I;
  }
  /**
   * @template {Extract<keyof Events, string>} K
   * @param {K} type
   * @param {((e: Events[K]) => void) | null | undefined} callback
   * @returns {() => void}
   */
  $on(e, t) {
    if (!Nt(t))
      return I;
    const s = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
    return s.push(t), () => {
      const i = s.indexOf(t);
      i !== -1 && s.splice(i, 1);
    };
  }
  /**
   * @param {Partial<Props>} props
   * @returns {void}
   */
  $set(e) {
    this.$$set && !qs(e) && (this.$$.skip_bound = !0, this.$$set(e), this.$$.skip_bound = !1);
  }
}
const Gs = "4";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(Gs);
function Js(l) {
  ce(l, "svelte-1tevv97", '.card.svelte-1tevv97{border-radius:14px;border:1px solid #e2e8f0;padding:16px;display:grid;gap:12px;font-family:"Figtree", system-ui, sans-serif;background:#ffffff;box-shadow:0 12px 24px rgba(15, 23, 42, 0.08)}.label.svelte-1tevv97{font-size:14px;color:#0f172a;margin:0}.count.svelte-1tevv97{font-weight:600;font-size:20px;color:#0f172a;margin:0}button.svelte-1tevv97{border:0;border-radius:10px;padding:10px 12px;background:#10b981;color:white;cursor:pointer;font-weight:600}button.svelte-1tevv97:hover{background:#059669}');
}
function Qs(l) {
  let e, t, s, i, o, r, c, f, m, u, b, p;
  return {
    c() {
      e = d("div"), t = d("p"), s = k("Hola "), i = k(
        /*name*/
        l[0]
      ), o = y(), r = d("p"), c = k("Count: "), f = k(
        /*count*/
        l[1]
      ), m = y(), u = d("button"), u.textContent = "Emitir evento", a(t, "class", "label svelte-1tevv97"), a(r, "class", "count svelte-1tevv97"), a(u, "type", "button"), a(u, "class", "svelte-1tevv97"), a(e, "class", "card svelte-1tevv97");
    },
    m(g, v) {
      E(g, e, v), n(e, t), n(t, s), n(t, i), n(e, o), n(e, r), n(r, c), n(r, f), n(e, m), n(e, u), b || (p = X(
        u,
        "click",
        /*notify*/
        l[2]
      ), b = !0);
    },
    p(g, [v]) {
      v & /*name*/
      1 && M(
        i,
        /*name*/
        g[0]
      ), v & /*count*/
      2 && M(
        f,
        /*count*/
        g[1]
      );
    },
    i: I,
    o: I,
    d(g) {
      g && L(e), b = !1, p();
    }
  };
}
function Ks(l, e, t) {
  let { name: s = "Ada" } = e, { count: i = 2 } = e;
  const o = Ae(), r = () => {
    o("ping", { from: "svelte", count: i });
  };
  return l.$$set = (c) => {
    "name" in c && t(0, s = c.name), "count" in c && t(1, i = c.count);
  }, [s, i, r];
}
class ns extends ue {
  constructor(e) {
    super(), fe(this, e, Ks, Qs, W, { name: 0, count: 1 }, Js);
  }
  get name() {
    return this.$$.ctx[0];
  }
  set name(e) {
    this.$$set({ name: e }), z();
  }
  get count() {
    return this.$$.ctx[1];
  }
  set count(e) {
    this.$$set({ count: e }), z();
  }
}
de(ns, { name: {}, count: {} }, [], [], !0);
function Ws(l) {
  ce(l, "svelte-5733sx", ".card.svelte-5733sx{position:relative;overflow:hidden;border-radius:20px;border:1px solid #d1fae5;background:linear-gradient(145deg, #ffffff, #ecfdf5);padding:20px;min-height:140px;box-shadow:0 16px 36px rgba(15, 23, 42, 0.12)}.glow.svelte-5733sx{position:absolute;inset:-40%;background:radial-gradient(circle at 30% 20%, rgba(16, 185, 129, 0.3), transparent 55%);opacity:0.7;filter:blur(8px)}.content.svelte-5733sx{position:relative;display:grid;gap:8px;color:#0f172a}.title.svelte-5733sx{font-size:16px;font-weight:600;margin:0}.subtitle.svelte-5733sx{font-size:12px;margin:0;color:#64748b}.metrics.svelte-5733sx{margin-top:12px;display:flex;justify-content:space-between;font-size:12px;color:#0f172a}.orbit.svelte-5733sx{position:absolute;inset:-30%;border-radius:999px;border:1px dashed rgba(16, 185, 129, 0.3);animation:svelte-5733sx-orbit 6s linear infinite;opacity:var(--orbit-alpha)}.satellite-orbit.svelte-5733sx{position:absolute;inset:-30%;border-radius:999px;animation:svelte-5733sx-orbit 6s linear infinite}.satellite.svelte-5733sx{position:absolute;width:10px;height:10px;border-radius:999px;background:#34d399;box-shadow:0 0 12px rgba(16, 185, 129, 0.6);top:50%;left:50%;transform:translate(-50%, -50%) translateY(-78px)}@keyframes svelte-5733sx-orbit{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}");
}
function Zs(l) {
  let e, t, s, i, o, r, c, f, m, u, b, p, g, v, h, x, _, j, w, C, T, q, S;
  return {
    c() {
      e = d("div"), t = d("div"), s = y(), i = d("div"), o = d("p"), r = k(
        /*title*/
        l[0]
      ), c = y(), f = d("p"), m = k(
        /*subtitle*/
        l[1]
      ), u = y(), b = d("div"), p = d("span"), p.textContent = "Flow", g = y(), v = d("span"), h = k(
        /*flow*/
        l[3]
      ), x = k("%"), _ = y(), j = d("div"), j.innerHTML = '<div class="satellite svelte-5733sx"></div>', w = y(), C = d("div"), a(t, "class", "glow svelte-5733sx"), a(o, "class", "title svelte-5733sx"), a(f, "class", "subtitle svelte-5733sx"), a(b, "class", "metrics svelte-5733sx"), a(i, "class", "content svelte-5733sx"), a(j, "class", "satellite-orbit svelte-5733sx"), a(C, "class", "orbit svelte-5733sx"), a(e, "class", "card svelte-5733sx"), a(e, "style", T = `--orbit-alpha:${/*intensity*/
      l[2]}`), a(e, "role", "button"), a(e, "tabindex", "0");
    },
    m(D, Y) {
      E(D, e, Y), n(e, t), n(e, s), n(e, i), n(i, o), n(o, r), n(i, c), n(i, f), n(f, m), n(i, u), n(i, b), n(b, p), n(b, g), n(b, v), n(v, h), n(v, x), n(e, _), n(e, j), n(e, w), n(e, C), q || (S = [
        X(
          e,
          "mouseenter",
          /*handleHover*/
          l[4]
        ),
        X(
          e,
          "focus",
          /*handleHover*/
          l[4]
        ),
        X(
          e,
          "keydown",
          /*keydown_handler*/
          l[5]
        )
      ], q = !0);
    },
    p(D, [Y]) {
      Y & /*title*/
      1 && M(
        r,
        /*title*/
        D[0]
      ), Y & /*subtitle*/
      2 && M(
        m,
        /*subtitle*/
        D[1]
      ), Y & /*flow*/
      8 && M(
        h,
        /*flow*/
        D[3]
      ), Y & /*intensity*/
      4 && T !== (T = `--orbit-alpha:${/*intensity*/
      D[2]}`) && a(e, "style", T);
    },
    i: I,
    o: I,
    d(D) {
      D && L(e), q = !1, ye(S);
    }
  };
}
function ei(l, e, t) {
  let { title: s = "Focus Ring" } = e, { subtitle: i = "Anillo orbital" } = e, { intensity: o = 0.6 } = e, { flow: r = 78 } = e;
  const c = Ae(), f = () => {
    c("hover", { title: s });
  }, m = (u) => {
    (u.key === "Enter" || u.key === " ") && f();
  };
  return l.$$set = (u) => {
    "title" in u && t(0, s = u.title), "subtitle" in u && t(1, i = u.subtitle), "intensity" in u && t(2, o = u.intensity), "flow" in u && t(3, r = u.flow);
  }, [s, i, o, r, f, m];
}
class rs extends ue {
  constructor(e) {
    super(), fe(
      this,
      e,
      ei,
      Zs,
      W,
      {
        title: 0,
        subtitle: 1,
        intensity: 2,
        flow: 3
      },
      Ws
    );
  }
  get title() {
    return this.$$.ctx[0];
  }
  set title(e) {
    this.$$set({ title: e }), z();
  }
  get subtitle() {
    return this.$$.ctx[1];
  }
  set subtitle(e) {
    this.$$set({ subtitle: e }), z();
  }
  get intensity() {
    return this.$$.ctx[2];
  }
  set intensity(e) {
    this.$$set({ intensity: e }), z();
  }
  get flow() {
    return this.$$.ctx[3];
  }
  set flow(e) {
    this.$$set({ flow: e }), z();
  }
}
de(rs, { title: {}, subtitle: {}, intensity: {}, flow: {} }, [], [], !0);
function ti(l) {
  ce(l, "svelte-1vzxgvk", ".badge.svelte-1vzxgvk.svelte-1vzxgvk{display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border-radius:999px;border:1px solid transparent;font-size:12px;font-weight:600;letter-spacing:0.02em;cursor:pointer;background:#ecfdf5;color:#065f46}.badge.emerald.svelte-1vzxgvk.svelte-1vzxgvk{border-color:rgba(16, 185, 129, 0.35)}.dot.svelte-1vzxgvk.svelte-1vzxgvk{width:8px;height:8px;border-radius:999px;background:currentColor;box-shadow:0 0 0 rgba(16, 185, 129, 0.6)}.active.svelte-1vzxgvk .dot.svelte-1vzxgvk{animation:svelte-1vzxgvk-pulse 1.8s ease-in-out infinite}@keyframes svelte-1vzxgvk-pulse{0%{box-shadow:0 0 0 0 rgba(16, 185, 129, 0.6)}70%{box-shadow:0 0 0 12px rgba(16, 185, 129, 0)}100%{box-shadow:0 0 0 0 rgba(16, 185, 129, 0)}}");
}
function li(l) {
  let e, t, s, i, o, r, c;
  return {
    c() {
      e = d("button"), t = d("span"), s = y(), i = k(
        /*label*/
        l[1]
      ), a(t, "class", "dot svelte-1vzxgvk"), a(e, "class", o = He(`badge ${/*tone*/
      l[2]} ${/*active*/
      l[0] ? "active" : ""}`) + " svelte-1vzxgvk"), a(e, "type", "button");
    },
    m(f, m) {
      E(f, e, m), n(e, t), n(e, s), n(e, i), r || (c = X(
        e,
        "click",
        /*toggle*/
        l[3]
      ), r = !0);
    },
    p(f, [m]) {
      m & /*label*/
      2 && M(
        i,
        /*label*/
        f[1]
      ), m & /*tone, active*/
      5 && o !== (o = He(`badge ${/*tone*/
      f[2]} ${/*active*/
      f[0] ? "active" : ""}`) + " svelte-1vzxgvk") && a(e, "class", o);
    },
    i: I,
    o: I,
    d(f) {
      f && L(e), r = !1, c();
    }
  };
}
function si(l, e, t) {
  let { label: s = "Live" } = e, { tone: i = "emerald" } = e, { active: o = !0 } = e;
  const r = Ae(), c = () => {
    t(0, o = !o), r("toggle", { active: o });
  };
  return l.$$set = (f) => {
    "label" in f && t(1, s = f.label), "tone" in f && t(2, i = f.tone), "active" in f && t(0, o = f.active);
  }, [o, s, i, c];
}
class os extends ue {
  constructor(e) {
    super(), fe(this, e, si, li, W, { label: 1, tone: 2, active: 0 }, ti);
  }
  get label() {
    return this.$$.ctx[1];
  }
  set label(e) {
    this.$$set({ label: e }), z();
  }
  get tone() {
    return this.$$.ctx[2];
  }
  set tone(e) {
    this.$$set({ tone: e }), z();
  }
  get active() {
    return this.$$.ctx[0];
  }
  set active(e) {
    this.$$set({ active: e }), z();
  }
}
de(os, { label: {}, tone: {}, active: { type: "Boolean" } }, [], [], !0);
function ii(l) {
  ce(l, "svelte-1io8dtn", ".ripple.svelte-1io8dtn{position:relative;overflow:hidden;padding:12px 20px;border-radius:14px;border:none;background:var(--tone);color:#ffffff;font-weight:600;cursor:pointer;box-shadow:0 16px 28px rgba(16, 185, 129, 0.25)}.label.svelte-1io8dtn{position:relative;z-index:1}.wave.svelte-1io8dtn{position:absolute;width:20px;height:20px;border-radius:999px;background:rgba(255, 255, 255, 0.45);transform:translate(-50%, -50%);animation:svelte-1io8dtn-ripple 0.8s ease-out forwards}@keyframes svelte-1io8dtn-ripple{from{opacity:0.7;transform:translate(-50%, -50%) scale(0)}to{opacity:0;transform:translate(-50%, -50%) scale(8)}}");
}
function al(l, e, t) {
  const s = l.slice();
  return s[7] = e[t], s;
}
function cl(l, e) {
  let t, s, i, o;
  function r() {
    return (
      /*animationend_handler*/
      e[5](
        /*ripple*/
        e[7]
      )
    );
  }
  return {
    key: l,
    first: null,
    c() {
      t = d("span"), a(t, "class", "wave svelte-1io8dtn"), a(t, "style", s = `left:${/*ripple*/
      e[7].x}px; top:${/*ripple*/
      e[7].y}px;`), this.first = t;
    },
    m(c, f) {
      E(c, t, f), i || (o = X(t, "animationend", r), i = !0);
    },
    p(c, f) {
      e = c, f & /*ripples*/
      4 && s !== (s = `left:${/*ripple*/
      e[7].x}px; top:${/*ripple*/
      e[7].y}px;`) && a(t, "style", s);
    },
    d(c) {
      c && L(t), i = !1, o();
    }
  };
}
function ni(l) {
  let e, t = [], s = /* @__PURE__ */ new Map(), i, o, r, c, f, m, u = ne(
    /*ripples*/
    l[2]
  );
  const b = (p) => (
    /*ripple*/
    p[7].id
  );
  for (let p = 0; p < u.length; p += 1) {
    let g = al(l, u, p), v = b(g);
    s.set(v, t[p] = cl(v, g));
  }
  return {
    c() {
      e = d("button");
      for (let p = 0; p < t.length; p += 1)
        t[p].c();
      i = y(), o = d("span"), r = k(
        /*label*/
        l[0]
      ), a(o, "class", "label svelte-1io8dtn"), a(e, "class", "ripple svelte-1io8dtn"), a(e, "type", "button"), a(e, "style", c = `--tone:${/*tone*/
      l[1]}`);
    },
    m(p, g) {
      E(p, e, g);
      for (let v = 0; v < t.length; v += 1)
        t[v] && t[v].m(e, null);
      n(e, i), n(e, o), n(o, r), f || (m = X(
        e,
        "click",
        /*handleClick*/
        l[3]
      ), f = !0);
    },
    p(p, [g]) {
      g & /*ripples, removeRipple*/
      20 && (u = ne(
        /*ripples*/
        p[2]
      ), t = yt(t, g, b, 1, p, u, s, e, xt, cl, i, al)), g & /*label*/
      1 && M(
        r,
        /*label*/
        p[0]
      ), g & /*tone*/
      2 && c !== (c = `--tone:${/*tone*/
      p[1]}`) && a(e, "style", c);
    },
    i: I,
    o: I,
    d(p) {
      p && L(e);
      for (let g = 0; g < t.length; g += 1)
        t[g].d();
      f = !1, m();
    }
  };
}
function ri(l, e, t) {
  let { label: s = "Lanzar onda" } = e, { tone: i = "#10b981" } = e;
  const o = Ae();
  let r = [];
  const c = (u) => {
    const b = u.currentTarget.getBoundingClientRect(), p = u.clientX - b.left, g = u.clientY - b.top, v = Math.random().toString(36).slice(2);
    t(2, r = [...r, { id: v, x: p, y: g }]), o("ripple", { x: p, y: g });
  }, f = (u) => {
    t(2, r = r.filter((b) => b.id !== u));
  }, m = (u) => f(u.id);
  return l.$$set = (u) => {
    "label" in u && t(0, s = u.label), "tone" in u && t(1, i = u.tone);
  }, [s, i, r, c, f, m];
}
class as extends ue {
  constructor(e) {
    super(), fe(this, e, ri, ni, W, { label: 0, tone: 1 }, ii);
  }
  get label() {
    return this.$$.ctx[0];
  }
  set label(e) {
    this.$$set({ label: e }), z();
  }
  get tone() {
    return this.$$.ctx[1];
  }
  set tone(e) {
    this.$$set({ tone: e }), z();
  }
}
de(as, { label: {}, tone: {} }, [], [], !0);
function oi(l) {
  ce(l, "svelte-1jr61rp", ".list.svelte-1jr61rp{border-radius:18px;border:1px solid #e2e8f0;background:#ffffff;padding:16px;display:grid;gap:16px}.header.svelte-1jr61rp{display:flex;justify-content:space-between;align-items:center}.title.svelte-1jr61rp{margin:0;font-size:14px;font-weight:600;color:#0f172a}.subtitle.svelte-1jr61rp{margin:0;font-size:11px;color:#94a3b8}button.svelte-1jr61rp{border:1px solid #d1fae5;background:#ecfdf5;color:#065f46;font-size:12px;padding:6px 10px;border-radius:10px;cursor:pointer}.items.svelte-1jr61rp{display:grid;gap:10px}.item.svelte-1jr61rp{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-radius:12px;background:#f8fafc;color:#0f172a;font-size:13px;animation:svelte-1jr61rp-slide-in 0.5s ease forwards;opacity:0;transform:translateY(6px)}.score.svelte-1jr61rp{font-weight:600}@keyframes svelte-1jr61rp-slide-in{to{opacity:1;transform:translateY(0)}}");
}
function fl(l, e, t) {
  const s = l.slice();
  return s[7] = e[t], s[9] = t, s;
}
function dl(l, e) {
  let t, s, i = (
    /*item*/
    e[7].title + ""
  ), o, r, c, f = (
    /*item*/
    e[7].score + ""
  ), m, u, b, p;
  return {
    key: l,
    first: null,
    c() {
      t = d("div"), s = d("span"), o = k(i), r = y(), c = d("span"), m = k(f), u = k("%"), b = y(), a(c, "class", "score svelte-1jr61rp"), a(t, "class", "item svelte-1jr61rp"), a(t, "style", p = `animation-delay:${/*index*/
      e[9] * /*cadence*/
      e[1]}ms`), this.first = t;
    },
    m(g, v) {
      E(g, t, v), n(t, s), n(s, o), n(t, r), n(t, c), n(c, m), n(c, u), n(t, b);
    },
    p(g, v) {
      e = g, v & /*items*/
      4 && i !== (i = /*item*/
      e[7].title + "") && M(o, i), v & /*items*/
      4 && f !== (f = /*item*/
      e[7].score + "") && M(m, f), v & /*items, cadence*/
      6 && p !== (p = `animation-delay:${/*index*/
      e[9] * /*cadence*/
      e[1]}ms`) && a(t, "style", p);
    },
    d(g) {
      g && L(t);
    }
  };
}
function ai(l) {
  let e, t, s, i, o, r, c, f, m, u, b, p, g = [], v = /* @__PURE__ */ new Map(), h, x, _ = ne(
    /*items*/
    l[2]
  );
  const j = (w) => (
    /*item*/
    w[7].id
  );
  for (let w = 0; w < _.length; w += 1) {
    let C = fl(l, _, w), T = j(C);
    v.set(T, g[w] = dl(T, C));
  }
  return {
    c() {
      e = d("div"), t = d("div"), s = d("div"), i = d("p"), i.textContent = "Stagger list", o = y(), r = d("p"), c = k(
        /*count*/
        l[0]
      ), f = k(" items"), m = y(), u = d("button"), u.textContent = "Actualizar", b = y(), p = d("div");
      for (let w = 0; w < g.length; w += 1)
        g[w].c();
      a(i, "class", "title svelte-1jr61rp"), a(r, "class", "subtitle svelte-1jr61rp"), a(u, "type", "button"), a(u, "class", "svelte-1jr61rp"), a(t, "class", "header svelte-1jr61rp"), a(p, "class", "items svelte-1jr61rp"), a(e, "class", "list svelte-1jr61rp");
    },
    m(w, C) {
      E(w, e, C), n(e, t), n(t, s), n(s, i), n(s, o), n(s, r), n(r, c), n(r, f), n(t, m), n(t, u), n(e, b), n(e, p);
      for (let T = 0; T < g.length; T += 1)
        g[T] && g[T].m(p, null);
      h || (x = X(
        u,
        "click",
        /*handleRefresh*/
        l[3]
      ), h = !0);
    },
    p(w, [C]) {
      C & /*count*/
      1 && M(
        c,
        /*count*/
        w[0]
      ), C & /*items, cadence*/
      6 && (_ = ne(
        /*items*/
        w[2]
      ), g = yt(g, C, j, 1, w, _, v, p, xt, dl, null, fl));
    },
    i: I,
    o: I,
    d(w) {
      w && L(e);
      for (let C = 0; C < g.length; C += 1)
        g[C].d();
      h = !1, x();
    }
  };
}
function ci(l, e, t) {
  let { label: s = "Batch" } = e, { count: i = 5 } = e, { cadence: o = 120 } = e;
  const r = Ae();
  let c = [];
  const f = () => {
    t(2, c = Array.from({ length: i }, (u, b) => ({
      id: `${s}-${b}`,
      title: `${s} ${b + 1}`,
      score: Math.floor(Math.random() * 40) + 60
    }))), r("refresh", { count: i });
  }, m = () => {
    f();
  };
  return Rs(f), l.$$set = (u) => {
    "label" in u && t(4, s = u.label), "count" in u && t(0, i = u.count), "cadence" in u && t(1, o = u.cadence);
  }, [i, o, c, m, s];
}
class cs extends ue {
  constructor(e) {
    super(), fe(this, e, ci, ai, W, { label: 4, count: 0, cadence: 1 }, oi);
  }
  get label() {
    return this.$$.ctx[4];
  }
  set label(e) {
    this.$$set({ label: e }), z();
  }
  get count() {
    return this.$$.ctx[0];
  }
  set count(e) {
    this.$$set({ count: e }), z();
  }
  get cadence() {
    return this.$$.ctx[1];
  }
  set cadence(e) {
    this.$$set({ cadence: e }), z();
  }
}
de(cs, { label: {}, count: {}, cadence: {} }, [], [], !0);
function fi(l) {
  ce(l, "svelte-1g1qxhj", ".thermo.svelte-1g1qxhj.svelte-1g1qxhj{display:grid;gap:16px;border-radius:18px;border:1px solid #e2e8f0;padding:16px;background:#ffffff}.thermo.frameless.svelte-1g1qxhj.svelte-1g1qxhj{border:none;background:transparent;padding:0;gap:6px;grid-template-columns:1fr;align-items:center;text-align:center}.header.svelte-1g1qxhj.svelte-1g1qxhj{display:flex;justify-content:space-between;align-items:center;gap:12px}.thermo.frameless.svelte-1g1qxhj .header.svelte-1g1qxhj{flex-direction:column;align-items:center;justify-content:center;min-width:0;text-align:center}.title.svelte-1g1qxhj.svelte-1g1qxhj{margin:0;font-size:14px;font-weight:600;color:#0f172a}.subtitle.svelte-1g1qxhj.svelte-1g1qxhj{margin:0;font-size:12px;color:#64748b}.meter.svelte-1g1qxhj.svelte-1g1qxhj{position:relative;height:160px;display:grid;place-items:center}.thermo.frameless.svelte-1g1qxhj .meter.svelte-1g1qxhj{align-self:start;width:52px;justify-self:center}.thermo.frameless.svelte-1g1qxhj .meter.svelte-1g1qxhj{height:120px}.tube.svelte-1g1qxhj.svelte-1g1qxhj{position:relative;width:24px;height:140px;border-radius:14px;background:#f1f5f9;border:1px solid #e2e8f0;overflow:hidden;box-shadow:inset 0 6px 16px rgba(15, 23, 42, 0.08)}.thermo.frameless.svelte-1g1qxhj .tube.svelte-1g1qxhj{height:110px}.fill.svelte-1g1qxhj.svelte-1g1qxhj{position:absolute;left:0;right:0;bottom:0;height:var(--level);background:linear-gradient(180deg, #ffffff, var(--fill));transition:height 0.8s cubic-bezier(0.22, 1, 0.36, 1)}.gloss.svelte-1g1qxhj.svelte-1g1qxhj{position:absolute;left:3px;top:8px;width:6px;height:calc(100% - 16px);border-radius:999px;background:rgba(255, 255, 255, 0.6);animation:svelte-1g1qxhj-shimmer 2.4s ease-in-out infinite}.bulb.svelte-1g1qxhj.svelte-1g1qxhj{position:absolute;bottom:-6px;width:44px;height:44px;border-radius:999px;background:radial-gradient(circle at 30% 30%, #ffffff, var(--fill));border:2px solid rgba(226, 232, 240, 0.9);box-shadow:0 10px 24px var(--glow);animation:svelte-1g1qxhj-pulse 2.2s ease-in-out infinite}.thermo.frameless.svelte-1g1qxhj .bulb.svelte-1g1qxhj{width:36px;height:36px}@keyframes svelte-1g1qxhj-shimmer{0%,100%{opacity:0.35;transform:translateY(0)}50%{opacity:0.7;transform:translateY(-8px)}}@keyframes svelte-1g1qxhj-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}");
}
function di(l) {
  let e, t, s, i, o, r, c, f, m, u, b, p;
  return {
    c() {
      e = d("div"), t = d("div"), s = d("div"), i = d("p"), o = k(
        /*label*/
        l[0]
      ), r = y(), c = d("p"), f = k(
        /*subtitleText*/
        l[3]
      ), m = y(), u = d("div"), u.innerHTML = '<div class="tube svelte-1g1qxhj"><div class="fill svelte-1g1qxhj"></div> <div class="gloss svelte-1g1qxhj"></div></div> <div class="bulb svelte-1g1qxhj"></div>', a(i, "class", "title svelte-1g1qxhj"), a(c, "class", "subtitle svelte-1g1qxhj"), a(t, "class", "header svelte-1g1qxhj"), a(u, "class", "meter svelte-1g1qxhj"), a(e, "class", b = He(`thermo ${/*frameless*/
      l[1] ? "frameless" : ""}`) + " svelte-1g1qxhj"), a(e, "style", p = `--level:${/*percent*/
      l[2]}%; --fill:${/*fillColor*/
      l[5]}; --glow:${/*glowColor*/
      l[4]};`);
    },
    m(g, v) {
      E(g, e, v), n(e, t), n(t, s), n(s, i), n(i, o), n(s, r), n(s, c), n(c, f), n(e, m), n(e, u);
    },
    p(g, [v]) {
      v & /*label*/
      1 && M(
        o,
        /*label*/
        g[0]
      ), v & /*subtitleText*/
      8 && M(
        f,
        /*subtitleText*/
        g[3]
      ), v & /*frameless*/
      2 && b !== (b = He(`thermo ${/*frameless*/
      g[1] ? "frameless" : ""}`) + " svelte-1g1qxhj") && a(e, "class", b), v & /*percent, fillColor, glowColor*/
      52 && p !== (p = `--level:${/*percent*/
      g[2]}%; --fill:${/*fillColor*/
      g[5]}; --glow:${/*glowColor*/
      g[4]};`) && a(e, "style", p);
    },
    i: I,
    o: I,
    d(g) {
      g && L(e);
    }
  };
}
function ui(l, e, t) {
  let s, i, o, r, c, f, m, u, b, { label: p = "Temperatura" } = e, { value: g = 22 } = e, { min: v = 0 } = e, { max: h = 40 } = e, { subtitle: x = "" } = e, { frameless: _ = !1 } = e;
  const j = (T, q, S) => Math.min(S, Math.max(q, T)), w = (T, q, S) => Math.round(T + (q - T) * S), C = (T, q, S) => `rgb(${T}, ${q}, ${S})`;
  return l.$$set = (T) => {
    "label" in T && t(0, p = T.label), "value" in T && t(6, g = T.value), "min" in T && t(7, v = T.min), "max" in T && t(8, h = T.max), "subtitle" in T && t(9, x = T.subtitle), "frameless" in T && t(1, _ = T.frameless);
  }, l.$$.update = () => {
    l.$$.dirty & /*value, min, max*/
    448 && t(10, s = j(g, v, h)), l.$$.dirty & /*safeValue, min, max*/
    1408 && t(12, i = (s - v) / (h - v || 1)), l.$$.dirty & /*ratio*/
    4096 && t(2, o = Math.round(i * 100)), l.$$.dirty & /*cool, warm, ratio*/
    28672 && t(11, f = {
      r: w(c.r, r.r, i),
      g: w(c.g, r.g, i),
      b: w(c.b, r.b, i)
    }), l.$$.dirty & /*mix*/
    2048 && t(5, m = C(f.r, f.g, f.b)), l.$$.dirty & /*mix*/
    2048 && t(4, u = `rgba(${f.r}, ${f.g}, ${f.b}, 0.45)`), l.$$.dirty & /*subtitle, safeValue, percent*/
    1540 && t(3, b = x || `${s}C - ${o}%`);
  }, t(13, r = { r: 239, g: 68, b: 68 }), t(14, c = { r: 34, g: 197, b: 94 }), [
    p,
    _,
    o,
    b,
    u,
    m,
    g,
    v,
    h,
    x,
    s,
    f,
    i,
    r,
    c
  ];
}
class fs extends ue {
  constructor(e) {
    super(), fe(
      this,
      e,
      ui,
      di,
      W,
      {
        label: 0,
        value: 6,
        min: 7,
        max: 8,
        subtitle: 9,
        frameless: 1
      },
      fi
    );
  }
  get label() {
    return this.$$.ctx[0];
  }
  set label(e) {
    this.$$set({ label: e }), z();
  }
  get value() {
    return this.$$.ctx[6];
  }
  set value(e) {
    this.$$set({ value: e }), z();
  }
  get min() {
    return this.$$.ctx[7];
  }
  set min(e) {
    this.$$set({ min: e }), z();
  }
  get max() {
    return this.$$.ctx[8];
  }
  set max(e) {
    this.$$set({ max: e }), z();
  }
  get subtitle() {
    return this.$$.ctx[9];
  }
  set subtitle(e) {
    this.$$set({ subtitle: e }), z();
  }
  get frameless() {
    return this.$$.ctx[1];
  }
  set frameless(e) {
    this.$$set({ frameless: e }), z();
  }
}
de(fs, { label: {}, value: {}, min: {}, max: {}, subtitle: {}, frameless: { type: "Boolean" } }, [], [], !0);
function pi(l) {
  ce(l, "svelte-q2ay9k", `.podium.svelte-q2ay9k.svelte-q2ay9k{position:relative;border-radius:18px;border:1px solid #e2e8f0;background:linear-gradient(180deg, #ffffff, #f8fafc);padding:24px 18px 16px;height:220px;display:grid;align-items:end}.line.svelte-q2ay9k.svelte-q2ay9k{position:absolute;left:16px;right:16px;bottom:24px;height:2px;background:linear-gradient(90deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.6))}.controls.svelte-q2ay9k.svelte-q2ay9k{position:absolute;top:14px;right:14px;display:flex;gap:8px}.reset.svelte-q2ay9k.svelte-q2ay9k,.swap.svelte-q2ay9k.svelte-q2ay9k{border:1px solid rgba(16, 185, 129, 0.3);background:#ecfdf5;color:#065f46;font-size:11px;padding:6px 10px;border-radius:999px;cursor:pointer}.reset.svelte-q2ay9k.svelte-q2ay9k:hover,.swap.svelte-q2ay9k.svelte-q2ay9k:hover{background:#d1fae5}.stack.svelte-q2ay9k.svelte-q2ay9k{position:relative;display:grid;grid-template-columns:repeat(3, 1fr);align-items:end;gap:14px;height:100%;z-index:1}.bar.svelte-q2ay9k.svelte-q2ay9k{position:relative;border-radius:14px 14px 6px 6px;background:#d1fae5;color:#065f46;display:grid;place-items:center;font-size:14px;font-weight:600;transform-origin:bottom;animation:svelte-q2ay9k-rise var(--dur) cubic-bezier(0.22, 1, 0.36, 1) forwards;transform:scaleY(0)}.bar.svelte-q2ay9k span.svelte-q2ay9k{opacity:0;animation:svelte-q2ay9k-fade-in 0.5s ease forwards;animation-delay:calc(var(--dur) * 0.7)}.bar.svelte-q2ay9k.svelte-q2ay9k::after{content:"";position:absolute;inset:8px;border-radius:10px;background:linear-gradient(120deg, rgba(255, 255, 255, 0.4), transparent 60%);opacity:0;animation:svelte-q2ay9k-sweep 1.6s ease forwards;animation-delay:calc(var(--dur) * 0.4)}.bar.first.svelte-q2ay9k.svelte-q2ay9k{background:linear-gradient(180deg, #10b981, #34d399);color:#ffffff;box-shadow:0 14px 24px rgba(16, 185, 129, 0.35)}.bar.second.svelte-q2ay9k.svelte-q2ay9k{background:linear-gradient(180deg, #34d399, #6ee7b7)}.bar.third.svelte-q2ay9k.svelte-q2ay9k{background:linear-gradient(180deg, #bbf7d0, #ecfdf5)}.podium[data-play].svelte-q2ay9k .bar.svelte-q2ay9k{animation:svelte-q2ay9k-rise var(--dur) cubic-bezier(0.22, 1, 0.36, 1) forwards,
      svelte-q2ay9k-settle 0.35s ease-out forwards;animation-delay:0s, calc(var(--dur) * 0.9)}.podium[data-play].svelte-q2ay9k .bar span.svelte-q2ay9k{animation:svelte-q2ay9k-fade-in 0.5s ease forwards;animation-delay:calc(var(--dur) * 0.7)}.podium[data-play].svelte-q2ay9k .bar.svelte-q2ay9k::after{animation:svelte-q2ay9k-sweep 1.6s ease forwards;animation-delay:calc(var(--dur) * 0.4)}@keyframes svelte-q2ay9k-rise{to{transform:scaleY(1)}}@keyframes svelte-q2ay9k-settle{0%{transform:scaleY(1.02)}100%{transform:scaleY(1)}}@keyframes svelte-q2ay9k-fade-in{to{opacity:1}}@keyframes svelte-q2ay9k-sweep{0%{opacity:0;transform:translateY(10%)}50%{opacity:0.5}100%{opacity:0;transform:translateY(-20%)}}`);
}
function ul(l, e, t) {
  const s = l.slice();
  return s[12] = e[t], s;
}
function pl(l, e) {
  let t, s, i = (
    /*item*/
    e[12].label + ""
  ), o, r, c, f;
  return {
    key: l,
    first: null,
    c() {
      t = d("div"), s = d("span"), o = k(i), r = y(), a(s, "class", "svelte-q2ay9k"), a(t, "class", c = He(`bar ${/*item*/
      e[12].className}`) + " svelte-q2ay9k"), a(t, "style", f = `height:${/*item*/
      e[12].height}%; --dur:${/*item*/
      e[12].duration}s;`), this.first = t;
    },
    m(m, u) {
      E(m, t, u), n(t, s), n(s, o), n(t, r);
    },
    p(m, u) {
      e = m, u & /*items*/
      2 && i !== (i = /*item*/
      e[12].label + "") && M(o, i), u & /*items*/
      2 && c !== (c = He(`bar ${/*item*/
      e[12].className}`) + " svelte-q2ay9k") && a(t, "class", c), u & /*items*/
      2 && f !== (f = `height:${/*item*/
      e[12].height}%; --dur:${/*item*/
      e[12].duration}s;`) && a(t, "style", f);
    },
    d(m) {
      m && L(t);
    }
  };
}
function vl(l) {
  let e, t = [], s = /* @__PURE__ */ new Map(), i = ne(
    /*items*/
    l[1]
  );
  const o = (r) => (
    /*item*/
    r[12].key
  );
  for (let r = 0; r < i.length; r += 1) {
    let c = ul(l, i, r), f = o(c);
    s.set(f, t[r] = pl(f, c));
  }
  return {
    c() {
      e = d("div");
      for (let r = 0; r < t.length; r += 1)
        t[r].c();
      a(e, "class", "stack svelte-q2ay9k");
    },
    m(r, c) {
      E(r, e, c);
      for (let f = 0; f < t.length; f += 1)
        t[f] && t[f].m(e, null);
    },
    p(r, c) {
      c & /*items*/
      2 && (i = ne(
        /*items*/
        r[1]
      ), t = yt(t, c, o, 1, r, i, s, e, xt, pl, null, ul));
    },
    d(r) {
      r && L(e);
      for (let c = 0; c < t.length; c += 1)
        t[c].d();
    }
  };
}
function vi(l) {
  let e, t, s, i, o, r, c, f, m = (
    /*playId*/
    l[0]
  ), u, b, p = vl(l);
  return {
    c() {
      e = d("div"), t = d("div"), s = y(), i = d("div"), o = d("button"), o.textContent = "Reiniciar", r = y(), c = d("button"), c.textContent = "Intercalar", f = y(), p.c(), a(t, "class", "line svelte-q2ay9k"), a(o, "class", "reset svelte-q2ay9k"), a(o, "type", "button"), a(c, "class", "swap svelte-q2ay9k"), a(c, "type", "button"), a(i, "class", "controls svelte-q2ay9k"), a(e, "class", "podium svelte-q2ay9k"), a(
        e,
        "data-play",
        /*playId*/
        l[0]
      );
    },
    m(g, v) {
      E(g, e, v), n(e, t), n(e, s), n(e, i), n(i, o), n(i, r), n(i, c), n(e, f), p.m(e, null), u || (b = [
        X(
          o,
          "click",
          /*reset*/
          l[2]
        ),
        X(
          c,
          "click",
          /*cycle*/
          l[3]
        )
      ], u = !0);
    },
    p(g, [v]) {
      v & /*playId*/
      1 && W(m, m = /*playId*/
      g[0]) ? (p.d(1), p = vl(g), p.c(), p.m(e, null)) : p.p(g, v), v & /*playId*/
      1 && a(
        e,
        "data-play",
        /*playId*/
        g[0]
      );
    },
    i: I,
    o: I,
    d(g) {
      g && L(e), p.d(g), u = !1, ye(b);
    }
  };
}
function gi(l, e, t) {
  let s, { first: i = 82 } = e, { second: o = 64 } = e, { third: r = 48 } = e, { baseDuration: c = 0.9 } = e, { delayStep: f = 0.15 } = e, m = 0, u = ["second", "first", "third"];
  const b = {
    first: { label: "1", className: "first" },
    second: { label: "2", className: "second" },
    third: { label: "3", className: "third" }
  }, p = (h) => h === "first" ? i : h === "second" ? o : r, g = () => {
    t(0, m += 1);
  }, v = () => {
    t(9, u = [u[1], u[2], u[0]]), t(0, m += 1);
  };
  return l.$$set = (h) => {
    "first" in h && t(4, i = h.first), "second" in h && t(5, o = h.second), "third" in h && t(6, r = h.third), "baseDuration" in h && t(7, c = h.baseDuration), "delayStep" in h && t(8, f = h.delayStep);
  }, l.$$.update = () => {
    l.$$.dirty & /*order, baseDuration, delayStep*/
    896 && t(1, s = u.map((h, x) => ({
      key: h,
      label: b[h].label,
      className: b[h].className,
      height: p(h),
      duration: c + x * f * 2
    })));
  }, [
    m,
    s,
    g,
    v,
    i,
    o,
    r,
    c,
    f,
    u
  ];
}
class ds extends ue {
  constructor(e) {
    super(), fe(
      this,
      e,
      gi,
      vi,
      W,
      {
        first: 4,
        second: 5,
        third: 6,
        baseDuration: 7,
        delayStep: 8
      },
      pi
    );
  }
  get first() {
    return this.$$.ctx[4];
  }
  set first(e) {
    this.$$set({ first: e }), z();
  }
  get second() {
    return this.$$.ctx[5];
  }
  set second(e) {
    this.$$set({ second: e }), z();
  }
  get third() {
    return this.$$.ctx[6];
  }
  set third(e) {
    this.$$set({ third: e }), z();
  }
  get baseDuration() {
    return this.$$.ctx[7];
  }
  set baseDuration(e) {
    this.$$set({ baseDuration: e }), z();
  }
  get delayStep() {
    return this.$$.ctx[8];
  }
  set delayStep(e) {
    this.$$set({ delayStep: e }), z();
  }
}
de(ds, { first: {}, second: {}, third: {}, baseDuration: {}, delayStep: {} }, [], [], !0);
function hi(l) {
  ce(l, "svelte-1jqbzw8", ".balloon-card.svelte-1jqbzw8{border-radius:18px;border:1px solid #e2e8f0;background:linear-gradient(180deg, #ffffff, #f8fafc);padding:16px;height:220px;display:grid;place-items:center}.scene.svelte-1jqbzw8{position:relative;width:160px;height:180px}.rope.svelte-1jqbzw8{position:absolute;left:50%;bottom:14px;width:2px;height:90px;background:var(--rope);transform-origin:bottom;transform:translateX(-50%);animation:svelte-1jqbzw8-rope-sway var(--speed) ease-in-out infinite}.anchor.svelte-1jqbzw8{position:absolute;left:50%;bottom:0;width:18px;height:18px;border-radius:999px;background:#e2e8f0;border:2px solid #cbd5f5;transform:translateX(-50%)}.balloon.svelte-1jqbzw8{position:absolute;left:50%;bottom:96px;width:64px;height:74px;border-radius:50% 50% 46% 46%;background:radial-gradient(circle at 35% 30%, #ffffff, var(--balloon));box-shadow:0 16px 26px rgba(16, 185, 129, 0.2);transform-origin:bottom center;transform:translateX(-50%);animation:svelte-1jqbzw8-float var(--speed) ease-in-out infinite}.string.svelte-1jqbzw8{position:absolute;left:50%;bottom:-26px;width:2px;height:26px;background:var(--rope);transform:translateX(-50%)}@keyframes svelte-1jqbzw8-float{0%,100%{transform:translateX(-50%) translateY(0) rotate(0deg)}50%{transform:translateX(-50%) translateY(calc(var(--lift) * -1)) rotate(var(--sway))}}@keyframes svelte-1jqbzw8-rope-sway{0%,100%{transform:translateX(-50%) rotate(0deg)}50%{transform:translateX(-50%) rotate(calc(var(--sway) * -0.4))}}");
}
function bi(l) {
  let e, t, s;
  return {
    c() {
      e = d("div"), t = d("div"), t.innerHTML = '<div class="rope svelte-1jqbzw8"></div> <div class="anchor svelte-1jqbzw8"></div> <div class="balloon svelte-1jqbzw8"><div class="string svelte-1jqbzw8"></div></div>', a(t, "class", "scene svelte-1jqbzw8"), a(e, "class", "balloon-card svelte-1jqbzw8"), a(e, "style", s = `
    --lift:${/*lift*/
      l[0]}px;
    --sway:${/*sway*/
      l[1]}deg;
    --speed:${/*speed*/
      l[2]}s;
    --balloon:${/*color*/
      l[3]};
    --rope:${/*rope*/
      l[4]};
  `);
    },
    m(i, o) {
      E(i, e, o), n(e, t);
    },
    p(i, [o]) {
      o & /*lift, sway, speed, color, rope*/
      31 && s !== (s = `
    --lift:${/*lift*/
      i[0]}px;
    --sway:${/*sway*/
      i[1]}deg;
    --speed:${/*speed*/
      i[2]}s;
    --balloon:${/*color*/
      i[3]};
    --rope:${/*rope*/
      i[4]};
  `) && a(e, "style", s);
    },
    i: I,
    o: I,
    d(i) {
      i && L(e);
    }
  };
}
function mi(l, e, t) {
  let { lift: s = 18 } = e, { sway: i = 6 } = e, { speed: o = 5.5 } = e, { color: r = "#10b981" } = e, { rope: c = "#94a3b8" } = e;
  return l.$$set = (f) => {
    "lift" in f && t(0, s = f.lift), "sway" in f && t(1, i = f.sway), "speed" in f && t(2, o = f.speed), "color" in f && t(3, r = f.color), "rope" in f && t(4, c = f.rope);
  }, [s, i, o, r, c];
}
class us extends ue {
  constructor(e) {
    super(), fe(
      this,
      e,
      mi,
      bi,
      W,
      {
        lift: 0,
        sway: 1,
        speed: 2,
        color: 3,
        rope: 4
      },
      hi
    );
  }
  get lift() {
    return this.$$.ctx[0];
  }
  set lift(e) {
    this.$$set({ lift: e }), z();
  }
  get sway() {
    return this.$$.ctx[1];
  }
  set sway(e) {
    this.$$set({ sway: e }), z();
  }
  get speed() {
    return this.$$.ctx[2];
  }
  set speed(e) {
    this.$$set({ speed: e }), z();
  }
  get color() {
    return this.$$.ctx[3];
  }
  set color(e) {
    this.$$set({ color: e }), z();
  }
  get rope() {
    return this.$$.ctx[4];
  }
  set rope(e) {
    this.$$set({ rope: e }), z();
  }
}
de(us, { lift: {}, sway: {}, speed: {}, color: {}, rope: {} }, [], [], !0);
function xi(l) {
  ce(l, "svelte-9cnfqg", '.wrapper.svelte-9cnfqg.svelte-9cnfqg{display:grid;grid-template-columns:28px 1fr 28px;align-items:stretch;gap:12px}.nav.svelte-9cnfqg.svelte-9cnfqg{border:1px solid #e2e8f0;background:#f8fafc;border-radius:14px;display:grid;place-items:center;height:100%;cursor:pointer;transition:transform 0.2s ease, background 0.2s ease;position:relative;overflow:hidden}.nav.svelte-9cnfqg.svelte-9cnfqg:hover{background:#e2e8f0;transform:translateY(-2px)}.nav.svelte-9cnfqg.svelte-9cnfqg::after{content:"";position:absolute;inset:0;background:linear-gradient(120deg, transparent, rgba(16, 185, 129, 0.25), transparent);transform:translateX(-120%);transition:transform 0.45s ease}.nav.svelte-9cnfqg.svelte-9cnfqg:hover::after{transform:translateX(120%)}.chevron.svelte-9cnfqg.svelte-9cnfqg{width:10px;height:28px;border-right:2px solid #475569;border-bottom:2px solid #475569;transform:rotate(-45deg)}.nav.left.svelte-9cnfqg .chevron.svelte-9cnfqg{transform:rotate(135deg)}.card.svelte-9cnfqg.svelte-9cnfqg{display:grid;grid-template-columns:72px 1fr;gap:16px;padding:18px 20px;border-radius:20px;border:1px solid #e2e8f0;background:#ffffff;box-shadow:0 14px 26px rgba(15, 23, 42, 0.08);transition:transform 0.35s ease, box-shadow 0.35s ease}.card.svelte-9cnfqg.svelte-9cnfqg:hover{transform:translateY(-4px);box-shadow:0 18px 34px rgba(15, 23, 42, 0.16)}.icon.svelte-9cnfqg.svelte-9cnfqg{width:56px;height:56px;border-radius:16px;background:#f8fafc;display:grid;place-items:center}.ladder.svelte-9cnfqg.svelte-9cnfqg{width:28px;height:36px;border:3px solid #7c5c4f;border-left-width:5px;border-right-width:5px;border-radius:6px;position:relative}.ladder.svelte-9cnfqg span.svelte-9cnfqg{position:absolute;left:2px;right:2px;height:4px;background:#7c5c4f;border-radius:999px;animation:svelte-9cnfqg-rung 2.8s ease-in-out infinite}.ladder.svelte-9cnfqg span.svelte-9cnfqg:nth-child(1){top:6px;animation-delay:0s}.ladder.svelte-9cnfqg span.svelte-9cnfqg:nth-child(2){top:14px;animation-delay:0.2s}.ladder.svelte-9cnfqg span.svelte-9cnfqg:nth-child(3){top:22px;animation-delay:0.4s}.ladder.svelte-9cnfqg span.svelte-9cnfqg:nth-child(4){top:30px;animation-delay:0.6s}.content.svelte-9cnfqg.svelte-9cnfqg{display:grid;gap:8px}.panel.svelte-9cnfqg.svelte-9cnfqg{animation:svelte-9cnfqg-slide-in 0.4s ease}.row.svelte-9cnfqg.svelte-9cnfqg{display:flex;align-items:center;justify-content:space-between;gap:12px}.title.svelte-9cnfqg.svelte-9cnfqg{display:flex;align-items:baseline;gap:12px}.title.svelte-9cnfqg strong.svelte-9cnfqg{font-size:18px;color:#0f172a}.title.svelte-9cnfqg span.svelte-9cnfqg{font-size:14px;color:#64748b}.level-text.svelte-9cnfqg.svelte-9cnfqg{font-size:14px;color:#64748b;animation:svelte-9cnfqg-level-pop 0.35s ease}.pill.svelte-9cnfqg.svelte-9cnfqg{padding:6px 14px;background:#eef2ff;color:#1e3a8a;border-radius:999px;font-size:12px;font-weight:600}.desc.svelte-9cnfqg.svelte-9cnfqg{margin:0;font-size:14px;color:#0f172a}.meta.svelte-9cnfqg.svelte-9cnfqg{font-size:13px;color:#475569}.xp.svelte-9cnfqg.svelte-9cnfqg{font-weight:600;color:#047857}.progress.svelte-9cnfqg.svelte-9cnfqg{position:relative;height:12px;border-radius:999px;background:#f1f5f9;overflow:hidden}.bar.svelte-9cnfqg.svelte-9cnfqg{height:100%;width:var(--fill);background:linear-gradient(90deg, #10b981, #34d399);transition:width 0.8s cubic-bezier(0.22, 1, 0.36, 1)}.glow.svelte-9cnfqg.svelte-9cnfqg{position:absolute;inset:0;background:linear-gradient(90deg, rgba(16, 185, 129, 0), rgba(16, 185, 129, 0.35), rgba(16, 185, 129, 0));transform:translateX(-100%);animation:svelte-9cnfqg-sweep 3.2s ease-in-out infinite}@keyframes svelte-9cnfqg-sweep{0%,60%{transform:translateX(-100%)}100%{transform:translateX(100%)}}@keyframes svelte-9cnfqg-level-pop{0%{opacity:0;transform:translateY(4px)}100%{opacity:1;transform:translateY(0)}}@keyframes svelte-9cnfqg-rung{0%,100%{opacity:0.6}50%{opacity:1}}@keyframes svelte-9cnfqg-slide-in{from{opacity:0;transform:translateX(calc(var(--dir) * 12px))}to{opacity:1;transform:translateX(0)}}');
}
function gl(l) {
  let e, t, s, i, o, r, c, f, m, u, b, p, g, v, h, x, _, j, w, C, T, q, S, D, Y, A, U, G, he, be, re, F, oe, ee, te;
  return {
    c() {
      e = d("div"), t = d("div"), s = d("div"), i = d("strong"), o = k(
        /*title*/
        l[0]
      ), r = y(), c = d("span"), f = k("Nivel "), m = k(
        /*activeLevel*/
        l[4]
      ), u = k("/"), b = k(
        /*safeLevelTotal*/
        l[5]
      ), p = y(), g = d("div"), v = k(
        /*status*/
        l[3]
      ), h = y(), x = d("p"), _ = k(
        /*description*/
        l[1]
      ), j = y(), w = d("div"), C = d("span"), T = k("Progreso: "), q = k(
        /*safeProgress*/
        l[7]
      ), S = k(" / "), D = k(
        /*safeTotal*/
        l[6]
      ), Y = y(), A = d("span"), U = k("+"), G = k(
        /*xp*/
        l[2]
      ), he = k(" XP"), be = y(), re = d("div"), F = d("div"), ee = y(), te = d("div"), a(i, "class", "svelte-9cnfqg"), a(c, "class", "level-text svelte-9cnfqg"), a(s, "class", "title svelte-9cnfqg"), a(g, "class", "pill svelte-9cnfqg"), a(t, "class", "row svelte-9cnfqg"), a(x, "class", "desc svelte-9cnfqg"), a(A, "class", "xp svelte-9cnfqg"), a(w, "class", "row meta svelte-9cnfqg"), a(F, "class", "bar svelte-9cnfqg"), a(F, "style", oe = `--fill:${/*percent*/
      l[9]}%`), a(te, "class", "glow svelte-9cnfqg"), a(re, "class", "progress svelte-9cnfqg"), a(e, "class", "panel svelte-9cnfqg");
    },
    m(H, B) {
      E(H, e, B), n(e, t), n(t, s), n(s, i), n(i, o), n(s, r), n(s, c), n(c, f), n(c, m), n(c, u), n(c, b), n(t, p), n(t, g), n(g, v), n(e, h), n(e, x), n(x, _), n(e, j), n(e, w), n(w, C), n(C, T), n(C, q), n(C, S), n(C, D), n(w, Y), n(w, A), n(A, U), n(A, G), n(A, he), n(e, be), n(e, re), n(re, F), n(re, ee), n(re, te);
    },
    p(H, B) {
      B & /*title*/
      1 && M(
        o,
        /*title*/
        H[0]
      ), B & /*activeLevel*/
      16 && M(
        m,
        /*activeLevel*/
        H[4]
      ), B & /*safeLevelTotal*/
      32 && M(
        b,
        /*safeLevelTotal*/
        H[5]
      ), B & /*status*/
      8 && M(
        v,
        /*status*/
        H[3]
      ), B & /*description*/
      2 && M(
        _,
        /*description*/
        H[1]
      ), B & /*safeProgress*/
      128 && M(
        q,
        /*safeProgress*/
        H[7]
      ), B & /*safeTotal*/
      64 && M(
        D,
        /*safeTotal*/
        H[6]
      ), B & /*xp*/
      4 && M(
        G,
        /*xp*/
        H[2]
      ), B & /*percent*/
      512 && oe !== (oe = `--fill:${/*percent*/
      H[9]}%`) && a(F, "style", oe);
    },
    d(H) {
      H && L(e);
    }
  };
}
function yi(l) {
  let e, t, s, i, o, r, c, f = (
    /*activeLevel*/
    l[4]
  ), m, u, b, p, g, v = gl(l);
  return {
    c() {
      e = d("div"), t = d("button"), t.innerHTML = '<span class="chevron svelte-9cnfqg"></span>', s = y(), i = d("div"), o = d("div"), o.innerHTML = '<div class="ladder svelte-9cnfqg"><span class="svelte-9cnfqg"></span> <span class="svelte-9cnfqg"></span> <span class="svelte-9cnfqg"></span> <span class="svelte-9cnfqg"></span></div>', r = y(), c = d("div"), v.c(), u = y(), b = d("button"), b.innerHTML = '<span class="chevron svelte-9cnfqg"></span>', a(t, "class", "nav left svelte-9cnfqg"), a(t, "type", "button"), a(t, "aria-label", "Nivel anterior"), a(o, "class", "icon svelte-9cnfqg"), a(c, "class", "content svelte-9cnfqg"), a(c, "style", m = `--dir:${/*slideDir*/
      l[8]}`), a(i, "class", "card svelte-9cnfqg"), a(b, "class", "nav right svelte-9cnfqg"), a(b, "type", "button"), a(b, "aria-label", "Nivel siguiente"), a(e, "class", "wrapper svelte-9cnfqg");
    },
    m(h, x) {
      E(h, e, x), n(e, t), n(e, s), n(e, i), n(i, o), n(i, r), n(i, c), v.m(c, null), n(e, u), n(e, b), p || (g = [
        X(
          t,
          "click",
          /*click_handler*/
          l[17]
        ),
        X(
          b,
          "click",
          /*click_handler_1*/
          l[18]
        )
      ], p = !0);
    },
    p(h, [x]) {
      x & /*activeLevel*/
      16 && W(f, f = /*activeLevel*/
      h[4]) ? (v.d(1), v = gl(h), v.c(), v.m(c, null)) : v.p(h, x), x & /*slideDir*/
      256 && m !== (m = `--dir:${/*slideDir*/
      h[8]}`) && a(c, "style", m);
    },
    i: I,
    o: I,
    d(h) {
      h && L(e), v.d(h), p = !1, ye(g);
    }
  };
}
function _i(l, e, t) {
  let s, i, o, r, c, { title: f = "Nivel 5" } = e, { subtitle: m = "Nivel 1/3" } = e, { description: u = "Alcanza nivel 5 de usuario." } = e, { progress: b = 4 } = e, { total: p = 5 } = e, { xp: g = 15 } = e, { status: v = "En progreso" } = e, { levelIndex: h = 1 } = e, { levelTotal: x = 3 } = e;
  const _ = (S, D, Y) => Math.min(Y, Math.max(D, S));
  let j = _(h, 1, c), w = 1;
  const C = (S) => {
    t(8, w = S >= 0 ? 1 : -1), t(4, j = _(j + S, 1, c));
  }, T = () => C(-1), q = () => C(1);
  return l.$$set = (S) => {
    "title" in S && t(0, f = S.title), "subtitle" in S && t(11, m = S.subtitle), "description" in S && t(1, u = S.description), "progress" in S && t(12, b = S.progress), "total" in S && t(13, p = S.total), "xp" in S && t(2, g = S.xp), "status" in S && t(3, v = S.status), "levelIndex" in S && t(14, h = S.levelIndex), "levelTotal" in S && t(15, x = S.levelTotal);
  }, l.$$.update = () => {
    l.$$.dirty & /*total*/
    8192 && t(6, s = Math.max(1, p)), l.$$.dirty & /*progress, safeTotal*/
    4160 && t(7, i = _(b, 0, s)), l.$$.dirty & /*safeProgress, safeTotal*/
    192 && t(16, o = i / s), l.$$.dirty & /*ratio*/
    65536 && t(9, r = Math.round(o * 100)), l.$$.dirty & /*levelTotal*/
    32768 && t(5, c = Math.max(1, x)), l.$$.dirty & /*levelIndex, activeLevel, safeLevelTotal*/
    16432 && h !== j && t(4, j = _(h, 1, c));
  }, [
    f,
    u,
    g,
    v,
    j,
    c,
    s,
    i,
    w,
    r,
    C,
    m,
    b,
    p,
    h,
    x,
    o,
    T,
    q
  ];
}
class ps extends ue {
  constructor(e) {
    super(), fe(
      this,
      e,
      _i,
      yi,
      W,
      {
        title: 0,
        subtitle: 11,
        description: 1,
        progress: 12,
        total: 13,
        xp: 2,
        status: 3,
        levelIndex: 14,
        levelTotal: 15
      },
      xi
    );
  }
  get title() {
    return this.$$.ctx[0];
  }
  set title(e) {
    this.$$set({ title: e }), z();
  }
  get subtitle() {
    return this.$$.ctx[11];
  }
  set subtitle(e) {
    this.$$set({ subtitle: e }), z();
  }
  get description() {
    return this.$$.ctx[1];
  }
  set description(e) {
    this.$$set({ description: e }), z();
  }
  get progress() {
    return this.$$.ctx[12];
  }
  set progress(e) {
    this.$$set({ progress: e }), z();
  }
  get total() {
    return this.$$.ctx[13];
  }
  set total(e) {
    this.$$set({ total: e }), z();
  }
  get xp() {
    return this.$$.ctx[2];
  }
  set xp(e) {
    this.$$set({ xp: e }), z();
  }
  get status() {
    return this.$$.ctx[3];
  }
  set status(e) {
    this.$$set({ status: e }), z();
  }
  get levelIndex() {
    return this.$$.ctx[14];
  }
  set levelIndex(e) {
    this.$$set({ levelIndex: e }), z();
  }
  get levelTotal() {
    return this.$$.ctx[15];
  }
  set levelTotal(e) {
    this.$$set({ levelTotal: e }), z();
  }
}
de(ps, { title: {}, subtitle: {}, description: {}, progress: {}, total: {}, xp: {}, status: {}, levelIndex: {}, levelTotal: {} }, [], [], !0);
function wi(l) {
  ce(l, "svelte-12k2sv8", ".card.svelte-12k2sv8{position:relative;border-radius:18px;border:1px solid #e2e8f0;background:linear-gradient(160deg, #ffffff, #ecfdf5);padding:18px;overflow:hidden;transform:perspective(800px) rotateX(var(--rx)) rotateY(var(--ry));transition:transform 0.2s ease;box-shadow:0 18px 32px rgba(15, 23, 42, 0.12)}.shine.svelte-12k2sv8{position:absolute;inset:0;background:radial-gradient(circle at var(--shine) 20%, rgba(16, 185, 129, 0.22), transparent 55%);pointer-events:none}.content.svelte-12k2sv8{position:relative;display:grid;gap:6px}.title.svelte-12k2sv8{margin:0;font-size:12px;color:#64748b;letter-spacing:0.08em;text-transform:uppercase}.value.svelte-12k2sv8{margin:0;font-size:28px;font-weight:700;color:#0f172a}.hint.svelte-12k2sv8{margin:0;font-size:12px;color:#475569}");
}
function ki(l) {
  let e, t, s, i, o, r, c, f, m, u, b, p, g, v, h;
  return {
    c() {
      e = d("div"), t = d("div"), s = y(), i = d("div"), o = d("p"), r = k(
        /*title*/
        l[0]
      ), c = y(), f = d("p"), m = k(
        /*value*/
        l[1]
      ), u = y(), b = d("p"), p = k(
        /*hint*/
        l[2]
      ), a(t, "class", "shine svelte-12k2sv8"), a(o, "class", "title svelte-12k2sv8"), a(f, "class", "value svelte-12k2sv8"), a(b, "class", "hint svelte-12k2sv8"), a(i, "class", "content svelte-12k2sv8"), a(e, "class", "card svelte-12k2sv8"), a(e, "style", g = `--rx:${/*rx*/
      l[3]}deg; --ry:${/*ry*/
      l[4]}deg; --shine:${/*shine*/
      l[5]}%`);
    },
    m(x, _) {
      E(x, e, _), n(e, t), n(e, s), n(e, i), n(i, o), n(o, r), n(i, c), n(i, f), n(f, m), n(i, u), n(i, b), n(b, p), v || (h = [
        X(
          e,
          "pointermove",
          /*handleMove*/
          l[6]
        ),
        X(
          e,
          "pointerleave",
          /*reset*/
          l[7]
        )
      ], v = !0);
    },
    p(x, [_]) {
      _ & /*title*/
      1 && M(
        r,
        /*title*/
        x[0]
      ), _ & /*value*/
      2 && M(
        m,
        /*value*/
        x[1]
      ), _ & /*hint*/
      4 && M(
        p,
        /*hint*/
        x[2]
      ), _ & /*rx, ry, shine*/
      56 && g !== (g = `--rx:${/*rx*/
      x[3]}deg; --ry:${/*ry*/
      x[4]}deg; --shine:${/*shine*/
      x[5]}%`) && a(e, "style", g);
    },
    i: I,
    o: I,
    d(x) {
      x && L(e), v = !1, ye(h);
    }
  };
}
function zi(l, e, t) {
  let { title: s = "Pulso Focus" } = e, { value: i = "78%" } = e, { hint: o = "Calma sostenida" } = e, { intensity: r = 10 } = e, c = 0, f = 0, m = 0;
  const u = (p) => {
    const g = p.currentTarget.getBoundingClientRect(), v = (p.clientX - g.left) / g.width - 0.5, h = (p.clientY - g.top) / g.height - 0.5;
    t(3, c = h * r * -1), t(4, f = v * r), t(5, m = (v + h + 1) * 25);
  }, b = () => {
    t(3, c = 0), t(4, f = 0), t(5, m = 0);
  };
  return l.$$set = (p) => {
    "title" in p && t(0, s = p.title), "value" in p && t(1, i = p.value), "hint" in p && t(2, o = p.hint), "intensity" in p && t(8, r = p.intensity);
  }, [s, i, o, c, f, m, u, b, r];
}
class vs extends ue {
  constructor(e) {
    super(), fe(
      this,
      e,
      zi,
      ki,
      W,
      {
        title: 0,
        value: 1,
        hint: 2,
        intensity: 8
      },
      wi
    );
  }
  get title() {
    return this.$$.ctx[0];
  }
  set title(e) {
    this.$$set({ title: e }), z();
  }
  get value() {
    return this.$$.ctx[1];
  }
  set value(e) {
    this.$$set({ value: e }), z();
  }
  get hint() {
    return this.$$.ctx[2];
  }
  set hint(e) {
    this.$$set({ hint: e }), z();
  }
  get intensity() {
    return this.$$.ctx[8];
  }
  set intensity(e) {
    this.$$set({ intensity: e }), z();
  }
}
de(vs, { title: {}, value: {}, hint: {}, intensity: {} }, [], [], !0);
function qi(l) {
  ce(l, "svelte-1czrcz8", '.counter.svelte-1czrcz8{border-radius:16px;border:1px solid #e2e8f0;padding:16px;background:#ffffff;display:grid;gap:10px;box-shadow:0 12px 22px rgba(15, 23, 42, 0.08)}.label.svelte-1czrcz8{margin:0;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.08em}.value.svelte-1czrcz8{font-size:32px;font-weight:700;color:#0f172a;position:relative;animation:svelte-1czrcz8-flip 0.5s ease}.value.svelte-1czrcz8::after{content:"";position:absolute;left:0;right:0;bottom:-4px;height:3px;border-radius:999px;background:var(--tone);animation:svelte-1czrcz8-sweep 0.6s ease}@keyframes svelte-1czrcz8-flip{0%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:translateY(0)}}@keyframes svelte-1czrcz8-sweep{from{transform:scaleX(0.2)}to{transform:scaleX(1)}}');
}
function hl(l) {
  let e, t;
  return {
    c() {
      e = d("div"), t = k(
        /*value*/
        l[1]
      ), a(e, "class", "value svelte-1czrcz8");
    },
    m(s, i) {
      E(s, e, i), n(e, t);
    },
    p(s, i) {
      i & /*value*/
      2 && M(
        t,
        /*value*/
        s[1]
      );
    },
    d(s) {
      s && L(e);
    }
  };
}
function ji(l) {
  let e, t, s, i, o = (
    /*value*/
    l[1]
  ), r, c = hl(l);
  return {
    c() {
      e = d("div"), t = d("p"), s = k(
        /*label*/
        l[0]
      ), i = y(), c.c(), a(t, "class", "label svelte-1czrcz8"), a(e, "class", "counter svelte-1czrcz8"), a(e, "style", r = `--tone:${/*tone*/
      l[2]}`);
    },
    m(f, m) {
      E(f, e, m), n(e, t), n(t, s), n(e, i), c.m(e, null);
    },
    p(f, [m]) {
      m & /*label*/
      1 && M(
        s,
        /*label*/
        f[0]
      ), m & /*value*/
      2 && W(o, o = /*value*/
      f[1]) ? (c.d(1), c = hl(f), c.c(), c.m(e, null)) : c.p(f, m), m & /*tone*/
      4 && r !== (r = `--tone:${/*tone*/
      f[2]}`) && a(e, "style", r);
    },
    i: I,
    o: I,
    d(f) {
      f && L(e), c.d(f);
    }
  };
}
function Ci(l, e, t) {
  let { label: s = "Sesiones" } = e, { value: i = 12 } = e, { tone: o = "#10b981" } = e;
  return l.$$set = (r) => {
    "label" in r && t(0, s = r.label), "value" in r && t(1, i = r.value), "tone" in r && t(2, o = r.tone);
  }, [s, i, o];
}
class gs extends ue {
  constructor(e) {
    super(), fe(this, e, Ci, ji, W, { label: 0, value: 1, tone: 2 }, qi);
  }
  get label() {
    return this.$$.ctx[0];
  }
  set label(e) {
    this.$$set({ label: e }), z();
  }
  get value() {
    return this.$$.ctx[1];
  }
  set value(e) {
    this.$$set({ value: e }), z();
  }
  get tone() {
    return this.$$.ctx[2];
  }
  set tone(e) {
    this.$$set({ tone: e }), z();
  }
}
de(gs, { label: {}, value: {}, tone: {} }, [], [], !0);
function Si(l) {
  ce(l, "svelte-pocpcm", ".stack.svelte-pocpcm{position:relative;height:160px;border-radius:18px;border:1px solid #e2e8f0;background:linear-gradient(140deg, #ffffff, #ecfdf5);overflow:hidden;transform:perspective(900px) rotateX(var(--rx)) rotateY(var(--ry));transition:transform 0.2s ease}.bg.svelte-pocpcm{position:absolute;inset:0;background:radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.15), transparent 60%)}.layer.svelte-pocpcm{position:absolute;border-radius:999px;filter:blur(calc(var(--blur) * 10px));opacity:0.75}.layer-a.svelte-pocpcm{width:120px;height:120px;background:rgba(16, 185, 129, 0.45);transform:translate(calc(var(--px) * 0.6), calc(var(--py) * 0.6));top:20px;left:14px}.layer-b.svelte-pocpcm{width:90px;height:90px;background:rgba(52, 211, 153, 0.5);transform:translate(calc(var(--px) * 1.2), calc(var(--py) * 1.2));bottom:18px;right:20px}.layer-c.svelte-pocpcm{width:70px;height:70px;background:rgba(14, 116, 144, 0.3);transform:translate(calc(var(--px) * 1.6), calc(var(--py) * 1.6));top:30px;right:70px}.label.svelte-pocpcm{position:absolute;left:16px;bottom:14px;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#0f172a;background:rgba(255, 255, 255, 0.7);padding:4px 8px;border-radius:999px}");
}
function Li(l) {
  let e, t, s, i, o, r, c, f, m, u, b, p, g, v;
  return {
    c() {
      e = d("div"), t = d("div"), s = y(), i = d("div"), o = y(), r = d("div"), c = y(), f = d("div"), m = y(), u = d("div"), b = k(
        /*title*/
        l[0]
      ), a(t, "class", "bg svelte-pocpcm"), a(i, "class", "layer layer-a svelte-pocpcm"), a(r, "class", "layer layer-b svelte-pocpcm"), a(f, "class", "layer layer-c svelte-pocpcm"), a(u, "class", "label svelte-pocpcm"), a(e, "class", "stack svelte-pocpcm"), a(e, "style", p = `--rx:${/*rx*/
      l[2]}deg; --ry:${/*ry*/
      l[3]}deg; --px:${/*px*/
      l[4]}px; --py:${/*py*/
      l[5]}px; --blur:${/*blurAmount*/
      l[1]}`);
    },
    m(h, x) {
      E(h, e, x), n(e, t), n(e, s), n(e, i), n(e, o), n(e, r), n(e, c), n(e, f), n(e, m), n(e, u), n(u, b), g || (v = [
        X(
          e,
          "pointermove",
          /*handleMove*/
          l[6]
        ),
        X(
          e,
          "pointerleave",
          /*reset*/
          l[7]
        )
      ], g = !0);
    },
    p(h, [x]) {
      x & /*title*/
      1 && M(
        b,
        /*title*/
        h[0]
      ), x & /*rx, ry, px, py, blurAmount*/
      62 && p !== (p = `--rx:${/*rx*/
      h[2]}deg; --ry:${/*ry*/
      h[3]}deg; --px:${/*px*/
      h[4]}px; --py:${/*py*/
      h[5]}px; --blur:${/*blurAmount*/
      h[1]}`) && a(e, "style", p);
    },
    i: I,
    o: I,
    d(h) {
      h && L(e), g = !1, ye(v);
    }
  };
}
function Ei(l, e, t) {
  let { title: s = "Capas activas" } = e, { intensity: i = 18 } = e, { blurAmount: o = 0.6 } = e, r = 0, c = 0, f = 0, m = 0;
  const u = (p) => {
    const g = p.currentTarget.getBoundingClientRect(), v = (p.clientX - g.left) / g.width - 0.5, h = (p.clientY - g.top) / g.height - 0.5;
    t(2, r = h * i * -1), t(3, c = v * i), t(4, f = v * 24), t(5, m = h * 24);
  }, b = () => {
    t(2, r = 0), t(3, c = 0), t(4, f = 0), t(5, m = 0);
  };
  return l.$$set = (p) => {
    "title" in p && t(0, s = p.title), "intensity" in p && t(8, i = p.intensity), "blurAmount" in p && t(1, o = p.blurAmount);
  }, [s, o, r, c, f, m, u, b, i];
}
class hs extends ue {
  constructor(e) {
    super(), fe(this, e, Ei, Li, W, { title: 0, intensity: 8, blurAmount: 1 }, Si);
  }
  get title() {
    return this.$$.ctx[0];
  }
  set title(e) {
    this.$$set({ title: e }), z();
  }
  get intensity() {
    return this.$$.ctx[8];
  }
  set intensity(e) {
    this.$$set({ intensity: e }), z();
  }
  get blurAmount() {
    return this.$$.ctx[1];
  }
  set blurAmount(e) {
    this.$$set({ blurAmount: e }), z();
  }
}
de(hs, { title: {}, intensity: {}, blurAmount: {} }, [], [], !0);
function Mi(l) {
  ce(l, "svelte-1yc0e5f", `:host{display:block;font-family:'Poppins', 'Manrope', 'Segoe UI', system-ui, sans-serif}.card-shell.svelte-1yc0e5f.svelte-1yc0e5f{position:relative;padding-bottom:18px}.card.svelte-1yc0e5f.svelte-1yc0e5f{position:relative;z-index:1;background:#ffffff;border-radius:16px;overflow:hidden;border:2px solid transparent;box-shadow:0 12px 24px rgba(15, 23, 42, 0.08);transition:transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;cursor:pointer}.card.svelte-1yc0e5f.svelte-1yc0e5f:hover{transform:translateY(-2px);box-shadow:0 18px 32px rgba(15, 23, 42, 0.12),
      0 0 0 2px color-mix(in srgb, var(--category-left) 55%, transparent),
      0 12px 24px color-mix(in srgb, var(--category-right) 35%, transparent)}.card.is-selected.svelte-1yc0e5f.svelte-1yc0e5f{border-color:#10b981;transform:scale(0.99)}.card.is-disabled.svelte-1yc0e5f.svelte-1yc0e5f{opacity:0.5;cursor:not-allowed;pointer-events:none}.thumb.svelte-1yc0e5f.svelte-1yc0e5f{position:relative;background:#f1f5f9;aspect-ratio:16 / 9;overflow:hidden}.thumb.svelte-1yc0e5f img.svelte-1yc0e5f{width:100%;height:100%;object-fit:cover;display:block}.thumb-placeholder.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;inset:0;display:grid;place-items:center;font-size:28px;color:#94a3b8}.thumb-overlay.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;inset:0;background:linear-gradient(180deg, rgba(15, 23, 42, 0) 50%, rgba(15, 23, 42, 0.55) 100%);opacity:0;transition:opacity 0.2s ease}.card.svelte-1yc0e5f:hover .thumb-overlay.svelte-1yc0e5f{opacity:1}.pill-row.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;top:8px;left:8px;display:flex;gap:6px}.pill.svelte-1yc0e5f.svelte-1yc0e5f{padding:4px 8px;border-radius:999px;background:rgba(15, 23, 42, 0.6);color:#ffffff;font-size:11px;font-weight:600}.pill.badge.svelte-1yc0e5f.svelte-1yc0e5f{background:rgba(15, 23, 42, 0.75);text-transform:uppercase;letter-spacing:0.5px}.favorite.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;top:8px;right:8px;border:none;background:rgba(15, 23, 42, 0.35);color:#ffffff;width:30px;height:30px;border-radius:999px;display:grid;place-items:center;cursor:pointer;transition:background 0.2s ease, transform 0.2s ease, color 0.2s ease}.favorite.svelte-1yc0e5f svg.svelte-1yc0e5f{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.6}.favorite.active.svelte-1yc0e5f.svelte-1yc0e5f{background:rgba(255, 255, 255, 0.9);color:#ef4444}.favorite.active.svelte-1yc0e5f svg.svelte-1yc0e5f{fill:currentColor;stroke:none}.favorite.svelte-1yc0e5f.svelte-1yc0e5f:hover{transform:scale(1.05)}.check.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;bottom:8px;left:8px;width:26px;height:26px;border-radius:999px;background:rgba(255, 255, 255, 0.9);border:1px solid #e2e8f0;display:grid;place-items:center;transition:background 0.2s ease, border-color 0.2s ease}.check.svelte-1yc0e5f svg.svelte-1yc0e5f{width:16px;height:16px;fill:#ffffff;opacity:0;transform:scale(0.7);transition:opacity 0.2s ease, transform 0.2s ease}.card.is-selected.svelte-1yc0e5f .check.svelte-1yc0e5f{background:#10b981;border-color:#059669}.card.is-selected.svelte-1yc0e5f .check svg.svelte-1yc0e5f{opacity:1;transform:scale(1)}.body.svelte-1yc0e5f.svelte-1yc0e5f{padding:16px;display:grid;gap:8px}.body.svelte-1yc0e5f h3.svelte-1yc0e5f{margin:0;font-size:15px;font-weight:700;color:#0f172a}.body.svelte-1yc0e5f p.svelte-1yc0e5f{margin:0;font-size:13px;color:#64748b;min-height:34px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.cta.svelte-1yc0e5f.svelte-1yc0e5f{padding:8px 10px;border-radius:10px;text-align:center;font-size:12px;font-weight:600;color:#64748b;background:#f1f5f9;transition:background 0.2s ease, color 0.2s ease}.card.svelte-1yc0e5f:hover .cta.svelte-1yc0e5f{background:#e2e8f0}.cta-selected.svelte-1yc0e5f.svelte-1yc0e5f{background:#d1fae5;color:#047857}.category-lift.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;left:16px;right:16px;bottom:-12px;display:flex;justify-content:center;gap:8px;z-index:0;pointer-events:none;transform:translateY(14px);opacity:0;transition:transform 0.25s ease, opacity 0.2s ease}.category-chip.svelte-1yc0e5f.svelte-1yc0e5f{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:0.4px;color:#ffffff;text-transform:uppercase;background:var(--chip-color);box-shadow:0 10px 20px color-mix(in srgb, var(--chip-color) 35%, transparent)}.card-shell.svelte-1yc0e5f:hover .category-lift.svelte-1yc0e5f,.card-shell.svelte-1yc0e5f:focus-within .category-lift.svelte-1yc0e5f{opacity:1;transform:translateY(0)}`);
}
function Ti(l) {
  let e;
  return {
    c() {
      e = d("div"), e.textContent = "▶", a(e, "class", "thumb-placeholder svelte-1yc0e5f");
    },
    m(t, s) {
      E(t, e, s);
    },
    p: I,
    d(t) {
      t && L(e);
    }
  };
}
function Ai(l) {
  let e, t, s;
  return {
    c() {
      e = d("img"), rt(e.src, t = /*thumbnail*/
      l[3]) || a(e, "src", t), a(e, "alt", s = `Miniatura de ${/*title*/
      l[0]}`), a(e, "loading", "lazy"), a(e, "class", "svelte-1yc0e5f");
    },
    m(i, o) {
      E(i, e, o);
    },
    p(i, o) {
      o & /*thumbnail*/
      8 && !rt(e.src, t = /*thumbnail*/
      i[3]) && a(e, "src", t), o & /*title*/
      1 && s !== (s = `Miniatura de ${/*title*/
      i[0]}`) && a(e, "alt", s);
    },
    d(i) {
      i && L(e);
    }
  };
}
function bl(l) {
  let e, t;
  return {
    c() {
      e = d("div"), t = k(
        /*badge*/
        l[6]
      ), a(e, "class", "pill badge svelte-1yc0e5f");
    },
    m(s, i) {
      E(s, e, i), n(e, t);
    },
    p(s, i) {
      i & /*badge*/
      64 && M(
        t,
        /*badge*/
        s[6]
      );
    },
    d(s) {
      s && L(e);
    }
  };
}
function ml(l) {
  let e, t, s, i, o, r = (
    /*categoryRight*/
    l[9] && xl(l)
  );
  return {
    c() {
      e = d("div"), t = d("span"), s = k(
        /*categoryLeft*/
        l[8]
      ), o = y(), r && r.c(), a(t, "class", "category-chip svelte-1yc0e5f"), a(t, "style", i = `--chip-color: ${/*categoryLeftColor*/
      l[10]};`), a(e, "class", "category-lift svelte-1yc0e5f"), a(e, "aria-hidden", "true");
    },
    m(c, f) {
      E(c, e, f), n(e, t), n(t, s), n(e, o), r && r.m(e, null);
    },
    p(c, f) {
      f & /*categoryLeft*/
      256 && M(
        s,
        /*categoryLeft*/
        c[8]
      ), f & /*categoryLeftColor*/
      1024 && i !== (i = `--chip-color: ${/*categoryLeftColor*/
      c[10]};`) && a(t, "style", i), /*categoryRight*/
      c[9] ? r ? r.p(c, f) : (r = xl(c), r.c(), r.m(e, null)) : r && (r.d(1), r = null);
    },
    d(c) {
      c && L(e), r && r.d();
    }
  };
}
function xl(l) {
  let e, t, s;
  return {
    c() {
      e = d("span"), t = k(
        /*categoryRight*/
        l[9]
      ), a(e, "class", "category-chip svelte-1yc0e5f"), a(e, "style", s = `--chip-color: ${/*categoryRightColor*/
      l[11]};`);
    },
    m(i, o) {
      E(i, e, o), n(e, t);
    },
    p(i, o) {
      o & /*categoryRight*/
      512 && M(
        t,
        /*categoryRight*/
        i[9]
      ), o & /*categoryRightColor*/
      2048 && s !== (s = `--chip-color: ${/*categoryRightColor*/
      i[11]};`) && a(e, "style", s);
    },
    d(i) {
      i && L(e);
    }
  };
}
function Ni(l) {
  let e, t, s, i, o, r, c, f, m, u, b, p, g, v, h, x, _, j, w, C, T, q, S, D, Y, A, U, G = (
    /*selected*/
    l[4] ? "Seleccionado" : "Seleccionar video"
  ), he, be, re, F, oe, ee, te, H;
  function B(P, V) {
    return (
      /*thumbnail*/
      P[3] ? Ai : Ti
    );
  }
  let me = B(l), Q = me(l), $ = (
    /*badge*/
    l[6] && bl(l)
  ), K = (
    /*categoryLeft*/
    l[8] && ml(l)
  );
  return {
    c() {
      e = d("div"), t = d("div"), s = d("div"), Q.c(), i = y(), o = d("div"), r = y(), c = d("div"), f = d("div"), m = k(
        /*duration*/
        l[2]
      ), u = y(), $ && $.c(), b = y(), p = d("button"), g = sl("svg"), v = sl("path"), _ = y(), j = d("div"), j.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" class="svelte-1yc0e5f"><path d="M9.2 16.2L5.7 12.7l1.4-1.4 2.1 2.1 7.7-7.7 1.4 1.4z"></path></svg>', w = y(), C = d("div"), T = d("h3"), q = k(
        /*title*/
        l[0]
      ), S = y(), D = d("p"), Y = k(
        /*description*/
        l[1]
      ), A = y(), U = d("div"), he = k(G), oe = y(), K && K.c(), a(o, "class", "thumb-overlay svelte-1yc0e5f"), a(f, "class", "pill svelte-1yc0e5f"), a(c, "class", "pill-row svelte-1yc0e5f"), a(v, "d", "M12.1 21.2c-0.1 0-0.3 0-0.4-0.1C6.1 18.6 2 15 2 10.4 2 7.6 4.3 5.3 7.1 5.3c1.7 0 3.3 0.8 4.3 2.1 1-1.3 2.6-2.1 4.3-2.1 2.8 0 5.1 2.3 5.1 5.1 0 4.6-4.1 8.2-9.7 10.7-0.1 0-0.2 0.1-0.3 0.1z"), a(g, "viewBox", "0 0 24 24"), a(g, "aria-hidden", "true"), a(g, "class", "svelte-1yc0e5f"), a(p, "class", h = "favorite " + /*favorite*/
      (l[7] ? "active" : "") + " svelte-1yc0e5f"), a(p, "aria-label", x = /*favorite*/
      l[7] ? "Quitar de favoritos" : "Anadir a favoritos"), a(j, "class", "check svelte-1yc0e5f"), a(s, "class", "thumb svelte-1yc0e5f"), a(T, "class", "svelte-1yc0e5f"), a(D, "class", "svelte-1yc0e5f"), a(U, "class", be = "cta " + /*selected*/
      (l[4] ? "cta-selected" : "") + " svelte-1yc0e5f"), a(C, "class", "body svelte-1yc0e5f"), a(t, "class", re = "card " + /*selected*/
      (l[4] ? "is-selected" : "") + " " + /*disabled*/
      (l[5] ? "is-disabled" : "") + " svelte-1yc0e5f"), a(t, "role", "button"), a(
        t,
        "aria-disabled",
        /*disabled*/
        l[5]
      ), a(t, "tabindex", F = /*disabled*/
      l[5] ? -1 : 0), a(e, "class", "card-shell svelte-1yc0e5f"), a(e, "style", ee = `--category-left: ${/*categoryLeftColor*/
      l[10]}; --category-right: ${/*categoryRightColor*/
      l[11]};`);
    },
    m(P, V) {
      E(P, e, V), n(e, t), n(t, s), Q.m(s, null), n(s, i), n(s, o), n(s, r), n(s, c), n(c, f), n(f, m), n(c, u), $ && $.m(c, null), n(s, b), n(s, p), n(p, g), n(g, v), n(s, _), n(s, j), n(t, w), n(t, C), n(C, T), n(T, q), n(C, S), n(C, D), n(D, Y), n(C, A), n(C, U), n(U, he), n(e, oe), K && K.m(e, null), te || (H = [
        X(
          p,
          "click",
          /*handleFavorite*/
          l[13]
        ),
        X(
          t,
          "click",
          /*handleSelect*/
          l[12]
        ),
        X(
          t,
          "keydown",
          /*handleKeyDown*/
          l[14]
        )
      ], te = !0);
    },
    p(P, [V]) {
      me === (me = B(P)) && Q ? Q.p(P, V) : (Q.d(1), Q = me(P), Q && (Q.c(), Q.m(s, i))), V & /*duration*/
      4 && M(
        m,
        /*duration*/
        P[2]
      ), /*badge*/
      P[6] ? $ ? $.p(P, V) : ($ = bl(P), $.c(), $.m(c, null)) : $ && ($.d(1), $ = null), V & /*favorite*/
      128 && h !== (h = "favorite " + /*favorite*/
      (P[7] ? "active" : "") + " svelte-1yc0e5f") && a(p, "class", h), V & /*favorite*/
      128 && x !== (x = /*favorite*/
      P[7] ? "Quitar de favoritos" : "Anadir a favoritos") && a(p, "aria-label", x), V & /*title*/
      1 && M(
        q,
        /*title*/
        P[0]
      ), V & /*description*/
      2 && M(
        Y,
        /*description*/
        P[1]
      ), V & /*selected*/
      16 && G !== (G = /*selected*/
      P[4] ? "Seleccionado" : "Seleccionar video") && M(he, G), V & /*selected*/
      16 && be !== (be = "cta " + /*selected*/
      (P[4] ? "cta-selected" : "") + " svelte-1yc0e5f") && a(U, "class", be), V & /*selected, disabled*/
      48 && re !== (re = "card " + /*selected*/
      (P[4] ? "is-selected" : "") + " " + /*disabled*/
      (P[5] ? "is-disabled" : "") + " svelte-1yc0e5f") && a(t, "class", re), V & /*disabled*/
      32 && a(
        t,
        "aria-disabled",
        /*disabled*/
        P[5]
      ), V & /*disabled*/
      32 && F !== (F = /*disabled*/
      P[5] ? -1 : 0) && a(t, "tabindex", F), /*categoryLeft*/
      P[8] ? K ? K.p(P, V) : (K = ml(P), K.c(), K.m(e, null)) : K && (K.d(1), K = null), V & /*categoryLeftColor, categoryRightColor*/
      3072 && ee !== (ee = `--category-left: ${/*categoryLeftColor*/
      P[10]}; --category-right: ${/*categoryRightColor*/
      P[11]};`) && a(e, "style", ee);
    },
    i: I,
    o: I,
    d(P) {
      P && L(e), Q.d(), $ && $.d(), K && K.d(), te = !1, ye(H);
    }
  };
}
function Ii(l, e, t) {
  let { videoId: s = "" } = e, { hashedId: i = "" } = e, { title: o = "" } = e, { description: r = "" } = e, { duration: c = "" } = e, { thumbnail: f = "" } = e, { selected: m = !1 } = e, { disabled: u = !1 } = e, { badge: b = "" } = e, { tags: p = [] } = e, { favorite: g = !1 } = e, { categoryLeft: v = "" } = e, { categoryRight: h = "" } = e, { categoryLeftColor: x = "#94a3b8" } = e, { categoryRightColor: _ = "#94a3b8" } = e;
  const j = Ae(), w = () => {
    u || j("select", { id: s });
  }, C = (q) => {
    q.stopPropagation(), !u && j("favorite", { hashedId: i });
  }, T = (q) => {
    u || (q.key === "Enter" || q.key === " ") && (q.preventDefault(), w());
  };
  return l.$$set = (q) => {
    "videoId" in q && t(15, s = q.videoId), "hashedId" in q && t(16, i = q.hashedId), "title" in q && t(0, o = q.title), "description" in q && t(1, r = q.description), "duration" in q && t(2, c = q.duration), "thumbnail" in q && t(3, f = q.thumbnail), "selected" in q && t(4, m = q.selected), "disabled" in q && t(5, u = q.disabled), "badge" in q && t(6, b = q.badge), "tags" in q && t(17, p = q.tags), "favorite" in q && t(7, g = q.favorite), "categoryLeft" in q && t(8, v = q.categoryLeft), "categoryRight" in q && t(9, h = q.categoryRight), "categoryLeftColor" in q && t(10, x = q.categoryLeftColor), "categoryRightColor" in q && t(11, _ = q.categoryRightColor);
  }, [
    o,
    r,
    c,
    f,
    m,
    u,
    b,
    g,
    v,
    h,
    x,
    _,
    w,
    C,
    T,
    s,
    i,
    p
  ];
}
class bs extends ue {
  constructor(e) {
    super(), fe(
      this,
      e,
      Ii,
      Ni,
      W,
      {
        videoId: 15,
        hashedId: 16,
        title: 0,
        description: 1,
        duration: 2,
        thumbnail: 3,
        selected: 4,
        disabled: 5,
        badge: 6,
        tags: 17,
        favorite: 7,
        categoryLeft: 8,
        categoryRight: 9,
        categoryLeftColor: 10,
        categoryRightColor: 11
      },
      Mi
    );
  }
  get videoId() {
    return this.$$.ctx[15];
  }
  set videoId(e) {
    this.$$set({ videoId: e }), z();
  }
  get hashedId() {
    return this.$$.ctx[16];
  }
  set hashedId(e) {
    this.$$set({ hashedId: e }), z();
  }
  get title() {
    return this.$$.ctx[0];
  }
  set title(e) {
    this.$$set({ title: e }), z();
  }
  get description() {
    return this.$$.ctx[1];
  }
  set description(e) {
    this.$$set({ description: e }), z();
  }
  get duration() {
    return this.$$.ctx[2];
  }
  set duration(e) {
    this.$$set({ duration: e }), z();
  }
  get thumbnail() {
    return this.$$.ctx[3];
  }
  set thumbnail(e) {
    this.$$set({ thumbnail: e }), z();
  }
  get selected() {
    return this.$$.ctx[4];
  }
  set selected(e) {
    this.$$set({ selected: e }), z();
  }
  get disabled() {
    return this.$$.ctx[5];
  }
  set disabled(e) {
    this.$$set({ disabled: e }), z();
  }
  get badge() {
    return this.$$.ctx[6];
  }
  set badge(e) {
    this.$$set({ badge: e }), z();
  }
  get tags() {
    return this.$$.ctx[17];
  }
  set tags(e) {
    this.$$set({ tags: e }), z();
  }
  get favorite() {
    return this.$$.ctx[7];
  }
  set favorite(e) {
    this.$$set({ favorite: e }), z();
  }
  get categoryLeft() {
    return this.$$.ctx[8];
  }
  set categoryLeft(e) {
    this.$$set({ categoryLeft: e }), z();
  }
  get categoryRight() {
    return this.$$.ctx[9];
  }
  set categoryRight(e) {
    this.$$set({ categoryRight: e }), z();
  }
  get categoryLeftColor() {
    return this.$$.ctx[10];
  }
  set categoryLeftColor(e) {
    this.$$set({ categoryLeftColor: e }), z();
  }
  get categoryRightColor() {
    return this.$$.ctx[11];
  }
  set categoryRightColor(e) {
    this.$$set({ categoryRightColor: e }), z();
  }
}
customElements.define("svelte-video-card", de(bs, { videoId: {}, hashedId: {}, title: {}, description: {}, duration: {}, thumbnail: {}, selected: { type: "Boolean" }, disabled: { type: "Boolean" }, badge: {}, tags: {}, favorite: { type: "Boolean" }, categoryLeft: {}, categoryRight: {}, categoryLeftColor: {}, categoryRightColor: {} }, [], [], !0));
function Di(l) {
  const e = l - 1;
  return e * e * e + 1;
}
function yl(l, { delay: e = 0, duration: t = 400, easing: s = Jl } = {}) {
  const i = +getComputedStyle(l).opacity;
  return {
    delay: e,
    duration: t,
    easing: s,
    css: (o) => `opacity: ${o * i}`
  };
}
function et(l, { delay: e = 0, duration: t = 400, easing: s = Di, x: i = 0, y: o = 0, opacity: r = 0 } = {}) {
  const c = getComputedStyle(l), f = +c.opacity, m = c.transform === "none" ? "" : c.transform, u = f * (1 - r), [b, p] = ll(i), [g, v] = ll(o);
  return {
    delay: e,
    duration: t,
    easing: s,
    css: (h, x) => `
			transform: ${m} translate(${(1 - h) * b}${p}, ${(1 - h) * g}${v});
			opacity: ${f - u * x}`
  };
}
function Ri(l) {
  ce(l, "svelte-1hb2737", `.overlay.svelte-1hb2737{position:fixed;inset:0;z-index:70;display:flex;align-items:center;justify-content:center;padding:24px;background:radial-gradient(circle at top, rgba(58, 132, 117, 0.2), rgba(0, 0, 0, 0.6));backdrop-filter:blur(6px)}.card.svelte-1hb2737{position:relative;width:min(520px, 92vw);padding:28px 26px 24px;border-radius:24px;background:linear-gradient(135deg, #ffffff 0%, #f4f6f0 100%);box-shadow:0 18px 40px rgba(0, 0, 0, 0.22),
      0 4px 18px rgba(50, 120, 102, 0.18);overflow:hidden}.card.svelte-1hb2737::before{content:"";position:absolute;inset:-1px;border-radius:24px;padding:1px;background:linear-gradient(130deg, rgba(43, 173, 145, 0.5), rgba(255, 255, 255, 0));-webkit-mask:linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none}.badge.svelte-1hb2737{display:inline-flex;align-items:center;padding:6px 12px;border-radius:999px;background:rgba(46, 140, 120, 0.12);color:#1f5f52;font-size:12px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase}h2.svelte-1hb2737{margin:14px 0 8px;font-size:22px;font-weight:700;color:#1f2a26}p.svelte-1hb2737{margin:0;font-size:14px;line-height:1.5;color:#4b5b56}.actions.svelte-1hb2737{margin-top:18px;display:flex;justify-content:flex-end}button.svelte-1hb2737{border:none;border-radius:12px;padding:10px 18px;font-size:14px;font-weight:600;color:#fff;background:linear-gradient(135deg, #2e8c78, #1f6d5e);box-shadow:0 10px 18px rgba(46, 140, 120, 0.28);cursor:pointer}button.svelte-1hb2737:hover{filter:brightness(1.05)}button.svelte-1hb2737:active{transform:translateY(1px)}@media(max-width: 480px){.card.svelte-1hb2737{padding:22px 20px}h2.svelte-1hb2737{font-size:20px}}`);
}
function _l(l) {
  let e, t, s, i, o, r, c, f, m, u, b, p, g, v, h, x, _, j;
  return {
    c() {
      e = d("div"), t = d("div"), s = d("div"), s.textContent = "Fin de temporada", i = y(), o = d("h2"), r = k(
        /*title*/
        l[1]
      ), c = y(), f = d("p"), m = k(
        /*message*/
        l[2]
      ), u = y(), b = d("div"), p = d("button"), g = k(
        /*cta*/
        l[3]
      ), a(s, "class", "badge svelte-1hb2737"), a(o, "class", "svelte-1hb2737"), a(f, "class", "svelte-1hb2737"), a(p, "type", "button"), a(p, "class", "svelte-1hb2737"), a(b, "class", "actions svelte-1hb2737"), a(t, "class", "card svelte-1hb2737"), a(e, "class", "overlay svelte-1hb2737"), a(e, "role", "button"), a(e, "tabindex", "0"), a(e, "aria-label", "Cerrar aviso de temporada");
    },
    m(w, C) {
      E(w, e, C), n(e, t), n(t, s), n(t, i), n(t, o), n(o, r), n(t, c), n(t, f), n(f, m), n(t, u), n(t, b), n(b, p), n(p, g), x = !0, _ || (j = [
        X(
          p,
          "click",
          /*handleClose*/
          l[4]
        ),
        X(
          e,
          "click",
          /*handleBackdrop*/
          l[5]
        ),
        X(
          e,
          "keydown",
          /*handleKeydown*/
          l[6]
        )
      ], _ = !0);
    },
    p(w, C) {
      (!x || C & /*title*/
      2) && M(
        r,
        /*title*/
        w[1]
      ), (!x || C & /*message*/
      4) && M(
        m,
        /*message*/
        w[2]
      ), (!x || C & /*cta*/
      8) && M(
        g,
        /*cta*/
        w[3]
      );
    },
    i(w) {
      x || (w && Te(() => {
        x && (v || (v = De(t, et, { y: 18, duration: 240 }, !0)), v.run(1));
      }), w && Te(() => {
        x && (h || (h = De(e, yl, { duration: 180 }, !0)), h.run(1));
      }), x = !0);
    },
    o(w) {
      w && (v || (v = De(t, et, { y: 18, duration: 240 }, !1)), v.run(0)), w && (h || (h = De(e, yl, { duration: 180 }, !1)), h.run(0)), x = !1;
    },
    d(w) {
      w && L(e), w && v && v.end(), w && h && h.end(), _ = !1, ye(j);
    }
  };
}
function Pi(l) {
  let e, t = (
    /*open*/
    l[0] && _l(l)
  );
  return {
    c() {
      t && t.c(), e = Re();
    },
    m(s, i) {
      t && t.m(s, i), E(s, e, i);
    },
    p(s, [i]) {
      /*open*/
      s[0] ? t ? (t.p(s, i), i & /*open*/
      1 && We(t, 1)) : (t = _l(s), t.c(), We(t, 1), t.m(e.parentNode, e)) : t && (ls(), Tt(t, 1, 1, () => {
        t = null;
      }), ss());
    },
    i(s) {
      We(t);
    },
    o(s) {
      Tt(t);
    },
    d(s) {
      s && L(e), t && t.d(s);
    }
  };
}
function Yi(l, e, t) {
  let { open: s = !1 } = e, { title: i = "Temporada finalizada" } = e, { message: o = "La temporada actual ha terminado. Tus logros de temporada se reiniciaran para un nuevo ciclo." } = e, { cta: r = "Entendido" } = e;
  const c = Ae(), f = () => {
    t(0, s = !1), c("dismiss");
  }, m = (b) => {
    b.target === b.currentTarget && f();
  }, u = (b) => {
    const p = b.key;
    (p === "Escape" || p === "Enter" || p === " ") && f();
  };
  return l.$$set = (b) => {
    "open" in b && t(0, s = b.open), "title" in b && t(1, i = b.title), "message" in b && t(2, o = b.message), "cta" in b && t(3, r = b.cta);
  }, [s, i, o, r, f, m, u];
}
class ms extends ue {
  constructor(e) {
    super(), fe(this, e, Yi, Pi, W, { open: 0, title: 1, message: 2, cta: 3 }, Ri);
  }
  get open() {
    return this.$$.ctx[0];
  }
  set open(e) {
    this.$$set({ open: e }), z();
  }
  get title() {
    return this.$$.ctx[1];
  }
  set title(e) {
    this.$$set({ title: e }), z();
  }
  get message() {
    return this.$$.ctx[2];
  }
  set message(e) {
    this.$$set({ message: e }), z();
  }
  get cta() {
    return this.$$.ctx[3];
  }
  set cta(e) {
    this.$$set({ cta: e }), z();
  }
}
customElements.define("svelte-season-popup", de(ms, { open: { type: "Boolean" }, title: {}, message: {}, cta: {} }, [], [], !0));
function Xi(l) {
  ce(l, "svelte-1f864m7", ':host{display:inline-block}.token.svelte-1f864m7{position:relative;height:40px;width:64px;border-radius:8px;border:1px solid #e5e7eb;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;line-height:1.1;font-family:inherit;overflow:visible;margin:0 4px}.time.svelte-1f864m7{font-weight:600;font-size:14px;color:inherit}.points.svelte-1f864m7{font-size:10px;opacity:0.8;margin-top:-2px}.points.expired.svelte-1f864m7{text-decoration:line-through}.completed.svelte-1f864m7{background:#8acc9f;color:#ffffff;border-color:#10b981}.open.svelte-1f864m7{background:#ecfdf5;color:#047857;border-color:#6ee7b7;box-shadow:0 4px 10px rgba(16, 185, 129, 0.12);transform:scale(1.2);transition:transform 0.2s ease;transform-origin:center;margin:0 10px}.open.svelte-1f864m7::before,.open.svelte-1f864m7::after,.open.svelte-1f864m7::backdrop{content:"";position:absolute;inset:-10px;border-radius:12px;border:1px solid rgba(16, 185, 129, 0.35);background:radial-gradient(circle, rgba(16, 185, 129, 0.35), rgba(16, 185, 129, 0));opacity:0;animation:svelte-1f864m7-pulse 1.35s ease-out infinite;pointer-events:none}.open.svelte-1f864m7::after{animation-delay:0.45s}.open.svelte-1f864m7::backdrop{animation-delay:0.9s}.expired.svelte-1f864m7{background:#fee2e2;color:#ef4444;border-color:#fca5a5}.upcoming.svelte-1f864m7{background:#f3f4f6;color:#6b7280;border-color:#e5e7eb}@media(min-width: 640px){.token.svelte-1f864m7{height:48px;width:80px;border-radius:10px}.time.svelte-1f864m7{font-size:15px}}@keyframes svelte-1f864m7-pulse{0%{transform:scale(0.85);opacity:0}20%{opacity:0.55}100%{transform:scale(1.4);opacity:0}}');
}
function Oi(l) {
  let e, t = `+${/*points*/
  l[2]} ${/*unit*/
  l[3]}`, s;
  return {
    c() {
      e = d("div"), s = k(t), a(e, "class", "time svelte-1f864m7");
    },
    m(i, o) {
      E(i, e, o), n(e, s);
    },
    p(i, o) {
      o & /*points, unit*/
      12 && t !== (t = `+${/*points*/
      i[2]} ${/*unit*/
      i[3]}`) && M(s, t);
    },
    d(i) {
      i && L(e);
    }
  };
}
function Bi(l) {
  let e, t, s, i, o, r, c, f, m;
  return {
    c() {
      e = d("div"), t = k(
        /*timeLabel*/
        l[1]
      ), s = y(), i = d("div"), o = k("+"), r = k(
        /*points*/
        l[2]
      ), c = y(), f = k(
        /*unit*/
        l[3]
      ), a(e, "class", "time svelte-1f864m7"), a(i, "class", m = "points " + /*status*/
      (l[0] === "expired" ? "expired" : "") + " svelte-1f864m7");
    },
    m(u, b) {
      E(u, e, b), n(e, t), E(u, s, b), E(u, i, b), n(i, o), n(i, r), n(i, c), n(i, f);
    },
    p(u, b) {
      b & /*timeLabel*/
      2 && M(
        t,
        /*timeLabel*/
        u[1]
      ), b & /*points*/
      4 && M(
        r,
        /*points*/
        u[2]
      ), b & /*unit*/
      8 && M(
        f,
        /*unit*/
        u[3]
      ), b & /*status*/
      1 && m !== (m = "points " + /*status*/
      (u[0] === "expired" ? "expired" : "") + " svelte-1f864m7") && a(i, "class", m);
    },
    d(u) {
      u && (L(e), L(s), L(i));
    }
  };
}
function Hi(l) {
  let e, t;
  function s(r, c) {
    return (
      /*timeLabel*/
      r[1] ? Bi : Oi
    );
  }
  let i = s(l), o = i(l);
  return {
    c() {
      e = d("div"), o.c(), a(e, "class", t = "token " + /*label*/
      l[4](
        /*status*/
        l[0]
      ) + " svelte-1f864m7");
    },
    m(r, c) {
      E(r, e, c), o.m(e, null);
    },
    p(r, [c]) {
      i === (i = s(r)) && o ? o.p(r, c) : (o.d(1), o = i(r), o && (o.c(), o.m(e, null))), c & /*status*/
      1 && t !== (t = "token " + /*label*/
      r[4](
        /*status*/
        r[0]
      ) + " svelte-1f864m7") && a(e, "class", t);
    },
    i: I,
    o: I,
    d(r) {
      r && L(e), o.d();
    }
  };
}
function Fi(l, e, t) {
  let { status: s = "upcoming" } = e, { timeLabel: i = "" } = e, { points: o = 20 } = e, { unit: r = "AP" } = e;
  const c = (f) => typeof f == "string" ? f : String(f ?? "");
  return l.$$set = (f) => {
    "status" in f && t(0, s = f.status), "timeLabel" in f && t(1, i = f.timeLabel), "points" in f && t(2, o = f.points), "unit" in f && t(3, r = f.unit);
  }, [s, i, o, r, c];
}
class xs extends ue {
  constructor(e) {
    super(), fe(
      this,
      e,
      Fi,
      Hi,
      W,
      {
        status: 0,
        timeLabel: 1,
        points: 2,
        unit: 3
      },
      Xi
    );
  }
  get status() {
    return this.$$.ctx[0];
  }
  set status(e) {
    this.$$set({ status: e }), z();
  }
  get timeLabel() {
    return this.$$.ctx[1];
  }
  set timeLabel(e) {
    this.$$set({ timeLabel: e }), z();
  }
  get points() {
    return this.$$.ctx[2];
  }
  set points(e) {
    this.$$set({ points: e }), z();
  }
  get unit() {
    return this.$$.ctx[3];
  }
  set unit(e) {
    this.$$set({ unit: e }), z();
  }
}
customElements.define("svelte-quota-token", de(xs, { status: {}, timeLabel: {}, points: {}, unit: {} }, [], [], !0));
function Vi(l) {
  ce(l, "svelte-p2zlwf", ":host{display:block;font-family:inherit}.panel.svelte-p2zlwf.svelte-p2zlwf{display:grid;gap:18px;animation:svelte-p2zlwf-panel-rise 0.4s ease}.hero.svelte-p2zlwf.svelte-p2zlwf{position:relative;border-radius:22px;padding:18px 20px;background:linear-gradient(130deg, #f8fafc, #ecfdf5);border:1px solid #e2e8f0;display:grid;gap:14px;overflow:hidden}.hero-cards.svelte-p2zlwf.svelte-p2zlwf{display:grid;grid-template-columns:repeat(auto-fit, minmax(160px, 1fr));gap:10px}.hero-card.svelte-p2zlwf.svelte-p2zlwf{border-radius:16px;padding:10px 12px;background:rgba(255, 255, 255, 0.8);border:1px solid rgba(226, 232, 240, 0.9);display:grid;gap:4px}.hero-card.accent.svelte-p2zlwf.svelte-p2zlwf{background:linear-gradient(120deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.08));border-color:rgba(16, 185, 129, 0.4)}.orb.svelte-p2zlwf.svelte-p2zlwf{position:absolute;right:18px;top:-10px;width:120px;height:120px;border-radius:999px;background:radial-gradient(circle, rgba(16, 185, 129, 0.22), transparent 65%);animation:svelte-p2zlwf-float 6s ease-in-out infinite}.orb.small.svelte-p2zlwf.svelte-p2zlwf{right:120px;top:60px;width:72px;height:72px;animation-delay:1.4s;opacity:0.7}.eyebrow.svelte-p2zlwf.svelte-p2zlwf{text-transform:uppercase;font-size:11px;letter-spacing:0.12em;color:#94a3b8;margin:0 0 6px}h1.svelte-p2zlwf.svelte-p2zlwf{margin:0;font-size:22px;font-weight:700;color:#0f172a}.email.svelte-p2zlwf.svelte-p2zlwf{margin:4px 0 0;color:#64748b;font-size:13px}.grid.svelte-p2zlwf.svelte-p2zlwf{display:grid;gap:12px;grid-template-columns:repeat(auto-fit, minmax(160px, 1fr))}.grid.two.svelte-p2zlwf.svelte-p2zlwf{grid-template-columns:repeat(auto-fit, minmax(220px, 1fr))}.card.svelte-p2zlwf.svelte-p2zlwf{background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;padding:12px 14px;display:grid;gap:6px;position:relative;overflow:hidden}.card.svelte-p2zlwf span.svelte-p2zlwf{font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#94a3b8}.card.svelte-p2zlwf strong.svelte-p2zlwf{font-size:20px;color:#0f172a}.section.svelte-p2zlwf.svelte-p2zlwf{background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;padding:16px;position:relative}.xp.svelte-p2zlwf.svelte-p2zlwf{overflow:hidden}.xp-toggle.svelte-p2zlwf.svelte-p2zlwf{width:100%;border:none;background:transparent;display:flex;align-items:center;justify-content:space-between;gap:12px;cursor:pointer;padding:0;margin-bottom:10px}.xp-toggle.svelte-p2zlwf h2.svelte-p2zlwf{margin:0}.xp-toggle.svelte-p2zlwf span.svelte-p2zlwf{display:inline-flex;align-items:center;justify-content:center;height:28px;width:28px;border-radius:999px;background:#ecfdf5;color:#10b981;transition:transform 0.2s ease;font-weight:700}.xp-toggle.svelte-p2zlwf span.rotated.svelte-p2zlwf{transform:rotate(180deg)}.xp-controls.svelte-p2zlwf.svelte-p2zlwf{display:grid;grid-template-columns:repeat(auto-fit, minmax(140px, 1fr));gap:8px;margin-bottom:10px}.xp-controls.svelte-p2zlwf label.svelte-p2zlwf{display:grid;gap:4px;font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em}.xp-controls.svelte-p2zlwf input.svelte-p2zlwf{border:1px solid #e2e8f0;border-radius:10px;padding:6px 8px;font-size:12px;color:#0f172a;background:#fff}.xp-controls.svelte-p2zlwf .ghost.svelte-p2zlwf,.xp-controls.svelte-p2zlwf .apply.svelte-p2zlwf,.xp-footer.svelte-p2zlwf .apply.svelte-p2zlwf{border:none;border-radius:10px;padding:8px 10px;font-size:12px;font-weight:600;cursor:pointer}.xp-controls.svelte-p2zlwf .ghost.svelte-p2zlwf{background:#f1f5f9;color:#334155}.xp-controls.svelte-p2zlwf .apply.svelte-p2zlwf,.xp-footer.svelte-p2zlwf .apply.svelte-p2zlwf{background:#10b981;color:#fff}.xp-footer.svelte-p2zlwf.svelte-p2zlwf{display:flex;align-items:center;justify-content:space-between;margin-top:8px}.section.svelte-p2zlwf h2.svelte-p2zlwf{margin:0 0 10px;font-size:15px;font-weight:700;color:#0f172a}.row.svelte-p2zlwf.svelte-p2zlwf{display:flex;justify-content:space-between;align-items:center}.days.svelte-p2zlwf.svelte-p2zlwf{display:flex;flex-wrap:wrap;gap:8px}.days.svelte-p2zlwf span.svelte-p2zlwf{height:36px;width:36px;border-radius:999px;display:grid;place-items:center;font-size:12px;font-weight:700;background:#f1f5f9;color:#94a3b8}.days.svelte-p2zlwf span.active.svelte-p2zlwf{background:#10b981;color:#ffffff}.list.svelte-p2zlwf.svelte-p2zlwf{display:grid;gap:8px}.list-item.svelte-p2zlwf.svelte-p2zlwf{display:flex;justify-content:space-between;align-items:center;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:8px 12px;font-size:12px;color:#334155}.list-item.svelte-p2zlwf .timestamp.svelte-p2zlwf{display:block;font-size:11px;color:#94a3b8;margin-top:2px}.accent.svelte-p2zlwf.svelte-p2zlwf{color:#10b981;font-weight:700}.line.svelte-p2zlwf.svelte-p2zlwf{display:flex;justify-content:space-between;font-size:13px;color:#334155;padding:4px 0}.muted.svelte-p2zlwf.svelte-p2zlwf{color:#94a3b8;font-size:13px}ul.svelte-p2zlwf.svelte-p2zlwf{margin:0;padding-left:18px;color:#475569;display:grid;gap:6px;font-size:13px}@keyframes svelte-p2zlwf-panel-rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}@keyframes svelte-p2zlwf-float{0%,100%{transform:translateY(0)}50%{transform:translateY(12px)}}");
}
function wl(l, e, t) {
  const s = l.slice();
  return s[41] = e[t], s;
}
function kl(l, e, t) {
  const s = l.slice();
  return s[44] = e[t], s;
}
function zl(l, e, t) {
  const s = l.slice();
  return s[47] = e[t], s;
}
function ql(l, e, t) {
  const s = l.slice();
  return s[50] = e[t], s;
}
function jl(l, e, t) {
  const s = l.slice();
  return s[53] = e[t], s[55] = t, s;
}
function Cl(l) {
  let e, t;
  return {
    c() {
      e = d("p"), t = k(
        /*email*/
        l[1]
      ), a(e, "class", "email svelte-p2zlwf");
    },
    m(s, i) {
      E(s, e, i), n(e, t);
    },
    p(s, i) {
      i[0] & /*email*/
      2 && M(
        t,
        /*email*/
        s[1]
      );
    },
    d(s) {
      s && L(e);
    }
  };
}
function Sl(l) {
  let e;
  return {
    c() {
      e = d("span"), e.textContent = `${/*label*/
      l[53]}`, a(e, "class", "svelte-p2zlwf"), Ze(
        e,
        "active",
        /*activeDays*/
        l[13].includes(
          /*index*/
          l[55] + 1
        )
      );
    },
    m(t, s) {
      E(t, e, s);
    },
    p(t, s) {
      s[0] & /*activeDays*/
      8192 && Ze(
        e,
        "active",
        /*activeDays*/
        t[13].includes(
          /*index*/
          t[55] + 1
        )
      );
    },
    d(t) {
      t && L(e);
    }
  };
}
function Ll(l) {
  let e, t, s, i, o, r, c, f, m, u, b, p, g, v, h, x, _, j;
  const w = [Ui, $i], C = [];
  function T(q, S) {
    return (
      /*xpItems*/
      q[3].length === 0 ? 0 : 1
    );
  }
  return v = T(l), h = C[v] = w[v](l), {
    c() {
      e = d("div"), t = d("label"), s = k(`Desde
          `), i = d("input"), o = y(), r = d("label"), c = k(`Hasta
          `), f = d("input"), m = y(), u = d("button"), u.textContent = "Limpiar", b = y(), p = d("button"), p.textContent = "Aplicar", g = y(), h.c(), x = Re(), a(i, "type", "date"), a(i, "class", "svelte-p2zlwf"), a(t, "class", "svelte-p2zlwf"), a(f, "type", "date"), a(f, "class", "svelte-p2zlwf"), a(r, "class", "svelte-p2zlwf"), a(u, "type", "button"), a(u, "class", "ghost svelte-p2zlwf"), a(p, "type", "button"), a(p, "class", "apply svelte-p2zlwf"), a(e, "class", "xp-controls svelte-p2zlwf");
    },
    m(q, S) {
      E(q, e, S), n(e, t), n(t, s), n(t, i), Ee(
        i,
        /*filterFrom*/
        l[6]
      ), n(e, o), n(e, r), n(r, c), n(r, f), Ee(
        f,
        /*filterTo*/
        l[7]
      ), n(e, m), n(e, u), n(e, b), n(e, p), E(q, g, S), C[v].m(q, S), E(q, x, S), _ || (j = [
        X(
          i,
          "input",
          /*input0_input_handler*/
          l[35]
        ),
        X(
          f,
          "input",
          /*input1_input_handler*/
          l[36]
        ),
        X(u, "click", Et(
          /*click_handler_1*/
          l[37]
        )),
        X(p, "click", Et(
          /*click_handler_2*/
          l[38]
        ))
      ], _ = !0);
    },
    p(q, S) {
      S[0] & /*filterFrom*/
      64 && Ee(
        i,
        /*filterFrom*/
        q[6]
      ), S[0] & /*filterTo*/
      128 && Ee(
        f,
        /*filterTo*/
        q[7]
      );
      let D = v;
      v = T(q), v === D ? C[v].p(q, S) : (ls(), Tt(C[D], 1, 1, () => {
        C[D] = null;
      }), ss(), h = C[v], h ? h.p(q, S) : (h = C[v] = w[v](q), h.c()), We(h, 1), h.m(x.parentNode, x));
    },
    d(q) {
      q && (L(e), L(g), L(x)), C[v].d(q), _ = !1, ye(j);
    }
  };
}
function $i(l) {
  let e, t, s, i, o, r, c, f, m, u, b, p = ne(
    /*xpItems*/
    l[3]
  ), g = [];
  for (let h = 0; h < p.length; h += 1)
    g[h] = El(ql(l, p, h));
  let v = (
    /*shownCount*/
    l[8] < /*totalCount*/
    l[2] && Ml(l)
  );
  return {
    c() {
      e = d("div");
      for (let h = 0; h < g.length; h += 1)
        g[h].c();
      s = y(), i = d("div"), o = d("span"), r = k("Mostrando "), c = k(
        /*shownCount*/
        l[8]
      ), f = k(" de "), m = k(
        /*totalCount*/
        l[2]
      ), u = y(), v && v.c(), a(e, "class", "list svelte-p2zlwf"), a(o, "class", "muted svelte-p2zlwf"), a(i, "class", "xp-footer svelte-p2zlwf");
    },
    m(h, x) {
      E(h, e, x);
      for (let _ = 0; _ < g.length; _ += 1)
        g[_] && g[_].m(e, null);
      E(h, s, x), E(h, i, x), n(i, o), n(o, r), n(o, c), n(o, f), n(o, m), n(i, u), v && v.m(i, null), b = !0;
    },
    p(h, x) {
      if (x[0] & /*xpItems, formatTimestamp, getXpLabel*/
      393224) {
        p = ne(
          /*xpItems*/
          h[3]
        );
        let _;
        for (_ = 0; _ < p.length; _ += 1) {
          const j = ql(h, p, _);
          g[_] ? g[_].p(j, x) : (g[_] = El(j), g[_].c(), g[_].m(e, null));
        }
        for (; _ < g.length; _ += 1)
          g[_].d(1);
        g.length = p.length;
      }
      (!b || x[0] & /*shownCount*/
      256) && M(
        c,
        /*shownCount*/
        h[8]
      ), (!b || x[0] & /*totalCount*/
      4) && M(
        m,
        /*totalCount*/
        h[2]
      ), /*shownCount*/
      h[8] < /*totalCount*/
      h[2] ? v ? v.p(h, x) : (v = Ml(h), v.c(), v.m(i, null)) : v && (v.d(1), v = null);
    },
    i(h) {
      b || (h && Te(() => {
        b && (t || (t = De(e, et, { y: 6, duration: 180 }, !0)), t.run(1));
      }), b = !0);
    },
    o(h) {
      h && (t || (t = De(e, et, { y: 6, duration: 180 }, !1)), t.run(0)), b = !1;
    },
    d(h) {
      h && (L(e), L(s), L(i)), tt(g, h), h && t && t.end(), v && v.d();
    }
  };
}
function Ui(l) {
  let e, t, s;
  return {
    c() {
      e = d("p"), e.textContent = "Sin movimientos recientes.", a(e, "class", "muted svelte-p2zlwf");
    },
    m(i, o) {
      E(i, e, o), s = !0;
    },
    p: I,
    i(i) {
      s || (i && Te(() => {
        s && (t || (t = De(e, et, { y: 6, duration: 180 }, !0)), t.run(1));
      }), s = !0);
    },
    o(i) {
      i && (t || (t = De(e, et, { y: 6, duration: 180 }, !1)), t.run(0)), s = !1;
    },
    d(i) {
      i && L(e), i && t && t.end();
    }
  };
}
function El(l) {
  var _, j;
  let e, t, s, i = (
    /*getXpLabel*/
    l[17](
      /*entry*/
      l[50]
    ) + ""
  ), o, r, c, f = (
    /*formatTimestamp*/
    l[18](
      /*entry*/
      (_ = l[50]) == null ? void 0 : _.created_at
    ) + ""
  ), m, u, b, p, g = (
    /*entry*/
    (((j = l[50]) == null ? void 0 : j.points) ?? 0) + ""
  ), v, h, x;
  return {
    c() {
      e = d("div"), t = d("div"), s = d("span"), o = k(i), r = y(), c = d("span"), m = k(f), u = y(), b = d("span"), p = k("+"), v = k(g), h = k(" PA"), x = y(), a(c, "class", "timestamp svelte-p2zlwf"), a(b, "class", "accent svelte-p2zlwf"), a(e, "class", "list-item svelte-p2zlwf");
    },
    m(w, C) {
      E(w, e, C), n(e, t), n(t, s), n(s, o), n(t, r), n(t, c), n(c, m), n(e, u), n(e, b), n(b, p), n(b, v), n(b, h), n(e, x);
    },
    p(w, C) {
      var T, q;
      C[0] & /*xpItems*/
      8 && i !== (i = /*getXpLabel*/
      w[17](
        /*entry*/
        w[50]
      ) + "") && M(o, i), C[0] & /*xpItems*/
      8 && f !== (f = /*formatTimestamp*/
      w[18](
        /*entry*/
        (T = w[50]) == null ? void 0 : T.created_at
      ) + "") && M(m, f), C[0] & /*xpItems*/
      8 && g !== (g = /*entry*/
      (((q = w[50]) == null ? void 0 : q.points) ?? 0) + "") && M(v, g);
    },
    d(w) {
      w && L(e);
    }
  };
}
function Ml(l) {
  let e, t, s;
  return {
    c() {
      e = d("button"), e.textContent = "Ver más", a(e, "type", "button"), a(e, "class", "apply svelte-p2zlwf");
    },
    m(i, o) {
      E(i, e, o), t || (s = X(e, "click", Et(
        /*click_handler_3*/
        l[39]
      )), t = !0);
    },
    p: I,
    d(i) {
      i && L(e), t = !1, s();
    }
  };
}
function Gi(l) {
  let e, t = ne(
    /*categories*/
    l[12].slice(0, 8)
  ), s = [];
  for (let i = 0; i < t.length; i += 1)
    s[i] = Tl(zl(l, t, i));
  return {
    c() {
      for (let i = 0; i < s.length; i += 1)
        s[i].c();
      e = Re();
    },
    m(i, o) {
      for (let r = 0; r < s.length; r += 1)
        s[r] && s[r].m(i, o);
      E(i, e, o);
    },
    p(i, o) {
      if (o[0] & /*categories*/
      4096) {
        t = ne(
          /*categories*/
          i[12].slice(0, 8)
        );
        let r;
        for (r = 0; r < t.length; r += 1) {
          const c = zl(i, t, r);
          s[r] ? s[r].p(c, o) : (s[r] = Tl(c), s[r].c(), s[r].m(e.parentNode, e));
        }
        for (; r < s.length; r += 1)
          s[r].d(1);
        s.length = t.length;
      }
    },
    d(i) {
      i && L(e), tt(s, i);
    }
  };
}
function Ji(l) {
  let e;
  return {
    c() {
      e = d("p"), e.textContent = "Sin actividad registrada.", a(e, "class", "muted svelte-p2zlwf");
    },
    m(t, s) {
      E(t, e, s);
    },
    p: I,
    d(t) {
      t && L(e);
    }
  };
}
function Tl(l) {
  let e, t, s = (
    /*cat*/
    l[47].category + ""
  ), i, o, r, c = (
    /*cat*/
    l[47].total_sessions + ""
  ), f, m;
  return {
    c() {
      e = d("div"), t = d("span"), i = k(s), o = y(), r = d("strong"), f = k(c), m = y(), a(t, "class", "svelte-p2zlwf"), a(r, "class", "svelte-p2zlwf"), a(e, "class", "line svelte-p2zlwf");
    },
    m(u, b) {
      E(u, e, b), n(e, t), n(t, i), n(e, o), n(e, r), n(r, f), n(e, m);
    },
    p(u, b) {
      b[0] & /*categories*/
      4096 && s !== (s = /*cat*/
      u[47].category + "") && M(i, s), b[0] & /*categories*/
      4096 && c !== (c = /*cat*/
      u[47].total_sessions + "") && M(f, c);
    },
    d(u) {
      u && L(e);
    }
  };
}
function Qi(l) {
  let e, t = ne(
    /*favorites*/
    l[11].slice(0, 8)
  ), s = [];
  for (let i = 0; i < t.length; i += 1)
    s[i] = Al(kl(l, t, i));
  return {
    c() {
      for (let i = 0; i < s.length; i += 1)
        s[i].c();
      e = Re();
    },
    m(i, o) {
      for (let r = 0; r < s.length; r += 1)
        s[r] && s[r].m(i, o);
      E(i, e, o);
    },
    p(i, o) {
      if (o[0] & /*favorites*/
      2048) {
        t = ne(
          /*favorites*/
          i[11].slice(0, 8)
        );
        let r;
        for (r = 0; r < t.length; r += 1) {
          const c = kl(i, t, r);
          s[r] ? s[r].p(c, o) : (s[r] = Al(c), s[r].c(), s[r].m(e.parentNode, e));
        }
        for (; r < s.length; r += 1)
          s[r].d(1);
        s.length = t.length;
      }
    },
    d(i) {
      i && L(e), tt(s, i);
    }
  };
}
function Ki(l) {
  let e;
  return {
    c() {
      e = d("p"), e.textContent = "Aún no hay ejercicios destacados.", a(e, "class", "muted svelte-p2zlwf");
    },
    m(t, s) {
      E(t, e, s);
    },
    p: I,
    d(t) {
      t && L(e);
    }
  };
}
function Al(l) {
  let e, t, s = (
    /*fav*/
    l[44].title + ""
  ), i, o, r, c = (
    /*fav*/
    l[44].total_sessions + ""
  ), f, m, u;
  return {
    c() {
      e = d("div"), t = d("span"), i = k(s), o = y(), r = d("strong"), f = k(c), m = k("x"), u = y(), a(t, "class", "svelte-p2zlwf"), a(r, "class", "svelte-p2zlwf"), a(e, "class", "line svelte-p2zlwf");
    },
    m(b, p) {
      E(b, e, p), n(e, t), n(t, i), n(e, o), n(e, r), n(r, f), n(r, m), n(e, u);
    },
    p(b, p) {
      p[0] & /*favorites*/
      2048 && s !== (s = /*fav*/
      b[44].title + "") && M(i, s), p[0] & /*favorites*/
      2048 && c !== (c = /*fav*/
      b[44].total_sessions + "") && M(f, c);
    },
    d(b) {
      b && L(e);
    }
  };
}
function Wi(l) {
  let e, t = ne(
    /*insightItems*/
    l[10]
  ), s = [];
  for (let i = 0; i < t.length; i += 1)
    s[i] = Nl(wl(l, t, i));
  return {
    c() {
      e = d("ul");
      for (let i = 0; i < s.length; i += 1)
        s[i].c();
      a(e, "class", "svelte-p2zlwf");
    },
    m(i, o) {
      E(i, e, o);
      for (let r = 0; r < s.length; r += 1)
        s[r] && s[r].m(e, null);
    },
    p(i, o) {
      if (o[0] & /*insightItems*/
      1024) {
        t = ne(
          /*insightItems*/
          i[10]
        );
        let r;
        for (r = 0; r < t.length; r += 1) {
          const c = wl(i, t, r);
          s[r] ? s[r].p(c, o) : (s[r] = Nl(c), s[r].c(), s[r].m(e, null));
        }
        for (; r < s.length; r += 1)
          s[r].d(1);
        s.length = t.length;
      }
    },
    d(i) {
      i && L(e), tt(s, i);
    }
  };
}
function Zi(l) {
  let e;
  return {
    c() {
      e = d("p"), e.textContent = "Sin insights por ahora.", a(e, "class", "muted svelte-p2zlwf");
    },
    m(t, s) {
      E(t, e, s);
    },
    p: I,
    d(t) {
      t && L(e);
    }
  };
}
function Nl(l) {
  let e, t = (
    /*item*/
    l[41] + ""
  ), s;
  return {
    c() {
      e = d("li"), s = k(t);
    },
    m(i, o) {
      E(i, e, o), n(e, s);
    },
    p(i, o) {
      o[0] & /*insightItems*/
      1024 && t !== (t = /*item*/
      i[41] + "") && M(s, t);
    },
    d(i) {
      i && L(e);
    }
  };
}
function en(l) {
  let e, t, s, i, o, r, c, f, m, u, b, p, g, v, h = (
    /*summaryData*/
    l[15].total_exercises + ""
  ), x, _, j, w, C, T, q = (
    /*summaryData*/
    l[15].weekly_sessions + ""
  ), S, D, Y, A, U, G, he = Number(
    /*summaryData*/
    l[15].avg_satisfaction || 0
  ).toFixed(1) + "", be, re, F, oe, ee, te, H, B, me, Q, $, K, P = (
    /*summaryData*/
    l[15].distinct_days + ""
  ), V, N, J, qe, Ne, _e, ie = (
    /*formatMinutes*/
    l[16](
      /*timeData*/
      l[14].week_minutes
    ) + ""
  ), ae, xe, le, O, ve, Z, Pe = (
    /*formatMinutes*/
    l[16](
      /*timeData*/
      l[14].month_minutes
    ) + ""
  ), _t, Rt, Fe, Ve, at, Pt, lt, ct = (
    /*activeDays*/
    l[13].length + ""
  ), wt, Yt, Xt, st, Ot, Ye, Ie, kt, Bt, $e, Ht, Ft, Ue, Xe, zt, Vt, $t, Oe, qt, Ut, Gt, Be, ft, Jt, jt, Qt, we = (
    /*email*/
    l[1] && Cl(l)
  ), Ct = ne(["L", "M", "X", "J", "V", "S", "D"]), je = [];
  for (let R = 0; R < 7; R += 1)
    je[R] = Sl(jl(l, Ct, R));
  let ke = (
    /*xpOpen*/
    l[5] && Ll(l)
  );
  function Kt(R, se) {
    return (
      /*categories*/
      R[12].length === 0 ? Ji : Gi
    );
  }
  let dt = Kt(l), Ce = dt(l);
  function Wt(R, se) {
    return (
      /*favorites*/
      R[11].length === 0 ? Ki : Qi
    );
  }
  let ut = Wt(l), Se = ut(l);
  function Zt(R, se) {
    return (
      /*insightItems*/
      R[10].length === 0 ? Zi : Wi
    );
  }
  let pt = Zt(l), Le = pt(l);
  return {
    c() {
      e = d("div"), t = d("section"), s = d("div"), i = d("p"), i.textContent = "Estadísticas avanzadas", o = y(), r = d("h1"), c = k(
        /*name*/
        l[0]
      ), f = y(), we && we.c(), m = y(), u = d("div"), b = d("div"), p = d("span"), p.textContent = "Total de pausas", g = y(), v = d("strong"), x = k(h), _ = y(), j = d("div"), w = d("span"), w.textContent = "Sesiones esta semana", C = y(), T = d("strong"), S = k(q), D = y(), Y = d("div"), A = d("span"), A.textContent = "Satisfacción promedio", U = y(), G = d("strong"), be = k(he), re = k(" / 5"), F = y(), oe = d("div"), ee = y(), te = d("div"), H = y(), B = d("section"), me = d("div"), Q = d("span"), Q.textContent = "Días activos", $ = y(), K = d("strong"), V = k(P), N = y(), J = d("div"), qe = d("span"), qe.textContent = "Tiempo saludable (7 días)", Ne = y(), _e = d("strong"), ae = k(ie), xe = y(), le = d("div"), O = d("span"), O.textContent = "Tiempo saludable (30 días)", ve = y(), Z = d("strong"), _t = k(Pe), Rt = y(), Fe = d("section"), Ve = d("div"), at = d("h2"), at.textContent = "Actividad semanal", Pt = y(), lt = d("span"), wt = k(ct), Yt = k("/7 días activos"), Xt = y(), st = d("div");
      for (let R = 0; R < 7; R += 1)
        je[R].c();
      Ot = y(), Ye = d("section"), Ie = d("button"), kt = d("div"), kt.innerHTML = '<h2 class="svelte-p2zlwf">Historial de XP</h2> <p class="muted svelte-p2zlwf">Últimos movimientos</p>', Bt = y(), $e = d("span"), $e.textContent = "⌄", Ht = y(), ke && ke.c(), Ft = y(), Ue = d("section"), Xe = d("div"), zt = d("h3"), zt.textContent = "Categorías favoritas", Vt = y(), Ce.c(), $t = y(), Oe = d("div"), qt = d("h3"), qt.textContent = "Ejercicios más repetidos", Ut = y(), Se.c(), Gt = y(), Be = d("section"), ft = d("h2"), ft.textContent = "Insights", Jt = y(), Le.c(), a(i, "class", "eyebrow svelte-p2zlwf"), a(r, "class", "svelte-p2zlwf"), a(b, "class", "hero-card svelte-p2zlwf"), a(j, "class", "hero-card accent svelte-p2zlwf"), a(Y, "class", "hero-card svelte-p2zlwf"), a(u, "class", "hero-cards svelte-p2zlwf"), a(oe, "class", "orb svelte-p2zlwf"), a(te, "class", "orb small svelte-p2zlwf"), a(t, "class", "hero svelte-p2zlwf"), a(Q, "class", "svelte-p2zlwf"), a(K, "class", "svelte-p2zlwf"), a(me, "class", "card svelte-p2zlwf"), a(qe, "class", "svelte-p2zlwf"), a(_e, "class", "svelte-p2zlwf"), a(J, "class", "card svelte-p2zlwf"), a(O, "class", "svelte-p2zlwf"), a(Z, "class", "svelte-p2zlwf"), a(le, "class", "card svelte-p2zlwf"), a(B, "class", "grid svelte-p2zlwf"), a(at, "class", "svelte-p2zlwf"), a(lt, "class", "muted svelte-p2zlwf"), a(Ve, "class", "row svelte-p2zlwf"), a(st, "class", "days svelte-p2zlwf"), a(Fe, "class", "section svelte-p2zlwf"), a($e, "class", "svelte-p2zlwf"), Ze(
        $e,
        "rotated",
        /*xpOpen*/
        l[5]
      ), a(Ie, "type", "button"), a(Ie, "class", "xp-toggle svelte-p2zlwf"), a(Ye, "class", "section xp svelte-p2zlwf"), a(Xe, "class", "card svelte-p2zlwf"), a(Oe, "class", "card svelte-p2zlwf"), a(Ue, "class", "grid two svelte-p2zlwf"), a(ft, "class", "svelte-p2zlwf"), a(Be, "class", "section svelte-p2zlwf"), a(e, "class", "panel svelte-p2zlwf");
    },
    m(R, se) {
      E(R, e, se), n(e, t), n(t, s), n(s, i), n(s, o), n(s, r), n(r, c), n(s, f), we && we.m(s, null), n(t, m), n(t, u), n(u, b), n(b, p), n(b, g), n(b, v), n(v, x), n(u, _), n(u, j), n(j, w), n(j, C), n(j, T), n(T, S), n(u, D), n(u, Y), n(Y, A), n(Y, U), n(Y, G), n(G, be), n(G, re), n(t, F), n(t, oe), n(t, ee), n(t, te), n(e, H), n(e, B), n(B, me), n(me, Q), n(me, $), n(me, K), n(K, V), n(B, N), n(B, J), n(J, qe), n(J, Ne), n(J, _e), n(_e, ae), n(B, xe), n(B, le), n(le, O), n(le, ve), n(le, Z), n(Z, _t), n(e, Rt), n(e, Fe), n(Fe, Ve), n(Ve, at), n(Ve, Pt), n(Ve, lt), n(lt, wt), n(lt, Yt), n(Fe, Xt), n(Fe, st);
      for (let ge = 0; ge < 7; ge += 1)
        je[ge] && je[ge].m(st, null);
      n(e, Ot), n(e, Ye), n(Ye, Ie), n(Ie, kt), n(Ie, Bt), n(Ie, $e), n(Ye, Ht), ke && ke.m(Ye, null), n(e, Ft), n(e, Ue), n(Ue, Xe), n(Xe, zt), n(Xe, Vt), Ce.m(Xe, null), n(Ue, $t), n(Ue, Oe), n(Oe, qt), n(Oe, Ut), Se.m(Oe, null), n(e, Gt), n(e, Be), n(Be, ft), n(Be, Jt), Le.m(Be, null), jt || (Qt = X(
        Ie,
        "click",
        /*click_handler*/
        l[34]
      ), jt = !0);
    },
    p(R, se) {
      if (se[0] & /*name*/
      1 && M(
        c,
        /*name*/
        R[0]
      ), /*email*/
      R[1] ? we ? we.p(R, se) : (we = Cl(R), we.c(), we.m(s, null)) : we && (we.d(1), we = null), se[0] & /*summaryData*/
      32768 && h !== (h = /*summaryData*/
      R[15].total_exercises + "") && M(x, h), se[0] & /*summaryData*/
      32768 && q !== (q = /*summaryData*/
      R[15].weekly_sessions + "") && M(S, q), se[0] & /*summaryData*/
      32768 && he !== (he = Number(
        /*summaryData*/
        R[15].avg_satisfaction || 0
      ).toFixed(1) + "") && M(be, he), se[0] & /*summaryData*/
      32768 && P !== (P = /*summaryData*/
      R[15].distinct_days + "") && M(V, P), se[0] & /*timeData*/
      16384 && ie !== (ie = /*formatMinutes*/
      R[16](
        /*timeData*/
        R[14].week_minutes
      ) + "") && M(ae, ie), se[0] & /*timeData*/
      16384 && Pe !== (Pe = /*formatMinutes*/
      R[16](
        /*timeData*/
        R[14].month_minutes
      ) + "") && M(_t, Pe), se[0] & /*activeDays*/
      8192 && ct !== (ct = /*activeDays*/
      R[13].length + "") && M(wt, ct), se[0] & /*activeDays*/
      8192) {
        Ct = ne(["L", "M", "X", "J", "V", "S", "D"]);
        let ge;
        for (ge = 0; ge < 7; ge += 1) {
          const el = jl(R, Ct, ge);
          je[ge] ? je[ge].p(el, se) : (je[ge] = Sl(el), je[ge].c(), je[ge].m(st, null));
        }
        for (; ge < 7; ge += 1)
          je[ge].d(1);
      }
      se[0] & /*xpOpen*/
      32 && Ze(
        $e,
        "rotated",
        /*xpOpen*/
        R[5]
      ), /*xpOpen*/
      R[5] ? ke ? ke.p(R, se) : (ke = Ll(R), ke.c(), ke.m(Ye, null)) : ke && (ke.d(1), ke = null), dt === (dt = Kt(R)) && Ce ? Ce.p(R, se) : (Ce.d(1), Ce = dt(R), Ce && (Ce.c(), Ce.m(Xe, null))), ut === (ut = Wt(R)) && Se ? Se.p(R, se) : (Se.d(1), Se = ut(R), Se && (Se.c(), Se.m(Oe, null))), pt === (pt = Zt(R)) && Le ? Le.p(R, se) : (Le.d(1), Le = pt(R), Le && (Le.c(), Le.m(Be, null)));
    },
    i: I,
    o: I,
    d(R) {
      R && L(e), we && we.d(), tt(je, R), ke && ke.d(), Ce.d(), Se.d(), Le.d(), jt = !1, Qt();
    }
  };
}
function tn(l, e, t) {
  let s, i, o, r, c, f, m, u, b, p, g, { name: v = "Usuario" } = e, { email: h = "" } = e, { summary: x = "" } = e, { timeSummary: _ = "" } = e, { weeklyActiveDays: j = "" } = e, { xpHistory: w = "" } = e, { categoryDistribution: C = "" } = e, { favoriteVideos: T = "" } = e, { insights: q = "" } = e, { xpTotal: S = 0 } = e, { xpLimit: D = 10 } = e, { xpOffset: Y = 0 } = e, { xpFrom: A = "" } = e, { xpTo: U = "" } = e;
  const G = (N, J) => {
    if (!N || typeof N != "string") return J;
    try {
      return JSON.parse(N);
    } catch {
      return J;
    }
  }, he = (N) => N ? N < 60 ? `${Math.round(N)} min` : `${(N / 60).toFixed(1)} h` : "0 min", be = (N) => {
    var qe, Ne;
    const J = ((qe = N == null ? void 0 : N.metadata) == null ? void 0 : qe.source) || (N == null ? void 0 : N.action_type) || "XP";
    if (J === "achievement") {
      const _e = (Ne = N == null ? void 0 : N.metadata) == null ? void 0 : Ne.achievement_title;
      return _e ? `Logro · ${_e}` : "Logro";
    }
    return J === "weekly_challenge" ? "Reto semanal" : J === "questionnaire" ? "Cuestionario" : J === "active_pause" || J === "pause" ? "Pausa activa" : "XP";
  }, re = (N) => {
    if (!N) return "";
    const J = new Date(N);
    return Number.isNaN(J.getTime()) ? "" : J.toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" });
  }, F = Ae();
  let oe = !1, ee = A, te = U, H = A, B = U;
  const me = () => t(5, oe = !oe);
  function Q() {
    ee = this.value, t(6, ee), t(30, A), t(32, H);
  }
  function $() {
    te = this.value, t(7, te), t(31, U), t(33, B);
  }
  const K = () => {
    t(6, ee = ""), t(7, te = ""), F("xpfilter", { from: "", to: "" });
  }, P = () => {
    F("xpfilter", { from: ee, to: te });
  }, V = () => {
    F("xploadmore", { nextOffset: b + u });
  };
  return l.$$set = (N) => {
    "name" in N && t(0, v = N.name), "email" in N && t(1, h = N.email), "summary" in N && t(20, x = N.summary), "timeSummary" in N && t(21, _ = N.timeSummary), "weeklyActiveDays" in N && t(22, j = N.weeklyActiveDays), "xpHistory" in N && t(23, w = N.xpHistory), "categoryDistribution" in N && t(24, C = N.categoryDistribution), "favoriteVideos" in N && t(25, T = N.favoriteVideos), "insights" in N && t(26, q = N.insights), "xpTotal" in N && t(27, S = N.xpTotal), "xpLimit" in N && t(28, D = N.xpLimit), "xpOffset" in N && t(29, Y = N.xpOffset), "xpFrom" in N && t(30, A = N.xpFrom), "xpTo" in N && t(31, U = N.xpTo);
  }, l.$$.update = () => {
    l.$$.dirty[0] & /*summary*/
    1048576 && t(15, s = G(x, {
      total_exercises: 0,
      weekly_sessions: 0,
      avg_satisfaction: 0,
      distinct_days: 0
    })), l.$$.dirty[0] & /*timeSummary*/
    2097152 && t(14, i = G(_, { week_minutes: 0, month_minutes: 0 })), l.$$.dirty[0] & /*weeklyActiveDays*/
    4194304 && t(13, o = G(j, [])), l.$$.dirty[0] & /*xpHistory*/
    8388608 && t(3, r = G(w, [])), l.$$.dirty[0] & /*categoryDistribution*/
    16777216 && t(12, c = G(C, [])), l.$$.dirty[0] & /*favoriteVideos*/
    33554432 && t(11, f = G(T, [])), l.$$.dirty[0] & /*insights*/
    67108864 && t(10, m = G(q, [])), l.$$.dirty[0] & /*xpFrom*/
    1073741824 | l.$$.dirty[1] & /*lastXpFrom*/
    2 && A !== H && (t(6, ee = A), t(32, H = A)), l.$$.dirty[1] & /*xpTo, lastXpTo*/
    5 && U !== B && (t(7, te = U), t(33, B = U)), l.$$.dirty[0] & /*xpLimit*/
    268435456 && t(9, u = Number(D) || 10), l.$$.dirty[0] & /*xpOffset*/
    536870912 && t(4, b = Number(Y) || 0), l.$$.dirty[0] & /*xpTotal, xpItems*/
    134217736 && t(2, p = Number(S) || r.length), l.$$.dirty[0] & /*safeOffset, xpItems, totalCount*/
    28 && t(8, g = Math.min(b + r.length, p));
  }, [
    v,
    h,
    p,
    r,
    b,
    oe,
    ee,
    te,
    g,
    u,
    m,
    f,
    c,
    o,
    i,
    s,
    he,
    be,
    re,
    F,
    x,
    _,
    j,
    w,
    C,
    T,
    q,
    S,
    D,
    Y,
    A,
    U,
    H,
    B,
    me,
    Q,
    $,
    K,
    P,
    V
  ];
}
class ys extends ue {
  constructor(e) {
    super(), fe(
      this,
      e,
      tn,
      en,
      W,
      {
        name: 0,
        email: 1,
        summary: 20,
        timeSummary: 21,
        weeklyActiveDays: 22,
        xpHistory: 23,
        categoryDistribution: 24,
        favoriteVideos: 25,
        insights: 26,
        xpTotal: 27,
        xpLimit: 28,
        xpOffset: 29,
        xpFrom: 30,
        xpTo: 31
      },
      Vi,
      [-1, -1]
    );
  }
  get name() {
    return this.$$.ctx[0];
  }
  set name(e) {
    this.$$set({ name: e }), z();
  }
  get email() {
    return this.$$.ctx[1];
  }
  set email(e) {
    this.$$set({ email: e }), z();
  }
  get summary() {
    return this.$$.ctx[20];
  }
  set summary(e) {
    this.$$set({ summary: e }), z();
  }
  get timeSummary() {
    return this.$$.ctx[21];
  }
  set timeSummary(e) {
    this.$$set({ timeSummary: e }), z();
  }
  get weeklyActiveDays() {
    return this.$$.ctx[22];
  }
  set weeklyActiveDays(e) {
    this.$$set({ weeklyActiveDays: e }), z();
  }
  get xpHistory() {
    return this.$$.ctx[23];
  }
  set xpHistory(e) {
    this.$$set({ xpHistory: e }), z();
  }
  get categoryDistribution() {
    return this.$$.ctx[24];
  }
  set categoryDistribution(e) {
    this.$$set({ categoryDistribution: e }), z();
  }
  get favoriteVideos() {
    return this.$$.ctx[25];
  }
  set favoriteVideos(e) {
    this.$$set({ favoriteVideos: e }), z();
  }
  get insights() {
    return this.$$.ctx[26];
  }
  set insights(e) {
    this.$$set({ insights: e }), z();
  }
  get xpTotal() {
    return this.$$.ctx[27];
  }
  set xpTotal(e) {
    this.$$set({ xpTotal: e }), z();
  }
  get xpLimit() {
    return this.$$.ctx[28];
  }
  set xpLimit(e) {
    this.$$set({ xpLimit: e }), z();
  }
  get xpOffset() {
    return this.$$.ctx[29];
  }
  set xpOffset(e) {
    this.$$set({ xpOffset: e }), z();
  }
  get xpFrom() {
    return this.$$.ctx[30];
  }
  set xpFrom(e) {
    this.$$set({ xpFrom: e }), z();
  }
  get xpTo() {
    return this.$$.ctx[31];
  }
  set xpTo(e) {
    this.$$set({ xpTo: e }), z();
  }
}
customElements.define("svelte-user-stats-panel", de(ys, { name: {}, email: {}, summary: {}, timeSummary: {}, weeklyActiveDays: {}, xpHistory: {}, categoryDistribution: {}, favoriteVideos: {}, insights: {}, xpTotal: {}, xpLimit: {}, xpOffset: {}, xpFrom: {}, xpTo: {} }, [], [], !0));
function ln(l) {
  ce(l, "svelte-1liu8s0", ":root{--podium-accent:#10b981}.podium-wrap.svelte-1liu8s0.svelte-1liu8s0{border-radius:32px;border:1px solid rgba(16, 185, 129, 0.18);background:radial-gradient(circle at top, #ecfdf5 0%, #ffffff 45%, #f0fdf4 100%);padding:28px;box-shadow:0 30px 60px rgba(15, 118, 110, 0.08)}.podium-header.svelte-1liu8s0.svelte-1liu8s0{display:flex;flex-wrap:wrap;gap:16px;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(16, 185, 129, 0.12);padding-bottom:16px}.eyebrow.svelte-1liu8s0.svelte-1liu8s0{font-size:10px;letter-spacing:0.32em;text-transform:uppercase;font-weight:600;color:#10b981}h2.svelte-1liu8s0.svelte-1liu8s0{margin:6px 0 0;font-size:24px;font-weight:700;color:#0f172a}.scope.svelte-1liu8s0.svelte-1liu8s0{margin-top:4px;font-size:13px;color:#64748b}.badge.svelte-1liu8s0.svelte-1liu8s0{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:600;color:#0f766e}.badge-icon.svelte-1liu8s0.svelte-1liu8s0{width:20px;height:20px;display:inline-block;border-radius:50%;background:conic-gradient(from 180deg, #34d399, #bbf7d0, #34d399);position:relative}.badge-icon.svelte-1liu8s0.svelte-1liu8s0::after{content:'';position:absolute;inset:5px;border-radius:50%;background:#ecfdf5}.podium-grid.svelte-1liu8s0.svelte-1liu8s0{margin-top:28px;display:grid;grid-template-columns:repeat(3, minmax(0, 1fr));align-items:end;gap:18px}.podium-card.svelte-1liu8s0.svelte-1liu8s0{border-radius:28px;border:1px solid transparent;padding:18px;min-height:220px;display:flex;flex-direction:column;gap:12px;animation:svelte-1liu8s0-rise 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards;opacity:0;transform:translateY(18px) scale(0.98);animation-delay:var(--delay)}.podium-card.up.svelte-1liu8s0.svelte-1liu8s0{transform:translateY(12px) scale(1)}.podium-card.first.svelte-1liu8s0.svelte-1liu8s0{background:linear-gradient(180deg, rgba(16, 185, 129, 0.18), rgba(16, 185, 129, 0.05));border-color:rgba(16, 185, 129, 0.3);min-height:300px}.podium-card.second.svelte-1liu8s0.svelte-1liu8s0{background:linear-gradient(180deg, rgba(52, 211, 153, 0.18), rgba(236, 253, 245, 0.2));border-color:rgba(52, 211, 153, 0.25);min-height:260px}.podium-card.third.svelte-1liu8s0.svelte-1liu8s0{background:linear-gradient(180deg, rgba(187, 247, 208, 0.3), rgba(255, 255, 255, 0.5));border-color:rgba(187, 247, 208, 0.4);min-height:230px}.podium-meta.svelte-1liu8s0.svelte-1liu8s0{display:flex;justify-content:space-between;align-items:center;font-size:11px;font-weight:600;text-transform:uppercase;color:#64748b}.place.svelte-1liu8s0.svelte-1liu8s0{color:#0f766e}.xp.svelte-1liu8s0.svelte-1liu8s0{color:#94a3b8}.reward.svelte-1liu8s0.svelte-1liu8s0{border-radius:18px;background:rgba(255, 255, 255, 0.75);padding:12px;text-align:center;font-size:12px;color:#0f172a;box-shadow:inset 0 0 0 1px rgba(148, 163, 184, 0.2);min-height:168px;display:flex;flex-direction:column;justify-content:center;gap:6px}.reward.svelte-1liu8s0 img.svelte-1liu8s0{width:100%;height:110px;object-fit:contain;border-radius:14px;background:#ffffff;margin-bottom:10px}.reward-title.svelte-1liu8s0.svelte-1liu8s0{font-size:13px;font-weight:600;margin:0}.reward-desc.svelte-1liu8s0.svelte-1liu8s0{margin:6px 0 0;font-size:11px;color:#6b7280}.reward.svelte-1liu8s0 a.svelte-1liu8s0{display:inline-block;margin-top:8px;background:#10b981;color:#ffffff;font-size:11px;padding:6px 12px;border-radius:999px;text-decoration:none}.reward.svelte-1liu8s0 a.svelte-1liu8s0:hover{background:#059669}.reward.empty.svelte-1liu8s0.svelte-1liu8s0{border:1px dashed rgba(148, 163, 184, 0.5);background:rgba(255, 255, 255, 0.6);color:#6b7280}.winner.svelte-1liu8s0.svelte-1liu8s0{margin-top:auto;display:flex;align-items:center;gap:10px}.avatar.svelte-1liu8s0.svelte-1liu8s0{width:46px;height:46px;border-radius:50%;object-fit:cover;background:#f8fafc;box-shadow:0 10px 20px rgba(15, 118, 110, 0.12)}.avatar.fallback.svelte-1liu8s0.svelte-1liu8s0{display:grid;place-items:center;font-size:16px;font-weight:600;color:#64748b;background:rgba(255, 255, 255, 0.8)}.winner-meta.svelte-1liu8s0 p.svelte-1liu8s0{margin:0;font-size:14px;font-weight:600;color:#0f172a}.winner-meta.svelte-1liu8s0 span.svelte-1liu8s0{font-size:12px;color:#94a3b8}.empty-winner.svelte-1liu8s0.svelte-1liu8s0{font-size:12px;color:#94a3b8}.loading.svelte-1liu8s0.svelte-1liu8s0{margin-top:18px;text-align:center;font-size:12px;color:#6b7280}@keyframes svelte-1liu8s0-rise{to{opacity:1;transform:translateY(0) scale(1)}}@media(max-width: 900px){.podium-grid.svelte-1liu8s0.svelte-1liu8s0{grid-template-columns:1fr}.podium-card.svelte-1liu8s0.svelte-1liu8s0{min-height:auto}}");
}
function Il(l, e, t) {
  const s = l.slice();
  return s[11] = e[t], s[13] = t, s;
}
function Dl(l) {
  let e, t;
  return {
    c() {
      e = d("p"), t = k(
        /*scopeLabel*/
        l[0]
      ), a(e, "class", "scope svelte-1liu8s0");
    },
    m(s, i) {
      E(s, e, i), n(e, t);
    },
    p(s, i) {
      i & /*scopeLabel*/
      1 && M(
        t,
        /*scopeLabel*/
        s[0]
      );
    },
    d(s) {
      s && L(e);
    }
  };
}
function Rl(l) {
  let e = `${/*podiumUsers*/
  l[2][
    /*slot*/
    l[11].place - 1
  ].id}-${/*slot*/
  l[11].place}`, t, s = Yl(l);
  return {
    c() {
      s.c(), t = Re();
    },
    m(i, o) {
      s.m(i, o), E(i, t, o);
    },
    p(i, o) {
      o & /*podiumUsers*/
      4 && W(e, e = `${/*podiumUsers*/
      i[2][
        /*slot*/
        i[11].place - 1
      ].id}-${/*slot*/
      i[11].place}`) ? (s.d(1), s = Yl(i), s.c(), s.m(t.parentNode, t)) : s.p(i, o);
    },
    d(i) {
      i && L(t), s.d(i);
    }
  };
}
function Pl(l) {
  let e, t, s = (
    /*podiumUsers*/
    l[2][
      /*slot*/
      l[11].place - 1
    ].periodical_exp + ""
  ), i, o;
  return {
    c() {
      e = d("span"), t = k("+"), i = k(s), o = k(" XP"), a(e, "class", "xp svelte-1liu8s0");
    },
    m(r, c) {
      E(r, e, c), n(e, t), n(e, i), n(e, o);
    },
    p(r, c) {
      c & /*podiumUsers*/
      4 && s !== (s = /*podiumUsers*/
      r[2][
        /*slot*/
        r[11].place - 1
      ].periodical_exp + "") && M(i, s);
    },
    d(r) {
      r && L(e);
    }
  };
}
function sn(l) {
  let e;
  return {
    c() {
      e = d("div"), e.textContent = "Recompensa pendiente", a(e, "class", "reward empty svelte-1liu8s0");
    },
    m(t, s) {
      E(t, e, s);
    },
    p: I,
    d(t) {
      t && L(e);
    }
  };
}
function nn(l) {
  let e, t = (
    /*resolveReward*/
    l[5](
      /*slot*/
      l[11].place
    ).image_url
  ), s, i, o, r = (
    /*resolveReward*/
    l[5](
      /*slot*/
      l[11].place
    ).description
  ), c, f = (
    /*resolveReward*/
    l[5](
      /*slot*/
      l[11].place
    ).cta_url
  ), m = t && rn(l), u = r && on(l), b = f && an(l);
  return {
    c() {
      e = d("div"), m && m.c(), s = y(), i = d("p"), i.textContent = `${/*resolveReward*/
      l[5](
        /*slot*/
        l[11].place
      ).title}`, o = y(), u && u.c(), c = y(), b && b.c(), a(i, "class", "reward-title svelte-1liu8s0"), a(e, "class", "reward svelte-1liu8s0");
    },
    m(p, g) {
      E(p, e, g), m && m.m(e, null), n(e, s), n(e, i), n(e, o), u && u.m(e, null), n(e, c), b && b.m(e, null);
    },
    p(p, g) {
      t && m.p(p, g), r && u.p(p, g), f && b.p(p, g);
    },
    d(p) {
      p && L(e), m && m.d(), u && u.d(), b && b.d();
    }
  };
}
function rn(l) {
  let e, t;
  return {
    c() {
      e = d("img"), rt(e.src, t = /*resolveReward*/
      l[5](
        /*slot*/
        l[11].place
      ).image_url) || a(e, "src", t), a(
        e,
        "alt",
        /*resolveReward*/
        l[5](
          /*slot*/
          l[11].place
        ).title
      ), a(e, "loading", "lazy"), a(e, "class", "svelte-1liu8s0");
    },
    m(s, i) {
      E(s, e, i);
    },
    p: I,
    d(s) {
      s && L(e);
    }
  };
}
function on(l) {
  let e;
  return {
    c() {
      e = d("p"), e.textContent = `${/*resolveReward*/
      l[5](
        /*slot*/
        l[11].place
      ).description}`, a(e, "class", "reward-desc svelte-1liu8s0");
    },
    m(t, s) {
      E(t, e, s);
    },
    p: I,
    d(t) {
      t && L(e);
    }
  };
}
function an(l) {
  let e, t;
  return {
    c() {
      e = d("a"), t = k("Ver mas"), a(
        e,
        "href",
        /*resolveReward*/
        l[5](
          /*slot*/
          l[11].place
        ).cta_url
      ), a(e, "target", "_blank"), a(e, "rel", "noreferrer"), a(e, "class", "svelte-1liu8s0");
    },
    m(s, i) {
      E(s, e, i), n(e, t);
    },
    p: I,
    d(s) {
      s && L(e);
    }
  };
}
function cn(l) {
  let e, t, s, i = (
    /*podiumUsers*/
    l[2][
      /*slot*/
      l[11].place - 1
    ].first_name + ""
  ), o, r, c = (
    /*podiumUsers*/
    l[2][
      /*slot*/
      l[11].place - 1
    ].last_name + ""
  ), f, m, u, b, p = (
    /*podiumUsers*/
    l[2][
      /*slot*/
      l[11].place - 1
    ].periodical_exp + ""
  ), g, v;
  function h(j, w) {
    return (
      /*podiumUsers*/
      j[2][
        /*slot*/
        j[11].place - 1
      ].avatar_url ? un : dn
    );
  }
  let x = h(l), _ = x(l);
  return {
    c() {
      _.c(), e = y(), t = d("div"), s = d("p"), o = k(i), r = y(), f = k(c), m = y(), u = d("span"), b = k("+"), g = k(p), v = k(" XP"), a(s, "class", "svelte-1liu8s0"), a(u, "class", "svelte-1liu8s0"), a(t, "class", "winner-meta svelte-1liu8s0");
    },
    m(j, w) {
      _.m(j, w), E(j, e, w), E(j, t, w), n(t, s), n(s, o), n(s, r), n(s, f), n(t, m), n(t, u), n(u, b), n(u, g), n(u, v);
    },
    p(j, w) {
      x === (x = h(j)) && _ ? _.p(j, w) : (_.d(1), _ = x(j), _ && (_.c(), _.m(e.parentNode, e))), w & /*podiumUsers*/
      4 && i !== (i = /*podiumUsers*/
      j[2][
        /*slot*/
        j[11].place - 1
      ].first_name + "") && M(o, i), w & /*podiumUsers*/
      4 && c !== (c = /*podiumUsers*/
      j[2][
        /*slot*/
        j[11].place - 1
      ].last_name + "") && M(f, c), w & /*podiumUsers*/
      4 && p !== (p = /*podiumUsers*/
      j[2][
        /*slot*/
        j[11].place - 1
      ].periodical_exp + "") && M(g, p);
    },
    d(j) {
      j && (L(e), L(t)), _.d(j);
    }
  };
}
function fn(l) {
  let e;
  return {
    c() {
      e = d("span"), e.textContent = "Aun sin ganador", a(e, "class", "empty-winner svelte-1liu8s0");
    },
    m(t, s) {
      E(t, e, s);
    },
    p: I,
    d(t) {
      t && L(e);
    }
  };
}
function dn(l) {
  let e, t = (
    /*podiumUsers*/
    (l[2][
      /*slot*/
      l[11].place - 1
    ].first_name || /*podiumUsers*/
    l[2][
      /*slot*/
      l[11].place - 1
    ].last_name || "?").charAt(0) + ""
  ), s;
  return {
    c() {
      e = d("div"), s = k(t), a(e, "class", "avatar fallback svelte-1liu8s0");
    },
    m(i, o) {
      E(i, e, o), n(e, s);
    },
    p(i, o) {
      o & /*podiumUsers*/
      4 && t !== (t = /*podiumUsers*/
      (i[2][
        /*slot*/
        i[11].place - 1
      ].first_name || /*podiumUsers*/
      i[2][
        /*slot*/
        i[11].place - 1
      ].last_name || "?").charAt(0) + "") && M(s, t);
    },
    d(i) {
      i && L(e);
    }
  };
}
function un(l) {
  let e, t, s;
  return {
    c() {
      e = d("img"), rt(e.src, t = /*podiumUsers*/
      l[2][
        /*slot*/
        l[11].place - 1
      ].avatar_url) || a(e, "src", t), a(e, "alt", s = /*podiumUsers*/
      l[2][
        /*slot*/
        l[11].place - 1
      ].first_name), a(e, "class", "avatar svelte-1liu8s0"), a(e, "loading", "lazy");
    },
    m(i, o) {
      E(i, e, o);
    },
    p(i, o) {
      o & /*podiumUsers*/
      4 && !rt(e.src, t = /*podiumUsers*/
      i[2][
        /*slot*/
        i[11].place - 1
      ].avatar_url) && a(e, "src", t), o & /*podiumUsers*/
      4 && s !== (s = /*podiumUsers*/
      i[2][
        /*slot*/
        i[11].place - 1
      ].first_name) && a(e, "alt", s);
    },
    d(i) {
      i && L(e);
    }
  };
}
function Yl(l) {
  let e, t, s, i, o, r, c, f, m = (
    /*podiumUsers*/
    l[2][
      /*slot*/
      l[11].place - 1
    ].id !== "placeholder" && Pl(l)
  );
  function u(x, _) {
    return (
      /*resolveReward*/
      x[5](
        /*slot*/
        x[11].place
      ) ? nn : sn
    );
  }
  let p = u(l)(l);
  function g(x, _) {
    return (
      /*podiumUsers*/
      x[2][
        /*slot*/
        x[11].place - 1
      ].id === "placeholder" ? fn : cn
    );
  }
  let v = g(l), h = v(l);
  return {
    c() {
      e = d("article"), t = d("div"), s = d("span"), s.textContent = `${/*slot*/
      l[11].place} lugar`, i = y(), m && m.c(), o = y(), p.c(), r = y(), c = d("div"), h.c(), f = y(), a(s, "class", "place svelte-1liu8s0"), a(t, "class", "podium-meta svelte-1liu8s0"), a(c, "class", "winner svelte-1liu8s0"), a(e, "class", He(`podium-card ${/*slot*/
      l[11].className} ${/*slot*/
      l[11].bump}`) + " svelte-1liu8s0"), a(e, "style", `--delay:${/*slot*/
      l[11].delay + /*index*/
      l[13] * 0.35}s;`);
    },
    m(x, _) {
      E(x, e, _), n(e, t), n(t, s), n(t, i), m && m.m(t, null), n(e, o), p.m(e, null), n(e, r), n(e, c), h.m(c, null), n(e, f);
    },
    p(x, _) {
      /*podiumUsers*/
      x[2][
        /*slot*/
        x[11].place - 1
      ].id !== "placeholder" ? m ? m.p(x, _) : (m = Pl(x), m.c(), m.m(t, null)) : m && (m.d(1), m = null), p.p(x, _), v === (v = g(x)) && h ? h.p(x, _) : (h.d(1), h = v(x), h && (h.c(), h.m(c, null)));
    },
    d(x) {
      x && L(e), m && m.d(), p.d(), h.d();
    }
  };
}
function Xl(l, e) {
  let t, s, i = (
    /*podiumUsers*/
    e[2][
      /*slot*/
      e[11].place - 1
    ] && Rl(e)
  );
  return {
    key: l,
    first: null,
    c() {
      t = Re(), i && i.c(), s = Re(), this.first = t;
    },
    m(o, r) {
      E(o, t, r), i && i.m(o, r), E(o, s, r);
    },
    p(o, r) {
      e = o, /*podiumUsers*/
      e[2][
        /*slot*/
        e[11].place - 1
      ] ? i ? i.p(e, r) : (i = Rl(e), i.c(), i.m(s.parentNode, s)) : i && (i.d(1), i = null);
    },
    d(o) {
      o && (L(t), L(s)), i && i.d(o);
    }
  };
}
function Ol(l) {
  let e, t = [], s = /* @__PURE__ */ new Map(), i = ne(
    /*layout*/
    l[4]
  );
  const o = (r) => (
    /*slot*/
    r[11].place
  );
  for (let r = 0; r < i.length; r += 1) {
    let c = Il(l, i, r), f = o(c);
    s.set(f, t[r] = Xl(f, c));
  }
  return {
    c() {
      e = d("div");
      for (let r = 0; r < t.length; r += 1)
        t[r].c();
      a(e, "class", "podium-grid svelte-1liu8s0");
    },
    m(r, c) {
      E(r, e, c);
      for (let f = 0; f < t.length; f += 1)
        t[f] && t[f].m(e, null);
    },
    p(r, c) {
      c & /*podiumUsers, layout, resolveReward*/
      52 && (i = ne(
        /*layout*/
        r[4]
      ), t = yt(t, c, o, 1, r, i, s, e, xt, Xl, null, Il));
    },
    d(r) {
      r && L(e);
      for (let c = 0; c < t.length; c += 1)
        t[c].d();
    }
  };
}
function Bl(l) {
  let e;
  return {
    c() {
      e = d("div"), e.textContent = "Cargando clasificaciones...", a(e, "class", "loading svelte-1liu8s0");
    },
    m(t, s) {
      E(t, e, s);
    },
    d(t) {
      t && L(e);
    }
  };
}
function pn(l) {
  let e, t, s, i, o, r, c, f, m, u, b = (
    /*playId*/
    l[3]
  ), p, g = (
    /*scopeLabel*/
    l[0] && Dl(l)
  ), v = Ol(l), h = (
    /*loading*/
    l[1] && Bl()
  );
  return {
    c() {
      e = d("section"), t = d("header"), s = d("div"), i = d("p"), i.textContent = "Podio temporada", o = y(), r = d("h2"), r.textContent = "Top Activos", c = y(), g && g.c(), f = y(), m = d("div"), m.innerHTML = '<span class="badge-icon svelte-1liu8s0" aria-hidden="true"></span> <span>Recompensa especial para el Top 3</span>', u = y(), v.c(), p = y(), h && h.c(), a(i, "class", "eyebrow svelte-1liu8s0"), a(r, "class", "svelte-1liu8s0"), a(m, "class", "badge svelte-1liu8s0"), a(t, "class", "podium-header svelte-1liu8s0"), a(e, "class", "podium-wrap svelte-1liu8s0"), a(
        e,
        "data-play",
        /*playId*/
        l[3]
      );
    },
    m(x, _) {
      E(x, e, _), n(e, t), n(t, s), n(s, i), n(s, o), n(s, r), n(s, c), g && g.m(s, null), n(t, f), n(t, m), n(e, u), v.m(e, null), n(e, p), h && h.m(e, null);
    },
    p(x, [_]) {
      /*scopeLabel*/
      x[0] ? g ? g.p(x, _) : (g = Dl(x), g.c(), g.m(s, null)) : g && (g.d(1), g = null), _ & /*playId*/
      8 && W(b, b = /*playId*/
      x[3]) ? (v.d(1), v = Ol(x), v.c(), v.m(e, p)) : v.p(x, _), /*loading*/
      x[1] ? h || (h = Bl(), h.c(), h.m(e, null)) : h && (h.d(1), h = null), _ & /*playId*/
      8 && a(
        e,
        "data-play",
        /*playId*/
        x[3]
      );
    },
    i: I,
    o: I,
    d(x) {
      x && L(e), g && g.d(), v.d(x), h && h.d();
    }
  };
}
function vn(l, e, t) {
  let s, { users: i = [] } = e, { rewards: o = {} } = e, { scopeLabel: r = "" } = e, { loading: c = !1 } = e;
  const f = {
    id: "placeholder",
    first_name: "Por definir",
    last_name: "",
    avatar_url: "",
    periodical_exp: 0
  }, m = [
    {
      place: 2,
      className: "second",
      bump: "down",
      delay: 0.05
    },
    {
      place: 1,
      className: "first",
      bump: "up",
      delay: 0
    },
    {
      place: 3,
      className: "third",
      bump: "down",
      delay: 0.1
    }
  ], u = (v) => Array.isArray(v) ? v : [], b = (v) => (o == null ? void 0 : o[v]) || (o == null ? void 0 : o[String(v)]);
  let p = 0, g = "";
  return l.$$set = (v) => {
    "users" in v && t(6, i = v.users), "rewards" in v && t(7, o = v.rewards), "scopeLabel" in v && t(0, r = v.scopeLabel), "loading" in v && t(1, c = v.loading);
  }, l.$$.update = () => {
    if (l.$$.dirty & /*users*/
    64 && t(2, s = [...u(i)].slice(0, 3)), l.$$.dirty & /*podiumUsers*/
    4)
      for (; s.length < 3; ) s.push(f);
    if (l.$$.dirty & /*podiumUsers, rewards, loading, scopeLabel, signature, playId*/
    399) {
      const v = s.map((_) => (_ == null ? void 0 : _.id) ?? "").join("|"), h = o ? Object.keys(o).sort().map((_) => {
        var j;
        return `${_}:${((j = o[_]) == null ? void 0 : j.title) ?? ""}`;
      }).join("|") : "", x = `${v}-${h}-${c}-${r}`;
      x !== g && (t(8, g = x), t(3, p += 1));
    }
  }, [
    r,
    c,
    s,
    p,
    m,
    b,
    i,
    o,
    g
  ];
}
class _s extends ue {
  constructor(e) {
    super(), fe(
      this,
      e,
      vn,
      pn,
      W,
      {
        users: 6,
        rewards: 7,
        scopeLabel: 0,
        loading: 1
      },
      ln
    );
  }
  get users() {
    return this.$$.ctx[6];
  }
  set users(e) {
    this.$$set({ users: e }), z();
  }
  get rewards() {
    return this.$$.ctx[7];
  }
  set rewards(e) {
    this.$$set({ rewards: e }), z();
  }
  get scopeLabel() {
    return this.$$.ctx[0];
  }
  set scopeLabel(e) {
    this.$$set({ scopeLabel: e }), z();
  }
  get loading() {
    return this.$$.ctx[1];
  }
  set loading(e) {
    this.$$set({ loading: e }), z();
  }
}
de(_s, { users: {}, rewards: {}, scopeLabel: {}, loading: { type: "Boolean" } }, [], [], !0);
function gn(l) {
  ce(l, "svelte-1p7vo7o", `.backdrop.svelte-1p7vo7o.svelte-1p7vo7o{position:fixed;inset:0;background:radial-gradient(circle at top left, rgba(239, 68, 68, 0.18), transparent 30%),
      rgba(15, 23, 42, 0.42);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;z-index:60;padding:24px}.card.svelte-1p7vo7o.svelte-1p7vo7o{width:min(760px, 100%);background:linear-gradient(180deg, rgba(255, 247, 247, 0.92), rgba(255, 255, 255, 0.98) 28%),
      #ffffff;border-radius:28px;border:1px solid rgba(226, 232, 240, 0.95);box-shadow:0 30px 90px rgba(15, 23, 42, 0.24);display:flex;flex-direction:column;gap:18px;padding:24px;box-sizing:border-box;max-height:calc(100vh - 48px);overflow:auto}.hero.svelte-1p7vo7o.svelte-1p7vo7o{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}.hero-copy.svelte-1p7vo7o.svelte-1p7vo7o{max-width:580px}.eyebrow.svelte-1p7vo7o.svelte-1p7vo7o{display:inline-flex;align-items:center;border-radius:999px;background:#fff1f2;color:#be123c;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:6px 10px;margin-bottom:10px}.title.svelte-1p7vo7o.svelte-1p7vo7o{font-size:20px;font-weight:800;margin:0;color:#0f172a}.hint.svelte-1p7vo7o.svelte-1p7vo7o{font-size:15px;line-height:1.45;margin:6px 0 0;color:#475569}.close.svelte-1p7vo7o.svelte-1p7vo7o{border:none;background:rgba(241, 245, 249, 0.96);color:#475569;width:42px;height:42px;border-radius:999px;cursor:pointer;font-size:24px}.body.svelte-1p7vo7o.svelte-1p7vo7o{display:grid;gap:14px}.field.svelte-1p7vo7o.svelte-1p7vo7o{display:grid;gap:10px}.field-head.svelte-1p7vo7o.svelte-1p7vo7o{display:flex;align-items:center;justify-content:space-between;gap:12px}.label.svelte-1p7vo7o.svelte-1p7vo7o{font-size:13px;font-weight:700;color:#334155}.caption.svelte-1p7vo7o.svelte-1p7vo7o{font-size:12px;color:#94a3b8}.caption.danger.svelte-1p7vo7o.svelte-1p7vo7o{color:#b91c1c}.select.svelte-1p7vo7o.svelte-1p7vo7o,.textarea.svelte-1p7vo7o.svelte-1p7vo7o{box-sizing:border-box;width:100%;border:1px solid #d7dee8;border-radius:18px;padding:14px 16px;font-size:15px;outline:none;background:rgba(255, 255, 255, 0.92);transition:border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease}.select.svelte-1p7vo7o.svelte-1p7vo7o:focus,.textarea.svelte-1p7vo7o.svelte-1p7vo7o:focus{border-color:#fb7185;box-shadow:0 0 0 4px rgba(251, 113, 133, 0.12)}.textarea.svelte-1p7vo7o.svelte-1p7vo7o{resize:vertical;min-height:120px;max-height:220px;line-height:1.5;font-family:inherit}.error.svelte-1p7vo7o.svelte-1p7vo7o{font-size:13px;color:#b91c1c;background:#fef2f2;border:1px solid #fecaca;padding:12px 14px;border-radius:14px}.success.svelte-1p7vo7o.svelte-1p7vo7o{font-size:13px;color:#047857;background:#ecfdf5;border:1px solid #a7f3d0;padding:12px 14px;border-radius:14px}.footer.svelte-1p7vo7o.svelte-1p7vo7o{display:flex;align-items:center;justify-content:space-between;gap:12px}.footer-left.svelte-1p7vo7o.svelte-1p7vo7o,.footer-right.svelte-1p7vo7o.svelte-1p7vo7o{display:flex;align-items:center;gap:10px}.ghost.svelte-1p7vo7o.svelte-1p7vo7o{border:1px solid #d7dee8;background:#ffffff;color:#475569;padding:11px 18px;border-radius:999px;cursor:pointer}.secondary.svelte-1p7vo7o.svelte-1p7vo7o{border:1px solid #fda4af;background:#fff1f2;color:#be123c;padding:11px 16px;border-radius:999px;cursor:pointer;font-weight:600}.primary.svelte-1p7vo7o.svelte-1p7vo7o{border:none;background:linear-gradient(135deg, #ef4444, #dc2626);color:#ffffff;padding:11px 18px;border-radius:999px;cursor:pointer;font-weight:700;box-shadow:0 12px 24px rgba(239, 68, 68, 0.28)}.primary.svelte-1p7vo7o.svelte-1p7vo7o:disabled{opacity:0.6;cursor:not-allowed;box-shadow:none}@media(max-width: 640px){.card.svelte-1p7vo7o.svelte-1p7vo7o{width:100%;padding:18px;border-radius:24px;max-height:calc(100vh - 24px)}.footer.svelte-1p7vo7o.svelte-1p7vo7o{flex-direction:column;align-items:stretch}.footer-left.svelte-1p7vo7o.svelte-1p7vo7o,.footer-right.svelte-1p7vo7o.svelte-1p7vo7o{width:100%;justify-content:stretch}.footer-left.svelte-1p7vo7o>button.svelte-1p7vo7o,.footer-right.svelte-1p7vo7o>button.svelte-1p7vo7o{flex:1 1 0}}`);
}
function Hl(l, e, t) {
  const s = l.slice();
  return s[23] = e[t], s;
}
function Fl(l) {
  let e, t, s, i, o, r, c, f, m, u, b, p, g, v, h, x, _, j, w, C, T, q, S, D, Y, A, U = Math.max(
    /*message*/
    l[10].length,
    0
  ) + "", G, he, be, re, F, oe, ee, te, H, B, me, Q, $, K, P, V = (
    /*submitting*/
    l[2] ? "Enviando..." : "Enviar reporte"
  ), N, J, qe, Ne, _e = ne(
    /*categories*/
    l[1]
  ), ie = [];
  for (let O = 0; O < _e.length; O += 1)
    ie[O] = Vl(Hl(l, _e, O));
  let ae = (
    /*error*/
    l[3] && $l(l)
  ), xe = (
    /*success*/
    l[4] && Ul()
  ), le = (
    /*canViewInbox*/
    l[7] && Gl(l)
  );
  return {
    c() {
      e = d("div"), t = d("div"), s = d("div"), i = d("div"), o = d("span"), o.textContent = "Soporte", r = y(), c = d("p"), f = k(
        /*title*/
        l[5]
      ), m = y(), u = d("p"), b = k(
        /*hint*/
        l[6]
      ), p = y(), g = d("button"), g.textContent = "×", v = y(), h = d("div"), x = d("div"), _ = d("div"), _.innerHTML = '<label class="label svelte-1p7vo7o" for="report-category">Categoría</label> <span class="caption svelte-1p7vo7o">Obligatorio</span>', j = y(), w = d("select"), C = d("option"), C.textContent = "Selecciona una categoria";
      for (let O = 0; O < ie.length; O += 1)
        ie[O].c();
      T = y(), q = d("div"), S = d("div"), D = d("label"), D.textContent = "Mensaje", Y = y(), A = d("span"), G = k(U), he = k("/"), be = k(At), re = y(), F = d("textarea"), oe = y(), ae && ae.c(), ee = y(), xe && xe.c(), te = y(), H = d("div"), B = d("div"), le && le.c(), me = y(), Q = d("div"), $ = d("button"), $.textContent = "Cancelar", K = y(), P = d("button"), N = k(V), a(o, "class", "eyebrow svelte-1p7vo7o"), a(c, "class", "title svelte-1p7vo7o"), a(u, "class", "hint svelte-1p7vo7o"), a(i, "class", "hero-copy svelte-1p7vo7o"), a(g, "class", "close svelte-1p7vo7o"), a(g, "type", "button"), a(s, "class", "hero svelte-1p7vo7o"), a(_, "class", "field-head svelte-1p7vo7o"), C.__value = "", Ee(C, C.__value), C.disabled = !0, a(w, "id", "report-category"), a(w, "class", "select svelte-1p7vo7o"), /*selected*/
      l[9] === void 0 && Te(() => (
        /*select_change_handler*/
        l[18].call(w)
      )), a(x, "class", "field svelte-1p7vo7o"), a(D, "class", "label svelte-1p7vo7o"), a(D, "for", "report-message"), a(A, "class", "caption svelte-1p7vo7o"), Ze(
        A,
        "danger",
        /*remaining*/
        l[12] < 0
      ), a(S, "class", "field-head svelte-1p7vo7o"), a(F, "id", "report-message"), a(F, "class", "textarea svelte-1p7vo7o"), a(F, "rows", "6"), a(F, "maxlength", At), a(F, "placeholder", "Ejemplo: al abrir notificaciones se queda cargando y no puedo volver atrás."), a(q, "class", "field svelte-1p7vo7o"), a(h, "class", "body svelte-1p7vo7o"), a(B, "class", "footer-left svelte-1p7vo7o"), a($, "class", "ghost svelte-1p7vo7o"), a($, "type", "button"), a(P, "class", "primary svelte-1p7vo7o"), a(P, "type", "button"), P.disabled = J = !/*canSubmit*/
      l[11], a(Q, "class", "footer-right svelte-1p7vo7o"), a(H, "class", "footer svelte-1p7vo7o"), a(t, "class", "card svelte-1p7vo7o"), a(t, "role", "dialog"), a(t, "aria-modal", "true"), a(e, "class", "backdrop svelte-1p7vo7o"), a(e, "role", "button"), a(e, "tabindex", "0");
    },
    m(O, ve) {
      E(O, e, ve), n(e, t), n(t, s), n(s, i), n(i, o), n(i, r), n(i, c), n(c, f), n(i, m), n(i, u), n(u, b), n(s, p), n(s, g), n(t, v), n(t, h), n(h, x), n(x, _), n(x, j), n(x, w), n(w, C);
      for (let Z = 0; Z < ie.length; Z += 1)
        ie[Z] && ie[Z].m(w, null);
      il(
        w,
        /*selected*/
        l[9],
        !0
      ), n(h, T), n(h, q), n(q, S), n(S, D), n(S, Y), n(S, A), n(A, G), n(A, he), n(A, be), n(q, re), n(q, F), Ee(
        F,
        /*message*/
        l[10]
      ), n(h, oe), ae && ae.m(h, null), n(h, ee), xe && xe.m(h, null), n(t, te), n(t, H), n(H, B), le && le.m(B, null), n(H, me), n(H, Q), n(Q, $), n(Q, K), n(Q, P), n(P, N), qe || (Ne = [
        X(
          g,
          "click",
          /*close*/
          l[13]
        ),
        X(
          w,
          "change",
          /*select_change_handler*/
          l[18]
        ),
        X(
          F,
          "input",
          /*textarea_input_handler*/
          l[19]
        ),
        X(
          $,
          "click",
          /*close*/
          l[13]
        ),
        X(
          P,
          "click",
          /*submit*/
          l[14]
        ),
        X(t, "click", Ls(
          /*click_handler*/
          l[17]
        )),
        X(
          e,
          "click",
          /*close*/
          l[13]
        ),
        X(
          e,
          "keydown",
          /*keydown_handler*/
          l[20]
        )
      ], qe = !0);
    },
    p(O, ve) {
      if (ve & /*title*/
      32 && M(
        f,
        /*title*/
        O[5]
      ), ve & /*hint*/
      64 && M(
        b,
        /*hint*/
        O[6]
      ), ve & /*categories*/
      2) {
        _e = ne(
          /*categories*/
          O[1]
        );
        let Z;
        for (Z = 0; Z < _e.length; Z += 1) {
          const Pe = Hl(O, _e, Z);
          ie[Z] ? ie[Z].p(Pe, ve) : (ie[Z] = Vl(Pe), ie[Z].c(), ie[Z].m(w, null));
        }
        for (; Z < ie.length; Z += 1)
          ie[Z].d(1);
        ie.length = _e.length;
      }
      ve & /*selected, categories*/
      514 && il(
        w,
        /*selected*/
        O[9]
      ), ve & /*message*/
      1024 && U !== (U = Math.max(
        /*message*/
        O[10].length,
        0
      ) + "") && M(G, U), ve & /*remaining*/
      4096 && Ze(
        A,
        "danger",
        /*remaining*/
        O[12] < 0
      ), ve & /*message*/
      1024 && Ee(
        F,
        /*message*/
        O[10]
      ), /*error*/
      O[3] ? ae ? ae.p(O, ve) : (ae = $l(O), ae.c(), ae.m(h, ee)) : ae && (ae.d(1), ae = null), /*success*/
      O[4] ? xe || (xe = Ul(), xe.c(), xe.m(h, null)) : xe && (xe.d(1), xe = null), /*canViewInbox*/
      O[7] ? le ? le.p(O, ve) : (le = Gl(O), le.c(), le.m(B, null)) : le && (le.d(1), le = null), ve & /*submitting*/
      4 && V !== (V = /*submitting*/
      O[2] ? "Enviando..." : "Enviar reporte") && M(N, V), ve & /*canSubmit*/
      2048 && J !== (J = !/*canSubmit*/
      O[11]) && (P.disabled = J);
    },
    d(O) {
      O && L(e), tt(ie, O), ae && ae.d(), xe && xe.d(), le && le.d(), qe = !1, ye(Ne);
    }
  };
}
function Vl(l) {
  let e, t = (
    /*cat*/
    l[23] + ""
  ), s, i;
  return {
    c() {
      e = d("option"), s = k(t), e.__value = i = /*cat*/
      l[23], Ee(e, e.__value);
    },
    m(o, r) {
      E(o, e, r), n(e, s);
    },
    p(o, r) {
      r & /*categories*/
      2 && t !== (t = /*cat*/
      o[23] + "") && M(s, t), r & /*categories*/
      2 && i !== (i = /*cat*/
      o[23]) && (e.__value = i, Ee(e, e.__value));
    },
    d(o) {
      o && L(e);
    }
  };
}
function $l(l) {
  let e, t;
  return {
    c() {
      e = d("div"), t = k(
        /*error*/
        l[3]
      ), a(e, "class", "error svelte-1p7vo7o");
    },
    m(s, i) {
      E(s, e, i), n(e, t);
    },
    p(s, i) {
      i & /*error*/
      8 && M(
        t,
        /*error*/
        s[3]
      );
    },
    d(s) {
      s && L(e);
    }
  };
}
function Ul(l) {
  let e;
  return {
    c() {
      e = d("div"), e.textContent = "Reporte enviado. ¡Gracias!", a(e, "class", "success svelte-1p7vo7o");
    },
    m(t, s) {
      E(t, e, s);
    },
    d(t) {
      t && L(e);
    }
  };
}
function Gl(l) {
  let e, t, s, i;
  return {
    c() {
      e = d("button"), t = k(
        /*inboxLabel*/
        l[8]
      ), a(e, "class", "secondary svelte-1p7vo7o"), a(e, "type", "button");
    },
    m(o, r) {
      E(o, e, r), n(e, t), s || (i = X(
        e,
        "click",
        /*openInbox*/
        l[15]
      ), s = !0);
    },
    p(o, r) {
      r & /*inboxLabel*/
      256 && M(
        t,
        /*inboxLabel*/
        o[8]
      );
    },
    d(o) {
      o && L(e), s = !1, i();
    }
  };
}
function hn(l) {
  let e, t = (
    /*open*/
    l[0] && Fl(l)
  );
  return {
    c() {
      t && t.c(), e = Re();
    },
    m(s, i) {
      t && t.m(s, i), E(s, e, i);
    },
    p(s, [i]) {
      /*open*/
      s[0] ? t ? t.p(s, i) : (t = Fl(s), t.c(), t.m(e.parentNode, e)) : t && (t.d(1), t = null);
    },
    i: I,
    o: I,
    d(s) {
      s && L(e), t && t.d(s);
    }
  };
}
const bn = 5, At = 1e3;
function mn(l, e, t) {
  let s, i, o, { open: r = !1 } = e, { categories: c = [] } = e, { submitting: f = !1 } = e, { error: m = "" } = e, { success: u = !1 } = e, { title: b = "Reportar un problema" } = e, { hint: p = "Cuéntanos qué ha ocurrido para poder ayudarte." } = e, { canViewInbox: g = !1 } = e, { inboxLabel: v = "Abrir buzón de reports" } = e, h = "", x = "";
  const _ = Ae(), j = () => {
    t(9, h = ""), t(10, x = "");
  }, w = () => {
    _("close");
  }, C = () => {
    o && _("submit", { category: h, message: x });
  }, T = () => {
    _("inboxclick");
  };
  function q(A) {
    Ps.call(this, l, A);
  }
  function S() {
    h = Ms(this), t(9, h), t(1, c);
  }
  function D() {
    x = this.value, t(10, x);
  }
  const Y = (A) => A.key === "Escape" && w();
  return l.$$set = (A) => {
    "open" in A && t(0, r = A.open), "categories" in A && t(1, c = A.categories), "submitting" in A && t(2, f = A.submitting), "error" in A && t(3, m = A.error), "success" in A && t(4, u = A.success), "title" in A && t(5, b = A.title), "hint" in A && t(6, p = A.hint), "canViewInbox" in A && t(7, g = A.canViewInbox), "inboxLabel" in A && t(8, v = A.inboxLabel);
  }, l.$$.update = () => {
    l.$$.dirty & /*message*/
    1024 && t(16, s = x.trim()), l.$$.dirty & /*message*/
    1024 && t(12, i = At - x.length), l.$$.dirty & /*selected, trimmedMessage, submitting*/
    66052 && t(11, o = !!h && s.length >= bn && !f), l.$$.dirty & /*success*/
    16 && u && j();
  }, [
    r,
    c,
    f,
    m,
    u,
    b,
    p,
    g,
    v,
    h,
    x,
    o,
    i,
    w,
    C,
    T,
    s,
    q,
    S,
    D,
    Y
  ];
}
class ws extends ue {
  constructor(e) {
    super(), fe(
      this,
      e,
      mn,
      hn,
      W,
      {
        open: 0,
        categories: 1,
        submitting: 2,
        error: 3,
        success: 4,
        title: 5,
        hint: 6,
        canViewInbox: 7,
        inboxLabel: 8
      },
      gn
    );
  }
  get open() {
    return this.$$.ctx[0];
  }
  set open(e) {
    this.$$set({ open: e }), z();
  }
  get categories() {
    return this.$$.ctx[1];
  }
  set categories(e) {
    this.$$set({ categories: e }), z();
  }
  get submitting() {
    return this.$$.ctx[2];
  }
  set submitting(e) {
    this.$$set({ submitting: e }), z();
  }
  get error() {
    return this.$$.ctx[3];
  }
  set error(e) {
    this.$$set({ error: e }), z();
  }
  get success() {
    return this.$$.ctx[4];
  }
  set success(e) {
    this.$$set({ success: e }), z();
  }
  get title() {
    return this.$$.ctx[5];
  }
  set title(e) {
    this.$$set({ title: e }), z();
  }
  get hint() {
    return this.$$.ctx[6];
  }
  set hint(e) {
    this.$$set({ hint: e }), z();
  }
  get canViewInbox() {
    return this.$$.ctx[7];
  }
  set canViewInbox(e) {
    this.$$set({ canViewInbox: e }), z();
  }
  get inboxLabel() {
    return this.$$.ctx[8];
  }
  set inboxLabel(e) {
    this.$$set({ inboxLabel: e }), z();
  }
}
de(ws, { open: { type: "Boolean" }, categories: {}, submitting: { type: "Boolean" }, error: {}, success: { type: "Boolean" }, title: {}, hint: {}, canViewInbox: { type: "Boolean" }, inboxLabel: {} }, [], [], !0);
const pe = (l, e) => {
  const t = e.element;
  customElements.get(l) || customElements.define(l, t ?? e);
};
pe("svelte-counter", ns);
pe("svelte-orbit-card", rs);
pe("svelte-pulse-badge", os);
pe("svelte-ripple-button", as);
pe("svelte-stagger-list", cs);
pe("svelte-thermometer", fs);
pe("svelte-podium", ds);
pe("svelte-balloon-gift", us);
pe("svelte-achievement-card", ps);
pe("svelte-parallax-card", vs);
pe("svelte-flip-counter", gs);
pe("svelte-parallax-stack", hs);
pe("svelte-video-card", bs);
pe("svelte-season-popup", ms);
pe("svelte-quota-token", xs);
pe("svelte-user-stats-panel", ys);
pe("svelte-rewards-podium", _s);
pe("svelte-error-report-modal", ws);
