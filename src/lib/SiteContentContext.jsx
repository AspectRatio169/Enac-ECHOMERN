import { createContext, useContext, useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL

// ─── Fallback defaults (mirror current hardcoded JSX values) ─────────────────
const DEFAULTS = {
  homepage: {
    banner: {
      enabled: false,
      message: 'Welcome to Project ECHO!',
      type: 'info',
    },
    hero: {
      tagline:    'A Sustainable Initiative by Enactus NSUT',
      headline:   'Project ECHO',
      subtitle:   'E-Waste Collection Hub Operation',
      body:       'Transform your e-waste into eco-points. Join the sustainable revolution at NSUT.',
      ctaPrimary: 'Get Started',
      ctaMap:     'View Bin Location',
    },
    howItWorks: {
      sectionTag: 'The Process',
      heading:    'How It Works',
      subheading: 'Simple steps to contribute to a sustainable campus',
      steps: [
        {
          title:       'Deposit E-Waste',
          description: 'Drop your electronic waste at the Administrative Block collection bin on campus.',
        },
        {
          title:       'Earn Points',
          description: 'Log your submission and earn eco-points based on the type and quantity of e-waste deposited.',
        },
        {
          title:       'Redeem Rewards',
          description: 'Exchange your points for exclusive coupons and rewards from our partner brands.',
        },
      ],
    },
    binLocation: {
      name:        'Administrative Block',
      lat:         28.60982608028556,
      lng:         77.03703709922338,
      description: 'Inside Administrative Block, ground floor lobby',
      mapHeading:  'Find the Collection Bin',
      mapSubtext:  'Drop off your e-waste at the Administrative Block on NSUT campus.',
    },
    joinMovement: {
      heading:    'Join the Movement',
      subheading: 'Together, we can make NSUT a model for sustainable e-waste management',
      ctaLabel:   'Start Contributing Today',
      cards: [
        {
          title:       'For Students',
          description: 'Earn rewards while contributing to environmental sustainability. Track your impact and compete with peers.',
        },
        {
          title:       'For Campus',
          description: 'Creating awareness about proper e-waste disposal and building a culture of environmental responsibility.',
        },
      ],
    },
  },

  aboutpage: {
    hero: {
      tag:      'About Project ECHO',
      heading:  'E-Waste Collection\nHub Operation',
      subtext:  'A student-driven initiative by Enactus NSUT to tackle e-waste on campus through gamification, community engagement, and sustainable habits.',
    },
    missionCards: [
      {
        icon:  'Target',
        title: 'Our Mission',
        desc:  'To make e-waste disposal accessible, rewarding, and habitual for every student at NSUT.',
        color: 'bg-moss',
      },
      {
        icon:  'Heart',
        title: 'Our Values',
        desc:  'Sustainability, community responsibility, innovation, and building a greener campus culture together.',
        color: 'bg-leaf',
      },
      {
        icon:  'Globe',
        title: 'Our Impact',
        desc:  'From campus to community — setting a model for sustainable e-waste management in educational institutions.',
        color: 'bg-eco-500',
      },
    ],
    collectItems: [
      'Mobile Phones', 'Laptops & Tablets', 'Chargers & Cables',
      'Batteries', 'Earphones & Headsets', 'Circuit Boards',
      'USB Drives', 'Old Keyboards & Mice', 'Small Appliances',
    ],
    teamBlurb: {
      heading: 'Backed by Enactus NSUT',
      body:    'Enactus is an international nonprofit that brings together student, academic, and business leaders committed to using the power of entrepreneurial action to transform lives and shape a better, more sustainable world.',
    },
  },

  global: {
    sponsorships: [],
  },
}

async function fetchKey(key) {
  try {
    const res = await fetch(`${API_URL}/api/cms/${key}`)
    const json = await res.json()
    if (json.success) return json.data
  } catch {
    // network error — fall through to default
  }
  return DEFAULTS[key]
}

export const SiteContentContext = createContext(null)

export function SiteContentProvider({ children }) {
  const [homepage,  setHomepage]  = useState(DEFAULTS.homepage)
  const [aboutpage, setAboutpage] = useState(DEFAULTS.aboutpage)
  const [global,    setGlobal]    = useState(DEFAULTS.global)
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([
      fetchKey('homepage'),
      fetchKey('aboutpage'),
      fetchKey('global'),
    ]).then(([hp, ab, gl]) => {
      setHomepage(hp)
      setAboutpage(ab)
      setGlobal(gl)
    }).finally(() => setLoading(false))
  }, [])

  // Called by the CMS admin panel after a successful save so the UI updates
  // immediately without a page reload
  function refreshKey(key, data) {
    if (key === 'homepage')  setHomepage(data)
    if (key === 'aboutpage') setAboutpage(data)
    if (key === 'global')    setGlobal(data)
  }

  return (
    <SiteContentContext.Provider value={{ homepage, aboutpage, global, loading, refreshKey }}>
      {children}
    </SiteContentContext.Provider>
  )
}

export function useSiteContent() {
  const ctx = useContext(SiteContentContext)
  if (!ctx) throw new Error('useSiteContent must be used inside <SiteContentProvider>')
  return ctx
}
