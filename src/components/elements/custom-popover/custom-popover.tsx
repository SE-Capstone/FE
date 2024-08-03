import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from '@chakra-ui/react';

import type { MaybeElementRenderProps } from '@/types';
import type { PopoverContentProps, PopoverProps } from '@chakra-ui/react';

interface IStatePopover {
  isOpen: boolean;
  onClose: () => void;
  forceUpdate: (() => void) | undefined;
}

interface CustomPopoverProps extends Omit<PopoverProps, 'children'> {
  triggerButton: (props: IStatePopover) => React.ReactElement;
  children: MaybeElementRenderProps<IStatePopover>;

  popoverContentProps?: PopoverContentProps;
}

export const CustomPopover = (props: CustomPopoverProps) => {
  const { children, triggerButton, popoverContentProps, ...rest } = props;

  return (
    <Popover matchWidth isLazy closeOnBlur closeOnEsc {...rest}>
      {(props) => {
        const childrenRender = typeof children === 'function' ? children(props) : children;

        return (
          <>
            <PopoverTrigger>{triggerButton(props)}</PopoverTrigger>
            <PopoverContent
              border="none"
              shadow="card"
              rounded="12px"
              w="max-content"
              h="max-content"
              {...popoverContentProps}
            >
              {childrenRender}
            </PopoverContent>
          </>
        );
      }}
    </Popover>
  );
};

CustomPopover.PopoverArrow = PopoverArrow;
CustomPopover.PopoverCloseButton = PopoverCloseButton;
CustomPopover.PopoverHeader = PopoverHeader;
CustomPopover.PopoverBody = PopoverBody;
