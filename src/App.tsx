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
 * Requires in index.html <head>:
 *  <link rel="preconnect" href="https://fonts.googleapis.com" />
 *  <link href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:wght@400;600;700&family=Manrope:wght@300;400;600;800&display=swap" rel="stylesheet" />
 *  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
 */

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface NavItem {
  label: string
  href: string
  icon: string
}

interface HotBeverage {
  name: string
  icon: string
}

interface RiceMeal {
  name: string
  description: string
  imageSrc: string
  imageAlt: string
}

interface Branch {
  name: string
  address: string
  phoneDisplay: string
  phoneHref: string
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

const HOT_BEVERAGES: HotBeverage[] = [
  { name: 'Kahawa Sug', icon: 'coffee' },
  { name: 'Tea', icon: 'local_cafe' },
  { name: 'Hot Calamansi', icon: 'eco' },
]

const RICE_MEALS: RiceMeal[] = [
  {
    name: 'Beef Kulma',
    description: 'Beef cubes in rich curry paste',
    imageSrc:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBcagC3a_AkWKatJ-5e3JJqVhS9L80KLOEjceNnLrivS600rBej9qfJEm4-eSBV64teQBG6kcrLt3OYZw0qO-2qnu0xg3zhkJ4vocx_DNpbQHo80qcruOOE10ckdDyPhWHZ33BxWIEG7cGPpQqTp2XnIBrzjRf4eDzTmP-iZWpknBKSWx0x5_oyEKtoFxsxV9KmKn64d3zRAS9qeJojOqX3hGTv9wjOo3NPg0mJ4Hebd3KGV2fPPZHnZjhAqYAu4EdISlD7J5HNzKI',
    imageAlt: 'Beef Kulma, a rich beef curry from Sulu, served with steamed white rice on a banana leaf.',
  },
  {
    name: 'Tiulah Sug',
    description: 'Beef in roasted coconut broth',
    imageSrc:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCqrP2Q2GADxlcHj50RnH68oA3jwwXRuhbQv5-j8Ug9sAZ8PHcVmOiPq6iMBUvuu92vYJwjg6urFLqvMdic8NE9fo0CZB_qJP8g8fep6uhMgFDSjHvrsq4aAF8-YfdbSFgsvmy9WhPWTsbXdoaSAQrE2zX2F_csuCIh0By7Tw6eCyuE0EhJgdUcrVNpYZWDcRMx2JKkD2tT1Hu_WLT0Cj8sOEFDZZExxCPgBSoyVI3EjbRrEX_fnJFWYq3SdiGRQOWz81IjgfAUsSU',
    imageAlt: 'Traditional Tiulah Sug, a black beef soup made with burnt coconut, served in a ceramic bowl.',
  },
  {
    name: 'Chicken Pianggang',
    description: 'Marinated in roasted coconut',
    imageSrc:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAQDRk4uiJlQi07HLnloYvIocx0W-RUYg1fYEQcF1HOkufDoxG_0OtjLrGSUp0okH-PhzJeTibrMq2eEmWVJ2rV-hUBzcIocq0EM-p1W7rL1qJdbwth6KKzP0kvptPQ4R_hWHwCe-21UGWp3C735z2_YvrBVDSlZVBgkoaK0RM3auU1jQ34wCyt-0VKN0XCEqlwFnwv-GAa1ypejWfqLB-HJxFZBPB1DyqYBU3WaoZugLJiE-66FPzO1Q6wRM1f555Sd9Q1jRGQyFw',
    imageAlt: 'Chicken Pianggang, grilled chicken marinated in blackened coconut and aromatic spices.',
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

const LOGO_SRC =
  'https://lh3.googleusercontent.com/aida/AP1WRLtrG1GjIsscpK929K7g3gp28JKb0BauTNC3Y2V-BIejdXYkRLwDJYuup38eMHyJFaGT-usnIDXRom7065fiIgk-b_fTz8jdjvrvHwV30wuK1UXqJ8LeVdqfaatVTpeH00cjywjmSI-R3LFbCFWqy7VJz8d_Ochi4qPphNYPug_iaF98FRVQshv1izBwhiC35JIE2XJOnOXdnYBZF8tjw-7w_TLnQc76ZhcT9qT8WAWL3p4Oyw2hum-tAg'

const HERO_IMAGE_SRC = heroImage

const STORY_IMAGE_1_SRC =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDxsRotHAJQCCe5ei7bP6NCaG9_f0zeupr0618kIj26YTwDxOWfkjyTrxmcmfv-fqvVbCqOZ_lnioXD9KIFGnU47V4I3JYqtqfkA-XBwlyKUo-lUh6Bq09ZMlQwzPilgWQO5Cyn_QyuKrQHP-BtVIshpV0Ci82t1dlStcn79TCOJUZGhk7AGPP3-IH4-rKHBe9cclv8kMNofIT5Vaox8f1Sl3QU1JRc3VtW6il8V5_xZgs1zzSjhGgzj17RADbCYzebnN1S8e5DPsg'

const STORY_IMAGE_2_SRC =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDytfJ98E3NnOmw38k8w37WpgtqXOBewqs7EU1ZojJhwrS5nhwu26DX_R4pPxeBTrfXFMd98c_6-JhpNQdFNPmp3VpN4XJXYszMnNqK7Aj7ue2miKK9dcwdcaNVC3dQCSyorSkmqwyl857ueXAusqV0ss5PEVdk6rgVXLhtW_0404Hx3mzbEUcx2KFkqhynZTdnk041nVNOImTSl7ig-mCtRCppo6dGV5-pozXkZuoEmps8o5U3yXmSfNkxpuWRo2opZH-fwrwU03A'

const MAP_IMAGE_SRC =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDgoKOlMx6bF5eWSdGJotKpWWXVkxt0LJokX_0BqYdtzKJxqsA852xpbajWu3-QfaCN59lv4n7qgOAzYh6T8FEhoda8wzxcuXWxW177t2l0wxF5sr6NmD98JhNtIAyiwMxdhYUBvIqug9CPXEJEllosHZ8c9FbgDr68XgbVMX1ajzp7A6u_s7eeA6kS6tnDW4pOUdan9iBXYS3MT8Kt-5FOOpdg7EfopJ8plJQcuG2WSkj2aHNUj_9UWXRWaHths7JINxHoREFEc90'

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
  <header className="fixed top-0 left-0 z-50 flex h-16 w-full items-center justify-between border-b border-secondary/10 bg-background/90 px-margin-mobile backdrop-blur-md">
    <div className="flex items-center gap-2">
      <img alt="Dennis Coffee Garden Logo" className="h-8 object-contain" src={LOGO_SRC} />
    </div>
    <button
      aria-label="Open navigation menu"
      className="text-primary transition-transform active:scale-95"
      onClick={onMenuClick}
      type="button"
    >
      <span className="material-symbols-outlined">menu</span>
    </button>
  </header>
)

const NavDrawer: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => (
  <div className={`fixed inset-0 z-60 ${open ? '' : 'pointer-events-none'}`}>
    <div
      className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
        open ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    />
    <aside
      className={`fixed inset-y-0 left-0 z-60 flex h-full w-80 flex-col bg-surface py-6 shadow-[0_8px_30px_rgb(42,30,22,0.1)] transition-transform duration-300 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="mb-8 px-6">
        <p className="font-headline-lg-mobile text-headline-lg-mobile text-primary">Since 1962</p>
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
      </nav>
    </aside>
  </div>
)

// -----------------------------------------------------------------------------
// Hero
// -----------------------------------------------------------------------------

const Hero: React.FC = () => (
   <section className="relative flex h-[85vh] items-center justify-center overflow-hidden px-margin-mobile">
    <div className="absolute inset-0 z-0">
      <div
        aria-label="Cinematic close-up of dark Sulu coffee being poured into a traditional ceramic cup, steam rising softly, in a warm morning garden setting."
        className="h-full w-full scale-110 bg-cover bg-center transition-transform duration-[10s] hover:scale-100"
        role="img"
        style={{ backgroundImage: `url('${HERO_IMAGE_SRC}')` }}
      />
      <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
    </div>

    <div className="relative z-10 max-w-lg text-center">
      <span className="mb-4 inline-block rounded-full bg-white/90 px-4 py-1.5 font-label-md text-label-md uppercase tracking-widest text-primary shadow-sm backdrop-blur-sm">
        Traditional Kahawa Sug
      </span>
      <h1 className="mb-4 font-display-lg text-display-lg text-on-background">Dennis Coffee Garden</h1>
      <p className="mb-8 font-headline-md text-headline-md italic text-white/90 drop-shadow-md">
        Home of Sulu Coffee since 1962
      </p>
      <div className="flex flex-col gap-4">
        <a
          className="rounded-lg bg-primary px-8 py-4 text-center font-label-md text-label-md text-on-primary shadow-lg shadow-primary/20 transition-transform active:scale-95"
          href="#menu"
        >
          VIEW MENU
        </a>
<a
  className="rounded-lg border-2 border-emerald-500 bg-white/10 px-8 py-4 text-center font-label-md text-label-md text-emerald-500 backdrop-blur-sm transition-colors hover:bg-emerald-500/20"
  href="#story"
>
          OUR HERITAGE
        </a>
      </div>
    </div>

    <div className="pointer-events-none absolute -bottom-10 -right-10 h-48 w-48 opacity-20">
      <div
        className="h-full w-full"
        style={{
          backgroundImage: 'radial-gradient(circle at center, #3e8f6c 1px, transparent 1px)',
          backgroundSize: '10px 10px',
        }}
      />
    </div>
  </section>
)

// -----------------------------------------------------------------------------
// Story
// -----------------------------------------------------------------------------

const StorySection: React.FC = () => (
  <section className="relative overflow-hidden bg-heritage-cream px-margin-mobile py-24" id="story">
    <div className="mx-auto max-w-container-max">
      <Reveal>
        <span className="mb-4 block font-label-md text-label-md tracking-widest text-primary">OUR STORY</span>
        <h2 className="mb-6 font-headline-lg-mobile text-headline-lg-mobile text-on-background">
          What Makes Good Coffee Great?
        </h2>
      </Reveal>

      <div className="space-y-12">
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

const HotBeveragesList: React.FC = () => (
  <div className="mb-16">
    <h3 className="mb-8 border-b border-secondary/10 pb-2 font-label-md text-label-md uppercase tracking-[0.2em] text-secondary">
      Hot Beverages
    </h3>
    <div className="grid grid-cols-1 gap-4">
      {HOT_BEVERAGES.map((beverage) => (
        <div
          key={beverage.name}
          className="group flex items-center justify-between rounded-xl bg-surface-container-low p-4 transition-colors active:bg-primary-container"
        >
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-primary group-active:text-on-primary-container">
              {beverage.icon}
            </span>
            <span className="font-headline-md text-on-surface group-active:text-on-primary-container">
              {beverage.name}
            </span>
          </div>
          <span className="material-symbols-outlined text-outline group-active:text-on-primary-container">
            arrow_forward_ios
          </span>
        </div>
      ))}
    </div>
  </div>
)

const BangbangSugGrid: React.FC = () => (
  <div className="mb-16">
    <h3 className="mb-8 border-b border-secondary/10 pb-2 font-label-md text-label-md uppercase tracking-[0.2em] text-secondary">
      Bangbang Sug (Snacks)
    </h3>
    <div className="grid grid-cols-2 gap-4">
      <div className="glass-card relative col-span-2 min-h-40 overflow-hidden rounded-3xl bg-white/70 p-6 backdrop-blur-md">
        <div className="relative z-10">
          <span className="mb-2 inline-block rounded bg-primary/10 px-2 py-1 text-caption font-bold text-primary">
            Best Seller
          </span>
          <h4 className="font-headline-md text-primary">Jualan Saing</h4>
          <p className="text-caption text-on-surface-variant">Deep fried bananas with sweet coco dip</p>
        </div>
        <div className="absolute -bottom-4 -right-4 h-32 w-32 opacity-10">
          <span className="material-symbols-outlined text-7xl!">restaurant</span>
        </div>
      </div>

      <div className="flex flex-col justify-between rounded-3xl bg-secondary-container p-5">
        <h4 className="font-headline-md text-on-secondary-container">Daral</h4>
        <p className="text-caption text-on-secondary-container/80">Crepe with sweet coconut</p>
      </div>

      <div className="flex flex-col justify-between rounded-3xl border border-outline-variant/30 bg-surface-container-highest p-5">
        <h4 className="font-headline-md text-primary">Wadjit</h4>
        <p className="text-caption text-on-surface-variant">Purple glutinous rice</p>
      </div>

      <div className="col-span-2 flex items-center justify-between rounded-3xl bg-tertiary-fixed p-5">
        <div>
          <h4 className="font-headline-md text-on-tertiary-fixed">Bangbang Bundle</h4>
          <p className="text-caption text-on-tertiary-fixed-variant">Daral, Wadjit, and Biyaki</p>
        </div>
        <span className="material-symbols-outlined text-on-tertiary-fixed">shopping_basket</span>
      </div>
    </div>
  </div>
)

const RiceMealsList: React.FC = () => (
  <div>
    <h3 className="mb-8 border-b border-secondary/10 pb-2 font-label-md text-label-md uppercase tracking-[0.2em] text-secondary">
      Rice Meals
    </h3>
    <div className="space-y-4">
      {RICE_MEALS.map((meal) => (
        <div key={meal.name} className="flex items-center gap-4">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl">
            <img alt={meal.imageAlt} className="h-full w-full object-cover" src={meal.imageSrc} />
          </div>
          <div className="grow">
            <h4 className="font-headline-md text-on-surface">{meal.name}</h4>
            <p className="text-caption text-on-surface-variant">{meal.description}</p>
          </div>
        </div>
      ))}

      <div className="mt-8 rounded-3xl bg-primary p-6 text-on-primary">
        <h4 className="mb-2 font-headline-md">Dulang Platter</h4>
        <p className="mb-4 text-body-md opacity-90">
          The ultimate Tausug feast for the group. Includes Tiulah Sug, Utak Utak, Beef Kulma, and more.
        </p>
        <span className="inline-block rounded-full bg-on-primary/10 px-4 py-2 text-caption font-bold">
          Good for 5 Persons
        </span>
      </div>
    </div>
  </div>
)

const MenuSection: React.FC = () => (
  <section className="bg-white px-margin-mobile py-24" id="menu">
    <div className="mx-auto max-w-container-max">
      <Reveal className="mb-16 text-center">
        <h2 className="mb-2 font-headline-lg-mobile text-headline-lg-mobile text-primary">Our Offerings</h2>
        <div className="mx-auto h-1 w-16 rounded-full bg-primary/20" />
      </Reveal>

      <Reveal>
        <HotBeveragesList />
      </Reveal>
      <Reveal>
        <BangbangSugGrid />
      </Reveal>
      <Reveal>
        <RiceMealsList />
      </Reveal>
    </div>
  </section>
)

// -----------------------------------------------------------------------------
// Contact / branches
// -----------------------------------------------------------------------------

const BranchCard: React.FC<{ branch: Branch }> = ({ branch }) => (
  <div className="rounded-2xl border border-secondary/10 bg-white p-6 shadow-sm">
    <h4 className="mb-2 font-headline-md text-primary">{branch.name}</h4>
    <p className="mb-4 flex items-start gap-2 text-body-md text-on-surface-variant">
      <span className="material-symbols-outlined pt-1 text-sm">location_on</span>
      {branch.address}
    </p>
    <a className="flex items-center gap-2 font-label-md text-primary" href={branch.phoneHref}>
      <span className="material-symbols-outlined">call</span> {branch.phoneDisplay}
    </a>
  </div>
)

const ContactSection: React.FC = () => (
  <section className="bg-surface-container px-margin-mobile py-24" id="contact">
    <div className="mx-auto max-w-container-max">
      <Reveal className="mb-12">
        <span className="mb-4 block font-label-md text-label-md tracking-widest text-primary">VISIT US</span>
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-background">Our Branches</h2>
      </Reveal>

      <Reveal className="space-y-6">
        {BRANCHES.map((branch) => (
          <BranchCard key={branch.name} branch={branch} />
        ))}
      </Reveal>

      <Reveal className="mt-12 h-64 overflow-hidden rounded-3xl border-4 border-white shadow-lg">
        <div
          aria-label="Map of Zamboanga City"
          className="h-full w-full grayscale bg-cover bg-center opacity-80"
          role="img"
          style={{ backgroundImage: `url('${MAP_IMAGE_SRC}')` }}
        />
      </Reveal>
    </div>
  </section>
)

// -----------------------------------------------------------------------------
// Footer
// -----------------------------------------------------------------------------

const Footer: React.FC = () => (
  <footer className="w-full rounded-t-3xl bg-surface-container-low px-margin-mobile py-12">
    <div className="mx-auto max-w-container-max">
      <div className="mb-12">
        <img alt="Dennis Coffee Garden Logo" className="mb-6 h-14 object-contain" src={LOGO_SRC} />
        <p className="max-w-md font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
          Preserving the heirloom delicacies of Sulu and empowering our community through every brew since 1962.
        </p>
      </div>

      <div className="mb-12 flex gap-4">
        <a
          aria-label="Website"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-on-primary"
          href="#"
        >
          <span className="material-symbols-outlined">public</span>
        </a>
        <a
          aria-label="Photos"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-on-primary"
          href="#"
        >
          <span className="material-symbols-outlined">photo_camera</span>
        </a>
      </div>

      <div className="mb-16 grid grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <h5 className="font-label-md text-label-md uppercase tracking-widest text-primary">Navigation</h5>
          <nav className="flex flex-col gap-3">
            <a className="text-body-md text-on-surface-variant transition-colors hover:text-primary" href="#story">
              Our Story
            </a>
            <a className="text-body-md text-on-surface-variant transition-colors hover:text-primary" href="#menu">
              Menu
            </a>
            <a className="text-body-md text-on-surface-variant transition-colors hover:text-primary" href="#contact">
              Contact Us
            </a>
          </nav>
        </div>
        <div className="flex flex-col gap-4">
          <h5 className="font-label-md text-label-md uppercase tracking-widest text-primary">Company</h5>
          <nav className="flex flex-col gap-3">
            <a className="text-body-md text-on-surface-variant transition-colors hover:text-primary" href="#">
              Careers
            </a>
            <a className="text-body-md text-on-surface-variant transition-colors hover:text-primary" href="#">
              Privacy Policy
            </a>
            <a className="text-body-md text-on-surface-variant transition-colors hover:text-primary" href="#">
              Terms of Service
            </a>
          </nav>
        </div>
      </div>

      <div className="mb-8 h-px w-full bg-outline-variant/30" />

      <div className="space-y-4">
        <p className="font-caption text-caption text-on-surface-variant">
          &copy; 1962-2024 Dennis Coffee Garden. All Rights Reserved. Heritage of Sulu.
        </p>
        <p className="text-body-md italic text-secondary">Crafted with respect for Tausug tradition.</p>
      </div>
    </div>
  </footer>
)

// -----------------------------------------------------------------------------
// Floating action button
// -----------------------------------------------------------------------------

const Fab: React.FC<{ visible: boolean }> = ({ visible }) => (
  <div
    className={`fixed bottom-8 right-8 z-40 transition-all duration-300 ${
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