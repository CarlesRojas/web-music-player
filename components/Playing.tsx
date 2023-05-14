import useAverageColor from '@/hooks/useAverageColor';
import useItemProgress from '@/hooks/useItemProgress';
import { getBiggestImage, millisecondsToDuration, prettifyName } from '@/shared/spotify/helpers';
import { usePlaybackState } from '@/shared/spotify/query/usePlaybackState';
import { motion } from 'framer-motion';
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
  // const progressMs = useAdvancingTime(playbackState?.progress_ms ?? null, !playbackState?.is_playing ?? true);
  const { progressPercentage, progressMs, durationMs } = useItemProgress();

  return container(
    <>
      <div className="relative rounded-md w-full h-7 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full flex justify-end items-center p-2">
          <div className="absolute top-0 left-0 w-full h-full bg-white opacity-5" />
          <p className="text-xs opacity-60">{millisecondsToDuration(durationMs)}</p>
        </div>

        <motion.div
          className="absolute top-0 left-0 h-full flex items-center p-2 overflow-hidden"
          style={{ width: progressPercentage }}
        >
          <div
            className="absolute top-0 left-0 w-full h-full bg-white"
            style={{ backgroundColor: averageColor?.hex }}
          />
          <p className="text-xs opacity-60" style={{ color: averageColor?.isDark ? 'white' : 'black' }}>
            {progressMs && millisecondsToDuration(progressMs)}
          </p>
        </motion.div>
      </div>

      <div className="relative w-full h-fit flex items-center justify-between gap-2">
        <div className="relative grow min-w-0">
          {playbackState?.item.name && (
            <h2 className="text-lg font-semibold text-ellipsis overflow-hidden whitespace-nowrap">
              {prettifyName(playbackState.item.name)}
            </h2>
          )}

          {playbackState?.item.artists && playbackState.item.artists.length > 0 && (
            <h3 className="text-sm opacity-60 text-ellipsis overflow-hidden whitespace-nowrap">
              {prettifyName(playbackState.item.artists[0].name)}
            </h3>
          )}
        </div>

        <RiShuffleLine className="h-12 min-h-[3rem] w-12 min-w-[3rem] p-3" />
        <RiRepeatLine className="h-12 min-h-[3rem] w-12 min-w-[3rem] p-3" />
      </div>

      <div className="relative w-full grow flex flex-col items-center justify-center" />
    </>
  );
}
