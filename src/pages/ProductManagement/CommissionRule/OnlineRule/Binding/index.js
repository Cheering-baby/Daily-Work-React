import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Form, Card } from 'antd';
import SCREEN from '@/utils/screen';
import styles from './index.less';
import BreadcrumbComp from '@/components/BreadcrumbComp';
import NewBinding from '../components/NewBinding';

@Form.create()
@connect(({ binding }) => ({
  binding,
}))
class binding extends Component {
  render() {
    const breadcrumbArr = [
      {
        breadcrumbName: formatMessage({ id: 'PRODUCT_MANAGEMENT' }),
        url: null,
      },
      {
        breadcrumbName: formatMessage({ id: 'COMMISSION_RULE_TITLE' }),
        url: null,
      },
      {
        breadcrumbName: formatMessage({ id: 'TIERED_ATTENDANCE_RULE' }),
        url: '/ProductManagement/CommissionRule/OnlineRule',
      },
      {
        breadcrumbName: formatMessage({ id: 'NEW_BINDING' }),
        url: null,
      },
    ];

    return (
      <div>
        <MediaQuery
          maxWidth={SCREEN.screenMdMax}
          minWidth={SCREEN.screenSmMin}
          minHeight={SCREEN.screenSmMin}
        >
          <BreadcrumbComp breadcrumbArr={breadcrumbArr} />
        </MediaQuery>
        <MediaQuery minWidth={SCREEN.screenLgMin}>
          <BreadcrumbComp breadcrumbArr={breadcrumbArr} />
        </MediaQuery>
        <Card className={styles.cardClass}>
          <NewBinding type="BINDING" />
        </Card>
      </div>
    );
  }
}

export default binding;
