import reactiveMap from "../lib/reactiveMap";
import { Chapter } from "@jcsj/epub/lib/traits";
export const TOC = reactiveMap<string, Chapter>();
export default TOC;