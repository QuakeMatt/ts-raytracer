import { Accumulator } from "./Accumulator";
import { Color } from "../material/Color";
import { Ray } from "../scene/Ray";
import { Scene } from "../scene/Scene";
import { serializable } from "../util/Serializer";

@serializable()
export class RayTracer {

    accumulate(accumulator: Accumulator, ray: Ray, scene: Scene, weight: number = 1.0, limit: number = 10) {

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
            this.accumulate(accumulator, reflected, scene, reflectiveness, limit - 1);
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
                let diffuse = hit.object.material.diffuse || Color.white;
                let strength = hit.normal.dot(lightRay.direction) * weight;
                accumulator.r += diffuse.r * strength;
                accumulator.g += diffuse.g * strength;
                accumulator.b += diffuse.b * strength;
            }

        }

    }

}
