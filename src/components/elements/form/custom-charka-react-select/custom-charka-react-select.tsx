import type React from 'react';
import type { ElementType } from 'react';
import { useMemo } from 'react';

import { Box, Icon, Tooltip } from '@chakra-ui/react';
import { Select, chakraComponents } from 'chakra-react-select';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { MayBeController } from '../types';
import type { FieldWrapperProps } from '@/components/elements';
import type { IOptionUserSelect } from '@/modules/projects/detail-project/components/users-async-select';
import type {
  Props as ChakraSelectProps,
  ChakraStylesConfig,
  GroupBase,
  MultiValue,
  OnChangeValue,
  OptionBase,
  PropsValue,
  SelectComponentsConfig,
  SelectInstance,
  SingleValue,
} from 'chakra-react-select';
import type { FieldValues } from 'react-hook-form';

import { FieldWrapper } from '@/components/elements';

export interface CustomOptionSelectBase extends OptionBase {
  label: string | JSX.Element;
  value: number | string;
  isDisabled?: boolean;
  onClickOption?: () => void;
  IconOption?: ElementType;
}

export type CustomChakraReactSelectProps<
  TFormValues extends FieldValues = FieldValues,
  IsMulti extends boolean = false,
  TOption extends CustomOptionSelectBase = CustomOptionSelectBase
> = Omit<ChakraSelectProps<TOption, IsMulti, GroupBase<TOption>>, 'name'> &
  React.RefAttributes<SelectInstance<TOption, IsMulti, GroupBase<TOption>>> &
  Omit<FieldWrapperProps, 'error'> &
  MayBeController<TFormValues> & {
    onChangeLabel?: (value: string[]) => void;
  } & {
    setValue?: IOptionUserSelect;
  };

export const CustomChakraReactSelect = <
  TFormValues extends FieldValues = FieldValues,
  IsMulti extends boolean = false,
  TOption extends CustomOptionSelectBase = CustomOptionSelectBase
>(
  props: CustomChakraReactSelectProps<TFormValues, IsMulti, TOption>
) => {
  const { t } = useTranslation();
  const {
    control,
    name,
    labelProps,
    controlProps,
    errorMessageProps,
    label,
    isMulti,
    components,
    chakraStyles,
    setValue,
    onChangeLabel,
    ...selectProps
  } = props;

  const customComponents = useMemo<SelectComponentsConfig<TOption, IsMulti, GroupBase<TOption>>>(
    () => ({
      Option: ({ children, ...props }) => {
        const { data } = props;
        const { IconOption, onClickOption } = data;
        return (
          <chakraComponents.Option {...props}>
            <Box w="full" display="flex" alignItems="center" justifyContent="space-between">
              {children}
              {IconOption && (
                <Icon
                  as={IconOption}
                  mr={2}
                  boxSize={5}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onClickOption && onClickOption();
                  }}
                />
              )}
            </Box>
          </chakraComponents.Option>
        );
      },

      MultiValue({ children, ...props }) {
        const { data } = props;

        const { label } = data;

        return (
          <Tooltip label={label} placement="top">
            <chakraComponents.MultiValue {...props}>{children}</chakraComponents.MultiValue>
          </Tooltip>
        );
      },
      ...components,
    }),
    [components]
  );

  const stylesComponents = useMemo<ChakraStylesConfig<TOption, IsMulti, GroupBase<TOption>>>(
    () => ({
      control: (provide) => ({
        ...provide,
        pr: 4,
        _disabled: { bg: 'white' },

        borderRadius: { base: '6px !important', '2xl': '8px !important' },
      }),
      indicatorsContainer: (provide) => ({
        ...provide,
        bg: 'none',
        pr: '0 !important',
        borderColor: 'transparent !important',
      }),

      menuList: (provide) => ({
        ...provide,
        borderColor: '#EDF2F7',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        rounded: '5px',
      }),

      dropdownIndicator: (provide, { isFocused }) => ({
        ...provide,
        background: 'none',
        px: '0',
        transitionProperty: 'transform color',
        transition: '0.3s ease',
        color: isFocused ? 'primary' : undefined,
        transform: isFocused ? 'rotate(180deg)' : undefined,
      }),

      clearIndicator: (provide) => ({
        ...provide,
        size: 'sm',
      }),

      option: (provide, state) => ({
        ...provide,
        bg: state.isSelected ? '#c7eaff' : 'white',
        color: 'textColor',
        _hover: { bg: '#def2fe', color: 'textColor' },
        transition: 'background 0.3s ease',
        fontSize: { base: 'sm', '2xl': 'sm' },
      }),

      container: (provide) => ({
        ...provide,
        bg: 'white',
        borderColor: '#E2E8F0',
        rounded: { base: '6px !important', '2xl': '8px !important' },
      }),
      noOptionsMessage: (provide) => ({
        ...provide,
        fontSize: { base: 'sm', '2xl': 'sm' },
        p: { base: 0, '2xl': 1 },
      }),
      loadingMessage: (provide) => ({
        ...provide,
        fontSize: { base: 'sm', '2xl': 'sm' },
        p: { base: 0, '2xl': 1 },
      }),
      placeholder: (provide) => ({
        ...provide,
        color: 'textColor',
        fontSize: { base: 'xs', '2xl': 'xs' },
      }),
      multiValue: (provide) => ({
        ...provide,
        fontSize: { base: 'sm', '2xl': 'sm' },
        fontWeight: 'medium',
      }),

      singleValue: (provide) => ({
        ...provide,
        fontSize: { base: 'sm', '2xl': 'sm' },
      }),

      ...chakraStyles,
    }),
    [chakraStyles]
  );

  const basePropsSelect: Partial<ChakraSelectProps<TOption, IsMulti, GroupBase<TOption>>> = useMemo(
    () => ({
      size: { base: 'md', xl: 'md' },
      menuPosition: 'fixed',
      closeMenuOnSelect: !isMulti,
      components: customComponents,
      chakraStyles: stylesComponents,
      focusBorderColor: 'primary',
      autoFocus: false,
      placeholder: `${t('common.choose')}...`,
      isClearable: true,
    }),
    [customComponents, isMulti, stylesComponents, t]
  );

  return control && name ? (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        const value =
          field.value && isMulti && Array.isArray(field.value)
            ? selectProps.options?.filter(
                (option) => 'value' in option && field.value.includes(option.value)
              )
            : setValue ||
              (selectProps.options?.find(
                (option) => 'value' in option && option.value === field.value
              ) ??
                null);

        const propsWithController = {
          ref: field.ref,
          name: field.name,
          value: value as PropsValue<TOption> | undefined,
          onChange: (option: OnChangeValue<TOption, IsMulti> | undefined) => {
            if (!option) {
              field.onChange(undefined as any);
              return;
            }
            const multipleOption = option as MultiValue<TOption>;

            if (isMulti && Array.isArray(multipleOption)) {
              field.onChange(multipleOption.map((opt) => opt.value) as any);
              onChangeLabel?.(
                multipleOption.map((opt) => (typeof opt?.label === 'string' ? opt.label : ''))
              );
              return;
            }

            const singleOption = option as SingleValue<TOption>;

            field.onChange(setValue ? setValue.value : singleOption?.value ?? (undefined as any));

            onChangeLabel?.([
              setValue
                ? (setValue.label as string)
                : typeof singleOption?.label === 'string'
                ? singleOption.label
                : '',
            ]);
          },
        };
        return (
          <FieldWrapper
            labelProps={labelProps}
            controlProps={{ ...controlProps, isRequired: selectProps.isRequired }}
            errorMessageProps={errorMessageProps}
            error={error}
            label={label}
          >
            <Select
              isMulti={isMulti}
              {...basePropsSelect}
              {...propsWithController}
              {...selectProps}
            />
          </FieldWrapper>
        );
      }}
    />
  ) : (
    <FieldWrapper
      labelProps={labelProps}
      controlProps={{ ...controlProps, isRequired: selectProps.isRequired }}
      errorMessageProps={errorMessageProps}
      label={label}
    >
      <Select
        isMulti={isMulti}
        name={name as string}
        noOptionsMessage={() => t('common.noData')}
        {...basePropsSelect}
        {...selectProps}
      />
    </FieldWrapper>
  );
};
