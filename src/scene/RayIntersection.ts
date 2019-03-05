import { Ray } from "./Ray";
import { SceneObject } from "./SceneObject";
import { Vector3 } from "../math/Vector3";

export interface RayIntersection {
    ray: Ray;
    object: SceneObject;
    point: Vector3;
    normal: Vector3;
}
