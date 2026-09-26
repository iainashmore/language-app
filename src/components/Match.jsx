import { useEffect, useState } from 'react'
import { topics, words, wordsInTopic } from '../data/words.js'
import { buildRound } from '../game/rounds.js'
import { canHear, playWord } from '../audio.js'
import { chimeRight, chimeWrong } from '../chime.js'
import SpeakButton from './SpeakButton.jsx'

const ALL = 'all'

// Look at the picture, hear the word, pick the Mongolian spelling. A wrong tap
// costs nothing but a try: the question stays up until it is answered, because
// the point is to end up reading the right word, not to be marked down.
export default function Match() {
  const [set, setSet] = useState(ALL)
  const [round, setRound] = useState(() => buildRound(words))
  const [index, setIndex] = useState(0)
  const [wrongTries, setWrongTries] = useState([])
  const [solved, setSolved] = useState(false)
  const [results, setResults] = useState([])

  const question = round[index]
  const finished = index >= round.length

  const start = (setId = set) => {
    const pool = setId === ALL ? words : wordsInTopic(setId)
    setSet(setId)
    setRound(buildRound(pool))
    setIndex(0)
    setWrongTries([])
    setSolved(false)
    setResults([])
  }

  // Every question says itself as it arrives, so the word is heard as well as
  // read. Browsers that block sound until the page has been tapped simply stay
  // quiet for the first one; the speaker button is right there.
  useEffect(() => {
    if (question) playWord(question.answer)
  }, [question])

  const choose = (choice) => {
    // Once the question is answered, the right word is still worth tapping:
    // it says itself again.
    if (solved) {
      if (choice.id === question.answer.id) playWord(question.answer)
      return
    }

    if (choice.id === question.answer.id) {
      chimeRight()
      setSolved(true)
      setResults((done) => [...done, { word: question.answer, firstTry: wrongTries.length === 0 }])
    } else if (!wrongTries.includes(choice.id)) {
      chimeWrong()
      setWrongTries((tries) => [...tries, choice.id])
    }
  }

  const next = () => {
    setIndex((n) => n + 1)
    setWrongTries([])
    setSolved(false)
  }

  const lastQuestion = index === round.length - 1

  return (
    <section>
      <div className="topic-row">
        {[{ id: ALL, label: 'Everything', emoji: '✨' }, ...topics].map((option) => (
          <button
            key={option.id}
            className={`chip ${option.id === set ? 'chip-on' : ''}`}
            onClick={() => start(option.id)}
          >
            <span aria-hidden="true">{option.emoji}</span> {option.label}
          </button>
        ))}
      </div>

      {finished ? (
        <Scorecard results={results} onPlayAgain={() => start(set)} />
      ) : (
        <Round
          question={question}
          index={index}
          round={round}
          results={results}
          wrongTries={wrongTries}
          solved={solved}
          lastQuestion={lastQuestion}
          onChoose={choose}
          onNext={next}
        />
      )}
    </section>
  )
}

function Round({ question, index, round, results, wrongTries, solved, lastQuestion, onChoose, onNext }) {
  return (
    <>
      <ol className="match-progress" aria-label={`Question ${index + 1} of ${round.length}`}>
        {round.map((_, spot) => {
          const result = results[spot]
          let state = 'match-dot-todo'
          if (result) state = result.firstTry ? 'match-dot-right' : 'match-dot-tried'
          else if (spot === index) state = 'match-dot-now'
          return <li key={spot} className={`match-dot ${state}`} />
        })}
      </ol>

      <div className={`match-picture ${solved ? 'match-picture-right' : ''}`}>
        <div className="match-emoji" aria-label={question.answer.en} role="img">
          {question.answer.emoji}
        </div>
        <SpeakButton word={question.answer} className="match-speak" />
        {/* A picture alone cannot say "thank you" or "four", and the sound is
            what should carry those. Until this device has a voice for the word,
            the English is shown so that every question stays answerable. */}
        {canHear(question.answer) ? (
          <p className="match-ask">Listen, then find the word</p>
        ) : (
          <>
            <p className="match-meaning">{question.answer.en}</p>
            <p className="match-ask">How is this written in Mongolian?</p>
          </>
        )}
      </div>

      <div className="choices match-choices">
        {question.choices.map((choice) => {
          const right = solved && choice.id === question.answer.id
          const wrong = wrongTries.includes(choice.id)
          return (
            <button
              key={choice.id}
              className={`choice match-choice ${right ? 'choice-right' : ''} ${wrong ? 'choice-wrong match-shake' : ''}`}
              onClick={() => onChoose(choice)}
              disabled={solved && !right}
            >
              <span className="match-choice-mn">{choice.mn}</span>
              <span className="match-choice-roman">{choice.roman}</span>
            </button>
          )
        })}
      </div>

      <div className="feedback match-feedback" role="status" aria-live="polite">
        {solved ? (
          <>
            <p className="good">
              Зөв! {question.answer.mn} means {question.answer.en.toLowerCase()}.
            </p>
            <button className="match-next" onClick={onNext} autoFocus>
              {lastQuestion ? 'See how I did →' : 'Next →'}
            </button>
          </>
        ) : (
          wrongTries.length > 0 && <p className="bad">Not that one. Have another look.</p>
        )}
      </div>
    </>
  )
}

function praiseFor(firstTime, asked) {
  if (firstTime === asked) return 'Every single one, first time. Сайн байна!'
  if (firstTime >= asked - 2) return 'Nearly all of them first time.'
  if (firstTime >= asked / 2) return 'More than half of them first time. These are sticking.'
  return 'These are new words. They get easier every round.'
}

function Scorecard({ results, onPlayAgain }) {
  const firstTime = results.filter((result) => result.firstTry).length
  const toPractise = results.filter((result) => !result.firstTry)

  const praise = praiseFor(firstTime, results.length)

  return (
    <div className="match-done">
      <div className="match-score">
        <strong>{firstTime}</strong> out of {results.length} first time
      </div>
      <p className="match-praise">{praise}</p>

      {toPractise.length > 0 && (
        <div className="match-practise">
          <h2>Worth another look</h2>
          <ul>
            {toPractise.map(({ word }) => (
              <li key={word.id}>
                <span className="match-practise-emoji" aria-hidden="true">{word.emoji}</span>
                <span className="match-practise-mn">{word.mn}</span>
                <span className="match-practise-en">{word.roman} · {word.en.toLowerCase()}</span>
                <SpeakButton word={word} />
              </li>
            ))}
          </ul>
        </div>
      )}

      <button className="match-next" onClick={onPlayAgain} autoFocus>
        Play again →
      </button>
      <p className="match-pick-label">or pick another set of words above</p>
    </div>
  )
}
