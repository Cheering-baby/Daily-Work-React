import React from 'react';
import { Button, Form, Modal, Spin, Transfer } from 'antd';
// import MediaQuery from 'react-responsive';
import { formatMessage } from 'umi/locale';
// import { SCREEN } from '../../../../utils/screen';
import { connect } from 'dva';
import constants from '../constants';

@Form.create()
@connect(({ roleMgr, loading }) => ({
  roleMgr,
  detailLoading: loading.effects['roleMgr/queryUserRoleDetail'],
  privilegesLoading: loading.effects['roleMgr/queryAllPrivileges'],
}))
class Index extends React.PureComponent {
  componentDidMount() {}

  handleOk = () => {
    const {
      dispatch,
      roleMgr: { userRoleDetail = {} },
    } = this.props;
    const { roleCode = '' } = userRoleDetail;
    dispatch({
      type: 'roleMgr/operUserPrivileges',
      payload: {
        roleCode,
        appCode: constants.APP_CODE,
        addPrivileges: this.getAddPrivileges(),
        removePrivileges: this.getRemovePrivileges(),
      },
    }).then(result => {
      if (result) {
        this.closeModal();
      }
    });
  };

  getAddPrivileges = () => {
    const {
      roleMgr: { selectedPrivileges = [], rolePrivileges = [] },
    } = this.props;
    const result = [];
    selectedPrivileges.forEach(item => {
      if (!rolePrivileges.includes(item)) {
        result.push(item);
      }
    });
    return result;
  };

  getRemovePrivileges = () => {
    const {
      roleMgr: { selectedPrivileges = [], rolePrivileges = [] },
    } = this.props;
    const result = [];
    rolePrivileges.forEach(item => {
      if (!selectedPrivileges.includes(item)) {
        result.push(item);
      }
    });
    return result;
  };

  handleCancel = () => {
    this.closeModal();
  };

  closeModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'roleMgr/saveData',
      payload: {
        privilegeModalShowFlag: false,
      },
    });
  };

  handleChange = targetKeys => {
    const { dispatch } = this.props;
    dispatch({
      type: 'roleMgr/saveData',
      payload: {
        selectedPrivileges: targetKeys,
      },
    });
  };

  render() {
    const {
      roleMgr: { allPrivileges = [], selectedPrivileges = [] },
      detailLoading = false,
      privilegesLoading = false,
      operLoading = false,
    } = this.props;
    return (
      <Modal
        title={formatMessage({ id: 'GRANT_PRIVILEGES' })}
        visible
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        width={900}
        footer={[
          <Button key="submit" type="primary" loading={operLoading} onClick={this.handleOk}>
            {formatMessage({ id: 'BTN_OK' })}
          </Button>,
          <Button key="back" onClick={this.handleCancel}>
            {formatMessage({ id: 'BTN_CANCEL' })}
          </Button>,
        ]}
      >
        <Spin spinning={detailLoading || privilegesLoading}>
          <Transfer
            locale={{
              searchPlaceholder: formatMessage({ id: 'component.globalHeader.search' }),
            }}
            dataSource={allPrivileges}
            showSearch
            listStyle={{
              width: 400,
              height: 400,
            }}
            targetKeys={selectedPrivileges}
            onChange={this.handleChange}
            render={item => item.componentName}
          />
        </Spin>
      </Modal>
    );
  }
}

export default Index;
