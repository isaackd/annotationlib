(function(){"use strict";try{if(typeof document<"u"){var e=document.createElement("style");e.appendChild(document.createTextNode(".__cxt-ar-annotations-container__{--annotation-close-size: 20px;position:absolute;width:100%;height:100%;top:0;left:0;pointer-events:none;overflow:hidden}.__cxt-ar-annotation__{position:absolute;box-sizing:border-box;font-family:Arial,sans-serif;color:#fff;z-index:20}.__cxt-ar-annotation__{pointer-events:auto}.__cxt-ar-annotation__ span{position:absolute;left:0;top:0;overflow:hidden;word-wrap:break-word;white-space:pre-wrap;pointer-events:none;box-sizing:border-box;padding:2%;user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}.__cxt-ar-annotation-close__{display:none;position:absolute;cursor:pointer;z-index:9999}.__cxt-ar-annotation__[hidden]{display:none!important}.__cxt-ar-annotation__[data-ar-type=highlight]{border:1px solid rgba(255,255,255,.1);background-color:transparent}.__cxt-ar-annotation__[data-ar-type=highlight]:hover{border:1px solid rgba(255,255,255,.5);background-color:transparent}.__cxt-ar-annotation__ svg{pointer-events:all}.__cxt-ar-annotation__[data-ar-style=title] span{font-weight:700;position:relative;display:-webkit-flexbox;display:-ms-flexbox;display:-webkit-flex;display:flex;-webkit-flex-align:center;-ms-flex-align:center;-webkit-align-items:center;align-items:center;justify-content:center}")),document.head.appendChild(e)}}catch(t){console.error("vite-plugin-css-injected-by-js",t)}})();
class b {
  static get defaultAppearanceAttributes() {
    return {
      backgroundColor: 16777215,
      backgroundOpacity: 0.8,
      foregroundColor: 0,
      textSize: 3.15
    };
  }
  constructor(t, e) {
    if (!t)
      throw new Error("Annotation data must be provided");
    this.data = t, this.closeElement = e, this.element = document.createElement("div"), this.element.classList.add("__cxt-ar-annotation__"), this.element.__annotationData = this.data, this.data.text && (this.textElement = document.createElement("span"), this.textElement.textContent = this.data.text, this.element.append(this.textElement)), this.setupAppearance(), this.data.style !== "speech" && this.setupHoverAppearance(), this.element.setAttribute("data-ar-type", this.data.type), this.data.style && this.element.setAttribute("data-ar-style", this.data.style), this.element.setAttribute("hidden", ""), this.textScaling = 100, this.paddingMultiplier = 1, this.closeButtonScaling = 0.0423, this.closeButtonOffset = -1.8;
  }
  setupAppearance() {
    let t = b.defaultAppearanceAttributes;
    isNaN(this.data.appearance.textSize) || (t.textSize = this.data.appearance.textSize), isNaN(this.data.appearance.foregroundColor) || (t.foregroundColor = this.data.appearance.foregroundColor), isNaN(this.data.appearance.backgroundColor) || (t.backgroundColor = this.data.appearance.backgroundColor), isNaN(this.data.appearance.backgroundOpacity) || (t.backgroundOpacity = this.data.appearance.backgroundOpacity), this.data.appearance.backgroundColor = t.backgroundColor, this.data.appearance.backgroundOpacity = t.backgroundOpacity, this.data.appearance.foregroundColor = t.foregroundColor, this.data.appearance.textSize = t.textSize, this.element.style.color = "#" + C(t.foregroundColor);
  }
  setupHoverAppearance() {
    const { backgroundOpacity: t, backgroundColor: e } = this.data.appearance, s = c(t, e);
    this.element.style.backgroundColor = s, this.element.addEventListener("mouseenter", () => {
      this.element.style.backgroundColor = c(t, e, !0), this.closeElement.currentAnnotation = this, this.closeElement.lastAnnotation = this, this.closeElement.style.display = "block";
      const i = this.closeButtonSize / 2, n = this.element.getBoundingClientRect();
      this.closeElement.style.left = n.right - i + "px", this.closeElement.style.top = n.top - i + "px";
    }), this.element.addEventListener("mouseleave", () => {
      this.element.style.backgroundColor = c(t, e, !1), this.closeElement.currentAnnotation = null, setTimeout(() => {
        !this.closeElement.hovered && this.closeElement.currentAnnotation === null && (this.closeElement.style.display = "none");
      }, 100);
    }), this.data.action.type === "url" && (this.element.style.cursor = "pointer");
  }
  createCloseElement(t = 10) {
    const e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    e.setAttribute("viewBox", "0 0 100 100"), e.classList.add("__cxt-ar-annotation-close__");
    const s = document.createElementNS(e.namespaceURI, "path");
    s.setAttribute("d", "M25 25 L 75 75 M 75 25 L 25 75"), s.setAttribute("stroke", "#bbb"), s.setAttribute("stroke-width", t.toString()), s.setAttribute("x", "5"), s.setAttribute("y", "5");
    const i = document.createElementNS(e.namespaceURI, "circle");
    return i.setAttribute("cx", "50"), i.setAttribute("cy", "50"), i.setAttribute("r", "50"), e.append(i, s), e;
  }
  show() {
    this.element.removeAttribute("hidden");
  }
  hide() {
    this.element.setAttribute("hidden", "");
  }
  updateTextSize(t) {
    if (this.data.appearance.textSize) {
      const e = this.data.appearance.textSize / this.textScaling * t;
      this.fontSize = `${e}px`;
    }
  }
  updateCloseSize(t) {
    const e = t * this.closeButtonScaling;
    this.closeElement.style.width = e + "px", this.closeElement.style.height = e + "px", this.closeElement.style.right = e / this.closeButtonOffset + "px", this.closeElement.style.top = e / this.closeButtonOffset + "px", this.closeButtonSize = e;
  }
  setDimensions(t, e, s, i) {
    this.left = t, this.top = e, this.width = s, this.height = i;
  }
  setPadding(t, e) {
    t = t * this.paddingMultiplier + "px", e = e * this.paddingMultiplier + "px", this.element.style.padding = `${e} ${t} ${e} ${t}`;
  }
  get closed() {
    return this.element.hasAttribute("data-ar-closed");
  }
  get hidden() {
    return this.element.hasAttribute("hidden");
  }
  get type() {
    return this.data.type;
  }
  get style() {
    return this.data.style;
  }
  set left(t) {
    this.element.style.left = t;
  }
  set top(t) {
    this.element.style.top = t;
  }
  set width(t) {
    this.element.style.width = t;
  }
  set height(t) {
    this.element.style.height = t;
  }
  set fontSize(t) {
    this.element.style.fontSize = t;
  }
}
function C(p) {
  let t = p.toString(16);
  return t = "000000".substr(0, 6 - t.length) + t, t;
}
function c(p, t, e = !1, s = 230) {
  if (!isNaN(p) && !isNaN(t)) {
    const i = e ? s.toString(16) : Math.floor(p * 255).toString(16);
    return `#${C(t)}${i}`;
  }
  return "#FFFFFFFF";
}
class z extends b {
  constructor(t, e) {
    super(t, e);
    const { backgroundOpacity: s } = this.data.appearance;
    this.element.style.backgroundColor = "", this.element.style.border = `2.5px solid ${c(s, 8748933, !1)}`;
  }
  setupHoverAppearance() {
    const { backgroundOpacity: t, backgroundColor: e } = this.data.appearance, s = this.data.action.type;
    this.element.addEventListener("mouseenter", () => {
      this.closeElement.currentAnnotation = this, this.closeElement.lastAnnotation = this, this.element.style.border = `2.5px solid ${c(t, e, !0)}`, this.closeElement.style.display = "block";
      const i = this.closeButtonSize / 2, n = this.element.getBoundingClientRect();
      this.closeElement.style.left = n.right - i + "px", this.closeElement.style.top = n.top - i + "px";
    }), this.element.addEventListener("mouseleave", () => {
      this.element.style.border = `2.5px solid ${c(t, 8748933, !1)}`, this.closeElement.currentAnnotation = null, setTimeout(() => {
        !this.closeElement.hovered && this.closeElement.currentAnnotation === null && (this.closeElement.style.display = "none");
      }, 100);
    }), s === "url" && (this.element.style.cursor = "pointer");
  }
}
class X extends b {
  constructor(t, e, s) {
    t.x += s.x, t.y += s.y, super(t, e), this.element.style.backgroundColor = "", this.element.style.border = "", this.element.style.pointerEvents = "none", s.element.addEventListener("mouseenter", (i) => {
      this.show();
    }), s.element.addEventListener("mouseleave", (i) => {
      this.hide();
    }), this.closeElement.style.display = "none", this.closeElement.style.cursor = "default";
  }
  setupHoverAppearance() {
  }
}
class u extends b {
  constructor(t, e) {
    super(t, e), this.createSpeechBubble(), this.setupHoverAppearance(), this.textX = 0, this.textY = 0, this.textWidth = 0, this.textHeight = 0, this.baseStartX = 0, this.baseStartY = 0, this.baseEndX = 0, this.baseEndY = 0, this.pointX = 0, this.pointY = 0, this.directionPadding = 20, this.paddingMultiplier = 2;
  }
  /**
   * The triangle's base's starting x multiplier
   * <br>Is multiplied by the annotation's width to get the final x position
   * <br>\***Only applies to `bl`, `br`, `tl`, and `tr` point directions**
   * @returns {number}
   */
  static get horizontalBaseStartMultiplier() {
    return 0.17379070765180116;
  }
  /**
   * The triangle's base's ending x multiplier
   * <br>Is multiplied by the annotation's width to get the final x position
   * <br>\***Only applies to `bl`, `br`, `tl`, and `tr` point directions**
   * @returns {number}
   */
  static get horizontalBaseEndMultiplier() {
    return 0.14896346370154384;
  }
  /**
   * The triangle's base's starting y multiplier
   * <br>Is multiplied by the annotation's height to get the final y position
   * <br>\***Only applies to `r` and `l` point directions**
   * @returns {number}
   */
  static get verticalBaseStartMultiplier() {
    return 0.12;
  }
  /**
   * The triangle's base's ending y multiplier
   * <br>Is multiplied by the annotation's height to get the final y position
   * <br>\***Only applies to `r` and `l` point directions**
   * @returns {number}
   */
  static get verticalBaseEndMultiplier() {
    return 0.3;
  }
  /**
   * Gets the end point direction of the speech bubble triangle
   * @param {number} pointX - The x position of the triangle tip
   * @param {number} pointY - The y position of the triangle tip
   * @param {number} x - The x position of the annotation (excluding triangle)
   * @param {number} y - The y position of the annotation (excluding triangle)
   * @param {number} width - The width of the annotation (excluding triangle)
   * @param {number} height - The height of the annotation (excluding triangle)
   * @param {number} directionPadding=20
   * The margin of error allowed before a point coordinate doesn't meet the requirements for a direction
   * <br>Helps with some annotations incorrectly passing for a different direction, causing them to display wrong
   * <br>Setting the padding too high will cause the same or a worse problem as without padding
   * @returns {"br" | "bl" | "tr" | "tl" | "r" | "l"}
   */
  getPointDirection(t, e, s, i, n, o, l = 20) {
    if (n > t + s - s / 2 && o > e + i)
      return "br";
    if (n < t + s - s / 2 && o > e + i)
      return "bl";
    if (n > t + s - s / 2 && o < e - l)
      return "tr";
    if (n < t + s - s / 2 && o < e)
      return "tl";
    if (n > t + s && o > e - l && o < e + i - l)
      return "r";
    if (n < t && o > e && o < e + i)
      return "l";
  }
  createSpeechBubble(t = "white") {
    this.speechSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg"), this.speechSvg.classList.add("__cxt-ar-annotation-speech-bubble__"), this.speechSvg.style.position = "absolute", this.speechSvg.setAttribute("width", "100%"), this.speechSvg.setAttribute("height", "100%"), this.speechSvg.style.left = "0", this.speechSvg.style.left = "0", this.speechSvg.style.display = "block", this.speechSvg.style.overflow = "visible", this.speechTriangle = document.createElementNS("http://www.w3.org/2000/svg", "path"), this.speechTriangle.setAttribute("fill", t), this.speechSvg.append(this.speechTriangle);
    const { backgroundOpacity: e, backgroundColor: s } = this.data.appearance;
    this.speechTriangle.setAttribute("fill", c(e, s, !1)), this.element.prepend(this.speechSvg);
  }
  updateSpeechBubble(t, e, s, i, n, o, l = "white", m = 20) {
    const r = u.horizontalBaseStartMultiplier, g = u.horizontalBaseEndMultiplier, x = u.verticalBaseStartMultiplier, f = u.verticalBaseEndMultiplier, d = this.getPointDirection(t, e, s, i, n, o, this.directionPadding);
    let h = "";
    if (d === "br")
      this.baseStartX = s - s * r * 2, this.baseEndX = this.baseStartX + s * g, this.baseStartY = i, this.baseEndY = i, this.pointX = n - t, this.pointY = o - e, this.height = o - e + "px", h = `L${s} ${i} L${s} 0 L0 0 L0 ${this.baseStartY} L${this.baseStartX} ${this.baseStartY}`, this.textWidth = s, this.textHeight = i, this.textX = 0, this.textY = 0;
    else if (d === "bl")
      this.baseStartX = s * r, this.baseEndX = this.baseStartX + s * g, this.baseStartY = i, this.baseEndY = i, this.pointX = n - t, this.pointY = o - e, this.height = `${o - e}px`, h = `L${s} ${i} L${s} 0 L0 0 L0 ${this.baseStartY} L${this.baseStartX} ${this.baseStartY}`, this.textWidth = s, this.textHeight = i, this.textX = 0, this.textY = 0;
    else if (d === "tr") {
      this.baseStartX = s - s * r * 2, this.baseEndX = this.baseStartX + s * g;
      const a = e - o;
      this.baseStartY = a, this.baseEndY = a, this.top = e - a + "px", this.height = i + a + "px", this.pointX = n - t, this.pointY = 0, h = `L${s} ${a} L${s} ${i + a} L0 ${i + a} L0 ${a} L${this.baseStartX} ${this.baseStartY}`, this.textWidth = s, this.textHeight = i, this.textX = 0, this.textY = a;
    } else if (d === "tl") {
      this.baseStartX = s * r, this.baseEndX = this.baseStartX + s * g;
      const a = e - o;
      this.baseStartY = a, this.baseEndY = a, this.top = e - a + "px", this.height = i + a + "px", this.pointX = n - t, this.pointY = 0, h = `L${s} ${a} L${s} ${i + a} L0 ${i + a} L0 ${a} L${this.baseStartX} ${this.baseStartY}`, this.textWidth = s, this.textHeight = i, this.textX = 0, this.textY = a;
    } else if (d === "r") {
      const a = n - (t + s);
      this.baseStartX = s, this.baseEndX = s, this.width = s + a + "px", this.baseStartY = i * x, this.baseEndY = this.baseStartY + i * f, this.pointX = s + a, this.pointY = o - e, h = `L${this.baseStartX} ${i} L0 ${i} L0 0 L${this.baseStartX} 0 L${this.baseStartX} ${this.baseStartY}`, this.textWidth = s, this.textHeight = i, this.textX = 0, this.textY = 0;
    } else if (d === "l") {
      const a = t - n;
      this.baseStartX = a, this.baseEndX = a, this.left = t - a + "px", this.width = s + a + "px", this.baseStartY = i * x, this.baseEndY = this.baseStartY + i * f, this.pointX = 0, this.pointY = o - e, h = `L${this.baseStartX} ${i} L${s + this.baseStartX} ${i} L${s + this.baseStartX} 0 L${this.baseStartX} 0 L${this.baseStartX} ${this.baseStartY}`, this.textWidth = s, this.textHeight = i, this.textX = a, this.textY = 0;
    }
    this.textElement && (this.textElement.style.left = this.textX + "px", this.textElement.style.top = this.textY + "px", this.textElement.style.width = this.textWidth + "px", this.textElement.style.height = this.textHeight + "px");
    const E = `M${this.baseStartX} ${this.baseStartY} L${this.pointX} ${this.pointY} L${this.baseEndX} ${this.baseEndY} ${h}`;
    this.speechTriangle.setAttribute("d", E);
  }
  updateCloseSize(t) {
    const e = t * this.closeButtonScaling;
    this.closeElement.style.width = e + "px", this.closeElement.style.height = e + "px", this.closeButtonSize = e;
  }
  setupHoverAppearance() {
    const { backgroundOpacity: t, backgroundColor: e } = this.data.appearance;
    this.speechTriangle.addEventListener("mouseover", () => {
      this.closeElement.currentAnnotation = this, this.closeElement.lastAnnotation = this;
      const s = this.textX + this.textWidth + this.closeButtonSize / this.closeButtonOffset, i = this.textY + this.closeButtonSize / this.closeButtonOffset, n = this.element.getBoundingClientRect();
      this.closeElement.style.left = n.left + s + "px", this.closeElement.style.top = n.top + i + "px", this.closeElement.style.display = "block", this.speechTriangle.setAttribute("fill", c(t, e, !0));
    }), this.speechTriangle.addEventListener("mouseout", (s) => {
      this.closeElement.currentAnnotation = null, setTimeout(() => {
        !this.closeElement.hovered && this.closeElement.currentAnnotation === null && (this.closeElement.style.display = "none", this.speechTriangle.setAttribute("fill", c(t, e, !1)));
      }, 100);
    }), this.data.action.type === "url" && (this.element.style.cursor = "pointer");
  }
  setPadding(t, e) {
    const s = t * this.paddingMultiplier + "px", i = e * this.paddingMultiplier + "px";
    this.textElement && (this.textElement.style.padding = `${i} ${s} ${i} ${s}`);
  }
}
class H {
  constructor(t, e, s, i = 200) {
    if (!t)
      throw new Error("Annotation objects must be provided");
    if (!e)
      throw new Error("An element to contain the annotations must be provided");
    s && s.getVideoTime && s.seekTo ? this.playerOptions = s : console.info("AnnotationRenderer is running without a player. The update method will need to be called manually."), this.annotations = [], this.container = e, this.annotationsContainer = document.createElement("div"), this.annotationsContainer.classList.add("__cxt-ar-annotations-container__"), this.annotationsContainer.setAttribute("data-layer", "4"), this.annotationsContainer.addEventListener("click", (n) => {
      this.annotationClickHandler(n);
    }), this.closeElement = this.createCloseElement(), this.closeElement.style.cursor = "pointer", this.closeElement.addEventListener("click", () => {
      const n = this.closeElement.lastAnnotation;
      n.element.setAttribute("data-ar-closed", ""), n.element.setAttribute("hidden", ""), this.closeElement.style.display = "none", this.closeElement.style.cursor = "default";
    }), this.closeElement.addEventListener("mouseenter", () => {
      this.closeElement.hovered = !0;
    }), this.closeElement.addEventListener("mouseleave", () => {
      const n = this.closeElement.lastAnnotation;
      if (this.closeElement.style.display = "none", n && n.speechTriangle) {
        const { backgroundOpacity: o, backgroundColor: l } = n.data.appearance;
        n.speechTriangle.style.cursor = "default", n.speechTriangle.setAttribute("fill", c(o, l, !1));
      }
      this.closeElement.hovered = !1;
    }), document.body.append(this.closeElement), this.container.prepend(this.annotationsContainer), this.createAnnotationElements(t), this.updateAllAnnotationSizes(), window.addEventListener("DOMContentLoaded", (n) => {
      this.updateAllAnnotationSizes();
    }), this.updateInterval = i, this.updateIntervalId = null;
  }
  /**
   * Change the annotations that are rendered.
   * @param annotations List of Annotation objects the elements will be based on
   */
  changeAnnotationData(t) {
    this.stop(), this.removeAnnotationElements(), this.createAnnotationElements(t), this.updateAllAnnotationSizes(), this.start();
  }
  /**
   * Turn the annotation data into elements to be rendered.
   * @param annotationsData List of Annotation objects the elements will be based on
   */
  createAnnotationElements(t) {
    const e = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
    for (const i of t) {
      let n;
      i.style === "speech" ? n = new u(i, this.closeElement) : i.type === "highlight" ? (n = new z(i, this.closeElement), e[i.id] = n) : i.style === "highlightText" ? s.set(i.highlightId, i) : n = new b(i, this.closeElement), n && (this.annotations.push(n), this.annotationsContainer.append(n.element));
    }
    for (const i in e) {
      const n = s[i];
      if (n) {
        const o = e.get(i), l = new X(n, this.closeElement, o);
        this.annotations.push(l), this.annotationsContainer.append(l.element);
      }
    }
    console.log(this.annotations);
  }
  createCloseElement() {
    const t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    t.setAttribute("viewBox", "0 0 100 100"), t.classList.add("__cxt-ar-annotation-close__");
    const e = document.createElementNS(t.namespaceURI, "path");
    e.setAttribute("d", "M25 25 L 75 75 M 75 25 L 25 75"), e.setAttribute("stroke", "#bbb"), e.setAttribute("stroke-width", "10"), e.setAttribute("x", "5"), e.setAttribute("y", "5");
    const s = document.createElementNS(t.namespaceURI, "circle");
    return s.setAttribute("cx", "50"), s.setAttribute("cy", "50"), s.setAttribute("r", "50"), t.append(s, e), t;
  }
  /**
   * Removes every annotation from the list of annotation elements to be rendered.
   */
  removeAnnotationElements() {
    for (const t of this.annotations)
      t.element.remove();
    this.annotations = [];
  }
  /**
   * Goes through each annotation, displaying them while videoTime is between its start and end time.
   * @param videoTime
   */
  update(t) {
    for (const e of this.annotations) {
      if (e.closed || e.style === "highlightText")
        continue;
      const s = e.data.timeStart, i = e.data.timeEnd;
      e.hidden && t >= s && t < i ? e.show() : !e.hidden && (t < s || t > i) && e.hide();
    }
  }
  /**
   * Starts showing annotations.
   */
  start() {
    if (!this.playerOptions)
      throw new Error("playerOptions must be provided to use the start method");
    const t = this.playerOptions.getVideoTime();
    this.updateIntervalId || (this.update(t), this.updateIntervalId = setInterval(() => {
      const e = this.playerOptions.getVideoTime();
      this.update(e), window.dispatchEvent(new CustomEvent("__ar_renderer_start"));
    }, this.updateInterval));
  }
  /**
   * Stops the display of annotations.
   */
  stop() {
    if (!this.playerOptions)
      throw new Error("playerOptions must be provided to use the stop method");
    const t = this.playerOptions.getVideoTime();
    this.updateIntervalId && (this.update(t), clearInterval(this.updateIntervalId), this.updateIntervalId = null, window.dispatchEvent(new CustomEvent("__ar_renderer_stop")));
  }
  /**
   * Updates the size of each annotation.
   * This is useful when the video size changes and the annotation need to be resizes accordingly.
   * @param annotations The annotation elements
   * @param videoWidth The width of the video
   * @param videoHeight The height of the video
   */
  updateAnnotationDimensions(t, e, s) {
    const i = this.container.getBoundingClientRect().width, n = this.container.getBoundingClientRect().height, o = i / e, l = n / s;
    let m = i, r = n;
    (o % 1 !== 0 || l % 1 !== 0) && (o > l ? (m = n / s * e, r = n) : l > o && (m = i, r = i / e * s));
    const g = (i - m) / 2, x = (n - r) / 2, f = g / i * 100, d = x / n * 100, h = m / i, E = r / n;
    for (const a of t) {
      let v = f + a.data.x * h, A = d + a.data.y * E, $ = a.data.width * h, L = a.data.height * E;
      a.setDimensions(`${v}%`, `${A}%`, `${$}%`, `${L}%`);
      let k = m * 8e-3, _ = r * 8e-3;
      if (a.setPadding(k, _), a instanceof u) {
        const T = this.percentToPixels(i, v), w = this.percentToPixels(n, A), B = this.percentToPixels(i, $), O = this.percentToPixels(n, L);
        let y = f + a.data.sx * h, S = d + a.data.sy * E;
        y = this.percentToPixels(i, y), S = this.percentToPixels(n, S), a.updateSpeechBubble(T, w, B, O, y, S, null);
      }
      a.updateTextSize(r), a.updateCloseSize(r);
    }
  }
  updateAllAnnotationSizes() {
    if (this.playerOptions && this.playerOptions.getOriginalVideoWidth && this.playerOptions.getOriginalVideoHeight) {
      const t = this.playerOptions.getOriginalVideoWidth(), e = this.playerOptions.getOriginalVideoHeight();
      this.updateAnnotationDimensions(this.annotations, t, e);
    } else {
      const t = this.container.getBoundingClientRect().width, e = this.container.getBoundingClientRect().height;
      this.updateAnnotationDimensions(this.annotations, t, e);
    }
  }
  /**
   * Hides every annotation, even if it should be displayed based on the current video time.
   */
  hideAll() {
    for (const t of this.annotations)
      t.hide();
  }
  annotationClickHandler(t) {
    let e = t.target;
    if (!e.matches(".__cxt-ar-annotation__") && !e.closest(".__cxt-ar-annotation-close__") && (e = e.closest(".__cxt-ar-annotation__"), !e))
      return null;
    let s = e.__annotationData;
    if (!(!e || !s)) {
      if (s.action.type === "time") {
        const i = s.action.seconds;
        if (this.playerOptions) {
          this.playerOptions.seekTo(i);
          const n = this.playerOptions.getVideoTime();
          this.update(n);
        }
        window.dispatchEvent(new CustomEvent("__ar_seek_to", { detail: { seconds: i } }));
      } else if (s.action.type === "url") {
        const i = {
          url: s.action.url,
          target: s.action.target || "current"
        }, n = this.extractTimeHash(new URL(i.url));
        n && n.hasOwnProperty("seconds") && (i.seconds = n.seconds), window.dispatchEvent(new CustomEvent("__ar_annotation_click", { detail: i }));
      }
    }
  }
  /**
   * Specify how often to check if annotations should be hidden or displayed.
   * @param ms
   */
  setUpdateInterval(t) {
    this.updateInterval = t, this.stop(), this.start();
  }
  extractTimeHash(t) {
    if (!t)
      throw new Error("A URL must be provided");
    const e = t.hash;
    if (e && e.startsWith("#t=")) {
      const s = t.hash.split("#t=")[1];
      return { seconds: this.timeStringToSeconds(s) };
    } else
      return !1;
  }
  timeStringToSeconds(t) {
    let e = 0;
    const s = t.split("h"), i = (s[1] || t).split("m"), n = (i[1] || t).split("s");
    return s[0] && s.length === 2 && (e += parseInt(s[0], 10) * 60 * 60), i[0] && i.length === 2 && (e += parseInt(i[0], 10) * 60), n[0] && n.length === 2 && (e += parseInt(n[0], 10)), e;
  }
  percentToPixels(t, e) {
    return t * e / 100;
  }
}
window.AnnotationRenderer = H;
export {
  H as default
};
