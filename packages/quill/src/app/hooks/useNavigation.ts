import { setNavigationBack } from '@quill/common';
import { useEffect } from 'react';

import { useDispatch } from '@store';

export const useNavigation = (back: string) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setNavigationBack(back));

    return () => dispatch(setNavigationBack(undefined));
  }, []);
};
