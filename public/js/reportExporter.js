// DataMineX - Report Exporter Utility
// Generates clean, downloadable academic reports for Numerical Solutions, Practical Labs, and Progress

export const ReportExporter = {
  downloadTextFile(filename, textContent) {
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  exportNumericalSolution(solutionData, rawText = '') {
    let title, algorithm, givenData, formula, steps, finalAnswer, examAnswer, explanation;

    if (typeof solutionData === 'string') {
      algorithm = solutionData;
      title = solutionData;
      steps = rawText || '';
      finalAnswer = 'See complete derivation above.';
      givenData = 'Extracted Problem Input';
    } else if (solutionData && typeof solutionData === 'object') {
      ({ title, algorithm, givenData, formula, steps, finalAnswer, examAnswer, explanation } = solutionData);
    } else {
      algorithm = 'Numerical Solution';
      title = 'DataMineX Solution';
      steps = '';
    }

    const dateStr = new Date().toLocaleString();

    let report = `========================================================================\n`;
    report += `                     DATAMINEX ACADEMIC NUMERICAL REPORT               \n`;
    report += `========================================================================\n`;
    report += `Generated Date: ${dateStr}\n`;
    report += `Algorithm:      ${algorithm || 'Data Mining / Warehousing Algorithm'}\n`;
    report += `Problem Title:  ${title || 'Numerical Problem Solution'}\n`;
    report += `------------------------------------------------------------------------\n\n`;

    if (givenData) {
      report += `[1. GIVEN DATA]\n`;
      report += `${typeof givenData === 'string' ? givenData : JSON.stringify(givenData, null, 2)}\n\n`;
    }

    if (formula) {
      report += `[2. FORMULA & METHOD]\n`;
      report += `${formula || 'Standard Deterministic Algorithm Definition'}\n\n`;
    }

    report += `[3. STEP-BY-STEP CALCULATIONS]\n`;
    if (Array.isArray(steps)) {
      steps.forEach((step, idx) => {
        report += `Step ${idx + 1}: ${step}\n`;
      });
    } else {
      report += `${steps}\n`;
    }
    report += `\n`;

    if (finalAnswer) {
      report += `[4. FINAL ANSWER]\n`;
      report += `>>> ${finalAnswer} <<<\n\n`;
    }

    if (examAnswer) {
      report += `[5. EXAM-READY CONCISE ANSWER]\n`;
      report += `${examAnswer}\n\n`;
    }

    if (explanation) {
      report += `[6. BEGINNER CONCEPTUAL EXPLANATION]\n`;
      report += `${explanation}\n\n`;
    }

    report += `------------------------------------------------------------------------\n`;
    report += `Reference Textbooks:\n`;
    report += `1. Data Warehousing Fundamentals - Paulraj Ponniah\n`;
    report += `2. Data Mining: Concepts and Techniques - Jiawei Han, Micheline Kamber, Jian Pei\n`;
    report += `3. Introduction to Data Mining - Pang-Ning Tan, Michael Steinbach, Vipin Kumar\n`;
    report += `========================================================================\n`;

    const cleanFilename = `${(algorithm || 'numerical_solution').toLowerCase().replace(/[^a-z0-9]/g, '_')}_report.txt`;
    this.downloadTextFile(cleanFilename, report);
  },

  printAcademicReport(title, htmlContent) {
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
      window.print();
      return;
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title || 'DataMineX Academic Numerical Report'}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; padding: 30px; margin: 0; }
          h2, h3, h4 { color: #0f172a; margin-top: 20px; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 13px; }
          th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
          th { background: #f1f5f9; font-weight: 700; }
          .header-box { border-bottom: 2px solid #2563eb; padding-bottom: 12px; margin-bottom: 20px; }
          .final-box { border: 2px solid #16a34a; background: #f0fdf4; padding: 15px; border-radius: 8px; margin-top: 20px; }
          @media print {
            body { padding: 0; }
            button { display: none !important; }
          }
        </style>
      </head>
      <body>
        <div class="header-box">
          <h1 style="color: #2563eb; margin: 0 0 4px; font-size: 24px;">DataMineX &mdash; Academic Numerical Solution Report</h1>
          <div style="font-size: 13px; color: #64748b;">Generated: ${new Date().toLocaleString()} &bull; Course: Data Warehousing &amp; Data Mining</div>
        </div>
        <div>
          ${htmlContent}
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  },

  exportPracticalLabReport(labTitle, datasetName, summaryStats, results) {
    const dateStr = new Date().toLocaleString();
    let report = `========================================================================\n`;
    report += `                   DATAMINEX PRACTICAL LAB EXPERIMENT REPORT           \n`;
    report += `========================================================================\n`;
    report += `Generated Date: ${dateStr}\n`;
    report += `Lab Experiment: ${labTitle}\n`;
    report += `Dataset Name:   ${datasetName || 'Sample Academic Dataset'}\n`;
    report += `------------------------------------------------------------------------\n\n`;

    report += `[1. EXPERIMENT SUMMARY & STATISTICS]\n`;
    report += `${typeof summaryStats === 'string' ? summaryStats : JSON.stringify(summaryStats, null, 2)}\n\n`;

    report += `[2. ALGORITHM EXECUTION & OUTPUT]\n`;
    report += `${typeof results === 'string' ? results : JSON.stringify(results, null, 2)}\n\n`;

    report += `[3. VERIFICATION & CONCLUSION]\n`;
    report += `Experiment executed successfully inside DataMineX Virtual Lab Environment.\n\n`;
    report += `========================================================================\n`;

    const cleanFilename = `${labTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}_lab_report.txt`;
    this.downloadTextFile(cleanFilename, report);
  }
};
