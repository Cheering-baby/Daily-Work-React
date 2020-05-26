import React, { useImperativeHandle } from 'react';
import { Button, Card, Col, Form, Row } from 'antd';
import PropTypes from 'prop-types';
import { formatMessage } from 'umi/locale';
import styles from './index.less';

const calcBtnSpan = _count => 24 - (_count % 4) * 6;

const FilterBanner = ({
  form,
  filterItems = [],
  handleSearch,
  handleReset,
  showCardBoarder = true,
  formRef,
}) => {
  const { getFieldDecorator, getFieldsValue, resetFields } = form;
  const btnSpan = calcBtnSpan(filterItems.length);
  const itemColProps = { span: 6, xs: 24, sm: 24, md: 6 };
  const btnColProps = { span: btnSpan, xs: 24, sm: 24, md: btnSpan };

  useImperativeHandle(formRef, () => ({
    form,
  }));

  const children = (
    <Row gutter={8} className={styles.filters}>
      {filterItems.map(item => {
        return (
          <Col {...itemColProps} className={styles.itemCol} key={item.name}>
            {getFieldDecorator(item.name, item.options)(item.WrappedComponent)}
          </Col>
        );
      })}
      <Col {...btnColProps} className={styles.itemCol} style={{ textAlign: 'right' }}>
        <Button
          style={{ width: 80 }}
          type="primary"
          htmlType="button"
          onClick={() => {
            handleSearch({ ...getFieldsValue() });
          }}
        >
          {formatMessage({ id: 'BTN_SEARCH' })}
        </Button>
        <Button
          style={{ marginLeft: 10, width: 80 }}
          htmlType="button"
          onClick={() => {
            resetFields();
            handleReset();
          }}
        >
          {formatMessage({ id: 'BTN_RESET' })}
        </Button>
      </Col>
    </Row>
  );
  return <>{showCardBoarder ? <Card className={styles.card}>{children}</Card> : children}</>;
};

FilterBanner.defaultProps = {
  handleReset: () => {},
  showCardBoarder: true,
};

FilterBanner.propTypes = {
  filterItems: PropTypes.array.isRequired,
  handleSearch: PropTypes.func.isRequired,
  handleReset: PropTypes.func,
  showCardBoarder: PropTypes.bool,
};

export default Form.create()(FilterBanner);
