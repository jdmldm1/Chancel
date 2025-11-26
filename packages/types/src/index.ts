// User types
export enum UserRole {
  LEADER = "LEADER",
  MEMBER = "MEMBER",
}

export interface User {
  id: string
  email: string
  name: string | null
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

// Session types
export interface Session {
  id: string
  title: string
  description: string | null
  scheduledDate: Date
  leaderId: string
  createdAt: Date
  updatedAt: Date
}

// Scripture types
export interface ScripturePassage {
  id: string
  sessionId: string
  book: string
  chapter: number
  verseStart: number
  verseEnd: number | null
  content: string
  order: number
  createdAt: Date
  updatedAt: Date
}

// Comment types
export interface Comment {
  id: string
  passageId: string
  sessionId: string
  userId: string
  content: string
  parentId: string | null
  createdAt: Date
  updatedAt: Date
}

// Resource types
export interface SessionResource {
  id: string
  sessionId: string
  fileName: string
  fileUrl: string
  fileType: string
  uploadedBy: string
  description: string | null
  createdAt: Date
  updatedAt: Date
}

// Session participant types
export interface SessionParticipant {
  id: string
  sessionId: string
  userId: string
  role: UserRole
  joinedAt: Date
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Authentication types
export interface AuthSession {
  user: {
    id: string
    email: string
    name: string | null
    role: UserRole
  }
  expires: string
}
