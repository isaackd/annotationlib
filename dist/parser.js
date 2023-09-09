const g = ["text", "highlight", "pause", "branding"], p = ["popup", "speech", "highlightText", "anchored", "branding", "label", "title"];
function m(e) {
  return g.includes(e);
}
function f(e) {
  return p.includes(e);
}
function h(e) {
  return new DOMParser().parseFromString(e, "application/xml");
}
function B(e) {
  const n = h(e).getElementsByTagName("annotation");
  return y(n);
}
function y(e) {
  const t = [];
  for (const n of e) {
    const r = d(n);
    r && t.push(r);
  }
  return t;
}
function d(e) {
  const t = e, n = b(t);
  if (!n.type || n.type === "pause")
    return null;
  const r = x(t), s = T(t), o = A(t);
  if (!o)
    return null;
  const { timeStart: i, timeEnd: a } = o;
  if (isNaN(i) || isNaN(a) || i === null || a === null)
    return null;
  const c = w(t);
  let l = {
    id: n.id,
    type: n.type,
    x: o.x,
    y: o.y,
    width: o.width,
    height: o.height,
    timeStart: i,
    timeEnd: a
  };
  return n.style && (l.style = n.style), r && (l.text = r), s && (l.action = s), c && (l.appearance = c), o.hasOwnProperty("sx") && (l.sx = o.sx), o.hasOwnProperty("sy") && (l.sy = o.sy), l;
}
function A(e) {
  const t = e.getElementsByTagName("movingRegion")[0];
  if (!t)
    return null;
  const n = t.getAttribute("type"), r = t.getElementsByTagName(`${n}Region`), { timeStart: s, timeEnd: o } = F(r), i = {
    x: parseFloat(r[0].getAttribute("x")),
    y: parseFloat(r[0].getAttribute("y")),
    width: parseFloat(r[0].getAttribute("w")),
    height: parseFloat(r[0].getAttribute("h")),
    timeStart: s,
    timeEnd: o
  }, a = r[0].getAttribute("sx"), c = r[0].getAttribute("sy");
  return a && (i.sx = parseFloat(a)), c && (i.sy = parseFloat(c)), i;
}
function b(e) {
  const t = e.getAttribute("id"), n = e.getAttribute("type"), r = e.getAttribute("style");
  if (!m(n))
    throw new Error("Invalid value in attribute element: type");
  if (!f(r))
    throw new Error("Invalid value in attribute element: style");
  return { id: t, type: n, style: r };
}
function x(e) {
  const t = e.getElementsByTagName("TEXT")[0];
  return t ? t.textContent : null;
}
function T(e) {
  const t = e.getElementsByTagName("action")[0];
  if (!t)
    return null;
  const n = t.getElementsByTagName("url")[0];
  if (!n)
    return null;
  const r = n.getAttribute("target"), s = n.getAttribute("value");
  if (s.startsWith("https://www.youtube.com/")) {
    const o = new URL(s), i = o.searchParams.get("src_vid"), a = o.searchParams.get("v");
    return E(o, i, a, r);
  }
}
function E(e, t, n, r) {
  if (t && n && t === n) {
    let s = 0;
    const o = e.hash;
    if (o && o.startsWith("#t=")) {
      const i = e.hash.split("#t=")[1];
      s = S(i);
    }
    return { type: "time", seconds: s };
  } else
    return { type: "url", url: e.href, target: r };
}
function w(e) {
  const t = e.getElementsByTagName("appearance")[0];
  if (t) {
    const n = t.getAttribute("bgAlpha"), r = t.getAttribute("bgColor"), s = t.getAttribute("fgColor"), o = t.getAttribute("textSize"), i = {};
    return n && (i.backgroundOpacity = parseFloat(n)), r && (i.backgroundColor = parseInt(r, 10)), s && (i.foregroundColor = parseInt(s, 10)), o && (i.textSize = parseFloat(o)), i;
  }
}
function F(e) {
  const t = e[0].getAttribute("t"), n = u(t), r = e[e.length - 1].getAttribute("t"), s = u(r);
  return { timeStart: n, timeEnd: s };
}
function u(e) {
  let t = e.split(":"), n = 0, r = 1;
  for (; t.length > 0; )
    n += r * parseFloat(t.pop()), r *= 60;
  return n;
}
function S(e) {
  let t = 0;
  const n = e.split("h"), r = (n[1] || e).split("m"), s = (r[1] || e).split("s");
  return n[0] && n.length === 2 && (t += parseInt(n[0], 10) * 60 * 60), r[0] && r.length === 2 && (t += parseInt(r[0], 10) * 60), s[0] && s.length === 2 && (t += parseInt(s[0], 10)), t;
}
export {
  f as isAnnotationStyle,
  m as isAnnotationType,
  d as parseAnnotation,
  y as parseAnnotationList,
  B as parseFromXml
};
