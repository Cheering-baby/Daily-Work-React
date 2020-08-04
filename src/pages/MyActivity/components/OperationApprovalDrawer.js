import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Col, Drawer } from 'antd';
import { router } from 'umi';
import detailStyles from './OperationApprovalDrawer.less';
import OperationApproval from '@/pages/MyActivity/components/OperationApproval';

@connect(({ operationApproval, taSignUpDetail, global }) => ({
  operationApproval,
  global,
  taSignUpDetail,
}))
class OperationApprovalDrawer extends PureComponent {
  operation = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'operationApproval/save',
      payload: {
        operationVisible: true,
      },
    });
  };

  onClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'operationApproval/save',
      payload: {
        operationVisible: false,
      },
    });
  };

  cancel = () => {
    router.push({
      pathname: '/MyActivity',
    });
  };

  render() {
    const {
      operationApproval: { operationVisible },
      global: { userCompanyInfo },
      taSignUpDetail: { customerInfo },
      activityTplCode,
      pendStepTplCode,
    } = this.props;
    let isPermission = false;
    if (userCompanyInfo && JSON.stringify(userCompanyInfo) !== '{}') {
      const { status } = userCompanyInfo;
      isPermission = status === '1';
    }
    return (
      <Col span={24}>
        <div className={detailStyles.cancelOk}>
          <Button onClick={this.cancel}>Cancel</Button>
          <Button
            type="primary"
            htmlType="submit"
            className={detailStyles.ok}
            onClick={this.operation}
            disabled={isPermission}
          >
            Operation
          </Button>

          <Drawer
            title="APPROVAL"
            placement="right"
            className={detailStyles.operationDrawer}
            closable
            onClose={this.onClose}
            visible={operationVisible}
            bodyStyle={{ padding: '0px' }}
          >
            <OperationApproval
              activityTplCode={activityTplCode}
              pendStepTplCode={pendStepTplCode}
              customerInfo={customerInfo}
            />
          </Drawer>
        </div>
      </Col>
    );
  }
}

export default OperationApprovalDrawer;
