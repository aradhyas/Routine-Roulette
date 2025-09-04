import { useState, useEffect } from 'react'
import { voiceService, VOICE_OPTIONS } from '../services/voiceService'

type VoiceName = keyof typeof VOICE_OPTIONS

export function VoiceSettings() {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false)
  const [isUsingElevenLabs, setIsUsingElevenLabs] = useState(false)
  const [voiceAssignments, setVoiceAssignments] = useState<any>({})
  const [availableVoices, setAvailableVoices] = useState<VoiceName[]>([])

  useEffect(() => {
    setIsVoiceEnabled(voiceService.isVoiceEnabled())
    setIsUsingElevenLabs(voiceService.isUsingElevenLabs())
    setVoiceAssignments(voiceService.getVoiceAssignments())
    setAvailableVoices(voiceService.getAvailableVoices())
  }, [])

  const testTaskStart = async () => {
    await voiceService.announceTaskStart('Test task')
  }

  const testTaskComplete = async () => {
    await voiceService.announceTaskComplete('Test task')
  }

  const testTimeExpired = async () => {
    await voiceService.announceTimeExpired()
  }

  const testTaskAbandon = async () => {
    await voiceService.announceTaskAbandon()
  }

  const handleVoiceChange = (action: string, voiceName: VoiceName) => {
    voiceService.setVoiceForAction(action as any, voiceName)
    setVoiceAssignments(voiceService.getVoiceAssignments())
  }

  return (
    <div className="voice-settings">
      <div className="setting-row">
        <span className="setting-label">🔊 Voice Announcements</span>
        <div className="setting-status">
          {isVoiceEnabled ? (
            <span className="status-enabled">
              ✅ {isUsingElevenLabs ? 'ElevenLabs' : 'Browser'}
            </span>
          ) : (
            <span className="status-disabled">❌ Not Available</span>
          )}
        </div>
      </div>
      
      {isVoiceEnabled && isUsingElevenLabs && (
        <>
          <div className="voice-assignments">
            <h4>🎭 Voice Assignments</h4>
            
            <div className="voice-assignment-row">
              <span className="assignment-label">🚀 Task Start:</span>
              <select 
                value={voiceAssignments.taskStart || 'Josh'} 
                onChange={(e) => handleVoiceChange('taskStart', e.target.value as VoiceName)}
                className="voice-selector"
              >
                {availableVoices.map(voice => (
                  <option key={voice} value={voice}>
                    {voice} {getVoiceDescription(voice)}
                  </option>
                ))}
              </select>
              <button onClick={testTaskStart} className="btn btn-sm">🎵</button>
            </div>

            <div className="voice-assignment-row">
              <span className="assignment-label">🎉 Task Complete:</span>
              <select 
                value={voiceAssignments.taskComplete || 'Domi'} 
                onChange={(e) => handleVoiceChange('taskComplete', e.target.value as VoiceName)}
                className="voice-selector"
              >
                {availableVoices.map(voice => (
                  <option key={voice} value={voice}>
                    {voice} {getVoiceDescription(voice)}
                  </option>
                ))}
              </select>
              <button onClick={testTaskComplete} className="btn btn-sm">🎵</button>
            </div>

            <div className="voice-assignment-row">
              <span className="assignment-label">⏰ Time Expired:</span>
              <select 
                value={voiceAssignments.timeExpired || 'Arnold'} 
                onChange={(e) => handleVoiceChange('timeExpired', e.target.value as VoiceName)}
                className="voice-selector"
              >
                {availableVoices.map(voice => (
                  <option key={voice} value={voice}>
                    {voice} {getVoiceDescription(voice)}
                  </option>
                ))}
              </select>
              <button onClick={testTimeExpired} className="btn btn-sm">🎵</button>
            </div>

            <div className="voice-assignment-row">
              <span className="assignment-label">😿 Task Abandon:</span>
              <select 
                value={voiceAssignments.taskAbandon || 'Bella'} 
                onChange={(e) => handleVoiceChange('taskAbandon', e.target.value as VoiceName)}
                className="voice-selector"
              >
                {availableVoices.map(voice => (
                  <option key={voice} value={voice}>
                    {voice} {getVoiceDescription(voice)}
                  </option>
                ))}
              </select>
              <button onClick={testTaskAbandon} className="btn btn-sm">🎵</button>
            </div>
          </div>
        </>
      )}
      
      {isVoiceEnabled && !isUsingElevenLabs && (
        <div className="setting-row">
          <button 
            className="btn btn-outline btn-sm" 
            onClick={testTaskStart}
          >
            🎵 Test Voice
          </button>
        </div>
      )}
      
      <div className="setting-description">
        {isUsingElevenLabs ? (
          <>
            Using ElevenLabs AI voices for high-quality speech. 
            Voice announcements will speak when you start tasks, complete them, or when time expires.
          </>
        ) : (
          'Using browser speech synthesis. Voice announcements will speak when you start tasks, complete them, or when time expires.'
        )}
      </div>
    </div>
  )
}

function getVoiceDescription(voice: VoiceName): string {
  const descriptions: Record<VoiceName, string> = {
    'Rachel': '(Default female)',
    'Adam': '(Male)',
    'Bella': '(Soft female)',
    'Antoni': '(Male with accent)',
    'Elli': '(Young female)',
    'Josh': '(Calm male)',
    'Arnold': '(Deep male - Amitabh style)',
    'Domi': '(Energetic female)',
    'Sam': '(Neutral)',
    'Custom': '(Your custom voice)'
  }
  return descriptions[voice] || ''
}
