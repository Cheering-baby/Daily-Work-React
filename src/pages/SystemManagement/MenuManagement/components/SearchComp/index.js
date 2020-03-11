import React, { PureComponent } from 'react';
import { Button, Col, Form, Input, Row, Spin } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import styles from './index.less';
import { isNvl } from '@/utils/utils';

const mapStateToProps = store => {
  const {
    searchForm = {
      menuName: null,
    },
    qryMenuTableLoading = false,
    viewId = 'menuView',
  } = store.menuMgr;
  return {
    searchForm,
    qryMenuTableLoading,
    viewId,
  };
};

@Form.create()
@connect(mapStateToProps)
class SearchComp extends PureComponent {
  componentDidMount() {
    const { form } = this.props;
    form.resetFields();
  }

  getKeyValue = keyValue => {
    let noVal = '';
    if (!isNvl(keyValue)) {
      noVal = String(keyValue);
      noVal = noVal.replace(/\n/g, '\\n');
      noVal = noVal.replace(/\r/g, '\\r');
      noVal = noVal.replace(/(^[ \f\t\v]*)|([ \f\t\v]*$)/g, '');
    }
    return noVal;
  };

  onHandleChange = (key, keyValue, fieldKey) => {
    const { dispatch, form, searchForm } = this.props;
    const searchNewForm = { ...searchForm };
    const noVal = this.getKeyValue(keyValue);
    form.setFieldsValue(JSON.parse(`{"${fieldKey}":"${noVal}"}`));
    const source = JSON.parse(`{"${key}":"${noVal}"}`);
    Object.assign(searchNewForm, source);
    dispatch({
      type: 'menuMgr/save',
      payload: {
        searchForm: searchNewForm,
      },
    });
  };

  searchMenuTree = () => {};

  resetSearch = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'menuMgr/doSaveData',
      payload: {
        searchForm: {
          menuName: null,
        },
      },
    }).then(() => {
      this.searchMenuTree();
    });
  };

  render() {
    const { form, qryMenuTableLoading, searchForm } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Spin spinning={qryMenuTableLoading}>
        <Row type="flex" justify="space-around">
          <Col
            xs={24}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            xxl={12}
            className={styles.searchCompMenuCol}
          >
            {getFieldDecorator('menuName', {
              initialValue: searchForm.menuName || null,
            })(
              <Input
                placeholder={formatMessage({ id: 'SEARCH_MENU_NAME' })}
                onChange={e => this.onHandleChange('menuName', e.target.value, 'menuName')}
                onPressEnter={e => this.onHandleChange('menuName', e.target.value, 'menuName')}
                style={{ width: '250px' }}
                allowClear
              />
            )}
          </Col>
          <Col
            xs={24}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            xxl={12}
            className={styles.searchCompMenuBtnCol}
          >
            <Button type="primary" style={{ marginRight: 8 }} onClick={() => this.searchMenuTree()}>
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
