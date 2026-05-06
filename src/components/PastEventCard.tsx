import {Card} from '@/components/ui/Card'
import {type RsvpGetResponse, type RsvpStatus} from '@/lib/api'
import {formatEventDate, formatEventTime} from '@/lib/format'

const STATUS_LABEL: Record<RsvpStatus, string> = {
  yes: 'Yes',
  no: 'No',
  maybe: 'Maybe',
  no_response: 'No response',
}

export function PastEventCard({data}: {data: RsvpGetResponse}) {
  return (
    <Card className="space-y-3">
      <h1 className="text-xl font-semibold">This event has passed.</h1>
      <p className="text-base text-muted-foreground">
        {data.eventTitle}
        {data.eventDate && ` · ${formatEventDate(data.eventDate)}`}
        {data.eventTime && ` ${formatEventTime(data.eventTime)}`}
      </p>
      <div className="rounded-2xl bg-muted px-4 py-3 space-y-1">
        <p className="text-sm text-muted-foreground">Your response</p>
        <p className="text-base">
          {STATUS_LABEL[data.status]}
          {data.status === 'yes' && data.headcount !== null && ` (party of ${data.headcount})`}
        </p>
        {data.note && (
          <p className="text-sm text-muted-foreground pt-1">
            Note: <span className="text-foreground">&ldquo;{data.note}&rdquo;</span>
          </p>
        )}
      </div>
    </Card>
  )
}
