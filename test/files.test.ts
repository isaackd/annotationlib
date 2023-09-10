import { expectTypeOf, test } from 'vitest';

import { parseFromXml } from '../parser';
import data from './annotations_iCkYw3cRwLo';

test("YouTube Rewind 2012 parses", () => {
	const annotations = parseFromXml(data);

	for (const anno of annotations) {
		expectTypeOf(anno.id).toBeString();
		expectTypeOf(anno.type).toBeString();

		expectTypeOf(anno.width).toBeNumber();
		expectTypeOf(anno.height).toBeNumber();

		expectTypeOf(anno.timeStart).toBeNumber();
		expectTypeOf(anno.timeEnd).toBeNumber();
	}
});
