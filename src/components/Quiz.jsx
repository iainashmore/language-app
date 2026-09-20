import { useCallback, useEffect, useState } from 'react'
import { words, wordsInTopic } from '../data/words.js'
import SpeakButton from './SpeakButton.jsx'

const OPTIONS = 4

const shuffle = (list) => {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

// Wrong answers are drawn from the same topic first, so a question about animals
// offers four animals. Guessing by elimination should not be possible.
function buildQuestion() {
  const answer = words[Math.floor(Math.random() * words.length)]
  const sameTopic = wordsInTopic(answer.topic).filter((w) => w.mn !== answer.mn)
  const elsewhere = words.filter((w) => w.topic !== answer.topic)
  const distractors = [...shuffle(sameTopic), ...shuffle(elsewhere)].slice(0, OPTIONS - 1)

  return {
    answer,
    // Half the questions run English to Mongolian, which is the harder direction.
    askInMongolian: Math.random() < 0.5,
    choices: shuffle([answer, ...distractors]),
  }
}

export default function Quiz() {
  const [question, setQuestion] = useState(buildQuestion)
  const [picked, setPicked] = useState(null)
  const [score, setScore] = useState(0)
  const [asked, setAsked] = useState(0)
  const [streak, setStreak] = useState(0)
  const [best, setBest] = useState(0)

  const next = useCallback(() => {
    setQuestion(buildQuestion())
    setPicked(null)
  }, [])

  // Once an answer is given, move on by itself after a beat, so the game keeps
  // its rhythm without needing a "next" tap every single time.
  useEffect(() => {
    if (!picked) return undefined
    const timer = setTimeout(next, picked.mn === question.answer.mn ? 900 : 2200)
    return () => clearTimeout(timer)
  }, [picked, question, next])

  const choose = (choice) => {
    if (picked) return
    setPicked(choice)
    setAsked((n) => n + 1)
    if (choice.mn === question.answer.mn) {
      setScore((n) => n + 1)
      setStreak((s) => {
        const grown = s + 1
        setBest((b) => Math.max(b, grown))
        return grown
      })
    } else {
      setStreak(0)
    }
  }

  const { answer, choices, askInMongolian } = question

  return (
    <section>
      <div className="scoreboard">
        <span>Score <strong>{score}</strong> / {asked}</span>
        <span className={streak >= 3 ? 'streak-hot' : ''}>
          Streak <strong>{streak}</strong>{streak >= 3 ? ' 🔥' : ''}
        </span>
        <span>Best <strong>{best}</strong></span>
      </div>

      <div className="prompt">
        {/* The picture cue is the answer for topics like colours and numbers, so it
            stays hidden while a Mongolian word is being translated into English.
            In the other direction the English is already on screen, so it gives
            nothing away and is worth showing. */}
        <div className="prompt-emoji" aria-hidden="true">
          {askInMongolian && !picked ? '\u2753' : answer.emoji}
        </div>
        {askInMongolian ? (
          <>
            <div className="prompt-word">
              {answer.mn}
              <SpeakButton word={answer} />
            </div>
            <p className="prompt-ask">What does this mean?</p>
          </>
        ) : (
          <>
            <div className="prompt-word">{answer.en}</div>
            <p className="prompt-ask">How do you say this in Mongolian?</p>
          </>
        )}
      </div>

      <div className="choices">
        {choices.map((choice) => {
          const isAnswer = choice.mn === answer.mn
          const isPicked = picked?.mn === choice.mn
          let state = ''
          if (picked) {
            if (isAnswer) state = 'choice-right'
            else if (isPicked) state = 'choice-wrong'
            else state = 'choice-dim'
          }
          return (
            <button
              key={choice.mn}
              className={`choice ${state}`}
              onClick={() => choose(choice)}
              disabled={Boolean(picked)}
            >
              {askInMongolian ? choice.en : choice.mn}
            </button>
          )
        })}
      </div>

      <div className="feedback" role="status" aria-live="polite">
        {picked && picked.mn === answer.mn && <span className="good">Зөв! That is right.</span>}
        {picked && picked.mn !== answer.mn && (
          <span className="bad">
            Not quite. <strong>{answer.mn}</strong> (“{answer.roman}”) means {answer.en}.
          </span>
        )}
      </div>
    </section>
  )
}
