import {get, set} from "idb-keyval";
import { idb } from "../idb";
import {reactive} from "vue";

export const speech_rate = reactive({
    value : 1,
    min : 0.25,
    max : 3,

    /**
     * @param {Number} n 
     * @returns 
     */
    set(n) {
        if (n > this.max || n < this.min)
            return;

        this.value = n;
        set(idb.speech_rate, this.value);
    }
})

get(idb.speech_rate).then(n => {
    speech_rate.set(n || 1);
})