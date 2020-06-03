import React from 'react';
import { Breadcrumb, Card, Col, Form } from 'antd';
// import MediaQuery from 'react-responsive';
import { formatMessage } from 'umi/locale';
// import { SCREEN } from '../../../../utils/screen';
import { connect } from 'dva';
import router from 'umi/router';
import MediaQuery from 'react-responsive';
import styles from '../index.less';
import UserForm from '../components/UserForm';
import constants from '@/pages/SystemManagement/UserManagement/constants';
import SCREEN from '@/utils/screen';
import PrivilegeUtil from '@/utils/PrivilegeUtil';

@Form.create()
@connect(({ userMgr }) => ({
  userMgr,
}))
class UserCode extends React.PureComponent {
  componentDidMount() {
    const { dispatch, match, userMgr } = this.props;
    const { userCode } = match.params;
    const { currentUserProfile = {} } = userMgr;
    if (Object.keys(currentUserProfile).length === 0) {
      // get detail
      dispatch({
        type: 'userMgr/queryUserDetail',
        payload: {
          userCode,
        },
      });

      if (PrivilegeUtil.hasAnyPrivilege([PrivilegeUtil.PAMS_ADMIN_PRIVILEGE])) {
        dispatch({
          type: 'userMgr/querySubTAList',
        });
      }
    } else {
      const { userType = '', taInfo = {} } = currentUserProfile;
      dispatch({
        type: 'userMgr/queryUserRoles',
        payload: {
          roleType: userType,
        },
      });
      if (userType === constants.TA_USER_TYPE) {
        const { companyId } = taInfo;
        dispatch({
          type: 'userMgr/getTACompanyDetail',
          payload: {
            companyId,
          },
        });
      }
    }
  }

  cancel = e => {
    e.preventDefault();
    router.goBack();
  };

  render() {
    const breadCrumbBody = (
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
          {formatMessage({ id: 'COMMON_EDIT' })}
        </Breadcrumb.Item>
      </Breadcrumb>
    );
    return (
      <Col lg={24} md={24}>
        <MediaQuery
          maxWidth={SCREEN.screenMdMax}
          minWidth={SCREEN.screenSmMin}
          minHeight={SCREEN.screenSmMin}
        >
          {breadCrumbBody}
        </MediaQuery>
        <MediaQuery minWidth={SCREEN.screenLgMin}>{breadCrumbBody}</MediaQuery>
        <Card className={styles.cardClass}>
          <UserForm type="EDIT" />
        </Card>
      </Col>
    );
  }
}

export default UserCode;
