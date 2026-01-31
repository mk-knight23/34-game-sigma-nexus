# RangeSync - Range Statistics & Visualization Tool

A professional-grade application for calculating numerical range statistics and visualizing sequences. Built with React 18, TypeScript, and Recharts.

## Features

- **Advanced Statistics** - Instant calculation of Sum, Average, Count, and Standard Deviation for any numerical range.
- **Sequence Visualizer** - Interactive bar chart representation of your numerical data sequences.
- **Custom Increments** - Support for fractional steps and descending ranges.
- **Algorithm Snippets** - Real-time code generation for multiple programming languages (JS, Python, Java, C++).
- **Persistent History** - Keep track of your previous calculations with local persistence.
- **Professional UI** - Modern glassmorphism design with fluid animations.
- **Dark/Light Mode** - Full support for system and manual theme toggling.

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
- Vercel: [Deploy your own](https://vercel.com/new)
- Netlify: [Deploy your own](https://app.netlify.com/start)

---

## 📝 Design Notes (V2)

### Intentional Quirk: The Streak Counter
Most calculator tools are cold and transactional. I added a session streak counter that tracks consecutive calculations. Why? Because even boring tools can have personality. The streak serves no "business purpose"—it's just a small dopamine hit to make math feel a bit more fun. It resets when you refresh. Impermanent, like a good cup of coffee.

### Tradeoff: Keyboard Shortcuts Over Mobile-First
I added ⌘+Enter to calculate and ? for help. This prioritizes desktop power users over mobile thumb-typers. The tradeoff: mobile users don't get the "pro" experience. But honestly? This is a calculator for people who use keyboards. The mobile layout works fine; it just doesn't have shortcuts. Choose your user.

### What I Chose NOT to Build
No persistent cloud storage. Your history lives in localStorage and vanishes when you clear data. No accounts, no sync, no "save to cloud." The decision: this is a browser tool, not a database application. If you need permanent records, export to a real spreadsheet. This tool does one thing well: quick calculations that disappear when you're done.

## 🎉 Additional Features (V3)

Three practical enhancements for data utility:

### CSV Export
**Why added**: You calculate a range, get nice results, and then... what? Previously, copying required manual selection.

**What changed**: Added a "Download CSV" button that exports the full calculation sequence to a CSV file. Includes range values, cumulative sum, and statistics. Opens in Excel/Google Sheets with one click.

### Comparison Mode
**Why added**: Sometimes you want to compare two ranges side-by-side—like "how does 1-100 compare to 101-200?"

**What changed**: Added a comparison toggle that lets you calculate two ranges and view them together on a stacked bar chart. Good for understanding relative distributions.

### Quick Presets
**Why added**: Common ranges (1-100, 1-365 for days, 1-1000) require typing every time.

**What changed**: Added preset buttons for frequently-used ranges. Click to populate, then adjust as needed. Small time-saver that adds up.

### Intentionally Rejected: Advanced Functions
I considered adding support for functions like sin(x), x², etc. Rejected because this tool is about *ranges*, not function plotting. Adding functions would make it a poor man's graphing calculator. Better to do one thing well (arithmetic sequences) than be mediocre at everything.
