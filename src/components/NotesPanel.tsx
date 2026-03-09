import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { useCourseStore } from '@/store/course.store'
import './NotesPanel.css'

export default function NotesPanel() {
  const [expanded, setExpanded] = useState(false)
  const activeTopic = useCourseStore((s) => s.activeTopic)
  const noteText = useCourseStore(
    (s) => (s.activeTopic ? s.notes[s.activeTopic]?.text : undefined) ?? '',
  )
  const updateNote = useCourseStore((s) => s.updateNote)

  if (!activeTopic) return null

  const hasContent = noteText.length > 0

  return (
    <div
      className={`notes-panel ${expanded ? 'notes-panel--expanded' : ''}`}
    >
      <button
        type="button"
        className="notes-panel-header"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
      >
        <ChevronRight
          className="notes-panel-chevron"
          size={18}
          aria-hidden="true"
        />
        <span className="notes-panel-label">Notes</span>
        {!expanded && hasContent && (
          <span className="notes-panel-indicator" aria-label="Has notes">
            saved
          </span>
        )}
      </button>
      {expanded && (
        <div className="notes-panel-body">
          <textarea
            className="notes-panel-textarea"
            value={noteText}
            onChange={(e) => updateNote(activeTopic, e.target.value)}
            placeholder="Write your notes for this topic..."
            aria-label="Topic notes"
          />
        </div>
      )}
    </div>
  )
}
