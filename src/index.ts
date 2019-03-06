import { Camera } from "./scene/Camera";
import { Light } from "./scene/Light";
import { Renderer } from "./render/Renderer";
import { Scene } from "./scene/Scene";
import { Sphere } from "./object/Sphere";
import { Vector3 } from "./math/Vector3";
import { Viewport } from "./render/Viewport";
import { Plane } from "./object/Plane";
import { Material } from "./material/Material";

const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 1024;

const VIEWPORT_DISTANCE = 10.0;
const VIEWPORT_WIDTH = 10.0;
const VIEWPORT_HEIGHT = 10.0;

const RENDER_SAMPLES = 1;

const canvas: HTMLCanvasElement = document.createElement('canvas');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas.style.backgroundColor = '#000';
document.body.appendChild(canvas);

const draw = canvas.getContext('2d');
if (draw == null) { throw new Error('Could not get canvas context'); }

const scene = new Scene();
const camera = new Camera(scene);

let red = new Material();
red.diffuse = { r: 1.0, g: 0.2, b: 0.2 };

let green = new Material();
green.diffuse = { r: 0.2, g: 0.8, b: 0.2 };

let mirror = new Material();
mirror.reflectiveness = 0.8;

let floor = new Material();
floor.reflectiveness = 0.3;

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
