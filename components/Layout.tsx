'use client';

import { clamp } from '@/shared/interpolate';
import { useDrag } from '@use-gesture/react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useState } from 'react';
import Controls from './Controls';
import Library from './Library';
import Playing from './Playing';

enum State {
  PLAYING = 0,
  LIBRARY = 1
}

export default function Layout() {
  let position = useMotionValue(0);
  const [state, setState] = useState(State.PLAYING);

  const bindDrag = useDrag(({ active, movement: [mx, my], direction: [, yDir], velocity }) => {
    let yDisplacement = clamp((Math.abs(my) * 2) / window.innerHeight);
    position.set(yDisplacement);
  });

  return (
    <main className="w-screen h-screen flex flex-col" {...bindDrag()}>
      <motion.div
        className="w-full "
        style={{ height: useTransform(position, [0, 1], ['calc(0vh - 0vw)', 'calc(100vh - 25vw)']) }}
      >
        <Library />
      </motion.div>

      <motion.div className="w-full" style={{ height: useTransform(position, [0, 1], ['100vw', '25vw']) }}>
        <Controls />
      </motion.div>

      <motion.div
        className="w-full"
        style={{ height: useTransform(position, [0, 1], ['calc(100vh - 100vw)', 'calc(0vh - 0vw)']) }}
      >
        <Playing />
      </motion.div>
    </main>
  );
}
