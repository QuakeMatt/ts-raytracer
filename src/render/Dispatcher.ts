import { Camera } from "../scene/Camera";
import { Emitter, ProgressFn } from "./Emitter";
import { Fragment } from "./Fragment";
import { ImageSize } from "./ImageSize";
import { Renderer } from "./Renderer";
import { serializable } from "../util/Serializer";
import { Viewport } from "./Viewport";

type RenderFn = (fragment: Fragment) => Emitter;

@serializable()
export class Dispatcher {

    readonly renderer: Renderer;

    constructor(renderer: Renderer) {
        this.renderer = renderer;
    }

    prepare(imageSize: ImageSize, camera: Camera, viewport: Viewport): RenderFn {

        return (fragment: Fragment) => {
            return new Emitter((onProgress, onComplete) => {

                let render = this.renderer.prepare(imageSize, camera, viewport);

                let y = -1;
                function next() {
                    if (++y < fragment.height) {
                        render(new Fragment(fragment.x, y + fragment.y, fragment.width, 1))
                            .onProgress(onProgress)
                            .onComplete(next);
                    }
                    else {
                        onComplete();
                    }
                };

                next();

            });
        };

    }

    render(imageSize: ImageSize, camera: Camera, viewport: Viewport): Emitter {

        let render = this.prepare(imageSize, camera, viewport);
        return render(Fragment.from(imageSize));

    }

}
