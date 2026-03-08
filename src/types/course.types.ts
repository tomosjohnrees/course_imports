// Course and block type definitions — populated in issue #0008

export interface Course {
  id: string
  title: string
  description: string
  version: string
  author: string
  tags: string[]
  topics: Topic[]
  source: CourseSource
}

export interface CourseSource {
  type: 'local' | 'github'
  path: string
}

export interface Topic {
  id: string
  title: string
  blocks: Block[]
}

export type Block =
  | TextBlock
  | CodeBlock
  | QuizBlock
  | CalloutBlock
  | ImageBlock

export interface TextBlock {
  type: 'text'
  content: string
}

export interface CodeBlock {
  type: 'code'
  language: string
  content: string
  label?: string
}

export type QuizBlock = MultipleChoiceQuizBlock | FreeTextQuizBlock

export interface MultipleChoiceQuizBlock {
  type: 'quiz'
  variant: 'multiple-choice'
  question: string
  options: string[]
  answer: number
  explanation?: string
}

export interface FreeTextQuizBlock {
  type: 'quiz'
  variant: 'free-text'
  question: string
  sampleAnswer?: string
  explanation?: string
}

export interface CalloutBlock {
  type: 'callout'
  style: 'info' | 'warning' | 'tip'
  body: string
}

export interface ImageBlock {
  type: 'image'
  src: string
  alt: string
  caption?: string
}

export interface CourseProgress {
  [topicId: string]: {
    viewed: boolean
    complete: boolean
  }
}
