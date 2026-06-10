export interface BlogSection {
  heading: string
  paragraphs: string[]
}

export interface BlogFaq {
  question: string
  answer: string
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  /** ISO date for schema + <time> */
  date: string
  /** Human-readable date label */
  dateLabel: string
  author: string
  heroImage: string
  readMinutes: number
  keywords: string[]
  intro: string
  sections: BlogSection[]
  faq: BlogFaq[]
}

export const posts: BlogPost[] = [
  {
    slug: 'custom-vs-stock-cabinets',
    title: 'Custom Cabinets vs. Stock Cabinets: Which Is Right for Your Kitchen?',
    excerpt:
      'Stock cabinets are cheaper up front, but custom cabinetry fits your exact space and lasts decades. Here is how to decide for your Woodland Hills kitchen.',
    date: '2026-05-20',
    dateLabel: 'May 20, 2026',
    author: 'Marina Woodcrafts Design Inc.',
    heroImage: '/Gallery/Custom%20Kitchen%20Cabinetry/2.png',
    readMinutes: 5,
    keywords: [
      'custom cabinets vs stock cabinets',
      'custom kitchen cabinetry Woodland Hills',
      'semi-custom cabinets Los Angeles',
    ],
    intro:
      'When you remodel a kitchen, one of the first decisions is whether to buy stock cabinets off the shelf or have cabinetry custom-built for your space. Both can look great on day one — but they age very differently. Here is an honest breakdown to help you choose.',
    sections: [
      {
        heading: 'What you actually get with stock cabinets',
        paragraphs: [
          'Stock cabinets come in fixed sizes — typically 3-inch increments — and are mass-produced from particle board or thin plywood with a laminate or veneer face. They are the most affordable option and are available quickly, which makes them a reasonable choice for rentals or tight budgets.',
          'The trade-off is fit and longevity. Because the boxes only come in set widths, installers use filler strips to cover the gaps, and your storage is dictated by what the factory offered rather than how you actually cook. Particle-board boxes also swell if they ever meet moisture.',
        ],
      },
      {
        heading: 'Where custom cabinetry wins',
        paragraphs: [
          'Custom cabinets are designed and hand-built to the exact dimensions of your kitchen — no filler strips, no wasted inches, and storage planned around your appliances, your cookware, and your habits. We build with solid hardwoods (maple, alder, cherry, oak, walnut) and plywood boxes that hold up for decades.',
          'Custom also means choice: door profiles, drawer dividers, full-height pantries, appliance garages, and finishes are all yours to specify. For unusual layouts — angled walls, deep islands, floor-to-ceiling runs — custom is often the only option that looks intentional.',
        ],
      },
      {
        heading: 'How to decide',
        paragraphs: [
          'If you are furnishing a rental or need the lowest possible price, stock is fine. If this is your long-term home and you want cabinetry that fits perfectly and lasts, custom is worth the investment — and it adds resale value most buyers in the Los Angeles market notice immediately.',
          'A free in-home consultation is the fastest way to compare. We measure your space, talk through materials and budget, and give you a transparent estimate so you can weigh the real numbers, not guesses.',
        ],
      },
    ],
    faq: [
      {
        question: 'Are custom cabinets worth the extra cost?',
        answer:
          'For a long-term home, yes. Custom cabinetry fits your exact space with no wasted inches, uses solid-wood and plywood construction that lasts decades, and adds resale value. For rentals or very tight budgets, stock cabinets can make sense.',
      },
      {
        question: 'How much longer do custom cabinets take?',
        answer:
          'Stock cabinets are available almost immediately, while custom kitchens take about 3–5 weeks from final design sign-off. The extra time buys a perfect fit and far better materials.',
      },
      {
        question: 'Do you offer a free consultation to compare options?',
        answer:
          'Yes. We offer a free in-home consultation in Woodland Hills and the greater Los Angeles area to measure your space, review materials, and give you a transparent estimate.',
      },
    ],
  },
  {
    slug: 'choosing-wood-for-kitchen-cabinets',
    title: 'How to Choose the Right Wood for Your Kitchen Cabinets',
    excerpt:
      'Maple, alder, cherry, oak, or walnut? Each wood has a different grain, durability, and price. Here is how to pick the right species for your cabinetry.',
    date: '2026-04-28',
    dateLabel: 'April 28, 2026',
    author: 'Marina Woodcrafts Design Inc.',
    heroImage: '/Gallery/Custom%20Kitchen%20Cabinetry/3.png',
    readMinutes: 6,
    keywords: [
      'best wood for kitchen cabinets',
      'maple vs oak cabinets',
      'walnut cabinetry Los Angeles',
    ],
    intro:
      'The wood species you choose sets the tone for the whole kitchen — its color, grain, durability, and how it takes a finish. Here is a quick guide to the hardwoods we build with most, and who each one suits.',
    sections: [
      {
        heading: 'Maple — smooth, modern, paint-friendly',
        paragraphs: [
          'Maple is a hard, close-grained wood with a smooth surface that takes paint and light stains beautifully. It is our go-to for clean, modern kitchens and any painted cabinetry, because the subtle grain does not telegraph through a painted finish the way more open-grained woods can.',
        ],
      },
      {
        heading: 'Oak and alder — character and value',
        paragraphs: [
          'Oak has a bold, open grain that reads traditional or, in rift-cut form, strikingly contemporary. It is hard-wearing and budget-friendly. Alder is softer and warmer, with a gentle grain that stains to mimic cherry at a lower cost — a favorite for rustic and transitional kitchens.',
        ],
      },
      {
        heading: 'Cherry and walnut — premium warmth',
        paragraphs: [
          'Cherry darkens richly with age and light, developing a deep, lustrous patina that many homeowners love. Walnut is the premium choice: a chocolate-brown hardwood with dramatic grain that anchors high-end, design-forward kitchens. Both are showpiece woods.',
          'Whichever species you choose, we build the boxes from quality plywood — never particle board — so the structure lasts as long as the face.',
        ],
      },
    ],
    faq: [
      {
        question: 'What is the most durable wood for kitchen cabinets?',
        answer:
          'Maple and oak are among the hardest and most durable cabinet woods. Walnut and cherry are slightly softer but extremely stable and prized for their appearance. All are excellent choices when built with solid joinery.',
      },
      {
        question: 'Which wood is best for painted cabinets?',
        answer:
          'Maple. Its smooth, close grain gives painted cabinetry a clean finish without the grain showing through. MDF is also an option for fully painted doors.',
      },
      {
        question: 'Can you match a wood and finish to my existing furniture?',
        answer:
          'Yes. We can match species, stain, and door profile to existing cabinetry or furniture in your home so the new work looks cohesive.',
      },
    ],
  },
  {
    slug: 'quartz-vs-granite-vs-butcher-block',
    title: 'Quartz vs. Granite vs. Butcher Block: A Countertop Buyer’s Guide',
    excerpt:
      'The three countertops we install most, compared on durability, maintenance, and look — so you can choose the right surface for your kitchen or vanity.',
    date: '2026-04-02',
    dateLabel: 'April 2, 2026',
    author: 'Marina Woodcrafts Design Inc.',
    heroImage: '/Gallery/Bathroom%20Vanities/3.png',
    readMinutes: 5,
    keywords: [
      'quartz vs granite countertops',
      'butcher block countertops',
      'countertop installation Woodland Hills',
    ],
    intro:
      'Your countertop ties the whole room together and takes more daily abuse than almost any other surface. Here is how the three materials we install most often compare.',
    sections: [
      {
        heading: 'Quartz — low-maintenance and consistent',
        paragraphs: [
          'Engineered quartz (Caesarstone, Silestone, MSI) is non-porous, so it never needs sealing and resists stains and bacteria. Colors and patterns are consistent slab to slab, which makes large kitchens easy to plan. It is our most popular choice for busy households.',
        ],
      },
      {
        heading: 'Granite — natural and heat-tolerant',
        paragraphs: [
          'Granite is a natural stone, so every slab is one of a kind, with depth and movement engineered surfaces cannot fully replicate. It is extremely heat-tolerant and durable, though it needs periodic sealing to stay stain-resistant. If you want a genuinely unique surface, granite delivers.',
        ],
      },
      {
        heading: 'Butcher block — warm and renewable',
        paragraphs: [
          'Butcher block brings warmth and a hands-on, workshop feel, and it can be sanded and re-oiled to look new for decades. It needs more care than stone — food-safe oil and wax, and caution around standing water near sinks — but no other surface ages quite as gracefully.',
          'Whatever you choose, we template on-site for precise cuts around sinks, cooktops, and outlets, and we remove and dispose of your old countertop as part of installation.',
        ],
      },
    ],
    faq: [
      {
        question: 'Is quartz or granite better for a kitchen?',
        answer:
          'Both are highly durable. Quartz is non-porous and maintenance-free; granite is natural, heat-tolerant, and unique but needs periodic sealing. The right choice depends on whether you prioritize zero maintenance (quartz) or a one-of-a-kind natural surface (granite).',
      },
      {
        question: 'Does butcher block hold up near a sink?',
        answer:
          'It can, with care. Butcher block needs food-safe oil and wax and should not be left under standing water. Many homeowners use stone near the sink and butcher block on an island for the best of both.',
      },
      {
        question: 'Do you remove the old countertop?',
        answer:
          'Yes. Removal and disposal of the existing countertop is included in our countertop installation service in Woodland Hills and the greater Los Angeles area.',
      },
    ],
  },
]

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug)
}
