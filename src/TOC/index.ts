import { useLocalStorage } from "@vueuse/core";
import reactiveMap from "../lib/reactiveMap";
import { Chapter } from "@jcsj/epub/lib/traits";
export const TOC = reactiveMap<string, Chapter>();
export const DEFAULT_MAX_DEPTH = 7;
export const maxDepth = useLocalStorage("toc-max-depth", DEFAULT_MAX_DEPTH);
export default TOC;
