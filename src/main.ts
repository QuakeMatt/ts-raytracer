import { Camera } from "./scene/Camera";
import { Color } from "./material/Color";
import { Light } from "./scene/Light";
import { Material } from "./material/Material";
import { Plane } from "./object/Plane";
import { Renderer } from "./render/Renderer";
import { Scene } from "./scene/Scene";
import { Sphere } from "./object/Sphere";
import { Vector3 } from "./math/Vector3";
import { Viewport } from "./render/Viewport";

export function main() {

    const CANVAS_WIDTH = 1024;
    const CANVAS_HEIGHT = 1024;

    const VIEWPORT_DISTANCE = 10.0;
    const VIEWPORT_WIDTH = 10.0;
    const VIEWPORT_HEIGHT = 10.0;

    const RENDER_SAMPLES = 5;

    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    canvas.style.backgroundColor = '#000';
    document.body.appendChild(canvas);

    const draw = canvas.getContext('2d');
    if (draw == null) { throw new Error('Could not get canvas context'); }

    const scene = new Scene();
    const camera = new Camera(scene);

    let red = Material.builder().withDiffuse(Color.red).build();

    let green = Material.builder().withDiffuse(Color.green).build();

    let mirror = Material.builder().withReflectiveness(0.8).build();

    let floor = Material.builder().withReflectiveness(0.3).build();

    scene.addObject(
        new Sphere(new Vector3(15.0, -2.0, 9.0), 8.0, green)
    );

    scene.addObject(
        new Sphere(new Vector3(-11.0, -4.0, 45.0), 5.0, red)
    );

    scene.addObject(
        new Sphere(new Vector3(2.0, 1.0, 30.0), 10.0, mirror)
    );

    scene.addObject(
        new Plane(new Vector3(0.0, -10.0, 0.0), new Vector3(0.0, 1.0, 0.0), floor)
    );

    scene.addLight(
        new Light(new Vector3(-60.0, 80.0, -40.0))
    );

    const renderer = new Renderer();
    renderer.samples = RENDER_SAMPLES;
    const lens = new Viewport(VIEWPORT_WIDTH, VIEWPORT_HEIGHT, VIEWPORT_DISTANCE);
    const image = draw.createImageData(CANVAS_WIDTH, CANVAS_HEIGHT);
    renderer.render(image, camera, lens);
    draw.putImageData(image, 0, 0);

};
