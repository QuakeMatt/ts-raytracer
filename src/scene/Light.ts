import { serializable } from "../util/Serializer";
import { Vector3 } from "../math/Vector3";

@serializable()
export class Light {

    origin: Vector3;

    constructor(origin: Vector3) {
        this.origin = origin;
    }

}
