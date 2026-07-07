import fs from "fs/promises";
import path from "path";
import { PDFDocument, PDFName, PDFString } from 'pdf-lib';

export async function loadPDFPath(pdf_path: string): Promise<Uint8Array> {
    const buf = await fs.readFile(pdf_path);
    return new Uint8Array(buf);
};
export async function loadPDFLink(pdf_link: string): Promise<Uint8Array> {
    const res = await fetch(pdf_link);
    const buf = await res.arrayBuffer();
    return new Uint8Array(buf);
};

export async function inject_pdf(
    pdf_content: Uint8Array | ArrayBuffer,
    output_pdf_path: string,
    js_code: string,
    files_attached?: string[]
    ) {
    const pdfDoc = await PDFDocument.load(pdf_content);
    const context = pdfDoc.context;

    const actionRef = context.register(context.obj({
        Type: PDFName.of("Action"),
        S: PDFName.of("JavaScript"),
        JS: PDFString.of(js_code)
    }));

    if (files_attached) {
        const files = (await Promise.all(files_attached.map((f) => fs.readFile(f)))).map((f) => new Uint8Array(f));
        for (let i = 0; i < files.length; i++) {
            await pdfDoc.attach(files[i]!, path.basename(files_attached[i]!))
        }
        
    };

    pdfDoc.catalog.set(PDFName.of("OpenAction"), actionRef)

    const out = await pdfDoc.save()
    await fs.writeFile(output_pdf_path, out);
};
