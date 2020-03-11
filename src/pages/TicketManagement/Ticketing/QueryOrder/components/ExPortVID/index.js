import React from 'react';
import {Button, Drawer, Table} from 'antd';
import {connect} from 'dva';
import styles from './index.less';

@connect(({exportVIDMgr, loading}) => ({
  exportVIDMgr,
  pageLoading: loading.effects['exportVIDMgr/queryVIDList'],
}))
class ExportVID extends React.Component {
  columns = [
    {
      title: <span className={styles.tableTitle}>No.</span>,
      dataIndex: 'vidNo',
      key: 'vidNo',
    },
    {
      title: <span className={styles.tableTitle}>VID Code</span>,
      dataIndex: 'vidCode',
      key: 'vidCode',
    },
    {
      title: <span className={styles.tableTitle}>Offer Name</span>,
      dataIndex: 'offerName',
      key: 'offerName',
    },
    {
      title: <span className={styles.tableTitle}>Status</span>,
      dataIndex: 'status',
      key: 'status',
    },
  ];

  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'exportVIDMgr/resetData',
    });
  }

  onClose = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'exportVIDMgr/resetData',
    });
  };

  render() {
    const {
      pageLoading,
      exportVIDMgr: {exportVIDVisible, vidList},
    } = this.props;

    return (
      <Drawer
        title={<span className={styles.drawerTitleStyle}>VIEW VID</span>}
        className={styles.drawerStyle}
        width={500}
        placement="right"
        closable={false}
        onClose={this.onClose}
        visible={exportVIDVisible}
        maskClosable={false}
      >
        <div>
          <span className={styles.drawerTitleStyle}>VID LIST</span>
        </div>
        <Table
          size="small"
          loading={!!pageLoading}
          style={{marginTop: 10}}
          columns={this.columns}
          dataSource={vidList}
          pagination={false}
          bordered={false}
        />
        <div className={styles.operateButtonDivStyle}>
          <Button style={{marginRight: 8}} onClick={() => this.onClose()}>
            Cancel
          </Button>
          <Button
            // onClick={()=>this.onSchedule(selectedOffer, publishSelectTime, unpublishSelectTime)}
            type="primary"
          >
            Export
          </Button>
        </div>
      </Drawer>
    );
  }
}

export default ExportVID;
