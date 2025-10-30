# Data Model: Excel to JSON Conversion

**Feature**: 001-excel-json-api  
**Date**: 2025-10-30  
**Purpose**: Define the data structure and schema for Tool records

## Overview

This data model documents the structure of Tool records extracted from `/data/QA.xlsx` (worksheet "Tools", table "Tools") and serialized to `/data/tools.json`. The schema is determined by the Excel table's column headers and data types.

## Entity: Tool

### Description

Represents a single tool or resource documented in the QA.xlsx Excel file. Each row in the "Tools" table corresponds to one Tool entity.

### Source

- **Excel File**: `/data/QA.xlsx`
- **Worksheet**: `Tools`
- **Table**: `Tools`
- **Data Extraction**: Reads all rows from named table, starting from row 2 (row 1 is headers)

### Field Structure

**Note**: The exact fields are determined by the column headers in the Excel table. This model provides the general structure and validation rules.

#### Field Naming

- **JSON Keys**: Column headers from Excel table are used as-is as JSON object keys
- **Preservation**: Spaces, special characters, and capitalization are preserved
- **Access Pattern**: JavaScript access with bracket notation: `tool["Tool Name"]`

#### Data Types

Based on Excel cell types, the following conversions apply:

| Excel Cell Type | JSON Type | Example Excel Value | Example JSON Value |
|-----------------|-----------|---------------------|-------------------|
| Text (string) | `string` | `"GitHub Copilot"` | `"GitHub Copilot"` |
| Number | `number` | `100` | `100` |
| Date | `string` (ISO 8601) | `2024-01-15` | `"2024-01-15T00:00:00"` |
| DateTime | `string` (ISO 8601) | `2024-01-15 14:30` | `"2024-01-15T14:30:00"` |
| Boolean | `boolean` | `TRUE` | `true` |
| Formula (calculated) | (depends on result) | `=A1+B1` | `150` (evaluated value) |
| Empty | `null` | (empty cell) | `null` |

### Example Tool Record

Based on typical QA tool documentation, a Tool record might look like:

```json
{
  "Tool Name": "GitHub Copilot",
  "Category": "AI-Powered Development",
  "Description": "AI pair programmer for code completion and generation",
  "License Type": "Commercial",
  "Documentation URL": "https://docs.github.com/copilot",
  "Last Updated": "2024-01-15T00:00:00",
  "Supported Languages": "Python, JavaScript, TypeScript, Java, Go, etc.",
  "Integration": "VS Code, Visual Studio, JetBrains IDEs",
  "Cost": 10,
  "Active": true
}
```

**Important**: This is an illustrative example. Actual fields depend on the Excel table structure.

### Validation Rules

#### Required Fields

**None** - All fields are optional. If a cell is empty, the field will be `null`.

**Rationale**: Excel table may have incomplete rows; system should handle gracefully.

#### Field Constraints

1. **String Fields**:
   - Maximum length: No limit (constrained by JSON file size limits)
   - Empty strings: Preserved as `""`
   - Null handling: Empty cells become `null`, not `""`

2. **Number Fields**:
   - Type: Integer or decimal (float)
   - Range: No constraints
   - Invalid values: Non-numeric text in number columns treated as `null` or error

3. **Date/DateTime Fields**:
   - Format: ISO 8601 (`YYYY-MM-DDTHH:MM:SS` or `YYYY-MM-DD`)
   - Timezone: Excel dates have no timezone; converted to local time or UTC
   - Invalid dates: Handled by Python openpyxl library

4. **Boolean Fields**:
   - Values: `true` or `false`
   - Excel representation: `TRUE`/`FALSE` or `1`/`0`

5. **Formula Fields**:
   - Extraction: Calculated value only (not formula text)
   - Evaluation: Performed by Excel; openpyxl reads final value
   - Errors: If formula evaluates to `#ERROR`, value is `null` or error string

### Special Cases

#### 1. Duplicate Column Names

**Behavior**: If Excel table has duplicate column headers, openpyxl behavior is undefined. The Python script should detect and error.

**Mitigation**: Validation step in Python script to check for unique headers.

#### 2. Hidden Columns

**Behavior**: Hidden columns in Excel are still read by openpyxl unless explicitly excluded.

**Decision**: Include all columns (hidden or visible) to avoid data loss.

#### 3. Merged Cells

**Behavior**: Merged cells are read with only the first cell containing the value; others are `null`.

**Decision**: Excel table format should avoid merged cells for data integrity.

#### 4. Rich Text / Formatting

**Behavior**: openpyxl extracts plain text value; formatting (bold, colors) is lost.

**Decision**: Acceptable - JSON is for data, not presentation.

## JSON Output Structure

### Root Structure

The output JSON is a **flat array** of Tool objects:

```json
[
  { /* Tool 1 */ },
  { /* Tool 2 */ },
  { /* Tool 3 */ }
]
```

**No wrapper object** - The array is the root element.

### Object Shape

All Tool objects in the array have the same field structure (keys), determined by the Excel table headers. If a field is missing for a specific tool, its value is `null`.

### File Metadata

The JSON file itself has no metadata (no version, timestamp, or count fields). Metadata can be inferred:

- **Generated date**: Git commit timestamp
- **Record count**: `tools.length` in JavaScript
- **Source version**: Git history of `/data/QA.xlsx`

## Relationships

**None** - Tool records are independent entities with no relationships to other entities.

If future requirements introduce relationships (e.g., Tool → Category), the data model will need revision.

## Evolution & Versioning

### Schema Changes

If Excel table columns change (add/remove/rename), the JSON structure automatically adapts:

- **New columns**: Automatically included in JSON
- **Removed columns**: Automatically excluded
- **Renamed columns**: Reflected in JSON keys

**No migration required** - The schema is dynamic based on Excel structure.

### Backward Compatibility

Website code consuming the JSON should:

- Handle missing fields gracefully (use optional chaining: `tool?.fieldName`)
- Not rely on field order (JSON objects are unordered)
- Validate expected fields exist before use

### Versioning Strategy

**No explicit versioning** - The JSON structure is implicitly versioned by:

1. Git commit of `/data/QA.xlsx` (source of truth)
2. Git commit of `/data/tools.json` (generated output)

If breaking changes are needed, consider adding a `_version` field to each Tool object in the future.

## Query & Access Patterns

### Client-Side (JavaScript)

```javascript
// Fetch the JSON file
const response = await fetch('/data/tools.json');
const tools = await response.json();

// Access fields with bracket notation (for names with spaces)
tools.forEach(tool => {
  console.log(tool["Tool Name"]);
  console.log(tool["Category"]);
});

// Filter by field
const aiTools = tools.filter(tool => tool["Category"] === "AI-Powered Development");

// Sort by field
const sortedTools = tools.sort((a, b) => a["Tool Name"].localeCompare(b["Tool Name"]));

// Handle null values
const activeTools = tools.filter(tool => tool["Active"] === true);
```

### Performance Considerations

- **File size**: Expected <100KB for <1,000 rows
- **Load time**: <2 seconds for fetch + parse
- **Memory**: Entire array loaded into memory (acceptable for small datasets)

If the dataset grows significantly (>10,000 rows), consider:

- Pagination (split into multiple JSON files)
- Server-side filtering (requires backend API)
- Compression (gzip via GitHub Pages)

### Browser Caching Behavior

**GitHub Pages Default Headers**:

- **Cache-Control**: `max-age=3600` (1 hour)
- **ETag**: Content-based hash for validation
- **Last-Modified**: File timestamp from Git commit

**Cache Invalidation**:

- When Excel file is updated and JSON is regenerated, ETag changes
- Browser revalidates on next request and fetches new version
- Hard refresh (`Ctrl+Shift+R`) bypasses cache immediately
- No manual cache-busting query parameters needed

**Client-Side Caching Strategy**:

```javascript
// Browser automatically handles ETag validation
fetch('/data/tools.json')
  .then(response => response.json())
  .then(tools => {
    // Tools will be latest version if ETag changed
    // Otherwise served from browser cache
  });
```

**Testing Cache Behavior**:

1. Load JSON in browser (cached for 1 hour)
2. Update Excel file and push to trigger workflow
3. Wait for workflow to commit new JSON (~1-2 minutes)
4. Reload page - browser checks ETag, fetches new version if changed
5. Hard refresh forces immediate fetch bypassing cache

## JSON Schema

See `contracts/tools-schema.json` for formal JSON Schema definition.

The schema provides:

- Field definitions with types
- Validation rules
- Example values
- Documentation for each field

## References

- [JSON Standard (RFC 8259)](https://tools.ietf.org/html/rfc8259)
- [ISO 8601 Date Format](https://en.wikipedia.org/wiki/ISO_8601)
- [openpyxl Documentation](https://openpyxl.readthedocs.io/)
