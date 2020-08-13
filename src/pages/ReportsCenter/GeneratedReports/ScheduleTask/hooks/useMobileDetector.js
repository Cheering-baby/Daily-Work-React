import { useEffect, useState } from 'react';
import SCREEN from '@/utils/screen';

const useMobileDetector = width => {
  const [result, setResult] = useState(false);

  useEffect(() => {
    setResult(width < SCREEN.screenSm);
  }, [width]);

  return [result];
};

export default useMobileDetector;
