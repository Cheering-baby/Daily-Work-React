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
      key: 'vidNo',
      width: '15%',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span className={styles.tableSpan}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'VID_CODE' })}</span>,
      dataIndex: 'vidCode',
      key: 'vidCode',
      width: '35%',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span className={styles.tableSpan}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'OFFER_NAME' })}</span>,
      dataIndex: 'offerName',
      key: 'offerName',
      width: '25%',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span className={styles.tableSpan}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'STATUS' })}</span>,
      dataIndex: 'status',
      key: 'status',
      width: '25%',
      render: (text, record) => {
        let status = text;
        const { hadRefunded } = record;
        if (text === 'false' && hadRefunded !== 'Yes') {
          status = 'ISSUED';
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
      },
    } = this.props;

    return (
      <Drawer
        title={
          <span className={styles.drawerTitleStyle}>{formatMessage({ id: 'VIEW_VID_TITLE' })}</span>
        }
        className={styles.drawerStyle}
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
          scroll={{ x: 310 }}
        />
        <div className={styles.operateButtonDivStyle}>
          <Button style={{ marginRight: 8 }} onClick={() => this.onClose()}>
            {formatMessage({ id: 'CANCEL' })}
          </Button>
          <Button
            style={{ width: 70 }}
            loading={!!pageLoading}
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
