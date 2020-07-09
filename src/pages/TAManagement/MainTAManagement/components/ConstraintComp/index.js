import React, { PureComponent } from 'react';
import { Button, Card, Col, Drawer, Form, Input, message, Row, Select } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import styles from './index.less';
import { isNvl } from '@/utils/utils';
import { getFormKeyValue } from '../../../utils/pubUtils';
import FriendlyDatePicker from '@/components/FriendlyDatePicker';
import SortSelect from '@/components/SortSelect';

const mapStateToProps = store => {
  const {
    selectTaId = null,
    constraintVisible = false,
    searchForm,
    searchList,
  } = store.mainTAManagement;
  const {
    taId = null,
    customerInfo = {},
    otherInfo = {},
    mappingInfo = {},
    taInfoLoadingFlag = false,
  } = store.taMgr;
  const {
    marketList = [],
    salesPersonList = [],
    categoryList = [],
    customerGroupList = [],
    customerGroupLoadingFlag = false,
  } = store.taCommon;
  return {
    selectTaId,
    searchForm,
    searchList,
    taId,
    customerInfo,
    otherInfo,
    mappingInfo,
    taInfoLoadingFlag,
    marketList,
    salesPersonList,
    categoryList,
    customerGroupList,
    customerGroupLoadingFlag,
    constraintVisible,
  };
};

@Form.create()
@connect(mapStateToProps)
class ConstraintComp extends PureComponent {
  onHandleChange = (key, keyValue, fieldKey) => {
    const { dispatch, form, customerInfo } = this.props;
    let newCompanyInfo = {};
    if (!isNvl(customerInfo) && !isNvl(customerInfo.companyInfo)) {
      newCompanyInfo = { ...customerInfo.companyInfo };
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

  getSearchListFromSelect = value => {
    if (value === '') {
      return [];
    }
    if (value && value.length > 0) {
      return value.split(',');
    }
    return value;
  };

  onClose = () => {
    const { dispatch, taId, searchForm, searchList } = this.props;
    dispatch({
      type: 'mainTAManagement/doCleanCommonData',
      payload: { taId: !isNvl(taId) ? taId : null },
    }).then(() => {
      dispatch({
        type: 'mainTAManagement/fetchQryMainTAList',
        payload: {
          idOrName: searchForm.idOrName,
          peoplesoftEwalletId: searchForm.peoplesoftEwalletId,
          peoplesoftArAccountId: searchForm.peoplesoftArAccountId,
          marketList: this.getSearchListFromSelect(searchForm.market),
          customerGroupList: this.getSearchListFromSelect(searchForm.customerGroup),
          salesPersonList: this.getSearchListFromSelect(searchForm.salesPerson),
          category: isNvl(searchForm.category) ? null : searchForm.category,
          pageInfo: {
            totalSize: searchList.total,
            currentPage: searchList.currentPage,
            pageSize: searchList.pageSize,
          },
        },
      });
      dispatch({
        type: 'mainTAManagement/save',
        payload: {
          constraintVisible: false,
        },
      });
    });
  };

  onOk = () => {
    const { dispatch, form, selectTaId, customerInfo, otherInfo, mappingInfo } = this.props;
    form.validateFieldsAndScroll(error => {
      if (error) {
        return;
      }
      dispatch({
        type: 'taMgr/fetchModifyTaInfo',
        payload: {
          otherInfo,
          customerInfo,
          mappingInfo,
          taId: !isNvl(selectTaId) ? selectTaId : null,
          modifyType: 'Constraint',
        },
      }).then(flag => {
        if (flag) {
          message.success(formatMessage({ id: 'ADDITIONAL_EDIT_SUBMITTED_SUCCESS' }), 10);
          this.onClose();
        }
      });
    });
  };

  disabledStartDate = startValue => {
    const { form } = this.props;
    const endTime = form.getFieldValue('endDate');
    if (!startValue || !endTime) {
      return false;
    }
    return startValue.valueOf() > moment(endTime, 'YYYY-MM-DD').valueOf();
  };

  disabledEndDate = endValue => {
    const { form } = this.props;
    const startTime = form.getFieldValue('effectiveDate');
    if (!endValue || !startTime) {
      return false;
    }
    return endValue.valueOf() < moment(startTime, 'YYYY-MM-DD').valueOf();
  };

  render() {
    const {
      form,
      marketList,
      salesPersonList,
      categoryList,
      customerGroupList,
      customerGroupLoadingFlag,
      customerInfo,
      taInfoLoadingFlag,
      constraintVisible,
    } = this.props;
    const { getFieldDecorator } = form;
    const { companyInfo = {} } = customerInfo || {};
    const viewId = 'constraintView';
    return (
      <div>
        <Drawer
          id={`${viewId}`}
          title={formatMessage({ id: 'ADDITIONAL_INFORMATION' })}
          className={styles.additionalConstraintDrawer}
          onClose={this.onClose}
          visible={constraintVisible}
          bodyStyle={{ padding: '8px' }}
        >
          <div>
            <Card className={styles.additionalConstraintCard} loading={taInfoLoadingFlag}>
              <Row type="flex" justify="space-around">
                <Col span={24}>
                  <Form.Item
                    label={formatMessage({ id: 'ADDITIONAL_MARKET' })}
                    colon={false}
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                  >
                    {getFieldDecorator('market', {
                      initialValue: companyInfo.market || [],
                      rules: [{ required: true, message: formatMessage({ id: 'REQUIRED' }) }],
                    })(
                      <SortSelect
                        showSearch
                        allowClear
                        placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                        optionFilterProp="children"
                        getPopupContainer={() => document.getElementById(`${viewId}`)}
                        onChange={value => this.onHandleChange('market', value, 'market')}
                        style={{ width: '100%' }}
                        options={
                          marketList && marketList.length > 0
                            ? marketList.map(item => (
                                <Select.Option
                                  key={`marketList${item.dictId}`}
                                  value={`${item.dictId}`}
                                >
                                  {item.dictName}
                                </Select.Option>
                              ))
                            : null
                        }
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row type="flex" justify="space-around">
                <Col span={24}>
                  <Form.Item
                    label={formatMessage({ id: 'ADDITIONAL_EFFECTIVE_DATE' })}
                    colon={false}
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                  >
                    {getFieldDecorator('effectiveDate', {
                      initialValue: !isNvl(companyInfo.effectiveDate)
                        ? moment(companyInfo.effectiveDate, 'YYYY-MM-DD')
                        : null,
                      rules: [{ required: true, message: formatMessage({ id: 'REQUIRED' }) }],
                    })(
                      <FriendlyDatePicker
                        disabledDate={this.disabledStartDate}
                        onChange={date =>
                          this.onHandleChange(
                            'effectiveDate',
                            isNvl(date) ? date : date.format('YYYY-MM-DD'),
                            'effectiveDate'
                          )
                        }
                        getCalendarContainer={() => document.getElementById(`${viewId}`)}
                        placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                        style={{ width: '100%' }}
                        displayFormat="DD/MM/YYYY"
                        searchFormat="DDMMYYYY"
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row type="flex" justify="space-around">
                <Col span={24}>
                  <Form.Item
                    label={formatMessage({ id: 'ADDITIONAL_END_DATE' })}
                    colon={false}
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                  >
                    {getFieldDecorator('endDate', {
                      initialValue: !isNvl(companyInfo.endDate)
                        ? moment(companyInfo.endDate, 'YYYY-MM-DD')
                        : null,
                      rules: [],
                    })(
                      <FriendlyDatePicker
                        disabledDate={this.disabledEndDate}
                        onChange={date =>
                          this.onHandleChange(
                            'endDate',
                            isNvl(date) ? date : date.format('YYYY-MM-DD'),
                            'endDate'
                          )
                        }
                        getCalendarContainer={() => document.getElementById(`${viewId}`)}
                        placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                        style={{ width: '100%' }}
                        displayFormat="DD/MM/YYYY"
                        searchFormat="DDMMYYYY"
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row type="flex" justify="space-around">
                <Col span={24}>
                  <Form.Item
                    label={formatMessage({ id: 'ADDITIONAL_SALES_MANAGER' })}
                    colon={false}
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                  >
                    {getFieldDecorator('salesPerson', {
                      initialValue: companyInfo.salesPerson || [],
                      rules: [],
                    })(
                      <SortSelect
                        showSearch
                        allowClear
                        placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                        optionFilterProp="children"
                        getPopupContainer={() => document.getElementById(`${viewId}`)}
                        onChange={value => this.onHandleChange('salesPerson', value, 'salesPerson')}
                        style={{ width: '100%' }}
                        options={
                          salesPersonList && salesPersonList.length > 0
                            ? salesPersonList.map(item => (
                                <Select.Option
                                  key={`salesPersonList${item.userCode}`}
                                  value={`${item.userCode}`}
                                >
                                  {item.userCode}
                                </Select.Option>
                              ))
                            : null
                        }
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row type="flex" justify="space-around">
                <Col span={24}>
                  <Form.Item
                    label={formatMessage({ id: 'ADDITIONAL_CATEGORY_AND_CUSTOMER_GROUP' })}
                    colon={false}
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                  >
                    <Input.Group compact>
                      <Form.Item colon={false} className={styles.categoryItem}>
                        {getFieldDecorator('category', {
                          initialValue: companyInfo.category || [],
                          rules: [],
                        })(
                          <SortSelect
                            showSearch
                            allowClear
                            placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                            optionFilterProp="children"
                            getPopupContainer={() => document.getElementById(`${viewId}`)}
                            onChange={value => this.onHandleChange('category', value, 'category')}
                            style={{ width: '100%' }}
                            options={
                              categoryList && categoryList.length > 0
                                ? categoryList.map(item => (
                                    <Select.Option
                                      key={`categoryList${item.dictId}`}
                                      value={`${item.dictId}`}
                                    >
                                      {item.dictName}
                                    </Select.Option>
                                  ))
                                : null
                            }
                          />
                        )}
                      </Form.Item>
                      <Form.Item colon={false} className={styles.customerGroupItem}>
                        {getFieldDecorator('customerGroup', {
                          initialValue: !isNvl(companyInfo.customerGroup)
                            ? companyInfo.customerGroup
                            : [],
                          rules: [],
                        })(
                          <SortSelect
                            showSearch
                            allowClear
                            placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                            optionFilterProp="children"
                            getPopupContainer={() => document.getElementById(`${viewId}`)}
                            onChange={value =>
                              this.onHandleChange('customerGroup', value, 'customerGroup')
                            }
                            loading={customerGroupLoadingFlag}
                            style={{ width: '100%' }}
                            options={
                              customerGroupList && customerGroupList.length > 0
                                ? customerGroupList.map(item => (
                                    <Select.Option
                                      key={`customerGroupList${item.dictId}`}
                                      value={`${item.dictId}`}
                                    >
                                      {item.dictName}
                                    </Select.Option>
                                  ))
                                : null
                            }
                          />
                        )}
                      </Form.Item>
                    </Input.Group>
                  </Form.Item>
                </Col>
              </Row>
              <Row type="flex" justify="space-around">
                <Col span={24}>
                  <Form.Item
                    label={formatMessage({ id: 'ADDITIONAL_REMARK' })}
                    colon={false}
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                  >
                    {getFieldDecorator('remark', {
                      initialValue: companyInfo.remark || undefined,
                    })(
                      <Input.TextArea
                        allowClear
                        placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                        autoSize={{ minRows: 3, maxRows: 6 }}
                        onChange={e => this.onHandleChange('remark', e.target.value, 'remark')}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </div>
          <div className={styles.additionalConstraintBtn}>
            <Button onClick={this.onClose} style={{ marginRight: 8 }}>
              {formatMessage({ id: 'COMMON_CANCEL' })}
            </Button>
            <Button onClick={this.onOk} type="primary" loading={taInfoLoadingFlag}>
              {formatMessage({ id: 'COMMON_OK' })}
            </Button>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default ConstraintComp;
