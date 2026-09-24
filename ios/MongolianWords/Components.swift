import SwiftUI

// The colours of the web app, so the two feel like the same thing.
enum Palette {
    static let sky = Color(red: 47 / 255, green: 111 / 255, blue: 237 / 255)
    static let grass = Color(red: 23 / 255, green: 153 / 255, blue: 107 / 255)
    static let flame = Color(red: 216 / 255, green: 68 / 255, blue: 60 / 255)
    static let gold = Color(red: 240 / 255, green: 162 / 255, blue: 2 / 255)
    static let card = Color(.secondarySystemGroupedBackground)
    static let screen = Color(.systemGroupedBackground)
}

/// A row of topics to pick from, scrolling sideways when it does not fit.
struct TopicPicker: View {
    let options: [Topic]
    let selection: String
    let onSelect: (String) -> Void

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                ForEach(options) { option in
                    let isOn = option.id == selection
                    Button {
                        onSelect(option.id)
                    } label: {
                        Text("\(option.emoji) \(option.label)")
                            .font(.subheadline.weight(.semibold))
                            .padding(.horizontal, 14)
                            .padding(.vertical, 8)
                            .background(isOn ? Palette.sky : Palette.card, in: Capsule())
                            .foregroundStyle(isOn ? Color.white : Color.primary)
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(.horizontal)
        }
    }
}

/// A speaker to hear the word again, shown only when the device can say it.
struct SpeakButton: View {
    let word: Word
    var size: Font = .title2

    var body: some View {
        if Speaker.shared.canHear(word) {
            Button {
                Speaker.shared.play(word)
            } label: {
                Image(systemName: "speaker.wave.2.fill")
                    .font(size)
                    .foregroundStyle(Palette.sky)
            }
            .buttonStyle(.plain)
            .accessibilityLabel("Say \(word.mn)")
        }
    }
}

/// The state of an answer button once a question has been answered.
enum ChoiceState {
    case open, right, wrong, dimmed

    var background: Color {
        switch self {
        case .open, .dimmed: Palette.card
        case .right: Palette.grass
        case .wrong: Palette.flame
        }
    }

    var foreground: Color {
        switch self {
        case .open: .primary
        case .dimmed: .secondary
        case .right, .wrong: .white
        }
    }
}
