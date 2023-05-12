import { clamp } from '@/shared/interpolate';
import { getBiggestImage } from '@/shared/spotify/helpers';
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
  const [images, setImages] = useState<Images>({
    first: null,
    second: queue ? getBiggestImage(queue.currently_playing.album.images) : null,
    third: queue ? getBiggestImage(queue.queue[0].album.images) : null
  });

  useEffect(() => {
    if (!queue) return;
    setImages((prev) => ({
      first: prev.first ? prev.first : null, // TODO get from previous song in the queue
      second: prev.second ? prev.second : getBiggestImage(queue.currently_playing.album.images),
      third: prev.third ? prev.third : getBiggestImage(queue.queue[0].album.images)
    }));
  }, [queue]);

  let animationPosition = useSpring(positionValue[Position.CENTER], { bounce: 0 });
  let firstPosition = useMotionValue(positionValue[Position.LEFT]);
  let secondPosition = useMotionValue(positionValue[Position.CENTER]);
  let thirdPosition = useMotionValue(positionValue[Position.RIGHT]);

  const centerIndex = useRef(1);
  const animating = useRef(false);

  const goNext = () => {
    centerIndex.current = centerIndex.current + 1 > 2 ? 0 : centerIndex.current + 1;
    animating.current = true;
    animationPosition.set(-1);
  };

  const goCurr = () => {
    animating.current = false;
    animationPosition.set(0);
  };

  const goPrev = () => {
    centerIndex.current = centerIndex.current - 1 < 0 ? 2 : centerIndex.current - 1;
    animating.current = true;
    animationPosition.set(1);
  };

  const onAnimationComplete = () => {
    animating.current = false;

    switch (centerIndex.current) {
      case 0:
        firstPosition.jump(positionValue[Position.CENTER]);
        secondPosition.jump(positionValue[Position.RIGHT]);
        thirdPosition.jump(positionValue[Position.LEFT]);

        // TODO change the one on the left for the previous song in the queue
        setImages((prev) => ({
          ...prev,
          second: queue ? getBiggestImage(queue.queue[0].album.images) : null
        }));
        break;
      case 1:
        firstPosition.jump(positionValue[Position.LEFT]);
        secondPosition.jump(positionValue[Position.CENTER]);
        thirdPosition.jump(positionValue[Position.RIGHT]);

        // TODO change the one on the left for the previous song in the queue
        setImages((prev) => ({
          ...prev,
          third: queue ? getBiggestImage(queue.queue[0].album.images) : null
        }));
        break;
      case 2:
        firstPosition.jump(positionValue[Position.RIGHT]);
        secondPosition.jump(positionValue[Position.LEFT]);
        thirdPosition.jump(positionValue[Position.CENTER]);

        // TODO change the one on the left for the previous song in the queue
        setImages((prev) => ({
          ...prev,
          first: queue ? getBiggestImage(queue.queue[0].album.images) : null
        }));
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
          <>
            <motion.div style={{ x: firstPositionX }} className="absolute w-full h-full">
              <motion.div style={{ x }} className="absolute w-full h-full">
                <Image
                  src={images.first?.url ?? 'https://www.thisisdig.com/wp-content/uploads/2020/09/abbey_road.jpeg'}
                  alt="Album cover"
                  priority
                  width={window.innerWidth}
                  height={window.innerWidth}
                  className="h-full w-full object-cover animate-image rounded-md pointer-events-none select-none"
                />
              </motion.div>
            </motion.div>

            <motion.div style={{ x: secondPositionX }} className="absolute w-full h-full">
              <motion.div style={{ x }} className="absolute w-full h-full">
                <Image
                  src={images.second?.url ?? 'https://www.thisisdig.com/wp-content/uploads/2020/09/abbey_road.jpeg'}
                  alt="Album cover"
                  priority
                  width={window.innerWidth}
                  height={window.innerWidth}
                  className="h-full w-full object-cover animate-image rounded-md pointer-events-none select-none"
                />
              </motion.div>
            </motion.div>

            <motion.div style={{ x: thirdPositionX }} className="absolute w-full h-full">
              <motion.div style={{ x }} className="absolute w-full h-full">
                <Image
                  src={images.third?.url ?? 'https://www.thisisdig.com/wp-content/uploads/2020/09/abbey_road.jpeg'}
                  alt="Album cover"
                  priority
                  width={window.innerWidth}
                  height={window.innerWidth}
                  className="h-full w-full object-cover animate-image rounded-md pointer-events-none select-none"
                />
              </motion.div>
            </motion.div>
          </>
        )}
      </div>
    </main>
  );
}
