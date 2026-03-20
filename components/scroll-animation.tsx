'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

// ─── Configuration ──────────────────────────────────────────────
const TOTAL_FRAMES = 240
const FRAME_PATH = '/frames/ezgif-frame-'
const FRAME_EXT = '.png'

// Overlay text config: [scrollPercent, text, action]
// action: 'in' = fade in, 'out' = fade out
const TEXT_OVERLAYS: { start: number; end: number; text: string }[] = [
  { start: 0, end: 10, text: 'We present you BIZIM.PK' },
  { start: 15, end: 28, text: 'Crafted Beyond What Meets The Eye' },
  { start: 30, end: 45, text: 'Water-Resistant 600D Fabric' },
  { start: 50, end: 65, text: 'Padded Laptop Protection' },
  { start: 70, end: 82, text: 'Reflective Safety Strips' },
  { start: 85, end: 95, text: 'Engineered To Last Years' },
]

// ─── Helper: zero-pad frame number ─────────────────────────────
function padFrame(n: number): string {
  return n.toString().padStart(3, '0')
}

export default function ScrollAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const frameIndexRef = useRef(TOTAL_FRAMES - 1)
  
  

  const [loading, setLoading] = useState(true)
  const [loadProgress, setLoadProgress] = useState(0)
  const [activeText, setActiveText] = useState('')
  const [textOpacity, setTextOpacity] = useState(0)

  // ─── Draw a frame on the canvas (cover mode) ───────────────
  const drawFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = imagesRef.current[frameIdx]
    if (!img || !img.complete) return

    const dpr = window.devicePixelRatio || 1
    const w = window.innerWidth
    const h = window.innerHeight
    const targetW = Math.floor(w * dpr)
    const targetH = Math.floor(h * dpr)

    // Set canvas resolution for retina (only if it changed to prevent frame drops)
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW
      canvas.height = targetH
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    // Calculate "cover" scaling
    const imgW = img.naturalWidth
    const imgH = img.naturalHeight
    const scale = Math.max(w / imgW, h / imgH)
    const drawW = imgW * scale
    const drawH = imgH * scale
    const drawX = (w - drawW) / 2
    const drawY = (h - drawH) / 2

    ctx.clearRect(0, 0, w, h)
    ctx.drawImage(img, drawX, drawY, drawW, drawH)
  }, [])

  // ─── Animation Lerp Loop ──────────────────────────────


  // ─── Handle scroll: map scroll position to frame index ─────
  const handleScroll = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const scrollableHeight = container.offsetHeight - window.innerHeight
    // How far into the animation section we've scrolled
    const scrolled = -rect.top
    const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight))

    // REVERSED: scroll 0% = frame 240 (assembled), scroll 100% = frame 1 (exploded)
    const currentFrame = Math.floor(progress * (TOTAL_FRAMES - 1))
    const frameIndex = TOTAL_FRAMES - 1 - currentFrame // reverse mapping

    if (frameIndexRef.current !== frameIndex) {
      frameIndexRef.current = frameIndex;
      drawFrame(frameIndex);
    }

    // ─── Text overlays ─────────────────────────────────────
    const scrollPct = progress * 100
    let foundText = ''
    for (const overlay of TEXT_OVERLAYS) {
      if (scrollPct >= overlay.start && scrollPct < overlay.end) {
        foundText = overlay.text
        break
      }
    }

    if (foundText !== activeText) {
      if (foundText) {
        setActiveText(foundText)
        setTextOpacity(1)
      } else {
        setTextOpacity(0)
        // Clear text after fade out
        setTimeout(() => setActiveText(''), 500)
      }
    }
  }, [activeText, drawFrame])

  // ─── Preload all frames ────────────────────────────────────
  useEffect(() => {
    let loadedCount = 0
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES)

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image()
      img.src = `${FRAME_PATH}${padFrame(i + 1)}${FRAME_EXT}`
      img.onload = () => {
        loadedCount++
        setLoadProgress(Math.floor((loadedCount / TOTAL_FRAMES) * 100))
        if (loadedCount === TOTAL_FRAMES) {
          setLoading(false)
          // Draw the first visible frame (assembled bag = last frame)
          frameIndexRef.current = TOTAL_FRAMES - 1
          drawFrame(TOTAL_FRAMES - 1)
        }
      }
      img.onerror = () => {
        loadedCount++
        setLoadProgress(Math.floor((loadedCount / TOTAL_FRAMES) * 100))
        if (loadedCount === TOTAL_FRAMES) {
          setLoading(false)
          frameIndexRef.current = TOTAL_FRAMES - 1
          drawFrame(TOTAL_FRAMES - 1)
        }
      }
      images[i] = img
    }

    imagesRef.current = images

    return () => {
      
    }
  }, [drawFrame])

  // ─── Scroll & resize listeners ─────────────────────────────
  useEffect(() => {
    if (loading) return

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', () => drawFrame(frameIndexRef.current))

    // Initial draw
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', () => drawFrame(frameIndexRef.current))
    }
  }, [loading, handleScroll, drawFrame])

  return (
    <>
      {/* ════════════ LOADING OVERLAY ════════════ */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: '#0a0a0a',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          transition: 'opacity 0.5s ease',
          opacity: loading ? 1 : 0,
          pointerEvents: loading ? 'auto' : 'none',
        }}
      >
        <div
          style={{
            color: '#ffffff',
            fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
            fontWeight: 300,
            letterSpacing: '4px',
            textTransform: 'uppercase',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
          }}
        >
          Loading Experience...
        </div>
        <div
          style={{
            color: '#c8a96e',
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: 700,
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
          }}
        >
          {loadProgress}%
        </div>
        {/* Progress bar */}
        <div
          style={{
            width: '200px',
            height: '3px',
            borderRadius: '4px',
            background: '#222',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${loadProgress}%`,
              background: '#c8a96e',
              borderRadius: '4px',
              transition: 'width 0.15s ease',
            }}
          />
        </div>
      </div>

      {/* ════════════ SECTION 2 — SCROLL ANIMATION ════════════ */}
      <div
        ref={containerRef}
        style={{
          height: '1200vh',
          position: 'relative',
          background: '#0a0a0a',
        }}
      >
        {/* Sticky canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'sticky',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'block',
          }}
        />

        {/* Text overlay */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: activeText === 'We present you BIZIM.PK' ? 'center' : 'flex-end',
            justifyContent: 'center',
            paddingBottom: activeText === 'We present you BIZIM.PK' ? '0' : '15vh',
            pointerEvents: 'none',
            zIndex: 10,
            opacity: textOpacity,
            transition: 'opacity 0.5s ease',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
          }}
        >
          <div
            className={activeText === 'We present you BIZIM.PK' ? 'shimmer-text' : ''}
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
