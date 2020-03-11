import React, { PureComponent } from 'react';
import { Button, Col, Row } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import { formatMessage } from 'umi/locale';
import successURL from '../../../../assets/pams/signup/success.svg';
import styles from '../index.less';
import { isNvl } from '@/utils/utils';

const mapStateToProps = store => {
  const { taId, otherInfo, customerInfo } = store.taMgr;
  const { countryList = [], categoryList = [] } = store.taCommon;
  return {
    taId,
    otherInfo,
    customerInfo,
    countryList,
    categoryList,
  };
};

@connect(mapStateToProps)
class RegistrationSuccessfullyToSignUp extends PureComponent {
  closeSignUp = e => {
    e.preventDefault();
    router.push('/userLogin/pamsLogin');
  };

  showViewInformation = e => {
    e.preventDefault();
    const { dispatch, taId, countryList, categoryList } = this.props;
    dispatch({
      type: 'signUp/doCleanData',
      payload: {
        taId: !isNvl(taId) ? taId : null,
        isShowDetail: true,
      },
    }).then(() => {
      dispatch({ type: 'taCommon/fetchQuerySalutationList' });
      dispatch({ type: 'taCommon/fetchQueryOrganizationRoleList' });
      dispatch({ type: 'taCommon/fetchQryMarketList' });
      // dispatch({ type: 'taCommon/fetchQrySalesPersonList' });
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
      dispatch({ type: 'taMgr/fetchQueryTaInfoWithNoId' });
    });
  };

  render() {
    return (
      <React.Fragment>
        <Row type="flex" justify="space-around" className={styles.registrationSuccessfullyRow}>
          <Col span={24} className={styles.registrationSuccessfullyTop}>
            <img src={successURL} alt="" />
          </Col>
          <Col span={24} className={styles.registrationSuccessfullyContent}>
            <h3>{formatMessage({ id: 'COMPLETED_REGISTRATION_SUBMITTED_SUCCESS' })}</h3>
            <p>{formatMessage({ id: 'COMPLETED_SUCCESS_MESSAGE' })}</p>
          </Col>
          <Col span={24} className={styles.registrationSuccessfullyBottom}>
            <Button htmlType="button" loading={false} onClick={e => this.closeSignUp(e)}>
              {formatMessage({ id: 'COMPLETED_CLOSE' })}
            </Button>
            <Button
              htmlType="button"
              type="primary"
              loading={false}
              onClick={e => this.showViewInformation(e)}
            >
              {formatMessage({ id: 'COMPLETED_VIEW_INFORMATION' })}
            </Button>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default RegistrationSuccessfullyToSignUp;
