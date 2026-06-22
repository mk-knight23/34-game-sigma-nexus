import { useEffect, useState } from 'react'

type Variant = 'hero' | 'game' | 'result'

interface CinematicBackgroundProps {
  /**
   * hero/result  -> video allowed (light interactivity)
   * game         -> static image only (heavy interactive charts sit on top,
   *                  never run video continuously behind live chart updates)
   */
  variant?: Variant
}

const MEDIA = {
  video: '/media/sigma-loop.mp4',
  poster: '/media/sigma-bg.jpg',
  hero: '/media/sigma-hero.jpg',
  game: '/media/sigma-bg.jpg',
  result: '/media/sigma-result.jpg',
} as const

/**
 * Returns true when the device should NOT autoplay video:
 * coarse pointer / small viewport / reduced-motion preference.
 */
function useStaticOnly(): boolean {
  const [staticOnly, setStaticOnly] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const queries = [
      window.matchMedia('(pointer: coarse)'),
      window.matchMedia('(max-width: 768px)'),
      window.matchMedia('(prefers-reduced-motion: reduce)'),
    ]
    const update = () => setStaticOnly(queries.some((q) => q.matches))
    update()
    queries.forEach((q) => q.addEventListener('change', update))
    return () => queries.forEach((q) => q.removeEventListener('change', update))
  }, [])

  return staticOnly
}

export function CinematicBackground({ variant = 'hero' }: CinematicBackgroundProps) {
  const staticOnly = useStaticOnly()
  const allowVideo = variant !== 'game'
  const staticImage = variant === 'hero' ? MEDIA.hero : variant === 'result' ? MEDIA.result : MEDIA.game
  const useVideo = allowVideo && !staticOnly

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* 1. base theme bg color */}
      <div className="absolute inset-0 bg-sigma-bg" />

      {/* 2. media layer */}
      {useVideo ? (
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-55"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={MEDIA.poster}
        >
          <source src={MEDIA.video} type="video/mp4" />
        </video>
      ) : (
        <img
          src={staticImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-50"
          loading="eager"
          decoding="async"
        />
      )}

      {/* 3. theme-tinted dark gradient + vignette */}
      <div className="absolute inset-0 cine-vignette" />

      {/* 4. subtle CSS overlays: grid + scanline + amber glow */}
      <div className="absolute inset-0 cine-grid" />
      <div className="absolute inset-0 cine-scanline opacity-40" />
      <div className="absolute inset-0 cine-glow cine-pulse" />
    </div>
  )
}

export default CinematicBackground
