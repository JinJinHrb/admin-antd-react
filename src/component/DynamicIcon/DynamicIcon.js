import loadable from '@loadable/component';

export const getDynamicIcon = (type) =>
  loadable(() =>
    type
      ? import(`@ant-design/icons/es/icons/${type}.js`).catch((err) =>
          import(`@ant-design/icons/es/icons/WarningOutlined.js`)
        )
      : import(`@ant-design/icons/es/icons/WarningOutlined.js`)
  );
