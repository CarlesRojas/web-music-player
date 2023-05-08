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
