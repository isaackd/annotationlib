import { defineConfig } from "vite";
import { resolve } from "path";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
    test: {
        browser: {
            enabled: true,
            name: "chrome", // browser name is required
        },
    },
    build: {
        minify: true,
        lib: {
            entry: {
                parser: "parser/index.ts",
                renderer: "renderer/index.ts",
            },
            formats: ["es"]
        },
    },
    esbuild: {
        minifyIdentifiers: false
    },
    plugins: [
        cssInjectedByJsPlugin({
            jsAssetsFilterFunction: (outputChunk) => {
                return ["renderer.js", "renderer.mjs"].includes(outputChunk.fileName)
            }
        })
    ]
});
