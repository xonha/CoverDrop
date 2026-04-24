import { useState } from 'react'
import { jsPDF } from 'jspdf'

interface LastFmImage {
  '#text': string
  size: 'small' | 'medium' | 'large' | 'extralarge' | 'mega' | ''
}

interface Album {
  name: string
  artist: string
  image: LastFmImage[]
  mbid: string
  url: string
}

interface Track {
  name: string
  '#text': string
}

interface AlbumDetails {
  name: string
  artist: string
  image: LastFmImage[]
  tracks: { track: Track[] }
  wiki?: { summary: string }
  releasedate?: string
}

function getImageUrl(image: LastFmImage[] | undefined, preferredSize: string = 'large'): string {
  if (!image) return ''
  const sizes = ['mega', 'extralarge', 'large', 'medium', 'small'] as const
  const idx = sizes.indexOf(preferredSize as any)
  if (idx !== -1) {
    const found = image.find(img => img.size === preferredSize)
    if (found?.['#text']) return found['#text']
  }
  for (const img of image) {
    if (img['#text']) return img['#text']
  }
  return ''
}

async function searchAlbum(query: string): Promise<Album[]> {
  const API_KEY = 'b364c7bb5c7f1ae8a5a1c0d17f7c8b9'
  const res = await fetch(
    `https://ws.audioscrobbler.com/2.0/?method=album.search&album=${encodeURIComponent(query)}&api_key=${API_KEY}&format=json&limit=20`
  )
  const data = await res.json()
  if (!data.results?.album?.album) return []
  const albums = data.results.album.album
  return Array.isArray(albums) ? albums : [albums]
}

async function getAlbumInfo(albumName: string, artistName: string): Promise<AlbumDetails | null> {
  const API_KEY = 'b364c7bb5c7f1ae8a5a1c0d17f7c8b9'
  const res = await fetch(
    `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&artist=${encodeURIComponent(artistName)}&album=${encodeURIComponent(albumName)}&api_key=${API_KEY}&format=json`
  )
  const data = await res.json()
  return data.album || null
}

async function getAlbumByMbid(mbid: string): Promise<AlbumDetails | null> {
  const API_KEY = 'b364c7bb5c7f1ae8a5a1c0d17f7c8b9'
  const res = await fetch(
    `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&mbid=${mbid}&api_key=${API_KEY}&format=json`
  )
  const data = await res.json()
  return data.album || null
}

function Poster({ album, size }: { album: AlbumDetails; size: number }) {
  const tracks = album.tracks?.track || []
  const coverUrl = getImageUrl(album.image, 'large')
  const aspectRatio = 1 / Math.sqrt(2)
  const width = size
  const height = size / aspectRatio

  return (
    <div
      className="bg-white text-black relative overflow-hidden"
      style={{ width, height }}
    >
      <div className="absolute inset-0 flex">
        <div className="w-1/2 h-full p-8 flex flex-col items-center justify-center bg-gray-900 text-white">
          <img
            src={coverUrl}
            alt={album.name}
            className="w-[85%] h-auto object-cover shadow-2xl"
            style={{ aspectRatio: '1/1' }}
          />
        </div>
        <div className="w-1/2 h-full p-8 flex flex-col">
          <h1 className="text-4xl font-bold leading-tight mb-4">{album.name}</h1>
          <h2 className="text-2xl text-gray-400 mb-8">{album.artist}</h2>
          
          {album.wiki?.summary && (
            <p className="text-sm text-gray-400 mb-6 line-clamp-4">
              {album.wiki.summary.replace(/<[^>]*>/g, '')}
            </p>
          )}
          
          {album.releasedate && (
            <p className="text-sm text-gray-500 mb-6">
              Released: {album.releasedate}
            </p>
          )}
          
          <div className="flex-1 overflow-hidden">
            <h3 className="text-lg font-semibold mb-3 border-b border-gray-700 pb-2">Tracklist</h3>
            <ul className="space-y-1 text-sm overflow-y-auto max-h-64">
              {tracks.slice(0, 15).map((track, i) => (
                <li key={i} className="flex justify-between text-gray-300">
                  <span>{i + 1}. {track.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-4 left-8 text-xs text-gray-500">
        CoverDrop • Generated with CoverDrop
      </div>
    </div>
  )
}

export default function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Album[]>([])
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return
    setSearching(true)
    setResults([])
    try {
      const albums = await searchAlbum(query)
      setResults(albums)
    } catch (e) {
      console.error(e)
    }
    setSearching(false)
  }

  const handleSelectAlbum = async (album: Album) => {
    setLoading(true)
    try {
      let albumInfo: AlbumDetails | null = null
      if (album.mbid) {
        albumInfo = await getAlbumByMbid(album.mbid)
      }
      if (!albumInfo) {
        albumInfo = await getAlbumInfo(album.name, album.artist)
      }
      setSelectedAlbum(albumInfo)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const handleExportPDF = () => {
    if (!selectedAlbum) return
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })
    
    const pageWidth = 210
    const pageHeight = 297
    const margin = 15
    
    const coverUrl = getImageUrl(selectedAlbum.image, 'large')
    
    pdf.setFillColor(30, 30, 30)
    pdf.rect(0, 0, pageWidth, pageHeight, 'F')
    
    const coverWidth = pageWidth / 2 - margin * 2
    const coverX = margin
    const coverY = margin + 10
    
    if (coverUrl) {
      try {
        pdf.addImage(coverUrl, 'JPEG', coverX, coverY, coverWidth, coverWidth)
      } catch (e) {
        pdf.setFillColor(50, 50, 50)
        pdf.rect(coverX, coverY, coverWidth, coverWidth, 'F')
      }
    }
    
    const contentX = pageWidth / 2 + margin
    const contentWidth = pageWidth / 2 - margin * 2
    
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(24)
    pdf.setFont('helvetica', 'bold')
    
    const title = selectedAlbum.name || ''
    const titleLines = pdf.splitTextToSize(title, contentWidth)
    pdf.text(titleLines, contentX, margin + 20)
    
    let yPos = margin + 35
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(150, 150, 150)
    pdf.text(selectedAlbum.artist || '', contentX, yPos)
    
    yPos += 15
    
    if (selectedAlbum.wiki?.summary) {
      const summary = selectedAlbum.wiki.summary.replace(/<[^>]*>/g, '')
      const summaryLines = pdf.splitTextToSize(summary, contentWidth)
      pdf.setFontSize(10)
      pdf.setTextColor(120, 120, 120)
      yPos = Math.min(yPos + 20, pageHeight - 100)
      pdf.text(summaryLines.slice(0, 6), contentX, yPos)
    }
    
    yPos += 30
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Tracklist', contentX, yPos)
    
    pdf.setDrawColor(80, 80, 80)
    pdf.line(contentX, yPos + 3, contentX + contentWidth, yPos + 3)
    
    yPos += 10
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(180, 180, 180)
    
    const tracks = selectedAlbum.tracks?.track || []
    tracks.slice(0, 15).forEach((track, i) => {
      if (yPos > pageHeight - margin) return
      pdf.text(`${i + 1}. ${track.name}`, contentX, yPos)
      yPos += 6
    })
    
    pdf.setFontSize(8)
    pdf.setTextColor(100, 100, 100)
    pdf.text('Generated with CoverDrop', margin, pageHeight - margin / 2)
    
    pdf.save(`${selectedAlbum.artist || 'album'}-${selectedAlbum.name || 'cover'}.pdf`)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="p-4 bg-gray-900 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-center">CoverDrop</h1>
      </nav>
      
      <main className="p-6 max-w-4xl mx-auto">
        {!selectedAlbum ? (
          <>
            <div className="mb-8">
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search album or artist..."
                  className="flex-1 p-4 bg-gray-900 border border-gray-700 rounded-lg text-lg focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleSearch}
                  disabled={searching}
                  className="px-8 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold disabled:opacity-50"
                >
                  {searching ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>
            
            {results.length > 0 && (
              <div className="space-y-2">
                {results.map((album, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectAlbum(album)}
                    disabled={loading}
                    className="w-full flex items-center gap-4 p-4 bg-gray-900 hover:bg-gray-800 rounded-lg text-left disabled:opacity-50"
                  >
                    <img
                      src={getImageUrl(album.image, 'medium')}
                      alt={album.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{album.name}</h3>
                      <p className="text-gray-400">{album.artist}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {query && results.length === 0 && !searching && (
              <p className="text-center text-gray-400">No albums found. Try a different search.</p>
            )}
          </>
        ) : (
          <div className="space-y-6">
            <div className="flex gap-4">
              <button
                onClick={() => setSelectedAlbum(null)}
                className="px-4 py-2 bg-gray-700 rounded-lg"
              >
                ← Back
              </button>
              <button
                onClick={handleExportPDF}
                className="px-4 py-2 bg-blue-600 rounded-lg font-semibold"
              >
                Export PDF
              </button>
            </div>
            
            <div className="flex justify-center">
              <div className="scale-50 sm:scale-75 md:scale-100">
                <Poster album={selectedAlbum} size={600} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}