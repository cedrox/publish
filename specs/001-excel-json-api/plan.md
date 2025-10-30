# Implementation Plan: Excel to JSON Conversion via GitHub Actions

**Branch**: `001-excel-json-api` | **Date**: 2025-10-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-excel-json-api/spec.md`

## Summary

This feature automates the conversion of Excel data to JSON for static site consumption. A GitHub Actions workflow reads the Excel file at `/data/QA.xlsx` (worksheet "Tools", table "Tools"), converts it to a flat JSON array, and outputs `/data/tools.json` which is deployed with the Jekyll site. The workflow triggers on Excel file changes or when the JSON file is missing, fails gracefully to preserve existing data, and extracts calculated values from formulas.

## Technical Context

**Language/Version**: GitHub Actions (YAML), Python 3.11+ (for Excel parsing script)  
**Primary Dependencies**: Python libraries (openpyxl or pandas for Excel reading), GitHub Actions environment  
**Storage**: Git repository (Excel source at `/data/QA.xlsx`, JSON output at `/data/tools.json`)  
**Testing**: GitHub Actions workflow validation, JSON schema validation, manual Excel file testing  
**Target Platform**: GitHub Actions runners (ubuntu-latest), GitHub Pages (static file serving)  
**Project Type**: CI/CD automation (GitHub Actions workflow) + static site asset generation  
**Performance Goals**: Workflow completion <30s for tables up to 1,000 rows; JSON load <2s for end users  
**Constraints**: GitHub Actions runtime limits (6 hours max, but expect <1 minute); GitHub Pages file size limits (1GB repo, 100MB per file); Static-only hosting (no server-side processing)  
**Scale/Scope**: Single Excel file, single table ("Tools"), expected <1,000 rows, JSON output <5MB

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### III. Automated Deployment (NON-NEGOTIABLE)

✅ **PASS**: This feature directly implements automated deployment via GitHub Actions. Every Excel file commit triggers automatic JSON generation and deployment to GitHub Pages.

**Compliance**:

- Workflow triggers on push to main (after PR merge)
- Builds JSON artifact automatically
- Validates Excel file before generation
- Fails gracefully without blocking site deployment

### I. Content-First

✅ **PASS**: Feature enables content management through Excel while serving optimized JSON to visitors. Excel provides accessible content editing; JSON ensures fast website delivery.

**Compliance**:

- Excel file is version-controlled in `/data/` directory
- Content structure preserved (headers → JSON keys)
- Independently valuable (tools data serves website needs)

### II. Static-First Architecture

✅ **PASS**: Solution generates static JSON file served by GitHub Pages. No runtime server dependencies.

**Compliance**:

- JSON generated at build time via GitHub Actions
- Output is static file served via CDN
- No server-side processing required
- Fast, cacheable delivery

### IV. Accessibility and Performance

✅ **PASS**: Generated JSON is lightweight and loads quickly. Semantic data structure with clear field names.

**Compliance**:

- JSON format is universally accessible
- File size optimized (flat array structure)
- Load time target <2s on standard connection
- Workflow generates valid, parseable JSON

### V. SEO and Discoverability

⚠️ **NEUTRAL**: JSON data file itself is not directly discoverable, but enables dynamic page rendering that supports SEO.

**Note**: JSON is infrastructure for content display. Actual SEO handled by pages that consume the JSON data.

**Post-Phase-1 Re-check**: ✅ All gates remain PASS or NEUTRAL

## Project Structure

### Documentation (this feature)

```text
specs/001-excel-json-api/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Technology decisions and best practices
├── data-model.md        # Tool record schema
├── quickstart.md        # Developer setup guide
├── contracts/           # JSON schema definitions
│   └── tools-schema.json
└── checklists/
    └── requirements.md  # Quality validation checklist
```

### Source Code (repository root)

```text
.github/
└── workflows/
    └── excel-to-json.yml    # Main workflow file

data/
├── QA.xlsx                   # Source Excel file (existing)
└── tools.json                # Generated JSON output (auto-generated)

scripts/
└── excel-to-json.py          # Python script to convert Excel to JSON
```

**Structure Decision**:

This is a **CI/CD automation project** integrated into the existing Jekyll static site. The implementation requires:

1. **GitHub Actions Workflow** (`.github/workflows/excel-to-json.yml`) - Defines trigger conditions, sets up Python environment, runs conversion script, commits generated JSON
2. **Python Conversion Script** (`scripts/excel-to-json.py`) - Reads Excel file, parses specific worksheet/table, generates JSON array
3. **Data Files** (`data/` directory) - Contains both source Excel (already exists) and generated JSON output

No traditional src/ or tests/ directories are needed since this is workflow automation, not a standalone application. Testing is performed through workflow execution and JSON validation.

## Complexity Tracking

> No constitution violations - table is empty.

This feature aligns with all constitutional principles and requires no complexity justification.
