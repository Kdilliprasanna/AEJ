const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

async function generateExcelReport(testResults, platform) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(`${platform} Test Report`);
  
  sheet.columns = [
    { header: 'Test ID', key: 'id', width: 12 },
    { header: 'Platform', key: 'platform', width: 20 },
    { header: 'Test Case Name', key: 'name', width: 50 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Duration (ms)', key: 'duration', width: 18 },
    { header: 'Timestamp', key: 'timestamp', width: 25 },
  ];

  // Formatting headers
  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, size: 12 };
  headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD3D3D3' } };

  // Only Passed test cases as requested
  const passedTests = testResults.filter(t => t.status === 'Passed');

  passedTests.forEach((test, index) => {
    const row = sheet.addRow({
      id: `TC-${index + 1}`,
      platform: platform,
      name: test.name,
      status: test.status,
      duration: test.duration,
      timestamp: new Date().toISOString()
    });
    row.getCell('status').font = { color: { argb: 'FF008000' }, bold: true }; // Green for passed
  });

  const reportsDir = path.join(__dirname, '../../test-reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  const filePath = path.join(reportsDir, `${platform}_Passed_Tests_Report.xlsx`);
  await workbook.xlsx.writeFile(filePath);
  console.log(`✅ Excel Report Generated for Passed Test Cases: ${filePath}`);
}

module.exports = { generateExcelReport };
