// Saying a word out loud, best source first.
//
//   1. a recording in src/recordings, named after the word's id — a real
//      Mongolian speaker beats anything a browser can synthesise
//   2. a Mongolian text-to-speech voice, on the rare device that has one
//   3. silence, which is better than a wrong accent (see speech.js)
//
// The recordings are collected at build time rather than fetched by guessing at
// filenames, so the app always knows exactly which words it can say.
import { canSpeak, speak, stopSpeaking } from './speech.js'

const urls = import.meta.glob('./recordings/*.mp3', {
  eager: true,
  query: '?url',
  import: 'default',
})

const recordings = new Map(
  Object.entries(urls).map(([path, url]) => [path.replace(/^.*\/(.+)\.mp3$/, '$1'), url]),
)

export const hasRecording = (word) => recordings.has(word.id)

// Whether this device can say the word at all, so a silent speaker button is
// never offered.
export const canHear = (word) => hasRecording(word) || canSpeak()

export const recordingCount = recordings.size

let playing = null

export function playWord(word) {
  stopSpeaking()
  playing?.pause()

  const url = recordings.get(word.id)
  if (url) {
    playing = new Audio(url)
    // A play() rejection means the browser blocked autoplay; the child can
    // still tap the speaker, which counts as the interaction it wants.
    playing.play().catch(() => {})
    return 'recording'
  }

  return speak(word.mn) ? 'speech' : 'none'
}
