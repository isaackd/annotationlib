const AnnotationTypesArr = ["text", "highlight", "pause", "branding"], AnnotationStylesArr = ["popup", "speech", "highlightText", "anchored", "branding", "label", "title"];
function isAnnotationType(value) {
  return AnnotationTypesArr.includes(value);
}
function isAnnotationStyle(value) {
  return AnnotationStylesArr.includes(value);
}
function xmlToDom(xml) {
  return new DOMParser().parseFromString(xml, "application/xml");
}
function parseFromXml(xml) {
  const annotations = xmlToDom(xml).getElementsByTagName("annotation");
  return parseAnnotationList(annotations);
}
function parseAnnotationList(annotationElements) {
  const annotations = [];
  for (const el of annotationElements) {
    const parsedAnnotation = parseAnnotation(el);
    parsedAnnotation && annotations.push(parsedAnnotation);
  }
  return annotations;
}
function parseAnnotation(annotationElement) {
  const base = annotationElement, attributes = getAttributesFromBase(base);
  if (!attributes.type || attributes.type === "pause")
    return null;
  const text = getTextFromBase(base), action = getActionFromBase(base), backgroundShape = getBackgroundShapeFromBase(base);
  if (!backgroundShape)
    return null;
  const { timeStart, timeEnd } = backgroundShape;
  if (isNaN(timeStart) || isNaN(timeEnd) || timeStart === null || timeEnd === null)
    return null;
  const appearance = getAppearanceFromBase(base);
  let annotation = {
    id: attributes.id,
    type: attributes.type,
    x: backgroundShape.x,
    y: backgroundShape.y,
    width: backgroundShape.width,
    height: backgroundShape.height,
    timeStart,
    timeEnd
  };
  return attributes.style && (annotation.style = attributes.style), text && (annotation.text = text), action && (annotation.action = action), appearance && (annotation.appearance = appearance), backgroundShape.hasOwnProperty("sx") && (annotation.sx = backgroundShape.sx), backgroundShape.hasOwnProperty("sy") && (annotation.sy = backgroundShape.sy), annotation;
}
function getBackgroundShapeFromBase(base) {
  const movingRegion = base.getElementsByTagName("movingRegion")[0];
  if (!movingRegion)
    return null;
  const regionType = movingRegion.getAttribute("type"), regions = movingRegion.getElementsByTagName(`${regionType}Region`), { timeStart, timeEnd } = extractRegionTime(regions), rect = {};
  for (const attr of ["x", "y", "w", "h"]) {
    const val = regions[0].getAttribute(attr);
    if (!val)
      throw new Error(`Required attribute "${attr}" is null`);
    rect[attr] = parseFloat(val);
  }
  const shape = {
    x: rect.x,
    y: rect.y,
    width: rect.w,
    height: rect.h,
    timeStart,
    timeEnd
  }, sx = regions[0].getAttribute("sx"), sy = regions[0].getAttribute("sy");
  return sx && (shape.sx = parseFloat(sx)), sy && (shape.sy = parseFloat(sy)), shape;
}
function getAttributesFromBase(base) {
  const id = base.getAttribute("id"), type = base.getAttribute("type"), style = base.getAttribute("style");
  if (!id)
    throw new Error('Missing "id" attribute in base');
  if (!type)
    throw new Error('Missing "type" attribute in base');
  if (!isAnnotationType(type))
    throw new Error("Invalid value in attribute element: type");
  return { id, type, style };
}
function getTextFromBase(base) {
  const textElement = base.getElementsByTagName("TEXT")[0];
  return textElement ? textElement.textContent : null;
}
function getActionFromBase(base) {
  const actionElement = base.getElementsByTagName("action")[0];
  if (!actionElement)
    return null;
  const urlElement = actionElement.getElementsByTagName("url")[0];
  if (!urlElement)
    return null;
  const actionUrlTarget = urlElement.getAttribute("target"), href = urlElement.getAttribute("value"), url = new URL(href), srcVid = url.searchParams.get("src_vid"), toVid = url.searchParams.get("v");
  return linkOrTimestamp(url, srcVid, toVid, actionUrlTarget);
}
function linkOrTimestamp(url, srcVid, toVid, actionUrlTarget) {
  if (srcVid && toVid && srcVid === toVid) {
    let seconds = 0;
    const hash = url.hash;
    if (hash && hash.startsWith("#t=")) {
      const timeString = url.hash.split("#t=")[1];
      seconds = timeStringToSeconds(timeString);
    }
    return { type: "time", seconds };
  } else
    return { type: "url", url: url.href, target: actionUrlTarget };
}
function getAppearanceFromBase(base) {
  const appearanceElement = base.getElementsByTagName("appearance")[0];
  if (appearanceElement) {
    const bgOpacity = appearanceElement.getAttribute("bgAlpha"), bgColor = appearanceElement.getAttribute("bgColor"), fgColor = appearanceElement.getAttribute("fgColor"), textSize = appearanceElement.getAttribute("textSize"), styles = {};
    return bgOpacity && (styles.backgroundOpacity = parseFloat(bgOpacity)), bgColor && (styles.backgroundColor = parseInt(bgColor, 10)), fgColor && (styles.foregroundColor = parseInt(fgColor, 10)), textSize && (styles.textSize = parseFloat(textSize)), styles;
  }
}
function extractRegionTime(regions) {
  const timeStartAttr = regions[0].getAttribute("t"), timeStart = hmsToSeconds(timeStartAttr), timeEndAttr = regions[regions.length - 1].getAttribute("t"), timeEnd = hmsToSeconds(timeEndAttr);
  return { timeStart, timeEnd };
}
function hmsToSeconds(hms) {
  let split = hms.split(":"), seconds = 0, minutes = 1;
  for (; split.length > 0; )
    seconds += minutes * parseFloat(split.pop()), minutes *= 60;
  return seconds;
}
function timeStringToSeconds(time) {
  let result = 0;
  const hours = time.split("h"), minutes = (hours[1] || time).split("m"), seconds = (minutes[1] || time).split("s");
  return hours[0] && hours.length === 2 && (result += parseInt(hours[0], 10) * 60 * 60), minutes[0] && minutes.length === 2 && (result += parseInt(minutes[0], 10) * 60), seconds[0] && seconds.length === 2 && (result += parseInt(seconds[0], 10)), result;
}
export {
  isAnnotationStyle,
  isAnnotationType,
  parseAnnotation,
  parseAnnotationList,
  parseFromXml
};
