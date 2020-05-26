import { useCallback, useState } from 'react';

const useCustomerGroupList = customerGroupMap => {
  const [customerGroupList, setCustomerGroupList] = useState([]);

  const setCustomerGroupListByCategoryType = useCallback(
    categoryType => {
      setCustomerGroupList(customerGroupMap[categoryType] || []);
    },
    [customerGroupMap]
  );

  return [customerGroupList, setCustomerGroupListByCategoryType];
};

export default useCustomerGroupList;
