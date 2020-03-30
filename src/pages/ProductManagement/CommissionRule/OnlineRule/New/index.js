import React from 'react';
import MediaQuery from 'react-responsive';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Form, Card } from 'antd';
import SCREEN from '@/utils/screen';
import styles from './index.less';
import BreadcrumbComp from '@/components/BreadcrumbComp';
import NewCommission from '../components/NewCommission';
import NewBinding from '../components/NewBinding';

@Form.create()
@connect(({ commissionNew }) => ({
  commissionNew,
}))
class onlineNew extends React.PureComponent {
  render() {
    const {
      location: {
        query: { type, tplId },
      },
    } = this.props;

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
        breadcrumbName:
          type && type === 'edit'
            ? formatMessage({ id: 'COMMON_MODIFY' })
            : formatMessage({ id: 'COMMON_NEW' }),
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
          <NewCommission tplId={tplId} type={type} />
          <NewBinding tplId={tplId} type={type} />
        </Card>
      </div>
    );
  }
}

export default onlineNew;
