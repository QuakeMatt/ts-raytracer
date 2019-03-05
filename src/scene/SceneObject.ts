import { Ray } from "./Ray";
import { RayIntersection } from "./RayIntersection";

export interface SceneObject {
    cast(ray: Ray): RayIntersection | null;
}
