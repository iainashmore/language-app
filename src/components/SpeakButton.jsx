import { useEffect, useState } from 'react'
import { canSpeak, onVoicesReady, speak } from '../speech.js'

// Shows a speaker button only when the browser actually has a Mongolian voice.
// When it does not, we say so plainly rather than offering a button that either
// does nothing or says the word in an English accent.
export default function SpeakButton({ text }) {
  const [available, setAvailable] = useState(canSpeak())

  useEffect(() => onVoicesReady(() => setAvailable(canSpeak())), [])

  if (!available) return null

  return (
    <button
      className="speak"
      onClick={(event) => {
        event.stopPropagation()
        speak(text)
      }}
      aria-label={`Say ${text} out loud`}
      title="Say it out loud"
    >
      🔊
    </button>
  )
}
