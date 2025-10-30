# Implementation Tasks: Interactive Tools Filter Page

**Feature**: `002-tools-filter`  
**Branch**: `002-tools-filter`  
**Date**: 2025-10-31  
**Status**: Ready for Implementation

## Overview

This document provides a detailed task breakdown for implementing the interactive tools filter page. Tasks are organized by user story to enable independent, incremental development and testing.

**Total Estimated Tasks**: 44 tasks across 7 phases

**Implementation Strategy**: 
- **MVP Scope**: Phase 3 (User Story 1) + Phase 4 (User Story 2) = Browse and filter by category
- **Incremental Delivery**: Each user story phase delivers independently testable functionality
- **Parallel Opportunities**: Tasks marked with [P] can be executed in parallel

---

## Phase Summary

| Phase | Description | Task Count | Dependencies |
|-------|-------------|------------|--------------|
| Phase 1 | Setup | 5 tasks | None |
| Phase 2 | Foundational | 4 tasks | Phase 1 complete |
| Phase 3 | User Story 1 (Browse All Tools - P1) | 9 tasks | Phase 2 complete |
| Phase 4 | User Story 2 (Filter by Category - P1) | 7 tasks | Phase 3 complete |
| Phase 5 | User Story 3 & 4 (Type Filter & Search - P2) | 8 tasks | Phase 4 complete |
| Phase 6 | User Story 5 & 6 (Boolean Filters & Clear - P3) | 7 tasks | Phase 5 complete |
| Phase 7 | Polish & Cross-Cutting | 4 tasks | Phase 6 complete |

---

## Dependencies & Execution Order

### User Story Dependencies

```
Phase 1: Setup (blocking)
    ↓
Phase 2: Foundational (blocking)
    ↓
Phase 3: US1 - Browse All Tools (P1) ← MVP Foundation
    ↓
Phase 4: US2 - Filter by Category (P1) ← MVP Complete
    ↓
Phase 5: US3 & US4 - Type Filter & Search (P2)
    ↓
Phase 6: US5 & US6 - Boolean Filters & Clear (P3)
    ↓
Phase 7: Polish
```

**Independent Stories**: Each user story builds on previous ones, creating a natural progression from browsing to filtering to advanced features.

**Recommended MVP**: Phase 3 + Phase 4 (Browse + Category Filter) provides immediate value and validates core architecture.

---

## Phase 1: Setup

**Goal**: Initialize project infrastructure and dependencies

**Completion Criteria**: 
- npm and TypeScript configured
- Jekyll can serve qa-tools.html
- GitHub Actions can compile TypeScript

### Tasks

- [x] T001 Create package.json with TypeScript dependency and build scripts in repository root
- [x] T002 Create tsconfig.json with ES2015 target, ES6 modules, outDir assets/js/dist, rootDir assets/js/src
- [x] T003 Create directory structure: assets/js/src/ and assets/js/dist/
- [x] T004 Create qa-tools.html page in repository root with Jekyll frontmatter (layout: page, title: QA Tools)
- [x] T005 Update .github/workflows/build.yml to add Node.js setup, npm install, and TypeScript compilation steps before Jekyll build

**Parallel Execution**: Tasks T001, T002, T003, T004 can be done in parallel (different files). T005 depends on T001 (needs to know npm script names).

---

## Phase 2: Foundational

**Goal**: Create TypeScript type definitions and module structure that all user stories depend on

**Completion Criteria**:
- All TypeScript modules exist with exports
- Types match tools.json structure
- Code compiles without errors

### Tasks

- [x] T006 Create assets/js/src/types.ts with Tool interface (26 fields matching tools.json structure)
- [x] T007 [P] Add FilterState interface to assets/js/src/types.ts with category, type, boolean filters, and search query fields
- [x] T008 [P] Add FilterOptions interface to assets/js/src/types.ts with categories and types string arrays
- [x] T009 Create assets/js/src/main.ts entry point with DOMContentLoaded event listener skeleton

**Parallel Execution**: T007 and T008 can be done in parallel (same file, different interfaces).

**Note**: This phase establishes the shared type system and entry point that all subsequent phases depend on.

---

## Phase 3: User Story 1 - Browse All Tools (Priority: P1)

**Story Goal**: Enable users to view all 58 tools in an organized, readable format

**Why This First**: Foundation for all filtering - users must see tools before they can filter them.

**Independent Test Criteria**:
1. Load qa-tools.html → verify page displays without errors
2. Check browser console → verify no JavaScript errors
3. Inspect DOM → verify 58 tool cards are rendered
4. Check each card → verify displays tool name, description, and category
5. Test responsive → verify layout works on desktop, tablet, mobile

**Acceptance Scenarios**:
- ✅ User visits qa-tools.html → all 58 tools displayed in grid/list
- ✅ User scrolls page → can see all tool entries with readable formatting
- ✅ JSON loads → each tool shows name, description, category (Familly field)

### Tasks

- [x] T010 [US1] Add HTML structure to qa-tools.html: loading indicator div, tools container div with ID
- [x] T011 [US1] Add basic CSS to qa-tools.html or assets/css/style.css: CSS Grid layout for tool cards, card styling, loading indicator styles
- [x] T012 [P] [US1] Implement loadTools() function in assets/js/src/data-loader.ts: fetch /data/tools.json, parse JSON, return Promise<Tool[]>
- [x] T013 [P] [US1] Add error handling to data-loader.ts: catch fetch errors, catch JSON parse errors, throw with user-friendly messages
- [x] T014 [P] [US1] Implement showLoading() and hideLoading() functions in assets/js/src/ui-renderer.ts for loading indicator visibility
- [x] T015 [P] [US1] Implement renderTools(tools: Tool[]) function in assets/js/src/ui-renderer.ts: create tool cards with name, description, category badge, append to container
- [x] T016 [P] [US1] Implement showError(message: string) function in assets/js/src/ui-renderer.ts: display error message in tools container
- [x] T017 [US1] Update main.ts to call loadTools(), handle promise: show loading, call renderTools on success, call showError on failure, hide loading
- [x] T018 [US1] Compile TypeScript with npm run build and test in browser: verify all 58 tools display, verify no console errors, verify responsive layout

**Parallel Execution**: 
- T012, T013 (data-loader.ts) can be done together
- T014, T015, T016 (ui-renderer.ts) can be done in parallel (different functions)
- T010, T011 (HTML/CSS) can be done in parallel with TypeScript tasks

**After This Phase**: Users can browse all 58 tools - MVP foundation complete!

---

## Phase 4: User Story 2 - Filter by Category (Priority: P1)

**Story Goal**: Enable users to narrow down tools by category (e.g., "SAST/DAST", "DevOps", "Testing")

**Why This Second**: Primary use case - with 58 tools, users need immediate way to focus on relevant categories.

**Independent Test Criteria**:
1. Verify category dropdown is populated with unique categories from tools.json
2. Select "SAST/DAST" category → verify only SAST/DAST tools shown
3. Change to different category → verify tool list updates immediately
4. Select "All categories" → verify all 58 tools shown again
5. Check console → verify filter operation completes in <100ms

**Acceptance Scenarios**:
- ✅ Tools displayed → user selects "SAST/DAST" → only tools with Familly="SAST/DAST" shown
- ✅ Category filter active → user clears filter → all tools displayed
- ✅ Multiple categories exist → user changes selection → list updates immediately without reload

### Tasks

- [ ] T019 [US2] Add category filter dropdown to qa-tools.html: <select id="category-filter"> with "All categories" default option
- [ ] T020 [P] [US2] Implement extractFilterOptions(tools: Tool[]) function in assets/js/src/filter-logic.ts: extract unique categories and types, return FilterOptions
- [ ] T021 [P] [US2] Implement filterTools(tools: Tool[], state: FilterState) function in assets/js/src/filter-logic.ts: use Array.filter with AND logic for category match
- [ ] T022 [US2] Create assets/js/src/filter-controls.ts: define global filterState object, implement populateFilterDropdowns(options: FilterOptions) to populate category dropdown
- [ ] T023 [US2] Add category filter event listener in filter-controls.ts: attach change listener to category dropdown, update filterState.selectedCategory, trigger filter
- [ ] T024 [US2] Update main.ts to call extractFilterOptions() after loading tools, call populateFilterDropdowns(), initialize filter controls
- [ ] T025 [US2] Test category filtering: select each category, verify correct tools shown, verify "All categories" shows all 58 tools, verify <100ms response

**Parallel Execution**: T020 and T021 (filter-logic.ts) can be done in parallel (different functions).

**After This Phase**: MVP COMPLETE! Users can browse all tools and filter by category - immediately useful feature deployed.

---

## Phase 5: User Story 3 & 4 - Type Filter & Search (Priority: P2)

**Story Goal**: Enable users to refine search by tool type and search by tool name

**Why These Together**: Both are secondary refinement features that enhance the core category filtering.

**Independent Test Criteria**:
1. Verify type dropdown populated with unique types (Agent, Core, Plugin, UI)
2. Select "Agent" type → verify only Agent tools shown
3. Combine category + type filters → verify AND logic (both must match)
4. Type "GitHub" in search box → verify only tools with "GitHub" in name shown
5. Test case-insensitive search: "github" matches "GitHub"
6. Test partial match: "Git" matches "GitHub", "GitLab", etc.
7. Clear search box → verify all tools shown (respecting other filters)

**Acceptance Scenarios (US3)**:
- ✅ Tools displayed → user selects "Agent" type → only Type="Agent" tools shown
- ✅ Category and type filters active → tools matching both criteria displayed

**Acceptance Scenarios (US4)**:
- ✅ Search box available → user types "GitHub" → tools with "GitHub" in name shown
- ✅ User searching → types partial names "Git" → all tools containing "Git" displayed
- ✅ Search active → user clears search box → all tools shown (respecting other filters)

### Tasks

- [ ] T026 [US3] Add type filter dropdown to qa-tools.html: <select id="type-filter"> with "All types" default option
- [ ] T027 [US3] Update populateFilterDropdowns() in filter-controls.ts to also populate type dropdown with options.types
- [ ] T028 [US3] Update filterTools() in filter-logic.ts to add type filter condition: check state.selectedType matches tool.Type
- [ ] T029 [US3] Add type filter event listener in filter-controls.ts: attach change listener, update filterState.selectedType, trigger filter
- [ ] T030 [US4] Add search box to qa-tools.html: <input type="search" id="tool-search" placeholder="Search by tool name...">
- [ ] T031 [US4] Update filterTools() in filter-logic.ts to add search condition: case-insensitive partial match on tool.Tools field
- [ ] T032 [US4] Add search input event listener in filter-controls.ts with 250ms debounce: update filterState.searchQuery, trigger filter after debounce
- [ ] T033 [US3][US4] Test combined filters: category + type, category + search, type + search, all three together, verify AND logic works correctly

**Parallel Execution**: T026-T029 (type filter) can be done in parallel with T030-T032 (search box) until final integration testing (T033).

**After This Phase**: Users have powerful refinement tools - can browse, filter by category/type, and search by name.

---

## Phase 6: User Story 5 & 6 - Boolean Filters & Clear (Priority: P3)

**Story Goal**: Enable advanced filtering by boolean properties and provide easy reset functionality

**Why These Together**: Both are power-user features that complete the filtering experience.

**Independent Test Criteria**:
1. Verify boolean checkboxes render: Is Microsoft, Is Local, API, Available as quality gate
2. Check "Is Microsoft" → verify only Microsoft tools shown (where Is Microsoft=true)
3. Check multiple booleans → verify AND logic (all must be true)
4. Verify tools with null boolean values are excluded from boolean filter results
5. Apply multiple filters → click "Clear All Filters" button → verify all filters reset
6. After clear → verify all 58 tools displayed and all controls in default state

**Acceptance Scenarios (US5)**:
- ✅ Boolean filters available → user checks "Is Microsoft" → only Is Microsoft=true tools shown
- ✅ Multiple boolean filters checked → tools matching all selected criteria displayed

**Acceptance Scenarios (US6)**:
- ✅ Multiple filters active → user clicks "Clear All Filters" → all filters reset, all tools displayed
- ✅ Filters cleared → all filter controls return to default state

### Tasks

- [ ] T034 [US5] Add boolean filter checkboxes to qa-tools.html: 4 checkboxes with IDs (is-microsoft-filter, is-local-filter, api-filter, quality-gate-filter) and labels
- [ ] T035 [US5] Update filterTools() in filter-logic.ts to add boolean filter conditions: check each boolean filter, handle null values (exclude from results)
- [ ] T036 [US5] Add boolean filter event listeners in filter-controls.ts: attach change listeners to all 4 checkboxes, update filterState booleans, trigger filter
- [ ] T037 [US5] Test boolean filters: test each individually, test combinations, verify null values excluded, verify AND logic with category/type/search
- [ ] T038 [US6] Add "Clear All Filters" button to qa-tools.html: <button id="clear-filters">Clear All Filters</button>
- [ ] T039 [US6] Implement clearAllFilters() function in filter-controls.ts: reset filterState to initial values, reset all form controls to defaults, call renderTools with all tools
- [ ] T040 [US6] Add click event listener to Clear All Filters button in filter-controls.ts: call clearAllFilters()

**Parallel Execution**: T034-T037 (boolean filters) and T038-T040 (clear button) can be done in parallel.

**After This Phase**: Complete filtering feature set! All 6 user stories implemented and independently testable.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Goal**: Enhance UX, performance, accessibility, and documentation

**Completion Criteria**:
- "No results" message displays when filters match zero tools
- Result count displays current number of visible tools
- Page accessible via site navigation
- All browser compatibility tested
- Documentation updated

### Tasks

- [ ] T041 Add "No results" handling in ui-renderer.ts: check if filtered tools array is empty, display "No tools found" message with Clear Filters button suggestion
- [ ] T042 Add result count display to qa-tools.html and update in renderTools(): show "Showing X of 58 tools" text updated on each filter
- [ ] T043 Update _config.yml header_pages to add qa-tools.html to site navigation menu
- [ ] T044 Cross-browser testing: test in Chrome, Firefox, Safari, Edge, verify all features work, verify responsive design, verify no console errors, document any issues

**Parallel Execution**: T041, T042, T043 can be done in parallel. T044 is final validation.

**After This Phase**: Feature fully polished and production-ready!

---

## Parallel Execution Examples

### Within Phase 3 (US1)
```
Parallel Group 1: HTML/CSS Structure
- T010: Add HTML structure
- T011: Add CSS styling

Parallel Group 2: TypeScript Modules
- T012 + T013: data-loader.ts (fetch + error handling)
- T014 + T015 + T016: ui-renderer.ts (all rendering functions)

Sequential: T017 (main.ts integration), T018 (testing)
```

### Within Phase 4 (US2)
```
Sequential: T019 (HTML dropdown)
Parallel Group: TypeScript Logic
- T020: extractFilterOptions()
- T021: filterTools()

Sequential: T022, T023, T024, T025 (integration and testing)
```

### Within Phase 5 (US3 & US4)
```
Parallel Group 1: Type Filter
- T026: HTML type dropdown
- T027: Populate dropdown
- T028: Filter logic
- T029: Event listener

Parallel Group 2: Search Box
- T030: HTML search input
- T031: Search filter logic
- T032: Search event listener

Sequential: T033 (combined testing)
```

### Within Phase 6 (US5 & US6)
```
Parallel Group 1: Boolean Filters
- T034: HTML checkboxes
- T035: Boolean filter logic
- T036: Event listeners
- T037: Testing

Parallel Group 2: Clear Button
- T038: HTML button
- T039: Clear function
- T040: Event listener
```

---

## Testing Strategy

### Manual Testing Per Phase

Each phase includes testing tasks that validate the independent test criteria. Test scenarios follow the acceptance criteria from spec.md.

**No Automated Tests**: Per research.md decision, manual browser testing is sufficient for this scope. Automated UI tests (Playwright, Cypress) would add unnecessary complexity.

**Test Browsers**: Chrome, Firefox, Safari, Edge (latest versions)

**Test Viewports**: Desktop (1920px), Tablet (768px), Mobile (375px)

### Validation Checklist (Use for Each Phase)

- [ ] Load page without JavaScript errors
- [ ] Verify feature works as described in acceptance scenarios
- [ ] Test edge cases (null values, no results, special characters)
- [ ] Verify responsive layout works
- [ ] Check browser console for errors or warnings
- [ ] Verify performance (<100ms filter response)

---

## Success Metrics Validation

Track these metrics from spec.md during implementation and testing:

- **SC-001**: Page load time <2s (measure with browser DevTools Network tab)
- **SC-002**: Filter response <100ms (measure with browser DevTools Performance tab or console.time)
- **SC-003**: Search time <10s (user can find tool in under 10 seconds)
- **SC-004**: Responsive with 58 tools (test in different viewports)
- **SC-005**: 90% user success (validate post-launch with user feedback)
- **SC-006**: Zero page reloads (verify client-side filtering only)
- **SC-007**: Desktop browser support (test in Chrome, Firefox, Safari, Edge)
- **SC-008**: Accurate filtering (test filter combinations, verify zero incorrect matches)

---

## File Structure Reference

```
publish/                                    # Repository root
├── qa-tools.html                           # T004: Main filter page
├── package.json                            # T001: npm dependencies
├── tsconfig.json                           # T002: TypeScript config
├── _config.yml                             # T043: Update navigation
├── assets/
│   ├── css/
│   │   └── style.css                       # T011: Custom styles
│   └── js/
│       ├── src/                            # T003: TypeScript source
│       │   ├── types.ts                    # T006-T008: Type definitions
│       │   ├── data-loader.ts              # T012-T013: JSON loading
│       │   ├── filter-logic.ts             # T020-T021, T028, T031, T035: Filter algorithm
│       │   ├── ui-renderer.ts              # T014-T016, T041: DOM manipulation
│       │   ├── filter-controls.ts          # T022-T023, T027, T029, T032, T036, T039-T040: Event handlers
│       │   └── main.ts                     # T009, T017, T024: Entry point
│       └── dist/                           # T003: Compiled JavaScript
│           └── main.js                     # Generated by tsc
├── data/
│   └── tools.json                          # Existing: Generated by Feature 001
└── .github/
    └── workflows/
        └── build.yml                       # T005: Update with TypeScript compilation
```

---

## Risk Mitigation

| Task | Risk | Mitigation |
|------|------|------------|
| T005 | GitHub Actions build fails | Test CI build in PR before merging, ensure Node.js version matches local |
| T012 | JSON structure mismatch | Validate against actual tools.json, use TypeScript strict mode to catch type errors |
| T021 | Filter logic bugs (incorrect results) | Comprehensive testing with all filter combinations, edge cases |
| T031 | Search performance degrades | Use debounce (250ms) to avoid filtering on every keystroke |
| T035 | Null value handling incorrect | Explicitly test tools with null boolean fields, document expected behavior |

---

## Definition of Done (Per Phase)

A phase is considered complete when:

1. ✅ All tasks in the phase are checked off
2. ✅ Code compiles without TypeScript errors
3. ✅ Independent test criteria for the user story are validated
4. ✅ All acceptance scenarios pass manual testing
5. ✅ No console errors in browser DevTools
6. ✅ Responsive layout verified (if UI changes)
7. ✅ Code committed to feature branch with descriptive message

---

## Next Steps

1. **Begin Implementation**: Start with Phase 1 (Setup) tasks T001-T005
2. **Validate MVP**: After Phase 4 complete, consider deploying MVP (Browse + Category Filter)
3. **Iterate**: Complete remaining phases incrementally, validating each phase before proceeding
4. **Final Validation**: After Phase 7, perform comprehensive cross-browser testing (T044)
5. **Deploy**: Merge feature branch to main, verify automated deployment succeeds

**Estimated Timeline**: 
- MVP (Phase 1-4): 2-3 days
- Full Feature (Phase 1-7): 4-5 days
- Per phase: ~0.5-1 day depending on complexity

---

## Notes

- **No Tests Generated**: Per spec.md and research.md, this feature uses manual browser testing rather than automated test frameworks.
- **TypeScript Compilation**: Remember to run `npm run build` after TypeScript changes (or use `npm run watch` during development).
- **Jekyll Server**: Keep `bundle exec jekyll serve` running during development to see live changes (may need refresh after TypeScript recompilation).
- **Data Dependency**: This feature depends on `data/tools.json` generated by Feature 001 (excel-json-api). Ensure that feature is deployed first.

**Ready to Implement!** Follow the phases sequentially, validate each phase before proceeding to the next. The task breakdown is granular enough for immediate execution.
