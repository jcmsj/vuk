import {ref} from "vue"

export default function useBool(v=false) {
    const bool = ref(v);

    function toggle() {
        bool.value = !bool.value
    }
      
    function off() {
        bool.value = false
    }
    
    function on() {
        bool.value = true
    }

    return {bool, toggle, off, on}
}