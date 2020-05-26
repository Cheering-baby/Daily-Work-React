import React, { PureComponent } from 'react';
import { Badge, Button, Col, Icon, message, Modal, Popover, Row, Table, Tabs, Tooltip } from 'antd';
import { Tabs as MobileTabs } from 'antd-mobile';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import MediaQuery from 'react-responsive';
import { formatMessage } from 'umi/locale';
import MobileModal from '../../../../../components/MobileModal';
import PaginationComp from '@/components/PaginationComp';
import UploadContractComp from '../UploadContractComp';
import UploadContractHistoryComp from '../UploadContractHistoryComp';
import StateChangeHistoryComp from '../StateChangeHistoryComp';
import SCREEN from '@/utils/screen';
import styles from './index.less';
import { isNvl } from '@/utils/utils';
import {
  AR_ACCOUNT_PRIVILEGE,
  hasAllPrivilege,
  SALES_SUPPORT_PRIVILEGE,
} from '@/utils/PrivilegeUtil';

const mapStateToProps = store => {
  const { countryList, categoryList, marketList } = store.taCommon;
  const {
    taId = null,
    searchForm,
    searchList = {},
    mainTAList = [],
    modalVisible = false,
    selectTaId,
    contractHisModalVisible = false,
    hisActiveKey,
    qryTaTableLoading,
    selectMoreTaId = null,
    taMoreVisible = false,
    selectedRowKeys = [],
    rowSelected,
    rowAllSelected,
    taSelectedRowKeys = [],
  } = store.mainTAManagement;
  const { contractFileList = [], contractFileUploading = false } = store.uploadContract;
  return {
    taId,
    searchForm,
    searchList,
    mainTAList,
    modalVisible,
    selectTaId,
    contractFileList,
    contractFileUploading,
    contractHisModalVisible,
    hisActiveKey,
    qryTaTableLoading,
    selectMoreTaId,
    taMoreVisible,
    countryList,
    categoryList,
    marketList,
    selectedRowKeys,
    rowSelected,
    rowAllSelected,
    taSelectedRowKeys,
  };
};

@connect(mapStateToProps)
class TableComp extends PureComponent {
  getColumns = () => {
    return [
      {
        title: formatMessage({ id: 'TA_TABLE_NO' }),
        dataIndex: 'number',
        width: '60px',
        render: text => {
          return !isNvl(text) ? <Tooltip title={text}>{text}</Tooltip> : '-';
        },
      },
      {
        title: formatMessage({ id: 'TA_TABLE_AGENT_ID' }),
        dataIndex: 'taId',
        width: '120px',
        render: text => {
          return !isNvl(text) ? <Tooltip title={text}>{text}</Tooltip> : '-';
        },
      },
      {
        title: formatMessage({ id: 'TA_TABLE_AR_COMPANY_NAME' }),
        dataIndex: 'companyName',
        width: '200px',
        render: text => {
          return !isNvl(text) ? <Tooltip title={text}>{text}</Tooltip> : '-';
        },
      },
      {
        title: formatMessage({ id: 'TA_TABLE_AR_E_WALLET_ID' }),
        dataIndex: 'peoplesoftEwalletId',
        width: '200px',
        render: text => {
          return !isNvl(text) ? <Tooltip title={text}>{text}</Tooltip> : '-';
        },
      },
      {
        title: formatMessage({ id: 'TA_TABLE_AR_AR_ACCOUNT_ID' }),
        dataIndex: 'peoplesoftArAccountId',
        width: '200px',
        render: text => {
          return !isNvl(text) ? <Tooltip title={text}>{text}</Tooltip> : '-';
        },
      },
      {
        title: formatMessage({ id: 'TA_TABLE_AR_CREDIT_BALANCE' }),
        dataIndex: 'arCreditBalance',
        width: '200px',
        render: text => {
          return !isNvl(text)
            ? Number(text)
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            : '-';
        },
      },
      {
        title: formatMessage({ id: 'TA_TABLE_E_WALLET_BALANCE' }),
        dataIndex: 'eWalletIdBalance',
        width: '200px',
        render: text => {
          return !isNvl(text)
            ? Number(text)
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            : '-';
        },
      },
      {
        title: formatMessage({ id: 'TA_TABLE_AR_EFFECTIVE_DATE' }),
        dataIndex: 'effectiveDate',
        width: '140px',
        render: text => {
          return !isNvl(text) ? moment(text).format('DD-MMM-YYYY') : '-';
        },
      },
      {
        title: formatMessage({ id: 'TA_TABLE_AR_STATUS' }),
        dataIndex: 'statusName',
        width: '100px',
        render: text => {
          let statusStr = 'default';
          let statusTxt = '';
          switch (String(text).toLowerCase()) {
            case 'active':
              statusStr = 'success';
              statusTxt = formatMessage({ id: 'TA_STATUS_ACTIVE' });
              break;
            case 'inactive':
              statusStr = 'default';
              statusTxt = formatMessage({ id: 'TA_STATUS_INACTIVE' });
              break;
            default:
              statusStr = 'default';
              statusTxt = formatMessage({ id: 'TA_STATUS_INACTIVE' });
              break;
          }
          return <Badge status={statusStr} text={statusTxt || null} />;
        },
      },
      {
        title: formatMessage({ id: 'TA_TABLE_OPERATION' }),
        dataIndex: '',
        width: '100px',
        render: (text, record) => {
          const { selectMoreTaId, taMoreVisible } = this.props;
          const isAccountingArRoleFlag = hasAllPrivilege([AR_ACCOUNT_PRIVILEGE]);
          const isSaleSupportRoleFlag = hasAllPrivilege([SALES_SUPPORT_PRIVILEGE]);
          const showEdit =
            isAccountingArRoleFlag && !isSaleSupportRoleFlag ? (
              <Tooltip placement="top" title={formatMessage({ id: 'COMMON_EDIT' })}>
                <Icon type="edit" onClick={e => this.goEditInformation(e, record.taId)} />
              </Tooltip>
            ) : null;
          const showMore =
            isAccountingArRoleFlag && !isSaleSupportRoleFlag ? (
              <Popover
                placement="bottomRight"
                visible={
                  !isNvl(selectMoreTaId) && String(selectMoreTaId) === String(record.taId)
                    ? taMoreVisible
                    : false
                }
                onVisibleChange={visible => this.onMoreVisibleChange(record.taId, visible)}
                content={this.getAccountingArRoleMoreContent(record)}
                overlayClassName={styles.popClassName}
                getPopupContainer={() => document.getElementById(`mainTaView`)}
              >
                <Icon type="more" />
              </Popover>
            ) : null;
          return (
            <div>
              <Tooltip placement="top" title={formatMessage({ id: 'COMMON_DETAIL' })}>
                <Icon type="eye" onClick={e => this.goDetailInformation(e, record.taId)} />
              </Tooltip>
              {isSaleSupportRoleFlag ? (
                <Tooltip placement="top" title={formatMessage({ id: 'TA_TABLE_ADDITIONAL' })}>
                  <Icon type="plus" onClick={e => this.goAdditionalInformation(e, record.taId)} />
                </Tooltip>
              ) : (
                showEdit
              )}
              {isSaleSupportRoleFlag ? (
                <Popover
                  placement="bottomRight"
                  visible={
                    !isNvl(selectMoreTaId) && String(selectMoreTaId) === String(record.taId)
                      ? taMoreVisible
                      : false
                  }
                  onVisibleChange={visible => this.onMoreVisibleChange(record.taId, visible)}
                  content={this.getMoreContent(record, isSaleSupportRoleFlag)}
                  overlayClassName={styles.popClassName}
                  getPopupContainer={() => document.getElementById(`mainTaView`)}
                >
                  <Icon type="more" />
                </Popover>
              ) : (
                showMore
              )}
            </div>
          );
        },
      },
    ];
  };

  getMoreContent = (record, isSaleSupportRoleFlag) => {
    return (
      <Row type="flex" justify="space-around" className={styles.contentRow}>
        {isSaleSupportRoleFlag && (
          <Col span={24}>
            <div
              className={styles.contentCol}
              onClick={e => this.goEditInformation(e, record.taId)}
            >
              {formatMessage({ id: 'COMMON_EDIT' })}
            </div>
          </Col>
        )}
        <Col span={24}>
          <div
            className={styles.contentCol}
            onClick={() => this.onShowContractFileModal(record.taId)}
          >
            {formatMessage({ id: 'TA_TABLE_UPLOAD' })}
          </div>
        </Col>
        <Col span={24}>
          <div
            className={styles.contentCol}
            onClick={() => this.onShowContractFileHisModal(record.taId)}
          >
            {formatMessage({ id: 'TA_TABLE_HISTORY' })}
          </div>
        </Col>
        <Col span={24}>
          {String(record.statusName).toLowerCase() === 'active' && (
            <div
              className={styles.contentCol}
              onClick={() => this.modifyStatus(record.taId, 'inactive')}
            >
              {formatMessage({ id: 'TA_TABLE_PROHIBIT' })}
            </div>
          )}
          {String(record.statusName).toLowerCase() === 'inactive' && (
            <div
              className={styles.contentCol}
              onClick={() => this.modifyStatus(record.taId, 'active')}
            >
              {formatMessage({ id: 'TA_TABLE_ENABLE' })}
            </div>
          )}
        </Col>
      </Row>
    );
  };

  getAccountingArRoleMoreContent = record => {
    return (
      <Row type="flex" justify="space-around" className={styles.contentRow}>
        <Col span={24}>
          <div
            className={styles.contentCol}
            onClick={() => this.onShowContractFileHisModal(record.taId)}
          >
            {formatMessage({ id: 'TA_TABLE_HISTORY' })}
          </div>
        </Col>
      </Row>
    );
  };

  onMoreVisibleChange = (taId, visible) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mainTAManagement/save',
      payload: {
        selectMoreTaId: taId,
        taMoreVisible: visible,
      },
    });
  };

  modifyStatus = (taId, status) => {
    const { dispatch, searchList } = this.props;
    this.onMoreVisibleChange(taId, false);
    dispatch({
      type: 'mainTAManagement/fetchUpdateProfileStatus',
      payload: {
        taId: !isNvl(taId) ? taId : null,
        type: 'ta',
        status: String(status).toLowerCase(),
      },
    }).then(flag => {
      if (flag) {
        this.qryMainTAList(searchList.currentPage, searchList.pageSize);
      }
    });
  };

  goAdditionalInformation = (e, taId) => {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch({
      type: 'mainTAManagement/doCleanCommonData',
      payload: { taId: !isNvl(taId) ? taId : null },
    }).then(() => {
      dispatch({
        type: 'mainTAManagement/save',
        payload: {
          selectTaId: taId,
          constraintVisible: true,
        },
      });
      dispatch({ type: 'taCommon/fetchQrySalesPersonList' });
      dispatch({ type: 'taCommon/fetchQueryCreateTeam' });
      dispatch({ type: 'taCommon/fetchQueryAgentOpt' }).then(() => {
        if (!isNvl(taId)) {
          dispatch({
            type: 'taMgr/fetchQueryTaInfo',
            payload: { taId },
          });
          dispatch({
            type: 'taMgr/fetchQueryTaMappingInfo',
            payload: { taId },
          });
          dispatch({
            type: 'taMgr/fetchQueryTaAccountInfo',
            payload: { taId },
          });
        }
      });
    });
  };

  goEditInformation = (e, taId) => {
    e.preventDefault();
    this.onMoreVisibleChange(taId, false);
    router.push(`/TAManagement/MainTAManagement/Edit?taId=${taId}`);
  };

  goDetailInformation = (e, taId) => {
    e.preventDefault();
    this.onMoreVisibleChange(taId, false);
    router.push(`/TAManagement/MainTAManagement/Detail?taId=${taId}`);
  };

  onHandleContractFileChange = (contractFile, isDel) => {
    const { dispatch, contractFileList = [] } = this.props;
    let newContractFileList = [];
    if (contractFileList && contractFileList.length > 0) {
      newContractFileList = [...contractFileList].filter(
        n => String(n.uid) !== String(contractFile.uid)
      );
    }
    if (!isDel && String(contractFile.status) !== 'removed') {
      newContractFileList.push(contractFile);
    }
    dispatch({
      type: 'uploadContract/save',
      payload: {
        contractFileList: newContractFileList,
      },
    });
  };

  onHandleDelContactFile = (file, fileType) => {
    const { dispatch, contractFileList = [] } = this.props;
    dispatch({
      type: 'taMgr/fetchDeleteTAFile',
      payload: {
        fileName: file.name,
        path: file.filePath,
        filePath: file.filePath,
      },
    }).then(flag => {
      if (flag && String(fileType) === 'contractFile') {
        this.onHandleContractFileChange(file, true);
      }
      if (!flag && String(fileType) === 'contractFile') {
        let newContractFileList = [];
        if (contractFileList && contractFileList.length > 0) {
          newContractFileList = [...contractFileList].filter(
            n => String(n.uid) !== String(file.uid)
          );
        }
        file.status = 'error';
        newContractFileList.push(file);
        dispatch({
          type: 'uploadContract/save',
          payload: {
            contractFileList: newContractFileList,
          },
        });
      }
    });
  };

  onShowContractFileModal = taId => {
    const { dispatch } = this.props;
    this.onMoreVisibleChange(taId, false);
    dispatch({
      type: 'mainTAManagement/save',
      payload: {
        selectTaId: taId,
        modalVisible: true,
      },
    });
    dispatch({ type: 'uploadContract/clean' });
  };

  handleModalCancel = () => {
    const { dispatch, searchList } = this.props;
    dispatch({
      type: 'mainTAManagement/save',
      payload: {
        selectTaId: null,
        modalVisible: false,
      },
    });
    dispatch({ type: 'uploadContract/clean' });
    this.qryMainTAList(searchList.currentPage, searchList.pageSize);
  };

  handleModalOk = () => {
    const { dispatch, selectTaId, contractFileList, searchList } = this.props;
    const newContractList = [];
    if (!contractFileList || contractFileList.length <= 0) {
      message.warn(formatMessage({ id: 'TA_UPLOAD_FILE_MSG' }), 10);
      dispatch({
        type: 'uploadContract/save',
        payload: {
          contractFileList: newContractList,
        },
      });
      return;
    }
    contractFileList.forEach(n => {
      if (String(n.status) === 'done') {
        newContractList.push({
          name: n.name,
          path: n.path,
          sourceName: n.sourceName,
        });
      }
    });
    dispatch({
      type: 'uploadContract/fetchRegisterContractFile',
      payload: {
        taId: selectTaId,
        contractList: newContractList || [],
      },
    }).then(flag => {
      if (flag) {
        this.qryMainTAList(searchList.currentPage, searchList.pageSize);
        dispatch({
          type: 'mainTAManagement/save',
          payload: {
            contractFileList: [],
            selectTaId: null,
            modalVisible: false,
          },
        });
      }
    });
  };

  onShowContractFileHisModal = taId => {
    const { dispatch } = this.props;
    this.onMoreVisibleChange(taId, false);
    dispatch({
      type: 'mainTAManagement/save',
      payload: {
        selectTaId: taId,
        contractHisModalVisible: true,
      },
    });
    dispatch({ type: 'uploadContractHistory/clean' });
  };

  handleHisModalCancel = () => {
    const { dispatch, searchList } = this.props;
    dispatch({
      type: 'mainTAManagement/save',
      payload: {
        selectTaId: null,
        contractHisModalVisible: false,
      },
    });
    this.qryMainTAList(searchList.currentPage, searchList.pageSize);
  };

  onHandleHisModalTab = key => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mainTAManagement/save',
      payload: {
        hisActiveKey: key,
      },
    });
  };

  qryMainTAList = (currentPage, pageSize) => {
    const { dispatch, searchForm, searchList } = this.props;
    dispatch({
      type: 'mainTAManagement/fetchQryMainTAList',
      payload: {
        idOrName: searchForm.idOrName,
        peoplesoftEwalletId: searchForm.peoplesoftEwalletId,
        peoplesoftArAccountId: searchForm.peoplesoftArAccountId,
        pageInfo: {
          totalSize: searchList.total,
          currentPage,
          pageSize,
        },
      },
    });
  };

  grantTa = taSelectedRowKeys => {
    if (taSelectedRowKeys.length > 0) {
      router.push({
        pathname: `/TAManagement/MainTAManagement/Grant`,
        query: { taIdList: taSelectedRowKeys.join(',') },
      });
    }
  };

  onTaSelectChange = selectedRowKeys => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mainTAManagement/save',
      payload: {
        taSelectedRowKeys: selectedRowKeys,
      },
    });
  };

  onSelectChange = selectedRowKeys => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mainTAManagement/saveSelect',
      payload: {
        selectedRowKeys,
      },
    });
  };

  render() {
    const {
      searchList,
      mainTAList,
      qryTaTableLoading,
      modalVisible = false,
      contractFileList = [],
      contractFileUploading = false,
      contractHisModalVisible = false,
      hisActiveKey,
      taSelectedRowKeys = [],
    } = this.props;
    const pageOpts = {
      total: searchList.total,
      current: searchList.currentPage,
      pageSize: searchList.pageSize,
      pageChange: (page, pageSize) => {
        this.qryMainTAList(page, pageSize);
      },
    };
    const tableOpts = {
      pagination: false,
      footer: () => <PaginationComp {...pageOpts} />,
    };
    const myFileProps = {
      contractFileList,
      contractFileUploading,
      onHandleContractFileChange: this.onHandleContractFileChange,
      onHandleDelContactFile: this.onHandleDelContactFile,
    };
    const contractHisModalBody = (
      <React.Fragment>
        {String(hisActiveKey) === '1' && (
          <UploadContractHistoryComp viewId="contractHisModalView" />
        )}
        {String(hisActiveKey) === '2' && <StateChangeHistoryComp viewId="contractHisModalView" />}
      </React.Fragment>
    );
    const contractHisModalHtml = (
      <div>
        <MobileTabs
          tabs={[
            { title: formatMessage({ id: 'TA_CONTRACT_UPLOAD_HISTORY' }) },
            { title: formatMessage({ id: 'TA_STATE_CHANGE_HISTORY' }) },
          ]}
          initialPage={0}
          // onChange={(tab, index) => this.onHandleHisModalTab(index)}
          renderTab={tab => (
            <span style={{ overflowX: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {tab.title}
            </span>
          )}
          id="contractHisModalView"
        >
          <div style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
            <UploadContractHistoryComp viewId="contractHisModalView" />
          </div>
          <div style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
            <StateChangeHistoryComp viewId="contractHisModalView" />
          </div>
        </MobileTabs>
      </div>
    );
    const modalOpts = {
      title: formatMessage({ id: 'TA_HISTORY' }),
      visible: contractHisModalVisible,
      onCancel: () => this.handleHisModalCancel(),
      footer: null,
    };
    const taRowSelection = {
      selectedRowKeys: taSelectedRowKeys,
      onChange: this.onTaSelectChange,
    };
    return (
      <Col span={24}>
        <Button
          onClick={() => this.grantTa(taSelectedRowKeys)}
          disabled={taSelectedRowKeys.length === 0}
        >
          {formatMessage({ id: 'GRANT' })}
        </Button>
        <Table
          style={{ marginTop: 10 }}
          size="small"
          className={`tabs-no-padding ${styles.searchTitle}`}
          columns={this.getColumns()}
          rowKey={record => record.taId}
          dataSource={mainTAList}
          loading={qryTaTableLoading}
          scroll={{ x: 660 }}
          rowSelection={taRowSelection}
          {...tableOpts}
        />
        <Modal
          title={formatMessage({ id: 'TA_UPLOAD_CONTRACT' })}
          visible={modalVisible}
          onOk={this.handleModalOk}
          confirmLoading={contractFileUploading}
          onCancel={this.handleModalCancel}
          footer={[
            <Button key="back" loading={contractFileUploading} onClick={this.handleModalCancel}>
              {formatMessage({ id: 'COMMON_CANCEL' })}
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={contractFileUploading}
              onClick={this.handleModalOk}
            >
              {formatMessage({ id: 'COMMON_OK' })}
            </Button>,
          ]}
        >
          <UploadContractComp {...myFileProps} />
        </Modal>
        {contractHisModalVisible && (
          <React.Fragment>
            <MediaQuery
              maxWidth={SCREEN.screenMdMax}
              minWidth={SCREEN.screenSmMin}
              maxHeight={SCREEN.screenXsMax}
            >
              <MobileModal modalOpts={modalOpts}>{contractHisModalHtml}</MobileModal>
            </MediaQuery>
            <MediaQuery
              maxWidth={SCREEN.screenMdMax}
              minWidth={SCREEN.screenSmMin}
              minHeight={SCREEN.screenSmMin}
            >
              <Modal
                title={
                  <Tabs
                    className={styles.hisTabDiv}
                    defaultActiveKey={hisActiveKey || '1'}
                    onChange={key => this.onHandleHisModalTab(key)}
                  >
                    <Tabs.TabPane
                      tab={formatMessage({ id: 'TA_CONTRACT_UPLOAD_HISTORY' })}
                      key="1"
                    />
                    <Tabs.TabPane tab={formatMessage({ id: 'TA_STATE_CHANGE_HISTORY' })} key="2" />
                  </Tabs>
                }
                visible={contractHisModalVisible}
                onCancel={this.handleHisModalCancel}
                footer={null}
                className={styles.contractHisModal}
                width="700px"
                bodyStyle={{
                  height: '450px',
                  overflowY: 'auto',
                  padding: '8px 16px',
                }}
                id="contractHisModalView"
              >
                {contractHisModalBody}
              </Modal>
            </MediaQuery>
            <MediaQuery minWidth={SCREEN.screenLgMin}>
              <Modal
                title={
                  <Tabs
                    className={styles.hisTabDiv}
                    defaultActiveKey={hisActiveKey || '1'}
                    onChange={key => this.onHandleHisModalTab(key)}
                  >
                    <Tabs.TabPane
                      tab={formatMessage({ id: 'TA_CONTRACT_UPLOAD_HISTORY' })}
                      key="1"
                    />
                    <Tabs.TabPane tab={formatMessage({ id: 'TA_STATE_CHANGE_HISTORY' })} key="2" />
                  </Tabs>
                }
                visible={contractHisModalVisible}
                onCancel={this.handleHisModalCancel}
                footer={null}
                className={styles.contractHisModal}
                width="700px"
                bodyStyle={{
                  height: '450px',
                  overflowY: 'auto',
                  padding: '8px 16px',
                }}
                id="contractHisModalView"
              >
                {contractHisModalBody}
              </Modal>
            </MediaQuery>
            <MediaQuery maxWidth={SCREEN.screenXsMax}>
              <MobileModal modalOpts={modalOpts}>{contractHisModalHtml}</MobileModal>
            </MediaQuery>
          </React.Fragment>
        )}
      </Col>
    );
  }
}

export default TableComp;
