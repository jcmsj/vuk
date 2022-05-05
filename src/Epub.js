import EventEmitter from "events"
import addTrailingSlash from "./trailingSlash"
import * as zip from "@zip.js/zip.js"
import convert from "xml-js";

class Epub extends EventEmitter {
    constructor(file, imageroot = "/images/", linkroot = "/links", logLevel = 0) {
        super();

        this.file = file;
        this.imageroot = addTrailingSlash(imageroot)
        this.linkroot = addTrailingSlash(linkroot)

        this.logLevel = logLevel
    }

    error(msg) {
        this.emit("error", new Error(msg));
    }

    parse() {
        this.containerFile = false;
        this.mimeFile = false;
        this.rootFile = false;

        this.metadata = {};
        this.manifest = {};
        this.guide = [];
        this.spine = {toc: false, contents: []};
        this.flow = [];
        this.flowIndex = 0;
        this.toc = [];
        this.datacache = {};
        this.imagecache = {};
        this.open();
    }

    /**
     *  Epub#open() -> undefined
     *
     *  Opens the epub file with Zip unpacker, retrieves file listing
     *  and runs mime type check
     **/
    async open() {
        this.reader = new zip.ZipReader(new zip.BlobReader(this.file))

        // get all entries from the zip
        this.entries = await this.reader.getEntries();

        // close the ZipReader
        await this.reader.close();

        if (!this.entries) {
            this.error("No files in archive")
            return;
        }

        this.checkMimeType();
    }
    
    /**
     * 
     * @param {String} name 
     * @returns {zip.Entry}
     */
    getFileInArchive(name) {
        for (const entry of this.entries) {
            if (entry.filename.toLowerCase() == name.toLowerCase()) {
                return entry;
            }
        }

        this.error(name + " not found in archive!")
    }

    /**
     * 
     * @param {String} w 
     * @returns 
     */
    determineWriter(w) {
        switch(w) {
            case "text":
                return new zip.TextWriter()
            break;
            case "blob":
                return new zip.BlobWriter() 
            break;
        }
    }

    /**
     * Reads a file from the archive
     * @param {String} name 
     * @param {String} writer 
     * @returns {Promise<{Object, Object}>
     */
    async readEntryWithName(name, writer = "text") {
        const f = this.getFileInArchive(name)
        const w = this.determineWriter(writer)
        return {file:f, data: await f.getData(w)}
    }
    /**
     *  EPub#checkMimeType() -> undefined
     *
     *  Checks if there's a file called "mimetype" and that it's contents
     *  are "application/epub+zip". On success, runs root file check.
     **/
    async checkMimeType() {
        const {"file": mimeFile, "data":txt} = await this.readEntryWithName("mimetype")
        this.mimeFile = mimeFile;
        if (txt !=  "application/epub+zip") {
            this.error("Unsupported mime type");
            return;
        }

        this.getRootFiles();
    }

    /**
     *  EPub#getRootFiles() -> undefined
     *
     *  Looks for a "meta-inf/container.xml" file and searches for a
     *  rootfile element with mime type "application/oebps-package+xml".
     *  On success, calls the rootfile parser
     **/
    async getRootFiles() {
        this.containerFile = await this.readEntryWithName("meta-inf/container.xml")
        const data = this.containerFile.data.toString("utf-8").toLowerCase().trim()
        const {container} = this.xml2js(data)
        if (!container.rootfiles || !container.rootfiles.rootfile) {
            this.error("No rootfiles found")
            return;
        }

        const rootFile = container.rootfiles.rootfile

        const {"full-path": fullPath, "media-type": mediaType} = rootFile._attributes;

        if (mediaType != "application/oebps-package+xml") {
            this.error("Invalid mime type for " + fullPath)
        }

        this.rootFileName = fullPath
        this.rootPath = {
            array :fullPath.split("/"),
            str : "",

            /**
             * 
             * @param {String} filepath 
             * @returns 
             */
            alter(filepath) {
                filepath = filepath
                .replace("../", "")
                .replace(window.location.href, "")
                if (!filepath.startsWith(this.str)) {
                    return this.str + filepath
                }
                return filepath
            }
        }
        this.rootPath.array.pop()
        this.rootPath.str = this.rootPath.array.join("/") + "/"
        this.handleRootFile();
    }

    /**
     * Converts text to Object
     * @param {String} data 
     * @returns convert.elementCompact
     */
    xml2js(data) {
        return convert.xml2js(data, {compact: true, spaces: 4})
    }
    async handleRootFile() {
        const {data} = await this.readEntryWithName(this.rootFileName)
        const xml = this.xml2js(data)
        this.rootXML = xml
        this.emit("parsed-root")
    }

    /**
     * 
     * @param {Object} rootXML 
     * @param {Object} rootXML.package.guide
     * @param {Object} rootXML.package.manifest
     * @param {Object} rootXML.package.metadata
     * @param {Object} rootXML.package.spine
     * @param {Object} rootXML.package._attributes
     */
    async parseRootFile(rootXML) {
        console.log("ROOTXML: ", rootXML);
        const { 
            "guide": guide, 
            "manifest": manifest, 
            "metadata": metadata, 
            "spine": spine, 
            "_attributes":attr
        } = rootXML.package
        this.version = attr.version || '2.0';
        this.parseMetadata(metadata)
        /* this.parseGuide(guide) */
        this.parseManifest(manifest)
        this.parseSpine(spine)
        this.parseTOC().then(() => {
            this.emit("loaded")
        })
    }

    /**
     *  EPub#parseGuide() -> undefined
     *
     *  Parses "guide" block which has the locations of the fundamental structural components of the publication
     **/
    /**
     * 
     * @param {Object} guide 
     * @param {Object} guide.reference
     */
    parseGuide(guide) {
        console.log("R-guide: ", guide);
        //Todo: Analyze old func
        /* console.log("Guide: ", guide); */

        if (!guide.reference) {
            this.error("No guide!")
        }

        guide.reference = this.toArray(guide.reference)

        for(const reference of guide.reference) {
            const element = reference._attributes;

            element.href = this.rootPath.alter(element.href)
            this.guide.push(element);
        }

        this.emit("parsed-guide")
    }

    /**
     * 
     * @param {Array} manifest 
     */
    parseManifest(manifest) {
        for(const item of manifest.item) {
            const element = item._attributes
            element.href = this.rootPath.alter(element.href)

            this.manifest[element.id] = element
        }
        this.emit("parsed-manifest")
    }

    /**
     * 
     * @param {Object} spine 
     */
    parseSpine(spine) {
        this.spine = Object.assign(
            this.spine, 
            spine._attributes
        )

        if (spine.itemref) {
            spine.itemref = this.toArray(spine.itemref)
            for (const {_attributes} of spine.itemref) {
                const element = Object.assign({}, this.manifest[_attributes.idref] )
                this.spine.contents.push(element)
            }
        }
        this.flow = this.spine.contents;
        this.emit("parsed-spine")
    }

    /**
     * @param {String} txt 
     * @returns String: the UUID
     * 
     * Helper function for parsing metadata
     */
    extractUUID(txt) {
        txt = txt.toLowerCase()
        let parts = txt.split(":")
        if (parts.includes("uuid")) {
            return parts[parts.length - 1];
        }
    
        return ""
    }
    /**
     * 
     * @param {Object} metadata 
     */
    parseMetadata(metadata) {
        //console.log("MD-B:", metadata);
        
        for(const [k,v] of Object.entries(metadata)) {
            const keyparts = k.split(":");
            const key = (keyparts[keyparts.length-1] || "").toLowerCase().trim();
            const text = v._text
            switch (key) {
                case "publisher":
                    this.metadata.publisher = text
                    break;
                case "language":
                    this.metadata.language = text
                    break;
                case "title":
                    this.metadata.title = text
                    break;
                case "subject":
                    this.metadata.subject = text
                    break;
                case "description":
                    this.metadata.description = text
                    break;
                case "creator":
                    if (Array.isArray(v)) {
                        this.metadata.creator = v.map(item => {
                            return item._text
                        }).join(" | ")
                    } else {
                        this.metadata.creator = text
                    }
                    break;
                case "date":
                    this.metadata.date = text
                    break;
                case "identifier":
                    if(Array.isArray(v)) {
                        this.metadata.UUID = this.extractUUID(v[0]._text)
                    } else if (v["opf:scheme"] == "ISBN") {
                        this.metadata.ISBN = text;
                    } else {
                        this.metadata.UUID = this.extractUUID(text)
                    }
                    
                    break;
            }
        }

        this.emit("parsed-metadata")
    }

    /**
     * There are 2 ways to determine the TOC:
     * 1. With an ncx file that is required in EPUB2
     * 2. With toc.xhtml
     * Since NCX is not required in EPUB3 use option 2.
     * Read : https://docs.fileformat.com/ebook/ncx/
     */
    async parseTOC() {
        const hasNCX = Boolean(this.spine.toc)
        let tocElem;
        if (hasNCX) {
            tocElem = this.manifest[this.spine.toc]
        } else {
            tocElem = this.manifest["toc"]
        }

        const IDs = {};
        for (const [k, v] of Object.entries(this.manifest)) {
            IDs[v.href] = k
        }
        const {data} = await this.readEntryWithName(tocElem.href)
        if(!data) {
            this.emit("No TOC!!!")
        }
        const xml = this.xml2js(data)

        if (hasNCX) {
            const path = tocElem.href.split("/")
            path.pop();
            this.toc = this.walkNavMap({
                "branch": xml.ncx.navMap.navPoint,
                "path" : path, 
                "IDs": IDs
            })
        } else {
            this.walkTOC(xml)
        }
        this.emit("parsed-toc")
    }

    /**
     * 
     * @param {convert.CompactElement} xml 
     */
    walkTOC(xml) {
        //Keep only body
        const {body} = xml.html
        console.log("TOC body", body);
        let order = 0;
        const IDs = {}

        for (const p of body.p) {
            let _id = p._attributes.id
            _id = _id.replace(/toc(-|:)/i, "").trim()
            let title = p.a._text;
            if (!this.manifest[_id]) {
                continue
            }

            const element = this.manifest[_id];
            element.title = title;
            element.order = order++;

            this.toc.push(element)
        }

        console.log("OPF", this.toc);
    }

        /**
     *  EPub#parseTOCNCX() -> undefined
     *
     *  Parses ncx file for table of contents (title, html)
     **/
    async parseTOCWithNCX() {
        const IDs = {},
                tocElem = this.manifest[this.spine.toc],
                path = tocElem.href.split("/")
                
            path.pop();
            for (const [k, v] of Object.entries(this.manifest)) {
                IDs[v.href] = k
            }
            const {file, data} = await this.readEntryWithName(tocElem.href)
            if(!data) {
                this.emit("No TOC!!!")
            }
            const xml = this.xml2js(data)
            this.toc = this.walkNavMap({
                "branch": xml.ncx.navMap.navPoint,
                "path" : path, 
                "IDs": IDs
            })
        }

    /**
     *  Walks the NavMap object through all levels and finds elements
     *  for TOC with NCX
     * @param {Object} obj
     * @param {Array | Object} obj.branch
     * @param {Array} obj.path
     * @param {Number} obj.level
     * @returns {Array}
     */
    walkNavMap({branch, path, IDs, level = 0}) {
        // don't go too deep
        if (level > 7) {
            return [];
        }

        const output = [];
        for (const part of this.toArray(branch)) {
            let title = "";
            if(part.navLabel) {
                title = (part.navLabel.text._text || part.navLabel).trim() || ""
            }

            let order = Number(part._attributes.playOrder || 0)
            if (isNaN(order)) {
                order = 0;
            }

            let href = part.content._attributes.src
            if (typeof href == "string") {
                href = href.trim();
            }

            let element = {
                level: level,
                order: order,
                title: title
            };

            if (href) {
                element.href = path.concat([href]).join("/");

                if (IDs[element.href]) {
                    // link existing object
                    element = this.manifest[IDs[element.href]];
                    element.title = title;
                    element.order = order;
                    element.level = level;

                } else {
                    // use new one
                    element.id = (part._attributes.id || "").trim();
                }

                output.push(element);
            }

            if (part.navPoint) {
                output.push(...this.walkNavMap(part.navPoint, path, IDs, level + 1));
            }
        }

        return output;
    }

    toArray(variable) {
        //Sep from class
        return (Array.isArray(variable)) ? variable: [variable]
    }

    /**
    *  EPub#getContent(id, callback) -> undefined
    *  Gets the text from a file based on id. 
    * Replaces image and link URL's
    * and removes <head> etc. elements. 
    * @param {String} id :Manifest id of the file
    * @returns {Promise<String>} : Chapter text for mime type application/xhtml+xml
    */
     async getContent(id) {
        const isCached = Boolean(Object.keys(this.datacache).includes(id))
        if (isCached) {
            return {str:this.datacache[id], isCached:isCached}
        }

        let str = await this.getContentRaw(id);
    
        // remove linebreaks (no multi line matches in JS regex!)
        str = str.replace(/\r?\n/g, "\u0000");

         // keep only <body> contents
        str.replace(/<body[^>]*?>(.*)<\/body[^>]*?>/i, (o, d) => {
            str = d.trim();
        });

        const frag = document.createElement("div");
        frag.innerHTML =  str;
        const removeChildsWith = () => {
            for(const selector of arguments) {
                for (const child of frag.querySelectorAll(selector)) {
                    children.parentNode.removeChild(child)
                }
            }
        }

        removeChildsWith("script", "style")
        
        const onEvent = /^on.+/i;

        //Test #01
        const d = document.createElement("div")
        d.setAttribute("onclick", "console.log('Test Failed')")
        d.innerText = ""
        frag.firstElementChild.appendChild(d)

        for (const elem of frag.querySelectorAll("*")) {
            for (const {name} of elem.attributes) {
                if (onEvent.test(name)) {
                    elem.removeAttribute(name)
                }
            }
        }

        if(d.hasAttribute("onclick")) {
            console.log("Test 01 failed");
        } else {
            d.parentNode.removeChild(d)
        }

        //Replace SVG <image> with <img>
        for (const svg of frag.querySelectorAll("svg")) {
            const image = svg.querySelector("image")
            const img = new Image();
            img.dataset.src = image.getAttribute("xlink:href")
            svg.parentNode.replaceChild(img, svg)
        }

        for (const img of frag.querySelectorAll("img")) {
            const src = this.rootPath.alter(img.src || img.dataset.src)
            img.src = ""
            for(const elem of Object.values(this.manifest)) {
                //The data-src will be used as the arg of the Epub.getImage()
                if (elem.href == src) {
                    img.dataset.src = elem.id
                }
            }
        }

        str = frag.innerHTML

        this.datacache[id] = str
        return {str:str, isCached: isCached}
     }

     /**
     *  EPub#getContentRaw(id, callback) -> undefined
     * @param {String} id :Manifest id value for the content
     * @returns {Promise<String>} : Raw Chapter text for mime type application/xhtml+xml
     **/
    async getContentRaw(id) {
        if (!this.manifest[id]) {
            return ""
        }
        const allowedMIMETypes = /^(application\/xhtml\+xml|image\/svg\+xml)$/i;
        const elem = this.manifest[id]

        let match = allowedMIMETypes.test(elem["media-type"])
        if (!match) {
            this.error("Invalid mime type for chapter")
        }

        return (await this.readEntryWithName(elem.href)).data;
    }


    /**
     *  Return only images with mime type image
     * @param {String} id of the image file in the manifest
     * @param {Function} cb callback
     * @returns {Promise<Blob>} Returns a promise of the image as a blob if it has proper mime type.
     */
    async getImage(id, cb = result => {console.log(result)}) {
        if (!this.manifest[id]) {
            return ""
        }

        if(this.imagecache[id]) {
            console.log("IMG from cache");
            cb(this.imagecache[id])
        }

        const imageType = /^image\//i;
        const m = this.manifest[id]["media-type"]
        let match = imageType.test(m.trim())

        if (!match) {
            console.log("Warning: Invalid mime type for image!");
            return "";
        }

        const {"data": b} = await this.readEntryWithName(this.manifest[id].href, "blob")
        const r = new FileReader();
        r.onload = () => {
            this.imagecache[id] = r.result
            cb(r.result)
        }
        r.readAsDataURL(b)
        return r
    }

    /**
     *  EPub#hasDRM() -> boolean
     *
     *  Parses the tree to see if there's an ecnryption file, signifying the presence of DRM
     *  see: https://stackoverflow.com/questions/14442968/how-to-check-if-an-epub-file-is-drm-protected
     **/
    hasDRM () {
        const drmFile = 'META-INF/encryption.xml';
        return Boolean(this.getFileInArchive(drmFile));
    }

    updateCache(id, text) {
        this.datacache[id]= text;
    }
}

export default Epub