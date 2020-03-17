import React, { PureComponent } from 'react';
import { Breadcrumb, Col, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import OrgTree from './components/OrgTree';
import OrgInformation from './components/OrgInformation';
import OrgOperDrawer from './components/OrgOperDrawer';
import styles from './index.less';
import constants from './constants';

@connect(({ orgMgr, global, loading }) => ({
  orgMgr,
  global,
  loadUserInOrg: loading.effects['orgMgr/queryUsersInOrg'],
}))
class OrgManagement extends PureComponent {
  componentDidMount() {
    const {
      dispatch,
      global: { currentUser = {}, userCompanyInfo = {} },
    } = this.props;

    // sale support 进来， 只能看到 顶层 TA， 无法查看 sub TA 和 子机构
    // TA admin 进来，只能看到自己的 机构树 和 sub TA 无法查看 sub TA的子机构
    // sub TA admin 进来，只能看到自己的机构树

    const { userType = '' } = currentUser;
    let payload = {};
    if (userType === '01') {
      payload = {
        orgCode: constants.RWS_ORG_CODE,
      };
    } else {
      const { companyId, companyType } = userCompanyInfo;
      payload = {
        companyId,
        companyType,
      };
    }
    dispatch({
      type: 'orgMgr/queryUserOrgTree',
      payload,
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'orgMgr/clean' });
  }

  render() {
    const {
      orgMgr: { drawerShowFlag = false },
    } = this.props;
    return (
      <Col lg={24} md={24} id="watermark">
        <Breadcrumb separator=" > " style={{ marginBottom: '10px' }}>
          <Breadcrumb.Item className={styles.breadCrumbStyle}>
            {formatMessage({ id: 'SYSTEM_MANAGEMENT' })}
          </Breadcrumb.Item>
          <Breadcrumb.Item className={styles.breadCrumbBold}>
            {formatMessage({ id: 'ORG_MANAGEMENT' })}
          </Breadcrumb.Item>
        </Breadcrumb>
        <Row gutter={16}>
          <Col lg={7} md={24} sm={24} xs={24}>
            <OrgTree />
          </Col>
          <Col lg={17} md={24} sm={24} xs={24}>
            <OrgInformation />
          </Col>
        </Row>
        {drawerShowFlag ? <OrgOperDrawer /> : null}
      </Col>
    );
  }
}

export default OrgManagement;
