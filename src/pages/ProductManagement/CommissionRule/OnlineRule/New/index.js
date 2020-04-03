import React from 'react';
import MediaQuery from 'react-responsive';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Form, Card, message } from 'antd';
import { router } from 'umi';
import SCREEN from '@/utils/screen';
import BreadcrumbComp from '@/components/BreadcrumbComp';
import NewCommission from '../components/NewCommission';
import NewBinding from '../components/NewBinding';
import { commonConfirm } from '@/components/CommonModal';

@Form.create()
@connect(({ commissionNew, detail }) => ({
  commissionNew,
  detail,
}))
class onlineNew extends React.PureComponent {
  refForm = null;

  onClose = () => {
    router.push({
      pathname: '/ProductManagement/CommissionRule/OnlineRule',
    });
  };

  handleOk = async () => {
    const {
      dispatch,
      detail: { tieredList },
      commissionNew: { checkedList },
    } = this.props;
    const resCb = response => {
      this.onClose();
      if (response === 'SUCCESS') {
        message.success('New successfully.');
      } else if (response === 'ERROR') {
        message.error('Failed to New.');
      }
    };
    this.refForm.validateFields((err, values) => {
      if (err) {
      } else {
        commonConfirm({
          content: `Confirm to New?`,
          onOk: () => {
            Object.keys(values).forEach(k => {
              const value = values[k];
              if (k === 'commissionType' && Array.isArray(value)) {
                values[k] = value.join();
              } else if (k === 'effectiveDate' && value) {
                values[k] = value ? value.format('YYYY-MM-DD') : '';
              } else if (k === 'expiryDate' && value) {
                values[k] = value ? value.format('YYYY-MM-DD') : '';
              }
            });
            {
              dispatch({
                type: 'commissionNew/add',
                payload: {
                  params: values,
                  tieredList,
                  commodityList: checkedList,
                },
              }).then(resCb);
            }
          },
        });
      }
    });
  };

  render() {
    const {
      location: {
        query: { type, tplId },
      },
    } = this.props;

    const breadcrumbArr = [
      {
        breadcrumbName: formatMessage({ id: 'PRODUCT_MANAGEMENT' }),
        url: null,
      },
      {
        breadcrumbName: formatMessage({ id: 'COMMISSION_RULE_TITLE' }),
        url: null,
      },
      {
        breadcrumbName: formatMessage({ id: 'TIERED_ATTENDANCE_RULE' }),
        url: '/ProductManagement/CommissionRule/OnlineRule',
      },
      {
        breadcrumbName:
          type && type === 'edit'
            ? formatMessage({ id: 'COMMON_MODIFY' })
            : formatMessage({ id: 'COMMON_NEW' }),
        url: null,
      },
    ];

    return (
      <div>
        <MediaQuery
          maxWidth={SCREEN.screenMdMax}
          minWidth={SCREEN.screenSmMin}
          minHeight={SCREEN.screenSmMin}
        >
          <BreadcrumbComp breadcrumbArr={breadcrumbArr} />
        </MediaQuery>
        <MediaQuery minWidth={SCREEN.screenLgMin}>
          <BreadcrumbComp breadcrumbArr={breadcrumbArr} />
        </MediaQuery>
        <Card>
          <NewCommission tplId={tplId} type={type} ref={el => (this.refForm = el)} />
          <NewBinding tplId={tplId} type={type} handleOk={this.handleOk} />
        </Card>
      </div>
    );
  }
}

export default onlineNew;
