import Option from "./Option";
import type MaybeHTMLElement from "./MaybeHTMLElement";
export default class Aspect extends Option<HTMLElement> {
    constructor(v:MaybeHTMLElement=null) {
        super(v)
    }
    public set(v:MaybeHTMLElement) {
        this.value = v;
    }
}