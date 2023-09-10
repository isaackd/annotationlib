(function(){"use strict";try{if(typeof document<"u"){var e=document.createElement("style");e.appendChild(document.createTextNode(".__cxt-ar-annotations-container__{--annotation-close-size: 20px;position:absolute;width:100%;height:100%;top:0;left:0;pointer-events:none;overflow:hidden}.__cxt-ar-annotation__{position:absolute;box-sizing:border-box;font-family:Arial,sans-serif;color:#fff;z-index:20}.__cxt-ar-annotation__{pointer-events:auto}.__cxt-ar-annotation__ span{position:absolute;left:0;top:0;overflow:hidden;word-wrap:break-word;white-space:pre-wrap;pointer-events:none;box-sizing:border-box;padding:2%;user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}.__cxt-ar-annotation-close__{display:none;position:absolute;cursor:pointer;z-index:9999}.__cxt-ar-annotation__[hidden]{display:none!important}.__cxt-ar-annotation__[data-ar-type=highlight]{border:1px solid rgba(255,255,255,.1);background-color:transparent}.__cxt-ar-annotation__[data-ar-type=highlight]:hover{border:1px solid rgba(255,255,255,.5);background-color:transparent}.__cxt-ar-annotation__ svg{pointer-events:all}.__cxt-ar-annotation__[data-ar-style=title] span{font-weight:700;position:relative;display:-webkit-flexbox;display:-ms-flexbox;display:-webkit-flex;display:flex;-webkit-flex-align:center;-ms-flex-align:center;-webkit-align-items:center;align-items:center;justify-content:center}")),document.head.appendChild(e)}}catch(t){console.error("vite-plugin-css-injected-by-js",t)}})();
class NoteAnnotation {
  static get defaultAppearanceAttributes() {
    return {
      backgroundColor: 16777215,
      backgroundOpacity: 0.8,
      foregroundColor: 0,
      textSize: 3.15
    };
  }
  constructor(annotationData, closeElement) {
    if (!annotationData)
      throw new Error("Annotation data must be provided");
    this.data = annotationData, this.closeElement = closeElement, this.element = document.createElement("div"), this.element.classList.add("__cxt-ar-annotation__"), this.element.__annotationData = this.data, this.data.text && (this.textElement = document.createElement("span"), this.textElement.textContent = this.data.text, this.element.append(this.textElement)), this.setupAppearance(), this.data.style !== "speech" && this.setupHoverAppearance(), this.element.setAttribute("data-ar-type", this.data.type), this.data.style && this.element.setAttribute("data-ar-style", this.data.style), this.element.setAttribute("hidden", ""), this.textScaling = 100, this.paddingMultiplier = 1, this.closeButtonScaling = 0.0423, this.closeButtonOffset = -1.8;
  }
  setupAppearance() {
    let appearance = NoteAnnotation.defaultAppearanceAttributes;
    isNaN(this.data.appearance.textSize) || (appearance.textSize = this.data.appearance.textSize), isNaN(this.data.appearance.foregroundColor) || (appearance.foregroundColor = this.data.appearance.foregroundColor), isNaN(this.data.appearance.backgroundColor) || (appearance.backgroundColor = this.data.appearance.backgroundColor), isNaN(this.data.appearance.backgroundOpacity) || (appearance.backgroundOpacity = this.data.appearance.backgroundOpacity), this.data.appearance.backgroundColor = appearance.backgroundColor, this.data.appearance.backgroundOpacity = appearance.backgroundOpacity, this.data.appearance.foregroundColor = appearance.foregroundColor, this.data.appearance.textSize = appearance.textSize, this.element.style.color = "#" + decimalToHex(appearance.foregroundColor);
  }
  setupHoverAppearance() {
    const { backgroundOpacity, backgroundColor } = this.data.appearance, finalBackgroundColor = getFinalAnnotationColor(backgroundOpacity, backgroundColor);
    this.element.style.backgroundColor = finalBackgroundColor, this.element.addEventListener("mouseenter", () => {
      this.element.style.backgroundColor = getFinalAnnotationColor(backgroundOpacity, backgroundColor, !0), this.closeElement.currentAnnotation = this, this.closeElement.lastAnnotation = this, this.closeElement.style.display = "block";
      const halfSize = this.closeButtonSize / 2, rect = this.element.getBoundingClientRect();
      this.closeElement.style.left = rect.right - halfSize + "px", this.closeElement.style.top = rect.top - halfSize + "px";
    }), this.element.addEventListener("mouseleave", () => {
      this.element.style.backgroundColor = getFinalAnnotationColor(backgroundOpacity, backgroundColor, !1), this.closeElement.currentAnnotation = null, setTimeout(() => {
        !this.closeElement.hovered && this.closeElement.currentAnnotation === null && (this.closeElement.style.display = "none");
      }, 100);
    }), this.data.action.type === "url" && (this.element.style.cursor = "pointer");
  }
  createCloseElement(strokeWidth = 10) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 100 100"), svg.classList.add("__cxt-ar-annotation-close__");
    const path = document.createElementNS(svg.namespaceURI, "path");
    path.setAttribute("d", "M25 25 L 75 75 M 75 25 L 25 75"), path.setAttribute("stroke", "#bbb"), path.setAttribute("stroke-width", strokeWidth.toString()), path.setAttribute("x", "5"), path.setAttribute("y", "5");
    const circle = document.createElementNS(svg.namespaceURI, "circle");
    return circle.setAttribute("cx", "50"), circle.setAttribute("cy", "50"), circle.setAttribute("r", "50"), svg.append(circle, path), svg;
  }
  show() {
    this.element.removeAttribute("hidden");
  }
  hide() {
    this.element.setAttribute("hidden", "");
  }
  updateTextSize(containerHeight) {
    if (this.data.appearance.textSize) {
      const newTextSize = this.data.appearance.textSize / this.textScaling * containerHeight;
      this.fontSize = `${newTextSize}px`;
    }
  }
  updateCloseSize(containerHeight) {
    const newSize = containerHeight * this.closeButtonScaling;
    this.closeElement.style.width = newSize + "px", this.closeElement.style.height = newSize + "px", this.closeElement.style.right = newSize / this.closeButtonOffset + "px", this.closeElement.style.top = newSize / this.closeButtonOffset + "px", this.closeButtonSize = newSize;
  }
  setDimensions(x, y, width, height) {
    this.left = x, this.top = y, this.width = width, this.height = height;
  }
  setPadding(h, v) {
    h = h * this.paddingMultiplier + "px", v = v * this.paddingMultiplier + "px", this.element.style.padding = `${v} ${h} ${v} ${h}`;
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
  set left(val) {
    this.element.style.left = val;
  }
  set top(val) {
    this.element.style.top = val;
  }
  set width(val) {
    this.element.style.width = val;
  }
  set height(val) {
    this.element.style.height = val;
  }
  set fontSize(val) {
    this.element.style.fontSize = val;
  }
}
function decimalToHex(dec) {
  let hex = dec.toString(16);
  return hex = "000000".substr(0, 6 - hex.length) + hex, hex;
}
function getFinalAnnotationColor(bgOpacity, bgColor, hover = !1, hoverOpacity = 230) {
  if (!isNaN(bgOpacity) && !isNaN(bgColor)) {
    const alphaHex = hover ? hoverOpacity.toString(16) : Math.floor(bgOpacity * 255).toString(16);
    return `#${decimalToHex(bgColor)}${alphaHex}`;
  }
  return "#FFFFFFFF";
}
class HighlightAnnotation extends NoteAnnotation {
  constructor(annotationData, closeElement) {
    super(annotationData, closeElement);
    const { backgroundOpacity } = this.data.appearance;
    this.element.style.backgroundColor = "", this.element.style.border = `2.5px solid ${getFinalAnnotationColor(backgroundOpacity, 8748933, !1)}`;
  }
  setupHoverAppearance() {
    const { backgroundOpacity, backgroundColor } = this.data.appearance, actionType = this.data.action.type;
    this.element.addEventListener("mouseenter", () => {
      this.closeElement.currentAnnotation = this, this.closeElement.lastAnnotation = this, this.element.style.border = `2.5px solid ${getFinalAnnotationColor(backgroundOpacity, backgroundColor, !0)}`, this.closeElement.style.display = "block";
      const halfSize = this.closeButtonSize / 2, rect = this.element.getBoundingClientRect();
      this.closeElement.style.left = rect.right - halfSize + "px", this.closeElement.style.top = rect.top - halfSize + "px";
    }), this.element.addEventListener("mouseleave", () => {
      this.element.style.border = `2.5px solid ${getFinalAnnotationColor(backgroundOpacity, 8748933, !1)}`, this.closeElement.currentAnnotation = null, setTimeout(() => {
        !this.closeElement.hovered && this.closeElement.currentAnnotation === null && (this.closeElement.style.display = "none");
      }, 100);
    }), actionType === "url" && (this.element.style.cursor = "pointer");
  }
}
class HighlightTextAnnotation extends NoteAnnotation {
  constructor(annotationData, closeElement, parentAnnotation) {
    annotationData.x += parentAnnotation.x, annotationData.y += parentAnnotation.y, super(annotationData, closeElement), this.element.style.backgroundColor = "", this.element.style.border = "", this.element.style.pointerEvents = "none", parentAnnotation.element.addEventListener("mouseenter", (e) => {
      this.show();
    }), parentAnnotation.element.addEventListener("mouseleave", (e) => {
      this.hide();
    }), this.closeElement.style.display = "none", this.closeElement.style.cursor = "default";
  }
  setupHoverAppearance() {
  }
}
class SpeechAnnotation extends NoteAnnotation {
  constructor(annotationData, closeElement) {
    super(annotationData, closeElement), this.createSpeechBubble(), this.setupHoverAppearance(), this.textX = 0, this.textY = 0, this.textWidth = 0, this.textHeight = 0, this.baseStartX = 0, this.baseStartY = 0, this.baseEndX = 0, this.baseEndY = 0, this.pointX = 0, this.pointY = 0, this.directionPadding = 20, this.paddingMultiplier = 2;
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
  getPointDirection(x, y, width, height, pointX, pointY, directionPadding = 20) {
    if (pointX > x + width - width / 2 && pointY > y + height)
      return "br";
    if (pointX < x + width - width / 2 && pointY > y + height)
      return "bl";
    if (pointX > x + width - width / 2 && pointY < y - directionPadding)
      return "tr";
    if (pointX < x + width - width / 2 && pointY < y)
      return "tl";
    if (pointX > x + width && pointY > y - directionPadding && pointY < y + height - directionPadding)
      return "r";
    if (pointX < x && pointY > y && pointY < y + height)
      return "l";
  }
  createSpeechBubble(color = "white") {
    this.speechSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg"), this.speechSvg.classList.add("__cxt-ar-annotation-speech-bubble__"), this.speechSvg.style.position = "absolute", this.speechSvg.setAttribute("width", "100%"), this.speechSvg.setAttribute("height", "100%"), this.speechSvg.style.left = "0", this.speechSvg.style.left = "0", this.speechSvg.style.display = "block", this.speechSvg.style.overflow = "visible", this.speechTriangle = document.createElementNS("http://www.w3.org/2000/svg", "path"), this.speechTriangle.setAttribute("fill", color), this.speechSvg.append(this.speechTriangle);
    const { backgroundOpacity, backgroundColor } = this.data.appearance;
    this.speechTriangle.setAttribute("fill", getFinalAnnotationColor(backgroundOpacity, backgroundColor, !1)), this.element.prepend(this.speechSvg);
  }
  updateSpeechBubble(x, y, width, height, pointX, pointY, color = "white", directionPadding = 20) {
    const hBaseStartMultiplier = SpeechAnnotation.horizontalBaseStartMultiplier, hBaseEndMultiplier = SpeechAnnotation.horizontalBaseEndMultiplier, vBaseStartMultiplier = SpeechAnnotation.verticalBaseStartMultiplier, vBaseEndMultiplier = SpeechAnnotation.verticalBaseEndMultiplier, pointDirection = this.getPointDirection(x, y, width, height, pointX, pointY, this.directionPadding);
    let commentRectPath = "";
    if (pointDirection === "br")
      this.baseStartX = width - width * hBaseStartMultiplier * 2, this.baseEndX = this.baseStartX + width * hBaseEndMultiplier, this.baseStartY = height, this.baseEndY = height, this.pointX = pointX - x, this.pointY = pointY - y, this.height = pointY - y + "px", commentRectPath = `L${width} ${height} L${width} 0 L0 0 L0 ${this.baseStartY} L${this.baseStartX} ${this.baseStartY}`, this.textWidth = width, this.textHeight = height, this.textX = 0, this.textY = 0;
    else if (pointDirection === "bl")
      this.baseStartX = width * hBaseStartMultiplier, this.baseEndX = this.baseStartX + width * hBaseEndMultiplier, this.baseStartY = height, this.baseEndY = height, this.pointX = pointX - x, this.pointY = pointY - y, this.height = `${pointY - y}px`, commentRectPath = `L${width} ${height} L${width} 0 L0 0 L0 ${this.baseStartY} L${this.baseStartX} ${this.baseStartY}`, this.textWidth = width, this.textHeight = height, this.textX = 0, this.textY = 0;
    else if (pointDirection === "tr") {
      this.baseStartX = width - width * hBaseStartMultiplier * 2, this.baseEndX = this.baseStartX + width * hBaseEndMultiplier;
      const yOffset = y - pointY;
      this.baseStartY = yOffset, this.baseEndY = yOffset, this.top = y - yOffset + "px", this.height = height + yOffset + "px", this.pointX = pointX - x, this.pointY = 0, commentRectPath = `L${width} ${yOffset} L${width} ${height + yOffset} L0 ${height + yOffset} L0 ${yOffset} L${this.baseStartX} ${this.baseStartY}`, this.textWidth = width, this.textHeight = height, this.textX = 0, this.textY = yOffset;
    } else if (pointDirection === "tl") {
      this.baseStartX = width * hBaseStartMultiplier, this.baseEndX = this.baseStartX + width * hBaseEndMultiplier;
      const yOffset = y - pointY;
      this.baseStartY = yOffset, this.baseEndY = yOffset, this.top = y - yOffset + "px", this.height = height + yOffset + "px", this.pointX = pointX - x, this.pointY = 0, commentRectPath = `L${width} ${yOffset} L${width} ${height + yOffset} L0 ${height + yOffset} L0 ${yOffset} L${this.baseStartX} ${this.baseStartY}`, this.textWidth = width, this.textHeight = height, this.textX = 0, this.textY = yOffset;
    } else if (pointDirection === "r") {
      const xOffset = pointX - (x + width);
      this.baseStartX = width, this.baseEndX = width, this.width = width + xOffset + "px", this.baseStartY = height * vBaseStartMultiplier, this.baseEndY = this.baseStartY + height * vBaseEndMultiplier, this.pointX = width + xOffset, this.pointY = pointY - y, commentRectPath = `L${this.baseStartX} ${height} L0 ${height} L0 0 L${this.baseStartX} 0 L${this.baseStartX} ${this.baseStartY}`, this.textWidth = width, this.textHeight = height, this.textX = 0, this.textY = 0;
    } else if (pointDirection === "l") {
      const xOffset = x - pointX;
      this.baseStartX = xOffset, this.baseEndX = xOffset, this.left = x - xOffset + "px", this.width = width + xOffset + "px", this.baseStartY = height * vBaseStartMultiplier, this.baseEndY = this.baseStartY + height * vBaseEndMultiplier, this.pointX = 0, this.pointY = pointY - y, commentRectPath = `L${this.baseStartX} ${height} L${width + this.baseStartX} ${height} L${width + this.baseStartX} 0 L${this.baseStartX} 0 L${this.baseStartX} ${this.baseStartY}`, this.textWidth = width, this.textHeight = height, this.textX = xOffset, this.textY = 0;
    }
    this.textElement && (this.textElement.style.left = this.textX + "px", this.textElement.style.top = this.textY + "px", this.textElement.style.width = this.textWidth + "px", this.textElement.style.height = this.textHeight + "px");
    const pathData = `M${this.baseStartX} ${this.baseStartY} L${this.pointX} ${this.pointY} L${this.baseEndX} ${this.baseEndY} ${commentRectPath}`;
    this.speechTriangle.setAttribute("d", pathData);
  }
  updateCloseSize(containerHeight) {
    const newSize = containerHeight * this.closeButtonScaling;
    this.closeElement.style.width = newSize + "px", this.closeElement.style.height = newSize + "px", this.closeButtonSize = newSize;
  }
  setupHoverAppearance() {
    const { backgroundOpacity, backgroundColor } = this.data.appearance;
    this.speechTriangle.addEventListener("mouseover", () => {
      this.closeElement.currentAnnotation = this, this.closeElement.lastAnnotation = this;
      const leftOffset = this.textX + this.textWidth + this.closeButtonSize / this.closeButtonOffset, topOffset = this.textY + this.closeButtonSize / this.closeButtonOffset, rect = this.element.getBoundingClientRect();
      this.closeElement.style.left = rect.left + leftOffset + "px", this.closeElement.style.top = rect.top + topOffset + "px", this.closeElement.style.display = "block", this.speechTriangle.setAttribute("fill", getFinalAnnotationColor(backgroundOpacity, backgroundColor, !0));
    }), this.speechTriangle.addEventListener("mouseout", (e) => {
      this.closeElement.currentAnnotation = null, setTimeout(() => {
        !this.closeElement.hovered && this.closeElement.currentAnnotation === null && (this.closeElement.style.display = "none", this.speechTriangle.setAttribute("fill", getFinalAnnotationColor(backgroundOpacity, backgroundColor, !1)));
      }, 100);
    }), this.data.action.type === "url" && (this.element.style.cursor = "pointer");
  }
  setPadding(h, v) {
    const horizontal = h * this.paddingMultiplier + "px", vertical = v * this.paddingMultiplier + "px";
    this.textElement && (this.textElement.style.padding = `${vertical} ${horizontal} ${vertical} ${horizontal}`);
  }
}
class AnnotationRenderer {
  constructor(annotationsData, container, playerOptions, updateInterval = 200) {
    if (!annotationsData)
      throw new Error("Annotation objects must be provided");
    if (!container)
      throw new Error("An element to contain the annotations must be provided");
    playerOptions && playerOptions.getVideoTime && playerOptions.seekTo ? this.playerOptions = playerOptions : console.info("AnnotationRenderer is running without a player. The update method will need to be called manually."), this.annotations = [], this.container = container, this.annotationsContainer = document.createElement("div"), this.annotationsContainer.classList.add("__cxt-ar-annotations-container__"), this.annotationsContainer.setAttribute("data-layer", "4"), this.annotationsContainer.addEventListener("click", (e) => {
      this.annotationClickHandler(e);
    }), this.closeElement = this.createCloseElement(), this.closeElement.style.cursor = "pointer", this.closeElement.addEventListener("click", () => {
      const lastAnnotation = this.closeElement.lastAnnotation;
      lastAnnotation.element.setAttribute("data-ar-closed", ""), lastAnnotation.element.setAttribute("hidden", ""), this.closeElement.style.display = "none", this.closeElement.style.cursor = "default";
    }), this.closeElement.addEventListener("mouseenter", () => {
      this.closeElement.hovered = !0;
    }), this.closeElement.addEventListener("mouseleave", () => {
      const lastAnnotation = this.closeElement.lastAnnotation;
      if (this.closeElement.style.display = "none", lastAnnotation && lastAnnotation.speechTriangle) {
        const { backgroundOpacity, backgroundColor } = lastAnnotation.data.appearance;
        lastAnnotation.speechTriangle.style.cursor = "default", lastAnnotation.speechTriangle.setAttribute("fill", getFinalAnnotationColor(backgroundOpacity, backgroundColor, !1));
      }
      this.closeElement.hovered = !1;
    }), document.body.append(this.closeElement), this.container.prepend(this.annotationsContainer), this.createAnnotationElements(annotationsData), this.updateAllAnnotationSizes(), window.addEventListener("DOMContentLoaded", (e) => {
      this.updateAllAnnotationSizes();
    }), this.updateInterval = updateInterval, this.updateIntervalId = null;
  }
  /**
   * Change the annotations that are rendered.
   * @param annotations List of Annotation objects the elements will be based on
   */
  changeAnnotationData(annotationsData) {
    this.stop(), this.removeAnnotationElements(), this.createAnnotationElements(annotationsData), this.updateAllAnnotationSizes(), this.start();
  }
  /**
   * Turn the annotation data into elements to be rendered.
   * @param annotationsData List of Annotation objects the elements will be based on
   */
  createAnnotationElements(annotationsData) {
    const highlightAnnotations = /* @__PURE__ */ new Map(), highlightTextAnnotations = /* @__PURE__ */ new Map();
    for (const data of annotationsData) {
      let annotation;
      data.style === "speech" ? annotation = new SpeechAnnotation(data, this.closeElement) : data.type === "highlight" ? (annotation = new HighlightAnnotation(data, this.closeElement), highlightAnnotations[data.id] = annotation) : data.style === "highlightText" ? highlightTextAnnotations.set(data.highlightId, data) : annotation = new NoteAnnotation(data, this.closeElement), annotation && (this.annotations.push(annotation), this.annotationsContainer.append(annotation.element));
    }
    for (const highlightId in highlightAnnotations) {
      const highlightTextData = highlightTextAnnotations[highlightId];
      if (highlightTextData) {
        const parent = highlightAnnotations.get(highlightId), annotation = new HighlightTextAnnotation(highlightTextData, this.closeElement, parent);
        this.annotations.push(annotation), this.annotationsContainer.append(annotation.element);
      }
    }
    console.log(this.annotations);
  }
  createCloseElement() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 100 100"), svg.classList.add("__cxt-ar-annotation-close__");
    const path = document.createElementNS(svg.namespaceURI, "path");
    path.setAttribute("d", "M25 25 L 75 75 M 75 25 L 25 75"), path.setAttribute("stroke", "#bbb"), path.setAttribute("stroke-width", "10"), path.setAttribute("x", "5"), path.setAttribute("y", "5");
    const circle = document.createElementNS(svg.namespaceURI, "circle");
    return circle.setAttribute("cx", "50"), circle.setAttribute("cy", "50"), circle.setAttribute("r", "50"), svg.append(circle, path), svg;
  }
  /**
   * Removes every annotation from the list of annotation elements to be rendered.
   */
  removeAnnotationElements() {
    for (const annotation of this.annotations)
      annotation.element.remove();
    this.annotations = [];
  }
  /**
   * Goes through each annotation, displaying them while videoTime is between its start and end time.
   * @param videoTime
   */
  update(videoTime) {
    for (const annotation of this.annotations) {
      if (annotation.closed || annotation.style === "highlightText")
        continue;
      const start = annotation.data.timeStart, end = annotation.data.timeEnd;
      annotation.hidden && videoTime >= start && videoTime < end ? annotation.show() : !annotation.hidden && (videoTime < start || videoTime > end) && annotation.hide();
    }
  }
  /**
   * Starts showing annotations.
   */
  start() {
    if (!this.playerOptions)
      throw new Error("playerOptions must be provided to use the start method");
    const videoTime = this.playerOptions.getVideoTime();
    this.updateIntervalId || (this.update(videoTime), this.updateIntervalId = setInterval(() => {
      const videoTime2 = this.playerOptions.getVideoTime();
      this.update(videoTime2), window.dispatchEvent(new CustomEvent("__ar_renderer_start"));
    }, this.updateInterval));
  }
  /**
   * Stops the display of annotations.
   */
  stop() {
    if (!this.playerOptions)
      throw new Error("playerOptions must be provided to use the stop method");
    const videoTime = this.playerOptions.getVideoTime();
    this.updateIntervalId && (this.update(videoTime), clearInterval(this.updateIntervalId), this.updateIntervalId = null, window.dispatchEvent(new CustomEvent("__ar_renderer_stop")));
  }
  /**
   * Updates the size of each annotation.
   * This is useful when the video size changes and the annotation need to be resizes accordingly.
   * @param annotations The annotation elements
   * @param videoWidth The width of the video
   * @param videoHeight The height of the video
   */
  updateAnnotationDimensions(annotations, videoWidth, videoHeight) {
    const playerWidth = this.container.getBoundingClientRect().width, playerHeight = this.container.getBoundingClientRect().height, widthDivider = playerWidth / videoWidth, heightDivider = playerHeight / videoHeight;
    let scaledVideoWidth = playerWidth, scaledVideoHeight = playerHeight;
    (widthDivider % 1 !== 0 || heightDivider % 1 !== 0) && (widthDivider > heightDivider ? (scaledVideoWidth = playerHeight / videoHeight * videoWidth, scaledVideoHeight = playerHeight) : heightDivider > widthDivider && (scaledVideoWidth = playerWidth, scaledVideoHeight = playerWidth / videoWidth * videoHeight));
    const verticalBlackBarWidth = (playerWidth - scaledVideoWidth) / 2, horizontalBlackBarHeight = (playerHeight - scaledVideoHeight) / 2, widthOffsetPercent = verticalBlackBarWidth / playerWidth * 100, heightOffsetPercent = horizontalBlackBarHeight / playerHeight * 100, widthMultiplier = scaledVideoWidth / playerWidth, heightMultiplier = scaledVideoHeight / playerHeight;
    for (const annotation of annotations) {
      let ax = widthOffsetPercent + annotation.data.x * widthMultiplier, ay = heightOffsetPercent + annotation.data.y * heightMultiplier, aw = annotation.data.width * widthMultiplier, ah = annotation.data.height * heightMultiplier;
      annotation.setDimensions(`${ax}%`, `${ay}%`, `${aw}%`, `${ah}%`);
      let horizontalPadding = scaledVideoWidth * 8e-3, verticalPadding = scaledVideoHeight * 8e-3;
      if (annotation.setPadding(horizontalPadding, verticalPadding), annotation instanceof SpeechAnnotation) {
        const asx = this.percentToPixels(playerWidth, ax), asy = this.percentToPixels(playerHeight, ay), asw = this.percentToPixels(playerWidth, aw), ash = this.percentToPixels(playerHeight, ah);
        let sx = widthOffsetPercent + annotation.data.sx * widthMultiplier, sy = heightOffsetPercent + annotation.data.sy * heightMultiplier;
        sx = this.percentToPixels(playerWidth, sx), sy = this.percentToPixels(playerHeight, sy), annotation.updateSpeechBubble(asx, asy, asw, ash, sx, sy, null);
      }
      annotation.updateTextSize(scaledVideoHeight), annotation.updateCloseSize(scaledVideoHeight);
    }
  }
  updateAllAnnotationSizes() {
    if (this.playerOptions && this.playerOptions.getOriginalVideoWidth && this.playerOptions.getOriginalVideoHeight) {
      const videoWidth = this.playerOptions.getOriginalVideoWidth(), videoHeight = this.playerOptions.getOriginalVideoHeight();
      this.updateAnnotationDimensions(this.annotations, videoWidth, videoHeight);
    } else {
      const playerWidth = this.container.getBoundingClientRect().width, playerHeight = this.container.getBoundingClientRect().height;
      this.updateAnnotationDimensions(this.annotations, playerWidth, playerHeight);
    }
  }
  /**
   * Hides every annotation, even if it should be displayed based on the current video time.
   */
  hideAll() {
    for (const annotation of this.annotations)
      annotation.hide();
  }
  annotationClickHandler(e) {
    let annotationElement = e.target;
    if (!annotationElement.matches(".__cxt-ar-annotation__") && !annotationElement.closest(".__cxt-ar-annotation-close__") && (annotationElement = annotationElement.closest(".__cxt-ar-annotation__"), !annotationElement))
      return null;
    let annotationData = annotationElement.__annotationData;
    if (!(!annotationElement || !annotationData)) {
      if (annotationData.action.type === "time") {
        const seconds = annotationData.action.seconds;
        if (this.playerOptions) {
          this.playerOptions.seekTo(seconds);
          const videoTime = this.playerOptions.getVideoTime();
          this.update(videoTime);
        }
        window.dispatchEvent(new CustomEvent("__ar_seek_to", { detail: { seconds } }));
      } else if (annotationData.action.type === "url") {
        const data = {
          url: annotationData.action.url,
          target: annotationData.action.target || "current"
        }, timeHash = this.extractTimeHash(new URL(data.url));
        timeHash && timeHash.hasOwnProperty("seconds") && (data.seconds = timeHash.seconds), window.dispatchEvent(new CustomEvent("__ar_annotation_click", { detail: data }));
      }
    }
  }
  /**
   * Specify how often to check if annotations should be hidden or displayed.
   * @param ms
   */
  setUpdateInterval(ms) {
    this.updateInterval = ms, this.stop(), this.start();
  }
  extractTimeHash(url) {
    if (!url)
      throw new Error("A URL must be provided");
    const hash = url.hash;
    if (hash && hash.startsWith("#t=")) {
      const timeString = url.hash.split("#t=")[1];
      return { seconds: this.timeStringToSeconds(timeString) };
    } else
      return !1;
  }
  timeStringToSeconds(time) {
    let seconds = 0;
    const h = time.split("h"), m = (h[1] || time).split("m"), s = (m[1] || time).split("s");
    return h[0] && h.length === 2 && (seconds += parseInt(h[0], 10) * 60 * 60), m[0] && m.length === 2 && (seconds += parseInt(m[0], 10) * 60), s[0] && s.length === 2 && (seconds += parseInt(s[0], 10)), seconds;
  }
  percentToPixels(a, b) {
    return a * b / 100;
  }
}
window.AnnotationRenderer = AnnotationRenderer;
export {
  AnnotationRenderer as default
};
