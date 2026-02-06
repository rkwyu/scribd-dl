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
    const isCI = process.env.CI === 'true'; // Detect if running in CI
    const args = [];
    if (isCI) {
      args.push('--no-sandbox', '--disable-setuid-sandbox');
    }
    this.browser = await puppeteer.launch({
      headless: "new",
      defaultViewport: null,
      args,
      timeout: 0,
    });
  }

  /**
   * New a page
   * @param {string} url 
   * @returns 
   */
  async getPage(url, lazyLoad = false) {
    if (!this.browser) {
      await this.launch()
    }
    let page = await this.browser.newPage()
    await page.goto(url, {
      waitUntil: "load",
    })
    if (lazyLoad) {
      await this.autoScroll(page);
    }
    return page
  }

  /**
   * Auto scroll the page to trigger lazy loading
   * @param {object} page - Puppeteer page object
   */
  async autoScroll(page) {
      await page.evaluate(async () => {
          await new Promise(resolve => {
            const delay = 100;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, window.innerHeight * 0.8);
                if (window.innerHeight + window.scrollY >= scrollHeight) {
                  clearInterval(timer);
                  resolve();
                }
            }, delay);
          });
      });

      // Small safety buffer after last scroll
      await page.waitForTimeout(1200);
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
