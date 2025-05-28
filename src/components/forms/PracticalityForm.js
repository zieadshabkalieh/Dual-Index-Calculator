import { translate } from '../../utils/i18n.js';

export function PracticalityForm(state, onChange) {
  const form = document.createElement('div');
  form.className = 'form-section card practicality-card';
  
  const title = document.createElement('h3');
  title.textContent = translate('Practicality Index');
  form.appendChild(title);
  
  // Info card with detailed explanation
  const infoCard = document.createElement('div');
  infoCard.className = 'info-card info-card-practicality';
  
  const infoCardTitle = document.createElement('div');
  infoCardTitle.className = 'info-card-title';
  infoCardTitle.textContent = translate('About Practicality Index');
  infoCard.appendChild(infoCardTitle);
  
  const infoCardContent = document.createElement('div');
  infoCardContent.className = 'info-card-content';
  infoCardContent.innerHTML = `
    <p>${translate('The Practicality Index (PI) accounts for 50% of the total Dual Index score. It measures the real-world applicability and efficiency of an analytical method.')}</p>
    <p>${translate('Please fill in the information below to calculate your Practicality Index (PI).')}</p>
  `;
  infoCard.appendChild(infoCardContent);
  form.appendChild(infoCard);
  
  // Method Characteristics Section
  const methodSection = document.createElement('div');
  methodSection.className = 'form-section method-characteristics-section';
  
  // 1. Nature of Method
  const natureGroup = createFormGroup(
    translate('Nature of Method'),
    'natureOfMethod',
    [
      { value: 'quantitative', label: translate('Quantitative'), score: '10' },
      { value: 'semiquantitative', label: translate('Semiquantitative'), score: '6' },
      { value: 'qualitative', label: translate('Qualitative'), score: '4' }
    ],
    state.natureOfMethod || 'quantitative',
    (value) => onChange('natureOfMethod', value)
  );
  natureGroup.classList.add('practicality-option');
  methodSection.appendChild(natureGroup);
  
  // 2. QbD Applied (using designOfExperiment field)
  const designGroup = createFormGroup(
    translate('QbD Applied'),
    'designOfExperiment',
    [
      { value: 'factorial', label: translate('Optimization'), score: '10' },
      { value: 'partial', label: translate('Screening'), score: '5' },
      { value: 'none', label: translate('No Design'), score: '0' }
    ],
    state.designOfExperiment || 'factorial',
    (value) => onChange('designOfExperiment', value)
  );
  designGroup.classList.add('practicality-option');
  methodSection.appendChild(designGroup);
  form.appendChild(methodSection);
  
  // Validation Section
  const validationSection = document.createElement('div');
  validationSection.className = 'form-section validation-section';
  
  // 3. Validation
  const validationGroup = createFormGroup(
    translate('Validation'),
    'validation',
    [
      { value: 'full', label: translate('Fully Validated'), score: '10' },
      { value: 'partial', label: translate('Partial'), score: '5' },
      { value: 'none', label: translate('Not validated'), score: '0' }
    ],
    state.validation || 'full',
    (value) => onChange('validation', value)
  );
  validationGroup.classList.add('practicality-option');
  validationSection.appendChild(validationGroup);
  
  // 4. Sensitivity
  const sensitivityGroup = createFormGroup(
    translate('Sensitivity'),
    'sensitivity',
    [
      { value: 'picogram', label: translate('Picogram'), score: '10' },
      { value: 'nanogram', label: translate('Nanogram'), score: '8' },
      { value: 'microgram', label: translate('Microgram'), score: '5' },
      { value: 'more', label: translate('>Microgram'), score: '2' }
    ],
    state.sensitivity || 'picogram',
    (value) => onChange('sensitivity', value)
  );
  sensitivityGroup.classList.add('practicality-option');
  validationSection.appendChild(sensitivityGroup);
  form.appendChild(validationSection);
  
  // Cost Section
  const costSection = document.createElement('div');
  costSection.className = 'form-section reagent-cost-section';
  
  // 5. Availability of reagent
  const reagentCostGroup = createFormGroup(
    translate('Availability of reagent'),
    'reagentCost',
    [
      { value: 'low', label: translate('Commercially available in low cost'), score: '10' },
      { value: 'high', label: translate('Available at high cost'), score: '5' }
    ],
    state.reagentCost || 'low',
    (value) => onChange('reagentCost', value)
  );
  reagentCostGroup.classList.add('practicality-option');
  costSection.appendChild(reagentCostGroup);
  
  // 6. Cost of analysis per sample
  const instrumentCostGroup = createFormGroup(
    translate('Cost of analysis per sample'),
    'instrumentCost',
    [
      { value: 'low', label: translate('Low cost (< $100)'), score: '10' },
      { value: 'medium', label: translate('Medium cost'), score: '5' },
      { value: 'high', label: translate('High cost (> $300)'), score: '0' }
    ],
    state.instrumentCost || 'low',
    (value) => onChange('instrumentCost', value)
  );
  instrumentCostGroup.classList.add('practicality-option');
  costSection.appendChild(instrumentCostGroup);
  form.appendChild(costSection);
  
  // Instrumentation Section
  const instrumentationSection = document.createElement('div');
  instrumentationSection.className = 'form-section instrumentation-section';
  
  // 7. Availability of instruments in the analysis facility
  const instrumentAvailabilityGroup = createFormGroup(
    translate('Availability of instruments in the analysis facility'),
    'instrumentAvailability',
    [
      { value: 'allavailable', label: translate('All instrument available'), score: '10' },
      { value: 'specialneeded', label: translate('One or more special instrument needed'), score: '5' }
    ],
    state.instrumentAvailability || 'allavailable',
    (value) => onChange('instrumentAvailability', value)
  );
  instrumentAvailabilityGroup.classList.add('practicality-option');
  instrumentationSection.appendChild(instrumentAvailabilityGroup);
  
  // 8. Maintenance frequency and instrument lifetime
  const maintenanceGroup = createFormGroup(
    translate('Maintenance frequency and instrument lifetime'),
    'maintenance',
    [
      { value: 'long', label: translate('Long lifespans and minimal maintenance'), score: '10' },
      { value: 'moderate', label: translate('Moderate maintenance'), score: '5' },
      { value: 'frequent', label: translate('Frequent repairs or replacement'), score: '0' }
    ],
    state.maintenance || 'long',
    (value) => onChange('maintenance', value)
  );
  maintenanceGroup.classList.add('practicality-option');
  instrumentationSection.appendChild(maintenanceGroup);
  form.appendChild(instrumentationSection);
  
  // Efficiency Section
  const efficiencySection = document.createElement('div');
  efficiencySection.className = 'form-section efficiency-section';
  
  // 9. Time of Analysis (Throughput)
  const throughputGroup = createFormGroup(
    translate('Time of Analysis (Throughput)'),
    'throughput',
    [
      { value: 'high', label: translate('High throughput (≥25 samples/hr)'), score: '10' },
      { value: 'medium', label: translate('Medium throughput (13-24 samples/hr)'), score: '5' },
      { value: 'low', label: translate('Low throughput (≤12 samples/hr)'), score: '0' }
    ],
    state.throughput || 'high',
    (value) => onChange('throughput', value)
  );
  throughputGroup.classList.add('practicality-option');
  efficiencySection.appendChild(throughputGroup);
  
  // 10. Sample Reusability
  const reusabilityGroup = createFormGroup(
    translate('Sample Reusability'),
    'reusability',
    [
      { value: 'yes', label: translate('Yes, sample can be reused'), score: '10' },
      { value: 'no', label: translate('No, sample cannot be reused'), score: '0' }
    ],
    state.reusability || 'yes',
    (value) => onChange('reusability', value)
  );
  reusabilityGroup.classList.add('practicality-option');
  efficiencySection.appendChild(reusabilityGroup);
  form.appendChild(efficiencySection);
  
  // We've removed the "Criteria and Scoring Scheme" section as requested
  
  // Add formula note
  const formulaNote = document.createElement('div');
  formulaNote.className = 'formula-note';
  formulaNote.style.marginTop = '20px';
  formulaNote.style.padding = '15px';
  formulaNote.style.backgroundColor = '#f0f8ff';
  formulaNote.style.borderLeft = '4px solid var(--practicality-color)';
  formulaNote.style.borderRadius = '8px';
  formulaNote.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)';
  formulaNote.innerHTML = `
    <p>${translate('Practicality Index (PI) = ∑ (Weighted scores from 10 core criteria)')}</p>
    <p>${translate('EIPI Total Score = (EI score × 0.5) + (PI × 0.5)')}</p>
    <p>${translate('EIPI Total Score Significance:')}</p>
    <ul>
      <li>${translate('75-100: Green and practical efficient method')}</li>
      <li>${translate('Less than 75-50: Acceptable')}</li>
      <li>${translate('Less than 50: Non green and impractical')}</li>
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
    radio.addEventListener('change', () => onChange(option.value));
    
    // Create custom radio visual element
    const radioCheckmark = document.createElement('span');
    radioCheckmark.className = 'radio-checkmark';
    
    // Create label text
    const labelText = document.createTextNode(option.label);
    
    // Create score display
    const scoreSpan = document.createElement('span');
    scoreSpan.className = 'option-score';
    scoreSpan.textContent = option.score;
    
    // Append all elements
    radioContainer.appendChild(radio);
    radioContainer.appendChild(radioCheckmark);
    radioContainer.appendChild(labelText);
    radioContainer.appendChild(scoreSpan);
    
    group.appendChild(radioContainer);
  });
  
  return group;
}