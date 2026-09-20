import { useState } from 'react'
import { alphabet, extraMongolianLetters } from '../data/alphabet.js'

export default function Alphabet() {
  const [selected, setSelected] = useState(null)

  return (
    <section>
      <p className="lede">
        Mongolian is written with 35 letters. Most of them are shared with Russian, and two
        of them — <strong>Ө</strong> and <strong>Ү</strong> — belong to Mongolian alone.
        Tap a letter to see how it is said.
      </p>

      <div className="letter-grid">
        {alphabet.map((letter) => {
          const isExtra = extraMongolianLetters.includes(letter.upper)
          const isOpen = selected?.upper === letter.upper
          return (
            <button
              key={letter.upper}
              className={`letter ${isExtra ? 'letter-extra' : ''} ${isOpen ? 'letter-open' : ''}`}
              onClick={() => setSelected(isOpen ? null : letter)}
            >
              <span className="letter-glyph">{letter.upper}{letter.lower}</span>
            </button>
          )
        })}
      </div>

      {selected && (
        <div className="letter-detail">
          <div className="letter-detail-glyph">{selected.upper} {selected.lower}</div>
          <div>
            <p className="letter-sound">Sounds like {selected.sound}</p>
            {selected.note && <p className="letter-note">{selected.note}</p>}
          </div>
        </div>
      )}
    </section>
  )
}
