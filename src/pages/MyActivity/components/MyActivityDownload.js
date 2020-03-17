import React from 'react';
import { formatMessage } from 'umi/locale';
import { Table } from 'antd';
import { connect } from 'dva';
import CommonModal from '@/components/CommonModal';
import detailStyles from '../index.less';

let isMyActivity = true;

@connect(({ myActivityDownload }) => ({
  myActivityDownload,
}))
class MyActivityDownload extends React.PureComponent {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: formatMessage({ id: 'DOWNLOAD_FILES' }),
        dataIndex: 'No',
        key: 'No',
      },
    ];
  }

  componentDidMount() {
    isMyActivity = true;
    const { dispatch, record } = this.props;
    dispatch({
      type: 'myActivityDownload/save',
      payload: {
        isMyActivityPage: true,
      },
    });
    dispatch({
      type: 'myActivityDownload/contractHistoryList',
      payload: {
        isMyActivityPage: true,
      },
    });
    dispatch({
      type: 'myActivityDownload/taInfo',
      payload: {
        taId: record ? record.businessId : '',
      },
    }).then(() => {
      const {
        myActivityDownload: { fileList },
      } = this.props;
      let fileName = '';
      let filePath = '';
      fileList.forEach(item => {
        fileName = item.name;
        filePath = item.path;
      });
      dispatch({
        type: 'myActivityDownload/downloadFile',
        payload: {
          fileName,
          filePath,
        },
      });
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    if (isMyActivity) {
      dispatch({
        type: 'myActivityDownload/resetModel',
        payload: {},
      });
    }
  }

  render() {
    const rowSelection = {
      // onChange: (selectedRowKeys, selectedRows) => {
      //   // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      // },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };
    const { type, ...modalProps } = this.props;
    const modalOpts = {
      ...modalProps,
      width: 674,
      className: detailStyles.downloadBox,
      onOk: () => {
        // this.handleOk(e);
      },
    };
    return (
      <CommonModal modalOpts={modalOpts}>
        <div className={detailStyles.downloadFontStyle}>
          <span>{formatMessage({ id: 'MYACTIVITY_REGISTRATION_DOCS' })}</span>
        </div>
        <Table
          style={{ marginTop: 10 }}
          bordered={false}
          size="small"
          rowSelection={rowSelection}
          columns={this.columns}
          // dataSource={fileList}
          pagination={false}
          // loading={loading}
        />
        <div className={detailStyles.downloadFontStyle2}>
          <span>{formatMessage({ id: 'MYACTIVITY_AR_CREDIT_LIMIT' })}</span>
        </div>
        <Table
          style={{ marginTop: 10 }}
          bordered={false}
          size="small"
          rowSelection={rowSelection}
          columns={this.columns}
          // dataSource={dataSource}
          pagination={false}
          // loading={loading}
        />
      </CommonModal>
    );
  }
}

export default MyActivityDownload;
