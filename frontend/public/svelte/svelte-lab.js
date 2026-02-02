var Ct = Object.defineProperty;
var jt = (t, e, s) => e in t ? Ct(t, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : t[e] = s;
var G = (t, e, s) => jt(t, typeof e != "symbol" ? e + "" : e, s);
function L() {
}
const nt = (t) => t;
function rt(t) {
  return t();
}
function Ye() {
  return /* @__PURE__ */ Object.create(null);
}
function H(t) {
  t.forEach(rt);
}
function Le(t) {
  return typeof t == "function";
}
function X(t, e) {
  return t != t ? e == e : t !== e || t && typeof t == "object" || typeof t == "function";
}
let ke;
function Ne(t, e) {
  return t === e ? !0 : (ke || (ke = document.createElement("a")), ke.href = e, t === ke.href);
}
function St(t) {
  return Object.keys(t).length === 0;
}
function $e(t) {
  return t ?? "";
}
function Te(t) {
  const e = typeof t == "string" && t.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);
  return e ? [parseFloat(e[1]), e[2] || "px"] : [
    /** @type {number} */
    t,
    "px"
  ];
}
const at = typeof window < "u";
let Et = at ? () => window.performance.now() : () => Date.now(), Me = at ? (t) => requestAnimationFrame(t) : L;
const ue = /* @__PURE__ */ new Set();
function ot(t) {
  ue.forEach((e) => {
    e.c(t) || (ue.delete(e), e.f());
  }), ue.size !== 0 && Me(ot);
}
function Lt(t) {
  let e;
  return ue.size === 0 && Me(ot), {
    promise: new Promise((s) => {
      ue.add(e = { c: t, f: s });
    }),
    abort() {
      ue.delete(e);
    }
  };
}
function a(t, e) {
  t.appendChild(e);
}
function V(t, e, s) {
  const l = Ae(t);
  if (!l.getElementById(e)) {
    const i = b("style");
    i.id = e, i.textContent = s, ct(l, i);
  }
}
function Ae(t) {
  if (!t) return document;
  const e = t.getRootNode ? t.getRootNode() : t.ownerDocument;
  return e && /** @type {ShadowRoot} */
  e.host ? (
    /** @type {ShadowRoot} */
    e
  ) : t.ownerDocument;
}
function Mt(t) {
  const e = b("style");
  return e.textContent = "/* empty */", ct(Ae(t), e), e.sheet;
}
function ct(t, e) {
  return a(
    /** @type {Document} */
    t.head || t,
    e
  ), e.sheet;
}
function I(t, e, s) {
  t.insertBefore(e, s || null);
}
function A(t) {
  t.parentNode && t.parentNode.removeChild(t);
}
function b(t) {
  return document.createElement(t);
}
function Xe(t) {
  return document.createElementNS("http://www.w3.org/2000/svg", t);
}
function q(t) {
  return document.createTextNode(t);
}
function z() {
  return q(" ");
}
function At() {
  return q("");
}
function N(t, e, s, l) {
  return t.addEventListener(e, s, l), () => t.removeEventListener(e, s, l);
}
function f(t, e, s) {
  s == null ? t.removeAttribute(e) : t.getAttribute(e) !== s && t.setAttribute(e, s);
}
function Rt(t) {
  return Array.from(t.childNodes);
}
function E(t, e) {
  e = "" + e, t.data !== e && (t.data = /** @type {string} */
  e);
}
function ft(t, e, { bubbles: s = !1, cancelable: l = !1 } = {}) {
  return new CustomEvent(t, { detail: e, bubbles: s, cancelable: l });
}
function It(t) {
  const e = {};
  return t.childNodes.forEach(
    /** @param {Element} node */
    (s) => {
      e[s.slot || "default"] = !0;
    }
  ), e;
}
const ze = /* @__PURE__ */ new Map();
let Ce = 0;
function Yt(t) {
  let e = 5381, s = t.length;
  for (; s--; ) e = (e << 5) - e ^ t.charCodeAt(s);
  return e >>> 0;
}
function Nt(t, e) {
  const s = { stylesheet: Mt(e), rules: {} };
  return ze.set(t, s), s;
}
function Pe(t, e, s, l, i, c, r, n = 0) {
  const o = 16.666 / l;
  let v = `{
`;
  for (let y = 0; y <= 1; y += o) {
    const j = e + (s - e) * c(y);
    v += y * 100 + `%{${r(j, 1 - j)}}
`;
  }
  const u = v + `100% {${r(s, 1 - s)}}
}`, h = `__svelte_${Yt(u)}_${n}`, d = Ae(t), { stylesheet: g, rules: p } = ze.get(d) || Nt(d, t);
  p[h] || (p[h] = !0, g.insertRule(`@keyframes ${h} ${u}`, g.cssRules.length));
  const m = t.style.animation || "";
  return t.style.animation = `${m ? `${m}, ` : ""}${h} ${l}ms linear ${i}ms 1 both`, Ce += 1, h;
}
function Tt(t, e) {
  const s = (t.style.animation || "").split(", "), l = s.filter(
    e ? (c) => c.indexOf(e) < 0 : (c) => c.indexOf("__svelte") === -1
    // remove all Svelte animations
  ), i = s.length - l.length;
  i && (t.style.animation = l.join(", "), Ce -= i, Ce || Xt());
}
function Xt() {
  Me(() => {
    Ce || (ze.forEach((t) => {
      const { ownerNode: e } = t.stylesheet;
      e && A(e);
    }), ze.clear());
  });
}
let ye;
function be(t) {
  ye = t;
}
function dt() {
  if (!ye) throw new Error("Function called outside component initialization");
  return ye;
}
function Pt(t) {
  dt().$$.on_mount.push(t);
}
function oe() {
  const t = dt();
  return (e, s, { cancelable: l = !1 } = {}) => {
    const i = t.$$.callbacks[e];
    if (i) {
      const c = ft(
        /** @type {string} */
        e,
        s,
        { cancelable: l }
      );
      return i.slice().forEach((r) => {
        r.call(t, c);
      }), !c.defaultPrevented;
    }
    return !0;
  };
}
const de = [], Be = [];
let ge = [];
const Oe = [], Bt = /* @__PURE__ */ Promise.resolve();
let Ee = !1;
function Ot() {
  Ee || (Ee = !0, Bt.then(k));
}
function ve(t) {
  ge.push(t);
}
const je = /* @__PURE__ */ new Set();
let fe = 0;
function k() {
  if (fe !== 0)
    return;
  const t = ye;
  do {
    try {
      for (; fe < de.length; ) {
        const e = de[fe];
        fe++, be(e), Dt(e.$$);
      }
    } catch (e) {
      throw de.length = 0, fe = 0, e;
    }
    for (be(null), de.length = 0, fe = 0; Be.length; ) Be.pop()();
    for (let e = 0; e < ge.length; e += 1) {
      const s = ge[e];
      je.has(s) || (je.add(s), s());
    }
    ge.length = 0;
  } while (de.length);
  for (; Oe.length; )
    Oe.pop()();
  Ee = !1, je.clear(), be(t);
}
function Dt(t) {
  if (t.fragment !== null) {
    t.update(), H(t.before_update);
    const e = t.dirty;
    t.dirty = [-1], t.fragment && t.fragment.p(t.ctx, e), t.after_update.forEach(ve);
  }
}
function Ft(t) {
  const e = [], s = [];
  ge.forEach((l) => t.indexOf(l) === -1 ? e.push(l) : s.push(l)), s.forEach((l) => l()), ge = e;
}
let he;
function Ht() {
  return he || (he = Promise.resolve(), he.then(() => {
    he = null;
  })), he;
}
function Se(t, e, s) {
  t.dispatchEvent(ft(`${e ? "intro" : "outro"}${s}`));
}
const we = /* @__PURE__ */ new Set();
let te;
function Vt() {
  te = {
    r: 0,
    c: [],
    p: te
    // parent group
  };
}
function Ut() {
  te.r || H(te.c), te = te.p;
}
function me(t, e) {
  t && t.i && (we.delete(t), t.i(e));
}
function De(t, e, s, l) {
  if (t && t.o) {
    if (we.has(t)) return;
    we.add(t), te.c.push(() => {
      we.delete(t), l && (s && t.d(1), l());
    }), t.o(e);
  } else l && l();
}
const Jt = { duration: 0 };
function _e(t, e, s, l) {
  let c = e(t, s, { direction: "both" }), r = l ? 0 : 1, n = null, o = null, v = null, u;
  function h() {
    v && Tt(t, v);
  }
  function d(p, m) {
    const y = (
      /** @type {Program['d']} */
      p.b - r
    );
    return m *= Math.abs(y), {
      a: r,
      b: p.b,
      d: y,
      duration: m,
      start: p.start,
      end: p.start + m,
      group: p.group
    };
  }
  function g(p) {
    const {
      delay: m = 0,
      duration: y = 300,
      easing: j = nt,
      tick: $ = L,
      css: x
    } = c || Jt, w = {
      start: Et() + m,
      b: p
    };
    p || (w.group = te, te.r += 1), "inert" in t && (p ? u !== void 0 && (t.inert = u) : (u = /** @type {HTMLElement} */
    t.inert, t.inert = !0)), n || o ? o = w : (x && (h(), v = Pe(t, r, p, y, m, j, x)), p && $(0, 1), n = d(w, y), ve(() => Se(t, p, "start")), Lt((S) => {
      if (o && S > o.start && (n = d(o, y), o = null, Se(t, n.b, "start"), x && (h(), v = Pe(
        t,
        r,
        n.b,
        n.duration,
        0,
        j,
        c.css
      ))), n) {
        if (S >= n.end)
          $(r = n.b, 1 - r), Se(t, n.b, "end"), o || (n.b ? h() : --n.group.r || H(n.group.c)), n = null;
        else if (S >= n.start) {
          const _ = S - n.start;
          r = n.a + n.d * j(_ / n.duration), $(r, 1 - r);
        }
      }
      return !!(n || o);
    }));
  }
  return {
    run(p) {
      Le(c) ? Ht().then(() => {
        c = c({ direction: p ? "in" : "out" }), g(p);
      }) : g(p);
    },
    end() {
      h(), n = o = null;
    }
  };
}
function pe(t) {
  return (t == null ? void 0 : t.length) !== void 0 ? t : Array.from(t);
}
function Re(t, e) {
  t.d(1), e.delete(t.key);
}
function Ie(t, e, s, l, i, c, r, n, o, v, u, h) {
  let d = t.length, g = c.length, p = d;
  const m = {};
  for (; p--; ) m[t[p].key] = p;
  const y = [], j = /* @__PURE__ */ new Map(), $ = /* @__PURE__ */ new Map(), x = [];
  for (p = g; p--; ) {
    const C = h(i, c, p), M = s(C);
    let Y = r.get(M);
    Y ? x.push(() => Y.p(C, e)) : (Y = v(M, C), Y.c()), j.set(M, y[p] = Y), M in m && $.set(M, Math.abs(p - m[M]));
  }
  const w = /* @__PURE__ */ new Set(), S = /* @__PURE__ */ new Set();
  function _(C) {
    me(C, 1), C.m(n, u), r.set(C.key, C), u = C.first, g--;
  }
  for (; d && g; ) {
    const C = y[g - 1], M = t[d - 1], Y = C.key, B = M.key;
    C === M ? (u = C.first, d--, g--) : j.has(B) ? !r.has(Y) || w.has(Y) ? _(C) : S.has(B) ? d-- : $.get(Y) > $.get(B) ? (S.add(Y), _(C)) : (w.add(B), d--) : (o(M, r), d--);
  }
  for (; d--; ) {
    const C = t[d];
    j.has(C.key) || o(C, r);
  }
  for (; g; ) _(y[g - 1]);
  return H(x), y;
}
function Kt(t, e, s) {
  const { fragment: l, after_update: i } = t.$$;
  l && l.m(e, s), ve(() => {
    const c = t.$$.on_mount.map(rt).filter(Le);
    t.$$.on_destroy ? t.$$.on_destroy.push(...c) : H(c), t.$$.on_mount = [];
  }), i.forEach(ve);
}
function Qt(t, e) {
  const s = t.$$;
  s.fragment !== null && (Ft(s.after_update), H(s.on_destroy), s.fragment && s.fragment.d(e), s.on_destroy = s.fragment = null, s.ctx = []);
}
function Gt(t, e) {
  t.$$.dirty[0] === -1 && (de.push(t), Ot(), t.$$.dirty.fill(0)), t.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function U(t, e, s, l, i, c, r = null, n = [-1]) {
  const o = ye;
  be(t);
  const v = t.$$ = {
    fragment: null,
    ctx: [],
    // state
    props: c,
    update: L,
    not_equal: i,
    bound: Ye(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(e.context || (o ? o.$$.context : [])),
    // everything else
    callbacks: Ye(),
    dirty: n,
    skip_bound: !1,
    root: e.target || o.$$.root
  };
  r && r(v.root);
  let u = !1;
  if (v.ctx = s ? s(t, e.props || {}, (h, d, ...g) => {
    const p = g.length ? g[0] : d;
    return v.ctx && i(v.ctx[h], v.ctx[h] = p) && (!v.skip_bound && v.bound[h] && v.bound[h](p), u && Gt(t, h)), d;
  }) : [], v.update(), u = !0, H(v.before_update), v.fragment = l ? l(v.ctx) : !1, e.target) {
    if (e.hydrate) {
      const h = Rt(e.target);
      v.fragment && v.fragment.l(h), h.forEach(A);
    } else
      v.fragment && v.fragment.c();
    e.intro && me(t.$$.fragment), Kt(t, e.target, e.anchor), k();
  }
  be(o);
}
let ut;
typeof HTMLElement == "function" && (ut = class extends HTMLElement {
  constructor(e, s, l) {
    super();
    /** The Svelte component constructor */
    G(this, "$$ctor");
    /** Slots */
    G(this, "$$s");
    /** The Svelte component instance */
    G(this, "$$c");
    /** Whether or not the custom element is connected */
    G(this, "$$cn", !1);
    /** Component props data */
    G(this, "$$d", {});
    /** `true` if currently in the process of reflecting component props back to attributes */
    G(this, "$$r", !1);
    /** @type {Record<string, CustomElementPropDefinition>} Props definition (name, reflected, type etc) */
    G(this, "$$p_d", {});
    /** @type {Record<string, Function[]>} Event listeners */
    G(this, "$$l", {});
    /** @type {Map<Function, Function>} Event listener unsubscribe functions */
    G(this, "$$l_u", /* @__PURE__ */ new Map());
    this.$$ctor = e, this.$$s = s, l && this.attachShadow({ mode: "open" });
  }
  addEventListener(e, s, l) {
    if (this.$$l[e] = this.$$l[e] || [], this.$$l[e].push(s), this.$$c) {
      const i = this.$$c.$on(e, s);
      this.$$l_u.set(s, i);
    }
    super.addEventListener(e, s, l);
  }
  removeEventListener(e, s, l) {
    if (super.removeEventListener(e, s, l), this.$$c) {
      const i = this.$$l_u.get(s);
      i && (i(), this.$$l_u.delete(s));
    }
    if (this.$$l[e]) {
      const i = this.$$l[e].indexOf(s);
      i >= 0 && this.$$l[e].splice(i, 1);
    }
  }
  async connectedCallback() {
    if (this.$$cn = !0, !this.$$c) {
      let s = function(r) {
        return () => {
          let n;
          return {
            c: function() {
              n = b("slot"), r !== "default" && f(n, "name", r);
            },
            /**
             * @param {HTMLElement} target
             * @param {HTMLElement} [anchor]
             */
            m: function(u, h) {
              I(u, n, h);
            },
            d: function(u) {
              u && A(n);
            }
          };
        };
      };
      var e = s;
      if (await Promise.resolve(), !this.$$cn || this.$$c)
        return;
      const l = {}, i = It(this);
      for (const r of this.$$s)
        r in i && (l[r] = [s(r)]);
      for (const r of this.attributes) {
        const n = this.$$g_p(r.name);
        n in this.$$d || (this.$$d[n] = qe(n, r.value, this.$$p_d, "toProp"));
      }
      for (const r in this.$$p_d)
        !(r in this.$$d) && this[r] !== void 0 && (this.$$d[r] = this[r], delete this[r]);
      this.$$c = new this.$$ctor({
        target: this.shadowRoot || this,
        props: {
          ...this.$$d,
          $$slots: l,
          $$scope: {
            ctx: []
          }
        }
      });
      const c = () => {
        this.$$r = !0;
        for (const r in this.$$p_d)
          if (this.$$d[r] = this.$$c.$$.ctx[this.$$c.$$.props[r]], this.$$p_d[r].reflect) {
            const n = qe(
              r,
              this.$$d[r],
              this.$$p_d,
              "toAttribute"
            );
            n == null ? this.removeAttribute(this.$$p_d[r].attribute || r) : this.setAttribute(this.$$p_d[r].attribute || r, n);
          }
        this.$$r = !1;
      };
      this.$$c.$$.after_update.push(c), c();
      for (const r in this.$$l)
        for (const n of this.$$l[r]) {
          const o = this.$$c.$on(r, n);
          this.$$l_u.set(n, o);
        }
      this.$$l = {};
    }
  }
  // We don't need this when working within Svelte code, but for compatibility of people using this outside of Svelte
  // and setting attributes through setAttribute etc, this is helpful
  attributeChangedCallback(e, s, l) {
    var i;
    this.$$r || (e = this.$$g_p(e), this.$$d[e] = qe(e, l, this.$$p_d, "toProp"), (i = this.$$c) == null || i.$set({ [e]: this.$$d[e] }));
  }
  disconnectedCallback() {
    this.$$cn = !1, Promise.resolve().then(() => {
      !this.$$cn && this.$$c && (this.$$c.$destroy(), this.$$c = void 0);
    });
  }
  $$g_p(e) {
    return Object.keys(this.$$p_d).find(
      (s) => this.$$p_d[s].attribute === e || !this.$$p_d[s].attribute && s.toLowerCase() === e
    ) || e;
  }
});
function qe(t, e, s, l) {
  var c;
  const i = (c = s[t]) == null ? void 0 : c.type;
  if (e = i === "Boolean" && typeof e != "boolean" ? e != null : e, !l || !s[t])
    return e;
  if (l === "toAttribute")
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
function J(t, e, s, l, i, c) {
  let r = class extends ut {
    constructor() {
      super(t, s, i), this.$$p_d = e;
    }
    static get observedAttributes() {
      return Object.keys(e).map(
        (n) => (e[n].attribute || n).toLowerCase()
      );
    }
  };
  return Object.keys(e).forEach((n) => {
    Object.defineProperty(r.prototype, n, {
      get() {
        return this.$$c && n in this.$$c ? this.$$c[n] : this.$$d[n];
      },
      set(o) {
        var v;
        o = qe(n, o, e), this.$$d[n] = o, (v = this.$$c) == null || v.$set({ [n]: o });
      }
    });
  }), l.forEach((n) => {
    Object.defineProperty(r.prototype, n, {
      get() {
        var o;
        return (o = this.$$c) == null ? void 0 : o[n];
      }
    });
  }), t.element = /** @type {any} */
  r, r;
}
class K {
  constructor() {
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    G(this, "$$");
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    G(this, "$$set");
  }
  /** @returns {void} */
  $destroy() {
    Qt(this, 1), this.$destroy = L;
  }
  /**
   * @template {Extract<keyof Events, string>} K
   * @param {K} type
   * @param {((e: Events[K]) => void) | null | undefined} callback
   * @returns {() => void}
   */
  $on(e, s) {
    if (!Le(s))
      return L;
    const l = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
    return l.push(s), () => {
      const i = l.indexOf(s);
      i !== -1 && l.splice(i, 1);
    };
  }
  /**
   * @param {Partial<Props>} props
   * @returns {void}
   */
  $set(e) {
    this.$$set && !St(e) && (this.$$.skip_bound = !0, this.$$set(e), this.$$.skip_bound = !1);
  }
}
const Wt = "4";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(Wt);
function Zt(t) {
  V(t, "svelte-1tevv97", '.card.svelte-1tevv97{border-radius:14px;border:1px solid #e2e8f0;padding:16px;display:grid;gap:12px;font-family:"Figtree", system-ui, sans-serif;background:#ffffff;box-shadow:0 12px 24px rgba(15, 23, 42, 0.08)}.label.svelte-1tevv97{font-size:14px;color:#0f172a;margin:0}.count.svelte-1tevv97{font-weight:600;font-size:20px;color:#0f172a;margin:0}button.svelte-1tevv97{border:0;border-radius:10px;padding:10px 12px;background:#10b981;color:white;cursor:pointer;font-weight:600}button.svelte-1tevv97:hover{background:#059669}');
}
function es(t) {
  let e, s, l, i, c, r, n, o, v, u, h, d;
  return {
    c() {
      e = b("div"), s = b("p"), l = q("Hola "), i = q(
        /*name*/
        t[0]
      ), c = z(), r = b("p"), n = q("Count: "), o = q(
        /*count*/
        t[1]
      ), v = z(), u = b("button"), u.textContent = "Emitir evento", f(s, "class", "label svelte-1tevv97"), f(r, "class", "count svelte-1tevv97"), f(u, "type", "button"), f(u, "class", "svelte-1tevv97"), f(e, "class", "card svelte-1tevv97");
    },
    m(g, p) {
      I(g, e, p), a(e, s), a(s, l), a(s, i), a(e, c), a(e, r), a(r, n), a(r, o), a(e, v), a(e, u), h || (d = N(
        u,
        "click",
        /*notify*/
        t[2]
      ), h = !0);
    },
    p(g, [p]) {
      p & /*name*/
      1 && E(
        i,
        /*name*/
        g[0]
      ), p & /*count*/
      2 && E(
        o,
        /*count*/
        g[1]
      );
    },
    i: L,
    o: L,
    d(g) {
      g && A(e), h = !1, d();
    }
  };
}
function ts(t, e, s) {
  let { name: l = "Ada" } = e, { count: i = 2 } = e;
  const c = oe(), r = () => {
    c("ping", { from: "svelte", count: i });
  };
  return t.$$set = (n) => {
    "name" in n && s(0, l = n.name), "count" in n && s(1, i = n.count);
  }, [l, i, r];
}
class gt extends K {
  constructor(e) {
    super(), U(this, e, ts, es, X, { name: 0, count: 1 }, Zt);
  }
  get name() {
    return this.$$.ctx[0];
  }
  set name(e) {
    this.$$set({ name: e }), k();
  }
  get count() {
    return this.$$.ctx[1];
  }
  set count(e) {
    this.$$set({ count: e }), k();
  }
}
J(gt, { name: {}, count: {} }, [], [], !0);
function ss(t) {
  V(t, "svelte-5733sx", ".card.svelte-5733sx{position:relative;overflow:hidden;border-radius:20px;border:1px solid #d1fae5;background:linear-gradient(145deg, #ffffff, #ecfdf5);padding:20px;min-height:140px;box-shadow:0 16px 36px rgba(15, 23, 42, 0.12)}.glow.svelte-5733sx{position:absolute;inset:-40%;background:radial-gradient(circle at 30% 20%, rgba(16, 185, 129, 0.3), transparent 55%);opacity:0.7;filter:blur(8px)}.content.svelte-5733sx{position:relative;display:grid;gap:8px;color:#0f172a}.title.svelte-5733sx{font-size:16px;font-weight:600;margin:0}.subtitle.svelte-5733sx{font-size:12px;margin:0;color:#64748b}.metrics.svelte-5733sx{margin-top:12px;display:flex;justify-content:space-between;font-size:12px;color:#0f172a}.orbit.svelte-5733sx{position:absolute;inset:-30%;border-radius:999px;border:1px dashed rgba(16, 185, 129, 0.3);animation:svelte-5733sx-orbit 6s linear infinite;opacity:var(--orbit-alpha)}.satellite-orbit.svelte-5733sx{position:absolute;inset:-30%;border-radius:999px;animation:svelte-5733sx-orbit 6s linear infinite}.satellite.svelte-5733sx{position:absolute;width:10px;height:10px;border-radius:999px;background:#34d399;box-shadow:0 0 12px rgba(16, 185, 129, 0.6);top:50%;left:50%;transform:translate(-50%, -50%) translateY(-78px)}@keyframes svelte-5733sx-orbit{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}");
}
function ls(t) {
  let e, s, l, i, c, r, n, o, v, u, h, d, g, p, m, y, j, $, x, w, S, _, C;
  return {
    c() {
      e = b("div"), s = b("div"), l = z(), i = b("div"), c = b("p"), r = q(
        /*title*/
        t[0]
      ), n = z(), o = b("p"), v = q(
        /*subtitle*/
        t[1]
      ), u = z(), h = b("div"), d = b("span"), d.textContent = "Flow", g = z(), p = b("span"), m = q(
        /*flow*/
        t[3]
      ), y = q("%"), j = z(), $ = b("div"), $.innerHTML = '<div class="satellite svelte-5733sx"></div>', x = z(), w = b("div"), f(s, "class", "glow svelte-5733sx"), f(c, "class", "title svelte-5733sx"), f(o, "class", "subtitle svelte-5733sx"), f(h, "class", "metrics svelte-5733sx"), f(i, "class", "content svelte-5733sx"), f($, "class", "satellite-orbit svelte-5733sx"), f(w, "class", "orbit svelte-5733sx"), f(e, "class", "card svelte-5733sx"), f(e, "style", S = `--orbit-alpha:${/*intensity*/
      t[2]}`), f(e, "role", "button"), f(e, "tabindex", "0");
    },
    m(M, Y) {
      I(M, e, Y), a(e, s), a(e, l), a(e, i), a(i, c), a(c, r), a(i, n), a(i, o), a(o, v), a(i, u), a(i, h), a(h, d), a(h, g), a(h, p), a(p, m), a(p, y), a(e, j), a(e, $), a(e, x), a(e, w), _ || (C = [
        N(
          e,
          "mouseenter",
          /*handleHover*/
          t[4]
        ),
        N(
          e,
          "focus",
          /*handleHover*/
          t[4]
        ),
        N(
          e,
          "keydown",
          /*keydown_handler*/
          t[5]
        )
      ], _ = !0);
    },
    p(M, [Y]) {
      Y & /*title*/
      1 && E(
        r,
        /*title*/
        M[0]
      ), Y & /*subtitle*/
      2 && E(
        v,
        /*subtitle*/
        M[1]
      ), Y & /*flow*/
      8 && E(
        m,
        /*flow*/
        M[3]
      ), Y & /*intensity*/
      4 && S !== (S = `--orbit-alpha:${/*intensity*/
      M[2]}`) && f(e, "style", S);
    },
    i: L,
    o: L,
    d(M) {
      M && A(e), _ = !1, H(C);
    }
  };
}
function is(t, e, s) {
  let { title: l = "Focus Ring" } = e, { subtitle: i = "Anillo orbital" } = e, { intensity: c = 0.6 } = e, { flow: r = 78 } = e;
  const n = oe(), o = () => {
    n("hover", { title: l });
  }, v = (u) => {
    (u.key === "Enter" || u.key === " ") && o();
  };
  return t.$$set = (u) => {
    "title" in u && s(0, l = u.title), "subtitle" in u && s(1, i = u.subtitle), "intensity" in u && s(2, c = u.intensity), "flow" in u && s(3, r = u.flow);
  }, [l, i, c, r, o, v];
}
class vt extends K {
  constructor(e) {
    super(), U(
      this,
      e,
      is,
      ls,
      X,
      {
        title: 0,
        subtitle: 1,
        intensity: 2,
        flow: 3
      },
      ss
    );
  }
  get title() {
    return this.$$.ctx[0];
  }
  set title(e) {
    this.$$set({ title: e }), k();
  }
  get subtitle() {
    return this.$$.ctx[1];
  }
  set subtitle(e) {
    this.$$set({ subtitle: e }), k();
  }
  get intensity() {
    return this.$$.ctx[2];
  }
  set intensity(e) {
    this.$$set({ intensity: e }), k();
  }
  get flow() {
    return this.$$.ctx[3];
  }
  set flow(e) {
    this.$$set({ flow: e }), k();
  }
}
J(vt, { title: {}, subtitle: {}, intensity: {}, flow: {} }, [], [], !0);
function ns(t) {
  V(t, "svelte-1vzxgvk", ".badge.svelte-1vzxgvk.svelte-1vzxgvk{display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border-radius:999px;border:1px solid transparent;font-size:12px;font-weight:600;letter-spacing:0.02em;cursor:pointer;background:#ecfdf5;color:#065f46}.badge.emerald.svelte-1vzxgvk.svelte-1vzxgvk{border-color:rgba(16, 185, 129, 0.35)}.dot.svelte-1vzxgvk.svelte-1vzxgvk{width:8px;height:8px;border-radius:999px;background:currentColor;box-shadow:0 0 0 rgba(16, 185, 129, 0.6)}.active.svelte-1vzxgvk .dot.svelte-1vzxgvk{animation:svelte-1vzxgvk-pulse 1.8s ease-in-out infinite}@keyframes svelte-1vzxgvk-pulse{0%{box-shadow:0 0 0 0 rgba(16, 185, 129, 0.6)}70%{box-shadow:0 0 0 12px rgba(16, 185, 129, 0)}100%{box-shadow:0 0 0 0 rgba(16, 185, 129, 0)}}");
}
function rs(t) {
  let e, s, l, i, c, r, n;
  return {
    c() {
      e = b("button"), s = b("span"), l = z(), i = q(
        /*label*/
        t[1]
      ), f(s, "class", "dot svelte-1vzxgvk"), f(e, "class", c = $e(`badge ${/*tone*/
      t[2]} ${/*active*/
      t[0] ? "active" : ""}`) + " svelte-1vzxgvk"), f(e, "type", "button");
    },
    m(o, v) {
      I(o, e, v), a(e, s), a(e, l), a(e, i), r || (n = N(
        e,
        "click",
        /*toggle*/
        t[3]
      ), r = !0);
    },
    p(o, [v]) {
      v & /*label*/
      2 && E(
        i,
        /*label*/
        o[1]
      ), v & /*tone, active*/
      5 && c !== (c = $e(`badge ${/*tone*/
      o[2]} ${/*active*/
      o[0] ? "active" : ""}`) + " svelte-1vzxgvk") && f(e, "class", c);
    },
    i: L,
    o: L,
    d(o) {
      o && A(e), r = !1, n();
    }
  };
}
function as(t, e, s) {
  let { label: l = "Live" } = e, { tone: i = "emerald" } = e, { active: c = !0 } = e;
  const r = oe(), n = () => {
    s(0, c = !c), r("toggle", { active: c });
  };
  return t.$$set = (o) => {
    "label" in o && s(1, l = o.label), "tone" in o && s(2, i = o.tone), "active" in o && s(0, c = o.active);
  }, [c, l, i, n];
}
class pt extends K {
  constructor(e) {
    super(), U(this, e, as, rs, X, { label: 1, tone: 2, active: 0 }, ns);
  }
  get label() {
    return this.$$.ctx[1];
  }
  set label(e) {
    this.$$set({ label: e }), k();
  }
  get tone() {
    return this.$$.ctx[2];
  }
  set tone(e) {
    this.$$set({ tone: e }), k();
  }
  get active() {
    return this.$$.ctx[0];
  }
  set active(e) {
    this.$$set({ active: e }), k();
  }
}
J(pt, { label: {}, tone: {}, active: { type: "Boolean" } }, [], [], !0);
function os(t) {
  V(t, "svelte-1io8dtn", ".ripple.svelte-1io8dtn{position:relative;overflow:hidden;padding:12px 20px;border-radius:14px;border:none;background:var(--tone);color:#ffffff;font-weight:600;cursor:pointer;box-shadow:0 16px 28px rgba(16, 185, 129, 0.25)}.label.svelte-1io8dtn{position:relative;z-index:1}.wave.svelte-1io8dtn{position:absolute;width:20px;height:20px;border-radius:999px;background:rgba(255, 255, 255, 0.45);transform:translate(-50%, -50%);animation:svelte-1io8dtn-ripple 0.8s ease-out forwards}@keyframes svelte-1io8dtn-ripple{from{opacity:0.7;transform:translate(-50%, -50%) scale(0)}to{opacity:0;transform:translate(-50%, -50%) scale(8)}}");
}
function Fe(t, e, s) {
  const l = t.slice();
  return l[7] = e[s], l;
}
function He(t, e) {
  let s, l, i, c;
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
    key: t,
    first: null,
    c() {
      s = b("span"), f(s, "class", "wave svelte-1io8dtn"), f(s, "style", l = `left:${/*ripple*/
      e[7].x}px; top:${/*ripple*/
      e[7].y}px;`), this.first = s;
    },
    m(n, o) {
      I(n, s, o), i || (c = N(s, "animationend", r), i = !0);
    },
    p(n, o) {
      e = n, o & /*ripples*/
      4 && l !== (l = `left:${/*ripple*/
      e[7].x}px; top:${/*ripple*/
      e[7].y}px;`) && f(s, "style", l);
    },
    d(n) {
      n && A(s), i = !1, c();
    }
  };
}
function cs(t) {
  let e, s = [], l = /* @__PURE__ */ new Map(), i, c, r, n, o, v, u = pe(
    /*ripples*/
    t[2]
  );
  const h = (d) => (
    /*ripple*/
    d[7].id
  );
  for (let d = 0; d < u.length; d += 1) {
    let g = Fe(t, u, d), p = h(g);
    l.set(p, s[d] = He(p, g));
  }
  return {
    c() {
      e = b("button");
      for (let d = 0; d < s.length; d += 1)
        s[d].c();
      i = z(), c = b("span"), r = q(
        /*label*/
        t[0]
      ), f(c, "class", "label svelte-1io8dtn"), f(e, "class", "ripple svelte-1io8dtn"), f(e, "type", "button"), f(e, "style", n = `--tone:${/*tone*/
      t[1]}`);
    },
    m(d, g) {
      I(d, e, g);
      for (let p = 0; p < s.length; p += 1)
        s[p] && s[p].m(e, null);
      a(e, i), a(e, c), a(c, r), o || (v = N(
        e,
        "click",
        /*handleClick*/
        t[3]
      ), o = !0);
    },
    p(d, [g]) {
      g & /*ripples, removeRipple*/
      20 && (u = pe(
        /*ripples*/
        d[2]
      ), s = Ie(s, g, h, 1, d, u, l, e, Re, He, i, Fe)), g & /*label*/
      1 && E(
        r,
        /*label*/
        d[0]
      ), g & /*tone*/
      2 && n !== (n = `--tone:${/*tone*/
      d[1]}`) && f(e, "style", n);
    },
    i: L,
    o: L,
    d(d) {
      d && A(e);
      for (let g = 0; g < s.length; g += 1)
        s[g].d();
      o = !1, v();
    }
  };
}
function fs(t, e, s) {
  let { label: l = "Lanzar onda" } = e, { tone: i = "#10b981" } = e;
  const c = oe();
  let r = [];
  const n = (u) => {
    const h = u.currentTarget.getBoundingClientRect(), d = u.clientX - h.left, g = u.clientY - h.top, p = Math.random().toString(36).slice(2);
    s(2, r = [...r, { id: p, x: d, y: g }]), c("ripple", { x: d, y: g });
  }, o = (u) => {
    s(2, r = r.filter((h) => h.id !== u));
  }, v = (u) => o(u.id);
  return t.$$set = (u) => {
    "label" in u && s(0, l = u.label), "tone" in u && s(1, i = u.tone);
  }, [l, i, r, n, o, v];
}
class ht extends K {
  constructor(e) {
    super(), U(this, e, fs, cs, X, { label: 0, tone: 1 }, os);
  }
  get label() {
    return this.$$.ctx[0];
  }
  set label(e) {
    this.$$set({ label: e }), k();
  }
  get tone() {
    return this.$$.ctx[1];
  }
  set tone(e) {
    this.$$set({ tone: e }), k();
  }
}
J(ht, { label: {}, tone: {} }, [], [], !0);
function ds(t) {
  V(t, "svelte-1jr61rp", ".list.svelte-1jr61rp{border-radius:18px;border:1px solid #e2e8f0;background:#ffffff;padding:16px;display:grid;gap:16px}.header.svelte-1jr61rp{display:flex;justify-content:space-between;align-items:center}.title.svelte-1jr61rp{margin:0;font-size:14px;font-weight:600;color:#0f172a}.subtitle.svelte-1jr61rp{margin:0;font-size:11px;color:#94a3b8}button.svelte-1jr61rp{border:1px solid #d1fae5;background:#ecfdf5;color:#065f46;font-size:12px;padding:6px 10px;border-radius:10px;cursor:pointer}.items.svelte-1jr61rp{display:grid;gap:10px}.item.svelte-1jr61rp{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-radius:12px;background:#f8fafc;color:#0f172a;font-size:13px;animation:svelte-1jr61rp-slide-in 0.5s ease forwards;opacity:0;transform:translateY(6px)}.score.svelte-1jr61rp{font-weight:600}@keyframes svelte-1jr61rp-slide-in{to{opacity:1;transform:translateY(0)}}");
}
function Ve(t, e, s) {
  const l = t.slice();
  return l[7] = e[s], l[9] = s, l;
}
function Ue(t, e) {
  let s, l, i = (
    /*item*/
    e[7].title + ""
  ), c, r, n, o = (
    /*item*/
    e[7].score + ""
  ), v, u, h, d;
  return {
    key: t,
    first: null,
    c() {
      s = b("div"), l = b("span"), c = q(i), r = z(), n = b("span"), v = q(o), u = q("%"), h = z(), f(n, "class", "score svelte-1jr61rp"), f(s, "class", "item svelte-1jr61rp"), f(s, "style", d = `animation-delay:${/*index*/
      e[9] * /*cadence*/
      e[1]}ms`), this.first = s;
    },
    m(g, p) {
      I(g, s, p), a(s, l), a(l, c), a(s, r), a(s, n), a(n, v), a(n, u), a(s, h);
    },
    p(g, p) {
      e = g, p & /*items*/
      4 && i !== (i = /*item*/
      e[7].title + "") && E(c, i), p & /*items*/
      4 && o !== (o = /*item*/
      e[7].score + "") && E(v, o), p & /*items, cadence*/
      6 && d !== (d = `animation-delay:${/*index*/
      e[9] * /*cadence*/
      e[1]}ms`) && f(s, "style", d);
    },
    d(g) {
      g && A(s);
    }
  };
}
function us(t) {
  let e, s, l, i, c, r, n, o, v, u, h, d, g = [], p = /* @__PURE__ */ new Map(), m, y, j = pe(
    /*items*/
    t[2]
  );
  const $ = (x) => (
    /*item*/
    x[7].id
  );
  for (let x = 0; x < j.length; x += 1) {
    let w = Ve(t, j, x), S = $(w);
    p.set(S, g[x] = Ue(S, w));
  }
  return {
    c() {
      e = b("div"), s = b("div"), l = b("div"), i = b("p"), i.textContent = "Stagger list", c = z(), r = b("p"), n = q(
        /*count*/
        t[0]
      ), o = q(" items"), v = z(), u = b("button"), u.textContent = "Actualizar", h = z(), d = b("div");
      for (let x = 0; x < g.length; x += 1)
        g[x].c();
      f(i, "class", "title svelte-1jr61rp"), f(r, "class", "subtitle svelte-1jr61rp"), f(u, "type", "button"), f(u, "class", "svelte-1jr61rp"), f(s, "class", "header svelte-1jr61rp"), f(d, "class", "items svelte-1jr61rp"), f(e, "class", "list svelte-1jr61rp");
    },
    m(x, w) {
      I(x, e, w), a(e, s), a(s, l), a(l, i), a(l, c), a(l, r), a(r, n), a(r, o), a(s, v), a(s, u), a(e, h), a(e, d);
      for (let S = 0; S < g.length; S += 1)
        g[S] && g[S].m(d, null);
      m || (y = N(
        u,
        "click",
        /*handleRefresh*/
        t[3]
      ), m = !0);
    },
    p(x, [w]) {
      w & /*count*/
      1 && E(
        n,
        /*count*/
        x[0]
      ), w & /*items, cadence*/
      6 && (j = pe(
        /*items*/
        x[2]
      ), g = Ie(g, w, $, 1, x, j, p, d, Re, Ue, null, Ve));
    },
    i: L,
    o: L,
    d(x) {
      x && A(e);
      for (let w = 0; w < g.length; w += 1)
        g[w].d();
      m = !1, y();
    }
  };
}
function gs(t, e, s) {
  let { label: l = "Batch" } = e, { count: i = 5 } = e, { cadence: c = 120 } = e;
  const r = oe();
  let n = [];
  const o = () => {
    s(2, n = Array.from({ length: i }, (u, h) => ({
      id: `${l}-${h}`,
      title: `${l} ${h + 1}`,
      score: Math.floor(Math.random() * 40) + 60
    }))), r("refresh", { count: i });
  }, v = () => {
    o();
  };
  return Pt(o), t.$$set = (u) => {
    "label" in u && s(4, l = u.label), "count" in u && s(0, i = u.count), "cadence" in u && s(1, c = u.cadence);
  }, [i, c, n, v, l];
}
class bt extends K {
  constructor(e) {
    super(), U(this, e, gs, us, X, { label: 4, count: 0, cadence: 1 }, ds);
  }
  get label() {
    return this.$$.ctx[4];
  }
  set label(e) {
    this.$$set({ label: e }), k();
  }
  get count() {
    return this.$$.ctx[0];
  }
  set count(e) {
    this.$$set({ count: e }), k();
  }
  get cadence() {
    return this.$$.ctx[1];
  }
  set cadence(e) {
    this.$$set({ cadence: e }), k();
  }
}
J(bt, { label: {}, count: {}, cadence: {} }, [], [], !0);
function vs(t) {
  V(t, "svelte-1o8h3wg", ".thermo.svelte-1o8h3wg{display:grid;gap:16px;border-radius:18px;border:1px solid #e2e8f0;padding:16px;background:#ffffff}.header.svelte-1o8h3wg{display:flex;justify-content:space-between;align-items:center}.title.svelte-1o8h3wg{margin:0;font-size:14px;font-weight:600;color:#0f172a}.subtitle.svelte-1o8h3wg{margin:0;font-size:12px;color:#64748b}.chip.svelte-1o8h3wg{font-size:11px;padding:4px 8px;border-radius:999px;background:#ecfdf5;color:#065f46;border:1px solid rgba(16, 185, 129, 0.2)}.meter.svelte-1o8h3wg{position:relative;height:160px;display:grid;place-items:center}.tube.svelte-1o8h3wg{position:relative;width:24px;height:140px;border-radius:14px;background:#f1f5f9;border:1px solid #e2e8f0;overflow:hidden;box-shadow:inset 0 6px 16px rgba(15, 23, 42, 0.08)}.fill.svelte-1o8h3wg{position:absolute;left:0;right:0;bottom:0;height:var(--level);background:linear-gradient(180deg, #ffffff, var(--fill));transition:height 0.8s cubic-bezier(0.22, 1, 0.36, 1)}.gloss.svelte-1o8h3wg{position:absolute;left:3px;top:8px;width:6px;height:calc(100% - 16px);border-radius:999px;background:rgba(255, 255, 255, 0.6);animation:svelte-1o8h3wg-shimmer 2.4s ease-in-out infinite}.bulb.svelte-1o8h3wg{position:absolute;bottom:-6px;width:44px;height:44px;border-radius:999px;background:radial-gradient(circle at 30% 30%, #ffffff, var(--fill));border:2px solid rgba(226, 232, 240, 0.9);box-shadow:0 10px 24px var(--glow);animation:svelte-1o8h3wg-pulse 2.2s ease-in-out infinite}@keyframes svelte-1o8h3wg-shimmer{0%,100%{opacity:0.35;transform:translateY(0)}50%{opacity:0.7;transform:translateY(-8px)}}@keyframes svelte-1o8h3wg-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}");
}
function ps(t) {
  let e, s, l, i, c, r, n, o, v, u, h, d, g, p, m, y, j, $, x, w;
  return {
    c() {
      e = b("div"), s = b("div"), l = b("div"), i = b("p"), c = q(
        /*label*/
        t[0]
      ), r = z(), n = b("p"), o = q(
        /*safeValue*/
        t[3]
      ), v = q("°C · "), u = q(
        /*percent*/
        t[6]
      ), h = q("%"), d = z(), g = b("div"), p = q(
        /*min*/
        t[1]
      ), m = q("° – "), y = q(
        /*max*/
        t[2]
      ), j = q("°"), $ = z(), x = b("div"), x.innerHTML = '<div class="tube svelte-1o8h3wg"><div class="fill svelte-1o8h3wg"></div> <div class="gloss svelte-1o8h3wg"></div></div> <div class="bulb svelte-1o8h3wg"></div>', f(i, "class", "title svelte-1o8h3wg"), f(n, "class", "subtitle svelte-1o8h3wg"), f(g, "class", "chip svelte-1o8h3wg"), f(s, "class", "header svelte-1o8h3wg"), f(x, "class", "meter svelte-1o8h3wg"), f(e, "class", "thermo svelte-1o8h3wg"), f(e, "style", w = `--level:${/*percent*/
      t[6]}%; --fill:${/*fillColor*/
      t[5]}; --glow:${/*glowColor*/
      t[4]};`);
    },
    m(S, _) {
      I(S, e, _), a(e, s), a(s, l), a(l, i), a(i, c), a(l, r), a(l, n), a(n, o), a(n, v), a(n, u), a(n, h), a(s, d), a(s, g), a(g, p), a(g, m), a(g, y), a(g, j), a(e, $), a(e, x);
    },
    p(S, [_]) {
      _ & /*label*/
      1 && E(
        c,
        /*label*/
        S[0]
      ), _ & /*safeValue*/
      8 && E(
        o,
        /*safeValue*/
        S[3]
      ), _ & /*percent*/
      64 && E(
        u,
        /*percent*/
        S[6]
      ), _ & /*min*/
      2 && E(
        p,
        /*min*/
        S[1]
      ), _ & /*max*/
      4 && E(
        y,
        /*max*/
        S[2]
      ), _ & /*percent, fillColor, glowColor*/
      112 && w !== (w = `--level:${/*percent*/
      S[6]}%; --fill:${/*fillColor*/
      S[5]}; --glow:${/*glowColor*/
      S[4]};`) && f(e, "style", w);
    },
    i: L,
    o: L,
    d(S) {
      S && A(e);
    }
  };
}
function hs(t, e, s) {
  let l, i, c, r, n, o, v, u, { label: h = "Temperatura" } = e, { value: d = 22 } = e, { min: g = 0 } = e, { max: p = 40 } = e;
  const m = ($, x, w) => Math.min(w, Math.max(x, $)), y = ($, x, w) => Math.round($ + (x - $) * w), j = ($, x, w) => `rgb(${$}, ${x}, ${w})`;
  return t.$$set = ($) => {
    "label" in $ && s(0, h = $.label), "value" in $ && s(7, d = $.value), "min" in $ && s(1, g = $.min), "max" in $ && s(2, p = $.max);
  }, t.$$.update = () => {
    t.$$.dirty & /*value, min, max*/
    134 && s(3, l = m(d, g, p)), t.$$.dirty & /*safeValue, min, max*/
    14 && s(9, i = (l - g) / (p - g || 1)), t.$$.dirty & /*ratio*/
    512 && s(6, c = Math.round(i * 100)), t.$$.dirty & /*cool, warm, ratio*/
    3584 && s(8, o = {
      r: y(n.r, r.r, i),
      g: y(n.g, r.g, i),
      b: y(n.b, r.b, i)
    }), t.$$.dirty & /*mix*/
    256 && s(5, v = j(o.r, o.g, o.b)), t.$$.dirty & /*mix*/
    256 && s(4, u = `rgba(${o.r}, ${o.g}, ${o.b}, 0.45)`);
  }, s(10, r = { r: 239, g: 68, b: 68 }), s(11, n = { r: 34, g: 197, b: 94 }), [
    h,
    g,
    p,
    l,
    u,
    v,
    c,
    d,
    o,
    i,
    r,
    n
  ];
}
class mt extends K {
  constructor(e) {
    super(), U(this, e, hs, ps, X, { label: 0, value: 7, min: 1, max: 2 }, vs);
  }
  get label() {
    return this.$$.ctx[0];
  }
  set label(e) {
    this.$$set({ label: e }), k();
  }
  get value() {
    return this.$$.ctx[7];
  }
  set value(e) {
    this.$$set({ value: e }), k();
  }
  get min() {
    return this.$$.ctx[1];
  }
  set min(e) {
    this.$$set({ min: e }), k();
  }
  get max() {
    return this.$$.ctx[2];
  }
  set max(e) {
    this.$$set({ max: e }), k();
  }
}
J(mt, { label: {}, value: {}, min: {}, max: {} }, [], [], !0);
function bs(t) {
  V(t, "svelte-q2ay9k", `.podium.svelte-q2ay9k.svelte-q2ay9k{position:relative;border-radius:18px;border:1px solid #e2e8f0;background:linear-gradient(180deg, #ffffff, #f8fafc);padding:24px 18px 16px;height:220px;display:grid;align-items:end}.line.svelte-q2ay9k.svelte-q2ay9k{position:absolute;left:16px;right:16px;bottom:24px;height:2px;background:linear-gradient(90deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.6))}.controls.svelte-q2ay9k.svelte-q2ay9k{position:absolute;top:14px;right:14px;display:flex;gap:8px}.reset.svelte-q2ay9k.svelte-q2ay9k,.swap.svelte-q2ay9k.svelte-q2ay9k{border:1px solid rgba(16, 185, 129, 0.3);background:#ecfdf5;color:#065f46;font-size:11px;padding:6px 10px;border-radius:999px;cursor:pointer}.reset.svelte-q2ay9k.svelte-q2ay9k:hover,.swap.svelte-q2ay9k.svelte-q2ay9k:hover{background:#d1fae5}.stack.svelte-q2ay9k.svelte-q2ay9k{position:relative;display:grid;grid-template-columns:repeat(3, 1fr);align-items:end;gap:14px;height:100%;z-index:1}.bar.svelte-q2ay9k.svelte-q2ay9k{position:relative;border-radius:14px 14px 6px 6px;background:#d1fae5;color:#065f46;display:grid;place-items:center;font-size:14px;font-weight:600;transform-origin:bottom;animation:svelte-q2ay9k-rise var(--dur) cubic-bezier(0.22, 1, 0.36, 1) forwards;transform:scaleY(0)}.bar.svelte-q2ay9k span.svelte-q2ay9k{opacity:0;animation:svelte-q2ay9k-fade-in 0.5s ease forwards;animation-delay:calc(var(--dur) * 0.7)}.bar.svelte-q2ay9k.svelte-q2ay9k::after{content:"";position:absolute;inset:8px;border-radius:10px;background:linear-gradient(120deg, rgba(255, 255, 255, 0.4), transparent 60%);opacity:0;animation:svelte-q2ay9k-sweep 1.6s ease forwards;animation-delay:calc(var(--dur) * 0.4)}.bar.first.svelte-q2ay9k.svelte-q2ay9k{background:linear-gradient(180deg, #10b981, #34d399);color:#ffffff;box-shadow:0 14px 24px rgba(16, 185, 129, 0.35)}.bar.second.svelte-q2ay9k.svelte-q2ay9k{background:linear-gradient(180deg, #34d399, #6ee7b7)}.bar.third.svelte-q2ay9k.svelte-q2ay9k{background:linear-gradient(180deg, #bbf7d0, #ecfdf5)}.podium[data-play].svelte-q2ay9k .bar.svelte-q2ay9k{animation:svelte-q2ay9k-rise var(--dur) cubic-bezier(0.22, 1, 0.36, 1) forwards,
      svelte-q2ay9k-settle 0.35s ease-out forwards;animation-delay:0s, calc(var(--dur) * 0.9)}.podium[data-play].svelte-q2ay9k .bar span.svelte-q2ay9k{animation:svelte-q2ay9k-fade-in 0.5s ease forwards;animation-delay:calc(var(--dur) * 0.7)}.podium[data-play].svelte-q2ay9k .bar.svelte-q2ay9k::after{animation:svelte-q2ay9k-sweep 1.6s ease forwards;animation-delay:calc(var(--dur) * 0.4)}@keyframes svelte-q2ay9k-rise{to{transform:scaleY(1)}}@keyframes svelte-q2ay9k-settle{0%{transform:scaleY(1.02)}100%{transform:scaleY(1)}}@keyframes svelte-q2ay9k-fade-in{to{opacity:1}}@keyframes svelte-q2ay9k-sweep{0%{opacity:0;transform:translateY(10%)}50%{opacity:0.5}100%{opacity:0;transform:translateY(-20%)}}`);
}
function Je(t, e, s) {
  const l = t.slice();
  return l[12] = e[s], l;
}
function Ke(t, e) {
  let s, l, i = (
    /*item*/
    e[12].label + ""
  ), c, r, n, o;
  return {
    key: t,
    first: null,
    c() {
      s = b("div"), l = b("span"), c = q(i), r = z(), f(l, "class", "svelte-q2ay9k"), f(s, "class", n = $e(`bar ${/*item*/
      e[12].className}`) + " svelte-q2ay9k"), f(s, "style", o = `height:${/*item*/
      e[12].height}%; --dur:${/*item*/
      e[12].duration}s;`), this.first = s;
    },
    m(v, u) {
      I(v, s, u), a(s, l), a(l, c), a(s, r);
    },
    p(v, u) {
      e = v, u & /*items*/
      2 && i !== (i = /*item*/
      e[12].label + "") && E(c, i), u & /*items*/
      2 && n !== (n = $e(`bar ${/*item*/
      e[12].className}`) + " svelte-q2ay9k") && f(s, "class", n), u & /*items*/
      2 && o !== (o = `height:${/*item*/
      e[12].height}%; --dur:${/*item*/
      e[12].duration}s;`) && f(s, "style", o);
    },
    d(v) {
      v && A(s);
    }
  };
}
function Qe(t) {
  let e, s = [], l = /* @__PURE__ */ new Map(), i = pe(
    /*items*/
    t[1]
  );
  const c = (r) => (
    /*item*/
    r[12].key
  );
  for (let r = 0; r < i.length; r += 1) {
    let n = Je(t, i, r), o = c(n);
    l.set(o, s[r] = Ke(o, n));
  }
  return {
    c() {
      e = b("div");
      for (let r = 0; r < s.length; r += 1)
        s[r].c();
      f(e, "class", "stack svelte-q2ay9k");
    },
    m(r, n) {
      I(r, e, n);
      for (let o = 0; o < s.length; o += 1)
        s[o] && s[o].m(e, null);
    },
    p(r, n) {
      n & /*items*/
      2 && (i = pe(
        /*items*/
        r[1]
      ), s = Ie(s, n, c, 1, r, i, l, e, Re, Ke, null, Je));
    },
    d(r) {
      r && A(e);
      for (let n = 0; n < s.length; n += 1)
        s[n].d();
    }
  };
}
function ms(t) {
  let e, s, l, i, c, r, n, o, v = (
    /*playId*/
    t[0]
  ), u, h, d = Qe(t);
  return {
    c() {
      e = b("div"), s = b("div"), l = z(), i = b("div"), c = b("button"), c.textContent = "Reiniciar", r = z(), n = b("button"), n.textContent = "Intercalar", o = z(), d.c(), f(s, "class", "line svelte-q2ay9k"), f(c, "class", "reset svelte-q2ay9k"), f(c, "type", "button"), f(n, "class", "swap svelte-q2ay9k"), f(n, "type", "button"), f(i, "class", "controls svelte-q2ay9k"), f(e, "class", "podium svelte-q2ay9k"), f(
        e,
        "data-play",
        /*playId*/
        t[0]
      );
    },
    m(g, p) {
      I(g, e, p), a(e, s), a(e, l), a(e, i), a(i, c), a(i, r), a(i, n), a(e, o), d.m(e, null), u || (h = [
        N(
          c,
          "click",
          /*reset*/
          t[2]
        ),
        N(
          n,
          "click",
          /*cycle*/
          t[3]
        )
      ], u = !0);
    },
    p(g, [p]) {
      p & /*playId*/
      1 && X(v, v = /*playId*/
      g[0]) ? (d.d(1), d = Qe(g), d.c(), d.m(e, null)) : d.p(g, p), p & /*playId*/
      1 && f(
        e,
        "data-play",
        /*playId*/
        g[0]
      );
    },
    i: L,
    o: L,
    d(g) {
      g && A(e), d.d(g), u = !1, H(h);
    }
  };
}
function ys(t, e, s) {
  let l, { first: i = 82 } = e, { second: c = 64 } = e, { third: r = 48 } = e, { baseDuration: n = 0.9 } = e, { delayStep: o = 0.15 } = e, v = 0, u = ["second", "first", "third"];
  const h = {
    first: { label: "1", className: "first" },
    second: { label: "2", className: "second" },
    third: { label: "3", className: "third" }
  }, d = (m) => m === "first" ? i : m === "second" ? c : r, g = () => {
    s(0, v += 1);
  }, p = () => {
    s(9, u = [u[1], u[2], u[0]]), s(0, v += 1);
  };
  return t.$$set = (m) => {
    "first" in m && s(4, i = m.first), "second" in m && s(5, c = m.second), "third" in m && s(6, r = m.third), "baseDuration" in m && s(7, n = m.baseDuration), "delayStep" in m && s(8, o = m.delayStep);
  }, t.$$.update = () => {
    t.$$.dirty & /*order, baseDuration, delayStep*/
    896 && s(1, l = u.map((m, y) => ({
      key: m,
      label: h[m].label,
      className: h[m].className,
      height: d(m),
      duration: n + y * o * 2
    })));
  }, [
    v,
    l,
    g,
    p,
    i,
    c,
    r,
    n,
    o,
    u
  ];
}
class yt extends K {
  constructor(e) {
    super(), U(
      this,
      e,
      ys,
      ms,
      X,
      {
        first: 4,
        second: 5,
        third: 6,
        baseDuration: 7,
        delayStep: 8
      },
      bs
    );
  }
  get first() {
    return this.$$.ctx[4];
  }
  set first(e) {
    this.$$set({ first: e }), k();
  }
  get second() {
    return this.$$.ctx[5];
  }
  set second(e) {
    this.$$set({ second: e }), k();
  }
  get third() {
    return this.$$.ctx[6];
  }
  set third(e) {
    this.$$set({ third: e }), k();
  }
  get baseDuration() {
    return this.$$.ctx[7];
  }
  set baseDuration(e) {
    this.$$set({ baseDuration: e }), k();
  }
  get delayStep() {
    return this.$$.ctx[8];
  }
  set delayStep(e) {
    this.$$set({ delayStep: e }), k();
  }
}
J(yt, { first: {}, second: {}, third: {}, baseDuration: {}, delayStep: {} }, [], [], !0);
function xs(t) {
  V(t, "svelte-1jqbzw8", ".balloon-card.svelte-1jqbzw8{border-radius:18px;border:1px solid #e2e8f0;background:linear-gradient(180deg, #ffffff, #f8fafc);padding:16px;height:220px;display:grid;place-items:center}.scene.svelte-1jqbzw8{position:relative;width:160px;height:180px}.rope.svelte-1jqbzw8{position:absolute;left:50%;bottom:14px;width:2px;height:90px;background:var(--rope);transform-origin:bottom;transform:translateX(-50%);animation:svelte-1jqbzw8-rope-sway var(--speed) ease-in-out infinite}.anchor.svelte-1jqbzw8{position:absolute;left:50%;bottom:0;width:18px;height:18px;border-radius:999px;background:#e2e8f0;border:2px solid #cbd5f5;transform:translateX(-50%)}.balloon.svelte-1jqbzw8{position:absolute;left:50%;bottom:96px;width:64px;height:74px;border-radius:50% 50% 46% 46%;background:radial-gradient(circle at 35% 30%, #ffffff, var(--balloon));box-shadow:0 16px 26px rgba(16, 185, 129, 0.2);transform-origin:bottom center;transform:translateX(-50%);animation:svelte-1jqbzw8-float var(--speed) ease-in-out infinite}.string.svelte-1jqbzw8{position:absolute;left:50%;bottom:-26px;width:2px;height:26px;background:var(--rope);transform:translateX(-50%)}@keyframes svelte-1jqbzw8-float{0%,100%{transform:translateX(-50%) translateY(0) rotate(0deg)}50%{transform:translateX(-50%) translateY(calc(var(--lift) * -1)) rotate(var(--sway))}}@keyframes svelte-1jqbzw8-rope-sway{0%,100%{transform:translateX(-50%) rotate(0deg)}50%{transform:translateX(-50%) rotate(calc(var(--sway) * -0.4))}}");
}
function ks(t) {
  let e, s, l;
  return {
    c() {
      e = b("div"), s = b("div"), s.innerHTML = '<div class="rope svelte-1jqbzw8"></div> <div class="anchor svelte-1jqbzw8"></div> <div class="balloon svelte-1jqbzw8"><div class="string svelte-1jqbzw8"></div></div>', f(s, "class", "scene svelte-1jqbzw8"), f(e, "class", "balloon-card svelte-1jqbzw8"), f(e, "style", l = `
    --lift:${/*lift*/
      t[0]}px;
    --sway:${/*sway*/
      t[1]}deg;
    --speed:${/*speed*/
      t[2]}s;
    --balloon:${/*color*/
      t[3]};
    --rope:${/*rope*/
      t[4]};
  `);
    },
    m(i, c) {
      I(i, e, c), a(e, s);
    },
    p(i, [c]) {
      c & /*lift, sway, speed, color, rope*/
      31 && l !== (l = `
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
  `) && f(e, "style", l);
    },
    i: L,
    o: L,
    d(i) {
      i && A(e);
    }
  };
}
function _s(t, e, s) {
  let { lift: l = 18 } = e, { sway: i = 6 } = e, { speed: c = 5.5 } = e, { color: r = "#10b981" } = e, { rope: n = "#94a3b8" } = e;
  return t.$$set = (o) => {
    "lift" in o && s(0, l = o.lift), "sway" in o && s(1, i = o.sway), "speed" in o && s(2, c = o.speed), "color" in o && s(3, r = o.color), "rope" in o && s(4, n = o.rope);
  }, [l, i, c, r, n];
}
class xt extends K {
  constructor(e) {
    super(), U(
      this,
      e,
      _s,
      ks,
      X,
      {
        lift: 0,
        sway: 1,
        speed: 2,
        color: 3,
        rope: 4
      },
      xs
    );
  }
  get lift() {
    return this.$$.ctx[0];
  }
  set lift(e) {
    this.$$set({ lift: e }), k();
  }
  get sway() {
    return this.$$.ctx[1];
  }
  set sway(e) {
    this.$$set({ sway: e }), k();
  }
  get speed() {
    return this.$$.ctx[2];
  }
  set speed(e) {
    this.$$set({ speed: e }), k();
  }
  get color() {
    return this.$$.ctx[3];
  }
  set color(e) {
    this.$$set({ color: e }), k();
  }
  get rope() {
    return this.$$.ctx[4];
  }
  set rope(e) {
    this.$$set({ rope: e }), k();
  }
}
J(xt, { lift: {}, sway: {}, speed: {}, color: {}, rope: {} }, [], [], !0);
function ws(t) {
  V(t, "svelte-9cnfqg", '.wrapper.svelte-9cnfqg.svelte-9cnfqg{display:grid;grid-template-columns:28px 1fr 28px;align-items:stretch;gap:12px}.nav.svelte-9cnfqg.svelte-9cnfqg{border:1px solid #e2e8f0;background:#f8fafc;border-radius:14px;display:grid;place-items:center;height:100%;cursor:pointer;transition:transform 0.2s ease, background 0.2s ease;position:relative;overflow:hidden}.nav.svelte-9cnfqg.svelte-9cnfqg:hover{background:#e2e8f0;transform:translateY(-2px)}.nav.svelte-9cnfqg.svelte-9cnfqg::after{content:"";position:absolute;inset:0;background:linear-gradient(120deg, transparent, rgba(16, 185, 129, 0.25), transparent);transform:translateX(-120%);transition:transform 0.45s ease}.nav.svelte-9cnfqg.svelte-9cnfqg:hover::after{transform:translateX(120%)}.chevron.svelte-9cnfqg.svelte-9cnfqg{width:10px;height:28px;border-right:2px solid #475569;border-bottom:2px solid #475569;transform:rotate(-45deg)}.nav.left.svelte-9cnfqg .chevron.svelte-9cnfqg{transform:rotate(135deg)}.card.svelte-9cnfqg.svelte-9cnfqg{display:grid;grid-template-columns:72px 1fr;gap:16px;padding:18px 20px;border-radius:20px;border:1px solid #e2e8f0;background:#ffffff;box-shadow:0 14px 26px rgba(15, 23, 42, 0.08);transition:transform 0.35s ease, box-shadow 0.35s ease}.card.svelte-9cnfqg.svelte-9cnfqg:hover{transform:translateY(-4px);box-shadow:0 18px 34px rgba(15, 23, 42, 0.16)}.icon.svelte-9cnfqg.svelte-9cnfqg{width:56px;height:56px;border-radius:16px;background:#f8fafc;display:grid;place-items:center}.ladder.svelte-9cnfqg.svelte-9cnfqg{width:28px;height:36px;border:3px solid #7c5c4f;border-left-width:5px;border-right-width:5px;border-radius:6px;position:relative}.ladder.svelte-9cnfqg span.svelte-9cnfqg{position:absolute;left:2px;right:2px;height:4px;background:#7c5c4f;border-radius:999px;animation:svelte-9cnfqg-rung 2.8s ease-in-out infinite}.ladder.svelte-9cnfqg span.svelte-9cnfqg:nth-child(1){top:6px;animation-delay:0s}.ladder.svelte-9cnfqg span.svelte-9cnfqg:nth-child(2){top:14px;animation-delay:0.2s}.ladder.svelte-9cnfqg span.svelte-9cnfqg:nth-child(3){top:22px;animation-delay:0.4s}.ladder.svelte-9cnfqg span.svelte-9cnfqg:nth-child(4){top:30px;animation-delay:0.6s}.content.svelte-9cnfqg.svelte-9cnfqg{display:grid;gap:8px}.panel.svelte-9cnfqg.svelte-9cnfqg{animation:svelte-9cnfqg-slide-in 0.4s ease}.row.svelte-9cnfqg.svelte-9cnfqg{display:flex;align-items:center;justify-content:space-between;gap:12px}.title.svelte-9cnfqg.svelte-9cnfqg{display:flex;align-items:baseline;gap:12px}.title.svelte-9cnfqg strong.svelte-9cnfqg{font-size:18px;color:#0f172a}.title.svelte-9cnfqg span.svelte-9cnfqg{font-size:14px;color:#64748b}.level-text.svelte-9cnfqg.svelte-9cnfqg{font-size:14px;color:#64748b;animation:svelte-9cnfqg-level-pop 0.35s ease}.pill.svelte-9cnfqg.svelte-9cnfqg{padding:6px 14px;background:#eef2ff;color:#1e3a8a;border-radius:999px;font-size:12px;font-weight:600}.desc.svelte-9cnfqg.svelte-9cnfqg{margin:0;font-size:14px;color:#0f172a}.meta.svelte-9cnfqg.svelte-9cnfqg{font-size:13px;color:#475569}.xp.svelte-9cnfqg.svelte-9cnfqg{font-weight:600;color:#047857}.progress.svelte-9cnfqg.svelte-9cnfqg{position:relative;height:12px;border-radius:999px;background:#f1f5f9;overflow:hidden}.bar.svelte-9cnfqg.svelte-9cnfqg{height:100%;width:var(--fill);background:linear-gradient(90deg, #10b981, #34d399);transition:width 0.8s cubic-bezier(0.22, 1, 0.36, 1)}.glow.svelte-9cnfqg.svelte-9cnfqg{position:absolute;inset:0;background:linear-gradient(90deg, rgba(16, 185, 129, 0), rgba(16, 185, 129, 0.35), rgba(16, 185, 129, 0));transform:translateX(-100%);animation:svelte-9cnfqg-sweep 3.2s ease-in-out infinite}@keyframes svelte-9cnfqg-sweep{0%,60%{transform:translateX(-100%)}100%{transform:translateX(100%)}}@keyframes svelte-9cnfqg-level-pop{0%{opacity:0;transform:translateY(4px)}100%{opacity:1;transform:translateY(0)}}@keyframes svelte-9cnfqg-rung{0%,100%{opacity:0.6}50%{opacity:1}}@keyframes svelte-9cnfqg-slide-in{from{opacity:0;transform:translateX(calc(var(--dir) * 12px))}to{opacity:1;transform:translateX(0)}}');
}
function Ge(t) {
  let e, s, l, i, c, r, n, o, v, u, h, d, g, p, m, y, j, $, x, w, S, _, C, M, Y, B, se, le, ce, ie, W, Z, ne, re, ae;
  return {
    c() {
      e = b("div"), s = b("div"), l = b("div"), i = b("strong"), c = q(
        /*title*/
        t[0]
      ), r = z(), n = b("span"), o = q("Nivel "), v = q(
        /*activeLevel*/
        t[4]
      ), u = q("/"), h = q(
        /*safeLevelTotal*/
        t[5]
      ), d = z(), g = b("div"), p = q(
        /*status*/
        t[3]
      ), m = z(), y = b("p"), j = q(
        /*description*/
        t[1]
      ), $ = z(), x = b("div"), w = b("span"), S = q("Progreso: "), _ = q(
        /*safeProgress*/
        t[7]
      ), C = q(" / "), M = q(
        /*safeTotal*/
        t[6]
      ), Y = z(), B = b("span"), se = q("+"), le = q(
        /*xp*/
        t[2]
      ), ce = q(" XP"), ie = z(), W = b("div"), Z = b("div"), re = z(), ae = b("div"), f(i, "class", "svelte-9cnfqg"), f(n, "class", "level-text svelte-9cnfqg"), f(l, "class", "title svelte-9cnfqg"), f(g, "class", "pill svelte-9cnfqg"), f(s, "class", "row svelte-9cnfqg"), f(y, "class", "desc svelte-9cnfqg"), f(B, "class", "xp svelte-9cnfqg"), f(x, "class", "row meta svelte-9cnfqg"), f(Z, "class", "bar svelte-9cnfqg"), f(Z, "style", ne = `--fill:${/*percent*/
      t[9]}%`), f(ae, "class", "glow svelte-9cnfqg"), f(W, "class", "progress svelte-9cnfqg"), f(e, "class", "panel svelte-9cnfqg");
    },
    m(P, O) {
      I(P, e, O), a(e, s), a(s, l), a(l, i), a(i, c), a(l, r), a(l, n), a(n, o), a(n, v), a(n, u), a(n, h), a(s, d), a(s, g), a(g, p), a(e, m), a(e, y), a(y, j), a(e, $), a(e, x), a(x, w), a(w, S), a(w, _), a(w, C), a(w, M), a(x, Y), a(x, B), a(B, se), a(B, le), a(B, ce), a(e, ie), a(e, W), a(W, Z), a(W, re), a(W, ae);
    },
    p(P, O) {
      O & /*title*/
      1 && E(
        c,
        /*title*/
        P[0]
      ), O & /*activeLevel*/
      16 && E(
        v,
        /*activeLevel*/
        P[4]
      ), O & /*safeLevelTotal*/
      32 && E(
        h,
        /*safeLevelTotal*/
        P[5]
      ), O & /*status*/
      8 && E(
        p,
        /*status*/
        P[3]
      ), O & /*description*/
      2 && E(
        j,
        /*description*/
        P[1]
      ), O & /*safeProgress*/
      128 && E(
        _,
        /*safeProgress*/
        P[7]
      ), O & /*safeTotal*/
      64 && E(
        M,
        /*safeTotal*/
        P[6]
      ), O & /*xp*/
      4 && E(
        le,
        /*xp*/
        P[2]
      ), O & /*percent*/
      512 && ne !== (ne = `--fill:${/*percent*/
      P[9]}%`) && f(Z, "style", ne);
    },
    d(P) {
      P && A(e);
    }
  };
}
function qs(t) {
  let e, s, l, i, c, r, n, o = (
    /*activeLevel*/
    t[4]
  ), v, u, h, d, g, p = Ge(t);
  return {
    c() {
      e = b("div"), s = b("button"), s.innerHTML = '<span class="chevron svelte-9cnfqg"></span>', l = z(), i = b("div"), c = b("div"), c.innerHTML = '<div class="ladder svelte-9cnfqg"><span class="svelte-9cnfqg"></span> <span class="svelte-9cnfqg"></span> <span class="svelte-9cnfqg"></span> <span class="svelte-9cnfqg"></span></div>', r = z(), n = b("div"), p.c(), u = z(), h = b("button"), h.innerHTML = '<span class="chevron svelte-9cnfqg"></span>', f(s, "class", "nav left svelte-9cnfqg"), f(s, "type", "button"), f(s, "aria-label", "Nivel anterior"), f(c, "class", "icon svelte-9cnfqg"), f(n, "class", "content svelte-9cnfqg"), f(n, "style", v = `--dir:${/*slideDir*/
      t[8]}`), f(i, "class", "card svelte-9cnfqg"), f(h, "class", "nav right svelte-9cnfqg"), f(h, "type", "button"), f(h, "aria-label", "Nivel siguiente"), f(e, "class", "wrapper svelte-9cnfqg");
    },
    m(m, y) {
      I(m, e, y), a(e, s), a(e, l), a(e, i), a(i, c), a(i, r), a(i, n), p.m(n, null), a(e, u), a(e, h), d || (g = [
        N(
          s,
          "click",
          /*click_handler*/
          t[17]
        ),
        N(
          h,
          "click",
          /*click_handler_1*/
          t[18]
        )
      ], d = !0);
    },
    p(m, [y]) {
      y & /*activeLevel*/
      16 && X(o, o = /*activeLevel*/
      m[4]) ? (p.d(1), p = Ge(m), p.c(), p.m(n, null)) : p.p(m, y), y & /*slideDir*/
      256 && v !== (v = `--dir:${/*slideDir*/
      m[8]}`) && f(n, "style", v);
    },
    i: L,
    o: L,
    d(m) {
      m && A(e), p.d(m), d = !1, H(g);
    }
  };
}
function $s(t, e, s) {
  let l, i, c, r, n, { title: o = "Nivel 5" } = e, { subtitle: v = "Nivel 1/3" } = e, { description: u = "Alcanza nivel 5 de usuario." } = e, { progress: h = 4 } = e, { total: d = 5 } = e, { xp: g = 15 } = e, { status: p = "En progreso" } = e, { levelIndex: m = 1 } = e, { levelTotal: y = 3 } = e;
  const j = (C, M, Y) => Math.min(Y, Math.max(M, C));
  let $ = j(m, 1, n), x = 1;
  const w = (C) => {
    s(8, x = C >= 0 ? 1 : -1), s(4, $ = j($ + C, 1, n));
  }, S = () => w(-1), _ = () => w(1);
  return t.$$set = (C) => {
    "title" in C && s(0, o = C.title), "subtitle" in C && s(11, v = C.subtitle), "description" in C && s(1, u = C.description), "progress" in C && s(12, h = C.progress), "total" in C && s(13, d = C.total), "xp" in C && s(2, g = C.xp), "status" in C && s(3, p = C.status), "levelIndex" in C && s(14, m = C.levelIndex), "levelTotal" in C && s(15, y = C.levelTotal);
  }, t.$$.update = () => {
    t.$$.dirty & /*total*/
    8192 && s(6, l = Math.max(1, d)), t.$$.dirty & /*progress, safeTotal*/
    4160 && s(7, i = j(h, 0, l)), t.$$.dirty & /*safeProgress, safeTotal*/
    192 && s(16, c = i / l), t.$$.dirty & /*ratio*/
    65536 && s(9, r = Math.round(c * 100)), t.$$.dirty & /*levelTotal*/
    32768 && s(5, n = Math.max(1, y)), t.$$.dirty & /*levelIndex, activeLevel, safeLevelTotal*/
    16432 && m !== $ && s(4, $ = j(m, 1, n));
  }, [
    o,
    u,
    g,
    p,
    $,
    n,
    l,
    i,
    x,
    r,
    w,
    v,
    h,
    d,
    m,
    y,
    c,
    S,
    _
  ];
}
class kt extends K {
  constructor(e) {
    super(), U(
      this,
      e,
      $s,
      qs,
      X,
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
      ws
    );
  }
  get title() {
    return this.$$.ctx[0];
  }
  set title(e) {
    this.$$set({ title: e }), k();
  }
  get subtitle() {
    return this.$$.ctx[11];
  }
  set subtitle(e) {
    this.$$set({ subtitle: e }), k();
  }
  get description() {
    return this.$$.ctx[1];
  }
  set description(e) {
    this.$$set({ description: e }), k();
  }
  get progress() {
    return this.$$.ctx[12];
  }
  set progress(e) {
    this.$$set({ progress: e }), k();
  }
  get total() {
    return this.$$.ctx[13];
  }
  set total(e) {
    this.$$set({ total: e }), k();
  }
  get xp() {
    return this.$$.ctx[2];
  }
  set xp(e) {
    this.$$set({ xp: e }), k();
  }
  get status() {
    return this.$$.ctx[3];
  }
  set status(e) {
    this.$$set({ status: e }), k();
  }
  get levelIndex() {
    return this.$$.ctx[14];
  }
  set levelIndex(e) {
    this.$$set({ levelIndex: e }), k();
  }
  get levelTotal() {
    return this.$$.ctx[15];
  }
  set levelTotal(e) {
    this.$$set({ levelTotal: e }), k();
  }
}
J(kt, { title: {}, subtitle: {}, description: {}, progress: {}, total: {}, xp: {}, status: {}, levelIndex: {}, levelTotal: {} }, [], [], !0);
function zs(t) {
  V(t, "svelte-12k2sv8", ".card.svelte-12k2sv8{position:relative;border-radius:18px;border:1px solid #e2e8f0;background:linear-gradient(160deg, #ffffff, #ecfdf5);padding:18px;overflow:hidden;transform:perspective(800px) rotateX(var(--rx)) rotateY(var(--ry));transition:transform 0.2s ease;box-shadow:0 18px 32px rgba(15, 23, 42, 0.12)}.shine.svelte-12k2sv8{position:absolute;inset:0;background:radial-gradient(circle at var(--shine) 20%, rgba(16, 185, 129, 0.22), transparent 55%);pointer-events:none}.content.svelte-12k2sv8{position:relative;display:grid;gap:6px}.title.svelte-12k2sv8{margin:0;font-size:12px;color:#64748b;letter-spacing:0.08em;text-transform:uppercase}.value.svelte-12k2sv8{margin:0;font-size:28px;font-weight:700;color:#0f172a}.hint.svelte-12k2sv8{margin:0;font-size:12px;color:#475569}");
}
function Cs(t) {
  let e, s, l, i, c, r, n, o, v, u, h, d, g, p, m;
  return {
    c() {
      e = b("div"), s = b("div"), l = z(), i = b("div"), c = b("p"), r = q(
        /*title*/
        t[0]
      ), n = z(), o = b("p"), v = q(
        /*value*/
        t[1]
      ), u = z(), h = b("p"), d = q(
        /*hint*/
        t[2]
      ), f(s, "class", "shine svelte-12k2sv8"), f(c, "class", "title svelte-12k2sv8"), f(o, "class", "value svelte-12k2sv8"), f(h, "class", "hint svelte-12k2sv8"), f(i, "class", "content svelte-12k2sv8"), f(e, "class", "card svelte-12k2sv8"), f(e, "style", g = `--rx:${/*rx*/
      t[3]}deg; --ry:${/*ry*/
      t[4]}deg; --shine:${/*shine*/
      t[5]}%`);
    },
    m(y, j) {
      I(y, e, j), a(e, s), a(e, l), a(e, i), a(i, c), a(c, r), a(i, n), a(i, o), a(o, v), a(i, u), a(i, h), a(h, d), p || (m = [
        N(
          e,
          "pointermove",
          /*handleMove*/
          t[6]
        ),
        N(
          e,
          "pointerleave",
          /*reset*/
          t[7]
        )
      ], p = !0);
    },
    p(y, [j]) {
      j & /*title*/
      1 && E(
        r,
        /*title*/
        y[0]
      ), j & /*value*/
      2 && E(
        v,
        /*value*/
        y[1]
      ), j & /*hint*/
      4 && E(
        d,
        /*hint*/
        y[2]
      ), j & /*rx, ry, shine*/
      56 && g !== (g = `--rx:${/*rx*/
      y[3]}deg; --ry:${/*ry*/
      y[4]}deg; --shine:${/*shine*/
      y[5]}%`) && f(e, "style", g);
    },
    i: L,
    o: L,
    d(y) {
      y && A(e), p = !1, H(m);
    }
  };
}
function js(t, e, s) {
  let { title: l = "Pulso Focus" } = e, { value: i = "78%" } = e, { hint: c = "Calma sostenida" } = e, { intensity: r = 10 } = e, n = 0, o = 0, v = 0;
  const u = (d) => {
    const g = d.currentTarget.getBoundingClientRect(), p = (d.clientX - g.left) / g.width - 0.5, m = (d.clientY - g.top) / g.height - 0.5;
    s(3, n = m * r * -1), s(4, o = p * r), s(5, v = (p + m + 1) * 25);
  }, h = () => {
    s(3, n = 0), s(4, o = 0), s(5, v = 0);
  };
  return t.$$set = (d) => {
    "title" in d && s(0, l = d.title), "value" in d && s(1, i = d.value), "hint" in d && s(2, c = d.hint), "intensity" in d && s(8, r = d.intensity);
  }, [l, i, c, n, o, v, u, h, r];
}
class _t extends K {
  constructor(e) {
    super(), U(
      this,
      e,
      js,
      Cs,
      X,
      {
        title: 0,
        value: 1,
        hint: 2,
        intensity: 8
      },
      zs
    );
  }
  get title() {
    return this.$$.ctx[0];
  }
  set title(e) {
    this.$$set({ title: e }), k();
  }
  get value() {
    return this.$$.ctx[1];
  }
  set value(e) {
    this.$$set({ value: e }), k();
  }
  get hint() {
    return this.$$.ctx[2];
  }
  set hint(e) {
    this.$$set({ hint: e }), k();
  }
  get intensity() {
    return this.$$.ctx[8];
  }
  set intensity(e) {
    this.$$set({ intensity: e }), k();
  }
}
J(_t, { title: {}, value: {}, hint: {}, intensity: {} }, [], [], !0);
function Ss(t) {
  V(t, "svelte-1czrcz8", '.counter.svelte-1czrcz8{border-radius:16px;border:1px solid #e2e8f0;padding:16px;background:#ffffff;display:grid;gap:10px;box-shadow:0 12px 22px rgba(15, 23, 42, 0.08)}.label.svelte-1czrcz8{margin:0;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.08em}.value.svelte-1czrcz8{font-size:32px;font-weight:700;color:#0f172a;position:relative;animation:svelte-1czrcz8-flip 0.5s ease}.value.svelte-1czrcz8::after{content:"";position:absolute;left:0;right:0;bottom:-4px;height:3px;border-radius:999px;background:var(--tone);animation:svelte-1czrcz8-sweep 0.6s ease}@keyframes svelte-1czrcz8-flip{0%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:translateY(0)}}@keyframes svelte-1czrcz8-sweep{from{transform:scaleX(0.2)}to{transform:scaleX(1)}}');
}
function We(t) {
  let e, s;
  return {
    c() {
      e = b("div"), s = q(
        /*value*/
        t[1]
      ), f(e, "class", "value svelte-1czrcz8");
    },
    m(l, i) {
      I(l, e, i), a(e, s);
    },
    p(l, i) {
      i & /*value*/
      2 && E(
        s,
        /*value*/
        l[1]
      );
    },
    d(l) {
      l && A(e);
    }
  };
}
function Es(t) {
  let e, s, l, i, c = (
    /*value*/
    t[1]
  ), r, n = We(t);
  return {
    c() {
      e = b("div"), s = b("p"), l = q(
        /*label*/
        t[0]
      ), i = z(), n.c(), f(s, "class", "label svelte-1czrcz8"), f(e, "class", "counter svelte-1czrcz8"), f(e, "style", r = `--tone:${/*tone*/
      t[2]}`);
    },
    m(o, v) {
      I(o, e, v), a(e, s), a(s, l), a(e, i), n.m(e, null);
    },
    p(o, [v]) {
      v & /*label*/
      1 && E(
        l,
        /*label*/
        o[0]
      ), v & /*value*/
      2 && X(c, c = /*value*/
      o[1]) ? (n.d(1), n = We(o), n.c(), n.m(e, null)) : n.p(o, v), v & /*tone*/
      4 && r !== (r = `--tone:${/*tone*/
      o[2]}`) && f(e, "style", r);
    },
    i: L,
    o: L,
    d(o) {
      o && A(e), n.d(o);
    }
  };
}
function Ls(t, e, s) {
  let { label: l = "Sesiones" } = e, { value: i = 12 } = e, { tone: c = "#10b981" } = e;
  return t.$$set = (r) => {
    "label" in r && s(0, l = r.label), "value" in r && s(1, i = r.value), "tone" in r && s(2, c = r.tone);
  }, [l, i, c];
}
class wt extends K {
  constructor(e) {
    super(), U(this, e, Ls, Es, X, { label: 0, value: 1, tone: 2 }, Ss);
  }
  get label() {
    return this.$$.ctx[0];
  }
  set label(e) {
    this.$$set({ label: e }), k();
  }
  get value() {
    return this.$$.ctx[1];
  }
  set value(e) {
    this.$$set({ value: e }), k();
  }
  get tone() {
    return this.$$.ctx[2];
  }
  set tone(e) {
    this.$$set({ tone: e }), k();
  }
}
J(wt, { label: {}, value: {}, tone: {} }, [], [], !0);
function Ms(t) {
  V(t, "svelte-pocpcm", ".stack.svelte-pocpcm{position:relative;height:160px;border-radius:18px;border:1px solid #e2e8f0;background:linear-gradient(140deg, #ffffff, #ecfdf5);overflow:hidden;transform:perspective(900px) rotateX(var(--rx)) rotateY(var(--ry));transition:transform 0.2s ease}.bg.svelte-pocpcm{position:absolute;inset:0;background:radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.15), transparent 60%)}.layer.svelte-pocpcm{position:absolute;border-radius:999px;filter:blur(calc(var(--blur) * 10px));opacity:0.75}.layer-a.svelte-pocpcm{width:120px;height:120px;background:rgba(16, 185, 129, 0.45);transform:translate(calc(var(--px) * 0.6), calc(var(--py) * 0.6));top:20px;left:14px}.layer-b.svelte-pocpcm{width:90px;height:90px;background:rgba(52, 211, 153, 0.5);transform:translate(calc(var(--px) * 1.2), calc(var(--py) * 1.2));bottom:18px;right:20px}.layer-c.svelte-pocpcm{width:70px;height:70px;background:rgba(14, 116, 144, 0.3);transform:translate(calc(var(--px) * 1.6), calc(var(--py) * 1.6));top:30px;right:70px}.label.svelte-pocpcm{position:absolute;left:16px;bottom:14px;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#0f172a;background:rgba(255, 255, 255, 0.7);padding:4px 8px;border-radius:999px}");
}
function As(t) {
  let e, s, l, i, c, r, n, o, v, u, h, d, g, p;
  return {
    c() {
      e = b("div"), s = b("div"), l = z(), i = b("div"), c = z(), r = b("div"), n = z(), o = b("div"), v = z(), u = b("div"), h = q(
        /*title*/
        t[0]
      ), f(s, "class", "bg svelte-pocpcm"), f(i, "class", "layer layer-a svelte-pocpcm"), f(r, "class", "layer layer-b svelte-pocpcm"), f(o, "class", "layer layer-c svelte-pocpcm"), f(u, "class", "label svelte-pocpcm"), f(e, "class", "stack svelte-pocpcm"), f(e, "style", d = `--rx:${/*rx*/
      t[2]}deg; --ry:${/*ry*/
      t[3]}deg; --px:${/*px*/
      t[4]}px; --py:${/*py*/
      t[5]}px; --blur:${/*blurAmount*/
      t[1]}`);
    },
    m(m, y) {
      I(m, e, y), a(e, s), a(e, l), a(e, i), a(e, c), a(e, r), a(e, n), a(e, o), a(e, v), a(e, u), a(u, h), g || (p = [
        N(
          e,
          "pointermove",
          /*handleMove*/
          t[6]
        ),
        N(
          e,
          "pointerleave",
          /*reset*/
          t[7]
        )
      ], g = !0);
    },
    p(m, [y]) {
      y & /*title*/
      1 && E(
        h,
        /*title*/
        m[0]
      ), y & /*rx, ry, px, py, blurAmount*/
      62 && d !== (d = `--rx:${/*rx*/
      m[2]}deg; --ry:${/*ry*/
      m[3]}deg; --px:${/*px*/
      m[4]}px; --py:${/*py*/
      m[5]}px; --blur:${/*blurAmount*/
      m[1]}`) && f(e, "style", d);
    },
    i: L,
    o: L,
    d(m) {
      m && A(e), g = !1, H(p);
    }
  };
}
function Rs(t, e, s) {
  let { title: l = "Capas activas" } = e, { intensity: i = 18 } = e, { blurAmount: c = 0.6 } = e, r = 0, n = 0, o = 0, v = 0;
  const u = (d) => {
    const g = d.currentTarget.getBoundingClientRect(), p = (d.clientX - g.left) / g.width - 0.5, m = (d.clientY - g.top) / g.height - 0.5;
    s(2, r = m * i * -1), s(3, n = p * i), s(4, o = p * 24), s(5, v = m * 24);
  }, h = () => {
    s(2, r = 0), s(3, n = 0), s(4, o = 0), s(5, v = 0);
  };
  return t.$$set = (d) => {
    "title" in d && s(0, l = d.title), "intensity" in d && s(8, i = d.intensity), "blurAmount" in d && s(1, c = d.blurAmount);
  }, [l, c, r, n, o, v, u, h, i];
}
class qt extends K {
  constructor(e) {
    super(), U(this, e, Rs, As, X, { title: 0, intensity: 8, blurAmount: 1 }, Ms);
  }
  get title() {
    return this.$$.ctx[0];
  }
  set title(e) {
    this.$$set({ title: e }), k();
  }
  get intensity() {
    return this.$$.ctx[8];
  }
  set intensity(e) {
    this.$$set({ intensity: e }), k();
  }
  get blurAmount() {
    return this.$$.ctx[1];
  }
  set blurAmount(e) {
    this.$$set({ blurAmount: e }), k();
  }
}
J(qt, { title: {}, intensity: {}, blurAmount: {} }, [], [], !0);
function Is(t) {
  V(t, "svelte-1yc0e5f", `:host{display:block;font-family:'Poppins', 'Manrope', 'Segoe UI', system-ui, sans-serif}.card-shell.svelte-1yc0e5f.svelte-1yc0e5f{position:relative;padding-bottom:18px}.card.svelte-1yc0e5f.svelte-1yc0e5f{position:relative;z-index:1;background:#ffffff;border-radius:16px;overflow:hidden;border:2px solid transparent;box-shadow:0 12px 24px rgba(15, 23, 42, 0.08);transition:transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;cursor:pointer}.card.svelte-1yc0e5f.svelte-1yc0e5f:hover{transform:translateY(-2px);box-shadow:0 18px 32px rgba(15, 23, 42, 0.12),
      0 0 0 2px color-mix(in srgb, var(--category-left) 55%, transparent),
      0 12px 24px color-mix(in srgb, var(--category-right) 35%, transparent)}.card.is-selected.svelte-1yc0e5f.svelte-1yc0e5f{border-color:#10b981;transform:scale(0.99)}.card.is-disabled.svelte-1yc0e5f.svelte-1yc0e5f{opacity:0.5;cursor:not-allowed;pointer-events:none}.thumb.svelte-1yc0e5f.svelte-1yc0e5f{position:relative;background:#f1f5f9;aspect-ratio:16 / 9;overflow:hidden}.thumb.svelte-1yc0e5f img.svelte-1yc0e5f{width:100%;height:100%;object-fit:cover;display:block}.thumb-placeholder.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;inset:0;display:grid;place-items:center;font-size:28px;color:#94a3b8}.thumb-overlay.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;inset:0;background:linear-gradient(180deg, rgba(15, 23, 42, 0) 50%, rgba(15, 23, 42, 0.55) 100%);opacity:0;transition:opacity 0.2s ease}.card.svelte-1yc0e5f:hover .thumb-overlay.svelte-1yc0e5f{opacity:1}.pill-row.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;top:8px;left:8px;display:flex;gap:6px}.pill.svelte-1yc0e5f.svelte-1yc0e5f{padding:4px 8px;border-radius:999px;background:rgba(15, 23, 42, 0.6);color:#ffffff;font-size:11px;font-weight:600}.pill.badge.svelte-1yc0e5f.svelte-1yc0e5f{background:rgba(15, 23, 42, 0.75);text-transform:uppercase;letter-spacing:0.5px}.favorite.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;top:8px;right:8px;border:none;background:rgba(15, 23, 42, 0.35);color:#ffffff;width:30px;height:30px;border-radius:999px;display:grid;place-items:center;cursor:pointer;transition:background 0.2s ease, transform 0.2s ease, color 0.2s ease}.favorite.svelte-1yc0e5f svg.svelte-1yc0e5f{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.6}.favorite.active.svelte-1yc0e5f.svelte-1yc0e5f{background:rgba(255, 255, 255, 0.9);color:#ef4444}.favorite.active.svelte-1yc0e5f svg.svelte-1yc0e5f{fill:currentColor;stroke:none}.favorite.svelte-1yc0e5f.svelte-1yc0e5f:hover{transform:scale(1.05)}.check.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;bottom:8px;left:8px;width:26px;height:26px;border-radius:999px;background:rgba(255, 255, 255, 0.9);border:1px solid #e2e8f0;display:grid;place-items:center;transition:background 0.2s ease, border-color 0.2s ease}.check.svelte-1yc0e5f svg.svelte-1yc0e5f{width:16px;height:16px;fill:#ffffff;opacity:0;transform:scale(0.7);transition:opacity 0.2s ease, transform 0.2s ease}.card.is-selected.svelte-1yc0e5f .check.svelte-1yc0e5f{background:#10b981;border-color:#059669}.card.is-selected.svelte-1yc0e5f .check svg.svelte-1yc0e5f{opacity:1;transform:scale(1)}.body.svelte-1yc0e5f.svelte-1yc0e5f{padding:16px;display:grid;gap:8px}.body.svelte-1yc0e5f h3.svelte-1yc0e5f{margin:0;font-size:15px;font-weight:700;color:#0f172a}.body.svelte-1yc0e5f p.svelte-1yc0e5f{margin:0;font-size:13px;color:#64748b;min-height:34px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.cta.svelte-1yc0e5f.svelte-1yc0e5f{padding:8px 10px;border-radius:10px;text-align:center;font-size:12px;font-weight:600;color:#64748b;background:#f1f5f9;transition:background 0.2s ease, color 0.2s ease}.card.svelte-1yc0e5f:hover .cta.svelte-1yc0e5f{background:#e2e8f0}.cta-selected.svelte-1yc0e5f.svelte-1yc0e5f{background:#d1fae5;color:#047857}.category-lift.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;left:16px;right:16px;bottom:-12px;display:flex;justify-content:center;gap:8px;z-index:0;pointer-events:none;transform:translateY(14px);opacity:0;transition:transform 0.25s ease, opacity 0.2s ease}.category-chip.svelte-1yc0e5f.svelte-1yc0e5f{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:0.4px;color:#ffffff;text-transform:uppercase;background:var(--chip-color);box-shadow:0 10px 20px color-mix(in srgb, var(--chip-color) 35%, transparent)}.card-shell.svelte-1yc0e5f:hover .category-lift.svelte-1yc0e5f,.card-shell.svelte-1yc0e5f:focus-within .category-lift.svelte-1yc0e5f{opacity:1;transform:translateY(0)}`);
}
function Ys(t) {
  let e;
  return {
    c() {
      e = b("div"), e.textContent = "▶", f(e, "class", "thumb-placeholder svelte-1yc0e5f");
    },
    m(s, l) {
      I(s, e, l);
    },
    p: L,
    d(s) {
      s && A(e);
    }
  };
}
function Ns(t) {
  let e, s, l;
  return {
    c() {
      e = b("img"), Ne(e.src, s = /*thumbnail*/
      t[3]) || f(e, "src", s), f(e, "alt", l = `Miniatura de ${/*title*/
      t[0]}`), f(e, "loading", "lazy"), f(e, "class", "svelte-1yc0e5f");
    },
    m(i, c) {
      I(i, e, c);
    },
    p(i, c) {
      c & /*thumbnail*/
      8 && !Ne(e.src, s = /*thumbnail*/
      i[3]) && f(e, "src", s), c & /*title*/
      1 && l !== (l = `Miniatura de ${/*title*/
      i[0]}`) && f(e, "alt", l);
    },
    d(i) {
      i && A(e);
    }
  };
}
function Ze(t) {
  let e, s;
  return {
    c() {
      e = b("div"), s = q(
        /*badge*/
        t[6]
      ), f(e, "class", "pill badge svelte-1yc0e5f");
    },
    m(l, i) {
      I(l, e, i), a(e, s);
    },
    p(l, i) {
      i & /*badge*/
      64 && E(
        s,
        /*badge*/
        l[6]
      );
    },
    d(l) {
      l && A(e);
    }
  };
}
function et(t) {
  let e, s, l, i, c, r = (
    /*categoryRight*/
    t[9] && tt(t)
  );
  return {
    c() {
      e = b("div"), s = b("span"), l = q(
        /*categoryLeft*/
        t[8]
      ), c = z(), r && r.c(), f(s, "class", "category-chip svelte-1yc0e5f"), f(s, "style", i = `--chip-color: ${/*categoryLeftColor*/
      t[10]};`), f(e, "class", "category-lift svelte-1yc0e5f"), f(e, "aria-hidden", "true");
    },
    m(n, o) {
      I(n, e, o), a(e, s), a(s, l), a(e, c), r && r.m(e, null);
    },
    p(n, o) {
      o & /*categoryLeft*/
      256 && E(
        l,
        /*categoryLeft*/
        n[8]
      ), o & /*categoryLeftColor*/
      1024 && i !== (i = `--chip-color: ${/*categoryLeftColor*/
      n[10]};`) && f(s, "style", i), /*categoryRight*/
      n[9] ? r ? r.p(n, o) : (r = tt(n), r.c(), r.m(e, null)) : r && (r.d(1), r = null);
    },
    d(n) {
      n && A(e), r && r.d();
    }
  };
}
function tt(t) {
  let e, s, l;
  return {
    c() {
      e = b("span"), s = q(
        /*categoryRight*/
        t[9]
      ), f(e, "class", "category-chip svelte-1yc0e5f"), f(e, "style", l = `--chip-color: ${/*categoryRightColor*/
      t[11]};`);
    },
    m(i, c) {
      I(i, e, c), a(e, s);
    },
    p(i, c) {
      c & /*categoryRight*/
      512 && E(
        s,
        /*categoryRight*/
        i[9]
      ), c & /*categoryRightColor*/
      2048 && l !== (l = `--chip-color: ${/*categoryRightColor*/
      i[11]};`) && f(e, "style", l);
    },
    d(i) {
      i && A(e);
    }
  };
}
function Ts(t) {
  let e, s, l, i, c, r, n, o, v, u, h, d, g, p, m, y, j, $, x, w, S, _, C, M, Y, B, se, le = (
    /*selected*/
    t[4] ? "Seleccionado" : "Seleccionar video"
  ), ce, ie, W, Z, ne, re, ae, P;
  function O(R, T) {
    return (
      /*thumbnail*/
      R[3] ? Ns : Ys
    );
  }
  let xe = O(t), ee = xe(t), D = (
    /*badge*/
    t[6] && Ze(t)
  ), F = (
    /*categoryLeft*/
    t[8] && et(t)
  );
  return {
    c() {
      e = b("div"), s = b("div"), l = b("div"), ee.c(), i = z(), c = b("div"), r = z(), n = b("div"), o = b("div"), v = q(
        /*duration*/
        t[2]
      ), u = z(), D && D.c(), h = z(), d = b("button"), g = Xe("svg"), p = Xe("path"), j = z(), $ = b("div"), $.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" class="svelte-1yc0e5f"><path d="M9.2 16.2L5.7 12.7l1.4-1.4 2.1 2.1 7.7-7.7 1.4 1.4z"></path></svg>', x = z(), w = b("div"), S = b("h3"), _ = q(
        /*title*/
        t[0]
      ), C = z(), M = b("p"), Y = q(
        /*description*/
        t[1]
      ), B = z(), se = b("div"), ce = q(le), ne = z(), F && F.c(), f(c, "class", "thumb-overlay svelte-1yc0e5f"), f(o, "class", "pill svelte-1yc0e5f"), f(n, "class", "pill-row svelte-1yc0e5f"), f(p, "d", "M12.1 21.2c-0.1 0-0.3 0-0.4-0.1C6.1 18.6 2 15 2 10.4 2 7.6 4.3 5.3 7.1 5.3c1.7 0 3.3 0.8 4.3 2.1 1-1.3 2.6-2.1 4.3-2.1 2.8 0 5.1 2.3 5.1 5.1 0 4.6-4.1 8.2-9.7 10.7-0.1 0-0.2 0.1-0.3 0.1z"), f(g, "viewBox", "0 0 24 24"), f(g, "aria-hidden", "true"), f(g, "class", "svelte-1yc0e5f"), f(d, "class", m = "favorite " + /*favorite*/
      (t[7] ? "active" : "") + " svelte-1yc0e5f"), f(d, "aria-label", y = /*favorite*/
      t[7] ? "Quitar de favoritos" : "Anadir a favoritos"), f($, "class", "check svelte-1yc0e5f"), f(l, "class", "thumb svelte-1yc0e5f"), f(S, "class", "svelte-1yc0e5f"), f(M, "class", "svelte-1yc0e5f"), f(se, "class", ie = "cta " + /*selected*/
      (t[4] ? "cta-selected" : "") + " svelte-1yc0e5f"), f(w, "class", "body svelte-1yc0e5f"), f(s, "class", W = "card " + /*selected*/
      (t[4] ? "is-selected" : "") + " " + /*disabled*/
      (t[5] ? "is-disabled" : "") + " svelte-1yc0e5f"), f(s, "role", "button"), f(
        s,
        "aria-disabled",
        /*disabled*/
        t[5]
      ), f(s, "tabindex", Z = /*disabled*/
      t[5] ? -1 : 0), f(e, "class", "card-shell svelte-1yc0e5f"), f(e, "style", re = `--category-left: ${/*categoryLeftColor*/
      t[10]}; --category-right: ${/*categoryRightColor*/
      t[11]};`);
    },
    m(R, T) {
      I(R, e, T), a(e, s), a(s, l), ee.m(l, null), a(l, i), a(l, c), a(l, r), a(l, n), a(n, o), a(o, v), a(n, u), D && D.m(n, null), a(l, h), a(l, d), a(d, g), a(g, p), a(l, j), a(l, $), a(s, x), a(s, w), a(w, S), a(S, _), a(w, C), a(w, M), a(M, Y), a(w, B), a(w, se), a(se, ce), a(e, ne), F && F.m(e, null), ae || (P = [
        N(
          d,
          "click",
          /*handleFavorite*/
          t[13]
        ),
        N(
          s,
          "click",
          /*handleSelect*/
          t[12]
        ),
        N(
          s,
          "keydown",
          /*handleKeyDown*/
          t[14]
        )
      ], ae = !0);
    },
    p(R, [T]) {
      xe === (xe = O(R)) && ee ? ee.p(R, T) : (ee.d(1), ee = xe(R), ee && (ee.c(), ee.m(l, i))), T & /*duration*/
      4 && E(
        v,
        /*duration*/
        R[2]
      ), /*badge*/
      R[6] ? D ? D.p(R, T) : (D = Ze(R), D.c(), D.m(n, null)) : D && (D.d(1), D = null), T & /*favorite*/
      128 && m !== (m = "favorite " + /*favorite*/
      (R[7] ? "active" : "") + " svelte-1yc0e5f") && f(d, "class", m), T & /*favorite*/
      128 && y !== (y = /*favorite*/
      R[7] ? "Quitar de favoritos" : "Anadir a favoritos") && f(d, "aria-label", y), T & /*title*/
      1 && E(
        _,
        /*title*/
        R[0]
      ), T & /*description*/
      2 && E(
        Y,
        /*description*/
        R[1]
      ), T & /*selected*/
      16 && le !== (le = /*selected*/
      R[4] ? "Seleccionado" : "Seleccionar video") && E(ce, le), T & /*selected*/
      16 && ie !== (ie = "cta " + /*selected*/
      (R[4] ? "cta-selected" : "") + " svelte-1yc0e5f") && f(se, "class", ie), T & /*selected, disabled*/
      48 && W !== (W = "card " + /*selected*/
      (R[4] ? "is-selected" : "") + " " + /*disabled*/
      (R[5] ? "is-disabled" : "") + " svelte-1yc0e5f") && f(s, "class", W), T & /*disabled*/
      32 && f(
        s,
        "aria-disabled",
        /*disabled*/
        R[5]
      ), T & /*disabled*/
      32 && Z !== (Z = /*disabled*/
      R[5] ? -1 : 0) && f(s, "tabindex", Z), /*categoryLeft*/
      R[8] ? F ? F.p(R, T) : (F = et(R), F.c(), F.m(e, null)) : F && (F.d(1), F = null), T & /*categoryLeftColor, categoryRightColor*/
      3072 && re !== (re = `--category-left: ${/*categoryLeftColor*/
      R[10]}; --category-right: ${/*categoryRightColor*/
      R[11]};`) && f(e, "style", re);
    },
    i: L,
    o: L,
    d(R) {
      R && A(e), ee.d(), D && D.d(), F && F.d(), ae = !1, H(P);
    }
  };
}
function Xs(t, e, s) {
  let { videoId: l = "" } = e, { hashedId: i = "" } = e, { title: c = "" } = e, { description: r = "" } = e, { duration: n = "" } = e, { thumbnail: o = "" } = e, { selected: v = !1 } = e, { disabled: u = !1 } = e, { badge: h = "" } = e, { tags: d = [] } = e, { favorite: g = !1 } = e, { categoryLeft: p = "" } = e, { categoryRight: m = "" } = e, { categoryLeftColor: y = "#94a3b8" } = e, { categoryRightColor: j = "#94a3b8" } = e;
  const $ = oe(), x = () => {
    u || $("select", { id: l });
  }, w = (_) => {
    _.stopPropagation(), !u && $("favorite", { hashedId: i });
  }, S = (_) => {
    u || (_.key === "Enter" || _.key === " ") && (_.preventDefault(), x());
  };
  return t.$$set = (_) => {
    "videoId" in _ && s(15, l = _.videoId), "hashedId" in _ && s(16, i = _.hashedId), "title" in _ && s(0, c = _.title), "description" in _ && s(1, r = _.description), "duration" in _ && s(2, n = _.duration), "thumbnail" in _ && s(3, o = _.thumbnail), "selected" in _ && s(4, v = _.selected), "disabled" in _ && s(5, u = _.disabled), "badge" in _ && s(6, h = _.badge), "tags" in _ && s(17, d = _.tags), "favorite" in _ && s(7, g = _.favorite), "categoryLeft" in _ && s(8, p = _.categoryLeft), "categoryRight" in _ && s(9, m = _.categoryRight), "categoryLeftColor" in _ && s(10, y = _.categoryLeftColor), "categoryRightColor" in _ && s(11, j = _.categoryRightColor);
  }, [
    c,
    r,
    n,
    o,
    v,
    u,
    h,
    g,
    p,
    m,
    y,
    j,
    x,
    w,
    S,
    l,
    i,
    d
  ];
}
class $t extends K {
  constructor(e) {
    super(), U(
      this,
      e,
      Xs,
      Ts,
      X,
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
      Is
    );
  }
  get videoId() {
    return this.$$.ctx[15];
  }
  set videoId(e) {
    this.$$set({ videoId: e }), k();
  }
  get hashedId() {
    return this.$$.ctx[16];
  }
  set hashedId(e) {
    this.$$set({ hashedId: e }), k();
  }
  get title() {
    return this.$$.ctx[0];
  }
  set title(e) {
    this.$$set({ title: e }), k();
  }
  get description() {
    return this.$$.ctx[1];
  }
  set description(e) {
    this.$$set({ description: e }), k();
  }
  get duration() {
    return this.$$.ctx[2];
  }
  set duration(e) {
    this.$$set({ duration: e }), k();
  }
  get thumbnail() {
    return this.$$.ctx[3];
  }
  set thumbnail(e) {
    this.$$set({ thumbnail: e }), k();
  }
  get selected() {
    return this.$$.ctx[4];
  }
  set selected(e) {
    this.$$set({ selected: e }), k();
  }
  get disabled() {
    return this.$$.ctx[5];
  }
  set disabled(e) {
    this.$$set({ disabled: e }), k();
  }
  get badge() {
    return this.$$.ctx[6];
  }
  set badge(e) {
    this.$$set({ badge: e }), k();
  }
  get tags() {
    return this.$$.ctx[17];
  }
  set tags(e) {
    this.$$set({ tags: e }), k();
  }
  get favorite() {
    return this.$$.ctx[7];
  }
  set favorite(e) {
    this.$$set({ favorite: e }), k();
  }
  get categoryLeft() {
    return this.$$.ctx[8];
  }
  set categoryLeft(e) {
    this.$$set({ categoryLeft: e }), k();
  }
  get categoryRight() {
    return this.$$.ctx[9];
  }
  set categoryRight(e) {
    this.$$set({ categoryRight: e }), k();
  }
  get categoryLeftColor() {
    return this.$$.ctx[10];
  }
  set categoryLeftColor(e) {
    this.$$set({ categoryLeftColor: e }), k();
  }
  get categoryRightColor() {
    return this.$$.ctx[11];
  }
  set categoryRightColor(e) {
    this.$$set({ categoryRightColor: e }), k();
  }
}
customElements.define("svelte-video-card", J($t, { videoId: {}, hashedId: {}, title: {}, description: {}, duration: {}, thumbnail: {}, selected: { type: "Boolean" }, disabled: { type: "Boolean" }, badge: {}, tags: {}, favorite: { type: "Boolean" }, categoryLeft: {}, categoryRight: {}, categoryLeftColor: {}, categoryRightColor: {} }, [], [], !0));
function Ps(t) {
  const e = t - 1;
  return e * e * e + 1;
}
function st(t, { delay: e = 0, duration: s = 400, easing: l = nt } = {}) {
  const i = +getComputedStyle(t).opacity;
  return {
    delay: e,
    duration: s,
    easing: l,
    css: (c) => `opacity: ${c * i}`
  };
}
function lt(t, { delay: e = 0, duration: s = 400, easing: l = Ps, x: i = 0, y: c = 0, opacity: r = 0 } = {}) {
  const n = getComputedStyle(t), o = +n.opacity, v = n.transform === "none" ? "" : n.transform, u = o * (1 - r), [h, d] = Te(i), [g, p] = Te(c);
  return {
    delay: e,
    duration: s,
    easing: l,
    css: (m, y) => `
			transform: ${v} translate(${(1 - m) * h}${d}, ${(1 - m) * g}${p});
			opacity: ${o - u * y}`
  };
}
function Bs(t) {
  V(t, "svelte-1hb2737", `.overlay.svelte-1hb2737{position:fixed;inset:0;z-index:70;display:flex;align-items:center;justify-content:center;padding:24px;background:radial-gradient(circle at top, rgba(58, 132, 117, 0.2), rgba(0, 0, 0, 0.6));backdrop-filter:blur(6px)}.card.svelte-1hb2737{position:relative;width:min(520px, 92vw);padding:28px 26px 24px;border-radius:24px;background:linear-gradient(135deg, #ffffff 0%, #f4f6f0 100%);box-shadow:0 18px 40px rgba(0, 0, 0, 0.22),
      0 4px 18px rgba(50, 120, 102, 0.18);overflow:hidden}.card.svelte-1hb2737::before{content:"";position:absolute;inset:-1px;border-radius:24px;padding:1px;background:linear-gradient(130deg, rgba(43, 173, 145, 0.5), rgba(255, 255, 255, 0));-webkit-mask:linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none}.badge.svelte-1hb2737{display:inline-flex;align-items:center;padding:6px 12px;border-radius:999px;background:rgba(46, 140, 120, 0.12);color:#1f5f52;font-size:12px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase}h2.svelte-1hb2737{margin:14px 0 8px;font-size:22px;font-weight:700;color:#1f2a26}p.svelte-1hb2737{margin:0;font-size:14px;line-height:1.5;color:#4b5b56}.actions.svelte-1hb2737{margin-top:18px;display:flex;justify-content:flex-end}button.svelte-1hb2737{border:none;border-radius:12px;padding:10px 18px;font-size:14px;font-weight:600;color:#fff;background:linear-gradient(135deg, #2e8c78, #1f6d5e);box-shadow:0 10px 18px rgba(46, 140, 120, 0.28);cursor:pointer}button.svelte-1hb2737:hover{filter:brightness(1.05)}button.svelte-1hb2737:active{transform:translateY(1px)}@media(max-width: 480px){.card.svelte-1hb2737{padding:22px 20px}h2.svelte-1hb2737{font-size:20px}}`);
}
function it(t) {
  let e, s, l, i, c, r, n, o, v, u, h, d, g, p, m, y, j, $;
  return {
    c() {
      e = b("div"), s = b("div"), l = b("div"), l.textContent = "Fin de temporada", i = z(), c = b("h2"), r = q(
        /*title*/
        t[1]
      ), n = z(), o = b("p"), v = q(
        /*message*/
        t[2]
      ), u = z(), h = b("div"), d = b("button"), g = q(
        /*cta*/
        t[3]
      ), f(l, "class", "badge svelte-1hb2737"), f(c, "class", "svelte-1hb2737"), f(o, "class", "svelte-1hb2737"), f(d, "type", "button"), f(d, "class", "svelte-1hb2737"), f(h, "class", "actions svelte-1hb2737"), f(s, "class", "card svelte-1hb2737"), f(e, "class", "overlay svelte-1hb2737"), f(e, "role", "button"), f(e, "tabindex", "0"), f(e, "aria-label", "Cerrar aviso de temporada");
    },
    m(x, w) {
      I(x, e, w), a(e, s), a(s, l), a(s, i), a(s, c), a(c, r), a(s, n), a(s, o), a(o, v), a(s, u), a(s, h), a(h, d), a(d, g), y = !0, j || ($ = [
        N(
          d,
          "click",
          /*handleClose*/
          t[4]
        ),
        N(
          e,
          "click",
          /*handleBackdrop*/
          t[5]
        ),
        N(
          e,
          "keydown",
          /*handleKeydown*/
          t[6]
        )
      ], j = !0);
    },
    p(x, w) {
      (!y || w & /*title*/
      2) && E(
        r,
        /*title*/
        x[1]
      ), (!y || w & /*message*/
      4) && E(
        v,
        /*message*/
        x[2]
      ), (!y || w & /*cta*/
      8) && E(
        g,
        /*cta*/
        x[3]
      );
    },
    i(x) {
      y || (x && ve(() => {
        y && (p || (p = _e(s, lt, { y: 18, duration: 240 }, !0)), p.run(1));
      }), x && ve(() => {
        y && (m || (m = _e(e, st, { duration: 180 }, !0)), m.run(1));
      }), y = !0);
    },
    o(x) {
      x && (p || (p = _e(s, lt, { y: 18, duration: 240 }, !1)), p.run(0)), x && (m || (m = _e(e, st, { duration: 180 }, !1)), m.run(0)), y = !1;
    },
    d(x) {
      x && A(e), x && p && p.end(), x && m && m.end(), j = !1, H($);
    }
  };
}
function Os(t) {
  let e, s = (
    /*open*/
    t[0] && it(t)
  );
  return {
    c() {
      s && s.c(), e = At();
    },
    m(l, i) {
      s && s.m(l, i), I(l, e, i);
    },
    p(l, [i]) {
      /*open*/
      l[0] ? s ? (s.p(l, i), i & /*open*/
      1 && me(s, 1)) : (s = it(l), s.c(), me(s, 1), s.m(e.parentNode, e)) : s && (Vt(), De(s, 1, 1, () => {
        s = null;
      }), Ut());
    },
    i(l) {
      me(s);
    },
    o(l) {
      De(s);
    },
    d(l) {
      l && A(e), s && s.d(l);
    }
  };
}
function Ds(t, e, s) {
  let { open: l = !1 } = e, { title: i = "Temporada finalizada" } = e, { message: c = "La temporada actual ha terminado. Tus logros de temporada se reiniciaran para un nuevo ciclo." } = e, { cta: r = "Entendido" } = e;
  const n = oe(), o = () => {
    s(0, l = !1), n("dismiss");
  }, v = (h) => {
    h.target === h.currentTarget && o();
  }, u = (h) => {
    const d = h.key;
    (d === "Escape" || d === "Enter" || d === " ") && o();
  };
  return t.$$set = (h) => {
    "open" in h && s(0, l = h.open), "title" in h && s(1, i = h.title), "message" in h && s(2, c = h.message), "cta" in h && s(3, r = h.cta);
  }, [l, i, c, r, o, v, u];
}
class zt extends K {
  constructor(e) {
    super(), U(this, e, Ds, Os, X, { open: 0, title: 1, message: 2, cta: 3 }, Bs);
  }
  get open() {
    return this.$$.ctx[0];
  }
  set open(e) {
    this.$$set({ open: e }), k();
  }
  get title() {
    return this.$$.ctx[1];
  }
  set title(e) {
    this.$$set({ title: e }), k();
  }
  get message() {
    return this.$$.ctx[2];
  }
  set message(e) {
    this.$$set({ message: e }), k();
  }
  get cta() {
    return this.$$.ctx[3];
  }
  set cta(e) {
    this.$$set({ cta: e }), k();
  }
}
customElements.define("svelte-season-popup", J(zt, { open: { type: "Boolean" }, title: {}, message: {}, cta: {} }, [], [], !0));
const Q = (t, e) => {
  const s = e.element;
  customElements.get(t) || customElements.define(t, s ?? e);
};
Q("svelte-counter", gt);
Q("svelte-orbit-card", vt);
Q("svelte-pulse-badge", pt);
Q("svelte-ripple-button", ht);
Q("svelte-stagger-list", bt);
Q("svelte-thermometer", mt);
Q("svelte-podium", yt);
Q("svelte-balloon-gift", xt);
Q("svelte-achievement-card", kt);
Q("svelte-parallax-card", _t);
Q("svelte-flip-counter", wt);
Q("svelte-parallax-stack", qt);
Q("svelte-video-card", $t);
Q("svelte-season-popup", zt);
