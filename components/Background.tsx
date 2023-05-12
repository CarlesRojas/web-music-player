import { getBiggestImage } from '@/shared/spotify/helpers';
import { useQueue } from '@/shared/spotify/query/useQueue';

export default function Background() {
  const { queue } = useQueue();
  const image = queue ? getBiggestImage(queue.currently_playing.album.images) : null;

  return (
    <div
      style={image ? { backgroundImage: `url(${image.url})` } : undefined}
      className="pointer-events-none select-none absolute top-0 left-0 h-[calc(100vh_+_8rem)] w-[calc(100vh_+_8rem)] brightness-[15%] blur-lg bg-gray-950 block overflow-hidden mt-[-4rem] ml-[calc(50vw_-_calc(50vh_+_4rem))]  bg-center bg-[size:auto_100%]"
    />
  );
}
