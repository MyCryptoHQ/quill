import { ComponentType } from 'react';

export interface IFlowComponentProps {
  onNext(): void;
  onPrevious(): void;
  onReset(): void;
}

export interface IFlowComponent {
  component: ComponentType<IFlowComponentProps>;
}
