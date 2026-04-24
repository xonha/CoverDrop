import { useState, useEffect } from 'react'
import { useCoverArt } from '../utils/musicbrainz'
import type { MusicBrainzReleaseGroup } from '../types/musicbrainz'

interface AlbumListProps {
  results: MusicBrainzReleaseGroup[]
  onSelect: (album: MusicBrainzReleaseGroup) => void
  loading: boolean
}

function AlbumItem({ album, onSelect, disabled }: { 
  album: MusicBrainzReleaseGroup
  onSelect: (album: MusicBrainzReleaseGroup) => void
  disabled?: boolean
}) {
  const [loadCover, setLoadCover] = useState(false)
  const releaseId = album.releases?.[0]?.id
  
  const { data: coverUrl } = useCoverArt(loadCover ? releaseId : undefined)

  useEffect(() => {
    if (loadCover) return
    const timer = setTimeout(() => setLoadCover(true), 500)
    return () => clearTimeout(timer)
  }, [loadCover])

  return (
    <button
      onClick={() => onSelect(album)}
      onMouseEnter={() => setLoadCover(true)}
      disabled={disabled}
      className="bg-gray-900 hover:bg-gray-800 rounded-lg p-3 text-left disabled:opacity-50 transition-colors"
    >
      <div className="aspect-square bg-gray-700 rounded flex items-center justify-center overflow-hidden mb-3">
        {coverUrl ? (
          <img src={coverUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <svg className="w-12 h-12 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
        )}
      </div>
      <div>
        <h3 className="font-semibold text-sm truncate">{album.title}</h3>
        <p className="text-gray-400 text-xs truncate">
          {album['artist-credit']?.[0]?.name || album['artist-credit']?.[0]?.artist?.name || 'Unknown Artist'}
        </p>
      </div>
    </button>
  )
}

export function AlbumList({ results, onSelect, loading }: AlbumListProps) {
  if (results.length === 0) return null

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {results.map((album) => (
        <AlbumItem 
          key={album.id} 
          album={album} 
          onSelect={onSelect}
          disabled={loading}
        />
      ))}
    </div>
  )
}