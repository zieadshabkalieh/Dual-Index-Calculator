import { translate } from '../../utils/i18n.js';

export function InstrumentationForm(state, onChange) {
  const form = document.createElement('div');
  form.className = 'form-section card instrumentation-card';
  
  const title = document.createElement('h3');
  title.textContent = translate('Instrumentation');
  form.appendChild(title);
  
  // Info card with detailed explanation
  const infoCard = document.createElement('div');
  infoCard.className = 'info-card info-card-instrumentation';
  
  const infoCardTitle = document.createElement('div');
  infoCardTitle.className = 'info-card-title';
  infoCardTitle.textContent = translate('About Instrumentation');
  infoCard.appendChild(infoCardTitle);
  
  const infoCardContent = document.createElement('div');
  infoCardContent.className = 'info-card-content';
  infoCardContent.innerHTML = `
    <p>${translate('This page helps you calculate the Instrumentation Score for your analytical method. The score evaluates the following parameters:')}</p>
    <ol>
      <li>${translate('Energy Consumption')}</li>
      <li>${translate('Other factors (Emission of Vapors, Automation, Miniaturization, etc)')}</li>
    </ol>
    <p>${translate('Please fill in the information below to calculate your Instrumentation Score.')}</p>
    <p><strong>${translate('Examples of energy consumption:')}</strong></p>
    <ul>
      <li>${translate('0 kWh per sample: Visual tests, physical measurements without instruments')}</li>
      <li>${translate('≤0.1 kWh per sample: Spectrophotometers, simple electrochemical methods')}</li>
      <li>${translate('≤1.5 kWh per sample: HPLC, GC, simple MS systems')}</li>
      <li>${translate('≥1.5 kWh per sample: HPLC-MS/MS, ICP-MS, other high-energy instruments')}</li>
    </ul>
  `;
  infoCard.appendChild(infoCardContent);
  form.appendChild(infoCard);
  
  // Energy consumption section
  const energySection = document.createElement('div');
  energySection.className = 'form-section energy-consumption-section';
  
  const energyGroup = createFormGroup(
    translate('Energy Consumption'),
    'energy',
    [
      { value: 'non', label: translate('Non-instrumental methods (0 kWh)'), score: '100' },
      { value: 'low', label: translate('≤0.1 kWh per sample'), score: '95' },
      { value: 'moderate', label: translate('≤1.5 kWh per sample'), score: '85' },
      { value: 'high', label: translate('>1.5 kWh per sample'), score: '75' }
    ],
    state.energy,
    (value) => onChange('energy', value)
  );
  energyGroup.classList.add('instrumentation-option');
  energySection.appendChild(energyGroup);
  form.appendChild(energySection);
  
  // Additional factors spacing
  const additionalFactorsSpacing = document.createElement('div');
  additionalFactorsSpacing.style.marginTop = '20px';
  form.appendChild(additionalFactorsSpacing);
  
  // Emissions section
  const emissionsSection = document.createElement('div');
  emissionsSection.className = 'form-section emissions-section';
  
  // Emission of Vapors
  const vaporGroup = createFormGroup(
    translate('Emission of Vapors'),
    'vaporEmission',
    [
      { value: 'yes', label: translate('Yes'), score: '-20' },
      { value: 'no', label: translate('No'), score: '0' }
    ],
    state.vaporEmission ? 'yes' : 'no',
    (value) => onChange('vaporEmission', value === 'yes')
  );
  vaporGroup.classList.add('instrumentation-option');
  emissionsSection.appendChild(vaporGroup);
  form.appendChild(emissionsSection);
  
  // Automation section
  const automationSection = document.createElement('div');
  automationSection.className = 'form-section automation-section';
  
  // Manual or non-automated
  const automatedGroup = createFormGroup(
    translate('Manual or non-automated'),
    'nonAutomated',
    [
      { value: 'yes', label: translate('Yes'), score: '-5' },
      { value: 'no', label: translate('No'), score: '0' }
    ],
    state.nonAutomated ? 'yes' : 'no',
    (value) => onChange('nonAutomated', value === 'yes')
  );
  automatedGroup.classList.add('instrumentation-option');
  automationSection.appendChild(automatedGroup);
  form.appendChild(automationSection);
  
  // Multianalyte section
  const multianalyteSection = document.createElement('div');
  multianalyteSection.className = 'form-section multianalyte-section';
  
  // Multianalyte capability
  const multianalyteGroup = createFormGroup(
    translate('Multianalyte/multiparameter method'),
    'multianalyte',
    [
      { value: 'yes', label: translate('Yes'), score: 'Add 5 to the total score' },
      { value: 'no', label: translate('No'), score: '0' }
    ],
    state.multianalyte ? 'yes' : 'no',
    (value) => onChange('multianalyte', value === 'yes')
  );
  multianalyteGroup.classList.add('instrumentation-option');
  multianalyteSection.appendChild(multianalyteGroup);
  form.appendChild(multianalyteSection);
  
  // Miniaturized section
  const miniaturizedSection = document.createElement('div');
  miniaturizedSection.className = 'form-section miniaturized-section';
  
  // Miniaturized instrument
  const miniaturizedGroup = createFormGroup(
    translate('Miniaturized and/or portable instrument'),
    'miniaturized',
    [
      { value: 'yes', label: translate('Yes'), score: 'Add 10 to the total score' },
      { value: 'no', label: translate('No'), score: '0' }
    ],
    state.miniaturized ? 'yes' : 'no',
    (value) => onChange('miniaturized', value === 'yes')
  );
  miniaturizedGroup.classList.add('instrumentation-option');
  miniaturizedSection.appendChild(miniaturizedGroup);
  form.appendChild(miniaturizedSection);
  
  // Add formula note
  const formulaNote = document.createElement('div');
  formulaNote.className = 'formula-note';
  formulaNote.style.marginTop = '20px';
  formulaNote.style.padding = '15px';
  formulaNote.style.backgroundColor = '#f0f8ff';
  formulaNote.style.borderLeft = '4px solid var(--instrumentation-color)';
  formulaNote.style.borderRadius = '8px';
  formulaNote.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)';
  formulaNote.innerHTML = translate('The instrumentation score is based on the energy consumption (100-75 points) as the base score, with adjustments for vapor emissions (-20), manual methods (-5). Additionally, multianalyte/multiparameter methods add 5 points to the total score, and miniaturized/portable instruments add 10 points to the total score. The overall score cannot exceed 100.');
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
