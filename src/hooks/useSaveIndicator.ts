import { useEffect, useRef, useState } from 'react'
import { onProgressSaved } from '@/hooks/useProgressPersistence'

const VISIBLE_DURATION_MS = 2500

export function useSaveIndicator(): boolean {
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const unsubscribe = onProgressSaved(() => {
      setVisible(true)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        setVisible(false)
        timerRef.current = null
      }, VISIBLE_DURATION_MS)
    })

    return () => {
      unsubscribe()
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return visible
}
