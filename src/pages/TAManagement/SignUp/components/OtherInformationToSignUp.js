import React, { PureComponent } from 'react';
import { Card, Col, Form, Row } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import BillingInformationToFrom from '../../components/BillingInformationToFrom';
import TAFinanceContactToFrom from '../../components/TAFinanceContactToFrom';
import { isNvl } from '@/utils/utils';
import { getBillingInfo, getFormKeyValue, getFormLayout } from '../../utils/pubUtils';

const mapStateToProps = store => {
  const { otherInfo, customerInfo } = store.taMgr;
  const {
    salutationList,
    currencyList,
    countryList,
    bilCityList,
    bilCityLoadingFlag,
    createTeamList,
  } = store.taCommon;
  const { isBilCheckBox, isAllInformationToRws, viewId } = store.signUp;
  return {
    salutationList,
    currencyList,
    countryList,
    bilCityList,
    bilCityLoadingFlag,
    createTeamList,
    otherInfo,
    customerInfo,
    isBilCheckBox,
    isAllInformationToRws,
    viewId,
  };
};
@connect(mapStateToProps)
class OtherInformationToSignUp extends PureComponent {
  componentDidMount() {
    const { form } = this.props;
    form.resetFields();
  }

  onHandleBilChange = (key, keyValue, fieldKey) => {
    const { dispatch, form, otherInfo } = this.props;
    let newBillingInfo = {};
    if (!isNvl(otherInfo) && !isNvl(otherInfo.billingInfo)) {
      newBillingInfo = { ...otherInfo.billingInfo };
    }
    if (String(key) === 'country') {
      if (String(keyValue) !== String(newBillingInfo.country)) {
        dispatch({
          type: 'taCommon/fetchQueryCityList',
          payload: { countryId: keyValue, isBil: true },
        });
        const source = { city: String(keyValue) === '65' ? '65' : null };
        form.setFieldsValue(source);
        Object.assign(newBillingInfo, source);
      }
    }
    const noVal = getFormKeyValue(keyValue);
    form.setFieldsValue(JSON.parse(`{"${fieldKey}":"${noVal}"}`));
    const source = JSON.parse(`{"${key}":"${noVal}"}`);
    Object.assign(newBillingInfo, source);
    dispatch({
      type: 'taMgr/save',
      payload: {
        otherInfo: {
          ...otherInfo,
          billingInfo: newBillingInfo,
        },
      },
    });
  };

  onHandleToBilCheckBox = e => {
    const { dispatch, customerInfo, otherInfo } = this.props;
    const { companyInfo = {} } = customerInfo || {};
    const newBillingInfo = getBillingInfo(otherInfo, companyInfo, e.target.checked);
    dispatch({
      type: 'signUp/save',
      payload: {
        isBilCheckBox: e.target.checked,
      },
    });
    dispatch({
      type: 'taMgr/save',
      payload: {
        otherInfo: {
          ...otherInfo,
          billingInfo: newBillingInfo,
        },
      },
    });
  };

  onHandleTAFinanceChange = (key, keyValue, fieldKey, financeType) => {
    const { dispatch, form, otherInfo } = this.props;
    const { financeContactList = [] } = otherInfo || {};
    const financeInfo = {
      ...financeContactList.find(item => String(item.financeType) === String(financeType)),
    };
    const newParamList = [
      ...financeContactList.filter(n => String(n.financeType) !== String(financeType)),
    ];
    const noVal = getFormKeyValue(keyValue);
    form.setFieldsValue(JSON.parse(`{"${fieldKey}":"${noVal}"}`));
    const source = JSON.parse(`{"${key}":"${noVal}"}`);
    Object.assign(financeInfo, source);
    financeInfo.financeType = financeType;
    newParamList.push(financeInfo);
    dispatch({
      type: 'taMgr/save',
      payload: {
        otherInfo: {
          ...otherInfo,
          financeContactList: newParamList,
        },
      },
    });
  };

  onHandleToTAFinanceCheckBox = e => {
    const { dispatch } = this.props;
    dispatch({
      type: 'signUp/save',
      payload: {
        isAllInformationToRws: e.target.checked,
      },
    });
  };

  render() {
    const {
      form,
      salutationList = [],
      countryList = [],
      bilCityList = [],
      currencyList = [],
      createTeamList = [],
      otherInfo = {},
      customerInfo = {},
      bilCityLoadingFlag = false,
      isBilCheckBox,
      isAllInformationToRws,
      viewId,
    } = this.props;
    const detailOpt = getFormLayout();
    const myBilProps = {
      form,
      ...detailOpt,
      viewId,
      salutationList,
      countryList,
      bilCityList,
      otherInfo: otherInfo || {},
      customerInfo: customerInfo || {},
      bilCityLoadingFlag,
      isBilCheckBox,
      onHandleChange: this.onHandleBilChange,
      onHandleToBilCheckBox: this.onHandleToBilCheckBox,
    };
    const myTAFinanceProps = {
      form,
      ...detailOpt,
      viewId,
      currencyList,
      countryList,
      createTeamList,
      otherInfo: otherInfo || {},
      mappingInfo: {},
      isAllInformationToRws,
      onMappingHandleChange: () => {},
      onHandleChange: this.onHandleTAFinanceChange,
      onHandleToTAFinanceCheckBoxEdit: this.onHandleToTAFinanceCheckBox,
    };
    return (
      <React.Fragment>
        <Row type="flex" justify="space-around">
          <Col span={24}>
            <Card title={formatMessage({ id: 'BILLING_INFORMATION' })}>
              <BillingInformationToFrom {...myBilProps} />
            </Card>
          </Col>
        </Row>
        <Row type="flex" justify="space-around">
          <Col span={24}>
            <Card title={formatMessage({ id: 'TA_FINANCE_CONTACT' })}>
              <TAFinanceContactToFrom {...myTAFinanceProps} />
            </Card>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default Form.create()(OtherInformationToSignUp);
