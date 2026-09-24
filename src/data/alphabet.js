// The 35 letters of the Mongolian Cyrillic alphabet, in order, read from
// content/alphabet.json, which the iOS app shares.
//
// `sound` is a plain-English hint for how the letter is pronounced, written for
// a child rather than for a linguist. `note` is only filled in for the letters
// that do not exist in the English alphabet or that behave unexpectedly.
import content from '../../content/alphabet.json'

export const alphabet = content.letters

// The two letters Mongolian adds to the Russian alphabet, marked `extra` in the
// list. Highlighted in the UI because they are the ones an English speaker will
// not have seen before.
export const extraMongolianLetters = alphabet.filter((letter) => letter.extra).map((letter) => letter.upper)
