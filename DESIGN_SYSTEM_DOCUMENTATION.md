# JezzyERP Design System Documentation
**Standardized Frontend Design System & Component Guidelines**  
*Version 2.0 • November 2026 • Enterprise Production Standard*

---

## 1. Design Principles & Architecture

JezzyERP's design system is structured to provide an **intuitive, high-density, professional SaaS enterprise experience**. It balances visual clarity, high information density for financial workflows, accessibility compliance (WCAG 2.1 AA), and robust responsiveness across all viewport sizes (320px through 1920px).

### Core Pillars
1. **Clarity Over Novelty:** Standard B2B SaaS patterns replace decorative gimmicks (such as claymorphism, oversized 40px radii, or sci-fi jargon).
2. **Predictable Component Geometry:** Strict adherence to 4px and 8px baseline grids with uniform component heights (`h-8`, `h-9`, `h-10`).
3. **High Data Legibility:** Numeric data, ledger balances, and currency figures use monospaced or `tabular-nums` alignment to prevent visual jitter.
4. **Resilient Responsiveness:** Interfaces degrade gracefully from high-resolution multi-column desktop layouts to stacked, touch-accessible mobile drawers and cards.
5. **Universal Accessibility:** 100% of interactive controls feature visible focus indicators (`focus-visible:ring-2`), semantic HTML attributes (`role="dialog"`, `aria-label`), and touch targets that never rely solely on desktop hover states.

---

## 2. Color Palette & Semantic Tokens

JezzyERP utilizes Tailwind CSS v4 tokenized palette grounded in neutral slate grays with purpose-driven semantic accent colors.

### 2.1 Neutral Base Palette (Slate)
| Token | Hex Equivalent | Usage |
| :--- | :--- | :--- |
| `bg-slate-50` | `#F8FAFC` | Page backgrounds, subtle card headers, table header backgrounds |
| `bg-slate-100` | `#F1F5F9` | Hover states on interactive rows, inactive tab indicators |
| `border-slate-200` | `#E2E8F0` | Primary component borders, card dividers, table borders |
| `border-slate-300` | `#CBD5E1` | Default input and select field borders |
| `text-slate-400` | `#94A3B8` | Placeholder text, disabled icon states |
| `text-slate-500` | `#64748B` | Table column headers, timestamps, secondary captions |
| `text-slate-600` | `#475569` | Helper descriptions, navigation item icons, body labels |
| `text-slate-700` | `#334155` | Secondary body text, table row secondary metadata |
| `text-slate-900` | `#0F172A` | Primary headings, prominent table values, card titles |

### 2.2 Semantic & Accent Colors
| Role | Classes | Tokens | Purpose |
| :--- | :--- | :--- | :--- |
| **Primary Brand** | `bg-primary`, `text-primary`, `border-primary` | Deep Corporate Navy / Indigo `#0F172A` / `#2563EB` | Primary action buttons, active navigation, focused input rings |
| **Success / Positive** | `bg-emerald-50`, `text-emerald-700`, `border-emerald-200` | `#059669` / `#10B981` | Paid status, positive equity, completed invoices, credit received |
| **Danger / Destructive** | `bg-rose-50`, `text-rose-700`, `border-rose-200` | `#E11D48` / `#F43F5E` | Overdue debts, rejected quotes, destructive delete buttons, errors |
| **Warning / Attention** | `bg-amber-50`, `text-amber-700`, `border-amber-200` | `#D97706` / `#F59E0B` | Pending approvals, partial payments, warning badges, unallocated advances |
| **Informational / Sent** | `bg-blue-50`, `text-blue-700`, `border-blue-200` | `#2563EB` / `#3B82F6` | Sent invoices, active orders, vendor transaction logs |
| **Neutral / Inactive** | `bg-slate-100`, `text-slate-700`, `border-slate-200` | `#64748B` | Draft items, inactive accounts, archived trash records |

---

## 3. Typography Scale & Guidelines

The system uses standard sans-serif (`font-sans` - Inter/System UI) throughout all interfaces.

### 3.1 Type Hierarchy
| Level | Tailwind Classes | Typical Use |
| :--- | :--- | :--- |
| **Display Title (Auth)** | `text-2xl font-bold tracking-tight text-slate-900` | Login / Signup prominent titles |
| **Page Heading (H1)** | `text-xl font-bold tracking-tight text-slate-900` | Primary top-level route headers |
| **Section Heading (H2)** | `text-lg font-semibold text-slate-900` | Card headers, modal titles, ledger group titles |
| **Card / Widget Subtitle** | `text-sm font-medium text-slate-500` | KPI card metric descriptors, section briefs |
| **Body (Default)** | `text-sm font-normal text-slate-700 leading-normal` | Form labels, standard table cells, description text |
| **Body (Strong)** | `text-sm font-semibold text-slate-900` | Primary client names, invoice numbers, key values |
| **Small / Caption** | `text-xs text-slate-500` | Table column headers, helper text, timestamps |
| **Financial / Figures** | `text-sm font-semibold tabular-nums text-slate-900` | Currency, debit/credit entries, balance tallies |

### 3.2 Typography Rules
- **No Pseudo-Sci-Fi Vocabulary:** Terminology must conform to standard international accounting and ERP standards (e.g., use "Invoices", "Quotations", "Vendor Payments", "Equity & Capital", "Audit Trail", not "Capital Node", "Emission Date", or "Purge Entity").
- **Sentence Case:** All button labels, toast notifications, dialog prompts, and table headers use Sentence case or standard Title Case, avoiding aggressive ALL-CAPS italic typography.
- **Tabular Figures:** Always apply `tabular-nums` or `font-mono` to currency and quantity columns to ensure decimal points align vertically in tables and financial ledgers.

---

## 4. Spacing, Sizing & Layout Geometry

### 4.1 Page Layout Grid
- **Global Page Padding:** `px-4 sm:px-6 lg:px-8 py-6` ensures consistent gutter across all responsive viewports.
- **Vertical Section Rhythm:** `space-y-6` between header strips, filter toolbars, summary stat cards, and primary data tables.
- **Metric Grid Columns:** 
  - Standard 4-stat KPI row: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4`
  - Two-column detail / editor: `grid grid-cols-1 lg:grid-cols-3 gap-6` (2 columns main, 1 column sidebar)

### 4.2 Elevation, Borders & Radii
- **Standard Border Radius:**
  - Badges, small inputs, buttons: `rounded-lg` (8px)
  - Cards, content containers, dropdown menus: `rounded-xl` (12px)
  - Modals, large slide-overs: `rounded-2xl` (16px)
  - Pill tags: `rounded-full` (9999px)
  - *Eliminated:* Oversized `rounded-3xl` (24px) or `rounded-[2.5rem]` (40px) on standard data boxes.
- **Borders:** Subtle `border border-slate-200` on white backgrounds (`bg-white`).
- **Shadows:** Standardized to soft Tailwind micro-elevations: `shadow-xs`, `shadow-sm`, and `shadow-md` for floating dropdowns and modals.

---

## 5. Component Standards

### 5.1 Buttons (`@/ui/core/Button`)
Buttons provide clear visual hierarchy across 6 variants and 3 standard heights.

```tsx
import { Button } from "@/ui/core/Button";

// Primary Action
<Button variant="primary" size="md">Save Changes</Button>

// Secondary / Outline Action
<Button variant="outline" size="md">Cancel</Button>

// Destructive Action
<Button variant="destructive" size="sm">Delete Record</Button>
```

| Property | Values | Standard Specifications |
| :--- | :--- | :--- |
| **Sizes** | `sm`, `md`, `lg` | `sm`: `h-8 px-3 text-xs`<br/>`md`: `h-9 px-4 text-sm`<br/>`lg`: `h-10 px-5 text-sm` |
| **Variants** | `primary`, `secondary`, `outline`, `ghost`, `destructive`, `link` | `primary`: `bg-slate-900 text-white hover:bg-slate-800`<br/>`outline`: `border border-slate-300 bg-white text-slate-700 hover:bg-slate-50`<br/>`destructive`: `bg-rose-600 text-white hover:bg-rose-700` |
| **Radius & Weight** | `rounded-lg font-medium` | Predictable tactile geometry |
| **Focus State** | `focus-visible:ring-2 focus-visible:ring-slate-900/20` | Full keyboard accessibility |

### 5.2 Form Inputs & Controls (`@/ui/core/Input`)
```tsx
import { Input } from "@/ui/core/Input";

<Input 
  label="Client Name" 
  placeholder="e.g. Acme Corporation" 
  error={errors.clientName} 
  required 
/>
```

- **Height:** Uniform `h-10` across all text inputs, email inputs, number inputs, and `<select>` dropdowns.
- **Borders & Focus:** `border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 focus:outline-hidden`.
- **Validation:** Clear `text-xs text-rose-600 mt-1` inline error messages with `border-rose-400` border highlighting.

### 5.3 Data Tables (`@/ui/core/Table`)
```tsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/ui/core/Table";

<div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
  <Table>
    <TableHeader className="bg-slate-50">
      <TableRow>
        <TableHead>Invoice #</TableHead>
        <TableHead>Client</TableHead>
        <TableHead className="text-right">Amount</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {rows.map((row) => (
        <TableRow key={row.id} className="hover:bg-slate-50/75 transition-colors">
          <TableCell className="font-semibold text-slate-900">{row.number}</TableCell>
          <TableCell>{row.clientName}</TableCell>
          <TableCell className="text-right font-medium tabular-nums">{row.formattedAmount}</TableCell>
          <TableCell><StatusBadge status={row.status} /></TableCell>
          <TableCell className="text-right">
            {/* Direct accessible action icons */}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</div>
```

- **Header Styling:** `bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 px-4`.
- **Cell Density:** `py-3 px-4 text-sm text-slate-700` with subtle dividers (`divide-y divide-slate-200`).
- **Responsive Overflow:** Always enclosed in a `<div className="overflow-x-auto">` wrapper with standard horizontal scroll support on small screens.

### 5.4 Modal Dialogs (`@/ui/core/Modal`)
```tsx
import { Modal } from "@/ui/core/Modal";

<Modal 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)} 
  title="Create Purchase Order"
  description="Specify supplier information and line items."
  size="lg"
>
  {/* Form Content */}
</Modal>
```

- **Backdrop:** Semi-transparent high-contrast overlay `bg-slate-900/60 backdrop-blur-xs`.
- **Corner Radius:** `rounded-2xl` with `shadow-xl`.
- **Accessibility:** Automatically mounts with `role="dialog"`, `aria-modal="true"`, traps focus, and listens for the `Escape` keyboard shortcut to dismiss.

### 5.5 Status Badges (`@/features/billing/components/StatusBadge`)
Universal status badge mapping used across Invoices, Quotations, Purchase Orders, Payments, and Customer accounts:

| Status Code | Label | Color Token Styling |
| :--- | :--- | :--- |
| `PAID`, `ACCEPTED`, `RECEIVED`, `ACTIVE` | Paid / Accepted / Received / Active | `bg-emerald-50 text-emerald-700 border-emerald-200` |
| `SENT`, `CONVERTED`, `ORDERED` | Sent / Converted / Ordered | `bg-blue-50 text-blue-700 border-blue-200` |
| `PARTIAL` | Partial | `bg-amber-50 text-amber-700 border-amber-200` |
| `OVERDUE`, `REJECTED` | Overdue / Rejected | `bg-rose-50 text-rose-700 border-rose-200` |
| `DRAFT`, `CANCELLED`, `INACTIVE` | Draft / Cancelled / Inactive | `bg-slate-100 text-slate-700 border-slate-200` |

---

## 6. Responsive Breakpoint Strategy

JezzyERP is designed and verified across the full spectrum of responsive viewports:

| Viewport | Breakpoint | Target Devices | Layout Adaptations |
| :--- | :--- | :--- | :--- |
| **320px – 375px** | `< sm` | iPhone SE, small Android | Single-column stack, mobile drawer sidebar, compact header icons, horizontal scroll for tables. |
| **390px – 430px** | `< sm` | Modern iPhones, Pixel devices | Full-width inputs, sticky mobile action bars, compact search icon. |
| **768px** | `md` | iPads, Android tablets | 2-column metric cards, expanded filter toolbars, simplified table columns. |
| **1024px** | `lg` | iPad Pro, Small laptops | Collapsible left navigation bar visible, 3-to-4 column metric layouts, complete tables displayed. |
| **1280px – 1440px** | `xl` | Standard laptops & desktops | Full desktop multi-column workspace, secondary contextual panels. |
| **1920px** | `2xl` | Ultra-wide external monitors | Centered container maximum widths (`max-w-7xl`) preventing unreadable ultra-wide text spans. |

---

## 7. Accessibility (A11y) Checkpoints

1. **Contrast Ratio:** All primary text (`text-slate-900`) achieves ≥ 11:1 against white backgrounds; secondary text (`text-slate-500`) achieves ≥ 4.6:1, exceeding WCAG AA requirements (4.5:1).
2. **Interactive Elements:**
   - Icon-only buttons must contain `<span className="sr-only">Label</span>` or `aria-label="Description"`.
   - Modals and popovers bind native `keydown` listeners for the `Escape` key.
   - All interactive rows (such as table action buttons) are visible without requiring hover states, ensuring complete functionality on touch-only devices.
3. **Focus States:** Every button, input, anchor tag, and selectable item has a clear, high-contrast keyboard focus indicator (`focus-visible:ring-2 focus-visible:ring-slate-900/20`).

---

## 8. Anti-Patterns to Avoid

- **DO NOT** use arbitrary tailwind classes like `rounded-[2.5rem]` or `rounded-4xl` for standard cards or modals.
- **DO NOT** hide primary action buttons behind `group-hover:opacity-100` on tables; touch screens have no hover cursor.
- **DO NOT** hardcode non-existent CSS utility classes (e.g. `clay-card`, `clay-input`).
- **DO NOT** introduce pseudo-futuristic nomenclature; stick strictly to established commercial accounting terms.
- **DO NOT** output Prisma `Decimal` instances directly into React children without calling `.toNumber()` or wrapping in `formatCurrency()`.
- **DO NOT** pass `title` attributes directly to Lucide icon components in React 19; wrap the icon in a `<span>` element with the `title` attribute instead.
