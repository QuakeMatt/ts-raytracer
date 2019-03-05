import { Vector3 } from "../math/Vector3";

export class Ray {

    origin: Vector3;
    direction: Vector3;

    constructor(origin: Vector3, direction: Vector3) {
        this.origin = origin;
        this.direction = direction;
    }

}
