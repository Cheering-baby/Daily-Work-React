import React, { Component } from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import { formatMessage } from 'umi/locale';
import { Form, Button, Spin, Card, Row, Col, Radio } from 'antd';
import moment from 'moment'
import router from 'umi/router';
import MediaQuery from 'react-responsive';
import styles from './index.less';
import SCREEN from '@/utils/screen';
import BreadcrumbComp from '@/pages/TicketManagement/components/BreadcrumbComp';
import GroupSetting from './components/GroupSetting';
import IndividualSetting from './components/IndividualSetting';
import MyOrderButton from "@/pages/TicketManagement/components/MyOrderButton";

@Form.create()
@connect(({ ticketMgr,onceAPirateTicketMgr }) => ({
  ticketMgr,onceAPirateTicketMgr
}))
class OnceAPirateOrderCart extends Component {

  constructor(props) {
    super(props);
    const clientHeight = document.getElementsByClassName('main-layout-content ant-layout-content')[0].clientHeight - 50;
    this.state = {
      clientHeight,
    };
  }

  componentDidMount() {
    const {
      dispatch,
      location: {
        query: { operateType },
      },
    } = this.props;
    if (operateType && operateType === 'editOnceAPirateOrder') {
      dispatch({
        type: 'onceAPirateTicketMgr/initEditOnceAPirateOrder',
        payload: {},
      });
    } else {
      dispatch({
        type: 'onceAPirateTicketMgr/save',
        payload: {
          orderIndex: null,
          onceAPirateOrder: null,
        },
      });
    }
  }

  cancel = () => {
    router.push(`/TicketManagement/Ticketing/CreateOrder?operateType=return`);
  };

  typeChange = e => {
    const { dispatch } = this.props;
    dispatch({
      type: 'onceAPirateTicketMgr/save',
      payload: {
        settingMethodType: e.target.value,
      },
    });
  };

  orderEvent = () => {
    const {
      dispatch,
      onceAPirateTicketMgr: {
        settingMethodType,
        onceAPirateOrderData
      },
      form
    } = this.props;
    form.validateFields((err) => {
      if (!err) {
        if (settingMethodType==='1') {
          for (const offerOrderDetail of onceAPirateOrderData) {
            let orderMealSum = 0;
            for (const mealsItem of offerOrderDetail.orderInfo.groupSettingList){
              orderMealSum+=mealsItem.number;
            }
            if (offerOrderDetail.orderInfo.orderQuantity<orderMealSum) {
              message.warn(`The ${offerOrderDetail.offerInfo.offerName} meals number summer more than offer order quantity ${offerOrderDetail.orderInfo.orderQuantity}`);
              return;
            } else if (offerOrderDetail.orderInfo.orderQuantity>orderMealSum) {
              message.warn(`The ${offerOrderDetail.offerInfo.offerName} meals number summer less than offer order quantity ${offerOrderDetail.orderInfo.orderQuantity}`);
              return;
            }
          }
        } else {
          console.log('INDIVIDUAL_SETTING');
        }
        dispatch({
          type: 'onceAPirateTicketMgr/orderToCheck',
          payload: {
          },
        });

      }
    });
  };

  clickOrder = () => {
    router.push(`/TicketManagement/Ticketing/OrderCart/CheckOrder`);
  };

  render() {

    const {
      ticketMgr: {
        tipVisible,
      },
      onceAPirateTicketMgr: {
        queryInfo,
        settingMethodType,
      },
      form,
    } = this.props;
    const { getFieldDecorator } = form;

    const {
      clientHeight,
    } =  this.state;

    const title = [{ name: 'Ticketing' }, { name: 'Create Order', href: '#/TicketManagement/Ticketing/CreateOrder?operateType=goBack' }, { name: 'Add to Cart' }];
    const gridOpts = { xs: 24, sm: 24, md: 12, lg:12, xl: 12, xxl: 12 };
    const formItemLayout = {
      labelCol: {
        xs: {span: 10},
        sm: {span: 9},
        md: {span: 8},
        lg: {span: 8},
        xl: {span: 8},
        xxl: {span: 8},
      },
      wrapperCol: {
        xs: {span: 14},
        sm: {span: 15},
        md: {span: 16},
        lg: {span: 16},
        xl: {span: 16},
        xxl: {span: 16},
      },
      colon: false,
    };

    return (
      <Spin spinning={false}>
        <Row gutter={12}>
          <Col span={12} className={styles.marginBottom8}>
            <MediaQuery minWidth={SCREEN.screenSm}>
              <div style={{ height: 34 }}>
                <BreadcrumbComp title={title} />
              </div>
            </MediaQuery>
          </Col>
          <Col span={12} className={styles.marginBottom8}>
            <MyOrderButton
              tipVisible={tipVisible}
              tipString = {formatMessage({ id: 'ORDER_TITLE_TIP' })}
              onClickOrder={() => this.clickOrder()}
            />
          </Col>
        </Row>
        <Card className={styles.cardBoxShadow} bodyStyle={{ padding: 0 }} style={{ minHeight: clientHeight }}>
          <Row style={{'padding':'15px',marginBottom: '60px'}}>
            <Col span={24}>
              <Row>
                <Col span={24} className={styles.titleBlack}>
                  {formatMessage({ id: 'BASIC_INFORMATION' })}
                </Col>
              </Row>
              <Row>
                <Col {...gridOpts} className={styles.basicInfoContent}>
                  <Col span={8}>{formatMessage({ id: 'Ticketing' })}</Col>
                  <Col span={16}>Once A Pirate</Col>
                </Col>
                <Col {...gridOpts} className={styles.basicInfoContent}>
                  <Col span={8}>{formatMessage({ id: 'DATE_OF_VISIT' })}</Col>
                  <Col span={16}>{ queryInfo && queryInfo.dateOfVisit ? moment(queryInfo.dateOfVisit, 'x').format('DD-MMM-YYYY') : '-'}</Col>
                </Col>
                <Col {...gridOpts} className={styles.basicInfoContent}>
                  <Col span={8}>{formatMessage({ id: 'SESSION_TIME' })}</Col>
                  <Col span={16}>{ queryInfo && queryInfo.sessionTime ? queryInfo.sessionTime : '-'}</Col>
                </Col>
              </Row>
              <Row>
                <Col span={24} className={styles.titleBlack}>
                  {formatMessage({ id: 'DINING_SETTING' })}
                </Col>
              </Row>
              <Form
                className={styles.formStyle}
              >
                <Row gutter={24}>
                  <Col md={12} sm={24} xs={24}>
                    <Form.Item
                      label={formatMessage({ id:
                          'SETTING_METHOD' })}
                      {...formItemLayout}
                    >
                      {getFieldDecorator('settingMethodType', {
                        rules: [{ required: true, message: 'Required' }],
                        initialValue: settingMethodType
                      })(
                        <Radio.Group onChange={this.typeChange} >
                          <Radio value='1'>{formatMessage({ id: 'GROUP_SETTING' })}</Radio>
                          <Radio value='2'>{formatMessage({ id: 'INDIVIDUAL_SETTING' })}</Radio>
                        </Radio.Group>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    {
                      settingMethodType === '1' && (
                        <GroupSetting form={form} />
                      )
                    }
                    {
                      settingMethodType === '2' && (
                        <IndividualSetting form={form} />
                      )
                    }
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
          <Row className={styles.buttonControlRow}>
            <Col span={24} >
              <MediaQuery minWidth={SCREEN.screenSm}>
                <div className={styles.buttonControl} style={{ padding: '15px' }}>
                  <Button htmlType='button' onClick={this.cancel}>
                    {formatMessage({ id: 'CANCEL' })}
                  </Button>
                  <Button style={{ marginLeft: 8 }} htmlType='button' type='primary' onClick={this.orderEvent}>
                    {formatMessage({ id: 'ORDER' })}
                  </Button>
                </div>
              </MediaQuery>
              <MediaQuery maxWidth={SCREEN.screenSm - 1}>
                <div className={styles.buttonControl} style={{ padding: 8 }}>
                  <Button htmlType='button' block onClick={this.cancel}>
                    {formatMessage({ id: 'CANCEL' })}
                  </Button>
                  <Button block style={{ marginTop: 8 }} htmlType='button' type='primary' onClick={this.orderEvent}>
                    {formatMessage({ id: 'ORDER' })}
                  </Button>
                </div>
              </MediaQuery>
            </Col>
          </Row>
        </Card>
      </Spin>
    );
  }
}

export default OnceAPirateOrderCart;
