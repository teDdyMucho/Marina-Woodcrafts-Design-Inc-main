export interface GalleryPhoto {
  src: string
  alt: string
}

export interface GalleryCategory {
  slug: string
  name: string
  description: string
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
    coverImage: '/Gallery/Living-Area-Cabinet-Shelves/1.png',
    photos: photos('Living-Area-Cabinet-Shelves', 'Living Area Cabinet & Shelves', [
      '1.png','2.png','3.png','4.png','5.png','6.png',
    ]),
  },
]

export function getCategory(slug: string): GalleryCategory | undefined {
  return categories.find((c) => c.slug === slug)
}
