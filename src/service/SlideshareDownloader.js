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


const output = configLoader.load("DIRECTORY", "output")

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
        let dir = `${output}/${id}`
        await directoryIo.create(dir)

        // navigate to slideshare
        let page = await puppeteerSg.getPage(url)

        // wait rendering
        await new Promise(resolve => setTimeout(resolve, 1000))

        // get the page number
        let span = await page.$("span[data-cy='page-number']")
        let pageNumber = parseInt((await span.evaluate((el) => el.textContent)).split("of")[1])

        // get the highest resolution
        let image0 = await page.$("img#slide-image-0")
        let srcset0 = await image0.evaluate((el) => el["srcset"])
        let prefix = ""
        let suffix = ""
        let resolution = -1
        let matches
        while ((matches = slideshareRegex.CDN.exec(srcset0)) != null) {
            if (resolution < parseInt(matches[4])) {
                prefix = matches[1]
                suffix = matches[3]
                resolution = parseInt(matches[4])
            }
        }

        // download images
        let images = []
        const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
        bar.start(pageNumber, 0);
        for (let i = 0; i < pageNumber; i++) {
            let path = `${dir}/${(i + 1).toString().padStart(4, 0)}.png`

            // convert the webp (even it shows jpg) to png
            const resp = await axios.get(
                `${prefix}${i + 1}-${resolution}${suffix}`,
                { responseType: 'arraybuffer' }
            )
            const imageBuffer = await sharp(resp.data).toFormat('png').toBuffer();
            fs.writeFileSync(path, Buffer.from(imageBuffer, 'binary'))

            let metadata = await sharp(path).metadata()
            images.push(new Image(
                path,
                metadata.width,
                metadata.height
            ))
            bar.update(i + 1);
        }
        bar.stop();

        // generate pdf
        await pdfGenerator.generate(images, `${output}/${id}.pdf`)

        // remove temp dir
        directoryIo.remove(`${output}/${id}`)

        await page.close()
        await puppeteerSg.close()
    }
}

export const slideshareDownloader = new SlideshareDownloader()