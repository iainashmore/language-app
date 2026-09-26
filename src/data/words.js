// The vocabulary the app teaches.
//
// The list itself lives in content/words.json, which the iOS app reads too, so
// the two apps always teach the same words. Adding a word is one line there;
// no screen needs changing. Each entry needs:
//   id      the word's short latin name, also the filename of its recording
//   mn      the word in Mongolian Cyrillic
//   roman   a rough romanisation, to read aloud from
//   en      the English meaning
//   emoji   a picture cue, so a word can be recognised before it can be read
//   topic   which set it belongs to (see `topics` in the same file)
import content from '../../content/words.json'

export const { words, topics } = content

export const wordsInTopic = (topicId) => words.filter((w) => w.topic === topicId)
