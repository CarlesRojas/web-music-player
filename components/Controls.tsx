import { clamp } from '@/shared/interpolate';
import { getBiggestImage } from '@/shared/spotify/helpers';
import { usePlaybackState } from '@/shared/spotify/query/usePlaybackState';
import { useQueue } from '@/shared/spotify/query/useQueue';
import { useDrag } from '@use-gesture/react';
import { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types';
import { motion, useMotionValue, useMotionValueEvent, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

interface ControlsProps {
  bindVerticalDrag: (...args: any[]) => ReactDOMAttributes;
}

export default function Controls({ bindVerticalDrag }: ControlsProps) {
  const { playbackState } = usePlaybackState();
  const { queue } = useQueue();
  const image = playbackState?.item?.album?.images ? getBiggestImage(playbackState?.item?.album?.images) : null;

  let animationPosition = useSpring(0, { bounce: 0 });
  let firstPosition = useMotionValue(-1);
  let secondPosition = useMotionValue(0);
  let thirdPosition = useMotionValue(1);
  const [currentIndex, setCurrentIndex] = useState(1);

  const goNext = () => {
    console.log('GO NEXT');
    setCurrentIndex((currentIndex + 1) % 3);
    animationPosition.set(-1);
  };

  const goCurr = () => {
    console.log('GO CURR');
    animationPosition.set(0);
  };

  const goPrev = () => {
    console.log('GO PREV');
    setCurrentIndex((currentIndex - 1) % 3);
    animationPosition.set(1);
  };

  const onAnimationComplete = (positionValue: number) => {
    console.log(positionValue);

    animationPosition.jump(0);
  };

  useMotionValueEvent(animationPosition, 'change', (value) => {
    if (value === 0 || value === 1 || value === -1) onAnimationComplete(value);
  });

  const bindHorizontalDrag = useDrag(
    ({ canceled, last, offset: [xOffset], movement: [xMov], direction: [xDir], velocity: [xVel] }) => {
      if (canceled) return;
      let yDispl = clamp(xOffset / window.innerWidth, -1, 1);

      if (last) {
        if (xVel > 2) return xDir > 0 ? goPrev() : goNext();

        if (yDispl > 0.75 || xVel < -2) goPrev();
        else if (yDispl < -0.75 || xVel > 2) goNext();
        else goCurr();
        return;
      }

      animationPosition.jump(yDispl);
    },
    { axis: 'x', from: () => [animationPosition.get() * window.innerWidth, 0] }
  );

  const x0 = useTransform(animationPosition, [-1, 1], ['-200vw', '0vw']);
  const x1 = useTransform(animationPosition, [-1, 1], ['-100vw', '100vw']);
  const x2 = useTransform(animationPosition, [-1, 1], ['0vw', '200vw']);

  const firstPositionX = useTransform(firstPosition, [-1, 1], ['-100vw', '100vw']);
  const secondPositionX = useTransform(secondPosition, [-1, 1], ['-100vw', '100vw']);
  const thirdPositionX = useTransform(thirdPosition, [-1, 1], ['-100vw', '100vw']);

  return (
    <main {...bindVerticalDrag()} className="p-2 relative w-full h-full flex items-center justify-center">
      <div {...bindHorizontalDrag()} className="relative w-full h-full flex items-center justify-center">
        {image && (
          <>
            <motion.div style={{ x: firstPositionX }} className="absolute w-full h-full">
              <motion.div style={{ x: x0 }} className="absolute w-full h-full">
                <Image
                  src={'https://www.thisisdig.com/wp-content/uploads/2020/09/abbey_road.jpeg'}
                  alt="Album cover"
                  priority
                  width={window.innerWidth}
                  height={window.innerWidth}
                  className="h-full w-full object-cover animate-image rounded-md pointer-events-none select-none"
                />
              </motion.div>
            </motion.div>

            <motion.div style={{ x: secondPositionX }} className="absolute w-full h-full">
              <motion.div style={{ x: x1 }} className="absolute w-full h-full">
                <Image
                  src={
                    'https://www.thisisdig.com/wp-content/uploads/2020/09/pink-floyd-dark-side-of-the-moon-dig-600x600.jpg'
                  }
                  alt="Album cover"
                  priority
                  width={window.innerWidth}
                  height={window.innerWidth}
                  className="h-full w-full object-cover animate-image rounded-md pointer-events-none select-none"
                />
              </motion.div>
            </motion.div>

            <motion.div style={{ x: thirdPositionX }} className="absolute w-full h-full">
              <motion.div style={{ x: x2 }} className="absolute w-full h-full">
                <Image
                  src={
                    'https://www.thisisdig.com/wp-content/uploads/2020/09/the-velvet-underground-nico-dig-600x600.jpg'
                  }
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
