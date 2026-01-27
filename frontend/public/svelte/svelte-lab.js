var nt = Object.defineProperty;
var at = (t, e, s) => e in t ? nt(t, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : t[e] = s;
var G = (t, e, s) => at(t, typeof e != "symbol" ? e + "" : e, s);
function E() {
}
function Pe(t) {
  return t();
}
function qe() {
  return /* @__PURE__ */ Object.create(null);
}
function W(t) {
  t.forEach(Pe);
}
function Oe(t) {
  return typeof t == "function";
}
function B(t, e) {
  return t != t ? e == e : t !== e || t && typeof t == "object" || typeof t == "function";
}
let pe;
function $e(t, e) {
  return t === e ? !0 : (pe || (pe = document.createElement("a")), pe.href = e, t === pe.href);
}
function rt(t) {
  return Object.keys(t).length === 0;
}
function me(t) {
  return t ?? "";
}
function r(t, e) {
  t.appendChild(e);
}
function F(t, e, s) {
  const i = ot(t);
  if (!i.getElementById(e)) {
    const l = h("style");
    l.id = e, l.textContent = s, ct(i, l);
  }
}
function ot(t) {
  if (!t) return document;
  const e = t.getRootNode ? t.getRootNode() : t.ownerDocument;
  return e && /** @type {ShadowRoot} */
  e.host ? (
    /** @type {ShadowRoot} */
    e
  ) : t.ownerDocument;
}
function ct(t, e) {
  return r(
    /** @type {Document} */
    t.head || t,
    e
  ), e.sheet;
}
function Y(t, e, s) {
  t.insertBefore(e, s || null);
}
function R(t) {
  t.parentNode && t.parentNode.removeChild(t);
}
function h(t) {
  return document.createElement(t);
}
function ze(t) {
  return document.createElementNS("http://www.w3.org/2000/svg", t);
}
function w(t) {
  return document.createTextNode(t);
}
function z() {
  return w(" ");
}
function N(t, e, s, i) {
  return t.addEventListener(e, s, i), () => t.removeEventListener(e, s, i);
}
function c(t, e, s) {
  s == null ? t.removeAttribute(e) : t.getAttribute(e) !== s && t.setAttribute(e, s);
}
function ft(t) {
  return Array.from(t.childNodes);
}
function L(t, e) {
  e = "" + e, t.data !== e && (t.data = /** @type {string} */
  e);
}
function dt(t, e, { bubbles: s = !1, cancelable: i = !1 } = {}) {
  return new CustomEvent(t, { detail: e, bubbles: s, cancelable: i });
}
function ut(t) {
  const e = {};
  return t.childNodes.forEach(
    /** @param {Element} node */
    (s) => {
      e[s.slot || "default"] = !0;
    }
  ), e;
}
let ge;
function ve(t) {
  ge = t;
}
function De() {
  if (!ge) throw new Error("Function called outside component initialization");
  return ge;
}
function vt(t) {
  De().$$.on_mount.push(t);
}
function ue() {
  const t = De();
  return (e, s, { cancelable: i = !1 } = {}) => {
    const l = t.$$.callbacks[e];
    if (l) {
      const f = dt(
        /** @type {string} */
        e,
        s,
        { cancelable: i }
      );
      return l.slice().forEach((n) => {
        n.call(t, f);
      }), !f.defaultPrevented;
    }
    return !0;
  };
}
const ce = [], je = [];
let fe = [];
const Ce = [], gt = /* @__PURE__ */ Promise.resolve();
let xe = !1;
function ht() {
  xe || (xe = !0, gt.then(y));
}
function ke(t) {
  fe.push(t);
}
const ye = /* @__PURE__ */ new Set();
let oe = 0;
function y() {
  if (oe !== 0)
    return;
  const t = ge;
  do {
    try {
      for (; oe < ce.length; ) {
        const e = ce[oe];
        oe++, ve(e), pt(e.$$);
      }
    } catch (e) {
      throw ce.length = 0, oe = 0, e;
    }
    for (ve(null), ce.length = 0, oe = 0; je.length; ) je.pop()();
    for (let e = 0; e < fe.length; e += 1) {
      const s = fe[e];
      ye.has(s) || (ye.add(s), s());
    }
    fe.length = 0;
  } while (ce.length);
  for (; Ce.length; )
    Ce.pop()();
  xe = !1, ye.clear(), ve(t);
}
function pt(t) {
  if (t.fragment !== null) {
    t.update(), W(t.before_update);
    const e = t.dirty;
    t.dirty = [-1], t.fragment && t.fragment.p(t.ctx, e), t.after_update.forEach(ke);
  }
}
function bt(t) {
  const e = [], s = [];
  fe.forEach((i) => t.indexOf(i) === -1 ? e.push(i) : s.push(i)), s.forEach((i) => i()), fe = e;
}
const mt = /* @__PURE__ */ new Set();
function He(t, e) {
  t && t.i && (mt.delete(t), t.i(e));
}
function de(t) {
  return (t == null ? void 0 : t.length) !== void 0 ? t : Array.from(t);
}
function we(t, e) {
  t.d(1), e.delete(t.key);
}
function _e(t, e, s, i, l, f, n, a, o, g, u, b) {
  let d = t.length, v = f.length, p = d;
  const m = {};
  for (; p--; ) m[t[p].key] = p;
  const k = [], S = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), q = [];
  for (p = v; p--; ) {
    const $ = b(l, f, p), M = s($);
    let A = n.get(M);
    A ? q.push(() => A.p($, e)) : (A = g(M, $), A.c()), S.set(M, k[p] = A), M in m && j.set(M, Math.abs(p - m[M]));
  }
  const _ = /* @__PURE__ */ new Set(), C = /* @__PURE__ */ new Set();
  function x($) {
    He($, 1), $.m(a, u), n.set($.key, $), u = $.first, v--;
  }
  for (; d && v; ) {
    const $ = k[v - 1], M = t[d - 1], A = $.key, P = M.key;
    $ === M ? (u = $.first, d--, v--) : S.has(P) ? !n.has(A) || _.has(A) ? x($) : C.has(P) ? d-- : j.get(A) > j.get(P) ? (C.add(A), x($)) : (_.add(P), d--) : (o(M, n), d--);
  }
  for (; d--; ) {
    const $ = t[d];
    S.has($.key) || o($, n);
  }
  for (; v; ) x(k[v - 1]);
  return W(q), k;
}
function yt(t, e, s) {
  const { fragment: i, after_update: l } = t.$$;
  i && i.m(e, s), ke(() => {
    const f = t.$$.on_mount.map(Pe).filter(Oe);
    t.$$.on_destroy ? t.$$.on_destroy.push(...f) : W(f), t.$$.on_mount = [];
  }), l.forEach(ke);
}
function xt(t, e) {
  const s = t.$$;
  s.fragment !== null && (bt(s.after_update), W(s.on_destroy), s.fragment && s.fragment.d(e), s.on_destroy = s.fragment = null, s.ctx = []);
}
function kt(t, e) {
  t.$$.dirty[0] === -1 && (ce.push(t), ht(), t.$$.dirty.fill(0)), t.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function V(t, e, s, i, l, f, n = null, a = [-1]) {
  const o = ge;
  ve(t);
  const g = t.$$ = {
    fragment: null,
    ctx: [],
    // state
    props: f,
    update: E,
    not_equal: l,
    bound: qe(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(e.context || (o ? o.$$.context : [])),
    // everything else
    callbacks: qe(),
    dirty: a,
    skip_bound: !1,
    root: e.target || o.$$.root
  };
  n && n(g.root);
  let u = !1;
  if (g.ctx = s ? s(t, e.props || {}, (b, d, ...v) => {
    const p = v.length ? v[0] : d;
    return g.ctx && l(g.ctx[b], g.ctx[b] = p) && (!g.skip_bound && g.bound[b] && g.bound[b](p), u && kt(t, b)), d;
  }) : [], g.update(), u = !0, W(g.before_update), g.fragment = i ? i(g.ctx) : !1, e.target) {
    if (e.hydrate) {
      const b = ft(e.target);
      g.fragment && g.fragment.l(b), b.forEach(R);
    } else
      g.fragment && g.fragment.c();
    e.intro && He(t.$$.fragment), yt(t, e.target, e.anchor), y();
  }
  ve(o);
}
let Fe;
typeof HTMLElement == "function" && (Fe = class extends HTMLElement {
  constructor(e, s, i) {
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
    this.$$ctor = e, this.$$s = s, i && this.attachShadow({ mode: "open" });
  }
  addEventListener(e, s, i) {
    if (this.$$l[e] = this.$$l[e] || [], this.$$l[e].push(s), this.$$c) {
      const l = this.$$c.$on(e, s);
      this.$$l_u.set(s, l);
    }
    super.addEventListener(e, s, i);
  }
  removeEventListener(e, s, i) {
    if (super.removeEventListener(e, s, i), this.$$c) {
      const l = this.$$l_u.get(s);
      l && (l(), this.$$l_u.delete(s));
    }
    if (this.$$l[e]) {
      const l = this.$$l[e].indexOf(s);
      l >= 0 && this.$$l[e].splice(l, 1);
    }
  }
  async connectedCallback() {
    if (this.$$cn = !0, !this.$$c) {
      let s = function(n) {
        return () => {
          let a;
          return {
            c: function() {
              a = h("slot"), n !== "default" && c(a, "name", n);
            },
            /**
             * @param {HTMLElement} target
             * @param {HTMLElement} [anchor]
             */
            m: function(u, b) {
              Y(u, a, b);
            },
            d: function(u) {
              u && R(a);
            }
          };
        };
      };
      var e = s;
      if (await Promise.resolve(), !this.$$cn || this.$$c)
        return;
      const i = {}, l = ut(this);
      for (const n of this.$$s)
        n in l && (i[n] = [s(n)]);
      for (const n of this.attributes) {
        const a = this.$$g_p(n.name);
        a in this.$$d || (this.$$d[a] = be(a, n.value, this.$$p_d, "toProp"));
      }
      for (const n in this.$$p_d)
        !(n in this.$$d) && this[n] !== void 0 && (this.$$d[n] = this[n], delete this[n]);
      this.$$c = new this.$$ctor({
        target: this.shadowRoot || this,
        props: {
          ...this.$$d,
          $$slots: i,
          $$scope: {
            ctx: []
          }
        }
      });
      const f = () => {
        this.$$r = !0;
        for (const n in this.$$p_d)
          if (this.$$d[n] = this.$$c.$$.ctx[this.$$c.$$.props[n]], this.$$p_d[n].reflect) {
            const a = be(
              n,
              this.$$d[n],
              this.$$p_d,
              "toAttribute"
            );
            a == null ? this.removeAttribute(this.$$p_d[n].attribute || n) : this.setAttribute(this.$$p_d[n].attribute || n, a);
          }
        this.$$r = !1;
      };
      this.$$c.$$.after_update.push(f), f();
      for (const n in this.$$l)
        for (const a of this.$$l[n]) {
          const o = this.$$c.$on(n, a);
          this.$$l_u.set(a, o);
        }
      this.$$l = {};
    }
  }
  // We don't need this when working within Svelte code, but for compatibility of people using this outside of Svelte
  // and setting attributes through setAttribute etc, this is helpful
  attributeChangedCallback(e, s, i) {
    var l;
    this.$$r || (e = this.$$g_p(e), this.$$d[e] = be(e, i, this.$$p_d, "toProp"), (l = this.$$c) == null || l.$set({ [e]: this.$$d[e] }));
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
function be(t, e, s, i) {
  var f;
  const l = (f = s[t]) == null ? void 0 : f.type;
  if (e = l === "Boolean" && typeof e != "boolean" ? e != null : e, !i || !s[t])
    return e;
  if (i === "toAttribute")
    switch (l) {
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
    switch (l) {
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
function J(t, e, s, i, l, f) {
  let n = class extends Fe {
    constructor() {
      super(t, s, l), this.$$p_d = e;
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
      set(o) {
        var g;
        o = be(a, o, e), this.$$d[a] = o, (g = this.$$c) == null || g.$set({ [a]: o });
      }
    });
  }), i.forEach((a) => {
    Object.defineProperty(n.prototype, a, {
      get() {
        var o;
        return (o = this.$$c) == null ? void 0 : o[a];
      }
    });
  }), t.element = /** @type {any} */
  n, n;
}
class Q {
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
    xt(this, 1), this.$destroy = E;
  }
  /**
   * @template {Extract<keyof Events, string>} K
   * @param {K} type
   * @param {((e: Events[K]) => void) | null | undefined} callback
   * @returns {() => void}
   */
  $on(e, s) {
    if (!Oe(s))
      return E;
    const i = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
    return i.push(s), () => {
      const l = i.indexOf(s);
      l !== -1 && i.splice(l, 1);
    };
  }
  /**
   * @param {Partial<Props>} props
   * @returns {void}
   */
  $set(e) {
    this.$$set && !rt(e) && (this.$$.skip_bound = !0, this.$$set(e), this.$$.skip_bound = !1);
  }
}
const wt = "4";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(wt);
function _t(t) {
  F(t, "svelte-1tevv97", '.card.svelte-1tevv97{border-radius:14px;border:1px solid #e2e8f0;padding:16px;display:grid;gap:12px;font-family:"Figtree", system-ui, sans-serif;background:#ffffff;box-shadow:0 12px 24px rgba(15, 23, 42, 0.08)}.label.svelte-1tevv97{font-size:14px;color:#0f172a;margin:0}.count.svelte-1tevv97{font-weight:600;font-size:20px;color:#0f172a;margin:0}button.svelte-1tevv97{border:0;border-radius:10px;padding:10px 12px;background:#10b981;color:white;cursor:pointer;font-weight:600}button.svelte-1tevv97:hover{background:#059669}');
}
function qt(t) {
  let e, s, i, l, f, n, a, o, g, u, b, d;
  return {
    c() {
      e = h("div"), s = h("p"), i = w("Hola "), l = w(
        /*name*/
        t[0]
      ), f = z(), n = h("p"), a = w("Count: "), o = w(
        /*count*/
        t[1]
      ), g = z(), u = h("button"), u.textContent = "Emitir evento", c(s, "class", "label svelte-1tevv97"), c(n, "class", "count svelte-1tevv97"), c(u, "type", "button"), c(u, "class", "svelte-1tevv97"), c(e, "class", "card svelte-1tevv97");
    },
    m(v, p) {
      Y(v, e, p), r(e, s), r(s, i), r(s, l), r(e, f), r(e, n), r(n, a), r(n, o), r(e, g), r(e, u), b || (d = N(
        u,
        "click",
        /*notify*/
        t[2]
      ), b = !0);
    },
    p(v, [p]) {
      p & /*name*/
      1 && L(
        l,
        /*name*/
        v[0]
      ), p & /*count*/
      2 && L(
        o,
        /*count*/
        v[1]
      );
    },
    i: E,
    o: E,
    d(v) {
      v && R(e), b = !1, d();
    }
  };
}
function $t(t, e, s) {
  let { name: i = "Ada" } = e, { count: l = 2 } = e;
  const f = ue(), n = () => {
    f("ping", { from: "svelte", count: l });
  };
  return t.$$set = (a) => {
    "name" in a && s(0, i = a.name), "count" in a && s(1, l = a.count);
  }, [i, l, n];
}
class Ve extends Q {
  constructor(e) {
    super(), V(this, e, $t, qt, B, { name: 0, count: 1 }, _t);
  }
  get name() {
    return this.$$.ctx[0];
  }
  set name(e) {
    this.$$set({ name: e }), y();
  }
  get count() {
    return this.$$.ctx[1];
  }
  set count(e) {
    this.$$set({ count: e }), y();
  }
}
J(Ve, { name: {}, count: {} }, [], [], !0);
function zt(t) {
  F(t, "svelte-5733sx", ".card.svelte-5733sx{position:relative;overflow:hidden;border-radius:20px;border:1px solid #d1fae5;background:linear-gradient(145deg, #ffffff, #ecfdf5);padding:20px;min-height:140px;box-shadow:0 16px 36px rgba(15, 23, 42, 0.12)}.glow.svelte-5733sx{position:absolute;inset:-40%;background:radial-gradient(circle at 30% 20%, rgba(16, 185, 129, 0.3), transparent 55%);opacity:0.7;filter:blur(8px)}.content.svelte-5733sx{position:relative;display:grid;gap:8px;color:#0f172a}.title.svelte-5733sx{font-size:16px;font-weight:600;margin:0}.subtitle.svelte-5733sx{font-size:12px;margin:0;color:#64748b}.metrics.svelte-5733sx{margin-top:12px;display:flex;justify-content:space-between;font-size:12px;color:#0f172a}.orbit.svelte-5733sx{position:absolute;inset:-30%;border-radius:999px;border:1px dashed rgba(16, 185, 129, 0.3);animation:svelte-5733sx-orbit 6s linear infinite;opacity:var(--orbit-alpha)}.satellite-orbit.svelte-5733sx{position:absolute;inset:-30%;border-radius:999px;animation:svelte-5733sx-orbit 6s linear infinite}.satellite.svelte-5733sx{position:absolute;width:10px;height:10px;border-radius:999px;background:#34d399;box-shadow:0 0 12px rgba(16, 185, 129, 0.6);top:50%;left:50%;transform:translate(-50%, -50%) translateY(-78px)}@keyframes svelte-5733sx-orbit{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}");
}
function jt(t) {
  let e, s, i, l, f, n, a, o, g, u, b, d, v, p, m, k, S, j, q, _, C, x, $;
  return {
    c() {
      e = h("div"), s = h("div"), i = z(), l = h("div"), f = h("p"), n = w(
        /*title*/
        t[0]
      ), a = z(), o = h("p"), g = w(
        /*subtitle*/
        t[1]
      ), u = z(), b = h("div"), d = h("span"), d.textContent = "Flow", v = z(), p = h("span"), m = w(
        /*flow*/
        t[3]
      ), k = w("%"), S = z(), j = h("div"), j.innerHTML = '<div class="satellite svelte-5733sx"></div>', q = z(), _ = h("div"), c(s, "class", "glow svelte-5733sx"), c(f, "class", "title svelte-5733sx"), c(o, "class", "subtitle svelte-5733sx"), c(b, "class", "metrics svelte-5733sx"), c(l, "class", "content svelte-5733sx"), c(j, "class", "satellite-orbit svelte-5733sx"), c(_, "class", "orbit svelte-5733sx"), c(e, "class", "card svelte-5733sx"), c(e, "style", C = `--orbit-alpha:${/*intensity*/
      t[2]}`), c(e, "role", "button"), c(e, "tabindex", "0");
    },
    m(M, A) {
      Y(M, e, A), r(e, s), r(e, i), r(e, l), r(l, f), r(f, n), r(l, a), r(l, o), r(o, g), r(l, u), r(l, b), r(b, d), r(b, v), r(b, p), r(p, m), r(p, k), r(e, S), r(e, j), r(e, q), r(e, _), x || ($ = [
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
      ], x = !0);
    },
    p(M, [A]) {
      A & /*title*/
      1 && L(
        n,
        /*title*/
        M[0]
      ), A & /*subtitle*/
      2 && L(
        g,
        /*subtitle*/
        M[1]
      ), A & /*flow*/
      8 && L(
        m,
        /*flow*/
        M[3]
      ), A & /*intensity*/
      4 && C !== (C = `--orbit-alpha:${/*intensity*/
      M[2]}`) && c(e, "style", C);
    },
    i: E,
    o: E,
    d(M) {
      M && R(e), x = !1, W($);
    }
  };
}
function Ct(t, e, s) {
  let { title: i = "Focus Ring" } = e, { subtitle: l = "Anillo orbital" } = e, { intensity: f = 0.6 } = e, { flow: n = 78 } = e;
  const a = ue(), o = () => {
    a("hover", { title: i });
  }, g = (u) => {
    (u.key === "Enter" || u.key === " ") && o();
  };
  return t.$$set = (u) => {
    "title" in u && s(0, i = u.title), "subtitle" in u && s(1, l = u.subtitle), "intensity" in u && s(2, f = u.intensity), "flow" in u && s(3, n = u.flow);
  }, [i, l, f, n, o, g];
}
class Je extends Q {
  constructor(e) {
    super(), V(
      this,
      e,
      Ct,
      jt,
      B,
      {
        title: 0,
        subtitle: 1,
        intensity: 2,
        flow: 3
      },
      zt
    );
  }
  get title() {
    return this.$$.ctx[0];
  }
  set title(e) {
    this.$$set({ title: e }), y();
  }
  get subtitle() {
    return this.$$.ctx[1];
  }
  set subtitle(e) {
    this.$$set({ subtitle: e }), y();
  }
  get intensity() {
    return this.$$.ctx[2];
  }
  set intensity(e) {
    this.$$set({ intensity: e }), y();
  }
  get flow() {
    return this.$$.ctx[3];
  }
  set flow(e) {
    this.$$set({ flow: e }), y();
  }
}
J(Je, { title: {}, subtitle: {}, intensity: {}, flow: {} }, [], [], !0);
function St(t) {
  F(t, "svelte-1vzxgvk", ".badge.svelte-1vzxgvk.svelte-1vzxgvk{display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border-radius:999px;border:1px solid transparent;font-size:12px;font-weight:600;letter-spacing:0.02em;cursor:pointer;background:#ecfdf5;color:#065f46}.badge.emerald.svelte-1vzxgvk.svelte-1vzxgvk{border-color:rgba(16, 185, 129, 0.35)}.dot.svelte-1vzxgvk.svelte-1vzxgvk{width:8px;height:8px;border-radius:999px;background:currentColor;box-shadow:0 0 0 rgba(16, 185, 129, 0.6)}.active.svelte-1vzxgvk .dot.svelte-1vzxgvk{animation:svelte-1vzxgvk-pulse 1.8s ease-in-out infinite}@keyframes svelte-1vzxgvk-pulse{0%{box-shadow:0 0 0 0 rgba(16, 185, 129, 0.6)}70%{box-shadow:0 0 0 12px rgba(16, 185, 129, 0)}100%{box-shadow:0 0 0 0 rgba(16, 185, 129, 0)}}");
}
function Lt(t) {
  let e, s, i, l, f, n, a;
  return {
    c() {
      e = h("button"), s = h("span"), i = z(), l = w(
        /*label*/
        t[1]
      ), c(s, "class", "dot svelte-1vzxgvk"), c(e, "class", f = me(`badge ${/*tone*/
      t[2]} ${/*active*/
      t[0] ? "active" : ""}`) + " svelte-1vzxgvk"), c(e, "type", "button");
    },
    m(o, g) {
      Y(o, e, g), r(e, s), r(e, i), r(e, l), n || (a = N(
        e,
        "click",
        /*toggle*/
        t[3]
      ), n = !0);
    },
    p(o, [g]) {
      g & /*label*/
      2 && L(
        l,
        /*label*/
        o[1]
      ), g & /*tone, active*/
      5 && f !== (f = me(`badge ${/*tone*/
      o[2]} ${/*active*/
      o[0] ? "active" : ""}`) + " svelte-1vzxgvk") && c(e, "class", f);
    },
    i: E,
    o: E,
    d(o) {
      o && R(e), n = !1, a();
    }
  };
}
function Mt(t, e, s) {
  let { label: i = "Live" } = e, { tone: l = "emerald" } = e, { active: f = !0 } = e;
  const n = ue(), a = () => {
    s(0, f = !f), n("toggle", { active: f });
  };
  return t.$$set = (o) => {
    "label" in o && s(1, i = o.label), "tone" in o && s(2, l = o.tone), "active" in o && s(0, f = o.active);
  }, [f, i, l, a];
}
class Qe extends Q {
  constructor(e) {
    super(), V(this, e, Mt, Lt, B, { label: 1, tone: 2, active: 0 }, St);
  }
  get label() {
    return this.$$.ctx[1];
  }
  set label(e) {
    this.$$set({ label: e }), y();
  }
  get tone() {
    return this.$$.ctx[2];
  }
  set tone(e) {
    this.$$set({ tone: e }), y();
  }
  get active() {
    return this.$$.ctx[0];
  }
  set active(e) {
    this.$$set({ active: e }), y();
  }
}
J(Qe, { label: {}, tone: {}, active: { type: "Boolean" } }, [], [], !0);
function Et(t) {
  F(t, "svelte-1io8dtn", ".ripple.svelte-1io8dtn{position:relative;overflow:hidden;padding:12px 20px;border-radius:14px;border:none;background:var(--tone);color:#ffffff;font-weight:600;cursor:pointer;box-shadow:0 16px 28px rgba(16, 185, 129, 0.25)}.label.svelte-1io8dtn{position:relative;z-index:1}.wave.svelte-1io8dtn{position:absolute;width:20px;height:20px;border-radius:999px;background:rgba(255, 255, 255, 0.45);transform:translate(-50%, -50%);animation:svelte-1io8dtn-ripple 0.8s ease-out forwards}@keyframes svelte-1io8dtn-ripple{from{opacity:0.7;transform:translate(-50%, -50%) scale(0)}to{opacity:0;transform:translate(-50%, -50%) scale(8)}}");
}
function Se(t, e, s) {
  const i = t.slice();
  return i[7] = e[s], i;
}
function Le(t, e) {
  let s, i, l, f;
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
    key: t,
    first: null,
    c() {
      s = h("span"), c(s, "class", "wave svelte-1io8dtn"), c(s, "style", i = `left:${/*ripple*/
      e[7].x}px; top:${/*ripple*/
      e[7].y}px;`), this.first = s;
    },
    m(a, o) {
      Y(a, s, o), l || (f = N(s, "animationend", n), l = !0);
    },
    p(a, o) {
      e = a, o & /*ripples*/
      4 && i !== (i = `left:${/*ripple*/
      e[7].x}px; top:${/*ripple*/
      e[7].y}px;`) && c(s, "style", i);
    },
    d(a) {
      a && R(s), l = !1, f();
    }
  };
}
function It(t) {
  let e, s = [], i = /* @__PURE__ */ new Map(), l, f, n, a, o, g, u = de(
    /*ripples*/
    t[2]
  );
  const b = (d) => (
    /*ripple*/
    d[7].id
  );
  for (let d = 0; d < u.length; d += 1) {
    let v = Se(t, u, d), p = b(v);
    i.set(p, s[d] = Le(p, v));
  }
  return {
    c() {
      e = h("button");
      for (let d = 0; d < s.length; d += 1)
        s[d].c();
      l = z(), f = h("span"), n = w(
        /*label*/
        t[0]
      ), c(f, "class", "label svelte-1io8dtn"), c(e, "class", "ripple svelte-1io8dtn"), c(e, "type", "button"), c(e, "style", a = `--tone:${/*tone*/
      t[1]}`);
    },
    m(d, v) {
      Y(d, e, v);
      for (let p = 0; p < s.length; p += 1)
        s[p] && s[p].m(e, null);
      r(e, l), r(e, f), r(f, n), o || (g = N(
        e,
        "click",
        /*handleClick*/
        t[3]
      ), o = !0);
    },
    p(d, [v]) {
      v & /*ripples, removeRipple*/
      20 && (u = de(
        /*ripples*/
        d[2]
      ), s = _e(s, v, b, 1, d, u, i, e, we, Le, l, Se)), v & /*label*/
      1 && L(
        n,
        /*label*/
        d[0]
      ), v & /*tone*/
      2 && a !== (a = `--tone:${/*tone*/
      d[1]}`) && c(e, "style", a);
    },
    i: E,
    o: E,
    d(d) {
      d && R(e);
      for (let v = 0; v < s.length; v += 1)
        s[v].d();
      o = !1, g();
    }
  };
}
function At(t, e, s) {
  let { label: i = "Lanzar onda" } = e, { tone: l = "#10b981" } = e;
  const f = ue();
  let n = [];
  const a = (u) => {
    const b = u.currentTarget.getBoundingClientRect(), d = u.clientX - b.left, v = u.clientY - b.top, p = Math.random().toString(36).slice(2);
    s(2, n = [...n, { id: p, x: d, y: v }]), f("ripple", { x: d, y: v });
  }, o = (u) => {
    s(2, n = n.filter((b) => b.id !== u));
  }, g = (u) => o(u.id);
  return t.$$set = (u) => {
    "label" in u && s(0, i = u.label), "tone" in u && s(1, l = u.tone);
  }, [i, l, n, a, o, g];
}
class Ue extends Q {
  constructor(e) {
    super(), V(this, e, At, It, B, { label: 0, tone: 1 }, Et);
  }
  get label() {
    return this.$$.ctx[0];
  }
  set label(e) {
    this.$$set({ label: e }), y();
  }
  get tone() {
    return this.$$.ctx[1];
  }
  set tone(e) {
    this.$$set({ tone: e }), y();
  }
}
J(Ue, { label: {}, tone: {} }, [], [], !0);
function Rt(t) {
  F(t, "svelte-1jr61rp", ".list.svelte-1jr61rp{border-radius:18px;border:1px solid #e2e8f0;background:#ffffff;padding:16px;display:grid;gap:16px}.header.svelte-1jr61rp{display:flex;justify-content:space-between;align-items:center}.title.svelte-1jr61rp{margin:0;font-size:14px;font-weight:600;color:#0f172a}.subtitle.svelte-1jr61rp{margin:0;font-size:11px;color:#94a3b8}button.svelte-1jr61rp{border:1px solid #d1fae5;background:#ecfdf5;color:#065f46;font-size:12px;padding:6px 10px;border-radius:10px;cursor:pointer}.items.svelte-1jr61rp{display:grid;gap:10px}.item.svelte-1jr61rp{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-radius:12px;background:#f8fafc;color:#0f172a;font-size:13px;animation:svelte-1jr61rp-slide-in 0.5s ease forwards;opacity:0;transform:translateY(6px)}.score.svelte-1jr61rp{font-weight:600}@keyframes svelte-1jr61rp-slide-in{to{opacity:1;transform:translateY(0)}}");
}
function Me(t, e, s) {
  const i = t.slice();
  return i[7] = e[s], i[9] = s, i;
}
function Ee(t, e) {
  let s, i, l = (
    /*item*/
    e[7].title + ""
  ), f, n, a, o = (
    /*item*/
    e[7].score + ""
  ), g, u, b, d;
  return {
    key: t,
    first: null,
    c() {
      s = h("div"), i = h("span"), f = w(l), n = z(), a = h("span"), g = w(o), u = w("%"), b = z(), c(a, "class", "score svelte-1jr61rp"), c(s, "class", "item svelte-1jr61rp"), c(s, "style", d = `animation-delay:${/*index*/
      e[9] * /*cadence*/
      e[1]}ms`), this.first = s;
    },
    m(v, p) {
      Y(v, s, p), r(s, i), r(i, f), r(s, n), r(s, a), r(a, g), r(a, u), r(s, b);
    },
    p(v, p) {
      e = v, p & /*items*/
      4 && l !== (l = /*item*/
      e[7].title + "") && L(f, l), p & /*items*/
      4 && o !== (o = /*item*/
      e[7].score + "") && L(g, o), p & /*items, cadence*/
      6 && d !== (d = `animation-delay:${/*index*/
      e[9] * /*cadence*/
      e[1]}ms`) && c(s, "style", d);
    },
    d(v) {
      v && R(s);
    }
  };
}
function Yt(t) {
  let e, s, i, l, f, n, a, o, g, u, b, d, v = [], p = /* @__PURE__ */ new Map(), m, k, S = de(
    /*items*/
    t[2]
  );
  const j = (q) => (
    /*item*/
    q[7].id
  );
  for (let q = 0; q < S.length; q += 1) {
    let _ = Me(t, S, q), C = j(_);
    p.set(C, v[q] = Ee(C, _));
  }
  return {
    c() {
      e = h("div"), s = h("div"), i = h("div"), l = h("p"), l.textContent = "Stagger list", f = z(), n = h("p"), a = w(
        /*count*/
        t[0]
      ), o = w(" items"), g = z(), u = h("button"), u.textContent = "Actualizar", b = z(), d = h("div");
      for (let q = 0; q < v.length; q += 1)
        v[q].c();
      c(l, "class", "title svelte-1jr61rp"), c(n, "class", "subtitle svelte-1jr61rp"), c(u, "type", "button"), c(u, "class", "svelte-1jr61rp"), c(s, "class", "header svelte-1jr61rp"), c(d, "class", "items svelte-1jr61rp"), c(e, "class", "list svelte-1jr61rp");
    },
    m(q, _) {
      Y(q, e, _), r(e, s), r(s, i), r(i, l), r(i, f), r(i, n), r(n, a), r(n, o), r(s, g), r(s, u), r(e, b), r(e, d);
      for (let C = 0; C < v.length; C += 1)
        v[C] && v[C].m(d, null);
      m || (k = N(
        u,
        "click",
        /*handleRefresh*/
        t[3]
      ), m = !0);
    },
    p(q, [_]) {
      _ & /*count*/
      1 && L(
        a,
        /*count*/
        q[0]
      ), _ & /*items, cadence*/
      6 && (S = de(
        /*items*/
        q[2]
      ), v = _e(v, _, j, 1, q, S, p, d, we, Ee, null, Me));
    },
    i: E,
    o: E,
    d(q) {
      q && R(e);
      for (let _ = 0; _ < v.length; _ += 1)
        v[_].d();
      m = !1, k();
    }
  };
}
function Nt(t, e, s) {
  let { label: i = "Batch" } = e, { count: l = 5 } = e, { cadence: f = 120 } = e;
  const n = ue();
  let a = [];
  const o = () => {
    s(2, a = Array.from({ length: l }, (u, b) => ({
      id: `${i}-${b}`,
      title: `${i} ${b + 1}`,
      score: Math.floor(Math.random() * 40) + 60
    }))), n("refresh", { count: l });
  }, g = () => {
    o();
  };
  return vt(o), t.$$set = (u) => {
    "label" in u && s(4, i = u.label), "count" in u && s(0, l = u.count), "cadence" in u && s(1, f = u.cadence);
  }, [l, f, a, g, i];
}
class Ge extends Q {
  constructor(e) {
    super(), V(this, e, Nt, Yt, B, { label: 4, count: 0, cadence: 1 }, Rt);
  }
  get label() {
    return this.$$.ctx[4];
  }
  set label(e) {
    this.$$set({ label: e }), y();
  }
  get count() {
    return this.$$.ctx[0];
  }
  set count(e) {
    this.$$set({ count: e }), y();
  }
  get cadence() {
    return this.$$.ctx[1];
  }
  set cadence(e) {
    this.$$set({ cadence: e }), y();
  }
}
J(Ge, { label: {}, count: {}, cadence: {} }, [], [], !0);
function Tt(t) {
  F(t, "svelte-1o8h3wg", ".thermo.svelte-1o8h3wg{display:grid;gap:16px;border-radius:18px;border:1px solid #e2e8f0;padding:16px;background:#ffffff}.header.svelte-1o8h3wg{display:flex;justify-content:space-between;align-items:center}.title.svelte-1o8h3wg{margin:0;font-size:14px;font-weight:600;color:#0f172a}.subtitle.svelte-1o8h3wg{margin:0;font-size:12px;color:#64748b}.chip.svelte-1o8h3wg{font-size:11px;padding:4px 8px;border-radius:999px;background:#ecfdf5;color:#065f46;border:1px solid rgba(16, 185, 129, 0.2)}.meter.svelte-1o8h3wg{position:relative;height:160px;display:grid;place-items:center}.tube.svelte-1o8h3wg{position:relative;width:24px;height:140px;border-radius:14px;background:#f1f5f9;border:1px solid #e2e8f0;overflow:hidden;box-shadow:inset 0 6px 16px rgba(15, 23, 42, 0.08)}.fill.svelte-1o8h3wg{position:absolute;left:0;right:0;bottom:0;height:var(--level);background:linear-gradient(180deg, #ffffff, var(--fill));transition:height 0.8s cubic-bezier(0.22, 1, 0.36, 1)}.gloss.svelte-1o8h3wg{position:absolute;left:3px;top:8px;width:6px;height:calc(100% - 16px);border-radius:999px;background:rgba(255, 255, 255, 0.6);animation:svelte-1o8h3wg-shimmer 2.4s ease-in-out infinite}.bulb.svelte-1o8h3wg{position:absolute;bottom:-6px;width:44px;height:44px;border-radius:999px;background:radial-gradient(circle at 30% 30%, #ffffff, var(--fill));border:2px solid rgba(226, 232, 240, 0.9);box-shadow:0 10px 24px var(--glow);animation:svelte-1o8h3wg-pulse 2.2s ease-in-out infinite}@keyframes svelte-1o8h3wg-shimmer{0%,100%{opacity:0.35;transform:translateY(0)}50%{opacity:0.7;transform:translateY(-8px)}}@keyframes svelte-1o8h3wg-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}");
}
function Xt(t) {
  let e, s, i, l, f, n, a, o, g, u, b, d, v, p, m, k, S, j, q, _;
  return {
    c() {
      e = h("div"), s = h("div"), i = h("div"), l = h("p"), f = w(
        /*label*/
        t[0]
      ), n = z(), a = h("p"), o = w(
        /*safeValue*/
        t[3]
      ), g = w("°C · "), u = w(
        /*percent*/
        t[6]
      ), b = w("%"), d = z(), v = h("div"), p = w(
        /*min*/
        t[1]
      ), m = w("° – "), k = w(
        /*max*/
        t[2]
      ), S = w("°"), j = z(), q = h("div"), q.innerHTML = '<div class="tube svelte-1o8h3wg"><div class="fill svelte-1o8h3wg"></div> <div class="gloss svelte-1o8h3wg"></div></div> <div class="bulb svelte-1o8h3wg"></div>', c(l, "class", "title svelte-1o8h3wg"), c(a, "class", "subtitle svelte-1o8h3wg"), c(v, "class", "chip svelte-1o8h3wg"), c(s, "class", "header svelte-1o8h3wg"), c(q, "class", "meter svelte-1o8h3wg"), c(e, "class", "thermo svelte-1o8h3wg"), c(e, "style", _ = `--level:${/*percent*/
      t[6]}%; --fill:${/*fillColor*/
      t[5]}; --glow:${/*glowColor*/
      t[4]};`);
    },
    m(C, x) {
      Y(C, e, x), r(e, s), r(s, i), r(i, l), r(l, f), r(i, n), r(i, a), r(a, o), r(a, g), r(a, u), r(a, b), r(s, d), r(s, v), r(v, p), r(v, m), r(v, k), r(v, S), r(e, j), r(e, q);
    },
    p(C, [x]) {
      x & /*label*/
      1 && L(
        f,
        /*label*/
        C[0]
      ), x & /*safeValue*/
      8 && L(
        o,
        /*safeValue*/
        C[3]
      ), x & /*percent*/
      64 && L(
        u,
        /*percent*/
        C[6]
      ), x & /*min*/
      2 && L(
        p,
        /*min*/
        C[1]
      ), x & /*max*/
      4 && L(
        k,
        /*max*/
        C[2]
      ), x & /*percent, fillColor, glowColor*/
      112 && _ !== (_ = `--level:${/*percent*/
      C[6]}%; --fill:${/*fillColor*/
      C[5]}; --glow:${/*glowColor*/
      C[4]};`) && c(e, "style", _);
    },
    i: E,
    o: E,
    d(C) {
      C && R(e);
    }
  };
}
function Bt(t, e, s) {
  let i, l, f, n, a, o, g, u, { label: b = "Temperatura" } = e, { value: d = 22 } = e, { min: v = 0 } = e, { max: p = 40 } = e;
  const m = (j, q, _) => Math.min(_, Math.max(q, j)), k = (j, q, _) => Math.round(j + (q - j) * _), S = (j, q, _) => `rgb(${j}, ${q}, ${_})`;
  return t.$$set = (j) => {
    "label" in j && s(0, b = j.label), "value" in j && s(7, d = j.value), "min" in j && s(1, v = j.min), "max" in j && s(2, p = j.max);
  }, t.$$.update = () => {
    t.$$.dirty & /*value, min, max*/
    134 && s(3, i = m(d, v, p)), t.$$.dirty & /*safeValue, min, max*/
    14 && s(9, l = (i - v) / (p - v || 1)), t.$$.dirty & /*ratio*/
    512 && s(6, f = Math.round(l * 100)), t.$$.dirty & /*cool, warm, ratio*/
    3584 && s(8, o = {
      r: k(a.r, n.r, l),
      g: k(a.g, n.g, l),
      b: k(a.b, n.b, l)
    }), t.$$.dirty & /*mix*/
    256 && s(5, g = S(o.r, o.g, o.b)), t.$$.dirty & /*mix*/
    256 && s(4, u = `rgba(${o.r}, ${o.g}, ${o.b}, 0.45)`);
  }, s(10, n = { r: 239, g: 68, b: 68 }), s(11, a = { r: 34, g: 197, b: 94 }), [
    b,
    v,
    p,
    i,
    u,
    g,
    f,
    d,
    o,
    l,
    n,
    a
  ];
}
class Ke extends Q {
  constructor(e) {
    super(), V(this, e, Bt, Xt, B, { label: 0, value: 7, min: 1, max: 2 }, Tt);
  }
  get label() {
    return this.$$.ctx[0];
  }
  set label(e) {
    this.$$set({ label: e }), y();
  }
  get value() {
    return this.$$.ctx[7];
  }
  set value(e) {
    this.$$set({ value: e }), y();
  }
  get min() {
    return this.$$.ctx[1];
  }
  set min(e) {
    this.$$set({ min: e }), y();
  }
  get max() {
    return this.$$.ctx[2];
  }
  set max(e) {
    this.$$set({ max: e }), y();
  }
}
J(Ke, { label: {}, value: {}, min: {}, max: {} }, [], [], !0);
function Pt(t) {
  F(t, "svelte-q2ay9k", `.podium.svelte-q2ay9k.svelte-q2ay9k{position:relative;border-radius:18px;border:1px solid #e2e8f0;background:linear-gradient(180deg, #ffffff, #f8fafc);padding:24px 18px 16px;height:220px;display:grid;align-items:end}.line.svelte-q2ay9k.svelte-q2ay9k{position:absolute;left:16px;right:16px;bottom:24px;height:2px;background:linear-gradient(90deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.6))}.controls.svelte-q2ay9k.svelte-q2ay9k{position:absolute;top:14px;right:14px;display:flex;gap:8px}.reset.svelte-q2ay9k.svelte-q2ay9k,.swap.svelte-q2ay9k.svelte-q2ay9k{border:1px solid rgba(16, 185, 129, 0.3);background:#ecfdf5;color:#065f46;font-size:11px;padding:6px 10px;border-radius:999px;cursor:pointer}.reset.svelte-q2ay9k.svelte-q2ay9k:hover,.swap.svelte-q2ay9k.svelte-q2ay9k:hover{background:#d1fae5}.stack.svelte-q2ay9k.svelte-q2ay9k{position:relative;display:grid;grid-template-columns:repeat(3, 1fr);align-items:end;gap:14px;height:100%;z-index:1}.bar.svelte-q2ay9k.svelte-q2ay9k{position:relative;border-radius:14px 14px 6px 6px;background:#d1fae5;color:#065f46;display:grid;place-items:center;font-size:14px;font-weight:600;transform-origin:bottom;animation:svelte-q2ay9k-rise var(--dur) cubic-bezier(0.22, 1, 0.36, 1) forwards;transform:scaleY(0)}.bar.svelte-q2ay9k span.svelte-q2ay9k{opacity:0;animation:svelte-q2ay9k-fade-in 0.5s ease forwards;animation-delay:calc(var(--dur) * 0.7)}.bar.svelte-q2ay9k.svelte-q2ay9k::after{content:"";position:absolute;inset:8px;border-radius:10px;background:linear-gradient(120deg, rgba(255, 255, 255, 0.4), transparent 60%);opacity:0;animation:svelte-q2ay9k-sweep 1.6s ease forwards;animation-delay:calc(var(--dur) * 0.4)}.bar.first.svelte-q2ay9k.svelte-q2ay9k{background:linear-gradient(180deg, #10b981, #34d399);color:#ffffff;box-shadow:0 14px 24px rgba(16, 185, 129, 0.35)}.bar.second.svelte-q2ay9k.svelte-q2ay9k{background:linear-gradient(180deg, #34d399, #6ee7b7)}.bar.third.svelte-q2ay9k.svelte-q2ay9k{background:linear-gradient(180deg, #bbf7d0, #ecfdf5)}.podium[data-play].svelte-q2ay9k .bar.svelte-q2ay9k{animation:svelte-q2ay9k-rise var(--dur) cubic-bezier(0.22, 1, 0.36, 1) forwards,
      svelte-q2ay9k-settle 0.35s ease-out forwards;animation-delay:0s, calc(var(--dur) * 0.9)}.podium[data-play].svelte-q2ay9k .bar span.svelte-q2ay9k{animation:svelte-q2ay9k-fade-in 0.5s ease forwards;animation-delay:calc(var(--dur) * 0.7)}.podium[data-play].svelte-q2ay9k .bar.svelte-q2ay9k::after{animation:svelte-q2ay9k-sweep 1.6s ease forwards;animation-delay:calc(var(--dur) * 0.4)}@keyframes svelte-q2ay9k-rise{to{transform:scaleY(1)}}@keyframes svelte-q2ay9k-settle{0%{transform:scaleY(1.02)}100%{transform:scaleY(1)}}@keyframes svelte-q2ay9k-fade-in{to{opacity:1}}@keyframes svelte-q2ay9k-sweep{0%{opacity:0;transform:translateY(10%)}50%{opacity:0.5}100%{opacity:0;transform:translateY(-20%)}}`);
}
function Ie(t, e, s) {
  const i = t.slice();
  return i[12] = e[s], i;
}
function Ae(t, e) {
  let s, i, l = (
    /*item*/
    e[12].label + ""
  ), f, n, a, o;
  return {
    key: t,
    first: null,
    c() {
      s = h("div"), i = h("span"), f = w(l), n = z(), c(i, "class", "svelte-q2ay9k"), c(s, "class", a = me(`bar ${/*item*/
      e[12].className}`) + " svelte-q2ay9k"), c(s, "style", o = `height:${/*item*/
      e[12].height}%; --dur:${/*item*/
      e[12].duration}s;`), this.first = s;
    },
    m(g, u) {
      Y(g, s, u), r(s, i), r(i, f), r(s, n);
    },
    p(g, u) {
      e = g, u & /*items*/
      2 && l !== (l = /*item*/
      e[12].label + "") && L(f, l), u & /*items*/
      2 && a !== (a = me(`bar ${/*item*/
      e[12].className}`) + " svelte-q2ay9k") && c(s, "class", a), u & /*items*/
      2 && o !== (o = `height:${/*item*/
      e[12].height}%; --dur:${/*item*/
      e[12].duration}s;`) && c(s, "style", o);
    },
    d(g) {
      g && R(s);
    }
  };
}
function Re(t) {
  let e, s = [], i = /* @__PURE__ */ new Map(), l = de(
    /*items*/
    t[1]
  );
  const f = (n) => (
    /*item*/
    n[12].key
  );
  for (let n = 0; n < l.length; n += 1) {
    let a = Ie(t, l, n), o = f(a);
    i.set(o, s[n] = Ae(o, a));
  }
  return {
    c() {
      e = h("div");
      for (let n = 0; n < s.length; n += 1)
        s[n].c();
      c(e, "class", "stack svelte-q2ay9k");
    },
    m(n, a) {
      Y(n, e, a);
      for (let o = 0; o < s.length; o += 1)
        s[o] && s[o].m(e, null);
    },
    p(n, a) {
      a & /*items*/
      2 && (l = de(
        /*items*/
        n[1]
      ), s = _e(s, a, f, 1, n, l, i, e, we, Ae, null, Ie));
    },
    d(n) {
      n && R(e);
      for (let a = 0; a < s.length; a += 1)
        s[a].d();
    }
  };
}
function Ot(t) {
  let e, s, i, l, f, n, a, o, g = (
    /*playId*/
    t[0]
  ), u, b, d = Re(t);
  return {
    c() {
      e = h("div"), s = h("div"), i = z(), l = h("div"), f = h("button"), f.textContent = "Reiniciar", n = z(), a = h("button"), a.textContent = "Intercalar", o = z(), d.c(), c(s, "class", "line svelte-q2ay9k"), c(f, "class", "reset svelte-q2ay9k"), c(f, "type", "button"), c(a, "class", "swap svelte-q2ay9k"), c(a, "type", "button"), c(l, "class", "controls svelte-q2ay9k"), c(e, "class", "podium svelte-q2ay9k"), c(
        e,
        "data-play",
        /*playId*/
        t[0]
      );
    },
    m(v, p) {
      Y(v, e, p), r(e, s), r(e, i), r(e, l), r(l, f), r(l, n), r(l, a), r(e, o), d.m(e, null), u || (b = [
        N(
          f,
          "click",
          /*reset*/
          t[2]
        ),
        N(
          a,
          "click",
          /*cycle*/
          t[3]
        )
      ], u = !0);
    },
    p(v, [p]) {
      p & /*playId*/
      1 && B(g, g = /*playId*/
      v[0]) ? (d.d(1), d = Re(v), d.c(), d.m(e, null)) : d.p(v, p), p & /*playId*/
      1 && c(
        e,
        "data-play",
        /*playId*/
        v[0]
      );
    },
    i: E,
    o: E,
    d(v) {
      v && R(e), d.d(v), u = !1, W(b);
    }
  };
}
function Dt(t, e, s) {
  let i, { first: l = 82 } = e, { second: f = 64 } = e, { third: n = 48 } = e, { baseDuration: a = 0.9 } = e, { delayStep: o = 0.15 } = e, g = 0, u = ["second", "first", "third"];
  const b = {
    first: { label: "1", className: "first" },
    second: { label: "2", className: "second" },
    third: { label: "3", className: "third" }
  }, d = (m) => m === "first" ? l : m === "second" ? f : n, v = () => {
    s(0, g += 1);
  }, p = () => {
    s(9, u = [u[1], u[2], u[0]]), s(0, g += 1);
  };
  return t.$$set = (m) => {
    "first" in m && s(4, l = m.first), "second" in m && s(5, f = m.second), "third" in m && s(6, n = m.third), "baseDuration" in m && s(7, a = m.baseDuration), "delayStep" in m && s(8, o = m.delayStep);
  }, t.$$.update = () => {
    t.$$.dirty & /*order, baseDuration, delayStep*/
    896 && s(1, i = u.map((m, k) => ({
      key: m,
      label: b[m].label,
      className: b[m].className,
      height: d(m),
      duration: a + k * o * 2
    })));
  }, [
    g,
    i,
    v,
    p,
    l,
    f,
    n,
    a,
    o,
    u
  ];
}
class We extends Q {
  constructor(e) {
    super(), V(
      this,
      e,
      Dt,
      Ot,
      B,
      {
        first: 4,
        second: 5,
        third: 6,
        baseDuration: 7,
        delayStep: 8
      },
      Pt
    );
  }
  get first() {
    return this.$$.ctx[4];
  }
  set first(e) {
    this.$$set({ first: e }), y();
  }
  get second() {
    return this.$$.ctx[5];
  }
  set second(e) {
    this.$$set({ second: e }), y();
  }
  get third() {
    return this.$$.ctx[6];
  }
  set third(e) {
    this.$$set({ third: e }), y();
  }
  get baseDuration() {
    return this.$$.ctx[7];
  }
  set baseDuration(e) {
    this.$$set({ baseDuration: e }), y();
  }
  get delayStep() {
    return this.$$.ctx[8];
  }
  set delayStep(e) {
    this.$$set({ delayStep: e }), y();
  }
}
J(We, { first: {}, second: {}, third: {}, baseDuration: {}, delayStep: {} }, [], [], !0);
function Ht(t) {
  F(t, "svelte-1jqbzw8", ".balloon-card.svelte-1jqbzw8{border-radius:18px;border:1px solid #e2e8f0;background:linear-gradient(180deg, #ffffff, #f8fafc);padding:16px;height:220px;display:grid;place-items:center}.scene.svelte-1jqbzw8{position:relative;width:160px;height:180px}.rope.svelte-1jqbzw8{position:absolute;left:50%;bottom:14px;width:2px;height:90px;background:var(--rope);transform-origin:bottom;transform:translateX(-50%);animation:svelte-1jqbzw8-rope-sway var(--speed) ease-in-out infinite}.anchor.svelte-1jqbzw8{position:absolute;left:50%;bottom:0;width:18px;height:18px;border-radius:999px;background:#e2e8f0;border:2px solid #cbd5f5;transform:translateX(-50%)}.balloon.svelte-1jqbzw8{position:absolute;left:50%;bottom:96px;width:64px;height:74px;border-radius:50% 50% 46% 46%;background:radial-gradient(circle at 35% 30%, #ffffff, var(--balloon));box-shadow:0 16px 26px rgba(16, 185, 129, 0.2);transform-origin:bottom center;transform:translateX(-50%);animation:svelte-1jqbzw8-float var(--speed) ease-in-out infinite}.string.svelte-1jqbzw8{position:absolute;left:50%;bottom:-26px;width:2px;height:26px;background:var(--rope);transform:translateX(-50%)}@keyframes svelte-1jqbzw8-float{0%,100%{transform:translateX(-50%) translateY(0) rotate(0deg)}50%{transform:translateX(-50%) translateY(calc(var(--lift) * -1)) rotate(var(--sway))}}@keyframes svelte-1jqbzw8-rope-sway{0%,100%{transform:translateX(-50%) rotate(0deg)}50%{transform:translateX(-50%) rotate(calc(var(--sway) * -0.4))}}");
}
function Ft(t) {
  let e, s, i;
  return {
    c() {
      e = h("div"), s = h("div"), s.innerHTML = '<div class="rope svelte-1jqbzw8"></div> <div class="anchor svelte-1jqbzw8"></div> <div class="balloon svelte-1jqbzw8"><div class="string svelte-1jqbzw8"></div></div>', c(s, "class", "scene svelte-1jqbzw8"), c(e, "class", "balloon-card svelte-1jqbzw8"), c(e, "style", i = `
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
    m(l, f) {
      Y(l, e, f), r(e, s);
    },
    p(l, [f]) {
      f & /*lift, sway, speed, color, rope*/
      31 && i !== (i = `
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
  `) && c(e, "style", i);
    },
    i: E,
    o: E,
    d(l) {
      l && R(e);
    }
  };
}
function Vt(t, e, s) {
  let { lift: i = 18 } = e, { sway: l = 6 } = e, { speed: f = 5.5 } = e, { color: n = "#10b981" } = e, { rope: a = "#94a3b8" } = e;
  return t.$$set = (o) => {
    "lift" in o && s(0, i = o.lift), "sway" in o && s(1, l = o.sway), "speed" in o && s(2, f = o.speed), "color" in o && s(3, n = o.color), "rope" in o && s(4, a = o.rope);
  }, [i, l, f, n, a];
}
class Ze extends Q {
  constructor(e) {
    super(), V(
      this,
      e,
      Vt,
      Ft,
      B,
      {
        lift: 0,
        sway: 1,
        speed: 2,
        color: 3,
        rope: 4
      },
      Ht
    );
  }
  get lift() {
    return this.$$.ctx[0];
  }
  set lift(e) {
    this.$$set({ lift: e }), y();
  }
  get sway() {
    return this.$$.ctx[1];
  }
  set sway(e) {
    this.$$set({ sway: e }), y();
  }
  get speed() {
    return this.$$.ctx[2];
  }
  set speed(e) {
    this.$$set({ speed: e }), y();
  }
  get color() {
    return this.$$.ctx[3];
  }
  set color(e) {
    this.$$set({ color: e }), y();
  }
  get rope() {
    return this.$$.ctx[4];
  }
  set rope(e) {
    this.$$set({ rope: e }), y();
  }
}
J(Ze, { lift: {}, sway: {}, speed: {}, color: {}, rope: {} }, [], [], !0);
function Jt(t) {
  F(t, "svelte-9cnfqg", '.wrapper.svelte-9cnfqg.svelte-9cnfqg{display:grid;grid-template-columns:28px 1fr 28px;align-items:stretch;gap:12px}.nav.svelte-9cnfqg.svelte-9cnfqg{border:1px solid #e2e8f0;background:#f8fafc;border-radius:14px;display:grid;place-items:center;height:100%;cursor:pointer;transition:transform 0.2s ease, background 0.2s ease;position:relative;overflow:hidden}.nav.svelte-9cnfqg.svelte-9cnfqg:hover{background:#e2e8f0;transform:translateY(-2px)}.nav.svelte-9cnfqg.svelte-9cnfqg::after{content:"";position:absolute;inset:0;background:linear-gradient(120deg, transparent, rgba(16, 185, 129, 0.25), transparent);transform:translateX(-120%);transition:transform 0.45s ease}.nav.svelte-9cnfqg.svelte-9cnfqg:hover::after{transform:translateX(120%)}.chevron.svelte-9cnfqg.svelte-9cnfqg{width:10px;height:28px;border-right:2px solid #475569;border-bottom:2px solid #475569;transform:rotate(-45deg)}.nav.left.svelte-9cnfqg .chevron.svelte-9cnfqg{transform:rotate(135deg)}.card.svelte-9cnfqg.svelte-9cnfqg{display:grid;grid-template-columns:72px 1fr;gap:16px;padding:18px 20px;border-radius:20px;border:1px solid #e2e8f0;background:#ffffff;box-shadow:0 14px 26px rgba(15, 23, 42, 0.08);transition:transform 0.35s ease, box-shadow 0.35s ease}.card.svelte-9cnfqg.svelte-9cnfqg:hover{transform:translateY(-4px);box-shadow:0 18px 34px rgba(15, 23, 42, 0.16)}.icon.svelte-9cnfqg.svelte-9cnfqg{width:56px;height:56px;border-radius:16px;background:#f8fafc;display:grid;place-items:center}.ladder.svelte-9cnfqg.svelte-9cnfqg{width:28px;height:36px;border:3px solid #7c5c4f;border-left-width:5px;border-right-width:5px;border-radius:6px;position:relative}.ladder.svelte-9cnfqg span.svelte-9cnfqg{position:absolute;left:2px;right:2px;height:4px;background:#7c5c4f;border-radius:999px;animation:svelte-9cnfqg-rung 2.8s ease-in-out infinite}.ladder.svelte-9cnfqg span.svelte-9cnfqg:nth-child(1){top:6px;animation-delay:0s}.ladder.svelte-9cnfqg span.svelte-9cnfqg:nth-child(2){top:14px;animation-delay:0.2s}.ladder.svelte-9cnfqg span.svelte-9cnfqg:nth-child(3){top:22px;animation-delay:0.4s}.ladder.svelte-9cnfqg span.svelte-9cnfqg:nth-child(4){top:30px;animation-delay:0.6s}.content.svelte-9cnfqg.svelte-9cnfqg{display:grid;gap:8px}.panel.svelte-9cnfqg.svelte-9cnfqg{animation:svelte-9cnfqg-slide-in 0.4s ease}.row.svelte-9cnfqg.svelte-9cnfqg{display:flex;align-items:center;justify-content:space-between;gap:12px}.title.svelte-9cnfqg.svelte-9cnfqg{display:flex;align-items:baseline;gap:12px}.title.svelte-9cnfqg strong.svelte-9cnfqg{font-size:18px;color:#0f172a}.title.svelte-9cnfqg span.svelte-9cnfqg{font-size:14px;color:#64748b}.level-text.svelte-9cnfqg.svelte-9cnfqg{font-size:14px;color:#64748b;animation:svelte-9cnfqg-level-pop 0.35s ease}.pill.svelte-9cnfqg.svelte-9cnfqg{padding:6px 14px;background:#eef2ff;color:#1e3a8a;border-radius:999px;font-size:12px;font-weight:600}.desc.svelte-9cnfqg.svelte-9cnfqg{margin:0;font-size:14px;color:#0f172a}.meta.svelte-9cnfqg.svelte-9cnfqg{font-size:13px;color:#475569}.xp.svelte-9cnfqg.svelte-9cnfqg{font-weight:600;color:#047857}.progress.svelte-9cnfqg.svelte-9cnfqg{position:relative;height:12px;border-radius:999px;background:#f1f5f9;overflow:hidden}.bar.svelte-9cnfqg.svelte-9cnfqg{height:100%;width:var(--fill);background:linear-gradient(90deg, #10b981, #34d399);transition:width 0.8s cubic-bezier(0.22, 1, 0.36, 1)}.glow.svelte-9cnfqg.svelte-9cnfqg{position:absolute;inset:0;background:linear-gradient(90deg, rgba(16, 185, 129, 0), rgba(16, 185, 129, 0.35), rgba(16, 185, 129, 0));transform:translateX(-100%);animation:svelte-9cnfqg-sweep 3.2s ease-in-out infinite}@keyframes svelte-9cnfqg-sweep{0%,60%{transform:translateX(-100%)}100%{transform:translateX(100%)}}@keyframes svelte-9cnfqg-level-pop{0%{opacity:0;transform:translateY(4px)}100%{opacity:1;transform:translateY(0)}}@keyframes svelte-9cnfqg-rung{0%,100%{opacity:0.6}50%{opacity:1}}@keyframes svelte-9cnfqg-slide-in{from{opacity:0;transform:translateX(calc(var(--dir) * 12px))}to{opacity:1;transform:translateX(0)}}');
}
function Ye(t) {
  let e, s, i, l, f, n, a, o, g, u, b, d, v, p, m, k, S, j, q, _, C, x, $, M, A, P, te, se, re, le, K, Z, ie, ne, ae;
  return {
    c() {
      e = h("div"), s = h("div"), i = h("div"), l = h("strong"), f = w(
        /*title*/
        t[0]
      ), n = z(), a = h("span"), o = w("Nivel "), g = w(
        /*activeLevel*/
        t[4]
      ), u = w("/"), b = w(
        /*safeLevelTotal*/
        t[5]
      ), d = z(), v = h("div"), p = w(
        /*status*/
        t[3]
      ), m = z(), k = h("p"), S = w(
        /*description*/
        t[1]
      ), j = z(), q = h("div"), _ = h("span"), C = w("Progreso: "), x = w(
        /*safeProgress*/
        t[7]
      ), $ = w(" / "), M = w(
        /*safeTotal*/
        t[6]
      ), A = z(), P = h("span"), te = w("+"), se = w(
        /*xp*/
        t[2]
      ), re = w(" XP"), le = z(), K = h("div"), Z = h("div"), ne = z(), ae = h("div"), c(l, "class", "svelte-9cnfqg"), c(a, "class", "level-text svelte-9cnfqg"), c(i, "class", "title svelte-9cnfqg"), c(v, "class", "pill svelte-9cnfqg"), c(s, "class", "row svelte-9cnfqg"), c(k, "class", "desc svelte-9cnfqg"), c(P, "class", "xp svelte-9cnfqg"), c(q, "class", "row meta svelte-9cnfqg"), c(Z, "class", "bar svelte-9cnfqg"), c(Z, "style", ie = `--fill:${/*percent*/
      t[9]}%`), c(ae, "class", "glow svelte-9cnfqg"), c(K, "class", "progress svelte-9cnfqg"), c(e, "class", "panel svelte-9cnfqg");
    },
    m(X, O) {
      Y(X, e, O), r(e, s), r(s, i), r(i, l), r(l, f), r(i, n), r(i, a), r(a, o), r(a, g), r(a, u), r(a, b), r(s, d), r(s, v), r(v, p), r(e, m), r(e, k), r(k, S), r(e, j), r(e, q), r(q, _), r(_, C), r(_, x), r(_, $), r(_, M), r(q, A), r(q, P), r(P, te), r(P, se), r(P, re), r(e, le), r(e, K), r(K, Z), r(K, ne), r(K, ae);
    },
    p(X, O) {
      O & /*title*/
      1 && L(
        f,
        /*title*/
        X[0]
      ), O & /*activeLevel*/
      16 && L(
        g,
        /*activeLevel*/
        X[4]
      ), O & /*safeLevelTotal*/
      32 && L(
        b,
        /*safeLevelTotal*/
        X[5]
      ), O & /*status*/
      8 && L(
        p,
        /*status*/
        X[3]
      ), O & /*description*/
      2 && L(
        S,
        /*description*/
        X[1]
      ), O & /*safeProgress*/
      128 && L(
        x,
        /*safeProgress*/
        X[7]
      ), O & /*safeTotal*/
      64 && L(
        M,
        /*safeTotal*/
        X[6]
      ), O & /*xp*/
      4 && L(
        se,
        /*xp*/
        X[2]
      ), O & /*percent*/
      512 && ie !== (ie = `--fill:${/*percent*/
      X[9]}%`) && c(Z, "style", ie);
    },
    d(X) {
      X && R(e);
    }
  };
}
function Qt(t) {
  let e, s, i, l, f, n, a, o = (
    /*activeLevel*/
    t[4]
  ), g, u, b, d, v, p = Ye(t);
  return {
    c() {
      e = h("div"), s = h("button"), s.innerHTML = '<span class="chevron svelte-9cnfqg"></span>', i = z(), l = h("div"), f = h("div"), f.innerHTML = '<div class="ladder svelte-9cnfqg"><span class="svelte-9cnfqg"></span> <span class="svelte-9cnfqg"></span> <span class="svelte-9cnfqg"></span> <span class="svelte-9cnfqg"></span></div>', n = z(), a = h("div"), p.c(), u = z(), b = h("button"), b.innerHTML = '<span class="chevron svelte-9cnfqg"></span>', c(s, "class", "nav left svelte-9cnfqg"), c(s, "type", "button"), c(s, "aria-label", "Nivel anterior"), c(f, "class", "icon svelte-9cnfqg"), c(a, "class", "content svelte-9cnfqg"), c(a, "style", g = `--dir:${/*slideDir*/
      t[8]}`), c(l, "class", "card svelte-9cnfqg"), c(b, "class", "nav right svelte-9cnfqg"), c(b, "type", "button"), c(b, "aria-label", "Nivel siguiente"), c(e, "class", "wrapper svelte-9cnfqg");
    },
    m(m, k) {
      Y(m, e, k), r(e, s), r(e, i), r(e, l), r(l, f), r(l, n), r(l, a), p.m(a, null), r(e, u), r(e, b), d || (v = [
        N(
          s,
          "click",
          /*click_handler*/
          t[17]
        ),
        N(
          b,
          "click",
          /*click_handler_1*/
          t[18]
        )
      ], d = !0);
    },
    p(m, [k]) {
      k & /*activeLevel*/
      16 && B(o, o = /*activeLevel*/
      m[4]) ? (p.d(1), p = Ye(m), p.c(), p.m(a, null)) : p.p(m, k), k & /*slideDir*/
      256 && g !== (g = `--dir:${/*slideDir*/
      m[8]}`) && c(a, "style", g);
    },
    i: E,
    o: E,
    d(m) {
      m && R(e), p.d(m), d = !1, W(v);
    }
  };
}
function Ut(t, e, s) {
  let i, l, f, n, a, { title: o = "Nivel 5" } = e, { subtitle: g = "Nivel 1/3" } = e, { description: u = "Alcanza nivel 5 de usuario." } = e, { progress: b = 4 } = e, { total: d = 5 } = e, { xp: v = 15 } = e, { status: p = "En progreso" } = e, { levelIndex: m = 1 } = e, { levelTotal: k = 3 } = e;
  const S = ($, M, A) => Math.min(A, Math.max(M, $));
  let j = S(m, 1, a), q = 1;
  const _ = ($) => {
    s(8, q = $ >= 0 ? 1 : -1), s(4, j = S(j + $, 1, a));
  }, C = () => _(-1), x = () => _(1);
  return t.$$set = ($) => {
    "title" in $ && s(0, o = $.title), "subtitle" in $ && s(11, g = $.subtitle), "description" in $ && s(1, u = $.description), "progress" in $ && s(12, b = $.progress), "total" in $ && s(13, d = $.total), "xp" in $ && s(2, v = $.xp), "status" in $ && s(3, p = $.status), "levelIndex" in $ && s(14, m = $.levelIndex), "levelTotal" in $ && s(15, k = $.levelTotal);
  }, t.$$.update = () => {
    t.$$.dirty & /*total*/
    8192 && s(6, i = Math.max(1, d)), t.$$.dirty & /*progress, safeTotal*/
    4160 && s(7, l = S(b, 0, i)), t.$$.dirty & /*safeProgress, safeTotal*/
    192 && s(16, f = l / i), t.$$.dirty & /*ratio*/
    65536 && s(9, n = Math.round(f * 100)), t.$$.dirty & /*levelTotal*/
    32768 && s(5, a = Math.max(1, k)), t.$$.dirty & /*levelIndex, activeLevel, safeLevelTotal*/
    16432 && m !== j && s(4, j = S(m, 1, a));
  }, [
    o,
    u,
    v,
    p,
    j,
    a,
    i,
    l,
    q,
    n,
    _,
    g,
    b,
    d,
    m,
    k,
    f,
    C,
    x
  ];
}
class et extends Q {
  constructor(e) {
    super(), V(
      this,
      e,
      Ut,
      Qt,
      B,
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
      Jt
    );
  }
  get title() {
    return this.$$.ctx[0];
  }
  set title(e) {
    this.$$set({ title: e }), y();
  }
  get subtitle() {
    return this.$$.ctx[11];
  }
  set subtitle(e) {
    this.$$set({ subtitle: e }), y();
  }
  get description() {
    return this.$$.ctx[1];
  }
  set description(e) {
    this.$$set({ description: e }), y();
  }
  get progress() {
    return this.$$.ctx[12];
  }
  set progress(e) {
    this.$$set({ progress: e }), y();
  }
  get total() {
    return this.$$.ctx[13];
  }
  set total(e) {
    this.$$set({ total: e }), y();
  }
  get xp() {
    return this.$$.ctx[2];
  }
  set xp(e) {
    this.$$set({ xp: e }), y();
  }
  get status() {
    return this.$$.ctx[3];
  }
  set status(e) {
    this.$$set({ status: e }), y();
  }
  get levelIndex() {
    return this.$$.ctx[14];
  }
  set levelIndex(e) {
    this.$$set({ levelIndex: e }), y();
  }
  get levelTotal() {
    return this.$$.ctx[15];
  }
  set levelTotal(e) {
    this.$$set({ levelTotal: e }), y();
  }
}
J(et, { title: {}, subtitle: {}, description: {}, progress: {}, total: {}, xp: {}, status: {}, levelIndex: {}, levelTotal: {} }, [], [], !0);
function Gt(t) {
  F(t, "svelte-12k2sv8", ".card.svelte-12k2sv8{position:relative;border-radius:18px;border:1px solid #e2e8f0;background:linear-gradient(160deg, #ffffff, #ecfdf5);padding:18px;overflow:hidden;transform:perspective(800px) rotateX(var(--rx)) rotateY(var(--ry));transition:transform 0.2s ease;box-shadow:0 18px 32px rgba(15, 23, 42, 0.12)}.shine.svelte-12k2sv8{position:absolute;inset:0;background:radial-gradient(circle at var(--shine) 20%, rgba(16, 185, 129, 0.22), transparent 55%);pointer-events:none}.content.svelte-12k2sv8{position:relative;display:grid;gap:6px}.title.svelte-12k2sv8{margin:0;font-size:12px;color:#64748b;letter-spacing:0.08em;text-transform:uppercase}.value.svelte-12k2sv8{margin:0;font-size:28px;font-weight:700;color:#0f172a}.hint.svelte-12k2sv8{margin:0;font-size:12px;color:#475569}");
}
function Kt(t) {
  let e, s, i, l, f, n, a, o, g, u, b, d, v, p, m;
  return {
    c() {
      e = h("div"), s = h("div"), i = z(), l = h("div"), f = h("p"), n = w(
        /*title*/
        t[0]
      ), a = z(), o = h("p"), g = w(
        /*value*/
        t[1]
      ), u = z(), b = h("p"), d = w(
        /*hint*/
        t[2]
      ), c(s, "class", "shine svelte-12k2sv8"), c(f, "class", "title svelte-12k2sv8"), c(o, "class", "value svelte-12k2sv8"), c(b, "class", "hint svelte-12k2sv8"), c(l, "class", "content svelte-12k2sv8"), c(e, "class", "card svelte-12k2sv8"), c(e, "style", v = `--rx:${/*rx*/
      t[3]}deg; --ry:${/*ry*/
      t[4]}deg; --shine:${/*shine*/
      t[5]}%`);
    },
    m(k, S) {
      Y(k, e, S), r(e, s), r(e, i), r(e, l), r(l, f), r(f, n), r(l, a), r(l, o), r(o, g), r(l, u), r(l, b), r(b, d), p || (m = [
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
    p(k, [S]) {
      S & /*title*/
      1 && L(
        n,
        /*title*/
        k[0]
      ), S & /*value*/
      2 && L(
        g,
        /*value*/
        k[1]
      ), S & /*hint*/
      4 && L(
        d,
        /*hint*/
        k[2]
      ), S & /*rx, ry, shine*/
      56 && v !== (v = `--rx:${/*rx*/
      k[3]}deg; --ry:${/*ry*/
      k[4]}deg; --shine:${/*shine*/
      k[5]}%`) && c(e, "style", v);
    },
    i: E,
    o: E,
    d(k) {
      k && R(e), p = !1, W(m);
    }
  };
}
function Wt(t, e, s) {
  let { title: i = "Pulso Focus" } = e, { value: l = "78%" } = e, { hint: f = "Calma sostenida" } = e, { intensity: n = 10 } = e, a = 0, o = 0, g = 0;
  const u = (d) => {
    const v = d.currentTarget.getBoundingClientRect(), p = (d.clientX - v.left) / v.width - 0.5, m = (d.clientY - v.top) / v.height - 0.5;
    s(3, a = m * n * -1), s(4, o = p * n), s(5, g = (p + m + 1) * 25);
  }, b = () => {
    s(3, a = 0), s(4, o = 0), s(5, g = 0);
  };
  return t.$$set = (d) => {
    "title" in d && s(0, i = d.title), "value" in d && s(1, l = d.value), "hint" in d && s(2, f = d.hint), "intensity" in d && s(8, n = d.intensity);
  }, [i, l, f, a, o, g, u, b, n];
}
class tt extends Q {
  constructor(e) {
    super(), V(
      this,
      e,
      Wt,
      Kt,
      B,
      {
        title: 0,
        value: 1,
        hint: 2,
        intensity: 8
      },
      Gt
    );
  }
  get title() {
    return this.$$.ctx[0];
  }
  set title(e) {
    this.$$set({ title: e }), y();
  }
  get value() {
    return this.$$.ctx[1];
  }
  set value(e) {
    this.$$set({ value: e }), y();
  }
  get hint() {
    return this.$$.ctx[2];
  }
  set hint(e) {
    this.$$set({ hint: e }), y();
  }
  get intensity() {
    return this.$$.ctx[8];
  }
  set intensity(e) {
    this.$$set({ intensity: e }), y();
  }
}
J(tt, { title: {}, value: {}, hint: {}, intensity: {} }, [], [], !0);
function Zt(t) {
  F(t, "svelte-1czrcz8", '.counter.svelte-1czrcz8{border-radius:16px;border:1px solid #e2e8f0;padding:16px;background:#ffffff;display:grid;gap:10px;box-shadow:0 12px 22px rgba(15, 23, 42, 0.08)}.label.svelte-1czrcz8{margin:0;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.08em}.value.svelte-1czrcz8{font-size:32px;font-weight:700;color:#0f172a;position:relative;animation:svelte-1czrcz8-flip 0.5s ease}.value.svelte-1czrcz8::after{content:"";position:absolute;left:0;right:0;bottom:-4px;height:3px;border-radius:999px;background:var(--tone);animation:svelte-1czrcz8-sweep 0.6s ease}@keyframes svelte-1czrcz8-flip{0%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:translateY(0)}}@keyframes svelte-1czrcz8-sweep{from{transform:scaleX(0.2)}to{transform:scaleX(1)}}');
}
function Ne(t) {
  let e, s;
  return {
    c() {
      e = h("div"), s = w(
        /*value*/
        t[1]
      ), c(e, "class", "value svelte-1czrcz8");
    },
    m(i, l) {
      Y(i, e, l), r(e, s);
    },
    p(i, l) {
      l & /*value*/
      2 && L(
        s,
        /*value*/
        i[1]
      );
    },
    d(i) {
      i && R(e);
    }
  };
}
function es(t) {
  let e, s, i, l, f = (
    /*value*/
    t[1]
  ), n, a = Ne(t);
  return {
    c() {
      e = h("div"), s = h("p"), i = w(
        /*label*/
        t[0]
      ), l = z(), a.c(), c(s, "class", "label svelte-1czrcz8"), c(e, "class", "counter svelte-1czrcz8"), c(e, "style", n = `--tone:${/*tone*/
      t[2]}`);
    },
    m(o, g) {
      Y(o, e, g), r(e, s), r(s, i), r(e, l), a.m(e, null);
    },
    p(o, [g]) {
      g & /*label*/
      1 && L(
        i,
        /*label*/
        o[0]
      ), g & /*value*/
      2 && B(f, f = /*value*/
      o[1]) ? (a.d(1), a = Ne(o), a.c(), a.m(e, null)) : a.p(o, g), g & /*tone*/
      4 && n !== (n = `--tone:${/*tone*/
      o[2]}`) && c(e, "style", n);
    },
    i: E,
    o: E,
    d(o) {
      o && R(e), a.d(o);
    }
  };
}
function ts(t, e, s) {
  let { label: i = "Sesiones" } = e, { value: l = 12 } = e, { tone: f = "#10b981" } = e;
  return t.$$set = (n) => {
    "label" in n && s(0, i = n.label), "value" in n && s(1, l = n.value), "tone" in n && s(2, f = n.tone);
  }, [i, l, f];
}
class st extends Q {
  constructor(e) {
    super(), V(this, e, ts, es, B, { label: 0, value: 1, tone: 2 }, Zt);
  }
  get label() {
    return this.$$.ctx[0];
  }
  set label(e) {
    this.$$set({ label: e }), y();
  }
  get value() {
    return this.$$.ctx[1];
  }
  set value(e) {
    this.$$set({ value: e }), y();
  }
  get tone() {
    return this.$$.ctx[2];
  }
  set tone(e) {
    this.$$set({ tone: e }), y();
  }
}
J(st, { label: {}, value: {}, tone: {} }, [], [], !0);
function ss(t) {
  F(t, "svelte-pocpcm", ".stack.svelte-pocpcm{position:relative;height:160px;border-radius:18px;border:1px solid #e2e8f0;background:linear-gradient(140deg, #ffffff, #ecfdf5);overflow:hidden;transform:perspective(900px) rotateX(var(--rx)) rotateY(var(--ry));transition:transform 0.2s ease}.bg.svelte-pocpcm{position:absolute;inset:0;background:radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.15), transparent 60%)}.layer.svelte-pocpcm{position:absolute;border-radius:999px;filter:blur(calc(var(--blur) * 10px));opacity:0.75}.layer-a.svelte-pocpcm{width:120px;height:120px;background:rgba(16, 185, 129, 0.45);transform:translate(calc(var(--px) * 0.6), calc(var(--py) * 0.6));top:20px;left:14px}.layer-b.svelte-pocpcm{width:90px;height:90px;background:rgba(52, 211, 153, 0.5);transform:translate(calc(var(--px) * 1.2), calc(var(--py) * 1.2));bottom:18px;right:20px}.layer-c.svelte-pocpcm{width:70px;height:70px;background:rgba(14, 116, 144, 0.3);transform:translate(calc(var(--px) * 1.6), calc(var(--py) * 1.6));top:30px;right:70px}.label.svelte-pocpcm{position:absolute;left:16px;bottom:14px;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#0f172a;background:rgba(255, 255, 255, 0.7);padding:4px 8px;border-radius:999px}");
}
function ls(t) {
  let e, s, i, l, f, n, a, o, g, u, b, d, v, p;
  return {
    c() {
      e = h("div"), s = h("div"), i = z(), l = h("div"), f = z(), n = h("div"), a = z(), o = h("div"), g = z(), u = h("div"), b = w(
        /*title*/
        t[0]
      ), c(s, "class", "bg svelte-pocpcm"), c(l, "class", "layer layer-a svelte-pocpcm"), c(n, "class", "layer layer-b svelte-pocpcm"), c(o, "class", "layer layer-c svelte-pocpcm"), c(u, "class", "label svelte-pocpcm"), c(e, "class", "stack svelte-pocpcm"), c(e, "style", d = `--rx:${/*rx*/
      t[2]}deg; --ry:${/*ry*/
      t[3]}deg; --px:${/*px*/
      t[4]}px; --py:${/*py*/
      t[5]}px; --blur:${/*blurAmount*/
      t[1]}`);
    },
    m(m, k) {
      Y(m, e, k), r(e, s), r(e, i), r(e, l), r(e, f), r(e, n), r(e, a), r(e, o), r(e, g), r(e, u), r(u, b), v || (p = [
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
      ], v = !0);
    },
    p(m, [k]) {
      k & /*title*/
      1 && L(
        b,
        /*title*/
        m[0]
      ), k & /*rx, ry, px, py, blurAmount*/
      62 && d !== (d = `--rx:${/*rx*/
      m[2]}deg; --ry:${/*ry*/
      m[3]}deg; --px:${/*px*/
      m[4]}px; --py:${/*py*/
      m[5]}px; --blur:${/*blurAmount*/
      m[1]}`) && c(e, "style", d);
    },
    i: E,
    o: E,
    d(m) {
      m && R(e), v = !1, W(p);
    }
  };
}
function is(t, e, s) {
  let { title: i = "Capas activas" } = e, { intensity: l = 18 } = e, { blurAmount: f = 0.6 } = e, n = 0, a = 0, o = 0, g = 0;
  const u = (d) => {
    const v = d.currentTarget.getBoundingClientRect(), p = (d.clientX - v.left) / v.width - 0.5, m = (d.clientY - v.top) / v.height - 0.5;
    s(2, n = m * l * -1), s(3, a = p * l), s(4, o = p * 24), s(5, g = m * 24);
  }, b = () => {
    s(2, n = 0), s(3, a = 0), s(4, o = 0), s(5, g = 0);
  };
  return t.$$set = (d) => {
    "title" in d && s(0, i = d.title), "intensity" in d && s(8, l = d.intensity), "blurAmount" in d && s(1, f = d.blurAmount);
  }, [i, f, n, a, o, g, u, b, l];
}
class lt extends Q {
  constructor(e) {
    super(), V(this, e, is, ls, B, { title: 0, intensity: 8, blurAmount: 1 }, ss);
  }
  get title() {
    return this.$$.ctx[0];
  }
  set title(e) {
    this.$$set({ title: e }), y();
  }
  get intensity() {
    return this.$$.ctx[8];
  }
  set intensity(e) {
    this.$$set({ intensity: e }), y();
  }
  get blurAmount() {
    return this.$$.ctx[1];
  }
  set blurAmount(e) {
    this.$$set({ blurAmount: e }), y();
  }
}
J(lt, { title: {}, intensity: {}, blurAmount: {} }, [], [], !0);
function ns(t) {
  F(t, "svelte-1yc0e5f", `:host{display:block;font-family:'Poppins', 'Manrope', 'Segoe UI', system-ui, sans-serif}.card-shell.svelte-1yc0e5f.svelte-1yc0e5f{position:relative;padding-bottom:18px}.card.svelte-1yc0e5f.svelte-1yc0e5f{position:relative;z-index:1;background:#ffffff;border-radius:16px;overflow:hidden;border:2px solid transparent;box-shadow:0 12px 24px rgba(15, 23, 42, 0.08);transition:transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;cursor:pointer}.card.svelte-1yc0e5f.svelte-1yc0e5f:hover{transform:translateY(-2px);box-shadow:0 18px 32px rgba(15, 23, 42, 0.12),
      0 0 0 2px color-mix(in srgb, var(--category-left) 55%, transparent),
      0 12px 24px color-mix(in srgb, var(--category-right) 35%, transparent)}.card.is-selected.svelte-1yc0e5f.svelte-1yc0e5f{border-color:#10b981;transform:scale(0.99)}.card.is-disabled.svelte-1yc0e5f.svelte-1yc0e5f{opacity:0.5;cursor:not-allowed;pointer-events:none}.thumb.svelte-1yc0e5f.svelte-1yc0e5f{position:relative;background:#f1f5f9;aspect-ratio:16 / 9;overflow:hidden}.thumb.svelte-1yc0e5f img.svelte-1yc0e5f{width:100%;height:100%;object-fit:cover;display:block}.thumb-placeholder.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;inset:0;display:grid;place-items:center;font-size:28px;color:#94a3b8}.thumb-overlay.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;inset:0;background:linear-gradient(180deg, rgba(15, 23, 42, 0) 50%, rgba(15, 23, 42, 0.55) 100%);opacity:0;transition:opacity 0.2s ease}.card.svelte-1yc0e5f:hover .thumb-overlay.svelte-1yc0e5f{opacity:1}.pill-row.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;top:8px;left:8px;display:flex;gap:6px}.pill.svelte-1yc0e5f.svelte-1yc0e5f{padding:4px 8px;border-radius:999px;background:rgba(15, 23, 42, 0.6);color:#ffffff;font-size:11px;font-weight:600}.pill.badge.svelte-1yc0e5f.svelte-1yc0e5f{background:rgba(15, 23, 42, 0.75);text-transform:uppercase;letter-spacing:0.5px}.favorite.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;top:8px;right:8px;border:none;background:rgba(15, 23, 42, 0.35);color:#ffffff;width:30px;height:30px;border-radius:999px;display:grid;place-items:center;cursor:pointer;transition:background 0.2s ease, transform 0.2s ease, color 0.2s ease}.favorite.svelte-1yc0e5f svg.svelte-1yc0e5f{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.6}.favorite.active.svelte-1yc0e5f.svelte-1yc0e5f{background:rgba(255, 255, 255, 0.9);color:#ef4444}.favorite.active.svelte-1yc0e5f svg.svelte-1yc0e5f{fill:currentColor;stroke:none}.favorite.svelte-1yc0e5f.svelte-1yc0e5f:hover{transform:scale(1.05)}.check.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;bottom:8px;left:8px;width:26px;height:26px;border-radius:999px;background:rgba(255, 255, 255, 0.9);border:1px solid #e2e8f0;display:grid;place-items:center;transition:background 0.2s ease, border-color 0.2s ease}.check.svelte-1yc0e5f svg.svelte-1yc0e5f{width:16px;height:16px;fill:#ffffff;opacity:0;transform:scale(0.7);transition:opacity 0.2s ease, transform 0.2s ease}.card.is-selected.svelte-1yc0e5f .check.svelte-1yc0e5f{background:#10b981;border-color:#059669}.card.is-selected.svelte-1yc0e5f .check svg.svelte-1yc0e5f{opacity:1;transform:scale(1)}.body.svelte-1yc0e5f.svelte-1yc0e5f{padding:16px;display:grid;gap:8px}.body.svelte-1yc0e5f h3.svelte-1yc0e5f{margin:0;font-size:15px;font-weight:700;color:#0f172a}.body.svelte-1yc0e5f p.svelte-1yc0e5f{margin:0;font-size:13px;color:#64748b;min-height:34px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.cta.svelte-1yc0e5f.svelte-1yc0e5f{padding:8px 10px;border-radius:10px;text-align:center;font-size:12px;font-weight:600;color:#64748b;background:#f1f5f9;transition:background 0.2s ease, color 0.2s ease}.card.svelte-1yc0e5f:hover .cta.svelte-1yc0e5f{background:#e2e8f0}.cta-selected.svelte-1yc0e5f.svelte-1yc0e5f{background:#d1fae5;color:#047857}.category-lift.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;left:16px;right:16px;bottom:-12px;display:flex;justify-content:center;gap:8px;z-index:0;pointer-events:none;transform:translateY(14px);opacity:0;transition:transform 0.25s ease, opacity 0.2s ease}.category-chip.svelte-1yc0e5f.svelte-1yc0e5f{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:0.4px;color:#ffffff;text-transform:uppercase;background:var(--chip-color);box-shadow:0 10px 20px color-mix(in srgb, var(--chip-color) 35%, transparent)}.card-shell.svelte-1yc0e5f:hover .category-lift.svelte-1yc0e5f,.card-shell.svelte-1yc0e5f:focus-within .category-lift.svelte-1yc0e5f{opacity:1;transform:translateY(0)}`);
}
function as(t) {
  let e;
  return {
    c() {
      e = h("div"), e.textContent = "▶", c(e, "class", "thumb-placeholder svelte-1yc0e5f");
    },
    m(s, i) {
      Y(s, e, i);
    },
    p: E,
    d(s) {
      s && R(e);
    }
  };
}
function rs(t) {
  let e, s, i;
  return {
    c() {
      e = h("img"), $e(e.src, s = /*thumbnail*/
      t[3]) || c(e, "src", s), c(e, "alt", i = `Miniatura de ${/*title*/
      t[0]}`), c(e, "loading", "lazy"), c(e, "class", "svelte-1yc0e5f");
    },
    m(l, f) {
      Y(l, e, f);
    },
    p(l, f) {
      f & /*thumbnail*/
      8 && !$e(e.src, s = /*thumbnail*/
      l[3]) && c(e, "src", s), f & /*title*/
      1 && i !== (i = `Miniatura de ${/*title*/
      l[0]}`) && c(e, "alt", i);
    },
    d(l) {
      l && R(e);
    }
  };
}
function Te(t) {
  let e, s;
  return {
    c() {
      e = h("div"), s = w(
        /*badge*/
        t[6]
      ), c(e, "class", "pill badge svelte-1yc0e5f");
    },
    m(i, l) {
      Y(i, e, l), r(e, s);
    },
    p(i, l) {
      l & /*badge*/
      64 && L(
        s,
        /*badge*/
        i[6]
      );
    },
    d(i) {
      i && R(e);
    }
  };
}
function Xe(t) {
  let e, s, i, l, f, n = (
    /*categoryRight*/
    t[9] && Be(t)
  );
  return {
    c() {
      e = h("div"), s = h("span"), i = w(
        /*categoryLeft*/
        t[8]
      ), f = z(), n && n.c(), c(s, "class", "category-chip svelte-1yc0e5f"), c(s, "style", l = `--chip-color: ${/*categoryLeftColor*/
      t[10]};`), c(e, "class", "category-lift svelte-1yc0e5f"), c(e, "aria-hidden", "true");
    },
    m(a, o) {
      Y(a, e, o), r(e, s), r(s, i), r(e, f), n && n.m(e, null);
    },
    p(a, o) {
      o & /*categoryLeft*/
      256 && L(
        i,
        /*categoryLeft*/
        a[8]
      ), o & /*categoryLeftColor*/
      1024 && l !== (l = `--chip-color: ${/*categoryLeftColor*/
      a[10]};`) && c(s, "style", l), /*categoryRight*/
      a[9] ? n ? n.p(a, o) : (n = Be(a), n.c(), n.m(e, null)) : n && (n.d(1), n = null);
    },
    d(a) {
      a && R(e), n && n.d();
    }
  };
}
function Be(t) {
  let e, s, i;
  return {
    c() {
      e = h("span"), s = w(
        /*categoryRight*/
        t[9]
      ), c(e, "class", "category-chip svelte-1yc0e5f"), c(e, "style", i = `--chip-color: ${/*categoryRightColor*/
      t[11]};`);
    },
    m(l, f) {
      Y(l, e, f), r(e, s);
    },
    p(l, f) {
      f & /*categoryRight*/
      512 && L(
        s,
        /*categoryRight*/
        l[9]
      ), f & /*categoryRightColor*/
      2048 && i !== (i = `--chip-color: ${/*categoryRightColor*/
      l[11]};`) && c(e, "style", i);
    },
    d(l) {
      l && R(e);
    }
  };
}
function os(t) {
  let e, s, i, l, f, n, a, o, g, u, b, d, v, p, m, k, S, j, q, _, C, x, $, M, A, P, te, se = (
    /*selected*/
    t[4] ? "Seleccionado" : "Seleccionar video"
  ), re, le, K, Z, ie, ne, ae, X;
  function O(I, T) {
    return (
      /*thumbnail*/
      I[3] ? rs : as
    );
  }
  let he = O(t), ee = he(t), D = (
    /*badge*/
    t[6] && Te(t)
  ), H = (
    /*categoryLeft*/
    t[8] && Xe(t)
  );
  return {
    c() {
      e = h("div"), s = h("div"), i = h("div"), ee.c(), l = z(), f = h("div"), n = z(), a = h("div"), o = h("div"), g = w(
        /*duration*/
        t[2]
      ), u = z(), D && D.c(), b = z(), d = h("button"), v = ze("svg"), p = ze("path"), S = z(), j = h("div"), j.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" class="svelte-1yc0e5f"><path d="M9.2 16.2L5.7 12.7l1.4-1.4 2.1 2.1 7.7-7.7 1.4 1.4z"></path></svg>', q = z(), _ = h("div"), C = h("h3"), x = w(
        /*title*/
        t[0]
      ), $ = z(), M = h("p"), A = w(
        /*description*/
        t[1]
      ), P = z(), te = h("div"), re = w(se), ie = z(), H && H.c(), c(f, "class", "thumb-overlay svelte-1yc0e5f"), c(o, "class", "pill svelte-1yc0e5f"), c(a, "class", "pill-row svelte-1yc0e5f"), c(p, "d", "M12.1 21.2c-0.1 0-0.3 0-0.4-0.1C6.1 18.6 2 15 2 10.4 2 7.6 4.3 5.3 7.1 5.3c1.7 0 3.3 0.8 4.3 2.1 1-1.3 2.6-2.1 4.3-2.1 2.8 0 5.1 2.3 5.1 5.1 0 4.6-4.1 8.2-9.7 10.7-0.1 0-0.2 0.1-0.3 0.1z"), c(v, "viewBox", "0 0 24 24"), c(v, "aria-hidden", "true"), c(v, "class", "svelte-1yc0e5f"), c(d, "class", m = "favorite " + /*favorite*/
      (t[7] ? "active" : "") + " svelte-1yc0e5f"), c(d, "aria-label", k = /*favorite*/
      t[7] ? "Quitar de favoritos" : "Anadir a favoritos"), c(j, "class", "check svelte-1yc0e5f"), c(i, "class", "thumb svelte-1yc0e5f"), c(C, "class", "svelte-1yc0e5f"), c(M, "class", "svelte-1yc0e5f"), c(te, "class", le = "cta " + /*selected*/
      (t[4] ? "cta-selected" : "") + " svelte-1yc0e5f"), c(_, "class", "body svelte-1yc0e5f"), c(s, "class", K = "card " + /*selected*/
      (t[4] ? "is-selected" : "") + " " + /*disabled*/
      (t[5] ? "is-disabled" : "") + " svelte-1yc0e5f"), c(s, "role", "button"), c(
        s,
        "aria-disabled",
        /*disabled*/
        t[5]
      ), c(s, "tabindex", Z = /*disabled*/
      t[5] ? -1 : 0), c(e, "class", "card-shell svelte-1yc0e5f"), c(e, "style", ne = `--category-left: ${/*categoryLeftColor*/
      t[10]}; --category-right: ${/*categoryRightColor*/
      t[11]};`);
    },
    m(I, T) {
      Y(I, e, T), r(e, s), r(s, i), ee.m(i, null), r(i, l), r(i, f), r(i, n), r(i, a), r(a, o), r(o, g), r(a, u), D && D.m(a, null), r(i, b), r(i, d), r(d, v), r(v, p), r(i, S), r(i, j), r(s, q), r(s, _), r(_, C), r(C, x), r(_, $), r(_, M), r(M, A), r(_, P), r(_, te), r(te, re), r(e, ie), H && H.m(e, null), ae || (X = [
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
    p(I, [T]) {
      he === (he = O(I)) && ee ? ee.p(I, T) : (ee.d(1), ee = he(I), ee && (ee.c(), ee.m(i, l))), T & /*duration*/
      4 && L(
        g,
        /*duration*/
        I[2]
      ), /*badge*/
      I[6] ? D ? D.p(I, T) : (D = Te(I), D.c(), D.m(a, null)) : D && (D.d(1), D = null), T & /*favorite*/
      128 && m !== (m = "favorite " + /*favorite*/
      (I[7] ? "active" : "") + " svelte-1yc0e5f") && c(d, "class", m), T & /*favorite*/
      128 && k !== (k = /*favorite*/
      I[7] ? "Quitar de favoritos" : "Anadir a favoritos") && c(d, "aria-label", k), T & /*title*/
      1 && L(
        x,
        /*title*/
        I[0]
      ), T & /*description*/
      2 && L(
        A,
        /*description*/
        I[1]
      ), T & /*selected*/
      16 && se !== (se = /*selected*/
      I[4] ? "Seleccionado" : "Seleccionar video") && L(re, se), T & /*selected*/
      16 && le !== (le = "cta " + /*selected*/
      (I[4] ? "cta-selected" : "") + " svelte-1yc0e5f") && c(te, "class", le), T & /*selected, disabled*/
      48 && K !== (K = "card " + /*selected*/
      (I[4] ? "is-selected" : "") + " " + /*disabled*/
      (I[5] ? "is-disabled" : "") + " svelte-1yc0e5f") && c(s, "class", K), T & /*disabled*/
      32 && c(
        s,
        "aria-disabled",
        /*disabled*/
        I[5]
      ), T & /*disabled*/
      32 && Z !== (Z = /*disabled*/
      I[5] ? -1 : 0) && c(s, "tabindex", Z), /*categoryLeft*/
      I[8] ? H ? H.p(I, T) : (H = Xe(I), H.c(), H.m(e, null)) : H && (H.d(1), H = null), T & /*categoryLeftColor, categoryRightColor*/
      3072 && ne !== (ne = `--category-left: ${/*categoryLeftColor*/
      I[10]}; --category-right: ${/*categoryRightColor*/
      I[11]};`) && c(e, "style", ne);
    },
    i: E,
    o: E,
    d(I) {
      I && R(e), ee.d(), D && D.d(), H && H.d(), ae = !1, W(X);
    }
  };
}
function cs(t, e, s) {
  let { videoId: i = "" } = e, { hashedId: l = "" } = e, { title: f = "" } = e, { description: n = "" } = e, { duration: a = "" } = e, { thumbnail: o = "" } = e, { selected: g = !1 } = e, { disabled: u = !1 } = e, { badge: b = "" } = e, { tags: d = [] } = e, { favorite: v = !1 } = e, { categoryLeft: p = "" } = e, { categoryRight: m = "" } = e, { categoryLeftColor: k = "#94a3b8" } = e, { categoryRightColor: S = "#94a3b8" } = e;
  const j = ue(), q = () => {
    u || j("select", { id: i });
  }, _ = (x) => {
    x.stopPropagation(), !u && j("favorite", { hashedId: l });
  }, C = (x) => {
    u || (x.key === "Enter" || x.key === " ") && (x.preventDefault(), q());
  };
  return t.$$set = (x) => {
    "videoId" in x && s(15, i = x.videoId), "hashedId" in x && s(16, l = x.hashedId), "title" in x && s(0, f = x.title), "description" in x && s(1, n = x.description), "duration" in x && s(2, a = x.duration), "thumbnail" in x && s(3, o = x.thumbnail), "selected" in x && s(4, g = x.selected), "disabled" in x && s(5, u = x.disabled), "badge" in x && s(6, b = x.badge), "tags" in x && s(17, d = x.tags), "favorite" in x && s(7, v = x.favorite), "categoryLeft" in x && s(8, p = x.categoryLeft), "categoryRight" in x && s(9, m = x.categoryRight), "categoryLeftColor" in x && s(10, k = x.categoryLeftColor), "categoryRightColor" in x && s(11, S = x.categoryRightColor);
  }, [
    f,
    n,
    a,
    o,
    g,
    u,
    b,
    v,
    p,
    m,
    k,
    S,
    q,
    _,
    C,
    i,
    l,
    d
  ];
}
class it extends Q {
  constructor(e) {
    super(), V(
      this,
      e,
      cs,
      os,
      B,
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
      ns
    );
  }
  get videoId() {
    return this.$$.ctx[15];
  }
  set videoId(e) {
    this.$$set({ videoId: e }), y();
  }
  get hashedId() {
    return this.$$.ctx[16];
  }
  set hashedId(e) {
    this.$$set({ hashedId: e }), y();
  }
  get title() {
    return this.$$.ctx[0];
  }
  set title(e) {
    this.$$set({ title: e }), y();
  }
  get description() {
    return this.$$.ctx[1];
  }
  set description(e) {
    this.$$set({ description: e }), y();
  }
  get duration() {
    return this.$$.ctx[2];
  }
  set duration(e) {
    this.$$set({ duration: e }), y();
  }
  get thumbnail() {
    return this.$$.ctx[3];
  }
  set thumbnail(e) {
    this.$$set({ thumbnail: e }), y();
  }
  get selected() {
    return this.$$.ctx[4];
  }
  set selected(e) {
    this.$$set({ selected: e }), y();
  }
  get disabled() {
    return this.$$.ctx[5];
  }
  set disabled(e) {
    this.$$set({ disabled: e }), y();
  }
  get badge() {
    return this.$$.ctx[6];
  }
  set badge(e) {
    this.$$set({ badge: e }), y();
  }
  get tags() {
    return this.$$.ctx[17];
  }
  set tags(e) {
    this.$$set({ tags: e }), y();
  }
  get favorite() {
    return this.$$.ctx[7];
  }
  set favorite(e) {
    this.$$set({ favorite: e }), y();
  }
  get categoryLeft() {
    return this.$$.ctx[8];
  }
  set categoryLeft(e) {
    this.$$set({ categoryLeft: e }), y();
  }
  get categoryRight() {
    return this.$$.ctx[9];
  }
  set categoryRight(e) {
    this.$$set({ categoryRight: e }), y();
  }
  get categoryLeftColor() {
    return this.$$.ctx[10];
  }
  set categoryLeftColor(e) {
    this.$$set({ categoryLeftColor: e }), y();
  }
  get categoryRightColor() {
    return this.$$.ctx[11];
  }
  set categoryRightColor(e) {
    this.$$set({ categoryRightColor: e }), y();
  }
}
customElements.define("svelte-video-card", J(it, { videoId: {}, hashedId: {}, title: {}, description: {}, duration: {}, thumbnail: {}, selected: { type: "Boolean" }, disabled: { type: "Boolean" }, badge: {}, tags: {}, favorite: { type: "Boolean" }, categoryLeft: {}, categoryRight: {}, categoryLeftColor: {}, categoryRightColor: {} }, [], [], !0));
const U = (t, e) => {
  const s = e.element;
  customElements.get(t) || customElements.define(t, s ?? e);
};
U("svelte-counter", Ve);
U("svelte-orbit-card", Je);
U("svelte-pulse-badge", Qe);
U("svelte-ripple-button", Ue);
U("svelte-stagger-list", Ge);
U("svelte-thermometer", Ke);
U("svelte-podium", We);
U("svelte-balloon-gift", Ze);
U("svelte-achievement-card", et);
U("svelte-parallax-card", tt);
U("svelte-flip-counter", st);
U("svelte-parallax-stack", lt);
U("svelte-video-card", it);
