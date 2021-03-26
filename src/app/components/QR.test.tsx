import React from 'react';

import { render, waitFor } from '@testing-library/react';

import { QR } from '@components';

describe('QR', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('renders a QR code', async () => {
    const { getByTestId } = render(<QR data="foo bar" size={100} />);
    const image = getByTestId('qr-code');

    await waitFor(() => expect(image.getAttribute('src')).toBeTruthy());
  });
});
