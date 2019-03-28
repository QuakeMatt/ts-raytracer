import { Ray } from "../scene/Ray";
import { serializable } from "../util/Serializer";
import { Vector3 } from "../math/Vector3";

@serializable()
export class Viewport {

    width: number;
    height: number;
    focalDistance: number;

    xMult: number;
    xAdd: number;

    yMult: number;
    yAdd: number;

    constructor(width: number, height: number, focalDistance: number) {

        this.width = width;
        this.height = height;
        this.focalDistance = focalDistance;

        this.xMult = this.width;
        this.xAdd = this.width * -0.5;

        this.yMult = -this.height;
        this.yAdd = this.height * 0.5;

    }

    getRay(x: number, y: number) {

        return new Ray(
            new Vector3(
                0.0,
                0.0,
                0.0,
            ),
            new Vector3(
                x * this.xMult + this.xAdd,
                y * this.yMult + this.yAdd,
                this.focalDistance
            ),
        );

    }

}
