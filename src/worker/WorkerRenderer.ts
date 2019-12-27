import { Camera } from "../scene/Camera";
import { Emitter, ProgressFunction } from "../render/Emitter";
import { Fragment } from "../render/Fragment";
import { FragmentRenderer, FragmentRendererOptions } from "../render/renderer/FragmentRenderer";
import { Renderer, RenderFunction, isRenderer } from "../render/renderer/Renderer";
import { RenderSlave } from "./RenderSlave";
import { serializable } from "../util/Serializer";
import { Surface } from "../render/Surface";
import { Viewport } from "../render/Viewport";

let defaultTile: Surface = {
    width: 64,
    height: 64,
};

export interface WorkerRendererOptions extends FragmentRendererOptions {
    renderer?: Renderer;
    workers?: number;
    script?: string;
    tile?: Surface;
}

@serializable()
export class WorkerRenderer implements Renderer {

    readonly renderer: Renderer;
    readonly workers: number;
    readonly script: string;
    readonly tile: Surface;

    constructor(options: WorkerRendererOptions = {}) {
        this.renderer = isRenderer(options.renderer) ? options.renderer : new FragmentRenderer(options);
        this.workers = (options.workers != null) ? (options.workers | 0) : 4;
        this.script = (options.script != null) ? options.script : './index.js';
        this.tile = options.tile ? { width: options.tile.width, height: options.tile.height } : defaultTile;
    }

    prepare(surface: Surface, camera: Camera, viewport: Viewport): RenderFunction {

        let tile = this.tile;

        function* getIterator(fragment: Fragment) {

            let xx = Math.ceil(fragment.width / tile.width) | 0;
            let yx = Math.ceil(fragment.height / tile.height) | 0;

            for (let y = 0; y < yx; y++) {
                for (let x = 0; x < xx; x++) {
                    yield fragment.intersection(
                        fragment.x + tile.width * x,
                        fragment.y + tile.height * y,
                        tile.width,
                        tile.height,
                    );
                }
            }

        }

        return (fragment: Fragment) => {
            return new Emitter((onProgress, onComplete) => {

                let workers: Array<RenderSlave> = [];
                let remaining: number = this.workers;
                let iterator = getIterator(fragment);

                function dispatch(worker: RenderSlave) {

                    let subfragment = iterator.next().value;
                    if (subfragment) {
                        worker.render(subfragment);
                        return true;
                    }

                    if (--remaining === 0) {
                        onComplete();
                    }

                    return false;

                }

                for (let i = 0, ix = this.workers; i < ix; i++) {
                    workers.push(new RenderSlave(this.script, this.renderer, surface, camera, viewport));
                }

                workers.forEach((worker) => {
                    if (dispatch(worker)) {
                        worker.onProgress((imageData, fragment) => {
                            onProgress(imageData, fragment);
                        });
                        worker.onComplete(() => {
                            dispatch(worker);
                        });
                    }
                });

            });
        };

    }

    render(surface: Surface, camera: Camera, viewport: Viewport): Emitter {

        let render = this.prepare(surface, camera, viewport);
        return render(Fragment.from(surface));

    }

}
