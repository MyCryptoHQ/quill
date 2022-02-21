import QrScanner from 'qr-scanner';
import type { RefObject } from 'react';
import { useEffect, useMemo, useState } from 'react';

/**
 * This hook is needed to make it testable. `render(<Scanner />)` does not initialise the ref, so the code would
 * never be executed then.
 */
export const useScanner = (
  ref: RefObject<HTMLVideoElement>,
  onDecode: (message: { data: string }) => void
): { isLoading: boolean; error: string; scanner: QrScanner | null } => {
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const scanner = useMemo(
    () => ref.current && new QrScanner(ref.current, onDecode, { highlightScanRegion: true }),
    [ref.current]
  );

  useEffect(() => {
    setLoading(true);

    if (scanner) {
      scanner
        .start()
        .catch(setError)
        .finally(() => setLoading(false));

      return () => scanner.destroy();
    }
  }, [scanner]);

  return { isLoading, error, scanner };
};
