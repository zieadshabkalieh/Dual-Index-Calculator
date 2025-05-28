import { translate } from '../../utils/i18n.js';

export function WasteForm(state, onChange) {
  const form = document.createElement('div');
  form.className = 'form-section card waste-card';
  
  const title = document.createElement('h3');
  title.textContent = translate('Waste');
  form.appendChild(title);
  
  // Info card with detailed explanation
  const infoCard = document.createElement('div');
  infoCard.className = 'info-card info-card-waste';
  
  const infoCardTitle = document.createElement('div');
  infoCardTitle.className = 'info-card-title';
  infoCardTitle.textContent = translate('About Waste Management');
  infoCard.appendChild(infoCardTitle);
  
  const infoCardContent = document.createElement('div');
  infoCardContent.className = 'info-card-content';
  infoCardContent.innerHTML = `
    <p>${translate('This page helps you calculate the Waste Score for your analytical method. The score assesses the environmental impact of waste generation, encouraging minimal waste production and proper waste management.')}</p>
    <p>${translate('Please fill in the information below to calculate your Waste Score.')}</p>
    <p><strong>${translate('Biodegradable vs. Non-biodegradable Waste')}</strong></p>
    <ul>
      <li>${translate('Biodegradable waste includes materials that can be broken down by natural processes, such as aqueous solutions, some organic solvents, and naturally derived compounds.')}</li>
      <li>${translate('Non-biodegradable waste includes materials that persist in the environment, such as halogenated solvents, heavy metals, and many synthetic compounds.')}</li>
    </ul>
    <p><strong>${translate('Waste Treatment Options')}</strong></p>
    <ul>
      <li>${translate('No treatment: Waste is disposed of without any treatment')}</li>
      <li>${translate('Treatment with reuse: Waste is treated and reused in the analytical process, reducing the overall environmental impact')}</li>
    </ul>
  `;
  infoCard.appendChild(infoCardContent);
  form.appendChild(infoCard);
  
  // Waste volume section
  const wasteVolumeSection = document.createElement('div');
  wasteVolumeSection.className = 'form-section waste-volume-section';
  
  // Amount of waste per sample
  const volumeGroup = createFormGroup(
    translate('Amount of Waste per Sample'),
    'volume',
    [
      { value: 'less1', label: translate('< 1 mL (g)'), score: '100' },
      { value: 'between1And10', label: translate('1-10 mL (g)'), score: '90' },
      { value: 'between10And100', label: translate('11-100 mL (g)'), score: '60' },
      { value: 'more100', label: translate('> 100 mL (g)'), score: '35' }
    ],
    state.volume,
    (value) => onChange('volume', value)
  );
  volumeGroup.classList.add('waste-section');
  wasteVolumeSection.appendChild(volumeGroup);
  form.appendChild(wasteVolumeSection);
  
  // Biodegradability section
  const biodegradabilitySection = document.createElement('div');
  biodegradabilitySection.className = 'form-section biodegradability-section';
  
  // Biodegradability - converted to radio group for consistent UI
  const biodegradableGroup = createFormGroup(
    translate('Waste Biodegradability'),
    'biodegradable',
    [
      { value: 'yes', label: translate('Biodegradable waste'), score: '+10' },
      { value: 'no', label: translate('Non-biodegradable waste'), score: '-10' }
    ],
    state.biodegradable ? 'yes' : 'no',
    (value) => onChange('biodegradable', value === 'yes')
  );
  biodegradableGroup.classList.add('waste-section');
  biodegradabilitySection.appendChild(biodegradableGroup);
  form.appendChild(biodegradabilitySection);
  
  // Treatment section
  const treatmentSection = document.createElement('div');
  treatmentSection.className = 'form-section treatment-section';
  
  // Treatment
  const treatmentGroup = createFormGroup(
    translate('Treatment'),
    'treatment',
    [
      { value: 'none', label: translate('No treatment applied'), score: '-5' },
      { value: 'less10', label: translate('Treatment with reuse < 10 mL (g)'), score: '+10' },
      { value: 'more10', label: translate('Treatment with reuse > 10 mL (g)'), score: '+20' }
    ],
    state.treatment,
    (value) => onChange('treatment', value)
  );
  treatmentGroup.classList.add('waste-section');
  treatmentSection.appendChild(treatmentGroup);
  form.appendChild(treatmentSection);
  
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
    
    // Add waste-option class for styling
    radioContainer.classList.add('waste-option');
    
    group.appendChild(radioContainer);
  });
  
  return group;
}
