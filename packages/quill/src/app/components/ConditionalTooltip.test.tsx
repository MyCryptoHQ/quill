import { render } from '@testing-library/react';
import type { ComponentProps } from 'react';

import { ConditionalTooltip } from './ConditionalTooltip';

const getComponent = (props: ComponentProps<typeof ConditionalTooltip>) => {
  return render(<ConditionalTooltip {...props} />);
};

describe('ConditionalTooltip', () => {
  it('shows tooltip if condition is true', async () => {
    const { getByText, findByText } = getComponent({
      config: { trigger: 'click' },
      condition: true,
      tooltip: 'foo',
      children: 'bar'
    });

    const button = getByText('bar');

    button.click();

    await expect(findByText('foo')).resolves.toBeDefined();
  });

  it('doesnt show tooltip if condition is false', async () => {
    const { getByText, findByText } = getComponent({
      config: { trigger: 'click' },
      condition: false,
      tooltip: 'foo',
      children: 'bar'
    });

    const button = getByText('bar');

    button.click();

    await expect(findByText('foo')).rejects.toThrow();
  });
});
