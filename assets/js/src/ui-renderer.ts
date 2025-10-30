/**
 * UI rendering module for displaying tools and managing UI state
 */

import type { Tool } from './types.js';

// DOM element references (cached for performance)
let loadingIndicator: HTMLElement | null = null;
let errorMessageContainer: HTMLElement | null = null;
let toolsContainer: HTMLElement | null = null;

/**
 * Initialize DOM element references
 */
function initializeElements(): void {
  if (!loadingIndicator) {
    console.log('[UI-RENDERER] Initializing DOM element references...');
    loadingIndicator = document.getElementById('loading-indicator');
    errorMessageContainer = document.getElementById('error-message');
    toolsContainer = document.getElementById('tools-container');
    
    console.log('[UI-RENDERER] DOM elements found:', {
      loadingIndicator: !!loadingIndicator,
      errorMessageContainer: !!errorMessageContainer,
      toolsContainer: !!toolsContainer
    });
  }
}

/**
 * Show the loading indicator
 */
export function showLoading(): void {
  console.log('[UI-RENDERER] showLoading() called');
  initializeElements();
  if (loadingIndicator) {
    loadingIndicator.classList.remove('hidden');
    console.log('[UI-RENDERER] Loading indicator shown');
  } else {
    console.error('[UI-RENDERER] ❌ Loading indicator element not found');
  }
}

/**
 * Hide the loading indicator
 */
export function hideLoading(): void {
  console.log('[UI-RENDERER] hideLoading() called');
  initializeElements();
  if (loadingIndicator) {
    loadingIndicator.classList.add('hidden');
    console.log('[UI-RENDERER] Loading indicator hidden');
  } else {
    console.error('[UI-RENDERER] ❌ Loading indicator element not found');
  }
}

/**
 * Display an error message to the user
 * @param message - User-friendly error message to display
 */
export function showError(message: string): void {
  console.log('[UI-RENDERER] showError() called with message:', message);
  initializeElements();
  if (errorMessageContainer) {
    errorMessageContainer.textContent = message;
    errorMessageContainer.classList.remove('hidden');
    console.log('[UI-RENDERER] Error message displayed');
  } else {
    console.error('[UI-RENDERER] ❌ Error message container not found');
  }
}

/**
 * Hide the error message
 */
export function hideError(): void {
  initializeElements();
  if (errorMessageContainer) {
    errorMessageContainer.textContent = '';
    errorMessageContainer.classList.add('hidden');
  }
}

/**
 * Render tools as cards in the tools container
 * @param tools - Array of tools to display
 */
export function renderTools(tools: Tool[]): void {
  console.log(`[UI-RENDERER] renderTools() called with ${tools.length} tools`);
  initializeElements();
  
  if (!toolsContainer) {
    console.error('[UI-RENDERER] ❌ Tools container not found in DOM');
    return;
  }
  
  console.log('[UI-RENDERER] Tools container found, clearing content...');
  // Clear existing content
  toolsContainer.innerHTML = '';
  
  // Check if we have tools to display
  if (tools.length === 0) {
    console.log('[UI-RENDERER] No tools to display, showing no-results message');
    const noResults = document.createElement('div');
    noResults.className = 'no-results';
    noResults.innerHTML = `
      <p>No tools found matching your filters.</p>
      <p>Try adjusting your filter criteria or click the "Clear All Filters" button to start over.</p>
    `;
    toolsContainer.appendChild(noResults);
    updateResultCount(0);
    return;
  }
  
  console.log('[UI-RENDERER] Creating document fragment for tool cards...');
  // Create a document fragment for better performance
  const fragment = document.createDocumentFragment();
  
  // Create a card for each tool
  tools.forEach((tool, index) => {
    const card = createToolCard(tool);
    fragment.appendChild(card);
    if (index === 0) {
      console.log('[UI-RENDERER] Sample card created for:', tool.Tools);
    }
  });
  
  console.log('[UI-RENDERER] Appending all cards to container...');
  // Append all cards at once
  toolsContainer.appendChild(fragment);
  
  console.log('[UI-RENDERER] Updating result count...');
  // Update result count
  updateResultCount(tools.length);
  
  console.log(`[UI-RENDERER] ✅ Successfully rendered ${tools.length} tools`);
}

/**
 * Update the result count display
 * @param count - Number of tools currently displayed
 */
function updateResultCount(count: number): void {
  let resultCount = document.getElementById('result-count');
  
  if (!resultCount) {
    // Create result count element if it doesn't exist
    resultCount = document.createElement('div');
    resultCount.id = 'result-count';
    resultCount.className = 'result-count';
    
    // Insert before tools container
    const toolsContainer = document.getElementById('tools-container');
    if (toolsContainer && toolsContainer.parentNode) {
      toolsContainer.parentNode.insertBefore(resultCount, toolsContainer);
    }
  }
  
  // Get total count (assuming 58 tools total from spec)
  const totalTools = 58; // This could be passed as a parameter if dynamic
  
  if (count === totalTools) {
    resultCount.textContent = `Showing all ${totalTools} tools`;
  } else {
    resultCount.textContent = `Showing ${count} of ${totalTools} tools`;
  }
}

/**
 * Create a tool card element
 * @param tool - Tool data to display
 * @returns HTMLElement - The tool card element
 */
function createToolCard(tool: Tool): HTMLElement {
  const card = document.createElement('div');
  card.className = 'tool-card';
  
  // Tool name
  const title = document.createElement('h3');
  title.textContent = tool.Tools;
  card.appendChild(title);
  
  // Tool description
  const description = document.createElement('p');
  description.className = 'tool-description';
  description.textContent = tool.Description || 'No description available';
  card.appendChild(description);
  
  // Tool category badge
  const category = document.createElement('span');
  category.className = 'tool-category';
  category.textContent = tool.Familly || 'Uncategorized';
  card.appendChild(category);
  
  return card;
}
