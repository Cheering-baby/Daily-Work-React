import React, { PureComponent } from 'react';
import { Button, Card, Col, Row, Tooltip } from 'antd';
import { connect } from 'dva';
import MediaQuery from 'react-responsive';
import router from 'umi/router';
import { formatMessage } from 'umi/locale';
import BreadcrumbComp from '../../../components/BreadcrumbComp';
import DetailForRegistrationInformation from '../components/DetailForRegistrationInformation';
import styles from './index.less';
import { isNvl } from '@/utils/utils';
import { hasAllPrivilege, MAIN_TA_ADMIN_PRIVILEGE } from '@/utils/PrivilegeUtil';
import SCREEN from '@/utils/screen';

const mapStateToProps = store => {
  const { currentStep } = store.myProfile;
  const {
    organizationRoleList,
    salutationList,
    countryList,
    cityList,
    bilCityList,
    currencyList,
    categoryList,
    customerGroupList,
    marketList,
  } = store.taCommon;
  const {
    otherInfo,
    customerInfo,
    mappingInfo,
    accountInfo,
    taId,
    status,
    remark,
    taInfoLoadingFlag,
    taMappingInfoLoadingFlag,
    taAccountInfoLoadingFlag,
  } = store.taMgr;
  return {
    otherInfo,
    customerInfo,
    mappingInfo,
    accountInfo,
    taId,
    status,
    remark,
    taInfoLoadingFlag,
    taMappingInfoLoadingFlag,
    taAccountInfoLoadingFlag,
    organizationRoleList,
    salutationList,
    countryList,
    cityList,
    bilCityList,
    currencyList,
    categoryList,
    customerGroupList,
    marketList,
    currentStep,
  };
};

@connect(mapStateToProps)
class MyProfile extends PureComponent {
  componentDidMount() {
    const { taInfo = {} } = window.g_app.login_data || {};
    const { dispatch } = this.props;
    dispatch({
      type: 'myProfile/doCleanData',
      payload: { taId: !isNvl(taInfo.companyId) ? taInfo.companyId : null },
    }).then(() => {
      dispatch({ type: 'taCommon/fetchQrySalesPersonList' });
      dispatch({ type: 'taCommon/fetchQueryAgentOpt' }).then(() => {
        if (!isNvl(taInfo.companyId)) {
          dispatch({
            type: 'taMgr/fetchQueryTaInfo',
            payload: { taId: !isNvl(taInfo.companyId) ? taInfo.companyId : null },
          });
          dispatch({
            type: 'taMgr/fetchQueryTaMappingInfo',
            payload: { taId: !isNvl(taInfo.companyId) ? taInfo.companyId : null },
          });
          dispatch({
            type: 'taMgr/fetchQueryTaAccountInfo',
            payload: { taId: !isNvl(taInfo.companyId) ? taInfo.companyId : null },
          });
        }
      });
    });
  }

  goEditRegistration = e => {
    e.preventDefault();
    const { dispatch, taId } = this.props;
    dispatch({
      type: 'myProfile/doCleanData',
      payload: { taId: !isNvl(taId) ? taId : null },
    }).then(() => {
      router.push('/TAManagement/MyProfile/Edit');
    });
  };

  render() {
    const {
      otherInfo = {},
      customerInfo = {},
      mappingInfo = {},
      accountInfo = {},
      organizationRoleList = [],
      salutationList = [],
      countryList = [],
      cityList = [],
      bilCityList = [],
      currencyList = [],
      categoryList = [],
      customerGroupList = [],
      taInfoLoadingFlag,
      taMappingInfoLoadingFlag,
      taAccountInfoLoadingFlag,
    } = this.props;
    const detailProps = {
      otherInfo,
      customerInfo,
      mappingInfo,
      accountInfo,
      organizationRoleList,
      salutationList,
      countryList,
      cityList,
      bilCityList,
      currencyList,
      categoryList,
      customerGroupList,
    };
    const breadcrumbArr = [
      {
        breadcrumbName: formatMessage({ id: 'MENU_TA_MANAGEMENT' }),
        url: '/TAManagement/MyProfile',
      },
      {
        breadcrumbName: formatMessage({ id: 'MENU_TA_PROFILE' }),
        url: null,
      },
    ];
    const isEdit = hasAllPrivilege([MAIN_TA_ADMIN_PRIVILEGE]);
    return (
      <Col span={24}>
        <Row type="flex" justify="space-around">
          <Col span={24} className={styles.pageHeaderTitle}>
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
          </Col>
        </Row>
        <Row type="flex" justify="space-around">
          <Col span={24}>
            <Card
              className={styles.information}
              loading={taInfoLoadingFlag || taMappingInfoLoadingFlag || taAccountInfoLoadingFlag}
            >
              <Row type="flex" justify="space-around">
                <Col span={24} className={styles.detailInformation}>
                  <Card
                    title={formatMessage({ id: 'TA_PROFILE' })}
                    extra={
                      isEdit ? (
                        <Tooltip title={formatMessage({ id: 'TA_EDIT' })}>
                          <Button icon="edit" onClick={e => this.goEditRegistration(e)} />
                        </Tooltip>
                      ) : null
                    }
                  >
                    <DetailForRegistrationInformation {...detailProps} />
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Col>
    );
  }
}

export default MyProfile;
