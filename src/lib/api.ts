const BASE = (import.meta.env.VITE_CGEN_API_BASE as string | undefined) ?? ''

export type RsvpStatus = 'yes' | 'no' | 'maybe' | 'no_response'

export interface RsvpGetResponse {
  personFirstName: string | null
  eventTitle: string
  eventDate: string | null
  eventTime: string | null
  standaloneEndTime: string | null
  calendarEventEndDate: string | null
  status: RsvpStatus
  headcount: number | null
  note: string | null
  isPast: boolean
}

export interface RsvpPostBody {
  status: 'yes' | 'no' | 'maybe'
  headcount?: number | null
  note?: string | null
}

export class RsvpApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export async function getRsvp(token: string): Promise<RsvpGetResponse> {
  const res = await fetch(`${BASE}/rsvp/${encodeURIComponent(token)}`, {
    method: 'GET',
    headers: {Accept: 'application/json'},
  })
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as {error?: string}
    throw new RsvpApiError(body.error ?? `Request failed (${res.status})`, res.status)
  }
  return res.json()
}

export async function postRsvp(token: string, body: RsvpPostBody): Promise<RsvpGetResponse> {
  const res = await fetch(`${BASE}/rsvp/${encodeURIComponent(token)}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json', Accept: 'application/json'},
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const responseBody = (await res.json().catch(() => ({}))) as {error?: string}
    throw new RsvpApiError(responseBody.error ?? `Request failed (${res.status})`, res.status)
  }
  return res.json()
}
