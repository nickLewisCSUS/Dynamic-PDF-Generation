const { PDFDocument } = require('pdf-lib');
// Create class pdfGenerator
class PdfGenerator {
    async generatePDF(data) { // Async it to create promise for generatePDF
        const pdfDoc = await PDFDocument.create(); // creating PDFDocument
        const page = pdfDoc.addPage(); // Adding the page text goes on
        page.drawText(JSON.stringify(data, null, 4), { // Drawing the text that goes on pdf page
            x: 50,
            y: page.getHeight() - 100, // Position it a bit down from the top of the page
            size: 12, // Adjust text size
        });
        // awaiting until promise is fullfilled and then save the pdf
        const pdfBytes =  await pdfDoc.save()
        return pdfBytes;
    }
}
module.exports = PdfGenerator;