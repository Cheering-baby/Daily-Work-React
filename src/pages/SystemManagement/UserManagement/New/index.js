import React from 'react';
import { Breadcrumb, Card, Col, Form } from 'antd';
// import MediaQuery from 'react-responsive';
import { formatMessage } from 'umi/locale';
// import { SCREEN } from '../../../../utils/screen';
import { connect } from 'dva';
import router from 'umi/router';
import styles from '../index.less';
import UserForm from '../components/UserForm';

@Form.create()
@connect(({ userMgr, loading }) => ({
  userMgr,
  addLoading: loading.effects['userMgr/addTAUser'],
}))
class Index extends React.PureComponent {
  componentDidMount() {
    // TODO get ROLES
    // TODO get companies
    //
  }

  cancel = e => {
    e.preventDefault();
    router.goBack();
  };

  render() {
    return (
      <Col lg={24} md={24}>
        <Breadcrumb separator=" > " style={{ marginBottom: '10px' }}>
          <Breadcrumb.Item className={styles.breadCrumbStyle}>
            {formatMessage({ id: 'SYSTEM_MANAGEMENT' })}
          </Breadcrumb.Item>
          <Breadcrumb.Item
            className={styles.breadCrumbStyle}
            style={{ cursor: 'pointer' }}
            onClick={e => this.cancel(e)}
          >
            {formatMessage({ id: 'USER_MANAGEMENT' })}
          </Breadcrumb.Item>
          <Breadcrumb.Item className={styles.breadCrumbBold}>
            {formatMessage({ id: 'COMMON_NEW' })}
          </Breadcrumb.Item>
        </Breadcrumb>
        <Card className={styles.cardClass}>
          <UserForm type="NEW" />
        </Card>
      </Col>
    );
  }
}

export default Index;
