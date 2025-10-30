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
  
  // Populate category dropdown
  populateCategoryDropdown(options.categories);
  
  // Add event listeners
  setupCategoryFilter();
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
 * Apply current filters and update display
 */
function applyFilters(): void {
  const filteredTools = filterTools(allToolsData, filterState);
  renderTools(filteredTools);
}
