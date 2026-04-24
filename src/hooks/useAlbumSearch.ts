import { useState, useCallback } from 'react'
import { searchReleases, getReleaseGroup, getCoverArtUrl } from '../utils/musicbrainz'
import type { MusicBrainzReleaseGroup, MusicBrainzRelease, MusicBrainzTrack } from '../types/musicbrainz'

export interface AlbumData {
  release: MusicBrainzRelease
  coverUrl: string
  tracks: MusicBrainzTrack[]
}

export function useAlbumSearch() {
  const [results, setResults] = useState<MusicBrainzReleaseGroup[]>([])
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumData | null>(null)
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)

  const search = useCallback(async (query: string) => {
    if (!query.trim()) return
    setSearching(true)
    setResults([])
    try {
      const groups = await searchReleases(query)
      setResults(groups)
    } catch (e) {
      console.error('Search failed:', e)
    }
    setSearching(false)
  }, [])

  const selectAlbum = useCallback(async (group: MusicBrainzReleaseGroup) => {
    setLoading(true)
    try {
      const releases = group.releases || []
      const release = releases[0]

      const fullRelease = await getReleaseGroup(group.id)
      const actualRelease = fullRelease?.releases?.[0]

      const tracks: MusicBrainzTrack[] = []
      if (actualRelease?.media) {
        for (const media of actualRelease.media) {
          if (media.tracks) {
            for (const track of media.tracks) {
              tracks.push(track)
            }
          }
        }
      }

      let coverUrl = ''
      if (actualRelease?.id) {
        coverUrl = await getCoverArtUrl(actualRelease.id)
      }

      setSelectedAlbum({
        release: actualRelease || {
          id: release?.id || group.id,
          title: group.title,
          date: release?.date,
          releaseGroup: { id: group.id, primaryType: group.primaryType }
        },
        coverUrl,
        tracks
      })
    } catch (e) {
      console.error('Failed to load album:', e)
    }
    setLoading(false)
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedAlbum(null)
  }, [])

  return {
    results,
    selectedAlbum,
    loading,
    searching,
    search,
    selectAlbum,
    clearSelection
  }
}