# annotationlib

****annotationlib is intended for other projects looking to support annotations. 
If you're instead looking to view YouTube annotations again, 
check out [AnnotationsRestored](https://github.com/afrmtbl/AnnotationsRestored), [AnnotationsReloaded](https://addons.mozilla.org/firefox/addon/annotationsreloaded/), and https://invidio.us.***

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
1. Install [Pax](https://pax.js.org/) to bundle the JS
2. Run `npm install uglify-es -g` and `npm install clean-css-cli -g` for minification tools
3. Make changes then run `npm run release`
