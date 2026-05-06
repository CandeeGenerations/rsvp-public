import {Button} from '@/components/ui/Button'
import {Card} from '@/components/ui/Card'
import {Textarea} from '@/components/ui/Textarea'
import {HeadcountStepper} from '@/components/HeadcountStepper'
import {type RsvpGetResponse, type RsvpStatus} from '@/lib/api'
import {formatEventDate, formatEventTimeRange} from '@/lib/format'
import {useState} from 'react'

interface Props {
  data: RsvpGetResponse
  submitting: boolean
  onSubmit: (body: {
    status: 'yes' | 'no' | 'maybe'
    headcount: number | null
    note: string | null
  }) => void
}

export function RsvpForm({data, submitting, onSubmit}: Props) {
  const initialStatus: RsvpStatus =
    data.status === 'no_response' ? 'no_response' : data.status
  const [status, setStatus] = useState<RsvpStatus>(initialStatus)
  const [headcount, setHeadcount] = useState<number>(data.headcount ?? 1)
  const [note, setNote] = useState<string>(data.note ?? '')

  const headcountVisible = status === 'yes' || status === 'maybe'
  const canSubmit = status !== 'no_response' && !submitting

  const submit = () => {
    if (status === 'no_response') return
    onSubmit({
      status,
      headcount: headcountVisible ? headcount : null,
      note: note.trim() ? note.trim() : null,
    })
  }

  const submitLabel =
    data.status === 'no_response' ? 'Submit' : 'Update response'

  return (
    <Card className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">
          {data.personFirstName ? `Hi ${data.personFirstName}!` : 'RSVP'}
        </h1>
        <p className="text-lg text-foreground">
          Will you be at the {data.eventTitle}?
        </p>
        {(data.eventDate || data.eventTime) && (
          <p className="text-base text-muted-foreground">
            {data.eventDate && formatEventDate(data.eventDate)}
            {data.eventTime &&
              (data.eventDate ? ' at ' : '') +
                formatEventTimeRange(data.eventTime, data.eventEndTime)}
          </p>
        )}
      </header>

      <div className="space-y-3">
        <p className="text-sm font-medium">Will you be there?</p>
        <div className="flex flex-col gap-3">
          <Button
            size="lg"
            variant={status === 'yes' ? 'default' : 'outline'}
            selected={status === 'yes'}
            onClick={() => setStatus('yes')}
            aria-pressed={status === 'yes'}
          >
            Yes, I&apos;ll be there
          </Button>
          <Button
            size="lg"
            variant={status === 'maybe' ? 'default' : 'outline'}
            selected={status === 'maybe'}
            onClick={() => setStatus('maybe')}
            aria-pressed={status === 'maybe'}
          >
            Maybe
          </Button>
          <Button
            size="lg"
            variant={status === 'no' ? 'default' : 'outline'}
            selected={status === 'no'}
            onClick={() => setStatus('no')}
            aria-pressed={status === 'no'}
          >
            No, can&apos;t make it
          </Button>
        </div>
      </div>

      {headcountVisible && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-center">How many people?</p>
          <HeadcountStepper
            value={headcount}
            onChange={setHeadcount}
            min={1}
            max={10}
          />
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="note" className="text-sm font-medium">
          Note (optional)
        </label>
        <Textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value.slice(0, 280))}
          placeholder="Anything we should know?"
          rows={3}
          maxLength={280}
        />
        <p className="text-xs text-muted-foreground text-right">
          {note.length}/280
        </p>
      </div>

      <Button size="lg" disabled={!canSubmit} onClick={submit}>
        {submitting ? 'Sending…' : submitLabel}
      </Button>
    </Card>
  )
}
