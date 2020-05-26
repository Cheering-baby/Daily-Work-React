import { useCallback, useState } from 'react';

const calc = (arr, curr, size) => arr.slice((curr - 1) * size, curr * size);

const usePartialList = () => {
  const [initList, setInitList] = useState([]);
  const [partialList, setPartialList] = useState([]);
  const [page, setPage] = useState({ current: 1, size: 5, total: 0 });

  const fetch = useCallback(
    (current, size) => {
      if (current < 0 || size < 0) throw new Error('Please check your params. (current,size)');
      let curr = current;
      const totalPages = Math.ceil(initList.length / size);
      if (current > totalPages) curr = totalPages;
      setPartialList(calc(initList, curr, size));
      setPage(prev => ({ ...prev, current: curr, size }));
    },
    [initList]
  );

  const initialize = useCallback((arr, current, size) => {
    setInitList(arr);
    setPartialList(calc(arr, current, size));
    setPage({ total: arr.length, current, size });
  }, []);

  return [partialList, page, fetch, initialize];
};

export default usePartialList;
