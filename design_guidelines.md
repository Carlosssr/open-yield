# OpenYield Design Guidelines

## Design Approach

**Hybrid System Approach**: Drawing from successful DeFi platforms (Aave, Uniswap) combined with Material Design principles for financial clarity. This interface prioritizes data legibility, transaction confidence, and professional trust over visual flair. The design emphasizes clear hierarchy, immediate comprehension of financial status, and zero ambiguity in critical actions.

**Key Design Principles**:
- Clarity over creativity: Financial data must be immediately parsable
- Trust through consistency: Predictable patterns reduce user anxiety
- Progressive disclosure: Complex data revealed contextually
- Status-driven design: Visual feedback for every system state

---

## Typography

**Font Stack**: Inter (via Google Fonts) - exceptional readability for numbers and dense data
- **Display/Headers**: 600 weight, 24px-32px for page titles
- **Section Headers**: 600 weight, 18px-20px 
- **Body/Data**: 400 weight, 14px-16px for general content
- **Numbers/Values**: 500 weight, 16px-18px (tabular-nums for alignment)
- **Small Labels**: 400 weight, 12px-13px for secondary info
- **Monospace**: JetBrains Mono for addresses, transaction hashes (13px, 400 weight)

**Hierarchy Rules**: Use size and weight sparingly. Financial values should be prominent (larger, medium weight). Labels should be subtle but clear. Avoid excessive font size variation.

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **4, 6, 8, 12, 16** for consistent rhythm
- Component padding: p-6 or p-8
- Section spacing: gap-6 or gap-8 for cards
- Page margins: px-4 md:px-8 lg:px-12
- Vertical rhythm: space-y-6 or space-y-8 between major sections

**Grid System**:
- Main content: max-w-7xl mx-auto (1280px container)
- Dashboard cards: 2-column on desktop (grid-cols-2), stack on mobile
- Asset lists: Full-width tables with fixed column proportions
- Sidebars: 280px-320px fixed width for network/asset selectors

**Key Layout Patterns**:
- Header: Fixed top nav with wallet connection, network selector (h-16)
- Dashboard: Two-column cards (Supplied Assets | Borrowed Assets)
- Asset tables: Full-width with sticky headers
- Modals: max-w-md centered, with distinct header/body/footer sections

---

## Component Library

### Navigation & Global
- **Top Navigation Bar**: Fixed header with logo, network selector dropdown, wallet connection button. Height: h-16. Clean separation with subtle border.
- **Network Selector**: Dropdown showing current chain with network icon. List displays all 4 chains (Ethereum, Arbitrum, Optimism, Base) with chain icons and names.
- **Wallet Connect Button**: Shows truncated address when connected (0x1234...5678), full button when disconnected. Includes connection status indicator.

### Dashboard Cards
- **Summary Cards**: Rounded corners (rounded-lg), shadow-sm elevation. Display key metrics (Total Supplied, Total Borrowed, Net APY, Health Factor) with large numbers and small labels. Use grid of 2-4 cards depending on viewport.
- **Portfolio Overview**: Dual-column layout showing Supplied Assets and Borrowed Assets side-by-side. Each column contains asset rows with icons, amounts, and APY.

### Data Display
- **Asset Tables**: Clean rows with alternating subtle backgrounds. Columns: Asset (icon + name), Your Supply/Borrow, APY, Action buttons. Fixed column widths for alignment. Sticky headers on scroll.
- **Asset Rows**: Icon (24px-32px), asset symbol (bold), full name (lighter), numeric values (tabular alignment), percentage badges for APY.
- **Health Factor Indicator**: Horizontal bar or dial (120px-160px wide). Numeric value displayed prominently. Color-coding zones without specifying colors. Show "Safe" / "At Risk" / "Danger" labels. Include liquidation threshold marker at 1.0.

### Forms & Input
- **Amount Input**: Large numeric input field with max button to right. Display wallet balance below input. Show calculated result (APY, health factor change) as user types.
- **Input Slider**: Optional slider below text input for visual amount selection. Marks at 25%, 50%, 75%, 100%.
- **Asset Selector**: Dropdown with asset icons, symbols, and full names. Searchable for convenience. Shows balance if applicable.

### Transaction Modals
- **Structure**: Fixed dimensions (max-w-md), centered overlay with backdrop. Three sections: Header (title + close button), Body (transaction details), Footer (cancel + confirm buttons).
- **Content States**: 
  - Initial: Transaction summary with amounts, fees, impact preview
  - Signing: "Waiting for signature" with wallet icon animation
  - Pending: "Transaction submitted" with hash and explorer link
  - Success: Checkmark icon with confirmation message
  - Error: Error icon with message and retry option
- **Transaction Details**: Line-item breakdown (Amount, Asset, Network, Estimated Gas, Health Factor Change). Each item uses label-value pairs with clear spacing.

### Buttons & Actions
- **Primary Actions**: Medium-large size (h-10 to h-12), full-width or auto-width as appropriate. Text: 14px-16px, 500 weight. Used for "Supply", "Borrow", "Confirm".
- **Secondary Actions**: Smaller (h-9), outline or ghost style. Used for "Cancel", "View Details".
- **Icon Buttons**: Square (h-9 w-9), minimal style. Used for close modals, copy addresses.
- **Danger Actions**: Distinct treatment for "Withdraw" and "Repay" when health factor at risk.

### Status Indicators
- **Badges**: Small pill shapes (px-2 py-1, text-xs) for APY percentages, collateral status, network labels.
- **Connection Status**: Dot indicator (h-2 w-2 rounded-full) next to wallet address showing connection state.
- **Loading States**: Skeleton screens for data tables. Spinner for transaction pending. Pulse animation for refreshing data.

### Alerts & Warnings
- **Warning Banners**: Full-width bars (p-4) at top of sections when health factor is risky. Include icon, message, and optional action button.
- **Inline Warnings**: Appear below input fields when user action would create unsafe conditions. Icon + concise message.
- **Success Messages**: Toast notifications (fixed bottom-right, auto-dismiss) for completed transactions.

### Charts & Visualizations
- **Health Factor Gauge**: Semi-circular or horizontal bar visualization with clear markers. Numeric value centered or adjacent. Include threshold indicators.
- **APY Display**: Percentage shown with trending arrow (up/down). Optional sparkline for historical context (subtle, secondary).

---

## Images

**No Hero Images**: This is a financial application - lead directly with dashboard data and wallet connection prompt. No marketing imagery needed.

**Asset Icons**: Use token logos (24px-32px) from established libraries (e.g., Trust Wallet assets). Never custom generate these.

**Network Icons**: Chain-specific logos (Ethereum, Arbitrum, Optimism, Base) at 20px-24px for selectors and indicators.

**Illustrations**: If used, minimal abstract shapes or geometric patterns for empty states only ("No borrowed assets yet"). Keep extremely subtle and professional.

---

## Animation Guidelines

**Minimal Motion**: Use animation sparingly and only for:
- Loading states: Gentle pulse on skeleton screens
- Transaction progress: Smooth state transitions in modals
- Health factor changes: Subtle number count-up when values update
- Hover feedback: Slight scale (1.02) on clickable cards

**Avoid**: Scroll-triggered animations, decorative motion, parallax effects. Every animation must serve a functional purpose (indicating loading, confirming action, showing state change).

---

## Accessibility

- All interactive elements maintain 44px minimum touch target
- Form inputs include visible labels and error states
- Health factor visualization includes both visual and numeric representations
- Transaction modals announce state changes for screen readers
- Keyboard navigation supported throughout with visible focus states