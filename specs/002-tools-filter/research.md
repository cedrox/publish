# Phase 0: Research & Technology Decisions

**Feature**: Interactive Tools Filter Page  
**Branch**: `002-tools-filter`  
**Date**: 2025-10-31

## Purpose

This document captures research findings and technology decisions needed to resolve all "NEEDS CLARIFICATION" items from the Technical Context section of the implementation plan.

## Research Tasks

### 1. Client-Side Filtering Technology Selection

**Decision**: Use vanilla TypeScript compiled to ES2015+ JavaScript

**Rationale**:

- No framework overhead needed for this simple filtering task
- TypeScript provides type safety for working with JSON data structure
- Compiles to clean JavaScript that runs in all modern browsers
- Fits naturally with Jekyll's static site generation approach
- Zero additional dependencies to maintain

**Alternatives Considered**:

- **React/Vue/Svelte**: Rejected due to unnecessary complexity, build overhead, and learning curve for a simple filtering UI
- **Plain JavaScript**: Rejected because TypeScript's type checking prevents errors when working with the 26-field Tool data structure
- **jQuery**: Rejected as outdated; vanilla DOM manipulation is sufficient and more performant

**Implementation Approach**:

- Write TypeScript modules in `assets/js/src/` directory
- Use TypeScript compiler (tsc) to compile to `assets/js/dist/`
- Include compiled JavaScript in qa-tools.html page
- Use ES6 modules for clean code organization

---

### 2. Build Pipeline for TypeScript Compilation

**Decision**: Use npm scripts with TypeScript compiler (tsc) in watch mode for development

**Rationale**:

- TypeScript compiler is standard tool, no additional tooling needed
- npm scripts provide simple, documented build commands
- Watch mode enables rapid development feedback
- Can integrate into GitHub Actions for automated builds

**Alternatives Considered**:

- **Webpack/Rollup**: Rejected as overkill for this simple use case; adds complexity without value
- **Compile manually**: Rejected because manual compilation is error-prone and slows development

**Implementation Approach**:

- Add `package.json` with TypeScript dependency and build scripts
- Create `tsconfig.json` with target ES2015, module ES6, outDir `assets/js/dist`
- Add npm scripts: `build` (compile once), `watch` (compile on changes)
- Add GitHub Actions workflow step to compile TypeScript during site build
- Exclude TypeScript source files from Jekyll processing

---

### 3. Data Loading Strategy

**Decision**: Fetch JSON via native `fetch()` API on page load

**Rationale**:

- Native browser API, no dependencies
- Asynchronous loading with loading indicator provides good UX
- Data is small (58 tools, ~62KB), so no pagination needed
- Enables error handling if JSON file is missing or malformed

**Alternatives Considered**:

- **Inline JSON in HTML**: Rejected because it increases page size and prevents caching of data separately
- **Jekyll data files**: Rejected because we need client-side filtering; Jekyll would generate static filtered pages

**Implementation Approach**:

- Use `fetch('/data/tools.json')` in main TypeScript module
- Show loading spinner while fetching
- Parse response and validate structure
- Handle errors gracefully with user-friendly messages

---

### 4. Filter UI Component Design

**Decision**: Use HTML5 form controls with progressive enhancement

**Rationale**:

- Native select/checkbox/input elements are accessible by default
- Progressive enhancement ensures basic functionality without JavaScript
- Familiar UI patterns for users (dropdowns, checkboxes, search box)
- Easy to style with CSS to match site theme

**Alternatives Considered**:

- **Custom dropdown components**: Rejected due to accessibility complexity and unnecessary effort
- **Multi-select with tags**: Rejected because single-select is simpler and meets requirements

**Implementation Approach**:

- Category filter: `<select>` dropdown with options from unique Familly values
- Type filter: `<select>` dropdown with options from unique Type values
- Boolean filters: `<input type="checkbox">` for Is Microsoft, Is Local, API, Available as quality gate
- Search box: `<input type="search">` with placeholder text
- Clear All button: `<button>` that resets all form controls

---

### 5. Tool Display Layout

**Decision**: Use CSS Grid for responsive card layout

**Rationale**:

- CSS Grid provides flexible, responsive layout with minimal code
- Cards pattern is familiar and scannable for users
- Easy to make responsive with grid-auto-fit
- Maintains visual consistency with site design

**Alternatives Considered**:

- **Table layout**: Rejected because tables are less responsive and harder to make visually appealing
- **List layout**: Rejected because cards provide better visual hierarchy and scannability

**Implementation Approach**:

- Display tools as cards in CSS Grid container
- Each card shows: Tool name (h3), Description (p), Category badge, Type badge
- Grid uses `auto-fit` with `minmax(300px, 1fr)` for responsive layout
- Cards have hover effects for interactivity

---

### 6. Filter Logic Implementation

**Decision**: Use Array.filter() with AND logic for multiple filters

**Rationale**:

- Array.filter() is performant for 58-item dataset
- AND logic is intuitive: tool must match all active filters
- Functional approach is testable and maintainable
- No need for complex state management

**Alternatives Considered**:

- **OR logic for filters**: Rejected because AND logic provides more focused results
- **Indexed search**: Rejected as unnecessary for 58 tools; linear scan is instant

**Implementation Approach**:

- Maintain filter state object with current selections
- On filter change, call `applyFilters()` function
- Filter function chains conditions: category AND type AND booleans AND search
- Re-render filtered results to DOM

---

### 7. Testing Strategy

**Decision**: Manual testing with browser DevTools, no automated UI tests

**Rationale**:

- Feature is simple enough for comprehensive manual testing
- Adding test framework (Playwright, Cypress) is overkill for this scope
- Focus testing effort on filter logic correctness and edge cases
- Browser DevTools provide sufficient debugging

**Alternatives Considered**:

- **Jest unit tests**: Considered adding for filter logic, but decided manual testing is sufficient for v1
- **E2E tests with Playwright**: Rejected as too heavyweight for simple filtering page

**Testing Approach**:

- Manual test scenarios from spec acceptance criteria
- Test filter combinations (category + type, category + boolean, etc.)
- Test edge cases: no results, null values, special characters in search
- Cross-browser testing: Chrome, Firefox, Safari, Edge
- Responsive testing: mobile, tablet, desktop viewports

---

### 8. Performance Optimization

**Decision**: No special optimization needed beyond baseline best practices

**Rationale**:

- Dataset is small (58 tools), so performance is inherently fast
- Filtering 58 items with Array.filter() takes <1ms
- Rendering 58 cards takes <50ms
- Success criteria (100ms filter response) easily achieved without optimization

**Best Practices to Follow**:

- Minimize DOM manipulation: use DocumentFragment for batch rendering
- Debounce search input to avoid filtering on every keystroke (250ms delay)
- Use CSS for visual transitions (not JavaScript animations)
- Lazy-load tool logos only when visible (native lazy loading)

---

### 9. Jekyll Integration

**Decision**: Create qa-tools.html as Jekyll page with 'page' layout

**Rationale**:

- Consistent with existing site structure (about.md, index.md use Jekyll layouts)
- Inherits site header, footer, and styling automatically
- Can be added to site navigation easily
- Jekyll processes .html files just like .md files

**Implementation Approach**:

- Create `qa-tools.html` in repository root (same level as about.md)
- Add YAML frontmatter with layout: page, title: "QA Tools"
- Include filter UI HTML in page content
- Load compiled JavaScript via script tag
- Add page to \_config.yml header_pages for navigation

---

### 10. Deployment Considerations

**Decision**: Standard Jekyll build via GitHub Actions, no special steps needed

**Rationale**:

- TypeScript compilation can be added as pre-build step
- Compiled JavaScript is committed to repo (dist files are artifacts)
- No server-side runtime needed, purely static assets
- Aligns with existing GitHub Pages deployment workflow

**Implementation Approach**:

- Update existing GitHub Actions workflow to run `npm run build` before Jekyll build
- Ensure node.js is available in CI environment
- Commit compiled JavaScript to repo (ensures reproducible builds)
- No changes needed to GitHub Pages deployment step

---

## Summary of Decisions

| Aspect               | Technology                        | Justification                                              |
| -------------------- | --------------------------------- | ---------------------------------------------------------- |
| Programming Language | TypeScript → JavaScript (ES2015+) | Type safety, modern browser support, no framework overhead |
| Build Tool           | npm + tsc (TypeScript compiler)   | Simple, standard, integrates with CI                       |
| Data Loading         | Native fetch() API                | No dependencies, handles errors, enables loading UI        |
| UI Components        | Native HTML5 form controls        | Accessible, familiar, easy to style                        |
| Layout               | CSS Grid cards                    | Responsive, scannable, visually appealing                  |
| Filter Logic         | Array.filter() with AND logic     | Performant for dataset, intuitive behavior                 |
| Testing              | Manual testing in browsers        | Sufficient for scope, avoids test framework overhead       |
| Performance          | Baseline best practices only      | Dataset size makes optimization unnecessary                |
| Jekyll Integration   | Standard page with 'page' layout  | Consistent with site, inherits styling                     |
| Deployment           | Standard Jekyll + npm pre-build   | No special infrastructure needed                           |

## Technical Context Summary

All NEEDS CLARIFICATION items have been resolved:

- **Language/Version**: TypeScript 5.x → JavaScript ES2015+
- **Primary Dependencies**: TypeScript compiler (tsc), no runtime dependencies
- **Storage**: Static JSON file (data/tools.json)
- **Testing**: Manual browser testing (Chrome, Firefox, Safari, Edge)
- **Target Platform**: Modern desktop browsers (ES2015+ support)
- **Project Type**: Jekyll static site with client-side JavaScript
- **Performance Goals**: <100ms filter response, <2s page load
- **Constraints**: Client-side only, no backend, works with JavaScript disabled (shows all tools)
- **Scale/Scope**: 58 tools, 26 fields per tool, single page feature

## Next Steps

Proceed to Phase 1: Generate data-model.md, contracts/, and quickstart.md based on these research findings.
