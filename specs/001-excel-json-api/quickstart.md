# Quickstart: Excel to JSON Conversion

**Feature**: 001-excel-json-api  
**Date**: 2025-10-30  
**Purpose**: Developer setup and testing guide for Excel-to-JSON workflow

## Overview

This guide will help you set up your local environment to develop, test, and debug the automated Excel-to-JSON conversion workflow.

## Prerequisites

### Required Software

1. **Python 3.11 or later**
   - Download: [python.org/downloads](https://www.python.org/downloads/)
   - Verify: `python --version`

2. **Git**
   - Download: [git-scm.com](https://git-scm.com/)
   - Verify: `git --version`

3. **Visual Studio Code** (recommended)
   - Download: [code.visualstudio.com](https://code.visualstudio.com/)
   - Extensions: Python, GitHub Actions

4. **Excel or LibreOffice Calc**
   - For editing `/data/QA.xlsx`

### Python Dependencies

Install required Python package:

```bash
pip install openpyxl
```

**Optional** (for development):

```bash
pip install pytest           # For unit tests
pip install jsonschema       # For JSON validation
```

## Repository Setup

### 1. Clone the Repository

```bash
git clone https://github.com/cedrox/publish.git
cd publish
```

### 2. Create Feature Branch

```bash
git checkout -b 001-excel-json-api
```

### 3. Verify File Structure

Ensure these files exist:

```text
publish/
├── data/
│   └── QA.xlsx                    # Source Excel file
├── .github/
│   └── workflows/
│       └── excel-to-json.yml      # GitHub Actions workflow
├── scripts/
│   └── excel-to-json.py           # Python conversion script
└── specs/
    └── 001-excel-json-api/
        ├── spec.md
        ├── plan.md
        ├── research.md
        ├── data-model.md
        ├── quickstart.md
        └── contracts/
            └── tools-schema.json
```

## Local Development

### Running the Conversion Script Locally

#### Step 1: Navigate to repository root

```bash
cd s:\repos\cedrox\publish
```

#### Step 2: Run the Python script

```bash
python scripts/excel-to-json.py
```

#### Step 3: Verify output

Check that `/data/tools.json` was created:

```bash
cat data/tools.json
```

Or open in VS Code:

```bash
code data/tools.json
```

### Validating the JSON Output

#### Option 1: Python JSON Tool

```bash
python -m json.tool data/tools.json
```

If valid, it will print formatted JSON. If invalid, it will show an error.

#### Option 2: JSON Schema Validation

```bash
pip install jsonschema
jsonschema --instance data/tools.json specs/001-excel-json-api/contracts/tools-schema.json
```

#### Option 3: Manual Inspection

1. Open `data/tools.json` in VS Code
2. Check for syntax highlighting errors
3. Verify structure matches expected format (array of objects)
4. Check sample records for correct data types

### Testing Excel Changes

#### Step 1: Edit the Excel File

1. Open `/data/QA.xlsx` in Excel
2. Navigate to the "Tools" worksheet
3. Make changes to the "Tools" table (add/edit/delete rows or columns)
4. Save the file

#### Step 2: Re-run the Script

```bash
python scripts/excel-to-json.py
```

#### Step 3: Compare Outputs

Use Git diff to see JSON changes:

```bash
git diff data/tools.json
```

### Debugging

#### Common Issues

**1. `FileNotFoundError: [Errno 2] No such file or directory: '/data/QA.xlsx'`**

**Solution**: Ensure you're running the script from the repository root, not the `scripts/` directory.

```bash
cd s:\repos\cedrox\publish
python scripts/excel-to-json.py
```

**2. `KeyError: 'Tools'` (worksheet not found)**

**Solution**: Verify the Excel file has a worksheet named "Tools" (case-sensitive).

**3. `KeyError: 'Tools'` (table not found)**

**Solution**: Verify the worksheet has a named table called "Tools". In Excel:

- Select table → Table Design tab → Table Name should be "Tools"

**4. `JSONDecodeError: Expecting value`**

**Solution**: The generated JSON is invalid. Check the Python script for bugs. Run `python -m json.tool data/tools.json` to see the error.

**5. `openpyxl` not installed**

**Solution**: Install the dependency:

```bash
pip install openpyxl
```

#### Debug Mode

To add debug output to the Python script, edit `scripts/excel-to-json.py` and add:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## Testing the GitHub Actions Workflow

### Local Workflow Validation

#### Option 1: GitHub CLI (`gh`)

Install GitHub CLI: [cli.github.com](https://cli.github.com/)

```bash
gh workflow run excel-to-json.yml
```

#### Option 2: Act (Run GitHub Actions Locally)

Install Act: [github.com/nektos/act](https://github.com/nektos/act)

```bash
act push -W .github/workflows/excel-to-json.yml
```

**Note**: Act emulates GitHub Actions but may have differences. Always verify in GitHub Actions after push.

### Testing on GitHub

#### Step 1: Commit and Push

```bash
git add .
git commit -m "feat: add Excel to JSON conversion workflow"
git push origin 001-excel-json-api
```

#### Step 2: Trigger Workflow

The workflow triggers automatically on push if `/data/QA.xlsx` was changed. To manually trigger:

1. Go to: `https://github.com/cedrox/publish/actions`
2. Select "Excel to JSON Conversion" workflow
3. Click "Run workflow" → Select branch → "Run workflow"

#### Step 3: Monitor Execution

1. Click on the workflow run
2. Expand each step to see logs
3. Check for errors (red X) or success (green checkmark)

#### Step 4: Verify JSON Commit

After successful run:

1. Go to `https://github.com/cedrox/publish/commits/001-excel-json-api`
2. Look for commit: "Auto-update tools.json from Excel"
3. Click commit to see diff of `data/tools.json`

## Testing on the Website

### Step 1: Merge to Main Branch

```bash
git checkout main
git merge 001-excel-json-api
git push origin main
```

### Step 2: Wait for GitHub Pages Deployment

GitHub Pages automatically rebuilds after push to main (usually <5 minutes).

### Step 3: Test JSON Access

Open browser console on your site and run:

```javascript
fetch('https://your-site.github.io/publish/data/tools.json')
  .then(response => response.json())
  .then(tools => console.table(tools))
  .catch(error => console.error('Error:', error));
```

Replace `your-site.github.io/publish` with your actual GitHub Pages URL.

### Step 4: Verify CORS and Content-Type

Check response headers:

```javascript
fetch('https://your-site.github.io/publish/data/tools.json')
  .then(response => {
    console.log('Status:', response.status);
    console.log('Content-Type:', response.headers.get('Content-Type'));
    console.log('Access-Control-Allow-Origin:', response.headers.get('Access-Control-Allow-Origin'));
  });
```

Expected:

- Status: `200`
- Content-Type: `application/json` or `text/plain`
- Access-Control-Allow-Origin: `*` (GitHub Pages allows CORS)

## Troubleshooting

### Workflow Fails but JSON Exists

**Expected behavior** - The workflow uses `continue-on-error: true` to allow graceful failure. If the Python script fails, the existing `/data/tools.json` is preserved and the site remains functional.

**Check**:

1. Review workflow logs for error message
2. Fix the issue (e.g., malformed Excel file)
3. Push fix and re-run workflow

### JSON Not Updating After Excel Changes

**Possible causes**:

1. **Workflow didn't trigger**: Check if `/data/QA.xlsx` was committed and pushed
2. **Workflow failed**: Check GitHub Actions logs
3. **Caching issue**: Hard refresh browser (`Ctrl+Shift+R`) or clear cache

**Solution**:

```bash
git log --oneline data/QA.xlsx      # Check if Excel was committed
git log --oneline data/tools.json   # Check if JSON was updated
```

### Excel File Corruption

If the Excel file becomes corrupted or won't open:

1. Restore from Git history:

   ```bash
   git checkout HEAD~1 data/QA.xlsx
   ```

2. Or restore from a specific commit:

   ```bash
   git log --oneline data/QA.xlsx     # Find good commit
   git checkout <commit-hash> data/QA.xlsx
   ```

## Development Workflow Summary

1. **Edit Excel**: Modify `/data/QA.xlsx`
2. **Test Locally**: Run `python scripts/excel-to-json.py`
3. **Validate JSON**: Run `python -m json.tool data/tools.json`
4. **Commit**: `git add data/QA.xlsx data/tools.json`
5. **Push**: `git push origin 001-excel-json-api`
6. **Verify Workflow**: Check GitHub Actions logs
7. **Test on Site**: Fetch JSON from GitHub Pages URL

## Next Steps

- Review [spec.md](spec.md) for feature requirements
- Review [plan.md](plan.md) for implementation plan
- Review [research.md](research.md) for technical decisions
- Review [data-model.md](data-model.md) for data structure
- Implement Python script: `scripts/excel-to-json.py`
- Implement GitHub Actions workflow: `.github/workflows/excel-to-json.yml`

## Resources

- [openpyxl Documentation](https://openpyxl.readthedocs.io/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [JSON Schema Specification](https://json-schema.org/)
- [Jekyll GitHub Pages Guide](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll)

## Support

For issues or questions:

1. Check GitHub Actions logs for errors
2. Review this quickstart guide
3. Review technical documentation in `specs/001-excel-json-api/`
4. Open a GitHub issue with error logs and reproduction steps
