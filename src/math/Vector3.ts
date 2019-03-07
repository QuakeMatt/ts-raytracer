export class Vector3 {

    readonly x: number;
    readonly y: number;
    readonly z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    length() {
        return Math.sqrt(
            this.x * this.x +
            this.y * this.y +
            this.z * this.z
        );
    }

    dot(vec: Vector3) {
        return (
            this.x * vec.x +
            this.y * vec.y +
            this.z * vec.z
        );
    }

    add(vec: Vector3) {
        return new Vector3(
            this.x + vec.x,
            this.y + vec.y,
            this.z + vec.z,
        );
    }

    sub(vec: Vector3) {
        return new Vector3(
            this.x - vec.x,
            this.y - vec.y,
            this.z - vec.z,
        );
    }

    normalize() {
        var ln = this.length();
        return new Vector3(
            this.x / ln,
            this.y / ln,
            this.z / ln,
        );
    }

    multiply(by: number) {
        return new Vector3(
            this.x * by,
            this.y * by,
            this.z * by,
        );
    }

    reflect(normal: Vector3) {
        let direction = this.normalize();
        let offset = normal.multiply(normal.dot(direction) * 2.0);
        return direction.sub(offset);
    }

}
