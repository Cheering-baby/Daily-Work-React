import React, { PureComponent } from 'react';
import { Button, Col, Drawer, message, Row, Spin } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import AccountInformationToSubTaWithDrawer from '../../components/AccountInformationToSubTaWithDrawer';
import styles from '../index.less';
import { isNvl } from '@/utils/utils';
import { getFormKeyValue } from '../../utils/pubUtils';

const mapStateToProps = store => {
  const { subTaId, subTaInfo, subTaInfoLoadingFlag, countryList } = store.subTaMgr;
  const { pagePrivileges = [] } = store.global;
  const { editVisible } = store.subTaProfile;
  return {
    subTaId,
    subTaInfo,
    subTaInfoLoadingFlag,
    countryList,
    editVisible,
    pagePrivileges,
  };
};

@connect(mapStateToProps)
class RegistrationInformationToSubTaEdit extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      subTaInfoState: {},
    };
  }

  initState = (state, props) => {
    const { subTaInfoState = {} } = state;
    return { ...props.subTaInfo, ...subTaInfoState };
  };

  onHandleChange = (key, keyValue, fieldKey) => {
    const { subTaInfo } = this.props;
    const { subTaInfoState } = this.state;
    const { form } = this.editRef.props;
    let newSubTaInfo = {};
    if (!isNvl(subTaInfo) && !isNvl(subTaInfoState)) {
      newSubTaInfo = { ...subTaInfo, ...subTaInfoState };
    }
    if (isNvl(subTaInfo) && !isNvl(subTaInfoState)) {
      newSubTaInfo = { ...subTaInfoState };
    }
    const noVal = getFormKeyValue(keyValue);
    form.setFieldsValue(JSON.parse(`{"${fieldKey}":"${noVal}"}`));
    const source = JSON.parse(`{"${key}":"${noVal}"}`);
    Object.assign(newSubTaInfo, source);
    this.setState({
      subTaInfoState: { ...newSubTaInfo },
    });
    // dispatch({
    //   type: 'subTaMgr/save',
    //   payload: {
    //     subTaInfo: {
    //       ...newSubTaInfo,
    //     },
    //   },
    // });
  };

  onClose = () => {
    const { dispatch, subTaId } = this.props;
    dispatch({
      type: 'subTaProfile/save',
      payload: {
        editVisible: false,
      },
    });
    dispatch({
      type: 'subTaMgr/fetchQrySubTaInfo',
      payload: { subTaId: !isNvl(subTaId) ? subTaId : null },
    });
  };

  onOk = () => {
    const { dispatch, subTaInfo, subTaId } = this.props;
    const { subTaInfoState } = this.state;
    const { form } = this.editRef.props;
    form.validateFieldsAndScroll(error => {
      if (error) {
        return;
      }
      dispatch({
        type: 'subTaMgr/fetchSubTARegistration',
        payload: {
          ...subTaInfo,
          ...subTaInfoState,
          subTaId: !isNvl(subTaId) ? subTaId : null,
        },
      }).then(flag => {
        if (flag) {
          message.success(formatMessage({ id: 'EDIT_SUB_TA_SUCCESS' }), 10);
          this.onClose();
        }
      });
    });
  };

  render() {
    const { countryList, editVisible, subTaInfoLoadingFlag } = this.props;
    return (
      <div>
        <Drawer
          id="subTaEditDrawerView"
          title={formatMessage({ id: 'COMMON_EDIT' })}
          className={styles.subTaDrawer}
          onClose={this.onClose}
          visible={editVisible}
          bodyStyle={{ padding: '8px' }}
        >
          <Row type="flex" justify="space-around">
            <Col span={24}>
              <Spin spinning={subTaInfoLoadingFlag}>
                <AccountInformationToSubTaWithDrawer
                  wrappedComponentRef={ref => {
                    this.editRef = ref;
                  }}
                  subTaInfo={this.initState(this.state, this.props) || {}}
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
                  viewId="subTaEditDrawerView"
                />
              </Spin>
            </Col>
          </Row>
          <div className={styles.subTaDrawerBtn}>
            <Button onClick={this.onClose} style={{ marginRight: 8 }}>
              {formatMessage({ id: 'COMMON_CANCEL' })}
            </Button>
            <Button onClick={this.onOk} type="primary" loading={subTaInfoLoadingFlag}>
              {formatMessage({ id: 'COMMON_OK' })}
            </Button>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default RegistrationInformationToSubTaEdit;
