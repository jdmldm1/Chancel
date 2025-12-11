'use client'

import { GetSessionQuery } from '@bibleproject/types/src/graphql'
import VerseByVersePassage from './VerseByVersePassage'

type ScripturePassage = NonNullable<GetSessionQuery['session']>['scripturePassages'][0]

interface ScripturePassageCardProps {
  passage: ScripturePassage
  sessionId: string
  canComment: boolean
  onCommentChange?: () => void
  onToggleCompletion?: () => void
  showCompletionButton?: boolean
}

export default function ScripturePassageCard({
  passage,
  sessionId,
  canComment,
  onCommentChange,
  onToggleCompletion,
  showCompletionButton,
}: ScripturePassageCardProps) {
  return (
    <VerseByVersePassage
      passage={passage}
      sessionId={sessionId}
      canComment={canComment}
      onCommentChange={onCommentChange}
      onToggleCompletion={onToggleCompletion}
      showCompletionButton={showCompletionButton}
    />
  )
}
