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

function getPolishVoice(): SpeechSynthesisVoice | undefined {
  if (!('speechSynthesis' in window)) return undefined
  if (!voicesCache) voicesCache = window.speechSynthesis.getVoices()
  return voicesCache.find((v) => v.lang?.toLowerCase().startsWith('pl'))
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
  utterance.rate = 0.92
  if (lang === 'pl-PL') {
    const voice = getPolishVoice()
    if (voice) utterance.voice = voice
  }
  window.speechSynthesis.speak(utterance)
}

export function stopSpeaking() {
  stopCurrent()
}
