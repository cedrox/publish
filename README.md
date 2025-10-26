# publish
Website about Elevating Software Quality with AI and Modern Tools

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

## 📝 Adding Content

- Blog posts go in `_posts/` directory with format: `YYYY-MM-DD-title.md`
- Pages go in the root directory as `.md` files
- Site configuration is in `_config.yml`
