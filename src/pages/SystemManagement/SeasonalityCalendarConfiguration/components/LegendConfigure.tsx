import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Row, Col, Button, Input, Popover, Divider, Form, Icon, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { formatMessage } from 'umi/locale';
import { ConnectProps } from '@/types/model';
import PrivilegeUtil from '@/utils/PrivilegeUtil';
import pickColor from '@/assets/image/pickColor.png';
import { PeakPeriodStateType, LegendConfig } from '../models/peakPeriod';
import styles from '../index.less';

interface PageProps extends ConnectProps, FormComponentProps {
  peakPeriod: PeakPeriodStateType;
}

const privilege = {
  Seasonality_Calendar_Legend_Add_Privilege: 'Seasonality_Calendar_Legend_Add_Privilege',
  Seasonality_Calendar_Legend_Edit_Privilege: 'Seasonality_Calendar_Legend_Edit_Privilege',
  Seasonality_Calendar_Legend_Delete_Privilege: 'Seasonality_Calendar_Legend_Delete_Privilege',
};

const LegendConfigure: React.FC<PageProps> = props => {
  const {
    dispatch,
    peakPeriod: {
      legendColors,
      legendConfigs,
      displayName,
      displayColor,
      addLegendConfigFlag,
      editLegendConfigFlay,
      editLegendConfigIndex,
      deleteLegendConfigFlay,
    },
  } = props;

  const changeDisplayName = e => {
    dispatch({
      type: 'peakPeriod/save',
      payload: {
        displayName: e.target.value,
      },
    });
  };

  const changeDisplayColor = value => {
    dispatch({
      type: 'peakPeriod/save',
      payload: {
        displayColor: value,
      },
    });
  };

  const addLegendConfigFlagChange = (value: boolean) => {
    dispatch({
      type: 'peakPeriod/save',
      payload: {
        addLegendConfigFlag: value,
        editLegendConfigFlay: false,
        editLegendConfigIndex: null,
        deleteLegendConfigFlay: false,
      },
    });

    if (!addLegendConfigFlag) {
      dispatch({
        type: 'peakPeriod/save',
        payload: {
          displayName: null,
          displayColor: null,
        },
      });
    }
  };

  const addLegendConfig = (item?: LegendConfig) => {
    if (!displayName || displayName.trim() === '') {
      message.warning('Display name is required.');
      return false;
    }

    if (!displayColor) {
      message.warning('Display color is required.');
      return false;
    }

    dispatch({
      type: 'peakPeriod/settingLegendConfigs',
      payload: item ? { legendId: item.legendId } : undefined,
    });
  };

  const editLegendConfig = (item: LegendConfig, index: number) => {
    if (editLegendConfigFlay) {
      dispatch({
        type: 'peakPeriod/save',
        payload: {
          addLegendConfigFlag: false,
          editLegendConfigIndex: index,
          displayName: item.legendName,
          displayColor: item.attractionValue,
        },
      });
    }
  };

  const AddPopover = (item?: LegendConfig) => {
    return (
      <Row className={styles.popoverContainer}>
        <Col span={24}>
          <Col span={8} className={styles.label}>
            {formatMessage({ id: 'DISPLAY_NAME' })}
          </Col>
          <Col span={16}>
            <Input
              allowClear
              maxLength={50}
              value={displayName}
              onChange={changeDisplayName}
              placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
            />
          </Col>
        </Col>
        <Col span={24} style={{ marginTop: '10px' }}>
          <Col span={8} className={styles.label}>
            {formatMessage({ id: 'DISPLAY_COLOR' })}
          </Col>
          <Col span={16} className={styles.pickColorContainer}>
            <span className={styles.img}>
              <img src={pickColor} alt="pickColor" style={{ marginTop: -3 }} />
            </span>
            <span className={styles.colorItemContainer}>
              {legendColors.map((item, index) => (
                <div
                  className={styles.colorItem}
                  style={{ border: displayColor === item.itemValue ? '1px solid #0091ff' : 0 }}
                >
                  <div
                    key={item.itemName}
                    className={styles.color}
                    style={{
                      backgroundColor: item.itemValue,
                    }}
                    onClick={() => {
                      changeDisplayColor(item.itemValue);
                    }}
                  >
                    {displayColor === item.itemValue && (
                      <>
                        <Icon type="plus" className={styles.active} />
                      </>
                    )}
                  </div>
                </div>
              ))}
            </span>
          </Col>
        </Col>
        <Col span={24} className={styles.operation}>
          <Button type="primary" className={styles.ok} onClick={() => addLegendConfig(item)}>
            {formatMessage({ id: 'COMMON_OK' })}
          </Button>
          <Button
            className={styles.cancel}
            onClick={() => {
              if (editLegendConfigIndex !== null) {
                dispatch({
                  type: 'peakPeriod/save',
                  payload: {
                    displayName: null,
                    displayColor: null,
                    editLegendConfigIndex: null,
                  },
                });
              } else {
                addLegendConfigFlagChange(false);
              }
            }}
          >
            {formatMessage({ id: 'COMMON_CANCEL' })}
          </Button>
        </Col>
      </Row>
    );
  };

  return (
    <Row className={styles.legendConfigure}>
      <Col span={24} className={styles.legendConfigureContainer}>
        {legendConfigs.map((item, index) => {
          let context = (
            <div
              key={item.attractionValue}
              className={styles.legendConfigItem}
              onClick={() => editLegendConfig(item, index)}
              style={{
                marginTop: 10,
                marginBottom: 2,
                border: editLegendConfigIndex === index ? '1px solid #D9D9D9' : null,
                backgroundColor: editLegendConfigIndex === index ? '#F5F5F5' : null,
              }}
            >
              <div className={styles.color} style={{ backgroundColor: item.attractionValue }}></div>
              <div className={styles.name}>{item.legendName}</div>
              {PrivilegeUtil.hasAnyPrivilege([
                privilege.Seasonality_Calendar_Legend_Delete_Privilege,
              ]) && (
                <div style={{ width: 15, marginLeft: 10 }}>
                  {editLegendConfigIndex === index && (
                    <Icon
                      type="close"
                      style={{ marginTop: 5, cursor: 'pointer' }}
                      onClick={() => {
                        dispatch({
                          type: 'peakPeriod/save',
                          payload: {
                            deleteLegendConfigFlay: true,
                          },
                        });
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          );

          if (editLegendConfigIndex === index) {
            const PopoverDelete = (
              <div className={styles.popoverContainer}>
                <div className={styles.deleteMsg}>Do you want to delete this tag？</div>
                <div className={styles.operation}>
                  <Button
                    type="primary"
                    className={styles.ok}
                    onClick={() => {
                      dispatch({
                        type: 'peakPeriod/deleteLegendConfigs',
                        payload: { legendConfigs: [{ legendId: item.legendId, opType: 'D' }] },
                      });
                    }}
                  >
                    {formatMessage({ id: 'COMMON_YES' })}
                  </Button>
                  <Button
                    className={styles.cancel}
                    onClick={() => {
                      dispatch({
                        type: 'peakPeriod/save',
                        payload: {
                          deleteLegendConfigFlay: false,
                        },
                      });
                    }}
                  >
                    {formatMessage({ id: 'COMMON_CANCEL' })}
                  </Button>
                </div>
              </div>
            );

            return (
              <Popover
                visible
                trigger="click"
                content={deleteLegendConfigFlay ? PopoverDelete : AddPopover(item)}
                placement="bottomLeft"
                overlayClassName={styles.popover}
              >
                {context}
              </Popover>
            );
          }

          return context;
        })}
        <Col style={{ marginTop: 10, marginBottom: 2 }}>
          {PrivilegeUtil.hasAnyPrivilege([privilege.Seasonality_Calendar_Legend_Add_Privilege]) && (
            <Popover
              trigger="click"
              content={AddPopover()}
              placement="bottomLeft"
              visible={addLegendConfigFlag}
              overlayClassName={styles.popover}
            >
              <Button
                shape="round"
                className={styles.add}
                onClick={() => addLegendConfigFlagChange(true)}
                type={addLegendConfigFlag ? 'primary' : null}
                style={{ color: addLegendConfigFlag ? '#fff' : '#3E84F3' }}
              >
                + {formatMessage({ id: 'COMMON_ADD' })}
              </Button>
            </Popover>
          )}

          {PrivilegeUtil.hasAnyPrivilege([
            privilege.Seasonality_Calendar_Legend_Edit_Privilege,
          ]) && (
            <Button
              shape="round"
              className={styles.edit}
              type={editLegendConfigFlay ? 'primary' : null}
              onClick={() =>
                dispatch({
                  type: 'peakPeriod/save',
                  payload: {
                    addLegendConfigFlag: false,
                    editLegendConfigIndex: null,
                    deleteLegendConfigFlay: false,
                    editLegendConfigFlay: !editLegendConfigFlay,
                  },
                })
              }
              style={{ color: editLegendConfigFlay ? '#fff' : '#3E84F3' }}
            >
              {formatMessage({ id: 'COMMON_EDIT' })}
            </Button>
          )}
        </Col>
      </Col>
    </Row>
  );
};

export default connect(({ peakPeriod }: { peakPeriod: any }) => ({
  peakPeriod,
}))(Form.create<PageProps>()(LegendConfigure));
