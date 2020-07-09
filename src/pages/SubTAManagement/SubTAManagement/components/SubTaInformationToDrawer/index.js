import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Col, Drawer, message, Row, Spin } from 'antd';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import AccountInformationToSubTaWithDrawer from '../../../components/AccountInformationToSubTaWithDrawer';
import SubTaDetailComp from '../SubTaDetailComp';
import { isNvl } from '@/utils/utils';
import { getFormKeyValue } from '../../../utils/pubUtils';
import styles from './index.less';

const mapStateToProps = store => {
  const {
    subTaId,
    subTaInfo,
    subTaInfoLoadingFlag,
    countryList,
    hasSubTaWithEmail,
  } = store.subTaMgr;
  const { searchForm, searchList, isDetail, isEdit, operationVisible } = store.subTAManagement;
  return {
    subTaId,
    subTaInfo,
    subTaInfoLoadingFlag,
    countryList,
    searchForm,
    searchList,
    isDetail,
    isEdit,
    operationVisible,
    hasSubTaWithEmail,
  };
};

@connect(mapStateToProps)
class SubTaInformationToDrawer extends PureComponent {
  onHandleChange = (key, keyValue, fieldKey) => {
    const { dispatch, subTaInfo } = this.props;
    const { form } = this.editRef.props;
    let newSubTaInfo = {};
    if (!isNvl(subTaInfo)) {
      newSubTaInfo = { ...subTaInfo };
    }
    const noVal = getFormKeyValue(keyValue);
    if (String(key).toLowerCase() === 'email') {
      dispatch({
        type: 'subTaMgr/fetchQrySubTaInfoByEmail',
        payload: {
          email: keyValue,
          subTaId: subTaInfo.subTaId,
        },
      });
    }
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
        type: 'subTaMgr/fetchModifySubTaInfo',
        payload: {
          ...subTaInfo,
          taId: null,
          applicationDate: subTaInfo.applicationDate
            ? moment(subTaInfo.applicationDate, 'YYYY-MM-DD').format('YYYY-MM-DD')
            : null,
        },
      }).then(flag => {
        if (flag) {
          message.success(formatMessage({ id: 'EDIT_SUB_TA_SUCCESS' }), 10);
          this.onClose();
        }
      });
    });
  };

  onClose = () => {
    const { dispatch, searchList } = this.props;
    dispatch({
      type: 'subTAManagement/save',
      payload: {
        isDetail: false,
        isEdit: false,
        operationVisible: false,
      },
    });
    dispatch({ type: 'subTaMgr/doCleanData' });
    this.qrySubTAList(searchList.currentPage, searchList.pageSize);
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

  qrySubTAList = (currentPage, pageSize) => {
    const { dispatch, searchForm, searchList } = this.props;
    dispatch({
      type: 'subTAManagement/fetchQrySubTAList',
      payload: {
        taCompanyId: searchForm.taCompanyId,
        companyName: searchForm.companyName,
        applyStartDate: searchForm.applyStartDate,
        applyEndDate: searchForm.applyEndDate,
        pageInfo: {
          currentPage,
          pageSize,
          totalSize: searchList.total,
        },
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
      hasSubTaWithEmail,
    } = this.props;
    let showTitle = formatMessage({ id: 'COMMON_DETAIL' });
    if (isEdit) {
      showTitle = formatMessage({ id: 'COMMON_EDIT' });
    }
    return (
      <Drawer
        id="subTaDrawerView"
        title={<div className={styles.title}>{showTitle}</div>}
        className={styles.subTaDrawer}
        onClose={this.onClose}
        visible={operationVisible}
        bodyStyle={{ padding: '8px 24px' }}
      >
        <Row type="flex" justify="space-around">
          <Col span={24}>
            <Spin spinning={subTaInfoLoadingFlag}>

              {!isEdit && isDetail && (
                <SubTaDetailComp subTaInfo={subTaInfo || {}} countryList={countryList || []} />
              )}
            </Spin>
          </Col>
        </Row>
        {/* <div className={styles.subTaEditBtn}> */}
        {/*  <Button onClick={this.onClose} style={{ marginRight: 8 }}> */}
        {/*    {formatMessage({ id: 'COMMON_CANCEL' })} */}
        {/*  </Button> */}
        {/*  {isDetail && ( */}
        {/*    <Button onClick={this.goModify} type="primary"> */}
        {/*      {formatMessage({ id: 'SUB_TA_BTN_MODIFY' })} */}
        {/*    </Button> */}
        {/*  )} */}
        {/*  {isEdit && ( */}
        {/*    <Button */}
        {/*      onClick={this.onOk} */}
        {/*      type="primary" */}
        {/*      loading={subTaInfoLoadingFlag} */}
        {/*      disabled={hasSubTaWithEmail} */}
        {/*    > */}
        {/*      {formatMessage({ id: 'COMMON_OK' })} */}
        {/*    </Button> */}
        {/*  )} */}
        {/* </div> */}
      </Drawer>
    );
  }
}

export default SubTaInformationToDrawer;
