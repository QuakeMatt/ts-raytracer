import { Camera } from "../../scene/Camera";
import { Emitter } from "../Emitter";
import { Fragment } from "../Fragment";
import { FragmentRendererOptions, FragmentRenderer } from "./FragmentRenderer";
import { Renderer, RenderFunction, isRenderer } from "./Renderer";
import { serializable } from "../../util/Serializer";
import { Surface } from "../Surface";
import { Viewport } from "../Viewport";

export interface IterativeRendererOptions extends FragmentRendererOptions {
    renderer?: Renderer;
}

@serializable()
export class IterativeRenderer implements Renderer {

    readonly renderer: Renderer;

    constructor(options: IterativeRendererOptions = {}) {
        this.renderer = isRenderer(options.renderer) ? options.renderer : new FragmentRenderer(options);
    }

    prepare(surface: Surface, camera: Camera, viewport: Viewport): RenderFunction {

        return (fragment: Fragment) => {
            return new Emitter((onProgress, onComplete) => {

                let render = this.renderer.prepare(surface, camera, viewport);

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

    render(surface: Surface, camera: Camera, viewport: Viewport): Emitter {

        let render = this.prepare(surface, camera, viewport);
        return render(Fragment.from(surface));

    }

}
