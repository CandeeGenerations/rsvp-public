function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

function addDaysIso(date: string): string {
  const [y, m, d] = date.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d))
  dt.setUTCDate(dt.getUTCDate() + 1)
  return `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}`
}

function addTwoHours(localDt: string): string {
  // localDt format: 'YYYYMMDDTHHMMSS' (local floating)
  const y = Number(localDt.slice(0, 4))
  const mo = Number(localDt.slice(4, 6))
  const d = Number(localDt.slice(6, 8))
  const h = Number(localDt.slice(9, 11))
  const mi = Number(localDt.slice(11, 13))
  const dt = new Date(y, mo - 1, d, h + 2, mi)
  return `${dt.getFullYear()}${pad(dt.getMonth() + 1)}${pad(dt.getDate())}T${pad(dt.getHours())}${pad(dt.getMinutes())}00`
}

function escapeIcs(s: string): string {
  return s.replace(/[\\;,]/g, (m) => `\\${m}`).replace(/\n/g, '\\n')
}

export interface IcsOpts {
  title: string
  date: string // 'YYYY-MM-DD'
  time: string | null // 'HH:MM' or null
  uid: string
}

export function buildIcsDataUrl(opts: IcsOpts): string {
  const dateCompact = opts.date.replace(/-/g, '')
  const isAllDay = !opts.time
  const dtStart = isAllDay ? dateCompact : `${dateCompact}T${opts.time!.replace(':', '')}00`
  const dtEnd = isAllDay ? addDaysIso(opts.date) : addTwoHours(dtStart)
  const dtstamp = new Date()
    .toISOString()
    .replace(/[-:]|\.\d+/g, '')
    .slice(0, 15) + 'Z'

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//central-flock//rsvp//EN',
    'BEGIN:VEVENT',
    `UID:${escapeIcs(opts.uid)}@rsvp`,
    `DTSTAMP:${dtstamp}`,
    isAllDay ? `DTSTART;VALUE=DATE:${dtStart}` : `DTSTART:${dtStart}`,
    isAllDay ? `DTEND;VALUE=DATE:${dtEnd}` : `DTEND:${dtEnd}`,
    `SUMMARY:${escapeIcs(opts.title)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  return `data:text/calendar;base64,${btoa(lines.join('\r\n'))}`
}
