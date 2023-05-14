import { EmptyImage } from '@/shared/constants';
import { clamp } from '@/shared/interpolate';
import { getBiggestImage } from '@/shared/spotify/helpers';
import { usePause } from '@/shared/spotify/mutation/usePause';
import { usePlay } from '@/shared/spotify/mutation/usePlay';
import { useSkipToNext } from '@/shared/spotify/mutation/useSkipToNext';
import { useSkipToPrevious } from '@/shared/spotify/mutation/useSkipToPrevious';
import { usePlaybackState } from '@/shared/spotify/query/usePlaybackState';
import { useQueue } from '@/shared/spotify/query/useQueue';
import { Image as AlbumImage } from '@/shared/spotify/schemas';
import { useDrag } from '@use-gesture/react';
import { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types';
import { motion, useMotionValue, useMotionValueEvent, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface ControlsProps {
  bindVerticalDrag: (...args: any[]) => ReactDOMAttributes;
}

enum Position {
  LEFT = 'LEFT',
  CENTER = 'CENTER',
  RIGHT = 'RIGHT'
}

export enum CarrouselAction {
  PREV = 'PREV',
  STAY = 'STAY',
  NEXT = 'NEXT'
}

const positionValue: Record<Position, number> = {
  [Position.LEFT]: -1,
  [Position.CENTER]: 0,
  [Position.RIGHT]: 1
};

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

  const [images, setImages] = useState<Images>({
    first: null,
    second: null,
    third: null
  });

  let animationPosition = useSpring(positionValue[Position.CENTER], { bounce: 0 });
  let firstPosition = useMotionValue(positionValue[Position.LEFT]);
  let secondPosition = useMotionValue(positionValue[Position.CENTER]);
  let thirdPosition = useMotionValue(positionValue[Position.RIGHT]);

  const centerIndex = useRef(1);
  const lastAction = useRef(CarrouselAction.STAY);
  const animating = useRef(false);

  useEffect(() => {
    if (!queue) return;

    switch (centerIndex.current) {
      case 0:
        setImages((prev) => ({
          ...prev,
          first: queue.currently_playing ? getBiggestImage(queue.currently_playing.album.images) : EmptyImage.ALBUM,
          second: queue && queue.queue.length > 0 ? getBiggestImage(queue.queue[0].album.images) : EmptyImage.ALBUM,
          third: lastAction.current === CarrouselAction.PREV ? null : prev.third
        }));
        break;
      case 1:
        setImages((prev) => ({
          ...prev,
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
  }, [queue]);

  const onCoverClick = () => {
    if (!playbackState) return;
    if (playbackState.is_playing) pause();
    else play();
  };

  const goNext = () => {
    centerIndex.current = centerIndex.current + 1 > 2 ? 0 : centerIndex.current + 1;
    lastAction.current = CarrouselAction.NEXT;
    animating.current = true;
    animationPosition.set(-1);
    skipToNext();
  };

  const goCurr = () => {
    animating.current = false;
    lastAction.current = CarrouselAction.STAY;
    animationPosition.set(0);
  };

  const goPrev = () => {
    centerIndex.current = centerIndex.current - 1 < 0 ? 2 : centerIndex.current - 1;
    animating.current = true;
    lastAction.current = CarrouselAction.PREV;
    animationPosition.set(1);
    skipToPrevious();
  };

  const onAnimationComplete = () => {
    animating.current = false;

    switch (centerIndex.current) {
      case 0:
        firstPosition.jump(positionValue[Position.CENTER]);
        secondPosition.jump(positionValue[Position.RIGHT]);
        thirdPosition.jump(positionValue[Position.LEFT]);
        break;
      case 1:
        firstPosition.jump(positionValue[Position.LEFT]);
        secondPosition.jump(positionValue[Position.CENTER]);
        thirdPosition.jump(positionValue[Position.RIGHT]);
        break;
      case 2:
        firstPosition.jump(positionValue[Position.RIGHT]);
        secondPosition.jump(positionValue[Position.LEFT]);
        thirdPosition.jump(positionValue[Position.CENTER]);
        break;
    }

    animationPosition.jump(0);
  };

  useMotionValueEvent(animationPosition, 'change', (value) => {
    if (!animating.current) return;
    if (
      value === positionValue[Position.LEFT] ||
      value === positionValue[Position.CENTER] ||
      value === positionValue[Position.RIGHT]
    )
      onAnimationComplete();
  });

  const bindHorizontalDrag = useDrag(
    ({ cancel, canceled, last, offset: [xOffset], movement: [xMov], direction: [xDir], velocity: [xVel] }) => {
      if (canceled) return;
      if (animating.current) return cancel();

      let yDispl = clamp(xOffset / window.innerWidth, -1, 1);

      if (last) {
        if (xVel > 1) xDir > 0 ? goPrev() : goNext();
        else if (yDispl > 0.25 || xVel < -2) goPrev();
        else if (yDispl < -0.25 || xVel > 2) goNext();
        else goCurr();

        if (yDispl === 0 || yDispl === 1 || yDispl === -1) return onAnimationComplete();
        return;
      }

      animationPosition.jump(yDispl);
    },
    { axis: 'x', from: () => [animationPosition.get() * window.innerWidth, 0] }
  );

  const x = useTransform(animationPosition, [-1, 1], ['-100vw', '100vw']);

  const firstPositionX = useTransform(firstPosition, [-1, 1], ['-100vw', '100vw']);
  const secondPositionX = useTransform(secondPosition, [-1, 1], ['-100vw', '100vw']);
  const thirdPositionX = useTransform(thirdPosition, [-1, 1], ['-100vw', '100vw']);

  return (
    <main {...bindVerticalDrag()} className="p-2 relative w-full h-full flex items-center justify-center">
      <div {...bindHorizontalDrag()} className="relative w-full h-full flex items-center justify-center">
        {queue && (
          <div className="relative w-full h-full flex items-center justify-center" onClick={onCoverClick}>
            <motion.div style={{ x: firstPositionX }} className="absolute w-full h-full">
              <motion.div style={{ x }} className="absolute w-full h-full">
                {images.first?.url && (
                  <Image
                    src={images.first.url}
                    alt="Album cover"
                    priority
                    width={window.innerWidth}
                    height={window.innerWidth}
                    className={`h-full w-full object-cover rounded-md pointer-events-none select-none ${
                      images.first.missing
                        ? ''
                        : playbackState?.is_playing
                        ? 'animate-image'
                        : 'animate-image grayscale pause'
                    }`}
                  />
                )}
              </motion.div>
            </motion.div>

            <motion.div style={{ x: secondPositionX }} className="absolute w-full h-full">
              <motion.div style={{ x }} className="absolute w-full h-full">
                {images.second?.url && (
                  <Image
                    src={images.second.url}
                    alt="Album cover"
                    priority
                    width={window.innerWidth}
                    height={window.innerWidth}
                    className={`h-full w-full object-cover rounded-md pointer-events-none select-none ${
                      images.second.missing
                        ? ''
                        : playbackState?.is_playing
                        ? 'animate-image'
                        : 'animate-image grayscale pause'
                    }`}
                  />
                )}
              </motion.div>
            </motion.div>

            <motion.div style={{ x: thirdPositionX }} className="absolute w-full h-full">
              <motion.div style={{ x }} className="absolute w-full h-full">
                {images.third?.url && (
                  <Image
                    src={images.third.url}
                    alt="Album cover"
                    priority
                    width={window.innerWidth}
                    height={window.innerWidth}
                    className={`h-full w-full object-cover rounded-md pointer-events-none select-none ${
                      images.third.missing
                        ? ''
                        : playbackState?.is_playing
                        ? 'animate-image'
                        : 'animate-image grayscale pause'
                    }`}
                  />
                )}
              </motion.div>
            </motion.div>
          </div>
        )}
      </div>
    </main>
  );
}
