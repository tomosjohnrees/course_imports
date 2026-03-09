import 'vitest'
import type { AxeResults } from 'axe-core'

interface AxeMatchers {
  toHaveNoViolations(): void
}

declare module 'vitest' {
  interface Assertion<T = unknown> extends AxeMatchers {}
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}
