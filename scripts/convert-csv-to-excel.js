import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const csvPath = path.join(rootDir, 'omniconverter-keyword-strategy-plan.csv');
const excelPath = path.join(rootDir, 'omniconverter-keyword-strategy-plan.xlsx');
const downloadsExcelPath = 'C:\\Users\\NDCOM\\Downloads\\omniconverter-keyword-strategy-plan.xlsx';

console.log('Reading CSV from:', csvPath);
const csvContent = fs.readFileSync(csvPath, 'utf8');

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  const rows = [];
  for (const line of lines) {
    const row = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',' && !inQuotes) {
        row.push(current);
        current = '';
      } else {
        current += c;
      }
    }
    row.push(current);
    rows.push(row);
  }
  return rows;
}

const allData = parseCsv(csvContent);
const headers = allData[0];
const dataRows = allData.slice(1);

console.log(`Parsed ${dataRows.length} data rows with ${headers.length} columns.`);

// Create WorkBook
const wb = XLSX.utils.book_new();

// Helper to create styled sheet with auto column widths
function createWorkSheet(headers, rows) {
  const aoa = [headers, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(aoa);

  // Set column widths
  const colWidths = headers.map((h, colIdx) => {
    let maxLen = h.length;
    for (let r = 0; r < Math.min(rows.length, 500); r++) {
      const val = rows[r][colIdx] ? String(rows[r][colIdx]) : '';
      if (val.length > maxLen) {
        maxLen = val.length;
      }
    }
    return { wch: Math.min(Math.max(maxLen + 2, 12), 60) };
  });
  ws['!cols'] = colWidths;

  // Auto-filter on first row
  const ref = XLSX.utils.encode_range({
    s: { r: 0, c: 0 },
    e: { r: rows.length, c: headers.length - 1 }
  });
  ws['!autofilter'] = { ref };

  return ws;
}

// Sheet 1: Unique Pillar Articles to Write (Zero Duplicates, Zero Published)
const pillarRows = dataRows.filter(r => r[3] === 'New High-Priority Blog Post');
const wsPillars = createWorkSheet(headers, pillarRows);
XLSX.utils.book_append_sheet(wb, wsPillars, 'Unique Articles to Write');

// Sheet 2: P1 Quick Wins (Top ROI High Volume / Low KD Calculation Queries)
const p1Rows = pillarRows.filter(r => r[8].includes('P1'));
const wsP1 = createWorkSheet(headers, p1Rows);
XLSX.utils.book_append_sheet(wb, wsP1, 'P1 Quick Wins');

// Sheet 3: LSI & Semantic Support Variants
const lsiRows = dataRows.filter(r => r[3] === 'Supporting LSI / Semantic Variant');
const wsLsi = createWorkSheet(headers, lsiRows);
XLSX.utils.book_append_sheet(wb, wsLsi, 'LSI & FAQ Variants');

// Sheet 4: Category Summary / Overview
const catSummary = {};
pillarRows.forEach(r => {
  const cat = r[1];
  catSummary[cat] = (catSummary[cat] || 0) + 1;
});
const summaryHeaders = ['Category', 'Unique Pillar Articles to Write', 'Associated Core Tool Page'];
const summaryRows = Object.entries(catSummary).map(([cat, count]) => {
  const toolLink = dataRows.find(r => r[1] === cat)?.[9] || '';
  return [cat, count, toolLink];
});
const wsSummary = createWorkSheet(summaryHeaders, summaryRows);
XLSX.utils.book_append_sheet(wb, wsSummary, 'Category Overview');

// Sheet 5: Master Plan (All Unpublished 5,258 rows)
const wsMaster = createWorkSheet(headers, dataRows);
XLSX.utils.book_append_sheet(wb, wsMaster, 'All Unpublished Plan');

// Write Excel File (.xlsx)
XLSX.writeFile(wb, excelPath);
console.log('Successfully written Excel file to:', excelPath);

// Copy to user Downloads
try {
  fs.copyFileSync(excelPath, downloadsExcelPath);
  console.log('Successfully copied Excel file to Windows Downloads:', downloadsExcelPath);
} catch (err) {
  console.warn('Could not copy to Downloads:', err.message);
}

const fileStat = fs.statSync(excelPath);
console.log(`Excel file generated: ${fileStat.size} bytes (${(fileStat.size / 1024 / 1024).toFixed(2)} MB)`);
