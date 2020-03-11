/* eslint-disable */
import React from 'react';
import { Col, Row, Input, Tree, Icon, Card, Button, Spin } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from '../index.less';
import { connect } from 'dva';

const { Search } = Input;
const { TreeNode } = Tree;

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.subOrgs) {
      if (node.subOrgs.some(item => item.code === key)) {
        parentKey = node.code;
      } else if (getParentKey(key, node.subOrgs)) {
        parentKey = getParentKey(key, node.subOrgs);
      }
    }
  }
  return parentKey;
};

@connect(({ orgManagement, loading }) => ({
  orgManagement,
  loadTreeFlag: loading.effects['orgManagement/queryUserOrgTree'],
}))
class OrgTree extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
  }

  onExpand = expandedKeys => {
    console.log('onExpand', expandedKeys);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    const { dispatch } = this.props;
    dispatch({
      type: 'orgManagement/saveData',
      payload: {
        expandedKeys,
        autoExpandParent: false,
      },
    });
  };

  onSelect = (selectedKeys, info) => {
    const {
      node: {
        props: { dataRef = {} },
      },
    } = info;
    const {
      dispatch,
      orgManagement: {
        selectedOrg: { code = '' },
      },
    } = this.props;
    if (code === dataRef.code) {
      return;
    }
    dispatch({
      type: 'orgManagement/saveData',
      payload: {
        selectedKeys,
        selectedOrg: dataRef,
      },
    }).then(() => {
      dispatch({
        type: 'orgManagement/queryUsersInOrg',
      });
    });
  };

  renderTreeNodes = data => {
    const {
      orgManagement: { searchValue = '' },
    } = this.props;
    return data.map(item => {
      const index = item.orgName.indexOf(searchValue);
      const beforeStr = item.orgName.substr(0, index);
      const afterStr = item.orgName.substr(index + searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: '#f50' }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item.orgName}</span>
        );
      if (item.subOrgs) {
        return (
          <TreeNode title={this.getTreeNodeTitle(title, item)} key={item.code} dataRef={item}>
            {this.renderTreeNodes(item.subOrgs)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          key={item.code}
          title={this.getTreeNodeTitle(title, item)}
          dataRef={item}
          className={'treeNodeClass'}
        />
      );
    });
  };

  getTreeNodeTitle = (title, item) => {
    const {
      orgManagement: {
        selectedOrg: { code = '' },
      },
    } = this.props;
    return (
      <div className={styles.treeTitleClass}>
        {title}
        {code === item.code ? (
          <Icon onClick={this.modifyOrg} type="edit" className={styles.treeTitleRightIcon} />
        ) : null}
      </div>
    );
  };

  modifyOrg = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orgManagement/saveData',
      payload: {
        drawerShowFlag: true,
        operType: 'MODIFY_USER_ORG',
      },
    });
  };

  onChange = e => {
    const {
      orgManagement: { orgTree = [], orgList = [] },
    } = this.props;
    const { value } = e.target;
    const expandedKeys = orgList
      .map(item => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, orgTree);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    const { dispatch } = this.props;
    dispatch({
      type: 'orgManagement/saveData',
      payload: {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true,
      },
    });
  };

  getAddOrgBtn = () => {
    return (
      <Button type="link" className={styles.addBtnClass}>
        {formatMessage({ id: 'ADD_BTN_TEXT' })}
      </Button>
    );
  };

  render() {
    const {
      orgManagement: {
        orgTree = [],
        expandedKeys = [],
        autoExpandParent = true,
        selectedKeys = [],
      },
      loadTreeFlag = false,
    } = this.props;

    return (
      <Card
        className={`has-shadow ${styles.cardClass}`}
        title={formatMessage({ id: 'ORG_LIST' })}
        extra={this.getAddOrgBtn()}
      >
        <Spin spinning={loadTreeFlag}>
          <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChange} />
          <Tree
            showLine
            showIcon
            blockNode
            onExpand={this.onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            onSelect={this.onSelect}
            selectedKeys={selectedKeys}
            // className={styles.treeClass}
          >
            {this.renderTreeNodes(orgTree)}
          </Tree>
        </Spin>
      </Card>
    );
  }
}

export default OrgTree;
