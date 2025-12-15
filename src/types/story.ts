export interface StoryOption {
  text: string
  next: string
}

export interface StoryNode {
  text: string
  image?: string
  options?: StoryOption[]
  next?: string
  end?: boolean
}

export interface Story {
  name: string
  start: string
  nodes: Record<string, StoryNode>
}

export type Stories = Record<string, Story>
