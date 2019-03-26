import { Accumulator } from "./Accumulator";
import { Camera } from "../scene/Camera";
import { RayTracer } from "./RayTracer";
import { Strategy } from "./Strategy";
import { Viewport } from "./Viewport";

export class Renderer {

    samples: number = 1;
    strategy: Strategy;

    constructor() {
        this.strategy = new RayTracer();
    }

    render(image: ImageData, camera: Camera, viewport: Viewport) {

        let samplePatterns = [
            { x: 0.5, y: 0.5 },
            { x: 0.1, y: 0.3 },
            { x: 0.9, y: 0.1 },
            { x: 0.3, y: 0.7 },
            { x: 0.7, y: 0.9 },
        ];

        let samples = this.samples;
        let samplesInv = 1.0 / samples;

        let imageData = image.data;

        let imageW = image.width;
        let imageH = image.height;

        let imageWInv = 1.0 / imageW;
        let imageHInv = 1.0 / imageH;

        let accumulator = new Accumulator();

        for (let imageY = 0; imageY < imageH; imageY++) {

            for (let imageX = 0; imageX < imageW; imageX++) {

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

                let i = (imageX + imageY * imageH) * 4;
                imageData[i + 0] = accumulator.r * samplesInv * 255.0;
                imageData[i + 1] = accumulator.g * samplesInv * 255.0;
                imageData[i + 2] = accumulator.b * samplesInv * 255.0;
                imageData[i + 3] = 255;

            }

        }

    }

}
