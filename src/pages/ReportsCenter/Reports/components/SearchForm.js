import React, { Component } from 'react';
import { connect } from 'dva';
import { Col, Input, Row, Button, Form } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from '../index.less';

const FormItem = Form.Item;

@Form.create()
@connect(({ report }) => ({
  report,
}))
class SearchForm extends Component {
  handleSearch = ev => {
    ev.preventDefault();
    const { form } = this.props;
    const { dispatch } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const { dictName } = values;
        dispatch({
          type: 'report/search',
          payload: {
            filter: {
              likeParam: {
                dictName: dictName ? dictName.replace(/\s+/g, '') : '',
              },
            },
          },
        });
      }
    });
  };

  handleReset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'report/reset',
      payload: {
        currentPage: 1,
        pageSize: 10,
      },
    });
  };

  search = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'report/search',
      payload: {
        filter: {
          likeParam: {
            dictSubTypeName: value,
          },
        },
      },
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch}>
        <div className={styles.searchDiv}>
          <Row>
            <Col className={styles.inputColStyle} xs={12} sm={12} md={6}>
              <FormItem>
                {getFieldDecorator('dictName', {
                  rules: [
                    {
                      required: false,
                    },
                  ],
                })(
                  <Input
                    placeholder={formatMessage({ id: 'REPORT_TYPE' })}
                    allowClear
                    // onSearch={this.search}
                    // onChange={this.searchReportType}
                  />
                )}
              </FormItem>
            </Col>
            <Col className={styles.buttonColStyle} xs={12} sm={12} md={6}>
              <Button className={styles.searchButton} onClick={this.handleReset}>
                Reset
              </Button>
              <Button type="primary" className={styles.searchButton} htmlType="submit">
                Search
              </Button>
            </Col>
          </Row>
        </div>
      </Form>
    );
  }
}

export default SearchForm;
