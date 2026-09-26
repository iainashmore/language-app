// Little synthesised sounds for right and wrong answers, so the game has some
// warmth without shipping any audio files.

let context

function tone({ frequency, startAt, duration, volume }) {
  const oscillator = context.createOscillator()
  const gain = context.createGain()

  oscillator.type = 'sine'
  oscillator.frequency.value = frequency
  gain.gain.setValueAtTime(0, startAt)
  gain.gain.linearRampToValueAtTime(volume, startAt + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration)

  oscillator.connect(gain).connect(context.destination)
  oscillator.start(startAt)
  oscillator.stop(startAt + duration)
}

function play(notes) {
  const AudioContext = window.AudioContext ?? window.webkitAudioContext
  if (!AudioContext) return

  context ??= new AudioContext()
  context.resume()

  const now = context.currentTime
  for (const note of notes) {
    tone({ ...note, startAt: now + note.delay })
  }
}

export function chimeRight() {
  play([
    { frequency: 660, delay: 0, duration: 0.16, volume: 0.18 },
    { frequency: 880, delay: 0.12, duration: 0.26, volume: 0.18 },
  ])
}

export function chimeWrong() {
  play([{ frequency: 200, delay: 0, duration: 0.22, volume: 0.12 }])
}
