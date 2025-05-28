import { translate } from './i18n.js';

// Function to generate an Excel file from the EI scale calculation data
export async function generateExcel(state) {
  // Check if ExcelJS is available, if not, load it
  if (!window.ExcelJS) {
    await loadExcelJS();
  }

  const { Workbook } = window.ExcelJS;
  const workbook = new Workbook();
  
  // Add metadata
  workbook.creator = 'Dual Index Calculator';
  workbook.lastModifiedBy = 'Dual Index Calculator';
  workbook.created = new Date();
  workbook.modified = new Date();
  
  // Create main summary worksheet
  const summarySheet = workbook.addWorksheet('Dual Index Summary');
  
  // Add title and date
  summarySheet.mergeCells('A1:F1');
  const titleCell = summarySheet.getCell('A1');
  titleCell.value = translate('Dual Index Report');
  titleCell.font = {
    size: 16,
    bold: true
  };
  titleCell.alignment = { horizontal: 'center' };
  
  // Add date
  summarySheet.mergeCells('A2:F2');
  const dateCell = summarySheet.getCell('A2');
  dateCell.value = `${translate('Date')}: ${new Date().toLocaleString()}`;
  dateCell.alignment = { horizontal: 'center' };
  
  // Add scores section header
  summarySheet.mergeCells('A4:F4');
  const scoresSectionCell = summarySheet.getCell('A4');
  scoresSectionCell.value = translate('Dual Index Scores');
  scoresSectionCell.font = { bold: true, size: 14 };
  
  // Add component scores
  summarySheet.getCell('A5').value = translate('Component');
  summarySheet.getCell('B5').value = translate('Score');
  summarySheet.getCell('A5').font = { bold: true };
  summarySheet.getCell('B5').font = { bold: true };
  
  summarySheet.getCell('A6').value = translate('Sample Preparation');
  summarySheet.getCell('B6').value = Number(state.scores.samplePrep.toFixed(1));
  
  summarySheet.getCell('A7').value = translate('Instrumentation');
  summarySheet.getCell('B7').value = Number(state.scores.instrumentation.toFixed(1));
  
  summarySheet.getCell('A8').value = translate('Reagent');
  summarySheet.getCell('B8').value = Number(state.scores.reagent.toFixed(1));
  
  summarySheet.getCell('A9').value = translate('Waste');
  summarySheet.getCell('B9').value = Number(state.scores.waste.toFixed(1));
  
  // Add total score
  summarySheet.mergeCells('A11:F11');
  const totalScoreHeaderCell = summarySheet.getCell('A11');
  totalScoreHeaderCell.value = translate('EIPI Score (Dual Index)');
  totalScoreHeaderCell.font = { bold: true, size: 14 };
  
  summarySheet.mergeCells('A12:F12');
  const totalScoreCell = summarySheet.getCell('A12');
  totalScoreCell.value = Number(state.scores.total.toFixed(1));
  totalScoreCell.font = { bold: true, size: 14 };
  
  // Add separate interpretation sections for EI Index, Practicality and Dual Index
  
  // EI Index interpretation with updated thresholds
  let eiInterpretationText = '';
  let eiInterpretationFill = {};
  
  if (state.scores.eiIndex >= 85) {
    eiInterpretationText = translate('Ideal Green Method with Minimal Impact');
    eiInterpretationFill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '0027AE60' } // Dark green
    };
  } else if (state.scores.eiIndex >= 70) {
    eiInterpretationText = translate('Acceptable green');
    eiInterpretationFill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '002ECC71' } // Light green
    };
  } else if (state.scores.eiIndex >= 55) {
    eiInterpretationText = translate('Considerable Environmental Impact – Requires Improvement');
    eiInterpretationFill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '00F39C12' } // Orange
    };
  } else {
    eiInterpretationText = translate('Unsustainable non green method with Serious Impact');
    eiInterpretationFill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '00E74C3C' } // Red
    };
  }
  
  // Practicality Index interpretation
  let piInterpretationText = '';
  let piInterpretationFill = {};
  
  if (state.scores.practicality >= 75) {
    piInterpretationText = translate('Excellent Practicality');
    piInterpretationFill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '002980B9' } // Dark blue
    };
  } else if (state.scores.practicality >= 50) {
    piInterpretationText = translate('Acceptable Practicality');
    piInterpretationFill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '003498DB' } // Light blue
    };
  } else {
    piInterpretationText = translate('Impractical Method');
    piInterpretationFill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '009B59B6' } // Purple/Magenta
    };
  }
  
  // Dual Index interpretation
  let dualInterpretationText = '';
  let dualInterpretationFill = {};
  
  if (state.scores.total >= 75) {
    dualInterpretationText = translate('Green and Practical Efficient Method');
    dualInterpretationFill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '0027AE60' } // Green
    };
  } else if (state.scores.total >= 50) {
    dualInterpretationText = translate('Acceptable Method');
    dualInterpretationFill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '00F39C12' } // Yellow/Orange
    };
  } else {
    dualInterpretationText = translate('Non-Green and Impractical Method');
    dualInterpretationFill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '00E74C3C' } // Red
    };
  }
  
  // Add EI Index interpretation
  summarySheet.mergeCells('A14:F14');
  const eiInterpretationHeaderCell = summarySheet.getCell('A14');
  eiInterpretationHeaderCell.value = translate('EI Index') + ': ' + state.scores.eiIndex.toFixed(1);
  eiInterpretationHeaderCell.font = { bold: true, size: 14 };
  
  summarySheet.mergeCells('A15:F15');
  const eiInterpretationCell = summarySheet.getCell('A15');
  eiInterpretationCell.value = eiInterpretationText;
  eiInterpretationCell.font = { bold: true };
  eiInterpretationCell.fill = eiInterpretationFill;
  
  // Add Practicality interpretation
  summarySheet.mergeCells('A17:F17');
  const piInterpretationHeaderCell = summarySheet.getCell('A17');
  piInterpretationHeaderCell.value = translate('Practicality Index') + ': ' + state.scores.practicality.toFixed(1);
  piInterpretationHeaderCell.font = { bold: true, size: 14 };
  
  summarySheet.mergeCells('A18:F18');
  const piInterpretationCell = summarySheet.getCell('A18');
  piInterpretationCell.value = piInterpretationText;
  piInterpretationCell.font = { bold: true };
  piInterpretationCell.fill = piInterpretationFill;
  
  // Add Dual Index interpretation
  summarySheet.mergeCells('A20:F20');
  const dualInterpretationHeaderCell = summarySheet.getCell('A20');
  dualInterpretationHeaderCell.value = translate('Dual Index Interpretation');
  dualInterpretationHeaderCell.font = { bold: true, size: 14 };
  
  summarySheet.mergeCells('A21:F21');
  const dualInterpretationCell = summarySheet.getCell('A21');
  dualInterpretationCell.value = dualInterpretationText;
  dualInterpretationCell.font = { bold: true };
  dualInterpretationCell.fill = dualInterpretationFill;
  
  // Set column widths
  summarySheet.columns = [
    { width: 30 }, // A
    { width: 15 }, // B
    { width: 15 }, // C
    { width: 15 }, // D
    { width: 15 }, // E
    { width: 15 }  // F
  ];
  
  // Create details worksheet for Sample Preparation
  const samplePrepSheet = workbook.addWorksheet('Sample Preparation');
  addSamplePrepDetails(samplePrepSheet, state.samplePrep);
  
  // Create details worksheet for Instrumentation
  const instrumentationSheet = workbook.addWorksheet('Instrumentation');
  addInstrumentationDetails(instrumentationSheet, state.instrumentation);
  
  // Create details worksheet for Reagents
  const reagentSheet = workbook.addWorksheet('Reagents');
  addReagentDetails(reagentSheet, state.reagents);
  
  // Create details worksheet for Waste
  const wasteSheet = workbook.addWorksheet('Waste');
  addWasteDetails(wasteSheet, state.waste);
  
  // Export as blob and trigger download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `Dual_Index_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
  link.click();
  
  URL.revokeObjectURL(url);
}

// Helper function to add Sample Preparation details
function addSamplePrepDetails(sheet, samplePrep) {
  // Add title
  sheet.mergeCells('A1:D1');
  const titleCell = sheet.getCell('A1');
  titleCell.value = translate('Sample Preparation Details');
  titleCell.font = { bold: true, size: 14 };
  
  let row = 3;
  
  // Pre-synthesis
  sheet.getCell(`A${row}`).value = translate('Pre-synthesis');
  sheet.getCell(`B${row}`).value = samplePrep.preSynthesis === 'no' ? translate('No') : translate('Yes');
  row++;
  
  if (samplePrep.preSynthesis === 'yes') {
    // Yield
    sheet.getCell(`A${row}`).value = translate('Yield');
    let yieldText = '';
    switch(samplePrep.yield) {
      case 'high': yieldText = translate('High yield >90%'); break;
      case 'moderate': yieldText = translate('Moderate yield 50-90%'); break;
      case 'low': yieldText = translate('Low yield <50%'); break;
    }
    sheet.getCell(`B${row}`).value = yieldText;
    row++;
    
    // Temperature
    sheet.getCell(`A${row}`).value = translate('Temperature');
    let temperatureText = '';
    switch(samplePrep.temperature) {
      case 'high': temperatureText = translate('High temp. for more than 1 hr or cooling less than 0°C'); break;
      case 'room': temperatureText = translate('Room temperature more than 1 hr or heating less than 1 hr'); break;
      case 'none': temperatureText = translate('No temperature control required'); break;
    }
    sheet.getCell(`B${row}`).value = temperatureText;
    row++;
    
    // Additional checkboxes for pre-synthesis
    if (samplePrep.purification) {
      sheet.getCell(`A${row}`).value = translate('Purification needed');
      sheet.getCell(`B${row}`).value = translate('Yes');
      row++;
    }
    
    if (samplePrep.energyConsumption) {
      sheet.getCell(`A${row}`).value = translate('High energy consumption');
      sheet.getCell(`B${row}`).value = translate('Yes');
      row++;
    }
    
    if (samplePrep.nonGreenSolvent) {
      sheet.getCell(`A${row}`).value = translate('Use of non-green solvent');
      sheet.getCell(`B${row}`).value = translate('Yes');
      row++;
    }
    
    if (samplePrep.occupationalHazard) {
      sheet.getCell(`A${row}`).value = translate('Occupational hazard present');
      sheet.getCell(`B${row}`).value = translate('Yes');
      row++;
    }
  }
  
  // Instrument requirements
  sheet.getCell(`A${row}`).value = translate('Instrument requirements');
  let instrumentText = '';
  switch(samplePrep.instrumentRequirements) {
    case 'none': instrumentText = translate('No sample preparation required'); break;
    case 'minimal': instrumentText = translate('Minimal sample preparation (Dilution)'); break;
    case 'moderate': instrumentText = translate('Moderate sample preparation (Filtration, sonication)'); break;
  }
  sheet.getCell(`B${row}`).value = instrumentText;
  row++;
  
  // Type of sample
  sheet.getCell(`A${row}`).value = translate('Type of sample');
  sheet.getCell(`B${row}`).value = samplePrep.sampleType === 'simple' ? 
    translate('Simple procedure (pharmaceutical dosage form)') : 
    translate('Extensive preparation (biological, food, environmental samples)');
  row++;
  
  // Additional sample type options
  if (samplePrep.derivatization) {
    sheet.getCell(`A${row}`).value = translate('Involves derivatization or digestion');
    sheet.getCell(`B${row}`).value = translate('Yes');
    row++;
  }
  
  // Sample throughput
  sheet.getCell(`A${row}`).value = translate('Sample throughput');
  let throughputText = '';
  switch(samplePrep.sampleThroughput) {
    case 'high': throughputText = translate('High (≥60 samples/day)'); break;
    case 'moderate': throughputText = translate('Moderate (30–59 samples/day)'); break;
    case 'low': throughputText = translate('Low (<30 samples/day)'); break;
  }
  sheet.getCell(`B${row}`).value = throughputText;
  row++;
  
  if (samplePrep.automatedPreparation) {
    sheet.getCell(`A${row}`).value = translate('Automated sample preparation');
    sheet.getCell(`B${row}`).value = translate('Yes');
    row++;
  }
  
  if (samplePrep.inSituPreparation) {
    sheet.getCell(`A${row}`).value = translate('In situ sample preparation');
    sheet.getCell(`B${row}`).value = translate('Yes');
    row++;
  }
  
  if (samplePrep.offLine) {
    sheet.getCell(`A${row}`).value = translate('Off line');
    sheet.getCell(`B${row}`).value = translate('Yes');
    row++;
  }
  
  // Extraction procedure
  sheet.getCell(`A${row}`).value = translate('Extraction procedure');
  sheet.getCell(`B${row}`).value = samplePrep.extractionNeeded === 'no' ? 
    translate('No extraction needed') : translate('Extraction needed');
  row++;
  
  if (samplePrep.extractionNeeded === 'yes') {
    // Solvent Type
    sheet.getCell(`A${row}`).value = translate('Solvent Type');
    let solventTypeText = '';
    switch(samplePrep.solventType) {
      case 'complete': solventTypeText = translate('Complete green solvents'); break;
      case 'partial': solventTypeText = translate('Partial green solvents'); break;
      case 'nonGreen': solventTypeText = translate('Non-greener (conventional organic) solvents'); break;
    }
    sheet.getCell(`B${row}`).value = solventTypeText;
    row++;
    
    // Solvent Volume
    sheet.getCell(`A${row}`).value = translate('Solvent Volume');
    let solventVolumeText = '';
    switch(samplePrep.solventVolume) {
      case 'less1': solventVolumeText = translate('Less than 1 mL'); break;
      case 'between1And10': solventVolumeText = translate('1 to 10 mL'); break;
      case 'between10And100': solventVolumeText = translate('10.1-100 mL'); break;
      case 'more100': solventVolumeText = translate('More than 100 mL'); break;
    }
    sheet.getCell(`B${row}`).value = solventVolumeText;
    row++;
    
    if (samplePrep.renewableAdsorbent) {
      sheet.getCell(`A${row}`).value = translate('Use of renewable/reusable absorbents');
      sheet.getCell(`B${row}`).value = translate('Yes');
      row++;
    }
  }
  
  // Set column widths
  sheet.columns = [
    { width: 40 }, // A
    { width: 60 }  // B
  ];
}

// Helper function to add Instrumentation details
function addInstrumentationDetails(sheet, instrumentation) {
  // Add title
  sheet.mergeCells('A1:D1');
  const titleCell = sheet.getCell('A1');
  titleCell.value = translate('Instrumentation Details');
  titleCell.font = { bold: true, size: 14 };
  
  let row = 3;
  
  // Energy consumption
  sheet.getCell(`A${row}`).value = translate('Energy Consumption');
  let energyText = '';
  switch(instrumentation.energy) {
    case 'non': energyText = translate('Non-instrumental methods (0 kWh)'); break;
    case 'low': energyText = translate('≤0.1 kWh per sample'); break;
    case 'moderate': energyText = translate('≤1.5 kWh per sample'); break;
    case 'high': energyText = translate('>1.5 kWh per sample'); break;
  }
  sheet.getCell(`B${row}`).value = energyText;
  row++;
  
  // Vapor emission
  if (instrumentation.vaporEmission) {
    sheet.getCell(`A${row}`).value = translate('Emission of Vapors');
    sheet.getCell(`B${row}`).value = translate('Yes');
    row++;
  }
  
  // Manual/non-automated
  if (instrumentation.nonAutomated) {
    sheet.getCell(`A${row}`).value = translate('Manual or non-automated');
    sheet.getCell(`B${row}`).value = translate('Yes');
    row++;
  }
  
  // Not multianalyte
  if (instrumentation.notMultianalyte) {
    sheet.getCell(`A${row}`).value = translate('Not multianalyte or multiparameter');
    sheet.getCell(`B${row}`).value = translate('Yes');
    row++;
  }
  
  // Maintenance and lifetime
  sheet.getCell(`A${row}`).value = translate('Maintenance and Instrument Lifetime');
  sheet.getCell(`B${row}`).value = instrumentation.maintenanceLifetime;
  row++;
  
  // Set column widths
  sheet.columns = [
    { width: 40 }, // A
    { width: 60 }  // B
  ];
}

// Helper function to add Reagent details
function addReagentDetails(sheet, reagents) {
  // Add title
  sheet.mergeCells('A1:E1');
  const titleCell = sheet.getCell('A1');
  titleCell.value = translate('Reagent Details');
  titleCell.font = { bold: true, size: 14 };
  
  if (reagents.length === 0) {
    sheet.getCell('A3').value = translate('No reagents added');
    sheet.columns = [
      { width: 40 }  // A
    ];
    return;
  }
  
  // Headers
  let row = 3;
  sheet.getCell(`A${row}`).value = translate('Reagent #');
  sheet.getCell(`B${row}`).value = translate('Solvent Type');
  sheet.getCell(`C${row}`).value = translate('Signal Word');
  sheet.getCell(`D${row}`).value = translate('GHS Classification');
  sheet.getCell(`E${row}`).value = translate('Volume');
  
  // Make headers bold
  for (let col of ['A', 'B', 'C', 'D', 'E']) {
    sheet.getCell(`${col}${row}`).font = { bold: true };
  }
  
  row++;
  
  // Add reagents
  reagents.forEach((reagent, index) => {
    sheet.getCell(`A${row}`).value = `${index + 1}`;
    
    // Solvent type
    let solventTypeText = '';
    switch(reagent.solventType) {
      case 'water': solventTypeText = translate('Water'); break;
      case 'organic': solventTypeText = translate('Organic Solvent'); break;
      case 'acid': solventTypeText = translate('Acid'); break;
      case 'base': solventTypeText = translate('Base'); break;
      case 'buffer': solventTypeText = translate('Buffer'); break;
      case 'other': solventTypeText = translate('Other'); break;
    }
    sheet.getCell(`B${row}`).value = solventTypeText;
    
    // Signal word
    let signalWordText = '';
    switch(reagent.signalWord) {
      case 'warning': signalWordText = translate('Warning'); break;
      case 'danger': signalWordText = translate('Danger'); break;
      case 'notAvailable': signalWordText = translate('Not available'); break;
    }
    sheet.getCell(`C${row}`).value = signalWordText;
    
    // GHS Classification
    let ghsClassText = '';
    switch(reagent.ghsClass) {
      case 'zero': ghsClassText = translate('Zero pictograms'); break;
      case 'one': ghsClassText = translate('One pictogram'); break;
      case 'two': ghsClassText = translate('Two pictograms'); break;
      case 'three': ghsClassText = translate('Three or more pictograms'); break;
    }
    sheet.getCell(`D${row}`).value = ghsClassText;
    
    // Volume
    let volumeText = '';
    switch(reagent.volume) {
      case 'less1': volumeText = translate('< 1 ml'); break;
      case 'less10': volumeText = translate('< 10 ml (g)'); break;
      case 'between10And100': volumeText = translate('10.1-100 ml (g)'); break;
      case 'more100': volumeText = translate('> 100 ml (g)'); break;
    }
    sheet.getCell(`E${row}`).value = volumeText;
    
    row++;
  });
  
  // Set column widths
  sheet.columns = [
    { width: 15 },  // A
    { width: 25 },  // B
    { width: 20 },  // C
    { width: 30 },  // D
    { width: 20 }   // E
  ];
}

// Helper function to add Waste details
function addWasteDetails(sheet, waste) {
  // Add title
  sheet.mergeCells('A1:D1');
  const titleCell = sheet.getCell('A1');
  titleCell.value = translate('Waste Details');
  titleCell.font = { bold: true, size: 14 };
  
  let row = 3;
  
  // Amount of waste per sample
  sheet.getCell(`A${row}`).value = translate('Amount of Waste per Sample');
  let wasteVolumeText = '';
  switch(waste.volume) {
    case 'less1': wasteVolumeText = translate('< 1 mL'); break;
    case 'between1And10': wasteVolumeText = translate('1-10 mL'); break;
    case 'between10And100': wasteVolumeText = translate('11-100 mL'); break;
    case 'more100': wasteVolumeText = translate('> 100 mL'); break;
  }
  sheet.getCell(`B${row}`).value = wasteVolumeText;
  row++;
  
  // Biodegradable
  sheet.getCell(`A${row}`).value = translate('Biodegradable');
  sheet.getCell(`B${row}`).value = waste.biodegradable ? translate('Yes') : translate('No');
  row++;
  
  // Treatment
  sheet.getCell(`A${row}`).value = translate('Treatment');
  let treatmentText = '';
  switch(waste.treatment) {
    case 'none': treatmentText = translate('No treatment applied'); break;
    case 'noModification': treatmentText = translate('No modification required'); break;
    case 'less10': treatmentText = translate('Treatment with reuse < 10 mL'); break;
    case 'more10': treatmentText = translate('Treatment with reuse > 10 mL'); break;
  }
  sheet.getCell(`B${row}`).value = treatmentText;
  row++;
  
  // Set column widths
  sheet.columns = [
    { width: 40 }, // A
    { width: 60 }  // B
  ];
}

// Load ExcelJS from CDN if not available
async function loadExcelJS() {
  return new Promise((resolve, reject) => {
    if (window.ExcelJS) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/exceljs@4.3.0/dist/exceljs.min.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load ExcelJS'));
    document.head.appendChild(script);
  });
}