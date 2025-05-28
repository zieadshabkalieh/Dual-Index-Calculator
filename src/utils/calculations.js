// This file contains all the calculation logic for the EI scale
export function calculateTotalEIScore(samplePrep, instrumentation, reagents, waste, practicality) {
  // Calculate all component scores
  const samplePrepScore = calculateSamplePrepScore(samplePrep);
  const instrumentationScore = calculateInstrumentationScore(instrumentation);
  const reagentScore = calculateReagentScore(reagents);
  const wasteScore = calculateWasteScore(waste);
  
  // Calculate EI Index score (SIRW)
  // EI index = (Sample preparation score + Reagent score + Instrumentation score + Waste score) / 4
  const eiIndexScore = (samplePrepScore + instrumentationScore + reagentScore + wasteScore) / 4;
  
  // Calculate Practicality Index score if available
  let practicalityScore = 0;
  if (practicality) {
    practicalityScore = calculatePracticalityScore(practicality);
  }
  
  // Calculate base EIPI Score: 50% EI Index + 50% Practicality Index (new formula)
  let totalScore = (eiIndexScore * 0.5) + (practicalityScore * 0.5);
  
  // Add bonuses for multianalyte method and miniaturized instrument
  const multianalyteBonus = instrumentation.multianalyteBonus || 0;
  const miniaturizedBonus = instrumentation.miniaturizedBonus || 0;
  totalScore += multianalyteBonus + miniaturizedBonus;
  
  // Ensure total score is between 0 and 100
  totalScore = Math.min(100, Math.max(0, totalScore));
  
  // Format scores with one decimal place
  return {
    samplePrep: parseFloat(samplePrepScore.toFixed(1)),
    instrumentation: parseFloat(instrumentationScore.toFixed(1)),
    reagent: parseFloat(reagentScore.toFixed(1)),
    waste: parseFloat(wasteScore.toFixed(1)),
    eiIndex: parseFloat(eiIndexScore.toFixed(1)),
    practicality: parseFloat(practicalityScore.toFixed(1)),
    total: parseFloat(totalScore.toFixed(1))
  };
}

// Function to calculate Sample Preparation Score
function calculateSamplePrepScore(samplePrep) {
  // Main components scores
  let preSynthesisScore = 0;
  let samplingRequiredScore = 0;
  let sampleTypeScore = 0;
  let sampleThroughputScore = 0;
  let extractionProcedureScore = 0;
  let otherConditionsScore = 0;
  
  // 1. Pre-synthesis score (1.1 in document)
  if (samplePrep.preSynthesis === 'no') {
    preSynthesisScore = 100;
  } else {
    preSynthesisScore = 75;
    
    // Modifiers for pre-synthesis if required
    // Yield (1.1.3) - Updated with complex E factor (cEF) based scoring
    if (samplePrep.yield === 'high') {
      preSynthesisScore += 10; // cEF of 0.1 or less (>90%)
    } else if (samplePrep.yield === 'moderate') {
      preSynthesisScore += 5; // cEF > 0.1-1 (50-90%)
    } else if (samplePrep.yield === 'low') {
      preSynthesisScore -= 5; // cEF > 1 (<50%)
    }
    
    // Temperature (1.1.4)
    if (samplePrep.temperature === 'high') {
      preSynthesisScore -= 10; // High temp. for more than 1 hr or cooling less than 0°C
    } else if (samplePrep.temperature === 'room') {
      preSynthesisScore -= 5; // Room temperature more than 1 hr or heating less than 1 hr or cooling to 0°C
    } else if (samplePrep.temperature === 'none') {
      preSynthesisScore += 5; // Room temp. less than 1 hr
    }
    
    // Additional modifiers
    if (samplePrep.purification) preSynthesisScore -= 5; // 1.1.5.1
    if (samplePrep.energyConsumption) preSynthesisScore -= 5; // 1.1.6.1
    if (!samplePrep.energyConsumption) preSynthesisScore += 5; // 1.1.6.2
    if (samplePrep.nonGreenSolvent) preSynthesisScore -= 5; // 1.1.7.1
    if (!samplePrep.nonGreenSolvent) preSynthesisScore += 5; // 1.1.7.2
    if (samplePrep.occupationalHazard) preSynthesisScore -= 5; // 1.1.8.1
    if (!samplePrep.occupationalHazard) preSynthesisScore += 5; // 1.1.8.2
  }
  
  // 2. Sampling procedure (1.2 in document) - Updated values
  if (samplePrep.instrumentRequirements === 'none') {
    samplingRequiredScore = 100; // 1.2.1 - No sample preparation required
  } else if (samplePrep.instrumentRequirements === 'minimal') {
    samplingRequiredScore = 90; // 1.2.2 - Minimal sample preparation
  } else if (samplePrep.instrumentRequirements === 'moderate') {
    samplingRequiredScore = 80; // 1.2.3 - Moderate sample preparation
  } else if (samplePrep.instrumentRequirements === 'extensive') {
    samplingRequiredScore = 70; // 1.2.4 - Extensive sample preparations
  }
  
  // 3. Sampling efficiency (1.3 in document) - Updated values
  if (samplePrep.sampleType === 'simple') {
    sampleTypeScore = 100; // 1.3.1 - Simple procedure (direct dilution)
  } else if (samplePrep.sampleType === 'extensive') {
    sampleTypeScore = 75; // 1.3.2 - Extensive preparation requiring multi-step operations
  }
  
  // 4. Sample throughput (1.4 in document)
  if (samplePrep.sampleThroughput === 'high') {
    sampleThroughputScore = 100; // 1.4.1 - High sample throughput (≥60 samples/day)
  } else if (samplePrep.sampleThroughput === 'moderate') {
    sampleThroughputScore = 50; // 1.4.2 - Moderate sample throughput (30–59 samples/day)
  } else if (samplePrep.sampleThroughput === 'low') {
    sampleThroughputScore = 25; // 1.4.3 - Low sample throughput (<30 samples/day)
  }
  
  // 5. Extraction procedure (1.5 in document)
  if (samplePrep.extractionNeeded === 'no') {
    extractionProcedureScore = 100; // 1.5.1
  } else {
    extractionProcedureScore = 70; // 1.5.2 - Updated from 60 to 70
    
    // Solvent type (1.5.2.1)
    if (samplePrep.solventType === 'complete') {
      extractionProcedureScore += 10; // Use of water or eco-friendly solvents
    } else if (samplePrep.solventType === 'partial') {
      extractionProcedureScore += 5; // Partial Green solvent
    } else if (samplePrep.solventType === 'nonGreen') {
      extractionProcedureScore -= 10; // Non greener solvents
    }
    
    // Amount of the solvent (1.5.2.2) - updated values
    if (samplePrep.solventVolume === 'less0.1') {
      extractionProcedureScore += 10; // Less than 0.1 mL
    } else if (samplePrep.solventVolume === '0.1to1') {
      extractionProcedureScore += 5; // 0.1 to 1 mL
    } else if (samplePrep.solventVolume === '1to10') {
      extractionProcedureScore -= 5; // >1 to 10 mL
    } else if (samplePrep.solventVolume === 'more10') {
      extractionProcedureScore -= 10; // More than 10 mL
    }
    
    // Nature of the adsorbent (1.5.2.3)
    if (samplePrep.adsorbentNature === 'renewable') {
      extractionProcedureScore += 5; // Renewable or reusable adsorbent
    } // Non-renewable adds 0
    
    // Amount of the adsorbent (1.5.2.4)
    if (samplePrep.adsorbentAmount === 'less0.5') {
      extractionProcedureScore += 10; // Less than 0.5 g
    } else if (samplePrep.adsorbentAmount === '0.5to1') {
      extractionProcedureScore += 5; // 0.5 g - 1g
    } else if (samplePrep.adsorbentAmount === 'more1') {
      extractionProcedureScore -= 10; // Greater than 1 g
    }
  }
  
  // 6. Other conditions (1.6 in document)
  otherConditionsScore = 0;
  
  // Sampling Requires Derivatization (1.6.1)
  if (samplePrep.derivatization === true) {
    otherConditionsScore -= 10; // 1.6.1.1
  } // 'no' adds 0 (1.6.1.2)
  
  // Automated sample preparation (1.6.2)
  if (samplePrep.automatedPreparation === true) {
    otherConditionsScore += 10; // 1.6.2.1
  } // 'no' adds 0 (1.6.2.2)
  
  // Type of Sample Preparation (1.6.3)
  if (samplePrep.inSituPreparation === true) {
    otherConditionsScore += 10; // 1.6.3.1
  }
  if (samplePrep.offLine === true) {
    otherConditionsScore -= 10; // 1.6.3.2
  }
  
  // Ensure no negative scores
  preSynthesisScore = Math.max(0, preSynthesisScore);
  samplingRequiredScore = Math.max(0, samplingRequiredScore);
  sampleTypeScore = Math.max(0, sampleTypeScore);
  sampleThroughputScore = Math.max(0, sampleThroughputScore);
  extractionProcedureScore = Math.max(0, extractionProcedureScore);
  
  // Calculate final score according to the updated formula:
  // Total sample preparation score = (Pre-synthesis + Sampling procedure + Extraction) / 3 + otherConditionsScore
  // Fix calculation to match manual calculation (which resulted in 77 instead of 75)
  const mainComponentsAvg = (preSynthesisScore + samplingRequiredScore + extractionProcedureScore) / 3;
  
  // Round to the nearest integer to match manual calculations (preventing floating point discrepancies)
  let finalScore = Math.round(mainComponentsAvg) + otherConditionsScore;
  
  // Cap the score at 100
  return Math.min(100, Math.max(0, finalScore));
}

// Function to calculate Instrumentation Score
function calculateInstrumentationScore(instrumentation) {
  // Base score from energy consumption
  let score = 0;
  
  // 1. Energy Consumption
  if (instrumentation.energy === 'non') {
    score = 100; // Non-instrumental methods (0 kWh)
  } else if (instrumentation.energy === 'low') {
    score = 95; // ≤0.1 kWh per sample
  } else if (instrumentation.energy === 'moderate') {
    score = 85; // ≤1.5 kWh per sample
  } else if (instrumentation.energy === 'high') {
    score = 75; // >1.5 kWh per sample
  }
  
  // 2. Apply other modifiers
  
  // Emission of Vapors
  if (instrumentation.vaporEmission) {
    score -= 20;
  }
  
  // Manual or non-automated
  if (instrumentation.nonAutomated) {
    score -= 5;
  }
  
  // Multianalyte/multiparameter method adds 5 to total score, not to instrumentation score
  let multianalyteBonus = 0;
  if (instrumentation.multianalyte) {
    multianalyteBonus = 5;
  }
  
  // Miniaturized/portable instrument adds 10 to total score, not to instrumentation score
  let miniaturizedBonus = 0;
  if (instrumentation.miniaturized) {
    miniaturizedBonus = 10;
  }
  
  // Store these bonuses as properties that will be applied to total score later
  instrumentation.multianalyteBonus = multianalyteBonus;
  instrumentation.miniaturizedBonus = miniaturizedBonus;
  
  // Ensure score is not negative and not greater than 100
  score = Math.min(100, Math.max(0, score));
  
  return score;
}

// Function to calculate Reagent Score
function calculateReagentScore(reagents) {
  if (reagents.length === 0) {
    return 100; // If no reagents, assume perfect score (water only)
  }
  
  let totalScore = 0;
  
  // Calculate score for each reagent
  reagents.forEach(reagent => {
    let reagentScore = 0;
    
    // If it's water with zero pictograms
    if (reagent.solventType === 'water' && reagent.ghsClass === 'zero') {
      reagentScore = 100;
    }
    // Base score on GHS classification and signal word combination
    else if (reagent.ghsClass === 'zero') {
      reagentScore = 100; // Zero pictograms
    } 
    else if (reagent.ghsClass === 'one' && reagent.signalWord === 'warning') {
      // One pictogram + Warning
      switch (reagent.volume) {
        case 'less1': reagentScore = 98; break;
        case 'less10': reagentScore = 96; break;
        case 'between10And100': reagentScore = 94; break;
        case 'more100': reagentScore = 92; break;
      }
    } 
    else if ((reagent.ghsClass === 'one' && reagent.signalWord === 'danger') || 
            (reagent.ghsClass === 'two' && reagent.signalWord === 'warning')) {
      // One pictogram + Danger OR Two pictograms + Warning
      switch (reagent.volume) {
        case 'less1': reagentScore = 90; break;
        case 'less10': reagentScore = 85; break;
        case 'between10And100': reagentScore = 80; break;
        case 'more100': reagentScore = 75; break;
      }
    } 
    else if (reagent.ghsClass === 'two' && reagent.signalWord === 'danger') {
      // Two pictograms + Danger
      switch (reagent.volume) {
        case 'less1': reagentScore = 70; break;
        case 'less10': reagentScore = 65; break;
        case 'between10And100': reagentScore = 60; break;
        case 'more100': reagentScore = 55; break;
      }
    } 
    else if (reagent.ghsClass === 'three') {
      // Three or more pictograms + Danger
      switch (reagent.volume) {
        case 'less1': reagentScore = 50; break;
        case 'less10': reagentScore = 45; break;
        case 'between10And100': reagentScore = 40; break;
        case 'more100': reagentScore = 35; break;
      }
    }
    
    totalScore += reagentScore;
  });
  
  // Average the scores
  return totalScore / reagents.length;
}

// Function to calculate Waste Score
function calculateWasteScore(waste) {
  let score = 0;
  
  // Base score based on volume
  if (waste.volume === 'less1') {
    score = 100; // < 1 mL
  } else if (waste.volume === 'between1And10') {
    score = 90; // 1–10 mL
  } else if (waste.volume === 'between10And100') {
    score = 60; // 11–100 mL
  } else if (waste.volume === 'more100') {
    score = 35; // >100 mL
  }
  
  // Apply biodegradability modifier
  if (waste.biodegradable) {
    score += 10; // +10 for biodegradable waste
  } else {
    score -= 10; // -10 for non-biodegradable waste
  }
  
  // Treatment modifiers
  if (waste.treatment === 'none') {
    score -= 5;
  } else if (waste.treatment === 'less10') {
    score += 10;
  } else if (waste.treatment === 'more10') {
    score += 20;
  }
  
  // Ensure score is between 0 and 100
  score = Math.min(100, Math.max(0, score));
  
  return score;
}

// Function to calculate Practicality Index Score
function calculatePracticalityScore(practicality) {
  let score = 0;
  const defaultValues = {
    natureOfMethod: 'quantitative',
    designOfExperiment: 'factorial',
    validation: 'full',
    sensitivity: 'picogram',
    reagentCost: 'low',
    instrumentCost: 'low',
    instrumentAvailability: 'allavailable',
    maintenance: 'long',
    throughput: 'high',
    reusability: 'yes',
    // Legacy field fallbacks
    reagentAvailability: 'lowcost',
    analysisCost: 'less100',
    qbdApplied: 'yes'
  };
  
  // Use a merged object that applies defaults for any missing properties
  const p = { ...defaultValues, ...practicality };
  
  // 1. Nature of Method (10 points)
  if (p.natureOfMethod === 'quantitative') {
    score += 10; // Quantitative
  } else if (p.natureOfMethod === 'semiquantitative') {
    score += 6; // Semiquantitative
  } else if (p.natureOfMethod === 'qualitative') {
    score += 4; // Qualitative
  }
  
  // 2. QbD Applied (10 points)
  if (p.designOfExperiment === 'factorial') {
    score += 10; // Optimization
  } else if (p.designOfExperiment === 'partial') {
    score += 5; // Screening
  } else if (p.designOfExperiment === 'none') {
    score += 0; // No Design
  }
  
  // 3. Validation (10 points)
  if (p.validation === 'full') {
    score += 10; // Fully Validated
  } else if (p.validation === 'partial') {
    score += 5; // Partial
  } else if (p.validation === 'none') {
    score += 0; // Not validated
  }
  
  // 4. Sensitivity (10 points)
  if (p.sensitivity === 'picogram') {
    score += 10; // Picogram or less
  } else if (p.sensitivity === 'nanogram') {
    score += 8; // Nanogram
  } else if (p.sensitivity === 'microgram') {
    score += 5; // Microgram
  } else if (p.sensitivity === 'more') {
    score += 2; // More than microgram
  }
  
  // 5. Availability of reagent (10 points)
  // Support both new and legacy field names
  const reagentValue = p.reagentCost || (p.reagentAvailability === 'lowcost' ? 'low' : 'high');
  if (reagentValue === 'low') {
    score += 10; // Commercially available at low cost
  } else if (reagentValue === 'high') {
    score += 5; // Available at high cost
  }
  
  // 6. Cost of analysis per sample (10 points)
  // Support both new and legacy field names
  const costValue = p.instrumentCost || (p.analysisCost === 'less100' ? 'low' : 'high');
  if (costValue === 'low') {
    score += 10; // Low cost
  } else if (costValue === 'medium') {
    score += 5; // Medium cost
  } else if (costValue === 'high') {
    score += 0; // High cost
  }
  
  // 7. Availability of instruments in the analysis facility (10 points)
  if (p.instrumentAvailability === 'allavailable') {
    score += 10; // All instruments available
  } else if (p.instrumentAvailability === 'specialneeded') {
    score += 5; // Special instruments needed
  }
  
  // 8. Maintenance frequency and instrument lifetime (10 points)
  if (p.maintenance === 'long') {
    score += 10; // Long lifespan, minimal maintenance
  } else if (p.maintenance === 'moderate') {
    score += 5; // Moderate maintenance
  } else if (p.maintenance === 'frequent') {
    score += 0; // Frequent maintenance
  }
  
  // 9. Time of Analysis (Throughput) (10 points)
  if (p.throughput === 'high') {
    score += 10; // High throughput (≥25 samples/hr)
  } else if (p.throughput === 'medium') {
    score += 5; // Medium throughput
  } else if (p.throughput === 'low') {
    score += 0; // Low throughput (≤12 samples/hr)
  }
  
  // 10. Sample Reusability (10 points)
  if (p.reusability === 'yes') {
    score += 10; // Yes, sample can be reused
  } else if (p.reusability === 'no') {
    score += 0; // No, sample cannot be reused
  }
  
  // Maximum score possible is 100 (10 criteria × 10 points each)
  // No need to normalize as each criterion is worth 10 points
  
  // Ensure score is between 0 and 100
  score = Math.min(100, Math.max(0, score));
  
  return score;
}
