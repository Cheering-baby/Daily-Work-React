---
title: Filter
subtitle: 筛选组件
cols: 1
order: 20
---

表格的筛选项 一般配合Table组件使用，规则待扩展，使用时若无法满足需求自行添加 type 哟

## 何时使用

列表需要较复杂的筛选条件时

## API

参数 | 说明 | 类型 | 默认值
----|------|-----|------
layout | 二维数组 type - input/select/rangePicker key - 作为请求参数 sourceKey - 用于从source中获取数据 | Array | - source | 一般用于下拉组件 获取数据来源 | Object | -
loading | 用于获取字典表数据时 展示加载状态 | Array | -
onChange | 查询/重置时触发 返回数据可作为请求参数 | Function | -
