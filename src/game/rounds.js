// Building a round of the matching game. No React and no audio in here, so the
// rules of the game can be tested on their own.

export const QUESTIONS_PER_ROUND = 8
export const CHOICES_PER_QUESTION = 4

function shuffle(list, random) {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

// A round is a short list of questions, each one picture and sound on one side
// and a handful of words to choose between on the other. A word is asked at
// most once per round, so no round ever feels like it is going in circles.
//
// Wrong answers come from the same topic first, exactly as in the quiz: four
// animals cannot be solved by elimination, four random words often can.
export function buildRound(pool, options = {}) {
  const {
    questionCount = QUESTIONS_PER_ROUND,
    choiceCount = CHOICES_PER_QUESTION,
    random = Math.random,
  } = options

  if (pool.length < 2) {
    throw new Error('A round needs at least two words to choose between.')
  }

  const choicesPerQuestion = Math.min(choiceCount, pool.length)
  const targets = shuffle(pool, random).slice(0, Math.min(questionCount, pool.length))

  return targets.map((answer) => {
    const others = pool.filter((word) => word.id !== answer.id)
    const sameTopic = shuffle(others.filter((word) => word.topic === answer.topic), random)
    const elsewhere = shuffle(others.filter((word) => word.topic !== answer.topic), random)
    const distractors = [...sameTopic, ...elsewhere].slice(0, choicesPerQuestion - 1)

    return { answer, choices: shuffle([answer, ...distractors], random) }
  })
}
