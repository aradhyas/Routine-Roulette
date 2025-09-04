import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if already installed
    const checkInstalled = () => {
      // PWA is installed if it's running in standalone mode
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      // Or if it's running as a TWA (Trusted Web Activity) on Android
      const isTWA = 'standalone' in window.navigator || (window.navigator as any).standalone === true
      setIsInstalled(isStandalone || isTWA)
    }

    checkInstalled()

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Save the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsInstallable(true)
    }

    // Listen for the app being installed
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const installPWA = async (): Promise<boolean> => {
    if (!deferredPrompt) return false

    try {
      // Show the install prompt
      await deferredPrompt.prompt()
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice
      
      // Clean up
      setDeferredPrompt(null)
      setIsInstallable(false)
      
      return outcome === 'accepted'
    } catch (error) {
      console.error('Error installing PWA:', error)
      return false
    }
  }

  const getInstallInstructions = (): string => {
    const userAgent = navigator.userAgent.toLowerCase()
    
    if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
      return 'Tap the Share button and select "Add to Home Screen"'
    } else if (userAgent.includes('android')) {
      return 'Tap the menu button and select "Add to Home Screen" or "Install App"'
    } else if (userAgent.includes('chrome')) {
      return 'Click the install button in the address bar or use the menu'
    } else if (userAgent.includes('firefox')) {
      return 'Click the home icon in the address bar'
    } else if (userAgent.includes('safari')) {
      return 'Click Share and select "Add to Home Screen"'
    } else {
      return 'Look for an install or "Add to Home Screen" option in your browser menu'
    }
  }

  return {
    isInstallable,
    isInstalled,
    installPWA,
    getInstallInstructions,
    canPromptInstall: !!deferredPrompt
  }
}
