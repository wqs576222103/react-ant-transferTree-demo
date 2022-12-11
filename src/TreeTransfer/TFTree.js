import React, { useState, useEffect, useMemo } from "react";

import { Tree } from "antd/dist/antd";

import {intersection} from 'lodash'


import { getTreeChildKeysByKey, splitList2Tree } from "./logic";

function LeftTree(props) {
  const { onItemSelectAll, dataKeys, selectedKeys, ...restProps } =
    props;

  const [checkedKeys, setCheckedKeys] = useState([]);

  const treeData = useMemo(() => {
   return  splitList2Tree({
      list: dataKeys,
    });
  }, [dataKeys]);


  useEffect(() => {
    if(selectedKeys) {
        setCheckedKeys(selectedKeys)
    }
  }, [selectedKeys])


 // 在外部transfer左右移动时，取消已经选择的key
  useEffect(() => {
    setCheckedKeys(keys => intersection(keys, dataKeys));
  }, [dataKeys]);

  const onTreeNodeCheck = (checkedKeysValue, info) => {
    const {
      checked,
      selected,
      node: { key },
    } = info;
    const { leafKeys } = getTreeChildKeysByKey({ list: treeData, keys: [key] });
    onItemSelectAll(leafKeys, checked || selected || false);
    setCheckedKeys(checkedKeysValue);
  };

  return (
    <Tree
      showLine
      showIcon={false}
      height={800}
      itemHeight={50}
      checkable
      checkedKeys={checkedKeys}
      onCheck={onTreeNodeCheck}
      onSelect={onTreeNodeCheck}
      treeData={treeData}
      {...restProps}
    ></Tree>
  );
}

export default LeftTree;
