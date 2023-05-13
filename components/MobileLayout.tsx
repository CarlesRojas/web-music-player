import { clamp } from '@/shared/interpolate';
import { useDrag } from '@use-gesture/react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useState } from 'react';
import Background from './Background';
import Controls from './Controls';
import Library from './Library';
import Playing from './Playing';

enum State {
  PLAYING = 0,
  LIBRARY = 1
}

export default function MobileLayout() {
  let position = useSpring(0, { bounce: 0 });
  const [state, setState] = useState(State.PLAYING);

  const openPlaying = () => {
    setState(State.PLAYING);
    position.set(0);
  };

  const openLibrary = () => {
    setState(State.LIBRARY);
    position.set(1);
  };

  const bindVerticalDrag = useDrag(
    ({ cancel, canceled, last, offset: [, yOffset], movement: [, yMov], direction: [, yDir], velocity: [, yVel] }) => {
      if (canceled) return;
      let yDispl = clamp(yOffset / window.innerHeight);

      if (last) {
        if (state === State.PLAYING) yDispl < 0.3 ? openPlaying() : openLibrary();
        if (state === State.LIBRARY) yDispl > 0.7 ? openLibrary() : openPlaying();
        return;
      }

      if (Math.abs(yMov) > window.innerHeight / 2 || yVel > 2) {
        yDir < 0 ? openPlaying() : openLibrary();
        cancel();
        return;
      }

      position.jump(yDispl);
    },
    { axis: 'y', from: () => [0, position.get() * window.innerHeight] }
  );

  return (
    <main className="w-screen h-screen flex flex-col overflow-hidden">
      <Background />

      <motion.div
        className="w-full overflow-hidden"
        style={{
          height: useTransform(position, [0, 1], ['calc(0vh - 0vw)', 'calc(100vh - 30vw)']),
          opacity: useTransform(position, [0.5, 1], [0, 1])
        }}
      >
        <Library />
      </motion.div>

      <motion.div
        className="w-full overflow-hidden"
        style={{ height: useTransform(position, [0, 1], ['100vw', '30vw']) }}
      >
        <Controls bindVerticalDrag={bindVerticalDrag} />
      </motion.div>

      <motion.div
        className="w-full overflow-hidden"
        style={{
          height: useTransform(position, [0, 1], ['calc(100vh - 100vw)', 'calc(0vh - 0vw)']),
          opacity: useTransform(position, [0, 0.5], [1, 0])
        }}
      >
        <Playing />
      </motion.div>
    </main>
  );
}
