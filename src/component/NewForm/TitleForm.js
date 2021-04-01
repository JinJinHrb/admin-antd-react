import React, { Component } from 'react';
import { Modal, Form, Button, Input } from 'antd';
import styles from './titleStyles.less';

const FormItem = Form.Item;

// class ComponentName extends Component {
class TitleForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  UNSAFE_componentWillMount() {}

  componentDidMount() {}

  UNSAFE_componentWillReceiveProps() {}

  componentWillUnmount() {}

  submit = () => {};

  render() {
    const { visible, onCancel, options, form } = this.props;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    return (
      <Modal
        visible={visible}
        destroyOnClose
        maskClosable={false}
        style={{ top: 20 }}
        width={1024}
        closable={false}
        onOk={this.submit}
        onCancel={onCancel}
        footer={[
          <Button key="1" onClick={onCancel}>
            取消
          </Button>,
          <Button key="2" type="primary" onClick={this.submit}>
            确定
          </Button>,
        ]}
      >
        <Form>
          {options &&
            options.map((item, index) => {
              const key = index;
              return (
                <div key={key}>
                  <h2 className={styles.title}>{item.title}</h2>
                  {item.option.map((data) => {
                    return data.type === 'input' ? (
                      <FormItem
                        name={data.id}
                        {...formItemLayout}
                        key={data.key}
                        style={{ display: 'inline-block', width: '49%' }}
                        label={data.name}
                      >
                        <Input />
                      </FormItem>
                    ) : data.type === 'select' ? (
                      <FormItem
                        name={data.id}
                        {...formItemLayout}
                        key={data.key}
                        style={{ display: 'inline-block', width: '49%' }}
                        label={data.name}
                      >
                        <Input />
                      </FormItem>
                    ) : (
                      ''
                    );
                  })}
                </div>
              );
            })}
        </Form>
      </Modal>
    );
  }
}

// const TitleForm = Form.create()(ComponentName);
export default TitleForm;
