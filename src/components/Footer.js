import { translate } from '../utils/i18n.js';

export function Footer() {
  const footer = document.createElement('footer');
  footer.className = 'app-footer';
  
  const footerContent = document.createElement('div');
  footerContent.className = 'container';
  
  const copyright = document.createElement('p');
  copyright.textContent = `© ${new Date().getFullYear()} ${translate('Dual Index Calculator')}`;
  
  const reference = document.createElement('p');
  reference.innerHTML = `${translate('Based on the Environmental Impact (EI) scale for analytical methods')}`;
  
  footerContent.appendChild(copyright);
  footerContent.appendChild(reference);
  footer.appendChild(footerContent);
  
  return footer;
}
