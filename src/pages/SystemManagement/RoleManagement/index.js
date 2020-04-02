import React from 'react';
import {Breadcrumb, Col} from 'antd';
import {formatMessage} from 'umi/locale';
import {connect} from 'dva';
import MediaQuery from 'react-responsive';
import styles from './index.less';
import RoleSearchForm from './components/RoleSearchForm';
import RoleSearchTable from './components/RoleSearchTable';
import RoleOperDrawer from './components/RoleOperDrawer';
import GrantPrivilegeModal from './components/GrantPrivilegeModal';
import SCREEN from '@/utils/screen';

@connect(({roleMgr}) => ({
  roleMgr,
}))
class RoleManagement extends React.PureComponent {

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
      roleMgr: {drawerShowFlag = false, privilegeModalShowFlag = false},
    } = this.props;

    const breadCrumbBody = (
      <Breadcrumb separator=" > " style={{marginBottom: '10px'}}>
        <Breadcrumb.Item className={styles.breadCrumbStyle}>
          {formatMessage({id: 'SYSTEM_MANAGEMENT'})}
        </Breadcrumb.Item>
        <Breadcrumb.Item className={styles.breadCrumbBold}>
          {formatMessage({id: 'ROLE_MANAGEMENT'})}
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
        <MediaQuery maxWidth={SCREEN.screenXsMax}>
          <div style={{marginTop: '20px', marginBottom: '20px'}}>
            <RoleSearchForm/>
          </div>
        </MediaQuery>
        <MediaQuery minWidth={SCREEN.screenSmMin}>
          <RoleSearchForm/>
        </MediaQuery>
        <RoleSearchTable/>
        {drawerShowFlag ? <RoleOperDrawer/> : null}
        {privilegeModalShowFlag ? <GrantPrivilegeModal/> : null}
      </Col>
    );
  }
}

export default RoleManagement;
