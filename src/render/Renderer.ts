import { Accumulator } from "./Accumulator";
import { Camera } from "../scene/Camera";
import { Ray } from "../scene/Ray";
import { Scene } from "../scene/Scene";
import { Viewport } from "./Viewport";

export class Renderer {

    samples: number = 1;

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
                    this.castRay(ray, camera.scene, accumulator);

                }

                let i = (imageX + imageY * imageH) * 4;
                imageData[i + 0] = accumulator.r * samplesInv * 255.0;
                imageData[i + 1] = accumulator.g * samplesInv * 255.0;
                imageData[i + 2] = accumulator.b * samplesInv * 255.0;
                imageData[i + 3] = 255;

            }

        }

    }

    castRay(ray: Ray, scene: Scene, accumulator: Accumulator, weight: number = 1.0, limit: number = 10) {

        if (limit < 1) {
            return;
        }

        let hit = scene.cast(ray);
        if (hit == null) {
            return;
        }

        if (hit.object.material.reflectiveness > 0.0) {
            let reflectiveness = hit.object.material.reflectiveness * weight;
            let reflected = new Ray(hit.point, ray.direction.reflect(hit.normal));
            this.castRay(reflected, scene, accumulator, reflectiveness, limit - 1);
            weight -= reflectiveness;
        }

        if (weight < 0.000001) {
            return;
        }

        let lights = scene.lights;
        for (let i = 0, ix = lights.length; i < ix; i++) {

            let light = lights[i];
            let lightRay = new Ray(hit.point, light.origin.sub(hit.point));

            let lightHit = scene.cast(lightRay);
            if (lightHit == null) {
                let diffuse = hit.object.material.diffuse || { r: 1.0, g: 1.0, b: 1.0 };
                let strength = hit.normal.dot(lightRay.direction.normalize()) * weight;
                accumulator.r += diffuse.r * strength;
                accumulator.g += diffuse.g * strength;
                accumulator.b += diffuse.b * strength;
            }

        }

    }

}
