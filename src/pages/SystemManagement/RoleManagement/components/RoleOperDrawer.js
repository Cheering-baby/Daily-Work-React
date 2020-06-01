import React from 'react';
import {
  Button,
  Collapse,
  Drawer,
  Form,
  Icon,
  Input,
  Select,
  Spin,
  Tooltip,
  Tree,
  Radio,
} from 'antd';
// import MediaQuery from 'react-responsive';
import { formatMessage } from 'umi/locale';
// import { SCREEN } from '../../../../utils/screen';
import { connect } from 'dva';
import styles from '../index.less';
import constants from '../constants';

const { Option } = Select;
const { Search } = Input;

const { Panel } = Collapse;

const { TreeNode } = Tree;

const customerPanelStyle = {
  background: '#fff',
  marginBottom: '50px',
};

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i += 1) {
    const node = tree[i];
    const { subMenus = [] } = node;
    if (subMenus && subMenus.length > 0) {
      if (subMenus.some(item => item.menuCode + item.appCode === key)) {
        parentKey = node.menuCode + node.appCode;
      } else if (getParentKey(key, node.subMenus)) {
        parentKey = getParentKey(key, node.subMenus);
      }
    }
  }
  return parentKey;
};

@Form.create()
@connect(({ roleMgr, loading }) => ({
  roleMgr,
  addLoading: loading.effects['roleMgr/addUserRole'],
  editLoading: loading.effects['roleMgr/modifyUserRole'],
}))
class Index extends React.PureComponent {
  componentDidMount() {}

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'roleMgr/saveData',
      payload: {
        expandedKeys: [],
        autoExpandParent: true,
        checkedKeys: [],
        searchValue: '',
        menuChangeFlag: false,
      },
    });
  }

  commit = e => {
    e.preventDefault();
    const {
      form,
      roleMgr: { operType = constants.ADD_USER_ROLE, checkedKeys = [], halfCheckedKeys = [] },
    } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        values.appCode = constants.APP_CODE;
        if (operType === constants.ADD_USER_ROLE) {
          values.menuCodes = [...checkedKeys, ...halfCheckedKeys].map(item =>
            item.substring(0, item.length - constants.ROOT_CODE.length)
          );
          this.addUserRole(values);
        } else if (operType === constants.MODIFY_USER_ROLE) {
          values.addMenuCodes = this.getAddMenuCodes();
          values.removeMenuCodes = this.getRemoveMenuCodes();
          this.modifyUserRole(values);
        }
      }
    });
  };

  getRemoveMenuCodes = () => {
    const {
      roleMgr: {
        checkedKeys = [],
        halfCheckedKeys = [],
        checkedMenuCodes = [],
        menuChangeFlag = false,
      },
    } = this.props;
    if (!menuChangeFlag) {
      return [];
    }
    const allCheckedKeys = [...checkedKeys, ...halfCheckedKeys];
    const removeCodes = [];
    checkedMenuCodes.forEach(item => {
      const key = item + constants.ROOT_CODE;
      if (!allCheckedKeys.includes(key)) {
        removeCodes.push(item);
      }
    });
    return removeCodes;
  };

  getAddMenuCodes = () => {
    const {
      roleMgr: {
        checkedKeys = [],
        halfCheckedKeys = [],
        checkedMenuCodes = [],
        menuChangeFlag = false,
      },
    } = this.props;
    if (!menuChangeFlag) {
      return [];
    }
    const checkedMenuCode = [...checkedKeys, ...halfCheckedKeys];
    const addCodes = [];
    checkedMenuCode.forEach(item => {
      const menuCode = item.substring(0, item.length - constants.ROOT_CODE.length);
      if (!checkedMenuCodes.includes(menuCode)) {
        addCodes.push(menuCode);
      }
    });
    return addCodes;
  };

  modifyUserRole = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'roleMgr/modifyUserRole',
      payload: {
        ...values,
      },
    }).then(result => {
      if (result) {
        this.closeDetailDrawer();
        dispatch({
          type: 'roleMgr/queryUserRolesByCondition',
        });
      }
    });
  };

  addUserRole = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'roleMgr/addUserRole',
      payload: {
        ...values,
      },
    }).then(result => {
      if (result) {
        this.closeDetailDrawer();
        dispatch({
          type: 'roleMgr/queryUserRolesByCondition',
        });
      }
    });
  };

  closeDetailDrawer = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'roleMgr/saveData',
      payload: {
        drawerShowFlag: false,
      },
    });
  };

  onExpand = expandedKeys => {
    const { dispatch } = this.props;
    dispatch({
      type: 'roleMgr/saveData',
      payload: {
        expandedKeys,
        autoExpandParent: false,
      },
    });
  };

  onCheck = (checkedKeys, e) => {
    const { dispatch } = this.props;
    const { halfCheckedKeys = [] } = e;
    dispatch({
      type: 'roleMgr/saveData',
      payload: {
        checkedKeys,
        halfCheckedKeys,
        menuChangeFlag: true,
      },
    });
  };

  renderTreeNodes = data => {
    const {
      roleMgr: { searchValue = '' },
    } = this.props;

    return data.map(item => {
      const index = item.menuName.indexOf(searchValue);
      const beforeStr = item.menuName.substr(0, index);
      const afterStr = item.menuName.substr(index + searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: '#f50' }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item.menuName}</span>
        );
      if (item.subMenus) {
        return (
          <TreeNode title={title} key={item.menuCode + item.appCode} dataRef={item}>
            {this.renderTreeNodes(item.subMenus)}
          </TreeNode>
        );
      }
      return (
        <TreeNode key={item.menuCode + item.appCode} title={title} className="treeNodeClass" />
      );
    });
  };

  onChange = e => {
    const {
      dispatch,
      roleMgr: { menuTree = [], menuList = [] },
    } = this.props;
    const { value } = e.target;
    const expandedKeys = menuList
      .map(item => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, menuTree);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    dispatch({
      type: 'roleMgr/saveData',
      payload: {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true,
      },
    });
  };

  expandIcon = panelProps => {
    const { isActive } = panelProps;
    if (isActive) {
      return <Icon type="minus-square" className={styles.panelIconClass} theme="filled" />;
    }
    return <Icon type="plus-square" className={styles.panelIconClass} theme="filled" />;
  };

  getRoleTypeOptions = () => {
    return constants.ROLE_TYPES.map(item => {
      return (
        <Option key={item.key} value={item.key}>
          {item.title}
        </Option>
      );
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      roleMgr: {
        menuTree = [],
        expandedKeys = [],
        checkedKeys = [],
        autoExpandParent = true,
        menuList = [],
        operType = constants.ADD_USER_ROLE,
        userRoleDetail = {},
      },
      addRoleLoading = false,
      detailLoading = false,
      editLoading = false,
    } = this.props;

    const {
      roleCode = '',
      roleName = '',
      roleType = '',
      twoFactorAuth = 'N',
      includePerson,
    } = userRoleDetail;

    const roleTypeFormItem = (
      <Form.Item label={formatMessage({ id: 'ROLE_TYPE' })}>
        {getFieldDecorator(`roleType`, {
          initialValue: operType === constants.ADD_USER_ROLE ? undefined : roleType,
          rules: [
            {
              required: true,
              message: formatMessage({ id: 'REQUIRED' }),
            },
          ],
        })(
          <Select
            allowClear
            disabled={operType !== constants.ADD_USER_ROLE && includePerson > 0}
            placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
          >
            {this.getRoleTypeOptions()}
          </Select>
        )}
      </Form.Item>
    );

    return (
      <Drawer
        title={
          operType === constants.ADD_USER_ROLE
            ? formatMessage({ id: 'NEW' })
            : formatMessage({ id: 'EDIT' })
        }
        className={styles.drawerClass}
        destroyOnClose
        width={480}
        closable
        onClose={this.closeDetailDrawer}
        visible
      >
        <Spin spinning={detailLoading}>
          <Form onSubmit={e => this.commit(e)} layout="vertical">
            <Form.Item label={formatMessage({ id: 'ROLE_CODE' })}>
              {getFieldDecorator(`roleCode`, {
                initialValue: operType === constants.ADD_USER_ROLE ? '' : roleCode,
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'REQUIRED' }),
                  },
                ],
              })(
                <Input
                  disabled={operType === constants.MODIFY_USER_ROLE}
                  maxLength={50}
                  placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                  allowClear
                />
              )}
            </Form.Item>
            <Form.Item label={formatMessage({ id: 'ROLE_NAME' })}>
              {getFieldDecorator(`roleName`, {
                initialValue: operType === constants.ADD_USER_ROLE ? '' : roleName,
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'REQUIRED' }),
                  },
                ],
              })(
                <Input
                  maxLength={100}
                  placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                  allowClear
                />
              )}
            </Form.Item>
            {operType !== constants.ADD_USER_ROLE && includePerson > 0 ? (
              <Tooltip title={formatMessage({ id: 'ROLE_INCLUDE_ERROR' })} placement="bottom">
                {roleTypeFormItem}
              </Tooltip>
            ) : (
              roleTypeFormItem
            )}
            <Form.Item
              label={
                <span>
                  {formatMessage({ id: 'TWO_FACTOR_AUTH' })}
                  <Tooltip
                    title={formatMessage({ id: 'TWO_FACTOR_AUTH_CHOOSE_PROMPT' })}
                    placement="bottom"
                  >
                    <Icon className={styles.questionIconStyle} type="question-circle" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator(`twoFactorAuth`, {
                initialValue: operType === constants.ADD_USER_ROLE ? 'N' : twoFactorAuth,
              })(
                <Radio.Group>
                  <Radio value="Y">Yes</Radio>
                  <Radio value="N">No</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item label={formatMessage({ id: 'ROLE_MENU' })}>
              <Collapse defaultActiveKey={['1']} expandIcon={this.expandIcon}>
                <Panel
                  header={`${checkedKeys.length}/${menuList.length}`}
                  style={customerPanelStyle}
                  key="1"
                >
                  <Search
                    style={{ marginBottom: 8 }}
                    placeholder="Search"
                    onChange={this.onChange}
                  />
                  <Tree
                    checkable
                    showLine
                    showIcon={false}
                    onExpand={this.onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    onCheck={this.onCheck}
                    checkedKeys={checkedKeys}
                    className={styles.treeClass}
                  >
                    {this.renderTreeNodes(menuTree)}
                  </Tree>
                </Panel>
              </Collapse>
            </Form.Item>
            <div className={styles.drawerBtnWrapper}>
              <Button
                style={{
                  marginRight: 8,
                }}
                onClick={this.closeDetailDrawer}
              >
                {formatMessage({ id: 'COMMON_CANCEL' })}
              </Button>
              <Button type="primary" htmlType="submit" loading={addRoleLoading || editLoading}>
                {formatMessage({ id: 'COMMON_OK' })}
              </Button>
            </div>
          </Form>
        </Spin>
      </Drawer>
    );
  }
}

export default Index;
