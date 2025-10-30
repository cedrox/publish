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
    loadingIndicator = document.getElementById('loading-indicator');
    errorMessageContainer = document.getElementById('error-message');
    toolsContainer = document.getElementById('tools-container');
  }
}

/**
 * Show the loading indicator
 */
export function showLoading(): void {
  initializeElements();
  if (loadingIndicator) {
    loadingIndicator.classList.remove('hidden');
  }
}

/**
 * Hide the loading indicator
 */
export function hideLoading(): void {
  initializeElements();
  if (loadingIndicator) {
    loadingIndicator.classList.add('hidden');
  }
}

/**
 * Display an error message to the user
 * @param message - User-friendly error message to display
 */
export function showError(message: string): void {
  initializeElements();
  if (errorMessageContainer) {
    errorMessageContainer.textContent = message;
    errorMessageContainer.classList.remove('hidden');
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
  initializeElements();
  
  if (!toolsContainer) {
    console.error('Tools container not found in DOM');
    return;
  }
  
  // Clear existing content
  toolsContainer.innerHTML = '';
  
  // Check if we have tools to display
  if (tools.length === 0) {
    toolsContainer.innerHTML = '<p class="no-results">No tools found matching your filters.</p>';
    return;
  }
  
  // Create a document fragment for better performance
  const fragment = document.createDocumentFragment();
  
  // Create a card for each tool
  tools.forEach(tool => {
    const card = createToolCard(tool);
    fragment.appendChild(card);
  });
  
  // Append all cards at once
  toolsContainer.appendChild(fragment);
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
