"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { LoadingOverlay } from "@/components/ui/loading-overlay"

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false)
  const [navigationStartTime, setNavigationStartTime] = useState<number>(0)
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const currentPathRef = useRef<string>(typeof window !== 'undefined' ? window.location.pathname : '')

  const startNavigation = useCallback(() => {
    // Clear any existing timeout
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current)
    }

    setIsNavigating(true)
    setNavigationStartTime(Date.now())
  }, [])

  const endNavigation = useCallback(() => {
    // Délai minimum pour éviter les flashs trop rapides
    const elapsed = Date.now() - navigationStartTime
    const minDelay = 300 // ms minimum pour le spinner

    const delay = Math.max(0, minDelay - elapsed)

    navigationTimeoutRef.current = setTimeout(() => {
      setIsNavigating(false)
    }, delay)
  }, [navigationStartTime])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')

      if (link && link.href && link.href.startsWith(window.location.origin)) {
        // Vérifier si c'est vraiment une navigation (pas un hash ou une ancre)
        const linkUrl = new URL(link.href)
        const currentUrl = new URL(window.location.href)

        if (linkUrl.pathname !== currentUrl.pathname ||
            linkUrl.search !== currentUrl.search) {
          startNavigation()
        }
      }
    }

    const handlePopState = () => {
      startNavigation()
    }

    // Détecter les changements d'URL via History API
    const handleLocationChange = () => {
      const newPath = window.location.pathname + window.location.search
      if (newPath !== currentPathRef.current) {
        currentPathRef.current = newPath
        // Attendre un peu que Next.js finisse de charger la page
        setTimeout(() => {
          endNavigation()
        }, 100)
      }
    }

    // Observer les changements dans le DOM (pour Next.js)
    const observer = new MutationObserver((mutations) => {
      // Vérifier si de nouveaux éléments ont été ajoutés au DOM
      const hasNewContent = mutations.some(mutation =>
        mutation.type === 'childList' && mutation.addedNodes.length > 0
      )

      if (hasNewContent && isNavigating) {
        // Attendre encore un peu pour s'assurer que tout est chargé
        setTimeout(() => {
          endNavigation()
        }, 200)
      }
    })

    // Démarrer l'observation
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    // Écouter les événements
    document.addEventListener('click', handleLinkClick)
    window.addEventListener('popstate', handlePopState)

    // Intercepter pushState et replaceState
    const originalPushState = history.pushState
    const originalReplaceState = history.replaceState

    history.pushState = function(...args) {
      originalPushState.apply(this, args)
      handleLocationChange()
    }

    history.replaceState = function(...args) {
      originalReplaceState.apply(this, args)
      handleLocationChange()
    }

    // Cleanup
    return () => {
      document.removeEventListener('click', handleLinkClick)
      window.removeEventListener('popstate', handlePopState)
      observer.disconnect()

      history.pushState = originalPushState
      history.replaceState = originalReplaceState

      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current)
      }
    }
  }, [startNavigation, endNavigation, isNavigating])

  return (
    <>
      {children}
      <LoadingOverlay
        show={isNavigating}
        label="Loading page…"
      />
    </>
  )
}