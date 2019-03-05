import { Light } from "./Light";
import { Ray } from "./Ray";
import { RayIntersection } from "./RayIntersection";
import { SceneObject } from "./SceneObject";

export class Scene {

    lights: Light[];
    objects: SceneObject[];

    constructor() {
        this.lights = [];
        this.objects = [];
    }

    addLight(light: Light) {
        this.lights.push(light);
    }

    addObject(object: SceneObject) {
        this.objects.push(object);
    }

    cast(ray: Ray): RayIntersection | null {

        for (let i = 0, ix = this.objects.length; i < ix; i++) {

            let object = this.objects[i];
            let objectHit = object.cast(ray);
            if (objectHit) {
                return objectHit;
            }

        }

        return null;

    }

}
