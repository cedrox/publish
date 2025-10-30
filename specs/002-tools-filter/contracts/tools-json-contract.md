# Data Contract: tools.json

**Feature**: `002-tools-filter`  
**Date**: 2025-10-31  
**Type**: Static JSON Data File

## Overview

This document defines the contract for the `data/tools.json` file that serves as the data source for the interactive tools filter page. This is a static JSON file served via HTTP GET, not a REST API endpoint.

## Endpoint

**URL**: `/data/tools.json`  
**Method**: `GET`  
**Content-Type**: `application/json`  
**Authentication**: None (public data)

## Response Schema

### Success Response (200 OK)

Returns an array of Tool objects.

**Schema**:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "array",
  "items": {
    "type": "object",
    "required": ["Tools", "Description", "Familly", "Type"],
    "properties": {
      "Tools": {
        "type": "string",
        "description": "Tool name",
        "minLength": 1,
        "example": "GitHub Advanced Security"
      },
      "Description": {
        "type": "string",
        "description": "Tool description",
        "example": "Comprehensive security analysis for GitHub repositories"
      },
      "Familly": {
        "type": "string",
        "description": "Tool category/family",
        "example": "SAST/DAST"
      },
      "Type": {
        "type": "string",
        "description": "Deployment type",
        "enum": ["Agent", "Core", "Plugin", "UI"],
        "example": "Agent"
      },
      "Security Level (1 = very light output, 5 = rich output)": {
        "type": ["number", "null"],
        "minimum": 1,
        "maximum": 5,
        "example": 4
      },
      "Importance (1 = specific, 5 = important)": {
        "type": ["number", "null"],
        "minimum": 1,
        "maximum": 5,
        "example": 5
      },
      "Implementation complexity  (1 = easy, 5 = complex)": {
        "type": ["number", "null"],
        "minimum": 1,
        "maximum": 5,
        "example": 3
      },
      "Use AI  (1 = not at all, 5 = built on AI)": {
        "type": ["number", "null"],
        "minimum": 1,
        "maximum": 5,
        "example": 4
      },
      "Maturity": {
        "type": "string",
        "description": "Tool maturity level",
        "example": "High"
      },
      "Type of deployment needed": {
        "type": "string",
        "description": "Deployment context",
        "example": "CI/CD"
      },
      "Is Local": {
        "type": ["boolean", "null"],
        "description": "Can be run locally"
      },
      "Is Microsoft": {
        "type": ["boolean", "null"],
        "description": "Microsoft product or service"
      },
      "API": {
        "type": ["boolean", "null"],
        "description": "Has API access"
      },
      "Available as quality gate": {
        "type": ["boolean", "null"],
        "description": "Can be used as quality gate in CI/CD"
      },
      "Owner": {
        "type": "string",
        "description": "Team responsible for the tool"
      },
      "Product Link": {
        "type": "string",
        "format": "uri",
        "description": "Official product URL"
      },
      "Logo URL": {
        "type": "string",
        "format": "uri",
        "description": "Tool logo image URL"
      },
      "Code": {
        "type": ["boolean", "null"],
        "description": "Applies to Code phase"
      },
      "Build": {
        "type": ["boolean", "null"],
        "description": "Applies to Build phase"
      },
      "Test": {
        "type": ["boolean", "null"],
        "description": "Applies to Test phase"
      },
      "release": {
        "type": ["boolean", "null"],
        "description": "Applies to Release phase"
      },
      "deploy": {
        "type": ["boolean", "null"],
        "description": "Applies to Deploy phase"
      },
      "operate": {
        "type": ["boolean", "null"],
        "description": "Applies to Operate phase"
      },
      "monitor": {
        "type": ["boolean", "null"],
        "description": "Applies to Monitor phase"
      },
      "plan": {
        "type": ["boolean", "null"],
        "description": "Applies to Plan phase"
      },
      "Demo": {
        "type": ["string", "null"],
        "format": "uri",
        "description": "Demo URL if available"
      }
    }
  }
}
```

**Example Response**:

```json
[
  {
    "Tools": "42crunch",
    "Description": "API security platform for continuous API security.",
    "Familly": "SAST/DAST",
    "Type": "Agent",
    "Security Level (1 = very light output, 5 = rich output)": 2,
    "Importance (1 = specific, 5 = important)": 2,
    "Implementation complexity  (1 = easy, 5 = complex)": 3,
    "Use AI  (1 = not at all, 5 = built on AI)": 2,
    "Maturity": "High",
    "Type of deployment needed": "CI/CD",
    "Is Local": true,
    "Is Microsoft": false,
    "API": true,
    "Available as quality gate": true,
    "Owner": "Development team",
    "Product Link": "https://42crunch.com",
    "Logo URL": "https://logo.clearbit.com/42crunch.com",
    "Code": true,
    "Build": true,
    "Test": null,
    "release": null,
    "deploy": null,
    "operate": true,
    "monitor": null,
    "plan": null,
    "Demo": null
  },
  {
    "Tools": "GitHub Advanced Security",
    "Description": "Comprehensive security analysis for GitHub repositories",
    "Familly": "SAST/DAST",
    "Type": "Core",
    "Security Level (1 = very light output, 5 = rich output)": 5,
    "Importance (1 = specific, 5 = important)": 5,
    "Implementation complexity  (1 = easy, 5 = complex)": 2,
    "Use AI  (1 = not at all, 5 = built on AI)": 4,
    "Maturity": "High",
    "Type of deployment needed": "CI/CD",
    "Is Local": false,
    "Is Microsoft": true,
    "API": true,
    "Available as quality gate": true,
    "Owner": "GitHub",
    "Product Link": "https://github.com/security",
    "Logo URL": "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
    "Code": true,
    "Build": true,
    "Test": true,
    "release": true,
    "deploy": null,
    "operate": null,
    "monitor": null,
    "plan": null,
    "Demo": "https://docs.github.com/en/code-security"
  }
]
```

### Error Responses

#### 404 Not Found

**Scenario**: File does not exist or path is incorrect

**Response**:

```
404 Not Found
```

**Handling**: Client displays error message "Unable to load tools data. Please refresh the page."

#### 500 Internal Server Error

**Scenario**: Server error during file serving

**Response**:

```
500 Internal Server Error
```

**Handling**: Client displays error message "Server error. Please try again later."

#### Network Error

**Scenario**: Network connection lost, DNS failure, etc.

**Handling**: Client catches fetch error and displays "Unable to connect. Please check your internet connection."

---

## Client-Side Contract

### TypeScript Interface

The client application uses this TypeScript interface (must match JSON structure exactly):

```typescript
interface Tool {
  Tools: string;
  Description: string;
  Familly: string;
  Type: string;
  "Security Level (1 = very light output, 5 = rich output)": number | null;
  "Importance (1 = specific, 5 = important)": number | null;
  "Implementation complexity  (1 = easy, 5 = complex)": number | null;
  "Use AI  (1 = not at all, 5 = built on AI)": number | null;
  Maturity: string;
  "Type of deployment needed": string;
  "Is Local": boolean | null;
  "Is Microsoft": boolean | null;
  API: boolean | null;
  "Available as quality gate": boolean | null;
  Owner: string;
  "Product Link": string;
  "Logo URL": string;
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
```

### Loading Pattern

```typescript
async function loadTools(): Promise<Tool[]> {
  try {
    const response = await fetch('/data/tools.json');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const tools: Tool[] = await response.json();
    
    // Basic validation
    if (!Array.isArray(tools) || tools.length === 0) {
      throw new Error('Invalid data format: expected non-empty array');
    }
    
    // Validate required fields
    tools.forEach((tool, index) => {
      if (!tool.Tools || typeof tool.Tools !== 'string') {
        console.warn(`Tool at index ${index} missing required field: Tools`);
      }
    });
    
    return tools;
    
  } catch (error) {
    console.error('Failed to load tools:', error);
    throw error;
  }
}
```

---

## Data Source

### Generation

The `data/tools.json` file is automatically generated from an Excel spreadsheet by the `scripts/excel-to-json.py` script, triggered by GitHub Actions workflow on changes to the Excel file.

**Source**: Excel table in `data/` directory  
**Generator**: Feature 001 (excel-json-api)  
**Frequency**: On-demand (when Excel file is updated)

### Manual Updates

DO NOT manually edit `data/tools.json` - it will be overwritten. To update tools data:

1. Edit the Excel file in `data/` directory
2. Commit and push the Excel file
3. GitHub Actions automatically regenerates `tools.json`

---

## Backwards Compatibility

### Field Changes

**Adding new fields**: Safe - client ignores unknown fields  
**Removing fields**: BREAKING - update TypeScript interface and filter logic  
**Renaming fields**: BREAKING - update TypeScript interface and all references  
**Changing field types**: BREAKING - update TypeScript interface and validation

### Current Version

**Version**: 1.0 (initial contract)  
**Breaking Changes Policy**: Any breaking changes require feature version bump and migration plan

---

## Testing

### Contract Validation Tests

- Verify actual `tools.json` file validates against JSON schema
- Check that all required fields are present in all objects
- Validate field types match schema (booleans not strings, numbers in range)
- Test null handling for nullable fields

### Integration Tests

- Load actual `tools.json` file in test environment
- Parse with TypeScript interface
- Verify filter operations work with real data
- Check edge cases (null values, special characters, long descriptions)

---

## Notes

This is a **static data contract**, not a REST API. The "endpoint" is a static file served by the web server (GitHub Pages). There are no query parameters, no POST/PUT/DELETE operations, and no authentication required.

The contract focuses on the structure and integrity of the JSON file to ensure the client-side filter application can reliably parse and display the data.
