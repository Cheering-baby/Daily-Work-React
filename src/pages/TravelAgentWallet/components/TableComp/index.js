import React, { PureComponent } from 'react';
import { Badge, Button, Col, Icon, message, Modal, Row, Table, Tabs, Tooltip } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import PaginationComp from '@/components/PaginationComp';
import styles from './index.less';
import { isNvl } from '@/utils/utils';
import router from "umi/router";

const mapStateToProps = store => {
  const {
    searchForm,
    searchList = {},
    mainTAList = [],
    qryTaTableLoading,
  } = store.travelAgentWalletMgr;
  return {
    searchForm,
    searchList,
    mainTAList,
    qryTaTableLoading,
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
          return (
            <Tooltip placement="top" title={formatMessage({ id: 'VIEW_WALLET' })}>
              <Icon
                type="wallet"
                onClick={()=>{
                  router.push({
                    pathname: `/TravelAgentWallet/Wallet`,
                    query: { taId: record.taId },
                  });
                }}
              />
            </Tooltip>
          );
        },
      },
    ];
  };

  qryMainTAList = (currentPage, pageSize) => {
    const { dispatch, searchForm, searchList } = this.props;
    dispatch({
      type: 'travelAgentWalletMgr/fetchQryMainTAList',
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

  render() {
    const {
      height = 660,
      searchList,
      mainTAList,
      qryTaTableLoading,
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

    return (
      <Col span={24}>
        <Table
          style={{ marginBottom: -15 }}
          size="small"
          className={`tabs-no-padding ${styles.searchTitle}`}
          columns={this.getColumns()}
          rowKey={record => record.taId}
          dataSource={mainTAList}
          loading={qryTaTableLoading}
          scroll={{ x: 660, y:height }}
          {...tableOpts}
        />
      </Col>
    );
  }
}

export default TableComp;
