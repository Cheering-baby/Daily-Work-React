import React from 'react';
import { formatMessage } from 'umi/locale';
import { Button, Drawer, Table, Tooltip } from 'antd';
import { connect } from 'dva';
import styles from './index.less';

@connect(({ exportVIDMgr, loading }) => ({
  exportVIDMgr,
  tableLoading: loading.effects['exportVIDMgr/queryVIDList'],
  pageLoading: loading.effects['exportVIDMgr/downloadETicket'],
}))
class ExportVID extends React.Component {
  columns = [
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'NO' })}</span>,
      dataIndex: 'vidNo',
      width: '6%',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span className={styles.tableSpan}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'VID_CODE' })}</span>,
      dataIndex: 'vidCode',
      width: '20%',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span className={styles.tableSpan}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'OFFER_NAME' })}</span>,
      dataIndex: 'offerName',
      width: '20%',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span className={styles.tableSpan}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'STATUS' })}</span>,
      dataIndex: 'status',
      width: '8%',
      render: (text, record) => {
        let status = text;
        const { hadRefunded } = record;
        if (text === 'false' && hadRefunded !== 'Yes') {
          status = 'VALID';
        } else {
          status = 'INVALID';
        }
        return (
          <div>
            <div
              className={styles.statusRadiusStyle}
              style={{ background: `${this.setStatusColor(text, hadRefunded)}` }}
            />
            <Tooltip
              placement="topLeft"
              title={<span style={{ whiteSpace: 'pre-wrap' }}>{status}</span>}
            >
              <span className={styles.tableSpan}>{status}</span>
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'THEME_PARK' })}</span>,
      width: '15%',
      dataIndex: 'themePark',
      render: text => this.showThemePark(text),
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'CATEGORY' })}</span>,
      width: '8%',
      dataIndex: 'ticketGroup',
      render: (text, row) => {
        if (row.ticketType === 'Voucher') {
          return '';
        }
        if (text !== null) {
          return (
            <Tooltip
              placement="topLeft"
              title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}
            >
              <span className={styles.tableSpan}>{text}</span>
            </Tooltip>
          );
        }
        return (
          <Tooltip
            placement="topLeft"
            title={<span style={{ whiteSpace: 'pre-wrap' }}>General</span>}
          >
            <span className={styles.tableSpan}>General</span>
          </Tooltip>
        );
      },
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'VID_TYPE' })}</span>,
      dataIndex: 'ticketType',
      width: '8%',
      render: text => {
        if (text === 'Voucher') {
          return text;
        }
        if (text !== 'Voucher') {
          return 'Ticket';
        }
      },
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'BLACKOUT_DAY' })}</span>,
      dataIndex: 'blackOutDay',
      render: (text = []) => {
        const textShow = text.join(', ');
        if (text.length === 0) {
          return '-';
        }
        return (
          <Tooltip
            placement="top"
            title={
              <span style={{ whiteSpace: 'pre-wrap' }}>{textShow.replace(/,/g, '$&\r\n')}</span>
            }
          >
            <span className={styles.tableSpan}>{textShow}</span>
          </Tooltip>
        );
      },
    },
  ];

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'exportVIDMgr/resetData',
    });
  }

  setStatusColor = (status, hadRefunded) => {
    if (status === 'false' && hadRefunded !== 'Yes') {
      return '#40C940';
    }
    return '#C0C0C0';
  };

  showThemePark = text => {
    const {
      exportVIDMgr: { themeParkList = [] },
    } = this.props;
    for (let i = 0; i < themeParkList.length; i += 1) {
      if (themeParkList[i].bookingCategoryCode === text) {
        return (
          <Tooltip
            placement="topLeft"
            title={
              <span style={{ whiteSpace: 'pre-wrap' }}>{themeParkList[i].bookingCategoryName}</span>
            }
          >
            <span>{themeParkList[i].bookingCategoryName}</span>
          </Tooltip>
        );
      }
    }
  };

  onClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'exportVIDMgr/effectSave',
      payload: {
        exportVIDVisible: false,
      },
    }).then(() => {
      setTimeout(() => {
        dispatch({
          type: 'exportVIDMgr/resetData',
        });
      }, 500);
    });
  };

  exportVid = bookingNo => {
    const { dispatch } = this.props;
    dispatch({
      type: 'exportVIDMgr/downloadETicket',
      payload: {
        forderNo: bookingNo,
      },
    }).then(() => {
      this.onClose();
    });
  };

  render() {
    const {
      tableLoading,
      pageLoading,
      exportVIDMgr: {
        exportVIDVisible,
        vidList,
        searchList: { bookingNo },
        downloadFileLoading = false,
      },
    } = this.props;

    return (
      <Drawer
        title={
          <span className={styles.drawerTitleStyle}>{formatMessage({ id: 'VIEW_VID_TITLE' })}</span>
        }
        className={styles.drawerStyle}
        getContainer={false}
        placement="right"
        closable={false}
        onClose={this.onClose}
        visible={exportVIDVisible}
        maskClosable={false}
      >
        <div>
          <span className={styles.drawerTitleStyle}>{formatMessage({ id: 'VID_LIST_TITLE' })}</span>
        </div>
        <Table
          size="small"
          loading={!!tableLoading}
          style={{ marginTop: 10, marginBottom: 60 }}
          columns={this.columns}
          dataSource={vidList}
          pagination={false}
          bordered={false}
          scroll={{ x: 1000 }}
        />
        <div className={styles.operateButtonDivStyle}>
          <Button style={{ marginRight: 8 }} onClick={() => this.onClose()}>
            {formatMessage({ id: 'CANCEL' })}
          </Button>
          <Button
            style={{ width: 70 }}
            loading={downloadFileLoading}
            onClick={() => this.exportVid(bookingNo)}
            type="primary"
          >
            {!pageLoading ? formatMessage({ id: 'EXPORT' }) : null}
          </Button>
        </div>
      </Drawer>
    );
  }
}

export default ExportVID;
