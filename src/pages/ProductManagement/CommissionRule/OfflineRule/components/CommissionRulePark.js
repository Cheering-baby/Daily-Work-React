import React from 'react';
import { Tabs, Col, Form, Tooltip, Icon, Table, Button, Input, InputNumber } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { cloneDeep } from 'lodash';
import classNames from 'classnames';
import detailStyles from '../New/index.less';

const { TabPane } = Tabs;
const InputGroup = Input.Group;

@Form.create()
@connect(({ offlineNew }) => ({
  offlineNew,
}))
class CommissionRulePark extends React.PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'offlineNew/fetchTieredCommissionRuleList',
      payload: {},
    });
  }

  columnsFactory = idx => {
    const columns = [
      {
        title: formatMessage({ id: 'TIERED_COMMISSION_TIER' }),
        dataIndex: 'tieredCommissionTier',
        key: 'tieredCommissionTier',
        render: (...args) => this.columnRender(...args, 0, idx),
      },
      {
        title: formatMessage({ id: 'PRODUCT_COMMISSION_SCHEME' }),
        dataIndex: 'commissionScheme',
        key: 'commissionScheme',
        render: (...args) => this.columnRender(...args, 1, idx),
      },
      {
        title: formatMessage({ id: 'OPERATION' }),
        dataIndex: 'operation',
        key: 'operation',
        render: (...args) => this.columnRender(...args, 2, idx),
      },
    ];

    return columns;
  };

  columnRender(text, row, index, colIdx, tableIdx) {
    if (row.type === 'ADD_BUTTON') {
      if (colIdx === 0) {
        return {
          children: (
            <Button
              type="link"
              onClick={() => {
                this.addCommissionRule(tableIdx);
              }}
            >
              +Add
            </Button>
          ),
          props: {
            colSpan: 3,
          },
        };
      }
      return {
        children: null,
        props: {
          colSpan: 0,
        },
      };
    }
    if (row.type === 'ADD_ROW') {
      let node = text;
      if (colIdx === 0) {
        node = (
          <InputGroup compact>
            <Input style={{ width: 100, textAlign: 'center' }} placeholder="Minimum" />
            <Input
              style={{
                width: 30,
                borderLeft: 0,
                pointerEvents: 'none',
                backgroundColor: '#fff',
              }}
              placeholder="~"
              disabled
            />
            <Input
              style={{ width: 100, textAlign: 'center', borderLeft: 0 }}
              placeholder="Maximum"
            />
          </InputGroup>
        );
      } else if (colIdx === 1) {
        node = <InputNumber />;
      } else if (colIdx === 2) {
        node = (
          <div>
            <Icon type="check" />
            <Icon
              type="close"
              onClick={() => {
                this.close(tableIdx);
              }}
            />
          </div>
        );
      }

      return node;
    }
    if (colIdx === 2) {
      return (
        <div>
          <Tooltip title={formatMessage({ id: 'COMMON_EDIT' })}>
            <Icon
              type="edit"
              onClick={() => {
                // this.edit(record);
              }}
            />
          </Tooltip>
          <Tooltip title={formatMessage({ id: 'COMMON_DELETE' })}>
            <Icon
              type="delete"
              onClick={() => {
                // this.add();
              }}
            />
          </Tooltip>
        </div>
      );
    }

    return text;
  }

  addCommissionRule = tableIdx => {
    const {
      offlineNew: { commission },
      dispatch,
    } = this.props;
    const arr = cloneDeep(commission);
    const isExist = arr[tableIdx].find(({ type }) => type === 'ADD_ROW');
    if (!isExist) {
      arr[tableIdx].unshift({ type: 'ADD_ROW' });
    }
    dispatch({
      type: 'offlineNew/save',
      payload: {
        commission: arr,
      },
    });
  };

  close = tableIdx => {
    const {
      offlineNew: { commission },
      dispatch,
    } = this.props;
    const arr = cloneDeep(commission);
    arr[tableIdx] = arr[tableIdx].filter(({ type }) => type !== 'ADD_ROW');
    dispatch({
      type: 'offlineNew/save',
      payload: {
        commission: arr,
      },
    });
  };

  handelAddThemePark = () => {
    const {
      offlineNew: { commission },
      dispatch,
    } = this.props;
    console.log(commission, commission.concat([]));
    dispatch({
      type: 'offlineNew/save',
      payload: {
        commission: [...commission, []],
      },
    });
  };

  render() {
    const {
      offlineNew: { commission },
      hasBorder = true,
      detailTitle,
    } = this.props;
    const arr = cloneDeep(commission);
    const tabPanelChild = arr.map((list, idx) => {
      if (!list.find(({ type }) => type === 'ADD_BUTTON')) {
        list.unshift({ type: 'ADD_BUTTON' });
      }
      return (
        <TabPane tab={`Theme Park ${idx + 1}`} key={idx}>
          <Table
            columns={this.columnsFactory(idx)}
            dataSource={list}
            scroll={{ x: 'max-content' }}
          />
        </TabPane>
      );
    });

    return (
      <Col lg={24} md={24} id="tiredCommissionNew">
        <div style={{ paddingLeft: 16 }}>
          <div
            className={classNames({
              'title-header': hasBorder,
              'detail-title': detailTitle,
            })}
          >
            <span>{formatMessage({ id: 'COMMISSION_RULE' })}</span>
            <div style={{ float: 'right', position: 'relative', zIndex: 0.1 }}>
              <a
                onClick={this.handelAddThemePark}
                className={classNames(detailStyles.aStyle, 'ant-dropdown-link')}
              >
                {formatMessage({ id: 'ADD_THEME_PARK' })}
              </a>
            </div>
          </div>
          <div className={detailStyles.tabsStyle}>
            <Tabs type="card">{tabPanelChild}</Tabs>
          </div>
        </div>
      </Col>
    );
  }
}
export default CommissionRulePark;
