import Link from 'next/link'
import { business } from '@/lib/business'
import { getPosts } from '@/lib/blog'
import { categories } from '@/lib/gallery'
import { services } from '@/lib/services'

export const metadata = {
  title: 'Admin Dashboard',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const submissionsUrl = process.env.NEXT_PUBLIC_ADMIN_SUBMISSIONS_URL
  const galleryPhotos = categories.reduce((sum, c) => sum + c.photos.length, 0)
  const posts = await getPosts({ fresh: true })

  return (
    <section className="admin-page">
      <div className="admin-page-head">
        <p className="admin-eyebrow">Dashboard</p>
        <h1>Welcome back</h1>
        <p className="admin-sub">
          Manage Marina Woodcrafts Design Inc. — contact submissions and site content.
        </p>
      </div>

      <div className="admin-cards">
        <Link href="/admin/submissions" className="admin-card">
          <span className="admin-card-eyebrow">Submissions</span>
          <h2>Contact form submissions</h2>
          <p>Every message from the contact form is forwarded to your connected inbox / Google Sheet.</p>
          <span className="admin-card-cta">Open submissions →</span>
        </Link>

        <Link href="/blog" target="_blank" className="admin-card">
          <span className="admin-card-eyebrow">Content</span>
          <h2>Blog</h2>
          <p>Guides and articles published on the site.</p>
          <span className="admin-card-stat">{posts.length}</span>
          <span className="admin-card-stat-label">Published articles</span>
        </Link>

        <Link href="/gallery" target="_blank" className="admin-card">
          <span className="admin-card-eyebrow">Content</span>
          <h2>Gallery</h2>
          <p>Project photos organized into {categories.length} collections.</p>
          <span className="admin-card-stat">{galleryPhotos}</span>
          <span className="admin-card-stat-label">Photos across collections</span>
        </Link>

        <Link href="/services" target="_blank" className="admin-card">
          <span className="admin-card-eyebrow">Content</span>
          <h2>Services</h2>
          <p>Custom cabinetry and woodworking offerings.</p>
          <span className="admin-card-stat">{services.length}</span>
          <span className="admin-card-stat-label">Services listed</span>
        </Link>
      </div>

      <div className="admin-info">
        <h2>Business information</h2>
        <dl className="admin-info-grid">
          <div>
            <dt>Phone</dt>
            <dd><a href={business.phoneHref}>{business.phone}</a></dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd><a href={`mailto:${business.email}`}>{business.email}</a></dd>
          </div>
          <div>
            <dt>Address</dt>
            <dd>
              {business.address.streetAddress}, {business.address.addressLocality},{' '}
              {business.address.addressRegion} {business.address.postalCode}
            </dd>
          </div>
          {submissionsUrl && (
            <div>
              <dt>Submissions sheet</dt>
              <dd><a href={submissionsUrl} target="_blank" rel="noopener noreferrer">Open Google Sheet →</a></dd>
            </div>
          )}
        </dl>
      </div>
    </section>
  )
}
