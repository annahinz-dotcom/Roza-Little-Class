// Audio guidance for Róża Mode.
//
// Every spoken prompt in the app goes through speak(key, fallbackText) —
// never window.speechSynthesis directly from a component. Today every key
// falls through to Polish speech synthesis. Later, real recordings can be
// dropped into AUDIO_FILES below (id -> URL of a recorded clip) and this
// file will prefer the recording over synthesis automatically, with zero
// changes needed in any activity screen.

const AUDIO_FILES: Partial<Record<string, string>> = {
  // e.g. 'hello-roza': '/roza-mode/audio/hello-roza.mp3'
}

let currentAudio: HTMLAudioElement | null = null

function stopCurrent() {
  if (currentAudio) {
    currentAudio.pause()
    currentAudio = null
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}

let voicesCache: SpeechSynthesisVoice[] | null = null

// Names commonly used for warmer, female-sounding Polish system/browser
// voices. If the device has one of these, prefer it — it reads gentler
// than most default engine voices.
const PREFERRED_VOICE_NAMES = ['zosia', 'ewa', 'google polski', 'polski', 'agnieszka', 'paulina']

function getPolishVoice(): SpeechSynthesisVoice | undefined {
  if (!('speechSynthesis' in window)) return undefined
  if (!voicesCache) voicesCache = window.speechSynthesis.getVoices()
  const polish = voicesCache.filter((v) => v.lang?.toLowerCase().startsWith('pl'))
  const preferred = polish.find((v) => PREFERRED_VOICE_NAMES.some((name) => v.name.toLowerCase().includes(name)))
  return preferred ?? polish[0]
}

/**
 * Speaks a prompt. `key` looks up a recorded file first (once any exist);
 * `text` is what gets spoken via Polish TTS otherwise, and is required so
 * there's always a working fallback. `lang` defaults to Polish; pass 'en-US'
 * for the English colour-activity target words.
 */
export function speak(key: string, text: string, lang: 'pl-PL' | 'en-US' = 'pl-PL') {
  stopCurrent()

  const recorded = AUDIO_FILES[key]
  if (recorded) {
    currentAudio = new Audio(recorded)
    currentAudio.play().catch(() => {
      // fall through to synthesis if playback fails (e.g. file missing)
      speakWithSynthesis(text, lang)
    })
    return
  }

  speakWithSynthesis(text, lang)
}

function speakWithSynthesis(text: string, lang: 'pl-PL' | 'en-US') {
  if (!('speechSynthesis' in window)) return
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang
  // Slower and a touch higher-pitched reads as noticeably gentler/warmer
  // than the engine defaults, which tend to sound flat or harsh.
  utterance.rate = 0.82
  utterance.pitch = 1.15
  utterance.volume = 0.9
  if (lang === 'pl-PL') {
    const voice = getPolishVoice()
    if (voice) utterance.voice = voice
  }
  window.speechSynthesis.speak(utterance)
}

export function stopSpeaking() {
  stopCurrent()
}
