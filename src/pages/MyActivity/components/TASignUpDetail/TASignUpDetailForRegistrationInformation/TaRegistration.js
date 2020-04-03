import React from 'react';
import { Card, Col, Form, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import detailStyles from './TaRegistration.less';
import ContactInformation from '@/pages/MyActivity/components/TASignUpDetail/TASignUpDetailForRegistrationInformation/ContactInformation';
import QuestionsInformation from '@/pages/MyActivity/components/TASignUpDetail/TASignUpDetailForRegistrationInformation/QuestionsInformation';
import BillingInformation from '@/pages/MyActivity/components/TASignUpDetail/TASignUpDetailForRegistrationInformation/BillingInformation';
import TaFinanceContact from '@/pages/MyActivity/components/TASignUpDetail/TASignUpDetailForRegistrationInformation/TaFinanceContact';
import CompanyInformation from '@/pages/MyActivity/components/TASignUpDetail/TASignUpDetailForRegistrationInformation/CompanyInformation';

@Form.create()
@connect(({ commonSignUpDetail }) => ({
  commonSignUpDetail,
}))
class TaRegistration extends React.PureComponent {
  componentDidMount() {}

  render() {
    const {
      commonSignUpDetail: {
        countryList = [],
        cityList = [],
        bilCityList = [],
        salutationList = [],
        organizationRoleList = [],
      },
      otherInfo = {},
      customerInfo = {},
    } = this.props;
    const detailProps = {
      countryList,
      cityList,
      bilCityList,
      salutationList,
      organizationRoleList,
    };
    return (
      <Col span={24}>
        <Row type="flex" justify="space-around">
          <Col span={24} className={detailStyles.activityCard}>
            <Card>
              <Row type="flex" justify="space-around">
                <Col span={24}>
                  <div>
                    <span className={detailStyles.titleHeader}>
                      {formatMessage({ id: 'TA_REGISTRATION_INFORMATION' })}
                    </span>
                  </div>

                  <Col span={24} className={detailStyles.activityCard}>
                    <Card>
                      <Row type="flex" justify="space-around">
                        <Col span={24}>
                          {customerInfo && customerInfo.contactInfo && (
                            <ContactInformation
                              contactInfo={customerInfo.contactInfo}
                              {...detailProps}
                            />
                          )}
                        </Col>
                      </Row>
                    </Card>
                  </Col>

                  <Col span={24} className={detailStyles.activityCard}>
                    <Card>
                      <Row type="flex" justify="space-around">
                        <Col span={24}>
                          {customerInfo && customerInfo.companyInfo && (
                            <CompanyInformation
                              companyInfo={customerInfo.companyInfo}
                              {...detailProps}
                            />
                          )}
                        </Col>
                      </Row>
                    </Card>
                  </Col>

                  <Col span={24} className={detailStyles.activityCard}>
                    <Card>
                      <Row type="flex" justify="space-around">
                        <Col span={24}>
                          {customerInfo && customerInfo.companyInfo && (
                            <QuestionsInformation
                              companyInfo={customerInfo.companyInfo}
                              {...detailProps}
                            />
                          )}
                        </Col>
                      </Row>
                    </Card>
                  </Col>

                  <Col span={24} className={detailStyles.activityCard}>
                    <Card>
                      <Row type="flex" justify="space-around">
                        <Col span={24}>
                          {otherInfo && otherInfo.billingInfo && (
                            <BillingInformation
                              billingInfo={otherInfo.billingInfo}
                              {...detailProps}
                            />
                          )}
                        </Col>
                      </Row>
                    </Card>
                  </Col>

                  <Col span={24} className={detailStyles.activityCard}>
                    <Card>
                      <Row type="flex" justify="space-around">
                        <Col span={24}>
                          {otherInfo && otherInfo.financeContactList && (
                            <TaFinanceContact
                              financeContactList={otherInfo.financeContactList}
                              {...detailProps}
                            />
                          )}
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Col>
    );
  }
}

export default TaRegistration;