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

  add = () => {
    const { dispatch } = this.props;
    this.refForm.validateFields((err, values) => {
      if (
        values.commissionName === undefined ||
        values.commissionName === '' ||
        values.effectiveDate === undefined ||
        values.effectiveDate === null ||
        values.expiryDate === undefined ||
        values.expiryDate === null
      ) {
        message.warning(
          'Please fill in basic commission rule information, such as name, effective period, commission type.'
        );
      } else {
        dispatch({
          type: 'commissionNew/save',
          payload: {
            addBindingModal: true,
          },
        });
      }
    });
  };

  addOffline = () => {
    const { dispatch } = this.props;
    this.refForm.validateFields((err, values) => {
      if (
        values.commissionName === undefined ||
        values.commissionName === '' ||
        values.effectiveDate === undefined ||
        values.effectiveDate === null ||
        values.expiryDate === undefined ||
        values.expiryDate === null
      ) {
        message.warning(
          'Please fill in basic commission rule information, such as name, effective period, commission type.'
        );
      } else {
        dispatch({
          type: 'commissionNew/save',
          payload: {
            addPLUModal: true,
          },
        });
      }
    });
  };

  handleOk = async () => {
    const {
      dispatch,
      detail: {
        tieredList,
        commisssionList: { taFilterList },
      },
      commissionNew: {
        checkedList,
        checkedOnlineList,
        excludedTA: { excludedTAList },
      },
      location: {
        query: { tplId, tplVersion },
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
      // const effectiveDate = null;
      // const expiryDate = null;
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
            } else if (k === 'commissionScheme') {
              if (values[k] === 'Percentage') {
                if (tieredList && tieredList.length > 0) {
                  tieredList.map(v => {
                    const num = v.commissionValue;
                    const x = String(num).indexOf('.') + 1;
                    const y = String(num).length - x;
                    if (y === 1 && +num !== 0) {
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

          // taFilterList
          const operationTaFilterList = [];
          const excludedTAListId = excludedTAList.map(i => i.taId);
          const taFilterListId = taFilterList.map(i => i.taId);
          taFilterList.forEach(i => {
            if (!excludedTAListId.includes(i.taId)) {
              operationTaFilterList.push({
                tplId,
                taId: i.taId,
                operationType: 'D',
              });
            }
          });

          excludedTAList.forEach(i => {
            if (!taFilterListId.includes(i.taId)) {
              operationTaFilterList.push({
                tplId,
                taId: i.taId,
                operationType: 'A',
              });
            }
          });

          const params = {
            ...values,
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
              tplVersion,
              taFilterList: operationTaFilterList,
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
          <NewBinding
            tplId={tplId}
            type={type}
            handleOk={this.handleOk}
            add={this.add}
            addOffline={this.addOffline}
          />
        </Card>
      </Spin>
    );
  }
}

export default onlineEdit;
