import { Material } from "../material/Material";
import { SceneObject } from "./SceneObject";

export interface Renderable extends SceneObject {
    material: Material;
}
