/**
 * Apply a theme preference to the DOM by setting the data-theme attribute.
 * - "light" / "dark" → sets data-theme, overriding the system preference
 * - "system" → removes data-theme, letting the CSS media query decide
 */
export function applyThemeToDOM(theme: string): void {
  if (theme === 'dark' || theme === 'light') {
    document.documentElement.setAttribute('data-theme', theme)
  } else {
    document.documentElement.removeAttribute('data-theme')
  }
}
