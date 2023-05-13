import useCarrousel, { CarrouselAction } from '@/hooks/useCarrousel';
import { EmptyImage } from '@/shared/constants';
import { getBiggestImage } from '@/shared/spotify/helpers';
import { usePause } from '@/shared/spotify/mutation/usePause';
import { usePlay } from '@/shared/spotify/mutation/usePlay';
import { useSkipToNext } from '@/shared/spotify/mutation/useSkipToNext';
import { useSkipToPrevious } from '@/shared/spotify/mutation/useSkipToPrevious';
import { usePlaybackState } from '@/shared/spotify/query/usePlaybackState';
import { useQueue } from '@/shared/spotify/query/useQueue';
import { Image as AlbumImage } from '@/shared/spotify/schemas';
import { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types';
import { useEffect, useState } from 'react';

interface ControlsProps {
  bindVerticalDrag: (...args: any[]) => ReactDOMAttributes;
}

interface Images {
  first: AlbumImage | null;
  second: AlbumImage | null;
  third: AlbumImage | null;
}

export default function Controls({ bindVerticalDrag }: ControlsProps) {
  const { queue } = useQueue();
  const { playbackState } = usePlaybackState();

  const { skipToNext } = useSkipToNext();
  const { skipToPrevious } = useSkipToPrevious();
  const { pause } = usePause();
  const { play } = usePlay();

  const onCoverClick = () => {
    if (!playbackState) return;
    if (playbackState.is_playing) pause();
    else play();
  };

  const [images, setImages] = useState<Images>({ first: null, second: null, third: null });

  const { carrousel, centerIndex, lastAction } = useCarrousel({
    images,
    animateImages: playbackState?.is_playing,
    onClick: onCoverClick,
    onSwipePrev: skipToPrevious,
    onSwipeNext: skipToNext
  });

  useEffect(() => {
    if (!queue) return;
    switch (centerIndex.current) {
      case 0:
        setImages((prev) => ({
          first: queue.currently_playing ? getBiggestImage(queue.currently_playing.album.images) : EmptyImage.ALBUM,
          second: queue && queue.queue.length > 0 ? getBiggestImage(queue.queue[0].album.images) : EmptyImage.ALBUM,
          third: lastAction.current === CarrouselAction.PREV ? null : prev.third
        }));
        break;
      case 1:
        setImages((prev) => ({
          first: lastAction.current === CarrouselAction.PREV ? null : prev.first,
          second: queue.currently_playing ? getBiggestImage(queue.currently_playing.album.images) : EmptyImage.ALBUM,
          third: queue && queue.queue.length > 0 ? getBiggestImage(queue.queue[0].album.images) : EmptyImage.ALBUM
        }));
        break;
      case 2:
        setImages((prev) => ({
          ...prev,
          first: queue && queue.queue.length > 0 ? getBiggestImage(queue.queue[0].album.images) : EmptyImage.ALBUM,
          second: lastAction.current === CarrouselAction.PREV ? null : prev.second,
          third: queue.currently_playing ? getBiggestImage(queue.currently_playing.album.images) : EmptyImage.ALBUM
        }));
        break;
    }
  }, [centerIndex, lastAction, queue]);

  return (
    <main {...bindVerticalDrag()} className="p-2 relative w-full h-full flex items-center justify-center">
      {queue && carrousel}
    </main>
  );
}
