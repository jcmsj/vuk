/**
 * 
 * @param {String} txt 
 * @returns 
 */
function addTrailingSlash(txt) {
    txt.trim();

    if (txt.substr(-1) != "/") {
        txt += "/";
    }

    return txt;
}

export default addTrailingSlash