import SwiftUI

/// Flashcards by topic. The front shows the Mongolian word; tapping the card
/// shows the English meaning and a romanisation to read aloud from.
struct FlashcardsView: View {
    @State private var topic = Content.topics[0].id
    @State private var index = 0
    @State private var flipped = false

    private var deck: [Word] { Content.words(in: topic) }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    TopicPicker(options: Content.topics, selection: topic) { picked in
                        // A new topic always starts at the front of its first card.
                        topic = picked
                        index = 0
                        flipped = false
                    }

                    card(deck[index])
                        .padding(.horizontal)

                    HStack {
                        Button("← Back") { move(-1) }
                        Spacer()
                        Text("\(index + 1) of \(deck.count)")
                            .foregroundStyle(.secondary)
                            .monospacedDigit()
                        Spacer()
                        Button("Next →") { move(1) }
                    }
                    .font(.headline)
                    .buttonStyle(.bordered)
                    .padding(.horizontal)

                    if Speaker.shared.isSilent {
                        Text("The words are silent for now: there are no recordings in the app yet, and iOS has no Mongolian voice to fall back on. Adding MP3s to content/recordings gives them a voice.")
                            .font(.footnote)
                            .foregroundStyle(.secondary)
                            .padding(.horizontal, 24)
                            .padding(.top, 12)
                    }
                }
                .padding(.vertical)
            }
            .background(Palette.screen)
            .navigationTitle("Монгол хэл")
        }
    }

    private func card(_ word: Word) -> some View {
        VStack(spacing: 14) {
            Text(word.emoji)
                .font(.system(size: 88))
                .accessibilityHidden(true)

            if flipped {
                Text(word.en)
                    .font(.title.weight(.semibold))
                    .multilineTextAlignment(.center)
                Text("\(word.mn) · say it like “\(word.roman)”")
                    .font(.title3)
                    .foregroundStyle(.secondary)
                    .multilineTextAlignment(.center)
            } else {
                HStack(spacing: 12) {
                    Text(word.mn)
                        .font(.system(size: 44, weight: .bold))
                        .multilineTextAlignment(.center)
                        .minimumScaleFactor(0.5)
                    SpeakButton(word: word)
                }
                Text("Tap the card to see what it means")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }
        }
        .padding(28)
        .frame(maxWidth: .infinity, minHeight: 320)
        .background(Palette.card, in: RoundedRectangle(cornerRadius: 24))
        .shadow(color: .black.opacity(0.08), radius: 10, y: 4)
        .contentShape(RoundedRectangle(cornerRadius: 24))
        .onTapGesture {
            withAnimation(.easeInOut(duration: 0.2)) { flipped.toggle() }
        }
        .accessibilityAddTraits(.isButton)
        .accessibilityHint(flipped ? "Shows the Mongolian word" : "Shows what it means")
    }

    private func move(_ step: Int) {
        index = (index + step + deck.count) % deck.count
        flipped = false
    }
}
