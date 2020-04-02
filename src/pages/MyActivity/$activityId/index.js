import React from 'react';
import { Breadcrumb, Col, Form } from 'antd';
import { connect } from 'dva';
import { router, withRouter } from 'umi';
import detailStyles from './index.less';
import TASignUpDetail from '@/pages/MyActivity/components/TASignUpDetail';
import SubTASignUpDetail from '@/pages/MyActivity/components/SubTASignUpDetail';
import { isNvl } from '@/utils/utils';
import ApprovalHistory from '@/pages/MyActivity/components/ApprovalHistory';
import OperationApprovalDrawer from '@/pages/MyActivity/components/OperationApprovalDrawer';

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
      dispatch({ type: 'commonSignUpDetail/queryCountryList' }).then(flag => {
        const {
          commonSignUpDetail: { countryList },
        } = this.props;
        if (flag && isNvl(businessId) && countryList && countryList.length > 0) {
          const countryInfo = countryList[0];
          dispatch({
            type: 'commonSignUpDetail/queryCityList',
            payload: { countryId: countryInfo.dictId },
          });
          dispatch({
            type: 'commonSignUpDetail/queryCityList',
            payload: { countryId: countryInfo.dictId, isBil: true },
          });
        }
      });
      if (activityInfo.activityTplCode === 'TA-SIGN-UP') {
        dispatch({
          type: 'taSignUpDetail/queryTaInfo',
          payload: {
            taId: businessId,
          },
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

  render() {
    const {
      activityDetail: {
        activityInfo: { activityTplCode, historyHandlers, pendingHandlers },
        isOperationApproval,
      },
    } = this.props;
    return (
      <React.Fragment>
        <Col lg={24} md={24} id="myActivityDetail">
          <Breadcrumb separator=" > " style={{ marginBottom: '10px' }}>
            <Breadcrumb.Item className={detailStyles.BreadcrumbStyle}>
              TA Management
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
        </Col>

        {isOperationApproval && <OperationApprovalDrawer activityTplCode={activityTplCode} />}
      </React.Fragment>
    );
  }
}

export default ActivityDetail;
