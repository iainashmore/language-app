// The 35 letters of the Mongolian Cyrillic alphabet, in order.
//
// `sound` is a plain-English hint for how the letter is pronounced, written for
// a child rather than for a linguist. `note` is only filled in for the letters
// that do not exist in the English alphabet or that behave unexpectedly.
export const alphabet = [
  { upper: 'А', lower: 'а', sound: 'a as in "father"' },
  { upper: 'Б', lower: 'б', sound: 'b as in "boy"' },
  { upper: 'В', lower: 'в', sound: 'v as in "van"' },
  { upper: 'Г', lower: 'г', sound: 'g as in "go"' },
  { upper: 'Д', lower: 'д', sound: 'd as in "dog"' },
  { upper: 'Е', lower: 'е', sound: 'ye as in "yes"' },
  { upper: 'Ё', lower: 'ё', sound: 'yo as in "yonder"' },
  { upper: 'Ж', lower: 'ж', sound: 'j as in "jam"' },
  { upper: 'З', lower: 'з', sound: 'dz as in "adze"' },
  { upper: 'И', lower: 'и', sound: 'ee as in "see"' },
  { upper: 'Й', lower: 'й', sound: 'y as in "boy"', note: 'Only ever found at the end of a sound, never on its own.' },
  { upper: 'К', lower: 'к', sound: 'k as in "kite"', note: 'Mostly used in words borrowed from other languages.' },
  { upper: 'Л', lower: 'л', sound: 'l, hissed slightly, a bit like "hl"' },
  { upper: 'М', lower: 'м', sound: 'm as in "moon"' },
  { upper: 'Н', lower: 'н', sound: 'n as in "nose"' },
  { upper: 'О', lower: 'о', sound: 'o as in "hot"' },
  { upper: 'Ө', lower: 'ө', sound: 'the "u" in "fur"', note: 'This letter does not exist in Russian or English. It is one of two extra Mongolian letters.' },
  { upper: 'П', lower: 'п', sound: 'p as in "pen"' },
  { upper: 'Р', lower: 'р', sound: 'r, rolled with the tip of the tongue' },
  { upper: 'С', lower: 'с', sound: 's as in "sun"' },
  { upper: 'Т', lower: 'т', sound: 't as in "top"' },
  { upper: 'У', lower: 'у', sound: 'oo as in "book"' },
  { upper: 'Ү', lower: 'ү', sound: 'oo as in "moon", with rounded lips', note: 'The second extra Mongolian letter. Ү and У are different sounds, so they are worth learning as a pair.' },
  { upper: 'Ф', lower: 'ф', sound: 'f as in "fish"', note: 'Mostly used in words borrowed from other languages.' },
  { upper: 'Х', lower: 'х', sound: 'kh, as in the Scottish "loch"' },
  { upper: 'Ц', lower: 'ц', sound: 'ts as in "cats"' },
  { upper: 'Ч', lower: 'ч', sound: 'ch as in "chair"' },
  { upper: 'Ш', lower: 'ш', sound: 'sh as in "shoe"' },
  { upper: 'Щ', lower: 'щ', sound: 'shch, a long "sh"', note: 'Very rare. You will hardly ever meet it.' },
  { upper: 'Ъ', lower: 'ъ', sound: 'makes no sound of its own', note: 'A hard sign. It separates the letters on either side of it.' },
  { upper: 'Ы', lower: 'ы', sound: 'a hard "i", made at the back of the mouth' },
  { upper: 'Ь', lower: 'ь', sound: 'makes no sound of its own', note: 'A soft sign. It softens the letter before it, a bit like adding a tiny "y".' },
  { upper: 'Э', lower: 'э', sound: 'e as in "bed"' },
  { upper: 'Ю', lower: 'ю', sound: 'yu as in "you"' },
  { upper: 'Я', lower: 'я', sound: 'ya as in "yard"' },
]

// The two letters Mongolian adds to the Russian alphabet. Highlighted in the UI
// because they are the ones an English speaker will not have seen before.
export const extraMongolianLetters = ['Ө', 'Ү']
