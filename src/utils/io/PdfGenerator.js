import PDFDocument from 'pdfkit'
import fs from 'fs'

// eslint-disable-next-line
import { Image } from '../../object/Image.js'

class PdfGenerator {
    constructor() {
        if (!PdfGenerator.instance) {
            PdfGenerator.instance = this
        }
        return PdfGenerator.instance
    }

    /**
     * Generate a pdf file from `Image`s
     * @param {Image[]} images 
     * @param {string} dest 
     * @returns 
     */
    generate(images, dest) {
        return new Promise((resolve, reject) => {
            if (images.length > 0) {
                const doc = new PDFDocument({ size: [images[0].width, images[0].height] });
                const writeStream = fs.createWriteStream(dest);
                doc.pipe(writeStream);
                for (let page = 1; page <= images.length; page++) {
                    let image = images[page - 1]
                    doc.image(image.path, 0, 0, {
                        fit: [image.width, image.height],
                        align: 'center',
                        valign: 'center'
                    });
                    if (page < images.length) {
                        doc.addPage({ size: [images[page].width, images[page].height] })
                    }
                }
                doc.end();
                writeStream.on('finish', () => {
                    console.log(`Generated: ${dest}`)
                    resolve()
                });
            } else {
                reject("no images")
            }
        });
    }
}

export const pdfGenerator = new PdfGenerator()
