import React from 'react';
import { Breadcrumb, Col } from 'antd';
// import MediaQuery from 'react-responsive';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
// import { SCREEN } from '../../../../utils/screen';
import UserSearchForm from './components/UserSearchForm';
import UserSearchTable from './components/UserSearchTable';
import styles from './index.less';

// RWS 用户进来 只能查看 rws用户 和 TA公司的主用户
// TA 用户进来，只能看到该公司的用户 和 SUB TA 公司的主用户
// SUB TA 用户进来， 只能看到该公司的用户

@connect(({ userMgr, loading }) => ({
  userMgr,
  loading: loading.effects['userMgr/queryUsersByCondition'],
}))
class Index extends React.PureComponent {
  render() {
    return (
      <Col lg={24} md={24}>
        <Breadcrumb separator=" > " style={{ marginBottom: '10px' }}>
          <Breadcrumb.Item className={styles.breadCrumbStyle}>
            {formatMessage({ id: 'SYSTEM_MANAGEMENT' })}
          </Breadcrumb.Item>
          <Breadcrumb.Item className={styles.breadCrumbBold}>
            {formatMessage({ id: 'USER_MANAGEMENT' })}
          </Breadcrumb.Item>
        </Breadcrumb>
        <UserSearchForm />
        <UserSearchTable />
      </Col>
    );
  }
}

export default Index;
