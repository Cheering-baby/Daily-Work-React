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
@connect(({ userManagement, loading }) => ({
  userManagement,
  addLoading: loading.effects['userManagement/addTAUser'],
}))
class UserCode extends React.PureComponent {
  componentDidMount() {
    const { dispatch, match, userManagement } = this.props;
    const { userCode } = match.params;
    const { currentUserProfile = {} } = userManagement;
    if (Object.keys(currentUserProfile).length === 0) {
      // get detail
      dispatch({
        type: 'userManagement/queryUserDetail',
        payload: {
          userCode,
        },
      });
    }
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
            {formatMessage({ id: 'COMMON_DETAIL' })}
          </Breadcrumb.Item>
        </Breadcrumb>
        <Card className={styles.cardClass}>
          <UserForm type="DETAIL" />
        </Card>
      </Col>
    );
  }
}

export default UserCode;
