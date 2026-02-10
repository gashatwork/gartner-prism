import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const XLSX = require('xlsx');
const { join, dirname } = require('path');
const { fileURLToPath } = require('url');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = join(__dirname, '../Gartner_Use_Case_Prism_Template_732696.xlsx');

console.log('Reading file:', filePath);

try {
    const workbook = XLSX.readFile(filePath);
    console.log('Sheet Names:', JSON.stringify(workbook.SheetNames));

    workbook.SheetNames.forEach(sheetName => {
        console.log(`\n--- Inspecting Sheet: ${sheetName} ---`);
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

        console.log(`Total Rows: ${data.length}`);

        let foundContent = false;
        let printedRows = 0;

        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            const hasContent = row.some(cell => cell !== '' && cell !== null && cell !== undefined);

            if (hasContent) {
                console.log(`Row ${i}:`, JSON.stringify(row));
                printedRows++;
                foundContent = true;
                if (printedRows >= 5) break;
            }
        }

        if (!foundContent) {
            console.log('No content found in this sheet.');
        }
    });

} catch (error) {
    console.error('Error reading file:', error);
}
