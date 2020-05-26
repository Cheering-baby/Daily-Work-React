import React, { PureComponent } from 'react';
import { Badge, Card, Col, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import MediaQuery from 'react-responsive';
import BreadcrumbComp from '@/components/BreadcrumbComp';
import DetailForAccountingInformation from '../../components/DetailForAccountingInformation';
import DetailForRegistrationInformation from '../../components/DetailForRegistrationInformation';
import DetailForAdditionalInformation from '../../components/DetailForAdditionalInformation';
import styles from './index.less';
import SCREEN from '@/utils/screen';
import { isNvl } from '@/utils/utils';
import { AR_ACCOUNT_PRIVILEGE, hasAllPrivilege } from '@/utils/PrivilegeUtil';

const mapStateToProps = store => {
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
    salesPersonList,
    settlementCycleList,
    createTeamList,
  } = store.taCommon;
  const {
    otherInfo,
    customerInfo,
    mappingInfo,
    accountInfo,
    taId,
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
    salesPersonList,
    settlementCycleList,
    createTeamList,
  };
};

@connect(mapStateToProps)
class DetailToTA extends PureComponent {
  componentDidMount() {
    const {
      dispatch,
      location: {
        query: { taId },
      },
    } = this.props;
    dispatch({
      type: 'mainTAManagement/doCleanCommonData',
      payload: { taId: !isNvl(taId) ? taId : null },
    }).then(() => {
      dispatch({ type: 'taCommon/fetchQrySalesPersonList' });
      dispatch({ type: 'taCommon/fetchQueryCreateTeam' });
      dispatch({ type: 'taCommon/fetchQueryAgentOpt' }).then(() => {
        if (!isNvl(taId)) {
          dispatch({
            type: 'taMgr/fetchQueryTaInfo',
            payload: { taId },
          });
          dispatch({
            type: 'taMgr/fetchQueryTaMappingInfo',
            payload: { taId },
          });
          dispatch({
            type: 'taMgr/fetchQueryTaAccountInfo',
            payload: { taId },
          });
        }
      });
    });
  }

  getStatusMsg = customerInfo => {
    const { companyInfo = {} } = customerInfo || {};
    let statusStr = 'default';
    let statusTxt = '';
    switch (String(companyInfo.statusName).toLowerCase()) {
      case 'active':
        statusStr = 'success';
        statusTxt = formatMessage({ id: 'TA_STATUS_ACTIVE' });
        break;
      case 'inactive':
        statusStr = 'default';
        statusTxt = formatMessage({ id: 'TA_STATUS_INACTIVE' });
        break;
      default:
        statusStr = 'default';
        statusTxt = formatMessage({ id: 'TA_STATUS_INACTIVE' });
        break;
    }
    return <Badge status={statusStr} text={statusTxt || null} />;
  };

  render() {
    const {
      taId,
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
      marketList = [],
      salesPersonList = [],
      settlementCycleList = [],
      createTeamList = [],
      taInfoLoadingFlag,
      taMappingInfoLoadingFlag,
      taAccountInfoLoadingFlag,
    } = this.props;
    const detailProps = {
      taId,
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
      marketList,
      salesPersonList,
      settlementCycleList,
      createTeamList,
    };
    const breadcrumbArr = [
      {
        breadcrumbName: formatMessage({ id: 'MENU_TA_MANAGEMENT' }),
        url: '/TAManagement/MainTAManagement',
      },
      {
        breadcrumbName: formatMessage({ id: 'MENU_TA_MAIN_MANAGEMENT' }),
        url: '/TAManagement/MainTAManagement',
      },
      {
        breadcrumbName: formatMessage({ id: 'MENU_DETAIL' }),
        url: null,
      },
    ];
    const isAccountingArRoleFlag = hasAllPrivilege([AR_ACCOUNT_PRIVILEGE]);
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
              {isAccountingArRoleFlag && (
                <Row type="flex" justify="space-around">
                  <Col span={24}>
                    <Card
                      title={formatMessage({ id: 'ACCOUNTING_INFORMATION' })}
                      extra={this.getStatusMsg(customerInfo)}
                    >
                      <DetailForAccountingInformation {...detailProps} />
                    </Card>
                  </Col>
                </Row>
              )}
              <Row type="flex" justify="space-around">
                <Col span={24} className={styles.addDetailInformation}>
                  <Card title={formatMessage({ id: 'ADDITIONAL_INFORMATION' })}>
                    <DetailForAdditionalInformation {...detailProps} />
                  </Card>
                </Col>
              </Row>
              <Row type="flex" justify="space-around">
                <Col span={24} className={styles.detailInformation}>
                  <Card title={formatMessage({ id: 'TA_D_PROFILE' })}>
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

export default DetailToTA;
