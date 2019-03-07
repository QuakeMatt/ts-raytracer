import { Material } from "../material/Material";
import { Ray } from "../scene/Ray";
import { RayIntersection } from "../scene/RayIntersection";
import { Renderable } from "../scene/Renderable";
import { Vector3 } from "../math/Vector3";

export class Sphere implements Renderable {

    readonly origin: Vector3;
    readonly radius: number;
    readonly material: Material;

    constructor(origin: Vector3, radius: number, material: Material = Material.default) {
        this.origin = origin;
        this.radius = radius;
        this.material = material;
    }

    cast(ray: Ray): RayIntersection | null {

        let sphereOffset = this.origin.sub(ray.origin);
        let rayDirection = ray.direction;
        let rayDistanceToTangent = sphereOffset.dot(rayDirection);
        let rayDistanceToCenterSq = sphereOffset.dot(sphereOffset);
        let rayDistanceToTangentSq = rayDistanceToTangent * rayDistanceToTangent;
        let tangentLengthSq = rayDistanceToCenterSq - rayDistanceToTangentSq;
        let sphereRadiusSq = this.radius * this.radius;

        if (sphereRadiusSq < tangentLengthSq) {
            return null;
        }

        let intersectionDistanceHalf = Math.sqrt(sphereRadiusSq - tangentLengthSq);
        let distanceToImpact = rayDistanceToTangent - intersectionDistanceHalf;

        if (distanceToImpact < -0.00001) {
            return null;
        }

        let point = rayDirection.multiply(distanceToImpact).add(ray.origin);
        let normal = point.sub(this.origin).normalize();

        return {
            ray: ray,
            object: this,
            point: point,
            normal: normal,
            distance: distanceToImpact,
        };

    }

}
