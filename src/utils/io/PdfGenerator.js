import { promises as fs } from 'fs'
import { PDFDocument } from 'pdf-lib';

// eslint-disable-next-line
import { Image } from '../../object/Image.js'

/**
 * Singleton PDF generator using pdf-lib
 */
class PdfGenerator {
    constructor() {
        if (!PdfGenerator.instance) {
            PdfGenerator.instance = this
        }
        return PdfGenerator.instance
    }

    /**
     * Generate PDF from images
     * @param {Image[]} images - Array of Image objects with .path, .width, .height
     * @param {string} outputPath - Destination path for the generated PDF
     * @throws {Error} If no images, file not found, or unsupported format
     */
    async generate(images, outputPath) {
        if (!images?.length) {
            throw new Error("no images provided");
        }
        const pdfDoc = await PDFDocument.create();
        for (const { path, width, height } of images) {
            // read image file
            let imageBytes;
            try {
                imageBytes = await fs.readFile(path);
            } catch (err) {
                throw new Error(`Failed to read image: ${path} — ${err.message}`);
            }
            
            // embed image based on its format
            const ext = path.split('.').pop().toLowerCase();
            let embedImage;
            if (['jpg', 'jpeg'].includes(ext)) {
                embedImage = await pdfDoc.embedJpg(imageBytes);
            } else if (ext === 'png') {
                embedImage = await pdfDoc.embedPng(imageBytes);
            } else {
                throw new Error(`Unsupported image format: ${ext}`);
            }

            // add a new page with the image
            const page = pdfDoc.addPage([width, height]);
            page.drawImage(embedImage, {
                x: 0,
                y: 0,
                width,
                height,
            });
        }
        try {
            const pdfBytes = await pdfDoc.save();
            await fs.writeFile(outputPath, pdfBytes);
            console.log(`Generated: ${outputPath}`);
        } catch (err) {
            throw new Error(`Failed to save PDF: ${outputPath} — ${err.message}`);
        }
    }

    /**
     * Merge PDFs to a single PDF
     * @param {string[]} inputPdfPaths Path of input PDFs to merge
     * @param {string} outputPath Path to save the merged PDF
     */
    async merge(inputPdfPaths, outputPath) {
        if (inputPdfPaths.length === 0) {
            throw new Error("no PDFs provided");
        }
        const merged = await PDFDocument.create();
        for (const pdfPath of inputPdfPaths) {
            const pdfBytes = await fs.readFile(pdfPath);
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const copiedPages = await merged.copyPages(pdfDoc, pdfDoc.getPageIndices());
            copiedPages.forEach(page => merged.addPage(page));
        }
        const mergedBytes = await merged.save();
        await fs.writeFile(outputPath, mergedBytes);
        console.log(`Merged: ${outputPath}`);
    }
}

export const pdfGenerator = new PdfGenerator()
