import React from 'react';

export function showTableTitle(value) {
  return <span>{value}</span>;
}

export function getAllTargetList(targetList, targetTreeData, newTargetList = []) {
  if (!targetTreeData) return newTargetList;
  targetTreeData.forEach(item => {
    const hasTarget = targetList.findIndex(n => String(n) === String(item.key)) > -1;
    if (hasTarget) {
      newTargetList.push(item);
    } else if (item.children && item.children.length > 0) {
      getAllTargetList(targetList, item.children, newTargetList);
    }
  });
  return newTargetList;
}

export function getAllChildrenTargetList(childrenTargetTreeData, newTargetList) {
  if (!childrenTargetTreeData) return [];
  childrenTargetTreeData.forEach(item => {
    if (item.children && item.children.length > 0) {
      getAllChildrenTargetList(item.children, newTargetList);
    } else {
      const targetObj = `${item.key}`.replace('customerGroup', '').replace('market', '');
      const noHasTarget =
        newTargetList.findIndex(n => String(n.targetObj) === String(targetObj)) <= -1;
      if (`${item.key}`.startsWith('customerGroup') && noHasTarget) {
        newTargetList.push({ targetType: '01', targetObj });
      }
      if (`${item.key}`.startsWith('market') && noHasTarget) {
        newTargetList.push({ targetType: '01', targetObj });
      }
    }
  });
  return newTargetList;
}
