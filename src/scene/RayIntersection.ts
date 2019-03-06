import { Ray } from "./Ray";
import { Renderable } from "./Renderable";
import { Vector3 } from "../math/Vector3";

export interface RayIntersection {
    ray: Ray;
    object: Renderable;
    point: Vector3;
    normal: Vector3;
    distance: number;
}
