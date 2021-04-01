import React, { Component } from 'react';
import { Layout, Dropdown, Avatar, Menu, Spin } from 'antd';
import UserOutlined from '@ant-design/icons/UserOutlined';
// import { history } from 'umi';
import { connect } from 'dva';
import RouterTabs from '../component/RouterTabs';
import SideBar from './side';
import styles from './index.css';
import MenuUnfoldOutlined from '@ant-design/icons/MenuUnfoldOutlined';
import MenuFoldOutlined from '@ant-design/icons/MenuFoldOutlined';

const { Header, /* Footer, */ Sider, Content } = Layout;

const UserMenu = (props) => {
  const handleMenuClick = ({ key }) => {
    if (key === '3') {
      sessionStorage.clear();
      props.props.dispatch({
        type: 'logoutToNamespace/platformLogout',
      });
    }
  };
  const menu = (
    <Menu onClick={handleMenuClick} style={{ padding: '5px 10px' }}>
      <Menu.Item key="1">个人中心</Menu.Item>
      <Menu.Item key="2">修改密码</Menu.Item>
      <Menu.Item key="3">退出登录</Menu.Item>
    </Menu>
  );
  return (
    <Dropdown overlay={menu}>
      <Avatar className={styles.avatar} icon={<UserOutlined />} />
    </Dropdown>
  );
};

@connect(({ global, logoutToNamespace, loading }) => ({
  global,
  logoutToNamespace,
  logoutLoding: loading.effects['logoutToNamespace/platformLogout'],
}))
class BasicLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastOpenKey: '',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/getMenu',
    });
  }

  toggleCollapsed = () => {
    const {
      global: { openKeys, collapsed },
    } = this.props;
    this.setState({ lastOpenKey: openKeys });
    this.props.dispatch({
      type: 'global/toggle',
      payload: !collapsed,
    });
    if (collapsed) {
      this.props.dispatch({
        type: 'global/onopen',
        payload: this.state.lastOpenKey,
      });
    } else {
      this.props.dispatch({
        type: 'global/onopen',
        payload: '',
      });
    }
  };

  onSelect = (data) => {
    this.props.dispatch({
      type: 'global/onselect',
      payload: data,
    });
  };

  onOpenChange = (data) => {
    this.props.dispatch({
      type: 'global/onopen',
      payload: data,
    });
  };

  render() {
    const {
      props,
      global: { openKeys, selectedKeys, collapsed },
      logoutLoding,
    } = this.props;
    return (
      <Spin spinning={!!logoutLoding} tip={'退出系统中,请稍等!'}>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider width={256} collapsed={collapsed} collapsedWidth="0">
            <div className={styles.logo}>
              <h2>heh</h2>
            </div>
            <SideBar
              collapsed={this.state.collapsed}
              onSelect={this.onSelect}
              onOpenChange={this.onOpenChange}
              openKeys={openKeys}
              selectedKeys={selectedKeys}
            />
          </Sider>
          <Layout>
            <Header style={{ background: '#FFF', padding: 0 }}>
              {collapsed ? (
                <MenuUnfoldOutlined className={styles.trigger} onClick={this.toggleCollapsed} />
              ) : (
                <MenuFoldOutlined className={styles.trigger} onClick={this.toggleCollapsed} />
              )}
              <UserMenu props={this.props} />
            </Header>
            <Content>
              <RouterTabs />
              {props.children}
            </Content>
            {/* <Footer className={styles.footer}>
              <h3>471867900@qq.com</h3>
            </Footer> */}
          </Layout>
        </Layout>
      </Spin>
    );
  }
}

BasicLayout.propTypes = {};

export default BasicLayout;
