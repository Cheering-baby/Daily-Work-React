import React from 'react';
import { DatePicker, Input, Select, Spin } from 'antd';
import { formatMessage } from 'umi/locale';
import { DATE_FORMAT } from '@/pages/TAManagement/BuyerCreatedInvoice/consts/buyerCreatedInvoice';
import FilterBanner from '@/pages/TAManagement/BuyerCreatedInvoice/components/FilterBanner';

const InvoiceFilterBanner = ({
  handleSearch,
  handleReset,
  fetchTaNameListLoadingFlag,
  buyerCreatedInvoice: { taNameList = [] },
}) => {
  const filterItems = [
    {
      name: 'agentCode',
      text: formatMessage({ id: 'AGENT_CODE' }),
      WrappedComponent: <Input placeholder={formatMessage({ id: 'AGENT_CODE' })} allowClear />,
    },
    {
      name: 'taName',
      text: formatMessage({ id: 'TA_NAME' }),
      WrappedComponent: (
        <Select
          showSearch
          allowClear
          placeholder={formatMessage({ id: 'TA_NAME' })}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          defaultActiveFirstOption={false}
          notFoundContent={fetchTaNameListLoadingFlag && <Spin size="small" />}
        >
          {taNameList.map(item => (
            <Select.Option key={item} value={item}>
              {item}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      name: 'invoiceDate',
      text: formatMessage({ id: 'INVOICE_DATE' }),
      WrappedComponent: (
        <DatePicker.RangePicker
          placeholder={[
            formatMessage({ id: 'INVOICE_DATE_FROM' }),
            formatMessage({ id: 'INVOICE_DATE_TO' }),
          ]}
          style={{ width: '100%' }}
          format={DATE_FORMAT}
        />
      ),
    },
  ];

  return (
    <>
      <FilterBanner
        filterItems={filterItems}
        handleSearch={handleSearch}
        handleReset={handleReset}
      />
    </>
  );
};

export default InvoiceFilterBanner;
