import { translateRaw } from '@quill/common';
import { render } from '@testing-library/react';
import type { Result } from '@zxing/library';
import { QrReader } from 'react-qr-reader';

import { fRawTransaction } from '@fixtures';

import { Scanner } from './Scanner';

beforeEach(() => {
  jest.clearAllMocks();
});

jest.mock('react-qr-reader', () => ({
  QrReader: jest.fn().mockReturnValue(null)
}));

describe('Scanner', () => {
  it('decodes the QR data', () => {
    const onScan = jest.fn();
    const { getByText } = render(<Scanner onScan={onScan} />);

    const mock = QrReader as jest.MockedFunction<typeof QrReader>;
    const handleDecode = mock.mock.calls[0][0].onResult!;

    handleDecode({ getText: () => 'foo' } as Result);
    expect(getByText(translateRaw('INVALID_SIGNED_TRANSACTION_QR'))).toBeDefined();

    handleDecode({ getText: () => fRawTransaction } as Result);
    expect(onScan).toHaveBeenCalledWith(fRawTransaction);
  });
});
