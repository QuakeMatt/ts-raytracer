import { Accumulator } from "../Accumulator";
import { Ray } from "../../scene/Ray";
import { Scene } from "../../scene/Scene";

export interface RenderStrategy {
    accumulate(accumulator: Accumulator, ray: Ray, scene: Scene): void;
}

export function isRenderStrategy(obj: any): obj is RenderStrategy {
    return (
        obj != null
        && typeof (obj as RenderStrategy).accumulate === 'function'
    );
}
