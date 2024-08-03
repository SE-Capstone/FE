import type { ReactElement } from 'react';
import { useState } from 'react';

export function useMultiStepForm(stepsForm: ReactElement[]) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  function next() {
    return setCurrentStepIndex((i) => {
      if (i >= stepsForm.length - 1) return i;

      return i + 1;
    });
  }

  function back() {
    return setCurrentStepIndex((i) => {
      if (i <= 0) return i;

      return i - 1;
    });
  }

  function goTo(index: number) {
    return setCurrentStepIndex(index);
  }

  function resetStep() {
    return setCurrentStepIndex(0);
  }

  return {
    currentStepIndex,
    step: stepsForm[currentStepIndex],
    stepsForm,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === stepsForm.length - 1,
    goTo,
    next,
    back,
    resetStep,
  };
}
