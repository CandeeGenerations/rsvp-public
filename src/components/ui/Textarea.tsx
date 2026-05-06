import {cn} from '@/lib/utils'
import * as React from 'react'

export function Textarea({className, ...props}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'w-full rounded-2xl border border-border bg-card px-4 py-3 text-base',
        'placeholder:text-muted-foreground',
        'focus:outline-none focus:ring-3 focus:ring-ring/40 focus:border-ring',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    />
  )
}
