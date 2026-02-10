import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const { fileURLToPath } = require('url');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const excelPath = path.join(__dirname, '../Gartner_Use_Case_Prism_Template_732696.xlsx');
const outputPath = path.join(__dirname, '../src/data/use-cases.json');

console.log('Reading Excel file...');
const workbook = XLSX.readFile(excelPath);

const sheetName = 'Sandbox';
const sheet = workbook.Sheets[sheetName];

if (!sheet) {
    console.error(`Sheet "${sheetName}" not found!`);
    process.exit(1);
}

const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
const useCases = [];

// Sandbox data seems to start at row index 3 (Row 4 in Excel) based on inspection
// Index 0: ID
// Index 1: Name
// Index 2: Feasibility
// Index 3: Business Value
// Index 8: Translated X
// Index 9: Translated Y

for (let i = 3; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length < 2) continue;

    const id = row[0];
    const name = row[1];

    if (!name || name === '0' || name === 0) continue; // Skip empty/zero names

    // Verify it likely has data
    if (typeof row[2] !== 'number' || typeof row[3] !== 'number') continue;

    useCases.push({
        id: String(id),
        name: String(name),
        feasibility: Number(row[2]),
        businessValue: Number(row[3]),
        translatedX: Number(row[8]),
        translatedY: Number(row[9])
    });
}

console.log(`Extracted ${useCases.length} use cases.`);
fs.writeFileSync(outputPath, JSON.stringify(useCases, null, 2));
console.log('Saved to:', outputPath);
