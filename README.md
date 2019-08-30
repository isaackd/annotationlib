# annotationlib

****For other projects looking to support annotations. 
If you're instead looking to view YouTube annotations again, 
check out [AnnotationsRestored](https://github.com/afrmtbl/AnnotationsRestored), [AnnotationsReloaded](https://addons.mozilla.org/firefox/addon/annotationsreloaded/), and https://dev.invidio.us.***

## Usage
Start by including `AnnotationRenderer.css` and `AnnotationRenderer.js`

```html
<link rel="stylesheet" type="text/css" href="AnnotationRenderer.css">
<script type="text/javascript" src="AnnotationRenderer.js"></script>
```

If parsing annotation data, include `AnnotationParser.js` as well
```html
<script type="text/javascript" src="AnnotationParser.js"></script>
```

Finally, parse the XML and begin rendering annotations

```javascript
const parser = new AnnotationParser();
const annotationElements = parser.getAnnotationsFromXml(xmlData);
const annotations = parser.parseYoutubeAnnotationList(annotationElements);

const videoContainer = document.getElementById("video-container");
<!-- HTML5 video element -->
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
