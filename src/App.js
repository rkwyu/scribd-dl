import { scribdDownloader } from "./service/ScribdDownloader.js"
import * as scribdRegex from "./regex/ScribdRegex.js"

class App {
    constructor() {
        if (!App.instance) {
            App.instance = this
        }
        return App.instance
    }

    async execute(url) {
        if (url.match(scribdRegex.DOMAIN)) {
            await scribdDownloader.execute(url)
        } else {
            throw new Error(`Unsupported URL: ${url}`)
        }
    }
}

export const app = new App()