import React from 'react';
import { formatMessage } from 'umi/locale';

const noDataIcon = require('../../assets/image/no-data.svg');

function NoDataTemplate(props) {
  const { noDataText } = props;
  return (
    <div className="no-template">
      <img src={noDataIcon} alt={noDataText || formatMessage({ id: 'COMMON_NO_DATA' })} />
      <div>{noDataText || formatMessage({ id: 'COMMON_NO_DATA' })}</div>
    </div>
  );
}

export default NoDataTemplate;
