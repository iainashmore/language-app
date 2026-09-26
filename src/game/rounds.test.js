import { describe, expect, it } from 'vitest'
import { buildRound, CHOICES_PER_QUESTION, QUESTIONS_PER_ROUND } from './rounds.js'
import { topics, words, wordsInTopic } from '../data/words.js'

describe('the word list', () => {
  it('gives every word an id, a picture and all three spellings', () => {
    for (const word of words) {
      expect(word.id, JSON.stringify(word)).toMatch(/^[a-z0-9-]+$/)
      for (const field of ['mn', 'roman', 'en', 'emoji', 'topic']) {
        expect(word[field]?.trim(), `${word.id}.${field}`).toBeTruthy()
      }
      expect(topics.map((topic) => topic.id), word.id).toContain(word.topic)
    }
  })

  it('repeats no id, word or picture', () => {
    const distinct = (field) => new Set(words.map((word) => word[field])).size
    expect(distinct('id')).toBe(words.length)
    expect(distinct('mn')).toBe(words.length)
    // Two words sharing a picture would make a matching question unanswerable.
    expect(distinct('emoji')).toBe(words.length)
  })

  it('has enough words in every topic for a question', () => {
    for (const topic of topics) {
      expect(wordsInTopic(topic.id).length, topic.id).toBeGreaterThanOrEqual(CHOICES_PER_QUESTION)
    }
  })
})

describe('buildRound', () => {
  it('asks the agreed number of questions without repeating a word', () => {
    const round = buildRound(words)
    expect(round).toHaveLength(QUESTIONS_PER_ROUND)
    expect(new Set(round.map((question) => question.answer.id)).size).toBe(QUESTIONS_PER_ROUND)
  })

  it('always offers the right answer among distinct choices', () => {
    for (const question of buildRound(words, { questionCount: words.length })) {
      expect(question.choices).toHaveLength(CHOICES_PER_QUESTION)
      expect(question.choices.map((choice) => choice.id)).toContain(question.answer.id)
      expect(new Set(question.choices.map((choice) => choice.id)).size).toBe(CHOICES_PER_QUESTION)
    }
  })

  it('draws the wrong answers from the same topic', () => {
    for (const question of buildRound(words, { questionCount: words.length })) {
      for (const choice of question.choices) {
        expect(choice.topic, `${question.answer.id} vs ${choice.id}`).toBe(question.answer.topic)
      }
    }
  })

  it('does not hide the answer in the same place every time', () => {
    const places = new Set(
      buildRound(words, { questionCount: words.length }).map((question) =>
        question.choices.findIndex((choice) => choice.id === question.answer.id),
      ),
    )
    expect(places.size).toBeGreaterThan(1)
  })

  it('copes with a word list shorter than a round', () => {
    const round = buildRound(words.slice(0, 3))
    expect(round).toHaveLength(3)
    for (const question of round) {
      expect(question.choices).toHaveLength(3)
    }
  })

  it('refuses a list too short to choose from', () => {
    expect(() => buildRound(words.slice(0, 1))).toThrow()
  })
})
