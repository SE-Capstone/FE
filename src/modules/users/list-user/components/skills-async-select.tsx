import { HStack } from '@chakra-ui/react';
import { createFilter } from 'chakra-react-select';
import { useTranslation } from 'react-i18next';

import type { CustomChakraReactSelectProps, CustomOptionSelectBase } from '@/components/elements';
import type { FieldValues } from 'react-hook-form';

import { CustomChakraReactSelect } from '@/components/elements';
import { useGetListSkillQuery } from '@/modules/skills/hooks/queries';

export type IOptionSkillSelect = CustomOptionSelectBase;

type SkillsAsyncSelectProps<
  TFormValues extends FieldValues,
  IsMulti extends boolean = false
> = CustomChakraReactSelectProps<TFormValues, IsMulti, IOptionSkillSelect> & {
  defaultSkillValue?: string[];
  ignoreSkillIds?: string[];
};

export function SkillsAsyncSelect<TFormValues extends FieldValues, IsMulti extends boolean>(
  props: SkillsAsyncSelectProps<TFormValues, IsMulti>
) {
  const { t } = useTranslation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { defaultSkillValue, ignoreSkillIds, ...propsSelect } = props;

  const { listSkill, isLoading, isRefetching } = useGetListSkillQuery({
    size: 1000000,
  });

  const options = listSkill.map((skill) =>
    // Turn on if you want to disable the option
    // const isDisabled = defaultSkillValue?.includes(Skill.id);
    ({
      value: skill.id,
      label: skill.title,
      // isDisabled,
    })
  );

  const chakraStyles: CustomChakraReactSelectProps<
    TFormValues,
    IsMulti,
    IOptionSkillSelect
  >['chakraStyles'] = {
    menuList: (provided) => ({
      ...provided,
      borderColor: '#EDF2F7',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      rounded: '5px',
      maxHeight: '200px',
      py: 0,
      shadow: 'lg',
    }),
    menu: (provided) => ({
      ...provided,
      rounded: 2,
    }),
  };

  return (
    <HStack w="full">
      <CustomChakraReactSelect<TFormValues, IsMulti, IOptionSkillSelect>
        placeholder={`${t('common.choose')} ${t('fields.members').toLowerCase()}...`}
        filterOption={createFilter({ ignoreAccents: false })}
        isLoading={isLoading || isRefetching}
        isOptionDisabled={(option) => option.isDisabled || isLoading}
        options={options}
        chakraStyles={chakraStyles}
        isSearchable
        menuShouldScrollIntoView
        {...propsSelect}
      />
    </HStack>
  );
}
