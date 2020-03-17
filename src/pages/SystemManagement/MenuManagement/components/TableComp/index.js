import React, { PureComponent } from 'react';
import { Col, Icon, Modal, Popover, Row, Table, Tooltip } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import styles from './index.less';
import { isNvl } from '@/utils/utils';
import * as setting from '@/uaa-npm/setting';

const mapStateToProps = store => {
  const {
    searchForm = {
      menuName: null,
    },
    menuTree,
    keys,
    qryMenuTableLoading = false,
    selectMenuCode = null,
    menuMoreVisible = false,
    viewId = 'menuView',
  } = store.menuMgr;
  return {
    searchForm,
    menuTree,
    keys,
    qryMenuTableLoading,
    selectMenuCode,
    menuMoreVisible,
    viewId,
  };
};

@connect(mapStateToProps)
class TableComp extends PureComponent {
  getColumns = viewId => {
    const { menuMoreVisible = false, selectMenuCode } = this.props;
    return [
      {
        title: formatMessage({ id: 'MENU_TABLE_MENU_NAME' }),
        dataIndex: 'menuName',
        key: 'menuName',
      },
      {
        title: formatMessage({ id: 'MENU_TABLE_MENU_URL' }),
        dataIndex: 'menuUrl',
        key: 'menuUrl',
      },
      {
        title: formatMessage({ id: 'MENU_TABLE_ICON_URL' }),
        dataIndex: 'iconUrl',
        key: 'iconUrl',
      },
      {
        title: formatMessage({ id: 'MENU_TABLE_OPERATION' }),
        dataIndex: '',
        key: 'operation',
        render: (text, record) => {
          return (
            <div>
              {isNvl(record.id) && (
                <Tooltip placement="top" title={formatMessage({ id: 'MENU_BTN_ADD_MENU' })}>
                  <Icon type="plus" onClick={e => this.goAdd(e, record)} />
                </Tooltip>
              )}
              {!isNvl(record.id) && (
                <React.Fragment>
                  {record.isTopMenu && !record.isBottomMenu ? (
                    <Icon type="to-top" className={styles.IconDisabled} />
                  ) : (
                    <Tooltip placement="top" title={formatMessage({ id: 'MENU_BTN_MOVE_UP' })}>
                      <Icon type="to-top" onClick={e => this.goMoveUp(e, record)} />
                    </Tooltip>
                  )}
                  {!record.isTopMenu && record.isBottomMenu ? (
                    <Icon type="vertical-align-bottom" className={styles.IconDisabled} />
                  ) : (
                    <Tooltip placement="top" title={formatMessage({ id: 'MENU_BTN_MOVE_DOWN' })}>
                      <Icon
                        type="vertical-align-bottom"
                        onClick={e => this.goMoveDown(e, record)}
                      />
                    </Tooltip>
                  )}
                  <Popover
                    placement="bottomRight"
                    visible={
                      !isNvl(selectMenuCode) && String(selectMenuCode) === String(record.menuCode)
                        ? menuMoreVisible
                        : false
                    }
                    onVisibleChange={visible => this.onMoreVisibleChange(record, visible)}
                    content={this.getMoreContent(record)}
                    overlayClassName={styles.popClassName}
                    getPopupContainer={() => document.getElementById(`${viewId}`)}
                  >
                    <Icon type="more" />
                  </Popover>
                </React.Fragment>
              )}
            </div>
          );
        },
      },
    ];
  };

  getMoreContent = record => {
    return (
      <Row type="flex" justify="space-around" className={styles.contentMenuRow}>
        {String(record.id) !== '-1' && record.menuType === '01' && (
          <Col span={24}>
            <div className={styles.contentMenuCol} onClick={e => this.goAdd(e, record)}>
              <Icon type="plus" />
              {formatMessage({ id: 'MENU_BTN_ADD_MENU' })}
            </div>
          </Col>
        )}
        <Col span={24}>
          <div className={styles.contentMenuCol} onClick={e => this.goEditMenu(e, record)}>
            <Icon type="edit" />
            {formatMessage({ id: 'COMMON_EDIT' })}
          </div>
        </Col>
        <Col span={24}>
          <div className={styles.contentMenuCol} onClick={e => this.onShowMenuView(e, record)}>
            <Icon type="eye" />
            {formatMessage({ id: 'MENU_BTN_VIEW' })}
          </div>
        </Col>
        <Col span={24}>
          <div className={styles.contentMenuCol} onClick={e => this.onDeleteMenu(e, record)}>
            <Icon type="delete" />
            {formatMessage({ id: 'COMMON_DELETE' })}
          </div>
        </Col>
      </Row>
    );
  };

  onMoreVisibleChange = (menuInfo, visible) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menuMgr/save',
      payload: {
        selectMenuCode: menuInfo.menuCode,
        menuMoreVisible: visible,
      },
    });
  };

  goMoveUp = (e, menuInfo) => {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch({
      type: 'menuMgr/fetchMoveUpMenu',
      payload: {
        menuCode: menuInfo.menuCode,
        parentMenuCode: menuInfo.parentMenuCode,
        appCode: isNvl(menuInfo.appCode) ? `${setting.appCode}` : menuInfo.appCode,
      },
    }).then(flag => {
      if (flag) {
        dispatch({ type: 'menuMgr/fetchAllMenus' });
      }
    });
  };

  goMoveDown = (e, menuInfo) => {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch({
      type: 'menuMgr/fetchMoveDownMenu',
      payload: {
        menuCode: menuInfo.menuCode,
        parentMenuCode: menuInfo.parentMenuCode,
        appCode: isNvl(menuInfo.appCode) ? `${setting.appCode}` : menuInfo.appCode,
      },
    }).then(flag => {
      if (flag) {
        dispatch({ type: 'menuMgr/fetchAllMenus' });
      }
    });
  };

  goAdd = (e, menuInfo) => {
    e.preventDefault();
    const { dispatch } = this.props;
    this.onMoreVisibleChange(menuInfo, false);
    dispatch({
      type: 'menuMgr/save',
      payload: {
        menuFormVisible: true,
        isEdit: false,
        isDetail: false,
        menuInfo: {
          parentMenuCode: menuInfo.menuCode,
          parentMenuName: menuInfo.menuName,
        },
        menuInfoLoadingFlag: false,
      },
    });
  };

  goEditMenu = (e, menuInfo) => {
    e.preventDefault();
    const { dispatch } = this.props;
    this.onMoreVisibleChange(menuInfo, false);
    dispatch({
      type: 'menuMgr/save',
      payload: {
        menuFormVisible: true,
        isEdit: true,
        isDetail: false,
        menuInfo,
        menuInfoLoadingFlag: false,
      },
    });
  };

  onShowMenuView = (e, menuInfo) => {
    e.preventDefault();
    const { dispatch } = this.props;
    this.onMoreVisibleChange(menuInfo, false);
    dispatch({
      type: 'menuMgr/save',
      payload: {
        menuFormVisible: true,
        isEdit: false,
        isDetail: true,
        menuInfo,
        menuInfoLoadingFlag: false,
      },
    });
  };

  onDeleteMenu = (e, menuInfo) => {
    e.preventDefault();
    this.onMoreVisibleChange(menuInfo, false);
    Modal.confirm({
      title: formatMessage({ id: 'MENU_DEL_MENU_CONFIRM' }),
      okText: formatMessage({ id: 'COMMON_YES' }),
      cancelText: formatMessage({ id: 'COMMON_NO' }),
      icon: <Icon type="info-circle" style={{ backgroundColor: '#faad14' }} />,
      onOk: () => {
        const { dispatch } = this.props;
        dispatch({
          type: 'menuMgr/fetchRemoveMenu',
          payload: {
            menuCode: menuInfo.menuCode,
            appCode: isNvl(menuInfo.appCode) ? `${setting.appCode}` : menuInfo.appCode,
          },
        }).then(flag => {
          if (flag) {
            dispatch({ type: 'menuMgr/fetchAllMenus' });
          }
        });
      },
    });
  };

  render() {
    const { qryMenuTableLoading, menuTree, keys, viewId } = this.props;
    return (
      <Col span={24}>
        <Table
          size="small"
          className={`tabs-no-padding ${styles.searchTitle}`}
          columns={this.getColumns(viewId)}
          dataSource={menuTree}
          loading={qryMenuTableLoading}
          defaultExpandedRowKeys={['PAMS', ...keys]}
          expandIcon={props => {
            if (props.record && props.record.menuType === '01') {
              if (props.expanded)
                return (
                  <Icon
                    type="caret-down"
                    onClick={e => props.onExpand(props.record, e)}
                    style={{ fontSize: '12px', color: '#858585', marginRight: '3px' }}
                  />
                );
              return (
                <Icon
                  type="caret-right"
                  onClick={e => props.onExpand(props.record, e)}
                  style={{ fontSize: '12px', color: '#858585', marginRight: '3px' }}
                />
              );
            }
            return (
              <Icon type="menu" style={{ fontSize: '12px', color: '#fff', marginRight: '3px' }} />
            );
          }}
          scroll={{ x: 660 }}
          pagination={false}
        />
      </Col>
    );
  }
}

export default TableComp;
