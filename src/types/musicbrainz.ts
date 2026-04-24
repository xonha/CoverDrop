export interface MusicBrainzArtist {
  id: string
  name: string
  sortName?: string
  country?: string
  area?: {
    name: string
  }
}

export interface MusicBrainzRelease {
  id: string
  title: string
  date?: string
  country?: string
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
  primaryType?: string
  releases?: MusicBrainzRelease[]
  artistCredit?: {
    artist: MusicBrainzArtist
    name?: string
  }[]
}