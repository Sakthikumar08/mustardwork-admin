"use client"

import { useMemo } from "react"

const BackgroundGrid = ({ variant = "global", className = "" }) => {
  const squares = useMemo(
    () => [
      { l: "10%", t: "12%", w: 18, h: 18, a: false, d: "0s" },
      { l: "22%", t: "28%", w: 22, h: 22, a: true, d: "1s" },
      { l: "35%", t: "18%", w: 14, h: 14, a: false, d: "0.5s" },
      { l: "48%", t: "30%", w: 20, h: 20, a: true, d: "0.2s" },
      { l: "62%", t: "16%", w: 16, h: 16, a: false, d: "0.8s" },
      { l: "74%", t: "26%", w: 24, h: 24, a: true, d: "0.3s" },
      { l: "86%", t: "14%", w: 18, h: 18, a: false, d: "0.6s" },
      { l: "14%", t: "64%", w: 22, h: 22, a: true, d: "0.4s" },
      { l: "30%", t: "70%", w: 16, h: 16, a: false, d: "0.9s" },
      { l: "46%", t: "62%", w: 20, h: 20, a: true, d: "0.7s" },
      { l: "60%", t: "74%", w: 18, h: 18, a: false, d: "0.1s" },
      { l: "78%", t: "66%", w: 22, h: 22, a: true, d: "1.1s" },
    ],
    [],
  )

  const gridClass = "matrix-grid " + (variant === "global" ? "matrix-grid--global " : "") + (className ? className : "")

  return (
    <div aria-hidden className={gridClass}>
      <div className="matrix-squares">
        {squares.map((s, i) => (
          <span
            key={i}
            className={`matrix-square ${s.a ? "alt" : ""}`}
            style={{
              left: s.l,
              top: s.t,
              width: s.w,
              height: s.h,
              animationDelay: s.d,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default BackgroundGrid
