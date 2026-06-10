import Image from 'next/image'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer>
      <div className="footer-brand">
        <Image src="/Icon.png" alt="MW" width={5400} height={3360} className="footer-icon" />
        <div className="footer-brand-text">
          <span className="footer-name">Marina Woodcrafts</span>
          <span className="footer-name-sub">Design Inc.</span>
        </div>
      </div>
      <div className="footer-legal">
        <p className="footer-copy">© {year} Marina Woodcrafts Design Inc. All rights reserved.</p>
        <p className="footer-credit">Website by Paldz</p>
      </div>
    </footer>
  )
}
