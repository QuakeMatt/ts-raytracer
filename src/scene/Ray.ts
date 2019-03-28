import { serializable } from "../util/Serializer";
import { Vector3 } from "../math/Vector3";

@serializable()
export class Ray {

    readonly origin: Vector3;
    readonly direction: Vector3;

    constructor(origin: Vector3, direction: Vector3) {
        this.origin = origin;
        this.direction = direction.normalize();
    }

}
