import type { MusicBrainzReleaseGroup, MusicBrainzRelease } from '../types/musicbrainz'

const BASE_URL = 'https://musicbrainz.org/ws/2'
const COVERART_URL = 'http://coverartarchive.org'

async function fetchWithUA<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'CoverDrop/1.0 (https://github.com/xonha/CoverDrop; contact@xonha.github.io)',
      'Accept': 'application/json'
    }
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function searchReleases(query: string, limit = 20): Promise<MusicBrainzReleaseGroup[]> {
  const url = `${BASE_URL}/release-group?query=${encodeURIComponent(query)}&fmt=json&limit=${limit}`
  const data = await fetchWithUA<{ 'release-groups': MusicBrainzReleaseGroup[] }>(url)
  return data['release-groups'] || []
}

export async function getRelease(id: string): Promise<MusicBrainzRelease | null> {
  const url = `${BASE_URL}/release/${id}?fmt=json&inc=release-groups+media+recordings`
  const data = await fetchWithUA<MusicBrainzRelease>(url)
  return data
}

export async function getReleaseGroup(id: string): Promise<MusicBrainzReleaseGroup | null> {
  const url = `${BASE_URL}/release-group/${id}?fmt=json&inc=releases`
  const data = await fetchWithUA<MusicBrainzReleaseGroup>(url)
  return data
}

export async function getCoverArtUrls(releaseId: string): Promise<string[]> {
  try {
    const res = await fetch(`${COVERART_URL}/release/${releaseId}/`, {
      headers: {
        'User-Agent': 'CoverDrop/1.0 (https://github.com/xonha/CoverDrop)',
        'Accept': 'application/json'
      }
    })
    if (!res.ok) return []
    const data = await res.json()
    if (data.images && Array.isArray(data.images)) {
      return data.images.map((img: any) => img.thumbnails?.large || img.thumbnails?.small || img.image).filter(Boolean)
    }
  } catch {}
  return []
}

export async function getCoverArtUrl(releaseId: string): Promise<string> {
  const urls = await getCoverArtUrls(releaseId)
  return urls[0] || ''
}