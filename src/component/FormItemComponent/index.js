import React, { PureComponent } from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Cascader,
  Checkbox,
  Radio,
  Switch,
} from 'antd';
// import moment from 'moment';

const FormItem = Form.Item;

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

export class ItemInput extends PureComponent {
  state = {};

  render() {
    const { id, name, layout, disabled, rule } = this.props;
    return (
      <FormItem
        name={id}
        label={name}
        {...layout}
        rules={[
          { required: rule && !!rule.required, message: '必填项未填' },
          { whitespace: rule && !!rule.required, message: '必选时，不允许含有空格' },
          { max: rule && rule.max, message: `不允许超过${rule && rule.max}位` },
          { min: rule && rule.min, message: `不允许小于${rule && rule.min}位` },
        ]}
      >
        {/* 更多规则可以看：https://ant-design.gitee.io/components/form-cn/#%E6%A0%A1%E9%AA%8C%E8%A7%84%E5%88%99 */}
        <Input disabled={disabled} />
      </FormItem>
    );
  }
}

export class ItemTextArea extends PureComponent {
  state = {};

  render() {
    const { id, name, layout, disabled, rule, rows } = this.props;
    return (
      <FormItem
        name={id}
        label={name}
        {...layout}
        rules={[{ required: rule && !!rule.required, message: '必填项未填' }]}
      >
        <TextArea rows={rows} disabled={disabled} />
      </FormItem>
    );
  }
}

ItemTextArea.defaultProps = {
  rows: 4,
};

export class ItemSelect extends PureComponent {
  state = {};

  render() {
    const { id, name, layout, /* defaultValue, */ disabled, rule, options } = this.props;
    return (
      <FormItem
        name={id}
        label={name}
        {...layout}
        rules={[{ required: rule && !!rule.required, message: '必填项未填' }]}
      >
        <Select disabled={disabled}>
          {options &&
            options.map((data, index) => (
              <Option key={index} value={data.id || data.key}>
                {data.name || data.value}
              </Option>
            ))}
        </Select>
      </FormItem>
    );
  }
}

export class ItemDate extends PureComponent {
  state = {};

  render() {
    const { id, name, layout, disabled, rule } = this.props;
    return (
      <FormItem
        name={id}
        label={name}
        {...layout}
        rules={[{ required: rule && !!rule.required, message: '必填项未填' }]}
      >
        <DatePicker style={{ width: '100%' }} placeholder="请选择时间" disabled={disabled} />
      </FormItem>
    );
  }
}

export class ItemNumber extends PureComponent {
  state = {};

  render() {
    const { id, name, layout, disabled, rule } = this.props;
    return (
      <FormItem
        name={id}
        label={name}
        {...layout}
        rules={[{ required: rule && !!rule.required, message: '必填项未填' }]}
      >
        <InputNumber style={{ width: '100%' }} placeholder="请输入数字" disabled={disabled} />
      </FormItem>
    );
  }
}

export class ItemRangeDate extends PureComponent {
  state = {};

  render() {
    const { id, name, layout, disabled, rule } = this.props;
    /* let newDefaultValue = defaultValue[id];
    if (newDefaultValue) {
      newDefaultValue = newDefaultValue.split(',');
      newDefaultValue = [
        moment(parseInt(newDefaultValue[0], 10)),
        moment(parseInt(newDefaultValue[1], 10)),
      ];
    } */
    return (
      <FormItem
        name={id}
        label={name}
        {...layout}
        rules={[{ required: rule && !!rule.required, message: '必填项未填' }]}
      >
        <RangePicker
          style={{ width: '100%' }}
          placeholder={['开始时间', '结束时间']}
          disabled={disabled}
        />
      </FormItem>
    );
  }
}

export class ItemCascader extends PureComponent {
  state = {};

  render() {
    const { id, name, layout, /* form, */ defaultValue, disabled, rule, options } = this.props;
    /* let newDefaultValue = defaultValue[id.trim()];
    if (newDefaultValue) {
      newDefaultValue = newDefaultValue.split(',');
    } */
    return (
      <FormItem
        name={id.trim()}
        label={name}
        {...layout}
        rules={[{ required: rule && !!rule.required, message: '必填项未填' }]}
      >
        <Cascader options={options} style={{ width: '100%' }} placeholder="" disabled={disabled} />
      </FormItem>
    );
  }
}

export class ItemCheckBox extends PureComponent {
  state = {};

  render() {
    const { id, name, layout, disabled, rule, options } = this.props;
    let newOptions = options;
    if (!newOptions[0].label && newOptions[0].key) {
      newOptions.forEach((item) => {
        item.label = item.key;
      });
    }
    /* let newDefaultValue = defaultValue[id.trim()];
    if (newDefaultValue) {
      newDefaultValue = newDefaultValue.split(',');
    } */
    return (
      <FormItem
        name={id.trim()}
        label={name}
        {...layout}
        rules={[{ required: rule && !!rule.required, message: '必填项未填' }]}
      >
        <CheckboxGroup
          options={newOptions}
          style={{ width: '100%' }}
          placeholder=""
          disabled={disabled}
        />
      </FormItem>
    );
  }
}

export class ItemRadio extends PureComponent {
  state = {};

  render() {
    const { id, name, layout, disabled, rule, options } = this.props;
    let newOptions = options;
    if (!newOptions[0].label && newOptions[0].key) {
      newOptions.forEach((item) => {
        item.label = item.key;
      });
    }
    // let newDefaultValue = defaultValue[id.trim()];
    return (
      <FormItem
        name={id}
        label={name}
        {...layout}
        rules={[{ required: rule && !!rule.required, message: '必填项未填' }]}
      >
        <RadioGroup
          options={newOptions}
          style={{ width: '100%' }}
          placeholder=""
          disabled={disabled}
        />
      </FormItem>
    );
  }
}

export class ItemSwitch extends PureComponent {
  state = {};

  render() {
    const { id, name, layout, disabled, rule, text } = this.props;
    return (
      <FormItem
        name={id}
        label={name}
        {...layout}
        rules={[{ required: rule && !!rule.required, message: '必填项未填' }]}
      >
        <Switch
          checkedChildren={text && text[0]}
          unCheckedChildren={text && text[1]}
          placeholder=""
          disabled={disabled}
        />
      </FormItem>
    );
  }
}
