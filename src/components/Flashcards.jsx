import { useEffect, useState } from 'react'
import { topics, wordsInTopic } from '../data/words.js'
import SpeakButton from './SpeakButton.jsx'

export default function Flashcards() {
  const [topic, setTopic] = useState(topics[0].id)
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const deck = wordsInTopic(topic)
  const card = deck[index]

  // Starting a new topic always starts at the front of its first card.
  useEffect(() => {
    setIndex(0)
    setFlipped(false)
  }, [topic])

  const move = (step) => {
    setIndex((current) => (current + step + deck.length) % deck.length)
    setFlipped(false)
  }

  return (
    <section>
      <div className="topic-row">
        {topics.map((t) => (
          <button
            key={t.id}
            className={`chip ${t.id === topic ? 'chip-on' : ''}`}
            onClick={() => setTopic(t.id)}
          >
            <span aria-hidden="true">{t.emoji}</span> {t.label}
          </button>
        ))}
      </div>

      <div
        className={`card ${flipped ? 'card-flipped' : ''}`}
        onClick={() => setFlipped((f) => !f)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setFlipped((f) => !f)
          }
        }}
      >
        <div className="card-emoji" aria-hidden="true">{card.emoji}</div>
        {flipped ? (
          <>
            <div className="card-en">{card.en}</div>
            <div className="card-roman">{card.mn} · say it like “{card.roman}”</div>
          </>
        ) : (
          <>
            <div className="card-mn">
              {card.mn}
              <SpeakButton text={card.mn} />
            </div>
            <div className="card-hint">Tap the card to see what it means</div>
          </>
        )}
      </div>

      <div className="card-nav">
        <button className="nav" onClick={() => move(-1)}>← Back</button>
        <span className="counter">{index + 1} of {deck.length}</span>
        <button className="nav" onClick={() => move(1)}>Next →</button>
      </div>
    </section>
  )
}
