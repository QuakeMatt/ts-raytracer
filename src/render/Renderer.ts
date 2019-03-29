import { Accumulator } from "./Accumulator";
import { Camera } from "../scene/Camera";
import { Emitter } from "./Emitter";
import { Fragment } from "./Fragment";
import { ImageSize } from "./ImageSize";
import { RayTracer } from "./RayTracer";
import { serializable } from "../util/Serializer";
import { Strategy } from "./Strategy";
import { Viewport } from "./Viewport";

type RenderFn = (fragment: Fragment) => Emitter;

@serializable()
export class Renderer {

    samples: number = 1;
    strategy: Strategy;

    constructor() {
        this.strategy = new RayTracer();
    }

    prepare(imageSize: ImageSize, camera: Camera, viewport: Viewport): RenderFn {

        let samplePatterns = [
            { x: 0.5, y: 0.5 },
            { x: 0.1, y: 0.3 },
            { x: 0.9, y: 0.1 },
            { x: 0.3, y: 0.7 },
            { x: 0.7, y: 0.9 },
        ];

        let samples = this.samples;
        let samplesInv = 1.0 / samples;

        let imageW = imageSize.width | 0;
        let imageH = imageSize.height | 0;

        let imageWInv = 1.0 / imageW;
        let imageHInv = 1.0 / imageH;

        let accumulator = new Accumulator();

        return (fragment: Fragment) => {
            return new Emitter((onProgress, onComplete) => {

                let frameX = fragment.x;
                let frameY = fragment.y;

                let frameW = fragment.width;
                let frameH = fragment.height;

                let imageData = new Uint8ClampedArray(frameW * frameH * 4);

                for (let y = 0; y < frameH; y++) {
                    let imageY = y + frameY;

                    for (let x = 0; x < frameW; x++) {
                        let imageX = x + frameX;

                        accumulator.reset();

                        for (let sample = 0; sample < samples; sample++) {

                            let pattern = samplePatterns[sample];
                            if (pattern == null) {
                                pattern = samplePatterns[sample] = { x: Math.random(), y: Math.random() };
                            }

                            let viewX = (imageX + pattern.x) * imageWInv;
                            let viewY = (imageY + pattern.y) * imageHInv;

                            let ray = viewport.getRay(viewX, viewY);
                            this.strategy.accumulate(accumulator, ray, camera.scene);

                        }

                        let i = (x + y * frameW) * 4;
                        imageData[i + 0] = accumulator.r * samplesInv * 255.0;
                        imageData[i + 1] = accumulator.g * samplesInv * 255.0;
                        imageData[i + 2] = accumulator.b * samplesInv * 255.0;
                        imageData[i + 3] = 255;

                    }

                }

                onProgress(new ImageData(imageData, frameW, frameH), fragment);
                onComplete();

            });
        };

    }

    render(imageSize: ImageSize, camera: Camera, viewport: Viewport): Emitter {

        let render = this.prepare(imageSize, camera, viewport);
        return render(Fragment.from(imageSize));

    }

}
