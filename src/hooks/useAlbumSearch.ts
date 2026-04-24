import { useState, useCallback } from 'react'
import { searchReleases, getReleaseGroup, getRelease, getCoverArtUrl } from '../utils/musicbrainz'
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
    setSelectedAlbum(null)
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
      let actualRelease: MusicBrainzRelease | null = null
      let tracks: MusicBrainzTrack[] = []

      const fullRelease = await getReleaseGroup(group.id)
      const release = fullRelease?.releases?.[0]

      if (release?.id) {
        const releaseDetails = await getRelease(release.id)
        if (releaseDetails) {
          actualRelease = releaseDetails
          if (releaseDetails.media) {
            for (const media of releaseDetails.media) {
              if (media.tracks) {
                tracks.push(...media.tracks)
              }
            }
          }
        }
      }

      let coverUrl = ''
      if (actualRelease?.id) {
        coverUrl = await getCoverArtUrl(actualRelease.id)
      }

      if (!actualRelease) {
        actualRelease = {
          id: release?.id || group.id,
          title: group.title,
          date: group['first-release-date'],
          releaseGroup: { id: group.id, primaryType: group['primary-type'] }
        }
      }

      setSelectedAlbum({
        release: actualRelease,
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