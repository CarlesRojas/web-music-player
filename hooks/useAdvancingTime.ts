import { useEffect, useState } from 'react';

export default function useAdvancingTime(initialTimeInMs: number | null) {
  const [time, setTime] = useState(initialTimeInMs);

  useEffect(() => {
    if (!time) return;
    const interval = setInterval(() => {
      setTime(time + 1_000);
    }, 1_000);

    return () => {
      clearInterval(interval);
    };
  }, [time]);

  useEffect(() => {
    setTime(initialTimeInMs);
  }, [initialTimeInMs]);

  return time;
}
