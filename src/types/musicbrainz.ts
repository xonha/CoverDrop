export interface MusicBrainzArtist {
  id: string
  name: string
  sortName?: string
  disambiguation?: string
}

export interface MusicBrainzRelease {
  id: string
  title: string
  date?: string
  country?: string
  status?: string
  releaseGroup?: {
    id: string
    primaryType?: string
  }
  media?: {
    trackCount: number
    format?: string
    tracks?: MusicBrainzTrack[]
  }[]
  coverArtArchive?: {
    front: string
    back: string
  }
  artistCredit?: {
    artist: MusicBrainzArtist
    name?: string
  }[]
}

export interface MusicBrainzTrack {
  id: string
  title: string
  position: number
  number?: string
  length?: number
  recording?: {
    id: string
    title: string
    length?: number
  }
}

export interface MusicBrainzReleaseGroup {
  id: string
  title: string
  'primary-type'?: string
  'primary-type-id'?: string
  'first-release-date'?: string
  releases?: MusicBrainzRelease[]
  'artist-credit'?: {
    artist: MusicBrainzArtist
    name?: string
  }[]
}