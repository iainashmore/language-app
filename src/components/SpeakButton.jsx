import { useEffect, useMemo, useState } from 'react'
import { canHear, playWord } from '../audio.js'
import { onVoicesReady } from '../speech.js'

// Shows a speaker button only when this word can actually be said: a recording
// for it, or a genuinely Mongolian voice on the device. When neither exists we
// say nothing rather than offering a button that does nothing, or one that says
// the word in an English accent.
export default function SpeakButton({ word, className = 'speak' }) {
  const [voicesChanged, setVoicesChanged] = useState(0)

  useEffect(() => onVoicesReady(() => setVoicesChanged((n) => n + 1)), [])

  const available = useMemo(() => canHear(word), [word, voicesChanged])
  if (!available) return null

  return (
    <button
      className={className}
      onClick={(event) => {
        event.stopPropagation()
        playWord(word)
      }}
      aria-label={`Say ${word.mn} out loud`}
      title="Say it out loud"
    >
      🔊
    </button>
  )
}
