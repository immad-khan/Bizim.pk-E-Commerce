'use client'

import { useEffect, useState } from 'react'
import { SiteCustomization } from '@/lib/site-customization'

// ─── Configuration ──────────────────────────────────────────────
const TEXT_OVERLAYS: string[] = [
  'We present you BIZIM.PK',
  'Crafted Beyond What Meets The Eye',
  'Water-Resistant 600D Fabric',
  'Padded Laptop Protection',
  'Reflective Safety Strips',
  'Engineered To Last Years',
]

export default function ScrollAnimation({ customizations }: { customizations?: SiteCustomization | null }) {
  const [activeIndex, setActiveIndex] = useState(0)

  // ─── Cycle text overlays automatically ────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TEXT_OVERLAYS.length)
    }, 4000) // Change text every 4 seconds

    return () => clearInterval(interval)
  }, [])

  const activeText = TEXT_OVERLAYS[activeIndex]

  return (
    <>
      {/* ════════════ SECTION 2 — HERO VIDEO ════════════ */}
      <div
        className="w-full relative bg-[#0a0a0a] overflow-hidden h-[50vh] md:h-[70vh] lg:h-screen"
      >
        {/* Absolute Video Background */}
        <div
          className="absolute top-0 left-0 w-full h-full block"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              pointerEvents: 'none',
              filter: 'brightness(0.7)', // Dim video to help text contrast
            }}
          >
            <source src={customizations?.heroVideoWebm || "/videos/Smoothly_transition_from_202604100021.webm"} type="video/webm" />
            <source src={customizations?.heroVideoMp4 || "/videos/Smoothly_transition_from_202604100021.mp4"} type="video/mp4" />
          </video>
        </div>

        {/* Fading Gradient at the bottom (Transitions smoothly into next section) */}
        <div 
          className="absolute bottom-0 left-0 w-full h-[15vh] md:h-[25vh] pointer-events-none z-10"
          style={{
            background: 'linear-gradient(to bottom, transparent, #0a0a0a)',
          }}
        />

        {/* Text overlay */}
        <div
          className={`absolute top-0 left-0 w-full h-full flex justify-center pointer-events-none z-20 ${
            activeText === 'We present you BIZIM.PK' 
              ? 'items-center pb-0' 
              : 'items-end pb-[10vh] md:pb-[15vh]'
          }`}
          style={{
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
          }}
        >
          <div
            key={activeText} // Force re-render for animation trigger
            className={activeText === 'We present you BIZIM.PK' ? 'shimmer-text fade-in-text' : 'fade-in-text'}
            style={{
              color: '#ffffff',
              fontSize: activeText === 'We present you BIZIM.PK' ? 'clamp(1.5rem, 5vw, 4.5rem)' : 'clamp(1rem, 2.5vw, 2.5rem)',
              fontWeight: 700,
              fontFamily: activeText === 'We present you BIZIM.PK'
                ? "'Bodoni Moda', serif" 
                : "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
              textAlign: 'center',
              textShadow: '0 2px 20px rgba(0,0,0,0.8)',
              padding: '0 20px',
              maxWidth: '90%',
              letterSpacing: activeText === 'We present you BIZIM.PK' ? '-0.02em' : 'normal',
            }}
          >
            {activeText}
          </div>
        </div>
      </div>

      <style jsx>{`
        .fade-in-text {
          animation: fadeIn 1s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .shimmer-text {
          animation: shimmer 3s infinite ease-in-out;
          background: linear-gradient(
            to right,
            #ffffff 20%,
            #e0e0e0 40%,
            #ffffff 60%,
            #e0e0e0 80%,
            #ffffff 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine 4s linear infinite, glow 3s ease-in-out infinite;
        }

        @keyframes shine {
          to {
            background-position: 200% center;
          }
        }

        @keyframes glow {
          0%, 100% {
            filter: drop-shadow(0 0 5px rgba(224, 224, 224, 0.3));
          }
          50% {
            filter: drop-shadow(0 0 20px rgba(224, 224, 224, 0.8));
          }
        }
      `}</style>
    </>
  )
}
