import React, { PureComponent } from 'react';
import { Card, Col, Form, Row } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import ContactInformationToFrom from '../../components/ContactInformationToFrom';
import CompanyInformationToFrom from '../../components/CompanyInformationToFrom';
import QuestionsToFrom from '../../components/QuestionsToFrom';
import ApplyARCreditToFrom from '../../components/ApplyARCreditToFrom';
import FileUploadToFrom from '../../components/FileUploadToFrom';
import { getFormKeyValue, getFormLayout, getProductType } from '../../utils/pubUtils';
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
    countryList,
    cityList,
    categoryList,
    customerGroupList,
    cityLoadingFlag,
    customerGroupLoadingFlag,
  } = store.taCommon;
  const { taId, customerInfo, isCompanyExist } = store.taMgr;
  const { isRwsRoom, isRwsAttraction, viewId } = store.myProfile;
  const { userCompanyInfo } = store.global;
  return {
    organizationRoleList,
    countryList,
    cityList,
    salutationList,
    categoryList,
    customerGroupList,
    cityLoadingFlag,
    customerGroupLoadingFlag,
    customerInfo,
    taId,
    isRwsRoom,
    isRwsAttraction,
    viewId,
    isCompanyExist,
    userCompanyInfo,
  };
};

@connect(mapStateToProps)
class CustomerInformationToEdit extends PureComponent {
  componentDidMount() {
    const { form } = this.props;
    form.resetFields();
  }

  onHandleContactEditChange = (key, keyValue, fieldKey) => {
    const { dispatch, form, customerInfo } = this.props;
    let newContactInfo = {};
    if (!isNvl(customerInfo) && !isNvl(customerInfo.contactInfo)) {
      newContactInfo = { ...customerInfo.contactInfo };
    }
    const noVal = getFormKeyValue(keyValue);
    form.setFieldsValue(JSON.parse(`{"${fieldKey}":"${noVal}"}`));
    const source = JSON.parse(`{"${key}":"${noVal}"}`);
    Object.assign(newContactInfo, source);
    dispatch({
      type: 'taMgr/save',
      payload: {
        customerInfo: {
          ...customerInfo,
          contactInfo: newContactInfo,
        },
      },
    });
  };

  getGst = (keyValue, newCompanyInfo) => {
    const { form } = this.props;
    if (String(keyValue) !== '1') {
      form.setFieldsValue({ gstRegNo: null });
      form.setFieldsValue({ gstEffectiveDate: null });
      Object.assign(newCompanyInfo, { gstRegNo: null });
      Object.assign(newCompanyInfo, { gstEffectiveDate: null });
    } else {
      form.setFieldsValue({ gstRegNo: newCompanyInfo.gstRegNo });
      const gstEffectiveDateObj = {
        gstEffectiveDate: newCompanyInfo.gstEffectiveDate,
      };
      if (newCompanyInfo.gstEffectiveDate) {
        gstEffectiveDateObj.gstEffectiveDate = moment(
          newCompanyInfo.gstEffectiveDate,
          newCompanyInfo.gstEffectiveDate.includes('-') ? 'YYYY-MM-DD' : 'DD/MM/YYYY'
        );
      }
      form.setFieldsValue(gstEffectiveDateObj);
      Object.assign(newCompanyInfo, { gstRegNo: newCompanyInfo.gstRegNo });
      Object.assign(newCompanyInfo, gstEffectiveDateObj);
    }
    return newCompanyInfo;
  };

  onHandleCompanyEditChange = (key, keyValue, fieldKey) => {
    const { dispatch, form, customerInfo, taId } = this.props;
    let newCompanyInfo = {};
    if (!isNvl(customerInfo) && !isNvl(customerInfo.companyInfo)) {
      newCompanyInfo = { ...customerInfo.companyInfo };
    }
    if (String(key) === 'country') {
      if (String(keyValue) !== String(newCompanyInfo.country)) {
        dispatch({
          type: 'taCommon/fetchQueryCityList',
          payload: { countryId: keyValue },
        });
        const sourceOne = { city: String(keyValue) === '65' ? '65' : null };
        form.setFieldsValue(sourceOne);
        newCompanyInfo.isGstRegIndicator = '0';
        if (String(keyValue) === '65') {
          newCompanyInfo.isGstRegIndicator = '1';
        }
        form.setFieldsValue({ isGstRegIndicator: newCompanyInfo.isGstRegIndicator });
        this.getGst(newCompanyInfo.isGstRegIndicator, newCompanyInfo);
        Object.assign(newCompanyInfo, sourceOne);
      }
    }
    if (String(key) === 'category') {
      if (String(keyValue) !== String(newCompanyInfo.category)) {
        dispatch({
          type: 'taCommon/fetchQueryCustomerGroupList',
          payload: { categoryId: keyValue },
        });
        const sourceOne = { customerGroup: null };
        form.setFieldsValue(sourceOne);
        Object.assign(newCompanyInfo, sourceOne);
      }
    }
    if (String(key) === 'registrationNo') {
      if (keyValue) {
        dispatch({
          type: 'taMgr/fetchCheckCompanyExist',
          payload: { registrationNo: keyValue, taId },
        });
      } else {
        dispatch({
          type: 'taMgr/save',
          payload: {
            isCompanyExist: false,
          },
        });
      }
    }
    if (String(key) === 'isGstRegIndicator') {
      this.getGst(keyValue, newCompanyInfo);
    }
    const noVal = getFormKeyValue(keyValue);
    form.setFieldsValue(JSON.parse(`{"${fieldKey}":"${noVal}"}`));
    const source = JSON.parse(`{"${key}":"${noVal}"}`);
    Object.assign(newCompanyInfo, source);
    dispatch({
      type: 'taMgr/save',
      payload: {
        customerInfo: {
          ...customerInfo,
          companyInfo: newCompanyInfo,
        },
      },
    });
  };

  onHandleToProCheckBoxEdit = (e, productType) => {
    const { dispatch, customerInfo } = this.props;
    const { companyInfo = {} } = customerInfo || {};
    let newProductList = [];
    if (companyInfo && companyInfo.productList && companyInfo.productList.length > 0) {
      newProductList = [...companyInfo.productList].filter(
        item => String(item.productType) !== String(productType)
      );
    }
    if (e.target.checked) {
      newProductList.push({
        productType,
        rwsVolume: null,
        otherVolume: null,
      });
    }
    dispatch({
      type: 'taMgr/save',
      payload: {
        customerInfo: {
          ...customerInfo,
          companyInfo: {
            ...companyInfo,
            productList: newProductList,
          },
        },
      },
    });
  };

  onQuestionEditChange = (e, productType) => {
    const { dispatch, form, customerInfo } = this.props;
    const { companyInfo = {} } = customerInfo || {};
    const { productTypeRoom, productTypeAttractions } = getProductType() || {};
    let newProductList = [];
    if (companyInfo && companyInfo.productList && companyInfo.productList.length > 0) {
      newProductList = [...companyInfo.productList].filter(
        item => String(item.productType) !== String(productType)
      );
    }
    newProductList.push({
      productType,
      rwsVolume: null,
      otherVolume: null,
    });
    const payload = {};
    if (String(productType) === productTypeRoom) {
      payload.isRwsRoom = e.target.value;
      form.setFieldsValue({ rwsRoomVolume: null });
      form.setFieldsValue({ otherRoomVolume: null });
    }
    if (String(productType) === productTypeAttractions) {
      payload.isRwsAttraction = e.target.value;
      form.setFieldsValue({ rwsAttractionsVolume: null });
      form.setFieldsValue({ otherAttractionsVolume: null });
    }
    dispatch({
      type: 'myProfile/save',
      payload: {
        ...payload,
      },
    });
    dispatch({
      type: 'taMgr/save',
      payload: {
        customerInfo: {
          ...customerInfo,
          companyInfo: {
            ...companyInfo,
            productList: newProductList,
          },
        },
      },
    });
  };

  onHandleQuestionEditChange = (key, keyValue, fieldKey, productType) => {
    const { dispatch, form, customerInfo } = this.props;
    const { companyInfo = {} } = customerInfo || {};
    let newProductList = [];
    if (companyInfo && companyInfo.productList && companyInfo.productList.length > 0) {
      newProductList = [...companyInfo.productList].filter(
        item => String(item.productType) !== String(productType)
      );
    }
    let productInfo = {};
    if (companyInfo && companyInfo.productList && companyInfo.productList.length > 0) {
      productInfo =
        companyInfo.productList.find(item => String(item.productType) === productType) || {};
    }
    const noVal = getFormKeyValue(keyValue);
    form.setFieldsValue(JSON.parse(`{"${fieldKey}":"${noVal}"}`));
    const source = JSON.parse(`{"${key}":"${noVal}"}`);
    Object.assign(productInfo, source);
    newProductList.push(productInfo);
    dispatch({
      type: 'taMgr/save',
      payload: {
        customerInfo: {
          ...customerInfo,
          companyInfo: {
            ...companyInfo,
            productList: newProductList,
          },
        },
      },
    });
  };

  onHandleNationEditChange = (key, keyValue) => {
    const { dispatch, form, customerInfo } = this.props;
    let newCompanyInfo = {};
    if (!isNvl(customerInfo) && !isNvl(customerInfo.companyInfo)) {
      newCompanyInfo = { ...customerInfo.companyInfo };
    }
    const noVal = getFormKeyValue(keyValue);
    form.setFieldsValue(JSON.parse(`{"${key}":"${noVal}"}`));
    const source = JSON.parse(`{"${key}":"${noVal}"}`);
    Object.assign(newCompanyInfo, source);
    dispatch({
      type: 'taMgr/save',
      payload: {
        customerInfo: {
          ...customerInfo,
          companyInfo: newCompanyInfo,
        },
      },
    });
  };

  onHandleTaFileChange = (taFile, isDel = false) => {
    const { dispatch, customerInfo } = this.props;
    const { companyInfo = {} } = customerInfo || {};
    let newFileList = [];
    if (companyInfo && companyInfo.fileList && companyInfo.fileList.length > 0) {
      newFileList = [...companyInfo.fileList].filter(n => String(n.name) !== String(taFile.name));
    }
    if (!isDel) {
      newFileList.push(taFile);
    }
    dispatch({
      type: 'taMgr/save',
      payload: {
        customerInfo: {
          ...customerInfo,
          companyInfo: {
            ...companyInfo,
            fileList: newFileList,
          },
        },
      },
    });
  };

  onHandleArAccountFileChange = (arAccountFile, isDel = false) => {
    const { dispatch, customerInfo } = this.props;
    const { companyInfo = {} } = customerInfo || {};
    let newArAccountFileList = [];
    if (companyInfo && companyInfo.arAccountFileList && companyInfo.arAccountFileList.length > 0) {
      newArAccountFileList = [...companyInfo.arAccountFileList].filter(
        n => String(n.name) !== String(arAccountFile.name)
      );
    }
    if (!isDel) {
      newArAccountFileList.push(arAccountFile);
    }
    dispatch({
      type: 'taMgr/save',
      payload: {
        customerInfo: {
          ...customerInfo,
          companyInfo: {
            ...companyInfo,
            arAccountFileList: newArAccountFileList,
          },
        },
      },
    });
  };

  onHandleDelTaFile = (file, fileType) => {
    const { dispatch, taId } = this.props;
    dispatch({
      type: 'taMgr/fetchDeleteTAFile',
      payload: {
        fileName: file.name,
        path: file.filePath,
        filePath: file.filePath,
        taId: !isNvl(taId) ? taId : null,
      },
    }).then(flag => {
      if (flag && String(fileType) === 'taFile') {
        this.onHandleTaFileChange(file, true);
      }
      if (flag && String(fileType) === 'arAccountFile') {
        this.onHandleArAccountFileChange(file, true);
      }
    });
  };

  onCheckRegistrationNo = keyValue => {
    const { dispatch, taId } = this.props;
    return dispatch({
      type: 'taMgr/fetchCheckCompanyExist',
      payload: { registrationNo: keyValue, taId },
    });
  };

  render() {
    const {
      form,
      organizationRoleList,
      countryList,
      cityList,
      salutationList,
      categoryList,
      customerGroupList,
      cityLoadingFlag,
      customerGroupLoadingFlag,
      customerInfo,
      isRwsRoom,
      isRwsAttraction,
      viewId,
      userCompanyInfo,
    } = this.props;
    const { companyInfo = {} } = customerInfo || {};
    const isAccountingArRoleFlag = hasAllPrivilege([AR_ACCOUNT_PRIVILEGE]);
    const isMainTaRoleFlag = hasAllPrivilege([MAIN_TA_ADMIN_PRIVILEGE]);
    const isSaleSupportRoleFlag = hasAllPrivilege([SALES_SUPPORT_PRIVILEGE]);
    const detailOpt = getFormLayout();
    const taUserStatus = userCompanyInfo.status || '-1';
    const arCreditProps = {
      form,
      ...detailOpt,
      viewId,
      isMainTaRoleFlag,
      isSaleSupportRoleFlag,
      isAccountingArRoleFlag,
      applyArAccount: companyInfo.applyArAccount,
      onHandleToArCheckBox: this.onHandleCompanyEditChange,
    };
    const myContactProps = {
      form,
      ...detailOpt,
      viewId,
      isMainTaRoleFlag,
      isSaleSupportRoleFlag,
      isAccountingArRoleFlag,
      isTaDeActivationFlag: isMainTaRoleFlag && taUserStatus !== '0',
      salutationList: salutationList || [],
      countryList: countryList || [],
      customerInfo: customerInfo || {},
      onHandleChange: this.onHandleContactEditChange,
    };
    const myCompanyProps = {
      form,
      ...detailOpt,
      viewId,
      isMainTaRoleFlag,
      isSaleSupportRoleFlag,
      isAccountingArRoleFlag,
      isTaDeActivationFlag: isMainTaRoleFlag && taUserStatus !== '0',
      organizationRoleList: organizationRoleList || [],
      countryList: countryList || [],
      cityList: cityList || [],
      categoryList: categoryList || [],
      customerGroupList: customerGroupList || [],
      customerInfo: customerInfo || {},
      cityLoadingFlag,
      customerGroupLoadingFlag,
      onHandleChange: this.onHandleCompanyEditChange,
      onCheckRegistrationNo: this.onCheckRegistrationNo,
    };
    const myQuestionsProps = {
      form,
      ...detailOpt,
      viewId,
      isMainTaRoleFlag,
      isSaleSupportRoleFlag,
      isAccountingArRoleFlag,
      customerInfo: customerInfo || {},
      isRwsRoom,
      isRwsAttraction,
      countryList: countryList || [],
      onHandleToProCheckBox: this.onHandleToProCheckBoxEdit,
      onQuestionChange: this.onQuestionEditChange,
      onHandleChange: this.onHandleQuestionEditChange,
      onHandleNationChange: this.onHandleNationEditChange,
    };
    const myFileProps = {
      form,
      ...detailOpt,
      viewId,
      isMainTaRoleFlag,
      isSaleSupportRoleFlag,
      isAccountingArRoleFlag,
      isTaDeActivationFlag: isMainTaRoleFlag && taUserStatus !== '0',
      applyArAccount: companyInfo.applyArAccount,
      taFileList: companyInfo.fileList || [],
      arAccountFileList: companyInfo.arAccountFileList || [],
      onHandleTaFileChange: this.onHandleTaFileChange,
      onHandleArAccountFileChange: this.onHandleArAccountFileChange,
      onHandleDelTaFile: this.onHandleDelTaFile,
    };
    return (
      <React.Fragment>
        <ApplyARCreditToFrom {...arCreditProps} />
        <Row type="flex" justify="space-around">
          <Col span={24}>
            <Card title={formatMessage({ id: 'CONTACT_INFORMATION' })}>
              <ContactInformationToFrom {...myContactProps} />
            </Card>
          </Col>
        </Row>
        <Row type="flex" justify="space-around">
          <Col span={24}>
            <Card title={formatMessage({ id: 'COMPANY_INFORMATION' })}>
              <CompanyInformationToFrom {...myCompanyProps} />
            </Card>
          </Col>
        </Row>
        <Row type="flex" justify="space-around">
          <Col span={24}>
            <Card title={formatMessage({ id: 'QUESTIONS' })}>
              <QuestionsToFrom {...myQuestionsProps} />
            </Card>
          </Col>
        </Row>
        <Row type="flex" justify="space-around">
          <Col span={24}>
            <Card title={formatMessage({ id: 'FILE_UPLOAD' })}>
              <FileUploadToFrom {...myFileProps} />
            </Card>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default Form.create()(CustomerInformationToEdit);
