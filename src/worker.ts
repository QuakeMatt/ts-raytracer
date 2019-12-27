import { Camera } from "./scene/Camera";
import { Fragment } from "./render/Fragment";
import { Renderer, RenderFunction } from "./render/renderer/Renderer";
import { Surface } from "./render/Surface";
import { Viewport } from "./render/Viewport";
import { Serializer } from "./util/Serializer";

export function worker(worker: Worker) {

    let preparedRender: RenderFunction;

    function init(renderer: Renderer, surface: Surface, camera: Camera, viewport: Viewport) {
        preparedRender = renderer.prepare(surface, camera, viewport);
    }

    function onProgress(imageData: ImageData, fragment: Fragment) {
        worker.postMessage(['onProgress', {
            imageData: {
                width: imageData.width,
                height: imageData.height,
                buffer: imageData.data.buffer,
            },
            fragment: Serializer.serialize(fragment),
        }], [imageData.data.buffer]);
    }

    function onComplete() {
        worker.postMessage(['onComplete']);
    }

    function render(fragment: Fragment) {
        preparedRender(fragment)
            .onProgress(onProgress)
            .onComplete(onComplete);
    }

    function handleMessage(action: string, args: any) {
        let ds = Serializer.deserialize;
        switch (action) {

            case 'init':
                init(ds(args.renderer), args.surface, ds(args.camera), ds(args.viewport));
                break;

            case 'render':
                render(ds(args.fragment));
                break;

        }
    }

    worker.onmessage = (event) => {

        let data = event.data;
        if (Array.isArray(data) && typeof data[0] === 'string') {
            handleMessage(data[0], data[1]);
        }
        else {
            throw new Error('oh no');
        }

    };

};
