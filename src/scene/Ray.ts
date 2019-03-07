import { Vector3 } from "../math/Vector3";

export class Ray {

    readonly origin: Vector3;
    readonly direction: Vector3;

    constructor(origin: Vector3, direction: Vector3) {
        this.origin = origin;
        this.direction = direction.normalize();
    }

}
