'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

export interface CalendarArticle {
  slug: string
  title: string
  date: string // yyyy-mm-dd
  status: 'published' | 'draft'
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/** Month-grid calendar of published articles by their published date. */
export function AdminCalendar({
  articles,
  initialMonth,
}: {
  articles: CalendarArticle[]
  initialMonth: string // yyyy-mm (server-provided "today" month)
}) {
  const [y0, m0] = initialMonth.split('-').map(Number)
  const [year, setYear] = useState(y0)
  const [month, setMonth] = useState(m0 - 1) // 0-indexed
  const [selected, setSelected] = useState<string | null>(null)

  // Map of yyyy-mm-dd -> articles on that day
  const byDate = useMemo(() => {
    const m = new Map<string, CalendarArticle[]>()
    for (const a of articles) {
      if (!m.has(a.date)) m.set(a.date, [])
      m.get(a.date)!.push(a)
    }
    return m
  }, [articles])

  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const key = (day: number) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  function go(delta: number) {
    setSelected(null)
    const d = new Date(year, month + delta, 1)
    setYear(d.getFullYear())
    setMonth(d.getMonth())
  }

  const selectedArticles = selected ? byDate.get(selected) ?? [] : []

  return (
    <div className="admin-cal">
      <div className="admin-cal-head">
        <button type="button" className="admin-cal-nav" onClick={() => go(-1)} aria-label="Previous month">‹</button>
        <h2 className="admin-cal-title">{MONTHS[month]} {year}</h2>
        <button type="button" className="admin-cal-nav" onClick={() => go(1)} aria-label="Next month">›</button>
      </div>

      <div className="admin-cal-grid admin-cal-weekdays">
        {WEEKDAYS.map((w) => (
          <span key={w} className="admin-cal-weekday">{w}</span>
        ))}
      </div>

      <div className="admin-cal-grid">
        {cells.map((day, i) => {
          if (day === null) return <span key={`e${i}`} className="admin-cal-cell empty" />
          const k = key(day)
          const items = byDate.get(k) ?? []
          const isSelected = selected === k
          return (
            <button
              type="button"
              key={k}
              className={`admin-cal-cell${items.length ? ' has-posts' : ''}${isSelected ? ' selected' : ''}`}
              onClick={() => setSelected(items.length ? k : null)}
              disabled={!items.length}
            >
              <span className="admin-cal-daynum">{day}</span>
              {items.length > 0 && <span className="admin-cal-dot">{items.length}</span>}
            </button>
          )
        })}
      </div>

      {selected && (
        <div className="admin-cal-day">
          <h3>{selectedArticles.length} article{selectedArticles.length === 1 ? '' : 's'} on {selected}</h3>
          <ul>
            {selectedArticles.map((a) => (
              <li key={a.slug}>
                <Link href={`/blog/${a.slug}`} target="_blank">{a.title}</Link>
                <span className={`admin-cal-badge ${a.status}`}>{a.status}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
