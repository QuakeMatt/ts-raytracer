import { Material } from "../material/Material";
import { Ray } from "../scene/Ray";
import { RayIntersection } from "../scene/RayIntersection";
import { Renderable } from "../scene/Renderable";
import { Vector3 } from "../math/Vector3";

export class Sphere implements Renderable {

    origin: Vector3;
    radius: number;
    material: Material;

    constructor(origin: Vector3, radius: number, material: Material | null = null) {
        this.origin = origin;
        this.radius = radius;
        this.material = material || Material.default();
    }

    cast(ray: Ray): RayIntersection | null {

        let sphereOffset = this.origin.sub(ray.origin);
        let rayDirection = ray.direction.normalize();
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
