import React, { Component, Fragment } from 'react';
import { Card, Row, Col, Tree } from 'antd';
import { connect } from 'dva';
// import PropTypes from 'prop-types';
import _L from 'lodash';
import rclUtil from '../../util/rclUtil';

/* TreeNode deprecated
const { TreeNode } = Tree; */

@connect(({ rightManage, loading }) => ({
  rightManage,
}))
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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

  UNSAFE_componentWillReceiveProps(nextProps) {}

  componentWillUpdate(nextProps, nextState) {}

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  /* TreeNode deprecated
  renderAllAuthority = (allAuthority) => allAuthority.map((item) => {
    if (item.children) {
      return (
        <TreeNode title={item.permission_name} key={item.permission_code} dataRef={item}>
          {this.renderAllAuthority(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode title={item.permission_name} key={item.permission_code} />;
  }); */

  allAuthorityExpand = (refKeys, expandedKeys) => {
    const treeInfo = this.state.treeInfo || {};
    const refKeys1 = rclUtil.deepClone(refKeys);
    refKeys1.push('expandedKeys');
    rclUtil.setDeepVal(treeInfo, refKeys1, expandedKeys);
    const refKeys2 = rclUtil.deepClone(refKeys);
    refKeys2.push('autoExpandParent');
    rclUtil.setDeepVal(treeInfo, refKeys2, false);
    this.setState({ treeInfo });
  };

  allAuthorityCheck = (refKeys, checkedKeys) => {
    const treeInfo = this.state.treeInfo || {};
    const refKeys1 = rclUtil.deepClone(refKeys);
    refKeys1.push('checkedKeys');
    rclUtil.setDeepVal(treeInfo, refKeys1, checkedKeys);
    this.setState(treeInfo);
  };

  cvtFn(el) {
    const rtn = {};
    rtn.title = _L.trim(rclUtil.getDeepVal(el, 'permission_name'));
    rtn.key = _L.trim(rclUtil.getDeepVal(el, 'permission_code'));
    return rtn;
  }

  render() {
    const {
      rightManage: { allAuthority },
    } = this.props;
    const treeDataArr = (allAuthority.result || [])
      .map((el) => rclUtil.copyTreeStructure(el, this.cvtFn))
      .map((el) => [el]);
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
              {/* TreeNode deprecated
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
              </Tree> */}
              {treeDataArr.map((treeData, treeIndex) => {
                const expandedKeys =
                  rclUtil.getDeepVal(this.state, ['treeInfo', treeIndex, 'expandedKeys']) || [];
                const checkedKeys =
                  rclUtil.getDeepVal(this.state, ['treeInfo', treeIndex, 'checkedKeys']) || [];
                const autoExpandParent =
                  rclUtil.getDeepVal(this.state, ['treeInfo', treeIndex, 'autoExpandParent']) || [];
                return (
                  <Tree
                    key={`tree${treeIndex}`}
                    checkable
                    defaultExpandAll
                    onExpand={this.allAuthorityExpand.bind(this, [treeIndex])}
                    onCheck={this.allAuthorityCheck.bind(this, [treeIndex])}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    checkedKeys={checkedKeys}
                    treeData={treeData}
                  />
                );
              })}
            </Card>
          </Col>
        </Row>
      </Fragment>
    );
  }
}

Index.propTypes = {};

export default Index;
