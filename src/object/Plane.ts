import { SceneObject } from "../scene/SceneObject";
import { Vector3 } from "../math/Vector3";
import { Ray } from "../scene/Ray";
import { RayIntersection } from "../scene/RayIntersection";

export class Plane implements SceneObject {

    origin: Vector3;
    normal: Vector3;

    constructor(origin: Vector3, normal: Vector3) {
        this.origin = origin;
        this.normal = normal.normalize();
    }

    cast(ray: Ray): RayIntersection | null {

        let angleMultiplier = this.normal.dot(ray.direction);

        // negative multiplier = hit front face
        // positive multiplier = hit back face
        // zero multiplier = parallel line, no hit!

        if (angleMultiplier > 0.0) {
            return null;
        }

        let planeOffset = this.origin.sub(ray.origin);
        let tangentLength = this.normal.dot(planeOffset);

        let intersectionDistance = tangentLength / angleMultiplier;

        let point = ray.origin.add(ray.direction.multiply(intersectionDistance));
        let normal = this.normal;

        return {
            ray: ray,
            object: this,
            point: point,
            normal: normal,
        };

    }

}
