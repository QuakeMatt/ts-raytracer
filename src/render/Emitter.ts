import { Fragment } from "./Fragment";

declare function clearImmediate(handle: number): void;
declare function setImmediate(handler: (...args: any[]) => void): number;
declare function setImmediate(handler: any, ...args: any[]): number;

export type ProgressFunction = (imageData: ImageData, fragment: Fragment) => void;
export type CompleteFunction = () => void;

export class Emitter {

    private readonly _onProgress: Array<ProgressFunction>;
    private readonly _onComplete: Array<CompleteFunction>;

    constructor(fn: (onProgress: ProgressFunction, onComplete: CompleteFunction) => void) {

        this._onProgress = [];
        this._onComplete = [];

        let onProgress = (imageData: ImageData, fragment: Fragment) => {
            this._onProgress.forEach(cb => cb(imageData, fragment));
        };

        let onComplete = () => {
            this._onComplete.forEach(cb => cb());
        };

        setImmediate(function () {
            fn(onProgress, onComplete);
        });

    }

    onProgress(cb: ProgressFunction): Emitter {
        this._onProgress.push(cb);
        return this;
    }

    onComplete(cb: CompleteFunction): Emitter {
        this._onComplete.push(cb);
        return this;
    }

    toTarget(target: CanvasRenderingContext2D): Emitter {
        return this.onProgress(function (imageData, fragment) {
            target.putImageData(imageData, fragment.x, fragment.y);
        });
    }

}
