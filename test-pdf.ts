import { marked } from 'marked'
import { JSDOM } from 'jsdom'
import htmlToPdfmake from 'html-to-pdfmake'
import PdfPrinter from 'pdfmake'

async function run() {
  const markdownContent = '# Test\nThis is a *test* document.\n- Item 1\n- Item 2'
  const html = await marked.parse(markdownContent)
  const { window } = new JSDOM('')
  const pdfMakeContent = htmlToPdfmake(html, { window })

  const fonts = {
    Helvetica: {
      normal: 'Helvetica',
      bold: 'Helvetica-Bold',
      italics: 'Helvetica-Oblique',
      bolditalics: 'Helvetica-BoldOblique'
    }
  }

  const printer = new PdfPrinter(fonts)
  const docDefinition = {
    content: pdfMakeContent,
    defaultStyle: {
      font: 'Helvetica'
    }
  }

  const pdfDoc = printer.createPdfKitDocument(docDefinition)
  
  const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    pdfDoc.on('data', (chunk) => chunks.push(chunk));
    pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
    pdfDoc.on('error', reject);
    pdfDoc.end();
  });

  console.log('PDF size:', pdfBuffer.length)
}

run().catch(console.error)
