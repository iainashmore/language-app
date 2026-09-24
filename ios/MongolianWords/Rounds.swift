import Foundation

// The rules of the two games, kept apart from the screens. They follow
// src/game/rounds.js in the web app.

struct MatchQuestion: Identifiable {
    let id = UUID()
    let answer: Word
    let choices: [Word]
}

struct QuizQuestion: Identifiable {
    let id = UUID()
    let answer: Word
    /// Half the questions run English to Mongolian, which is the harder direction.
    let askInMongolian: Bool
    let choices: [Word]
}

enum Rounds {
    static let questionsPerRound = 8
    static let choicesPerQuestion = 4

    /// A round of the matching game: a word is asked at most once per round, so
    /// no round ever feels like it is going in circles.
    static func match(from pool: [Word]) -> [MatchQuestion] {
        precondition(pool.count >= 2, "A round needs at least two words to choose between.")
        let perQuestion = min(choicesPerQuestion, pool.count)
        return pool.shuffled().prefix(questionsPerRound).map { answer in
            MatchQuestion(answer: answer, choices: choices(for: answer, from: pool, count: perQuestion))
        }
    }

    static func quizQuestion(from pool: [Word] = Content.words) -> QuizQuestion {
        let answer = pool.randomElement()!
        return QuizQuestion(
            answer: answer,
            askInMongolian: Bool.random(),
            choices: choices(for: answer, from: pool, count: choicesPerQuestion)
        )
    }

    /// Wrong answers come from the same topic first: four animals cannot be
    /// solved by elimination, four random words often can.
    private static func choices(for answer: Word, from pool: [Word], count: Int) -> [Word] {
        let others = pool.filter { $0.id != answer.id }
        let sameTopic = others.filter { $0.topic == answer.topic }.shuffled()
        let elsewhere = others.filter { $0.topic != answer.topic }.shuffled()
        let distractors = (sameTopic + elsewhere).prefix(count - 1)
        return ([answer] + distractors).shuffled()
    }
}
