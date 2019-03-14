import { Ray } from "../scene/Ray";
import { RayIntersection } from "../scene/RayIntersection";
import { Renderable } from "../scene/Renderable";
import { Vector3 } from "../math/Vector3";
import { Material } from "../material/Material";

export class Plane implements Renderable {

    readonly origin: Vector3;
    readonly normal: Vector3;
    readonly material: Material;

    constructor(origin: Vector3, normal: Vector3, material: Material = Material.default) {
        this.origin = origin;
        this.normal = normal.normalize();
        this.material = material;
    }

    cast(ray: Ray): RayIntersection | null {

        let angleMultiplier = this.normal.dot(ray.direction);

        // negative multiplier = hit front face
        // positive multiplier = hit back face
        // zero multiplier = parallel line, no hit!

        if (angleMultiplier > -0.00001) {
            return null;
        }

        let planeOffset = this.origin.sub(ray.origin);
        let tangentLength = this.normal.dot(planeOffset);

        let intersectionDistance = tangentLength / angleMultiplier;

        if (intersectionDistance < -0.00001) {
            return null;
        }

        let point = ray.origin.add(ray.direction.multiply(intersectionDistance));
        let normal = this.normal;

        return {
            ray: ray,
            object: this,
            point: point,
            normal: normal,
            distance: intersectionDistance,
        };

    }

}
