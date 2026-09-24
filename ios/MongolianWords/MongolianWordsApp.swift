import SwiftUI

@main
struct MongolianWordsApp: App {
    var body: some Scene {
        WindowGroup {
            RootView()
        }
    }
}

struct RootView: View {
    var body: some View {
        TabView {
            FlashcardsView()
                .tabItem { Label("Words", systemImage: "rectangle.stack") }
            MatchView()
                .tabItem { Label("Match", systemImage: "photo") }
            QuizView()
                .tabItem { Label("Quiz", systemImage: "target") }
            LettersView()
                .tabItem { Label("Letters", systemImage: "character.book.closed") }
        }
        .tint(Palette.sky)
    }
}
