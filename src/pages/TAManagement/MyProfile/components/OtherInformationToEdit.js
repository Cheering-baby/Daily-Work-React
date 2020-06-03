import React, { PureComponent } from 'react';
import { Card, Col, Form, Row } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import BillingInformationToFrom from '../../components/BillingInformationToFrom';
import TAFinanceContactToFrom from '../../components/TAFinanceContactToFrom';
import { getBillingInfo, getFormKeyValue, getFormLayout } from '../../utils/pubUtils';
import { isNvl } from '@/utils/utils';
import {
  AR_ACCOUNT_PRIVILEGE,
  hasAllPrivilege,
  MAIN_TA_ADMIN_PRIVILEGE,
  SALES_SUPPORT_PRIVILEGE,
} from '@/utils/PrivilegeUtil';

const mapStateToProps = store => {
  const {
    organizationRoleList,
    salutationList,
    currencyList,
    countryList,
    cityList,
    bilCityList,
    bilCityLoadingFlag,
    createTeamList,
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
  const { isBilCheckBox, isAllInformationToRws, viewId } = store.myProfile;
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
    createTeamList,
    isBilCheckBox,
    isAllInformationToRws,
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
          ...newMappingInfo,
        },
      },
    });
  };

  onHandleToTAFinanceCheckBoxEdit = e => {
    const { dispatch } = this.props;
    dispatch({
      type: 'myProfile/save',
      payload: {
        isAllInformationToRws: e.target.checked,
      },
    });
  };

  render() {
    const {
      form,
      viewId,
      salutationList = [],
      currencyList = [],
      countryList = [],
      bilCityList = [],
      createTeamList = [],
      otherInfo = {},
      customerInfo = {},
      mappingInfo = {},
      bilCityLoadingFlag = false,
      isBilCheckBox,
      isAllInformationToRws,
    } = this.props;
    const isAccountingArRoleFlag = hasAllPrivilege([AR_ACCOUNT_PRIVILEGE]);
    const isMainTaRoleFlag = hasAllPrivilege([MAIN_TA_ADMIN_PRIVILEGE]);
    const isSaleSupportRoleFlag = hasAllPrivilege([SALES_SUPPORT_PRIVILEGE]);
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
      countryList,
      createTeamList,
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
