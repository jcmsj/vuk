/* eslint-disable no-unreachable */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
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

        //Todo: Logging
        this.logLevel = logLevel
    }

    error(msg) {
        this.emit("error", new Error(msg));
    }

    /* log(lvl, ...args) {
        if (this.logLevel > 0) {
            if (lvl <= this.logLevel)  {
                console.log(...args)
            }
        }
    } */
    parse() {
        this.containerFile = false;
        this.mimeFile = false;
        this.rootFile = false;

        this.metadata = {};
        this.manifest = {};
        this.guide = [];
        this.spine = {toc: false, contents: []};
        this.flow = [];
        this.toc = [];

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
     * @returns {Object}
     */
    getFileInArchive(name) {
        for (const entry of this.entries) {
            if (entry.filename.toLowerCase() == name.toLowerCase()) {
                return entry;
            }
        }

        this.error(name + " not found in archive!")
        return {};
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
     *  are "application/epub+zip". On success runs root file check.
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
     *  On success calls the rootfile parser
     **/
    async getRootFiles() {
        this.containerFile = await this.readEntryWithName("meta-inf/container.xml")
        let data = this.containerFile.data.toString("utf-8").toLowerCase().trim()
        const {container} = this.xml2js(data)
        if (!container.rootfiles || !container.rootfiles.rootfile) {
            this.error("No rootfiles found")
            return;
        }
        const rootFile = container.rootfiles.rootfile

        const {"full-path": fullPath, "media-type": mediaType} = rootFile._attributes;

        this.rootFileName = fullPath
        this.rootPath = {
            array :fullPath.split("/"),
            str : "",
            alter(filepath) {
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
        /* this.log(2, data) */
        const xml = this.xml2js(data)
        this.rootXML = xml
        this.emit("parsed-root")
        /* this.log(2, xml) */
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
        const { 
            "guide": guide, 
            "manifest": manifest, 
            "metadata": metadata, 
            "spine": spine, 
            "_attributes":attr
        } = rootXML.package
        this.version = attr.version || '2.0';
        this.parseMetadata(metadata)
        this.parseGuide(guide)
        this.parseManifest(manifest)
        this.parseSpine(spine)

        if(this.spine.toc) {
            this.parseTOC().then(() => {
                this.emit("loaded")
            });
        } else {
            this.error("No TOC found!")
        }
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
        //console.log("#Manifest: ", this.manifest)
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
        console.log("Flow: ",this.flow);
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
     *  EPub#parseTOC() -> undefined
     *
     *  Parses ncx file for table of contents (title, html)
     **/
         async parseTOC() {
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
            //console.log("TOC:", this.toc);
    
            this.emit("parsed-toc")
        }

    /**
     *  Walks the NavMap object through all levels and finds elements
     *  for TOC
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
        branch = this.toArray(branch)
        for (const part of branch) {
            let title = "";
            if(part.navLabel) {
                title = (part.navLabel.text._text || part.navLabel).trim() || ""
            }

            let order = Number(part._attributes.playOrder || 0)
            if (isNaN(order)) {
                order = 0;
            }

            let href = part.content._attributes.src
            if (typeof _href == "string") {
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
    *  EPub#getChapter(id, callback) -> undefined
    *  Finds the chapter text for an id. 
    * Replaces image and link URL's
    * and removes <head> etc. elements. 
    * @param {String} id :Manifest id value for a chapter
    * @returns {Promise<String>} : Chapter text for mime type application/xhtml+xml
    */
     async getChapter(id) {
        let str = await this.getChapterRaw(id);
        // remove linebreaks (no multi line matches in JS regex!)
        str = str.replace(/\r?\n/g, "\u0000");

        // keep only <body> contents
        str.replace(/<body[^>]*?>(.*)<\/body[^>]*?>/i, (o, d) => {
            str = d.trim();
        });

        // remove <script> blocks
        str = str.replace(/<script[^>]*?>(.*?)<\/script[^>]*?>/ig, (o, s) => {
            return "";
        });

        // remove <style> blocks
        str = str.replace(/<style[^>]*?>(.*?)<\/style[^>]*?>/ig, (o, s) => {
            return "";
        });

        // remove onEvent handlers
        str = str.replace(/(\s)(on\w+)(\s*=\s*["']?[^"'\s>]*?["'\s>])/g, (o, a, b, c) => {
            return a + "skip-" + b + c;
        });

        // replace images
        str = str.replace(/(\ssrc\s*=\s*["']?)([^"'\s>]*?)(["'\s>])/g, (o, a, b, c) => {
            const imgHREF = this.rootPath.alter(b)

            // include only images from manifest
            for(const elem of Object.values(this.manifest)) {
                //The data-src can be used as the arg of the Epub.getImage()
                if (elem.href == imgHREF) {
                    return `class='book-img' data-src='${elem.id}'`;
                }
            }

            return "";
        });

        return str
     }

     /**
     *  EPub#getChapterRaw(id, callback) -> undefined
     * @param {String} id :Manifest id value for a chapter
     * @returns {Promise<String>} : Raw Chapter text for mime type application/xhtml+xml
     **/
    async getChapterRaw(id) {
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
     *  EPub#getImage(id) -> undefined
     *  - id (String): Manifest id value for an image
     *  - callback (Function): callback function
     *  
     *  Finds an image for an id. 
     *  
     *  Returns the image as a Blob.
     *  Return only images with mime type image
     **/
    async getImage(id, cb = undefined) {
        if (!this.manifest[id]) {
            return ""
        }
        const imageType = /^image\//i;
        const m = this.manifest[id]["media-type"]
        let match = imageType.test(m.trim().toLowerCase())
        if(match) {
            const {"data": b} = await this.readEntryWithName(this.manifest[id].href, "blob")
            const r = new FileReader();
            r.onload = () => {
                if (typeof cb == "function") {
                    cb(r.result)
                }
            }
            r.readAsDataURL(b)
            return r
        }
        else
            this.error("Invalid mime type for image!")
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
}

export default Epub