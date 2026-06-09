import Link from 'next/link'
import type { Service } from '@/lib/services'
import { Reveal } from '@/components/ui/Reveal'

interface ServiceCardProps {
  service: Service
  delayClass?: string
}

export function ServiceCard({ service, delayClass = '' }: ServiceCardProps) {
  return (
    <Reveal className={`service-card${delayClass ? ` ${delayClass}` : ''}`}>
      <div className="svc-num">{service.num}</div>
      <h3 className="svc-title">{service.title}</h3>
      <p className="svc-desc">{service.summary}</p>
      <Link href={`/services/${service.slug}`} className="svc-link">
        Learn more
      </Link>
    </Reveal>
  )
}
