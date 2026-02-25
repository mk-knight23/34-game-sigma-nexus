# 34-game-sigma-nexus

<p align="center">
  <img src="https://img.shields.io/badge/Version-2.0.0-F59E0B?style=for-the-badge" alt="Version">
  <img src="https://img.shields.io/badge/Style-Sigma_Core-6366F1?style=for-the-badge" alt="Style">
  <img src="https://img.shields.io/badge/Stack-React_Recharts-61DAFB?style=for-the-badge&logo=react" alt="Stack">
</p>

## 🌐 The Quantum Analysis Engine

**SIGMA_NEXUS** is a high-precision analytical tool for numerical sequences. It visualizes algorithmic summation protocols and provides real-time statistical telemetry for range-based datasets.

## ⚡ Core Protocols

| Module | Legacy (RangeSync) | Sigma Nexus (v2.0) |
|:---|:---|:---|
| **Engine** | Basic Summation | **Multi-Algorithm Analysis** |
| **Visuals** | Simple Bars | **Interactive Data Matrix** |
| **Telemetry** | Static | **Real-time Variance/Dev** |
| **Interface** | Standard | **Gold/Black Glassmorphism** |

## Tech Stack

- **React 18** - Modern UI library
- **TypeScript** - For robust, type-safe development
- **Vite** - High-speed build optimization
- **Tailwind CSS** - Precision styling and layout
- **Recharts** - Professional data visualization
- **Zustand** - State management and storage
- **Framer Motion** - High-quality motion design
- **Lucide React** - Vector iconography

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/mk-knight23/40-Range-Sum-Calculator.git

# Navigate to project
cd 40-Range-Sum-Calculator

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production

```bash
# Build optimized bundle
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
40-Range-Sum-Calculator/
├── src/
│   ├── components/
│   │   └── RangeCalculator.tsx # Main dashboard & charts
│   ├── stores/
│   │   └── rangeStore.ts       # Global range state
│   ├── types/
│   │   └── range.ts            # TS interfaces
│   ├── utils/
│   │   └── mathUtils.ts        # Calculation logic & code gen
│   ├── App.tsx                # Core layout
│   └── index.css              # Global styles
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Deployment

This project includes a GitHub Actions workflow for automatic deployment to GitHub Pages.

1. Enable GitHub Pages in repository settings.
2. Set source to "GitHub Actions".
3. Push to the `main` branch to trigger deployment.

## License

MIT License - see [LICENSE](LICENSE) for details.

---

### Live Demo
- GitHub Pages: <https://mk-knight23.github.io/40-Range-Sum-Calculator/>

## 🎮 Live Demos

| Platform | URL |
|----------|-----|
| **Vercel** | [34-game-sigma-nexus.vercel.app](https://34-game-sigma-nexus.vercel.app) |
| **Render** | [three4-game-sigma-nexus.onrender.com](https://three4-game-sigma-nexus.onrender.com) |

---

## 📝 Design Notes (V2)

### Intentional Quirk: The Streak Counter
Most calculator tools are cold and transactional. I added a session streak counter that tracks consecutive calculations. Why? Because even boring tools can have personality. The streak serves no "business purpose"—it's just a small dopamine hit to make math feel a bit more fun. It resets when you refresh. Impermanent, like a good cup of coffee.

### Tradeoff: Keyboard Shortcuts Over Mobile-First
I added ⌘+Enter to calculate and ? for help. This prioritizes desktop power users over mobile thumb-typers. The tradeoff: mobile users don't get the "pro" experience. But honestly? This is a calculator for people who use keyboards. The mobile layout works fine; it just doesn't have shortcuts. Choose your user.

### What I Chose NOT to Build
No persistent cloud storage. Your history lives in localStorage and vanishes when you clear data. No accounts, no sync, no "save to cloud." The decision: this is a browser tool, not a database application. If you need permanent records, export to a real spreadsheet. This tool does one thing well: quick calculations that disappear when you're done.

## 🎉 Additional Features (V3)

Five major enhancements for advanced data utility:

### 1. Enhanced Visualization Graphs
**Why added**: The original bar chart was basic and limited.

**What changed**: Upgraded to interactive Recharts with:
- Hover tooltips showing exact values
- Color-coded bars for better visual distinction
- Responsive design that adapts to screen size
- Smooth animations on data changes

### 2. Favorites System
**Why added**: Users frequently calculate the same ranges (e.g., 1-100, 1-365 for days).

**What changed**: Added a favorites panel where you can:
- Save any range configuration with a custom name
- Quickly load saved ranges with one click
- Manage up to 20 favorite ranges
- Organize frequently-used calculations

### 3. Export to CSV/PDF
**Why added**: Users need to save results for reports or analysis.

**What changed**: Added comprehensive export options:
- **CSV Export**: Download full calculation history as spreadsheet
- **Print Report**: Generate beautifully formatted PDF reports
- **Include History**: Export includes all recent calculations
- **One-Click**: Single button to download or print

### 4. Custom Formula Builder
**Why added**: Power users want to apply custom mathematical operations.

**What changed**: Added a formula editor that supports:
- Create custom mathematical expressions
- Define variables with default values
- Test formulas before saving
- Support for: sin, cos, tan, sqrt, abs, pow, PI, E
- Save and reuse custom formulas

### 5. Shareable Links
**Why added**: Collaboration requires sharing configurations easily.

**What changed**: Added share functionality:
- Generate unique URLs for any range configuration
- Copy link with one click
- Anyone opening the link sees your exact settings
- Perfect for sharing calculations with colleagues

### Intentionally Rejected: Cloud Sync
I considered adding cloud storage for favorites and history. Rejected because:
- This is a privacy-focused tool—your calculations stay on your device
- localStorage is sufficient for most use cases
- Export to CSV covers the "backup" use case
- No account overhead means instant access, no login friction
