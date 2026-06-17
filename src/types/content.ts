export type Difficulty = 'beginner' | 'intermediate' | 'advanced'
export type Category = 'notes' | 'projects' | 'resources'

export interface LessonMeta {
  title: string
  description: string
  date: string
  tags: string[]
  topic: string
  order: number
  difficulty: Difficulty
  slug: string
  readingTime: number
}

export interface LessonWithContent extends LessonMeta {
  content: React.ReactElement
  prevLesson: LessonMeta | null
  nextLesson: LessonMeta | null
}

export interface TopicMeta {
  slug: string
  title: string
  description: string
  lessons: LessonMeta[]
  lessonCount: number
  difficulties: Difficulty[]
}

export interface SearchDocument {
  id: string
  title: string
  description: string
  topic: string
  tags: string[]
  body: string
  slug: string
  [key: string]: unknown
}
