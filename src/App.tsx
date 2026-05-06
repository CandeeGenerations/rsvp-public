import {ConfirmationCard} from '@/components/ConfirmationCard'
import {InvalidTokenCard} from '@/components/InvalidTokenCard'
import {PastEventCard} from '@/components/PastEventCard'
import {RsvpForm} from '@/components/RsvpForm'
import {Card} from '@/components/ui/Card'
import {RsvpApiError, type RsvpGetResponse, getRsvp, postRsvp} from '@/lib/api'
import {useEffect, useState} from 'react'

type ViewState =
  | {kind: 'loading'}
  | {kind: 'invalid'}
  | {kind: 'past'; data: RsvpGetResponse}
  | {kind: 'form'; data: RsvpGetResponse}
  | {kind: 'submitting'; data: RsvpGetResponse}
  | {kind: 'confirmed'; data: RsvpGetResponse}

function readToken(): string | null {
  const m = window.location.pathname.match(/\/r\/(.+)$/)
  if (!m) return null
  return decodeURIComponent(m[1])
}

export default function App() {
  const [token] = useState<string | null>(readToken())
  const [view, setView] = useState<ViewState>({kind: 'loading'})

  useEffect(() => {
    if (!token) {
      setView({kind: 'invalid'})
      return
    }
    getRsvp(token)
      .then((data) => {
        if (data.isPast) setView({kind: 'past', data})
        else setView({kind: 'form', data})
      })
      .catch((err) => {
        if (err instanceof RsvpApiError && err.status === 404) {
          setView({kind: 'invalid'})
        } else {
          setView({kind: 'invalid'})
        }
      })
  }, [token])

  const handleSubmit = async (body: {status: 'yes' | 'no' | 'maybe'; headcount: number | null; note: string | null}) => {
    if (!token) return
    if (view.kind !== 'form') return
    setView({kind: 'submitting', data: view.data})
    try {
      const next = await postRsvp(token, body)
      if (next.isPast) {
        setView({kind: 'past', data: next})
      } else {
        setView({kind: 'confirmed', data: next})
      }
    } catch (err) {
      const status = err instanceof RsvpApiError ? err.status : 0
      if (status === 410) {
        // Race: event passed between load and submit.
        setView({kind: 'past', data: {...view.data, isPast: true}})
        return
      }
      // Roll back to the form so the user can retry.
      setView({kind: 'form', data: view.data})
      alert(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <main className="min-h-svh bg-background px-4 py-6 sm:py-10">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <picture>
            <source srcSet="/logos/default-monochrome-white.svg" media="(prefers-color-scheme: dark)" />
            <img
              src="/logos/default-monochrome.svg"
              alt="Central Flock"
              className="h-12 w-auto"
              width={332}
              height={48}
            />
          </picture>
        </div>
        {view.kind === 'loading' && (
          <Card className="text-center text-muted-foreground py-12">Loading…</Card>
        )}
        {view.kind === 'invalid' && <InvalidTokenCard />}
        {view.kind === 'past' && <PastEventCard data={view.data} />}
        {(view.kind === 'form' || view.kind === 'submitting') && (
          <RsvpForm
            data={view.data}
            token={token!}
            submitting={view.kind === 'submitting'}
            onSubmit={handleSubmit}
          />
        )}
        {view.kind === 'confirmed' && (
          <ConfirmationCard
            data={view.data}
            token={token!}
            onEdit={() => setView({kind: 'form', data: view.data})}
          />
        )}
      </div>
    </main>
  )
}
