# LiverCancerStory

An interactive, narrative-driven web application about liver cancer designed for scientific research and patient education. The application features multiple versions (A, B, C) with different themes (blue, green, red) to support randomized condition assignment in controlled studies.

## 🏗️ Project Architecture

### High-Level Overview

The application is built as a single-page React application using **Vite** with the following key technologies:

- **React 19**: UI component framework
- **Vite**: Lightning-fast build tool and dev server
- **GSAP 3**: Animation library with ScrollTrigger for scroll-based animations
- **Three.js + React Three Fiber**: 3D model rendering
- **Tailwind CSS**: Utility-first CSS styling
- **React Router DOM**: Navigation and URL parameter handling

### Condition System

The application uses a **9-condition factorial design**:

```
3 Versions (A, B, C) × 3 Themes (blue, green, red) = 9 Conditions

Condition 1: Version A + Blue theme
Condition 2: Version A + Green theme
Condition 3: Version A + Red theme
Condition 4: Version B + Blue theme
Condition 5: Version B + Green theme
Condition 6: Version B + Red theme
Condition 7: Version C + Blue theme
Condition 8: Version C + Green theme
Condition 9: Version C + Red theme
```

### Repository Structure

```
Leberstory/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── images/
├── constants/
├── public/
└── package.json

allocator-service/
├── server.mjs
└── README.md
```

### Core Concepts

- **Automatic condition assignment** was used during study evaluation.
- **Manual condition selector** was added for development and understanding only.
- **Randomization** was the actual evaluation mode.

## 🧩 Manual Condition Selector

The manual selector appears as a hamburger menu next to the navigation and opens a left-side panel with all 9 conditions.

### Important
- This feature is **for development/testing only**.
- During evaluation, conditions were assigned **automatically**, not manually.
- The manual selector is included to help understand how the app applies different versions and themes.

## 🚀 Running the App

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the build:

```bash
npm run preview
```

## 🔧 Condition Allocation

Allocation is handled in `Leberstory/src/lib/conditionAllocator.js`.

- `hash` mode: deterministic assignment based on participant ID
- `quota` mode: optional external allocator API
- URL parameter `cond=1-9` can override condition

## 📝 Notes on Evaluation

During the actual evaluation, the app used randomization and not the manual selection panel. The manual selector was developed later to explore different conditions and verify behavior.
