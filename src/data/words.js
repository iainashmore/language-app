// The vocabulary the app teaches.
//
// Everything the learner sees comes from this list, so new words can be added
// here without touching any of the screens. Each entry needs:
//   mn      the word in Mongolian Cyrillic
//   roman   a rough romanisation, to read aloud from
//   en      the English meaning
//   emoji   a picture cue, so a word can be recognised before it can be read
//   topic   which set it belongs to (see `topics` below)
export const words = [
  // Greetings and polite words
  { mn: 'Сайн байна уу', roman: 'sain bain uu', en: 'Hello', emoji: '👋', topic: 'greetings' },
  { mn: 'Баяртай', roman: 'bayartai', en: 'Goodbye', emoji: '🤚', topic: 'greetings' },
  { mn: 'Баярлалаа', roman: 'bayarlalaa', en: 'Thank you', emoji: '🙏', topic: 'greetings' },
  { mn: 'Тийм', roman: 'tiim', en: 'Yes', emoji: '✅', topic: 'greetings' },
  { mn: 'Үгүй', roman: 'ügüi', en: 'No', emoji: '❌', topic: 'greetings' },
  { mn: 'Уучлаарай', roman: 'uuchlaarai', en: 'Sorry', emoji: '😔', topic: 'greetings' },

  // Family
  { mn: 'Ээж', roman: 'eej', en: 'Mum', emoji: '👩', topic: 'family' },
  { mn: 'Аав', roman: 'aav', en: 'Dad', emoji: '👨', topic: 'family' },
  { mn: 'Эгч', roman: 'egch', en: 'Older sister', emoji: '👧', topic: 'family' },
  { mn: 'Ах', roman: 'akh', en: 'Older brother', emoji: '👦', topic: 'family' },
  { mn: 'Дүү', roman: 'düü', en: 'Younger brother or sister', emoji: '🧒', topic: 'family' },
  { mn: 'Гэр бүл', roman: 'ger bül', en: 'Family', emoji: '👨‍👩‍👧', topic: 'family' },
  { mn: 'Найз', roman: 'naiz', en: 'Friend', emoji: '🧑‍🤝‍🧑', topic: 'family' },

  // Animals
  { mn: 'Морь', roman: "mor'", en: 'Horse', emoji: '🐴', topic: 'animals' },
  { mn: 'Нохой', roman: 'nokhoi', en: 'Dog', emoji: '🐕', topic: 'animals' },
  { mn: 'Муур', roman: 'muur', en: 'Cat', emoji: '🐈', topic: 'animals' },
  { mn: 'Хонь', roman: "khon'", en: 'Sheep', emoji: '🐑', topic: 'animals' },
  { mn: 'Тэмээ', roman: 'temee', en: 'Camel', emoji: '🐫', topic: 'animals' },
  { mn: 'Үхэр', roman: 'ükher', en: 'Cow', emoji: '🐄', topic: 'animals' },
  { mn: 'Ямаа', roman: 'yamaa', en: 'Goat', emoji: '🐐', topic: 'animals' },
  { mn: 'Шувуу', roman: 'shuvuu', en: 'Bird', emoji: '🐦', topic: 'animals' },

  // Numbers one to ten
  { mn: 'Нэг', roman: 'neg', en: 'One', emoji: '1️⃣', topic: 'numbers' },
  { mn: 'Хоёр', roman: 'khoyor', en: 'Two', emoji: '2️⃣', topic: 'numbers' },
  { mn: 'Гурав', roman: 'gurav', en: 'Three', emoji: '3️⃣', topic: 'numbers' },
  { mn: 'Дөрөв', roman: 'döröv', en: 'Four', emoji: '4️⃣', topic: 'numbers' },
  { mn: 'Тав', roman: 'tav', en: 'Five', emoji: '5️⃣', topic: 'numbers' },
  { mn: 'Зургаа', roman: 'zurgaa', en: 'Six', emoji: '6️⃣', topic: 'numbers' },
  { mn: 'Долоо', roman: 'doloo', en: 'Seven', emoji: '7️⃣', topic: 'numbers' },
  { mn: 'Найм', roman: 'naim', en: 'Eight', emoji: '8️⃣', topic: 'numbers' },
  { mn: 'Ес', roman: 'yes', en: 'Nine', emoji: '9️⃣', topic: 'numbers' },
  { mn: 'Арав', roman: 'arav', en: 'Ten', emoji: '🔟', topic: 'numbers' },

  // Colours
  { mn: 'Улаан', roman: 'ulaan', en: 'Red', emoji: '🔴', topic: 'colours' },
  { mn: 'Цэнхэр', roman: 'tsenkher', en: 'Blue', emoji: '🔵', topic: 'colours' },
  { mn: 'Шар', roman: 'shar', en: 'Yellow', emoji: '🟡', topic: 'colours' },
  { mn: 'Ногоон', roman: 'nogoon', en: 'Green', emoji: '🟢', topic: 'colours' },
  { mn: 'Хар', roman: 'khar', en: 'Black', emoji: '⚫', topic: 'colours' },
  { mn: 'Цагаан', roman: 'tsagaan', en: 'White', emoji: '⚪', topic: 'colours' },

  // Food and drink
  { mn: 'Ус', roman: 'us', en: 'Water', emoji: '💧', topic: 'food' },
  { mn: 'Сүү', roman: 'süü', en: 'Milk', emoji: '🥛', topic: 'food' },
  { mn: 'Цай', roman: 'tsai', en: 'Tea', emoji: '🍵', topic: 'food' },
  { mn: 'Талх', roman: 'talkh', en: 'Bread', emoji: '🍞', topic: 'food' },
  { mn: 'Мах', roman: 'makh', en: 'Meat', emoji: '🍖', topic: 'food' },
  { mn: 'Алим', roman: 'alim', en: 'Apple', emoji: '🍎', topic: 'food' },

  // Everyday things
  { mn: 'Гэр', roman: 'ger', en: 'Home (also: a ger, the round felt tent)', emoji: '🏠', topic: 'everyday' },
  { mn: 'Ном', roman: 'nom', en: 'Book', emoji: '📖', topic: 'everyday' },
  { mn: 'Сургууль', roman: "surguul'", en: 'School', emoji: '🏫', topic: 'everyday' },
  { mn: 'Нар', roman: 'nar', en: 'Sun', emoji: '☀️', topic: 'everyday' },
  { mn: 'Сар', roman: 'sar', en: 'Moon (also: month)', emoji: '🌙', topic: 'everyday' },
  { mn: 'Мод', roman: 'mod', en: 'Tree', emoji: '🌳', topic: 'everyday' },
]

export const topics = [
  { id: 'greetings', label: 'Hellos', emoji: '👋' },
  { id: 'family', label: 'Family', emoji: '👨‍👩‍👧' },
  { id: 'animals', label: 'Animals', emoji: '🐴' },
  { id: 'numbers', label: 'Numbers', emoji: '🔢' },
  { id: 'colours', label: 'Colours', emoji: '🎨' },
  { id: 'food', label: 'Food', emoji: '🍎' },
  { id: 'everyday', label: 'Everyday', emoji: '🏠' },
]

export const wordsInTopic = (topicId) => words.filter((w) => w.topic === topicId)
