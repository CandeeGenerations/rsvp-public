import {Button} from '@/components/ui/Button'
import {Card} from '@/components/ui/Card'
import {type RsvpGetResponse} from '@/lib/api'
import {formatEventDate, formatEventTime} from '@/lib/format'
import {buildIcsDataUrl} from '@/lib/ics'

interface Props {
  data: RsvpGetResponse
  token: string
  onEdit: () => void
}

export function ConfirmationCard({data, token, onEdit}: Props) {
  const dateStr = formatEventDate(data.eventDate)
  const timeStr = formatEventTime(data.eventTime)

  const icsHref = data.eventDate
    ? buildIcsDataUrl({
        title: data.eventTitle,
        date: data.eventDate,
        time: data.eventTime,
        uid: token.slice(0, 12),
      })
    : null

  const showCalendar = data.status === 'yes' && icsHref

  const headline =
    data.status === 'yes'
      ? `You're going to ${data.eventTitle}`
      : data.status === 'maybe'
        ? `You said maybe to ${data.eventTitle}`
        : `You can't make ${data.eventTitle}`

  return (
    <Card className="space-y-5">
      <div className="space-y-2">
        <p className="text-2xl font-semibold">
          ✓ Thanks{data.personFirstName ? `, ${data.personFirstName}` : ''}!
        </p>
        <p className="text-base">{headline}</p>
        {(dateStr || timeStr) && (
          <p className="text-base text-muted-foreground">
            {dateStr}
            {timeStr && (dateStr ? ' at ' : '') + timeStr}.
          </p>
        )}
      </div>

      {data.status === 'yes' && data.headcount !== null && (
        <p className="text-base">Party of {data.headcount}.</p>
      )}
      {data.note && (
        <div className="rounded-2xl bg-muted px-4 py-3">
          <p className="text-sm text-muted-foreground mb-1">Note</p>
          <p className="text-base">{data.note}</p>
        </div>
      )}

      <div className="flex flex-col gap-3 pt-2">
        {showCalendar && (
          <a href={icsHref} download={`${data.eventTitle}.ics`} className="contents">
            <Button size="lg">+ Add to Calendar</Button>
          </a>
        )}
        <Button size="lg" variant="outline" onClick={onEdit}>
          Edit response
        </Button>
      </div>
    </Card>
  )
}
