# Feature Specification: Excel to JSON Conversion via GitHub Actions

**Feature Branch**: `001-excel-json-api`  
**Created**: 2025-10-30  
**Status**: Draft  
**Input**: User description: "create a json api with the content of the Excel file"

## Clarifications

### Session 2025-10-30

- Q: JSON Structure and Filtering → A: Single JSON file with all data - client handles filtering if needed
- Q: GitHub Actions Trigger → A: Trigger only when /data/QA.xlsx changes, or if /data/tools.json doesn't exist (initial generation)
- Q: Workflow Failure Handling → A: Fail the workflow but don't block deployment; preserve existing tools.json
- Q: Cell Value Extraction → A: Extract calculated values (formula results)
- Q: JSON Array Structure → A: Simple flat array of objects

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Static JSON Generation from Excel (Priority: P1)

A content manager updates the Excel file at `/data/QA.xlsx` (worksheet "Tools", table "Tools") and commits it to the repository. A GitHub Actions workflow automatically reads the Excel table and generates a static JSON file at `/data/tools.json`, which is then deployed with the site.

**Why this priority**: This is the foundational capability - without automatic JSON generation from Excel, the entire feature cannot work. This delivers immediate value by enabling content management through Excel while serving static JSON to website visitors.

**Independent Test**: Can be fully tested by updating the Excel file, pushing changes, and verifying that the GitHub Actions workflow generates the correct JSON file that gets deployed with the site.

**Acceptance Scenarios**:

1. **Given** the Excel file `/data/QA.xlsx` exists with worksheet "Tools" and table "Tools", **When** the file is committed to the repository, **Then** the GitHub Actions workflow generates `/data/tools.json` with all table rows
2. **Given** the Excel table has headers in the first row, **When** JSON is generated, **Then** each row is represented as a JSON object with header names as keys
3. **Given** the JSON file does not exist yet, **When** the workflow runs for the first time, **Then** it creates `/data/tools.json` successfully

---

### User Story 2 - Access JSON Data on Website (Priority: P1)

A website visitor accesses a page that displays tool information. The page fetches the static JSON file from `/data/tools.json` and renders the content dynamically using client-side JavaScript.

**Why this priority**: Co-priority with Story 1 - both are essential for the feature to deliver value. Users need to be able to view the data that was converted from Excel.

**Independent Test**: Can be tested by loading the website and verifying that the JSON file is fetched and data is displayed correctly in the browser.

**Acceptance Scenarios**:

1. **Given** the JSON file exists at `/data/tools.json`, **When** a user visits a page that needs the data, **Then** the page successfully fetches and displays the tool information
2. **Given** the JSON contains multiple tool records, **When** the page loads, **Then** all records are available for display or filtering
3. **Given** a user's browser has cached an old version, **When** new data is deployed, **Then** the page loads the updated JSON (proper cache headers set)

---

### User Story 3 - Workflow Error Handling (Priority: P2)

A content manager commits a corrupted or malformed Excel file. The GitHub Actions workflow detects the error, fails the JSON generation step, but preserves the existing `/data/tools.json` file and allows the site deployment to proceed.

**Why this priority**: Critical for maintaining site stability - a broken Excel file shouldn't break the entire website. The site continues serving the last known good data.

**Independent Test**: Can be tested by deliberately committing a corrupted Excel file and verifying that the workflow fails gracefully without breaking the site deployment.

**Acceptance Scenarios**:

1. **Given** the Excel file is corrupted or unreadable, **When** the workflow runs, **Then** it logs an error but does not delete the existing JSON file
2. **Given** the worksheet "Tools" or table "Tools" is missing, **When** the workflow runs, **Then** it fails with a clear error message indicating what is missing
3. **Given** a workflow failure occurs, **When** the site deploys, **Then** the deployment continues with the existing JSON file intact

---

### Edge Cases

- What happens when the Excel file is empty (no data rows in table "Tools")?
- What happens when column names in the table header contain spaces or special characters?
- How does the system handle very large tables (1,000+ rows)?
- How are special characters in Excel cells handled in JSON output?
- What happens when Excel cells contain formulas? (Answer: Extract calculated values)
- How are date/time formats from Excel converted to JSON strings?
- What happens if someone commits both Excel and JSON changes in the same commit?
- What happens when the workflow runs while another workflow is also running?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: GitHub Actions workflow MUST trigger when `/data/QA.xlsx` file changes or when `/data/tools.json` does not exist
- **FR-002**: Workflow MUST read Excel file from `/data/QA.xlsx`, specifically worksheet "Tools" and table "Tools"
- **FR-003**: Workflow MUST parse the table's first row as column headers and use them as JSON object keys
- **FR-004**: Workflow MUST generate a JSON file at `/data/tools.json` as a simple flat array of objects
- **FR-005**: Workflow MUST extract calculated values from cells containing formulas, not the formula text itself
- **FR-006**: Workflow MUST convert Excel date formats to ISO 8601 date strings in JSON output
- **FR-007**: Workflow MUST represent empty cells as null values in JSON
- **FR-008**: Workflow MUST validate that the Excel file, worksheet "Tools", and table "Tools" exist before attempting to parse
- **FR-009**: Workflow MUST fail gracefully if Excel file is corrupted, worksheet is missing, or table is missing, logging clear error messages
- **FR-010**: Workflow failure MUST NOT delete or overwrite existing `/data/tools.json` file
- **FR-011**: Workflow failure MUST NOT block the GitHub Pages deployment process
- **FR-012**: Generated JSON file MUST be committed to the repository and included in the deployment
- **FR-013**: JSON file MUST be served with appropriate cache headers to allow browser caching while respecting updates
- **FR-014**: Workflow MUST handle column names with spaces or special characters by preserving them as JSON keys
- **FR-015**: Workflow MUST process all rows from the table, excluding only the header row

### Key Entities

- **Tool Record**: Represents a single row from the "Tools" table, with properties matching column headers and values from corresponding cells
- **JSON Output**: A flat array of Tool Record objects, with no wrapper or metadata (simple structure for easy client-side consumption)
- **GitHub Actions Workflow**: The automation that reads Excel and generates JSON on specified triggers

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Workflow completes JSON generation in under 30 seconds for Excel tables with up to 1,000 rows
- **SC-002**: Workflow correctly parses and converts 100% of non-empty rows from the "Tools" table
- **SC-003**: Generated JSON file is valid and can be parsed by standard JSON parsers without errors
- **SC-004**: Website visitors can fetch and load the JSON file in under 2 seconds on a standard broadband connection
- **SC-005**: Workflow failure preserves existing JSON file in 100% of error scenarios
- **SC-006**: Content updates in Excel file are reflected on the published website within 5 minutes of push to main branch
- **SC-007**: Workflow successfully handles Excel files with different date formats, preserving date values accurately in 100% of cases
- **SC-008**: Workflow error messages clearly identify the problem in 90% of failure cases without requiring workflow log analysis

## Assumptions *(optional)*

- Excel file will be located at `/data/QA.xlsx` in the repository
- Excel file will contain a worksheet named "Tools" with a table named "Tools"
- The table will have a consistent structure with headers in the first row
- Excel file will be updated through normal Git workflow (commit and push)
- Data volume will remain under 1,000 rows for reasonable workflow performance
- GitHub Actions has sufficient permissions to read Excel file and write JSON file
- GitHub Pages is configured to serve static files from the repository
- Website will use client-side JavaScript to fetch and process the JSON file
- Any filtering or search functionality will be implemented client-side, not in the JSON generation

## Out of Scope *(optional)*

- Writing or modifying Excel files through the website (read-only conversion)
- Dynamic API endpoints or server-side processing
- Real-time updates or WebSocket connections
- Server-side filtering, pagination, or search functionality
- Support for Excel macros or complex formulas (only calculated values extracted)
- Data transformation or aggregation beyond simple table-to-JSON conversion
- Multiple Excel files or multiple tables from the same file
- Versioning or history of Excel file changes (managed through Git)
- Authentication or authorization (public static JSON file)
- Backup or recovery of Excel data (managed through Git version control)
