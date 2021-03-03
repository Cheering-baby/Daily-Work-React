import React, { useEffect } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Tooltip, Input, Switch, DatePicker, Form, Icon, Button, Select } from 'antd';
import { timeFixed } from '@/utils/utils';
import { FormComponentProps } from 'antd/es/form';
import { formatMessage } from 'umi/locale';
import { ConnectProps } from '@/types/model';
import PrivilegeUtil from '@/utils/PrivilegeUtil';
import { PeakPeriodStateType, LegendConfig, themeParkPeriod } from '../models/peakPeriod';
import styles from '../index.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;

const privilege = {
  Seasonality_Calendar_Peak_Period_Add_Privilege: 'Seasonality_Calendar_Peak_Period_Add_Privilege',
  Seasonality_Calendar_Peak_Period_Edit_Privilege:
    'Seasonality_Calendar_Peak_Period_Edit_Privilege',
  Seasonality_Calendar_Peak_Period_Delete_Privilege:
    'Seasonality_Calendar_Peak_Period_Delete_Privilege',
};

const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 6 },
    md: { span: 6 },
    lg: {
      span: 6,
    },
    xl: {
      span: 8,
    },
    xxl: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: { span: 18 },
    sm: { span: 18 },
    md: { span: 18 },
    lg: {
      span: 18,
    },
    xl: {
      span: 16,
    },
    xxl: {
      span: 16,
    },
  },
  colon: false,
};

interface PageProps extends ConnectProps, FormComponentProps {
  peakPeriod: PeakPeriodStateType;
}

const BookingCategory: React.FC<PageProps> = props => {
  const {
    dispatch,
    peakPeriod: { themeParkPeriods, legendConfigs },
    form: { getFieldDecorator, validateFields, resetFields, setFieldsValue },
  } = props;

  const themeParkPeriodsSave = (value: themeParkPeriod[]) => {
    dispatch({
      type: 'peakPeriod/save',
      payload: {
        themeParkPeriods: value,
      },
    });
  };

  const showDetailChange = (index: number, status: boolean) => {
    const themeParkPeriodsCopy: themeParkPeriod[] = JSON.parse(JSON.stringify(themeParkPeriods));
    themeParkPeriodsCopy[index].showDetail = status;

    themeParkPeriodsSave(themeParkPeriodsCopy);
  };

  const checkedChange = (index: number, status: boolean) => {
    const themeParkPeriodsCopy: themeParkPeriod[] = JSON.parse(JSON.stringify(themeParkPeriods));
    themeParkPeriodsCopy[index].peakPeriodShow = status ? 0 : 1;

    themeParkPeriodsSave(themeParkPeriodsCopy);
  };

  const addPeakPeriodConfig = (index: number) => {
    const themeParkPeriodsCopy: themeParkPeriod[] = JSON.parse(JSON.stringify(themeParkPeriods));
    themeParkPeriodsCopy[index].peakPeriodConfigs.push({ opType: 'A' });

    themeParkPeriodsSave(themeParkPeriodsCopy);
  };

  const deletePeakPeriodConfig = (themeParkIndex: number, deleteIndexPeakPeriod: number) => {
    const themeParkPeriodsCopy: themeParkPeriod[] = JSON.parse(JSON.stringify(themeParkPeriods));

    const deleteItem = themeParkPeriods[themeParkIndex].peakPeriodConfigs[deleteIndexPeakPeriod];
    if (deleteItem.opType === 'U') {
      themeParkPeriodsCopy[themeParkIndex].deletePeakPeriods.push({ ...deleteItem, opType: 'D' });
    }

    themeParkPeriodsCopy[themeParkIndex].peakPeriodConfigs = themeParkPeriodsCopy[
      themeParkIndex
    ].peakPeriodConfigs.filter((_, index) => deleteIndexPeakPeriod !== index);

    themeParkPeriodsSave(themeParkPeriodsCopy);
  };

  const legendChange = (
    themeParkIndex: number,
    peakPeriodIndex: number,
    value: any,
    dateSettingLabel: string,
    remarksLabel: string
  ) => {
    const themeParkPeriodsCopy: themeParkPeriod[] = JSON.parse(JSON.stringify(themeParkPeriods));
    themeParkPeriodsCopy[themeParkIndex].peakPeriodConfigs[peakPeriodIndex].legendId = value;
    themeParkPeriodsCopy[themeParkIndex].peakPeriodConfigs[peakPeriodIndex].startDate = null;
    themeParkPeriodsCopy[themeParkIndex].peakPeriodConfigs[peakPeriodIndex].endDate = null;
    themeParkPeriodsCopy[themeParkIndex].peakPeriodConfigs[peakPeriodIndex].remarks = null;

    setFieldsValue({
      [dateSettingLabel]: undefined,
      [remarksLabel]: undefined,
    });

    themeParkPeriodsSave(themeParkPeriodsCopy);
  };

  const OK = () => {
    validateFields(errs => {
      if (!errs) {
        dispatch({
          type: 'peakPeriod/settingPeakPeriods',
        }).then(() => {
          resetFields();
        });
      }
    });
  };

  const dateSettingChange = (themeParkIndex: number, peakPeriodIndex: number, dates: any) => {
    const [startDate, endDate] = dates;
    const themeParkPeriodsCopy: themeParkPeriod[] = JSON.parse(JSON.stringify(themeParkPeriods));

    themeParkPeriodsCopy[themeParkIndex].peakPeriodConfigs[peakPeriodIndex].startDate = startDate
      ? moment(startDate).format('YYYY-MM-DD')
      : null;

    themeParkPeriodsCopy[themeParkIndex].peakPeriodConfigs[peakPeriodIndex].endDate = endDate
      ? moment(endDate).format('YYYY-MM-DD')
      : null;

    themeParkPeriodsSave(themeParkPeriodsCopy);

    const validFields = [];

    themeParkPeriodsCopy[themeParkIndex].peakPeriodConfigs.forEach((item, index) => {
      const dateSettingLabel = `${themeParkPeriodsCopy[themeParkIndex].themeParkCode}_dateSetting_${index}`;
      validFields.push(dateSettingLabel);
    });


    setTimeout(() => {
      validateFields(validFields);
    }, 100);
  };

  const remarksChange = (themeParkIndex: number, peakPeriodIndex: number, e: any) => {
    const themeParkPeriodsCopy: themeParkPeriod[] = JSON.parse(JSON.stringify(themeParkPeriods));

    themeParkPeriodsCopy[themeParkIndex].peakPeriodConfigs[peakPeriodIndex].remarks =
      e.target.value;

    themeParkPeriodsSave(themeParkPeriodsCopy);
  };

  return (
    <Row className={styles.bookingCategory}>
      {themeParkPeriods.map((themeParkPeriod, themeParkIndex) => {
        const {
          themeParkCode,
          themeParkName,
          peakPeriodConfigs = [],
          peakPeriodShow,
          showDetail,
        } = themeParkPeriod;
        return (
          <div className={styles.peakItem} key={themeParkCode}>
            <div className={styles.peakItemTitle}>
              {showDetail ? (
                <Icon
                  type="caret-down"
                  className={styles.showIcon}
                  onClick={() => showDetailChange(themeParkIndex, false)}
                />
              ) : (
                <Icon
                  type="caret-right"
                  className={styles.showIcon}
                  onClick={() => showDetailChange(themeParkIndex, true)}
                />
              )}
              <div className={styles.themeParkName}>{themeParkName}</div>
              <Switch
                checkedChildren="Y"
                unCheckedChildren="N"
                checked={peakPeriodShow === 0 ? true : false}
                onChange={value => checkedChange(themeParkIndex, value)}
              />

              <div style={{ marginLeft: 10, fontWeight: 'normal' }}>
                {formatMessage({ id: 'COMMON_ACTIVE' })}
              </div>
            </div>
            {showDetail && (
              <Row>
                <Form hideRequiredMark>
                  <Col span={24}>
                    {peakPeriodConfigs.map((peakPeriodConfig, peakPeriodIndex) => {
                      const { startDate, endDate, legendId, remarks } = peakPeriodConfig;
                      const legendLabel = `${themeParkCode}_legend_${peakPeriodIndex}`;
                      const dateSettingLabel = `${themeParkCode}_dateSetting_${peakPeriodIndex}`;
                      const remarksLabel = `${themeParkCode}_remarks_${peakPeriodIndex}`;

                      return (
                        <Col
                          xs={24}
                          sm={24}
                          md={24}
                          lg={12}
                          xl={12}
                          xxl={12}
                          key={legendLabel}
                          style={{ paddingRight: 20 }}
                        >
                          <FormItem
                            {...formItemLayout}
                            style={{ position: 'relative' }}
                            label={formatMessage({ id: 'LEGEND_LABEL' })}
                          >
                            {getFieldDecorator(legendLabel, {
                              initialValue: legendId,
                              rules: [
                                {
                                  required: true,
                                  message: 'Required',
                                },
                              ],
                            })(
                              <Select
                                allowClear
                                style={{ width: '100%' }}
                                placeholder={formatMessage({ id: 'COMMON_SELECT_ICON' })}
                                dropdownClassName={styles.dropdownClassName}
                                onChange={value =>
                                  legendChange(
                                    themeParkIndex,
                                    peakPeriodIndex,
                                    value,
                                    dateSettingLabel,
                                    remarksLabel
                                  )
                                }
                              >
                                {legendConfigs.map(legendConfig => (
                                  <Option value={legendConfig.legendId} key={legendConfig.legendId}>
                                    <div className={styles.legendConfigItem}>
                                      <span
                                        className={styles.colorOption}
                                        style={{ backgroundColor: legendConfig.attractionValue }}
                                      ></span>
                                      <Tooltip
                                        title={
                                          <span style={{ whiteSpace: 'pre-wrap' }}>
                                            {legendConfig.legendName}
                                          </span>
                                        }
                                        placement="topLeft"
                                      >
                                        <span className={styles.legendName}>
                                          {legendConfig.legendName}
                                        </span>
                                      </Tooltip>
                                    </div>
                                  </Option>
                                ))}
                              </Select>
                            )}
                            {PrivilegeUtil.hasAnyPrivilege([
                              privilege.Seasonality_Calendar_Peak_Period_Delete_Privilege,
                            ]) && (
                              <div className={styles.close}>
                                <Tooltip title="Delete">
                                  <Icon
                                    type="close"
                                    style={{ marginTop: '10px', cursor: 'pointer' }}
                                    onClick={() =>
                                      deletePeakPeriodConfig(themeParkIndex, peakPeriodIndex)
                                    }
                                  />
                                </Tooltip>
                              </div>
                            )}
                          </FormItem>
                          <FormItem
                            {...formItemLayout}
                            label={formatMessage({ id: 'DATE_SETTING' })}
                          >
                            {getFieldDecorator(dateSettingLabel, {
                              initialValue: startDate ? timeFixed(startDate, endDate) : undefined,
                              rules: [
                                {
                                  required: true,
                                  message: 'Required',
                                },
                                {
                                  validator: (rule, value, callback) => {
                                    const [currentStartDate, currentEndDate] = value || [];
                                    const findDuplicate = peakPeriodConfigs.find(
                                      (item, itemIndex) => {
                                        if (itemIndex === peakPeriodIndex) {
                                          return false;
                                        }

                                        if (
                                          item.startDate &&
                                          item.endDate &&
                                          currentStartDate &&
                                          currentEndDate &&
                                          legendId === item.legendId
                                        ) {
                                          if (
                                            !(
                                              moment(item.endDate).startOf('D') <
                                                currentStartDate.startOf('D') ||
                                              moment(item.startDate).startOf('D') >
                                                currentEndDate.startOf('D')
                                            )
                                          ) {
                                            return true;
                                          }
                                        }

                                        return false;
                                      }
                                    );

                                    if (findDuplicate) {
                                      callback('Date setting duplicate');
                                    }

                                    callback();
                                  },
                                },
                              ],
                            })(
                              <RangePicker
                                allowClear
                                format="YYYY-MMM-DD"
                                style={{ width: '100%' }}
                                dropdownClassName={styles.range}
                                placeholder={[
                                  formatMessage({ id: 'COMMON_RANGE_START_PLACE' }),
                                  formatMessage({ id: 'COMMON_RANGE_END_PLACE' }),
                                ]}
                                onChange={dates =>
                                  dateSettingChange(themeParkIndex, peakPeriodIndex, dates)
                                }
                              />
                            )}
                          </FormItem>
                          <FormItem {...formItemLayout} label={formatMessage({ id: 'REMARKS' })}>
                            {getFieldDecorator(remarksLabel, {
                              initialValue: remarks,
                              rules: [
                                {
                                  required: false,
                                  message: 'Required',
                                },
                              ],
                            })(
                              <Input
                                allowClear
                                maxLength={500}
                                placeholder={formatMessage({ id: 'COMMON_ENTER_ICON' })}
                                onChange={e => remarksChange(themeParkIndex, peakPeriodIndex, e)}
                              />
                            )}
                          </FormItem>
                        </Col>
                      );
                    })}
                    {PrivilegeUtil.hasAnyPrivilege([
                      privilege.Seasonality_Calendar_Peak_Period_Add_Privilege,
                    ]) && (
                      <Col span={24} style={{ marginTop: 10 }}>
                        <Col sm={6} md={6} lg={4} xl={4} xxl={4} />
                        <Col span={6}>
                          <div style={{ marginLeft: 10 }}>
                            <div
                              className={styles.addPeriodItem}
                              onClick={() => addPeakPeriodConfig(themeParkIndex)}
                            >
                              + {formatMessage({ id: 'COMMON_ADD' })}
                            </div>
                          </div>
                        </Col>
                      </Col>
                    )}
                  </Col>
                </Form>
              </Row>
            )}
          </div>
        );
      })}
      {PrivilegeUtil.hasAnyPrivilege([
        privilege.Seasonality_Calendar_Peak_Period_Edit_Privilege,
      ]) && (
        <Col span={24} className={styles.operation}>
          <Button style={{ width: '60px', float: 'right' }} onClick={OK} type="primary">
            {formatMessage({ id: 'COMMON_MODIFY' })}
          </Button>
        </Col>
      )}
    </Row>
  );
};

export default connect(({ peakPeriod }: { peakPeriod: any }) => ({
  peakPeriod,
}))(Form.create<PageProps>()(BookingCategory));
