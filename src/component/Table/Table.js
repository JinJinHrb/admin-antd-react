import React, { Component } from 'react';
import { Table, ConfigProvider } from 'antd';
// import zhCN from 'antd/lib/locale-provider/zh_CN';
import zhCN from 'antd/lib/locale/zh_CN';
import classNames from 'classnames';
import styles from './table.less';

export default class HehTable extends Component {
  constructor() {
    super();
    this.state = {
      selectedRowKeys: [],
    };
  }

  componentDidMount() {}

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });

    if (this.props.selectedRowKeys) {
      this.props.selectedRowKeys(selectedRowKeys);
    }
  };

  render() {
    const {
      dataSource,
      columns,
      onShowSizeChange,
      pageChange,
      loading,
      size,
      bordered,
    } = this.props;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const tableClassNames = classNames({ [styles.antTableWrapper]: true });
    return (
      <ConfigProvider locale={zhCN}>
        <Table
          className={tableClassNames}
          size={size}
          bordered={bordered}
          dataSource={dataSource && dataSource.items}
          columns={columns}
          rowSelection={rowSelection}
          pagination={{
            onChange: pageChange,
            total: dataSource && dataSource['total_count'],
            onShowSizeChange,
            current: dataSource && dataSource['page_index'],
            hideOnSinglePage: false,
            showSizeChanger: true,
            showQuickJumper: true,
            style: { margin: 15 },
            size: 'default',
            showTotal: (total) => `共 ${total} 条`,
          }}
          loading={loading}
          rowKey="id"
        />
      </ConfigProvider>
    );
  }
}
