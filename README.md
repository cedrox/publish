# publish
Website about Elevating Software Quality with AI and Modern Tools

[![Excel to JSON](https://github.com/cedrox/publish/actions/workflows/excel-to-json.yml/badge.svg)](https://github.com/cedrox/publish/actions/workflows/excel-to-json.yml)

## ✨ Features

### Excel to JSON Automation

Automatically converts tool data from Excel to JSON for website consumption.

- **Source**: `/data/QA.xlsx` (worksheet "Tools", table "Tools")
- **Output**: `/data/tools.json` (flat array of tool objects)
- **Trigger**: GitHub Actions workflow on Excel file changes
- **Error Handling**: Preserves existing JSON if conversion fails

📖 **[View Documentation](specs/001-excel-json-api/quickstart.md)** - Setup guide, testing instructions, and API reference

## 🚀 Deployment

This Jekyll site is automatically built and deployed using GitHub Actions.

### Production Deployment

When changes are merged to the `main` branch, the site is automatically:
1. Built using Jekyll
2. Deployed to GitHub Pages
3. Available at: **https://cedrox.github.io/publish/**

### Pull Request Previews

When you create a pull request:
1. The Jekyll site is automatically built
2. Build artifacts are available for download from the workflow run
3. A comment is added to the PR with instructions on how to test locally

## 🛠️ Local Development

To build and test the site locally:

```bash
# Install dependencies
bundle install

# Build the site
bundle exec jekyll build

# Serve the site locally (with auto-rebuild)
bundle exec jekyll serve

# Visit http://localhost:4000 in your browser
```

To generate the json file locally:

```python
python scripts/excel-to-json.py data/QA.xlsx data/tools.json
```


## 📝 Adding Content

- Blog posts go in `_posts/` directory with format: `YYYY-MM-DD-title.md`
- Pages go in the root directory as `.md` files
- Site configuration is in `_config.yml`
