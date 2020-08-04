import React from 'react';
import { Card, Col, Row } from 'antd';
import { connect } from 'dva';
import CommissionFee from './DetailForInformation/CommissionFee';
import CommissionFeeList from './DetailForInformation/CommissionFeeList';
import FileUpload from './DetailForInformation/FileUpload';
import styles from "./index.less";

@connect(({ taSignUpDetail, commissionFee }) => ({
  taSignUpDetail,
  commissionFee,
}))
class ARApplicationDetail extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  state = {
    downFileLoadingFlag: false,
  };

  componentDidMount() {
    const {
      dispatch,
      taSignUpDetail: { customerInfo },
      feeId,
    } = this.props;

    const { companyInfo = {} } = customerInfo || {};
    dispatch({
      type: 'commonSignUpDetail/queryCityList',
      payload: { countryId: companyInfo.country },
    });
    dispatch({
      type: 'commonSignUpDetail/queryCityList',
      payload: { countryId: companyInfo.country, isBil: true },
    });
    dispatch({
      type: 'commissionFee/queryCommissionDeatil',
      payload: {
        feeId: feeId,
      },
    });
  }

  render() {
    const {
      // taSignUpDetail: { otherInfo = {}, customerInfo = {} },
      commissionFee: { feeDetailList = [] },
    } = this.props;
    const { downFileLoadingFlag = false } = this.state;
    // const customerInfo = feeDetailList.filter(item => item.commissionType === activityTypeName)
    const tieredList = feeDetailList ? feeDetailList.tieredList : [];
    return (
      <React.Fragment>
        <Col lg={24} md={24} className={styles.container}>
          <Col span={24}>
            <Card>
            <Row type="flex" justify="space-around">
                <Col span={24}>
                  {feeDetailList && (
                    <FileUpload
                      companyInfo={feeDetailList}
                      downFileLoadingFlag={downFileLoadingFlag}
                      updateDownFileLoading={val => this.setState(val)}
                    />
                  )}
                </Col>
              <Col span={24}>
              <CommissionFee customerInfo={feeDetailList} />
              </Col>
              <Col span={24}>
              <CommissionFeeList tieredList={tieredList} />
              </Col>
              </Row>
            </Card>
          </Col>
        </Col>

      </React.Fragment>
    );
  }
}

export default ARApplicationDetail;
