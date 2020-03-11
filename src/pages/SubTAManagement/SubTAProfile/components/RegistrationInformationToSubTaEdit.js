import React, { PureComponent } from 'react';
import { Button, Col, Drawer, Row, Spin } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import AccountInformationToSubTa from '../../components/AccountInformationToSubTa';
import styles from '../index.less';
import { isNvl } from '@/utils/utils';
import { getFormKeyValue, getFormLayout } from '../../utils/pubUtils';

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

  onClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'subTaProfile/save',
      payload: {
        editVisible: false,
      },
    });
  };

  onOk = () => {
    const { dispatch, subTaInfo, subTaId } = this.props;
    const { form } = this.editRef.props;
    form.validateFieldsAndScroll(error => {
      if (error) {
        return;
      }
      dispatch({
        type: 'subTaMgr/fetchSubTARegistration',
        payload: {
          ...subTaInfo,
          subTaId: !isNvl(subTaId) ? subTaId : null,
        },
      }).then(flag => {
        if (flag)
          dispatch({
            type: 'subTaProfile/save',
            payload: {
              editVisible: false,
            },
          });
      });
    });
  };

  render() {
    const { subTaInfo, countryList, editVisible, subTaInfoLoadingFlag } = this.props;
    return (
      <div>
        <Drawer
          id="subTaEditDrawerView"
          title={formatMessage({ id: 'COMMON_EDIT' })}
          width={320}
          closable={false}
          visible={editVisible}
          bodyStyle={{ padding: '8px' }}
        >
          <Row type="flex" justify="space-around">
            <Col span={24}>
              <Spin spining={subTaInfoLoadingFlag}>
                <AccountInformationToSubTa
                  wrappedComponentRef={ref => {
                    this.editRef = ref;
                  }}
                  subTaInfo={subTaInfo || {}}
                  countryList={countryList || []}
                  onHandleChange={this.onHandleChange}
                  detailOpt={getFormLayout()}
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
              {formatMessage({ id: 'GI_BTN_SENT' })}
            </Button>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default RegistrationInformationToSubTaEdit;
