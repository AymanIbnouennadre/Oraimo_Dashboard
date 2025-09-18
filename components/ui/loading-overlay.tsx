// components/ui/loading-overlay.tsx
"use client"
import * as React from "react"
import Image from "next/image"

export function LoadingOverlay({
  show,
  label = "Please wait…",
}: { show: boolean; label?: string }) {
  if (!show) return null

  return (
    <div
      className="fixed inset-0 z-[1000] grid place-items-center bg-black/45 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="relative">
        {/* glow subtil */}
        <div className="absolute -inset-12 -z-10 rounded-full bg-gradient-to-tr from-lime-400/25 via-emerald-500/20 to-teal-400/25 blur-3xl" />

        <div className="flex flex-col items-center gap-6 rounded-2xl bg-card/90 px-8 py-8 shadow-2xl ring-1 ring-border/50">
          {/* anneau conique + logo agrandi */}
          <div className="relative h-28 w-28">
            <div className="absolute inset-0 rounded-full bg-[conic-gradient(#84cc16,#10b981,#06d6a0,#84cc16)] animate-[spin_1.8s_linear_infinite]" />
            <div className="absolute inset-[4px] rounded-full bg-card flex items-center justify-center shadow-inner">
              <div className="h-20 w-20 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Oraimo"
                  width={72}
                  height={72}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>

          <p className="text-sm font-medium text-foreground/90">{label}</p>

          {/* barre indéterminée élégante */}
          <div className="relative h-1.5 w-56 overflow-hidden rounded-full bg-muted">
            <div className="absolute inset-0 -translate-x-full w-1/2 bg-primary/80 animate-[loaderSlide_1.1s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>

      {/* keyframes minimalistes */}
      <style jsx global>{`
        @keyframes loaderSlide {
          0% { transform: translateX(-60%); }
          100% { transform: translateX(160%); }
        }
      `}</style>
    </div>
  )
}
