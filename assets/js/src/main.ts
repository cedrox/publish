/**
 * Main entry point for the QA Tools Filter application
 * Initializes the application when the DOM is ready
 */

import type { Tool } from './types.js';
import { loadTools } from './data-loader.js';
import { showLoading, hideLoading, renderTools, showError } from './ui-renderer.js';

// Store loaded tools globally for filtering
let allTools: Tool[] = [];

/**
 * Initialize the application
 */
async function initializeApp(): Promise<void> {
  console.log('QA Tools Filter application initializing...');
  
  try {
    // Show loading indicator
    showLoading();
    
    // Load tools from JSON
    allTools = await loadTools();
    
    // Render all tools initially
    renderTools(allTools);
    
    // Hide loading indicator
    hideLoading();
    
    console.log('Application initialized successfully');
    
  } catch (error) {
    // Hide loading indicator
    hideLoading();
    
    // Display error message
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    showError(errorMessage);
    
    console.error('Failed to initialize application:', error);
  }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);

