import React, { Component } from 'react';
import { Tree } from 'antd';

const { TreeNode } = Tree;
const handleDefault = props => {
  const { menuTree } = props;
  if (menuTree.length > 0) {
    return [menuTree[0].key];
  }
  return [];
};

class TreeSelect extends Component {
  static defaultProps = {
    onSelect: () => {},
    loadData: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      defaultExpandedKeys: handleDefault(props),
      selectedKeys: handleDefault(props),
    };
  }

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} dataRef={item} />;
    });

  renderTreeList = () => {
    const { menuTree } = this.props;
    if (menuTree.length <= 0) {
      return <div>no data</div>;
    }
    const { selectedKeys, defaultExpandedKeys } = this.state;
    return (
      <Tree
        selectedKeys={selectedKeys}
        onSelect={this.handleSelect}
        loadData={this.onLoadData}
        defaultExpandedKeys={defaultExpandedKeys}
      >
        {this.renderTreeNodes(menuTree)}
      </Tree>
    );
  };

  // selectedKeys
  handleSelect = (selectedKeys, e) => {
    const { node } = e;
    this.setState({ selectedKeys });
    const { onSelect } = this.props;
    onSelect(selectedKeys[0], node.props.dataRef);
  };

  // treeNode
  onLoadData = treeNode => {
    const { key, children = [] } = treeNode.props.dataRef;
    const { loadData } = this.props;
    return Promise.resolve(children.length <= 0 ? loadData(key, treeNode.props.dataRef) : '');
  };

  render() {
    return <div>{this.renderTreeList()}</div>;
  }
}

export default TreeSelect;
