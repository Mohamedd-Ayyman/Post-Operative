# Design System Report — PostOp Guard

## 1. Design Philosophy

PostOp Guard uses a clean, trustworthy medical aesthetic — professional without being clinical, approachable without being casual. The design language prioritizes clarity, calmness, and trust, using soft gradients, generous whitespace, and a carefully curated color system that conveys risk severity at a glance.

## 2. Color System

### Brand Colors
| Name | Hex | Usage |
|------|-----|-------|
| Blue 600 | `#2563EB` | Primary actions, links, brand identity |
| Blue 700 | `#1D4ED8` | Hover states on primary |
| Blue 50 | `#EFF6FF` | Subtle backgrounds, highlights |

### Semantic Colors (Risk Levels)
| Risk | Color | Hex | Usage |
|------|-------|-----|-------|
| Normal/Safe | Green | `#22C55E` / `#16A34A` | Safe indicators, success states |
| Moderate | Yellow/Amber | `#F59E0B` / `#D97706` | Warning states, caution |
| High/Danger | Red | `#EF4444` / `#DC2626` | Danger states, high risk alerts |
| Teal | Teal | `#14B8A6` | Secondary accents, charts |

### Neutrals
- Background: `#F9FAFB` (gray-50)
- Card bg: `#FFFFFF`
- Border: `#F3F4F6` (gray-100)
- Text primary: `#111827` (gray-900)
- Text secondary: `#6B7280` (gray-500)
- Text muted: `#9CA3AF` (gray-400)

## 3. Typography

- **Font Family**: Inter (sans) + JetBrains Mono (code/mono)
- **Fallback**: system-ui, sans-serif
- **Scale**:
  - Display (hero): 5xl / 3rem / font-extrabold
  - H1: 3xl / 1.875rem / font-bold
  - H2: 2xl / 1.5rem / font-semibold
  - Body: base / 1rem / font-normal
  - Small: sm / 0.875rem
  - XS: xs / 0.75rem

## 4. Spacing System

Uses Tailwind's 4px-based spacing scale:
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px, 4xl: 96px
- Content max-width: 7xl / 1280px (dashboard), 2xl / 672px (forms)
- Card padding: 6 (24px)
- Section gaps: 6 (24px)

## 5. Component Tokens

### Buttons
```css
.btn-primary: bg-blue-600 hover:bg-blue-700 text-white font-semibold
              rounded-xl px-6 py-3 transition-all duration-200 shadow
              hover:-translate-y-0.5 active:translate-y-0

.btn-secondary: bg-white text-gray-700 border border-gray-200
               hover:-translate-y-0.5 hover:border-gray-300 rounded-xl
```

### Cards
```css
.card: bg-white rounded-2xl shadow-sm border border-gray-100 p-6
.card-hover: card + hover:shadow-lg hover:-translate-y-1
             hover:border-blue-100 transition-all duration-300
```

### Inputs
```css
.input-field: w-full px-4 py-3 rounded-xl border border-gray-200
              focus:outline-none focus:ring-2 focus:ring-blue-500/20
              focus:border-blue-500 transition-all duration-200
```

### Risk Badges
```
Normal: bg-green-100 text-green-700
Moderate: bg-yellow-100 text-yellow-700
High: bg-red-100 text-red-700
```

## 6. Animations

| Name | Duration | Effect |
|------|----------|--------|
| fadeIn | 400ms | opacity 0→1 |
| slideUp | 500ms | opacity 0→1, translateY 20px→0 |
| pulseGlow | 2s | box-shadow pulsing for alerts |
| shimmer | 1.5s | skeleton loading effect |

### Interaction Animations
- Button hover: translateY(-2px) + deeper shadow
- Card hover: translateY(-4px) + wider shadow
- Step transitions: fade + slide
- Form step advance: next step slides in

## 7. Layout

### Page Structure
- **Navbar**: sticky, blur backdrop, shadow on scroll behavior
- **Content**: max-width containers, responsive grid
- **Dashboard**: 4-column stat grid, 2-column chart grid
- **Check-In**: centered 2xl container, 4-step form
- **Results**: centered 2xl, stacked cards

### Responsive Strategy
- Mobile-first approach
- Grid collapse: 4→2→1 columns
- Navbar: hamburger menu below md
- Charts: stacked on mobile, side-by-side on lg

## 8. Icon Library

**Lucide React** — consistent 24px stroke icons:
- Activity (brand), Shield (security), Bell (notifications)
- TrendingUp/AlertTriangle (risk), CheckCircle (safe)
- Plus/PlusSquare (check-in), History (history)
- ArrowRight, ChevronLeft/Right (navigation)
- Eye/EyeOff (password), LogOut (sign out)
- Heart (security section), BarChart3 (stats)

## 9. Chart System

**Recharts** for all data visualizations:
- AreaChart: pain/temperature trends, wound indicators
- Gradient fills matching brand colors
- Tooltip on hover with formatted values
- ResponsiveContainer for mobile scaling
- X-axis: date labels, Y-axis: value range
- CartesianGrid: subtle dotted lines (#f0f0f0)

## 10. Form Design

### Check-In Multi-Step Form
- 4 steps: Vitals → Wound → Lifestyle → Review
- Animated stepper indicator with progress
- Interactive sliders for pain (0-10) and temperature (35.5-41)
- Button grid selectors for discrete choices (discharge, activity)
- Toggle buttons for boolean options (smoking, diabetes)
- Review card with all submitted values
- Progress persists across steps

### Validation
- Real-time visual feedback (color-coded slider values)
- Conditional warnings (fever >38.5°C)
- Disabled submit until all required fields filled