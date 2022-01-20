import type { TooltipProps } from '@mycrypto/ui';
import { Tooltip } from '@mycrypto/ui';
import type { FunctionComponent } from 'react';

export interface Props extends TooltipProps {
  condition: boolean;
}

export const ConditionalTooltip: FunctionComponent<Props> = ({
  condition,
  tooltip,
  children,
  ...props
}) =>
  condition ? (
    <Tooltip tooltip={tooltip} {...props}>
      {children}
    </Tooltip>
  ) : (
    <>{children}</>
  );
