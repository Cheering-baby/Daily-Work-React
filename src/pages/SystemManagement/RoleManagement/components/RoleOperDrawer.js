import React, { Fragment } from 'react';
import { Collapse, Button, Icon, Drawer, Form, Input, Tree, Select } from 'antd';
// import MediaQuery from 'react-responsive';
import { formatMessage } from 'umi/locale';
// import { SCREEN } from '../../../../utils/screen';
import { connect } from 'dva';
import styles from '../index.less';

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
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.subMenus) {
      console.log(node, key);
      if (node.subMenus.some(item => item.menuCode + item.appCode === key)) {
        parentKey = node.menuCode + node.appCode;
        console.log(parentKey);
      } else if (getParentKey(key, node.subMenus)) {
        parentKey = getParentKey(key, node.subMenus);
      }
    }
  }
  return parentKey;
};

@Form.create()
@connect(({ roleManagement, loading }) => ({
  roleManagement,
  addLoading: loading.effects['roleManagement/addUserRole'],
  editLoading: loading.effects['roleManagement/modifyUserRole'],
}))
class Index extends React.PureComponent {
  state = {
    expandedKeys: ['0-0-0', '0-0-1'],
    autoExpandParent: true,
    checkedKeys: ['0-0-0'],
    selectedKeys: [],
  };

  componentDidMount() {
    // TODO get ROLES
    // TODO get companies
    //
  }

  commit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        // this.query(values);
      }
    });
  };

  closeDetailDrawer = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'roleManagement/saveData',
      payload: {
        drawerShowFlag: false,
      },
    });
  };

  onExpand = expandedKeys => {
    console.log('onExpand', expandedKeys);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onCheck = checkedKeys => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  };

  onSelect = (selectedKeys, info) => {
    console.log('onSelect', info);
    this.setState({ selectedKeys });
  };

  renderTreeNodes = data => {
    const { searchValue = '' } = this.state;
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
      roleManagement: { menuTree = [], menuList = [] },
    } = this.props;
    const { value } = e.target;
    console.log(menuList);
    const expandedKeys = menuList
      .map(item => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, menuTree);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  };

  expandIcon = panelProps => {
    const { isActive } = panelProps;
    if (isActive) {
      return <Icon type="minus-square" className={styles.panelIconClass} theme="filled" />;
    }
    return <Icon type="plus-square" className={styles.panelIconClass} theme="filled" />;
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      roleManagement: { drawerShowFlag = false, menuTree = [] },
    } = this.props;
    return (
      <Drawer
        title={formatMessage({ id: 'DETAIL' })}
        className={styles.drawerClass}
        destroyOnClose
        width={480}
        closable
        onClose={this.closeDetailDrawer}
        visible={drawerShowFlag}
      >
        <Form onSubmit={e => this.commit(e)} layout="vertical">
          <Form.Item label={formatMessage({ id: 'ROLE_CODE' })}>
            {getFieldDecorator(`roleCode`, {
              initialValue: '',
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input placeholder={formatMessage({ id: 'PLEASE_ENTER' })} allowClear />)}
          </Form.Item>
          <Form.Item label={formatMessage({ id: 'ROLE_NAME' })}>
            {getFieldDecorator(`roleName`, {
              initialValue: '',
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input placeholder={formatMessage({ id: 'PLEASE_ENTER' })} allowClear />)}
          </Form.Item>
          <Form.Item label={formatMessage({ id: 'ROLE_TYPE' })}>
            {getFieldDecorator(`roleType`, {
              initialValue: null,
              rules: [
                {
                  required: true,
                },
              ],
            })(
              <Select allowClear placeholder={formatMessage({ id: 'PLEASE_SELECT' })}>
                <Option key="01" value="01">
                  RWS_ROLE
                </Option>
                <Option key="02" value="02">
                  TA_ROLE
                </Option>
                <Option key="03" value="03">
                  SUB_TA_ROLE
                </Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label={formatMessage({ id: 'ROLE_MENU' })}>
            <Collapse defaultActiveKey={['1']} expandIcon={this.expandIcon}>
              <Panel header="This is panel header 1" style={customerPanelStyle} key="1">
                <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChange} />
                <Tree
                  checkable
                  showLine
                  showIcon={false}
                  onExpand={this.onExpand}
                  expandedKeys={this.state.expandedKeys}
                  autoExpandParent={this.state.autoExpandParent}
                  onCheck={this.onCheck}
                  checkedKeys={this.state.checkedKeys}
                  onSelect={this.onSelect}
                  selectedKeys={this.state.selectedKeys}
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
            <Button onClick={this.onClose} type="primary">
              {formatMessage({ id: 'COMMON_OK' })}
            </Button>
          </div>
        </Form>
      </Drawer>
    );
  }
}

export default Index;
