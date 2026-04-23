var Ys = Object.defineProperty;
var Os = (l, e, t) => e in l ? Ys(l, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : l[e] = t;
var Se = (l, e, t) => Os(l, typeof e != "symbol" ? e + "" : e, t);
function D() {
}
const ds = (l) => l;
function us(l) {
  return l();
}
function nl() {
  return /* @__PURE__ */ Object.create(null);
}
function ke(l) {
  l.forEach(us);
}
function Xt(l) {
  return typeof l == "function";
}
function ee(l, e) {
  return l != l ? e == e : l !== e || l && typeof l == "object" || typeof l == "function";
}
let kt;
function Te(l, e) {
  return l === e ? !0 : (kt || (kt = document.createElement("a")), kt.href = e, l === kt.href);
}
function Fs(l) {
  return Object.keys(l).length === 0;
}
function nt(l) {
  return l ?? "";
}
function rl(l) {
  const e = typeof l == "string" && l.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);
  return e ? [parseFloat(e[1]), e[2] || "px"] : [
    /** @type {number} */
    l,
    "px"
  ];
}
const ps = typeof window < "u";
let Vs = ps ? () => window.performance.now() : () => Date.now(), Bt = ps ? (l) => requestAnimationFrame(l) : D;
const ut = /* @__PURE__ */ new Set();
function vs(l) {
  ut.forEach((e) => {
    e.c(l) || (ut.delete(e), e.f());
  }), ut.size !== 0 && Bt(vs);
}
function Us(l) {
  let e;
  return ut.size === 0 && Bt(vs), {
    promise: new Promise((t) => {
      ut.add(e = { c: l, f: t });
    }),
    abort() {
      ut.delete(e);
    }
  };
}
function n(l, e) {
  l.appendChild(e);
}
function de(l, e, t) {
  const s = Ht(l);
  if (!s.getElementById(e)) {
    const i = d("style");
    i.id = e, i.textContent = t, ms(s, i);
  }
}
function Ht(l) {
  if (!l) return document;
  const e = l.getRootNode ? l.getRootNode() : l.ownerDocument;
  return e && /** @type {ShadowRoot} */
  e.host ? (
    /** @type {ShadowRoot} */
    e
  ) : l.ownerDocument;
}
function Gs(l) {
  const e = d("style");
  return e.textContent = "/* empty */", ms(Ht(l), e), e.sheet;
}
function ms(l, e) {
  return n(
    /** @type {Document} */
    l.head || l,
    e
  ), e.sheet;
}
function L(l, e, t) {
  l.insertBefore(e, t || null);
}
function S(l) {
  l.parentNode && l.parentNode.removeChild(l);
}
function He(l, e) {
  for (let t = 0; t < l.length; t += 1)
    l[t] && l[t].d(e);
}
function d(l) {
  return document.createElement(l);
}
function al(l) {
  return document.createElementNS("http://www.w3.org/2000/svg", l);
}
function z(l) {
  return document.createTextNode(l);
}
function y() {
  return z(" ");
}
function et() {
  return z("");
}
function O(l, e, t, s) {
  return l.addEventListener(e, t, s), () => l.removeEventListener(e, t, s);
}
function It(l) {
  return function(e) {
    return e.preventDefault(), l.call(this, e);
  };
}
function Js(l) {
  return function(e) {
    return e.stopPropagation(), l.call(this, e);
  };
}
function a(l, e, t) {
  t == null ? l.removeAttribute(e) : l.getAttribute(e) !== t && l.setAttribute(e, t);
}
function Qs(l) {
  return Array.from(l.childNodes);
}
function A(l, e) {
  e = "" + e, l.data !== e && (l.data = /** @type {string} */
  e);
}
function Ve(l, e) {
  l.value = e ?? "";
}
function ol(l, e, t) {
  for (let s = 0; s < l.options.length; s += 1) {
    const i = l.options[s];
    if (i.__value === e) {
      i.selected = !0;
      return;
    }
  }
  (!t || e !== void 0) && (l.selectedIndex = -1);
}
function Ws(l) {
  const e = l.querySelector(":checked");
  return e && e.__value;
}
function Ze(l, e, t) {
  l.classList.toggle(e, !!t);
}
function gs(l, e, { bubbles: t = !1, cancelable: s = !1 } = {}) {
  return new CustomEvent(l, { detail: e, bubbles: t, cancelable: s });
}
function Ks(l) {
  const e = {};
  return l.childNodes.forEach(
    /** @param {Element} node */
    (t) => {
      e[t.slot || "default"] = !0;
    }
  ), e;
}
const qt = /* @__PURE__ */ new Map();
let jt = 0;
function Zs(l) {
  let e = 5381, t = l.length;
  for (; t--; ) e = (e << 5) - e ^ l.charCodeAt(t);
  return e >>> 0;
}
function $s(l, e) {
  const t = { stylesheet: Gs(e), rules: {} };
  return qt.set(l, t), t;
}
function cl(l, e, t, s, i, c, r, o = 0) {
  const f = 16.666 / s;
  let p = `{
`;
  for (let x = 0; x <= 1; x += f) {
    const q = e + (t - e) * c(x);
    p += x * 100 + `%{${r(q, 1 - q)}}
`;
  }
  const u = p + `100% {${r(t, 1 - t)}}
}`, v = `__svelte_${Zs(u)}_${o}`, m = Ht(l), { stylesheet: h, rules: b } = qt.get(m) || $s(m, l);
  b[v] || (b[v] = !0, h.insertRule(`@keyframes ${v} ${u}`, h.cssRules.length));
  const g = l.style.animation || "";
  return l.style.animation = `${g ? `${g}, ` : ""}${v} ${s}ms linear ${i}ms 1 both`, jt += 1, v;
}
function ei(l, e) {
  const t = (l.style.animation || "").split(", "), s = t.filter(
    e ? (c) => c.indexOf(e) < 0 : (c) => c.indexOf("__svelte") === -1
    // remove all Svelte animations
  ), i = t.length - s.length;
  i && (l.style.animation = s.join(", "), jt -= i, jt || ti());
}
function ti() {
  Bt(() => {
    jt || (qt.forEach((l) => {
      const { ownerNode: e } = l.stylesheet;
      e && S(e);
    }), qt.clear());
  });
}
let gt;
function mt(l) {
  gt = l;
}
function hs() {
  if (!gt) throw new Error("Function called outside component initialization");
  return gt;
}
function bs(l) {
  hs().$$.on_mount.push(l);
}
function Ie() {
  const l = hs();
  return (e, t, { cancelable: s = !1 } = {}) => {
    const i = l.$$.callbacks[e];
    if (i) {
      const c = gs(
        /** @type {string} */
        e,
        t,
        { cancelable: s }
      );
      return i.slice().forEach((r) => {
        r.call(l, c);
      }), !c.defaultPrevented;
    }
    return !0;
  };
}
function li(l, e) {
  const t = l.$$.callbacks[e.type];
  t && t.slice().forEach((s) => s.call(this, e));
}
const dt = [], Pt = [];
let pt = [];
const fl = [], xs = /* @__PURE__ */ Promise.resolve();
let Rt = !1;
function _s() {
  Rt || (Rt = !0, xs.then(C));
}
function dl() {
  return _s(), xs;
}
function Ne(l) {
  pt.push(l);
}
const Mt = /* @__PURE__ */ new Set();
let ft = 0;
function C() {
  if (ft !== 0)
    return;
  const l = gt;
  do {
    try {
      for (; ft < dt.length; ) {
        const e = dt[ft];
        ft++, mt(e), si(e.$$);
      }
    } catch (e) {
      throw dt.length = 0, ft = 0, e;
    }
    for (mt(null), dt.length = 0, ft = 0; Pt.length; ) Pt.pop()();
    for (let e = 0; e < pt.length; e += 1) {
      const t = pt[e];
      Mt.has(t) || (Mt.add(t), t());
    }
    pt.length = 0;
  } while (dt.length);
  for (; fl.length; )
    fl.pop()();
  Rt = !1, Mt.clear(), mt(l);
}
function si(l) {
  if (l.fragment !== null) {
    l.update(), ke(l.before_update);
    const e = l.dirty;
    l.dirty = [-1], l.fragment && l.fragment.p(l.ctx, e), l.after_update.forEach(Ne);
  }
}
function ii(l) {
  const e = [], t = [];
  pt.forEach((s) => l.indexOf(s) === -1 ? e.push(s) : t.push(s)), t.forEach((s) => s()), pt = e;
}
let vt;
function ni() {
  return vt || (vt = Promise.resolve(), vt.then(() => {
    vt = null;
  })), vt;
}
function Nt(l, e, t) {
  l.dispatchEvent(gs(`${e ? "intro" : "outro"}${t}`));
}
const wt = /* @__PURE__ */ new Set();
let Ue;
function Yt() {
  Ue = {
    r: 0,
    c: [],
    p: Ue
    // parent group
  };
}
function Ot() {
  Ue.r || ke(Ue.c), Ue = Ue.p;
}
function Ge(l, e) {
  l && l.i && (wt.delete(l), l.i(e));
}
function ht(l, e, t, s) {
  if (l && l.o) {
    if (wt.has(l)) return;
    wt.add(l), Ue.c.push(() => {
      wt.delete(l), s && (t && l.d(1), s());
    }), l.o(e);
  } else s && s();
}
const ri = { duration: 0 };
function Le(l, e, t, s) {
  let c = e(l, t, { direction: "both" }), r = s ? 0 : 1, o = null, f = null, p = null, u;
  function v() {
    p && ei(l, p);
  }
  function m(b, g) {
    const x = (
      /** @type {Program['d']} */
      b.b - r
    );
    return g *= Math.abs(x), {
      a: r,
      b: b.b,
      d: x,
      duration: g,
      start: b.start,
      end: b.start + g,
      group: b.group
    };
  }
  function h(b) {
    const {
      delay: g = 0,
      duration: x = 300,
      easing: q = ds,
      tick: M = D,
      css: k
    } = c || ri, _ = {
      start: Vs() + g,
      b
    };
    b || (_.group = Ue, Ue.r += 1), "inert" in l && (b ? u !== void 0 && (l.inert = u) : (u = /** @type {HTMLElement} */
    l.inert, l.inert = !0)), o || f ? f = _ : (k && (v(), p = cl(l, r, b, x, g, q, k)), b && M(0, 1), o = m(_, x), Ne(() => Nt(l, b, "start")), Us((T) => {
      if (f && T > f.start && (o = m(f, x), f = null, Nt(l, o.b, "start"), k && (v(), p = cl(
        l,
        r,
        o.b,
        o.duration,
        0,
        q,
        c.css
      ))), o) {
        if (T >= o.end)
          M(r = o.b, 1 - r), Nt(l, o.b, "end"), f || (o.b ? v() : --o.group.r || ke(o.group.c)), o = null;
        else if (T >= o.start) {
          const w = T - o.start;
          r = o.a + o.d * q(w / o.duration), M(r, 1 - r);
        }
      }
      return !!(o || f);
    }));
  }
  return {
    run(b) {
      Xt(c) ? ni().then(() => {
        c = c({ direction: b ? "in" : "out" }), h(b);
      }) : h(b);
    },
    end() {
      v(), o = f = null;
    }
  };
}
function Z(l) {
  return (l == null ? void 0 : l.length) !== void 0 ? l : Array.from(l);
}
function Ft(l, e) {
  l.d(1), e.delete(l.key);
}
function Vt(l, e, t, s, i, c, r, o, f, p, u, v) {
  let m = l.length, h = c.length, b = m;
  const g = {};
  for (; b--; ) g[l[b].key] = b;
  const x = [], q = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map(), k = [];
  for (b = h; b--; ) {
    const j = v(i, c, b), E = t(j);
    let I = r.get(E);
    I ? k.push(() => I.p(j, e)) : (I = p(E, j), I.c()), q.set(E, x[b] = I), E in g && M.set(E, Math.abs(b - g[E]));
  }
  const _ = /* @__PURE__ */ new Set(), T = /* @__PURE__ */ new Set();
  function w(j) {
    Ge(j, 1), j.m(o, u), r.set(j.key, j), u = j.first, h--;
  }
  for (; m && h; ) {
    const j = x[h - 1], E = l[m - 1], I = j.key, B = E.key;
    j === E ? (u = j.first, m--, h--) : q.has(B) ? !r.has(I) || _.has(I) ? w(j) : T.has(B) ? m-- : M.get(I) > M.get(B) ? (T.add(I), w(j)) : (_.add(B), m--) : (f(E, r), m--);
  }
  for (; m--; ) {
    const j = l[m];
    q.has(j.key) || f(j, r);
  }
  for (; h; ) w(x[h - 1]);
  return ke(k), x;
}
function ai(l, e, t) {
  const { fragment: s, after_update: i } = l.$$;
  s && s.m(e, t), Ne(() => {
    const c = l.$$.on_mount.map(us).filter(Xt);
    l.$$.on_destroy ? l.$$.on_destroy.push(...c) : ke(c), l.$$.on_mount = [];
  }), i.forEach(Ne);
}
function oi(l, e) {
  const t = l.$$;
  t.fragment !== null && (ii(t.after_update), ke(t.on_destroy), t.fragment && t.fragment.d(e), t.on_destroy = t.fragment = null, t.ctx = []);
}
function ci(l, e) {
  l.$$.dirty[0] === -1 && (dt.push(l), _s(), l.$$.dirty.fill(0)), l.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function ue(l, e, t, s, i, c, r = null, o = [-1]) {
  const f = gt;
  mt(l);
  const p = l.$$ = {
    fragment: null,
    ctx: [],
    // state
    props: c,
    update: D,
    not_equal: i,
    bound: nl(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(e.context || (f ? f.$$.context : [])),
    // everything else
    callbacks: nl(),
    dirty: o,
    skip_bound: !1,
    root: e.target || f.$$.root
  };
  r && r(p.root);
  let u = !1;
  if (p.ctx = t ? t(l, e.props || {}, (v, m, ...h) => {
    const b = h.length ? h[0] : m;
    return p.ctx && i(p.ctx[v], p.ctx[v] = b) && (!p.skip_bound && p.bound[v] && p.bound[v](b), u && ci(l, v)), m;
  }) : [], p.update(), u = !0, ke(p.before_update), p.fragment = s ? s(p.ctx) : !1, e.target) {
    if (e.hydrate) {
      const v = Qs(e.target);
      p.fragment && p.fragment.l(v), v.forEach(S);
    } else
      p.fragment && p.fragment.c();
    e.intro && Ge(l.$$.fragment), ai(l, e.target, e.anchor), C();
  }
  mt(f);
}
let ys;
typeof HTMLElement == "function" && (ys = class extends HTMLElement {
  constructor(e, t, s) {
    super();
    /** The Svelte component constructor */
    Se(this, "$$ctor");
    /** Slots */
    Se(this, "$$s");
    /** The Svelte component instance */
    Se(this, "$$c");
    /** Whether or not the custom element is connected */
    Se(this, "$$cn", !1);
    /** Component props data */
    Se(this, "$$d", {});
    /** `true` if currently in the process of reflecting component props back to attributes */
    Se(this, "$$r", !1);
    /** @type {Record<string, CustomElementPropDefinition>} Props definition (name, reflected, type etc) */
    Se(this, "$$p_d", {});
    /** @type {Record<string, Function[]>} Event listeners */
    Se(this, "$$l", {});
    /** @type {Map<Function, Function>} Event listener unsubscribe functions */
    Se(this, "$$l_u", /* @__PURE__ */ new Map());
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
          let o;
          return {
            c: function() {
              o = d("slot"), r !== "default" && a(o, "name", r);
            },
            /**
             * @param {HTMLElement} target
             * @param {HTMLElement} [anchor]
             */
            m: function(u, v) {
              L(u, o, v);
            },
            d: function(u) {
              u && S(o);
            }
          };
        };
      };
      var e = t;
      if (await Promise.resolve(), !this.$$cn || this.$$c)
        return;
      const s = {}, i = Ks(this);
      for (const r of this.$$s)
        r in i && (s[r] = [t(r)]);
      for (const r of this.attributes) {
        const o = this.$$g_p(r.name);
        o in this.$$d || (this.$$d[o] = zt(o, r.value, this.$$p_d, "toProp"));
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
      const c = () => {
        this.$$r = !0;
        for (const r in this.$$p_d)
          if (this.$$d[r] = this.$$c.$$.ctx[this.$$c.$$.props[r]], this.$$p_d[r].reflect) {
            const o = zt(
              r,
              this.$$d[r],
              this.$$p_d,
              "toAttribute"
            );
            o == null ? this.removeAttribute(this.$$p_d[r].attribute || r) : this.setAttribute(this.$$p_d[r].attribute || r, o);
          }
        this.$$r = !1;
      };
      this.$$c.$$.after_update.push(c), c();
      for (const r in this.$$l)
        for (const o of this.$$l[r]) {
          const f = this.$$c.$on(r, o);
          this.$$l_u.set(o, f);
        }
      this.$$l = {};
    }
  }
  // We don't need this when working within Svelte code, but for compatibility of people using this outside of Svelte
  // and setting attributes through setAttribute etc, this is helpful
  attributeChangedCallback(e, t, s) {
    var i;
    this.$$r || (e = this.$$g_p(e), this.$$d[e] = zt(e, s, this.$$p_d, "toProp"), (i = this.$$c) == null || i.$set({ [e]: this.$$d[e] }));
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
function zt(l, e, t, s) {
  var c;
  const i = (c = t[l]) == null ? void 0 : c.type;
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
function pe(l, e, t, s, i, c) {
  let r = class extends ys {
    constructor() {
      super(l, t, i), this.$$p_d = e;
    }
    static get observedAttributes() {
      return Object.keys(e).map(
        (o) => (e[o].attribute || o).toLowerCase()
      );
    }
  };
  return Object.keys(e).forEach((o) => {
    Object.defineProperty(r.prototype, o, {
      get() {
        return this.$$c && o in this.$$c ? this.$$c[o] : this.$$d[o];
      },
      set(f) {
        var p;
        f = zt(o, f, e), this.$$d[o] = f, (p = this.$$c) == null || p.$set({ [o]: f });
      }
    });
  }), s.forEach((o) => {
    Object.defineProperty(r.prototype, o, {
      get() {
        var f;
        return (f = this.$$c) == null ? void 0 : f[o];
      }
    });
  }), l.element = /** @type {any} */
  r, r;
}
class ve {
  constructor() {
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    Se(this, "$$");
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    Se(this, "$$set");
  }
  /** @returns {void} */
  $destroy() {
    oi(this, 1), this.$destroy = D;
  }
  /**
   * @template {Extract<keyof Events, string>} K
   * @param {K} type
   * @param {((e: Events[K]) => void) | null | undefined} callback
   * @returns {() => void}
   */
  $on(e, t) {
    if (!Xt(t))
      return D;
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
    this.$$set && !Fs(e) && (this.$$.skip_bound = !0, this.$$set(e), this.$$.skip_bound = !1);
  }
}
const fi = "4";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(fi);
function di(l) {
  de(l, "svelte-1tevv97", '.card.svelte-1tevv97{border-radius:14px;border:1px solid #e2e8f0;padding:16px;display:grid;gap:12px;font-family:"Figtree", system-ui, sans-serif;background:#ffffff;box-shadow:0 12px 24px rgba(15, 23, 42, 0.08)}.label.svelte-1tevv97{font-size:14px;color:#0f172a;margin:0}.count.svelte-1tevv97{font-weight:600;font-size:20px;color:#0f172a;margin:0}button.svelte-1tevv97{border:0;border-radius:10px;padding:10px 12px;background:#10b981;color:white;cursor:pointer;font-weight:600}button.svelte-1tevv97:hover{background:#059669}');
}
function ui(l) {
  let e, t, s, i, c, r, o, f, p, u, v, m;
  return {
    c() {
      e = d("div"), t = d("p"), s = z("Hola "), i = z(
        /*name*/
        l[0]
      ), c = y(), r = d("p"), o = z("Count: "), f = z(
        /*count*/
        l[1]
      ), p = y(), u = d("button"), u.textContent = "Emitir evento", a(t, "class", "label svelte-1tevv97"), a(r, "class", "count svelte-1tevv97"), a(u, "type", "button"), a(u, "class", "svelte-1tevv97"), a(e, "class", "card svelte-1tevv97");
    },
    m(h, b) {
      L(h, e, b), n(e, t), n(t, s), n(t, i), n(e, c), n(e, r), n(r, o), n(r, f), n(e, p), n(e, u), v || (m = O(
        u,
        "click",
        /*notify*/
        l[2]
      ), v = !0);
    },
    p(h, [b]) {
      b & /*name*/
      1 && A(
        i,
        /*name*/
        h[0]
      ), b & /*count*/
      2 && A(
        f,
        /*count*/
        h[1]
      );
    },
    i: D,
    o: D,
    d(h) {
      h && S(e), v = !1, m();
    }
  };
}
function pi(l, e, t) {
  let { name: s = "Ada" } = e, { count: i = 2 } = e;
  const c = Ie(), r = () => {
    c("ping", { from: "svelte", count: i });
  };
  return l.$$set = (o) => {
    "name" in o && t(0, s = o.name), "count" in o && t(1, i = o.count);
  }, [s, i, r];
}
class ks extends ve {
  constructor(e) {
    super(), ue(this, e, pi, ui, ee, { name: 0, count: 1 }, di);
  }
  get name() {
    return this.$$.ctx[0];
  }
  set name(e) {
    this.$$set({ name: e }), C();
  }
  get count() {
    return this.$$.ctx[1];
  }
  set count(e) {
    this.$$set({ count: e }), C();
  }
}
pe(ks, { name: {}, count: {} }, [], [], !0);
function vi(l) {
  de(l, "svelte-5733sx", ".card.svelte-5733sx{position:relative;overflow:hidden;border-radius:20px;border:1px solid #d1fae5;background:linear-gradient(145deg, #ffffff, #ecfdf5);padding:20px;min-height:140px;box-shadow:0 16px 36px rgba(15, 23, 42, 0.12)}.glow.svelte-5733sx{position:absolute;inset:-40%;background:radial-gradient(circle at 30% 20%, rgba(16, 185, 129, 0.3), transparent 55%);opacity:0.7;filter:blur(8px)}.content.svelte-5733sx{position:relative;display:grid;gap:8px;color:#0f172a}.title.svelte-5733sx{font-size:16px;font-weight:600;margin:0}.subtitle.svelte-5733sx{font-size:12px;margin:0;color:#64748b}.metrics.svelte-5733sx{margin-top:12px;display:flex;justify-content:space-between;font-size:12px;color:#0f172a}.orbit.svelte-5733sx{position:absolute;inset:-30%;border-radius:999px;border:1px dashed rgba(16, 185, 129, 0.3);animation:svelte-5733sx-orbit 6s linear infinite;opacity:var(--orbit-alpha)}.satellite-orbit.svelte-5733sx{position:absolute;inset:-30%;border-radius:999px;animation:svelte-5733sx-orbit 6s linear infinite}.satellite.svelte-5733sx{position:absolute;width:10px;height:10px;border-radius:999px;background:#34d399;box-shadow:0 0 12px rgba(16, 185, 129, 0.6);top:50%;left:50%;transform:translate(-50%, -50%) translateY(-78px)}@keyframes svelte-5733sx-orbit{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}");
}
function mi(l) {
  let e, t, s, i, c, r, o, f, p, u, v, m, h, b, g, x, q, M, k, _, T, w, j;
  return {
    c() {
      e = d("div"), t = d("div"), s = y(), i = d("div"), c = d("p"), r = z(
        /*title*/
        l[0]
      ), o = y(), f = d("p"), p = z(
        /*subtitle*/
        l[1]
      ), u = y(), v = d("div"), m = d("span"), m.textContent = "Flow", h = y(), b = d("span"), g = z(
        /*flow*/
        l[3]
      ), x = z("%"), q = y(), M = d("div"), M.innerHTML = '<div class="satellite svelte-5733sx"></div>', k = y(), _ = d("div"), a(t, "class", "glow svelte-5733sx"), a(c, "class", "title svelte-5733sx"), a(f, "class", "subtitle svelte-5733sx"), a(v, "class", "metrics svelte-5733sx"), a(i, "class", "content svelte-5733sx"), a(M, "class", "satellite-orbit svelte-5733sx"), a(_, "class", "orbit svelte-5733sx"), a(e, "class", "card svelte-5733sx"), a(e, "style", T = `--orbit-alpha:${/*intensity*/
      l[2]}`), a(e, "role", "button"), a(e, "tabindex", "0");
    },
    m(E, I) {
      L(E, e, I), n(e, t), n(e, s), n(e, i), n(i, c), n(c, r), n(i, o), n(i, f), n(f, p), n(i, u), n(i, v), n(v, m), n(v, h), n(v, b), n(b, g), n(b, x), n(e, q), n(e, M), n(e, k), n(e, _), w || (j = [
        O(
          e,
          "mouseenter",
          /*handleHover*/
          l[4]
        ),
        O(
          e,
          "focus",
          /*handleHover*/
          l[4]
        ),
        O(
          e,
          "keydown",
          /*keydown_handler*/
          l[5]
        )
      ], w = !0);
    },
    p(E, [I]) {
      I & /*title*/
      1 && A(
        r,
        /*title*/
        E[0]
      ), I & /*subtitle*/
      2 && A(
        p,
        /*subtitle*/
        E[1]
      ), I & /*flow*/
      8 && A(
        g,
        /*flow*/
        E[3]
      ), I & /*intensity*/
      4 && T !== (T = `--orbit-alpha:${/*intensity*/
      E[2]}`) && a(e, "style", T);
    },
    i: D,
    o: D,
    d(E) {
      E && S(e), w = !1, ke(j);
    }
  };
}
function gi(l, e, t) {
  let { title: s = "Focus Ring" } = e, { subtitle: i = "Anillo orbital" } = e, { intensity: c = 0.6 } = e, { flow: r = 78 } = e;
  const o = Ie(), f = () => {
    o("hover", { title: s });
  }, p = (u) => {
    (u.key === "Enter" || u.key === " ") && f();
  };
  return l.$$set = (u) => {
    "title" in u && t(0, s = u.title), "subtitle" in u && t(1, i = u.subtitle), "intensity" in u && t(2, c = u.intensity), "flow" in u && t(3, r = u.flow);
  }, [s, i, c, r, f, p];
}
class ws extends ve {
  constructor(e) {
    super(), ue(
      this,
      e,
      gi,
      mi,
      ee,
      {
        title: 0,
        subtitle: 1,
        intensity: 2,
        flow: 3
      },
      vi
    );
  }
  get title() {
    return this.$$.ctx[0];
  }
  set title(e) {
    this.$$set({ title: e }), C();
  }
  get subtitle() {
    return this.$$.ctx[1];
  }
  set subtitle(e) {
    this.$$set({ subtitle: e }), C();
  }
  get intensity() {
    return this.$$.ctx[2];
  }
  set intensity(e) {
    this.$$set({ intensity: e }), C();
  }
  get flow() {
    return this.$$.ctx[3];
  }
  set flow(e) {
    this.$$set({ flow: e }), C();
  }
}
pe(ws, { title: {}, subtitle: {}, intensity: {}, flow: {} }, [], [], !0);
function hi(l) {
  de(l, "svelte-1vzxgvk", ".badge.svelte-1vzxgvk.svelte-1vzxgvk{display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border-radius:999px;border:1px solid transparent;font-size:12px;font-weight:600;letter-spacing:0.02em;cursor:pointer;background:#ecfdf5;color:#065f46}.badge.emerald.svelte-1vzxgvk.svelte-1vzxgvk{border-color:rgba(16, 185, 129, 0.35)}.dot.svelte-1vzxgvk.svelte-1vzxgvk{width:8px;height:8px;border-radius:999px;background:currentColor;box-shadow:0 0 0 rgba(16, 185, 129, 0.6)}.active.svelte-1vzxgvk .dot.svelte-1vzxgvk{animation:svelte-1vzxgvk-pulse 1.8s ease-in-out infinite}@keyframes svelte-1vzxgvk-pulse{0%{box-shadow:0 0 0 0 rgba(16, 185, 129, 0.6)}70%{box-shadow:0 0 0 12px rgba(16, 185, 129, 0)}100%{box-shadow:0 0 0 0 rgba(16, 185, 129, 0)}}");
}
function bi(l) {
  let e, t, s, i, c, r, o;
  return {
    c() {
      e = d("button"), t = d("span"), s = y(), i = z(
        /*label*/
        l[1]
      ), a(t, "class", "dot svelte-1vzxgvk"), a(e, "class", c = nt(`badge ${/*tone*/
      l[2]} ${/*active*/
      l[0] ? "active" : ""}`) + " svelte-1vzxgvk"), a(e, "type", "button");
    },
    m(f, p) {
      L(f, e, p), n(e, t), n(e, s), n(e, i), r || (o = O(
        e,
        "click",
        /*toggle*/
        l[3]
      ), r = !0);
    },
    p(f, [p]) {
      p & /*label*/
      2 && A(
        i,
        /*label*/
        f[1]
      ), p & /*tone, active*/
      5 && c !== (c = nt(`badge ${/*tone*/
      f[2]} ${/*active*/
      f[0] ? "active" : ""}`) + " svelte-1vzxgvk") && a(e, "class", c);
    },
    i: D,
    o: D,
    d(f) {
      f && S(e), r = !1, o();
    }
  };
}
function xi(l, e, t) {
  let { label: s = "Live" } = e, { tone: i = "emerald" } = e, { active: c = !0 } = e;
  const r = Ie(), o = () => {
    t(0, c = !c), r("toggle", { active: c });
  };
  return l.$$set = (f) => {
    "label" in f && t(1, s = f.label), "tone" in f && t(2, i = f.tone), "active" in f && t(0, c = f.active);
  }, [c, s, i, o];
}
class zs extends ve {
  constructor(e) {
    super(), ue(this, e, xi, bi, ee, { label: 1, tone: 2, active: 0 }, hi);
  }
  get label() {
    return this.$$.ctx[1];
  }
  set label(e) {
    this.$$set({ label: e }), C();
  }
  get tone() {
    return this.$$.ctx[2];
  }
  set tone(e) {
    this.$$set({ tone: e }), C();
  }
  get active() {
    return this.$$.ctx[0];
  }
  set active(e) {
    this.$$set({ active: e }), C();
  }
}
pe(zs, { label: {}, tone: {}, active: { type: "Boolean" } }, [], [], !0);
function _i(l) {
  de(l, "svelte-1io8dtn", ".ripple.svelte-1io8dtn{position:relative;overflow:hidden;padding:12px 20px;border-radius:14px;border:none;background:var(--tone);color:#ffffff;font-weight:600;cursor:pointer;box-shadow:0 16px 28px rgba(16, 185, 129, 0.25)}.label.svelte-1io8dtn{position:relative;z-index:1}.wave.svelte-1io8dtn{position:absolute;width:20px;height:20px;border-radius:999px;background:rgba(255, 255, 255, 0.45);transform:translate(-50%, -50%);animation:svelte-1io8dtn-ripple 0.8s ease-out forwards}@keyframes svelte-1io8dtn-ripple{from{opacity:0.7;transform:translate(-50%, -50%) scale(0)}to{opacity:0;transform:translate(-50%, -50%) scale(8)}}");
}
function ul(l, e, t) {
  const s = l.slice();
  return s[7] = e[t], s;
}
function pl(l, e) {
  let t, s, i, c;
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
    m(o, f) {
      L(o, t, f), i || (c = O(t, "animationend", r), i = !0);
    },
    p(o, f) {
      e = o, f & /*ripples*/
      4 && s !== (s = `left:${/*ripple*/
      e[7].x}px; top:${/*ripple*/
      e[7].y}px;`) && a(t, "style", s);
    },
    d(o) {
      o && S(t), i = !1, c();
    }
  };
}
function yi(l) {
  let e, t = [], s = /* @__PURE__ */ new Map(), i, c, r, o, f, p, u = Z(
    /*ripples*/
    l[2]
  );
  const v = (m) => (
    /*ripple*/
    m[7].id
  );
  for (let m = 0; m < u.length; m += 1) {
    let h = ul(l, u, m), b = v(h);
    s.set(b, t[m] = pl(b, h));
  }
  return {
    c() {
      e = d("button");
      for (let m = 0; m < t.length; m += 1)
        t[m].c();
      i = y(), c = d("span"), r = z(
        /*label*/
        l[0]
      ), a(c, "class", "label svelte-1io8dtn"), a(e, "class", "ripple svelte-1io8dtn"), a(e, "type", "button"), a(e, "style", o = `--tone:${/*tone*/
      l[1]}`);
    },
    m(m, h) {
      L(m, e, h);
      for (let b = 0; b < t.length; b += 1)
        t[b] && t[b].m(e, null);
      n(e, i), n(e, c), n(c, r), f || (p = O(
        e,
        "click",
        /*handleClick*/
        l[3]
      ), f = !0);
    },
    p(m, [h]) {
      h & /*ripples, removeRipple*/
      20 && (u = Z(
        /*ripples*/
        m[2]
      ), t = Vt(t, h, v, 1, m, u, s, e, Ft, pl, i, ul)), h & /*label*/
      1 && A(
        r,
        /*label*/
        m[0]
      ), h & /*tone*/
      2 && o !== (o = `--tone:${/*tone*/
      m[1]}`) && a(e, "style", o);
    },
    i: D,
    o: D,
    d(m) {
      m && S(e);
      for (let h = 0; h < t.length; h += 1)
        t[h].d();
      f = !1, p();
    }
  };
}
function ki(l, e, t) {
  let { label: s = "Lanzar onda" } = e, { tone: i = "#10b981" } = e;
  const c = Ie();
  let r = [];
  const o = (u) => {
    const v = u.currentTarget.getBoundingClientRect(), m = u.clientX - v.left, h = u.clientY - v.top, b = Math.random().toString(36).slice(2);
    t(2, r = [...r, { id: b, x: m, y: h }]), c("ripple", { x: m, y: h });
  }, f = (u) => {
    t(2, r = r.filter((v) => v.id !== u));
  }, p = (u) => f(u.id);
  return l.$$set = (u) => {
    "label" in u && t(0, s = u.label), "tone" in u && t(1, i = u.tone);
  }, [s, i, r, o, f, p];
}
class qs extends ve {
  constructor(e) {
    super(), ue(this, e, ki, yi, ee, { label: 0, tone: 1 }, _i);
  }
  get label() {
    return this.$$.ctx[0];
  }
  set label(e) {
    this.$$set({ label: e }), C();
  }
  get tone() {
    return this.$$.ctx[1];
  }
  set tone(e) {
    this.$$set({ tone: e }), C();
  }
}
pe(qs, { label: {}, tone: {} }, [], [], !0);
function wi(l) {
  de(l, "svelte-1jr61rp", ".list.svelte-1jr61rp{border-radius:18px;border:1px solid #e2e8f0;background:#ffffff;padding:16px;display:grid;gap:16px}.header.svelte-1jr61rp{display:flex;justify-content:space-between;align-items:center}.title.svelte-1jr61rp{margin:0;font-size:14px;font-weight:600;color:#0f172a}.subtitle.svelte-1jr61rp{margin:0;font-size:11px;color:#94a3b8}button.svelte-1jr61rp{border:1px solid #d1fae5;background:#ecfdf5;color:#065f46;font-size:12px;padding:6px 10px;border-radius:10px;cursor:pointer}.items.svelte-1jr61rp{display:grid;gap:10px}.item.svelte-1jr61rp{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-radius:12px;background:#f8fafc;color:#0f172a;font-size:13px;animation:svelte-1jr61rp-slide-in 0.5s ease forwards;opacity:0;transform:translateY(6px)}.score.svelte-1jr61rp{font-weight:600}@keyframes svelte-1jr61rp-slide-in{to{opacity:1;transform:translateY(0)}}");
}
function vl(l, e, t) {
  const s = l.slice();
  return s[7] = e[t], s[9] = t, s;
}
function ml(l, e) {
  let t, s, i = (
    /*item*/
    e[7].title + ""
  ), c, r, o, f = (
    /*item*/
    e[7].score + ""
  ), p, u, v, m;
  return {
    key: l,
    first: null,
    c() {
      t = d("div"), s = d("span"), c = z(i), r = y(), o = d("span"), p = z(f), u = z("%"), v = y(), a(o, "class", "score svelte-1jr61rp"), a(t, "class", "item svelte-1jr61rp"), a(t, "style", m = `animation-delay:${/*index*/
      e[9] * /*cadence*/
      e[1]}ms`), this.first = t;
    },
    m(h, b) {
      L(h, t, b), n(t, s), n(s, c), n(t, r), n(t, o), n(o, p), n(o, u), n(t, v);
    },
    p(h, b) {
      e = h, b & /*items*/
      4 && i !== (i = /*item*/
      e[7].title + "") && A(c, i), b & /*items*/
      4 && f !== (f = /*item*/
      e[7].score + "") && A(p, f), b & /*items, cadence*/
      6 && m !== (m = `animation-delay:${/*index*/
      e[9] * /*cadence*/
      e[1]}ms`) && a(t, "style", m);
    },
    d(h) {
      h && S(t);
    }
  };
}
function zi(l) {
  let e, t, s, i, c, r, o, f, p, u, v, m, h = [], b = /* @__PURE__ */ new Map(), g, x, q = Z(
    /*items*/
    l[2]
  );
  const M = (k) => (
    /*item*/
    k[7].id
  );
  for (let k = 0; k < q.length; k += 1) {
    let _ = vl(l, q, k), T = M(_);
    b.set(T, h[k] = ml(T, _));
  }
  return {
    c() {
      e = d("div"), t = d("div"), s = d("div"), i = d("p"), i.textContent = "Stagger list", c = y(), r = d("p"), o = z(
        /*count*/
        l[0]
      ), f = z(" items"), p = y(), u = d("button"), u.textContent = "Actualizar", v = y(), m = d("div");
      for (let k = 0; k < h.length; k += 1)
        h[k].c();
      a(i, "class", "title svelte-1jr61rp"), a(r, "class", "subtitle svelte-1jr61rp"), a(u, "type", "button"), a(u, "class", "svelte-1jr61rp"), a(t, "class", "header svelte-1jr61rp"), a(m, "class", "items svelte-1jr61rp"), a(e, "class", "list svelte-1jr61rp");
    },
    m(k, _) {
      L(k, e, _), n(e, t), n(t, s), n(s, i), n(s, c), n(s, r), n(r, o), n(r, f), n(t, p), n(t, u), n(e, v), n(e, m);
      for (let T = 0; T < h.length; T += 1)
        h[T] && h[T].m(m, null);
      g || (x = O(
        u,
        "click",
        /*handleRefresh*/
        l[3]
      ), g = !0);
    },
    p(k, [_]) {
      _ & /*count*/
      1 && A(
        o,
        /*count*/
        k[0]
      ), _ & /*items, cadence*/
      6 && (q = Z(
        /*items*/
        k[2]
      ), h = Vt(h, _, M, 1, k, q, b, m, Ft, ml, null, vl));
    },
    i: D,
    o: D,
    d(k) {
      k && S(e);
      for (let _ = 0; _ < h.length; _ += 1)
        h[_].d();
      g = !1, x();
    }
  };
}
function qi(l, e, t) {
  let { label: s = "Batch" } = e, { count: i = 5 } = e, { cadence: c = 120 } = e;
  const r = Ie();
  let o = [];
  const f = () => {
    t(2, o = Array.from({ length: i }, (u, v) => ({
      id: `${s}-${v}`,
      title: `${s} ${v + 1}`,
      score: Math.floor(Math.random() * 40) + 60
    }))), r("refresh", { count: i });
  }, p = () => {
    f();
  };
  return bs(f), l.$$set = (u) => {
    "label" in u && t(4, s = u.label), "count" in u && t(0, i = u.count), "cadence" in u && t(1, c = u.cadence);
  }, [i, c, o, p, s];
}
class js extends ve {
  constructor(e) {
    super(), ue(this, e, qi, zi, ee, { label: 4, count: 0, cadence: 1 }, wi);
  }
  get label() {
    return this.$$.ctx[4];
  }
  set label(e) {
    this.$$set({ label: e }), C();
  }
  get count() {
    return this.$$.ctx[0];
  }
  set count(e) {
    this.$$set({ count: e }), C();
  }
  get cadence() {
    return this.$$.ctx[1];
  }
  set cadence(e) {
    this.$$set({ cadence: e }), C();
  }
}
pe(js, { label: {}, count: {}, cadence: {} }, [], [], !0);
function ji(l) {
  de(l, "svelte-1g1qxhj", ".thermo.svelte-1g1qxhj.svelte-1g1qxhj{display:grid;gap:16px;border-radius:18px;border:1px solid #e2e8f0;padding:16px;background:#ffffff}.thermo.frameless.svelte-1g1qxhj.svelte-1g1qxhj{border:none;background:transparent;padding:0;gap:6px;grid-template-columns:1fr;align-items:center;text-align:center}.header.svelte-1g1qxhj.svelte-1g1qxhj{display:flex;justify-content:space-between;align-items:center;gap:12px}.thermo.frameless.svelte-1g1qxhj .header.svelte-1g1qxhj{flex-direction:column;align-items:center;justify-content:center;min-width:0;text-align:center}.title.svelte-1g1qxhj.svelte-1g1qxhj{margin:0;font-size:14px;font-weight:600;color:#0f172a}.subtitle.svelte-1g1qxhj.svelte-1g1qxhj{margin:0;font-size:12px;color:#64748b}.meter.svelte-1g1qxhj.svelte-1g1qxhj{position:relative;height:160px;display:grid;place-items:center}.thermo.frameless.svelte-1g1qxhj .meter.svelte-1g1qxhj{align-self:start;width:52px;justify-self:center}.thermo.frameless.svelte-1g1qxhj .meter.svelte-1g1qxhj{height:120px}.tube.svelte-1g1qxhj.svelte-1g1qxhj{position:relative;width:24px;height:140px;border-radius:14px;background:#f1f5f9;border:1px solid #e2e8f0;overflow:hidden;box-shadow:inset 0 6px 16px rgba(15, 23, 42, 0.08)}.thermo.frameless.svelte-1g1qxhj .tube.svelte-1g1qxhj{height:110px}.fill.svelte-1g1qxhj.svelte-1g1qxhj{position:absolute;left:0;right:0;bottom:0;height:var(--level);background:linear-gradient(180deg, #ffffff, var(--fill));transition:height 0.8s cubic-bezier(0.22, 1, 0.36, 1)}.gloss.svelte-1g1qxhj.svelte-1g1qxhj{position:absolute;left:3px;top:8px;width:6px;height:calc(100% - 16px);border-radius:999px;background:rgba(255, 255, 255, 0.6);animation:svelte-1g1qxhj-shimmer 2.4s ease-in-out infinite}.bulb.svelte-1g1qxhj.svelte-1g1qxhj{position:absolute;bottom:-6px;width:44px;height:44px;border-radius:999px;background:radial-gradient(circle at 30% 30%, #ffffff, var(--fill));border:2px solid rgba(226, 232, 240, 0.9);box-shadow:0 10px 24px var(--glow);animation:svelte-1g1qxhj-pulse 2.2s ease-in-out infinite}.thermo.frameless.svelte-1g1qxhj .bulb.svelte-1g1qxhj{width:36px;height:36px}@keyframes svelte-1g1qxhj-shimmer{0%,100%{opacity:0.35;transform:translateY(0)}50%{opacity:0.7;transform:translateY(-8px)}}@keyframes svelte-1g1qxhj-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}");
}
function Ci(l) {
  let e, t, s, i, c, r, o, f, p, u, v, m;
  return {
    c() {
      e = d("div"), t = d("div"), s = d("div"), i = d("p"), c = z(
        /*label*/
        l[0]
      ), r = y(), o = d("p"), f = z(
        /*subtitleText*/
        l[3]
      ), p = y(), u = d("div"), u.innerHTML = '<div class="tube svelte-1g1qxhj"><div class="fill svelte-1g1qxhj"></div> <div class="gloss svelte-1g1qxhj"></div></div> <div class="bulb svelte-1g1qxhj"></div>', a(i, "class", "title svelte-1g1qxhj"), a(o, "class", "subtitle svelte-1g1qxhj"), a(t, "class", "header svelte-1g1qxhj"), a(u, "class", "meter svelte-1g1qxhj"), a(e, "class", v = nt(`thermo ${/*frameless*/
      l[1] ? "frameless" : ""}`) + " svelte-1g1qxhj"), a(e, "style", m = `--level:${/*percent*/
      l[2]}%; --fill:${/*fillColor*/
      l[5]}; --glow:${/*glowColor*/
      l[4]};`);
    },
    m(h, b) {
      L(h, e, b), n(e, t), n(t, s), n(s, i), n(i, c), n(s, r), n(s, o), n(o, f), n(e, p), n(e, u);
    },
    p(h, [b]) {
      b & /*label*/
      1 && A(
        c,
        /*label*/
        h[0]
      ), b & /*subtitleText*/
      8 && A(
        f,
        /*subtitleText*/
        h[3]
      ), b & /*frameless*/
      2 && v !== (v = nt(`thermo ${/*frameless*/
      h[1] ? "frameless" : ""}`) + " svelte-1g1qxhj") && a(e, "class", v), b & /*percent, fillColor, glowColor*/
      52 && m !== (m = `--level:${/*percent*/
      h[2]}%; --fill:${/*fillColor*/
      h[5]}; --glow:${/*glowColor*/
      h[4]};`) && a(e, "style", m);
    },
    i: D,
    o: D,
    d(h) {
      h && S(e);
    }
  };
}
function Si(l, e, t) {
  let s, i, c, r, o, f, p, u, v, { label: m = "Temperatura" } = e, { value: h = 22 } = e, { min: b = 0 } = e, { max: g = 40 } = e, { subtitle: x = "" } = e, { frameless: q = !1 } = e;
  const M = (T, w, j) => Math.min(j, Math.max(w, T)), k = (T, w, j) => Math.round(T + (w - T) * j), _ = (T, w, j) => `rgb(${T}, ${w}, ${j})`;
  return l.$$set = (T) => {
    "label" in T && t(0, m = T.label), "value" in T && t(6, h = T.value), "min" in T && t(7, b = T.min), "max" in T && t(8, g = T.max), "subtitle" in T && t(9, x = T.subtitle), "frameless" in T && t(1, q = T.frameless);
  }, l.$$.update = () => {
    l.$$.dirty & /*value, min, max*/
    448 && t(10, s = M(h, b, g)), l.$$.dirty & /*safeValue, min, max*/
    1408 && t(12, i = (s - b) / (g - b || 1)), l.$$.dirty & /*ratio*/
    4096 && t(2, c = Math.round(i * 100)), l.$$.dirty & /*cool, warm, ratio*/
    28672 && t(11, f = {
      r: k(o.r, r.r, i),
      g: k(o.g, r.g, i),
      b: k(o.b, r.b, i)
    }), l.$$.dirty & /*mix*/
    2048 && t(5, p = _(f.r, f.g, f.b)), l.$$.dirty & /*mix*/
    2048 && t(4, u = `rgba(${f.r}, ${f.g}, ${f.b}, 0.45)`), l.$$.dirty & /*subtitle, safeValue, percent*/
    1540 && t(3, v = x || `${s}C - ${c}%`);
  }, t(13, r = { r: 239, g: 68, b: 68 }), t(14, o = { r: 34, g: 197, b: 94 }), [
    m,
    q,
    c,
    v,
    u,
    p,
    h,
    b,
    g,
    x,
    s,
    f,
    i,
    r,
    o
  ];
}
class Cs extends ve {
  constructor(e) {
    super(), ue(
      this,
      e,
      Si,
      Ci,
      ee,
      {
        label: 0,
        value: 6,
        min: 7,
        max: 8,
        subtitle: 9,
        frameless: 1
      },
      ji
    );
  }
  get label() {
    return this.$$.ctx[0];
  }
  set label(e) {
    this.$$set({ label: e }), C();
  }
  get value() {
    return this.$$.ctx[6];
  }
  set value(e) {
    this.$$set({ value: e }), C();
  }
  get min() {
    return this.$$.ctx[7];
  }
  set min(e) {
    this.$$set({ min: e }), C();
  }
  get max() {
    return this.$$.ctx[8];
  }
  set max(e) {
    this.$$set({ max: e }), C();
  }
  get subtitle() {
    return this.$$.ctx[9];
  }
  set subtitle(e) {
    this.$$set({ subtitle: e }), C();
  }
  get frameless() {
    return this.$$.ctx[1];
  }
  set frameless(e) {
    this.$$set({ frameless: e }), C();
  }
}
pe(Cs, { label: {}, value: {}, min: {}, max: {}, subtitle: {}, frameless: { type: "Boolean" } }, [], [], !0);
function Li(l) {
  de(l, "svelte-q2ay9k", `.podium.svelte-q2ay9k.svelte-q2ay9k{position:relative;border-radius:18px;border:1px solid #e2e8f0;background:linear-gradient(180deg, #ffffff, #f8fafc);padding:24px 18px 16px;height:220px;display:grid;align-items:end}.line.svelte-q2ay9k.svelte-q2ay9k{position:absolute;left:16px;right:16px;bottom:24px;height:2px;background:linear-gradient(90deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.6))}.controls.svelte-q2ay9k.svelte-q2ay9k{position:absolute;top:14px;right:14px;display:flex;gap:8px}.reset.svelte-q2ay9k.svelte-q2ay9k,.swap.svelte-q2ay9k.svelte-q2ay9k{border:1px solid rgba(16, 185, 129, 0.3);background:#ecfdf5;color:#065f46;font-size:11px;padding:6px 10px;border-radius:999px;cursor:pointer}.reset.svelte-q2ay9k.svelte-q2ay9k:hover,.swap.svelte-q2ay9k.svelte-q2ay9k:hover{background:#d1fae5}.stack.svelte-q2ay9k.svelte-q2ay9k{position:relative;display:grid;grid-template-columns:repeat(3, 1fr);align-items:end;gap:14px;height:100%;z-index:1}.bar.svelte-q2ay9k.svelte-q2ay9k{position:relative;border-radius:14px 14px 6px 6px;background:#d1fae5;color:#065f46;display:grid;place-items:center;font-size:14px;font-weight:600;transform-origin:bottom;animation:svelte-q2ay9k-rise var(--dur) cubic-bezier(0.22, 1, 0.36, 1) forwards;transform:scaleY(0)}.bar.svelte-q2ay9k span.svelte-q2ay9k{opacity:0;animation:svelte-q2ay9k-fade-in 0.5s ease forwards;animation-delay:calc(var(--dur) * 0.7)}.bar.svelte-q2ay9k.svelte-q2ay9k::after{content:"";position:absolute;inset:8px;border-radius:10px;background:linear-gradient(120deg, rgba(255, 255, 255, 0.4), transparent 60%);opacity:0;animation:svelte-q2ay9k-sweep 1.6s ease forwards;animation-delay:calc(var(--dur) * 0.4)}.bar.first.svelte-q2ay9k.svelte-q2ay9k{background:linear-gradient(180deg, #10b981, #34d399);color:#ffffff;box-shadow:0 14px 24px rgba(16, 185, 129, 0.35)}.bar.second.svelte-q2ay9k.svelte-q2ay9k{background:linear-gradient(180deg, #34d399, #6ee7b7)}.bar.third.svelte-q2ay9k.svelte-q2ay9k{background:linear-gradient(180deg, #bbf7d0, #ecfdf5)}.podium[data-play].svelte-q2ay9k .bar.svelte-q2ay9k{animation:svelte-q2ay9k-rise var(--dur) cubic-bezier(0.22, 1, 0.36, 1) forwards,
      svelte-q2ay9k-settle 0.35s ease-out forwards;animation-delay:0s, calc(var(--dur) * 0.9)}.podium[data-play].svelte-q2ay9k .bar span.svelte-q2ay9k{animation:svelte-q2ay9k-fade-in 0.5s ease forwards;animation-delay:calc(var(--dur) * 0.7)}.podium[data-play].svelte-q2ay9k .bar.svelte-q2ay9k::after{animation:svelte-q2ay9k-sweep 1.6s ease forwards;animation-delay:calc(var(--dur) * 0.4)}@keyframes svelte-q2ay9k-rise{to{transform:scaleY(1)}}@keyframes svelte-q2ay9k-settle{0%{transform:scaleY(1.02)}100%{transform:scaleY(1)}}@keyframes svelte-q2ay9k-fade-in{to{opacity:1}}@keyframes svelte-q2ay9k-sweep{0%{opacity:0;transform:translateY(10%)}50%{opacity:0.5}100%{opacity:0;transform:translateY(-20%)}}`);
}
function gl(l, e, t) {
  const s = l.slice();
  return s[12] = e[t], s;
}
function hl(l, e) {
  let t, s, i = (
    /*item*/
    e[12].label + ""
  ), c, r, o, f;
  return {
    key: l,
    first: null,
    c() {
      t = d("div"), s = d("span"), c = z(i), r = y(), a(s, "class", "svelte-q2ay9k"), a(t, "class", o = nt(`bar ${/*item*/
      e[12].className}`) + " svelte-q2ay9k"), a(t, "style", f = `height:${/*item*/
      e[12].height}%; --dur:${/*item*/
      e[12].duration}s;`), this.first = t;
    },
    m(p, u) {
      L(p, t, u), n(t, s), n(s, c), n(t, r);
    },
    p(p, u) {
      e = p, u & /*items*/
      2 && i !== (i = /*item*/
      e[12].label + "") && A(c, i), u & /*items*/
      2 && o !== (o = nt(`bar ${/*item*/
      e[12].className}`) + " svelte-q2ay9k") && a(t, "class", o), u & /*items*/
      2 && f !== (f = `height:${/*item*/
      e[12].height}%; --dur:${/*item*/
      e[12].duration}s;`) && a(t, "style", f);
    },
    d(p) {
      p && S(t);
    }
  };
}
function bl(l) {
  let e, t = [], s = /* @__PURE__ */ new Map(), i = Z(
    /*items*/
    l[1]
  );
  const c = (r) => (
    /*item*/
    r[12].key
  );
  for (let r = 0; r < i.length; r += 1) {
    let o = gl(l, i, r), f = c(o);
    s.set(f, t[r] = hl(f, o));
  }
  return {
    c() {
      e = d("div");
      for (let r = 0; r < t.length; r += 1)
        t[r].c();
      a(e, "class", "stack svelte-q2ay9k");
    },
    m(r, o) {
      L(r, e, o);
      for (let f = 0; f < t.length; f += 1)
        t[f] && t[f].m(e, null);
    },
    p(r, o) {
      o & /*items*/
      2 && (i = Z(
        /*items*/
        r[1]
      ), t = Vt(t, o, c, 1, r, i, s, e, Ft, hl, null, gl));
    },
    d(r) {
      r && S(e);
      for (let o = 0; o < t.length; o += 1)
        t[o].d();
    }
  };
}
function Ti(l) {
  let e, t, s, i, c, r, o, f, p = (
    /*playId*/
    l[0]
  ), u, v, m = bl(l);
  return {
    c() {
      e = d("div"), t = d("div"), s = y(), i = d("div"), c = d("button"), c.textContent = "Reiniciar", r = y(), o = d("button"), o.textContent = "Intercalar", f = y(), m.c(), a(t, "class", "line svelte-q2ay9k"), a(c, "class", "reset svelte-q2ay9k"), a(c, "type", "button"), a(o, "class", "swap svelte-q2ay9k"), a(o, "type", "button"), a(i, "class", "controls svelte-q2ay9k"), a(e, "class", "podium svelte-q2ay9k"), a(
        e,
        "data-play",
        /*playId*/
        l[0]
      );
    },
    m(h, b) {
      L(h, e, b), n(e, t), n(e, s), n(e, i), n(i, c), n(i, r), n(i, o), n(e, f), m.m(e, null), u || (v = [
        O(
          c,
          "click",
          /*reset*/
          l[2]
        ),
        O(
          o,
          "click",
          /*cycle*/
          l[3]
        )
      ], u = !0);
    },
    p(h, [b]) {
      b & /*playId*/
      1 && ee(p, p = /*playId*/
      h[0]) ? (m.d(1), m = bl(h), m.c(), m.m(e, null)) : m.p(h, b), b & /*playId*/
      1 && a(
        e,
        "data-play",
        /*playId*/
        h[0]
      );
    },
    i: D,
    o: D,
    d(h) {
      h && S(e), m.d(h), u = !1, ke(v);
    }
  };
}
function Ei(l, e, t) {
  let s, { first: i = 82 } = e, { second: c = 64 } = e, { third: r = 48 } = e, { baseDuration: o = 0.9 } = e, { delayStep: f = 0.15 } = e, p = 0, u = ["second", "first", "third"];
  const v = {
    first: { label: "1", className: "first" },
    second: { label: "2", className: "second" },
    third: { label: "3", className: "third" }
  }, m = (g) => g === "first" ? i : g === "second" ? c : r, h = () => {
    t(0, p += 1);
  }, b = () => {
    t(9, u = [u[1], u[2], u[0]]), t(0, p += 1);
  };
  return l.$$set = (g) => {
    "first" in g && t(4, i = g.first), "second" in g && t(5, c = g.second), "third" in g && t(6, r = g.third), "baseDuration" in g && t(7, o = g.baseDuration), "delayStep" in g && t(8, f = g.delayStep);
  }, l.$$.update = () => {
    l.$$.dirty & /*order, baseDuration, delayStep*/
    896 && t(1, s = u.map((g, x) => ({
      key: g,
      label: v[g].label,
      className: v[g].className,
      height: m(g),
      duration: o + x * f * 2
    })));
  }, [
    p,
    s,
    h,
    b,
    i,
    c,
    r,
    o,
    f,
    u
  ];
}
class Ss extends ve {
  constructor(e) {
    super(), ue(
      this,
      e,
      Ei,
      Ti,
      ee,
      {
        first: 4,
        second: 5,
        third: 6,
        baseDuration: 7,
        delayStep: 8
      },
      Li
    );
  }
  get first() {
    return this.$$.ctx[4];
  }
  set first(e) {
    this.$$set({ first: e }), C();
  }
  get second() {
    return this.$$.ctx[5];
  }
  set second(e) {
    this.$$set({ second: e }), C();
  }
  get third() {
    return this.$$.ctx[6];
  }
  set third(e) {
    this.$$set({ third: e }), C();
  }
  get baseDuration() {
    return this.$$.ctx[7];
  }
  set baseDuration(e) {
    this.$$set({ baseDuration: e }), C();
  }
  get delayStep() {
    return this.$$.ctx[8];
  }
  set delayStep(e) {
    this.$$set({ delayStep: e }), C();
  }
}
pe(Ss, { first: {}, second: {}, third: {}, baseDuration: {}, delayStep: {} }, [], [], !0);
function Ai(l) {
  de(l, "svelte-1jqbzw8", ".balloon-card.svelte-1jqbzw8{border-radius:18px;border:1px solid #e2e8f0;background:linear-gradient(180deg, #ffffff, #f8fafc);padding:16px;height:220px;display:grid;place-items:center}.scene.svelte-1jqbzw8{position:relative;width:160px;height:180px}.rope.svelte-1jqbzw8{position:absolute;left:50%;bottom:14px;width:2px;height:90px;background:var(--rope);transform-origin:bottom;transform:translateX(-50%);animation:svelte-1jqbzw8-rope-sway var(--speed) ease-in-out infinite}.anchor.svelte-1jqbzw8{position:absolute;left:50%;bottom:0;width:18px;height:18px;border-radius:999px;background:#e2e8f0;border:2px solid #cbd5f5;transform:translateX(-50%)}.balloon.svelte-1jqbzw8{position:absolute;left:50%;bottom:96px;width:64px;height:74px;border-radius:50% 50% 46% 46%;background:radial-gradient(circle at 35% 30%, #ffffff, var(--balloon));box-shadow:0 16px 26px rgba(16, 185, 129, 0.2);transform-origin:bottom center;transform:translateX(-50%);animation:svelte-1jqbzw8-float var(--speed) ease-in-out infinite}.string.svelte-1jqbzw8{position:absolute;left:50%;bottom:-26px;width:2px;height:26px;background:var(--rope);transform:translateX(-50%)}@keyframes svelte-1jqbzw8-float{0%,100%{transform:translateX(-50%) translateY(0) rotate(0deg)}50%{transform:translateX(-50%) translateY(calc(var(--lift) * -1)) rotate(var(--sway))}}@keyframes svelte-1jqbzw8-rope-sway{0%,100%{transform:translateX(-50%) rotate(0deg)}50%{transform:translateX(-50%) rotate(calc(var(--sway) * -0.4))}}");
}
function Mi(l) {
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
    m(i, c) {
      L(i, e, c), n(e, t);
    },
    p(i, [c]) {
      c & /*lift, sway, speed, color, rope*/
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
    i: D,
    o: D,
    d(i) {
      i && S(e);
    }
  };
}
function Ni(l, e, t) {
  let { lift: s = 18 } = e, { sway: i = 6 } = e, { speed: c = 5.5 } = e, { color: r = "#10b981" } = e, { rope: o = "#94a3b8" } = e;
  return l.$$set = (f) => {
    "lift" in f && t(0, s = f.lift), "sway" in f && t(1, i = f.sway), "speed" in f && t(2, c = f.speed), "color" in f && t(3, r = f.color), "rope" in f && t(4, o = f.rope);
  }, [s, i, c, r, o];
}
class Ls extends ve {
  constructor(e) {
    super(), ue(
      this,
      e,
      Ni,
      Mi,
      ee,
      {
        lift: 0,
        sway: 1,
        speed: 2,
        color: 3,
        rope: 4
      },
      Ai
    );
  }
  get lift() {
    return this.$$.ctx[0];
  }
  set lift(e) {
    this.$$set({ lift: e }), C();
  }
  get sway() {
    return this.$$.ctx[1];
  }
  set sway(e) {
    this.$$set({ sway: e }), C();
  }
  get speed() {
    return this.$$.ctx[2];
  }
  set speed(e) {
    this.$$set({ speed: e }), C();
  }
  get color() {
    return this.$$.ctx[3];
  }
  set color(e) {
    this.$$set({ color: e }), C();
  }
  get rope() {
    return this.$$.ctx[4];
  }
  set rope(e) {
    this.$$set({ rope: e }), C();
  }
}
pe(Ls, { lift: {}, sway: {}, speed: {}, color: {}, rope: {} }, [], [], !0);
function Ii(l) {
  de(l, "svelte-9cnfqg", '.wrapper.svelte-9cnfqg.svelte-9cnfqg{display:grid;grid-template-columns:28px 1fr 28px;align-items:stretch;gap:12px}.nav.svelte-9cnfqg.svelte-9cnfqg{border:1px solid #e2e8f0;background:#f8fafc;border-radius:14px;display:grid;place-items:center;height:100%;cursor:pointer;transition:transform 0.2s ease, background 0.2s ease;position:relative;overflow:hidden}.nav.svelte-9cnfqg.svelte-9cnfqg:hover{background:#e2e8f0;transform:translateY(-2px)}.nav.svelte-9cnfqg.svelte-9cnfqg::after{content:"";position:absolute;inset:0;background:linear-gradient(120deg, transparent, rgba(16, 185, 129, 0.25), transparent);transform:translateX(-120%);transition:transform 0.45s ease}.nav.svelte-9cnfqg.svelte-9cnfqg:hover::after{transform:translateX(120%)}.chevron.svelte-9cnfqg.svelte-9cnfqg{width:10px;height:28px;border-right:2px solid #475569;border-bottom:2px solid #475569;transform:rotate(-45deg)}.nav.left.svelte-9cnfqg .chevron.svelte-9cnfqg{transform:rotate(135deg)}.card.svelte-9cnfqg.svelte-9cnfqg{display:grid;grid-template-columns:72px 1fr;gap:16px;padding:18px 20px;border-radius:20px;border:1px solid #e2e8f0;background:#ffffff;box-shadow:0 14px 26px rgba(15, 23, 42, 0.08);transition:transform 0.35s ease, box-shadow 0.35s ease}.card.svelte-9cnfqg.svelte-9cnfqg:hover{transform:translateY(-4px);box-shadow:0 18px 34px rgba(15, 23, 42, 0.16)}.icon.svelte-9cnfqg.svelte-9cnfqg{width:56px;height:56px;border-radius:16px;background:#f8fafc;display:grid;place-items:center}.ladder.svelte-9cnfqg.svelte-9cnfqg{width:28px;height:36px;border:3px solid #7c5c4f;border-left-width:5px;border-right-width:5px;border-radius:6px;position:relative}.ladder.svelte-9cnfqg span.svelte-9cnfqg{position:absolute;left:2px;right:2px;height:4px;background:#7c5c4f;border-radius:999px;animation:svelte-9cnfqg-rung 2.8s ease-in-out infinite}.ladder.svelte-9cnfqg span.svelte-9cnfqg:nth-child(1){top:6px;animation-delay:0s}.ladder.svelte-9cnfqg span.svelte-9cnfqg:nth-child(2){top:14px;animation-delay:0.2s}.ladder.svelte-9cnfqg span.svelte-9cnfqg:nth-child(3){top:22px;animation-delay:0.4s}.ladder.svelte-9cnfqg span.svelte-9cnfqg:nth-child(4){top:30px;animation-delay:0.6s}.content.svelte-9cnfqg.svelte-9cnfqg{display:grid;gap:8px}.panel.svelte-9cnfqg.svelte-9cnfqg{animation:svelte-9cnfqg-slide-in 0.4s ease}.row.svelte-9cnfqg.svelte-9cnfqg{display:flex;align-items:center;justify-content:space-between;gap:12px}.title.svelte-9cnfqg.svelte-9cnfqg{display:flex;align-items:baseline;gap:12px}.title.svelte-9cnfqg strong.svelte-9cnfqg{font-size:18px;color:#0f172a}.title.svelte-9cnfqg span.svelte-9cnfqg{font-size:14px;color:#64748b}.level-text.svelte-9cnfqg.svelte-9cnfqg{font-size:14px;color:#64748b;animation:svelte-9cnfqg-level-pop 0.35s ease}.pill.svelte-9cnfqg.svelte-9cnfqg{padding:6px 14px;background:#eef2ff;color:#1e3a8a;border-radius:999px;font-size:12px;font-weight:600}.desc.svelte-9cnfqg.svelte-9cnfqg{margin:0;font-size:14px;color:#0f172a}.meta.svelte-9cnfqg.svelte-9cnfqg{font-size:13px;color:#475569}.xp.svelte-9cnfqg.svelte-9cnfqg{font-weight:600;color:#047857}.progress.svelte-9cnfqg.svelte-9cnfqg{position:relative;height:12px;border-radius:999px;background:#f1f5f9;overflow:hidden}.bar.svelte-9cnfqg.svelte-9cnfqg{height:100%;width:var(--fill);background:linear-gradient(90deg, #10b981, #34d399);transition:width 0.8s cubic-bezier(0.22, 1, 0.36, 1)}.glow.svelte-9cnfqg.svelte-9cnfqg{position:absolute;inset:0;background:linear-gradient(90deg, rgba(16, 185, 129, 0), rgba(16, 185, 129, 0.35), rgba(16, 185, 129, 0));transform:translateX(-100%);animation:svelte-9cnfqg-sweep 3.2s ease-in-out infinite}@keyframes svelte-9cnfqg-sweep{0%,60%{transform:translateX(-100%)}100%{transform:translateX(100%)}}@keyframes svelte-9cnfqg-level-pop{0%{opacity:0;transform:translateY(4px)}100%{opacity:1;transform:translateY(0)}}@keyframes svelte-9cnfqg-rung{0%,100%{opacity:0.6}50%{opacity:1}}@keyframes svelte-9cnfqg-slide-in{from{opacity:0;transform:translateX(calc(var(--dir) * 12px))}to{opacity:1;transform:translateX(0)}}');
}
function xl(l) {
  let e, t, s, i, c, r, o, f, p, u, v, m, h, b, g, x, q, M, k, _, T, w, j, E, I, B, V, R, U, P, N, J, re, Q, te;
  return {
    c() {
      e = d("div"), t = d("div"), s = d("div"), i = d("strong"), c = z(
        /*title*/
        l[0]
      ), r = y(), o = d("span"), f = z("Nivel "), p = z(
        /*activeLevel*/
        l[4]
      ), u = z("/"), v = z(
        /*safeLevelTotal*/
        l[5]
      ), m = y(), h = d("div"), b = z(
        /*status*/
        l[3]
      ), g = y(), x = d("p"), q = z(
        /*description*/
        l[1]
      ), M = y(), k = d("div"), _ = d("span"), T = z("Progreso: "), w = z(
        /*safeProgress*/
        l[7]
      ), j = z(" / "), E = z(
        /*safeTotal*/
        l[6]
      ), I = y(), B = d("span"), V = z("+"), R = z(
        /*xp*/
        l[2]
      ), U = z(" XP"), P = y(), N = d("div"), J = d("div"), Q = y(), te = d("div"), a(i, "class", "svelte-9cnfqg"), a(o, "class", "level-text svelte-9cnfqg"), a(s, "class", "title svelte-9cnfqg"), a(h, "class", "pill svelte-9cnfqg"), a(t, "class", "row svelte-9cnfqg"), a(x, "class", "desc svelte-9cnfqg"), a(B, "class", "xp svelte-9cnfqg"), a(k, "class", "row meta svelte-9cnfqg"), a(J, "class", "bar svelte-9cnfqg"), a(J, "style", re = `--fill:${/*percent*/
      l[9]}%`), a(te, "class", "glow svelte-9cnfqg"), a(N, "class", "progress svelte-9cnfqg"), a(e, "class", "panel svelte-9cnfqg");
    },
    m(W, G) {
      L(W, e, G), n(e, t), n(t, s), n(s, i), n(i, c), n(s, r), n(s, o), n(o, f), n(o, p), n(o, u), n(o, v), n(t, m), n(t, h), n(h, b), n(e, g), n(e, x), n(x, q), n(e, M), n(e, k), n(k, _), n(_, T), n(_, w), n(_, j), n(_, E), n(k, I), n(k, B), n(B, V), n(B, R), n(B, U), n(e, P), n(e, N), n(N, J), n(N, Q), n(N, te);
    },
    p(W, G) {
      G & /*title*/
      1 && A(
        c,
        /*title*/
        W[0]
      ), G & /*activeLevel*/
      16 && A(
        p,
        /*activeLevel*/
        W[4]
      ), G & /*safeLevelTotal*/
      32 && A(
        v,
        /*safeLevelTotal*/
        W[5]
      ), G & /*status*/
      8 && A(
        b,
        /*status*/
        W[3]
      ), G & /*description*/
      2 && A(
        q,
        /*description*/
        W[1]
      ), G & /*safeProgress*/
      128 && A(
        w,
        /*safeProgress*/
        W[7]
      ), G & /*safeTotal*/
      64 && A(
        E,
        /*safeTotal*/
        W[6]
      ), G & /*xp*/
      4 && A(
        R,
        /*xp*/
        W[2]
      ), G & /*percent*/
      512 && re !== (re = `--fill:${/*percent*/
      W[9]}%`) && a(J, "style", re);
    },
    d(W) {
      W && S(e);
    }
  };
}
function Pi(l) {
  let e, t, s, i, c, r, o, f = (
    /*activeLevel*/
    l[4]
  ), p, u, v, m, h, b = xl(l);
  return {
    c() {
      e = d("div"), t = d("button"), t.innerHTML = '<span class="chevron svelte-9cnfqg"></span>', s = y(), i = d("div"), c = d("div"), c.innerHTML = '<div class="ladder svelte-9cnfqg"><span class="svelte-9cnfqg"></span> <span class="svelte-9cnfqg"></span> <span class="svelte-9cnfqg"></span> <span class="svelte-9cnfqg"></span></div>', r = y(), o = d("div"), b.c(), u = y(), v = d("button"), v.innerHTML = '<span class="chevron svelte-9cnfqg"></span>', a(t, "class", "nav left svelte-9cnfqg"), a(t, "type", "button"), a(t, "aria-label", "Nivel anterior"), a(c, "class", "icon svelte-9cnfqg"), a(o, "class", "content svelte-9cnfqg"), a(o, "style", p = `--dir:${/*slideDir*/
      l[8]}`), a(i, "class", "card svelte-9cnfqg"), a(v, "class", "nav right svelte-9cnfqg"), a(v, "type", "button"), a(v, "aria-label", "Nivel siguiente"), a(e, "class", "wrapper svelte-9cnfqg");
    },
    m(g, x) {
      L(g, e, x), n(e, t), n(e, s), n(e, i), n(i, c), n(i, r), n(i, o), b.m(o, null), n(e, u), n(e, v), m || (h = [
        O(
          t,
          "click",
          /*click_handler*/
          l[17]
        ),
        O(
          v,
          "click",
          /*click_handler_1*/
          l[18]
        )
      ], m = !0);
    },
    p(g, [x]) {
      x & /*activeLevel*/
      16 && ee(f, f = /*activeLevel*/
      g[4]) ? (b.d(1), b = xl(g), b.c(), b.m(o, null)) : b.p(g, x), x & /*slideDir*/
      256 && p !== (p = `--dir:${/*slideDir*/
      g[8]}`) && a(o, "style", p);
    },
    i: D,
    o: D,
    d(g) {
      g && S(e), b.d(g), m = !1, ke(h);
    }
  };
}
function Ri(l, e, t) {
  let s, i, c, r, o, { title: f = "Nivel 5" } = e, { subtitle: p = "Nivel 1/3" } = e, { description: u = "Alcanza nivel 5 de usuario." } = e, { progress: v = 4 } = e, { total: m = 5 } = e, { xp: h = 15 } = e, { status: b = "En progreso" } = e, { levelIndex: g = 1 } = e, { levelTotal: x = 3 } = e;
  const q = (j, E, I) => Math.min(I, Math.max(E, j));
  let M = q(g, 1, o), k = 1;
  const _ = (j) => {
    t(8, k = j >= 0 ? 1 : -1), t(4, M = q(M + j, 1, o));
  }, T = () => _(-1), w = () => _(1);
  return l.$$set = (j) => {
    "title" in j && t(0, f = j.title), "subtitle" in j && t(11, p = j.subtitle), "description" in j && t(1, u = j.description), "progress" in j && t(12, v = j.progress), "total" in j && t(13, m = j.total), "xp" in j && t(2, h = j.xp), "status" in j && t(3, b = j.status), "levelIndex" in j && t(14, g = j.levelIndex), "levelTotal" in j && t(15, x = j.levelTotal);
  }, l.$$.update = () => {
    l.$$.dirty & /*total*/
    8192 && t(6, s = Math.max(1, m)), l.$$.dirty & /*progress, safeTotal*/
    4160 && t(7, i = q(v, 0, s)), l.$$.dirty & /*safeProgress, safeTotal*/
    192 && t(16, c = i / s), l.$$.dirty & /*ratio*/
    65536 && t(9, r = Math.round(c * 100)), l.$$.dirty & /*levelTotal*/
    32768 && t(5, o = Math.max(1, x)), l.$$.dirty & /*levelIndex, activeLevel, safeLevelTotal*/
    16432 && g !== M && t(4, M = q(g, 1, o));
  }, [
    f,
    u,
    h,
    b,
    M,
    o,
    s,
    i,
    k,
    r,
    _,
    p,
    v,
    m,
    g,
    x,
    c,
    T,
    w
  ];
}
class Ts extends ve {
  constructor(e) {
    super(), ue(
      this,
      e,
      Ri,
      Pi,
      ee,
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
      Ii
    );
  }
  get title() {
    return this.$$.ctx[0];
  }
  set title(e) {
    this.$$set({ title: e }), C();
  }
  get subtitle() {
    return this.$$.ctx[11];
  }
  set subtitle(e) {
    this.$$set({ subtitle: e }), C();
  }
  get description() {
    return this.$$.ctx[1];
  }
  set description(e) {
    this.$$set({ description: e }), C();
  }
  get progress() {
    return this.$$.ctx[12];
  }
  set progress(e) {
    this.$$set({ progress: e }), C();
  }
  get total() {
    return this.$$.ctx[13];
  }
  set total(e) {
    this.$$set({ total: e }), C();
  }
  get xp() {
    return this.$$.ctx[2];
  }
  set xp(e) {
    this.$$set({ xp: e }), C();
  }
  get status() {
    return this.$$.ctx[3];
  }
  set status(e) {
    this.$$set({ status: e }), C();
  }
  get levelIndex() {
    return this.$$.ctx[14];
  }
  set levelIndex(e) {
    this.$$set({ levelIndex: e }), C();
  }
  get levelTotal() {
    return this.$$.ctx[15];
  }
  set levelTotal(e) {
    this.$$set({ levelTotal: e }), C();
  }
}
pe(Ts, { title: {}, subtitle: {}, description: {}, progress: {}, total: {}, xp: {}, status: {}, levelIndex: {}, levelTotal: {} }, [], [], !0);
function Di(l) {
  de(l, "svelte-12k2sv8", ".card.svelte-12k2sv8{position:relative;border-radius:18px;border:1px solid #e2e8f0;background:linear-gradient(160deg, #ffffff, #ecfdf5);padding:18px;overflow:hidden;transform:perspective(800px) rotateX(var(--rx)) rotateY(var(--ry));transition:transform 0.2s ease;box-shadow:0 18px 32px rgba(15, 23, 42, 0.12)}.shine.svelte-12k2sv8{position:absolute;inset:0;background:radial-gradient(circle at var(--shine) 20%, rgba(16, 185, 129, 0.22), transparent 55%);pointer-events:none}.content.svelte-12k2sv8{position:relative;display:grid;gap:6px}.title.svelte-12k2sv8{margin:0;font-size:12px;color:#64748b;letter-spacing:0.08em;text-transform:uppercase}.value.svelte-12k2sv8{margin:0;font-size:28px;font-weight:700;color:#0f172a}.hint.svelte-12k2sv8{margin:0;font-size:12px;color:#475569}");
}
function Xi(l) {
  let e, t, s, i, c, r, o, f, p, u, v, m, h, b, g;
  return {
    c() {
      e = d("div"), t = d("div"), s = y(), i = d("div"), c = d("p"), r = z(
        /*title*/
        l[0]
      ), o = y(), f = d("p"), p = z(
        /*value*/
        l[1]
      ), u = y(), v = d("p"), m = z(
        /*hint*/
        l[2]
      ), a(t, "class", "shine svelte-12k2sv8"), a(c, "class", "title svelte-12k2sv8"), a(f, "class", "value svelte-12k2sv8"), a(v, "class", "hint svelte-12k2sv8"), a(i, "class", "content svelte-12k2sv8"), a(e, "class", "card svelte-12k2sv8"), a(e, "style", h = `--rx:${/*rx*/
      l[3]}deg; --ry:${/*ry*/
      l[4]}deg; --shine:${/*shine*/
      l[5]}%`);
    },
    m(x, q) {
      L(x, e, q), n(e, t), n(e, s), n(e, i), n(i, c), n(c, r), n(i, o), n(i, f), n(f, p), n(i, u), n(i, v), n(v, m), b || (g = [
        O(
          e,
          "pointermove",
          /*handleMove*/
          l[6]
        ),
        O(
          e,
          "pointerleave",
          /*reset*/
          l[7]
        )
      ], b = !0);
    },
    p(x, [q]) {
      q & /*title*/
      1 && A(
        r,
        /*title*/
        x[0]
      ), q & /*value*/
      2 && A(
        p,
        /*value*/
        x[1]
      ), q & /*hint*/
      4 && A(
        m,
        /*hint*/
        x[2]
      ), q & /*rx, ry, shine*/
      56 && h !== (h = `--rx:${/*rx*/
      x[3]}deg; --ry:${/*ry*/
      x[4]}deg; --shine:${/*shine*/
      x[5]}%`) && a(e, "style", h);
    },
    i: D,
    o: D,
    d(x) {
      x && S(e), b = !1, ke(g);
    }
  };
}
function Bi(l, e, t) {
  let { title: s = "Pulso Focus" } = e, { value: i = "78%" } = e, { hint: c = "Calma sostenida" } = e, { intensity: r = 10 } = e, o = 0, f = 0, p = 0;
  const u = (m) => {
    const h = m.currentTarget.getBoundingClientRect(), b = (m.clientX - h.left) / h.width - 0.5, g = (m.clientY - h.top) / h.height - 0.5;
    t(3, o = g * r * -1), t(4, f = b * r), t(5, p = (b + g + 1) * 25);
  }, v = () => {
    t(3, o = 0), t(4, f = 0), t(5, p = 0);
  };
  return l.$$set = (m) => {
    "title" in m && t(0, s = m.title), "value" in m && t(1, i = m.value), "hint" in m && t(2, c = m.hint), "intensity" in m && t(8, r = m.intensity);
  }, [s, i, c, o, f, p, u, v, r];
}
class Es extends ve {
  constructor(e) {
    super(), ue(
      this,
      e,
      Bi,
      Xi,
      ee,
      {
        title: 0,
        value: 1,
        hint: 2,
        intensity: 8
      },
      Di
    );
  }
  get title() {
    return this.$$.ctx[0];
  }
  set title(e) {
    this.$$set({ title: e }), C();
  }
  get value() {
    return this.$$.ctx[1];
  }
  set value(e) {
    this.$$set({ value: e }), C();
  }
  get hint() {
    return this.$$.ctx[2];
  }
  set hint(e) {
    this.$$set({ hint: e }), C();
  }
  get intensity() {
    return this.$$.ctx[8];
  }
  set intensity(e) {
    this.$$set({ intensity: e }), C();
  }
}
pe(Es, { title: {}, value: {}, hint: {}, intensity: {} }, [], [], !0);
function Hi(l) {
  de(l, "svelte-1czrcz8", '.counter.svelte-1czrcz8{border-radius:16px;border:1px solid #e2e8f0;padding:16px;background:#ffffff;display:grid;gap:10px;box-shadow:0 12px 22px rgba(15, 23, 42, 0.08)}.label.svelte-1czrcz8{margin:0;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.08em}.value.svelte-1czrcz8{font-size:32px;font-weight:700;color:#0f172a;position:relative;animation:svelte-1czrcz8-flip 0.5s ease}.value.svelte-1czrcz8::after{content:"";position:absolute;left:0;right:0;bottom:-4px;height:3px;border-radius:999px;background:var(--tone);animation:svelte-1czrcz8-sweep 0.6s ease}@keyframes svelte-1czrcz8-flip{0%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:translateY(0)}}@keyframes svelte-1czrcz8-sweep{from{transform:scaleX(0.2)}to{transform:scaleX(1)}}');
}
function _l(l) {
  let e, t;
  return {
    c() {
      e = d("div"), t = z(
        /*value*/
        l[1]
      ), a(e, "class", "value svelte-1czrcz8");
    },
    m(s, i) {
      L(s, e, i), n(e, t);
    },
    p(s, i) {
      i & /*value*/
      2 && A(
        t,
        /*value*/
        s[1]
      );
    },
    d(s) {
      s && S(e);
    }
  };
}
function Yi(l) {
  let e, t, s, i, c = (
    /*value*/
    l[1]
  ), r, o = _l(l);
  return {
    c() {
      e = d("div"), t = d("p"), s = z(
        /*label*/
        l[0]
      ), i = y(), o.c(), a(t, "class", "label svelte-1czrcz8"), a(e, "class", "counter svelte-1czrcz8"), a(e, "style", r = `--tone:${/*tone*/
      l[2]}`);
    },
    m(f, p) {
      L(f, e, p), n(e, t), n(t, s), n(e, i), o.m(e, null);
    },
    p(f, [p]) {
      p & /*label*/
      1 && A(
        s,
        /*label*/
        f[0]
      ), p & /*value*/
      2 && ee(c, c = /*value*/
      f[1]) ? (o.d(1), o = _l(f), o.c(), o.m(e, null)) : o.p(f, p), p & /*tone*/
      4 && r !== (r = `--tone:${/*tone*/
      f[2]}`) && a(e, "style", r);
    },
    i: D,
    o: D,
    d(f) {
      f && S(e), o.d(f);
    }
  };
}
function Oi(l, e, t) {
  let { label: s = "Sesiones" } = e, { value: i = 12 } = e, { tone: c = "#10b981" } = e;
  return l.$$set = (r) => {
    "label" in r && t(0, s = r.label), "value" in r && t(1, i = r.value), "tone" in r && t(2, c = r.tone);
  }, [s, i, c];
}
class As extends ve {
  constructor(e) {
    super(), ue(this, e, Oi, Yi, ee, { label: 0, value: 1, tone: 2 }, Hi);
  }
  get label() {
    return this.$$.ctx[0];
  }
  set label(e) {
    this.$$set({ label: e }), C();
  }
  get value() {
    return this.$$.ctx[1];
  }
  set value(e) {
    this.$$set({ value: e }), C();
  }
  get tone() {
    return this.$$.ctx[2];
  }
  set tone(e) {
    this.$$set({ tone: e }), C();
  }
}
pe(As, { label: {}, value: {}, tone: {} }, [], [], !0);
function Fi(l) {
  de(l, "svelte-pocpcm", ".stack.svelte-pocpcm{position:relative;height:160px;border-radius:18px;border:1px solid #e2e8f0;background:linear-gradient(140deg, #ffffff, #ecfdf5);overflow:hidden;transform:perspective(900px) rotateX(var(--rx)) rotateY(var(--ry));transition:transform 0.2s ease}.bg.svelte-pocpcm{position:absolute;inset:0;background:radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.15), transparent 60%)}.layer.svelte-pocpcm{position:absolute;border-radius:999px;filter:blur(calc(var(--blur) * 10px));opacity:0.75}.layer-a.svelte-pocpcm{width:120px;height:120px;background:rgba(16, 185, 129, 0.45);transform:translate(calc(var(--px) * 0.6), calc(var(--py) * 0.6));top:20px;left:14px}.layer-b.svelte-pocpcm{width:90px;height:90px;background:rgba(52, 211, 153, 0.5);transform:translate(calc(var(--px) * 1.2), calc(var(--py) * 1.2));bottom:18px;right:20px}.layer-c.svelte-pocpcm{width:70px;height:70px;background:rgba(14, 116, 144, 0.3);transform:translate(calc(var(--px) * 1.6), calc(var(--py) * 1.6));top:30px;right:70px}.label.svelte-pocpcm{position:absolute;left:16px;bottom:14px;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#0f172a;background:rgba(255, 255, 255, 0.7);padding:4px 8px;border-radius:999px}");
}
function Vi(l) {
  let e, t, s, i, c, r, o, f, p, u, v, m, h, b;
  return {
    c() {
      e = d("div"), t = d("div"), s = y(), i = d("div"), c = y(), r = d("div"), o = y(), f = d("div"), p = y(), u = d("div"), v = z(
        /*title*/
        l[0]
      ), a(t, "class", "bg svelte-pocpcm"), a(i, "class", "layer layer-a svelte-pocpcm"), a(r, "class", "layer layer-b svelte-pocpcm"), a(f, "class", "layer layer-c svelte-pocpcm"), a(u, "class", "label svelte-pocpcm"), a(e, "class", "stack svelte-pocpcm"), a(e, "style", m = `--rx:${/*rx*/
      l[2]}deg; --ry:${/*ry*/
      l[3]}deg; --px:${/*px*/
      l[4]}px; --py:${/*py*/
      l[5]}px; --blur:${/*blurAmount*/
      l[1]}`);
    },
    m(g, x) {
      L(g, e, x), n(e, t), n(e, s), n(e, i), n(e, c), n(e, r), n(e, o), n(e, f), n(e, p), n(e, u), n(u, v), h || (b = [
        O(
          e,
          "pointermove",
          /*handleMove*/
          l[6]
        ),
        O(
          e,
          "pointerleave",
          /*reset*/
          l[7]
        )
      ], h = !0);
    },
    p(g, [x]) {
      x & /*title*/
      1 && A(
        v,
        /*title*/
        g[0]
      ), x & /*rx, ry, px, py, blurAmount*/
      62 && m !== (m = `--rx:${/*rx*/
      g[2]}deg; --ry:${/*ry*/
      g[3]}deg; --px:${/*px*/
      g[4]}px; --py:${/*py*/
      g[5]}px; --blur:${/*blurAmount*/
      g[1]}`) && a(e, "style", m);
    },
    i: D,
    o: D,
    d(g) {
      g && S(e), h = !1, ke(b);
    }
  };
}
function Ui(l, e, t) {
  let { title: s = "Capas activas" } = e, { intensity: i = 18 } = e, { blurAmount: c = 0.6 } = e, r = 0, o = 0, f = 0, p = 0;
  const u = (m) => {
    const h = m.currentTarget.getBoundingClientRect(), b = (m.clientX - h.left) / h.width - 0.5, g = (m.clientY - h.top) / h.height - 0.5;
    t(2, r = g * i * -1), t(3, o = b * i), t(4, f = b * 24), t(5, p = g * 24);
  }, v = () => {
    t(2, r = 0), t(3, o = 0), t(4, f = 0), t(5, p = 0);
  };
  return l.$$set = (m) => {
    "title" in m && t(0, s = m.title), "intensity" in m && t(8, i = m.intensity), "blurAmount" in m && t(1, c = m.blurAmount);
  }, [s, c, r, o, f, p, u, v, i];
}
class Ms extends ve {
  constructor(e) {
    super(), ue(this, e, Ui, Vi, ee, { title: 0, intensity: 8, blurAmount: 1 }, Fi);
  }
  get title() {
    return this.$$.ctx[0];
  }
  set title(e) {
    this.$$set({ title: e }), C();
  }
  get intensity() {
    return this.$$.ctx[8];
  }
  set intensity(e) {
    this.$$set({ intensity: e }), C();
  }
  get blurAmount() {
    return this.$$.ctx[1];
  }
  set blurAmount(e) {
    this.$$set({ blurAmount: e }), C();
  }
}
pe(Ms, { title: {}, intensity: {}, blurAmount: {} }, [], [], !0);
function Gi(l) {
  de(l, "svelte-1yc0e5f", `:host{display:block;font-family:'Poppins', 'Manrope', 'Segoe UI', system-ui, sans-serif}.card-shell.svelte-1yc0e5f.svelte-1yc0e5f{position:relative;padding-bottom:18px}.card.svelte-1yc0e5f.svelte-1yc0e5f{position:relative;z-index:1;background:#ffffff;border-radius:16px;overflow:hidden;border:2px solid transparent;box-shadow:0 12px 24px rgba(15, 23, 42, 0.08);transition:transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;cursor:pointer}.card.svelte-1yc0e5f.svelte-1yc0e5f:hover{transform:translateY(-2px);box-shadow:0 18px 32px rgba(15, 23, 42, 0.12),
      0 0 0 2px color-mix(in srgb, var(--category-left) 55%, transparent),
      0 12px 24px color-mix(in srgb, var(--category-right) 35%, transparent)}.card.is-selected.svelte-1yc0e5f.svelte-1yc0e5f{border-color:#10b981;transform:scale(0.99)}.card.is-disabled.svelte-1yc0e5f.svelte-1yc0e5f{opacity:0.5;cursor:not-allowed;pointer-events:none}.thumb.svelte-1yc0e5f.svelte-1yc0e5f{position:relative;background:#f1f5f9;aspect-ratio:16 / 9;overflow:hidden}.thumb.svelte-1yc0e5f img.svelte-1yc0e5f{width:100%;height:100%;object-fit:cover;display:block}.thumb-placeholder.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;inset:0;display:grid;place-items:center;font-size:28px;color:#94a3b8}.thumb-overlay.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;inset:0;background:linear-gradient(180deg, rgba(15, 23, 42, 0) 50%, rgba(15, 23, 42, 0.55) 100%);opacity:0;transition:opacity 0.2s ease}.card.svelte-1yc0e5f:hover .thumb-overlay.svelte-1yc0e5f{opacity:1}.pill-row.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;top:8px;left:8px;display:flex;gap:6px}.pill.svelte-1yc0e5f.svelte-1yc0e5f{padding:4px 8px;border-radius:999px;background:rgba(15, 23, 42, 0.6);color:#ffffff;font-size:11px;font-weight:600}.pill.badge.svelte-1yc0e5f.svelte-1yc0e5f{background:rgba(15, 23, 42, 0.75);text-transform:uppercase;letter-spacing:0.5px}.favorite.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;top:8px;right:8px;border:none;background:rgba(15, 23, 42, 0.35);color:#ffffff;width:30px;height:30px;border-radius:999px;display:grid;place-items:center;cursor:pointer;transition:background 0.2s ease, transform 0.2s ease, color 0.2s ease}.favorite.svelte-1yc0e5f svg.svelte-1yc0e5f{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.6}.favorite.active.svelte-1yc0e5f.svelte-1yc0e5f{background:rgba(255, 255, 255, 0.9);color:#ef4444}.favorite.active.svelte-1yc0e5f svg.svelte-1yc0e5f{fill:currentColor;stroke:none}.favorite.svelte-1yc0e5f.svelte-1yc0e5f:hover{transform:scale(1.05)}.check.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;bottom:8px;left:8px;width:26px;height:26px;border-radius:999px;background:rgba(255, 255, 255, 0.9);border:1px solid #e2e8f0;display:grid;place-items:center;transition:background 0.2s ease, border-color 0.2s ease}.check.svelte-1yc0e5f svg.svelte-1yc0e5f{width:16px;height:16px;fill:#ffffff;opacity:0;transform:scale(0.7);transition:opacity 0.2s ease, transform 0.2s ease}.card.is-selected.svelte-1yc0e5f .check.svelte-1yc0e5f{background:#10b981;border-color:#059669}.card.is-selected.svelte-1yc0e5f .check svg.svelte-1yc0e5f{opacity:1;transform:scale(1)}.body.svelte-1yc0e5f.svelte-1yc0e5f{padding:16px;display:grid;gap:8px}.body.svelte-1yc0e5f h3.svelte-1yc0e5f{margin:0;font-size:15px;font-weight:700;color:#0f172a}.body.svelte-1yc0e5f p.svelte-1yc0e5f{margin:0;font-size:13px;color:#64748b;min-height:34px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.cta.svelte-1yc0e5f.svelte-1yc0e5f{padding:8px 10px;border-radius:10px;text-align:center;font-size:12px;font-weight:600;color:#64748b;background:#f1f5f9;transition:background 0.2s ease, color 0.2s ease}.card.svelte-1yc0e5f:hover .cta.svelte-1yc0e5f{background:#e2e8f0}.cta-selected.svelte-1yc0e5f.svelte-1yc0e5f{background:#d1fae5;color:#047857}.category-lift.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;left:16px;right:16px;bottom:-12px;display:flex;justify-content:center;gap:8px;z-index:0;pointer-events:none;transform:translateY(14px);opacity:0;transition:transform 0.25s ease, opacity 0.2s ease}.category-chip.svelte-1yc0e5f.svelte-1yc0e5f{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:0.4px;color:#ffffff;text-transform:uppercase;background:var(--chip-color);box-shadow:0 10px 20px color-mix(in srgb, var(--chip-color) 35%, transparent)}.card-shell.svelte-1yc0e5f:hover .category-lift.svelte-1yc0e5f,.card-shell.svelte-1yc0e5f:focus-within .category-lift.svelte-1yc0e5f{opacity:1;transform:translateY(0)}`);
}
function Ji(l) {
  let e;
  return {
    c() {
      e = d("div"), e.textContent = "▶", a(e, "class", "thumb-placeholder svelte-1yc0e5f");
    },
    m(t, s) {
      L(t, e, s);
    },
    p: D,
    d(t) {
      t && S(e);
    }
  };
}
function Qi(l) {
  let e, t, s;
  return {
    c() {
      e = d("img"), Te(e.src, t = /*thumbnail*/
      l[3]) || a(e, "src", t), a(e, "alt", s = `Miniatura de ${/*title*/
      l[0]}`), a(e, "loading", "lazy"), a(e, "class", "svelte-1yc0e5f");
    },
    m(i, c) {
      L(i, e, c);
    },
    p(i, c) {
      c & /*thumbnail*/
      8 && !Te(e.src, t = /*thumbnail*/
      i[3]) && a(e, "src", t), c & /*title*/
      1 && s !== (s = `Miniatura de ${/*title*/
      i[0]}`) && a(e, "alt", s);
    },
    d(i) {
      i && S(e);
    }
  };
}
function yl(l) {
  let e, t;
  return {
    c() {
      e = d("div"), t = z(
        /*badge*/
        l[6]
      ), a(e, "class", "pill badge svelte-1yc0e5f");
    },
    m(s, i) {
      L(s, e, i), n(e, t);
    },
    p(s, i) {
      i & /*badge*/
      64 && A(
        t,
        /*badge*/
        s[6]
      );
    },
    d(s) {
      s && S(e);
    }
  };
}
function kl(l) {
  let e, t, s, i, c, r = (
    /*categoryRight*/
    l[9] && wl(l)
  );
  return {
    c() {
      e = d("div"), t = d("span"), s = z(
        /*categoryLeft*/
        l[8]
      ), c = y(), r && r.c(), a(t, "class", "category-chip svelte-1yc0e5f"), a(t, "style", i = `--chip-color: ${/*categoryLeftColor*/
      l[10]};`), a(e, "class", "category-lift svelte-1yc0e5f"), a(e, "aria-hidden", "true");
    },
    m(o, f) {
      L(o, e, f), n(e, t), n(t, s), n(e, c), r && r.m(e, null);
    },
    p(o, f) {
      f & /*categoryLeft*/
      256 && A(
        s,
        /*categoryLeft*/
        o[8]
      ), f & /*categoryLeftColor*/
      1024 && i !== (i = `--chip-color: ${/*categoryLeftColor*/
      o[10]};`) && a(t, "style", i), /*categoryRight*/
      o[9] ? r ? r.p(o, f) : (r = wl(o), r.c(), r.m(e, null)) : r && (r.d(1), r = null);
    },
    d(o) {
      o && S(e), r && r.d();
    }
  };
}
function wl(l) {
  let e, t, s;
  return {
    c() {
      e = d("span"), t = z(
        /*categoryRight*/
        l[9]
      ), a(e, "class", "category-chip svelte-1yc0e5f"), a(e, "style", s = `--chip-color: ${/*categoryRightColor*/
      l[11]};`);
    },
    m(i, c) {
      L(i, e, c), n(e, t);
    },
    p(i, c) {
      c & /*categoryRight*/
      512 && A(
        t,
        /*categoryRight*/
        i[9]
      ), c & /*categoryRightColor*/
      2048 && s !== (s = `--chip-color: ${/*categoryRightColor*/
      i[11]};`) && a(e, "style", s);
    },
    d(i) {
      i && S(e);
    }
  };
}
function Wi(l) {
  let e, t, s, i, c, r, o, f, p, u, v, m, h, b, g, x, q, M, k, _, T, w, j, E, I, B, V, R = (
    /*selected*/
    l[4] ? "Seleccionado" : "Seleccionar video"
  ), U, P, N, J, re, Q, te, W;
  function G(Y, K) {
    return (
      /*thumbnail*/
      Y[3] ? Qi : Ji
    );
  }
  let ge = G(l), ne = ge(l), le = (
    /*badge*/
    l[6] && yl(l)
  ), $ = (
    /*categoryLeft*/
    l[8] && kl(l)
  );
  return {
    c() {
      e = d("div"), t = d("div"), s = d("div"), ne.c(), i = y(), c = d("div"), r = y(), o = d("div"), f = d("div"), p = z(
        /*duration*/
        l[2]
      ), u = y(), le && le.c(), v = y(), m = d("button"), h = al("svg"), b = al("path"), q = y(), M = d("div"), M.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" class="svelte-1yc0e5f"><path d="M9.2 16.2L5.7 12.7l1.4-1.4 2.1 2.1 7.7-7.7 1.4 1.4z"></path></svg>', k = y(), _ = d("div"), T = d("h3"), w = z(
        /*title*/
        l[0]
      ), j = y(), E = d("p"), I = z(
        /*description*/
        l[1]
      ), B = y(), V = d("div"), U = z(R), re = y(), $ && $.c(), a(c, "class", "thumb-overlay svelte-1yc0e5f"), a(f, "class", "pill svelte-1yc0e5f"), a(o, "class", "pill-row svelte-1yc0e5f"), a(b, "d", "M12.1 21.2c-0.1 0-0.3 0-0.4-0.1C6.1 18.6 2 15 2 10.4 2 7.6 4.3 5.3 7.1 5.3c1.7 0 3.3 0.8 4.3 2.1 1-1.3 2.6-2.1 4.3-2.1 2.8 0 5.1 2.3 5.1 5.1 0 4.6-4.1 8.2-9.7 10.7-0.1 0-0.2 0.1-0.3 0.1z"), a(h, "viewBox", "0 0 24 24"), a(h, "aria-hidden", "true"), a(h, "class", "svelte-1yc0e5f"), a(m, "class", g = "favorite " + /*favorite*/
      (l[7] ? "active" : "") + " svelte-1yc0e5f"), a(m, "aria-label", x = /*favorite*/
      l[7] ? "Quitar de favoritos" : "Anadir a favoritos"), a(M, "class", "check svelte-1yc0e5f"), a(s, "class", "thumb svelte-1yc0e5f"), a(T, "class", "svelte-1yc0e5f"), a(E, "class", "svelte-1yc0e5f"), a(V, "class", P = "cta " + /*selected*/
      (l[4] ? "cta-selected" : "") + " svelte-1yc0e5f"), a(_, "class", "body svelte-1yc0e5f"), a(t, "class", N = "card " + /*selected*/
      (l[4] ? "is-selected" : "") + " " + /*disabled*/
      (l[5] ? "is-disabled" : "") + " svelte-1yc0e5f"), a(t, "role", "button"), a(
        t,
        "aria-disabled",
        /*disabled*/
        l[5]
      ), a(t, "tabindex", J = /*disabled*/
      l[5] ? -1 : 0), a(e, "class", "card-shell svelte-1yc0e5f"), a(e, "style", Q = `--category-left: ${/*categoryLeftColor*/
      l[10]}; --category-right: ${/*categoryRightColor*/
      l[11]};`);
    },
    m(Y, K) {
      L(Y, e, K), n(e, t), n(t, s), ne.m(s, null), n(s, i), n(s, c), n(s, r), n(s, o), n(o, f), n(f, p), n(o, u), le && le.m(o, null), n(s, v), n(s, m), n(m, h), n(h, b), n(s, q), n(s, M), n(t, k), n(t, _), n(_, T), n(T, w), n(_, j), n(_, E), n(E, I), n(_, B), n(_, V), n(V, U), n(e, re), $ && $.m(e, null), te || (W = [
        O(
          m,
          "click",
          /*handleFavorite*/
          l[13]
        ),
        O(
          t,
          "click",
          /*handleSelect*/
          l[12]
        ),
        O(
          t,
          "keydown",
          /*handleKeyDown*/
          l[14]
        )
      ], te = !0);
    },
    p(Y, [K]) {
      ge === (ge = G(Y)) && ne ? ne.p(Y, K) : (ne.d(1), ne = ge(Y), ne && (ne.c(), ne.m(s, i))), K & /*duration*/
      4 && A(
        p,
        /*duration*/
        Y[2]
      ), /*badge*/
      Y[6] ? le ? le.p(Y, K) : (le = yl(Y), le.c(), le.m(o, null)) : le && (le.d(1), le = null), K & /*favorite*/
      128 && g !== (g = "favorite " + /*favorite*/
      (Y[7] ? "active" : "") + " svelte-1yc0e5f") && a(m, "class", g), K & /*favorite*/
      128 && x !== (x = /*favorite*/
      Y[7] ? "Quitar de favoritos" : "Anadir a favoritos") && a(m, "aria-label", x), K & /*title*/
      1 && A(
        w,
        /*title*/
        Y[0]
      ), K & /*description*/
      2 && A(
        I,
        /*description*/
        Y[1]
      ), K & /*selected*/
      16 && R !== (R = /*selected*/
      Y[4] ? "Seleccionado" : "Seleccionar video") && A(U, R), K & /*selected*/
      16 && P !== (P = "cta " + /*selected*/
      (Y[4] ? "cta-selected" : "") + " svelte-1yc0e5f") && a(V, "class", P), K & /*selected, disabled*/
      48 && N !== (N = "card " + /*selected*/
      (Y[4] ? "is-selected" : "") + " " + /*disabled*/
      (Y[5] ? "is-disabled" : "") + " svelte-1yc0e5f") && a(t, "class", N), K & /*disabled*/
      32 && a(
        t,
        "aria-disabled",
        /*disabled*/
        Y[5]
      ), K & /*disabled*/
      32 && J !== (J = /*disabled*/
      Y[5] ? -1 : 0) && a(t, "tabindex", J), /*categoryLeft*/
      Y[8] ? $ ? $.p(Y, K) : ($ = kl(Y), $.c(), $.m(e, null)) : $ && ($.d(1), $ = null), K & /*categoryLeftColor, categoryRightColor*/
      3072 && Q !== (Q = `--category-left: ${/*categoryLeftColor*/
      Y[10]}; --category-right: ${/*categoryRightColor*/
      Y[11]};`) && a(e, "style", Q);
    },
    i: D,
    o: D,
    d(Y) {
      Y && S(e), ne.d(), le && le.d(), $ && $.d(), te = !1, ke(W);
    }
  };
}
function Ki(l, e, t) {
  let { videoId: s = "" } = e, { hashedId: i = "" } = e, { title: c = "" } = e, { description: r = "" } = e, { duration: o = "" } = e, { thumbnail: f = "" } = e, { selected: p = !1 } = e, { disabled: u = !1 } = e, { badge: v = "" } = e, { tags: m = [] } = e, { favorite: h = !1 } = e, { categoryLeft: b = "" } = e, { categoryRight: g = "" } = e, { categoryLeftColor: x = "#94a3b8" } = e, { categoryRightColor: q = "#94a3b8" } = e;
  const M = Ie(), k = () => {
    u || M("select", { id: s });
  }, _ = (w) => {
    w.stopPropagation(), !u && M("favorite", { hashedId: i });
  }, T = (w) => {
    u || (w.key === "Enter" || w.key === " ") && (w.preventDefault(), k());
  };
  return l.$$set = (w) => {
    "videoId" in w && t(15, s = w.videoId), "hashedId" in w && t(16, i = w.hashedId), "title" in w && t(0, c = w.title), "description" in w && t(1, r = w.description), "duration" in w && t(2, o = w.duration), "thumbnail" in w && t(3, f = w.thumbnail), "selected" in w && t(4, p = w.selected), "disabled" in w && t(5, u = w.disabled), "badge" in w && t(6, v = w.badge), "tags" in w && t(17, m = w.tags), "favorite" in w && t(7, h = w.favorite), "categoryLeft" in w && t(8, b = w.categoryLeft), "categoryRight" in w && t(9, g = w.categoryRight), "categoryLeftColor" in w && t(10, x = w.categoryLeftColor), "categoryRightColor" in w && t(11, q = w.categoryRightColor);
  }, [
    c,
    r,
    o,
    f,
    p,
    u,
    v,
    h,
    b,
    g,
    x,
    q,
    k,
    _,
    T,
    s,
    i,
    m
  ];
}
class Ns extends ve {
  constructor(e) {
    super(), ue(
      this,
      e,
      Ki,
      Wi,
      ee,
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
      Gi
    );
  }
  get videoId() {
    return this.$$.ctx[15];
  }
  set videoId(e) {
    this.$$set({ videoId: e }), C();
  }
  get hashedId() {
    return this.$$.ctx[16];
  }
  set hashedId(e) {
    this.$$set({ hashedId: e }), C();
  }
  get title() {
    return this.$$.ctx[0];
  }
  set title(e) {
    this.$$set({ title: e }), C();
  }
  get description() {
    return this.$$.ctx[1];
  }
  set description(e) {
    this.$$set({ description: e }), C();
  }
  get duration() {
    return this.$$.ctx[2];
  }
  set duration(e) {
    this.$$set({ duration: e }), C();
  }
  get thumbnail() {
    return this.$$.ctx[3];
  }
  set thumbnail(e) {
    this.$$set({ thumbnail: e }), C();
  }
  get selected() {
    return this.$$.ctx[4];
  }
  set selected(e) {
    this.$$set({ selected: e }), C();
  }
  get disabled() {
    return this.$$.ctx[5];
  }
  set disabled(e) {
    this.$$set({ disabled: e }), C();
  }
  get badge() {
    return this.$$.ctx[6];
  }
  set badge(e) {
    this.$$set({ badge: e }), C();
  }
  get tags() {
    return this.$$.ctx[17];
  }
  set tags(e) {
    this.$$set({ tags: e }), C();
  }
  get favorite() {
    return this.$$.ctx[7];
  }
  set favorite(e) {
    this.$$set({ favorite: e }), C();
  }
  get categoryLeft() {
    return this.$$.ctx[8];
  }
  set categoryLeft(e) {
    this.$$set({ categoryLeft: e }), C();
  }
  get categoryRight() {
    return this.$$.ctx[9];
  }
  set categoryRight(e) {
    this.$$set({ categoryRight: e }), C();
  }
  get categoryLeftColor() {
    return this.$$.ctx[10];
  }
  set categoryLeftColor(e) {
    this.$$set({ categoryLeftColor: e }), C();
  }
  get categoryRightColor() {
    return this.$$.ctx[11];
  }
  set categoryRightColor(e) {
    this.$$set({ categoryRightColor: e }), C();
  }
}
customElements.define("svelte-video-card", pe(Ns, { videoId: {}, hashedId: {}, title: {}, description: {}, duration: {}, thumbnail: {}, selected: { type: "Boolean" }, disabled: { type: "Boolean" }, badge: {}, tags: {}, favorite: { type: "Boolean" }, categoryLeft: {}, categoryRight: {}, categoryLeftColor: {}, categoryRightColor: {} }, [], [], !0));
function Zi(l) {
  const e = l - 1;
  return e * e * e + 1;
}
function Ct(l, { delay: e = 0, duration: t = 400, easing: s = ds } = {}) {
  const i = +getComputedStyle(l).opacity;
  return {
    delay: e,
    duration: t,
    easing: s,
    css: (c) => `opacity: ${c * i}`
  };
}
function $e(l, { delay: e = 0, duration: t = 400, easing: s = Zi, x: i = 0, y: c = 0, opacity: r = 0 } = {}) {
  const o = getComputedStyle(l), f = +o.opacity, p = o.transform === "none" ? "" : o.transform, u = f * (1 - r), [v, m] = rl(i), [h, b] = rl(c);
  return {
    delay: e,
    duration: t,
    easing: s,
    css: (g, x) => `
			transform: ${p} translate(${(1 - g) * v}${m}, ${(1 - g) * h}${b});
			opacity: ${f - u * x}`
  };
}
function $i(l) {
  de(l, "svelte-1hb2737", `.overlay.svelte-1hb2737{position:fixed;inset:0;z-index:70;display:flex;align-items:center;justify-content:center;padding:24px;background:radial-gradient(circle at top, rgba(58, 132, 117, 0.2), rgba(0, 0, 0, 0.6));backdrop-filter:blur(6px)}.card.svelte-1hb2737{position:relative;width:min(520px, 92vw);padding:28px 26px 24px;border-radius:24px;background:linear-gradient(135deg, #ffffff 0%, #f4f6f0 100%);box-shadow:0 18px 40px rgba(0, 0, 0, 0.22),
      0 4px 18px rgba(50, 120, 102, 0.18);overflow:hidden}.card.svelte-1hb2737::before{content:"";position:absolute;inset:-1px;border-radius:24px;padding:1px;background:linear-gradient(130deg, rgba(43, 173, 145, 0.5), rgba(255, 255, 255, 0));-webkit-mask:linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none}.badge.svelte-1hb2737{display:inline-flex;align-items:center;padding:6px 12px;border-radius:999px;background:rgba(46, 140, 120, 0.12);color:#1f5f52;font-size:12px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase}h2.svelte-1hb2737{margin:14px 0 8px;font-size:22px;font-weight:700;color:#1f2a26}p.svelte-1hb2737{margin:0;font-size:14px;line-height:1.5;color:#4b5b56}.actions.svelte-1hb2737{margin-top:18px;display:flex;justify-content:flex-end}button.svelte-1hb2737{border:none;border-radius:12px;padding:10px 18px;font-size:14px;font-weight:600;color:#fff;background:linear-gradient(135deg, #2e8c78, #1f6d5e);box-shadow:0 10px 18px rgba(46, 140, 120, 0.28);cursor:pointer}button.svelte-1hb2737:hover{filter:brightness(1.05)}button.svelte-1hb2737:active{transform:translateY(1px)}@media(max-width: 480px){.card.svelte-1hb2737{padding:22px 20px}h2.svelte-1hb2737{font-size:20px}}`);
}
function zl(l) {
  let e, t, s, i, c, r, o, f, p, u, v, m, h, b, g, x, q, M;
  return {
    c() {
      e = d("div"), t = d("div"), s = d("div"), s.textContent = "Fin de temporada", i = y(), c = d("h2"), r = z(
        /*title*/
        l[1]
      ), o = y(), f = d("p"), p = z(
        /*message*/
        l[2]
      ), u = y(), v = d("div"), m = d("button"), h = z(
        /*cta*/
        l[3]
      ), a(s, "class", "badge svelte-1hb2737"), a(c, "class", "svelte-1hb2737"), a(f, "class", "svelte-1hb2737"), a(m, "type", "button"), a(m, "class", "svelte-1hb2737"), a(v, "class", "actions svelte-1hb2737"), a(t, "class", "card svelte-1hb2737"), a(e, "class", "overlay svelte-1hb2737"), a(e, "role", "button"), a(e, "tabindex", "0"), a(e, "aria-label", "Cerrar aviso de temporada");
    },
    m(k, _) {
      L(k, e, _), n(e, t), n(t, s), n(t, i), n(t, c), n(c, r), n(t, o), n(t, f), n(f, p), n(t, u), n(t, v), n(v, m), n(m, h), x = !0, q || (M = [
        O(
          m,
          "click",
          /*handleClose*/
          l[4]
        ),
        O(
          e,
          "click",
          /*handleBackdrop*/
          l[5]
        ),
        O(
          e,
          "keydown",
          /*handleKeydown*/
          l[6]
        )
      ], q = !0);
    },
    p(k, _) {
      (!x || _ & /*title*/
      2) && A(
        r,
        /*title*/
        k[1]
      ), (!x || _ & /*message*/
      4) && A(
        p,
        /*message*/
        k[2]
      ), (!x || _ & /*cta*/
      8) && A(
        h,
        /*cta*/
        k[3]
      );
    },
    i(k) {
      x || (k && Ne(() => {
        x && (b || (b = Le(t, $e, { y: 18, duration: 240 }, !0)), b.run(1));
      }), k && Ne(() => {
        x && (g || (g = Le(e, Ct, { duration: 180 }, !0)), g.run(1));
      }), x = !0);
    },
    o(k) {
      k && (b || (b = Le(t, $e, { y: 18, duration: 240 }, !1)), b.run(0)), k && (g || (g = Le(e, Ct, { duration: 180 }, !1)), g.run(0)), x = !1;
    },
    d(k) {
      k && S(e), k && b && b.end(), k && g && g.end(), q = !1, ke(M);
    }
  };
}
function en(l) {
  let e, t = (
    /*open*/
    l[0] && zl(l)
  );
  return {
    c() {
      t && t.c(), e = et();
    },
    m(s, i) {
      t && t.m(s, i), L(s, e, i);
    },
    p(s, [i]) {
      /*open*/
      s[0] ? t ? (t.p(s, i), i & /*open*/
      1 && Ge(t, 1)) : (t = zl(s), t.c(), Ge(t, 1), t.m(e.parentNode, e)) : t && (Yt(), ht(t, 1, 1, () => {
        t = null;
      }), Ot());
    },
    i(s) {
      Ge(t);
    },
    o(s) {
      ht(t);
    },
    d(s) {
      s && S(e), t && t.d(s);
    }
  };
}
function tn(l, e, t) {
  let { open: s = !1 } = e, { title: i = "Temporada finalizada" } = e, { message: c = "La temporada actual ha terminado. Tus logros de temporada se reiniciaran para un nuevo ciclo." } = e, { cta: r = "Entendido" } = e;
  const o = Ie(), f = () => {
    t(0, s = !1), o("dismiss");
  }, p = (v) => {
    v.target === v.currentTarget && f();
  }, u = (v) => {
    const m = v.key;
    (m === "Escape" || m === "Enter" || m === " ") && f();
  };
  return l.$$set = (v) => {
    "open" in v && t(0, s = v.open), "title" in v && t(1, i = v.title), "message" in v && t(2, c = v.message), "cta" in v && t(3, r = v.cta);
  }, [s, i, c, r, f, p, u];
}
class Is extends ve {
  constructor(e) {
    super(), ue(this, e, tn, en, ee, { open: 0, title: 1, message: 2, cta: 3 }, $i);
  }
  get open() {
    return this.$$.ctx[0];
  }
  set open(e) {
    this.$$set({ open: e }), C();
  }
  get title() {
    return this.$$.ctx[1];
  }
  set title(e) {
    this.$$set({ title: e }), C();
  }
  get message() {
    return this.$$.ctx[2];
  }
  set message(e) {
    this.$$set({ message: e }), C();
  }
  get cta() {
    return this.$$.ctx[3];
  }
  set cta(e) {
    this.$$set({ cta: e }), C();
  }
}
customElements.define("svelte-season-popup", pe(Is, { open: { type: "Boolean" }, title: {}, message: {}, cta: {} }, [], [], !0));
function ln(l) {
  de(l, "svelte-1f864m7", ':host{display:inline-block}.token.svelte-1f864m7{position:relative;height:40px;width:64px;border-radius:8px;border:1px solid #e5e7eb;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;line-height:1.1;font-family:inherit;overflow:visible;margin:0 4px}.time.svelte-1f864m7{font-weight:600;font-size:14px;color:inherit}.points.svelte-1f864m7{font-size:10px;opacity:0.8;margin-top:-2px}.points.expired.svelte-1f864m7{text-decoration:line-through}.completed.svelte-1f864m7{background:#8acc9f;color:#ffffff;border-color:#10b981}.open.svelte-1f864m7{background:#ecfdf5;color:#047857;border-color:#6ee7b7;box-shadow:0 4px 10px rgba(16, 185, 129, 0.12);transform:scale(1.2);transition:transform 0.2s ease;transform-origin:center;margin:0 10px}.open.svelte-1f864m7::before,.open.svelte-1f864m7::after,.open.svelte-1f864m7::backdrop{content:"";position:absolute;inset:-10px;border-radius:12px;border:1px solid rgba(16, 185, 129, 0.35);background:radial-gradient(circle, rgba(16, 185, 129, 0.35), rgba(16, 185, 129, 0));opacity:0;animation:svelte-1f864m7-pulse 1.35s ease-out infinite;pointer-events:none}.open.svelte-1f864m7::after{animation-delay:0.45s}.open.svelte-1f864m7::backdrop{animation-delay:0.9s}.expired.svelte-1f864m7{background:#fee2e2;color:#ef4444;border-color:#fca5a5}.upcoming.svelte-1f864m7{background:#f3f4f6;color:#6b7280;border-color:#e5e7eb}@media(min-width: 640px){.token.svelte-1f864m7{height:48px;width:80px;border-radius:10px}.time.svelte-1f864m7{font-size:15px}}@keyframes svelte-1f864m7-pulse{0%{transform:scale(0.85);opacity:0}20%{opacity:0.55}100%{transform:scale(1.4);opacity:0}}');
}
function sn(l) {
  let e, t = `+${/*points*/
  l[2]} ${/*unit*/
  l[3]}`, s;
  return {
    c() {
      e = d("div"), s = z(t), a(e, "class", "time svelte-1f864m7");
    },
    m(i, c) {
      L(i, e, c), n(e, s);
    },
    p(i, c) {
      c & /*points, unit*/
      12 && t !== (t = `+${/*points*/
      i[2]} ${/*unit*/
      i[3]}`) && A(s, t);
    },
    d(i) {
      i && S(e);
    }
  };
}
function nn(l) {
  let e, t, s, i, c, r, o, f, p;
  return {
    c() {
      e = d("div"), t = z(
        /*timeLabel*/
        l[1]
      ), s = y(), i = d("div"), c = z("+"), r = z(
        /*points*/
        l[2]
      ), o = y(), f = z(
        /*unit*/
        l[3]
      ), a(e, "class", "time svelte-1f864m7"), a(i, "class", p = "points " + /*status*/
      (l[0] === "expired" ? "expired" : "") + " svelte-1f864m7");
    },
    m(u, v) {
      L(u, e, v), n(e, t), L(u, s, v), L(u, i, v), n(i, c), n(i, r), n(i, o), n(i, f);
    },
    p(u, v) {
      v & /*timeLabel*/
      2 && A(
        t,
        /*timeLabel*/
        u[1]
      ), v & /*points*/
      4 && A(
        r,
        /*points*/
        u[2]
      ), v & /*unit*/
      8 && A(
        f,
        /*unit*/
        u[3]
      ), v & /*status*/
      1 && p !== (p = "points " + /*status*/
      (u[0] === "expired" ? "expired" : "") + " svelte-1f864m7") && a(i, "class", p);
    },
    d(u) {
      u && (S(e), S(s), S(i));
    }
  };
}
function rn(l) {
  let e, t;
  function s(r, o) {
    return (
      /*timeLabel*/
      r[1] ? nn : sn
    );
  }
  let i = s(l), c = i(l);
  return {
    c() {
      e = d("div"), c.c(), a(e, "class", t = "token " + /*label*/
      l[4](
        /*status*/
        l[0]
      ) + " svelte-1f864m7");
    },
    m(r, o) {
      L(r, e, o), c.m(e, null);
    },
    p(r, [o]) {
      i === (i = s(r)) && c ? c.p(r, o) : (c.d(1), c = i(r), c && (c.c(), c.m(e, null))), o & /*status*/
      1 && t !== (t = "token " + /*label*/
      r[4](
        /*status*/
        r[0]
      ) + " svelte-1f864m7") && a(e, "class", t);
    },
    i: D,
    o: D,
    d(r) {
      r && S(e), c.d();
    }
  };
}
function an(l, e, t) {
  let { status: s = "upcoming" } = e, { timeLabel: i = "" } = e, { points: c = 20 } = e, { unit: r = "AP" } = e;
  const o = (f) => typeof f == "string" ? f : String(f ?? "");
  return l.$$set = (f) => {
    "status" in f && t(0, s = f.status), "timeLabel" in f && t(1, i = f.timeLabel), "points" in f && t(2, c = f.points), "unit" in f && t(3, r = f.unit);
  }, [s, i, c, r, o];
}
class Ps extends ve {
  constructor(e) {
    super(), ue(
      this,
      e,
      an,
      rn,
      ee,
      {
        status: 0,
        timeLabel: 1,
        points: 2,
        unit: 3
      },
      ln
    );
  }
  get status() {
    return this.$$.ctx[0];
  }
  set status(e) {
    this.$$set({ status: e }), C();
  }
  get timeLabel() {
    return this.$$.ctx[1];
  }
  set timeLabel(e) {
    this.$$set({ timeLabel: e }), C();
  }
  get points() {
    return this.$$.ctx[2];
  }
  set points(e) {
    this.$$set({ points: e }), C();
  }
  get unit() {
    return this.$$.ctx[3];
  }
  set unit(e) {
    this.$$set({ unit: e }), C();
  }
}
customElements.define("svelte-quota-token", pe(Ps, { status: {}, timeLabel: {}, points: {}, unit: {} }, [], [], !0));
function on(l) {
  de(l, "svelte-p2zlwf", ":host{display:block;font-family:inherit}.panel.svelte-p2zlwf.svelte-p2zlwf{display:grid;gap:18px;animation:svelte-p2zlwf-panel-rise 0.4s ease}.hero.svelte-p2zlwf.svelte-p2zlwf{position:relative;border-radius:22px;padding:18px 20px;background:linear-gradient(130deg, #f8fafc, #ecfdf5);border:1px solid #e2e8f0;display:grid;gap:14px;overflow:hidden}.hero-cards.svelte-p2zlwf.svelte-p2zlwf{display:grid;grid-template-columns:repeat(auto-fit, minmax(160px, 1fr));gap:10px}.hero-card.svelte-p2zlwf.svelte-p2zlwf{border-radius:16px;padding:10px 12px;background:rgba(255, 255, 255, 0.8);border:1px solid rgba(226, 232, 240, 0.9);display:grid;gap:4px}.hero-card.accent.svelte-p2zlwf.svelte-p2zlwf{background:linear-gradient(120deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.08));border-color:rgba(16, 185, 129, 0.4)}.orb.svelte-p2zlwf.svelte-p2zlwf{position:absolute;right:18px;top:-10px;width:120px;height:120px;border-radius:999px;background:radial-gradient(circle, rgba(16, 185, 129, 0.22), transparent 65%);animation:svelte-p2zlwf-float 6s ease-in-out infinite}.orb.small.svelte-p2zlwf.svelte-p2zlwf{right:120px;top:60px;width:72px;height:72px;animation-delay:1.4s;opacity:0.7}.eyebrow.svelte-p2zlwf.svelte-p2zlwf{text-transform:uppercase;font-size:11px;letter-spacing:0.12em;color:#94a3b8;margin:0 0 6px}h1.svelte-p2zlwf.svelte-p2zlwf{margin:0;font-size:22px;font-weight:700;color:#0f172a}.email.svelte-p2zlwf.svelte-p2zlwf{margin:4px 0 0;color:#64748b;font-size:13px}.grid.svelte-p2zlwf.svelte-p2zlwf{display:grid;gap:12px;grid-template-columns:repeat(auto-fit, minmax(160px, 1fr))}.grid.two.svelte-p2zlwf.svelte-p2zlwf{grid-template-columns:repeat(auto-fit, minmax(220px, 1fr))}.card.svelte-p2zlwf.svelte-p2zlwf{background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;padding:12px 14px;display:grid;gap:6px;position:relative;overflow:hidden}.card.svelte-p2zlwf span.svelte-p2zlwf{font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#94a3b8}.card.svelte-p2zlwf strong.svelte-p2zlwf{font-size:20px;color:#0f172a}.section.svelte-p2zlwf.svelte-p2zlwf{background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;padding:16px;position:relative}.xp.svelte-p2zlwf.svelte-p2zlwf{overflow:hidden}.xp-toggle.svelte-p2zlwf.svelte-p2zlwf{width:100%;border:none;background:transparent;display:flex;align-items:center;justify-content:space-between;gap:12px;cursor:pointer;padding:0;margin-bottom:10px}.xp-toggle.svelte-p2zlwf h2.svelte-p2zlwf{margin:0}.xp-toggle.svelte-p2zlwf span.svelte-p2zlwf{display:inline-flex;align-items:center;justify-content:center;height:28px;width:28px;border-radius:999px;background:#ecfdf5;color:#10b981;transition:transform 0.2s ease;font-weight:700}.xp-toggle.svelte-p2zlwf span.rotated.svelte-p2zlwf{transform:rotate(180deg)}.xp-controls.svelte-p2zlwf.svelte-p2zlwf{display:grid;grid-template-columns:repeat(auto-fit, minmax(140px, 1fr));gap:8px;margin-bottom:10px}.xp-controls.svelte-p2zlwf label.svelte-p2zlwf{display:grid;gap:4px;font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em}.xp-controls.svelte-p2zlwf input.svelte-p2zlwf{border:1px solid #e2e8f0;border-radius:10px;padding:6px 8px;font-size:12px;color:#0f172a;background:#fff}.xp-controls.svelte-p2zlwf .ghost.svelte-p2zlwf,.xp-controls.svelte-p2zlwf .apply.svelte-p2zlwf,.xp-footer.svelte-p2zlwf .apply.svelte-p2zlwf{border:none;border-radius:10px;padding:8px 10px;font-size:12px;font-weight:600;cursor:pointer}.xp-controls.svelte-p2zlwf .ghost.svelte-p2zlwf{background:#f1f5f9;color:#334155}.xp-controls.svelte-p2zlwf .apply.svelte-p2zlwf,.xp-footer.svelte-p2zlwf .apply.svelte-p2zlwf{background:#10b981;color:#fff}.xp-footer.svelte-p2zlwf.svelte-p2zlwf{display:flex;align-items:center;justify-content:space-between;margin-top:8px}.section.svelte-p2zlwf h2.svelte-p2zlwf{margin:0 0 10px;font-size:15px;font-weight:700;color:#0f172a}.row.svelte-p2zlwf.svelte-p2zlwf{display:flex;justify-content:space-between;align-items:center}.days.svelte-p2zlwf.svelte-p2zlwf{display:flex;flex-wrap:wrap;gap:8px}.days.svelte-p2zlwf span.svelte-p2zlwf{height:36px;width:36px;border-radius:999px;display:grid;place-items:center;font-size:12px;font-weight:700;background:#f1f5f9;color:#94a3b8}.days.svelte-p2zlwf span.active.svelte-p2zlwf{background:#10b981;color:#ffffff}.list.svelte-p2zlwf.svelte-p2zlwf{display:grid;gap:8px}.list-item.svelte-p2zlwf.svelte-p2zlwf{display:flex;justify-content:space-between;align-items:center;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:8px 12px;font-size:12px;color:#334155}.list-item.svelte-p2zlwf .timestamp.svelte-p2zlwf{display:block;font-size:11px;color:#94a3b8;margin-top:2px}.accent.svelte-p2zlwf.svelte-p2zlwf{color:#10b981;font-weight:700}.line.svelte-p2zlwf.svelte-p2zlwf{display:flex;justify-content:space-between;font-size:13px;color:#334155;padding:4px 0}.muted.svelte-p2zlwf.svelte-p2zlwf{color:#94a3b8;font-size:13px}ul.svelte-p2zlwf.svelte-p2zlwf{margin:0;padding-left:18px;color:#475569;display:grid;gap:6px;font-size:13px}@keyframes svelte-p2zlwf-panel-rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}@keyframes svelte-p2zlwf-float{0%,100%{transform:translateY(0)}50%{transform:translateY(12px)}}");
}
function ql(l, e, t) {
  const s = l.slice();
  return s[41] = e[t], s;
}
function jl(l, e, t) {
  const s = l.slice();
  return s[44] = e[t], s;
}
function Cl(l, e, t) {
  const s = l.slice();
  return s[47] = e[t], s;
}
function Sl(l, e, t) {
  const s = l.slice();
  return s[50] = e[t], s;
}
function Ll(l, e, t) {
  const s = l.slice();
  return s[53] = e[t], s[55] = t, s;
}
function Tl(l) {
  let e, t;
  return {
    c() {
      e = d("p"), t = z(
        /*email*/
        l[1]
      ), a(e, "class", "email svelte-p2zlwf");
    },
    m(s, i) {
      L(s, e, i), n(e, t);
    },
    p(s, i) {
      i[0] & /*email*/
      2 && A(
        t,
        /*email*/
        s[1]
      );
    },
    d(s) {
      s && S(e);
    }
  };
}
function El(l) {
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
      L(t, e, s);
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
      t && S(e);
    }
  };
}
function Al(l) {
  let e, t, s, i, c, r, o, f, p, u, v, m, h, b, g, x, q, M;
  const k = [fn, cn], _ = [];
  function T(w, j) {
    return (
      /*xpItems*/
      w[3].length === 0 ? 0 : 1
    );
  }
  return b = T(l), g = _[b] = k[b](l), {
    c() {
      e = d("div"), t = d("label"), s = z(`Desde
          `), i = d("input"), c = y(), r = d("label"), o = z(`Hasta
          `), f = d("input"), p = y(), u = d("button"), u.textContent = "Limpiar", v = y(), m = d("button"), m.textContent = "Aplicar", h = y(), g.c(), x = et(), a(i, "type", "date"), a(i, "class", "svelte-p2zlwf"), a(t, "class", "svelte-p2zlwf"), a(f, "type", "date"), a(f, "class", "svelte-p2zlwf"), a(r, "class", "svelte-p2zlwf"), a(u, "type", "button"), a(u, "class", "ghost svelte-p2zlwf"), a(m, "type", "button"), a(m, "class", "apply svelte-p2zlwf"), a(e, "class", "xp-controls svelte-p2zlwf");
    },
    m(w, j) {
      L(w, e, j), n(e, t), n(t, s), n(t, i), Ve(
        i,
        /*filterFrom*/
        l[6]
      ), n(e, c), n(e, r), n(r, o), n(r, f), Ve(
        f,
        /*filterTo*/
        l[7]
      ), n(e, p), n(e, u), n(e, v), n(e, m), L(w, h, j), _[b].m(w, j), L(w, x, j), q || (M = [
        O(
          i,
          "input",
          /*input0_input_handler*/
          l[35]
        ),
        O(
          f,
          "input",
          /*input1_input_handler*/
          l[36]
        ),
        O(u, "click", It(
          /*click_handler_1*/
          l[37]
        )),
        O(m, "click", It(
          /*click_handler_2*/
          l[38]
        ))
      ], q = !0);
    },
    p(w, j) {
      j[0] & /*filterFrom*/
      64 && Ve(
        i,
        /*filterFrom*/
        w[6]
      ), j[0] & /*filterTo*/
      128 && Ve(
        f,
        /*filterTo*/
        w[7]
      );
      let E = b;
      b = T(w), b === E ? _[b].p(w, j) : (Yt(), ht(_[E], 1, 1, () => {
        _[E] = null;
      }), Ot(), g = _[b], g ? g.p(w, j) : (g = _[b] = k[b](w), g.c()), Ge(g, 1), g.m(x.parentNode, x));
    },
    d(w) {
      w && (S(e), S(h), S(x)), _[b].d(w), q = !1, ke(M);
    }
  };
}
function cn(l) {
  let e, t, s, i, c, r, o, f, p, u, v, m = Z(
    /*xpItems*/
    l[3]
  ), h = [];
  for (let g = 0; g < m.length; g += 1)
    h[g] = Ml(Sl(l, m, g));
  let b = (
    /*shownCount*/
    l[8] < /*totalCount*/
    l[2] && Nl(l)
  );
  return {
    c() {
      e = d("div");
      for (let g = 0; g < h.length; g += 1)
        h[g].c();
      s = y(), i = d("div"), c = d("span"), r = z("Mostrando "), o = z(
        /*shownCount*/
        l[8]
      ), f = z(" de "), p = z(
        /*totalCount*/
        l[2]
      ), u = y(), b && b.c(), a(e, "class", "list svelte-p2zlwf"), a(c, "class", "muted svelte-p2zlwf"), a(i, "class", "xp-footer svelte-p2zlwf");
    },
    m(g, x) {
      L(g, e, x);
      for (let q = 0; q < h.length; q += 1)
        h[q] && h[q].m(e, null);
      L(g, s, x), L(g, i, x), n(i, c), n(c, r), n(c, o), n(c, f), n(c, p), n(i, u), b && b.m(i, null), v = !0;
    },
    p(g, x) {
      if (x[0] & /*xpItems, formatTimestamp, getXpLabel*/
      393224) {
        m = Z(
          /*xpItems*/
          g[3]
        );
        let q;
        for (q = 0; q < m.length; q += 1) {
          const M = Sl(g, m, q);
          h[q] ? h[q].p(M, x) : (h[q] = Ml(M), h[q].c(), h[q].m(e, null));
        }
        for (; q < h.length; q += 1)
          h[q].d(1);
        h.length = m.length;
      }
      (!v || x[0] & /*shownCount*/
      256) && A(
        o,
        /*shownCount*/
        g[8]
      ), (!v || x[0] & /*totalCount*/
      4) && A(
        p,
        /*totalCount*/
        g[2]
      ), /*shownCount*/
      g[8] < /*totalCount*/
      g[2] ? b ? b.p(g, x) : (b = Nl(g), b.c(), b.m(i, null)) : b && (b.d(1), b = null);
    },
    i(g) {
      v || (g && Ne(() => {
        v && (t || (t = Le(e, $e, { y: 6, duration: 180 }, !0)), t.run(1));
      }), v = !0);
    },
    o(g) {
      g && (t || (t = Le(e, $e, { y: 6, duration: 180 }, !1)), t.run(0)), v = !1;
    },
    d(g) {
      g && (S(e), S(s), S(i)), He(h, g), g && t && t.end(), b && b.d();
    }
  };
}
function fn(l) {
  let e, t, s;
  return {
    c() {
      e = d("p"), e.textContent = "Sin movimientos recientes.", a(e, "class", "muted svelte-p2zlwf");
    },
    m(i, c) {
      L(i, e, c), s = !0;
    },
    p: D,
    i(i) {
      s || (i && Ne(() => {
        s && (t || (t = Le(e, $e, { y: 6, duration: 180 }, !0)), t.run(1));
      }), s = !0);
    },
    o(i) {
      i && (t || (t = Le(e, $e, { y: 6, duration: 180 }, !1)), t.run(0)), s = !1;
    },
    d(i) {
      i && S(e), i && t && t.end();
    }
  };
}
function Ml(l) {
  var q, M;
  let e, t, s, i = (
    /*getXpLabel*/
    l[17](
      /*entry*/
      l[50]
    ) + ""
  ), c, r, o, f = (
    /*formatTimestamp*/
    l[18](
      /*entry*/
      (q = l[50]) == null ? void 0 : q.created_at
    ) + ""
  ), p, u, v, m, h = (
    /*entry*/
    (((M = l[50]) == null ? void 0 : M.points) ?? 0) + ""
  ), b, g, x;
  return {
    c() {
      e = d("div"), t = d("div"), s = d("span"), c = z(i), r = y(), o = d("span"), p = z(f), u = y(), v = d("span"), m = z("+"), b = z(h), g = z(" PA"), x = y(), a(o, "class", "timestamp svelte-p2zlwf"), a(v, "class", "accent svelte-p2zlwf"), a(e, "class", "list-item svelte-p2zlwf");
    },
    m(k, _) {
      L(k, e, _), n(e, t), n(t, s), n(s, c), n(t, r), n(t, o), n(o, p), n(e, u), n(e, v), n(v, m), n(v, b), n(v, g), n(e, x);
    },
    p(k, _) {
      var T, w;
      _[0] & /*xpItems*/
      8 && i !== (i = /*getXpLabel*/
      k[17](
        /*entry*/
        k[50]
      ) + "") && A(c, i), _[0] & /*xpItems*/
      8 && f !== (f = /*formatTimestamp*/
      k[18](
        /*entry*/
        (T = k[50]) == null ? void 0 : T.created_at
      ) + "") && A(p, f), _[0] & /*xpItems*/
      8 && h !== (h = /*entry*/
      (((w = k[50]) == null ? void 0 : w.points) ?? 0) + "") && A(b, h);
    },
    d(k) {
      k && S(e);
    }
  };
}
function Nl(l) {
  let e, t, s;
  return {
    c() {
      e = d("button"), e.textContent = "Ver más", a(e, "type", "button"), a(e, "class", "apply svelte-p2zlwf");
    },
    m(i, c) {
      L(i, e, c), t || (s = O(e, "click", It(
        /*click_handler_3*/
        l[39]
      )), t = !0);
    },
    p: D,
    d(i) {
      i && S(e), t = !1, s();
    }
  };
}
function dn(l) {
  let e, t = Z(
    /*categories*/
    l[12].slice(0, 8)
  ), s = [];
  for (let i = 0; i < t.length; i += 1)
    s[i] = Il(Cl(l, t, i));
  return {
    c() {
      for (let i = 0; i < s.length; i += 1)
        s[i].c();
      e = et();
    },
    m(i, c) {
      for (let r = 0; r < s.length; r += 1)
        s[r] && s[r].m(i, c);
      L(i, e, c);
    },
    p(i, c) {
      if (c[0] & /*categories*/
      4096) {
        t = Z(
          /*categories*/
          i[12].slice(0, 8)
        );
        let r;
        for (r = 0; r < t.length; r += 1) {
          const o = Cl(i, t, r);
          s[r] ? s[r].p(o, c) : (s[r] = Il(o), s[r].c(), s[r].m(e.parentNode, e));
        }
        for (; r < s.length; r += 1)
          s[r].d(1);
        s.length = t.length;
      }
    },
    d(i) {
      i && S(e), He(s, i);
    }
  };
}
function un(l) {
  let e;
  return {
    c() {
      e = d("p"), e.textContent = "Sin actividad registrada.", a(e, "class", "muted svelte-p2zlwf");
    },
    m(t, s) {
      L(t, e, s);
    },
    p: D,
    d(t) {
      t && S(e);
    }
  };
}
function Il(l) {
  let e, t, s = (
    /*cat*/
    l[47].category + ""
  ), i, c, r, o = (
    /*cat*/
    l[47].total_sessions + ""
  ), f, p;
  return {
    c() {
      e = d("div"), t = d("span"), i = z(s), c = y(), r = d("strong"), f = z(o), p = y(), a(t, "class", "svelte-p2zlwf"), a(r, "class", "svelte-p2zlwf"), a(e, "class", "line svelte-p2zlwf");
    },
    m(u, v) {
      L(u, e, v), n(e, t), n(t, i), n(e, c), n(e, r), n(r, f), n(e, p);
    },
    p(u, v) {
      v[0] & /*categories*/
      4096 && s !== (s = /*cat*/
      u[47].category + "") && A(i, s), v[0] & /*categories*/
      4096 && o !== (o = /*cat*/
      u[47].total_sessions + "") && A(f, o);
    },
    d(u) {
      u && S(e);
    }
  };
}
function pn(l) {
  let e, t = Z(
    /*favorites*/
    l[11].slice(0, 8)
  ), s = [];
  for (let i = 0; i < t.length; i += 1)
    s[i] = Pl(jl(l, t, i));
  return {
    c() {
      for (let i = 0; i < s.length; i += 1)
        s[i].c();
      e = et();
    },
    m(i, c) {
      for (let r = 0; r < s.length; r += 1)
        s[r] && s[r].m(i, c);
      L(i, e, c);
    },
    p(i, c) {
      if (c[0] & /*favorites*/
      2048) {
        t = Z(
          /*favorites*/
          i[11].slice(0, 8)
        );
        let r;
        for (r = 0; r < t.length; r += 1) {
          const o = jl(i, t, r);
          s[r] ? s[r].p(o, c) : (s[r] = Pl(o), s[r].c(), s[r].m(e.parentNode, e));
        }
        for (; r < s.length; r += 1)
          s[r].d(1);
        s.length = t.length;
      }
    },
    d(i) {
      i && S(e), He(s, i);
    }
  };
}
function vn(l) {
  let e;
  return {
    c() {
      e = d("p"), e.textContent = "Aún no hay ejercicios destacados.", a(e, "class", "muted svelte-p2zlwf");
    },
    m(t, s) {
      L(t, e, s);
    },
    p: D,
    d(t) {
      t && S(e);
    }
  };
}
function Pl(l) {
  let e, t, s = (
    /*fav*/
    l[44].title + ""
  ), i, c, r, o = (
    /*fav*/
    l[44].total_sessions + ""
  ), f, p, u;
  return {
    c() {
      e = d("div"), t = d("span"), i = z(s), c = y(), r = d("strong"), f = z(o), p = z("x"), u = y(), a(t, "class", "svelte-p2zlwf"), a(r, "class", "svelte-p2zlwf"), a(e, "class", "line svelte-p2zlwf");
    },
    m(v, m) {
      L(v, e, m), n(e, t), n(t, i), n(e, c), n(e, r), n(r, f), n(r, p), n(e, u);
    },
    p(v, m) {
      m[0] & /*favorites*/
      2048 && s !== (s = /*fav*/
      v[44].title + "") && A(i, s), m[0] & /*favorites*/
      2048 && o !== (o = /*fav*/
      v[44].total_sessions + "") && A(f, o);
    },
    d(v) {
      v && S(e);
    }
  };
}
function mn(l) {
  let e, t = Z(
    /*insightItems*/
    l[10]
  ), s = [];
  for (let i = 0; i < t.length; i += 1)
    s[i] = Rl(ql(l, t, i));
  return {
    c() {
      e = d("ul");
      for (let i = 0; i < s.length; i += 1)
        s[i].c();
      a(e, "class", "svelte-p2zlwf");
    },
    m(i, c) {
      L(i, e, c);
      for (let r = 0; r < s.length; r += 1)
        s[r] && s[r].m(e, null);
    },
    p(i, c) {
      if (c[0] & /*insightItems*/
      1024) {
        t = Z(
          /*insightItems*/
          i[10]
        );
        let r;
        for (r = 0; r < t.length; r += 1) {
          const o = ql(i, t, r);
          s[r] ? s[r].p(o, c) : (s[r] = Rl(o), s[r].c(), s[r].m(e, null));
        }
        for (; r < s.length; r += 1)
          s[r].d(1);
        s.length = t.length;
      }
    },
    d(i) {
      i && S(e), He(s, i);
    }
  };
}
function gn(l) {
  let e;
  return {
    c() {
      e = d("p"), e.textContent = "Sin insights por ahora.", a(e, "class", "muted svelte-p2zlwf");
    },
    m(t, s) {
      L(t, e, s);
    },
    p: D,
    d(t) {
      t && S(e);
    }
  };
}
function Rl(l) {
  let e, t = (
    /*item*/
    l[41] + ""
  ), s;
  return {
    c() {
      e = d("li"), s = z(t);
    },
    m(i, c) {
      L(i, e, c), n(e, s);
    },
    p(i, c) {
      c[0] & /*insightItems*/
      1024 && t !== (t = /*item*/
      i[41] + "") && A(s, t);
    },
    d(i) {
      i && S(e);
    }
  };
}
function hn(l) {
  let e, t, s, i, c, r, o, f, p, u, v, m, h, b, g = (
    /*summaryData*/
    l[15].total_exercises + ""
  ), x, q, M, k, _, T, w = (
    /*summaryData*/
    l[15].weekly_sessions + ""
  ), j, E, I, B, V, R, U = Number(
    /*summaryData*/
    l[15].avg_satisfaction || 0
  ).toFixed(1) + "", P, N, J, re, Q, te, W, G, ge, ne, le, $, Y = (
    /*summaryData*/
    l[15].distinct_days + ""
  ), K, X, se, Ee, Je, we, Pe = (
    /*formatMinutes*/
    l[16](
      /*timeData*/
      l[14].week_minutes
    ) + ""
  ), rt, Ye, je, tt, Ae, Oe, Qe = (
    /*formatMinutes*/
    l[16](
      /*timeData*/
      l[14].month_minutes
    ) + ""
  ), We, at, Fe, Ce, oe, be, ce, he = (
    /*activeDays*/
    l[13].length + ""
  ), xe, _e, F, ie, fe, Re, Ke, St, Ut, ot, Gt, Jt, ct, lt, Lt, Qt, Wt, st, Tt, Kt, Zt, it, bt, $t, Et, el, ze = (
    /*email*/
    l[1] && Tl(l)
  ), At = Z(["L", "M", "X", "J", "V", "S", "D"]), Me = [];
  for (let H = 0; H < 7; H += 1)
    Me[H] = El(Ll(l, At, H));
  let qe = (
    /*xpOpen*/
    l[5] && Al(l)
  );
  function tl(H, ae) {
    return (
      /*categories*/
      H[12].length === 0 ? un : dn
    );
  }
  let xt = tl(l), De = xt(l);
  function ll(H, ae) {
    return (
      /*favorites*/
      H[11].length === 0 ? vn : pn
    );
  }
  let _t = ll(l), Xe = _t(l);
  function sl(H, ae) {
    return (
      /*insightItems*/
      H[10].length === 0 ? gn : mn
    );
  }
  let yt = sl(l), Be = yt(l);
  return {
    c() {
      e = d("div"), t = d("section"), s = d("div"), i = d("p"), i.textContent = "Estadísticas avanzadas", c = y(), r = d("h1"), o = z(
        /*name*/
        l[0]
      ), f = y(), ze && ze.c(), p = y(), u = d("div"), v = d("div"), m = d("span"), m.textContent = "Total de pausas", h = y(), b = d("strong"), x = z(g), q = y(), M = d("div"), k = d("span"), k.textContent = "Sesiones esta semana", _ = y(), T = d("strong"), j = z(w), E = y(), I = d("div"), B = d("span"), B.textContent = "Satisfacción promedio", V = y(), R = d("strong"), P = z(U), N = z(" / 5"), J = y(), re = d("div"), Q = y(), te = d("div"), W = y(), G = d("section"), ge = d("div"), ne = d("span"), ne.textContent = "Días activos", le = y(), $ = d("strong"), K = z(Y), X = y(), se = d("div"), Ee = d("span"), Ee.textContent = "Tiempo saludable (7 días)", Je = y(), we = d("strong"), rt = z(Pe), Ye = y(), je = d("div"), tt = d("span"), tt.textContent = "Tiempo saludable (30 días)", Ae = y(), Oe = d("strong"), We = z(Qe), at = y(), Fe = d("section"), Ce = d("div"), oe = d("h2"), oe.textContent = "Actividad semanal", be = y(), ce = d("span"), xe = z(he), _e = z("/7 días activos"), F = y(), ie = d("div");
      for (let H = 0; H < 7; H += 1)
        Me[H].c();
      fe = y(), Re = d("section"), Ke = d("button"), St = d("div"), St.innerHTML = '<h2 class="svelte-p2zlwf">Historial de XP</h2> <p class="muted svelte-p2zlwf">Últimos movimientos</p>', Ut = y(), ot = d("span"), ot.textContent = "⌄", Gt = y(), qe && qe.c(), Jt = y(), ct = d("section"), lt = d("div"), Lt = d("h3"), Lt.textContent = "Categorías favoritas", Qt = y(), De.c(), Wt = y(), st = d("div"), Tt = d("h3"), Tt.textContent = "Ejercicios más repetidos", Kt = y(), Xe.c(), Zt = y(), it = d("section"), bt = d("h2"), bt.textContent = "Insights", $t = y(), Be.c(), a(i, "class", "eyebrow svelte-p2zlwf"), a(r, "class", "svelte-p2zlwf"), a(v, "class", "hero-card svelte-p2zlwf"), a(M, "class", "hero-card accent svelte-p2zlwf"), a(I, "class", "hero-card svelte-p2zlwf"), a(u, "class", "hero-cards svelte-p2zlwf"), a(re, "class", "orb svelte-p2zlwf"), a(te, "class", "orb small svelte-p2zlwf"), a(t, "class", "hero svelte-p2zlwf"), a(ne, "class", "svelte-p2zlwf"), a($, "class", "svelte-p2zlwf"), a(ge, "class", "card svelte-p2zlwf"), a(Ee, "class", "svelte-p2zlwf"), a(we, "class", "svelte-p2zlwf"), a(se, "class", "card svelte-p2zlwf"), a(tt, "class", "svelte-p2zlwf"), a(Oe, "class", "svelte-p2zlwf"), a(je, "class", "card svelte-p2zlwf"), a(G, "class", "grid svelte-p2zlwf"), a(oe, "class", "svelte-p2zlwf"), a(ce, "class", "muted svelte-p2zlwf"), a(Ce, "class", "row svelte-p2zlwf"), a(ie, "class", "days svelte-p2zlwf"), a(Fe, "class", "section svelte-p2zlwf"), a(ot, "class", "svelte-p2zlwf"), Ze(
        ot,
        "rotated",
        /*xpOpen*/
        l[5]
      ), a(Ke, "type", "button"), a(Ke, "class", "xp-toggle svelte-p2zlwf"), a(Re, "class", "section xp svelte-p2zlwf"), a(lt, "class", "card svelte-p2zlwf"), a(st, "class", "card svelte-p2zlwf"), a(ct, "class", "grid two svelte-p2zlwf"), a(bt, "class", "svelte-p2zlwf"), a(it, "class", "section svelte-p2zlwf"), a(e, "class", "panel svelte-p2zlwf");
    },
    m(H, ae) {
      L(H, e, ae), n(e, t), n(t, s), n(s, i), n(s, c), n(s, r), n(r, o), n(s, f), ze && ze.m(s, null), n(t, p), n(t, u), n(u, v), n(v, m), n(v, h), n(v, b), n(b, x), n(u, q), n(u, M), n(M, k), n(M, _), n(M, T), n(T, j), n(u, E), n(u, I), n(I, B), n(I, V), n(I, R), n(R, P), n(R, N), n(t, J), n(t, re), n(t, Q), n(t, te), n(e, W), n(e, G), n(G, ge), n(ge, ne), n(ge, le), n(ge, $), n($, K), n(G, X), n(G, se), n(se, Ee), n(se, Je), n(se, we), n(we, rt), n(G, Ye), n(G, je), n(je, tt), n(je, Ae), n(je, Oe), n(Oe, We), n(e, at), n(e, Fe), n(Fe, Ce), n(Ce, oe), n(Ce, be), n(Ce, ce), n(ce, xe), n(ce, _e), n(Fe, F), n(Fe, ie);
      for (let ye = 0; ye < 7; ye += 1)
        Me[ye] && Me[ye].m(ie, null);
      n(e, fe), n(e, Re), n(Re, Ke), n(Ke, St), n(Ke, Ut), n(Ke, ot), n(Re, Gt), qe && qe.m(Re, null), n(e, Jt), n(e, ct), n(ct, lt), n(lt, Lt), n(lt, Qt), De.m(lt, null), n(ct, Wt), n(ct, st), n(st, Tt), n(st, Kt), Xe.m(st, null), n(e, Zt), n(e, it), n(it, bt), n(it, $t), Be.m(it, null), Et || (el = O(
        Ke,
        "click",
        /*click_handler*/
        l[34]
      ), Et = !0);
    },
    p(H, ae) {
      if (ae[0] & /*name*/
      1 && A(
        o,
        /*name*/
        H[0]
      ), /*email*/
      H[1] ? ze ? ze.p(H, ae) : (ze = Tl(H), ze.c(), ze.m(s, null)) : ze && (ze.d(1), ze = null), ae[0] & /*summaryData*/
      32768 && g !== (g = /*summaryData*/
      H[15].total_exercises + "") && A(x, g), ae[0] & /*summaryData*/
      32768 && w !== (w = /*summaryData*/
      H[15].weekly_sessions + "") && A(j, w), ae[0] & /*summaryData*/
      32768 && U !== (U = Number(
        /*summaryData*/
        H[15].avg_satisfaction || 0
      ).toFixed(1) + "") && A(P, U), ae[0] & /*summaryData*/
      32768 && Y !== (Y = /*summaryData*/
      H[15].distinct_days + "") && A(K, Y), ae[0] & /*timeData*/
      16384 && Pe !== (Pe = /*formatMinutes*/
      H[16](
        /*timeData*/
        H[14].week_minutes
      ) + "") && A(rt, Pe), ae[0] & /*timeData*/
      16384 && Qe !== (Qe = /*formatMinutes*/
      H[16](
        /*timeData*/
        H[14].month_minutes
      ) + "") && A(We, Qe), ae[0] & /*activeDays*/
      8192 && he !== (he = /*activeDays*/
      H[13].length + "") && A(xe, he), ae[0] & /*activeDays*/
      8192) {
        At = Z(["L", "M", "X", "J", "V", "S", "D"]);
        let ye;
        for (ye = 0; ye < 7; ye += 1) {
          const il = Ll(H, At, ye);
          Me[ye] ? Me[ye].p(il, ae) : (Me[ye] = El(il), Me[ye].c(), Me[ye].m(ie, null));
        }
        for (; ye < 7; ye += 1)
          Me[ye].d(1);
      }
      ae[0] & /*xpOpen*/
      32 && Ze(
        ot,
        "rotated",
        /*xpOpen*/
        H[5]
      ), /*xpOpen*/
      H[5] ? qe ? qe.p(H, ae) : (qe = Al(H), qe.c(), qe.m(Re, null)) : qe && (qe.d(1), qe = null), xt === (xt = tl(H)) && De ? De.p(H, ae) : (De.d(1), De = xt(H), De && (De.c(), De.m(lt, null))), _t === (_t = ll(H)) && Xe ? Xe.p(H, ae) : (Xe.d(1), Xe = _t(H), Xe && (Xe.c(), Xe.m(st, null))), yt === (yt = sl(H)) && Be ? Be.p(H, ae) : (Be.d(1), Be = yt(H), Be && (Be.c(), Be.m(it, null)));
    },
    i: D,
    o: D,
    d(H) {
      H && S(e), ze && ze.d(), He(Me, H), qe && qe.d(), De.d(), Xe.d(), Be.d(), Et = !1, el();
    }
  };
}
function bn(l, e, t) {
  let s, i, c, r, o, f, p, u, v, m, h, { name: b = "Usuario" } = e, { email: g = "" } = e, { summary: x = "" } = e, { timeSummary: q = "" } = e, { weeklyActiveDays: M = "" } = e, { xpHistory: k = "" } = e, { categoryDistribution: _ = "" } = e, { favoriteVideos: T = "" } = e, { insights: w = "" } = e, { xpTotal: j = 0 } = e, { xpLimit: E = 10 } = e, { xpOffset: I = 0 } = e, { xpFrom: B = "" } = e, { xpTo: V = "" } = e;
  const R = (X, se) => {
    if (!X || typeof X != "string") return se;
    try {
      return JSON.parse(X);
    } catch {
      return se;
    }
  }, U = (X) => X ? X < 60 ? `${Math.round(X)} min` : `${(X / 60).toFixed(1)} h` : "0 min", P = (X) => {
    var Ee, Je;
    const se = ((Ee = X == null ? void 0 : X.metadata) == null ? void 0 : Ee.source) || (X == null ? void 0 : X.action_type) || "XP";
    if (se === "achievement") {
      const we = (Je = X == null ? void 0 : X.metadata) == null ? void 0 : Je.achievement_title;
      return we ? `Logro · ${we}` : "Logro";
    }
    return se === "weekly_challenge" ? "Reto semanal" : se === "questionnaire" ? "Cuestionario" : se === "active_pause" || se === "pause" ? "Pausa activa" : "XP";
  }, N = (X) => {
    if (!X) return "";
    const se = new Date(X);
    return Number.isNaN(se.getTime()) ? "" : se.toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" });
  }, J = Ie();
  let re = !1, Q = B, te = V, W = B, G = V;
  const ge = () => t(5, re = !re);
  function ne() {
    Q = this.value, t(6, Q), t(30, B), t(32, W);
  }
  function le() {
    te = this.value, t(7, te), t(31, V), t(33, G);
  }
  const $ = () => {
    t(6, Q = ""), t(7, te = ""), J("xpfilter", { from: "", to: "" });
  }, Y = () => {
    J("xpfilter", { from: Q, to: te });
  }, K = () => {
    J("xploadmore", { nextOffset: v + u });
  };
  return l.$$set = (X) => {
    "name" in X && t(0, b = X.name), "email" in X && t(1, g = X.email), "summary" in X && t(20, x = X.summary), "timeSummary" in X && t(21, q = X.timeSummary), "weeklyActiveDays" in X && t(22, M = X.weeklyActiveDays), "xpHistory" in X && t(23, k = X.xpHistory), "categoryDistribution" in X && t(24, _ = X.categoryDistribution), "favoriteVideos" in X && t(25, T = X.favoriteVideos), "insights" in X && t(26, w = X.insights), "xpTotal" in X && t(27, j = X.xpTotal), "xpLimit" in X && t(28, E = X.xpLimit), "xpOffset" in X && t(29, I = X.xpOffset), "xpFrom" in X && t(30, B = X.xpFrom), "xpTo" in X && t(31, V = X.xpTo);
  }, l.$$.update = () => {
    l.$$.dirty[0] & /*summary*/
    1048576 && t(15, s = R(x, {
      total_exercises: 0,
      weekly_sessions: 0,
      avg_satisfaction: 0,
      distinct_days: 0
    })), l.$$.dirty[0] & /*timeSummary*/
    2097152 && t(14, i = R(q, { week_minutes: 0, month_minutes: 0 })), l.$$.dirty[0] & /*weeklyActiveDays*/
    4194304 && t(13, c = R(M, [])), l.$$.dirty[0] & /*xpHistory*/
    8388608 && t(3, r = R(k, [])), l.$$.dirty[0] & /*categoryDistribution*/
    16777216 && t(12, o = R(_, [])), l.$$.dirty[0] & /*favoriteVideos*/
    33554432 && t(11, f = R(T, [])), l.$$.dirty[0] & /*insights*/
    67108864 && t(10, p = R(w, [])), l.$$.dirty[0] & /*xpFrom*/
    1073741824 | l.$$.dirty[1] & /*lastXpFrom*/
    2 && B !== W && (t(6, Q = B), t(32, W = B)), l.$$.dirty[1] & /*xpTo, lastXpTo*/
    5 && V !== G && (t(7, te = V), t(33, G = V)), l.$$.dirty[0] & /*xpLimit*/
    268435456 && t(9, u = Number(E) || 10), l.$$.dirty[0] & /*xpOffset*/
    536870912 && t(4, v = Number(I) || 0), l.$$.dirty[0] & /*xpTotal, xpItems*/
    134217736 && t(2, m = Number(j) || r.length), l.$$.dirty[0] & /*safeOffset, xpItems, totalCount*/
    28 && t(8, h = Math.min(v + r.length, m));
  }, [
    b,
    g,
    m,
    r,
    v,
    re,
    Q,
    te,
    h,
    u,
    p,
    f,
    o,
    c,
    i,
    s,
    U,
    P,
    N,
    J,
    x,
    q,
    M,
    k,
    _,
    T,
    w,
    j,
    E,
    I,
    B,
    V,
    W,
    G,
    ge,
    ne,
    le,
    $,
    Y,
    K
  ];
}
class Rs extends ve {
  constructor(e) {
    super(), ue(
      this,
      e,
      bn,
      hn,
      ee,
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
      on,
      [-1, -1]
    );
  }
  get name() {
    return this.$$.ctx[0];
  }
  set name(e) {
    this.$$set({ name: e }), C();
  }
  get email() {
    return this.$$.ctx[1];
  }
  set email(e) {
    this.$$set({ email: e }), C();
  }
  get summary() {
    return this.$$.ctx[20];
  }
  set summary(e) {
    this.$$set({ summary: e }), C();
  }
  get timeSummary() {
    return this.$$.ctx[21];
  }
  set timeSummary(e) {
    this.$$set({ timeSummary: e }), C();
  }
  get weeklyActiveDays() {
    return this.$$.ctx[22];
  }
  set weeklyActiveDays(e) {
    this.$$set({ weeklyActiveDays: e }), C();
  }
  get xpHistory() {
    return this.$$.ctx[23];
  }
  set xpHistory(e) {
    this.$$set({ xpHistory: e }), C();
  }
  get categoryDistribution() {
    return this.$$.ctx[24];
  }
  set categoryDistribution(e) {
    this.$$set({ categoryDistribution: e }), C();
  }
  get favoriteVideos() {
    return this.$$.ctx[25];
  }
  set favoriteVideos(e) {
    this.$$set({ favoriteVideos: e }), C();
  }
  get insights() {
    return this.$$.ctx[26];
  }
  set insights(e) {
    this.$$set({ insights: e }), C();
  }
  get xpTotal() {
    return this.$$.ctx[27];
  }
  set xpTotal(e) {
    this.$$set({ xpTotal: e }), C();
  }
  get xpLimit() {
    return this.$$.ctx[28];
  }
  set xpLimit(e) {
    this.$$set({ xpLimit: e }), C();
  }
  get xpOffset() {
    return this.$$.ctx[29];
  }
  set xpOffset(e) {
    this.$$set({ xpOffset: e }), C();
  }
  get xpFrom() {
    return this.$$.ctx[30];
  }
  set xpFrom(e) {
    this.$$set({ xpFrom: e }), C();
  }
  get xpTo() {
    return this.$$.ctx[31];
  }
  set xpTo(e) {
    this.$$set({ xpTo: e }), C();
  }
}
customElements.define("svelte-user-stats-panel", pe(Rs, { name: {}, email: {}, summary: {}, timeSummary: {}, weeklyActiveDays: {}, xpHistory: {}, categoryDistribution: {}, favoriteVideos: {}, insights: {}, xpTotal: {}, xpLimit: {}, xpOffset: {}, xpFrom: {}, xpTo: {} }, [], [], !0));
function xn(l) {
  de(l, "svelte-18r3645", ".podium-wrap.svelte-18r3645.svelte-18r3645{padding:0}.podium-header.svelte-18r3645.svelte-18r3645{display:flex;flex-wrap:wrap;gap:16px;justify-content:space-between;align-items:center;padding-bottom:18px;border-bottom:1px solid rgba(148,163,184,.18)}.eyebrow.svelte-18r3645.svelte-18r3645{font-size:10px;letter-spacing:.32em;text-transform:uppercase;font-weight:600;color:#10b981}h2.svelte-18r3645.svelte-18r3645{margin:6px 0 0;font-size:24px;font-weight:700;color:#0f172a}.scope.svelte-18r3645.svelte-18r3645{margin-top:4px;font-size:13px;color:#64748b}.badge.svelte-18r3645.svelte-18r3645{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:600;color:#0f766e;background:rgba(236,253,245,.7);padding:8px 12px;border-radius:999px}.badge-icon.svelte-18r3645.svelte-18r3645{width:20px;height:20px;display:inline-block;border-radius:50%;background:conic-gradient(from 180deg,#34d399,#bbf7d0,#34d399);position:relative}.badge-icon.svelte-18r3645.svelte-18r3645::after{content:'';position:absolute;inset:5px;border-radius:50%;background:#ecfdf5}.podium-meta.svelte-18r3645.svelte-18r3645{display:flex;justify-content:space-between;align-items:center;font-size:11px;font-weight:600;text-transform:uppercase;color:#64748b}.place.svelte-18r3645.svelte-18r3645{color:#0f766e}.xp.svelte-18r3645.svelte-18r3645{color:#94a3b8}.reward.svelte-18r3645.svelte-18r3645{border-radius:20px;background:rgba(255,255,255,.86);padding:14px;text-align:center;font-size:12px;color:#0f172a;box-shadow:inset 0 0 0 1px rgba(148,163,184,.14);min-height:168px;display:flex;flex-direction:column;justify-content:center;gap:6px}.reward.svelte-18r3645 img.svelte-18r3645{width:100%;height:110px;object-fit:contain;border-radius:14px;background:#fff;margin-bottom:10px}.reward-title.svelte-18r3645.svelte-18r3645{font-size:13px;font-weight:600;margin:0}.reward-desc.svelte-18r3645.svelte-18r3645{margin:6px 0 0;font-size:11px;color:#6b7280}.reward.svelte-18r3645 a.svelte-18r3645{display:inline-block;margin-top:8px;background:#10b981;color:#fff;font-size:11px;padding:6px 12px;border-radius:999px;text-decoration:none}.reward.empty.svelte-18r3645.svelte-18r3645{border:1px dashed rgba(203,213,225,.95);background:rgba(255,255,255,.66);color:#6b7280;text-align:left;justify-content:center}.loading.svelte-18r3645.svelte-18r3645{margin-top:18px;text-align:center;font-size:12px;color:#6b7280}.classic-grid.svelte-18r3645.svelte-18r3645{margin-top:28px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));align-items:start;gap:22px}.classic-card.svelte-18r3645.svelte-18r3645{padding:0;border:none;display:flex;flex-direction:column;gap:14px;min-height:230px;background:transparent}.classic-first.svelte-18r3645.svelte-18r3645,.classic-second.svelte-18r3645.svelte-18r3645,.classic-third.svelte-18r3645.svelte-18r3645{background:transparent;border-color:transparent}.classic-user.svelte-18r3645.svelte-18r3645{margin-top:auto;display:flex;align-items:center;gap:10px}.classic-avatar.svelte-18r3645.svelte-18r3645{width:46px;height:46px;border-radius:50%;object-fit:cover;background:#fff}.classic-avatar.fallback.svelte-18r3645.svelte-18r3645{display:grid;place-items:center;color:#64748b;font-weight:600}.classic-user-meta.svelte-18r3645 p.svelte-18r3645{margin:0;font-size:14px;font-weight:600;color:#0f172a}.classic-user-meta.svelte-18r3645 span.svelte-18r3645{font-size:12px;color:#94a3b8}.podium-grid.svelte-18r3645.svelte-18r3645{margin-top:28px;display:grid;grid-template-columns:1fr;gap:18px}.winner-card.svelte-18r3645.svelte-18r3645{border:none;background:transparent;padding:0;box-shadow:none;animation:svelte-18r3645-rise .9s cubic-bezier(.22,1,.36,1) forwards;opacity:0;transform:translateY(18px) scale(.98)}.winner-layout.svelte-18r3645.svelte-18r3645{margin-top:16px;display:grid;grid-template-columns:auto minmax(0,1fr);gap:16px;align-items:center}.winner-identity.svelte-18r3645.svelte-18r3645{display:flex;flex-direction:column;align-items:center;text-align:center}.winner-avatar.svelte-18r3645.svelte-18r3645{width:80px;height:80px;border-radius:50%;object-fit:cover;background:#fff;box-shadow:0 14px 28px rgba(15,118,110,.12)}.winner-avatar.fallback.svelte-18r3645.svelte-18r3645{display:grid;place-items:center;font-size:28px;font-weight:700;color:#64748b}.winner-name.svelte-18r3645.svelte-18r3645{margin:12px 0 0;font-size:24px;font-weight:700;color:#0f172a}.winner-score.svelte-18r3645.svelte-18r3645{margin-top:4px;font-size:14px;color:#64748b}.empty-copy.svelte-18r3645.svelte-18r3645{display:grid;gap:6px}.empty-copy.svelte-18r3645 strong.svelte-18r3645{font-size:13px;color:#0f172a}.empty-copy.svelte-18r3645 span.svelte-18r3645{font-size:11px;line-height:1.5}.extras-grid.svelte-18r3645.svelte-18r3645{margin-top:26px;display:grid;grid-template-columns:1.1fr .9fr;gap:28px;align-items:start}.extras-card.svelte-18r3645.svelte-18r3645{border:none;background:transparent;padding:0;box-shadow:none}.extras-heading.svelte-18r3645.svelte-18r3645{display:flex;align-items:center;gap:8px}.extras-heading.svelte-18r3645 h3.svelte-18r3645{margin:0;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#059669}.mini-icon.svelte-18r3645.svelte-18r3645{width:16px;height:16px;border-radius:999px;background:linear-gradient(135deg,#10b981,#bbf7d0)}.mini-icon.spark.svelte-18r3645.svelte-18r3645{background:linear-gradient(135deg,#10b981,#34d399,#bbf7d0)}.raffle-grid.svelte-18r3645.svelte-18r3645{margin-top:16px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.raffle-card.svelte-18r3645.svelte-18r3645{border-top:1px solid rgba(226,232,240,.8);padding-top:14px}.raffle-label.svelte-18r3645.svelte-18r3645{margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#64748b}.raffle-image.svelte-18r3645.svelte-18r3645{width:100%;height:110px;object-fit:contain;border-radius:14px;background:#f8fafc;margin-bottom:10px}.entries-box.svelte-18r3645.svelte-18r3645{margin-top:16px;border-radius:18px;background:rgba(16,185,129,.08);padding:16px}.entries-box.svelte-18r3645 p.svelte-18r3645{margin:0;font-size:13px;color:#475569}.entries-box.svelte-18r3645 strong.svelte-18r3645{display:block;margin-top:6px;font-size:32px;color:#047857}.entries-box.svelte-18r3645 span.svelte-18r3645{display:block;margin-top:8px;font-size:11px;color:#64748b}.threshold-list.svelte-18r3645.svelte-18r3645{margin-top:16px;display:grid;gap:10px}.threshold-row.svelte-18r3645.svelte-18r3645{display:flex;justify-content:space-between;gap:12px;align-items:center;border-top:1px solid rgba(226,232,240,.85);padding:12px 2px 0;font-size:13px;color:#475569}.threshold-row.svelte-18r3645 strong.svelte-18r3645{color:#0f172a}@keyframes svelte-18r3645-rise{to{opacity:1;transform:translateY(0) scale(1)}}@media(max-width: 900px){.classic-grid.svelte-18r3645.svelte-18r3645{grid-template-columns:1fr}.winner-layout.svelte-18r3645.svelte-18r3645{grid-template-columns:1fr}.extras-grid.svelte-18r3645.svelte-18r3645{grid-template-columns:1fr}.raffle-grid.svelte-18r3645.svelte-18r3645{grid-template-columns:1fr}}");
}
function Dl(l, e, t) {
  const s = l.slice();
  return s[20] = e[t], s;
}
function Xl(l, e, t) {
  const s = l.slice();
  return s[23] = e[t], s;
}
function Bl(l, e, t) {
  const s = l.slice();
  return s[17] = e[t], s;
}
function Hl(l) {
  let e, t;
  return {
    c() {
      e = d("p"), t = z(
        /*scopeLabel*/
        l[3]
      ), a(e, "class", "scope svelte-18r3645");
    },
    m(s, i) {
      L(s, e, i), n(e, t);
    },
    p(s, i) {
      i & /*scopeLabel*/
      8 && A(
        t,
        /*scopeLabel*/
        s[3]
      );
    },
    d(s) {
      s && S(e);
    }
  };
}
function _n(l) {
  let e = (
    /*playId*/
    l[6]
  ), t, s, i, c, r, o, f, p, u, v, m, h, b, g, x = Number(
    /*userRaffleEntries*/
    l[2] ?? 0
  ).toLocaleString("es-ES") + "", q, M, k, _, T, w = Fl(l), j = Z([{ key: "raffle_a", label: "Sorteo A" }, { key: "raffle_b", label: "Sorteo B" }]), E = [];
  for (let R = 0; R < 2; R += 1)
    E[R] = Vl(Xl(l, j, R));
  function I(R, U) {
    return (
      /*activeThresholds*/
      R[8].length ? Rn : Pn
    );
  }
  let B = I(l), V = B(l);
  return {
    c() {
      w.c(), t = y(), s = d("div"), i = d("article"), c = d("div"), c.innerHTML = '<span class="mini-icon svelte-18r3645"></span> <h3 class="svelte-18r3645">Premios sorteables</h3>', r = y(), o = d("div");
      for (let R = 0; R < 2; R += 1)
        E[R].c();
      f = y(), p = d("article"), u = d("div"), u.innerHTML = '<span class="mini-icon spark svelte-18r3645"></span> <h3 class="svelte-18r3645">Participaciones por puntos</h3>', v = y(), m = d("div"), h = d("p"), h.textContent = "Tus participaciones actuales", b = y(), g = d("strong"), q = z(x), M = y(), k = d("span"), k.textContent = "Se aplica siempre el umbral mas alto que hayas alcanzado.", _ = y(), T = d("div"), V.c(), a(c, "class", "extras-heading svelte-18r3645"), a(o, "class", "raffle-grid svelte-18r3645"), a(i, "class", "extras-card svelte-18r3645"), a(u, "class", "extras-heading svelte-18r3645"), a(h, "class", "svelte-18r3645"), a(g, "class", "svelte-18r3645"), a(k, "class", "svelte-18r3645"), a(m, "class", "entries-box svelte-18r3645"), a(T, "class", "threshold-list svelte-18r3645"), a(p, "class", "extras-card svelte-18r3645"), a(s, "class", "extras-grid svelte-18r3645");
    },
    m(R, U) {
      w.m(R, U), L(R, t, U), L(R, s, U), n(s, i), n(i, c), n(i, r), n(i, o);
      for (let P = 0; P < 2; P += 1)
        E[P] && E[P].m(o, null);
      n(s, f), n(s, p), n(p, u), n(p, v), n(p, m), n(m, h), n(m, b), n(m, g), n(g, q), n(m, M), n(m, k), n(p, _), n(p, T), V.m(T, null);
    },
    p(R, U) {
      if (U & /*playId*/
      64 && ee(e, e = /*playId*/
      R[6]) ? (w.d(1), w = Fl(R), w.c(), w.m(t.parentNode, t)) : w.p(R, U), U & /*resolveRaffleReward*/
      1024) {
        j = Z([
          { key: "raffle_a", label: "Sorteo A" },
          { key: "raffle_b", label: "Sorteo B" }
        ]);
        let P;
        for (P = 0; P < 2; P += 1) {
          const N = Xl(R, j, P);
          E[P] ? E[P].p(N, U) : (E[P] = Vl(N), E[P].c(), E[P].m(o, null));
        }
        for (; P < 2; P += 1)
          E[P].d(1);
      }
      U & /*userRaffleEntries*/
      4 && x !== (x = Number(
        /*userRaffleEntries*/
        R[2] ?? 0
      ).toLocaleString("es-ES") + "") && A(q, x), B === (B = I(R)) && V ? V.p(R, U) : (V.d(1), V = B(R), V && (V.c(), V.m(T, null)));
    },
    d(R) {
      R && (S(t), S(s)), w.d(R), He(E, R), V.d();
    }
  };
}
function yn(l) {
  let e, t = Z([
    {
      place: 2,
      key: "raffle_a",
      className: "classic-second"
    },
    {
      place: 1,
      key: "guaranteed_winner",
      className: "classic-first"
    },
    {
      place: 3,
      key: "raffle_b",
      className: "classic-third"
    }
  ]), s = [];
  for (let i = 0; i < 3; i += 1)
    s[i] = Wl(Bl(l, t, i));
  return {
    c() {
      e = d("div");
      for (let i = 0; i < 3; i += 1)
        s[i].c();
      a(e, "class", "classic-grid svelte-18r3645");
    },
    m(i, c) {
      L(i, e, c);
      for (let r = 0; r < 3; r += 1)
        s[r] && s[r].m(e, null);
    },
    p(i, c) {
      if (c & /*classicUsers, rewards*/
      33) {
        t = Z([
          {
            place: 2,
            key: "raffle_a",
            className: "classic-second"
          },
          {
            place: 1,
            key: "guaranteed_winner",
            className: "classic-first"
          },
          {
            place: 3,
            key: "raffle_b",
            className: "classic-third"
          }
        ]);
        let r;
        for (r = 0; r < 3; r += 1) {
          const o = Bl(i, t, r);
          s[r] ? s[r].p(o, c) : (s[r] = Wl(o), s[r].c(), s[r].m(e, null));
        }
        for (; r < 3; r += 1)
          s[r].d(1);
      }
    },
    d(i) {
      i && S(e), He(s, i);
    }
  };
}
function Yl(l) {
  let e, t, s = (
    /*winner*/
    l[7].periodical_exp + ""
  ), i, c;
  return {
    c() {
      e = d("span"), t = z("+"), i = z(s), c = z(" XP"), a(e, "class", "xp svelte-18r3645");
    },
    m(r, o) {
      L(r, e, o), n(e, t), n(e, i), n(e, c);
    },
    p(r, o) {
      o & /*winner*/
      128 && s !== (s = /*winner*/
      r[7].periodical_exp + "") && A(i, s);
    },
    d(r) {
      r && S(e);
    }
  };
}
function kn(l) {
  let e, t = (
    /*winner*/
    (l[7].first_name || /*winner*/
    l[7].last_name || "?").charAt(0) + ""
  ), s;
  return {
    c() {
      e = d("div"), s = z(t), a(e, "class", "winner-avatar fallback svelte-18r3645");
    },
    m(i, c) {
      L(i, e, c), n(e, s);
    },
    p(i, c) {
      c & /*winner*/
      128 && t !== (t = /*winner*/
      (i[7].first_name || /*winner*/
      i[7].last_name || "?").charAt(0) + "") && A(s, t);
    },
    d(i) {
      i && S(e);
    }
  };
}
function wn(l) {
  let e, t, s;
  return {
    c() {
      e = d("img"), Te(e.src, t = /*winner*/
      l[7].avatar_url) || a(e, "src", t), a(e, "alt", s = /*winner*/
      l[7].first_name), a(e, "class", "winner-avatar svelte-18r3645"), a(e, "loading", "lazy");
    },
    m(i, c) {
      L(i, e, c);
    },
    p(i, c) {
      c & /*winner*/
      128 && !Te(e.src, t = /*winner*/
      i[7].avatar_url) && a(e, "src", t), c & /*winner*/
      128 && s !== (s = /*winner*/
      i[7].first_name) && a(e, "alt", s);
    },
    d(i) {
      i && S(e);
    }
  };
}
function zn(l) {
  let e;
  return {
    c() {
      e = d("div"), e.textContent = "?", a(e, "class", "winner-avatar fallback svelte-18r3645");
    },
    m(t, s) {
      L(t, e, s);
    },
    p: D,
    d(t) {
      t && S(e);
    }
  };
}
function qn(l) {
  let e = (
    /*winner*/
    l[7].first_name + ""
  ), t, s, i = (
    /*winner*/
    l[7].last_name + ""
  ), c;
  return {
    c() {
      t = z(e), s = y(), c = z(i);
    },
    m(r, o) {
      L(r, t, o), L(r, s, o), L(r, c, o);
    },
    p(r, o) {
      o & /*winner*/
      128 && e !== (e = /*winner*/
      r[7].first_name + "") && A(t, e), o & /*winner*/
      128 && i !== (i = /*winner*/
      r[7].last_name + "") && A(c, i);
    },
    d(r) {
      r && (S(t), S(s), S(c));
    }
  };
}
function jn(l) {
  let e;
  return {
    c() {
      e = z("Aun sin ganador");
    },
    m(t, s) {
      L(t, e, s);
    },
    p: D,
    d(t) {
      t && S(e);
    }
  };
}
function Ol(l) {
  let e, t, s = (
    /*winner*/
    l[7].periodical_exp + ""
  ), i, c;
  return {
    c() {
      e = d("span"), t = z("+"), i = z(s), c = z(" XP"), a(e, "class", "winner-score svelte-18r3645");
    },
    m(r, o) {
      L(r, e, o), n(e, t), n(e, i), n(e, c);
    },
    p(r, o) {
      o & /*winner*/
      128 && s !== (s = /*winner*/
      r[7].periodical_exp + "") && A(i, s);
    },
    d(r) {
      r && S(e);
    }
  };
}
function Cn(l) {
  let e;
  return {
    c() {
      e = d("div"), e.innerHTML = '<div class="empty-copy svelte-18r3645"><strong class="svelte-18r3645">Premio Top 1 pendiente</strong> <span class="svelte-18r3645">Configura el premio garantizado para la persona que termine en primera posicion.</span></div>', a(e, "class", "reward empty svelte-18r3645");
    },
    m(t, s) {
      L(t, e, s);
    },
    p: D,
    d(t) {
      t && S(e);
    }
  };
}
function Sn(l) {
  let e, t = (
    /*resolveGuaranteedReward*/
    l[9]().image_url
  ), s, i, c, r = (
    /*resolveGuaranteedReward*/
    l[9]().description
  ), o, f = (
    /*resolveGuaranteedReward*/
    l[9]().cta_url
  ), p = t && Ln(l), u = r && Tn(l), v = f && En(l);
  return {
    c() {
      e = d("div"), p && p.c(), s = y(), i = d("p"), i.textContent = `${/*resolveGuaranteedReward*/
      l[9]().title}`, c = y(), u && u.c(), o = y(), v && v.c(), a(i, "class", "reward-title svelte-18r3645"), a(e, "class", "reward svelte-18r3645");
    },
    m(m, h) {
      L(m, e, h), p && p.m(e, null), n(e, s), n(e, i), n(e, c), u && u.m(e, null), n(e, o), v && v.m(e, null);
    },
    p(m, h) {
      t && p.p(m, h), r && u.p(m, h), f && v.p(m, h);
    },
    d(m) {
      m && S(e), p && p.d(), u && u.d(), v && v.d();
    }
  };
}
function Ln(l) {
  let e, t;
  return {
    c() {
      e = d("img"), Te(e.src, t = /*resolveGuaranteedReward*/
      l[9]().image_url) || a(e, "src", t), a(
        e,
        "alt",
        /*resolveGuaranteedReward*/
        l[9]().title
      ), a(e, "loading", "lazy"), a(e, "class", "svelte-18r3645");
    },
    m(s, i) {
      L(s, e, i);
    },
    p: D,
    d(s) {
      s && S(e);
    }
  };
}
function Tn(l) {
  let e;
  return {
    c() {
      e = d("p"), e.textContent = `${/*resolveGuaranteedReward*/
      l[9]().description}`, a(e, "class", "reward-desc svelte-18r3645");
    },
    m(t, s) {
      L(t, e, s);
    },
    p: D,
    d(t) {
      t && S(e);
    }
  };
}
function En(l) {
  let e, t;
  return {
    c() {
      e = d("a"), t = z("Ver mas"), a(
        e,
        "href",
        /*resolveGuaranteedReward*/
        l[9]().cta_url
      ), a(e, "target", "_blank"), a(e, "rel", "noreferrer"), a(e, "class", "svelte-18r3645");
    },
    m(s, i) {
      L(s, e, i), n(e, t);
    },
    p: D,
    d(s) {
      s && S(e);
    }
  };
}
function Fl(l) {
  let e, t, s, i, c, r, o, f, p, u, v, m, h = (
    /*winner*/
    l[7].id !== "placeholder" && Yl(l)
  );
  function b(E, I) {
    return (
      /*winner*/
      E[7].id === "placeholder" ? zn : (
        /*winner*/
        E[7].avatar_url ? wn : kn
      )
    );
  }
  let g = b(l), x = g(l);
  function q(E, I) {
    return (
      /*winner*/
      E[7].id === "placeholder" ? jn : qn
    );
  }
  let M = q(l), k = M(l), _ = (
    /*winner*/
    l[7].id !== "placeholder" && Ol(l)
  );
  function T(E, I) {
    return (
      /*resolveGuaranteedReward*/
      E[9]() ? Sn : Cn
    );
  }
  let j = T(l)(l);
  return {
    c() {
      e = d("div"), t = d("article"), s = d("div"), i = d("span"), i.textContent = "Ganador · #1", c = y(), h && h.c(), r = y(), o = d("div"), f = d("div"), x.c(), p = y(), u = d("p"), k.c(), v = y(), _ && _.c(), m = y(), j.c(), a(i, "class", "place svelte-18r3645"), a(s, "class", "podium-meta svelte-18r3645"), a(u, "class", "winner-name svelte-18r3645"), a(f, "class", "winner-identity svelte-18r3645"), a(o, "class", "winner-layout svelte-18r3645"), a(t, "class", "winner-card svelte-18r3645"), a(e, "class", "podium-grid svelte-18r3645");
    },
    m(E, I) {
      L(E, e, I), n(e, t), n(t, s), n(s, i), n(s, c), h && h.m(s, null), n(t, r), n(t, o), n(o, f), x.m(f, null), n(f, p), n(f, u), k.m(u, null), n(f, v), _ && _.m(f, null), n(o, m), j.m(o, null);
    },
    p(E, I) {
      /*winner*/
      E[7].id !== "placeholder" ? h ? h.p(E, I) : (h = Yl(E), h.c(), h.m(s, null)) : h && (h.d(1), h = null), g === (g = b(E)) && x ? x.p(E, I) : (x.d(1), x = g(E), x && (x.c(), x.m(f, p))), M === (M = q(E)) && k ? k.p(E, I) : (k.d(1), k = M(E), k && (k.c(), k.m(u, null))), /*winner*/
      E[7].id !== "placeholder" ? _ ? _.p(E, I) : (_ = Ol(E), _.c(), _.m(f, null)) : _ && (_.d(1), _ = null), j.p(E, I);
    },
    d(E) {
      E && S(e), h && h.d(), x.d(), k.d(), _ && _.d(), j.d();
    }
  };
}
function An(l) {
  let e;
  return {
    c() {
      e = d("div"), e.textContent = "Premio pendiente de configurar", a(e, "class", "reward empty svelte-18r3645");
    },
    m(t, s) {
      L(t, e, s);
    },
    p: D,
    d(t) {
      t && S(e);
    }
  };
}
function Mn(l) {
  let e = (
    /*resolveRaffleReward*/
    l[10](
      /*item*/
      l[23].key
    ).image_url
  ), t, s, i, c = (
    /*resolveRaffleReward*/
    l[10](
      /*item*/
      l[23].key
    ).description
  ), r, o = e && Nn(l), f = c && In(l);
  return {
    c() {
      o && o.c(), t = y(), s = d("p"), s.textContent = `${/*resolveRaffleReward*/
      l[10](
        /*item*/
        l[23].key
      ).title}`, i = y(), f && f.c(), r = et(), a(s, "class", "reward-title svelte-18r3645");
    },
    m(p, u) {
      o && o.m(p, u), L(p, t, u), L(p, s, u), L(p, i, u), f && f.m(p, u), L(p, r, u);
    },
    p(p, u) {
      e && o.p(p, u), c && f.p(p, u);
    },
    d(p) {
      p && (S(t), S(s), S(i), S(r)), o && o.d(p), f && f.d(p);
    }
  };
}
function Nn(l) {
  let e, t;
  return {
    c() {
      e = d("img"), Te(e.src, t = /*resolveRaffleReward*/
      l[10](
        /*item*/
        l[23].key
      ).image_url) || a(e, "src", t), a(
        e,
        "alt",
        /*resolveRaffleReward*/
        l[10](
          /*item*/
          l[23].key
        ).title
      ), a(e, "class", "raffle-image svelte-18r3645"), a(e, "loading", "lazy");
    },
    m(s, i) {
      L(s, e, i);
    },
    p: D,
    d(s) {
      s && S(e);
    }
  };
}
function In(l) {
  let e;
  return {
    c() {
      e = d("p"), e.textContent = `${/*resolveRaffleReward*/
      l[10](
        /*item*/
        l[23].key
      ).description}`, a(e, "class", "reward-desc svelte-18r3645");
    },
    m(t, s) {
      L(t, e, s);
    },
    p: D,
    d(t) {
      t && S(e);
    }
  };
}
function Vl(l) {
  let e, t, s, i;
  function c(f, p) {
    return (
      /*resolveRaffleReward*/
      f[10](
        /*item*/
        f[23].key
      ) ? Mn : An
    );
  }
  let o = c(l)(l);
  return {
    c() {
      e = d("div"), t = d("p"), t.textContent = `${/*item*/
      l[23].label}`, s = y(), o.c(), i = y(), a(t, "class", "raffle-label svelte-18r3645"), a(e, "class", "raffle-card svelte-18r3645");
    },
    m(f, p) {
      L(f, e, p), n(e, t), n(e, s), o.m(e, null), n(e, i);
    },
    p(f, p) {
      o.p(f, p);
    },
    d(f) {
      f && S(e), o.d();
    }
  };
}
function Pn(l) {
  let e;
  return {
    c() {
      e = d("div"), e.textContent = "Aun no hay umbrales configurados para este ambito.", a(e, "class", "reward empty svelte-18r3645");
    },
    m(t, s) {
      L(t, e, s);
    },
    p: D,
    d(t) {
      t && S(e);
    }
  };
}
function Rn(l) {
  let e, t = Z(
    /*activeThresholds*/
    l[8]
  ), s = [];
  for (let i = 0; i < t.length; i += 1)
    s[i] = Ul(Dl(l, t, i));
  return {
    c() {
      for (let i = 0; i < s.length; i += 1)
        s[i].c();
      e = et();
    },
    m(i, c) {
      for (let r = 0; r < s.length; r += 1)
        s[r] && s[r].m(i, c);
      L(i, e, c);
    },
    p(i, c) {
      if (c & /*activeThresholds, Number*/
      256) {
        t = Z(
          /*activeThresholds*/
          i[8]
        );
        let r;
        for (r = 0; r < t.length; r += 1) {
          const o = Dl(i, t, r);
          s[r] ? s[r].p(o, c) : (s[r] = Ul(o), s[r].c(), s[r].m(e.parentNode, e));
        }
        for (; r < s.length; r += 1)
          s[r].d(1);
        s.length = t.length;
      }
    },
    d(i) {
      i && S(e), He(s, i);
    }
  };
}
function Ul(l) {
  let e, t, s, i = Number(
    /*threshold*/
    l[20].min_points ?? 0
  ).toLocaleString("es-ES") + "", c, r, o, f, p = (
    /*threshold*/
    l[20].entries_count + ""
  ), u, v, m = (
    /*threshold*/
    l[20].entries_count === 1 ? "ion" : "iones"
  ), h, b;
  return {
    c() {
      e = d("div"), t = d("span"), s = z("Desde "), c = z(i), r = z(" PA"), o = y(), f = d("strong"), u = z(p), v = z(" participac"), h = z(m), b = y(), a(f, "class", "svelte-18r3645"), a(e, "class", "threshold-row svelte-18r3645");
    },
    m(g, x) {
      L(g, e, x), n(e, t), n(t, s), n(t, c), n(t, r), n(e, o), n(e, f), n(f, u), n(f, v), n(f, h), n(e, b);
    },
    p(g, x) {
      x & /*activeThresholds*/
      256 && i !== (i = Number(
        /*threshold*/
        g[20].min_points ?? 0
      ).toLocaleString("es-ES") + "") && A(c, i), x & /*activeThresholds*/
      256 && p !== (p = /*threshold*/
      g[20].entries_count + "") && A(u, p), x & /*activeThresholds*/
      256 && m !== (m = /*threshold*/
      g[20].entries_count === 1 ? "ion" : "iones") && A(h, m);
    },
    d(g) {
      g && S(e);
    }
  };
}
function Gl(l) {
  let e, t, s = (
    /*classicUsers*/
    l[5][
      /*slot*/
      l[17].place - 1
    ].periodical_exp + ""
  ), i, c;
  return {
    c() {
      e = d("span"), t = z("+"), i = z(s), c = z(" XP"), a(e, "class", "xp svelte-18r3645");
    },
    m(r, o) {
      L(r, e, o), n(e, t), n(e, i), n(e, c);
    },
    p(r, o) {
      o & /*classicUsers*/
      32 && s !== (s = /*classicUsers*/
      r[5][
        /*slot*/
        r[17].place - 1
      ].periodical_exp + "") && A(i, s);
    },
    d(r) {
      r && S(e);
    }
  };
}
function Dn(l) {
  let e;
  return {
    c() {
      e = d("div"), e.textContent = "Recompensa pendiente", a(e, "class", "reward empty svelte-18r3645");
    },
    m(t, s) {
      L(t, e, s);
    },
    p: D,
    d(t) {
      t && S(e);
    }
  };
}
function Xn(l) {
  var p, u;
  let e, t, s, i = (
    /*rewards*/
    l[0][
      /*slot*/
      l[17].key
    ].title + ""
  ), c, r, o = (
    /*rewards*/
    ((p = l[0][
      /*slot*/
      l[17].key
    ]) == null ? void 0 : p.image_url) && Jl(l)
  ), f = (
    /*rewards*/
    ((u = l[0][
      /*slot*/
      l[17].key
    ]) == null ? void 0 : u.description) && Ql(l)
  );
  return {
    c() {
      e = d("div"), o && o.c(), t = y(), s = d("p"), c = z(i), r = y(), f && f.c(), a(s, "class", "reward-title svelte-18r3645"), a(e, "class", "reward svelte-18r3645");
    },
    m(v, m) {
      L(v, e, m), o && o.m(e, null), n(e, t), n(e, s), n(s, c), n(e, r), f && f.m(e, null);
    },
    p(v, m) {
      var h, b;
      /*rewards*/
      (h = v[0][
        /*slot*/
        v[17].key
      ]) != null && h.image_url ? o ? o.p(v, m) : (o = Jl(v), o.c(), o.m(e, t)) : o && (o.d(1), o = null), m & /*rewards*/
      1 && i !== (i = /*rewards*/
      v[0][
        /*slot*/
        v[17].key
      ].title + "") && A(c, i), /*rewards*/
      (b = v[0][
        /*slot*/
        v[17].key
      ]) != null && b.description ? f ? f.p(v, m) : (f = Ql(v), f.c(), f.m(e, null)) : f && (f.d(1), f = null);
    },
    d(v) {
      v && S(e), o && o.d(), f && f.d();
    }
  };
}
function Jl(l) {
  let e, t, s;
  return {
    c() {
      e = d("img"), Te(e.src, t = /*rewards*/
      l[0][
        /*slot*/
        l[17].key
      ].image_url) || a(e, "src", t), a(e, "alt", s = /*rewards*/
      l[0][
        /*slot*/
        l[17].key
      ].title), a(e, "loading", "lazy"), a(e, "class", "svelte-18r3645");
    },
    m(i, c) {
      L(i, e, c);
    },
    p(i, c) {
      c & /*rewards*/
      1 && !Te(e.src, t = /*rewards*/
      i[0][
        /*slot*/
        i[17].key
      ].image_url) && a(e, "src", t), c & /*rewards*/
      1 && s !== (s = /*rewards*/
      i[0][
        /*slot*/
        i[17].key
      ].title) && a(e, "alt", s);
    },
    d(i) {
      i && S(e);
    }
  };
}
function Ql(l) {
  let e, t = (
    /*rewards*/
    l[0][
      /*slot*/
      l[17].key
    ].description + ""
  ), s;
  return {
    c() {
      e = d("p"), s = z(t), a(e, "class", "reward-desc svelte-18r3645");
    },
    m(i, c) {
      L(i, e, c), n(e, s);
    },
    p(i, c) {
      c & /*rewards*/
      1 && t !== (t = /*rewards*/
      i[0][
        /*slot*/
        i[17].key
      ].description + "") && A(s, t);
    },
    d(i) {
      i && S(e);
    }
  };
}
function Bn(l) {
  let e, t = (
    /*classicUsers*/
    (l[5][
      /*slot*/
      l[17].place - 1
    ].first_name || /*classicUsers*/
    l[5][
      /*slot*/
      l[17].place - 1
    ].last_name || "?").charAt(0) + ""
  ), s;
  return {
    c() {
      e = d("div"), s = z(t), a(e, "class", "classic-avatar fallback svelte-18r3645");
    },
    m(i, c) {
      L(i, e, c), n(e, s);
    },
    p(i, c) {
      c & /*classicUsers*/
      32 && t !== (t = /*classicUsers*/
      (i[5][
        /*slot*/
        i[17].place - 1
      ].first_name || /*classicUsers*/
      i[5][
        /*slot*/
        i[17].place - 1
      ].last_name || "?").charAt(0) + "") && A(s, t);
    },
    d(i) {
      i && S(e);
    }
  };
}
function Hn(l) {
  let e, t, s;
  return {
    c() {
      e = d("img"), Te(e.src, t = /*classicUsers*/
      l[5][
        /*slot*/
        l[17].place - 1
      ].avatar_url) || a(e, "src", t), a(e, "alt", s = /*classicUsers*/
      l[5][
        /*slot*/
        l[17].place - 1
      ].first_name), a(e, "class", "classic-avatar svelte-18r3645"), a(e, "loading", "lazy");
    },
    m(i, c) {
      L(i, e, c);
    },
    p(i, c) {
      c & /*classicUsers*/
      32 && !Te(e.src, t = /*classicUsers*/
      i[5][
        /*slot*/
        i[17].place - 1
      ].avatar_url) && a(e, "src", t), c & /*classicUsers*/
      32 && s !== (s = /*classicUsers*/
      i[5][
        /*slot*/
        i[17].place - 1
      ].first_name) && a(e, "alt", s);
    },
    d(i) {
      i && S(e);
    }
  };
}
function Wl(l) {
  let e, t, s, i, c, r, o, f, p, u, v = (
    /*classicUsers*/
    l[5][
      /*slot*/
      l[17].place - 1
    ].first_name + ""
  ), m, h, b = (
    /*classicUsers*/
    l[5][
      /*slot*/
      l[17].place - 1
    ].last_name + ""
  ), g, x, q, M, k = (
    /*classicUsers*/
    l[5][
      /*slot*/
      l[17].place - 1
    ].periodical_exp + ""
  ), _, T, w, j = (
    /*classicUsers*/
    l[5][
      /*slot*/
      l[17].place - 1
    ].id !== "placeholder" && Gl(l)
  );
  function E(P, N) {
    var J;
    return (
      /*rewards*/
      (J = P[0]) != null && J[
        /*slot*/
        P[17].key
      ] ? Xn : Dn
    );
  }
  let I = E(l), B = I(l);
  function V(P, N) {
    return (
      /*classicUsers*/
      P[5][
        /*slot*/
        P[17].place - 1
      ].avatar_url ? Hn : Bn
    );
  }
  let R = V(l), U = R(l);
  return {
    c() {
      e = d("article"), t = d("div"), s = d("span"), s.textContent = `${/*slot*/
      l[17].place} lugar`, i = y(), j && j.c(), c = y(), B.c(), r = y(), o = d("div"), U.c(), f = y(), p = d("div"), u = d("p"), m = z(v), h = y(), g = z(b), x = y(), q = d("span"), M = z("+"), _ = z(k), T = z(" XP"), w = y(), a(s, "class", "place svelte-18r3645"), a(t, "class", "podium-meta svelte-18r3645"), a(u, "class", "svelte-18r3645"), a(q, "class", "svelte-18r3645"), a(p, "class", "classic-user-meta svelte-18r3645"), a(o, "class", "classic-user svelte-18r3645"), a(e, "class", nt(`classic-card ${/*slot*/
      l[17].className}`) + " svelte-18r3645");
    },
    m(P, N) {
      L(P, e, N), n(e, t), n(t, s), n(t, i), j && j.m(t, null), n(e, c), B.m(e, null), n(e, r), n(e, o), U.m(o, null), n(o, f), n(o, p), n(p, u), n(u, m), n(u, h), n(u, g), n(p, x), n(p, q), n(q, M), n(q, _), n(q, T), n(e, w);
    },
    p(P, N) {
      /*classicUsers*/
      P[5][
        /*slot*/
        P[17].place - 1
      ].id !== "placeholder" ? j ? j.p(P, N) : (j = Gl(P), j.c(), j.m(t, null)) : j && (j.d(1), j = null), I === (I = E(P)) && B ? B.p(P, N) : (B.d(1), B = I(P), B && (B.c(), B.m(e, r))), R === (R = V(P)) && U ? U.p(P, N) : (U.d(1), U = R(P), U && (U.c(), U.m(o, f))), N & /*classicUsers*/
      32 && v !== (v = /*classicUsers*/
      P[5][
        /*slot*/
        P[17].place - 1
      ].first_name + "") && A(m, v), N & /*classicUsers*/
      32 && b !== (b = /*classicUsers*/
      P[5][
        /*slot*/
        P[17].place - 1
      ].last_name + "") && A(g, b), N & /*classicUsers*/
      32 && k !== (k = /*classicUsers*/
      P[5][
        /*slot*/
        P[17].place - 1
      ].periodical_exp + "") && A(_, k);
    },
    d(P) {
      P && S(e), j && j.d(), B.d(), U.d();
    }
  };
}
function Kl(l) {
  let e;
  return {
    c() {
      e = d("div"), e.textContent = "Cargando clasificaciones...", a(e, "class", "loading svelte-18r3645");
    },
    m(t, s) {
      L(t, e, s);
    },
    d(t) {
      t && S(e);
    }
  };
}
function Yn(l) {
  let e, t, s, i, c, r, o, f, p, u, v, m, h = (
    /*rewardMode*/
    l[1] === "classic_top3" ? "Premios para Top 1, Top 2 y Top 3" : "Top 1 garantizado + 2 sorteos por umbrales"
  ), b, g, x, q = (
    /*scopeLabel*/
    l[3] && Hl(l)
  );
  function M(w, j) {
    return (
      /*rewardMode*/
      w[1] === "classic_top3" ? yn : _n
    );
  }
  let k = M(l), _ = k(l), T = (
    /*loading*/
    l[4] && Kl()
  );
  return {
    c() {
      e = d("section"), t = d("header"), s = d("div"), i = d("p"), i.textContent = "Podio temporada", c = y(), r = d("h2"), r.textContent = "Top Activos", o = y(), q && q.c(), f = y(), p = d("div"), u = d("span"), v = y(), m = d("span"), b = z(h), g = y(), _.c(), x = y(), T && T.c(), a(i, "class", "eyebrow svelte-18r3645"), a(r, "class", "svelte-18r3645"), a(u, "class", "badge-icon svelte-18r3645"), a(u, "aria-hidden", "true"), a(p, "class", "badge svelte-18r3645"), a(t, "class", "podium-header svelte-18r3645"), a(e, "class", "podium-wrap svelte-18r3645"), a(
        e,
        "data-play",
        /*playId*/
        l[6]
      );
    },
    m(w, j) {
      L(w, e, j), n(e, t), n(t, s), n(s, i), n(s, c), n(s, r), n(s, o), q && q.m(s, null), n(t, f), n(t, p), n(p, u), n(p, v), n(p, m), n(m, b), n(e, g), _.m(e, null), n(e, x), T && T.m(e, null);
    },
    p(w, [j]) {
      /*scopeLabel*/
      w[3] ? q ? q.p(w, j) : (q = Hl(w), q.c(), q.m(s, null)) : q && (q.d(1), q = null), j & /*rewardMode*/
      2 && h !== (h = /*rewardMode*/
      w[1] === "classic_top3" ? "Premios para Top 1, Top 2 y Top 3" : "Top 1 garantizado + 2 sorteos por umbrales") && A(b, h), k === (k = M(w)) && _ ? _.p(w, j) : (_.d(1), _ = k(w), _ && (_.c(), _.m(e, x))), /*loading*/
      w[4] ? T || (T = Kl(), T.c(), T.m(e, null)) : T && (T.d(1), T = null), j & /*playId*/
      64 && a(
        e,
        "data-play",
        /*playId*/
        w[6]
      );
    },
    i: D,
    o: D,
    d(w) {
      w && S(e), q && q.d(), _.d(), T && T.d();
    }
  };
}
function On(l, e, t) {
  let s, i, c, r, { users: o = [] } = e, { rewards: f = {} } = e, { rewardMode: p = "raffle_thresholds" } = e, { raffleThresholds: u = [] } = e, { userRaffleEntries: v = 0 } = e, { scopeLabel: m = "" } = e, { loading: h = !1 } = e;
  const b = {
    id: "placeholder",
    first_name: "Por definir",
    last_name: "",
    avatar_url: "",
    periodical_exp: 0
  }, g = (_) => Array.isArray(_) ? _ : [], x = () => (f == null ? void 0 : f.guaranteed_winner) || (f == null ? void 0 : f[1]) || (f == null ? void 0 : f["1"]), q = (_) => f == null ? void 0 : f[_];
  let M = 0, k = "";
  return l.$$set = (_) => {
    "users" in _ && t(11, o = _.users), "rewards" in _ && t(0, f = _.rewards), "rewardMode" in _ && t(1, p = _.rewardMode), "raffleThresholds" in _ && t(12, u = _.raffleThresholds), "userRaffleEntries" in _ && t(2, v = _.userRaffleEntries), "scopeLabel" in _ && t(3, m = _.scopeLabel), "loading" in _ && t(4, h = _.loading);
  }, l.$$.update = () => {
    if (l.$$.dirty & /*users*/
    2048 && t(14, s = [...g(o)].slice(0, 1)), l.$$.dirty & /*podiumUsers*/
    16384)
      for (; s.length < 1; ) s.push(b);
    if (l.$$.dirty & /*users*/
    2048 && t(5, i = [...g(o)].slice(0, 3)), l.$$.dirty & /*classicUsers*/
    32)
      for (; i.length < 3; ) i.push(b);
    if (l.$$.dirty & /*raffleThresholds*/
    4096 && t(8, c = Array.isArray(u) ? u.filter((_) => _ == null ? void 0 : _.active).sort((_, T) => ((_ == null ? void 0 : _.min_points) ?? 0) - ((T == null ? void 0 : T.min_points) ?? 0)) : []), l.$$.dirty & /*podiumUsers*/
    16384 && t(7, r = s[0] || b), l.$$.dirty & /*users, rewards, raffleThresholds, rewardMode, userRaffleEntries, loading, scopeLabel, signature, playId*/
    14431) {
      const _ = g(o).map((E) => (E == null ? void 0 : E.id) ?? "").join("|"), T = f ? Object.keys(f).sort().map((E) => {
        var I;
        return `${E}:${((I = f[E]) == null ? void 0 : I.title) ?? ""}`;
      }).join("|") : "", w = Array.isArray(u) ? u.map((E) => `${E.id ?? ""}:${E.min_points}:${E.entries_count}:${E.active}`).join("|") : "", j = `${_}-${p}-${T}-${w}-${v}-${h}-${m}`;
      j !== k && (t(13, k = j), t(6, M += 1));
    }
  }, [
    f,
    p,
    v,
    m,
    h,
    i,
    M,
    r,
    c,
    x,
    q,
    o,
    u,
    k,
    s
  ];
}
class Ds extends ve {
  constructor(e) {
    super(), ue(
      this,
      e,
      On,
      Yn,
      ee,
      {
        users: 11,
        rewards: 0,
        rewardMode: 1,
        raffleThresholds: 12,
        userRaffleEntries: 2,
        scopeLabel: 3,
        loading: 4
      },
      xn
    );
  }
  get users() {
    return this.$$.ctx[11];
  }
  set users(e) {
    this.$$set({ users: e }), C();
  }
  get rewards() {
    return this.$$.ctx[0];
  }
  set rewards(e) {
    this.$$set({ rewards: e }), C();
  }
  get rewardMode() {
    return this.$$.ctx[1];
  }
  set rewardMode(e) {
    this.$$set({ rewardMode: e }), C();
  }
  get raffleThresholds() {
    return this.$$.ctx[12];
  }
  set raffleThresholds(e) {
    this.$$set({ raffleThresholds: e }), C();
  }
  get userRaffleEntries() {
    return this.$$.ctx[2];
  }
  set userRaffleEntries(e) {
    this.$$set({ userRaffleEntries: e }), C();
  }
  get scopeLabel() {
    return this.$$.ctx[3];
  }
  set scopeLabel(e) {
    this.$$set({ scopeLabel: e }), C();
  }
  get loading() {
    return this.$$.ctx[4];
  }
  set loading(e) {
    this.$$set({ loading: e }), C();
  }
}
pe(Ds, { users: {}, rewards: {}, rewardMode: {}, raffleThresholds: {}, userRaffleEntries: {}, scopeLabel: {}, loading: { type: "Boolean" } }, [], [], !0);
function Fn(l) {
  de(l, "svelte-sxmilm", `.backdrop.svelte-sxmilm.svelte-sxmilm{position:fixed;inset:0;background:radial-gradient(circle at top left, rgba(239, 68, 68, 0.18), transparent 30%),
      rgba(15, 23, 42, 0.42);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;z-index:60;padding:24px}.card.svelte-sxmilm.svelte-sxmilm{width:min(760px, 100%);background:linear-gradient(180deg, rgba(255, 247, 247, 0.92), rgba(255, 255, 255, 0.98) 28%),
      #ffffff;border-radius:28px;border:1px solid rgba(226, 232, 240, 0.95);box-shadow:0 30px 90px rgba(15, 23, 42, 0.24);display:flex;flex-direction:column;gap:18px;padding:24px;box-sizing:border-box;max-height:calc(100vh - 48px);overflow:auto}.hero.svelte-sxmilm.svelte-sxmilm{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}.hero-copy.svelte-sxmilm.svelte-sxmilm{max-width:580px}.eyebrow.svelte-sxmilm.svelte-sxmilm{display:inline-flex;align-items:center;border-radius:999px;background:#fff1f2;color:#be123c;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:6px 10px;margin-bottom:10px}.title.svelte-sxmilm.svelte-sxmilm{font-size:20px;font-weight:800;margin:0;color:#0f172a}.hint.svelte-sxmilm.svelte-sxmilm{font-size:15px;line-height:1.45;margin:6px 0 0;color:#475569}.close.svelte-sxmilm.svelte-sxmilm{border:none;background:rgba(241, 245, 249, 0.96);color:#475569;width:42px;height:42px;border-radius:999px;cursor:pointer;font-size:24px}.body.svelte-sxmilm.svelte-sxmilm{display:grid;gap:14px}.field.svelte-sxmilm.svelte-sxmilm{display:grid;gap:10px}.field-head.svelte-sxmilm.svelte-sxmilm{display:flex;align-items:center;justify-content:space-between;gap:12px}.label.svelte-sxmilm.svelte-sxmilm{font-size:13px;font-weight:700;color:#334155}.caption.svelte-sxmilm.svelte-sxmilm{font-size:12px;color:#94a3b8}.caption.danger.svelte-sxmilm.svelte-sxmilm{color:#b91c1c}.select.svelte-sxmilm.svelte-sxmilm,.textarea.svelte-sxmilm.svelte-sxmilm{box-sizing:border-box;width:100%;border:1px solid #d7dee8;border-radius:18px;padding:14px 16px;font-size:15px;outline:none;background:rgba(255, 255, 255, 0.92);transition:border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease}.select.svelte-sxmilm.svelte-sxmilm:focus,.textarea.svelte-sxmilm.svelte-sxmilm:focus{border-color:#fb7185;box-shadow:0 0 0 4px rgba(251, 113, 133, 0.12)}.textarea.svelte-sxmilm.svelte-sxmilm{resize:vertical;min-height:120px;max-height:220px;line-height:1.5;font-family:inherit}.attachment-row.svelte-sxmilm.svelte-sxmilm{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.attach-button.svelte-sxmilm.svelte-sxmilm{display:inline-flex;align-items:center;justify-content:center;border:1px solid #d7dee8;background:#ffffff;color:#475569;padding:11px 16px;border-radius:999px;cursor:pointer;font-weight:600}.file-input.svelte-sxmilm.svelte-sxmilm{display:none}.attachment-preview.svelte-sxmilm.svelte-sxmilm{display:flex;align-items:center;justify-content:space-between;gap:16px;border:1px solid #e2e8f0;background:#fff;border-radius:18px;padding:12px 14px}.attachment-preview.svelte-sxmilm img.svelte-sxmilm{width:76px;height:76px;object-fit:cover;border-radius:14px;border:1px solid #e2e8f0}.attachment-name.svelte-sxmilm.svelte-sxmilm{margin:0;font-size:14px;font-weight:700;color:#0f172a}.attachment-caption.svelte-sxmilm.svelte-sxmilm{margin:4px 0 0;font-size:12px;color:#64748b}.error.svelte-sxmilm.svelte-sxmilm{font-size:13px;color:#b91c1c;background:#fef2f2;border:1px solid #fecaca;padding:12px 14px;border-radius:14px}.success.svelte-sxmilm.svelte-sxmilm{font-size:13px;color:#047857;background:#ecfdf5;border:1px solid #a7f3d0;padding:12px 14px;border-radius:14px}.footer.svelte-sxmilm.svelte-sxmilm{display:flex;align-items:center;justify-content:space-between;gap:12px}.footer-left.svelte-sxmilm.svelte-sxmilm,.footer-right.svelte-sxmilm.svelte-sxmilm{display:flex;align-items:center;gap:10px}.ghost.svelte-sxmilm.svelte-sxmilm{border:1px solid #d7dee8;background:#ffffff;color:#475569;padding:11px 18px;border-radius:999px;cursor:pointer}.ghost.small.svelte-sxmilm.svelte-sxmilm{padding:9px 14px;font-size:13px}.secondary.svelte-sxmilm.svelte-sxmilm{border:1px solid #fda4af;background:#fff1f2;color:#be123c;padding:11px 16px;border-radius:999px;cursor:pointer;font-weight:600}.primary.svelte-sxmilm.svelte-sxmilm{border:none;background:linear-gradient(135deg, #ef4444, #dc2626);color:#ffffff;padding:11px 18px;border-radius:999px;cursor:pointer;font-weight:700;box-shadow:0 12px 24px rgba(239, 68, 68, 0.28)}.primary.svelte-sxmilm.svelte-sxmilm:disabled{opacity:0.6;cursor:not-allowed;box-shadow:none}@media(max-width: 640px){.card.svelte-sxmilm.svelte-sxmilm{width:100%;padding:18px;border-radius:24px;max-height:calc(100vh - 24px)}.footer.svelte-sxmilm.svelte-sxmilm{flex-direction:column;align-items:stretch}.footer-left.svelte-sxmilm.svelte-sxmilm,.footer-right.svelte-sxmilm.svelte-sxmilm{width:100%;justify-content:stretch}.footer-left.svelte-sxmilm>button.svelte-sxmilm,.footer-right.svelte-sxmilm>button.svelte-sxmilm{flex:1 1 0}}`);
}
function Zl(l, e, t) {
  const s = l.slice();
  return s[28] = e[t], s;
}
function $l(l) {
  let e, t, s, i, c, r, o, f, p, u, v, m, h, b, g, x, q, M, k, _, T, w, j, E, I, B, V = Math.max(
    /*message*/
    l[13].length,
    0
  ) + "", R, U, P, N, J, re, Q, te, W, G, ge, ne = (
    /*attachmentUploading*/
    l[11] ? "Subiendo..." : (
      /*attachmentName*/
      l[9] ? "Cambiar imagen" : "Adjuntar imagen"
    )
  ), le, $, Y, K, X, se, Ee, Je, we, Pe, rt, Ye, je, tt, Ae, Oe = (
    /*submitting*/
    l[2] ? "Enviando..." : "Enviar reporte"
  ), Qe, We, at, Fe, Ce = Z(
    /*categories*/
    l[1]
  ), oe = [];
  for (let F = 0; F < Ce.length; F += 1)
    oe[F] = es(Zl(l, Ce, F));
  let be = (
    /*attachmentName*/
    l[9] && ts(l)
  ), ce = (
    /*attachmentName*/
    l[9] && ls(l)
  ), he = (
    /*error*/
    l[3] && is(l)
  ), xe = (
    /*success*/
    l[4] && ns()
  ), _e = (
    /*canViewInbox*/
    l[7] && rs(l)
  );
  return {
    c() {
      e = d("div"), t = d("div"), s = d("div"), i = d("div"), c = d("span"), c.textContent = "Soporte", r = y(), o = d("p"), f = z(
        /*title*/
        l[5]
      ), p = y(), u = d("p"), v = z(
        /*hint*/
        l[6]
      ), m = y(), h = d("button"), h.textContent = "×", b = y(), g = d("div"), x = d("div"), q = d("div"), q.innerHTML = '<label class="label svelte-sxmilm" for="report-category">Categoría</label> <span class="caption svelte-sxmilm">Obligatorio</span>', M = y(), k = d("select"), _ = d("option"), _.textContent = "Selecciona una categoria";
      for (let F = 0; F < oe.length; F += 1)
        oe[F].c();
      T = y(), w = d("div"), j = d("div"), E = d("label"), E.textContent = "Mensaje", I = y(), B = d("span"), R = z(V), U = z("/"), P = z(Dt), N = y(), J = d("textarea"), re = y(), Q = d("div"), te = d("div"), te.innerHTML = '<label class="label svelte-sxmilm" for="report-attachment">Imagen</label> <span class="caption svelte-sxmilm">Opcional · PNG, JPG, WEBP o GIF</span>', W = y(), G = d("div"), ge = d("label"), le = z(ne), $ = y(), Y = d("input"), K = y(), be && be.c(), X = y(), ce && ce.c(), se = y(), he && he.c(), Ee = y(), xe && xe.c(), Je = y(), we = d("div"), Pe = d("div"), _e && _e.c(), rt = y(), Ye = d("div"), je = d("button"), je.textContent = "Cancelar", tt = y(), Ae = d("button"), Qe = z(Oe), a(c, "class", "eyebrow svelte-sxmilm"), a(o, "class", "title svelte-sxmilm"), a(u, "class", "hint svelte-sxmilm"), a(i, "class", "hero-copy svelte-sxmilm"), a(h, "class", "close svelte-sxmilm"), a(h, "type", "button"), a(s, "class", "hero svelte-sxmilm"), a(q, "class", "field-head svelte-sxmilm"), _.__value = "", Ve(_, _.__value), _.disabled = !0, a(k, "id", "report-category"), a(k, "class", "select svelte-sxmilm"), /*selected*/
      l[12] === void 0 && Ne(() => (
        /*select_change_handler*/
        l[23].call(k)
      )), a(x, "class", "field svelte-sxmilm"), a(E, "class", "label svelte-sxmilm"), a(E, "for", "report-message"), a(B, "class", "caption svelte-sxmilm"), Ze(
        B,
        "danger",
        /*remaining*/
        l[15] < 0
      ), a(j, "class", "field-head svelte-sxmilm"), a(J, "id", "report-message"), a(J, "class", "textarea svelte-sxmilm"), a(J, "rows", "6"), a(J, "maxlength", Dt), a(J, "placeholder", "Ejemplo: al abrir notificaciones se queda cargando y no puedo volver atrás."), a(w, "class", "field svelte-sxmilm"), a(te, "class", "field-head svelte-sxmilm"), a(ge, "class", "attach-button svelte-sxmilm"), a(ge, "for", "report-attachment"), a(Y, "id", "report-attachment"), a(Y, "class", "file-input svelte-sxmilm"), a(Y, "type", "file"), a(Y, "accept", "image/png,image/jpeg,image/webp,image/gif"), a(G, "class", "attachment-row svelte-sxmilm"), a(Q, "class", "field svelte-sxmilm"), a(g, "class", "body svelte-sxmilm"), a(Pe, "class", "footer-left svelte-sxmilm"), a(je, "class", "ghost svelte-sxmilm"), a(je, "type", "button"), a(Ae, "class", "primary svelte-sxmilm"), a(Ae, "type", "button"), Ae.disabled = We = !/*canSubmit*/
      l[14], a(Ye, "class", "footer-right svelte-sxmilm"), a(we, "class", "footer svelte-sxmilm"), a(t, "class", "card svelte-sxmilm"), a(t, "role", "dialog"), a(t, "aria-modal", "true"), a(e, "class", "backdrop svelte-sxmilm"), a(e, "role", "button"), a(e, "tabindex", "0");
    },
    m(F, ie) {
      L(F, e, ie), n(e, t), n(t, s), n(s, i), n(i, c), n(i, r), n(i, o), n(o, f), n(i, p), n(i, u), n(u, v), n(s, m), n(s, h), n(t, b), n(t, g), n(g, x), n(x, q), n(x, M), n(x, k), n(k, _);
      for (let fe = 0; fe < oe.length; fe += 1)
        oe[fe] && oe[fe].m(k, null);
      ol(
        k,
        /*selected*/
        l[12],
        !0
      ), n(g, T), n(g, w), n(w, j), n(j, E), n(j, I), n(j, B), n(B, R), n(B, U), n(B, P), n(w, N), n(w, J), Ve(
        J,
        /*message*/
        l[13]
      ), n(g, re), n(g, Q), n(Q, te), n(Q, W), n(Q, G), n(G, ge), n(ge, le), n(G, $), n(G, Y), n(G, K), be && be.m(G, null), n(Q, X), ce && ce.m(Q, null), n(g, se), he && he.m(g, null), n(g, Ee), xe && xe.m(g, null), n(t, Je), n(t, we), n(we, Pe), _e && _e.m(Pe, null), n(we, rt), n(we, Ye), n(Ye, je), n(Ye, tt), n(Ye, Ae), n(Ae, Qe), at || (Fe = [
        O(
          h,
          "click",
          /*close*/
          l[16]
        ),
        O(
          k,
          "change",
          /*select_change_handler*/
          l[23]
        ),
        O(
          J,
          "input",
          /*textarea_input_handler*/
          l[24]
        ),
        O(
          Y,
          "change",
          /*handleFileChange*/
          l[19]
        ),
        O(
          je,
          "click",
          /*close*/
          l[16]
        ),
        O(
          Ae,
          "click",
          /*submit*/
          l[17]
        ),
        O(t, "click", Js(
          /*click_handler*/
          l[22]
        )),
        O(
          e,
          "click",
          /*close*/
          l[16]
        ),
        O(
          e,
          "keydown",
          /*keydown_handler*/
          l[25]
        )
      ], at = !0);
    },
    p(F, ie) {
      if (ie & /*title*/
      32 && A(
        f,
        /*title*/
        F[5]
      ), ie & /*hint*/
      64 && A(
        v,
        /*hint*/
        F[6]
      ), ie & /*categories*/
      2) {
        Ce = Z(
          /*categories*/
          F[1]
        );
        let fe;
        for (fe = 0; fe < Ce.length; fe += 1) {
          const Re = Zl(F, Ce, fe);
          oe[fe] ? oe[fe].p(Re, ie) : (oe[fe] = es(Re), oe[fe].c(), oe[fe].m(k, null));
        }
        for (; fe < oe.length; fe += 1)
          oe[fe].d(1);
        oe.length = Ce.length;
      }
      ie & /*selected, categories*/
      4098 && ol(
        k,
        /*selected*/
        F[12]
      ), ie & /*message*/
      8192 && V !== (V = Math.max(
        /*message*/
        F[13].length,
        0
      ) + "") && A(R, V), ie & /*remaining*/
      32768 && Ze(
        B,
        "danger",
        /*remaining*/
        F[15] < 0
      ), ie & /*message*/
      8192 && Ve(
        J,
        /*message*/
        F[13]
      ), ie & /*attachmentUploading, attachmentName*/
      2560 && ne !== (ne = /*attachmentUploading*/
      F[11] ? "Subiendo..." : (
        /*attachmentName*/
        F[9] ? "Cambiar imagen" : "Adjuntar imagen"
      )) && A(le, ne), /*attachmentName*/
      F[9] ? be ? be.p(F, ie) : (be = ts(F), be.c(), be.m(G, null)) : be && (be.d(1), be = null), /*attachmentName*/
      F[9] ? ce ? ce.p(F, ie) : (ce = ls(F), ce.c(), ce.m(Q, null)) : ce && (ce.d(1), ce = null), /*error*/
      F[3] ? he ? he.p(F, ie) : (he = is(F), he.c(), he.m(g, Ee)) : he && (he.d(1), he = null), /*success*/
      F[4] ? xe || (xe = ns(), xe.c(), xe.m(g, null)) : xe && (xe.d(1), xe = null), /*canViewInbox*/
      F[7] ? _e ? _e.p(F, ie) : (_e = rs(F), _e.c(), _e.m(Pe, null)) : _e && (_e.d(1), _e = null), ie & /*submitting*/
      4 && Oe !== (Oe = /*submitting*/
      F[2] ? "Enviando..." : "Enviar reporte") && A(Qe, Oe), ie & /*canSubmit*/
      16384 && We !== (We = !/*canSubmit*/
      F[14]) && (Ae.disabled = We);
    },
    d(F) {
      F && S(e), He(oe, F), be && be.d(), ce && ce.d(), he && he.d(), xe && xe.d(), _e && _e.d(), at = !1, ke(Fe);
    }
  };
}
function es(l) {
  let e, t = (
    /*cat*/
    l[28] + ""
  ), s, i;
  return {
    c() {
      e = d("option"), s = z(t), e.__value = i = /*cat*/
      l[28], Ve(e, e.__value);
    },
    m(c, r) {
      L(c, e, r), n(e, s);
    },
    p(c, r) {
      r & /*categories*/
      2 && t !== (t = /*cat*/
      c[28] + "") && A(s, t), r & /*categories*/
      2 && i !== (i = /*cat*/
      c[28]) && (e.__value = i, Ve(e, e.__value));
    },
    d(c) {
      c && S(e);
    }
  };
}
function ts(l) {
  let e, t, s;
  return {
    c() {
      e = d("button"), e.textContent = "Quitar", a(e, "class", "ghost small svelte-sxmilm"), a(e, "type", "button");
    },
    m(i, c) {
      L(i, e, c), t || (s = O(
        e,
        "click",
        /*clearAttachment*/
        l[20]
      ), t = !0);
    },
    p: D,
    d(i) {
      i && S(e), t = !1, s();
    }
  };
}
function ls(l) {
  let e, t, s, i, c, r, o = (
    /*attachmentUploading*/
    l[11] ? "Subiendo imagen..." : "Imagen lista para adjuntar"
  ), f, p, u = (
    /*attachmentUrl*/
    l[10] && ss(l)
  );
  return {
    c() {
      e = d("div"), t = d("div"), s = d("p"), i = z(
        /*attachmentName*/
        l[9]
      ), c = y(), r = d("p"), f = z(o), p = y(), u && u.c(), a(s, "class", "attachment-name svelte-sxmilm"), a(r, "class", "attachment-caption svelte-sxmilm"), a(e, "class", "attachment-preview svelte-sxmilm");
    },
    m(v, m) {
      L(v, e, m), n(e, t), n(t, s), n(s, i), n(t, c), n(t, r), n(r, f), n(e, p), u && u.m(e, null);
    },
    p(v, m) {
      m & /*attachmentName*/
      512 && A(
        i,
        /*attachmentName*/
        v[9]
      ), m & /*attachmentUploading*/
      2048 && o !== (o = /*attachmentUploading*/
      v[11] ? "Subiendo imagen..." : "Imagen lista para adjuntar") && A(f, o), /*attachmentUrl*/
      v[10] ? u ? u.p(v, m) : (u = ss(v), u.c(), u.m(e, null)) : u && (u.d(1), u = null);
    },
    d(v) {
      v && S(e), u && u.d();
    }
  };
}
function ss(l) {
  let e, t;
  return {
    c() {
      e = d("img"), Te(e.src, t = /*attachmentUrl*/
      l[10]) || a(e, "src", t), a(e, "alt", "Adjunto del report"), a(e, "class", "svelte-sxmilm");
    },
    m(s, i) {
      L(s, e, i);
    },
    p(s, i) {
      i & /*attachmentUrl*/
      1024 && !Te(e.src, t = /*attachmentUrl*/
      s[10]) && a(e, "src", t);
    },
    d(s) {
      s && S(e);
    }
  };
}
function is(l) {
  let e, t;
  return {
    c() {
      e = d("div"), t = z(
        /*error*/
        l[3]
      ), a(e, "class", "error svelte-sxmilm");
    },
    m(s, i) {
      L(s, e, i), n(e, t);
    },
    p(s, i) {
      i & /*error*/
      8 && A(
        t,
        /*error*/
        s[3]
      );
    },
    d(s) {
      s && S(e);
    }
  };
}
function ns(l) {
  let e;
  return {
    c() {
      e = d("div"), e.textContent = "Reporte enviado. ¡Gracias!", a(e, "class", "success svelte-sxmilm");
    },
    m(t, s) {
      L(t, e, s);
    },
    d(t) {
      t && S(e);
    }
  };
}
function rs(l) {
  let e, t, s, i;
  return {
    c() {
      e = d("button"), t = z(
        /*inboxLabel*/
        l[8]
      ), a(e, "class", "secondary svelte-sxmilm"), a(e, "type", "button");
    },
    m(c, r) {
      L(c, e, r), n(e, t), s || (i = O(
        e,
        "click",
        /*openInbox*/
        l[18]
      ), s = !0);
    },
    p(c, r) {
      r & /*inboxLabel*/
      256 && A(
        t,
        /*inboxLabel*/
        c[8]
      );
    },
    d(c) {
      c && S(e), s = !1, i();
    }
  };
}
function Vn(l) {
  let e, t = (
    /*open*/
    l[0] && $l(l)
  );
  return {
    c() {
      t && t.c(), e = et();
    },
    m(s, i) {
      t && t.m(s, i), L(s, e, i);
    },
    p(s, [i]) {
      /*open*/
      s[0] ? t ? t.p(s, i) : (t = $l(s), t.c(), t.m(e.parentNode, e)) : t && (t.d(1), t = null);
    },
    i: D,
    o: D,
    d(s) {
      s && S(e), t && t.d(s);
    }
  };
}
const Un = 5, Dt = 1e3;
function Gn(l, e, t) {
  let s, i, c, { open: r = !1 } = e, { categories: o = [] } = e, { submitting: f = !1 } = e, { error: p = "" } = e, { success: u = !1 } = e, { title: v = "Reportar un problema" } = e, { hint: m = "Cuéntanos qué ha ocurrido para poder ayudarte." } = e, { canViewInbox: h = !1 } = e, { inboxLabel: b = "Abrir buzón de reports" } = e, { attachmentName: g = "" } = e, { attachmentUrl: x = "" } = e, { attachmentUploading: q = !1 } = e, M = "", k = "";
  const _ = Ie(), T = () => {
    t(12, M = ""), t(13, k = "");
  }, w = () => {
    _("close");
  }, j = () => {
    c && _("submit", { category: M, message: k });
  }, E = () => {
    _("inboxclick");
  }, I = (N) => {
    var re, Q;
    const J = ((Q = (re = N == null ? void 0 : N.currentTarget) == null ? void 0 : re.files) == null ? void 0 : Q[0]) ?? null;
    _("attachmentchange", { file: J }), N.currentTarget.value = "";
  }, B = () => {
    _("attachmentchange", { file: null });
  };
  function V(N) {
    li.call(this, l, N);
  }
  function R() {
    M = Ws(this), t(12, M), t(1, o);
  }
  function U() {
    k = this.value, t(13, k);
  }
  const P = (N) => N.key === "Escape" && w();
  return l.$$set = (N) => {
    "open" in N && t(0, r = N.open), "categories" in N && t(1, o = N.categories), "submitting" in N && t(2, f = N.submitting), "error" in N && t(3, p = N.error), "success" in N && t(4, u = N.success), "title" in N && t(5, v = N.title), "hint" in N && t(6, m = N.hint), "canViewInbox" in N && t(7, h = N.canViewInbox), "inboxLabel" in N && t(8, b = N.inboxLabel), "attachmentName" in N && t(9, g = N.attachmentName), "attachmentUrl" in N && t(10, x = N.attachmentUrl), "attachmentUploading" in N && t(11, q = N.attachmentUploading);
  }, l.$$.update = () => {
    l.$$.dirty & /*message*/
    8192 && t(21, s = k.trim()), l.$$.dirty & /*message*/
    8192 && t(15, i = Dt - k.length), l.$$.dirty & /*selected, trimmedMessage, submitting*/
    2101252 && t(14, c = !!M && s.length >= Un && !f), l.$$.dirty & /*success*/
    16 && u && T();
  }, [
    r,
    o,
    f,
    p,
    u,
    v,
    m,
    h,
    b,
    g,
    x,
    q,
    M,
    k,
    c,
    i,
    w,
    j,
    E,
    I,
    B,
    s,
    V,
    R,
    U,
    P
  ];
}
class Xs extends ve {
  constructor(e) {
    super(), ue(
      this,
      e,
      Gn,
      Vn,
      ee,
      {
        open: 0,
        categories: 1,
        submitting: 2,
        error: 3,
        success: 4,
        title: 5,
        hint: 6,
        canViewInbox: 7,
        inboxLabel: 8,
        attachmentName: 9,
        attachmentUrl: 10,
        attachmentUploading: 11
      },
      Fn
    );
  }
  get open() {
    return this.$$.ctx[0];
  }
  set open(e) {
    this.$$set({ open: e }), C();
  }
  get categories() {
    return this.$$.ctx[1];
  }
  set categories(e) {
    this.$$set({ categories: e }), C();
  }
  get submitting() {
    return this.$$.ctx[2];
  }
  set submitting(e) {
    this.$$set({ submitting: e }), C();
  }
  get error() {
    return this.$$.ctx[3];
  }
  set error(e) {
    this.$$set({ error: e }), C();
  }
  get success() {
    return this.$$.ctx[4];
  }
  set success(e) {
    this.$$set({ success: e }), C();
  }
  get title() {
    return this.$$.ctx[5];
  }
  set title(e) {
    this.$$set({ title: e }), C();
  }
  get hint() {
    return this.$$.ctx[6];
  }
  set hint(e) {
    this.$$set({ hint: e }), C();
  }
  get canViewInbox() {
    return this.$$.ctx[7];
  }
  set canViewInbox(e) {
    this.$$set({ canViewInbox: e }), C();
  }
  get inboxLabel() {
    return this.$$.ctx[8];
  }
  set inboxLabel(e) {
    this.$$set({ inboxLabel: e }), C();
  }
  get attachmentName() {
    return this.$$.ctx[9];
  }
  set attachmentName(e) {
    this.$$set({ attachmentName: e }), C();
  }
  get attachmentUrl() {
    return this.$$.ctx[10];
  }
  set attachmentUrl(e) {
    this.$$set({ attachmentUrl: e }), C();
  }
  get attachmentUploading() {
    return this.$$.ctx[11];
  }
  set attachmentUploading(e) {
    this.$$set({ attachmentUploading: e }), C();
  }
}
pe(Xs, { open: { type: "Boolean" }, categories: {}, submitting: { type: "Boolean" }, error: {}, success: { type: "Boolean" }, title: {}, hint: {}, canViewInbox: { type: "Boolean" }, inboxLabel: {}, attachmentName: {}, attachmentUrl: {}, attachmentUploading: { type: "Boolean" } }, [], [], !0);
function Jn(l) {
  de(l, "svelte-1qhrdq8", ".overlay.svelte-1qhrdq8{position:fixed;inset:0;z-index:80;display:flex;align-items:center;justify-content:center;padding:24px;background:radial-gradient(circle at top, rgba(59, 130, 246, 0.14), rgba(0, 0, 0, 0.58));backdrop-filter:blur(10px)}.card.svelte-1qhrdq8{width:min(560px, 92vw);border-radius:28px;padding:28px 26px 24px;background:linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);box-shadow:0 24px 60px rgba(15, 23, 42, 0.24), 0 10px 28px rgba(15, 23, 42, 0.12);border:1px solid rgba(226, 232, 240, 0.9)}.eyebrow.svelte-1qhrdq8{display:inline-flex;align-items:center;padding:6px 12px;border-radius:999px;background:rgba(16, 185, 129, 0.12);color:#047857;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase}h2.svelte-1qhrdq8{margin:14px 0 8px;font-size:24px;font-weight:700;color:#0f172a}p.svelte-1qhrdq8{margin:0;font-size:15px;line-height:1.7;color:#475569;white-space:pre-wrap}.actions.svelte-1qhrdq8{margin-top:20px;display:flex;justify-content:flex-end}button.svelte-1qhrdq8{border:none;border-radius:14px;padding:10px 18px;font-size:14px;font-weight:600;color:#ffffff;background:linear-gradient(135deg, #059669, #047857);box-shadow:0 12px 24px rgba(5, 150, 105, 0.24);cursor:pointer}");
}
function as(l) {
  let e, t, s, i, c, r, o, f, p, u, v, m, h, b, g, x, q, M;
  return {
    c() {
      e = d("div"), t = d("div"), s = d("div"), s.textContent = "Aviso", i = y(), c = d("h2"), r = z(
        /*title*/
        l[1]
      ), o = y(), f = d("p"), p = z(
        /*message*/
        l[2]
      ), u = y(), v = d("div"), m = d("button"), h = z(
        /*cta*/
        l[3]
      ), a(s, "class", "eyebrow svelte-1qhrdq8"), a(c, "class", "svelte-1qhrdq8"), a(f, "class", "svelte-1qhrdq8"), a(m, "type", "button"), a(m, "class", "svelte-1qhrdq8"), a(v, "class", "actions svelte-1qhrdq8"), a(t, "class", "card svelte-1qhrdq8"), a(e, "class", "overlay svelte-1qhrdq8"), a(e, "role", "button"), a(e, "tabindex", "0"), a(e, "aria-label", "Cerrar aviso");
    },
    m(k, _) {
      L(k, e, _), n(e, t), n(t, s), n(t, i), n(t, c), n(c, r), n(t, o), n(t, f), n(f, p), n(t, u), n(t, v), n(v, m), n(m, h), x = !0, q || (M = [
        O(
          m,
          "click",
          /*handleClose*/
          l[4]
        ),
        O(
          e,
          "click",
          /*handleBackdrop*/
          l[5]
        ),
        O(
          e,
          "keydown",
          /*handleKeydown*/
          l[6]
        )
      ], q = !0);
    },
    p(k, _) {
      (!x || _ & /*title*/
      2) && A(
        r,
        /*title*/
        k[1]
      ), (!x || _ & /*message*/
      4) && A(
        p,
        /*message*/
        k[2]
      ), (!x || _ & /*cta*/
      8) && A(
        h,
        /*cta*/
        k[3]
      );
    },
    i(k) {
      x || (k && Ne(() => {
        x && (b || (b = Le(t, $e, { y: 18, duration: 240 }, !0)), b.run(1));
      }), k && Ne(() => {
        x && (g || (g = Le(e, Ct, { duration: 180 }, !0)), g.run(1));
      }), x = !0);
    },
    o(k) {
      k && (b || (b = Le(t, $e, { y: 18, duration: 240 }, !1)), b.run(0)), k && (g || (g = Le(e, Ct, { duration: 180 }, !1)), g.run(0)), x = !1;
    },
    d(k) {
      k && S(e), k && b && b.end(), k && g && g.end(), q = !1, ke(M);
    }
  };
}
function Qn(l) {
  let e, t = (
    /*open*/
    l[0] && as(l)
  );
  return {
    c() {
      t && t.c(), e = et();
    },
    m(s, i) {
      t && t.m(s, i), L(s, e, i);
    },
    p(s, [i]) {
      /*open*/
      s[0] ? t ? (t.p(s, i), i & /*open*/
      1 && Ge(t, 1)) : (t = as(s), t.c(), Ge(t, 1), t.m(e.parentNode, e)) : t && (Yt(), ht(t, 1, 1, () => {
        t = null;
      }), Ot());
    },
    i(s) {
      Ge(t);
    },
    o(s) {
      ht(t);
    },
    d(s) {
      s && S(e), t && t.d(s);
    }
  };
}
function Wn(l, e, t) {
  let { open: s = !1 } = e, { title: i = "Aviso" } = e, { message: c = "" } = e, { cta: r = "Entendido" } = e;
  const o = Ie(), f = () => {
    t(0, s = !1), o("dismiss");
  }, p = (v) => {
    v.target === v.currentTarget && f();
  }, u = (v) => {
    (v.key === "Escape" || v.key === "Enter" || v.key === " ") && f();
  };
  return l.$$set = (v) => {
    "open" in v && t(0, s = v.open), "title" in v && t(1, i = v.title), "message" in v && t(2, c = v.message), "cta" in v && t(3, r = v.cta);
  }, [s, i, c, r, f, p, u];
}
class Bs extends ve {
  constructor(e) {
    super(), ue(this, e, Wn, Qn, ee, { open: 0, title: 1, message: 2, cta: 3 }, Jn);
  }
  get open() {
    return this.$$.ctx[0];
  }
  set open(e) {
    this.$$set({ open: e }), C();
  }
  get title() {
    return this.$$.ctx[1];
  }
  set title(e) {
    this.$$set({ title: e }), C();
  }
  get message() {
    return this.$$.ctx[2];
  }
  set message(e) {
    this.$$set({ message: e }), C();
  }
  get cta() {
    return this.$$.ctx[3];
  }
  set cta(e) {
    this.$$set({ cta: e }), C();
  }
}
customElements.define("svelte-announcement-popup", pe(Bs, { open: { type: "Boolean" }, title: {}, message: {}, cta: {} }, [], [], !0));
function Kn(l) {
  de(l, "svelte-3khibh", `:host{display:block}.tabs-shell.svelte-3khibh.svelte-3khibh{margin-bottom:2rem;border-bottom:1px solid rgba(203, 213, 225, 0.75)}.tabs-row.svelte-3khibh.svelte-3khibh{position:relative;display:flex;flex-wrap:wrap;justify-content:center;gap:2.2rem;padding:0 0 0.9rem}button.svelte-3khibh.svelte-3khibh{position:relative;z-index:1;appearance:none;border:0;background:transparent;color:rgba(71, 85, 105, 0.92);cursor:pointer;font:inherit;font-size:0.98rem;font-weight:500;line-height:1;padding:0;transition:color 220ms ease,
      transform 220ms ease,
      opacity 220ms ease}button.svelte-3khibh.svelte-3khibh:hover{color:#111827}button.active.svelte-3khibh.svelte-3khibh{color:#111827}button.svelte-3khibh span.svelte-3khibh{display:inline-block;transition:transform 260ms cubic-bezier(0.22, 1, 0.36, 1),
      letter-spacing 260ms ease}button.active.svelte-3khibh span.svelte-3khibh{transform:translateY(-2px);letter-spacing:0.01em}.indicator.svelte-3khibh.svelte-3khibh{position:absolute;bottom:0;left:0;height:3px;border-radius:999px;background:linear-gradient(90deg, #9fdbc2 0%, #67b48a 100%);box-shadow:0 10px 20px -14px rgba(103, 180, 138, 0.6);transition:transform 320ms cubic-bezier(0.22, 1, 0.36, 1),
      width 320ms cubic-bezier(0.22, 1, 0.36, 1)}@media(max-width: 900px){.tabs-row.svelte-3khibh.svelte-3khibh{gap:1.35rem}button.svelte-3khibh.svelte-3khibh{font-size:0.94rem}}@media(max-width: 640px){.tabs-shell.svelte-3khibh.svelte-3khibh{margin-bottom:1.5rem}.tabs-row.svelte-3khibh.svelte-3khibh{gap:0.85rem 1rem;justify-content:flex-start;padding-bottom:0.8rem}button.svelte-3khibh.svelte-3khibh{font-size:0.92rem}}`);
}
function os(l, e, t) {
  const s = l.slice();
  return s[12] = e[t], s[13] = e, s[14] = t, s;
}
function cs(l) {
  let e, t;
  return {
    c() {
      e = d("span"), a(e, "class", "indicator svelte-3khibh"), a(e, "aria-hidden", "true"), a(e, "style", t = `transform: translateX(${/*indicatorLeft*/
      l[2]}px); width: ${/*indicatorWidth*/
      l[3]}px;`);
    },
    m(s, i) {
      L(s, e, i);
    },
    p(s, i) {
      i & /*indicatorLeft, indicatorWidth*/
      12 && t !== (t = `transform: translateX(${/*indicatorLeft*/
      s[2]}px); width: ${/*indicatorWidth*/
      s[3]}px;`) && a(e, "style", t);
    },
    d(s) {
      s && S(e);
    }
  };
}
function fs(l) {
  let e, t, s = (
    /*tab*/
    l[12].label + ""
  ), i, c, r, o = (
    /*index*/
    l[14]
  ), f, p;
  const u = () => (
    /*button_binding*/
    l[8](e, o)
  ), v = () => (
    /*button_binding*/
    l[8](null, o)
  );
  function m() {
    return (
      /*click_handler*/
      l[9](
        /*tab*/
        l[12]
      )
    );
  }
  return {
    c() {
      e = d("button"), t = d("span"), i = z(s), c = y(), a(t, "class", "svelte-3khibh"), a(e, "type", "button"), a(e, "role", "tab"), a(e, "aria-selected", r = /*isActive*/
      l[5](
        /*tab*/
        l[12].href
      )), a(e, "class", "svelte-3khibh"), Ze(
        e,
        "active",
        /*isActive*/
        l[5](
          /*tab*/
          l[12].href
        )
      );
    },
    m(h, b) {
      L(h, e, b), n(e, t), n(t, i), n(e, c), u(), f || (p = O(e, "click", m), f = !0);
    },
    p(h, b) {
      l = h, b & /*tabs*/
      1 && s !== (s = /*tab*/
      l[12].label + "") && A(i, s), b & /*tabs*/
      1 && r !== (r = /*isActive*/
      l[5](
        /*tab*/
        l[12].href
      )) && a(e, "aria-selected", r), o !== /*index*/
      l[14] && (v(), o = /*index*/
      l[14], u()), b & /*isActive, tabs*/
      33 && Ze(
        e,
        "active",
        /*isActive*/
        l[5](
          /*tab*/
          l[12].href
        )
      );
    },
    d(h) {
      h && S(e), v(), f = !1, p();
    }
  };
}
function Zn(l) {
  let e, t, s, i = (
    /*ready*/
    l[4] && cs(l)
  ), c = Z(
    /*tabs*/
    l[0]
  ), r = [];
  for (let o = 0; o < c.length; o += 1)
    r[o] = fs(os(l, c, o));
  return {
    c() {
      e = d("nav"), t = d("div"), i && i.c(), s = y();
      for (let o = 0; o < r.length; o += 1)
        r[o].c();
      a(t, "class", "tabs-row svelte-3khibh"), a(t, "role", "tablist"), a(e, "class", "tabs-shell svelte-3khibh"), a(e, "aria-label", "Navegación de hitos");
    },
    m(o, f) {
      L(o, e, f), n(e, t), i && i.m(t, null), n(t, s);
      for (let p = 0; p < r.length; p += 1)
        r[p] && r[p].m(t, null);
    },
    p(o, [f]) {
      if (/*ready*/
      o[4] ? i ? i.p(o, f) : (i = cs(o), i.c(), i.m(t, s)) : i && (i.d(1), i = null), f & /*isActive, tabs, buttonRefs, handleNavigate*/
      99) {
        c = Z(
          /*tabs*/
          o[0]
        );
        let p;
        for (p = 0; p < c.length; p += 1) {
          const u = os(o, c, p);
          r[p] ? r[p].p(u, f) : (r[p] = fs(u), r[p].c(), r[p].m(t, null));
        }
        for (; p < r.length; p += 1)
          r[p].d(1);
        r.length = c.length;
      }
    },
    i: D,
    o: D,
    d(o) {
      o && S(e), i && i.d(), He(r, o);
    }
  };
}
function $n(l, e, t) {
  let { tabs: s = [] } = e, { activeHref: i = "" } = e;
  const c = Ie();
  let r = [], o = 0, f = 0, p = !1;
  const u = (g) => i === g || g !== "/milestones" && i.startsWith(g), v = (g) => {
    c("navigate", { href: g });
  }, m = () => {
    const g = s.findIndex((q) => u(q.href)), x = r[g];
    x && (t(2, o = x.offsetLeft), t(3, f = x.offsetWidth), t(4, p = !0));
  };
  bs(() => {
    m();
    const g = () => m();
    return window.addEventListener("resize", g), () => {
      window.removeEventListener("resize", g);
    };
  });
  function h(g, x) {
    Pt[g ? "unshift" : "push"](() => {
      r[x] = g, t(1, r);
    });
  }
  const b = (g) => v(g.href);
  return l.$$set = (g) => {
    "tabs" in g && t(0, s = g.tabs), "activeHref" in g && t(7, i = g.activeHref);
  }, l.$$.update = () => {
    l.$$.dirty & /*tabs*/
    1 && dl().then(m), l.$$.dirty & /*activeHref*/
    128 && dl().then(m);
  }, [
    s,
    r,
    o,
    f,
    p,
    u,
    v,
    i,
    h,
    b
  ];
}
class Hs extends ve {
  constructor(e) {
    super(), ue(this, e, $n, Zn, ee, { tabs: 0, activeHref: 7 }, Kn);
  }
  get tabs() {
    return this.$$.ctx[0];
  }
  set tabs(e) {
    this.$$set({ tabs: e }), C();
  }
  get activeHref() {
    return this.$$.ctx[7];
  }
  set activeHref(e) {
    this.$$set({ activeHref: e }), C();
  }
}
customElements.define("svelte-milestones-tabs", pe(Hs, { tabs: {}, activeHref: {} }, [], [], !0));
const me = (l, e) => {
  const t = e.element;
  customElements.get(l) || customElements.define(l, t ?? e);
};
me("svelte-counter", ks);
me("svelte-orbit-card", ws);
me("svelte-pulse-badge", zs);
me("svelte-ripple-button", qs);
me("svelte-stagger-list", js);
me("svelte-thermometer", Cs);
me("svelte-podium", Ss);
me("svelte-balloon-gift", Ls);
me("svelte-achievement-card", Ts);
me("svelte-parallax-card", Es);
me("svelte-flip-counter", As);
me("svelte-parallax-stack", Ms);
me("svelte-video-card", Ns);
me("svelte-season-popup", Is);
me("svelte-quota-token", Ps);
me("svelte-user-stats-panel", Rs);
me("svelte-rewards-podium", Ds);
me("svelte-error-report-modal", Xs);
me("svelte-announcement-popup", Bs);
me("svelte-milestones-tabs", Hs);
