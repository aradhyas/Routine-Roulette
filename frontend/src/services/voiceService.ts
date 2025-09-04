// ElevenLabs Voice IDs - Cute and sweet voices
export const VOICE_OPTIONS = {
  'Rachel': 'pNInz6obpgDQGcFmaJgB', // Default female voice
  'Adam': 'pqHfZKP75CvOlQylNhV4',   // Male voice
  'Bella': 'EXAVITQu4vr4xnSDxMaL',  // Soft female voice
  'Antoni': 'ErXwobaYiN019PkySvjV', // Male with accent
  'Elli': 'MF3mGyEYCl7XYWbV9V6O',   // Young female voice - CUTE!
  'Josh': 'TxGEqnHWrfWFTfGW9XjX',   // Calm male voice
  'Arnold': 'VR6AewLTigWG4xSOukaG', // Deep male voice
  'Domi': 'AZnzlk1XvdvUeBnXmlld',   // Energetic female voice
  'Sam': 'yoZ06aMxZJJ28mfd3POQ',    // Neutral voice
  'Freya': 'jsCqWAovK2LkecY7zXl4',  // Sweet, gentle female voice
  'Grace': 'oWAxZDx7w5VEj9dCyTzz',  // Warm, friendly female voice
  'Lily': 'pFZP5JQG7iQjIQuC4Bku',   // Young, cheerful female voice
  // Add custom voice ID here if you create one
  'Custom': 'your_custom_voice_id_here' // Replace with your custom voice ID
}

type VoiceName = keyof typeof VOICE_OPTIONS

class VoiceService {
  private isEnabled: boolean = false
  private useElevenLabs: boolean = false
  private voiceAssignments = {
    taskStart: 'Grace' as VoiceName,    // Warm, friendly voice for starting
    taskComplete: 'Lily' as VoiceName,  // Young, cheerful voice for celebrations
    timeExpired: 'Freya' as VoiceName,  // Sweet, gentle voice for warnings
    taskAbandon: 'Elli' as VoiceName    // Young, cute voice for abandonment
  }
  private apiKey: string | null = null

  constructor() {
    this.isEnabled = 'speechSynthesis' in window
    this.apiKey = (import.meta as any).env?.VITE_ELEVENLABS_API_KEY || null
    this.useElevenLabs = !!this.apiKey
    
    if (!this.isEnabled && !this.useElevenLabs) {
      console.warn('Neither speech synthesis nor ElevenLabs available. Voice features disabled.')
    }
  }

  async announceTaskStart(taskTitle: string): Promise<void> {
    if (!this.isEnabled && !this.useElevenLabs) return
    const text = `Starting task: ${taskTitle}. Good luck!`
    await this.speakWithVoice(text, this.voiceAssignments.taskStart)
  }

  async announceTaskComplete(taskTitle: string): Promise<void> {
    const text = `Great job! You completed ${taskTitle}`
    await this.speakWithVoice(text, this.voiceAssignments.taskComplete)
  }

  async announceTimeExpired(): Promise<void> {
    const text = "Uh oh! Your timer has expired"
    await this.speakWithVoice(text, this.voiceAssignments.timeExpired)
  }

  async announceTaskAbandon(): Promise<void> {
    const text = `The knitting cat is sad`
    await this.speakWithVoice(text, this.voiceAssignments.taskAbandon)
  }

  setVoiceForAction(action: keyof typeof this.voiceAssignments, voiceName: VoiceName): void {
    this.voiceAssignments[action] = voiceName
    console.log(`Voice for ${action} changed to: ${voiceName}`)
  }

  getVoiceAssignments() {
    return { ...this.voiceAssignments }
  }

  getCurrentVoice(): VoiceName {
    return this.voiceAssignments.taskStart // Return default voice
  }

  getAvailableVoices(): VoiceName[] {
    return Object.keys(VOICE_OPTIONS) as VoiceName[]
  }

  private async speakWithVoice(text: string, voiceName: VoiceName): Promise<void> {
    if (!this.isEnabled && !this.useElevenLabs) return
    
    if (this.useElevenLabs && this.apiKey) {
      await this.speakWithElevenLabs(text, voiceName)
    } else {
      this.speakWithBrowser(text)
    }
  }


  private async speakWithElevenLabs(text: string, voiceName: VoiceName): Promise<void> {
    try {
      const voiceId = VOICE_OPTIONS[voiceName]
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey!
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_turbo_v2',
          voice_settings: {
            stability: 0.75,
            similarity_boost: 0.8,
            style: 0.2,
            use_speaker_boost: true
          }
        })
      })

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`)
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      
      return new Promise((resolve, reject) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl)
          resolve()
        }
        audio.onerror = reject
        audio.play().catch(reject)
      })
    } catch (error) {
      console.error('ElevenLabs speech failed, falling back to browser:', error)
      this.speakWithBrowser(text)
    }
  }

  private speakWithBrowser(text: string): void {
    if (!this.isEnabled) return
    
    try {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8
      speechSynthesis.speak(utterance)
    } catch (error) {
      console.error('Browser speech synthesis failed:', error)
    }
  }

  isVoiceEnabled(): boolean {
    return this.isEnabled || this.useElevenLabs
  }

  isUsingElevenLabs(): boolean {
    return this.useElevenLabs
  }
}

export const voiceService = new VoiceService()
