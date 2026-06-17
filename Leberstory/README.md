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

### Directory Structure

```
src/
├── App.jsx                          # Main app component with condition allocation logic
├── main.jsx                         # Entry point
├── index.css                        # Global styles with theme variables
├── components/
│   ├── ConditionSelector.jsx       # 🆕 Manual condition selector (dev/testing only)
│   ├── Navbar.jsx                  # Navigation bar
│   ├── Hero.jsx                    # Landing section
│   ├── Thomas.jsx                  # Story protagonist intro
│   ├── Leber.jsx, Organe.jsx       # Medical content sections
│   ├── Section*.jsx                # Content sections (6-15)
│   ├── Layout/
│   │   ├── ScrollSection.jsx       # Scroll-based animation wrapper
│   │   ├── SplitPanel.jsx          # Two-column layout
│   │   └── CenterPanel.jsx         # Centered content wrapper
│   ├── Models/
│   │   ├── ModelLeber.jsx          # 3D liver model
│   │   ├── ModelOrgane.jsx         # 3D organs model
│   │   └── ModelMetastasen.jsx     # 3D metastases model
│   └── Context/
│       └── LanguageContext.jsx     # Language selection context
├── hooks/
│   └── useAutoRotateResume.js      # 3D model auto-rotation hook
├── lib/
│   ├── animationConfig.js          # GSAP animation settings
│   ├── conditionAllocator.js       # 🔑 Condition randomization logic
│   └── [other utilities]
└── images/                          # Theme-specific icons and assets

constants/
├── index.js                         # Navigation structure by version
├── narratives.js                    # Content for all 3 versions
└── themeAssets.js                  # Theme-specific image/color assets
```

### Core Components

#### App.jsx
- Handles URL parameter parsing (`cond`, `version`, `theme`, `pid`, etc.)
- Manages condition allocation (random or via URL override)
- Stores study context in session storage
- Renders the main layout with navbar, condition selector, and content sections

#### ConditionSelector.jsx (🆕 Development Feature)
- **Purpose**: Manual condition selection for understanding/testing the application
- **Usage**: Click the hamburger menu icon next to "Definition" in the navbar
- **Panel**: Opens a left-side panel showing all 9 conditions
- **Note**: This is a **development feature only** and was NOT used during the actual evaluation

#### conditionAllocator.js (Condition Randomization)
- **Hash-based allocation**: Default mode using participant ID hashing
- **Quota-based allocation**: Server-based allocation via shared API (optional)
- **Storage**: LocalStorage tracks remaining condition slots
- **Override**: URL parameter `cond=1-9` forces a specific condition

### Condition Allocation Flow (During Evaluation)

```
1. Participant arrives at URL (potentially with study parameters)
2. Participant ID extracted from URL params: PROLIFIC_PID, pid, participant_id, etc.
3. Allocator determines condition based on:
   - URL override (cond parameter) → Force specific condition
   - Allocation mode:
     * "hash" mode: Hash of participant ID → Deterministic randomization
     * "quota" mode: Server API → Respects remaining slot quotas
4. Condition (version + theme) applied to entire session
5. Study context stored in sessionStorage
6. Participant returns to survey with: cond, version, theme, pid, allocator info
```

### Theme System

Each of the 3 themes applies different color schemes throughout the app:

```css
/* Blue Theme */
--bg: #0d243a;
--text: #e2edf8;
--nav-active: #83b3e3;

/* Green Theme */
--bg: #0b2a1a;
--text: #e8fff2;
--nav-active: #8fe382;

/* Red Theme */
--bg: #2a0b10;
--text: #ffe8ee;
--nav-active: #e38286;
```

Theme-specific assets (icons, images) are also swapped via the `themeAssets.js` constant.

### Animation System

- **GSAP ScrollTrigger**: Scroll-position-based animations
- **Pinning**: Sections pin to viewport during scroll sequences (e.g., Thomas section)
- **Panel transitions**: Smooth fade and slide animations
- **Config**: Centralized animation settings in `animationConfig.js`

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm build

# Preview production build
npm preview
```

### Development Environment Variables

Create a `.env.local` file for optional configuration:

```env
# Optional: External condition allocator API (for quota mode)
VITE_ALLOCATOR_API_URL=https://your-allocator-api.com

# Optional: Debug flag
VITE_DEBUG=true
```

### Manual Condition Testing (Dev Only)

During development, use the **Condition Selector** to manually test different versions:

1. Click the **hamburger menu** (☰) next to "Definition" in the navbar
2. Select any of the 9 conditions
3. URL updates with `cond=X` parameter
4. Layout, content, theme, and assets update automatically

This feature **does NOT affect production** — it's purely for understanding and testing the application's behavior under different conditions.

## 📊 Study Design

### Participants

During evaluation:
- Participants were recruited (e.g., via Prolific)
- Participant ID passed via URL parameter
- Condition auto-assigned via randomization algorithm

### Condition Assignment

- **Deterministic**: Same participant ID always gets same condition
- **Distributed**: Hash algorithm aims for even distribution
- **Quota-aware**: Optional server-based mode respects per-condition limits

### Data Collection

- Participant ID stored in URL and study context
- Condition info included in survey return URL
- All allocation details logged for analysis

## 🛠️ Key Features

### Interactive Narrative
- Structured story sections with scrollable animations
- Character-driven content (Thomas as protagonist)
- Medical information presented in accessible way

### 3D Visualizations
- Interactive 3D liver model
- Organ system model
- Metastases visualization
- Auto-rotation capability with manual interaction

### Multi-Version Content
- 3 content versions (A, B, C) — structure and text may differ
- 3 visual themes — colors and design differ
- Combinations create 9 unique study conditions

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Adapts to all screen sizes
- Touch-friendly 3D interactions

### Language Support
- Context-based language switching (currently EN)
- Content can be multilingual via translation objects

## 🔧 Development Guide

### Adding a New Section

1. Create component in `src/components/Section{Name}.jsx`
2. Import in `constants/narratives.js`
3. Add to component map in narratives.js
4. Add content to narrative arrays for each version (A, B, C)
5. Update section groups in `constants/index.js` if needed

### Modifying Content

- **Text/narratives**: Edit `constants/narratives.js`
- **Navigation structure**: Edit `constants/index.js`
- **Theme colors**: Edit CSS variables in `src/index.css`
- **Theme assets**: Edit `constants/themeAssets.js`

### Creating Custom Animations

```javascript
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

export const MyComponent = () => {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        scrollTrigger: {
          trigger: ref.current,
          start: 'top center',
          end: 'bottom center',
          scrub: 1,
        },
        duration: 1,
        // ... animation properties
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return <div ref={ref}>Animated content</div>;
};
```

## 📦 Build & Deployment

### Production Build
```bash
npm run build
```

Creates optimized build in `dist/` directory.

### Deployment
- Deploy `dist/` to your hosting platform
- Configure environment variables for allocator API (if used)
- Ensure CORS is properly configured for cross-origin requests

### Survey Integration
- Direct participants to app URL with parameters: `?PROLIFIC_PID=XXX`
- App automatically assigns condition and returns to survey with `?i=token&cond=X&version=Y&theme=Z`

## 🧪 Testing

### Manual Testing Checklist
- [ ] Test all 9 conditions with Condition Selector
- [ ] Verify scroll animations work smoothly
- [ ] Check 3D models render and interact correctly
- [ ] Test on mobile devices
- [ ] Verify theme colors apply correctly
- [ ] Check language switching (if multilingual)

### Browser Compatibility
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 Notes

### 🆕 Manual Condition Selector

The **Condition Selector** button (hamburger menu) was added as a **development feature** to facilitate understanding and testing of the application during development. It is **not part of the actual study protocol** and was **not used during the evaluation**.

During the actual study:
- Conditions were assigned **automatically** via the randomization algorithm
- Participants **could not manually select** conditions
- Condition assignment was **deterministic** based on participant ID

The selector remains in the codebase for future development/testing purposes and can be easily removed if needed.

### Production vs. Development

- **Development**: Condition selector visible, URL parameters customizable
- **Production**: Condition selector removed from UI (or hidden), strict parameter validation

## 📄 License

[Add your license information here]

## 👥 Authors

[Add team/author information here]

## 📞 Support

[Add support contact information here]

