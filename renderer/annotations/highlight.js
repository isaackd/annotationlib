import { NoteAnnotation, getFinalAnnotationColor } from "./note.js";

class HighlightAnnotation extends NoteAnnotation {
	constructor(annotationData, closeElement) {
		super(annotationData, closeElement);

		const { bgOpacity } = this.data;

		this.element.style.backgroundColor = "";
		this.element.style.border = `2.5px solid ${getFinalAnnotationColor(bgOpacity, 8748933, false)}`;
	}

	setupHoverAppearance() {
		const { bgOpacity, bgColor, actionType } = this.data;

		this.element.addEventListener("mouseenter", () => {
			this.closeElement.currentAnnotation = this;
			this.closeElement.lastAnnotation = this;
			
			this.element.style.border = `2.5px solid ${getFinalAnnotationColor(bgOpacity, bgColor, true)}`;
			this.closeElement.style.display = "block";

			const halfSize = this.closeButtonSize / 2;

			const rect = this.element.getBoundingClientRect();
			this.closeElement.style.left = rect.right - halfSize + "px";
			this.closeElement.style.top = rect.top - halfSize + "px";
		});
		this.element.addEventListener("mouseleave", () => {
			this.element.style.border = `2.5px solid ${getFinalAnnotationColor(bgOpacity, 8748933, false)}`;
			this.closeElement.currentAnnotation = null;

			setTimeout(() => {
				if (!this.closeElement.hovered && this.closeElement.currentAnnotation === null) {
					this.closeElement.style.display = "none";
				}
			}, 100);
		});
		if (actionType === "url") {
			this.element.style.cursor = "pointer";
		}
	}
}

export default HighlightAnnotation;
