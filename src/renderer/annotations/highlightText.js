import { NoteAnnotation } from "./note.js";

class HighlightTextAnnotation extends NoteAnnotation {
	constructor(annotationData, parentAnnotation) {
		annotationData.x += parentAnnotation.data.x;
		annotationData.y += parentAnnotation.data.y;
		super(annotationData);

		this.element.style.backgroundColor = "";
		this.element.style.border = "";
		this.element.style.pointerEvents = "none";

		parentAnnotation.element.addEventListener("mouseenter", e => {
			this.show();
		});
		parentAnnotation.element.addEventListener("mouseleave", e => {
			this.hide();
		});

		this.closeElement.remove();
	}

	setupHoverAppearance() {
		// Removed default hover appearance by overriding and doing nothing
	}
}

export default HighlightTextAnnotation;
