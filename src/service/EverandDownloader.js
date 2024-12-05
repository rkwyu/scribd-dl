import cliProgress from "cli-progress"
import { puppeteerSg } from "../utils/request/PuppeteerSg.js";
import { pdfGenerator } from "../utils/io/PdfGenerator.js";
import { configLoader } from "../utils/io/ConfigLoader.js";
import { directoryIo } from "../utils/io/DirectoryIo.js"
import * as everandRegex from "../const/EverandRegex.js"
import { Image } from "../object/Image.js"
import sharp from "sharp";
import axios from "axios";
import fs from "fs"


const output = configLoader.load("DIRECTORY", "output")

class EverandDownloader {
    constructor() {
        if (!EverandDownloader.instance) {
            EverandDownloader.instance = this
        }
        return EverandDownloader.instance
    }

    async execute(url) {
        if (url.match(everandRegex.PODCAST_SERIES)) {
            await this.series(url, )
        } else if (url.match(everandRegex.PODCAST_EPISODE)) {
            await this.listen(`https://www.everand.com/listen/podcast/${everandRegex.PODCAST_EPISODE.exec(url)[1]}`)
        } else if (url.match(everandRegex.PODCAST_LISTEN)) {
            await this.listen(url)
        } else {
            throw new Error(`Unsupported URL: ${url}`)
        }
    }

    async listen(url, isEpisode) {
        if (typeof isEpisode === "undefined") {
            isEpisode = true
        }

        const episodeId = everandRegex.PODCAST_LISTEN.exec(url)[1]

        // navigate to everand
        let page = await puppeteerSg.getPage(url)

        // wait rendering
        await new Promise(resolve => setTimeout(resolve, 1000))

        // get title, audio-url, series-url
        const title = await page.evaluate(() => eval('Scribd.current_doc.short_title'))
        const audioUrl = await page.evaluate(() => document.querySelector('audio#audioplayer').src)
        const seriesUrl = await page.evaluate(() => document.querySelector('a[href^="https://www.everand.com/podcast-show/"]').href)

        // prepare output dir
        let seriesId = everandRegex.PODCAST_SERIES.exec(seriesUrl)[1]
        let dir = `${output}/${seriesId}`
        await directoryIo.create(dir)

        // download audio
        const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
        if (isEpisode) {
            bar.start(1, 0)
        }
        let path = `${dir}/${episodeId}_${title}.mp3`
        const resp = await axios.get(audioUrl, { responseType: 'stream' })
        resp.data.pipe(fs.createWriteStream(path))
        if (isEpisode) {
            bar.update(1)
            bar.stop()
        }

        await page.close()
        if (isEpisode) {
            await puppeteerSg.close()
        }
    }

    async series(url) {
        const seriesId = everandRegex.PODCAST_SERIES.exec(url)[1]

        // navigate to everand
        let page = await puppeteerSg.getPage(url)

        // wait rendering
        await new Promise(resolve => setTimeout(resolve, 1000))

        // get number-of-episodes
        const totalEpisode = await page.evaluate(() => parseInt(document.querySelector('span[data-e2e="podcast-series-header-total-episodes"]').textContent.replace("episodes", "").trim()))

        // get pages
        const totalPage = await page.evaluate(() => [...document.querySelectorAll('div[data-e2e="pagination"] a[aria-label^="Page"]')].at(-1).textContent)
        const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic)
        bar.start(totalEpisode, 0)
        for (let i = 1; i <= totalPage; i++) {
            await page.goto(`${url}?page=${i}&sort=desc`, { waitUntil: "load" })
            await new Promise(resolve => setTimeout(resolve, 1000))

            let episodes = await page.evaluate(() => [...document.querySelectorAll('div.breakpoint_hide.below a[data-e2e="podcast-episode-player-button"]')].map(x => x.href))
            for (let j = 0; j < episodes.length; j++ ) {
                await this.listen(episodes[j], false)
                bar.update(((i - 1) * 10) + (j + 1))
            }
        }
        bar.stop()

        await page.close()
        await puppeteerSg.close()
    }
}

export const everandDownloader = new EverandDownloader()