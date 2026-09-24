import { useEffect, useState } from 'react'
import Alphabet from './components/Alphabet.jsx'
import Flashcards from './components/Flashcards.jsx'
import Match from './components/Match.jsx'
import Quiz from './components/Quiz.jsx'
import { recordingCount } from './audio.js'
import { canSpeak, onVoicesReady } from './speech.js'

const TABS = [
  { id: 'learn', label: 'Words', emoji: '🗂️', view: Flashcards },
  { id: 'match', label: 'Match', emoji: '🖼️', view: Match },
  { id: 'quiz', label: 'Quiz', emoji: '🎯', view: Quiz },
  { id: 'letters', label: 'Letters', emoji: '🔤', view: Alphabet },
]

export default function App() {
  const [tab, setTab] = useState('learn')
  const [silent, setSilent] = useState(() => recordingCount === 0 && !canSpeak())

  // Voice lists arrive after the page loads in most browsers.
  useEffect(() => onVoicesReady(() => setSilent(recordingCount === 0 && !canSpeak())), [])

  const Current = TABS.find((t) => t.id === tab).view

  return (
    <div className="app">
      <header>
        <h1>Монгол хэл</h1>
        <p className="subtitle">Learning Mongolian</p>
      </header>

      <nav className="tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab ${t.id === tab ? 'tab-on' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <span aria-hidden="true">{t.emoji}</span> {t.label}
          </button>
        ))}
      </nav>

      <main>
        <Current />
      </main>

      {silent && (
        <p className="audio-note">
          The words are silent on this device: there are no recordings in the app yet, and
          this browser has no Mongolian voice to fall back on. Dropping MP3s into
          <code> content/recordings</code> is all it takes to give them a voice — see the
          README in that folder.
        </p>
      )}
    </div>
  )
}
