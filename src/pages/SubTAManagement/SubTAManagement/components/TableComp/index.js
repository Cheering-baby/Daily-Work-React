import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Badge, Col, Icon, Modal, Table, Tooltip } from 'antd';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import StateChangeHistoryComp from '../StateChangeHistoryComp';
import { isMainTaRoleSub } from '../../../utils/pubUtils';
import { isNvl } from '@/utils/utils';
import styles from './index.less';

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
  const { pagePrivileges = [] } = store.global;
  return {
    selectSubTaId,
    searchList,
    searchForm,
    subTaList,
    qrySubTaTableLoading,
    editVisible,
    hisVisible,
    pagePrivileges,
  };
};

@connect(mapStateToProps)
class TableComp extends PureComponent {
  getColumns = () => {
    return [
      {
        title: formatMessage({ id: 'SUB_TA_M_TABLE_NO' }),
        dataIndex: 'number',
        width: '60px',
      },
      {
        title: formatMessage({ id: 'SUB_TA_M_TABLE_SUB_AGENT_COMPANY_NAME' }),
        dataIndex: 'companyName',
        width: '200px',
      },
      {
        title: formatMessage({ id: 'SUB_TA_M_TABLE_COUNTRY_OF_INCORPORATION' }),
        dataIndex: 'countryName',
        width: '200px',
      },
      {
        title: formatMessage({ id: 'SUB_TA_M_TABLE_EMAIL' }),
        dataIndex: 'email',
        width: '180px',
      },
      {
        title: formatMessage({ id: 'SUB_TA_M_TABLE_APPLICATION_DATE' }),
        dataIndex: 'applicationDate',
        width: '180px',
        render: text => {
          return !isNvl(text) ? moment(text, 'YYYYMMDD').format('DD-MMM-YYYY') : '-';
        },
      },
      {
        title: formatMessage({ id: 'SUB_TA_M_TABLE_STATUS' }),
        dataIndex: 'statusName',
        width: '120px',
        render: text => {
          let statusStr = 'default';
          let statusTxt = '';
          if (String(text).toLowerCase() === 'success') {
            statusStr = 'active';
            statusTxt = formatMessage({ id: 'SUB_TA_M_TABLE_STATUS_ACTIVE' });
          } else {
            statusStr = 'inactive';
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
          const { pagePrivileges } = this.props;
          const isMainTaRoleFlag = isMainTaRoleSub(pagePrivileges);
          return (
            <div>
              <Tooltip placement="top" title={formatMessage({ id: 'COMMON_DETAIL' })}>
                <Icon type="eye" onClick={e => this.goOperationInformation(e, record.subTaId)} />
              </Tooltip>
              {isMainTaRoleFlag && (
                <Tooltip placement="top" title={formatMessage({ id: 'COMMON_EDIT' })}>
                  <Icon type="edit" onClick={e => this.goOperationInformation(e, record.subTaId)} />
                </Tooltip>
              )}
              <Tooltip placement="top" title={formatMessage({ id: 'SUB_TA_TABLE_HISTORY' })}>
                <Icon type="file-text" onClick={e => this.onShowHisModal(e, record.subTaId)} />
              </Tooltip>
            </div>
          );
        },
      },
    ];
  };

  goOperationInformation = (e, subTaId) => {
    const { dispatch } = this.props;
    e.preventDefault();
    dispatch({
      type: 'subTAManagement/save',
      payload: {
        selectSubTaId: subTaId,
        operationVisible: true,
      },
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
    const { subTaList, qrySubTaTableLoading, hisVisible } = this.props;
    const tableOpts = {};
    return (
      <Col span={24}>
        <Table
          size="small"
          className={`tabs-no-padding ${styles.searchTitle}`}
          columns={this.getColumns()}
          rowKey={record => `subTAList${record.taId}`}
          dataSource={subTaList}
          loading={qrySubTaTableLoading}
          scroll={{ x: 660 }}
          {...tableOpts}
        />
        {hisVisible && (
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
        )}
      </Col>
    );
  }
}

export default TableComp;
