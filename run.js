import { app } from './src/App.js'
import * as scribdFlag  from './src/const/scribdFlag.js'

const flags = [scribdFlag.DEFAULT, scribdFlag.IMAGE]

if (process.argv.length >= 3) {
    let url;
    let flag;
    for (let i = 2; i < process.argv.length; i++) {
        if (flags.includes(process.argv[i])) {
            flag = process.argv[i]
        } else {
            url = process.argv[i]
        }
    }
    await app.execute(url, flag)
} else {
    console.error(`
Usage: npm start [options] url
Options:  
  /d            default: generated by chromium's print function
  /i        image-based: generated by image snapshots taken for pages
    `)
}