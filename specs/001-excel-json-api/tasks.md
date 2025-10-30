# Tasks: Excel to JSON Conversion via GitHub Actions

**Input**: Design documents from `/specs/001-excel-json-api/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not requested in specification - implementation-focused tasks only

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This is a CI/CD automation project integrated into an existing Jekyll site:

- **Workflows**: `.github/workflows/`
- **Scripts**: `scripts/`
- **Data**: `data/`
- **Documentation**: `specs/001-excel-json-api/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and Python environment setup

- [x] T001 Create scripts directory at `scripts/` if it doesn't exist
- [x] T002 Create data directory at `data/` if it doesn't exist
- [x] T003 Verify `/data/QA.xlsx` file exists with worksheet "Tools" and table "Tools"

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core Python script infrastructure that MUST be complete before workflow implementation

**⚠️ CRITICAL**: No workflow can function without the Python conversion script

- [x] T004 Create Python script skeleton at `scripts/excel-to-json.py` with imports (openpyxl, json, sys, logging)
- [x] T005 Implement logging configuration in `scripts/excel-to-json.py` for error reporting
- [x] T006 Implement command-line argument parsing in `scripts/excel-to-json.py` for file paths (optional: use defaults)

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Static JSON Generation from Excel (Priority: P1) 🎯 MVP

**Goal**: Automatically generate `/data/tools.json` from `/data/QA.xlsx` whenever Excel file changes, enabling content management through Excel while serving static JSON to website visitors

**Independent Test**: Update `/data/QA.xlsx`, commit and push, verify GitHub Actions workflow generates correct `/data/tools.json` that gets committed to repository

### Implementation for User Story 1

- [x] T007 [P] [US1] Implement Excel file loading with error handling in `scripts/excel-to-json.py` (validate file exists)
- [x] T008 [P] [US1] Implement worksheet validation in `scripts/excel-to-json.py` (verify "Tools" worksheet exists)
- [x] T009 [US1] Implement table extraction logic in `scripts/excel-to-json.py` (access "Tools" table, handle missing table error)
- [x] T010 [US1] Implement header row parsing in `scripts/excel-to-json.py` (extract column names as JSON keys, preserve spaces/special chars)
- [x] T011 [US1] Implement data row iteration in `scripts/excel-to-json.py` (skip header row, process all data rows)
- [x] T012 [US1] Implement cell value extraction in `scripts/excel-to-json.py` (extract calculated values with data_only=True)
- [x] T013 [US1] Implement data type conversion in `scripts/excel-to-json.py` (dates to ISO 8601, empty cells to null, preserve strings/numbers/booleans)
- [x] T014 [US1] Implement JSON object construction in `scripts/excel-to-json.py` (create dict per row with headers as keys)
- [x] T015 [US1] Implement JSON file writing in `scripts/excel-to-json.py` (write flat array to `/data/tools.json` with UTF-8 encoding, indent=2, ensure_ascii=False)
- [x] T016 [US1] Add comprehensive error handling in `scripts/excel-to-json.py` (file not found, worksheet missing, table missing, corrupted file)
- [x] T017 [US1] Create GitHub Actions workflow file at `.github/workflows/excel-to-json.yml` with basic structure (name, triggers)
- [x] T018 [US1] Configure workflow triggers in `.github/workflows/excel-to-json.yml` (push to main with path filter for `data/QA.xlsx`, workflow_dispatch)
- [x] T019 [US1] Add checkout step to workflow in `.github/workflows/excel-to-json.yml` (actions/checkout@v4)
- [x] T020 [US1] Add Python setup step to workflow in `.github/workflows/excel-to-json.yml` (actions/setup-python@v5 with python-version: 3.11)
- [x] T021 [US1] Add openpyxl installation step to workflow in `.github/workflows/excel-to-json.yml` (pip install openpyxl)
- [x] T022 [US1] Add JSON generation step to workflow in `.github/workflows/excel-to-json.yml` (run python scripts/excel-to-json.py with continue-on-error: true, id: generate)
- [x] T023 [US1] Add JSON validation step to workflow in `.github/workflows/excel-to-json.yml` (python -m json.tool data/tools.json, conditional on generate success)
- [x] T024 [US1] Add git configuration steps to workflow in `.github/workflows/excel-to-json.yml` (set user.name and user.email for github-actions bot)
- [x] T025 [US1] Add git commit step to workflow in `.github/workflows/excel-to-json.yml` (commit data/tools.json with message "chore: auto-update tools.json from Excel [skip ci]", conditional on generate success)
- [x] T026 [US1] Add git push step to workflow in `.github/workflows/excel-to-json.yml` (push changes, conditional on commit success)
- [x] T027 [US1] Test workflow locally by running `python scripts/excel-to-json.py` and verifying `/data/tools.json` output
- [ ] T028 [US1] Commit workflow and script files, push to trigger first automated workflow run
- [ ] T029 [US1] Verify workflow execution in GitHub Actions logs and check generated `/data/tools.json` commit

**Checkpoint**: At this point, User Story 1 should be fully functional - Excel changes automatically generate JSON

---

## Phase 4: User Story 2 - Access JSON Data on Website (Priority: P1)

**Goal**: Enable website visitors to fetch and display tool data from static JSON file served by GitHub Pages

**Independent Test**: Load website, open browser console, fetch `/data/tools.json`, verify data displays correctly

### Implementation for User Story 2

- [x] T030 [P] [US2] Verify GitHub Pages is configured to serve `/data/tools.json` as static file (check repository settings)
- [x] T031 [P] [US2] Add appropriate cache headers documentation to `specs/001-excel-json-api/quickstart.md` (GitHub Pages default headers)
- [x] T032 [US2] Create sample HTML page or update existing page to demonstrate JSON fetching (optional: `_posts/2024-XX-XX-tools-data-example.md` with JavaScript)
- [x] T033 [US2] Add JavaScript fetch example to documentation in `specs/001-excel-json-api/quickstart.md` (demonstrate client-side consumption)
- [x] T034 [US2] Test JSON file accessibility from GitHub Pages URL (verify CORS, Content-Type, response time)
- [x] T035 [US2] Document browser caching behavior in `specs/001-excel-json-api/data-model.md` (ETag, cache invalidation on updates)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - Excel generates JSON, website serves JSON

---

## Phase 5: User Story 3 - Workflow Error Handling (Priority: P2)

**Goal**: Ensure corrupted Excel files fail gracefully without breaking website deployment - preserve existing JSON and allow site to continue functioning

**Independent Test**: Commit corrupted Excel file, verify workflow fails but preserves existing `/data/tools.json` and site deployment proceeds

### Implementation for User Story 3

- [x] T036 [P] [US3] Add specific error messages for missing worksheet in `scripts/excel-to-json.py` (log clear message: "Worksheet 'Tools' not found")
- [x] T037 [P] [US3] Add specific error messages for missing table in `scripts/excel-to-json.py` (log clear message: "Table 'Tools' not found in worksheet")
- [x] T038 [P] [US3] Add specific error messages for corrupted file in `scripts/excel-to-json.py` (log clear message: "Excel file is corrupted or unreadable")
- [x] T039 [US3] Implement exit code strategy in `scripts/excel-to-json.py` (sys.exit(1) on error, sys.exit(0) on success)
- [x] T040 [US3] Add workflow step to check if JSON exists in `.github/workflows/excel-to-json.yml` (conditional preservation logic)
- [x] T041 [US3] Document failure scenarios in `specs/001-excel-json-api/quickstart.md` (what happens when workflow fails, how to debug)
- [x] T042 [US3] Add workflow status badge to README.md (optional: display workflow health)
- [x] T043 [US3] Test error handling by creating test Excel file with missing worksheet (verify workflow logs clear error, preserves existing JSON)
- [x] T044 [US3] Test error handling by creating corrupted Excel file (verify workflow logs error, site deployment continues)
- [x] T045 [US3] Document recovery procedures in `specs/001-excel-json-api/quickstart.md` (how to restore from Git, check logs, debug)

**Checkpoint**: All user stories should now be independently functional with robust error handling

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and enhance overall quality

- [x] T046 [P] Add comprehensive code comments to `scripts/excel-to-json.py` (explain each section's purpose)
- [x] T047 [P] Add docstrings to functions in `scripts/excel-to-json.py` (Google style docstrings with args, returns, raises)
- [x] T048 [P] Update README.md with feature overview and link to `specs/001-excel-json-api/quickstart.md`
- [x] T049 [P] Add example Excel file structure documentation to `specs/001-excel-json-api/data-model.md` (show expected table format)
- [x] T050 Add performance metrics logging to `scripts/excel-to-json.py` (log row count, execution time)
- [x] T051 Add JSON file size validation to workflow in `.github/workflows/excel-to-json.yml` (warn if >1MB)
- [x] T052 Add workflow execution time reporting in `.github/workflows/excel-to-json.yml` (verify <30s requirement)
- [x] T053 Run through complete quickstart.md validation (follow all setup steps, verify all examples work)
- [x] T054 Add edge case handling for empty table in `scripts/excel-to-json.py` (generate empty array [], not error)
- [x] T055 Document special character handling in `specs/001-excel-json-api/data-model.md` (Unicode, newlines, quotes)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User Story 1 (P1): Can start after Foundational - Core functionality
  - User Story 2 (P1): Can start after US1 completes (needs generated JSON) - Co-priority with US1
  - User Story 3 (P2): Can start after US1 completes (needs working workflow to test error handling)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories - **REQUIRED FOR MVP**
- **User Story 2 (P1)**: Depends on User Story 1 completion (needs generated JSON file to serve) - **REQUIRED FOR MVP**
- **User Story 3 (P2)**: Depends on User Story 1 completion (needs working workflow to test failure scenarios) - Post-MVP enhancement

### Within Each User Story

- **User Story 1**: Python script foundation (T007-T016) → Workflow configuration (T017-T026) → Testing (T027-T029)
- **User Story 2**: Infrastructure verification (T030-T031) → Documentation/examples (T032-T033) → Testing (T034-T035)
- **User Story 3**: Error handling enhancements (T036-T039) → Documentation (T040-T042) → Testing (T043-T045)

### Parallel Opportunities

- **Phase 1 Setup**: All 3 tasks can run in parallel (T001-T003)
- **Phase 2 Foundational**: T004-T006 are sequential (build on each other)
- **User Story 1**:
  - T007-T008 can run in parallel (independent validations)
  - T010-T015 must be sequential (data pipeline)
  - T019-T021 can run in parallel (independent workflow steps)
- **User Story 2**: T030-T031 and T032-T033 can run in parallel
- **User Story 3**: T036-T038 can run in parallel (independent error messages)
- **Polish Phase**: T046-T049 can all run in parallel (different files)

---

## Parallel Example: User Story 1 Core Implementation

```bash
# Launch parallel tasks for Excel validation:
Task T007: "Implement Excel file loading with error handling in scripts/excel-to-json.py"
Task T008: "Implement worksheet validation in scripts/excel-to-json.py"

# Then sequential data processing (T009-T015)

# Launch parallel workflow configuration tasks:
Task T019: "Add checkout step to workflow"
Task T020: "Add Python setup step to workflow"
Task T021: "Add openpyxl installation step to workflow"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 Only)

**Recommended approach for fastest time-to-value:**

1. Complete Phase 1: Setup (T001-T003) - ~10 minutes
2. Complete Phase 2: Foundational (T004-T006) - ~20 minutes
3. Complete Phase 3: User Story 1 (T007-T029) - ~3-4 hours
   - Python script implementation: ~2 hours
   - Workflow configuration: ~1 hour
   - Testing: ~30 minutes
4. Complete Phase 4: User Story 2 (T030-T035) - ~1 hour
5. **STOP and VALIDATE**: Test complete Excel-to-JSON-to-Website flow
6. Deploy to production if ready

**MVP Deliverable**: Content managers can update Excel, automation generates JSON, website serves data to visitors.

### Incremental Delivery

1. **Foundation** (Phase 1 + 2) → Basic structure ready
2. **MVP** (US1 + US2) → Complete Excel-to-JSON-to-Website automation → **Deploy** 🚀
3. **Robust** (US3) → Add error handling and resilience → **Deploy** 🚀
4. **Polished** (Phase 6) → Documentation and code quality improvements → **Deploy** 🚀

Each phase adds value without breaking previous functionality.

### Full Feature (All User Stories)

If error handling is critical from the start:

1. Complete Setup + Foundational → Foundation ready (~30 minutes)
2. Add User Story 1 → Core functionality (~3-4 hours)
3. Add User Story 2 → Website integration (~1 hour)
4. Add User Story 3 → Error handling (~2 hours)
5. Add Polish → Code quality (~1-2 hours)

**Total estimated time**: 7-9 hours for complete feature with all enhancements.

### Parallel Team Strategy

With 2 developers:

1. Both complete Setup + Foundational together (~30 minutes)
2. Once Foundational is done:
   - **Developer A**: User Story 1 (Python script + workflow) - Critical path
   - **Developer B**: Prepare User Story 2 documentation and examples
3. After US1 completes:
   - **Developer A**: User Story 3 (error handling)
   - **Developer B**: User Story 2 (website integration and testing)
4. Both work on Polish phase together

**Time savings**: ~20% reduction through parallel work on US2/US3.

---

## Notes

- **[P] tasks**: Different files, no dependencies - safe for parallel execution
- **[Story] label**: Maps task to specific user story for traceability and independent testing
- **MVP scope**: User Stories 1 + 2 deliver complete end-to-end value (Excel → JSON → Website)
- **Post-MVP**: User Story 3 adds robustness (error handling), Phase 6 adds polish
- **Estimated effort**: ~4-5 hours for MVP, ~7-9 hours for full feature
- **Testing approach**: Manual testing via quickstart.md validation (no automated test suite requested)
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently before proceeding
- The `[skip ci]` flag in commit messages prevents infinite workflow loops
