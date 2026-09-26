// Speaking the words out loud.
//
// Browsers ship text-to-speech voices for a fixed list of languages, and
// Mongolian is almost never one of them. Reading Mongolian with an English
// voice would teach the wrong pronunciation, which is worse than silence, so we
// only ever speak when a genuinely Mongolian voice is installed.
//
// Everything below is a stop-gap. Recorded audio from a Mongolian speaker is
// what this should eventually use; see the README.
const MONGOLIAN = /^mn(-|$)/i

const voices = () =>
  typeof window !== 'undefined' && window.speechSynthesis
    ? window.speechSynthesis.getVoices()
    : []

export const mongolianVoice = () => voices().find((v) => MONGOLIAN.test(v.lang)) || null

export const canSpeak = () => mongolianVoice() !== null

export const stopSpeaking = () => window.speechSynthesis?.cancel()

export function speak(text) {
  const voice = mongolianVoice()
  if (!voice) return false
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.voice = voice
  utterance.lang = voice.lang
  utterance.rate = 0.85 // a little slower than normal, for a learner
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
  return true
}

// Voice lists load asynchronously in most browsers, so screens need to re-render
// once they arrive. Returns an unsubscribe function.
export function onVoicesReady(callback) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return () => {}
  window.speechSynthesis.addEventListener('voiceschanged', callback)
  return () => window.speechSynthesis.removeEventListener('voiceschanged', callback)
}
