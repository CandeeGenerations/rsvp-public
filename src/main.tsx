import App from '@/App'
import '@/index.css'
import {Sentry, initSentry} from '@/lib/sentry'
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'

initSentry()

function ErrorFallback() {
  return (
    <main className="min-h-svh bg-background px-4 py-6 sm:py-10">
      <div className="mx-auto w-full max-w-md text-center text-muted-foreground py-12">
        Something went wrong. Please refresh the page.
      </div>
    </main>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
      <App />
    </Sentry.ErrorBoundary>
  </StrictMode>,
)
