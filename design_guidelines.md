# Kodekernel - SaaS Business Website Design Guidelines

## Design Approach

**Reference-Based Design** drawing inspiration from:
- **Apple**: Premium feel, sophisticated 3D scroll animations, restrained elegance, generous whitespace
- **Codlify**: SaaS/agency aesthetic, modern dark theme implementation, service presentation
- **Linear**: Clean typography, purposeful spacing, professional SaaS polish

**Core Principles**: Premium dark aesthetic, content-first hierarchy, subtle yet impactful animations, professional SaaS credibility

## Color Theme
User-specified dark background theme with professional contrast ratios for readability and modern SaaS aesthetic.

## Typography System

**Font Stack**: 
- Primary: Inter or SF Pro Display (via Google Fonts CDN)
- Monospace: JetBrains Mono for code snippets in blog

**Hierarchy**:
- Hero Headlines: text-6xl lg:text-7xl, font-bold, tracking-tight
- Section Headers: text-4xl lg:text-5xl, font-bold
- Subsections: text-2xl lg:text-3xl, font-semibold
- Body Large: text-lg lg:text-xl, leading-relaxed
- Body Text: text-base, leading-relaxed
- Captions: text-sm, opacity-70

## Layout & Spacing System

**Tailwind Spacing Primitives**: 4, 6, 8, 12, 16, 20, 24, 32
- Component padding: p-6, p-8
- Section spacing: py-20 lg:py-32
- Container gaps: gap-8, gap-12
- Card spacing: p-8 lg:p-12

**Container Strategy**:
- Max-width: max-w-7xl for full sections
- Content max-width: max-w-6xl for text-heavy areas
- Prose content: max-w-prose for blog articles

## Page-Specific Layouts

### Homepage
- **Hero Section**: Full-height (min-h-screen) with 3D animated background element, centered headline + subheadline, dual CTA buttons with backdrop-blur, trust indicator ("Trusted by 50+ businesses")
- **Services Preview**: 3-column grid (lg:grid-cols-3) with icon, title, description cards
- **Portfolio Showcase**: Masonry-style grid displaying 6 website mockups with hover overlay effects
- **Client Testimonials**: 2-column grid with photo, quote, name, company
- **CTA Section**: Full-width with background accent, headline, description, primary button
- **Footer**: 4-column layout (company, services, resources, contact) + newsletter signup

### About Us
- **Hero**: Company story headline with supporting image (team/office)
- **Mission/Vision**: 2-column split layout
- **Team Grid**: 3-4 columns with photos, names, roles, brief bios
- **Values Section**: Icon-based 4-column grid

### Services
- **Services Overview**: Each service gets dedicated section with 2-column layout (description + visual)
- **Portfolio Gallery**: Grid of 9-12 website homepage screenshots in card format with project title, tech stack tags, subtle hover lift effect
- **Process Timeline**: Vertical timeline with numbered steps

### Pricing
- **Pricing Cards**: 3-column grid (responsive to 1-column mobile)
- Card structure: Plan name, price (large text-5xl), feature list with checkmarks, CTA button, "Most Popular" badge for middle tier
- Feature comparison table below cards

### Blog
- **Blog Index**: Featured post (large card) + grid of recent posts (2-column lg:grid-cols-2)
- **Blog Post Card**: Thumbnail image, category tag, title, excerpt, author avatar + name, read time, publish date
- **Single Post**: Hero image, title, metadata bar, prose-formatted content with max-w-prose, author bio card at bottom, related posts section

### Contact Us
- **2-Column Layout**: Contact form (left 60%) + contact info/map placeholder (right 40%)
- Form fields: Name, Email, Service Interest (dropdown), Message (textarea)
- Contact info: Email, phone, office hours, social links

### Testimonials
- **Grid Layout**: 2-column masonry-style with varying card heights
- Card content: 5-star rating, quote, client photo, name, company, project type

### Buy us a Coffee
- **Centered Layout**: Headline, supporting text about supporting the team, donation amount buttons ($5, $10, $25, Custom), PayPal button integration, supporter benefits list

## Component Library

### Navigation
- Fixed header with backdrop-blur
- Logo (left), nav links (center), CTA button (right)
- Mobile: Hamburger menu with slide-in panel

### Cards
- Rounded corners (rounded-xl or rounded-2xl)
- Subtle border with opacity
- Padding: p-8 or p-10
- Hover: Slight lift (transform translate-y-1) with transition

### Buttons
- Primary: Solid background, text-white, px-8 py-4, rounded-full, font-semibold
- Secondary: Border style, transparent background, same padding
- Backdrop-blur for buttons over images/videos

### Form Elements
- Input fields: Full-width, rounded-lg, p-4, border with focus state
- Labels: text-sm, font-medium, mb-2
- Consistent spacing: space-y-6 for form groups

### Icons
- Use Heroicons via CDN
- Size: w-6 h-6 for inline, w-12 h-12 for feature icons

## Animations & Interactions

**3D Scroll Animations** (Apple-style):
- Use Three.js for 3D elements + GSAP ScrollTrigger
- Hero: Rotating 3D geometric shape or abstract mesh that responds to scroll
- Section reveals: Fade-up with slight scale effect (transform: translateY, scale, opacity)
- Parallax: Subtle background element movement at 0.5x scroll speed
- Keep animations smooth (60fps), use will-change sparingly

**Micro-interactions**:
- Button hover: Slight scale (1.05) + shadow increase
- Card hover: Lift effect (-translate-y-2) + shadow
- Link hover: Underline animation from left to right

## Images

**Homepage Hero**: Large abstract/tech-themed background image or video with overlay gradient for text readability

**Services Page Portfolio**: 
- 9-12 website homepage screenshots showcasing diverse design styles
- Each image: aspect-ratio-video, object-cover, rounded-xl
- Dimensions: Consistent 16:9 ratio for uniformity

**About Us**: Team photo (group or individual headshots), office environment

**Blog**: Featured image per post (landscape format), author avatars (circular, 40x40px)

**Testimonials**: Client headshots (circular, 60x60px)

Each image should have proper alt text and loading optimization (lazy loading for below-fold images).

## Accessibility
- Focus states: Visible outline with offset for all interactive elements
- Form validation: Clear error messages with icons
- Semantic HTML structure throughout
- ARIA labels for icon-only buttons
- Sufficient contrast ratios maintained in dark theme