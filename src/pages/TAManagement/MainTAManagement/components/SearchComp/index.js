import React, { PureComponent } from 'react';
import { Button, Col, Form, Input, Row, Select, Spin } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import styles from './index.less';
import { getKeyValue } from '../../../utils/pubUtils';
import { AR_ACCOUNT_PRIVILEGE, hasAllPrivilege } from '@/utils/PrivilegeUtil';
import { isNvl } from '@/utils/utils';

const mapStateToProps = store => {
  const {
    selectTaId = null,
    searchForm,
    searchList,
    qryTaTableLoading,
    marketList,
    salesPersonList,
    customerGroupList,
    categoryList,
  } = store.mainTAManagement;

  return {
    selectTaId,
    searchForm,
    searchList,
    qryTaTableLoading,
    marketList,
    salesPersonList,
    customerGroupList,
    categoryList,
  };
};

@Form.create()
@connect(mapStateToProps)
class SearchComp extends PureComponent {
  componentDidMount() {
    const { form, dispatch } = this.props;
    dispatch({
      type: 'mainTAManagement/fetchMarketList',
    });
    dispatch({ type: 'mainTAManagement/fetchCategoryList' });
    dispatch({ type: 'mainTAManagement/fetchAllCustomerGroupList' });
    dispatch({ type: 'mainTAManagement/fetchSalesPersonList' });
    form.resetFields();
  }

  getSearchListFromSelect = value => {
    if (value === '') {
      return [];
    }
    if (value && value.length > 0) {
      return value.split(',');
    }
    return value;
  };

  searchMainTAList = () => {
    const { dispatch, searchForm, searchList } = this.props;

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
          currentPage: 1,
          pageSize: searchList.pageSize,
          totalSize: searchList.total,
        },
      },
    });
  };

  resetSearch = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'mainTAManagement/doSaveData',
      payload: {
        searchForm: {
          idOrName: null,
          peoplesoftEwalletId: null,
          peoplesoftArAccountId: null,
          market: [],
          customerGroup: [],
          salesPerson: [],
          category: null,
        },
        customerGroupList: [],
      },
    }).then(() => {
      this.searchMainTAList();
    });
  };

  onHandleChange = (key, keyValue, fieldKey) => {
    const { dispatch, form, searchForm } = this.props;
    const queryInfo = { ...searchForm };
    const noVal = getKeyValue(keyValue);
    form.setFieldsValue(JSON.parse(`{"${fieldKey}":"${noVal}"}`));
    const source = JSON.parse(`{"${key}":"${noVal}"}`);
    if (key === 'category') {
      const emptySource = JSON.parse(`{"customerGroup":""}`);
      Object.assign(queryInfo, emptySource);
    }
    Object.assign(queryInfo, source);
    dispatch({
      type: 'mainTAManagement/save',
      payload: {
        searchForm: queryInfo,
      },
    });
    if (key === 'category') {
      const sourceOne = { customerGroup: [] };
      form.setFieldsValue(sourceOne);
      dispatch({
        type: 'mainTAManagement/fetchCustomerGroupListByCategory',
        payload: {
          category: noVal,
        },
      });
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
      idOrName,
      searchForm: {
        market,
        customerGroup,
        salesPerson,
        category,
        peoplesoftEwalletId,
        peoplesoftArAccountId,
      },
      qryTaTableLoading,
      marketList,
      salesPersonList,
      customerGroupList,
      categoryList,
    } = this.props;
    const isAccountingArRoleFlag = hasAllPrivilege([AR_ACCOUNT_PRIVILEGE]);
    let colSpan = 6;
    if (!isAccountingArRoleFlag) {
      colSpan = 18;
    }
    return (
      <Spin spinning={qryTaTableLoading} className={styles.formCardClass}>
        <Row type="flex" justify="space-around">
          <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6} className={styles.searchCompCol}>
            {getFieldDecorator('idOrName', {
              initialValue: idOrName || null,
            })(
              <Input
                placeholder={formatMessage({ id: 'TA_AGENT_ID_COMPANY_NAME' })}
                onChange={e => this.onHandleChange('idOrName', e.target.value, 'idOrName')}
                onPressEnter={e => this.onHandleChange('idOrName', e.target.value, 'idOrName')}
                allowClear
              />
            )}
          </Col>
          <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6} className={styles.searchCompCol}>
            {getFieldDecorator('market', {
              initialValue: market || [],
            })(
              <Select
                showSearch
                mode="multiple"
                placeholder={formatMessage({ id: 'TA_AGENT_MARKET' })}
                onChange={value => this.onHandleChange('market', value, 'market')}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                style={{ width: '100%' }}
                showArrow
                allowClear
              >
                {marketList && marketList.length > 0
                  ? marketList.map(item => (
                      <Select.Option key={`marketList${item.dictId}`} value={`${item.dictId}`}>
                        {item.dictName}
                      </Select.Option>
                    ))
                  : null}
              </Select>
            )}
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12} className={styles.searchCompCol}>
            <Input.Group compact>
              {getFieldDecorator('category', {
                initialValue: category || [],
                rules: [],
              })(
                <Select
                  showSearch
                  placeholder={formatMessage({ id: 'TA_AGENT_CATEGORY' })}
                  optionFilterProp="children"
                  onChange={value => this.onHandleChange('category', value, 'category')}
                  style={{ width: '50%' }}
                  allowClear
                >
                  {categoryList && categoryList.length > 0
                    ? categoryList.map(item => (
                        <Select.Option key={`categoryList${item.dictId}`} value={`${item.dictId}`}>
                          {item.dictName}
                        </Select.Option>
                      ))
                    : null}
                </Select>
              )}
              {getFieldDecorator('customerGroup', {
                initialValue: customerGroup || [],
              })(
                <Select
                  showSearch
                  mode="multiple"
                  placeholder={formatMessage({ id: 'TA_AGENT_CUSTOMER_GROUP' })}
                  optionFilterProp="children"
                  onChange={value => this.onHandleChange('customerGroup', value, 'customerGroup')}
                  style={{ width: '50%' }}
                  showArrow
                  allowClear
                >
                  {customerGroupList && customerGroupList.length > 0
                    ? customerGroupList.map(item => (
                        <Select.Option
                          key={`customerGroupList${item.dictId}`}
                          value={`${item.dictId}`}
                        >
                          {item.dictName}
                        </Select.Option>
                      ))
                    : null}
                </Select>
              )}
            </Input.Group>
          </Col>
          <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6} className={styles.searchCompCol}>
            {getFieldDecorator('salesPerson', {
              initialValue: salesPerson || [],
            })(
              <Select
                showSearch
                mode="multiple"
                placeholder={formatMessage({ id: 'TA_AGENT_ID_SALES_PERSON' })}
                optionFilterProp="children"
                onChange={value => this.onHandleChange('salesPerson', value, 'salesPerson')}
                style={{ width: '100%' }}
                showArrow
                allowClear
              >
                {salesPersonList && salesPersonList.length > 0
                  ? salesPersonList.map(item => (
                      <Select.Option
                        key={`salesPersonList${item.userCode}`}
                        value={`${item.userCode}`}
                      >
                        {item.userCode}
                      </Select.Option>
                    ))
                  : null}
              </Select>
            )}
          </Col>
          {isAccountingArRoleFlag && (
            <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6} className={styles.searchCompCol}>
              {getFieldDecorator('peoplesoftEwalletId', {
                initialValue: peoplesoftEwalletId || null,
              })(
                <Input
                  placeholder={formatMessage({ id: 'TA_AGENT_E_WALLET_ID' })}
                  onChange={e =>
                    this.onHandleChange(
                      'peoplesoftEwalletId',
                      e.target.value,
                      'peoplesoftEwalletId'
                    )
                  }
                  onPressEnter={e =>
                    this.onHandleChange(
                      'peoplesoftEwalletId',
                      e.target.value,
                      'peoplesoftEwalletId'
                    )
                  }
                  allowClear
                />
              )}
            </Col>
          )}
          {isAccountingArRoleFlag && (
            <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6} className={styles.searchCompCol}>
              {getFieldDecorator('peoplesoftArAccountId', {
                initialValue: peoplesoftArAccountId || null,
              })(
                <Input
                  placeholder={formatMessage({ id: 'TA_AGENT_AR_ACCOUNT_ID' })}
                  onChange={e =>
                    this.onHandleChange(
                      'peoplesoftArAccountId',
                      e.target.value,
                      'peoplesoftArAccountId'
                    )
                  }
                  onPressEnter={e =>
                    this.onHandleChange(
                      'peoplesoftArAccountId',
                      e.target.value,
                      'peoplesoftArAccountId'
                    )
                  }
                  allowClear
                />
              )}
            </Col>
          )}
          <Col
            xs={24}
            sm={12}
            md={12}
            lg={colSpan}
            xl={colSpan}
            xxl={colSpan}
            className={styles.searchCompBtnCol}
          >
            <Button
              type="primary"
              style={{ marginRight: 8 }}
              onClick={() => this.searchMainTAList()}
            >
              {formatMessage({ id: 'BTN_SEARCH' })}
            </Button>
            <Button onClick={() => this.resetSearch()}>{formatMessage({ id: 'BTN_RESET' })}</Button>
          </Col>
        </Row>
      </Spin>
    );
  }
}

export default SearchComp;
