import React, { Fragment } from 'react';
import { Col, Form, Row, Table } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import styles from '../New/index.less';
import AddOnlinePLUModal from './AddOnlinePLUModal';

@Form.create()
@connect(({ commissionNew }) => ({
  commissionNew,
}))
class NewOnlineOffer extends React.PureComponent {
  columns = [
    {
      title: formatMessage({ id: 'OFFER_NAME' }),
      dataIndex: 'seqOrder',
    },
    {
      title: formatMessage({ id: 'OFFER_IDENTIFIER' }),
      dataIndex: 'roomTypeCode',
    },
    {
      title: formatMessage({ id: 'OPERATION' }),
      dataIndex: 'operation',
    },
  ];

  add = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'commissionNew/save',
      payload: {
        addBindingModal: true,
      },
    });
  };

  render() {
    const {
      type,
      tplId,
      commissionNew: { addBindingModal },
    } = this.props;
    return (
      <Fragment>
        <Form onSubmit={this.commit}>
          <div style={{ padding: '15px' }}>
            <Row>
              <Col className={styles.commissionTitle}>{formatMessage({ id: 'BINDING' })}</Col>
            </Row>
            <Row>
              <Col className={styles.DetailTitle}>{formatMessage({ id: 'ONLINE_OFFER' })}</Col>
            </Row>
            <Row>
              <Col span={24}>
                <Table
                  size="small"
                  columns={this.columns}
                  className={`tabs-no-padding ${styles.searchTitle}`}
                  pagination={false}
                  dataSource={[
                    {
                      key: 'addOption',
                      seqOrder: <a onClick={() => this.add()}>+ Add</a>,
                      roomTypeCode: ' ',
                      roomTypeName: ' ',
                      operation: '',
                    },
                  ]}
                />
              </Col>
            </Row>
            {addBindingModal ? <AddOnlinePLUModal tplId={tplId} type={type} /> : null}
          </div>
        </Form>
      </Fragment>
    );
  }
}

export default NewOnlineOffer;
