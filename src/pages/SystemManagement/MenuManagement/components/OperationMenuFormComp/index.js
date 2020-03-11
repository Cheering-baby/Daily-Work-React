import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Card, Drawer } from 'antd';
import { formatMessage } from 'umi/locale';
import MenuForm from '../MenuForm';
import MenuDetail from '../MenuDetail';
import { getKeyValue } from '../../utils/pubUtils';
import styles from './index.less';

const mapStateToProps = store => {
  const {
    menuFormVisible = false,
    isEdit = false,
    isDetail = false,
    menuInfo = {},
    iconArr = [],
    menuTypeList = [],
    menuInfoLoadingFlag = false,
  } = store.menuMgr;
  return {
    menuFormVisible,
    isEdit,
    isDetail,
    menuInfo,
    iconArr,
    menuTypeList,
    menuInfoLoadingFlag,
  };
};

@connect(mapStateToProps)
class OperationMenuFormComp extends PureComponent {
  onClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menuMgr/save',
      payload: {
        menuFormVisible: false,
        isEdit: false,
        isDetail: false,
        menuInfo: {},
        menuInfoLoadingFlag: false,
      },
    });
  };

  goModify = () => {
    const { dispatch, menuInfo } = this.props;
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

  onOk = () => {
    const { dispatch, isEdit = false, isDetail = false, menuInfo = {} } = this.props;
    const { form } = this.menuRef.props;
    form.validateFieldsAndScroll(error => {
      if (error) {
        return;
      }
      let typeUrl = 'menuMgr/fetchAddMenu';
      let reqParams = {
        parentMenuCode: menuInfo.parentMenuCode,
        menuName: menuInfo.menuName,
        menuType: menuInfo.menuType,
        menuUrl: menuInfo.menuUrl,
        iconUrl: menuInfo.iconUrl,
        remarks: menuInfo.remarks,
        appCode: menuInfo.appCode,
      };
      if (isEdit && !isDetail) {
        typeUrl = 'menuMgr/fetchModifyMenu';
        reqParams = {
          menuCode: menuInfo.menuCode,
          menuName: menuInfo.menuName,
          menuType: menuInfo.menuType,
          menuUrl: menuInfo.menuUrl,
          iconUrl: menuInfo.iconUrl,
          remarks: menuInfo.remarks,
          appCode: menuInfo.appCode,
        };
      }
      dispatch({
        type: typeUrl,
        payload: {
          ...reqParams,
        },
      }).then(flag => {
        if (flag) {
          dispatch({ type: 'menuMgr/fetchAllMenus' });
          dispatch({
            type: 'menuMgr/save',
            payload: {
              menuFormVisible: false,
              isEdit: false,
              isDetail: false,
              menuInfo: {},
              menuInfoLoadingFlag: false,
            },
          });
        }
      });
    });
  };

  onHandleChange = (key, keyValue, fieldKey) => {
    const { dispatch, menuInfo } = this.props;
    const newMenuInfo = { ...menuInfo };
    const { form } = this.menuRef.props;
    const noVal = getKeyValue(keyValue);
    form.setFieldsValue(JSON.parse(`{"${fieldKey}":"${noVal}"}`));
    const source = JSON.parse(`{"${key}":"${noVal}"}`);
    Object.assign(newMenuInfo, source);
    dispatch({
      type: 'menuMgr/save',
      payload: {
        menuInfo: newMenuInfo,
      },
    });
  };

  render() {
    const {
      menuFormVisible = false,
      isEdit = false,
      isDetail = false,
      menuInfo = {},
      iconArr = [],
      menuTypeList = [],
      menuInfoLoadingFlag = false,
    } = this.props;
    const viewId = 'menuFormView';
    let titleStr = formatMessage({ id: 'MENU_DRAWER_NEW' });
    if (isEdit && !isDetail) {
      titleStr = formatMessage({ id: 'MENU_DRAWER_EDIT' });
    }
    if (!isEdit && isDetail) {
      titleStr = formatMessage({ id: 'MENU_DRAWER_DETAIL' });
    }
    return (
      <Drawer
        id={`${viewId}`}
        title={titleStr || null}
        width={320}
        closable={false}
        visible={menuFormVisible}
        bodyStyle={{ padding: '8px' }}
      >
        <div>
          <Card className={styles.menuFormCard} loading={menuInfoLoadingFlag}>
            {isEdit && !isDetail && (
              <MenuForm
                menuInfo={menuInfo}
                viewId={viewId}
                menuTypeList={menuTypeList}
                iconArr={iconArr || []}
                onHandleChange={this.onHandleChange}
                wrappedComponentRef={ref => {
                  this.menuRef = ref;
                }}
              />
            )}
            {!isEdit && !isDetail && (
              <MenuForm
                menuInfo={menuInfo}
                viewId={viewId}
                menuTypeList={menuTypeList}
                iconArr={iconArr || []}
                onHandleChange={this.onHandleChange}
                wrappedComponentRef={ref => {
                  this.menuRef = ref;
                }}
              />
            )}
            {!isEdit && isDetail && <MenuDetail menuInfo={menuInfo} menuTypeList={menuTypeList} />}
          </Card>
        </div>
        {!isEdit && isDetail ? (
          <div className={styles.menuFormBtn}>
            <Button onClick={this.onClose} style={{ marginRight: 8 }}>
              {formatMessage({ id: 'COMMON_CANCEL' })}
            </Button>
            <Button onClick={this.goModify} type="primary" loading={menuInfoLoadingFlag}>
              {formatMessage({ id: 'MENU_BTN_MODIFY' })}
            </Button>
          </div>
        ) : (
          <div className={styles.menuFormBtn}>
            <Button onClick={this.onClose} style={{ marginRight: 8 }}>
              {formatMessage({ id: 'COMMON_CANCEL' })}
            </Button>
            <Button onClick={this.onOk} type="primary" loading={menuInfoLoadingFlag}>
              {formatMessage({ id: 'COMMON_OK' })}
            </Button>
          </div>
        )}
      </Drawer>
    );
  }
}

export default OperationMenuFormComp;
