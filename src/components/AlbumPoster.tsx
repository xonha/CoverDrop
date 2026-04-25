import type {
  MusicBrainzRelease,
  MusicBrainzTrack,
} from "../types/musicbrainz";

interface AlbumPosterProps {
  album: MusicBrainzRelease;
  coverUrl: string;
  tracks: MusicBrainzTrack[];
  size?: number;
}

export function AlbumPoster({
  album,
  coverUrl,
  tracks,
  size = 600,
}: AlbumPosterProps) {
  return (
    <div
      className="relative text-white overflow-hidden flex flex-col items-center"
      style={{
        width: size,
        height: size * 1.414,
        fontFamily: "Georgia, serif",
      }}
    >
      <PosterBackground coverUrl={coverUrl} />
      <div className="z-1 p-12">
        <div className="w-full flex items-center justify-center">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={album.title}
              className="h-auto object-cover pb-6"
            />
          ) : (
            <IconAlbumEmpty />
          )}
        </div>

        <div className="w-full flex flex-col overflow-hidden">
          <h1 className="text-2xl font-medium text-center">{album.title}</h1>
          <h1 className="text-2xl font-medium text-center pb-6">
            Bring Me The Horizon
          </h1>

          <TrackList tracks={tracks} />
        </div>
      </div>
    </div>
  );
}

function TrackList(p: { tracks: MusicBrainzTrack[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 font-normal text-sm tracking-wide text-center">
      {p.tracks.map((track, i) => (
        <span key={i} className="whitespace-nowrap">
          {track.title}
          {i < p.tracks.length - 1 && " · "}
        </span>
      ))}
    </div>
  );
}

function PosterBackground(p: { coverUrl: string }) {
  if (!p.coverUrl) return null;
  return (
    <div className="absolute inset-0 z-0">
      <img
        src={p.coverUrl}
        alt=""
        className="w-full h-full object-cover blur-sm scale-105"
      />
      <div className="absolute inset-0 z-10 bg-black/70 w-full h-full" />
    </div>
  );
}

function IconAlbumEmpty() {
  return (
    <div className="w-full aspect-square bg-gray-800 flex items-center justify-center">
      <svg
        className="w-24 h-24 text-gray-600"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
      </svg>
    </div>
  );
}
