import { AspectRatio, Spinner } from '@chakra-ui/react';
import ReactPlayer from 'react-player';

const aspectRatio = {
  '16/9': 16 / 9,
  '4/3': 4 / 3,
  1: 1,
} as const;

export interface VideoPlayerProps {
  src: string;

  ratio?: keyof typeof aspectRatio;

  maxW?: `${number | string}px` | 'full';
}

export function VideoPlayer(props: VideoPlayerProps) {
  const { src, ratio = '4/3', maxW } = props;
  if (!src) return null;

  return (
    <AspectRatio ratio={aspectRatio[ratio]} maxW={maxW || '500px'} h="full">
      <ReactPlayer
        url={src}
        controls
        width="100%"
        height="100%"
        fallback={<Spinner size="md" thickness="3px" />}
      />
    </AspectRatio>
  );
}
