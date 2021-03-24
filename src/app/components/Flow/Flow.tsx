import React, { useEffect, useState } from 'react';

import { FlowHeader } from './FlowHeader';
import { IFlowComponent } from './types';

interface FlowProps {
  components: IFlowComponent[];
  onDone(): void;
}

export const Flow = ({ components, onDone }: FlowProps) => {
  const [step, setStep] = useState(0);

  const handleNext = () => setStep((step) => step + 1);

  const handlePrevious = () =>
    setStep((step) => {
      if (step > 1) {
        return step - 1;
      }

      return 0;
    });

  const handleReset = () => setStep(0);

  useEffect(() => {
    if (step >= components.length) {
      onDone();
    }
  }, [step]);

  const Component = components[step]?.component;
  if (!Component) {
    return null;
  }

  return (
    <>
      <FlowHeader
        onPrevious={handlePrevious}
        steps={components.length}
        currentStep={step}
        mt="3"
        mb="2"
      />
      <Component onNext={handleNext} onPrevious={handlePrevious} onReset={handleReset} />
    </>
  );
};
