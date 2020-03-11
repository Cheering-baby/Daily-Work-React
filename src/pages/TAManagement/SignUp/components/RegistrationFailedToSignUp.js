import React, { PureComponent } from 'react';
import { Button, Col, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import { connect } from 'dva';
import errorURL from '../../../../assets/pams/signup/error.svg';
import styles from '../index.less';
import { isNvl } from '@/utils/utils';

const mapStateToProps = store => {
  const { taId, status, remark } = store.taMgr;
  const { countryList = [], categoryList = [] } = store.taCommon;
  return {
    taId,
    status,
    remark,
    countryList,
    categoryList,
  };
};

@connect(mapStateToProps)
class RegistrationFailedToSignUp extends PureComponent {
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

  showViewInformation = e => {
    e.preventDefault();
    const { dispatch, taId, status, remark, countryList, categoryList } = this.props;
    dispatch({
      type: 'signUp/doCleanData',
      payload: {
        taId: !isNvl(taId) ? taId : null,
        status,
        remark,
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
      if (!isNvl(taId)) {
        dispatch({
          type: 'taMgr/fetchQueryTaInfoWithMask',
          payload: { taId },
        });
      }
    });
  };

  render() {
    const { remark } = this.props;
    return (
      <React.Fragment>
        <Row type="flex" justify="space-around" className={styles.registrationFailedRow}>
          <Col span={24} className={styles.registrationFailedTop}>
            <img src={errorURL} alt="" />
          </Col>
          <Col span={24} className={styles.registrationFailedContent}>
            <h3>{formatMessage({ id: 'REGISTRATION_FAILED_TITLE' })}</h3>
            <p>{remark}</p>
          </Col>
          <Col span={24} className={styles.registrationFailedBottom}>
            <Button htmlType="button" loading={false} onClick={e => this.showViewInformation(e)}>
              {formatMessage({ id: 'REGISTRATION_FAILED_INFORMATION_BTN' })}
            </Button>
            <Button
              htmlType="button"
              type="primary"
              loading={false}
              onClick={e => this.goReRegistration(e)}
            >
              {formatMessage({ id: 'REGISTRATION_FAILED_RE_BTN' })}
            </Button>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default RegistrationFailedToSignUp;
