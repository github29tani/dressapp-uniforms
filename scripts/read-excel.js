const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Read the Excel file
const workbook = XLSX.readFile(path.join(__dirname, '../DressApp_Product.xlsx'));

// Get the first sheet
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert to JSON
const data = XLSX.utils.sheet_to_json(worksheet);

// Pretty print the data
console.log(JSON.stringify(data, null, 2));

// Also save to a JSON file
fs.writeFileSync(
  path.join(__dirname, '../products-data.json'),
  JSON.stringify(data, null, 2)
);

console.log('\n✅ Data extracted and saved to products-data.json');
console.log(`📊 Total products: ${data.length}`);
