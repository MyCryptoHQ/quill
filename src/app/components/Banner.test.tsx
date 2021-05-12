import { fireEvent, render } from '@testing-library/react';

import { Banner } from '@components/Banner';

describe('Banner', () => {
  it('renders the label', () => {
    const { getByText } = render(<Banner type="info" label="Foo bar" />);
    expect(() => getByText('Foo bar')).not.toThrow();
  });

  it('renders the children when extended', () => {
    const { getByText, getByTestId } = render(
      <Banner type="info" label="Foo bar">
        Baz qux
      </Banner>
    );
    expect(() => getByText('Baz qux')).toThrow();

    const toggle = getByTestId('banner-toggle');
    fireEvent.click(toggle);

    expect(() => getByText('Baz qux')).not.toThrow();
  });

  it('renders the children when extended by default', () => {
    const { getByText } = render(
      <Banner type="info" label="Foo bar" extended={true}>
        Baz qux
      </Banner>
    );
    expect(() => getByText('Baz qux')).not.toThrow();
  });

  it('renders an inner banner', () => {
    const { getByText } = render(<Banner type="info" label="Foo bar" banner="Baz qux" />);
    expect(() => getByText('Baz qux')).not.toThrow();
  });
});
