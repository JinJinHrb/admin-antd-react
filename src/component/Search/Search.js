import React, { Component } from 'react';
import { Row, Col, Form, Button, DatePicker } from 'antd';
import { ItemInput, ItemSelect } from '../../component/FormItemComponent';
import styles from './search.less';
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import Loading3QuartersOutlined from '@ant-design/icons/Loading3QuartersOutlined';
import DownOutlined from '@ant-design/icons/DownOutlined';
import UpOutlined from '@ant-design/icons/UpOutlined';
import classNames from 'classnames';

const FormItem = Form.Item;
// const { Option } = Select;
const { RangePicker } = DatePicker;

// class HehTable extends Component {
class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: false,
      reset: false,
    };
  }

  formRef = React.createRef();

  submit = (e) => {
    e.preventDefault();
    this.formRef.current.validateFields().then((values) => {
      const options = this.props.options;
      options &&
        options.forEach((item) => {
          switch (item.type) {
            case 'date':
              if (values[`${item.id}`]) {
                values[`${item.id}`] = values[`${item.id}`].format(
                  item.format || 'YYYY-MM-DD HH:mm:ss'
                );
              }
              break;
            case 'rangeDate':
              if (values[item.id]) {
                const min_create_date = values[item.id][0].valueOf();
                const max_create_date = values[item.id][1].valueOf();
                values[item.id][0] = values[item.id][0].format(
                  item.format || 'YYYY-MM-DD HH:mm:ss'
                );
                values[item.id][1] = values[item.id][1].format(
                  item.format || 'YYYY-MM-DD HH:mm:ss'
                );
                values['min_create_date'] = min_create_date;
                values['max_create_date'] = max_create_date;
              }
              break;
            default:
              break;
          }
        });
      for (let i in values) {
        if (values.hasOwnProperty(i)) {
          if (values[i] === undefined || values[i] === 'created' || values[i] === null) {
            delete values[i];
          }
        }
      }
      this.props.getSearchValue(values);
    });
  };

  reset = () => {
    this.setState({ reset: true });
    this.formRef.current.resetFields(); // WangFan TODO 2021-04-02 19:01:28
    this.props.getSearchValue();
  };

  expand = () => {
    this.setState({ expand: !this.state.expand });
  };

  JudgeWidth = () => {
    const width = document.body.clientWidth;
    if (width >= 1600) return 'xxl';
    if (width >= 1200) return 'xl';
    if (width >= 768) return 'md';
    return 'xs';
  };

  hehInput = (layout, item, index, disabled) => {
    const sizeGrade = { xs: 1, md: 2, xl: 3, xxl: 4 };
    const size = sizeGrade[this.JudgeWidth()];
    return (
      <Col
        xs={24}
        md={12}
        xl={8}
        xxl={6}
        key={item.key}
        style={{
          display: this.state.expand ? 'inline-block' : index + 1 > size ? 'none' : 'inline-block',
        }}
      >
        <ItemInput id={item.id} name={item.name} layout={layout} disabled={disabled} />
      </Col>
    );
  };

  hehSelect = (layout, item, index, disabled) => {
    const sizeGrade = { xs: 1, md: 2, xl: 3, xxl: 4 };
    const size = sizeGrade[this.JudgeWidth()];
    return (
      <Col
        xs={24}
        md={12}
        xl={8}
        xxl={6}
        key={item.key}
        style={{
          display: this.state.expand ? 'inline-block' : index + 1 > size ? 'none' : 'inline-block',
        }}
      >
        <ItemSelect
          id={item.id}
          name={item.name}
          options={item.options}
          layout={layout}
          disabled={disabled}
          rule={{ required: false }}
        />
      </Col>
    );
  };

  hehData = (layout, item, index) => {
    const sizeGrade = { xs: 1, md: 2, xl: 3, xxl: 4 };
    const size = sizeGrade[this.JudgeWidth()];
    return (
      <Col
        xs={24}
        xl={8}
        md={12}
        xxl={6}
        key={item.key}
        style={{
          display: this.state.expand ? 'inline-block' : index + 1 > size ? 'none' : 'inline-block',
        }}
      >
        <FormItem name={item.id} {...layout} label={item.name}>
          <DatePicker placeholder="请选择日期" style={{ width: '100%' }} />
        </FormItem>
      </Col>
    );
  };

  hehRangeData = (layout, item, index) => {
    const sizeGrade = { xs: 1, md: 2, xl: 3, xxl: 4 };
    const size = sizeGrade[this.JudgeWidth()];
    return (
      <Col
        xs={24}
        xl={8}
        md={12}
        xxl={6}
        key={item.key}
        style={{
          display: this.state.expand ? 'inline-block' : index + 1 > size ? 'none' : 'inline-block',
        }}
      >
        <FormItem name={item.id} {...layout} label={item.name}>
          <RangePicker placeholder={['开始时间', '结束时间']} style={{ width: '100%' }} />
        </FormItem>
      </Col>
    );
  };

  render() {
    const { options, searchLoading } = this.props;
    const { expand } = this.state;
    const layout = {
      labelCol: { sm: { span: 6 }, xl: { span: 6 }, xxl: { span: 6 } },
      wrapperCol: { sm: { span: 14 }, xl: { span: 16 }, xxl: { span: 16 } },
    };
    const sizeGrade = { xs: 1, md: 2, xl: 3, xxl: 4 };
    const size = sizeGrade[this.JudgeWidth()];
    const searchClassNames = classNames(styles['search-form']);
    return (
      <Row>
        <Form onFinish={this.submit} ref={this.formRef} className={searchClassNames}>
          {/*组件*/}
          <Row>
            {options &&
              options.map((item, index) => {
                return item.type === 'input'
                  ? this.hehInput(layout, item, index, false)
                  : item.type === 'select'
                  ? this.hehSelect(layout, item, index, false)
                  : item.type === 'date'
                  ? this.hehData(layout, item, index)
                  : item.type === 'rangeDate'
                  ? this.hehRangeData(layout, item, index)
                  : '';
              })}
          </Row>
          {/*按钮组*/}
          <Row>
            <Col span={24} className={styles.btnGroup}>
              <Button
                loading={searchLoading}
                htmlType="submit"
                onClick={this.submit}
                type="primary"
                icon={<SearchOutlined />}
              >
                搜索
              </Button>
              <span> </span>
              <Button onClick={this.reset} icon={<Loading3QuartersOutlined />}>
                重置
              </Button>
              <span> </span>
              <Button
                onClick={this.expand}
                icon={!expand ? <DownOutlined /> : <UpOutlined />}
                style={{ display: options.length > size ? 'inline-block' : 'none' }}
              >
                {!expand ? '展开所有' : '收起所有'}
              </Button>
            </Col>
          </Row>
        </Form>
      </Row>
    );
  }
}

// const Search = Form.create()(HehTable);
export default Search;
