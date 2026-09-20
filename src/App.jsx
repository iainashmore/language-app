import { useState } from 'react'
import Alphabet from './components/Alphabet.jsx'
import Flashcards from './components/Flashcards.jsx'
import Quiz from './components/Quiz.jsx'
import { canSpeak } from './speech.js'

const TABS = [
  { id: 'learn', label: 'Words', emoji: '🗂️', view: Flashcards },
  { id: 'play', label: 'Play', emoji: '🎯', view: Quiz },
  { id: 'letters', label: 'Letters', emoji: '🔤', view: Alphabet },
]

export default function App() {
  const [tab, setTab] = useState('learn')
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

      {!canSpeak() && (
        <p className="audio-note">
          This browser has no Mongolian voice installed, so the words are silent for now.
          Recordings by a Mongolian speaker are the next thing to add.
        </p>
      )}
    </div>
  )
}
