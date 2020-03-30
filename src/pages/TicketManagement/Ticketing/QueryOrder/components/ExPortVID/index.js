import React from 'react';
import { formatMessage } from 'umi/locale';
import { Button, Drawer, message, Table, Tooltip } from 'antd';
import { connect } from 'dva';
import styles from './index.less';

@connect(({ exportVIDMgr, loading }) => ({
  exportVIDMgr,
  pageLoading: loading.effects['exportVIDMgr/queryVIDList'],
}))
class ExportVID extends React.Component {
  columns = [
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'NO' })}</span>,
      dataIndex: 'vidNo',
      key: 'vidNo',
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
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span className={styles.tableSpan}>{text}</span>
        </Tooltip>
      ),
    },
  ];

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'exportVIDMgr/resetData',
    });
  }

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
      type: 'queryOrderMgr/downloadETicket',
      payload: {
        forderNo: bookingNo,
      },
    }).then(resultCode => {
      if (resultCode === '0') {
        message.success('Exported successfully.');
      } else {
        message.warning(resultCode);
      }
    });
  };

  render() {
    const {
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
        width={500}
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
          loading={!!pageLoading}
          style={{ marginTop: 10 }}
          columns={this.columns}
          dataSource={vidList}
          pagination={false}
          bordered={false}
        />
        <div className={styles.operateButtonDivStyle}>
          <Button style={{ marginRight: 8 }} onClick={() => this.onClose()}>
            {formatMessage({ id: 'CANCEL' })}
          </Button>
          <Button onClick={() => this.exportVid(bookingNo)} type="primary">
            {formatMessage({ id: 'EXPORT' })}
          </Button>
        </div>
      </Drawer>
    );
  }
}

export default ExportVID;
