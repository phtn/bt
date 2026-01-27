'use client'

import { auth } from '@/lib/firebase/config'
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signInWithPopup,
  signOut,
  type User
} from 'firebase/auth'
import { useCallback, useEffect, useRef, useState } from 'react'
import { UserPopover } from '@/components/ui/user-popover'

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string
            callback: (response: { credential: string }) => void
            auto_select?: boolean
            cancel_on_tap_outside?: boolean
            use_fedcm_for_prompt?: boolean
          }) => void
          prompt: (notification?: () => void) => void
          disableAutoSelect: () => void
        }
      }
    }
  }
}

export const GoogleOneTap = () => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [showFallbackButton, setShowFallbackButton] = useState(false)
  const oneTapInitializedRef = useRef(false)
  const promptAttemptedRef = useRef(false)

  // Handle authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setIsLoading(false)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  // Load Google Identity Services script
  useEffect(() => {
    if (typeof window === 'undefined' || scriptLoaded) {
      return
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]')
    if (existingScript) {
      // Defer state update to avoid synchronous setState in effect
      queueMicrotask(() => {
        setScriptLoaded(true)
      })
      return
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => {
      setScriptLoaded(true)
    }
    script.onerror = () => {
      console.error('Failed to load Google Identity Services script')
    }
    document.head.appendChild(script)
  }, [scriptLoaded])

  // Initialize and show Google One Tap
  const initializeOneTap = useCallback(() => {
    if (typeof window === 'undefined' || !window.google?.accounts?.id || oneTapInitializedRef.current || user) {
      return
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

    if (!clientId) {
      console.error(
        'Google Client ID not found. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID environment variable.\n' +
          'You can find your OAuth 2.0 Client ID in Firebase Console > Project Settings > General > Your apps > Web app config,\n' +
          'or in Google Cloud Console > APIs & Services > Credentials.'
      )
      return
    }

    // Verify the client ID format (should be a long string ending in .apps.googleusercontent.com)
    if (!clientId.includes('.apps.googleusercontent.com')) {
      console.warn('Google Client ID format may be incorrect. Expected format: xxxxxx.apps.googleusercontent.com')
    }

    // Check if we're on localhost - FedCM may not work well on localhost
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'

    // Try with FedCM first, but allow fallback
    const tryInitialize = (useFedCM: boolean) => {
      if (!window.google?.accounts?.id) {
        console.error('Google Identity Services not available')
        return
      }

      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response: { credential: string }) => {
            try {
              console.log('Google One Tap credential received', {
                credentialLength: response.credential?.length,
                hasCredential: !!response.credential,
                useFedCM
              })

              if (!response.credential) {
                console.error('No credential in response')
                return
              }

              const credential = GoogleAuthProvider.credential(response.credential)

              if (!credential) {
                console.error('Failed to create Firebase credential from Google credential')
                return
              }

              console.log('Signing in with Firebase...')
              const result = await signInWithCredential(auth, credential)
              console.log('Successfully signed in with Google One Tap:', {
                email: result.user.email,
                uid: result.user.uid,
                displayName: result.user.displayName
              })
              // Authentication state will be updated via onAuthStateChanged
            } catch (error) {
              console.error('Error signing in with Google One Tap:', error)
              if (error instanceof Error) {
                console.error('Error details:', {
                  message: error.message,
                  name: error.name,
                  stack: error.stack
                })
              }
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
          ...(useFedCM ? { use_fedcm_for_prompt: true } : {})
        })

        oneTapInitializedRef.current = true
        console.log('Google One Tap initialized successfully', {
          clientId: clientId.substring(0, 20) + '...',
          hostname: window.location.hostname,
          protocol: window.location.protocol,
          useFedCM
        })

        // Show the One Tap prompt
        try {
          window.google.accounts.id.prompt()
          console.log('One Tap prompt() called', { useFedCM })

          // Set a timeout to check if prompt appeared (for debugging)
          setTimeout(() => {
            const oneTapElements = document.querySelectorAll(
              '[id*="google-one-tap"], [class*="google-one-tap"], iframe[src*="accounts.google.com"]'
            )
            console.log('One Tap elements found:', oneTapElements.length, {
              elements: Array.from(oneTapElements).map((el) => ({
                id: el.id,
                className: el.className,
                tagName: el.tagName
              }))
            })

            // If no elements found and we're on localhost, show fallback button
            if (oneTapElements.length === 0 && isLocalhost && !promptAttemptedRef.current) {
              console.log('One Tap not appearing on localhost, showing fallback button')
              setShowFallbackButton(true)
            }
          }, 3000)

          promptAttemptedRef.current = true
        } catch (promptError) {
          console.error('Error calling prompt():', promptError)
          if (useFedCM && isLocalhost) {
            console.warn('FedCM prompt failed on localhost, this is expected. One Tap may not appear.')
          }
        }
      } catch (error) {
        console.error('Error initializing Google One Tap:', error)
        if (error instanceof Error) {
          console.error('Initialization error details:', {
            message: error.message,
            name: error.name,
            stack: error.stack
          })
        }
        oneTapInitializedRef.current = false // Reset so we can try again
      }
    }

    // On localhost, try without FedCM first as it's more reliable
    if (isLocalhost) {
      console.log('Detected localhost - initializing without FedCM for better compatibility')
      tryInitialize(false)

      // On localhost, show fallback button after a short delay since One Tap often doesn't work
      setTimeout(() => {
        if (!user && !showFallbackButton) {
          console.log('Showing fallback button for localhost')
          setShowFallbackButton(true)
        }
      }, 2000)
    } else {
      // On production, use FedCM
      tryInitialize(true)
    }
  }, [user, showFallbackButton])

  // Initialize One Tap when script is loaded and user is not authenticated
  useEffect(() => {
    if (scriptLoaded && !user && !isLoading && !oneTapInitializedRef.current) {
      // Small delay to ensure DOM is ready and Google script is fully loaded
      const timer = setTimeout(() => {
        if (window.google?.accounts?.id) {
          console.log('Initializing One Tap...', {
            hostname: window.location.hostname,
            protocol: window.location.protocol,
            hasGoogleScript: !!window.google,
            hasAccountsId: !!window.google?.accounts?.id
          })
          initializeOneTap()
        } else {
          console.warn('Google Identity Services not fully loaded yet', {
            hasGoogle: !!window.google,
            hasAccounts: !!window.google?.accounts,
            hasId: !!window.google?.accounts?.id
          })
        }
      }, 500) // Increased delay to ensure script is fully ready

      return () => {
        clearTimeout(timer)
      }
    }
  }, [scriptLoaded, user, isLoading, initializeOneTap])

  // Fallback sign-in handler using popup
  const handleSignInWithPopup = useCallback(async () => {
    if (!window.google?.accounts?.id) {
      console.error('Google Identity Services not available')
      return
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    if (!clientId) {
      console.error('Google Client ID not found')
      return
    }

    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({
        prompt: 'select_account'
      })

      console.log('Initiating Google sign-in popup...')
      const result = await signInWithPopup(auth, provider)
      console.log('Successfully signed in with Google:', {
        email: result.user.email,
        uid: result.user.uid,
        displayName: result.user.displayName
      })
    } catch (error) {
      console.error('Error signing in with Google popup:', error)
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          name: error.name,
          code: (error as { code?: string }).code
        })
      }
    }
  }, [])

  // Show fallback button on localhost if One Tap doesn't appear
  if (showFallbackButton && !user) {
    return (
      <button
        onClick={handleSignInWithPopup}
        className='flex min-w-21 cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 transition-all text-white text-sm font-okxs font-medium leading-normal disabled:opacity-50 bg-[#4285F4] dark:bg-white dark:text-[#4285F4] hover:bg-[#357ae8]'
        type='button'>
        <span className='truncate flex items-center gap-2'>
          <svg className='w-5 h-5' viewBox='0 0 24 24'>
            <path
              fill='currentColor'
              d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
            />
            <path
              fill='currentColor'
              d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
            />
            <path
              fill='currentColor'
              d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
            />
            <path
              fill='currentColor'
              d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
            />
          </svg>
          Sign in with Google
        </span>
      </button>
    )
  }
  // Show user info and sign out button when authenticated
  if (user) {
    const handleSignOut = async () => {
      try {
        await signOut(auth)
        console.log('User signed out successfully')
      } catch (error) {
        console.error('Error signing out:', error)
      }
    }

    return (
      <UserPopover
        displayName={user.displayName}
        photoUrl={user.photoURL}
        signOut={handleSignOut}
      />
    )
  }

  // Don't render anything visible - One Tap appears as an overlay
  return null
}
