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
import { isAccountingArRole } from '../../utils/pubUtils';

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
  const { pagePrivileges = [] } = store.global;
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
    pagePrivileges,
  };
};

@connect(mapStateToProps)
class DetailToTA extends PureComponent {
  componentDidMount() {
    const {
      dispatch,
      countryList,
      categoryList,
      location: {
        query: { taId = '111111' },
      },
    } = this.props;
    dispatch({
      type: 'mainTAManagement/doCleanCommonData',
      payload: { taId: !isNvl(taId) ? taId : null },
    }).then(() => {
      dispatch({ type: 'taCommon/fetchQuerySalutationList' });
      dispatch({ type: 'taCommon/fetchQueryOrganizationRoleList' });
      dispatch({ type: 'taCommon/fetchQryArAccountEndConfig' });
      dispatch({ type: 'taCommon/fetchQryMarketList' });
      dispatch({ type: 'taCommon/fetchQrySalesPersonList' });
      dispatch({ type: 'taCommon/fetchQueryCategoryList' }).then(flag => {
        if (flag && isNvl(taId) && categoryList && categoryList.length > 0) {
          const categoryInfo = categoryList[0];
          dispatch({
            type: 'taCommon/fetchQueryCustomerGroupList',
            payload: { categoryId: categoryInfo.dictId },
          });
        }
      });
      dispatch({ type: 'taCommon/fetchQueryCountryList' }).then(flag => {
        if (flag && isNvl(taId) && countryList && countryList.length > 0) {
          const countryInfo = countryList[0];
          dispatch({
            type: 'taCommon/fetchQueryCityList',
            payload: { countryId: countryInfo.dictId },
          });
          dispatch({
            type: 'taCommon/fetchQueryCityList',
            payload: { countryId: countryInfo.dictId, isBil: true },
          });
        }
      });
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
  }

  getStatusMsg = status => {
    let statusStr = 'default';
    let statusTxt = '';
    switch (status) {
      case '04':
        statusStr = 'error';
        statusTxt = formatMessage({ id: 'TA_STATUS_FAIL' });
        break;
      case '03':
        statusStr = 'processing';
        statusTxt = formatMessage({ id: 'TA_STATUS_SUCCESS' });
        break;
      case '02':
        statusStr = 'warning';
        statusTxt = formatMessage({ id: 'TA_STATUS_PENDING_OPERATION' });
        break;
      case '01':
        statusStr = 'success';
        statusTxt = formatMessage({ id: 'TA_STATUS_ACTIVE' });
        break;
      default:
        statusStr = 'default';
        statusTxt = formatMessage({ id: 'TA_STATUS_PENDING_OPERATION' });
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
      taInfoLoadingFlag,
      taMappingInfoLoadingFlag,
      taAccountInfoLoadingFlag,
      pagePrivileges,
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
      pagePrivileges,
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
    const isAccountingArRoleFlag = isAccountingArRole(pagePrivileges);
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
                      extra={this.getStatusMsg(mappingInfo.status)}
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
