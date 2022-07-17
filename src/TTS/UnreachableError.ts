export default class UnreachableError extends TypeError {
    name = "UnreachableError"

    constructor(extra:string = "") {
        super("Unreachable! " + extra)
    }
}