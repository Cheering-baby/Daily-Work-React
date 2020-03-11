import React from 'react';
import { Col, Form, Table } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import classNames from 'classnames';
import detailStyles from '../New/index.less';

@Form.create()
@connect(({ offlineNew }) => ({
  offlineNew,
}))
class CommissionRulePLU extends React.PureComponent {
  columns = [
    {
      title: formatMessage({ id: 'PRODUCT_COMMISSION_PLU' }),
      dataIndex: 'tieredCommissionTier',
      key: 'tieredCommissionTier',
      render: (...args) => this.columnRender(...args, 0),
    },
    {
      title: formatMessage({ id: 'PRODUCT_COMMISSION_SCHEME' }),
      dataIndex: 'commissionScheme',
      key: 'commissionScheme',
      render: (...args) => this.columnRender(...args, 1),
    },
    {
      title: formatMessage({ id: 'OPERATION' }),
      dataIndex: 'operation',
      key: 'operation',
      render: (...args) => this.columnRender(...args, 2),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'offlineNew/fetchTieredCommissionRuleList',
      payload: {},
    });
  }

  render() {
    // const {
    //   offlineNew: { commission },
    // } = this.props;

    return (
      <Col lg={24} md={24} id="tiredCommissionNew">
        <div>
          <div className="title-header" style={{ padding: '16px' }}>
            <span>{formatMessage({ id: 'COMMISSION_RULE' })}</span>
            <div style={{ float: 'right', position: 'relative', zIndex: 2 }}>
              <a
                onClick={this.handelAddThemePark}
                className={classNames(detailStyles.aStyle, 'ant-dropdown-link')}
              >
                {formatMessage({ id: 'ADD_THEME_PARK' })}
              </a>
            </div>
          </div>
          <div className={detailStyles.tabsStyle}>
            <Table
              bordered={false}
              size="small"
              // dataSource={offlineList}
              // loading={loading}
              columns={this.columns}
              // className="table-column"
              // onChange={this.handleTableChange}
            />
          </div>
        </div>
      </Col>
    );
  }
}
export default CommissionRulePLU;
