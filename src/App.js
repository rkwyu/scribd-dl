import { scribdDownloader } from "./service/ScribdDownloader.js"
import * as scribdRegex from "./const/ScribdRegex.js"

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
        } else {
            throw new Error(`Unsupported URL: ${url}`)
        }
    }
}

export const app = new App()