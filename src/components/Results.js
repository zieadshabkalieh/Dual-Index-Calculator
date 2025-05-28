import { translate, onLanguageChange, offLanguageChange } from '../utils/i18n.js';
// Simplified version - not using complex visualizations
// import { DualColumnHistogram } from './visualizations/DualColumnHistogram.js';
// import { RadarChart } from './visualizations/RadarChart.js';

export function Results(scores, eiColorClass, practicalityColorClass) {
  console.log("Rendering Results component with scores:", scores);
  
  // Create the main element that will be returned
  const resultsElement = document.createElement('div');
  resultsElement.className = 'results-component';
  
  // Function to handle language changes - simplified, no auto-rebuilding
  const handleLanguageChange = () => {
    console.log("Language changed, re-rendering Results [DISABLED REBUILD]");
    // We've disabled automatic rebuilding on language change to prevent freezing
    // This should be manually triggered by navigating away and back to the Results tab
  };
  
  // Register for language change notifications
  onLanguageChange(handleLanguageChange);
  
  // Create enhanced gauge with modern styling for displaying scores
  const createScoreGauge = (score, maxScore, color, size = 180, label = '') => {
    const gaugeContainer = document.createElement('div');
    gaugeContainer.className = 'enhanced-gauge-container';
    gaugeContainer.style.position = 'relative';
    gaugeContainer.style.width = `${size}px`;
    gaugeContainer.style.height = `${size}px`;
    gaugeContainer.style.margin = '0 auto';
    gaugeContainer.style.display = 'flex';
    gaugeContainer.style.flexDirection = 'column';
    gaugeContainer.style.alignItems = 'center';
    
    // SVG gauge with enhanced styling
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 120 120');
    svg.style.filter = 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))';
    
    // Create gradient definitions
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    
    // Background gradient
    const bgGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    bgGradient.setAttribute('id', `bgGradient-${Date.now()}`);
    bgGradient.setAttribute('x1', '0%');
    bgGradient.setAttribute('y1', '0%');
    bgGradient.setAttribute('x2', '100%');
    bgGradient.setAttribute('y2', '100%');
    
    const bgStop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    bgStop1.setAttribute('offset', '0%');
    bgStop1.setAttribute('stop-color', '#f0f0f0');
    
    const bgStop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    bgStop2.setAttribute('offset', '100%');
    bgStop2.setAttribute('stop-color', '#e0e0e0');
    
    bgGradient.appendChild(bgStop1);
    bgGradient.appendChild(bgStop2);
    defs.appendChild(bgGradient);
    
    // Progress gradient
    const progressGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    progressGradient.setAttribute('id', `progressGradient-${Date.now()}`);
    progressGradient.setAttribute('x1', '0%');
    progressGradient.setAttribute('y1', '0%');
    progressGradient.setAttribute('x2', '100%');
    progressGradient.setAttribute('y2', '100%');
    
    const progressStop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    progressStop1.setAttribute('offset', '0%');
    progressStop1.setAttribute('stop-color', color);
    
    const progressStop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    progressStop2.setAttribute('offset', '100%');
    progressStop2.setAttribute('stop-color', adjustColor(color, -20));
    
    progressGradient.appendChild(progressStop1);
    progressGradient.appendChild(progressStop2);
    defs.appendChild(progressGradient);
    
    svg.appendChild(defs);
    
    // Background circle with gradient
    const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    bgCircle.setAttribute('cx', '60');
    bgCircle.setAttribute('cy', '60');
    bgCircle.setAttribute('r', '50');
    bgCircle.setAttribute('fill', 'none');
    bgCircle.setAttribute('stroke', `url(#bgGradient-${Date.now()})`);
    bgCircle.setAttribute('stroke-width', '8');
    svg.appendChild(bgCircle);
    
    // Inner shadow circle
    const shadowCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    shadowCircle.setAttribute('cx', '60');
    shadowCircle.setAttribute('cy', '60');
    shadowCircle.setAttribute('r', '46');
    shadowCircle.setAttribute('fill', 'none');
    shadowCircle.setAttribute('stroke', 'rgba(0,0,0,0.1)');
    shadowCircle.setAttribute('stroke-width', '2');
    svg.appendChild(shadowCircle);
    
    // Progress circle with gradient
    const progressCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    progressCircle.setAttribute('cx', '60');
    progressCircle.setAttribute('cy', '60');
    progressCircle.setAttribute('r', '50');
    progressCircle.setAttribute('fill', 'none');
    progressCircle.setAttribute('stroke', `url(#progressGradient-${Date.now()})`);
    progressCircle.setAttribute('stroke-width', '8');
    progressCircle.setAttribute('stroke-linecap', 'round');
    
    // Calculate the circumference and offset for the progress
    const circumference = 2 * Math.PI * 50;
    const progressValue = score / maxScore;
    const offset = circumference * (1 - progressValue);
    
    progressCircle.setAttribute('stroke-dasharray', circumference);
    progressCircle.setAttribute('stroke-dashoffset', offset);
    progressCircle.setAttribute('transform', 'rotate(-90 60 60)');
    svg.appendChild(progressCircle);
    
    // Outer highlight ring
    const highlightRing = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    highlightRing.setAttribute('cx', '60');
    highlightRing.setAttribute('cy', '60');
    highlightRing.setAttribute('r', '54');
    highlightRing.setAttribute('fill', 'none');
    highlightRing.setAttribute('stroke', 'rgba(255,255,255,0.6)');
    highlightRing.setAttribute('stroke-width', '1');
    svg.appendChild(highlightRing);
    
    // Center background
    const centerBg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    centerBg.setAttribute('cx', '60');
    centerBg.setAttribute('cy', '60');
    centerBg.setAttribute('r', '32');
    centerBg.setAttribute('fill', 'rgba(255,255,255,0.95)');
    centerBg.setAttribute('stroke', 'rgba(0,0,0,0.1)');
    centerBg.setAttribute('stroke-width', '1');
    svg.appendChild(centerBg);
    
    // Score text with enhanced styling
    const scoreText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    scoreText.setAttribute('x', '60');
    scoreText.setAttribute('y', '56');
    scoreText.setAttribute('text-anchor', 'middle');
    scoreText.setAttribute('dominant-baseline', 'middle');
    scoreText.setAttribute('font-size', '22');
    scoreText.setAttribute('font-weight', 'bold');
    scoreText.setAttribute('fill', color);
    scoreText.setAttribute('font-family', 'Arial, sans-serif');
    scoreText.textContent = score.toFixed(1);
    svg.appendChild(scoreText);
    
    // Percentage symbol
    const percentText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    percentText.setAttribute('x', '60');
    percentText.setAttribute('y', '68');
    percentText.setAttribute('text-anchor', 'middle');
    percentText.setAttribute('dominant-baseline', 'middle');
    percentText.setAttribute('font-size', '10');
    percentText.setAttribute('font-weight', 'normal');
    percentText.setAttribute('fill', '#666');
    percentText.setAttribute('font-family', 'Arial, sans-serif');
    percentText.textContent = 'points';
    svg.appendChild(percentText);
    
    // Add decorative elements
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30) * (Math.PI / 180);
      const x1 = 60 + 58 * Math.cos(angle);
      const y1 = 60 + 58 * Math.sin(angle);
      const x2 = 60 + 54 * Math.cos(angle);
      const y2 = 60 + 54 * Math.sin(angle);
      
      const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      tick.setAttribute('x1', x1);
      tick.setAttribute('y1', y1);
      tick.setAttribute('x2', x2);
      tick.setAttribute('y2', y2);
      tick.setAttribute('stroke', '#ccc');
      tick.setAttribute('stroke-width', '1');
      svg.appendChild(tick);
    }
    
    gaugeContainer.appendChild(svg);
    
    // Add label if provided
    if (label) {
      const labelElement = document.createElement('div');
      labelElement.textContent = label;
      labelElement.style.marginTop = '10px';
      labelElement.style.fontSize = '14px';
      labelElement.style.fontWeight = 'bold';
      labelElement.style.color = '#333';
      labelElement.style.textAlign = 'center';
      gaugeContainer.appendChild(labelElement);
    }
    
    return gaugeContainer;
  };
  
  // Helper function to adjust color brightness
  function adjustColor(color, amount) {
    const usePound = color[0] === '#';
    const col = usePound ? color.slice(1) : color;
    const num = parseInt(col, 16);
    let r = (num >> 16) + amount;
    let g = (num >> 8 & 0x00FF) + amount;
    let b = (num & 0x0000FF) + amount;
    r = r > 255 ? 255 : r < 0 ? 0 : r;
    g = g > 255 ? 255 : g < 0 ? 0 : g;
    b = b > 255 ? 255 : b < 0 ? 0 : b;
    return (usePound ? '#' : '') + (r << 16 | g << 8 | b).toString(16).padStart(6, '0');
  }
  
  // Create horizontal progress bar
  const createHorizontalProgressBar = (score, maxScore, color, label) => {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'horizontal-progress-container';
    progressContainer.style.width = '100%';
    progressContainer.style.marginBottom = '15px';
    
    const labelDiv = document.createElement('div');
    labelDiv.className = 'progress-label';
    labelDiv.style.display = 'flex';
    labelDiv.style.justifyContent = 'space-between';
    labelDiv.style.marginBottom = '5px';
    
    const nameSpan = document.createElement('span');
    nameSpan.textContent = label;
    nameSpan.style.fontWeight = 'bold';
    
    const valueSpan = document.createElement('span');
    valueSpan.textContent = score.toFixed(1);
    valueSpan.style.color = color;
    valueSpan.style.fontWeight = 'bold';
    
    labelDiv.appendChild(nameSpan);
    labelDiv.appendChild(valueSpan);
    progressContainer.appendChild(labelDiv);
    
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar-bg';
    progressBar.style.height = '10px';
    progressBar.style.width = '100%';
    progressBar.style.backgroundColor = '#e6e6e6';
    progressBar.style.borderRadius = '5px';
    progressBar.style.overflow = 'hidden';
    
    const progressFill = document.createElement('div');
    progressFill.className = 'progress-bar-fill';
    progressFill.style.height = '100%';
    progressFill.style.width = `${(score / maxScore) * 100}%`;
    progressFill.style.backgroundColor = color;
    progressFill.style.borderRadius = '5px';
    // Removed transition to prevent animation issues
    
    progressBar.appendChild(progressFill);
    progressContainer.appendChild(progressBar);
    
    return progressContainer;
  };
  
  // Create hexagon info card
  const createHexagonCard = (title, value, interpretation, color) => {
    const card = document.createElement('div');
    card.className = 'hexagon-card';
    card.style.position = 'relative';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.alignItems = 'center';
    card.style.padding = '25px 15px 15px';
    card.style.backgroundColor = '#fff';
    card.style.borderRadius = '8px';
    card.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
    card.style.margin = '10px';
    card.style.flex = '1';
    card.style.minWidth = '220px';
    
    // Hexagon background
    const hexagon = document.createElement('div');
    hexagon.className = 'hexagon-shape';
    hexagon.style.position = 'absolute';
    hexagon.style.top = '-25px';
    hexagon.style.width = '50px';
    hexagon.style.height = '28.87px'; // height = width * 0.5774
    hexagon.style.backgroundColor = color;
    hexagon.style.transform = 'rotate(30deg)';
    
    // Additional shapes to complete the hexagon
    const hex1 = document.createElement('div');
    hex1.style.position = 'absolute';
    hex1.style.top = '0';
    hex1.style.left = '0';
    hex1.style.width = '100%';
    hex1.style.height = '100%';
    hex1.style.backgroundColor = color;
    hex1.style.transform = 'rotate(-60deg)';
    hexagon.appendChild(hex1);
    
    const hex2 = document.createElement('div');
    hex2.style.position = 'absolute';
    hex2.style.top = '0';
    hex2.style.left = '0';
    hex2.style.width = '100%';
    hex2.style.height = '100%';
    hex2.style.backgroundColor = color;
    hex2.style.transform = 'rotate(60deg)';
    hexagon.appendChild(hex2);
    
    card.appendChild(hexagon);
    
    // Title
    const titleElement = document.createElement('h4');
    titleElement.textContent = title;
    titleElement.style.marginTop = '15px';
    titleElement.style.marginBottom = '10px';
    titleElement.style.textAlign = 'center';
    card.appendChild(titleElement);
    
    // Value
    const valueElement = document.createElement('div');
    valueElement.textContent = value;
    valueElement.style.fontSize = '28px';
    valueElement.style.fontWeight = 'bold';
    valueElement.style.color = color;
    valueElement.style.marginBottom = '8px';
    card.appendChild(valueElement);
    
    // Interpretation
    const interpretationElement = document.createElement('div');
    interpretationElement.textContent = interpretation;
    interpretationElement.style.fontSize = '15px';
    interpretationElement.style.textAlign = 'center';
    interpretationElement.style.padding = '5px 8px';
    interpretationElement.style.backgroundColor = `${color}22`; // Add transparency to color
    interpretationElement.style.borderRadius = '5px';
    interpretationElement.style.fontWeight = 'bold';
    card.appendChild(interpretationElement);
    
    return card;
  };
  
  // Create interpretation scale card
  const createScaleCard = (scaleData, activeColor) => {
    const container = document.createElement('div');
    container.className = 'scale-card-container';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '10px';
    container.style.backgroundColor = '#f8f9fa';
    container.style.padding = '15px';
    container.style.borderRadius = '8px';
    container.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
    container.style.marginTop = '20px';
    
    // Title
    const title = document.createElement('h5');
    title.textContent = translate('Interpretation Scale');
    title.style.marginTop = '0';
    title.style.marginBottom = '10px';
    title.style.textAlign = 'center';
    container.appendChild(title);
    
    // Scale items
    const scaleContainer = document.createElement('div');
    scaleContainer.style.display = 'flex';
    scaleContainer.style.flexDirection = 'column';
    scaleContainer.style.gap = '5px';
    
    scaleData.forEach(item => {
      const scaleItem = document.createElement('div');
      scaleItem.className = 'scale-item';
      scaleItem.style.display = 'flex';
      scaleItem.style.alignItems = 'center';
      scaleItem.style.padding = '8px';
      scaleItem.style.borderRadius = '4px';
      scaleItem.style.border = item.color === activeColor ? `2px solid ${item.color}` : '2px solid transparent';
      scaleItem.style.backgroundColor = item.color === activeColor ? `${item.color}22` : 'transparent';
      
      // Color indicator
      const colorDot = document.createElement('div');
      colorDot.style.width = '15px';
      colorDot.style.height = '15px';
      colorDot.style.borderRadius = '50%';
      colorDot.style.backgroundColor = item.color;
      colorDot.style.marginRight = '10px';
      colorDot.style.flexShrink = '0';
      scaleItem.appendChild(colorDot);
      
      // Text
      const textContainer = document.createElement('div');
      textContainer.style.flexGrow = '1';
      
      const range = document.createElement('div');
      range.style.fontWeight = 'bold';
      range.style.marginBottom = '2px';
      range.textContent = item.range;
      textContainer.appendChild(range);
      
      const description = document.createElement('div');
      description.style.fontSize = '12px';
      description.textContent = item.description;
      textContainer.appendChild(description);
      
      scaleItem.appendChild(textContainer);
      
      // Check mark for active item
      if (item.color === activeColor) {
        const checkMark = document.createElement('div');
        checkMark.textContent = '✓';
        checkMark.style.fontWeight = 'bold';
        checkMark.style.marginLeft = '5px';
        scaleItem.appendChild(checkMark);
      }
      
      scaleContainer.appendChild(scaleItem);
    });
    
    container.appendChild(scaleContainer);
    
    return container;
  };
  
  // Create circular progress segments
  const createComponentsCircle = (componentScores) => {
    const container = document.createElement('div');
    container.className = 'components-circle-container';
    container.style.position = 'relative';
    container.style.width = '250px';
    container.style.height = '250px';
    container.style.margin = '0 auto';
    
    // SVG for components circle
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 120 120');
    
    // Colors for each component
    const colors = {
      samplePrep: '#4CAF50',      // Green
      instrumentation: '#2196F3', // Blue
      reagent: '#FF9800',         // Orange
      waste: '#9C27B0'            // Purple
    };
    
    // Component names
    const componentNames = {
      samplePrep: translate('Sample Preparation'),
      instrumentation: translate('Instrumentation'),
      reagent: translate('Reagent'),
      waste: translate('Waste')
    };
    
    // Background circle
    const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    bgCircle.setAttribute('cx', '60');
    bgCircle.setAttribute('cy', '60');
    bgCircle.setAttribute('r', '54');
    bgCircle.setAttribute('fill', 'none');
    bgCircle.setAttribute('stroke', '#e6e6e6');
    bgCircle.setAttribute('stroke-width', '12');
    svg.appendChild(bgCircle);
    
    // Calculate total circumference
    const circumference = 2 * Math.PI * 54;
    
    // Spacing between segments (in radians)
    const spacing = 0.05;
    
    // Create an array of components to draw
    const components = [
      { name: 'samplePrep', value: componentScores.samplePrep },
      { name: 'instrumentation', value: componentScores.instrumentation },
      { name: 'reagent', value: componentScores.reagent },
      { name: 'waste', value: componentScores.waste }
    ];
    
    // Sort by value (ascending)
    components.sort((a, b) => a.value - b.value);
    
    // Available angle after accounting for spacing
    const totalAngle = 2 * Math.PI - (components.length * spacing);
    
    // Calculate sum of all values
    const sum = components.reduce((acc, comp) => acc + comp.value, 0);
    
    // Start angle (top of circle, then shifted to account for first spacing)
    let currentAngle = -Math.PI / 2 + spacing / 2;
    
    // Create a circular legend
    const legend = document.createElement('div');
    legend.className = 'circle-legend';
    legend.style.marginTop = '20px';
    legend.style.display = 'flex';
    legend.style.flexWrap = 'wrap';
    legend.style.justifyContent = 'center';
    legend.style.gap = '10px';
    
    // Draw each component segment
    components.forEach((component, index) => {
      // Calculate angle for this component
      const segmentAngle = (component.value / sum) * totalAngle;
      
      // Calculate start and end points on the circle
      const startX = 60 + 54 * Math.cos(currentAngle);
      const startY = 60 + 54 * Math.sin(currentAngle);
      
      const endX = 60 + 54 * Math.cos(currentAngle + segmentAngle);
      const endY = 60 + 54 * Math.sin(currentAngle + segmentAngle);
      
      // Determine if arc should be drawn along major (1) or minor (0) arc
      const largeArcFlag = segmentAngle > Math.PI ? 1 : 0;
      
      // Create path for this segment
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const pathData = [
        `M ${startX} ${startY}`, // Move to start point
        `A 54 54 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Draw arc
        `L 60 60`, // Draw line to center
        `Z` // Close path
      ].join(' ');
      
      path.setAttribute('d', pathData);
      path.setAttribute('fill', colors[component.name]);
      svg.appendChild(path);
      
      // Add text label near the arc
      const labelAngle = currentAngle + segmentAngle / 2;
      const labelRadius = 35; // Smaller than the circle radius
      const labelX = 60 + labelRadius * Math.cos(labelAngle);
      const labelY = 60 + labelRadius * Math.sin(labelAngle);
      
      const textLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      textLabel.setAttribute('x', labelX);
      textLabel.setAttribute('y', labelY);
      textLabel.setAttribute('text-anchor', 'middle');
      textLabel.setAttribute('dominant-baseline', 'middle');
      textLabel.setAttribute('fill', '#fff');
      textLabel.setAttribute('font-size', '8');
      textLabel.setAttribute('font-weight', 'bold');
      textLabel.textContent = component.value.toFixed(0);
      svg.appendChild(textLabel);
      
      // Add to legend
      const legendItem = document.createElement('div');
      legendItem.className = 'legend-item';
      legendItem.style.display = 'flex';
      legendItem.style.alignItems = 'center';
      
      const colorBox = document.createElement('div');
      colorBox.style.width = '12px';
      colorBox.style.height = '12px';
      colorBox.style.backgroundColor = colors[component.name];
      colorBox.style.marginRight = '5px';
      colorBox.style.borderRadius = '2px';
      
      const nameSpan = document.createElement('span');
      nameSpan.style.fontSize = '13px';
      nameSpan.textContent = `${componentNames[component.name]} (${component.value.toFixed(1)})`;
      
      legendItem.appendChild(colorBox);
      legendItem.appendChild(nameSpan);
      legend.appendChild(legendItem);
      
      // Update current angle for next segment, adding spacing
      currentAngle += segmentAngle + spacing;
    });
    
    // Add EI Index in center
    const centerText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    centerText.setAttribute('x', '60');
    centerText.setAttribute('y', '55');
    centerText.setAttribute('text-anchor', 'middle');
    centerText.setAttribute('dominant-baseline', 'middle');
    centerText.setAttribute('font-size', '10');
    centerText.setAttribute('font-weight', 'bold');
    centerText.textContent = translate('EI Index');
    svg.appendChild(centerText);
    
    const centerValue = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    centerValue.setAttribute('x', '60');
    centerValue.setAttribute('y', '68');
    centerValue.setAttribute('text-anchor', 'middle');
    centerValue.setAttribute('dominant-baseline', 'middle');
    centerValue.setAttribute('font-size', '18');
    centerValue.setAttribute('font-weight', 'bold');
    centerValue.textContent = componentScores.eiIndex.toFixed(1);
    svg.appendChild(centerValue);
    
    container.appendChild(svg);
    container.appendChild(legend);
    
    return container;
  };
  
  // Create score badge
  const createScoreBadge = (score, label, color, maxWidth = 250) => {
    const badge = document.createElement('div');
    badge.className = 'score-badge';
    badge.style.backgroundColor = '#fff';
    badge.style.padding = '15px';
    badge.style.borderRadius = '8px';
    badge.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.1)';
    badge.style.textAlign = 'center';
    badge.style.maxWidth = `${maxWidth}px`;
    badge.style.margin = '0 auto';
    
    const scoreValue = document.createElement('div');
    scoreValue.className = 'score-value';
    scoreValue.textContent = score.toFixed(1);
    scoreValue.style.fontSize = '36px';
    scoreValue.style.fontWeight = 'bold';
    scoreValue.style.color = color;
    scoreValue.style.marginBottom = '5px';
    
    const scoreLabel = document.createElement('div');
    scoreLabel.className = 'score-label';
    scoreLabel.textContent = label;
    scoreLabel.style.fontSize = '16px';
    scoreLabel.style.color = '#666';
    
    badge.appendChild(scoreValue);
    badge.appendChild(scoreLabel);
    
    return badge;
  };
  
  // THIS FUNCTION IS NOW REPLACED BY buildResultsContent - KEPT FOR REFERENCE ONLY
  const oldRenderResults = () => {
    // This function has been intentionally disabled
    console.log("Old render function is deprecated - using buildResultsContent instead");
    // Leaving this here for reference but not using it anymore
    resultsContainer.style.padding = '30px';
    resultsContainer.style.marginBottom = '30px';
    
    // Results header
    const header = document.createElement('div');
    header.className = 'results-header';
    header.style.marginBottom = '30px';
    header.style.borderBottom = '2px solid #f0f0f0';
    header.style.paddingBottom = '20px';
    
    const title = document.createElement('h2');
    title.textContent = translate('Dual Index Results');
    title.style.fontSize = '28px';
    title.style.fontWeight = 'bold';
    title.style.color = '#333';
    title.style.margin = '0 0 10px 0';
    
    const subtitle = document.createElement('p');
    subtitle.textContent = translate('Environmental Impact and Practicality Assessment');
    subtitle.style.fontSize = '16px';
    subtitle.style.color = '#666';
    subtitle.style.margin = '0';
    
    header.appendChild(title);
    header.appendChild(subtitle);
    resultsContainer.appendChild(header);
    
    // Check if all component scores are available
    const missingScores = [];
    if (scores.samplePrep === 0) missingScores.push(translate('Sample Preparation'));
    if (scores.reagent === 0) missingScores.push(translate('Reagent'));
    if (scores.instrumentation === 0) missingScores.push(translate('Instrumentation'));
    if (scores.waste === 0) missingScores.push(translate('Waste'));
    
    if (missingScores.length > 0) {
      // Display message for missing scores
      const missingScoresInfo = document.createElement('div');
      missingScoresInfo.className = 'info-card';
      missingScoresInfo.style.backgroundColor = '#fff3cd';
      missingScoresInfo.style.color = '#856404';
      missingScoresInfo.style.padding = '20px';
      missingScoresInfo.style.borderRadius = '8px';
      missingScoresInfo.style.border = '1px solid #ffeeba';
      missingScoresInfo.style.marginBottom = '20px';
      
      missingScoresInfo.innerHTML = `
        <h4 style="margin-top: 0; color: #856404;">${translate('Complete All Components')}</h4>
        <p><strong>${translate('Missing scores:')}</strong> ${missingScores.join(', ')}</p>
        <p>${translate('Steps to complete:')}</p>
        <ol style="padding-left: 20px; margin-bottom: 0;">
          <li>${translate('Navigate to each of the missing component pages using the tabs above')}</li>
          <li>${translate('Fill in the required information')}</li>
          <li>${translate('Complete all components')}</li>
          <li>${translate('Return to this page to view your results')}</li>
        </ol>
      `;
      
      resultsContainer.appendChild(missingScoresInfo);
      resultsElement.appendChild(resultsContainer);
      return;
    }
    
    // If we have all scores, show the results dashboard
    
    // ======== MAIN SCORES SECTION ========
    // Top cards section showing the three main scores (EI, PI, Total)
    const topCardsSection = document.createElement('div');
    topCardsSection.className = 'scores-overview-section';
    topCardsSection.style.display = 'flex';
    topCardsSection.style.flexWrap = 'wrap';
    topCardsSection.style.gap = '20px';
    topCardsSection.style.justifyContent = 'center';
    topCardsSection.style.marginBottom = '40px';
    
    // Get colors for each score - updated with new thresholds
    let eiColor = '#5cb85c'; // Default green
    if (scores.eiIndex >= 90) {
      eiColor = '#006400'; // Dark green
    } else if (scores.eiIndex >= 85) {
      eiColor = '#5cb85c'; // Light green
    } else if (scores.eiIndex >= 65) {
      eiColor = '#f0ad4e'; // Yellow/Orange
    } else {
      eiColor = '#d9534f'; // Red
    }
    
    let piColor = '#4e73df'; // Default blue
    if (scores.practicality >= 75) {
      piColor = '#1e40af'; // Dark blue
    } else if (scores.practicality >= 50) {
      piColor = '#4e73df'; // Light blue
    } else {
      piColor = '#d63384'; // Magenta
    }
    
    // Total score color (weighted average of EI and PI colors based on 50/50 split)
    const totalColor = scores.total >= 75 ? '#006400' : 
                      scores.total >= 50 ? '#5cb85c' :
                      scores.total >= 25 ? '#f0ad4e' : '#d9534f';
    
    // EI Index Score card - updated with new thresholds
    let eiInterpretationText = '';
    if (scores.eiIndex >= 90) {
      eiInterpretationText = translate('Ideal Green');
    } else if (scores.eiIndex >= 85) {
      eiInterpretationText = translate('Minimal Impact');
    } else if (scores.eiIndex >= 65) {
      eiInterpretationText = translate('Considerable Impact');
    } else {
      eiInterpretationText = translate('Serious Impact');
    }
    
    const eiCard = createHexagonCard(
      translate('EI Index (50%)'), 
      scores.eiIndex.toFixed(1), 
      eiInterpretationText,
      eiColor
    );
    
    // Practicality Index Score card
    let piInterpretationText = '';
    if (scores.practicality >= 75) {
      piInterpretationText = translate('Excellent');
    } else if (scores.practicality >= 50) {
      piInterpretationText = translate('Acceptable');
    } else {
      piInterpretationText = translate('Impractical');
    }
    
    const piCard = createHexagonCard(
      translate('Practicality Index (50%)'), 
      scores.practicality.toFixed(1), 
      piInterpretationText,
      piColor
    );
    
    // Total Score card
    let totalInterpretationText = '';
    if (scores.total >= 75) {
      totalInterpretationText = translate('Ideal Method');
    } else if (scores.total >= 50) {
      totalInterpretationText = translate('Good Method');
    } else if (scores.total >= 25) {
      totalInterpretationText = translate('Needs Improvement');
    } else {
      totalInterpretationText = translate('Critical Concerns');
    }
    
    const totalCard = createHexagonCard(
      translate('Combined Score (100%)'), 
      scores.total.toFixed(1), 
      totalInterpretationText,
      totalColor
    );
    
    topCardsSection.appendChild(eiCard);
    topCardsSection.appendChild(piCard);
    topCardsSection.appendChild(totalCard);
    
    resultsContainer.appendChild(topCardsSection);
    
    // ======== DETAILED SCORES SECTIONS ========
    // Create tabs for different detailed views
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'results-tabs';
    tabsContainer.style.borderBottom = '1px solid #eaeaea';
    tabsContainer.style.marginBottom = '25px';
    tabsContainer.style.display = 'flex';
    
    const tabs = [
      { id: 'summary', label: translate('Summary') },
      { id: 'ei-breakdown', label: translate('EI Breakdown') },
      { id: 'practicality', label: translate('Practicality') },
      { id: 'visualizations', label: translate('Visualizations') }
    ];
    
    const tabContentContainer = document.createElement('div');
    tabContentContainer.className = 'tab-content';
    
    // Create each tab and its content
    tabs.forEach((tab, index) => {
      const tabElement = document.createElement('div');
      tabElement.className = `tab ${index === 0 ? 'active' : ''}`;
      tabElement.setAttribute('data-tab', tab.id);
      tabElement.textContent = tab.label;
      tabElement.style.padding = '12px 20px';
      tabElement.style.cursor = 'pointer';
      tabElement.style.borderBottom = index === 0 ? '3px solid #4e73df' : '3px solid transparent';
      tabElement.style.fontWeight = index === 0 ? 'bold' : 'normal';
      tabElement.style.color = index === 0 ? '#4e73df' : '#666';
      // Removed transition to prevent animation issues
      
      tabElement.addEventListener('mouseover', () => {
        if (!tabElement.classList.contains('active')) {
          tabElement.style.color = '#4e73df';
          tabElement.style.backgroundColor = '#f8f9fc';
        }
      });
      
      tabElement.addEventListener('mouseout', () => {
        if (!tabElement.classList.contains('active')) {
          tabElement.style.color = '#666';
          tabElement.style.backgroundColor = 'transparent';
        }
      });
      
      tabElement.addEventListener('click', () => {
        // Update active tab styling
        const allTabs = tabsContainer.querySelectorAll('.tab');
        allTabs.forEach(t => {
          t.classList.remove('active');
          t.style.borderBottom = '3px solid transparent';
          t.style.fontWeight = 'normal';
          t.style.color = '#666';
        });
        
        tabElement.classList.add('active');
        tabElement.style.borderBottom = '3px solid #4e73df';
        tabElement.style.fontWeight = 'bold';
        tabElement.style.color = '#4e73df';
        
        // Show selected tab content
        const allTabContents = tabContentContainer.querySelectorAll('.tab-content-item');
        allTabContents.forEach(content => {
          content.style.display = 'none';
        });
        
        const selectedContent = tabContentContainer.querySelector(`#${tab.id}-content`);
        if (selectedContent) {
          selectedContent.style.display = 'block';
        }
      });
      
      tabsContainer.appendChild(tabElement);
      
      // Create tab content
      const tabContent = document.createElement('div');
      tabContent.id = `${tab.id}-content`;
      tabContent.className = 'tab-content-item';
      tabContent.style.display = index === 0 ? 'block' : 'none';
      
      // Fill content based on tab id
      switch (tab.id) {
        case 'summary':
          // Create summary content with score gauges and formula
          const summaryContent = document.createElement('div');
          summaryContent.className = 'summary-content';
          
          // Combined score calculation explanation
          const combinedScoreFormula = document.createElement('div');
          combinedScoreFormula.className = 'formula-explanation';
          combinedScoreFormula.style.backgroundColor = '#f8f9fa';
          combinedScoreFormula.style.padding = '15px';
          combinedScoreFormula.style.borderRadius = '8px';
          combinedScoreFormula.style.marginBottom = '30px';
          combinedScoreFormula.style.textAlign = 'center';
          
          combinedScoreFormula.innerHTML = `
            <div style="font-size: 16px; margin-bottom: 10px;">
              <strong>${translate('Combined Score Formula:')}</strong>
            </div>
            <div style="font-size: 18px; font-weight: bold; margin-bottom: 15px;">
              ${translate('Combined Score')} = (${translate('EI Index')} × 0.5) + (${translate('Practicality Index')} × 0.5)
            </div>
            <div style="font-size: 17px; color: #555;">
              ${scores.total.toFixed(1)} = (${scores.eiIndex.toFixed(1)} × 0.5) + (${scores.practicality.toFixed(1)} × 0.5)
            </div>
          `;
          
          summaryContent.appendChild(combinedScoreFormula);
          
          // Create gauge visualizations section
          const gaugesContainer = document.createElement('div');
          gaugesContainer.className = 'gauges-container';
          gaugesContainer.style.display = 'flex';
          gaugesContainer.style.flexWrap = 'wrap';
          gaugesContainer.style.justifyContent = 'center';
          gaugesContainer.style.gap = '40px';
          gaugesContainer.style.marginBottom = '30px';
          
          // Create gauges for each score
          const eiGauge = createScoreGauge(scores.eiIndex, 100, eiColor);
          const eiGaugeLabel = document.createElement('div');
          eiGaugeLabel.textContent = translate('EI Index');
          eiGaugeLabel.style.textAlign = 'center';
          eiGaugeLabel.style.marginTop = '10px';
          eiGaugeLabel.style.fontWeight = 'bold';
          
          const eiGaugeWrapper = document.createElement('div');
          eiGaugeWrapper.style.display = 'flex';
          eiGaugeWrapper.style.flexDirection = 'column';
          eiGaugeWrapper.appendChild(eiGauge);
          eiGaugeWrapper.appendChild(eiGaugeLabel);
          
          const piGauge = createScoreGauge(scores.practicality, 100, piColor);
          const piGaugeLabel = document.createElement('div');
          piGaugeLabel.textContent = translate('Practicality Index');
          piGaugeLabel.style.textAlign = 'center';
          piGaugeLabel.style.marginTop = '10px';
          piGaugeLabel.style.fontWeight = 'bold';
          
          const piGaugeWrapper = document.createElement('div');
          piGaugeWrapper.style.display = 'flex';
          piGaugeWrapper.style.flexDirection = 'column';
          piGaugeWrapper.appendChild(piGauge);
          piGaugeWrapper.appendChild(piGaugeLabel);
          
          const totalGauge = createScoreGauge(scores.total, 100, totalColor);
          const totalGaugeLabel = document.createElement('div');
          totalGaugeLabel.textContent = translate('Combined Score');
          totalGaugeLabel.style.textAlign = 'center';
          totalGaugeLabel.style.marginTop = '10px';
          totalGaugeLabel.style.fontWeight = 'bold';
          
          const totalGaugeWrapper = document.createElement('div');
          totalGaugeWrapper.style.display = 'flex';
          totalGaugeWrapper.style.flexDirection = 'column';
          totalGaugeWrapper.appendChild(totalGauge);
          totalGaugeWrapper.appendChild(totalGaugeLabel);
          
          gaugesContainer.appendChild(eiGaugeWrapper);
          gaugesContainer.appendChild(piGaugeWrapper);
          gaugesContainer.appendChild(totalGaugeWrapper);
          
          summaryContent.appendChild(gaugesContainer);
          
          // Create interpretation scales
          const scalesContainer = document.createElement('div');
          scalesContainer.className = 'scales-container';
          scalesContainer.style.display = 'flex';
          scalesContainer.style.flexWrap = 'wrap';
          scalesContainer.style.gap = '20px';
          scalesContainer.style.justifyContent = 'space-between';
          
          // Dual Index score
          const eiScaleData = [
            { 
              range: '90-100', 
              description: translate('Ideal Green Method – No environmental impact'), 
              color: '#006400'  // Dark green
            },
            { 
              range: '<90-85', 
              description: translate('Minimal Impact – Environmentally sustainable'), 
              color: '#5cb85c'  // Light green
            },
            { 
              range: '<85-65', 
              description: translate('Considerable Impact – Requires improvement'), 
              color: '#f0ad4e'  // Yellow/Orange
            },
            { 
              range: '<65', 
              description: translate('Serious Impact – Unsustainable method'), 
              color: '#d9534f'  // Red
            }
          ];
          
          // Determine active color for EI scale
          // Updated with new thresholds: 90-100 (Dark Green), <90-85 (Light Green), <85-65 (Yellow), <65 (Red)
          let activeEiColor = '';
          if (scores.eiIndex >= 90) activeEiColor = '#006400';
          else if (scores.eiIndex >= 85) activeEiColor = '#5cb85c';
          else if (scores.eiIndex >= 65) activeEiColor = '#f0ad4e';
          else activeEiColor = '#d9534f';
          
          const eiScaleCard = createScaleCard(eiScaleData, activeEiColor);
          eiScaleCard.style.flex = '1 0 45%';
          
          // Practicality Scale
          const piScaleData = [
            { 
              range: '75-100', 
              description: translate('Excellent – Highly applicable and efficient'), 
              color: '#1e40af'  // Dark blue
            },
            { 
              range: '50-74', 
              description: translate('Acceptable – Viable with moderate optimization'), 
              color: '#4e73df'  // Light blue
            },
            { 
              range: '<50', 
              description: translate('Impractical – Limited real-world feasibility'), 
              color: '#d63384'  // Magenta
            }
          ];
          
          // Determine active color for PI scale
          let activePiColor = '';
          if (scores.practicality >= 75) activePiColor = '#1e40af';
          else if (scores.practicality >= 50) activePiColor = '#4e73df';
          else activePiColor = '#d63384';
          
          const piScaleCard = createScaleCard(piScaleData, activePiColor);
          piScaleCard.style.flex = '1 0 45%';
          
          scalesContainer.appendChild(eiScaleCard);
          scalesContainer.appendChild(piScaleCard);
          
          summaryContent.appendChild(scalesContainer);
          
          // Add to tab content
          tabContent.appendChild(summaryContent);
          break;
          
        case 'ei-breakdown':
          // Create EI breakdown content with component scores
          const eiBreakdownContent = document.createElement('div');
          eiBreakdownContent.className = 'ei-breakdown-content';
          
          // EI Index Formula explanation
          const eiFormula = document.createElement('div');
          eiFormula.className = 'formula-explanation';
          eiFormula.style.backgroundColor = '#f8f9fa';
          eiFormula.style.padding = '15px';
          eiFormula.style.borderRadius = '8px';
          eiFormula.style.marginBottom = '30px';
          
          eiFormula.innerHTML = `
            <strong style="font-size: 16px;">${translate('EI Index Formula:')}</strong>
            <div style="font-size: 17px; font-weight: bold; margin: 10px 0;">
              EI = (S + I + R + W) / 4
            </div>
            <div>
              <div style="margin-bottom: 5px;"><strong>S:</strong> ${translate('Sample Preparation')} = ${scores.samplePrep.toFixed(1)}</div>
              <div style="margin-bottom: 5px;"><strong>I:</strong> ${translate('Instrumentation')} = ${scores.instrumentation.toFixed(1)}</div>
              <div style="margin-bottom: 5px;"><strong>R:</strong> ${translate('Reagent')} = ${scores.reagent.toFixed(1)}</div>
              <div style="margin-bottom: 5px;"><strong>W:</strong> ${translate('Waste')} = ${scores.waste.toFixed(1)}</div>
              <div style="margin-top: 10px; font-weight: bold; border-top: 1px solid #ddd; padding-top: 10px;">
                EI = (${scores.samplePrep.toFixed(1)} + ${scores.instrumentation.toFixed(1)} + ${scores.reagent.toFixed(1)} + ${scores.waste.toFixed(1)}) / 4 = ${scores.eiIndex.toFixed(1)}
              </div>
            </div>
          `;
          
          eiBreakdownContent.appendChild(eiFormula);
          
          // Visual components breakdown - circle visualization
          const componentsCircle = createComponentsCircle(scores);
          componentsCircle.style.marginBottom = '30px';
          
          const circleHeader = document.createElement('h3');
          circleHeader.textContent = translate('Component Distribution');
          circleHeader.style.textAlign = 'center';
          circleHeader.style.marginBottom = '20px';
          circleHeader.style.fontSize = '18px';
          
          eiBreakdownContent.appendChild(circleHeader);
          eiBreakdownContent.appendChild(componentsCircle);
          
          // Components bar chart
          const componentsBreakdown = document.createElement('div');
          componentsBreakdown.className = 'components-breakdown';
          componentsBreakdown.style.marginBottom = '30px';
          
          const componentsHeader = document.createElement('h3');
          componentsHeader.textContent = translate('Component Scores');
          componentsHeader.style.textAlign = 'center';
          componentsHeader.style.marginBottom = '20px';
          componentsHeader.style.fontSize = '18px';
          
          componentsBreakdown.appendChild(componentsHeader);
          
          // Components progress bars
          const progressBars = document.createElement('div');
          progressBars.className = 'progress-bars';
          progressBars.style.maxWidth = '600px';
          progressBars.style.margin = '0 auto';
          
          // Sample Preparation
          const samplePrepBar = createHorizontalProgressBar(
            scores.samplePrep, 
            100, 
            '#4CAF50', 
            translate('Sample Preparation')
          );
          
          // Instrumentation
          const instrumentationBar = createHorizontalProgressBar(
            scores.instrumentation, 
            100, 
            '#2196F3', 
            translate('Instrumentation')
          );
          
          // Reagent
          const reagentBar = createHorizontalProgressBar(
            scores.reagent, 
            100, 
            '#FF9800', 
            translate('Reagent')
          );
          
          // Waste
          const wasteBar = createHorizontalProgressBar(
            scores.waste, 
            100, 
            '#9C27B0', 
            translate('Waste')
          );
          
          progressBars.appendChild(samplePrepBar);
          progressBars.appendChild(instrumentationBar);
          progressBars.appendChild(reagentBar);
          progressBars.appendChild(wasteBar);
          
          componentsBreakdown.appendChild(progressBars);
          eiBreakdownContent.appendChild(componentsBreakdown);
          
          // Interpretration Scale
          const eiScaleSection = document.createElement('div');
          eiScaleSection.className = 'ei-scale-section';
          eiScaleSection.style.maxWidth = '600px';
          eiScaleSection.style.margin = '0 auto';
          
          const eiScaleHeader = document.createElement('h3');
          eiScaleHeader.textContent = translate('EI Index Interpretation Scale');
          eiScaleHeader.style.textAlign = 'center';
          eiScaleHeader.style.marginBottom = '20px';
          eiScaleHeader.style.fontSize = '18px';
          
          eiScaleSection.appendChild(eiScaleHeader);
          
          // Use the same scale data from summary tab
          const eiScaleBreakdown = eiScaleData.map(item => {
            return { ...item };
          });
          
          const eiBreakdownScale = createScaleCard(eiScaleBreakdown, activeEiColor);
          eiScaleSection.appendChild(eiBreakdownScale);
          
          eiBreakdownContent.appendChild(eiScaleSection);
          
          // Add to tab content
          tabContent.appendChild(eiBreakdownContent);
          break;
          
        case 'practicality':
          // Create practicality content
          const practicalityContent = document.createElement('div');
          practicalityContent.className = 'practicality-content';
          
          // Practicality Score Explanation
          const piExplanation = document.createElement('div');
          piExplanation.className = 'practicality-explanation';
          piExplanation.style.marginBottom = '30px';
          piExplanation.style.backgroundColor = '#f8f9fc';
          piExplanation.style.padding = '20px';
          piExplanation.style.borderRadius = '8px';
          
          piExplanation.innerHTML = `
            <h3 style="margin-top: 0; margin-bottom: 15px; font-size: 18px;">${translate('Practicality Index')}</h3>
            <p style="margin-bottom: 15px;">${translate('The Practicality Index measures the real-world applicability of your analytical method based on 10 core criteria:')}</p>
            <ul style="padding-left: 20px; margin-bottom: 0;">
              <li>${translate('Method Nature')} (10 pts)</li>
              <li>${translate('QbD Applied')} (10 pts)</li>
              <li>${translate('Validation')} (10 pts)</li>
              <li>${translate('Sensitivity')} (10 pts)</li>
              <li>${translate('Reagent Availability')} (10 pts)</li>
              <li>${translate('Cost of Analysis per Sample')} (10 pts)</li>
              <li>${translate('Instrument Availability')} (10 pts)</li>
              <li>${translate('Maintenance frequency and instrument lifetime')} (10 pts)</li>
              <li>${translate('Analysis Time')} (10 pts)</li>
              <li>${translate('Sample Reusability')} (10 pts)</li>
            </ul>
          `;
          
          practicalityContent.appendChild(piExplanation);
          
          // Practicality score gauge
          const piGaugeSection = document.createElement('div');
          piGaugeSection.className = 'pi-gauge-section';
          piGaugeSection.style.display = 'flex';
          piGaugeSection.style.flexDirection = 'column';
          piGaugeSection.style.alignItems = 'center';
          piGaugeSection.style.marginBottom = '30px';
          
          const piGaugeDisplay = createScoreGauge(scores.practicality, 100, piColor, 200);
          
          const piGaugeScore = document.createElement('div');
          piGaugeScore.className = 'pi-score';
          piGaugeScore.style.marginTop = '15px';
          piGaugeScore.style.fontSize = '20px';
          piGaugeScore.style.fontWeight = 'bold';
          piGaugeScore.style.color = piColor;
          piGaugeScore.textContent = `${scores.practicality.toFixed(1)} / 100`;
          
          const piGaugeInterpretation = document.createElement('div');
          piGaugeInterpretation.className = 'pi-interpretation';
          piGaugeInterpretation.style.marginTop = '5px';
          piGaugeInterpretation.style.fontSize = '18px';
          piGaugeInterpretation.style.padding = '5px 15px';
          piGaugeInterpretation.style.backgroundColor = `${piColor}22`;
          piGaugeInterpretation.style.borderRadius = '20px';
          piGaugeInterpretation.style.color = piColor;
          piGaugeInterpretation.style.fontWeight = 'bold';
          piGaugeInterpretation.textContent = piInterpretationText;
          
          piGaugeSection.appendChild(piGaugeDisplay);
          piGaugeSection.appendChild(piGaugeScore);
          piGaugeSection.appendChild(piGaugeInterpretation);
          
          practicalityContent.appendChild(piGaugeSection);
          
          // Practicality Scale
          const piScaleSection = document.createElement('div');
          piScaleSection.className = 'pi-scale-section';
          piScaleSection.style.maxWidth = '600px';
          piScaleSection.style.margin = '0 auto 30px';
          
          const piScaleHeader = document.createElement('h3');
          piScaleHeader.textContent = translate('Practicality Index Interpretation Scale');
          piScaleHeader.style.textAlign = 'center';
          piScaleHeader.style.marginBottom = '20px';
          piScaleHeader.style.fontSize = '18px';
          
          piScaleSection.appendChild(piScaleHeader);
          
          // Use the same scale data from summary tab
          const piScaleBreakdown = piScaleData.map(item => {
            return { ...item };
          });
          
          const piBreakdownScale = createScaleCard(piScaleBreakdown, activePiColor);
          piScaleSection.appendChild(piBreakdownScale);
          
          practicalityContent.appendChild(piScaleSection);
          
          // Impact on total score
          const piImpactSection = document.createElement('div');
          piImpactSection.className = 'pi-impact-section';
          piImpactSection.style.backgroundColor = '#f8f9fc';
          piImpactSection.style.padding = '20px';
          piImpactSection.style.borderRadius = '8px';
          piImpactSection.style.textAlign = 'center';
          
          const piImpactTitle = document.createElement('h3');
          piImpactTitle.textContent = translate('Impact on Combined Score');
          piImpactTitle.style.marginTop = '0';
          piImpactTitle.style.marginBottom = '15px';
          piImpactTitle.style.fontSize = '18px';
          
          const piContribution = (scores.practicality * 0.5).toFixed(1);
          const piImpactText = document.createElement('p');
          piImpactText.innerHTML = `${translate('Your Practicality Index contributes')} <strong style="color: ${piColor}; font-size: 18px;">${piContribution}</strong> ${translate('points (50% weighting) to your combined score of')} <strong style="font-size: 18px;">${scores.total.toFixed(1)}</strong>.`;
          
          piImpactSection.appendChild(piImpactTitle);
          piImpactSection.appendChild(piImpactText);
          
          practicalityContent.appendChild(piImpactSection);
          
          // Add to tab content
          tabContent.appendChild(practicalityContent);
          break;
          
        case 'visualizations':
          // Create visualizations content
          const visualizationsContent = document.createElement('div');
          visualizationsContent.className = 'visualizations-content';
          
          // Create visualization tabs
          const vizTabsContainer = document.createElement('div');
          vizTabsContainer.className = 'viz-tabs';
          vizTabsContainer.style.display = 'flex';
          vizTabsContainer.style.justifyContent = 'center';
          vizTabsContainer.style.borderBottom = '1px solid #eaeaea';
          vizTabsContainer.style.marginBottom = '25px';
          
          const vizTabs = [
            { id: 'radar', label: translate('Radar Chart') },
            { id: 'bar', label: translate('Bar Chart') },
            { id: 'comparison', label: translate('Score Comparison') }
          ];
          
          const vizContentContainer = document.createElement('div');
          vizContentContainer.className = 'viz-content';
          
          // Create each visualization tab
          vizTabs.forEach((vizTab, vizIndex) => {
            const vizTabElement = document.createElement('div');
            vizTabElement.className = `viz-tab ${vizIndex === 0 ? 'active' : ''}`;
            vizTabElement.setAttribute('data-viz-tab', vizTab.id);
            vizTabElement.textContent = vizTab.label;
            vizTabElement.style.padding = '10px 20px';
            vizTabElement.style.cursor = 'pointer';
            vizTabElement.style.borderBottom = vizIndex === 0 ? '3px solid #4e73df' : '3px solid transparent';
            vizTabElement.style.fontWeight = vizIndex === 0 ? 'bold' : 'normal';
            vizTabElement.style.color = vizIndex === 0 ? '#4e73df' : '#666';
            
            vizTabElement.addEventListener('click', () => {
              // Update active tab styling
              const allVizTabs = vizTabsContainer.querySelectorAll('.viz-tab');
              allVizTabs.forEach(t => {
                t.classList.remove('active');
                t.style.borderBottom = '3px solid transparent';
                t.style.fontWeight = 'normal';
                t.style.color = '#666';
              });
              
              vizTabElement.classList.add('active');
              vizTabElement.style.borderBottom = '3px solid #4e73df';
              vizTabElement.style.fontWeight = 'bold';
              vizTabElement.style.color = '#4e73df';
              
              // Show selected viz content
              const allVizContents = vizContentContainer.querySelectorAll('.viz-content-item');
              allVizContents.forEach(content => {
                content.style.display = 'none';
              });
              
              const selectedVizContent = vizContentContainer.querySelector(`#${vizTab.id}-content`);
              if (selectedVizContent) {
                selectedVizContent.style.display = 'block';
              }
            });
            
            vizTabsContainer.appendChild(vizTabElement);
            
            // Create viz content
            const vizContent = document.createElement('div');
            vizContent.id = `${vizTab.id}-content`;
            vizContent.className = 'viz-content-item';
            vizContent.style.display = vizIndex === 0 ? 'block' : 'none';
            
            // Fill content based on viz id
            switch (vizTab.id) {
              case 'radar':
                // Radar chart
                const radarChart = RadarChart(scores);
                
                const radarHeader = document.createElement('h3');
                radarHeader.textContent = translate('Environmental Impact Profile');
                radarHeader.style.textAlign = 'center';
                radarHeader.style.marginBottom = '20px';
                
                vizContent.appendChild(radarHeader);
                vizContent.appendChild(radarChart);
                break;
                
              case 'bar':
                // Bar chart for component comparison
                const barChart = DualColumnHistogram(scores);
                
                const barHeader = document.createElement('h3');
                barHeader.textContent = translate('Component Scores Comparison');
                barHeader.style.textAlign = 'center';
                barHeader.style.marginBottom = '20px';
                
                vizContent.appendChild(barHeader);
                vizContent.appendChild(barChart);
                break;
                
              case 'comparison':
                // Score comparison visualization
                const comparisonContainer = document.createElement('div');
                comparisonContainer.className = 'comparison-container';
                comparisonContainer.style.display = 'flex';
                comparisonContainer.style.flexDirection = 'column';
                comparisonContainer.style.alignItems = 'center';
                comparisonContainer.style.gap = '30px';
                
                const comparisonHeader = document.createElement('h3');
                comparisonHeader.textContent = translate('EI and Practicality Score Comparison');
                comparisonHeader.style.textAlign = 'center';
                comparisonHeader.style.marginBottom = '10px';
                
                comparisonContainer.appendChild(comparisonHeader);
                
                // Create comparison gauge visualization
                const comparisonGauges = document.createElement('div');
                comparisonGauges.style.display = 'flex';
                comparisonGauges.style.flexWrap = 'wrap';
                comparisonGauges.style.justifyContent = 'center';
                comparisonGauges.style.gap = '50px';
                
                // EI and PI badges with gauges
                const eiComparisonSection = document.createElement('div');
                eiComparisonSection.style.textAlign = 'center';
                eiComparisonSection.style.maxWidth = '220px';
                
                const eiComparisonGauge = createScoreGauge(scores.eiIndex, 100, eiColor);
                const eiComparisonBadge = createScoreBadge(
                  scores.eiIndex, 
                  translate('EI Index'), 
                  eiColor, 
                  180
                );
                
                eiComparisonSection.appendChild(eiComparisonGauge);
                eiComparisonSection.appendChild(eiComparisonBadge);
                
                const piComparisonSection = document.createElement('div');
                piComparisonSection.style.textAlign = 'center';
                piComparisonSection.style.maxWidth = '220px';
                
                const piComparisonGauge = createScoreGauge(scores.practicality, 100, piColor);
                const piComparisonBadge = createScoreBadge(
                  scores.practicality, 
                  translate('Practicality Index'), 
                  piColor, 
                  180
                );
                
                piComparisonSection.appendChild(piComparisonGauge);
                piComparisonSection.appendChild(piComparisonBadge);
                
                comparisonGauges.appendChild(eiComparisonSection);
                comparisonGauges.appendChild(piComparisonSection);
                
                comparisonContainer.appendChild(comparisonGauges);
                
                // Relationship explanation
                const relationshipExplanation = document.createElement('div');
                relationshipExplanation.className = 'relationship-explanation';
                relationshipExplanation.style.maxWidth = '600px';
                relationshipExplanation.style.margin = '0 auto';
                relationshipExplanation.style.padding = '15px';
                relationshipExplanation.style.backgroundColor = '#f8f9fa';
                relationshipExplanation.style.borderRadius = '8px';
                
                // Determine relationship message based on scores difference
                const scoreDifference = Math.abs(scores.eiIndex - scores.practicality);
                let relationshipMessage = '';
                
                if (scoreDifference < 10) {
                  relationshipMessage = translate('Your method demonstrates excellent balance between environmental impact and practical applicability.');
                } else if (scoreDifference < 20) {
                  if (scores.eiIndex > scores.practicality) {
                    relationshipMessage = translate('Your method prioritizes environmental sustainability while maintaining acceptable practicality.');
                  } else {
                    relationshipMessage = translate('Your method prioritizes practical applicability while maintaining acceptable environmental impact.');
                  }
                } else {
                  if (scores.eiIndex > scores.practicality) {
                    relationshipMessage = translate('Your method strongly prioritizes environmental sustainability at the expense of practical applicability.');
                  } else {
                    relationshipMessage = translate('Your method strongly prioritizes practical applicability at the expense of environmental sustainability.');
                  }
                }
                
                relationshipExplanation.textContent = relationshipMessage;
                
                comparisonContainer.appendChild(relationshipExplanation);
                
                vizContent.appendChild(comparisonContainer);
                break;
            }
            
            vizContentContainer.appendChild(vizContent);
          });
          
          visualizationsContent.appendChild(vizTabsContainer);
          visualizationsContent.appendChild(vizContentContainer);
          
          // Add to tab content
          tabContent.appendChild(visualizationsContent);
          break;
      }
      
      tabContentContainer.appendChild(tabContent);
    });
    
    resultsContainer.appendChild(tabsContainer);
    resultsContainer.appendChild(tabContentContainer);
    
    // ======== EXPORT & SAVE BUTTONS ========
    const actionButtonsContainer = document.createElement('div');
    actionButtonsContainer.className = 'action-buttons';
    actionButtonsContainer.style.display = 'flex';
    actionButtonsContainer.style.flexWrap = 'wrap';
    actionButtonsContainer.style.justifyContent = 'center';
    actionButtonsContainer.style.gap = '15px';
    actionButtonsContainer.style.marginTop = '40px';
    actionButtonsContainer.style.paddingTop = '20px';
    actionButtonsContainer.style.borderTop = '1px solid #eaeaea';
    
    // PDF Export Button
    const exportPdfButton = document.createElement('button');
    exportPdfButton.className = 'action-button pdf-button';
    exportPdfButton.style.padding = '12px 24px';
    exportPdfButton.style.backgroundColor = '#d9534f';
    exportPdfButton.style.color = 'white';
    exportPdfButton.style.border = 'none';
    exportPdfButton.style.borderRadius = '5px';
    exportPdfButton.style.cursor = 'pointer';
    exportPdfButton.style.display = 'flex';
    exportPdfButton.style.alignItems = 'center';
    exportPdfButton.style.fontWeight = 'bold';
    exportPdfButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.15)';
    exportPdfButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
      ${translate('Export as PDF')}
    `;
    
    exportPdfButton.addEventListener('mouseover', () => {
      exportPdfButton.style.backgroundColor = '#c9302c';
    });
    
    exportPdfButton.addEventListener('mouseout', () => {
      exportPdfButton.style.backgroundColor = '#d9534f';
    });
    
    exportPdfButton.addEventListener('click', () => {
      window.api.exportAsPDF();
    });
    
    // Excel Export Button
    const exportExcelButton = document.createElement('button');
    exportExcelButton.className = 'action-button excel-button';
    exportExcelButton.style.padding = '12px 24px';
    exportExcelButton.style.backgroundColor = '#5cb85c';
    exportExcelButton.style.color = 'white';
    exportExcelButton.style.border = 'none';
    exportExcelButton.style.borderRadius = '5px';
    exportExcelButton.style.cursor = 'pointer';
    exportExcelButton.style.display = 'flex';
    exportExcelButton.style.alignItems = 'center';
    exportExcelButton.style.fontWeight = 'bold';
    exportExcelButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.15)';
    exportExcelButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
      ${translate('Export as Excel')}
    `;
    
    exportExcelButton.addEventListener('mouseover', () => {
      exportExcelButton.style.backgroundColor = '#449d44';
    });
    
    exportExcelButton.addEventListener('mouseout', () => {
      exportExcelButton.style.backgroundColor = '#5cb85c';
    });
    
    exportExcelButton.addEventListener('click', () => {
      window.api.exportAsExcel();
    });
    
    // Save Button
    const saveButton = document.createElement('button');
    saveButton.className = 'action-button save-button';
    saveButton.style.padding = '12px 24px';
    saveButton.style.backgroundColor = '#4e73df';
    saveButton.style.color = 'white';
    saveButton.style.border = 'none';
    saveButton.style.borderRadius = '5px';
    saveButton.style.cursor = 'pointer';
    saveButton.style.display = 'flex';
    saveButton.style.alignItems = 'center';
    saveButton.style.fontWeight = 'bold';
    saveButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.15)';
    saveButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
        <polyline points="17 21 17 13 7 13 7 21"></polyline>
        <polyline points="7 3 7 8 15 8"></polyline>
      </svg>
      ${translate('Save Calculation')}
    `;
    
    saveButton.addEventListener('mouseover', () => {
      saveButton.style.backgroundColor = '#2e59d9';
    });
    
    saveButton.addEventListener('mouseout', () => {
      saveButton.style.backgroundColor = '#4e73df';
    });
    
    saveButton.addEventListener('click', () => {
      window.api.saveCalculation();
    });
    
    actionButtonsContainer.appendChild(exportPdfButton);
    actionButtonsContainer.appendChild(exportExcelButton);
    actionButtonsContainer.appendChild(saveButton);
    
    resultsContainer.appendChild(actionButtonsContainer);
    
    // Add all to the main container
    resultsElement.appendChild(resultsContainer);
  };
  
  // Define buildResultsContent function that was referenced in handleLanguageChange
  function buildResultsContent() {
    // Create a simple container first
    const simpleContainer = document.createElement('div');
    simpleContainer.className = 'simple-results-container';
    simpleContainer.style.padding = '20px';
    simpleContainer.style.backgroundColor = '#fff';
    simpleContainer.style.borderRadius = '8px';
    simpleContainer.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
    simpleContainer.style.margin = '10px';
    
    // Create a heading
    const heading = document.createElement('h2');
    heading.textContent = translate('Results');
    heading.style.textAlign = 'center';
    heading.style.marginBottom = '20px';
    simpleContainer.appendChild(heading);
    
    // Create simple score displays for each component
    const componentNames = {
      eiIndex: translate('Environmental Impact Index'),
      practicality: translate('Practicality Index'),
      total: translate('Total Score')
    };
    
    const scoreColors = {
      eiIndex: '#4CAF50',
      practicality: '#2196F3',
      total: '#9C27B0'
    };
    
    // Add score gauges in a grid
    const gaugesContainer = document.createElement('div');
    gaugesContainer.style.display = 'flex';
    gaugesContainer.style.justifyContent = 'center';
    gaugesContainer.style.flexWrap = 'wrap';
    gaugesContainer.style.gap = '30px';
    gaugesContainer.style.marginBottom = '30px';
    
    // Add EI Index gauge
    gaugesContainer.appendChild(createScoreGauge(scores.eiIndex, 100, scoreColors.eiIndex));
    
    // Add Practicality Index gauge
    gaugesContainer.appendChild(createScoreGauge(scores.practicality, 100, scoreColors.practicality));
    
    // Add Total Score gauge
    gaugesContainer.appendChild(createScoreGauge(scores.total, 100, scoreColors.total));
    
    simpleContainer.appendChild(gaugesContainer);
    
    // Add to the main component
    resultsElement.appendChild(simpleContainer);
  }
  
  // Initial render - with error handling
  try {
    console.log("Attempting to build Results content");
    buildResultsContent();
    console.log("Results content successfully built");
  } catch (error) {
    console.error("Error building Results content:", error);
    
    // Fallback simple display if the main content fails
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-fallback';
    errorDiv.style.padding = '20px';
    errorDiv.style.backgroundColor = '#fff';
    errorDiv.style.border = '1px solid #ddd';
    errorDiv.style.borderRadius = '5px';
    errorDiv.style.margin = '20px';
    
    const errorTitle = document.createElement('h3');
    errorTitle.textContent = 'Summary Results';
    errorDiv.appendChild(errorTitle);
    
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    
    // Create summary row data
    const components = [
      { name: 'EI Index', value: scores.eiIndex.toFixed(1) },
      { name: 'Practicality', value: scores.practicality.toFixed(1) },
      { name: 'Total Score', value: scores.total.toFixed(1) }
    ];
    
    components.forEach(component => {
      const row = document.createElement('tr');
      
      const nameCell = document.createElement('td');
      nameCell.textContent = component.name;
      nameCell.style.padding = '8px';
      nameCell.style.borderBottom = '1px solid #ddd';
      nameCell.style.fontWeight = 'bold';
      row.appendChild(nameCell);
      
      const valueCell = document.createElement('td');
      valueCell.textContent = component.value;
      valueCell.style.padding = '8px';
      valueCell.style.borderBottom = '1px solid #ddd';
      valueCell.style.textAlign = 'right';
      row.appendChild(valueCell);
      
      table.appendChild(row);
    });
    
    errorDiv.appendChild(table);
    resultsElement.appendChild(errorDiv);
  }
  
  // Cleanup when component is removed
  resultsElement.cleanup = () => {
    console.log("Cleaning up Results component");
    offLanguageChange(handleLanguageChange);
  };
  
  return resultsElement;
}