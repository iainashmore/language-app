import Foundation

// The words and letters the app teaches. They are read from content/words.json
// and content/alphabet.json at the top of the repository, the same files the
// web app uses, so the two apps never drift apart. Xcode copies them into the
// app when it builds.

struct Topic: Identifiable, Hashable, Decodable, Sendable {
    let id: String
    let label: String
    let emoji: String
}

struct Word: Identifiable, Hashable, Decodable, Sendable {
    let id: String
    /// The word in Mongolian Cyrillic.
    let mn: String
    /// A rough romanisation, to read aloud from.
    let roman: String
    /// The English meaning.
    let en: String
    /// A picture cue, so a word can be recognised before it can be read.
    let emoji: String
    let topic: String
}

struct Letter: Identifiable, Hashable, Decodable, Sendable {
    let upper: String
    let lower: String
    let sound: String
    let note: String?
    let extra: Bool?

    var id: String { upper }

    /// One of the two letters Mongolian adds to the Russian alphabet.
    var isExtra: Bool { extra ?? false }
}

enum Content {
    private struct WordFile: Decodable, Sendable {
        let topics: [Topic]
        let words: [Word]
    }

    private struct AlphabetFile: Decodable, Sendable {
        let letters: [Letter]
    }

    private static let wordFile: WordFile = load("words")

    static let topics: [Topic] = wordFile.topics
    static let words: [Word] = wordFile.words
    static let letters: [Letter] = (load("alphabet") as AlphabetFile).letters

    static func words(in topicID: String) -> [Word] {
        words.filter { $0.topic == topicID }
    }

    private static func load<T: Decodable>(_ name: String) -> T {
        guard let url = Bundle.main.url(forResource: name, withExtension: "json") else {
            fatalError("\(name).json is missing from the app. It comes from the content folder at the top of the repository.")
        }
        do {
            return try JSONDecoder().decode(T.self, from: Data(contentsOf: url))
        } catch {
            fatalError("\(name).json could not be read: \(error)")
        }
    }
}
