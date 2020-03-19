import React, { PureComponent } from 'react';
import { Badge, Button, Card, Col, Icon, Modal, PageHeader, Row } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import { formatMessage } from 'umi/locale';
import RegistrationInformationToSubTa from '../components/RegistrationInformationToSubTa';
import RegistrationSuccessToSubTa from '../components/RegistrationSuccessToSubTa';
import AccountInformationToSubTa from '../components/AccountInformationToSubTa';
import styles from './index.less';
import { isNvl } from '@/utils/utils';
import { getFormKeyValue, getFormLayout } from '../utils/pubUtils';

const mapStateToProps = store => {
  const {
    subTaId,
    subTaInfo,
    subTaInfoLoadingFlag,
    countryList,
    hasSubTaWithEmail,
  } = store.subTaMgr;
  const { currentStep, isShowDetail } = store.subTaSignUp;
  return {
    subTaId,
    subTaInfo,
    subTaInfoLoadingFlag,
    countryList,
    currentStep,
    isShowDetail,
    hasSubTaWithEmail,
  };
};

@connect(mapStateToProps)
class SignUp extends PureComponent {
  componentDidMount = () => {
    const {
      dispatch,
      location: {
        query: { taId, companyName },
      },
    } = this.props;
    dispatch({
      type: 'subTaSignUp/doCleanData',
      payload: {
        subTaInfo: {
          taId: !isNvl(taId) ? taId : null,
          mainCompanyName: !isNvl(companyName) ? companyName : null,
        },
      },
    }).then(() => {
      dispatch({ type: 'global/getLocale' }).then(() =>
        dispatch({ type: 'global/getSupportLanguage' })
      );
      dispatch({ type: 'subTaMgr/fetchQueryCountryList' });
    });
  };

  getPageHeader = (currentStep, statusName) => {
    let pageHeaderTitle = formatMessage({ id: 'SUB_TA_WELCOME_TO_SIGN_UP' });
    let pageHeaderSubTitle = formatMessage({ id: 'SUB_TA_SUB_WELCOME_TO_SIGN_UP' });
    if (!isNvl(statusName)) {
      pageHeaderTitle = formatMessage({ id: 'SUB_TA_STATE' });
      pageHeaderSubTitle = formatMessage({ id: 'SUB_TA_STATE_SUB' });
    }
    if (isNvl(statusName) && String(currentStep) === '2') {
      pageHeaderTitle = formatMessage({ id: 'SUB_TA_PENDING_APPROVAL' });
      pageHeaderSubTitle = formatMessage({ id: 'SUB_TA_SUB_PENDING_APPROVAL' });
    }
    return <PageHeader title={pageHeaderTitle} breadcrumb={null} subTitle={pageHeaderSubTitle} />;
  };

  showViewInformation = e => {
    e.preventDefault();
    const { dispatch, subTaInfo } = this.props;
    dispatch({
      type: 'subTaSignUp/doCleanData',
      payload: {
        subTaInfo: {
          taId: !isNvl(subTaInfo.taId) ? subTaInfo.taId : null,
          mainCompanyName: !isNvl(subTaInfo.mainCompanyName) ? subTaInfo.mainCompanyName : null,
        },
        isShowDetail: true,
      },
    }).then(() => {
      dispatch({ type: 'subTaMgr/fetchQueryCountryList' });
      dispatch({ type: 'subTaMgr/fetchQrySubTaInfoWithNoId' });
    });
  };

  giveUpRegister = e => {
    e.preventDefault();
    Modal.confirm({
      title: formatMessage({ id: 'SUB_TA_LEAVE_SIGN_UP_TITLE' }),
      content: formatMessage({ id: 'SUB_TA_LEAVE_SIGN_UP_CONTENT' }),
      okText: formatMessage({ id: 'SUB_TA_LEAVE_SIGN_UP_YES' }),
      cancelText: formatMessage({ id: 'SUB_TA_LEAVE_SIGN_UP_NOT' }),
      icon: <Icon type="info-circle" style={{ backgroundColor: '#faad14' }} />,
      onOk: () => {
        router.push('/userLogin/pamsLogin');
      },
    });
  };

  onHandleSubmit = () => {
    const { dispatch, subTaInfo } = this.props;
    const { form } = this.accountRef.props;
    form.validateFieldsAndScroll(error => {
      if (error) {
        return;
      }
      dispatch({
        type: 'subTaMgr/fetchSubTARegistration',
        payload: {
          ...subTaInfo,
        },
      }).then(flag => {
        if (flag)
          dispatch({
            type: 'subTaSignUp/save',
            payload: { currentStep: '2' },
          });
      });
    });
  };

  onHandleChange = (key, keyValue, fieldKey) => {
    const { dispatch, subTaInfo } = this.props;
    const { form } = this.accountRef.props;
    let newSubTaInfo = {};
    if (!isNvl(subTaInfo)) {
      newSubTaInfo = { ...subTaInfo };
    }
    const noVal = getFormKeyValue(keyValue);
    if (String(key).toLowerCase() === 'email') {
      dispatch({
        type: 'subTaMgr/fetchQrySubTaInfoWithEmail',
        payload: {
          email: keyValue,
        },
      });
    }
    form.setFieldsValue(JSON.parse(`{"${fieldKey}":"${noVal}"}`));
    const source = JSON.parse(`{"${key}":"${noVal}"}`);
    Object.assign(newSubTaInfo, source);
    dispatch({
      type: 'subTaMgr/save',
      payload: {
        subTaInfo: {
          ...newSubTaInfo,
        },
      },
    });
  };

  getStatusMsg = statusName => {
    let statusStr = 'default';
    let statusTxt = '';
    switch (String(statusName).toLowerCase()) {
      case 'processing':
        statusStr = 'processing';
        statusTxt = formatMessage({ id: 'SUB_TA_STATUS_PENDING' });
        break;
      case 'reject':
        statusStr = 'error';
        statusTxt = formatMessage({ id: 'SUB_TA_STATUS_REJECT' });
        break;
      case 'success':
        statusStr = 'success';
        statusTxt = formatMessage({ id: 'SUB_TA_STATUS_COMPLETE' });
        break;
      default:
        statusStr = 'default';
        statusTxt = formatMessage({ id: 'SUB_TA_STATUS_DEFAULT' });
        break;
    }
    return <Badge status={statusStr} text={statusTxt || null} />;
  };

  getPageContent = () => {
    const {
      currentStep = '0',
      isShowDetail = false,
      subTaInfo = {},
      subTaInfoLoadingFlag = false,
      countryList = [],
      hasSubTaWithEmail = false,
    } = this.props;
    if (isShowDetail) {
      return (
        <Card className={styles.subTaInformation} loading={subTaInfoLoadingFlag}>
          <Row type="flex" justify="space-around">
            <Col span={24} className={styles.detailInformation}>
              <Card
                title={formatMessage({ id: 'SUB_TA_ACCOUNT_INFORMATION' })}
                extra={this.getStatusMsg(subTaInfo.statusName)}
              >
                <RegistrationInformationToSubTa
                  subTaInfo={subTaInfo || {}}
                  countryList={countryList || []}
                  successText={formatMessage({ id: 'SUB_TA_REGISTRATION_SUBMITTED_SUCCESS' })}
                />
              </Card>
            </Col>
          </Row>
        </Card>
      );
    }
    return (
      <Card
        className={styles.subTaInformation}
        actions={
          String(currentStep) === '0'
            ? [
              <Row
                type="flex"
                justify="space-around"
                className={styles.subTaInformationButtonRow}
              >
                <Col span={24}>
                  <Button
                    htmlType="button"
                    className={styles.subTaInformationButton}
                    loading={subTaInfoLoadingFlag}
                    onClick={e => this.giveUpRegister(e)}
                  >
                    {formatMessage({ id: 'COMMON_CANCEL' })}
                  </Button>
                  <Button
                    htmlType="button"
                    type="primary"
                    className={styles.subTaInformationButton}
                    loading={subTaInfoLoadingFlag}
                    onClick={this.onHandleSubmit}
                  >
                    {formatMessage({ id: 'COMMON_OK' })}
                  </Button>
                </Col>
              </Row>,
              ]
            : []
        }
        loading={subTaInfoLoadingFlag}
      >
        <Row type="flex" justify="space-around">
          <Col span={24}>
            {String(currentStep) === '0' && (
              <AccountInformationToSubTa
                wrappedComponentRef={ref => {
                  this.accountRef = ref;
                }}
                subTaInfo={subTaInfo || {}}
                hasSubTaWithEmail={hasSubTaWithEmail || false}
                countryList={countryList || []}
                onHandleChange={this.onHandleChange}
                detailOpt={getFormLayout()}
                viewId="subTaSignUpView"
              />
            )}
            {String(currentStep) === '2' && (
              <RegistrationSuccessToSubTa showViewInformation={this.showViewInformation} />
            )}
          </Col>
        </Row>
      </Card>
    );
  };

  render() {
    const { currentStep, subTaInfo = {} } = this.props;
    return (
      <Col span={24} id="subTaSignUpView">
        <Row type="flex" justify="space-around">
          <Col span={24} className={styles.pageHeaderTitle}>
            {this.getPageHeader(currentStep, subTaInfo.statusName)}
          </Col>
        </Row>
        <Row type="flex" justify="space-around">
          <Col span={24}>{this.getPageContent()}</Col>
        </Row>
      </Col>
    );
  }
}

export default SignUp;
