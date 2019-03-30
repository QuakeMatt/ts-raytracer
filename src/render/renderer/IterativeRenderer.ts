import { Camera } from "../../scene/Camera";
import { Emitter, ProgressFunction } from "../Emitter";
import { Fragment } from "../Fragment";
import { FragmentRendererOptions, FragmentRenderer } from "./FragmentRenderer";
import { Renderer, RenderFunction, isRenderer } from "./Renderer";
import { serializable } from "../../util/Serializer";
import { Surface } from "../Surface";
import { Viewport } from "../Viewport";

let defaultTile: Surface = {
    width: 64,
    height: 64,
};

export interface IterativeRendererOptions extends FragmentRendererOptions {
    renderer?: Renderer;
    tile?: Surface;
}

@serializable()
export class IterativeRenderer implements Renderer {

    readonly renderer: Renderer;
    readonly tile: Surface;

    constructor(options: IterativeRendererOptions = {}) {
        this.renderer = isRenderer(options.renderer) ? options.renderer : new FragmentRenderer(options);
        this.tile = options.tile ? { width: options.tile.width, height: options.tile.height } : defaultTile;
    }

    prepare(surface: Surface, camera: Camera, viewport: Viewport): RenderFunction {

        let tile = this.tile;

        function* getIterator(render: RenderFunction, fragment: Fragment, onProgress: ProgressFunction) {

            let xx = Math.ceil(fragment.width / tile.width) | 0;
            let yx = Math.ceil(fragment.height / tile.height) | 0;

            for (let y = 0; y < yx; y++) {
                for (let x = 0; x < xx; x++) {
                    yield render(fragment.intersection(
                        fragment.x + tile.width * x,
                        fragment.y + tile.height * y,
                        tile.width,
                        tile.height,
                    ));
                }
            }

        }

        return (fragment: Fragment) => {
            return new Emitter((onProgress, onComplete) => {

                let render = this.renderer.prepare(surface, camera, viewport);
                let iterator = getIterator(render, fragment, onProgress);

                function next() {
                    let emitter = iterator.next().value;
                    if (emitter) {
                        emitter
                            .onProgress(onProgress)
                            .onComplete(next);
                    }
                    else {
                        onComplete();
                    }
                }

                next();

            });
        };

    }

    render(surface: Surface, camera: Camera, viewport: Viewport): Emitter {

        let render = this.prepare(surface, camera, viewport);
        return render(Fragment.from(surface));

    }

}
