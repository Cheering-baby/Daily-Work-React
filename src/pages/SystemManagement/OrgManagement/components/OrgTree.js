import React from 'react';
import { Button, Card, Icon, Input, Spin, Tree } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import styles from '../index.less';
import constants from '../constants';
import PrivilegeUtil from '@/utils/PrivilegeUtil';

const { Search } = Input;
const { TreeNode } = Tree;

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i += 1) {
    const node = tree[i];
    if (node.subOrgs) {
      if (node.subOrgs.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.subOrgs)) {
        parentKey = getParentKey(key, node.subOrgs);
      }
    }
  }
  return parentKey;
};

const filterTree = (trees = [], value = '') => {
  const newTrees = [];
  for (let i = 0; i < trees.length; i += 1) {
    const { companyId, companyName = '', orgName = '' } = trees[i];
    let { subOrgs } = trees[i];
    subOrgs = subOrgs || [];
    const indexOfOrg = orgName.toLowerCase().indexOf(value.toLowerCase());
    const indexOfComp = companyName ? companyName.toLowerCase().indexOf(value.toLowerCase()) : -1;
    const newSubOrgs = filterTree(subOrgs, value);
    if (companyId === -1 || indexOfOrg > -1 || indexOfComp > -1 || newSubOrgs.length > 0) {
      newTrees.push({
        ...trees[i],
        subOrgs: newSubOrgs,
      });
    }
  }
  return newTrees;
};

@connect(({ orgMgr, global, loading }) => ({
  orgMgr,
  global,
  loadTreeFlag: loading.effects['orgMgr/queryUserOrgTree'],
}))
class OrgTree extends React.Component {
  onExpand = expandedKeys => {
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    const { dispatch } = this.props;
    dispatch({
      type: 'orgMgr/saveData',
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
      orgMgr: {
        selectedOrg: { code = '' },
      },
    } = this.props;
    if (code === dataRef.code) {
      return;
    }

    const privilege =
      PrivilegeUtil.hasAnyPrivilege([PrivilegeUtil.PAMS_ADMIN_PRIVILEGE]) ||
      PrivilegeUtil.hasAnyPrivilege([PrivilegeUtil.MAIN_TA_ADMIN_PRIVILEGE]) ||
      PrivilegeUtil.hasAnyPrivilege([PrivilegeUtil.SUB_TA_ADMIN_PRIVILEGE]);

    dispatch({
      type: 'orgMgr/saveData',
      payload: {
        selectedKeys,
        selectedOrg: dataRef,
      },
    }).then(() => {
      if (privilege) {
        dispatch({
          type: 'orgMgr/queryUsersInOrg',
        });
      }
    });
  };

  renderTreeNodes = data => {
    const {
      orgMgr: { searchValue = '' },
    } = this.props;

    const newTree = filterTree(data, searchValue);

    return newTree.map(item => {
      const { companyName = '', orgName } = item;
      const index = orgName.toLowerCase().indexOf(searchValue.toLowerCase());
      const indexOfComp = companyName
        ? companyName.toLowerCase().indexOf(searchValue.toLowerCase())
        : -1;
      const beforeStr = orgName.substr(0, index);
      const value = orgName.substr(index, searchValue.length);
      const afterStr = orgName.substr(index + searchValue.length);
      let title = <span>{orgName}</span>;
      if (indexOfComp > -1 && searchValue) {
        title = <span style={{ color: '#f50' }}>{orgName}</span>;
      } else if (index > -1) {
        title = (
          <span>
            {beforeStr}
            <span style={{ color: '#f50' }}>{value}</span>
            {afterStr}
          </span>
        );
      }
      if (item.subOrgs) {
        return (
          <TreeNode title={this.getTreeNodeTitle(title, item)} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.subOrgs)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          key={item.key}
          title={this.getTreeNodeTitle(title, item)}
          dataRef={item}
          className="treeNodeClass"
        />
      );
    });
  };

  getTreeNodeTitle = (title, item) => {
    const {
      orgMgr: {
        selectedOrg: { key = '' },
      },
    } = this.props;
    return (
      <div className={styles.treeTitleClass}>
        {title}
        {key === item.key && key !== constants.RWS_ORG_CODE ? (
          <Icon onClick={this.modifyOrg} type="edit" className={styles.treeTitleRightIcon} />
        ) : null}
      </div>
    );
  };

  modifyOrg = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orgMgr/saveData',
      payload: {
        drawerShowFlag: true,
        operType: 'MODIFY_USER_ORG',
      },
    });
  };

  onChange = e => {
    const { value } = e.target;
    const {
      dispatch,
      orgMgr: { orgTree = [], orgList = [] },
    } = this.props;
    if (!value) {
      dispatch({
        type: 'orgMgr/saveData',
        payload: {
          searchValue: value,
        },
      });
      return;
    }

    const expandedKeys = orgList
      .map(item => {
        const { title, companyName } = item;
        const lowerValue = value.toLowerCase();
        const lowerTitle = title ? title.toLowerCase() : '';
        const lowerCompanyName = companyName ? companyName.toLowerCase() : '';
        if (
          (title && lowerTitle.indexOf(lowerValue) > -1) ||
          (companyName && lowerCompanyName.indexOf(lowerValue) > -1)
        ) {
          return getParentKey(item.key, orgTree);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    dispatch({
      type: 'orgMgr/saveData',
      payload: {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true,
      },
    });
  };

  getAddOrgBtn = () => {
    return <Button style={{ visibility: 'hidden' }} />;
  };

  render() {
    const {
      orgMgr: { orgTree = [], expandedKeys = [], autoExpandParent = true, selectedKeys = [] },
      loadTreeFlag = false,
    } = this.props;

    return (
      <Card
        className={`has-shadow ${styles.cardClass}`}
        title={formatMessage({ id: 'ORG_LIST' })}
        extra={this.getAddOrgBtn()}
      >
        <Spin spinning={loadTreeFlag}>
          <Search
            style={{ marginBottom: 8 }}
            placeholder="Organisation Name/Company Name"
            onChange={this.onChange}
          />
          <Tree
            showLine
            showIcon
            blockNode
            onExpand={this.onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            onSelect={this.onSelect}
            selectedKeys={selectedKeys}
          >
            {this.renderTreeNodes(orgTree)}
          </Tree>
        </Spin>
      </Card>
    );
  }
}

export default OrgTree;
