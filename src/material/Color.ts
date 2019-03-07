export class Color {

    readonly r: number;
    readonly g: number;
    readonly b: number;

    constructor(r: number, g: number, b: number) {
        this.r = r * 1.0;
        this.g = g * 1.0;
        this.b = b * 1.0;
    }

    static white = new Color(1, 1, 1);
    static black = new Color(0, 0, 0);
    static red = new Color(1, 0, 0);
    static green = new Color(0, 1, 0);
    static blue = new Color(0, 0, 1);

}
