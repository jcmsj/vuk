class Commands {
    /**
     * 
     * @param {Object} kbEvents 
     */
    constructor(kbEvents = {}, mouseEvents = {}) {
        this.kbEvents = kbEvents;
        this.mouseEvents = mouseEvents
        window.addEventListener("keyup", e => {
            this.matchKeys(e)
        } )

        window.addEventListener("click", e => {
            this.matchMouse(e)
        })
    }

    matchMouse(e) {

    }

    matchKeys(e) {
        let cmd = e.key;

        if (e.shiftKey) {
            cmd = "shift+"  + cmd
        }

        if (e.ctrlKey) {
            cmd = "ctrl+" + cmd
        }

        if (Object.keys(this.kbEvents).includes(cmd)) {
            const cb = this.kbEvents[cmd]
            if (typeof cb == "function") {
                cb()
            }
        }

        return true
    }
}
export default Commands