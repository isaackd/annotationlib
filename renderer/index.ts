import HighlightAnnotation from './annotations/highlight.js';
import HighlightTextAnnotation from './annotations/highlightText.js';
import { getFinalAnnotationColor, NoteAnnotation } from './annotations/note.js';
import SpeechAnnotation from './annotations/speech.js';

import type { Annotation } from "../parser";

import "./index.css";

interface PlayerOptions {
	getVideoTime: () => number;
	seekTo: (seconds: number) => void;
	getOriginalVideoWidth: () => number;
	getOriginalVideoHeight: () => number;
}

class AnnotationRenderer {

	annotations: NoteAnnotation[];
	playerOptions: PlayerOptions;

	container: HTMLElement;
	annotationsContainer: HTMLElement;
	closeElement: SVGSVGElement;

	updateInterval: number;
	updateIntervalId: number;

	constructor(annotationsData: Annotation[], container: HTMLElement, playerOptions: PlayerOptions, updateInterval: number = 200) {
		if (!annotationsData) throw new Error("Annotation objects must be provided");
		if (!container) throw new Error("An element to contain the annotations must be provided");

		if (playerOptions && playerOptions.getVideoTime && playerOptions.seekTo) {
			this.playerOptions = playerOptions;
		}
		else {
			console.info("AnnotationRenderer is running without a player. The update method will need to be called manually.");
		}

		this.annotations = [];
		this.container = container;

		this.annotationsContainer = document.createElement("div");
		this.annotationsContainer.classList.add("__cxt-ar-annotations-container__");
		this.annotationsContainer.setAttribute("data-layer", "4");
		this.annotationsContainer.addEventListener("click", e => {
			this.annotationClickHandler(e);
		});

		this.closeElement = this.createCloseElement();
		this.closeElement.style.cursor = "pointer";
		this.closeElement.addEventListener("click", () => {
			const lastAnnotation = this.closeElement.lastAnnotation;
			lastAnnotation.element.setAttribute("data-ar-closed", "");
			lastAnnotation.element.setAttribute("hidden", "");

			this.closeElement.style.display = "none";
			this.closeElement.style.cursor = "default";
		});

		this.closeElement.addEventListener("mouseenter", () => {
			this.closeElement.hovered = true;
		});

		this.closeElement.addEventListener("mouseleave", () => {
			const lastAnnotation = this.closeElement.lastAnnotation;
			this.closeElement.style.display = "none";

			if (lastAnnotation && lastAnnotation.speechTriangle) {
				const { backgroundOpacity, backgroundColor } = lastAnnotation.data.appearance;
				lastAnnotation.speechTriangle.style.cursor = "default";
				lastAnnotation.speechTriangle.setAttribute("fill", getFinalAnnotationColor(backgroundOpacity, backgroundColor, false));
			}

			this.closeElement.hovered = false;
		});

		document.body.append(this.closeElement);

		this.container.prepend(this.annotationsContainer);

		this.createAnnotationElements(annotationsData);

		// in case the dom already loaded
		this.updateAllAnnotationSizes();
		window.addEventListener("DOMContentLoaded", e => {
			this.updateAllAnnotationSizes();
		});

		this.updateInterval = updateInterval;
		this.updateIntervalId = null;
	}
	/**
	 * Change the annotations that are rendered.
	 * @param annotations List of Annotation objects the elements will be based on
	 */
	changeAnnotationData(annotationsData: Annotation[]) {
		this.stop();
		this.removeAnnotationElements();
		this.createAnnotationElements(annotationsData);
		this.updateAllAnnotationSizes();
		this.start();
	}
	/**
	 * Turn the annotation data into elements to be rendered.
	 * @param annotationsData List of Annotation objects the elements will be based on
	 */
	private createAnnotationElements(annotationsData: Annotation[]) {

		const highlightAnnotations: Map<string, Annotation> = new Map();
		const highlightTextAnnotations: Map<string, Annotation> = new Map();

		for (const data of annotationsData) {
			let annotation: NoteAnnotation;
			if (data.style === "speech") {
				annotation = new SpeechAnnotation(data, this.closeElement);
			}
			else if (data.type === "highlight") {
				annotation = new HighlightAnnotation(data, this.closeElement);
				highlightAnnotations[data.id] = annotation;
			}
			else if (data.style === "highlightText") {
				highlightTextAnnotations.set(data.highlightId, data);
			}
			else {
				annotation = new NoteAnnotation(data, this.closeElement);
			}

			if (annotation) {
				this.annotations.push(annotation);
				this.annotationsContainer.append(annotation.element);
			}
		}

		for (const highlightId in highlightAnnotations) {
			const highlightTextData = highlightTextAnnotations[highlightId];

			if (highlightTextData) {
				const parent = highlightAnnotations.get(highlightId);
				const annotation = new HighlightTextAnnotation(highlightTextData, this.closeElement, parent);

				this.annotations.push(annotation);
				this.annotationsContainer.append(annotation.element);
			}
		}

		console.log(this.annotations);

	}
	private createCloseElement(): SVGSVGElement {
		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svg.setAttribute("viewBox", "0 0 100 100")
		svg.classList.add("__cxt-ar-annotation-close__");

		const path = document.createElementNS(svg.namespaceURI, "path");
		path.setAttribute("d", "M25 25 L 75 75 M 75 25 L 25 75");
		path.setAttribute("stroke", "#bbb");
		path.setAttribute("stroke-width", "10")
		path.setAttribute("x", "5");
		path.setAttribute("y", "5");

		const circle = document.createElementNS(svg.namespaceURI, "circle");
		circle.setAttribute("cx", "50");
		circle.setAttribute("cy", "50");
		circle.setAttribute("r", "50");

		svg.append(circle, path);
		return svg;
	}
	/**
	 * Removes every annotation from the list of annotation elements to be rendered.
	 */
	removeAnnotationElements(): void {
		for (const annotation of this.annotations) {
			annotation.element.remove();
		}
		this.annotations = [];
	}
	/**
	 * Goes through each annotation, displaying them while videoTime is between its start and end time.
	 * @param videoTime
	 */
	update(videoTime: number): void {
		for (const annotation of this.annotations) {
			if (annotation.closed || annotation.style === "highlightText") {
				continue
			}

			const start = annotation.data.timeStart;
			const end = annotation.data.timeEnd;

			if (annotation.hidden && (videoTime >= start && videoTime < end)) {
				annotation.show();
			}
			else if (!annotation.hidden && (videoTime < start || videoTime > end)) {
				annotation.hide();
			}
		}
	}
	/**
	 * Starts showing annotations.
	 */
	start(): void {
		if (!this.playerOptions) throw new Error("playerOptions must be provided to use the start method");

		const videoTime = this.playerOptions.getVideoTime();
		if (!this.updateIntervalId) {
			this.update(videoTime);
			this.updateIntervalId = setInterval(() => {
				const videoTime = this.playerOptions.getVideoTime();
				this.update(videoTime);
				window.dispatchEvent(new CustomEvent("__ar_renderer_start"));
			}, this.updateInterval);
		}
	}
	/**
	 * Stops the display of annotations.
	 */
	stop(): void {
		if (!this.playerOptions) throw new Error("playerOptions must be provided to use the stop method");

		const videoTime = this.playerOptions.getVideoTime();
		if (this.updateIntervalId) {
			this.update(videoTime);
			clearInterval(this.updateIntervalId);
			this.updateIntervalId = null;
			window.dispatchEvent(new CustomEvent("__ar_renderer_stop"));
		}
	}
	/**
	 * Updates the size of each annotation.
	 * This is useful when the video size changes and the annotation need to be resizes accordingly.
	 * @param annotations The annotation elements
	 * @param videoWidth The width of the video
	 * @param videoHeight The height of the video
	 */
	updateAnnotationDimensions(annotations: NoteAnnotation[], videoWidth: number, videoHeight: number): void {
		const playerWidth = this.container.getBoundingClientRect().width;
		const playerHeight = this.container.getBoundingClientRect().height;

		const widthDivider = playerWidth / videoWidth;
		const heightDivider = playerHeight / videoHeight;

		let scaledVideoWidth = playerWidth;
		let scaledVideoHeight = playerHeight;

		if (widthDivider % 1 !== 0 || heightDivider % 1 !== 0) {
			// vertical bars
			if (widthDivider > heightDivider) {
				scaledVideoWidth = (playerHeight / videoHeight) * videoWidth;
				scaledVideoHeight = playerHeight;
			}
			// horizontal bars
			else if (heightDivider > widthDivider) {
				scaledVideoWidth = playerWidth;
				scaledVideoHeight = (playerWidth / videoWidth) * videoHeight;
			}
		}

		const verticalBlackBarWidth = (playerWidth - scaledVideoWidth) / 2;
		const horizontalBlackBarHeight = (playerHeight - scaledVideoHeight) / 2;

		const widthOffsetPercent = (verticalBlackBarWidth / playerWidth * 100);
		const heightOffsetPercent = (horizontalBlackBarHeight / playerHeight * 100);

		const widthMultiplier = (scaledVideoWidth / playerWidth);
		const heightMultiplier = (scaledVideoHeight / playerHeight);

		for (const annotation of annotations) {
			// update x, y, width, and height
			let ax = widthOffsetPercent + (annotation.data.x * widthMultiplier);
			let ay = heightOffsetPercent + (annotation.data.y * heightMultiplier);
			let aw = annotation.data.width * widthMultiplier;
			let ah = annotation.data.height * heightMultiplier;
			annotation.setDimensions(`${ax}%`, `${ay}%`, `${aw}%`, `${ah}%`);

			// update padding
			let horizontalPadding = scaledVideoWidth * 0.008;
			let verticalPadding = scaledVideoHeight * 0.008;
			annotation.setPadding(horizontalPadding, verticalPadding);

			if (annotation instanceof SpeechAnnotation) {
				const asx = this.percentToPixels(playerWidth, ax);
				const asy = this.percentToPixels(playerHeight, ay);
				const asw = this.percentToPixels(playerWidth, aw);
				const ash = this.percentToPixels(playerHeight, ah);

				let sx = widthOffsetPercent + (annotation.data.sx * widthMultiplier);
				let sy = heightOffsetPercent + (annotation.data.sy * heightMultiplier);
				sx = this.percentToPixels(playerWidth, sx);
				sy = this.percentToPixels(playerHeight, sy);

				annotation.updateSpeechBubble(asx, asy, asw, ash, sx, sy, null);
			}

			// update annotation text and close button size
			annotation.updateTextSize(scaledVideoHeight);
			annotation.updateCloseSize(scaledVideoHeight);
		}
	}

	updateAllAnnotationSizes(): void {
		if (this.playerOptions && this.playerOptions.getOriginalVideoWidth && this.playerOptions.getOriginalVideoHeight) {
			const videoWidth = this.playerOptions.getOriginalVideoWidth();
			const videoHeight = this.playerOptions.getOriginalVideoHeight();
			this.updateAnnotationDimensions(this.annotations, videoWidth, videoHeight);
		}
		else {
			const playerWidth = this.container.getBoundingClientRect().width;
			const playerHeight = this.container.getBoundingClientRect().height;
			this.updateAnnotationDimensions(this.annotations, playerWidth, playerHeight);
		}
	}
	/**
	 * Hides every annotation, even if it should be displayed based on the current video time.
	 */
	hideAll(): void {
		for (const annotation of this.annotations) {
			annotation.hide();
		}
	}
	private annotationClickHandler(e) {
		let annotationElement = e.target;
		// if we click on annotation text instead of the actual annotation element
		if (!annotationElement.matches(".__cxt-ar-annotation__") && !annotationElement.closest(".__cxt-ar-annotation-close__")) {
			annotationElement = annotationElement.closest(".__cxt-ar-annotation__");
			if (!annotationElement) return null;
		}
		let annotationData = annotationElement.__annotationData as Annotation;

		if (!annotationElement || !annotationData) return;

		if (annotationData.action.type === "time") {
			const seconds = annotationData.action.seconds;
			if (this.playerOptions) {
				this.playerOptions.seekTo(seconds);
				const videoTime = this.playerOptions.getVideoTime();
				this.update(videoTime);
			}
			window.dispatchEvent(new CustomEvent("__ar_seek_to", {detail: {seconds}}));
		}
		else if (annotationData.action.type === "url") {
			const data = {
				url: annotationData.action.url,
				target: annotationData.action.target || "current"
			};

			const timeHash = this.extractTimeHash(new URL(data.url));
			if (timeHash && timeHash.hasOwnProperty("seconds")) {
				data.seconds = timeHash.seconds;
			}
			window.dispatchEvent(new CustomEvent("__ar_annotation_click", {detail: data}));
		}
	}

	/**
	 * Specify how often to check if annotations should be hidden or displayed.
	 * @param ms
	 */
	setUpdateInterval(ms: number): void {
		this.updateInterval = ms;
		this.stop();
		this.start();
	}
	private extractTimeHash(url: URL): { seconds: number } | boolean {
		if (!url) throw new Error("A URL must be provided");
		const hash = url.hash;

		if (hash && hash.startsWith("#t=")) {
			const timeString = url.hash.split("#t=")[1];
			const seconds = this.timeStringToSeconds(timeString);
			return { seconds };
		}
		else {
			return false;
		}
	}
	private timeStringToSeconds(time: string): number {
		let seconds = 0;

		const h = time.split("h");
	  	const m = (h[1] || time).split("m");
	  	const s = (m[1] || time).split("s");

	  	if (h[0] && h.length === 2) seconds += parseInt(h[0], 10) * 60 * 60;
	  	if (m[0] && m.length === 2) seconds += parseInt(m[0], 10) * 60;
	  	if (s[0] && s.length === 2) seconds += parseInt(s[0], 10);

		return seconds;
	}
	private percentToPixels(a: number, b: number): number {
		return a * b / 100;
	}
}

export default AnnotationRenderer;

window.AnnotationRenderer = AnnotationRenderer;
