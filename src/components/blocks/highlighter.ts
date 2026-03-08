import { createHighlighter, type Highlighter } from 'shiki'

let highlighterPromise: Promise<Highlighter> | null = null

const PRELOADED_LANGS = [
  'javascript',
  'typescript',
  'python',
  'html',
  'css',
  'json',
  'bash',
  'shell',
  'markdown',
  'jsx',
  'tsx',
  'yaml',
  'sql',
  'rust',
  'go',
  'java',
  'c',
  'cpp',
] as const

const LIGHT_THEME = 'github-light'
const DARK_THEME = 'one-dark-pro'

export function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [LIGHT_THEME, DARK_THEME],
      langs: [...PRELOADED_LANGS],
    })
  }
  return highlighterPromise
}

export function highlightCode(
  highlighter: Highlighter,
  code: string,
  language: string,
): string {
  const loadedLangs = highlighter.getLoadedLanguages()
  const lang = loadedLangs.includes(language) ? language : 'text'

  return highlighter.codeToHtml(code, {
    lang,
    themes: {
      light: LIGHT_THEME,
      dark: DARK_THEME,
    },
    defaultColor: false,
  })
}
