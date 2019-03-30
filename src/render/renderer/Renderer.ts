import { Camera } from "../../scene/Camera";
import { Emitter } from "../Emitter";
import { Fragment } from "../Fragment";
import { Surface } from "../Surface";
import { Viewport } from "../Viewport";

export type RenderFunction = (fragment: Fragment) => Emitter;

export interface Renderer {
    prepare(surface: Surface, camera: Camera, viewport: Viewport): RenderFunction;
    render(surface: Surface, camera: Camera, viewport: Viewport): Emitter;
}

export function isRenderer(obj: any): obj is Renderer {
    return (
        obj != null
        && typeof (obj as Renderer).prepare === 'function'
        && typeof (obj as Renderer).render === 'function'
    );
}
