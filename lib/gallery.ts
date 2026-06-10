export interface GalleryPhoto {
  src: string
  alt: string
}

export interface GalleryGroup {
  title: string
  description: string
  /** How many of the collection's grid photos fall under this group, in order.
   *  The final group takes whatever photos remain. */
  count: number
}

export interface GalleryCategory {
  slug: string
  name: string
  description: string
  /** Richer, keyword-rich paragraphs shown above the collection (SEO/GEO/AEO). */
  details: string[]
  /** Sub-groups of similar projects, each with its own informative blurb. */
  groups: GalleryGroup[]
  coverImage: string
  photos: GalleryPhoto[]
}

function photos(dir: string, name: string, files: string[]): GalleryPhoto[] {
  return files.map((f) => ({
    src: `/Gallery/${dir}/${f}`,
    alt: `${name} — photo`,
  }))
}

export const categories: GalleryCategory[] = [
  {
    slug: 'bathroom',
    name: 'Bathroom Vanities',
    description: 'Custom bathroom vanities built for your space — floating, floor-mounted, single and double sink configurations.',
    details: [
      'Every vanity in this collection was custom-built by Marina Woodcrafts Design Inc. for homeowners in Woodland Hills and the greater Los Angeles area. We design floating and floor-mounted vanities in any configuration — single or double sink, integrated toe-kicks, built-in power strips, and custom drawer dividers tailored to how you actually use the space.',
      'We build with moisture-resistant finishes over plywood or solid-wood boxes — never particle board, which swells and degrades in bathroom humidity. Door profiles, hardware, and stone tops are matched to your existing bathroom for a cohesive, finished look. Most single-vanity projects are completed within 2–3 weeks.',
    ],
    groups: [
      {
        title: 'Floating & Wall-Mounted Vanities',
        description:
          'Custom floating and wall-mounted vanities in wood-grain and painted finishes — single and double-sink layouts that free up floor space and suit modern bathrooms and tight powder rooms.',
        count: 8,
      },
      {
        title: 'Countertops, Tile & Finishing Details',
        description:
          'Integrated quartz and natural-stone vanity tops, tile backsplashes, and brass and matte-black fixtures — the finishing details that complete each bathroom we build in Woodland Hills and Los Angeles.',
        count: 7,
      },
    ],
    coverImage: '/Gallery/Bathroom%20Vanities/1.png',
    photos: photos('Bathroom%20Vanities', 'Bathroom Vanities', [
      '1.png','2.png','3.png','4.png','5.png','6.png','7.png','8.png',
      '9.png','10.png','11.png','12.png','13.jpg','14.png','15.png','16.png',
    ]),
  },
  {
    slug: 'kitchen',
    name: 'Kitchen Cabinetry',
    description: 'Handcrafted kitchen cabinetry built to your layout — Shaker, raised-panel, and fully custom profiles.',
    details: [
      'This collection features custom kitchen cabinetry hand-built to each client’s exact layout — from clean Shaker lines to raised-panel traditional and fully custom profiles. We work in solid hardwoods including maple, alder, cherry, oak, and walnut, as well as premium MDF with lacquer finishes for a painted look.',
      'Each project is designed to maximize storage, flow, and visual harmony: full-height pantries, custom islands, integrated appliance cabinetry, and soft-close drawer-box joinery built to last. Most kitchen installations are completed within 3–5 weeks of final design sign-off in Woodland Hills and across Los Angeles.',
    ],
    groups: [
      {
        title: 'Custom Islands & Full Kitchen Layouts',
        description:
          'Complete custom kitchen layouts and center islands in walnut, oak, and painted finishes — designed around how your household cooks, gathers, and stores, with integrated appliances and stone tops.',
        count: 9,
      },
      {
        title: 'Door Profiles, Hardwoods & Storage Details',
        description:
          'Shaker and raised-panel door profiles, full-height pantries, and soft-close drawer joinery — hand-built from solid maple, alder, cherry, oak, and walnut for a finish that lasts decades.',
        count: 9,
      },
    ],
    coverImage: '/Gallery/Custom%20Kitchen%20Cabinetry/1.png',
    photos: photos('Custom%20Kitchen%20Cabinetry', 'Kitchen Cabinetry', [
      '1.png','2.png','3.png','4.png','5.png','6.png','7.png','8.png','9.png','10.png',
      '11.png','12.png','13.png','14.png','15.png','16.png','17.png','18.png','19.png',
    ]),
  },
  {
    slug: 'bedroom',
    name: 'Bedroom Closets & Storage',
    description: 'Custom closet systems and bedroom storage built to the exact dimensions of your space.',
    details: [
      'Our closet and storage systems are built to work the way you do — walk-ins with center islands, reach-ins optimized for folded clothes, and bedroom storage walls with adjustable shelving, pull-out drawers, and hanging sections exactly where you need them.',
      'Because every unit is built to the exact dimensions of your room, we handle the spaces off-the-shelf systems can’t — angled ceilings, knee walls, and non-standard alcoves. Finishes range from painted MDF to melamine and natural wood veneers. Most closet projects are installed within 1–2 weeks.',
    ],
    groups: [
      {
        title: 'Walk-In & Reach-In Closets',
        description:
          'Custom walk-in and reach-in closet systems built to the exact dimensions of your bedroom — including angled ceilings and tight alcoves — with a clean, built-in look throughout.',
        count: 6,
      },
      {
        title: 'Drawers, Shelving & Organization',
        description:
          'Adjustable shelving, pull-out drawers, and dedicated hanging sections arranged for the way you actually store clothes, shoes, and accessories — folded, hung, and on display.',
        count: 6,
      },
    ],
    coverImage: '/Gallery/Bedroom%20Closets%20%26%20Storage/1.png',
    photos: photos('Bedroom%20Closets%20%26%20Storage', 'Bedroom Closets & Storage', [
      '1.png','2.png','3.png','4.png','5.png','6.png','7.png',
      '8.png','9.png','10.png','11.png','12.png','13.png',
    ]),
  },
  {
    slug: 'living',
    name: 'Living Area Cabinet & Shelves',
    description: 'Built-in shelving, entertainment centers, and living area cabinetry that becomes part of your home.',
    details: [
      'This collection showcases built-in bookcases, entertainment centers, and living-area cabinetry designed around your walls, doorways, and ceiling height — seamless installations that look like they were always part of the home.',
      'Options include open shelving, closed base cabinets, glass-front display sections, and integrated LED lighting channels. We finish in painted, stained, and cerused tones to match any interior — and built-ins like these add lasting real-estate value to your Woodland Hills or Los Angeles home.',
    ],
    groups: [
      {
        title: 'Built-In Entertainment Centers & Display Shelving',
        description:
          'Built-in entertainment centers and display shelving designed around your walls, doorways, and ceiling height — with glass-front sections, closed storage, and integrated LED lighting that make them feel original to the home.',
        count: 6,
      },
    ],
    coverImage: '/Gallery/Living-Area-Cabinet-Shelves/1.png',
    photos: photos('Living-Area-Cabinet-Shelves', 'Living Area Cabinet & Shelves', [
      '1.png','2.png','3.png','4.png','5.png','6.png',
    ]),
  },
]

export function getCategory(slug: string): GalleryCategory | undefined {
  return categories.find((c) => c.slug === slug)
}
