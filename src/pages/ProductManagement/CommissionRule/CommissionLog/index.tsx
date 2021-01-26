import React from 'react';
import MediaQuery from 'react-responsive';
import { formatMessage } from 'umi/locale';
import { Row, Col } from 'antd';
import SCREEN from '@/utils/screen';
import BreadcrumbCompForPams from '@/components/BreadcrumbComp/BreadcurmbCompForPams';
import LogTable from './components/LogTable';
import Search from './components/Search';

const title = [
  { name: formatMessage({ id: 'PRODUCT_MANAGEMENT' }) },
  { name: formatMessage({ id: 'COMMISSION_RULE_TITLE' }) },
  { name: formatMessage({ id: 'COMMISSION_LOG' }) },
];

const CommissionLog = () => {
  return (
    <Row>
      <MediaQuery minWidth={SCREEN.screenSm}>
        <BreadcrumbCompForPams title={title} />
      </MediaQuery>
      <Col span={24}>
        <Search />
        <LogTable />
      </Col>
    </Row>
  );
};

export default CommissionLog;
