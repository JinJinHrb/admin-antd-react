import React, { Component } from 'react';
import { Button, Card, Divider, Popconfirm, Row, ConfigProvider } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import Table from '../../component/Table';
import { NewForm } from '../../component/NewForm';
import Search from '../../component/Search';
import zhCN from 'antd/lib/locale/zh_CN';

const modelFindPage = 'roleToNamespace/findPage';
const modelFindObject = 'roleToNamespace/findObject';
const modelUpdate = 'roleToNamespace/update';
const modelAdd = 'roleToNamespace/add';
const modelBatchDelete = 'roleToNamespace/batchDelete';
const modelClearDefaultValue = 'roleToNamespace/clearDefaultValue';

@connect(({ roleToNamespace, loading }) => ({
  roleToNamespace,
  pageLoading: loading.effects[modelFindPage],
  detailLoading: loading.effects[modelFindObject],
  updateLoading: loading.effects[modelUpdate],
  addLoading: loading.effects[modelAdd],
  batchDeleteLoading: loading.effects[modelBatchDelete],
}))
class Index extends Component {
  /*======================================================页面变量 start======================================================*/

  state = {
    search: {
      page_index: 1,
      page_size: 10,
    },
    selectedRowKeys: [],
    visible: false,
    editStatus: false,
  };

  /*======================================================页面变量 end======================================================*/

  /*======================================================页面 JS 方法 start======================================================*/

  componentDidMount() {
    this.serviceFindPage();
  }

  serviceFindPage = () => {
    this.props.dispatch({
      type: modelFindPage,
      payload: this.state.search,
    });
  };

  eventPageChange = (page) => {
    Object.assign(this.state.search, { page_index: page });
    this.serviceFindPage();
  };

  eventShowSizeChange = (current, rows) => {
    Object.assign(this.state.search, { page_size: rows, page_index: current });
    this.serviceFindPage();
  };

  eventSearchValue = (values) => {
    if (values) {
      Object.assign(this.state.search, { ...values, page_index: 1 });
      this.serviceFindPage();
    } else {
      this.eventResetSearch();
    }
  };

  eventResetSearch = () => {
    this.setState({ search: { page_index: 1, page_size: 10 } }, () => {
      this.serviceFindPage();
    });
  };

  serviceFindObjectValue = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: modelFindObject,
      payload: id,
    });
    this.setState({ id: id, editStatus: true });
  };

  eventOpenDetailModalWindow = () => {
    this.setState({ visible: true });
  };

  eventOpenDetailByEdit = (id) => {
    this.serviceFindObjectValue(id);
    this.eventOpenDetailModalWindow();
  };

  eventOpenDetailByView = (id) => {
    this.serviceFindObjectValue(id);
    this.eventOpenDetailModalWindow();
    this.setState({ disabled: true });
  };

  eventSelectedRowKeys = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  serviceBatchDelete = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: modelBatchDelete,
      payload: id ? [id] : this.state.selectedRowKeys,
    }).then((res) => {
      if (res === 1) {
        this.serviceFindPage();
      }
    });
  };

  eventSubmitOk = (data) => {
    const {
      roleToNamespace: { defaultValue },
    } = this.props;
    if (defaultValue.id) {
      this.props
        .dispatch({
          type: modelUpdate,
          payload: { ...data, id: defaultValue.id },
        })
        .then((res) => {
          if (res === 1) {
            this.eventSubmitCancel();
            this.serviceFindPage();
          }
        });
    } else {
      this.props
        .dispatch({
          type: modelAdd,
          payload: data,
        })
        .then((res) => {
          if (res === 1) {
            this.eventSubmitCancel();
            this.serviceFindPage();
          }
        });
    }
  };

  eventSubmitCancel = () => {
    this.props.dispatch({
      type: modelClearDefaultValue,
    });
    this.setState({ visible: false, id: undefined, editStatus: false }, () => {
      this.setState({ disabled: undefined });
    });
  };

  /*======================================================页面 JS 方法 end======================================================*/

  /*======================================================页面布局 start======================================================*/

  render() {
    /* ===========================表格列属性值 start=========================== */

    const columns = [
      { title: 'id', dataIndex: 'id' },
      { title: 'I角色名称', dataIndex: 'role_name' },
      { title: '角色描述', dataIndex: 'role_introduce' },
      {
        title: '创建时间',
        dataIndex: 'create_date',
        render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '操作',
        width: 180,
        dataIndex: 'cz',
        render: (text, record) => (
          <span>
            <a onClick={() => this.eventOpenDetailByEdit(record.id)}>修改</a>
            <Divider type="vertical" />
            <a onClick={() => this.eventOpenDetailByView(record.id)}>详情</a>
            <Divider type="vertical" />
            <Popconfirm
              title={'确认删除'}
              okText="确认"
              cancelText="取消"
              onConfirm={() => this.serviceBatchDelete(record.id)}
            >
              <a>删除</a>
            </Popconfirm>
          </span>
        ),
      },
    ];

    /* ===========================表格列属性值 end=========================== */

    const {
      roleToNamespace: { tableData, defaultValue },
      pageLoading,
      detailLoading,
      updateLoading,
      addLoading,
      batchDeleteLoading,
    } = this.props;
    const { editStatus } = this.state;

    return (
      <ConfigProvider locale={zhCN}>
        <div style={{ margin: 20 }}>
          {/* ===========================新增/编辑模态窗口 start=========================== */}
          <NewForm
            visible={this.state.visible}
            onCancel={this.eventSubmitCancel}
            onOk={this.eventSubmitOk}
            detailLoading={editStatus ? detailLoading : false}
            submitLoading={updateLoading || addLoading}
            defaultValue={defaultValue}
            disabled={this.state.disabled}
            options={[
              {
                rule: { required: true, whitespace: true, max: 10, min: 2 },
                name: 'II角色名称',
                id: 'role_name',
                type: 'input',
              },
              {
                rule: { required: false },
                name: '角色描述',
                id: 'role_introduce',
                type: 'textarea',
              },
            ]}
          />
          {/* ===========================新增/编辑模态窗口 end=========================== */}

          {/* ===========================搜索区 start=========================== */}
          <Card>
            <Search
              row={4}
              searchLoading={pageLoading}
              getSearchValue={this.eventSearchValue}
              options={[
                { key: '1', id: 'id', type: 'input', name: 'id' },
                {
                  key: '2',
                  id: 'role_name',
                  type: 'select',
                  name: 'III角色名称',
                  options: [
                    { key: 'admin', value: '管理员' },
                    { key: 'ordinary', value: '普通人员' },
                  ],
                },
                {
                  key: '3',
                  id: 'create_date',
                  type: 'rangeDate',
                  name: '创建时间',
                  format: 'YYYY-MM-DD',
                },
                { key: '4', id: 'birthday_date', type: 'date', name: '生日', format: 'YYYY-MM-DD' },
              ]}
            />
          </Card>
          {/* ===========================搜索区 end=========================== */}

          {/* ===========================表格数据区 start=========================== */}
          <Card style={{ marginTop: 20 }}>
            <Row>
              <Button onClick={() => this.setState({ visible: true })} type="primary">
                新建
              </Button>
              <span style={{ padding: 5 }} />
              <Button
                loading={batchDeleteLoading}
                onClick={() => this.serviceBatchDelete(undefined)}
                style={{
                  display: this.state.selectedRowKeys.length !== 0 ? 'inline-block' : 'none',
                }}
              >
                批量删除这{this.state.selectedRowKeys.length}条
              </Button>
            </Row>
            <Row style={{ marginTop: 5, minHeight: '100%' }}>
              <Table
                bordered
                size="default"
                onShowSizeChange={this.eventShowSizeChange}
                pageChange={this.eventPageChange}
                selectedRowKeys={this.eventSelectedRowKeys}
                dataSource={tableData}
                loading={pageLoading}
                columns={columns}
              />
            </Row>
          </Card>
          {/* ===========================表格数据区 end=========================== */}
        </div>
      </ConfigProvider>
    );
  }

  /* ======================================================页面布局 end====================================================== */
}

Index.propTypes = {};
export default Index;
