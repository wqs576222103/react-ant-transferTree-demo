import React, { useState, useEffect } from "react";
import TreeTransfer from "./TreeTransfer";

import { generateKeys } from "./TreeTransfer/logic";

import "./App.css";

function App() {
  const [targetKeys, setTargetKeys] = useState([]);
  const [allKeys, setAllKeys] = useState([]);

  useEffect(() => {
    setAllKeys(generateKeys());
  }, []);
  const onChange = (keys) => {
    setTargetKeys(keys);
  };

  return (
    <div>
      <TreeTransfer
        allKeys={allKeys}
        targetKeys={targetKeys}
        onChange={onChange}
      />
    </div>
  );
}

export default App;
