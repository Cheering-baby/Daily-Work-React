import React, { PureComponent } from 'react';
import { Button, Card, Col, Row, Tooltip } from 'antd';
import { connect } from 'dva';
import MediaQuery from 'react-responsive';
import { formatMessage } from 'umi/locale';
import BreadcrumbComp from '../../../components/BreadcrumbComp';
import RegistrationInformationToSubTa from '../components/RegistrationInformationToSubTa';
import RegistrationInformationToSubTaEdit from './components/RegistrationInformationToSubTaEdit';
import styles from './index.less';
import { isNvl } from '@/utils/utils';
import SCREEN from '@/utils/screen';
import { hasAllPrivilege, SUB_TA_ADMIN_PRIVILEGE } from '@/utils/PrivilegeUtil';

const mapStateToProps = store => {
  const { subTaId, subTaInfo, subTaInfoLoadingFlag, countryList } = store.subTaMgr;
  return {
    subTaId,
    subTaInfo,
    subTaInfoLoadingFlag,
    countryList,
  };
};

@connect(mapStateToProps)
class SubTAProfile extends PureComponent {
  componentDidMount() {
    const { taInfo = {} } = window.g_app.login_data || {};
    const { dispatch } = this.props;
    dispatch({
      type: 'subTaProfile/doCleanData',
      payload: {
        subTaId: !isNvl(taInfo.companyId) ? taInfo.companyId : null,
      },
    }).then(() => {
      dispatch({ type: 'subTaMgr/fetchQueryCountryList' });
      if (!isNvl(taInfo.companyId)) {
        dispatch({
          type: 'subTaMgr/fetchQrySubTaInfo',
          payload: { subTaId: !isNvl(taInfo.companyId) ? taInfo.companyId : null },
        });
      }
    });
  }

  goEditRegistration = e => {
    e.preventDefault();
    const { dispatch, subTaId } = this.props;
    dispatch({
      type: 'subTaProfile/doCleanData',
      payload: {
        subTaId: !isNvl(subTaId) ? subTaId : null,
      },
    }).then(() => {
      dispatch({ type: 'subTaMgr/fetchQueryCountryList' });
      if (!isNvl(subTaId)) {
        dispatch({
          type: 'subTaMgr/fetchQrySubTaInfo',
          payload: { subTaId },
        });
      }
      dispatch({
        type: 'subTaProfile/save',
        payload: {
          editVisible: true,
        },
      });
    });
  };

  render() {
    const { subTaInfo = {}, countryList = [], subTaInfoLoadingFlag } = this.props;
    const breadcrumbArr = [
      {
        breadcrumbName: formatMessage({ id: 'MENU_SUB_TA_MANAGEMENT' }),
        url: '/SubTAManagement/SubTAProfile',
      },
      {
        breadcrumbName: formatMessage({ id: 'MENU_SUB_TA_PROFILE' }),
        url: null,
      },
    ];
    const isAdminRoleSubFlag = hasAllPrivilege([SUB_TA_ADMIN_PRIVILEGE]);
    const isEdit = isAdminRoleSubFlag;
    const isProfile = true;
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
            <Card className={styles.profileInformation} loading={subTaInfoLoadingFlag}>
              <Row type="flex" justify="space-around">
                <Col span={24} className={styles.detailInformation}>
                  <Card
                    title={formatMessage({ id: 'SUB_TA_ACCOUNT_INFORMATION' })}
                    extra={
                      isEdit ? (
                        <Tooltip title={formatMessage({ id: 'COMMON_EDIT' })}>
                          <Button icon="edit" onClick={e => this.goEditRegistration(e)} />
                        </Tooltip>
                      ) : null
                    }
                  >
                    <RegistrationInformationToSubTa
                      subTaInfo={subTaInfo}
                      countryList={countryList}
                      isProfile={isProfile}
                    />
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={24}>
            <RegistrationInformationToSubTaEdit />
          </Col>
        </Row>
      </Col>
    );
  }
}

export default SubTAProfile;
