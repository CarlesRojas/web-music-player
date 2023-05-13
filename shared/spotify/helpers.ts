import { Image } from './schemas';

export const getBiggestImage = (images: Image[]) => {
  return images.reduce((biggestImage: Image | null, image) => {
    if (biggestImage === null) return image;
    return image.width && biggestImage.width && image.width > biggestImage.width ? image : biggestImage;
  }, null);
};

export const getSmallestImage = (images: Image[]) => {
  return images.reduce((smallestImage: Image | null, image) => {
    if (smallestImage === null) return image;
    return image.width && smallestImage.width && image.width < smallestImage.width ? image : smallestImage;
  }, null);
};

export const millisecondsToDuration = (ms: number) => {
  let seconds = ms / 1_000;
  const hours = Math.floor(seconds / 3_600);
  const formathours = hours ? `${Math.floor(seconds / 3_600)}:` : '';
  seconds = seconds % 3_600;
  const minutes = `${Math.floor(seconds / 60)}:`;
  seconds = Math.round(seconds % 60);
  const formatedSeconds = seconds > 9 ? seconds : `0${seconds}`;
  return `${formathours}${minutes}${formatedSeconds}`;
};

export const prettifyName = (name: string) => {
  const separators = [' - ', '(', ':', ',', ' /'];

  var index = Number.MAX_SAFE_INTEGER;
  for (var i = 0; i < separators.length; ++i) {
    var result = name.indexOf(separators[i]);
    if (result > 0) index = Math.min(index, name.indexOf(separators[i]));
  }

  if (index > 0 && index < name.length) name = name.substring(0, index);
  return name.trim();
};
