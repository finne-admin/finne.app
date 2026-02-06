var vs = Object.defineProperty;
var gs = (l, e, t) => e in l ? vs(l, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : l[e] = t;
var he = (l, e, t) => gs(l, typeof e != "symbol" ? e + "" : e, t);
function E() {
}
const Il = (l) => l;
function Ol(l) {
  return l();
}
function el() {
  return /* @__PURE__ */ Object.create(null);
}
function fe(l) {
  l.forEach(Ol);
}
function Tt(l) {
  return typeof l == "function";
}
function F(l, e) {
  return l != l ? e == e : l !== e || l && typeof l == "object" || typeof l == "function";
}
let ct;
function Ke(l, e) {
  return l === e ? !0 : (ct || (ct = document.createElement("a")), ct.href = e, l === ct.href);
}
function hs(l) {
  return Object.keys(l).length === 0;
}
function Me(l) {
  return l ?? "";
}
function tl(l) {
  const e = typeof l == "string" && l.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);
  return e ? [parseFloat(e[1]), e[2] || "px"] : [
    /** @type {number} */
    l,
    "px"
  ];
}
const Bl = typeof window < "u";
let bs = Bl ? () => window.performance.now() : () => Date.now(), Mt = Bl ? (l) => requestAnimationFrame(l) : E;
const Ie = /* @__PURE__ */ new Set();
function Fl(l) {
  Ie.forEach((e) => {
    e.c(l) || (Ie.delete(e), e.f());
  }), Ie.size !== 0 && Mt(Fl);
}
function ms(l) {
  let e;
  return Ie.size === 0 && Mt(Fl), {
    promise: new Promise((t) => {
      Ie.add(e = { c: l, f: t });
    }),
    abort() {
      Ie.delete(e);
    }
  };
}
function r(l, e) {
  l.appendChild(e);
}
function se(l, e, t) {
  const s = At(l);
  if (!s.getElementById(e)) {
    const i = d("style");
    i.id = e, i.textContent = t, Hl(s, i);
  }
}
function At(l) {
  if (!l) return document;
  const e = l.getRootNode ? l.getRootNode() : l.ownerDocument;
  return e && /** @type {ShadowRoot} */
  e.host ? (
    /** @type {ShadowRoot} */
    e
  ) : l.ownerDocument;
}
function ys(l) {
  const e = d("style");
  return e.textContent = "/* empty */", Hl(At(l), e), e.sheet;
}
function Hl(l, e) {
  return r(
    /** @type {Document} */
    l.head || l,
    e
  ), e.sheet;
}
function $(l, e, t) {
  l.insertBefore(e, t || null);
}
function L(l) {
  l.parentNode && l.parentNode.removeChild(l);
}
function We(l, e) {
  for (let t = 0; t < l.length; t += 1)
    l[t] && l[t].d(e);
}
function d(l) {
  return document.createElement(l);
}
function ll(l) {
  return document.createElementNS("http://www.w3.org/2000/svg", l);
}
function k(l) {
  return document.createTextNode(l);
}
function _() {
  return k(" ");
}
function Ae() {
  return k("");
}
function X(l, e, t, s) {
  return l.addEventListener(e, t, s), () => l.removeEventListener(e, t, s);
}
function St(l) {
  return function(e) {
    return e.preventDefault(), l.call(this, e);
  };
}
function c(l, e, t) {
  t == null ? l.removeAttribute(e) : l.getAttribute(e) !== t && l.setAttribute(e, t);
}
function xs(l) {
  return Array.from(l.childNodes);
}
function M(l, e) {
  e = "" + e, l.data !== e && (l.data = /** @type {string} */
  e);
}
function ft(l, e) {
  l.value = e ?? "";
}
function pt(l, e, t) {
  l.classList.toggle(e, !!t);
}
function Vl(l, e, { bubbles: t = !1, cancelable: s = !1 } = {}) {
  return new CustomEvent(l, { detail: e, bubbles: t, cancelable: s });
}
function _s(l) {
  const e = {};
  return l.childNodes.forEach(
    /** @param {Element} node */
    (t) => {
      e[t.slot || "default"] = !0;
    }
  ), e;
}
const vt = /* @__PURE__ */ new Map();
let gt = 0;
function ws(l) {
  let e = 5381, t = l.length;
  for (; t--; ) e = (e << 5) - e ^ l.charCodeAt(t);
  return e >>> 0;
}
function ks(l, e) {
  const t = { stylesheet: ys(e), rules: {} };
  return vt.set(l, t), t;
}
function sl(l, e, t, s, i, o, n, a = 0) {
  const f = 16.666 / s;
  let h = `{
`;
  for (let y = 0; y <= 1; y += f) {
    const x = e + (t - e) * o(y);
    h += y * 100 + `%{${n(x, 1 - x)}}
`;
  }
  const u = h + `100% {${n(t, 1 - t)}}
}`, b = `__svelte_${ws(u)}_${a}`, p = At(l), { stylesheet: g, rules: v } = vt.get(p) || ks(p, l);
  v[b] || (v[b] = !0, g.insertRule(`@keyframes ${b} ${u}`, g.cssRules.length));
  const m = l.style.animation || "";
  return l.style.animation = `${m ? `${m}, ` : ""}${b} ${s}ms linear ${i}ms 1 both`, gt += 1, b;
}
function zs(l, e) {
  const t = (l.style.animation || "").split(", "), s = t.filter(
    e ? (o) => o.indexOf(e) < 0 : (o) => o.indexOf("__svelte") === -1
    // remove all Svelte animations
  ), i = t.length - s.length;
  i && (l.style.animation = s.join(", "), gt -= i, gt || qs());
}
function qs() {
  Mt(() => {
    gt || (vt.forEach((l) => {
      const { ownerNode: e } = l.stylesheet;
      e && L(e);
    }), vt.clear());
  });
}
let Ge;
function Qe(l) {
  Ge = l;
}
function Ul() {
  if (!Ge) throw new Error("Function called outside component initialization");
  return Ge;
}
function js(l) {
  Ul().$$.on_mount.push(l);
}
function qe() {
  const l = Ul();
  return (e, t, { cancelable: s = !1 } = {}) => {
    const i = l.$$.callbacks[e];
    if (i) {
      const o = Vl(
        /** @type {string} */
        e,
        t,
        { cancelable: s }
      );
      return i.slice().forEach((n) => {
        n.call(l, o);
      }), !o.defaultPrevented;
    }
    return !0;
  };
}
const Xe = [], il = [];
let Oe = [];
const nl = [], Cs = /* @__PURE__ */ Promise.resolve();
let Lt = !1;
function Ss() {
  Lt || (Lt = !0, Cs.then(z));
}
function ze(l) {
  Oe.push(l);
}
const jt = /* @__PURE__ */ new Set();
let Re = 0;
function z() {
  if (Re !== 0)
    return;
  const l = Ge;
  do {
    try {
      for (; Re < Xe.length; ) {
        const e = Xe[Re];
        Re++, Qe(e), Ls(e.$$);
      }
    } catch (e) {
      throw Xe.length = 0, Re = 0, e;
    }
    for (Qe(null), Xe.length = 0, Re = 0; il.length; ) il.pop()();
    for (let e = 0; e < Oe.length; e += 1) {
      const t = Oe[e];
      jt.has(t) || (jt.add(t), t());
    }
    Oe.length = 0;
  } while (Xe.length);
  for (; nl.length; )
    nl.pop()();
  Lt = !1, jt.clear(), Qe(l);
}
function Ls(l) {
  if (l.fragment !== null) {
    l.update(), fe(l.before_update);
    const e = l.dirty;
    l.dirty = [-1], l.fragment && l.fragment.p(l.ctx, e), l.after_update.forEach(ze);
  }
}
function $s(l) {
  const e = [], t = [];
  Oe.forEach((s) => l.indexOf(s) === -1 ? e.push(s) : t.push(s)), t.forEach((s) => s()), Oe = e;
}
let Je;
function Ts() {
  return Je || (Je = Promise.resolve(), Je.then(() => {
    Je = null;
  })), Je;
}
function Ct(l, e, t) {
  l.dispatchEvent(Vl(`${e ? "intro" : "outro"}${t}`));
}
const dt = /* @__PURE__ */ new Set();
let _e;
function Jl() {
  _e = {
    r: 0,
    c: [],
    p: _e
    // parent group
  };
}
function Ql() {
  _e.r || fe(_e.c), _e = _e.p;
}
function Be(l, e) {
  l && l.i && (dt.delete(l), l.i(e));
}
function $t(l, e, t, s) {
  if (l && l.o) {
    if (dt.has(l)) return;
    dt.add(l), _e.c.push(() => {
      dt.delete(l), s && (t && l.d(1), s());
    }), l.o(e);
  } else s && s();
}
const Ms = { duration: 0 };
function ke(l, e, t, s) {
  let o = e(l, t, { direction: "both" }), n = s ? 0 : 1, a = null, f = null, h = null, u;
  function b() {
    h && zs(l, h);
  }
  function p(v, m) {
    const y = (
      /** @type {Program['d']} */
      v.b - n
    );
    return m *= Math.abs(y), {
      a: n,
      b: v.b,
      d: y,
      duration: m,
      start: v.start,
      end: v.start + m,
      group: v.group
    };
  }
  function g(v) {
    const {
      delay: m = 0,
      duration: y = 300,
      easing: x = Il,
      tick: j = E,
      css: w
    } = o || Ms, S = {
      start: bs() + m,
      b: v
    };
    v || (S.group = _e, _e.r += 1), "inert" in l && (v ? u !== void 0 && (l.inert = u) : (u = /** @type {HTMLElement} */
    l.inert, l.inert = !0)), a || f ? f = S : (w && (b(), h = sl(l, n, v, y, m, x, w)), v && j(0, 1), a = p(S, y), ze(() => Ct(l, v, "start")), ms((T) => {
      if (f && T > f.start && (a = p(f, y), f = null, Ct(l, a.b, "start"), w && (b(), h = sl(
        l,
        n,
        a.b,
        a.duration,
        0,
        x,
        o.css
      ))), a) {
        if (T >= a.end)
          j(n = a.b, 1 - n), Ct(l, a.b, "end"), f || (a.b ? b() : --a.group.r || fe(a.group.c)), a = null;
        else if (T >= a.start) {
          const q = T - a.start;
          n = a.a + a.d * x(q / a.duration), j(n, 1 - n);
        }
      }
      return !!(a || f);
    }));
  }
  return {
    run(v) {
      Tt(o) ? Ts().then(() => {
        o = o({ direction: v ? "in" : "out" }), g(v);
      }) : g(v);
    },
    end() {
      b(), a = f = null;
    }
  };
}
function Z(l) {
  return (l == null ? void 0 : l.length) !== void 0 ? l : Array.from(l);
}
function ht(l, e) {
  l.d(1), e.delete(l.key);
}
function bt(l, e, t, s, i, o, n, a, f, h, u, b) {
  let p = l.length, g = o.length, v = p;
  const m = {};
  for (; v--; ) m[l[v].key] = v;
  const y = [], x = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), w = [];
  for (v = g; v--; ) {
    const C = b(i, o, v), D = t(C);
    let Y = n.get(D);
    Y ? w.push(() => Y.p(C, e)) : (Y = h(D, C), Y.c()), x.set(D, y[v] = Y), D in m && j.set(D, Math.abs(v - m[D]));
  }
  const S = /* @__PURE__ */ new Set(), T = /* @__PURE__ */ new Set();
  function q(C) {
    Be(C, 1), C.m(a, u), n.set(C.key, C), u = C.first, g--;
  }
  for (; p && g; ) {
    const C = y[g - 1], D = l[p - 1], Y = C.key, I = D.key;
    C === D ? (u = C.first, p--, g--) : x.has(I) ? !n.has(Y) || S.has(Y) ? q(C) : T.has(I) ? p-- : j.get(Y) > j.get(I) ? (T.add(Y), q(C)) : (S.add(I), p--) : (f(D, n), p--);
  }
  for (; p--; ) {
    const C = l[p];
    x.has(C.key) || f(C, n);
  }
  for (; g; ) q(y[g - 1]);
  return fe(w), y;
}
function As(l, e, t) {
  const { fragment: s, after_update: i } = l.$$;
  s && s.m(e, t), ze(() => {
    const o = l.$$.on_mount.map(Ol).filter(Tt);
    l.$$.on_destroy ? l.$$.on_destroy.push(...o) : fe(o), l.$$.on_mount = [];
  }), i.forEach(ze);
}
function Es(l, e) {
  const t = l.$$;
  t.fragment !== null && ($s(t.after_update), fe(t.on_destroy), t.fragment && t.fragment.d(e), t.on_destroy = t.fragment = null, t.ctx = []);
}
function Ns(l, e) {
  l.$$.dirty[0] === -1 && (Xe.push(l), Ss(), l.$$.dirty.fill(0)), l.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function ie(l, e, t, s, i, o, n = null, a = [-1]) {
  const f = Ge;
  Qe(l);
  const h = l.$$ = {
    fragment: null,
    ctx: [],
    // state
    props: o,
    update: E,
    not_equal: i,
    bound: el(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(e.context || (f ? f.$$.context : [])),
    // everything else
    callbacks: el(),
    dirty: a,
    skip_bound: !1,
    root: e.target || f.$$.root
  };
  n && n(h.root);
  let u = !1;
  if (h.ctx = t ? t(l, e.props || {}, (b, p, ...g) => {
    const v = g.length ? g[0] : p;
    return h.ctx && i(h.ctx[b], h.ctx[b] = v) && (!h.skip_bound && h.bound[b] && h.bound[b](v), u && Ns(l, b)), p;
  }) : [], h.update(), u = !0, fe(h.before_update), h.fragment = s ? s(h.ctx) : !1, e.target) {
    if (e.hydrate) {
      const b = xs(e.target);
      h.fragment && h.fragment.l(b), b.forEach(L);
    } else
      h.fragment && h.fragment.c();
    e.intro && Be(l.$$.fragment), As(l, e.target, e.anchor), z();
  }
  Qe(f);
}
let Kl;
typeof HTMLElement == "function" && (Kl = class extends HTMLElement {
  constructor(e, t, s) {
    super();
    /** The Svelte component constructor */
    he(this, "$$ctor");
    /** Slots */
    he(this, "$$s");
    /** The Svelte component instance */
    he(this, "$$c");
    /** Whether or not the custom element is connected */
    he(this, "$$cn", !1);
    /** Component props data */
    he(this, "$$d", {});
    /** `true` if currently in the process of reflecting component props back to attributes */
    he(this, "$$r", !1);
    /** @type {Record<string, CustomElementPropDefinition>} Props definition (name, reflected, type etc) */
    he(this, "$$p_d", {});
    /** @type {Record<string, Function[]>} Event listeners */
    he(this, "$$l", {});
    /** @type {Map<Function, Function>} Event listener unsubscribe functions */
    he(this, "$$l_u", /* @__PURE__ */ new Map());
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
      let t = function(n) {
        return () => {
          let a;
          return {
            c: function() {
              a = d("slot"), n !== "default" && c(a, "name", n);
            },
            /**
             * @param {HTMLElement} target
             * @param {HTMLElement} [anchor]
             */
            m: function(u, b) {
              $(u, a, b);
            },
            d: function(u) {
              u && L(a);
            }
          };
        };
      };
      var e = t;
      if (await Promise.resolve(), !this.$$cn || this.$$c)
        return;
      const s = {}, i = _s(this);
      for (const n of this.$$s)
        n in i && (s[n] = [t(n)]);
      for (const n of this.attributes) {
        const a = this.$$g_p(n.name);
        a in this.$$d || (this.$$d[a] = ut(a, n.value, this.$$p_d, "toProp"));
      }
      for (const n in this.$$p_d)
        !(n in this.$$d) && this[n] !== void 0 && (this.$$d[n] = this[n], delete this[n]);
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
        for (const n in this.$$p_d)
          if (this.$$d[n] = this.$$c.$$.ctx[this.$$c.$$.props[n]], this.$$p_d[n].reflect) {
            const a = ut(
              n,
              this.$$d[n],
              this.$$p_d,
              "toAttribute"
            );
            a == null ? this.removeAttribute(this.$$p_d[n].attribute || n) : this.setAttribute(this.$$p_d[n].attribute || n, a);
          }
        this.$$r = !1;
      };
      this.$$c.$$.after_update.push(o), o();
      for (const n in this.$$l)
        for (const a of this.$$l[n]) {
          const f = this.$$c.$on(n, a);
          this.$$l_u.set(a, f);
        }
      this.$$l = {};
    }
  }
  // We don't need this when working within Svelte code, but for compatibility of people using this outside of Svelte
  // and setting attributes through setAttribute etc, this is helpful
  attributeChangedCallback(e, t, s) {
    var i;
    this.$$r || (e = this.$$g_p(e), this.$$d[e] = ut(e, s, this.$$p_d, "toProp"), (i = this.$$c) == null || i.$set({ [e]: this.$$d[e] }));
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
function ut(l, e, t, s) {
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
function ne(l, e, t, s, i, o) {
  let n = class extends Kl {
    constructor() {
      super(l, t, i), this.$$p_d = e;
    }
    static get observedAttributes() {
      return Object.keys(e).map(
        (a) => (e[a].attribute || a).toLowerCase()
      );
    }
  };
  return Object.keys(e).forEach((a) => {
    Object.defineProperty(n.prototype, a, {
      get() {
        return this.$$c && a in this.$$c ? this.$$c[a] : this.$$d[a];
      },
      set(f) {
        var h;
        f = ut(a, f, e), this.$$d[a] = f, (h = this.$$c) == null || h.$set({ [a]: f });
      }
    });
  }), s.forEach((a) => {
    Object.defineProperty(n.prototype, a, {
      get() {
        var f;
        return (f = this.$$c) == null ? void 0 : f[a];
      }
    });
  }), l.element = /** @type {any} */
  n, n;
}
class re {
  constructor() {
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    he(this, "$$");
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    he(this, "$$set");
  }
  /** @returns {void} */
  $destroy() {
    Es(this, 1), this.$destroy = E;
  }
  /**
   * @template {Extract<keyof Events, string>} K
   * @param {K} type
   * @param {((e: Events[K]) => void) | null | undefined} callback
   * @returns {() => void}
   */
  $on(e, t) {
    if (!Tt(t))
      return E;
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
    this.$$set && !hs(e) && (this.$$.skip_bound = !0, this.$$set(e), this.$$.skip_bound = !1);
  }
}
const Ds = "4";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(Ds);
function Ys(l) {
  se(l, "svelte-1tevv97", '.card.svelte-1tevv97{border-radius:14px;border:1px solid #e2e8f0;padding:16px;display:grid;gap:12px;font-family:"Figtree", system-ui, sans-serif;background:#ffffff;box-shadow:0 12px 24px rgba(15, 23, 42, 0.08)}.label.svelte-1tevv97{font-size:14px;color:#0f172a;margin:0}.count.svelte-1tevv97{font-weight:600;font-size:20px;color:#0f172a;margin:0}button.svelte-1tevv97{border:0;border-radius:10px;padding:10px 12px;background:#10b981;color:white;cursor:pointer;font-weight:600}button.svelte-1tevv97:hover{background:#059669}');
}
function Ps(l) {
  let e, t, s, i, o, n, a, f, h, u, b, p;
  return {
    c() {
      e = d("div"), t = d("p"), s = k("Hola "), i = k(
        /*name*/
        l[0]
      ), o = _(), n = d("p"), a = k("Count: "), f = k(
        /*count*/
        l[1]
      ), h = _(), u = d("button"), u.textContent = "Emitir evento", c(t, "class", "label svelte-1tevv97"), c(n, "class", "count svelte-1tevv97"), c(u, "type", "button"), c(u, "class", "svelte-1tevv97"), c(e, "class", "card svelte-1tevv97");
    },
    m(g, v) {
      $(g, e, v), r(e, t), r(t, s), r(t, i), r(e, o), r(e, n), r(n, a), r(n, f), r(e, h), r(e, u), b || (p = X(
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
    i: E,
    o: E,
    d(g) {
      g && L(e), b = !1, p();
    }
  };
}
function Rs(l, e, t) {
  let { name: s = "Ada" } = e, { count: i = 2 } = e;
  const o = qe(), n = () => {
    o("ping", { from: "svelte", count: i });
  };
  return l.$$set = (a) => {
    "name" in a && t(0, s = a.name), "count" in a && t(1, i = a.count);
  }, [s, i, n];
}
class Gl extends re {
  constructor(e) {
    super(), ie(this, e, Rs, Ps, F, { name: 0, count: 1 }, Ys);
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
ne(Gl, { name: {}, count: {} }, [], [], !0);
function Xs(l) {
  se(l, "svelte-5733sx", ".card.svelte-5733sx{position:relative;overflow:hidden;border-radius:20px;border:1px solid #d1fae5;background:linear-gradient(145deg, #ffffff, #ecfdf5);padding:20px;min-height:140px;box-shadow:0 16px 36px rgba(15, 23, 42, 0.12)}.glow.svelte-5733sx{position:absolute;inset:-40%;background:radial-gradient(circle at 30% 20%, rgba(16, 185, 129, 0.3), transparent 55%);opacity:0.7;filter:blur(8px)}.content.svelte-5733sx{position:relative;display:grid;gap:8px;color:#0f172a}.title.svelte-5733sx{font-size:16px;font-weight:600;margin:0}.subtitle.svelte-5733sx{font-size:12px;margin:0;color:#64748b}.metrics.svelte-5733sx{margin-top:12px;display:flex;justify-content:space-between;font-size:12px;color:#0f172a}.orbit.svelte-5733sx{position:absolute;inset:-30%;border-radius:999px;border:1px dashed rgba(16, 185, 129, 0.3);animation:svelte-5733sx-orbit 6s linear infinite;opacity:var(--orbit-alpha)}.satellite-orbit.svelte-5733sx{position:absolute;inset:-30%;border-radius:999px;animation:svelte-5733sx-orbit 6s linear infinite}.satellite.svelte-5733sx{position:absolute;width:10px;height:10px;border-radius:999px;background:#34d399;box-shadow:0 0 12px rgba(16, 185, 129, 0.6);top:50%;left:50%;transform:translate(-50%, -50%) translateY(-78px)}@keyframes svelte-5733sx-orbit{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}");
}
function Is(l) {
  let e, t, s, i, o, n, a, f, h, u, b, p, g, v, m, y, x, j, w, S, T, q, C;
  return {
    c() {
      e = d("div"), t = d("div"), s = _(), i = d("div"), o = d("p"), n = k(
        /*title*/
        l[0]
      ), a = _(), f = d("p"), h = k(
        /*subtitle*/
        l[1]
      ), u = _(), b = d("div"), p = d("span"), p.textContent = "Flow", g = _(), v = d("span"), m = k(
        /*flow*/
        l[3]
      ), y = k("%"), x = _(), j = d("div"), j.innerHTML = '<div class="satellite svelte-5733sx"></div>', w = _(), S = d("div"), c(t, "class", "glow svelte-5733sx"), c(o, "class", "title svelte-5733sx"), c(f, "class", "subtitle svelte-5733sx"), c(b, "class", "metrics svelte-5733sx"), c(i, "class", "content svelte-5733sx"), c(j, "class", "satellite-orbit svelte-5733sx"), c(S, "class", "orbit svelte-5733sx"), c(e, "class", "card svelte-5733sx"), c(e, "style", T = `--orbit-alpha:${/*intensity*/
      l[2]}`), c(e, "role", "button"), c(e, "tabindex", "0");
    },
    m(D, Y) {
      $(D, e, Y), r(e, t), r(e, s), r(e, i), r(i, o), r(o, n), r(i, a), r(i, f), r(f, h), r(i, u), r(i, b), r(b, p), r(b, g), r(b, v), r(v, m), r(v, y), r(e, x), r(e, j), r(e, w), r(e, S), q || (C = [
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
        n,
        /*title*/
        D[0]
      ), Y & /*subtitle*/
      2 && M(
        h,
        /*subtitle*/
        D[1]
      ), Y & /*flow*/
      8 && M(
        m,
        /*flow*/
        D[3]
      ), Y & /*intensity*/
      4 && T !== (T = `--orbit-alpha:${/*intensity*/
      D[2]}`) && c(e, "style", T);
    },
    i: E,
    o: E,
    d(D) {
      D && L(e), q = !1, fe(C);
    }
  };
}
function Os(l, e, t) {
  let { title: s = "Focus Ring" } = e, { subtitle: i = "Anillo orbital" } = e, { intensity: o = 0.6 } = e, { flow: n = 78 } = e;
  const a = qe(), f = () => {
    a("hover", { title: s });
  }, h = (u) => {
    (u.key === "Enter" || u.key === " ") && f();
  };
  return l.$$set = (u) => {
    "title" in u && t(0, s = u.title), "subtitle" in u && t(1, i = u.subtitle), "intensity" in u && t(2, o = u.intensity), "flow" in u && t(3, n = u.flow);
  }, [s, i, o, n, f, h];
}
class Wl extends re {
  constructor(e) {
    super(), ie(
      this,
      e,
      Os,
      Is,
      F,
      {
        title: 0,
        subtitle: 1,
        intensity: 2,
        flow: 3
      },
      Xs
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
ne(Wl, { title: {}, subtitle: {}, intensity: {}, flow: {} }, [], [], !0);
function Bs(l) {
  se(l, "svelte-1vzxgvk", ".badge.svelte-1vzxgvk.svelte-1vzxgvk{display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border-radius:999px;border:1px solid transparent;font-size:12px;font-weight:600;letter-spacing:0.02em;cursor:pointer;background:#ecfdf5;color:#065f46}.badge.emerald.svelte-1vzxgvk.svelte-1vzxgvk{border-color:rgba(16, 185, 129, 0.35)}.dot.svelte-1vzxgvk.svelte-1vzxgvk{width:8px;height:8px;border-radius:999px;background:currentColor;box-shadow:0 0 0 rgba(16, 185, 129, 0.6)}.active.svelte-1vzxgvk .dot.svelte-1vzxgvk{animation:svelte-1vzxgvk-pulse 1.8s ease-in-out infinite}@keyframes svelte-1vzxgvk-pulse{0%{box-shadow:0 0 0 0 rgba(16, 185, 129, 0.6)}70%{box-shadow:0 0 0 12px rgba(16, 185, 129, 0)}100%{box-shadow:0 0 0 0 rgba(16, 185, 129, 0)}}");
}
function Fs(l) {
  let e, t, s, i, o, n, a;
  return {
    c() {
      e = d("button"), t = d("span"), s = _(), i = k(
        /*label*/
        l[1]
      ), c(t, "class", "dot svelte-1vzxgvk"), c(e, "class", o = Me(`badge ${/*tone*/
      l[2]} ${/*active*/
      l[0] ? "active" : ""}`) + " svelte-1vzxgvk"), c(e, "type", "button");
    },
    m(f, h) {
      $(f, e, h), r(e, t), r(e, s), r(e, i), n || (a = X(
        e,
        "click",
        /*toggle*/
        l[3]
      ), n = !0);
    },
    p(f, [h]) {
      h & /*label*/
      2 && M(
        i,
        /*label*/
        f[1]
      ), h & /*tone, active*/
      5 && o !== (o = Me(`badge ${/*tone*/
      f[2]} ${/*active*/
      f[0] ? "active" : ""}`) + " svelte-1vzxgvk") && c(e, "class", o);
    },
    i: E,
    o: E,
    d(f) {
      f && L(e), n = !1, a();
    }
  };
}
function Hs(l, e, t) {
  let { label: s = "Live" } = e, { tone: i = "emerald" } = e, { active: o = !0 } = e;
  const n = qe(), a = () => {
    t(0, o = !o), n("toggle", { active: o });
  };
  return l.$$set = (f) => {
    "label" in f && t(1, s = f.label), "tone" in f && t(2, i = f.tone), "active" in f && t(0, o = f.active);
  }, [o, s, i, a];
}
class Zl extends re {
  constructor(e) {
    super(), ie(this, e, Hs, Fs, F, { label: 1, tone: 2, active: 0 }, Bs);
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
ne(Zl, { label: {}, tone: {}, active: { type: "Boolean" } }, [], [], !0);
function Vs(l) {
  se(l, "svelte-1io8dtn", ".ripple.svelte-1io8dtn{position:relative;overflow:hidden;padding:12px 20px;border-radius:14px;border:none;background:var(--tone);color:#ffffff;font-weight:600;cursor:pointer;box-shadow:0 16px 28px rgba(16, 185, 129, 0.25)}.label.svelte-1io8dtn{position:relative;z-index:1}.wave.svelte-1io8dtn{position:absolute;width:20px;height:20px;border-radius:999px;background:rgba(255, 255, 255, 0.45);transform:translate(-50%, -50%);animation:svelte-1io8dtn-ripple 0.8s ease-out forwards}@keyframes svelte-1io8dtn-ripple{from{opacity:0.7;transform:translate(-50%, -50%) scale(0)}to{opacity:0;transform:translate(-50%, -50%) scale(8)}}");
}
function rl(l, e, t) {
  const s = l.slice();
  return s[7] = e[t], s;
}
function al(l, e) {
  let t, s, i, o;
  function n() {
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
      t = d("span"), c(t, "class", "wave svelte-1io8dtn"), c(t, "style", s = `left:${/*ripple*/
      e[7].x}px; top:${/*ripple*/
      e[7].y}px;`), this.first = t;
    },
    m(a, f) {
      $(a, t, f), i || (o = X(t, "animationend", n), i = !0);
    },
    p(a, f) {
      e = a, f & /*ripples*/
      4 && s !== (s = `left:${/*ripple*/
      e[7].x}px; top:${/*ripple*/
      e[7].y}px;`) && c(t, "style", s);
    },
    d(a) {
      a && L(t), i = !1, o();
    }
  };
}
function Us(l) {
  let e, t = [], s = /* @__PURE__ */ new Map(), i, o, n, a, f, h, u = Z(
    /*ripples*/
    l[2]
  );
  const b = (p) => (
    /*ripple*/
    p[7].id
  );
  for (let p = 0; p < u.length; p += 1) {
    let g = rl(l, u, p), v = b(g);
    s.set(v, t[p] = al(v, g));
  }
  return {
    c() {
      e = d("button");
      for (let p = 0; p < t.length; p += 1)
        t[p].c();
      i = _(), o = d("span"), n = k(
        /*label*/
        l[0]
      ), c(o, "class", "label svelte-1io8dtn"), c(e, "class", "ripple svelte-1io8dtn"), c(e, "type", "button"), c(e, "style", a = `--tone:${/*tone*/
      l[1]}`);
    },
    m(p, g) {
      $(p, e, g);
      for (let v = 0; v < t.length; v += 1)
        t[v] && t[v].m(e, null);
      r(e, i), r(e, o), r(o, n), f || (h = X(
        e,
        "click",
        /*handleClick*/
        l[3]
      ), f = !0);
    },
    p(p, [g]) {
      g & /*ripples, removeRipple*/
      20 && (u = Z(
        /*ripples*/
        p[2]
      ), t = bt(t, g, b, 1, p, u, s, e, ht, al, i, rl)), g & /*label*/
      1 && M(
        n,
        /*label*/
        p[0]
      ), g & /*tone*/
      2 && a !== (a = `--tone:${/*tone*/
      p[1]}`) && c(e, "style", a);
    },
    i: E,
    o: E,
    d(p) {
      p && L(e);
      for (let g = 0; g < t.length; g += 1)
        t[g].d();
      f = !1, h();
    }
  };
}
function Js(l, e, t) {
  let { label: s = "Lanzar onda" } = e, { tone: i = "#10b981" } = e;
  const o = qe();
  let n = [];
  const a = (u) => {
    const b = u.currentTarget.getBoundingClientRect(), p = u.clientX - b.left, g = u.clientY - b.top, v = Math.random().toString(36).slice(2);
    t(2, n = [...n, { id: v, x: p, y: g }]), o("ripple", { x: p, y: g });
  }, f = (u) => {
    t(2, n = n.filter((b) => b.id !== u));
  }, h = (u) => f(u.id);
  return l.$$set = (u) => {
    "label" in u && t(0, s = u.label), "tone" in u && t(1, i = u.tone);
  }, [s, i, n, a, f, h];
}
class es extends re {
  constructor(e) {
    super(), ie(this, e, Js, Us, F, { label: 0, tone: 1 }, Vs);
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
ne(es, { label: {}, tone: {} }, [], [], !0);
function Qs(l) {
  se(l, "svelte-1jr61rp", ".list.svelte-1jr61rp{border-radius:18px;border:1px solid #e2e8f0;background:#ffffff;padding:16px;display:grid;gap:16px}.header.svelte-1jr61rp{display:flex;justify-content:space-between;align-items:center}.title.svelte-1jr61rp{margin:0;font-size:14px;font-weight:600;color:#0f172a}.subtitle.svelte-1jr61rp{margin:0;font-size:11px;color:#94a3b8}button.svelte-1jr61rp{border:1px solid #d1fae5;background:#ecfdf5;color:#065f46;font-size:12px;padding:6px 10px;border-radius:10px;cursor:pointer}.items.svelte-1jr61rp{display:grid;gap:10px}.item.svelte-1jr61rp{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-radius:12px;background:#f8fafc;color:#0f172a;font-size:13px;animation:svelte-1jr61rp-slide-in 0.5s ease forwards;opacity:0;transform:translateY(6px)}.score.svelte-1jr61rp{font-weight:600}@keyframes svelte-1jr61rp-slide-in{to{opacity:1;transform:translateY(0)}}");
}
function ol(l, e, t) {
  const s = l.slice();
  return s[7] = e[t], s[9] = t, s;
}
function cl(l, e) {
  let t, s, i = (
    /*item*/
    e[7].title + ""
  ), o, n, a, f = (
    /*item*/
    e[7].score + ""
  ), h, u, b, p;
  return {
    key: l,
    first: null,
    c() {
      t = d("div"), s = d("span"), o = k(i), n = _(), a = d("span"), h = k(f), u = k("%"), b = _(), c(a, "class", "score svelte-1jr61rp"), c(t, "class", "item svelte-1jr61rp"), c(t, "style", p = `animation-delay:${/*index*/
      e[9] * /*cadence*/
      e[1]}ms`), this.first = t;
    },
    m(g, v) {
      $(g, t, v), r(t, s), r(s, o), r(t, n), r(t, a), r(a, h), r(a, u), r(t, b);
    },
    p(g, v) {
      e = g, v & /*items*/
      4 && i !== (i = /*item*/
      e[7].title + "") && M(o, i), v & /*items*/
      4 && f !== (f = /*item*/
      e[7].score + "") && M(h, f), v & /*items, cadence*/
      6 && p !== (p = `animation-delay:${/*index*/
      e[9] * /*cadence*/
      e[1]}ms`) && c(t, "style", p);
    },
    d(g) {
      g && L(t);
    }
  };
}
function Ks(l) {
  let e, t, s, i, o, n, a, f, h, u, b, p, g = [], v = /* @__PURE__ */ new Map(), m, y, x = Z(
    /*items*/
    l[2]
  );
  const j = (w) => (
    /*item*/
    w[7].id
  );
  for (let w = 0; w < x.length; w += 1) {
    let S = ol(l, x, w), T = j(S);
    v.set(T, g[w] = cl(T, S));
  }
  return {
    c() {
      e = d("div"), t = d("div"), s = d("div"), i = d("p"), i.textContent = "Stagger list", o = _(), n = d("p"), a = k(
        /*count*/
        l[0]
      ), f = k(" items"), h = _(), u = d("button"), u.textContent = "Actualizar", b = _(), p = d("div");
      for (let w = 0; w < g.length; w += 1)
        g[w].c();
      c(i, "class", "title svelte-1jr61rp"), c(n, "class", "subtitle svelte-1jr61rp"), c(u, "type", "button"), c(u, "class", "svelte-1jr61rp"), c(t, "class", "header svelte-1jr61rp"), c(p, "class", "items svelte-1jr61rp"), c(e, "class", "list svelte-1jr61rp");
    },
    m(w, S) {
      $(w, e, S), r(e, t), r(t, s), r(s, i), r(s, o), r(s, n), r(n, a), r(n, f), r(t, h), r(t, u), r(e, b), r(e, p);
      for (let T = 0; T < g.length; T += 1)
        g[T] && g[T].m(p, null);
      m || (y = X(
        u,
        "click",
        /*handleRefresh*/
        l[3]
      ), m = !0);
    },
    p(w, [S]) {
      S & /*count*/
      1 && M(
        a,
        /*count*/
        w[0]
      ), S & /*items, cadence*/
      6 && (x = Z(
        /*items*/
        w[2]
      ), g = bt(g, S, j, 1, w, x, v, p, ht, cl, null, ol));
    },
    i: E,
    o: E,
    d(w) {
      w && L(e);
      for (let S = 0; S < g.length; S += 1)
        g[S].d();
      m = !1, y();
    }
  };
}
function Gs(l, e, t) {
  let { label: s = "Batch" } = e, { count: i = 5 } = e, { cadence: o = 120 } = e;
  const n = qe();
  let a = [];
  const f = () => {
    t(2, a = Array.from({ length: i }, (u, b) => ({
      id: `${s}-${b}`,
      title: `${s} ${b + 1}`,
      score: Math.floor(Math.random() * 40) + 60
    }))), n("refresh", { count: i });
  }, h = () => {
    f();
  };
  return js(f), l.$$set = (u) => {
    "label" in u && t(4, s = u.label), "count" in u && t(0, i = u.count), "cadence" in u && t(1, o = u.cadence);
  }, [i, o, a, h, s];
}
class ts extends re {
  constructor(e) {
    super(), ie(this, e, Gs, Ks, F, { label: 4, count: 0, cadence: 1 }, Qs);
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
ne(ts, { label: {}, count: {}, cadence: {} }, [], [], !0);
function Ws(l) {
  se(l, "svelte-1g1qxhj", ".thermo.svelte-1g1qxhj.svelte-1g1qxhj{display:grid;gap:16px;border-radius:18px;border:1px solid #e2e8f0;padding:16px;background:#ffffff}.thermo.frameless.svelte-1g1qxhj.svelte-1g1qxhj{border:none;background:transparent;padding:0;gap:6px;grid-template-columns:1fr;align-items:center;text-align:center}.header.svelte-1g1qxhj.svelte-1g1qxhj{display:flex;justify-content:space-between;align-items:center;gap:12px}.thermo.frameless.svelte-1g1qxhj .header.svelte-1g1qxhj{flex-direction:column;align-items:center;justify-content:center;min-width:0;text-align:center}.title.svelte-1g1qxhj.svelte-1g1qxhj{margin:0;font-size:14px;font-weight:600;color:#0f172a}.subtitle.svelte-1g1qxhj.svelte-1g1qxhj{margin:0;font-size:12px;color:#64748b}.meter.svelte-1g1qxhj.svelte-1g1qxhj{position:relative;height:160px;display:grid;place-items:center}.thermo.frameless.svelte-1g1qxhj .meter.svelte-1g1qxhj{align-self:start;width:52px;justify-self:center}.thermo.frameless.svelte-1g1qxhj .meter.svelte-1g1qxhj{height:120px}.tube.svelte-1g1qxhj.svelte-1g1qxhj{position:relative;width:24px;height:140px;border-radius:14px;background:#f1f5f9;border:1px solid #e2e8f0;overflow:hidden;box-shadow:inset 0 6px 16px rgba(15, 23, 42, 0.08)}.thermo.frameless.svelte-1g1qxhj .tube.svelte-1g1qxhj{height:110px}.fill.svelte-1g1qxhj.svelte-1g1qxhj{position:absolute;left:0;right:0;bottom:0;height:var(--level);background:linear-gradient(180deg, #ffffff, var(--fill));transition:height 0.8s cubic-bezier(0.22, 1, 0.36, 1)}.gloss.svelte-1g1qxhj.svelte-1g1qxhj{position:absolute;left:3px;top:8px;width:6px;height:calc(100% - 16px);border-radius:999px;background:rgba(255, 255, 255, 0.6);animation:svelte-1g1qxhj-shimmer 2.4s ease-in-out infinite}.bulb.svelte-1g1qxhj.svelte-1g1qxhj{position:absolute;bottom:-6px;width:44px;height:44px;border-radius:999px;background:radial-gradient(circle at 30% 30%, #ffffff, var(--fill));border:2px solid rgba(226, 232, 240, 0.9);box-shadow:0 10px 24px var(--glow);animation:svelte-1g1qxhj-pulse 2.2s ease-in-out infinite}.thermo.frameless.svelte-1g1qxhj .bulb.svelte-1g1qxhj{width:36px;height:36px}@keyframes svelte-1g1qxhj-shimmer{0%,100%{opacity:0.35;transform:translateY(0)}50%{opacity:0.7;transform:translateY(-8px)}}@keyframes svelte-1g1qxhj-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}");
}
function Zs(l) {
  let e, t, s, i, o, n, a, f, h, u, b, p;
  return {
    c() {
      e = d("div"), t = d("div"), s = d("div"), i = d("p"), o = k(
        /*label*/
        l[0]
      ), n = _(), a = d("p"), f = k(
        /*subtitleText*/
        l[3]
      ), h = _(), u = d("div"), u.innerHTML = '<div class="tube svelte-1g1qxhj"><div class="fill svelte-1g1qxhj"></div> <div class="gloss svelte-1g1qxhj"></div></div> <div class="bulb svelte-1g1qxhj"></div>', c(i, "class", "title svelte-1g1qxhj"), c(a, "class", "subtitle svelte-1g1qxhj"), c(t, "class", "header svelte-1g1qxhj"), c(u, "class", "meter svelte-1g1qxhj"), c(e, "class", b = Me(`thermo ${/*frameless*/
      l[1] ? "frameless" : ""}`) + " svelte-1g1qxhj"), c(e, "style", p = `--level:${/*percent*/
      l[2]}%; --fill:${/*fillColor*/
      l[5]}; --glow:${/*glowColor*/
      l[4]};`);
    },
    m(g, v) {
      $(g, e, v), r(e, t), r(t, s), r(s, i), r(i, o), r(s, n), r(s, a), r(a, f), r(e, h), r(e, u);
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
      2 && b !== (b = Me(`thermo ${/*frameless*/
      g[1] ? "frameless" : ""}`) + " svelte-1g1qxhj") && c(e, "class", b), v & /*percent, fillColor, glowColor*/
      52 && p !== (p = `--level:${/*percent*/
      g[2]}%; --fill:${/*fillColor*/
      g[5]}; --glow:${/*glowColor*/
      g[4]};`) && c(e, "style", p);
    },
    i: E,
    o: E,
    d(g) {
      g && L(e);
    }
  };
}
function ei(l, e, t) {
  let s, i, o, n, a, f, h, u, b, { label: p = "Temperatura" } = e, { value: g = 22 } = e, { min: v = 0 } = e, { max: m = 40 } = e, { subtitle: y = "" } = e, { frameless: x = !1 } = e;
  const j = (T, q, C) => Math.min(C, Math.max(q, T)), w = (T, q, C) => Math.round(T + (q - T) * C), S = (T, q, C) => `rgb(${T}, ${q}, ${C})`;
  return l.$$set = (T) => {
    "label" in T && t(0, p = T.label), "value" in T && t(6, g = T.value), "min" in T && t(7, v = T.min), "max" in T && t(8, m = T.max), "subtitle" in T && t(9, y = T.subtitle), "frameless" in T && t(1, x = T.frameless);
  }, l.$$.update = () => {
    l.$$.dirty & /*value, min, max*/
    448 && t(10, s = j(g, v, m)), l.$$.dirty & /*safeValue, min, max*/
    1408 && t(12, i = (s - v) / (m - v || 1)), l.$$.dirty & /*ratio*/
    4096 && t(2, o = Math.round(i * 100)), l.$$.dirty & /*cool, warm, ratio*/
    28672 && t(11, f = {
      r: w(a.r, n.r, i),
      g: w(a.g, n.g, i),
      b: w(a.b, n.b, i)
    }), l.$$.dirty & /*mix*/
    2048 && t(5, h = S(f.r, f.g, f.b)), l.$$.dirty & /*mix*/
    2048 && t(4, u = `rgba(${f.r}, ${f.g}, ${f.b}, 0.45)`), l.$$.dirty & /*subtitle, safeValue, percent*/
    1540 && t(3, b = y || `${s}C - ${o}%`);
  }, t(13, n = { r: 239, g: 68, b: 68 }), t(14, a = { r: 34, g: 197, b: 94 }), [
    p,
    x,
    o,
    b,
    u,
    h,
    g,
    v,
    m,
    y,
    s,
    f,
    i,
    n,
    a
  ];
}
class ls extends re {
  constructor(e) {
    super(), ie(
      this,
      e,
      ei,
      Zs,
      F,
      {
        label: 0,
        value: 6,
        min: 7,
        max: 8,
        subtitle: 9,
        frameless: 1
      },
      Ws
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
ne(ls, { label: {}, value: {}, min: {}, max: {}, subtitle: {}, frameless: { type: "Boolean" } }, [], [], !0);
function ti(l) {
  se(l, "svelte-q2ay9k", `.podium.svelte-q2ay9k.svelte-q2ay9k{position:relative;border-radius:18px;border:1px solid #e2e8f0;background:linear-gradient(180deg, #ffffff, #f8fafc);padding:24px 18px 16px;height:220px;display:grid;align-items:end}.line.svelte-q2ay9k.svelte-q2ay9k{position:absolute;left:16px;right:16px;bottom:24px;height:2px;background:linear-gradient(90deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.6))}.controls.svelte-q2ay9k.svelte-q2ay9k{position:absolute;top:14px;right:14px;display:flex;gap:8px}.reset.svelte-q2ay9k.svelte-q2ay9k,.swap.svelte-q2ay9k.svelte-q2ay9k{border:1px solid rgba(16, 185, 129, 0.3);background:#ecfdf5;color:#065f46;font-size:11px;padding:6px 10px;border-radius:999px;cursor:pointer}.reset.svelte-q2ay9k.svelte-q2ay9k:hover,.swap.svelte-q2ay9k.svelte-q2ay9k:hover{background:#d1fae5}.stack.svelte-q2ay9k.svelte-q2ay9k{position:relative;display:grid;grid-template-columns:repeat(3, 1fr);align-items:end;gap:14px;height:100%;z-index:1}.bar.svelte-q2ay9k.svelte-q2ay9k{position:relative;border-radius:14px 14px 6px 6px;background:#d1fae5;color:#065f46;display:grid;place-items:center;font-size:14px;font-weight:600;transform-origin:bottom;animation:svelte-q2ay9k-rise var(--dur) cubic-bezier(0.22, 1, 0.36, 1) forwards;transform:scaleY(0)}.bar.svelte-q2ay9k span.svelte-q2ay9k{opacity:0;animation:svelte-q2ay9k-fade-in 0.5s ease forwards;animation-delay:calc(var(--dur) * 0.7)}.bar.svelte-q2ay9k.svelte-q2ay9k::after{content:"";position:absolute;inset:8px;border-radius:10px;background:linear-gradient(120deg, rgba(255, 255, 255, 0.4), transparent 60%);opacity:0;animation:svelte-q2ay9k-sweep 1.6s ease forwards;animation-delay:calc(var(--dur) * 0.4)}.bar.first.svelte-q2ay9k.svelte-q2ay9k{background:linear-gradient(180deg, #10b981, #34d399);color:#ffffff;box-shadow:0 14px 24px rgba(16, 185, 129, 0.35)}.bar.second.svelte-q2ay9k.svelte-q2ay9k{background:linear-gradient(180deg, #34d399, #6ee7b7)}.bar.third.svelte-q2ay9k.svelte-q2ay9k{background:linear-gradient(180deg, #bbf7d0, #ecfdf5)}.podium[data-play].svelte-q2ay9k .bar.svelte-q2ay9k{animation:svelte-q2ay9k-rise var(--dur) cubic-bezier(0.22, 1, 0.36, 1) forwards,
      svelte-q2ay9k-settle 0.35s ease-out forwards;animation-delay:0s, calc(var(--dur) * 0.9)}.podium[data-play].svelte-q2ay9k .bar span.svelte-q2ay9k{animation:svelte-q2ay9k-fade-in 0.5s ease forwards;animation-delay:calc(var(--dur) * 0.7)}.podium[data-play].svelte-q2ay9k .bar.svelte-q2ay9k::after{animation:svelte-q2ay9k-sweep 1.6s ease forwards;animation-delay:calc(var(--dur) * 0.4)}@keyframes svelte-q2ay9k-rise{to{transform:scaleY(1)}}@keyframes svelte-q2ay9k-settle{0%{transform:scaleY(1.02)}100%{transform:scaleY(1)}}@keyframes svelte-q2ay9k-fade-in{to{opacity:1}}@keyframes svelte-q2ay9k-sweep{0%{opacity:0;transform:translateY(10%)}50%{opacity:0.5}100%{opacity:0;transform:translateY(-20%)}}`);
}
function fl(l, e, t) {
  const s = l.slice();
  return s[12] = e[t], s;
}
function dl(l, e) {
  let t, s, i = (
    /*item*/
    e[12].label + ""
  ), o, n, a, f;
  return {
    key: l,
    first: null,
    c() {
      t = d("div"), s = d("span"), o = k(i), n = _(), c(s, "class", "svelte-q2ay9k"), c(t, "class", a = Me(`bar ${/*item*/
      e[12].className}`) + " svelte-q2ay9k"), c(t, "style", f = `height:${/*item*/
      e[12].height}%; --dur:${/*item*/
      e[12].duration}s;`), this.first = t;
    },
    m(h, u) {
      $(h, t, u), r(t, s), r(s, o), r(t, n);
    },
    p(h, u) {
      e = h, u & /*items*/
      2 && i !== (i = /*item*/
      e[12].label + "") && M(o, i), u & /*items*/
      2 && a !== (a = Me(`bar ${/*item*/
      e[12].className}`) + " svelte-q2ay9k") && c(t, "class", a), u & /*items*/
      2 && f !== (f = `height:${/*item*/
      e[12].height}%; --dur:${/*item*/
      e[12].duration}s;`) && c(t, "style", f);
    },
    d(h) {
      h && L(t);
    }
  };
}
function ul(l) {
  let e, t = [], s = /* @__PURE__ */ new Map(), i = Z(
    /*items*/
    l[1]
  );
  const o = (n) => (
    /*item*/
    n[12].key
  );
  for (let n = 0; n < i.length; n += 1) {
    let a = fl(l, i, n), f = o(a);
    s.set(f, t[n] = dl(f, a));
  }
  return {
    c() {
      e = d("div");
      for (let n = 0; n < t.length; n += 1)
        t[n].c();
      c(e, "class", "stack svelte-q2ay9k");
    },
    m(n, a) {
      $(n, e, a);
      for (let f = 0; f < t.length; f += 1)
        t[f] && t[f].m(e, null);
    },
    p(n, a) {
      a & /*items*/
      2 && (i = Z(
        /*items*/
        n[1]
      ), t = bt(t, a, o, 1, n, i, s, e, ht, dl, null, fl));
    },
    d(n) {
      n && L(e);
      for (let a = 0; a < t.length; a += 1)
        t[a].d();
    }
  };
}
function li(l) {
  let e, t, s, i, o, n, a, f, h = (
    /*playId*/
    l[0]
  ), u, b, p = ul(l);
  return {
    c() {
      e = d("div"), t = d("div"), s = _(), i = d("div"), o = d("button"), o.textContent = "Reiniciar", n = _(), a = d("button"), a.textContent = "Intercalar", f = _(), p.c(), c(t, "class", "line svelte-q2ay9k"), c(o, "class", "reset svelte-q2ay9k"), c(o, "type", "button"), c(a, "class", "swap svelte-q2ay9k"), c(a, "type", "button"), c(i, "class", "controls svelte-q2ay9k"), c(e, "class", "podium svelte-q2ay9k"), c(
        e,
        "data-play",
        /*playId*/
        l[0]
      );
    },
    m(g, v) {
      $(g, e, v), r(e, t), r(e, s), r(e, i), r(i, o), r(i, n), r(i, a), r(e, f), p.m(e, null), u || (b = [
        X(
          o,
          "click",
          /*reset*/
          l[2]
        ),
        X(
          a,
          "click",
          /*cycle*/
          l[3]
        )
      ], u = !0);
    },
    p(g, [v]) {
      v & /*playId*/
      1 && F(h, h = /*playId*/
      g[0]) ? (p.d(1), p = ul(g), p.c(), p.m(e, null)) : p.p(g, v), v & /*playId*/
      1 && c(
        e,
        "data-play",
        /*playId*/
        g[0]
      );
    },
    i: E,
    o: E,
    d(g) {
      g && L(e), p.d(g), u = !1, fe(b);
    }
  };
}
function si(l, e, t) {
  let s, { first: i = 82 } = e, { second: o = 64 } = e, { third: n = 48 } = e, { baseDuration: a = 0.9 } = e, { delayStep: f = 0.15 } = e, h = 0, u = ["second", "first", "third"];
  const b = {
    first: { label: "1", className: "first" },
    second: { label: "2", className: "second" },
    third: { label: "3", className: "third" }
  }, p = (m) => m === "first" ? i : m === "second" ? o : n, g = () => {
    t(0, h += 1);
  }, v = () => {
    t(9, u = [u[1], u[2], u[0]]), t(0, h += 1);
  };
  return l.$$set = (m) => {
    "first" in m && t(4, i = m.first), "second" in m && t(5, o = m.second), "third" in m && t(6, n = m.third), "baseDuration" in m && t(7, a = m.baseDuration), "delayStep" in m && t(8, f = m.delayStep);
  }, l.$$.update = () => {
    l.$$.dirty & /*order, baseDuration, delayStep*/
    896 && t(1, s = u.map((m, y) => ({
      key: m,
      label: b[m].label,
      className: b[m].className,
      height: p(m),
      duration: a + y * f * 2
    })));
  }, [
    h,
    s,
    g,
    v,
    i,
    o,
    n,
    a,
    f,
    u
  ];
}
class ss extends re {
  constructor(e) {
    super(), ie(
      this,
      e,
      si,
      li,
      F,
      {
        first: 4,
        second: 5,
        third: 6,
        baseDuration: 7,
        delayStep: 8
      },
      ti
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
ne(ss, { first: {}, second: {}, third: {}, baseDuration: {}, delayStep: {} }, [], [], !0);
function ii(l) {
  se(l, "svelte-1jqbzw8", ".balloon-card.svelte-1jqbzw8{border-radius:18px;border:1px solid #e2e8f0;background:linear-gradient(180deg, #ffffff, #f8fafc);padding:16px;height:220px;display:grid;place-items:center}.scene.svelte-1jqbzw8{position:relative;width:160px;height:180px}.rope.svelte-1jqbzw8{position:absolute;left:50%;bottom:14px;width:2px;height:90px;background:var(--rope);transform-origin:bottom;transform:translateX(-50%);animation:svelte-1jqbzw8-rope-sway var(--speed) ease-in-out infinite}.anchor.svelte-1jqbzw8{position:absolute;left:50%;bottom:0;width:18px;height:18px;border-radius:999px;background:#e2e8f0;border:2px solid #cbd5f5;transform:translateX(-50%)}.balloon.svelte-1jqbzw8{position:absolute;left:50%;bottom:96px;width:64px;height:74px;border-radius:50% 50% 46% 46%;background:radial-gradient(circle at 35% 30%, #ffffff, var(--balloon));box-shadow:0 16px 26px rgba(16, 185, 129, 0.2);transform-origin:bottom center;transform:translateX(-50%);animation:svelte-1jqbzw8-float var(--speed) ease-in-out infinite}.string.svelte-1jqbzw8{position:absolute;left:50%;bottom:-26px;width:2px;height:26px;background:var(--rope);transform:translateX(-50%)}@keyframes svelte-1jqbzw8-float{0%,100%{transform:translateX(-50%) translateY(0) rotate(0deg)}50%{transform:translateX(-50%) translateY(calc(var(--lift) * -1)) rotate(var(--sway))}}@keyframes svelte-1jqbzw8-rope-sway{0%,100%{transform:translateX(-50%) rotate(0deg)}50%{transform:translateX(-50%) rotate(calc(var(--sway) * -0.4))}}");
}
function ni(l) {
  let e, t, s;
  return {
    c() {
      e = d("div"), t = d("div"), t.innerHTML = '<div class="rope svelte-1jqbzw8"></div> <div class="anchor svelte-1jqbzw8"></div> <div class="balloon svelte-1jqbzw8"><div class="string svelte-1jqbzw8"></div></div>', c(t, "class", "scene svelte-1jqbzw8"), c(e, "class", "balloon-card svelte-1jqbzw8"), c(e, "style", s = `
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
      $(i, e, o), r(e, t);
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
  `) && c(e, "style", s);
    },
    i: E,
    o: E,
    d(i) {
      i && L(e);
    }
  };
}
function ri(l, e, t) {
  let { lift: s = 18 } = e, { sway: i = 6 } = e, { speed: o = 5.5 } = e, { color: n = "#10b981" } = e, { rope: a = "#94a3b8" } = e;
  return l.$$set = (f) => {
    "lift" in f && t(0, s = f.lift), "sway" in f && t(1, i = f.sway), "speed" in f && t(2, o = f.speed), "color" in f && t(3, n = f.color), "rope" in f && t(4, a = f.rope);
  }, [s, i, o, n, a];
}
class is extends re {
  constructor(e) {
    super(), ie(
      this,
      e,
      ri,
      ni,
      F,
      {
        lift: 0,
        sway: 1,
        speed: 2,
        color: 3,
        rope: 4
      },
      ii
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
ne(is, { lift: {}, sway: {}, speed: {}, color: {}, rope: {} }, [], [], !0);
function ai(l) {
  se(l, "svelte-9cnfqg", '.wrapper.svelte-9cnfqg.svelte-9cnfqg{display:grid;grid-template-columns:28px 1fr 28px;align-items:stretch;gap:12px}.nav.svelte-9cnfqg.svelte-9cnfqg{border:1px solid #e2e8f0;background:#f8fafc;border-radius:14px;display:grid;place-items:center;height:100%;cursor:pointer;transition:transform 0.2s ease, background 0.2s ease;position:relative;overflow:hidden}.nav.svelte-9cnfqg.svelte-9cnfqg:hover{background:#e2e8f0;transform:translateY(-2px)}.nav.svelte-9cnfqg.svelte-9cnfqg::after{content:"";position:absolute;inset:0;background:linear-gradient(120deg, transparent, rgba(16, 185, 129, 0.25), transparent);transform:translateX(-120%);transition:transform 0.45s ease}.nav.svelte-9cnfqg.svelte-9cnfqg:hover::after{transform:translateX(120%)}.chevron.svelte-9cnfqg.svelte-9cnfqg{width:10px;height:28px;border-right:2px solid #475569;border-bottom:2px solid #475569;transform:rotate(-45deg)}.nav.left.svelte-9cnfqg .chevron.svelte-9cnfqg{transform:rotate(135deg)}.card.svelte-9cnfqg.svelte-9cnfqg{display:grid;grid-template-columns:72px 1fr;gap:16px;padding:18px 20px;border-radius:20px;border:1px solid #e2e8f0;background:#ffffff;box-shadow:0 14px 26px rgba(15, 23, 42, 0.08);transition:transform 0.35s ease, box-shadow 0.35s ease}.card.svelte-9cnfqg.svelte-9cnfqg:hover{transform:translateY(-4px);box-shadow:0 18px 34px rgba(15, 23, 42, 0.16)}.icon.svelte-9cnfqg.svelte-9cnfqg{width:56px;height:56px;border-radius:16px;background:#f8fafc;display:grid;place-items:center}.ladder.svelte-9cnfqg.svelte-9cnfqg{width:28px;height:36px;border:3px solid #7c5c4f;border-left-width:5px;border-right-width:5px;border-radius:6px;position:relative}.ladder.svelte-9cnfqg span.svelte-9cnfqg{position:absolute;left:2px;right:2px;height:4px;background:#7c5c4f;border-radius:999px;animation:svelte-9cnfqg-rung 2.8s ease-in-out infinite}.ladder.svelte-9cnfqg span.svelte-9cnfqg:nth-child(1){top:6px;animation-delay:0s}.ladder.svelte-9cnfqg span.svelte-9cnfqg:nth-child(2){top:14px;animation-delay:0.2s}.ladder.svelte-9cnfqg span.svelte-9cnfqg:nth-child(3){top:22px;animation-delay:0.4s}.ladder.svelte-9cnfqg span.svelte-9cnfqg:nth-child(4){top:30px;animation-delay:0.6s}.content.svelte-9cnfqg.svelte-9cnfqg{display:grid;gap:8px}.panel.svelte-9cnfqg.svelte-9cnfqg{animation:svelte-9cnfqg-slide-in 0.4s ease}.row.svelte-9cnfqg.svelte-9cnfqg{display:flex;align-items:center;justify-content:space-between;gap:12px}.title.svelte-9cnfqg.svelte-9cnfqg{display:flex;align-items:baseline;gap:12px}.title.svelte-9cnfqg strong.svelte-9cnfqg{font-size:18px;color:#0f172a}.title.svelte-9cnfqg span.svelte-9cnfqg{font-size:14px;color:#64748b}.level-text.svelte-9cnfqg.svelte-9cnfqg{font-size:14px;color:#64748b;animation:svelte-9cnfqg-level-pop 0.35s ease}.pill.svelte-9cnfqg.svelte-9cnfqg{padding:6px 14px;background:#eef2ff;color:#1e3a8a;border-radius:999px;font-size:12px;font-weight:600}.desc.svelte-9cnfqg.svelte-9cnfqg{margin:0;font-size:14px;color:#0f172a}.meta.svelte-9cnfqg.svelte-9cnfqg{font-size:13px;color:#475569}.xp.svelte-9cnfqg.svelte-9cnfqg{font-weight:600;color:#047857}.progress.svelte-9cnfqg.svelte-9cnfqg{position:relative;height:12px;border-radius:999px;background:#f1f5f9;overflow:hidden}.bar.svelte-9cnfqg.svelte-9cnfqg{height:100%;width:var(--fill);background:linear-gradient(90deg, #10b981, #34d399);transition:width 0.8s cubic-bezier(0.22, 1, 0.36, 1)}.glow.svelte-9cnfqg.svelte-9cnfqg{position:absolute;inset:0;background:linear-gradient(90deg, rgba(16, 185, 129, 0), rgba(16, 185, 129, 0.35), rgba(16, 185, 129, 0));transform:translateX(-100%);animation:svelte-9cnfqg-sweep 3.2s ease-in-out infinite}@keyframes svelte-9cnfqg-sweep{0%,60%{transform:translateX(-100%)}100%{transform:translateX(100%)}}@keyframes svelte-9cnfqg-level-pop{0%{opacity:0;transform:translateY(4px)}100%{opacity:1;transform:translateY(0)}}@keyframes svelte-9cnfqg-rung{0%,100%{opacity:0.6}50%{opacity:1}}@keyframes svelte-9cnfqg-slide-in{from{opacity:0;transform:translateX(calc(var(--dir) * 12px))}to{opacity:1;transform:translateX(0)}}');
}
function pl(l) {
  let e, t, s, i, o, n, a, f, h, u, b, p, g, v, m, y, x, j, w, S, T, q, C, D, Y, I, J, H, pe, ve, oe, G, ce, ee, W;
  return {
    c() {
      e = d("div"), t = d("div"), s = d("div"), i = d("strong"), o = k(
        /*title*/
        l[0]
      ), n = _(), a = d("span"), f = k("Nivel "), h = k(
        /*activeLevel*/
        l[4]
      ), u = k("/"), b = k(
        /*safeLevelTotal*/
        l[5]
      ), p = _(), g = d("div"), v = k(
        /*status*/
        l[3]
      ), m = _(), y = d("p"), x = k(
        /*description*/
        l[1]
      ), j = _(), w = d("div"), S = d("span"), T = k("Progreso: "), q = k(
        /*safeProgress*/
        l[7]
      ), C = k(" / "), D = k(
        /*safeTotal*/
        l[6]
      ), Y = _(), I = d("span"), J = k("+"), H = k(
        /*xp*/
        l[2]
      ), pe = k(" XP"), ve = _(), oe = d("div"), G = d("div"), ee = _(), W = d("div"), c(i, "class", "svelte-9cnfqg"), c(a, "class", "level-text svelte-9cnfqg"), c(s, "class", "title svelte-9cnfqg"), c(g, "class", "pill svelte-9cnfqg"), c(t, "class", "row svelte-9cnfqg"), c(y, "class", "desc svelte-9cnfqg"), c(I, "class", "xp svelte-9cnfqg"), c(w, "class", "row meta svelte-9cnfqg"), c(G, "class", "bar svelte-9cnfqg"), c(G, "style", ce = `--fill:${/*percent*/
      l[9]}%`), c(W, "class", "glow svelte-9cnfqg"), c(oe, "class", "progress svelte-9cnfqg"), c(e, "class", "panel svelte-9cnfqg");
    },
    m(O, R) {
      $(O, e, R), r(e, t), r(t, s), r(s, i), r(i, o), r(s, n), r(s, a), r(a, f), r(a, h), r(a, u), r(a, b), r(t, p), r(t, g), r(g, v), r(e, m), r(e, y), r(y, x), r(e, j), r(e, w), r(w, S), r(S, T), r(S, q), r(S, C), r(S, D), r(w, Y), r(w, I), r(I, J), r(I, H), r(I, pe), r(e, ve), r(e, oe), r(oe, G), r(oe, ee), r(oe, W);
    },
    p(O, R) {
      R & /*title*/
      1 && M(
        o,
        /*title*/
        O[0]
      ), R & /*activeLevel*/
      16 && M(
        h,
        /*activeLevel*/
        O[4]
      ), R & /*safeLevelTotal*/
      32 && M(
        b,
        /*safeLevelTotal*/
        O[5]
      ), R & /*status*/
      8 && M(
        v,
        /*status*/
        O[3]
      ), R & /*description*/
      2 && M(
        x,
        /*description*/
        O[1]
      ), R & /*safeProgress*/
      128 && M(
        q,
        /*safeProgress*/
        O[7]
      ), R & /*safeTotal*/
      64 && M(
        D,
        /*safeTotal*/
        O[6]
      ), R & /*xp*/
      4 && M(
        H,
        /*xp*/
        O[2]
      ), R & /*percent*/
      512 && ce !== (ce = `--fill:${/*percent*/
      O[9]}%`) && c(G, "style", ce);
    },
    d(O) {
      O && L(e);
    }
  };
}
function oi(l) {
  let e, t, s, i, o, n, a, f = (
    /*activeLevel*/
    l[4]
  ), h, u, b, p, g, v = pl(l);
  return {
    c() {
      e = d("div"), t = d("button"), t.innerHTML = '<span class="chevron svelte-9cnfqg"></span>', s = _(), i = d("div"), o = d("div"), o.innerHTML = '<div class="ladder svelte-9cnfqg"><span class="svelte-9cnfqg"></span> <span class="svelte-9cnfqg"></span> <span class="svelte-9cnfqg"></span> <span class="svelte-9cnfqg"></span></div>', n = _(), a = d("div"), v.c(), u = _(), b = d("button"), b.innerHTML = '<span class="chevron svelte-9cnfqg"></span>', c(t, "class", "nav left svelte-9cnfqg"), c(t, "type", "button"), c(t, "aria-label", "Nivel anterior"), c(o, "class", "icon svelte-9cnfqg"), c(a, "class", "content svelte-9cnfqg"), c(a, "style", h = `--dir:${/*slideDir*/
      l[8]}`), c(i, "class", "card svelte-9cnfqg"), c(b, "class", "nav right svelte-9cnfqg"), c(b, "type", "button"), c(b, "aria-label", "Nivel siguiente"), c(e, "class", "wrapper svelte-9cnfqg");
    },
    m(m, y) {
      $(m, e, y), r(e, t), r(e, s), r(e, i), r(i, o), r(i, n), r(i, a), v.m(a, null), r(e, u), r(e, b), p || (g = [
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
    p(m, [y]) {
      y & /*activeLevel*/
      16 && F(f, f = /*activeLevel*/
      m[4]) ? (v.d(1), v = pl(m), v.c(), v.m(a, null)) : v.p(m, y), y & /*slideDir*/
      256 && h !== (h = `--dir:${/*slideDir*/
      m[8]}`) && c(a, "style", h);
    },
    i: E,
    o: E,
    d(m) {
      m && L(e), v.d(m), p = !1, fe(g);
    }
  };
}
function ci(l, e, t) {
  let s, i, o, n, a, { title: f = "Nivel 5" } = e, { subtitle: h = "Nivel 1/3" } = e, { description: u = "Alcanza nivel 5 de usuario." } = e, { progress: b = 4 } = e, { total: p = 5 } = e, { xp: g = 15 } = e, { status: v = "En progreso" } = e, { levelIndex: m = 1 } = e, { levelTotal: y = 3 } = e;
  const x = (C, D, Y) => Math.min(Y, Math.max(D, C));
  let j = x(m, 1, a), w = 1;
  const S = (C) => {
    t(8, w = C >= 0 ? 1 : -1), t(4, j = x(j + C, 1, a));
  }, T = () => S(-1), q = () => S(1);
  return l.$$set = (C) => {
    "title" in C && t(0, f = C.title), "subtitle" in C && t(11, h = C.subtitle), "description" in C && t(1, u = C.description), "progress" in C && t(12, b = C.progress), "total" in C && t(13, p = C.total), "xp" in C && t(2, g = C.xp), "status" in C && t(3, v = C.status), "levelIndex" in C && t(14, m = C.levelIndex), "levelTotal" in C && t(15, y = C.levelTotal);
  }, l.$$.update = () => {
    l.$$.dirty & /*total*/
    8192 && t(6, s = Math.max(1, p)), l.$$.dirty & /*progress, safeTotal*/
    4160 && t(7, i = x(b, 0, s)), l.$$.dirty & /*safeProgress, safeTotal*/
    192 && t(16, o = i / s), l.$$.dirty & /*ratio*/
    65536 && t(9, n = Math.round(o * 100)), l.$$.dirty & /*levelTotal*/
    32768 && t(5, a = Math.max(1, y)), l.$$.dirty & /*levelIndex, activeLevel, safeLevelTotal*/
    16432 && m !== j && t(4, j = x(m, 1, a));
  }, [
    f,
    u,
    g,
    v,
    j,
    a,
    s,
    i,
    w,
    n,
    S,
    h,
    b,
    p,
    m,
    y,
    o,
    T,
    q
  ];
}
class ns extends re {
  constructor(e) {
    super(), ie(
      this,
      e,
      ci,
      oi,
      F,
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
      ai
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
ne(ns, { title: {}, subtitle: {}, description: {}, progress: {}, total: {}, xp: {}, status: {}, levelIndex: {}, levelTotal: {} }, [], [], !0);
function fi(l) {
  se(l, "svelte-12k2sv8", ".card.svelte-12k2sv8{position:relative;border-radius:18px;border:1px solid #e2e8f0;background:linear-gradient(160deg, #ffffff, #ecfdf5);padding:18px;overflow:hidden;transform:perspective(800px) rotateX(var(--rx)) rotateY(var(--ry));transition:transform 0.2s ease;box-shadow:0 18px 32px rgba(15, 23, 42, 0.12)}.shine.svelte-12k2sv8{position:absolute;inset:0;background:radial-gradient(circle at var(--shine) 20%, rgba(16, 185, 129, 0.22), transparent 55%);pointer-events:none}.content.svelte-12k2sv8{position:relative;display:grid;gap:6px}.title.svelte-12k2sv8{margin:0;font-size:12px;color:#64748b;letter-spacing:0.08em;text-transform:uppercase}.value.svelte-12k2sv8{margin:0;font-size:28px;font-weight:700;color:#0f172a}.hint.svelte-12k2sv8{margin:0;font-size:12px;color:#475569}");
}
function di(l) {
  let e, t, s, i, o, n, a, f, h, u, b, p, g, v, m;
  return {
    c() {
      e = d("div"), t = d("div"), s = _(), i = d("div"), o = d("p"), n = k(
        /*title*/
        l[0]
      ), a = _(), f = d("p"), h = k(
        /*value*/
        l[1]
      ), u = _(), b = d("p"), p = k(
        /*hint*/
        l[2]
      ), c(t, "class", "shine svelte-12k2sv8"), c(o, "class", "title svelte-12k2sv8"), c(f, "class", "value svelte-12k2sv8"), c(b, "class", "hint svelte-12k2sv8"), c(i, "class", "content svelte-12k2sv8"), c(e, "class", "card svelte-12k2sv8"), c(e, "style", g = `--rx:${/*rx*/
      l[3]}deg; --ry:${/*ry*/
      l[4]}deg; --shine:${/*shine*/
      l[5]}%`);
    },
    m(y, x) {
      $(y, e, x), r(e, t), r(e, s), r(e, i), r(i, o), r(o, n), r(i, a), r(i, f), r(f, h), r(i, u), r(i, b), r(b, p), v || (m = [
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
    p(y, [x]) {
      x & /*title*/
      1 && M(
        n,
        /*title*/
        y[0]
      ), x & /*value*/
      2 && M(
        h,
        /*value*/
        y[1]
      ), x & /*hint*/
      4 && M(
        p,
        /*hint*/
        y[2]
      ), x & /*rx, ry, shine*/
      56 && g !== (g = `--rx:${/*rx*/
      y[3]}deg; --ry:${/*ry*/
      y[4]}deg; --shine:${/*shine*/
      y[5]}%`) && c(e, "style", g);
    },
    i: E,
    o: E,
    d(y) {
      y && L(e), v = !1, fe(m);
    }
  };
}
function ui(l, e, t) {
  let { title: s = "Pulso Focus" } = e, { value: i = "78%" } = e, { hint: o = "Calma sostenida" } = e, { intensity: n = 10 } = e, a = 0, f = 0, h = 0;
  const u = (p) => {
    const g = p.currentTarget.getBoundingClientRect(), v = (p.clientX - g.left) / g.width - 0.5, m = (p.clientY - g.top) / g.height - 0.5;
    t(3, a = m * n * -1), t(4, f = v * n), t(5, h = (v + m + 1) * 25);
  }, b = () => {
    t(3, a = 0), t(4, f = 0), t(5, h = 0);
  };
  return l.$$set = (p) => {
    "title" in p && t(0, s = p.title), "value" in p && t(1, i = p.value), "hint" in p && t(2, o = p.hint), "intensity" in p && t(8, n = p.intensity);
  }, [s, i, o, a, f, h, u, b, n];
}
class rs extends re {
  constructor(e) {
    super(), ie(
      this,
      e,
      ui,
      di,
      F,
      {
        title: 0,
        value: 1,
        hint: 2,
        intensity: 8
      },
      fi
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
ne(rs, { title: {}, value: {}, hint: {}, intensity: {} }, [], [], !0);
function pi(l) {
  se(l, "svelte-1czrcz8", '.counter.svelte-1czrcz8{border-radius:16px;border:1px solid #e2e8f0;padding:16px;background:#ffffff;display:grid;gap:10px;box-shadow:0 12px 22px rgba(15, 23, 42, 0.08)}.label.svelte-1czrcz8{margin:0;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.08em}.value.svelte-1czrcz8{font-size:32px;font-weight:700;color:#0f172a;position:relative;animation:svelte-1czrcz8-flip 0.5s ease}.value.svelte-1czrcz8::after{content:"";position:absolute;left:0;right:0;bottom:-4px;height:3px;border-radius:999px;background:var(--tone);animation:svelte-1czrcz8-sweep 0.6s ease}@keyframes svelte-1czrcz8-flip{0%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:translateY(0)}}@keyframes svelte-1czrcz8-sweep{from{transform:scaleX(0.2)}to{transform:scaleX(1)}}');
}
function vl(l) {
  let e, t;
  return {
    c() {
      e = d("div"), t = k(
        /*value*/
        l[1]
      ), c(e, "class", "value svelte-1czrcz8");
    },
    m(s, i) {
      $(s, e, i), r(e, t);
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
function vi(l) {
  let e, t, s, i, o = (
    /*value*/
    l[1]
  ), n, a = vl(l);
  return {
    c() {
      e = d("div"), t = d("p"), s = k(
        /*label*/
        l[0]
      ), i = _(), a.c(), c(t, "class", "label svelte-1czrcz8"), c(e, "class", "counter svelte-1czrcz8"), c(e, "style", n = `--tone:${/*tone*/
      l[2]}`);
    },
    m(f, h) {
      $(f, e, h), r(e, t), r(t, s), r(e, i), a.m(e, null);
    },
    p(f, [h]) {
      h & /*label*/
      1 && M(
        s,
        /*label*/
        f[0]
      ), h & /*value*/
      2 && F(o, o = /*value*/
      f[1]) ? (a.d(1), a = vl(f), a.c(), a.m(e, null)) : a.p(f, h), h & /*tone*/
      4 && n !== (n = `--tone:${/*tone*/
      f[2]}`) && c(e, "style", n);
    },
    i: E,
    o: E,
    d(f) {
      f && L(e), a.d(f);
    }
  };
}
function gi(l, e, t) {
  let { label: s = "Sesiones" } = e, { value: i = 12 } = e, { tone: o = "#10b981" } = e;
  return l.$$set = (n) => {
    "label" in n && t(0, s = n.label), "value" in n && t(1, i = n.value), "tone" in n && t(2, o = n.tone);
  }, [s, i, o];
}
class as extends re {
  constructor(e) {
    super(), ie(this, e, gi, vi, F, { label: 0, value: 1, tone: 2 }, pi);
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
ne(as, { label: {}, value: {}, tone: {} }, [], [], !0);
function hi(l) {
  se(l, "svelte-pocpcm", ".stack.svelte-pocpcm{position:relative;height:160px;border-radius:18px;border:1px solid #e2e8f0;background:linear-gradient(140deg, #ffffff, #ecfdf5);overflow:hidden;transform:perspective(900px) rotateX(var(--rx)) rotateY(var(--ry));transition:transform 0.2s ease}.bg.svelte-pocpcm{position:absolute;inset:0;background:radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.15), transparent 60%)}.layer.svelte-pocpcm{position:absolute;border-radius:999px;filter:blur(calc(var(--blur) * 10px));opacity:0.75}.layer-a.svelte-pocpcm{width:120px;height:120px;background:rgba(16, 185, 129, 0.45);transform:translate(calc(var(--px) * 0.6), calc(var(--py) * 0.6));top:20px;left:14px}.layer-b.svelte-pocpcm{width:90px;height:90px;background:rgba(52, 211, 153, 0.5);transform:translate(calc(var(--px) * 1.2), calc(var(--py) * 1.2));bottom:18px;right:20px}.layer-c.svelte-pocpcm{width:70px;height:70px;background:rgba(14, 116, 144, 0.3);transform:translate(calc(var(--px) * 1.6), calc(var(--py) * 1.6));top:30px;right:70px}.label.svelte-pocpcm{position:absolute;left:16px;bottom:14px;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#0f172a;background:rgba(255, 255, 255, 0.7);padding:4px 8px;border-radius:999px}");
}
function bi(l) {
  let e, t, s, i, o, n, a, f, h, u, b, p, g, v;
  return {
    c() {
      e = d("div"), t = d("div"), s = _(), i = d("div"), o = _(), n = d("div"), a = _(), f = d("div"), h = _(), u = d("div"), b = k(
        /*title*/
        l[0]
      ), c(t, "class", "bg svelte-pocpcm"), c(i, "class", "layer layer-a svelte-pocpcm"), c(n, "class", "layer layer-b svelte-pocpcm"), c(f, "class", "layer layer-c svelte-pocpcm"), c(u, "class", "label svelte-pocpcm"), c(e, "class", "stack svelte-pocpcm"), c(e, "style", p = `--rx:${/*rx*/
      l[2]}deg; --ry:${/*ry*/
      l[3]}deg; --px:${/*px*/
      l[4]}px; --py:${/*py*/
      l[5]}px; --blur:${/*blurAmount*/
      l[1]}`);
    },
    m(m, y) {
      $(m, e, y), r(e, t), r(e, s), r(e, i), r(e, o), r(e, n), r(e, a), r(e, f), r(e, h), r(e, u), r(u, b), g || (v = [
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
    p(m, [y]) {
      y & /*title*/
      1 && M(
        b,
        /*title*/
        m[0]
      ), y & /*rx, ry, px, py, blurAmount*/
      62 && p !== (p = `--rx:${/*rx*/
      m[2]}deg; --ry:${/*ry*/
      m[3]}deg; --px:${/*px*/
      m[4]}px; --py:${/*py*/
      m[5]}px; --blur:${/*blurAmount*/
      m[1]}`) && c(e, "style", p);
    },
    i: E,
    o: E,
    d(m) {
      m && L(e), g = !1, fe(v);
    }
  };
}
function mi(l, e, t) {
  let { title: s = "Capas activas" } = e, { intensity: i = 18 } = e, { blurAmount: o = 0.6 } = e, n = 0, a = 0, f = 0, h = 0;
  const u = (p) => {
    const g = p.currentTarget.getBoundingClientRect(), v = (p.clientX - g.left) / g.width - 0.5, m = (p.clientY - g.top) / g.height - 0.5;
    t(2, n = m * i * -1), t(3, a = v * i), t(4, f = v * 24), t(5, h = m * 24);
  }, b = () => {
    t(2, n = 0), t(3, a = 0), t(4, f = 0), t(5, h = 0);
  };
  return l.$$set = (p) => {
    "title" in p && t(0, s = p.title), "intensity" in p && t(8, i = p.intensity), "blurAmount" in p && t(1, o = p.blurAmount);
  }, [s, o, n, a, f, h, u, b, i];
}
class os extends re {
  constructor(e) {
    super(), ie(this, e, mi, bi, F, { title: 0, intensity: 8, blurAmount: 1 }, hi);
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
ne(os, { title: {}, intensity: {}, blurAmount: {} }, [], [], !0);
function yi(l) {
  se(l, "svelte-1yc0e5f", `:host{display:block;font-family:'Poppins', 'Manrope', 'Segoe UI', system-ui, sans-serif}.card-shell.svelte-1yc0e5f.svelte-1yc0e5f{position:relative;padding-bottom:18px}.card.svelte-1yc0e5f.svelte-1yc0e5f{position:relative;z-index:1;background:#ffffff;border-radius:16px;overflow:hidden;border:2px solid transparent;box-shadow:0 12px 24px rgba(15, 23, 42, 0.08);transition:transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;cursor:pointer}.card.svelte-1yc0e5f.svelte-1yc0e5f:hover{transform:translateY(-2px);box-shadow:0 18px 32px rgba(15, 23, 42, 0.12),
      0 0 0 2px color-mix(in srgb, var(--category-left) 55%, transparent),
      0 12px 24px color-mix(in srgb, var(--category-right) 35%, transparent)}.card.is-selected.svelte-1yc0e5f.svelte-1yc0e5f{border-color:#10b981;transform:scale(0.99)}.card.is-disabled.svelte-1yc0e5f.svelte-1yc0e5f{opacity:0.5;cursor:not-allowed;pointer-events:none}.thumb.svelte-1yc0e5f.svelte-1yc0e5f{position:relative;background:#f1f5f9;aspect-ratio:16 / 9;overflow:hidden}.thumb.svelte-1yc0e5f img.svelte-1yc0e5f{width:100%;height:100%;object-fit:cover;display:block}.thumb-placeholder.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;inset:0;display:grid;place-items:center;font-size:28px;color:#94a3b8}.thumb-overlay.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;inset:0;background:linear-gradient(180deg, rgba(15, 23, 42, 0) 50%, rgba(15, 23, 42, 0.55) 100%);opacity:0;transition:opacity 0.2s ease}.card.svelte-1yc0e5f:hover .thumb-overlay.svelte-1yc0e5f{opacity:1}.pill-row.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;top:8px;left:8px;display:flex;gap:6px}.pill.svelte-1yc0e5f.svelte-1yc0e5f{padding:4px 8px;border-radius:999px;background:rgba(15, 23, 42, 0.6);color:#ffffff;font-size:11px;font-weight:600}.pill.badge.svelte-1yc0e5f.svelte-1yc0e5f{background:rgba(15, 23, 42, 0.75);text-transform:uppercase;letter-spacing:0.5px}.favorite.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;top:8px;right:8px;border:none;background:rgba(15, 23, 42, 0.35);color:#ffffff;width:30px;height:30px;border-radius:999px;display:grid;place-items:center;cursor:pointer;transition:background 0.2s ease, transform 0.2s ease, color 0.2s ease}.favorite.svelte-1yc0e5f svg.svelte-1yc0e5f{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.6}.favorite.active.svelte-1yc0e5f.svelte-1yc0e5f{background:rgba(255, 255, 255, 0.9);color:#ef4444}.favorite.active.svelte-1yc0e5f svg.svelte-1yc0e5f{fill:currentColor;stroke:none}.favorite.svelte-1yc0e5f.svelte-1yc0e5f:hover{transform:scale(1.05)}.check.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;bottom:8px;left:8px;width:26px;height:26px;border-radius:999px;background:rgba(255, 255, 255, 0.9);border:1px solid #e2e8f0;display:grid;place-items:center;transition:background 0.2s ease, border-color 0.2s ease}.check.svelte-1yc0e5f svg.svelte-1yc0e5f{width:16px;height:16px;fill:#ffffff;opacity:0;transform:scale(0.7);transition:opacity 0.2s ease, transform 0.2s ease}.card.is-selected.svelte-1yc0e5f .check.svelte-1yc0e5f{background:#10b981;border-color:#059669}.card.is-selected.svelte-1yc0e5f .check svg.svelte-1yc0e5f{opacity:1;transform:scale(1)}.body.svelte-1yc0e5f.svelte-1yc0e5f{padding:16px;display:grid;gap:8px}.body.svelte-1yc0e5f h3.svelte-1yc0e5f{margin:0;font-size:15px;font-weight:700;color:#0f172a}.body.svelte-1yc0e5f p.svelte-1yc0e5f{margin:0;font-size:13px;color:#64748b;min-height:34px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.cta.svelte-1yc0e5f.svelte-1yc0e5f{padding:8px 10px;border-radius:10px;text-align:center;font-size:12px;font-weight:600;color:#64748b;background:#f1f5f9;transition:background 0.2s ease, color 0.2s ease}.card.svelte-1yc0e5f:hover .cta.svelte-1yc0e5f{background:#e2e8f0}.cta-selected.svelte-1yc0e5f.svelte-1yc0e5f{background:#d1fae5;color:#047857}.category-lift.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;left:16px;right:16px;bottom:-12px;display:flex;justify-content:center;gap:8px;z-index:0;pointer-events:none;transform:translateY(14px);opacity:0;transition:transform 0.25s ease, opacity 0.2s ease}.category-chip.svelte-1yc0e5f.svelte-1yc0e5f{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:0.4px;color:#ffffff;text-transform:uppercase;background:var(--chip-color);box-shadow:0 10px 20px color-mix(in srgb, var(--chip-color) 35%, transparent)}.card-shell.svelte-1yc0e5f:hover .category-lift.svelte-1yc0e5f,.card-shell.svelte-1yc0e5f:focus-within .category-lift.svelte-1yc0e5f{opacity:1;transform:translateY(0)}`);
}
function xi(l) {
  let e;
  return {
    c() {
      e = d("div"), e.textContent = "▶", c(e, "class", "thumb-placeholder svelte-1yc0e5f");
    },
    m(t, s) {
      $(t, e, s);
    },
    p: E,
    d(t) {
      t && L(e);
    }
  };
}
function _i(l) {
  let e, t, s;
  return {
    c() {
      e = d("img"), Ke(e.src, t = /*thumbnail*/
      l[3]) || c(e, "src", t), c(e, "alt", s = `Miniatura de ${/*title*/
      l[0]}`), c(e, "loading", "lazy"), c(e, "class", "svelte-1yc0e5f");
    },
    m(i, o) {
      $(i, e, o);
    },
    p(i, o) {
      o & /*thumbnail*/
      8 && !Ke(e.src, t = /*thumbnail*/
      i[3]) && c(e, "src", t), o & /*title*/
      1 && s !== (s = `Miniatura de ${/*title*/
      i[0]}`) && c(e, "alt", s);
    },
    d(i) {
      i && L(e);
    }
  };
}
function gl(l) {
  let e, t;
  return {
    c() {
      e = d("div"), t = k(
        /*badge*/
        l[6]
      ), c(e, "class", "pill badge svelte-1yc0e5f");
    },
    m(s, i) {
      $(s, e, i), r(e, t);
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
function hl(l) {
  let e, t, s, i, o, n = (
    /*categoryRight*/
    l[9] && bl(l)
  );
  return {
    c() {
      e = d("div"), t = d("span"), s = k(
        /*categoryLeft*/
        l[8]
      ), o = _(), n && n.c(), c(t, "class", "category-chip svelte-1yc0e5f"), c(t, "style", i = `--chip-color: ${/*categoryLeftColor*/
      l[10]};`), c(e, "class", "category-lift svelte-1yc0e5f"), c(e, "aria-hidden", "true");
    },
    m(a, f) {
      $(a, e, f), r(e, t), r(t, s), r(e, o), n && n.m(e, null);
    },
    p(a, f) {
      f & /*categoryLeft*/
      256 && M(
        s,
        /*categoryLeft*/
        a[8]
      ), f & /*categoryLeftColor*/
      1024 && i !== (i = `--chip-color: ${/*categoryLeftColor*/
      a[10]};`) && c(t, "style", i), /*categoryRight*/
      a[9] ? n ? n.p(a, f) : (n = bl(a), n.c(), n.m(e, null)) : n && (n.d(1), n = null);
    },
    d(a) {
      a && L(e), n && n.d();
    }
  };
}
function bl(l) {
  let e, t, s;
  return {
    c() {
      e = d("span"), t = k(
        /*categoryRight*/
        l[9]
      ), c(e, "class", "category-chip svelte-1yc0e5f"), c(e, "style", s = `--chip-color: ${/*categoryRightColor*/
      l[11]};`);
    },
    m(i, o) {
      $(i, e, o), r(e, t);
    },
    p(i, o) {
      o & /*categoryRight*/
      512 && M(
        t,
        /*categoryRight*/
        i[9]
      ), o & /*categoryRightColor*/
      2048 && s !== (s = `--chip-color: ${/*categoryRightColor*/
      i[11]};`) && c(e, "style", s);
    },
    d(i) {
      i && L(e);
    }
  };
}
function wi(l) {
  let e, t, s, i, o, n, a, f, h, u, b, p, g, v, m, y, x, j, w, S, T, q, C, D, Y, I, J, H = (
    /*selected*/
    l[4] ? "Seleccionado" : "Seleccionar video"
  ), pe, ve, oe, G, ce, ee, W, O;
  function R(P, B) {
    return (
      /*thumbnail*/
      P[3] ? _i : xi
    );
  }
  let ge = R(l), te = ge(l), K = (
    /*badge*/
    l[6] && gl(l)
  ), V = (
    /*categoryLeft*/
    l[8] && hl(l)
  );
  return {
    c() {
      e = d("div"), t = d("div"), s = d("div"), te.c(), i = _(), o = d("div"), n = _(), a = d("div"), f = d("div"), h = k(
        /*duration*/
        l[2]
      ), u = _(), K && K.c(), b = _(), p = d("button"), g = ll("svg"), v = ll("path"), x = _(), j = d("div"), j.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" class="svelte-1yc0e5f"><path d="M9.2 16.2L5.7 12.7l1.4-1.4 2.1 2.1 7.7-7.7 1.4 1.4z"></path></svg>', w = _(), S = d("div"), T = d("h3"), q = k(
        /*title*/
        l[0]
      ), C = _(), D = d("p"), Y = k(
        /*description*/
        l[1]
      ), I = _(), J = d("div"), pe = k(H), ce = _(), V && V.c(), c(o, "class", "thumb-overlay svelte-1yc0e5f"), c(f, "class", "pill svelte-1yc0e5f"), c(a, "class", "pill-row svelte-1yc0e5f"), c(v, "d", "M12.1 21.2c-0.1 0-0.3 0-0.4-0.1C6.1 18.6 2 15 2 10.4 2 7.6 4.3 5.3 7.1 5.3c1.7 0 3.3 0.8 4.3 2.1 1-1.3 2.6-2.1 4.3-2.1 2.8 0 5.1 2.3 5.1 5.1 0 4.6-4.1 8.2-9.7 10.7-0.1 0-0.2 0.1-0.3 0.1z"), c(g, "viewBox", "0 0 24 24"), c(g, "aria-hidden", "true"), c(g, "class", "svelte-1yc0e5f"), c(p, "class", m = "favorite " + /*favorite*/
      (l[7] ? "active" : "") + " svelte-1yc0e5f"), c(p, "aria-label", y = /*favorite*/
      l[7] ? "Quitar de favoritos" : "Anadir a favoritos"), c(j, "class", "check svelte-1yc0e5f"), c(s, "class", "thumb svelte-1yc0e5f"), c(T, "class", "svelte-1yc0e5f"), c(D, "class", "svelte-1yc0e5f"), c(J, "class", ve = "cta " + /*selected*/
      (l[4] ? "cta-selected" : "") + " svelte-1yc0e5f"), c(S, "class", "body svelte-1yc0e5f"), c(t, "class", oe = "card " + /*selected*/
      (l[4] ? "is-selected" : "") + " " + /*disabled*/
      (l[5] ? "is-disabled" : "") + " svelte-1yc0e5f"), c(t, "role", "button"), c(
        t,
        "aria-disabled",
        /*disabled*/
        l[5]
      ), c(t, "tabindex", G = /*disabled*/
      l[5] ? -1 : 0), c(e, "class", "card-shell svelte-1yc0e5f"), c(e, "style", ee = `--category-left: ${/*categoryLeftColor*/
      l[10]}; --category-right: ${/*categoryRightColor*/
      l[11]};`);
    },
    m(P, B) {
      $(P, e, B), r(e, t), r(t, s), te.m(s, null), r(s, i), r(s, o), r(s, n), r(s, a), r(a, f), r(f, h), r(a, u), K && K.m(a, null), r(s, b), r(s, p), r(p, g), r(g, v), r(s, x), r(s, j), r(t, w), r(t, S), r(S, T), r(T, q), r(S, C), r(S, D), r(D, Y), r(S, I), r(S, J), r(J, pe), r(e, ce), V && V.m(e, null), W || (O = [
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
      ], W = !0);
    },
    p(P, [B]) {
      ge === (ge = R(P)) && te ? te.p(P, B) : (te.d(1), te = ge(P), te && (te.c(), te.m(s, i))), B & /*duration*/
      4 && M(
        h,
        /*duration*/
        P[2]
      ), /*badge*/
      P[6] ? K ? K.p(P, B) : (K = gl(P), K.c(), K.m(a, null)) : K && (K.d(1), K = null), B & /*favorite*/
      128 && m !== (m = "favorite " + /*favorite*/
      (P[7] ? "active" : "") + " svelte-1yc0e5f") && c(p, "class", m), B & /*favorite*/
      128 && y !== (y = /*favorite*/
      P[7] ? "Quitar de favoritos" : "Anadir a favoritos") && c(p, "aria-label", y), B & /*title*/
      1 && M(
        q,
        /*title*/
        P[0]
      ), B & /*description*/
      2 && M(
        Y,
        /*description*/
        P[1]
      ), B & /*selected*/
      16 && H !== (H = /*selected*/
      P[4] ? "Seleccionado" : "Seleccionar video") && M(pe, H), B & /*selected*/
      16 && ve !== (ve = "cta " + /*selected*/
      (P[4] ? "cta-selected" : "") + " svelte-1yc0e5f") && c(J, "class", ve), B & /*selected, disabled*/
      48 && oe !== (oe = "card " + /*selected*/
      (P[4] ? "is-selected" : "") + " " + /*disabled*/
      (P[5] ? "is-disabled" : "") + " svelte-1yc0e5f") && c(t, "class", oe), B & /*disabled*/
      32 && c(
        t,
        "aria-disabled",
        /*disabled*/
        P[5]
      ), B & /*disabled*/
      32 && G !== (G = /*disabled*/
      P[5] ? -1 : 0) && c(t, "tabindex", G), /*categoryLeft*/
      P[8] ? V ? V.p(P, B) : (V = hl(P), V.c(), V.m(e, null)) : V && (V.d(1), V = null), B & /*categoryLeftColor, categoryRightColor*/
      3072 && ee !== (ee = `--category-left: ${/*categoryLeftColor*/
      P[10]}; --category-right: ${/*categoryRightColor*/
      P[11]};`) && c(e, "style", ee);
    },
    i: E,
    o: E,
    d(P) {
      P && L(e), te.d(), K && K.d(), V && V.d(), W = !1, fe(O);
    }
  };
}
function ki(l, e, t) {
  let { videoId: s = "" } = e, { hashedId: i = "" } = e, { title: o = "" } = e, { description: n = "" } = e, { duration: a = "" } = e, { thumbnail: f = "" } = e, { selected: h = !1 } = e, { disabled: u = !1 } = e, { badge: b = "" } = e, { tags: p = [] } = e, { favorite: g = !1 } = e, { categoryLeft: v = "" } = e, { categoryRight: m = "" } = e, { categoryLeftColor: y = "#94a3b8" } = e, { categoryRightColor: x = "#94a3b8" } = e;
  const j = qe(), w = () => {
    u || j("select", { id: s });
  }, S = (q) => {
    q.stopPropagation(), !u && j("favorite", { hashedId: i });
  }, T = (q) => {
    u || (q.key === "Enter" || q.key === " ") && (q.preventDefault(), w());
  };
  return l.$$set = (q) => {
    "videoId" in q && t(15, s = q.videoId), "hashedId" in q && t(16, i = q.hashedId), "title" in q && t(0, o = q.title), "description" in q && t(1, n = q.description), "duration" in q && t(2, a = q.duration), "thumbnail" in q && t(3, f = q.thumbnail), "selected" in q && t(4, h = q.selected), "disabled" in q && t(5, u = q.disabled), "badge" in q && t(6, b = q.badge), "tags" in q && t(17, p = q.tags), "favorite" in q && t(7, g = q.favorite), "categoryLeft" in q && t(8, v = q.categoryLeft), "categoryRight" in q && t(9, m = q.categoryRight), "categoryLeftColor" in q && t(10, y = q.categoryLeftColor), "categoryRightColor" in q && t(11, x = q.categoryRightColor);
  }, [
    o,
    n,
    a,
    f,
    h,
    u,
    b,
    g,
    v,
    m,
    y,
    x,
    w,
    S,
    T,
    s,
    i,
    p
  ];
}
class cs extends re {
  constructor(e) {
    super(), ie(
      this,
      e,
      ki,
      wi,
      F,
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
      yi
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
customElements.define("svelte-video-card", ne(cs, { videoId: {}, hashedId: {}, title: {}, description: {}, duration: {}, thumbnail: {}, selected: { type: "Boolean" }, disabled: { type: "Boolean" }, badge: {}, tags: {}, favorite: { type: "Boolean" }, categoryLeft: {}, categoryRight: {}, categoryLeftColor: {}, categoryRightColor: {} }, [], [], !0));
function zi(l) {
  const e = l - 1;
  return e * e * e + 1;
}
function ml(l, { delay: e = 0, duration: t = 400, easing: s = Il } = {}) {
  const i = +getComputedStyle(l).opacity;
  return {
    delay: e,
    duration: t,
    easing: s,
    css: (o) => `opacity: ${o * i}`
  };
}
function Fe(l, { delay: e = 0, duration: t = 400, easing: s = zi, x: i = 0, y: o = 0, opacity: n = 0 } = {}) {
  const a = getComputedStyle(l), f = +a.opacity, h = a.transform === "none" ? "" : a.transform, u = f * (1 - n), [b, p] = tl(i), [g, v] = tl(o);
  return {
    delay: e,
    duration: t,
    easing: s,
    css: (m, y) => `
			transform: ${h} translate(${(1 - m) * b}${p}, ${(1 - m) * g}${v});
			opacity: ${f - u * y}`
  };
}
function qi(l) {
  se(l, "svelte-1hb2737", `.overlay.svelte-1hb2737{position:fixed;inset:0;z-index:70;display:flex;align-items:center;justify-content:center;padding:24px;background:radial-gradient(circle at top, rgba(58, 132, 117, 0.2), rgba(0, 0, 0, 0.6));backdrop-filter:blur(6px)}.card.svelte-1hb2737{position:relative;width:min(520px, 92vw);padding:28px 26px 24px;border-radius:24px;background:linear-gradient(135deg, #ffffff 0%, #f4f6f0 100%);box-shadow:0 18px 40px rgba(0, 0, 0, 0.22),
      0 4px 18px rgba(50, 120, 102, 0.18);overflow:hidden}.card.svelte-1hb2737::before{content:"";position:absolute;inset:-1px;border-radius:24px;padding:1px;background:linear-gradient(130deg, rgba(43, 173, 145, 0.5), rgba(255, 255, 255, 0));-webkit-mask:linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none}.badge.svelte-1hb2737{display:inline-flex;align-items:center;padding:6px 12px;border-radius:999px;background:rgba(46, 140, 120, 0.12);color:#1f5f52;font-size:12px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase}h2.svelte-1hb2737{margin:14px 0 8px;font-size:22px;font-weight:700;color:#1f2a26}p.svelte-1hb2737{margin:0;font-size:14px;line-height:1.5;color:#4b5b56}.actions.svelte-1hb2737{margin-top:18px;display:flex;justify-content:flex-end}button.svelte-1hb2737{border:none;border-radius:12px;padding:10px 18px;font-size:14px;font-weight:600;color:#fff;background:linear-gradient(135deg, #2e8c78, #1f6d5e);box-shadow:0 10px 18px rgba(46, 140, 120, 0.28);cursor:pointer}button.svelte-1hb2737:hover{filter:brightness(1.05)}button.svelte-1hb2737:active{transform:translateY(1px)}@media(max-width: 480px){.card.svelte-1hb2737{padding:22px 20px}h2.svelte-1hb2737{font-size:20px}}`);
}
function yl(l) {
  let e, t, s, i, o, n, a, f, h, u, b, p, g, v, m, y, x, j;
  return {
    c() {
      e = d("div"), t = d("div"), s = d("div"), s.textContent = "Fin de temporada", i = _(), o = d("h2"), n = k(
        /*title*/
        l[1]
      ), a = _(), f = d("p"), h = k(
        /*message*/
        l[2]
      ), u = _(), b = d("div"), p = d("button"), g = k(
        /*cta*/
        l[3]
      ), c(s, "class", "badge svelte-1hb2737"), c(o, "class", "svelte-1hb2737"), c(f, "class", "svelte-1hb2737"), c(p, "type", "button"), c(p, "class", "svelte-1hb2737"), c(b, "class", "actions svelte-1hb2737"), c(t, "class", "card svelte-1hb2737"), c(e, "class", "overlay svelte-1hb2737"), c(e, "role", "button"), c(e, "tabindex", "0"), c(e, "aria-label", "Cerrar aviso de temporada");
    },
    m(w, S) {
      $(w, e, S), r(e, t), r(t, s), r(t, i), r(t, o), r(o, n), r(t, a), r(t, f), r(f, h), r(t, u), r(t, b), r(b, p), r(p, g), y = !0, x || (j = [
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
      ], x = !0);
    },
    p(w, S) {
      (!y || S & /*title*/
      2) && M(
        n,
        /*title*/
        w[1]
      ), (!y || S & /*message*/
      4) && M(
        h,
        /*message*/
        w[2]
      ), (!y || S & /*cta*/
      8) && M(
        g,
        /*cta*/
        w[3]
      );
    },
    i(w) {
      y || (w && ze(() => {
        y && (v || (v = ke(t, Fe, { y: 18, duration: 240 }, !0)), v.run(1));
      }), w && ze(() => {
        y && (m || (m = ke(e, ml, { duration: 180 }, !0)), m.run(1));
      }), y = !0);
    },
    o(w) {
      w && (v || (v = ke(t, Fe, { y: 18, duration: 240 }, !1)), v.run(0)), w && (m || (m = ke(e, ml, { duration: 180 }, !1)), m.run(0)), y = !1;
    },
    d(w) {
      w && L(e), w && v && v.end(), w && m && m.end(), x = !1, fe(j);
    }
  };
}
function ji(l) {
  let e, t = (
    /*open*/
    l[0] && yl(l)
  );
  return {
    c() {
      t && t.c(), e = Ae();
    },
    m(s, i) {
      t && t.m(s, i), $(s, e, i);
    },
    p(s, [i]) {
      /*open*/
      s[0] ? t ? (t.p(s, i), i & /*open*/
      1 && Be(t, 1)) : (t = yl(s), t.c(), Be(t, 1), t.m(e.parentNode, e)) : t && (Jl(), $t(t, 1, 1, () => {
        t = null;
      }), Ql());
    },
    i(s) {
      Be(t);
    },
    o(s) {
      $t(t);
    },
    d(s) {
      s && L(e), t && t.d(s);
    }
  };
}
function Ci(l, e, t) {
  let { open: s = !1 } = e, { title: i = "Temporada finalizada" } = e, { message: o = "La temporada actual ha terminado. Tus logros de temporada se reiniciaran para un nuevo ciclo." } = e, { cta: n = "Entendido" } = e;
  const a = qe(), f = () => {
    t(0, s = !1), a("dismiss");
  }, h = (b) => {
    b.target === b.currentTarget && f();
  }, u = (b) => {
    const p = b.key;
    (p === "Escape" || p === "Enter" || p === " ") && f();
  };
  return l.$$set = (b) => {
    "open" in b && t(0, s = b.open), "title" in b && t(1, i = b.title), "message" in b && t(2, o = b.message), "cta" in b && t(3, n = b.cta);
  }, [s, i, o, n, f, h, u];
}
class fs extends re {
  constructor(e) {
    super(), ie(this, e, Ci, ji, F, { open: 0, title: 1, message: 2, cta: 3 }, qi);
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
customElements.define("svelte-season-popup", ne(fs, { open: { type: "Boolean" }, title: {}, message: {}, cta: {} }, [], [], !0));
function Si(l) {
  se(l, "svelte-1f864m7", ':host{display:inline-block}.token.svelte-1f864m7{position:relative;height:40px;width:64px;border-radius:8px;border:1px solid #e5e7eb;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;line-height:1.1;font-family:inherit;overflow:visible;margin:0 4px}.time.svelte-1f864m7{font-weight:600;font-size:14px;color:inherit}.points.svelte-1f864m7{font-size:10px;opacity:0.8;margin-top:-2px}.points.expired.svelte-1f864m7{text-decoration:line-through}.completed.svelte-1f864m7{background:#8acc9f;color:#ffffff;border-color:#10b981}.open.svelte-1f864m7{background:#ecfdf5;color:#047857;border-color:#6ee7b7;box-shadow:0 4px 10px rgba(16, 185, 129, 0.12);transform:scale(1.2);transition:transform 0.2s ease;transform-origin:center;margin:0 10px}.open.svelte-1f864m7::before,.open.svelte-1f864m7::after,.open.svelte-1f864m7::backdrop{content:"";position:absolute;inset:-10px;border-radius:12px;border:1px solid rgba(16, 185, 129, 0.35);background:radial-gradient(circle, rgba(16, 185, 129, 0.35), rgba(16, 185, 129, 0));opacity:0;animation:svelte-1f864m7-pulse 1.35s ease-out infinite;pointer-events:none}.open.svelte-1f864m7::after{animation-delay:0.45s}.open.svelte-1f864m7::backdrop{animation-delay:0.9s}.expired.svelte-1f864m7{background:#fee2e2;color:#ef4444;border-color:#fca5a5}.upcoming.svelte-1f864m7{background:#f3f4f6;color:#6b7280;border-color:#e5e7eb}@media(min-width: 640px){.token.svelte-1f864m7{height:48px;width:80px;border-radius:10px}.time.svelte-1f864m7{font-size:15px}}@keyframes svelte-1f864m7-pulse{0%{transform:scale(0.85);opacity:0}20%{opacity:0.55}100%{transform:scale(1.4);opacity:0}}');
}
function Li(l) {
  let e, t = `+${/*points*/
  l[2]} ${/*unit*/
  l[3]}`, s;
  return {
    c() {
      e = d("div"), s = k(t), c(e, "class", "time svelte-1f864m7");
    },
    m(i, o) {
      $(i, e, o), r(e, s);
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
function $i(l) {
  let e, t, s, i, o, n, a, f, h;
  return {
    c() {
      e = d("div"), t = k(
        /*timeLabel*/
        l[1]
      ), s = _(), i = d("div"), o = k("+"), n = k(
        /*points*/
        l[2]
      ), a = _(), f = k(
        /*unit*/
        l[3]
      ), c(e, "class", "time svelte-1f864m7"), c(i, "class", h = "points " + /*status*/
      (l[0] === "expired" ? "expired" : "") + " svelte-1f864m7");
    },
    m(u, b) {
      $(u, e, b), r(e, t), $(u, s, b), $(u, i, b), r(i, o), r(i, n), r(i, a), r(i, f);
    },
    p(u, b) {
      b & /*timeLabel*/
      2 && M(
        t,
        /*timeLabel*/
        u[1]
      ), b & /*points*/
      4 && M(
        n,
        /*points*/
        u[2]
      ), b & /*unit*/
      8 && M(
        f,
        /*unit*/
        u[3]
      ), b & /*status*/
      1 && h !== (h = "points " + /*status*/
      (u[0] === "expired" ? "expired" : "") + " svelte-1f864m7") && c(i, "class", h);
    },
    d(u) {
      u && (L(e), L(s), L(i));
    }
  };
}
function Ti(l) {
  let e, t;
  function s(n, a) {
    return (
      /*timeLabel*/
      n[1] ? $i : Li
    );
  }
  let i = s(l), o = i(l);
  return {
    c() {
      e = d("div"), o.c(), c(e, "class", t = "token " + /*label*/
      l[4](
        /*status*/
        l[0]
      ) + " svelte-1f864m7");
    },
    m(n, a) {
      $(n, e, a), o.m(e, null);
    },
    p(n, [a]) {
      i === (i = s(n)) && o ? o.p(n, a) : (o.d(1), o = i(n), o && (o.c(), o.m(e, null))), a & /*status*/
      1 && t !== (t = "token " + /*label*/
      n[4](
        /*status*/
        n[0]
      ) + " svelte-1f864m7") && c(e, "class", t);
    },
    i: E,
    o: E,
    d(n) {
      n && L(e), o.d();
    }
  };
}
function Mi(l, e, t) {
  let { status: s = "upcoming" } = e, { timeLabel: i = "" } = e, { points: o = 20 } = e, { unit: n = "AP" } = e;
  const a = (f) => typeof f == "string" ? f : String(f ?? "");
  return l.$$set = (f) => {
    "status" in f && t(0, s = f.status), "timeLabel" in f && t(1, i = f.timeLabel), "points" in f && t(2, o = f.points), "unit" in f && t(3, n = f.unit);
  }, [s, i, o, n, a];
}
class ds extends re {
  constructor(e) {
    super(), ie(
      this,
      e,
      Mi,
      Ti,
      F,
      {
        status: 0,
        timeLabel: 1,
        points: 2,
        unit: 3
      },
      Si
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
customElements.define("svelte-quota-token", ne(ds, { status: {}, timeLabel: {}, points: {}, unit: {} }, [], [], !0));
function Ai(l) {
  se(l, "svelte-p2zlwf", ":host{display:block;font-family:inherit}.panel.svelte-p2zlwf.svelte-p2zlwf{display:grid;gap:18px;animation:svelte-p2zlwf-panel-rise 0.4s ease}.hero.svelte-p2zlwf.svelte-p2zlwf{position:relative;border-radius:22px;padding:18px 20px;background:linear-gradient(130deg, #f8fafc, #ecfdf5);border:1px solid #e2e8f0;display:grid;gap:14px;overflow:hidden}.hero-cards.svelte-p2zlwf.svelte-p2zlwf{display:grid;grid-template-columns:repeat(auto-fit, minmax(160px, 1fr));gap:10px}.hero-card.svelte-p2zlwf.svelte-p2zlwf{border-radius:16px;padding:10px 12px;background:rgba(255, 255, 255, 0.8);border:1px solid rgba(226, 232, 240, 0.9);display:grid;gap:4px}.hero-card.accent.svelte-p2zlwf.svelte-p2zlwf{background:linear-gradient(120deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.08));border-color:rgba(16, 185, 129, 0.4)}.orb.svelte-p2zlwf.svelte-p2zlwf{position:absolute;right:18px;top:-10px;width:120px;height:120px;border-radius:999px;background:radial-gradient(circle, rgba(16, 185, 129, 0.22), transparent 65%);animation:svelte-p2zlwf-float 6s ease-in-out infinite}.orb.small.svelte-p2zlwf.svelte-p2zlwf{right:120px;top:60px;width:72px;height:72px;animation-delay:1.4s;opacity:0.7}.eyebrow.svelte-p2zlwf.svelte-p2zlwf{text-transform:uppercase;font-size:11px;letter-spacing:0.12em;color:#94a3b8;margin:0 0 6px}h1.svelte-p2zlwf.svelte-p2zlwf{margin:0;font-size:22px;font-weight:700;color:#0f172a}.email.svelte-p2zlwf.svelte-p2zlwf{margin:4px 0 0;color:#64748b;font-size:13px}.grid.svelte-p2zlwf.svelte-p2zlwf{display:grid;gap:12px;grid-template-columns:repeat(auto-fit, minmax(160px, 1fr))}.grid.two.svelte-p2zlwf.svelte-p2zlwf{grid-template-columns:repeat(auto-fit, minmax(220px, 1fr))}.card.svelte-p2zlwf.svelte-p2zlwf{background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;padding:12px 14px;display:grid;gap:6px;position:relative;overflow:hidden}.card.svelte-p2zlwf span.svelte-p2zlwf{font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#94a3b8}.card.svelte-p2zlwf strong.svelte-p2zlwf{font-size:20px;color:#0f172a}.section.svelte-p2zlwf.svelte-p2zlwf{background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;padding:16px;position:relative}.xp.svelte-p2zlwf.svelte-p2zlwf{overflow:hidden}.xp-toggle.svelte-p2zlwf.svelte-p2zlwf{width:100%;border:none;background:transparent;display:flex;align-items:center;justify-content:space-between;gap:12px;cursor:pointer;padding:0;margin-bottom:10px}.xp-toggle.svelte-p2zlwf h2.svelte-p2zlwf{margin:0}.xp-toggle.svelte-p2zlwf span.svelte-p2zlwf{display:inline-flex;align-items:center;justify-content:center;height:28px;width:28px;border-radius:999px;background:#ecfdf5;color:#10b981;transition:transform 0.2s ease;font-weight:700}.xp-toggle.svelte-p2zlwf span.rotated.svelte-p2zlwf{transform:rotate(180deg)}.xp-controls.svelte-p2zlwf.svelte-p2zlwf{display:grid;grid-template-columns:repeat(auto-fit, minmax(140px, 1fr));gap:8px;margin-bottom:10px}.xp-controls.svelte-p2zlwf label.svelte-p2zlwf{display:grid;gap:4px;font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em}.xp-controls.svelte-p2zlwf input.svelte-p2zlwf{border:1px solid #e2e8f0;border-radius:10px;padding:6px 8px;font-size:12px;color:#0f172a;background:#fff}.xp-controls.svelte-p2zlwf .ghost.svelte-p2zlwf,.xp-controls.svelte-p2zlwf .apply.svelte-p2zlwf,.xp-footer.svelte-p2zlwf .apply.svelte-p2zlwf{border:none;border-radius:10px;padding:8px 10px;font-size:12px;font-weight:600;cursor:pointer}.xp-controls.svelte-p2zlwf .ghost.svelte-p2zlwf{background:#f1f5f9;color:#334155}.xp-controls.svelte-p2zlwf .apply.svelte-p2zlwf,.xp-footer.svelte-p2zlwf .apply.svelte-p2zlwf{background:#10b981;color:#fff}.xp-footer.svelte-p2zlwf.svelte-p2zlwf{display:flex;align-items:center;justify-content:space-between;margin-top:8px}.section.svelte-p2zlwf h2.svelte-p2zlwf{margin:0 0 10px;font-size:15px;font-weight:700;color:#0f172a}.row.svelte-p2zlwf.svelte-p2zlwf{display:flex;justify-content:space-between;align-items:center}.days.svelte-p2zlwf.svelte-p2zlwf{display:flex;flex-wrap:wrap;gap:8px}.days.svelte-p2zlwf span.svelte-p2zlwf{height:36px;width:36px;border-radius:999px;display:grid;place-items:center;font-size:12px;font-weight:700;background:#f1f5f9;color:#94a3b8}.days.svelte-p2zlwf span.active.svelte-p2zlwf{background:#10b981;color:#ffffff}.list.svelte-p2zlwf.svelte-p2zlwf{display:grid;gap:8px}.list-item.svelte-p2zlwf.svelte-p2zlwf{display:flex;justify-content:space-between;align-items:center;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:8px 12px;font-size:12px;color:#334155}.list-item.svelte-p2zlwf .timestamp.svelte-p2zlwf{display:block;font-size:11px;color:#94a3b8;margin-top:2px}.accent.svelte-p2zlwf.svelte-p2zlwf{color:#10b981;font-weight:700}.line.svelte-p2zlwf.svelte-p2zlwf{display:flex;justify-content:space-between;font-size:13px;color:#334155;padding:4px 0}.muted.svelte-p2zlwf.svelte-p2zlwf{color:#94a3b8;font-size:13px}ul.svelte-p2zlwf.svelte-p2zlwf{margin:0;padding-left:18px;color:#475569;display:grid;gap:6px;font-size:13px}@keyframes svelte-p2zlwf-panel-rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}@keyframes svelte-p2zlwf-float{0%,100%{transform:translateY(0)}50%{transform:translateY(12px)}}");
}
function xl(l, e, t) {
  const s = l.slice();
  return s[41] = e[t], s;
}
function _l(l, e, t) {
  const s = l.slice();
  return s[44] = e[t], s;
}
function wl(l, e, t) {
  const s = l.slice();
  return s[47] = e[t], s;
}
function kl(l, e, t) {
  const s = l.slice();
  return s[50] = e[t], s;
}
function zl(l, e, t) {
  const s = l.slice();
  return s[53] = e[t], s[55] = t, s;
}
function ql(l) {
  let e, t;
  return {
    c() {
      e = d("p"), t = k(
        /*email*/
        l[1]
      ), c(e, "class", "email svelte-p2zlwf");
    },
    m(s, i) {
      $(s, e, i), r(e, t);
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
function jl(l) {
  let e;
  return {
    c() {
      e = d("span"), e.textContent = `${/*label*/
      l[53]}`, c(e, "class", "svelte-p2zlwf"), pt(
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
      $(t, e, s);
    },
    p(t, s) {
      s[0] & /*activeDays*/
      8192 && pt(
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
function Cl(l) {
  let e, t, s, i, o, n, a, f, h, u, b, p, g, v, m, y, x, j;
  const w = [Ni, Ei], S = [];
  function T(q, C) {
    return (
      /*xpItems*/
      q[3].length === 0 ? 0 : 1
    );
  }
  return v = T(l), m = S[v] = w[v](l), {
    c() {
      e = d("div"), t = d("label"), s = k(`Desde
          `), i = d("input"), o = _(), n = d("label"), a = k(`Hasta
          `), f = d("input"), h = _(), u = d("button"), u.textContent = "Limpiar", b = _(), p = d("button"), p.textContent = "Aplicar", g = _(), m.c(), y = Ae(), c(i, "type", "date"), c(i, "class", "svelte-p2zlwf"), c(t, "class", "svelte-p2zlwf"), c(f, "type", "date"), c(f, "class", "svelte-p2zlwf"), c(n, "class", "svelte-p2zlwf"), c(u, "type", "button"), c(u, "class", "ghost svelte-p2zlwf"), c(p, "type", "button"), c(p, "class", "apply svelte-p2zlwf"), c(e, "class", "xp-controls svelte-p2zlwf");
    },
    m(q, C) {
      $(q, e, C), r(e, t), r(t, s), r(t, i), ft(
        i,
        /*filterFrom*/
        l[6]
      ), r(e, o), r(e, n), r(n, a), r(n, f), ft(
        f,
        /*filterTo*/
        l[7]
      ), r(e, h), r(e, u), r(e, b), r(e, p), $(q, g, C), S[v].m(q, C), $(q, y, C), x || (j = [
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
        X(u, "click", St(
          /*click_handler_1*/
          l[37]
        )),
        X(p, "click", St(
          /*click_handler_2*/
          l[38]
        ))
      ], x = !0);
    },
    p(q, C) {
      C[0] & /*filterFrom*/
      64 && ft(
        i,
        /*filterFrom*/
        q[6]
      ), C[0] & /*filterTo*/
      128 && ft(
        f,
        /*filterTo*/
        q[7]
      );
      let D = v;
      v = T(q), v === D ? S[v].p(q, C) : (Jl(), $t(S[D], 1, 1, () => {
        S[D] = null;
      }), Ql(), m = S[v], m ? m.p(q, C) : (m = S[v] = w[v](q), m.c()), Be(m, 1), m.m(y.parentNode, y));
    },
    d(q) {
      q && (L(e), L(g), L(y)), S[v].d(q), x = !1, fe(j);
    }
  };
}
function Ei(l) {
  let e, t, s, i, o, n, a, f, h, u, b, p = Z(
    /*xpItems*/
    l[3]
  ), g = [];
  for (let m = 0; m < p.length; m += 1)
    g[m] = Sl(kl(l, p, m));
  let v = (
    /*shownCount*/
    l[8] < /*totalCount*/
    l[2] && Ll(l)
  );
  return {
    c() {
      e = d("div");
      for (let m = 0; m < g.length; m += 1)
        g[m].c();
      s = _(), i = d("div"), o = d("span"), n = k("Mostrando "), a = k(
        /*shownCount*/
        l[8]
      ), f = k(" de "), h = k(
        /*totalCount*/
        l[2]
      ), u = _(), v && v.c(), c(e, "class", "list svelte-p2zlwf"), c(o, "class", "muted svelte-p2zlwf"), c(i, "class", "xp-footer svelte-p2zlwf");
    },
    m(m, y) {
      $(m, e, y);
      for (let x = 0; x < g.length; x += 1)
        g[x] && g[x].m(e, null);
      $(m, s, y), $(m, i, y), r(i, o), r(o, n), r(o, a), r(o, f), r(o, h), r(i, u), v && v.m(i, null), b = !0;
    },
    p(m, y) {
      if (y[0] & /*xpItems, formatTimestamp, getXpLabel*/
      393224) {
        p = Z(
          /*xpItems*/
          m[3]
        );
        let x;
        for (x = 0; x < p.length; x += 1) {
          const j = kl(m, p, x);
          g[x] ? g[x].p(j, y) : (g[x] = Sl(j), g[x].c(), g[x].m(e, null));
        }
        for (; x < g.length; x += 1)
          g[x].d(1);
        g.length = p.length;
      }
      (!b || y[0] & /*shownCount*/
      256) && M(
        a,
        /*shownCount*/
        m[8]
      ), (!b || y[0] & /*totalCount*/
      4) && M(
        h,
        /*totalCount*/
        m[2]
      ), /*shownCount*/
      m[8] < /*totalCount*/
      m[2] ? v ? v.p(m, y) : (v = Ll(m), v.c(), v.m(i, null)) : v && (v.d(1), v = null);
    },
    i(m) {
      b || (m && ze(() => {
        b && (t || (t = ke(e, Fe, { y: 6, duration: 180 }, !0)), t.run(1));
      }), b = !0);
    },
    o(m) {
      m && (t || (t = ke(e, Fe, { y: 6, duration: 180 }, !1)), t.run(0)), b = !1;
    },
    d(m) {
      m && (L(e), L(s), L(i)), We(g, m), m && t && t.end(), v && v.d();
    }
  };
}
function Ni(l) {
  let e, t, s;
  return {
    c() {
      e = d("p"), e.textContent = "Sin movimientos recientes.", c(e, "class", "muted svelte-p2zlwf");
    },
    m(i, o) {
      $(i, e, o), s = !0;
    },
    p: E,
    i(i) {
      s || (i && ze(() => {
        s && (t || (t = ke(e, Fe, { y: 6, duration: 180 }, !0)), t.run(1));
      }), s = !0);
    },
    o(i) {
      i && (t || (t = ke(e, Fe, { y: 6, duration: 180 }, !1)), t.run(0)), s = !1;
    },
    d(i) {
      i && L(e), i && t && t.end();
    }
  };
}
function Sl(l) {
  var x, j;
  let e, t, s, i = (
    /*getXpLabel*/
    l[17](
      /*entry*/
      l[50]
    ) + ""
  ), o, n, a, f = (
    /*formatTimestamp*/
    l[18](
      /*entry*/
      (x = l[50]) == null ? void 0 : x.created_at
    ) + ""
  ), h, u, b, p, g = (
    /*entry*/
    (((j = l[50]) == null ? void 0 : j.points) ?? 0) + ""
  ), v, m, y;
  return {
    c() {
      e = d("div"), t = d("div"), s = d("span"), o = k(i), n = _(), a = d("span"), h = k(f), u = _(), b = d("span"), p = k("+"), v = k(g), m = k(" PA"), y = _(), c(a, "class", "timestamp svelte-p2zlwf"), c(b, "class", "accent svelte-p2zlwf"), c(e, "class", "list-item svelte-p2zlwf");
    },
    m(w, S) {
      $(w, e, S), r(e, t), r(t, s), r(s, o), r(t, n), r(t, a), r(a, h), r(e, u), r(e, b), r(b, p), r(b, v), r(b, m), r(e, y);
    },
    p(w, S) {
      var T, q;
      S[0] & /*xpItems*/
      8 && i !== (i = /*getXpLabel*/
      w[17](
        /*entry*/
        w[50]
      ) + "") && M(o, i), S[0] & /*xpItems*/
      8 && f !== (f = /*formatTimestamp*/
      w[18](
        /*entry*/
        (T = w[50]) == null ? void 0 : T.created_at
      ) + "") && M(h, f), S[0] & /*xpItems*/
      8 && g !== (g = /*entry*/
      (((q = w[50]) == null ? void 0 : q.points) ?? 0) + "") && M(v, g);
    },
    d(w) {
      w && L(e);
    }
  };
}
function Ll(l) {
  let e, t, s;
  return {
    c() {
      e = d("button"), e.textContent = "Ver más", c(e, "type", "button"), c(e, "class", "apply svelte-p2zlwf");
    },
    m(i, o) {
      $(i, e, o), t || (s = X(e, "click", St(
        /*click_handler_3*/
        l[39]
      )), t = !0);
    },
    p: E,
    d(i) {
      i && L(e), t = !1, s();
    }
  };
}
function Di(l) {
  let e, t = Z(
    /*categories*/
    l[12].slice(0, 8)
  ), s = [];
  for (let i = 0; i < t.length; i += 1)
    s[i] = $l(wl(l, t, i));
  return {
    c() {
      for (let i = 0; i < s.length; i += 1)
        s[i].c();
      e = Ae();
    },
    m(i, o) {
      for (let n = 0; n < s.length; n += 1)
        s[n] && s[n].m(i, o);
      $(i, e, o);
    },
    p(i, o) {
      if (o[0] & /*categories*/
      4096) {
        t = Z(
          /*categories*/
          i[12].slice(0, 8)
        );
        let n;
        for (n = 0; n < t.length; n += 1) {
          const a = wl(i, t, n);
          s[n] ? s[n].p(a, o) : (s[n] = $l(a), s[n].c(), s[n].m(e.parentNode, e));
        }
        for (; n < s.length; n += 1)
          s[n].d(1);
        s.length = t.length;
      }
    },
    d(i) {
      i && L(e), We(s, i);
    }
  };
}
function Yi(l) {
  let e;
  return {
    c() {
      e = d("p"), e.textContent = "Sin actividad registrada.", c(e, "class", "muted svelte-p2zlwf");
    },
    m(t, s) {
      $(t, e, s);
    },
    p: E,
    d(t) {
      t && L(e);
    }
  };
}
function $l(l) {
  let e, t, s = (
    /*cat*/
    l[47].category + ""
  ), i, o, n, a = (
    /*cat*/
    l[47].total_sessions + ""
  ), f, h;
  return {
    c() {
      e = d("div"), t = d("span"), i = k(s), o = _(), n = d("strong"), f = k(a), h = _(), c(t, "class", "svelte-p2zlwf"), c(n, "class", "svelte-p2zlwf"), c(e, "class", "line svelte-p2zlwf");
    },
    m(u, b) {
      $(u, e, b), r(e, t), r(t, i), r(e, o), r(e, n), r(n, f), r(e, h);
    },
    p(u, b) {
      b[0] & /*categories*/
      4096 && s !== (s = /*cat*/
      u[47].category + "") && M(i, s), b[0] & /*categories*/
      4096 && a !== (a = /*cat*/
      u[47].total_sessions + "") && M(f, a);
    },
    d(u) {
      u && L(e);
    }
  };
}
function Pi(l) {
  let e, t = Z(
    /*favorites*/
    l[11].slice(0, 8)
  ), s = [];
  for (let i = 0; i < t.length; i += 1)
    s[i] = Tl(_l(l, t, i));
  return {
    c() {
      for (let i = 0; i < s.length; i += 1)
        s[i].c();
      e = Ae();
    },
    m(i, o) {
      for (let n = 0; n < s.length; n += 1)
        s[n] && s[n].m(i, o);
      $(i, e, o);
    },
    p(i, o) {
      if (o[0] & /*favorites*/
      2048) {
        t = Z(
          /*favorites*/
          i[11].slice(0, 8)
        );
        let n;
        for (n = 0; n < t.length; n += 1) {
          const a = _l(i, t, n);
          s[n] ? s[n].p(a, o) : (s[n] = Tl(a), s[n].c(), s[n].m(e.parentNode, e));
        }
        for (; n < s.length; n += 1)
          s[n].d(1);
        s.length = t.length;
      }
    },
    d(i) {
      i && L(e), We(s, i);
    }
  };
}
function Ri(l) {
  let e;
  return {
    c() {
      e = d("p"), e.textContent = "Aún no hay ejercicios destacados.", c(e, "class", "muted svelte-p2zlwf");
    },
    m(t, s) {
      $(t, e, s);
    },
    p: E,
    d(t) {
      t && L(e);
    }
  };
}
function Tl(l) {
  let e, t, s = (
    /*fav*/
    l[44].title + ""
  ), i, o, n, a = (
    /*fav*/
    l[44].total_sessions + ""
  ), f, h, u;
  return {
    c() {
      e = d("div"), t = d("span"), i = k(s), o = _(), n = d("strong"), f = k(a), h = k("x"), u = _(), c(t, "class", "svelte-p2zlwf"), c(n, "class", "svelte-p2zlwf"), c(e, "class", "line svelte-p2zlwf");
    },
    m(b, p) {
      $(b, e, p), r(e, t), r(t, i), r(e, o), r(e, n), r(n, f), r(n, h), r(e, u);
    },
    p(b, p) {
      p[0] & /*favorites*/
      2048 && s !== (s = /*fav*/
      b[44].title + "") && M(i, s), p[0] & /*favorites*/
      2048 && a !== (a = /*fav*/
      b[44].total_sessions + "") && M(f, a);
    },
    d(b) {
      b && L(e);
    }
  };
}
function Xi(l) {
  let e, t = Z(
    /*insightItems*/
    l[10]
  ), s = [];
  for (let i = 0; i < t.length; i += 1)
    s[i] = Ml(xl(l, t, i));
  return {
    c() {
      e = d("ul");
      for (let i = 0; i < s.length; i += 1)
        s[i].c();
      c(e, "class", "svelte-p2zlwf");
    },
    m(i, o) {
      $(i, e, o);
      for (let n = 0; n < s.length; n += 1)
        s[n] && s[n].m(e, null);
    },
    p(i, o) {
      if (o[0] & /*insightItems*/
      1024) {
        t = Z(
          /*insightItems*/
          i[10]
        );
        let n;
        for (n = 0; n < t.length; n += 1) {
          const a = xl(i, t, n);
          s[n] ? s[n].p(a, o) : (s[n] = Ml(a), s[n].c(), s[n].m(e, null));
        }
        for (; n < s.length; n += 1)
          s[n].d(1);
        s.length = t.length;
      }
    },
    d(i) {
      i && L(e), We(s, i);
    }
  };
}
function Ii(l) {
  let e;
  return {
    c() {
      e = d("p"), e.textContent = "Sin insights por ahora.", c(e, "class", "muted svelte-p2zlwf");
    },
    m(t, s) {
      $(t, e, s);
    },
    p: E,
    d(t) {
      t && L(e);
    }
  };
}
function Ml(l) {
  let e, t = (
    /*item*/
    l[41] + ""
  ), s;
  return {
    c() {
      e = d("li"), s = k(t);
    },
    m(i, o) {
      $(i, e, o), r(e, s);
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
function Oi(l) {
  let e, t, s, i, o, n, a, f, h, u, b, p, g, v, m = (
    /*summaryData*/
    l[15].total_exercises + ""
  ), y, x, j, w, S, T, q = (
    /*summaryData*/
    l[15].weekly_sessions + ""
  ), C, D, Y, I, J, H, pe = Number(
    /*summaryData*/
    l[15].avg_satisfaction || 0
  ).toFixed(1) + "", ve, oe, G, ce, ee, W, O, R, ge, te, K, V, P = (
    /*summaryData*/
    l[15].distinct_days + ""
  ), B, A, Q, je, He, Ce, Ze = (
    /*formatMinutes*/
    l[16](
      /*timeData*/
      l[14].week_minutes
    ) + ""
  ), mt, Et, Ee, et, Nt, tt, lt = (
    /*formatMinutes*/
    l[16](
      /*timeData*/
      l[14].month_minutes
    ) + ""
  ), yt, Dt, Ne, De, st, Yt, Ve, it = (
    /*activeDays*/
    l[13].length + ""
  ), xt, Pt, Rt, Ue, Xt, Se, we, _t, It, Ye, Ot, Bt, Pe, Le, wt, Ft, Ht, $e, kt, Vt, Ut, Te, nt, Jt, zt, Qt, de = (
    /*email*/
    l[1] && ql(l)
  ), qt = Z(["L", "M", "X", "J", "V", "S", "D"]), be = [];
  for (let N = 0; N < 7; N += 1)
    be[N] = jl(zl(l, qt, N));
  let ue = (
    /*xpOpen*/
    l[5] && Cl(l)
  );
  function Kt(N, U) {
    return (
      /*categories*/
      N[12].length === 0 ? Yi : Di
    );
  }
  let rt = Kt(l), me = rt(l);
  function Gt(N, U) {
    return (
      /*favorites*/
      N[11].length === 0 ? Ri : Pi
    );
  }
  let at = Gt(l), ye = at(l);
  function Wt(N, U) {
    return (
      /*insightItems*/
      N[10].length === 0 ? Ii : Xi
    );
  }
  let ot = Wt(l), xe = ot(l);
  return {
    c() {
      e = d("div"), t = d("section"), s = d("div"), i = d("p"), i.textContent = "Estadísticas avanzadas", o = _(), n = d("h1"), a = k(
        /*name*/
        l[0]
      ), f = _(), de && de.c(), h = _(), u = d("div"), b = d("div"), p = d("span"), p.textContent = "Total de pausas", g = _(), v = d("strong"), y = k(m), x = _(), j = d("div"), w = d("span"), w.textContent = "Sesiones esta semana", S = _(), T = d("strong"), C = k(q), D = _(), Y = d("div"), I = d("span"), I.textContent = "Satisfacción promedio", J = _(), H = d("strong"), ve = k(pe), oe = k(" / 5"), G = _(), ce = d("div"), ee = _(), W = d("div"), O = _(), R = d("section"), ge = d("div"), te = d("span"), te.textContent = "Días activos", K = _(), V = d("strong"), B = k(P), A = _(), Q = d("div"), je = d("span"), je.textContent = "Tiempo saludable (7 días)", He = _(), Ce = d("strong"), mt = k(Ze), Et = _(), Ee = d("div"), et = d("span"), et.textContent = "Tiempo saludable (30 días)", Nt = _(), tt = d("strong"), yt = k(lt), Dt = _(), Ne = d("section"), De = d("div"), st = d("h2"), st.textContent = "Actividad semanal", Yt = _(), Ve = d("span"), xt = k(it), Pt = k("/7 días activos"), Rt = _(), Ue = d("div");
      for (let N = 0; N < 7; N += 1)
        be[N].c();
      Xt = _(), Se = d("section"), we = d("button"), _t = d("div"), _t.innerHTML = '<h2 class="svelte-p2zlwf">Historial de XP</h2> <p class="muted svelte-p2zlwf">Últimos movimientos</p>', It = _(), Ye = d("span"), Ye.textContent = "⌄", Ot = _(), ue && ue.c(), Bt = _(), Pe = d("section"), Le = d("div"), wt = d("h3"), wt.textContent = "Categorías favoritas", Ft = _(), me.c(), Ht = _(), $e = d("div"), kt = d("h3"), kt.textContent = "Ejercicios más repetidos", Vt = _(), ye.c(), Ut = _(), Te = d("section"), nt = d("h2"), nt.textContent = "Insights", Jt = _(), xe.c(), c(i, "class", "eyebrow svelte-p2zlwf"), c(n, "class", "svelte-p2zlwf"), c(b, "class", "hero-card svelte-p2zlwf"), c(j, "class", "hero-card accent svelte-p2zlwf"), c(Y, "class", "hero-card svelte-p2zlwf"), c(u, "class", "hero-cards svelte-p2zlwf"), c(ce, "class", "orb svelte-p2zlwf"), c(W, "class", "orb small svelte-p2zlwf"), c(t, "class", "hero svelte-p2zlwf"), c(te, "class", "svelte-p2zlwf"), c(V, "class", "svelte-p2zlwf"), c(ge, "class", "card svelte-p2zlwf"), c(je, "class", "svelte-p2zlwf"), c(Ce, "class", "svelte-p2zlwf"), c(Q, "class", "card svelte-p2zlwf"), c(et, "class", "svelte-p2zlwf"), c(tt, "class", "svelte-p2zlwf"), c(Ee, "class", "card svelte-p2zlwf"), c(R, "class", "grid svelte-p2zlwf"), c(st, "class", "svelte-p2zlwf"), c(Ve, "class", "muted svelte-p2zlwf"), c(De, "class", "row svelte-p2zlwf"), c(Ue, "class", "days svelte-p2zlwf"), c(Ne, "class", "section svelte-p2zlwf"), c(Ye, "class", "svelte-p2zlwf"), pt(
        Ye,
        "rotated",
        /*xpOpen*/
        l[5]
      ), c(we, "type", "button"), c(we, "class", "xp-toggle svelte-p2zlwf"), c(Se, "class", "section xp svelte-p2zlwf"), c(Le, "class", "card svelte-p2zlwf"), c($e, "class", "card svelte-p2zlwf"), c(Pe, "class", "grid two svelte-p2zlwf"), c(nt, "class", "svelte-p2zlwf"), c(Te, "class", "section svelte-p2zlwf"), c(e, "class", "panel svelte-p2zlwf");
    },
    m(N, U) {
      $(N, e, U), r(e, t), r(t, s), r(s, i), r(s, o), r(s, n), r(n, a), r(s, f), de && de.m(s, null), r(t, h), r(t, u), r(u, b), r(b, p), r(b, g), r(b, v), r(v, y), r(u, x), r(u, j), r(j, w), r(j, S), r(j, T), r(T, C), r(u, D), r(u, Y), r(Y, I), r(Y, J), r(Y, H), r(H, ve), r(H, oe), r(t, G), r(t, ce), r(t, ee), r(t, W), r(e, O), r(e, R), r(R, ge), r(ge, te), r(ge, K), r(ge, V), r(V, B), r(R, A), r(R, Q), r(Q, je), r(Q, He), r(Q, Ce), r(Ce, mt), r(R, Et), r(R, Ee), r(Ee, et), r(Ee, Nt), r(Ee, tt), r(tt, yt), r(e, Dt), r(e, Ne), r(Ne, De), r(De, st), r(De, Yt), r(De, Ve), r(Ve, xt), r(Ve, Pt), r(Ne, Rt), r(Ne, Ue);
      for (let le = 0; le < 7; le += 1)
        be[le] && be[le].m(Ue, null);
      r(e, Xt), r(e, Se), r(Se, we), r(we, _t), r(we, It), r(we, Ye), r(Se, Ot), ue && ue.m(Se, null), r(e, Bt), r(e, Pe), r(Pe, Le), r(Le, wt), r(Le, Ft), me.m(Le, null), r(Pe, Ht), r(Pe, $e), r($e, kt), r($e, Vt), ye.m($e, null), r(e, Ut), r(e, Te), r(Te, nt), r(Te, Jt), xe.m(Te, null), zt || (Qt = X(
        we,
        "click",
        /*click_handler*/
        l[34]
      ), zt = !0);
    },
    p(N, U) {
      if (U[0] & /*name*/
      1 && M(
        a,
        /*name*/
        N[0]
      ), /*email*/
      N[1] ? de ? de.p(N, U) : (de = ql(N), de.c(), de.m(s, null)) : de && (de.d(1), de = null), U[0] & /*summaryData*/
      32768 && m !== (m = /*summaryData*/
      N[15].total_exercises + "") && M(y, m), U[0] & /*summaryData*/
      32768 && q !== (q = /*summaryData*/
      N[15].weekly_sessions + "") && M(C, q), U[0] & /*summaryData*/
      32768 && pe !== (pe = Number(
        /*summaryData*/
        N[15].avg_satisfaction || 0
      ).toFixed(1) + "") && M(ve, pe), U[0] & /*summaryData*/
      32768 && P !== (P = /*summaryData*/
      N[15].distinct_days + "") && M(B, P), U[0] & /*timeData*/
      16384 && Ze !== (Ze = /*formatMinutes*/
      N[16](
        /*timeData*/
        N[14].week_minutes
      ) + "") && M(mt, Ze), U[0] & /*timeData*/
      16384 && lt !== (lt = /*formatMinutes*/
      N[16](
        /*timeData*/
        N[14].month_minutes
      ) + "") && M(yt, lt), U[0] & /*activeDays*/
      8192 && it !== (it = /*activeDays*/
      N[13].length + "") && M(xt, it), U[0] & /*activeDays*/
      8192) {
        qt = Z(["L", "M", "X", "J", "V", "S", "D"]);
        let le;
        for (le = 0; le < 7; le += 1) {
          const Zt = zl(N, qt, le);
          be[le] ? be[le].p(Zt, U) : (be[le] = jl(Zt), be[le].c(), be[le].m(Ue, null));
        }
        for (; le < 7; le += 1)
          be[le].d(1);
      }
      U[0] & /*xpOpen*/
      32 && pt(
        Ye,
        "rotated",
        /*xpOpen*/
        N[5]
      ), /*xpOpen*/
      N[5] ? ue ? ue.p(N, U) : (ue = Cl(N), ue.c(), ue.m(Se, null)) : ue && (ue.d(1), ue = null), rt === (rt = Kt(N)) && me ? me.p(N, U) : (me.d(1), me = rt(N), me && (me.c(), me.m(Le, null))), at === (at = Gt(N)) && ye ? ye.p(N, U) : (ye.d(1), ye = at(N), ye && (ye.c(), ye.m($e, null))), ot === (ot = Wt(N)) && xe ? xe.p(N, U) : (xe.d(1), xe = ot(N), xe && (xe.c(), xe.m(Te, null)));
    },
    i: E,
    o: E,
    d(N) {
      N && L(e), de && de.d(), We(be, N), ue && ue.d(), me.d(), ye.d(), xe.d(), zt = !1, Qt();
    }
  };
}
function Bi(l, e, t) {
  let s, i, o, n, a, f, h, u, b, p, g, { name: v = "Usuario" } = e, { email: m = "" } = e, { summary: y = "" } = e, { timeSummary: x = "" } = e, { weeklyActiveDays: j = "" } = e, { xpHistory: w = "" } = e, { categoryDistribution: S = "" } = e, { favoriteVideos: T = "" } = e, { insights: q = "" } = e, { xpTotal: C = 0 } = e, { xpLimit: D = 10 } = e, { xpOffset: Y = 0 } = e, { xpFrom: I = "" } = e, { xpTo: J = "" } = e;
  const H = (A, Q) => {
    if (!A || typeof A != "string") return Q;
    try {
      return JSON.parse(A);
    } catch {
      return Q;
    }
  }, pe = (A) => A ? A < 60 ? `${Math.round(A)} min` : `${(A / 60).toFixed(1)} h` : "0 min", ve = (A) => {
    var je, He;
    const Q = ((je = A == null ? void 0 : A.metadata) == null ? void 0 : je.source) || (A == null ? void 0 : A.action_type) || "XP";
    if (Q === "achievement") {
      const Ce = (He = A == null ? void 0 : A.metadata) == null ? void 0 : He.achievement_title;
      return Ce ? `Logro · ${Ce}` : "Logro";
    }
    return Q === "weekly_challenge" ? "Reto semanal" : Q === "questionnaire" ? "Cuestionario" : Q === "active_pause" || Q === "pause" ? "Pausa activa" : "XP";
  }, oe = (A) => {
    if (!A) return "";
    const Q = new Date(A);
    return Number.isNaN(Q.getTime()) ? "" : Q.toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" });
  }, G = qe();
  let ce = !1, ee = I, W = J, O = I, R = J;
  const ge = () => t(5, ce = !ce);
  function te() {
    ee = this.value, t(6, ee), t(30, I), t(32, O);
  }
  function K() {
    W = this.value, t(7, W), t(31, J), t(33, R);
  }
  const V = () => {
    t(6, ee = ""), t(7, W = ""), G("xpfilter", { from: "", to: "" });
  }, P = () => {
    G("xpfilter", { from: ee, to: W });
  }, B = () => {
    G("xploadmore", { nextOffset: b + u });
  };
  return l.$$set = (A) => {
    "name" in A && t(0, v = A.name), "email" in A && t(1, m = A.email), "summary" in A && t(20, y = A.summary), "timeSummary" in A && t(21, x = A.timeSummary), "weeklyActiveDays" in A && t(22, j = A.weeklyActiveDays), "xpHistory" in A && t(23, w = A.xpHistory), "categoryDistribution" in A && t(24, S = A.categoryDistribution), "favoriteVideos" in A && t(25, T = A.favoriteVideos), "insights" in A && t(26, q = A.insights), "xpTotal" in A && t(27, C = A.xpTotal), "xpLimit" in A && t(28, D = A.xpLimit), "xpOffset" in A && t(29, Y = A.xpOffset), "xpFrom" in A && t(30, I = A.xpFrom), "xpTo" in A && t(31, J = A.xpTo);
  }, l.$$.update = () => {
    l.$$.dirty[0] & /*summary*/
    1048576 && t(15, s = H(y, {
      total_exercises: 0,
      weekly_sessions: 0,
      avg_satisfaction: 0,
      distinct_days: 0
    })), l.$$.dirty[0] & /*timeSummary*/
    2097152 && t(14, i = H(x, { week_minutes: 0, month_minutes: 0 })), l.$$.dirty[0] & /*weeklyActiveDays*/
    4194304 && t(13, o = H(j, [])), l.$$.dirty[0] & /*xpHistory*/
    8388608 && t(3, n = H(w, [])), l.$$.dirty[0] & /*categoryDistribution*/
    16777216 && t(12, a = H(S, [])), l.$$.dirty[0] & /*favoriteVideos*/
    33554432 && t(11, f = H(T, [])), l.$$.dirty[0] & /*insights*/
    67108864 && t(10, h = H(q, [])), l.$$.dirty[0] & /*xpFrom*/
    1073741824 | l.$$.dirty[1] & /*lastXpFrom*/
    2 && I !== O && (t(6, ee = I), t(32, O = I)), l.$$.dirty[1] & /*xpTo, lastXpTo*/
    5 && J !== R && (t(7, W = J), t(33, R = J)), l.$$.dirty[0] & /*xpLimit*/
    268435456 && t(9, u = Number(D) || 10), l.$$.dirty[0] & /*xpOffset*/
    536870912 && t(4, b = Number(Y) || 0), l.$$.dirty[0] & /*xpTotal, xpItems*/
    134217736 && t(2, p = Number(C) || n.length), l.$$.dirty[0] & /*safeOffset, xpItems, totalCount*/
    28 && t(8, g = Math.min(b + n.length, p));
  }, [
    v,
    m,
    p,
    n,
    b,
    ce,
    ee,
    W,
    g,
    u,
    h,
    f,
    a,
    o,
    i,
    s,
    pe,
    ve,
    oe,
    G,
    y,
    x,
    j,
    w,
    S,
    T,
    q,
    C,
    D,
    Y,
    I,
    J,
    O,
    R,
    ge,
    te,
    K,
    V,
    P,
    B
  ];
}
class us extends re {
  constructor(e) {
    super(), ie(
      this,
      e,
      Bi,
      Oi,
      F,
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
      Ai,
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
customElements.define("svelte-user-stats-panel", ne(us, { name: {}, email: {}, summary: {}, timeSummary: {}, weeklyActiveDays: {}, xpHistory: {}, categoryDistribution: {}, favoriteVideos: {}, insights: {}, xpTotal: {}, xpLimit: {}, xpOffset: {}, xpFrom: {}, xpTo: {} }, [], [], !0));
function Fi(l) {
  se(l, "svelte-1liu8s0", ":root{--podium-accent:#10b981}.podium-wrap.svelte-1liu8s0.svelte-1liu8s0{border-radius:32px;border:1px solid rgba(16, 185, 129, 0.18);background:radial-gradient(circle at top, #ecfdf5 0%, #ffffff 45%, #f0fdf4 100%);padding:28px;box-shadow:0 30px 60px rgba(15, 118, 110, 0.08)}.podium-header.svelte-1liu8s0.svelte-1liu8s0{display:flex;flex-wrap:wrap;gap:16px;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(16, 185, 129, 0.12);padding-bottom:16px}.eyebrow.svelte-1liu8s0.svelte-1liu8s0{font-size:10px;letter-spacing:0.32em;text-transform:uppercase;font-weight:600;color:#10b981}h2.svelte-1liu8s0.svelte-1liu8s0{margin:6px 0 0;font-size:24px;font-weight:700;color:#0f172a}.scope.svelte-1liu8s0.svelte-1liu8s0{margin-top:4px;font-size:13px;color:#64748b}.badge.svelte-1liu8s0.svelte-1liu8s0{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:600;color:#0f766e}.badge-icon.svelte-1liu8s0.svelte-1liu8s0{width:20px;height:20px;display:inline-block;border-radius:50%;background:conic-gradient(from 180deg, #34d399, #bbf7d0, #34d399);position:relative}.badge-icon.svelte-1liu8s0.svelte-1liu8s0::after{content:'';position:absolute;inset:5px;border-radius:50%;background:#ecfdf5}.podium-grid.svelte-1liu8s0.svelte-1liu8s0{margin-top:28px;display:grid;grid-template-columns:repeat(3, minmax(0, 1fr));align-items:end;gap:18px}.podium-card.svelte-1liu8s0.svelte-1liu8s0{border-radius:28px;border:1px solid transparent;padding:18px;min-height:220px;display:flex;flex-direction:column;gap:12px;animation:svelte-1liu8s0-rise 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards;opacity:0;transform:translateY(18px) scale(0.98);animation-delay:var(--delay)}.podium-card.up.svelte-1liu8s0.svelte-1liu8s0{transform:translateY(12px) scale(1)}.podium-card.first.svelte-1liu8s0.svelte-1liu8s0{background:linear-gradient(180deg, rgba(16, 185, 129, 0.18), rgba(16, 185, 129, 0.05));border-color:rgba(16, 185, 129, 0.3);min-height:300px}.podium-card.second.svelte-1liu8s0.svelte-1liu8s0{background:linear-gradient(180deg, rgba(52, 211, 153, 0.18), rgba(236, 253, 245, 0.2));border-color:rgba(52, 211, 153, 0.25);min-height:260px}.podium-card.third.svelte-1liu8s0.svelte-1liu8s0{background:linear-gradient(180deg, rgba(187, 247, 208, 0.3), rgba(255, 255, 255, 0.5));border-color:rgba(187, 247, 208, 0.4);min-height:230px}.podium-meta.svelte-1liu8s0.svelte-1liu8s0{display:flex;justify-content:space-between;align-items:center;font-size:11px;font-weight:600;text-transform:uppercase;color:#64748b}.place.svelte-1liu8s0.svelte-1liu8s0{color:#0f766e}.xp.svelte-1liu8s0.svelte-1liu8s0{color:#94a3b8}.reward.svelte-1liu8s0.svelte-1liu8s0{border-radius:18px;background:rgba(255, 255, 255, 0.75);padding:12px;text-align:center;font-size:12px;color:#0f172a;box-shadow:inset 0 0 0 1px rgba(148, 163, 184, 0.2);min-height:168px;display:flex;flex-direction:column;justify-content:center;gap:6px}.reward.svelte-1liu8s0 img.svelte-1liu8s0{width:100%;height:110px;object-fit:contain;border-radius:14px;background:#ffffff;margin-bottom:10px}.reward-title.svelte-1liu8s0.svelte-1liu8s0{font-size:13px;font-weight:600;margin:0}.reward-desc.svelte-1liu8s0.svelte-1liu8s0{margin:6px 0 0;font-size:11px;color:#6b7280}.reward.svelte-1liu8s0 a.svelte-1liu8s0{display:inline-block;margin-top:8px;background:#10b981;color:#ffffff;font-size:11px;padding:6px 12px;border-radius:999px;text-decoration:none}.reward.svelte-1liu8s0 a.svelte-1liu8s0:hover{background:#059669}.reward.empty.svelte-1liu8s0.svelte-1liu8s0{border:1px dashed rgba(148, 163, 184, 0.5);background:rgba(255, 255, 255, 0.6);color:#6b7280}.winner.svelte-1liu8s0.svelte-1liu8s0{margin-top:auto;display:flex;align-items:center;gap:10px}.avatar.svelte-1liu8s0.svelte-1liu8s0{width:46px;height:46px;border-radius:50%;object-fit:cover;background:#f8fafc;box-shadow:0 10px 20px rgba(15, 118, 110, 0.12)}.avatar.fallback.svelte-1liu8s0.svelte-1liu8s0{display:grid;place-items:center;font-size:16px;font-weight:600;color:#64748b;background:rgba(255, 255, 255, 0.8)}.winner-meta.svelte-1liu8s0 p.svelte-1liu8s0{margin:0;font-size:14px;font-weight:600;color:#0f172a}.winner-meta.svelte-1liu8s0 span.svelte-1liu8s0{font-size:12px;color:#94a3b8}.empty-winner.svelte-1liu8s0.svelte-1liu8s0{font-size:12px;color:#94a3b8}.loading.svelte-1liu8s0.svelte-1liu8s0{margin-top:18px;text-align:center;font-size:12px;color:#6b7280}@keyframes svelte-1liu8s0-rise{to{opacity:1;transform:translateY(0) scale(1)}}@media(max-width: 900px){.podium-grid.svelte-1liu8s0.svelte-1liu8s0{grid-template-columns:1fr}.podium-card.svelte-1liu8s0.svelte-1liu8s0{min-height:auto}}");
}
function Al(l, e, t) {
  const s = l.slice();
  return s[11] = e[t], s[13] = t, s;
}
function El(l) {
  let e, t;
  return {
    c() {
      e = d("p"), t = k(
        /*scopeLabel*/
        l[0]
      ), c(e, "class", "scope svelte-1liu8s0");
    },
    m(s, i) {
      $(s, e, i), r(e, t);
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
function Nl(l) {
  let e = `${/*podiumUsers*/
  l[2][
    /*slot*/
    l[11].place - 1
  ].id}-${/*slot*/
  l[11].place}`, t, s = Yl(l);
  return {
    c() {
      s.c(), t = Ae();
    },
    m(i, o) {
      s.m(i, o), $(i, t, o);
    },
    p(i, o) {
      o & /*podiumUsers*/
      4 && F(e, e = `${/*podiumUsers*/
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
function Dl(l) {
  let e, t, s = (
    /*podiumUsers*/
    l[2][
      /*slot*/
      l[11].place - 1
    ].periodical_exp + ""
  ), i, o;
  return {
    c() {
      e = d("span"), t = k("+"), i = k(s), o = k(" XP"), c(e, "class", "xp svelte-1liu8s0");
    },
    m(n, a) {
      $(n, e, a), r(e, t), r(e, i), r(e, o);
    },
    p(n, a) {
      a & /*podiumUsers*/
      4 && s !== (s = /*podiumUsers*/
      n[2][
        /*slot*/
        n[11].place - 1
      ].periodical_exp + "") && M(i, s);
    },
    d(n) {
      n && L(e);
    }
  };
}
function Hi(l) {
  let e;
  return {
    c() {
      e = d("div"), e.textContent = "Recompensa pendiente", c(e, "class", "reward empty svelte-1liu8s0");
    },
    m(t, s) {
      $(t, e, s);
    },
    p: E,
    d(t) {
      t && L(e);
    }
  };
}
function Vi(l) {
  let e, t = (
    /*resolveReward*/
    l[5](
      /*slot*/
      l[11].place
    ).image_url
  ), s, i, o, n = (
    /*resolveReward*/
    l[5](
      /*slot*/
      l[11].place
    ).description
  ), a, f = (
    /*resolveReward*/
    l[5](
      /*slot*/
      l[11].place
    ).cta_url
  ), h = t && Ui(l), u = n && Ji(l), b = f && Qi(l);
  return {
    c() {
      e = d("div"), h && h.c(), s = _(), i = d("p"), i.textContent = `${/*resolveReward*/
      l[5](
        /*slot*/
        l[11].place
      ).title}`, o = _(), u && u.c(), a = _(), b && b.c(), c(i, "class", "reward-title svelte-1liu8s0"), c(e, "class", "reward svelte-1liu8s0");
    },
    m(p, g) {
      $(p, e, g), h && h.m(e, null), r(e, s), r(e, i), r(e, o), u && u.m(e, null), r(e, a), b && b.m(e, null);
    },
    p(p, g) {
      t && h.p(p, g), n && u.p(p, g), f && b.p(p, g);
    },
    d(p) {
      p && L(e), h && h.d(), u && u.d(), b && b.d();
    }
  };
}
function Ui(l) {
  let e, t;
  return {
    c() {
      e = d("img"), Ke(e.src, t = /*resolveReward*/
      l[5](
        /*slot*/
        l[11].place
      ).image_url) || c(e, "src", t), c(
        e,
        "alt",
        /*resolveReward*/
        l[5](
          /*slot*/
          l[11].place
        ).title
      ), c(e, "loading", "lazy"), c(e, "class", "svelte-1liu8s0");
    },
    m(s, i) {
      $(s, e, i);
    },
    p: E,
    d(s) {
      s && L(e);
    }
  };
}
function Ji(l) {
  let e;
  return {
    c() {
      e = d("p"), e.textContent = `${/*resolveReward*/
      l[5](
        /*slot*/
        l[11].place
      ).description}`, c(e, "class", "reward-desc svelte-1liu8s0");
    },
    m(t, s) {
      $(t, e, s);
    },
    p: E,
    d(t) {
      t && L(e);
    }
  };
}
function Qi(l) {
  let e, t;
  return {
    c() {
      e = d("a"), t = k("Ver mas"), c(
        e,
        "href",
        /*resolveReward*/
        l[5](
          /*slot*/
          l[11].place
        ).cta_url
      ), c(e, "target", "_blank"), c(e, "rel", "noreferrer"), c(e, "class", "svelte-1liu8s0");
    },
    m(s, i) {
      $(s, e, i), r(e, t);
    },
    p: E,
    d(s) {
      s && L(e);
    }
  };
}
function Ki(l) {
  let e, t, s, i = (
    /*podiumUsers*/
    l[2][
      /*slot*/
      l[11].place - 1
    ].first_name + ""
  ), o, n, a = (
    /*podiumUsers*/
    l[2][
      /*slot*/
      l[11].place - 1
    ].last_name + ""
  ), f, h, u, b, p = (
    /*podiumUsers*/
    l[2][
      /*slot*/
      l[11].place - 1
    ].periodical_exp + ""
  ), g, v;
  function m(j, w) {
    return (
      /*podiumUsers*/
      j[2][
        /*slot*/
        j[11].place - 1
      ].avatar_url ? Zi : Wi
    );
  }
  let y = m(l), x = y(l);
  return {
    c() {
      x.c(), e = _(), t = d("div"), s = d("p"), o = k(i), n = _(), f = k(a), h = _(), u = d("span"), b = k("+"), g = k(p), v = k(" XP"), c(s, "class", "svelte-1liu8s0"), c(u, "class", "svelte-1liu8s0"), c(t, "class", "winner-meta svelte-1liu8s0");
    },
    m(j, w) {
      x.m(j, w), $(j, e, w), $(j, t, w), r(t, s), r(s, o), r(s, n), r(s, f), r(t, h), r(t, u), r(u, b), r(u, g), r(u, v);
    },
    p(j, w) {
      y === (y = m(j)) && x ? x.p(j, w) : (x.d(1), x = y(j), x && (x.c(), x.m(e.parentNode, e))), w & /*podiumUsers*/
      4 && i !== (i = /*podiumUsers*/
      j[2][
        /*slot*/
        j[11].place - 1
      ].first_name + "") && M(o, i), w & /*podiumUsers*/
      4 && a !== (a = /*podiumUsers*/
      j[2][
        /*slot*/
        j[11].place - 1
      ].last_name + "") && M(f, a), w & /*podiumUsers*/
      4 && p !== (p = /*podiumUsers*/
      j[2][
        /*slot*/
        j[11].place - 1
      ].periodical_exp + "") && M(g, p);
    },
    d(j) {
      j && (L(e), L(t)), x.d(j);
    }
  };
}
function Gi(l) {
  let e;
  return {
    c() {
      e = d("span"), e.textContent = "Aun sin ganador", c(e, "class", "empty-winner svelte-1liu8s0");
    },
    m(t, s) {
      $(t, e, s);
    },
    p: E,
    d(t) {
      t && L(e);
    }
  };
}
function Wi(l) {
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
      e = d("div"), s = k(t), c(e, "class", "avatar fallback svelte-1liu8s0");
    },
    m(i, o) {
      $(i, e, o), r(e, s);
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
function Zi(l) {
  let e, t, s;
  return {
    c() {
      e = d("img"), Ke(e.src, t = /*podiumUsers*/
      l[2][
        /*slot*/
        l[11].place - 1
      ].avatar_url) || c(e, "src", t), c(e, "alt", s = /*podiumUsers*/
      l[2][
        /*slot*/
        l[11].place - 1
      ].first_name), c(e, "class", "avatar svelte-1liu8s0"), c(e, "loading", "lazy");
    },
    m(i, o) {
      $(i, e, o);
    },
    p(i, o) {
      o & /*podiumUsers*/
      4 && !Ke(e.src, t = /*podiumUsers*/
      i[2][
        /*slot*/
        i[11].place - 1
      ].avatar_url) && c(e, "src", t), o & /*podiumUsers*/
      4 && s !== (s = /*podiumUsers*/
      i[2][
        /*slot*/
        i[11].place - 1
      ].first_name) && c(e, "alt", s);
    },
    d(i) {
      i && L(e);
    }
  };
}
function Yl(l) {
  let e, t, s, i, o, n, a, f, h = (
    /*podiumUsers*/
    l[2][
      /*slot*/
      l[11].place - 1
    ].id !== "placeholder" && Dl(l)
  );
  function u(y, x) {
    return (
      /*resolveReward*/
      y[5](
        /*slot*/
        y[11].place
      ) ? Vi : Hi
    );
  }
  let p = u(l)(l);
  function g(y, x) {
    return (
      /*podiumUsers*/
      y[2][
        /*slot*/
        y[11].place - 1
      ].id === "placeholder" ? Gi : Ki
    );
  }
  let v = g(l), m = v(l);
  return {
    c() {
      e = d("article"), t = d("div"), s = d("span"), s.textContent = `${/*slot*/
      l[11].place} lugar`, i = _(), h && h.c(), o = _(), p.c(), n = _(), a = d("div"), m.c(), f = _(), c(s, "class", "place svelte-1liu8s0"), c(t, "class", "podium-meta svelte-1liu8s0"), c(a, "class", "winner svelte-1liu8s0"), c(e, "class", Me(`podium-card ${/*slot*/
      l[11].className} ${/*slot*/
      l[11].bump}`) + " svelte-1liu8s0"), c(e, "style", `--delay:${/*slot*/
      l[11].delay + /*index*/
      l[13] * 0.35}s;`);
    },
    m(y, x) {
      $(y, e, x), r(e, t), r(t, s), r(t, i), h && h.m(t, null), r(e, o), p.m(e, null), r(e, n), r(e, a), m.m(a, null), r(e, f);
    },
    p(y, x) {
      /*podiumUsers*/
      y[2][
        /*slot*/
        y[11].place - 1
      ].id !== "placeholder" ? h ? h.p(y, x) : (h = Dl(y), h.c(), h.m(t, null)) : h && (h.d(1), h = null), p.p(y, x), v === (v = g(y)) && m ? m.p(y, x) : (m.d(1), m = v(y), m && (m.c(), m.m(a, null)));
    },
    d(y) {
      y && L(e), h && h.d(), p.d(), m.d();
    }
  };
}
function Pl(l, e) {
  let t, s, i = (
    /*podiumUsers*/
    e[2][
      /*slot*/
      e[11].place - 1
    ] && Nl(e)
  );
  return {
    key: l,
    first: null,
    c() {
      t = Ae(), i && i.c(), s = Ae(), this.first = t;
    },
    m(o, n) {
      $(o, t, n), i && i.m(o, n), $(o, s, n);
    },
    p(o, n) {
      e = o, /*podiumUsers*/
      e[2][
        /*slot*/
        e[11].place - 1
      ] ? i ? i.p(e, n) : (i = Nl(e), i.c(), i.m(s.parentNode, s)) : i && (i.d(1), i = null);
    },
    d(o) {
      o && (L(t), L(s)), i && i.d(o);
    }
  };
}
function Rl(l) {
  let e, t = [], s = /* @__PURE__ */ new Map(), i = Z(
    /*layout*/
    l[4]
  );
  const o = (n) => (
    /*slot*/
    n[11].place
  );
  for (let n = 0; n < i.length; n += 1) {
    let a = Al(l, i, n), f = o(a);
    s.set(f, t[n] = Pl(f, a));
  }
  return {
    c() {
      e = d("div");
      for (let n = 0; n < t.length; n += 1)
        t[n].c();
      c(e, "class", "podium-grid svelte-1liu8s0");
    },
    m(n, a) {
      $(n, e, a);
      for (let f = 0; f < t.length; f += 1)
        t[f] && t[f].m(e, null);
    },
    p(n, a) {
      a & /*podiumUsers, layout, resolveReward*/
      52 && (i = Z(
        /*layout*/
        n[4]
      ), t = bt(t, a, o, 1, n, i, s, e, ht, Pl, null, Al));
    },
    d(n) {
      n && L(e);
      for (let a = 0; a < t.length; a += 1)
        t[a].d();
    }
  };
}
function Xl(l) {
  let e;
  return {
    c() {
      e = d("div"), e.textContent = "Cargando clasificaciones...", c(e, "class", "loading svelte-1liu8s0");
    },
    m(t, s) {
      $(t, e, s);
    },
    d(t) {
      t && L(e);
    }
  };
}
function en(l) {
  let e, t, s, i, o, n, a, f, h, u, b = (
    /*playId*/
    l[3]
  ), p, g = (
    /*scopeLabel*/
    l[0] && El(l)
  ), v = Rl(l), m = (
    /*loading*/
    l[1] && Xl()
  );
  return {
    c() {
      e = d("section"), t = d("header"), s = d("div"), i = d("p"), i.textContent = "Podio temporada", o = _(), n = d("h2"), n.textContent = "Top Activos", a = _(), g && g.c(), f = _(), h = d("div"), h.innerHTML = '<span class="badge-icon svelte-1liu8s0" aria-hidden="true"></span> <span>Recompensa especial para el Top 3</span>', u = _(), v.c(), p = _(), m && m.c(), c(i, "class", "eyebrow svelte-1liu8s0"), c(n, "class", "svelte-1liu8s0"), c(h, "class", "badge svelte-1liu8s0"), c(t, "class", "podium-header svelte-1liu8s0"), c(e, "class", "podium-wrap svelte-1liu8s0"), c(
        e,
        "data-play",
        /*playId*/
        l[3]
      );
    },
    m(y, x) {
      $(y, e, x), r(e, t), r(t, s), r(s, i), r(s, o), r(s, n), r(s, a), g && g.m(s, null), r(t, f), r(t, h), r(e, u), v.m(e, null), r(e, p), m && m.m(e, null);
    },
    p(y, [x]) {
      /*scopeLabel*/
      y[0] ? g ? g.p(y, x) : (g = El(y), g.c(), g.m(s, null)) : g && (g.d(1), g = null), x & /*playId*/
      8 && F(b, b = /*playId*/
      y[3]) ? (v.d(1), v = Rl(y), v.c(), v.m(e, p)) : v.p(y, x), /*loading*/
      y[1] ? m || (m = Xl(), m.c(), m.m(e, null)) : m && (m.d(1), m = null), x & /*playId*/
      8 && c(
        e,
        "data-play",
        /*playId*/
        y[3]
      );
    },
    i: E,
    o: E,
    d(y) {
      y && L(e), g && g.d(), v.d(y), m && m.d();
    }
  };
}
function tn(l, e, t) {
  let s, { users: i = [] } = e, { rewards: o = {} } = e, { scopeLabel: n = "" } = e, { loading: a = !1 } = e;
  const f = {
    id: "placeholder",
    first_name: "Por definir",
    last_name: "",
    avatar_url: "",
    periodical_exp: 0
  }, h = [
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
    "users" in v && t(6, i = v.users), "rewards" in v && t(7, o = v.rewards), "scopeLabel" in v && t(0, n = v.scopeLabel), "loading" in v && t(1, a = v.loading);
  }, l.$$.update = () => {
    if (l.$$.dirty & /*users*/
    64 && t(2, s = [...u(i)].slice(0, 3)), l.$$.dirty & /*podiumUsers*/
    4)
      for (; s.length < 3; ) s.push(f);
    if (l.$$.dirty & /*podiumUsers, rewards, loading, scopeLabel, signature, playId*/
    399) {
      const v = s.map((x) => (x == null ? void 0 : x.id) ?? "").join("|"), m = o ? Object.keys(o).sort().map((x) => {
        var j;
        return `${x}:${((j = o[x]) == null ? void 0 : j.title) ?? ""}`;
      }).join("|") : "", y = `${v}-${m}-${a}-${n}`;
      y !== g && (t(8, g = y), t(3, p += 1));
    }
  }, [
    n,
    a,
    s,
    p,
    h,
    b,
    i,
    o,
    g
  ];
}
class ps extends re {
  constructor(e) {
    super(), ie(
      this,
      e,
      tn,
      en,
      F,
      {
        users: 6,
        rewards: 7,
        scopeLabel: 0,
        loading: 1
      },
      Fi
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
ne(ps, { users: {}, rewards: {}, scopeLabel: {}, loading: { type: "Boolean" } }, [], [], !0);
const ae = (l, e) => {
  const t = e.element;
  customElements.get(l) || customElements.define(l, t ?? e);
};
ae("svelte-counter", Gl);
ae("svelte-orbit-card", Wl);
ae("svelte-pulse-badge", Zl);
ae("svelte-ripple-button", es);
ae("svelte-stagger-list", ts);
ae("svelte-thermometer", ls);
ae("svelte-podium", ss);
ae("svelte-balloon-gift", is);
ae("svelte-achievement-card", ns);
ae("svelte-parallax-card", rs);
ae("svelte-flip-counter", as);
ae("svelte-parallax-stack", os);
ae("svelte-video-card", cs);
ae("svelte-season-popup", fs);
ae("svelte-quota-token", ds);
ae("svelte-user-stats-panel", us);
ae("svelte-rewards-podium", ps);
