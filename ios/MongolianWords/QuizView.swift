import SwiftUI

/// Multiple choice in both directions: recognising a Mongolian word, and
/// recalling one from English. Keeps a score, a streak and a best streak.
struct QuizView: View {
    @State private var question = Rounds.quizQuestion()
    @State private var picked: Word?
    @State private var score = 0
    @State private var asked = 0
    @State private var streak = 0
    @State private var best = 0

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    scoreboard
                    prompt
                    choices
                    feedback
                }
                .padding()
            }
            .background(Palette.screen)
            .navigationTitle("Quiz")
        }
        // Once an answer is given, move on by itself after a beat, so the game
        // keeps its rhythm without a "next" tap every single time.
        .task(id: picked?.id) {
            guard let picked else { return }
            let pause = picked.id == question.answer.id ? 900 : 2200
            try? await Task.sleep(for: .milliseconds(pause))
            if !Task.isCancelled { next() }
        }
    }

    private func choose(_ choice: Word) {
        guard picked == nil else { return }
        picked = choice
        asked += 1
        if choice.id == question.answer.id {
            Speaker.shared.chimeRight()
            score += 1
            streak += 1
            best = max(best, streak)
        } else {
            Speaker.shared.chimeWrong()
            streak = 0
        }
    }

    private func next() {
        question = Rounds.quizQuestion()
        picked = nil
    }

    private var scoreboard: some View {
        HStack {
            Text("Score **\(score)** / \(asked)")
            Spacer()
            Text("Streak **\(streak)**\(streak >= 3 ? " 🔥" : "")")
                .foregroundStyle(streak >= 3 ? Palette.flame : Color.primary)
            Spacer()
            Text("Best **\(best)**")
        }
        .monospacedDigit()
        .padding()
        .background(Palette.card, in: RoundedRectangle(cornerRadius: 16))
    }

    private var prompt: some View {
        VStack(spacing: 10) {
            // The picture is the answer for topics like colours and numbers, so it
            // stays hidden while a Mongolian word is being translated into English.
            // In the other direction the English is already on screen, so it gives
            // nothing away.
            Text(question.askInMongolian && picked == nil ? "❓" : question.answer.emoji)
                .font(.system(size: 64))
                .accessibilityHidden(true)

            if question.askInMongolian {
                HStack(spacing: 12) {
                    Text(question.answer.mn)
                        .font(.system(size: 36, weight: .bold))
                        .minimumScaleFactor(0.5)
                    SpeakButton(word: question.answer)
                }
                Text("What does this mean?")
                    .foregroundStyle(.secondary)
            } else {
                Text(question.answer.en)
                    .font(.system(size: 30, weight: .bold))
                    .multilineTextAlignment(.center)
                Text("How do you say this in Mongolian?")
                    .foregroundStyle(.secondary)
            }
        }
        .padding(24)
        .frame(maxWidth: .infinity)
        .background(Palette.card, in: RoundedRectangle(cornerRadius: 24))
    }

    private var choices: some View {
        VStack(spacing: 10) {
            ForEach(question.choices) { choice in
                let state = choiceState(choice)
                Button {
                    choose(choice)
                } label: {
                    Text(question.askInMongolian ? choice.en : choice.mn)
                        .font(.title3.weight(.semibold))
                        .multilineTextAlignment(.center)
                        .padding(.vertical, 14)
                        .padding(.horizontal)
                        .frame(maxWidth: .infinity)
                        .background(state.background, in: RoundedRectangle(cornerRadius: 14))
                        .foregroundStyle(state.foreground)
                }
                .buttonStyle(.plain)
                .disabled(picked != nil)
            }
        }
        .id(question.id)
    }

    private func choiceState(_ choice: Word) -> ChoiceState {
        guard let picked else { return .open }
        if choice.id == question.answer.id { return .right }
        return choice.id == picked.id ? .wrong : .dimmed
    }

    @ViewBuilder
    private var feedback: some View {
        if let picked {
            if picked.id == question.answer.id {
                Text("Зөв! That is right.")
                    .font(.headline)
                    .foregroundStyle(Palette.grass)
            } else {
                Text("Not quite. **\(question.answer.mn)** (“\(question.answer.roman)”) means \(question.answer.en).")
                    .foregroundStyle(Palette.flame)
                    .multilineTextAlignment(.center)
            }
        }
    }
}
