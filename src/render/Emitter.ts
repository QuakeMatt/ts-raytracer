import { Fragment } from "./Fragment";

export type ProgressFn = (image: ImageData, fragment: Fragment) => void;
export type CompleteFn = () => void;

export class Emitter {

    private readonly _onProgress: Array<ProgressFn>;
    private readonly _onComplete: Array<CompleteFn>;

    constructor(fn: (onProgress: ProgressFn, onDone: CompleteFn) => void) {

        this._onProgress = [];
        this._onComplete = [];

        let onProgress = (imageData: ImageData, fragment: Fragment) => {
            this._onProgress.forEach(cb => cb(imageData, fragment));
        };

        let onComplete = () => {
            this._onComplete.forEach(cb => cb());
        };

        fn(onProgress, onComplete);

    }

    onProgress(cb: ProgressFn) {
        this._onProgress.push(cb);
        return this;
    }

    onComplete(cb: CompleteFn) {
        this._onComplete.push(cb);
        return this;
    }

}
