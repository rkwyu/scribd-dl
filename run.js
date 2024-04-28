import { app } from './src/App.js'

if (process.argv.length == 3) {
    await app.execute(process.argv[2])
} else {
    console.error(`Usage: npm start [URL]`)
}