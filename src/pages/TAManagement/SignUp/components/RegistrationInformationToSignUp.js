import React, { PureComponent } from 'react';
import { Badge, Button, Card, Col, Row } from 'antd';
import router from 'umi/router';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import DetailForRegistrationInformation from '../../components/DetailForRegistrationInformation';
import styles from '../index.less';
import smallErrorURL from '../../../../assets/pams/signup/smallError.svg';
import { isNvl } from '@/utils/utils';

const mapStateToProps = store => {
  const { customerInfo, otherInfo, mappingInfo, taId, status, remark } = store.taMgr;
  const {
    organizationRoleList,
    salutationList,
    countryList,
    cityList,
    bilCityList,
    currencyList,
    categoryList,
  } = store.taCommon;
  return {
    customerInfo,
    otherInfo,
    mappingInfo,
    taId,
    status,
    remark,
    organizationRoleList,
    salutationList,
    countryList,
    cityList,
    bilCityList,
    currencyList,
    categoryList,
  };
};

@connect(mapStateToProps)
class RegistrationInformationToSignUp extends PureComponent {
  getStatusMsg = status => {
    let statusStr = 'default';
    let statusTxt = '';
    switch (status) {
      case '05':
        statusStr = 'error';
        statusTxt = formatMessage({ id: 'STATUS_REJECT' });
        break;
      case '04':
        statusStr = 'processing';
        statusTxt = formatMessage({ id: 'STATUS_COMPLETED' });
        break;
      case '03':
        statusStr = 'warning';
        statusTxt = formatMessage({ id: 'STATUS_PENDING' });
        break;
      case '02':
        statusStr = 'warning';
        statusTxt = formatMessage({ id: 'STATUS_PENDING' });
        break;
      case '01':
        statusStr = 'warning';
        statusTxt = formatMessage({ id: 'STATUS_PENDING' });
        break;
      default:
        statusStr = 'default';
        statusTxt = formatMessage({ id: 'STATUS_PENDING' });
        break;
    }
    return <Badge status={statusStr} text={statusTxt || null} />;
  };

  goReRegistration = e => {
    e.preventDefault();
    const { dispatch, taId } = this.props;
    dispatch({
      type: 'signUp/doCleanData',
      payload: { taId: !isNvl(taId) ? taId : null },
    }).then(() => {
      router.push('/TAManagement/SignUp');
    });
  };

  render() {
    const {
      otherInfo = {},
      customerInfo = {},
      mappingInfo = {},
      organizationRoleList = [],
      salutationList = [],
      countryList = [],
      cityList = [],
      bilCityList = [],
      currencyList = [],
      categoryList = [],
      customerGroupList = [],
      status,
      remark,
    } = this.props;
    const detailProps = {
      otherInfo,
      customerInfo,
      mappingInfo,
      organizationRoleList,
      salutationList,
      countryList,
      cityList,
      bilCityList,
      currencyList,
      categoryList,
      customerGroupList,
    };
    return (
      <Col span={24}>
        {String(status) === '05' && (
          <Row type="flex" justify="space-around" className={styles.rejectInformation}>
            <Col xs={24} sm={24} md={16} lg={20} xl={20} xxl={20} className={styles.topRejectCol}>
              <Row type="flex" justify="space-around">
                <Col span={24} className={styles.topColRejectMsg}>
                  <img src={smallErrorURL} alt="" />
                  <span className={styles.topColRejectTitle}>
                    {formatMessage({ id: 'STATUS_REJECT' })}
                  </span>
                </Col>
              </Row>
              <Row type="flex" justify="space-around">
                <Col span={24} className={styles.rejectMsg}>
                  <p>{remark}</p>
                </Col>
              </Row>
            </Col>
            <Col xs={24} sm={24} md={8} lg={4} xl={4} xxl={4} className={styles.bottomCol}>
              <div className={styles.bottomColDiv}>
                <Button type="primary" onClick={e => this.goReRegistration(e)}>
                  {formatMessage({ id: 'REGISTRATION_FAILED_RE_BTN' })}
                </Button>
              </div>
            </Col>
          </Row>
        )}
        <Row type="flex" justify="space-around">
          <Col span={24} className={styles.detailInformation}>
            <Card
              title={formatMessage({ id: 'REGISTRATION_INFORMATION' })}
              extra={this.getStatusMsg(status)}
            >
              <DetailForRegistrationInformation {...detailProps} />
            </Card>
          </Col>
        </Row>
      </Col>
    );
  }
}

export default RegistrationInformationToSignUp;
