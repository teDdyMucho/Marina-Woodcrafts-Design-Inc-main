export interface ServiceFaq {
  question: string
  answer: string
}

export interface Service {
  slug: string
  num: string
  title: string
  summary: string
  body: string
  heroImage: string
  faq: ServiceFaq[]
}

export const services: Service[] = [
  {
    slug: 'kitchen-cabinetry',
    num: '01',
    title: 'Custom Kitchen Cabinetry',
    summary: 'Designed and built to fit your kitchen layout with precision, combining functionality and modern aesthetics.',
    body: `Every kitchen we build starts with your space. We measure, design, and hand-build each cabinet run to maximize storage, flow, and visual harmony — whether you prefer clean Shaker lines, raised-panel traditional, or a completely custom profile. Materials range from solid hardwoods (maple, alder, cherry) to premium MDF with lacquer finishes. Hardware, drawer-box joinery, and interior fittings are selected for longevity, not just looks. Most kitchen installations are completed within 3–5 weeks from final design sign-off.`,
    heroImage: '/Gallery/Custom%20Kitchen%20Cabinetry/1.png',
    faq: [
      { question: 'How long does a custom kitchen take?', answer: 'From design approval to installation, most custom kitchens take 3–5 weeks. Complex projects with specialty finishes or appliance cutouts may take 6–8 weeks.' },
      { question: 'What wood species do you work with?', answer: 'We work with maple, alder, cherry, oak, and walnut. We can also source specialty woods on request. MDF with lacquer finishes is available for a painted look.' },
      { question: 'Do you offer free consultations?', answer: 'Yes. We offer a free in-home consultation to measure your space, discuss design options, and provide an estimate. Contact us to schedule.' },
    ],
  },
  {
    slug: 'bathroom-vanities',
    num: '02',
    title: 'Bathroom Vanities',
    summary: 'Custom-built vanities tailored to maximize space while maintaining a clean and elegant look.',
    body: `A custom vanity transforms a bathroom from functional to finished. We build floating and floor-mounted vanities in any configuration — single or double sink, integrated toe-kicks, built-in power strips, and custom drawer dividers. Moisture-resistant finishes and solid-wood or plywood boxes (never particle board) ensure your vanity stays beautiful in the humidity of daily use. Most single-vanity projects are completed within 2–3 weeks.`,
    heroImage: '/Gallery/Bathroom%20Vanities/1.png',
    faq: [
      { question: 'Are your vanities moisture-resistant?', answer: 'Yes. We use plywood or solid-wood box construction with moisture-resistant finishes — never particle board, which can swell and degrade in bathroom conditions.' },
      { question: 'Can you match an existing vanity style?', answer: 'We can match door profiles, finishes, and hardware to existing cabinetry in your home for a cohesive look.' },
      { question: 'Do you install the plumbing?', answer: 'We handle the cabinetry installation and coordinate the rough-in cutouts. We recommend coordinating with a licensed plumber for the faucet and drain connections.' },
    ],
  },
  {
    slug: 'closets-storage',
    num: '03',
    title: 'Closets & Storage Solutions',
    summary: 'Efficient and stylish storage systems designed to match your lifestyle and space requirements.',
    body: `We design and build closet systems that work the way you do — whether that means a walk-in with island, a reach-in optimized for folded clothes, or a garage wall with deep utility shelving. Every unit is built to the exact dimensions of your space, with adjustable shelves, pull-out drawers, and hanging sections where you actually need them. Finishes range from painted MDF to melamine and natural wood veneers. Most closet projects are installed within 1–2 weeks.`,
    heroImage: '/Gallery/Bedroom%20Closets%20&%20Storage/1.png',
    faq: [
      { question: 'Can you build a closet in an awkward space?', answer: 'Yes — this is where custom work shines. We build to the exact dimensions of your space, including angled ceilings, knee walls, and non-standard alcoves.' },
      { question: 'Are the shelves adjustable?', answer: 'By default, yes. We use a pin-shelf system that allows shelves to be repositioned as your storage needs change.' },
      { question: 'Do you do garage storage as well?', answer: 'Yes. We build wall-mounted and freestanding garage storage with a mix of cabinets, open shelving, and heavy-duty hanging systems.' },
    ],
  },
  {
    slug: 'bookcases-built-ins',
    num: '04',
    title: 'Bookcases & Built-ins',
    summary: 'Custom shelving and built-in units for both decorative and functional purposes.',
    body: `Built-in bookcases and entertainment centers add architectural character to a room that freestanding furniture simply cannot. We design around your wall dimensions, doorways, and ceiling height — creating seamless installations that look like they were always there. Options include open shelving, closed base cabinets, glass-front display sections, and integrated lighting channels. We work in painted, stained, and cerused finishes to match any interior style.`,
    heroImage: '/Gallery/Living-Area-Cabinet-Shelves/1.png',
    faq: [
      { question: 'Can built-ins be removed later?', answer: 'Built-ins are designed to be permanent, but they can be removed. We anchor to studs with minimal wall patching required. Many clients choose to keep them when selling — they add real estate value.' },
      { question: 'Do you add lighting?', answer: 'Yes. We can route channels for LED strip lighting or puck lights, and coordinate with your electrician for hardwired connections.' },
      { question: 'Can you match my existing trim and millwork?', answer: 'Absolutely. We can profile custom base moldings, crown, and face-frame details to match existing millwork in your home.' },
    ],
  },
  {
    slug: 'countertops',
    num: '05',
    title: 'Countertops',
    summary: 'Installation of high-quality materials including Granite, Caesarstone, and Butcher Block.',
    body: `The right countertop ties the room together. We supply and install granite, quartz (Caesarstone, Silestone, MSI), and butcher block countertops. Each slab is templated on-site for precision cuts around sinks, cooktops, and outlets. Edge profiles — eased, beveled, ogee, waterfall — are selected to complement your cabinetry. Butcher block is finished with food-safe oil and wax. Lead times vary by material; most installations are completed within 1–2 weeks of template.`,
    heroImage: '/Gallery/Custom%20Kitchen%20Cabinetry/1.png',
    faq: [
      { question: 'What countertop materials do you offer?', answer: 'We offer granite, quartz (Caesarstone, Silestone, MSI Q Premium), and butcher block. We can source other materials — marble, quartzite, dekton — by request.' },
      { question: 'How do I choose the right material?', answer: 'Granite and quartz are both highly durable. Granite requires periodic sealing; quartz is maintenance-free. Butcher block is warm and renewable but requires more care near sinks. We help you weigh the tradeoffs during your consultation.' },
      { question: 'Do you remove the old countertop?', answer: 'Yes. Removal and disposal of the existing countertop is included in our installation service.' },
    ],
  },
]

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug)
}
