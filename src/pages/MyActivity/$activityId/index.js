import React from 'react';
import { Breadcrumb, Col, Form, Row } from 'antd';
import { connect } from 'dva';
import { router, withRouter } from 'umi';
import detailStyles from './index.less';
import TASignUpDetail from '@/pages/MyActivity/components/TASignUpDetail';
import SubTASignUpDetail from '@/pages/MyActivity/components/SubTASignUpDetail';
import ApprovalHistory from '@/pages/MyActivity/components/ApprovalHistory';
import OperationApprovalDrawer from '@/pages/MyActivity/components/OperationApprovalDrawer';
import ARApplicationDetail from '@/pages/MyActivity/components/ARApplicationDetail';
import TransactionBookingDetail from '@/pages/MyActivity/components/TransactionBookingDetail';
import CommissionDetail from '../components/CommissionDetail';

@withRouter
@Form.create()
@connect(({ activityDetail, commonSignUpDetail }) => ({
  activityDetail,
  commonSignUpDetail,
}))
class ActivityDetail extends React.PureComponent {
  componentDidMount() {
    const {
      dispatch,
      match: { params },
      location: {
        query: { operation },
      },
    } = this.props;

    dispatch({
      type: 'activityDetail/doCleanAllData',
    });
    if (operation && operation === 'Approval') {
      dispatch({
        type: 'activityDetail/save',
        payload: {
          isOperationApproval: true,
        },
      });
    }
    dispatch({
      type: 'activityDetail/queryActivityDetail',
      payload: {
        activityId: params.activityId,
      },
    }).then(() => {
      const {
        activityDetail: { activityInfo },
      } = this.props;
      const { businessId } = activityInfo;
      dispatch({ type: 'commonSignUpDetail/queryCountryList' });
      if (
        activityInfo.activityTplCode === 'TA-SIGN-UP' ||
        activityInfo.activityTplCode === 'ACCOUNT_AR_APPLY'
      ) {
        dispatch({
          type: 'taSignUpDetail/queryTaInfo',
          payload: {
            taId: businessId,
          },
        }).then(country => {
          dispatch({
            type: 'commonSignUpDetail/queryCityList',
            payload: { countryId: country },
          });
          dispatch({
            type: 'commonSignUpDetail/queryCityList',
            payload: { countryId: country, isBil: true },
          });
        });
        dispatch({ type: 'commonSignUpDetail/querySalutationList' });
        dispatch({ type: 'commonSignUpDetail/queryOrganizationRoleList' });
      } else if (activityInfo.activityTplCode === 'SUB-TA-SIGN-UP') {
        dispatch({
          type: 'subTaSignUpDetail/querySubTaInfo',
          payload: {
            subTaId: businessId,
          },
        });
      }
    });
  }

  routerTo = () => {
    router.push('/MyActivity');
  };

  checkTransactionBookingTplCode = activityTplCode => {
    let result = false;
    switch (activityTplCode) {
      case 'TRANSACTION_PAMS_BOOKING_AUDIT':
      case 'TRANSACTION_PAMS_MAIN_BOOKING':
      case 'TRANSACTION_PAMS_BOOKING':
      case 'TRANSACTION_PAMS_MAIN_REFUND':
      case 'TRANSACTION_PAMS_REVALIDATION':
      case 'TRANSACTION_PAMS_REFUND':
      case 'TRANSACTION_PAMS_MAIN_REVALIDATION': {
        result = true;
        break;
      }
      default: {
        result = false;
      }
    }
    return result;
  };

  render() {
    const { activityDetail = {} } = this.props;
    const {
      activityDetail: {
        activityInfo: { activityTplCode, activityTypeName },
        historyHandlers,
        pendingHandlers,
        isOperationApproval,
        activityInfo
      },
      match: { params },
      // location: {
      //   query: { activityTypeName, feeId },
      // },
    } = this.props;

    const feeId = activityInfo && activityInfo.content ? JSON.parse(activityInfo.content).feeId : ''

    let pendStepTplCode = '';
    if (pendingHandlers.length > 0) {
      const { stepCode } = pendingHandlers[0];
      pendStepTplCode = stepCode;
    }
    return (
      <Row className={detailStyles.container}>
        <Col lg={24} md={24} id="myActivityDetail">
          <Breadcrumb separator=" > " style={{ marginBottom: '10px' }}>
            <Breadcrumb.Item className={detailStyles.BreadcrumbStyle}>
              Travel Agent Management
            </Breadcrumb.Item>
            <Breadcrumb.Item className={detailStyles.BreadcrumbStyle} onClick={this.routerTo}>
              My Activity
            </Breadcrumb.Item>
            <Breadcrumb.Item className={detailStyles.BreadcrumbBold}>
              {' '}
              {isOperationApproval ? 'Approval Detail' : 'Detail'}{' '}
            </Breadcrumb.Item>
          </Breadcrumb>

          {!isOperationApproval && (
            <ApprovalHistory historyHandlers={historyHandlers} pendingHandlers={pendingHandlers} />
          )}

          {activityTplCode && activityTplCode === 'TA-SIGN-UP' ? <TASignUpDetail /> : null}

          {activityTplCode && activityTplCode === 'SUB-TA-SIGN-UP' ? <SubTASignUpDetail /> : null}
          {activityTplCode && activityTplCode === 'ACCOUNT_AR_APPLY' ? (
            <ARApplicationDetail activityDetail={activityDetail} />
          ) : null}

          {(activityTplCode && activityTplCode === 'AGENT_COMMISSION_ATTENDANCE') ||
          activityTplCode === 'AGENT_COMMISSION_TIERED' ? (
            <CommissionDetail activityId={params.activityId} activityTypeName={activityTypeName} feeId={feeId} />
          ) : null}

          {this.checkTransactionBookingTplCode(activityTplCode) && <TransactionBookingDetail />}
        </Col>

        {isOperationApproval && (
          <OperationApprovalDrawer
            activityTplCode={activityTplCode}
            pendStepTplCode={pendStepTplCode}
          />
        )}
      </Row>
    );
  }
}

export default ActivityDetail;
