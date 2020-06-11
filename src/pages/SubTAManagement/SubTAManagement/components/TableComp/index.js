import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Badge, Col, Icon, Modal, Table, Tooltip } from 'antd';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import MediaQuery from 'react-responsive';
import MobileModal from '@/components/MobileModal';
import StateChangeHistoryComp from '../StateChangeHistoryComp';
import SCREEN from '@/utils/screen';
import { isNvl } from '@/utils/utils';
import styles from './index.less';
import prohibit from '../../../../../assets/pams/prohibit.svg';
import circleURL from '../../../../../assets/pams/circle.svg';
import PaginationComp from '@/components/PaginationComp';
import {
  hasAllPrivilege,
  MAIN_TA_ADMIN_PRIVILEGE,
  SALES_SUPPORT_PRIVILEGE,
} from '@/utils/PrivilegeUtil';

const mapStateToProps = store => {
  const {
    selectSubTaId,
    searchList,
    searchForm,
    subTaList,
    qrySubTaTableLoading,
    editVisible,
    hisVisible,
  } = store.subTAManagement;
  return {
    selectSubTaId,
    searchList,
    searchForm,
    subTaList,
    qrySubTaTableLoading,
    editVisible,
    hisVisible,
  };
};

@connect(mapStateToProps)
class TableComp extends PureComponent {
  getColumns = isMainTaAdminRoleFlag => {
    const columns = [
      {
        title: formatMessage({ id: 'SUB_TA_M_TABLE_NO' }),
        dataIndex: 'number',
        width: '60px',
        render: text => {
          return !isNvl(text) ? <Tooltip title={text}>{text}</Tooltip> : '-';
        },
      },
      {
        title: formatMessage({ id: 'SUB_TA_M_TABLE_SUB_AGENT_COMPANY_NAME' }),
        dataIndex: 'companyName',
        width: '200px',
        render: text => {
          return !isNvl(text) ? <Tooltip title={text}>{text}</Tooltip> : '-';
        },
      },
      {
        title: formatMessage({ id: 'SUB_TA_M_TABLE_COUNTRY_OF_INCORPORATION' }),
        dataIndex: 'countryName',
        width: '200px',
        render: text => {
          return !isNvl(text) ? <Tooltip title={text}>{text}</Tooltip> : '-';
        },
      },
      {
        title: formatMessage({ id: 'SUB_TA_M_TABLE_EMAIL' }),
        dataIndex: 'email',
        width: '180px',
        render: text => {
          return !isNvl(text) ? <Tooltip title={text}>{text}</Tooltip> : '-';
        },
      },
      {
        title: formatMessage({ id: 'SUB_TA_M_TABLE_APPLICATION_DATE' }),
        dataIndex: 'applicationDate',
        width: '180px',
        render: text => {
          return !isNvl(text) ? moment(text, 'YYYY-MM-DD').format('DD-MMM-YYYY') : '-';
        },
      },
      {
        title: formatMessage({ id: 'SUB_TA_M_TABLE_STATUS' }),
        dataIndex: 'statusName',
        width: '120px',
        render: text => {
          let statusStr = 'default';
          let statusTxt = '';
          if (String(text).toLowerCase() === 'active') {
            statusStr = 'success';
            statusTxt = formatMessage({ id: 'SUB_TA_M_TABLE_STATUS_ACTIVE' });
          } else {
            statusStr = 'default';
            statusTxt = formatMessage({ id: 'SUB_TA_M_TABLE_STATUS_INACTIVE' });
          }
          return <Badge status={statusStr} text={statusTxt || null} />;
        },
      },
      {
        title: formatMessage({ id: 'SUB_TA_M_TABLE_OPERATION' }),
        dataIndex: '',
        width: '120px',
        render: (text, record) => {
          const isMainTaRoleFlag = hasAllPrivilege([MAIN_TA_ADMIN_PRIVILEGE]);
          return (
            <div>
              <Tooltip placement="top" title={formatMessage({ id: 'COMMON_DETAIL' })}>
                <Icon
                  type="eye"
                  onClick={e => this.goOperationInformation(e, record.subTaId, true, false)}
                />
              </Tooltip>
              {/*{isMainTaRoleFlag && (*/}
              {/*  <Tooltip placement="top" title={formatMessage({ id: 'COMMON_EDIT' })}>*/}
              {/*    <Icon*/}
              {/*      type="edit"*/}
              {/*      onClick={e => this.goOperationInformation(e, record.subTaId, false, true)}*/}
              {/*    />*/}
              {/*  </Tooltip>*/}
              {/*)}*/}
              <Tooltip placement="top" title={formatMessage({ id: 'SUB_TA_TABLE_HISTORY' })}>
                <Icon type="file-text" onClick={e => this.onShowHisModal(e, record.subTaId)} />
              </Tooltip>
              {isMainTaRoleFlag && String(record.statusName).toLowerCase() === 'active' && (
                <Tooltip
                  placement="top"
                  className={styles.inactiveImg}
                  title={formatMessage({ id: 'SUB_TA_TABLE_PROHIBIT' })}
                >
                  <img
                    src={prohibit}
                    alt=""
                    onClick={() => this.modifyStatus(record.subTaId, 'inactive')}
                  />
                </Tooltip>
              )}
              {isMainTaRoleFlag && String(record.statusName).toLowerCase() === 'inactive' && (
                <Tooltip
                  placement="top"
                  className={styles.inactiveImg}
                  title={formatMessage({ id: 'SUB_TA_TABLE_ENABLE' })}
                >
                  <img
                    src={circleURL}
                    alt=""
                    onClick={() => this.modifyStatus(record.subTaId, 'active')}
                  />
                </Tooltip>
              )}
            </div>
          );
        },
      },
    ];
    if (!isMainTaAdminRoleFlag) {
      return columns.filter(item => {
        return item.dataIndex !== 'statusName';
      });
    }
    return columns;
  };

  modifyStatus = (subTaId, status) => {
    const { dispatch, searchList } = this.props;
    dispatch({
      type: 'subTAManagement/fetchUpdateProfileStatus',
      payload: {
        taId: !isNvl(subTaId) ? subTaId : null,
        type: 'subta',
        status: String(status).toLowerCase(),
      },
    }).then(flag => {
      if (flag) {
        this.qrySubTAList(searchList.currentPage, searchList.pageSize);
      }
    });
  };

  goOperationInformation = (e, subTaId, isDetail, isEdit) => {
    const { dispatch } = this.props;
    e.preventDefault();
    dispatch({
      type: 'subTAManagement/save',
      payload: {
        operationVisible: true,
        isDetail,
        isEdit,
      },
    });
    dispatch({
      type: 'subTaMgr/doCleanData',
      payload: {
        subTaId: !isNvl(subTaId) ? subTaId : null,
      },
    }).then(() => {
      dispatch({ type: 'subTaMgr/fetchQueryCountryList' });
      if (!isNvl(subTaId)) {
        dispatch({
          type: 'subTaMgr/fetchQrySubTaInfo',
          payload: { subTaId: !isNvl(subTaId) ? subTaId : null },
        });
      }
    });
  };

  onShowHisModal = (e, subTaId) => {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch({
      type: 'subTAManagement/save',
      payload: {
        selectSubTaId: subTaId,
        hisVisible: true,
      },
    });
    dispatch({ type: 'subTAStateChangeHistory/clean' });
  };

  handleHisModalCancel = () => {
    const { dispatch, searchList } = this.props;
    dispatch({
      type: 'subTAManagement/save',
      payload: {
        selectSubTaId: null,
        hisVisible: false,
      },
    });
    this.qrySubTAList(searchList.currentPage, searchList.pageSize);
  };

  qrySubTAList = (currentPage, pageSize) => {
    const { dispatch, searchForm, searchList } = this.props;
    dispatch({
      type: 'subTAManagement/fetchQrySubTAList',
      payload: {
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
    const { subTaList, searchList, qrySubTaTableLoading, hisVisible } = this.props;
    const pageOpts = {
      total: searchList.total,
      current: searchList.currentPage,
      pageSize: searchList.pageSize,
      pageChange: (page, pageSize) => {
        this.qrySubTAList(page, pageSize);
      },
    };
    const tableOpts = {
      pagination: false,
      footer: () => <PaginationComp {...pageOpts} />,
    };
    const modalOpts = {
      title: formatMessage({ id: 'SUB_TA_STATE_CHANGE_HISTORY' }),
      visible: hisVisible,
      onCancel: () => this.handleHisModalCancel(),
      footer: null,
    };
    const isMainTaAdminRoleFlag = hasAllPrivilege([MAIN_TA_ADMIN_PRIVILEGE]);
    return (
      <Col span={24}>
        <Table
          size="small"
          className={`tabs-no-padding ${styles.searchTitle}`}
          columns={this.getColumns(isMainTaAdminRoleFlag)}
          rowKey={record => `subTAList${record.subTaId}`}
          dataSource={subTaList}
          loading={qrySubTaTableLoading}
          scroll={{ x: 660 }}
          {...tableOpts}
        />
        {hisVisible && (
          <React.Fragment>
            <MediaQuery
              maxWidth={SCREEN.screenMdMax}
              minWidth={SCREEN.screenSmMin}
              maxHeight={SCREEN.screenXsMax}
            >
              <MobileModal modalOpts={modalOpts}>
                <StateChangeHistoryComp />
              </MobileModal>
            </MediaQuery>
            <MediaQuery
              maxWidth={SCREEN.screenMdMax}
              minWidth={SCREEN.screenSmMin}
              minHeight={SCREEN.screenSmMin}
            >
              <Modal
                title={formatMessage({ id: 'SUB_TA_STATE_CHANGE_HISTORY' })}
                visible={hisVisible}
                onCancel={this.handleHisModalCancel}
                footer={null}
                width="700px"
                bodyStyle={{
                  height: '450px',
                  overflowY: 'auto',
                }}
              >
                <StateChangeHistoryComp />
              </Modal>
            </MediaQuery>
            <MediaQuery minWidth={SCREEN.screenLgMin}>
              <Modal
                title={formatMessage({ id: 'SUB_TA_STATE_CHANGE_HISTORY' })}
                visible={hisVisible}
                onCancel={this.handleHisModalCancel}
                footer={null}
                width="700px"
                bodyStyle={{
                  height: '450px',
                  overflowY: 'auto',
                }}
              >
                <StateChangeHistoryComp />
              </Modal>
            </MediaQuery>
            <MediaQuery maxWidth={SCREEN.screenXsMax}>
              <MobileModal modalOpts={modalOpts}>
                <StateChangeHistoryComp />
              </MobileModal>
            </MediaQuery>
          </React.Fragment>
        )}
      </Col>
    );
  }
}

export default TableComp;
