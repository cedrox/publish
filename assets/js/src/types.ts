/**
 * Type definitions for the QA Tools Filter application
 */

/**
 * Represents a software quality assurance tool from tools.json
 */
export interface Tool {
  // Identity
  Tools: string;                    // Tool name
  Description: string;              // Tool description
  
  // Classification
  Familly: string;                  // Category (e.g., "SAST/DAST", "DevOps")
  Type: string;                     // Deployment type (e.g., "Agent", "Core", "Plugin", "UI")
  
  // Metrics (1-5 scale)
  "Security Level (1 = very light output, 5 = rich output)": number | null;
  "Importance (1 = specific, 5 = important)": number | null;
  "Implementation complexity  (1 = easy, 5 = complex)": number | null;
  "Use AI  (1 = not at all, 5 = built on AI)": number | null;
  
  // Attributes
  Maturity: string;                 // e.g., "High", "Medium", "Low"
  "Type of deployment needed": string;
  
  // Boolean Filters
  "Is Local": boolean | null;
  "Is Microsoft": boolean | null;
  API: boolean | null;
  "Available as quality gate": boolean | null;
  
  // Metadata
  Owner: string;
  "Product Link": string;
  "Logo URL": string;
  
  // Lifecycle Phase Coverage (nullable booleans)
  Code: boolean | null;
  Build: boolean | null;
  Test: boolean | null;
  release: boolean | null;
  deploy: boolean | null;
  operate: boolean | null;
  monitor: boolean | null;
  plan: boolean | null;
  
  Demo: string | null;
}

/**
 * Represents the current user-selected filter state
 */
export interface FilterState {
  // Dropdown filters (null = "All" / no filter)
  selectedCategory: string | null;
  selectedType: string | null;
  
  // Boolean filters (null = unchecked, true = checked)
  filterIsMicrosoft: boolean | null;
  filterIsLocal: boolean | null;
  filterHasAPI: boolean | null;
  filterQualityGate: boolean | null;
  
  // Text search
  searchQuery: string;
}

/**
 * Represents available filter options extracted from the dataset
 */
export interface FilterOptions {
  categories: string[];  // Unique values from Tool.Familly
  types: string[];       // Unique values from Tool.Type
}
