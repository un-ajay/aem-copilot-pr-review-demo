# Copilot Coding Agent Instructions

## Repository Overview

This is an **AEM (Adobe Experience Manager) demonstration project** with multiple modules combining Java backend components and JavaScript/React frontends. The project is a small-scale demo (~365 lines of code) designed to showcase PR review workflows.

**Project Type**: Multi-module Maven project with Node.js frontend modules  
**Primary Languages**: Java, JavaScript, React  
**Build Tools**: Maven 3.9.12, Node.js v20.19.6, npm 10.8.2  
**Frontend Framework**: Vite 7.x (for both vanilla JS and React modules)

### Repository Structure

```
.
├── pom.xml                    # Root Maven POM (parent project)
├── core/                      # Java module (currently empty)
│   └── pom.xml
├── ui.apps/                   # AEM UI applications module (currently empty)
│   └── pom.xml
├── ui.frontend/               # Vanilla JavaScript + Vite frontend
│   ├── package.json
│   ├── src/
│   │   ├── main.js
│   │   ├── components/booking-confirmation-page/
│   │   └── style.css
│   └── vite.config.js         # (not present, uses default)
└── ui.frontend.react/         # React + Vite frontend
    ├── package.json
    ├── eslint.config.js
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── components/
        │   ├── Dashboard.jsx
        │   ├── UserCard.jsx
        │   └── UserList.jsx
        ├── context/UserPreferencesContext.jsx
        ├── hooks/
        └── utils/api.js
```

## Build & Validation Instructions

### Environment Requirements

- **Java**: OpenJDK 17+ (project specifies Java 11 in pom.xml, but Java 17 works)
- **Maven**: 3.9.12 (or compatible version)
- **Node.js**: v20.19.6 (or compatible v20.x)
- **npm**: 10.8.2 (or compatible v10.x)

### Build Order & Commands

**IMPORTANT**: Always follow this exact order when building from scratch:

#### 1. Maven Build (Java Modules)

```bash
# From repository root
mvn clean install
```

**Expected Output**: BUILD SUCCESS in ~10 seconds  
**What it does**: Compiles core and ui.apps Java modules (currently both empty but build successfully)  
**Note**: You may see warnings "JAR will be empty - no content was marked for inclusion!" - this is expected for empty modules.

#### 2. ui.frontend Build (Vanilla JavaScript)

```bash
cd ui.frontend

# Install dependencies (required before first build)
npm install

# Build for production
npm run build

# Development server (optional)
npm run dev

# Clean build artifacts
npm run clean
```

**Expected Build Time**: ~260ms  
**Output Location**: `ui.frontend/dist/`  
**Known Issue**: Running `npm run lint` will FAIL with "ESLint couldn't find a configuration file" - this is expected as the project lacks an ESLint config file. Skip linting for ui.frontend.

#### 3. ui.frontend.react Build (React)

```bash
cd ui.frontend.react

# Install dependencies (required before first build)
npm install

# Build for production
npm run build

# Development server (optional)
npm run dev
```

**Expected Build Time**: ~965ms  
**Output Location**: `ui.frontend.react/dist/`

#### 4. Linting

**ui.frontend.react ONLY**:
```bash
cd ui.frontend.react
npm run lint
```

**CRITICAL**: The lint command currently shows 3 ERRORS in `src/components/Dashboard.jsx`:
- Line 56: "Cannot access ref value during render" (2 errors)
- Line 132: "Cannot access ref value during render"

These are **existing known issues** related to React ref usage. DO NOT attempt to fix them unless specifically asked. They involve `renderCount.current` being accessed/modified during render instead of in useEffect.

**DO NOT run lint on ui.frontend** - it lacks ESLint configuration and will fail.

### Testing

- **No test framework is currently configured** for the frontend modules
- The file `ui.frontend/src/components/booking-confirmation-page/booking-confirmation-page.test.js` exists but is empty
- Maven test phase runs successfully but reports "No tests to run"

### Validation Checklist

Before finalizing changes:
1. ✅ Run `mvn clean install` from root - must succeed
2. ✅ Run `npm install && npm run build` in `ui.frontend/` - must succeed
3. ✅ Run `npm install && npm run build` in `ui.frontend.react/` - must succeed
4. ⚠️ Run `npm run lint` in `ui.frontend.react/` - expect 3 existing errors (acceptable)
5. ❌ DO NOT run `npm run lint` in `ui.frontend/` - will fail (no config)

## Project Architecture & Key Files

### Configuration Files

| File | Purpose | Location |
|------|---------|----------|
| `pom.xml` | Root Maven project definition | `/pom.xml` |
| `core/pom.xml` | Core Java module POM | `/core/pom.xml` |
| `ui.apps/pom.xml` | UI apps module POM | `/ui.apps/pom.xml` |
| `ui.frontend/package.json` | Frontend vanilla JS dependencies | `/ui.frontend/package.json` |
| `ui.frontend.react/package.json` | React frontend dependencies | `/ui.frontend.react/package.json` |
| `ui.frontend.react/eslint.config.js` | ESLint 9.x flat config | `/ui.frontend.react/eslint.config.js` |
| `ui.frontend.react/vite.config.js` | Vite build configuration | `/ui.frontend.react/vite.config.js` |
| `.gitignore` | Git ignore patterns | `/.gitignore` |

### Key Source Files

**React Frontend** (`ui.frontend.react/src/`):
- `main.jsx` - React app entry point
- `App.jsx` - Main React component (simple counter demo)
- `components/Dashboard.jsx` - Complex component with multiple hooks (HAS LINT ERRORS)
- `components/UserList.jsx` - User list display component
- `components/UserCard.jsx` - Individual user card component
- `context/UserPreferencesContext.jsx` - React context for user preferences
- `hooks/useLocalStorage.js` - Custom hook for localStorage
- `hooks/useDebounce.js` - Custom hook for debouncing
- `utils/api.js` - API utility for fetching users

**Vanilla JS Frontend** (`ui.frontend/src/`):
- `main.js` - Application entry point
- `components/booking-confirmation-page/` - Booking confirmation component

### Important Patterns & Conventions

1. **React Version**: React 19.2.0 (latest)
2. **ESLint**: Uses ESLint 9.x flat config format in `ui.frontend.react/eslint.config.js`
3. **Vite**: Both frontends use Vite 7.x for building
4. **Node Modules**: Always ignored via `.gitignore` - never commit `node_modules/`
5. **Build Artifacts**: `dist/`, `target/`, `build/` directories are ignored

### Build Artifact Locations

- Maven JARs: `core/target/` and `ui.apps/target/`
- Frontend bundles: `ui.frontend/dist/` and `ui.frontend.react/dist/`
- Always exclude these from commits (already in `.gitignore`)

## Known Issues & Workarounds

### Issue 1: ui.frontend ESLint Configuration Missing

**Problem**: `npm run lint` in `ui.frontend/` fails with "ESLint couldn't find a configuration file"  
**Impact**: Cannot run linting on vanilla JS frontend  
**Workaround**: Skip linting for `ui.frontend/`. Only lint `ui.frontend.react/`  
**Status**: Expected behavior, not a blocker

### Issue 2: Dashboard.jsx React Ref Errors

**Problem**: 3 ESLint errors in `ui.frontend.react/src/components/Dashboard.jsx` related to accessing `renderCount.current` during render (lines 56, 132)  
**Impact**: Lint command exits with code 1  
**Root Cause**: React 19 + react-hooks/refs rule - refs should only be accessed in effects or event handlers, not during render  
**Workaround**: These are pre-existing errors. Do not fix unless explicitly requested. Accept lint failures for this file.  
**Proper Fix** (if needed): Move `renderCount.current += 1` to a `useEffect` and use state for display

### Issue 3: Empty Java Modules

**Problem**: Maven warns "JAR will be empty - no content was marked for inclusion!" for core and ui.apps  
**Impact**: None - builds successfully  
**Status**: Expected for demo project

### Issue 4: Deprecated npm Warnings

**Problem**: Several deprecated package warnings during `npm install`:
- `inflight@1.0.6`
- `@humanwhocodes/object-schema@2.0.3`
- `@humanwhocodes/config-array@0.13.0`
- `rimraf@3.0.2`
- `glob@7.2.3`
- `eslint@8.57.1`

**Impact**: None currently, but should be addressed in future updates  
**Workaround**: Ignore for now

## CI/CD & GitHub Workflows

**Status**: No GitHub Actions workflows currently configured (`.github/workflows/` does not exist)

If implementing CI/CD, the build commands would be:
```yaml
# Example workflow steps
- run: mvn clean install
- run: cd ui.frontend && npm install && npm run build
- run: cd ui.frontend.react && npm install && npm run build
- run: cd ui.frontend.react && npm run lint || true  # Allow lint to fail
```

## File Lists

### Root Directory Files
```
.git/
.gitignore
core/
pom.xml
ui.apps/
ui.frontend/
ui.frontend.react/
```

### Excluded from Version Control (per .gitignore)
```
node_modules/
npm-debug.log*
yarn-error.log*
pnpm-lock.yaml
dist/
build/
.env*
.DS_Store
.idea/
.vscode/
*.iml
*.log
```

## Instructions for Coding Agents

1. **Trust these instructions** - they have been validated through actual builds
2. **Build order matters** - always follow Maven → ui.frontend → ui.frontend.react
3. **Known lint errors are acceptable** - do not waste time trying to fix Dashboard.jsx errors unless explicitly asked
4. **No ESLint config in ui.frontend** - do not attempt to add one unless requested
5. **Always run validation** after making changes (see Validation Checklist above)
6. **npm install is required** before any build/lint command in frontend modules
7. **Do not commit build artifacts** - dist/, target/, and node_modules/ are gitignored
8. **Java modules are empty** - this is intentional for the demo project
9. **If a command fails**, check if you're in the correct directory and dependencies are installed
10. **Frontend dev servers** - use `npm run dev` for live development (Vite HMR enabled)

## Quick Reference

| Task | Command | Directory |
|------|---------|-----------|
| Full Maven build | `mvn clean install` | `/` (root) |
| Build vanilla JS | `npm install && npm run build` | `/ui.frontend` |
| Build React | `npm install && npm run build` | `/ui.frontend.react` |
| Lint React | `npm run lint` | `/ui.frontend.react` |
| Dev server vanilla | `npm run dev` | `/ui.frontend` |
| Dev server React | `npm run dev` | `/ui.frontend.react` |
| Clean artifacts | `npm run clean` (frontend), `mvn clean` (Java) | Respective dirs |

## Search Tips

When searching the codebase:
- Java source would be in `core/src/` or `ui.apps/src/` (currently empty)
- React components are in `ui.frontend.react/src/components/`
- Custom React hooks in `ui.frontend.react/src/hooks/`
- API utilities in `ui.frontend.react/src/utils/`
- Vanilla JS in `ui.frontend/src/`
- Maven POMs at root and in module directories
- Package.json files in frontend module roots
