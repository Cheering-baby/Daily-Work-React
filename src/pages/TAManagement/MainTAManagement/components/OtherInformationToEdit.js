import React, { PureComponent } from 'react';
import { Card, Col, Form, Row } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import BillingInformationToFrom from '../../components/BillingInformationToFrom';
import TAFinanceContactToFrom from '../../components/TAFinanceContactToFrom';
import {
  getBillingInfo,
  getFormKeyValue,
  getFormLayout,
  isAccountingArRole,
  isMainTaRole,
  isSaleSupportRole,
} from '../../utils/pubUtils';
import { isNvl } from '@/utils/utils';

const mapStateToProps = store => {
  const {
    organizationRoleList,
    salutationList,
    currencyList,
    countryList,
    cityList,
    bilCityList,
    bilCityLoadingFlag,
  } = store.taCommon;
  const {
    otherInfo,
    customerInfo,
    mappingInfo,
    taId,
    status,
    remark,
    taInfoLoadingFlag,
  } = store.taMgr;
  const { pagePrivileges = [] } = store.global;
  const { isBilCheckBox, isAllInformationToRws, viewId } = store.mainTAManagement;
  return {
    otherInfo,
    customerInfo,
    mappingInfo,
    taId,
    status,
    remark,
    taInfoLoadingFlag,
    organizationRoleList,
    salutationList,
    currencyList,
    countryList,
    cityList,
    bilCityList,
    bilCityLoadingFlag,
    isBilCheckBox,
    isAllInformationToRws,
    pagePrivileges,
    viewId,
  };
};

@connect(mapStateToProps)
class OtherInformationToEdit extends PureComponent {
  componentDidMount() {
    const { form } = this.props;
    form.resetFields();
  }

  onHandleBilEditChange = (key, keyValue, fieldKey) => {
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
        const source = { city: '' };
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

  onHandleToBilCheckBoxEdit = e => {
    const { dispatch, customerInfo, otherInfo } = this.props;
    const { companyInfo = {} } = customerInfo || {};
    const newBillingInfo = getBillingInfo(otherInfo, companyInfo, e.target.checked);
    dispatch({
      type: 'mainTAManagement/save',
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

  onHandleTAFinanceEditChange = (key, keyValue, fieldKey, financeType) => {
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

  onHandleMappingEditChange = (key, keyValue, fieldKey) => {
    const { dispatch, form, mappingInfo } = this.props;
    let newMappingInfo = {};
    if (!isNvl(mappingInfo)) {
      newMappingInfo = { ...mappingInfo };
    }
    const noVal = getFormKeyValue(keyValue);
    form.setFieldsValue(JSON.parse(`{"${fieldKey}":"${noVal}"}`));
    const source = JSON.parse(`{"${key}":"${noVal}"}`);
    Object.assign(newMappingInfo, source);
    dispatch({
      type: 'taMgr/save',
      payload: {
        mappingInfo: {
          ...mappingInfo,
        },
      },
    });
  };

  onHandleToTAFinanceCheckBoxEdit = e => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mainTAManagement/save',
      payload: {
        isAllInformationToRws: e.target.checked,
      },
    });
  };

  render() {
    const {
      form,
      salutationList = [],
      currencyList = [],
      countryList = [],
      bilCityList = [],
      otherInfo = {},
      customerInfo = {},
      mappingInfo = {},
      bilCityLoadingFlag = false,
      isBilCheckBox,
      isAllInformationToRws,
      viewId,
      pagePrivileges,
    } = this.props;
    const isAccountingArRoleFlag = isAccountingArRole(pagePrivileges);
    const isMainTaRoleFlag = isMainTaRole(pagePrivileges);
    const isSaleSupportRoleFlag = isSaleSupportRole(pagePrivileges);
    const detailOpt = getFormLayout();
    const myBilProps = {
      form,
      ...detailOpt,
      isMainTaRoleFlag,
      isSaleSupportRoleFlag,
      isAccountingArRoleFlag,
      viewId,
      salutationList: salutationList || [],
      countryList: countryList || [],
      bilCityList: bilCityList || [],
      otherInfo: otherInfo || {},
      customerInfo: customerInfo || {},
      bilCityLoadingFlag,
      isBilCheckBox,
      onHandleChange: this.onHandleBilEditChange,
      onHandleToBilCheckBox: this.onHandleToBilCheckBoxEdit,
    };
    const myTAFinanceProps = {
      form,
      ...detailOpt,
      isMainTaRoleFlag,
      isSaleSupportRoleFlag,
      isAccountingArRoleFlag,
      viewId,
      currencyList: currencyList || [],
      otherInfo: otherInfo || {},
      mappingInfo: mappingInfo || {},
      isAllInformationToRws,
      onMappingHandleChange: this.onHandleMappingEditChange,
      onHandleChange: this.onHandleTAFinanceEditChange,
      onHandleToTAFinanceCheckBoxEdit: this.onHandleToTAFinanceCheckBoxEdit,
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

export default Form.create()(OtherInformationToEdit);
