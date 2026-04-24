import type { MusicBrainzRelease, MusicBrainzTrack } from '../types/musicbrainz'

interface AlbumPosterProps {
  album: MusicBrainzRelease
  coverUrl: string
  tracks: MusicBrainzTrack[]
  size?: number
}

export function AlbumPoster({ album, coverUrl, tracks, size = 600 }: AlbumPosterProps) {
  const artistName = album.artistCredit?.[0]?.artist?.name || album.artistCredit?.[0]?.name || ''
  const releaseDate = album.date || ''

  const displayTracks = tracks.length > 0 ? tracks : album.media?.[0]?.tracks || []

  return (
    <div
      className="bg-gray-900 text-white overflow-hidden"
      style={{ width: size, height: size * 1.414 }}
    >
      <div className="flex h-full">
        <div className="w-1/2 h-full flex items-center justify-center bg-gray-800 p-6">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={album.title}
              className="w-full h-auto object-cover shadow-2xl"
            />
          ) : (
            <div className="w-full aspect-square bg-gray-700 flex items-center justify-center">
              <svg className="w-24 h-24 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </div>
          )}
        </div>
        
        <div className="w-1/2 h-full p-6 flex flex-col overflow-hidden">
          <h1 className="text-2xl font-bold leading-tight mb-2 line-clamp-3">{album.title}</h1>
          <h2 className="text-lg text-gray-400 mb-4">{artistName}</h2>
          
          {releaseDate && (
            <p className="text-sm text-gray-500 mb-4">Released: {releaseDate}</p>
          )}
          
          <div className="flex-1 overflow-hidden">
            <h3 className="text-sm font-semibold mb-3 border-b border-gray-700 pb-2">Tracklist</h3>
            <ul className="space-y-1 text-sm overflow-y-auto">
              {displayTracks.slice(0, 15).map((track: MusicBrainzTrack, i: number) => (
                <li key={i} className="text-gray-300 truncate">
                  {i + 1}. {track.recording?.title || track.title || 'Untitled'}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-4 right-6 text-xs text-gray-600">
        CoverDrop
      </div>
    </div>
  )
}