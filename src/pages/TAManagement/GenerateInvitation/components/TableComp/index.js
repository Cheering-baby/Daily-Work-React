import React, { PureComponent } from 'react';
import { Badge, Button, Col, Table } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import PaginationComp from '../PaginationComp';
import styles from './index.less';
import { isNvl } from '@/utils/utils';

const mapStateToProps = store => {
  const {
    taId = null,
    searchList,
    searchForm,
    invitationList,
    statusList,
    qryInvitationTableLoading,
    invitationVisible,
  } = store.generateInvitation;
  return {
    taId,
    searchList,
    searchForm,
    invitationList,
    statusList,
    qryInvitationTableLoading,
    invitationVisible,
  };
};

@connect(mapStateToProps)
class TableComp extends PureComponent {
  getColumns = () => {
    return [
      {
        title: formatMessage({ id: 'GI_TABLE_NO' }),
        dataIndex: 'number',
        render: text => {
          return !isNvl(text) ? text : '-';
        },
      },
      {
        title: formatMessage({ id: 'GI_TABLE_EMAIL_ADDRESS' }),
        dataIndex: 'email',
        render: text => {
          return !isNvl(text) ? text : '-';
        },
      },
      {
        title: formatMessage({ id: 'GI_TABLE_INVITATION_DATE' }),
        dataIndex: 'invitationDate',
        render: text => {
          return !isNvl(text) ? moment(text, 'YYYY-MM-DD').format('DD-MMM-YYYY') : '-';
        },
      },
      {
        title: formatMessage({ id: 'GI_TABLE_STATUS' }),
        dataIndex: 'statusName',
        render: text => {
          let statusStr = 'default';
          let statusTxt = '';
          switch (`${text}`.toLowerCase()) {
            case 'fail':
              statusStr = 'error';
              statusTxt = formatMessage({ id: 'GI_TABLE_STATUS_ERROR' });
              break;
            case 'success':
              statusStr = 'success';
              statusTxt = formatMessage({ id: 'GI_TABLE_STATUS_SUCCESS' });
              break;
            default:
              statusStr = 'default';
              statusTxt = formatMessage({ id: 'GI_TABLE_STATUS_DEFAULT' });
              break;
          }
          return <Badge status={statusStr} text={statusTxt || null} />;
        },
      },
    ];
  };

  showDrawer = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'generateInvitation/save',
      payload: {
        emailList: [],
        invitationVisible: true,
      },
    });
  };

  render() {
    const { searchList, invitationList = [], qryInvitationTableLoading = false } = this.props;
    const pageOpts = {
      total: searchList.total,
      current: searchList.currentPage,
      pageSize: searchList.pageSize,
      pageChange: (page, pageSize) => {
        const { dispatch, taId, searchForm } = this.props;
        dispatch({
          type: 'generateInvitation/fetchQryInvitationRecordList',
          payload: {
            taId,
            email: searchForm.email || null,
            invitationStartDate: searchForm.invitationStartDate || null,
            invitationEndDate: searchForm.invitationEndDate || null,
            status: searchForm.status || null,
            pageInfo: {
              totalSize: searchList.total,
              currentPage: page,
              pageSize,
            },
          },
        });
      },
    };
    const tableOpts = {
      pagination: false,
      footer: () => <PaginationComp {...pageOpts} />,
    };
    return (
      <Col span={24}>
        <div className={styles.tableOperations}>
          <Button type="primary" onClick={this.showDrawer}>
            {formatMessage({ id: 'GI_BTN_INVITATION' })}
          </Button>
        </div>
        <Table
          size="small"
          className={`tabs-no-padding ${styles.searchTitle}`}
          columns={this.getColumns()}
          rowKey={record => `invitationList_${record.number}`}
          dataSource={invitationList}
          loading={qryInvitationTableLoading}
          scroll={{ x: 660 }}
          {...tableOpts}
        />
      </Col>
    );
  }
}

export default TableComp;
