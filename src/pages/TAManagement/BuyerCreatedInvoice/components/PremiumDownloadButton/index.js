import { Button, Dropdown, Icon, Menu } from 'antd';
import React from 'react';
import { formatMessage } from 'umi/locale';
import 'isomorphic-fetch';
import download from '@/pages/ReportCenter/PamsReport/utils/downloadUtils';

const PremiumDownloadButton = ({ url, method, body, defFileName, loading, disabled = false }) => {
  const menu = (
    <Menu>
      <Menu.Item
        key="1"
        onClick={() => {
          Object.assign(body, { fileSuffixType: 'xlsx' });
          download({ url, method, body, defFileName, loading });
        }}
      >
        EXCEL
      </Menu.Item>
      <Menu.Item
        key="2"
        onClick={() => {
          Object.assign(body, { fileSuffixType: 'pdf' });
          download({ url, method, body, defFileName, loading });
        }}
      >
        PDF
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} style={{ width: 80 }} disabled={disabled}>
      <Button type="primary">
        {formatMessage({ id: 'BUTTON_DOWNLOAD' })} <Icon type="down" />
      </Button>
    </Dropdown>
  );
};

export default PremiumDownloadButton;
