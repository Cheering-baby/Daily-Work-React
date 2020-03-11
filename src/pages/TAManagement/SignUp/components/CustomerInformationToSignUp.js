import React, { PureComponent } from 'react';
import { Card, Col, Form, Row } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import ContactInformationToFrom from '../../components/ContactInformationToFrom';
import CompanyInformationToFrom from '../../components/CompanyInformationToFrom';
import QuestionsToFrom from '../../components/QuestionsToFrom';
import ApplyARCreditToFrom from '../../components/ApplyARCreditToFrom';
import FileUploadToFrom from '../../components/FileUploadToFrom';
import { isNvl } from '@/utils/utils';
import { getFormKeyValue, getFormLayout, getProductType } from '../../utils/pubUtils';

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
  const { customerInfo, taId } = store.taMgr;
  const { isRwsRoom, isRwsAttraction, viewId } = store.signUp;
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
  };
};
@connect(mapStateToProps)
class CustomerInformationToSignUp extends PureComponent {
  onHandleContactChange = (key, keyValue, fieldKey) => {
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

  onHandleCompanyChange = (key, keyValue, fieldKey) => {
    const { dispatch, form, customerInfo } = this.props;
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
        const sourceOne = { city: null };
        form.setFieldsValue(sourceOne);
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
    if (String(key) === 'isGstRegIndicator') {
      form.setFieldsValue({ gstRegNo: newCompanyInfo.gstRegNo });
      form.setFieldsValue({ gstEffectiveDate: newCompanyInfo.gstEffectiveDate });
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

  onHandleToProCheckBox = (e, productType) => {
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
        productType, // 01: hotel 02:attractions
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

  onQuestionChange = (e, productType) => {
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
      type: 'signUp/save',
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

  onHandleQuestionChange = (key, keyValue, fieldKey, productType) => {
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

  onHandleNationChange = (key, keyValue) => {
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
    } = this.props;
    const { companyInfo = {} } = customerInfo || {};
    const detailOpt = getFormLayout();
    const arCreditProps = {
      form,
      ...detailOpt,
      viewId,
      applyArAccount: companyInfo.applyArAccount,
      onHandleToArCheckBox: this.onHandleCompanyChange,
    };
    const myContactProps = {
      form,
      ...detailOpt,
      viewId,
      salutationList: salutationList || [],
      countryList: countryList || [],
      customerInfo: customerInfo || {},
      onHandleChange: this.onHandleContactChange,
    };
    const myCompanyProps = {
      form,
      ...detailOpt,
      viewId,
      organizationRoleList: organizationRoleList || [],
      countryList: countryList || [],
      cityList: cityList || [],
      categoryList: categoryList || [],
      customerGroupList: customerGroupList || [],
      customerInfo: customerInfo || {},
      cityLoadingFlag,
      customerGroupLoadingFlag,
      onHandleChange: this.onHandleCompanyChange,
    };
    const myQuestionsProps = {
      form,
      ...detailOpt,
      viewId,
      customerInfo: customerInfo || {},
      isRwsRoom,
      isRwsAttraction,
      countryList: countryList || [],
      onHandleToProCheckBox: this.onHandleToProCheckBox,
      onQuestionChange: this.onQuestionChange,
      onHandleChange: this.onHandleQuestionChange,
      onHandleNationChange: this.onHandleNationChange,
    };
    const myFileProps = {
      form,
      ...detailOpt,
      viewId,
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

export default Form.create()(CustomerInformationToSignUp);
