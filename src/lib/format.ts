const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function formatEventDate(iso: string | null): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return iso
  const dt = new Date(y, m - 1, d)
  return `${DAYS[dt.getDay()]} ${MONTHS[dt.getMonth()]} ${dt.getDate()}`
}

export function formatEventTime(time: string | null): string {
  if (!time) return ''
  const [hh, mm] = time.split(':').map(Number)
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return time
  const ampm = hh >= 12 ? 'PM' : 'AM'
  const h12 = hh % 12 === 0 ? 12 : hh % 12
  return `${h12}:${mm.toString().padStart(2, '0')} ${ampm}`
}

export function formatEventTimeRange(start: string | null, end: string | null): string {
  const s = formatEventTime(start)
  if (!s) return ''
  if (!end || end <= (start ?? '')) return s
  return `${s} – ${formatEventTime(end)}`
}
