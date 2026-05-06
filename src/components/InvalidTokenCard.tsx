import {Card} from '@/components/ui/Card'

export function InvalidTokenCard() {
  return (
    <Card className="space-y-2 text-center">
      <h1 className="text-xl font-semibold">This RSVP link is no longer valid.</h1>
      <p className="text-base text-muted-foreground">
        It may have been removed by the host, or the link may have a typo. If you think this is a mistake, please reach
        out to whoever sent it.
      </p>
    </Card>
  )
}
