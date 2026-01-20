var Ve = Object.defineProperty;
var Je = (t, e, s) => e in t ? Ve(t, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : t[e] = s;
var O = (t, e, s) => Je(t, typeof e != "symbol" ? e + "" : e, s);
function M() {
}
function Se(t) {
  return t();
}
function be() {
  return /* @__PURE__ */ Object.create(null);
}
function J(t) {
  t.forEach(Se);
}
function Me(t) {
  return typeof t == "function";
}
function A(t, e) {
  return t != t ? e == e : t !== e || t && typeof t == "object" || typeof t == "function";
}
function Ge(t) {
  return Object.keys(t).length === 0;
}
function ie(t) {
  return t ?? "";
}
function o(t, e) {
  t.appendChild(e);
}
function B(t, e, s) {
  const n = Ue(t);
  if (!n.getElementById(e)) {
    const l = h("style");
    l.id = e, l.textContent = s, Ke(n, l);
  }
}
function Ue(t) {
  if (!t) return document;
  const e = t.getRootNode ? t.getRootNode() : t.ownerDocument;
  return e && /** @type {ShadowRoot} */
  e.host ? (
    /** @type {ShadowRoot} */
    e
  ) : t.ownerDocument;
}
function Ke(t, e) {
  return o(
    /** @type {Document} */
    t.head || t,
    e
  ), e.sheet;
}
function T(t, e, s) {
  t.insertBefore(e, s || null);
}
function L(t) {
  t.parentNode && t.parentNode.removeChild(t);
}
function h(t) {
  return document.createElement(t);
}
function w(t) {
  return document.createTextNode(t);
}
function $() {
  return w(" ");
}
function X(t, e, s, n) {
  return t.addEventListener(e, s, n), () => t.removeEventListener(e, s, n);
}
function d(t, e, s) {
  s == null ? t.removeAttribute(e) : t.getAttribute(e) !== s && t.setAttribute(e, s);
}
function Qe(t) {
  return Array.from(t.childNodes);
}
function S(t, e) {
  e = "" + e, t.data !== e && (t.data = /** @type {string} */
  e);
}
function We(t, e, { bubbles: s = !1, cancelable: n = !1 } = {}) {
  return new CustomEvent(t, { detail: e, bubbles: s, cancelable: n });
}
function Ze(t) {
  const e = {};
  return t.childNodes.forEach(
    /** @param {Element} node */
    (s) => {
      e[s.slot || "default"] = !0;
    }
  ), e;
}
let te;
function ee(t) {
  te = t;
}
function Ee() {
  if (!te) throw new Error("Function called outside component initialization");
  return te;
}
function et(t) {
  Ee().$$.on_mount.push(t);
}
function se() {
  const t = Ee();
  return (e, s, { cancelable: n = !1 } = {}) => {
    const l = t.$$.callbacks[e];
    if (l) {
      const c = We(
        /** @type {string} */
        e,
        s,
        { cancelable: n }
      );
      return l.slice().forEach((i) => {
        i.call(t, c);
      }), !c.defaultPrevented;
    }
    return !0;
  };
}
const K = [], me = [];
let Q = [];
const xe = [], tt = /* @__PURE__ */ Promise.resolve();
let ce = !1;
function st() {
  ce || (ce = !0, tt.then(y));
}
function fe(t) {
  Q.push(t);
}
const oe = /* @__PURE__ */ new Set();
let U = 0;
function y() {
  if (U !== 0)
    return;
  const t = te;
  do {
    try {
      for (; U < K.length; ) {
        const e = K[U];
        U++, ee(e), lt(e.$$);
      }
    } catch (e) {
      throw K.length = 0, U = 0, e;
    }
    for (ee(null), K.length = 0, U = 0; me.length; ) me.pop()();
    for (let e = 0; e < Q.length; e += 1) {
      const s = Q[e];
      oe.has(s) || (oe.add(s), s());
    }
    Q.length = 0;
  } while (K.length);
  for (; xe.length; )
    xe.pop()();
  ce = !1, oe.clear(), ee(t);
}
function lt(t) {
  if (t.fragment !== null) {
    t.update(), J(t.before_update);
    const e = t.dirty;
    t.dirty = [-1], t.fragment && t.fragment.p(t.ctx, e), t.after_update.forEach(fe);
  }
}
function nt(t) {
  const e = [], s = [];
  Q.forEach((n) => t.indexOf(n) === -1 ? e.push(n) : s.push(n)), s.forEach((n) => n()), Q = e;
}
const it = /* @__PURE__ */ new Set();
function Ne(t, e) {
  t && t.i && (it.delete(t), t.i(e));
}
function W(t) {
  return (t == null ? void 0 : t.length) !== void 0 ? t : Array.from(t);
}
function de(t, e) {
  t.d(1), e.delete(t.key);
}
function ue(t, e, s, n, l, c, i, r, a, g, u, b) {
  let f = t.length, v = c.length, p = f;
  const m = {};
  for (; p--; ) m[t[p].key] = p;
  const x = [], C = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), _ = [];
  for (p = v; p--; ) {
    const k = b(l, c, p), E = s(k);
    let Y = i.get(E);
    Y ? _.push(() => Y.p(k, e)) : (Y = g(E, k), Y.c()), C.set(E, x[p] = Y), E in m && z.set(E, Math.abs(p - m[E]));
  }
  const q = /* @__PURE__ */ new Set(), j = /* @__PURE__ */ new Set();
  function N(k) {
    Ne(k, 1), k.m(r, u), i.set(k.key, k), u = k.first, v--;
  }
  for (; f && v; ) {
    const k = x[v - 1], E = t[f - 1], Y = k.key, F = E.key;
    k === E ? (u = k.first, f--, v--) : C.has(F) ? !i.has(Y) || q.has(Y) ? N(k) : j.has(F) ? f-- : z.get(Y) > z.get(F) ? (j.add(Y), N(k)) : (q.add(F), f--) : (a(E, i), f--);
  }
  for (; f--; ) {
    const k = t[f];
    C.has(k.key) || a(k, i);
  }
  for (; v; ) N(x[v - 1]);
  return J(_), x;
}
function rt(t, e, s) {
  const { fragment: n, after_update: l } = t.$$;
  n && n.m(e, s), fe(() => {
    const c = t.$$.on_mount.map(Se).filter(Me);
    t.$$.on_destroy ? t.$$.on_destroy.push(...c) : J(c), t.$$.on_mount = [];
  }), l.forEach(fe);
}
function at(t, e) {
  const s = t.$$;
  s.fragment !== null && (nt(s.after_update), J(s.on_destroy), s.fragment && s.fragment.d(e), s.on_destroy = s.fragment = null, s.ctx = []);
}
function ot(t, e) {
  t.$$.dirty[0] === -1 && (K.push(t), st(), t.$$.dirty.fill(0)), t.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function I(t, e, s, n, l, c, i = null, r = [-1]) {
  const a = te;
  ee(t);
  const g = t.$$ = {
    fragment: null,
    ctx: [],
    // state
    props: c,
    update: M,
    not_equal: l,
    bound: be(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(e.context || (a ? a.$$.context : [])),
    // everything else
    callbacks: be(),
    dirty: r,
    skip_bound: !1,
    root: e.target || a.$$.root
  };
  i && i(g.root);
  let u = !1;
  if (g.ctx = s ? s(t, e.props || {}, (b, f, ...v) => {
    const p = v.length ? v[0] : f;
    return g.ctx && l(g.ctx[b], g.ctx[b] = p) && (!g.skip_bound && g.bound[b] && g.bound[b](p), u && ot(t, b)), f;
  }) : [], g.update(), u = !0, J(g.before_update), g.fragment = n ? n(g.ctx) : !1, e.target) {
    if (e.hydrate) {
      const b = Qe(e.target);
      g.fragment && g.fragment.l(b), b.forEach(L);
    } else
      g.fragment && g.fragment.c();
    e.intro && Ne(t.$$.fragment), rt(t, e.target, e.anchor), y();
  }
  ee(a);
}
let Ye;
typeof HTMLElement == "function" && (Ye = class extends HTMLElement {
  constructor(e, s, n) {
    super();
    /** The Svelte component constructor */
    O(this, "$$ctor");
    /** Slots */
    O(this, "$$s");
    /** The Svelte component instance */
    O(this, "$$c");
    /** Whether or not the custom element is connected */
    O(this, "$$cn", !1);
    /** Component props data */
    O(this, "$$d", {});
    /** `true` if currently in the process of reflecting component props back to attributes */
    O(this, "$$r", !1);
    /** @type {Record<string, CustomElementPropDefinition>} Props definition (name, reflected, type etc) */
    O(this, "$$p_d", {});
    /** @type {Record<string, Function[]>} Event listeners */
    O(this, "$$l", {});
    /** @type {Map<Function, Function>} Event listener unsubscribe functions */
    O(this, "$$l_u", /* @__PURE__ */ new Map());
    this.$$ctor = e, this.$$s = s, n && this.attachShadow({ mode: "open" });
  }
  addEventListener(e, s, n) {
    if (this.$$l[e] = this.$$l[e] || [], this.$$l[e].push(s), this.$$c) {
      const l = this.$$c.$on(e, s);
      this.$$l_u.set(s, l);
    }
    super.addEventListener(e, s, n);
  }
  removeEventListener(e, s, n) {
    if (super.removeEventListener(e, s, n), this.$$c) {
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
      let s = function(i) {
        return () => {
          let r;
          return {
            c: function() {
              r = h("slot"), i !== "default" && d(r, "name", i);
            },
            /**
             * @param {HTMLElement} target
             * @param {HTMLElement} [anchor]
             */
            m: function(u, b) {
              T(u, r, b);
            },
            d: function(u) {
              u && L(r);
            }
          };
        };
      };
      var e = s;
      if (await Promise.resolve(), !this.$$cn || this.$$c)
        return;
      const n = {}, l = Ze(this);
      for (const i of this.$$s)
        i in l && (n[i] = [s(i)]);
      for (const i of this.attributes) {
        const r = this.$$g_p(i.name);
        r in this.$$d || (this.$$d[r] = ne(r, i.value, this.$$p_d, "toProp"));
      }
      for (const i in this.$$p_d)
        !(i in this.$$d) && this[i] !== void 0 && (this.$$d[i] = this[i], delete this[i]);
      this.$$c = new this.$$ctor({
        target: this.shadowRoot || this,
        props: {
          ...this.$$d,
          $$slots: n,
          $$scope: {
            ctx: []
          }
        }
      });
      const c = () => {
        this.$$r = !0;
        for (const i in this.$$p_d)
          if (this.$$d[i] = this.$$c.$$.ctx[this.$$c.$$.props[i]], this.$$p_d[i].reflect) {
            const r = ne(
              i,
              this.$$d[i],
              this.$$p_d,
              "toAttribute"
            );
            r == null ? this.removeAttribute(this.$$p_d[i].attribute || i) : this.setAttribute(this.$$p_d[i].attribute || i, r);
          }
        this.$$r = !1;
      };
      this.$$c.$$.after_update.push(c), c();
      for (const i in this.$$l)
        for (const r of this.$$l[i]) {
          const a = this.$$c.$on(i, r);
          this.$$l_u.set(r, a);
        }
      this.$$l = {};
    }
  }
  // We don't need this when working within Svelte code, but for compatibility of people using this outside of Svelte
  // and setting attributes through setAttribute etc, this is helpful
  attributeChangedCallback(e, s, n) {
    var l;
    this.$$r || (e = this.$$g_p(e), this.$$d[e] = ne(e, n, this.$$p_d, "toProp"), (l = this.$$c) == null || l.$set({ [e]: this.$$d[e] }));
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
function ne(t, e, s, n) {
  var c;
  const l = (c = s[t]) == null ? void 0 : c.type;
  if (e = l === "Boolean" && typeof e != "boolean" ? e != null : e, !n || !s[t])
    return e;
  if (n === "toAttribute")
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
function R(t, e, s, n, l, c) {
  let i = class extends Ye {
    constructor() {
      super(t, s, l), this.$$p_d = e;
    }
    static get observedAttributes() {
      return Object.keys(e).map(
        (r) => (e[r].attribute || r).toLowerCase()
      );
    }
  };
  return Object.keys(e).forEach((r) => {
    Object.defineProperty(i.prototype, r, {
      get() {
        return this.$$c && r in this.$$c ? this.$$c[r] : this.$$d[r];
      },
      set(a) {
        var g;
        a = ne(r, a, e), this.$$d[r] = a, (g = this.$$c) == null || g.$set({ [r]: a });
      }
    });
  }), n.forEach((r) => {
    Object.defineProperty(i.prototype, r, {
      get() {
        var a;
        return (a = this.$$c) == null ? void 0 : a[r];
      }
    });
  }), t.element = /** @type {any} */
  i, i;
}
class D {
  constructor() {
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    O(this, "$$");
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    O(this, "$$set");
  }
  /** @returns {void} */
  $destroy() {
    at(this, 1), this.$destroy = M;
  }
  /**
   * @template {Extract<keyof Events, string>} K
   * @param {K} type
   * @param {((e: Events[K]) => void) | null | undefined} callback
   * @returns {() => void}
   */
  $on(e, s) {
    if (!Me(s))
      return M;
    const n = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
    return n.push(s), () => {
      const l = n.indexOf(s);
      l !== -1 && n.splice(l, 1);
    };
  }
  /**
   * @param {Partial<Props>} props
   * @returns {void}
   */
  $set(e) {
    this.$$set && !Ge(e) && (this.$$.skip_bound = !0, this.$$set(e), this.$$.skip_bound = !1);
  }
}
const ct = "4";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(ct);
function ft(t) {
  B(t, "svelte-1tevv97", '.card.svelte-1tevv97{border-radius:14px;border:1px solid #e2e8f0;padding:16px;display:grid;gap:12px;font-family:"Figtree", system-ui, sans-serif;background:#ffffff;box-shadow:0 12px 24px rgba(15, 23, 42, 0.08)}.label.svelte-1tevv97{font-size:14px;color:#0f172a;margin:0}.count.svelte-1tevv97{font-weight:600;font-size:20px;color:#0f172a;margin:0}button.svelte-1tevv97{border:0;border-radius:10px;padding:10px 12px;background:#10b981;color:white;cursor:pointer;font-weight:600}button.svelte-1tevv97:hover{background:#059669}');
}
function dt(t) {
  let e, s, n, l, c, i, r, a, g, u, b, f;
  return {
    c() {
      e = h("div"), s = h("p"), n = w("Hola "), l = w(
        /*name*/
        t[0]
      ), c = $(), i = h("p"), r = w("Count: "), a = w(
        /*count*/
        t[1]
      ), g = $(), u = h("button"), u.textContent = "Emitir evento", d(s, "class", "label svelte-1tevv97"), d(i, "class", "count svelte-1tevv97"), d(u, "type", "button"), d(u, "class", "svelte-1tevv97"), d(e, "class", "card svelte-1tevv97");
    },
    m(v, p) {
      T(v, e, p), o(e, s), o(s, n), o(s, l), o(e, c), o(e, i), o(i, r), o(i, a), o(e, g), o(e, u), b || (f = X(
        u,
        "click",
        /*notify*/
        t[2]
      ), b = !0);
    },
    p(v, [p]) {
      p & /*name*/
      1 && S(
        l,
        /*name*/
        v[0]
      ), p & /*count*/
      2 && S(
        a,
        /*count*/
        v[1]
      );
    },
    i: M,
    o: M,
    d(v) {
      v && L(e), b = !1, f();
    }
  };
}
function ut(t, e, s) {
  let { name: n = "Ada" } = e, { count: l = 2 } = e;
  const c = se(), i = () => {
    c("ping", { from: "svelte", count: l });
  };
  return t.$$set = (r) => {
    "name" in r && s(0, n = r.name), "count" in r && s(1, l = r.count);
  }, [n, l, i];
}
class Le extends D {
  constructor(e) {
    super(), I(this, e, ut, dt, A, { name: 0, count: 1 }, ft);
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
R(Le, { name: {}, count: {} }, [], [], !0);
function vt(t) {
  B(t, "svelte-5733sx", ".card.svelte-5733sx{position:relative;overflow:hidden;border-radius:20px;border:1px solid #d1fae5;background:linear-gradient(145deg, #ffffff, #ecfdf5);padding:20px;min-height:140px;box-shadow:0 16px 36px rgba(15, 23, 42, 0.12)}.glow.svelte-5733sx{position:absolute;inset:-40%;background:radial-gradient(circle at 30% 20%, rgba(16, 185, 129, 0.3), transparent 55%);opacity:0.7;filter:blur(8px)}.content.svelte-5733sx{position:relative;display:grid;gap:8px;color:#0f172a}.title.svelte-5733sx{font-size:16px;font-weight:600;margin:0}.subtitle.svelte-5733sx{font-size:12px;margin:0;color:#64748b}.metrics.svelte-5733sx{margin-top:12px;display:flex;justify-content:space-between;font-size:12px;color:#0f172a}.orbit.svelte-5733sx{position:absolute;inset:-30%;border-radius:999px;border:1px dashed rgba(16, 185, 129, 0.3);animation:svelte-5733sx-orbit 6s linear infinite;opacity:var(--orbit-alpha)}.satellite-orbit.svelte-5733sx{position:absolute;inset:-30%;border-radius:999px;animation:svelte-5733sx-orbit 6s linear infinite}.satellite.svelte-5733sx{position:absolute;width:10px;height:10px;border-radius:999px;background:#34d399;box-shadow:0 0 12px rgba(16, 185, 129, 0.6);top:50%;left:50%;transform:translate(-50%, -50%) translateY(-78px)}@keyframes svelte-5733sx-orbit{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}");
}
function gt(t) {
  let e, s, n, l, c, i, r, a, g, u, b, f, v, p, m, x, C, z, _, q, j, N, k;
  return {
    c() {
      e = h("div"), s = h("div"), n = $(), l = h("div"), c = h("p"), i = w(
        /*title*/
        t[0]
      ), r = $(), a = h("p"), g = w(
        /*subtitle*/
        t[1]
      ), u = $(), b = h("div"), f = h("span"), f.textContent = "Flow", v = $(), p = h("span"), m = w(
        /*flow*/
        t[3]
      ), x = w("%"), C = $(), z = h("div"), z.innerHTML = '<div class="satellite svelte-5733sx"></div>', _ = $(), q = h("div"), d(s, "class", "glow svelte-5733sx"), d(c, "class", "title svelte-5733sx"), d(a, "class", "subtitle svelte-5733sx"), d(b, "class", "metrics svelte-5733sx"), d(l, "class", "content svelte-5733sx"), d(z, "class", "satellite-orbit svelte-5733sx"), d(q, "class", "orbit svelte-5733sx"), d(e, "class", "card svelte-5733sx"), d(e, "style", j = `--orbit-alpha:${/*intensity*/
      t[2]}`), d(e, "role", "button"), d(e, "tabindex", "0");
    },
    m(E, Y) {
      T(E, e, Y), o(e, s), o(e, n), o(e, l), o(l, c), o(c, i), o(l, r), o(l, a), o(a, g), o(l, u), o(l, b), o(b, f), o(b, v), o(b, p), o(p, m), o(p, x), o(e, C), o(e, z), o(e, _), o(e, q), N || (k = [
        X(
          e,
          "mouseenter",
          /*handleHover*/
          t[4]
        ),
        X(
          e,
          "focus",
          /*handleHover*/
          t[4]
        ),
        X(
          e,
          "keydown",
          /*keydown_handler*/
          t[5]
        )
      ], N = !0);
    },
    p(E, [Y]) {
      Y & /*title*/
      1 && S(
        i,
        /*title*/
        E[0]
      ), Y & /*subtitle*/
      2 && S(
        g,
        /*subtitle*/
        E[1]
      ), Y & /*flow*/
      8 && S(
        m,
        /*flow*/
        E[3]
      ), Y & /*intensity*/
      4 && j !== (j = `--orbit-alpha:${/*intensity*/
      E[2]}`) && d(e, "style", j);
    },
    i: M,
    o: M,
    d(E) {
      E && L(e), N = !1, J(k);
    }
  };
}
function pt(t, e, s) {
  let { title: n = "Focus Ring" } = e, { subtitle: l = "Anillo orbital" } = e, { intensity: c = 0.6 } = e, { flow: i = 78 } = e;
  const r = se(), a = () => {
    r("hover", { title: n });
  }, g = (u) => {
    (u.key === "Enter" || u.key === " ") && a();
  };
  return t.$$set = (u) => {
    "title" in u && s(0, n = u.title), "subtitle" in u && s(1, l = u.subtitle), "intensity" in u && s(2, c = u.intensity), "flow" in u && s(3, i = u.flow);
  }, [n, l, c, i, a, g];
}
class Te extends D {
  constructor(e) {
    super(), I(
      this,
      e,
      pt,
      gt,
      A,
      {
        title: 0,
        subtitle: 1,
        intensity: 2,
        flow: 3
      },
      vt
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
R(Te, { title: {}, subtitle: {}, intensity: {}, flow: {} }, [], [], !0);
function ht(t) {
  B(t, "svelte-1vzxgvk", ".badge.svelte-1vzxgvk.svelte-1vzxgvk{display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border-radius:999px;border:1px solid transparent;font-size:12px;font-weight:600;letter-spacing:0.02em;cursor:pointer;background:#ecfdf5;color:#065f46}.badge.emerald.svelte-1vzxgvk.svelte-1vzxgvk{border-color:rgba(16, 185, 129, 0.35)}.dot.svelte-1vzxgvk.svelte-1vzxgvk{width:8px;height:8px;border-radius:999px;background:currentColor;box-shadow:0 0 0 rgba(16, 185, 129, 0.6)}.active.svelte-1vzxgvk .dot.svelte-1vzxgvk{animation:svelte-1vzxgvk-pulse 1.8s ease-in-out infinite}@keyframes svelte-1vzxgvk-pulse{0%{box-shadow:0 0 0 0 rgba(16, 185, 129, 0.6)}70%{box-shadow:0 0 0 12px rgba(16, 185, 129, 0)}100%{box-shadow:0 0 0 0 rgba(16, 185, 129, 0)}}");
}
function bt(t) {
  let e, s, n, l, c, i, r;
  return {
    c() {
      e = h("button"), s = h("span"), n = $(), l = w(
        /*label*/
        t[1]
      ), d(s, "class", "dot svelte-1vzxgvk"), d(e, "class", c = ie(`badge ${/*tone*/
      t[2]} ${/*active*/
      t[0] ? "active" : ""}`) + " svelte-1vzxgvk"), d(e, "type", "button");
    },
    m(a, g) {
      T(a, e, g), o(e, s), o(e, n), o(e, l), i || (r = X(
        e,
        "click",
        /*toggle*/
        t[3]
      ), i = !0);
    },
    p(a, [g]) {
      g & /*label*/
      2 && S(
        l,
        /*label*/
        a[1]
      ), g & /*tone, active*/
      5 && c !== (c = ie(`badge ${/*tone*/
      a[2]} ${/*active*/
      a[0] ? "active" : ""}`) + " svelte-1vzxgvk") && d(e, "class", c);
    },
    i: M,
    o: M,
    d(a) {
      a && L(e), i = !1, r();
    }
  };
}
function mt(t, e, s) {
  let { label: n = "Live" } = e, { tone: l = "emerald" } = e, { active: c = !0 } = e;
  const i = se(), r = () => {
    s(0, c = !c), i("toggle", { active: c });
  };
  return t.$$set = (a) => {
    "label" in a && s(1, n = a.label), "tone" in a && s(2, l = a.tone), "active" in a && s(0, c = a.active);
  }, [c, n, l, r];
}
class Xe extends D {
  constructor(e) {
    super(), I(this, e, mt, bt, A, { label: 1, tone: 2, active: 0 }, ht);
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
R(Xe, { label: {}, tone: {}, active: { type: "Boolean" } }, [], [], !0);
function xt(t) {
  B(t, "svelte-1io8dtn", ".ripple.svelte-1io8dtn{position:relative;overflow:hidden;padding:12px 20px;border-radius:14px;border:none;background:var(--tone);color:#ffffff;font-weight:600;cursor:pointer;box-shadow:0 16px 28px rgba(16, 185, 129, 0.25)}.label.svelte-1io8dtn{position:relative;z-index:1}.wave.svelte-1io8dtn{position:absolute;width:20px;height:20px;border-radius:999px;background:rgba(255, 255, 255, 0.45);transform:translate(-50%, -50%);animation:svelte-1io8dtn-ripple 0.8s ease-out forwards}@keyframes svelte-1io8dtn-ripple{from{opacity:0.7;transform:translate(-50%, -50%) scale(0)}to{opacity:0;transform:translate(-50%, -50%) scale(8)}}");
}
function ye(t, e, s) {
  const n = t.slice();
  return n[7] = e[s], n;
}
function ke(t, e) {
  let s, n, l, c;
  function i() {
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
      s = h("span"), d(s, "class", "wave svelte-1io8dtn"), d(s, "style", n = `left:${/*ripple*/
      e[7].x}px; top:${/*ripple*/
      e[7].y}px;`), this.first = s;
    },
    m(r, a) {
      T(r, s, a), l || (c = X(s, "animationend", i), l = !0);
    },
    p(r, a) {
      e = r, a & /*ripples*/
      4 && n !== (n = `left:${/*ripple*/
      e[7].x}px; top:${/*ripple*/
      e[7].y}px;`) && d(s, "style", n);
    },
    d(r) {
      r && L(s), l = !1, c();
    }
  };
}
function yt(t) {
  let e, s = [], n = /* @__PURE__ */ new Map(), l, c, i, r, a, g, u = W(
    /*ripples*/
    t[2]
  );
  const b = (f) => (
    /*ripple*/
    f[7].id
  );
  for (let f = 0; f < u.length; f += 1) {
    let v = ye(t, u, f), p = b(v);
    n.set(p, s[f] = ke(p, v));
  }
  return {
    c() {
      e = h("button");
      for (let f = 0; f < s.length; f += 1)
        s[f].c();
      l = $(), c = h("span"), i = w(
        /*label*/
        t[0]
      ), d(c, "class", "label svelte-1io8dtn"), d(e, "class", "ripple svelte-1io8dtn"), d(e, "type", "button"), d(e, "style", r = `--tone:${/*tone*/
      t[1]}`);
    },
    m(f, v) {
      T(f, e, v);
      for (let p = 0; p < s.length; p += 1)
        s[p] && s[p].m(e, null);
      o(e, l), o(e, c), o(c, i), a || (g = X(
        e,
        "click",
        /*handleClick*/
        t[3]
      ), a = !0);
    },
    p(f, [v]) {
      v & /*ripples, removeRipple*/
      20 && (u = W(
        /*ripples*/
        f[2]
      ), s = ue(s, v, b, 1, f, u, n, e, de, ke, l, ye)), v & /*label*/
      1 && S(
        i,
        /*label*/
        f[0]
      ), v & /*tone*/
      2 && r !== (r = `--tone:${/*tone*/
      f[1]}`) && d(e, "style", r);
    },
    i: M,
    o: M,
    d(f) {
      f && L(e);
      for (let v = 0; v < s.length; v += 1)
        s[v].d();
      a = !1, g();
    }
  };
}
function kt(t, e, s) {
  let { label: n = "Lanzar onda" } = e, { tone: l = "#10b981" } = e;
  const c = se();
  let i = [];
  const r = (u) => {
    const b = u.currentTarget.getBoundingClientRect(), f = u.clientX - b.left, v = u.clientY - b.top, p = Math.random().toString(36).slice(2);
    s(2, i = [...i, { id: p, x: f, y: v }]), c("ripple", { x: f, y: v });
  }, a = (u) => {
    s(2, i = i.filter((b) => b.id !== u));
  }, g = (u) => a(u.id);
  return t.$$set = (u) => {
    "label" in u && s(0, n = u.label), "tone" in u && s(1, l = u.tone);
  }, [n, l, i, r, a, g];
}
class Ae extends D {
  constructor(e) {
    super(), I(this, e, kt, yt, A, { label: 0, tone: 1 }, xt);
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
R(Ae, { label: {}, tone: {} }, [], [], !0);
function wt(t) {
  B(t, "svelte-1jr61rp", ".list.svelte-1jr61rp{border-radius:18px;border:1px solid #e2e8f0;background:#ffffff;padding:16px;display:grid;gap:16px}.header.svelte-1jr61rp{display:flex;justify-content:space-between;align-items:center}.title.svelte-1jr61rp{margin:0;font-size:14px;font-weight:600;color:#0f172a}.subtitle.svelte-1jr61rp{margin:0;font-size:11px;color:#94a3b8}button.svelte-1jr61rp{border:1px solid #d1fae5;background:#ecfdf5;color:#065f46;font-size:12px;padding:6px 10px;border-radius:10px;cursor:pointer}.items.svelte-1jr61rp{display:grid;gap:10px}.item.svelte-1jr61rp{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-radius:12px;background:#f8fafc;color:#0f172a;font-size:13px;animation:svelte-1jr61rp-slide-in 0.5s ease forwards;opacity:0;transform:translateY(6px)}.score.svelte-1jr61rp{font-weight:600}@keyframes svelte-1jr61rp-slide-in{to{opacity:1;transform:translateY(0)}}");
}
function we(t, e, s) {
  const n = t.slice();
  return n[7] = e[s], n[9] = s, n;
}
function _e(t, e) {
  let s, n, l = (
    /*item*/
    e[7].title + ""
  ), c, i, r, a = (
    /*item*/
    e[7].score + ""
  ), g, u, b, f;
  return {
    key: t,
    first: null,
    c() {
      s = h("div"), n = h("span"), c = w(l), i = $(), r = h("span"), g = w(a), u = w("%"), b = $(), d(r, "class", "score svelte-1jr61rp"), d(s, "class", "item svelte-1jr61rp"), d(s, "style", f = `animation-delay:${/*index*/
      e[9] * /*cadence*/
      e[1]}ms`), this.first = s;
    },
    m(v, p) {
      T(v, s, p), o(s, n), o(n, c), o(s, i), o(s, r), o(r, g), o(r, u), o(s, b);
    },
    p(v, p) {
      e = v, p & /*items*/
      4 && l !== (l = /*item*/
      e[7].title + "") && S(c, l), p & /*items*/
      4 && a !== (a = /*item*/
      e[7].score + "") && S(g, a), p & /*items, cadence*/
      6 && f !== (f = `animation-delay:${/*index*/
      e[9] * /*cadence*/
      e[1]}ms`) && d(s, "style", f);
    },
    d(v) {
      v && L(s);
    }
  };
}
function _t(t) {
  let e, s, n, l, c, i, r, a, g, u, b, f, v = [], p = /* @__PURE__ */ new Map(), m, x, C = W(
    /*items*/
    t[2]
  );
  const z = (_) => (
    /*item*/
    _[7].id
  );
  for (let _ = 0; _ < C.length; _ += 1) {
    let q = we(t, C, _), j = z(q);
    p.set(j, v[_] = _e(j, q));
  }
  return {
    c() {
      e = h("div"), s = h("div"), n = h("div"), l = h("p"), l.textContent = "Stagger list", c = $(), i = h("p"), r = w(
        /*count*/
        t[0]
      ), a = w(" items"), g = $(), u = h("button"), u.textContent = "Actualizar", b = $(), f = h("div");
      for (let _ = 0; _ < v.length; _ += 1)
        v[_].c();
      d(l, "class", "title svelte-1jr61rp"), d(i, "class", "subtitle svelte-1jr61rp"), d(u, "type", "button"), d(u, "class", "svelte-1jr61rp"), d(s, "class", "header svelte-1jr61rp"), d(f, "class", "items svelte-1jr61rp"), d(e, "class", "list svelte-1jr61rp");
    },
    m(_, q) {
      T(_, e, q), o(e, s), o(s, n), o(n, l), o(n, c), o(n, i), o(i, r), o(i, a), o(s, g), o(s, u), o(e, b), o(e, f);
      for (let j = 0; j < v.length; j += 1)
        v[j] && v[j].m(f, null);
      m || (x = X(
        u,
        "click",
        /*handleRefresh*/
        t[3]
      ), m = !0);
    },
    p(_, [q]) {
      q & /*count*/
      1 && S(
        r,
        /*count*/
        _[0]
      ), q & /*items, cadence*/
      6 && (C = W(
        /*items*/
        _[2]
      ), v = ue(v, q, z, 1, _, C, p, f, de, _e, null, we));
    },
    i: M,
    o: M,
    d(_) {
      _ && L(e);
      for (let q = 0; q < v.length; q += 1)
        v[q].d();
      m = !1, x();
    }
  };
}
function qt(t, e, s) {
  let { label: n = "Batch" } = e, { count: l = 5 } = e, { cadence: c = 120 } = e;
  const i = se();
  let r = [];
  const a = () => {
    s(2, r = Array.from({ length: l }, (u, b) => ({
      id: `${n}-${b}`,
      title: `${n} ${b + 1}`,
      score: Math.floor(Math.random() * 40) + 60
    }))), i("refresh", { count: l });
  }, g = () => {
    a();
  };
  return et(a), t.$$set = (u) => {
    "label" in u && s(4, n = u.label), "count" in u && s(0, l = u.count), "cadence" in u && s(1, c = u.cadence);
  }, [l, c, r, g, n];
}
class Pe extends D {
  constructor(e) {
    super(), I(this, e, qt, _t, A, { label: 4, count: 0, cadence: 1 }, wt);
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
R(Pe, { label: {}, count: {}, cadence: {} }, [], [], !0);
function $t(t) {
  B(t, "svelte-1o8h3wg", ".thermo.svelte-1o8h3wg{display:grid;gap:16px;border-radius:18px;border:1px solid #e2e8f0;padding:16px;background:#ffffff}.header.svelte-1o8h3wg{display:flex;justify-content:space-between;align-items:center}.title.svelte-1o8h3wg{margin:0;font-size:14px;font-weight:600;color:#0f172a}.subtitle.svelte-1o8h3wg{margin:0;font-size:12px;color:#64748b}.chip.svelte-1o8h3wg{font-size:11px;padding:4px 8px;border-radius:999px;background:#ecfdf5;color:#065f46;border:1px solid rgba(16, 185, 129, 0.2)}.meter.svelte-1o8h3wg{position:relative;height:160px;display:grid;place-items:center}.tube.svelte-1o8h3wg{position:relative;width:24px;height:140px;border-radius:14px;background:#f1f5f9;border:1px solid #e2e8f0;overflow:hidden;box-shadow:inset 0 6px 16px rgba(15, 23, 42, 0.08)}.fill.svelte-1o8h3wg{position:absolute;left:0;right:0;bottom:0;height:var(--level);background:linear-gradient(180deg, #ffffff, var(--fill));transition:height 0.8s cubic-bezier(0.22, 1, 0.36, 1)}.gloss.svelte-1o8h3wg{position:absolute;left:3px;top:8px;width:6px;height:calc(100% - 16px);border-radius:999px;background:rgba(255, 255, 255, 0.6);animation:svelte-1o8h3wg-shimmer 2.4s ease-in-out infinite}.bulb.svelte-1o8h3wg{position:absolute;bottom:-6px;width:44px;height:44px;border-radius:999px;background:radial-gradient(circle at 30% 30%, #ffffff, var(--fill));border:2px solid rgba(226, 232, 240, 0.9);box-shadow:0 10px 24px var(--glow);animation:svelte-1o8h3wg-pulse 2.2s ease-in-out infinite}@keyframes svelte-1o8h3wg-shimmer{0%,100%{opacity:0.35;transform:translateY(0)}50%{opacity:0.7;transform:translateY(-8px)}}@keyframes svelte-1o8h3wg-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}");
}
function zt(t) {
  let e, s, n, l, c, i, r, a, g, u, b, f, v, p, m, x, C, z, _, q;
  return {
    c() {
      e = h("div"), s = h("div"), n = h("div"), l = h("p"), c = w(
        /*label*/
        t[0]
      ), i = $(), r = h("p"), a = w(
        /*safeValue*/
        t[3]
      ), g = w("°C · "), u = w(
        /*percent*/
        t[6]
      ), b = w("%"), f = $(), v = h("div"), p = w(
        /*min*/
        t[1]
      ), m = w("° – "), x = w(
        /*max*/
        t[2]
      ), C = w("°"), z = $(), _ = h("div"), _.innerHTML = '<div class="tube svelte-1o8h3wg"><div class="fill svelte-1o8h3wg"></div> <div class="gloss svelte-1o8h3wg"></div></div> <div class="bulb svelte-1o8h3wg"></div>', d(l, "class", "title svelte-1o8h3wg"), d(r, "class", "subtitle svelte-1o8h3wg"), d(v, "class", "chip svelte-1o8h3wg"), d(s, "class", "header svelte-1o8h3wg"), d(_, "class", "meter svelte-1o8h3wg"), d(e, "class", "thermo svelte-1o8h3wg"), d(e, "style", q = `--level:${/*percent*/
      t[6]}%; --fill:${/*fillColor*/
      t[5]}; --glow:${/*glowColor*/
      t[4]};`);
    },
    m(j, N) {
      T(j, e, N), o(e, s), o(s, n), o(n, l), o(l, c), o(n, i), o(n, r), o(r, a), o(r, g), o(r, u), o(r, b), o(s, f), o(s, v), o(v, p), o(v, m), o(v, x), o(v, C), o(e, z), o(e, _);
    },
    p(j, [N]) {
      N & /*label*/
      1 && S(
        c,
        /*label*/
        j[0]
      ), N & /*safeValue*/
      8 && S(
        a,
        /*safeValue*/
        j[3]
      ), N & /*percent*/
      64 && S(
        u,
        /*percent*/
        j[6]
      ), N & /*min*/
      2 && S(
        p,
        /*min*/
        j[1]
      ), N & /*max*/
      4 && S(
        x,
        /*max*/
        j[2]
      ), N & /*percent, fillColor, glowColor*/
      112 && q !== (q = `--level:${/*percent*/
      j[6]}%; --fill:${/*fillColor*/
      j[5]}; --glow:${/*glowColor*/
      j[4]};`) && d(e, "style", q);
    },
    i: M,
    o: M,
    d(j) {
      j && L(e);
    }
  };
}
function jt(t, e, s) {
  let n, l, c, i, r, a, g, u, { label: b = "Temperatura" } = e, { value: f = 22 } = e, { min: v = 0 } = e, { max: p = 40 } = e;
  const m = (z, _, q) => Math.min(q, Math.max(_, z)), x = (z, _, q) => Math.round(z + (_ - z) * q), C = (z, _, q) => `rgb(${z}, ${_}, ${q})`;
  return t.$$set = (z) => {
    "label" in z && s(0, b = z.label), "value" in z && s(7, f = z.value), "min" in z && s(1, v = z.min), "max" in z && s(2, p = z.max);
  }, t.$$.update = () => {
    t.$$.dirty & /*value, min, max*/
    134 && s(3, n = m(f, v, p)), t.$$.dirty & /*safeValue, min, max*/
    14 && s(9, l = (n - v) / (p - v || 1)), t.$$.dirty & /*ratio*/
    512 && s(6, c = Math.round(l * 100)), t.$$.dirty & /*cool, warm, ratio*/
    3584 && s(8, a = {
      r: x(r.r, i.r, l),
      g: x(r.g, i.g, l),
      b: x(r.b, i.b, l)
    }), t.$$.dirty & /*mix*/
    256 && s(5, g = C(a.r, a.g, a.b)), t.$$.dirty & /*mix*/
    256 && s(4, u = `rgba(${a.r}, ${a.g}, ${a.b}, 0.45)`);
  }, s(10, i = { r: 239, g: 68, b: 68 }), s(11, r = { r: 34, g: 197, b: 94 }), [
    b,
    v,
    p,
    n,
    u,
    g,
    c,
    f,
    a,
    l,
    i,
    r
  ];
}
class Oe extends D {
  constructor(e) {
    super(), I(this, e, jt, zt, A, { label: 0, value: 7, min: 1, max: 2 }, $t);
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
R(Oe, { label: {}, value: {}, min: {}, max: {} }, [], [], !0);
function Ct(t) {
  B(t, "svelte-q2ay9k", `.podium.svelte-q2ay9k.svelte-q2ay9k{position:relative;border-radius:18px;border:1px solid #e2e8f0;background:linear-gradient(180deg, #ffffff, #f8fafc);padding:24px 18px 16px;height:220px;display:grid;align-items:end}.line.svelte-q2ay9k.svelte-q2ay9k{position:absolute;left:16px;right:16px;bottom:24px;height:2px;background:linear-gradient(90deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.6))}.controls.svelte-q2ay9k.svelte-q2ay9k{position:absolute;top:14px;right:14px;display:flex;gap:8px}.reset.svelte-q2ay9k.svelte-q2ay9k,.swap.svelte-q2ay9k.svelte-q2ay9k{border:1px solid rgba(16, 185, 129, 0.3);background:#ecfdf5;color:#065f46;font-size:11px;padding:6px 10px;border-radius:999px;cursor:pointer}.reset.svelte-q2ay9k.svelte-q2ay9k:hover,.swap.svelte-q2ay9k.svelte-q2ay9k:hover{background:#d1fae5}.stack.svelte-q2ay9k.svelte-q2ay9k{position:relative;display:grid;grid-template-columns:repeat(3, 1fr);align-items:end;gap:14px;height:100%;z-index:1}.bar.svelte-q2ay9k.svelte-q2ay9k{position:relative;border-radius:14px 14px 6px 6px;background:#d1fae5;color:#065f46;display:grid;place-items:center;font-size:14px;font-weight:600;transform-origin:bottom;animation:svelte-q2ay9k-rise var(--dur) cubic-bezier(0.22, 1, 0.36, 1) forwards;transform:scaleY(0)}.bar.svelte-q2ay9k span.svelte-q2ay9k{opacity:0;animation:svelte-q2ay9k-fade-in 0.5s ease forwards;animation-delay:calc(var(--dur) * 0.7)}.bar.svelte-q2ay9k.svelte-q2ay9k::after{content:"";position:absolute;inset:8px;border-radius:10px;background:linear-gradient(120deg, rgba(255, 255, 255, 0.4), transparent 60%);opacity:0;animation:svelte-q2ay9k-sweep 1.6s ease forwards;animation-delay:calc(var(--dur) * 0.4)}.bar.first.svelte-q2ay9k.svelte-q2ay9k{background:linear-gradient(180deg, #10b981, #34d399);color:#ffffff;box-shadow:0 14px 24px rgba(16, 185, 129, 0.35)}.bar.second.svelte-q2ay9k.svelte-q2ay9k{background:linear-gradient(180deg, #34d399, #6ee7b7)}.bar.third.svelte-q2ay9k.svelte-q2ay9k{background:linear-gradient(180deg, #bbf7d0, #ecfdf5)}.podium[data-play].svelte-q2ay9k .bar.svelte-q2ay9k{animation:svelte-q2ay9k-rise var(--dur) cubic-bezier(0.22, 1, 0.36, 1) forwards,
      svelte-q2ay9k-settle 0.35s ease-out forwards;animation-delay:0s, calc(var(--dur) * 0.9)}.podium[data-play].svelte-q2ay9k .bar span.svelte-q2ay9k{animation:svelte-q2ay9k-fade-in 0.5s ease forwards;animation-delay:calc(var(--dur) * 0.7)}.podium[data-play].svelte-q2ay9k .bar.svelte-q2ay9k::after{animation:svelte-q2ay9k-sweep 1.6s ease forwards;animation-delay:calc(var(--dur) * 0.4)}@keyframes svelte-q2ay9k-rise{to{transform:scaleY(1)}}@keyframes svelte-q2ay9k-settle{0%{transform:scaleY(1.02)}100%{transform:scaleY(1)}}@keyframes svelte-q2ay9k-fade-in{to{opacity:1}}@keyframes svelte-q2ay9k-sweep{0%{opacity:0;transform:translateY(10%)}50%{opacity:0.5}100%{opacity:0;transform:translateY(-20%)}}`);
}
function qe(t, e, s) {
  const n = t.slice();
  return n[12] = e[s], n;
}
function $e(t, e) {
  let s, n, l = (
    /*item*/
    e[12].label + ""
  ), c, i, r, a;
  return {
    key: t,
    first: null,
    c() {
      s = h("div"), n = h("span"), c = w(l), i = $(), d(n, "class", "svelte-q2ay9k"), d(s, "class", r = ie(`bar ${/*item*/
      e[12].className}`) + " svelte-q2ay9k"), d(s, "style", a = `height:${/*item*/
      e[12].height}%; --dur:${/*item*/
      e[12].duration}s;`), this.first = s;
    },
    m(g, u) {
      T(g, s, u), o(s, n), o(n, c), o(s, i);
    },
    p(g, u) {
      e = g, u & /*items*/
      2 && l !== (l = /*item*/
      e[12].label + "") && S(c, l), u & /*items*/
      2 && r !== (r = ie(`bar ${/*item*/
      e[12].className}`) + " svelte-q2ay9k") && d(s, "class", r), u & /*items*/
      2 && a !== (a = `height:${/*item*/
      e[12].height}%; --dur:${/*item*/
      e[12].duration}s;`) && d(s, "style", a);
    },
    d(g) {
      g && L(s);
    }
  };
}
function ze(t) {
  let e, s = [], n = /* @__PURE__ */ new Map(), l = W(
    /*items*/
    t[1]
  );
  const c = (i) => (
    /*item*/
    i[12].key
  );
  for (let i = 0; i < l.length; i += 1) {
    let r = qe(t, l, i), a = c(r);
    n.set(a, s[i] = $e(a, r));
  }
  return {
    c() {
      e = h("div");
      for (let i = 0; i < s.length; i += 1)
        s[i].c();
      d(e, "class", "stack svelte-q2ay9k");
    },
    m(i, r) {
      T(i, e, r);
      for (let a = 0; a < s.length; a += 1)
        s[a] && s[a].m(e, null);
    },
    p(i, r) {
      r & /*items*/
      2 && (l = W(
        /*items*/
        i[1]
      ), s = ue(s, r, c, 1, i, l, n, e, de, $e, null, qe));
    },
    d(i) {
      i && L(e);
      for (let r = 0; r < s.length; r += 1)
        s[r].d();
    }
  };
}
function St(t) {
  let e, s, n, l, c, i, r, a, g = (
    /*playId*/
    t[0]
  ), u, b, f = ze(t);
  return {
    c() {
      e = h("div"), s = h("div"), n = $(), l = h("div"), c = h("button"), c.textContent = "Reiniciar", i = $(), r = h("button"), r.textContent = "Intercalar", a = $(), f.c(), d(s, "class", "line svelte-q2ay9k"), d(c, "class", "reset svelte-q2ay9k"), d(c, "type", "button"), d(r, "class", "swap svelte-q2ay9k"), d(r, "type", "button"), d(l, "class", "controls svelte-q2ay9k"), d(e, "class", "podium svelte-q2ay9k"), d(
        e,
        "data-play",
        /*playId*/
        t[0]
      );
    },
    m(v, p) {
      T(v, e, p), o(e, s), o(e, n), o(e, l), o(l, c), o(l, i), o(l, r), o(e, a), f.m(e, null), u || (b = [
        X(
          c,
          "click",
          /*reset*/
          t[2]
        ),
        X(
          r,
          "click",
          /*cycle*/
          t[3]
        )
      ], u = !0);
    },
    p(v, [p]) {
      p & /*playId*/
      1 && A(g, g = /*playId*/
      v[0]) ? (f.d(1), f = ze(v), f.c(), f.m(e, null)) : f.p(v, p), p & /*playId*/
      1 && d(
        e,
        "data-play",
        /*playId*/
        v[0]
      );
    },
    i: M,
    o: M,
    d(v) {
      v && L(e), f.d(v), u = !1, J(b);
    }
  };
}
function Mt(t, e, s) {
  let n, { first: l = 82 } = e, { second: c = 64 } = e, { third: i = 48 } = e, { baseDuration: r = 0.9 } = e, { delayStep: a = 0.15 } = e, g = 0, u = ["second", "first", "third"];
  const b = {
    first: { label: "1", className: "first" },
    second: { label: "2", className: "second" },
    third: { label: "3", className: "third" }
  }, f = (m) => m === "first" ? l : m === "second" ? c : i, v = () => {
    s(0, g += 1);
  }, p = () => {
    s(9, u = [u[1], u[2], u[0]]), s(0, g += 1);
  };
  return t.$$set = (m) => {
    "first" in m && s(4, l = m.first), "second" in m && s(5, c = m.second), "third" in m && s(6, i = m.third), "baseDuration" in m && s(7, r = m.baseDuration), "delayStep" in m && s(8, a = m.delayStep);
  }, t.$$.update = () => {
    t.$$.dirty & /*order, baseDuration, delayStep*/
    896 && s(1, n = u.map((m, x) => ({
      key: m,
      label: b[m].label,
      className: b[m].className,
      height: f(m),
      duration: r + x * a * 2
    })));
  }, [
    g,
    n,
    v,
    p,
    l,
    c,
    i,
    r,
    a,
    u
  ];
}
class Be extends D {
  constructor(e) {
    super(), I(
      this,
      e,
      Mt,
      St,
      A,
      {
        first: 4,
        second: 5,
        third: 6,
        baseDuration: 7,
        delayStep: 8
      },
      Ct
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
R(Be, { first: {}, second: {}, third: {}, baseDuration: {}, delayStep: {} }, [], [], !0);
function Et(t) {
  B(t, "svelte-1jqbzw8", ".balloon-card.svelte-1jqbzw8{border-radius:18px;border:1px solid #e2e8f0;background:linear-gradient(180deg, #ffffff, #f8fafc);padding:16px;height:220px;display:grid;place-items:center}.scene.svelte-1jqbzw8{position:relative;width:160px;height:180px}.rope.svelte-1jqbzw8{position:absolute;left:50%;bottom:14px;width:2px;height:90px;background:var(--rope);transform-origin:bottom;transform:translateX(-50%);animation:svelte-1jqbzw8-rope-sway var(--speed) ease-in-out infinite}.anchor.svelte-1jqbzw8{position:absolute;left:50%;bottom:0;width:18px;height:18px;border-radius:999px;background:#e2e8f0;border:2px solid #cbd5f5;transform:translateX(-50%)}.balloon.svelte-1jqbzw8{position:absolute;left:50%;bottom:96px;width:64px;height:74px;border-radius:50% 50% 46% 46%;background:radial-gradient(circle at 35% 30%, #ffffff, var(--balloon));box-shadow:0 16px 26px rgba(16, 185, 129, 0.2);transform-origin:bottom center;transform:translateX(-50%);animation:svelte-1jqbzw8-float var(--speed) ease-in-out infinite}.string.svelte-1jqbzw8{position:absolute;left:50%;bottom:-26px;width:2px;height:26px;background:var(--rope);transform:translateX(-50%)}@keyframes svelte-1jqbzw8-float{0%,100%{transform:translateX(-50%) translateY(0) rotate(0deg)}50%{transform:translateX(-50%) translateY(calc(var(--lift) * -1)) rotate(var(--sway))}}@keyframes svelte-1jqbzw8-rope-sway{0%,100%{transform:translateX(-50%) rotate(0deg)}50%{transform:translateX(-50%) rotate(calc(var(--sway) * -0.4))}}");
}
function Nt(t) {
  let e, s, n;
  return {
    c() {
      e = h("div"), s = h("div"), s.innerHTML = '<div class="rope svelte-1jqbzw8"></div> <div class="anchor svelte-1jqbzw8"></div> <div class="balloon svelte-1jqbzw8"><div class="string svelte-1jqbzw8"></div></div>', d(s, "class", "scene svelte-1jqbzw8"), d(e, "class", "balloon-card svelte-1jqbzw8"), d(e, "style", n = `
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
    m(l, c) {
      T(l, e, c), o(e, s);
    },
    p(l, [c]) {
      c & /*lift, sway, speed, color, rope*/
      31 && n !== (n = `
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
  `) && d(e, "style", n);
    },
    i: M,
    o: M,
    d(l) {
      l && L(e);
    }
  };
}
function Yt(t, e, s) {
  let { lift: n = 18 } = e, { sway: l = 6 } = e, { speed: c = 5.5 } = e, { color: i = "#10b981" } = e, { rope: r = "#94a3b8" } = e;
  return t.$$set = (a) => {
    "lift" in a && s(0, n = a.lift), "sway" in a && s(1, l = a.sway), "speed" in a && s(2, c = a.speed), "color" in a && s(3, i = a.color), "rope" in a && s(4, r = a.rope);
  }, [n, l, c, i, r];
}
class Ie extends D {
  constructor(e) {
    super(), I(
      this,
      e,
      Yt,
      Nt,
      A,
      {
        lift: 0,
        sway: 1,
        speed: 2,
        color: 3,
        rope: 4
      },
      Et
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
R(Ie, { lift: {}, sway: {}, speed: {}, color: {}, rope: {} }, [], [], !0);
function Lt(t) {
  B(t, "svelte-9cnfqg", '.wrapper.svelte-9cnfqg.svelte-9cnfqg{display:grid;grid-template-columns:28px 1fr 28px;align-items:stretch;gap:12px}.nav.svelte-9cnfqg.svelte-9cnfqg{border:1px solid #e2e8f0;background:#f8fafc;border-radius:14px;display:grid;place-items:center;height:100%;cursor:pointer;transition:transform 0.2s ease, background 0.2s ease;position:relative;overflow:hidden}.nav.svelte-9cnfqg.svelte-9cnfqg:hover{background:#e2e8f0;transform:translateY(-2px)}.nav.svelte-9cnfqg.svelte-9cnfqg::after{content:"";position:absolute;inset:0;background:linear-gradient(120deg, transparent, rgba(16, 185, 129, 0.25), transparent);transform:translateX(-120%);transition:transform 0.45s ease}.nav.svelte-9cnfqg.svelte-9cnfqg:hover::after{transform:translateX(120%)}.chevron.svelte-9cnfqg.svelte-9cnfqg{width:10px;height:28px;border-right:2px solid #475569;border-bottom:2px solid #475569;transform:rotate(-45deg)}.nav.left.svelte-9cnfqg .chevron.svelte-9cnfqg{transform:rotate(135deg)}.card.svelte-9cnfqg.svelte-9cnfqg{display:grid;grid-template-columns:72px 1fr;gap:16px;padding:18px 20px;border-radius:20px;border:1px solid #e2e8f0;background:#ffffff;box-shadow:0 14px 26px rgba(15, 23, 42, 0.08);transition:transform 0.35s ease, box-shadow 0.35s ease}.card.svelte-9cnfqg.svelte-9cnfqg:hover{transform:translateY(-4px);box-shadow:0 18px 34px rgba(15, 23, 42, 0.16)}.icon.svelte-9cnfqg.svelte-9cnfqg{width:56px;height:56px;border-radius:16px;background:#f8fafc;display:grid;place-items:center}.ladder.svelte-9cnfqg.svelte-9cnfqg{width:28px;height:36px;border:3px solid #7c5c4f;border-left-width:5px;border-right-width:5px;border-radius:6px;position:relative}.ladder.svelte-9cnfqg span.svelte-9cnfqg{position:absolute;left:2px;right:2px;height:4px;background:#7c5c4f;border-radius:999px;animation:svelte-9cnfqg-rung 2.8s ease-in-out infinite}.ladder.svelte-9cnfqg span.svelte-9cnfqg:nth-child(1){top:6px;animation-delay:0s}.ladder.svelte-9cnfqg span.svelte-9cnfqg:nth-child(2){top:14px;animation-delay:0.2s}.ladder.svelte-9cnfqg span.svelte-9cnfqg:nth-child(3){top:22px;animation-delay:0.4s}.ladder.svelte-9cnfqg span.svelte-9cnfqg:nth-child(4){top:30px;animation-delay:0.6s}.content.svelte-9cnfqg.svelte-9cnfqg{display:grid;gap:8px}.panel.svelte-9cnfqg.svelte-9cnfqg{animation:svelte-9cnfqg-slide-in 0.4s ease}.row.svelte-9cnfqg.svelte-9cnfqg{display:flex;align-items:center;justify-content:space-between;gap:12px}.title.svelte-9cnfqg.svelte-9cnfqg{display:flex;align-items:baseline;gap:12px}.title.svelte-9cnfqg strong.svelte-9cnfqg{font-size:18px;color:#0f172a}.title.svelte-9cnfqg span.svelte-9cnfqg{font-size:14px;color:#64748b}.level-text.svelte-9cnfqg.svelte-9cnfqg{font-size:14px;color:#64748b;animation:svelte-9cnfqg-level-pop 0.35s ease}.pill.svelte-9cnfqg.svelte-9cnfqg{padding:6px 14px;background:#eef2ff;color:#1e3a8a;border-radius:999px;font-size:12px;font-weight:600}.desc.svelte-9cnfqg.svelte-9cnfqg{margin:0;font-size:14px;color:#0f172a}.meta.svelte-9cnfqg.svelte-9cnfqg{font-size:13px;color:#475569}.xp.svelte-9cnfqg.svelte-9cnfqg{font-weight:600;color:#047857}.progress.svelte-9cnfqg.svelte-9cnfqg{position:relative;height:12px;border-radius:999px;background:#f1f5f9;overflow:hidden}.bar.svelte-9cnfqg.svelte-9cnfqg{height:100%;width:var(--fill);background:linear-gradient(90deg, #10b981, #34d399);transition:width 0.8s cubic-bezier(0.22, 1, 0.36, 1)}.glow.svelte-9cnfqg.svelte-9cnfqg{position:absolute;inset:0;background:linear-gradient(90deg, rgba(16, 185, 129, 0), rgba(16, 185, 129, 0.35), rgba(16, 185, 129, 0));transform:translateX(-100%);animation:svelte-9cnfqg-sweep 3.2s ease-in-out infinite}@keyframes svelte-9cnfqg-sweep{0%,60%{transform:translateX(-100%)}100%{transform:translateX(100%)}}@keyframes svelte-9cnfqg-level-pop{0%{opacity:0;transform:translateY(4px)}100%{opacity:1;transform:translateY(0)}}@keyframes svelte-9cnfqg-rung{0%,100%{opacity:0.6}50%{opacity:1}}@keyframes svelte-9cnfqg-slide-in{from{opacity:0;transform:translateX(calc(var(--dir) * 12px))}to{opacity:1;transform:translateX(0)}}');
}
function je(t) {
  let e, s, n, l, c, i, r, a, g, u, b, f, v, p, m, x, C, z, _, q, j, N, k, E, Y, F, ve, re, ge, pe, G, Z, le, he, ae;
  return {
    c() {
      e = h("div"), s = h("div"), n = h("div"), l = h("strong"), c = w(
        /*title*/
        t[0]
      ), i = $(), r = h("span"), a = w("Nivel "), g = w(
        /*activeLevel*/
        t[4]
      ), u = w("/"), b = w(
        /*safeLevelTotal*/
        t[5]
      ), f = $(), v = h("div"), p = w(
        /*status*/
        t[3]
      ), m = $(), x = h("p"), C = w(
        /*description*/
        t[1]
      ), z = $(), _ = h("div"), q = h("span"), j = w("Progreso: "), N = w(
        /*safeProgress*/
        t[7]
      ), k = w(" / "), E = w(
        /*safeTotal*/
        t[6]
      ), Y = $(), F = h("span"), ve = w("+"), re = w(
        /*xp*/
        t[2]
      ), ge = w(" XP"), pe = $(), G = h("div"), Z = h("div"), he = $(), ae = h("div"), d(l, "class", "svelte-9cnfqg"), d(r, "class", "level-text svelte-9cnfqg"), d(n, "class", "title svelte-9cnfqg"), d(v, "class", "pill svelte-9cnfqg"), d(s, "class", "row svelte-9cnfqg"), d(x, "class", "desc svelte-9cnfqg"), d(F, "class", "xp svelte-9cnfqg"), d(_, "class", "row meta svelte-9cnfqg"), d(Z, "class", "bar svelte-9cnfqg"), d(Z, "style", le = `--fill:${/*percent*/
      t[9]}%`), d(ae, "class", "glow svelte-9cnfqg"), d(G, "class", "progress svelte-9cnfqg"), d(e, "class", "panel svelte-9cnfqg");
    },
    m(P, V) {
      T(P, e, V), o(e, s), o(s, n), o(n, l), o(l, c), o(n, i), o(n, r), o(r, a), o(r, g), o(r, u), o(r, b), o(s, f), o(s, v), o(v, p), o(e, m), o(e, x), o(x, C), o(e, z), o(e, _), o(_, q), o(q, j), o(q, N), o(q, k), o(q, E), o(_, Y), o(_, F), o(F, ve), o(F, re), o(F, ge), o(e, pe), o(e, G), o(G, Z), o(G, he), o(G, ae);
    },
    p(P, V) {
      V & /*title*/
      1 && S(
        c,
        /*title*/
        P[0]
      ), V & /*activeLevel*/
      16 && S(
        g,
        /*activeLevel*/
        P[4]
      ), V & /*safeLevelTotal*/
      32 && S(
        b,
        /*safeLevelTotal*/
        P[5]
      ), V & /*status*/
      8 && S(
        p,
        /*status*/
        P[3]
      ), V & /*description*/
      2 && S(
        C,
        /*description*/
        P[1]
      ), V & /*safeProgress*/
      128 && S(
        N,
        /*safeProgress*/
        P[7]
      ), V & /*safeTotal*/
      64 && S(
        E,
        /*safeTotal*/
        P[6]
      ), V & /*xp*/
      4 && S(
        re,
        /*xp*/
        P[2]
      ), V & /*percent*/
      512 && le !== (le = `--fill:${/*percent*/
      P[9]}%`) && d(Z, "style", le);
    },
    d(P) {
      P && L(e);
    }
  };
}
function Tt(t) {
  let e, s, n, l, c, i, r, a = (
    /*activeLevel*/
    t[4]
  ), g, u, b, f, v, p = je(t);
  return {
    c() {
      e = h("div"), s = h("button"), s.innerHTML = '<span class="chevron svelte-9cnfqg"></span>', n = $(), l = h("div"), c = h("div"), c.innerHTML = '<div class="ladder svelte-9cnfqg"><span class="svelte-9cnfqg"></span> <span class="svelte-9cnfqg"></span> <span class="svelte-9cnfqg"></span> <span class="svelte-9cnfqg"></span></div>', i = $(), r = h("div"), p.c(), u = $(), b = h("button"), b.innerHTML = '<span class="chevron svelte-9cnfqg"></span>', d(s, "class", "nav left svelte-9cnfqg"), d(s, "type", "button"), d(s, "aria-label", "Nivel anterior"), d(c, "class", "icon svelte-9cnfqg"), d(r, "class", "content svelte-9cnfqg"), d(r, "style", g = `--dir:${/*slideDir*/
      t[8]}`), d(l, "class", "card svelte-9cnfqg"), d(b, "class", "nav right svelte-9cnfqg"), d(b, "type", "button"), d(b, "aria-label", "Nivel siguiente"), d(e, "class", "wrapper svelte-9cnfqg");
    },
    m(m, x) {
      T(m, e, x), o(e, s), o(e, n), o(e, l), o(l, c), o(l, i), o(l, r), p.m(r, null), o(e, u), o(e, b), f || (v = [
        X(
          s,
          "click",
          /*click_handler*/
          t[17]
        ),
        X(
          b,
          "click",
          /*click_handler_1*/
          t[18]
        )
      ], f = !0);
    },
    p(m, [x]) {
      x & /*activeLevel*/
      16 && A(a, a = /*activeLevel*/
      m[4]) ? (p.d(1), p = je(m), p.c(), p.m(r, null)) : p.p(m, x), x & /*slideDir*/
      256 && g !== (g = `--dir:${/*slideDir*/
      m[8]}`) && d(r, "style", g);
    },
    i: M,
    o: M,
    d(m) {
      m && L(e), p.d(m), f = !1, J(v);
    }
  };
}
function Xt(t, e, s) {
  let n, l, c, i, r, { title: a = "Nivel 5" } = e, { subtitle: g = "Nivel 1/3" } = e, { description: u = "Alcanza nivel 5 de usuario." } = e, { progress: b = 4 } = e, { total: f = 5 } = e, { xp: v = 15 } = e, { status: p = "En progreso" } = e, { levelIndex: m = 1 } = e, { levelTotal: x = 3 } = e;
  const C = (k, E, Y) => Math.min(Y, Math.max(E, k));
  let z = C(m, 1, r), _ = 1;
  const q = (k) => {
    s(8, _ = k >= 0 ? 1 : -1), s(4, z = C(z + k, 1, r));
  }, j = () => q(-1), N = () => q(1);
  return t.$$set = (k) => {
    "title" in k && s(0, a = k.title), "subtitle" in k && s(11, g = k.subtitle), "description" in k && s(1, u = k.description), "progress" in k && s(12, b = k.progress), "total" in k && s(13, f = k.total), "xp" in k && s(2, v = k.xp), "status" in k && s(3, p = k.status), "levelIndex" in k && s(14, m = k.levelIndex), "levelTotal" in k && s(15, x = k.levelTotal);
  }, t.$$.update = () => {
    t.$$.dirty & /*total*/
    8192 && s(6, n = Math.max(1, f)), t.$$.dirty & /*progress, safeTotal*/
    4160 && s(7, l = C(b, 0, n)), t.$$.dirty & /*safeProgress, safeTotal*/
    192 && s(16, c = l / n), t.$$.dirty & /*ratio*/
    65536 && s(9, i = Math.round(c * 100)), t.$$.dirty & /*levelTotal*/
    32768 && s(5, r = Math.max(1, x)), t.$$.dirty & /*levelIndex, activeLevel, safeLevelTotal*/
    16432 && m !== z && s(4, z = C(m, 1, r));
  }, [
    a,
    u,
    v,
    p,
    z,
    r,
    n,
    l,
    _,
    i,
    q,
    g,
    b,
    f,
    m,
    x,
    c,
    j,
    N
  ];
}
class Re extends D {
  constructor(e) {
    super(), I(
      this,
      e,
      Xt,
      Tt,
      A,
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
      Lt
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
R(Re, { title: {}, subtitle: {}, description: {}, progress: {}, total: {}, xp: {}, status: {}, levelIndex: {}, levelTotal: {} }, [], [], !0);
function At(t) {
  B(t, "svelte-12k2sv8", ".card.svelte-12k2sv8{position:relative;border-radius:18px;border:1px solid #e2e8f0;background:linear-gradient(160deg, #ffffff, #ecfdf5);padding:18px;overflow:hidden;transform:perspective(800px) rotateX(var(--rx)) rotateY(var(--ry));transition:transform 0.2s ease;box-shadow:0 18px 32px rgba(15, 23, 42, 0.12)}.shine.svelte-12k2sv8{position:absolute;inset:0;background:radial-gradient(circle at var(--shine) 20%, rgba(16, 185, 129, 0.22), transparent 55%);pointer-events:none}.content.svelte-12k2sv8{position:relative;display:grid;gap:6px}.title.svelte-12k2sv8{margin:0;font-size:12px;color:#64748b;letter-spacing:0.08em;text-transform:uppercase}.value.svelte-12k2sv8{margin:0;font-size:28px;font-weight:700;color:#0f172a}.hint.svelte-12k2sv8{margin:0;font-size:12px;color:#475569}");
}
function Pt(t) {
  let e, s, n, l, c, i, r, a, g, u, b, f, v, p, m;
  return {
    c() {
      e = h("div"), s = h("div"), n = $(), l = h("div"), c = h("p"), i = w(
        /*title*/
        t[0]
      ), r = $(), a = h("p"), g = w(
        /*value*/
        t[1]
      ), u = $(), b = h("p"), f = w(
        /*hint*/
        t[2]
      ), d(s, "class", "shine svelte-12k2sv8"), d(c, "class", "title svelte-12k2sv8"), d(a, "class", "value svelte-12k2sv8"), d(b, "class", "hint svelte-12k2sv8"), d(l, "class", "content svelte-12k2sv8"), d(e, "class", "card svelte-12k2sv8"), d(e, "style", v = `--rx:${/*rx*/
      t[3]}deg; --ry:${/*ry*/
      t[4]}deg; --shine:${/*shine*/
      t[5]}%`);
    },
    m(x, C) {
      T(x, e, C), o(e, s), o(e, n), o(e, l), o(l, c), o(c, i), o(l, r), o(l, a), o(a, g), o(l, u), o(l, b), o(b, f), p || (m = [
        X(
          e,
          "pointermove",
          /*handleMove*/
          t[6]
        ),
        X(
          e,
          "pointerleave",
          /*reset*/
          t[7]
        )
      ], p = !0);
    },
    p(x, [C]) {
      C & /*title*/
      1 && S(
        i,
        /*title*/
        x[0]
      ), C & /*value*/
      2 && S(
        g,
        /*value*/
        x[1]
      ), C & /*hint*/
      4 && S(
        f,
        /*hint*/
        x[2]
      ), C & /*rx, ry, shine*/
      56 && v !== (v = `--rx:${/*rx*/
      x[3]}deg; --ry:${/*ry*/
      x[4]}deg; --shine:${/*shine*/
      x[5]}%`) && d(e, "style", v);
    },
    i: M,
    o: M,
    d(x) {
      x && L(e), p = !1, J(m);
    }
  };
}
function Ot(t, e, s) {
  let { title: n = "Pulso Focus" } = e, { value: l = "78%" } = e, { hint: c = "Calma sostenida" } = e, { intensity: i = 10 } = e, r = 0, a = 0, g = 0;
  const u = (f) => {
    const v = f.currentTarget.getBoundingClientRect(), p = (f.clientX - v.left) / v.width - 0.5, m = (f.clientY - v.top) / v.height - 0.5;
    s(3, r = m * i * -1), s(4, a = p * i), s(5, g = (p + m + 1) * 25);
  }, b = () => {
    s(3, r = 0), s(4, a = 0), s(5, g = 0);
  };
  return t.$$set = (f) => {
    "title" in f && s(0, n = f.title), "value" in f && s(1, l = f.value), "hint" in f && s(2, c = f.hint), "intensity" in f && s(8, i = f.intensity);
  }, [n, l, c, r, a, g, u, b, i];
}
class De extends D {
  constructor(e) {
    super(), I(
      this,
      e,
      Ot,
      Pt,
      A,
      {
        title: 0,
        value: 1,
        hint: 2,
        intensity: 8
      },
      At
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
R(De, { title: {}, value: {}, hint: {}, intensity: {} }, [], [], !0);
function Bt(t) {
  B(t, "svelte-1czrcz8", '.counter.svelte-1czrcz8{border-radius:16px;border:1px solid #e2e8f0;padding:16px;background:#ffffff;display:grid;gap:10px;box-shadow:0 12px 22px rgba(15, 23, 42, 0.08)}.label.svelte-1czrcz8{margin:0;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.08em}.value.svelte-1czrcz8{font-size:32px;font-weight:700;color:#0f172a;position:relative;animation:svelte-1czrcz8-flip 0.5s ease}.value.svelte-1czrcz8::after{content:"";position:absolute;left:0;right:0;bottom:-4px;height:3px;border-radius:999px;background:var(--tone);animation:svelte-1czrcz8-sweep 0.6s ease}@keyframes svelte-1czrcz8-flip{0%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:translateY(0)}}@keyframes svelte-1czrcz8-sweep{from{transform:scaleX(0.2)}to{transform:scaleX(1)}}');
}
function Ce(t) {
  let e, s;
  return {
    c() {
      e = h("div"), s = w(
        /*value*/
        t[1]
      ), d(e, "class", "value svelte-1czrcz8");
    },
    m(n, l) {
      T(n, e, l), o(e, s);
    },
    p(n, l) {
      l & /*value*/
      2 && S(
        s,
        /*value*/
        n[1]
      );
    },
    d(n) {
      n && L(e);
    }
  };
}
function It(t) {
  let e, s, n, l, c = (
    /*value*/
    t[1]
  ), i, r = Ce(t);
  return {
    c() {
      e = h("div"), s = h("p"), n = w(
        /*label*/
        t[0]
      ), l = $(), r.c(), d(s, "class", "label svelte-1czrcz8"), d(e, "class", "counter svelte-1czrcz8"), d(e, "style", i = `--tone:${/*tone*/
      t[2]}`);
    },
    m(a, g) {
      T(a, e, g), o(e, s), o(s, n), o(e, l), r.m(e, null);
    },
    p(a, [g]) {
      g & /*label*/
      1 && S(
        n,
        /*label*/
        a[0]
      ), g & /*value*/
      2 && A(c, c = /*value*/
      a[1]) ? (r.d(1), r = Ce(a), r.c(), r.m(e, null)) : r.p(a, g), g & /*tone*/
      4 && i !== (i = `--tone:${/*tone*/
      a[2]}`) && d(e, "style", i);
    },
    i: M,
    o: M,
    d(a) {
      a && L(e), r.d(a);
    }
  };
}
function Rt(t, e, s) {
  let { label: n = "Sesiones" } = e, { value: l = 12 } = e, { tone: c = "#10b981" } = e;
  return t.$$set = (i) => {
    "label" in i && s(0, n = i.label), "value" in i && s(1, l = i.value), "tone" in i && s(2, c = i.tone);
  }, [n, l, c];
}
class He extends D {
  constructor(e) {
    super(), I(this, e, Rt, It, A, { label: 0, value: 1, tone: 2 }, Bt);
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
R(He, { label: {}, value: {}, tone: {} }, [], [], !0);
function Dt(t) {
  B(t, "svelte-pocpcm", ".stack.svelte-pocpcm{position:relative;height:160px;border-radius:18px;border:1px solid #e2e8f0;background:linear-gradient(140deg, #ffffff, #ecfdf5);overflow:hidden;transform:perspective(900px) rotateX(var(--rx)) rotateY(var(--ry));transition:transform 0.2s ease}.bg.svelte-pocpcm{position:absolute;inset:0;background:radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.15), transparent 60%)}.layer.svelte-pocpcm{position:absolute;border-radius:999px;filter:blur(calc(var(--blur) * 10px));opacity:0.75}.layer-a.svelte-pocpcm{width:120px;height:120px;background:rgba(16, 185, 129, 0.45);transform:translate(calc(var(--px) * 0.6), calc(var(--py) * 0.6));top:20px;left:14px}.layer-b.svelte-pocpcm{width:90px;height:90px;background:rgba(52, 211, 153, 0.5);transform:translate(calc(var(--px) * 1.2), calc(var(--py) * 1.2));bottom:18px;right:20px}.layer-c.svelte-pocpcm{width:70px;height:70px;background:rgba(14, 116, 144, 0.3);transform:translate(calc(var(--px) * 1.6), calc(var(--py) * 1.6));top:30px;right:70px}.label.svelte-pocpcm{position:absolute;left:16px;bottom:14px;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#0f172a;background:rgba(255, 255, 255, 0.7);padding:4px 8px;border-radius:999px}");
}
function Ht(t) {
  let e, s, n, l, c, i, r, a, g, u, b, f, v, p;
  return {
    c() {
      e = h("div"), s = h("div"), n = $(), l = h("div"), c = $(), i = h("div"), r = $(), a = h("div"), g = $(), u = h("div"), b = w(
        /*title*/
        t[0]
      ), d(s, "class", "bg svelte-pocpcm"), d(l, "class", "layer layer-a svelte-pocpcm"), d(i, "class", "layer layer-b svelte-pocpcm"), d(a, "class", "layer layer-c svelte-pocpcm"), d(u, "class", "label svelte-pocpcm"), d(e, "class", "stack svelte-pocpcm"), d(e, "style", f = `--rx:${/*rx*/
      t[2]}deg; --ry:${/*ry*/
      t[3]}deg; --px:${/*px*/
      t[4]}px; --py:${/*py*/
      t[5]}px; --blur:${/*blur*/
      t[1]}`);
    },
    m(m, x) {
      T(m, e, x), o(e, s), o(e, n), o(e, l), o(e, c), o(e, i), o(e, r), o(e, a), o(e, g), o(e, u), o(u, b), v || (p = [
        X(
          e,
          "pointermove",
          /*handleMove*/
          t[6]
        ),
        X(
          e,
          "pointerleave",
          /*reset*/
          t[7]
        )
      ], v = !0);
    },
    p(m, [x]) {
      x & /*title*/
      1 && S(
        b,
        /*title*/
        m[0]
      ), x & /*rx, ry, px, py, blur*/
      62 && f !== (f = `--rx:${/*rx*/
      m[2]}deg; --ry:${/*ry*/
      m[3]}deg; --px:${/*px*/
      m[4]}px; --py:${/*py*/
      m[5]}px; --blur:${/*blur*/
      m[1]}`) && d(e, "style", f);
    },
    i: M,
    o: M,
    d(m) {
      m && L(e), v = !1, J(p);
    }
  };
}
function Ft(t, e, s) {
  let { title: n = "Capas activas" } = e, { intensity: l = 18 } = e, { blur: c = 0.6 } = e, i = 0, r = 0, a = 0, g = 0;
  const u = (f) => {
    const v = f.currentTarget.getBoundingClientRect(), p = (f.clientX - v.left) / v.width - 0.5, m = (f.clientY - v.top) / v.height - 0.5;
    s(2, i = m * l * -1), s(3, r = p * l), s(4, a = p * 24), s(5, g = m * 24);
  }, b = () => {
    s(2, i = 0), s(3, r = 0), s(4, a = 0), s(5, g = 0);
  };
  return t.$$set = (f) => {
    "title" in f && s(0, n = f.title), "intensity" in f && s(8, l = f.intensity), "blur" in f && s(1, c = f.blur);
  }, [n, c, i, r, a, g, u, b, l];
}
class Fe extends D {
  constructor(e) {
    super(), I(this, e, Ft, Ht, A, { title: 0, intensity: 8, blur: 1 }, Dt);
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
  get blur() {
    return this.$$.ctx[1];
  }
  set blur(e) {
    this.$$set({ blur: e }), y();
  }
}
R(Fe, { title: {}, intensity: {}, blur: {} }, [], [], !0);
const H = (t, e) => {
  const s = e.element;
  customElements.get(t) || customElements.define(t, s ?? e);
};
H("svelte-counter", Le);
H("svelte-orbit-card", Te);
H("svelte-pulse-badge", Xe);
H("svelte-ripple-button", Ae);
H("svelte-stagger-list", Pe);
H("svelte-thermometer", Oe);
H("svelte-podium", Be);
H("svelte-balloon-gift", Ie);
H("svelte-achievement-card", Re);
H("svelte-parallax-card", De);
H("svelte-flip-counter", He);
H("svelte-parallax-stack", Fe);
