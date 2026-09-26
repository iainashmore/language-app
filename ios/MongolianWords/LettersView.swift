import SwiftUI

/// All 35 letters of the Mongolian Cyrillic alphabet. The two Mongolian adds to
/// the Russian alphabet are highlighted, since an English speaker will not have
/// met them before.
struct LettersView: View {
    @State private var selected: Letter?

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    Text("Mongolian is written with 35 letters. Most of them are shared with Russian, and two of them, **Ө** and **Ү**, belong to Mongolian alone. Tap a letter to see how it is said.")
                        .foregroundStyle(.secondary)

                    if let selected {
                        detail(selected)
                    }

                    LazyVGrid(columns: [GridItem(.adaptive(minimum: 64), spacing: 10)], spacing: 10) {
                        ForEach(Content.letters) { letter in
                            tile(letter)
                        }
                    }
                }
                .padding()
            }
            .background(Palette.screen)
            .navigationTitle("Letters")
        }
    }

    private func tile(_ letter: Letter) -> some View {
        let isOpen = selected == letter
        return Button {
            withAnimation(.easeInOut(duration: 0.2)) { selected = isOpen ? nil : letter }
        } label: {
            Text("\(letter.upper)\(letter.lower)")
                .font(.title2.weight(.semibold))
                .frame(maxWidth: .infinity, minHeight: 60)
                .background(
                    isOpen ? Palette.sky : (letter.isExtra ? Palette.gold.opacity(0.25) : Palette.card),
                    in: RoundedRectangle(cornerRadius: 14)
                )
                .overlay(
                    RoundedRectangle(cornerRadius: 14)
                        .strokeBorder(letter.isExtra ? Palette.gold : Color.clear, lineWidth: 2)
                )
                .foregroundStyle(isOpen ? Color.white : Color.primary)
        }
        .buttonStyle(.plain)
    }

    private func detail(_ letter: Letter) -> some View {
        HStack(alignment: .top, spacing: 18) {
            Text("\(letter.upper) \(letter.lower)")
                .font(.system(size: 48, weight: .bold))
            VStack(alignment: .leading, spacing: 6) {
                Text("Sounds like \(letter.sound)")
                    .font(.headline)
                if let note = letter.note {
                    Text(note)
                        .foregroundStyle(.secondary)
                }
            }
            Spacer(minLength: 0)
        }
        .padding(20)
        .background(Palette.card, in: RoundedRectangle(cornerRadius: 20))
    }
}
