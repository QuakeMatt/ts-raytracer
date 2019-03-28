import { Color } from "./Color";
import { serializable } from "../util/Serializer";

class MaterialBuilder {

    diffuse: Color = Color.white;
    reflectiveness: number = 0.0;

    withDiffuse(color: Color) {
        this.diffuse = color;
        return this;
    }

    withReflectiveness(reflectiveness: number) {
        this.reflectiveness = reflectiveness;
        return this;
    }

    build() {
        return new Material(this);
    }

}

@serializable()
export class Material {

    readonly diffuse: Color;
    readonly reflectiveness: number;

    constructor(builder: MaterialBuilder) {
        this.diffuse = builder.diffuse;
        this.reflectiveness = builder.reflectiveness;
    }

    static builder() {
        return new MaterialBuilder();
    }

    static default = Material.builder().build();

}
