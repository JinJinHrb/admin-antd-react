import React, { Component } from 'react';
import ReactDom from 'react-dom';
import classNames from 'classnames';
import { connect } from 'dva';
import _L from 'lodash';
import { Tag, Dropdown, Tooltip, Menu } from 'antd';
import styles from './index.less';
import { withRouter } from 'react-router-dom';
import { getMenu } from '../../common/menu';
import DownOutlined from '@ant-design/icons/DownOutlined';

const { SubMenu } = Menu;

@withRouter
@connect(({ global }) => ({ global }))
class RouterTabs extends Component {
  static unListen = null;
  static defaultProps = {
    initialValue: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      currentPageName: [], // 当前路由对应到 pathname
      refsTag: [], // tabs 所有到所有页签
      searchMap: {}, // 每个 页签对应的路由参数
      routerConfig: {},
    };
    this.handleMenuClick = this.handleMenuClick.bind(this);
  }

  // 通过 pathname 获取 pathname 对应到路由描述信息对象
  getTitleByPathname = (pathname) => {
    const { routerConfig } = this.state;
    return routerConfig[pathname] ? routerConfig[pathname] : { name: '暂无标签' };
  };

  UNSAFE_componentWillMount() {
    if (sessionStorage.getItem('refsTag')) {
      this.setState({
        currentPageName: JSON.parse(sessionStorage.getItem('currentPageName')),
        refsTag: JSON.parse(sessionStorage.getItem('refsTag')),
        searchMap: JSON.parse(sessionStorage.getItem('searchMap')),
      });
    }
    getMenu((res) => {
      const newObj = {};
      if (res && res.length !== 0) {
        res.forEach((item) => {
          if (item.children) {
            item.children.forEach((child) => {
              newObj[child.path] = { name: child.name };
            });
          } else {
            newObj[item.path] = { name: item.name };
          }
        });
      }
      this.setState({ routerConfig: newObj });
    });
  }

  componentDidMount() {
    if (this.unListen) {
      this.unListen();
      this.unListen = null;
    }
    // 监听路由切换事件
    this.unListen = this.props.history.listen((_location) => {
      if (this.didUnMounted) {
        return;
      }
      if (this.notListenOnce) {
        this.notListenOnce = false;
        return;
      }
      const { pathname } = _location;
      if (!this.getTitleByPathname(pathname)) {
        this.setState({
          currentPageName: '',
        });
        return;
      }
      const newRefsTag = [...this.state.refsTag];
      const currentPathname = pathname;
      if (newRefsTag.indexOf(currentPathname) === -1) {
        newRefsTag.push(currentPathname);
      }
      this.state.searchMap[pathname] = _location.search;
      this.setState({
        currentPageName: pathname,
        refsTag: newRefsTag,
      });
      // 假如是新的 导航item 添加进来,需要在 添加完成后调用 scrollIntoTags
      clearTimeout(this.tagChangeTimerId);
      this.tagChangeTimerId = setTimeout(() => {
        this.scrollIntoTags(pathname);
      }, 100);
    });
    const { pathname } = this.props.location;
    this.scrollIntoTags(pathname);
  }

  componentWillUnmount() {
    this.didUnMounted = true;
    this.setState = (state, callback) => {
      return;
    };
    if (this.unListen) {
      this.unListen();
      this.unListen = null;
    }
  }

  scrollIntoTags(pathname) {
    let dom;
    try {
      // eslint-disable-next-line react/no-find-dom-node
      dom = ReactDom.findDOMNode(this).querySelector(`[data-key="${pathname}"]`);
      if (dom === null) {
        // 菜单 还没有假如 导航条(横)
      } else {
        // 菜单 已经加入 导航条(横)
        dom.scrollIntoView(false);
      }
    } catch (e) {
      // console.error(e);
    }
  }

  handleClose = (tag) => {
    const { pathname } = this.props.location;
    const { history } = this.props;
    let { currentPageName } = this.state;
    const { searchMap } = this.state;
    const newRefsTag = [...this.state.refsTag.filter((t) => t !== tag)];
    if (currentPageName === tag) {
      currentPageName = this.state.refsTag[this.state.refsTag.indexOf(tag) - 1];
    }
    this.setState({
      currentPageName,
      refsTag: newRefsTag,
    });
    if (pathname !== currentPageName) {
      this.notListenOnce = true;
      history.push({
        pathname: currentPageName,
        search: searchMap[currentPageName],
      });
    }
  };

  handleClickTag = (tag, e) => {
    this.props.dispatch({
      type: 'global/onPathChang',
      payload: tag,
    });
    if (e && e.target.tagName.toLowerCase() === 'i') {
      return;
    }
    if (tag !== this.state.currentPageName) {
      this.props.history.push({
        pathname: tag,
        search: this.state.searchMap[tag]
          ? this.state.searchMap[tag].replace(/from=[^&]+&?/, '')
          : undefined,
      });
    }
  };

  handleMenuClick = (e) => {
    const { routerConfig } = this.state;
    const eKey = e.key;
    let currentPathname = this.props.location.pathname;
    let newRefsTag;
    if (eKey === '1') {
      newRefsTag = ['/'];
      currentPathname = '/';
    } else if (eKey === '2') {
      newRefsTag = [];
      if (currentPathname !== routerConfig.indexPath) {
        newRefsTag.push(currentPathname);
      }
    } else {
      this.handleClickTag(eKey);
      return;
    }
    if (currentPathname !== this.state.currentPageName) {
      this.props.history.push({
        pathname: currentPathname,
        search: this.state.searchMap[currentPathname],
      });
    }
    this.setState({
      refsTag: newRefsTag,
    });
  };

  render() {
    sessionStorage.setItem('currentPageName', JSON.stringify(this.state.currentPageName));
    sessionStorage.setItem('refsTag', JSON.stringify(this.state.refsTag));
    sessionStorage.setItem('searchMap', JSON.stringify(this.state.searchMap));

    const { currentPageName, refsTag, routerConfig } = this.state;
    const { className, style } = this.props;
    const cls = classNames(styles['router-tabs'], className);
    const tags = refsTag.map((pathname, index) => {
      const routeInfo = this.getTitleByPathname(pathname); // 这里假设每个pathname都能获取到指定到页面名称
      if (routeInfo.name !== '暂无标签') {
        let title = routeInfo ? routeInfo.name : '404';
        const isLongTag = title.length > 30;
        const tagElem = (
          <Tag
            key={pathname}
            data-key={pathname}
            className={classNames(styles.tag, { [styles.active]: pathname === currentPageName })}
            onClick={(e) => this.handleClickTag(pathname, e)}
            closable={index !== 0}
            onClose={() => this.handleClose(pathname)}
          >
            <span className={styles.icon} />
            {isLongTag ? `${title.slice(0, 30)}...` : title}
          </Tag>
        );
        return isLongTag ? (
          <Tooltip title={title} key={`tooltip_${pathname}`}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        );
      }
    });
    this.tags = _L.compact(tags);
    /* eslint-disable */
    return (
      <div
        className={cls}
        style={{
          ...style,
          height: '40px',
          maxHeight: '40px',
          lineHeight: '40px',
          marginRight: '-12px',
        }}
      >
        <div
          style={{
            flex: '1',
            height: '40px',
            position: 'relative',
            overflow: 'hidden',
            background: '#f0f0f0',
            padding: '0px 0px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              whiteSpace: 'nowrap',
              width: '100%',
              top: '0px',
              padding: '0px 10px 0px 10px',
              overflowX: 'auto',
            }}
          >
            {this.tags}
          </div>
        </div>
        <div
          style={{
            width: '96px',
            height: '100%',
            background: '#fff',
            boxShadow: '-3px 0 15px 3px rgba(0,0,0,.1)',
          }}
        >
          <Dropdown
            overlay={
              <Menu onClick={this.handleMenuClick}>
                <Menu.Item key="1">关闭所有</Menu.Item>
                <Menu.Item key="2">关闭其他</Menu.Item>
                <SubMenu title="切换标签">
                  {this.tags.map((item) => (
                    <Menu.Item key={item.key}>{item.props.children}</Menu.Item>
                  ))}
                </SubMenu>
              </Menu>
            }
          >
            <Tag size={'small'} color="#2d8cf0" style={{ marginLeft: 12 }}>
              标签选项
              <DownOutlined style={{ marginLeft: 4 }} />
            </Tag>
          </Dropdown>
        </div>
      </div>
    );
  }
}
export default RouterTabs;
