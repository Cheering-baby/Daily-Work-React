import React from 'react';
import { Col, Form, Transfer } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import detailStyles from '../New/index.less';

@Form.create()
@connect(({}) => ({}))
class BindingTA extends React.PureComponent {
  componentDidMount() {}

  render() {
    const {} = this.props;

    return (
      <Col lg={24} md={24} id="tiredCommissionNew">
        <div>
          <div className="title-header" style={{ padding: '16px' }}>
            <span>{formatMessage({ id: 'BINDING_TA' })}</span>
          </div>
          <div>
            <Transfer
              // dataSource={this.state.mockData}
              showSearch
              className={detailStyles.transferStyle}
            />
          </div>
        </div>
      </Col>
    );
  }
}
export default BindingTA;
