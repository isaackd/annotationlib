class NoteAnnotation {
	static get defaultAppearanceAttributes() {
		return {
			bgColor: 0xFFFFFF,
			bgOpacity: 0.80,
			fgColor: 0,
			textSize: 3.15
		};
	}

	constructor(annotationData) {
		if (!annotationData) throw new Error("Annotation data must be provided");

		this.data = annotationData;

		this.element = document.createElement("div");
		this.element.classList.add("__cxt-ar-annotation__");

		this.element.__annotationData = this.data;

		this.closeElement = this.setupCloseElement();
		this.element.append(this.closeElement);

		if (this.data.text) {
			this.textElement = document.createElement("span");
			this.textElement.textContent = this.data.text;
			this.element.append(this.textElement);
		}

		this.setupAppearance();
		if (this.data.style !== "speech" && this.data.style !== "title") {
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
	setupCloseElement() {
		const closeButton = this.createCloseElement();
		closeButton.addEventListener("click", e => {
			this.element.setAttribute("hidden", "");
			this.element.setAttribute("data-ar-closed", "");
		});
		return closeButton;
	}
	setupAppearance() {
		let appearance = this.constructor.defaultAppearanceAttributes;
		if (!isNaN(this.data.textSize)) {
			appearance.textSize = this.data.textSize;
		}
		if (!isNaN(this.data.fgColor)) {
			appearance.fgColor = this.data.fgColor;
		}

		if (!isNaN(this.data.bgColor)) {
			appearance.bgColor = this.data.bgColor;
		}

		if (!isNaN(this.data.bgOpacity)) {
			appearance.bgOpacity = this.data.bgOpacity;
		}

		this.data.bgColor = appearance.bgColor;
		this.data.bgOpacity = appearance.bgOpacity;
		this.data.fgColor = appearance.fgColor;
		this.data.textSize = appearance.textSize;

		this.element.style.color = "#" + decimalToHex(appearance.fgColor);
	}

	setupHoverAppearance() {
		const { bgOpacity, bgColor } = this.data;

		const finalBackgroundColor = getFinalAnnotationColor(bgOpacity, bgColor);
		this.element.style.backgroundColor = finalBackgroundColor;

		this.element.addEventListener("mouseenter", () => {
			this.element.style.backgroundColor = getFinalAnnotationColor(bgOpacity, bgColor, true);
			this.closeElement.style.display = "block";
		});
		this.element.addEventListener("mouseleave", () => {
			this.element.style.backgroundColor = getFinalAnnotationColor(bgOpacity, bgColor, false);
			this.closeElement.style.display = "none";
		});
		if (this.data.actionType === "url") {
			this.element.style.cursor = "pointer";
		}
	}

	createCloseElement(strokeWidth = 10) {
		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svg.setAttribute("viewBox", "0 0 100 100")
		svg.classList.add("__cxt-ar-annotation-close__");

		const path = document.createElementNS(svg.namespaceURI, "path");
		path.setAttribute("d", "M25 25 L 75 75 M 75 25 L 25 75");
		path.setAttribute("stroke", "#bbb");
		path.setAttribute("stroke-width", strokeWidth);
		path.setAttribute("x", 5);
		path.setAttribute("y", 5);

		const circle = document.createElementNS(svg.namespaceURI, "circle");
		circle.setAttribute("cx", 50);
		circle.setAttribute("cy", 50);
		circle.setAttribute("r", 50);

		svg.append(circle, path);
		return svg;
	}

	show() {
		this.element.removeAttribute("hidden");
	}
	hide() {
		this.element.setAttribute("hidden", "");
	}

	updateTextSize(containerHeight) {
		if (this.data.textSize) {
			const newTextSize = (this.data.textSize / this.textScaling) * containerHeight;
			this.fontSize = `${newTextSize}px`;
		}
	}
	updateCloseSize(containerHeight) {
		const newSize = containerHeight * this.closeButtonScaling;
		this.closeElement.style.width = newSize + "px";
		this.closeElement.style.height = newSize + "px";

		this.closeElement.style.right = (newSize / this.closeButtonOffset) + "px";
		this.closeElement.style.top = (newSize / this.closeButtonOffset) + "px";

		this.closeButtonSize = newSize;
	}

	setDimensions(x, y, width, height) {
		this.left = x;
		this.top = y;
		this.width = width;
		this.height = height;
	}
	setPadding(h, v) {
		h = (h * this.paddingMultiplier) + "px";
		v = (v * this.paddingMultiplier) + "px";
		this.element.style.padding = `${v} ${h} ${v} ${h}`;
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
// https://stackoverflow.com/a/3689638/10817894
function decimalToHex(dec) {
	let hex = dec.toString(16);
	hex = "000000".substr(0, 6 - hex.length) + hex; 
	return hex;
}
function getFinalAnnotationColor(bgOpacity, bgColor, hover = false, hoverOpacity = 0xE6) {
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