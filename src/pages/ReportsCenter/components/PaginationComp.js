import React, { Component } from 'react';
import { Pagination } from 'antd';
import MediaQuery from 'react-responsive';

class PaginationComp extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    const {
      total = 0,
      current = 1,
      pageSize: nowPageSize = 10,
      pageChange = () => {},
      ...otherOpts
    } = this.props;

    const pageOpts = {
      size: 'small',
      showSizeChanger: true,
      showQuickJumper: true,
      total,
      current,
      pageSize: nowPageSize,
      showTotal: () => `Total ${total} items`,
      onChange: (page, pageSize) => pageChange(page, pageSize),
      onShowSizeChange: (page, pageSize) => pageChange(page, pageSize),
      ...otherOpts,
    };

    return (
      <div style={{ textAlign: 'right', margin: '0 9px 9px' }}>
        <MediaQuery maxWidth={767}>{total > 0 && <Pagination simple {...pageOpts} />}</MediaQuery>
        <MediaQuery minWidth={768}>{total > 0 && <Pagination {...pageOpts} />}</MediaQuery>
      </div>
    );
  }
}

export default PaginationComp;
