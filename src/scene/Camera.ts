import { Ray } from "./Ray";
import { RayIntersection } from "./RayIntersection";
import { Scene } from "./Scene";
import { serializable } from "../util/Serializer";

@serializable()
export class Camera {

    scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    cast(ray: Ray): RayIntersection | null {
        return this.scene.cast(ray);
    }

}
