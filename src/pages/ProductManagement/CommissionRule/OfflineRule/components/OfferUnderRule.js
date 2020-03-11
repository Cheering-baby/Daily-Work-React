import React from 'react';
import { Col, Form, Transfer } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import detailStyles from '../New/index.less';

@Form.create()
// @connect(({}) => ({}))
class OfferUnderRule extends React.PureComponent {
  componentDidMount() {}

  render() {
    const {} = this.props;

    return (
      <Col lg={24} md={24}>
        <div style={{ padding: '16px 0 0 16px' }}>
          <span className="detail-title">{formatMessage({ id: 'OFFER_UNDER_RULE' })}</span>
        </div>
        <div>
          <Transfer
            // dataSource={this.state.mockData}
            showSearch
            className={detailStyles.transferStyle}
          />
        </div>
      </Col>
    );
  }
}
export default OfferUnderRule;
