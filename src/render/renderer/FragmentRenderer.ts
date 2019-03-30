import { Accumulator } from "../Accumulator";
import { Camera } from "../../scene/Camera";
import { Emitter } from "../Emitter";
import { Fragment } from "../Fragment";
import { RayTracer, RayTracerOptions } from "../strategy/RayTracer";
import { Renderer, RenderFunction } from "./Renderer";
import { RenderStrategy, isRenderStrategy } from "../strategy/RenderStrategy";
import { serializable } from "../../util/Serializer";
import { Surface } from "../Surface";
import { Viewport } from "../Viewport";

export interface FragmentRendererOptions {
    samples?: number;
    strategy?: RenderStrategy | RayTracerOptions;
}

@serializable()
export class FragmentRenderer implements Renderer {

    readonly samples: number;
    readonly strategy: RenderStrategy;

    constructor(options: FragmentRendererOptions = {}) {
        this.samples = (options.samples != null) ? (options.samples | 0) : 1;
        this.strategy = isRenderStrategy(options.strategy) ? options.strategy : new RayTracer(options.strategy);
    }

    prepare(surface: Surface, camera: Camera, viewport: Viewport): RenderFunction {

        let samplePatterns = [
            { x: 0.5, y: 0.5 },
            { x: 0.1, y: 0.3 },
            { x: 0.9, y: 0.1 },
            { x: 0.3, y: 0.7 },
            { x: 0.7, y: 0.9 },
        ];

        let samples = this.samples;
        let samplesInv = 1.0 / samples;

        let imageW = surface.width | 0;
        let imageH = surface.height | 0;

        let imageWInv = 1.0 / imageW;
        let imageHInv = 1.0 / imageH;

        let accumulator = new Accumulator();

        return (fragment: Fragment) => {
            return new Emitter((onProgress, onComplete) => {

                let frameX = fragment.x;
                let frameY = fragment.y;

                let frameW = fragment.width;
                let frameH = fragment.height;

                let imageBuffer = new Uint8ClampedArray(frameW * frameH * 4);

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
                        imageBuffer[i + 0] = accumulator.r * samplesInv * 255.0;
                        imageBuffer[i + 1] = accumulator.g * samplesInv * 255.0;
                        imageBuffer[i + 2] = accumulator.b * samplesInv * 255.0;
                        imageBuffer[i + 3] = 255;

                    }

                }

                onProgress(new ImageData(imageBuffer, frameW, frameH), fragment);
                onComplete();

            });
        };

    }

    render(surface: Surface, camera: Camera, viewport: Viewport): Emitter {

        let render = this.prepare(surface, camera, viewport);
        return render(Fragment.from(surface));

    }

}
