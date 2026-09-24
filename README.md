# Монгол хэл — learning Mongolian

A small app for learning everyday Mongolian, for the web and for iPhone and iPad, written in **Cyrillic**, the script
used in Mongolia today. Built for a 10-year-old, so it assumes confident reading in
English and no prior contact with Cyrillic at all.

## What it does

**Words** — flashcards grouped into seven topics (hellos, family, animals, numbers,
colours, food, everyday things). The front shows the Mongolian word; tapping the card
shows the English meaning and a rough romanisation to read aloud from.

**Match** — the picture and sound game. A picture appears, the word says itself out
loud, and the round is won by picking the Mongolian word that goes with it. Rounds are
eight questions long and a wrong tap costs nothing but another try, since the point is
to end up reading the right word. Wrong answers come from the same topic, so four
animals cannot be solved by elimination. The scorecard at the end counts the ones got
first time and lists the rest to look at again. A set of words can be picked at the top,
or left on everything.

**Quiz** — a multiple-choice game that runs in both directions: recognising a Mongolian
word, and recalling one from English. Wrong answers are drawn from the same topic, so a
question about animals offers four animals and cannot be solved by elimination. It keeps
a score, a current streak and a best streak.

**Letters** — all 35 letters of the Mongolian Cyrillic alphabet, each with a plain-English
pronunciation hint. The two letters Mongolian adds to the Russian alphabet, **Ө** and
**Ү**, are highlighted, since they are the ones an English speaker will not have met.

## Running it

```sh
npm install
npm run dev      # development server
npm test         # the game's rules and the word list
npm run build    # production build into dist/
npm run preview  # serve the production build
```

React and Vite, no backend, no accounts, no data collected. It is a static site, so
`dist/` can be hosted anywhere. `GITHUB_PAGES=1 npm run build` sets the base path for a
GitHub Pages project site.

## The iPhone and iPad app

`ios/` holds a native SwiftUI version with the same four screens. It reads the same
word list, letters and recordings as the web app, straight from `content/`, so a word
added once shows up in both.

1. Open `ios/MongolianWords.xcodeproj` in Xcode 16 or later.
2. To try it on the simulator, pick an iPhone from the device menu at the top of the
   window and press Run (⌘R).
3. To put it on a real iPhone or iPad, plug it in and pick it from the same menu. The
   first time, open the **MongolianWords** target's **Signing & Capabilities** tab and
   choose your Apple ID under **Team** (Xcode ▸ Settings ▸ Accounts adds one; a free
   Apple ID is enough). If Xcode says the bundle identifier is taken, change it to
   anything unique. On the device, the first launch needs the developer trusted in
   Settings ▸ General ▸ VPN & Device Management, and Developer Mode switched on in
   Settings ▸ Privacy & Security.

Apps signed with a free Apple ID stop opening after seven days; running from Xcode
again renews them. A paid developer account lasts a year and allows TestFlight.

## Adding words

All vocabulary lives in `content/words.json` and all letters in `content/alphabet.json`,
shared by the web and iOS apps.
Adding a word is one line in the list; no screen needs changing. A word needs an id, its
Mongolian spelling, a romanisation, the English meaning, a picture cue and a topic. The
id is the word's short latin name, and is also the filename of its recording.

Give each word a distinct picture: the matching game shows the picture on its own, so two
words sharing one would make a question unanswerable. `npm test` checks this.

## Adding recordings

**No words are recorded yet, and this is the biggest gap.** Pronunciation is the hardest
part of Mongolian for an English speaker, and browsers almost never ship a Mongolian
text-to-speech voice. `src/speech.js` therefore speaks a word *only* when a genuinely
Mongolian voice is installed and stays silent otherwise: reading Mongolian in an English
accent would teach the wrong pronunciation, which is worse than silence.

Recordings by a Mongolian speaker are what fixes that, and the app is ready for them.
Drop an MP3 into `content/recordings` named after the word's id — `нохой` has the id
`nokhoi`, so its recording is `nokhoi.mp3` — and that word is spoken from the recording
everywhere in both apps: the flashcards, the quiz and the matching game. Nothing else
changes. Words without a recording carry on as they are, and a speaker button is only
ever shown for a word the device can actually say.

Until a word can be said out loud, the matching game shows its English meaning under the
picture, so that a word a picture cannot express on its own — "thank you", "four" — is
still a fair question.

## Known gaps

- **Nothing is remembered between sessions.** Scores and progress reset on reload, and
  the app does not know which words have been found hard.
- **No spaced repetition.** Every word is equally likely to come up; words already known
  are not shown less often.
- **No grammar or sentences.** Vowel harmony, cases and word order are what make
  Mongolian genuinely hard, and none of that is touched yet.
- **Writing is not practised.** Reading Cyrillic is covered; typing or writing it is not.
- **Romanisation is approximate.** It is a reading aid for a beginner, not a standard
  transliteration scheme.
