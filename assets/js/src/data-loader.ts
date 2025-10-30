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
  console.log('[DATA-LOADER] Starting to load tools...');
  
  try {
    // Fetch the tools.json file
    console.log('[DATA-LOADER] Fetching /data/tools.json...');
    const response = await fetch('/data/tools.json');
    console.log('[DATA-LOADER] Fetch response:', {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      url: response.url
    });
    
    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    // Parse JSON response
    console.log('[DATA-LOADER] Parsing JSON...');
    const tools: Tool[] = await response.json();
    console.log('[DATA-LOADER] JSON parsed successfully');
    
    // Basic validation
    if (!Array.isArray(tools)) {
      console.error('[DATA-LOADER] ❌ Data is not an array:', typeof tools);
      throw new Error('Invalid data format: expected array of tools');
    }
    
    if (tools.length === 0) {
      console.error('[DATA-LOADER] ❌ Tools array is empty');
      throw new Error('No tools found in the dataset');
    }
    
    // Validate that tools have required fields
    console.log('[DATA-LOADER] Validating tool data...');
    tools.forEach((tool, index) => {
      if (!tool.Tools || typeof tool.Tools !== 'string') {
        console.warn(`[DATA-LOADER] ⚠️ Tool at index ${index} missing required field: Tools`);
      }
    });
    
    console.log(`[DATA-LOADER] ✅ Successfully loaded ${tools.length} tools`);
    console.log('[DATA-LOADER] Sample tool:', tools[0]);
    return tools;
    
  } catch (error) {
    console.error('[DATA-LOADER] ❌ Error during loading:', error);
    
    // Handle different types of errors
    if (error instanceof TypeError) {
      // Network error (fetch failed)
      console.error('[DATA-LOADER] Network error detected');
      throw new Error('Unable to connect. Please check your internet connection and try again.');
    } else if (error instanceof SyntaxError) {
      // JSON parse error
      console.error('[DATA-LOADER] JSON parse error detected');
      throw new Error('Data format error. The tools data is corrupted. Please contact support.');
    } else if (error instanceof Error) {
      // Re-throw known errors with user-friendly message
      console.error('[DATA-LOADER] Known error:', error.message);
      throw new Error(`Unable to load tools: ${error.message}`);
    } else {
      // Unknown error
      console.error('[DATA-LOADER] Unknown error type:', error);
      throw new Error('An unexpected error occurred while loading tools. Please refresh the page.');
    }
  }
}
