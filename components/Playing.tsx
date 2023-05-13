import useAdvancingTime from '@/hooks/useAdvancingTime';
import useAverageColor from '@/hooks/useAverageColor';
import { getBiggestImage, millisecondsToDuration, prettifyName } from '@/shared/spotify/helpers';
import { usePlaybackState } from '@/shared/spotify/query/usePlaybackState';
import { ReactNode } from 'react';
import { RiComputerLine, RiMicLine, RiPlayListLine, RiRepeatLine, RiShuffleLine } from 'react-icons/ri';

export default function Playing() {
  const { playbackState } = usePlaybackState();

  const container = (children?: ReactNode) => (
    <main className="p-2 relative w-full h-full flex flex-col items-center justify-center">
      <div className="relative w-full grow flex flex-col items-center gap-4">{children}</div>
      <div className="relative w-full flex justify-between">
        <RiComputerLine className="h-12 min-h-[3rem] min-w-[3rem] w-12 p-3" />
        <RiMicLine className="h-12 min-h-[3rem] w-12 min-w-[3rem] p-3" />
        <RiPlayListLine className="h-12 min-h-[3rem] w-12 min-w-[3rem] p-3" />
      </div>
    </main>
  );

  const averageColor = useAverageColor(playbackState ? getBiggestImage(playbackState.item.album.images) : null);
  const progressMs = useAdvancingTime(playbackState?.progress_ms ?? null, !playbackState?.is_playing ?? true);

  if (!playbackState) return container();

  const { item } = playbackState;
  const { name, artists, duration_ms } = item;

  const progressPercentage = progressMs ? (progressMs / duration_ms) * 100 : 0;

  return container(
    <>
      <div className="relative rounded-md w-full h-7 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full flex justify-end items-center p-2">
          <div className="absolute top-0 left-0 w-full h-full bg-white opacity-5" />
          <p className="text-xs opacity-60">{millisecondsToDuration(duration_ms)}</p>
        </div>

        <div
          className="absolute top-0 left-0 h-full flex items-center p-2 overflow-hidden transition-all duration-1000"
          style={{ width: `${progressPercentage}%` }}
        >
          <div
            className="absolute top-0 left-0 w-full h-full bg-white rounded-md"
            style={{ backgroundColor: averageColor?.hex }}
          />
          <p className="text-xs opacity-60" style={{ color: averageColor?.isDark ? 'white' : 'black' }}>
            {progressMs && millisecondsToDuration(progressMs)}
          </p>
        </div>
      </div>

      <div className="relative w-full h-fit flex items-center justify-between gap-2">
        <RiShuffleLine className="h-12 min-h-[3rem] w-12 min-w-[3rem] p-3" />

        <div className="relative grow min-w-0">
          <h2 className="text-center text-base text-ellipsis overflow-hidden whitespace-nowrap">
            {prettifyName(name)}
          </h2>
          {artists.length > 0 && (
            <h3 className="text-center text-xs opacity-60 text-ellipsis overflow-hidden whitespace-nowrap">
              {prettifyName(artists[0].name)}
            </h3>
          )}
        </div>

        <RiRepeatLine className="h-12 min-h-[3rem] w-12 min-w-[3rem] p-3" />
      </div>

      <div className="relative w-full grow flex flex-col items-center justify-center" />
    </>
  );
}
