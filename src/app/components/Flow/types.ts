import type { ComponentType, ReactElement } from 'react';

export interface IFlowComponentProps {
  // @todo: Remove, and only use Redux actions for navigation?
  onNext(): void;
  onPrevious(): void;
  onReset(): void;
  flowHeader: ReactElement;
}

export interface IFlowComponent {
  component: ComponentType<IFlowComponentProps>;
}
