import React from 'react';
import { Col, Row, Button, Form, Card } from 'antd';
import PropTypes from 'prop-types';
import { formatMessage } from 'umi/locale';
import styles from './index.less';

const calculateSearchButtonSpan = optionCount => {
  const remainder = optionCount % 4;
  return 24 - remainder * 6;
};

const FilterBanner = ({
  form: { getFieldDecorator, getFieldsValue, resetFields },
  filterItems,
  handleSearch,
  handleReset,
}) => {
  const buttonSpan = calculateSearchButtonSpan(filterItems.length);
  const filterItemColProps = { span: 6, xs: 24, sm: 24, md: 6 };
  const buttonColProps = { span: buttonSpan, xs: 24, sm: 24, md: buttonSpan };
  return (
    <>
      <Card className={styles.card}>
        <Row gutter={8} className={styles.searchInputStyles}>
          {filterItems.map(item => {
            return (
              <Col {...filterItemColProps} className="inputColStyles" key={item.name}>
                {getFieldDecorator(item.name, item.options)(item.WrappedComponent)}
              </Col>
            );
          })}
          <Col {...buttonColProps} className="inputColStyles" style={{ textAlign: 'right' }}>
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
      </Card>
    </>
  );
};

FilterBanner.defaultProps = {
  handleReset: () => {},
};

FilterBanner.propTypes = {
  filterItems: PropTypes.array.isRequired,
  handleSearch: PropTypes.func.isRequired,
  handleReset: PropTypes.func,
};

export default Form.create()(FilterBanner);
