import { NoteAnnotation } from './note.js';

import type { Annotation } from "../../parser";

class HighlightTextAnnotation extends NoteAnnotation {
	constructor(annotationData: Annotation, closeElement: SVGSVGElement, parentAnnotation: Annotation) {
		annotationData.x += parentAnnotation.x;
		annotationData.y += parentAnnotation.y;
		super(annotationData, closeElement);

		this.element.style.backgroundColor = "";
		this.element.style.border = "";
		this.element.style.pointerEvents = "none";

		parentAnnotation.element.addEventListener("mouseenter", e => {
			this.show();
		});
		parentAnnotation.element.addEventListener("mouseleave", e => {
			this.hide();
		});

		this.closeElement.style.display = "none";
		this.closeElement.style.cursor = "default";
	}

	setupHoverAppearance(): void {
		// Removed default hover appearance by overriding and doing nothing
	}
}

export default HighlightTextAnnotation;
