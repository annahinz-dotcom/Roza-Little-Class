import { useEffect, useState } from 'react'
import { getSignedUrl } from '../utils/memoriesApi'

export default function MemoryThumb({
  path,
  alt = 'Class memory',
  className = ''
}: {
  path: string
  alt?: string
  className?: string
}) {
  const [url, setUrl] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    setUrl(null)
    setFailed(false)
    getSignedUrl(path)
      .then((u) => {
        if (!cancelled) setUrl(u)
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })
    return () => {
      cancelled = true
    }
  }, [path])

  if (failed) {
    return <div className={`flex items-center justify-center bg-navy/5 text-[10px] text-navy/30 ${className}`}>Unavailable</div>
  }

  if (!url) {
    return <div className={`animate-pulse bg-navy/5 ${className}`} />
  }

  return <img src={url} alt={alt} className={className} />
}
