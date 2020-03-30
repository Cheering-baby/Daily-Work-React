import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Col, Drawer } from 'antd';
import { router } from 'umi';
import detailStyles from './OperationApprovalDrawer.less';
import OperationApproval from '@/pages/MyActivity/components/OperationApproval';

@connect(({ operationApproval }) => ({
  operationApproval,
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
      activityTplCode,
    } = this.props;
    return (
      <Col span={24}>
        <div className={detailStyles.cancelOk}>
          <Button onClick={this.cancel}>Cancel</Button>
          <Button
            type="primary"
            htmlType="submit"
            className={detailStyles.ok}
            onClick={this.operation}
          >
            OPERATION
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
            <OperationApproval activityTplCode={activityTplCode} />
          </Drawer>
        </div>
      </Col>
    );
  }
}

export default OperationApprovalDrawer;
