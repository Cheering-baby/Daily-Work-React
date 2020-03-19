import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Button, Card, Col, Icon, message, Modal, PageHeader, Row, Steps } from 'antd';
import router from 'umi/router';
import MediaQuery from 'react-responsive';
import CustomerInformationToSignUp from './components/CustomerInformationToSignUp';
import OtherInformationToSignUp from './components/OtherInformationToSignUp';
import RegistrationSuccessfullyToSignUp from './components/RegistrationSuccessfullyToSignUp';
import RegistrationInformationToSignUp from './components/RegistrationInformationToSignUp';
import RegistrationFailedToSignUp from './components/RegistrationFailedToSignUp';
import SCREEN from '../../../utils/screen';
import { isNvl } from '@/utils/utils';
import { getBillingInfo } from '@/pages/TAManagement/utils/pubUtils';
import styles from './index.less';

const mapStateToProps = store => {
  const { currentStep, isShowDetail, isBilCheckBox, isAllInformationToRws, viewId } = store.signUp;
  const { countryList = [], categoryList = [] } = store.taCommon;
  const {
    otherInfo,
    customerInfo,
    taId,
    taInfoLoadingFlag,
    status,
    remark,
    isCompanyExist,
  } = store.taMgr;
  return {
    otherInfo,
    customerInfo,
    taId,
    status,
    remark,
    isCompanyExist,
    countryList,
    categoryList,
    taInfoLoadingFlag,
    currentStep,
    isBilCheckBox,
    isShowDetail,
    isAllInformationToRws,
    viewId,
  };
};

@connect(mapStateToProps)
class SignUp extends PureComponent {
  componentDidMount = () => {
    const {
      dispatch,
      location: {
        query: { taId, signature },
      },
      countryList,
      categoryList,
    } = this.props;
    dispatch({
      type: 'signUp/doCleanData',
      payload: {
        taId: !isNvl(taId) ? taId : null,
        signature: !isNvl(signature) ? signature : null,
      },
    }).then(() => {
      if (this.customerRef) {
        const { form } = this.customerRef.props;
        form.resetFields();
      }
      if (this.otherRef) {
        const { form } = this.otherRef.props;
        form.resetFields();
      }
      dispatch({ type: 'global/getLocale' }).then(() =>
        dispatch({ type: 'global/getSupportLanguage' })
      );
      dispatch({ type: 'taCommon/fetchQuerySalutationList' });
      dispatch({ type: 'taCommon/fetchQryMarketList' });
      // dispatch({ type: 'taCommon/fetchQrySalesPersonList' });
      dispatch({ type: 'taCommon/fetchQueryOrganizationRoleList' }).then(organizationRoleInfo => {
        if (isNvl(taId) && organizationRoleInfo) {
          const { customerInfo } = this.props;
          let newCompanyInfo = {};
          if (!isNvl(customerInfo) && !isNvl(customerInfo.companyInfo)) {
            newCompanyInfo = { ...customerInfo.companyInfo };
          }
          newCompanyInfo.organizationRole = `${organizationRoleInfo.dictId}`;
          dispatch({
            type: 'taMgr/save',
            payload: {
              customerInfo: {
                ...customerInfo,
                companyInfo: newCompanyInfo,
              },
            },
          });
        }
      });
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
          type: 'taMgr/fetchQueryTaInfoWithMask',
          payload: { taId, signature },
        });
      }
    });
  };

  getPageHeader = (currentStep, status) => {
    let pageHeaderTitle = formatMessage({ id: 'WELCOME_TO_SIGN_UP' });
    let pageHeaderSubTitle = formatMessage({ id: 'SUB_WELCOME_TO_SIGN_UP' });
    if (!isNvl(status) && String(status) === '05') {
      pageHeaderTitle = formatMessage({ id: 'REGISTRATION_FAILED' });
      pageHeaderSubTitle = formatMessage({ id: 'SUB_REGISTRATION_FAILED' });
    }
    if (!isNvl(status) && String(status) !== '05') {
      // 05：Reject
      pageHeaderTitle = formatMessage({ id: 'STATUS' });
      pageHeaderSubTitle = formatMessage({ id: 'SUB_STATUS' });
    }
    if (isNvl(status) && String(currentStep) === '2') {
      pageHeaderTitle = formatMessage({ id: 'PENDING_APPROVAL' });
      pageHeaderSubTitle = formatMessage({ id: 'SUB_PENDING_APPROVAL' });
    }
    return <PageHeader title={pageHeaderTitle} breadcrumb={null} subTitle={pageHeaderSubTitle} />;
  };

  getPageContent = (
    currentStep,
    status,
    isShowDetail,
    taInfoLoadingFlag,
    isAllInformationToRws,
    isCompanyExist
  ) => {
    if (isShowDetail) {
      return (
        <Card className={styles.information} loading={taInfoLoadingFlag}>
          <Row type="flex" justify="space-around">
            <Col span={24}>
              <RegistrationInformationToSignUp />
            </Col>
          </Row>
        </Card>
      );
    }
    if (!isShowDetail && !isNvl(status) && String(status) === '05') {
      return (
        <Card className={styles.information} loading={taInfoLoadingFlag}>
          <Row type="flex" justify="space-around">
            <Col span={24}>
              <RegistrationFailedToSignUp />
            </Col>
          </Row>
        </Card>
      );
    }
    if (!isNvl(currentStep)) {
      return (
        <Card
          className={styles.information}
          actions={
            String(currentStep) === '0' || String(currentStep) === '1'
              ? [
                <Row type="flex" justify="space-around" className={styles.informationButtonRow}>
                  <Col span={24}>
                    <Button
                      htmlType="button"
                      className={styles.informationButton}
                      loading={taInfoLoadingFlag}
                      onClick={e => this.giveUpRegister(e)}
                    >
                      {formatMessage({ id: 'COMMON_CANCEL' })}
                    </Button>
                    <Button
                      htmlType="button"
                      type="primary"
                      className={styles.informationButton}
                      loading={taInfoLoadingFlag}
                      onClick={this.onHandleSubmit}
                      disabled={
                          (!isAllInformationToRws && String(currentStep) === '1') || isCompanyExist
                        }
                    >
                      {formatMessage({ id: 'COMMON_OK' })}
                    </Button>
                  </Col>
                </Row>,
                ]
              : []
          }
          loading={taInfoLoadingFlag}
        >
          <Row type="flex" justify="space-around" className={styles.stepsInformation}>
            <Col span={24}>
              <MediaQuery
                maxWidth={SCREEN.screenMdMax}
                minWidth={SCREEN.screenSmMin}
                maxHeight={SCREEN.screenXsMax}
              >
                <Steps current={currentStep} size="small" className={styles.stepsInformationSteps}>
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
              </MediaQuery>
              <MediaQuery
                maxWidth={SCREEN.screenMdMax}
                minWidth={SCREEN.screenSmMin}
                minHeight={SCREEN.screenSmMin}
              >
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
              </MediaQuery>
              <MediaQuery minWidth={SCREEN.screenLgMin}>
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
              </MediaQuery>
              <MediaQuery maxWidth={SCREEN.screenXsMax}>
                <Steps current={currentStep} size="small" className={styles.stepsInformationSteps}>
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
              </MediaQuery>
            </Col>
          </Row>
          <Row type="flex" justify="space-around">
            <Col span={24}>
              {String(currentStep) === '0' && (
                <CustomerInformationToSignUp
                  wrappedComponentRef={ref => {
                    this.customerRef = ref;
                  }}
                />
              )}
              {String(currentStep) === '1' && (
                <OtherInformationToSignUp
                  wrappedComponentRef={inst => {
                    this.otherRef = inst;
                  }}
                />
              )}
              {String(currentStep) === '2' && <RegistrationSuccessfullyToSignUp />}
            </Col>
          </Row>
        </Card>
      );
    }
    return null;
  };

  giveUpRegister = e => {
    e.preventDefault();
    Modal.confirm({
      title: formatMessage({ id: 'LEAVE_SIGN_UP_TITLE' }),
      content: formatMessage({ id: 'LEAVE_SIGN_UP_CONTENT' }),
      okText: formatMessage({ id: 'LEAVE_SIGN_UP_YES' }),
      cancelText: formatMessage({ id: 'LEAVE_SIGN_UP_NOT' }),
      icon: <Icon type="info-circle" style={{ backgroundColor: '#faad14' }} />,
      onOk: () => {
        router.push('/userLogin/pamsLogin');
      },
    });
  };

  onHandleSubmit = () => {
    const { dispatch, otherInfo, customerInfo, isBilCheckBox, currentStep, taId } = this.props;
    if (String(currentStep) === '0') {
      const { form } = this.customerRef.props;
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
          type: 'signUp/save',
          payload: { currentStep: 1 },
        });
        if (companyInfo.country) {
          dispatch({
            type: 'taCommon/fetchQueryCityList',
            payload: { countryId: companyInfo.country, isBil: true },
          });
        }
        dispatch({
          type: 'taMgr/save',
          payload: {
            otherInfo: {
              ...otherInfo,
              billingInfo: getBillingInfo(otherInfo, customerInfo, isBilCheckBox) || {},
            },
          },
        });
      });
    } else if (String(currentStep) === '1') {
      const { form } = this.otherRef.props;
      form.validateFieldsAndScroll(error => {
        if (error) {
          return;
        }
        dispatch({
          type: 'taMgr/fetchTARegistration',
          payload: {
            otherInfo,
            customerInfo,
            taId,
          },
        }).then(flag => {
          if (flag)
            dispatch({
              type: 'signUp/save',
              payload: {
                currentStep: 2,
              },
            });
        });
      });
    }
  };

  render() {
    const {
      currentStep = null,
      taInfoLoadingFlag = false,
      status = null,
      isShowDetail = false,
      isAllInformationToRws = false,
      viewId,
    } = this.props;
    return (
      <Col span={24} id={`${viewId}`}>
        <Row type="flex" justify="space-around">
          <Col span={24} className={styles.pageHeaderTitle}>
            {this.getPageHeader(currentStep, status)}
          </Col>
        </Row>
        <Row type="flex" justify="space-around">
          <Col span={24}>
            {this.getPageContent(
              currentStep,
              status,
              isShowDetail,
              taInfoLoadingFlag,
              isAllInformationToRws
            )}
          </Col>
        </Row>
      </Col>
    );
  }
}

export default SignUp;
