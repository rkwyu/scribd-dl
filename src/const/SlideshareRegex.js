const DOMAIN = /^https:\/\/www\.slideshare\.net/
const SLIDESHOW = /^https:\/\/www\.slideshare\.net\/slideshow\/([a-zA-z0-9_-]+)\/([0-9]+)/
const PPT = /^https:\/\/www\.slideshare\.net\/[a-zA-z0-9_-]+\/([a-zA-z0-9_-]+)/
const CDN = /(https:\/\/image\.slidesharecdn\.com\/[a-zA-z0-9_-]+\/[0-9]+\/[a-zA-z0-9_-]+-)[0-9]+-([0-9]+)(.[a-zA-Z]+)\ ([0-9]+)w/g

export { DOMAIN, SLIDESHOW, PPT, CDN }
