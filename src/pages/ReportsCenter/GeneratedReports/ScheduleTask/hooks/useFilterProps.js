import { useCallback } from 'react';

const useFilterProps = (fetchDataList, initialPageSize, initialCurrPage) => {
  const search = useCallback(
    payload => {
      fetchDataList(payload);
    },
    [fetchDataList]
  );

  const reset = useCallback(
    payload => {
      fetchDataList({
        ...payload,
        filterOptions: {},
        sortOptions: [],
        pageSize: initialPageSize,
        currentPage: initialCurrPage,
      });
    },
    [fetchDataList]
  );
  return { search, reset };
};

export default useFilterProps;
