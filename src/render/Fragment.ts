import { serializable } from "../util/Serializer";

@serializable()
export class Fragment {

    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x | 0;
        this.y = y | 0;
        this.width = width | 0;
        this.height = height | 0;
    }

    intersection(x: number, y: number, width: number, height: number) {
        return new Fragment(
            Math.max(x, this.x),
            Math.max(y, this.x),
            Math.min(x + width, this.x + this.width) - x,
            Math.min(y + height, this.y + this.height) - y,
        );
    }

    static from(rect: { x?: number, y?: number, width: number, height: number }) {
        return new Fragment(
            rect.x || 0,
            rect.y || 0,
            rect.width,
            rect.height,
        );
    }

}
