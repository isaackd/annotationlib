interface AnnotationAppearance {
	/** Controls the background opacity of the annotation (0.0 to 1.0). */
	backgroundOpacity?: number;

	/** Controls the background color of the annotation (R x G x B). */
	backgroundColor?: number;

	/** Controls the foreground color of the annotation (R x G x B). */
	foregroundColor?: number;

	/**
	 * Controls the text size of the annotation.
	 *
	 * The unit originally used by YouTube is generally unknown, but defaults to 3.15 in the renderer.
	 */
	textSize?: number;
}

type AnnotationAction = AnnotationActionLink | AnnotationActionTimestamp;

interface AnnotationActionLink {
	type: "url";

	/** The url this annotation links to. */
	url: string;

	/** Unsure what this attribute does */
	target: string;
}

interface AnnotationActionTimestamp {
	type: "time";

	/**
	 * Where to seek in the video.
	 */
	seconds: number;
}

const AnnotationTypesArr = ["text",  "highlight",  "pause",  "branding"] as const;
const AnnotationStylesArr = ["popup", "speech", "highlightText", "anchored", "branding", "label", "title"] as const;

export type AnnotationType = typeof AnnotationTypesArr[number];
export type AnnotationStyle = typeof AnnotationStylesArr[number];

export function isAnnotationType(value: string): value is AnnotationType {
	return AnnotationTypesArr.includes(value as AnnotationType);
}

export function isAnnotationStyle(value: string): value is AnnotationStyle {
	return AnnotationStylesArr.includes(value as AnnotationStyle);
}

export interface Annotation {
	/**
	 * A unique identifier for the annotation.
	 */
	id: string;

	/**
	 * The type of the annotation.
	 */
	type: AnnotationType;

	/**
	 * The x position of the annotation in percent of video width (0 to 100)
	 */
	x: number;

	/**
	 * The y positon of the annotation in percent of video width (0 to 100)
	 */
	y: number;

	/**
	 * The width of the annotation in percent of video width (0 to 100)
	 */
	width: number;

	/**
	 * The height of the annotation in percent of video height (0 to 100)
	 */
	height: number

	/**
	 * What time the annotation will appear in seconds.
	 */

	timeStart: number;

	/**
	 * What time the annotation will disappear in seconds.
	 */
	timeEnd: number;

	/**
	 * The display type of the annotation.
	 */
	style?: AnnotationStyle;

	/**
	 * The text shown inside the annotation.
	 */
	text?: string;

	/**
	 * Configure on-click behavior for the annotation.
	 */
	action?: AnnotationAction;

	/**
	 * Properties that control the appearance of the annotation.
	 */
	appearance?: AnnotationAppearance;

	/**
	 * Used to calculate the x position of the tip of a speech bubble.
	 *
	 * The unit orignally used by YouTube is generally unknown.
	 */
	sx?: number;

	/**
	 * Used to calculate the y position of the tip of a speech bubble.
	 *
	 * The unit orignally used by YouTube is generally unknown.
	 */
	sy?: number;
}

function xmlToDom(xml: string): Document {
	const parser = new DOMParser();
	const dom = parser.parseFromString(xml, "application/xml");
	return dom;
}

export function parseFromXml(xml: string): Annotation[] {
	const dom = xmlToDom(xml);
	const annotations = dom.getElementsByTagName("annotation");

	return parseAnnotationList(annotations);
}


export function parseAnnotationList(annotationElements: HTMLCollectionOf<Element>): Annotation[] {
	const annotations = [];
	for (const el of annotationElements) {
		const parsedAnnotation = parseAnnotation(el);
		if (parsedAnnotation) {
			annotations.push(parsedAnnotation);
		}
	}
	return annotations;
}

export function parseAnnotation(annotationElement: Element): Annotation | null {
	const base = annotationElement;
	const attributes = getAttributesFromBase(base);
	if (!attributes.type || attributes.type === "pause") {
		return null;
	}

	const text = getTextFromBase(base);
	const action = getActionFromBase(base);

	const backgroundShape = getBackgroundShapeFromBase(base);
	if (!backgroundShape) {
		return null;
	}

	const { timeStart, timeEnd } = backgroundShape;

	if (isNaN(timeStart) || isNaN(timeEnd) || timeStart === null || timeEnd === null) {
		return null;
	}

	const appearance = getAppearanceFromBase(base);

	// properties the renderer needs
	let annotation: Annotation = {
		id: attributes.id,
		type: attributes.type,

		x: backgroundShape.x,
		y: backgroundShape.y,
		width: backgroundShape.width,
		height: backgroundShape.height,

		timeStart,
		timeEnd
	};

	if (attributes.style) {
		annotation.style = attributes.style;
	}
	if (text) {
		annotation.text = text;
	}
	if (action) {
		annotation.action = action;
	}
	if (appearance) {
		annotation.appearance = appearance;
	}

	if (backgroundShape.hasOwnProperty("sx")) {
		annotation.sx = backgroundShape.sx;
	}
	if (backgroundShape.hasOwnProperty("sy")) {
		annotation.sy = backgroundShape.sy;
	}

	return annotation;
}

interface BackgroundShape {
	x: number;
	y: number;
	width: number;
	height: number;
	timeStart: number;
	timeEnd: number;

	sx?: number;
	sy?: number;
}

/**
 * Extracts the relevant attributes from the <movingRegion /> element of an annotation.
 *
 * @param base The `<annotation />` element
 * @returns
 */
function getBackgroundShapeFromBase(base: Element): BackgroundShape {
	const movingRegion = base.getElementsByTagName("movingRegion")[0];
	if (!movingRegion) {
		return null;
	}

	const regionType = movingRegion.getAttribute("type");

	const regions = movingRegion.getElementsByTagName(`${regionType}Region`);
	const { timeStart, timeEnd } = extractRegionTime(regions);

	const shape: BackgroundShape = {
		x: parseFloat(regions[0].getAttribute("x")),
		y: parseFloat(regions[0].getAttribute("y")),
		width: parseFloat(regions[0].getAttribute("w")),
		height: parseFloat(regions[0].getAttribute("h")),
		timeStart,
		timeEnd,
	}

	const sx = regions[0].getAttribute("sx");
	const sy = regions[0].getAttribute("sy");

	if (sx) shape.sx = parseFloat(sx);
	if (sy) shape.sy = parseFloat(sy);

	return shape;
}

/**
 * Extracts the relevant attributes from the <annotation /> element.
 *
 * @param base The `<annotation />` element
 * @returns
 */
function getAttributesFromBase(base: Element): { id: string, type: AnnotationType, style: AnnotationStyle } {
	const id = base.getAttribute("id");
	const type = base.getAttribute("type");
	const style = base.getAttribute("style");

	if (!isAnnotationType(type)) {
		throw new Error("Invalid value in attribute element: type");
	}
	if (!isAnnotationStyle(style)) {
		throw new Error("Invalid value in attribute element: style");
	}

	return { id, type, style };
}

/**
 * Extracts the text from the <TEXT /> element of an annotation.
 *
 * @param base The `<annotation />` element
 * @returns
 */
function getTextFromBase(base: Element): string | null {
	const textElement = base.getElementsByTagName("TEXT")[0];
	if (textElement) {
		return textElement.textContent;
	}
	else {
		return null;
	}
}

/**
 * Extracts the relevant attributes from the <action /> element of an annotation.
 *
 * @param base The `<annotation />` element
 * @returns
 */
function getActionFromBase(base: Element): AnnotationAction | void {
	const actionElement = base.getElementsByTagName("action")[0];
	if (!actionElement) {
		return null;
	}

	const urlElement = actionElement.getElementsByTagName("url")[0];
	if (!urlElement) {
		return null;
	}

	const actionUrlTarget = urlElement.getAttribute("target");
	const href = urlElement.getAttribute("value");

	const url = new URL(href);
	const srcVid = url.searchParams.get("src_vid");
	const toVid = url.searchParams.get("v");

	return linkOrTimestamp(url, srcVid, toVid, actionUrlTarget);
}

function linkOrTimestamp(url: URL, srcVid: string, toVid: string, actionUrlTarget: string): AnnotationAction {
	if (srcVid && toVid && srcVid === toVid) {
		let seconds = 0;
		const hash = url.hash;
		if (hash && hash.startsWith("#t=")) {
			const timeString = url.hash.split("#t=")[1];
			seconds = timeStringToSeconds(timeString);
		}
		return { type: "time", seconds };
	}
	else {
		return { type: "url", url: url.href, target: actionUrlTarget};
	}
}

/**
 * Extracts the relevant attributes from the <appearance /> element of an annotation.
 *
 * @param base The `<annotation />` element
 * @returns
 */
function getAppearanceFromBase(base: Element): AnnotationAppearance {
	const appearanceElement = base.getElementsByTagName("appearance")[0];
	if (appearanceElement) {
		const bgOpacity = appearanceElement.getAttribute("bgAlpha");
		const bgColor = appearanceElement.getAttribute("bgColor");
		const fgColor = appearanceElement.getAttribute("fgColor");
		const textSize = appearanceElement.getAttribute("textSize");
		// not yet sure what to do with effects
		// const effects = appearanceElement.getAttribute("effects");

		const styles: AnnotationAppearance = {};

		if (bgOpacity) styles.backgroundOpacity = parseFloat(bgOpacity);
		if (bgColor) styles.backgroundColor = parseInt(bgColor, 10);
		if (fgColor) styles.foregroundColor = parseInt(fgColor, 10);
		if (textSize) styles.textSize = parseFloat(textSize);

		return styles;
	}
}

/**
 * Extracts the start and end time of the annotation.
 *
 * @param regions The region elements of the annotation
 * @returns The start and end time of the annotation
 */
function extractRegionTime(regions: HTMLCollectionOf<Element>): { timeStart: number, timeEnd: number } {
	const timeStartAttr = regions[0].getAttribute("t");
	const timeStart = hmsToSeconds(timeStartAttr);

	const timeEndAttr = regions[regions.length - 1].getAttribute("t");
	const timeEnd = hmsToSeconds(timeEndAttr);

	return { timeStart, timeEnd };
}

/**
 * Converts a string in the format `##:##:##` to seconds, where `#` is a number.
 *
 * @param hms The time string
 * @returns The time in seconds that the string represents
 */
function hmsToSeconds(hms: string): number {
	let split = hms.split(":");
	let seconds = 0;
	let minutes = 1;

	while (split.length > 0) {
		seconds += minutes * parseFloat(split.pop());
		minutes *= 60;
	}
	return seconds;
}

/**
 * Converts a string in the format `#h#m#s` to seconds, where `#` is a number.
 *
 * @param time The time string
 * @returns The time in seconds that the string represents
 */
function timeStringToSeconds(time: string): number {
	let result = 0;

	const hours = time.split("h");
	const minutes = (hours[1] || time).split("m");
	const seconds = (minutes[1] || time).split("s");

	if (hours[0] && hours.length === 2) {
		result += parseInt(hours[0], 10) * 60 * 60;
	}
	if (minutes[0] && minutes.length === 2) {
		result += parseInt(minutes[0], 10) * 60;
	}
	if (seconds[0] && seconds.length === 2) {
		result += parseInt(seconds[0], 10);
	}

	return result;
}
