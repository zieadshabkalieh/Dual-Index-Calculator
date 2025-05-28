import { translate } from './i18n.js';

// Function to generate a PDF report of the EI scale calculation
export async function generatePDF(state) {
  // Create a blob URL for the PDF
  const { jsPDF } = window.jspdf;
  
  // Check if jsPDF is available
  if (!jsPDF) {
    // Load jsPDF from CDN if not available
    await loadJsPDF();
  }
  
  // Load additional dependency for canvas conversion
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
  
  const doc = new window.jspdf.jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  doc.text(translate('Dual Index Calculator Report'), 105, 20, { align: 'center' });
  
  // Add date
  doc.setFontSize(12);
  doc.text(`${translate('Date')}: ${new Date().toLocaleString()}`, 20, 30);
  
  // Add scores
  doc.setFontSize(16);
  doc.text(translate('Dual Index Scores'), 20, 45);
  
  doc.setFontSize(12);
  doc.text(`${translate('Sample Preparation Score')}: ${state.scores.samplePrep.toFixed(1)}`, 20, 55);
  doc.text(`${translate('Instrumentation Score')}: ${state.scores.instrumentation.toFixed(1)}`, 20, 65);
  doc.text(`${translate('Reagent Score')}: ${state.scores.reagent.toFixed(1)}`, 20, 75);
  doc.text(`${translate('Waste Score')}: ${state.scores.waste.toFixed(1)}`, 20, 85);
  
  // Add total score
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(`${translate('EIPI Score (Dual Index)')}: ${state.scores.total.toFixed(1)}`, 20, 100);
  
  // Add interpretation for EI Index
  let eiInterpretationText = '';
  let eiInterpretationColor = [0, 0, 0];
  
  // Using the updated thresholds from the new requirements: 85-100 (Dark Green), <85-70 (Light Green), <70-55 (Yellow), <55 (Red)
  if (state.scores.eiIndex >= 85) {
    eiInterpretationText = translate('Ideal Green Method with Minimal Impact');
    eiInterpretationColor = [0, 100, 0]; // Dark green
  } else if (state.scores.eiIndex >= 70) {
    eiInterpretationText = translate('Acceptable green');
    eiInterpretationColor = [46, 204, 113]; // Light green
  } else if (state.scores.eiIndex >= 55) {
    eiInterpretationText = translate('Considerable Environmental Impact – Requires Improvement');
    eiInterpretationColor = [243, 156, 18]; // Yellow
  } else {
    eiInterpretationText = translate('Unsustainable non green method with Serious Impact');
    eiInterpretationColor = [231, 76, 60]; // Red
  }
  
  // Add interpretation for Practicality Index
  let piInterpretationText = '';
  let piInterpretationColor = [0, 0, 0];
  
  // PI Index thresholds: 75-100 (Dark Blue), 50-74 (Light Blue), <50 (Magenta)
  if (state.scores.practicality >= 75) {
    piInterpretationText = translate('Excellent Practicality');
    piInterpretationColor = [41, 128, 185]; // Dark blue
  } else if (state.scores.practicality >= 50) {
    piInterpretationText = translate('Acceptable Practicality');
    piInterpretationColor = [52, 152, 219]; // Light blue
  } else {
    piInterpretationText = translate('Impractical Method');
    piInterpretationColor = [155, 89, 182]; // Magenta
  }
  
  // Add interpretation for Dual Index (EIPI Total)
  let dualIndexInterpretationText = '';
  let dualIndexInterpretationColor = [0, 0, 0];
  
  // EIPI significance thresholds: 75-100 (Green), <75-50 (Acceptable), <50 (Non-green and impractical)
  if (state.scores.total >= 75) {
    dualIndexInterpretationText = translate('Green and Practical Efficient Method');
    dualIndexInterpretationColor = [39, 174, 96]; // Green
  } else if (state.scores.total >= 50) {
    dualIndexInterpretationText = translate('Acceptable Method');
    dualIndexInterpretationColor = [243, 156, 18]; // Yellow/Orange
  } else {
    dualIndexInterpretationText = translate('Non-Green and Impractical Method');
    dualIndexInterpretationColor = [231, 76, 60]; // Red
  }
  
  // Now display all three interpretations with their respective colors
  
  // Show EI Index interpretation
  doc.setTextColor(eiInterpretationColor[0], eiInterpretationColor[1], eiInterpretationColor[2]);
  doc.text(`${translate('EI Index')}: ${state.scores.eiIndex.toFixed(1)} - ${eiInterpretationText}`, 20, 110);
  
  // Show PI Index interpretation
  doc.setTextColor(piInterpretationColor[0], piInterpretationColor[1], piInterpretationColor[2]);
  doc.text(`${translate('Practicality Index')}: ${state.scores.practicality.toFixed(1)} - ${piInterpretationText}`, 20, 125);
  
  // Show Dual Index (EIPI) interpretation
  doc.setTextColor(dualIndexInterpretationColor[0], dualIndexInterpretationColor[1], dualIndexInterpretationColor[2]);
  doc.text(`${translate('Dual Index Interpretation')}: ${dualIndexInterpretationText}`, 20, 140);
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Add details for each component
  doc.addPage();
  
  // Sample Preparation Details
  doc.setFontSize(16);
  doc.text(translate('Sample Preparation Details'), 20, 20);
  doc.setFontSize(12);
  let yPos = 30;
  
  // Pre-synthesis
  doc.text(`${translate('Pre-synthesis')}: ${state.samplePrep.preSynthesis === 'no' ? translate('No') : translate('Yes')}`, 20, yPos);
  yPos += 10;
  
  if (state.samplePrep.preSynthesis === 'yes') {
    doc.text(`${translate('Yield')}: ${getYieldText(state.samplePrep.yield)}`, 30, yPos);
    yPos += 10;
    doc.text(`${translate('Temperature')}: ${getTemperatureText(state.samplePrep.temperature)}`, 30, yPos);
    yPos += 10;
    
    if (state.samplePrep.purification) {
      doc.text(`${translate('Purification needed')}: ${translate('Yes')}`, 30, yPos);
      yPos += 10;
    }
    
    if (state.samplePrep.energyConsumption) {
      doc.text(`${translate('High energy consumption')}: ${translate('Yes')}`, 30, yPos);
      yPos += 10;
    }
    
    if (state.samplePrep.nonGreenSolvent) {
      doc.text(`${translate('Use of non-green solvent')}: ${translate('Yes')}`, 30, yPos);
      yPos += 10;
    }
    
    if (state.samplePrep.occupationalHazard) {
      doc.text(`${translate('Occupational hazard present')}: ${translate('Yes')}`, 30, yPos);
      yPos += 10;
    }
  }
  
  // Instrument requirements
  doc.text(`${translate('Instrument requirements')}: ${getInstrumentRequirementsText(state.samplePrep.instrumentRequirements)}`, 20, yPos);
  yPos += 10;
  
  // Type of sample
  doc.text(`${translate('Type of sample')}: ${state.samplePrep.sampleType === 'simple' ? translate('Simple') : translate('Extensive')}`, 20, yPos);
  yPos += 10;
  
  if (state.samplePrep.derivatization) {
    doc.text(`${translate('Involves derivatization or digestion')}: ${translate('Yes')}`, 30, yPos);
    yPos += 10;
  }
  
  doc.text(`${translate('Sample throughput')}: ${getSampleThroughputText(state.samplePrep.sampleThroughput)}`, 30, yPos);
  yPos += 10;
  
  if (state.samplePrep.automatedPreparation) {
    doc.text(`${translate('Automated sample preparation')}: ${translate('Yes')}`, 30, yPos);
    yPos += 10;
  }
  
  if (state.samplePrep.inSituPreparation) {
    doc.text(`${translate('In situ sample preparation')}: ${translate('Yes')}`, 30, yPos);
    yPos += 10;
  }
  
  if (state.samplePrep.offLine) {
    doc.text(`${translate('Off line')}: ${translate('Yes')}`, 30, yPos);
    yPos += 10;
  }
  
  // Extraction procedure
  doc.text(`${translate('Extraction procedure')}: ${state.samplePrep.extractionNeeded === 'no' ? translate('No extraction needed') : translate('Extraction needed')}`, 20, yPos);
  yPos += 10;
  
  if (state.samplePrep.extractionNeeded === 'yes') {
    doc.text(`${translate('Solvent Type')}: ${getExtractionSolventTypeText(state.samplePrep.solventType)}`, 30, yPos);
    yPos += 10;
    
    doc.text(`${translate('Solvent Volume')}: ${getSolventVolumeText(state.samplePrep.solventVolume)}`, 30, yPos);
    yPos += 10;
    
    if (state.samplePrep.renewableAdsorbent) {
      doc.text(`${translate('Use of renewable/reusable absorbents')}: ${translate('Yes')}`, 30, yPos);
      yPos += 10;
    }
  }
  
  // Instrumentation Details
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  } else {
    yPos += 10;
  }
  
  doc.setFontSize(16);
  doc.text(translate('Instrumentation Details'), 20, yPos);
  doc.setFontSize(12);
  yPos += 10;
  
  doc.text(`${translate('Energy Consumption')}: ${getEnergyText(state.instrumentation.energy)}`, 20, yPos);
  yPos += 10;
  
  if (state.instrumentation.vaporEmission) {
    doc.text(`${translate('Emission of Vapors')}: ${translate('Yes')}`, 20, yPos);
    yPos += 10;
  }
  
  if (state.instrumentation.nonAutomated) {
    doc.text(`${translate('Manual or non-automated')}: ${translate('Yes')}`, 20, yPos);
    yPos += 10;
  }
  
  if (state.instrumentation.notMultianalyte) {
    doc.text(`${translate('Not multianalyte or multiparameter')}: ${translate('Yes')}`, 20, yPos);
    yPos += 10;
  }
  
  doc.text(`${translate('Maintenance and Instrument Lifetime')}: ${state.instrumentation.maintenanceLifetime}`, 20, yPos);
  yPos += 10;
  
  // Reagent Details
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  } else {
    yPos += 10;
  }
  
  doc.setFontSize(16);
  doc.text(translate('Reagent Details'), 20, yPos);
  doc.setFontSize(12);
  yPos += 10;
  
  if (state.reagents.length === 0) {
    doc.text(translate('No reagents added'), 20, yPos);
    yPos += 10;
  } else {
    state.reagents.forEach((reagent, index) => {
      doc.text(`${translate('Reagent')} ${index + 1}:`, 20, yPos);
      yPos += 10;
      
      doc.text(`${translate('Solvent')}: ${getSolventTypeText(reagent.solventType)}`, 30, yPos);
      yPos += 10;
      
      doc.text(`${translate('Signal Word')}: ${getSignalWordText(reagent.signalWord)}`, 30, yPos);
      yPos += 10;
      
      doc.text(`${translate('GHS Classification')}: ${getGHSClassText(reagent.ghsClass)}`, 30, yPos);
      yPos += 10;
      
      doc.text(`${translate('Volume')}: ${getReagentVolumeText(reagent.volume)}`, 30, yPos);
      yPos += 10;
      
      // Add more space between reagents
      yPos += 5;
      
      // Check if we need a new page
      if (yPos > 270 && index < state.reagents.length - 1) {
        doc.addPage();
        yPos = 20;
      }
    });
  }
  
  // Waste Details
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  } else {
    yPos += 10;
  }
  
  doc.setFontSize(16);
  doc.text(translate('Waste Details'), 20, yPos);
  doc.setFontSize(12);
  yPos += 10;
  
  doc.text(`${translate('Amount of Waste per Sample')}: ${getWasteVolumeText(state.waste.volume)}`, 20, yPos);
  yPos += 10;
  
  doc.text(`${translate('Biodegradable')}: ${state.waste.biodegradable ? translate('Yes') : translate('No')}`, 20, yPos);
  yPos += 10;
  
  doc.text(`${translate('Treatment')}: ${getWasteTreatmentText(state.waste.treatment)}`, 20, yPos);
  
  // Add visualization charts to a new page
  doc.addPage();
  
  // Add title for visualization section
  doc.setFontSize(18);
  doc.text(translate('Visualization Charts'), 105, 20, { align: 'center' });
  
  // Set starting position for charts
  let chartYPosition = 30;
  
  // Add warning text if charts may not be visible
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text(translate('Note: If charts are not visible, please ensure they were rendered before export.'), 105, chartYPosition, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  chartYPosition += 15;
  
  // Enhanced Chart Capture - with better error handling and forced re-rendering
  try {
    // Give time for charts to fully render
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Re-render charts if needed
    try {
      if (typeof window.renderCharts === 'function') {
        window.renderCharts();
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (renderError) {
      console.warn('Could not re-render charts before PDF export:', renderError);
    }
    
    // Capture and add bar chart
    const barCanvas = document.getElementById('barChart');
    if (barCanvas) {
      // Force any queued rendering to complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      try {
        chartYPosition = await addChartToPDF(doc, 'barChart', translate('Component Scores Comparison'), chartYPosition);
        
        // Add spacing between charts
        chartYPosition += 10;
      } catch (barChartError) {
        console.error('Error adding bar chart to PDF:', barChartError);
        doc.setFontSize(11);
        doc.setTextColor(200, 0, 0);
        doc.text(`${translate('Error: Could not include bar chart in the PDF')}.`, 20, chartYPosition);
        doc.setTextColor(0, 0, 0);
        chartYPosition += 15;
      }
    }
    
    // Capture and add the dual column histogram chart if available
    const histogramChart = document.getElementById('dualColumnHistogram');
    if (histogramChart) {
      // Check if we need a new page
      if (chartYPosition > 180) {
        doc.addPage();
        chartYPosition = 30;
      }
      
      // Force any queued rendering to complete
      await new Promise(resolve => setTimeout(resolve, 300));
      
      try {
        chartYPosition = await addChartToPDF(doc, 'dualColumnHistogram', translate('Dual-Column Histogram: EI & Practicality Index'), chartYPosition, 180, 140);
        
        // Add spacing between charts
        chartYPosition += 20;
      } catch (histogramError) {
        console.error('Error adding dual column histogram to PDF:', histogramError);
        doc.setFontSize(11);
        doc.setTextColor(200, 0, 0);
        doc.text(`${translate('Error: Could not include dual column histogram in the PDF')}.`, 20, chartYPosition);
        doc.setTextColor(0, 0, 0);
        chartYPosition += 15;
      }
    }
    
    // Capture and add radar chart if available - using updated ID from our download buttons
    const radarCanvas = document.getElementById('radarChart');
    if (radarCanvas) {
      // Check if we need a new page
      if (chartYPosition > 180) {
        doc.addPage();
        chartYPosition = 30;
      }
      
      // Force any queued rendering to complete - use longer delay to ensure rendering
      await new Promise(resolve => setTimeout(resolve, 300));
      
      try {
        chartYPosition = await addChartToPDF(doc, 'radarChart', translate('Radar Chart: EI Index + Practicality Index'), chartYPosition, 180, 180);
        
        // Add spacing between charts
        chartYPosition += 20;
      } catch (radarChartError) {
        console.error('Error adding radar chart to PDF:', radarChartError);
        doc.setFontSize(11);
        doc.setTextColor(200, 0, 0);
        doc.text(`${translate('Error: Could not include radar chart in the PDF')}.`, 20, chartYPosition);
        doc.setTextColor(0, 0, 0);
        chartYPosition += 15;
      }
    }
    
    // For backward compatibility, try to capture any other charts using old IDs
    const polarCanvas = document.getElementById('polarChart');
    if (polarCanvas) {
      // Check if we need a new page
      if (chartYPosition > 180) {
        doc.addPage();
        chartYPosition = 30;
      }
      
      // Force any queued rendering to complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      try {
        chartYPosition = await addChartToPDF(doc, 'polarChart', translate('Dual Index Component Distribution'), chartYPosition);
      } catch (polarChartError) {
        console.warn('Error adding polar chart to PDF (not critical):', polarChartError);
      }
    }
  } catch (chartError) {
    console.error('Error adding charts to PDF:', chartError);
    
    // Add general error message if charts couldn't be added
    doc.setFontSize(12);
    doc.setTextColor(255, 0, 0);
    doc.text(translate('Error: Could not include charts in the PDF. Try viewing them on screen before generating the PDF.'), 20, chartYPosition);
    doc.setTextColor(0, 0, 0);
  }
  
  // Trigger download
  try {
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    // Create a link and click it to trigger download
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `Dual_Index_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    link.click();
    
    // Clean up
    URL.revokeObjectURL(pdfUrl);
  } catch (error) {
    console.error('Error generating PDF:', error);
    
    // Try using the save method directly if the above fails
    try {
      doc.save(`Dual_Index_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (saveError) {
      console.error('Error saving PDF:', saveError);
      alert(translate('Failed to generate PDF. Please try again.'));
    }
  }
}

// Helper functions to get text values for various parameters
function getYieldText(yieldValue) {
  switch (yieldValue) {
    case 'high': return translate('High yield >90%');
    case 'moderate': return translate('Moderate yield 50-90%');
    case 'low': return translate('Low yield <50%');
    default: return yieldValue;
  }
}

function getTemperatureText(temperature) {
  switch (temperature) {
    case 'high': return translate('High temp. for more than 1 hr or cooling less than 0°C');
    case 'room': return translate('Room temperature more than 1 hr or heating less than 1 hr or cooling to 0°C');
    case 'none': return translate('Room temp. less than 1 hr');
    default: return temperature;
  }
}

function getInstrumentRequirementsText(requirements) {
  switch (requirements) {
    case 'none': return translate('No sample preparation required');
    case 'minimal': return translate('Minimal sample preparation (Dilution)');
    case 'moderate': return translate('Moderate sample preparation (Filtration, sonication)');
    default: return requirements;
  }
}

function getSampleThroughputText(throughput) {
  switch (throughput) {
    case 'high': return translate('High (≥60 samples/day)');
    case 'moderate': return translate('Moderate (30–59 samples/day)');
    case 'low': return translate('Low (<30 samples/day)');
    default: return throughput;
  }
}

function getExtractionSolventTypeText(type) {
  switch (type) {
    case 'complete': return translate('Use of water or eco-friendly solvents (e.g., supercritical fluids, deep eutectic solvents, liquefied gases, ionic liquids, bio-based solvents, surfactants, micellar solvents)');
    case 'partial': return translate('Partial Green solvent');
    case 'nonGreen': return translate('Non greener solvents');
    default: return type;
  }
}

function getSolventVolumeText(volume) {
  switch (volume) {
    case 'less1': return translate('Less than 1 mL');
    case 'between1And10': return translate('1 to 10 mL');
    case 'between10And100': return translate('10.1-100 mL');
    case 'more100': return translate('More than 100 mL');
    default: return volume;
  }
}

function getEnergyText(energy) {
  switch (energy) {
    case 'non': return translate('Non-instrumental methods (0 kWh)');
    case 'low': return translate('≤0.1 kWh per sample');
    case 'moderate': return translate('≤1.5 kWh per sample');
    case 'high': return translate('>1.5 kWh per sample');
    default: return energy;
  }
}

function getSolventTypeText(type) {
  switch (type) {
    case 'water': return translate('Water');
    case 'organic': return translate('Organic Solvent');
    case 'acid': return translate('Acid');
    case 'base': return translate('Base');
    case 'buffer': return translate('Buffer');
    case 'other': return translate('Other');
    default: return type;
  }
}

function getSignalWordText(signalWord) {
  switch (signalWord) {
    case 'warning': return translate('Warning');
    case 'danger': return translate('Danger');
    case 'notAvailable': return translate('Not available');
    default: return signalWord;
  }
}

function getGHSClassText(ghsClass) {
  switch (ghsClass) {
    case 'zero': return translate('Zero pictograms');
    case 'one': return translate('One pictogram');
    case 'two': return translate('Two pictograms');
    case 'three': return translate('Three or more pictograms');
    default: return ghsClass;
  }
}

function getReagentVolumeText(volume) {
  switch (volume) {
    case 'less1': return translate('< 1 ml');
    case 'less10': return translate('< 10 ml (g)');
    case 'between10And100': return translate('10.1-100 ml (g)');
    case 'more100': return translate('> 100 ml (g)');
    default: return volume;
  }
}

function getWasteVolumeText(volume) {
  switch (volume) {
    case 'less1': return translate('< 1 mL');
    case 'between1And10': return translate('1-10 mL');
    case 'between10And100': return translate('11-100 mL');
    case 'more100': return translate('> 100 mL');
    default: return volume;
  }
}

function getWasteTreatmentText(treatment) {
  switch (treatment) {
    case 'none': return translate('No treatment applied');
    case 'noModification': return translate('No modification required');
    case 'less10': return translate('Treatment with reuse < 10 mL');
    case 'more10': return translate('Treatment with reuse > 10 mL');
    default: return treatment;
  }
}

// Generic function to load external scripts
async function loadScript(url) {
  return new Promise((resolve, reject) => {
    // Check if script already loaded
    const existingScript = document.querySelector(`script[src="${url}"]`);
    if (existingScript) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = url;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
    document.head.appendChild(script);
  });
}

// Load jsPDF from CDN if not available
async function loadJsPDF() {
  return new Promise((resolve, reject) => {
    if (window.jspdf) {
      resolve();
      return;
    }
    
    // For the web version, jsPDF should already be loaded in the index.html
    if (typeof jspdf !== 'undefined') {
      window.jspdf = jspdf;
      resolve();
      return;
    }
    
    // Otherwise, try to load it
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')
      .then(() => resolve())
      .catch(error => reject(error));
  });
}

// Function to capture chart canvas or SVG and add to PDF
async function addChartToPDF(doc, elementId, title, yPosition, width = 180, height = 120) {
  try {
    const element = document.getElementById(elementId);
    
    if (!element) {
      console.warn(`Element with ID ${elementId} not found`);
      return yPosition;
    }
    
    // Add title with better styling
    doc.setFontSize(14);
    doc.setTextColor(50, 50, 150); // Blue title for charts
    doc.text(title, 20, yPosition);
    doc.setTextColor(0, 0, 0); // Reset text color
    yPosition += 10;
    
    // Ensure chart is rendered before capturing
    await new Promise(resolve => setTimeout(resolve, 200));
    
    let imgData;
    
    // Different handling for SVG vs Canvas
    if (element.tagName.toLowerCase() === 'svg') {
      // If it's an SVG element, we need to convert it to a canvas first
      try {
        // Create a canvas element with the right dimensions
        const boundingRect = element.getBoundingClientRect();
        const canvas = document.createElement('canvas');
        canvas.width = boundingRect.width * 2; // Higher resolution
        canvas.height = boundingRect.height * 2;
        const ctx = canvas.getContext('2d');
        ctx.scale(2, 2); // Scale for higher resolution
        
        // Create a Blob from the SVG
        const svgData = new XMLSerializer().serializeToString(element);
        const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
        const svgUrl = URL.createObjectURL(svgBlob);
        
        // Load the SVG as an image on the canvas
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = svgUrl;
        });
        
        // Draw with white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, boundingRect.width, boundingRect.height);
        
        // Convert to data URL
        imgData = canvas.toDataURL('image/png', 1.0);
        URL.revokeObjectURL(svgUrl);
      } catch (svgError) {
        console.error('Error converting SVG to canvas:', svgError);
        
        // Fallback method using html2canvas
        if (window.html2canvas) {
          try {
            const renderedCanvas = await html2canvas(element, {
              backgroundColor: 'white',
              scale: 2,
              logging: false
            });
            imgData = renderedCanvas.toDataURL('image/png', 1.0);
          } catch (html2canvasError) {
            console.error('Fallback html2canvas also failed:', html2canvasError);
            throw new Error('Failed to capture SVG chart');
          }
        } else {
          throw new Error('html2canvas not available for fallback conversion');
        }
      }
    } else if (element.tagName.toLowerCase() === 'canvas') {
      // Use standard canvas method
      imgData = element.toDataURL('image/png', 1.0);
    } else {
      // For any other element type, try html2canvas
      if (window.html2canvas) {
        const renderedCanvas = await html2canvas(element, {
          backgroundColor: 'white',
          scale: 2,
          logging: false
        });
        imgData = renderedCanvas.toDataURL('image/png', 1.0);
      } else {
        throw new Error(`Unable to capture element type: ${element.tagName}`);
      }
    }
    
    // Calculate center position for the chart
    const pageWidth = doc.internal.pageSize.getWidth();
    const xPosition = (pageWidth - width) / 2;
    
    // Add a light background for the chart area
    doc.setFillColor(248, 249, 250); // Light gray background
    doc.roundedRect(xPosition - 5, yPosition - 5, width + 10, height + 10, 3, 3, 'F');
    
    // Add the chart image
    doc.addImage(imgData, 'PNG', xPosition, yPosition, width, height);
    
    // Add border around chart
    doc.setDrawColor(200, 200, 200);
    doc.roundedRect(xPosition - 5, yPosition - 5, width + 10, height + 10, 3, 3, 'S');
    
    return yPosition + height + 25; // Return the new Y position after adding the chart with more spacing
  } catch (error) {
    console.error('Error capturing chart:', error);
    return yPosition;
  }
}
