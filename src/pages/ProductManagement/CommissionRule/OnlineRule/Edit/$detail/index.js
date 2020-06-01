import React from 'react';
import MediaQuery from 'react-responsive';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Card, Form, message, Spin } from 'antd';
import { router } from 'umi';
import SCREEN from '@/utils/screen';
import NewCommission from '../../components/NewCommission';
import NewBinding from '../../components/NewBinding';
import BreadcrumbCompForPams from '@/components/BreadcrumbComp/BreadcurmbCompForPams';
import { commonConfirm } from '@/components/CommonModal';

@Form.create()
@connect(({ commissionNew, detail, loading }) => ({
  commissionNew,
  detail,
  loading: loading.effects['commissionNew/edit'],
}))
class onlineEdit extends React.PureComponent {
  refForm = null;

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'commissionNew/clean',
    });
  }

  onClose = () => {
    router.push({
      pathname: '/ProductManagement/CommissionRule/OnlineRule',
    });
  };

  handleOk = async () => {
    const {
      dispatch,
      detail: { tieredList },
      commissionNew: { checkedList, checkedOnlineList },
      location: {
        query: { tplId },
      },
    } = this.props;
    this.refForm.validateFields((err, values) => {
      if (err) {
        return;
      }
      if (tieredList.length === 0) {
        message.warning('Key in at least one commission tier.');
        return;
      }
      const isExist = tieredList.find(({ type }) => type === 'ADD_ROW');
      const isExist2 = tieredList.find(item => item.EDIT_ROW === true);
      if (isExist2) {
        message.warning(formatMessage({ id: 'PLEASE_END_THE_CURRENT_EDIT_FIRST' }));
        return false;
      }
      if (isExist !== undefined) {
        message.warning(formatMessage({ id: 'PLEASE_ADD_THE_CURRENT_EDIT_FIRST' }));
        return false;
      }
      if (checkedList.length === 0 && checkedOnlineList.length === 0) {
        message.warning('Select at least one online offer or one offline plu.');
        return false;
      }
      let effectiveDate = null;
      let expiryDate = null;
      commonConfirm({
        content: 'Confirm to Modify ?',
        onOk: () => {
          Object.keys(values).forEach(k => {
            const value = values[k];
            if (k === 'commissionType' && Array.isArray(value)) {
              values[k] = value.join();
            } else if (k === 'effectiveDate' && value) {
              values[k] = value ? value.format('YYYY-MM-DD') : '';
            } else if (k === 'expiryDate' && value) {
              values[k] = value ? value.format('YYYY-MM-DD') : '';
            } else if (k === 'effectivePeriod' && value) {
              effectiveDate = value[0].format('YYYY-MM-DD');
              expiryDate = value[1].format('YYYY-MM-DD');
            } else if (k === 'commissionScheme') {
              if (values[k] === 'Percentage') {
                if (tieredList && tieredList.length > 0) {
                  tieredList.map(v => {
                    const num = v.commissionValue;
                    const x = String(num).indexOf('.') + 1;
                    const y = String(num).length - x;
                    if (y === 1) {
                      Object.assign(v, {
                        commissionValue: parseFloat(v.commissionValue / 100).toFixed(3) || '',
                      });
                      return v;
                    }
                    if (y === 2) {
                      Object.assign(v, {
                        commissionValue: parseFloat(v.commissionValue / 100).toFixed(4) || '',
                      });
                      return v;
                    }
                    if (y <= 0) {
                      Object.assign(v, {
                        commissionValue: parseFloat(v.commissionValue / 100) || '',
                      });
                    }
                    return v;
                  });
                }
              }
            }
          });
          const params = {
            ...values,
            effectiveDate,
            expiryDate,
          };
          for (let i = 0; i < tieredList.length; i += 1) {
            tieredList[i].tplId = tplId;
          }
          dispatch({
            type: 'commissionNew/edit',
            payload: {
              params,
              tieredList,
              commodityList: [...checkedList, ...checkedOnlineList],
              tplId,
              usageScope: 'Common',
            },
          }).then(resultCode => {
            if (resultCode === '0') {
              message.success('Modified successfully.');
              this.onClose();
            }
          });
        },
      });
    });
  };

  render() {
    const {
      loading,
      location: {
        query: { type, tplId },
      },
    } = this.props;

    const title = [
      {
        name: formatMessage({ id: 'PRODUCT_MANAGEMENT' }),
      },
      {
        name: formatMessage({ id: 'COMMISSION_RULE_TITLE' }),
      },
      {
        name: formatMessage({ id: 'ONLINE_FIXED_COMMISSION' }),
        href: '#/ProductManagement/CommissionRule/OnlineRule',
      },
      {
        name:
          type && type === 'edit'
            ? formatMessage({ id: 'COMMON_MODIFY' })
            : formatMessage({ id: 'COMMON_NEW' }),
      },
    ];

    return (
      <Spin spinning={!!loading}>
        <MediaQuery minWidth={SCREEN.screenSm}>
          <BreadcrumbCompForPams title={title} />
        </MediaQuery>
        <Card>
          <NewCommission
            tplId={tplId}
            type={type}
            ref={el => {
              this.refForm = el;
            }}
          />
          <NewBinding tplId={tplId} type={type} handleOk={this.handleOk} />
        </Card>
      </Spin>
    );
  }
}

export default onlineEdit;
