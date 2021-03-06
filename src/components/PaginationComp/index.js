import React, { PureComponent } from 'react';
import { Pagination } from 'antd';
import MediaQuery from 'react-responsive';
import { formatMessage } from 'umi/locale';

class PaginationComp extends PureComponent {
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
      showTotal: () => `${formatMessage({ id: 'PAGE_TOTAL_ITEMS' }).replace('total', total)}`,
      onChange: (page, pageSize) => pageChange(page, pageSize),
      onShowSizeChange: (page, pageSize) => pageChange(page, pageSize),
      ...otherOpts,
    };
    return (
      <div style={{ textAlign: 'right' }}>
        <MediaQuery maxWidth={767}>{total > 0 && <Pagination simple {...pageOpts} />}</MediaQuery>
        <MediaQuery minWidth={768}>{total > 0 && <Pagination {...pageOpts} />}</MediaQuery>
      </div>
    );
  }
}

export default PaginationComp;
