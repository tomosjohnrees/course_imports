import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

let subscribedCallback: (() => void) | null = null
const mockUnsubscribe = vi.fn()

vi.mock('@/hooks/useProgressPersistence', () => ({
  onProgressSaved: (cb: () => void) => {
    subscribedCallback = cb
    return mockUnsubscribe
  },
}))

// Minimal React hooks stub
let effectCleanup: (() => void) | undefined
const mockSetVisible = vi.fn()

vi.mock('react', () => ({
  useEffect: (fn: () => (() => void) | void) => {
    effectCleanup = fn() as (() => void) | undefined
  },
  useRef: (initial: unknown) => ({ current: initial }),
  useState: (initial: boolean) => [initial, mockSetVisible],
}))

const { useSaveIndicator } = await import('../useSaveIndicator')

beforeEach(() => {
  vi.useFakeTimers()
  subscribedCallback = null
  mockUnsubscribe.mockClear()
  mockSetVisible.mockClear()
  effectCleanup = undefined
})

afterEach(() => {
  if (effectCleanup) effectCleanup()
  vi.useRealTimers()
})

describe('useSaveIndicator', () => {
  it('returns false initially', () => {
    const result = useSaveIndicator()
    expect(result).toBe(false)
  })

  it('subscribes to progress saved events', () => {
    useSaveIndicator()
    expect(subscribedCallback).toBeInstanceOf(Function)
  })

  it('sets visible to true when progress is saved', () => {
    useSaveIndicator()

    subscribedCallback!()
    expect(mockSetVisible).toHaveBeenCalledWith(true)
  })

  it('sets visible to false after timeout', () => {
    useSaveIndicator()

    subscribedCallback!()
    mockSetVisible.mockClear()

    vi.advanceTimersByTime(2500)
    expect(mockSetVisible).toHaveBeenCalledWith(false)
  })

  it('unsubscribes on cleanup', () => {
    useSaveIndicator()

    if (effectCleanup) effectCleanup()
    effectCleanup = undefined

    expect(mockUnsubscribe).toHaveBeenCalled()
  })
})
