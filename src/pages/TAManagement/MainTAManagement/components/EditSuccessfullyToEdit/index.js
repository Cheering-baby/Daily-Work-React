import React, { PureComponent } from 'react';
import { Button, Col, Row } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import { formatMessage } from 'umi/locale';
import successURL from '../../../../../assets/pams/signup/success.svg';
import styles from './index.less';

const mapStateToProps = store => {
  const { taId } = store.taMgr;
  return {
    taId,
  };
};

@connect(mapStateToProps)
class EditSuccessfullyToEdit extends PureComponent {
  closeEdit = e => {
    e.preventDefault();
    router.push(`/TAManagement/MainTAManagement`);
  };

  showViewInformation = e => {
    e.preventDefault();
    const { taId } = this.props;
    router.push(`/TAManagement/MainTAManagement/Detail?taId=${taId}`);
  };

  render() {
    return (
      <React.Fragment>
        <Row type="flex" justify="space-around" className={styles.editSuccessfullyRow}>
          <Col span={24} className={styles.editSuccessfullyTop}>
            <img src={successURL} alt="" />
          </Col>
          <Col span={24} className={styles.editSuccessfullyContent}>
            <h3>{formatMessage({ id: 'COMPLETED_EDIT_SUBMITTED_SUCCESS' })}</h3>
            {/*<p>{formatMessage({ id: 'COMPLETED_SUCCESS_MESSAGE' })}</p>*/}
          </Col>
          <Col span={24} className={styles.editSuccessfullyBottom}>
            <Button htmlType="button" loading={false} onClick={e => this.closeEdit(e)}>
              {formatMessage({ id: 'COMPLETED_CLOSE' })}
            </Button>
            <Button
              htmlType="button"
              type="primary"
              loading={false}
              onClick={e => this.showViewInformation(e)}
            >
              {formatMessage({ id: 'COMPLETED_VIEW_INFORMATION' })}
            </Button>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default EditSuccessfullyToEdit;
