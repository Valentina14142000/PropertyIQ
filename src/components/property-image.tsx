"use client"

import { useState } from "react"
import { Building2 } from "lucide-react"

export function PropertyImage({ src, alt, className = "" }: { src?: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-primary/15 to-accent/20 ${className}`} role="img" aria-label={alt}>
        <Building2 className="w-12 h-12 text-primary/40" />
      </div>
    )
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={className} />
}
