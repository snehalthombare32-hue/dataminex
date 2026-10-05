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

  exportNumericalSolution(solutionData) {
    const { title, algorithm, givenData, formula, steps, finalAnswer, examAnswer, explanation } = solutionData;
    const dateStr = new Date().toLocaleString();

    let report = `========================================================================\n`;
    report += `                     DATAMINEX ACADEMIC NUMERICAL REPORT               \n`;
    report += `========================================================================\n`;
    report += `Generated Date: ${dateStr}\n`;
    report += `Algorithm:      ${algorithm || 'Data Mining / Warehousing Algorithm'}\n`;
    report += `Problem Title:  ${title || 'Numerical Problem Solution'}\n`;
    report += `------------------------------------------------------------------------\n\n`;

    report += `[1. GIVEN DATA]\n`;
    report += `${typeof givenData === 'string' ? givenData : JSON.stringify(givenData, null, 2)}\n\n`;

    report += `[2. FORMULA & METHOD]\n`;
    report += `${formula || 'Standard Deterministic Algorithm Definition'}\n\n`;

    report += `[3. STEP-BY-STEP CALCULATIONS]\n`;
    if (Array.isArray(steps)) {
      steps.forEach((step, idx) => {
        report += `Step ${idx + 1}: ${step}\n`;
      });
    } else {
      report += `${steps}\n`;
    }
    report += `\n`;

    report += `[4. FINAL ANSWER]\n`;
    report += `>>> ${finalAnswer} <<<\n\n`;

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
