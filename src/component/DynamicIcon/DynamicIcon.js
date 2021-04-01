import loadable from '@loadable/component';

const DynamicIcon = loadable((props) =>
  props.type
    ? import(`@ant-design/icons/es/icons/${props.type}.js`).catch((err) =>
        import(`@ant-design/icons/es/icons/WarningOutlined.js`)
      )
    : null
);

export default DynamicIcon;
