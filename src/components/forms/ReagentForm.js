import { translate } from '../../utils/i18n.js';

export function ReagentForm(reagents, onChange) {
  const form = document.createElement('div');
  form.className = 'form-section card reagent-card';
  
  const title = document.createElement('h3');
  title.textContent = translate('Reagents');
  form.appendChild(title);
  
  // Info card with detailed explanation
  const infoCard = document.createElement('div');
  infoCard.className = 'info-card info-card-reagent';
  
  const infoCardTitle = document.createElement('div');
  infoCardTitle.className = 'info-card-title';
  infoCardTitle.textContent = translate('About Reagents');
  infoCard.appendChild(infoCardTitle);
  
  const infoCardContent = document.createElement('div');
  infoCardContent.className = 'info-card-content';
  infoCardContent.innerHTML = `
    <p>${translate('This page helps you calculate the Reagent Score for your analytical method. The score evaluates the environmental sustainability and safety of solvents used, with emphasis on selecting greener and less hazardous reagents.')}</p>
    <p>${translate('Please add information about each solvent used in your method.')}</p>
    <p><strong>${translate('Note:')}</strong> ${translate('If "Not available" is selected for Signal Word, consider setting GHS Classification to "Zero pictograms". Similarly, if "Zero pictograms" is chosen for GHS Classification, "Not available" would be the appropriate Signal Word.')}</p>
  `;
  infoCard.appendChild(infoCardContent);
  form.appendChild(infoCard);
  
  // Current reagents list
  const reagentsList = document.createElement('div');
  reagentsList.className = 'reagents-container';
  reagentsList.style.display = 'grid';
  reagentsList.style.gridTemplateColumns = 'repeat(auto-fill, minmax(450px, 1fr))';
  reagentsList.style.gap = '20px';
  
  // Display existing reagents
  reagents.forEach((reagent, index) => {
    const reagentItem = createReagentItem(reagent, index, (updatedReagent) => {
      const newReagents = [...reagents];
      newReagents[index] = updatedReagent;
      onChange(newReagents);
    }, () => {
      const newReagents = reagents.filter((_, i) => i !== index);
      onChange(newReagents);
    });
    
    reagentsList.appendChild(reagentItem);
  });
  
  form.appendChild(reagentsList);
  
  // Add new reagent - modern UI style
  const addSolventContainer = document.createElement('div');
  addSolventContainer.className = 'add-solvent-container';
  
  const addSolventTitle = document.createElement('div');
  addSolventTitle.className = 'add-solvent-title';
  addSolventTitle.textContent = translate('Add Another Solvent');
  addSolventContainer.appendChild(addSolventTitle);
  
  const addSolventDescription = document.createElement('div');
  addSolventDescription.textContent = translate('Click to add another solvent or reagent to your calculation');
  addSolventContainer.appendChild(addSolventDescription);
  
  addSolventContainer.addEventListener('click', () => {
    const newReagent = {
      id: 'reagent_' + Date.now(), // Ensure unique ID
      solventType: 'water',
      signalWord: 'notAvailable',
      ghsClass: 'zero',
      volume: 'less1'
    };
    
    onChange([...reagents, newReagent]);
  });
  
  form.appendChild(addSolventContainer);
  
  // Help text
  const helpText = document.createElement('div');
  helpText.className = 'help-text';
  helpText.innerHTML = `
    <p><strong>${translate('GHS Classification Guide:')}</strong></p>
    <ul>
      <li>${translate('Zero pictograms: No hazard (generally for water)')}</li>
      <li>${translate('One pictogram: Low hazard')}</li>
      <li>${translate('Two pictograms: Moderate hazard')}</li>
      <li>${translate('Three or more pictograms: High hazard')}</li>
    </ul>
    <p><strong>${translate('Note:')}</strong> ${translate('If "Not available" is selected for Signal Word, consider setting GHS Classification to "Zero pictograms". Similarly, if "Zero pictograms" is chosen for GHS Classification, "Not available" would be the appropriate Signal Word.')}</p>
    <p>${translate('The total Reagent Score is the average of all individual reagent scores.')}</p>
  `;
  
  form.appendChild(helpText);
  
  return form;
}

function createReagentItem(reagent, index, onUpdate, onRemove) {
  const reagentItem = document.createElement('div');
  reagentItem.className = 'reagent-item form-section reagent-cost-section';
  
  // Create a header for the reagent
  const reagentHeader = document.createElement('div');
  reagentHeader.style.display = 'flex';
  reagentHeader.style.justifyContent = 'space-between';
  reagentHeader.style.alignItems = 'center';
  
  // Create title for the reagent
  const reagentTitle = document.createElement('h4');
  reagentTitle.textContent = `${translate('Add Solvent')}`;
  reagentHeader.appendChild(reagentTitle);
  
  // Add remove button to the header
  const headerRemoveButton = document.createElement('button');
  headerRemoveButton.className = 'remove-btn';
  headerRemoveButton.innerHTML = '×';
  headerRemoveButton.addEventListener('click', onRemove);
  reagentHeader.appendChild(headerRemoveButton);
  
  // Add the header to the reagent item
  reagentItem.appendChild(reagentHeader);
  
  // Create a form layout with 3 sections, each with 2 fields
  const formLayout = document.createElement('div');
  formLayout.style.display = 'grid';
  formLayout.style.gridTemplateColumns = 'repeat(2, 1fr)';
  formLayout.style.gap = '15px';
  
  // FIRST ROW - Solvent Type and Solvent Name
  // 1. Solvent Type
  const solventTypeGroup = document.createElement('div');
  solventTypeGroup.className = 'reagent-form-group';
  
  const solventTypeLabel = document.createElement('label');
  solventTypeLabel.className = 'reagent-form-label';
  solventTypeLabel.textContent = translate('Solvent Type');
  solventTypeGroup.appendChild(solventTypeLabel);
  
  const solventTypeSelect = document.createElement('select');
  solventTypeSelect.className = 'form-control';
  
  const solventTypes = [
    { value: 'water', label: translate('Water') },
    { value: 'organic', label: translate('Organic Solvent') },
    { value: 'acid', label: translate('Acid') },
    { value: 'base', label: translate('Base') },
    { value: 'buffer', label: translate('Buffer') },
    { value: 'other', label: translate('Other') }
  ];
  
  solventTypes.forEach(type => {
    const option = document.createElement('option');
    option.value = type.value;
    option.textContent = type.label;
    if (type.value === reagent.solventType) {
      option.selected = true;
    }
    solventTypeSelect.appendChild(option);
  });
  
  solventTypeSelect.addEventListener('change', (e) => {
    const newSolventType = e.target.value;
    let updatedReagent = {
      ...reagent,
      solventType: newSolventType
    };
    
    if (newSolventType === 'water') {
      updatedReagent.signalWord = 'notAvailable';
      updatedReagent.ghsClass = 'zero';
      delete updatedReagent.solventName;
      
      // When water is selected, hide the solvent name field
      const solventNameField = reagentItem.querySelector('.solvent-name-field');
      if (solventNameField) {
        solventNameField.style.display = 'none';
      }
    } else {
      // Show the solvent name field for non-water solvents
      const solventNameField = reagentItem.querySelector('.solvent-name-field');
      if (solventNameField) {
        solventNameField.style.display = 'block';
      }
    }
    
    onUpdate(updatedReagent);
  });
  
  solventTypeGroup.appendChild(solventTypeSelect);
  formLayout.appendChild(solventTypeGroup);
  
  // 2. Solvent Name
  const solventNameGroup = document.createElement('div');
  solventNameGroup.className = 'reagent-form-group solvent-name-field';
  // Initially hide or show based on solvent type
  solventNameGroup.style.display = reagent.solventType === 'water' ? 'none' : 'block';
  
  const solventNameLabel = document.createElement('label');
  solventNameLabel.className = 'reagent-form-label';
  solventNameLabel.textContent = translate('Solvent Name');
  solventNameGroup.appendChild(solventNameLabel);
  
  const solventNameInput = document.createElement('input');
  solventNameInput.type = 'text';
  solventNameInput.className = 'form-control';
  solventNameInput.placeholder = translate('Enter specific solvent name (e.g., Methanol, HCl, NaOH)');
  solventNameInput.value = reagent.solventName || '';
  
  solventNameInput.addEventListener('change', (e) => {
    onUpdate({
      ...reagent,
      solventName: e.target.value
    });
  });
  
  solventNameGroup.appendChild(solventNameInput);
  formLayout.appendChild(solventNameGroup);
  
  // SECOND ROW - Signal Word and GHS Classification
  // 3. Signal Word
  const signalWordGroup = document.createElement('div');
  signalWordGroup.className = 'reagent-form-group';
  
  const signalWordLabelContainer = document.createElement('div');
  signalWordLabelContainer.className = 'reagent-field-with-help';
  
  const signalWordLabel = document.createElement('label');
  signalWordLabel.className = 'reagent-form-label';
  signalWordLabel.textContent = translate('Signal Word');
  signalWordLabelContainer.appendChild(signalWordLabel);
  
  const signalWordHelp = document.createElement('span');
  signalWordHelp.className = 'reagent-help-icon';
  signalWordHelp.textContent = '?';
  signalWordHelp.title = translate('Signal words are "Warning" or "Danger" on GHS hazard labels');
  signalWordLabelContainer.appendChild(signalWordHelp);
  
  signalWordGroup.appendChild(signalWordLabelContainer);
  
  const signalWordSelect = document.createElement('select');
  signalWordSelect.className = 'form-control';
  
  const signalWords = [
    { value: 'warning', label: translate('Warning') },
    { value: 'danger', label: translate('Danger') },
    { value: 'notAvailable', label: translate('Not available') }
  ];
  
  signalWords.forEach(word => {
    const option = document.createElement('option');
    option.value = word.value;
    option.textContent = word.label;
    if (word.value === reagent.signalWord) {
      option.selected = true;
    }
    signalWordSelect.appendChild(option);
  });
  
  signalWordSelect.addEventListener('change', (e) => {
    const newSignalWord = e.target.value;
    let updatedReagent = {
      ...reagent,
      signalWord: newSignalWord
    };
    
    // If signal word is set to "Not available", suggest setting GHS to "Zero pictograms"
    if (newSignalWord === 'notAvailable' && reagent.ghsClass !== 'zero') {
      if (confirm(translate('Signal Word is set to "Not available". Would you like to set GHS Classification to "Zero pictograms"?'))) {
        updatedReagent.ghsClass = 'zero';
      }
    }
    
    onUpdate(updatedReagent);
  });
  
  signalWordGroup.appendChild(signalWordSelect);
  formLayout.appendChild(signalWordGroup);
  
  // 4. GHS Classification
  const ghsClassGroup = document.createElement('div');
  ghsClassGroup.className = 'reagent-form-group';
  
  const ghsClassLabelContainer = document.createElement('div');
  ghsClassLabelContainer.className = 'reagent-field-with-help';
  
  const ghsClassLabel = document.createElement('label');
  ghsClassLabel.className = 'reagent-form-label';
  ghsClassLabel.textContent = translate('GHS Classification');
  ghsClassLabelContainer.appendChild(ghsClassLabel);
  
  const ghsClassHelp = document.createElement('span');
  ghsClassHelp.className = 'reagent-help-icon';
  ghsClassHelp.textContent = '?';
  ghsClassHelp.title = translate('Number of GHS hazard pictograms on the chemical\'s label');
  ghsClassLabelContainer.appendChild(ghsClassHelp);
  
  ghsClassGroup.appendChild(ghsClassLabelContainer);
  
  const ghsClassSelect = document.createElement('select');
  ghsClassSelect.className = 'form-control';
  
  const ghsClasses = [
    { value: 'zero', label: translate('Zero pictograms') },
    { value: 'one', label: translate('One pictogram') },
    { value: 'two', label: translate('Two pictograms') },
    { value: 'three', label: translate('Three or more pictograms') }
  ];
  
  ghsClasses.forEach(cls => {
    const option = document.createElement('option');
    option.value = cls.value;
    option.textContent = cls.label;
    if (cls.value === reagent.ghsClass) {
      option.selected = true;
    }
    ghsClassSelect.appendChild(option);
  });
  
  ghsClassSelect.addEventListener('change', (e) => {
    const newGhsClass = e.target.value;
    let updatedReagent = {
      ...reagent,
      ghsClass: newGhsClass
    };
    
    // If GHS is set to "Zero pictograms", suggest setting Signal Word to "Not available"
    if (newGhsClass === 'zero' && reagent.signalWord !== 'notAvailable') {
      if (confirm(translate('GHS Classification is set to "Zero pictograms". Would you like to set Signal Word to "Not available"?'))) {
        updatedReagent.signalWord = 'notAvailable';
      }
    }
    
    onUpdate(updatedReagent);
  });
  
  ghsClassGroup.appendChild(ghsClassSelect);
  formLayout.appendChild(ghsClassGroup);
  
  // THIRD ROW - Volume Used
  // 5. Volume Used
  const volumeGroup = document.createElement('div');
  volumeGroup.className = 'reagent-form-group';
  volumeGroup.style.gridColumn = '1 / 3'; // Make it span 2 columns
  
  const volumeLabel = document.createElement('label');
  volumeLabel.className = 'reagent-form-label';
  volumeLabel.textContent = translate('Volume Used');
  volumeGroup.appendChild(volumeLabel);
  
  const volumeSelect = document.createElement('select');
  volumeSelect.className = 'form-control';
  
  const volumes = [
    { value: 'less1', label: translate('< 1 mL (g)') },
    { value: 'less10', label: translate('1-10 mL (g)') },
    { value: 'between10And100', label: translate('10.1-100 mL (g)') },
    { value: 'more100', label: translate('> 100 mL (g)') }
  ];
  
  volumes.forEach(volume => {
    const option = document.createElement('option');
    option.value = volume.value;
    option.textContent = volume.label;
    if (volume.value === reagent.volume) {
      option.selected = true;
    }
    volumeSelect.appendChild(option);
  });
  
  volumeSelect.addEventListener('change', (e) => {
    onUpdate({
      ...reagent,
      volume: e.target.value
    });
  });
  
  volumeGroup.appendChild(volumeSelect);
  formLayout.appendChild(volumeGroup);
  
  reagentItem.appendChild(formLayout);
  
  return reagentItem;
}

function calculateReagentScore(reagent) {
  // If it's water, score is 100
  if (reagent.solventType === 'water' && reagent.ghsClass === 'zero') {
    return 100;
  }
  
  // Base score on GHS classification and signal word combination
  let baseScore = 0;
  
  if (reagent.ghsClass === 'zero') {
    baseScore = 100; // Zero pictograms
  } else if (reagent.ghsClass === 'one' && reagent.signalWord === 'warning') {
    // One pictogram + Warning
    switch (reagent.volume) {
      case 'less1': return 98;
      case 'less10': return 96;
      case 'between10And100': return 94;
      case 'more100': return 92;
    }
  } else if ((reagent.ghsClass === 'one' && reagent.signalWord === 'danger') || 
            (reagent.ghsClass === 'two' && reagent.signalWord === 'warning')) {
    // One pictogram + Danger OR Two pictograms + Warning
    switch (reagent.volume) {
      case 'less1': return 90;
      case 'less10': return 85;
      case 'between10And100': return 80;
      case 'more100': return 75;
    }
  } else if (reagent.ghsClass === 'two' && reagent.signalWord === 'danger') {
    // Two pictograms + Danger
    switch (reagent.volume) {
      case 'less1': return 70;
      case 'less10': return 65;
      case 'between10And100': return 60;
      case 'more100': return 55;
    }
  } else if (reagent.ghsClass === 'three') {
    // Three or more pictograms + Danger
    switch (reagent.volume) {
      case 'less1': return 50;
      case 'less10': return 45;
      case 'between10And100': return 40;
      case 'more100': return 35;
    }
  }
  
  return baseScore;
}