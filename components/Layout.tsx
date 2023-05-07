'use client';

import useResize from '@/hooks/useResize';
import { clamp } from '@/shared/interpolate';
import { useDrag } from '@use-gesture/react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useState } from 'react';
import Controls from './Controls';
import Library from './Library';
import Playing from './Playing';

export default function Layout() {
  const [limits, setLimits] = useState({ min: 0.25 * window.innerWidth, max: window.innerWidth });
  useResize(() => setLimits({ min: 0.25 * window.innerWidth, max: window.innerWidth }));

  console.log(limits);

  let height = useMotionValue(0);
  let x = useMotionValue(0);
  let y = useMotionValue(0);

  const bindDrag = useDrag(({ active, movement: [mx, my], direction: [, yDir], velocity }) => {
    let yDisplacement = clamp((Math.abs(my) * 2) / window.innerHeight);

    // const newHeight = lerp(CONTROLS_HEIGHT_LIMIT_IN_VW.max, CONTROLS_HEIGHT_LIMIT_IN_VW.min, yDisplacement);
    // console.log(yDisplacement, newHeight);

    height.set(yDisplacement);
    x.set(mx);
    y.set(my);
  });

  return (
    <main className="w-screen h-screen flex flex-col" {...bindDrag()}>
      <motion.div className="w-full " style={{}}>
        <Library />
      </motion.div>

      <motion.div
        className="w-full"
        style={{
          height: useTransform(height, [0, 1], [limits.max, limits.min])
        }}
      >
        <Controls />
      </motion.div>

      <motion.div className="w-full grow" style={{}}>
        <Playing />
      </motion.div>
    </main>
  );
}
