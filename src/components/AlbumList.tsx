import type { MusicBrainzReleaseGroup } from '../types/musicbrainz'

interface AlbumListProps {
  results: MusicBrainzReleaseGroup[]
  onSelect: (album: MusicBrainzReleaseGroup) => void
  loading: boolean
}

export function AlbumList({ results, onSelect, loading }: AlbumListProps) {
  if (results.length === 0) return null

  return (
    <div className="space-y-2">
      {results.map((album) => (
        <button
          key={album.id}
          onClick={() => onSelect(album)}
          disabled={loading}
          className="w-full flex items-center gap-4 p-4 bg-gray-900 hover:bg-gray-800 rounded-lg text-left disabled:opacity-50 transition-colors"
        >
          <div className="w-16 h-16 bg-gray-700 rounded flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-semibold truncate">{album.title}</h3>
            <p className="text-gray-400 text-sm truncate">
              {album['artist-credit']?.[0]?.name || album['artist-credit']?.[0]?.artist?.name || 'Unknown Artist'}
            </p>
          </div>
        </button>
      ))}
    </div>
  )
}