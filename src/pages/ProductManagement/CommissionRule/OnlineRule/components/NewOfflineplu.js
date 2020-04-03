import React from 'react';
import { Button, Divider, Col, Form, Row, Table, Tooltip, Icon } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { router } from 'umi';
import styles from '../New/index.less';
import AddOfflinePLUModal from './AddOfflinePLUModal';

@Form.create()
@connect(({ commissionNew }) => ({
  commissionNew,
}))
class NewOfflineplu extends React.PureComponent {
  columns = [
    {
      title: formatMessage({ id: 'PLU_CODE' }),
      dataIndex: 'commodityCode',
    },
    {
      title: formatMessage({ id: 'THEME_PARK' }),
      dataIndex: 'themeParkCode',
    },
    {
      title: formatMessage({ id: 'OPERATION' }),
      dataIndex: 'operation',
      render: (text, record) => {
        return record && record.key && record.key !== 'addOption' ? (
          <div>
            <Tooltip title={formatMessage({ id: 'COMMON_DELETE' })}>
              <Icon
                type="delete"
                onClick={() => {
                  this.delete(record);
                }}
              />
            </Tooltip>
          </div>
        ) : null;
      },
    },
  ];

  delete = record => {
    const {
      commissionNew: { checkedList },
      dispatch,
    } = this.props;
    const filterCheckedList = checkedList.filter(item => {
      const { commoditySpecId } = item;
      return commoditySpecId !== record.commoditySpecId;
    });
    dispatch({
      type: 'commissionNew/save',
      payload: {
        checkedList: filterCheckedList,
      },
    });
  };

  add = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'commissionNew/save',
      payload: {
        addPLUModal: true,
      },
    });
  };

  handleOk = () => {
    const { handleOk } = this.props;
    handleOk();
  };

  cancel = () => {
    router.push({
      pathname: '/ProductManagement/CommissionRule/OnlineRule',
    });
  };

  render() {
    const {
      type,
      commissionNew: { addPLUModal, checkedList },
    } = this.props;

    const btnStyle = {
      marginTop: type === 'BINDING' ? '100px' : '',
    };

    return (
      <div style={{ padding: '15px 0' }}>
        <Row>
          <Col className={styles.DetailTitle}>{formatMessage({ id: 'OFFLINE_PLU' })}</Col>
        </Row>
        <Row>
          <Col span={24}>
            <Table
              size="small"
              columns={this.columns}
              rowKey={record => record.commoditySpecId}
              className={`tabs-no-padding ${styles.searchTitle}`}
              pagination={false}
              dataSource={[
                {
                  key: 'addOption',
                  commodityCode: <a onClick={this.add}>+ Add</a>,
                  themeParkCode: ' ',
                  operation: '',
                },
                ...checkedList,
              ]}
            />
          </Col>
        </Row>
        {addPLUModal ? <AddOfflinePLUModal /> : null}
        <Divider style={{ marginTop: 100 }} />
        <Row style={btnStyle}>
          <Col style={{ textAlign: 'right', padding: '10px 15px' }}>
            <Button onClick={this.cancel}>{formatMessage({ id: 'COMMON_CANCEL' })}</Button>
            <Button type="primary" style={{ marginLeft: '10px' }} onClick={this.handleOk}>
              {formatMessage({ id: 'COMMON_OK' })}
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default NewOfflineplu;
