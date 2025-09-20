import cliProgress from "cli-progress"
import { puppeteerSg } from "../utils/request/PuppeteerSg.js";
import { pdfGenerator } from "../utils/io/PdfGenerator.js";
import { configLoader } from "../utils/io/ConfigLoader.js";
import { directoryIo } from "../utils/io/DirectoryIo.js"
import * as slideshareRegex from "../const/SlideshareRegex.js"
import { Image } from "../object/Image.js"
import sharp from "sharp";
import axios from "axios";
import fs from "fs"
import sanitize from "sanitize-filename";


const output = configLoader.load("DIRECTORY", "output")
const filename = configLoader.load("DIRECTORY", "filename")

class SlideshareDownloader {
    constructor() {
        if (!SlideshareDownloader.instance) {
            SlideshareDownloader.instance = this
        }
        return SlideshareDownloader.instance
    }

    async execute(url) {
        if (url.match(slideshareRegex.SLIDESHOW)) {
            await this.slideshow(url, slideshareRegex.SLIDESHOW.exec(url)[1])
        } else if (url.match(slideshareRegex.PPT)) {
            await this.slideshow(url, slideshareRegex.PPT.exec(url)[1])
        } else {
            throw new Error(`Unsupported URL: ${url}`)
        }
    }

    async slideshow(url, id) {
        // prepare temp dir
        const dir = `${output}/${id}`
        await directoryIo.create(dir)

        // navigate to slideshare
        const page = await puppeteerSg.getPage(url)

        // wait rendering
        await new Promise(resolve => setTimeout(resolve, 1000))

        // get the title
        const h1 = await page.$("h1.title")
        const title = decodeURIComponent(await h1.evaluate((el) => el.textContent.trim()))

        // get slides images
        const srcs = await page.$$eval("img[id^='slide-image-']", imgs => imgs.map(img => img.src));

        // iterate all images
        const images = []
        const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
        bar.start(srcs.length, 0);
        for (let i = 0; i < srcs.length; i++) {
            const src = srcs[i];
            const path = `${dir}/${(i + 1).toString().padStart(4, '0')}.png`

            // convert the webp (even it shows jpg) to png
            const resp = await axios.get(src, { responseType: 'arraybuffer' })
            const imageBuffer = await sharp(resp.data).toFormat('png').toBuffer();
            fs.writeFileSync(path, Buffer.from(imageBuffer, 'binary'))

            const metadata = await sharp(path).metadata();
            images.push(new Image(path, metadata.width, metadata.height));
            bar.update(i + 1);
        }
        bar.stop();

        // generate pdf
        await pdfGenerator.generate(images, `${output}/${sanitize(filename == "title" ? title : id)}.pdf`)

        // remove temp dir
        directoryIo.remove(`${dir}`)

        await page.close()
        await puppeteerSg.close()
    }
}

export const slideshareDownloader = new SlideshareDownloader()