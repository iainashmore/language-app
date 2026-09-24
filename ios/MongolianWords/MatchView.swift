import SwiftUI

private let everything = Topic(id: "all", label: "Everything", emoji: "✨")

/// Look at the picture, hear the word, pick the Mongolian spelling. A wrong tap
/// costs nothing but a try: the question stays up until it is answered, because
/// the point is to end up reading the right word, not to be marked down.
struct MatchView: View {
    private struct Answer {
        let word: Word
        let firstTry: Bool
    }

    @State private var set = everything.id
    @State private var round = Rounds.match(from: Content.words)
    @State private var index = 0
    @State private var wrongTries: [String] = []
    @State private var solved = false
    @State private var results: [Answer] = []

    private var question: MatchQuestion? { index < round.count ? round[index] : nil }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    TopicPicker(options: [everything] + Content.topics, selection: set) { start($0) }

                    Group {
                        if let question {
                            play(question)
                        } else {
                            scorecard
                        }
                    }
                    .padding(.horizontal)
                }
                .padding(.vertical)
            }
            .background(Palette.screen)
            .navigationTitle("Match")
        }
        // Every question says itself as it arrives, so the word is heard as
        // well as read.
        .task(id: question?.id) {
            if let question { Speaker.shared.play(question.answer) }
        }
    }

    private func start(_ setID: String) {
        set = setID
        round = Rounds.match(from: setID == everything.id ? Content.words : Content.words(in: setID))
        index = 0
        wrongTries = []
        solved = false
        results = []
    }

    private func choose(_ choice: Word, in question: MatchQuestion) {
        // Once the question is answered, the right word is still worth tapping:
        // it says itself again.
        if solved {
            if choice.id == question.answer.id { Speaker.shared.play(question.answer) }
            return
        }

        if choice.id == question.answer.id {
            Speaker.shared.chimeRight()
            withAnimation { solved = true }
            results.append(Answer(word: question.answer, firstTry: wrongTries.isEmpty))
        } else if !wrongTries.contains(choice.id) {
            Speaker.shared.chimeWrong()
            withAnimation { wrongTries.append(choice.id) }
        }
    }

    private func next() {
        index += 1
        wrongTries = []
        solved = false
    }

    // MARK: - A question

    @ViewBuilder
    private func play(_ question: MatchQuestion) -> some View {
        progressDots

        VStack(spacing: 10) {
            Text(question.answer.emoji)
                .font(.system(size: 100))
                .accessibilityLabel(question.answer.en)
            SpeakButton(word: question.answer, size: .title)
            // A picture alone cannot say "thank you" or "four", and the sound is
            // what should carry those. Until this device has a voice for the
            // word, the English is shown so every question stays answerable.
            if Speaker.shared.canHear(question.answer) {
                Text("Listen, then find the word")
                    .foregroundStyle(.secondary)
            } else {
                Text(question.answer.en)
                    .font(.title2.weight(.semibold))
                Text("How is this written in Mongolian?")
                    .foregroundStyle(.secondary)
            }
        }
        .padding(24)
        .frame(maxWidth: .infinity)
        .background(Palette.card, in: RoundedRectangle(cornerRadius: 24))
        .overlay(
            RoundedRectangle(cornerRadius: 24)
                .strokeBorder(solved ? Palette.grass : Color.clear, lineWidth: 3)
        )

        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
            ForEach(question.choices) { choice in
                let state = choiceState(choice, in: question)
                Button {
                    choose(choice, in: question)
                } label: {
                    VStack(spacing: 4) {
                        Text(choice.mn)
                            .font(.title3.weight(.bold))
                            .minimumScaleFactor(0.6)
                            .lineLimit(1)
                        Text(choice.roman)
                            .font(.caption)
                            .opacity(0.75)
                    }
                    .padding(.vertical, 16)
                    .padding(.horizontal, 8)
                    .frame(maxWidth: .infinity)
                    .background(state.background, in: RoundedRectangle(cornerRadius: 16))
                    .foregroundStyle(state.foreground)
                }
                .buttonStyle(.plain)
                .disabled(solved && state != .right)
            }
        }

        if solved {
            VStack(spacing: 12) {
                Text("Зөв! \(question.answer.mn) means \(question.answer.en.lowercased()).")
                    .font(.headline)
                    .foregroundStyle(Palette.grass)
                    .multilineTextAlignment(.center)
                Button(index == round.count - 1 ? "See how I did →" : "Next →", action: next)
                    .buttonStyle(.borderedProminent)
                    .controlSize(.large)
            }
        } else if !wrongTries.isEmpty {
            Text("Not that one. Have another look.")
                .font(.headline)
                .foregroundStyle(Palette.flame)
        }
    }

    private func choiceState(_ choice: Word, in question: MatchQuestion) -> ChoiceState {
        if solved && choice.id == question.answer.id { return .right }
        if wrongTries.contains(choice.id) { return .wrong }
        return solved ? .dimmed : .open
    }

    private var progressDots: some View {
        HStack(spacing: 8) {
            ForEach(round.indices, id: \.self) { spot in
                Circle()
                    .fill(dotColour(spot))
                    .frame(width: 12, height: 12)
                    .overlay(Circle().strokeBorder(spot == index ? Palette.sky : Color.clear, lineWidth: 2))
            }
        }
        .accessibilityElement()
        .accessibilityLabel("Question \(index + 1) of \(round.count)")
    }

    private func dotColour(_ spot: Int) -> Color {
        guard spot < results.count else { return Color(.systemGray4) }
        return results[spot].firstTry ? Palette.grass : Palette.gold
    }

    // MARK: - The end of a round

    private var scorecard: some View {
        let firstTime = results.filter(\.firstTry).count
        let toPractise = results.filter { !$0.firstTry }

        return VStack(spacing: 16) {
            Text("\(firstTime) out of \(results.count) first time")
                .font(.title.weight(.bold))
                .multilineTextAlignment(.center)
            Text(praise(firstTime: firstTime, asked: results.count))
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)

            if !toPractise.isEmpty {
                VStack(alignment: .leading, spacing: 12) {
                    Text("Worth another look")
                        .font(.headline)
                    ForEach(toPractise, id: \.word.id) { result in
                        HStack(spacing: 12) {
                            Text(result.word.emoji).font(.title)
                            VStack(alignment: .leading) {
                                Text(result.word.mn).font(.title3.weight(.bold))
                                Text("\(result.word.roman) · \(result.word.en.lowercased())")
                                    .font(.subheadline)
                                    .foregroundStyle(.secondary)
                            }
                            Spacer()
                            SpeakButton(word: result.word)
                        }
                    }
                }
                .padding(20)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(Palette.card, in: RoundedRectangle(cornerRadius: 20))
            }

            Button("Play again →") { start(set) }
                .buttonStyle(.borderedProminent)
                .controlSize(.large)
            Text("or pick another set of words above")
                .font(.footnote)
                .foregroundStyle(.secondary)
        }
    }

    private func praise(firstTime: Int, asked: Int) -> String {
        if firstTime == asked { return "Every single one, first time. Сайн байна!" }
        if firstTime >= asked - 2 { return "Nearly all of them first time." }
        if Double(firstTime) >= Double(asked) / 2 { return "More than half of them first time. These are sticking." }
        return "These are new words. They get easier every round."
    }
}
