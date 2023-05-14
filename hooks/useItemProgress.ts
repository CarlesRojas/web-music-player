import { usePlaybackState } from '@/shared/spotify/query/usePlaybackState';
import { useTime, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function useItemProgress() {
  const { playbackState } = usePlaybackState();

  const [durationMs, setDurationMs] = useState(0);
  const [progressMs, setProgressMs] = useState(0);
  const time = useTime();
  const startTime = useRef(0);

  useEffect(() => {
    if (!playbackState || !playbackState.progress_ms) return;
    setDurationMs(playbackState.item.duration_ms);
    setProgressMs(playbackState.progress_ms);
    startTime.current = time.get();
  }, [playbackState, time]);

  const progressPercentage = useTransform(
    time,
    [startTime.current - progressMs, startTime.current - progressMs + durationMs],
    ['0%', '100%']
  );

  return { progressPercentage, durationMs, progressMs };
}
