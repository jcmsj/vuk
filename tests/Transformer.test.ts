import Transformer from "../src/TTS/Transformer";
import { test, expect } from "@playwright/test";

const gElem = document.createElement("div");
gElem.innerHTML = "The quick brown fox jumps over the lazy dog"


test("Starts at 0", () => {
    const charPos = Transformer.transform(gElem, 0)
    expect(charPos).toBe(0)
})

test("Identifies correct charIndex given a wordIndex", () => {
    const charPos = Transformer.transform(gElem, 1);
    expect(charPos).toBe(5)
})