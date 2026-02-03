var nl = Object.defineProperty;
var rl = (s, e, t) => e in s ? nl(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var he = (s, e, t) => rl(s, typeof e != "symbol" ? e + "" : e, t);
function D() {
}
const $s = (s) => s;
function As(s) {
  return s();
}
function Zt() {
  return /* @__PURE__ */ Object.create(null);
}
function fe(s) {
  s.forEach(As);
}
function jt(s) {
  return typeof s == "function";
}
function K(s, e) {
  return s != s ? e == e : s !== e || s && typeof s == "object" || typeof s == "function";
}
let rt;
function es(s, e) {
  return s === e ? !0 : (rt || (rt = document.createElement("a")), rt.href = e, s === rt.href);
}
function al(s) {
  return Object.keys(s).length === 0;
}
function ft(s) {
  return s ?? "";
}
function ts(s) {
  const e = typeof s == "string" && s.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);
  return e ? [parseFloat(e[1]), e[2] || "px"] : [
    /** @type {number} */
    s,
    "px"
  ];
}
const Ns = typeof window < "u";
let ol = Ns ? () => window.performance.now() : () => Date.now(), Lt = Ns ? (s) => requestAnimationFrame(s) : D;
const Xe = /* @__PURE__ */ new Set();
function Ds(s) {
  Xe.forEach((e) => {
    e.c(s) || (Xe.delete(e), e.f());
  }), Xe.size !== 0 && Lt(Ds);
}
function cl(s) {
  let e;
  return Xe.size === 0 && Lt(Ds), {
    promise: new Promise((t) => {
      Xe.add(e = { c: s, f: t });
    }),
    abort() {
      Xe.delete(e);
    }
  };
}
function n(s, e) {
  s.appendChild(e);
}
function ie(s, e, t) {
  const l = Tt(s);
  if (!l.getElementById(e)) {
    const i = d("style");
    i.id = e, i.textContent = t, Ys(l, i);
  }
}
function Tt(s) {
  if (!s) return document;
  const e = s.getRootNode ? s.getRootNode() : s.ownerDocument;
  return e && /** @type {ShadowRoot} */
  e.host ? (
    /** @type {ShadowRoot} */
    e
  ) : s.ownerDocument;
}
function fl(s) {
  const e = d("style");
  return e.textContent = "/* empty */", Ys(Tt(s), e), e.sheet;
}
function Ys(s, e) {
  return n(
    /** @type {Document} */
    s.head || s,
    e
  ), e.sheet;
}
function $(s, e, t) {
  s.insertBefore(e, t || null);
}
function E(s) {
  s.parentNode && s.parentNode.removeChild(s);
}
function Qe(s, e) {
  for (let t = 0; t < s.length; t += 1)
    s[t] && s[t].d(e);
}
function d(s) {
  return document.createElement(s);
}
function ss(s) {
  return document.createElementNS("http://www.w3.org/2000/svg", s);
}
function k(s) {
  return document.createTextNode(s);
}
function x() {
  return k(" ");
}
function vt() {
  return k("");
}
function O(s, e, t, l) {
  return s.addEventListener(e, t, l), () => s.removeEventListener(e, t, l);
}
function qt(s) {
  return function(e) {
    return e.preventDefault(), s.call(this, e);
  };
}
function c(s, e, t) {
  t == null ? s.removeAttribute(e) : s.getAttribute(e) !== t && s.setAttribute(e, t);
}
function dl(s) {
  return Array.from(s.childNodes);
}
function L(s, e) {
  e = "" + e, s.data !== e && (s.data = /** @type {string} */
  e);
}
function at(s, e) {
  s.value = e ?? "";
}
function dt(s, e, t) {
  s.classList.toggle(e, !!t);
}
function Is(s, e, { bubbles: t = !1, cancelable: l = !1 } = {}) {
  return new CustomEvent(s, { detail: e, bubbles: t, cancelable: l });
}
function ul(s) {
  const e = {};
  return s.childNodes.forEach(
    /** @param {Element} node */
    (t) => {
      e[t.slot || "default"] = !0;
    }
  ), e;
}
const ut = /* @__PURE__ */ new Map();
let pt = 0;
function pl(s) {
  let e = 5381, t = s.length;
  for (; t--; ) e = (e << 5) - e ^ s.charCodeAt(t);
  return e >>> 0;
}
function vl(s, e) {
  const t = { stylesheet: fl(e), rules: {} };
  return ut.set(s, t), t;
}
function ls(s, e, t, l, i, o, r, a = 0) {
  const f = 16.666 / l;
  let b = `{
`;
  for (let y = 0; y <= 1; y += f) {
    const C = e + (t - e) * o(y);
    b += y * 100 + `%{${r(C, 1 - C)}}
`;
  }
  const u = b + `100% {${r(t, 1 - t)}}
}`, v = `__svelte_${pl(u)}_${a}`, p = Tt(s), { stylesheet: g, rules: h } = ut.get(p) || vl(p, s);
  h[v] || (h[v] = !0, g.insertRule(`@keyframes ${v} ${u}`, g.cssRules.length));
  const m = s.style.animation || "";
  return s.style.animation = `${m ? `${m}, ` : ""}${v} ${l}ms linear ${i}ms 1 both`, pt += 1, v;
}
function gl(s, e) {
  const t = (s.style.animation || "").split(", "), l = t.filter(
    e ? (o) => o.indexOf(e) < 0 : (o) => o.indexOf("__svelte") === -1
    // remove all Svelte animations
  ), i = t.length - l.length;
  i && (s.style.animation = l.join(", "), pt -= i, pt || hl());
}
function hl() {
  Lt(() => {
    pt || (ut.forEach((s) => {
      const { ownerNode: e } = s.stylesheet;
      e && E(e);
    }), ut.clear());
  });
}
let Je;
function Ue(s) {
  Je = s;
}
function Xs() {
  if (!Je) throw new Error("Function called outside component initialization");
  return Je;
}
function bl(s) {
  Xs().$$.on_mount.push(s);
}
function qe() {
  const s = Xs();
  return (e, t, { cancelable: l = !1 } = {}) => {
    const i = s.$$.callbacks[e];
    if (i) {
      const o = Is(
        /** @type {string} */
        e,
        t,
        { cancelable: l }
      );
      return i.slice().forEach((r) => {
        r.call(s, o);
      }), !o.defaultPrevented;
    }
    return !0;
  };
}
const Ie = [], is = [];
let Oe = [];
const ns = [], ml = /* @__PURE__ */ Promise.resolve();
let Ct = !1;
function yl() {
  Ct || (Ct = !0, ml.then(z));
}
function ze(s) {
  Oe.push(s);
}
const kt = /* @__PURE__ */ new Set();
let Ye = 0;
function z() {
  if (Ye !== 0)
    return;
  const s = Je;
  do {
    try {
      for (; Ye < Ie.length; ) {
        const e = Ie[Ye];
        Ye++, Ue(e), xl(e.$$);
      }
    } catch (e) {
      throw Ie.length = 0, Ye = 0, e;
    }
    for (Ue(null), Ie.length = 0, Ye = 0; is.length; ) is.pop()();
    for (let e = 0; e < Oe.length; e += 1) {
      const t = Oe[e];
      kt.has(t) || (kt.add(t), t());
    }
    Oe.length = 0;
  } while (Ie.length);
  for (; ns.length; )
    ns.pop()();
  Ct = !1, kt.clear(), Ue(s);
}
function xl(s) {
  if (s.fragment !== null) {
    s.update(), fe(s.before_update);
    const e = s.dirty;
    s.dirty = [-1], s.fragment && s.fragment.p(s.ctx, e), s.after_update.forEach(ze);
  }
}
function _l(s) {
  const e = [], t = [];
  Oe.forEach((l) => s.indexOf(l) === -1 ? e.push(l) : t.push(l)), t.forEach((l) => l()), Oe = e;
}
let Ve;
function wl() {
  return Ve || (Ve = Promise.resolve(), Ve.then(() => {
    Ve = null;
  })), Ve;
}
function zt(s, e, t) {
  s.dispatchEvent(Is(`${e ? "intro" : "outro"}${t}`));
}
const ot = /* @__PURE__ */ new Set();
let _e;
function Os() {
  _e = {
    r: 0,
    c: [],
    p: _e
    // parent group
  };
}
function Rs() {
  _e.r || fe(_e.c), _e = _e.p;
}
function Re(s, e) {
  s && s.i && (ot.delete(s), s.i(e));
}
function St(s, e, t, l) {
  if (s && s.o) {
    if (ot.has(s)) return;
    ot.add(s), _e.c.push(() => {
      ot.delete(s), l && (t && s.d(1), l());
    }), s.o(e);
  } else l && l();
}
const kl = { duration: 0 };
function ke(s, e, t, l) {
  let o = e(s, t, { direction: "both" }), r = l ? 0 : 1, a = null, f = null, b = null, u;
  function v() {
    b && gl(s, b);
  }
  function p(h, m) {
    const y = (
      /** @type {Program['d']} */
      h.b - r
    );
    return m *= Math.abs(y), {
      a: r,
      b: h.b,
      d: y,
      duration: m,
      start: h.start,
      end: h.start + m,
      group: h.group
    };
  }
  function g(h) {
    const {
      delay: m = 0,
      duration: y = 300,
      easing: C = $s,
      tick: S = D,
      css: w
    } = o || kl, q = {
      start: ol() + m,
      b: h
    };
    h || (q.group = _e, _e.r += 1), "inert" in s && (h ? u !== void 0 && (s.inert = u) : (u = /** @type {HTMLElement} */
    s.inert, s.inert = !0)), a || f ? f = q : (w && (v(), b = ls(s, r, h, y, m, C, w)), h && S(0, 1), a = p(q, y), ze(() => zt(s, h, "start")), cl((T) => {
      if (f && T > f.start && (a = p(f, y), f = null, zt(s, a.b, "start"), w && (v(), b = ls(
        s,
        r,
        a.b,
        a.duration,
        0,
        C,
        o.css
      ))), a) {
        if (T >= a.end)
          S(r = a.b, 1 - r), zt(s, a.b, "end"), f || (a.b ? v() : --a.group.r || fe(a.group.c)), a = null;
        else if (T >= a.start) {
          const _ = T - a.start;
          r = a.a + a.d * C(_ / a.duration), S(r, 1 - r);
        }
      }
      return !!(a || f);
    }));
  }
  return {
    run(h) {
      jt(o) ? wl().then(() => {
        o = o({ direction: h ? "in" : "out" }), g(h);
      }) : g(h);
    },
    end() {
      v(), a = f = null;
    }
  };
}
function le(s) {
  return (s == null ? void 0 : s.length) !== void 0 ? s : Array.from(s);
}
function Et(s, e) {
  s.d(1), e.delete(s.key);
}
function Mt(s, e, t, l, i, o, r, a, f, b, u, v) {
  let p = s.length, g = o.length, h = p;
  const m = {};
  for (; h--; ) m[s[h].key] = h;
  const y = [], C = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), w = [];
  for (h = g; h--; ) {
    const j = v(i, o, h), N = t(j);
    let Y = r.get(N);
    Y ? w.push(() => Y.p(j, e)) : (Y = b(N, j), Y.c()), C.set(N, y[h] = Y), N in m && S.set(N, Math.abs(h - m[N]));
  }
  const q = /* @__PURE__ */ new Set(), T = /* @__PURE__ */ new Set();
  function _(j) {
    Re(j, 1), j.m(a, u), r.set(j.key, j), u = j.first, g--;
  }
  for (; p && g; ) {
    const j = y[g - 1], N = s[p - 1], Y = j.key, R = N.key;
    j === N ? (u = j.first, p--, g--) : C.has(R) ? !r.has(Y) || q.has(Y) ? _(j) : T.has(R) ? p-- : S.get(Y) > S.get(R) ? (T.add(Y), _(j)) : (q.add(R), p--) : (f(N, r), p--);
  }
  for (; p--; ) {
    const j = s[p];
    C.has(j.key) || f(j, r);
  }
  for (; g; ) _(y[g - 1]);
  return fe(w), y;
}
function zl(s, e, t) {
  const { fragment: l, after_update: i } = s.$$;
  l && l.m(e, t), ze(() => {
    const o = s.$$.on_mount.map(As).filter(jt);
    s.$$.on_destroy ? s.$$.on_destroy.push(...o) : fe(o), s.$$.on_mount = [];
  }), i.forEach(ze);
}
function ql(s, e) {
  const t = s.$$;
  t.fragment !== null && (_l(t.after_update), fe(t.on_destroy), t.fragment && t.fragment.d(e), t.on_destroy = t.fragment = null, t.ctx = []);
}
function Cl(s, e) {
  s.$$.dirty[0] === -1 && (Ie.push(s), yl(), s.$$.dirty.fill(0)), s.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function ne(s, e, t, l, i, o, r = null, a = [-1]) {
  const f = Je;
  Ue(s);
  const b = s.$$ = {
    fragment: null,
    ctx: [],
    // state
    props: o,
    update: D,
    not_equal: i,
    bound: Zt(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(e.context || (f ? f.$$.context : [])),
    // everything else
    callbacks: Zt(),
    dirty: a,
    skip_bound: !1,
    root: e.target || f.$$.root
  };
  r && r(b.root);
  let u = !1;
  if (b.ctx = t ? t(s, e.props || {}, (v, p, ...g) => {
    const h = g.length ? g[0] : p;
    return b.ctx && i(b.ctx[v], b.ctx[v] = h) && (!b.skip_bound && b.bound[v] && b.bound[v](h), u && Cl(s, v)), p;
  }) : [], b.update(), u = !0, fe(b.before_update), b.fragment = l ? l(b.ctx) : !1, e.target) {
    if (e.hydrate) {
      const v = dl(e.target);
      b.fragment && b.fragment.l(v), v.forEach(E);
    } else
      b.fragment && b.fragment.c();
    e.intro && Re(s.$$.fragment), zl(s, e.target, e.anchor), z();
  }
  Ue(f);
}
let Ps;
typeof HTMLElement == "function" && (Ps = class extends HTMLElement {
  constructor(e, t, l) {
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
    this.$$ctor = e, this.$$s = t, l && this.attachShadow({ mode: "open" });
  }
  addEventListener(e, t, l) {
    if (this.$$l[e] = this.$$l[e] || [], this.$$l[e].push(t), this.$$c) {
      const i = this.$$c.$on(e, t);
      this.$$l_u.set(t, i);
    }
    super.addEventListener(e, t, l);
  }
  removeEventListener(e, t, l) {
    if (super.removeEventListener(e, t, l), this.$$c) {
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
          let a;
          return {
            c: function() {
              a = d("slot"), r !== "default" && c(a, "name", r);
            },
            /**
             * @param {HTMLElement} target
             * @param {HTMLElement} [anchor]
             */
            m: function(u, v) {
              $(u, a, v);
            },
            d: function(u) {
              u && E(a);
            }
          };
        };
      };
      var e = t;
      if (await Promise.resolve(), !this.$$cn || this.$$c)
        return;
      const l = {}, i = ul(this);
      for (const r of this.$$s)
        r in i && (l[r] = [t(r)]);
      for (const r of this.attributes) {
        const a = this.$$g_p(r.name);
        a in this.$$d || (this.$$d[a] = ct(a, r.value, this.$$p_d, "toProp"));
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
      const o = () => {
        this.$$r = !0;
        for (const r in this.$$p_d)
          if (this.$$d[r] = this.$$c.$$.ctx[this.$$c.$$.props[r]], this.$$p_d[r].reflect) {
            const a = ct(
              r,
              this.$$d[r],
              this.$$p_d,
              "toAttribute"
            );
            a == null ? this.removeAttribute(this.$$p_d[r].attribute || r) : this.setAttribute(this.$$p_d[r].attribute || r, a);
          }
        this.$$r = !1;
      };
      this.$$c.$$.after_update.push(o), o();
      for (const r in this.$$l)
        for (const a of this.$$l[r]) {
          const f = this.$$c.$on(r, a);
          this.$$l_u.set(a, f);
        }
      this.$$l = {};
    }
  }
  // We don't need this when working within Svelte code, but for compatibility of people using this outside of Svelte
  // and setting attributes through setAttribute etc, this is helpful
  attributeChangedCallback(e, t, l) {
    var i;
    this.$$r || (e = this.$$g_p(e), this.$$d[e] = ct(e, l, this.$$p_d, "toProp"), (i = this.$$c) == null || i.$set({ [e]: this.$$d[e] }));
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
function ct(s, e, t, l) {
  var o;
  const i = (o = t[s]) == null ? void 0 : o.type;
  if (e = i === "Boolean" && typeof e != "boolean" ? e != null : e, !l || !t[s])
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
function re(s, e, t, l, i, o) {
  let r = class extends Ps {
    constructor() {
      super(s, t, i), this.$$p_d = e;
    }
    static get observedAttributes() {
      return Object.keys(e).map(
        (a) => (e[a].attribute || a).toLowerCase()
      );
    }
  };
  return Object.keys(e).forEach((a) => {
    Object.defineProperty(r.prototype, a, {
      get() {
        return this.$$c && a in this.$$c ? this.$$c[a] : this.$$d[a];
      },
      set(f) {
        var b;
        f = ct(a, f, e), this.$$d[a] = f, (b = this.$$c) == null || b.$set({ [a]: f });
      }
    });
  }), l.forEach((a) => {
    Object.defineProperty(r.prototype, a, {
      get() {
        var f;
        return (f = this.$$c) == null ? void 0 : f[a];
      }
    });
  }), s.element = /** @type {any} */
  r, r;
}
class ae {
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
    ql(this, 1), this.$destroy = D;
  }
  /**
   * @template {Extract<keyof Events, string>} K
   * @param {K} type
   * @param {((e: Events[K]) => void) | null | undefined} callback
   * @returns {() => void}
   */
  $on(e, t) {
    if (!jt(t))
      return D;
    const l = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
    return l.push(t), () => {
      const i = l.indexOf(t);
      i !== -1 && l.splice(i, 1);
    };
  }
  /**
   * @param {Partial<Props>} props
   * @returns {void}
   */
  $set(e) {
    this.$$set && !al(e) && (this.$$.skip_bound = !0, this.$$set(e), this.$$.skip_bound = !1);
  }
}
const Sl = "4";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(Sl);
function jl(s) {
  ie(s, "svelte-1tevv97", '.card.svelte-1tevv97{border-radius:14px;border:1px solid #e2e8f0;padding:16px;display:grid;gap:12px;font-family:"Figtree", system-ui, sans-serif;background:#ffffff;box-shadow:0 12px 24px rgba(15, 23, 42, 0.08)}.label.svelte-1tevv97{font-size:14px;color:#0f172a;margin:0}.count.svelte-1tevv97{font-weight:600;font-size:20px;color:#0f172a;margin:0}button.svelte-1tevv97{border:0;border-radius:10px;padding:10px 12px;background:#10b981;color:white;cursor:pointer;font-weight:600}button.svelte-1tevv97:hover{background:#059669}');
}
function Ll(s) {
  let e, t, l, i, o, r, a, f, b, u, v, p;
  return {
    c() {
      e = d("div"), t = d("p"), l = k("Hola "), i = k(
        /*name*/
        s[0]
      ), o = x(), r = d("p"), a = k("Count: "), f = k(
        /*count*/
        s[1]
      ), b = x(), u = d("button"), u.textContent = "Emitir evento", c(t, "class", "label svelte-1tevv97"), c(r, "class", "count svelte-1tevv97"), c(u, "type", "button"), c(u, "class", "svelte-1tevv97"), c(e, "class", "card svelte-1tevv97");
    },
    m(g, h) {
      $(g, e, h), n(e, t), n(t, l), n(t, i), n(e, o), n(e, r), n(r, a), n(r, f), n(e, b), n(e, u), v || (p = O(
        u,
        "click",
        /*notify*/
        s[2]
      ), v = !0);
    },
    p(g, [h]) {
      h & /*name*/
      1 && L(
        i,
        /*name*/
        g[0]
      ), h & /*count*/
      2 && L(
        f,
        /*count*/
        g[1]
      );
    },
    i: D,
    o: D,
    d(g) {
      g && E(e), v = !1, p();
    }
  };
}
function Tl(s, e, t) {
  let { name: l = "Ada" } = e, { count: i = 2 } = e;
  const o = qe(), r = () => {
    o("ping", { from: "svelte", count: i });
  };
  return s.$$set = (a) => {
    "name" in a && t(0, l = a.name), "count" in a && t(1, i = a.count);
  }, [l, i, r];
}
class Fs extends ae {
  constructor(e) {
    super(), ne(this, e, Tl, Ll, K, { name: 0, count: 1 }, jl);
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
re(Fs, { name: {}, count: {} }, [], [], !0);
function El(s) {
  ie(s, "svelte-5733sx", ".card.svelte-5733sx{position:relative;overflow:hidden;border-radius:20px;border:1px solid #d1fae5;background:linear-gradient(145deg, #ffffff, #ecfdf5);padding:20px;min-height:140px;box-shadow:0 16px 36px rgba(15, 23, 42, 0.12)}.glow.svelte-5733sx{position:absolute;inset:-40%;background:radial-gradient(circle at 30% 20%, rgba(16, 185, 129, 0.3), transparent 55%);opacity:0.7;filter:blur(8px)}.content.svelte-5733sx{position:relative;display:grid;gap:8px;color:#0f172a}.title.svelte-5733sx{font-size:16px;font-weight:600;margin:0}.subtitle.svelte-5733sx{font-size:12px;margin:0;color:#64748b}.metrics.svelte-5733sx{margin-top:12px;display:flex;justify-content:space-between;font-size:12px;color:#0f172a}.orbit.svelte-5733sx{position:absolute;inset:-30%;border-radius:999px;border:1px dashed rgba(16, 185, 129, 0.3);animation:svelte-5733sx-orbit 6s linear infinite;opacity:var(--orbit-alpha)}.satellite-orbit.svelte-5733sx{position:absolute;inset:-30%;border-radius:999px;animation:svelte-5733sx-orbit 6s linear infinite}.satellite.svelte-5733sx{position:absolute;width:10px;height:10px;border-radius:999px;background:#34d399;box-shadow:0 0 12px rgba(16, 185, 129, 0.6);top:50%;left:50%;transform:translate(-50%, -50%) translateY(-78px)}@keyframes svelte-5733sx-orbit{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}");
}
function Ml(s) {
  let e, t, l, i, o, r, a, f, b, u, v, p, g, h, m, y, C, S, w, q, T, _, j;
  return {
    c() {
      e = d("div"), t = d("div"), l = x(), i = d("div"), o = d("p"), r = k(
        /*title*/
        s[0]
      ), a = x(), f = d("p"), b = k(
        /*subtitle*/
        s[1]
      ), u = x(), v = d("div"), p = d("span"), p.textContent = "Flow", g = x(), h = d("span"), m = k(
        /*flow*/
        s[3]
      ), y = k("%"), C = x(), S = d("div"), S.innerHTML = '<div class="satellite svelte-5733sx"></div>', w = x(), q = d("div"), c(t, "class", "glow svelte-5733sx"), c(o, "class", "title svelte-5733sx"), c(f, "class", "subtitle svelte-5733sx"), c(v, "class", "metrics svelte-5733sx"), c(i, "class", "content svelte-5733sx"), c(S, "class", "satellite-orbit svelte-5733sx"), c(q, "class", "orbit svelte-5733sx"), c(e, "class", "card svelte-5733sx"), c(e, "style", T = `--orbit-alpha:${/*intensity*/
      s[2]}`), c(e, "role", "button"), c(e, "tabindex", "0");
    },
    m(N, Y) {
      $(N, e, Y), n(e, t), n(e, l), n(e, i), n(i, o), n(o, r), n(i, a), n(i, f), n(f, b), n(i, u), n(i, v), n(v, p), n(v, g), n(v, h), n(h, m), n(h, y), n(e, C), n(e, S), n(e, w), n(e, q), _ || (j = [
        O(
          e,
          "mouseenter",
          /*handleHover*/
          s[4]
        ),
        O(
          e,
          "focus",
          /*handleHover*/
          s[4]
        ),
        O(
          e,
          "keydown",
          /*keydown_handler*/
          s[5]
        )
      ], _ = !0);
    },
    p(N, [Y]) {
      Y & /*title*/
      1 && L(
        r,
        /*title*/
        N[0]
      ), Y & /*subtitle*/
      2 && L(
        b,
        /*subtitle*/
        N[1]
      ), Y & /*flow*/
      8 && L(
        m,
        /*flow*/
        N[3]
      ), Y & /*intensity*/
      4 && T !== (T = `--orbit-alpha:${/*intensity*/
      N[2]}`) && c(e, "style", T);
    },
    i: D,
    o: D,
    d(N) {
      N && E(e), _ = !1, fe(j);
    }
  };
}
function $l(s, e, t) {
  let { title: l = "Focus Ring" } = e, { subtitle: i = "Anillo orbital" } = e, { intensity: o = 0.6 } = e, { flow: r = 78 } = e;
  const a = qe(), f = () => {
    a("hover", { title: l });
  }, b = (u) => {
    (u.key === "Enter" || u.key === " ") && f();
  };
  return s.$$set = (u) => {
    "title" in u && t(0, l = u.title), "subtitle" in u && t(1, i = u.subtitle), "intensity" in u && t(2, o = u.intensity), "flow" in u && t(3, r = u.flow);
  }, [l, i, o, r, f, b];
}
class Bs extends ae {
  constructor(e) {
    super(), ne(
      this,
      e,
      $l,
      Ml,
      K,
      {
        title: 0,
        subtitle: 1,
        intensity: 2,
        flow: 3
      },
      El
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
re(Bs, { title: {}, subtitle: {}, intensity: {}, flow: {} }, [], [], !0);
function Al(s) {
  ie(s, "svelte-1vzxgvk", ".badge.svelte-1vzxgvk.svelte-1vzxgvk{display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border-radius:999px;border:1px solid transparent;font-size:12px;font-weight:600;letter-spacing:0.02em;cursor:pointer;background:#ecfdf5;color:#065f46}.badge.emerald.svelte-1vzxgvk.svelte-1vzxgvk{border-color:rgba(16, 185, 129, 0.35)}.dot.svelte-1vzxgvk.svelte-1vzxgvk{width:8px;height:8px;border-radius:999px;background:currentColor;box-shadow:0 0 0 rgba(16, 185, 129, 0.6)}.active.svelte-1vzxgvk .dot.svelte-1vzxgvk{animation:svelte-1vzxgvk-pulse 1.8s ease-in-out infinite}@keyframes svelte-1vzxgvk-pulse{0%{box-shadow:0 0 0 0 rgba(16, 185, 129, 0.6)}70%{box-shadow:0 0 0 12px rgba(16, 185, 129, 0)}100%{box-shadow:0 0 0 0 rgba(16, 185, 129, 0)}}");
}
function Nl(s) {
  let e, t, l, i, o, r, a;
  return {
    c() {
      e = d("button"), t = d("span"), l = x(), i = k(
        /*label*/
        s[1]
      ), c(t, "class", "dot svelte-1vzxgvk"), c(e, "class", o = ft(`badge ${/*tone*/
      s[2]} ${/*active*/
      s[0] ? "active" : ""}`) + " svelte-1vzxgvk"), c(e, "type", "button");
    },
    m(f, b) {
      $(f, e, b), n(e, t), n(e, l), n(e, i), r || (a = O(
        e,
        "click",
        /*toggle*/
        s[3]
      ), r = !0);
    },
    p(f, [b]) {
      b & /*label*/
      2 && L(
        i,
        /*label*/
        f[1]
      ), b & /*tone, active*/
      5 && o !== (o = ft(`badge ${/*tone*/
      f[2]} ${/*active*/
      f[0] ? "active" : ""}`) + " svelte-1vzxgvk") && c(e, "class", o);
    },
    i: D,
    o: D,
    d(f) {
      f && E(e), r = !1, a();
    }
  };
}
function Dl(s, e, t) {
  let { label: l = "Live" } = e, { tone: i = "emerald" } = e, { active: o = !0 } = e;
  const r = qe(), a = () => {
    t(0, o = !o), r("toggle", { active: o });
  };
  return s.$$set = (f) => {
    "label" in f && t(1, l = f.label), "tone" in f && t(2, i = f.tone), "active" in f && t(0, o = f.active);
  }, [o, l, i, a];
}
class Hs extends ae {
  constructor(e) {
    super(), ne(this, e, Dl, Nl, K, { label: 1, tone: 2, active: 0 }, Al);
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
re(Hs, { label: {}, tone: {}, active: { type: "Boolean" } }, [], [], !0);
function Yl(s) {
  ie(s, "svelte-1io8dtn", ".ripple.svelte-1io8dtn{position:relative;overflow:hidden;padding:12px 20px;border-radius:14px;border:none;background:var(--tone);color:#ffffff;font-weight:600;cursor:pointer;box-shadow:0 16px 28px rgba(16, 185, 129, 0.25)}.label.svelte-1io8dtn{position:relative;z-index:1}.wave.svelte-1io8dtn{position:absolute;width:20px;height:20px;border-radius:999px;background:rgba(255, 255, 255, 0.45);transform:translate(-50%, -50%);animation:svelte-1io8dtn-ripple 0.8s ease-out forwards}@keyframes svelte-1io8dtn-ripple{from{opacity:0.7;transform:translate(-50%, -50%) scale(0)}to{opacity:0;transform:translate(-50%, -50%) scale(8)}}");
}
function rs(s, e, t) {
  const l = s.slice();
  return l[7] = e[t], l;
}
function as(s, e) {
  let t, l, i, o;
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
    key: s,
    first: null,
    c() {
      t = d("span"), c(t, "class", "wave svelte-1io8dtn"), c(t, "style", l = `left:${/*ripple*/
      e[7].x}px; top:${/*ripple*/
      e[7].y}px;`), this.first = t;
    },
    m(a, f) {
      $(a, t, f), i || (o = O(t, "animationend", r), i = !0);
    },
    p(a, f) {
      e = a, f & /*ripples*/
      4 && l !== (l = `left:${/*ripple*/
      e[7].x}px; top:${/*ripple*/
      e[7].y}px;`) && c(t, "style", l);
    },
    d(a) {
      a && E(t), i = !1, o();
    }
  };
}
function Il(s) {
  let e, t = [], l = /* @__PURE__ */ new Map(), i, o, r, a, f, b, u = le(
    /*ripples*/
    s[2]
  );
  const v = (p) => (
    /*ripple*/
    p[7].id
  );
  for (let p = 0; p < u.length; p += 1) {
    let g = rs(s, u, p), h = v(g);
    l.set(h, t[p] = as(h, g));
  }
  return {
    c() {
      e = d("button");
      for (let p = 0; p < t.length; p += 1)
        t[p].c();
      i = x(), o = d("span"), r = k(
        /*label*/
        s[0]
      ), c(o, "class", "label svelte-1io8dtn"), c(e, "class", "ripple svelte-1io8dtn"), c(e, "type", "button"), c(e, "style", a = `--tone:${/*tone*/
      s[1]}`);
    },
    m(p, g) {
      $(p, e, g);
      for (let h = 0; h < t.length; h += 1)
        t[h] && t[h].m(e, null);
      n(e, i), n(e, o), n(o, r), f || (b = O(
        e,
        "click",
        /*handleClick*/
        s[3]
      ), f = !0);
    },
    p(p, [g]) {
      g & /*ripples, removeRipple*/
      20 && (u = le(
        /*ripples*/
        p[2]
      ), t = Mt(t, g, v, 1, p, u, l, e, Et, as, i, rs)), g & /*label*/
      1 && L(
        r,
        /*label*/
        p[0]
      ), g & /*tone*/
      2 && a !== (a = `--tone:${/*tone*/
      p[1]}`) && c(e, "style", a);
    },
    i: D,
    o: D,
    d(p) {
      p && E(e);
      for (let g = 0; g < t.length; g += 1)
        t[g].d();
      f = !1, b();
    }
  };
}
function Xl(s, e, t) {
  let { label: l = "Lanzar onda" } = e, { tone: i = "#10b981" } = e;
  const o = qe();
  let r = [];
  const a = (u) => {
    const v = u.currentTarget.getBoundingClientRect(), p = u.clientX - v.left, g = u.clientY - v.top, h = Math.random().toString(36).slice(2);
    t(2, r = [...r, { id: h, x: p, y: g }]), o("ripple", { x: p, y: g });
  }, f = (u) => {
    t(2, r = r.filter((v) => v.id !== u));
  }, b = (u) => f(u.id);
  return s.$$set = (u) => {
    "label" in u && t(0, l = u.label), "tone" in u && t(1, i = u.tone);
  }, [l, i, r, a, f, b];
}
class Vs extends ae {
  constructor(e) {
    super(), ne(this, e, Xl, Il, K, { label: 0, tone: 1 }, Yl);
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
re(Vs, { label: {}, tone: {} }, [], [], !0);
function Ol(s) {
  ie(s, "svelte-1jr61rp", ".list.svelte-1jr61rp{border-radius:18px;border:1px solid #e2e8f0;background:#ffffff;padding:16px;display:grid;gap:16px}.header.svelte-1jr61rp{display:flex;justify-content:space-between;align-items:center}.title.svelte-1jr61rp{margin:0;font-size:14px;font-weight:600;color:#0f172a}.subtitle.svelte-1jr61rp{margin:0;font-size:11px;color:#94a3b8}button.svelte-1jr61rp{border:1px solid #d1fae5;background:#ecfdf5;color:#065f46;font-size:12px;padding:6px 10px;border-radius:10px;cursor:pointer}.items.svelte-1jr61rp{display:grid;gap:10px}.item.svelte-1jr61rp{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-radius:12px;background:#f8fafc;color:#0f172a;font-size:13px;animation:svelte-1jr61rp-slide-in 0.5s ease forwards;opacity:0;transform:translateY(6px)}.score.svelte-1jr61rp{font-weight:600}@keyframes svelte-1jr61rp-slide-in{to{opacity:1;transform:translateY(0)}}");
}
function os(s, e, t) {
  const l = s.slice();
  return l[7] = e[t], l[9] = t, l;
}
function cs(s, e) {
  let t, l, i = (
    /*item*/
    e[7].title + ""
  ), o, r, a, f = (
    /*item*/
    e[7].score + ""
  ), b, u, v, p;
  return {
    key: s,
    first: null,
    c() {
      t = d("div"), l = d("span"), o = k(i), r = x(), a = d("span"), b = k(f), u = k("%"), v = x(), c(a, "class", "score svelte-1jr61rp"), c(t, "class", "item svelte-1jr61rp"), c(t, "style", p = `animation-delay:${/*index*/
      e[9] * /*cadence*/
      e[1]}ms`), this.first = t;
    },
    m(g, h) {
      $(g, t, h), n(t, l), n(l, o), n(t, r), n(t, a), n(a, b), n(a, u), n(t, v);
    },
    p(g, h) {
      e = g, h & /*items*/
      4 && i !== (i = /*item*/
      e[7].title + "") && L(o, i), h & /*items*/
      4 && f !== (f = /*item*/
      e[7].score + "") && L(b, f), h & /*items, cadence*/
      6 && p !== (p = `animation-delay:${/*index*/
      e[9] * /*cadence*/
      e[1]}ms`) && c(t, "style", p);
    },
    d(g) {
      g && E(t);
    }
  };
}
function Rl(s) {
  let e, t, l, i, o, r, a, f, b, u, v, p, g = [], h = /* @__PURE__ */ new Map(), m, y, C = le(
    /*items*/
    s[2]
  );
  const S = (w) => (
    /*item*/
    w[7].id
  );
  for (let w = 0; w < C.length; w += 1) {
    let q = os(s, C, w), T = S(q);
    h.set(T, g[w] = cs(T, q));
  }
  return {
    c() {
      e = d("div"), t = d("div"), l = d("div"), i = d("p"), i.textContent = "Stagger list", o = x(), r = d("p"), a = k(
        /*count*/
        s[0]
      ), f = k(" items"), b = x(), u = d("button"), u.textContent = "Actualizar", v = x(), p = d("div");
      for (let w = 0; w < g.length; w += 1)
        g[w].c();
      c(i, "class", "title svelte-1jr61rp"), c(r, "class", "subtitle svelte-1jr61rp"), c(u, "type", "button"), c(u, "class", "svelte-1jr61rp"), c(t, "class", "header svelte-1jr61rp"), c(p, "class", "items svelte-1jr61rp"), c(e, "class", "list svelte-1jr61rp");
    },
    m(w, q) {
      $(w, e, q), n(e, t), n(t, l), n(l, i), n(l, o), n(l, r), n(r, a), n(r, f), n(t, b), n(t, u), n(e, v), n(e, p);
      for (let T = 0; T < g.length; T += 1)
        g[T] && g[T].m(p, null);
      m || (y = O(
        u,
        "click",
        /*handleRefresh*/
        s[3]
      ), m = !0);
    },
    p(w, [q]) {
      q & /*count*/
      1 && L(
        a,
        /*count*/
        w[0]
      ), q & /*items, cadence*/
      6 && (C = le(
        /*items*/
        w[2]
      ), g = Mt(g, q, S, 1, w, C, h, p, Et, cs, null, os));
    },
    i: D,
    o: D,
    d(w) {
      w && E(e);
      for (let q = 0; q < g.length; q += 1)
        g[q].d();
      m = !1, y();
    }
  };
}
function Pl(s, e, t) {
  let { label: l = "Batch" } = e, { count: i = 5 } = e, { cadence: o = 120 } = e;
  const r = qe();
  let a = [];
  const f = () => {
    t(2, a = Array.from({ length: i }, (u, v) => ({
      id: `${l}-${v}`,
      title: `${l} ${v + 1}`,
      score: Math.floor(Math.random() * 40) + 60
    }))), r("refresh", { count: i });
  }, b = () => {
    f();
  };
  return bl(f), s.$$set = (u) => {
    "label" in u && t(4, l = u.label), "count" in u && t(0, i = u.count), "cadence" in u && t(1, o = u.cadence);
  }, [i, o, a, b, l];
}
class Us extends ae {
  constructor(e) {
    super(), ne(this, e, Pl, Rl, K, { label: 4, count: 0, cadence: 1 }, Ol);
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
re(Us, { label: {}, count: {}, cadence: {} }, [], [], !0);
function Fl(s) {
  ie(s, "svelte-1o8h3wg", ".thermo.svelte-1o8h3wg{display:grid;gap:16px;border-radius:18px;border:1px solid #e2e8f0;padding:16px;background:#ffffff}.header.svelte-1o8h3wg{display:flex;justify-content:space-between;align-items:center}.title.svelte-1o8h3wg{margin:0;font-size:14px;font-weight:600;color:#0f172a}.subtitle.svelte-1o8h3wg{margin:0;font-size:12px;color:#64748b}.chip.svelte-1o8h3wg{font-size:11px;padding:4px 8px;border-radius:999px;background:#ecfdf5;color:#065f46;border:1px solid rgba(16, 185, 129, 0.2)}.meter.svelte-1o8h3wg{position:relative;height:160px;display:grid;place-items:center}.tube.svelte-1o8h3wg{position:relative;width:24px;height:140px;border-radius:14px;background:#f1f5f9;border:1px solid #e2e8f0;overflow:hidden;box-shadow:inset 0 6px 16px rgba(15, 23, 42, 0.08)}.fill.svelte-1o8h3wg{position:absolute;left:0;right:0;bottom:0;height:var(--level);background:linear-gradient(180deg, #ffffff, var(--fill));transition:height 0.8s cubic-bezier(0.22, 1, 0.36, 1)}.gloss.svelte-1o8h3wg{position:absolute;left:3px;top:8px;width:6px;height:calc(100% - 16px);border-radius:999px;background:rgba(255, 255, 255, 0.6);animation:svelte-1o8h3wg-shimmer 2.4s ease-in-out infinite}.bulb.svelte-1o8h3wg{position:absolute;bottom:-6px;width:44px;height:44px;border-radius:999px;background:radial-gradient(circle at 30% 30%, #ffffff, var(--fill));border:2px solid rgba(226, 232, 240, 0.9);box-shadow:0 10px 24px var(--glow);animation:svelte-1o8h3wg-pulse 2.2s ease-in-out infinite}@keyframes svelte-1o8h3wg-shimmer{0%,100%{opacity:0.35;transform:translateY(0)}50%{opacity:0.7;transform:translateY(-8px)}}@keyframes svelte-1o8h3wg-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}");
}
function Bl(s) {
  let e, t, l, i, o, r, a, f, b, u, v, p, g, h, m, y, C, S, w, q;
  return {
    c() {
      e = d("div"), t = d("div"), l = d("div"), i = d("p"), o = k(
        /*label*/
        s[0]
      ), r = x(), a = d("p"), f = k(
        /*safeValue*/
        s[3]
      ), b = k("°C · "), u = k(
        /*percent*/
        s[6]
      ), v = k("%"), p = x(), g = d("div"), h = k(
        /*min*/
        s[1]
      ), m = k("° – "), y = k(
        /*max*/
        s[2]
      ), C = k("°"), S = x(), w = d("div"), w.innerHTML = '<div class="tube svelte-1o8h3wg"><div class="fill svelte-1o8h3wg"></div> <div class="gloss svelte-1o8h3wg"></div></div> <div class="bulb svelte-1o8h3wg"></div>', c(i, "class", "title svelte-1o8h3wg"), c(a, "class", "subtitle svelte-1o8h3wg"), c(g, "class", "chip svelte-1o8h3wg"), c(t, "class", "header svelte-1o8h3wg"), c(w, "class", "meter svelte-1o8h3wg"), c(e, "class", "thermo svelte-1o8h3wg"), c(e, "style", q = `--level:${/*percent*/
      s[6]}%; --fill:${/*fillColor*/
      s[5]}; --glow:${/*glowColor*/
      s[4]};`);
    },
    m(T, _) {
      $(T, e, _), n(e, t), n(t, l), n(l, i), n(i, o), n(l, r), n(l, a), n(a, f), n(a, b), n(a, u), n(a, v), n(t, p), n(t, g), n(g, h), n(g, m), n(g, y), n(g, C), n(e, S), n(e, w);
    },
    p(T, [_]) {
      _ & /*label*/
      1 && L(
        o,
        /*label*/
        T[0]
      ), _ & /*safeValue*/
      8 && L(
        f,
        /*safeValue*/
        T[3]
      ), _ & /*percent*/
      64 && L(
        u,
        /*percent*/
        T[6]
      ), _ & /*min*/
      2 && L(
        h,
        /*min*/
        T[1]
      ), _ & /*max*/
      4 && L(
        y,
        /*max*/
        T[2]
      ), _ & /*percent, fillColor, glowColor*/
      112 && q !== (q = `--level:${/*percent*/
      T[6]}%; --fill:${/*fillColor*/
      T[5]}; --glow:${/*glowColor*/
      T[4]};`) && c(e, "style", q);
    },
    i: D,
    o: D,
    d(T) {
      T && E(e);
    }
  };
}
function Hl(s, e, t) {
  let l, i, o, r, a, f, b, u, { label: v = "Temperatura" } = e, { value: p = 22 } = e, { min: g = 0 } = e, { max: h = 40 } = e;
  const m = (S, w, q) => Math.min(q, Math.max(w, S)), y = (S, w, q) => Math.round(S + (w - S) * q), C = (S, w, q) => `rgb(${S}, ${w}, ${q})`;
  return s.$$set = (S) => {
    "label" in S && t(0, v = S.label), "value" in S && t(7, p = S.value), "min" in S && t(1, g = S.min), "max" in S && t(2, h = S.max);
  }, s.$$.update = () => {
    s.$$.dirty & /*value, min, max*/
    134 && t(3, l = m(p, g, h)), s.$$.dirty & /*safeValue, min, max*/
    14 && t(9, i = (l - g) / (h - g || 1)), s.$$.dirty & /*ratio*/
    512 && t(6, o = Math.round(i * 100)), s.$$.dirty & /*cool, warm, ratio*/
    3584 && t(8, f = {
      r: y(a.r, r.r, i),
      g: y(a.g, r.g, i),
      b: y(a.b, r.b, i)
    }), s.$$.dirty & /*mix*/
    256 && t(5, b = C(f.r, f.g, f.b)), s.$$.dirty & /*mix*/
    256 && t(4, u = `rgba(${f.r}, ${f.g}, ${f.b}, 0.45)`);
  }, t(10, r = { r: 239, g: 68, b: 68 }), t(11, a = { r: 34, g: 197, b: 94 }), [
    v,
    g,
    h,
    l,
    u,
    b,
    o,
    p,
    f,
    i,
    r,
    a
  ];
}
class Js extends ae {
  constructor(e) {
    super(), ne(this, e, Hl, Bl, K, { label: 0, value: 7, min: 1, max: 2 }, Fl);
  }
  get label() {
    return this.$$.ctx[0];
  }
  set label(e) {
    this.$$set({ label: e }), z();
  }
  get value() {
    return this.$$.ctx[7];
  }
  set value(e) {
    this.$$set({ value: e }), z();
  }
  get min() {
    return this.$$.ctx[1];
  }
  set min(e) {
    this.$$set({ min: e }), z();
  }
  get max() {
    return this.$$.ctx[2];
  }
  set max(e) {
    this.$$set({ max: e }), z();
  }
}
re(Js, { label: {}, value: {}, min: {}, max: {} }, [], [], !0);
function Vl(s) {
  ie(s, "svelte-q2ay9k", `.podium.svelte-q2ay9k.svelte-q2ay9k{position:relative;border-radius:18px;border:1px solid #e2e8f0;background:linear-gradient(180deg, #ffffff, #f8fafc);padding:24px 18px 16px;height:220px;display:grid;align-items:end}.line.svelte-q2ay9k.svelte-q2ay9k{position:absolute;left:16px;right:16px;bottom:24px;height:2px;background:linear-gradient(90deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.6))}.controls.svelte-q2ay9k.svelte-q2ay9k{position:absolute;top:14px;right:14px;display:flex;gap:8px}.reset.svelte-q2ay9k.svelte-q2ay9k,.swap.svelte-q2ay9k.svelte-q2ay9k{border:1px solid rgba(16, 185, 129, 0.3);background:#ecfdf5;color:#065f46;font-size:11px;padding:6px 10px;border-radius:999px;cursor:pointer}.reset.svelte-q2ay9k.svelte-q2ay9k:hover,.swap.svelte-q2ay9k.svelte-q2ay9k:hover{background:#d1fae5}.stack.svelte-q2ay9k.svelte-q2ay9k{position:relative;display:grid;grid-template-columns:repeat(3, 1fr);align-items:end;gap:14px;height:100%;z-index:1}.bar.svelte-q2ay9k.svelte-q2ay9k{position:relative;border-radius:14px 14px 6px 6px;background:#d1fae5;color:#065f46;display:grid;place-items:center;font-size:14px;font-weight:600;transform-origin:bottom;animation:svelte-q2ay9k-rise var(--dur) cubic-bezier(0.22, 1, 0.36, 1) forwards;transform:scaleY(0)}.bar.svelte-q2ay9k span.svelte-q2ay9k{opacity:0;animation:svelte-q2ay9k-fade-in 0.5s ease forwards;animation-delay:calc(var(--dur) * 0.7)}.bar.svelte-q2ay9k.svelte-q2ay9k::after{content:"";position:absolute;inset:8px;border-radius:10px;background:linear-gradient(120deg, rgba(255, 255, 255, 0.4), transparent 60%);opacity:0;animation:svelte-q2ay9k-sweep 1.6s ease forwards;animation-delay:calc(var(--dur) * 0.4)}.bar.first.svelte-q2ay9k.svelte-q2ay9k{background:linear-gradient(180deg, #10b981, #34d399);color:#ffffff;box-shadow:0 14px 24px rgba(16, 185, 129, 0.35)}.bar.second.svelte-q2ay9k.svelte-q2ay9k{background:linear-gradient(180deg, #34d399, #6ee7b7)}.bar.third.svelte-q2ay9k.svelte-q2ay9k{background:linear-gradient(180deg, #bbf7d0, #ecfdf5)}.podium[data-play].svelte-q2ay9k .bar.svelte-q2ay9k{animation:svelte-q2ay9k-rise var(--dur) cubic-bezier(0.22, 1, 0.36, 1) forwards,
      svelte-q2ay9k-settle 0.35s ease-out forwards;animation-delay:0s, calc(var(--dur) * 0.9)}.podium[data-play].svelte-q2ay9k .bar span.svelte-q2ay9k{animation:svelte-q2ay9k-fade-in 0.5s ease forwards;animation-delay:calc(var(--dur) * 0.7)}.podium[data-play].svelte-q2ay9k .bar.svelte-q2ay9k::after{animation:svelte-q2ay9k-sweep 1.6s ease forwards;animation-delay:calc(var(--dur) * 0.4)}@keyframes svelte-q2ay9k-rise{to{transform:scaleY(1)}}@keyframes svelte-q2ay9k-settle{0%{transform:scaleY(1.02)}100%{transform:scaleY(1)}}@keyframes svelte-q2ay9k-fade-in{to{opacity:1}}@keyframes svelte-q2ay9k-sweep{0%{opacity:0;transform:translateY(10%)}50%{opacity:0.5}100%{opacity:0;transform:translateY(-20%)}}`);
}
function fs(s, e, t) {
  const l = s.slice();
  return l[12] = e[t], l;
}
function ds(s, e) {
  let t, l, i = (
    /*item*/
    e[12].label + ""
  ), o, r, a, f;
  return {
    key: s,
    first: null,
    c() {
      t = d("div"), l = d("span"), o = k(i), r = x(), c(l, "class", "svelte-q2ay9k"), c(t, "class", a = ft(`bar ${/*item*/
      e[12].className}`) + " svelte-q2ay9k"), c(t, "style", f = `height:${/*item*/
      e[12].height}%; --dur:${/*item*/
      e[12].duration}s;`), this.first = t;
    },
    m(b, u) {
      $(b, t, u), n(t, l), n(l, o), n(t, r);
    },
    p(b, u) {
      e = b, u & /*items*/
      2 && i !== (i = /*item*/
      e[12].label + "") && L(o, i), u & /*items*/
      2 && a !== (a = ft(`bar ${/*item*/
      e[12].className}`) + " svelte-q2ay9k") && c(t, "class", a), u & /*items*/
      2 && f !== (f = `height:${/*item*/
      e[12].height}%; --dur:${/*item*/
      e[12].duration}s;`) && c(t, "style", f);
    },
    d(b) {
      b && E(t);
    }
  };
}
function us(s) {
  let e, t = [], l = /* @__PURE__ */ new Map(), i = le(
    /*items*/
    s[1]
  );
  const o = (r) => (
    /*item*/
    r[12].key
  );
  for (let r = 0; r < i.length; r += 1) {
    let a = fs(s, i, r), f = o(a);
    l.set(f, t[r] = ds(f, a));
  }
  return {
    c() {
      e = d("div");
      for (let r = 0; r < t.length; r += 1)
        t[r].c();
      c(e, "class", "stack svelte-q2ay9k");
    },
    m(r, a) {
      $(r, e, a);
      for (let f = 0; f < t.length; f += 1)
        t[f] && t[f].m(e, null);
    },
    p(r, a) {
      a & /*items*/
      2 && (i = le(
        /*items*/
        r[1]
      ), t = Mt(t, a, o, 1, r, i, l, e, Et, ds, null, fs));
    },
    d(r) {
      r && E(e);
      for (let a = 0; a < t.length; a += 1)
        t[a].d();
    }
  };
}
function Ul(s) {
  let e, t, l, i, o, r, a, f, b = (
    /*playId*/
    s[0]
  ), u, v, p = us(s);
  return {
    c() {
      e = d("div"), t = d("div"), l = x(), i = d("div"), o = d("button"), o.textContent = "Reiniciar", r = x(), a = d("button"), a.textContent = "Intercalar", f = x(), p.c(), c(t, "class", "line svelte-q2ay9k"), c(o, "class", "reset svelte-q2ay9k"), c(o, "type", "button"), c(a, "class", "swap svelte-q2ay9k"), c(a, "type", "button"), c(i, "class", "controls svelte-q2ay9k"), c(e, "class", "podium svelte-q2ay9k"), c(
        e,
        "data-play",
        /*playId*/
        s[0]
      );
    },
    m(g, h) {
      $(g, e, h), n(e, t), n(e, l), n(e, i), n(i, o), n(i, r), n(i, a), n(e, f), p.m(e, null), u || (v = [
        O(
          o,
          "click",
          /*reset*/
          s[2]
        ),
        O(
          a,
          "click",
          /*cycle*/
          s[3]
        )
      ], u = !0);
    },
    p(g, [h]) {
      h & /*playId*/
      1 && K(b, b = /*playId*/
      g[0]) ? (p.d(1), p = us(g), p.c(), p.m(e, null)) : p.p(g, h), h & /*playId*/
      1 && c(
        e,
        "data-play",
        /*playId*/
        g[0]
      );
    },
    i: D,
    o: D,
    d(g) {
      g && E(e), p.d(g), u = !1, fe(v);
    }
  };
}
function Jl(s, e, t) {
  let l, { first: i = 82 } = e, { second: o = 64 } = e, { third: r = 48 } = e, { baseDuration: a = 0.9 } = e, { delayStep: f = 0.15 } = e, b = 0, u = ["second", "first", "third"];
  const v = {
    first: { label: "1", className: "first" },
    second: { label: "2", className: "second" },
    third: { label: "3", className: "third" }
  }, p = (m) => m === "first" ? i : m === "second" ? o : r, g = () => {
    t(0, b += 1);
  }, h = () => {
    t(9, u = [u[1], u[2], u[0]]), t(0, b += 1);
  };
  return s.$$set = (m) => {
    "first" in m && t(4, i = m.first), "second" in m && t(5, o = m.second), "third" in m && t(6, r = m.third), "baseDuration" in m && t(7, a = m.baseDuration), "delayStep" in m && t(8, f = m.delayStep);
  }, s.$$.update = () => {
    s.$$.dirty & /*order, baseDuration, delayStep*/
    896 && t(1, l = u.map((m, y) => ({
      key: m,
      label: v[m].label,
      className: v[m].className,
      height: p(m),
      duration: a + y * f * 2
    })));
  }, [
    b,
    l,
    g,
    h,
    i,
    o,
    r,
    a,
    f,
    u
  ];
}
class Qs extends ae {
  constructor(e) {
    super(), ne(
      this,
      e,
      Jl,
      Ul,
      K,
      {
        first: 4,
        second: 5,
        third: 6,
        baseDuration: 7,
        delayStep: 8
      },
      Vl
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
re(Qs, { first: {}, second: {}, third: {}, baseDuration: {}, delayStep: {} }, [], [], !0);
function Ql(s) {
  ie(s, "svelte-1jqbzw8", ".balloon-card.svelte-1jqbzw8{border-radius:18px;border:1px solid #e2e8f0;background:linear-gradient(180deg, #ffffff, #f8fafc);padding:16px;height:220px;display:grid;place-items:center}.scene.svelte-1jqbzw8{position:relative;width:160px;height:180px}.rope.svelte-1jqbzw8{position:absolute;left:50%;bottom:14px;width:2px;height:90px;background:var(--rope);transform-origin:bottom;transform:translateX(-50%);animation:svelte-1jqbzw8-rope-sway var(--speed) ease-in-out infinite}.anchor.svelte-1jqbzw8{position:absolute;left:50%;bottom:0;width:18px;height:18px;border-radius:999px;background:#e2e8f0;border:2px solid #cbd5f5;transform:translateX(-50%)}.balloon.svelte-1jqbzw8{position:absolute;left:50%;bottom:96px;width:64px;height:74px;border-radius:50% 50% 46% 46%;background:radial-gradient(circle at 35% 30%, #ffffff, var(--balloon));box-shadow:0 16px 26px rgba(16, 185, 129, 0.2);transform-origin:bottom center;transform:translateX(-50%);animation:svelte-1jqbzw8-float var(--speed) ease-in-out infinite}.string.svelte-1jqbzw8{position:absolute;left:50%;bottom:-26px;width:2px;height:26px;background:var(--rope);transform:translateX(-50%)}@keyframes svelte-1jqbzw8-float{0%,100%{transform:translateX(-50%) translateY(0) rotate(0deg)}50%{transform:translateX(-50%) translateY(calc(var(--lift) * -1)) rotate(var(--sway))}}@keyframes svelte-1jqbzw8-rope-sway{0%,100%{transform:translateX(-50%) rotate(0deg)}50%{transform:translateX(-50%) rotate(calc(var(--sway) * -0.4))}}");
}
function Kl(s) {
  let e, t, l;
  return {
    c() {
      e = d("div"), t = d("div"), t.innerHTML = '<div class="rope svelte-1jqbzw8"></div> <div class="anchor svelte-1jqbzw8"></div> <div class="balloon svelte-1jqbzw8"><div class="string svelte-1jqbzw8"></div></div>', c(t, "class", "scene svelte-1jqbzw8"), c(e, "class", "balloon-card svelte-1jqbzw8"), c(e, "style", l = `
    --lift:${/*lift*/
      s[0]}px;
    --sway:${/*sway*/
      s[1]}deg;
    --speed:${/*speed*/
      s[2]}s;
    --balloon:${/*color*/
      s[3]};
    --rope:${/*rope*/
      s[4]};
  `);
    },
    m(i, o) {
      $(i, e, o), n(e, t);
    },
    p(i, [o]) {
      o & /*lift, sway, speed, color, rope*/
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
  `) && c(e, "style", l);
    },
    i: D,
    o: D,
    d(i) {
      i && E(e);
    }
  };
}
function Gl(s, e, t) {
  let { lift: l = 18 } = e, { sway: i = 6 } = e, { speed: o = 5.5 } = e, { color: r = "#10b981" } = e, { rope: a = "#94a3b8" } = e;
  return s.$$set = (f) => {
    "lift" in f && t(0, l = f.lift), "sway" in f && t(1, i = f.sway), "speed" in f && t(2, o = f.speed), "color" in f && t(3, r = f.color), "rope" in f && t(4, a = f.rope);
  }, [l, i, o, r, a];
}
class Ks extends ae {
  constructor(e) {
    super(), ne(
      this,
      e,
      Gl,
      Kl,
      K,
      {
        lift: 0,
        sway: 1,
        speed: 2,
        color: 3,
        rope: 4
      },
      Ql
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
re(Ks, { lift: {}, sway: {}, speed: {}, color: {}, rope: {} }, [], [], !0);
function Wl(s) {
  ie(s, "svelte-9cnfqg", '.wrapper.svelte-9cnfqg.svelte-9cnfqg{display:grid;grid-template-columns:28px 1fr 28px;align-items:stretch;gap:12px}.nav.svelte-9cnfqg.svelte-9cnfqg{border:1px solid #e2e8f0;background:#f8fafc;border-radius:14px;display:grid;place-items:center;height:100%;cursor:pointer;transition:transform 0.2s ease, background 0.2s ease;position:relative;overflow:hidden}.nav.svelte-9cnfqg.svelte-9cnfqg:hover{background:#e2e8f0;transform:translateY(-2px)}.nav.svelte-9cnfqg.svelte-9cnfqg::after{content:"";position:absolute;inset:0;background:linear-gradient(120deg, transparent, rgba(16, 185, 129, 0.25), transparent);transform:translateX(-120%);transition:transform 0.45s ease}.nav.svelte-9cnfqg.svelte-9cnfqg:hover::after{transform:translateX(120%)}.chevron.svelte-9cnfqg.svelte-9cnfqg{width:10px;height:28px;border-right:2px solid #475569;border-bottom:2px solid #475569;transform:rotate(-45deg)}.nav.left.svelte-9cnfqg .chevron.svelte-9cnfqg{transform:rotate(135deg)}.card.svelte-9cnfqg.svelte-9cnfqg{display:grid;grid-template-columns:72px 1fr;gap:16px;padding:18px 20px;border-radius:20px;border:1px solid #e2e8f0;background:#ffffff;box-shadow:0 14px 26px rgba(15, 23, 42, 0.08);transition:transform 0.35s ease, box-shadow 0.35s ease}.card.svelte-9cnfqg.svelte-9cnfqg:hover{transform:translateY(-4px);box-shadow:0 18px 34px rgba(15, 23, 42, 0.16)}.icon.svelte-9cnfqg.svelte-9cnfqg{width:56px;height:56px;border-radius:16px;background:#f8fafc;display:grid;place-items:center}.ladder.svelte-9cnfqg.svelte-9cnfqg{width:28px;height:36px;border:3px solid #7c5c4f;border-left-width:5px;border-right-width:5px;border-radius:6px;position:relative}.ladder.svelte-9cnfqg span.svelte-9cnfqg{position:absolute;left:2px;right:2px;height:4px;background:#7c5c4f;border-radius:999px;animation:svelte-9cnfqg-rung 2.8s ease-in-out infinite}.ladder.svelte-9cnfqg span.svelte-9cnfqg:nth-child(1){top:6px;animation-delay:0s}.ladder.svelte-9cnfqg span.svelte-9cnfqg:nth-child(2){top:14px;animation-delay:0.2s}.ladder.svelte-9cnfqg span.svelte-9cnfqg:nth-child(3){top:22px;animation-delay:0.4s}.ladder.svelte-9cnfqg span.svelte-9cnfqg:nth-child(4){top:30px;animation-delay:0.6s}.content.svelte-9cnfqg.svelte-9cnfqg{display:grid;gap:8px}.panel.svelte-9cnfqg.svelte-9cnfqg{animation:svelte-9cnfqg-slide-in 0.4s ease}.row.svelte-9cnfqg.svelte-9cnfqg{display:flex;align-items:center;justify-content:space-between;gap:12px}.title.svelte-9cnfqg.svelte-9cnfqg{display:flex;align-items:baseline;gap:12px}.title.svelte-9cnfqg strong.svelte-9cnfqg{font-size:18px;color:#0f172a}.title.svelte-9cnfqg span.svelte-9cnfqg{font-size:14px;color:#64748b}.level-text.svelte-9cnfqg.svelte-9cnfqg{font-size:14px;color:#64748b;animation:svelte-9cnfqg-level-pop 0.35s ease}.pill.svelte-9cnfqg.svelte-9cnfqg{padding:6px 14px;background:#eef2ff;color:#1e3a8a;border-radius:999px;font-size:12px;font-weight:600}.desc.svelte-9cnfqg.svelte-9cnfqg{margin:0;font-size:14px;color:#0f172a}.meta.svelte-9cnfqg.svelte-9cnfqg{font-size:13px;color:#475569}.xp.svelte-9cnfqg.svelte-9cnfqg{font-weight:600;color:#047857}.progress.svelte-9cnfqg.svelte-9cnfqg{position:relative;height:12px;border-radius:999px;background:#f1f5f9;overflow:hidden}.bar.svelte-9cnfqg.svelte-9cnfqg{height:100%;width:var(--fill);background:linear-gradient(90deg, #10b981, #34d399);transition:width 0.8s cubic-bezier(0.22, 1, 0.36, 1)}.glow.svelte-9cnfqg.svelte-9cnfqg{position:absolute;inset:0;background:linear-gradient(90deg, rgba(16, 185, 129, 0), rgba(16, 185, 129, 0.35), rgba(16, 185, 129, 0));transform:translateX(-100%);animation:svelte-9cnfqg-sweep 3.2s ease-in-out infinite}@keyframes svelte-9cnfqg-sweep{0%,60%{transform:translateX(-100%)}100%{transform:translateX(100%)}}@keyframes svelte-9cnfqg-level-pop{0%{opacity:0;transform:translateY(4px)}100%{opacity:1;transform:translateY(0)}}@keyframes svelte-9cnfqg-rung{0%,100%{opacity:0.6}50%{opacity:1}}@keyframes svelte-9cnfqg-slide-in{from{opacity:0;transform:translateX(calc(var(--dir) * 12px))}to{opacity:1;transform:translateX(0)}}');
}
function ps(s) {
  let e, t, l, i, o, r, a, f, b, u, v, p, g, h, m, y, C, S, w, q, T, _, j, N, Y, R, U, B, pe, ve, se, G, ce, Z, W;
  return {
    c() {
      e = d("div"), t = d("div"), l = d("div"), i = d("strong"), o = k(
        /*title*/
        s[0]
      ), r = x(), a = d("span"), f = k("Nivel "), b = k(
        /*activeLevel*/
        s[4]
      ), u = k("/"), v = k(
        /*safeLevelTotal*/
        s[5]
      ), p = x(), g = d("div"), h = k(
        /*status*/
        s[3]
      ), m = x(), y = d("p"), C = k(
        /*description*/
        s[1]
      ), S = x(), w = d("div"), q = d("span"), T = k("Progreso: "), _ = k(
        /*safeProgress*/
        s[7]
      ), j = k(" / "), N = k(
        /*safeTotal*/
        s[6]
      ), Y = x(), R = d("span"), U = k("+"), B = k(
        /*xp*/
        s[2]
      ), pe = k(" XP"), ve = x(), se = d("div"), G = d("div"), Z = x(), W = d("div"), c(i, "class", "svelte-9cnfqg"), c(a, "class", "level-text svelte-9cnfqg"), c(l, "class", "title svelte-9cnfqg"), c(g, "class", "pill svelte-9cnfqg"), c(t, "class", "row svelte-9cnfqg"), c(y, "class", "desc svelte-9cnfqg"), c(R, "class", "xp svelte-9cnfqg"), c(w, "class", "row meta svelte-9cnfqg"), c(G, "class", "bar svelte-9cnfqg"), c(G, "style", ce = `--fill:${/*percent*/
      s[9]}%`), c(W, "class", "glow svelte-9cnfqg"), c(se, "class", "progress svelte-9cnfqg"), c(e, "class", "panel svelte-9cnfqg");
    },
    m(P, X) {
      $(P, e, X), n(e, t), n(t, l), n(l, i), n(i, o), n(l, r), n(l, a), n(a, f), n(a, b), n(a, u), n(a, v), n(t, p), n(t, g), n(g, h), n(e, m), n(e, y), n(y, C), n(e, S), n(e, w), n(w, q), n(q, T), n(q, _), n(q, j), n(q, N), n(w, Y), n(w, R), n(R, U), n(R, B), n(R, pe), n(e, ve), n(e, se), n(se, G), n(se, Z), n(se, W);
    },
    p(P, X) {
      X & /*title*/
      1 && L(
        o,
        /*title*/
        P[0]
      ), X & /*activeLevel*/
      16 && L(
        b,
        /*activeLevel*/
        P[4]
      ), X & /*safeLevelTotal*/
      32 && L(
        v,
        /*safeLevelTotal*/
        P[5]
      ), X & /*status*/
      8 && L(
        h,
        /*status*/
        P[3]
      ), X & /*description*/
      2 && L(
        C,
        /*description*/
        P[1]
      ), X & /*safeProgress*/
      128 && L(
        _,
        /*safeProgress*/
        P[7]
      ), X & /*safeTotal*/
      64 && L(
        N,
        /*safeTotal*/
        P[6]
      ), X & /*xp*/
      4 && L(
        B,
        /*xp*/
        P[2]
      ), X & /*percent*/
      512 && ce !== (ce = `--fill:${/*percent*/
      P[9]}%`) && c(G, "style", ce);
    },
    d(P) {
      P && E(e);
    }
  };
}
function Zl(s) {
  let e, t, l, i, o, r, a, f = (
    /*activeLevel*/
    s[4]
  ), b, u, v, p, g, h = ps(s);
  return {
    c() {
      e = d("div"), t = d("button"), t.innerHTML = '<span class="chevron svelte-9cnfqg"></span>', l = x(), i = d("div"), o = d("div"), o.innerHTML = '<div class="ladder svelte-9cnfqg"><span class="svelte-9cnfqg"></span> <span class="svelte-9cnfqg"></span> <span class="svelte-9cnfqg"></span> <span class="svelte-9cnfqg"></span></div>', r = x(), a = d("div"), h.c(), u = x(), v = d("button"), v.innerHTML = '<span class="chevron svelte-9cnfqg"></span>', c(t, "class", "nav left svelte-9cnfqg"), c(t, "type", "button"), c(t, "aria-label", "Nivel anterior"), c(o, "class", "icon svelte-9cnfqg"), c(a, "class", "content svelte-9cnfqg"), c(a, "style", b = `--dir:${/*slideDir*/
      s[8]}`), c(i, "class", "card svelte-9cnfqg"), c(v, "class", "nav right svelte-9cnfqg"), c(v, "type", "button"), c(v, "aria-label", "Nivel siguiente"), c(e, "class", "wrapper svelte-9cnfqg");
    },
    m(m, y) {
      $(m, e, y), n(e, t), n(e, l), n(e, i), n(i, o), n(i, r), n(i, a), h.m(a, null), n(e, u), n(e, v), p || (g = [
        O(
          t,
          "click",
          /*click_handler*/
          s[17]
        ),
        O(
          v,
          "click",
          /*click_handler_1*/
          s[18]
        )
      ], p = !0);
    },
    p(m, [y]) {
      y & /*activeLevel*/
      16 && K(f, f = /*activeLevel*/
      m[4]) ? (h.d(1), h = ps(m), h.c(), h.m(a, null)) : h.p(m, y), y & /*slideDir*/
      256 && b !== (b = `--dir:${/*slideDir*/
      m[8]}`) && c(a, "style", b);
    },
    i: D,
    o: D,
    d(m) {
      m && E(e), h.d(m), p = !1, fe(g);
    }
  };
}
function ei(s, e, t) {
  let l, i, o, r, a, { title: f = "Nivel 5" } = e, { subtitle: b = "Nivel 1/3" } = e, { description: u = "Alcanza nivel 5 de usuario." } = e, { progress: v = 4 } = e, { total: p = 5 } = e, { xp: g = 15 } = e, { status: h = "En progreso" } = e, { levelIndex: m = 1 } = e, { levelTotal: y = 3 } = e;
  const C = (j, N, Y) => Math.min(Y, Math.max(N, j));
  let S = C(m, 1, a), w = 1;
  const q = (j) => {
    t(8, w = j >= 0 ? 1 : -1), t(4, S = C(S + j, 1, a));
  }, T = () => q(-1), _ = () => q(1);
  return s.$$set = (j) => {
    "title" in j && t(0, f = j.title), "subtitle" in j && t(11, b = j.subtitle), "description" in j && t(1, u = j.description), "progress" in j && t(12, v = j.progress), "total" in j && t(13, p = j.total), "xp" in j && t(2, g = j.xp), "status" in j && t(3, h = j.status), "levelIndex" in j && t(14, m = j.levelIndex), "levelTotal" in j && t(15, y = j.levelTotal);
  }, s.$$.update = () => {
    s.$$.dirty & /*total*/
    8192 && t(6, l = Math.max(1, p)), s.$$.dirty & /*progress, safeTotal*/
    4160 && t(7, i = C(v, 0, l)), s.$$.dirty & /*safeProgress, safeTotal*/
    192 && t(16, o = i / l), s.$$.dirty & /*ratio*/
    65536 && t(9, r = Math.round(o * 100)), s.$$.dirty & /*levelTotal*/
    32768 && t(5, a = Math.max(1, y)), s.$$.dirty & /*levelIndex, activeLevel, safeLevelTotal*/
    16432 && m !== S && t(4, S = C(m, 1, a));
  }, [
    f,
    u,
    g,
    h,
    S,
    a,
    l,
    i,
    w,
    r,
    q,
    b,
    v,
    p,
    m,
    y,
    o,
    T,
    _
  ];
}
class Gs extends ae {
  constructor(e) {
    super(), ne(
      this,
      e,
      ei,
      Zl,
      K,
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
      Wl
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
re(Gs, { title: {}, subtitle: {}, description: {}, progress: {}, total: {}, xp: {}, status: {}, levelIndex: {}, levelTotal: {} }, [], [], !0);
function ti(s) {
  ie(s, "svelte-12k2sv8", ".card.svelte-12k2sv8{position:relative;border-radius:18px;border:1px solid #e2e8f0;background:linear-gradient(160deg, #ffffff, #ecfdf5);padding:18px;overflow:hidden;transform:perspective(800px) rotateX(var(--rx)) rotateY(var(--ry));transition:transform 0.2s ease;box-shadow:0 18px 32px rgba(15, 23, 42, 0.12)}.shine.svelte-12k2sv8{position:absolute;inset:0;background:radial-gradient(circle at var(--shine) 20%, rgba(16, 185, 129, 0.22), transparent 55%);pointer-events:none}.content.svelte-12k2sv8{position:relative;display:grid;gap:6px}.title.svelte-12k2sv8{margin:0;font-size:12px;color:#64748b;letter-spacing:0.08em;text-transform:uppercase}.value.svelte-12k2sv8{margin:0;font-size:28px;font-weight:700;color:#0f172a}.hint.svelte-12k2sv8{margin:0;font-size:12px;color:#475569}");
}
function si(s) {
  let e, t, l, i, o, r, a, f, b, u, v, p, g, h, m;
  return {
    c() {
      e = d("div"), t = d("div"), l = x(), i = d("div"), o = d("p"), r = k(
        /*title*/
        s[0]
      ), a = x(), f = d("p"), b = k(
        /*value*/
        s[1]
      ), u = x(), v = d("p"), p = k(
        /*hint*/
        s[2]
      ), c(t, "class", "shine svelte-12k2sv8"), c(o, "class", "title svelte-12k2sv8"), c(f, "class", "value svelte-12k2sv8"), c(v, "class", "hint svelte-12k2sv8"), c(i, "class", "content svelte-12k2sv8"), c(e, "class", "card svelte-12k2sv8"), c(e, "style", g = `--rx:${/*rx*/
      s[3]}deg; --ry:${/*ry*/
      s[4]}deg; --shine:${/*shine*/
      s[5]}%`);
    },
    m(y, C) {
      $(y, e, C), n(e, t), n(e, l), n(e, i), n(i, o), n(o, r), n(i, a), n(i, f), n(f, b), n(i, u), n(i, v), n(v, p), h || (m = [
        O(
          e,
          "pointermove",
          /*handleMove*/
          s[6]
        ),
        O(
          e,
          "pointerleave",
          /*reset*/
          s[7]
        )
      ], h = !0);
    },
    p(y, [C]) {
      C & /*title*/
      1 && L(
        r,
        /*title*/
        y[0]
      ), C & /*value*/
      2 && L(
        b,
        /*value*/
        y[1]
      ), C & /*hint*/
      4 && L(
        p,
        /*hint*/
        y[2]
      ), C & /*rx, ry, shine*/
      56 && g !== (g = `--rx:${/*rx*/
      y[3]}deg; --ry:${/*ry*/
      y[4]}deg; --shine:${/*shine*/
      y[5]}%`) && c(e, "style", g);
    },
    i: D,
    o: D,
    d(y) {
      y && E(e), h = !1, fe(m);
    }
  };
}
function li(s, e, t) {
  let { title: l = "Pulso Focus" } = e, { value: i = "78%" } = e, { hint: o = "Calma sostenida" } = e, { intensity: r = 10 } = e, a = 0, f = 0, b = 0;
  const u = (p) => {
    const g = p.currentTarget.getBoundingClientRect(), h = (p.clientX - g.left) / g.width - 0.5, m = (p.clientY - g.top) / g.height - 0.5;
    t(3, a = m * r * -1), t(4, f = h * r), t(5, b = (h + m + 1) * 25);
  }, v = () => {
    t(3, a = 0), t(4, f = 0), t(5, b = 0);
  };
  return s.$$set = (p) => {
    "title" in p && t(0, l = p.title), "value" in p && t(1, i = p.value), "hint" in p && t(2, o = p.hint), "intensity" in p && t(8, r = p.intensity);
  }, [l, i, o, a, f, b, u, v, r];
}
class Ws extends ae {
  constructor(e) {
    super(), ne(
      this,
      e,
      li,
      si,
      K,
      {
        title: 0,
        value: 1,
        hint: 2,
        intensity: 8
      },
      ti
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
re(Ws, { title: {}, value: {}, hint: {}, intensity: {} }, [], [], !0);
function ii(s) {
  ie(s, "svelte-1czrcz8", '.counter.svelte-1czrcz8{border-radius:16px;border:1px solid #e2e8f0;padding:16px;background:#ffffff;display:grid;gap:10px;box-shadow:0 12px 22px rgba(15, 23, 42, 0.08)}.label.svelte-1czrcz8{margin:0;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.08em}.value.svelte-1czrcz8{font-size:32px;font-weight:700;color:#0f172a;position:relative;animation:svelte-1czrcz8-flip 0.5s ease}.value.svelte-1czrcz8::after{content:"";position:absolute;left:0;right:0;bottom:-4px;height:3px;border-radius:999px;background:var(--tone);animation:svelte-1czrcz8-sweep 0.6s ease}@keyframes svelte-1czrcz8-flip{0%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:translateY(0)}}@keyframes svelte-1czrcz8-sweep{from{transform:scaleX(0.2)}to{transform:scaleX(1)}}');
}
function vs(s) {
  let e, t;
  return {
    c() {
      e = d("div"), t = k(
        /*value*/
        s[1]
      ), c(e, "class", "value svelte-1czrcz8");
    },
    m(l, i) {
      $(l, e, i), n(e, t);
    },
    p(l, i) {
      i & /*value*/
      2 && L(
        t,
        /*value*/
        l[1]
      );
    },
    d(l) {
      l && E(e);
    }
  };
}
function ni(s) {
  let e, t, l, i, o = (
    /*value*/
    s[1]
  ), r, a = vs(s);
  return {
    c() {
      e = d("div"), t = d("p"), l = k(
        /*label*/
        s[0]
      ), i = x(), a.c(), c(t, "class", "label svelte-1czrcz8"), c(e, "class", "counter svelte-1czrcz8"), c(e, "style", r = `--tone:${/*tone*/
      s[2]}`);
    },
    m(f, b) {
      $(f, e, b), n(e, t), n(t, l), n(e, i), a.m(e, null);
    },
    p(f, [b]) {
      b & /*label*/
      1 && L(
        l,
        /*label*/
        f[0]
      ), b & /*value*/
      2 && K(o, o = /*value*/
      f[1]) ? (a.d(1), a = vs(f), a.c(), a.m(e, null)) : a.p(f, b), b & /*tone*/
      4 && r !== (r = `--tone:${/*tone*/
      f[2]}`) && c(e, "style", r);
    },
    i: D,
    o: D,
    d(f) {
      f && E(e), a.d(f);
    }
  };
}
function ri(s, e, t) {
  let { label: l = "Sesiones" } = e, { value: i = 12 } = e, { tone: o = "#10b981" } = e;
  return s.$$set = (r) => {
    "label" in r && t(0, l = r.label), "value" in r && t(1, i = r.value), "tone" in r && t(2, o = r.tone);
  }, [l, i, o];
}
class Zs extends ae {
  constructor(e) {
    super(), ne(this, e, ri, ni, K, { label: 0, value: 1, tone: 2 }, ii);
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
re(Zs, { label: {}, value: {}, tone: {} }, [], [], !0);
function ai(s) {
  ie(s, "svelte-pocpcm", ".stack.svelte-pocpcm{position:relative;height:160px;border-radius:18px;border:1px solid #e2e8f0;background:linear-gradient(140deg, #ffffff, #ecfdf5);overflow:hidden;transform:perspective(900px) rotateX(var(--rx)) rotateY(var(--ry));transition:transform 0.2s ease}.bg.svelte-pocpcm{position:absolute;inset:0;background:radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.15), transparent 60%)}.layer.svelte-pocpcm{position:absolute;border-radius:999px;filter:blur(calc(var(--blur) * 10px));opacity:0.75}.layer-a.svelte-pocpcm{width:120px;height:120px;background:rgba(16, 185, 129, 0.45);transform:translate(calc(var(--px) * 0.6), calc(var(--py) * 0.6));top:20px;left:14px}.layer-b.svelte-pocpcm{width:90px;height:90px;background:rgba(52, 211, 153, 0.5);transform:translate(calc(var(--px) * 1.2), calc(var(--py) * 1.2));bottom:18px;right:20px}.layer-c.svelte-pocpcm{width:70px;height:70px;background:rgba(14, 116, 144, 0.3);transform:translate(calc(var(--px) * 1.6), calc(var(--py) * 1.6));top:30px;right:70px}.label.svelte-pocpcm{position:absolute;left:16px;bottom:14px;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#0f172a;background:rgba(255, 255, 255, 0.7);padding:4px 8px;border-radius:999px}");
}
function oi(s) {
  let e, t, l, i, o, r, a, f, b, u, v, p, g, h;
  return {
    c() {
      e = d("div"), t = d("div"), l = x(), i = d("div"), o = x(), r = d("div"), a = x(), f = d("div"), b = x(), u = d("div"), v = k(
        /*title*/
        s[0]
      ), c(t, "class", "bg svelte-pocpcm"), c(i, "class", "layer layer-a svelte-pocpcm"), c(r, "class", "layer layer-b svelte-pocpcm"), c(f, "class", "layer layer-c svelte-pocpcm"), c(u, "class", "label svelte-pocpcm"), c(e, "class", "stack svelte-pocpcm"), c(e, "style", p = `--rx:${/*rx*/
      s[2]}deg; --ry:${/*ry*/
      s[3]}deg; --px:${/*px*/
      s[4]}px; --py:${/*py*/
      s[5]}px; --blur:${/*blurAmount*/
      s[1]}`);
    },
    m(m, y) {
      $(m, e, y), n(e, t), n(e, l), n(e, i), n(e, o), n(e, r), n(e, a), n(e, f), n(e, b), n(e, u), n(u, v), g || (h = [
        O(
          e,
          "pointermove",
          /*handleMove*/
          s[6]
        ),
        O(
          e,
          "pointerleave",
          /*reset*/
          s[7]
        )
      ], g = !0);
    },
    p(m, [y]) {
      y & /*title*/
      1 && L(
        v,
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
    i: D,
    o: D,
    d(m) {
      m && E(e), g = !1, fe(h);
    }
  };
}
function ci(s, e, t) {
  let { title: l = "Capas activas" } = e, { intensity: i = 18 } = e, { blurAmount: o = 0.6 } = e, r = 0, a = 0, f = 0, b = 0;
  const u = (p) => {
    const g = p.currentTarget.getBoundingClientRect(), h = (p.clientX - g.left) / g.width - 0.5, m = (p.clientY - g.top) / g.height - 0.5;
    t(2, r = m * i * -1), t(3, a = h * i), t(4, f = h * 24), t(5, b = m * 24);
  }, v = () => {
    t(2, r = 0), t(3, a = 0), t(4, f = 0), t(5, b = 0);
  };
  return s.$$set = (p) => {
    "title" in p && t(0, l = p.title), "intensity" in p && t(8, i = p.intensity), "blurAmount" in p && t(1, o = p.blurAmount);
  }, [l, o, r, a, f, b, u, v, i];
}
class el extends ae {
  constructor(e) {
    super(), ne(this, e, ci, oi, K, { title: 0, intensity: 8, blurAmount: 1 }, ai);
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
re(el, { title: {}, intensity: {}, blurAmount: {} }, [], [], !0);
function fi(s) {
  ie(s, "svelte-1yc0e5f", `:host{display:block;font-family:'Poppins', 'Manrope', 'Segoe UI', system-ui, sans-serif}.card-shell.svelte-1yc0e5f.svelte-1yc0e5f{position:relative;padding-bottom:18px}.card.svelte-1yc0e5f.svelte-1yc0e5f{position:relative;z-index:1;background:#ffffff;border-radius:16px;overflow:hidden;border:2px solid transparent;box-shadow:0 12px 24px rgba(15, 23, 42, 0.08);transition:transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;cursor:pointer}.card.svelte-1yc0e5f.svelte-1yc0e5f:hover{transform:translateY(-2px);box-shadow:0 18px 32px rgba(15, 23, 42, 0.12),
      0 0 0 2px color-mix(in srgb, var(--category-left) 55%, transparent),
      0 12px 24px color-mix(in srgb, var(--category-right) 35%, transparent)}.card.is-selected.svelte-1yc0e5f.svelte-1yc0e5f{border-color:#10b981;transform:scale(0.99)}.card.is-disabled.svelte-1yc0e5f.svelte-1yc0e5f{opacity:0.5;cursor:not-allowed;pointer-events:none}.thumb.svelte-1yc0e5f.svelte-1yc0e5f{position:relative;background:#f1f5f9;aspect-ratio:16 / 9;overflow:hidden}.thumb.svelte-1yc0e5f img.svelte-1yc0e5f{width:100%;height:100%;object-fit:cover;display:block}.thumb-placeholder.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;inset:0;display:grid;place-items:center;font-size:28px;color:#94a3b8}.thumb-overlay.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;inset:0;background:linear-gradient(180deg, rgba(15, 23, 42, 0) 50%, rgba(15, 23, 42, 0.55) 100%);opacity:0;transition:opacity 0.2s ease}.card.svelte-1yc0e5f:hover .thumb-overlay.svelte-1yc0e5f{opacity:1}.pill-row.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;top:8px;left:8px;display:flex;gap:6px}.pill.svelte-1yc0e5f.svelte-1yc0e5f{padding:4px 8px;border-radius:999px;background:rgba(15, 23, 42, 0.6);color:#ffffff;font-size:11px;font-weight:600}.pill.badge.svelte-1yc0e5f.svelte-1yc0e5f{background:rgba(15, 23, 42, 0.75);text-transform:uppercase;letter-spacing:0.5px}.favorite.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;top:8px;right:8px;border:none;background:rgba(15, 23, 42, 0.35);color:#ffffff;width:30px;height:30px;border-radius:999px;display:grid;place-items:center;cursor:pointer;transition:background 0.2s ease, transform 0.2s ease, color 0.2s ease}.favorite.svelte-1yc0e5f svg.svelte-1yc0e5f{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.6}.favorite.active.svelte-1yc0e5f.svelte-1yc0e5f{background:rgba(255, 255, 255, 0.9);color:#ef4444}.favorite.active.svelte-1yc0e5f svg.svelte-1yc0e5f{fill:currentColor;stroke:none}.favorite.svelte-1yc0e5f.svelte-1yc0e5f:hover{transform:scale(1.05)}.check.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;bottom:8px;left:8px;width:26px;height:26px;border-radius:999px;background:rgba(255, 255, 255, 0.9);border:1px solid #e2e8f0;display:grid;place-items:center;transition:background 0.2s ease, border-color 0.2s ease}.check.svelte-1yc0e5f svg.svelte-1yc0e5f{width:16px;height:16px;fill:#ffffff;opacity:0;transform:scale(0.7);transition:opacity 0.2s ease, transform 0.2s ease}.card.is-selected.svelte-1yc0e5f .check.svelte-1yc0e5f{background:#10b981;border-color:#059669}.card.is-selected.svelte-1yc0e5f .check svg.svelte-1yc0e5f{opacity:1;transform:scale(1)}.body.svelte-1yc0e5f.svelte-1yc0e5f{padding:16px;display:grid;gap:8px}.body.svelte-1yc0e5f h3.svelte-1yc0e5f{margin:0;font-size:15px;font-weight:700;color:#0f172a}.body.svelte-1yc0e5f p.svelte-1yc0e5f{margin:0;font-size:13px;color:#64748b;min-height:34px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.cta.svelte-1yc0e5f.svelte-1yc0e5f{padding:8px 10px;border-radius:10px;text-align:center;font-size:12px;font-weight:600;color:#64748b;background:#f1f5f9;transition:background 0.2s ease, color 0.2s ease}.card.svelte-1yc0e5f:hover .cta.svelte-1yc0e5f{background:#e2e8f0}.cta-selected.svelte-1yc0e5f.svelte-1yc0e5f{background:#d1fae5;color:#047857}.category-lift.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;left:16px;right:16px;bottom:-12px;display:flex;justify-content:center;gap:8px;z-index:0;pointer-events:none;transform:translateY(14px);opacity:0;transition:transform 0.25s ease, opacity 0.2s ease}.category-chip.svelte-1yc0e5f.svelte-1yc0e5f{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:0.4px;color:#ffffff;text-transform:uppercase;background:var(--chip-color);box-shadow:0 10px 20px color-mix(in srgb, var(--chip-color) 35%, transparent)}.card-shell.svelte-1yc0e5f:hover .category-lift.svelte-1yc0e5f,.card-shell.svelte-1yc0e5f:focus-within .category-lift.svelte-1yc0e5f{opacity:1;transform:translateY(0)}`);
}
function di(s) {
  let e;
  return {
    c() {
      e = d("div"), e.textContent = "▶", c(e, "class", "thumb-placeholder svelte-1yc0e5f");
    },
    m(t, l) {
      $(t, e, l);
    },
    p: D,
    d(t) {
      t && E(e);
    }
  };
}
function ui(s) {
  let e, t, l;
  return {
    c() {
      e = d("img"), es(e.src, t = /*thumbnail*/
      s[3]) || c(e, "src", t), c(e, "alt", l = `Miniatura de ${/*title*/
      s[0]}`), c(e, "loading", "lazy"), c(e, "class", "svelte-1yc0e5f");
    },
    m(i, o) {
      $(i, e, o);
    },
    p(i, o) {
      o & /*thumbnail*/
      8 && !es(e.src, t = /*thumbnail*/
      i[3]) && c(e, "src", t), o & /*title*/
      1 && l !== (l = `Miniatura de ${/*title*/
      i[0]}`) && c(e, "alt", l);
    },
    d(i) {
      i && E(e);
    }
  };
}
function gs(s) {
  let e, t;
  return {
    c() {
      e = d("div"), t = k(
        /*badge*/
        s[6]
      ), c(e, "class", "pill badge svelte-1yc0e5f");
    },
    m(l, i) {
      $(l, e, i), n(e, t);
    },
    p(l, i) {
      i & /*badge*/
      64 && L(
        t,
        /*badge*/
        l[6]
      );
    },
    d(l) {
      l && E(e);
    }
  };
}
function hs(s) {
  let e, t, l, i, o, r = (
    /*categoryRight*/
    s[9] && bs(s)
  );
  return {
    c() {
      e = d("div"), t = d("span"), l = k(
        /*categoryLeft*/
        s[8]
      ), o = x(), r && r.c(), c(t, "class", "category-chip svelte-1yc0e5f"), c(t, "style", i = `--chip-color: ${/*categoryLeftColor*/
      s[10]};`), c(e, "class", "category-lift svelte-1yc0e5f"), c(e, "aria-hidden", "true");
    },
    m(a, f) {
      $(a, e, f), n(e, t), n(t, l), n(e, o), r && r.m(e, null);
    },
    p(a, f) {
      f & /*categoryLeft*/
      256 && L(
        l,
        /*categoryLeft*/
        a[8]
      ), f & /*categoryLeftColor*/
      1024 && i !== (i = `--chip-color: ${/*categoryLeftColor*/
      a[10]};`) && c(t, "style", i), /*categoryRight*/
      a[9] ? r ? r.p(a, f) : (r = bs(a), r.c(), r.m(e, null)) : r && (r.d(1), r = null);
    },
    d(a) {
      a && E(e), r && r.d();
    }
  };
}
function bs(s) {
  let e, t, l;
  return {
    c() {
      e = d("span"), t = k(
        /*categoryRight*/
        s[9]
      ), c(e, "class", "category-chip svelte-1yc0e5f"), c(e, "style", l = `--chip-color: ${/*categoryRightColor*/
      s[11]};`);
    },
    m(i, o) {
      $(i, e, o), n(e, t);
    },
    p(i, o) {
      o & /*categoryRight*/
      512 && L(
        t,
        /*categoryRight*/
        i[9]
      ), o & /*categoryRightColor*/
      2048 && l !== (l = `--chip-color: ${/*categoryRightColor*/
      i[11]};`) && c(e, "style", l);
    },
    d(i) {
      i && E(e);
    }
  };
}
function pi(s) {
  let e, t, l, i, o, r, a, f, b, u, v, p, g, h, m, y, C, S, w, q, T, _, j, N, Y, R, U, B = (
    /*selected*/
    s[4] ? "Seleccionado" : "Seleccionar video"
  ), pe, ve, se, G, ce, Z, W, P;
  function X(I, F) {
    return (
      /*thumbnail*/
      I[3] ? ui : di
    );
  }
  let ge = X(s), ee = ge(s), Q = (
    /*badge*/
    s[6] && gs(s)
  ), H = (
    /*categoryLeft*/
    s[8] && hs(s)
  );
  return {
    c() {
      e = d("div"), t = d("div"), l = d("div"), ee.c(), i = x(), o = d("div"), r = x(), a = d("div"), f = d("div"), b = k(
        /*duration*/
        s[2]
      ), u = x(), Q && Q.c(), v = x(), p = d("button"), g = ss("svg"), h = ss("path"), C = x(), S = d("div"), S.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" class="svelte-1yc0e5f"><path d="M9.2 16.2L5.7 12.7l1.4-1.4 2.1 2.1 7.7-7.7 1.4 1.4z"></path></svg>', w = x(), q = d("div"), T = d("h3"), _ = k(
        /*title*/
        s[0]
      ), j = x(), N = d("p"), Y = k(
        /*description*/
        s[1]
      ), R = x(), U = d("div"), pe = k(B), ce = x(), H && H.c(), c(o, "class", "thumb-overlay svelte-1yc0e5f"), c(f, "class", "pill svelte-1yc0e5f"), c(a, "class", "pill-row svelte-1yc0e5f"), c(h, "d", "M12.1 21.2c-0.1 0-0.3 0-0.4-0.1C6.1 18.6 2 15 2 10.4 2 7.6 4.3 5.3 7.1 5.3c1.7 0 3.3 0.8 4.3 2.1 1-1.3 2.6-2.1 4.3-2.1 2.8 0 5.1 2.3 5.1 5.1 0 4.6-4.1 8.2-9.7 10.7-0.1 0-0.2 0.1-0.3 0.1z"), c(g, "viewBox", "0 0 24 24"), c(g, "aria-hidden", "true"), c(g, "class", "svelte-1yc0e5f"), c(p, "class", m = "favorite " + /*favorite*/
      (s[7] ? "active" : "") + " svelte-1yc0e5f"), c(p, "aria-label", y = /*favorite*/
      s[7] ? "Quitar de favoritos" : "Anadir a favoritos"), c(S, "class", "check svelte-1yc0e5f"), c(l, "class", "thumb svelte-1yc0e5f"), c(T, "class", "svelte-1yc0e5f"), c(N, "class", "svelte-1yc0e5f"), c(U, "class", ve = "cta " + /*selected*/
      (s[4] ? "cta-selected" : "") + " svelte-1yc0e5f"), c(q, "class", "body svelte-1yc0e5f"), c(t, "class", se = "card " + /*selected*/
      (s[4] ? "is-selected" : "") + " " + /*disabled*/
      (s[5] ? "is-disabled" : "") + " svelte-1yc0e5f"), c(t, "role", "button"), c(
        t,
        "aria-disabled",
        /*disabled*/
        s[5]
      ), c(t, "tabindex", G = /*disabled*/
      s[5] ? -1 : 0), c(e, "class", "card-shell svelte-1yc0e5f"), c(e, "style", Z = `--category-left: ${/*categoryLeftColor*/
      s[10]}; --category-right: ${/*categoryRightColor*/
      s[11]};`);
    },
    m(I, F) {
      $(I, e, F), n(e, t), n(t, l), ee.m(l, null), n(l, i), n(l, o), n(l, r), n(l, a), n(a, f), n(f, b), n(a, u), Q && Q.m(a, null), n(l, v), n(l, p), n(p, g), n(g, h), n(l, C), n(l, S), n(t, w), n(t, q), n(q, T), n(T, _), n(q, j), n(q, N), n(N, Y), n(q, R), n(q, U), n(U, pe), n(e, ce), H && H.m(e, null), W || (P = [
        O(
          p,
          "click",
          /*handleFavorite*/
          s[13]
        ),
        O(
          t,
          "click",
          /*handleSelect*/
          s[12]
        ),
        O(
          t,
          "keydown",
          /*handleKeyDown*/
          s[14]
        )
      ], W = !0);
    },
    p(I, [F]) {
      ge === (ge = X(I)) && ee ? ee.p(I, F) : (ee.d(1), ee = ge(I), ee && (ee.c(), ee.m(l, i))), F & /*duration*/
      4 && L(
        b,
        /*duration*/
        I[2]
      ), /*badge*/
      I[6] ? Q ? Q.p(I, F) : (Q = gs(I), Q.c(), Q.m(a, null)) : Q && (Q.d(1), Q = null), F & /*favorite*/
      128 && m !== (m = "favorite " + /*favorite*/
      (I[7] ? "active" : "") + " svelte-1yc0e5f") && c(p, "class", m), F & /*favorite*/
      128 && y !== (y = /*favorite*/
      I[7] ? "Quitar de favoritos" : "Anadir a favoritos") && c(p, "aria-label", y), F & /*title*/
      1 && L(
        _,
        /*title*/
        I[0]
      ), F & /*description*/
      2 && L(
        Y,
        /*description*/
        I[1]
      ), F & /*selected*/
      16 && B !== (B = /*selected*/
      I[4] ? "Seleccionado" : "Seleccionar video") && L(pe, B), F & /*selected*/
      16 && ve !== (ve = "cta " + /*selected*/
      (I[4] ? "cta-selected" : "") + " svelte-1yc0e5f") && c(U, "class", ve), F & /*selected, disabled*/
      48 && se !== (se = "card " + /*selected*/
      (I[4] ? "is-selected" : "") + " " + /*disabled*/
      (I[5] ? "is-disabled" : "") + " svelte-1yc0e5f") && c(t, "class", se), F & /*disabled*/
      32 && c(
        t,
        "aria-disabled",
        /*disabled*/
        I[5]
      ), F & /*disabled*/
      32 && G !== (G = /*disabled*/
      I[5] ? -1 : 0) && c(t, "tabindex", G), /*categoryLeft*/
      I[8] ? H ? H.p(I, F) : (H = hs(I), H.c(), H.m(e, null)) : H && (H.d(1), H = null), F & /*categoryLeftColor, categoryRightColor*/
      3072 && Z !== (Z = `--category-left: ${/*categoryLeftColor*/
      I[10]}; --category-right: ${/*categoryRightColor*/
      I[11]};`) && c(e, "style", Z);
    },
    i: D,
    o: D,
    d(I) {
      I && E(e), ee.d(), Q && Q.d(), H && H.d(), W = !1, fe(P);
    }
  };
}
function vi(s, e, t) {
  let { videoId: l = "" } = e, { hashedId: i = "" } = e, { title: o = "" } = e, { description: r = "" } = e, { duration: a = "" } = e, { thumbnail: f = "" } = e, { selected: b = !1 } = e, { disabled: u = !1 } = e, { badge: v = "" } = e, { tags: p = [] } = e, { favorite: g = !1 } = e, { categoryLeft: h = "" } = e, { categoryRight: m = "" } = e, { categoryLeftColor: y = "#94a3b8" } = e, { categoryRightColor: C = "#94a3b8" } = e;
  const S = qe(), w = () => {
    u || S("select", { id: l });
  }, q = (_) => {
    _.stopPropagation(), !u && S("favorite", { hashedId: i });
  }, T = (_) => {
    u || (_.key === "Enter" || _.key === " ") && (_.preventDefault(), w());
  };
  return s.$$set = (_) => {
    "videoId" in _ && t(15, l = _.videoId), "hashedId" in _ && t(16, i = _.hashedId), "title" in _ && t(0, o = _.title), "description" in _ && t(1, r = _.description), "duration" in _ && t(2, a = _.duration), "thumbnail" in _ && t(3, f = _.thumbnail), "selected" in _ && t(4, b = _.selected), "disabled" in _ && t(5, u = _.disabled), "badge" in _ && t(6, v = _.badge), "tags" in _ && t(17, p = _.tags), "favorite" in _ && t(7, g = _.favorite), "categoryLeft" in _ && t(8, h = _.categoryLeft), "categoryRight" in _ && t(9, m = _.categoryRight), "categoryLeftColor" in _ && t(10, y = _.categoryLeftColor), "categoryRightColor" in _ && t(11, C = _.categoryRightColor);
  }, [
    o,
    r,
    a,
    f,
    b,
    u,
    v,
    g,
    h,
    m,
    y,
    C,
    w,
    q,
    T,
    l,
    i,
    p
  ];
}
class tl extends ae {
  constructor(e) {
    super(), ne(
      this,
      e,
      vi,
      pi,
      K,
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
      fi
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
customElements.define("svelte-video-card", re(tl, { videoId: {}, hashedId: {}, title: {}, description: {}, duration: {}, thumbnail: {}, selected: { type: "Boolean" }, disabled: { type: "Boolean" }, badge: {}, tags: {}, favorite: { type: "Boolean" }, categoryLeft: {}, categoryRight: {}, categoryLeftColor: {}, categoryRightColor: {} }, [], [], !0));
function gi(s) {
  const e = s - 1;
  return e * e * e + 1;
}
function ms(s, { delay: e = 0, duration: t = 400, easing: l = $s } = {}) {
  const i = +getComputedStyle(s).opacity;
  return {
    delay: e,
    duration: t,
    easing: l,
    css: (o) => `opacity: ${o * i}`
  };
}
function Pe(s, { delay: e = 0, duration: t = 400, easing: l = gi, x: i = 0, y: o = 0, opacity: r = 0 } = {}) {
  const a = getComputedStyle(s), f = +a.opacity, b = a.transform === "none" ? "" : a.transform, u = f * (1 - r), [v, p] = ts(i), [g, h] = ts(o);
  return {
    delay: e,
    duration: t,
    easing: l,
    css: (m, y) => `
			transform: ${b} translate(${(1 - m) * v}${p}, ${(1 - m) * g}${h});
			opacity: ${f - u * y}`
  };
}
function hi(s) {
  ie(s, "svelte-1hb2737", `.overlay.svelte-1hb2737{position:fixed;inset:0;z-index:70;display:flex;align-items:center;justify-content:center;padding:24px;background:radial-gradient(circle at top, rgba(58, 132, 117, 0.2), rgba(0, 0, 0, 0.6));backdrop-filter:blur(6px)}.card.svelte-1hb2737{position:relative;width:min(520px, 92vw);padding:28px 26px 24px;border-radius:24px;background:linear-gradient(135deg, #ffffff 0%, #f4f6f0 100%);box-shadow:0 18px 40px rgba(0, 0, 0, 0.22),
      0 4px 18px rgba(50, 120, 102, 0.18);overflow:hidden}.card.svelte-1hb2737::before{content:"";position:absolute;inset:-1px;border-radius:24px;padding:1px;background:linear-gradient(130deg, rgba(43, 173, 145, 0.5), rgba(255, 255, 255, 0));-webkit-mask:linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none}.badge.svelte-1hb2737{display:inline-flex;align-items:center;padding:6px 12px;border-radius:999px;background:rgba(46, 140, 120, 0.12);color:#1f5f52;font-size:12px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase}h2.svelte-1hb2737{margin:14px 0 8px;font-size:22px;font-weight:700;color:#1f2a26}p.svelte-1hb2737{margin:0;font-size:14px;line-height:1.5;color:#4b5b56}.actions.svelte-1hb2737{margin-top:18px;display:flex;justify-content:flex-end}button.svelte-1hb2737{border:none;border-radius:12px;padding:10px 18px;font-size:14px;font-weight:600;color:#fff;background:linear-gradient(135deg, #2e8c78, #1f6d5e);box-shadow:0 10px 18px rgba(46, 140, 120, 0.28);cursor:pointer}button.svelte-1hb2737:hover{filter:brightness(1.05)}button.svelte-1hb2737:active{transform:translateY(1px)}@media(max-width: 480px){.card.svelte-1hb2737{padding:22px 20px}h2.svelte-1hb2737{font-size:20px}}`);
}
function ys(s) {
  let e, t, l, i, o, r, a, f, b, u, v, p, g, h, m, y, C, S;
  return {
    c() {
      e = d("div"), t = d("div"), l = d("div"), l.textContent = "Fin de temporada", i = x(), o = d("h2"), r = k(
        /*title*/
        s[1]
      ), a = x(), f = d("p"), b = k(
        /*message*/
        s[2]
      ), u = x(), v = d("div"), p = d("button"), g = k(
        /*cta*/
        s[3]
      ), c(l, "class", "badge svelte-1hb2737"), c(o, "class", "svelte-1hb2737"), c(f, "class", "svelte-1hb2737"), c(p, "type", "button"), c(p, "class", "svelte-1hb2737"), c(v, "class", "actions svelte-1hb2737"), c(t, "class", "card svelte-1hb2737"), c(e, "class", "overlay svelte-1hb2737"), c(e, "role", "button"), c(e, "tabindex", "0"), c(e, "aria-label", "Cerrar aviso de temporada");
    },
    m(w, q) {
      $(w, e, q), n(e, t), n(t, l), n(t, i), n(t, o), n(o, r), n(t, a), n(t, f), n(f, b), n(t, u), n(t, v), n(v, p), n(p, g), y = !0, C || (S = [
        O(
          p,
          "click",
          /*handleClose*/
          s[4]
        ),
        O(
          e,
          "click",
          /*handleBackdrop*/
          s[5]
        ),
        O(
          e,
          "keydown",
          /*handleKeydown*/
          s[6]
        )
      ], C = !0);
    },
    p(w, q) {
      (!y || q & /*title*/
      2) && L(
        r,
        /*title*/
        w[1]
      ), (!y || q & /*message*/
      4) && L(
        b,
        /*message*/
        w[2]
      ), (!y || q & /*cta*/
      8) && L(
        g,
        /*cta*/
        w[3]
      );
    },
    i(w) {
      y || (w && ze(() => {
        y && (h || (h = ke(t, Pe, { y: 18, duration: 240 }, !0)), h.run(1));
      }), w && ze(() => {
        y && (m || (m = ke(e, ms, { duration: 180 }, !0)), m.run(1));
      }), y = !0);
    },
    o(w) {
      w && (h || (h = ke(t, Pe, { y: 18, duration: 240 }, !1)), h.run(0)), w && (m || (m = ke(e, ms, { duration: 180 }, !1)), m.run(0)), y = !1;
    },
    d(w) {
      w && E(e), w && h && h.end(), w && m && m.end(), C = !1, fe(S);
    }
  };
}
function bi(s) {
  let e, t = (
    /*open*/
    s[0] && ys(s)
  );
  return {
    c() {
      t && t.c(), e = vt();
    },
    m(l, i) {
      t && t.m(l, i), $(l, e, i);
    },
    p(l, [i]) {
      /*open*/
      l[0] ? t ? (t.p(l, i), i & /*open*/
      1 && Re(t, 1)) : (t = ys(l), t.c(), Re(t, 1), t.m(e.parentNode, e)) : t && (Os(), St(t, 1, 1, () => {
        t = null;
      }), Rs());
    },
    i(l) {
      Re(t);
    },
    o(l) {
      St(t);
    },
    d(l) {
      l && E(e), t && t.d(l);
    }
  };
}
function mi(s, e, t) {
  let { open: l = !1 } = e, { title: i = "Temporada finalizada" } = e, { message: o = "La temporada actual ha terminado. Tus logros de temporada se reiniciaran para un nuevo ciclo." } = e, { cta: r = "Entendido" } = e;
  const a = qe(), f = () => {
    t(0, l = !1), a("dismiss");
  }, b = (v) => {
    v.target === v.currentTarget && f();
  }, u = (v) => {
    const p = v.key;
    (p === "Escape" || p === "Enter" || p === " ") && f();
  };
  return s.$$set = (v) => {
    "open" in v && t(0, l = v.open), "title" in v && t(1, i = v.title), "message" in v && t(2, o = v.message), "cta" in v && t(3, r = v.cta);
  }, [l, i, o, r, f, b, u];
}
class sl extends ae {
  constructor(e) {
    super(), ne(this, e, mi, bi, K, { open: 0, title: 1, message: 2, cta: 3 }, hi);
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
customElements.define("svelte-season-popup", re(sl, { open: { type: "Boolean" }, title: {}, message: {}, cta: {} }, [], [], !0));
function yi(s) {
  ie(s, "svelte-1f864m7", ':host{display:inline-block}.token.svelte-1f864m7{position:relative;height:40px;width:64px;border-radius:8px;border:1px solid #e5e7eb;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;line-height:1.1;font-family:inherit;overflow:visible;margin:0 4px}.time.svelte-1f864m7{font-weight:600;font-size:14px;color:inherit}.points.svelte-1f864m7{font-size:10px;opacity:0.8;margin-top:-2px}.points.expired.svelte-1f864m7{text-decoration:line-through}.completed.svelte-1f864m7{background:#8acc9f;color:#ffffff;border-color:#10b981}.open.svelte-1f864m7{background:#ecfdf5;color:#047857;border-color:#6ee7b7;box-shadow:0 4px 10px rgba(16, 185, 129, 0.12);transform:scale(1.2);transition:transform 0.2s ease;transform-origin:center;margin:0 10px}.open.svelte-1f864m7::before,.open.svelte-1f864m7::after,.open.svelte-1f864m7::backdrop{content:"";position:absolute;inset:-10px;border-radius:12px;border:1px solid rgba(16, 185, 129, 0.35);background:radial-gradient(circle, rgba(16, 185, 129, 0.35), rgba(16, 185, 129, 0));opacity:0;animation:svelte-1f864m7-pulse 1.35s ease-out infinite;pointer-events:none}.open.svelte-1f864m7::after{animation-delay:0.45s}.open.svelte-1f864m7::backdrop{animation-delay:0.9s}.expired.svelte-1f864m7{background:#fee2e2;color:#ef4444;border-color:#fca5a5}.upcoming.svelte-1f864m7{background:#f3f4f6;color:#6b7280;border-color:#e5e7eb}@media(min-width: 640px){.token.svelte-1f864m7{height:48px;width:80px;border-radius:10px}.time.svelte-1f864m7{font-size:15px}}@keyframes svelte-1f864m7-pulse{0%{transform:scale(0.85);opacity:0}20%{opacity:0.55}100%{transform:scale(1.4);opacity:0}}');
}
function xi(s) {
  let e, t = `+${/*points*/
  s[2]} ${/*unit*/
  s[3]}`, l;
  return {
    c() {
      e = d("div"), l = k(t), c(e, "class", "time svelte-1f864m7");
    },
    m(i, o) {
      $(i, e, o), n(e, l);
    },
    p(i, o) {
      o & /*points, unit*/
      12 && t !== (t = `+${/*points*/
      i[2]} ${/*unit*/
      i[3]}`) && L(l, t);
    },
    d(i) {
      i && E(e);
    }
  };
}
function _i(s) {
  let e, t, l, i, o, r, a, f, b;
  return {
    c() {
      e = d("div"), t = k(
        /*timeLabel*/
        s[1]
      ), l = x(), i = d("div"), o = k("+"), r = k(
        /*points*/
        s[2]
      ), a = x(), f = k(
        /*unit*/
        s[3]
      ), c(e, "class", "time svelte-1f864m7"), c(i, "class", b = "points " + /*status*/
      (s[0] === "expired" ? "expired" : "") + " svelte-1f864m7");
    },
    m(u, v) {
      $(u, e, v), n(e, t), $(u, l, v), $(u, i, v), n(i, o), n(i, r), n(i, a), n(i, f);
    },
    p(u, v) {
      v & /*timeLabel*/
      2 && L(
        t,
        /*timeLabel*/
        u[1]
      ), v & /*points*/
      4 && L(
        r,
        /*points*/
        u[2]
      ), v & /*unit*/
      8 && L(
        f,
        /*unit*/
        u[3]
      ), v & /*status*/
      1 && b !== (b = "points " + /*status*/
      (u[0] === "expired" ? "expired" : "") + " svelte-1f864m7") && c(i, "class", b);
    },
    d(u) {
      u && (E(e), E(l), E(i));
    }
  };
}
function wi(s) {
  let e, t;
  function l(r, a) {
    return (
      /*timeLabel*/
      r[1] ? _i : xi
    );
  }
  let i = l(s), o = i(s);
  return {
    c() {
      e = d("div"), o.c(), c(e, "class", t = "token " + /*label*/
      s[4](
        /*status*/
        s[0]
      ) + " svelte-1f864m7");
    },
    m(r, a) {
      $(r, e, a), o.m(e, null);
    },
    p(r, [a]) {
      i === (i = l(r)) && o ? o.p(r, a) : (o.d(1), o = i(r), o && (o.c(), o.m(e, null))), a & /*status*/
      1 && t !== (t = "token " + /*label*/
      r[4](
        /*status*/
        r[0]
      ) + " svelte-1f864m7") && c(e, "class", t);
    },
    i: D,
    o: D,
    d(r) {
      r && E(e), o.d();
    }
  };
}
function ki(s, e, t) {
  let { status: l = "upcoming" } = e, { timeLabel: i = "" } = e, { points: o = 20 } = e, { unit: r = "AP" } = e;
  const a = (f) => typeof f == "string" ? f : String(f ?? "");
  return s.$$set = (f) => {
    "status" in f && t(0, l = f.status), "timeLabel" in f && t(1, i = f.timeLabel), "points" in f && t(2, o = f.points), "unit" in f && t(3, r = f.unit);
  }, [l, i, o, r, a];
}
class ll extends ae {
  constructor(e) {
    super(), ne(
      this,
      e,
      ki,
      wi,
      K,
      {
        status: 0,
        timeLabel: 1,
        points: 2,
        unit: 3
      },
      yi
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
customElements.define("svelte-quota-token", re(ll, { status: {}, timeLabel: {}, points: {}, unit: {} }, [], [], !0));
function zi(s) {
  ie(s, "svelte-p2zlwf", ":host{display:block;font-family:inherit}.panel.svelte-p2zlwf.svelte-p2zlwf{display:grid;gap:18px;animation:svelte-p2zlwf-panel-rise 0.4s ease}.hero.svelte-p2zlwf.svelte-p2zlwf{position:relative;border-radius:22px;padding:18px 20px;background:linear-gradient(130deg, #f8fafc, #ecfdf5);border:1px solid #e2e8f0;display:grid;gap:14px;overflow:hidden}.hero-cards.svelte-p2zlwf.svelte-p2zlwf{display:grid;grid-template-columns:repeat(auto-fit, minmax(160px, 1fr));gap:10px}.hero-card.svelte-p2zlwf.svelte-p2zlwf{border-radius:16px;padding:10px 12px;background:rgba(255, 255, 255, 0.8);border:1px solid rgba(226, 232, 240, 0.9);display:grid;gap:4px}.hero-card.accent.svelte-p2zlwf.svelte-p2zlwf{background:linear-gradient(120deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.08));border-color:rgba(16, 185, 129, 0.4)}.orb.svelte-p2zlwf.svelte-p2zlwf{position:absolute;right:18px;top:-10px;width:120px;height:120px;border-radius:999px;background:radial-gradient(circle, rgba(16, 185, 129, 0.22), transparent 65%);animation:svelte-p2zlwf-float 6s ease-in-out infinite}.orb.small.svelte-p2zlwf.svelte-p2zlwf{right:120px;top:60px;width:72px;height:72px;animation-delay:1.4s;opacity:0.7}.eyebrow.svelte-p2zlwf.svelte-p2zlwf{text-transform:uppercase;font-size:11px;letter-spacing:0.12em;color:#94a3b8;margin:0 0 6px}h1.svelte-p2zlwf.svelte-p2zlwf{margin:0;font-size:22px;font-weight:700;color:#0f172a}.email.svelte-p2zlwf.svelte-p2zlwf{margin:4px 0 0;color:#64748b;font-size:13px}.grid.svelte-p2zlwf.svelte-p2zlwf{display:grid;gap:12px;grid-template-columns:repeat(auto-fit, minmax(160px, 1fr))}.grid.two.svelte-p2zlwf.svelte-p2zlwf{grid-template-columns:repeat(auto-fit, minmax(220px, 1fr))}.card.svelte-p2zlwf.svelte-p2zlwf{background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;padding:12px 14px;display:grid;gap:6px;position:relative;overflow:hidden}.card.svelte-p2zlwf span.svelte-p2zlwf{font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#94a3b8}.card.svelte-p2zlwf strong.svelte-p2zlwf{font-size:20px;color:#0f172a}.section.svelte-p2zlwf.svelte-p2zlwf{background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;padding:16px;position:relative}.xp.svelte-p2zlwf.svelte-p2zlwf{overflow:hidden}.xp-toggle.svelte-p2zlwf.svelte-p2zlwf{width:100%;border:none;background:transparent;display:flex;align-items:center;justify-content:space-between;gap:12px;cursor:pointer;padding:0;margin-bottom:10px}.xp-toggle.svelte-p2zlwf h2.svelte-p2zlwf{margin:0}.xp-toggle.svelte-p2zlwf span.svelte-p2zlwf{display:inline-flex;align-items:center;justify-content:center;height:28px;width:28px;border-radius:999px;background:#ecfdf5;color:#10b981;transition:transform 0.2s ease;font-weight:700}.xp-toggle.svelte-p2zlwf span.rotated.svelte-p2zlwf{transform:rotate(180deg)}.xp-controls.svelte-p2zlwf.svelte-p2zlwf{display:grid;grid-template-columns:repeat(auto-fit, minmax(140px, 1fr));gap:8px;margin-bottom:10px}.xp-controls.svelte-p2zlwf label.svelte-p2zlwf{display:grid;gap:4px;font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em}.xp-controls.svelte-p2zlwf input.svelte-p2zlwf{border:1px solid #e2e8f0;border-radius:10px;padding:6px 8px;font-size:12px;color:#0f172a;background:#fff}.xp-controls.svelte-p2zlwf .ghost.svelte-p2zlwf,.xp-controls.svelte-p2zlwf .apply.svelte-p2zlwf,.xp-footer.svelte-p2zlwf .apply.svelte-p2zlwf{border:none;border-radius:10px;padding:8px 10px;font-size:12px;font-weight:600;cursor:pointer}.xp-controls.svelte-p2zlwf .ghost.svelte-p2zlwf{background:#f1f5f9;color:#334155}.xp-controls.svelte-p2zlwf .apply.svelte-p2zlwf,.xp-footer.svelte-p2zlwf .apply.svelte-p2zlwf{background:#10b981;color:#fff}.xp-footer.svelte-p2zlwf.svelte-p2zlwf{display:flex;align-items:center;justify-content:space-between;margin-top:8px}.section.svelte-p2zlwf h2.svelte-p2zlwf{margin:0 0 10px;font-size:15px;font-weight:700;color:#0f172a}.row.svelte-p2zlwf.svelte-p2zlwf{display:flex;justify-content:space-between;align-items:center}.days.svelte-p2zlwf.svelte-p2zlwf{display:flex;flex-wrap:wrap;gap:8px}.days.svelte-p2zlwf span.svelte-p2zlwf{height:36px;width:36px;border-radius:999px;display:grid;place-items:center;font-size:12px;font-weight:700;background:#f1f5f9;color:#94a3b8}.days.svelte-p2zlwf span.active.svelte-p2zlwf{background:#10b981;color:#ffffff}.list.svelte-p2zlwf.svelte-p2zlwf{display:grid;gap:8px}.list-item.svelte-p2zlwf.svelte-p2zlwf{display:flex;justify-content:space-between;align-items:center;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:8px 12px;font-size:12px;color:#334155}.list-item.svelte-p2zlwf .timestamp.svelte-p2zlwf{display:block;font-size:11px;color:#94a3b8;margin-top:2px}.accent.svelte-p2zlwf.svelte-p2zlwf{color:#10b981;font-weight:700}.line.svelte-p2zlwf.svelte-p2zlwf{display:flex;justify-content:space-between;font-size:13px;color:#334155;padding:4px 0}.muted.svelte-p2zlwf.svelte-p2zlwf{color:#94a3b8;font-size:13px}ul.svelte-p2zlwf.svelte-p2zlwf{margin:0;padding-left:18px;color:#475569;display:grid;gap:6px;font-size:13px}@keyframes svelte-p2zlwf-panel-rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}@keyframes svelte-p2zlwf-float{0%,100%{transform:translateY(0)}50%{transform:translateY(12px)}}");
}
function xs(s, e, t) {
  const l = s.slice();
  return l[41] = e[t], l;
}
function _s(s, e, t) {
  const l = s.slice();
  return l[44] = e[t], l;
}
function ws(s, e, t) {
  const l = s.slice();
  return l[47] = e[t], l;
}
function ks(s, e, t) {
  const l = s.slice();
  return l[50] = e[t], l;
}
function zs(s, e, t) {
  const l = s.slice();
  return l[53] = e[t], l[55] = t, l;
}
function qs(s) {
  let e, t;
  return {
    c() {
      e = d("p"), t = k(
        /*email*/
        s[1]
      ), c(e, "class", "email svelte-p2zlwf");
    },
    m(l, i) {
      $(l, e, i), n(e, t);
    },
    p(l, i) {
      i[0] & /*email*/
      2 && L(
        t,
        /*email*/
        l[1]
      );
    },
    d(l) {
      l && E(e);
    }
  };
}
function Cs(s) {
  let e;
  return {
    c() {
      e = d("span"), e.textContent = `${/*label*/
      s[53]}`, c(e, "class", "svelte-p2zlwf"), dt(
        e,
        "active",
        /*activeDays*/
        s[13].includes(
          /*index*/
          s[55] + 1
        )
      );
    },
    m(t, l) {
      $(t, e, l);
    },
    p(t, l) {
      l[0] & /*activeDays*/
      8192 && dt(
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
      t && E(e);
    }
  };
}
function Ss(s) {
  let e, t, l, i, o, r, a, f, b, u, v, p, g, h, m, y, C, S;
  const w = [Ci, qi], q = [];
  function T(_, j) {
    return (
      /*xpItems*/
      _[3].length === 0 ? 0 : 1
    );
  }
  return h = T(s), m = q[h] = w[h](s), {
    c() {
      e = d("div"), t = d("label"), l = k(`Desde
          `), i = d("input"), o = x(), r = d("label"), a = k(`Hasta
          `), f = d("input"), b = x(), u = d("button"), u.textContent = "Limpiar", v = x(), p = d("button"), p.textContent = "Aplicar", g = x(), m.c(), y = vt(), c(i, "type", "date"), c(i, "class", "svelte-p2zlwf"), c(t, "class", "svelte-p2zlwf"), c(f, "type", "date"), c(f, "class", "svelte-p2zlwf"), c(r, "class", "svelte-p2zlwf"), c(u, "type", "button"), c(u, "class", "ghost svelte-p2zlwf"), c(p, "type", "button"), c(p, "class", "apply svelte-p2zlwf"), c(e, "class", "xp-controls svelte-p2zlwf");
    },
    m(_, j) {
      $(_, e, j), n(e, t), n(t, l), n(t, i), at(
        i,
        /*filterFrom*/
        s[6]
      ), n(e, o), n(e, r), n(r, a), n(r, f), at(
        f,
        /*filterTo*/
        s[7]
      ), n(e, b), n(e, u), n(e, v), n(e, p), $(_, g, j), q[h].m(_, j), $(_, y, j), C || (S = [
        O(
          i,
          "input",
          /*input0_input_handler*/
          s[35]
        ),
        O(
          f,
          "input",
          /*input1_input_handler*/
          s[36]
        ),
        O(u, "click", qt(
          /*click_handler_1*/
          s[37]
        )),
        O(p, "click", qt(
          /*click_handler_2*/
          s[38]
        ))
      ], C = !0);
    },
    p(_, j) {
      j[0] & /*filterFrom*/
      64 && at(
        i,
        /*filterFrom*/
        _[6]
      ), j[0] & /*filterTo*/
      128 && at(
        f,
        /*filterTo*/
        _[7]
      );
      let N = h;
      h = T(_), h === N ? q[h].p(_, j) : (Os(), St(q[N], 1, 1, () => {
        q[N] = null;
      }), Rs(), m = q[h], m ? m.p(_, j) : (m = q[h] = w[h](_), m.c()), Re(m, 1), m.m(y.parentNode, y));
    },
    d(_) {
      _ && (E(e), E(g), E(y)), q[h].d(_), C = !1, fe(S);
    }
  };
}
function qi(s) {
  let e, t, l, i, o, r, a, f, b, u, v, p = le(
    /*xpItems*/
    s[3]
  ), g = [];
  for (let m = 0; m < p.length; m += 1)
    g[m] = js(ks(s, p, m));
  let h = (
    /*shownCount*/
    s[8] < /*totalCount*/
    s[2] && Ls(s)
  );
  return {
    c() {
      e = d("div");
      for (let m = 0; m < g.length; m += 1)
        g[m].c();
      l = x(), i = d("div"), o = d("span"), r = k("Mostrando "), a = k(
        /*shownCount*/
        s[8]
      ), f = k(" de "), b = k(
        /*totalCount*/
        s[2]
      ), u = x(), h && h.c(), c(e, "class", "list svelte-p2zlwf"), c(o, "class", "muted svelte-p2zlwf"), c(i, "class", "xp-footer svelte-p2zlwf");
    },
    m(m, y) {
      $(m, e, y);
      for (let C = 0; C < g.length; C += 1)
        g[C] && g[C].m(e, null);
      $(m, l, y), $(m, i, y), n(i, o), n(o, r), n(o, a), n(o, f), n(o, b), n(i, u), h && h.m(i, null), v = !0;
    },
    p(m, y) {
      if (y[0] & /*xpItems, formatTimestamp, getXpLabel*/
      393224) {
        p = le(
          /*xpItems*/
          m[3]
        );
        let C;
        for (C = 0; C < p.length; C += 1) {
          const S = ks(m, p, C);
          g[C] ? g[C].p(S, y) : (g[C] = js(S), g[C].c(), g[C].m(e, null));
        }
        for (; C < g.length; C += 1)
          g[C].d(1);
        g.length = p.length;
      }
      (!v || y[0] & /*shownCount*/
      256) && L(
        a,
        /*shownCount*/
        m[8]
      ), (!v || y[0] & /*totalCount*/
      4) && L(
        b,
        /*totalCount*/
        m[2]
      ), /*shownCount*/
      m[8] < /*totalCount*/
      m[2] ? h ? h.p(m, y) : (h = Ls(m), h.c(), h.m(i, null)) : h && (h.d(1), h = null);
    },
    i(m) {
      v || (m && ze(() => {
        v && (t || (t = ke(e, Pe, { y: 6, duration: 180 }, !0)), t.run(1));
      }), v = !0);
    },
    o(m) {
      m && (t || (t = ke(e, Pe, { y: 6, duration: 180 }, !1)), t.run(0)), v = !1;
    },
    d(m) {
      m && (E(e), E(l), E(i)), Qe(g, m), m && t && t.end(), h && h.d();
    }
  };
}
function Ci(s) {
  let e, t, l;
  return {
    c() {
      e = d("p"), e.textContent = "Sin movimientos recientes.", c(e, "class", "muted svelte-p2zlwf");
    },
    m(i, o) {
      $(i, e, o), l = !0;
    },
    p: D,
    i(i) {
      l || (i && ze(() => {
        l && (t || (t = ke(e, Pe, { y: 6, duration: 180 }, !0)), t.run(1));
      }), l = !0);
    },
    o(i) {
      i && (t || (t = ke(e, Pe, { y: 6, duration: 180 }, !1)), t.run(0)), l = !1;
    },
    d(i) {
      i && E(e), i && t && t.end();
    }
  };
}
function js(s) {
  var C, S;
  let e, t, l, i = (
    /*getXpLabel*/
    s[17](
      /*entry*/
      s[50]
    ) + ""
  ), o, r, a, f = (
    /*formatTimestamp*/
    s[18](
      /*entry*/
      (C = s[50]) == null ? void 0 : C.created_at
    ) + ""
  ), b, u, v, p, g = (
    /*entry*/
    (((S = s[50]) == null ? void 0 : S.points) ?? 0) + ""
  ), h, m, y;
  return {
    c() {
      e = d("div"), t = d("div"), l = d("span"), o = k(i), r = x(), a = d("span"), b = k(f), u = x(), v = d("span"), p = k("+"), h = k(g), m = k(" PA"), y = x(), c(a, "class", "timestamp svelte-p2zlwf"), c(v, "class", "accent svelte-p2zlwf"), c(e, "class", "list-item svelte-p2zlwf");
    },
    m(w, q) {
      $(w, e, q), n(e, t), n(t, l), n(l, o), n(t, r), n(t, a), n(a, b), n(e, u), n(e, v), n(v, p), n(v, h), n(v, m), n(e, y);
    },
    p(w, q) {
      var T, _;
      q[0] & /*xpItems*/
      8 && i !== (i = /*getXpLabel*/
      w[17](
        /*entry*/
        w[50]
      ) + "") && L(o, i), q[0] & /*xpItems*/
      8 && f !== (f = /*formatTimestamp*/
      w[18](
        /*entry*/
        (T = w[50]) == null ? void 0 : T.created_at
      ) + "") && L(b, f), q[0] & /*xpItems*/
      8 && g !== (g = /*entry*/
      (((_ = w[50]) == null ? void 0 : _.points) ?? 0) + "") && L(h, g);
    },
    d(w) {
      w && E(e);
    }
  };
}
function Ls(s) {
  let e, t, l;
  return {
    c() {
      e = d("button"), e.textContent = "Ver más", c(e, "type", "button"), c(e, "class", "apply svelte-p2zlwf");
    },
    m(i, o) {
      $(i, e, o), t || (l = O(e, "click", qt(
        /*click_handler_3*/
        s[39]
      )), t = !0);
    },
    p: D,
    d(i) {
      i && E(e), t = !1, l();
    }
  };
}
function Si(s) {
  let e, t = le(
    /*categories*/
    s[12].slice(0, 8)
  ), l = [];
  for (let i = 0; i < t.length; i += 1)
    l[i] = Ts(ws(s, t, i));
  return {
    c() {
      for (let i = 0; i < l.length; i += 1)
        l[i].c();
      e = vt();
    },
    m(i, o) {
      for (let r = 0; r < l.length; r += 1)
        l[r] && l[r].m(i, o);
      $(i, e, o);
    },
    p(i, o) {
      if (o[0] & /*categories*/
      4096) {
        t = le(
          /*categories*/
          i[12].slice(0, 8)
        );
        let r;
        for (r = 0; r < t.length; r += 1) {
          const a = ws(i, t, r);
          l[r] ? l[r].p(a, o) : (l[r] = Ts(a), l[r].c(), l[r].m(e.parentNode, e));
        }
        for (; r < l.length; r += 1)
          l[r].d(1);
        l.length = t.length;
      }
    },
    d(i) {
      i && E(e), Qe(l, i);
    }
  };
}
function ji(s) {
  let e;
  return {
    c() {
      e = d("p"), e.textContent = "Sin actividad registrada.", c(e, "class", "muted svelte-p2zlwf");
    },
    m(t, l) {
      $(t, e, l);
    },
    p: D,
    d(t) {
      t && E(e);
    }
  };
}
function Ts(s) {
  let e, t, l = (
    /*cat*/
    s[47].category + ""
  ), i, o, r, a = (
    /*cat*/
    s[47].total_sessions + ""
  ), f, b;
  return {
    c() {
      e = d("div"), t = d("span"), i = k(l), o = x(), r = d("strong"), f = k(a), b = x(), c(t, "class", "svelte-p2zlwf"), c(r, "class", "svelte-p2zlwf"), c(e, "class", "line svelte-p2zlwf");
    },
    m(u, v) {
      $(u, e, v), n(e, t), n(t, i), n(e, o), n(e, r), n(r, f), n(e, b);
    },
    p(u, v) {
      v[0] & /*categories*/
      4096 && l !== (l = /*cat*/
      u[47].category + "") && L(i, l), v[0] & /*categories*/
      4096 && a !== (a = /*cat*/
      u[47].total_sessions + "") && L(f, a);
    },
    d(u) {
      u && E(e);
    }
  };
}
function Li(s) {
  let e, t = le(
    /*favorites*/
    s[11].slice(0, 8)
  ), l = [];
  for (let i = 0; i < t.length; i += 1)
    l[i] = Es(_s(s, t, i));
  return {
    c() {
      for (let i = 0; i < l.length; i += 1)
        l[i].c();
      e = vt();
    },
    m(i, o) {
      for (let r = 0; r < l.length; r += 1)
        l[r] && l[r].m(i, o);
      $(i, e, o);
    },
    p(i, o) {
      if (o[0] & /*favorites*/
      2048) {
        t = le(
          /*favorites*/
          i[11].slice(0, 8)
        );
        let r;
        for (r = 0; r < t.length; r += 1) {
          const a = _s(i, t, r);
          l[r] ? l[r].p(a, o) : (l[r] = Es(a), l[r].c(), l[r].m(e.parentNode, e));
        }
        for (; r < l.length; r += 1)
          l[r].d(1);
        l.length = t.length;
      }
    },
    d(i) {
      i && E(e), Qe(l, i);
    }
  };
}
function Ti(s) {
  let e;
  return {
    c() {
      e = d("p"), e.textContent = "Aún no hay ejercicios destacados.", c(e, "class", "muted svelte-p2zlwf");
    },
    m(t, l) {
      $(t, e, l);
    },
    p: D,
    d(t) {
      t && E(e);
    }
  };
}
function Es(s) {
  let e, t, l = (
    /*fav*/
    s[44].title + ""
  ), i, o, r, a = (
    /*fav*/
    s[44].total_sessions + ""
  ), f, b, u;
  return {
    c() {
      e = d("div"), t = d("span"), i = k(l), o = x(), r = d("strong"), f = k(a), b = k("x"), u = x(), c(t, "class", "svelte-p2zlwf"), c(r, "class", "svelte-p2zlwf"), c(e, "class", "line svelte-p2zlwf");
    },
    m(v, p) {
      $(v, e, p), n(e, t), n(t, i), n(e, o), n(e, r), n(r, f), n(r, b), n(e, u);
    },
    p(v, p) {
      p[0] & /*favorites*/
      2048 && l !== (l = /*fav*/
      v[44].title + "") && L(i, l), p[0] & /*favorites*/
      2048 && a !== (a = /*fav*/
      v[44].total_sessions + "") && L(f, a);
    },
    d(v) {
      v && E(e);
    }
  };
}
function Ei(s) {
  let e, t = le(
    /*insightItems*/
    s[10]
  ), l = [];
  for (let i = 0; i < t.length; i += 1)
    l[i] = Ms(xs(s, t, i));
  return {
    c() {
      e = d("ul");
      for (let i = 0; i < l.length; i += 1)
        l[i].c();
      c(e, "class", "svelte-p2zlwf");
    },
    m(i, o) {
      $(i, e, o);
      for (let r = 0; r < l.length; r += 1)
        l[r] && l[r].m(e, null);
    },
    p(i, o) {
      if (o[0] & /*insightItems*/
      1024) {
        t = le(
          /*insightItems*/
          i[10]
        );
        let r;
        for (r = 0; r < t.length; r += 1) {
          const a = xs(i, t, r);
          l[r] ? l[r].p(a, o) : (l[r] = Ms(a), l[r].c(), l[r].m(e, null));
        }
        for (; r < l.length; r += 1)
          l[r].d(1);
        l.length = t.length;
      }
    },
    d(i) {
      i && E(e), Qe(l, i);
    }
  };
}
function Mi(s) {
  let e;
  return {
    c() {
      e = d("p"), e.textContent = "Sin insights por ahora.", c(e, "class", "muted svelte-p2zlwf");
    },
    m(t, l) {
      $(t, e, l);
    },
    p: D,
    d(t) {
      t && E(e);
    }
  };
}
function Ms(s) {
  let e, t = (
    /*item*/
    s[41] + ""
  ), l;
  return {
    c() {
      e = d("li"), l = k(t);
    },
    m(i, o) {
      $(i, e, o), n(e, l);
    },
    p(i, o) {
      o[0] & /*insightItems*/
      1024 && t !== (t = /*item*/
      i[41] + "") && L(l, t);
    },
    d(i) {
      i && E(e);
    }
  };
}
function $i(s) {
  let e, t, l, i, o, r, a, f, b, u, v, p, g, h, m = (
    /*summaryData*/
    s[15].total_exercises + ""
  ), y, C, S, w, q, T, _ = (
    /*summaryData*/
    s[15].weekly_sessions + ""
  ), j, N, Y, R, U, B, pe = Number(
    /*summaryData*/
    s[15].avg_satisfaction || 0
  ).toFixed(1) + "", ve, se, G, ce, Z, W, P, X, ge, ee, Q, H, I = (
    /*summaryData*/
    s[15].distinct_days + ""
  ), F, M, J, Ce, Fe, Se, Ke = (
    /*formatMinutes*/
    s[16](
      /*timeData*/
      s[14].week_minutes
    ) + ""
  ), gt, $t, Me, Ge, At, We, Ze = (
    /*formatMinutes*/
    s[16](
      /*timeData*/
      s[14].month_minutes
    ) + ""
  ), ht, Nt, $e, Ae, et, Dt, Be, tt = (
    /*activeDays*/
    s[13].length + ""
  ), bt, Yt, It, He, Xt, je, we, mt, Ot, Ne, Rt, Pt, De, Le, yt, Ft, Bt, Te, xt, Ht, Vt, Ee, st, Ut, _t, Jt, de = (
    /*email*/
    s[1] && qs(s)
  ), wt = le(["L", "M", "X", "J", "V", "S", "D"]), be = [];
  for (let A = 0; A < 7; A += 1)
    be[A] = Cs(zs(s, wt, A));
  let ue = (
    /*xpOpen*/
    s[5] && Ss(s)
  );
  function Qt(A, V) {
    return (
      /*categories*/
      A[12].length === 0 ? ji : Si
    );
  }
  let lt = Qt(s), me = lt(s);
  function Kt(A, V) {
    return (
      /*favorites*/
      A[11].length === 0 ? Ti : Li
    );
  }
  let it = Kt(s), ye = it(s);
  function Gt(A, V) {
    return (
      /*insightItems*/
      A[10].length === 0 ? Mi : Ei
    );
  }
  let nt = Gt(s), xe = nt(s);
  return {
    c() {
      e = d("div"), t = d("section"), l = d("div"), i = d("p"), i.textContent = "Estadísticas avanzadas", o = x(), r = d("h1"), a = k(
        /*name*/
        s[0]
      ), f = x(), de && de.c(), b = x(), u = d("div"), v = d("div"), p = d("span"), p.textContent = "Total de pausas", g = x(), h = d("strong"), y = k(m), C = x(), S = d("div"), w = d("span"), w.textContent = "Sesiones esta semana", q = x(), T = d("strong"), j = k(_), N = x(), Y = d("div"), R = d("span"), R.textContent = "Satisfacción promedio", U = x(), B = d("strong"), ve = k(pe), se = k(" / 5"), G = x(), ce = d("div"), Z = x(), W = d("div"), P = x(), X = d("section"), ge = d("div"), ee = d("span"), ee.textContent = "Días activos", Q = x(), H = d("strong"), F = k(I), M = x(), J = d("div"), Ce = d("span"), Ce.textContent = "Tiempo saludable (7 días)", Fe = x(), Se = d("strong"), gt = k(Ke), $t = x(), Me = d("div"), Ge = d("span"), Ge.textContent = "Tiempo saludable (30 días)", At = x(), We = d("strong"), ht = k(Ze), Nt = x(), $e = d("section"), Ae = d("div"), et = d("h2"), et.textContent = "Actividad semanal", Dt = x(), Be = d("span"), bt = k(tt), Yt = k("/7 días activos"), It = x(), He = d("div");
      for (let A = 0; A < 7; A += 1)
        be[A].c();
      Xt = x(), je = d("section"), we = d("button"), mt = d("div"), mt.innerHTML = '<h2 class="svelte-p2zlwf">Historial de XP</h2> <p class="muted svelte-p2zlwf">Últimos movimientos</p>', Ot = x(), Ne = d("span"), Ne.textContent = "⌄", Rt = x(), ue && ue.c(), Pt = x(), De = d("section"), Le = d("div"), yt = d("h3"), yt.textContent = "Categorías favoritas", Ft = x(), me.c(), Bt = x(), Te = d("div"), xt = d("h3"), xt.textContent = "Ejercicios más repetidos", Ht = x(), ye.c(), Vt = x(), Ee = d("section"), st = d("h2"), st.textContent = "Insights", Ut = x(), xe.c(), c(i, "class", "eyebrow svelte-p2zlwf"), c(r, "class", "svelte-p2zlwf"), c(v, "class", "hero-card svelte-p2zlwf"), c(S, "class", "hero-card accent svelte-p2zlwf"), c(Y, "class", "hero-card svelte-p2zlwf"), c(u, "class", "hero-cards svelte-p2zlwf"), c(ce, "class", "orb svelte-p2zlwf"), c(W, "class", "orb small svelte-p2zlwf"), c(t, "class", "hero svelte-p2zlwf"), c(ee, "class", "svelte-p2zlwf"), c(H, "class", "svelte-p2zlwf"), c(ge, "class", "card svelte-p2zlwf"), c(Ce, "class", "svelte-p2zlwf"), c(Se, "class", "svelte-p2zlwf"), c(J, "class", "card svelte-p2zlwf"), c(Ge, "class", "svelte-p2zlwf"), c(We, "class", "svelte-p2zlwf"), c(Me, "class", "card svelte-p2zlwf"), c(X, "class", "grid svelte-p2zlwf"), c(et, "class", "svelte-p2zlwf"), c(Be, "class", "muted svelte-p2zlwf"), c(Ae, "class", "row svelte-p2zlwf"), c(He, "class", "days svelte-p2zlwf"), c($e, "class", "section svelte-p2zlwf"), c(Ne, "class", "svelte-p2zlwf"), dt(
        Ne,
        "rotated",
        /*xpOpen*/
        s[5]
      ), c(we, "type", "button"), c(we, "class", "xp-toggle svelte-p2zlwf"), c(je, "class", "section xp svelte-p2zlwf"), c(Le, "class", "card svelte-p2zlwf"), c(Te, "class", "card svelte-p2zlwf"), c(De, "class", "grid two svelte-p2zlwf"), c(st, "class", "svelte-p2zlwf"), c(Ee, "class", "section svelte-p2zlwf"), c(e, "class", "panel svelte-p2zlwf");
    },
    m(A, V) {
      $(A, e, V), n(e, t), n(t, l), n(l, i), n(l, o), n(l, r), n(r, a), n(l, f), de && de.m(l, null), n(t, b), n(t, u), n(u, v), n(v, p), n(v, g), n(v, h), n(h, y), n(u, C), n(u, S), n(S, w), n(S, q), n(S, T), n(T, j), n(u, N), n(u, Y), n(Y, R), n(Y, U), n(Y, B), n(B, ve), n(B, se), n(t, G), n(t, ce), n(t, Z), n(t, W), n(e, P), n(e, X), n(X, ge), n(ge, ee), n(ge, Q), n(ge, H), n(H, F), n(X, M), n(X, J), n(J, Ce), n(J, Fe), n(J, Se), n(Se, gt), n(X, $t), n(X, Me), n(Me, Ge), n(Me, At), n(Me, We), n(We, ht), n(e, Nt), n(e, $e), n($e, Ae), n(Ae, et), n(Ae, Dt), n(Ae, Be), n(Be, bt), n(Be, Yt), n($e, It), n($e, He);
      for (let te = 0; te < 7; te += 1)
        be[te] && be[te].m(He, null);
      n(e, Xt), n(e, je), n(je, we), n(we, mt), n(we, Ot), n(we, Ne), n(je, Rt), ue && ue.m(je, null), n(e, Pt), n(e, De), n(De, Le), n(Le, yt), n(Le, Ft), me.m(Le, null), n(De, Bt), n(De, Te), n(Te, xt), n(Te, Ht), ye.m(Te, null), n(e, Vt), n(e, Ee), n(Ee, st), n(Ee, Ut), xe.m(Ee, null), _t || (Jt = O(
        we,
        "click",
        /*click_handler*/
        s[34]
      ), _t = !0);
    },
    p(A, V) {
      if (V[0] & /*name*/
      1 && L(
        a,
        /*name*/
        A[0]
      ), /*email*/
      A[1] ? de ? de.p(A, V) : (de = qs(A), de.c(), de.m(l, null)) : de && (de.d(1), de = null), V[0] & /*summaryData*/
      32768 && m !== (m = /*summaryData*/
      A[15].total_exercises + "") && L(y, m), V[0] & /*summaryData*/
      32768 && _ !== (_ = /*summaryData*/
      A[15].weekly_sessions + "") && L(j, _), V[0] & /*summaryData*/
      32768 && pe !== (pe = Number(
        /*summaryData*/
        A[15].avg_satisfaction || 0
      ).toFixed(1) + "") && L(ve, pe), V[0] & /*summaryData*/
      32768 && I !== (I = /*summaryData*/
      A[15].distinct_days + "") && L(F, I), V[0] & /*timeData*/
      16384 && Ke !== (Ke = /*formatMinutes*/
      A[16](
        /*timeData*/
        A[14].week_minutes
      ) + "") && L(gt, Ke), V[0] & /*timeData*/
      16384 && Ze !== (Ze = /*formatMinutes*/
      A[16](
        /*timeData*/
        A[14].month_minutes
      ) + "") && L(ht, Ze), V[0] & /*activeDays*/
      8192 && tt !== (tt = /*activeDays*/
      A[13].length + "") && L(bt, tt), V[0] & /*activeDays*/
      8192) {
        wt = le(["L", "M", "X", "J", "V", "S", "D"]);
        let te;
        for (te = 0; te < 7; te += 1) {
          const Wt = zs(A, wt, te);
          be[te] ? be[te].p(Wt, V) : (be[te] = Cs(Wt), be[te].c(), be[te].m(He, null));
        }
        for (; te < 7; te += 1)
          be[te].d(1);
      }
      V[0] & /*xpOpen*/
      32 && dt(
        Ne,
        "rotated",
        /*xpOpen*/
        A[5]
      ), /*xpOpen*/
      A[5] ? ue ? ue.p(A, V) : (ue = Ss(A), ue.c(), ue.m(je, null)) : ue && (ue.d(1), ue = null), lt === (lt = Qt(A)) && me ? me.p(A, V) : (me.d(1), me = lt(A), me && (me.c(), me.m(Le, null))), it === (it = Kt(A)) && ye ? ye.p(A, V) : (ye.d(1), ye = it(A), ye && (ye.c(), ye.m(Te, null))), nt === (nt = Gt(A)) && xe ? xe.p(A, V) : (xe.d(1), xe = nt(A), xe && (xe.c(), xe.m(Ee, null)));
    },
    i: D,
    o: D,
    d(A) {
      A && E(e), de && de.d(), Qe(be, A), ue && ue.d(), me.d(), ye.d(), xe.d(), _t = !1, Jt();
    }
  };
}
function Ai(s, e, t) {
  let l, i, o, r, a, f, b, u, v, p, g, { name: h = "Usuario" } = e, { email: m = "" } = e, { summary: y = "" } = e, { timeSummary: C = "" } = e, { weeklyActiveDays: S = "" } = e, { xpHistory: w = "" } = e, { categoryDistribution: q = "" } = e, { favoriteVideos: T = "" } = e, { insights: _ = "" } = e, { xpTotal: j = 0 } = e, { xpLimit: N = 10 } = e, { xpOffset: Y = 0 } = e, { xpFrom: R = "" } = e, { xpTo: U = "" } = e;
  const B = (M, J) => {
    if (!M || typeof M != "string") return J;
    try {
      return JSON.parse(M);
    } catch {
      return J;
    }
  }, pe = (M) => M ? M < 60 ? `${Math.round(M)} min` : `${(M / 60).toFixed(1)} h` : "0 min", ve = (M) => {
    var Ce, Fe;
    const J = ((Ce = M == null ? void 0 : M.metadata) == null ? void 0 : Ce.source) || (M == null ? void 0 : M.action_type) || "XP";
    if (J === "achievement") {
      const Se = (Fe = M == null ? void 0 : M.metadata) == null ? void 0 : Fe.achievement_title;
      return Se ? `Logro · ${Se}` : "Logro";
    }
    return J === "weekly_challenge" ? "Reto semanal" : J === "questionnaire" ? "Cuestionario" : J === "active_pause" || J === "pause" ? "Pausa activa" : "XP";
  }, se = (M) => {
    if (!M) return "";
    const J = new Date(M);
    return Number.isNaN(J.getTime()) ? "" : J.toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" });
  }, G = qe();
  let ce = !1, Z = R, W = U, P = R, X = U;
  const ge = () => t(5, ce = !ce);
  function ee() {
    Z = this.value, t(6, Z), t(30, R), t(32, P);
  }
  function Q() {
    W = this.value, t(7, W), t(31, U), t(33, X);
  }
  const H = () => {
    t(6, Z = ""), t(7, W = ""), G("xpfilter", { from: "", to: "" });
  }, I = () => {
    G("xpfilter", { from: Z, to: W });
  }, F = () => {
    G("xploadmore", { nextOffset: v + u });
  };
  return s.$$set = (M) => {
    "name" in M && t(0, h = M.name), "email" in M && t(1, m = M.email), "summary" in M && t(20, y = M.summary), "timeSummary" in M && t(21, C = M.timeSummary), "weeklyActiveDays" in M && t(22, S = M.weeklyActiveDays), "xpHistory" in M && t(23, w = M.xpHistory), "categoryDistribution" in M && t(24, q = M.categoryDistribution), "favoriteVideos" in M && t(25, T = M.favoriteVideos), "insights" in M && t(26, _ = M.insights), "xpTotal" in M && t(27, j = M.xpTotal), "xpLimit" in M && t(28, N = M.xpLimit), "xpOffset" in M && t(29, Y = M.xpOffset), "xpFrom" in M && t(30, R = M.xpFrom), "xpTo" in M && t(31, U = M.xpTo);
  }, s.$$.update = () => {
    s.$$.dirty[0] & /*summary*/
    1048576 && t(15, l = B(y, {
      total_exercises: 0,
      weekly_sessions: 0,
      avg_satisfaction: 0,
      distinct_days: 0
    })), s.$$.dirty[0] & /*timeSummary*/
    2097152 && t(14, i = B(C, { week_minutes: 0, month_minutes: 0 })), s.$$.dirty[0] & /*weeklyActiveDays*/
    4194304 && t(13, o = B(S, [])), s.$$.dirty[0] & /*xpHistory*/
    8388608 && t(3, r = B(w, [])), s.$$.dirty[0] & /*categoryDistribution*/
    16777216 && t(12, a = B(q, [])), s.$$.dirty[0] & /*favoriteVideos*/
    33554432 && t(11, f = B(T, [])), s.$$.dirty[0] & /*insights*/
    67108864 && t(10, b = B(_, [])), s.$$.dirty[0] & /*xpFrom*/
    1073741824 | s.$$.dirty[1] & /*lastXpFrom*/
    2 && R !== P && (t(6, Z = R), t(32, P = R)), s.$$.dirty[1] & /*xpTo, lastXpTo*/
    5 && U !== X && (t(7, W = U), t(33, X = U)), s.$$.dirty[0] & /*xpLimit*/
    268435456 && t(9, u = Number(N) || 10), s.$$.dirty[0] & /*xpOffset*/
    536870912 && t(4, v = Number(Y) || 0), s.$$.dirty[0] & /*xpTotal, xpItems*/
    134217736 && t(2, p = Number(j) || r.length), s.$$.dirty[0] & /*safeOffset, xpItems, totalCount*/
    28 && t(8, g = Math.min(v + r.length, p));
  }, [
    h,
    m,
    p,
    r,
    v,
    ce,
    Z,
    W,
    g,
    u,
    b,
    f,
    a,
    o,
    i,
    l,
    pe,
    ve,
    se,
    G,
    y,
    C,
    S,
    w,
    q,
    T,
    _,
    j,
    N,
    Y,
    R,
    U,
    P,
    X,
    ge,
    ee,
    Q,
    H,
    I,
    F
  ];
}
class il extends ae {
  constructor(e) {
    super(), ne(
      this,
      e,
      Ai,
      $i,
      K,
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
      zi,
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
customElements.define("svelte-user-stats-panel", re(il, { name: {}, email: {}, summary: {}, timeSummary: {}, weeklyActiveDays: {}, xpHistory: {}, categoryDistribution: {}, favoriteVideos: {}, insights: {}, xpTotal: {}, xpLimit: {}, xpOffset: {}, xpFrom: {}, xpTo: {} }, [], [], !0));
const oe = (s, e) => {
  const t = e.element;
  customElements.get(s) || customElements.define(s, t ?? e);
};
oe("svelte-counter", Fs);
oe("svelte-orbit-card", Bs);
oe("svelte-pulse-badge", Hs);
oe("svelte-ripple-button", Vs);
oe("svelte-stagger-list", Us);
oe("svelte-thermometer", Js);
oe("svelte-podium", Qs);
oe("svelte-balloon-gift", Ks);
oe("svelte-achievement-card", Gs);
oe("svelte-parallax-card", Ws);
oe("svelte-flip-counter", Zs);
oe("svelte-parallax-stack", el);
oe("svelte-video-card", tl);
oe("svelte-season-popup", sl);
oe("svelte-quota-token", ll);
oe("svelte-user-stats-panel", il);
