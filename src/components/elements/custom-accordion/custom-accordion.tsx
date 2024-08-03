import React from 'react';

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Skeleton,
} from '@chakra-ui/react';

import type { MaybeElementRenderProps } from '@/types';
import type {
  AccordionItemProps,
  AccordionPanelProps,
  AccordionProps,
  AccordionButtonProps,
} from '@chakra-ui/react';

interface IStateAccordion {
  isExpanded: boolean;
  isDisabled: boolean;
}

export interface IAccordionItem {
  title: MaybeElementRenderProps<IStateAccordion>;
  accordionItemProps?: Omit<AccordionItemProps, 'isDisabled'>;

  panel: MaybeElementRenderProps<IStateAccordion>;
  accordionPanelProps?: AccordionPanelProps;

  isDisabled?: boolean;

  accordionButtonProps?: AccordionButtonProps;
}

interface CustomAccordionProps extends AccordionProps {
  accordionItems: IAccordionItem[];
  isDisableAll?: boolean;
  isLoading?: boolean;
  defaultIsOpen?: boolean;
}

export const CustomAccordion = React.memo(
  ({
    accordionItems = [],
    isDisableAll = undefined,
    isLoading = false,

    defaultIsOpen = false,
    ...accordionProps
  }: CustomAccordionProps) => {
    const defaultIndex = defaultIsOpen ? Array.from(accordionItems.keys()) : undefined;
    return (
      <Accordion allowMultiple defaultIndex={defaultIndex} {...accordionProps}>
        {accordionItems.map(
          (
            {
              panel,
              title,
              isDisabled = false,
              accordionButtonProps,
              accordionItemProps,
              accordionPanelProps,
            },
            index
          ) => (
            <AccordionItem
              key={index}
              border="none !important"
              isDisabled={isDisableAll || isLoading || isDisabled}
              {...accordionItemProps}
            >
              {(props) => {
                const titleRender = typeof title === 'function' ? title(props) : title;
                return (
                  <>
                    <AccordionButton
                      py={{ base: 2, lg: 3 }}
                      display="flex"
                      fontWeight="semibold"
                      justifyContent="space-between"
                      {...accordionButtonProps}
                    >
                      {isLoading ? <Skeleton w="full" h="40px" /> : <>{titleRender}</>}
                      <AccordionIcon
                        fontWeight={400}
                        fontSize={{ base: '16px', md: '20px' }}
                        color={props.isExpanded ? 'primary' : 'textColor'}
                        _hover={{ color: 'primary' }}
                      />
                    </AccordionButton>

                    <AccordionPanel bg="white" {...accordionPanelProps}>
                      {typeof panel === 'function' ? panel(props) : panel}
                    </AccordionPanel>
                  </>
                );
              }}
            </AccordionItem>
          )
        )}
      </Accordion>
    );
  }
);
