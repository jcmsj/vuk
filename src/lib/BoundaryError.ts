export class BoundaryError extends RangeError {
    name = "BoundaryError";
    constructor(where: string) {
        super(`Unable to load book element beyond the ${where}.`);
    }
}
