/**
 * filter-logic.ts
 * Core filtering logic for QA tools
 */

import { Tool, FilterState, FilterOptions } from './types.js';

/**
 * Extract unique filter options from the tools dataset
 * @param tools - Array of all tools
 * @returns FilterOptions containing unique categories and types
 */
export function extractFilterOptions(tools: Tool[]): FilterOptions {
  const categories = new Set<string>();
  const types = new Set<string>();

  tools.forEach(tool => {
    // Extract category (Familly field)
    if (tool.Familly && tool.Familly.trim()) {
      categories.add(tool.Familly.trim());
    }

    // Extract type
    if (tool.Type && tool.Type.trim()) {
      types.add(tool.Type.trim());
    }
  });

  return {
    categories: Array.from(categories).sort(),
    types: Array.from(types).sort()
  };
}

/**
 * Filter tools based on the current filter state
 * Uses AND logic: all selected filters must match
 * @param tools - Array of all tools to filter
 * @param state - Current filter state
 * @returns Filtered array of tools
 */
export function filterTools(tools: Tool[], state: FilterState): Tool[] {
  return tools.filter(tool => {
    // Category filter (Familly field)
    if (state.selectedCategory && tool.Familly !== state.selectedCategory) {
      return false;
    }

    // Type filter
    if (state.selectedType && tool.Type !== state.selectedType) {
      return false;
    }

    // Boolean filters - only filter if explicitly true/false (not null)
    if (state.filterIsMicrosoft !== null && tool['Is Microsoft'] !== state.filterIsMicrosoft) {
      return false;
    }

    if (state.filterIsLocal !== null && tool['Is Local'] !== state.filterIsLocal) {
      return false;
    }

    if (state.filterHasAPI !== null && tool.API !== state.filterHasAPI) {
      return false;
    }

    if (state.filterQualityGate !== null && tool['Available as quality gate'] !== state.filterQualityGate) {
      return false;
    }

    // Search filter - case-insensitive partial match on tool name
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      const toolName = (tool.Tools || '').toLowerCase();
      if (!toolName.includes(query)) {
        return false;
      }
    }

    // All filters passed
    return true;
  });
}
