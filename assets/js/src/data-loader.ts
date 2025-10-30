/**
 * Data loading module for fetching and parsing tools.json
 */

import type { Tool } from './types.js';

/**
 * Loads tools from the static JSON file
 * @returns Promise<Tool[]> - Array of tools from tools.json
 * @throws Error with user-friendly message if loading fails
 */
export async function loadTools(): Promise<Tool[]> {
  try {
    // Fetch the tools.json file
    const response = await fetch('/data/tools.json');
    
    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    // Parse JSON response
    const tools: Tool[] = await response.json();
    
    // Basic validation
    if (!Array.isArray(tools)) {
      throw new Error('Invalid data format: expected array of tools');
    }
    
    if (tools.length === 0) {
      throw new Error('No tools found in the dataset');
    }
    
    // Validate that tools have required fields
    tools.forEach((tool, index) => {
      if (!tool.Tools || typeof tool.Tools !== 'string') {
        console.warn(`Tool at index ${index} missing required field: Tools`);
      }
    });
    
    console.log(`Successfully loaded ${tools.length} tools`);
    return tools;
    
  } catch (error) {
    // Handle different types of errors
    if (error instanceof TypeError) {
      // Network error (fetch failed)
      throw new Error('Unable to connect. Please check your internet connection and try again.');
    } else if (error instanceof SyntaxError) {
      // JSON parse error
      throw new Error('Data format error. The tools data is corrupted. Please contact support.');
    } else if (error instanceof Error) {
      // Re-throw known errors with user-friendly message
      throw new Error(`Unable to load tools: ${error.message}`);
    } else {
      // Unknown error
      throw new Error('An unexpected error occurred while loading tools. Please refresh the page.');
    }
  }
}
