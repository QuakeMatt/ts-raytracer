import { Color } from "./Color";

export class Material {

    diffuse: Color | null;

    reflectiveness: number = -1.0;

    static default() {
        let material = new Material();
        material.diffuse = { r: 1.0, g: 1.0, b: 1.0 };
        return material;
    }

}
