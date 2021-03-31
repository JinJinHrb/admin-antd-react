import React, { Component, Fragment } from 'react';
import { Card, Row, Col, Tree } from 'antd';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import h1 from 'eslint-plugin-jsx-a11y/src/util/implicitRoles/h1';

const { TreeNode } = Tree;

@connect(({rightManage,loading}) => ({
  rightManage,
}))
class Index extends Component {

  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
    }
  }

  getAllAuthority = (dispatch) => {
    dispatch({
      type: 'rightManage/getAllAuthority',
    });
  };

  componentDidMount() {
    const { dispatch } = this.props;
    // 获得全部角色
    this.getAllAuthority(dispatch);
    // 获得全部权限树
  }

  UNSAFE_componentWillReceiveProps(nextProps) {

  }


  componentWillUpdate(nextProps, nextState) {

  }

  componentDidUpdate(prevProps, prevState) {

  }

  componentWillUnmount() {

  }

  renderAllAuthority = (allAuthority) => allAuthority.map((item) => {
    if (item.children) {
      return (
        <TreeNode title={item.permission_name} key={item.permission_code} dataRef={item}>
          {this.renderAllAuthority(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode title={item.permission_name} key={item.permission_code} />;
  });
  allAuthorityExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };
  allAuthorityCheck = (checkedKeys) => {
    this.setState({ checkedKeys });
  };
  render() {
    const { rightManage: { allAuthority } } = this.props;
    return (
      <Fragment>
        <Row>
          <Col span={12}>
            <Card style={{ margin: 30 }}>
              <h1 style={{ textAlign: 'center' }}>所有角色</h1>
            </Card>
          </Col>
          <Col span={12}>
            <Card style={{ margin: 30 }}>
              <h1 style={{ textAlign: 'center' }}>所有权限</h1>
              <Tree
                checkable
                defaultExpandAll
                onExpand={this.allAuthorityExpand}
                onCheck={this.allAuthorityCheck}
                expandedKeys={this.state.expandedKeys}
                autoExpandParent={this.state.autoExpandParent}
                checkedKeys={this.state.checkedKeys}
              >
                {this.renderAllAuthority(allAuthority.result ? allAuthority.result : [])}
              </Tree>

            </Card>
          </Col>
        </Row>
      </Fragment>
    );
  }
}

Index.propTypes = {};

export default Index;
