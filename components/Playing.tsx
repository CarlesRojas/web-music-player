import { usePlaybackState } from '@/shared/spotify/query/usePlaybackState';
import { ReactNode } from 'react';
import { RiComputerLine, RiMicLine, RiPlayListLine } from 'react-icons/ri';

export default function Playing() {
  const { playbackState } = usePlaybackState();

  const container = (children?: ReactNode) => (
    <main className="p-2 relative w-full h-full flex flex-col items-center justify-center">
      <div className="relative w-full grow flex flex-col items-center">{children}</div>
      <div className="relative w-full flex justify-between">
        <RiComputerLine className="h-12 w-12 p-3" />
        <RiMicLine className="h-12 w-12 p-3" />
        <RiPlayListLine className="h-12 w-12 p-3" />
      </div>
    </main>
  );

  if (!playbackState) return container();

  const { item } = playbackState;
  const { album, name, artists } = item;

  return container(
    <>
      <h2 className="w-full text-center text-xl text-ellipsis overflow-hidden whitespace-nowrap">{name}</h2>

      {artists.length > 0 && (
        <h3 className="w-full text-center text-base opacity-60 text-ellipsis overflow-hidden whitespace-nowrap">
          {artists[0].name}
        </h3>
      )}
    </>
  );
}
