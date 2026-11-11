# Liver Cancer Narrative

An interactive, scroll-driven web story about liver cancer, built as the stimulus for an online study. Readers follow Thomas, a 52-year-old who is diagnosed with liver cancer, while the story explains what liver cancer is, its symptoms, diagnosis, treatment, prognosis and prevention, using animated panels and interactive 3D models.

**Live version:** https://mysteriousresearchcat.github.io/LiverCancerNarrative/

## Study conditions

The story exists in **3 narrative versions × 3 colour themes = 9 conditions**.

| | Blue | Green | Red |
|---|---|---|---|
| **Version A**: neutral overview | 1 | 2 | 3 |
| **Version B**: positive framing | 4 | 5 | 6 |
| **Version C**: negative framing | 7 | 8 | 9 |

- **Version A** (*"Liver Cancer: An Overview"*) presents the medical information neutrally. Thomas appears at the beginning and the end, and his outcome is left open.
- **Version B** (*"Liver Cancer and Possible Chances"*) follows Thomas as he takes the diagnosis as a chance to change his lifestyle. His treatment is successful.
- **Version C** (*"Liver Cancer and the Consequences"*) follows Thomas as he ignores his risk factors. His cancer returns and his health stays poor.

The medical information (statistics, symptoms, diagnostics, treatments, survival rates, prevention) is largely the same in all three versions; what differs is how Thomas's story frames it. The themes change the colour palette and the matching icons and illustrations.

### Viewing a specific condition

Add `?cond=` with a number from 1 to 9 to the URL, for example:

```
https://mysteriousresearchcat.github.io/LiverCancerNarrative/?cond=7
```

You can also switch conditions in the app: click the **☰** button at the left of the navigation bar to open a panel with all 9 conditions. This panel was added afterwards for exploring the conditions. Study participants did not choose their condition.

## Running locally

Requires [Node.js](https://nodejs.org/) 20.19 or newer. The app lives in the `Leberstory/` folder.

```bash
cd Leberstory
npm install
npm run dev        # development server at http://localhost:5173/
npm run build      # production build into Leberstory/dist/
npm run preview    # serve the production build locally
npm run lint       # ESLint
```

## Recording a walkthrough video

`npm run record` opens the story in a fullscreen Chrome window and scrolls through it at a constant, smooth speed, so it can be captured with a screen recorder such as [OBS Studio](https://obsproject.com/). The script only drives the browser; it does not record video itself.

1. Start the app (`npm run dev`), or use the live URL with `--url`.
2. Open OBS and add a **Display Capture** (or **Window Capture**) source. Set the output to 1920×1080 at 60 fps.
3. Run the script, then start recording in OBS during the countdown:

   ```bash
   npm run record -- --cond 1
   ```

| Option | Default | Description |
|---|---|---|
| `--url <url>` | `http://localhost:5173/` | Site to open |
| `--cond <list>` | `1` | Condition(s): `4`, `1,4,7` or `all` |
| `--speed <px/s>` | `220` | Scroll speed. At 1080p one condition takes about 4–5 minutes. |
| `--delay <s>` | `6` | Countdown before scrolling starts, to start recording and let the title animation finish |
| `--hold <s>` | `4` | Time to stay on the final screen |
| `--windowed` | off | Use a normal window (`--width`/`--height`, default 1920×1080) instead of fullscreen |
| `--browser <name>` | `chrome` | `chrome` or `msedge`. Falls back to Edge if Chrome is not installed. |

Press `Esc` or `F11` to leave fullscreen.

## How it works

| Technology | Used for |
|---|---|
| React 19 + Vite | App and build |
| GSAP + ScrollTrigger | Pinned sections and scroll-linked animations |
| Three.js + React Three Fiber | 3D models of the liver, the organs and metastases (`Leberstory/public/meshes/`) |
| Tailwind CSS | Styling |

The story is built from section components that are filled with text from one central file:

```
Leberstory/
├── constants/
│   ├── narratives.js     # all story text, per version (A, B, C)
│   ├── index.js          # navigation chapters and which sections belong to each
│   └── themeAssets.js    # icons and images per theme (blue, green, red)
├── src/
│   ├── App.jsx           # reads ?cond=, applies version and theme, renders the sections
│   ├── components/       # one component per story section, plus layout and 3D models
│   ├── lib/animationConfig.js   # shared animation timing
│   ├── images/           # theme-specific icon sets and illustrations
│   └── index.css         # theme colours (CSS variables) and base styles
├── public/meshes/        # 3D models (.glb)
└── scripts/record-walkthrough.mjs
```

- **To change text:** edit `constants/narratives.js`. Each text has an `en` and a `de` entry; the app currently shows English.
- **To change colours:** edit the `theme-blue`, `theme-green` and `theme-red` variables in `src/index.css`.
- **To change icons or images:** edit `constants/themeAssets.js`.

## Deployment

Every push to `main` builds `Leberstory/` and publishes it to GitHub Pages (`.github/workflows/deploy.yml`).
