import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const { fileURLToPath } = require('url');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const excelPath = path.join(__dirname, '../Gartner_Use_Case_Prism_Template_732696.xlsx');
const outputPath = path.join(__dirname, '../inspection.txt');

try {
    const workbook = XLSX.readFile(excelPath);
    let output = '';

    output += `Sheet Names: ${JSON.stringify(workbook.SheetNames)}\n\n`;

    workbook.SheetNames.forEach(sheetName => {
        output += `--- SHEET: ${sheetName} ---\n`;
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

        // Dump first 30 rows
        for (let i = 0; i < Math.min(data.length, 30); i++) {
            output += `Row ${i}: ${JSON.stringify(data[i])}\n`;
        }
        output += '\n';
    });

    fs.writeFileSync(outputPath, output);
    console.log('Inspection written to:', outputPath);

} catch (error) {
    console.error('Error:', error);
}
