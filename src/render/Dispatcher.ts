import { Camera } from "../scene/Camera";
import { Emitter, ProgressFn } from "./Emitter";
import { Fragment } from "./Fragment";
import { ImageSize } from "./ImageSize";
import { Renderer } from "./Renderer";
import { Viewport } from "./Viewport";

export class Dispatcher {

    readonly renderer: Renderer;

    constructor(renderer: Renderer) {
        this.renderer = renderer;
    }

    dispatch(imageSize: ImageSize, camera: Camera, viewport: Viewport): Emitter {

        const renderer = this.renderer;

        function* getIterator(onProgress: ProgressFn) {

            for (let y = 0; y < imageSize.height; y += 1) {
                let fragment = new Fragment(0, y, imageSize.width, 1);
                let imageData = renderer.render(imageSize, camera, viewport, fragment);
                onProgress(imageData, fragment);
                yield true;
            }

        };

        return new Emitter((onProgress, onComplete) => {

            let iterator = getIterator(onProgress);

            function run() {
                let runUntil = performance.now() + 10.0; // 10ms
                while (iterator.next().value) {
                    if (performance.now() > runUntil) {
                        setTimeout(run, 0);
                        return;
                    }
                }

                setTimeout(onComplete, 0);
            }

            setTimeout(run, 0);

        });

    }

}
