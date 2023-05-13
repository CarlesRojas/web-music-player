import { clamp } from '@/shared/interpolate';
import { Image } from '@/shared/spotify/schemas';
import { useDrag } from '@use-gesture/react';
import { motion, useMotionValue, useMotionValueEvent, useSpring, useTransform } from 'framer-motion';
import NextImage from 'next/image';
import { useRef } from 'react';

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
  first: Image | null;
  second: Image | null;
  third: Image | null;
}

interface CarrouselProps {
  images: Images;
  onClick?: () => void;
  onSwipePrev?: () => void;
  onSwipeNext?: () => void;
  animateImages?: boolean;
}

export default function useCarrousel({ images, onClick, onSwipePrev, onSwipeNext, animateImages }: CarrouselProps) {
  let animationPosition = useSpring(positionValue[Position.CENTER], { bounce: 0 });
  let firstPosition = useMotionValue(positionValue[Position.LEFT]);
  let secondPosition = useMotionValue(positionValue[Position.CENTER]);
  let thirdPosition = useMotionValue(positionValue[Position.RIGHT]);

  const centerIndex = useRef(1);
  const lastAction = useRef(CarrouselAction.STAY);
  const animating = useRef(false);

  const goNext = () => {
    centerIndex.current = centerIndex.current + 1 > 2 ? 0 : centerIndex.current + 1;
    animating.current = true;
    lastAction.current = CarrouselAction.NEXT;
    animationPosition.set(-1);
    onSwipeNext && onSwipeNext();
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
    onSwipePrev && onSwipePrev();
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

  return {
    centerIndex,
    lastAction,
    carrousel: (
      <div {...bindHorizontalDrag()} className="relative w-full h-full flex items-center justify-center">
        <div className="relative w-full h-full flex items-center justify-center" onClick={onClick}>
          <motion.div style={{ x: firstPositionX }} className="absolute w-full h-full">
            <motion.div style={{ x }} className="absolute w-full h-full">
              {images.first?.url && (
                <NextImage
                  src={images.first.url}
                  alt="Image in the carrousel"
                  priority
                  width={window.innerWidth}
                  height={window.innerWidth}
                  className={`h-full w-full object-cover rounded-md pointer-events-none select-none ${
                    images.first.missing ? '' : animateImages ? 'animate-image' : 'animate-image grayscale pause'
                  }`}
                />
              )}
            </motion.div>
          </motion.div>

          <motion.div style={{ x: secondPositionX }} className="absolute w-full h-full">
            <motion.div style={{ x }} className="absolute w-full h-full">
              {images.second?.url && (
                <NextImage
                  src={images.second.url}
                  alt="Image in the carrousel"
                  priority
                  width={window.innerWidth}
                  height={window.innerWidth}
                  className={`h-full w-full object-cover rounded-md pointer-events-none select-none ${
                    images.second.missing ? '' : animateImages ? 'animate-image' : 'animate-image grayscale pause'
                  }`}
                />
              )}
            </motion.div>
          </motion.div>

          <motion.div style={{ x: thirdPositionX }} className="absolute w-full h-full">
            <motion.div style={{ x }} className="absolute w-full h-full">
              {images.third?.url && (
                <NextImage
                  src={images.third.url}
                  alt="Image in the carrousel"
                  priority
                  width={window.innerWidth}
                  height={window.innerWidth}
                  className={`h-full w-full object-cover rounded-md pointer-events-none select-none ${
                    images.third.missing ? '' : animateImages ? 'animate-image' : 'animate-image grayscale pause'
                  }`}
                />
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    )
  };
}
