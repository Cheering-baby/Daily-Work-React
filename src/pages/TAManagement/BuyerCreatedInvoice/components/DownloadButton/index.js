import { Button } from 'antd';
import React from 'react';
import { formatMessage } from 'umi/locale';
import download from '@/pages/ReportCenter/PamsReport/utils/downloadUtils';

const DownloadButton = ({ url, method, body, defFileName }) => {
  return (
    <Button
      type="primary"
      style={{ width: 80 }}
      htmlType="button"
      onClick={() => download({ url, method, body, defFileName })}
    >
      {formatMessage({ id: 'BUTTON_DOWNLOAD' })}
    </Button>
  );
};
export default DownloadButton;
