import { Image } from '@/shared/spotify/schemas';
import { FastAverageColor, FastAverageColorResult } from 'fast-average-color';
import { useEffect, useRef, useState } from 'react';

export default function useAverageColor(image: Image | null) {
  const [averageColor, setAverageColor] = useState<FastAverageColorResult>();
  const fastAverageColor = useRef(new FastAverageColor());
  useEffect(() => {
    if (!image) return;

    const calculateAverageColor = async () => {
      const result = await fastAverageColor.current.getColorAsync(image.url);
      setAverageColor(result);
    };

    calculateAverageColor();
  }, [image]);

  return averageColor;
}
