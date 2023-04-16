import type { Annotation } from "../../parser";

class NoteAnnotation {
	static get defaultAppearanceAttributes() {
		return {
			backgroundColor: 0xFFFFFF,
			backgroundOpacity: 0.80,
			foregroundColor: 0,
			textSize: 3.15
		};
	}

	data: Annotation;
	closeElement: SVGSVGElement;
	element: HTMLElement;

	textElement: HTMLElement;
	textScaling: number;
	paddingMultiplier: number;
	closeButtonScaling: number;
	closeButtonOffset: number;
	closeButtonSize: number;

	constructor(annotationData: Annotation, closeElement: SVGSVGElement) {
		if (!annotationData) throw new Error("Annotation data must be provided");

		this.data = annotationData;
		this.closeElement = closeElement;

		this.element = document.createElement("div");
		this.element.classList.add("__cxt-ar-annotation__");

		this.element.__annotationData = this.data;

		if (this.data.text) {
			this.textElement = document.createElement("span");
			this.textElement.textContent = this.data.text;
			this.element.append(this.textElement);
		}

		this.setupAppearance();
		if (this.data.style !== "speech") {
			this.setupHoverAppearance();
		}

		this.element.setAttribute("data-ar-type", this.data.type);
		if (this.data.style) {
			this.element.setAttribute("data-ar-style", this.data.style);
		}
		this.element.setAttribute("hidden", "");

		// options to make it easier for other annotation types
		// to change behavior without having to override methods
		this.textScaling = 100;
		this.paddingMultiplier = 1;
		this.closeButtonScaling = 0.0423;
		this.closeButtonOffset = -1.8;
	}
	setupAppearance(): void {
		let appearance = NoteAnnotation.defaultAppearanceAttributes;
		if (!isNaN(this.data.appearance.textSize)) {
			appearance.textSize = this.data.appearance.textSize;
		}
		if (!isNaN(this.data.appearance.foregroundColor)) {
			appearance.foregroundColor = this.data.appearance.foregroundColor;
		}

		if (!isNaN(this.data.appearance.backgroundColor)) {
			appearance.backgroundColor = this.data.appearance.backgroundColor;
		}

		if (!isNaN(this.data.appearance.backgroundOpacity)) {
			appearance.backgroundOpacity = this.data.appearance.backgroundOpacity;
		}

		this.data.appearance.backgroundColor = appearance.backgroundColor;
		this.data.appearance.backgroundOpacity = appearance.backgroundOpacity;
		this.data.appearance.foregroundColor = appearance.foregroundColor;
		this.data.appearance.textSize = appearance.textSize;

		this.element.style.color = "#" + decimalToHex(appearance.foregroundColor);
	}

	setupHoverAppearance(): void {
		const { backgroundOpacity, backgroundColor } = this.data.appearance;

		const finalBackgroundColor = getFinalAnnotationColor(backgroundOpacity, backgroundColor);
		this.element.style.backgroundColor = finalBackgroundColor;

		this.element.addEventListener("mouseenter", () => {
			this.element.style.backgroundColor = getFinalAnnotationColor(backgroundOpacity, backgroundColor, true);

			this.closeElement.currentAnnotation = this;
			this.closeElement.lastAnnotation = this;

			this.closeElement.style.display = "block";

			const halfSize = this.closeButtonSize / 2;

			const rect = this.element.getBoundingClientRect();
			this.closeElement.style.left = rect.right - halfSize + "px";
			this.closeElement.style.top = rect.top - halfSize + "px";
		});
		this.element.addEventListener("mouseleave", () => {
			this.element.style.backgroundColor = getFinalAnnotationColor(backgroundOpacity, backgroundColor, false);
			this.closeElement.currentAnnotation = null;

			setTimeout(() => {
				if (!this.closeElement.hovered && this.closeElement.currentAnnotation === null) {
					this.closeElement.style.display = "none";
				}
			}, 100);
		});
		if (this.data.action.type === "url") {
			this.element.style.cursor = "pointer";
		}
	}

	createCloseElement(strokeWidth: number = 10): SVGSVGElement {
		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svg.setAttribute("viewBox", "0 0 100 100")
		svg.classList.add("__cxt-ar-annotation-close__");

		const path = document.createElementNS(svg.namespaceURI, "path");
		path.setAttribute("d", "M25 25 L 75 75 M 75 25 L 25 75");
		path.setAttribute("stroke", "#bbb");
		path.setAttribute("stroke-width", strokeWidth.toString());
		path.setAttribute("x", "5");
		path.setAttribute("y", "5");

		const circle = document.createElementNS(svg.namespaceURI, "circle");
		circle.setAttribute("cx", "50");
		circle.setAttribute("cy", "50");
		circle.setAttribute("r", "50");

		svg.append(circle, path);
		return svg;
	}

	show() {
		this.element.removeAttribute("hidden");
	}
	hide() {
		this.element.setAttribute("hidden", "");
	}

	updateTextSize(containerHeight: number): void {
		if (this.data.appearance.textSize) {
			const newTextSize = (this.data.appearance.textSize / this.textScaling) * containerHeight;
			this.fontSize = `${newTextSize}px`;
		}
	}
	updateCloseSize(containerHeight: number): void {
		const newSize = containerHeight * this.closeButtonScaling;
		this.closeElement.style.width = newSize + "px";
		this.closeElement.style.height = newSize + "px";

		this.closeElement.style.right = (newSize / this.closeButtonOffset) + "px";
		this.closeElement.style.top = (newSize / this.closeButtonOffset) + "px";

		this.closeButtonSize = newSize;
	}

	setDimensions(x: string, y: string, width: string, height: string) {
		this.left = x;
		this.top = y;
		this.width = width;
		this.height = height;
	}
	setPadding(h: number, v: number) {
		h = (h * this.paddingMultiplier) + "px";
		v = (v * this.paddingMultiplier) + "px";
		this.element.style.padding = `${v} ${h} ${v} ${h}`;
	}

	get closed(): boolean {
		return this.element.hasAttribute("data-ar-closed");
	}
	get hidden(): boolean {
		return this.element.hasAttribute("hidden");
	}

	get type(): Annotation["type"] {
		return this.data.type;
	}
	get style(): Annotation["style"] {
		return this.data.style;
	}

	set left(val: string) {
		this.element.style.left = val;
	}
	set top(val: string) {
		this.element.style.top = val;
	}
	set width(val: string) {
		this.element.style.width = val;
	}
	set height(val: string) {
		this.element.style.height = val;
	}

	set fontSize(val: string) {
		this.element.style.fontSize = val;
	}
}
// https://stackoverflow.com/a/3689638/10817894
function decimalToHex(dec: number): string {
	let hex = dec.toString(16);
	hex = "000000".substr(0, 6 - hex.length) + hex;
	return hex;
}
function getFinalAnnotationColor(bgOpacity: number, bgColor: number, hover: boolean = false, hoverOpacity: number = 0xE6): string {
	if (!isNaN(bgOpacity) && !isNaN(bgColor)) {
		const alphaHex = hover
			? (hoverOpacity).toString(16)
			: Math.floor((bgOpacity * 255)).toString(16);

		const bgColorHex = decimalToHex(bgColor);
		const backgroundColor = `#${bgColorHex}${alphaHex}`;

		return backgroundColor;
	}
	// default to full opacity
	return "#FFFFFFFF";
}

export default NoteAnnotation;
export { NoteAnnotation, getFinalAnnotationColor, decimalToHex };
