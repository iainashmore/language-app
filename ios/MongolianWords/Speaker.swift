import AVFoundation
import UIKit

// Saying a word out loud, best source first:
//
//   1. a recording in content/recordings, named after the word's id, since a
//      real Mongolian speaker beats anything a phone can synthesise
//   2. a Mongolian text-to-speech voice, should the device ever have one
//   3. silence, which is better than reading Mongolian in an English accent
@MainActor
final class Speaker {
    static let shared = Speaker()

    private let synthesizer = AVSpeechSynthesizer()
    private let mongolianVoice = AVSpeechSynthesisVoice.speechVoices()
        .first { $0.language.lowercased().hasPrefix("mn") }
    private var player: AVAudioPlayer?
    private var chimePlayer: AVAudioPlayer?

    private init() {
        // Play even with the ring switch on silent: hearing the word is the point.
        try? AVAudioSession.sharedInstance().setCategory(.playback, options: [.mixWithOthers])
    }

    /// Whether no word at all can be said on this device.
    var isSilent: Bool {
        mongolianVoice == nil && (Bundle.main.urls(forResourcesWithExtension: "mp3", subdirectory: nil) ?? []).isEmpty
    }

    /// Whether this device can say the word, so a silent speaker button is
    /// never offered.
    func canHear(_ word: Word) -> Bool {
        recording(for: word) != nil || mongolianVoice != nil
    }

    func play(_ word: Word) {
        synthesizer.stopSpeaking(at: .immediate)
        player?.stop()

        if let url = recording(for: word), let recording = try? AVAudioPlayer(contentsOf: url) {
            player = recording
            recording.play()
        } else if let mongolianVoice {
            let utterance = AVSpeechUtterance(string: word.mn)
            utterance.voice = mongolianVoice
            utterance.rate = AVSpeechUtteranceDefaultSpeechRate * 0.85
            synthesizer.speak(utterance)
        }
    }

    func chimeRight() {
        UINotificationFeedbackGenerator().notificationOccurred(.success)
        chime(Self.rightSound)
    }

    func chimeWrong() {
        UINotificationFeedbackGenerator().notificationOccurred(.warning)
        chime(Self.wrongSound)
    }

    private func recording(for word: Word) -> URL? {
        Bundle.main.url(forResource: word.id, withExtension: "mp3")
            ?? Bundle.main.url(forResource: word.id, withExtension: "mp3", subdirectory: "recordings")
    }

    private func chime(_ sound: Data) {
        chimePlayer = try? AVAudioPlayer(data: sound)
        chimePlayer?.volume = 0.6
        chimePlayer?.play()
    }

    // The same two little tones as the web app: a rising pair for right, one low
    // note for wrong. Made on the fly so the app ships no sound files of its own.
    private static let rightSound = tones([
        Tone(frequency: 660, delay: 0, duration: 0.16, volume: 0.35),
        Tone(frequency: 880, delay: 0.12, duration: 0.26, volume: 0.35),
    ])

    private static let wrongSound = tones([
        Tone(frequency: 200, delay: 0, duration: 0.22, volume: 0.25),
    ])

    private struct Tone {
        let frequency: Double
        let delay: Double
        let duration: Double
        let volume: Double
    }

    /// A mono 16-bit WAV file holding the given sine tones.
    private static func tones(_ notes: [Tone]) -> Data {
        let rate = 44_100.0
        let length = notes.map { $0.delay + $0.duration }.max() ?? 0
        var samples = [Double](repeating: 0, count: Int(length * rate) + 1)

        for note in notes {
            let start = Int(note.delay * rate)
            for i in 0..<Int(note.duration * rate) where start + i < samples.count {
                let t = Double(i) / rate
                let attack = min(t / 0.02, 1)
                let fade = pow(0.0001, t / note.duration)
                samples[start + i] += sin(2 * .pi * note.frequency * t) * note.volume * attack * fade
            }
        }

        let pcm = samples.map { Int16(max(-1, min(1, $0)) * Double(Int16.max)) }
        var data = Data()
        func append(_ text: String) { data.append(contentsOf: Array(text.utf8)) }
        func append32(_ value: UInt32) { withUnsafeBytes(of: value.littleEndian) { data.append(contentsOf: $0) } }
        func append16(_ value: UInt16) { withUnsafeBytes(of: value.littleEndian) { data.append(contentsOf: $0) } }

        append("RIFF")
        append32(UInt32(36 + pcm.count * 2))
        append("WAVE")
        append("fmt ")
        append32(16)
        append16(1) // PCM
        append16(1) // mono
        append32(UInt32(rate))
        append32(UInt32(rate) * 2)
        append16(2)
        append16(16)
        append("data")
        append32(UInt32(pcm.count * 2))
        for sample in pcm {
            append16(UInt16(bitPattern: sample))
        }
        return data
    }
}
