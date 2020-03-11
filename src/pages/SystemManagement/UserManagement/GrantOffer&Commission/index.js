import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Transfer } from 'antd';
import { formatMessage } from 'umi/locale';
import detailStyles from './index.less';

@Form.create()
// @connect(({}) => ({}))
class AddOfferToCommissionName extends Component {
  state = {
    mockData: [],
    targetKeys: [],
  };

  // componentDidMount() {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'underRule/fetchUnderRule',
  //     payload: {},
  //   });
  // }

  getMock = () => {
    const targetKeys = [];
    const mockData = [];
    for (let i = 0; i < 20; i++) {
      const data = {
        key: i.toString(),
        title: `content${i + 1}`,
        description: `description of content${i + 1}`,
        chosen: Math.random() * 2 > 1,
      };
      if (data.chosen) {
        targetKeys.push(data.key);
      }
      mockData.push(data);
    }
    this.setState({ mockData, targetKeys });
  };

  render() {
    const { type, ...modalProps } = this.props;
    const modalOpts = {
      ...modalProps,
      width: 1083,
      // onOk: e => {
      //   // this.handleOk(e);
      // },
    };

    return (
      <div className="has-shadow no-border">
        <div className="title-header" style={{ padding: 16 }}>
          {formatMessage({ id: 'GRANT_OFFER' })}
        </div>
        <Form className={detailStyles.formStyle}>
          <Transfer
            dataSource={this.state.mockData}
            showSearch
            className={detailStyles.transferStyle}
          />
        </Form>
      </div>
    );
  }
}

export default AddOfferToCommissionName;
