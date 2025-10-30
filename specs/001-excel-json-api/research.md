# Research: Excel to JSON Conversion via GitHub Actions

**Feature**: 001-excel-json-api  
**Date**: 2025-10-30  
**Purpose**: Technology decisions, best practices, and implementation patterns for automated Excel-to-JSON conversion

## Research Areas

### 1. Excel Parsing in Python

**Decision**: Use `openpyxl` library

**Rationale**:

- Native support for `.xlsx` format (Office Open XML)
- Can read specific worksheets and tables by name
- Extracts calculated values from formulas automatically
- Handles date/time formats with proper conversion
- Lightweight and well-maintained
- Pure Python (no external dependencies like Java/Excel)
- Works in GitHub Actions ubuntu-latest runners

**Alternatives Considered**:

- **pandas + openpyxl**: More powerful but overkill for simple table reading; adds unnecessary dependency weight
- **xlrd**: Deprecated for `.xlsx` files; only supports older `.xls` format
- **pyxlsb**: Only for binary `.xlsb` format
- **excel-action (GitHub Marketplace)**: Limited customization; doesn't support table extraction or error handling requirements

**Implementation Pattern**:

```python
from openpyxl import load_workbook

workbook = load_workbook('/data/QA.xlsx', data_only=True)  # data_only=True extracts calculated values
worksheet = workbook['Tools']
table = worksheet.tables['Tools']  # Access named table
```

### 2. GitHub Actions Workflow Triggers

**Decision**: Use `paths` filter with `on: push` event

**Rationale**:

- Triggers only when `/data/QA.xlsx` changes (efficient, avoids unnecessary runs)
- Can also trigger on `workflow_dispatch` for manual execution
- Supports conditional logic to check if `/data/tools.json` exists (for initial generation)
- Standard GitHub Actions pattern for file-specific automation

**Alternatives Considered**:

- **Schedule (cron)**: Wastes Actions minutes; runs even when Excel unchanged
- **Pull request triggers**: Would generate JSON in PRs; prefer only on main branch after merge
- **External webhook**: Overcomplicated; requires additional infrastructure

**Implementation Pattern**:

```yaml
on:
  push:
    branches: [main]
    paths:
      - 'data/QA.xlsx'
  workflow_dispatch:  # Allow manual trigger
```

### 3. Workflow Failure Handling

**Decision**: Use `continue-on-error: true` for JSON generation step with conditional commit

**Rationale**:

- Allows workflow to fail gracefully without blocking deployment
- Conditional commit only runs if JSON generation succeeded
- Preserves existing `/data/tools.json` file if present
- Logs errors for debugging while keeping site functional

**Alternatives Considered**:

- **Hard fail**: Would block entire deployment; violates FR-011
- **Try-catch in Python only**: Workflow would still show as failed; doesn't achieve graceful degradation
- **Separate workflow**: Complicates architecture; harder to maintain

**Implementation Pattern**:

```yaml
- name: Generate JSON
  id: generate
  continue-on-error: true
  run: python scripts/excel-to-json.py

- name: Commit JSON
  if: steps.generate.outcome == 'success'
  run: |
    git add data/tools.json
    git commit -m "Auto-update tools.json from Excel"
```

### 4. Date Format Handling

**Decision**: Convert Excel dates to ISO 8601 format (`YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SS`)

**Rationale**:

- ISO 8601 is universally parseable by JavaScript `Date` constructor
- Unambiguous (no US vs. EU date format confusion)
- Sorting-friendly (lexicographic sort works)
- JSON standard practice

**Alternatives Considered**:

- **Unix timestamp**: Less human-readable; not standard for JSON APIs
- **Excel serial number**: Requires client-side conversion; error-prone
- **Locale-specific format**: Ambiguous; varies by region

**Implementation Pattern**:

```python
from datetime import datetime

if isinstance(cell.value, datetime):
    json_value = cell.value.isoformat()  # YYYY-MM-DDTHH:MM:SS format
```

### 5. JSON Structure

**Decision**: Flat array of objects with no wrapper

**Rationale**:

- Simplest structure for client-side consumption
- Easy to iterate: `data.forEach(tool => ...)`
- No unnecessary nesting
- Minimizes file size
- Follows clarification Q5 decision

**Alternatives Considered**:

- **Wrapped with metadata**: Adds overhead; metadata (like count) computable client-side
- **Nested by category**: Requires predefined categorization; limits flexibility
- **Single object with keys**: Harder to iterate; assumes unique identifier field

**Implementation Pattern**:

```python
import json

tools = [
    {header: cell.value for header, cell in zip(headers, row)}
    for row in table_range[1:]  # Skip header row
]

with open('/data/tools.json', 'w', encoding='utf-8') as f:
    json.dump(tools, f, indent=2, ensure_ascii=False)
```

### 6. Empty Cell Handling

**Decision**: Represent empty cells as `null` in JSON

**Rationale**:

- JSON standard for absence of value
- Distinguishes between empty string `""` and no value
- Easy to check in JavaScript: `if (tool.field == null)`
- Aligns with FR-007

**Alternatives Considered**:

- **Empty string `""`**: Ambiguous (is it intentionally empty or missing?)
- **Omit field entirely**: Inconsistent object shapes; harder to work with
- **Custom sentinel value**: Non-standard; requires documentation

### 7. Column Name Sanitization

**Decision**: Preserve column names as-is, including spaces and special characters

**Rationale**:

- Aligns with FR-014 (preserve as JSON keys)
- Excel users can use natural language headers
- JavaScript can access with bracket notation: `tool["Tool Name"]`
- No loss of information

**Alternatives Considered**:

- **Convert to camelCase**: Loses original intent; may create conflicts
- **Replace spaces with underscores**: Alters user's chosen names
- **Validate/restrict names**: Adds friction to Excel editing

**Best Practice Note**: Document that spaces in column names require bracket notation in JavaScript.

### 8. Testing Strategy

**Decision**: Multi-layered validation approach

**Testing Layers**:

1. **Workflow validation**: GitHub Actions syntax check before commit
2. **Python unit tests**: Test Excel parsing logic with sample files
3. **JSON schema validation**: Validate output against JSON schema
4. **Manual testing**: Test with actual QA.xlsx file
5. **Integration testing**: Verify JSON loads correctly on website

**Implementation Pattern**:

```yaml
- name: Validate JSON
  run: |
    python -m json.tool data/tools.json > /dev/null  # Validates JSON syntax
    # Could add: jsonschema --instance data/tools.json contracts/tools-schema.json
```

### 9. Git Commit Strategy

**Decision**: Auto-commit JSON with descriptive message; include timestamp

**Rationale**:

- Keeps JSON in sync with Excel source
- Git history shows when data changed
- Allows rollback if needed
- Timestamp helps correlate with Excel changes

**Implementation Pattern**:

```yaml
- name: Commit and Push
  run: |
    git config user.name "github-actions[bot]"
    git config user.email "github-actions[bot]@users.noreply.github.com"
    git add data/tools.json
    git commit -m "chore: auto-update tools.json from Excel [skip ci]" || echo "No changes"
    git push
```

**Note**: `[skip ci]` prevents infinite workflow loops if other workflows trigger on push.

### 10. Performance Optimization

**Decision**: Minimal optimization; straightforward implementation

**Rationale**:

- Expected data size <1,000 rows is small
- Workflow runs infrequently (only on Excel changes)
- Optimization would add complexity without meaningful benefit
- 30-second target easily achievable with basic implementation

**Future Optimization Opportunities** (if needed):

- Stream processing for very large files
- Caching openpyxl worksheet in memory
- Parallel processing (unlikely to be needed)

## Security Considerations

### Excel File Integrity

**Risk**: Malicious Excel file could exploit openpyxl vulnerabilities

**Mitigation**:

- Excel file changes require PR review (GitHub branch protection)
- openpyxl is actively maintained with security patches
- GitHub Actions runs in isolated container
- No execution of Excel macros (read-only, data_only mode)

### Credentials

**Risk**: None - no credentials needed

**Note**: GitHub Actions has built-in `GITHUB_TOKEN` for repository operations (commit/push). No additional secrets required.

### Output Validation

**Risk**: Invalid JSON could break website

**Mitigation**:

- JSON syntax validation in workflow
- Failure doesn't delete existing JSON
- Manual PR review before merge to main

## Dependencies

### Python Libraries

- **openpyxl** `^3.1.0`: Excel parsing
  - License: MIT
  - Actively maintained
  - No security vulnerabilities

### GitHub Actions

- **actions/checkout@v4**: Repository checkout
- **actions/setup-python@v5**: Python environment
- **Built-in git commands**: Commit and push

## Documentation Requirements

1. **quickstart.md**: Developer setup, local testing instructions
2. **contracts/tools-schema.json**: JSON schema for output validation
3. **README update**: Document workflow existence and behavior
4. **Excel file documentation**: Document required structure (worksheet "Tools", table "Tools")

## Open Questions & Decisions

✅ All technical clarifications resolved during spec clarification phase.

## References

- [openpyxl documentation](https://openpyxl.readthedocs.io/)
- [GitHub Actions documentation](https://docs.github.com/en/actions)
- [JSON Schema specification](https://json-schema.org/)
- [ISO 8601 date format](https://en.wikipedia.org/wiki/ISO_8601)
