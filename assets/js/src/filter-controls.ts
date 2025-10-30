/**
 * filter-controls.ts
 * Manages filter UI controls and state
 */

import { Tool, FilterState } from './types.js';
import { extractFilterOptions, filterTools } from './filter-logic.js';
import { renderTools } from './ui-renderer.js';

// Global filter state
export const filterState: FilterState = {
  selectedCategory: null,
  selectedType: null,
  filterIsMicrosoft: null,
  filterIsLocal: null,
  filterHasAPI: null,
  filterQualityGate: null,
  searchQuery: ''
};

// Store reference to all tools for filtering
let allToolsData: Tool[] = [];

/**
 * Initialize filter controls with data
 * @param tools - All tools data for filtering
 */
export function initializeFilters(tools: Tool[]): void {
  allToolsData = tools;
  
  // Extract unique categories and types
  const options = extractFilterOptions(tools);
  
  // Populate dropdowns
  populateCategoryDropdown(options.categories);
  populateTypeDropdown(options.types);
  
  // Add event listeners
  setupCategoryFilter();
  setupTypeFilter();
  setupSearchFilter();
  setupBooleanFilters();
  setupClearButton();
}

/**
 * Populate category dropdown with unique categories
 * @param categories - Array of unique category names
 */
function populateCategoryDropdown(categories: string[]): void {
  const categorySelect = document.getElementById('category-filter') as HTMLSelectElement;
  if (!categorySelect) return;
  
  // Clear existing options except "All categories"
  categorySelect.innerHTML = '<option value="">All categories</option>';
  
  // Add category options
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

/**
 * Populate type dropdown with unique types
 * @param types - Array of unique type names
 */
function populateTypeDropdown(types: string[]): void {
  const typeSelect = document.getElementById('type-filter') as HTMLSelectElement;
  if (!typeSelect) return;
  
  // Clear existing options except "All types"
  typeSelect.innerHTML = '<option value="">All types</option>';
  
  // Add type options
  types.forEach(type => {
    const option = document.createElement('option');
    option.value = type;
    option.textContent = type;
    typeSelect.appendChild(option);
  });
}

/**
 * Setup category filter event listener
 */
function setupCategoryFilter(): void {
  const categorySelect = document.getElementById('category-filter') as HTMLSelectElement;
  if (!categorySelect) return;
  
  categorySelect.addEventListener('change', () => {
    // Update filter state
    filterState.selectedCategory = categorySelect.value || null;
    
    // Apply filters and re-render
    applyFilters();
  });
}

/**
 * Setup type filter event listener
 */
function setupTypeFilter(): void {
  const typeSelect = document.getElementById('type-filter') as HTMLSelectElement;
  if (!typeSelect) return;
  
  typeSelect.addEventListener('change', () => {
    // Update filter state
    filterState.selectedType = typeSelect.value || null;
    
    // Apply filters and re-render
    applyFilters();
  });
}

/**
 * Setup search filter event listener with debounce
 */
function setupSearchFilter(): void {
  const searchInput = document.getElementById('tool-search') as HTMLInputElement;
  if (!searchInput) return;
  
  let debounceTimer: number;
  
  searchInput.addEventListener('input', () => {
    // Clear previous timer
    clearTimeout(debounceTimer);
    
    // Set new timer for 250ms debounce
    debounceTimer = window.setTimeout(() => {
      // Update filter state
      filterState.searchQuery = searchInput.value.trim();
      
      // Apply filters and re-render
      applyFilters();
    }, 250);
  });
}

/**
 * Setup boolean filter event listeners
 */
function setupBooleanFilters(): void {
  // Is Microsoft filter
  const isMicrosoftCheckbox = document.getElementById('is-microsoft-filter') as HTMLInputElement;
  if (isMicrosoftCheckbox) {
    isMicrosoftCheckbox.addEventListener('change', () => {
      filterState.filterIsMicrosoft = isMicrosoftCheckbox.checked ? true : null;
      applyFilters();
    });
  }
  
  // Is Local filter
  const isLocalCheckbox = document.getElementById('is-local-filter') as HTMLInputElement;
  if (isLocalCheckbox) {
    isLocalCheckbox.addEventListener('change', () => {
      filterState.filterIsLocal = isLocalCheckbox.checked ? true : null;
      applyFilters();
    });
  }
  
  // API filter
  const apiCheckbox = document.getElementById('api-filter') as HTMLInputElement;
  if (apiCheckbox) {
    apiCheckbox.addEventListener('change', () => {
      filterState.filterHasAPI = apiCheckbox.checked ? true : null;
      applyFilters();
    });
  }
  
  // Quality Gate filter
  const qualityGateCheckbox = document.getElementById('quality-gate-filter') as HTMLInputElement;
  if (qualityGateCheckbox) {
    qualityGateCheckbox.addEventListener('change', () => {
      filterState.filterQualityGate = qualityGateCheckbox.checked ? true : null;
      applyFilters();
    });
  }
}

/**
 * Setup clear button event listener
 */
function setupClearButton(): void {
  const clearButton = document.getElementById('clear-filters') as HTMLButtonElement;
  if (!clearButton) return;
  
  clearButton.addEventListener('click', clearAllFilters);
}

/**
 * Clear all filters and reset to show all tools
 */
function clearAllFilters(): void {
  // Reset filter state
  filterState.selectedCategory = null;
  filterState.selectedType = null;
  filterState.filterIsMicrosoft = null;
  filterState.filterIsLocal = null;
  filterState.filterHasAPI = null;
  filterState.filterQualityGate = null;
  filterState.searchQuery = '';
  
  // Reset UI controls
  const categorySelect = document.getElementById('category-filter') as HTMLSelectElement;
  if (categorySelect) categorySelect.value = '';
  
  const typeSelect = document.getElementById('type-filter') as HTMLSelectElement;
  if (typeSelect) typeSelect.value = '';
  
  const searchInput = document.getElementById('tool-search') as HTMLInputElement;
  if (searchInput) searchInput.value = '';
  
  const isMicrosoftCheckbox = document.getElementById('is-microsoft-filter') as HTMLInputElement;
  if (isMicrosoftCheckbox) isMicrosoftCheckbox.checked = false;
  
  const isLocalCheckbox = document.getElementById('is-local-filter') as HTMLInputElement;
  if (isLocalCheckbox) isLocalCheckbox.checked = false;
  
  const apiCheckbox = document.getElementById('api-filter') as HTMLInputElement;
  if (apiCheckbox) apiCheckbox.checked = false;
  
  const qualityGateCheckbox = document.getElementById('quality-gate-filter') as HTMLInputElement;
  if (qualityGateCheckbox) qualityGateCheckbox.checked = false;
  
  // Render all tools
  renderTools(allToolsData);
}

/**
 * Apply current filters and update display
 */
function applyFilters(): void {
  const filteredTools = filterTools(allToolsData, filterState);
  renderTools(filteredTools);
}
