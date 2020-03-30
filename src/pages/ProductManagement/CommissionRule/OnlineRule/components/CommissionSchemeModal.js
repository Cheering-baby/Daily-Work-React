import React from 'react';
import { connect } from 'dva';
import { Modal, Row, Col, Button, Icon } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from '../New/index.less';

const drawWidth = 438;
@connect(({ commissionNew }) => ({
  commissionNew,
}))
class AddCommissionSchema extends React.PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'commissionNew/fetchOfferList',
      payload: {},
    });
  }

  cancel = () => {
    const {
      dispatch,
      commissionNew: { commissionSchema },
    } = this.props;
    dispatch({
      type: 'commissionNew/save',
      payload: {
        commissionSchema,
        checked: false,
        addCommissionSchema: false,
      },
    });
  };

  OK = () => {
    const {
      dispatch,
      commissionNew: { commissionSchema },
    } = this.props;
    dispatch({
      type: 'commissionNew/save',
      payload: {
        commissionSchema,
        checked: true,
        addCommissionSchema: false,
      },
    });
  };

  showTotal(total) {
    return <div>Total {total} items</div>;
  }

  render() {
    const {
      commissionNew: { addCommissionSchema, commissionSchema },
    } = this.props;
    return (
      <div>
        <Modal
          maskClosable={false}
          visible={addCommissionSchema}
          width={drawWidth}
          onCancel={this.cancel}
          footer={
            <div>
              <Button style={{ width: 60 }} onClick={this.OK} type="primary">
                OK
              </Button>
              <Button onClick={this.cancel} style={{ width: 60 }} onClick={this.cancel}>
                Cancel
              </Button>
            </div>
          }
        >
          <Row>
            <Col className="gutter-row" span={3}>
              <Icon type="exclamation-circle" style={{ fontSize: '24px' }} />
            </Col>
            <Col className="gutter-row" span={21}>
              <span className={styles.commissionTitle}>Change the Commission Schema?</span>
            </Col>
            <Col className="gutter-row" span={3} />
            <Col className="gutter-row" span={21} style={{ margin: '10px 0 0 50px' }}>
              {commissionSchema === 'commissionAmount' ? (
                <span>{formatMessage({ id: 'CHANGE_COMMISSION_AMOUNT' })}</span>
              ) : (
                <span>{formatMessage({ id: 'CHANGE_PERCENT_AMOUNT' })}</span>
              )}
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }
}
export default AddCommissionSchema;
