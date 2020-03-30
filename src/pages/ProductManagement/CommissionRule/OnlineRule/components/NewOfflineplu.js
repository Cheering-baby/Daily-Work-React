import React, { Fragment } from 'react';
import { Button, Divider, Col, Form, Row, Table } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
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
      key: 'code',
      dataIndex: 'code',
    },
    {
      title: formatMessage({ id: 'THEME_PARK' }),
      key: 'thepark',
      dataIndex: 'thepark',
    },
    {
      title: formatMessage({ id: 'PLU_DESCRIPTION' }),
      key: 'operation',
      dataIndex: 'operation',
    },
  ];

  add = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'commissionNew/save',
      payload: {
        addPLUModal: true,
      },
    });
  };

  render() {
    const {
      type,
      commissionNew: { addPLUModal },
    } = this.props;
    const btnStyle = {
      marginTop: type === 'BINDING' ? '100px' : '',
    };

    return (
      <Fragment>
        <Form onSubmit={this.commit}>
          <div style={{ padding: '0 15px' }}>
            <Row>
              <Col className={styles.DetailTitle}>{formatMessage({ id: 'OFFLINE_PLU' })}</Col>
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
                      code: <a onClick={() => this.add()}>+ Add</a>,
                      thepark: ' ',
                      operation: '',
                    },
                  ]}
                />
              </Col>
            </Row>
            {addPLUModal ? <AddOfflinePLUModal /> : null}
            <Divider style={{ margin: 0 }} />
            <Row style={btnStyle}>
              <Col style={{ textAlign: 'right', padding: '10px 15px' }}>
                <Button>{formatMessage({ id: 'COMMON_CANCEL' })}</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  // loading={addLoading || modifyLoading}
                  style={{ marginLeft: '10px' }}
                >
                  {formatMessage({ id: 'COMMON_OK' })}
                </Button>
              </Col>
            </Row>
          </div>
        </Form>
      </Fragment>
    );
  }
}

export default NewOfflineplu;
