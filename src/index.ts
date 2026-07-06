import fs from "fs/promises";
import { PDFDocument, PDFName, PDFString } from 'pdf-lib'

async function inject_pdf(
    input_pdf: string | Uint8Array | ArrayBuffer,
    output_pdf: string,
    js_code: string
    ) {
    const pdfDoc = await PDFDocument.load(input_pdf);
    const context = pdfDoc.context;

    const action = context.obj({
        Type: PDFName.of("Action"),
        S: PDFName.of("JavaScript"),
        JS: PDFString.of(js_code)
    });

    pdfDoc.catalog.set(PDFName.of("OpenAction"), action)

    const out = await pdfDoc.save()
    fs.writeFile(output_pdf, out).catch((err) => console.error(err))
        
};

const pdf = await fs.readFile('test.pdf');
const js = `
app.alert("hey you");
app.alert("what");
`
await inject_pdf(pdf, 'out.pdf', js);