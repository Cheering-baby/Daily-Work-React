import { useCallback } from 'react';
import { message } from 'antd';

const useMessage = msgMap => {
  const showMessage = useCallback(
    ({ resultCode, resultMsg }) => {
      const msgObj = msgMap[resultCode];
      if (!msgObj) return message.warn(resultMsg);
      const { type, msg } = msgObj;
      message[type](msg);
    },
    [msgMap]
  );
  return [showMessage];
};

export default useMessage;
