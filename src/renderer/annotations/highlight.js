import { NoteAnnotation, getFinalAnnotationColor } from "./note.js";

class HighlightAnnotation extends NoteAnnotation {
	constructor(annotationData) {
		super(annotationData);

		const { bgOpacity } = this.data;

		this.element.style.backgroundColor = "";
		this.element.style.border = `2.5px solid ${getFinalAnnotationColor(bgOpacity, 8748933, false)}`;
	}

	setupHoverAppearance() {
		const { bgOpacity, bgColor, actionType } = this.data;

		this.element.addEventListener("mouseenter", () => {
			this.element.style.border = `2.5px solid ${getFinalAnnotationColor(bgOpacity, bgColor, true)}`;
			this.closeElement.style.display = "block";
		});
		this.element.addEventListener("mouseleave", () => {
			this.element.style.border = `2.5px solid ${getFinalAnnotationColor(bgOpacity, 8748933, false)}`;
			this.closeElement.style.display = "none";
		});
		if (actionType === "url") {
			this.element.style.cursor = "pointer";
		}
	}
}

export default HighlightAnnotation;