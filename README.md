# Ascensor - Design Your Elevator (3D Lift Configurator)

Highest Quality Performance - Interactive 3D Lift Cabin Configurator. Built with React 19, Three.js / React Three Fiber, and Tailwind CSS.

---

## 1. Research Summary & Comparative Findings (Orona Inspection)

Using REA (Reverse Engineer Anything) and frontend bundle analysis on Orona Ambiences (`https://orona-ambiences.orona-group.com/en`), we inspected its architecture, data models, and customer workflows.

### Confirmed Observations vs. Technical Inferences

| Dimension | Confirmed Observation (Empirical Evidence) | Technical Inference / Analysis |
| :--- | :--- | :--- |
| **Frontend Framework** | React SPA bundled with webpack/Create-React-App; uses `react-i18next`, `@material-ui/core` form controls, and SCSS modules (`ConfiguratorLayout.module.scss`, `View.module.scss`). | High degree of enterprise customization; modular component architecture organized by functional areas. |
| **Data Schema & Communication** | Protobuf schema `ccab-with-enums-v1.proto` defines configuration fields (`CCAB_MODELO`, `CCAB_EMBARQUE`, `CCAB_PARED_...`, `CCAB_PANEL_MANDO_...`, `CCAB_ESPEJO_...`). | Server communications and serialization rely on binary/base64 Protobuf payloads passed via URL search parameters to AWS Lambda endpoints. |
| **Visual Preview Engine** | **The site does NOT use a real-time WebGL 3D engine.** Instead, it utilizes composite pre-rendered 2.5D image layers (`frontViewLayers.js`, `panelViewLayers.js`, `outsideViewLayers.js`, `LayerImage.jsx`, `LayerMask.js`). | Chosen by the manufacturer to guarantee photographic rendering of reflections and lighting without client-side GPU performance penalties, at the cost of free 360° orbit rotation, real-time lighting changes, and dynamic dimension morphing. |
| **Customer Journey** | Two-phase wizard: First Steps (Model, Entrance layout, Style family Presets) followed by Studio Customization (Walls, Floors, Ceilings, Doors, Mirrors, Handrails, Operating Panel, Protections) and final Contact/Quote modal. | Progressive disclosure ensures non-technical customers are not overwhelmed before selecting baseline requirements. |
| **Export Mechanism** | Base64-encoded configuration payload is dispatched to a serverless PDF generator Lambda endpoint (`${siteUrl}${apiEndpointPdf}?lang=en&configurator=ambiences&configuration=${base64}`). | The client does not perform offline PDF rendering; PDF generation requires backend connectivity. |

---

## 2. Our Implementation Direction & Architectural Elevation

In **“Design your Elevator”**, we match and elevate the customer experience while strictly avoiding Orona's proprietary branding, source code, text, visual assets, or pre-rendered images:

1. **Real-time 3D Engine (Three.js + React Three Fiber)**:
   - Rather than static layered 2D images, we implement a **fully interactive, rotatable 3D procedural elevator cabin model**.
   - Supports 360° orbit rotation, zoom, preset camera perspectives (Interior, Entrance, Control Column, Ceiling, 3D Cutaway), smooth door opening/closing animations, and dynamic Kelvin lighting toggles (3000K, 4000K, 5000K).
   - Real-time dimensional scaling when cabin width, depth, or height change.
2. **Modular Architecture & Modern Tech Stack**:
   - **Vite + React 19 + TypeScript**: Maximum performance and clean type safety.
   - **Tailwind CSS v4**: Restrained, modern industrial design system (warm neutrals, deep charcoal/slate typography, and confident architectural amber accents).
   - **jsPDF**: 100% client-side, zero-latency architectural specification PDF generation with dimension tables, finishes breakdown, and engineering disclaimers.
   - **LocalStorage State Persistence**: Auto-saves every configuration tweak so refreshing or navigating away never loses progress.
3. **Approachable Customer Experience**:
   - 6-step guided wizard: Concepts & Presets → Dimensions & Entrances → Walls & Finishes → Floors & Lighting → Fittings & Operating Panel → Review & Specification.
   - Interactive jump-back links from the final summary directly to any step.
   - Accessible quotation request modal with clear demo transparency disclosure.

---

## 3. Data Model & Architecture Overview

```
ElevatorConfiguration (Source of Truth)
├── configId (Unique reference string, e.g. DYE-849201)
├── dimensions
│   ├── widthMm (900mm - 1600mm)
│   ├── depthMm (1100mm - 2400mm)
│   ├── heightMm (2100mm - 2600mm)
│   ├── capacityKg (Calculated rated load)
│   ├── persons (Passenger occupancy)
│   ├── entranceType (single | through_180 | adjacent_90)
│   └── en81_70_compliant (Wheelchair accessibility flag)
├── walls
│   ├── allSame (Boolean toggle for uniform vs individual finishes)
│   ├── left (FinishOption ID)
│   ├── rear (FinishOption ID)
│   └── right (FinishOption ID)
├── floor (FloorOption ID)
├── ceiling (CeilingOption ID: spots, halo, luminous, linear)
├── door (DoorOption ID: center 2-panel, telescopic, vision panels)
├── mirror (MirrorOption ID: half, narrow pillar, full wide, bronze)
├── handrail (HandrailOption ID: cylindrical inox, flat black, 3-sided)
├── controlPanel (ControlPanelOption ID: TFT column, dot matrix, 7-seg)
├── skirting (SkirtingOption ID: recessed, bumper protection)
├── lightingTempMode (warm_3000k | neutral_4000k | cool_5000k)
└── doorsOpen (Boolean toggle for animated slide)
```

---

## 4. Installation & Local Development

### Prerequisites
- **Node.js**: v20+ or v24+ (Node v24.21.0 recommended)
- **npm**: v10+

### Setup Commands

```bash
# 1. Navigate to the project directory
cd "f:/STRANGER/REVERSE ENGINEERING/design-your-elevator"

# 2. Install dependencies (three, @react-three/fiber, @react-three/drei, lucide-react, jspdf, tailwindcss)
npm install

# 3. Start the local Vite development server
npm run dev
```

The application will launch locally at `http://localhost:5173/`.

### Production Build

```bash
# Validate TypeScript types and build minified production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 5. Verification & Test Checklist

- [x] **Step 1 Presets**: Selecting any style preset (Nordic Clean, Metropolitan Bronze, Obsidian Executive, Warm Heritage, Industrial Minimal) applies its cohesive palette across walls, floor, ceiling, and fixtures in the 3D model.
- [x] **Step 2 Dimensions**: Sliders for width (900-1600mm), depth (1100-2400mm), and height (2100-2600mm) dynamically resize the 3D cabin box in real-time. Capacity (kg) and passenger count update automatically.
- [x] **Step 2 Entrances**: Switching between Single Entrance, Through Entrance (180° front & rear doors), and Adjacent Entrance (90°) updates geometry and door portals immediately.
- [x] **Step 3 Walls**: "Uniform Wall Finishes" toggle synchronizes all walls or allows independent left, rear, and right finish customization across stainless steels, champagne PVD, smoked glass, and hardwood veneers.
- [x] **Step 4 Floors & Ceilings**: Real-time material shader updates for floors (Nero Marquina, Terrazzo, Herringbone, Studded Rubber) and ceiling architectural lighting types (Halo Cove, Quad Spots, Luminous Diffuser, Linear Slits).
- [x] **Lighting Temperature**: Toggling between 3000K, 4000K, and 5000K changes Three.js light color temperatures and emissive materials.
- [x] **Step 5 Fittings**: Toggling door types, mirror styles, handrails, Car Operating Panel (COP) columns, and skirting baseboards reflects immediately on the cabin model.
- [x] **Interactive 3D Controls**: OrbitControls (left drag), zoom (wheel), pan (right drag), and 5 camera preset buttons (Inside, Entrance, COP, Ceiling, 3D Cutaway). Door open/close button smoothly animates sliding panels.
- [x] **Step 6 Summary & PDF**: Full bill of materials displayed with quick edit links jumping back to respective steps. "Download Spec PDF" produces a formatted client-side PDF document via `jspdf`.
- [x] **Quote Request Form**: Modal validates required fields accessibly (first name, last name, email format, city, privacy consent) and displays a transparent demo confirmation state without sending network requests.
- [x] **Persistence**: Refreshing the page or closing the tab restores the exact configured cabin from `localStorage`. "Reset" button restores baseline settings with confirmation.
- [x] **WebGL Fallback**: If WebGL is unavailable or fails, an architectural technical specification card is displayed with full dimensional metrics rather than a blank canvas.

---

## 6. Known Limitations & Prototype Boundaries

1. **Procedural 3D Geometry vs. Manufacturer CAD**:
   - The current 3D cabin is an original procedural geometric model created with Three.js primitives and PBR materials. It serves as an architectural visual customizer.
   - *Production Handoff*: To integrate factory-accurate sheet metal folds, certified door interlocks, or proprietary cab profiles, drop manufacturer GLB/glTF assets into `src/components/viewer/ElevatorModel.tsx`.
2. **Sample Catalog Data**:
   - The dimensional rules, finishes, and accessories represent realistic European / North American elevator industry standards (EN 81-20/50, EN 81-70). Specific manufacturer product codes, exact RAL powder-coat references, and live supplier stock levels are sample entries.
3. **Demo Quote Submission**:
   - Quote requests are validated and recorded in local component state. In this standalone frontend demonstration, submissions are intentionally not transmitted to third-party CRM or email servers. Connecting a real backend requires providing an API endpoint or webhook in `src/components/quote/QuoteModal.tsx`.
