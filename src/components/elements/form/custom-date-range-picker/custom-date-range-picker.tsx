import { useState } from 'react';

import { RangeDatepicker } from 'chakra-dayzed-datepicker';

export interface CustomDateRangePickerProps {
  defaultValues?: [Date, Date];
  onChange: (dates: Date[]) => void;
}

export function CustomDateRangePicker(props: CustomDateRangePickerProps) {
  const { defaultValues = [new Date(), new Date()], onChange } = props;
  const [selectedDates, setSelectedDates] = useState<Date[]>(defaultValues);

  return (
    <RangeDatepicker
      propsConfigs={{
        dayOfMonthBtnProps: {
          defaultBtnProps: {
            _hover: {
              color: 'white',
              bg: 'primary',
            },
          },
          selectedBtnProps: {
            color: 'white',
            bg: 'primary',
          },
          isInRangeBtnProps: {
            color: 'white',
            bg: 'primary',
          },
        },
        inputProps: {
          size: { base: 'md', md: 'lg' },
          fontSize: { base: 'xs', lg: 'sm' },
          focusBorderColor: 'primary',
          textAlign: 'center',
          fontWeight: 'medium',
          rounded: { base: 2 },
        },
      }}
      configs={{
        dateFormat: 'dd/MM/yyyy',
      }}
      selectedDates={selectedDates}
      closeOnSelect
      usePortal
      onDateChange={(dates) => {
        setSelectedDates(dates);
        if (dates.length === 2) onChange(dates);
      }}
    />
  );
}
