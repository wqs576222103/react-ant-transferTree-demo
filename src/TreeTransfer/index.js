import React from "react";
import { Transfer } from "antd/dist/antd";

import { difference } from "lodash";
import TFTree from "./TFTree";

import { list2Tree } from "./logic";
const TreeTransfer = ({ allKeys, targetKeys, ...restProps }) => {
  return (
    <Transfer
      {...restProps}
      targetKeys={targetKeys}
      dataSource={list2Tree({ list: allKeys })}
      showSearch
      filterOption={(inputValue, item) =>
        item.title.indexOf(inputValue) !== -1
      }
      className="tree-transfer"
    >
      {({ direction, selectedKeys, onItemSelectAll }) => {
        if (direction === "left") {
          return (
            <TFTree
              onItemSelectAll={onItemSelectAll}
              dataKeys={difference(allKeys, targetKeys)}
              selectedKeys={selectedKeys}
            />
          );
        }
        if (direction === "right") {
          return (
            <TFTree
              onItemSelectAll={onItemSelectAll}
              dataKeys={targetKeys}
              selectedKeys={selectedKeys}
            />
          );
        }
      }}
    </Transfer>
  );
};

export default TreeTransfer;
