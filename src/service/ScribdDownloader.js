import cliProgress from "cli-progress"
import { puppeteerSg } from "../utils/request/PuppeteerSg.js";
import { pdfGenerator } from "../utils/io/PdfGenerator.js";
import { configLoader } from "../utils/io/ConfigLoader.js";
import { directoryIo } from "../utils/io/DirectoryIo.js"
import * as scribdRegex from "../const/ScribdRegex.js"
import * as scribdFlag  from '../const/ScribdFlag.js'
import { Image } from "../object/Image.js"
import sharp from "sharp";
import path from 'path'


const output = configLoader.load("DIRECTORY", "output")
const rendertime = parseInt(configLoader.load("SCRIBD", "rendertime"))

class ScribdDownloader {
    constructor() {
        if (!ScribdDownloader.instance) {
            ScribdDownloader.instance = this
        }
        return ScribdDownloader.instance
    }

    async execute(url, flag) {
        let fn;
        if (flag === scribdFlag.IMAGE) {
            console.log(`Mode: IMAGE`)
            fn = this.embeds_image
        } else {
            console.log(`Mode: DEFAULT`)
            fn = this.embeds_default
        }
        if (url.match(scribdRegex.DOCUMENT)) {
            await fn(`https://www.scribd.com/embeds/${scribdRegex.DOCUMENT.exec(url)[2]}/content`)
        } else if (url.match(scribdRegex.EMBED)) {
            await fn(url)
        } else {
            throw new Error(`Unsupported URL: ${url}`)
        }
    }

    async embeds_default(url) {
        const m = scribdRegex.EMBED.exec(url)
        if (m) {
            let id = m[1]

            // navigate to scribd
            let page = await puppeteerSg.getPage(url)

            // wait rendering
            await new Promise(resolve => setTimeout(resolve, 1000))

            // load all pages
            let doc_pages = await page.$$("div.outer_page_container div[id^='outer_page_']")
            const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
            bar.start(doc_pages.length, 0);
            for (let i = 0; i < doc_pages.length; i++) {
                await page.evaluate((i) => { // eslint-disable-next-line
                    document.getElementById(`outer_page_${(i + 1)}`).scrollIntoView()  // eslint-disable-next-line
                    document.getElementById(`outer_page_${(i + 1)}`).style.margin = 0
                }, i)
                await new Promise(resolve => setTimeout(resolve, rendertime))
                bar.update(i + 1);
            }
            bar.stop();

            // pdf setting
            let options = {
                path: `${output}/${id}.pdf`,
                printBackground: true,
            }
            let first_page = await page.$("div.outer_page_container div[id^='outer_page_']")
            let style = await first_page.evaluate((el) => el.getAttribute("style"))
            if (style.includes("width:") && style.includes("height:")) {
                options.height = parseInt(style.split("height:")[1].split("px")[0].trim())
                options.width = parseInt(style.split("width:")[1].split("px")[0].trim())
            }

            // show doc only
            await page.evaluate(() => { // eslint-disable-next-line
                document.body.innerHTML = document.querySelector("div.outer_page_container").innerHTML
            })
            
            await directoryIo.create(path.dirname(options.path))
            await page.pdf(options);
            console.log(`Generated: ${options.path}`)

            await page.close()
            await puppeteerSg.close()
        } else {
            throw new Error(`Unsupported URL: ${url}`)
        }
    }

    async embeds_image(url) {
        let deviceScaleFactor = 2
        const m = scribdRegex.EMBED.exec(url)
        if (m) {
            let id = m[1]

            // prepare temp dir
            let dir = `${output}/${id}`
            await directoryIo.create(dir)

            // navigate to scribd
            let page = await puppeteerSg.getPage(url)

            // wait rendering
            await new Promise(resolve => setTimeout(resolve, 1000))

            // hide blockers
            let doc_container = await page.$("div.document_scroller")
            await doc_container.evaluate((el) => {
                el["style"]["bottom"] = "0px"
                el["style"]["margin-top"] = "0px"
            });
            let doc_toolbar = await page.$("div.toolbar_drop")
            await doc_toolbar.evaluate((el) => el["style"]["display"] = "none");

            // download images
            let doc_pages = await page.$$("div.outer_page_container div[id^='outer_page_']")
            let images = []
            const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
            bar.start(doc_pages.length, 0);
            for (let i = 0; i < doc_pages.length; i++) {
                await page.evaluate((i) => { // eslint-disable-next-line
                    document.getElementById(`outer_page_${(i + 1)}`).scrollIntoView()
                }, i)

                let width = 1191
                let height = 1684
                let style = await doc_pages[i].evaluate((el) => el.getAttribute("style"));
                if (style.includes("width:") && style.includes("height:")) {
                    height = Math.ceil(width * parseInt(style.split("height:")[1].split("px")[0].trim()) / parseInt(style.split("width:")[1].split("px")[0].trim()))
                }
                await page.setViewport({ width: width, height: height, deviceScaleFactor: deviceScaleFactor });

                let path = `${dir}/${(i + 1).toString().padStart(4, 0)}.png`
                await doc_pages[i].screenshot({ path: path });

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
        } else {
            throw new Error(`Unsupported URL: ${url}`)
        }
    }
}

export const scribdDownloader = new ScribdDownloader()