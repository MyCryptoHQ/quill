import { fireEvent, render } from '@testing-library/react';

import { CopyableText } from '@components/CopyableText';

Object.assign(navigator, {
  clipboard: {
    writeText: () => Promise.resolve(undefined)
  }
});

describe('CopyableText', () => {
  it('copies text to the clipboard when clicking the button', () => {
    const spy = jest.spyOn(navigator.clipboard, 'writeText');

    const { findByText, getByTestId } = render(<CopyableText>foo</CopyableText>);
    expect(findByText('foo')).toBeDefined();

    const button = getByTestId('copy-button');
    fireEvent.click(button);

    expect(spy).toHaveBeenCalledWith('foo');
  });
});
