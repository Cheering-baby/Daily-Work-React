import React, { PureComponent } from 'react';
import { Button, Col, Form, Input, Row, Spin } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import styles from './index.less';
import { getKeyValue, isAccountingArRole } from '../../../utils/pubUtils';

const mapStateToProps = store => {
  const { selectTaId = null, searchForm, searchList, qryTaTableLoading } = store.mainTAManagement;
  const { pagePrivileges = [] } = store.global;
  return {
    selectTaId,
    searchForm,
    searchList,
    pagePrivileges,
    qryTaTableLoading,
  };
};

@Form.create()
@connect(mapStateToProps)
class SearchComp extends PureComponent {
  componentDidMount() {
    const { form } = this.props;
    form.resetFields();
  }

  searchMainTAList = () => {
    const { dispatch, searchForm, searchList } = this.props;
    dispatch({
      type: 'mainTAManagement/fetchQryMainTAList',
      payload: {
        idOrName: searchForm.idOrName,
        peoplesoftEwalletId: searchForm.peoplesoftEwalletId,
        peoplesoftArAccountId: searchForm.peoplesoftArAccountId,
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
        },
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
    Object.assign(queryInfo, source);
    dispatch({
      type: 'mainTAManagement/save',
      payload: {
        searchForm: queryInfo,
      },
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      idOrName,
      peoplesoftEwalletId,
      peoplesoftArAccountId,
      qryTaTableLoading,
      pagePrivileges,
    } = this.props;
    const isAccountingArRoleFlag = isAccountingArRole(pagePrivileges);
    let colSpan = 6;
    if (!isAccountingArRoleFlag) {
      colSpan = 18;
    }
    return (
      <Spin spinning={qryTaTableLoading}>
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
