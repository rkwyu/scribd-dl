import { scribdDownloader } from "./service/ScribdDownloader.js"
import { slideshareDownloader } from "./service/SlideshareDownloader.js"
import * as scribdRegex from "./const/ScribdRegex.js"
import * as slideshareRegex from "./const/SlideshareRegex.js"

class App {
    constructor() {
        if (!App.instance) {
            App.instance = this
        }
        return App.instance
    }

    async execute(url, flag) {
        if (url.match(scribdRegex.DOMAIN)) {
            await scribdDownloader.execute(url, flag)
        } else if (url.match(slideshareRegex.DOMAIN)) {
            await slideshareDownloader.execute(url)
        } else {
            throw new Error(`Unsupported URL: ${url}`)
        }
    }
}

export const app = new App()