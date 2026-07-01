import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import heroImage from './assets/hero.jpg'

/**
 * Dennis Coffee Garden — Home of Sulu Coffee
 * ---------------------------------------------------------------------------
 * Faithful React + TypeScript + Tailwind CSS port of the original static
 * markup. Design tokens (color, spacing, type scale, radii) live in
 * `tailwind.config.ts` under `theme.extend`, so class names below map 1:1
 * to the source (e.g. `bg-primary`, `text-headline-md`, `font-display-lg`).
 *
 * Responsive strategy: mobile-first. Base classes target phones; `sm:`
 * (≥640px) targets large phones/small tablets; `md:` (≥768px) targets
 * tablets/small laptops; `lg:` (≥1024px) targets desktop.
 *
 * Mobile-fit notes:
 *  - Hero uses `min-h-[100svh]` (small viewport height, which accounts for
 *    mobile browser chrome collapsing/expanding) with a flex-centered
 *    content column, plus a mobile-only compact type scale, a shorter
 *    hero image, and a stats row that's hidden below `sm:` — this keeps the
 *    whole hero within one phone screen on common device sizes without
 *    relying on the user to scroll to see the CTAs.
 *  - Footer uses a stacked, centered layout with a single wrapped nav row
 *    and small type below `sm:`, so the whole footer fits one phone screen
 *    without its own internal scroll.
 *  - Menu items are organized into a horizontally-scrollable tab bar by
 *    category instead of one long stacked list, so browsing the full menu
 *    on a phone doesn't require an extremely long scroll.
 *
 * Requires in index.html <head>:
 *  <link rel="preconnect" href="https://fonts.googleapis.com" />
 *  <link href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:wght@400;600;700&family=Manrope:wght@300;400;600;800&display=swap" rel="stylesheet" />
 *  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
 *
 * Menu data reflects the FoodPanda listing (dennis-coffee-garden-baliwasan)
 * as of July 2026, cross-referenced with the site's dine-in categories.
 * Prices are intentionally omitted (they drift out of date fast); the
 * "Order on foodpanda" links point people to the live, accurate pricing.
 */

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface NavItem {
  label: string
  href: string
  icon: string
}

interface Branch {
  name: string
  address: string
  phoneDisplay: string
  phoneHref: string
}

interface MenuItem {
  name: string
  icon?: string
  serving?: string
  description?: string
  popular?: boolean
  featured?: boolean
}

interface MenuCategory {
  id: string
  title: string
  subtitle?: string
  items: MenuItem[]
}

interface SocialLink {
  label: string
  href: string
  icon: (props: { className?: string }) => React.JSX.Element
}

// -----------------------------------------------------------------------------
// Static content
// -----------------------------------------------------------------------------

const NAV_ITEMS: NavItem[] = [
  { label: 'Heritage', href: '#story', icon: 'history_edu' },
  { label: 'Our Story', href: '#story', icon: 'menu_book' },
  { label: 'Menu', href: '#menu', icon: 'coffee' },
  { label: 'Locations', href: '#contact', icon: 'location_on' },
  { label: 'Contact', href: '#contact', icon: 'call' },
]

// Menu data cross-referenced against the FoodPanda listing for Dennis
// Coffee Garden - Baliwasan. Grouped to match a tabbed browsing experience.
const MENU_CATEGORIES: MenuCategory[] = [
  {
    id: 'hot-beverages',
    title: 'Hot Beverages',
    subtitle: 'Kahawa Sug',
    items: [
      { name: 'Kahawa Sug', icon: 'coffee', serving: '8oz', description: 'Freshly brewed native Sulu coffee', popular: true },
      { name: 'Tea', icon: 'local_cafe' },
      { name: 'Hot Calamansi', icon: 'eco' },
    ],
  },
  {
    id: 'iced-beverages',
    title: 'Iced Beverages',
    subtitle: '16oz',
    items: [
      { name: 'Iced Coffee', description: 'Freshly brewed coffee shaken with ice', popular: true },
      { name: 'Iced Chocolate', description: 'Iced chocolate drink' },
      { name: 'Cranberry Iced Tea' },
      { name: 'Fresh Calamansi Juice', description: 'Tangy, thirst-quenching Filipino-style lemonade' },
      { name: 'Fresh Mango Shake' },
    ],
  },
  {
    id: 'beverages',
    title: 'Beverages',
    items: [
      { name: 'Bottled Water', serving: '500ml' },
      { name: 'Coke', serving: 'Canned' },
      { name: 'Coke Zero', serving: 'Canned' },
      { name: 'Royal', serving: 'Canned' },
      { name: 'Sprite', serving: 'Canned' },
    ],
  },
  {
    id: 'bangbang-sug',
    title: 'Bang Bang Sug',
    subtitle: 'Snacks',
    items: [
      { name: 'Jualan Saging', serving: '5 slices', description: 'Deep-fried bananas served with sweet coco dip', popular: true },
      { name: 'Daral', serving: '2 pcs', description: 'Moisture-rich crepe with sweet coconut filling', popular: true },
      { name: 'Wadjit', serving: '2 pcs', description: 'Purple glutinous rice cooked in pure coconut milk', popular: true },
      { name: 'Pangih-Pangih', serving: '2 pcs', description: 'Soft and chewy flour rings' },
      { name: 'Biyaki', serving: '2 pcs', description: 'Steamed grated sweet corn wrapped in corn husks' },
      { name: 'Jualan Panggih', serving: '6 slices', description: 'Deep-fried sweet potato served with sweet coco dip', popular: true },
      { name: 'Pitis', serving: '2 pcs', description: 'Glutinous rice with sweet coconut filling' },
      { name: 'Patulakan', serving: '2 pcs', description: 'Rice flour with coconut milk and grated coconut' },
    ],
  },
  {
    id: 'hot-spicy',
    title: 'Hot & Spicy',
    items: [
      { name: 'Pastil', serving: '3 pcs', description: 'Hand pies with togue, served with sweet and spicy sauce' },
      { name: 'Satti Ayam', description: 'Grilled chicken strips and cubed rice in a bowl, poured with sweet and spicy sauce' },
    ],
  },
  {
    id: 'viands',
    title: 'Viands',
    subtitle: 'Good for 3–4 pax',
    items: [
      { name: 'Beef Kulma Viand', description: 'Beef cubes in curry paste' },
      { name: 'Chicken Pianggang Viand', description: 'Chicken pieces marinated in roasted coconut and spices' },
      { name: 'Tiula Itum Viand', description: 'Beef in broth of roasted coconut and spices' },
      { name: 'Chicken Kiyaliya Viand', description: 'Turmeric-marinated chicken, cooked with toasted coconut meat' },
      { name: 'Utak-Utak Viand', description: 'Fried fish cake' },
    ],
  },
  {
    id: 'rice-meals',
    title: 'Rice Meals',
    items: [
      { name: 'Beef Kulma Rice Meal', description: 'Beef cubes in curry paste' },
      { name: 'Chicken Pianggang Rice Meal', description: 'Chicken pieces marinated in roasted coconut and spices' },
      { name: 'Tiula Itum Rice Meal', description: 'Beef in broth of roasted coconut and spices' },
      { name: 'Chicken Kiyaliya Rice Meal', description: 'Turmeric-marinated chicken, cooked with toasted coconut meat' },
      { name: 'Utak-Utak Rice Meal', description: 'Fried fish cake' },
      {
        name: 'Dulang Platter',
        serving: 'Good for a group of 5',
        description:
          'Tiula Itum, Utak-Utak, Beef Kulma, Chicken Kiyaliya, Kangkong in Kulma Sauce, and Maras with Sambal, served with rice.',
        featured: true,
      },
    ],
  },
  {
    id: 'extras',
    title: 'Extras',
    items: [
      { name: 'Rice', serving: 'Per scoop' },
      { name: 'Milk', serving: 'For coffee' },
      { name: 'Haleya', description: 'Coco dip' },
      { name: 'Satti Sticks', serving: '4 sticks', description: 'Grilled chicken strips only' },
    ],
  },
]

const BRANCHES: Branch[] = [
  {
    name: 'Baliwasan Branch',
    address: 'San Jose Road, Baliwasan, Zamboanga City',
    phoneDisplay: '+63 966 713 3705',
    phoneHref: 'tel:+639667133705',
  },
  {
    name: 'KCC Branch',
    address: '2nd Floor, KCC Mall de Zamboanga',
    phoneDisplay: '+63 995 820 6642',
    phoneHref: 'tel:+639958206642',
  },
  {
    name: 'Yubenco Tetuan',
    address: 'Phase III, Yubenco Tetuan, Zamboanga City',
    phoneDisplay: '+63 966 403 5334',
    phoneHref: 'tel:+639664035334',
  },
]

const STORE_HOURS = 'Open daily, 9:30 AM – 10:00 PM'

const LOGO_SRC =
  'https://lh3.googleusercontent.com/aida/AP1WRLtrG1GjIsscpK929K7g3gp28JKb0BauTNC3Y2V-BIejdXYkRLwDJYuup38eMHyJFaGT-usnIDXRom7065fiIgk-b_fTz8jdjvrvHwV30wuK1UXqJ8LeVdqfaatVTpeH00cjywjmSI-R3LFbCFWqy7VJz8d_Ochi4qPphNYPug_iaF98FRVQshv1izBwhiC35JIE2XJOnOXdnYBZF8tjw-7w_TLnQc76ZhcT9qT8WAWL3p4Oyw2hum-tAg'

const HERO_IMAGE_SRC = heroImage

const STORY_IMAGE_1_SRC =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDxsRotHAJQCCe5ei7bP6NCaG9_f0zeupr0618kIj26YTwDxOWfkjyTrxmcmfv-fqvVbCqOZ_lnioXD9KIFGnU47V4I3JYqtqfkA-XBwlyKUo-lUh6Bq09ZMlQwzPilgWQO5Cyn_QyuKrQHP-BtVIshpV0Ci82t1dlStcn79TCOJUZGhk7AGPP3-IH4-rKHBe9cclv8kMNofIT5Vaox8f1Sl3QU1JRc3VtW6il8V5_xZgs1zzSjhGgzj17RADbCYzebnN1S8e5DPsg'

const STORY_IMAGE_2_SRC =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDytfJ98E3NnOmw38k8w37WpgtqXOBewqs7EU1ZojJhwrS5nhwu26DX_R4pPxeBTrfXFMd98c_6-JhpNQdFNPmp3VpN4XJXYszMnNqK7Aj7ue2miKK9dcwdcaNVC3dQCSyorSkmqwyl857ueXAusqV0ss5PEVdk6rgVXLhtW_0404Hx3mzbEUcx2KFkqhynZTdnk041nVNOImTSl7ig-mCtRCppo6dGV5-pozXkZuoEmps8o5U3yXmSfNkxpuWRo2opZH-fwrwU03A'

const MAP_ADDRESS_QUERY = 'Dennis Coffee Garden, San Jose Road, Baliwasan, Zamboanga City'
const MAP_EMBED_SRC = `https://maps.google.com/maps?q=${encodeURIComponent(MAP_ADDRESS_QUERY)}&t=&z=16&ie=UTF8&iwloc=&output=embed`

const FACEBOOK_URL = 'https://www.facebook.com/denniscoffeegarden'
const INSTAGRAM_URL = 'https://www.instagram.com/denniscoffeegarden/?hl=en'
const FOODPANDA_URL =
  'https://www.foodpanda.ph/restaurant/zwux/dennis-coffee-garden-baliwasan?utm_campaign=google_reserve_place_order_action_CH-SEO_'
const GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_ADDRESS_QUERY)}`

const FacebookIcon: (props: { className?: string }) => React.JSX.Element = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 5.02 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.523 1.492-3.917 3.777-3.917 1.094 0 2.238.197 2.238.197v2.475h-1.26c-1.243 0-1.63.775-1.63 1.57v1.89h2.773l-.443 2.91h-2.33V22c4.78-.756 8.437-4.92 8.437-9.94Z" />
  </svg>
)

const InstagramIcon: (props: { className?: string }) => React.JSX.Element = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
  </svg>
)

const SOCIAL_LINKS: SocialLink[] = [
  { label: 'Facebook', href: FACEBOOK_URL, icon: FacebookIcon },
  { label: 'Instagram', href: INSTAGRAM_URL, icon: InstagramIcon },
]

// -----------------------------------------------------------------------------
// Hooks
// -----------------------------------------------------------------------------

/** Tracks whether an element has scrolled into view, once, for reveal animations. */
function useRevealOnScroll<T extends HTMLElement>(): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return [ref, isVisible]
}

/** Shared wrapper that replicates the `.reveal-on-scroll` fade/slide-up treatment. */
const Reveal: React.FC<{
  children: ReactNode
  delayMs?: number
  className?: string
}> = ({ children, delayMs = 0, className = '' }) => {
  const [ref, isVisible] = useRevealOnScroll<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={`transition-all duration-800 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      } ${className}`}
      style={{ transitionDelay: isVisible ? `${delayMs}ms` : '0ms' }}
    >
      {children}
    </div>
  )
}

// -----------------------------------------------------------------------------
// Header + mobile drawer
// -----------------------------------------------------------------------------

const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => (
  <header className="fixed top-0 left-0 z-50 flex h-16 w-full items-center justify-between border-b border-secondary/10 bg-background/90 px-margin-mobile backdrop-blur-md sm:px-8 md:px-margin-desktop">
    <a href="#" className="flex items-center gap-2" aria-label="Dennis Coffee Garden home">
      <img alt="Dennis Coffee Garden Logo" className="h-8 object-contain sm:h-9" src={LOGO_SRC} />
    </a>

    {/* Mobile / tablet: hamburger triggers drawer */}
    <button
      aria-label="Open navigation menu"
      className="text-primary transition-transform active:scale-95 lg:hidden"
      onClick={onMenuClick}
      type="button"
    >
      <span className="material-symbols-outlined">menu</span>
    </button>

    {/* Desktop: inline nav, no drawer needed */}
    <nav className="hidden items-center gap-8 lg:flex">
      {NAV_ITEMS.map((item) => (
        <a
          key={`${item.label}-${item.href}`}
          className="font-label-md text-label-md text-on-surface-variant transition-colors hover:text-primary"
          href={item.href}
        >
          {item.label}
        </a>
      ))}
      <a
        className="rounded-full bg-primary px-5 py-2 font-label-md text-label-md text-on-primary shadow-sm transition-transform active:scale-95"
        href={FOODPANDA_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        Order Online
      </a>
    </nav>
  </header>
)

const NavDrawer: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  // Close on Escape for keyboard users.
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  return (
    <div className={`fixed inset-0 z-60 lg:hidden ${open ? '' : 'pointer-events-none'}`}>
      <div
        className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-60 flex h-full w-full max-w-80 flex-col bg-surface py-6 shadow-[0_8px_30px_rgb(42,30,22,0.1)] transition-transform duration-300 sm:w-80 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-8 flex items-center justify-between px-6">
          <p className="font-headline-lg-mobile text-headline-lg-mobile text-primary">Since 1962</p>
          <button
            aria-label="Close navigation menu"
            className="text-on-surface-variant transition-transform active:scale-95"
            onClick={onClose}
            type="button"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={`${item.label}-${item.href}`}
              className="mx-2 flex items-center gap-4 rounded-xl px-4 py-3 text-on-surface-variant hover:bg-surface-container-low"
              href={item.href}
              onClick={onClose}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.label}
            </a>
          ))}
          <a
            className="mx-2 mt-2 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-on-primary"
            href={FOODPANDA_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
          >
            <span className="material-symbols-outlined">shopping_bag</span>
            Order Online
          </a>
        </nav>

        <div className="mt-auto flex gap-3 px-6 pt-6">
          {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              aria-label={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-on-primary"
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </div>
      </aside>
    </div>
  )
}

// -----------------------------------------------------------------------------
// Hero
// -----------------------------------------------------------------------------

const Hero: React.FC = () => (
  <section className="relative overflow-hidden bg-heritage-cream px-margin-mobile py-8 sm:px-8 sm:py-20 md:px-margin-desktop md:py-28">
    {/* min-h uses svh (small viewport height) so mobile browser chrome
        doesn't cause the hero to overflow one screen; header is 4rem. */}
    <div className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-container-max flex-col justify-center md:min-h-0 md:grid md:grid-cols-2 md:items-center md:gap-16">
      <div className="mx-auto flex max-w-lg flex-col items-center text-center sm:mx-0 sm:items-start sm:text-left">
        <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 font-label-md text-[11px] font-semibold uppercase tracking-widest text-primary sm:mb-4 sm:bg-transparent sm:px-0 sm:py-0 sm:text-label-md">
          <span className="h-1.5 w-1.5 rounded-full bg-primary sm:hidden" />
          Traditional Kahawa Sug
        </span>

        <h1 className="mb-3 font-display-lg text-[32px] leading-[1.15] text-on-background sm:mb-4 sm:text-5xl sm:leading-tight md:text-6xl">
          A Heritage of Sulu in Every Cup
        </h1>

        <p className="mb-6 font-body-lg text-sm leading-relaxed text-on-surface-variant sm:mb-8 sm:text-body-lg">
          Experience the authentic Kahawa Sug tradition, since 1962. A legacy of flavor harvested from the
          deep volcanic soils of the Sulu Archipelago.
        </p>

        <div className="mb-6 grid w-full grid-cols-2 gap-3 sm:mb-10 sm:flex sm:w-auto sm:gap-4">
          <a
            className="flex items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-3.5 text-center font-label-md text-[13px] font-semibold text-on-primary shadow-lg shadow-primary/25 transition-transform active:scale-95 sm:rounded-lg sm:px-8 sm:py-4 sm:text-label-md"
            href="#story"
          >
            Our Story
            <span className="material-symbols-outlined text-base sm:text-lg">arrow_forward</span>
          </a>
          <a
            className="flex items-center justify-center rounded-full border-2 border-primary bg-white px-4 py-3.5 text-center font-label-md text-[13px] font-semibold text-primary transition-colors hover:bg-primary hover:text-on-primary active:scale-95 sm:rounded-lg sm:px-8 sm:py-4 sm:text-label-md"
            href="#menu"
          >
            View Menu
          </a>
        </div>

        <div className="flex items-center gap-6 sm:gap-10">
          <div>
            <p className="text-2xl font-bold text-primary sm:text-4xl">60+</p>
            <p className="text-[11px] text-on-surface-variant sm:text-caption">Years of Tradition</p>
          </div>
          <div className="h-8 w-px bg-outline-variant/40 sm:h-10" />
          <div>
            <p className="text-2xl font-bold text-primary sm:text-4xl">100%</p>
            <p className="text-[11px] text-on-surface-variant sm:text-caption">Native Coffee</p>
          </div>
        </div>
      </div>

      <div className="relative mt-6 aspect-[4/3] max-h-[24vh] w-full shrink-0 overflow-hidden rounded-2xl shadow-xl sm:mt-12 sm:aspect-video sm:max-h-none sm:rounded-3xl md:mt-0 md:aspect-4/5">
        <img
          alt="A steaming cup of traditional Sulu coffee served on a ceramic saucer."
          className="h-full w-full object-cover"
          src={HERO_IMAGE_SRC}
        />
      </div>
    </div>
  </section>
)

// -----------------------------------------------------------------------------
// Story
// -----------------------------------------------------------------------------

const StorySection: React.FC = () => (
  <section
    className="relative scroll-mt-16 overflow-hidden bg-heritage-cream px-margin-mobile py-16 sm:px-8 sm:py-20 md:px-margin-desktop md:py-24"
    id="story"
  >
    <div className="mx-auto max-w-container-max">
      <Reveal>
        <span className="mb-4 block font-label-md text-label-md tracking-widest text-primary">OUR STORY</span>
        <h2 className="mb-6 font-headline-lg-mobile text-headline-lg-mobile text-on-background md:text-headline-lg">
          What Makes Good Coffee Great?
        </h2>
      </Reveal>

      <div className="space-y-12 md:grid md:grid-cols-2 md:gap-12 md:space-y-0">
        <Reveal delayMs={100} className="flex flex-col gap-6">
          <div className="group relative aspect-video overflow-hidden rounded-2xl shadow-xl">
            <img
              alt="Vintage-toned archival photograph recreation of Omar's Place in Jolo, Sulu from 1962."
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              src={STORY_IMAGE_1_SRC}
            />
          </div>
          <p className="font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
            In 1962, a humble café, <span className="font-semibold text-primary">Omar&rsquo;s Place</span>, sprang to
            life in Jolo, Sulu, serving Kahawa Sug with native Tausug delicacies. It was the fruit of grit and
            determination from a young mother who saw community in every cup.
          </p>
        </Reveal>

        <Reveal delayMs={200} className="flex flex-col gap-6">
          <div className="relative aspect-4/5 overflow-hidden rounded-2xl shadow-xl">
            <img
              alt="A modern portrait of a Tausug woman skillfully preparing traditional Bangbang Sug snacks."
              className="h-full w-full object-cover"
              src={STORY_IMAGE_2_SRC}
            />
            <div className="glass-card absolute bottom-6 left-6 right-6 rounded-xl bg-white/70 p-6 backdrop-blur-md">
              <p className="font-headline-md italic text-primary">
                &ldquo;Good coffee is made great by an inspiring story behind it.&rdquo;
              </p>
            </div>
          </div>
          <p className="font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
            Today, Dennis Coffee Garden continues this vision&mdash;reviving fading traditions and preserving
            heirloom delicacies to empower farmers and women in the region.
          </p>
        </Reveal>
      </div>
    </div>
  </section>
)

// -----------------------------------------------------------------------------
// Menu
// -----------------------------------------------------------------------------

/** Horizontally scrollable pill tab bar for switching between menu categories. */
const MenuTabBar: React.FC<{
  categories: MenuCategory[]
  activeId: string
  onSelect: (id: string) => void
}> = ({ categories, activeId, onSelect }) => (
  <div
    className="mb-8 flex snap-x gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden"
    role="tablist"
    aria-label="Menu categories"
  >
    {categories.map((category) => {
      const isActive = category.id === activeId
      return (
        <button
          key={category.id}
          role="tab"
          aria-selected={isActive}
          type="button"
          onClick={() => onSelect(category.id)}
          className={`shrink-0 snap-start rounded-full border px-4 py-2 font-label-md text-sm transition-colors ${
            isActive
              ? 'border-primary bg-primary text-on-primary'
              : 'border-outline-variant/40 bg-surface-container-lowest text-on-surface-variant hover:border-primary/40 hover:text-primary'
          }`}
        >
          {category.title}
        </button>
      )
    })}
  </div>
)

/** Card used inside every menu category grid. */
const MenuItemCard: React.FC<{ item: MenuItem }> = ({ item }) => {
  if (item.featured) {
    return (
      <div className="col-span-full flex flex-col justify-between gap-4 rounded-3xl bg-primary p-6 text-on-primary sm:flex-row sm:items-center sm:p-8">
        <div>
          <span className="mb-2 inline-block rounded bg-on-primary/15 px-2 py-1 text-caption font-bold uppercase tracking-wider">
            Feast Platter
          </span>
          <h4 className="mb-2 font-headline-md">{item.name}</h4>
          <p className="text-body-md opacity-90 sm:max-w-md">{item.description}</p>
        </div>
        {item.serving && (
          <span className="inline-block shrink-0 self-start rounded-full bg-on-primary/10 px-4 py-2 text-caption font-bold sm:self-center">
            {item.serving}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="relative flex flex-col justify-between rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 transition-colors hover:border-primary/30 hover:bg-surface-container-low">
      {item.popular && (
        <span className="absolute right-4 top-4 rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
          Popular
        </span>
      )}
      <div className="pr-16">
        {item.icon && <span className="material-symbols-outlined mb-2 block text-primary">{item.icon}</span>}
        <h4 className="font-headline-md text-base text-on-surface">{item.name}</h4>
        {item.serving && <p className="mt-0.5 text-[11px] uppercase tracking-wide text-outline">{item.serving}</p>}
        {item.description && <p className="mt-1 text-caption text-on-surface-variant">{item.description}</p>}
      </div>
    </div>
  )
}

const MenuSection: React.FC = () => {
  const [activeCategoryId, setActiveCategoryId] = useState(MENU_CATEGORIES[0].id)
  const activeCategory = MENU_CATEGORIES.find((category) => category.id === activeCategoryId) ?? MENU_CATEGORIES[0]

  return (
    <section
      className="scroll-mt-16 bg-white px-margin-mobile py-16 sm:px-8 sm:py-20 md:px-margin-desktop md:py-24"
      id="menu"
    >
      <div className="mx-auto max-w-container-max">
        <Reveal className="mb-12 text-center">
          <h2 className="mb-2 font-headline-lg-mobile text-headline-lg-mobile text-primary md:text-headline-lg">
            Our Offerings
          </h2>
          <div className="mx-auto mb-6 h-1 w-16 rounded-full bg-primary/20" />
          <a
            className="inline-flex items-center gap-2 rounded-full border-2 border-primary px-6 py-3 font-label-md text-label-md text-primary transition-colors hover:bg-primary hover:text-on-primary"
            href={FOODPANDA_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="material-symbols-outlined text-lg">delivery_dining</span>
            Order on foodpanda
          </a>
        </Reveal>

        <MenuTabBar categories={MENU_CATEGORIES} activeId={activeCategoryId} onSelect={setActiveCategoryId} />

        <div className="mb-2 flex items-baseline justify-between gap-4 border-b border-secondary/10 pb-2">
          <h3 className="font-label-md text-label-md uppercase tracking-[0.2em] text-secondary">
            {activeCategory.title}
          </h3>
          {activeCategory.subtitle && (
            <span className="whitespace-nowrap text-caption text-outline">{activeCategory.subtitle}</span>
          )}
        </div>

        <div key={activeCategory.id} className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-3">
          {activeCategory.items.map((item) => (
            <MenuItemCard key={item.name} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}

// -----------------------------------------------------------------------------
// Contact / branches
// -----------------------------------------------------------------------------

const BranchCard: React.FC<{ branch: Branch }> = ({ branch }) => (
  <div className="rounded-2xl border border-secondary/10 bg-white p-6 shadow-sm">
    <h4 className="mb-2 font-headline-md text-primary">{branch.name}</h4>
    <p className="mb-2 flex items-start gap-2 text-body-md text-on-surface-variant">
      <span className="material-symbols-outlined pt-1 text-sm">location_on</span>
      {branch.address}
    </p>
    <p className="mb-4 flex items-start gap-2 text-caption text-on-surface-variant">
      <span className="material-symbols-outlined pt-0.5 text-sm">schedule</span>
      {STORE_HOURS}
    </p>
    <a className="flex items-center gap-2 font-label-md text-primary" href={branch.phoneHref}>
      <span className="material-symbols-outlined">call</span> {branch.phoneDisplay}
    </a>
  </div>
)

const ContactSection: React.FC = () => (
  <section
    className="scroll-mt-16 bg-surface-container px-margin-mobile py-16 sm:px-8 sm:py-20 md:px-margin-desktop md:py-24"
    id="contact"
  >
    <div className="mx-auto max-w-container-max">
      <Reveal className="mb-12">
        <span className="mb-4 block font-label-md text-label-md tracking-widest text-primary">VISIT US</span>
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-background md:text-headline-lg">
          Our Branches
        </h2>
      </Reveal>

      <div className="md:grid md:grid-cols-5 md:gap-8">
        <Reveal className="space-y-6 md:col-span-2">
          {BRANCHES.map((branch) => (
            <BranchCard key={branch.name} branch={branch} />
          ))}
        </Reveal>

        <Reveal className="relative mt-12 h-64 overflow-hidden rounded-3xl border-4 border-white shadow-lg md:col-span-3 md:mt-0 md:h-full md:min-h-80">
          <iframe
            title="Dennis Coffee Garden location on Google Maps"
            src={MAP_EMBED_SRC}
            className="h-full w-full grayscale-[15%] transition-[filter] duration-300 hover:grayscale-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Dennis Coffee Garden in Google Maps"
            className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-white px-4 py-2 font-label-md text-caption font-semibold text-primary shadow-md transition-transform hover:scale-105 active:scale-95"
          >
            <span className="material-symbols-outlined text-base">open_in_new</span>
            Get Directions
          </a>
        </Reveal>
      </div>
    </div>
  </section>
)

// -----------------------------------------------------------------------------
// Footer
// -----------------------------------------------------------------------------

const Footer: React.FC = () => (
  <footer className="w-full rounded-t-3xl bg-surface-container-low px-margin-mobile py-6 sm:px-8 sm:py-12 md:px-margin-desktop">
    <div className="mx-auto max-w-container-max">
      <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-end sm:justify-between sm:gap-8 sm:text-left">
        <div>
          <img alt="Dennis Coffee Garden Logo" className="mx-auto mb-2 h-8 object-contain sm:mx-0 sm:mb-6 sm:h-14" src={LOGO_SRC} />
          <p className="mx-auto line-clamp-2 max-w-xs font-body-lg text-[11px] leading-relaxed text-on-surface-variant sm:mx-0 sm:line-clamp-none sm:max-w-md sm:text-body-lg">
            Preserving the heirloom delicacies of Sulu and empowering our community since 1962.
          </p>
        </div>

        <div className="flex gap-3">
          {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              aria-label={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-on-primary sm:h-10 sm:w-10"
            >
              <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
            </a>
          ))}
        </div>
      </div>

      <nav className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-center sm:mt-10 sm:justify-start sm:text-left">
        <a className="text-[11px] text-on-surface-variant transition-colors hover:text-primary sm:text-body-md" href="#story">
          Our Story
        </a>
        <a className="text-[11px] text-on-surface-variant transition-colors hover:text-primary sm:text-body-md" href="#menu">
          Menu
        </a>
        <a className="text-[11px] text-on-surface-variant transition-colors hover:text-primary sm:text-body-md" href="#contact">
          Contact Us
        </a>
        <a
          className="text-[11px] text-on-surface-variant transition-colors hover:text-primary sm:text-body-md"
          href={FOODPANDA_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          foodpanda
        </a>
        <a
          className="text-[11px] text-on-surface-variant transition-colors hover:text-primary sm:text-body-md"
          href={GOOGLE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Directions
        </a>
      </nav>

      <div className="my-4 h-px w-full bg-outline-variant/30 sm:my-8" />

      <div className="flex flex-col items-center gap-1 text-center sm:flex-row sm:items-center sm:justify-between sm:gap-0 sm:text-left">
        <p className="font-caption text-[10px] text-on-surface-variant sm:text-caption">
          &copy; 1962-2024 Dennis Coffee Garden. All Rights Reserved.
        </p>
        <p className="text-[10px] italic text-secondary sm:text-body-md">Crafted with respect for Tausug tradition.</p>
      </div>
    </div>
  </footer>
)

// -----------------------------------------------------------------------------
// Floating action button
// -----------------------------------------------------------------------------

const Fab: React.FC<{ visible: boolean }> = ({ visible }) => (
  <div
    className={`fixed bottom-6 right-6 z-40 transition-all duration-300 sm:bottom-8 sm:right-8 ${
      visible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
    }`}
  >
    <a
      aria-label="Jump to menu"
      className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-2xl transition-transform active:scale-90"
      href="#menu"
    >
      <span className="material-symbols-outlined">coffee</span>
    </a>
  </div>
)

// -----------------------------------------------------------------------------
// App
// -----------------------------------------------------------------------------

const App: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isFabVisible, setIsFabVisible] = useState(false)

  const openDrawer = useCallback(() => setIsDrawerOpen(true), [])
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), [])

  useEffect(() => {
    const handleScroll = () => setIsFabVisible(window.scrollY > 400)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Smooth-scroll anchor navigation (nav links, hero CTAs, footer links, FAB).
  useEffect(() => {
    const root = document.documentElement
    const previous = root.style.scrollBehavior
    root.style.scrollBehavior = 'smooth'
    return () => {
      root.style.scrollBehavior = previous
    }
  }, [])

  // Close the mobile drawer automatically if the viewport grows past the
  // breakpoint where it's used (e.g. rotating a tablet, resizing a window).
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)')
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) setIsDrawerOpen(false)
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return (
    <div className="overflow-x-hidden bg-background font-body-md text-on-background">
      <Header onMenuClick={openDrawer} />
      <NavDrawer open={isDrawerOpen} onClose={closeDrawer} />

      <main className="pt-16">
        <Hero />
        <StorySection />
        <MenuSection />
        <ContactSection />
      </main>

      <Footer />
      <Fab visible={isFabVisible} />
    </div>
  )
}

export default App