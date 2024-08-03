import { Image } from '@chakra-ui/react';

import type { ImageProps } from '@chakra-ui/react';

import { IMAGE_URLS } from '@/assets/images';

export function ImagePlaceholder(props: ImageProps) {
  return <Image w="full" h="full" objectFit="cover" {...props} src={IMAGE_URLS.imagePlaceholder} />;
}
