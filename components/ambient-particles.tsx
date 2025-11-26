"use client"

import { useMemo } from "react"

interface AmbientParticlesProps {
  count?: number
}

export function AmbientParticles({ count = 10 }: AmbientParticlesProps) {
  const particles = useMemo(() => {
    // Deterministic PRNG (mulberry32) to avoid SSR/client mismatch
    function mulberry32(seed: number) {
      return function () {
        let t = (seed += 0x6d2b79f5)
        t = Math.imul(t ^ (t >>> 15), t | 1)
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
      }
    }
    const rng = mulberry32(123456789 ^ count)
    const rand = () => rng()
    const randInt = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min

    return Array.from({ length: count }).map((_, index) => {
      const size = randInt(140, 320)
      const top = randInt(0, 100)
      const left = randInt(0, 100)
      const duration = (rand() * 12 + 12).toFixed(2) // 12s - 24s
      const delay = (-rand() * 12).toFixed(2) // negative to desync
      const opacity = (rand() * 0.25 + 0.12).toFixed(2) // 0.12 - 0.37
      const blur = randInt(8, 28)

      return { index, size, top, left, duration, delay, opacity, blur }
    })
  }, [count])

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.index}
          className="ambient-particle"
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: Math.max(0.35, Number(p.opacity)),
            filter: `blur(${p.blur}px)`
          }}
        />
      ))}
    </div>
  )
}


