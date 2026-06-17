import { business } from '@/lib/business'

export const metadata = {
  title: 'Contact Submissions — Admin',
  robots: { index: false, follow: false },
}

export default function AdminSubmissionsPage() {
  const submissionsUrl = process.env.NEXT_PUBLIC_ADMIN_SUBMISSIONS_URL

  return (
    <section className="admin-page">
      <div className="admin-page-head">
        <p className="admin-eyebrow">Submissions</p>
        <h1>Contact form submissions</h1>
        <p className="admin-sub">
          Messages sent through the contact form are forwarded in real time to your automation
          (n8n) and recorded in the connected Google Sheet.
        </p>
      </div>

      <div className="admin-info">
        <h2>Where submissions go</h2>
        <p className="admin-info-text">
          When a visitor submits the form at <strong>/contact</strong>, the name, email, message,
          timestamp, and source page are posted to the webhook, which appends a row to your Google
          Sheet. Email replies can be sent to the address the visitor provided.
        </p>

        {submissionsUrl ? (
          <a href={submissionsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-solid" style={{ marginTop: '8px' }}>
            Open submissions Google Sheet →
          </a>
        ) : (
          <p className="admin-note">
            Tip: set <code>NEXT_PUBLIC_ADMIN_SUBMISSIONS_URL</code> in your Vercel environment
            variables to your Google Sheet link, and a button to open it will appear here.
          </p>
        )}
      </div>

      <div className="admin-info">
        <h2>Business contact</h2>
        <dl className="admin-info-grid">
          <div>
            <dt>Phone</dt>
            <dd><a href={business.phoneHref}>{business.phone}</a></dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd><a href={`mailto:${business.email}`}>{business.email}</a></dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
