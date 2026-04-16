var Xs = Object.defineProperty;
var Ys = (l, e, t) => e in l ? Xs(l, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : l[e] = t;
var ze = (l, e, t) => Ys(l, typeof e != "symbol" ? e + "" : e, t);
function D() {
}
const os = (l) => l;
function cs(l) {
  return l();
}
function nl() {
  return /* @__PURE__ */ Object.create(null);
}
function me(l) {
  l.forEach(cs);
}
function Nt(l) {
  return typeof l == "function";
}
function le(l, e) {
  return l != l ? e == e : l !== e || l && typeof l == "object" || typeof l == "function";
}
let gt;
function Ae(l, e) {
  return l === e ? !0 : (gt || (gt = document.createElement("a")), gt.href = e, l === gt.href);
}
function Hs(l) {
  return Object.keys(l).length === 0;
}
function $e(l) {
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
const fs = typeof window < "u";
let Bs = fs ? () => window.performance.now() : () => Date.now(), Rt = fs ? (l) => requestAnimationFrame(l) : D;
const tt = /* @__PURE__ */ new Set();
function ds(l) {
  tt.forEach((e) => {
    e.c(l) || (tt.delete(e), e.f());
  }), tt.size !== 0 && Rt(ds);
}
function Os(l) {
  let e;
  return tt.size === 0 && Rt(ds), {
    promise: new Promise((t) => {
      tt.add(e = { c: l, f: t });
    }),
    abort() {
      tt.delete(e);
    }
  };
}
function n(l, e) {
  l.appendChild(e);
}
function ce(l, e, t) {
  const s = It(l);
  if (!s.getElementById(e)) {
    const i = d("style");
    i.id = e, i.textContent = t, ps(s, i);
  }
}
function It(l) {
  if (!l) return document;
  const e = l.getRootNode ? l.getRootNode() : l.ownerDocument;
  return e && /** @type {ShadowRoot} */
  e.host ? (
    /** @type {ShadowRoot} */
    e
  ) : l.ownerDocument;
}
function Fs(l) {
  const e = d("style");
  return e.textContent = "/* empty */", ps(It(l), e), e.sheet;
}
function ps(l, e) {
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
function Ne(l, e) {
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
function Be() {
  return z("");
}
function B(l, e, t, s) {
  return l.addEventListener(e, t, s), () => l.removeEventListener(e, t, s);
}
function Et(l) {
  return function(e) {
    return e.preventDefault(), l.call(this, e);
  };
}
function Vs(l) {
  return function(e) {
    return e.stopPropagation(), l.call(this, e);
  };
}
function o(l, e, t) {
  t == null ? l.removeAttribute(e) : l.getAttribute(e) !== t && l.setAttribute(e, t);
}
function Us(l) {
  return Array.from(l.childNodes);
}
function M(l, e) {
  e = "" + e, l.data !== e && (l.data = /** @type {string} */
  e);
}
function Re(l, e) {
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
function Gs(l) {
  const e = l.querySelector(":checked");
  return e && e.__value;
}
function Ye(l, e, t) {
  l.classList.toggle(e, !!t);
}
function us(l, e, { bubbles: t = !1, cancelable: s = !1 } = {}) {
  return new CustomEvent(l, { detail: e, bubbles: t, cancelable: s });
}
function $s(l) {
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
function Js(l) {
  let e = 5381, t = l.length;
  for (; t--; ) e = (e << 5) - e ^ l.charCodeAt(t);
  return e >>> 0;
}
function Ks(l, e) {
  const t = { stylesheet: Fs(e), rules: {} };
  return mt.set(l, t), t;
}
function cl(l, e, t, s, i, c, r, a = 0) {
  const f = 16.666 / s;
  let u = `{
`;
  for (let _ = 0; _ <= 1; _ += f) {
    const q = e + (t - e) * c(_);
    u += _ * 100 + `%{${r(q, 1 - q)}}
`;
  }
  const p = u + `100% {${r(t, 1 - t)}}
}`, v = `__svelte_${Js(p)}_${a}`, g = It(l), { stylesheet: b, rules: m } = mt.get(g) || Ks(g, l);
  m[v] || (m[v] = !0, b.insertRule(`@keyframes ${v} ${p}`, b.cssRules.length));
  const h = l.style.animation || "";
  return l.style.animation = `${h ? `${h}, ` : ""}${v} ${s}ms linear ${i}ms 1 both`, _t += 1, v;
}
function Qs(l, e) {
  const t = (l.style.animation || "").split(", "), s = t.filter(
    e ? (c) => c.indexOf(e) < 0 : (c) => c.indexOf("__svelte") === -1
    // remove all Svelte animations
  ), i = t.length - s.length;
  i && (l.style.animation = s.join(", "), _t -= i, _t || Ws());
}
function Ws() {
  Rt(() => {
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
function vs() {
  if (!at) throw new Error("Function called outside component initialization");
  return at;
}
function gs(l) {
  vs().$$.on_mount.push(l);
}
function Le() {
  const l = vs();
  return (e, t, { cancelable: s = !1 } = {}) => {
    const i = l.$$.callbacks[e];
    if (i) {
      const c = us(
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
function Zs(l, e) {
  const t = l.$$.callbacks[e.type];
  t && t.slice().forEach((s) => s.call(this, e));
}
const et = [], Tt = [];
let lt = [];
const fl = [], hs = /* @__PURE__ */ Promise.resolve();
let Mt = !1;
function bs() {
  Mt || (Mt = !0, hs.then(C));
}
function dl() {
  return bs(), hs;
}
function Se(l) {
  lt.push(l);
}
const St = /* @__PURE__ */ new Set();
let Ze = 0;
function C() {
  if (Ze !== 0)
    return;
  const l = at;
  do {
    try {
      for (; Ze < et.length; ) {
        const e = et[Ze];
        Ze++, rt(e), ei(e.$$);
      }
    } catch (e) {
      throw et.length = 0, Ze = 0, e;
    }
    for (rt(null), et.length = 0, Ze = 0; Tt.length; ) Tt.pop()();
    for (let e = 0; e < lt.length; e += 1) {
      const t = lt[e];
      St.has(t) || (St.add(t), t());
    }
    lt.length = 0;
  } while (et.length);
  for (; fl.length; )
    fl.pop()();
  Mt = !1, St.clear(), rt(l);
}
function ei(l) {
  if (l.fragment !== null) {
    l.update(), me(l.before_update);
    const e = l.dirty;
    l.dirty = [-1], l.fragment && l.fragment.p(l.ctx, e), l.after_update.forEach(Se);
  }
}
function ti(l) {
  const e = [], t = [];
  lt.forEach((s) => l.indexOf(s) === -1 ? e.push(s) : t.push(s)), t.forEach((s) => s()), lt = e;
}
let nt;
function li() {
  return nt || (nt = Promise.resolve(), nt.then(() => {
    nt = null;
  })), nt;
}
function Lt(l, e, t) {
  l.dispatchEvent(us(`${e ? "intro" : "outro"}${t}`));
}
const ht = /* @__PURE__ */ new Set();
let Ie;
function Pt() {
  Ie = {
    r: 0,
    c: [],
    p: Ie
    // parent group
  };
}
function Dt() {
  Ie.r || me(Ie.c), Ie = Ie.p;
}
function Pe(l, e) {
  l && l.i && (ht.delete(l), l.i(e));
}
function ot(l, e, t, s) {
  if (l && l.o) {
    if (ht.has(l)) return;
    ht.add(l), Ie.c.push(() => {
      ht.delete(l), s && (t && l.d(1), s());
    }), l.o(e);
  } else s && s();
}
const si = { duration: 0 };
function qe(l, e, t, s) {
  let c = e(l, t, { direction: "both" }), r = s ? 0 : 1, a = null, f = null, u = null, p;
  function v() {
    u && Qs(l, u);
  }
  function g(m, h) {
    const _ = (
      /** @type {Program['d']} */
      m.b - r
    );
    return h *= Math.abs(_), {
      a: r,
      b: m.b,
      d: _,
      duration: h,
      start: m.start,
      end: m.start + h,
      group: m.group
    };
  }
  function b(m) {
    const {
      delay: h = 0,
      duration: _ = 300,
      easing: q = os,
      tick: A = D,
      css: k
    } = c || si, x = {
      start: Bs() + h,
      b: m
    };
    m || (x.group = Ie, Ie.r += 1), "inert" in l && (m ? p !== void 0 && (l.inert = p) : (p = /** @type {HTMLElement} */
    l.inert, l.inert = !0)), a || f ? f = x : (k && (v(), u = cl(l, r, m, _, h, q, k)), m && A(0, 1), a = g(x, _), Se(() => Lt(l, m, "start")), Os((E) => {
      if (f && E > f.start && (a = g(f, _), f = null, Lt(l, a.b, "start"), k && (v(), u = cl(
        l,
        r,
        a.b,
        a.duration,
        0,
        q,
        c.css
      ))), a) {
        if (E >= a.end)
          A(r = a.b, 1 - r), Lt(l, a.b, "end"), f || (a.b ? v() : --a.group.r || me(a.group.c)), a = null;
        else if (E >= a.start) {
          const w = E - a.start;
          r = a.a + a.d * q(w / a.duration), A(r, 1 - r);
        }
      }
      return !!(a || f);
    }));
  }
  return {
    run(m) {
      Nt(c) ? li().then(() => {
        c = c({ direction: m ? "in" : "out" }), b(m);
      }) : b(m);
    },
    end() {
      v(), a = f = null;
    }
  };
}
function W(l) {
  return (l == null ? void 0 : l.length) !== void 0 ? l : Array.from(l);
}
function Xt(l, e) {
  l.d(1), e.delete(l.key);
}
function Yt(l, e, t, s, i, c, r, a, f, u, p, v) {
  let g = l.length, b = c.length, m = g;
  const h = {};
  for (; m--; ) h[l[m].key] = m;
  const _ = [], q = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), k = [];
  for (m = b; m--; ) {
    const j = v(i, c, m), T = t(j);
    let R = r.get(T);
    R ? k.push(() => R.p(j, e)) : (R = u(T, j), R.c()), q.set(T, _[m] = R), T in h && A.set(T, Math.abs(m - h[T]));
  }
  const x = /* @__PURE__ */ new Set(), E = /* @__PURE__ */ new Set();
  function w(j) {
    Pe(j, 1), j.m(a, p), r.set(j.key, j), p = j.first, b--;
  }
  for (; g && b; ) {
    const j = _[b - 1], T = l[g - 1], R = j.key, N = T.key;
    j === T ? (p = j.first, g--, b--) : q.has(N) ? !r.has(R) || x.has(R) ? w(j) : E.has(N) ? g-- : A.get(R) > A.get(N) ? (E.add(R), w(j)) : (x.add(N), g--) : (f(T, r), g--);
  }
  for (; g--; ) {
    const j = l[g];
    q.has(j.key) || f(j, r);
  }
  for (; b; ) w(_[b - 1]);
  return me(k), _;
}
function ii(l, e, t) {
  const { fragment: s, after_update: i } = l.$$;
  s && s.m(e, t), Se(() => {
    const c = l.$$.on_mount.map(cs).filter(Nt);
    l.$$.on_destroy ? l.$$.on_destroy.push(...c) : me(c), l.$$.on_mount = [];
  }), i.forEach(Se);
}
function ni(l, e) {
  const t = l.$$;
  t.fragment !== null && (ti(t.after_update), me(t.on_destroy), t.fragment && t.fragment.d(e), t.on_destroy = t.fragment = null, t.ctx = []);
}
function ri(l, e) {
  l.$$.dirty[0] === -1 && (et.push(l), bs(), l.$$.dirty.fill(0)), l.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function fe(l, e, t, s, i, c, r = null, a = [-1]) {
  const f = at;
  rt(l);
  const u = l.$$ = {
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
    dirty: a,
    skip_bound: !1,
    root: e.target || f.$$.root
  };
  r && r(u.root);
  let p = !1;
  if (u.ctx = t ? t(l, e.props || {}, (v, g, ...b) => {
    const m = b.length ? b[0] : g;
    return u.ctx && i(u.ctx[v], u.ctx[v] = m) && (!u.skip_bound && u.bound[v] && u.bound[v](m), p && ri(l, v)), g;
  }) : [], u.update(), p = !0, me(u.before_update), u.fragment = s ? s(u.ctx) : !1, e.target) {
    if (e.hydrate) {
      const v = Us(e.target);
      u.fragment && u.fragment.l(v), v.forEach(S);
    } else
      u.fragment && u.fragment.c();
    e.intro && Pe(l.$$.fragment), ii(l, e.target, e.anchor), C();
  }
  rt(f);
}
let ms;
typeof HTMLElement == "function" && (ms = class extends HTMLElement {
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
          let a;
          return {
            c: function() {
              a = d("slot"), r !== "default" && o(a, "name", r);
            },
            /**
             * @param {HTMLElement} target
             * @param {HTMLElement} [anchor]
             */
            m: function(p, v) {
              L(p, a, v);
            },
            d: function(p) {
              p && S(a);
            }
          };
        };
      };
      var e = t;
      if (await Promise.resolve(), !this.$$cn || this.$$c)
        return;
      const s = {}, i = $s(this);
      for (const r of this.$$s)
        r in i && (s[r] = [t(r)]);
      for (const r of this.attributes) {
        const a = this.$$g_p(r.name);
        a in this.$$d || (this.$$d[a] = bt(a, r.value, this.$$p_d, "toProp"));
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
            const a = bt(
              r,
              this.$$d[r],
              this.$$p_d,
              "toAttribute"
            );
            a == null ? this.removeAttribute(this.$$p_d[r].attribute || r) : this.setAttribute(this.$$p_d[r].attribute || r, a);
          }
        this.$$r = !1;
      };
      this.$$c.$$.after_update.push(c), c();
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
  let r = class extends ms {
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
    Object.defineProperty(r.prototype, a, {
      get() {
        return this.$$c && a in this.$$c ? this.$$c[a] : this.$$d[a];
      },
      set(f) {
        var u;
        f = bt(a, f, e), this.$$d[a] = f, (u = this.$$c) == null || u.$set({ [a]: f });
      }
    });
  }), s.forEach((a) => {
    Object.defineProperty(r.prototype, a, {
      get() {
        var f;
        return (f = this.$$c) == null ? void 0 : f[a];
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
    ni(this, 1), this.$destroy = D;
  }
  /**
   * @template {Extract<keyof Events, string>} K
   * @param {K} type
   * @param {((e: Events[K]) => void) | null | undefined} callback
   * @returns {() => void}
   */
  $on(e, t) {
    if (!Nt(t))
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
    this.$$set && !Hs(e) && (this.$$.skip_bound = !0, this.$$set(e), this.$$.skip_bound = !1);
  }
}
const ai = "4";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(ai);
function oi(l) {
  ce(l, "svelte-1tevv97", '.card.svelte-1tevv97{border-radius:14px;border:1px solid #e2e8f0;padding:16px;display:grid;gap:12px;font-family:"Figtree", system-ui, sans-serif;background:#ffffff;box-shadow:0 12px 24px rgba(15, 23, 42, 0.08)}.label.svelte-1tevv97{font-size:14px;color:#0f172a;margin:0}.count.svelte-1tevv97{font-weight:600;font-size:20px;color:#0f172a;margin:0}button.svelte-1tevv97{border:0;border-radius:10px;padding:10px 12px;background:#10b981;color:white;cursor:pointer;font-weight:600}button.svelte-1tevv97:hover{background:#059669}');
}
function ci(l) {
  let e, t, s, i, c, r, a, f, u, p, v, g;
  return {
    c() {
      e = d("div"), t = d("p"), s = z("Hola "), i = z(
        /*name*/
        l[0]
      ), c = y(), r = d("p"), a = z("Count: "), f = z(
        /*count*/
        l[1]
      ), u = y(), p = d("button"), p.textContent = "Emitir evento", o(t, "class", "label svelte-1tevv97"), o(r, "class", "count svelte-1tevv97"), o(p, "type", "button"), o(p, "class", "svelte-1tevv97"), o(e, "class", "card svelte-1tevv97");
    },
    m(b, m) {
      L(b, e, m), n(e, t), n(t, s), n(t, i), n(e, c), n(e, r), n(r, a), n(r, f), n(e, u), n(e, p), v || (g = B(
        p,
        "click",
        /*notify*/
        l[2]
      ), v = !0);
    },
    p(b, [m]) {
      m & /*name*/
      1 && M(
        i,
        /*name*/
        b[0]
      ), m & /*count*/
      2 && M(
        f,
        /*count*/
        b[1]
      );
    },
    i: D,
    o: D,
    d(b) {
      b && S(e), v = !1, g();
    }
  };
}
function fi(l, e, t) {
  let { name: s = "Ada" } = e, { count: i = 2 } = e;
  const c = Le(), r = () => {
    c("ping", { from: "svelte", count: i });
  };
  return l.$$set = (a) => {
    "name" in a && t(0, s = a.name), "count" in a && t(1, i = a.count);
  }, [s, i, r];
}
class _s extends pe {
  constructor(e) {
    super(), fe(this, e, fi, ci, le, { name: 0, count: 1 }, oi);
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
de(_s, { name: {}, count: {} }, [], [], !0);
function di(l) {
  ce(l, "svelte-5733sx", ".card.svelte-5733sx{position:relative;overflow:hidden;border-radius:20px;border:1px solid #d1fae5;background:linear-gradient(145deg, #ffffff, #ecfdf5);padding:20px;min-height:140px;box-shadow:0 16px 36px rgba(15, 23, 42, 0.12)}.glow.svelte-5733sx{position:absolute;inset:-40%;background:radial-gradient(circle at 30% 20%, rgba(16, 185, 129, 0.3), transparent 55%);opacity:0.7;filter:blur(8px)}.content.svelte-5733sx{position:relative;display:grid;gap:8px;color:#0f172a}.title.svelte-5733sx{font-size:16px;font-weight:600;margin:0}.subtitle.svelte-5733sx{font-size:12px;margin:0;color:#64748b}.metrics.svelte-5733sx{margin-top:12px;display:flex;justify-content:space-between;font-size:12px;color:#0f172a}.orbit.svelte-5733sx{position:absolute;inset:-30%;border-radius:999px;border:1px dashed rgba(16, 185, 129, 0.3);animation:svelte-5733sx-orbit 6s linear infinite;opacity:var(--orbit-alpha)}.satellite-orbit.svelte-5733sx{position:absolute;inset:-30%;border-radius:999px;animation:svelte-5733sx-orbit 6s linear infinite}.satellite.svelte-5733sx{position:absolute;width:10px;height:10px;border-radius:999px;background:#34d399;box-shadow:0 0 12px rgba(16, 185, 129, 0.6);top:50%;left:50%;transform:translate(-50%, -50%) translateY(-78px)}@keyframes svelte-5733sx-orbit{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}");
}
function pi(l) {
  let e, t, s, i, c, r, a, f, u, p, v, g, b, m, h, _, q, A, k, x, E, w, j;
  return {
    c() {
      e = d("div"), t = d("div"), s = y(), i = d("div"), c = d("p"), r = z(
        /*title*/
        l[0]
      ), a = y(), f = d("p"), u = z(
        /*subtitle*/
        l[1]
      ), p = y(), v = d("div"), g = d("span"), g.textContent = "Flow", b = y(), m = d("span"), h = z(
        /*flow*/
        l[3]
      ), _ = z("%"), q = y(), A = d("div"), A.innerHTML = '<div class="satellite svelte-5733sx"></div>', k = y(), x = d("div"), o(t, "class", "glow svelte-5733sx"), o(c, "class", "title svelte-5733sx"), o(f, "class", "subtitle svelte-5733sx"), o(v, "class", "metrics svelte-5733sx"), o(i, "class", "content svelte-5733sx"), o(A, "class", "satellite-orbit svelte-5733sx"), o(x, "class", "orbit svelte-5733sx"), o(e, "class", "card svelte-5733sx"), o(e, "style", E = `--orbit-alpha:${/*intensity*/
      l[2]}`), o(e, "role", "button"), o(e, "tabindex", "0");
    },
    m(T, R) {
      L(T, e, R), n(e, t), n(e, s), n(e, i), n(i, c), n(c, r), n(i, a), n(i, f), n(f, u), n(i, p), n(i, v), n(v, g), n(v, b), n(v, m), n(m, h), n(m, _), n(e, q), n(e, A), n(e, k), n(e, x), w || (j = [
        B(
          e,
          "mouseenter",
          /*handleHover*/
          l[4]
        ),
        B(
          e,
          "focus",
          /*handleHover*/
          l[4]
        ),
        B(
          e,
          "keydown",
          /*keydown_handler*/
          l[5]
        )
      ], w = !0);
    },
    p(T, [R]) {
      R & /*title*/
      1 && M(
        r,
        /*title*/
        T[0]
      ), R & /*subtitle*/
      2 && M(
        u,
        /*subtitle*/
        T[1]
      ), R & /*flow*/
      8 && M(
        h,
        /*flow*/
        T[3]
      ), R & /*intensity*/
      4 && E !== (E = `--orbit-alpha:${/*intensity*/
      T[2]}`) && o(e, "style", E);
    },
    i: D,
    o: D,
    d(T) {
      T && S(e), w = !1, me(j);
    }
  };
}
function ui(l, e, t) {
  let { title: s = "Focus Ring" } = e, { subtitle: i = "Anillo orbital" } = e, { intensity: c = 0.6 } = e, { flow: r = 78 } = e;
  const a = Le(), f = () => {
    a("hover", { title: s });
  }, u = (p) => {
    (p.key === "Enter" || p.key === " ") && f();
  };
  return l.$$set = (p) => {
    "title" in p && t(0, s = p.title), "subtitle" in p && t(1, i = p.subtitle), "intensity" in p && t(2, c = p.intensity), "flow" in p && t(3, r = p.flow);
  }, [s, i, c, r, f, u];
}
class xs extends pe {
  constructor(e) {
    super(), fe(
      this,
      e,
      ui,
      pi,
      le,
      {
        title: 0,
        subtitle: 1,
        intensity: 2,
        flow: 3
      },
      di
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
de(xs, { title: {}, subtitle: {}, intensity: {}, flow: {} }, [], [], !0);
function vi(l) {
  ce(l, "svelte-1vzxgvk", ".badge.svelte-1vzxgvk.svelte-1vzxgvk{display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border-radius:999px;border:1px solid transparent;font-size:12px;font-weight:600;letter-spacing:0.02em;cursor:pointer;background:#ecfdf5;color:#065f46}.badge.emerald.svelte-1vzxgvk.svelte-1vzxgvk{border-color:rgba(16, 185, 129, 0.35)}.dot.svelte-1vzxgvk.svelte-1vzxgvk{width:8px;height:8px;border-radius:999px;background:currentColor;box-shadow:0 0 0 rgba(16, 185, 129, 0.6)}.active.svelte-1vzxgvk .dot.svelte-1vzxgvk{animation:svelte-1vzxgvk-pulse 1.8s ease-in-out infinite}@keyframes svelte-1vzxgvk-pulse{0%{box-shadow:0 0 0 0 rgba(16, 185, 129, 0.6)}70%{box-shadow:0 0 0 12px rgba(16, 185, 129, 0)}100%{box-shadow:0 0 0 0 rgba(16, 185, 129, 0)}}");
}
function gi(l) {
  let e, t, s, i, c, r, a;
  return {
    c() {
      e = d("button"), t = d("span"), s = y(), i = z(
        /*label*/
        l[1]
      ), o(t, "class", "dot svelte-1vzxgvk"), o(e, "class", c = $e(`badge ${/*tone*/
      l[2]} ${/*active*/
      l[0] ? "active" : ""}`) + " svelte-1vzxgvk"), o(e, "type", "button");
    },
    m(f, u) {
      L(f, e, u), n(e, t), n(e, s), n(e, i), r || (a = B(
        e,
        "click",
        /*toggle*/
        l[3]
      ), r = !0);
    },
    p(f, [u]) {
      u & /*label*/
      2 && M(
        i,
        /*label*/
        f[1]
      ), u & /*tone, active*/
      5 && c !== (c = $e(`badge ${/*tone*/
      f[2]} ${/*active*/
      f[0] ? "active" : ""}`) + " svelte-1vzxgvk") && o(e, "class", c);
    },
    i: D,
    o: D,
    d(f) {
      f && S(e), r = !1, a();
    }
  };
}
function hi(l, e, t) {
  let { label: s = "Live" } = e, { tone: i = "emerald" } = e, { active: c = !0 } = e;
  const r = Le(), a = () => {
    t(0, c = !c), r("toggle", { active: c });
  };
  return l.$$set = (f) => {
    "label" in f && t(1, s = f.label), "tone" in f && t(2, i = f.tone), "active" in f && t(0, c = f.active);
  }, [c, s, i, a];
}
class ys extends pe {
  constructor(e) {
    super(), fe(this, e, hi, gi, le, { label: 1, tone: 2, active: 0 }, vi);
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
de(ys, { label: {}, tone: {}, active: { type: "Boolean" } }, [], [], !0);
function bi(l) {
  ce(l, "svelte-1io8dtn", ".ripple.svelte-1io8dtn{position:relative;overflow:hidden;padding:12px 20px;border-radius:14px;border:none;background:var(--tone);color:#ffffff;font-weight:600;cursor:pointer;box-shadow:0 16px 28px rgba(16, 185, 129, 0.25)}.label.svelte-1io8dtn{position:relative;z-index:1}.wave.svelte-1io8dtn{position:absolute;width:20px;height:20px;border-radius:999px;background:rgba(255, 255, 255, 0.45);transform:translate(-50%, -50%);animation:svelte-1io8dtn-ripple 0.8s ease-out forwards}@keyframes svelte-1io8dtn-ripple{from{opacity:0.7;transform:translate(-50%, -50%) scale(0)}to{opacity:0;transform:translate(-50%, -50%) scale(8)}}");
}
function pl(l, e, t) {
  const s = l.slice();
  return s[7] = e[t], s;
}
function ul(l, e) {
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
      t = d("span"), o(t, "class", "wave svelte-1io8dtn"), o(t, "style", s = `left:${/*ripple*/
      e[7].x}px; top:${/*ripple*/
      e[7].y}px;`), this.first = t;
    },
    m(a, f) {
      L(a, t, f), i || (c = B(t, "animationend", r), i = !0);
    },
    p(a, f) {
      e = a, f & /*ripples*/
      4 && s !== (s = `left:${/*ripple*/
      e[7].x}px; top:${/*ripple*/
      e[7].y}px;`) && o(t, "style", s);
    },
    d(a) {
      a && S(t), i = !1, c();
    }
  };
}
function mi(l) {
  let e, t = [], s = /* @__PURE__ */ new Map(), i, c, r, a, f, u, p = W(
    /*ripples*/
    l[2]
  );
  const v = (g) => (
    /*ripple*/
    g[7].id
  );
  for (let g = 0; g < p.length; g += 1) {
    let b = pl(l, p, g), m = v(b);
    s.set(m, t[g] = ul(m, b));
  }
  return {
    c() {
      e = d("button");
      for (let g = 0; g < t.length; g += 1)
        t[g].c();
      i = y(), c = d("span"), r = z(
        /*label*/
        l[0]
      ), o(c, "class", "label svelte-1io8dtn"), o(e, "class", "ripple svelte-1io8dtn"), o(e, "type", "button"), o(e, "style", a = `--tone:${/*tone*/
      l[1]}`);
    },
    m(g, b) {
      L(g, e, b);
      for (let m = 0; m < t.length; m += 1)
        t[m] && t[m].m(e, null);
      n(e, i), n(e, c), n(c, r), f || (u = B(
        e,
        "click",
        /*handleClick*/
        l[3]
      ), f = !0);
    },
    p(g, [b]) {
      b & /*ripples, removeRipple*/
      20 && (p = W(
        /*ripples*/
        g[2]
      ), t = Yt(t, b, v, 1, g, p, s, e, Xt, ul, i, pl)), b & /*label*/
      1 && M(
        r,
        /*label*/
        g[0]
      ), b & /*tone*/
      2 && a !== (a = `--tone:${/*tone*/
      g[1]}`) && o(e, "style", a);
    },
    i: D,
    o: D,
    d(g) {
      g && S(e);
      for (let b = 0; b < t.length; b += 1)
        t[b].d();
      f = !1, u();
    }
  };
}
function _i(l, e, t) {
  let { label: s = "Lanzar onda" } = e, { tone: i = "#10b981" } = e;
  const c = Le();
  let r = [];
  const a = (p) => {
    const v = p.currentTarget.getBoundingClientRect(), g = p.clientX - v.left, b = p.clientY - v.top, m = Math.random().toString(36).slice(2);
    t(2, r = [...r, { id: m, x: g, y: b }]), c("ripple", { x: g, y: b });
  }, f = (p) => {
    t(2, r = r.filter((v) => v.id !== p));
  }, u = (p) => f(p.id);
  return l.$$set = (p) => {
    "label" in p && t(0, s = p.label), "tone" in p && t(1, i = p.tone);
  }, [s, i, r, a, f, u];
}
class ks extends pe {
  constructor(e) {
    super(), fe(this, e, _i, mi, le, { label: 0, tone: 1 }, bi);
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
de(ks, { label: {}, tone: {} }, [], [], !0);
function xi(l) {
  ce(l, "svelte-1jr61rp", ".list.svelte-1jr61rp{border-radius:18px;border:1px solid #e2e8f0;background:#ffffff;padding:16px;display:grid;gap:16px}.header.svelte-1jr61rp{display:flex;justify-content:space-between;align-items:center}.title.svelte-1jr61rp{margin:0;font-size:14px;font-weight:600;color:#0f172a}.subtitle.svelte-1jr61rp{margin:0;font-size:11px;color:#94a3b8}button.svelte-1jr61rp{border:1px solid #d1fae5;background:#ecfdf5;color:#065f46;font-size:12px;padding:6px 10px;border-radius:10px;cursor:pointer}.items.svelte-1jr61rp{display:grid;gap:10px}.item.svelte-1jr61rp{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-radius:12px;background:#f8fafc;color:#0f172a;font-size:13px;animation:svelte-1jr61rp-slide-in 0.5s ease forwards;opacity:0;transform:translateY(6px)}.score.svelte-1jr61rp{font-weight:600}@keyframes svelte-1jr61rp-slide-in{to{opacity:1;transform:translateY(0)}}");
}
function vl(l, e, t) {
  const s = l.slice();
  return s[7] = e[t], s[9] = t, s;
}
function gl(l, e) {
  let t, s, i = (
    /*item*/
    e[7].title + ""
  ), c, r, a, f = (
    /*item*/
    e[7].score + ""
  ), u, p, v, g;
  return {
    key: l,
    first: null,
    c() {
      t = d("div"), s = d("span"), c = z(i), r = y(), a = d("span"), u = z(f), p = z("%"), v = y(), o(a, "class", "score svelte-1jr61rp"), o(t, "class", "item svelte-1jr61rp"), o(t, "style", g = `animation-delay:${/*index*/
      e[9] * /*cadence*/
      e[1]}ms`), this.first = t;
    },
    m(b, m) {
      L(b, t, m), n(t, s), n(s, c), n(t, r), n(t, a), n(a, u), n(a, p), n(t, v);
    },
    p(b, m) {
      e = b, m & /*items*/
      4 && i !== (i = /*item*/
      e[7].title + "") && M(c, i), m & /*items*/
      4 && f !== (f = /*item*/
      e[7].score + "") && M(u, f), m & /*items, cadence*/
      6 && g !== (g = `animation-delay:${/*index*/
      e[9] * /*cadence*/
      e[1]}ms`) && o(t, "style", g);
    },
    d(b) {
      b && S(t);
    }
  };
}
function yi(l) {
  let e, t, s, i, c, r, a, f, u, p, v, g, b = [], m = /* @__PURE__ */ new Map(), h, _, q = W(
    /*items*/
    l[2]
  );
  const A = (k) => (
    /*item*/
    k[7].id
  );
  for (let k = 0; k < q.length; k += 1) {
    let x = vl(l, q, k), E = A(x);
    m.set(E, b[k] = gl(E, x));
  }
  return {
    c() {
      e = d("div"), t = d("div"), s = d("div"), i = d("p"), i.textContent = "Stagger list", c = y(), r = d("p"), a = z(
        /*count*/
        l[0]
      ), f = z(" items"), u = y(), p = d("button"), p.textContent = "Actualizar", v = y(), g = d("div");
      for (let k = 0; k < b.length; k += 1)
        b[k].c();
      o(i, "class", "title svelte-1jr61rp"), o(r, "class", "subtitle svelte-1jr61rp"), o(p, "type", "button"), o(p, "class", "svelte-1jr61rp"), o(t, "class", "header svelte-1jr61rp"), o(g, "class", "items svelte-1jr61rp"), o(e, "class", "list svelte-1jr61rp");
    },
    m(k, x) {
      L(k, e, x), n(e, t), n(t, s), n(s, i), n(s, c), n(s, r), n(r, a), n(r, f), n(t, u), n(t, p), n(e, v), n(e, g);
      for (let E = 0; E < b.length; E += 1)
        b[E] && b[E].m(g, null);
      h || (_ = B(
        p,
        "click",
        /*handleRefresh*/
        l[3]
      ), h = !0);
    },
    p(k, [x]) {
      x & /*count*/
      1 && M(
        a,
        /*count*/
        k[0]
      ), x & /*items, cadence*/
      6 && (q = W(
        /*items*/
        k[2]
      ), b = Yt(b, x, A, 1, k, q, m, g, Xt, gl, null, vl));
    },
    i: D,
    o: D,
    d(k) {
      k && S(e);
      for (let x = 0; x < b.length; x += 1)
        b[x].d();
      h = !1, _();
    }
  };
}
function ki(l, e, t) {
  let { label: s = "Batch" } = e, { count: i = 5 } = e, { cadence: c = 120 } = e;
  const r = Le();
  let a = [];
  const f = () => {
    t(2, a = Array.from({ length: i }, (p, v) => ({
      id: `${s}-${v}`,
      title: `${s} ${v + 1}`,
      score: Math.floor(Math.random() * 40) + 60
    }))), r("refresh", { count: i });
  }, u = () => {
    f();
  };
  return gs(f), l.$$set = (p) => {
    "label" in p && t(4, s = p.label), "count" in p && t(0, i = p.count), "cadence" in p && t(1, c = p.cadence);
  }, [i, c, a, u, s];
}
class ws extends pe {
  constructor(e) {
    super(), fe(this, e, ki, yi, le, { label: 4, count: 0, cadence: 1 }, xi);
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
de(ws, { label: {}, count: {}, cadence: {} }, [], [], !0);
function wi(l) {
  ce(l, "svelte-1g1qxhj", ".thermo.svelte-1g1qxhj.svelte-1g1qxhj{display:grid;gap:16px;border-radius:18px;border:1px solid #e2e8f0;padding:16px;background:#ffffff}.thermo.frameless.svelte-1g1qxhj.svelte-1g1qxhj{border:none;background:transparent;padding:0;gap:6px;grid-template-columns:1fr;align-items:center;text-align:center}.header.svelte-1g1qxhj.svelte-1g1qxhj{display:flex;justify-content:space-between;align-items:center;gap:12px}.thermo.frameless.svelte-1g1qxhj .header.svelte-1g1qxhj{flex-direction:column;align-items:center;justify-content:center;min-width:0;text-align:center}.title.svelte-1g1qxhj.svelte-1g1qxhj{margin:0;font-size:14px;font-weight:600;color:#0f172a}.subtitle.svelte-1g1qxhj.svelte-1g1qxhj{margin:0;font-size:12px;color:#64748b}.meter.svelte-1g1qxhj.svelte-1g1qxhj{position:relative;height:160px;display:grid;place-items:center}.thermo.frameless.svelte-1g1qxhj .meter.svelte-1g1qxhj{align-self:start;width:52px;justify-self:center}.thermo.frameless.svelte-1g1qxhj .meter.svelte-1g1qxhj{height:120px}.tube.svelte-1g1qxhj.svelte-1g1qxhj{position:relative;width:24px;height:140px;border-radius:14px;background:#f1f5f9;border:1px solid #e2e8f0;overflow:hidden;box-shadow:inset 0 6px 16px rgba(15, 23, 42, 0.08)}.thermo.frameless.svelte-1g1qxhj .tube.svelte-1g1qxhj{height:110px}.fill.svelte-1g1qxhj.svelte-1g1qxhj{position:absolute;left:0;right:0;bottom:0;height:var(--level);background:linear-gradient(180deg, #ffffff, var(--fill));transition:height 0.8s cubic-bezier(0.22, 1, 0.36, 1)}.gloss.svelte-1g1qxhj.svelte-1g1qxhj{position:absolute;left:3px;top:8px;width:6px;height:calc(100% - 16px);border-radius:999px;background:rgba(255, 255, 255, 0.6);animation:svelte-1g1qxhj-shimmer 2.4s ease-in-out infinite}.bulb.svelte-1g1qxhj.svelte-1g1qxhj{position:absolute;bottom:-6px;width:44px;height:44px;border-radius:999px;background:radial-gradient(circle at 30% 30%, #ffffff, var(--fill));border:2px solid rgba(226, 232, 240, 0.9);box-shadow:0 10px 24px var(--glow);animation:svelte-1g1qxhj-pulse 2.2s ease-in-out infinite}.thermo.frameless.svelte-1g1qxhj .bulb.svelte-1g1qxhj{width:36px;height:36px}@keyframes svelte-1g1qxhj-shimmer{0%,100%{opacity:0.35;transform:translateY(0)}50%{opacity:0.7;transform:translateY(-8px)}}@keyframes svelte-1g1qxhj-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}");
}
function zi(l) {
  let e, t, s, i, c, r, a, f, u, p, v, g;
  return {
    c() {
      e = d("div"), t = d("div"), s = d("div"), i = d("p"), c = z(
        /*label*/
        l[0]
      ), r = y(), a = d("p"), f = z(
        /*subtitleText*/
        l[3]
      ), u = y(), p = d("div"), p.innerHTML = '<div class="tube svelte-1g1qxhj"><div class="fill svelte-1g1qxhj"></div> <div class="gloss svelte-1g1qxhj"></div></div> <div class="bulb svelte-1g1qxhj"></div>', o(i, "class", "title svelte-1g1qxhj"), o(a, "class", "subtitle svelte-1g1qxhj"), o(t, "class", "header svelte-1g1qxhj"), o(p, "class", "meter svelte-1g1qxhj"), o(e, "class", v = $e(`thermo ${/*frameless*/
      l[1] ? "frameless" : ""}`) + " svelte-1g1qxhj"), o(e, "style", g = `--level:${/*percent*/
      l[2]}%; --fill:${/*fillColor*/
      l[5]}; --glow:${/*glowColor*/
      l[4]};`);
    },
    m(b, m) {
      L(b, e, m), n(e, t), n(t, s), n(s, i), n(i, c), n(s, r), n(s, a), n(a, f), n(e, u), n(e, p);
    },
    p(b, [m]) {
      m & /*label*/
      1 && M(
        c,
        /*label*/
        b[0]
      ), m & /*subtitleText*/
      8 && M(
        f,
        /*subtitleText*/
        b[3]
      ), m & /*frameless*/
      2 && v !== (v = $e(`thermo ${/*frameless*/
      b[1] ? "frameless" : ""}`) + " svelte-1g1qxhj") && o(e, "class", v), m & /*percent, fillColor, glowColor*/
      52 && g !== (g = `--level:${/*percent*/
      b[2]}%; --fill:${/*fillColor*/
      b[5]}; --glow:${/*glowColor*/
      b[4]};`) && o(e, "style", g);
    },
    i: D,
    o: D,
    d(b) {
      b && S(e);
    }
  };
}
function qi(l, e, t) {
  let s, i, c, r, a, f, u, p, v, { label: g = "Temperatura" } = e, { value: b = 22 } = e, { min: m = 0 } = e, { max: h = 40 } = e, { subtitle: _ = "" } = e, { frameless: q = !1 } = e;
  const A = (E, w, j) => Math.min(j, Math.max(w, E)), k = (E, w, j) => Math.round(E + (w - E) * j), x = (E, w, j) => `rgb(${E}, ${w}, ${j})`;
  return l.$$set = (E) => {
    "label" in E && t(0, g = E.label), "value" in E && t(6, b = E.value), "min" in E && t(7, m = E.min), "max" in E && t(8, h = E.max), "subtitle" in E && t(9, _ = E.subtitle), "frameless" in E && t(1, q = E.frameless);
  }, l.$$.update = () => {
    l.$$.dirty & /*value, min, max*/
    448 && t(10, s = A(b, m, h)), l.$$.dirty & /*safeValue, min, max*/
    1408 && t(12, i = (s - m) / (h - m || 1)), l.$$.dirty & /*ratio*/
    4096 && t(2, c = Math.round(i * 100)), l.$$.dirty & /*cool, warm, ratio*/
    28672 && t(11, f = {
      r: k(a.r, r.r, i),
      g: k(a.g, r.g, i),
      b: k(a.b, r.b, i)
    }), l.$$.dirty & /*mix*/
    2048 && t(5, u = x(f.r, f.g, f.b)), l.$$.dirty & /*mix*/
    2048 && t(4, p = `rgba(${f.r}, ${f.g}, ${f.b}, 0.45)`), l.$$.dirty & /*subtitle, safeValue, percent*/
    1540 && t(3, v = _ || `${s}C - ${c}%`);
  }, t(13, r = { r: 239, g: 68, b: 68 }), t(14, a = { r: 34, g: 197, b: 94 }), [
    g,
    q,
    c,
    v,
    p,
    u,
    b,
    m,
    h,
    _,
    s,
    f,
    i,
    r,
    a
  ];
}
class zs extends pe {
  constructor(e) {
    super(), fe(
      this,
      e,
      qi,
      zi,
      le,
      {
        label: 0,
        value: 6,
        min: 7,
        max: 8,
        subtitle: 9,
        frameless: 1
      },
      wi
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
de(zs, { label: {}, value: {}, min: {}, max: {}, subtitle: {}, frameless: { type: "Boolean" } }, [], [], !0);
function ji(l) {
  ce(l, "svelte-q2ay9k", `.podium.svelte-q2ay9k.svelte-q2ay9k{position:relative;border-radius:18px;border:1px solid #e2e8f0;background:linear-gradient(180deg, #ffffff, #f8fafc);padding:24px 18px 16px;height:220px;display:grid;align-items:end}.line.svelte-q2ay9k.svelte-q2ay9k{position:absolute;left:16px;right:16px;bottom:24px;height:2px;background:linear-gradient(90deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.6))}.controls.svelte-q2ay9k.svelte-q2ay9k{position:absolute;top:14px;right:14px;display:flex;gap:8px}.reset.svelte-q2ay9k.svelte-q2ay9k,.swap.svelte-q2ay9k.svelte-q2ay9k{border:1px solid rgba(16, 185, 129, 0.3);background:#ecfdf5;color:#065f46;font-size:11px;padding:6px 10px;border-radius:999px;cursor:pointer}.reset.svelte-q2ay9k.svelte-q2ay9k:hover,.swap.svelte-q2ay9k.svelte-q2ay9k:hover{background:#d1fae5}.stack.svelte-q2ay9k.svelte-q2ay9k{position:relative;display:grid;grid-template-columns:repeat(3, 1fr);align-items:end;gap:14px;height:100%;z-index:1}.bar.svelte-q2ay9k.svelte-q2ay9k{position:relative;border-radius:14px 14px 6px 6px;background:#d1fae5;color:#065f46;display:grid;place-items:center;font-size:14px;font-weight:600;transform-origin:bottom;animation:svelte-q2ay9k-rise var(--dur) cubic-bezier(0.22, 1, 0.36, 1) forwards;transform:scaleY(0)}.bar.svelte-q2ay9k span.svelte-q2ay9k{opacity:0;animation:svelte-q2ay9k-fade-in 0.5s ease forwards;animation-delay:calc(var(--dur) * 0.7)}.bar.svelte-q2ay9k.svelte-q2ay9k::after{content:"";position:absolute;inset:8px;border-radius:10px;background:linear-gradient(120deg, rgba(255, 255, 255, 0.4), transparent 60%);opacity:0;animation:svelte-q2ay9k-sweep 1.6s ease forwards;animation-delay:calc(var(--dur) * 0.4)}.bar.first.svelte-q2ay9k.svelte-q2ay9k{background:linear-gradient(180deg, #10b981, #34d399);color:#ffffff;box-shadow:0 14px 24px rgba(16, 185, 129, 0.35)}.bar.second.svelte-q2ay9k.svelte-q2ay9k{background:linear-gradient(180deg, #34d399, #6ee7b7)}.bar.third.svelte-q2ay9k.svelte-q2ay9k{background:linear-gradient(180deg, #bbf7d0, #ecfdf5)}.podium[data-play].svelte-q2ay9k .bar.svelte-q2ay9k{animation:svelte-q2ay9k-rise var(--dur) cubic-bezier(0.22, 1, 0.36, 1) forwards,
      svelte-q2ay9k-settle 0.35s ease-out forwards;animation-delay:0s, calc(var(--dur) * 0.9)}.podium[data-play].svelte-q2ay9k .bar span.svelte-q2ay9k{animation:svelte-q2ay9k-fade-in 0.5s ease forwards;animation-delay:calc(var(--dur) * 0.7)}.podium[data-play].svelte-q2ay9k .bar.svelte-q2ay9k::after{animation:svelte-q2ay9k-sweep 1.6s ease forwards;animation-delay:calc(var(--dur) * 0.4)}@keyframes svelte-q2ay9k-rise{to{transform:scaleY(1)}}@keyframes svelte-q2ay9k-settle{0%{transform:scaleY(1.02)}100%{transform:scaleY(1)}}@keyframes svelte-q2ay9k-fade-in{to{opacity:1}}@keyframes svelte-q2ay9k-sweep{0%{opacity:0;transform:translateY(10%)}50%{opacity:0.5}100%{opacity:0;transform:translateY(-20%)}}`);
}
function hl(l, e, t) {
  const s = l.slice();
  return s[12] = e[t], s;
}
function bl(l, e) {
  let t, s, i = (
    /*item*/
    e[12].label + ""
  ), c, r, a, f;
  return {
    key: l,
    first: null,
    c() {
      t = d("div"), s = d("span"), c = z(i), r = y(), o(s, "class", "svelte-q2ay9k"), o(t, "class", a = $e(`bar ${/*item*/
      e[12].className}`) + " svelte-q2ay9k"), o(t, "style", f = `height:${/*item*/
      e[12].height}%; --dur:${/*item*/
      e[12].duration}s;`), this.first = t;
    },
    m(u, p) {
      L(u, t, p), n(t, s), n(s, c), n(t, r);
    },
    p(u, p) {
      e = u, p & /*items*/
      2 && i !== (i = /*item*/
      e[12].label + "") && M(c, i), p & /*items*/
      2 && a !== (a = $e(`bar ${/*item*/
      e[12].className}`) + " svelte-q2ay9k") && o(t, "class", a), p & /*items*/
      2 && f !== (f = `height:${/*item*/
      e[12].height}%; --dur:${/*item*/
      e[12].duration}s;`) && o(t, "style", f);
    },
    d(u) {
      u && S(t);
    }
  };
}
function ml(l) {
  let e, t = [], s = /* @__PURE__ */ new Map(), i = W(
    /*items*/
    l[1]
  );
  const c = (r) => (
    /*item*/
    r[12].key
  );
  for (let r = 0; r < i.length; r += 1) {
    let a = hl(l, i, r), f = c(a);
    s.set(f, t[r] = bl(f, a));
  }
  return {
    c() {
      e = d("div");
      for (let r = 0; r < t.length; r += 1)
        t[r].c();
      o(e, "class", "stack svelte-q2ay9k");
    },
    m(r, a) {
      L(r, e, a);
      for (let f = 0; f < t.length; f += 1)
        t[f] && t[f].m(e, null);
    },
    p(r, a) {
      a & /*items*/
      2 && (i = W(
        /*items*/
        r[1]
      ), t = Yt(t, a, c, 1, r, i, s, e, Xt, bl, null, hl));
    },
    d(r) {
      r && S(e);
      for (let a = 0; a < t.length; a += 1)
        t[a].d();
    }
  };
}
function Ci(l) {
  let e, t, s, i, c, r, a, f, u = (
    /*playId*/
    l[0]
  ), p, v, g = ml(l);
  return {
    c() {
      e = d("div"), t = d("div"), s = y(), i = d("div"), c = d("button"), c.textContent = "Reiniciar", r = y(), a = d("button"), a.textContent = "Intercalar", f = y(), g.c(), o(t, "class", "line svelte-q2ay9k"), o(c, "class", "reset svelte-q2ay9k"), o(c, "type", "button"), o(a, "class", "swap svelte-q2ay9k"), o(a, "type", "button"), o(i, "class", "controls svelte-q2ay9k"), o(e, "class", "podium svelte-q2ay9k"), o(
        e,
        "data-play",
        /*playId*/
        l[0]
      );
    },
    m(b, m) {
      L(b, e, m), n(e, t), n(e, s), n(e, i), n(i, c), n(i, r), n(i, a), n(e, f), g.m(e, null), p || (v = [
        B(
          c,
          "click",
          /*reset*/
          l[2]
        ),
        B(
          a,
          "click",
          /*cycle*/
          l[3]
        )
      ], p = !0);
    },
    p(b, [m]) {
      m & /*playId*/
      1 && le(u, u = /*playId*/
      b[0]) ? (g.d(1), g = ml(b), g.c(), g.m(e, null)) : g.p(b, m), m & /*playId*/
      1 && o(
        e,
        "data-play",
        /*playId*/
        b[0]
      );
    },
    i: D,
    o: D,
    d(b) {
      b && S(e), g.d(b), p = !1, me(v);
    }
  };
}
function Si(l, e, t) {
  let s, { first: i = 82 } = e, { second: c = 64 } = e, { third: r = 48 } = e, { baseDuration: a = 0.9 } = e, { delayStep: f = 0.15 } = e, u = 0, p = ["second", "first", "third"];
  const v = {
    first: { label: "1", className: "first" },
    second: { label: "2", className: "second" },
    third: { label: "3", className: "third" }
  }, g = (h) => h === "first" ? i : h === "second" ? c : r, b = () => {
    t(0, u += 1);
  }, m = () => {
    t(9, p = [p[1], p[2], p[0]]), t(0, u += 1);
  };
  return l.$$set = (h) => {
    "first" in h && t(4, i = h.first), "second" in h && t(5, c = h.second), "third" in h && t(6, r = h.third), "baseDuration" in h && t(7, a = h.baseDuration), "delayStep" in h && t(8, f = h.delayStep);
  }, l.$$.update = () => {
    l.$$.dirty & /*order, baseDuration, delayStep*/
    896 && t(1, s = p.map((h, _) => ({
      key: h,
      label: v[h].label,
      className: v[h].className,
      height: g(h),
      duration: a + _ * f * 2
    })));
  }, [
    u,
    s,
    b,
    m,
    i,
    c,
    r,
    a,
    f,
    p
  ];
}
class qs extends pe {
  constructor(e) {
    super(), fe(
      this,
      e,
      Si,
      Ci,
      le,
      {
        first: 4,
        second: 5,
        third: 6,
        baseDuration: 7,
        delayStep: 8
      },
      ji
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
de(qs, { first: {}, second: {}, third: {}, baseDuration: {}, delayStep: {} }, [], [], !0);
function Li(l) {
  ce(l, "svelte-1jqbzw8", ".balloon-card.svelte-1jqbzw8{border-radius:18px;border:1px solid #e2e8f0;background:linear-gradient(180deg, #ffffff, #f8fafc);padding:16px;height:220px;display:grid;place-items:center}.scene.svelte-1jqbzw8{position:relative;width:160px;height:180px}.rope.svelte-1jqbzw8{position:absolute;left:50%;bottom:14px;width:2px;height:90px;background:var(--rope);transform-origin:bottom;transform:translateX(-50%);animation:svelte-1jqbzw8-rope-sway var(--speed) ease-in-out infinite}.anchor.svelte-1jqbzw8{position:absolute;left:50%;bottom:0;width:18px;height:18px;border-radius:999px;background:#e2e8f0;border:2px solid #cbd5f5;transform:translateX(-50%)}.balloon.svelte-1jqbzw8{position:absolute;left:50%;bottom:96px;width:64px;height:74px;border-radius:50% 50% 46% 46%;background:radial-gradient(circle at 35% 30%, #ffffff, var(--balloon));box-shadow:0 16px 26px rgba(16, 185, 129, 0.2);transform-origin:bottom center;transform:translateX(-50%);animation:svelte-1jqbzw8-float var(--speed) ease-in-out infinite}.string.svelte-1jqbzw8{position:absolute;left:50%;bottom:-26px;width:2px;height:26px;background:var(--rope);transform:translateX(-50%)}@keyframes svelte-1jqbzw8-float{0%,100%{transform:translateX(-50%) translateY(0) rotate(0deg)}50%{transform:translateX(-50%) translateY(calc(var(--lift) * -1)) rotate(var(--sway))}}@keyframes svelte-1jqbzw8-rope-sway{0%,100%{transform:translateX(-50%) rotate(0deg)}50%{transform:translateX(-50%) rotate(calc(var(--sway) * -0.4))}}");
}
function Ei(l) {
  let e, t, s;
  return {
    c() {
      e = d("div"), t = d("div"), t.innerHTML = '<div class="rope svelte-1jqbzw8"></div> <div class="anchor svelte-1jqbzw8"></div> <div class="balloon svelte-1jqbzw8"><div class="string svelte-1jqbzw8"></div></div>', o(t, "class", "scene svelte-1jqbzw8"), o(e, "class", "balloon-card svelte-1jqbzw8"), o(e, "style", s = `
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
  `) && o(e, "style", s);
    },
    i: D,
    o: D,
    d(i) {
      i && S(e);
    }
  };
}
function Ti(l, e, t) {
  let { lift: s = 18 } = e, { sway: i = 6 } = e, { speed: c = 5.5 } = e, { color: r = "#10b981" } = e, { rope: a = "#94a3b8" } = e;
  return l.$$set = (f) => {
    "lift" in f && t(0, s = f.lift), "sway" in f && t(1, i = f.sway), "speed" in f && t(2, c = f.speed), "color" in f && t(3, r = f.color), "rope" in f && t(4, a = f.rope);
  }, [s, i, c, r, a];
}
class js extends pe {
  constructor(e) {
    super(), fe(
      this,
      e,
      Ti,
      Ei,
      le,
      {
        lift: 0,
        sway: 1,
        speed: 2,
        color: 3,
        rope: 4
      },
      Li
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
de(js, { lift: {}, sway: {}, speed: {}, color: {}, rope: {} }, [], [], !0);
function Mi(l) {
  ce(l, "svelte-9cnfqg", '.wrapper.svelte-9cnfqg.svelte-9cnfqg{display:grid;grid-template-columns:28px 1fr 28px;align-items:stretch;gap:12px}.nav.svelte-9cnfqg.svelte-9cnfqg{border:1px solid #e2e8f0;background:#f8fafc;border-radius:14px;display:grid;place-items:center;height:100%;cursor:pointer;transition:transform 0.2s ease, background 0.2s ease;position:relative;overflow:hidden}.nav.svelte-9cnfqg.svelte-9cnfqg:hover{background:#e2e8f0;transform:translateY(-2px)}.nav.svelte-9cnfqg.svelte-9cnfqg::after{content:"";position:absolute;inset:0;background:linear-gradient(120deg, transparent, rgba(16, 185, 129, 0.25), transparent);transform:translateX(-120%);transition:transform 0.45s ease}.nav.svelte-9cnfqg.svelte-9cnfqg:hover::after{transform:translateX(120%)}.chevron.svelte-9cnfqg.svelte-9cnfqg{width:10px;height:28px;border-right:2px solid #475569;border-bottom:2px solid #475569;transform:rotate(-45deg)}.nav.left.svelte-9cnfqg .chevron.svelte-9cnfqg{transform:rotate(135deg)}.card.svelte-9cnfqg.svelte-9cnfqg{display:grid;grid-template-columns:72px 1fr;gap:16px;padding:18px 20px;border-radius:20px;border:1px solid #e2e8f0;background:#ffffff;box-shadow:0 14px 26px rgba(15, 23, 42, 0.08);transition:transform 0.35s ease, box-shadow 0.35s ease}.card.svelte-9cnfqg.svelte-9cnfqg:hover{transform:translateY(-4px);box-shadow:0 18px 34px rgba(15, 23, 42, 0.16)}.icon.svelte-9cnfqg.svelte-9cnfqg{width:56px;height:56px;border-radius:16px;background:#f8fafc;display:grid;place-items:center}.ladder.svelte-9cnfqg.svelte-9cnfqg{width:28px;height:36px;border:3px solid #7c5c4f;border-left-width:5px;border-right-width:5px;border-radius:6px;position:relative}.ladder.svelte-9cnfqg span.svelte-9cnfqg{position:absolute;left:2px;right:2px;height:4px;background:#7c5c4f;border-radius:999px;animation:svelte-9cnfqg-rung 2.8s ease-in-out infinite}.ladder.svelte-9cnfqg span.svelte-9cnfqg:nth-child(1){top:6px;animation-delay:0s}.ladder.svelte-9cnfqg span.svelte-9cnfqg:nth-child(2){top:14px;animation-delay:0.2s}.ladder.svelte-9cnfqg span.svelte-9cnfqg:nth-child(3){top:22px;animation-delay:0.4s}.ladder.svelte-9cnfqg span.svelte-9cnfqg:nth-child(4){top:30px;animation-delay:0.6s}.content.svelte-9cnfqg.svelte-9cnfqg{display:grid;gap:8px}.panel.svelte-9cnfqg.svelte-9cnfqg{animation:svelte-9cnfqg-slide-in 0.4s ease}.row.svelte-9cnfqg.svelte-9cnfqg{display:flex;align-items:center;justify-content:space-between;gap:12px}.title.svelte-9cnfqg.svelte-9cnfqg{display:flex;align-items:baseline;gap:12px}.title.svelte-9cnfqg strong.svelte-9cnfqg{font-size:18px;color:#0f172a}.title.svelte-9cnfqg span.svelte-9cnfqg{font-size:14px;color:#64748b}.level-text.svelte-9cnfqg.svelte-9cnfqg{font-size:14px;color:#64748b;animation:svelte-9cnfqg-level-pop 0.35s ease}.pill.svelte-9cnfqg.svelte-9cnfqg{padding:6px 14px;background:#eef2ff;color:#1e3a8a;border-radius:999px;font-size:12px;font-weight:600}.desc.svelte-9cnfqg.svelte-9cnfqg{margin:0;font-size:14px;color:#0f172a}.meta.svelte-9cnfqg.svelte-9cnfqg{font-size:13px;color:#475569}.xp.svelte-9cnfqg.svelte-9cnfqg{font-weight:600;color:#047857}.progress.svelte-9cnfqg.svelte-9cnfqg{position:relative;height:12px;border-radius:999px;background:#f1f5f9;overflow:hidden}.bar.svelte-9cnfqg.svelte-9cnfqg{height:100%;width:var(--fill);background:linear-gradient(90deg, #10b981, #34d399);transition:width 0.8s cubic-bezier(0.22, 1, 0.36, 1)}.glow.svelte-9cnfqg.svelte-9cnfqg{position:absolute;inset:0;background:linear-gradient(90deg, rgba(16, 185, 129, 0), rgba(16, 185, 129, 0.35), rgba(16, 185, 129, 0));transform:translateX(-100%);animation:svelte-9cnfqg-sweep 3.2s ease-in-out infinite}@keyframes svelte-9cnfqg-sweep{0%,60%{transform:translateX(-100%)}100%{transform:translateX(100%)}}@keyframes svelte-9cnfqg-level-pop{0%{opacity:0;transform:translateY(4px)}100%{opacity:1;transform:translateY(0)}}@keyframes svelte-9cnfqg-rung{0%,100%{opacity:0.6}50%{opacity:1}}@keyframes svelte-9cnfqg-slide-in{from{opacity:0;transform:translateX(calc(var(--dir) * 12px))}to{opacity:1;transform:translateX(0)}}');
}
function _l(l) {
  let e, t, s, i, c, r, a, f, u, p, v, g, b, m, h, _, q, A, k, x, E, w, j, T, R, N, O, P, F, I, G, $, ve, ie, ne;
  return {
    c() {
      e = d("div"), t = d("div"), s = d("div"), i = d("strong"), c = z(
        /*title*/
        l[0]
      ), r = y(), a = d("span"), f = z("Nivel "), u = z(
        /*activeLevel*/
        l[4]
      ), p = z("/"), v = z(
        /*safeLevelTotal*/
        l[5]
      ), g = y(), b = d("div"), m = z(
        /*status*/
        l[3]
      ), h = y(), _ = d("p"), q = z(
        /*description*/
        l[1]
      ), A = y(), k = d("div"), x = d("span"), E = z("Progreso: "), w = z(
        /*safeProgress*/
        l[7]
      ), j = z(" / "), T = z(
        /*safeTotal*/
        l[6]
      ), R = y(), N = d("span"), O = z("+"), P = z(
        /*xp*/
        l[2]
      ), F = z(" XP"), I = y(), G = d("div"), $ = d("div"), ie = y(), ne = d("div"), o(i, "class", "svelte-9cnfqg"), o(a, "class", "level-text svelte-9cnfqg"), o(s, "class", "title svelte-9cnfqg"), o(b, "class", "pill svelte-9cnfqg"), o(t, "class", "row svelte-9cnfqg"), o(_, "class", "desc svelte-9cnfqg"), o(N, "class", "xp svelte-9cnfqg"), o(k, "class", "row meta svelte-9cnfqg"), o($, "class", "bar svelte-9cnfqg"), o($, "style", ve = `--fill:${/*percent*/
      l[9]}%`), o(ne, "class", "glow svelte-9cnfqg"), o(G, "class", "progress svelte-9cnfqg"), o(e, "class", "panel svelte-9cnfqg");
    },
    m(J, U) {
      L(J, e, U), n(e, t), n(t, s), n(s, i), n(i, c), n(s, r), n(s, a), n(a, f), n(a, u), n(a, p), n(a, v), n(t, g), n(t, b), n(b, m), n(e, h), n(e, _), n(_, q), n(e, A), n(e, k), n(k, x), n(x, E), n(x, w), n(x, j), n(x, T), n(k, R), n(k, N), n(N, O), n(N, P), n(N, F), n(e, I), n(e, G), n(G, $), n(G, ie), n(G, ne);
    },
    p(J, U) {
      U & /*title*/
      1 && M(
        c,
        /*title*/
        J[0]
      ), U & /*activeLevel*/
      16 && M(
        u,
        /*activeLevel*/
        J[4]
      ), U & /*safeLevelTotal*/
      32 && M(
        v,
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
        w,
        /*safeProgress*/
        J[7]
      ), U & /*safeTotal*/
      64 && M(
        T,
        /*safeTotal*/
        J[6]
      ), U & /*xp*/
      4 && M(
        P,
        /*xp*/
        J[2]
      ), U & /*percent*/
      512 && ve !== (ve = `--fill:${/*percent*/
      J[9]}%`) && o($, "style", ve);
    },
    d(J) {
      J && S(e);
    }
  };
}
function Ai(l) {
  let e, t, s, i, c, r, a, f = (
    /*activeLevel*/
    l[4]
  ), u, p, v, g, b, m = _l(l);
  return {
    c() {
      e = d("div"), t = d("button"), t.innerHTML = '<span class="chevron svelte-9cnfqg"></span>', s = y(), i = d("div"), c = d("div"), c.innerHTML = '<div class="ladder svelte-9cnfqg"><span class="svelte-9cnfqg"></span> <span class="svelte-9cnfqg"></span> <span class="svelte-9cnfqg"></span> <span class="svelte-9cnfqg"></span></div>', r = y(), a = d("div"), m.c(), p = y(), v = d("button"), v.innerHTML = '<span class="chevron svelte-9cnfqg"></span>', o(t, "class", "nav left svelte-9cnfqg"), o(t, "type", "button"), o(t, "aria-label", "Nivel anterior"), o(c, "class", "icon svelte-9cnfqg"), o(a, "class", "content svelte-9cnfqg"), o(a, "style", u = `--dir:${/*slideDir*/
      l[8]}`), o(i, "class", "card svelte-9cnfqg"), o(v, "class", "nav right svelte-9cnfqg"), o(v, "type", "button"), o(v, "aria-label", "Nivel siguiente"), o(e, "class", "wrapper svelte-9cnfqg");
    },
    m(h, _) {
      L(h, e, _), n(e, t), n(e, s), n(e, i), n(i, c), n(i, r), n(i, a), m.m(a, null), n(e, p), n(e, v), g || (b = [
        B(
          t,
          "click",
          /*click_handler*/
          l[17]
        ),
        B(
          v,
          "click",
          /*click_handler_1*/
          l[18]
        )
      ], g = !0);
    },
    p(h, [_]) {
      _ & /*activeLevel*/
      16 && le(f, f = /*activeLevel*/
      h[4]) ? (m.d(1), m = _l(h), m.c(), m.m(a, null)) : m.p(h, _), _ & /*slideDir*/
      256 && u !== (u = `--dir:${/*slideDir*/
      h[8]}`) && o(a, "style", u);
    },
    i: D,
    o: D,
    d(h) {
      h && S(e), m.d(h), g = !1, me(b);
    }
  };
}
function Ni(l, e, t) {
  let s, i, c, r, a, { title: f = "Nivel 5" } = e, { subtitle: u = "Nivel 1/3" } = e, { description: p = "Alcanza nivel 5 de usuario." } = e, { progress: v = 4 } = e, { total: g = 5 } = e, { xp: b = 15 } = e, { status: m = "En progreso" } = e, { levelIndex: h = 1 } = e, { levelTotal: _ = 3 } = e;
  const q = (j, T, R) => Math.min(R, Math.max(T, j));
  let A = q(h, 1, a), k = 1;
  const x = (j) => {
    t(8, k = j >= 0 ? 1 : -1), t(4, A = q(A + j, 1, a));
  }, E = () => x(-1), w = () => x(1);
  return l.$$set = (j) => {
    "title" in j && t(0, f = j.title), "subtitle" in j && t(11, u = j.subtitle), "description" in j && t(1, p = j.description), "progress" in j && t(12, v = j.progress), "total" in j && t(13, g = j.total), "xp" in j && t(2, b = j.xp), "status" in j && t(3, m = j.status), "levelIndex" in j && t(14, h = j.levelIndex), "levelTotal" in j && t(15, _ = j.levelTotal);
  }, l.$$.update = () => {
    l.$$.dirty & /*total*/
    8192 && t(6, s = Math.max(1, g)), l.$$.dirty & /*progress, safeTotal*/
    4160 && t(7, i = q(v, 0, s)), l.$$.dirty & /*safeProgress, safeTotal*/
    192 && t(16, c = i / s), l.$$.dirty & /*ratio*/
    65536 && t(9, r = Math.round(c * 100)), l.$$.dirty & /*levelTotal*/
    32768 && t(5, a = Math.max(1, _)), l.$$.dirty & /*levelIndex, activeLevel, safeLevelTotal*/
    16432 && h !== A && t(4, A = q(h, 1, a));
  }, [
    f,
    p,
    b,
    m,
    A,
    a,
    s,
    i,
    k,
    r,
    x,
    u,
    v,
    g,
    h,
    _,
    c,
    E,
    w
  ];
}
class Cs extends pe {
  constructor(e) {
    super(), fe(
      this,
      e,
      Ni,
      Ai,
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
      Mi
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
de(Cs, { title: {}, subtitle: {}, description: {}, progress: {}, total: {}, xp: {}, status: {}, levelIndex: {}, levelTotal: {} }, [], [], !0);
function Ri(l) {
  ce(l, "svelte-12k2sv8", ".card.svelte-12k2sv8{position:relative;border-radius:18px;border:1px solid #e2e8f0;background:linear-gradient(160deg, #ffffff, #ecfdf5);padding:18px;overflow:hidden;transform:perspective(800px) rotateX(var(--rx)) rotateY(var(--ry));transition:transform 0.2s ease;box-shadow:0 18px 32px rgba(15, 23, 42, 0.12)}.shine.svelte-12k2sv8{position:absolute;inset:0;background:radial-gradient(circle at var(--shine) 20%, rgba(16, 185, 129, 0.22), transparent 55%);pointer-events:none}.content.svelte-12k2sv8{position:relative;display:grid;gap:6px}.title.svelte-12k2sv8{margin:0;font-size:12px;color:#64748b;letter-spacing:0.08em;text-transform:uppercase}.value.svelte-12k2sv8{margin:0;font-size:28px;font-weight:700;color:#0f172a}.hint.svelte-12k2sv8{margin:0;font-size:12px;color:#475569}");
}
function Ii(l) {
  let e, t, s, i, c, r, a, f, u, p, v, g, b, m, h;
  return {
    c() {
      e = d("div"), t = d("div"), s = y(), i = d("div"), c = d("p"), r = z(
        /*title*/
        l[0]
      ), a = y(), f = d("p"), u = z(
        /*value*/
        l[1]
      ), p = y(), v = d("p"), g = z(
        /*hint*/
        l[2]
      ), o(t, "class", "shine svelte-12k2sv8"), o(c, "class", "title svelte-12k2sv8"), o(f, "class", "value svelte-12k2sv8"), o(v, "class", "hint svelte-12k2sv8"), o(i, "class", "content svelte-12k2sv8"), o(e, "class", "card svelte-12k2sv8"), o(e, "style", b = `--rx:${/*rx*/
      l[3]}deg; --ry:${/*ry*/
      l[4]}deg; --shine:${/*shine*/
      l[5]}%`);
    },
    m(_, q) {
      L(_, e, q), n(e, t), n(e, s), n(e, i), n(i, c), n(c, r), n(i, a), n(i, f), n(f, u), n(i, p), n(i, v), n(v, g), m || (h = [
        B(
          e,
          "pointermove",
          /*handleMove*/
          l[6]
        ),
        B(
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
        u,
        /*value*/
        _[1]
      ), q & /*hint*/
      4 && M(
        g,
        /*hint*/
        _[2]
      ), q & /*rx, ry, shine*/
      56 && b !== (b = `--rx:${/*rx*/
      _[3]}deg; --ry:${/*ry*/
      _[4]}deg; --shine:${/*shine*/
      _[5]}%`) && o(e, "style", b);
    },
    i: D,
    o: D,
    d(_) {
      _ && S(e), m = !1, me(h);
    }
  };
}
function Pi(l, e, t) {
  let { title: s = "Pulso Focus" } = e, { value: i = "78%" } = e, { hint: c = "Calma sostenida" } = e, { intensity: r = 10 } = e, a = 0, f = 0, u = 0;
  const p = (g) => {
    const b = g.currentTarget.getBoundingClientRect(), m = (g.clientX - b.left) / b.width - 0.5, h = (g.clientY - b.top) / b.height - 0.5;
    t(3, a = h * r * -1), t(4, f = m * r), t(5, u = (m + h + 1) * 25);
  }, v = () => {
    t(3, a = 0), t(4, f = 0), t(5, u = 0);
  };
  return l.$$set = (g) => {
    "title" in g && t(0, s = g.title), "value" in g && t(1, i = g.value), "hint" in g && t(2, c = g.hint), "intensity" in g && t(8, r = g.intensity);
  }, [s, i, c, a, f, u, p, v, r];
}
class Ss extends pe {
  constructor(e) {
    super(), fe(
      this,
      e,
      Pi,
      Ii,
      le,
      {
        title: 0,
        value: 1,
        hint: 2,
        intensity: 8
      },
      Ri
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
de(Ss, { title: {}, value: {}, hint: {}, intensity: {} }, [], [], !0);
function Di(l) {
  ce(l, "svelte-1czrcz8", '.counter.svelte-1czrcz8{border-radius:16px;border:1px solid #e2e8f0;padding:16px;background:#ffffff;display:grid;gap:10px;box-shadow:0 12px 22px rgba(15, 23, 42, 0.08)}.label.svelte-1czrcz8{margin:0;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.08em}.value.svelte-1czrcz8{font-size:32px;font-weight:700;color:#0f172a;position:relative;animation:svelte-1czrcz8-flip 0.5s ease}.value.svelte-1czrcz8::after{content:"";position:absolute;left:0;right:0;bottom:-4px;height:3px;border-radius:999px;background:var(--tone);animation:svelte-1czrcz8-sweep 0.6s ease}@keyframes svelte-1czrcz8-flip{0%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:translateY(0)}}@keyframes svelte-1czrcz8-sweep{from{transform:scaleX(0.2)}to{transform:scaleX(1)}}');
}
function xl(l) {
  let e, t;
  return {
    c() {
      e = d("div"), t = z(
        /*value*/
        l[1]
      ), o(e, "class", "value svelte-1czrcz8");
    },
    m(s, i) {
      L(s, e, i), n(e, t);
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
function Xi(l) {
  let e, t, s, i, c = (
    /*value*/
    l[1]
  ), r, a = xl(l);
  return {
    c() {
      e = d("div"), t = d("p"), s = z(
        /*label*/
        l[0]
      ), i = y(), a.c(), o(t, "class", "label svelte-1czrcz8"), o(e, "class", "counter svelte-1czrcz8"), o(e, "style", r = `--tone:${/*tone*/
      l[2]}`);
    },
    m(f, u) {
      L(f, e, u), n(e, t), n(t, s), n(e, i), a.m(e, null);
    },
    p(f, [u]) {
      u & /*label*/
      1 && M(
        s,
        /*label*/
        f[0]
      ), u & /*value*/
      2 && le(c, c = /*value*/
      f[1]) ? (a.d(1), a = xl(f), a.c(), a.m(e, null)) : a.p(f, u), u & /*tone*/
      4 && r !== (r = `--tone:${/*tone*/
      f[2]}`) && o(e, "style", r);
    },
    i: D,
    o: D,
    d(f) {
      f && S(e), a.d(f);
    }
  };
}
function Yi(l, e, t) {
  let { label: s = "Sesiones" } = e, { value: i = 12 } = e, { tone: c = "#10b981" } = e;
  return l.$$set = (r) => {
    "label" in r && t(0, s = r.label), "value" in r && t(1, i = r.value), "tone" in r && t(2, c = r.tone);
  }, [s, i, c];
}
class Ls extends pe {
  constructor(e) {
    super(), fe(this, e, Yi, Xi, le, { label: 0, value: 1, tone: 2 }, Di);
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
de(Ls, { label: {}, value: {}, tone: {} }, [], [], !0);
function Hi(l) {
  ce(l, "svelte-pocpcm", ".stack.svelte-pocpcm{position:relative;height:160px;border-radius:18px;border:1px solid #e2e8f0;background:linear-gradient(140deg, #ffffff, #ecfdf5);overflow:hidden;transform:perspective(900px) rotateX(var(--rx)) rotateY(var(--ry));transition:transform 0.2s ease}.bg.svelte-pocpcm{position:absolute;inset:0;background:radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.15), transparent 60%)}.layer.svelte-pocpcm{position:absolute;border-radius:999px;filter:blur(calc(var(--blur) * 10px));opacity:0.75}.layer-a.svelte-pocpcm{width:120px;height:120px;background:rgba(16, 185, 129, 0.45);transform:translate(calc(var(--px) * 0.6), calc(var(--py) * 0.6));top:20px;left:14px}.layer-b.svelte-pocpcm{width:90px;height:90px;background:rgba(52, 211, 153, 0.5);transform:translate(calc(var(--px) * 1.2), calc(var(--py) * 1.2));bottom:18px;right:20px}.layer-c.svelte-pocpcm{width:70px;height:70px;background:rgba(14, 116, 144, 0.3);transform:translate(calc(var(--px) * 1.6), calc(var(--py) * 1.6));top:30px;right:70px}.label.svelte-pocpcm{position:absolute;left:16px;bottom:14px;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#0f172a;background:rgba(255, 255, 255, 0.7);padding:4px 8px;border-radius:999px}");
}
function Bi(l) {
  let e, t, s, i, c, r, a, f, u, p, v, g, b, m;
  return {
    c() {
      e = d("div"), t = d("div"), s = y(), i = d("div"), c = y(), r = d("div"), a = y(), f = d("div"), u = y(), p = d("div"), v = z(
        /*title*/
        l[0]
      ), o(t, "class", "bg svelte-pocpcm"), o(i, "class", "layer layer-a svelte-pocpcm"), o(r, "class", "layer layer-b svelte-pocpcm"), o(f, "class", "layer layer-c svelte-pocpcm"), o(p, "class", "label svelte-pocpcm"), o(e, "class", "stack svelte-pocpcm"), o(e, "style", g = `--rx:${/*rx*/
      l[2]}deg; --ry:${/*ry*/
      l[3]}deg; --px:${/*px*/
      l[4]}px; --py:${/*py*/
      l[5]}px; --blur:${/*blurAmount*/
      l[1]}`);
    },
    m(h, _) {
      L(h, e, _), n(e, t), n(e, s), n(e, i), n(e, c), n(e, r), n(e, a), n(e, f), n(e, u), n(e, p), n(p, v), b || (m = [
        B(
          e,
          "pointermove",
          /*handleMove*/
          l[6]
        ),
        B(
          e,
          "pointerleave",
          /*reset*/
          l[7]
        )
      ], b = !0);
    },
    p(h, [_]) {
      _ & /*title*/
      1 && M(
        v,
        /*title*/
        h[0]
      ), _ & /*rx, ry, px, py, blurAmount*/
      62 && g !== (g = `--rx:${/*rx*/
      h[2]}deg; --ry:${/*ry*/
      h[3]}deg; --px:${/*px*/
      h[4]}px; --py:${/*py*/
      h[5]}px; --blur:${/*blurAmount*/
      h[1]}`) && o(e, "style", g);
    },
    i: D,
    o: D,
    d(h) {
      h && S(e), b = !1, me(m);
    }
  };
}
function Oi(l, e, t) {
  let { title: s = "Capas activas" } = e, { intensity: i = 18 } = e, { blurAmount: c = 0.6 } = e, r = 0, a = 0, f = 0, u = 0;
  const p = (g) => {
    const b = g.currentTarget.getBoundingClientRect(), m = (g.clientX - b.left) / b.width - 0.5, h = (g.clientY - b.top) / b.height - 0.5;
    t(2, r = h * i * -1), t(3, a = m * i), t(4, f = m * 24), t(5, u = h * 24);
  }, v = () => {
    t(2, r = 0), t(3, a = 0), t(4, f = 0), t(5, u = 0);
  };
  return l.$$set = (g) => {
    "title" in g && t(0, s = g.title), "intensity" in g && t(8, i = g.intensity), "blurAmount" in g && t(1, c = g.blurAmount);
  }, [s, c, r, a, f, u, p, v, i];
}
class Es extends pe {
  constructor(e) {
    super(), fe(this, e, Oi, Bi, le, { title: 0, intensity: 8, blurAmount: 1 }, Hi);
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
de(Es, { title: {}, intensity: {}, blurAmount: {} }, [], [], !0);
function Fi(l) {
  ce(l, "svelte-1yc0e5f", `:host{display:block;font-family:'Poppins', 'Manrope', 'Segoe UI', system-ui, sans-serif}.card-shell.svelte-1yc0e5f.svelte-1yc0e5f{position:relative;padding-bottom:18px}.card.svelte-1yc0e5f.svelte-1yc0e5f{position:relative;z-index:1;background:#ffffff;border-radius:16px;overflow:hidden;border:2px solid transparent;box-shadow:0 12px 24px rgba(15, 23, 42, 0.08);transition:transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;cursor:pointer}.card.svelte-1yc0e5f.svelte-1yc0e5f:hover{transform:translateY(-2px);box-shadow:0 18px 32px rgba(15, 23, 42, 0.12),
      0 0 0 2px color-mix(in srgb, var(--category-left) 55%, transparent),
      0 12px 24px color-mix(in srgb, var(--category-right) 35%, transparent)}.card.is-selected.svelte-1yc0e5f.svelte-1yc0e5f{border-color:#10b981;transform:scale(0.99)}.card.is-disabled.svelte-1yc0e5f.svelte-1yc0e5f{opacity:0.5;cursor:not-allowed;pointer-events:none}.thumb.svelte-1yc0e5f.svelte-1yc0e5f{position:relative;background:#f1f5f9;aspect-ratio:16 / 9;overflow:hidden}.thumb.svelte-1yc0e5f img.svelte-1yc0e5f{width:100%;height:100%;object-fit:cover;display:block}.thumb-placeholder.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;inset:0;display:grid;place-items:center;font-size:28px;color:#94a3b8}.thumb-overlay.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;inset:0;background:linear-gradient(180deg, rgba(15, 23, 42, 0) 50%, rgba(15, 23, 42, 0.55) 100%);opacity:0;transition:opacity 0.2s ease}.card.svelte-1yc0e5f:hover .thumb-overlay.svelte-1yc0e5f{opacity:1}.pill-row.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;top:8px;left:8px;display:flex;gap:6px}.pill.svelte-1yc0e5f.svelte-1yc0e5f{padding:4px 8px;border-radius:999px;background:rgba(15, 23, 42, 0.6);color:#ffffff;font-size:11px;font-weight:600}.pill.badge.svelte-1yc0e5f.svelte-1yc0e5f{background:rgba(15, 23, 42, 0.75);text-transform:uppercase;letter-spacing:0.5px}.favorite.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;top:8px;right:8px;border:none;background:rgba(15, 23, 42, 0.35);color:#ffffff;width:30px;height:30px;border-radius:999px;display:grid;place-items:center;cursor:pointer;transition:background 0.2s ease, transform 0.2s ease, color 0.2s ease}.favorite.svelte-1yc0e5f svg.svelte-1yc0e5f{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.6}.favorite.active.svelte-1yc0e5f.svelte-1yc0e5f{background:rgba(255, 255, 255, 0.9);color:#ef4444}.favorite.active.svelte-1yc0e5f svg.svelte-1yc0e5f{fill:currentColor;stroke:none}.favorite.svelte-1yc0e5f.svelte-1yc0e5f:hover{transform:scale(1.05)}.check.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;bottom:8px;left:8px;width:26px;height:26px;border-radius:999px;background:rgba(255, 255, 255, 0.9);border:1px solid #e2e8f0;display:grid;place-items:center;transition:background 0.2s ease, border-color 0.2s ease}.check.svelte-1yc0e5f svg.svelte-1yc0e5f{width:16px;height:16px;fill:#ffffff;opacity:0;transform:scale(0.7);transition:opacity 0.2s ease, transform 0.2s ease}.card.is-selected.svelte-1yc0e5f .check.svelte-1yc0e5f{background:#10b981;border-color:#059669}.card.is-selected.svelte-1yc0e5f .check svg.svelte-1yc0e5f{opacity:1;transform:scale(1)}.body.svelte-1yc0e5f.svelte-1yc0e5f{padding:16px;display:grid;gap:8px}.body.svelte-1yc0e5f h3.svelte-1yc0e5f{margin:0;font-size:15px;font-weight:700;color:#0f172a}.body.svelte-1yc0e5f p.svelte-1yc0e5f{margin:0;font-size:13px;color:#64748b;min-height:34px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.cta.svelte-1yc0e5f.svelte-1yc0e5f{padding:8px 10px;border-radius:10px;text-align:center;font-size:12px;font-weight:600;color:#64748b;background:#f1f5f9;transition:background 0.2s ease, color 0.2s ease}.card.svelte-1yc0e5f:hover .cta.svelte-1yc0e5f{background:#e2e8f0}.cta-selected.svelte-1yc0e5f.svelte-1yc0e5f{background:#d1fae5;color:#047857}.category-lift.svelte-1yc0e5f.svelte-1yc0e5f{position:absolute;left:16px;right:16px;bottom:-12px;display:flex;justify-content:center;gap:8px;z-index:0;pointer-events:none;transform:translateY(14px);opacity:0;transition:transform 0.25s ease, opacity 0.2s ease}.category-chip.svelte-1yc0e5f.svelte-1yc0e5f{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:0.4px;color:#ffffff;text-transform:uppercase;background:var(--chip-color);box-shadow:0 10px 20px color-mix(in srgb, var(--chip-color) 35%, transparent)}.card-shell.svelte-1yc0e5f:hover .category-lift.svelte-1yc0e5f,.card-shell.svelte-1yc0e5f:focus-within .category-lift.svelte-1yc0e5f{opacity:1;transform:translateY(0)}`);
}
function Vi(l) {
  let e;
  return {
    c() {
      e = d("div"), e.textContent = "▶", o(e, "class", "thumb-placeholder svelte-1yc0e5f");
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
function Ui(l) {
  let e, t, s;
  return {
    c() {
      e = d("img"), Ae(e.src, t = /*thumbnail*/
      l[3]) || o(e, "src", t), o(e, "alt", s = `Miniatura de ${/*title*/
      l[0]}`), o(e, "loading", "lazy"), o(e, "class", "svelte-1yc0e5f");
    },
    m(i, c) {
      L(i, e, c);
    },
    p(i, c) {
      c & /*thumbnail*/
      8 && !Ae(e.src, t = /*thumbnail*/
      i[3]) && o(e, "src", t), c & /*title*/
      1 && s !== (s = `Miniatura de ${/*title*/
      i[0]}`) && o(e, "alt", s);
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
      ), o(e, "class", "pill badge svelte-1yc0e5f");
    },
    m(s, i) {
      L(s, e, i), n(e, t);
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
      ), c = y(), r && r.c(), o(t, "class", "category-chip svelte-1yc0e5f"), o(t, "style", i = `--chip-color: ${/*categoryLeftColor*/
      l[10]};`), o(e, "class", "category-lift svelte-1yc0e5f"), o(e, "aria-hidden", "true");
    },
    m(a, f) {
      L(a, e, f), n(e, t), n(t, s), n(e, c), r && r.m(e, null);
    },
    p(a, f) {
      f & /*categoryLeft*/
      256 && M(
        s,
        /*categoryLeft*/
        a[8]
      ), f & /*categoryLeftColor*/
      1024 && i !== (i = `--chip-color: ${/*categoryLeftColor*/
      a[10]};`) && o(t, "style", i), /*categoryRight*/
      a[9] ? r ? r.p(a, f) : (r = wl(a), r.c(), r.m(e, null)) : r && (r.d(1), r = null);
    },
    d(a) {
      a && S(e), r && r.d();
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
      ), o(e, "class", "category-chip svelte-1yc0e5f"), o(e, "style", s = `--chip-color: ${/*categoryRightColor*/
      l[11]};`);
    },
    m(i, c) {
      L(i, e, c), n(e, t);
    },
    p(i, c) {
      c & /*categoryRight*/
      512 && M(
        t,
        /*categoryRight*/
        i[9]
      ), c & /*categoryRightColor*/
      2048 && s !== (s = `--chip-color: ${/*categoryRightColor*/
      i[11]};`) && o(e, "style", s);
    },
    d(i) {
      i && S(e);
    }
  };
}
function Gi(l) {
  let e, t, s, i, c, r, a, f, u, p, v, g, b, m, h, _, q, A, k, x, E, w, j, T, R, N, O, P = (
    /*selected*/
    l[4] ? "Seleccionado" : "Seleccionar video"
  ), F, I, G, $, ve, ie, ne, J;
  function U(H, K) {
    return (
      /*thumbnail*/
      H[3] ? Ui : Vi
    );
  }
  let _e = U(l), ee = _e(l), Q = (
    /*badge*/
    l[6] && yl(l)
  ), te = (
    /*categoryLeft*/
    l[8] && kl(l)
  );
  return {
    c() {
      e = d("div"), t = d("div"), s = d("div"), ee.c(), i = y(), c = d("div"), r = y(), a = d("div"), f = d("div"), u = z(
        /*duration*/
        l[2]
      ), p = y(), Q && Q.c(), v = y(), g = d("button"), b = al("svg"), m = al("path"), q = y(), A = d("div"), A.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" class="svelte-1yc0e5f"><path d="M9.2 16.2L5.7 12.7l1.4-1.4 2.1 2.1 7.7-7.7 1.4 1.4z"></path></svg>', k = y(), x = d("div"), E = d("h3"), w = z(
        /*title*/
        l[0]
      ), j = y(), T = d("p"), R = z(
        /*description*/
        l[1]
      ), N = y(), O = d("div"), F = z(P), ve = y(), te && te.c(), o(c, "class", "thumb-overlay svelte-1yc0e5f"), o(f, "class", "pill svelte-1yc0e5f"), o(a, "class", "pill-row svelte-1yc0e5f"), o(m, "d", "M12.1 21.2c-0.1 0-0.3 0-0.4-0.1C6.1 18.6 2 15 2 10.4 2 7.6 4.3 5.3 7.1 5.3c1.7 0 3.3 0.8 4.3 2.1 1-1.3 2.6-2.1 4.3-2.1 2.8 0 5.1 2.3 5.1 5.1 0 4.6-4.1 8.2-9.7 10.7-0.1 0-0.2 0.1-0.3 0.1z"), o(b, "viewBox", "0 0 24 24"), o(b, "aria-hidden", "true"), o(b, "class", "svelte-1yc0e5f"), o(g, "class", h = "favorite " + /*favorite*/
      (l[7] ? "active" : "") + " svelte-1yc0e5f"), o(g, "aria-label", _ = /*favorite*/
      l[7] ? "Quitar de favoritos" : "Anadir a favoritos"), o(A, "class", "check svelte-1yc0e5f"), o(s, "class", "thumb svelte-1yc0e5f"), o(E, "class", "svelte-1yc0e5f"), o(T, "class", "svelte-1yc0e5f"), o(O, "class", I = "cta " + /*selected*/
      (l[4] ? "cta-selected" : "") + " svelte-1yc0e5f"), o(x, "class", "body svelte-1yc0e5f"), o(t, "class", G = "card " + /*selected*/
      (l[4] ? "is-selected" : "") + " " + /*disabled*/
      (l[5] ? "is-disabled" : "") + " svelte-1yc0e5f"), o(t, "role", "button"), o(
        t,
        "aria-disabled",
        /*disabled*/
        l[5]
      ), o(t, "tabindex", $ = /*disabled*/
      l[5] ? -1 : 0), o(e, "class", "card-shell svelte-1yc0e5f"), o(e, "style", ie = `--category-left: ${/*categoryLeftColor*/
      l[10]}; --category-right: ${/*categoryRightColor*/
      l[11]};`);
    },
    m(H, K) {
      L(H, e, K), n(e, t), n(t, s), ee.m(s, null), n(s, i), n(s, c), n(s, r), n(s, a), n(a, f), n(f, u), n(a, p), Q && Q.m(a, null), n(s, v), n(s, g), n(g, b), n(b, m), n(s, q), n(s, A), n(t, k), n(t, x), n(x, E), n(E, w), n(x, j), n(x, T), n(T, R), n(x, N), n(x, O), n(O, F), n(e, ve), te && te.m(e, null), ne || (J = [
        B(
          g,
          "click",
          /*handleFavorite*/
          l[13]
        ),
        B(
          t,
          "click",
          /*handleSelect*/
          l[12]
        ),
        B(
          t,
          "keydown",
          /*handleKeyDown*/
          l[14]
        )
      ], ne = !0);
    },
    p(H, [K]) {
      _e === (_e = U(H)) && ee ? ee.p(H, K) : (ee.d(1), ee = _e(H), ee && (ee.c(), ee.m(s, i))), K & /*duration*/
      4 && M(
        u,
        /*duration*/
        H[2]
      ), /*badge*/
      H[6] ? Q ? Q.p(H, K) : (Q = yl(H), Q.c(), Q.m(a, null)) : Q && (Q.d(1), Q = null), K & /*favorite*/
      128 && h !== (h = "favorite " + /*favorite*/
      (H[7] ? "active" : "") + " svelte-1yc0e5f") && o(g, "class", h), K & /*favorite*/
      128 && _ !== (_ = /*favorite*/
      H[7] ? "Quitar de favoritos" : "Anadir a favoritos") && o(g, "aria-label", _), K & /*title*/
      1 && M(
        w,
        /*title*/
        H[0]
      ), K & /*description*/
      2 && M(
        R,
        /*description*/
        H[1]
      ), K & /*selected*/
      16 && P !== (P = /*selected*/
      H[4] ? "Seleccionado" : "Seleccionar video") && M(F, P), K & /*selected*/
      16 && I !== (I = "cta " + /*selected*/
      (H[4] ? "cta-selected" : "") + " svelte-1yc0e5f") && o(O, "class", I), K & /*selected, disabled*/
      48 && G !== (G = "card " + /*selected*/
      (H[4] ? "is-selected" : "") + " " + /*disabled*/
      (H[5] ? "is-disabled" : "") + " svelte-1yc0e5f") && o(t, "class", G), K & /*disabled*/
      32 && o(
        t,
        "aria-disabled",
        /*disabled*/
        H[5]
      ), K & /*disabled*/
      32 && $ !== ($ = /*disabled*/
      H[5] ? -1 : 0) && o(t, "tabindex", $), /*categoryLeft*/
      H[8] ? te ? te.p(H, K) : (te = kl(H), te.c(), te.m(e, null)) : te && (te.d(1), te = null), K & /*categoryLeftColor, categoryRightColor*/
      3072 && ie !== (ie = `--category-left: ${/*categoryLeftColor*/
      H[10]}; --category-right: ${/*categoryRightColor*/
      H[11]};`) && o(e, "style", ie);
    },
    i: D,
    o: D,
    d(H) {
      H && S(e), ee.d(), Q && Q.d(), te && te.d(), ne = !1, me(J);
    }
  };
}
function $i(l, e, t) {
  let { videoId: s = "" } = e, { hashedId: i = "" } = e, { title: c = "" } = e, { description: r = "" } = e, { duration: a = "" } = e, { thumbnail: f = "" } = e, { selected: u = !1 } = e, { disabled: p = !1 } = e, { badge: v = "" } = e, { tags: g = [] } = e, { favorite: b = !1 } = e, { categoryLeft: m = "" } = e, { categoryRight: h = "" } = e, { categoryLeftColor: _ = "#94a3b8" } = e, { categoryRightColor: q = "#94a3b8" } = e;
  const A = Le(), k = () => {
    p || A("select", { id: s });
  }, x = (w) => {
    w.stopPropagation(), !p && A("favorite", { hashedId: i });
  }, E = (w) => {
    p || (w.key === "Enter" || w.key === " ") && (w.preventDefault(), k());
  };
  return l.$$set = (w) => {
    "videoId" in w && t(15, s = w.videoId), "hashedId" in w && t(16, i = w.hashedId), "title" in w && t(0, c = w.title), "description" in w && t(1, r = w.description), "duration" in w && t(2, a = w.duration), "thumbnail" in w && t(3, f = w.thumbnail), "selected" in w && t(4, u = w.selected), "disabled" in w && t(5, p = w.disabled), "badge" in w && t(6, v = w.badge), "tags" in w && t(17, g = w.tags), "favorite" in w && t(7, b = w.favorite), "categoryLeft" in w && t(8, m = w.categoryLeft), "categoryRight" in w && t(9, h = w.categoryRight), "categoryLeftColor" in w && t(10, _ = w.categoryLeftColor), "categoryRightColor" in w && t(11, q = w.categoryRightColor);
  }, [
    c,
    r,
    a,
    f,
    u,
    p,
    v,
    b,
    m,
    h,
    _,
    q,
    k,
    x,
    E,
    s,
    i,
    g
  ];
}
class Ts extends pe {
  constructor(e) {
    super(), fe(
      this,
      e,
      $i,
      Gi,
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
      Fi
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
customElements.define("svelte-video-card", de(Ts, { videoId: {}, hashedId: {}, title: {}, description: {}, duration: {}, thumbnail: {}, selected: { type: "Boolean" }, disabled: { type: "Boolean" }, badge: {}, tags: {}, favorite: { type: "Boolean" }, categoryLeft: {}, categoryRight: {}, categoryLeftColor: {}, categoryRightColor: {} }, [], [], !0));
function Ji(l) {
  const e = l - 1;
  return e * e * e + 1;
}
function xt(l, { delay: e = 0, duration: t = 400, easing: s = os } = {}) {
  const i = +getComputedStyle(l).opacity;
  return {
    delay: e,
    duration: t,
    easing: s,
    css: (c) => `opacity: ${c * i}`
  };
}
function He(l, { delay: e = 0, duration: t = 400, easing: s = Ji, x: i = 0, y: c = 0, opacity: r = 0 } = {}) {
  const a = getComputedStyle(l), f = +a.opacity, u = a.transform === "none" ? "" : a.transform, p = f * (1 - r), [v, g] = rl(i), [b, m] = rl(c);
  return {
    delay: e,
    duration: t,
    easing: s,
    css: (h, _) => `
			transform: ${u} translate(${(1 - h) * v}${g}, ${(1 - h) * b}${m});
			opacity: ${f - p * _}`
  };
}
function Ki(l) {
  ce(l, "svelte-1hb2737", `.overlay.svelte-1hb2737{position:fixed;inset:0;z-index:70;display:flex;align-items:center;justify-content:center;padding:24px;background:radial-gradient(circle at top, rgba(58, 132, 117, 0.2), rgba(0, 0, 0, 0.6));backdrop-filter:blur(6px)}.card.svelte-1hb2737{position:relative;width:min(520px, 92vw);padding:28px 26px 24px;border-radius:24px;background:linear-gradient(135deg, #ffffff 0%, #f4f6f0 100%);box-shadow:0 18px 40px rgba(0, 0, 0, 0.22),
      0 4px 18px rgba(50, 120, 102, 0.18);overflow:hidden}.card.svelte-1hb2737::before{content:"";position:absolute;inset:-1px;border-radius:24px;padding:1px;background:linear-gradient(130deg, rgba(43, 173, 145, 0.5), rgba(255, 255, 255, 0));-webkit-mask:linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none}.badge.svelte-1hb2737{display:inline-flex;align-items:center;padding:6px 12px;border-radius:999px;background:rgba(46, 140, 120, 0.12);color:#1f5f52;font-size:12px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase}h2.svelte-1hb2737{margin:14px 0 8px;font-size:22px;font-weight:700;color:#1f2a26}p.svelte-1hb2737{margin:0;font-size:14px;line-height:1.5;color:#4b5b56}.actions.svelte-1hb2737{margin-top:18px;display:flex;justify-content:flex-end}button.svelte-1hb2737{border:none;border-radius:12px;padding:10px 18px;font-size:14px;font-weight:600;color:#fff;background:linear-gradient(135deg, #2e8c78, #1f6d5e);box-shadow:0 10px 18px rgba(46, 140, 120, 0.28);cursor:pointer}button.svelte-1hb2737:hover{filter:brightness(1.05)}button.svelte-1hb2737:active{transform:translateY(1px)}@media(max-width: 480px){.card.svelte-1hb2737{padding:22px 20px}h2.svelte-1hb2737{font-size:20px}}`);
}
function zl(l) {
  let e, t, s, i, c, r, a, f, u, p, v, g, b, m, h, _, q, A;
  return {
    c() {
      e = d("div"), t = d("div"), s = d("div"), s.textContent = "Fin de temporada", i = y(), c = d("h2"), r = z(
        /*title*/
        l[1]
      ), a = y(), f = d("p"), u = z(
        /*message*/
        l[2]
      ), p = y(), v = d("div"), g = d("button"), b = z(
        /*cta*/
        l[3]
      ), o(s, "class", "badge svelte-1hb2737"), o(c, "class", "svelte-1hb2737"), o(f, "class", "svelte-1hb2737"), o(g, "type", "button"), o(g, "class", "svelte-1hb2737"), o(v, "class", "actions svelte-1hb2737"), o(t, "class", "card svelte-1hb2737"), o(e, "class", "overlay svelte-1hb2737"), o(e, "role", "button"), o(e, "tabindex", "0"), o(e, "aria-label", "Cerrar aviso de temporada");
    },
    m(k, x) {
      L(k, e, x), n(e, t), n(t, s), n(t, i), n(t, c), n(c, r), n(t, a), n(t, f), n(f, u), n(t, p), n(t, v), n(v, g), n(g, b), _ = !0, q || (A = [
        B(
          g,
          "click",
          /*handleClose*/
          l[4]
        ),
        B(
          e,
          "click",
          /*handleBackdrop*/
          l[5]
        ),
        B(
          e,
          "keydown",
          /*handleKeydown*/
          l[6]
        )
      ], q = !0);
    },
    p(k, x) {
      (!_ || x & /*title*/
      2) && M(
        r,
        /*title*/
        k[1]
      ), (!_ || x & /*message*/
      4) && M(
        u,
        /*message*/
        k[2]
      ), (!_ || x & /*cta*/
      8) && M(
        b,
        /*cta*/
        k[3]
      );
    },
    i(k) {
      _ || (k && Se(() => {
        _ && (m || (m = qe(t, He, { y: 18, duration: 240 }, !0)), m.run(1));
      }), k && Se(() => {
        _ && (h || (h = qe(e, xt, { duration: 180 }, !0)), h.run(1));
      }), _ = !0);
    },
    o(k) {
      k && (m || (m = qe(t, He, { y: 18, duration: 240 }, !1)), m.run(0)), k && (h || (h = qe(e, xt, { duration: 180 }, !1)), h.run(0)), _ = !1;
    },
    d(k) {
      k && S(e), k && m && m.end(), k && h && h.end(), q = !1, me(A);
    }
  };
}
function Qi(l) {
  let e, t = (
    /*open*/
    l[0] && zl(l)
  );
  return {
    c() {
      t && t.c(), e = Be();
    },
    m(s, i) {
      t && t.m(s, i), L(s, e, i);
    },
    p(s, [i]) {
      /*open*/
      s[0] ? t ? (t.p(s, i), i & /*open*/
      1 && Pe(t, 1)) : (t = zl(s), t.c(), Pe(t, 1), t.m(e.parentNode, e)) : t && (Pt(), ot(t, 1, 1, () => {
        t = null;
      }), Dt());
    },
    i(s) {
      Pe(t);
    },
    o(s) {
      ot(t);
    },
    d(s) {
      s && S(e), t && t.d(s);
    }
  };
}
function Wi(l, e, t) {
  let { open: s = !1 } = e, { title: i = "Temporada finalizada" } = e, { message: c = "La temporada actual ha terminado. Tus logros de temporada se reiniciaran para un nuevo ciclo." } = e, { cta: r = "Entendido" } = e;
  const a = Le(), f = () => {
    t(0, s = !1), a("dismiss");
  }, u = (v) => {
    v.target === v.currentTarget && f();
  }, p = (v) => {
    const g = v.key;
    (g === "Escape" || g === "Enter" || g === " ") && f();
  };
  return l.$$set = (v) => {
    "open" in v && t(0, s = v.open), "title" in v && t(1, i = v.title), "message" in v && t(2, c = v.message), "cta" in v && t(3, r = v.cta);
  }, [s, i, c, r, f, u, p];
}
class Ms extends pe {
  constructor(e) {
    super(), fe(this, e, Wi, Qi, le, { open: 0, title: 1, message: 2, cta: 3 }, Ki);
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
customElements.define("svelte-season-popup", de(Ms, { open: { type: "Boolean" }, title: {}, message: {}, cta: {} }, [], [], !0));
function Zi(l) {
  ce(l, "svelte-1f864m7", ':host{display:inline-block}.token.svelte-1f864m7{position:relative;height:40px;width:64px;border-radius:8px;border:1px solid #e5e7eb;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;line-height:1.1;font-family:inherit;overflow:visible;margin:0 4px}.time.svelte-1f864m7{font-weight:600;font-size:14px;color:inherit}.points.svelte-1f864m7{font-size:10px;opacity:0.8;margin-top:-2px}.points.expired.svelte-1f864m7{text-decoration:line-through}.completed.svelte-1f864m7{background:#8acc9f;color:#ffffff;border-color:#10b981}.open.svelte-1f864m7{background:#ecfdf5;color:#047857;border-color:#6ee7b7;box-shadow:0 4px 10px rgba(16, 185, 129, 0.12);transform:scale(1.2);transition:transform 0.2s ease;transform-origin:center;margin:0 10px}.open.svelte-1f864m7::before,.open.svelte-1f864m7::after,.open.svelte-1f864m7::backdrop{content:"";position:absolute;inset:-10px;border-radius:12px;border:1px solid rgba(16, 185, 129, 0.35);background:radial-gradient(circle, rgba(16, 185, 129, 0.35), rgba(16, 185, 129, 0));opacity:0;animation:svelte-1f864m7-pulse 1.35s ease-out infinite;pointer-events:none}.open.svelte-1f864m7::after{animation-delay:0.45s}.open.svelte-1f864m7::backdrop{animation-delay:0.9s}.expired.svelte-1f864m7{background:#fee2e2;color:#ef4444;border-color:#fca5a5}.upcoming.svelte-1f864m7{background:#f3f4f6;color:#6b7280;border-color:#e5e7eb}@media(min-width: 640px){.token.svelte-1f864m7{height:48px;width:80px;border-radius:10px}.time.svelte-1f864m7{font-size:15px}}@keyframes svelte-1f864m7-pulse{0%{transform:scale(0.85);opacity:0}20%{opacity:0.55}100%{transform:scale(1.4);opacity:0}}');
}
function en(l) {
  let e, t = `+${/*points*/
  l[2]} ${/*unit*/
  l[3]}`, s;
  return {
    c() {
      e = d("div"), s = z(t), o(e, "class", "time svelte-1f864m7");
    },
    m(i, c) {
      L(i, e, c), n(e, s);
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
function tn(l) {
  let e, t, s, i, c, r, a, f, u;
  return {
    c() {
      e = d("div"), t = z(
        /*timeLabel*/
        l[1]
      ), s = y(), i = d("div"), c = z("+"), r = z(
        /*points*/
        l[2]
      ), a = y(), f = z(
        /*unit*/
        l[3]
      ), o(e, "class", "time svelte-1f864m7"), o(i, "class", u = "points " + /*status*/
      (l[0] === "expired" ? "expired" : "") + " svelte-1f864m7");
    },
    m(p, v) {
      L(p, e, v), n(e, t), L(p, s, v), L(p, i, v), n(i, c), n(i, r), n(i, a), n(i, f);
    },
    p(p, v) {
      v & /*timeLabel*/
      2 && M(
        t,
        /*timeLabel*/
        p[1]
      ), v & /*points*/
      4 && M(
        r,
        /*points*/
        p[2]
      ), v & /*unit*/
      8 && M(
        f,
        /*unit*/
        p[3]
      ), v & /*status*/
      1 && u !== (u = "points " + /*status*/
      (p[0] === "expired" ? "expired" : "") + " svelte-1f864m7") && o(i, "class", u);
    },
    d(p) {
      p && (S(e), S(s), S(i));
    }
  };
}
function ln(l) {
  let e, t;
  function s(r, a) {
    return (
      /*timeLabel*/
      r[1] ? tn : en
    );
  }
  let i = s(l), c = i(l);
  return {
    c() {
      e = d("div"), c.c(), o(e, "class", t = "token " + /*label*/
      l[4](
        /*status*/
        l[0]
      ) + " svelte-1f864m7");
    },
    m(r, a) {
      L(r, e, a), c.m(e, null);
    },
    p(r, [a]) {
      i === (i = s(r)) && c ? c.p(r, a) : (c.d(1), c = i(r), c && (c.c(), c.m(e, null))), a & /*status*/
      1 && t !== (t = "token " + /*label*/
      r[4](
        /*status*/
        r[0]
      ) + " svelte-1f864m7") && o(e, "class", t);
    },
    i: D,
    o: D,
    d(r) {
      r && S(e), c.d();
    }
  };
}
function sn(l, e, t) {
  let { status: s = "upcoming" } = e, { timeLabel: i = "" } = e, { points: c = 20 } = e, { unit: r = "AP" } = e;
  const a = (f) => typeof f == "string" ? f : String(f ?? "");
  return l.$$set = (f) => {
    "status" in f && t(0, s = f.status), "timeLabel" in f && t(1, i = f.timeLabel), "points" in f && t(2, c = f.points), "unit" in f && t(3, r = f.unit);
  }, [s, i, c, r, a];
}
class As extends pe {
  constructor(e) {
    super(), fe(
      this,
      e,
      sn,
      ln,
      le,
      {
        status: 0,
        timeLabel: 1,
        points: 2,
        unit: 3
      },
      Zi
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
customElements.define("svelte-quota-token", de(As, { status: {}, timeLabel: {}, points: {}, unit: {} }, [], [], !0));
function nn(l) {
  ce(l, "svelte-p2zlwf", ":host{display:block;font-family:inherit}.panel.svelte-p2zlwf.svelte-p2zlwf{display:grid;gap:18px;animation:svelte-p2zlwf-panel-rise 0.4s ease}.hero.svelte-p2zlwf.svelte-p2zlwf{position:relative;border-radius:22px;padding:18px 20px;background:linear-gradient(130deg, #f8fafc, #ecfdf5);border:1px solid #e2e8f0;display:grid;gap:14px;overflow:hidden}.hero-cards.svelte-p2zlwf.svelte-p2zlwf{display:grid;grid-template-columns:repeat(auto-fit, minmax(160px, 1fr));gap:10px}.hero-card.svelte-p2zlwf.svelte-p2zlwf{border-radius:16px;padding:10px 12px;background:rgba(255, 255, 255, 0.8);border:1px solid rgba(226, 232, 240, 0.9);display:grid;gap:4px}.hero-card.accent.svelte-p2zlwf.svelte-p2zlwf{background:linear-gradient(120deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.08));border-color:rgba(16, 185, 129, 0.4)}.orb.svelte-p2zlwf.svelte-p2zlwf{position:absolute;right:18px;top:-10px;width:120px;height:120px;border-radius:999px;background:radial-gradient(circle, rgba(16, 185, 129, 0.22), transparent 65%);animation:svelte-p2zlwf-float 6s ease-in-out infinite}.orb.small.svelte-p2zlwf.svelte-p2zlwf{right:120px;top:60px;width:72px;height:72px;animation-delay:1.4s;opacity:0.7}.eyebrow.svelte-p2zlwf.svelte-p2zlwf{text-transform:uppercase;font-size:11px;letter-spacing:0.12em;color:#94a3b8;margin:0 0 6px}h1.svelte-p2zlwf.svelte-p2zlwf{margin:0;font-size:22px;font-weight:700;color:#0f172a}.email.svelte-p2zlwf.svelte-p2zlwf{margin:4px 0 0;color:#64748b;font-size:13px}.grid.svelte-p2zlwf.svelte-p2zlwf{display:grid;gap:12px;grid-template-columns:repeat(auto-fit, minmax(160px, 1fr))}.grid.two.svelte-p2zlwf.svelte-p2zlwf{grid-template-columns:repeat(auto-fit, minmax(220px, 1fr))}.card.svelte-p2zlwf.svelte-p2zlwf{background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;padding:12px 14px;display:grid;gap:6px;position:relative;overflow:hidden}.card.svelte-p2zlwf span.svelte-p2zlwf{font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#94a3b8}.card.svelte-p2zlwf strong.svelte-p2zlwf{font-size:20px;color:#0f172a}.section.svelte-p2zlwf.svelte-p2zlwf{background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;padding:16px;position:relative}.xp.svelte-p2zlwf.svelte-p2zlwf{overflow:hidden}.xp-toggle.svelte-p2zlwf.svelte-p2zlwf{width:100%;border:none;background:transparent;display:flex;align-items:center;justify-content:space-between;gap:12px;cursor:pointer;padding:0;margin-bottom:10px}.xp-toggle.svelte-p2zlwf h2.svelte-p2zlwf{margin:0}.xp-toggle.svelte-p2zlwf span.svelte-p2zlwf{display:inline-flex;align-items:center;justify-content:center;height:28px;width:28px;border-radius:999px;background:#ecfdf5;color:#10b981;transition:transform 0.2s ease;font-weight:700}.xp-toggle.svelte-p2zlwf span.rotated.svelte-p2zlwf{transform:rotate(180deg)}.xp-controls.svelte-p2zlwf.svelte-p2zlwf{display:grid;grid-template-columns:repeat(auto-fit, minmax(140px, 1fr));gap:8px;margin-bottom:10px}.xp-controls.svelte-p2zlwf label.svelte-p2zlwf{display:grid;gap:4px;font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em}.xp-controls.svelte-p2zlwf input.svelte-p2zlwf{border:1px solid #e2e8f0;border-radius:10px;padding:6px 8px;font-size:12px;color:#0f172a;background:#fff}.xp-controls.svelte-p2zlwf .ghost.svelte-p2zlwf,.xp-controls.svelte-p2zlwf .apply.svelte-p2zlwf,.xp-footer.svelte-p2zlwf .apply.svelte-p2zlwf{border:none;border-radius:10px;padding:8px 10px;font-size:12px;font-weight:600;cursor:pointer}.xp-controls.svelte-p2zlwf .ghost.svelte-p2zlwf{background:#f1f5f9;color:#334155}.xp-controls.svelte-p2zlwf .apply.svelte-p2zlwf,.xp-footer.svelte-p2zlwf .apply.svelte-p2zlwf{background:#10b981;color:#fff}.xp-footer.svelte-p2zlwf.svelte-p2zlwf{display:flex;align-items:center;justify-content:space-between;margin-top:8px}.section.svelte-p2zlwf h2.svelte-p2zlwf{margin:0 0 10px;font-size:15px;font-weight:700;color:#0f172a}.row.svelte-p2zlwf.svelte-p2zlwf{display:flex;justify-content:space-between;align-items:center}.days.svelte-p2zlwf.svelte-p2zlwf{display:flex;flex-wrap:wrap;gap:8px}.days.svelte-p2zlwf span.svelte-p2zlwf{height:36px;width:36px;border-radius:999px;display:grid;place-items:center;font-size:12px;font-weight:700;background:#f1f5f9;color:#94a3b8}.days.svelte-p2zlwf span.active.svelte-p2zlwf{background:#10b981;color:#ffffff}.list.svelte-p2zlwf.svelte-p2zlwf{display:grid;gap:8px}.list-item.svelte-p2zlwf.svelte-p2zlwf{display:flex;justify-content:space-between;align-items:center;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:8px 12px;font-size:12px;color:#334155}.list-item.svelte-p2zlwf .timestamp.svelte-p2zlwf{display:block;font-size:11px;color:#94a3b8;margin-top:2px}.accent.svelte-p2zlwf.svelte-p2zlwf{color:#10b981;font-weight:700}.line.svelte-p2zlwf.svelte-p2zlwf{display:flex;justify-content:space-between;font-size:13px;color:#334155;padding:4px 0}.muted.svelte-p2zlwf.svelte-p2zlwf{color:#94a3b8;font-size:13px}ul.svelte-p2zlwf.svelte-p2zlwf{margin:0;padding-left:18px;color:#475569;display:grid;gap:6px;font-size:13px}@keyframes svelte-p2zlwf-panel-rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}@keyframes svelte-p2zlwf-float{0%,100%{transform:translateY(0)}50%{transform:translateY(12px)}}");
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
function El(l) {
  let e, t;
  return {
    c() {
      e = d("p"), t = z(
        /*email*/
        l[1]
      ), o(e, "class", "email svelte-p2zlwf");
    },
    m(s, i) {
      L(s, e, i), n(e, t);
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
      l[53]}`, o(e, "class", "svelte-p2zlwf"), Ye(
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
      8192 && Ye(
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
function Ml(l) {
  let e, t, s, i, c, r, a, f, u, p, v, g, b, m, h, _, q, A;
  const k = [an, rn], x = [];
  function E(w, j) {
    return (
      /*xpItems*/
      w[3].length === 0 ? 0 : 1
    );
  }
  return m = E(l), h = x[m] = k[m](l), {
    c() {
      e = d("div"), t = d("label"), s = z(`Desde
          `), i = d("input"), c = y(), r = d("label"), a = z(`Hasta
          `), f = d("input"), u = y(), p = d("button"), p.textContent = "Limpiar", v = y(), g = d("button"), g.textContent = "Aplicar", b = y(), h.c(), _ = Be(), o(i, "type", "date"), o(i, "class", "svelte-p2zlwf"), o(t, "class", "svelte-p2zlwf"), o(f, "type", "date"), o(f, "class", "svelte-p2zlwf"), o(r, "class", "svelte-p2zlwf"), o(p, "type", "button"), o(p, "class", "ghost svelte-p2zlwf"), o(g, "type", "button"), o(g, "class", "apply svelte-p2zlwf"), o(e, "class", "xp-controls svelte-p2zlwf");
    },
    m(w, j) {
      L(w, e, j), n(e, t), n(t, s), n(t, i), Re(
        i,
        /*filterFrom*/
        l[6]
      ), n(e, c), n(e, r), n(r, a), n(r, f), Re(
        f,
        /*filterTo*/
        l[7]
      ), n(e, u), n(e, p), n(e, v), n(e, g), L(w, b, j), x[m].m(w, j), L(w, _, j), q || (A = [
        B(
          i,
          "input",
          /*input0_input_handler*/
          l[35]
        ),
        B(
          f,
          "input",
          /*input1_input_handler*/
          l[36]
        ),
        B(p, "click", Et(
          /*click_handler_1*/
          l[37]
        )),
        B(g, "click", Et(
          /*click_handler_2*/
          l[38]
        ))
      ], q = !0);
    },
    p(w, j) {
      j[0] & /*filterFrom*/
      64 && Re(
        i,
        /*filterFrom*/
        w[6]
      ), j[0] & /*filterTo*/
      128 && Re(
        f,
        /*filterTo*/
        w[7]
      );
      let T = m;
      m = E(w), m === T ? x[m].p(w, j) : (Pt(), ot(x[T], 1, 1, () => {
        x[T] = null;
      }), Dt(), h = x[m], h ? h.p(w, j) : (h = x[m] = k[m](w), h.c()), Pe(h, 1), h.m(_.parentNode, _));
    },
    d(w) {
      w && (S(e), S(b), S(_)), x[m].d(w), q = !1, me(A);
    }
  };
}
function rn(l) {
  let e, t, s, i, c, r, a, f, u, p, v, g = W(
    /*xpItems*/
    l[3]
  ), b = [];
  for (let h = 0; h < g.length; h += 1)
    b[h] = Al(Sl(l, g, h));
  let m = (
    /*shownCount*/
    l[8] < /*totalCount*/
    l[2] && Nl(l)
  );
  return {
    c() {
      e = d("div");
      for (let h = 0; h < b.length; h += 1)
        b[h].c();
      s = y(), i = d("div"), c = d("span"), r = z("Mostrando "), a = z(
        /*shownCount*/
        l[8]
      ), f = z(" de "), u = z(
        /*totalCount*/
        l[2]
      ), p = y(), m && m.c(), o(e, "class", "list svelte-p2zlwf"), o(c, "class", "muted svelte-p2zlwf"), o(i, "class", "xp-footer svelte-p2zlwf");
    },
    m(h, _) {
      L(h, e, _);
      for (let q = 0; q < b.length; q += 1)
        b[q] && b[q].m(e, null);
      L(h, s, _), L(h, i, _), n(i, c), n(c, r), n(c, a), n(c, f), n(c, u), n(i, p), m && m.m(i, null), v = !0;
    },
    p(h, _) {
      if (_[0] & /*xpItems, formatTimestamp, getXpLabel*/
      393224) {
        g = W(
          /*xpItems*/
          h[3]
        );
        let q;
        for (q = 0; q < g.length; q += 1) {
          const A = Sl(h, g, q);
          b[q] ? b[q].p(A, _) : (b[q] = Al(A), b[q].c(), b[q].m(e, null));
        }
        for (; q < b.length; q += 1)
          b[q].d(1);
        b.length = g.length;
      }
      (!v || _[0] & /*shownCount*/
      256) && M(
        a,
        /*shownCount*/
        h[8]
      ), (!v || _[0] & /*totalCount*/
      4) && M(
        u,
        /*totalCount*/
        h[2]
      ), /*shownCount*/
      h[8] < /*totalCount*/
      h[2] ? m ? m.p(h, _) : (m = Nl(h), m.c(), m.m(i, null)) : m && (m.d(1), m = null);
    },
    i(h) {
      v || (h && Se(() => {
        v && (t || (t = qe(e, He, { y: 6, duration: 180 }, !0)), t.run(1));
      }), v = !0);
    },
    o(h) {
      h && (t || (t = qe(e, He, { y: 6, duration: 180 }, !1)), t.run(0)), v = !1;
    },
    d(h) {
      h && (S(e), S(s), S(i)), Ne(b, h), h && t && t.end(), m && m.d();
    }
  };
}
function an(l) {
  let e, t, s;
  return {
    c() {
      e = d("p"), e.textContent = "Sin movimientos recientes.", o(e, "class", "muted svelte-p2zlwf");
    },
    m(i, c) {
      L(i, e, c), s = !0;
    },
    p: D,
    i(i) {
      s || (i && Se(() => {
        s && (t || (t = qe(e, He, { y: 6, duration: 180 }, !0)), t.run(1));
      }), s = !0);
    },
    o(i) {
      i && (t || (t = qe(e, He, { y: 6, duration: 180 }, !1)), t.run(0)), s = !1;
    },
    d(i) {
      i && S(e), i && t && t.end();
    }
  };
}
function Al(l) {
  var q, A;
  let e, t, s, i = (
    /*getXpLabel*/
    l[17](
      /*entry*/
      l[50]
    ) + ""
  ), c, r, a, f = (
    /*formatTimestamp*/
    l[18](
      /*entry*/
      (q = l[50]) == null ? void 0 : q.created_at
    ) + ""
  ), u, p, v, g, b = (
    /*entry*/
    (((A = l[50]) == null ? void 0 : A.points) ?? 0) + ""
  ), m, h, _;
  return {
    c() {
      e = d("div"), t = d("div"), s = d("span"), c = z(i), r = y(), a = d("span"), u = z(f), p = y(), v = d("span"), g = z("+"), m = z(b), h = z(" PA"), _ = y(), o(a, "class", "timestamp svelte-p2zlwf"), o(v, "class", "accent svelte-p2zlwf"), o(e, "class", "list-item svelte-p2zlwf");
    },
    m(k, x) {
      L(k, e, x), n(e, t), n(t, s), n(s, c), n(t, r), n(t, a), n(a, u), n(e, p), n(e, v), n(v, g), n(v, m), n(v, h), n(e, _);
    },
    p(k, x) {
      var E, w;
      x[0] & /*xpItems*/
      8 && i !== (i = /*getXpLabel*/
      k[17](
        /*entry*/
        k[50]
      ) + "") && M(c, i), x[0] & /*xpItems*/
      8 && f !== (f = /*formatTimestamp*/
      k[18](
        /*entry*/
        (E = k[50]) == null ? void 0 : E.created_at
      ) + "") && M(u, f), x[0] & /*xpItems*/
      8 && b !== (b = /*entry*/
      (((w = k[50]) == null ? void 0 : w.points) ?? 0) + "") && M(m, b);
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
      e = d("button"), e.textContent = "Ver más", o(e, "type", "button"), o(e, "class", "apply svelte-p2zlwf");
    },
    m(i, c) {
      L(i, e, c), t || (s = B(e, "click", Et(
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
function on(l) {
  let e, t = W(
    /*categories*/
    l[12].slice(0, 8)
  ), s = [];
  for (let i = 0; i < t.length; i += 1)
    s[i] = Rl(Cl(l, t, i));
  return {
    c() {
      for (let i = 0; i < s.length; i += 1)
        s[i].c();
      e = Be();
    },
    m(i, c) {
      for (let r = 0; r < s.length; r += 1)
        s[r] && s[r].m(i, c);
      L(i, e, c);
    },
    p(i, c) {
      if (c[0] & /*categories*/
      4096) {
        t = W(
          /*categories*/
          i[12].slice(0, 8)
        );
        let r;
        for (r = 0; r < t.length; r += 1) {
          const a = Cl(i, t, r);
          s[r] ? s[r].p(a, c) : (s[r] = Rl(a), s[r].c(), s[r].m(e.parentNode, e));
        }
        for (; r < s.length; r += 1)
          s[r].d(1);
        s.length = t.length;
      }
    },
    d(i) {
      i && S(e), Ne(s, i);
    }
  };
}
function cn(l) {
  let e;
  return {
    c() {
      e = d("p"), e.textContent = "Sin actividad registrada.", o(e, "class", "muted svelte-p2zlwf");
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
  let e, t, s = (
    /*cat*/
    l[47].category + ""
  ), i, c, r, a = (
    /*cat*/
    l[47].total_sessions + ""
  ), f, u;
  return {
    c() {
      e = d("div"), t = d("span"), i = z(s), c = y(), r = d("strong"), f = z(a), u = y(), o(t, "class", "svelte-p2zlwf"), o(r, "class", "svelte-p2zlwf"), o(e, "class", "line svelte-p2zlwf");
    },
    m(p, v) {
      L(p, e, v), n(e, t), n(t, i), n(e, c), n(e, r), n(r, f), n(e, u);
    },
    p(p, v) {
      v[0] & /*categories*/
      4096 && s !== (s = /*cat*/
      p[47].category + "") && M(i, s), v[0] & /*categories*/
      4096 && a !== (a = /*cat*/
      p[47].total_sessions + "") && M(f, a);
    },
    d(p) {
      p && S(e);
    }
  };
}
function fn(l) {
  let e, t = W(
    /*favorites*/
    l[11].slice(0, 8)
  ), s = [];
  for (let i = 0; i < t.length; i += 1)
    s[i] = Il(jl(l, t, i));
  return {
    c() {
      for (let i = 0; i < s.length; i += 1)
        s[i].c();
      e = Be();
    },
    m(i, c) {
      for (let r = 0; r < s.length; r += 1)
        s[r] && s[r].m(i, c);
      L(i, e, c);
    },
    p(i, c) {
      if (c[0] & /*favorites*/
      2048) {
        t = W(
          /*favorites*/
          i[11].slice(0, 8)
        );
        let r;
        for (r = 0; r < t.length; r += 1) {
          const a = jl(i, t, r);
          s[r] ? s[r].p(a, c) : (s[r] = Il(a), s[r].c(), s[r].m(e.parentNode, e));
        }
        for (; r < s.length; r += 1)
          s[r].d(1);
        s.length = t.length;
      }
    },
    d(i) {
      i && S(e), Ne(s, i);
    }
  };
}
function dn(l) {
  let e;
  return {
    c() {
      e = d("p"), e.textContent = "Aún no hay ejercicios destacados.", o(e, "class", "muted svelte-p2zlwf");
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
    /*fav*/
    l[44].title + ""
  ), i, c, r, a = (
    /*fav*/
    l[44].total_sessions + ""
  ), f, u, p;
  return {
    c() {
      e = d("div"), t = d("span"), i = z(s), c = y(), r = d("strong"), f = z(a), u = z("x"), p = y(), o(t, "class", "svelte-p2zlwf"), o(r, "class", "svelte-p2zlwf"), o(e, "class", "line svelte-p2zlwf");
    },
    m(v, g) {
      L(v, e, g), n(e, t), n(t, i), n(e, c), n(e, r), n(r, f), n(r, u), n(e, p);
    },
    p(v, g) {
      g[0] & /*favorites*/
      2048 && s !== (s = /*fav*/
      v[44].title + "") && M(i, s), g[0] & /*favorites*/
      2048 && a !== (a = /*fav*/
      v[44].total_sessions + "") && M(f, a);
    },
    d(v) {
      v && S(e);
    }
  };
}
function pn(l) {
  let e, t = W(
    /*insightItems*/
    l[10]
  ), s = [];
  for (let i = 0; i < t.length; i += 1)
    s[i] = Pl(ql(l, t, i));
  return {
    c() {
      e = d("ul");
      for (let i = 0; i < s.length; i += 1)
        s[i].c();
      o(e, "class", "svelte-p2zlwf");
    },
    m(i, c) {
      L(i, e, c);
      for (let r = 0; r < s.length; r += 1)
        s[r] && s[r].m(e, null);
    },
    p(i, c) {
      if (c[0] & /*insightItems*/
      1024) {
        t = W(
          /*insightItems*/
          i[10]
        );
        let r;
        for (r = 0; r < t.length; r += 1) {
          const a = ql(i, t, r);
          s[r] ? s[r].p(a, c) : (s[r] = Pl(a), s[r].c(), s[r].m(e, null));
        }
        for (; r < s.length; r += 1)
          s[r].d(1);
        s.length = t.length;
      }
    },
    d(i) {
      i && S(e), Ne(s, i);
    }
  };
}
function un(l) {
  let e;
  return {
    c() {
      e = d("p"), e.textContent = "Sin insights por ahora.", o(e, "class", "muted svelte-p2zlwf");
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
      i[41] + "") && M(s, t);
    },
    d(i) {
      i && S(e);
    }
  };
}
function vn(l) {
  let e, t, s, i, c, r, a, f, u, p, v, g, b, m, h = (
    /*summaryData*/
    l[15].total_exercises + ""
  ), _, q, A, k, x, E, w = (
    /*summaryData*/
    l[15].weekly_sessions + ""
  ), j, T, R, N, O, P, F = Number(
    /*summaryData*/
    l[15].avg_satisfaction || 0
  ).toFixed(1) + "", I, G, $, ve, ie, ne, J, U, _e, ee, Q, te, H = (
    /*summaryData*/
    l[15].distinct_days + ""
  ), K, X, Z, je, De, ye, oe = (
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
  ), yt, Ht, Je, Ke, ct, Bt, st, ft = (
    /*activeDays*/
    l[13].length + ""
  ), kt, Ot, Ft, it, Vt, Fe, Xe, wt, Ut, Qe, Gt, $t, We, Ve, zt, Jt, Kt, Ue, qt, Qt, Wt, Ge, dt, Zt, jt, el, ke = (
    /*email*/
    l[1] && El(l)
  ), Ct = W(["L", "M", "X", "J", "V", "S", "D"]), Ce = [];
  for (let Y = 0; Y < 7; Y += 1)
    Ce[Y] = Tl(Ll(l, Ct, Y));
  let we = (
    /*xpOpen*/
    l[5] && Ml(l)
  );
  function tl(Y, ae) {
    return (
      /*categories*/
      Y[12].length === 0 ? cn : on
    );
  }
  let pt = tl(l), Ee = pt(l);
  function ll(Y, ae) {
    return (
      /*favorites*/
      Y[11].length === 0 ? dn : fn
    );
  }
  let ut = ll(l), Te = ut(l);
  function sl(Y, ae) {
    return (
      /*insightItems*/
      Y[10].length === 0 ? un : pn
    );
  }
  let vt = sl(l), Me = vt(l);
  return {
    c() {
      e = d("div"), t = d("section"), s = d("div"), i = d("p"), i.textContent = "Estadísticas avanzadas", c = y(), r = d("h1"), a = z(
        /*name*/
        l[0]
      ), f = y(), ke && ke.c(), u = y(), p = d("div"), v = d("div"), g = d("span"), g.textContent = "Total de pausas", b = y(), m = d("strong"), _ = z(h), q = y(), A = d("div"), k = d("span"), k.textContent = "Sesiones esta semana", x = y(), E = d("strong"), j = z(w), T = y(), R = d("div"), N = d("span"), N.textContent = "Satisfacción promedio", O = y(), P = d("strong"), I = z(F), G = z(" / 5"), $ = y(), ve = d("div"), ie = y(), ne = d("div"), J = y(), U = d("section"), _e = d("div"), ee = d("span"), ee.textContent = "Días activos", Q = y(), te = d("strong"), K = z(H), X = y(), Z = d("div"), je = d("span"), je.textContent = "Tiempo saludable (7 días)", De = y(), ye = d("strong"), ge = z(oe), xe = y(), re = d("div"), V = d("span"), V.textContent = "Tiempo saludable (30 días)", he = y(), se = d("strong"), yt = z(Oe), Ht = y(), Je = d("section"), Ke = d("div"), ct = d("h2"), ct.textContent = "Actividad semanal", Bt = y(), st = d("span"), kt = z(ft), Ot = z("/7 días activos"), Ft = y(), it = d("div");
      for (let Y = 0; Y < 7; Y += 1)
        Ce[Y].c();
      Vt = y(), Fe = d("section"), Xe = d("button"), wt = d("div"), wt.innerHTML = '<h2 class="svelte-p2zlwf">Historial de XP</h2> <p class="muted svelte-p2zlwf">Últimos movimientos</p>', Ut = y(), Qe = d("span"), Qe.textContent = "⌄", Gt = y(), we && we.c(), $t = y(), We = d("section"), Ve = d("div"), zt = d("h3"), zt.textContent = "Categorías favoritas", Jt = y(), Ee.c(), Kt = y(), Ue = d("div"), qt = d("h3"), qt.textContent = "Ejercicios más repetidos", Qt = y(), Te.c(), Wt = y(), Ge = d("section"), dt = d("h2"), dt.textContent = "Insights", Zt = y(), Me.c(), o(i, "class", "eyebrow svelte-p2zlwf"), o(r, "class", "svelte-p2zlwf"), o(v, "class", "hero-card svelte-p2zlwf"), o(A, "class", "hero-card accent svelte-p2zlwf"), o(R, "class", "hero-card svelte-p2zlwf"), o(p, "class", "hero-cards svelte-p2zlwf"), o(ve, "class", "orb svelte-p2zlwf"), o(ne, "class", "orb small svelte-p2zlwf"), o(t, "class", "hero svelte-p2zlwf"), o(ee, "class", "svelte-p2zlwf"), o(te, "class", "svelte-p2zlwf"), o(_e, "class", "card svelte-p2zlwf"), o(je, "class", "svelte-p2zlwf"), o(ye, "class", "svelte-p2zlwf"), o(Z, "class", "card svelte-p2zlwf"), o(V, "class", "svelte-p2zlwf"), o(se, "class", "svelte-p2zlwf"), o(re, "class", "card svelte-p2zlwf"), o(U, "class", "grid svelte-p2zlwf"), o(ct, "class", "svelte-p2zlwf"), o(st, "class", "muted svelte-p2zlwf"), o(Ke, "class", "row svelte-p2zlwf"), o(it, "class", "days svelte-p2zlwf"), o(Je, "class", "section svelte-p2zlwf"), o(Qe, "class", "svelte-p2zlwf"), Ye(
        Qe,
        "rotated",
        /*xpOpen*/
        l[5]
      ), o(Xe, "type", "button"), o(Xe, "class", "xp-toggle svelte-p2zlwf"), o(Fe, "class", "section xp svelte-p2zlwf"), o(Ve, "class", "card svelte-p2zlwf"), o(Ue, "class", "card svelte-p2zlwf"), o(We, "class", "grid two svelte-p2zlwf"), o(dt, "class", "svelte-p2zlwf"), o(Ge, "class", "section svelte-p2zlwf"), o(e, "class", "panel svelte-p2zlwf");
    },
    m(Y, ae) {
      L(Y, e, ae), n(e, t), n(t, s), n(s, i), n(s, c), n(s, r), n(r, a), n(s, f), ke && ke.m(s, null), n(t, u), n(t, p), n(p, v), n(v, g), n(v, b), n(v, m), n(m, _), n(p, q), n(p, A), n(A, k), n(A, x), n(A, E), n(E, j), n(p, T), n(p, R), n(R, N), n(R, O), n(R, P), n(P, I), n(P, G), n(t, $), n(t, ve), n(t, ie), n(t, ne), n(e, J), n(e, U), n(U, _e), n(_e, ee), n(_e, Q), n(_e, te), n(te, K), n(U, X), n(U, Z), n(Z, je), n(Z, De), n(Z, ye), n(ye, ge), n(U, xe), n(U, re), n(re, V), n(re, he), n(re, se), n(se, yt), n(e, Ht), n(e, Je), n(Je, Ke), n(Ke, ct), n(Ke, Bt), n(Ke, st), n(st, kt), n(st, Ot), n(Je, Ft), n(Je, it);
      for (let be = 0; be < 7; be += 1)
        Ce[be] && Ce[be].m(it, null);
      n(e, Vt), n(e, Fe), n(Fe, Xe), n(Xe, wt), n(Xe, Ut), n(Xe, Qe), n(Fe, Gt), we && we.m(Fe, null), n(e, $t), n(e, We), n(We, Ve), n(Ve, zt), n(Ve, Jt), Ee.m(Ve, null), n(We, Kt), n(We, Ue), n(Ue, qt), n(Ue, Qt), Te.m(Ue, null), n(e, Wt), n(e, Ge), n(Ge, dt), n(Ge, Zt), Me.m(Ge, null), jt || (el = B(
        Xe,
        "click",
        /*click_handler*/
        l[34]
      ), jt = !0);
    },
    p(Y, ae) {
      if (ae[0] & /*name*/
      1 && M(
        a,
        /*name*/
        Y[0]
      ), /*email*/
      Y[1] ? ke ? ke.p(Y, ae) : (ke = El(Y), ke.c(), ke.m(s, null)) : ke && (ke.d(1), ke = null), ae[0] & /*summaryData*/
      32768 && h !== (h = /*summaryData*/
      Y[15].total_exercises + "") && M(_, h), ae[0] & /*summaryData*/
      32768 && w !== (w = /*summaryData*/
      Y[15].weekly_sessions + "") && M(j, w), ae[0] & /*summaryData*/
      32768 && F !== (F = Number(
        /*summaryData*/
        Y[15].avg_satisfaction || 0
      ).toFixed(1) + "") && M(I, F), ae[0] & /*summaryData*/
      32768 && H !== (H = /*summaryData*/
      Y[15].distinct_days + "") && M(K, H), ae[0] & /*timeData*/
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
      Y[13].length + "") && M(kt, ft), ae[0] & /*activeDays*/
      8192) {
        Ct = W(["L", "M", "X", "J", "V", "S", "D"]);
        let be;
        for (be = 0; be < 7; be += 1) {
          const il = Ll(Y, Ct, be);
          Ce[be] ? Ce[be].p(il, ae) : (Ce[be] = Tl(il), Ce[be].c(), Ce[be].m(it, null));
        }
        for (; be < 7; be += 1)
          Ce[be].d(1);
      }
      ae[0] & /*xpOpen*/
      32 && Ye(
        Qe,
        "rotated",
        /*xpOpen*/
        Y[5]
      ), /*xpOpen*/
      Y[5] ? we ? we.p(Y, ae) : (we = Ml(Y), we.c(), we.m(Fe, null)) : we && (we.d(1), we = null), pt === (pt = tl(Y)) && Ee ? Ee.p(Y, ae) : (Ee.d(1), Ee = pt(Y), Ee && (Ee.c(), Ee.m(Ve, null))), ut === (ut = ll(Y)) && Te ? Te.p(Y, ae) : (Te.d(1), Te = ut(Y), Te && (Te.c(), Te.m(Ue, null))), vt === (vt = sl(Y)) && Me ? Me.p(Y, ae) : (Me.d(1), Me = vt(Y), Me && (Me.c(), Me.m(Ge, null)));
    },
    i: D,
    o: D,
    d(Y) {
      Y && S(e), ke && ke.d(), Ne(Ce, Y), we && we.d(), Ee.d(), Te.d(), Me.d(), jt = !1, el();
    }
  };
}
function gn(l, e, t) {
  let s, i, c, r, a, f, u, p, v, g, b, { name: m = "Usuario" } = e, { email: h = "" } = e, { summary: _ = "" } = e, { timeSummary: q = "" } = e, { weeklyActiveDays: A = "" } = e, { xpHistory: k = "" } = e, { categoryDistribution: x = "" } = e, { favoriteVideos: E = "" } = e, { insights: w = "" } = e, { xpTotal: j = 0 } = e, { xpLimit: T = 10 } = e, { xpOffset: R = 0 } = e, { xpFrom: N = "" } = e, { xpTo: O = "" } = e;
  const P = (X, Z) => {
    if (!X || typeof X != "string") return Z;
    try {
      return JSON.parse(X);
    } catch {
      return Z;
    }
  }, F = (X) => X ? X < 60 ? `${Math.round(X)} min` : `${(X / 60).toFixed(1)} h` : "0 min", I = (X) => {
    var je, De;
    const Z = ((je = X == null ? void 0 : X.metadata) == null ? void 0 : je.source) || (X == null ? void 0 : X.action_type) || "XP";
    if (Z === "achievement") {
      const ye = (De = X == null ? void 0 : X.metadata) == null ? void 0 : De.achievement_title;
      return ye ? `Logro · ${ye}` : "Logro";
    }
    return Z === "weekly_challenge" ? "Reto semanal" : Z === "questionnaire" ? "Cuestionario" : Z === "active_pause" || Z === "pause" ? "Pausa activa" : "XP";
  }, G = (X) => {
    if (!X) return "";
    const Z = new Date(X);
    return Number.isNaN(Z.getTime()) ? "" : Z.toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" });
  }, $ = Le();
  let ve = !1, ie = N, ne = O, J = N, U = O;
  const _e = () => t(5, ve = !ve);
  function ee() {
    ie = this.value, t(6, ie), t(30, N), t(32, J);
  }
  function Q() {
    ne = this.value, t(7, ne), t(31, O), t(33, U);
  }
  const te = () => {
    t(6, ie = ""), t(7, ne = ""), $("xpfilter", { from: "", to: "" });
  }, H = () => {
    $("xpfilter", { from: ie, to: ne });
  }, K = () => {
    $("xploadmore", { nextOffset: v + p });
  };
  return l.$$set = (X) => {
    "name" in X && t(0, m = X.name), "email" in X && t(1, h = X.email), "summary" in X && t(20, _ = X.summary), "timeSummary" in X && t(21, q = X.timeSummary), "weeklyActiveDays" in X && t(22, A = X.weeklyActiveDays), "xpHistory" in X && t(23, k = X.xpHistory), "categoryDistribution" in X && t(24, x = X.categoryDistribution), "favoriteVideos" in X && t(25, E = X.favoriteVideos), "insights" in X && t(26, w = X.insights), "xpTotal" in X && t(27, j = X.xpTotal), "xpLimit" in X && t(28, T = X.xpLimit), "xpOffset" in X && t(29, R = X.xpOffset), "xpFrom" in X && t(30, N = X.xpFrom), "xpTo" in X && t(31, O = X.xpTo);
  }, l.$$.update = () => {
    l.$$.dirty[0] & /*summary*/
    1048576 && t(15, s = P(_, {
      total_exercises: 0,
      weekly_sessions: 0,
      avg_satisfaction: 0,
      distinct_days: 0
    })), l.$$.dirty[0] & /*timeSummary*/
    2097152 && t(14, i = P(q, { week_minutes: 0, month_minutes: 0 })), l.$$.dirty[0] & /*weeklyActiveDays*/
    4194304 && t(13, c = P(A, [])), l.$$.dirty[0] & /*xpHistory*/
    8388608 && t(3, r = P(k, [])), l.$$.dirty[0] & /*categoryDistribution*/
    16777216 && t(12, a = P(x, [])), l.$$.dirty[0] & /*favoriteVideos*/
    33554432 && t(11, f = P(E, [])), l.$$.dirty[0] & /*insights*/
    67108864 && t(10, u = P(w, [])), l.$$.dirty[0] & /*xpFrom*/
    1073741824 | l.$$.dirty[1] & /*lastXpFrom*/
    2 && N !== J && (t(6, ie = N), t(32, J = N)), l.$$.dirty[1] & /*xpTo, lastXpTo*/
    5 && O !== U && (t(7, ne = O), t(33, U = O)), l.$$.dirty[0] & /*xpLimit*/
    268435456 && t(9, p = Number(T) || 10), l.$$.dirty[0] & /*xpOffset*/
    536870912 && t(4, v = Number(R) || 0), l.$$.dirty[0] & /*xpTotal, xpItems*/
    134217736 && t(2, g = Number(j) || r.length), l.$$.dirty[0] & /*safeOffset, xpItems, totalCount*/
    28 && t(8, b = Math.min(v + r.length, g));
  }, [
    m,
    h,
    g,
    r,
    v,
    ve,
    ie,
    ne,
    b,
    p,
    u,
    f,
    a,
    c,
    i,
    s,
    F,
    I,
    G,
    $,
    _,
    q,
    A,
    k,
    x,
    E,
    w,
    j,
    T,
    R,
    N,
    O,
    J,
    U,
    _e,
    ee,
    Q,
    te,
    H,
    K
  ];
}
class Ns extends pe {
  constructor(e) {
    super(), fe(
      this,
      e,
      gn,
      vn,
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
      nn,
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
customElements.define("svelte-user-stats-panel", de(Ns, { name: {}, email: {}, summary: {}, timeSummary: {}, weeklyActiveDays: {}, xpHistory: {}, categoryDistribution: {}, favoriteVideos: {}, insights: {}, xpTotal: {}, xpLimit: {}, xpOffset: {}, xpFrom: {}, xpTo: {} }, [], [], !0));
function hn(l) {
  ce(l, "svelte-18r3645", ".podium-wrap.svelte-18r3645.svelte-18r3645{padding:0}.podium-header.svelte-18r3645.svelte-18r3645{display:flex;flex-wrap:wrap;gap:16px;justify-content:space-between;align-items:center;padding-bottom:18px;border-bottom:1px solid rgba(148,163,184,.18)}.eyebrow.svelte-18r3645.svelte-18r3645{font-size:10px;letter-spacing:.32em;text-transform:uppercase;font-weight:600;color:#10b981}h2.svelte-18r3645.svelte-18r3645{margin:6px 0 0;font-size:24px;font-weight:700;color:#0f172a}.scope.svelte-18r3645.svelte-18r3645{margin-top:4px;font-size:13px;color:#64748b}.badge.svelte-18r3645.svelte-18r3645{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:600;color:#0f766e;background:rgba(236,253,245,.7);padding:8px 12px;border-radius:999px}.badge-icon.svelte-18r3645.svelte-18r3645{width:20px;height:20px;display:inline-block;border-radius:50%;background:conic-gradient(from 180deg,#34d399,#bbf7d0,#34d399);position:relative}.badge-icon.svelte-18r3645.svelte-18r3645::after{content:'';position:absolute;inset:5px;border-radius:50%;background:#ecfdf5}.podium-meta.svelte-18r3645.svelte-18r3645{display:flex;justify-content:space-between;align-items:center;font-size:11px;font-weight:600;text-transform:uppercase;color:#64748b}.place.svelte-18r3645.svelte-18r3645{color:#0f766e}.xp.svelte-18r3645.svelte-18r3645{color:#94a3b8}.reward.svelte-18r3645.svelte-18r3645{border-radius:20px;background:rgba(255,255,255,.86);padding:14px;text-align:center;font-size:12px;color:#0f172a;box-shadow:inset 0 0 0 1px rgba(148,163,184,.14);min-height:168px;display:flex;flex-direction:column;justify-content:center;gap:6px}.reward.svelte-18r3645 img.svelte-18r3645{width:100%;height:110px;object-fit:contain;border-radius:14px;background:#fff;margin-bottom:10px}.reward-title.svelte-18r3645.svelte-18r3645{font-size:13px;font-weight:600;margin:0}.reward-desc.svelte-18r3645.svelte-18r3645{margin:6px 0 0;font-size:11px;color:#6b7280}.reward.svelte-18r3645 a.svelte-18r3645{display:inline-block;margin-top:8px;background:#10b981;color:#fff;font-size:11px;padding:6px 12px;border-radius:999px;text-decoration:none}.reward.empty.svelte-18r3645.svelte-18r3645{border:1px dashed rgba(203,213,225,.95);background:rgba(255,255,255,.66);color:#6b7280;text-align:left;justify-content:center}.loading.svelte-18r3645.svelte-18r3645{margin-top:18px;text-align:center;font-size:12px;color:#6b7280}.classic-grid.svelte-18r3645.svelte-18r3645{margin-top:28px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));align-items:start;gap:22px}.classic-card.svelte-18r3645.svelte-18r3645{padding:0;border:none;display:flex;flex-direction:column;gap:14px;min-height:230px;background:transparent}.classic-first.svelte-18r3645.svelte-18r3645,.classic-second.svelte-18r3645.svelte-18r3645,.classic-third.svelte-18r3645.svelte-18r3645{background:transparent;border-color:transparent}.classic-user.svelte-18r3645.svelte-18r3645{margin-top:auto;display:flex;align-items:center;gap:10px}.classic-avatar.svelte-18r3645.svelte-18r3645{width:46px;height:46px;border-radius:50%;object-fit:cover;background:#fff}.classic-avatar.fallback.svelte-18r3645.svelte-18r3645{display:grid;place-items:center;color:#64748b;font-weight:600}.classic-user-meta.svelte-18r3645 p.svelte-18r3645{margin:0;font-size:14px;font-weight:600;color:#0f172a}.classic-user-meta.svelte-18r3645 span.svelte-18r3645{font-size:12px;color:#94a3b8}.podium-grid.svelte-18r3645.svelte-18r3645{margin-top:28px;display:grid;grid-template-columns:1fr;gap:18px}.winner-card.svelte-18r3645.svelte-18r3645{border:none;background:transparent;padding:0;box-shadow:none;animation:svelte-18r3645-rise .9s cubic-bezier(.22,1,.36,1) forwards;opacity:0;transform:translateY(18px) scale(.98)}.winner-layout.svelte-18r3645.svelte-18r3645{margin-top:16px;display:grid;grid-template-columns:auto minmax(0,1fr);gap:16px;align-items:center}.winner-identity.svelte-18r3645.svelte-18r3645{display:flex;flex-direction:column;align-items:center;text-align:center}.winner-avatar.svelte-18r3645.svelte-18r3645{width:80px;height:80px;border-radius:50%;object-fit:cover;background:#fff;box-shadow:0 14px 28px rgba(15,118,110,.12)}.winner-avatar.fallback.svelte-18r3645.svelte-18r3645{display:grid;place-items:center;font-size:28px;font-weight:700;color:#64748b}.winner-name.svelte-18r3645.svelte-18r3645{margin:12px 0 0;font-size:24px;font-weight:700;color:#0f172a}.winner-score.svelte-18r3645.svelte-18r3645{margin-top:4px;font-size:14px;color:#64748b}.empty-copy.svelte-18r3645.svelte-18r3645{display:grid;gap:6px}.empty-copy.svelte-18r3645 strong.svelte-18r3645{font-size:13px;color:#0f172a}.empty-copy.svelte-18r3645 span.svelte-18r3645{font-size:11px;line-height:1.5}.extras-grid.svelte-18r3645.svelte-18r3645{margin-top:26px;display:grid;grid-template-columns:1.1fr .9fr;gap:28px;align-items:start}.extras-card.svelte-18r3645.svelte-18r3645{border:none;background:transparent;padding:0;box-shadow:none}.extras-heading.svelte-18r3645.svelte-18r3645{display:flex;align-items:center;gap:8px}.extras-heading.svelte-18r3645 h3.svelte-18r3645{margin:0;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#059669}.mini-icon.svelte-18r3645.svelte-18r3645{width:16px;height:16px;border-radius:999px;background:linear-gradient(135deg,#10b981,#bbf7d0)}.mini-icon.spark.svelte-18r3645.svelte-18r3645{background:linear-gradient(135deg,#10b981,#34d399,#bbf7d0)}.raffle-grid.svelte-18r3645.svelte-18r3645{margin-top:16px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.raffle-card.svelte-18r3645.svelte-18r3645{border-top:1px solid rgba(226,232,240,.8);padding-top:14px}.raffle-label.svelte-18r3645.svelte-18r3645{margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#64748b}.raffle-image.svelte-18r3645.svelte-18r3645{width:100%;height:110px;object-fit:contain;border-radius:14px;background:#f8fafc;margin-bottom:10px}.entries-box.svelte-18r3645.svelte-18r3645{margin-top:16px;border-radius:18px;background:rgba(16,185,129,.08);padding:16px}.entries-box.svelte-18r3645 p.svelte-18r3645{margin:0;font-size:13px;color:#475569}.entries-box.svelte-18r3645 strong.svelte-18r3645{display:block;margin-top:6px;font-size:32px;color:#047857}.entries-box.svelte-18r3645 span.svelte-18r3645{display:block;margin-top:8px;font-size:11px;color:#64748b}.threshold-list.svelte-18r3645.svelte-18r3645{margin-top:16px;display:grid;gap:10px}.threshold-row.svelte-18r3645.svelte-18r3645{display:flex;justify-content:space-between;gap:12px;align-items:center;border-top:1px solid rgba(226,232,240,.85);padding:12px 2px 0;font-size:13px;color:#475569}.threshold-row.svelte-18r3645 strong.svelte-18r3645{color:#0f172a}@keyframes svelte-18r3645-rise{to{opacity:1;transform:translateY(0) scale(1)}}@media(max-width: 900px){.classic-grid.svelte-18r3645.svelte-18r3645{grid-template-columns:1fr}.winner-layout.svelte-18r3645.svelte-18r3645{grid-template-columns:1fr}.extras-grid.svelte-18r3645.svelte-18r3645{grid-template-columns:1fr}.raffle-grid.svelte-18r3645.svelte-18r3645{grid-template-columns:1fr}}");
}
function Dl(l, e, t) {
  const s = l.slice();
  return s[20] = e[t], s;
}
function Xl(l, e, t) {
  const s = l.slice();
  return s[23] = e[t], s;
}
function Yl(l, e, t) {
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
      ), o(e, "class", "scope svelte-18r3645");
    },
    m(s, i) {
      L(s, e, i), n(e, t);
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
function bn(l) {
  let e = (
    /*playId*/
    l[6]
  ), t, s, i, c, r, a, f, u, p, v, g, b, m, h, _ = Number(
    /*userRaffleEntries*/
    l[2] ?? 0
  ).toLocaleString("es-ES") + "", q, A, k, x, E, w = Fl(l), j = W([{ key: "raffle_a", label: "Sorteo A" }, { key: "raffle_b", label: "Sorteo B" }]), T = [];
  for (let P = 0; P < 2; P += 1)
    T[P] = Vl(Xl(l, j, P));
  function R(P, F) {
    return (
      /*activeThresholds*/
      P[8].length ? Nn : An
    );
  }
  let N = R(l), O = N(l);
  return {
    c() {
      w.c(), t = y(), s = d("div"), i = d("article"), c = d("div"), c.innerHTML = '<span class="mini-icon svelte-18r3645"></span> <h3 class="svelte-18r3645">Premios sorteables</h3>', r = y(), a = d("div");
      for (let P = 0; P < 2; P += 1)
        T[P].c();
      f = y(), u = d("article"), p = d("div"), p.innerHTML = '<span class="mini-icon spark svelte-18r3645"></span> <h3 class="svelte-18r3645">Participaciones por puntos</h3>', v = y(), g = d("div"), b = d("p"), b.textContent = "Tus participaciones actuales", m = y(), h = d("strong"), q = z(_), A = y(), k = d("span"), k.textContent = "Se aplica siempre el umbral mas alto que hayas alcanzado.", x = y(), E = d("div"), O.c(), o(c, "class", "extras-heading svelte-18r3645"), o(a, "class", "raffle-grid svelte-18r3645"), o(i, "class", "extras-card svelte-18r3645"), o(p, "class", "extras-heading svelte-18r3645"), o(b, "class", "svelte-18r3645"), o(h, "class", "svelte-18r3645"), o(k, "class", "svelte-18r3645"), o(g, "class", "entries-box svelte-18r3645"), o(E, "class", "threshold-list svelte-18r3645"), o(u, "class", "extras-card svelte-18r3645"), o(s, "class", "extras-grid svelte-18r3645");
    },
    m(P, F) {
      w.m(P, F), L(P, t, F), L(P, s, F), n(s, i), n(i, c), n(i, r), n(i, a);
      for (let I = 0; I < 2; I += 1)
        T[I] && T[I].m(a, null);
      n(s, f), n(s, u), n(u, p), n(u, v), n(u, g), n(g, b), n(g, m), n(g, h), n(h, q), n(g, A), n(g, k), n(u, x), n(u, E), O.m(E, null);
    },
    p(P, F) {
      if (F & /*playId*/
      64 && le(e, e = /*playId*/
      P[6]) ? (w.d(1), w = Fl(P), w.c(), w.m(t.parentNode, t)) : w.p(P, F), F & /*resolveRaffleReward*/
      1024) {
        j = W([
          { key: "raffle_a", label: "Sorteo A" },
          { key: "raffle_b", label: "Sorteo B" }
        ]);
        let I;
        for (I = 0; I < 2; I += 1) {
          const G = Xl(P, j, I);
          T[I] ? T[I].p(G, F) : (T[I] = Vl(G), T[I].c(), T[I].m(a, null));
        }
        for (; I < 2; I += 1)
          T[I].d(1);
      }
      F & /*userRaffleEntries*/
      4 && _ !== (_ = Number(
        /*userRaffleEntries*/
        P[2] ?? 0
      ).toLocaleString("es-ES") + "") && M(q, _), N === (N = R(P)) && O ? O.p(P, F) : (O.d(1), O = N(P), O && (O.c(), O.m(E, null)));
    },
    d(P) {
      P && (S(t), S(s)), w.d(P), Ne(T, P), O.d();
    }
  };
}
function mn(l) {
  let e, t = W([
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
    s[i] = Kl(Yl(l, t, i));
  return {
    c() {
      e = d("div");
      for (let i = 0; i < 3; i += 1)
        s[i].c();
      o(e, "class", "classic-grid svelte-18r3645");
    },
    m(i, c) {
      L(i, e, c);
      for (let r = 0; r < 3; r += 1)
        s[r] && s[r].m(e, null);
    },
    p(i, c) {
      if (c & /*classicUsers, rewards*/
      33) {
        t = W([
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
          const a = Yl(i, t, r);
          s[r] ? s[r].p(a, c) : (s[r] = Kl(a), s[r].c(), s[r].m(e, null));
        }
        for (; r < 3; r += 1)
          s[r].d(1);
      }
    },
    d(i) {
      i && S(e), Ne(s, i);
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
      e = d("span"), t = z("+"), i = z(s), c = z(" XP"), o(e, "class", "xp svelte-18r3645");
    },
    m(r, a) {
      L(r, e, a), n(e, t), n(e, i), n(e, c);
    },
    p(r, a) {
      a & /*winner*/
      128 && s !== (s = /*winner*/
      r[7].periodical_exp + "") && M(i, s);
    },
    d(r) {
      r && S(e);
    }
  };
}
function _n(l) {
  let e, t = (
    /*winner*/
    (l[7].first_name || /*winner*/
    l[7].last_name || "?").charAt(0) + ""
  ), s;
  return {
    c() {
      e = d("div"), s = z(t), o(e, "class", "winner-avatar fallback svelte-18r3645");
    },
    m(i, c) {
      L(i, e, c), n(e, s);
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
function xn(l) {
  let e, t, s;
  return {
    c() {
      e = d("img"), Ae(e.src, t = /*winner*/
      l[7].avatar_url) || o(e, "src", t), o(e, "alt", s = /*winner*/
      l[7].first_name), o(e, "class", "winner-avatar svelte-18r3645"), o(e, "loading", "lazy");
    },
    m(i, c) {
      L(i, e, c);
    },
    p(i, c) {
      c & /*winner*/
      128 && !Ae(e.src, t = /*winner*/
      i[7].avatar_url) && o(e, "src", t), c & /*winner*/
      128 && s !== (s = /*winner*/
      i[7].first_name) && o(e, "alt", s);
    },
    d(i) {
      i && S(e);
    }
  };
}
function yn(l) {
  let e;
  return {
    c() {
      e = d("div"), e.textContent = "?", o(e, "class", "winner-avatar fallback svelte-18r3645");
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
function kn(l) {
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
    m(r, a) {
      L(r, t, a), L(r, s, a), L(r, c, a);
    },
    p(r, a) {
      a & /*winner*/
      128 && e !== (e = /*winner*/
      r[7].first_name + "") && M(t, e), a & /*winner*/
      128 && i !== (i = /*winner*/
      r[7].last_name + "") && M(c, i);
    },
    d(r) {
      r && (S(t), S(s), S(c));
    }
  };
}
function wn(l) {
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
      e = d("span"), t = z("+"), i = z(s), c = z(" XP"), o(e, "class", "winner-score svelte-18r3645");
    },
    m(r, a) {
      L(r, e, a), n(e, t), n(e, i), n(e, c);
    },
    p(r, a) {
      a & /*winner*/
      128 && s !== (s = /*winner*/
      r[7].periodical_exp + "") && M(i, s);
    },
    d(r) {
      r && S(e);
    }
  };
}
function zn(l) {
  let e;
  return {
    c() {
      e = d("div"), e.innerHTML = '<div class="empty-copy svelte-18r3645"><strong class="svelte-18r3645">Premio Top 1 pendiente</strong> <span class="svelte-18r3645">Configura el premio garantizado para la persona que termine en primera posicion.</span></div>', o(e, "class", "reward empty svelte-18r3645");
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
  let e, t = (
    /*resolveGuaranteedReward*/
    l[9]().image_url
  ), s, i, c, r = (
    /*resolveGuaranteedReward*/
    l[9]().description
  ), a, f = (
    /*resolveGuaranteedReward*/
    l[9]().cta_url
  ), u = t && jn(l), p = r && Cn(l), v = f && Sn(l);
  return {
    c() {
      e = d("div"), u && u.c(), s = y(), i = d("p"), i.textContent = `${/*resolveGuaranteedReward*/
      l[9]().title}`, c = y(), p && p.c(), a = y(), v && v.c(), o(i, "class", "reward-title svelte-18r3645"), o(e, "class", "reward svelte-18r3645");
    },
    m(g, b) {
      L(g, e, b), u && u.m(e, null), n(e, s), n(e, i), n(e, c), p && p.m(e, null), n(e, a), v && v.m(e, null);
    },
    p(g, b) {
      t && u.p(g, b), r && p.p(g, b), f && v.p(g, b);
    },
    d(g) {
      g && S(e), u && u.d(), p && p.d(), v && v.d();
    }
  };
}
function jn(l) {
  let e, t;
  return {
    c() {
      e = d("img"), Ae(e.src, t = /*resolveGuaranteedReward*/
      l[9]().image_url) || o(e, "src", t), o(
        e,
        "alt",
        /*resolveGuaranteedReward*/
        l[9]().title
      ), o(e, "loading", "lazy"), o(e, "class", "svelte-18r3645");
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
function Cn(l) {
  let e;
  return {
    c() {
      e = d("p"), e.textContent = `${/*resolveGuaranteedReward*/
      l[9]().description}`, o(e, "class", "reward-desc svelte-18r3645");
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
  let e, t;
  return {
    c() {
      e = d("a"), t = z("Ver mas"), o(
        e,
        "href",
        /*resolveGuaranteedReward*/
        l[9]().cta_url
      ), o(e, "target", "_blank"), o(e, "rel", "noreferrer"), o(e, "class", "svelte-18r3645");
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
  let e, t, s, i, c, r, a, f, u, p, v, g, b = (
    /*winner*/
    l[7].id !== "placeholder" && Bl(l)
  );
  function m(T, R) {
    return (
      /*winner*/
      T[7].id === "placeholder" ? yn : (
        /*winner*/
        T[7].avatar_url ? xn : _n
      )
    );
  }
  let h = m(l), _ = h(l);
  function q(T, R) {
    return (
      /*winner*/
      T[7].id === "placeholder" ? wn : kn
    );
  }
  let A = q(l), k = A(l), x = (
    /*winner*/
    l[7].id !== "placeholder" && Ol(l)
  );
  function E(T, R) {
    return (
      /*resolveGuaranteedReward*/
      T[9]() ? qn : zn
    );
  }
  let j = E(l)(l);
  return {
    c() {
      e = d("div"), t = d("article"), s = d("div"), i = d("span"), i.textContent = "Ganador · #1", c = y(), b && b.c(), r = y(), a = d("div"), f = d("div"), _.c(), u = y(), p = d("p"), k.c(), v = y(), x && x.c(), g = y(), j.c(), o(i, "class", "place svelte-18r3645"), o(s, "class", "podium-meta svelte-18r3645"), o(p, "class", "winner-name svelte-18r3645"), o(f, "class", "winner-identity svelte-18r3645"), o(a, "class", "winner-layout svelte-18r3645"), o(t, "class", "winner-card svelte-18r3645"), o(e, "class", "podium-grid svelte-18r3645");
    },
    m(T, R) {
      L(T, e, R), n(e, t), n(t, s), n(s, i), n(s, c), b && b.m(s, null), n(t, r), n(t, a), n(a, f), _.m(f, null), n(f, u), n(f, p), k.m(p, null), n(f, v), x && x.m(f, null), n(a, g), j.m(a, null);
    },
    p(T, R) {
      /*winner*/
      T[7].id !== "placeholder" ? b ? b.p(T, R) : (b = Bl(T), b.c(), b.m(s, null)) : b && (b.d(1), b = null), h === (h = m(T)) && _ ? _.p(T, R) : (_.d(1), _ = h(T), _ && (_.c(), _.m(f, u))), A === (A = q(T)) && k ? k.p(T, R) : (k.d(1), k = A(T), k && (k.c(), k.m(p, null))), /*winner*/
      T[7].id !== "placeholder" ? x ? x.p(T, R) : (x = Ol(T), x.c(), x.m(f, null)) : x && (x.d(1), x = null), j.p(T, R);
    },
    d(T) {
      T && S(e), b && b.d(), _.d(), k.d(), x && x.d(), j.d();
    }
  };
}
function Ln(l) {
  let e;
  return {
    c() {
      e = d("div"), e.textContent = "Premio pendiente de configurar", o(e, "class", "reward empty svelte-18r3645");
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
  ), r, a = e && Tn(l), f = c && Mn(l);
  return {
    c() {
      a && a.c(), t = y(), s = d("p"), s.textContent = `${/*resolveRaffleReward*/
      l[10](
        /*item*/
        l[23].key
      ).title}`, i = y(), f && f.c(), r = Be(), o(s, "class", "reward-title svelte-18r3645");
    },
    m(u, p) {
      a && a.m(u, p), L(u, t, p), L(u, s, p), L(u, i, p), f && f.m(u, p), L(u, r, p);
    },
    p(u, p) {
      e && a.p(u, p), c && f.p(u, p);
    },
    d(u) {
      u && (S(t), S(s), S(i), S(r)), a && a.d(u), f && f.d(u);
    }
  };
}
function Tn(l) {
  let e, t;
  return {
    c() {
      e = d("img"), Ae(e.src, t = /*resolveRaffleReward*/
      l[10](
        /*item*/
        l[23].key
      ).image_url) || o(e, "src", t), o(
        e,
        "alt",
        /*resolveRaffleReward*/
        l[10](
          /*item*/
          l[23].key
        ).title
      ), o(e, "class", "raffle-image svelte-18r3645"), o(e, "loading", "lazy");
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
function Mn(l) {
  let e;
  return {
    c() {
      e = d("p"), e.textContent = `${/*resolveRaffleReward*/
      l[10](
        /*item*/
        l[23].key
      ).description}`, o(e, "class", "reward-desc svelte-18r3645");
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
  function c(f, u) {
    return (
      /*resolveRaffleReward*/
      f[10](
        /*item*/
        f[23].key
      ) ? En : Ln
    );
  }
  let a = c(l)(l);
  return {
    c() {
      e = d("div"), t = d("p"), t.textContent = `${/*item*/
      l[23].label}`, s = y(), a.c(), i = y(), o(t, "class", "raffle-label svelte-18r3645"), o(e, "class", "raffle-card svelte-18r3645");
    },
    m(f, u) {
      L(f, e, u), n(e, t), n(e, s), a.m(e, null), n(e, i);
    },
    p(f, u) {
      a.p(f, u);
    },
    d(f) {
      f && S(e), a.d();
    }
  };
}
function An(l) {
  let e;
  return {
    c() {
      e = d("div"), e.textContent = "Aun no hay umbrales configurados para este ambito.", o(e, "class", "reward empty svelte-18r3645");
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
function Nn(l) {
  let e, t = W(
    /*activeThresholds*/
    l[8]
  ), s = [];
  for (let i = 0; i < t.length; i += 1)
    s[i] = Ul(Dl(l, t, i));
  return {
    c() {
      for (let i = 0; i < s.length; i += 1)
        s[i].c();
      e = Be();
    },
    m(i, c) {
      for (let r = 0; r < s.length; r += 1)
        s[r] && s[r].m(i, c);
      L(i, e, c);
    },
    p(i, c) {
      if (c & /*activeThresholds, Number*/
      256) {
        t = W(
          /*activeThresholds*/
          i[8]
        );
        let r;
        for (r = 0; r < t.length; r += 1) {
          const a = Dl(i, t, r);
          s[r] ? s[r].p(a, c) : (s[r] = Ul(a), s[r].c(), s[r].m(e.parentNode, e));
        }
        for (; r < s.length; r += 1)
          s[r].d(1);
        s.length = t.length;
      }
    },
    d(i) {
      i && S(e), Ne(s, i);
    }
  };
}
function Ul(l) {
  let e, t, s, i = Number(
    /*threshold*/
    l[20].min_points ?? 0
  ).toLocaleString("es-ES") + "", c, r, a, f, u = (
    /*threshold*/
    l[20].entries_count + ""
  ), p, v, g = (
    /*threshold*/
    l[20].entries_count === 1 ? "ion" : "iones"
  ), b, m;
  return {
    c() {
      e = d("div"), t = d("span"), s = z("Desde "), c = z(i), r = z(" PA"), a = y(), f = d("strong"), p = z(u), v = z(" participac"), b = z(g), m = y(), o(f, "class", "svelte-18r3645"), o(e, "class", "threshold-row svelte-18r3645");
    },
    m(h, _) {
      L(h, e, _), n(e, t), n(t, s), n(t, c), n(t, r), n(e, a), n(e, f), n(f, p), n(f, v), n(f, b), n(e, m);
    },
    p(h, _) {
      _ & /*activeThresholds*/
      256 && i !== (i = Number(
        /*threshold*/
        h[20].min_points ?? 0
      ).toLocaleString("es-ES") + "") && M(c, i), _ & /*activeThresholds*/
      256 && u !== (u = /*threshold*/
      h[20].entries_count + "") && M(p, u), _ & /*activeThresholds*/
      256 && g !== (g = /*threshold*/
      h[20].entries_count === 1 ? "ion" : "iones") && M(b, g);
    },
    d(h) {
      h && S(e);
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
      e = d("span"), t = z("+"), i = z(s), c = z(" XP"), o(e, "class", "xp svelte-18r3645");
    },
    m(r, a) {
      L(r, e, a), n(e, t), n(e, i), n(e, c);
    },
    p(r, a) {
      a & /*classicUsers*/
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
function Rn(l) {
  let e;
  return {
    c() {
      e = d("div"), e.textContent = "Recompensa pendiente", o(e, "class", "reward empty svelte-18r3645");
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
function In(l) {
  var u, p;
  let e, t, s, i = (
    /*rewards*/
    l[0][
      /*slot*/
      l[17].key
    ].title + ""
  ), c, r, a = (
    /*rewards*/
    ((u = l[0][
      /*slot*/
      l[17].key
    ]) == null ? void 0 : u.image_url) && $l(l)
  ), f = (
    /*rewards*/
    ((p = l[0][
      /*slot*/
      l[17].key
    ]) == null ? void 0 : p.description) && Jl(l)
  );
  return {
    c() {
      e = d("div"), a && a.c(), t = y(), s = d("p"), c = z(i), r = y(), f && f.c(), o(s, "class", "reward-title svelte-18r3645"), o(e, "class", "reward svelte-18r3645");
    },
    m(v, g) {
      L(v, e, g), a && a.m(e, null), n(e, t), n(e, s), n(s, c), n(e, r), f && f.m(e, null);
    },
    p(v, g) {
      var b, m;
      /*rewards*/
      (b = v[0][
        /*slot*/
        v[17].key
      ]) != null && b.image_url ? a ? a.p(v, g) : (a = $l(v), a.c(), a.m(e, t)) : a && (a.d(1), a = null), g & /*rewards*/
      1 && i !== (i = /*rewards*/
      v[0][
        /*slot*/
        v[17].key
      ].title + "") && M(c, i), /*rewards*/
      (m = v[0][
        /*slot*/
        v[17].key
      ]) != null && m.description ? f ? f.p(v, g) : (f = Jl(v), f.c(), f.m(e, null)) : f && (f.d(1), f = null);
    },
    d(v) {
      v && S(e), a && a.d(), f && f.d();
    }
  };
}
function $l(l) {
  let e, t, s;
  return {
    c() {
      e = d("img"), Ae(e.src, t = /*rewards*/
      l[0][
        /*slot*/
        l[17].key
      ].image_url) || o(e, "src", t), o(e, "alt", s = /*rewards*/
      l[0][
        /*slot*/
        l[17].key
      ].title), o(e, "loading", "lazy"), o(e, "class", "svelte-18r3645");
    },
    m(i, c) {
      L(i, e, c);
    },
    p(i, c) {
      c & /*rewards*/
      1 && !Ae(e.src, t = /*rewards*/
      i[0][
        /*slot*/
        i[17].key
      ].image_url) && o(e, "src", t), c & /*rewards*/
      1 && s !== (s = /*rewards*/
      i[0][
        /*slot*/
        i[17].key
      ].title) && o(e, "alt", s);
    },
    d(i) {
      i && S(e);
    }
  };
}
function Jl(l) {
  let e, t = (
    /*rewards*/
    l[0][
      /*slot*/
      l[17].key
    ].description + ""
  ), s;
  return {
    c() {
      e = d("p"), s = z(t), o(e, "class", "reward-desc svelte-18r3645");
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
      ].description + "") && M(s, t);
    },
    d(i) {
      i && S(e);
    }
  };
}
function Pn(l) {
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
      e = d("div"), s = z(t), o(e, "class", "classic-avatar fallback svelte-18r3645");
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
      ].last_name || "?").charAt(0) + "") && M(s, t);
    },
    d(i) {
      i && S(e);
    }
  };
}
function Dn(l) {
  let e, t, s;
  return {
    c() {
      e = d("img"), Ae(e.src, t = /*classicUsers*/
      l[5][
        /*slot*/
        l[17].place - 1
      ].avatar_url) || o(e, "src", t), o(e, "alt", s = /*classicUsers*/
      l[5][
        /*slot*/
        l[17].place - 1
      ].first_name), o(e, "class", "classic-avatar svelte-18r3645"), o(e, "loading", "lazy");
    },
    m(i, c) {
      L(i, e, c);
    },
    p(i, c) {
      c & /*classicUsers*/
      32 && !Ae(e.src, t = /*classicUsers*/
      i[5][
        /*slot*/
        i[17].place - 1
      ].avatar_url) && o(e, "src", t), c & /*classicUsers*/
      32 && s !== (s = /*classicUsers*/
      i[5][
        /*slot*/
        i[17].place - 1
      ].first_name) && o(e, "alt", s);
    },
    d(i) {
      i && S(e);
    }
  };
}
function Kl(l) {
  let e, t, s, i, c, r, a, f, u, p, v = (
    /*classicUsers*/
    l[5][
      /*slot*/
      l[17].place - 1
    ].first_name + ""
  ), g, b, m = (
    /*classicUsers*/
    l[5][
      /*slot*/
      l[17].place - 1
    ].last_name + ""
  ), h, _, q, A, k = (
    /*classicUsers*/
    l[5][
      /*slot*/
      l[17].place - 1
    ].periodical_exp + ""
  ), x, E, w, j = (
    /*classicUsers*/
    l[5][
      /*slot*/
      l[17].place - 1
    ].id !== "placeholder" && Gl(l)
  );
  function T(I, G) {
    var $;
    return (
      /*rewards*/
      ($ = I[0]) != null && $[
        /*slot*/
        I[17].key
      ] ? In : Rn
    );
  }
  let R = T(l), N = R(l);
  function O(I, G) {
    return (
      /*classicUsers*/
      I[5][
        /*slot*/
        I[17].place - 1
      ].avatar_url ? Dn : Pn
    );
  }
  let P = O(l), F = P(l);
  return {
    c() {
      e = d("article"), t = d("div"), s = d("span"), s.textContent = `${/*slot*/
      l[17].place} lugar`, i = y(), j && j.c(), c = y(), N.c(), r = y(), a = d("div"), F.c(), f = y(), u = d("div"), p = d("p"), g = z(v), b = y(), h = z(m), _ = y(), q = d("span"), A = z("+"), x = z(k), E = z(" XP"), w = y(), o(s, "class", "place svelte-18r3645"), o(t, "class", "podium-meta svelte-18r3645"), o(p, "class", "svelte-18r3645"), o(q, "class", "svelte-18r3645"), o(u, "class", "classic-user-meta svelte-18r3645"), o(a, "class", "classic-user svelte-18r3645"), o(e, "class", $e(`classic-card ${/*slot*/
      l[17].className}`) + " svelte-18r3645");
    },
    m(I, G) {
      L(I, e, G), n(e, t), n(t, s), n(t, i), j && j.m(t, null), n(e, c), N.m(e, null), n(e, r), n(e, a), F.m(a, null), n(a, f), n(a, u), n(u, p), n(p, g), n(p, b), n(p, h), n(u, _), n(u, q), n(q, A), n(q, x), n(q, E), n(e, w);
    },
    p(I, G) {
      /*classicUsers*/
      I[5][
        /*slot*/
        I[17].place - 1
      ].id !== "placeholder" ? j ? j.p(I, G) : (j = Gl(I), j.c(), j.m(t, null)) : j && (j.d(1), j = null), R === (R = T(I)) && N ? N.p(I, G) : (N.d(1), N = R(I), N && (N.c(), N.m(e, r))), P === (P = O(I)) && F ? F.p(I, G) : (F.d(1), F = P(I), F && (F.c(), F.m(a, f))), G & /*classicUsers*/
      32 && v !== (v = /*classicUsers*/
      I[5][
        /*slot*/
        I[17].place - 1
      ].first_name + "") && M(g, v), G & /*classicUsers*/
      32 && m !== (m = /*classicUsers*/
      I[5][
        /*slot*/
        I[17].place - 1
      ].last_name + "") && M(h, m), G & /*classicUsers*/
      32 && k !== (k = /*classicUsers*/
      I[5][
        /*slot*/
        I[17].place - 1
      ].periodical_exp + "") && M(x, k);
    },
    d(I) {
      I && S(e), j && j.d(), N.d(), F.d();
    }
  };
}
function Ql(l) {
  let e;
  return {
    c() {
      e = d("div"), e.textContent = "Cargando clasificaciones...", o(e, "class", "loading svelte-18r3645");
    },
    m(t, s) {
      L(t, e, s);
    },
    d(t) {
      t && S(e);
    }
  };
}
function Xn(l) {
  let e, t, s, i, c, r, a, f, u, p, v, g, b = (
    /*rewardMode*/
    l[1] === "classic_top3" ? "Premios para Top 1, Top 2 y Top 3" : "Top 1 garantizado + 2 sorteos por umbrales"
  ), m, h, _, q = (
    /*scopeLabel*/
    l[3] && Hl(l)
  );
  function A(w, j) {
    return (
      /*rewardMode*/
      w[1] === "classic_top3" ? mn : bn
    );
  }
  let k = A(l), x = k(l), E = (
    /*loading*/
    l[4] && Ql()
  );
  return {
    c() {
      e = d("section"), t = d("header"), s = d("div"), i = d("p"), i.textContent = "Podio temporada", c = y(), r = d("h2"), r.textContent = "Top Activos", a = y(), q && q.c(), f = y(), u = d("div"), p = d("span"), v = y(), g = d("span"), m = z(b), h = y(), x.c(), _ = y(), E && E.c(), o(i, "class", "eyebrow svelte-18r3645"), o(r, "class", "svelte-18r3645"), o(p, "class", "badge-icon svelte-18r3645"), o(p, "aria-hidden", "true"), o(u, "class", "badge svelte-18r3645"), o(t, "class", "podium-header svelte-18r3645"), o(e, "class", "podium-wrap svelte-18r3645"), o(
        e,
        "data-play",
        /*playId*/
        l[6]
      );
    },
    m(w, j) {
      L(w, e, j), n(e, t), n(t, s), n(s, i), n(s, c), n(s, r), n(s, a), q && q.m(s, null), n(t, f), n(t, u), n(u, p), n(u, v), n(u, g), n(g, m), n(e, h), x.m(e, null), n(e, _), E && E.m(e, null);
    },
    p(w, [j]) {
      /*scopeLabel*/
      w[3] ? q ? q.p(w, j) : (q = Hl(w), q.c(), q.m(s, null)) : q && (q.d(1), q = null), j & /*rewardMode*/
      2 && b !== (b = /*rewardMode*/
      w[1] === "classic_top3" ? "Premios para Top 1, Top 2 y Top 3" : "Top 1 garantizado + 2 sorteos por umbrales") && M(m, b), k === (k = A(w)) && x ? x.p(w, j) : (x.d(1), x = k(w), x && (x.c(), x.m(e, _))), /*loading*/
      w[4] ? E || (E = Ql(), E.c(), E.m(e, null)) : E && (E.d(1), E = null), j & /*playId*/
      64 && o(
        e,
        "data-play",
        /*playId*/
        w[6]
      );
    },
    i: D,
    o: D,
    d(w) {
      w && S(e), q && q.d(), x.d(), E && E.d();
    }
  };
}
function Yn(l, e, t) {
  let s, i, c, r, { users: a = [] } = e, { rewards: f = {} } = e, { rewardMode: u = "raffle_thresholds" } = e, { raffleThresholds: p = [] } = e, { userRaffleEntries: v = 0 } = e, { scopeLabel: g = "" } = e, { loading: b = !1 } = e;
  const m = {
    id: "placeholder",
    first_name: "Por definir",
    last_name: "",
    avatar_url: "",
    periodical_exp: 0
  }, h = (x) => Array.isArray(x) ? x : [], _ = () => (f == null ? void 0 : f.guaranteed_winner) || (f == null ? void 0 : f[1]) || (f == null ? void 0 : f["1"]), q = (x) => f == null ? void 0 : f[x];
  let A = 0, k = "";
  return l.$$set = (x) => {
    "users" in x && t(11, a = x.users), "rewards" in x && t(0, f = x.rewards), "rewardMode" in x && t(1, u = x.rewardMode), "raffleThresholds" in x && t(12, p = x.raffleThresholds), "userRaffleEntries" in x && t(2, v = x.userRaffleEntries), "scopeLabel" in x && t(3, g = x.scopeLabel), "loading" in x && t(4, b = x.loading);
  }, l.$$.update = () => {
    if (l.$$.dirty & /*users*/
    2048 && t(14, s = [...h(a)].slice(0, 1)), l.$$.dirty & /*podiumUsers*/
    16384)
      for (; s.length < 1; ) s.push(m);
    if (l.$$.dirty & /*users*/
    2048 && t(5, i = [...h(a)].slice(0, 3)), l.$$.dirty & /*classicUsers*/
    32)
      for (; i.length < 3; ) i.push(m);
    if (l.$$.dirty & /*raffleThresholds*/
    4096 && t(8, c = Array.isArray(p) ? p.filter((x) => x == null ? void 0 : x.active).sort((x, E) => ((x == null ? void 0 : x.min_points) ?? 0) - ((E == null ? void 0 : E.min_points) ?? 0)) : []), l.$$.dirty & /*podiumUsers*/
    16384 && t(7, r = s[0] || m), l.$$.dirty & /*users, rewards, raffleThresholds, rewardMode, userRaffleEntries, loading, scopeLabel, signature, playId*/
    14431) {
      const x = h(a).map((T) => (T == null ? void 0 : T.id) ?? "").join("|"), E = f ? Object.keys(f).sort().map((T) => {
        var R;
        return `${T}:${((R = f[T]) == null ? void 0 : R.title) ?? ""}`;
      }).join("|") : "", w = Array.isArray(p) ? p.map((T) => `${T.id ?? ""}:${T.min_points}:${T.entries_count}:${T.active}`).join("|") : "", j = `${x}-${u}-${E}-${w}-${v}-${b}-${g}`;
      j !== k && (t(13, k = j), t(6, A += 1));
    }
  }, [
    f,
    u,
    v,
    g,
    b,
    i,
    A,
    r,
    c,
    _,
    q,
    a,
    p,
    k,
    s
  ];
}
class Rs extends pe {
  constructor(e) {
    super(), fe(
      this,
      e,
      Yn,
      Xn,
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
      hn
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
de(Rs, { users: {}, rewards: {}, rewardMode: {}, raffleThresholds: {}, userRaffleEntries: {}, scopeLabel: {}, loading: { type: "Boolean" } }, [], [], !0);
function Hn(l) {
  ce(l, "svelte-1p7vo7o", `.backdrop.svelte-1p7vo7o.svelte-1p7vo7o{position:fixed;inset:0;background:radial-gradient(circle at top left, rgba(239, 68, 68, 0.18), transparent 30%),
      rgba(15, 23, 42, 0.42);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;z-index:60;padding:24px}.card.svelte-1p7vo7o.svelte-1p7vo7o{width:min(760px, 100%);background:linear-gradient(180deg, rgba(255, 247, 247, 0.92), rgba(255, 255, 255, 0.98) 28%),
      #ffffff;border-radius:28px;border:1px solid rgba(226, 232, 240, 0.95);box-shadow:0 30px 90px rgba(15, 23, 42, 0.24);display:flex;flex-direction:column;gap:18px;padding:24px;box-sizing:border-box;max-height:calc(100vh - 48px);overflow:auto}.hero.svelte-1p7vo7o.svelte-1p7vo7o{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}.hero-copy.svelte-1p7vo7o.svelte-1p7vo7o{max-width:580px}.eyebrow.svelte-1p7vo7o.svelte-1p7vo7o{display:inline-flex;align-items:center;border-radius:999px;background:#fff1f2;color:#be123c;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:6px 10px;margin-bottom:10px}.title.svelte-1p7vo7o.svelte-1p7vo7o{font-size:20px;font-weight:800;margin:0;color:#0f172a}.hint.svelte-1p7vo7o.svelte-1p7vo7o{font-size:15px;line-height:1.45;margin:6px 0 0;color:#475569}.close.svelte-1p7vo7o.svelte-1p7vo7o{border:none;background:rgba(241, 245, 249, 0.96);color:#475569;width:42px;height:42px;border-radius:999px;cursor:pointer;font-size:24px}.body.svelte-1p7vo7o.svelte-1p7vo7o{display:grid;gap:14px}.field.svelte-1p7vo7o.svelte-1p7vo7o{display:grid;gap:10px}.field-head.svelte-1p7vo7o.svelte-1p7vo7o{display:flex;align-items:center;justify-content:space-between;gap:12px}.label.svelte-1p7vo7o.svelte-1p7vo7o{font-size:13px;font-weight:700;color:#334155}.caption.svelte-1p7vo7o.svelte-1p7vo7o{font-size:12px;color:#94a3b8}.caption.danger.svelte-1p7vo7o.svelte-1p7vo7o{color:#b91c1c}.select.svelte-1p7vo7o.svelte-1p7vo7o,.textarea.svelte-1p7vo7o.svelte-1p7vo7o{box-sizing:border-box;width:100%;border:1px solid #d7dee8;border-radius:18px;padding:14px 16px;font-size:15px;outline:none;background:rgba(255, 255, 255, 0.92);transition:border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease}.select.svelte-1p7vo7o.svelte-1p7vo7o:focus,.textarea.svelte-1p7vo7o.svelte-1p7vo7o:focus{border-color:#fb7185;box-shadow:0 0 0 4px rgba(251, 113, 133, 0.12)}.textarea.svelte-1p7vo7o.svelte-1p7vo7o{resize:vertical;min-height:120px;max-height:220px;line-height:1.5;font-family:inherit}.error.svelte-1p7vo7o.svelte-1p7vo7o{font-size:13px;color:#b91c1c;background:#fef2f2;border:1px solid #fecaca;padding:12px 14px;border-radius:14px}.success.svelte-1p7vo7o.svelte-1p7vo7o{font-size:13px;color:#047857;background:#ecfdf5;border:1px solid #a7f3d0;padding:12px 14px;border-radius:14px}.footer.svelte-1p7vo7o.svelte-1p7vo7o{display:flex;align-items:center;justify-content:space-between;gap:12px}.footer-left.svelte-1p7vo7o.svelte-1p7vo7o,.footer-right.svelte-1p7vo7o.svelte-1p7vo7o{display:flex;align-items:center;gap:10px}.ghost.svelte-1p7vo7o.svelte-1p7vo7o{border:1px solid #d7dee8;background:#ffffff;color:#475569;padding:11px 18px;border-radius:999px;cursor:pointer}.secondary.svelte-1p7vo7o.svelte-1p7vo7o{border:1px solid #fda4af;background:#fff1f2;color:#be123c;padding:11px 16px;border-radius:999px;cursor:pointer;font-weight:600}.primary.svelte-1p7vo7o.svelte-1p7vo7o{border:none;background:linear-gradient(135deg, #ef4444, #dc2626);color:#ffffff;padding:11px 18px;border-radius:999px;cursor:pointer;font-weight:700;box-shadow:0 12px 24px rgba(239, 68, 68, 0.28)}.primary.svelte-1p7vo7o.svelte-1p7vo7o:disabled{opacity:0.6;cursor:not-allowed;box-shadow:none}@media(max-width: 640px){.card.svelte-1p7vo7o.svelte-1p7vo7o{width:100%;padding:18px;border-radius:24px;max-height:calc(100vh - 24px)}.footer.svelte-1p7vo7o.svelte-1p7vo7o{flex-direction:column;align-items:stretch}.footer-left.svelte-1p7vo7o.svelte-1p7vo7o,.footer-right.svelte-1p7vo7o.svelte-1p7vo7o{width:100%;justify-content:stretch}.footer-left.svelte-1p7vo7o>button.svelte-1p7vo7o,.footer-right.svelte-1p7vo7o>button.svelte-1p7vo7o{flex:1 1 0}}`);
}
function Wl(l, e, t) {
  const s = l.slice();
  return s[23] = e[t], s;
}
function Zl(l) {
  let e, t, s, i, c, r, a, f, u, p, v, g, b, m, h, _, q, A, k, x, E, w, j, T, R, N, O = Math.max(
    /*message*/
    l[10].length,
    0
  ) + "", P, F, I, G, $, ve, ie, ne, J, U, _e, ee, Q, te, H, K = (
    /*submitting*/
    l[2] ? "Enviando..." : "Enviar reporte"
  ), X, Z, je, De, ye = W(
    /*categories*/
    l[1]
  ), oe = [];
  for (let V = 0; V < ye.length; V += 1)
    oe[V] = es(Wl(l, ye, V));
  let ge = (
    /*error*/
    l[3] && ts(l)
  ), xe = (
    /*success*/
    l[4] && ls()
  ), re = (
    /*canViewInbox*/
    l[7] && ss(l)
  );
  return {
    c() {
      e = d("div"), t = d("div"), s = d("div"), i = d("div"), c = d("span"), c.textContent = "Soporte", r = y(), a = d("p"), f = z(
        /*title*/
        l[5]
      ), u = y(), p = d("p"), v = z(
        /*hint*/
        l[6]
      ), g = y(), b = d("button"), b.textContent = "×", m = y(), h = d("div"), _ = d("div"), q = d("div"), q.innerHTML = '<label class="label svelte-1p7vo7o" for="report-category">Categoría</label> <span class="caption svelte-1p7vo7o">Obligatorio</span>', A = y(), k = d("select"), x = d("option"), x.textContent = "Selecciona una categoria";
      for (let V = 0; V < oe.length; V += 1)
        oe[V].c();
      E = y(), w = d("div"), j = d("div"), T = d("label"), T.textContent = "Mensaje", R = y(), N = d("span"), P = z(O), F = z("/"), I = z(At), G = y(), $ = d("textarea"), ve = y(), ge && ge.c(), ie = y(), xe && xe.c(), ne = y(), J = d("div"), U = d("div"), re && re.c(), _e = y(), ee = d("div"), Q = d("button"), Q.textContent = "Cancelar", te = y(), H = d("button"), X = z(K), o(c, "class", "eyebrow svelte-1p7vo7o"), o(a, "class", "title svelte-1p7vo7o"), o(p, "class", "hint svelte-1p7vo7o"), o(i, "class", "hero-copy svelte-1p7vo7o"), o(b, "class", "close svelte-1p7vo7o"), o(b, "type", "button"), o(s, "class", "hero svelte-1p7vo7o"), o(q, "class", "field-head svelte-1p7vo7o"), x.__value = "", Re(x, x.__value), x.disabled = !0, o(k, "id", "report-category"), o(k, "class", "select svelte-1p7vo7o"), /*selected*/
      l[9] === void 0 && Se(() => (
        /*select_change_handler*/
        l[18].call(k)
      )), o(_, "class", "field svelte-1p7vo7o"), o(T, "class", "label svelte-1p7vo7o"), o(T, "for", "report-message"), o(N, "class", "caption svelte-1p7vo7o"), Ye(
        N,
        "danger",
        /*remaining*/
        l[12] < 0
      ), o(j, "class", "field-head svelte-1p7vo7o"), o($, "id", "report-message"), o($, "class", "textarea svelte-1p7vo7o"), o($, "rows", "6"), o($, "maxlength", At), o($, "placeholder", "Ejemplo: al abrir notificaciones se queda cargando y no puedo volver atrás."), o(w, "class", "field svelte-1p7vo7o"), o(h, "class", "body svelte-1p7vo7o"), o(U, "class", "footer-left svelte-1p7vo7o"), o(Q, "class", "ghost svelte-1p7vo7o"), o(Q, "type", "button"), o(H, "class", "primary svelte-1p7vo7o"), o(H, "type", "button"), H.disabled = Z = !/*canSubmit*/
      l[11], o(ee, "class", "footer-right svelte-1p7vo7o"), o(J, "class", "footer svelte-1p7vo7o"), o(t, "class", "card svelte-1p7vo7o"), o(t, "role", "dialog"), o(t, "aria-modal", "true"), o(e, "class", "backdrop svelte-1p7vo7o"), o(e, "role", "button"), o(e, "tabindex", "0");
    },
    m(V, he) {
      L(V, e, he), n(e, t), n(t, s), n(s, i), n(i, c), n(i, r), n(i, a), n(a, f), n(i, u), n(i, p), n(p, v), n(s, g), n(s, b), n(t, m), n(t, h), n(h, _), n(_, q), n(_, A), n(_, k), n(k, x);
      for (let se = 0; se < oe.length; se += 1)
        oe[se] && oe[se].m(k, null);
      ol(
        k,
        /*selected*/
        l[9],
        !0
      ), n(h, E), n(h, w), n(w, j), n(j, T), n(j, R), n(j, N), n(N, P), n(N, F), n(N, I), n(w, G), n(w, $), Re(
        $,
        /*message*/
        l[10]
      ), n(h, ve), ge && ge.m(h, null), n(h, ie), xe && xe.m(h, null), n(t, ne), n(t, J), n(J, U), re && re.m(U, null), n(J, _e), n(J, ee), n(ee, Q), n(ee, te), n(ee, H), n(H, X), je || (De = [
        B(
          b,
          "click",
          /*close*/
          l[13]
        ),
        B(
          k,
          "change",
          /*select_change_handler*/
          l[18]
        ),
        B(
          $,
          "input",
          /*textarea_input_handler*/
          l[19]
        ),
        B(
          Q,
          "click",
          /*close*/
          l[13]
        ),
        B(
          H,
          "click",
          /*submit*/
          l[14]
        ),
        B(t, "click", Vs(
          /*click_handler*/
          l[17]
        )),
        B(
          e,
          "click",
          /*close*/
          l[13]
        ),
        B(
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
        v,
        /*hint*/
        V[6]
      ), he & /*categories*/
      2) {
        ye = W(
          /*categories*/
          V[1]
        );
        let se;
        for (se = 0; se < ye.length; se += 1) {
          const Oe = Wl(V, ye, se);
          oe[se] ? oe[se].p(Oe, he) : (oe[se] = es(Oe), oe[se].c(), oe[se].m(k, null));
        }
        for (; se < oe.length; se += 1)
          oe[se].d(1);
        oe.length = ye.length;
      }
      he & /*selected, categories*/
      514 && ol(
        k,
        /*selected*/
        V[9]
      ), he & /*message*/
      1024 && O !== (O = Math.max(
        /*message*/
        V[10].length,
        0
      ) + "") && M(P, O), he & /*remaining*/
      4096 && Ye(
        N,
        "danger",
        /*remaining*/
        V[12] < 0
      ), he & /*message*/
      1024 && Re(
        $,
        /*message*/
        V[10]
      ), /*error*/
      V[3] ? ge ? ge.p(V, he) : (ge = ts(V), ge.c(), ge.m(h, ie)) : ge && (ge.d(1), ge = null), /*success*/
      V[4] ? xe || (xe = ls(), xe.c(), xe.m(h, null)) : xe && (xe.d(1), xe = null), /*canViewInbox*/
      V[7] ? re ? re.p(V, he) : (re = ss(V), re.c(), re.m(U, null)) : re && (re.d(1), re = null), he & /*submitting*/
      4 && K !== (K = /*submitting*/
      V[2] ? "Enviando..." : "Enviar reporte") && M(X, K), he & /*canSubmit*/
      2048 && Z !== (Z = !/*canSubmit*/
      V[11]) && (H.disabled = Z);
    },
    d(V) {
      V && S(e), Ne(oe, V), ge && ge.d(), xe && xe.d(), re && re.d(), je = !1, me(De);
    }
  };
}
function es(l) {
  let e, t = (
    /*cat*/
    l[23] + ""
  ), s, i;
  return {
    c() {
      e = d("option"), s = z(t), e.__value = i = /*cat*/
      l[23], Re(e, e.__value);
    },
    m(c, r) {
      L(c, e, r), n(e, s);
    },
    p(c, r) {
      r & /*categories*/
      2 && t !== (t = /*cat*/
      c[23] + "") && M(s, t), r & /*categories*/
      2 && i !== (i = /*cat*/
      c[23]) && (e.__value = i, Re(e, e.__value));
    },
    d(c) {
      c && S(e);
    }
  };
}
function ts(l) {
  let e, t;
  return {
    c() {
      e = d("div"), t = z(
        /*error*/
        l[3]
      ), o(e, "class", "error svelte-1p7vo7o");
    },
    m(s, i) {
      L(s, e, i), n(e, t);
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
function ls(l) {
  let e;
  return {
    c() {
      e = d("div"), e.textContent = "Reporte enviado. ¡Gracias!", o(e, "class", "success svelte-1p7vo7o");
    },
    m(t, s) {
      L(t, e, s);
    },
    d(t) {
      t && S(e);
    }
  };
}
function ss(l) {
  let e, t, s, i;
  return {
    c() {
      e = d("button"), t = z(
        /*inboxLabel*/
        l[8]
      ), o(e, "class", "secondary svelte-1p7vo7o"), o(e, "type", "button");
    },
    m(c, r) {
      L(c, e, r), n(e, t), s || (i = B(
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
function Bn(l) {
  let e, t = (
    /*open*/
    l[0] && Zl(l)
  );
  return {
    c() {
      t && t.c(), e = Be();
    },
    m(s, i) {
      t && t.m(s, i), L(s, e, i);
    },
    p(s, [i]) {
      /*open*/
      s[0] ? t ? t.p(s, i) : (t = Zl(s), t.c(), t.m(e.parentNode, e)) : t && (t.d(1), t = null);
    },
    i: D,
    o: D,
    d(s) {
      s && S(e), t && t.d(s);
    }
  };
}
const On = 5, At = 1e3;
function Fn(l, e, t) {
  let s, i, c, { open: r = !1 } = e, { categories: a = [] } = e, { submitting: f = !1 } = e, { error: u = "" } = e, { success: p = !1 } = e, { title: v = "Reportar un problema" } = e, { hint: g = "Cuéntanos qué ha ocurrido para poder ayudarte." } = e, { canViewInbox: b = !1 } = e, { inboxLabel: m = "Abrir buzón de reports" } = e, h = "", _ = "";
  const q = Le(), A = () => {
    t(9, h = ""), t(10, _ = "");
  }, k = () => {
    q("close");
  }, x = () => {
    c && q("submit", { category: h, message: _ });
  }, E = () => {
    q("inboxclick");
  };
  function w(N) {
    Zs.call(this, l, N);
  }
  function j() {
    h = Gs(this), t(9, h), t(1, a);
  }
  function T() {
    _ = this.value, t(10, _);
  }
  const R = (N) => N.key === "Escape" && k();
  return l.$$set = (N) => {
    "open" in N && t(0, r = N.open), "categories" in N && t(1, a = N.categories), "submitting" in N && t(2, f = N.submitting), "error" in N && t(3, u = N.error), "success" in N && t(4, p = N.success), "title" in N && t(5, v = N.title), "hint" in N && t(6, g = N.hint), "canViewInbox" in N && t(7, b = N.canViewInbox), "inboxLabel" in N && t(8, m = N.inboxLabel);
  }, l.$$.update = () => {
    l.$$.dirty & /*message*/
    1024 && t(16, s = _.trim()), l.$$.dirty & /*message*/
    1024 && t(12, i = At - _.length), l.$$.dirty & /*selected, trimmedMessage, submitting*/
    66052 && t(11, c = !!h && s.length >= On && !f), l.$$.dirty & /*success*/
    16 && p && A();
  }, [
    r,
    a,
    f,
    u,
    p,
    v,
    g,
    b,
    m,
    h,
    _,
    c,
    i,
    k,
    x,
    E,
    s,
    w,
    j,
    T,
    R
  ];
}
class Is extends pe {
  constructor(e) {
    super(), fe(
      this,
      e,
      Fn,
      Bn,
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
      Hn
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
de(Is, { open: { type: "Boolean" }, categories: {}, submitting: { type: "Boolean" }, error: {}, success: { type: "Boolean" }, title: {}, hint: {}, canViewInbox: { type: "Boolean" }, inboxLabel: {} }, [], [], !0);
function Vn(l) {
  ce(l, "svelte-1qhrdq8", ".overlay.svelte-1qhrdq8{position:fixed;inset:0;z-index:80;display:flex;align-items:center;justify-content:center;padding:24px;background:radial-gradient(circle at top, rgba(59, 130, 246, 0.14), rgba(0, 0, 0, 0.58));backdrop-filter:blur(10px)}.card.svelte-1qhrdq8{width:min(560px, 92vw);border-radius:28px;padding:28px 26px 24px;background:linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);box-shadow:0 24px 60px rgba(15, 23, 42, 0.24), 0 10px 28px rgba(15, 23, 42, 0.12);border:1px solid rgba(226, 232, 240, 0.9)}.eyebrow.svelte-1qhrdq8{display:inline-flex;align-items:center;padding:6px 12px;border-radius:999px;background:rgba(16, 185, 129, 0.12);color:#047857;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase}h2.svelte-1qhrdq8{margin:14px 0 8px;font-size:24px;font-weight:700;color:#0f172a}p.svelte-1qhrdq8{margin:0;font-size:15px;line-height:1.7;color:#475569;white-space:pre-wrap}.actions.svelte-1qhrdq8{margin-top:20px;display:flex;justify-content:flex-end}button.svelte-1qhrdq8{border:none;border-radius:14px;padding:10px 18px;font-size:14px;font-weight:600;color:#ffffff;background:linear-gradient(135deg, #059669, #047857);box-shadow:0 12px 24px rgba(5, 150, 105, 0.24);cursor:pointer}");
}
function is(l) {
  let e, t, s, i, c, r, a, f, u, p, v, g, b, m, h, _, q, A;
  return {
    c() {
      e = d("div"), t = d("div"), s = d("div"), s.textContent = "Aviso", i = y(), c = d("h2"), r = z(
        /*title*/
        l[1]
      ), a = y(), f = d("p"), u = z(
        /*message*/
        l[2]
      ), p = y(), v = d("div"), g = d("button"), b = z(
        /*cta*/
        l[3]
      ), o(s, "class", "eyebrow svelte-1qhrdq8"), o(c, "class", "svelte-1qhrdq8"), o(f, "class", "svelte-1qhrdq8"), o(g, "type", "button"), o(g, "class", "svelte-1qhrdq8"), o(v, "class", "actions svelte-1qhrdq8"), o(t, "class", "card svelte-1qhrdq8"), o(e, "class", "overlay svelte-1qhrdq8"), o(e, "role", "button"), o(e, "tabindex", "0"), o(e, "aria-label", "Cerrar aviso");
    },
    m(k, x) {
      L(k, e, x), n(e, t), n(t, s), n(t, i), n(t, c), n(c, r), n(t, a), n(t, f), n(f, u), n(t, p), n(t, v), n(v, g), n(g, b), _ = !0, q || (A = [
        B(
          g,
          "click",
          /*handleClose*/
          l[4]
        ),
        B(
          e,
          "click",
          /*handleBackdrop*/
          l[5]
        ),
        B(
          e,
          "keydown",
          /*handleKeydown*/
          l[6]
        )
      ], q = !0);
    },
    p(k, x) {
      (!_ || x & /*title*/
      2) && M(
        r,
        /*title*/
        k[1]
      ), (!_ || x & /*message*/
      4) && M(
        u,
        /*message*/
        k[2]
      ), (!_ || x & /*cta*/
      8) && M(
        b,
        /*cta*/
        k[3]
      );
    },
    i(k) {
      _ || (k && Se(() => {
        _ && (m || (m = qe(t, He, { y: 18, duration: 240 }, !0)), m.run(1));
      }), k && Se(() => {
        _ && (h || (h = qe(e, xt, { duration: 180 }, !0)), h.run(1));
      }), _ = !0);
    },
    o(k) {
      k && (m || (m = qe(t, He, { y: 18, duration: 240 }, !1)), m.run(0)), k && (h || (h = qe(e, xt, { duration: 180 }, !1)), h.run(0)), _ = !1;
    },
    d(k) {
      k && S(e), k && m && m.end(), k && h && h.end(), q = !1, me(A);
    }
  };
}
function Un(l) {
  let e, t = (
    /*open*/
    l[0] && is(l)
  );
  return {
    c() {
      t && t.c(), e = Be();
    },
    m(s, i) {
      t && t.m(s, i), L(s, e, i);
    },
    p(s, [i]) {
      /*open*/
      s[0] ? t ? (t.p(s, i), i & /*open*/
      1 && Pe(t, 1)) : (t = is(s), t.c(), Pe(t, 1), t.m(e.parentNode, e)) : t && (Pt(), ot(t, 1, 1, () => {
        t = null;
      }), Dt());
    },
    i(s) {
      Pe(t);
    },
    o(s) {
      ot(t);
    },
    d(s) {
      s && S(e), t && t.d(s);
    }
  };
}
function Gn(l, e, t) {
  let { open: s = !1 } = e, { title: i = "Aviso" } = e, { message: c = "" } = e, { cta: r = "Entendido" } = e;
  const a = Le(), f = () => {
    t(0, s = !1), a("dismiss");
  }, u = (v) => {
    v.target === v.currentTarget && f();
  }, p = (v) => {
    (v.key === "Escape" || v.key === "Enter" || v.key === " ") && f();
  };
  return l.$$set = (v) => {
    "open" in v && t(0, s = v.open), "title" in v && t(1, i = v.title), "message" in v && t(2, c = v.message), "cta" in v && t(3, r = v.cta);
  }, [s, i, c, r, f, u, p];
}
class Ps extends pe {
  constructor(e) {
    super(), fe(this, e, Gn, Un, le, { open: 0, title: 1, message: 2, cta: 3 }, Vn);
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
customElements.define("svelte-announcement-popup", de(Ps, { open: { type: "Boolean" }, title: {}, message: {}, cta: {} }, [], [], !0));
function $n(l) {
  ce(l, "svelte-3khibh", `:host{display:block}.tabs-shell.svelte-3khibh.svelte-3khibh{margin-bottom:2rem;border-bottom:1px solid rgba(203, 213, 225, 0.75)}.tabs-row.svelte-3khibh.svelte-3khibh{position:relative;display:flex;flex-wrap:wrap;justify-content:center;gap:2.2rem;padding:0 0 0.9rem}button.svelte-3khibh.svelte-3khibh{position:relative;z-index:1;appearance:none;border:0;background:transparent;color:rgba(71, 85, 105, 0.92);cursor:pointer;font:inherit;font-size:0.98rem;font-weight:500;line-height:1;padding:0;transition:color 220ms ease,
      transform 220ms ease,
      opacity 220ms ease}button.svelte-3khibh.svelte-3khibh:hover{color:#111827}button.active.svelte-3khibh.svelte-3khibh{color:#111827}button.svelte-3khibh span.svelte-3khibh{display:inline-block;transition:transform 260ms cubic-bezier(0.22, 1, 0.36, 1),
      letter-spacing 260ms ease}button.active.svelte-3khibh span.svelte-3khibh{transform:translateY(-2px);letter-spacing:0.01em}.indicator.svelte-3khibh.svelte-3khibh{position:absolute;bottom:0;left:0;height:3px;border-radius:999px;background:linear-gradient(90deg, #9fdbc2 0%, #67b48a 100%);box-shadow:0 10px 20px -14px rgba(103, 180, 138, 0.6);transition:transform 320ms cubic-bezier(0.22, 1, 0.36, 1),
      width 320ms cubic-bezier(0.22, 1, 0.36, 1)}@media(max-width: 900px){.tabs-row.svelte-3khibh.svelte-3khibh{gap:1.35rem}button.svelte-3khibh.svelte-3khibh{font-size:0.94rem}}@media(max-width: 640px){.tabs-shell.svelte-3khibh.svelte-3khibh{margin-bottom:1.5rem}.tabs-row.svelte-3khibh.svelte-3khibh{gap:0.85rem 1rem;justify-content:flex-start;padding-bottom:0.8rem}button.svelte-3khibh.svelte-3khibh{font-size:0.92rem}}`);
}
function ns(l, e, t) {
  const s = l.slice();
  return s[12] = e[t], s[13] = e, s[14] = t, s;
}
function rs(l) {
  let e, t;
  return {
    c() {
      e = d("span"), o(e, "class", "indicator svelte-3khibh"), o(e, "aria-hidden", "true"), o(e, "style", t = `transform: translateX(${/*indicatorLeft*/
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
      s[3]}px;`) && o(e, "style", t);
    },
    d(s) {
      s && S(e);
    }
  };
}
function as(l) {
  let e, t, s = (
    /*tab*/
    l[12].label + ""
  ), i, c, r, a = (
    /*index*/
    l[14]
  ), f, u;
  const p = () => (
    /*button_binding*/
    l[8](e, a)
  ), v = () => (
    /*button_binding*/
    l[8](null, a)
  );
  function g() {
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
      e = d("button"), t = d("span"), i = z(s), c = y(), o(t, "class", "svelte-3khibh"), o(e, "type", "button"), o(e, "role", "tab"), o(e, "aria-selected", r = /*isActive*/
      l[5](
        /*tab*/
        l[12].href
      )), o(e, "class", "svelte-3khibh"), Ye(
        e,
        "active",
        /*isActive*/
        l[5](
          /*tab*/
          l[12].href
        )
      );
    },
    m(b, m) {
      L(b, e, m), n(e, t), n(t, i), n(e, c), p(), f || (u = B(e, "click", g), f = !0);
    },
    p(b, m) {
      l = b, m & /*tabs*/
      1 && s !== (s = /*tab*/
      l[12].label + "") && M(i, s), m & /*tabs*/
      1 && r !== (r = /*isActive*/
      l[5](
        /*tab*/
        l[12].href
      )) && o(e, "aria-selected", r), a !== /*index*/
      l[14] && (v(), a = /*index*/
      l[14], p()), m & /*isActive, tabs*/
      33 && Ye(
        e,
        "active",
        /*isActive*/
        l[5](
          /*tab*/
          l[12].href
        )
      );
    },
    d(b) {
      b && S(e), v(), f = !1, u();
    }
  };
}
function Jn(l) {
  let e, t, s, i = (
    /*ready*/
    l[4] && rs(l)
  ), c = W(
    /*tabs*/
    l[0]
  ), r = [];
  for (let a = 0; a < c.length; a += 1)
    r[a] = as(ns(l, c, a));
  return {
    c() {
      e = d("nav"), t = d("div"), i && i.c(), s = y();
      for (let a = 0; a < r.length; a += 1)
        r[a].c();
      o(t, "class", "tabs-row svelte-3khibh"), o(t, "role", "tablist"), o(e, "class", "tabs-shell svelte-3khibh"), o(e, "aria-label", "Navegación de hitos");
    },
    m(a, f) {
      L(a, e, f), n(e, t), i && i.m(t, null), n(t, s);
      for (let u = 0; u < r.length; u += 1)
        r[u] && r[u].m(t, null);
    },
    p(a, [f]) {
      if (/*ready*/
      a[4] ? i ? i.p(a, f) : (i = rs(a), i.c(), i.m(t, s)) : i && (i.d(1), i = null), f & /*isActive, tabs, buttonRefs, handleNavigate*/
      99) {
        c = W(
          /*tabs*/
          a[0]
        );
        let u;
        for (u = 0; u < c.length; u += 1) {
          const p = ns(a, c, u);
          r[u] ? r[u].p(p, f) : (r[u] = as(p), r[u].c(), r[u].m(t, null));
        }
        for (; u < r.length; u += 1)
          r[u].d(1);
        r.length = c.length;
      }
    },
    i: D,
    o: D,
    d(a) {
      a && S(e), i && i.d(), Ne(r, a);
    }
  };
}
function Kn(l, e, t) {
  let { tabs: s = [] } = e, { activeHref: i = "" } = e;
  const c = Le();
  let r = [], a = 0, f = 0, u = !1;
  const p = (h) => i === h || h !== "/milestones" && i.startsWith(h), v = (h) => {
    c("navigate", { href: h });
  }, g = () => {
    const h = s.findIndex((q) => p(q.href)), _ = r[h];
    _ && (t(2, a = _.offsetLeft), t(3, f = _.offsetWidth), t(4, u = !0));
  };
  gs(() => {
    g();
    const h = () => g();
    return window.addEventListener("resize", h), () => {
      window.removeEventListener("resize", h);
    };
  });
  function b(h, _) {
    Tt[h ? "unshift" : "push"](() => {
      r[_] = h, t(1, r);
    });
  }
  const m = (h) => v(h.href);
  return l.$$set = (h) => {
    "tabs" in h && t(0, s = h.tabs), "activeHref" in h && t(7, i = h.activeHref);
  }, l.$$.update = () => {
    l.$$.dirty & /*tabs*/
    1 && dl().then(g), l.$$.dirty & /*activeHref*/
    128 && dl().then(g);
  }, [
    s,
    r,
    a,
    f,
    u,
    p,
    v,
    i,
    b,
    m
  ];
}
class Ds extends pe {
  constructor(e) {
    super(), fe(this, e, Kn, Jn, le, { tabs: 0, activeHref: 7 }, $n);
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
customElements.define("svelte-milestones-tabs", de(Ds, { tabs: {}, activeHref: {} }, [], [], !0));
const ue = (l, e) => {
  const t = e.element;
  customElements.get(l) || customElements.define(l, t ?? e);
};
ue("svelte-counter", _s);
ue("svelte-orbit-card", xs);
ue("svelte-pulse-badge", ys);
ue("svelte-ripple-button", ks);
ue("svelte-stagger-list", ws);
ue("svelte-thermometer", zs);
ue("svelte-podium", qs);
ue("svelte-balloon-gift", js);
ue("svelte-achievement-card", Cs);
ue("svelte-parallax-card", Ss);
ue("svelte-flip-counter", Ls);
ue("svelte-parallax-stack", Es);
ue("svelte-video-card", Ts);
ue("svelte-season-popup", Ms);
ue("svelte-quota-token", As);
ue("svelte-user-stats-panel", Ns);
ue("svelte-rewards-podium", Rs);
ue("svelte-error-report-modal", Is);
ue("svelte-announcement-popup", Ps);
ue("svelte-milestones-tabs", Ds);
