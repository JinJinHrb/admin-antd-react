import React, { Component } from 'react';
import { Menu, Spin } from 'antd';
import { Link } from 'umi';
import { getMenu } from '../common/menu';
import _L from 'lodash';
import { getDynamicIcon } from '../component/DynamicIcon/dynamicIcon';

const SubMenu = Menu.SubMenu;

class Side extends Component {
  state = {
    loading: false,
    menu: [],
  };
  onSelect = ({ key }) => {
    this.props.onSelect(key);
  };
  onOpenChange = (e) => {
    this.props.onOpenChange(e[1]);
  };

  UNSAFE_componentWillMount() {
    this.setState({ loading: true });

    if (sessionStorage.getItem('selectedKeys')) {
      this.onSelect({ key: sessionStorage.getItem('selectedKeys') });
    }
    getMenu((res) => {
      if (!res) {
        res = [];
      }

      const selectKey = sessionStorage.getItem('selectedKeys');
      const recursive = (data, name) => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].children) {
            recursive(data[i], data[i].name);
          }
          if (data[i].path === selectKey) {
            this.onOpenChange(['', name]);
          }
        }
      };

      for (let i = 0; i < res.length; i++) {
        if (res[i].children) {
          recursive(res[i].children, res[i].name);
        }
      }
      this.setState({ menu: res, loading: false });
    });
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    const { openKeys, selectedKeys } = this.props;
    const { menu, loading } = this.state;
    sessionStorage.setItem('selectedKeys', selectedKeys);
    return (
      <Spin spinning={loading} tip="菜 单 加 载 中 ...">
        <Menu
          onClick={this.onSelect}
          onOpenChange={this.onOpenChange}
          mode="inline"
          theme="dark"
          openKeys={[openKeys]}
          selectedKeys={[selectedKeys]}
          style={{ minHeight: 400 }}
        >
          {menu && menu.map((item) => (item.children ? SubMenuItem(item) : MenuItem(item)))}
        </Menu>
      </Spin>
    );
  }
}

const MenuItem = (data) => {
  const icon = _L.trim(data.icon);
  const iconKey = icon ? _L.upperFirst(_L.camelCase(icon)) + 'Outlined' : '';
  const DynamicIcon = getDynamicIcon(iconKey);
  return (
    <Menu.Item key={data.path}>
      <Link to={data.path}>
        <DynamicIcon type={iconKey} />
        <span>{data.name}</span>
      </Link>
    </Menu.Item>
  );
};

const SubMenuItem = (data) => {
  const icon = _L.trim(data.icon);
  const iconKey = icon ? _L.upperFirst(_L.camelCase(icon)) + 'Outlined' : '';
  const DynamicIcon = getDynamicIcon(iconKey);
  return (
    <SubMenu
      key={data.name}
      title={
        <span>
          <DynamicIcon type={iconKey} />
          <span>{data.name}</span>
        </span>
      }
    >
      {data.children &&
        data.children.map((item) => (
          <Menu.Item key={item.path}>
            <Link to={item.path}>{item.name}</Link>
          </Menu.Item>
        ))}
    </SubMenu>
  );
};

export default Side;
