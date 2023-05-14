import { useEffect, useState } from 'react';

export default function useAdvancingTime(initialTimeInMs: number | null, paused = false) {
  const [time, setTime] = useState(initialTimeInMs);

  useEffect(() => {
    if (!time) return;
    const interval = setInterval(() => {
      if (paused) return;
      setTime(time + 200);
    }, 200);

    return () => {
      clearInterval(interval);
    };
  }, [paused, time]);

  useEffect(() => {
    setTime(initialTimeInMs);
  }, [initialTimeInMs]);

  return time;
}
