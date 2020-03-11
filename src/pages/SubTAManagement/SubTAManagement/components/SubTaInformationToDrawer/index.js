import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Col, Drawer, Row, Spin } from 'antd';
import { formatMessage } from 'umi/locale';
import AccountInformationToSubTa from '../../../components/AccountInformationToSubTa';
import SubTaDetailComp from '../SubTaDetailComp';
import { isNvl } from '@/utils/utils';
import { getFormKeyValue } from '../../../utils/pubUtils';
import styles from './index.less';

const mapStateToProps = store => {
  const { subTaId, subTaInfo, subTaInfoLoadingFlag, countryList } = store.subTaMgr;
  const { pagePrivileges = [] } = store.global;
  const { selectSubTaId, isDetail, isEdit, operationVisible } = store.subTAManagement;
  return {
    subTaId,
    subTaInfo,
    subTaInfoLoadingFlag,
    countryList,
    selectSubTaId,
    isDetail,
    isEdit,
    operationVisible,
    pagePrivileges,
  };
};

@connect(mapStateToProps)
class SubTaInformationToDrawer extends PureComponent {
  componentDidMount() {
    const { dispatch, selectSubTaId } = this.props;
    dispatch({
      type: 'subTaMgr/doCleanData',
      payload: {
        subTaId: !isNvl(selectSubTaId) ? selectSubTaId : null,
      },
    }).then(() => {
      dispatch({ type: 'subTaMgr/fetchQueryCountryList' });
      if (!isNvl(selectSubTaId)) {
        dispatch({
          type: 'subTaMgr/fetchQrySubTaInfo',
          payload: { subTaId: !isNvl(selectSubTaId) ? selectSubTaId : null },
        });
      }
    });
  }

  onHandleChange = (key, keyValue, fieldKey) => {
    const { dispatch, subTaInfo } = this.props;
    const { form } = this.editRef.props;
    let newSubTaInfo = {};
    if (!isNvl(subTaInfo)) {
      newSubTaInfo = { ...subTaInfo };
    }
    const noVal = getFormKeyValue(keyValue);
    form.setFieldsValue(JSON.parse(`{"${fieldKey}":"${noVal}"}`));
    const source = JSON.parse(`{"${key}":"${noVal}"}`);
    Object.assign(newSubTaInfo, source);
    dispatch({
      type: 'subTaMgr/save',
      payload: {
        subTaInfo: {
          ...newSubTaInfo,
        },
      },
    });
  };

  onOk = () => {
    const { dispatch, subTaInfo } = this.props;
    const { form } = this.editRef.props;
    form.validateFieldsAndScroll(error => {
      if (error) {
        return;
      }
      dispatch({
        type: 'subTaMgr/fetchSubTARegistration',
        payload: {
          ...subTaInfo,
        },
      }).then(flag => {
        if (flag) {
          this.onClose();
        }
      });
    });
  };

  onClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'subTAManagement/save',
      payload: {
        isDetail: false,
        isEdit: false,
        operationVisible: false,
      },
    });
    dispatch({ type: 'subTaMgr/doCleanData' });
  };

  goModify = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'subTAManagement/save',
      payload: {
        isDetail: false,
        isEdit: true,
        operationVisible: true,
      },
    });
  };

  render() {
    const {
      subTaInfo,
      countryList,
      operationVisible,
      isDetail,
      isEdit,
      subTaInfoLoadingFlag,
    } = this.props;
    return (
      <Drawer
        id="subTaDrawerView"
        title={formatMessage({ id: 'COMMON_EDIT' })}
        width={320}
        closable={false}
        visible={operationVisible}
        bodyStyle={{ padding: '8px' }}
      >
        <Row type="flex" justify="space-around">
          <Col span={24}>
            <Spin spining={subTaInfoLoadingFlag}>
              {isEdit && !isDetail && (
                <AccountInformationToSubTa
                  wrappedComponentRef={ref => {
                    this.editRef = ref;
                  }}
                  subTaInfo={subTaInfo || {}}
                  countryList={countryList || []}
                  onHandleChange={this.onHandleChange}
                  detailOpt={{
                    formItemLayout: {
                      labelCol: { span: 24 },
                      wrapperCol: { span: 24 },
                    },
                    formItemRowLayout: {
                      labelCol: { span: 24 },
                      wrapperCol: { span: 24 },
                    },
                    formItemLongLayout: {
                      labelCol: { span: 24 },
                      wrapperCol: { span: 24 },
                    },
                  }}
                  viewId="subTaDrawerView"
                />
              )}
              {!isEdit && isDetail && (
                <SubTaDetailComp subTaInfo={subTaInfo || {}} countryList={countryList || []} />
              )}
            </Spin>
          </Col>
        </Row>
        <div className={styles.subTaEditBtn}>
          <Button onClick={this.onClose} style={{ marginRight: 8 }}>
            {formatMessage({ id: 'COMMON_CANCEL' })}
          </Button>
          {isDetail && (
            <Button onClick={this.goModify} type="primary">
              {formatMessage({ id: 'SUB_TA_BTN_MODIFY' })}
            </Button>
          )}
          {isEdit && (
            <Button onClick={this.onOk} type="primary" loading={subTaInfoLoadingFlag}>
              {formatMessage({ id: 'COMMON_OK' })}
            </Button>
          )}
        </div>
      </Drawer>
    );
  }
}

export default SubTaInformationToDrawer;
