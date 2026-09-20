# Монгол хэл — learning Mongolian

A small web app for learning everyday Mongolian, written in **Cyrillic**, the script
used in Mongolia today. Built for a 10-year-old, so it assumes confident reading in
English and no prior contact with Cyrillic at all.

## What it does

**Words** — flashcards grouped into seven topics (hellos, family, animals, numbers,
colours, food, everyday things). The front shows the Mongolian word; tapping the card
shows the English meaning and a rough romanisation to read aloud from.

**Play** — a multiple-choice game that runs in both directions: recognising a Mongolian
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
npm run build    # production build into dist/
npm run preview  # serve the production build
```

React and Vite, no backend, no accounts, no data collected. It is a static site, so
`dist/` can be hosted anywhere. `GITHUB_PAGES=1 npm run build` sets the base path for a
GitHub Pages project site.

## Adding words

All vocabulary lives in `src/data/words.js` and all letters in `src/data/alphabet.js`.
Adding a word is one line in the list; no screen needs changing. A word needs its
Mongolian spelling, a romanisation, the English meaning, a picture cue and a topic.

## Known gaps

**There is no audio yet, and this is the biggest one.** Pronunciation is the hardest part
of Mongolian for an English speaker, and the app currently only describes sounds in
writing. Browsers almost never ship a Mongolian text-to-speech voice, so `src/speech.js`
speaks a word *only* when a genuinely Mongolian voice is installed and stays silent
otherwise — reading Mongolian in an English accent would teach the wrong pronunciation,
which is worse than silence. The real fix is recorded audio from a Mongolian speaker,
one clip per word, played back from the same data file.

Other things not built yet:

- **Nothing is remembered between sessions.** Scores and progress reset on reload, and
  the app does not know which words have been found hard.
- **No spaced repetition.** Every word is equally likely to come up; words already known
  are not shown less often.
- **No grammar or sentences.** Vowel harmony, cases and word order are what make
  Mongolian genuinely hard, and none of that is touched yet.
- **Writing is not practised.** Reading Cyrillic is covered; typing or writing it is not.
- **Romanisation is approximate.** It is a reading aid for a beginner, not a standard
  transliteration scheme.
