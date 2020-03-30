/* eslint-disable */
import React from 'react';
import { Breadcrumb, Col } from 'antd';
// import MediaQuery from 'react-responsive';
import { formatMessage } from 'umi/locale';
// import { SCREEN } from '../../../../utils/screen';
import styles from './index.less';
import { connect } from 'dva';
import RoleSearchForm from './components/RoleSearchForm';
import RoleSearchTable from './components/RoleSearchTable';
import RoleOperDrawer from './components/RoleOperDrawer';
import GrantPrivilegeModal from './components/GrantPrivilegeModal';

@connect(({ roleMgr }) => ({
  roleMgr,
}))
class RoleManagement extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'roleMgr/queryUserRolesByCondition',
    });
    dispatch({
      type: 'roleMgr/queryMenuTree',
    });
  }

  render() {
    const {
      roleMgr: { drawerShowFlag = false, privilegeModalShowFlag = false },
    } = this.props;
    return (
      <Col lg={24} md={24}>
        <Breadcrumb separator=" > " style={{ marginBottom: '10px' }}>
          <Breadcrumb.Item className={styles.breadCrumbStyle}>
            {formatMessage({ id: 'SYSTEM_MANAGEMENT' })}
          </Breadcrumb.Item>
          <Breadcrumb.Item className={styles.breadCrumbBold}>
            {formatMessage({ id: 'ROLE_MANAGEMENT' })}
          </Breadcrumb.Item>
        </Breadcrumb>
        <RoleSearchForm />
        <RoleSearchTable />
        {drawerShowFlag ? <RoleOperDrawer /> : null}
        {privilegeModalShowFlag ? <GrantPrivilegeModal /> : null}
      </Col>
    );
  }
}

export default RoleManagement;
