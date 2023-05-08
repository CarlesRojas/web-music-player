import { getBiggestImage } from '@/shared/spotify/helpers';
import { usePlaybackState } from '@/shared/spotify/query/usePlaybackState';
import { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types';
import Image from 'next/image';

interface ControlsProps {
  bindVerticalDrag: (...args: any[]) => ReactDOMAttributes;
}

export default function Controls({ bindVerticalDrag }: ControlsProps) {
  const { playbackState } = usePlaybackState();
  const image = playbackState?.item?.album?.images ? getBiggestImage(playbackState?.item?.album?.images) : null;

  return (
    <main {...bindVerticalDrag()} className="p-2 relative w-full h-full flex items-center justify-center">
      {image && (
        <Image
          src={image.url}
          alt="Album cover"
          priority
          width={window.innerWidth}
          height={window.innerWidth}
          className="h-full w-full object-cover animate-image rounded-md pointer-events-none select-none"
        />
      )}
    </main>
  );
}
