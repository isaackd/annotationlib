import { NoteAnnotation, getFinalAnnotationColor } from "./note.js";

/**
 * Creates speech bubble annotations for the renderer to display.
 * @class SpeechAnnotation
 */
class SpeechAnnotation extends NoteAnnotation {
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

	constructor(annotationData) {
		super(annotationData);

		this.createSpeechBubble();
		this.setupHoverAppearance();

		this.textX = 0;
		this.textY = 0;
		this.textWidth = 0;
		this.textHeight = 0;

		this.baseStartX = 0;
		this.baseStartY = 0;

		this.baseEndX = 0;
		this.baseEndY = 0;

		this.pointX = 0;
		this.pointY = 0;

		this.directionPadding = 20;

		this.paddingMultiplier = 2;
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
		if (pointX > ((x + width) - (width / 2)) && pointY > y + height) {
			return "br";
		}
		else if (pointX < ((x + width) - (width / 2)) && pointY > y + height) {
			return "bl";
		}
		else if (pointX > ((x + width) - (width / 2)) && pointY < (y - directionPadding)) {
			return "tr";
		}
		else if (pointX < ((x + width) - (width / 2)) && pointY < y) {
			return "tl";
		}
		else if (pointX > (x + width) && pointY > (y - directionPadding) && pointY < ((y + height) - directionPadding)) {
			return "r";
		}
		else if (pointX < x && pointY > y && pointY < (y + height)) {
			return "l";
		}
	}

	createSpeechBubble(color = "white") {
		this.speechSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		this.speechSvg.classList.add("__cxt-ar-annotation-speech-bubble__");

		this.speechSvg.style.position = "absolute";
		this.speechSvg.setAttribute("width", "100%");
		this.speechSvg.setAttribute("height", "100%");
		this.speechSvg.style.left = "0";
		this.speechSvg.style.left = "0";

		this.speechSvg.style.display = "block";
		this.speechSvg.style.overflow = "visible";

		this.speechTriangle = document.createElementNS("http://www.w3.org/2000/svg", "path");
		this.speechTriangle.setAttribute("fill", color);
		this.speechSvg.append(this.speechTriangle);

		this.element.prepend(this.speechSvg);
	}

	updateSpeechBubble(x, y, width, height, pointX, pointY, color = "white", directionPadding = 20) {
		const hBaseStartMultiplier = this.constructor.horizontalBaseStartMultiplier;
		const hBaseEndMultiplier = this.constructor.horizontalBaseEndMultiplier;
		const vBaseStartMultiplier = this.constructor.verticalBaseStartMultiplier;
		const vBaseEndMultiplier = this.constructor.verticalBaseEndMultiplier;

		const pointDirection = this.getPointDirection(x, y, width, height, pointX, pointY, this.directionPadding);
		let commentRectPath = "";

		if (pointDirection === "br") {
			this.baseStartX = width - ((width * hBaseStartMultiplier) * 2);
			this.baseEndX = this.baseStartX + (width * hBaseEndMultiplier);
			this.baseStartY = height;
			this.baseEndY = height;

			this.pointX = pointX - x;
			this.pointY = pointY - y;
			this.height = (pointY - y) + "px";
			commentRectPath = `L${width} ${height} L${width} 0 L0 0 L0 ${this.baseStartY} L${this.baseStartX} ${this.baseStartY}`;

			this.textWidth = width;
			this.textHeight = height;
			this.textX = 0;
			this.textY = 0;
		}
		else if (pointDirection === "bl") {
			this.baseStartX = width * hBaseStartMultiplier;
			this.baseEndX = this.baseStartX + (width * hBaseEndMultiplier);
			this.baseStartY = height;
			this.baseEndY = height;

			this.pointX = pointX - x;
			this.pointY = pointY - y;
			this.height = `${pointY - y}px`;
			commentRectPath = `L${width} ${height} L${width} 0 L0 0 L0 ${this.baseStartY} L${this.baseStartX} ${this.baseStartY}`;
			this.textWidth = width;
			this.textHeight = height;
			this.textX = 0;
			this.textY = 0;
		}
		else if (pointDirection === "tr") {
			this.baseStartX = width - ((width * hBaseStartMultiplier) * 2);
			this.baseEndX = this.baseStartX + (width * hBaseEndMultiplier);

			const yOffset = y - pointY;
			this.baseStartY = yOffset;
			this.baseEndY = yOffset;
			this.top = y - yOffset + "px";
			this.height = height + yOffset + "px";

			this.pointX = pointX - x;
			this.pointY = 0;
			commentRectPath = `L${width} ${yOffset} L${width} ${height + yOffset} L0 ${height + yOffset} L0 ${yOffset} L${this.baseStartX} ${this.baseStartY}`;

			this.textWidth = width;
			this.textHeight = height;
			this.textX = 0;
			this.textY = yOffset;
		}
		else if (pointDirection === "tl") {
			this.baseStartX = width * hBaseStartMultiplier;
			this.baseEndX = this.baseStartX + (width * hBaseEndMultiplier);

			const yOffset = y - pointY;
			this.baseStartY = yOffset;
			this.baseEndY = yOffset;
			this.top = y - yOffset + "px";
			this.height = height + yOffset + "px";

			this.pointX = pointX - x;
			this.pointY = 0;
			commentRectPath = `L${width} ${yOffset} L${width} ${height + yOffset} L0 ${height + yOffset} L0 ${yOffset} L${this.baseStartX} ${this.baseStartY}`;

			this.textWidth = width;
			this.textHeight = height;
			this.textX = 0;
			this.textY = yOffset;
		}
		else if (pointDirection === "r") {
			const xOffset = pointX - (x + width);

			this.baseStartX = width;
			this.baseEndX = width;

			this.width = width + xOffset + "px";

			this.baseStartY = height * vBaseStartMultiplier;
			this.baseEndY = this.baseStartY + (height * vBaseEndMultiplier);

			this.pointX = width + xOffset;
			this.pointY = pointY - y;
			commentRectPath = `L${this.baseStartX} ${height} L0 ${height} L0 0 L${this.baseStartX} 0 L${this.baseStartX} ${this.baseStartY}`;
				
			this.textWidth = width;
			this.textHeight = height;
			this.textX = 0;
			this.textY = 0;
		}
		else if (pointDirection === "l") {
			const xOffset = x - pointX;

			this.baseStartX = xOffset;
			this.baseEndX = xOffset;

			this.left = x - xOffset + "px";
			this.width = width + xOffset + "px";

			this.baseStartY = height * vBaseStartMultiplier;
			this.baseEndY = this.baseStartY + (height * vBaseEndMultiplier);

			this.pointX = 0;
			this.pointY = pointY - y;
			commentRectPath = `L${this.baseStartX} ${height} L${width + this.baseStartX} ${height} L${width + this.baseStartX} 0 L${this.baseStartX} 0 L${this.baseStartX} ${this.baseStartY}`;
			
			this.textWidth = width;
			this.textHeight = height;
			this.textX = xOffset;
			this.textY = 0;
		}

		if (this.textElement) {
			this.textElement.style.left = this.textX + "px";
			this.textElement.style.top = this.textY + "px";
			this.textElement.style.width = this.textWidth + "px";
			this.textElement.style.height = this.textHeight + "px";
		}
		if (this.closeElement && this.closeButtonSize) {
			this.closeElement.style.left = ((this.textX + this.textWidth) + (this.closeButtonSize / this.closeButtonOffset)) + "px";
			this.closeElement.style.top = (this.textY + (this.closeButtonSize / this.closeButtonOffset)) + "px";
		}

		const pathData = `M${this.baseStartX} ${this.baseStartY} L${this.pointX} ${this.pointY} L${this.baseEndX} ${this.baseEndY} ${commentRectPath}`;
		this.speechTriangle.setAttribute("d", pathData);
	}

	updateCloseSize(containerHeight) {
		const newSize = containerHeight * this.closeButtonScaling;
		this.closeElement.style.width = newSize + "px";
		this.closeElement.style.height = newSize + "px";

		this.closeButtonSize = newSize;
	}

	setupHoverAppearance() {
		const { bgOpacity, bgColor } = this.data;
		this.speechTriangle.addEventListener("mouseover", () => {
			this.closeElement.style.display = "block";
			this.closeElement.style.cursor = "pointer";
			this.speechTriangle.setAttribute("fill", getFinalAnnotationColor(bgOpacity, bgColor, true));
		});
		this.speechTriangle.addEventListener("mouseout", e => {
			if (!e.relatedTarget.classList.contains("__cxt-ar-annotation-close__")) {
				this.closeElement.style.display ="none";
				this.closeElement.style.cursor = "default";
				this.speechTriangle.setAttribute("fill", getFinalAnnotationColor(bgOpacity, bgColor, false));
			}
		});

		this.closeElement.addEventListener("mouseleave", () => {
			this.closeElement.style.display = "none";
			this.closeElement.style.cursor = "default";
			this.speechTriangle.style.cursor = "default";
			this.speechTriangle.setAttribute("fill", getFinalAnnotationColor(bgOpacity, bgColor, false));
		});
		if (this.data.actionType === "url") {
			this.element.style.cursor = "pointer";
		}
	}

	setPadding(h, v) {
		h = (h * this.paddingMultiplier) + "px";
		v = (v * this.paddingMultiplier) + "px";
		if (this.textElement) this.textElement.style.padding = `${v} ${h} ${v} ${h}`;
	}

}

function percentToPixels(a, b) {
	return a * b / 100;
}

export default SpeechAnnotation;