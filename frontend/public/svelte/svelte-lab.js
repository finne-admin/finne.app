var Es = Object.defineProperty;
var Ms = (l, e, t) => e in l ? Es(l, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : l[e] = t;
var ze = (l, e, t) => Ms(l, typeof e != "symbol" ? e + "" : e, t);
function X() {
}
const is = (l) => l;
function ns(l) {
  return l();
}
function il() {
  return /* @__PURE__ */ Object.create(null);
}
function me(l) {
  l.forEach(ns);
}
function At(l) {
  return typeof l == "function";
}
function le(l, e) {
  return l != l ? e == e : l !== e || l && typeof l == "object" || typeof l == "function";
}
let gt;
function Me(l, e) {
  return l === e ? !0 : (gt || (gt = document.createElement("a")), gt.href = e, l === gt.href);
}
function As(l) {
  return Object.keys(l).length === 0;
}
function Ge(l) {
  return l ?? "";
}
function nl(l) {
  const e = typeof l == "string" && l.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);
  return e ? [parseFloat(e[1]), e[2] || "px"] : [
    /** @type {number} */
    l,
    "px"
  ];
}
const rs = typeof window < "u";
let Ns = rs ? () => window.performance.now() : () => Date.now(), Nt = rs ? (l) => requestAnimationFrame(l) : X;
const et = /* @__PURE__ */ new Set();
function as(l) {
  et.forEach((e) => {
    e.c(l) || (et.delete(e), e.f());
  }), et.size !== 0 && Nt(as);
}
function Ps(l) {
  let e;
  return et.size === 0 && Nt(as), {
    promise: new Promise((t) => {
      et.add(e = { c: l, f: t });
    }),
    abort() {
      et.delete(e);
    }
  };
}
function n(l, e) {
  l.appendChild(e);
}
function ce(l, e, t) {
  const s = Pt(l);
  if (!s.getElementById(e)) {
    const i = d("style");
    i.id = e, i.textContent = t, os(s, i);
  }
}
function Pt(l) {
  if (!l) return document;
  const e = l.getRootNode ? l.getRootNode() : l.ownerDocument;
  return e && /** @type {ShadowRoot} */
  e.host ? (
    /** @type {ShadowRoot} */
    e
  ) : l.ownerDocument;
}
function Rs(l) {
  const e = d("style");
  return e.textContent = "/* empty */", os(Pt(l), e), e.sheet;
}
function os(l, e) {
  return n(
    /** @type {Document} */
    l.head || l,
    e
  ), e.sheet;
}
function E(l, e, t) {
  l.insertBefore(e, t || null);
}
function S(l) {
  l.parentNode && l.parentNode.removeChild(l);
}
function Ie(l, e) {
  for (let t = 0; t < l.length; t += 1)
    l[t] && l[t].d(e);
}
function d(l) {
  return document.createElement(l);
}
function rl(l) {
  return document.createElementNS("http://www.w3.org/2000/svg", l);
}
function z(l) {
  return document.createTextNode(l);
}
function y() {
  return z(" ");
}
function Be() {
  return z("");
}
function O(l, e, t, s) {
  return l.addEventListener(e, t, s), () => l.removeEventListener(e, t, s);
}
function Tt(l) {
  return function(e) {
    return e.preventDefault(), l.call(this, e);
  };
}
function Is(l) {
  return function(e) {
    return e.stopPropagation(), l.call(this, e);
  };
}
function a(l, e, t) {
  t == null ? l.removeAttribute(e) : l.getAttribute(e) !== t && l.setAttribute(e, t);
}
function Ds(l) {
  return Array.from(l.childNodes);
}
function M(l, e) {
  e = "" + e, l.data !== e && (l.data = /** @type {string} */
  e);
}
function Ne(l, e) {
  l.value = e ?? "";
}
function al(l, e, t) {
  for (let s = 0; s < l.options.length; s += 1) {
    const i = l.options[s];
    if (i.__value === e) {
      i.selected = !0;
      return;
    }
  }
  (!t || e !== void 0) && (l.selectedIndex = -1);
}
function Xs(l) {
  const e = l.querySelector(":checked");
  return e && e.__value;
}
function lt(l, e, t) {
  l.classList.toggle(e, !!t);
}
function cs(l, e, { bubbles: t = !1, cancelable: s = !1 } = {}) {
  return new CustomEvent(l, { detail: e, bubbles: t, cancelable: s });
}
function Ys(l) {
  const e = {};
  return l.childNodes.forEach(
    /** @param {Element} node */
    (t) => {
      e[t.slot || "default"] = !0;
    }
  ), e;
}
const mt = /* @__PURE__ */ new Map();
let _t = 0;
function Bs(l) {
  let e = 5381, t = l.length;
  for (; t--; ) e = (e << 5) - e ^ l.charCodeAt(t);
  return e >>> 0;
}
function Os(l, e) {
  const t = { stylesheet: Rs(e), rules: {} };
  return mt.set(l, t), t;
}
function ol(l, e, t, s, i, c, r, o = 0) {
  const f = 16.666 / s;
  let v = `{
`;
  for (let _ = 0; _ <= 1; _ += f) {
    const q = e + (t - e) * c(_);
    v += _ * 100 + `%{${r(q, 1 - q)}}
`;
  }
  const p = v + `100% {${r(t, 1 - t)}}
}`, u = `__svelte_${Bs(p)}_${o}`, g = Pt(l), { stylesheet: h, rules: m } = mt.get(g) || Os(g, l);
  m[u] || (m[u] = !0, h.insertRule(`@keyframes ${u} ${p}`, h.cssRules.length));
  const b = l.style.animation || "";
  return l.style.animation = `${b ? `${b}, ` : ""}${u} ${s}ms linear ${i}ms 1 both`, _t += 1, u;
}
function Hs(l, e) {
  const t = (l.style.animation || "").split(", "), s = t.filter(
    e ? (c) => c.indexOf(e) < 0 : (c) => c.indexOf("__svelte") === -1
    // remove all Svelte animations
  ), i = t.length - s.length;
  i && (l.style.animation = s.join(", "), _t -= i, _t || Fs());
}
function Fs() {
  Nt(() => {
    _t || (mt.forEach((l) => {
      const { ownerNode: e } = l.stylesheet;
      e && S(e);
    }), mt.clear());
  });
}
let at;
function rt(l) {
  at = l;
}
function fs() {
  if (!at) throw new Error("Function called outside component initialization");
  return at;
}
function Vs(l) {
  fs().$$.on_mount.push(l);
}
function Ae() {
  const l = fs();
  return (e, t, { cancelable: s = !1 } = {}) => {
    const i = l.$$.callbacks[e];
    if (i) {
      const c = cs(
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
function Us(l, e) {
  const t = l.$$.callbacks[e.type];
  t && t.slice().forEach((s) => s.call(this, e));
}
const Ze = [], cl = [];
let tt = [];
const fl = [], Gs = /* @__PURE__ */ Promise.resolve();
let Et = !1;
function $s() {
  Et || (Et = !0, Gs.then(C));
}
function Se(l) {
  tt.push(l);
}
const St = /* @__PURE__ */ new Set();
let We = 0;
function C() {
  if (We !== 0)
    return;
  const l = at;
  do {
    try {
      for (; We < Ze.length; ) {
        const e = Ze[We];
        We++, rt(e), Js(e.$$);
      }
    } catch (e) {
      throw Ze.length = 0, We = 0, e;
    }
    for (rt(null), Ze.length = 0, We = 0; cl.length; ) cl.pop()();
    for (let e = 0; e < tt.length; e += 1) {
      const t = tt[e];
      St.has(t) || (St.add(t), t());
    }
    tt.length = 0;
  } while (Ze.length);
  for (; fl.length; )
    fl.pop()();
  Et = !1, St.clear(), rt(l);
}
function Js(l) {
  if (l.fragment !== null) {
    l.update(), me(l.before_update);
    const e = l.dirty;
    l.dirty = [-1], l.fragment && l.fragment.p(l.ctx, e), l.after_update.forEach(Se);
  }
}
function Ks(l) {
  const e = [], t = [];
  tt.forEach((s) => l.indexOf(s) === -1 ? e.push(s) : t.push(s)), t.forEach((s) => s()), tt = e;
}
let nt;
function Qs() {
  return nt || (nt = Promise.resolve(), nt.then(() => {
    nt = null;
  })), nt;
}
function Lt(l, e, t) {
  l.dispatchEvent(cs(`${e ? "intro" : "outro"}${t}`));
}
const ht = /* @__PURE__ */ new Set();
let Pe;
function Rt() {
  Pe = {
    r: 0,
    c: [],
    p: Pe
    // parent group
  };
}
function It() {
  Pe.r || me(Pe.c), Pe = Pe.p;
}
function Re(l, e) {
  l && l.i && (ht.delete(l), l.i(e));
}
function ot(l, e, t, s) {
  if (l && l.o) {
    if (ht.has(l)) return;
    ht.add(l), Pe.c.push(() => {
      ht.delete(l), s && (t && l.d(1), s());
    }), l.o(e);
  } else s && s();
}
const Ws = { duration: 0 };
function qe(l, e, t, s) {
  let c = e(l, t, { direction: "both" }), r = s ? 0 : 1, o = null, f = null, v = null, p;
  function u() {
    v && Hs(l, v);
  }
  function g(m, b) {
    const _ = (
      /** @type {Program['d']} */
      m.b - r
    );
    return b *= Math.abs(_), {
      a: r,
      b: m.b,
      d: _,
      duration: b,
      start: m.start,
      end: m.start + b,
      group: m.group
    };
  }
  function h(m) {
    const {
      delay: b = 0,
      duration: _ = 300,
      easing: q = is,
      tick: A = X,
      css: w
    } = c || Ws, x = {
      start: Ns() + b,
      b: m
    };
    m || (x.group = Pe, Pe.r += 1), "inert" in l && (m ? p !== void 0 && (l.inert = p) : (p = /** @type {HTMLElement} */
    l.inert, l.inert = !0)), o || f ? f = x : (w && (u(), v = ol(l, r, m, _, b, q, w)), m && A(0, 1), o = g(x, _), Se(() => Lt(l, m, "start")), Ps((L) => {
      if (f && L > f.start && (o = g(f, _), f = null, Lt(l, o.b, "start"), w && (u(), v = ol(
        l,
        r,
        o.b,
        o.duration,
        0,
        q,
        c.css
      ))), o) {
        if (L >= o.end)
          A(r = o.b, 1 - r), Lt(l, o.b, "end"), f || (o.b ? u() : --o.group.r || me(o.group.c)), o = null;
        else if (L >= o.start) {
          const k = L - o.start;
          r = o.a + o.d * q(k / o.duration), A(r, 1 - r);
        }
      }
      return !!(o || f);
    }));
  }
  return {
    run(m) {
      At(c) ? Qs().then(() => {
        c = c({ direction: m ? "in" : "out" }), h(m);
      }) : h(m);
    },
    end() {
      u(), o = f = null;
    }
  };
}
function te(l) {
  return (l == null ? void 0 : l.length) !== void 0 ? l : Array.from(l);
}
function Dt(l, e) {
  l.d(1), e.delete(l.key);
}
function Xt(l, e, t, s, i, c, r, o, f, v, p, u) {
  let g = l.length, h = c.length, m = g;
  const b = {};
  for (; m--; ) b[l[m].key] = m;
  const _ = [], q = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), w = [];
  for (m = h; m--; ) {
    const j = u(i, c, m), T = t(j);
    let P = r.get(T);
    P ? w.push(() => P.p(j, e)) : (P = v(T, j), P.c()), q.set(T, _[m] = P), T in b && A.set(T, Math.abs(m - b[T]));
  }
  const x = /* @__PURE__ */ new Set(), L = /* @__PURE__ */ new Set();
  function k(j) {
    Re(j, 1), j.m(o, p), r.set(j.key, j), p = j.first, h--;
  }
  for (; g && h; ) {
    const j = _[h - 1], T = l[g - 1], P = j.key, N = T.key;
    j === T ? (p = j.first, g--, h--) : q.has(N) ? !r.has(P) || x.has(P) ? k(j) : L.has(N) ? g-- : A.get(P) > A.get(N) ? (L.add(P), k(j)) : (x.add(N), g--) : (f(T, r), g--);
  }
  for (; g--; ) {
    const j = l[g];
    q.has(j.key) || f(j, r);
  }
  for (; h; ) k(_[h - 1]);
  return me(w), _;
}
function Zs(l, e, t) {
  const { fragment: s, after_update: i } = l.$$;
  s && s.m(e, t), Se(() => {
    const c = l.$$.on_mount.map(ns).filter(At);
    l.$$.on_destroy ? l.$$.on_destroy.push(...c) : me(c), l.$$.on_mount = [];
  }), i.forEach(Se);
}
function ei(l, e) {
  const t = l.$$;
  t.fragment !== null && (Ks(t.after_update), me(t.on_destroy), t.fragment && t.fragment.d(e), t.on_destroy = t.fragment = null, t.ctx = []);
}
function ti(l, e) {
  l.$$.dirty[0] === -1 && (Ze.push(l), $s(), l.$$.dirty.fill(0)), l.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function fe(l, e, t, s, i, c, r = null, o = [-1]) {
  const f = at;
  rt(l);
  const v = l.$$ = {
    fragment: null,
    ctx: [],
    // state
    props: c,
    update: X,
    not_equal: i,
    bound: il(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(e.context || (f ? f.$$.context : [])),
    // everything else
    callbacks: il(),
    dirty: o,
    skip_bound: !1,
    root: e.target || f.$$.root
  };
  r && r(v.root);
  let p = !1;
  if (v.ctx = t ? t(l, e.props || {}, (u, g, ...h) => {
    const m = h.length ? h[0] : g;
    return v.ctx && i(v.ctx[u], v.ctx[u] = m) && (!v.skip_bound && v.bound[u] && v.bound[u](m), p && ti(l, u)), g;
  }) : [], v.update(), p = !0, me(v.before_update), v.fragment = s ? s(v.ctx) : !1, e.target) {
    if (e.hydrate) {
      const u = Ds(e.target);
      v.fragment && v.fragment.l(u), u.forEach(S);
    } else
      v.fragment && v.fragment.c();
    e.intro && Re(l.$$.fragment), Zs(l, e.target, e.anchor), C();
  }
  rt(f);
}
let ds;
typeof HTMLElement == "function" && (ds = class extends HTMLElement {
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
          let o;
          return {
            c: function() {
              o = d("slot"), r !== "default" && a(o, "name", r);
            },
            /**
             * @param {HTMLElement} target
             * @param {HTMLElement} [anchor]
             */
            m: function(p, u) {
              E(p, o, u);
            },
            d: function(p) {
              p && S(o);
            }
          };
        };
      };
      var e = t;
      if (await Promise.resolve(), !this.$$cn || this.$$c)
        return;
      const s = {}, i = Ys(this);
      for (const r of this.$$s)
        r in i && (s[r] = [t(r)]);
      for (const r of this.attributes) {
        const o = this.$$g_p(r.name);
        o in this.$$d || (this.$$d[o] = bt(o, r.value, this.$$p_d, "toProp"));
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
            const o = bt(
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
    this.$$r || (e = this.$$g_p(e), this.$$d[e] = bt(e, s, this.$$p_d, "toProp"), (i = this.$$c) == null || i.$set({ [e]: this.$$d[e] }));
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
function bt(l, e, t, s) {
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
function de(l, e, t, s, i, c) {
  let r = class extends ds {
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
        var v;
        f = bt(o, f, e), this.$$d[o] = f, (v = this.$$c) == null || v.$set({ [o]: f });
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
class pe {
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
    ei(this, 1), this.$destroy = X;
  }
  /**
   * @template {Extract<keyof Events, string>} K
   * @param {K} type
   * @param {((e: Events[K]) => void) | null | undefined} callback
   * @returns {() => void}
   */
  $on(e, t) {
    if (!At(t))
      return X;
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
    this.$$set && !As(e) && (this.$$.skip_bound = !0, this.$$set(e), this.$$.skip_bound = !1);
  }
}
const li = "4";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(li);
function si(l) {
  ce(l, "svelte-1tevv97", '.card.svelte-1tevv97{border-radius:14px;border:1px solid #e2e8f0;padding:16px;display:grid;gap:12px;font-family:"Figtree", system-ui, sans-serif;background:#ffffff;box-shadow:0 12px 24px rgba(15, 23, 42, 0.08)}.label.svelte-1tevv97{font-size:14px;color:#0f172a;margin:0}.count.svelte-1tevv97{font-weight:600;font-size:20px;color:#0f172a;margin:0}button.svelte-1tevv97{border:0;border-radius:10px;padding:10px 12px;background:#10b981;color:white;cursor:pointer;font-weight:600}button.svelte-1tevv97:hover{background:#059669}');
}
function ii(l) {
  let e, t, s, i, c, r, o, f, v, p, u, g;
  return {
    c() {
      e = d("div"), t = d("p"), s = z("Hola "), i = z(
        /*name*/
        l[0]
      ), c = y(), r = d("p"), o = z("Count: "), f = z(
        /*count*/
        l[1]
      ), v = y(), p = d("button"), p.textContent = "Emitir evento", a(t, "class", "label svelte-1tevv97"), a(r, "class", "count svelte-1tevv97"), a(p, "type", "button"), a(p, "class", "svelte-1tevv97"), a(e, "class", "card svelte-1tevv97");
    },
    m(h, m) {
      E(h, e, m), n(e, t), n(t, s), n(t, i), n(e, c), n(e, r), n(r, o), n(r, f), n(e, v), n(e, p), u || (g = O(
        p,
        "click",
        /*notify*/
        l[2]
      ), u = !0);
    },
    p(h, [m]) {
      m & /*name*/
      1 && M(
        i,
        /*name*/
        h[0]
      ), m & /*count*/
      2 && M(
        f,
        /*count*/
        h[1]
      );
    },
    i: X,
    o: X,
    d(h) {
      h && S(e), u = !1, g();
    }
  };
}
function ni(l, e, t) {
  let { name: s = "Ada" } = e, { count: i = 2 } = e;
  const c = Ae(), r = () => {
    c("ping", { from: "svelte", count: i });
  };
  return l.$$set = (o) => {
    "name" in o && t(0, s = o.name), "count" in o && t(1, i = o.count);
  }, [s, i, r];
}
class ps extends pe {
  constructor(e) {
    super(), fe(this, e, ni, ii, le, { name: 0, count: 1 }, si);
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
de(ps, { name: {}, count: {} }, [], [], !0);
function ri(l) {
  ce(l, "svelte-5733sx", ".card.svelte-5733sx{position:relative;overflow:hidden;border-radius:20px;border:1px solid #d1fae5;background:linear-gradient(145deg, #ffffff, #ecfdf5);padding:20px;min-height:140px;box-shadow:0 16px 36px rgba(15, 23, 42, 0.12)}.glow.svelte-5733sx{position:absolute;inset:-40%;background:radial-gradient(circle at 30% 20%, rgba(16, 185, 129, 0.3), transparent 55%);opacity:0.7;filter:blur(8px)}.content.svelte-5733sx{position:relative;display:grid;gap:8px;color:#0f172a}.title.svelte-5733sx{font-size:16px;font-weight:600;margin:0}.subtitle.svelte-5733sx{font-size:12px;margin:0;color:#64748b}.metrics.svelte-5733sx{margin-top:12px;display:flex;justify-content:space-between;font-size:12px;color:#0f172a}.orbit.svelte-5733sx{position:absolute;inset:-30%;border-radius:999px;border:1px dashed rgba(16, 185, 129, 0.3);animation:svelte-5733sx-orbit 6s linear infinite;opacity:var(--orbit-alpha)}.satellite-orbit.svelte-5733sx{position:absolute;inset:-30%;border-radius:999px;animation:svelte-5733sx-orbit 6s linear infinite}.satellite.svelte-5733sx{position:absolute;width:10px;height:10px;border-radius:999px;background:#34d399;box-shadow:0 0 12px rgba(16, 185, 129, 0.6);top:50%;left:50%;transform:translate(-50%, -50%) translateY(-78px)}@keyframes svelte-5733sx-orbit{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}");
}
function ai(l) {
  let e, t, s, i, c, r, o, f, v, p, u, g, h, m, b, _, q, A, w, x, L, k, j;
  return {
    c() {
      e = d("div"), t = d("div"), s = y(), i = d("div"), c = d("p"), r = z(
        /*title*/
        l[0]
      ), o = y(), f = d("p"), v = z(
        /*subtitle*/
        l[1]
      ), p = y(), u = d("div"), g = d("span"), g.textContent = "Flow", h = y(), m = d("span"), b = z(
        /*flow*/
        l[3]
      ), _ = z("%"), q = y(), A = d("div"), A.innerHTML = '<div class="satellite svelte-5733sx"></div>', w = y(), x = d("div"), a(t, "class", "glow svelte-5733sx"), a(c, "class", "title svelte-5733sx"), a(f, "class", "subtitle svelte-5733sx"), a(u, "class", "metrics svelte-5733sx"), a(i, "class", "content svelte-5733sx"), a(A, "class", "satellite-orbit svelte-5733sx"), a(x, "class", "orbit svelte-5733sx"), a(e, "class", "card svelte-5733sx"), a(e, "style", L = `--orbit-alpha:${/*intensity*/
      l[2]}`), a(e, "role", "button"), a(e, "tabindex", "0");
    },
    m(T, P) {
      E(T, e, P), n(e, t), n(e, s), n(e, i), n(i, c), n(c, r), n(i, o), n(i, f), n(f, v), n(i, p), n(i, u), n(u, g), n(u, h), n(u, m), n(m, b), n(m, _), n(e, q), n(e, A), n(e, w), n(e, x), k || (j = [
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
      ], k = !0);
    },
    p(T, [P]) {
      P & /*title*/
      1 && M(
        r,
        /*title*/
        T[0]
      ), P & /*subtitle*/
      2 && M(
        v,
        /*subtitle*/
        T[1]
      ), P & /*flow*/
      8 && M(
        b,
        /*flow*/
        T[3]
      ), P & /*intensity*/
      4 && L !== (L = `--orbit-alpha:${/*intensity*/
      T[2]}`) && a(e, "style", L);
    },
    i: X,
    o: X,
    d(T) {
      T && S(e), k = !1, me(j);
    }
  };
}
function oi(l, e, t) {
  let { title: s = "Focus Ring" } = e, { subtitle: i = "Anillo orbital" } = e, { intensity: c = 0.6 } = e, { flow: r = 78 } = e;
  const o = Ae(), f = () => {
    o("hover", { title: s });
  }, v = (p) => {
    (p.key === "Enter" || p.key === " ") && f();
  };
  return l.$$set = (p) => {
    "title" in p && t(0, s = p.title), "subtitle" in p && t(1, i = p.subtitle), "intensity" in p && t(2, c = p.intensity), "flow" in p && t(3, r = p.flow);
  }, [s, i, c, r, f, v];
}
class us extends pe {
  constructor(e) {
    super(), fe(
      this,
      e,
      oi,
      ai,
      le,
      {
        title: 0,
        subtitle: 1,
        intensity: 2,
        flow: 3
      },
      ri
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
de(us, { title: {}, subtitle: {}, intensity: {}, flow: {} }, [], [], !0);
function ci(l) {
  ce(l, "svelte-1vzxgvk", ".badge.svelte-1vzxgvk.svelte-1vzxgvk{display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border-radius:999px;border:1px solid transparent;font-size:12px;font-weight:600;letter-spacing:0.02em;cursor:pointer;background:#ecfdf5;color:#065f46}.badge.emerald.svelte-1vzxgvk.svelte-1vzxgvk{border-color:rgba(16, 185, 129, 0.35)}.dot.svelte-1vzxgvk.svelte-1vzxgvk{width:8px;height:8px;border-radius:999px;background:currentColor;box-shadow:0 0 0 rgba(16, 185, 129, 0.6)}.active.svelte-1vzxgvk .dot.svelte-1vzxgvk{animation:svelte-1vzxgvk-pulse 1.8s ease-in-out infinite}@keyframes svelte-1vzxgvk-pulse{0%{box-shadow:0 0 0 0 rgba(16, 185, 129, 0.6)}70%{box-shadow:0 0 0 12px rgba(16, 185, 129, 0)}100%{box-shadow:0 0 0 0 rgba(16, 185, 129, 0)}}");
}
function fi(l) {
  let e, t, s, i, c, r, o;
  return {
    c() {
      e = d("button"), t = d("span"), s = y(), i = z(
        /*label*/
        l[1]
      ), a(t, "class", "dot svelte-1vzxgvk"), a(e, "class", c = Ge(`badge ${/*tone*/
      l[2]} ${/*active*/
      l[0] ? "active" : ""}`) + " svelte-1vzxgvk"), a(e, "type", "button");
    },
    m(f, v) {
      E(f, e, v), n(e, t), n(e, s), n(e, i), r || (o = O(
        e,
        "click",
        /*toggle*/
        l[3]
      ), r = !0);
    },
    p(f, [v]) {
      v & /*label*/
      2 && M(
        i,
        /*label*/
        f[1]
      ), v & /*tone, active*/
      5 && c !== (c = Ge(`badge ${/*tone*/
      f[2]} ${/*active*/
      f[0] ? "active" : ""}`) + " svelte-1vzxgvk") && a(e, "class", c);
    },
    i: X,
    o: X,
    d(f) {
      f && S(e), r = !1, o();
    }
  };
}
function di(l, e, t) {
  let { label: s = "Live" } = e, { tone: i = "emerald" } = e, { active: c = !0 } = e;
  const r = Ae(), o = () => {
    t(0, c = !c), r("toggle", { active: c });
  };
  return l.$$set = (f) => {
    "label" in f && t(1, s = f.label), "tone" in f && t(2, i = f.tone), "active" in f && t(0, c = f.active);
  }, [c, s, i, o];
}
class vs extends pe {
  constructor(e) {
    super(), fe(this, e, di, fi, le, { label: 1, tone: 2, active: 0 }, ci);
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
de(vs, { label: {}, tone: {}, active: { type: "Boolean" } }, [], [], !0);
function pi(l) {
  ce(l, "svelte-1io8dtn", ".ripple.svelte-1io8dtn{position:relative;overflow:hidden;padding:12px 20px;border-radius:14px;border:none;background:var(--tone);color:#ffffff;font-weight:600;cursor:pointer;box-shadow:0 16px 28px rgba(16, 185, 129, 0.25)}.label.svelte-1io8dtn{position:relative;z-index:1}.wave.svelte-1io8dtn{position:absolute;width:20px;height:20px;border-radius:999px;background:rgba(255, 255, 255, 0.45);transform:translate(-50%, -50%);animation:svelte-1io8dtn-ripple 0.8s ease-out forwards}@keyframes svelte-1io8dtn-ripple{from{opacity:0.7;transform:translate(-50%, -50%) scale(0)}to{opacity:0;transform:translate(-50%, -50%) scale(8)}}");
}
function dl(l, e, t) {
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
      E(o, t, f), i || (c = O(t, "animationend", r), i = !0);
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
function ui(l) {
  let e, t = [], s = /* @__PURE__ */ new Map(), i, c, r, o, f, v, p = te(
    /*ripples*/
    l[2]
  );
  const u = (g) => (
    /*ripple*/
    g[7].id
  );
  for (let g = 0; g < p.length; g += 1) {
    let h = dl(l, p, g), m = u(h);
    s.set(m, t[g] = pl(m, h));
  }
  return {
    c() {
      e = d("button");
      for (let g = 0; g < t.length; g += 1)
        t[g].c();
      i = y(), c = d("span"), r = z(
        /*label*/
        l[0]
      ), a(c, "class", "label svelte-1io8dtn"), a(e, "class", "ripple svelte-1io8dtn"), a(e, "type", "button"), a(e, "style", o = `--tone:${/*tone*/
      l[1]}`);
    },
    m(g, h) {
      E(g, e, h);
      for (let m = 0; m < t.length; m += 1)
        t[m] && t[m].m(e, null);
      n(e, i), n(e, c), n(c, r), f || (v = O(
        e,
        "click",
        /*handleClick*/
        l[3]
      ), f = !0);
    },
    p(g, [h]) {
      h & /*ripples, removeRipple*/
      20 && (p = te(
        /*ripples*/
        g[2]
      ), t = Xt(t, h, u, 1, g, p, s, e, Dt, pl, i, dl)), h & /*label*/
      1 && M(
        r,
        /*label*/
        g[0]
      ), h & /*tone*/
      2 && o !== (o = `--tone:${/*tone*/
      g[1]}`) && a(e, "style", o);
    },
    i: X,
    o: X,
    d(g) {
      g && S(e);
      for (let h = 0; h < t.length; h += 1)
        t[h].d();
      f = !1, v();
    }
  };
}
function vi(l, e, t) {
  let { label: s = "Lanzar onda" } = e, { tone: i = "#10b981" } = e;
  const c = Ae();
  let r = [];
  const o = (p) => {
    const u = p.currentTarget.getBoundingClientRect(), g = p.clientX - u.left, h = p.clientY - u.top, m = Math.random().toString(36).slice(2);
    t(2, r = [...r, { id: m, x: g, y: h }]), c("ripple", { x: g, y: h });
  }, f = (p) => {
    t(2, r = r.filter((u) => u.id !== p));
  }, v = (p) => f(p.id);
  return l.$$set = (p) => {
    "label" in p && t(0, s = p.label), "tone" in p && t(1, i = p.tone);
  }, [s, i, r, o, f, v];
}
class gs extends pe {
  constructor(e) {
    super(), fe(this, e, vi, ui, le, { label: 0, tone: 1 }, pi);
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
de(gs, { label: {}, tone: {} }, [], [], !0);
function gi(l) {
  ce(l, "svelte-1jr61rp", ".list.svelte-1jr61rp{border-radius:18px;border:1px solid #e2e8f0;background:#ffffff;padding:16px;display:grid;gap:16px}.header.svelte-1jr61rp{display:flex;justify-content:space-between;align-items:center}.title.svelte-1jr61rp{margin:0;font-size:14px;font-weight:600;color:#0f172a}.subtitle.svelte-1jr61rp{margin:0;font-size:11px;color:#94a3b8}button.svelte-1jr61rp{border:1px solid #d1fae5;background:#ecfdf5;color:#065f46;font-size:12px;padding:6px 10px;border-radius:10px;cursor:pointer}.items.svelte-1jr61rp{display:grid;gap:10px}.item.svelte-1jr61rp{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-radius:12px;background:#f8fafc;color:#0f172a;font-size:13px;animation:svelte-1jr61rp-slide-in 0.5s ease forwards;opacity:0;transform:translateY(6px)}.score.svelte-1jr61rp{font-weight:600}@keyframes svelte-1jr61rp-slide-in{to{opacity:1;transform:translateY(0)}}");
}
function ul(l, e, t) {
  const s = l.slice();
  return s[7] = e[t], s[9] = t, s;
}
function vl(l, e) {
  let t, s, i = (
    /*item*/
    e[7].title + ""
  ), c, r, o, f = (
    /*item*/
    e[7].score + ""
  ), v, p, u, g;
  return {
    key: l,
    first: null,
    c() {
      t = d("div"), s = d("span"), c = z(i), r = y(), o = d("span"), v = z(f), p = z("%"), u = y(), a(o, "class", "score svelte-1jr61rp"), a(t, "class", "item svelte-1jr61rp"), a(t, "style", g = `animation-delay:${/*index*/
      e[9] * /*cadence*/
      e[1]}ms`), this.first = t;
    },
    m(h, m) {
      E(h, t, m), n(t, s), n(s, c), n(t, r), n(t, o), n(o, v), n(o, p), n(t, u);
    },
    p(h, m) {
      e = h, m & /*items*/
      4 && i !== (i = /*item*/
      e[7].title + "") && M(c, i), m & /*items*/
      4 && f !== (f = /*item*/
      e[7].score + "") && M(v, f), m & /*items, cadence*/
      6 && g !== (g = `animation-delay:${/*index*/
      e[9] * /*cadence*/
      e[1]}ms`) && a(t, "style", g);
    },
    d(h) {
      h && S(t);
    }
  };
}
function hi(l) {
  let e, t, s, i, c, r, o, f, v, p, u, g, h = [], m = /* @__PURE__ */ new Map(), b, _, q = te(
    /*items*/
    l[2]
  );
  const A = (w) => (
    /*item*/
    w[7].id
  );
  for (let w = 0; w < q.length; w += 1) {
    let x = ul(l, q, w), L = A(x);
    m.set(L, h[w] = vl(L, x));
  }
  return {
    c() {
      e = d("div"), t = d("div"), s = d("div"), i = d("p"), i.textContent = "Stagger list", c = y(), r = d("p"), o = z(
        /*count*/
        l[0]
      ), f = z(" items"), v = y(), p = d("button"), p.textContent = "Actualizar", u = y(), g = d("div");
      for (let w = 0; w < h.length; w += 1)
        h[w].c();
      a(i, "class", "title svelte-1jr61rp"), a(r, "class", "subtitle svelte-1jr61rp"), a(p, "type", "button"), a(p, "class", "svelte-1jr61rp"), a(t, "class", "header svelte-1jr61rp"), a(g, "class", "items svelte-1jr61rp"), a(e, "class", "list svelte-1jr61rp");
    },
    m(w, x) {
      E(w, e, x), n(e, t), n(t, s), n(s, i), n(s, c), n(s, r), n(r, o), n(r, f), n(t, v), n(t, p), n(e, u), n(e, g);
      for (let L = 0; L < h.length; L += 1)
        h[L] && h[L].m(g, null);
      b || (_ = O(
        p,
        "click",
        /*handleRefresh*/
        l[3]
      ), b = !0);
    },
    p(w, [x]) {
      x & /*count*/
      1 && M(
        o,
        /*count*/
        w[0]
      ), x & /*items, cadence*/
      6 && (q = te(
        /*items*/
        w[2]
      ), h = Xt(h, x, A, 1, w, q, m, g, Dt, vl, null, ul));
    },
    i: X,
    o: X,
    d(w) {
      w && S(e);
      for (let x = 0; x < h.length; x += 1)
        h[x].d();
      b = !1, _();
    }
  };
}
function bi(l, e, t) {
  let { label: s = "Batch" } = e, { count: i = 5 } = e, { cadence: c = 120 } = e;
  const r = Ae();
  let o = [];
  const f = () => {
    t(2, o = Array.from({ length: i }, (p, u) => ({
      id: `${s}-${u}`,
      title: `${s} ${u + 1}`,
      score: Math.floor(Math.random() * 40) + 60
    }))), r("refresh", { count: i });
  }, v = () => {
    f();
  };
  return Vs(f), l.$$set = (p) => {
    "label" in p && t(4, s = p.label), "count" in p && t(0, i = p.count), "cadence" in p && t(1, c = p.cadence);
  }, [i, c, o, v, s];
}
class hs extends pe {
  constructor(e) {
    super(), fe(this, e, bi, hi, le, { label: 4, count: 0, cadence: 1 }, gi);
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
de(hs, { label: {}, count: {}, cadence: {} }, [], [], !0);
function mi(l) {
  ce(l, "svelte-1g1qxhj", ".thermo.svelte-1g1qxhj.svelte-1g1qxhj{display:grid;gap:16px;border-radius:18px;border:1px solid #e2e8f0;padding:16px;background:#ffffff}.thermo.frameless.svelte-1g1qxhj.svelte-1g1qxhj{border:none;background:transparent;padding:0;gap:6px;grid-template-columns:1fr;align-items:center;text-align:center}.header.svelte-1g1qxhj.svelte-1g1qxhj{display:flex;justify-content:space-between;align-items:center;gap:12px}.thermo.frameless.svelte-1g1qxhj .header.svelte-1g1qxhj{flex-direction:column;align-items:center;justify-content:center;min-width:0;text-align:center}.title.svelte-1g1qxhj.svelte-1g1qxhj{margin:0;font-size:14px;font-weight:600;color:#0f172a}.subtitle.svelte-1g1qxhj.svelte-1g1qxhj{margin:0;font-size:12px;color:#64748b}.meter.svelte-1g1qxhj.svelte-1g1qxhj{position:relative;height:160px;display:grid;place-items:center}.thermo.frameless.svelte-1g1qxhj .meter.svelte-1g1qxhj{align-self:start;width:52px;justify-self:center}.thermo.frameless.svelte-1g1qxhj .meter.svelte-1g1qxhj{height:120px}.tube.svelte-1g1qxhj.svelte-1g1qxhj{position:relative;width:24px;height:140px;border-radius:14px;background:#f1f5f9;border:1px solid #e2e8f0;overflow:hidden;box-shadow:inset 0 6px 16px rgba(15, 23, 42, 0.08)}.thermo.frameless.svelte-1g1qxhj .tube.svelte-1g1qxhj{height:110px}.fill.svelte-1g1qxhj.svelte-1g1qxhj{position:absolute;left:0;right:0;bottom:0;height:var(--level);background:linear-gradient(180deg, #ffffff, var(--fill));transition:height 0.8s cubic-bezier(0.22, 1, 0.36, 1)}.gloss.svelte-1g1qxhj.svelte-1g1qxhj{position:absolute;left:3px;top:8px;width:6px;height:calc(100% - 16px);border-radius:999px;background:rgba(255, 255, 255, 0.6);animation:svelte-1g1qxhj-shimmer 2.4s ease-in-out infinite}.bulb.svelte-1g1qxhj.svelte-1g1qxhj{position:absolute;bottom:-6px;width:44px;height:44px;border-radius:999px;background:radial-gradient(circle at 30% 30%, #ffffff, var(--fill));border:2px solid rgba(226, 232, 240, 0.9);box-shadow:0 10px 24px var(--glow);animation:svelte-1g1qxhj-pulse 2.2s ease-in-out infinite}.thermo.frameless.svelte-1g1qxhj .bulb.svelte-1g1qxhj{width:36px;height:36px}@keyframes svelte-1g1qxhj-shimmer{0%,100%{opacity:0.35;transform:translateY(0)}50%{opacity:0.7;transform:translateY(-8px)}}@keyframes svelte-1g1qxhj-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}");
}
function _i(l) {
  let e, t, s, i, c, r, o, f, v, p, u, g;
  return {
    c() {
      e = d("div"), t = d("div"), s = d("div"), i = d("p"), c = z(
        /*label*/
        l[0]
      ), r = y(), o = d("p"), f = z(
        /*subtitleText*/
        l[3]
      ), v = y(), p = d("div"), p.innerHTML = '<div class="tube svelte-1g1qxhj"><div class="fill svelte-1g1qxhj"></div> <div class="gloss svelte-1g1qxhj"></div></div> <div class="bulb svelte-1g1qxhj"></div>', a(i, "class", "title svelte-1g1qxhj"), a(o, "class", "subtitle svelte-1g1qxhj"), a(t, "class", "header svelte-1g1qxhj"), a(p, "class", "meter svelte-1g1qxhj"), a(e, "class", u = Ge(`thermo ${/*frameless*/
      l[1] ? "frameless" : ""}`) + " svelte-1g1qxhj"), a(e, "style", g = `--level:${/*percent*/
      l[2]}%; --fill:${/*fillColor*/
      l[5]}; --glow:${/*glowColor*/
      l[4]};`);
    },
    m(h, m) {
      E(h, e, m), n(e, t), n(t, s), n(s, i), n(i, c), n(s, r), n(s, o), n(o, f), n(e, v), n(e, p);
    },
    p(h, [m]) {
      m & /*label*/
      1 && M(
        c,
        /*label*/
        h[0]
      ), m & /*subtitleText*/
      8 && M(
        f,
        /*subtitleText*/
        h[3]
      ), m & /*frameless*/
      2 && u !== (u = Ge(`thermo ${/*frameless*/
      h[1] ? "frameless" : ""}`) + " svelte-1g1qxhj") && a(e, "class", u), m & /*percent, fillColor, glowColor*/
      52 && g !== (g = `--level:${/*percent*/
      h[2]}%; --fill:${/*fillColor*/
      h[5]}; --glow:${/*glowColor*/
      h[4]};`) && a(e, "style", g);
    },
    i: X,
    o: X,
    d(h) {
      h && S(e);
    }
  };
}
function xi(l, e, t) {
  let s, i, c, r, o, f, v, p, u, { label: g = "Temperatura" } = e, { value: h = 22 } = e, { min: m = 0 } = e, { max: b = 40 } = e, { subtitle: _ = "" } = e, { frameless: q = !1 } = e;
  const A = (L, k, j) => Math.min(j, Math.max(k, L)), w = (L, k, j) => Math.round(L + (k - L) * j), x = (L, k, j) => `rgb(${L}, ${k}, ${j})`;
  return l.$$set = (L) => {
    "label" in L && t(0, g = L.label), "value" in L && t(6, h = L.value), "min" in L && t(7, m = L.min), "max" in L && t(8, b = L.max), "subtitle" in L && t(9, _ = L.subtitle), "frameless" in L && t(1, q = L.frameless);
  }, l.$$.update = () => {
    l.$$.dirty & /*value, min, max*/
    448 && t(10, s = A(h, m, b)), l.$$.dirty & /*safeValue, min, max*/
    1408 && t(12, i = (s - m) / (b - m || 1)), l.$$.dirty & /*ratio*/
    4096 && t(2, c = Math.round(i * 100)), l.$$.dirty & /*cool, warm, ratio*/
    28672 && t(11, f = {
      r: w(o.r, r.r, i),
      g: w(o.g, r.g, i),
      b: w(o.b, r.b, i)
    }), l.$$.dirty & /*mix*/
    2048 && t(5, v = x(f.r, f.g, f.b)), l.$$.dirty & /*mix*/
    2048 && t(4, p = `rgba(${f.r}, ${f.g}, ${f.b}, 0.45)`), l.$$.dirty & /*subtitle, safeValue, percent*/
    1540 && t(3, u = _ || `${s}C - ${c}%`);
  }, t(13, r = { r: 239, g: 68, b: 68 }), t(14, o = { r: 34, g: 197, b: 94 }), [
    g,
    q,
    c,
    u,
    p,
    v,
    h,
    m,
    b,
    _,
    s,
    f,
    i,
    r,
    o
  ];
}
class bs extends pe {
  constructor(e) {
    super(), fe(
      this,
      e,
      xi,
      _i,
      le,
      {
        label: 0,
        value: 6,
        min: 7,
        max: 8,
        subtitle: 9,
        frameless: 1
      },
      mi
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
de(bs, { label: {}, value: {}, min: {}, max: {}, subtitle: {}, frameless: { type: "Boolean" } }, [], [], !0);
function yi(l) {
  ce(l, "svelte-q2ay9k", `.podium.svelte-q2ay9k.svelte-q2ay9k{position:relative;border-radius:18px;border:1px solid #e2e8f0;background:linear-gradient(180deg, #ffffff, #f8fafc);padding:24px 18px 16px;height:220px;display:grid;align-items:end}.line.svelte-q2ay9k.svelte-q2ay9k{position:absolute;left:16px;right:16px;bottom:24px;height:2px;background:linear-gradient(90deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.6))}.controls.svelte-q2ay9k.svelte-q2ay9k{position:absolute;top:14px;right:14px;display:flex;gap:8px}.reset.svelte-q2ay9k.svelte-q2ay9k,.swap.svelte-q2ay9k.svelte-q2ay9k{border:1px solid rgba(16, 185, 129, 0.3);background:#ecfdf5;color:#065f46;font-size:11px;padding:6px 10px;border-radius:999px;cursor:pointer}.reset.svelte-q2ay9k.svelte-q2ay9k:hover,.swap.svelte-q2ay9k.svelte-q2ay9k:hover{background:#d1fae5}.stack.svelte-q2ay9k.svelte-q2ay9k{position:relative;display:grid;grid-template-columns:repeat(3, 1fr);align-items:end;gap:14px;height:100%;z-index:1}.bar.svelte-q2ay9k.svelte-q2ay9k{position:relative;border-radius:14px 14px 6px 6px;background:#d1fae5;color:#065f46;display:grid;place-items:center;font-size:14px;font-weight:600;transform-origin:bottom;animation:svelte-q2ay9k-rise var(--dur) cubic-bezier(0.22, 1, 0.36, 1) forwards;transform:scaleY(0)}.bar.svelte-q2ay9k span.svelte-q2ay9k{opacity:0;animation:svelte-q2ay9k-fade-in 0.5s ease forwards;animation-delay:calc(var(--dur) * 0.7)}.bar.svelte-q2ay9k.svelte-q2ay9k::after{content:"";position:absolute;inset:8px;border-radius:10px;background:linear-gradient(120deg, rgba(255, 255, 255, 0.4), transparent 60%);opacity:0;animation:svelte-q2ay9k-sweep 1.6s ease forwards;animation-delay:calc(var(--dur) * 0.4)}.bar.first.svelte-q2ay9k.svelte-q2ay9k{background:linear-gradient(180deg, #10b981, #34d399);color:#ffffff;box-shadow:0 14px 24px rgba(16, 185, 129, 0.35)}.bar.second.svelte-q2ay9k.svelte-q2ay9k{background:linear-gradient(180deg, #34d399, #6ee7b7)}.bar.third.svelte-q2ay9k.svelte-q2ay9k{background:linear-gradient(180deg, #bbf7d0, #ecfdf5)}.podium[data-play].svelte-q2ay9k .bar.svelte-q2ay9k{animation:svelte-q2ay9k-rise var(--dur) cubic-bezier(0.22, 1, 0.36, 1) forwards,
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
      t = d("div"), s = d("span"), c = z(i), r = y(), a(s, "class", "svelte-q2ay9k"), a(t, "class", o = Ge(`bar ${/*item*/
      e[12].className}`) + " svelte-q2ay9k"), a(t, "style", f = `height:${/*item*/
      e[12].height}%; --dur:${/*item*/
      e[12].duration}s;`), this.first = t;
    },
    m(v, p) {
      E(v, t, p), n(t, s), n(s, c), n(t, r);
    },
    p(v, p) {
      e = v, p & /*items*/
      2 && i !== (i = /*item*/
      e[12].label + "") && M(c, i), p & /*items*/
      2 && o !== (o = Ge(`bar ${/*item*/
      e[12].className}`) + " svelte-q2ay9k") && a(t, "class", o), p & /*items*/
      2 && f !== (f = `height:${/*item*/
      e[12].height}%; --dur:${/*item*/
      e[12].duration}s;`) && a(t, "style", f);
    },
    d(v) {
      v && S(t);
    }
  };
}
function bl(l) {
  let e, t = [], s = /* @__PURE__ */ new Map(), i = te(
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
      E(r, e, o);
      for (let f = 0; f < t.length; f += 1)
        t[f] && t[f].m(e, null);
    },
    p(r, o) {
      o & /*items*/
      2 && (i = te(
        /*items*/
        r[1]
      ), t = Xt(t, o, c, 1, r, i, s, e, Dt, hl, null, gl));
    },
    d(r) {
      r && S(e);
      for (let o = 0; o < t.length; o += 1)
        t[o].d();
    }
  };
}
function wi(l) {
  let e, t, s, i, c, r, o, f, v = (
    /*playId*/
    l[0]
  ), p, u, g = bl(l);
  return {
    c() {
      e = d("div"), t = d("div"), s = y(), i = d("div"), c = d("button"), c.textContent = "Reiniciar", r = y(), o = d("button"), o.textContent = "Intercalar", f = y(), g.c(), a(t, "class", "line svelte-q2ay9k"), a(c, "class", "reset svelte-q2ay9k"), a(c, "type", "button"), a(o, "class", "swap svelte-q2ay9k"), a(o, "type", "button"), a(i, "class", "controls svelte-q2ay9k"), a(e, "class", "podium svelte-q2ay9k"), a(
        e,
        "data-play",
        /*playId*/
        l[0]
      );
    },
    m(h, m) {
      E(h, e, m), n(e, t), n(e, s), n(e, i), n(i, c), n(i, r), n(i, o), n(e, f), g.m(e, null), p || (u = [
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
      ], p = !0);
    },
    p(h, [m]) {
      m & /*playId*/
      1 && le(v, v = /*playId*/
      h[0]) ? (g.d(1), g = bl(h), g.c(), g.m(e, null)) : g.p(h, m), m & /*playId*/
      1 && a(
        e,
        "data-play",
        /*playId*/
        h[0]
      );
    },
    i: X,
    o: X,
    d(h) {
      h && S(e), g.d(h), p = !1, me(u);
    }
  };
}
function ki(l, e, t) {
  let s, { first: i = 82 } = e, { second: c = 64 } = e, { third: r = 48 } = e, { baseDuration: o = 0.9 } = e, { delayStep: f = 0.15 } = e, v = 0, p = ["second", "first", "third"];
  const u = {
    first: { label: "1", className: "first" },
    second: { label: "2", className: "second" },
    third: { label: "3", className: "third" }
  }, g = (b) => b === "first" ? i : b === "second" ? c : r, h = () => {
    t(0, v += 1);
  }, m = () => {
    t(9, p = [p[1], p[2], p[0]]), t(0, v += 1);
  };
  return l.$$set = (b) => {
    "first" in b && t(4, i = b.first), "second" in b && t(5, c = b.second), "third" in b && t(6, r = b.third), "baseDuration" in b && t(7, o = b.baseDuration), "delayStep" in b && t(8, f = b.delayStep);
  }, l.$$.update = () => {
    l.$$.dirty & /*order, baseDuration, delayStep*/
    896 && t(1, s = p.map((b, _) => ({
      key: b,
      label: u[b].label,
      className: u[b].className,
      height: g(b),
      duration: o + _ * f * 2
    })));
  }, [
    v,
    s,
    h,
    m,
    i,
    c,
    r,
    o,
    f,
    p
  ];
}
class ms extends pe {
  constructor(e) {
    super(), fe(
      this,
      e,
      ki,
      wi,
      le,
      {
        first: 4,
        second: 5,
        third: 6,
        baseDuration: 7,
        delayStep: 8
      },
      yi
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
de(ms, { first: {}, second: {}, third: {}, baseDuration: {}, delayStep: {} }, [], [], !0);
function zi(l) {
  ce(l, "svelte-1jqbzw8", ".balloon-card.svelte-1jqbzw8{border-radius:18px;border:1px solid #e2e8f0;background:linear-gradient(180deg, #ffffff, #f8fafc);padding:16px;height:220px;display:grid;place-items:center}.scene.svelte-1jqbzw8{position:relative;width:160px;height:180px}.rope.svelte-1jqbzw8{position:absolute;left:50%;bottom:14px;width:2px;height:90px;background:var(--rope);transform-origin:bottom;transform:translateX(-50%);animation:svelte-1jqbzw8-rope-sway var(--speed) ease-in-out infinite}.anchor.svelte-1jqbzw8{position:absolute;left:50%;bottom:0;width:18px;height:18px;border-radius:999px;background:#e2e8f0;border:2px solid #cbd5f5;transform:translateX(-50%)}.balloon.svelte-1jqbzw8{position:absolute;left:50%;bottom:96px;width:64px;height:74px;border-radius:50% 50% 46% 46%;background:radial-gradient(circle at 35% 30%, #ffffff, var(--balloon));box-shadow:0 16px 26px rgba(16, 185, 129, 0.2);transform-origin:bottom center;transform:translateX(-50%);animation:svelte-1jqbzw8-float var(--speed) ease-in-out infinite}.string.svelte-1jqbzw8{position:absolute;left:50%;bottom:-26px;width:2px;height:26px;background:var(--rope);transform:translateX(-50%)}@keyframes svelte-1jqbzw8-float{0%,100%{transform:translateX(-50%) translateY(0) rotate(0deg)}50%{transform:translateX(-50%) translateY(calc(var(--lift) * -1)) rotate(var(--sway))}}@keyframes svelte-1jqbzw8-rope-sway{0%,100%{transform:translateX(-50%) rotate(0deg)}50%{transform:translateX(-50%) rotate(calc(var(--sway) * -0.4))}}");
}
function qi(l) {
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
      E(i, e, c), n(e, t);
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
    i: X,
    o: X,
    d(i) {
      i && S(e);
    }
  };
}
function ji(l, e, t) {
  let { lift: s = 18 } = e, { sway: i = 6 } = e, { speed: c = 5.5 } = e, { color: r = "#10b981" } = e, { rope: o = "#94a3b8" } = e;
  return l.$$set = (f) => {
    "lift" in f && t(0, s = f.lift), "sway" in f && t(1, i = f.sway), "speed" in f && t(2, c = f.speed), "color" in f && t(3, r = f.color), "rope" in f && t(4, o = f.rope);
  }, [s, i, c, r, o];
}
class _s extends pe {
  constructor(e) {
    super(), fe(
      this,
      e,
      ji,
      qi,
      le,
      {
        lift: 0,
        sway: 1,
        speed: 2,
        color: 3,
        rope: 4
      },
      zi
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
de(_s, { lift: {}, sway: {}, speed: {}, color: {}, rope: {} }, [], [], !0);
function Ci(l) {
  ce(l, "svelte-9cnfqg", '.wrapper.svelte-9cnfqg.svelte-9cnfqg{display:grid;grid-template-columns:28px 1fr 28px;align-items:stretch;gap:12px}.nav.svelte-9cnfqg.svelte-9cnfqg{border:1px solid #e2e8f0;background:#f8fafc;border-radius:14px;display:grid;place-items:center;height:100%;cursor:pointer;transition:transform 0.2s ease, background 0.2s ease;position:relative;overflow:hidden}.nav.svelte-9cnfqg.svelte-9cnfqg:hover{background:#e2e8f0;transform:translateY(-2px)}.nav.svelte-9cnfqg.svelte-9cnfqg::after{content:"";position:absolute;inset:0;background:linear-gradient(120deg, transparent, rgba(16, 185, 129, 0.25), transparent);transform:translateX(-120%);transition:transform 0.45s ease}.nav.svelte-9cnfqg.svelte-9cnfqg:hover::after{transform:translateX(120%)}.chevron.svelte-9cnfqg.svelte-9cnfqg{width:10px;height:28px;border-right:2px solid #475569;border-bottom:2px solid #475569;transform:rotate(-45deg)}.nav.left.svelte-9cnfqg .chevron.svelte-9cnfqg{transform:rotate(135deg)}.card.svelte-9cnfqg.svelte-9cnfqg{display:grid;grid-template-columns:72px 1fr;gap:16px;padding:18px 20px;border-radius:20px;border:1px solid #e2e8f0;background:#ffffff;box-shadow:0 14px 26px rgba(15, 23, 42, 0.08);transition:transform 0.35s ease, box-shadow 0.35s ease}.card.svelte-9cnfqg.svelte-9cnfqg:hover{transform:translateY(-4px);box-shadow:0 18px 34px rgba(15, 23, 42, 0.16)}.icon.svelte-9cnfqg.svelte-9cnfqg{width:56px;height:56px;border-radius:16px;background:#f8fafc;display:grid;place-items:center}.ladder.svelte-9cnfqg.svelte-9cnfqg{width:28px;height:36px;border:3px solid #7c5c4f;border-left-width:5px;border-right-width:5px;border-radius:6px;position:relative}.ladder.svelte-9cnfqg span.svelte-9cnfqg{position:absolute;left:2px;right:2px;height:4px;background:#7c5c4f;border-radius:999px;animation:svelte-9cnfqg-rung 2.8s ease-in-out infinite}.ladder.svelte-9cnfqg span.svelte-9cnfqg:nth-child(1){top:6px;animation-delay:0s}.ladder.svelte-9cnfqg span.svelte-9cnfqg:nth-child(2){top:14px;animation-delay:0.2s}.ladder.svelte-9cnfqg span.svelte-9cnfqg:nth-child(3){top:22px;animation-delay:0.4s}.ladder.svelte-9cnfqg span.svelte-9cnfqg:nth-child(4){top:30px;animation-delay:0.6s}.content.svelte-9cnfqg.svelte-9cnfqg{display:grid;gap:8px}.panel.svelte-9cnfqg.svelte-9cnfqg{animation:svelte-9cnfqg-slide-in 0.4s ease}.row.svelte-9cnfqg.svelte-9cnfqg{display:flex;align-items:center;justify-content:space-between;gap:12px}.title.svelte-9cnfqg.svelte-9cnfqg{display:flex;align-items:baseline;gap:12px}.title.svelte-9cnfqg strong.svelte-9cnfqg{font-size:18px;color:#0f172a}.title.svelte-9cnfqg span.svelte-9cnfqg{font-size:14px;color:#64748b}.level-text.svelte-9cnfqg.svelte-9cnfqg{font-size:14px;color:#64748b;animation:svelte-9cnfqg-level-pop 0.35s ease}.pill.svelte-9cnfqg.svelte-9cnfqg{padding:6px 14px;background:#eef2ff;color:#1e3a8a;border-radius:999px;font-size:12px;font-weight:600}.desc.svelte-9cnfqg.svelte-9cnfqg{margin:0;font-size:14px;color:#0f172a}.meta.svelte-9cnfqg.svelte-9cnfqg{font-size:13px;color:#475569}.xp.svelte-9cnfqg.svelte-9cnfqg{font-weight:600;color:#047857}.progress.svelte-9cnfqg.svelte-9cnfqg{position:relative;height:12px;border-radius:999px;background:#f1f5f9;overflow:hidden}.bar.svelte-9cnfqg.svelte-9cnfqg{height:100%;width:var(--fill);background:linear-gradient(90deg, #10b981, #34d399);transition:width 0.8s cubic-bezier(0.22, 1, 0.36, 1)}.glow.svelte-9cnfqg.svelte-9cnfqg{position:absolute;inset:0;background:linear-gradient(90deg, rgba(16, 185, 129, 0), rgba(16, 185, 129, 0.35), rgba(16, 185, 129, 0));transform:translateX(-100%);animation:svelte-9cnfqg-sweep 3.2s ease-in-out infinite}@keyframes svelte-9cnfqg-sweep{0%,60%{transform:translateX(-100%)}100%{transform:translateX(100%)}}@keyframes svelte-9cnfqg-level-pop{0%{opacity:0;transform:translateY(4px)}100%{opacity:1;transform:translateY(0)}}@keyframes svelte-9cnfqg-rung{0%,100%{opacity:0.6}50%{opacity:1}}@keyframes svelte-9cnfqg-slide-in{from{opacity:0;transform:translateX(calc(var(--dir) * 12px))}to{opacity:1;transform:translateX(0)}}');
}
function ml(l) {
  let e, t, s, i, c, r, o, f, v, p, u, g, h, m, b, _, q, A, w, x, L, k, j, T, P, N, H, I, F, R, G, $, ve, ie, ne;
  return {
    c() {
      e = d("div"), t = d("div"), s = d("div"), i = d("strong"), c = z(
        /*title*/
        l[0]
      ), r = y(), o = d("span"), f = z("Nivel "), v = z(
        /*activeLevel*/
        l[4]
      ), p = z("/"), u = z(
        /*safeLevelTotal*/
        l[5]
      ), g = y(), h = d("div"), m = z(
        /*status*/
        l[3]
      ), b = y(), _ = d("p"), q = z(
        /*description*/
        l[1]
      ), A = y(), w = d("div"), x = d("span"), L = z("Progreso: "), k = z(
        /*safeProgress*/
        l[7]
      ), j = z(" / "), T = z(
        /*safeTotal*/
        l[6]
      ), P = y(), N = d("span"), H = z("+"), I = z(
        /*xp*/
        l[2]
      ), F = z(" XP"), R = y(), G = d("div"), $ = d("div"), ie = y(), ne = d("div"), a(i, "class", "svelte-9cnfqg"), a(o, "class", "level-text svelte-9cnfqg"), a(s, "class", "title svelte-9cnfqg"), a(h, "class", "pill svelte-9cnfqg"), a(t, "class", "row svelte-9cnfqg"), a(_, "class", "desc svelte-9cnfqg"), a(N, "class", "xp svelte-9cnfqg"), a(w, "class", "row meta svelte-9cnfqg"), a($, "class", "bar svelte-9cnfqg"), a($, "style", ve = `--fill:${/*percent*/
      l[9]}%`), a(ne, "class", "glow svelte-9cnfqg"), a(G, "class", "progress svelte-9cnfqg"), a(e, "class", "panel svelte-9cnfqg");
    },
    m(J, U) {
      E(J, e, U), n(e, t), n(t, s), n(s, i), n(i, c), n(s, r), n(s, o), n(o, f), n(o, v), n(o, p), n(o, u), n(t, g), n(t, h), n(h, m), n(e, b), n(e, _), n(_, q), n(e, A), n(e, w), n(w, x), n(x, L), n(x, k), n(x, j), n(x, T), n(w, P), n(w, N), n(N, H), n(N, I), n(N, F), n(e, R), n(e, G), n(G, $), n(G, ie), n(G, ne);
    },
    p(J, U) {
      U & /*title*/
      1 && M(
        c,
        /*title*/
        J[0]
      ), U & /*activeLevel*/
      16 && M(
        v,
        /*activeLevel*/
        J[4]
      ), U & /*safeLevelTotal*/
      32 && M(
        u,
        /*safeLevelTotal*/
        J[5]
      ), U & /*status*/
      8 && M(
        m,
        /*status*/
        J[3]
      ), U & /*description*/
      2 && M(
        q,
        /*description*/
        J[1]
      ), U & /*safeProgress*/
      128 && M(
        k,
        /*safeProgress*/
        J[7]
      ), U & /*safeTotal*/
      64 && M(
        T,
        /*safeTotal*/
        J[6]
      ), U & /*xp*/
      4 && M(
        I,
        /*xp*/
        J[2]
      ), U & /*percent*/
      512 && ve !== (ve = `--fill:${/*percent*/
      J[9]}%`) && a($, "style", ve);
    },
    d(J) {
      J && S(e);
    }
  };
}
function Si(l) {
  let e, t, s, i, c, r, o, f = (
    /*activeLevel*/
    l[4]
  ), v, p, u, g, h, m = ml(l);
  return {
    c() {
      e = d("div"), t = d("button"), t.innerHTML = '<span class="chevron svelte-9cnfqg"></span>', s = y(), i = d("div"), c = d("div"), c.innerHTML = '<div class="ladder svelte-9cnfqg"><span class="svelte-9cnfqg"></span> <span class="svelte-9cnfqg"></span> <span class="svelte-9cnfqg"></span> <span class="svelte-9cnfqg"></span></div>', r = y(), o = d("div"), m.c(), p = y(), u = d("button"), u.innerHTML = '<span class="chevron svelte-9cnfqg"></span>', a(t, "class", "nav left svelte-9cnfqg"), a(t, "type", "button"), a(t, "aria-label", "Nivel anterior"), a(c, "class", "icon svelte-9cnfqg"), a(o, "class", "content svelte-9cnfqg"), a(o, "style", v = `--dir:${/*slideDir*/
      l[8]}`), a(i, "class", "card svelte-9cnfqg"), a(u, "class", "nav right svelte-9cnfqg"), a(u, "type", "button"), a(u, "aria-label", "Nivel siguiente"), a(e, "class", "wrapper svelte-9cnfqg");
    },
    m(b, _) {
      E(b, e, _), n(e, t), n(e, s), n(e, i), n(i, c), n(i, r), n(i, o), m.m(o, null), n(e, p), n(e, u), g || (h = [
        O(
          t,
          "click",
          /*click_handler*/
          l[17]
        ),
        O(
          u,
          "click",
          /*click_handler_1*/
          l[18]
        )
      ], g = !0);
    },
    p(b, [_]) {
      _ & /*activeLevel*/
      16 && le(f, f = /*activeLevel*/
      b[4]) ? (m.d(1), m = ml(b), m.c(), m.m(o, null)) : m.p(b, _), _ & /*slideDir*/
      256 && v !== (v = `--dir:${/*slideDir*/
      b[8]}`) && a(o, "style", v);
    },
    i: X,
    o: X,
    d(b) {
      b && S(e), m.d(b), g = !1, me(h);
    }
  };
}
function Li(l, e, t) {
  let s, i, c, r, o, { title: f = "Nivel 5" } = e, { subtitle: v = "Nivel 1/3" } = e, { description: p = "Alcanza nivel 5 de usuario." } = e, { progress: u = 4 } = e, { total: g = 5 } = e, { xp: h = 15 } = e, { status: m = "En progreso" } = e, { levelIndex: b = 1 } = e, { levelTotal: _ = 3 } = e;
  const q = (j, T, P) => Math.min(P, Math.max(T, j));
  let A = q(b, 1, o), w = 1;
  const x = (j) => {
    t(8, w = j >= 0 ? 1 : -1), t(4, A = q(A + j, 1, o));
  }, L = () => x(-1), k = () => x(1);
  return l.$$set = (j) => {
    "title" in j && t(0, f = j.title), "subtitle" in j && t(11, v = j.subtitle), "description" in j && t(1, p = j.description), "progress" in j && t(12, u = j.progress), "total" in j && t(13, g = j.total), "xp" in j && t(2, h = j.xp), "status" in j && t(3, m = j.status), "levelIndex" in j && t(14, b = j.levelIndex), "levelTotal" in j && t(15, _ = j.levelTotal);
  }, l.$$.update = () => {
    l.$$.dirty & /*total*/
    8192 && t(6, s = Math.max(1, g)), l.$$.dirty & /*progress, safeTotal*/
    4160 && t(7, i = q(u, 0, s)), l.$$.dirty & /*safeProgress, safeTotal*/
    192 && t(16, c = i / s), l.$$.dirty & /*ratio*/
    65536 && t(9, r = Math.round(c * 100)), l.$$.dirty & /*levelTotal*/
    32768 && t(5, o = Math.max(1, _)), l.$$.dirty & /*levelIndex, activeLevel, safeLevelTotal*/
    16432 && b !== A && t(4, A = q(b, 1, o));
  }, [
    f,
    p,
    h,
    m,
    A,
    o,
    s,
    i,
    w,
    r,
    x,
    v,
    u,
    g,
    b,
    _,
    c,
    L,
    k
  ];
}
class xs extends pe {
  constructor(e) {
    super(), fe(
      this,
      e,
      Li,
      Si,
      le,
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
      Ci
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
de(xs, { title: {}, subtitle: {}, description: {}, progress: {}, total: {}, xp: {}, status: {}, levelIndex: {}, levelTotal: {} }, [], [], !0);
function Ti(l) {
  ce(l, "svelte-12k2sv8", ".card.svelte-12k2sv8{position:relative;border-radius:18px;border:1px solid #e2e8f0;background:linear-gradient(160deg, #ffffff, #ecfdf5);padding:18px;overflow:hidden;transform:perspective(800px) rotateX(var(--rx)) rotateY(var(--ry));transition:transform 0.2s ease;box-shadow:0 18px 32px rgba(15, 23, 42, 0.12)}.shine.svelte-12k2sv8{position:absolute;inset:0;background:radial-gradient(circle at var(--shine) 20%, rgba(16, 185, 129, 0.22), transparent 55%);pointer-events:none}.content.svelte-12k2sv8{position:relative;display:grid;gap:6px}.title.svelte-12k2sv8{margin:0;font-size:12px;color:#64748b;letter-spacing:0.08em;text-transform:uppercase}.value.svelte-12k2sv8{margin:0;font-size:28px;font-weight:700;color:#0f172a}.hint.svelte-12k2sv8{margin:0;font-size:12px;color:#475569}");
}
function Ei(l) {
  let e, t, s, i, c, r, o, f, v, p, u, g, h, m, b;
  return {
    c() {
      e = d("div"), t = d("div"), s = y(), i = d("div"), c = d("p"), r = z(
        /*title*/
        l[0]
      ), o = y(), f = d("p"), v = z(
        /*value*/
        l[1]
      ), p = y(), u = d("p"), g = z(
        /*hint*/
        l[2]
      ), a(t, "class", "shine svelte-12k2sv8"), a(c, "class", "title svelte-12k2sv8"), a(f, "class", "value svelte-12k2sv8"), a(u, "class", "hint svelte-12k2sv8"), a(i, "class", "content svelte-12k2sv8"), a(e, "class", "card svelte-12k2sv8"), a(e, "style", h = `--rx:${/*rx*/
      l[3]}deg; --ry:${/*ry*/
      l[4]}deg; --shine:${/*shine*/
      l[5]}%`);
    },
    m(_, q) {
      E(_, e, q), n(e, t), n(e, s), n(e, i), n(i, c), n(c, r), n(i, o), n(i, f), n(f, v), n(i, p), n(i, u), n(u, g), m || (b = [
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
      ], m = !0);
    },
    p(_, [q]) {
      q & /*title*/
      1 && M(
        r,
        /*title*/
        _[0]
      ), q & /*value*/
      2 && M(
        v,
        /*value*/
        _[1]
      ), q & /*hint*/
      4 && M(
        g,
        /*hint*/
        _[2]
      ), q & /*rx, ry, shine*/
      56 && h !== (h = `--rx:${/*rx*/
      _[3]}deg; --ry:${/*ry*/
      _[4]}deg; --shine:${/*shine*/
      _[5]}%`) && a(e, "style", h);
    },
    i: X,
    o: X,
    d(_) {
      _ && S(e), m = !1, me(b);
    }
  };
}
function Mi(l, e, t) {
  let { title: s = "Pulso Focus" } = e, { value: i = "78%" } = e, { hint: c = "Calma sostenida" } = e, { intensity: r = 10 } = e, o = 0, f = 0, v = 0;
  const p = (g) => {
    const h = g.currentTarget.getBoundingClientRect(), m = (g.clientX - h.left) / h.width - 0.5, b = (g.clientY - h.top) / h.height - 0.5;
    t(3, o = b * r * -1), t(4, f = m * r), t(5, v = (m + b + 1) * 25);
  }, u = () => {
    t(3, o = 0), t(4, f = 0), t(5, v = 0);
  };
  return l.$$set = (g) => {
    "title" in g && t(0, s = g.title), "value" in g && t(1, i = g.value), "hint" in g && t(2, c = g.hint), "intensity" in g && t(8, r = g.intensity);
  }, [s, i, c, o, f, v, p, u, r];
}
class ys extends pe {
  constructor(e) {
    super(), fe(
      this,
      e,
      Mi,
      Ei,
      le,
      {
        title: 0,
        value: 1,
        hint: 2,
        intensity: 8
      },
      Ti
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
de(ys, { title: {}, value: {}, hint: {}, intensity: {} }, [], [], !0);
function Ai(l) {
  ce(l, "svelte-1czrcz8", '.counter.svelte-1czrcz8{border-radius:16px;border:1px solid #e2e8f0;padding:16px;background:#ffffff;display:grid;gap:10px;box-shadow:0 12px 22px rgba(15, 23, 42, 0.08)}.label.svelte-1czrcz8{margin:0;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.08em}.value.svelte-1czrcz8{font-size:32px;font-weight:700;color:#0f172a;position:relative;animation:svelte-1czrcz8-flip 0.5s ease}.value.svelte-1czrcz8::after{content:"";position:absolute;left:0;right:0;bottom:-4px;height:3px;border-radius:999px;background:var(--tone);animation:svelte-1czrcz8-sweep 0.6s ease}@keyframes svelte-1czrcz8-flip{0%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:translateY(0)}}@keyframes svelte-1czrcz8-sweep{from{transform:scaleX(0.2)}to{transform:scaleX(1)}}');
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
      s && S(e);
    }
  };
}
function Ni(l) {
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
    m(f, v) {
      E(f, e, v), n(e, t), n(t, s), n(e, i), o.m(e, null);
    },
    p(f, [v]) {
      v & /*label*/
      1 && M(
        s,
        /*label*/
        f[0]
      ), v & /*value*/
      2 && le(c, c = /*value*/
      f[1]) ? (o.d(1), o = _l(f), o.c(), o.m(e, null)) : o.p(f, v), v & /*tone*/
      4 && r !== (r = `--tone:${/*tone*/
      f[2]}`) && a(e, "style", r);
    },
    i: X,
    o: X,
    d(f) {
      f && S(e), o.d(f);
    }
  };
}
function Pi(l, e, t) {
  let { label: s = "Sesiones" } = e, { value: i = 12 } = e, { tone: c = "#10b981" } = e;
  return l.$$set = (r) => {
    "label" in r && t(0, s = r.label), "value" in r && t(1, i = r.value), "tone" in r && t(2, c = r.tone);
  }, [s, i, c];
}
class ws extends pe {
  constructor(e) {
    super(), fe(this, e, Pi, Ni, le, { label: 0, value: 1, tone: 2 }, Ai);
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
de(ws, { label: {}, value: {}, tone: {} }, [], [], !0);
function Ri(l) {
  ce(l, "svelte-pocpcm", ".stack.svelte-pocpcm{position:relative;height:160px;border-radius:18px;border:1px solid #e2e8f0;background:linear-gradient(140deg, #ffffff, #ecfdf5);overflow:hidden;transform:perspective(900px) rotateX(var(--rx)) rotateY(var(--ry));transition:transform 0.2s ease}.bg.svelte-pocpcm{position:absolute;inset:0;background:radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.15), transparent 60%)}.layer.svelte-pocpcm{position:absolute;border-radius:999px;filter:blur(calc(var(--blur) * 10px));opacity:0.75}.layer-a.svelte-pocpcm{width:120px;height:120px;background:rgba(16, 185, 129, 0.45);transform:translate(calc(var(--px) * 0.6), calc(var(--py) * 0.6));top:20px;left:14px}.layer-b.svelte-pocpcm{width:90px;height:90px;background:rgba(52, 211, 153, 0.5);transform:translate(calc(var(--px) * 1.2), calc(var(--py) * 1.2));bottom:18px;right:20px}.layer-c.svelte-pocpcm{width:70px;height:70px;background:rgba(14, 116, 144, 0.3);transform:translate(calc(var(--px) * 1.6), calc(var(--py) * 1.6));top:30px;right:70px}.label.svelte-pocpcm{position:absolute;left:16px;bottom:14px;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#0f172a;background:rgba(255, 255, 255, 0.7);padding:4px 8px;border-radius:999px}");
}
function Ii(l) {
  let e, t, s, i, c, r, o, f, v, p, u, g, h, m;
  return {
    c() {
      e = d("div"), t = d("div"), s = y(), i = d("div"), c = y(), r = d("div"), o = y(), f = d("div"), v = y(), p = d("div"), u = z(
        /*title*/
        l[0]
      ), a(t, "class", "bg svelte-pocpcm"), a(i, "class", "layer layer-a svelte-pocpcm"), a(r, "class", "layer layer-b svelte-pocpcm"), a(f, "class", "layer layer-c svelte-pocpcm"), a(p, "class", "label svelte-pocpcm"), a(e, "class", "stack svelte-pocpcm"), a(e, "style", g = `--rx:${/*rx*/
      l[2]}deg; --ry:${/*ry*/
      l[3]}deg; --px:${/*px*/
      l[4]}px; --py:${/*py*/
      l[5]}px; --blur:${/*blurAmount*/
      l[1]}`);
    },
    m(b, _) {
      E(b, e, _), n(e, t), n(e, s), n(e, i), n(e, c), n(e, r), n(e, o), n(e, f), n(e, v), n(e, p), n(p, u), h || (m = [
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
    p(b, [_]) {
      _ & /*title*/
      1 && M(
        u,
        /*title*/
        b[0]
      ), _ & /*rx, ry, px, py, blurAmount*/
      62 && g !== (g = `--rx:${/*rx*/
      b[2]}deg; --ry:${/*ry*/
      b[3]}deg; --px:${/*px*/
      b[4]}px; --py:${/*py*/
      b[5]}px; --blur:${/*blurAmount*/
      b[1]}`) && a(e, "style", g);
    },
    i: X,
    o: X,
    d(b) {
      b && S(e), h = !1, me(m);
    }
  };
}
function Di(l, e, t) {
  let { title: s = "Capas activas" } = e, { intensity: i = 18 } = e, { blurAmount: c = 0.6 } = e, r = 0, o = 0, f = 0, v = 0;
  const p = (g) => {
    const h = g.currentTarget.getBoundingClientRect(), m = (g.clientX - h.left) / h.width - 0.5, b = (g.clientY - h.top) / h.height - 0.5;
    t(2, r = b * i * -1), t(3, o = m * i), t(4, f = m * 24), t(5, v = b * 24);
  }, u = () => {
    t(2, r = 0), t(3, o = 0), t(4, f = 0), t(5, v = 0);
  };
  return l.$$set = (g) => {
    "title" in g && t(0, s = g.title), "intensity" in g && t(8, i = g.intensity), "blurAmount" in g && t(1, c = g.blurAmount);
  }, [s, c, r, o, f, v, p, u, i];
}
class ks extends pe {
  constructor(e) {
    super(), fe(this, e, Di, Ii, le, { title: 0, intensity: 8, blurAmount: 1 }, Ri);
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
de(ks, { title: {}, intensity: {}, blurAmount: {} }, [], [], !0);
function Xi(l) {
  ce(l, "svelte-1yc0e5f", `:host{display:block;font-family:'Poppins', 'Manrope', 'Segoe UI', system-ui, sans-serif}.card-shell.svelte-1yc0e5f.svelte-1yc0e5f{position:relative;padding-bottom:18px}.card.svelte-1yc0e5f.svelte-1yc0e5f{position:relative;z-index:1;background:#ffffff;border-radius:16px;overflow:hidden;border:2px solid transparent;box-shadow:0 12px 24px rgba(15, 23, 42, 0.08);transition:transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;cursor:pointer}.card.svelte-1yc0e5f.svelte-1yc0e5f:hover{transform:translateY(-2px);box-shadow:0 18px 32px rgba(15, 23, 42, 0.12),
      0 0 0 2px color-mix(in srgb, var(--category-left) 55%, transparent),
      0 12px 24px color-mix(in srgb, var(--category-right) 35%, transparent)}.card.is-selected.svelte-1yc0e5f.svelte-1yc0e5f{border-color:#10b981;transform:scale(0.99)}.card.is-disabled.svelte-1yc0e5f.svelte-1yc0e5f{opacity:0.5;cursor:not-allowed;pointer-events:none}.thumb.svelte-1yc0e5f.svelte-1yc0e5f{position:relative;background:#f1f5f9;aspect-ratio:16 / 9;overflow:hidden}.thumb.svelte-1yc0e5f img.svelte-1yc0e5f{width:100%;height:100%;object-fit:cover;display:block}.thumb-placeholder.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;inset:0;display:grid;place-items:center;font-size:28px;color:#94a3b8}.thumb-overlay.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;inset:0;background:linear-gradient(180deg, rgba(15, 23, 42, 0) 50%, rgba(15, 23, 42, 0.55) 100%);opacity:0;transition:opacity 0.2s ease}.card.svelte-1yc0e5f:hover .thumb-overlay.svelte-1yc0e5f{opacity:1}.pill-row.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;top:8px;left:8px;display:flex;gap:6px}.pill.svelte-1yc0e5f.svelte-1yc0e5f{padding:4px 8px;border-radius:999px;background:rgba(15, 23, 42, 0.6);color:#ffffff;font-size:11px;font-weight:600}.pill.badge.svelte-1yc0e5f.svelte-1yc0e5f{background:rgba(15, 23, 42, 0.75);text-transform:uppercase;letter-spacing:0.5px}.favorite.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;top:8px;right:8px;border:none;background:rgba(15, 23, 42, 0.35);color:#ffffff;width:30px;height:30px;border-radius:999px;display:grid;place-items:center;cursor:pointer;transition:background 0.2s ease, transform 0.2s ease, color 0.2s ease}.favorite.svelte-1yc0e5f svg.svelte-1yc0e5f{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.6}.favorite.active.svelte-1yc0e5f.svelte-1yc0e5f{background:rgba(255, 255, 255, 0.9);color:#ef4444}.favorite.active.svelte-1yc0e5f svg.svelte-1yc0e5f{fill:currentColor;stroke:none}.favorite.svelte-1yc0e5f.svelte-1yc0e5f:hover{transform:scale(1.05)}.check.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;bottom:8px;left:8px;width:26px;height:26px;border-radius:999px;background:rgba(255, 255, 255, 0.9);border:1px solid #e2e8f0;display:grid;place-items:center;transition:background 0.2s ease, border-color 0.2s ease}.check.svelte-1yc0e5f svg.svelte-1yc0e5f{width:16px;height:16px;fill:#ffffff;opacity:0;transform:scale(0.7);transition:opacity 0.2s ease, transform 0.2s ease}.card.is-selected.svelte-1yc0e5f .check.svelte-1yc0e5f{background:#10b981;border-color:#059669}.card.is-selected.svelte-1yc0e5f .check svg.svelte-1yc0e5f{opacity:1;transform:scale(1)}.body.svelte-1yc0e5f.svelte-1yc0e5f{padding:16px;display:grid;gap:8px}.body.svelte-1yc0e5f h3.svelte-1yc0e5f{margin:0;font-size:15px;font-weight:700;color:#0f172a}.body.svelte-1yc0e5f p.svelte-1yc0e5f{margin:0;font-size:13px;color:#64748b;min-height:34px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.cta.svelte-1yc0e5f.svelte-1yc0e5f{padding:8px 10px;border-radius:10px;text-align:center;font-size:12px;font-weight:600;color:#64748b;background:#f1f5f9;transition:background 0.2s ease, color 0.2s ease}.card.svelte-1yc0e5f:hover .cta.svelte-1yc0e5f{background:#e2e8f0}.cta-selected.svelte-1yc0e5f.svelte-1yc0e5f{background:#d1fae5;color:#047857}.category-lift.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;left:16px;right:16px;bottom:-12px;display:flex;justify-content:center;gap:8px;z-index:0;pointer-events:none;transform:translateY(14px);opacity:0;transition:transform 0.25s ease, opacity 0.2s ease}.category-chip.svelte-1yc0e5f.svelte-1yc0e5f{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:0.4px;color:#ffffff;text-transform:uppercase;background:var(--chip-color);box-shadow:0 10px 20px color-mix(in srgb, var(--chip-color) 35%, transparent)}.card-shell.svelte-1yc0e5f:hover .category-lift.svelte-1yc0e5f,.card-shell.svelte-1yc0e5f:focus-within .category-lift.svelte-1yc0e5f{opacity:1;transform:translateY(0)}`);
}
function Yi(l) {
  let e;
  return {
    c() {
      e = d("div"), e.textContent = "▶", a(e, "class", "thumb-placeholder svelte-1yc0e5f");
    },
    m(t, s) {
      E(t, e, s);
    },
    p: X,
    d(t) {
      t && S(e);
    }
  };
}
function Bi(l) {
  let e, t, s;
  return {
    c() {
      e = d("img"), Me(e.src, t = /*thumbnail*/
      l[3]) || a(e, "src", t), a(e, "alt", s = `Miniatura de ${/*title*/
      l[0]}`), a(e, "loading", "lazy"), a(e, "class", "svelte-1yc0e5f");
    },
    m(i, c) {
      E(i, e, c);
    },
    p(i, c) {
      c & /*thumbnail*/
      8 && !Me(e.src, t = /*thumbnail*/
      i[3]) && a(e, "src", t), c & /*title*/
      1 && s !== (s = `Miniatura de ${/*title*/
      i[0]}`) && a(e, "alt", s);
    },
    d(i) {
      i && S(e);
    }
  };
}
function xl(l) {
  let e, t;
  return {
    c() {
      e = d("div"), t = z(
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
      s && S(e);
    }
  };
}
function yl(l) {
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
      E(o, e, f), n(e, t), n(t, s), n(e, c), r && r.m(e, null);
    },
    p(o, f) {
      f & /*categoryLeft*/
      256 && M(
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
      E(i, e, c), n(e, t);
    },
    p(i, c) {
      c & /*categoryRight*/
      512 && M(
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
function Oi(l) {
  let e, t, s, i, c, r, o, f, v, p, u, g, h, m, b, _, q, A, w, x, L, k, j, T, P, N, H, I = (
    /*selected*/
    l[4] ? "Seleccionado" : "Seleccionar video"
  ), F, R, G, $, ve, ie, ne, J;
  function U(B, K) {
    return (
      /*thumbnail*/
      B[3] ? Bi : Yi
    );
  }
  let _e = U(l), Z = _e(l), Q = (
    /*badge*/
    l[6] && xl(l)
  ), ee = (
    /*categoryLeft*/
    l[8] && yl(l)
  );
  return {
    c() {
      e = d("div"), t = d("div"), s = d("div"), Z.c(), i = y(), c = d("div"), r = y(), o = d("div"), f = d("div"), v = z(
        /*duration*/
        l[2]
      ), p = y(), Q && Q.c(), u = y(), g = d("button"), h = rl("svg"), m = rl("path"), q = y(), A = d("div"), A.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" class="svelte-1yc0e5f"><path d="M9.2 16.2L5.7 12.7l1.4-1.4 2.1 2.1 7.7-7.7 1.4 1.4z"></path></svg>', w = y(), x = d("div"), L = d("h3"), k = z(
        /*title*/
        l[0]
      ), j = y(), T = d("p"), P = z(
        /*description*/
        l[1]
      ), N = y(), H = d("div"), F = z(I), ve = y(), ee && ee.c(), a(c, "class", "thumb-overlay svelte-1yc0e5f"), a(f, "class", "pill svelte-1yc0e5f"), a(o, "class", "pill-row svelte-1yc0e5f"), a(m, "d", "M12.1 21.2c-0.1 0-0.3 0-0.4-0.1C6.1 18.6 2 15 2 10.4 2 7.6 4.3 5.3 7.1 5.3c1.7 0 3.3 0.8 4.3 2.1 1-1.3 2.6-2.1 4.3-2.1 2.8 0 5.1 2.3 5.1 5.1 0 4.6-4.1 8.2-9.7 10.7-0.1 0-0.2 0.1-0.3 0.1z"), a(h, "viewBox", "0 0 24 24"), a(h, "aria-hidden", "true"), a(h, "class", "svelte-1yc0e5f"), a(g, "class", b = "favorite " + /*favorite*/
      (l[7] ? "active" : "") + " svelte-1yc0e5f"), a(g, "aria-label", _ = /*favorite*/
      l[7] ? "Quitar de favoritos" : "Anadir a favoritos"), a(A, "class", "check svelte-1yc0e5f"), a(s, "class", "thumb svelte-1yc0e5f"), a(L, "class", "svelte-1yc0e5f"), a(T, "class", "svelte-1yc0e5f"), a(H, "class", R = "cta " + /*selected*/
      (l[4] ? "cta-selected" : "") + " svelte-1yc0e5f"), a(x, "class", "body svelte-1yc0e5f"), a(t, "class", G = "card " + /*selected*/
      (l[4] ? "is-selected" : "") + " " + /*disabled*/
      (l[5] ? "is-disabled" : "") + " svelte-1yc0e5f"), a(t, "role", "button"), a(
        t,
        "aria-disabled",
        /*disabled*/
        l[5]
      ), a(t, "tabindex", $ = /*disabled*/
      l[5] ? -1 : 0), a(e, "class", "card-shell svelte-1yc0e5f"), a(e, "style", ie = `--category-left: ${/*categoryLeftColor*/
      l[10]}; --category-right: ${/*categoryRightColor*/
      l[11]};`);
    },
    m(B, K) {
      E(B, e, K), n(e, t), n(t, s), Z.m(s, null), n(s, i), n(s, c), n(s, r), n(s, o), n(o, f), n(f, v), n(o, p), Q && Q.m(o, null), n(s, u), n(s, g), n(g, h), n(h, m), n(s, q), n(s, A), n(t, w), n(t, x), n(x, L), n(L, k), n(x, j), n(x, T), n(T, P), n(x, N), n(x, H), n(H, F), n(e, ve), ee && ee.m(e, null), ne || (J = [
        O(
          g,
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
      ], ne = !0);
    },
    p(B, [K]) {
      _e === (_e = U(B)) && Z ? Z.p(B, K) : (Z.d(1), Z = _e(B), Z && (Z.c(), Z.m(s, i))), K & /*duration*/
      4 && M(
        v,
        /*duration*/
        B[2]
      ), /*badge*/
      B[6] ? Q ? Q.p(B, K) : (Q = xl(B), Q.c(), Q.m(o, null)) : Q && (Q.d(1), Q = null), K & /*favorite*/
      128 && b !== (b = "favorite " + /*favorite*/
      (B[7] ? "active" : "") + " svelte-1yc0e5f") && a(g, "class", b), K & /*favorite*/
      128 && _ !== (_ = /*favorite*/
      B[7] ? "Quitar de favoritos" : "Anadir a favoritos") && a(g, "aria-label", _), K & /*title*/
      1 && M(
        k,
        /*title*/
        B[0]
      ), K & /*description*/
      2 && M(
        P,
        /*description*/
        B[1]
      ), K & /*selected*/
      16 && I !== (I = /*selected*/
      B[4] ? "Seleccionado" : "Seleccionar video") && M(F, I), K & /*selected*/
      16 && R !== (R = "cta " + /*selected*/
      (B[4] ? "cta-selected" : "") + " svelte-1yc0e5f") && a(H, "class", R), K & /*selected, disabled*/
      48 && G !== (G = "card " + /*selected*/
      (B[4] ? "is-selected" : "") + " " + /*disabled*/
      (B[5] ? "is-disabled" : "") + " svelte-1yc0e5f") && a(t, "class", G), K & /*disabled*/
      32 && a(
        t,
        "aria-disabled",
        /*disabled*/
        B[5]
      ), K & /*disabled*/
      32 && $ !== ($ = /*disabled*/
      B[5] ? -1 : 0) && a(t, "tabindex", $), /*categoryLeft*/
      B[8] ? ee ? ee.p(B, K) : (ee = yl(B), ee.c(), ee.m(e, null)) : ee && (ee.d(1), ee = null), K & /*categoryLeftColor, categoryRightColor*/
      3072 && ie !== (ie = `--category-left: ${/*categoryLeftColor*/
      B[10]}; --category-right: ${/*categoryRightColor*/
      B[11]};`) && a(e, "style", ie);
    },
    i: X,
    o: X,
    d(B) {
      B && S(e), Z.d(), Q && Q.d(), ee && ee.d(), ne = !1, me(J);
    }
  };
}
function Hi(l, e, t) {
  let { videoId: s = "" } = e, { hashedId: i = "" } = e, { title: c = "" } = e, { description: r = "" } = e, { duration: o = "" } = e, { thumbnail: f = "" } = e, { selected: v = !1 } = e, { disabled: p = !1 } = e, { badge: u = "" } = e, { tags: g = [] } = e, { favorite: h = !1 } = e, { categoryLeft: m = "" } = e, { categoryRight: b = "" } = e, { categoryLeftColor: _ = "#94a3b8" } = e, { categoryRightColor: q = "#94a3b8" } = e;
  const A = Ae(), w = () => {
    p || A("select", { id: s });
  }, x = (k) => {
    k.stopPropagation(), !p && A("favorite", { hashedId: i });
  }, L = (k) => {
    p || (k.key === "Enter" || k.key === " ") && (k.preventDefault(), w());
  };
  return l.$$set = (k) => {
    "videoId" in k && t(15, s = k.videoId), "hashedId" in k && t(16, i = k.hashedId), "title" in k && t(0, c = k.title), "description" in k && t(1, r = k.description), "duration" in k && t(2, o = k.duration), "thumbnail" in k && t(3, f = k.thumbnail), "selected" in k && t(4, v = k.selected), "disabled" in k && t(5, p = k.disabled), "badge" in k && t(6, u = k.badge), "tags" in k && t(17, g = k.tags), "favorite" in k && t(7, h = k.favorite), "categoryLeft" in k && t(8, m = k.categoryLeft), "categoryRight" in k && t(9, b = k.categoryRight), "categoryLeftColor" in k && t(10, _ = k.categoryLeftColor), "categoryRightColor" in k && t(11, q = k.categoryRightColor);
  }, [
    c,
    r,
    o,
    f,
    v,
    p,
    u,
    h,
    m,
    b,
    _,
    q,
    w,
    x,
    L,
    s,
    i,
    g
  ];
}
class zs extends pe {
  constructor(e) {
    super(), fe(
      this,
      e,
      Hi,
      Oi,
      le,
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
      Xi
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
customElements.define("svelte-video-card", de(zs, { videoId: {}, hashedId: {}, title: {}, description: {}, duration: {}, thumbnail: {}, selected: { type: "Boolean" }, disabled: { type: "Boolean" }, badge: {}, tags: {}, favorite: { type: "Boolean" }, categoryLeft: {}, categoryRight: {}, categoryLeftColor: {}, categoryRightColor: {} }, [], [], !0));
function Fi(l) {
  const e = l - 1;
  return e * e * e + 1;
}
function xt(l, { delay: e = 0, duration: t = 400, easing: s = is } = {}) {
  const i = +getComputedStyle(l).opacity;
  return {
    delay: e,
    duration: t,
    easing: s,
    css: (c) => `opacity: ${c * i}`
  };
}
function Ye(l, { delay: e = 0, duration: t = 400, easing: s = Fi, x: i = 0, y: c = 0, opacity: r = 0 } = {}) {
  const o = getComputedStyle(l), f = +o.opacity, v = o.transform === "none" ? "" : o.transform, p = f * (1 - r), [u, g] = nl(i), [h, m] = nl(c);
  return {
    delay: e,
    duration: t,
    easing: s,
    css: (b, _) => `
			transform: ${v} translate(${(1 - b) * u}${g}, ${(1 - b) * h}${m});
			opacity: ${f - p * _}`
  };
}
function Vi(l) {
  ce(l, "svelte-1hb2737", `.overlay.svelte-1hb2737{position:fixed;inset:0;z-index:70;display:flex;align-items:center;justify-content:center;padding:24px;background:radial-gradient(circle at top, rgba(58, 132, 117, 0.2), rgba(0, 0, 0, 0.6));backdrop-filter:blur(6px)}.card.svelte-1hb2737{position:relative;width:min(520px, 92vw);padding:28px 26px 24px;border-radius:24px;background:linear-gradient(135deg, #ffffff 0%, #f4f6f0 100%);box-shadow:0 18px 40px rgba(0, 0, 0, 0.22),
      0 4px 18px rgba(50, 120, 102, 0.18);overflow:hidden}.card.svelte-1hb2737::before{content:"";position:absolute;inset:-1px;border-radius:24px;padding:1px;background:linear-gradient(130deg, rgba(43, 173, 145, 0.5), rgba(255, 255, 255, 0));-webkit-mask:linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none}.badge.svelte-1hb2737{display:inline-flex;align-items:center;padding:6px 12px;border-radius:999px;background:rgba(46, 140, 120, 0.12);color:#1f5f52;font-size:12px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase}h2.svelte-1hb2737{margin:14px 0 8px;font-size:22px;font-weight:700;color:#1f2a26}p.svelte-1hb2737{margin:0;font-size:14px;line-height:1.5;color:#4b5b56}.actions.svelte-1hb2737{margin-top:18px;display:flex;justify-content:flex-end}button.svelte-1hb2737{border:none;border-radius:12px;padding:10px 18px;font-size:14px;font-weight:600;color:#fff;background:linear-gradient(135deg, #2e8c78, #1f6d5e);box-shadow:0 10px 18px rgba(46, 140, 120, 0.28);cursor:pointer}button.svelte-1hb2737:hover{filter:brightness(1.05)}button.svelte-1hb2737:active{transform:translateY(1px)}@media(max-width: 480px){.card.svelte-1hb2737{padding:22px 20px}h2.svelte-1hb2737{font-size:20px}}`);
}
function kl(l) {
  let e, t, s, i, c, r, o, f, v, p, u, g, h, m, b, _, q, A;
  return {
    c() {
      e = d("div"), t = d("div"), s = d("div"), s.textContent = "Fin de temporada", i = y(), c = d("h2"), r = z(
        /*title*/
        l[1]
      ), o = y(), f = d("p"), v = z(
        /*message*/
        l[2]
      ), p = y(), u = d("div"), g = d("button"), h = z(
        /*cta*/
        l[3]
      ), a(s, "class", "badge svelte-1hb2737"), a(c, "class", "svelte-1hb2737"), a(f, "class", "svelte-1hb2737"), a(g, "type", "button"), a(g, "class", "svelte-1hb2737"), a(u, "class", "actions svelte-1hb2737"), a(t, "class", "card svelte-1hb2737"), a(e, "class", "overlay svelte-1hb2737"), a(e, "role", "button"), a(e, "tabindex", "0"), a(e, "aria-label", "Cerrar aviso de temporada");
    },
    m(w, x) {
      E(w, e, x), n(e, t), n(t, s), n(t, i), n(t, c), n(c, r), n(t, o), n(t, f), n(f, v), n(t, p), n(t, u), n(u, g), n(g, h), _ = !0, q || (A = [
        O(
          g,
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
    p(w, x) {
      (!_ || x & /*title*/
      2) && M(
        r,
        /*title*/
        w[1]
      ), (!_ || x & /*message*/
      4) && M(
        v,
        /*message*/
        w[2]
      ), (!_ || x & /*cta*/
      8) && M(
        h,
        /*cta*/
        w[3]
      );
    },
    i(w) {
      _ || (w && Se(() => {
        _ && (m || (m = qe(t, Ye, { y: 18, duration: 240 }, !0)), m.run(1));
      }), w && Se(() => {
        _ && (b || (b = qe(e, xt, { duration: 180 }, !0)), b.run(1));
      }), _ = !0);
    },
    o(w) {
      w && (m || (m = qe(t, Ye, { y: 18, duration: 240 }, !1)), m.run(0)), w && (b || (b = qe(e, xt, { duration: 180 }, !1)), b.run(0)), _ = !1;
    },
    d(w) {
      w && S(e), w && m && m.end(), w && b && b.end(), q = !1, me(A);
    }
  };
}
function Ui(l) {
  let e, t = (
    /*open*/
    l[0] && kl(l)
  );
  return {
    c() {
      t && t.c(), e = Be();
    },
    m(s, i) {
      t && t.m(s, i), E(s, e, i);
    },
    p(s, [i]) {
      /*open*/
      s[0] ? t ? (t.p(s, i), i & /*open*/
      1 && Re(t, 1)) : (t = kl(s), t.c(), Re(t, 1), t.m(e.parentNode, e)) : t && (Rt(), ot(t, 1, 1, () => {
        t = null;
      }), It());
    },
    i(s) {
      Re(t);
    },
    o(s) {
      ot(t);
    },
    d(s) {
      s && S(e), t && t.d(s);
    }
  };
}
function Gi(l, e, t) {
  let { open: s = !1 } = e, { title: i = "Temporada finalizada" } = e, { message: c = "La temporada actual ha terminado. Tus logros de temporada se reiniciaran para un nuevo ciclo." } = e, { cta: r = "Entendido" } = e;
  const o = Ae(), f = () => {
    t(0, s = !1), o("dismiss");
  }, v = (u) => {
    u.target === u.currentTarget && f();
  }, p = (u) => {
    const g = u.key;
    (g === "Escape" || g === "Enter" || g === " ") && f();
  };
  return l.$$set = (u) => {
    "open" in u && t(0, s = u.open), "title" in u && t(1, i = u.title), "message" in u && t(2, c = u.message), "cta" in u && t(3, r = u.cta);
  }, [s, i, c, r, f, v, p];
}
class qs extends pe {
  constructor(e) {
    super(), fe(this, e, Gi, Ui, le, { open: 0, title: 1, message: 2, cta: 3 }, Vi);
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
customElements.define("svelte-season-popup", de(qs, { open: { type: "Boolean" }, title: {}, message: {}, cta: {} }, [], [], !0));
function $i(l) {
  ce(l, "svelte-1f864m7", ':host{display:inline-block}.token.svelte-1f864m7{position:relative;height:40px;width:64px;border-radius:8px;border:1px solid #e5e7eb;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;line-height:1.1;font-family:inherit;overflow:visible;margin:0 4px}.time.svelte-1f864m7{font-weight:600;font-size:14px;color:inherit}.points.svelte-1f864m7{font-size:10px;opacity:0.8;margin-top:-2px}.points.expired.svelte-1f864m7{text-decoration:line-through}.completed.svelte-1f864m7{background:#8acc9f;color:#ffffff;border-color:#10b981}.open.svelte-1f864m7{background:#ecfdf5;color:#047857;border-color:#6ee7b7;box-shadow:0 4px 10px rgba(16, 185, 129, 0.12);transform:scale(1.2);transition:transform 0.2s ease;transform-origin:center;margin:0 10px}.open.svelte-1f864m7::before,.open.svelte-1f864m7::after,.open.svelte-1f864m7::backdrop{content:"";position:absolute;inset:-10px;border-radius:12px;border:1px solid rgba(16, 185, 129, 0.35);background:radial-gradient(circle, rgba(16, 185, 129, 0.35), rgba(16, 185, 129, 0));opacity:0;animation:svelte-1f864m7-pulse 1.35s ease-out infinite;pointer-events:none}.open.svelte-1f864m7::after{animation-delay:0.45s}.open.svelte-1f864m7::backdrop{animation-delay:0.9s}.expired.svelte-1f864m7{background:#fee2e2;color:#ef4444;border-color:#fca5a5}.upcoming.svelte-1f864m7{background:#f3f4f6;color:#6b7280;border-color:#e5e7eb}@media(min-width: 640px){.token.svelte-1f864m7{height:48px;width:80px;border-radius:10px}.time.svelte-1f864m7{font-size:15px}}@keyframes svelte-1f864m7-pulse{0%{transform:scale(0.85);opacity:0}20%{opacity:0.55}100%{transform:scale(1.4);opacity:0}}');
}
function Ji(l) {
  let e, t = `+${/*points*/
  l[2]} ${/*unit*/
  l[3]}`, s;
  return {
    c() {
      e = d("div"), s = z(t), a(e, "class", "time svelte-1f864m7");
    },
    m(i, c) {
      E(i, e, c), n(e, s);
    },
    p(i, c) {
      c & /*points, unit*/
      12 && t !== (t = `+${/*points*/
      i[2]} ${/*unit*/
      i[3]}`) && M(s, t);
    },
    d(i) {
      i && S(e);
    }
  };
}
function Ki(l) {
  let e, t, s, i, c, r, o, f, v;
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
      ), a(e, "class", "time svelte-1f864m7"), a(i, "class", v = "points " + /*status*/
      (l[0] === "expired" ? "expired" : "") + " svelte-1f864m7");
    },
    m(p, u) {
      E(p, e, u), n(e, t), E(p, s, u), E(p, i, u), n(i, c), n(i, r), n(i, o), n(i, f);
    },
    p(p, u) {
      u & /*timeLabel*/
      2 && M(
        t,
        /*timeLabel*/
        p[1]
      ), u & /*points*/
      4 && M(
        r,
        /*points*/
        p[2]
      ), u & /*unit*/
      8 && M(
        f,
        /*unit*/
        p[3]
      ), u & /*status*/
      1 && v !== (v = "points " + /*status*/
      (p[0] === "expired" ? "expired" : "") + " svelte-1f864m7") && a(i, "class", v);
    },
    d(p) {
      p && (S(e), S(s), S(i));
    }
  };
}
function Qi(l) {
  let e, t;
  function s(r, o) {
    return (
      /*timeLabel*/
      r[1] ? Ki : Ji
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
      E(r, e, o), c.m(e, null);
    },
    p(r, [o]) {
      i === (i = s(r)) && c ? c.p(r, o) : (c.d(1), c = i(r), c && (c.c(), c.m(e, null))), o & /*status*/
      1 && t !== (t = "token " + /*label*/
      r[4](
        /*status*/
        r[0]
      ) + " svelte-1f864m7") && a(e, "class", t);
    },
    i: X,
    o: X,
    d(r) {
      r && S(e), c.d();
    }
  };
}
function Wi(l, e, t) {
  let { status: s = "upcoming" } = e, { timeLabel: i = "" } = e, { points: c = 20 } = e, { unit: r = "AP" } = e;
  const o = (f) => typeof f == "string" ? f : String(f ?? "");
  return l.$$set = (f) => {
    "status" in f && t(0, s = f.status), "timeLabel" in f && t(1, i = f.timeLabel), "points" in f && t(2, c = f.points), "unit" in f && t(3, r = f.unit);
  }, [s, i, c, r, o];
}
class js extends pe {
  constructor(e) {
    super(), fe(
      this,
      e,
      Wi,
      Qi,
      le,
      {
        status: 0,
        timeLabel: 1,
        points: 2,
        unit: 3
      },
      $i
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
customElements.define("svelte-quota-token", de(js, { status: {}, timeLabel: {}, points: {}, unit: {} }, [], [], !0));
function Zi(l) {
  ce(l, "svelte-p2zlwf", ":host{display:block;font-family:inherit}.panel.svelte-p2zlwf.svelte-p2zlwf{display:grid;gap:18px;animation:svelte-p2zlwf-panel-rise 0.4s ease}.hero.svelte-p2zlwf.svelte-p2zlwf{position:relative;border-radius:22px;padding:18px 20px;background:linear-gradient(130deg, #f8fafc, #ecfdf5);border:1px solid #e2e8f0;display:grid;gap:14px;overflow:hidden}.hero-cards.svelte-p2zlwf.svelte-p2zlwf{display:grid;grid-template-columns:repeat(auto-fit, minmax(160px, 1fr));gap:10px}.hero-card.svelte-p2zlwf.svelte-p2zlwf{border-radius:16px;padding:10px 12px;background:rgba(255, 255, 255, 0.8);border:1px solid rgba(226, 232, 240, 0.9);display:grid;gap:4px}.hero-card.accent.svelte-p2zlwf.svelte-p2zlwf{background:linear-gradient(120deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.08));border-color:rgba(16, 185, 129, 0.4)}.orb.svelte-p2zlwf.svelte-p2zlwf{position:absolute;right:18px;top:-10px;width:120px;height:120px;border-radius:999px;background:radial-gradient(circle, rgba(16, 185, 129, 0.22), transparent 65%);animation:svelte-p2zlwf-float 6s ease-in-out infinite}.orb.small.svelte-p2zlwf.svelte-p2zlwf{right:120px;top:60px;width:72px;height:72px;animation-delay:1.4s;opacity:0.7}.eyebrow.svelte-p2zlwf.svelte-p2zlwf{text-transform:uppercase;font-size:11px;letter-spacing:0.12em;color:#94a3b8;margin:0 0 6px}h1.svelte-p2zlwf.svelte-p2zlwf{margin:0;font-size:22px;font-weight:700;color:#0f172a}.email.svelte-p2zlwf.svelte-p2zlwf{margin:4px 0 0;color:#64748b;font-size:13px}.grid.svelte-p2zlwf.svelte-p2zlwf{display:grid;gap:12px;grid-template-columns:repeat(auto-fit, minmax(160px, 1fr))}.grid.two.svelte-p2zlwf.svelte-p2zlwf{grid-template-columns:repeat(auto-fit, minmax(220px, 1fr))}.card.svelte-p2zlwf.svelte-p2zlwf{background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;padding:12px 14px;display:grid;gap:6px;position:relative;overflow:hidden}.card.svelte-p2zlwf span.svelte-p2zlwf{font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#94a3b8}.card.svelte-p2zlwf strong.svelte-p2zlwf{font-size:20px;color:#0f172a}.section.svelte-p2zlwf.svelte-p2zlwf{background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;padding:16px;position:relative}.xp.svelte-p2zlwf.svelte-p2zlwf{overflow:hidden}.xp-toggle.svelte-p2zlwf.svelte-p2zlwf{width:100%;border:none;background:transparent;display:flex;align-items:center;justify-content:space-between;gap:12px;cursor:pointer;padding:0;margin-bottom:10px}.xp-toggle.svelte-p2zlwf h2.svelte-p2zlwf{margin:0}.xp-toggle.svelte-p2zlwf span.svelte-p2zlwf{display:inline-flex;align-items:center;justify-content:center;height:28px;width:28px;border-radius:999px;background:#ecfdf5;color:#10b981;transition:transform 0.2s ease;font-weight:700}.xp-toggle.svelte-p2zlwf span.rotated.svelte-p2zlwf{transform:rotate(180deg)}.xp-controls.svelte-p2zlwf.svelte-p2zlwf{display:grid;grid-template-columns:repeat(auto-fit, minmax(140px, 1fr));gap:8px;margin-bottom:10px}.xp-controls.svelte-p2zlwf label.svelte-p2zlwf{display:grid;gap:4px;font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em}.xp-controls.svelte-p2zlwf input.svelte-p2zlwf{border:1px solid #e2e8f0;border-radius:10px;padding:6px 8px;font-size:12px;color:#0f172a;background:#fff}.xp-controls.svelte-p2zlwf .ghost.svelte-p2zlwf,.xp-controls.svelte-p2zlwf .apply.svelte-p2zlwf,.xp-footer.svelte-p2zlwf .apply.svelte-p2zlwf{border:none;border-radius:10px;padding:8px 10px;font-size:12px;font-weight:600;cursor:pointer}.xp-controls.svelte-p2zlwf .ghost.svelte-p2zlwf{background:#f1f5f9;color:#334155}.xp-controls.svelte-p2zlwf .apply.svelte-p2zlwf,.xp-footer.svelte-p2zlwf .apply.svelte-p2zlwf{background:#10b981;color:#fff}.xp-footer.svelte-p2zlwf.svelte-p2zlwf{display:flex;align-items:center;justify-content:space-between;margin-top:8px}.section.svelte-p2zlwf h2.svelte-p2zlwf{margin:0 0 10px;font-size:15px;font-weight:700;color:#0f172a}.row.svelte-p2zlwf.svelte-p2zlwf{display:flex;justify-content:space-between;align-items:center}.days.svelte-p2zlwf.svelte-p2zlwf{display:flex;flex-wrap:wrap;gap:8px}.days.svelte-p2zlwf span.svelte-p2zlwf{height:36px;width:36px;border-radius:999px;display:grid;place-items:center;font-size:12px;font-weight:700;background:#f1f5f9;color:#94a3b8}.days.svelte-p2zlwf span.active.svelte-p2zlwf{background:#10b981;color:#ffffff}.list.svelte-p2zlwf.svelte-p2zlwf{display:grid;gap:8px}.list-item.svelte-p2zlwf.svelte-p2zlwf{display:flex;justify-content:space-between;align-items:center;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:8px 12px;font-size:12px;color:#334155}.list-item.svelte-p2zlwf .timestamp.svelte-p2zlwf{display:block;font-size:11px;color:#94a3b8;margin-top:2px}.accent.svelte-p2zlwf.svelte-p2zlwf{color:#10b981;font-weight:700}.line.svelte-p2zlwf.svelte-p2zlwf{display:flex;justify-content:space-between;font-size:13px;color:#334155;padding:4px 0}.muted.svelte-p2zlwf.svelte-p2zlwf{color:#94a3b8;font-size:13px}ul.svelte-p2zlwf.svelte-p2zlwf{margin:0;padding-left:18px;color:#475569;display:grid;gap:6px;font-size:13px}@keyframes svelte-p2zlwf-panel-rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}@keyframes svelte-p2zlwf-float{0%,100%{transform:translateY(0)}50%{transform:translateY(12px)}}");
}
function zl(l, e, t) {
  const s = l.slice();
  return s[41] = e[t], s;
}
function ql(l, e, t) {
  const s = l.slice();
  return s[44] = e[t], s;
}
function jl(l, e, t) {
  const s = l.slice();
  return s[47] = e[t], s;
}
function Cl(l, e, t) {
  const s = l.slice();
  return s[50] = e[t], s;
}
function Sl(l, e, t) {
  const s = l.slice();
  return s[53] = e[t], s[55] = t, s;
}
function Ll(l) {
  let e, t;
  return {
    c() {
      e = d("p"), t = z(
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
      s && S(e);
    }
  };
}
function Tl(l) {
  let e;
  return {
    c() {
      e = d("span"), e.textContent = `${/*label*/
      l[53]}`, a(e, "class", "svelte-p2zlwf"), lt(
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
      8192 && lt(
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
function El(l) {
  let e, t, s, i, c, r, o, f, v, p, u, g, h, m, b, _, q, A;
  const w = [tn, en], x = [];
  function L(k, j) {
    return (
      /*xpItems*/
      k[3].length === 0 ? 0 : 1
    );
  }
  return m = L(l), b = x[m] = w[m](l), {
    c() {
      e = d("div"), t = d("label"), s = z(`Desde
          `), i = d("input"), c = y(), r = d("label"), o = z(`Hasta
          `), f = d("input"), v = y(), p = d("button"), p.textContent = "Limpiar", u = y(), g = d("button"), g.textContent = "Aplicar", h = y(), b.c(), _ = Be(), a(i, "type", "date"), a(i, "class", "svelte-p2zlwf"), a(t, "class", "svelte-p2zlwf"), a(f, "type", "date"), a(f, "class", "svelte-p2zlwf"), a(r, "class", "svelte-p2zlwf"), a(p, "type", "button"), a(p, "class", "ghost svelte-p2zlwf"), a(g, "type", "button"), a(g, "class", "apply svelte-p2zlwf"), a(e, "class", "xp-controls svelte-p2zlwf");
    },
    m(k, j) {
      E(k, e, j), n(e, t), n(t, s), n(t, i), Ne(
        i,
        /*filterFrom*/
        l[6]
      ), n(e, c), n(e, r), n(r, o), n(r, f), Ne(
        f,
        /*filterTo*/
        l[7]
      ), n(e, v), n(e, p), n(e, u), n(e, g), E(k, h, j), x[m].m(k, j), E(k, _, j), q || (A = [
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
        O(p, "click", Tt(
          /*click_handler_1*/
          l[37]
        )),
        O(g, "click", Tt(
          /*click_handler_2*/
          l[38]
        ))
      ], q = !0);
    },
    p(k, j) {
      j[0] & /*filterFrom*/
      64 && Ne(
        i,
        /*filterFrom*/
        k[6]
      ), j[0] & /*filterTo*/
      128 && Ne(
        f,
        /*filterTo*/
        k[7]
      );
      let T = m;
      m = L(k), m === T ? x[m].p(k, j) : (Rt(), ot(x[T], 1, 1, () => {
        x[T] = null;
      }), It(), b = x[m], b ? b.p(k, j) : (b = x[m] = w[m](k), b.c()), Re(b, 1), b.m(_.parentNode, _));
    },
    d(k) {
      k && (S(e), S(h), S(_)), x[m].d(k), q = !1, me(A);
    }
  };
}
function en(l) {
  let e, t, s, i, c, r, o, f, v, p, u, g = te(
    /*xpItems*/
    l[3]
  ), h = [];
  for (let b = 0; b < g.length; b += 1)
    h[b] = Ml(Cl(l, g, b));
  let m = (
    /*shownCount*/
    l[8] < /*totalCount*/
    l[2] && Al(l)
  );
  return {
    c() {
      e = d("div");
      for (let b = 0; b < h.length; b += 1)
        h[b].c();
      s = y(), i = d("div"), c = d("span"), r = z("Mostrando "), o = z(
        /*shownCount*/
        l[8]
      ), f = z(" de "), v = z(
        /*totalCount*/
        l[2]
      ), p = y(), m && m.c(), a(e, "class", "list svelte-p2zlwf"), a(c, "class", "muted svelte-p2zlwf"), a(i, "class", "xp-footer svelte-p2zlwf");
    },
    m(b, _) {
      E(b, e, _);
      for (let q = 0; q < h.length; q += 1)
        h[q] && h[q].m(e, null);
      E(b, s, _), E(b, i, _), n(i, c), n(c, r), n(c, o), n(c, f), n(c, v), n(i, p), m && m.m(i, null), u = !0;
    },
    p(b, _) {
      if (_[0] & /*xpItems, formatTimestamp, getXpLabel*/
      393224) {
        g = te(
          /*xpItems*/
          b[3]
        );
        let q;
        for (q = 0; q < g.length; q += 1) {
          const A = Cl(b, g, q);
          h[q] ? h[q].p(A, _) : (h[q] = Ml(A), h[q].c(), h[q].m(e, null));
        }
        for (; q < h.length; q += 1)
          h[q].d(1);
        h.length = g.length;
      }
      (!u || _[0] & /*shownCount*/
      256) && M(
        o,
        /*shownCount*/
        b[8]
      ), (!u || _[0] & /*totalCount*/
      4) && M(
        v,
        /*totalCount*/
        b[2]
      ), /*shownCount*/
      b[8] < /*totalCount*/
      b[2] ? m ? m.p(b, _) : (m = Al(b), m.c(), m.m(i, null)) : m && (m.d(1), m = null);
    },
    i(b) {
      u || (b && Se(() => {
        u && (t || (t = qe(e, Ye, { y: 6, duration: 180 }, !0)), t.run(1));
      }), u = !0);
    },
    o(b) {
      b && (t || (t = qe(e, Ye, { y: 6, duration: 180 }, !1)), t.run(0)), u = !1;
    },
    d(b) {
      b && (S(e), S(s), S(i)), Ie(h, b), b && t && t.end(), m && m.d();
    }
  };
}
function tn(l) {
  let e, t, s;
  return {
    c() {
      e = d("p"), e.textContent = "Sin movimientos recientes.", a(e, "class", "muted svelte-p2zlwf");
    },
    m(i, c) {
      E(i, e, c), s = !0;
    },
    p: X,
    i(i) {
      s || (i && Se(() => {
        s && (t || (t = qe(e, Ye, { y: 6, duration: 180 }, !0)), t.run(1));
      }), s = !0);
    },
    o(i) {
      i && (t || (t = qe(e, Ye, { y: 6, duration: 180 }, !1)), t.run(0)), s = !1;
    },
    d(i) {
      i && S(e), i && t && t.end();
    }
  };
}
function Ml(l) {
  var q, A;
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
  ), v, p, u, g, h = (
    /*entry*/
    (((A = l[50]) == null ? void 0 : A.points) ?? 0) + ""
  ), m, b, _;
  return {
    c() {
      e = d("div"), t = d("div"), s = d("span"), c = z(i), r = y(), o = d("span"), v = z(f), p = y(), u = d("span"), g = z("+"), m = z(h), b = z(" PA"), _ = y(), a(o, "class", "timestamp svelte-p2zlwf"), a(u, "class", "accent svelte-p2zlwf"), a(e, "class", "list-item svelte-p2zlwf");
    },
    m(w, x) {
      E(w, e, x), n(e, t), n(t, s), n(s, c), n(t, r), n(t, o), n(o, v), n(e, p), n(e, u), n(u, g), n(u, m), n(u, b), n(e, _);
    },
    p(w, x) {
      var L, k;
      x[0] & /*xpItems*/
      8 && i !== (i = /*getXpLabel*/
      w[17](
        /*entry*/
        w[50]
      ) + "") && M(c, i), x[0] & /*xpItems*/
      8 && f !== (f = /*formatTimestamp*/
      w[18](
        /*entry*/
        (L = w[50]) == null ? void 0 : L.created_at
      ) + "") && M(v, f), x[0] & /*xpItems*/
      8 && h !== (h = /*entry*/
      (((k = w[50]) == null ? void 0 : k.points) ?? 0) + "") && M(m, h);
    },
    d(w) {
      w && S(e);
    }
  };
}
function Al(l) {
  let e, t, s;
  return {
    c() {
      e = d("button"), e.textContent = "Ver más", a(e, "type", "button"), a(e, "class", "apply svelte-p2zlwf");
    },
    m(i, c) {
      E(i, e, c), t || (s = O(e, "click", Tt(
        /*click_handler_3*/
        l[39]
      )), t = !0);
    },
    p: X,
    d(i) {
      i && S(e), t = !1, s();
    }
  };
}
function ln(l) {
  let e, t = te(
    /*categories*/
    l[12].slice(0, 8)
  ), s = [];
  for (let i = 0; i < t.length; i += 1)
    s[i] = Nl(jl(l, t, i));
  return {
    c() {
      for (let i = 0; i < s.length; i += 1)
        s[i].c();
      e = Be();
    },
    m(i, c) {
      for (let r = 0; r < s.length; r += 1)
        s[r] && s[r].m(i, c);
      E(i, e, c);
    },
    p(i, c) {
      if (c[0] & /*categories*/
      4096) {
        t = te(
          /*categories*/
          i[12].slice(0, 8)
        );
        let r;
        for (r = 0; r < t.length; r += 1) {
          const o = jl(i, t, r);
          s[r] ? s[r].p(o, c) : (s[r] = Nl(o), s[r].c(), s[r].m(e.parentNode, e));
        }
        for (; r < s.length; r += 1)
          s[r].d(1);
        s.length = t.length;
      }
    },
    d(i) {
      i && S(e), Ie(s, i);
    }
  };
}
function sn(l) {
  let e;
  return {
    c() {
      e = d("p"), e.textContent = "Sin actividad registrada.", a(e, "class", "muted svelte-p2zlwf");
    },
    m(t, s) {
      E(t, e, s);
    },
    p: X,
    d(t) {
      t && S(e);
    }
  };
}
function Nl(l) {
  let e, t, s = (
    /*cat*/
    l[47].category + ""
  ), i, c, r, o = (
    /*cat*/
    l[47].total_sessions + ""
  ), f, v;
  return {
    c() {
      e = d("div"), t = d("span"), i = z(s), c = y(), r = d("strong"), f = z(o), v = y(), a(t, "class", "svelte-p2zlwf"), a(r, "class", "svelte-p2zlwf"), a(e, "class", "line svelte-p2zlwf");
    },
    m(p, u) {
      E(p, e, u), n(e, t), n(t, i), n(e, c), n(e, r), n(r, f), n(e, v);
    },
    p(p, u) {
      u[0] & /*categories*/
      4096 && s !== (s = /*cat*/
      p[47].category + "") && M(i, s), u[0] & /*categories*/
      4096 && o !== (o = /*cat*/
      p[47].total_sessions + "") && M(f, o);
    },
    d(p) {
      p && S(e);
    }
  };
}
function nn(l) {
  let e, t = te(
    /*favorites*/
    l[11].slice(0, 8)
  ), s = [];
  for (let i = 0; i < t.length; i += 1)
    s[i] = Pl(ql(l, t, i));
  return {
    c() {
      for (let i = 0; i < s.length; i += 1)
        s[i].c();
      e = Be();
    },
    m(i, c) {
      for (let r = 0; r < s.length; r += 1)
        s[r] && s[r].m(i, c);
      E(i, e, c);
    },
    p(i, c) {
      if (c[0] & /*favorites*/
      2048) {
        t = te(
          /*favorites*/
          i[11].slice(0, 8)
        );
        let r;
        for (r = 0; r < t.length; r += 1) {
          const o = ql(i, t, r);
          s[r] ? s[r].p(o, c) : (s[r] = Pl(o), s[r].c(), s[r].m(e.parentNode, e));
        }
        for (; r < s.length; r += 1)
          s[r].d(1);
        s.length = t.length;
      }
    },
    d(i) {
      i && S(e), Ie(s, i);
    }
  };
}
function rn(l) {
  let e;
  return {
    c() {
      e = d("p"), e.textContent = "Aún no hay ejercicios destacados.", a(e, "class", "muted svelte-p2zlwf");
    },
    m(t, s) {
      E(t, e, s);
    },
    p: X,
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
  ), f, v, p;
  return {
    c() {
      e = d("div"), t = d("span"), i = z(s), c = y(), r = d("strong"), f = z(o), v = z("x"), p = y(), a(t, "class", "svelte-p2zlwf"), a(r, "class", "svelte-p2zlwf"), a(e, "class", "line svelte-p2zlwf");
    },
    m(u, g) {
      E(u, e, g), n(e, t), n(t, i), n(e, c), n(e, r), n(r, f), n(r, v), n(e, p);
    },
    p(u, g) {
      g[0] & /*favorites*/
      2048 && s !== (s = /*fav*/
      u[44].title + "") && M(i, s), g[0] & /*favorites*/
      2048 && o !== (o = /*fav*/
      u[44].total_sessions + "") && M(f, o);
    },
    d(u) {
      u && S(e);
    }
  };
}
function an(l) {
  let e, t = te(
    /*insightItems*/
    l[10]
  ), s = [];
  for (let i = 0; i < t.length; i += 1)
    s[i] = Rl(zl(l, t, i));
  return {
    c() {
      e = d("ul");
      for (let i = 0; i < s.length; i += 1)
        s[i].c();
      a(e, "class", "svelte-p2zlwf");
    },
    m(i, c) {
      E(i, e, c);
      for (let r = 0; r < s.length; r += 1)
        s[r] && s[r].m(e, null);
    },
    p(i, c) {
      if (c[0] & /*insightItems*/
      1024) {
        t = te(
          /*insightItems*/
          i[10]
        );
        let r;
        for (r = 0; r < t.length; r += 1) {
          const o = zl(i, t, r);
          s[r] ? s[r].p(o, c) : (s[r] = Rl(o), s[r].c(), s[r].m(e, null));
        }
        for (; r < s.length; r += 1)
          s[r].d(1);
        s.length = t.length;
      }
    },
    d(i) {
      i && S(e), Ie(s, i);
    }
  };
}
function on(l) {
  let e;
  return {
    c() {
      e = d("p"), e.textContent = "Sin insights por ahora.", a(e, "class", "muted svelte-p2zlwf");
    },
    m(t, s) {
      E(t, e, s);
    },
    p: X,
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
      E(i, e, c), n(e, s);
    },
    p(i, c) {
      c[0] & /*insightItems*/
      1024 && t !== (t = /*item*/
      i[41] + "") && M(s, t);
    },
    d(i) {
      i && S(e);
    }
  };
}
function cn(l) {
  let e, t, s, i, c, r, o, f, v, p, u, g, h, m, b = (
    /*summaryData*/
    l[15].total_exercises + ""
  ), _, q, A, w, x, L, k = (
    /*summaryData*/
    l[15].weekly_sessions + ""
  ), j, T, P, N, H, I, F = Number(
    /*summaryData*/
    l[15].avg_satisfaction || 0
  ).toFixed(1) + "", R, G, $, ve, ie, ne, J, U, _e, Z, Q, ee, B = (
    /*summaryData*/
    l[15].distinct_days + ""
  ), K, D, W, je, De, ye, oe = (
    /*formatMinutes*/
    l[16](
      /*timeData*/
      l[14].week_minutes
    ) + ""
  ), ge, xe, re, V, he, se, Oe = (
    /*formatMinutes*/
    l[16](
      /*timeData*/
      l[14].month_minutes
    ) + ""
  ), yt, Yt, $e, Je, ct, Bt, st, ft = (
    /*activeDays*/
    l[13].length + ""
  ), wt, Ot, Ht, it, Ft, He, Xe, kt, Vt, Ke, Ut, Gt, Qe, Fe, zt, $t, Jt, Ve, qt, Kt, Qt, Ue, dt, Wt, jt, Zt, we = (
    /*email*/
    l[1] && Ll(l)
  ), Ct = te(["L", "M", "X", "J", "V", "S", "D"]), Ce = [];
  for (let Y = 0; Y < 7; Y += 1)
    Ce[Y] = Tl(Sl(l, Ct, Y));
  let ke = (
    /*xpOpen*/
    l[5] && El(l)
  );
  function el(Y, ae) {
    return (
      /*categories*/
      Y[12].length === 0 ? sn : ln
    );
  }
  let pt = el(l), Le = pt(l);
  function tl(Y, ae) {
    return (
      /*favorites*/
      Y[11].length === 0 ? rn : nn
    );
  }
  let ut = tl(l), Te = ut(l);
  function ll(Y, ae) {
    return (
      /*insightItems*/
      Y[10].length === 0 ? on : an
    );
  }
  let vt = ll(l), Ee = vt(l);
  return {
    c() {
      e = d("div"), t = d("section"), s = d("div"), i = d("p"), i.textContent = "Estadísticas avanzadas", c = y(), r = d("h1"), o = z(
        /*name*/
        l[0]
      ), f = y(), we && we.c(), v = y(), p = d("div"), u = d("div"), g = d("span"), g.textContent = "Total de pausas", h = y(), m = d("strong"), _ = z(b), q = y(), A = d("div"), w = d("span"), w.textContent = "Sesiones esta semana", x = y(), L = d("strong"), j = z(k), T = y(), P = d("div"), N = d("span"), N.textContent = "Satisfacción promedio", H = y(), I = d("strong"), R = z(F), G = z(" / 5"), $ = y(), ve = d("div"), ie = y(), ne = d("div"), J = y(), U = d("section"), _e = d("div"), Z = d("span"), Z.textContent = "Días activos", Q = y(), ee = d("strong"), K = z(B), D = y(), W = d("div"), je = d("span"), je.textContent = "Tiempo saludable (7 días)", De = y(), ye = d("strong"), ge = z(oe), xe = y(), re = d("div"), V = d("span"), V.textContent = "Tiempo saludable (30 días)", he = y(), se = d("strong"), yt = z(Oe), Yt = y(), $e = d("section"), Je = d("div"), ct = d("h2"), ct.textContent = "Actividad semanal", Bt = y(), st = d("span"), wt = z(ft), Ot = z("/7 días activos"), Ht = y(), it = d("div");
      for (let Y = 0; Y < 7; Y += 1)
        Ce[Y].c();
      Ft = y(), He = d("section"), Xe = d("button"), kt = d("div"), kt.innerHTML = '<h2 class="svelte-p2zlwf">Historial de XP</h2> <p class="muted svelte-p2zlwf">Últimos movimientos</p>', Vt = y(), Ke = d("span"), Ke.textContent = "⌄", Ut = y(), ke && ke.c(), Gt = y(), Qe = d("section"), Fe = d("div"), zt = d("h3"), zt.textContent = "Categorías favoritas", $t = y(), Le.c(), Jt = y(), Ve = d("div"), qt = d("h3"), qt.textContent = "Ejercicios más repetidos", Kt = y(), Te.c(), Qt = y(), Ue = d("section"), dt = d("h2"), dt.textContent = "Insights", Wt = y(), Ee.c(), a(i, "class", "eyebrow svelte-p2zlwf"), a(r, "class", "svelte-p2zlwf"), a(u, "class", "hero-card svelte-p2zlwf"), a(A, "class", "hero-card accent svelte-p2zlwf"), a(P, "class", "hero-card svelte-p2zlwf"), a(p, "class", "hero-cards svelte-p2zlwf"), a(ve, "class", "orb svelte-p2zlwf"), a(ne, "class", "orb small svelte-p2zlwf"), a(t, "class", "hero svelte-p2zlwf"), a(Z, "class", "svelte-p2zlwf"), a(ee, "class", "svelte-p2zlwf"), a(_e, "class", "card svelte-p2zlwf"), a(je, "class", "svelte-p2zlwf"), a(ye, "class", "svelte-p2zlwf"), a(W, "class", "card svelte-p2zlwf"), a(V, "class", "svelte-p2zlwf"), a(se, "class", "svelte-p2zlwf"), a(re, "class", "card svelte-p2zlwf"), a(U, "class", "grid svelte-p2zlwf"), a(ct, "class", "svelte-p2zlwf"), a(st, "class", "muted svelte-p2zlwf"), a(Je, "class", "row svelte-p2zlwf"), a(it, "class", "days svelte-p2zlwf"), a($e, "class", "section svelte-p2zlwf"), a(Ke, "class", "svelte-p2zlwf"), lt(
        Ke,
        "rotated",
        /*xpOpen*/
        l[5]
      ), a(Xe, "type", "button"), a(Xe, "class", "xp-toggle svelte-p2zlwf"), a(He, "class", "section xp svelte-p2zlwf"), a(Fe, "class", "card svelte-p2zlwf"), a(Ve, "class", "card svelte-p2zlwf"), a(Qe, "class", "grid two svelte-p2zlwf"), a(dt, "class", "svelte-p2zlwf"), a(Ue, "class", "section svelte-p2zlwf"), a(e, "class", "panel svelte-p2zlwf");
    },
    m(Y, ae) {
      E(Y, e, ae), n(e, t), n(t, s), n(s, i), n(s, c), n(s, r), n(r, o), n(s, f), we && we.m(s, null), n(t, v), n(t, p), n(p, u), n(u, g), n(u, h), n(u, m), n(m, _), n(p, q), n(p, A), n(A, w), n(A, x), n(A, L), n(L, j), n(p, T), n(p, P), n(P, N), n(P, H), n(P, I), n(I, R), n(I, G), n(t, $), n(t, ve), n(t, ie), n(t, ne), n(e, J), n(e, U), n(U, _e), n(_e, Z), n(_e, Q), n(_e, ee), n(ee, K), n(U, D), n(U, W), n(W, je), n(W, De), n(W, ye), n(ye, ge), n(U, xe), n(U, re), n(re, V), n(re, he), n(re, se), n(se, yt), n(e, Yt), n(e, $e), n($e, Je), n(Je, ct), n(Je, Bt), n(Je, st), n(st, wt), n(st, Ot), n($e, Ht), n($e, it);
      for (let be = 0; be < 7; be += 1)
        Ce[be] && Ce[be].m(it, null);
      n(e, Ft), n(e, He), n(He, Xe), n(Xe, kt), n(Xe, Vt), n(Xe, Ke), n(He, Ut), ke && ke.m(He, null), n(e, Gt), n(e, Qe), n(Qe, Fe), n(Fe, zt), n(Fe, $t), Le.m(Fe, null), n(Qe, Jt), n(Qe, Ve), n(Ve, qt), n(Ve, Kt), Te.m(Ve, null), n(e, Qt), n(e, Ue), n(Ue, dt), n(Ue, Wt), Ee.m(Ue, null), jt || (Zt = O(
        Xe,
        "click",
        /*click_handler*/
        l[34]
      ), jt = !0);
    },
    p(Y, ae) {
      if (ae[0] & /*name*/
      1 && M(
        o,
        /*name*/
        Y[0]
      ), /*email*/
      Y[1] ? we ? we.p(Y, ae) : (we = Ll(Y), we.c(), we.m(s, null)) : we && (we.d(1), we = null), ae[0] & /*summaryData*/
      32768 && b !== (b = /*summaryData*/
      Y[15].total_exercises + "") && M(_, b), ae[0] & /*summaryData*/
      32768 && k !== (k = /*summaryData*/
      Y[15].weekly_sessions + "") && M(j, k), ae[0] & /*summaryData*/
      32768 && F !== (F = Number(
        /*summaryData*/
        Y[15].avg_satisfaction || 0
      ).toFixed(1) + "") && M(R, F), ae[0] & /*summaryData*/
      32768 && B !== (B = /*summaryData*/
      Y[15].distinct_days + "") && M(K, B), ae[0] & /*timeData*/
      16384 && oe !== (oe = /*formatMinutes*/
      Y[16](
        /*timeData*/
        Y[14].week_minutes
      ) + "") && M(ge, oe), ae[0] & /*timeData*/
      16384 && Oe !== (Oe = /*formatMinutes*/
      Y[16](
        /*timeData*/
        Y[14].month_minutes
      ) + "") && M(yt, Oe), ae[0] & /*activeDays*/
      8192 && ft !== (ft = /*activeDays*/
      Y[13].length + "") && M(wt, ft), ae[0] & /*activeDays*/
      8192) {
        Ct = te(["L", "M", "X", "J", "V", "S", "D"]);
        let be;
        for (be = 0; be < 7; be += 1) {
          const sl = Sl(Y, Ct, be);
          Ce[be] ? Ce[be].p(sl, ae) : (Ce[be] = Tl(sl), Ce[be].c(), Ce[be].m(it, null));
        }
        for (; be < 7; be += 1)
          Ce[be].d(1);
      }
      ae[0] & /*xpOpen*/
      32 && lt(
        Ke,
        "rotated",
        /*xpOpen*/
        Y[5]
      ), /*xpOpen*/
      Y[5] ? ke ? ke.p(Y, ae) : (ke = El(Y), ke.c(), ke.m(He, null)) : ke && (ke.d(1), ke = null), pt === (pt = el(Y)) && Le ? Le.p(Y, ae) : (Le.d(1), Le = pt(Y), Le && (Le.c(), Le.m(Fe, null))), ut === (ut = tl(Y)) && Te ? Te.p(Y, ae) : (Te.d(1), Te = ut(Y), Te && (Te.c(), Te.m(Ve, null))), vt === (vt = ll(Y)) && Ee ? Ee.p(Y, ae) : (Ee.d(1), Ee = vt(Y), Ee && (Ee.c(), Ee.m(Ue, null)));
    },
    i: X,
    o: X,
    d(Y) {
      Y && S(e), we && we.d(), Ie(Ce, Y), ke && ke.d(), Le.d(), Te.d(), Ee.d(), jt = !1, Zt();
    }
  };
}
function fn(l, e, t) {
  let s, i, c, r, o, f, v, p, u, g, h, { name: m = "Usuario" } = e, { email: b = "" } = e, { summary: _ = "" } = e, { timeSummary: q = "" } = e, { weeklyActiveDays: A = "" } = e, { xpHistory: w = "" } = e, { categoryDistribution: x = "" } = e, { favoriteVideos: L = "" } = e, { insights: k = "" } = e, { xpTotal: j = 0 } = e, { xpLimit: T = 10 } = e, { xpOffset: P = 0 } = e, { xpFrom: N = "" } = e, { xpTo: H = "" } = e;
  const I = (D, W) => {
    if (!D || typeof D != "string") return W;
    try {
      return JSON.parse(D);
    } catch {
      return W;
    }
  }, F = (D) => D ? D < 60 ? `${Math.round(D)} min` : `${(D / 60).toFixed(1)} h` : "0 min", R = (D) => {
    var je, De;
    const W = ((je = D == null ? void 0 : D.metadata) == null ? void 0 : je.source) || (D == null ? void 0 : D.action_type) || "XP";
    if (W === "achievement") {
      const ye = (De = D == null ? void 0 : D.metadata) == null ? void 0 : De.achievement_title;
      return ye ? `Logro · ${ye}` : "Logro";
    }
    return W === "weekly_challenge" ? "Reto semanal" : W === "questionnaire" ? "Cuestionario" : W === "active_pause" || W === "pause" ? "Pausa activa" : "XP";
  }, G = (D) => {
    if (!D) return "";
    const W = new Date(D);
    return Number.isNaN(W.getTime()) ? "" : W.toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" });
  }, $ = Ae();
  let ve = !1, ie = N, ne = H, J = N, U = H;
  const _e = () => t(5, ve = !ve);
  function Z() {
    ie = this.value, t(6, ie), t(30, N), t(32, J);
  }
  function Q() {
    ne = this.value, t(7, ne), t(31, H), t(33, U);
  }
  const ee = () => {
    t(6, ie = ""), t(7, ne = ""), $("xpfilter", { from: "", to: "" });
  }, B = () => {
    $("xpfilter", { from: ie, to: ne });
  }, K = () => {
    $("xploadmore", { nextOffset: u + p });
  };
  return l.$$set = (D) => {
    "name" in D && t(0, m = D.name), "email" in D && t(1, b = D.email), "summary" in D && t(20, _ = D.summary), "timeSummary" in D && t(21, q = D.timeSummary), "weeklyActiveDays" in D && t(22, A = D.weeklyActiveDays), "xpHistory" in D && t(23, w = D.xpHistory), "categoryDistribution" in D && t(24, x = D.categoryDistribution), "favoriteVideos" in D && t(25, L = D.favoriteVideos), "insights" in D && t(26, k = D.insights), "xpTotal" in D && t(27, j = D.xpTotal), "xpLimit" in D && t(28, T = D.xpLimit), "xpOffset" in D && t(29, P = D.xpOffset), "xpFrom" in D && t(30, N = D.xpFrom), "xpTo" in D && t(31, H = D.xpTo);
  }, l.$$.update = () => {
    l.$$.dirty[0] & /*summary*/
    1048576 && t(15, s = I(_, {
      total_exercises: 0,
      weekly_sessions: 0,
      avg_satisfaction: 0,
      distinct_days: 0
    })), l.$$.dirty[0] & /*timeSummary*/
    2097152 && t(14, i = I(q, { week_minutes: 0, month_minutes: 0 })), l.$$.dirty[0] & /*weeklyActiveDays*/
    4194304 && t(13, c = I(A, [])), l.$$.dirty[0] & /*xpHistory*/
    8388608 && t(3, r = I(w, [])), l.$$.dirty[0] & /*categoryDistribution*/
    16777216 && t(12, o = I(x, [])), l.$$.dirty[0] & /*favoriteVideos*/
    33554432 && t(11, f = I(L, [])), l.$$.dirty[0] & /*insights*/
    67108864 && t(10, v = I(k, [])), l.$$.dirty[0] & /*xpFrom*/
    1073741824 | l.$$.dirty[1] & /*lastXpFrom*/
    2 && N !== J && (t(6, ie = N), t(32, J = N)), l.$$.dirty[1] & /*xpTo, lastXpTo*/
    5 && H !== U && (t(7, ne = H), t(33, U = H)), l.$$.dirty[0] & /*xpLimit*/
    268435456 && t(9, p = Number(T) || 10), l.$$.dirty[0] & /*xpOffset*/
    536870912 && t(4, u = Number(P) || 0), l.$$.dirty[0] & /*xpTotal, xpItems*/
    134217736 && t(2, g = Number(j) || r.length), l.$$.dirty[0] & /*safeOffset, xpItems, totalCount*/
    28 && t(8, h = Math.min(u + r.length, g));
  }, [
    m,
    b,
    g,
    r,
    u,
    ve,
    ie,
    ne,
    h,
    p,
    v,
    f,
    o,
    c,
    i,
    s,
    F,
    R,
    G,
    $,
    _,
    q,
    A,
    w,
    x,
    L,
    k,
    j,
    T,
    P,
    N,
    H,
    J,
    U,
    _e,
    Z,
    Q,
    ee,
    B,
    K
  ];
}
class Cs extends pe {
  constructor(e) {
    super(), fe(
      this,
      e,
      fn,
      cn,
      le,
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
      Zi,
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
customElements.define("svelte-user-stats-panel", de(Cs, { name: {}, email: {}, summary: {}, timeSummary: {}, weeklyActiveDays: {}, xpHistory: {}, categoryDistribution: {}, favoriteVideos: {}, insights: {}, xpTotal: {}, xpLimit: {}, xpOffset: {}, xpFrom: {}, xpTo: {} }, [], [], !0));
function dn(l) {
  ce(l, "svelte-1np7r3s", ".podium-wrap.svelte-1np7r3s.svelte-1np7r3s{border-radius:32px;border:1px solid rgba(16,185,129,.18);background:radial-gradient(circle at top,#ecfdf5 0%,#ffffff 45%,#f0fdf4 100%);padding:28px;box-shadow:0 30px 60px rgba(15,118,110,.08)}.podium-header.svelte-1np7r3s.svelte-1np7r3s{display:flex;flex-wrap:wrap;gap:16px;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(16,185,129,.12);padding-bottom:16px}.eyebrow.svelte-1np7r3s.svelte-1np7r3s{font-size:10px;letter-spacing:.32em;text-transform:uppercase;font-weight:600;color:#10b981}h2.svelte-1np7r3s.svelte-1np7r3s{margin:6px 0 0;font-size:24px;font-weight:700;color:#0f172a}.scope.svelte-1np7r3s.svelte-1np7r3s{margin-top:4px;font-size:13px;color:#64748b}.badge.svelte-1np7r3s.svelte-1np7r3s{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:600;color:#0f766e}.badge-icon.svelte-1np7r3s.svelte-1np7r3s{width:20px;height:20px;display:inline-block;border-radius:50%;background:conic-gradient(from 180deg,#34d399,#bbf7d0,#34d399);position:relative}.badge-icon.svelte-1np7r3s.svelte-1np7r3s::after{content:'';position:absolute;inset:5px;border-radius:50%;background:#ecfdf5}.podium-meta.svelte-1np7r3s.svelte-1np7r3s{display:flex;justify-content:space-between;align-items:center;font-size:11px;font-weight:600;text-transform:uppercase;color:#64748b}.place.svelte-1np7r3s.svelte-1np7r3s{color:#0f766e}.xp.svelte-1np7r3s.svelte-1np7r3s{color:#94a3b8}.reward.svelte-1np7r3s.svelte-1np7r3s{border-radius:18px;background:rgba(255,255,255,.75);padding:12px;text-align:center;font-size:12px;color:#0f172a;box-shadow:inset 0 0 0 1px rgba(148,163,184,.2);min-height:168px;display:flex;flex-direction:column;justify-content:center;gap:6px}.reward.svelte-1np7r3s img.svelte-1np7r3s{width:100%;height:110px;object-fit:contain;border-radius:14px;background:#fff;margin-bottom:10px}.reward-title.svelte-1np7r3s.svelte-1np7r3s{font-size:13px;font-weight:600;margin:0}.reward-desc.svelte-1np7r3s.svelte-1np7r3s{margin:6px 0 0;font-size:11px;color:#6b7280}.reward.svelte-1np7r3s a.svelte-1np7r3s{display:inline-block;margin-top:8px;background:#10b981;color:#fff;font-size:11px;padding:6px 12px;border-radius:999px;text-decoration:none}.reward.empty.svelte-1np7r3s.svelte-1np7r3s{border:1px solid rgba(226,232,240,.9);background:rgba(255,255,255,.78);color:#6b7280;text-align:left;justify-content:center}.loading.svelte-1np7r3s.svelte-1np7r3s{margin-top:18px;text-align:center;font-size:12px;color:#6b7280}.classic-grid.svelte-1np7r3s.svelte-1np7r3s{margin-top:28px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));align-items:end;gap:18px}.classic-card.svelte-1np7r3s.svelte-1np7r3s{border-radius:28px;padding:18px;border:1px solid transparent;display:flex;flex-direction:column;gap:12px;min-height:230px}.classic-first.svelte-1np7r3s.svelte-1np7r3s{background:linear-gradient(180deg,rgba(16,185,129,.18),rgba(16,185,129,.05));border-color:rgba(16,185,129,.3)}.classic-second.svelte-1np7r3s.svelte-1np7r3s{background:linear-gradient(180deg,rgba(52,211,153,.18),rgba(236,253,245,.2));border-color:rgba(52,211,153,.25)}.classic-third.svelte-1np7r3s.svelte-1np7r3s{background:linear-gradient(180deg,rgba(187,247,208,.3),rgba(255,255,255,.5));border-color:rgba(187,247,208,.4)}.classic-user.svelte-1np7r3s.svelte-1np7r3s{margin-top:auto;display:flex;align-items:center;gap:10px}.classic-avatar.svelte-1np7r3s.svelte-1np7r3s{width:46px;height:46px;border-radius:50%;object-fit:cover;background:#fff}.classic-avatar.fallback.svelte-1np7r3s.svelte-1np7r3s{display:grid;place-items:center;color:#64748b;font-weight:600}.classic-user-meta.svelte-1np7r3s p.svelte-1np7r3s{margin:0;font-size:14px;font-weight:600;color:#0f172a}.classic-user-meta.svelte-1np7r3s span.svelte-1np7r3s{font-size:12px;color:#94a3b8}.podium-grid.svelte-1np7r3s.svelte-1np7r3s{margin-top:28px;display:grid;grid-template-columns:1fr;gap:18px}.winner-card.svelte-1np7r3s.svelte-1np7r3s{border-radius:28px;border:1px solid rgba(251,191,36,.28);background:linear-gradient(135deg,rgba(253,230,138,.26),rgba(236,253,245,.95));padding:20px;box-shadow:0 18px 36px rgba(15,118,110,.08);animation:svelte-1np7r3s-rise .9s cubic-bezier(.22,1,.36,1) forwards;opacity:0;transform:translateY(18px) scale(.98)}.winner-layout.svelte-1np7r3s.svelte-1np7r3s{margin-top:16px;display:grid;grid-template-columns:auto minmax(0,1fr);gap:16px;align-items:center}.winner-identity.svelte-1np7r3s.svelte-1np7r3s{display:flex;flex-direction:column;align-items:center;text-align:center}.winner-avatar.svelte-1np7r3s.svelte-1np7r3s{width:80px;height:80px;border-radius:50%;object-fit:cover;background:#fff;box-shadow:0 14px 28px rgba(15,118,110,.12)}.winner-avatar.fallback.svelte-1np7r3s.svelte-1np7r3s{display:grid;place-items:center;font-size:28px;font-weight:700;color:#64748b}.winner-name.svelte-1np7r3s.svelte-1np7r3s{margin:12px 0 0;font-size:24px;font-weight:700;color:#0f172a}.winner-score.svelte-1np7r3s.svelte-1np7r3s{margin-top:4px;font-size:14px;color:#64748b}.empty-copy.svelte-1np7r3s.svelte-1np7r3s{display:grid;gap:6px}.empty-copy.svelte-1np7r3s strong.svelte-1np7r3s{font-size:13px;color:#0f172a}.empty-copy.svelte-1np7r3s span.svelte-1np7r3s{font-size:11px;line-height:1.5}.extras-grid.svelte-1np7r3s.svelte-1np7r3s{margin-top:24px;display:grid;grid-template-columns:1.1fr .9fr;gap:16px}.extras-card.svelte-1np7r3s.svelte-1np7r3s{border-radius:24px;border:1px solid rgba(16,185,129,.12);background:rgba(255,255,255,.78);padding:16px;box-shadow:0 10px 24px rgba(15,23,42,.04)}.extras-heading.svelte-1np7r3s.svelte-1np7r3s{display:flex;align-items:center;gap:8px}.extras-heading.svelte-1np7r3s h3.svelte-1np7r3s{margin:0;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#059669}.mini-icon.svelte-1np7r3s.svelte-1np7r3s{width:16px;height:16px;border-radius:999px;background:linear-gradient(135deg,#10b981,#bbf7d0)}.mini-icon.spark.svelte-1np7r3s.svelte-1np7r3s{background:linear-gradient(135deg,#10b981,#34d399,#bbf7d0)}.raffle-grid.svelte-1np7r3s.svelte-1np7r3s{margin-top:16px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.raffle-card.svelte-1np7r3s.svelte-1np7r3s{border:1px solid rgba(226,232,240,.9);border-radius:18px;background:#fff;padding:14px}.raffle-label.svelte-1np7r3s.svelte-1np7r3s{margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#64748b}.raffle-image.svelte-1np7r3s.svelte-1np7r3s{width:100%;height:110px;object-fit:contain;border-radius:14px;background:#f8fafc;margin-bottom:10px}.entries-box.svelte-1np7r3s.svelte-1np7r3s{margin-top:16px;border-radius:18px;background:rgba(16,185,129,.08);padding:16px}.entries-box.svelte-1np7r3s p.svelte-1np7r3s{margin:0;font-size:13px;color:#475569}.entries-box.svelte-1np7r3s strong.svelte-1np7r3s{display:block;margin-top:6px;font-size:32px;color:#047857}.entries-box.svelte-1np7r3s span.svelte-1np7r3s{display:block;margin-top:8px;font-size:11px;color:#64748b}.threshold-list.svelte-1np7r3s.svelte-1np7r3s{margin-top:16px;display:grid;gap:10px}.threshold-row.svelte-1np7r3s.svelte-1np7r3s{display:flex;justify-content:space-between;gap:12px;align-items:center;border:1px solid rgba(226,232,240,.9);border-radius:18px;background:#fff;padding:12px 14px;font-size:13px;color:#475569}.threshold-row.svelte-1np7r3s strong.svelte-1np7r3s{color:#0f172a}@keyframes svelte-1np7r3s-rise{to{opacity:1;transform:translateY(0) scale(1)}}@media(max-width: 900px){.classic-grid.svelte-1np7r3s.svelte-1np7r3s{grid-template-columns:1fr}.winner-layout.svelte-1np7r3s.svelte-1np7r3s{grid-template-columns:1fr}.extras-grid.svelte-1np7r3s.svelte-1np7r3s{grid-template-columns:1fr}.raffle-grid.svelte-1np7r3s.svelte-1np7r3s{grid-template-columns:1fr}}");
}
function Il(l, e, t) {
  const s = l.slice();
  return s[20] = e[t], s;
}
function Dl(l, e, t) {
  const s = l.slice();
  return s[23] = e[t], s;
}
function Xl(l, e, t) {
  const s = l.slice();
  return s[17] = e[t], s;
}
function Yl(l) {
  let e, t;
  return {
    c() {
      e = d("p"), t = z(
        /*scopeLabel*/
        l[3]
      ), a(e, "class", "scope svelte-1np7r3s");
    },
    m(s, i) {
      E(s, e, i), n(e, t);
    },
    p(s, i) {
      i & /*scopeLabel*/
      8 && M(
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
function pn(l) {
  let e = (
    /*playId*/
    l[6]
  ), t, s, i, c, r, o, f, v, p, u, g, h, m, b, _ = Number(
    /*userRaffleEntries*/
    l[2] ?? 0
  ).toLocaleString("es-ES") + "", q, A, w, x, L, k = Hl(l), j = te([{ key: "raffle_a", label: "Sorteo A" }, { key: "raffle_b", label: "Sorteo B" }]), T = [];
  for (let I = 0; I < 2; I += 1)
    T[I] = Fl(Dl(l, j, I));
  function P(I, F) {
    return (
      /*activeThresholds*/
      I[8].length ? Ln : Sn
    );
  }
  let N = P(l), H = N(l);
  return {
    c() {
      k.c(), t = y(), s = d("div"), i = d("article"), c = d("div"), c.innerHTML = '<span class="mini-icon svelte-1np7r3s"></span> <h3 class="svelte-1np7r3s">Premios sorteables</h3>', r = y(), o = d("div");
      for (let I = 0; I < 2; I += 1)
        T[I].c();
      f = y(), v = d("article"), p = d("div"), p.innerHTML = '<span class="mini-icon spark svelte-1np7r3s"></span> <h3 class="svelte-1np7r3s">Participaciones por puntos</h3>', u = y(), g = d("div"), h = d("p"), h.textContent = "Tus participaciones actuales", m = y(), b = d("strong"), q = z(_), A = y(), w = d("span"), w.textContent = "Se aplica siempre el umbral mas alto que hayas alcanzado.", x = y(), L = d("div"), H.c(), a(c, "class", "extras-heading svelte-1np7r3s"), a(o, "class", "raffle-grid svelte-1np7r3s"), a(i, "class", "extras-card svelte-1np7r3s"), a(p, "class", "extras-heading svelte-1np7r3s"), a(h, "class", "svelte-1np7r3s"), a(b, "class", "svelte-1np7r3s"), a(w, "class", "svelte-1np7r3s"), a(g, "class", "entries-box svelte-1np7r3s"), a(L, "class", "threshold-list svelte-1np7r3s"), a(v, "class", "extras-card svelte-1np7r3s"), a(s, "class", "extras-grid svelte-1np7r3s");
    },
    m(I, F) {
      k.m(I, F), E(I, t, F), E(I, s, F), n(s, i), n(i, c), n(i, r), n(i, o);
      for (let R = 0; R < 2; R += 1)
        T[R] && T[R].m(o, null);
      n(s, f), n(s, v), n(v, p), n(v, u), n(v, g), n(g, h), n(g, m), n(g, b), n(b, q), n(g, A), n(g, w), n(v, x), n(v, L), H.m(L, null);
    },
    p(I, F) {
      if (F & /*playId*/
      64 && le(e, e = /*playId*/
      I[6]) ? (k.d(1), k = Hl(I), k.c(), k.m(t.parentNode, t)) : k.p(I, F), F & /*resolveRaffleReward*/
      1024) {
        j = te([
          { key: "raffle_a", label: "Sorteo A" },
          { key: "raffle_b", label: "Sorteo B" }
        ]);
        let R;
        for (R = 0; R < 2; R += 1) {
          const G = Dl(I, j, R);
          T[R] ? T[R].p(G, F) : (T[R] = Fl(G), T[R].c(), T[R].m(o, null));
        }
        for (; R < 2; R += 1)
          T[R].d(1);
      }
      F & /*userRaffleEntries*/
      4 && _ !== (_ = Number(
        /*userRaffleEntries*/
        I[2] ?? 0
      ).toLocaleString("es-ES") + "") && M(q, _), N === (N = P(I)) && H ? H.p(I, F) : (H.d(1), H = N(I), H && (H.c(), H.m(L, null)));
    },
    d(I) {
      I && (S(t), S(s)), k.d(I), Ie(T, I), H.d();
    }
  };
}
function un(l) {
  let e, t = te([
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
    s[i] = Jl(Xl(l, t, i));
  return {
    c() {
      e = d("div");
      for (let i = 0; i < 3; i += 1)
        s[i].c();
      a(e, "class", "classic-grid svelte-1np7r3s");
    },
    m(i, c) {
      E(i, e, c);
      for (let r = 0; r < 3; r += 1)
        s[r] && s[r].m(e, null);
    },
    p(i, c) {
      if (c & /*classicUsers, rewards*/
      33) {
        t = te([
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
          const o = Xl(i, t, r);
          s[r] ? s[r].p(o, c) : (s[r] = Jl(o), s[r].c(), s[r].m(e, null));
        }
        for (; r < 3; r += 1)
          s[r].d(1);
      }
    },
    d(i) {
      i && S(e), Ie(s, i);
    }
  };
}
function Bl(l) {
  let e, t, s = (
    /*winner*/
    l[7].periodical_exp + ""
  ), i, c;
  return {
    c() {
      e = d("span"), t = z("+"), i = z(s), c = z(" XP"), a(e, "class", "xp svelte-1np7r3s");
    },
    m(r, o) {
      E(r, e, o), n(e, t), n(e, i), n(e, c);
    },
    p(r, o) {
      o & /*winner*/
      128 && s !== (s = /*winner*/
      r[7].periodical_exp + "") && M(i, s);
    },
    d(r) {
      r && S(e);
    }
  };
}
function vn(l) {
  let e, t = (
    /*winner*/
    (l[7].first_name || /*winner*/
    l[7].last_name || "?").charAt(0) + ""
  ), s;
  return {
    c() {
      e = d("div"), s = z(t), a(e, "class", "winner-avatar fallback svelte-1np7r3s");
    },
    m(i, c) {
      E(i, e, c), n(e, s);
    },
    p(i, c) {
      c & /*winner*/
      128 && t !== (t = /*winner*/
      (i[7].first_name || /*winner*/
      i[7].last_name || "?").charAt(0) + "") && M(s, t);
    },
    d(i) {
      i && S(e);
    }
  };
}
function gn(l) {
  let e, t, s;
  return {
    c() {
      e = d("img"), Me(e.src, t = /*winner*/
      l[7].avatar_url) || a(e, "src", t), a(e, "alt", s = /*winner*/
      l[7].first_name), a(e, "class", "winner-avatar svelte-1np7r3s"), a(e, "loading", "lazy");
    },
    m(i, c) {
      E(i, e, c);
    },
    p(i, c) {
      c & /*winner*/
      128 && !Me(e.src, t = /*winner*/
      i[7].avatar_url) && a(e, "src", t), c & /*winner*/
      128 && s !== (s = /*winner*/
      i[7].first_name) && a(e, "alt", s);
    },
    d(i) {
      i && S(e);
    }
  };
}
function hn(l) {
  let e;
  return {
    c() {
      e = d("div"), e.textContent = "?", a(e, "class", "winner-avatar fallback svelte-1np7r3s");
    },
    m(t, s) {
      E(t, e, s);
    },
    p: X,
    d(t) {
      t && S(e);
    }
  };
}
function bn(l) {
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
      E(r, t, o), E(r, s, o), E(r, c, o);
    },
    p(r, o) {
      o & /*winner*/
      128 && e !== (e = /*winner*/
      r[7].first_name + "") && M(t, e), o & /*winner*/
      128 && i !== (i = /*winner*/
      r[7].last_name + "") && M(c, i);
    },
    d(r) {
      r && (S(t), S(s), S(c));
    }
  };
}
function mn(l) {
  let e;
  return {
    c() {
      e = z("Aun sin ganador");
    },
    m(t, s) {
      E(t, e, s);
    },
    p: X,
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
      e = d("span"), t = z("+"), i = z(s), c = z(" XP"), a(e, "class", "winner-score svelte-1np7r3s");
    },
    m(r, o) {
      E(r, e, o), n(e, t), n(e, i), n(e, c);
    },
    p(r, o) {
      o & /*winner*/
      128 && s !== (s = /*winner*/
      r[7].periodical_exp + "") && M(i, s);
    },
    d(r) {
      r && S(e);
    }
  };
}
function _n(l) {
  let e;
  return {
    c() {
      e = d("div"), e.innerHTML = '<div class="empty-copy svelte-1np7r3s"><strong class="svelte-1np7r3s">Premio Top 1 pendiente</strong> <span class="svelte-1np7r3s">Configura el premio garantizado para la persona que termine en primera posicion.</span></div>', a(e, "class", "reward empty svelte-1np7r3s");
    },
    m(t, s) {
      E(t, e, s);
    },
    p: X,
    d(t) {
      t && S(e);
    }
  };
}
function xn(l) {
  let e, t = (
    /*resolveGuaranteedReward*/
    l[9]().image_url
  ), s, i, c, r = (
    /*resolveGuaranteedReward*/
    l[9]().description
  ), o, f = (
    /*resolveGuaranteedReward*/
    l[9]().cta_url
  ), v = t && yn(l), p = r && wn(l), u = f && kn(l);
  return {
    c() {
      e = d("div"), v && v.c(), s = y(), i = d("p"), i.textContent = `${/*resolveGuaranteedReward*/
      l[9]().title}`, c = y(), p && p.c(), o = y(), u && u.c(), a(i, "class", "reward-title svelte-1np7r3s"), a(e, "class", "reward svelte-1np7r3s");
    },
    m(g, h) {
      E(g, e, h), v && v.m(e, null), n(e, s), n(e, i), n(e, c), p && p.m(e, null), n(e, o), u && u.m(e, null);
    },
    p(g, h) {
      t && v.p(g, h), r && p.p(g, h), f && u.p(g, h);
    },
    d(g) {
      g && S(e), v && v.d(), p && p.d(), u && u.d();
    }
  };
}
function yn(l) {
  let e, t;
  return {
    c() {
      e = d("img"), Me(e.src, t = /*resolveGuaranteedReward*/
      l[9]().image_url) || a(e, "src", t), a(
        e,
        "alt",
        /*resolveGuaranteedReward*/
        l[9]().title
      ), a(e, "loading", "lazy"), a(e, "class", "svelte-1np7r3s");
    },
    m(s, i) {
      E(s, e, i);
    },
    p: X,
    d(s) {
      s && S(e);
    }
  };
}
function wn(l) {
  let e;
  return {
    c() {
      e = d("p"), e.textContent = `${/*resolveGuaranteedReward*/
      l[9]().description}`, a(e, "class", "reward-desc svelte-1np7r3s");
    },
    m(t, s) {
      E(t, e, s);
    },
    p: X,
    d(t) {
      t && S(e);
    }
  };
}
function kn(l) {
  let e, t;
  return {
    c() {
      e = d("a"), t = z("Ver mas"), a(
        e,
        "href",
        /*resolveGuaranteedReward*/
        l[9]().cta_url
      ), a(e, "target", "_blank"), a(e, "rel", "noreferrer"), a(e, "class", "svelte-1np7r3s");
    },
    m(s, i) {
      E(s, e, i), n(e, t);
    },
    p: X,
    d(s) {
      s && S(e);
    }
  };
}
function Hl(l) {
  let e, t, s, i, c, r, o, f, v, p, u, g, h = (
    /*winner*/
    l[7].id !== "placeholder" && Bl(l)
  );
  function m(T, P) {
    return (
      /*winner*/
      T[7].id === "placeholder" ? hn : (
        /*winner*/
        T[7].avatar_url ? gn : vn
      )
    );
  }
  let b = m(l), _ = b(l);
  function q(T, P) {
    return (
      /*winner*/
      T[7].id === "placeholder" ? mn : bn
    );
  }
  let A = q(l), w = A(l), x = (
    /*winner*/
    l[7].id !== "placeholder" && Ol(l)
  );
  function L(T, P) {
    return (
      /*resolveGuaranteedReward*/
      T[9]() ? xn : _n
    );
  }
  let j = L(l)(l);
  return {
    c() {
      e = d("div"), t = d("article"), s = d("div"), i = d("span"), i.textContent = "Ganador · #1", c = y(), h && h.c(), r = y(), o = d("div"), f = d("div"), _.c(), v = y(), p = d("p"), w.c(), u = y(), x && x.c(), g = y(), j.c(), a(i, "class", "place svelte-1np7r3s"), a(s, "class", "podium-meta svelte-1np7r3s"), a(p, "class", "winner-name svelte-1np7r3s"), a(f, "class", "winner-identity svelte-1np7r3s"), a(o, "class", "winner-layout svelte-1np7r3s"), a(t, "class", "winner-card svelte-1np7r3s"), a(e, "class", "podium-grid svelte-1np7r3s");
    },
    m(T, P) {
      E(T, e, P), n(e, t), n(t, s), n(s, i), n(s, c), h && h.m(s, null), n(t, r), n(t, o), n(o, f), _.m(f, null), n(f, v), n(f, p), w.m(p, null), n(f, u), x && x.m(f, null), n(o, g), j.m(o, null);
    },
    p(T, P) {
      /*winner*/
      T[7].id !== "placeholder" ? h ? h.p(T, P) : (h = Bl(T), h.c(), h.m(s, null)) : h && (h.d(1), h = null), b === (b = m(T)) && _ ? _.p(T, P) : (_.d(1), _ = b(T), _ && (_.c(), _.m(f, v))), A === (A = q(T)) && w ? w.p(T, P) : (w.d(1), w = A(T), w && (w.c(), w.m(p, null))), /*winner*/
      T[7].id !== "placeholder" ? x ? x.p(T, P) : (x = Ol(T), x.c(), x.m(f, null)) : x && (x.d(1), x = null), j.p(T, P);
    },
    d(T) {
      T && S(e), h && h.d(), _.d(), w.d(), x && x.d(), j.d();
    }
  };
}
function zn(l) {
  let e;
  return {
    c() {
      e = d("div"), e.textContent = "Premio pendiente de configurar", a(e, "class", "reward empty svelte-1np7r3s");
    },
    m(t, s) {
      E(t, e, s);
    },
    p: X,
    d(t) {
      t && S(e);
    }
  };
}
function qn(l) {
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
  ), r, o = e && jn(l), f = c && Cn(l);
  return {
    c() {
      o && o.c(), t = y(), s = d("p"), s.textContent = `${/*resolveRaffleReward*/
      l[10](
        /*item*/
        l[23].key
      ).title}`, i = y(), f && f.c(), r = Be(), a(s, "class", "reward-title svelte-1np7r3s");
    },
    m(v, p) {
      o && o.m(v, p), E(v, t, p), E(v, s, p), E(v, i, p), f && f.m(v, p), E(v, r, p);
    },
    p(v, p) {
      e && o.p(v, p), c && f.p(v, p);
    },
    d(v) {
      v && (S(t), S(s), S(i), S(r)), o && o.d(v), f && f.d(v);
    }
  };
}
function jn(l) {
  let e, t;
  return {
    c() {
      e = d("img"), Me(e.src, t = /*resolveRaffleReward*/
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
      ), a(e, "class", "raffle-image svelte-1np7r3s"), a(e, "loading", "lazy");
    },
    m(s, i) {
      E(s, e, i);
    },
    p: X,
    d(s) {
      s && S(e);
    }
  };
}
function Cn(l) {
  let e;
  return {
    c() {
      e = d("p"), e.textContent = `${/*resolveRaffleReward*/
      l[10](
        /*item*/
        l[23].key
      ).description}`, a(e, "class", "reward-desc svelte-1np7r3s");
    },
    m(t, s) {
      E(t, e, s);
    },
    p: X,
    d(t) {
      t && S(e);
    }
  };
}
function Fl(l) {
  let e, t, s, i;
  function c(f, v) {
    return (
      /*resolveRaffleReward*/
      f[10](
        /*item*/
        f[23].key
      ) ? qn : zn
    );
  }
  let o = c(l)(l);
  return {
    c() {
      e = d("div"), t = d("p"), t.textContent = `${/*item*/
      l[23].label}`, s = y(), o.c(), i = y(), a(t, "class", "raffle-label svelte-1np7r3s"), a(e, "class", "raffle-card svelte-1np7r3s");
    },
    m(f, v) {
      E(f, e, v), n(e, t), n(e, s), o.m(e, null), n(e, i);
    },
    p(f, v) {
      o.p(f, v);
    },
    d(f) {
      f && S(e), o.d();
    }
  };
}
function Sn(l) {
  let e;
  return {
    c() {
      e = d("div"), e.textContent = "Aun no hay umbrales configurados para este ambito.", a(e, "class", "reward empty svelte-1np7r3s");
    },
    m(t, s) {
      E(t, e, s);
    },
    p: X,
    d(t) {
      t && S(e);
    }
  };
}
function Ln(l) {
  let e, t = te(
    /*activeThresholds*/
    l[8]
  ), s = [];
  for (let i = 0; i < t.length; i += 1)
    s[i] = Vl(Il(l, t, i));
  return {
    c() {
      for (let i = 0; i < s.length; i += 1)
        s[i].c();
      e = Be();
    },
    m(i, c) {
      for (let r = 0; r < s.length; r += 1)
        s[r] && s[r].m(i, c);
      E(i, e, c);
    },
    p(i, c) {
      if (c & /*activeThresholds, Number*/
      256) {
        t = te(
          /*activeThresholds*/
          i[8]
        );
        let r;
        for (r = 0; r < t.length; r += 1) {
          const o = Il(i, t, r);
          s[r] ? s[r].p(o, c) : (s[r] = Vl(o), s[r].c(), s[r].m(e.parentNode, e));
        }
        for (; r < s.length; r += 1)
          s[r].d(1);
        s.length = t.length;
      }
    },
    d(i) {
      i && S(e), Ie(s, i);
    }
  };
}
function Vl(l) {
  let e, t, s, i = Number(
    /*threshold*/
    l[20].min_points ?? 0
  ).toLocaleString("es-ES") + "", c, r, o, f, v = (
    /*threshold*/
    l[20].entries_count + ""
  ), p, u, g = (
    /*threshold*/
    l[20].entries_count === 1 ? "ion" : "iones"
  ), h, m;
  return {
    c() {
      e = d("div"), t = d("span"), s = z("Desde "), c = z(i), r = z(" PA"), o = y(), f = d("strong"), p = z(v), u = z(" participac"), h = z(g), m = y(), a(f, "class", "svelte-1np7r3s"), a(e, "class", "threshold-row svelte-1np7r3s");
    },
    m(b, _) {
      E(b, e, _), n(e, t), n(t, s), n(t, c), n(t, r), n(e, o), n(e, f), n(f, p), n(f, u), n(f, h), n(e, m);
    },
    p(b, _) {
      _ & /*activeThresholds*/
      256 && i !== (i = Number(
        /*threshold*/
        b[20].min_points ?? 0
      ).toLocaleString("es-ES") + "") && M(c, i), _ & /*activeThresholds*/
      256 && v !== (v = /*threshold*/
      b[20].entries_count + "") && M(p, v), _ & /*activeThresholds*/
      256 && g !== (g = /*threshold*/
      b[20].entries_count === 1 ? "ion" : "iones") && M(h, g);
    },
    d(b) {
      b && S(e);
    }
  };
}
function Ul(l) {
  let e, t, s = (
    /*classicUsers*/
    l[5][
      /*slot*/
      l[17].place - 1
    ].periodical_exp + ""
  ), i, c;
  return {
    c() {
      e = d("span"), t = z("+"), i = z(s), c = z(" XP"), a(e, "class", "xp svelte-1np7r3s");
    },
    m(r, o) {
      E(r, e, o), n(e, t), n(e, i), n(e, c);
    },
    p(r, o) {
      o & /*classicUsers*/
      32 && s !== (s = /*classicUsers*/
      r[5][
        /*slot*/
        r[17].place - 1
      ].periodical_exp + "") && M(i, s);
    },
    d(r) {
      r && S(e);
    }
  };
}
function Tn(l) {
  let e;
  return {
    c() {
      e = d("div"), e.textContent = "Recompensa pendiente", a(e, "class", "reward empty svelte-1np7r3s");
    },
    m(t, s) {
      E(t, e, s);
    },
    p: X,
    d(t) {
      t && S(e);
    }
  };
}
function En(l) {
  var v, p;
  let e, t, s, i = (
    /*rewards*/
    l[0][
      /*slot*/
      l[17].key
    ].title + ""
  ), c, r, o = (
    /*rewards*/
    ((v = l[0][
      /*slot*/
      l[17].key
    ]) == null ? void 0 : v.image_url) && Gl(l)
  ), f = (
    /*rewards*/
    ((p = l[0][
      /*slot*/
      l[17].key
    ]) == null ? void 0 : p.description) && $l(l)
  );
  return {
    c() {
      e = d("div"), o && o.c(), t = y(), s = d("p"), c = z(i), r = y(), f && f.c(), a(s, "class", "reward-title svelte-1np7r3s"), a(e, "class", "reward svelte-1np7r3s");
    },
    m(u, g) {
      E(u, e, g), o && o.m(e, null), n(e, t), n(e, s), n(s, c), n(e, r), f && f.m(e, null);
    },
    p(u, g) {
      var h, m;
      /*rewards*/
      (h = u[0][
        /*slot*/
        u[17].key
      ]) != null && h.image_url ? o ? o.p(u, g) : (o = Gl(u), o.c(), o.m(e, t)) : o && (o.d(1), o = null), g & /*rewards*/
      1 && i !== (i = /*rewards*/
      u[0][
        /*slot*/
        u[17].key
      ].title + "") && M(c, i), /*rewards*/
      (m = u[0][
        /*slot*/
        u[17].key
      ]) != null && m.description ? f ? f.p(u, g) : (f = $l(u), f.c(), f.m(e, null)) : f && (f.d(1), f = null);
    },
    d(u) {
      u && S(e), o && o.d(), f && f.d();
    }
  };
}
function Gl(l) {
  let e, t, s;
  return {
    c() {
      e = d("img"), Me(e.src, t = /*rewards*/
      l[0][
        /*slot*/
        l[17].key
      ].image_url) || a(e, "src", t), a(e, "alt", s = /*rewards*/
      l[0][
        /*slot*/
        l[17].key
      ].title), a(e, "loading", "lazy"), a(e, "class", "svelte-1np7r3s");
    },
    m(i, c) {
      E(i, e, c);
    },
    p(i, c) {
      c & /*rewards*/
      1 && !Me(e.src, t = /*rewards*/
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
function $l(l) {
  let e, t = (
    /*rewards*/
    l[0][
      /*slot*/
      l[17].key
    ].description + ""
  ), s;
  return {
    c() {
      e = d("p"), s = z(t), a(e, "class", "reward-desc svelte-1np7r3s");
    },
    m(i, c) {
      E(i, e, c), n(e, s);
    },
    p(i, c) {
      c & /*rewards*/
      1 && t !== (t = /*rewards*/
      i[0][
        /*slot*/
        i[17].key
      ].description + "") && M(s, t);
    },
    d(i) {
      i && S(e);
    }
  };
}
function Mn(l) {
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
      e = d("div"), s = z(t), a(e, "class", "classic-avatar fallback svelte-1np7r3s");
    },
    m(i, c) {
      E(i, e, c), n(e, s);
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
      ].last_name || "?").charAt(0) + "") && M(s, t);
    },
    d(i) {
      i && S(e);
    }
  };
}
function An(l) {
  let e, t, s;
  return {
    c() {
      e = d("img"), Me(e.src, t = /*classicUsers*/
      l[5][
        /*slot*/
        l[17].place - 1
      ].avatar_url) || a(e, "src", t), a(e, "alt", s = /*classicUsers*/
      l[5][
        /*slot*/
        l[17].place - 1
      ].first_name), a(e, "class", "classic-avatar svelte-1np7r3s"), a(e, "loading", "lazy");
    },
    m(i, c) {
      E(i, e, c);
    },
    p(i, c) {
      c & /*classicUsers*/
      32 && !Me(e.src, t = /*classicUsers*/
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
function Jl(l) {
  let e, t, s, i, c, r, o, f, v, p, u = (
    /*classicUsers*/
    l[5][
      /*slot*/
      l[17].place - 1
    ].first_name + ""
  ), g, h, m = (
    /*classicUsers*/
    l[5][
      /*slot*/
      l[17].place - 1
    ].last_name + ""
  ), b, _, q, A, w = (
    /*classicUsers*/
    l[5][
      /*slot*/
      l[17].place - 1
    ].periodical_exp + ""
  ), x, L, k, j = (
    /*classicUsers*/
    l[5][
      /*slot*/
      l[17].place - 1
    ].id !== "placeholder" && Ul(l)
  );
  function T(R, G) {
    var $;
    return (
      /*rewards*/
      ($ = R[0]) != null && $[
        /*slot*/
        R[17].key
      ] ? En : Tn
    );
  }
  let P = T(l), N = P(l);
  function H(R, G) {
    return (
      /*classicUsers*/
      R[5][
        /*slot*/
        R[17].place - 1
      ].avatar_url ? An : Mn
    );
  }
  let I = H(l), F = I(l);
  return {
    c() {
      e = d("article"), t = d("div"), s = d("span"), s.textContent = `${/*slot*/
      l[17].place} lugar`, i = y(), j && j.c(), c = y(), N.c(), r = y(), o = d("div"), F.c(), f = y(), v = d("div"), p = d("p"), g = z(u), h = y(), b = z(m), _ = y(), q = d("span"), A = z("+"), x = z(w), L = z(" XP"), k = y(), a(s, "class", "place svelte-1np7r3s"), a(t, "class", "podium-meta svelte-1np7r3s"), a(p, "class", "svelte-1np7r3s"), a(q, "class", "svelte-1np7r3s"), a(v, "class", "classic-user-meta svelte-1np7r3s"), a(o, "class", "classic-user svelte-1np7r3s"), a(e, "class", Ge(`classic-card ${/*slot*/
      l[17].className}`) + " svelte-1np7r3s");
    },
    m(R, G) {
      E(R, e, G), n(e, t), n(t, s), n(t, i), j && j.m(t, null), n(e, c), N.m(e, null), n(e, r), n(e, o), F.m(o, null), n(o, f), n(o, v), n(v, p), n(p, g), n(p, h), n(p, b), n(v, _), n(v, q), n(q, A), n(q, x), n(q, L), n(e, k);
    },
    p(R, G) {
      /*classicUsers*/
      R[5][
        /*slot*/
        R[17].place - 1
      ].id !== "placeholder" ? j ? j.p(R, G) : (j = Ul(R), j.c(), j.m(t, null)) : j && (j.d(1), j = null), P === (P = T(R)) && N ? N.p(R, G) : (N.d(1), N = P(R), N && (N.c(), N.m(e, r))), I === (I = H(R)) && F ? F.p(R, G) : (F.d(1), F = I(R), F && (F.c(), F.m(o, f))), G & /*classicUsers*/
      32 && u !== (u = /*classicUsers*/
      R[5][
        /*slot*/
        R[17].place - 1
      ].first_name + "") && M(g, u), G & /*classicUsers*/
      32 && m !== (m = /*classicUsers*/
      R[5][
        /*slot*/
        R[17].place - 1
      ].last_name + "") && M(b, m), G & /*classicUsers*/
      32 && w !== (w = /*classicUsers*/
      R[5][
        /*slot*/
        R[17].place - 1
      ].periodical_exp + "") && M(x, w);
    },
    d(R) {
      R && S(e), j && j.d(), N.d(), F.d();
    }
  };
}
function Kl(l) {
  let e;
  return {
    c() {
      e = d("div"), e.textContent = "Cargando clasificaciones...", a(e, "class", "loading svelte-1np7r3s");
    },
    m(t, s) {
      E(t, e, s);
    },
    d(t) {
      t && S(e);
    }
  };
}
function Nn(l) {
  let e, t, s, i, c, r, o, f, v, p, u, g, h = (
    /*rewardMode*/
    l[1] === "classic_top3" ? "Premios para Top 1, Top 2 y Top 3" : "Top 1 garantizado + 2 sorteos por umbrales"
  ), m, b, _, q = (
    /*scopeLabel*/
    l[3] && Yl(l)
  );
  function A(k, j) {
    return (
      /*rewardMode*/
      k[1] === "classic_top3" ? un : pn
    );
  }
  let w = A(l), x = w(l), L = (
    /*loading*/
    l[4] && Kl()
  );
  return {
    c() {
      e = d("section"), t = d("header"), s = d("div"), i = d("p"), i.textContent = "Podio temporada", c = y(), r = d("h2"), r.textContent = "Top Activos", o = y(), q && q.c(), f = y(), v = d("div"), p = d("span"), u = y(), g = d("span"), m = z(h), b = y(), x.c(), _ = y(), L && L.c(), a(i, "class", "eyebrow svelte-1np7r3s"), a(r, "class", "svelte-1np7r3s"), a(p, "class", "badge-icon svelte-1np7r3s"), a(p, "aria-hidden", "true"), a(v, "class", "badge svelte-1np7r3s"), a(t, "class", "podium-header svelte-1np7r3s"), a(e, "class", "podium-wrap svelte-1np7r3s"), a(
        e,
        "data-play",
        /*playId*/
        l[6]
      );
    },
    m(k, j) {
      E(k, e, j), n(e, t), n(t, s), n(s, i), n(s, c), n(s, r), n(s, o), q && q.m(s, null), n(t, f), n(t, v), n(v, p), n(v, u), n(v, g), n(g, m), n(e, b), x.m(e, null), n(e, _), L && L.m(e, null);
    },
    p(k, [j]) {
      /*scopeLabel*/
      k[3] ? q ? q.p(k, j) : (q = Yl(k), q.c(), q.m(s, null)) : q && (q.d(1), q = null), j & /*rewardMode*/
      2 && h !== (h = /*rewardMode*/
      k[1] === "classic_top3" ? "Premios para Top 1, Top 2 y Top 3" : "Top 1 garantizado + 2 sorteos por umbrales") && M(m, h), w === (w = A(k)) && x ? x.p(k, j) : (x.d(1), x = w(k), x && (x.c(), x.m(e, _))), /*loading*/
      k[4] ? L || (L = Kl(), L.c(), L.m(e, null)) : L && (L.d(1), L = null), j & /*playId*/
      64 && a(
        e,
        "data-play",
        /*playId*/
        k[6]
      );
    },
    i: X,
    o: X,
    d(k) {
      k && S(e), q && q.d(), x.d(), L && L.d();
    }
  };
}
function Pn(l, e, t) {
  let s, i, c, r, { users: o = [] } = e, { rewards: f = {} } = e, { rewardMode: v = "raffle_thresholds" } = e, { raffleThresholds: p = [] } = e, { userRaffleEntries: u = 0 } = e, { scopeLabel: g = "" } = e, { loading: h = !1 } = e;
  const m = {
    id: "placeholder",
    first_name: "Por definir",
    last_name: "",
    avatar_url: "",
    periodical_exp: 0
  }, b = (x) => Array.isArray(x) ? x : [], _ = () => (f == null ? void 0 : f.guaranteed_winner) || (f == null ? void 0 : f[1]) || (f == null ? void 0 : f["1"]), q = (x) => f == null ? void 0 : f[x];
  let A = 0, w = "";
  return l.$$set = (x) => {
    "users" in x && t(11, o = x.users), "rewards" in x && t(0, f = x.rewards), "rewardMode" in x && t(1, v = x.rewardMode), "raffleThresholds" in x && t(12, p = x.raffleThresholds), "userRaffleEntries" in x && t(2, u = x.userRaffleEntries), "scopeLabel" in x && t(3, g = x.scopeLabel), "loading" in x && t(4, h = x.loading);
  }, l.$$.update = () => {
    if (l.$$.dirty & /*users*/
    2048 && t(14, s = [...b(o)].slice(0, 1)), l.$$.dirty & /*podiumUsers*/
    16384)
      for (; s.length < 1; ) s.push(m);
    if (l.$$.dirty & /*users*/
    2048 && t(5, i = [...b(o)].slice(0, 3)), l.$$.dirty & /*classicUsers*/
    32)
      for (; i.length < 3; ) i.push(m);
    if (l.$$.dirty & /*raffleThresholds*/
    4096 && t(8, c = Array.isArray(p) ? p.filter((x) => x == null ? void 0 : x.active).sort((x, L) => ((x == null ? void 0 : x.min_points) ?? 0) - ((L == null ? void 0 : L.min_points) ?? 0)) : []), l.$$.dirty & /*podiumUsers*/
    16384 && t(7, r = s[0] || m), l.$$.dirty & /*users, rewards, raffleThresholds, rewardMode, userRaffleEntries, loading, scopeLabel, signature, playId*/
    14431) {
      const x = b(o).map((T) => (T == null ? void 0 : T.id) ?? "").join("|"), L = f ? Object.keys(f).sort().map((T) => {
        var P;
        return `${T}:${((P = f[T]) == null ? void 0 : P.title) ?? ""}`;
      }).join("|") : "", k = Array.isArray(p) ? p.map((T) => `${T.id ?? ""}:${T.min_points}:${T.entries_count}:${T.active}`).join("|") : "", j = `${x}-${v}-${L}-${k}-${u}-${h}-${g}`;
      j !== w && (t(13, w = j), t(6, A += 1));
    }
  }, [
    f,
    v,
    u,
    g,
    h,
    i,
    A,
    r,
    c,
    _,
    q,
    o,
    p,
    w,
    s
  ];
}
class Ss extends pe {
  constructor(e) {
    super(), fe(
      this,
      e,
      Pn,
      Nn,
      le,
      {
        users: 11,
        rewards: 0,
        rewardMode: 1,
        raffleThresholds: 12,
        userRaffleEntries: 2,
        scopeLabel: 3,
        loading: 4
      },
      dn
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
de(Ss, { users: {}, rewards: {}, rewardMode: {}, raffleThresholds: {}, userRaffleEntries: {}, scopeLabel: {}, loading: { type: "Boolean" } }, [], [], !0);
function Rn(l) {
  ce(l, "svelte-1p7vo7o", `.backdrop.svelte-1p7vo7o.svelte-1p7vo7o{position:fixed;inset:0;background:radial-gradient(circle at top left, rgba(239, 68, 68, 0.18), transparent 30%),
      rgba(15, 23, 42, 0.42);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;z-index:60;padding:24px}.card.svelte-1p7vo7o.svelte-1p7vo7o{width:min(760px, 100%);background:linear-gradient(180deg, rgba(255, 247, 247, 0.92), rgba(255, 255, 255, 0.98) 28%),
      #ffffff;border-radius:28px;border:1px solid rgba(226, 232, 240, 0.95);box-shadow:0 30px 90px rgba(15, 23, 42, 0.24);display:flex;flex-direction:column;gap:18px;padding:24px;box-sizing:border-box;max-height:calc(100vh - 48px);overflow:auto}.hero.svelte-1p7vo7o.svelte-1p7vo7o{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}.hero-copy.svelte-1p7vo7o.svelte-1p7vo7o{max-width:580px}.eyebrow.svelte-1p7vo7o.svelte-1p7vo7o{display:inline-flex;align-items:center;border-radius:999px;background:#fff1f2;color:#be123c;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:6px 10px;margin-bottom:10px}.title.svelte-1p7vo7o.svelte-1p7vo7o{font-size:20px;font-weight:800;margin:0;color:#0f172a}.hint.svelte-1p7vo7o.svelte-1p7vo7o{font-size:15px;line-height:1.45;margin:6px 0 0;color:#475569}.close.svelte-1p7vo7o.svelte-1p7vo7o{border:none;background:rgba(241, 245, 249, 0.96);color:#475569;width:42px;height:42px;border-radius:999px;cursor:pointer;font-size:24px}.body.svelte-1p7vo7o.svelte-1p7vo7o{display:grid;gap:14px}.field.svelte-1p7vo7o.svelte-1p7vo7o{display:grid;gap:10px}.field-head.svelte-1p7vo7o.svelte-1p7vo7o{display:flex;align-items:center;justify-content:space-between;gap:12px}.label.svelte-1p7vo7o.svelte-1p7vo7o{font-size:13px;font-weight:700;color:#334155}.caption.svelte-1p7vo7o.svelte-1p7vo7o{font-size:12px;color:#94a3b8}.caption.danger.svelte-1p7vo7o.svelte-1p7vo7o{color:#b91c1c}.select.svelte-1p7vo7o.svelte-1p7vo7o,.textarea.svelte-1p7vo7o.svelte-1p7vo7o{box-sizing:border-box;width:100%;border:1px solid #d7dee8;border-radius:18px;padding:14px 16px;font-size:15px;outline:none;background:rgba(255, 255, 255, 0.92);transition:border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease}.select.svelte-1p7vo7o.svelte-1p7vo7o:focus,.textarea.svelte-1p7vo7o.svelte-1p7vo7o:focus{border-color:#fb7185;box-shadow:0 0 0 4px rgba(251, 113, 133, 0.12)}.textarea.svelte-1p7vo7o.svelte-1p7vo7o{resize:vertical;min-height:120px;max-height:220px;line-height:1.5;font-family:inherit}.error.svelte-1p7vo7o.svelte-1p7vo7o{font-size:13px;color:#b91c1c;background:#fef2f2;border:1px solid #fecaca;padding:12px 14px;border-radius:14px}.success.svelte-1p7vo7o.svelte-1p7vo7o{font-size:13px;color:#047857;background:#ecfdf5;border:1px solid #a7f3d0;padding:12px 14px;border-radius:14px}.footer.svelte-1p7vo7o.svelte-1p7vo7o{display:flex;align-items:center;justify-content:space-between;gap:12px}.footer-left.svelte-1p7vo7o.svelte-1p7vo7o,.footer-right.svelte-1p7vo7o.svelte-1p7vo7o{display:flex;align-items:center;gap:10px}.ghost.svelte-1p7vo7o.svelte-1p7vo7o{border:1px solid #d7dee8;background:#ffffff;color:#475569;padding:11px 18px;border-radius:999px;cursor:pointer}.secondary.svelte-1p7vo7o.svelte-1p7vo7o{border:1px solid #fda4af;background:#fff1f2;color:#be123c;padding:11px 16px;border-radius:999px;cursor:pointer;font-weight:600}.primary.svelte-1p7vo7o.svelte-1p7vo7o{border:none;background:linear-gradient(135deg, #ef4444, #dc2626);color:#ffffff;padding:11px 18px;border-radius:999px;cursor:pointer;font-weight:700;box-shadow:0 12px 24px rgba(239, 68, 68, 0.28)}.primary.svelte-1p7vo7o.svelte-1p7vo7o:disabled{opacity:0.6;cursor:not-allowed;box-shadow:none}@media(max-width: 640px){.card.svelte-1p7vo7o.svelte-1p7vo7o{width:100%;padding:18px;border-radius:24px;max-height:calc(100vh - 24px)}.footer.svelte-1p7vo7o.svelte-1p7vo7o{flex-direction:column;align-items:stretch}.footer-left.svelte-1p7vo7o.svelte-1p7vo7o,.footer-right.svelte-1p7vo7o.svelte-1p7vo7o{width:100%;justify-content:stretch}.footer-left.svelte-1p7vo7o>button.svelte-1p7vo7o,.footer-right.svelte-1p7vo7o>button.svelte-1p7vo7o{flex:1 1 0}}`);
}
function Ql(l, e, t) {
  const s = l.slice();
  return s[23] = e[t], s;
}
function Wl(l) {
  let e, t, s, i, c, r, o, f, v, p, u, g, h, m, b, _, q, A, w, x, L, k, j, T, P, N, H = Math.max(
    /*message*/
    l[10].length,
    0
  ) + "", I, F, R, G, $, ve, ie, ne, J, U, _e, Z, Q, ee, B, K = (
    /*submitting*/
    l[2] ? "Enviando..." : "Enviar reporte"
  ), D, W, je, De, ye = te(
    /*categories*/
    l[1]
  ), oe = [];
  for (let V = 0; V < ye.length; V += 1)
    oe[V] = Zl(Ql(l, ye, V));
  let ge = (
    /*error*/
    l[3] && es(l)
  ), xe = (
    /*success*/
    l[4] && ts()
  ), re = (
    /*canViewInbox*/
    l[7] && ls(l)
  );
  return {
    c() {
      e = d("div"), t = d("div"), s = d("div"), i = d("div"), c = d("span"), c.textContent = "Soporte", r = y(), o = d("p"), f = z(
        /*title*/
        l[5]
      ), v = y(), p = d("p"), u = z(
        /*hint*/
        l[6]
      ), g = y(), h = d("button"), h.textContent = "×", m = y(), b = d("div"), _ = d("div"), q = d("div"), q.innerHTML = '<label class="label svelte-1p7vo7o" for="report-category">Categoría</label> <span class="caption svelte-1p7vo7o">Obligatorio</span>', A = y(), w = d("select"), x = d("option"), x.textContent = "Selecciona una categoria";
      for (let V = 0; V < oe.length; V += 1)
        oe[V].c();
      L = y(), k = d("div"), j = d("div"), T = d("label"), T.textContent = "Mensaje", P = y(), N = d("span"), I = z(H), F = z("/"), R = z(Mt), G = y(), $ = d("textarea"), ve = y(), ge && ge.c(), ie = y(), xe && xe.c(), ne = y(), J = d("div"), U = d("div"), re && re.c(), _e = y(), Z = d("div"), Q = d("button"), Q.textContent = "Cancelar", ee = y(), B = d("button"), D = z(K), a(c, "class", "eyebrow svelte-1p7vo7o"), a(o, "class", "title svelte-1p7vo7o"), a(p, "class", "hint svelte-1p7vo7o"), a(i, "class", "hero-copy svelte-1p7vo7o"), a(h, "class", "close svelte-1p7vo7o"), a(h, "type", "button"), a(s, "class", "hero svelte-1p7vo7o"), a(q, "class", "field-head svelte-1p7vo7o"), x.__value = "", Ne(x, x.__value), x.disabled = !0, a(w, "id", "report-category"), a(w, "class", "select svelte-1p7vo7o"), /*selected*/
      l[9] === void 0 && Se(() => (
        /*select_change_handler*/
        l[18].call(w)
      )), a(_, "class", "field svelte-1p7vo7o"), a(T, "class", "label svelte-1p7vo7o"), a(T, "for", "report-message"), a(N, "class", "caption svelte-1p7vo7o"), lt(
        N,
        "danger",
        /*remaining*/
        l[12] < 0
      ), a(j, "class", "field-head svelte-1p7vo7o"), a($, "id", "report-message"), a($, "class", "textarea svelte-1p7vo7o"), a($, "rows", "6"), a($, "maxlength", Mt), a($, "placeholder", "Ejemplo: al abrir notificaciones se queda cargando y no puedo volver atrás."), a(k, "class", "field svelte-1p7vo7o"), a(b, "class", "body svelte-1p7vo7o"), a(U, "class", "footer-left svelte-1p7vo7o"), a(Q, "class", "ghost svelte-1p7vo7o"), a(Q, "type", "button"), a(B, "class", "primary svelte-1p7vo7o"), a(B, "type", "button"), B.disabled = W = !/*canSubmit*/
      l[11], a(Z, "class", "footer-right svelte-1p7vo7o"), a(J, "class", "footer svelte-1p7vo7o"), a(t, "class", "card svelte-1p7vo7o"), a(t, "role", "dialog"), a(t, "aria-modal", "true"), a(e, "class", "backdrop svelte-1p7vo7o"), a(e, "role", "button"), a(e, "tabindex", "0");
    },
    m(V, he) {
      E(V, e, he), n(e, t), n(t, s), n(s, i), n(i, c), n(i, r), n(i, o), n(o, f), n(i, v), n(i, p), n(p, u), n(s, g), n(s, h), n(t, m), n(t, b), n(b, _), n(_, q), n(_, A), n(_, w), n(w, x);
      for (let se = 0; se < oe.length; se += 1)
        oe[se] && oe[se].m(w, null);
      al(
        w,
        /*selected*/
        l[9],
        !0
      ), n(b, L), n(b, k), n(k, j), n(j, T), n(j, P), n(j, N), n(N, I), n(N, F), n(N, R), n(k, G), n(k, $), Ne(
        $,
        /*message*/
        l[10]
      ), n(b, ve), ge && ge.m(b, null), n(b, ie), xe && xe.m(b, null), n(t, ne), n(t, J), n(J, U), re && re.m(U, null), n(J, _e), n(J, Z), n(Z, Q), n(Z, ee), n(Z, B), n(B, D), je || (De = [
        O(
          h,
          "click",
          /*close*/
          l[13]
        ),
        O(
          w,
          "change",
          /*select_change_handler*/
          l[18]
        ),
        O(
          $,
          "input",
          /*textarea_input_handler*/
          l[19]
        ),
        O(
          Q,
          "click",
          /*close*/
          l[13]
        ),
        O(
          B,
          "click",
          /*submit*/
          l[14]
        ),
        O(t, "click", Is(
          /*click_handler*/
          l[17]
        )),
        O(
          e,
          "click",
          /*close*/
          l[13]
        ),
        O(
          e,
          "keydown",
          /*keydown_handler*/
          l[20]
        )
      ], je = !0);
    },
    p(V, he) {
      if (he & /*title*/
      32 && M(
        f,
        /*title*/
        V[5]
      ), he & /*hint*/
      64 && M(
        u,
        /*hint*/
        V[6]
      ), he & /*categories*/
      2) {
        ye = te(
          /*categories*/
          V[1]
        );
        let se;
        for (se = 0; se < ye.length; se += 1) {
          const Oe = Ql(V, ye, se);
          oe[se] ? oe[se].p(Oe, he) : (oe[se] = Zl(Oe), oe[se].c(), oe[se].m(w, null));
        }
        for (; se < oe.length; se += 1)
          oe[se].d(1);
        oe.length = ye.length;
      }
      he & /*selected, categories*/
      514 && al(
        w,
        /*selected*/
        V[9]
      ), he & /*message*/
      1024 && H !== (H = Math.max(
        /*message*/
        V[10].length,
        0
      ) + "") && M(I, H), he & /*remaining*/
      4096 && lt(
        N,
        "danger",
        /*remaining*/
        V[12] < 0
      ), he & /*message*/
      1024 && Ne(
        $,
        /*message*/
        V[10]
      ), /*error*/
      V[3] ? ge ? ge.p(V, he) : (ge = es(V), ge.c(), ge.m(b, ie)) : ge && (ge.d(1), ge = null), /*success*/
      V[4] ? xe || (xe = ts(), xe.c(), xe.m(b, null)) : xe && (xe.d(1), xe = null), /*canViewInbox*/
      V[7] ? re ? re.p(V, he) : (re = ls(V), re.c(), re.m(U, null)) : re && (re.d(1), re = null), he & /*submitting*/
      4 && K !== (K = /*submitting*/
      V[2] ? "Enviando..." : "Enviar reporte") && M(D, K), he & /*canSubmit*/
      2048 && W !== (W = !/*canSubmit*/
      V[11]) && (B.disabled = W);
    },
    d(V) {
      V && S(e), Ie(oe, V), ge && ge.d(), xe && xe.d(), re && re.d(), je = !1, me(De);
    }
  };
}
function Zl(l) {
  let e, t = (
    /*cat*/
    l[23] + ""
  ), s, i;
  return {
    c() {
      e = d("option"), s = z(t), e.__value = i = /*cat*/
      l[23], Ne(e, e.__value);
    },
    m(c, r) {
      E(c, e, r), n(e, s);
    },
    p(c, r) {
      r & /*categories*/
      2 && t !== (t = /*cat*/
      c[23] + "") && M(s, t), r & /*categories*/
      2 && i !== (i = /*cat*/
      c[23]) && (e.__value = i, Ne(e, e.__value));
    },
    d(c) {
      c && S(e);
    }
  };
}
function es(l) {
  let e, t;
  return {
    c() {
      e = d("div"), t = z(
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
      s && S(e);
    }
  };
}
function ts(l) {
  let e;
  return {
    c() {
      e = d("div"), e.textContent = "Reporte enviado. ¡Gracias!", a(e, "class", "success svelte-1p7vo7o");
    },
    m(t, s) {
      E(t, e, s);
    },
    d(t) {
      t && S(e);
    }
  };
}
function ls(l) {
  let e, t, s, i;
  return {
    c() {
      e = d("button"), t = z(
        /*inboxLabel*/
        l[8]
      ), a(e, "class", "secondary svelte-1p7vo7o"), a(e, "type", "button");
    },
    m(c, r) {
      E(c, e, r), n(e, t), s || (i = O(
        e,
        "click",
        /*openInbox*/
        l[15]
      ), s = !0);
    },
    p(c, r) {
      r & /*inboxLabel*/
      256 && M(
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
function In(l) {
  let e, t = (
    /*open*/
    l[0] && Wl(l)
  );
  return {
    c() {
      t && t.c(), e = Be();
    },
    m(s, i) {
      t && t.m(s, i), E(s, e, i);
    },
    p(s, [i]) {
      /*open*/
      s[0] ? t ? t.p(s, i) : (t = Wl(s), t.c(), t.m(e.parentNode, e)) : t && (t.d(1), t = null);
    },
    i: X,
    o: X,
    d(s) {
      s && S(e), t && t.d(s);
    }
  };
}
const Dn = 5, Mt = 1e3;
function Xn(l, e, t) {
  let s, i, c, { open: r = !1 } = e, { categories: o = [] } = e, { submitting: f = !1 } = e, { error: v = "" } = e, { success: p = !1 } = e, { title: u = "Reportar un problema" } = e, { hint: g = "Cuéntanos qué ha ocurrido para poder ayudarte." } = e, { canViewInbox: h = !1 } = e, { inboxLabel: m = "Abrir buzón de reports" } = e, b = "", _ = "";
  const q = Ae(), A = () => {
    t(9, b = ""), t(10, _ = "");
  }, w = () => {
    q("close");
  }, x = () => {
    c && q("submit", { category: b, message: _ });
  }, L = () => {
    q("inboxclick");
  };
  function k(N) {
    Us.call(this, l, N);
  }
  function j() {
    b = Xs(this), t(9, b), t(1, o);
  }
  function T() {
    _ = this.value, t(10, _);
  }
  const P = (N) => N.key === "Escape" && w();
  return l.$$set = (N) => {
    "open" in N && t(0, r = N.open), "categories" in N && t(1, o = N.categories), "submitting" in N && t(2, f = N.submitting), "error" in N && t(3, v = N.error), "success" in N && t(4, p = N.success), "title" in N && t(5, u = N.title), "hint" in N && t(6, g = N.hint), "canViewInbox" in N && t(7, h = N.canViewInbox), "inboxLabel" in N && t(8, m = N.inboxLabel);
  }, l.$$.update = () => {
    l.$$.dirty & /*message*/
    1024 && t(16, s = _.trim()), l.$$.dirty & /*message*/
    1024 && t(12, i = Mt - _.length), l.$$.dirty & /*selected, trimmedMessage, submitting*/
    66052 && t(11, c = !!b && s.length >= Dn && !f), l.$$.dirty & /*success*/
    16 && p && A();
  }, [
    r,
    o,
    f,
    v,
    p,
    u,
    g,
    h,
    m,
    b,
    _,
    c,
    i,
    w,
    x,
    L,
    s,
    k,
    j,
    T,
    P
  ];
}
class Ls extends pe {
  constructor(e) {
    super(), fe(
      this,
      e,
      Xn,
      In,
      le,
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
      Rn
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
}
de(Ls, { open: { type: "Boolean" }, categories: {}, submitting: { type: "Boolean" }, error: {}, success: { type: "Boolean" }, title: {}, hint: {}, canViewInbox: { type: "Boolean" }, inboxLabel: {} }, [], [], !0);
function Yn(l) {
  ce(l, "svelte-1qhrdq8", ".overlay.svelte-1qhrdq8{position:fixed;inset:0;z-index:80;display:flex;align-items:center;justify-content:center;padding:24px;background:radial-gradient(circle at top, rgba(59, 130, 246, 0.14), rgba(0, 0, 0, 0.58));backdrop-filter:blur(10px)}.card.svelte-1qhrdq8{width:min(560px, 92vw);border-radius:28px;padding:28px 26px 24px;background:linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);box-shadow:0 24px 60px rgba(15, 23, 42, 0.24), 0 10px 28px rgba(15, 23, 42, 0.12);border:1px solid rgba(226, 232, 240, 0.9)}.eyebrow.svelte-1qhrdq8{display:inline-flex;align-items:center;padding:6px 12px;border-radius:999px;background:rgba(16, 185, 129, 0.12);color:#047857;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase}h2.svelte-1qhrdq8{margin:14px 0 8px;font-size:24px;font-weight:700;color:#0f172a}p.svelte-1qhrdq8{margin:0;font-size:15px;line-height:1.7;color:#475569;white-space:pre-wrap}.actions.svelte-1qhrdq8{margin-top:20px;display:flex;justify-content:flex-end}button.svelte-1qhrdq8{border:none;border-radius:14px;padding:10px 18px;font-size:14px;font-weight:600;color:#ffffff;background:linear-gradient(135deg, #059669, #047857);box-shadow:0 12px 24px rgba(5, 150, 105, 0.24);cursor:pointer}");
}
function ss(l) {
  let e, t, s, i, c, r, o, f, v, p, u, g, h, m, b, _, q, A;
  return {
    c() {
      e = d("div"), t = d("div"), s = d("div"), s.textContent = "Aviso", i = y(), c = d("h2"), r = z(
        /*title*/
        l[1]
      ), o = y(), f = d("p"), v = z(
        /*message*/
        l[2]
      ), p = y(), u = d("div"), g = d("button"), h = z(
        /*cta*/
        l[3]
      ), a(s, "class", "eyebrow svelte-1qhrdq8"), a(c, "class", "svelte-1qhrdq8"), a(f, "class", "svelte-1qhrdq8"), a(g, "type", "button"), a(g, "class", "svelte-1qhrdq8"), a(u, "class", "actions svelte-1qhrdq8"), a(t, "class", "card svelte-1qhrdq8"), a(e, "class", "overlay svelte-1qhrdq8"), a(e, "role", "button"), a(e, "tabindex", "0"), a(e, "aria-label", "Cerrar aviso");
    },
    m(w, x) {
      E(w, e, x), n(e, t), n(t, s), n(t, i), n(t, c), n(c, r), n(t, o), n(t, f), n(f, v), n(t, p), n(t, u), n(u, g), n(g, h), _ = !0, q || (A = [
        O(
          g,
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
    p(w, x) {
      (!_ || x & /*title*/
      2) && M(
        r,
        /*title*/
        w[1]
      ), (!_ || x & /*message*/
      4) && M(
        v,
        /*message*/
        w[2]
      ), (!_ || x & /*cta*/
      8) && M(
        h,
        /*cta*/
        w[3]
      );
    },
    i(w) {
      _ || (w && Se(() => {
        _ && (m || (m = qe(t, Ye, { y: 18, duration: 240 }, !0)), m.run(1));
      }), w && Se(() => {
        _ && (b || (b = qe(e, xt, { duration: 180 }, !0)), b.run(1));
      }), _ = !0);
    },
    o(w) {
      w && (m || (m = qe(t, Ye, { y: 18, duration: 240 }, !1)), m.run(0)), w && (b || (b = qe(e, xt, { duration: 180 }, !1)), b.run(0)), _ = !1;
    },
    d(w) {
      w && S(e), w && m && m.end(), w && b && b.end(), q = !1, me(A);
    }
  };
}
function Bn(l) {
  let e, t = (
    /*open*/
    l[0] && ss(l)
  );
  return {
    c() {
      t && t.c(), e = Be();
    },
    m(s, i) {
      t && t.m(s, i), E(s, e, i);
    },
    p(s, [i]) {
      /*open*/
      s[0] ? t ? (t.p(s, i), i & /*open*/
      1 && Re(t, 1)) : (t = ss(s), t.c(), Re(t, 1), t.m(e.parentNode, e)) : t && (Rt(), ot(t, 1, 1, () => {
        t = null;
      }), It());
    },
    i(s) {
      Re(t);
    },
    o(s) {
      ot(t);
    },
    d(s) {
      s && S(e), t && t.d(s);
    }
  };
}
function On(l, e, t) {
  let { open: s = !1 } = e, { title: i = "Aviso" } = e, { message: c = "" } = e, { cta: r = "Entendido" } = e;
  const o = Ae(), f = () => {
    t(0, s = !1), o("dismiss");
  }, v = (u) => {
    u.target === u.currentTarget && f();
  }, p = (u) => {
    (u.key === "Escape" || u.key === "Enter" || u.key === " ") && f();
  };
  return l.$$set = (u) => {
    "open" in u && t(0, s = u.open), "title" in u && t(1, i = u.title), "message" in u && t(2, c = u.message), "cta" in u && t(3, r = u.cta);
  }, [s, i, c, r, f, v, p];
}
class Ts extends pe {
  constructor(e) {
    super(), fe(this, e, On, Bn, le, { open: 0, title: 1, message: 2, cta: 3 }, Yn);
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
customElements.define("svelte-announcement-popup", de(Ts, { open: { type: "Boolean" }, title: {}, message: {}, cta: {} }, [], [], !0));
const ue = (l, e) => {
  const t = e.element;
  customElements.get(l) || customElements.define(l, t ?? e);
};
ue("svelte-counter", ps);
ue("svelte-orbit-card", us);
ue("svelte-pulse-badge", vs);
ue("svelte-ripple-button", gs);
ue("svelte-stagger-list", hs);
ue("svelte-thermometer", bs);
ue("svelte-podium", ms);
ue("svelte-balloon-gift", _s);
ue("svelte-achievement-card", xs);
ue("svelte-parallax-card", ys);
ue("svelte-flip-counter", ws);
ue("svelte-parallax-stack", ks);
ue("svelte-video-card", zs);
ue("svelte-season-popup", qs);
ue("svelte-quota-token", js);
ue("svelte-user-stats-panel", Cs);
ue("svelte-rewards-podium", Ss);
ue("svelte-error-report-modal", Ls);
ue("svelte-announcement-popup", Ts);
