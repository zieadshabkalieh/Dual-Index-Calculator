import { renderApp } from './src/components/App.js';
import { createPageTransition } from './src/utils/animations.js';

// Create a web API equivalent to the Electron API
window.api = {
  saveFile: async (options) => {
    // Web version: Use browser download functionality
    const blob = new Blob([options.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = options.defaultPath || 'calculation.json';
    link.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    return options.defaultPath;
  },
  
  openFile: async (options) => {
    // Web version: Show a file input dialog
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = options.filters ? options.filters.map(f => f.extensions.map(ext => `.${ext}`).join(',')).join(',') : '';
      
      input.onchange = (event) => {
        const file = event.target.files[0];
        if (!file) {
          resolve(null);
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            filePath: file.name,
            content: e.target.result
          });
        };
        
        reader.onerror = (error) => {
          reject(error);
        };
        
        reader.readAsText(file);
      };
      
      // Trigger file input dialog
      input.click();
    });
  },
  
  // Menu event handlers (dummy implementations for web)
  onMenuSaveCalculation: (callback) => {
    // Add a keyboard shortcut for saving (Ctrl+S)
    const handleKeydown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        callback();
      }
    };
    
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  },
  
  onMenuLoadCalculation: (callback) => {
    // Add a keyboard shortcut for loading (Ctrl+O)
    const handleKeydown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
        e.preventDefault();
        callback();
      }
    };
    
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  },
  
  onMenuExportPDF: (callback) => {
    // Add a keyboard shortcut for PDF export (Ctrl+P)
    const handleKeydown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        callback();
      }
    };
    
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  },
  
  onMenuAbout: (callback) => {
    // No specific shortcut for about dialog
    return () => {};
  }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  try {
    console.log('DOM fully loaded, initializing app...');
    // First render the app
    const appElement = document.getElementById('app');
    console.log('App element found:', appElement);
    renderApp(appElement);
    
    // Initialize icons
    if (window.feather) {
      console.log('Feather icons library found, initializing...');
      window.feather.replace();
    } else {
      console.warn('Feather icons library not found');
    }
  } catch (error) {
    console.error('Error initializing application:', error);
    // Display error on the page for debugging
    const appElement = document.getElementById('app');
    if (appElement) {
      appElement.innerHTML = `
        <div style="color: red; padding: 20px; border: 1px solid #ddd; margin: 20px;">
          <h2>Application Error</h2>
          <p>${error.message}</p>
          <pre>${error.stack}</pre>
        </div>
      `;
    }
  }
});