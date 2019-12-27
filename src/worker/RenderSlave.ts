import { Camera } from "../scene/Camera";
import { Fragment } from "../render/Fragment";
import { ProgressFunction, CompleteFunction } from "../render/Emitter";
import { Renderer } from "../render/renderer/Renderer";
import { Serializer } from "../util/Serializer";
import { Surface } from "../render/Surface";
import { Viewport } from "../render/Viewport";

export class RenderSlave {

    readonly worker: Worker;

    private readonly _onProgress: Array<ProgressFunction>;
    private readonly _onComplete: Array<CompleteFunction>;

    constructor(script: string, renderer: Renderer, surface: Surface, camera: Camera, viewport: Viewport) {

        this._onProgress = [];
        this._onComplete = [];

        this.worker = new Worker(script);
        this.worker.onmessage = (event) => {
            let data = event.data;
            if (Array.isArray(data) && typeof data[0] === 'string') {
                this.handleMessage(data[0], data[1] || {});
            }
            else {
                throw new Error('oh no');
            }
        };

        this.init(renderer, surface, camera, viewport);

    }

    private handleMessage(action: string, args: any) {
        let ds = Serializer.deserialize;
        switch (action) {

            case 'onProgress':
                this.notifyProgress(
                    new ImageData(
                        new Uint8ClampedArray(args.imageData.buffer),
                        args.imageData.width,
                        args.imageData.height,
                    ),
                    ds(args.fragment),
                );
                break;

            case 'onComplete':
                this.notifyComplete();
                break;

        }
    }

    private init(renderer: Renderer, surface: Surface, camera: Camera, viewport: Viewport): RenderSlave {

        this.worker.postMessage(['init', {
            renderer: Serializer.serialize(renderer),
            surface: { width: surface.width, height: surface.height },
            camera: Serializer.serialize(camera),
            viewport: Serializer.serialize(viewport),
        }]);

        return this;

    }

    render(fragment: Fragment): RenderSlave {

        this.worker.postMessage(['render', {
            fragment: Serializer.serialize(fragment),
        }]);

        return this;
    }

    onProgress(fn: ProgressFunction): RenderSlave {
        this._onProgress.push(fn);
        return this;
    }

    onComplete(fn: CompleteFunction): RenderSlave {
        this._onComplete.push(fn);
        return this;
    }

    private notifyProgress(imageData: ImageData, fragment: Fragment) {
        this._onProgress.forEach(cb => cb(imageData, fragment));
    }

    private notifyComplete() {
        this._onComplete.forEach(cb => cb());
    }

}
