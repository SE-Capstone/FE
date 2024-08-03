import { AspectRatio, Image } from '@chakra-ui/react';

import type { AspectRatioProps, ImageProps } from '@chakra-ui/react';

// `21/9`, `16/9`, `9/16`, `4/3`, `1.85/1`
const ratioMap = {
  '16:9': 16 / 9,
  '4:3': 4 / 3,
  '1:1': 1,
  '21:9': 21 / 9,
  '9:16': 9 / 16,
} as const;

export type CustomImageProps = Omit<AspectRatioProps, 'ratio'> & {
  ratio?: keyof typeof ratioMap;
  maxW: AspectRatioProps['maxW'];
  src: ImageProps['src'];
  imageProps?: ImageProps;
};

export function CustomImage(props: CustomImageProps) {
  const { maxW, ratio = '16:9', src, imageProps, ...restProps } = props;

  return (
    <AspectRatio
      maxW={maxW}
      ratio={ratioMap[ratio]}
      cursor={restProps.onClick ? 'pointer' : undefined}
      {...restProps}
    >
      <Image src={src} objectFit="cover" {...imageProps} />
    </AspectRatio>
  );
}
