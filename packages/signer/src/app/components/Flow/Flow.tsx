import { getFlowStep, nextFlow, previousFlow, resetFlow } from '@signer/common';
import { goBack } from 'connected-react-router';
import { useEffect } from 'react';

import { useUnmount } from '@hooks';
import { useDispatch, useSelector } from '@store';

import { FlowHeader } from './FlowHeader';
import type { IFlowComponent } from './types';

export interface FlowProps {
  components: IFlowComponent[];

  onDone(): void;
}

export const Flow = ({ components, onDone }: FlowProps) => {
  const dispatch = useDispatch();
  const step = useSelector(getFlowStep);

  const handleNext = () => {
    dispatch(nextFlow());
  };

  const handlePrevious = () => {
    if (step >= 1) {
      return dispatch(previousFlow());
    }

    dispatch(goBack());
  };

  const handleReset = () => {
    dispatch(resetFlow());
  };

  useEffect(() => {
    if (step >= components.length) {
      onDone();
    }
  }, [step]);

  useUnmount(() => {
    dispatch(resetFlow());
  });

  const Component = components[step]?.component;
  if (!Component) {
    return null;
  }

  return (
    <>
      <Component
        onNext={handleNext}
        onPrevious={handlePrevious}
        onReset={handleReset}
        flowHeader={
          <FlowHeader
            onPrevious={handlePrevious}
            steps={components.length}
            currentStep={step}
            mb="2"
          />
        }
      />
    </>
  );
};
