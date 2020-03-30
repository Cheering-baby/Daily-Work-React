import React, { PureComponent } from 'react';
import { Button, Card, Col, Icon, message, Modal, Row, Steps } from 'antd';
import { connect } from 'dva';
import MediaQuery from 'react-responsive';
import router from 'umi/router';
import { formatMessage } from 'umi/locale';
import BreadcrumbComp from '../../../../components/BreadcrumbComp';
import CustomerInformationToEdit from '../components/CustomerInformationToEdit';
import OtherInformationToEdit from '../components/OtherInformationToEdit';
import EditSuccessfullyToEdit from '../components/EditSuccessfullyToEdit';
import styles from './index.less';
import SCREEN from '@/utils/screen';
import { getModifyTYpe } from '../../utils/pubUtils';
import { isNvl } from '@/utils/utils';
import {
  hasAllPrivilege,
  MAIN_TA_ADMIN_PRIVILEGE,
  SALES_SUPPORT_PRIVILEGE,
} from '@/utils/PrivilegeUtil';

const mapStateToProps = store => {
  const { currentStep, isAllInformationToRws, viewId } = store.myProfile;
  const { countryList, categoryList } = store.taCommon;
  const {
    otherInfo,
    customerInfo,
    mappingInfo,
    accountInfo,
    taId,
    taInfoLoadingFlag,
    taMappingInfoLoadingFlag,
    taAccountInfoLoadingFlag,
    isCompanyExist,
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
    isCompanyExist,
    countryList,
    categoryList,
    currentStep,
    isAllInformationToRws,
    viewId,
  };
};

@connect(mapStateToProps)
class Edit extends PureComponent {
  componentDidMount() {
    const { dispatch, taId = '111111' } = this.props;
    dispatch({
      type: 'myProfile/doCleanData',
      payload: { taId: !isNvl(taId) ? taId : null },
    }).then(() => {
      dispatch({ type: 'taCommon/fetchQueryAgentOpt' });
      dispatch({ type: 'taCommon/fetchQrySalesPersonList' });
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

  giveUpEdit = e => {
    e.preventDefault();
    Modal.confirm({
      title: formatMessage({ id: 'LEAVE_PROFILE_EDIT_TITLE' }),
      content: formatMessage({ id: 'LEAVE_PROFILE_EDIT_CONTENT' }),
      okText: formatMessage({ id: 'COMMON_YES' }),
      cancelText: formatMessage({ id: 'COMMON_NO' }),
      icon: <Icon type="info-circle" style={{ backgroundColor: '#faad14' }} />,
      onOk: () => {
        router.push('/TAManagement/MyProfile');
      },
    });
  };

  onHandleSubmit = () => {
    const { dispatch, otherInfo, customerInfo, mappingInfo, currentStep, taId } = this.props;
    if (String(currentStep) === '0') {
      const { form } = this.customerEditRef.props;
      form.validateFieldsAndScroll(error => {
        if (error) {
          return;
        }
        const { companyInfo = {} } = customerInfo || {};
        const { productList = [] } = companyInfo || {};
        if (!productList || productList.length <= 0) {
          message.warn(formatMessage({ id: 'QUESTIONS_Q_CHECK_MSG' }), 10);
          return;
        }
        dispatch({
          type: 'myProfile/save',
          payload: { currentStep: 1 },
        });
        if (companyInfo.country) {
          dispatch({
            type: 'taCommon/fetchQueryCityList',
            payload: { countryId: companyInfo.country, isBil: true },
          });
        }
      });
    } else if (String(currentStep) === '1') {
      const { form } = this.otherEditRef.props;
      form.validateFieldsAndScroll(error => {
        if (error) {
          return;
        }
        dispatch({
          type: 'taMgr/fetchModifyTaInfo',
          payload: {
            otherInfo,
            customerInfo,
            mappingInfo,
            taId,
            modifyType: getModifyTYpe(),
          },
        }).then(flag => {
          if (flag) message.success(formatMessage({ id: 'COMPLETED_EDIT_SUBMITTED_SUCCESS' }), 10);
          dispatch({
            type: 'myProfile/save',
            payload: {
              currentStep: 2,
            },
          });
        });
      });
    }
  };

  getEditForm = currentStep => {
    const isMainTaRoleFlag = hasAllPrivilege([MAIN_TA_ADMIN_PRIVILEGE]);
    const isSaleSupportRoleFlag = hasAllPrivilege([SALES_SUPPORT_PRIVILEGE]);
    if (isMainTaRoleFlag || isSaleSupportRoleFlag) {
      return (
        <React.Fragment>
          <Row type="flex" justify="space-around" className={styles.stepsInformation}>
            <Col span={24}>
              <Steps current={currentStep} className={styles.stepsInformationSteps}>
                <Steps.Step
                  key={formatMessage({ id: 'CUSTOMER_INFORMATION' })}
                  title={formatMessage({ id: 'CUSTOMER_INFORMATION' })}
                />
                <Steps.Step
                  key={formatMessage({ id: 'OTHER_INFORMATION' })}
                  title={formatMessage({ id: 'OTHER_INFORMATION' })}
                />
                <Steps.Step
                  key={formatMessage({ id: 'COMPLETED' })}
                  title={formatMessage({ id: 'COMPLETED' })}
                />
              </Steps>
            </Col>
          </Row>
          <Row type="flex" justify="space-around">
            <Col span={24}>
              {String(currentStep) === '0' && (
                <CustomerInformationToEdit
                  wrappedComponentRef={ref => {
                    this.customerEditRef = ref;
                  }}
                />
              )}
              {String(currentStep) === '1' && (
                <OtherInformationToEdit
                  wrappedComponentRef={inst => {
                    this.otherEditRef = inst;
                  }}
                />
              )}
              {String(currentStep) === '2' && <EditSuccessfullyToEdit />}
            </Col>
          </Row>
        </React.Fragment>
      );
    }
    return null;
  };

  render() {
    const {
      currentStep,
      taInfoLoadingFlag,
      taMappingInfoLoadingFlag,
      taAccountInfoLoadingFlag,
      isAllInformationToRws,
      viewId,
      isCompanyExist,
    } = this.props;
    const breadcrumbArr = [
      {
        breadcrumbName: formatMessage({ id: 'MENU_TA_MANAGEMENT' }),
        url: '/TAManagement/MyProfile',
      },
      {
        breadcrumbName: formatMessage({ id: 'MENU_TA_PROFILE' }),
        url: '/TAManagement/MyProfile',
      },
      {
        breadcrumbName: formatMessage({ id: 'MENU_EDIT' }),
        url: null,
      },
    ];
    return (
      <Col span={24} id={`${viewId}`}>
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
              className={styles.editInformation}
              actions={
                String(currentStep) === '0' || String(currentStep) === '1'
                  ? [
                    <Row
                      type="flex"
                      justify="space-around"
                      className={styles.editInformationButtonRow}
                    >
                      <Col span={24}>
                        <Button
                          htmlType="button"
                          className={styles.editInformationButton}
                          loading={
                              taInfoLoadingFlag ||
                              taMappingInfoLoadingFlag ||
                              taAccountInfoLoadingFlag
                            }
                          onClick={e => this.giveUpEdit(e)}
                        >
                          {formatMessage({ id: 'COMMON_CANCEL' })}
                        </Button>
                        <Button
                          htmlType="button"
                          type="primary"
                          className={styles.editInformationButton}
                          onClick={this.onHandleSubmit}
                          loading={
                              taInfoLoadingFlag ||
                              taMappingInfoLoadingFlag ||
                              taAccountInfoLoadingFlag
                            }
                          disabled={
                              (!isAllInformationToRws && String(currentStep) === '1') ||
                              isCompanyExist
                            }
                        >
                          {formatMessage({ id: 'COMMON_OK' })}
                        </Button>
                      </Col>
                    </Row>,
                    ]
                  : []
              }
              loading={taInfoLoadingFlag || taMappingInfoLoadingFlag || taAccountInfoLoadingFlag}
            >
              {this.getEditForm(currentStep)}
            </Card>
          </Col>
        </Row>
      </Col>
    );
  }
}

export default Edit;
