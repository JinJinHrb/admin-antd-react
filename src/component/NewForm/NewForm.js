import React, { Component } from 'react';
import { Modal, Form, Button, Upload, Spin } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons/CloudUploadOutlined';

import {
  ItemInput,
  ItemTextArea,
  ItemDate,
  ItemSelect,
  ItemNumber,
  ItemRangeDate,
  ItemCascader,
  ItemCheckBox,
  ItemRadio,
  ItemSwitch,
} from '../../component/FormItemComponent';

const FormItem = Form.Item;

let tag = true;

// class ComponentName extends Component {
class ModalForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
    };
  }

  formRef = React.createRef();

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.visible === false) {
      tag = true;
      this.setState({ fileList: [] });
    }
    if (nextProps.defaultValue && nextProps.defaultValue.images && tag === true) {
      this.setState({ fileList: nextProps.defaultValue.images });
      tag = false;
    }
  }

  componentWillUnmount() {}

  onSubmit = (e) => {
    e.preventDefault();
    this.formRef.current.validateFields().then((values) => {
      let { defaultValue, options } = this.props;
      options.forEach((item) => {
        if (item.type === 'date') {
          if (values[item.id]) {
            values[item.id] = values[item.id].format('YYYY-MM-DD HH:mm:ss');
          }
        }
        if (item.type === 'rangeDate') {
          if (values[item.id]) {
            let rangeDate = [
              values[item.id][0].format('YYYY-MM-DD HH:mm:ss'),
              values[item.id][1].format('YYYY-MM-DD HH:mm:ss'),
            ];
            values[item.id] = rangeDate.join(',');
          }
        }
        if (item.type === 'cascader' || item.type === 'checkbox') {
          if (values[item.id]) {
            values[item.id] = values[item.id].join(',');
          }
        }
        if (item.type === 'uploadImg') {
          if (values[item.id]) {
            if (values[item.id].fileList) {
              let arr = [];
              let fileList = values[item.id].fileList;
              fileList.forEach((data) => {
                arr.push(data.response.images[0].id);
              });
              values[item.id] = arr.join(',');
            } else {
              values[item.id] = values[item.id];
            }
          }
        }
      });
      if (this.props.defaultValue) {
        values['id'] = defaultValue.id;
      }
      this.props.onOk(values);
    });
  };
  imageChange = ({ fileList }) => this.setState({ fileList });
  clear = () => {
    this.formRef.current.resetFields();
  };

  render() {
    const { onSubmit } = this;
    const {
      title,
      visible,
      onCancel,
      options,
      defaultValue,
      disabled,
      detailLoading,
      submitLoading,
    } = this.props;
    const onPreview = (file) => {
      // window.open(api.target + api.imageShow + file.response.images[0].uri);
    };
    return (
      <Modal
        onClose={this.clear}
        title={title ? title : null}
        centered
        visible={visible}
        onCancel={onCancel}
        maskClosable={false}
        footer={[
          <Button key="1" onClick={onCancel} type="default">
            取消
          </Button>,
          !disabled ? (
            <Button loading={submitLoading} key="2" onClick={onSubmit} type="primary">
              确定
            </Button>
          ) : null,
        ]}
      >
        <Spin spinning={detailLoading}>
          <Form layout="vertical" initialValues={defaultValue} ref={this.formRef}>
            {options &&
              options.map((item) => {
                return item.type === 'textarea' ? (
                  <ItemTextArea
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    rule={item.rule}
                    defaultValue={defaultValue}
                    disabled={disabled}
                  />
                ) : item.type === 'date' ? (
                  <ItemDate
                    key={item.id}
                    id={item.id}
                    rule={item.rule}
                    name={item.name}
                    defaultValue={defaultValue}
                    disabled={disabled}
                  />
                ) : item.type === 'input' ? (
                  <ItemInput
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    rule={item.rule}
                    defaultValue={defaultValue}
                    disabled={disabled}
                  />
                ) : item.type === 'numberInput' ? (
                  <ItemNumber
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    rule={item.rule}
                    defaultValue={defaultValue}
                    disabled={disabled}
                  />
                ) : item.type === 'select' ? (
                  <ItemSelect
                    key={item.id}
                    id={item.id}
                    options={item.options}
                    name={item.name}
                    rule={item.rule}
                    defaultValue={defaultValue}
                    disabled={disabled}
                  />
                ) : item.type === 'rangeDate' ? (
                  <ItemRangeDate
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    rule={item.rule}
                    defaultValue={defaultValue}
                    disabled={disabled}
                  />
                ) : item.type === 'cascader' ? (
                  <ItemCascader
                    key={item.id}
                    id={item.id}
                    options={item.options}
                    name={item.name}
                    rule={item.rule}
                    defaultValue={defaultValue}
                    disabled={disabled}
                  />
                ) : item.type === 'checkbox' ? (
                  <ItemCheckBox
                    key={item.id}
                    id={item.id}
                    options={item.options}
                    name={item.name}
                    rule={item.rule}
                    defaultValue={defaultValue}
                    disabled={disabled}
                  />
                ) : item.type === 'radio' ? (
                  <ItemRadio
                    key={item.id}
                    id={item.id}
                    options={item.options}
                    name={item.name}
                    rule={item.rule}
                    defaultValue={defaultValue}
                    disabled={disabled}
                  />
                ) : item.type === 'switch' ? (
                  <ItemSwitch
                    key={item.id}
                    id={item.id}
                    text={item.text}
                    name={item.name}
                    rule={item.rule}
                    defaultValue={defaultValue}
                    disabled={disabled}
                  />
                ) : item.type === 'uploadImg' ? (
                  <FormItem
                    name={item.id}
                    key={item.key}
                    label={item.name}
                    rules={[{ required: item.required, message: '必填项未填' }]}
                  >
                    <Upload
                      // action={api.target + api.imageUpload}
                      listType="picture"
                      className={item.inline ? 'upload-list-inline' : ''}
                      fileList={this.state.fileList}
                      disabled={disabled}
                      onChange={this.imageChange}
                      onPreview={onPreview}
                      multiple={!!item.multiple}
                    >
                      <Button
                        disabled={
                          disabled
                            ? true
                            : item.length
                            ? this.state.fileList.length >= item.length
                            : this.state.fileList.length >= 1
                        }
                        icon={<CloudUploadOutlined />}
                      >
                        上传
                      </Button>
                    </Upload>
                  </FormItem>
                ) : (
                  ''
                );
              })}
          </Form>
        </Spin>
      </Modal>
    );
  }
}

// const ModalForm = Form.create()(ComponentName);
export default ModalForm;
