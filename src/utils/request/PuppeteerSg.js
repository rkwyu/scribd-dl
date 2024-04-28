import puppeteer from 'puppeteer'

class PuppeteerSg {
  constructor() {
    if (!PuppeteerSg.instance) {
      PuppeteerSg.instance = this;
      process.on('exit', () => {
        this.close();
      });
    }
    return PuppeteerSg.instance;
  }

  /**
   * Launch a browser
   */
  async launch() {
    this.browser = await puppeteer.launch({
      headless: "new",
      defaultViewport: null,
    });
  }

  /**
   * New a page
   * @param {string} url 
   * @returns 
   */
  async getPage(url) {
    if (!this.browser) {
      await this.launch()
    }
    let page = await this.browser.newPage()
    await page.goto(url, {
      waitUntil: "load",
    })
    return page
  }

  /**
   * Close the browser
   */
  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

export const puppeteerSg = new PuppeteerSg()
