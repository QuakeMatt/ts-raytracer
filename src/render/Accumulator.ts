export class Accumulator {
    r: number = 0.0;
    g: number = 0.0;
    b: number = 0.0;

    reset() {
        this.r = this.g = this.b = 0.0;
    }
}
