import { useState } from "react";
import type {
  MusicBrainzRelease,
  MusicBrainzTrack,
} from "../types/musicbrainz";
import { PosterBackground } from "./PosterBackground";
import { PosterSidebar } from "./PosterSidebar";
import { TrackList } from "./TrackList";

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
  const [coverContrast, setCoverContrast] = useState(0);
  const [bgColor, setBgColor] = useState("#000000");
  const [bgOpacity, setBgOpacity] = useState(50);

  return (
    <div
      className="relative"
      style={{ width: size + 200, height: size * 1.414 }}
    >
      <div
        className="relative text-white overflow-hidden flex flex-col items-center"
        style={{
          width: size,
          height: size * 1.414,
          fontFamily: "Georgia, serif",
        }}
      >
        <PosterBackground
          coverUrl={coverUrl}
          bgColor={bgColor}
          bgOpacity={bgOpacity}
        />
        <div className="z-1 p-12">
          <div className="w-full flex items-center justify-center">
            <img
              src={coverUrl}
              alt={album.title}
              className="h-auto object-cover pb-6"
              style={{ filter: `contrast(${100 + coverContrast}%)` }}
            />
          </div>

          <div className="w-full flex flex-col overflow-hidden">
            <h1 className="text-2xl font-medium text-center">{album.title}</h1>
            <div className="mt-4">
              <TrackList tracks={tracks} />
            </div>
          </div>
        </div>
      </div>

      <PosterSidebar
        sections={[
          {
            label: "Cover Contrast",
            value: coverContrast,
            onChange: (v) => setCoverContrast(v as number),
            min: -100,
            max: 100,
          },
          {
            label: "Background Color",
            value: bgColor,
            onChange: (v) => setBgColor(v as string),
          },
          {
            label: "Background Opacity",
            value: bgOpacity,
            onChange: (v) => setBgOpacity(v as number),
            min: 0,
            max: 100,
          },
        ]}
      />
    </div>
  );
}
