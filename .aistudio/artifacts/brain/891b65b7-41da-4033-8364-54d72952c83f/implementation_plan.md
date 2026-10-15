# Basic Static Website Plan (₹799) Integration

Add a transparent, budget-friendly "Basic Static Website" plan priced at ₹799 to Samson Web Development. This plan provides small local businesses and professionals with an online digital pamphlet to display information, photos, and contact links, while explicitly outlining technical limitations and domain/hosting details. All existing plans, prices, colors, and features remain completely untouched, with zero ₹500 references.

## User Review & Critical Decisions

> [!IMPORTANT]
> The clarifying questions were dismissed without choices, so we are proceeding with user-centric, non-destructive defaults:
> - **Positioning**: Added as the first entry (**Starter Plan** or **Basic Static Website**) positioned before Plan 1 in a responsive 4-card grid (1 col on mobile, 2 cols on tablet, 4 cols on desktop), maintaining logical price progression: ₹799 → ₹1,000–₹3,000 → ₹3,000–₹5,000 → ₹5,000–₹8,000.
> - **Transparent Limitations Presentation**: Outlined in a dedicated, clearly styled "Plan Limitations & Notes" sub-block inside the card with warning/neutral indicators, ensuring visitors have full clarity that domain/hosting, backend/database, and post-delivery maintenance are not included.
> - **Create Your Website Modal**: When a customer clicks "Choose This Plan", the enquiry modal selects the ₹799 plan, auto-checks static-compatible features (Gallery, Contact Form, WhatsApp, Google Maps), and displays a note explaining that advanced dynamic modules (cart, payments, login) require Plan 2 or Plan 3.
> - **Existing Plans & Integrity**: Plan 1, Plan 2, and Plan 3 retain their exact pricing, features, and support windows. No ₹500 plan exists anywhere.

---

## 1. Overview & Core Concept

- **What It Does**: Introduces a dedicated ₹799 entry-tier plan tailored for business owners who need a clean, single-page or simple multi-section online presence without dynamic backends, carts, or ongoing maintenance overhead.
- **Target Audience / Persona**: Local shops, salons, tuition teachers, home bakers, freelancers, and small tradespeople seeking an affordable digital brochure to share on WhatsApp, Google Maps, and social media.
- **Key Value**: Low barrier to entry (₹799) with full transparency on inclusions, exclusions, and domain/hosting expectations.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Browsing Pricing**: The visitor scrolls to the `#pricing` section and views four distinct cards:
   - **Basic Static Website (₹799)** &mdash; Starter digital pamphlet.
   - **Plan 1: Basic Business Website (₹1,000 – ₹3,000)** &mdash; Standard business presence.
   - **Plan 2: Professional Business Website (₹3,000 – ₹5,000)** &mdash; Popular full package with 14 days support.
   - **Plan 3: Advanced Business Website (₹5,000 – ₹8,000)** &mdash; Dynamic systems and payment integration.
2. **Reviewing Inclusions & Limitations**: On the ₹799 card, the user sees:
   - Price tag: **₹799** (one-time project fee)
   - Badge: **Digital Pamphlet** / **No Backend**
   - Included features: Business name/logo, About & services display, photo gallery, 1-tap WhatsApp and email links, responsive mobile layout.
   - Clear limitations block: No database/auth, no cart/payment gateway, 0 days free post-delivery maintenance (subsequent fixes at standard ₹199/task), domain & hosting billed separately.
3. **Plan Action (Enquiry)**:
   - Clicking **"Choose This Plan"** opens the `CreateWebsiteModal` with "Basic Static Website (₹799)" pre-selected.
   - Clicking **"Discuss on WhatsApp"** directly opens a pre-composed WhatsApp chat with Samarth Zende (+91 8605042855) specifying: *"Hello Samarth, I am interested in the Basic Static Website (₹799) plan for my business."*
4. **Submitting the Enquiry Form**:
   - The customer enters their name, business name, phone, email, and preferred contact method.
   - When submitted, the system saves the enquiry to Firestore (`project_enquiries`), opens WhatsApp with all prefilled details (including the ₹799 plan name, price, selected features, and customer requirements), and sends the notification to the business Gmail.
5. **Language Switching**: Full translations for the new plan name, description, features, and limitations in English, Hindi (हिंदी), and Marathi (मराठी).

### Visual Styling & Theme Consistency
- **Card Background**: Deep navy container (`#0b1220`) matching existing unfeatured cards, with subtle border (`#1d2a3e`) and cyan accents (`#59e3ff`, `#3da9fc`).
- **Typography & Spacing**: Uncompromised font styling matching the rest of the site (Inter / sans-serif with bold headers).
- **Badge Styling**: High-contrast, clean pill badge (`bg-[#3da9fc]/10 text-[#59e3ff] border-[#3da9fc]/20`).
- **Limitations Styling**: Clean muted list with discrete cross/warning icons (`text-amber-400/80` or `text-[#9db0c8]`) ensuring readability without looking punitive.

---

## 3. Key Product Decisions & Trade-Offs

- **Grid Expansion to 4 Columns**:
  - *Chosen Approach*: Update the pricing grid class from `md:grid-cols-3` to `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` to present all 4 plans side-by-side on wide screens and 2x2 on tablets.
  - *Why*: Allows visitors to compare all options without hidden horizontal scrolling.
- **Explicit Limitations on Card**:
  - *Chosen Approach*: Place a dedicated sub-section labeled "Limitations & Scope" directly under the included features.
  - *Why*: Eliminates customer misunderstandings regarding domain/hosting costs and free support policies before they initiate WhatsApp communication.
- **Enquiry Modal Feature Guardrails**:
  - *Chosen Approach*: When the ₹799 plan is active in `CreateWebsiteModal`, if the user selects complex features (like cart or login), show an inline friendly notice: *"Note: Cart, payments, and user logins are part of Plan 2 / Plan 3. Selecting these will require an upgrade from the ₹799 basic static plan."*
  - *Why*: Prevents scope creep while keeping the interface open and informative.

---

## 4. Technical Architecture & Data Strategy

### System Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Samson Web Development                        │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌────────────────────────┐         ┌───────────────────────────────┐  │
│  │   samzenData.ts        │         │   LanguageContext.tsx         │  │
│  │  - plan-0: ₹799 Static │ ◄─────► │  - EN / HI / MR Translations  │  │
│  │  - plan-1: ₹1k–₹3k     │         │    for name, desc, features,  │  │
│  │  - plan-2: ₹3k–₹5k     │         │    and limitations            │  │
│  │  - plan-3: ₹5k–₹8k     │         └───────────────────────────────┘  │
│  └───────────┬────────────┘                                            │
│              │                                                         │
│              ▼                                                         │
│  ┌────────────────────────┐         ┌───────────────────────────────┐  │
│  │   Pricing.tsx          │         │   CreateWebsiteModal.tsx      │  │
│  │  - 4-Column responsive │         │  - ₹799 preselection & sync   │  │
│  │    pricing card grid   │ ──────► │  - Scope notice for dynamic   │  │
│  │  - Inclusions & Limits │         │    features                   │  │
│  │  - "Choose This Plan"  │         │  - Form validation            │  │
│  └────────────────────────┘         └───────────────┬───────────────┘  │
│                                                     │                  │
│                                                     ▼                  │
│                             ┌────────────────────────────────────────┐ │
│                             │     Dispatch & Persistence Handlers    │ │
│                             ├────────────────────────────────────────┤ │
│                             │ 1. Firestore: createProjectEnquiry()   │ │
│                             │ 2. WhatsApp: wa.me prefilled message   │ │
│                             │ 3. Email: /api/enquiries → Nodemailer  │ │
│                             └────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Model Updates
1. **`src/types/index.ts`**:
   - Add optional `limitations?: string[]` and `isStaticPamphlet?: boolean` to `PlanItem`.
2. **`src/data/samzenData.ts`**:
   - Add `plan-0` with:
     - `id: 'plan-0'`
     - `num: 'STARTER'`
     - `name: 'Basic Static Website'`
     - `priceRange: '₹799'`
     - `minPrice: 799`
     - `maxPrice: 799`
     - `supportDays: 0` (no free post-delivery maintenance)
     - `description`: Pamphlet-style digital website for business information and contact.
     - `features`: 8 included features from user specification.
     - `limitations`: 7 limitations including no database, no cart, domain/hosting separate.
     - `suitableFor`: Small Shops · Stalls · Freelancers · Local Profiles · Digital Pamphlets.
3. **`src/context/LanguageContext.tsx`**:
   - Add `plan.0.*` keys for English, Hindi, and Marathi translations.
4. **`src/components/Pricing.tsx`**:
   - Render the card with the inclusions and limitations breakdown, support days (0 / Paid support on demand at ₹199), WhatsApp link, and `onSelectPlan('plan-0', 'Basic Static Website')`.
5. **`src/components/CreateWebsiteModal.tsx`**:
   - Include `plan-0` in the plan selection cards and dropdowns.
   - Pre-compose the WhatsApp URL with:
     ```
     Plan: Basic Static Website (₹799)
     Client Name: ...
     Business Name: ...
     Mobile: ...
     Email: ...
     Website Type: ...
     Required Features: ...
     Additional Requirements: ...
     Preferred Contact Method: ...
     ```
   - Ensure the server-side email dispatch (`/api/enquiries`) also sends the complete ₹799 breakdown to the business inbox.

---

## 5. Verification & Testing Checklist

- [ ] `compile_applet` succeeds with 0 build errors.
- [ ] `lint_applet` passes with clean TypeScript diagnostics.
- [ ] Pricing grid displays 4 cards cleanly on desktop and stacks gracefully on mobile.
- [ ] Clicking "Choose This Plan" opens `CreateWebsiteModal` with the ₹799 plan active.
- [ ] Pre-filled WhatsApp message correctly displays `Basic Static Website (₹799)` along with all entered customer details and features.
- [ ] Language toggle seamlessly updates the ₹799 plan text between English, Hindi, and Marathi.
- [ ] Verify that no ₹500 plan exists anywhere in the codebase.
- [ ] Verify existing plans (Plan 1, Plan 2, Plan 3) are completely unaltered.
