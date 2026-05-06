import {Button} from '@/components/ui/Button'
import {cn} from '@/lib/utils'

interface Props {
  value: number
  onChange: (next: number) => void
  min?: number
  max?: number
  className?: string
}

export function HeadcountStepper({value, onChange, min = 1, max = 10, className}: Props) {
  const dec = () => onChange(Math.max(min, value - 1))
  const inc = () => onChange(Math.min(max, value + 1))
  return (
    <div className={cn('flex items-center justify-center gap-4', className)}>
      <Button variant="outline" onClick={dec} disabled={value <= min} className="!w-14 !h-14 !rounded-2xl text-2xl">
        −
      </Button>
      <div className="min-w-16 text-center">
        <div className="text-3xl font-semibold tabular-nums">{value}</div>
        <div className="text-xs text-muted-foreground">{value === 1 ? 'person' : 'people'}</div>
      </div>
      <Button variant="outline" onClick={inc} disabled={value >= max} className="!w-14 !h-14 !rounded-2xl text-2xl">
        +
      </Button>
    </div>
  )
}
