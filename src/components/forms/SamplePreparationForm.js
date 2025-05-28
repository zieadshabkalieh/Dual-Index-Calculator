import { translate } from '../../utils/i18n.js';

export function SamplePreparationForm(state, onChange) {
  const form = document.createElement('div');
  form.className = 'form-section card sample-prep-card';
  
  const title = document.createElement('h3');
  title.textContent = translate('Sample Preparation');
  form.appendChild(title);
  
  // Info card with detailed explanation
  const infoCard = document.createElement('div');
  infoCard.className = 'info-card info-card-sample-prep';
  
  const infoCardTitle = document.createElement('div');
  infoCardTitle.className = 'info-card-title';
  infoCardTitle.textContent = translate('About Sample Preparation');
  infoCard.appendChild(infoCardTitle);
  
  const infoCardContent = document.createElement('div');
  infoCardContent.className = 'info-card-content';
  infoCardContent.innerHTML = `
    <p>${translate('This section helps you calculate the Sample Preparation Score for your analytical method. Sample preparation is a critical step in environmental impact assessment, as it often involves chemicals, energy, and resources.')}</p>
    <ol>
      <li>${translate('Pre-synthesis - Any chemical preparation before the actual analysis')}</li>
      <li>${translate('Sampling procedure - Type and complexity of sampling preparation needed')}</li>
      <li>${translate('Extraction procedure - Methods used to extract analytes with solvent and adsorbent considerations')}</li>
      <li>${translate('Other conditions - Additional factors affecting environmental impact including:')}</li>
      <ul>
        <li>${translate('Derivatization/digestion requirements')}</li>
        <li>${translate('Automated sample preparation')}</li>
        <li>${translate('Type of sample preparation (in situ vs offline)')}</li>
        <li>${translate('Sample efficiency based on throughput')}</li>
      </ul>
    </ol>
    <p>${translate('Please fill in the information below to calculate your Sample Preparation Score.')}</p>
  `;
  infoCard.appendChild(infoCardContent);
  form.appendChild(infoCard);
  
  // Pre-synthesis
  const preSynthesisSection = document.createElement('div');
  preSynthesisSection.className = 'form-section presynthesis-section';
  
  const preSynthesisGroup = createFormGroup(
    translate('Pre-synthesis'),
    'preSynthesis',
    [
      { value: 'no', label: translate('No pre-synthesis required (100)'), score: '100' },
      { value: 'yes', label: translate('Pre-synthesis required (75)'), score: '75' }
    ],
    state.preSynthesis || 'no',
    (value) => onChange('preSynthesis', value)
  );
  form.appendChild(preSynthesisGroup);
  
  // Show additional options if pre-synthesis is required
  if (state.preSynthesis === 'yes') {
    // Yield - Updated with complex E factor (cEF) information
    const yieldGroup = createFormGroup(
      translate('Yield*'),
      'yield',
      [
        { value: 'high', label: translate('High yield: cEF of 0.1 or less (>90%) (10)'), score: '10' },
        { value: 'moderate', label: translate('Moderate yield: cEF > 0.1-1 (50-90%) (5)'), score: '5' },
        { value: 'low', label: translate('Low yield: cEF > 1 (<50%) (-5)'), score: '-5' }
      ],
      state.yield || 'high',
      (value) => onChange('yield', value)
    );
    
    // Add cEF formula explanation
    const cEFExplanation = document.createElement('div');
    cEFExplanation.className = 'cef-explanation';
    cEFExplanation.innerHTML = `
      <p><strong>${translate('Complex E factor (cEF)')}</strong></p>
      <p>${translate('cEF = (Mass of all raw materials + Reagents + Solvents + Water - Mass of Product) / (Mass of Product)')}</p>
    `;
    cEFExplanation.style.fontSize = '0.9em';
    cEFExplanation.style.fontStyle = 'italic';
    cEFExplanation.style.backgroundColor = '#f8f9fa';
    cEFExplanation.style.padding = '10px';
    cEFExplanation.style.borderRadius = '5px';
    cEFExplanation.style.marginTop = '5px';
    cEFExplanation.style.marginLeft = '15px';
    cEFExplanation.style.marginBottom = '15px';
    
    yieldGroup.style.marginLeft = '15px';
    form.appendChild(yieldGroup);
    form.appendChild(cEFExplanation);
    
    // Temperature
    const temperatureGroup = createFormGroup(
      translate('Temperature'),
      'temperature',
      [
        { value: 'high', label: translate('High temp. for more than 1 hr or cooling less than 0°C (-10)'), score: '-10' },
        { value: 'room', label: translate('Room temperature more than 1 hr or heating less than 1 hr or cooling to 0°C (-5)'), score: '-5' },
        { value: 'low', label: translate('Room temp. less than 1 hr (+5)'), score: '5' }
      ],
      state.temperature || 'room',
      (value) => onChange('temperature', value)
    );
    temperatureGroup.style.marginLeft = '15px';
    form.appendChild(temperatureGroup);
    
    // Purification needed
    const purificationGroup = createFormGroup(
      translate('Purification needed'),
      'purification',
      [
        { value: 'yes', label: translate('Yes (-5)'), score: '-5' },
        { value: 'no', label: translate('No (5)'), score: '5' }
      ],
      state.purification === true ? 'yes' : 'no',
      (value) => onChange('purification', value === 'yes')
    );
    purificationGroup.style.marginLeft = '15px';
    form.appendChild(purificationGroup);
    
    // High energy consumption equipment
    const energyGroup = createFormGroup(
      translate('High energy consumption equipment >1.5 kW per sample'),
      'energyConsumption',
      [
        { value: 'yes', label: translate('Yes (-5)'), score: '-5' },
        { value: 'no', label: translate('No (5)'), score: '5' }
      ],
      state.energyConsumption === true ? 'yes' : 'no',
      (value) => onChange('energyConsumption', value === 'yes')
    );
    energyGroup.style.marginLeft = '15px';
    form.appendChild(energyGroup);
    
    // Use of non-green solvent with GHS detail
    const solventGroup = createFormGroup(
      translate('Use of non-green solvent**'),
      'nonGreenSolvent',
      [
        { value: 'yes', label: translate('Yes (-5)'), score: '-5' },
        { value: 'no', label: translate('No (5)'), score: '5' }
      ],
      state.nonGreenSolvent === true ? 'yes' : 'no',
      (value) => onChange('nonGreenSolvent', value === 'yes')
    );
    solventGroup.style.marginLeft = '15px';
    form.appendChild(solventGroup);
    
    // Add GHS explanation for non-green solvent
    const ghsExplanation = document.createElement('div');
    ghsExplanation.className = 'ghs-explanation';
    ghsExplanation.innerHTML = `
      <p>${translate('** 2 or more pictograms in GHS with danger signal word')}</p>
    `;
    ghsExplanation.style.fontSize = '0.9em';
    ghsExplanation.style.fontStyle = 'italic';
    ghsExplanation.style.color = '#666';
    ghsExplanation.style.marginTop = '5px';
    ghsExplanation.style.marginLeft = '15px';
    ghsExplanation.style.marginBottom = '15px';
    form.appendChild(ghsExplanation);
    
    // Presence of occupational hazard
    const hazardGroup = createFormGroup(
      translate('Presence of occupational hazard'),
      'occupationalHazard',
      [
        { value: 'yes', label: translate('Yes (-5)'), score: '-5' },
        { value: 'no', label: translate('No (5)'), score: '5' }
      ],
      state.occupationalHazard === true ? 'yes' : 'no',
      (value) => onChange('occupationalHazard', value === 'yes')
    );
    hazardGroup.style.marginLeft = '15px';
    form.appendChild(hazardGroup);
  }
  
  // Sampling procedure with new options as specified
  const samplingProcedureSection = document.createElement('div');
  samplingProcedureSection.className = 'form-section sampling-procedure-section';
  
  const instrumentRequirementsGroup = createFormGroup(
    translate('Sampling procedure'),
    'instrumentRequirements',
    [
      { value: 'none', label: translate('NO Sampling is required -Ex. ATR technique or direct analysis (100)'), score: '100' },
      { value: 'yes', label: translate('YES (See options below)'), score: '0' }
    ],
    state.instrumentRequirements === 'none' ? 'none' : 'yes',
    (value) => {
      if (value === 'none') {
        onChange('instrumentRequirements', 'none');
        // Hide sampling procedure options if "No" is selected
        document.getElementById('samplingProcedureOptions')?.setAttribute('style', 'display: none');
      } else {
        // Show sampling procedure options if "Yes" is selected and default to 'minimal' if not already set
        if (state.instrumentRequirements === 'none') {
          onChange('instrumentRequirements', 'minimal');
        }
        document.getElementById('samplingProcedureOptions')?.setAttribute('style', 'display: block');
      }
    }
  );
  form.appendChild(instrumentRequirementsGroup);
  
  // Sampling procedure options (conditional on selecting "Yes" above)
  const samplingOptionsDiv = document.createElement('div');
  samplingOptionsDiv.id = 'samplingProcedureOptions';
  samplingOptionsDiv.style.marginLeft = '20px';
  samplingOptionsDiv.style.padding = '10px';
  samplingOptionsDiv.style.backgroundColor = '#f9f9f9';
  samplingOptionsDiv.style.borderRadius = '5px';
  samplingOptionsDiv.style.marginBottom = '15px';
  
  // Hide initially if "No" is selected
  if (state.instrumentRequirements === 'none') {
    samplingOptionsDiv.style.display = 'none';
  }
  
  // First group for sample preparation complexity (minimal, moderate, extensive)
  const samplingComplexityGroup = createFormGroup(
    translate('Sample Preparation Type'),
    'samplingProcedureType',
    [
      { value: 'minimal', label: translate('Minimal sample as in UV and spectrofluorimetric (90)'), score: '90' },
      { value: 'moderate', label: translate('Moderate sample preparation HPLC (Filtration or sonication) (80)'), score: '80' },
      { value: 'extensive', label: translate('Extensive sample preparations (bioanalytical methods) (70)'), score: '70' }
    ],
    state.instrumentRequirements === 'none' ? 'minimal' : 
      (state.instrumentRequirements === 'minimal' || state.instrumentRequirements === 'moderate' || state.instrumentRequirements === 'extensive') ? 
      state.instrumentRequirements : 'minimal',
    (value) => {
      onChange('instrumentRequirements', value);
      // Make sure to reset in-situ and offline
      onChange('inSituPreparation', false);
      onChange('offLine', false);
    }
  );
  
  // Second group for sample preparation method (in-situ vs offline)
  const samplingMethodGroup = createFormGroup(
    translate('Sample Processing Method'),
    'samplingMethod',
    [
      { value: 'insitu', label: translate('In situ sample preparation (10)'), score: '10' },
      { value: 'offline', label: translate('Offline (-10)'), score: '-10' }
    ],
    state.inSituPreparation ? 'insitu' : (state.offLine ? 'offline' : 'insitu'),
    (value) => {
      // Update the properties based on selection
      onChange('inSituPreparation', value === 'insitu');
      onChange('offLine', value === 'offline');
    }
  );
  
  // Add both groups to the sampling options div
  samplingOptionsDiv.appendChild(samplingComplexityGroup);
  
  // Adding some spacing between the groups
  const spacerDiv = document.createElement('div');
  spacerDiv.style.height = '15px';
  samplingOptionsDiv.appendChild(spacerDiv);
  
  // Add the second group
  samplingOptionsDiv.appendChild(samplingMethodGroup);
  
  // Add the complete div to the form
  form.appendChild(samplingOptionsDiv);
  
  // Moving Sample throughput to Other Conditions section as requested
  
  // Extraction procedure
  const extractionSection = document.createElement('div');
  extractionSection.className = 'form-section extraction-procedure-section';
  
  const extractionGroup = createFormGroup(
    translate('Extraction procedure'),
    'extractionNeeded',
    [
      { value: 'no', label: translate('No extraction needed (100)'), score: '100' },
      { value: 'yes', label: translate('Extraction needed (70)'), score: '70' }
    ],
    state.extractionNeeded || 'no',
    (value) => onChange('extractionNeeded', value)
  );
  form.appendChild(extractionGroup);
  
  // Show extraction details if extraction is needed
  if (state.extractionNeeded === 'yes') {
    // Type of matrix
    const matrixTypeGroup = createFormGroup(
      translate('Type of matrix'),
      'matrixType',
      [
        { value: 'simple', label: translate('Simple matrices such as bulk drug or pharmaceutical tablets (+10)'), score: '10' },
        { value: 'pharma', label: translate('Matrices such as other pharmaceutical dosage form excluding tablet (-5)'), score: '-5' },
        { value: 'complex', label: translate('Complex matrices such as, food, biological and environmental samples (-10)'), score: '-10' }
      ],
      state.matrixType || 'simple',
      (value) => onChange('matrixType', value)
    );
    matrixTypeGroup.style.marginLeft = '15px';
    form.appendChild(matrixTypeGroup);
    
    // Solvent Type with detailed descriptions
    const solventTypeGroup = createFormGroup(
      translate('Solvent Type'),
      'solventType',
      [
        { value: 'complete', label: translate('Use of water or eco-friendly solvents (+10)'), score: '10' },
        { value: 'partial', label: translate('Partial Green solvent (+5)'), score: '5' },
        { value: 'nongreen', label: translate('Non greener solvents (-10)'), score: '-10' }
      ],
      state.solventType || 'complete',
      (value) => onChange('solventType', value)
    );
    solventTypeGroup.style.marginLeft = '15px';
    form.appendChild(solventTypeGroup);
    
    // Add explanations for solvent types
    const solventExplanations = document.createElement('div');
    solventExplanations.className = 'solvent-explanations';
    solventExplanations.style.fontSize = '0.9em';
    solventExplanations.style.fontStyle = 'italic';
    solventExplanations.style.color = '#666';
    solventExplanations.style.marginTop = '5px';
    solventExplanations.style.marginLeft = '15px';
    solventExplanations.style.marginBottom = '15px';
    solventExplanations.innerHTML = `
      <p>${translate('** 2 or more pictograms in GHS with danger signal word')}</p>
      <p>${translate('*** 2 pictogram with warning signal or 1 pictogram with warning or danger signal')}</p>
    `;
    form.appendChild(solventExplanations);
    
    // Amount of the solvent
    const solventVolumeGroup = createFormGroup(
      translate('Amount of the solvent'),
      'solventVolume',
      [
        { value: 'less0.1', label: translate('Less than 0.1 mL (+10)'), score: '10' },
        { value: '0.1to1', label: translate('0.1 to 1 mL (+5)'), score: '5' },
        { value: '1to10', label: translate('>1 to 10 mL (-5)'), score: '-5' },
        { value: 'more10', label: translate('More than 10 mL (-10)'), score: '-10' }
      ],
      state.solventVolume || 'less0.1',
      (value) => onChange('solventVolume', value)
    );
    solventVolumeGroup.style.marginLeft = '15px';
    form.appendChild(solventVolumeGroup);
    
    // Nature of the adsorbent
    const adsorbentNatureGroup = createFormGroup(
      translate('Nature of the adsorbent'),
      'adsorbentNature',
      [
        { value: 'renewable', label: translate('If the adsorbent renewable or reusable (+5)'), score: '5' },
        { value: 'nonrenewable', label: translate('No adsorbent or Not Used (0)'), score: '0' }
      ],
      state.adsorbentNature || 'renewable',
      (value) => {
        onChange('adsorbentNature', value);
        // Show/hide adsorbent amount field based on selection
        const amountField = document.getElementById('adsorbentAmountGroup');
        if (amountField) {
          amountField.style.display = value === 'nonrenewable' ? 'none' : 'block';
        }
      }
    );
    adsorbentNatureGroup.style.marginLeft = '15px';
    form.appendChild(adsorbentNatureGroup);
    
    // Amount of the adsorbent - only shown when adsorbent is used
    const adsorbentAmountGroup = createFormGroup(
      translate('Amount of the adsorbent'),
      'adsorbentAmount',
      [
        { value: 'less0.5', label: translate('Less than 0.5 g (+10)'), score: '10' },
        { value: '0.5to1', label: translate('0.5 g - 1g (+5)'), score: '5' },
        { value: 'more1', label: translate('Greater than 1 g (-10)'), score: '-10' }
      ],
      state.adsorbentAmount || 'less0.5',
      (value) => onChange('adsorbentAmount', value)
    );
    adsorbentAmountGroup.style.marginLeft = '15px';
    adsorbentAmountGroup.id = 'adsorbentAmountGroup';
    // Hide initially if no adsorbent is used
    if (state.adsorbentNature === 'nonrenewable') {
      adsorbentAmountGroup.style.display = 'none';
    }
    form.appendChild(adsorbentAmountGroup);
  }
  
  // Other conditions section 
  const otherConditionsSection = document.createElement('div');
  otherConditionsSection.className = 'form-section other-conditions-section';
  
  const otherConditionsHeader = document.createElement('h4');
  otherConditionsHeader.textContent = translate('Other conditions');
  otherConditionsHeader.style.marginTop = '0';
  otherConditionsSection.appendChild(otherConditionsHeader);
  // Sampling Requires Derivatization/Digestion
  const derivatizationGroup = createFormGroup(
    translate('Sampling Requires Derivatization/Digestion or extra steps'),
    'derivatization',
    [
      { value: 'yes', label: translate('Yes (-10)'), score: '-10' },
      { value: 'no', label: translate('No or Not Available (0)'), score: '0' }
    ],
    state.derivatization ? 'yes' : 'no',
    (value) => onChange('derivatization', value === 'yes')
  );
  otherConditionsSection.appendChild(derivatizationGroup);
  
  // Automated sample preparation
  const automatedPrepGroup = createFormGroup(
    translate('Automated sample preparation'),
    'automatedPreparation',
    [
      { value: 'yes', label: translate('Yes (10)'), score: '10' },
      { value: 'no', label: translate('No or Not Available (0)'), score: '0' }
    ],
    state.automatedPreparation ? 'yes' : 'no',
    (value) => onChange('automatedPreparation', value === 'yes')
  );
  otherConditionsSection.appendChild(automatedPrepGroup);
  
  // Type of Sample Preparation is now integrated in the sampling procedure options above
  
  // Sample throughput
  const sampleThroughputGroup = createFormGroup(
    translate('Sample throughput'),
    'sampleThroughput',
    [
      { value: 'high', label: translate('High sample throughput (≥60 samples/day) (+5)'), score: '5' },
      { value: 'moderate', label: translate('Moderate sample throughput (30–59 samples/day) (0)'), score: '0' },
      { value: 'low', label: translate('Low sample throughput (<30 samples/day) (-5)'), score: '-5' }
    ],
    state.sampleThroughput || 'high',
    (value) => onChange('sampleThroughput', value)
  );
  otherConditionsSection.appendChild(sampleThroughputGroup);
  
  form.appendChild(otherConditionsSection);
  
  // Add formula note
  const formulaNote = document.createElement('div');
  formulaNote.className = 'formula-note';
  formulaNote.style.marginTop = '20px';
  formulaNote.style.padding = '15px';
  formulaNote.style.backgroundColor = '#f0f8ff';
  formulaNote.style.borderLeft = '4px solid var(--sample-prep-color)';
  formulaNote.style.borderRadius = '8px';
  formulaNote.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)';
  formulaNote.innerHTML = `
    <p><strong>${translate('Total sample preparation score = (Pre-synthesis + Sampling procedure + Extraction procedure) / 3 + Others')}</strong></p>
    <p>${translate('Other condition modifiers:')}</p>
    <ul>
      <li>${translate('Sampling requires derivatization/digestion: -10 points')}</li>
      <li>${translate('Automated sample preparation: +10 points')}</li>
      <li>${translate('In situ sample preparation: +10 points')}</li>
      <li>${translate('Offline sample preparation: -10 points')}</li>
      <li>${translate('High sample throughput (≥60 samples/day): +5 points')}</li>
      <li>${translate('Moderate sample throughput (30–59 samples/day): 0 points')}</li>
      <li>${translate('Low sample throughput (<30 samples/day): -5 points')}</li>
    </ul>
  `;
  form.appendChild(formulaNote);
  
  return form;
}

function createFormGroup(label, name, options, selectedValue, onChange) {
  const group = document.createElement('div');
  group.className = 'form-group';
  
  const groupLabel = document.createElement('label');
  groupLabel.textContent = label;
  groupLabel.htmlFor = name;
  groupLabel.style.fontSize = '1.2rem';
  groupLabel.style.fontWeight = '600';
  groupLabel.style.marginBottom = '15px';
  groupLabel.style.display = 'block';
  group.appendChild(groupLabel);
  
  options.forEach((option, index) => {
    // Create a container div for the entire option
    const optionContainer = document.createElement('div');
    optionContainer.className = 'radio-option sample-prep-option';
    if (selectedValue === option.value) {
      optionContainer.classList.add('selected');
    }
    
    // Create custom radio container
    const radioContainer = document.createElement('label');
    radioContainer.className = 'custom-radio-container';
    radioContainer.htmlFor = `${name}_${option.value}`;
    
    // Create actual radio input (hidden)
    const radio = document.createElement('input');
    radio.className = 'custom-radio-input';
    radio.type = 'radio';
    radio.id = `${name}_${option.value}`;
    radio.name = name;
    radio.value = option.value;
    radio.checked = selectedValue === option.value;
    radio.addEventListener('change', () => {
      onChange(option.value);
      
      // Update selected class on change
      const options = group.querySelectorAll('.radio-option');
      options.forEach(opt => opt.classList.remove('selected'));
      optionContainer.classList.add('selected');
    });
    
    // Create custom radio visual element
    const radioCheckmark = document.createElement('span');
    radioCheckmark.className = 'radio-checkmark';
    
    // Create label content
    const labelContent = document.createElement('span');
    labelContent.className = 'radio-label-content';
    labelContent.textContent = option.label;
    
    // Create score display
    const scoreSpan = document.createElement('span');
    scoreSpan.className = 'option-score';
    scoreSpan.textContent = option.score;
    
    // Append all elements
    radioContainer.appendChild(radio);
    radioContainer.appendChild(radioCheckmark);
    radioContainer.appendChild(labelContent);
    radioContainer.appendChild(scoreSpan);
    
    // Add the radio container to the option container
    optionContainer.appendChild(radioContainer);
    
    // Add to form group
    group.appendChild(optionContainer);
  });
  
  return group;
}
