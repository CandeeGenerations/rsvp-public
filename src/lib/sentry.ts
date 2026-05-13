import * as Sentry from '@sentry/react'

const dsn = import.meta.env.VITE_SENTRY_DSN
const environment = import.meta.env.VITE_SENTRY_ENVIRONMENT ?? import.meta.env.MODE
const release = import.meta.env.VITE_SENTRY_RELEASE

function redactRsvpToken(url: string | undefined): string | undefined {
  if (!url) return url
  return url.replace(/\/rsvp\/[^/?#]+/, '/rsvp/[REDACTED]').replace(/\/r\/[^/?#]+/, '/r/[REDACTED]')
}

function scrubEvent<T extends Sentry.Event>(event: T): T {
  if (event.request) {
    delete event.request.data
    delete event.request.query_string
    delete event.request.cookies
    event.request.url = redactRsvpToken(event.request.url)
  }
  for (const b of event.breadcrumbs ?? []) {
    if (b.category === 'fetch' || b.category === 'xhr') {
      if (typeof b.data?.url === 'string') b.data.url = redactRsvpToken(b.data.url)
    }
    if (b.data) {
      delete b.data.input
      delete b.data.response
    }
  }
  return event
}

export function initSentry(): void {
  if (!dsn) return
  Sentry.init({
    dsn,
    environment,
    release,
    tracesSampleRate: 1.0,
    sendDefaultPii: false,
    ignoreErrors: ['AbortError', 'Unauthorized'],
    beforeSend: scrubEvent,
    beforeSendTransaction: scrubEvent,
  })
}

export {Sentry}
