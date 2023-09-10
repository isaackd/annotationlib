# annotationlib

****annotationlib is intended for other projects looking to support annotations. 
If you're instead looking to view YouTube annotations again, 
check out [AnnotationsRestored](https://github.com/isaackd/AnnotationsRestored) and https://invidio.us.***

## Usage
Import the renderer and/or the parser.

```html
<script type="text/javascript" src="renderer.js"></script>
<script type="text/javascript" src="parser.js"></script>
```

or

```js
import { parseFromXml } from "parser.js";
import { AnnotationRenderer } from "renderer.js";
```

Then parse the XML and begin rendering annotations

```javascript
const annotations = parseFromXml(xmlData);

const videoContainer = document.getElementById("video-container");
// `video` is a <video> element
const video = document.getElementById("video");
const renderer = new AnnotationRenderer(annotations, videoContainer, {
    getVideoTime() {
        return video.currentTime;
    },
    seekTo(seconds) {
        video.currentTime = seconds;
    },
    getOriginalVideoWidth() {
        return video.videoWidth;
    },
    getOriginalVideoHeight() {
        return video.videoHeight;
    }
});
renderer.start();

window.addEventListener("resize", e => {
    renderer.updateAllAnnotationSizes();
});
```

### Click Events

Each time an annotation that has a link attached to it is clicked, the event `__ar_annotation_click` is fired on `window`, with `e.detail.url` set to the url.

`e.detail` also includes `seconds` if the link that was clicked on is a video with a timestamp hash (e.g. `#t=38s`).
```javascript
window.addEventListener("__ar_annotation_click", e => {
    const url = e.detail.url;
    // redirect to the url
    window.location.href = url;
    // or provide a custom redirect
    // window.location.href = `www.example.com/redirect?url=${url}`;
});
```

## Building
1. Run `npm install` to install the dev dependencies
2. Make changes and run `npm run build`

## Testing

Vitest is used for testing. Run `vitest` in the root directory to run all tests.
