# Recordings

A word is spoken from a recording whenever one is sitting in this folder, and
that is the best way for Chloe to hear Mongolian: browsers almost never ship a
Mongolian voice, so without recordings most devices stay silent.

Name the file after the word's `id` in `src/data/words.js`. `Нохой` has the id
`nokhoi`, so its recording goes here as `nokhoi.mp3`. Nothing else needs
changing — the app picks up whatever is in this folder when it starts, and a
word with no recording falls back to a Mongolian text-to-speech voice if the
device has one.

Short clips work best: just the word, with very little silence at either end.
MP3 only, since that is what every browser can play.
