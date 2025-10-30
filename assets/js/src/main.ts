/**
 * Main entry point for the QA Tools Filter application
 * Initializes the application when the DOM is ready
 */

import type { Tool } from './types.js';
import { loadTools } from './data-loader.js';
import { showLoading, hideLoading, renderTools, showError } from './ui-renderer.js';
import { initializeFilters } from './filter-controls.js';

// Store loaded tools globally for filtering
let allTools: Tool[] = [];

/**
 * Initialize the application
 */
async function initializeApp(): Promise<void> {
  console.log('[MAIN] QA Tools Filter application initializing...');
  console.log('[MAIN] DOM loaded, starting initialization');
  
  try {
    // Show loading indicator
    console.log('[MAIN] Showing loading indicator');
    showLoading();
    
    // Load tools from JSON
    console.log('[MAIN] Loading tools data...');
    allTools = await loadTools();
    console.log(`[MAIN] Successfully loaded ${allTools.length} tools`);
    
    // Initialize filter controls
    console.log('[MAIN] Initializing filter controls...');
    initializeFilters(allTools);
    console.log('[MAIN] Filter controls initialized');
    
    // Render all tools initially
    console.log('[MAIN] Rendering tools...');
    renderTools(allTools);
    console.log('[MAIN] Tools rendered');
    
    // Hide loading indicator
    console.log('[MAIN] Hiding loading indicator');
    hideLoading();
    
    console.log('[MAIN] ✅ Application initialized successfully');
    
  } catch (error) {
    // Hide loading indicator
    hideLoading();
    
    // Display error message
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    showError(errorMessage);
    
    console.error('[MAIN] ❌ Failed to initialize application:', error);
    console.error('[MAIN] Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
  }
}

// Initialize application when DOM is ready
console.log('[MAIN] Script loaded, waiting for DOMContentLoaded...');
document.addEventListener('DOMContentLoaded', () => {
  console.log('[MAIN] DOMContentLoaded event fired, calling initializeApp()');
  initializeApp();
});

