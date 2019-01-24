class AnnotationRenderer {

	static get defaultAppearanceAttributes() {
		return {
			bgColor: 0xFFFFFF,
			bgOpacity: 0.70,
			fgColor: 0,
			textSize: 3.15
		};
	}

	constructor(annotations, container, playerOptions, updateInterval = 1000) {
		if (!annotations) throw new Error("Annotation objects must be provided");
		if (!container) throw new Error("An element to contain the annotations must be provided");

		if (playerOptions && playerOptions.getVideoTime && playerOptions.seekTo) {
			this.playerOptions = playerOptions;
		}
		else {
			console.info("AnnotationRenderer is running without a player. The update method will need to be called manually.");
		}

		this.annotations = annotations;
		this.container = container;

		this.annotationsContainer = document.createElement("div");
		this.annotationsContainer.classList.add("__cxt-ar-annotations-container__");
		this.annotationsContainer.setAttribute("data-layer", "4");
		this.annotationsContainer.addEventListener("click", e => {
			this.annotationClickHandler(e);
		});
		this.container.prepend(this.annotationsContainer);

		this.createAnnotationElements();

		// in case the dom already loaded
		this.updateTextSize();
		this.updateCloseSize();
		window.addEventListener("DOMContentLoaded", e => {
			this.updateTextSize();
			this.updateCloseSize();
		});

		this.updateInterval = updateInterval;
		this.updateIntervalId = null;
	}
	changeAnnotationData(annotations) {
		this.stop();
		this.removeAnnotationElements();
		this.annotations = annotations;
		this.createAnnotationElements();
		this.start();
	}
	createAnnotationElements() {
		for (const annotation of this.annotations) {
			const el = document.createElement("div");
			el.classList.add("__cxt-ar-annotation__");

			annotation.__element = el;
			el.__anotation = annotation;

			el.style.left = `${annotation.x}%`;
			el.style.top = `${annotation.y}%`;

			el.style.width = `${annotation.width}%`;
			el.style.height = `${annotation.height}%`;

			// close button
			const closeButton = this.createCloseElement();
			closeButton.addEventListener("click", e => {
				el.setAttribute("hidden", "");
				el.setAttribute("data-ar-closed", "");
			});
			el.append(closeButton);

			// appearance
			const containerHeight = this.container.getBoundingClientRect().height;
			let annotationAppearance = this.constructor.defaultAppearanceAttributes;
			if (!isNaN(annotation.textSize)) {
				// text size calculations
				// https://github.com/Seirade/YouTube-Annotation-Player/blob/ca763944c4bc947d44ba975c1f07fc0438b51cd3/annotations.js#L88
				annotationAppearance.textSize = annotation.textSize;
			}

			if (!isNaN(annotation.fgColor)) {
				annotationAppearance.fgColor = annotation.fgColor;
			}

			if (!isNaN(annotation.bgColor)) {
				annotationAppearance.bgColor = annotation.bgColor;
			}

			annotation.bgColor = annotationAppearance.bgColor;
			annotation.bgOpacity = annotationAppearance.bgOpacity;
			annotation.fgColor = annotationAppearance.fgColor;
			annotation.textSize = annotationAppearance.textSize;

			this.updateAnnotationTextSize(annotation);
			el.style.color = `#${this.decimalToHex(annotationAppearance.fgColor)}`;

			el.style.backgroundColor = this.getFinalAnnotationColor(annotationAppearance);
			el.addEventListener("mouseenter", () => {
				el.style.backgroundColor = this.getFinalAnnotationColor(annotationAppearance, true);
			});
			el.addEventListener("mouseleave", () => {
				el.style.backgroundColor = this.getFinalAnnotationColor(annotationAppearance, false);
			});

			el.setAttribute("data-ar-type", annotation.type);

			if (annotation.text) {
				const textNode = document.createElement("span");
				textNode.textContent = annotation.text;
				el.append(textNode);
				el.setAttribute("data-ar-has-text", "");
			}

			el.setAttribute("hidden", "");

			this.annotationsContainer.append(el);
		}
	}
	createCloseElement() {
		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svg.setAttribute("viewBox", "0 0 100 100")
		svg.classList.add("__cxt-ar-annotation-close__");

		const path = document.createElementNS(svg.namespaceURI, "path");
		path.setAttribute("d", "M25 25 L 75 75 M 75 25 L 25 75");
		path.setAttribute("stroke", "#bbb");
		path.setAttribute("stroke-width", 10)
		path.setAttribute("x", 5);
		path.setAttribute("y", 5);

		const circle = document.createElementNS(svg.namespaceURI, "circle");
		circle.setAttribute("cx", 50);
		circle.setAttribute("cy", 50);
		circle.setAttribute("r", 50);

		svg.append(circle, path);
		return svg;
	}
	getFinalAnnotationColor(annotation, hover = false) {
		const alphaHex = hover ? (0xE6).toString(16) : Math.floor((annotation.bgOpacity * 255)).toString(16);
		if (!isNaN(annotation.bgColor)) {
			const bgColorHex = this.decimalToHex(annotation.bgColor);

			const backgroundColor = `#${bgColorHex}${alphaHex}`;
			return backgroundColor;
		}
	}
	removeAnnotationElements() {
		for (const annotation of this.annotations) {
			annotation.__element.remove();
		}
	}
	update(videoTime) {
		for (const annotation of this.annotations) {
			const el = annotation.__element;
			if (el.hasAttribute("data-ar-closed")) continue;
			const start = annotation.timeStart;
			const end = annotation.timeEnd;

			if (el.hasAttribute("hidden") && (videoTime >= start && videoTime < end)) {
				el.removeAttribute("hidden");
			}
			else if (!el.hasAttribute("hidden") && (videoTime < start || videoTime > end)) {
				el.setAttribute("hidden", "");
			}
		}
	}
	start() {
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
	stop() {
		if (!this.playerOptions) throw new Error("playerOptions must be provided to use the stop method");

		const videoTime = this.playerOptions.getVideoTime();
		if (this.updateIntervalId) {
			this.update(videoTime);
			clearInterval(this.updateIntervalId);
			this.updateIntervalId = null;
			window.dispatchEvent(new CustomEvent("__ar_renderer_stop"));
		}
	}

	updateAnnotationTextSize(annotation, containerHeight) {
		if (annotation.textSize) {
			const textSize = (annotation.textSize / 100) * containerHeight;
			annotation.__element.style.fontSize = `${textSize}px`;
		}
	}
	updateTextSize() {
		const containerHeight = this.container.getBoundingClientRect().height;
		// should be run when the video resizes
		for (const annotation of this.annotations) {
			this.updateAnnotationTextSize(annotation, containerHeight);
		}
	}

	updateCloseSize() {
		const containerHeight = this.container.getBoundingClientRect().height;
		const multiplier = 0.0423;
		this.annotationsContainer.style.setProperty("--annotation-close-size", `${containerHeight * multiplier}px`);
	}

	hideAll() {
		for (const annotation of this.annotations) {
			annotation.__element.setAttribute("hidden", "");
		}
	}
	annotationClickHandler(e) {
		let annotationElement = e.target;
		// if we click on annotation text instead of the actual annotation element
		if (!annotationElement.matches(".__cxt-ar-annotation__") && !annotationElement.closest(".__cxt-ar-annotation-close__")) {
			annotationElement = annotationElement.closest(".__cxt-ar-annotation__");
			if (!annotationElement) return null;
		} 
		let annotationData = annotationElement.__anotation;

		if (!annotationElement || !annotationData) return;

		if (annotationData.actionType === "time") {
			const seconds = annotationData.actionSeconds;
			if (this.playerOptions) {
				this.playerOptions.seekTo(seconds);
				const videoTime = this.playerOptions.getVideoTime();
				this.update(videoTime);
			}
			window.dispatchEvent(new CustomEvent("__ar_seek_to", {detail: {seconds}}));
		}
		else if (annotationData.actionType === "url") {
			// window.location.href = annotationData.actionUrl;
			window.dispatchEvent(new CustomEvent("__ar_annotation_click", {detail: {url: annotationData.actionUrl}}));
		}
	}

	setUpdateInterval(ms) {
		this.updateInterval = ms;
		this.stop();
		this.start();
	}
	// https://stackoverflow.com/a/3689638/10817894
	decimalToHex(dec) {
		let hex = dec.toString(16);
		hex = "000000".substr(0, 6 - hex.length) + hex; 
		return hex;
	}
}
