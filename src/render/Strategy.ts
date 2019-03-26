import { Accumulator } from "./Accumulator";
import { Ray } from "../scene/Ray";
import { Scene } from "../scene/Scene";

export interface Strategy {
    accumulate(accumulator: Accumulator, ray: Ray, scene: Scene): void;
}
