import { useCallback, useState } from 'react';

const useLoading = () => {
  const [loading, setLoading] = useState(false);

  const open = useCallback(
    () => {
      setLoading(true);
    },
    [],
  );

  const close = useCallback(
    () => {
      setLoading(false);
    },
    [],
  );


  return [loading, open, close];
};

export default useLoading;
